import type { AppointmentRecord } from '@p2c/db';
import type { CalendarDate, Person } from '@p2c/domain';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { BackgroundJob, JobKind } from './background-jobs';
import { headsUp, leftText, pillText, shownJobs, watchMinute } from './heads-up';

const day = (month: number, dayOfMonth: number): CalendarDate => ({
  year: 2026,
  month,
  day: dayOfMonth,
});

/** Tuesday 10/11/2026, 13:35 by the local clock, as in the mockup. */
const NOW = new Date(2026, 10, 10, 13, 35);
const TODAY = day(11, 10);

const people: Person[] = [
  { id: 'rm1', name: 'Hoàng Văn Tùng', role: 'RM', teamId: 't1' },
  { id: 'rm2', name: 'Đỗ Khánh Linh', role: 'RM', teamId: 't1' },
  { id: 'rm3', name: 'Lê Minh Khang', role: 'RM', teamId: 't2' },
];

const appointment = (
  id: string,
  rmId: string,
  date: CalendarDate,
  time: string | null,
  extra: Partial<AppointmentRecord> = {},
): AppointmentRecord => ({
  id,
  customerId: `c-${id}`,
  rmId,
  coordinatorIds: [],
  date,
  time,
  status: 'SCHEDULED',
  triggerType: 'OTHER',
  triggerNote: null,
  stageAfter: null,
  expectedCaseSize: null,
  nextStep: null,
  note: '',
  rescheduledFromId: null,
  outcomeReviewerId: null,
  ...extra,
});

// The day of the mockup: 09:00 met, 10:30 passed with no outcome, 14:00 next, 15:00 and 16:30 ahead.
const DAY = [
  appointment('a1630', 'rm1', TODAY, '16:30'),
  appointment('a0900', 'rm1', TODAY, '09:00', { status: 'MET', stageAfter: 'N2' }),
  appointment('a1500', 'rm3', TODAY, '15:00'),
  appointment('a1030', 'rm2', TODAY, '10:30'),
  appointment('a1400', 'rm1', TODAY, '14:00'),
  appointment('tomorrow', 'rm3', day(11, 11), '09:00'),
  appointment('yesterday', 'rm2', day(11, 9), '11:00'),
];

const ids = (rows: readonly { appointment: AppointmentRecord }[]) =>
  rows.map((row) => row.appointment.id);

describe('headsUp', () => {
  it('gives the next appointment of the scope and the minutes until it starts', () => {
    const all = headsUp(DAY, people, { kind: 'all' }, NOW);
    expect(all.next?.appointment.id).toBe('a1400');
    expect(all.next?.minutesLeft).toBe(25);
    // Team t2 has only 15:00 today; RM rm2's next is on no day at all.
    const team = headsUp(DAY, people, { kind: 'team', teamId: 't2' }, NOW);
    expect(team.next?.appointment.id).toBe('a1500');
    expect(team.next?.minutesLeft).toBe(85);
    expect(headsUp(DAY, people, { kind: 'rm', rmId: 'rm2' }, NOW).next).toBeNull();
  });

  it('lists the day of the scope by time, the next one and the ones passed with no outcome marked', () => {
    const all = headsUp(DAY, people, { kind: 'all' }, NOW);
    expect(all.today.map((row) => [row.appointment.id, row.state])).toEqual([
      ['a0900', 'met'],
      ['a1030', 'unrecorded'],
      ['a1400', 'next'],
      ['a1500', 'planned'],
      ['a1630', 'planned'],
    ]);
    expect(ids(headsUp(DAY, people, { kind: 'team', teamId: 't1' }, NOW).today)).toEqual([
      'a0900',
      'a1030',
      'a1400',
      'a1630',
    ]);
  });

  it('counts every session passed with no outcome, today and before', () => {
    expect(headsUp(DAY, people, { kind: 'all' }, NOW).unrecorded).toBe(2);
    expect(headsUp(DAY, people, { kind: 'rm', rmId: 'rm1' }, NOW).unrecorded).toBe(0);
  });

  it('gives the next of a later day once none is left today', () => {
    const evening = new Date(2026, 10, 10, 17, 0);
    const late = headsUp(DAY, people, { kind: 'all' }, evening);
    expect(late.next).toEqual({ appointment: DAY[5], minutesLeft: null });
    expect(late.today.map((row) => row.state)).toEqual([
      'met',
      'unrecorded',
      'unrecorded',
      'unrecorded',
      'unrecorded',
    ]);
    expect(late.unrecorded).toBe(5);
  });

  it('keeps an appointment due this very minute as the next, with no minute left', () => {
    const at = headsUp(DAY, people, { kind: 'all' }, new Date(2026, 10, 10, 14, 0));
    expect(at.next).toMatchObject({ appointment: { id: 'a1400' }, minutesLeft: 0 });
    const after = headsUp(DAY, people, { kind: 'all' }, new Date(2026, 10, 10, 14, 1));
    expect(after.next?.appointment.id).toBe('a1500');
  });

  it('puts one with no time after the timed ones of its day, never passed while the day lasts', () => {
    const noTime = appointment('none', 'rm1', TODAY, null);
    const day = [noTime, ...DAY];
    const all = headsUp(day, people, { kind: 'all' }, NOW);
    expect(ids(all.today).at(-1)).toBe('none');
    expect(all.today.at(-1)?.state).toBe('planned');
    // Late in the day it is the next one, with no minutes to count.
    const late = headsUp(day, people, { kind: 'all' }, new Date(2026, 10, 10, 23, 0));
    expect(late.next).toEqual({ appointment: noTime, minutesLeft: null });
    expect(late.today.at(-1)?.state).toBe('next');
    // The day after, it has passed with no outcome.
    const after = headsUp(day, people, { kind: 'all' }, new Date(2026, 10, 11, 8, 0));
    expect(after.unrecorded).toBe(6);
  });

  it('gives nothing for a scope with no appointment', () => {
    expect(headsUp([], people, { kind: 'all' }, NOW)).toEqual({
      next: null,
      today: [],
      unrecorded: 0,
    });
  });
});

describe('leftText', () => {
  it('says the minutes, then the hours and minutes', () => {
    expect(leftText(25)).toBe('còn 25 phút');
    expect(leftText(0)).toBe('đến giờ');
    expect(leftText(60)).toBe('còn 1 giờ');
    expect(leftText(85)).toBe('còn 1 giờ 25 phút');
  });
});

describe('pillText', () => {
  const name = (a: AppointmentRecord) => `KH ${a.id}`;
  const pill = (now: Date, narrow: boolean) =>
    pillText(headsUp(DAY, people, { kind: 'all' }, now), now, narrow, name);

  it('names the next of today, its time and the time left; a narrow window leaves the name out', () => {
    expect(pill(NOW, false)).toMatchObject({
      today: true,
      what: '14:00',
      who: 'KH a1400',
      text: '14:00 KH a1400 · còn 25 phút',
    });
    expect(pill(NOW, true)).toMatchObject({ what: '14:00', who: '', text: '14:00 còn 25 phút' });
  });

  // Review of PR 1493: only the name of a customer goes, never "Hết lịch hôm nay".
  it('keeps "Hết lịch hôm nay" and the day of the next in a narrow window', () => {
    const evening = new Date(2026, 10, 10, 17, 0);
    for (const narrow of [false, true]) {
      expect(pill(evening, narrow)).toEqual({
        today: false,
        what: '',
        who: 'Hết lịch hôm nay',
        when: 'kế tiếp T4 11/11 09:00',
        text: 'Hết lịch hôm nay · kế tiếp T4 11/11 09:00',
      });
    }
    const none = pillText(headsUp([], people, { kind: 'all' }, NOW), NOW, true, name);
    expect(none.text).toBe('Không có lịch hẹn sắp tới');
  });
});

describe('shownJobs', () => {
  // Review of PR 1505: failed, then the customer deleted, the pill named nobody.
  it('leaves out an analysis of a customer no longer there, and only that', () => {
    const job = (id: number, kind: JobKind, customerId?: string): BackgroundJob => ({
      id,
      key: `${kind}:${id}`,
      kind,
      customerId,
      state: 'failed',
      shown: true,
      changed: id,
    });
    const jobs = [
      job(1, 'ai', 'c-kept'),
      job(2, 'ai', 'c-gone'),
      job(3, 'backup'),
      job(4, 'export'),
    ];
    expect(shownJobs(jobs, [{ id: 'c-kept' }]).map((shown) => shown.id)).toEqual([1, 3, 4]);
    expect(shownJobs(jobs, [{ id: 'c-kept' }, { id: 'c-gone' }])).toEqual(jobs);
  });
});

/** Stand-in for `document`: only its events and visibility matter. */
class FakeDocument extends EventTarget {
  visibilityState: DocumentVisibilityState = 'visible';
}

describe('watchMinute', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date(2026, 10, 10, 13, 35, 20) });
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  const setup = () => {
    const events = { window: new EventTarget(), document: new FakeDocument() };
    const clock = watchMinute(() => new Date(), events);
    const listener = vi.fn();
    return { events, clock, listener, unsubscribe: clock.subscribe(listener) };
  };

  it('gives the same moment while its minute lasts, the next one as it starts', () => {
    const { clock, listener } = setup();
    const first = clock.current();
    vi.advanceTimersByTime(39_000);
    expect(listener).not.toHaveBeenCalled();
    expect(clock.current()).toBe(first);
    vi.advanceTimersByTime(1_000);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(clock.current()).toEqual(new Date(2026, 10, 10, 13, 36));
  });

  // Review of PR 1493: a timer does not run while the machine sleeps, as `watchToday` says.
  it('reads the clock again when the window gets focus or turns visible, and waits from there', () => {
    const { events, clock, listener } = setup();
    vi.setSystemTime(new Date(2026, 10, 11, 8, 0, 30));
    events.document.visibilityState = 'hidden';
    events.document.dispatchEvent(new Event('visibilitychange'));
    expect(listener).not.toHaveBeenCalled();

    events.document.visibilityState = 'visible';
    events.document.dispatchEvent(new Event('visibilitychange'));
    expect(listener).toHaveBeenCalledTimes(1);
    expect(clock.current()).toEqual(new Date(2026, 10, 11, 8, 0, 30));
    // The same minute again: nothing to tell.
    events.window.dispatchEvent(new Event('focus'));
    expect(listener).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(30_000);
    expect(listener).toHaveBeenCalledTimes(2);
    expect(clock.current()).toEqual(new Date(2026, 10, 11, 8, 1));

    vi.setSystemTime(new Date(2026, 10, 11, 9, 15, 10));
    events.window.dispatchEvent(new Event('focus'));
    expect(listener).toHaveBeenCalledTimes(3);
    expect(clock.current()).toEqual(new Date(2026, 10, 11, 9, 15, 10));
  });

  it('stops its timer and its event listeners on unsubscribe', () => {
    const { events, listener, unsubscribe } = setup();
    expect(vi.getTimerCount()).toBe(1);
    unsubscribe();
    expect(vi.getTimerCount()).toBe(0);
    vi.setSystemTime(new Date(2026, 10, 11, 8, 0));
    events.window.dispatchEvent(new Event('focus'));
    events.document.dispatchEvent(new Event('visibilitychange'));
    expect(listener).not.toHaveBeenCalled();
  });
});
