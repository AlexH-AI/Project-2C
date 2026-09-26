import { describe, expect, it } from 'vitest';
import {
  calendarDate,
  customPeriod,
  formatDate,
  formatPeriodLabel,
  fromLocalDate,
  parseDate,
  periodOf,
  shift,
  switchKind,
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

describe('formatPeriodLabel', () => {
  it('labels each kind', () => {
    expect(formatPeriodLabel(periodOf('day', d(28, 9, 2026)))).toBe('28/09/2026');
    expect(formatPeriodLabel(periodOf('week', d(28, 9, 2026)))).toBe('28/09 – 04/10/2026');
    expect(formatPeriodLabel(periodOf('month', d(28, 9, 2026)))).toBe('Tháng 09/2026');
    expect(formatPeriodLabel(periodOf('year', d(28, 9, 2026)))).toBe('Năm 2026');
  });

  it('writes both years when a range crosses the new year', () => {
    expect(formatPeriodLabel(periodOf('week', d(31, 12, 2026)))).toBe('28/12/2026 – 03/01/2027');
  });

  it('labels a custom range like a week', () => {
    expect(formatPeriodLabel(customPeriod(d(1, 9, 2026), d(10, 9, 2026)))).toBe(
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

describe('fromLocalDate', () => {
  it('reads the local calendar day of a JS date', () => {
    expect(fromLocalDate(new Date(2026, 8, 28, 23, 59))).toEqual(d(28, 9, 2026));
  });
});
