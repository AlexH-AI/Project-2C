/**
 * One AI request from end to end (spec Phase 5 §3, §5.2, §8): build the messages from the
 * versioned prompt → call the adapter → validate → retry once with the issues → give what to save.
 * Nothing here imports `db` (ADR-0006): the app saves the `row` of an analysis with
 * `recordAiAnalysis`, and an extraction's facts are only proposals.
 *
 * One request at a time in the whole app (P5): every call goes through the app's single
 * `AiRunner`, which stays busy until the adapter has really answered, also after Hủy.
 */
import { evaluateKycGate, type CalendarDate, type KycGateState } from '@p2c/domain';
import type { AiAdapter, AiCompleteRequest, AiMessage } from './adapter';
import { AiError, type AiErrorCode } from './errors';
import { buildAnalysisInput, buildExtractionInput, type AnalysisProfile } from './input';
import type { AiModelId } from './models';
import { analysisPrompt } from './prompts/analysis';
import { connectionCheck } from './prompts/connection';
import { discoveryPrompt } from './prompts/discovery';
import { extractionPrompt } from './prompts/extraction';
import { checkAnswer, nextRetry, type CheckedAnswer } from './prompts/retry';
import {
  AI_OUTPUT_SCHEMAS,
  type AiAnalysisProvider,
  type AiReasoningLevel,
  type AnalysisInput,
} from './schema';
import type { AiSettings } from './settings';
import {
  filterExtraction,
  validateOutput,
  type ExtractedFact,
  type ValidationIssue,
} from './validator';

type Cancelled = { readonly kind: 'cancelled' };
/** An `AiError` as a result, with what Rust told of a failed HTTP call (Settings → AI shows it). */
type Failed = {
  readonly kind: 'error';
  readonly code: AiErrorCode;
  readonly httpStatus?: number;
  readonly serverMessage?: string;
};

const CANCELLED: Cancelled = { kind: 'cancelled' };
const BUSY: Failed = { kind: 'error', code: 'AI_BUSY' };

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
  readonly promptTokens: number;
  readonly completionTokens: number;
}

/** What `newSessionId` needs of Web Crypto, which the webview and Node have (no DOM types here). */
interface RandomSource {
  getRandomValues(bytes: Uint8Array): Uint8Array;
}

/** 128 random bits in hex; `getRandomValues`, unlike `randomUUID`, needs no secure context. */
function newSessionId(): string {
  const { crypto } = globalThis as unknown as { crypto: RandomSource };
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
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
      const { code, httpStatus, serverMessage } = error;
      return {
        kind: 'error',
        code,
        ...(httpStatus !== undefined && { httpStatus }),
        ...(serverMessage !== undefined && { serverMessage }),
      };
    }
    throw error;
  }
}

/**
 * Asks, and asks again once with the issues when the answer fails `check` (prompts §1, §5), both
 * under one `sessionId`. An error at either attempt ends it with nothing to keep (spec §3 item 3).
 */
async function converse(
  call: AiCall,
  prompt: { readonly system: string; readonly maxTokens: number },
  input: unknown,
  check: (content: string) => CheckedAnswer,
): Promise<Attempt[] | Failed | Cancelled> {
  const asked: AiMessage[] = [
    { role: 'system', content: prompt.system },
    { role: 'user', content: JSON.stringify(input) },
  ];
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
    attempts.push({ ...answer, ...check(answer.content) });
    const retry = nextRetry(attempts);
    if (retry === null) return attempts;
    messages = [
      ...asked,
      { role: 'assistant', content: answer.content },
      { role: 'user', content: retry },
    ];
  }
}

// ---- analysis -----------------------------------------------------------------

export interface AnalysisRequest extends AiCall {
  readonly customerId: string;
  /** The KYC version the profile is at when the RE clicks; the result stays tied to it. */
  readonly kycVersionId: string;
  readonly profile: AnalysisProfile;
  readonly today: CalendarDate;
}

/** A row for `recordAiAnalysis` (spec §7.1): all but the id, seq and date `db` gives it. */
export interface AnalysisRow {
  readonly customerId: string;
  readonly kycVersionId: string;
  readonly mode: AnalysisInput['mode'];
  readonly gateState: 'PAIN_POINT_ANALYSIS' | 'PROFILE_DISCOVERY';
  readonly status: 'ACCEPTED' | 'REJECTED';
  readonly provider: AiAnalysisProvider;
  readonly model: AiModelId | null;
  readonly reasoning: AiReasoningLevel | null;
  readonly promptVersion: string;
  readonly attempts: number;
  readonly input: AnalysisInput;
  readonly output: unknown;
  readonly rawOutput: string | null;
  readonly validator: readonly {
    readonly attempt: number;
    readonly errors: readonly ValidationIssue[];
  }[];
  readonly promptTokens: number | null;
  readonly completionTokens: number | null;
}

export type AnalysisResult =
  | { readonly kind: 'record'; readonly row: AnalysisRow }
  /** The gate lets no AI through (P2): the adapter is not called. */
  | { readonly kind: 'blocked'; readonly state: KycGateState }
  | Failed
  | Cancelled;

/** `raw_output` is cut to this many characters (spec §7.1); a longer paste is refused (§3.1). */
export const MAX_RAW_OUTPUT = 20_000;

/**
 * Stored as `raw_output` when the last wrong answer was empty: `db` takes no empty `raw_output`
 * for a REJECTED row (§7.3 rule 3; review #418).
 */
export const EMPTY_RAW_OUTPUT = '(empty)';

/** The prompt of each mode that keeps a history (G5 §2, §3). */
export const ANALYSIS_PROMPTS = { analysis: analysisPrompt, discovery: discoveryPrompt } as const;

/**
 * The input of an analysis taken from the profile now (spec §3, §6.1), or the gate state when the
 * gate lets no AI through (P2). The AI calls and ChatGPT web (§3.1) take it the same way.
 */
export function takeAnalysisInput(
  profile: AnalysisProfile,
  today: CalendarDate,
): AnalysisInput | { readonly kind: 'blocked'; readonly state: KycGateState } {
  const gate = evaluateKycGate(profile.facts);
  return buildAnalysisInput(profile, gate, today) ?? { kind: 'blocked', state: gate.state };
}

/** Checks an analysis or discovery answer against the input it was given (V1–V6). */
export function checkAnalysisAnswer(input: AnalysisInput, content: string): CheckedAnswer {
  const checked = {
    factCodes: input.facts.map((fact) => fact.code),
    missingCategories: input.missingCategories.map((category) => category.code),
  };
  return checkAnswer(content, (parsed) => validateOutput(input.mode, parsed, checked));
}

/** The fields of an analysis row that its input and answers decide, whoever answered (spec §7.1). */
export type AnalysisOutcome = Pick<
  AnalysisRow,
  'mode' | 'gateState' | 'status' | 'attempts' | 'input' | 'output' | 'rawOutput' | 'validator'
>;

export function analysisOutcome(
  input: AnalysisInput,
  attempts: readonly CheckedAnswer[],
): AnalysisOutcome {
  const { mode } = input;
  const last = attempts.at(-1)!;
  const accepted = last.issues.length === 0;
  return {
    mode,
    gateState: mode === 'analysis' ? 'PAIN_POINT_ANALYSIS' : 'PROFILE_DISCOVERY',
    status: accepted ? 'ACCEPTED' : 'REJECTED',
    attempts: attempts.length,
    input,
    output: accepted ? AI_OUTPUT_SCHEMAS[mode].parse(last.parsed) : last.parsed,
    rawOutput: accepted ? null : rawOutput(last.content),
    validator: attempts.map((done, i) => ({ attempt: i + 1, errors: done.issues })),
  };
}

export async function runAnalysis(request: AnalysisRequest): Promise<AnalysisResult> {
  const input = takeAnalysisInput(request.profile, request.today);
  if ('kind' in input) return input;
  const prompt = ANALYSIS_PROMPTS[input.mode];
  return request.runner.run(async () => {
    const attempts = await converse(request, prompt, input, (content) =>
      checkAnalysisAnswer(input, content),
    );
    if ('kind' in attempts) return attempts;
    const mock = request.settings.provider === 'MOCK';
    const total = (key: 'promptTokens' | 'completionTokens') =>
      mock ? null : attempts.reduce((sum, done) => sum + done[key], 0);
    const row: AnalysisRow = {
      customerId: request.customerId,
      kycVersionId: request.kycVersionId,
      ...analysisOutcome(input, attempts),
      provider: request.settings.provider,
      model: mock ? null : request.settings.model,
      reasoning: mock ? null : request.settings.reasoning,
      promptVersion: prompt.version,
      promptTokens: total('promptTokens'),
      completionTokens: total('completionTokens'),
    };
    return { kind: 'record' as const, row };
  }, request.signal);
}

function rawOutput(content: string): string {
  if (content === '') return EMPTY_RAW_OUTPUT;
  // By code point, as `db` cuts it, so an emoji at the limit is not cut in two.
  return Array.from(content).slice(0, MAX_RAW_OUTPUT).join('');
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
    const attempts = await converse(request, extractionPrompt, input, (content) =>
      checkAnswer(content, (parsed) => validateOutput('extraction', parsed)),
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
