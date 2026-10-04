import { calendarDate, periodOf, type Scope } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { PEOPLE, TEAMS } from '../../../../../packages/domain/src/golden/metrics.fixture';
import {
  CHART_GOLDEN_CASES,
  CHART_GOLDEN_PERIOD,
  SNAPSHOT_CUSTOMERS,
  SNAPSHOT_GOLDEN_CASES,
  SNAPSHOT_TODAY,
} from '../../../../../packages/domain/src/golden/stage-snapshot.fixture';
import { stageBlock, type StageData } from './stage-view';

// The repository never returns a deleted customer, so the golden deleted rows are dropped here.
const DATA: StageData = {
  customers: SNAPSHOT_CUSTOMERS.filter((row) => !row.deleted).map((row) => row.customer),
  transitions: SNAPSHOT_CUSTOMERS.flatMap((row) => row.transitions),
  people: PEOPLE,
  teams: TEAMS,
};
const ALL: Scope = { kind: 'all' };
const golden = (id: string) => SNAPSHOT_GOLDEN_CASES.find((c) => c.id === id)!;
const n4ToN1 = ({ N4, N3, N2, N1 }: Record<'N4' | 'N3' | 'N2' | 'N1', number>) => ({
  N4,
  N3,
  N2,
  N1,
});

describe('stageBlock — chart of week 11/01 – 17/01 (golden S10–S13)', () => {
  const block = stageBlock(DATA, CHART_GOLDEN_PERIOD, ALL, SNAPSHOT_TODAY);
  const [chart] = block.charts;

  it('draws one chart of seven columns, Monday to Sunday', () => {
    expect(block.charts).toHaveLength(1);
    expect(chart!.columns.map((column) => column.label)).toEqual([
      'T2 11',
      'T3 12',
      'T4 13',
      'T5 14',
      'T6 15',
      'T7 16',
      'CN 17',
    ]);
  });

  it('gives each column the snapshot at the end of its day, after today none', () => {
    const values = chart!.columns.map((column) => column.values);
    expect(values.slice(0, 3)).toEqual(CHART_GOLDEN_CASES.slice(0, 3).map((c) => c.expected));
    expect(values.slice(3)).toEqual([null, null, null, null]);
  });

  it('marks today and titles each column with the day it was taken', () => {
    expect(chart!.columns.map((column) => column.today)).toEqual([
      false,
      false,
      true,
      false,
      false,
      false,
      false,
    ]);
    expect(chart!.columns[2]!.title).toBe('13/01/2027 · cuối ngày');
  });

  it('shows in the four tiles the last column drawn, taken today', () => {
    expect(block.tiles).toEqual(CHART_GOLDEN_CASES[2]!.expected);
    expect(block.note).toBe('ảnh chụp cuối ngày 13/01/2027 (hôm nay)');
  });
});

describe('stageBlock', () => {
  const january = periodOf('month', SNAPSHOT_TODAY);

  it('fills the tiles with the snapshot of the period, its last drawn column (S03)', () => {
    const block = stageBlock(DATA, january, ALL, SNAPSHOT_TODAY);
    const columns = block.charts[0]!.columns;
    const lastDrawn = columns.findLast((column) => column.values !== null)!;

    expect(block.tiles).toEqual(n4ToN1(golden('S03').expected));
    expect(lastDrawn.values).toEqual(block.tiles);
    expect(columns).toHaveLength(31);
    expect(columns.filter((column) => column.values === null)).toHaveLength(31 - 13);
  });

  it('takes a period that has ended at its last day, not today (S01)', () => {
    const december = periodOf('month', calendarDate(2026, 12, 1));
    const block = stageBlock(DATA, december, ALL, SNAPSHOT_TODAY);

    expect(block.tiles).toEqual(n4ToN1(golden('S01').expected));
    expect(block.note).toBe('ảnh chụp cuối ngày 31/12/2026');
    expect(block.charts[0]!.columns.every((column) => column.values !== null)).toBe(true);
  });

  it('draws the chart of the RE picked (S06)', () => {
    const block = stageBlock(DATA, january, { kind: 're', reId: 're-an' }, SNAPSHOT_TODAY);
    expect(block.charts).toHaveLength(1);
    expect(block.tiles).toEqual(n4ToN1(golden('S06').expected));
  });

  it('adds every team up in the tiles and draws one chart per team (S03, S08, S09)', () => {
    const block = stageBlock(DATA, january, { kind: 'team', teamId: 'team-a' }, SNAPSHOT_TODAY);

    expect(block.tiles).toEqual(n4ToN1(golden('S03').expected));
    expect(block.note).toBe('ảnh chụp cuối ngày 13/01/2027 (hôm nay) · cộng 2 team');
    expect(block.charts.map((chart) => chart.team)).toEqual(['Team A', 'Team B']);
    const lastDrawn = block.charts.map(
      (chart) => chart.columns.findLast((column) => column.values !== null)!.values,
    );
    expect(lastDrawn).toEqual([golden('S08').expected, golden('S09').expected].map(n4ToN1));
  });

  it('has no numbers before the period starts: tiles "—", every column empty', () => {
    const february = periodOf('month', calendarDate(2027, 2, 1));
    const block = stageBlock(DATA, february, ALL, SNAPSHOT_TODAY);

    expect(block.tiles).toBeNull();
    expect(block.note).toBeNull();
    expect(block.charts[0]!.columns).toHaveLength(28);
    expect(block.charts[0]!.columns.every((column) => column.values === null)).toBe(true);
  });

  it('names a year by its months and a month by its days', () => {
    const year = stageBlock(DATA, periodOf('year', SNAPSHOT_TODAY), ALL, SNAPSHOT_TODAY);
    const columns = year.charts[0]!.columns;
    expect(columns.map((column) => column.label)).toEqual(
      Array.from({ length: 12 }, (_, index) => `T${index + 1}`),
    );
    // The month holding today is taken today; later months stay empty.
    expect(columns[0]).toMatchObject({ title: '13/01/2027 · cuối ngày', today: true });
    expect(columns[0]!.values).toEqual(year.tiles);
    expect(columns[1]!.values).toBeNull();

    const month = stageBlock(DATA, january, ALL, SNAPSHOT_TODAY).charts[0]!.columns;
    expect(month.map((column) => column.label).slice(0, 3)).toEqual(['01', '02', '03']);
  });

  it('names a long custom range by its months, a short one by its days', () => {
    const custom = (from: number, to: number) =>
      stageBlock(
        DATA,
        { kind: 'custom', start: calendarDate(2026, from, 15), end: calendarDate(2027, to, 10) },
        ALL,
        SNAPSHOT_TODAY,
      ).charts[0]!.columns.map((column) => column.label);

    expect(custom(11, 1)).toEqual(['11/2026', '12/2026', '01/2027']);
    expect(custom(12, 1).slice(0, 2)).toEqual(['15/12', '16/12']);
    expect(custom(12, 1)).toHaveLength(27);
  });

  it('names a month cut to one day of a long custom range by its month, not its day', () => {
    const labels = stageBlock(
      DATA,
      { kind: 'custom', start: calendarDate(2026, 11, 30), end: calendarDate(2027, 3, 1) },
      ALL,
      SNAPSHOT_TODAY,
    ).charts[0]!.columns.map((column) => column.label);

    expect(labels).toEqual(['11/2026', '12/2026', '01/2027', '02/2027', '03/2027']);
  });
});
