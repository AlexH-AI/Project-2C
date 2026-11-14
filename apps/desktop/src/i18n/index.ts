import { DbError } from '@p2c/db';
import { formatNumber } from '@p2c/domain';
import type { DataTableMoreLabels } from '@p2c/ui';
import { en, type PluralMessage } from './en';
import { LANGUAGE } from './language';
import { vi, type MessageKey } from './vi';

export type MessageParams = Readonly<Record<string, string | number>>;

/**
 * Slots that hold a count: a number there reads with its thousands grouped (`1,234 lịch`). Callers
 * pass the number, which also picks the plural form.
 */
export const COUNT_SLOTS: ReadonlySet<string> = new Set([
  'count',
  'total',
  'open',
  'closed',
  'met',
  'n',
  'present',
  'teams',
  'people',
  'customers',
  'appointments',
  'policies',
  'kycNotes',
  'tl',
  'rm',
  'shared',
  'unrecorded',
  'sheets',
]);

const SLOT = /\{(\w+)\}/g;

/** Fills the `{name}` slots of `text` from the params' own names; a slot without one stays. */
export function fillSlots(text: string, params: MessageParams): string {
  return text.replace(SLOT, (slot, name: string) => {
    if (!Object.hasOwn(params, name)) return slot;
    const value = params[name];
    return typeof value === 'number' && COUNT_SLOTS.has(name) ? formatNumber(value) : String(value);
  });
}

/**
 * The form of a plural message (ADR-0018 §9): `one` when its count slot holds the number 1,
 * `other` for any other number, or with no count to go by.
 */
function pluralForm(message: PluralMessage, params: MessageParams | undefined): string {
  const slot = [...message.other.matchAll(SLOT)]
    .map((match) => String(match[1]))
    .find((name) => COUNT_SLOTS.has(name));
  return slot !== undefined && params?.[slot] === 1 ? message.one : message.other;
}

/** One message as shown: its plural form picked by the count, then its slots filled. */
export function formatMessage(message: string | PluralMessage, params?: MessageParams): string {
  const text = typeof message === 'string' ? message : pluralForm(message, params);
  return params ? fillSlots(text, params) : text;
}

/**
 * Look up a UI string in the language of this run and fill its `{name}` slots; English shows the
 * Vietnamese of a key it lacks. Keys are typed, so a missing key fails typecheck.
 */
export function t(key: MessageKey, params?: MessageParams): string {
  return formatMessage((LANGUAGE === 'en' ? en[key] : undefined) ?? vi[key], params);
}

/** The known parts of one line, apart by the `sep.*` mark: `Nữ · 1991`, `N2 → N1`. */
export const joinParts = (
  parts: readonly (string | null | undefined | false)[],
  sep: 'dot' | 'arrow' = 'dot',
) => parts.filter(Boolean).join(` ${t(`sep.${sep}`)} `);

/** The words under a `DataTable` of over a hundred rows, counting `lịch`, `khách hàng` or `người`. */
export const tableMore = (noun: 'appointments' | 'customers' | 'people'): DataTableMoreLabels => ({
  shown: (count, total) => t(`tableMore.shown.${noun}`, { count, total }),
  more: (count) => t(`tableMore.more.${noun}`, { count }),
  all: (total) => t(`tableMore.all.${noun}`, { total }),
});

/**
 * The message for a rejected command: `error.<code>` of its `DbError`, else a general one. The
 * error's own `params` fill the slots ahead of the caller's.
 */
export function errorMessage(error: unknown, params?: MessageParams): string {
  if (error instanceof DbError) {
    // A met meeting after today, as once the machine clock was set back (T-399), has its own.
    const setBack = error.code === 'TRANSITION_BEFORE_MEETING' && error.params?.afterToday === 1;
    const key = setBack ? 'error.TRANSITION_BEFORE_MEETING.afterToday' : `error.${error.code}`;
    if (Object.hasOwn(vi, key)) return t(key as MessageKey, { ...params, ...error.params });
  }
  return t('error.unknown');
}

export type { MessageKey };
