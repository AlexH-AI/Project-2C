/**
 * Errors of an AI call (spec Phase 5 §5.3). The Rust command `ai_complete` returns these codes; the
 * UI translates them through i18n. An error never holds the key, a header or the request body.
 */
import { cutCodePoints } from './code-points';

// Rust's codes only: `tauri-contract.test.ts` checks the list against `ai.rs`.
export const AI_ERROR_CODES = [
  'AI_NO_KEY',
  'AI_UNAUTHORIZED',
  'AI_RATE_LIMITED',
  'AI_TIMEOUT',
  'AI_NETWORK',
  'AI_HTTP',
  'AI_BAD_RESPONSE',
  'AI_BUSY',
  'AI_BAD_REQUEST',
  'AI_KEYRING',
] as const;

/**
 * Codes `packages/ai` gives before calling Rust, which never sends them: `AI_TOO_LARGE`, the
 * messages would be over the Rust limit of 200 000 characters (§5.1), from the data sent, not a bug.
 */
type AiLocalErrorCode = 'AI_TOO_LARGE';

export type AiErrorCode = (typeof AI_ERROR_CODES)[number] | AiLocalErrorCode;

/** What Rust told of a failed HTTP call, already made safe there; Settings → AI shows it (T-164). */
export interface AiErrorDetails {
  readonly httpStatus?: number;
  /** The first 200 characters of the server's error message, when it sent one. */
  readonly serverMessage?: string;
}

/** An AI error as a value: what a run gives back and a screen shows. */
export interface AiFailed extends AiErrorDetails {
  readonly code: AiErrorCode;
}

/**
 * The details `source` holds, with no key for one it lacks. Read, not trusted, so it takes what
 * Rust sent too: a status that is no number, or a message that is no string, is none.
 */
export function errorDetails(source: {
  readonly httpStatus?: unknown;
  readonly serverMessage?: unknown;
}): AiErrorDetails {
  const { httpStatus, serverMessage } = source;
  return {
    ...(typeof httpStatus === 'number' && { httpStatus }),
    ...(typeof serverMessage === 'string' && { serverMessage }),
  };
}

/** At most this many characters of the server's error message are kept. */
const MAX_SERVER_MESSAGE = 200;

/** A code Rust may send; a local one from Rust would be a bug of the webview's reading. */
export function isAiErrorCode(value: unknown): value is AiErrorCode {
  return (AI_ERROR_CODES as readonly unknown[]).includes(value);
}

export class AiError extends Error implements AiFailed {
  override readonly name = 'AiError';
  readonly code: AiErrorCode;
  readonly httpStatus?: number;
  readonly serverMessage?: string;

  constructor(code: AiErrorCode, details: AiErrorDetails = {}) {
    super(code);
    this.code = code;
    if (details.httpStatus !== undefined) this.httpStatus = details.httpStatus;
    if (details.serverMessage !== undefined) {
      // By code point, so an emoji at the limit is not cut in two.
      this.serverMessage = cutCodePoints(details.serverMessage, MAX_SERVER_MESSAGE);
    }
  }
}
