/**
 * Analysis through ChatGPT web, by hand (spec Phase 5 §3.1, P7): the app builds one message for the
 * user to paste into chatgpt.com, then checks each answer the user pastes back as it checks a model's
 * (first JSON block, V1–V6), with the same attempts and retry message as the AI calls
 * (`prompts/retry.ts`). Nothing here calls the network: no adapter, no `AiRunner` (§3.1 item 5).
 * The session is a value the panel keeps; it is never stored (item 4).
 */
import type { CalendarDate, KycGateState } from '@p2c/domain';
import type { AnalysisInput, AnalysisProfile } from './input';
import { MAX_ATTEMPTS, nextRetry, type CheckedAnswer } from './prompts/retry';
import {
  ANALYSIS_PROMPTS,
  analysisOutcome,
  checkAnalysisAnswer,
  MAX_RAW_OUTPUT,
  takeAnalysisInput,
  type AnalysisRow,
} from './run';
import type { ValidationIssue } from './validator';

/**
 * The `web@1` wrapper (prompts G5 §6a, Owner 08/10/2026), word for word from
 * `docs/design/phase-5-prompts.md`; changing a word is `web@2` through G5.
 */
export const WEB_WRAPPER = {
  version: 'web@1',
  template: `Tin nhắn này có hai phần. Phần HƯỚNG DẪN là chỉ dẫn cho toàn bộ cuộc trò chuyện; phần ĐẦU VÀO chính là khối JSON mà hướng dẫn gọi là "tin nhắn tiếp theo". Chỉ dùng thông tin trong ĐẦU VÀO: không tìm kiếm web, không dùng nguồn bên ngoài, không dùng thông tin từ các cuộc trò chuyện khác. Chỉ trả lời bằng đúng một khối JSON theo định dạng trong hướng dẫn, không thêm lời giải thích.

=== HƯỚNG DẪN ===
{prompt}

=== ĐẦU VÀO ===
{input}`,
} as const;

/** The message to paste: the mode prompt and the input JSON (as sent to OpenCode) in the wrapper. */
export function buildWebMessage(input: AnalysisInput): string {
  const parts = { prompt: ANALYSIS_PROMPTS[input.mode].system, input: JSON.stringify(input) };
  // One pass, so a `{input}` in the prompt or a `$` anywhere is left as it is.
  return WEB_WRAPPER.template.replace(
    /\{(prompt|input)\}/g,
    (_, key: keyof typeof parts) => parts[key],
  );
}

/** One customer's ChatGPT web analysis, from the click to the row to record. */
export interface WebSession {
  readonly customerId: string;
  /** The KYC version the input was taken from; the result stays tied to it (§3.1 item 6). */
  readonly kycVersionId: string;
  readonly input: AnalysisInput;
  /** The pastes checked so far, all wrong: none before the first one. */
  readonly attempts: readonly CheckedAnswer[];
}

export interface WebAnalysisRequest {
  readonly customerId: string;
  readonly kycVersionId: string;
  readonly profile: AnalysisProfile;
  readonly today: CalendarDate;
}

export type WebStart =
  | { readonly kind: 'session'; readonly session: WebSession; readonly message: string }
  /** The gate lets no AI through (P2), as for the Phân tích button. */
  | { readonly kind: 'blocked'; readonly state: KycGateState };

/** Takes the input now (§3.1) and gives the message to copy. */
export function startWebAnalysis(request: WebAnalysisRequest): WebStart {
  const input = takeAnalysisInput(request.profile, request.today);
  if ('kind' in input) return input;
  const { customerId, kycVersionId } = request;
  return {
    kind: 'session',
    session: { customerId, kycVersionId, input, attempts: [] },
    message: buildWebMessage(input),
  };
}

export type WebAnswerResult =
  /**
   * Not an attempt (§3.1 item 3): the paste is blank, or longer than `MAX_RAW_OUTPUT` characters
   * (by code point, as `raw_output` is cut).
   */
  | { readonly kind: 'unusable'; readonly reason: 'EMPTY' | 'TOO_LONG' }
  /** The first paste is wrong: show the issues; "Copy yêu cầu sửa" copies `retryMessage` (G5 §5). */
  | {
      readonly kind: 'retry';
      readonly session: WebSession;
      readonly issues: readonly ValidationIssue[];
      readonly retryMessage: string;
    }
  /** Accepted, or rejected after the second wrong paste: the row for `recordAiAnalysis`. */
  | { readonly kind: 'record'; readonly row: AnalysisRow };

/** Checks one pasted answer; `session` is left as it was. */
export function checkWebAnswer(session: WebSession, pasted: string): WebAnswerResult {
  if (session.attempts.length >= MAX_ATTEMPTS) throw new RangeError('The web session is over');
  if (pasted.trim() === '') return { kind: 'unusable', reason: 'EMPTY' };
  if (Array.from(pasted).length > MAX_RAW_OUTPUT) return { kind: 'unusable', reason: 'TOO_LONG' };
  const attempts = [...session.attempts, checkAnalysisAnswer(session.input, pasted)];
  const retry = nextRetry(attempts);
  if (retry !== null) {
    const { issues } = attempts.at(-1)!;
    return { kind: 'retry', session: { ...session, attempts }, issues, retryMessage: retry };
  }
  const { customerId, kycVersionId, input } = session;
  const row: AnalysisRow = {
    customerId,
    kycVersionId,
    ...analysisOutcome(input, attempts),
    provider: 'CHATGPT_WEB',
    model: null,
    reasoning: null,
    promptVersion: `${ANALYSIS_PROMPTS[input.mode].version}+${WEB_WRAPPER.version}`,
    promptTokens: null,
    completionTokens: null,
  };
  return { kind: 'record', row };
}
