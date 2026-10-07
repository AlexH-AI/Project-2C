import { DbError } from '@p2c/db';
import { formatCount } from '@p2c/domain';
import type { DataTableMoreLabels } from '@p2c/ui';
import { vi, type MessageKey } from './vi';

export type MessageParams = Readonly<Record<string, string | number>>;

/** Slots that hold a count: a number there reads with its thousands grouped (`1.234 lịch`). */
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
  'tl',
  're',
  'shared',
  'unrecorded',
  'sheets',
]);

/** Slots shown as given: text, or a number that is no count (a year, a version, a month). */
export const PLAIN_SLOTS: ReadonlySet<string> = new Set([
  'age',
  'amount',
  'code',
  'compact',
  'customer',
  'date',
  'diff',
  'exported',
  'field',
  'fields',
  'file',
  'from',
  'fyp',
  'gate',
  'group',
  'issued',
  'label',
  'limitMb',
  'month',
  'name',
  'next',
  'note',
  'now',
  'number',
  'parts',
  'period',
  'quarter',
  'range',
  'read',
  'role',
  'roles',
  'scope',
  'size',
  'stage',
  'status',
  'step',
  'submitted',
  'supported',
  'table',
  'team',
  'time',
  'to',
  'today',
  'trigger',
  'value',
  'values',
  'version',
  'weekday',
  'when',
  'where',
  'word',
  'year',
]);

/** Fills the `{name}` slots of `text` from the params' own names; a slot without one stays. */
export function fillSlots(text: string, params: MessageParams): string {
  return text.replace(/\{(\w+)\}/g, (slot, name: string) => {
    if (!Object.hasOwn(params, name)) return slot;
    const value = params[name];
    return typeof value === 'number' && COUNT_SLOTS.has(name) ? formatCount(value) : String(value);
  });
}

/** Look up a UI string and fill its `{name}` slots. Keys are typed, so a missing key fails typecheck. */
export function t(key: MessageKey, params?: MessageParams): string {
  const text: string = vi[key];
  return params ? fillSlots(text, params) : text;
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
    const key = `error.${error.code}`;
    if (Object.hasOwn(vi, key)) return t(key as MessageKey, { ...params, ...error.params });
  }
  return t('error.unknown');
}

export type { MessageKey };
