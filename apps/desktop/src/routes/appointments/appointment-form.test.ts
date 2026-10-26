import { describe, expect, it } from 'vitest';
import { calendarDate, formatDate, type CalendarDate } from '@p2c/domain';
import type { AppointmentRecord, CustomerRecord } from '@p2c/db';
import type { StageTransition } from '@p2c/domain';
import {
  dayText,
  isPastOrToday,
  parseTime,
  prefill,
  priorMeetings,
  readScheduleDate,
  rescheduleReason,
  searchCustomers,
  withTime,
  writtenDay,
} from './appointment-form';

const d = (day: number, month: number, year: number) => calendarDate(year, month, day);
const TODAY = d(26, 9, 2026);

function ok(result: ReturnType<typeof readScheduleDate>) {
  if (!result.ok) throw new Error(`expected a date, got ${result.error}`);
  return result;
}

describe('readScheduleDate (any day)', () => {
  it('reads dd/mm in this year with the weekday and days from today', () => {
    const result = ok(readScheduleDate('28/9', TODAY, 'any'));
    expect(formatDate(result.date)).toBe('28/09/2026');
    expect(result.weekday).toBe(1);
    expect(result.daysFromToday).toBe(2);
    expect(result.suggestion).toBeNull();
  });

  it('accepts a day already past and offers next year only when long past and no year typed', () => {
    const recent = ok(readScheduleDate('20/9', TODAY, 'any'));
    expect(recent.daysFromToday).toBe(-6);
    expect(recent.suggestion).toBeNull();

    const old = ok(readScheduleDate('5/1', TODAY, 'any'));
    expect(old.daysFromToday).toBe(-264);
    expect(formatDate(old.suggestion as CalendarDate)).toBe('05/01/2027');

    expect(ok(readScheduleDate('5/1/2026', TODAY, 'any')).suggestion).toBeNull();
  });

  it('passes the parser errors through', () => {
    expect(readScheduleDate('', TODAY, 'any')).toEqual({ ok: false, error: 'empty' });
    expect(readScheduleDate('28-9', TODAY, 'any')).toEqual({ ok: false, error: 'format' });
    expect(readScheduleDate('29/02', TODAY, 'any')).toEqual({ ok: false, error: 'invalid-date' });
  });

  it('offers 29/02 next year when this year has none and February is long past (DR-39)', () => {
    expect(readScheduleDate('29/02', d(15, 12, 2027), 'fromToday')).toEqual({
      ok: false,
      error: 'invalid-date',
      suggestion: d(29, 2, 2028),
    });
  });
});

describe('readScheduleDate (from today)', () => {
  it('accepts today and later', () => {
    expect(ok(readScheduleDate('26/9', TODAY, 'fromToday')).daysFromToday).toBe(0);
    expect(ok(readScheduleDate('1/10', TODAY, 'fromToday')).daysFromToday).toBe(5);
  });

  it('refuses a past day without changing it; still suggests next year when long past', () => {
    const recent = readScheduleDate('20/9', TODAY, 'fromToday');
    expect(recent).toMatchObject({ ok: false, error: 'past', suggestion: null });

    const old = readScheduleDate('20/6', TODAY, 'fromToday');
    if (old.ok || old.error !== 'past') throw new Error('expected a past day');
    expect(formatDate(old.suggestion as CalendarDate)).toBe('20/06/2027');
  });

  it('refuses the prefilled day of an appointment from an earlier year; never makes it a future one', () => {
    const lastYear = readScheduleDate(dayText(d(5, 11, 2025), TODAY), TODAY, 'fromToday');
    expect(lastYear).toMatchObject({ ok: false, error: 'past', suggestion: null });
    if (lastYear.ok || lastYear.error !== 'past') throw new Error('expected a past day');
    expect(formatDate(lastYear.date)).toBe('05/11/2025');

    const leapDay = readScheduleDate(dayText(d(29, 2, 2024), TODAY), TODAY, 'fromToday');
    expect(leapDay).toMatchObject({ ok: false, error: 'past', suggestion: null });
  });
});

// ADR-0007 appendix "Ngày nhanh đầu năm" (Owner 23/10/2026; 6e: 25/10/2026, review of PR 824).
describe('readScheduleDate (early in the year)', () => {
  const NEW_YEAR = d(2, 1, 2027);

  it('offers last year for a day not yet come where a day past can be kept (6b, 6e)', () => {
    for (const mode of ['any', 'reschedule'] as const) {
      const read = ok(readScheduleDate('28/12', NEW_YEAR, mode));
      expect(read.date).toEqual(d(28, 12, 2027));
      expect(read.daysFromToday).toBe(360);
      expect(read.suggestion).toEqual(d(28, 12, 2026));
      expect(ok(readScheduleDate('15/03', NEW_YEAR, mode)).suggestion).toBeNull();
    }
  });

  it('offers no last year to the next appointment, which takes no day past (6h)', () => {
    expect(ok(readScheduleDate('28/12', NEW_YEAR, 'fromToday')).suggestion).toBeNull();
  });

  it('refuses the day last year as a new day until "Nhập bù" is ticked (6e)', () => {
    expect(readScheduleDate('28/12/2026', NEW_YEAR, 'reschedule')).toMatchObject({
      ok: false,
      error: 'past',
      date: d(28, 12, 2026),
    });
    expect(ok(readScheduleDate('28/12/2026', NEW_YEAR, 'any')).daysFromToday).toBe(-5);
    // Long past, still next year's, as on 6h.
    expect(readScheduleDate('20/6', TODAY, 'reschedule')).toMatchObject({
      error: 'past',
      suggestion: d(20, 6, 2027),
    });
  });
});

// Phase 3 spec §4, rule 4 of T-291 (Owner 25/10/2026, review of PR 824): the preview line of 6e.
describe('rescheduleReason', () => {
  it('is the reason as "Dời lịch" stores it: trimmed as typed, none when it shows nothing', () => {
    expect(rescheduleReason('  KH đi công tác ')).toBe('KH đi công tác');
    expect(rescheduleReason('\u{85}KH\u{3164}bận ')).toBe('\u{85}KH\u{3164}bận');
    for (const reason of ['', '  ', '\u{3164}', '\u{2800}', '\u{FE0F}', '\u{85}']) {
      expect(rescheduleReason(reason)).toBeNull();
    }
  });
});

// DR6-38: a dialog opened on 31/12 and saved after midnight.
describe('readScheduleDate (a prefilled day across New Year)', () => {
  const OPENED = d(31, 12, 2026);
  const NEXT_YEAR = d(1, 1, 2027);

  it('reads the day left as filled in as the saved one, not the same day next year (6f)', () => {
    const filled = prefill(d(20, 12, 2026), OPENED);
    expect(filled.text).toBe('20/12');
    const read = ok(readScheduleDate(filled.text, NEXT_YEAR, 'any', filled));
    expect(read.date).toEqual(d(20, 12, 2026));
    expect(read.daysFromToday).toBe(-12);
    expect(read.suggestion).toBeNull();
  });

  it('refuses the filled-in day of a next appointment once it has passed (6h)', () => {
    const filled = prefill(OPENED, OPENED);
    expect(ok(readScheduleDate(filled.text, OPENED, 'fromToday', filled)).daysFromToday).toBe(0);
    expect(readScheduleDate(filled.text, NEXT_YEAR, 'fromToday', filled)).toMatchObject({
      ok: false,
      error: 'past',
      date: OPENED,
      suggestion: null,
    });
  });

  it('still offers next year for a filled-in day long past, as when the dialog opened (6h)', () => {
    const filled = prefill(d(20, 6, 2026), OPENED);
    const read = readScheduleDate(filled.text, NEXT_YEAR, 'fromToday', filled);
    expect(read).toMatchObject({ ok: false, error: 'past', date: d(20, 6, 2026) });
    expect('suggestion' in read && read.suggestion).toEqual(d(20, 6, 2027));
  });

  it('reads a day typed over the filled-in one against today', () => {
    const filled = prefill(d(20, 12, 2026), OPENED);
    expect(ok(readScheduleDate('5/1', NEXT_YEAR, 'any', filled)).date).toEqual(d(5, 1, 2027));
    expect(ok(readScheduleDate('20/12', NEXT_YEAR, 'any')).date).toEqual(d(20, 12, 2027));
  });
});

describe('dayText', () => {
  it('drops the year only when it is this year', () => {
    expect(dayText(d(20, 9, 2026), TODAY)).toBe('20/09');
    expect(dayText(d(5, 11, 2025), TODAY)).toBe('05/11/2025');
    expect(dayText(d(3, 1, 2027), TODAY)).toBe('03/01/2027');
  });
});

describe('writtenDay', () => {
  // The Lịch hẹn card of a profile puts the time of a day written with its year under it (T-298).
  it('is `dayText`, and says whether it wrote the year', () => {
    expect(writtenDay(d(20, 9, 2026), TODAY)).toEqual({ text: '20/09', withYear: false });
    expect(writtenDay(d(5, 11, 2025), TODAY)).toEqual({ text: '05/11/2025', withYear: true });
    expect(writtenDay(d(3, 1, 2027), TODAY)).toEqual({ text: '03/01/2027', withYear: true });
  });
});

describe('withTime', () => {
  it('adds the time after the day, and leaves an untimed day alone', () => {
    expect(withTime('20/09', '14:00')).toBe('20/09 14:00');
    expect(withTime('20/09', null)).toBe('20/09');
  });
});

describe('parseTime', () => {
  it('reads hh:mm, padding the hour, and empty as no time', () => {
    expect(parseTime('14:00')).toEqual({ ok: true, time: '14:00' });
    expect(parseTime(' 9:30 ')).toEqual({ ok: true, time: '09:30' });
    expect(parseTime('')).toEqual({ ok: true, time: null });
    expect(parseTime('23:59')).toEqual({ ok: true, time: '23:59' });
    expect(parseTime('0:00')).toEqual({ ok: true, time: '00:00' });
  });

  it('refuses an hour or minute out of range and other text', () => {
    for (const text of ['24:00', '25:00', '12:60', '1400', 'abc', '12:5']) {
      expect(parseTime(text)).toEqual({ ok: false });
    }
  });
});

describe('isPastOrToday', () => {
  it('is true for today and earlier', () => {
    expect(isPastOrToday(TODAY, TODAY)).toBe(true);
    expect(isPastOrToday(d(25, 9, 2026), TODAY)).toBe(true);
    expect(isPastOrToday(d(27, 9, 2026), TODAY)).toBe(false);
  });
});

let seq = 0;
function appt(customerId: string, date: CalendarDate, time: string | null, extra = {}) {
  seq += 1;
  return {
    id: `A${seq}`,
    customerId,
    reId: 'RE1',
    coordinatorIds: [],
    date,
    time,
    status: 'MET',
    triggerType: 'OTHER',
    triggerNote: null,
    stageAfter: null,
    expectedCaseSize: null,
    nextStep: null,
    note: '',
    rescheduledFromId: null,
    outcomeReviewerId: null,
    ...extra,
  } as AppointmentRecord;
}

describe('priorMeetings', () => {
  const move = {
    customerId: 'C1',
    appointmentId: 'A2',
    from: 'N2',
    to: 'N1',
    date: d(14, 9, 2026),
  } as unknown as StageTransition;

  const appointments = [
    appt('C1', d(1, 6, 2026), '10:00'),
    appt('C1', d(14, 9, 2026), '10:00', { stageAfter: 'N1' }),
    appt('C1', d(20, 6, 2026), null, { status: 'NO_SHOW' }),
    appt('C2', d(15, 9, 2026), '09:00'),
    appt('C1', d(14, 9, 2026), '15:00', { status: 'CANCELLED' }),
    appt('C1', d(26, 9, 2026), '16:00', { status: 'SCHEDULED' }),
    appt('C1', d(27, 9, 2026), '09:00', { status: 'SCHEDULED' }),
    appt('C1', d(14, 9, 2026), null, { status: 'CANCELLED' }),
  ];

  it("lists the customer's appointments up to today, newest first, and counts the ones met", () => {
    const history = priorMeetings({ appointments, transitions: [move] }, 'C1', TODAY);
    expect(history.rows.map((r) => [formatDate(r.appointment.date), r.appointment.time])).toEqual([
      ['26/09/2026', '16:00'],
      ['14/09/2026', '15:00'],
      ['14/09/2026', '10:00'],
      ['14/09/2026', null],
      ['20/06/2026', null],
      ['01/06/2026', '10:00'],
    ]);
    expect(history.rows[2]?.outcome).toMatchObject({ kind: 'move', from: 'N2', to: 'N1' });
    expect(history.metCount).toBe(2);
    expect(formatDate(history.lastMet as CalendarDate)).toBe('14/09/2026');
  });

  it('has no last meeting for a customer never met', () => {
    const history = priorMeetings({ appointments, transitions: [] }, 'C3', TODAY);
    expect(history).toEqual({ rows: [], metCount: 0, lastMet: null });
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
    expect(searchCustomers(all, '  nam ', 10).map((c) => c.name)).toEqual(['Lê Hoài Nam']);
  });

  it('returns nothing for empty text and no more than the limit', () => {
    expect(searchCustomers(all, '  ', 10)).toEqual([]);
    expect(searchCustomers(all, 'k-', 2)).toHaveLength(2);
  });
});
