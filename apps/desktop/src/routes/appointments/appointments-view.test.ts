import type { AppointmentRecord, CustomerRecord } from '@p2c/db';
import type { CalendarDate, Person, StageTransition, Team } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import {
  appointmentRows,
  dayBoard,
  monthGrid,
  outcomeText,
  personLabel,
  type AppointmentData,
} from './appointments-view';

const day = (month: number, dayOfMonth: number): CalendarDate => ({
  year: 2026,
  month,
  day: dayOfMonth,
});

const teams: Team[] = [
  { id: 't1', name: 'Sao Mai' },
  { id: 't2', name: 'Bình Minh' },
];

const people: Person[] = [
  { id: 're1', name: 'Hoàng Nam', role: 'RE', teamId: 't1' },
  { id: 're2', name: 'Đỗ Khánh Linh', role: 'RE', teamId: 't1' },
  { id: 're3', name: 'Mai Phương', role: 'RE', teamId: 't2' },
  { id: 'tl1', name: 'Nguyễn Thu Hà', role: 'TL', teamId: 't1' },
  { id: 'is1', name: 'Phó Đức Huy', role: 'IS', teamId: null },
];

const customer = (id: string, reId: string): CustomerRecord => ({
  id,
  code: `K-${id}`,
  name: id,
  reId,
  stage: 'N3',
  birthDate: null,
  gender: null,
});

const appointment = (
  id: string,
  reId: string,
  date: CalendarDate,
  extra: Partial<AppointmentRecord> = {},
): AppointmentRecord => ({
  id,
  customerId: `c-${id}`,
  reId,
  coordinatorIds: [],
  date,
  time: null,
  status: 'SCHEDULED',
  triggerType: 'OTHER',
  triggerNote: null,
  stageAfter: null,
  expectedCaseSize: null,
  nextStep: null,
  note: '',
  rescheduledFromId: null,
  ...extra,
});

const move = (appointmentId: string, from: StageTransition['from'], to: StageTransition['to']) => ({
  id: `tr-${appointmentId}`,
  customerId: `c-${appointmentId}`,
  from,
  to,
  date: day(9, 1),
  appointmentId,
});

function data(appointments: AppointmentRecord[], transitions: StageTransition[] = []) {
  return {
    appointments,
    customers: appointments.map((a) => customer(a.customerId, a.reId)),
    people,
    teams,
    transitions,
  } satisfies AppointmentData;
}

const ids = (rows: readonly { appointment: { id: string } }[]) =>
  rows.map((row) => row.appointment.id);

describe('appointmentRows', () => {
  const all = data([
    appointment('a', 're1', day(9, 1), { coordinatorIds: ['tl1', 'is1'] }),
    appointment('b', 're2', day(9, 2)),
    appointment('c', 're3', day(9, 3), { coordinatorIds: ['is1'] }),
  ]);

  it('keeps the appointments of the RE in scope', () => {
    expect(ids(appointmentRows(all, { kind: 'all' }, 'any'))).toEqual(['a', 'b', 'c']);
    expect(ids(appointmentRows(all, { kind: 'team', teamId: 't1' }, 'any'))).toEqual(['a', 'b']);
    expect(ids(appointmentRows(all, { kind: 're', reId: 're3' }, 'any'))).toEqual(['c']);
  });

  it('filters by coordinator: a given person, or none at all', () => {
    expect(ids(appointmentRows(all, { kind: 'all' }, 'is1'))).toEqual(['a', 'c']);
    expect(ids(appointmentRows(all, { kind: 'all' }, 'tl1'))).toEqual(['a']);
    expect(ids(appointmentRows(all, { kind: 'all' }, 'none'))).toEqual(['b']);
  });

  it('joins the customer, RE, team and coordinators', () => {
    const [row] = appointmentRows(all, { kind: 're', reId: 're1' }, 'any');
    expect(row?.customer?.id).toBe('c-a');
    expect(row?.re?.name).toBe('Hoàng Nam');
    expect(row?.team?.name).toBe('Sao Mai');
    expect(row?.coordinators.map((p) => p.name)).toEqual(['Nguyễn Thu Hà', 'Phó Đức Huy']);
  });

  it('describes the outcome: a stage move (RF or not), a kept stage, a new day', () => {
    const outcomes = appointmentRows(
      data(
        [
          appointment('rf', 're1', day(9, 1), { status: 'MET', stageAfter: 'N2' }),
          appointment('up', 're1', day(9, 1), { status: 'MET', stageAfter: 'N1' }),
          appointment('keep', 're1', day(9, 1), { status: 'MET', stageAfter: 'N3' }),
          appointment('old', 're1', day(9, 1), { status: 'RESCHEDULED' }),
          appointment('new', 're1', day(9, 8), { rescheduledFromId: 'old' }),
          appointment('miss', 're1', day(9, 1), { status: 'NO_SHOW' }),
        ],
        [move('rf', 'N3', 'N2'), move('up', 'N2', 'N1')],
      ),
      { kind: 'all' },
      'any',
    ).map((row) => row.outcome);
    expect(outcomes).toEqual([
      { kind: 'move', from: 'N3', to: 'N2', rf: true },
      { kind: 'move', from: 'N2', to: 'N1', rf: false },
      { kind: 'keep', stage: 'N3' },
      { kind: 'rescheduled', to: day(9, 8) },
      null,
      null,
    ]);
  });
});

describe('monthGrid', () => {
  it('shows whole weeks Monday to Sunday around the month, with counts by status', () => {
    const rows = appointmentRows(
      data([
        appointment('a', 're1', day(9, 28), { status: 'MET' }),
        appointment('b', 're1', day(9, 28)),
        appointment('c', 're1', day(9, 28), { status: 'CANCELLED' }),
        appointment('d', 're1', day(10, 1)),
      ]),
      { kind: 'all' },
      'any',
    );
    const weeks = monthGrid(day(9, 15), rows);
    // September 2026 starts on a Tuesday and ends on a Wednesday.
    expect(weeks).toHaveLength(5);
    expect(weeks[0]?.[0]).toMatchObject({
      date: { year: 2026, month: 8, day: 31 },
      inMonth: false,
    });
    expect(weeks[4]?.[6]).toMatchObject({ date: day(10, 4), inMonth: false });
    expect(weeks[4]?.[0]).toMatchObject({
      date: day(9, 28),
      inMonth: true,
      met: 1,
      planned: 1,
      missed: 1,
    });
    expect(weeks[4]?.[3]).toMatchObject({ date: day(10, 1), planned: 1 });
  });
});

describe('dayBoard', () => {
  it("groups the day's appointments by team, then RE, by name and time", () => {
    const rows = appointmentRows(
      data([
        appointment('late', 're1', day(9, 15), { time: '16:00' }),
        appointment('early', 're1', day(9, 15), { time: '08:30' }),
        appointment('linh', 're2', day(9, 15)),
        appointment('phuong', 're3', day(9, 15), { time: '09:00' }),
        appointment('other-day', 're3', day(9, 16)),
      ]),
      { kind: 'all' },
      'any',
    );
    const board = dayBoard(rows, day(9, 15));
    expect(board.map((g) => [g.team?.name, g.res.map((r) => [r.re?.name, ids(r.rows)])])).toEqual([
      ['Bình Minh', [['Mai Phương', ['phuong']]]],
      [
        'Sao Mai',
        [
          ['Đỗ Khánh Linh', ['linh']],
          ['Hoàng Nam', ['early', 'late']],
        ],
      ],
    ]);
  });
});

describe('outcomeText', () => {
  it('names both stages, including one outside the pipeline', () => {
    expect(outcomeText({ kind: 'move', from: 'ON_HOLD', to: 'N3', rf: false })).toBe(
      'Tạm hoãn → N3',
    );
    expect(outcomeText({ kind: 'move', from: 'N3', to: 'N2', rf: true })).toBe('N3 → N2 · RF');
  });

  it('shows a dash for an unknown starting stage, and the other kinds', () => {
    expect(outcomeText({ kind: 'move', from: null, to: 'N4', rf: false })).toBe('— → N4');
    expect(outcomeText({ kind: 'rescheduled', to: day(10, 2) })).toBe('Dời sang 02/10');
    expect(outcomeText(null)).toBe('');
  });
});

describe('personLabel', () => {
  it('is the role then the name', () => {
    expect(personLabel(people[3]!)).toBe('TL Nguyễn Thu Hà');
  });
});
