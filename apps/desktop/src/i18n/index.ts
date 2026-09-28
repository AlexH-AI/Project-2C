import { DbError } from '@p2c/db';
import { vi, type MessageKey } from './vi';

export type MessageParams = Readonly<Record<string, string | number>>;

/** Look up a UI string and fill its `{name}` slots. Keys are typed, so a missing key fails typecheck. */
export function t(key: MessageKey, params?: MessageParams): string {
  const text: string = vi[key];
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (slot, name: string) =>
    name in params ? String(params[name]) : slot,
  );
}

/** The message for a rejected command: `error.<code>` of its `DbError`, else a general one. */
export function errorMessage(error: unknown, params?: MessageParams): string {
  if (error instanceof DbError) {
    const key = `error.${error.code}`;
    if (key in vi) return t(key as MessageKey, params);
  }
  return t('error.unknown');
}

export type { MessageKey };
