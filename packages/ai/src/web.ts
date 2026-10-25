/**
 * Analysis through ChatGPT web, by hand (spec Phase 5 §3.1, P7): the app builds one message for the
 * user to paste into chatgpt.com, then checks each answer the user pastes back as it checks a model's
 * (first JSON block, V1–V6), with the same attempts and retry message as the AI calls
 * (`attempts.ts`). Nothing here calls the network: no adapter, no `AiRunner` (§3.1 item 5).
 * The session is a value the panel keeps; it is never stored (item 4).
 */
import { LINE_BREAK, type CalendarDate, type KycGateState } from '@p2c/domain';
import {
  ANALYSIS_PROMPTS,
  analysisOutcome,
  checkAnalysisAnswer,
  NO_MODEL,
  subjectOf,
  takeAnalysisInput,
  type AnalysisSubject,
} from './analysis-steps';
import { MAX_ATTEMPTS, nextRetry, type CheckedAnswer } from './attempts';
import { codePointsOver } from './code-points';
import { RETRY_TEMPLATE } from './prompts/retry';
import type { AnalysisRow } from './run';
import { MAX_AI_RAW_OUTPUT, type AnalysisInput, type AnalysisProfile } from './schema';
import { cleanText } from './text-match';
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

/** The `prompt_version` of a ChatGPT web analysis (§7.1): the mode's prompt, then the wrapper's. */
export function webPromptVersion(mode: AnalysisInput['mode']): string {
  return `${ANALYSIS_PROMPTS[mode].version}+${WEB_WRAPPER.version}`;
}

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
export interface WebSession extends AnalysisSubject {
  readonly input: AnalysisInput;
  /** The pastes checked so far, all wrong: none before the first one. */
  readonly attempts: readonly CheckedAnswer[];
}

export interface WebAnalysisRequest extends AnalysisSubject {
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
  return {
    kind: 'session',
    session: { ...subjectOf(request), input, attempts: [] },
    message: buildWebMessage(input),
  };
}

/**
 * A line as it is compared (G5 §6a, R2-03): cleaned as V3–V6 read a text (no invisible character,
 * then NFKC: DR6-17; a stray mark as a space: DR6-122; each run of white space as one space,
 * trimmed), without a quote prefix (`>`, `> >`…).
 */
const ownLine = (line: string) =>
  cleanText(line)
    .replace(/^[\s>]*>/u, '')
    .trim();

/**
 * Lines only the app writes: the frame lines of `web@1` (`=== HƯỚNG DẪN ===`, `=== ĐẦU VÀO ===`) and
 * the first and last lines of the retry message (G5 §5). A paste with one of them on a line of its
 * own is the app's message, all or part of it, never ChatGPT's answer (DR5-49, R2-04).
 */
const OWN_LINES = [
  ...WEB_WRAPPER.template.split('\n').filter((line) => /^=== .+ ===$/.test(line)),
  ...RETRY_TEMPLATE.split('\n').filter((line) => !line.includes('{issues}')),
].map(ownLine);

/**
 * More code units than twice the limit is too long whatever the paste holds (a code point is at
 * most two), so a paste is read on this many of its code units at most (DR5-09).
 */
const MAX_READ = 2 * MAX_AI_RAW_OUTPUT;

/**
 * Whether a line of the paste is one of the app's own. A line ends where a KYC note's does
 * (`LINE_BREAK` of `domain`: G5 §6a, §12.3, §13.4, DR6-123), so the two never part. Only the first
 * `MAX_READ` code units are read, so a huge paste is never split nor normalized whole (DR5-09),
 * and the app's message pasted back is named for what it is however long (review #521); a line
 * they cut is left out.
 */
function isOwnMessage(pasted: string): boolean {
  const lines = pasted.slice(0, MAX_READ).split(LINE_BREAK);
  if (pasted.length > MAX_READ) lines.pop();
  return lines.some((line) => OWN_LINES.includes(ownLine(line)));
}

export type WebAnswerResult =
  /**
   * Not an attempt (§3.1 item 3): the paste is blank, is the app's own message pasted back, or is
   * longer than `MAX_AI_RAW_OUTPUT` characters (by code point, as `raw_output` is cut).
   */
  | { readonly kind: 'unusable'; readonly reason: 'EMPTY' | 'OWN_MESSAGE' | 'TOO_LONG' }
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
  if (isOwnMessage(pasted)) return { kind: 'unusable', reason: 'OWN_MESSAGE' };
  // A huge paste is never trimmed nor counted whole either (DR5-09).
  if (pasted.length > MAX_READ) return { kind: 'unusable', reason: 'TOO_LONG' };
  if (pasted.trim() === '') return { kind: 'unusable', reason: 'EMPTY' };
  if (codePointsOver(pasted, MAX_AI_RAW_OUTPUT)) return { kind: 'unusable', reason: 'TOO_LONG' };
  const attempts = [...session.attempts, checkAnalysisAnswer(session.input, pasted)];
  const retry = nextRetry(attempts);
  if (retry !== null) {
    const { issues } = attempts.at(-1)!;
    return { kind: 'retry', session: { ...session, attempts }, issues, retryMessage: retry };
  }
  const { input } = session;
  const row: AnalysisRow = {
    ...subjectOf(session),
    ...analysisOutcome(input, attempts),
    provider: 'CHATGPT_WEB',
    ...NO_MODEL,
    promptVersion: webPromptVersion(input.mode),
  };
  return { kind: 'record', row };
}
