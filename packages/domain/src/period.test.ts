import { describe, expect, it } from 'vitest';
import {
  addDays,
  calendarDate,
  canShift,
  chartMarks,
  compareDates,
  customPeriod,
  customRangeAllowed,
  customRangeMaxEnd,
  daysBetween,
  formatDate,
  formatDayMonth,
  formatDayOfMonth,
  formatIsoDate,
  formatLocalDateTime,
  formatPeriodValue,
  fromIsoDate,
  fromLocalDate,
  localFileStamp,
  isInPeriod,
  MAX_YEAR,
  MIN_YEAR,
  monthToDate,
  parseDate,
  parseQuickDate,
  periodOf,
  reportMarks,
  shift,
  switchKind,
  todayPeriod,
  weekdayOf,
  type Period,
} from './period';
import { REPORT_MARKS_GOLDEN_CASES } from './golden/stage-snapshot.fixture';

const d = (day: number, month: number, year: number) => calendarDate(year, month, day);

/** Period as `dd/mm/yyyy – dd/mm/yyyy`, to keep expectations readable. */
const range = (period: Period) => `${formatDate(period.start)} – ${formatDate(period.end)}`;

describe('calendarDate', () => {
  it('rejects dates that do not exist', () => {
    expect(() => calendarDate(2026, 2, 29)).toThrow(RangeError);
    expect(() => calendarDate(2026, 13, 1)).toThrow(RangeError);
    expect(() => calendarDate(2026, 4, 31)).toThrow(RangeError);
    expect(() => calendarDate(2026, 1, 0)).toThrow(RangeError);
    expect(() => calendarDate(2026.5, 1, 1)).toThrow(RangeError);
  });

  it('accepts 29/02 in a leap year', () => {
    expect(formatDate(d(29, 2, 2028))).toBe('29/02/2028');
  });

  // DR-33: a century year is a leap year only when it divides by 400.
  it('takes 29/02/2000 but not 29/02 of 1900 or 2100', () => {
    expect(formatDate(d(29, 2, 2000))).toBe('29/02/2000');
    expect(() => calendarDate(1900, 2, 29)).toThrow(RangeError);
    expect(() => calendarDate(2100, 2, 29)).toThrow(RangeError);
    expect(formatDate(addDays(d(28, 2, 2100), 1))).toBe('01/03/2100');
    expect(parseDate('29/02/2100')).toBeNull();
  });

  it('formats the day and month alone as dd/mm', () => {
    expect(formatDayMonth(d(2, 10, 2026))).toBe('02/10');
  });

  it('formats the day of the month alone as dd', () => {
    expect(formatDayOfMonth(d(2, 10, 2026))).toBe('02');
    expect(formatDayOfMonth(d(28, 9, 2026))).toBe('28');
  });
});

describe('local date and time', () => {
  // Built from local parts, so the expectations hold in any time zone.
  const at = new Date(2026, 8, 5, 7, 4, 59);

  it('formats as dd/mm/yyyy HH:MM', () => {
    expect(formatLocalDateTime(at)).toBe('05/09/2026 07:04');
    expect(formatLocalDateTime(new Date(2026, 11, 31, 23, 59))).toBe('31/12/2026 23:59');
  });

  it('adds :SS when asked for seconds', () => {
    expect(formatLocalDateTime(at, { seconds: true })).toBe('05/09/2026 07:04:59');
  });

  it('stamps file names as YYYYMMDD-HHMM', () => {
    expect(localFileStamp(at)).toBe('20260905-0704');
  });
});

describe('formatIsoDate', () => {
  it('writes a day as YYYY-MM-DD, for file names', () => {
    expect(formatIsoDate(d(5, 9, 2026))).toBe('2026-09-05');
    expect(formatIsoDate(d(31, 12, 1900))).toBe('1900-12-31');
  });

  it('refuses a day that does not exist', () => {
    expect(() => formatIsoDate({ year: 2026, month: 2, day: 29 })).toThrow(RangeError);
    expect(() => formatIsoDate({ year: 1899, month: 12, day: 31 })).toThrow(RangeError);
  });
});

describe('fromIsoDate', () => {
  it('reads YYYY-MM-DD, as dates are stored', () => {
    expect(fromIsoDate('2026-09-05')).toEqual(d(5, 9, 2026));
    expect(fromIsoDate('2100-12-31')).toEqual(d(31, 12, 2100));
    expect(fromIsoDate(formatIsoDate(d(29, 2, 2000)))).toEqual(d(29, 2, 2000));
  });

  it.each([
    '2026-02-30',
    '2026-9-05',
    '2026-09-05T00:00',
    '26-09-05',
    '05/09/2026',
    '1899-12-31',
    '',
  ])('refuses %j', (text) => {
    expect(() => fromIsoDate(text)).toThrow(RangeError);
  });
});

describe('periodOf', () => {
  it('day is the date itself', () => {
    expect(range(periodOf('day', d(28, 9, 2026)))).toBe('28/09/2026 – 28/09/2026');
  });

  it('week runs Monday to Sunday (ADR-0007)', () => {
    expect(range(periodOf('week', d(1, 10, 2026)))).toBe('28/09/2026 – 04/10/2026');
    expect(range(periodOf('week', d(28, 9, 2026)))).toBe('28/09/2026 – 04/10/2026');
    expect(range(periodOf('week', d(4, 10, 2026)))).toBe('28/09/2026 – 04/10/2026');
  });

  it('month covers the whole month', () => {
    expect(range(periodOf('month', d(28, 9, 2026)))).toBe('01/09/2026 – 30/09/2026');
    expect(range(periodOf('month', d(15, 2, 2028)))).toBe('01/02/2028 – 29/02/2028');
    expect(range(periodOf('month', d(15, 2, 2027)))).toBe('01/02/2027 – 28/02/2027');
  });

  it('year covers the whole year', () => {
    expect(range(periodOf('year', d(28, 9, 2026)))).toBe('01/01/2026 – 31/12/2026');
  });
});

describe('isInPeriod', () => {
  it('includes the first and the last day, and nothing outside', () => {
    const week = periodOf('week', d(28, 12, 2026));
    expect(isInPeriod(d(28, 12, 2026), week)).toBe(true);
    expect(isInPeriod(d(3, 1, 2027), week)).toBe(true);
    expect(isInPeriod(d(27, 12, 2026), week)).toBe(false);
    expect(isInPeriod(d(4, 1, 2027), week)).toBe(false);
  });
});

describe('shift', () => {
  it('moves a month forward and back', () => {
    const september = periodOf('month', d(28, 9, 2026));
    expect(range(shift(september, 1))).toBe('01/10/2026 – 31/10/2026');
    expect(range(shift(september, -1))).toBe('01/08/2026 – 31/08/2026');
    expect(range(shift(periodOf('month', d(5, 1, 2026)), -1))).toBe('01/12/2025 – 31/12/2025');
  });

  it('moves a week across the new year', () => {
    expect(range(shift(periodOf('week', d(28, 12, 2026)), 1))).toBe('04/01/2027 – 10/01/2027');
  });

  it('moves a day and a year', () => {
    expect(range(shift(periodOf('day', d(31, 12, 2026)), 1))).toBe('01/01/2027 – 01/01/2027');
    expect(range(shift(periodOf('year', d(1, 6, 2028)), -1))).toBe('01/01/2027 – 31/12/2027');
  });

  it('moves a custom period by its own length', () => {
    const tenDays = customPeriod(d(1, 9, 2026), d(10, 9, 2026));
    expect(range(shift(tenDays, 1))).toBe('11/09/2026 – 20/09/2026');
    expect(shift(tenDays, -1)).toMatchObject({ kind: 'custom' });
    expect(range(shift(tenDays, -1))).toBe('22/08/2026 – 31/08/2026');
  });
});

describe('periods at the edges of 1900–2100', () => {
  it('cuts the last week at 31/12/2100, a Friday', () => {
    expect(range(periodOf('week', d(31, 12, 2100)))).toBe('27/12/2100 – 31/12/2100');
    expect(range(periodOf('week', d(1, 1, 1900)))).toBe('01/01/1900 – 07/01/1900');
  });

  // Spec Phase 4 §3: which of ‹ › are enabled, by the period being viewed.
  const cases: [string, Period, boolean, boolean][] = [
    ['day 01/01/1900', periodOf('day', d(1, 1, 1900)), false, true],
    ['week 01/01 – 07/01/1900', periodOf('week', d(3, 1, 1900)), false, true],
    ['month 01/1900', periodOf('month', d(1, 1, 1900)), false, true],
    ['year 1900', periodOf('year', d(1, 1, 1900)), false, true],
    ['day 31/12/2100', periodOf('day', d(31, 12, 2100)), true, false],
    ['month 12/2100', periodOf('month', d(31, 12, 2100)), true, false],
    ['year 2100', periodOf('year', d(31, 12, 2100)), true, false],
    ['week 27/12 – 31/12/2100', periodOf('week', d(31, 12, 2100)), true, false],
    ['custom 01/01 – 10/01/1900', customPeriod(d(1, 1, 1900), d(10, 1, 1900)), false, true],
    ['custom 25/12 – 31/12/2100', customPeriod(d(25, 12, 2100), d(31, 12, 2100)), true, false],
    ['custom 15/01 – 24/01/1900', customPeriod(d(15, 1, 1900), d(24, 1, 1900)), true, true],
    ['custom 10/01 – 24/01/1900', customPeriod(d(10, 1, 1900), d(24, 1, 1900)), false, true],
  ];

  it.each(cases)('%s: canShift back %s, forward %s', (_, period, back, forward) => {
    expect(canShift(period, -1)).toBe(back);
    expect(canShift(period, 1)).toBe(forward);
  });

  it.each(cases)('%s: shift refuses to leave 1900–2100', (_, period, back, forward) => {
    for (const [step, allowed] of [
      [-1, back],
      [1, forward],
    ] as const) {
      if (allowed) {
        const moved = shift(period, step);
        expect(moved.start.year).toBeGreaterThanOrEqual(MIN_YEAR);
        expect(moved.end.year).toBeLessThanOrEqual(MAX_YEAR);
      } else {
        expect(() => shift(period, step)).toThrow(RangeError);
      }
    }
  });

  it('steps a custom period of 10 days back from 15/01/1900 to 05/01/1900', () => {
    expect(range(shift(customPeriod(d(15, 1, 1900), d(24, 1, 1900)), -1))).toBe(
      '05/01/1900 – 14/01/1900',
    );
  });

  it('steps back into the cut last week and out of it', () => {
    const lastWeek = periodOf('week', d(31, 12, 2100));
    expect(range(shift(periodOf('week', d(20, 12, 2100)), 1))).toBe('27/12/2100 – 31/12/2100');
    expect(range(shift(lastWeek, -1))).toBe('20/12/2100 – 26/12/2100');
  });
});

describe('customPeriod', () => {
  it('rejects a start after the end instead of swapping them', () => {
    expect(() => customPeriod(d(2, 9, 2026), d(1, 9, 2026))).toThrow(
      'Custom period start 02/09/2026 is after its end 01/09/2026',
    );
  });

  it('allows a single day', () => {
    expect(range(customPeriod(d(2, 9, 2026), d(2, 9, 2026)))).toBe('02/09/2026 – 02/09/2026');
  });

  // The 3-month cap belongs to the picker (spec §3.1 item 5): app-built windows stay unlimited.
  it('still builds a range longer than 3 months', () => {
    expect(range(customPeriod(d(1, 1, 2026), d(28, 9, 2026)))).toBe('01/01/2026 – 28/09/2026');
  });
});

// Spec Phase 4 §3.1: a custom range chosen in the picker runs at most 3 calendar months.
describe('custom range cap', () => {
  const cases: [string, string][] = [
    ['01/01/2027', '31/03/2027'],
    ['15/01/2027', '14/04/2027'],
    ['31/01/2027', '30/04/2027'],
    ['30/11/2026', '28/02/2027'],
    ['01/12/2027', '29/02/2028'],
    ['15/11/2100', '31/12/2100'],
    // DR-36: the start day is the last day of the third month, so that day itself is not allowed.
    ['28/11/2026', '27/02/2027'],
    ['30/01/2027', '29/04/2027'],
    ['31/12/2026', '30/03/2027'],
    ['29/11/2027', '28/02/2028'],
  ];

  it.each(cases)('from %s the last day allowed is %s', (from, maxEnd) => {
    expect(formatDate(customRangeMaxEnd(parseDate(from)!))).toBe(maxEnd);
  });

  it.each(cases)('allows a range from %s up to %s and no further', (from) => {
    const start = parseDate(from)!;
    const end = customRangeMaxEnd(start);
    expect(customRangeAllowed(start, start)).toBe(true);
    expect(customRangeAllowed(start, end)).toBe(true);
    if (compareDates(end, d(31, 12, 2100)) < 0) {
      expect(customRangeAllowed(start, addDays(end, 1))).toBe(false);
    }
  });

  it('refuses a start after the end', () => {
    expect(customRangeAllowed(d(2, 9, 2026), d(1, 9, 2026))).toBe(false);
  });

  it('disables ‹ when the moved range would pass the cap', () => {
    const range92 = customPeriod(d(16, 7, 2027), d(15, 10, 2027));
    expect(canShift(range92, -1)).toBe(false);
    expect(() => shift(range92, -1)).toThrow(RangeError);
    expect(() => shift(range92, -1)).toThrow(
      'Custom period 15/04/2027 – 15/07/2027 is over 3 months',
    );
    // Forward: 16/10/2027 – 15/01/2028 is within the cap (max 15/01/2028).
    expect(canShift(range92, 1)).toBe(true);
    expect(range(shift(range92, 1))).toBe('16/10/2027 – 15/01/2028');
  });
});

describe('monthToDate', () => {
  it('runs from the 1st of the month to the viewing day, as a custom range', () => {
    expect(monthToDate(d(15, 1, 2027))).toEqual(customPeriod(d(1, 1, 2027), d(15, 1, 2027)));
  });

  it('is the 1st alone on the 1st', () => {
    expect(range(monthToDate(d(1, 3, 2027)))).toBe('01/03/2027 – 01/03/2027');
  });

  it('covers the whole month on its last day', () => {
    expect(range(monthToDate(d(30, 4, 2027)))).toBe('01/04/2027 – 30/04/2027');
    expect(range(monthToDate(d(31, 12, 2027)))).toBe('01/12/2027 – 31/12/2027');
  });

  it('ends on 29/02 in a leap year', () => {
    expect(range(monthToDate(d(29, 2, 2028)))).toBe('01/02/2028 – 29/02/2028');
  });
});

describe('formatPeriodValue', () => {
  it('formats each kind without words, leaving them to the UI', () => {
    expect(formatPeriodValue(periodOf('day', d(28, 9, 2026)))).toBe('28/09/2026');
    expect(formatPeriodValue(periodOf('week', d(28, 9, 2026)))).toBe('28/09 – 04/10/2026');
    expect(formatPeriodValue(periodOf('month', d(28, 9, 2026)))).toBe('09/2026');
    expect(formatPeriodValue(periodOf('year', d(28, 9, 2026)))).toBe('2026');
  });

  it('writes both years when a range crosses the new year', () => {
    expect(formatPeriodValue(periodOf('week', d(31, 12, 2026)))).toBe('28/12/2026 – 03/01/2027');
  });

  it('formats a custom range like a week', () => {
    expect(formatPeriodValue(customPeriod(d(1, 9, 2026), d(10, 9, 2026)))).toBe(
      '01/09 – 10/09/2026',
    );
  });

  it('writes a one-day range as that day', () => {
    expect(formatPeriodValue(customPeriod(d(1, 4, 2027), d(1, 4, 2027)))).toBe('01/04/2027');
  });
});

describe('switchKind', () => {
  const today = d(28, 9, 2026);

  it('anchors on today when today is in the period being viewed', () => {
    const month = periodOf('month', today);
    expect(range(switchKind(month, 'week', today))).toBe('28/09/2026 – 04/10/2026');
    expect(range(switchKind(month, 'day', today))).toBe('28/09/2026 – 28/09/2026');
  });

  it('anchors on the period start otherwise', () => {
    const october = periodOf('month', d(1, 10, 2026));
    expect(range(switchKind(october, 'week', today))).toBe('28/09/2026 – 04/10/2026');
    expect(range(switchKind(october, 'day', today))).toBe('01/10/2026 – 01/10/2026');
  });

  it('turns the period being viewed into a custom range', () => {
    const week = periodOf('week', today);
    expect(switchKind(week, 'custom', today)).toEqual({ ...week, kind: 'custom' });
  });

  it('keeps a month as it is when turning it into a custom range', () => {
    const month = periodOf('month', today);
    expect(switchKind(month, 'custom', today)).toEqual({ ...month, kind: 'custom' });
  });

  it('cuts a year to its first 3 months when turning it into a custom range', () => {
    const year = periodOf('year', today);
    expect(switchKind(year, 'custom', today)).toEqual(customPeriod(d(1, 1, 2026), d(31, 3, 2026)));
  });
});

describe('todayPeriod', () => {
  const today = d(15, 9, 2026);

  it('moves a day, week, month or year to the one of the same kind containing today', () => {
    expect(range(todayPeriod(periodOf('day', d(3, 2, 2030)), today))).toBe(
      '15/09/2026 – 15/09/2026',
    );
    const week = todayPeriod(periodOf('week', d(4, 1, 2027)), today);
    expect(week.kind).toBe('week');
    expect(range(week)).toBe('14/09/2026 – 20/09/2026');
    expect(todayPeriod(periodOf('month', d(1, 11, 2026)), today)).toEqual(periodOf('month', today));
    expect(todayPeriod(periodOf('year', d(1, 1, 2027)), today)).toEqual(periodOf('year', today));
  });

  it('turns a custom range into the month containing today', () => {
    const custom = customPeriod(d(1, 1, 2020), d(10, 1, 2020));
    expect(todayPeriod(custom, today)).toEqual(periodOf('month', today));
  });

  it('keeps the period being viewed when it already contains today', () => {
    const week = periodOf('week', today);
    expect(todayPeriod(week, today)).toBe(week);
  });

  it('leaves the edges of 1900–2100', () => {
    expect(todayPeriod(periodOf('year', d(1, 1, 1900)), today)).toEqual(periodOf('year', today));
    expect(range(todayPeriod(periodOf('week', d(31, 12, 2100)), today))).toBe(
      '14/09/2026 – 20/09/2026',
    );
  });
});

describe('parseDate', () => {
  it('reads dd/mm/yyyy, with or without leading zeros', () => {
    expect(parseDate('04/01/2027')).toEqual(d(4, 1, 2027));
    expect(parseDate(' 4/1/2027 ')).toEqual(d(4, 1, 2027));
  });

  it('returns null for text that is not a real dd/mm/yyyy date', () => {
    expect(parseDate('')).toBeNull();
    expect(parseDate('2027-01-04')).toBeNull();
    expect(parseDate('04/01/27')).toBeNull();
    expect(parseDate('30/02/2027')).toBeNull();
  });
});

describe('calendarDate before 1900', () => {
  it('rejects years before 1900 instead of reading 0–99 as 19xx', () => {
    expect(() => calendarDate(99, 1, 1)).toThrow(RangeError);
    expect(() => calendarDate(1899, 12, 31)).toThrow(RangeError);
    expect(formatDate(calendarDate(1900, 1, 1))).toBe('01/01/1900');
  });

  it('makes parseDate return null for those years', () => {
    expect(parseDate('01/01/0099')).toBeNull();
    expect(parseDate('01/01/1899')).toBeNull();
  });
});

describe('calendarDate after 2100', () => {
  it('rejects years after MAX_YEAR', () => {
    expect(MAX_YEAR).toBe(2100);
    expect(formatDate(calendarDate(2100, 12, 31))).toBe('31/12/2100');
    expect(() => calendarDate(2101, 1, 1)).toThrow(RangeError);
    expect(() => calendarDate(9999, 1, 1)).toThrow(RangeError);
    expect(parseDate('01/01/2101')).toBeNull();
  });
});

describe('parseQuickDate', () => {
  it('fills in the current year for dd/mm, with no suggestion when the date is ahead', () => {
    expect(parseQuickDate('05/10', d(26, 9, 2026))).toEqual({
      ok: true,
      date: d(5, 10, 2026),
      yearInferred: true,
      nextYearSuggestion: null,
    });
  });

  it('suggests next year, without applying it, when the date passed more than 60 days ago', () => {
    expect(parseQuickDate('05/01', d(20, 12, 2026))).toEqual({
      ok: true,
      date: d(5, 1, 2026),
      yearInferred: true,
      nextYearSuggestion: d(5, 1, 2027),
    });
  });

  it('does not suggest at exactly 60 days, and does at 61', () => {
    // 01/01/2026 + 60 days = 02/03/2026
    expect(parseQuickDate('01/01', d(2, 3, 2026))).toMatchObject({ nextYearSuggestion: null });
    expect(parseQuickDate('01/01', d(3, 3, 2026))).toMatchObject({
      nextYearSuggestion: d(1, 1, 2027),
    });
  });

  it('never suggests when the year was typed', () => {
    expect(parseQuickDate('05/01/2026', d(20, 12, 2026))).toEqual({
      ok: true,
      date: d(5, 1, 2026),
      yearInferred: false,
      nextYearSuggestion: null,
    });
  });

  it('rejects 29/02 in a non-leap year and accepts it in a leap year', () => {
    expect(parseQuickDate('29/02', d(26, 9, 2026))).toEqual({ ok: false, error: 'invalid-date' });
    expect(parseQuickDate('29/02/2027', d(26, 9, 2026))).toEqual({
      ok: false,
      error: 'invalid-date',
    });
    expect(parseQuickDate('29/02', d(1, 3, 2028))).toMatchObject({
      ok: true,
      date: d(29, 2, 2028),
    });
    expect(parseQuickDate('29/02/2028', d(26, 9, 2026))).toMatchObject({
      ok: true,
      date: d(29, 2, 2028),
    });
  });

  it('gives no suggestion when the date does not exist next year', () => {
    // 29/02/2028 passed 295 days before 20/12/2028, but 29/02/2029 does not exist
    expect(parseQuickDate('29/02', d(20, 12, 2028))).toMatchObject({
      ok: true,
      date: d(29, 2, 2028),
      nextYearSuggestion: null,
    });
  });

  it('accepts short and padded forms, with surrounding spaces', () => {
    const today = d(26, 9, 2026);
    expect(parseQuickDate('5/1', today)).toMatchObject({ ok: true, date: d(5, 1, 2026) });
    expect(parseQuickDate(' 05/01 ', today)).toMatchObject({ ok: true, date: d(5, 1, 2026) });
    expect(parseQuickDate('05/01/2027', today)).toMatchObject({ ok: true, date: d(5, 1, 2027) });
  });

  it('reports empty text and text that is not dd/mm[/yyyy]', () => {
    const today = d(26, 9, 2026);
    expect(parseQuickDate('', today)).toEqual({ ok: false, error: 'empty' });
    expect(parseQuickDate('   ', today)).toEqual({ ok: false, error: 'empty' });
    for (const text of ['abc', 'mai', '05-01', '05/01/27', '2027-01-05', '5', '05/01/2027/1']) {
      expect(parseQuickDate(text, today)).toEqual({ ok: false, error: 'format' });
    }
  });

  it('reports days and months that do not exist', () => {
    const today = d(26, 9, 2026);
    for (const text of ['32/01', '00/05', '05/13', '05/00', '31/04']) {
      expect(parseQuickDate(text, today)).toEqual({ ok: false, error: 'invalid-date' });
    }
  });

  it('reports years before 1900 instead of reading them as 19xx', () => {
    const today = d(26, 9, 2026);
    expect(parseQuickDate('01/01/0099', today)).toEqual({ ok: false, error: 'year-out-of-range' });
    expect(parseQuickDate('01/01/1899', today)).toEqual({ ok: false, error: 'year-out-of-range' });
  });

  it('reports years after 2100', () => {
    const today = d(26, 9, 2026);
    expect(parseQuickDate('01/01/2101', today)).toEqual({ ok: false, error: 'year-out-of-range' });
    expect(parseQuickDate('31/12/9999', today)).toEqual({ ok: false, error: 'year-out-of-range' });
  });

  it('suggests no next year past 2100', () => {
    const result = parseQuickDate('01/01', d(31, 12, 2100));
    expect(result).toMatchObject({ ok: true, nextYearSuggestion: null });
  });
});

describe('fromLocalDate', () => {
  it('reads the local calendar day of a JS date', () => {
    expect(fromLocalDate(new Date(2026, 8, 28, 23, 59))).toEqual(d(28, 9, 2026));
  });
});

describe('compareDates', () => {
  it('orders by time, not by text', () => {
    expect(compareDates(d(30, 9, 2026), d(1, 10, 2026))).toBeLessThan(0);
    expect(compareDates(d(1, 1, 2027), d(31, 12, 2026))).toBeGreaterThan(0);
    expect(compareDates(d(28, 9, 2026), d(28, 9, 2026))).toBe(0);
  });

  it('sorts dd/mm/yyyy values chronologically', () => {
    const dates = [d(1, 10, 2026), d(30, 9, 2026), d(2, 9, 2025)];
    expect(dates.sort(compareDates).map(formatDate)).toEqual([
      '02/09/2025',
      '30/09/2026',
      '01/10/2026',
    ]);
  });
});

describe('addDays', () => {
  it('rolls over months, years and 29 February, forward and back', () => {
    expect(addDays(d(28, 9, 2026), -29)).toEqual(d(30, 8, 2026));
    expect(addDays(d(1, 1, 2027), -1)).toEqual(d(31, 12, 2026));
    expect(addDays(d(31, 12, 2026), 1)).toEqual(d(1, 1, 2027));
    expect(addDays(d(28, 2, 2028), 1)).toEqual(d(29, 2, 2028));
    expect(addDays(d(1, 3, 2026), -1)).toEqual(d(28, 2, 2026));
  });

  it('returns the same day for 0', () => {
    expect(addDays(d(28, 9, 2026), 0)).toEqual(d(28, 9, 2026));
  });

  it('rejects a day count that is not a whole number', () => {
    expect(() => addDays(d(28, 9, 2026), 1.5)).toThrow(RangeError);
    expect(() => addDays(d(28, 9, 2026), Number.NaN)).toThrow(RangeError);
  });

  it('rejects a result before 1900', () => {
    expect(addDays(d(2, 1, 1900), -1)).toEqual(d(1, 1, 1900));
    expect(() => addDays(d(1, 1, 1900), -1)).toThrow(RangeError);
  });

  it('rejects a result after 2100', () => {
    expect(addDays(d(30, 12, 2100), 1)).toEqual(d(31, 12, 2100));
    expect(() => addDays(d(31, 12, 2100), 1)).toThrow(RangeError);
  });

  it('rejects a very large day count instead of returning NaN', () => {
    expect(() => addDays(d(28, 9, 2026), 1e12)).toThrow(RangeError);
    expect(() => addDays(d(28, 9, 2026), -1e12)).toThrow(RangeError);
    expect(() => addDays(d(28, 9, 2026), Number.MAX_SAFE_INTEGER)).toThrow(RangeError);
  });
});

describe('weekdayOf', () => {
  it('numbers Monday 1 to Sunday 7', () => {
    expect(weekdayOf(d(28, 9, 2026))).toBe(1);
    expect(weekdayOf(d(26, 9, 2026))).toBe(6);
    expect(weekdayOf(d(27, 9, 2026))).toBe(7);
  });

  it('walks a whole week in order, and knows 29 February', () => {
    const week = [21, 22, 23, 24, 25, 26, 27].map((day) => weekdayOf(d(day, 9, 2026)));
    expect(week).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(weekdayOf(d(29, 2, 2024))).toBe(4);
    expect(weekdayOf(d(1, 3, 2024))).toBe(5);
  });

  it('stays in 1 to 7 before 1970, where day numbers are negative', () => {
    expect(weekdayOf(d(31, 12, 1969))).toBe(3);
    expect(weekdayOf(d(28, 12, 1969))).toBe(7);
    expect(weekdayOf(d(22, 12, 1969))).toBe(1);
    expect(weekdayOf(d(1, 1, 1900))).toBe(1);
  });
});

describe('daysBetween', () => {
  it('counts calendar days from the first date to the second, negative when earlier', () => {
    expect(daysBetween(d(26, 9, 2026), d(28, 9, 2026))).toBe(2);
    expect(daysBetween(d(28, 9, 2026), d(26, 9, 2026))).toBe(-2);
    expect(daysBetween(d(28, 9, 2026), d(28, 9, 2026))).toBe(0);
    expect(daysBetween(d(31, 12, 2026), d(1, 1, 2027))).toBe(1);
  });
});

/** Each mark as `kind dd/mm/yyyy–dd/mm/yyyy`, so a whole split reads as one literal list. */
const marksOf = (marks: readonly Period[]) =>
  marks.map(({ kind, start, end }) => `${kind} ${formatDate(start)}–${formatDate(end)}`);

describe('chartMarks', () => {
  it('gives a day one mark, itself', () => {
    expect(marksOf(chartMarks(periodOf('day', calendarDate(2027, 1, 13))))).toEqual([
      'day 13/01/2027–13/01/2027',
    ]);
  });

  it('splits a week into its 7 days, across a year end too', () => {
    expect(marksOf(chartMarks(periodOf('week', calendarDate(2026, 12, 31))))).toEqual([
      'day 28/12/2026–28/12/2026',
      'day 29/12/2026–29/12/2026',
      'day 30/12/2026–30/12/2026',
      'day 31/12/2026–31/12/2026',
      'day 01/01/2027–01/01/2027',
      'day 02/01/2027–02/01/2027',
      'day 03/01/2027–03/01/2027',
    ]);
  });

  it('splits a month into its days', () => {
    const marks = chartMarks(periodOf('month', calendarDate(2028, 2, 1)));
    expect(marks).toHaveLength(29);
    expect(marksOf([marks[0]!, marks[28]!])).toEqual([
      'day 01/02/2028–01/02/2028',
      'day 29/02/2028–29/02/2028',
    ]);
  });

  it('splits a year into its 12 months', () => {
    const marks = chartMarks(periodOf('year', calendarDate(2027, 5, 5)));
    expect(marks).toHaveLength(12);
    expect(marksOf([marks[0]!, marks[1]!, marks[11]!])).toEqual([
      'month 01/01/2027–31/01/2027',
      'month 01/02/2027–28/02/2027',
      'month 01/12/2027–31/12/2027',
    ]);
  });

  it('splits a custom range of up to 31 days into days', () => {
    const marks = chartMarks(customPeriod(calendarDate(2027, 1, 1), calendarDate(2027, 1, 31)));
    expect(marks).toHaveLength(31);
    expect(marksOf([marks[30]!])).toEqual(['day 31/01/2027–31/01/2027']);
  });

  it('splits a longer custom range into months, cutting the first and last to the range', () => {
    expect(
      marksOf(chartMarks(customPeriod(calendarDate(2027, 1, 1), calendarDate(2027, 2, 1)))),
    ).toEqual(['month 01/01/2027–31/01/2027', 'custom 01/02/2027–01/02/2027']);
    expect(
      marksOf(chartMarks(customPeriod(calendarDate(2026, 11, 20), calendarDate(2027, 2, 15)))),
    ).toEqual([
      'custom 20/11/2026–30/11/2026',
      'month 01/12/2026–31/12/2026',
      'month 01/01/2027–31/01/2027',
      'custom 01/02/2027–15/02/2027',
    ]);
  });

  it('splits a range across a year end into days when it is short', () => {
    const marks = chartMarks(customPeriod(calendarDate(2026, 12, 15), calendarDate(2027, 1, 10)));
    expect(marks).toHaveLength(27);
    expect(marksOf([marks[16]!, marks[17]!])).toEqual([
      'day 31/12/2026–31/12/2026',
      'day 01/01/2027–01/01/2027',
    ]);
  });
});

describe('reportMarks', () => {
  for (const golden of REPORT_MARKS_GOLDEN_CASES) {
    it(`${golden.id}: ${formatPeriodValue(golden.period)}`, () => {
      expect(reportMarks(golden.period).map(({ start, end }) => [start, end])).toEqual(
        golden.marks,
      );
    });
  }

  it('keeps a whole week as a week and makes a week cut at the month edge custom', () => {
    expect(marksOf(reportMarks(periodOf('month', calendarDate(2027, 1, 1))).slice(0, 2))).toEqual([
      'custom 01/01/2027–03/01/2027',
      'week 04/01/2027–10/01/2027',
    ]);
  });

  it('marks a day, a week, a year and a custom range as the chart does', () => {
    for (const period of [
      periodOf('day', calendarDate(2027, 1, 13)),
      periodOf('week', calendarDate(2026, 12, 31)),
      periodOf('year', calendarDate(2027, 1, 1)),
      customPeriod(calendarDate(2027, 1, 1), calendarDate(2027, 1, 31)),
      customPeriod(calendarDate(2027, 1, 1), calendarDate(2027, 2, 1)),
    ]) {
      expect(reportMarks(period)).toEqual(chartMarks(period));
    }
  });
});
