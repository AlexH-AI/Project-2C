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
import { calendarDate, chartMarks, customPeriod, isInPeriod, periodOf } from './period';
import { snapshotDate, stageSnapshot } from './stage-snapshot';

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
        const { N4, N3, N2, N1 } = stageSnapshot(LIVE_CUSTOMERS, TRANSITIONS, date!, ALL, PEOPLE);
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
