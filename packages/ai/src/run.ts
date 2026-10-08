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
import { extractJson } from './extract-json';
import {
  buildAnalysisInput,
  buildExtractionInput,
  type AnalysisInput,
  type AnalysisProfile,
} from './input';
import type { AiModelId } from './models';
import { analysisPrompt } from './prompts/analysis';
import { connectionCheck } from './prompts/connection';
import { discoveryPrompt } from './prompts/discovery';
import { extractionPrompt } from './prompts/extraction';
import { retryMessage } from './prompts/retry';
import { AI_OUTPUT_SCHEMAS, type AiProvider, type AiReasoningLevel } from './schema';
import {
  filterExtraction,
  validateOutput,
  type ExtractedFact,
  type ValidationIssue,
} from './validator';

/** Settings → AI (spec §4.1); never the key. */
export interface AiSettings {
  readonly provider: AiProvider;
  readonly model: AiModelId;
  readonly reasoning: AiReasoningLevel;
}

type Cancelled = { readonly kind: 'cancelled' };
type Failed = { readonly kind: 'error'; readonly code: AiErrorCode };

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

interface Attempt {
  readonly content: string;
  /** The answer's first JSON block, `null` when it has none. */
  readonly parsed: unknown;
  readonly issues: readonly ValidationIssue[];
  readonly promptTokens: number;
  readonly completionTokens: number;
}

function completeRequest(
  call: AiCall,
  messages: readonly AiMessage[],
  maxTokens: number,
): AiCompleteRequest {
  const { model, reasoning } = call.settings;
  return { model, reasoning: reasoning === 'DEFAULT' ? null : reasoning, messages, maxTokens };
}

/** An `AiError` as a result; anything else is a bug and is thrown on. */
async function attempt<R>(call: () => Promise<R>): Promise<R | Failed> {
  try {
    return await call();
  } catch (error) {
    if (error instanceof AiError) return { kind: 'error', code: error.code };
    throw error;
  }
}

/**
 * Asks, and asks again once with the issues when the answer fails `check` (prompts §1, §5). An
 * error at either attempt ends it with nothing to keep (spec §3 item 3).
 */
async function converse(
  call: AiCall,
  prompt: { readonly system: string; readonly maxTokens: number },
  input: unknown,
  check: (parsed: unknown) => ValidationIssue[],
): Promise<Attempt[] | Failed | Cancelled> {
  let messages: AiMessage[] = [
    { role: 'system', content: prompt.system },
    { role: 'user', content: JSON.stringify(input) },
  ];
  const attempts: Attempt[] = [];
  while (attempts.length < 2) {
    const answer = await attempt(() =>
      call.adapter.complete(completeRequest(call, messages, prompt.maxTokens)),
    );
    // After Hủy the answer is dropped and no retry is sent.
    if (call.signal?.aborted) return CANCELLED;
    if ('kind' in answer) return answer;
    const json = extractJson(answer.content);
    const parsed = json.found ? json.value : null;
    const issues = check(parsed);
    attempts.push({ ...answer, parsed, issues });
    if (issues.length === 0) break;
    messages = [
      ...messages.slice(0, 2),
      { role: 'assistant', content: answer.content },
      { role: 'user', content: retryMessage(issues) },
    ];
  }
  return attempts;
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
  readonly provider: AiProvider;
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

/** `raw_output` is cut to this many characters (spec §7.1). */
const MAX_RAW_OUTPUT = 20_000;

/**
 * Stored as `raw_output` when the last wrong answer was empty: `db` takes no empty `raw_output`
 * for a REJECTED row (§7.3 rule 3; review #418).
 */
export const EMPTY_RAW_OUTPUT = '(empty)';

const ANALYSIS_PROMPTS = { analysis: analysisPrompt, discovery: discoveryPrompt } as const;

export async function runAnalysis(request: AnalysisRequest): Promise<AnalysisResult> {
  const gate = evaluateKycGate(request.profile.facts);
  const input = buildAnalysisInput(request.profile, gate, request.today);
  if (input === null) return { kind: 'blocked', state: gate.state };
  const { mode } = input;
  const prompt = ANALYSIS_PROMPTS[mode];
  const checked = {
    factCodes: input.facts.map((fact) => fact.code),
    missingCategories: input.missingCategories.map((category) => category.code),
  };
  return request.runner.run(async () => {
    const attempts = await converse(request, prompt, input, (parsed) =>
      validateOutput(mode, parsed, checked),
    );
    if ('kind' in attempts) return attempts;
    const last = attempts.at(-1)!;
    const accepted = last.issues.length === 0;
    const mock = request.settings.provider === 'MOCK';
    const total = (key: 'promptTokens' | 'completionTokens') =>
      mock ? null : attempts.reduce((sum, done) => sum + done[key], 0);
    const row: AnalysisRow = {
      customerId: request.customerId,
      kycVersionId: request.kycVersionId,
      mode,
      gateState: mode === 'analysis' ? 'PAIN_POINT_ANALYSIS' : 'PROFILE_DISCOVERY',
      status: accepted ? 'ACCEPTED' : 'REJECTED',
      provider: request.settings.provider,
      model: mock ? null : request.settings.model,
      reasoning: mock ? null : request.settings.reasoning,
      promptVersion: prompt.version,
      attempts: attempts.length,
      input,
      output: accepted ? AI_OUTPUT_SCHEMAS[mode].parse(last.parsed) : last.parsed,
      rawOutput: accepted ? null : rawOutput(last.content),
      validator: attempts.map((done, i) => ({ attempt: i + 1, errors: done.issues })),
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
    const attempts = await converse(request, extractionPrompt, input, (parsed) =>
      validateOutput('extraction', parsed),
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
        completeRequest(call, connectionCheck.messages, connectionCheck.maxTokens),
      ),
    );
    return 'kind' in answer ? answer : { kind: 'ok' as const };
  }, call.signal);
}
