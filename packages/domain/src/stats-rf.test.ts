import { describe, expect, it } from 'vitest';
import {
  APPOINTMENTS,
  EXPECTED_RF_APPOINTMENT_IDS,
  GOLDEN_CASES,
  PEOPLE,
  POLICIES,
  STAGE_TRANSITIONS,
} from './golden/metrics.fixture';
import type { Appointment, CustomerStage, Person, Policy, StageTransition } from './model';
import { calendarDate, periodOf } from './period';
import { closeRate, isRfAppointment, periodMetrics, rfCount } from './stats';

const d = (day: number, month: number, year: number) => calendarDate(year, month, day);

const GOLDEN_DATA = {
  people: PEOPLE,
  policies: POLICIES,
  appointments: APPOINTMENTS,
  transitions: STAGE_TRANSITIONS,
};

describe('periodMetrics — golden examples (T-028)', () => {
  it.each(GOLDEN_CASES)('$id', ({ period, scope, expected }) => {
    expect(periodMetrics(GOLDEN_DATA, period, scope)).toEqual(expected);
  });

  it('finds exactly the golden RF appointments', () => {
    const ids = APPOINTMENTS.filter((a) => isRfAppointment(a, STAGE_TRANSITIONS)).map((a) => a.id);
    expect(ids).toEqual(EXPECTED_RF_APPOINTMENT_IDS);
  });
});

const people: readonly Person[] = [{ id: 're-1', name: 'RE 1', role: 'RE', teamId: 'team-1' }];
const JAN = periodOf('month', d(1, 1, 2027));

const appointment = (
  id: string,
  day: number,
  status: Appointment['status'] = 'MET',
  stageAfter: CustomerStage | null = null,
  month = 1,
): Appointment => ({
  id,
  customerId: 'kh',
  reId: 're-1',
  coordinatorIds: [],
  date: d(day, month, 2027),
  status,
  stageAfter,
  expectedCaseSize: null,
  nextStep: null,
  note: '',
});

const move = (
  from: CustomerStage,
  to: CustomerStage,
  day: number,
  appointmentId: string | null,
  month = 1,
): StageTransition => ({
  id: `st-${from}-${to}-${day}`,
  customerId: 'kh',
  from,
  to,
  date: d(day, month, 2027),
  appointmentId,
});

/** RF count in January for one customer whose stage moves once at each appointment. */
const rfOf = (moves: readonly (readonly [CustomerStage, CustomerStage])[]) => {
  const appointments = moves.map(([, to], i) => appointment(`ap-${i}`, i + 1, 'MET', to));
  const transitions = moves.map(([from, to], i) => move(from, to, i + 1, `ap-${i}`));
  return rfCount({ people, appointments, transitions }, JAN, { kind: 'all' });
};

describe('rfCount', () => {
  it('counts N4/N3 → N2/N1 only', () => {
    expect(rfOf([['N4', 'N2']])).toBe(1);
    expect(rfOf([['N4', 'N1']])).toBe(1);
    expect(rfOf([['N3', 'N1']])).toBe(1);
    expect(rfOf([['N4', 'N3']])).toBe(0);
    expect(rfOf([['N2', 'N1']])).toBe(0);
  });

  it('does not count a demotion, but counts moving up again after it', () => {
    expect(
      rfOf([
        ['N3', 'N2'],
        ['N2', 'N3'],
        ['N3', 'N2'],
      ]),
    ).toBe(2);
  });

  it('does not count reopening to N3', () => {
    expect(
      rfOf([
        ['ON_HOLD', 'N3'],
        ['LOST', 'N3'],
      ]),
    ).toBe(0);
  });

  it('does not count an appointment that was not met, even with a stage change', () => {
    for (const status of ['SCHEDULED', 'RESCHEDULED', 'CANCELLED', 'NO_SHOW'] as const) {
      const appointments = [appointment('ap', 5, status, 'N2')];
      const transitions = [move('N3', 'N2', 5, 'ap')];
      expect(rfCount({ people, appointments, transitions }, JAN, { kind: 'all' }), status).toBe(0);
    }
  });

  it('does not count a manual stage change outside an appointment', () => {
    const appointments = [appointment('ap', 5, 'MET', 'N3')];
    const transitions = [move('N4', 'N3', 5, 'ap'), move('N3', 'N2', 6, null)];
    expect(rfCount({ people, appointments, transitions }, JAN, { kind: 'all' })).toBe(0);
  });

  it('counts at most one RF per appointment, on the meeting day', () => {
    const appointments = [appointment('ap', 31, 'MET', 'N1')];
    const transitions = [move('N4', 'N2', 31, 'ap'), move('N3', 'N1', 31, 'ap')];
    const data = { people, appointments, transitions };
    expect(rfCount(data, JAN, { kind: 'all' })).toBe(1);
    expect(rfCount(data, periodOf('month', d(1, 2, 2027)), { kind: 'all' })).toBe(0);
  });

  it('reads the stage changes from the list it is given', () => {
    const met = appointment('ap', 5, 'MET', 'N2');
    const rf = [move('N3', 'N2', 5, 'ap')];
    const notRf = [move('N4', 'N3', 5, 'ap')];
    expect(isRfAppointment(met, rf)).toBe(true);
    expect(isRfAppointment(met, notRf)).toBe(false);
    expect(isRfAppointment(met, rf)).toBe(true);
  });

  it('leaves the stage change list untouched, so a later change is read', () => {
    const met = appointment('ap', 5, 'MET', 'N3');
    const transitions = [move('N4', 'N3', 5, 'ap')];
    expect(isRfAppointment(met, transitions)).toBe(false);
    transitions.push(move('N3', 'N2', 5, 'ap'));
    expect(Object.isFrozen(transitions)).toBe(false);
    expect(isRfAppointment(met, transitions)).toBe(true);
  });

  it('counts for the RE on the appointment', () => {
    const appointments = [appointment('ap', 5, 'MET', 'N2')];
    const transitions = [move('N3', 'N2', 5, 'ap')];
    const data = { people, appointments, transitions };
    expect(rfCount(data, JAN, { kind: 're', reId: 're-1' })).toBe(1);
    expect(rfCount(data, JAN, { kind: 're', reId: 're-2' })).toBe(0);
    expect(rfCount(data, JAN, { kind: 'team', teamId: 'team-1' })).toBe(1);
  });
});

describe('closeRate', () => {
  it('is issued ÷ RF, above 100% when there are more policies than RF', () => {
    expect(closeRate(3, 2)).toEqual({ numerator: 3, denominator: 2 });
  });

  it('is none when there is no RF', () => {
    expect(closeRate(2, 0)).toBeNull();
    expect(closeRate(0, 0)).toBeNull();
  });

  it('counts a policy issued in the period even when its RF was in an earlier period', () => {
    const appointments = [
      appointment('ap', 5, 'MET', 'N2'),
      appointment('ap-2', 20, 'MET', 'N2', 2),
    ];
    const transitions = [move('N3', 'N2', 5, 'ap'), move('N3', 'N2', 20, 'ap-2', 2)];
    const policies: readonly Policy[] = [
      {
        id: 'p1',
        customerId: 'kh',
        reId: 're-1',
        submittedDate: d(10, 1, 2027),
        submittedFyp: 100,
        issuedDate: d(3, 2, 2027),
        issuedFyp: 100,
      },
    ];
    const february = periodOf('month', d(1, 2, 2027));
    const data = { people, policies, appointments, transitions };
    expect(periodMetrics(data, february, { kind: 'all' })).toMatchObject({
      issuedCount: 1,
      rfCount: 1,
      closeRate: { numerator: 1, denominator: 1 },
    });
    expect(periodMetrics(data, JAN, { kind: 'all' }).closeRate).toEqual({
      numerator: 0,
      denominator: 1,
    });
  });
});
