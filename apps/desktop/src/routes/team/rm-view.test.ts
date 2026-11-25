import type { AppointmentRecord, CustomerRecord } from '@p2c/db';
import {
  calendarDate,
  periodOf,
  type Appointment,
  type CalendarDate,
  type Customer,
  type Person,
  type Policy,
  type StageTransition,
} from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import {
  APPOINTMENTS_B,
  CUSTOMERS_B,
  PEOPLE,
  POLICY_ROWS_B,
  STAGE_TRANSITIONS_B,
} from '../../../../../packages/domain/src/golden/metrics.fixture';
import {
  NO_DAY,
  appointmentsByCustomer,
  cadence,
  cadenceLabel,
  cadenceWeekTitle,
  lastMetKey,
  nextKey,
  rmView,
  type RmCustomer,
} from './rm-view';

const record = (customer: Customer): CustomerRecord => ({
  ...customer,
  code: `K-${customer.id}`,
  birthDate: null,
  gender: null,
});

const asRecord = (appointment: Appointment, time: string | null = null): AppointmentRecord => ({
  ...appointment,
  time,
  triggerType: 'OTHER',
  triggerNote: null,
  rescheduledFromId: null,
  outcomeReviewerId: null,
});

describe('rmView, the four numbers of the period (golden B)', () => {
  const GOLDEN_B = {
    people: PEOPLE,
    customers: CUSTOMERS_B.map(record),
    appointments: APPOINTMENTS_B.map((appointment) => asRecord(appointment)),
    policies: POLICY_ROWS_B.filter((row) => !row.deleted).map((row) => row.policy),
    transitions: STAGE_TRANSITIONS_B,
  };
  const JAN_2028 = periodOf('month', calendarDate(2028, 1, 1));
  const after = calendarDate(2028, 3, 15);

  it('RM Chi in 01/2028: Doanh số 650 tr, Tổng số HĐ 2, Tỷ lệ hủy 1/3, Tỷ lệ chốt 3/2 (G34)', () => {
    const view = rmView(GOLDEN_B, 're-chi', JAN_2028, after)!;

    expect(view.rm.name).toBe('Chi');
    expect(
      view.stats.map(({ label, value, unit, formula }) => [label, `${value}${unit}`, formula]),
    ).toEqual([
      ['Doanh số', '650tr', 'FYP phát hành 930 tr − FYP hủy 280 tr'],
      ['Tổng số HĐ', '2', '3 phát hành − 1 hủy'],
      ['Tỷ lệ hủy', '33.3%', '1 hủy ÷ 3 phát hành'],
      ['Tỷ lệ chốt', '150%', '3 HĐ phát hành ÷ 2 RF'],
    ]);
  });

  it('another period gives its own numbers: 02/2028, below 0 (G35)', () => {
    const view = rmView(GOLDEN_B, 're-chi', periodOf('month', calendarDate(2028, 2, 1)), after)!;

    expect(view.stats.map(({ value, unit, negative }) => [`${value}${unit}`, negative])).toEqual([
      ['-400tr', true],
      ['-1', true],
      ['—', false],
      ['—', false],
    ]);
  });

  it('lists only the customers the RM is in charge of', () => {
    const view = rmView(GOLDEN_B, 're-chi', JAN_2028, after)!;

    expect(view.open.map((row) => row.card.customer.name)).toEqual(['KH 12', 'KH 15']);
    expect(view.closed).toEqual([]);
  });

  it('is null for an id that is no RM: unknown, or a TL', () => {
    expect(rmView(GOLDEN_B, 'nobody', JAN_2028, after)).toBeNull();
    expect(rmView(GOLDEN_B, 'tl-ha', JAN_2028, after)).toBeNull();
  });
});

describe('rmView, the customers in charge', () => {
  const day = (month: number, dayOfMonth: number): CalendarDate =>
    calendarDate(2026, month, dayOfMonth);
  /** Tuesday 10/11/2026, the today of mockup search-rm-team.html. */
  const today = day(11, 10);
  const people: Person[] = [
    { id: 'rm-a', name: 'Hoàng Văn Tùng', role: 'RM', teamId: 't1' },
    { id: 'rm-b', name: 'Mai Phương', role: 'RM', teamId: 't1' },
  ];
  const customer = (name: string, stage: CustomerRecord['stage'], rmId = 'rm-a') =>
    record({ id: name, name, rmId, stage });
  const customers = [
    customer('An', 'N4'),
    customer('Bình', 'N3'),
    customer('Chi', 'N2'),
    customer('Dũng', 'N1'),
    customer('Em', 'ON_HOLD'),
    customer('Giang', 'LOST'),
    customer('Khoa', 'N3', 'rm-b'),
  ];
  let seq = 0;
  const meeting = (
    customerId: string,
    date: CalendarDate,
    status: Appointment['status'],
    time: string | null = null,
    rmId = 'rm-a',
  ): AppointmentRecord =>
    asRecord(
      {
        id: `ap${++seq}`,
        customerId,
        rmId,
        coordinatorIds: [],
        date,
        status,
        stageAfter: null,
        expectedCaseSize: null,
        nextStep: null,
        note: '',
      },
      time,
    );
  const appointments = [
    // 29 days ago, and once before: over four weeks.
    meeting('An', day(10, 12), 'MET'),
    meeting('An', day(9, 1), 'MET'),
    // Still scheduled, but past: not ahead.
    meeting('An', day(11, 1), 'SCHEDULED'),
    // 28 days ago: four weeks, not over.
    meeting('Bình', day(10, 13), 'MET'),
    meeting('Bình', day(11, 20), 'SCHEDULED', '09:00'),
    meeting('Bình', day(11, 12), 'SCHEDULED', '14:00'),
    // Never met; one today.
    meeting('Chi', day(10, 1), 'CANCELLED'),
    meeting('Chi', day(11, 10), 'SCHEDULED', '09:30'),
    // Met today, with another RM: the customer's meeting all the same.
    meeting('Dũng', today, 'MET', null, 'rm-b'),
    meeting('Giang', day(11, 1), 'MET'),
    meeting('Khoa', day(11, 2), 'MET', null, 'rm-b'),
  ];
  const transitions: StageTransition[] = customers.map((c, index) => ({
    id: `tr${index}`,
    customerId: c.id,
    from: null,
    to: c.stage,
    date: day(1, 2),
    appointmentId: null,
  }));
  const policy = (id: string, customerId: string, cancelled: boolean): Policy => ({
    id,
    customerId,
    rmId: 'rm-a',
    submittedDate: day(9, 1),
    submittedFyp: 10_000_000 as Policy['submittedFyp'],
    issuedDate: day(9, 15),
    issuedFyp: 10_000_000 as Policy['issuedFyp'],
    cancelledDate: cancelled ? day(10, 1) : null,
  });
  const data = {
    people,
    customers,
    appointments,
    policies: [policy('p1', 'Bình', false), policy('p2', 'Bình', true)],
    transitions,
  };
  const view = rmView(data, 'rm-a', periodOf('month', today), today)!;
  const shown = (rows: readonly RmCustomer[]) =>
    rows.map(({ card, lastMet, stale, next }) => [
      card.customer.name,
      lastMet?.daysAgo ?? null,
      stale,
      next ? [next.daysAhead, next.time] : null,
    ]);

  it('opens on the customers longest unmet, the ones never met last; over 4 weeks is flagged', () => {
    expect(shown(view.open)).toEqual([
      ['An', 29, true, null],
      ['Bình', 28, false, [2, '14:00']],
      ['Dũng', 0, false, null],
      ['Chi', null, false, [0, '09:30']],
    ]);
  });

  it('keeps Tạm hoãn and Mất cơ hội apart, in the same order', () => {
    expect(shown(view.closed)).toEqual([
      ['Giang', 9, false, null],
      ['Em', null, false, null],
    ]);
  });

  it('counts the policies of a customer as the Customers screen does: never a cancelled one', () => {
    expect(view.open.find((row) => row.card.customer.id === 'Bình')?.card.policies).toBe(1);
  });

  it('reads the day of the last meeting and of the next appointment', () => {
    const bình = view.open.find((row) => row.card.customer.id === 'Bình')!;
    expect(bình.lastMet?.date).toEqual(day(10, 13));
    expect(bình.next?.date).toEqual(day(11, 12));
  });

  // Review of PR 1485: the table writes a 0 of a number column light, as it does "Chưa gặp" and "Chưa hẹn".
  it('sorts a meeting or an appointment of today by a key that is no 0', () => {
    const row = (id: string) => view.open.find((one) => one.card.customer.id === id)!;
    expect(lastMetKey(row('Dũng')) === 0 || nextKey(row('Chi')) === 0).toBe(false);
    expect(lastMetKey(row('An'))).toBeLessThan(lastMetKey(row('Dũng')));
    expect(nextKey(row('Chi'))).toBeLessThan(nextKey(row('Bình')));
    expect(lastMetKey(row('Chi'))).toBe(NO_DAY);
  });
});

describe('cadence, the strip "Nhịp gặp · 8 tuần" (mockup search-rm-team.html #rm, #ask 8)', () => {
  const day = (month: number, dayOfMonth: number) => calendarDate(2026, month, dayOfMonth);
  /** Tuesday 10/11/2026: the strip runs from Monday 21/09 to Sunday 15/11. */
  const today = day(11, 10);
  let seq = 0;
  const on = (
    date: CalendarDate,
    status: Appointment['status'],
    customerId = 'c',
    rmId = 'rm-a',
  ): AppointmentRecord =>
    asRecord({
      id: `cad${++seq}`,
      customerId,
      rmId,
      coordinatorIds: [],
      date,
      status,
      stageAfter: null,
      expectedCaseSize: null,
      nextStep: null,
      note: '',
    });
  const appointments = [
    on(day(9, 20), 'MET'), // the Sunday before the strip
    on(day(9, 22), 'MET'),
    on(day(9, 30), 'SCHEDULED'), // past, no outcome yet
    on(day(10, 6), 'CANCELLED'),
    // A week of many: the first shape of the order wins.
    on(day(10, 21), 'NO_SHOW'),
    on(day(10, 22), 'SCHEDULED'),
    on(day(10, 20), 'MET'),
    on(day(10, 27), 'RESCHEDULED'),
    on(day(10, 28), 'SCHEDULED'),
    // Another RM's meeting, another customer's: not this RM's strip of this customer.
    on(day(11, 3), 'MET', 'c', 'rm-b'),
    on(day(11, 4), 'MET', 'other'),
    on(day(11, 9), 'CANCELLED'),
    on(today, 'SCHEDULED'),
    on(day(11, 16), 'SCHEDULED'), // next Monday
  ];
  const weeks = cadence(appointments, 'c', 'rm-a', today);

  it('gives eight weeks Monday to Sunday, the oldest first, this week last', () => {
    expect(weeks.map((week) => [week.start, week.end])).toEqual([
      [day(9, 21), day(9, 27)],
      [day(9, 28), day(10, 4)],
      [day(10, 5), day(10, 11)],
      [day(10, 12), day(10, 18)],
      [day(10, 19), day(10, 25)],
      [day(10, 26), day(11, 1)],
      [day(11, 2), day(11, 8)],
      [day(11, 9), day(11, 15)],
    ]);
  });

  it('shows each week by its first shape: met, past with no outcome, ahead, did not take place', () => {
    expect(weeks.map((week) => week.mark)).toEqual([
      'met',
      'unrecorded',
      'missed',
      'none',
      'met',
      'unrecorded',
      'none',
      'planned',
    ]);
  });

  it('gives a customer of no appointment eight empty weeks; the RM’s own, read by customer', () => {
    expect(cadence([], 'none', 'rm-a', today).map((week) => week.mark)).toEqual(
      Array(8).fill('none'),
    );
    const own = appointmentsByCustomer(appointments, 'rm-a');
    expect([...own.keys()]).toEqual(['c', 'other']);
    expect(cadence(own.get('c')!, 'c', 'rm-a', today)).toEqual(weeks);
  });

  it('reads the strip as one sentence, and each week by its days', () => {
    expect(cadenceLabel(weeks)).toBe(
      'Nhịp gặp 8 tuần, 21/09 – 15/11: 2 tuần đã gặp, 1 tuần không diễn ra, 2 tuần chưa ghi kết quả, 1 tuần có lịch',
    );
    expect(cadenceWeekTitle(weeks[0]!)).toBe('Tuần 21/09 – 27/09: đã gặp');
    expect(cadenceWeekTitle(weeks[3]!)).toBe('Tuần 12/10 – 18/10: không có lịch');
  });
});
