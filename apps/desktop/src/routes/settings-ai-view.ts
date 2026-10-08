/**
 * Settings → AI without React (spec Phase 5 §4, §5.3; mockup ai.html 1a–1g, 4a–4c): the model
 * and reasoning lists, the check of a pasted key, and the texts of a connection check.
 */
import {
  AI_MODELS,
  AI_REASONING_LEVELS,
  DEFAULT_AI_MODEL,
  DEFAULT_AI_SETTINGS,
  type AiErrorCode,
  type AiSettings,
  type AiSettingsProblem,
  type ConnectionResult,
} from '@p2c/ai';
import type { SelectOption } from '@p2c/ui';
import { joinParts, t } from '../i18n';
import { modelLabel } from './customers/ai-panel-view';

/** Rust takes 1–512 characters once trimmed (§4.3). */
const MAX_KEY_CHARS = 512;
/** Printable ASCII with no space: a control character pasted inside a key fails only on the call. */
const KEY_CHARS = /^[\x21-\x7e]+$/;

export type KeyError = 'EMPTY' | 'TOO_LONG' | 'NOT_ASCII';

export type KeyCheck = { readonly key: string } | { readonly error: KeyError };

/** The key to store, trimmed (§4.3), or why the field refuses it. */
export function checkKey(text: string): KeyCheck {
  const key = text.trim();
  if (key === '') return { error: 'EMPTY' };
  // By code point, as Rust counts characters.
  if (Array.from(key).length > MAX_KEY_CHARS) return { error: 'TOO_LONG' };
  if (!KEY_CHARS.test(key)) return { error: 'NOT_ASCII' };
  return { key };
}

export const modelOptions = (): SelectOption[] =>
  AI_MODELS.map(({ id, label }) => ({
    value: id,
    label: id === DEFAULT_AI_MODEL ? t('settingsAi.modelDefault', { label }) : label,
  }));

export const modelList = (): string => joinParts(AI_MODELS.map(({ label }) => label));

export const reasoningOptions = (): SelectOption[] =>
  AI_REASONING_LEVELS.map((level) => ({ value: level, label: t(`settingsAi.reasoning.${level}`) }));

/** Whether the model takes `reasoning_effort`; until then its Reasoning field is off (§4.2). */
export const takesReasoning = (model: string): boolean =>
  AI_MODELS.some((known) => known.id === model && known.reasoningEffort);

/** The one-line warning of a stored value that fell back to the defaults (1g). */
export function problemText(problem: AiSettingsProblem): string {
  const defaults = t('settingsAi.defaults', {
    provider: t(`settingsAi.provider.${DEFAULT_AI_SETTINGS.provider}`),
    model: modelLabel(DEFAULT_AI_SETTINGS.model),
    reasoning: t(`settingsAi.reasoning.${DEFAULT_AI_SETTINGS.reasoning}`),
  });
  return problem.kind === 'model'
    ? t('settingsAi.invalidModel', { model: problem.model, defaults })
    : t('settingsAi.invalid', { defaults });
}

interface AiFailure {
  readonly code: AiErrorCode;
  readonly httpStatus?: number;
  readonly serverMessage?: string;
}

/**
 * The §5.3 message of an error (mockup 2l, 4c). Settings also shows the HTTP status Rust got, so
 * the Owner can read the real code of an expired plan (T-164, Owner 09/10/2026).
 */
export function errorText({ code, httpStatus, serverMessage }: AiFailure): string {
  if (code === 'AI_BAD_REQUEST') return t('aiError.GENERAL');
  if (httpStatus === undefined) return t(`aiError.${code}`);
  if (code === 'AI_HTTP') {
    return serverMessage
      ? t('settingsAi.checkHttp', { status: httpStatus, message: serverMessage })
      : t('settingsAi.checkHttpBare', { status: httpStatus });
  }
  return t('settingsAi.checkStatus', { message: t(`aiError.${code}`), status: httpStatus });
}

export type CheckShown =
  | { readonly phase: 'idle' | 'running' }
  | { readonly phase: 'ok'; readonly detail: string }
  | { readonly phase: 'error'; readonly text: string };

/**
 * What a finished check shows; `null` is a bug (the check rejected), shown as the general message
 * (#ask "lỗi khác"). The plan and model are those the check ran with.
 */
export function checkShown(result: ConnectionResult | null, settings: AiSettings): CheckShown {
  if (result === null) return { phase: 'error', text: t('aiError.GENERAL') };
  if (result.kind === 'ok') {
    const detail = t('settingsAi.checkOkDetail', {
      plan: t(`settingsAi.plan.${settings.opencodePlan}`),
      model: modelLabel(settings.model),
    });
    return { phase: 'ok', detail };
  }
  // Nothing cancels a check: it has no Hủy (1f).
  if (result.kind === 'cancelled') return { phase: 'idle' };
  return { phase: 'error', text: errorText(result) };
}
