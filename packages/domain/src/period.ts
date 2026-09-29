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

/** Throws a RangeError for a date that does not exist (31/04, 29/02/2026…) or is before 1900. */
export function calendarDate(year: number, month: number, day: number): CalendarDate {
  const valid =
    [year, month, day].every(Number.isInteger) &&
    year >= MIN_YEAR &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= lastDayOfMonth(year, month);
  if (!valid) throw new RangeError(`Not a calendar date: ${year}-${month}-${day}`);
  return { year, month, day };
}

/**
 * `date` moved by `days` calendar days (negative = earlier); rolls over months and years.
 * Throws a RangeError when `days` is not a whole number or the result is before 1900.
 */
export function addDays(date: CalendarDate, days: number): CalendarDate {
  if (!Number.isInteger(days)) throw new RangeError(`Not a whole number of days: ${days}`);
  const result = fromDayNumber(toDayNumber(date) + days);
  if (result.year < MIN_YEAR) {
    throw new RangeError(`${formatDate(date)} moved by ${days} days is before ${MIN_YEAR}`);
  }
  return result;
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

/** `dd/mm` — a day whose year is clear from context. */
export function formatDayMonth(date: CalendarDate): string {
  return `${pad(date.day)}/${pad(date.month)}`;
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
  if (year < MIN_YEAR) return { ok: false, error: 'year-out-of-range' };

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
      const mondayOffset = (new Date(toDayNumber(date) * MS_PER_DAY).getUTCDay() + 6) % 7;
      const start = addDays(date, -mondayOffset);
      return { kind, start, end: addDays(start, 6) };
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

/** The next (+1) or previous (−1) period of the same kind; a custom range moves by its length. */
export function shift(period: Period, step: 1 | -1): Period {
  const { kind, start, end } = period;
  switch (kind) {
    case 'day':
    case 'week':
      return periodOf(kind, addDays(start, step * (kind === 'day' ? 1 : 7)));
    case 'month': {
      const index = start.year * 12 + (start.month - 1) + step;
      return periodOf(kind, { year: Math.floor(index / 12), month: (index % 12) + 1, day: 1 });
    }
    case 'year':
      return periodOf(kind, { year: start.year + step, month: 1, day: 1 });
    case 'custom': {
      const length = toDayNumber(end) - toDayNumber(start) + 1;
      return customPeriod(addDays(start, step * length), addDays(end, step * length));
    }
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
