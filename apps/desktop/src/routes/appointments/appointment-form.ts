import type { CustomerRecord } from '@p2c/db';
import {
  daysBetween,
  parseQuickDate,
  weekdayOf,
  type CalendarDate,
  type QuickDateError,
  type Weekday,
} from '@p2c/domain';

export type ScheduleDate =
  | {
      readonly ok: true;
      readonly date: CalendarDate;
      readonly weekday: Weekday;
      /** Negative once the day has passed. */
      readonly daysFromToday: number;
      /** The same day next year, offered when a year-less day is long past; never applied. */
      readonly suggestion: CalendarDate | null;
    }
  | { readonly ok: false; readonly error: QuickDateError };

/** Reads the day typed into the form: `dd/mm` or `dd/mm/yyyy`, checked against `today`. */
export function readScheduleDate(text: string, today: CalendarDate): ScheduleDate {
  const parsed = parseQuickDate(text, today);
  if (!parsed.ok) return parsed;
  return {
    ok: true,
    date: parsed.date,
    weekday: weekdayOf(parsed.date),
    daysFromToday: daysBetween(today, parsed.date),
    suggestion: parsed.nextYearSuggestion,
  };
}

/** `hh:mm` (the hour may lose its zero); empty means no time. */
export function parseTime(text: string): { ok: true; time: string | null } | { ok: false } {
  const trimmed = text.trim();
  if (trimmed === '') return { ok: true, time: null };
  const match = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) return { ok: false };
  return { ok: true, time: `${match[1]?.padStart(2, '0')}:${match[2]}` };
}

const plain = (text: string) =>
  text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd');

/** The customers whose name or code contains the text (accents and case ignored), by name. */
export function searchCustomers(
  customers: readonly CustomerRecord[],
  query: string,
  limit: number,
): CustomerRecord[] {
  const needle = plain(query.trim());
  if (needle === '') return [];
  return customers
    .filter((c) => plain(c.name).includes(needle) || plain(c.code).includes(needle))
    .slice(0, limit);
}
