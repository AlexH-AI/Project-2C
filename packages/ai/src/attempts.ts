/**
 * The rule of the attempts, shared by the AI calls (`run.ts`) and ChatGPT web (`web.ts`, which the
 * user drives by hand): one retry after a wrong answer, with the G5 §5 message (`prompts/retry.ts`),
 * then the conversation is over. Not part of `@p2c/ai`: `index.ts` does not export it.
 */
import { extractJson } from './extract-json';
import { retryMessage } from './prompts/retry';
import { CUT_ANSWER, type ValidationIssue } from './validator';

/** Attempts of one conversation: the first answer and one retry (spec §3). */
export const MAX_ATTEMPTS = 2;

/** An answer as checked. */
export interface CheckedAnswer {
  readonly content: string;
  /** The answer's first JSON block (spec §6.1), `null` when it has none. */
  readonly parsed: unknown;
  readonly issues: readonly ValidationIssue[];
}

/**
 * Takes the first JSON block of `content` and checks it; no JSON is `null` for `check` (V1). An
 * answer `maxTokens` cut (`cut`) with no whole block is `CUT_ANSWER` instead (spec §6.1).
 */
export function checkAnswer(
  content: string,
  check: (parsed: unknown) => readonly ValidationIssue[],
  cut = false,
): CheckedAnswer {
  const json = extractJson(content, { cut });
  if (!json.found && cut) return { content, parsed: null, issues: [CUT_ANSWER] };
  const parsed = json.found ? json.value : null;
  return { content, parsed, issues: check(parsed) };
}

/** The last answer of a conversation; one with none is a bug of the caller, said plainly (MS-A8). */
export function lastAnswer(attempts: readonly CheckedAnswer[]): CheckedAnswer {
  const last = attempts.at(-1);
  if (!last) throw new RangeError('A conversation with no answer has no outcome');
  return last;
}

/**
 * The retry message to send after `attempts`, with the issues of the last one; `null` when the
 * conversation is over: the last answer passed, or it was the last attempt.
 */
export function nextRetry(attempts: readonly CheckedAnswer[]): string | null {
  const last = lastAnswer(attempts);
  if (last.issues.length === 0 || attempts.length >= MAX_ATTEMPTS) return null;
  return retryMessage(last.issues);
}
