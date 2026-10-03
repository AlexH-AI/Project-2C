/**
 * Golden examples for customers by stage at the end of a period (Phase 4 G2 §2), mirrored 1–1 from
 * `docs/golden/kh-theo-nhom.md` (customers `K-…`, cases `S…`), plus the report marks M01–M04 of
 * `docs/design/phase-4-chi-so.md` §4.4. Never edit it to make a test green — a change needs the
 * Owner's approval again (G2). People are those of `metrics.fixture.ts`.
 */
import type { Customer, CustomerStage, Scope, StageTransition } from '../model';
import { calendarDate, customPeriod, periodOf } from '../period';
import type { CalendarDate, Period } from '../period';
import type { StageCounts } from '../stage-snapshot';

const d = (day: number, month: number, year = 2027): CalendarDate => calendarDate(year, month, day);

/** Hôm nay of the scenario, Wednesday 13/01/2027. */
export const SNAPSHOT_TODAY = d(13, 1);

/**
 * One customer of the scenario with their stage changes, the first one being their creation.
 * Deletion lives outside `Customer`: the repository never returns a deleted customer, so the tests
 * drop those rows the same way.
 */
export interface GoldenCustomerRow {
  readonly customer: Customer;
  readonly transitions: readonly StageTransition[];
  readonly deleted: boolean;
}

type Change = readonly [date: CalendarDate, to: CustomerStage];

const customer = (
  id: string,
  reId: string,
  changes: readonly Change[],
  extra: { readonly deleted?: boolean } = {},
): GoldenCustomerRow => ({
  customer: { id, name: id, reId, stage: changes.at(-1)![1] },
  transitions: changes.map(([date, to], index) => ({
    id: `${id}-t${index + 1}`,
    customerId: id,
    from: index === 0 ? null : changes[index - 1]![1],
    to,
    date,
    appointmentId: null,
  })),
  deleted: extra.deleted ?? false,
});

export const SNAPSHOT_CUSTOMERS: readonly GoldenCustomerRow[] = [
  customer('K-21', 're-an', [
    [d(1, 12, 2026), 'N4'],
    [d(20, 12, 2026), 'N3'],
    [d(5, 1), 'N2'],
  ]),
  customer('K-22', 're-an', [[d(8, 1), 'N3']]),
  customer('K-24', 're-binh', [
    [d(1, 12, 2026), 'N3'],
    [d(10, 12, 2026), 'ON_HOLD'],
    [d(6, 1), 'N3'],
  ]),
  customer('K-25', 're-binh', [
    [d(1, 12, 2026), 'N2'],
    [d(7, 1), 'LOST'],
  ]),
  customer('K-26', 're-chi', [[d(1, 12, 2026), 'N1']], { deleted: true }),
  customer('K-27', 're-chi', [
    [d(1, 12, 2026), 'N4'],
    [d(11, 1), 'N2'],
    [d(12, 1), 'N3'],
  ]),
  customer('K-28', 're-dung', [
    [d(2, 1), 'N4'],
    [d(13, 1), 'N3'],
  ]),
  // Dũng was in charge until 10/01; v1 keeps no RE history, so An gets K-29 in every period.
  customer('K-29', 're-an', [[d(1, 12, 2026), 'N1']]),
];

export interface SnapshotGoldenCase {
  readonly id: string;
  readonly period: Period;
  /** The expected mốc of the period. */
  readonly date: CalendarDate;
  readonly scope: Scope;
  readonly expected: StageCounts;
}

const ALL: Scope = { kind: 'all' };
const JANUARY = periodOf('month', d(1, 1));
const DECEMBER = periodOf('month', d(1, 12, 2026));

const counts = (
  N4: number,
  N3: number,
  N2: number,
  N1: number,
  ON_HOLD: number,
  LOST: number,
): StageCounts => ({ N4, N3, N2, N1, ON_HOLD, LOST });

export const SNAPSHOT_GOLDEN_CASES: readonly SnapshotGoldenCase[] = [
  {
    id: 'S01',
    period: DECEMBER,
    date: d(31, 12, 2026),
    scope: ALL,
    expected: counts(1, 1, 1, 1, 1, 0),
  },
  {
    id: 'S02',
    period: periodOf('week', d(4, 1)),
    date: d(10, 1),
    scope: ALL,
    expected: counts(2, 2, 1, 1, 0, 1),
  },
  { id: 'S03', period: JANUARY, date: d(13, 1), scope: ALL, expected: counts(0, 4, 1, 1, 0, 1) },
  {
    id: 'S04',
    period: periodOf('day', d(6, 1)),
    date: d(6, 1),
    scope: ALL,
    expected: counts(2, 1, 2, 1, 0, 0),
  },
  {
    id: 'S05',
    period: periodOf('year', d(1, 1, 2026)),
    date: d(31, 12, 2026),
    scope: ALL,
    expected: counts(1, 1, 1, 1, 1, 0),
  },
  {
    id: 'S06',
    period: JANUARY,
    date: d(13, 1),
    scope: { kind: 're', reId: 're-an' },
    expected: counts(0, 1, 1, 1, 0, 0),
  },
  {
    id: 'S07',
    period: DECEMBER,
    date: d(31, 12, 2026),
    scope: { kind: 're', reId: 're-dung' },
    expected: counts(0, 0, 0, 0, 0, 0),
  },
  {
    id: 'S08',
    period: JANUARY,
    date: d(13, 1),
    scope: { kind: 'team', teamId: 'team-a' },
    expected: counts(0, 2, 1, 1, 0, 1),
  },
  {
    id: 'S09',
    period: JANUARY,
    date: d(13, 1),
    scope: { kind: 'team', teamId: 'team-b' },
    expected: counts(0, 2, 0, 0, 0, 0),
  },
];

/** The Tổng quan chart of week 11/01 – 17/01, Toàn bộ: each column a snapshot at its own end. */
export const CHART_GOLDEN_PERIOD = periodOf('week', d(11, 1));

export interface ChartGoldenCase {
  readonly id: string;
  /** The columns (marks) the case covers, first and last day. */
  readonly from: CalendarDate;
  readonly to: CalendarDate;
  /** Only N4–N1 are drawn; null = after today, left empty. */
  readonly expected: Readonly<Record<'N4' | 'N3' | 'N2' | 'N1', number>> | null;
}

export const CHART_GOLDEN_CASES: readonly ChartGoldenCase[] = [
  { id: 'S10', from: d(11, 1), to: d(11, 1), expected: { N4: 1, N3: 2, N2: 2, N1: 1 } },
  { id: 'S11', from: d(12, 1), to: d(12, 1), expected: { N4: 1, N3: 3, N2: 1, N1: 1 } },
  { id: 'S12', from: d(13, 1), to: d(13, 1), expected: { N4: 0, N3: 4, N2: 1, N1: 1 } },
  { id: 'S13', from: d(14, 1), to: d(17, 1), expected: null },
];

export interface MarksGoldenCase {
  readonly id: string;
  readonly period: Period;
  /** First and last day of each mark of the Theo mốc report, in order. */
  readonly marks: readonly (readonly [CalendarDate, CalendarDate])[];
}

export const REPORT_MARKS_GOLDEN_CASES: readonly MarksGoldenCase[] = [
  {
    id: 'M01',
    period: JANUARY,
    marks: [
      [d(1, 1), d(3, 1)],
      [d(4, 1), d(10, 1)],
      [d(11, 1), d(17, 1)],
      [d(18, 1), d(24, 1)],
      [d(25, 1), d(31, 1)],
    ],
  },
  {
    id: 'M02',
    period: periodOf('month', d(1, 2)),
    marks: [
      [d(1, 2), d(7, 2)],
      [d(8, 2), d(14, 2)],
      [d(15, 2), d(21, 2)],
      [d(22, 2), d(28, 2)],
    ],
  },
  {
    id: 'M03',
    period: customPeriod(d(20, 1), d(15, 3)),
    marks: [
      [d(20, 1), d(31, 1)],
      [d(1, 2), d(28, 2)],
      [d(1, 3), d(15, 3)],
    ],
  },
  {
    id: 'M04',
    period: customPeriod(d(5, 1), d(20, 1)),
    marks: Array.from({ length: 16 }, (_, index) => [d(5 + index, 1), d(5 + index, 1)] as const),
  },
];
