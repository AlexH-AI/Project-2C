/**
 * The retry message (prompts G5 §5, Owner 07/10/2026), the same for the three modes: the 4th
 * message, after the wrong answer, with one validator issue a line. Word for word from
 * `docs/design/phase-5-prompts.md`; changing a word goes through G5.
 *
 * Also the rule of the attempts, shared by the AI calls (`run.ts`) and ChatGPT web (`web.ts`, which
 * the user drives by hand): one retry after a wrong answer, then the conversation is over.
 */
import { extractJson } from '../extract-json';
import type { ValidationIssue } from '../validator';

export const RETRY_TEMPLATE = `Kết quả vừa rồi chưa đạt kiểm tra tự động với các lỗi sau:
{issues}
Hãy trả lại toàn bộ kết quả dưới dạng đúng một khối JSON theo định dạng đã yêu cầu, sửa hết các lỗi trên và vẫn tuân thủ mọi quy tắc bắt buộc. Không thêm lời giải thích.`;

export function retryMessage(issues: readonly ValidationIssue[]): string {
  const lines = issues.map(({ code, path, detail }) => `- ${code} tại ${path}: ${detail}`);
  // A function, so a `$` in a detail is not read as a replacement pattern.
  return RETRY_TEMPLATE.replace('{issues}', () => lines.join('\n'));
}

/** Attempts of one conversation: the first answer and one retry (spec §3). */
export const MAX_ATTEMPTS = 2;

/** An answer as checked. */
export interface CheckedAnswer {
  readonly content: string;
  /** The answer's first JSON block (spec §6.1), `null` when it has none. */
  readonly parsed: unknown;
  readonly issues: readonly ValidationIssue[];
}

/** Takes the first JSON block of `content` and checks it; no JSON is `null` for `check` (V1). */
export function checkAnswer(
  content: string,
  check: (parsed: unknown) => readonly ValidationIssue[],
): CheckedAnswer {
  const json = extractJson(content);
  const parsed = json.found ? json.value : null;
  return { content, parsed, issues: check(parsed) };
}

/**
 * The retry message to send after `attempts`, with the issues of the last one; `null` when the
 * conversation is over: the last answer passed, or it was the last attempt.
 */
export function nextRetry(attempts: readonly CheckedAnswer[]): string | null {
  const last = attempts.at(-1)!;
  if (last.issues.length === 0 || attempts.length >= MAX_ATTEMPTS) return null;
  return retryMessage(last.issues);
}
