/**
 * The §5.3 message of an AI error, one for the KYC Intelligence panel, AI trích xuất and Settings
 * → AI (spec Phase 5 §5.3; mockup ai.html 2l "dùng chung panel, trích xuất, Cài đặt", 4c). It shows
 * the HTTP status Rust got, so the Owner can read the real code of an expired plan (T-164).
 */
import type { AiErrorCode } from '@p2c/ai';
import { t } from '../i18n';

/** The code shown: an AI error, or the general one for a bug or a bad request (#ask "lỗi khác"). */
export type AiShownCode = Exclude<AiErrorCode, 'AI_BAD_REQUEST'> | 'GENERAL';

/** An error to show, with what Rust told of a failed HTTP call (already made safe there, §5.3). */
export interface AiFailure {
  readonly code: AiShownCode;
  readonly httpStatus?: number;
  readonly serverMessage?: string;
}

/** What a run or an `AiError` gives of an error. */
interface Failed {
  readonly code: AiErrorCode;
  readonly httpStatus?: number;
  readonly serverMessage?: string;
}

export const GENERAL_FAILURE: AiFailure = { code: 'GENERAL' };

/** An error as shown: a bad request is a bug of the app, the general message. */
export function aiFailure({ code, httpStatus, serverMessage }: Failed): AiFailure {
  if (code === 'AI_BAD_REQUEST') return GENERAL_FAILURE;
  return {
    code,
    ...(httpStatus !== undefined && { httpStatus }),
    ...(serverMessage !== undefined && { serverMessage }),
  };
}

export function errorText({ code, httpStatus, serverMessage }: AiFailure | Failed): string {
  if (code === 'AI_BAD_REQUEST' || code === 'GENERAL') return t('aiError.GENERAL');
  if (httpStatus === undefined) return t(`aiError.${code}`);
  if (code === 'AI_HTTP') {
    return serverMessage
      ? t('aiError.http', { status: httpStatus, message: serverMessage })
      : t('aiError.httpBare', { status: httpStatus });
  }
  return t('aiError.status', { message: t(`aiError.${code}`), status: httpStatus });
}

/** Where "Cài đặt → AI" of a message goes. */
export const SETTINGS_AI_HASH = '#/settings/ai';

/**
 * The message around its link to Settings → AI; only AI_NO_KEY has one (mockups 2f, 2l). Without
 * one, `before` is the whole message.
 */
export function errorParts(failure: AiFailure): {
  readonly before: string;
  readonly link: string | null;
  readonly after: string;
} {
  const text = errorText(failure);
  const link = t('aiError.settingsLink');
  const at = failure.code === 'AI_NO_KEY' ? text.indexOf(link) : -1;
  if (at < 0) return { before: text, link: null, after: '' };
  return { before: text.slice(0, at), link, after: text.slice(at + link.length) };
}
