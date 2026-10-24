/**
 * One AI request from end to end (spec Phase 5 §3, §5.2, §8): build the messages from the
 * versioned prompt → call the adapter → validate → retry once with the issues → give what to save.
 * Nothing here imports `db` (ADR-0006): the app saves the `row` of an analysis with
 * `recordAiAnalysis`, and an extraction's facts are only proposals.
 *
 * One request at a time in the whole app (P5): every call goes through the app's single
 * `AiRunner`, which stays busy until the adapter has really answered, also after Hủy.
 */
import { toHex, type CalendarDate, type KycGateState } from '@p2c/domain';
import type { AiAdapter, AiCompleteRequest, AiMessage } from './adapter';
import {
  ANALYSIS_PROMPTS,
  analysisOutcome,
  checkAnalysisAnswer,
  NO_MODEL,
  subjectOf,
  takeAnalysisInput,
  type AnalysisOutcome,
  type AnalysisSubject,
} from './analysis-steps';
import { checkAnswer, nextRetry, type CheckedAnswer } from './attempts';
import { codePointCount, cutCodePoints } from './code-points';
import { AiError, errorDetails, type AiErrorResult } from './errors';
import { buildExtractionInput } from './input';
import type { AiModelId } from './models';
import { connectionCheck } from './prompts/connection';
import { extractionPrompt } from './prompts/extraction';
import {
  AI_ANALYSIS_NO_MODEL,
  AI_OUTPUT_SCHEMAS,
  type AiAnalysisProvider,
  type AiReasoningLevel,
  type AnalysisProfile,
} from './schema';
import type { AiSettings } from './settings';
import {
  filterExtraction,
  validateOutput,
  type ExtractedFact,
  type ValidationIssue,
} from './validator';

type Cancelled = { readonly kind: 'cancelled' };
/** An `AiError` as a result. */
type Failed = AiErrorResult & { readonly kind: 'error' };

// Shared by every call, so frozen: a caller that writes to one cannot change the next (MS-A6).
const CANCELLED: Cancelled = Object.freeze({ kind: 'cancelled' });
const BUSY: Failed = Object.freeze({ kind: 'error', code: 'AI_BUSY' });

// ---- single flight ----------------------------------------------------------

/** What Hủy needs of the DOM `AbortSignal` (`packages/ai` has no DOM types); an `AbortSignal` fits. */
export interface AiAbortSignal {
  readonly aborted: boolean;
  addEventListener(type: 'abort', listener: () => void, options?: { once?: boolean }): void;
  removeEventListener(type: 'abort', listener: () => void): void;
}

export interface AiRunner {
  /** A request is running: every AI button is off. */
  readonly busy: boolean;
  /** Called on each change of `busy`; returns the unsubscribe function. */
  subscribe(listener: () => void): () => void;
  /**
   * Runs `job` unless busy (`AI_BUSY`, `job` not called). Hủy (`signal`) gives `cancelled` at once,
   * but `busy` stays on until `job` settles: the request in Rust runs on (spec §5.2). `busy` turns
   * off however `job` ends: it resolves, rejects, or throws before giving a promise.
   */
  run<R>(job: () => Promise<R>, signal?: AiAbortSignal): Promise<R | Cancelled | Failed>;
}

/**
 * `reportError` gets every error the runner cannot give back to its caller (a listener that throws,
 * a bug of the job after Hủy); the app logs it. Nothing is swallowed.
 */
export function createAiRunner(reportError: (error: unknown) => void): AiRunner {
  let busy = false;
  const listeners = new Set<() => void>();
  // `busy` is set before any listener runs, and one that throws stops neither the others nor `run`.
  const setBusy = (value: boolean) => {
    busy = value;
    for (const listener of listeners) {
      try {
        listener();
      } catch (error) {
        reportError(error);
      }
    }
  };
  return {
    get busy() {
      return busy;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    run<R>(job: () => Promise<R>, signal?: AiAbortSignal) {
      if (busy) return Promise.resolve(BUSY);
      if (signal?.aborted) return Promise.resolve(CANCELLED);
      busy = true;
      // A job that throws before giving a promise rejects `done` too, so `busy` still turns off.
      const done = new Promise<R>((resolve) => resolve(job()));
      let cancel!: (value: Cancelled) => void;
      const aborted = new Promise<Cancelled>((resolve) => (cancel = resolve));
      let cancelled = false;
      const onAbort = () => {
        cancelled = true;
        cancel(CANCELLED);
      };
      signal?.addEventListener('abort', onAbort, { once: true });
      const release = () => {
        signal?.removeEventListener('abort', onAbort);
        setBusy(false);
      };
      done.then(release, (error: unknown) => {
        release();
        // After Hủy the caller has `cancelled` and will never hear of it.
        if (cancelled) reportError(error);
      });
      setBusy(true);
      return Promise.race([done, aborted]);
    },
  };
}

// ---- one conversation ---------------------------------------------------------

interface AiCall {
  readonly runner: AiRunner;
  readonly adapter: AiAdapter;
  readonly settings: AiSettings;
  readonly signal?: AiAbortSignal | undefined;
}

interface Attempt extends CheckedAnswer {
  readonly promptTokens: number | null;
  readonly completionTokens: number | null;
}

/** What `newSessionId` needs of Web Crypto, which the webview and Node have (no DOM types here). */
interface RandomSource {
  getRandomValues(bytes: Uint8Array): Uint8Array;
}

/** 128 random bits in hex; `getRandomValues`, unlike `randomUUID`, needs no secure context. */
function newSessionId(): string {
  const { crypto } = globalThis as unknown as { crypto: RandomSource };
  return toHex(crypto.getRandomValues(new Uint8Array(16)));
}

function completeRequest(
  call: AiCall,
  sessionId: string,
  messages: readonly AiMessage[],
  maxTokens: number,
): AiCompleteRequest {
  const { model, reasoning } = call.settings;
  const effort = reasoning === 'DEFAULT' ? null : reasoning;
  return { sessionId, model, reasoning: effort, messages, maxTokens };
}

/** An `AiError` as a result; anything else is a bug and is thrown on. */
async function attempt<R>(call: () => Promise<R>): Promise<R | Failed> {
  try {
    return await call();
  } catch (error) {
    if (error instanceof AiError) {
      return { kind: 'error', code: error.code, ...errorDetails(error) };
    }
    throw error;
  }
}

/** Rust refuses more characters than this in the `content` of all messages (spec §5.1). */
const MAX_MESSAGE_CHARS = 200_000;

const TOO_LARGE: Failed = { kind: 'error', code: 'AI_TOO_LARGE' };

const charsOf = (messages: readonly AiMessage[]) =>
  messages.reduce((sum, message) => sum + codePointCount(message.content), 0);

/**
 * Asks, and asks again once with the issues when the answer fails `check` (prompts §1, §5), both
 * under one `sessionId`. An error at either attempt ends it with nothing to keep (spec §3 item 3).
 * Messages over the Rust limit are `AI_TOO_LARGE`, never sent (MS-A1): the input, or a retry whose
 * prompt, input and issues leave no room. The wrong answer in a retry is cut to the room left
 * (prompts §1, Owner 11/10/2026); one that fits goes whole.
 */
async function converse(
  call: AiCall,
  prompt: { readonly system: string; readonly maxTokens: number },
  input: unknown,
  check: (content: string, cut: boolean) => CheckedAnswer,
): Promise<Attempt[] | Failed | Cancelled> {
  const asked: AiMessage[] = [
    { role: 'system', content: prompt.system },
    { role: 'user', content: JSON.stringify(input) },
  ];
  if (charsOf(asked) > MAX_MESSAGE_CHARS) return TOO_LARGE;
  let messages = asked;
  const sessionId = newSessionId();
  const attempts: Attempt[] = [];
  for (;;) {
    const answer = await attempt(() =>
      call.adapter.complete(completeRequest(call, sessionId, messages, prompt.maxTokens)),
    );
    // After Hủy the answer is dropped and no retry is sent.
    if (call.signal?.aborted) return CANCELLED;
    if ('kind' in answer) return answer;
    attempts.push({ ...answer, ...check(answer.content, answer.finishReason === 'length') });
    const retry = nextRetry(attempts);
    if (retry === null) return attempts;
    const room = MAX_MESSAGE_CHARS - charsOf(asked) - codePointCount(retry);
    if (room < 0) return TOO_LARGE;
    messages = [
      ...asked,
      { role: 'assistant', content: cutCodePoints(answer.content, room) },
      { role: 'user', content: retry },
    ];
  }
}

// ---- analysis -----------------------------------------------------------------

export interface AnalysisRequest extends AiCall, AnalysisSubject {
  readonly profile: AnalysisProfile;
  readonly today: CalendarDate;
}

/** A row for `recordAiAnalysis` (spec §7.1): all but the id, seq and date `db` gives it. */
export interface AnalysisRow extends AnalysisSubject, AnalysisOutcome {
  readonly provider: AiAnalysisProvider;
  readonly model: AiModelId | null;
  readonly reasoning: AiReasoningLevel | null;
  readonly promptVersion: string;
  readonly promptTokens: number | null;
  readonly completionTokens: number | null;
}

export type AnalysisResult =
  | { readonly kind: 'record'; readonly row: AnalysisRow }
  /** The gate lets no AI through (P2): the adapter is not called. */
  | { readonly kind: 'blocked'; readonly state: KycGateState }
  | Failed
  | Cancelled;

export async function runAnalysis(request: AnalysisRequest): Promise<AnalysisResult> {
  const input = takeAnalysisInput(request.profile, request.today);
  if ('kind' in input) return input;
  const prompt = ANALYSIS_PROMPTS[input.mode];
  return request.runner.run(async () => {
    const attempts = await converse(request, prompt, input, (content, cut) =>
      checkAnalysisAnswer(input, content, cut),
    );
    if ('kind' in attempts) return attempts;
    const { provider, model, reasoning } = request.settings;
    // One attempt without a count makes the total unknown.
    const total = (key: 'promptTokens' | 'completionTokens') => {
      let sum = 0;
      for (const done of attempts) {
        const count = done[key];
        if (count === null) return null;
        sum += count;
      }
      return sum;
    };
    const row: AnalysisRow = {
      ...subjectOf(request),
      ...analysisOutcome(input, attempts),
      provider,
      ...(AI_ANALYSIS_NO_MODEL.includes(provider)
        ? NO_MODEL
        : {
            model,
            reasoning,
            promptTokens: total('promptTokens'),
            completionTokens: total('completionTokens'),
          }),
      promptVersion: prompt.version,
    };
    return { kind: 'record' as const, row };
  }, request.signal);
}

// ---- extraction ---------------------------------------------------------------

export interface ExtractionRequest extends AiCall {
  /** One KYC note as the RE wrote it (spec §8). */
  readonly note: string;
}

export type ExtractionResult =
  /** Proposals for the RE to confirm, never saved (§8); `dropped` failed V7. */
  | {
      readonly kind: 'facts';
      readonly facts: readonly ExtractedFact[];
      readonly dropped: readonly ValidationIssue[];
    }
  /** V1 failed twice: "AI trả kết quả không đọc được" (§8 item 5). */
  | { readonly kind: 'invalid' }
  | Failed
  | Cancelled;

export async function runExtraction(request: ExtractionRequest): Promise<ExtractionResult> {
  const input = buildExtractionInput(request.note);
  return request.runner.run(async () => {
    const attempts = await converse(request, extractionPrompt, input, (content, cut) =>
      checkAnswer(content, (parsed) => validateOutput('extraction', parsed), cut),
    );
    if ('kind' in attempts) return attempts;
    const last = attempts.at(-1)!;
    if (last.issues.length > 0) return { kind: 'invalid' as const };
    const output = AI_OUTPUT_SCHEMAS.extraction.parse(last.parsed);
    const fields = input.fields.map((sent) => sent.field);
    const { kept, dropped } = filterExtraction(output, { note: request.note, fields });
    return { kind: 'facts' as const, facts: kept, dropped };
  }, request.signal);
}

// ---- Kiểm tra kết nối -------------------------------------------------------

export type ConnectionResult = { readonly kind: 'ok' } | Failed | Cancelled;

/** Any answer without an error is a success (prompts §6); nothing is stored or validated. */
export async function checkConnection(call: AiCall): Promise<ConnectionResult> {
  return call.runner.run(async () => {
    const answer = await attempt(() =>
      call.adapter.complete(
        completeRequest(call, newSessionId(), connectionCheck.messages, connectionCheck.maxTokens),
      ),
    );
    return 'kind' in answer ? answer : { kind: 'ok' as const };
  }, call.signal);
}
