import type { AppointmentRecord, CustomerRecord } from '@p2c/db';
import {
  compareDates,
  daysBetween,
  formatDate,
  formatDayMonth,
  parseQuickDate,
  weekdayOf,
  type CalendarDate,
  type QuickDateError,
  type Weekday,
} from '@p2c/domain';
import { outcomeResolver, type AppointmentData, type Outcome } from './appointments-view';

/** "Các lần hẹn trước" shows this many, newest first; the rest is behind "Xem tất cả". */
export const MAX_HISTORY = 5;

/**
 * `any`: a new appointment, where a day already past is a back-filled meeting (6b).
 * `fromToday`: the next appointment after a past one, which must be today or later (6h).
 */
export type ScheduleMode = 'any' | 'fromToday';

interface ReadDate {
  readonly date: CalendarDate;
  /** Negative once the day has passed. */
  readonly daysFromToday: number;
  /** The same day next year, offered when a year-less day is long past; never applied. */
  readonly suggestion: CalendarDate | null;
}

export type ScheduleDate =
  | ({ readonly ok: true; readonly weekday: Weekday } & ReadDate)
  | ({ readonly ok: false; readonly error: 'past' } & ReadDate)
  | { readonly ok: false; readonly error: QuickDateError };

/** Reads the day typed into the form: `dd/mm` or `dd/mm/yyyy`, checked against `today`. */
export function readScheduleDate(
  text: string,
  today: CalendarDate,
  mode: ScheduleMode,
): ScheduleDate {
  const parsed = parseQuickDate(text, today);
  if (!parsed.ok) return parsed;
  const read = {
    date: parsed.date,
    daysFromToday: daysBetween(today, parsed.date),
    suggestion: parsed.nextYearSuggestion,
  };
  if (mode === 'fromToday' && read.daysFromToday < 0) return { ok: false, error: 'past', ...read };
  return { ok: true, weekday: weekdayOf(parsed.date), ...read };
}

/**
 * A day as the form writes it: `dd/mm` this year, `dd/mm/yyyy` otherwise. `readScheduleDate`
 * reads it back as the same day, so an earlier year's day never turns into this year's.
 */
export const dayText = (date: CalendarDate, today: CalendarDate) =>
  date.year === today.year ? formatDayMonth(date) : formatDate(date);

/** `hh:mm` (the hour may lose its zero); empty means no time. */
export function parseTime(text: string): { ok: true; time: string | null } | { ok: false } {
  const trimmed = text.trim();
  if (trimmed === '') return { ok: true, time: null };
  const match = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) return { ok: false };
  return { ok: true, time: `${match[1]?.padStart(2, '0')}:${match[2]}` };
}

/** Whether the day is today or earlier, so the appointment can be followed by a next one. */
export const isPastOrToday = (date: CalendarDate, today: CalendarDate) =>
  compareDates(date, today) <= 0;

export interface PriorMeetings {
  /** The customer's appointments, newest first. */
  readonly rows: readonly { readonly appointment: AppointmentRecord; readonly outcome: Outcome }[];
  readonly metCount: number;
  readonly lastMet: CalendarDate | null;
}

/** The earlier appointments of one customer, for the form to show before a new one is made. */
export function priorMeetings(
  data: Pick<AppointmentData, 'appointments' | 'transitions'>,
  customerId: string,
): PriorMeetings {
  const outcome = outcomeResolver(data);
  const list = data.appointments
    .filter((a) => a.customerId === customerId)
    .sort((a, b) => compareDates(b.date, a.date) || (b.time ?? '').localeCompare(a.time ?? ''));
  const met = list.filter((a) => a.status === 'MET');
  return {
    rows: list.map((appointment) => ({ appointment, outcome: outcome(appointment) })),
    metCount: met.length,
    lastMet: met[0]?.date ?? null,
  };
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
