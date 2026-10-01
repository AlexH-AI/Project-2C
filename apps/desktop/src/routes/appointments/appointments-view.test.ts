import type { AppointmentRecord, CustomerRecord } from '@p2c/db';
import {
  customPeriod,
  periodOf,
  type CalendarDate,
  type Person,
  type StageTransition,
  type Team,
} from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import {
  appointmentRows,
  appointmentsByRe,
  dateTone,
  dayBoard,
  monthGrid,
  outcomeText,
  personLabel,
  pickDay,
  rescheduleLinks,
  revealCreated,
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
  outcomeReviewerId: null,
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

describe('revealCreated', () => {
  const withCoordinator = appointment('a', 're1', day(9, 1), { coordinatorIds: ['tl1'] });
  const alone = appointment('b', 're3', day(9, 1));

  it('keeps the coordinator filter when it shows the new appointment', () => {
    expect(revealCreated(withCoordinator, people, { kind: 'all' }, 'tl1').coordinator).toBe('tl1');
    expect(revealCreated(alone, people, { kind: 'all' }, 'none').coordinator).toBe('none');
    expect(revealCreated(alone, people, { kind: 'all' }, 'any').coordinator).toBe('any');
  });

  it('clears the coordinator filter when it hides the new appointment', () => {
    expect(revealCreated(withCoordinator, people, { kind: 'all' }, 'none').coordinator).toBe('any');
    expect(revealCreated(withCoordinator, people, { kind: 'all' }, 'is1').coordinator).toBe('any');
    expect(revealCreated(alone, people, { kind: 'all' }, 'tl1').coordinator).toBe('any');
  });

  it('says when the RE is outside the scope, which it leaves alone', () => {
    const team = { kind: 'team', teamId: 't1' } as const;
    expect(revealCreated(withCoordinator, people, team, 'any').outsideScope).toBe(false);
    expect(revealCreated(alone, people, team, 'any').outsideScope).toBe(true);
    expect(revealCreated(alone, people, { kind: 're', reId: 're1' }, 'any').outsideScope).toBe(
      true,
    );
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
    const weeks = monthGrid(day(9, 15), rows, periodOf('month', day(9, 15)));
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

  it('counts every status other than met and scheduled as missed', () => {
    const rows = appointmentRows(
      data([
        appointment('a', 're1', day(9, 16), { status: 'RESCHEDULED' }),
        appointment('b', 're1', day(9, 16), { status: 'NO_SHOW' }),
        appointment('c', 're1', day(9, 16), { status: 'CANCELLED' }),
      ]),
      { kind: 'all' },
      'any',
    );
    const cell = monthGrid(day(9, 16), rows, periodOf('month', day(9, 16)))
      .flat()
      .find((c) => c.date.day === 16 && c.inMonth);
    expect(cell).toMatchObject({ met: 0, planned: 0, missed: 3 });
  });

  it('starts on the first when the month starts on a Monday', () => {
    // June 2026 starts on a Monday and ends on a Tuesday.
    const weeks = monthGrid(day(6, 10), [], periodOf('month', day(6, 10)));
    expect(weeks).toHaveLength(5);
    expect(weeks[0]?.[0]).toMatchObject({ date: day(6, 1), inMonth: true });
    expect(weeks[4]?.[6]).toMatchObject({ date: day(7, 5), inMonth: false });
  });

  it('spans six weeks when the month needs them', () => {
    // August 2026 starts on a Saturday and ends on a Monday.
    const weeks = monthGrid(day(8, 1), [], periodOf('month', day(8, 1)));
    expect(weeks).toHaveLength(6);
    expect(weeks[0]?.[0]).toMatchObject({ date: day(7, 27), inMonth: false });
    expect(weeks[5]?.[0]).toMatchObject({ date: day(8, 31), inMonth: true });
    expect(weeks[5]?.[6]).toMatchObject({ date: day(9, 6), inMonth: false });
  });

  it('crosses the new year on both sides', () => {
    const jan2 = { year: 2027, month: 1, day: 2 };
    const rows = appointmentRows(data([appointment('a', 're1', jan2)]), { kind: 'all' }, 'any');
    const december = monthGrid(day(12, 31), rows, periodOf('month', day(12, 31)));
    expect(december.at(-1)?.[5]).toMatchObject({ date: jan2, inMonth: false, planned: 1 });

    const january = monthGrid(jan2, rows, periodOf('month', jan2));
    expect(january[0]?.[0]).toMatchObject({ date: day(12, 28), inMonth: false });
    expect(january[0]?.[5]).toMatchObject({ date: jan2, inMonth: true, planned: 1 });
  });
  it('marks the days of a week period, in the month shown or not', () => {
    const week = periodOf('week', day(10, 1));
    const cells = monthGrid(day(10, 1), [], week).flat();
    const inPeriod = cells.filter((c) => c.inPeriod).map((c) => [c.date.month, c.date.day]);
    expect(inPeriod).toEqual([
      [9, 28],
      [9, 29],
      [9, 30],
      [10, 1],
      [10, 2],
      [10, 3],
      [10, 4],
    ]);
    expect(cells[0]).toMatchObject({ date: day(9, 28), inMonth: false, inPeriod: true });
  });

  it('marks the days of a custom range only', () => {
    const cells = monthGrid(day(10, 6), [], customPeriod(day(9, 24), day(10, 7))).flat();
    expect(cells.find((c) => c.date.day === 7 && c.inMonth)?.inPeriod).toBe(true);
    expect(cells.find((c) => c.date.day === 8 && c.inMonth)?.inPeriod).toBe(false);
  });

  it('marks no band for a month or a day period', () => {
    for (const period of [periodOf('month', day(10, 1)), periodOf('day', day(10, 1))]) {
      expect(
        monthGrid(day(10, 1), [], period)
          .flat()
          .some((c) => c.inPeriod),
      ).toBe(false);
    }
  });
});

describe('pickDay', () => {
  it('keeps the period when the day is in it', () => {
    const month = periodOf('month', day(9, 15));
    expect(pickDay(month, day(9, 30))).toBe(month);
    const custom = { kind: 'custom', start: day(9, 10), end: day(9, 20) } as const;
    expect(pickDay(custom, day(9, 10))).toBe(custom);
  });

  it('moves a day or week period to the one holding the day', () => {
    expect(pickDay(periodOf('day', day(9, 15)), day(9, 20))).toEqual(periodOf('day', day(9, 20)));
    expect(pickDay(periodOf('week', day(9, 15)), day(9, 23))).toEqual({
      kind: 'week',
      start: day(9, 21),
      end: day(9, 27),
    });
  });

  it('refuses a day outside a custom range', () => {
    const custom = { kind: 'custom', start: day(9, 10), end: day(9, 20) } as const;
    expect(pickDay(custom, day(9, 9))).toBeNull();
    expect(pickDay(custom, day(9, 21))).toBeNull();
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

describe('rescheduleLinks', () => {
  it('finds the appointment this one replaced and the one that replaced it', () => {
    const first = appointment('first', 're1', day(9, 8), { status: 'RESCHEDULED' });
    const second = appointment('second', 're1', day(9, 15), {
      status: 'RESCHEDULED',
      rescheduledFromId: 'first',
    });
    const third = appointment('third', 're1', day(9, 22), { rescheduledFromId: 'second' });
    const all = [first, second, third, appointment('other', 're1', day(9, 9))];

    expect(rescheduleLinks(all, second)).toEqual({ from: first, to: third });
    expect(rescheduleLinks(all, first)).toEqual({ from: undefined, to: second });
    expect(rescheduleLinks(all, all[3]!)).toEqual({ from: undefined, to: undefined });
  });
});

describe('appointmentsByRe', () => {
  it('counts the appointments in the period by the RE in charge, not by coordinator', () => {
    const rows = appointmentRows(
      data([
        appointment('a', 're1', day(9, 1)),
        appointment('b', 're1', day(9, 30), { status: 'MET' }),
        appointment('c', 're2', day(9, 2), { coordinatorIds: ['re1', 'tl1'] }),
        appointment('d', 're1', day(10, 1)),
        appointment('e', 're2', day(8, 31)),
      ]),
      { kind: 'team', teamId: 't1' },
      'any',
    );
    expect(appointmentsByRe(rows, periodOf('month', day(9, 15)))).toEqual(
      new Map([
        ['re1', 2],
        ['re2', 1],
      ]),
    );
    expect(appointmentsByRe(rows, periodOf('month', day(10, 15)))).toEqual(new Map([['re1', 1]]));
  });
});

describe('dateTone', () => {
  const today = day(9, 15);

  it('is past before today, today on it, future after it', () => {
    expect(dateTone(day(9, 14), today)).toBe('past');
    expect(dateTone(day(9, 15), today)).toBe('today');
    expect(dateTone(day(9, 16), today)).toBe('future');
  });

  it('compares across months and years', () => {
    expect(dateTone({ year: 2025, month: 12, day: 31 }, today)).toBe('past');
    expect(dateTone(day(10, 1), today)).toBe('future');
  });
});
