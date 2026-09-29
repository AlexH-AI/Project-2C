import { describe, expect, it } from 'vitest';
import { calendarDate, formatDate, type CalendarDate } from '@p2c/domain';
import type { CustomerRecord } from '@p2c/db';
import { parseTime, readScheduleDate, searchCustomers } from './appointment-form';

const d = (day: number, month: number, year: number) => calendarDate(year, month, day);
const TODAY = d(26, 9, 2026);

function ok(result: ReturnType<typeof readScheduleDate>) {
  if (!result.ok) throw new Error(`expected a date, got ${result.error}`);
  return result;
}

describe('readScheduleDate', () => {
  it('reads dd/mm in this year with the weekday and days from today', () => {
    const result = ok(readScheduleDate('28/9', TODAY));
    expect(formatDate(result.date)).toBe('28/09/2026');
    expect(result.weekday).toBe(1);
    expect(result.daysFromToday).toBe(2);
    expect(result.suggestion).toBeNull();
  });

  it('accepts a day already past and offers next year only when long past and no year typed', () => {
    const recent = ok(readScheduleDate('20/9', TODAY));
    expect(recent.daysFromToday).toBe(-6);
    expect(recent.suggestion).toBeNull();

    const old = ok(readScheduleDate('5/1', TODAY));
    expect(old.daysFromToday).toBe(-264);
    expect(formatDate(old.suggestion as CalendarDate)).toBe('05/01/2027');

    expect(ok(readScheduleDate('5/1/2026', TODAY)).suggestion).toBeNull();
  });

  it('passes the parser errors through', () => {
    expect(readScheduleDate('', TODAY)).toEqual({ ok: false, error: 'empty' });
    expect(readScheduleDate('28-9', TODAY)).toEqual({ ok: false, error: 'format' });
    expect(readScheduleDate('29/02', TODAY)).toEqual({ ok: false, error: 'invalid-date' });
  });
});

describe('parseTime', () => {
  it('reads hh:mm, padding the hour, and empty as no time', () => {
    expect(parseTime('14:00')).toEqual({ ok: true, time: '14:00' });
    expect(parseTime(' 9:30 ')).toEqual({ ok: true, time: '09:30' });
    expect(parseTime('')).toEqual({ ok: true, time: null });
  });

  it('refuses an hour or minute out of range and other text', () => {
    for (const text of ['25:00', '12:60', '1400', 'abc', '12:5']) {
      expect(parseTime(text)).toEqual({ ok: false });
    }
  });
});

describe('searchCustomers', () => {
  const customer = (name: string, code: string) => ({ name, code }) as CustomerRecord;
  const all = [
    customer('Trịnh Minh Anh', 'K-9A1C'),
    customer('Lê Hoài Nam', 'K-M2D8'),
    customer('Đỗ Minh Khang', 'K-0001'),
  ];

  it('matches a part of the name or the code, ignoring accents and case', () => {
    expect(searchCustomers(all, 'minh', 10).map((c) => c.name)).toEqual([
      'Trịnh Minh Anh',
      'Đỗ Minh Khang',
    ]);
    expect(searchCustomers(all, 'do minh', 10).map((c) => c.code)).toEqual(['K-0001']);
    expect(searchCustomers(all, 'k-m2', 10).map((c) => c.name)).toEqual(['Lê Hoài Nam']);
  });

  it('returns nothing for empty text and no more than the limit', () => {
    expect(searchCustomers(all, '  ', 10)).toEqual([]);
    expect(searchCustomers(all, 'k-', 2)).toHaveLength(2);
  });
});
