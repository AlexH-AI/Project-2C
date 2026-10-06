import { describe, expect, it } from 'vitest';
import type { Scope } from './model';
import { PEOPLE } from './golden/metrics.fixture';
import {
  CHART_GOLDEN_CASES,
  CHART_GOLDEN_PERIOD,
  SNAPSHOT_CUSTOMERS,
  SNAPSHOT_GOLDEN_CASES,
  SNAPSHOT_TODAY,
} from './golden/stage-snapshot.fixture';
import { calendarDate, chartMarks, customPeriod, formatDate, isInPeriod, periodOf } from './period';
import type { CalendarDate } from './period';
import {
  snapshotDate,
  stageSnapshot,
  stageSnapshotByScope,
  stageSnapshotSeries,
  stageSnapshotter,
} from './stage-snapshot';

// The repository never returns a deleted customer, so the golden deleted rows are dropped here.
const live = SNAPSHOT_CUSTOMERS.filter((row) => !row.deleted);
const LIVE_CUSTOMERS = live.map((row) => row.customer);
const TRANSITIONS = SNAPSHOT_CUSTOMERS.flatMap((row) => row.transitions);

const ALL: Scope = { kind: 'all' };
const TODAY = calendarDate(2027, 1, 13);

describe('snapshotDate', () => {
  it('is the last day of a period that has ended', () => {
    expect(snapshotDate(periodOf('month', calendarDate(2026, 12, 1)), TODAY)).toEqual(
      calendarDate(2026, 12, 31),
    );
  });

  it('is today while the period runs, on its first and its last day too', () => {
    expect(snapshotDate(periodOf('month', TODAY), TODAY)).toEqual(TODAY);
    expect(
      snapshotDate(periodOf('week', calendarDate(2027, 1, 11)), calendarDate(2027, 1, 11)),
    ).toEqual(calendarDate(2027, 1, 11));
    expect(snapshotDate(periodOf('day', TODAY), TODAY)).toEqual(TODAY);
  });

  it('is null for a period that has not started', () => {
    expect(snapshotDate(periodOf('day', calendarDate(2027, 1, 14)), TODAY)).toBeNull();
  });
});

describe('stageSnapshot — golden S01–S09', () => {
  for (const golden of SNAPSHOT_GOLDEN_CASES) {
    it(golden.id, () => {
      const date = snapshotDate(golden.period, SNAPSHOT_TODAY);
      expect(date).toEqual(golden.date);
      expect(stageSnapshot(LIVE_CUSTOMERS, TRANSITIONS, date!, golden.scope, PEOPLE)).toEqual(
        golden.expected,
      );
    });
  }
});

describe('chart of week 11/01 – 17/01 — golden S10–S13', () => {
  const marks = chartMarks(CHART_GOLDEN_PERIOD);
  const snapshot = stageSnapshotter(LIVE_CUSTOMERS, TRANSITIONS, PEOPLE);

  for (const golden of CHART_GOLDEN_CASES) {
    it(golden.id, () => {
      const covered = customPeriod(golden.from, golden.to);
      const columns = marks.filter((mark) => isInPeriod(mark.start, covered));
      expect(columns.length).toBeGreaterThan(0);
      for (const column of columns) {
        const date = snapshotDate(column, SNAPSHOT_TODAY);
        if (golden.expected === null) {
          expect(date).toBeNull();
          continue;
        }
        const { N4, N3, N2, N1 } = snapshot(date!, ALL);
        expect({ N4, N3, N2, N1 }).toEqual(golden.expected);
      }
    });
  }

  it('ends with the snapshot of the whole period, the four boxes (S12 = S03)', () => {
    const lastDrawn = marks.findLast((mark) => snapshotDate(mark, SNAPSHOT_TODAY) !== null)!;
    expect(snapshotDate(lastDrawn, SNAPSHOT_TODAY)).toEqual(
      snapshotDate(CHART_GOLDEN_PERIOD, SNAPSHOT_TODAY),
    );
  });
});

describe('stageSnapshot', () => {
  it('leaves out a customer with no stage transition at all', () => {
    const extra = { id: 'K-99', name: 'K-99', reId: 're-an', stage: 'N4' } as const;
    expect(
      stageSnapshot([...LIVE_CUSTOMERS, extra], TRANSITIONS, SNAPSHOT_TODAY, ALL, PEOPLE),
    ).toEqual(stageSnapshot(LIVE_CUSTOMERS, TRANSITIONS, SNAPSHOT_TODAY, ALL, PEOPLE));
  });

  it('counts nobody when there are no customers', () => {
    expect(stageSnapshot([], TRANSITIONS, SNAPSHOT_TODAY, ALL, PEOPLE)).toEqual({
      N4: 0,
      N3: 0,
      N2: 0,
      N1: 0,
      ON_HOLD: 0,
      LOST: 0,
    });
  });
});

describe('stageSnapshotter', () => {
  it('answers every golden period and scope from one build (S01–S09)', () => {
    const snapshot = stageSnapshotter(LIVE_CUSTOMERS, TRANSITIONS, PEOPLE);
    for (const golden of SNAPSHOT_GOLDEN_CASES) {
      expect(snapshot(golden.date, golden.scope), golden.id).toEqual(golden.expected);
    }
  });

  it('orders transitions by day, keeping the recorded order within a day', () => {
    const t = (id: string, day: number, to: 'N4' | 'N3' | 'N2') => ({
      id,
      customerId: 'K-21',
      from: null,
      to,
      date: calendarDate(2027, 1, day),
      appointmentId: null,
    });
    const k21 = LIVE_CUSTOMERS.filter((customer) => customer.id === 'K-21');
    // Given newest first; on 05/01 N3 was recorded before N2, so the day ends in N2.
    const snapshot = stageSnapshotter(
      k21,
      [t('c', 6, 'N4'), t('a', 5, 'N3'), t('b', 5, 'N2'), t('z', 1, 'N4')],
      PEOPLE,
    );
    expect(snapshot(calendarDate(2027, 1, 5), ALL).N2).toBe(1);
    expect(snapshot(calendarDate(2027, 1, 6), ALL).N4).toBe(1);
  });
});

describe('chart of a year that is running (§2.8)', () => {
  const columnDates = (today: CalendarDate) =>
    chartMarks(periodOf('year', today)).map((mark) => {
      const date = snapshotDate(mark, today);
      return date === null ? null : formatDate(date);
    });

  it('takes past months at their end, the current month today, later months empty', () => {
    expect(columnDates(calendarDate(2026, 10, 15))).toEqual([
      '31/01/2026',
      '28/02/2026',
      '31/03/2026',
      '30/04/2026',
      '31/05/2026',
      '30/06/2026',
      '31/07/2026',
      '31/08/2026',
      '30/09/2026',
      '15/10/2026',
      null,
      null,
    ]);
  });

  it('draws January of 2027 as the four boxes of the month on 13/01 (S03)', () => {
    const [january, february] = chartMarks(periodOf('year', SNAPSHOT_TODAY));
    const snapshot = stageSnapshotter(LIVE_CUSTOMERS, TRANSITIONS, PEOPLE);
    expect(snapshot(snapshotDate(january!, SNAPSHOT_TODAY)!, ALL)).toEqual(
      SNAPSHOT_GOLDEN_CASES.find((golden) => golden.id === 'S03')!.expected,
    );
    expect(snapshotDate(february!, SNAPSHOT_TODAY)).toBeNull();
  });
});

describe('stageSnapshotSeries', () => {
  const SCOPES: readonly Scope[] = [
    ALL,
    { kind: 'team', teamId: 'team-a' },
    { kind: 're', reId: 're-an' },
  ];
  const DATES: Readonly<Record<string, readonly CalendarDate[]>> = {
    'every day of 12/2026 – 02/2027': [
      calendarDate(2026, 12, 1),
      calendarDate(2027, 1, 1),
      calendarDate(2027, 2, 1),
    ].flatMap((day) => chartMarks(periodOf('month', day)).map((mark) => mark.end)),
    'the end of each month of 2027': chartMarks(periodOf('year', TODAY)).map((mark) => mark.end),
    'two days far apart': [calendarDate(2026, 1, 1), calendarDate(2027, 1, 13)],
  };

  for (const [name, dates] of Object.entries(DATES)) {
    it.each(SCOPES)(`equals the snapshot of each day: ${name}, $kind`, (scope) => {
      const snapshot = stageSnapshotter(LIVE_CUSTOMERS, TRANSITIONS, PEOPLE);
      expect(stageSnapshotSeries(LIVE_CUSTOMERS, TRANSITIONS, PEOPLE)(dates, scope)).toEqual(
        dates.map((date) => snapshot(date, scope)),
      );
    });
  }

  it('takes the last transition recorded on a day, and a day twice the same', () => {
    const t = (id: string, day: number, to: 'N4' | 'N3' | 'N2') => ({
      id,
      customerId: 'K-21',
      from: null,
      to,
      date: calendarDate(2027, 1, day),
      appointmentId: null,
    });
    const k21 = LIVE_CUSTOMERS.filter((customer) => customer.id === 'K-21');
    const series = stageSnapshotSeries(
      k21,
      [t('c', 6, 'N4'), t('a', 5, 'N3'), t('b', 5, 'N2'), t('z', 1, 'N4')],
      PEOPLE,
    );
    const days = [4, 5, 5, 6].map((day) => calendarDate(2027, 1, day));
    expect(series(days, ALL).map((counts) => [counts.N4, counts.N3, counts.N2])).toEqual([
      [1, 0, 0],
      [0, 0, 1],
      [0, 0, 1],
      [1, 0, 0],
    ]);
  });

  it('has no snapshots for no days, and refuses days out of order', () => {
    const series = stageSnapshotSeries(LIVE_CUSTOMERS, TRANSITIONS, PEOPLE);
    expect(series([], ALL)).toEqual([]);
    expect(() => series([calendarDate(2027, 1, 13), calendarDate(2027, 1, 12)], ALL)).toThrow(
      RangeError,
    );
  });
});

// DR-20: Báo cáo takes the snapshot of every team and RE on one day; grouped once by RE.
describe('stageSnapshotByScope', () => {
  // A customer of an RE outside any team and one of someone not listed.
  const people = [...PEOPLE, { id: 're-solo', name: 'Solo', role: 'RE', teamId: null } as const];
  const customers = [
    ...LIVE_CUSTOMERS,
    { id: 'K-solo', name: 'K-solo', reId: 're-solo', stage: 'N2' } as const,
    { id: 'K-x', name: 'K-x', reId: 'x', stage: 'N3' } as const,
  ];
  const transitions = [
    ...TRANSITIONS,
    {
      id: 't-solo',
      customerId: 'K-solo',
      from: null,
      to: 'N2',
      date: calendarDate(2026, 12, 3),
      appointmentId: null,
    } as const,
    {
      id: 't-x',
      customerId: 'K-x',
      from: null,
      to: 'N3',
      date: calendarDate(2026, 12, 3),
      appointmentId: null,
    } as const,
  ];
  const SCOPES: readonly Scope[] = [
    ALL,
    { kind: 'team', teamId: 'team-a' },
    { kind: 'team', teamId: 'team-b' },
    { kind: 'team', teamId: 'team-none' },
    ...[...people.map(({ id }) => id), 'x', 'nobody'].map((reId): Scope => ({ kind: 're', reId })),
  ];
  const DATES = [calendarDate(2026, 11, 30), calendarDate(2026, 12, 31), TODAY];

  for (const date of DATES) {
    it.each(SCOPES)(`equals stageSnapshot on ${formatDate(date)}, %o`, (scope) => {
      expect(stageSnapshotByScope(customers, transitions, people, date)(scope)).toEqual(
        stageSnapshot(customers, transitions, date, scope, people),
      );
    });
  }

  it('golden S01–S09', () => {
    for (const golden of SNAPSHOT_GOLDEN_CASES) {
      expect(
        stageSnapshotByScope(LIVE_CUSTOMERS, TRANSITIONS, PEOPLE, golden.date)(golden.scope),
        golden.id,
      ).toEqual(golden.expected);
    }
  });
});
