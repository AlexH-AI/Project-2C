/**
 * Reporting periods (ADR-0007, ADR-0013): day, week (Monday → Sunday), month, year or a custom
 * range. Dates are calendar days with no time or time zone, so arithmetic never drifts by a day.
 */
export interface CalendarDate {
  readonly year: number;
  readonly month: number; // 1–12
  readonly day: number; // 1–31
}

export const PERIOD_KINDS = ['day', 'week', 'month', 'year', 'custom'] as const;

export type PeriodKind = (typeof PERIOD_KINDS)[number];

export interface Period {
  readonly kind: PeriodKind;
  readonly start: CalendarDate;
  readonly end: CalendarDate;
}

const MS_PER_DAY = 86_400_000;

/** Days since 1970-01-01. */
function toDayNumber({ year, month, day }: CalendarDate): number {
  return Date.UTC(year, month - 1, day) / MS_PER_DAY;
}

function fromDayNumber(dayNumber: number): CalendarDate {
  const date = new Date(dayNumber * MS_PER_DAY);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

function lastDayOfMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** `Date.UTC` reads years 0–99 as 19xx, so earlier years are refused rather than misread. */
export const MIN_YEAR = 1900;

/** Last year of the app's dates (spec Phase 4 §3): every date lies in 01/01/1900 – 31/12/2100. */
export const MAX_YEAR = 2100;

const FIRST_DAY = Date.UTC(MIN_YEAR, 0, 1) / MS_PER_DAY;
const LAST_DAY = Date.UTC(MAX_YEAR, 11, 31) / MS_PER_DAY;

/** Throws a RangeError for a date that does not exist (31/04, 29/02/2026…) or is not in 1900–2100. */
export function calendarDate(year: number, month: number, day: number): CalendarDate {
  const valid =
    [year, month, day].every(Number.isInteger) &&
    year >= MIN_YEAR &&
    year <= MAX_YEAR &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= lastDayOfMonth(year, month);
  if (!valid) throw new RangeError(`Not a calendar date: ${year}-${month}-${day}`);
  return { year, month, day };
}

/**
 * `date` moved by `days` calendar days (negative = earlier); rolls over months and years.
 * Throws a RangeError when `days` is not a whole number or the result is not in 1900–2100.
 */
export function addDays(date: CalendarDate, days: number): CalendarDate {
  if (!Number.isInteger(days)) throw new RangeError(`Not a whole number of days: ${days}`);
  const result = toDayNumber(date) + days;
  if (result < FIRST_DAY || result > LAST_DAY) {
    throw new RangeError(
      `${formatDate(date)} moved by ${days} days is outside ${MIN_YEAR}–${MAX_YEAR}`,
    );
  }
  return fromDayNumber(result);
}

/** The calendar day a JS Date falls on in the local time zone (e.g. "today"). */
export function fromLocalDate(date: Date): CalendarDate {
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

const pad = (value: number) => String(value).padStart(2, '0');

/** `dd/mm/yyyy` (ADR-0013). */
export function formatDate(date: CalendarDate): string {
  return `${pad(date.day)}/${pad(date.month)}/${date.year}`;
}

/**
 * `dd/mm/yyyy HH:MM` of a moment in the local time zone (e.g. when a file was written);
 * `dd/mm/yyyy HH:MM:SS` with `seconds`.
 */
export function formatLocalDateTime(at: Date, options: { seconds?: boolean } = {}): string {
  const time = `${pad(at.getHours())}:${pad(at.getMinutes())}`;
  const full = options.seconds ? `${time}:${pad(at.getSeconds())}` : time;
  return `${formatDate(fromLocalDate(at))} ${full}`;
}

/** `YYYYMMDD-HHMM` in the local time zone, for file names that sort by time. */
export function localFileStamp(at: Date): string {
  const { year, month, day } = fromLocalDate(at);
  return `${year}${pad(month)}${pad(day)}-${pad(at.getHours())}${pad(at.getMinutes())}`;
}

/** `dd/mm` — a day whose year is clear from context. */
export function formatDayMonth(date: CalendarDate): string {
  return `${pad(date.day)}/${pad(date.month)}`;
}

/** `dd` — the day of the month alone, as a calendar cell shows it. */
export function formatDayOfMonth(date: CalendarDate): string {
  return pad(date.day);
}

/** Monday 1 … Sunday 7. */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function weekdayOf(date: CalendarDate): Weekday {
  // Day 0 (01/01/1970) is a Thursday; day numbers are negative before it and JS `%` keeps the sign.
  return (((((toDayNumber(date) + 3) % 7) + 7) % 7) + 1) as Weekday;
}

/** Calendar days from `from` to `to`; negative when `to` is earlier. */
export function daysBetween(from: CalendarDate, to: CalendarDate): number {
  return toDayNumber(to) - toDayNumber(from);
}

/** Negative when `a` is earlier, positive when later, 0 on the same day — for `Array.sort`. */
export function compareDates(a: CalendarDate, b: CalendarDate): number {
  return toDayNumber(a) - toDayNumber(b);
}

/** Whether `date` falls in the period; the first and the last day count in full. */
export function isInPeriod(date: CalendarDate, period: Period): boolean {
  const day = toDayNumber(date);
  return toDayNumber(period.start) <= day && day <= toDayNumber(period.end);
}

/** Reads `dd/mm/yyyy` (leading zeros optional); null when it is not a real date. */
export function parseDate(text: string): CalendarDate | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text.trim());
  if (!match) return null;
  return tryCalendarDate(Number(match[3]), Number(match[2]), Number(match[1]));
}

export type QuickDateError = 'empty' | 'format' | 'invalid-date' | 'year-out-of-range';

export type QuickDateResult =
  | {
      readonly ok: true;
      readonly date: CalendarDate;
      /** True when the text had no year and today's year was used. */
      readonly yearInferred: boolean;
      /** The same day next year, offered (never applied) when an inferred date is long past. */
      readonly nextYearSuggestion: CalendarDate | null;
    }
  | { readonly ok: false; readonly error: QuickDateError };

/** An inferred date more than this many days before today gets a next-year suggestion (W8). */
export const NEXT_YEAR_SUGGESTION_DAYS = 60;

/**
 * Reads a quick date `dd/mm` or `dd/mm/yyyy` (leading zeros optional). Without a year, today's year
 * is used; if that date passed more than 60 days ago, the same day next year is suggested, since
 * at year end the RE often means early next year. The caller shows the result and lets the RE
 * choose — nothing is guessed silently.
 */
export function parseQuickDate(text: string, today: CalendarDate): QuickDateResult {
  const trimmed = text.trim();
  if (trimmed === '') return { ok: false, error: 'empty' };
  const match = /^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/.exec(trimmed);
  if (!match) return { ok: false, error: 'format' };
  const day = Number(match[1]);
  const month = Number(match[2]);
  const yearInferred = match[3] === undefined;
  const year = yearInferred ? today.year : Number(match[3]);
  if (year < MIN_YEAR || year > MAX_YEAR) return { ok: false, error: 'year-out-of-range' };

  const date = tryCalendarDate(year, month, day);
  if (!date) return { ok: false, error: 'invalid-date' };
  const longPast = toDayNumber(today) - toDayNumber(date) > NEXT_YEAR_SUGGESTION_DAYS;
  const nextYearSuggestion =
    yearInferred && longPast ? tryCalendarDate(year + 1, month, day) : null;
  return { ok: true, date, yearInferred, nextYearSuggestion };
}

function tryCalendarDate(year: number, month: number, day: number): CalendarDate | null {
  try {
    return calendarDate(year, month, day);
  } catch {
    return null;
  }
}

/** The day, week, month or year containing `date`. */
export function periodOf(kind: Exclude<PeriodKind, 'custom'>, date: CalendarDate): Period {
  switch (kind) {
    case 'day':
      return { kind, start: date, end: date };
    case 'week': {
      // Cut to the app's dates: the last week is 27/12 – 31/12/2100 (01/01/1900 is a Monday).
      const monday = toDayNumber(date) - (weekdayOf(date) - 1);
      return {
        kind,
        start: fromDayNumber(Math.max(monday, FIRST_DAY)),
        end: fromDayNumber(Math.min(monday + 6, LAST_DAY)),
      };
    }
    case 'month':
      return {
        kind,
        start: { year: date.year, month: date.month, day: 1 },
        end: { year: date.year, month: date.month, day: lastDayOfMonth(date.year, date.month) },
      };
    case 'year':
      return {
        kind,
        start: { year: date.year, month: 1, day: 1 },
        end: { year: date.year, month: 12, day: 31 },
      };
  }
}

/** A range chosen by the user. A start after the end is an error, never silently swapped. */
export function customPeriod(start: CalendarDate, end: CalendarDate): Period {
  if (toDayNumber(start) > toDayNumber(end)) {
    throw new RangeError(
      `Custom period start ${formatDate(start)} is after its end ${formatDate(end)}`,
    );
  }
  return { kind: 'custom', start, end };
}

/** MTD (ADR-0007): from the 1st of the month to the viewing `date`, both days in full. */
export function monthToDate(date: CalendarDate): Period {
  return customPeriod({ year: date.year, month: date.month, day: 1 }, date);
}

/**
 * The next (+1) or previous (−1) period of the same kind; a custom range moves by its length.
 * Throws a RangeError when that period is not in 1900–2100 (a custom range: not wholly in it).
 */
export function shift(period: Period, step: 1 | -1): Period {
  const { kind, start, end } = period;
  switch (kind) {
    case 'day':
    case 'week':
      return periodOf(kind, addDays(start, step * (kind === 'day' ? 1 : 7)));
    case 'month': {
      const index = start.year * 12 + (start.month - 1) + step;
      return periodOf(kind, calendarDate(Math.floor(index / 12), (index % 12) + 1, 1));
    }
    case 'year':
      return periodOf(kind, calendarDate(start.year + step, 1, 1));
    case 'custom': {
      const length = toDayNumber(end) - toDayNumber(start) + 1;
      return customPeriod(addDays(start, step * length), addDays(end, step * length));
    }
  }
}

/** Whether `shift(period, step)` has a period to move to, so the picker can disable ‹ or ›. */
export function canShift(period: Period, step: 1 | -1): boolean {
  try {
    shift(period, step);
    return true;
  } catch {
    return false;
  }
}

/**
 * The period of another kind to show when the user switches kind: around today when today is in
 * the period being viewed, else around its first day. Custom keeps the current range.
 */
export function switchKind(period: Period, kind: PeriodKind, today: CalendarDate): Period {
  if (kind === 'custom') return customPeriod(period.start, period.end);
  const day = toDayNumber(today);
  const viewingToday = toDayNumber(period.start) <= day && day <= toDayNumber(period.end);
  return periodOf(kind, viewingToday ? today : period.start);
}

/**
 * The period the picker's "Hôm nay" button goes to: the one of the same kind containing today, a
 * custom range becoming the current month. Returns `period` itself when it already contains today.
 */
export function todayPeriod(period: Period, today: CalendarDate): Period {
  const target = periodOf(period.kind === 'custom' ? 'month' : period.kind, today);
  const same =
    target.kind === period.kind &&
    compareDates(target.start, period.start) === 0 &&
    compareDates(target.end, period.end) === 0;
  return same ? period : target;
}

/**
 * Dates of a period as the picker shows them (ADR-0013): `28/09/2026`, `28/09 – 04/10/2026`,
 * `09/2026`, `2026`. Words around them come from the UI's i18n.
 */
export function formatPeriodValue(period: Period): string {
  const { kind, start, end } = period;
  switch (kind) {
    case 'day':
      return formatDate(start);
    case 'month':
      return `${pad(start.month)}/${start.year}`;
    case 'year':
      return `${start.year}`;
    case 'week':
    case 'custom':
      return start.year === end.year
        ? `${pad(start.day)}/${pad(start.month)} – ${formatDate(end)}`
        : `${formatDate(start)} – ${formatDate(end)}`;
  }
}

/** A custom range of at most this many days is charted day by day; a longer one month by month. */
const DAILY_MARKS_MAX_DAYS = 31;

/** `mark` cut to `range`; a mark left whole keeps its kind, a cut one becomes custom. */
function clip(mark: Period, range: Period): Period {
  const start = compareDates(mark.start, range.start) < 0 ? range.start : mark.start;
  const end = compareDates(mark.end, range.end) > 0 ? range.end : mark.end;
  const whole = compareDates(start, mark.start) === 0 && compareDates(end, mark.end) === 0;
  return { kind: whole ? mark.kind : 'custom', start, end };
}

/** The periods of `kind` (day, week or month) covering `range`, each cut to it, in order. */
function splitBy(range: Period, kind: 'day' | 'week' | 'month'): Period[] {
  const marks: Period[] = [];
  let next: CalendarDate | null = range.start;
  while (next !== null) {
    const mark = periodOf(kind, next);
    marks.push(clip(mark, range));
    next = compareDates(mark.end, range.end) < 0 ? addDays(mark.end, 1) : null;
  }
  return marks;
}

/**
 * The marks (columns) of the Tổng quan chart (spec Phase 4 §2.8): a day is one mark; a week and a
 * month are split into days, a year into months; a custom range of up to 31 days into days, a
 * longer one into months, the first and last cut to the range (kind custom).
 */
export function chartMarks(period: Period): Period[] {
  switch (period.kind) {
    case 'day':
      return [period];
    case 'week':
    case 'month':
      return splitBy(period, 'day');
    case 'year':
      return splitBy(period, 'month');
    case 'custom':
      return splitBy(
        period,
        daysBetween(period.start, period.end) < DAILY_MARKS_MAX_DAYS ? 'day' : 'month',
      );
  }
}

/**
 * The marks (rows) of the Báo cáo "Theo mốc" table (spec Phase 4 §4.4): as the chart, except that a
 * month is split into Monday – Sunday weeks cut at the month edges (kind custom when cut).
 */
export function reportMarks(period: Period): Period[] {
  return period.kind === 'month' ? splitBy(period, 'week') : chartMarks(period);
}
