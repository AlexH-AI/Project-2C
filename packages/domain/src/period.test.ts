import { describe, expect, it } from 'vitest';
import {
  addDays,
  calendarDate,
  compareDates,
  customPeriod,
  daysBetween,
  formatDate,
  formatDayMonth,
  formatDayOfMonth,
  formatLocalDateTime,
  formatPeriodValue,
  fromLocalDate,
  localFileStamp,
  isInPeriod,
  monthToDate,
  parseDate,
  parseQuickDate,
  periodOf,
  shift,
  switchKind,
  weekdayOf,
  type Period,
} from './period';

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

describe('customPeriod', () => {
  it('rejects a start after the end instead of swapping them', () => {
    expect(() => customPeriod(d(2, 9, 2026), d(1, 9, 2026))).toThrow(
      'Custom period start 02/09/2026 is after its end 01/09/2026',
    );
  });

  it('allows a single day', () => {
    expect(range(customPeriod(d(2, 9, 2026), d(2, 9, 2026)))).toBe('02/09/2026 – 02/09/2026');
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
