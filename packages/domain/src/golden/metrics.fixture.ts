/**
 * Golden examples for the metrics (ADR-0007, approved by the Owner at G2). Two scenarios, the same
 * two teams: section 1 (December 2026 – February 2027, G01–G22) and scenario B of cancelled
 * policies (2028, G23–G41; approved at G2 on 13/11/2026). Expected results are written by hand and
 * mirrored 1–1 in `docs/golden/chi-so.md`. Stats engine tests must pass against this file; never
 * edit it to make a test green — a change needs the Owner's approval again.
 */
import type { Appointment, Customer, Person, Policy, Scope, StageTransition, Team } from '../model';
import { calendarDate, customPeriod, periodOf } from '../period';
import type { CalendarDate, Period } from '../period';

const d = (day: number, month: number, year: number): CalendarDate =>
  calendarDate(year, month, day);

const MILLION = 1_000_000;

export const TEAMS: readonly Team[] = [
  { id: 'team-a', name: 'Team A' },
  { id: 'team-b', name: 'Team B' },
];

export const PEOPLE: readonly Person[] = [
  { id: 're-an', name: 'An', role: 'RM', teamId: 'team-a' },
  { id: 're-binh', name: 'Bình', role: 'RM', teamId: 'team-a' },
  { id: 'tl-ha', name: 'Hà', role: 'TL', teamId: 'team-a' },
  { id: 're-chi', name: 'Chi', role: 'RM', teamId: 'team-b' },
  { id: 're-dung', name: 'Dũng', role: 'RM', teamId: 'team-b' },
  { id: 'is-khoa', name: 'Khoa', role: 'IS', teamId: null },
];

export const CUSTOMERS: readonly Customer[] = [
  { id: 'kh-01', name: 'KH 01', rmId: 're-an', stage: 'N2' },
  { id: 'kh-02', name: 'KH 02', rmId: 're-an', stage: 'N1' },
  { id: 'kh-03', name: 'KH 03', rmId: 're-binh', stage: 'N2' },
  { id: 'kh-04', name: 'KH 04', rmId: 're-binh', stage: 'N1' },
  { id: 'kh-05', name: 'KH 05', rmId: 're-chi', stage: 'N1' },
  { id: 'kh-06', name: 'KH 06', rmId: 're-chi', stage: 'N2' },
  { id: 'kh-07', name: 'KH 07', rmId: 're-chi', stage: 'LOST' },
  { id: 'kh-08', name: 'KH 08', rmId: 're-dung', stage: 'N3' },
  { id: 'kh-09', name: 'KH 09', rmId: 're-dung', stage: 'N1' },
];

const meeting = (
  id: string,
  customerId: string,
  rmId: string,
  date: CalendarDate,
  status: Appointment['status'],
  stageAfter: Appointment['stageAfter'],
  extra: Partial<Pick<Appointment, 'coordinatorIds' | 'expectedCaseSize' | 'nextStep'>> = {},
): Appointment => ({
  id,
  customerId,
  rmId,
  date,
  status,
  stageAfter,
  coordinatorIds: extra.coordinatorIds ?? [],
  expectedCaseSize: extra.expectedCaseSize ?? null,
  nextStep: extra.nextStep ?? null,
  note: '',
});

export const APPOINTMENTS: readonly Appointment[] = [
  meeting('ap-01', 'kh-01', 're-an', d(15, 12, 2026), 'MET', 'N3'),
  meeting('ap-02', 'kh-01', 're-an', d(29, 12, 2026), 'MET', 'N2', {
    expectedCaseSize: 500 * MILLION,
  }),
  meeting('ap-03', 'kh-02', 're-an', d(2, 1, 2027), 'MET', 'N1'),
  meeting('ap-04', 'kh-03', 're-binh', d(6, 1, 2027), 'MET', 'N2', { coordinatorIds: ['is-khoa'] }),
  meeting('ap-05', 'kh-03', 're-binh', d(13, 1, 2027), 'MET', 'N3'),
  meeting('ap-06', 'kh-03', 're-binh', d(20, 1, 2027), 'MET', 'N2', {
    expectedCaseSize: 1_000 * MILLION,
  }),
  meeting('ap-07', 'kh-04', 're-binh', d(8, 1, 2027), 'RESCHEDULED', null),
  meeting('ap-08', 'kh-04', 're-binh', d(15, 1, 2027), 'MET', 'N1'),
  meeting('ap-09', 'kh-05', 're-chi', d(4, 1, 2027), 'MET', 'N1', { coordinatorIds: ['is-khoa'] }),
  meeting('ap-10', 'kh-06', 're-chi', d(18, 1, 2027), 'MET', 'N3'),
  meeting('ap-11', 'kh-06', 're-chi', d(27, 1, 2027), 'MET', 'N2'),
  meeting('ap-12', 'kh-08', 're-dung', d(7, 1, 2027), 'MET', 'N3', { nextStep: 'Gửi minh họa' }),
  meeting('ap-13', 'kh-08', 're-dung', d(14, 1, 2027), 'NO_SHOW', null),
  meeting('ap-14', 'kh-08', 're-dung', d(21, 1, 2027), 'CANCELLED', null),
  meeting('ap-15', 'kh-08', 're-dung', d(5, 2, 2027), 'SCHEDULED', null),
];

const move = (
  id: string,
  customerId: string,
  from: StageTransition['from'],
  to: StageTransition['to'],
  date: CalendarDate,
  appointmentId: string | null = null,
): StageTransition => ({ id, customerId, from, to, date, appointmentId });

export const STAGE_TRANSITIONS: readonly StageTransition[] = [
  move('st-01', 'kh-01', null, 'N4', d(1, 12, 2026)),
  move('st-02', 'kh-01', 'N4', 'N3', d(15, 12, 2026), 'ap-01'),
  move('st-03', 'kh-01', 'N3', 'N2', d(29, 12, 2026), 'ap-02'),
  move('st-04', 'kh-02', null, 'N3', d(1, 12, 2026)),
  move('st-05', 'kh-02', 'N3', 'N1', d(2, 1, 2027), 'ap-03'),
  move('st-06', 'kh-03', null, 'N4', d(1, 12, 2026)),
  move('st-07', 'kh-03', 'N4', 'N2', d(6, 1, 2027), 'ap-04'),
  move('st-08', 'kh-03', 'N2', 'N3', d(13, 1, 2027), 'ap-05'),
  move('st-09', 'kh-03', 'N3', 'N2', d(20, 1, 2027), 'ap-06'),
  move('st-10', 'kh-04', null, 'N4', d(1, 12, 2026)),
  move('st-11', 'kh-04', 'N4', 'N2', d(8, 1, 2027)),
  move('st-12', 'kh-04', 'N2', 'N1', d(15, 1, 2027), 'ap-08'),
  move('st-13', 'kh-05', null, 'N4', d(1, 12, 2026)),
  move('st-14', 'kh-05', 'N4', 'N1', d(4, 1, 2027), 'ap-09'),
  move('st-15', 'kh-06', null, 'N3', d(1, 12, 2026)),
  move('st-16', 'kh-06', 'N3', 'ON_HOLD', d(5, 1, 2027)),
  move('st-17', 'kh-06', 'ON_HOLD', 'N3', d(18, 1, 2027), 'ap-10'),
  move('st-18', 'kh-06', 'N3', 'N2', d(27, 1, 2027), 'ap-11'),
  move('st-19', 'kh-07', null, 'N4', d(1, 12, 2026)),
  move('st-20', 'kh-07', 'N4', 'N2', d(11, 1, 2027)),
  move('st-21', 'kh-07', 'N2', 'LOST', d(25, 1, 2027)),
  move('st-22', 'kh-08', null, 'N3', d(1, 12, 2026)),
  move('st-23', 'kh-09', null, 'N1', d(1, 12, 2026)),
];

const policy = (
  id: string,
  customerId: string,
  rmId: string,
  submittedDate: CalendarDate,
  submittedFyp: number,
  issuedDate: CalendarDate | null,
  issuedFyp: number | null,
): Policy => ({
  id,
  customerId,
  rmId,
  submittedDate,
  submittedFyp,
  issuedDate,
  issuedFyp,
  // Section 1 has no cancelled policy (golden `chi-so.md` mục 4.2, B1a).
  cancelledDate: null,
});

export const POLICIES: readonly Policy[] = [
  policy('hd-01', 'kh-01', 're-an', d(30, 12, 2026), 500 * MILLION, d(5, 1, 2027), 500 * MILLION),
  // Submitted 31/01, issued 02/02; issued FYP corrected by hand (G2 D).
  policy('hd-02', 'kh-02', 're-an', d(31, 1, 2027), 300 * MILLION, d(2, 2, 2027), 280 * MILLION),
  policy('hd-03', 'kh-02', 're-an', d(31, 1, 2027), 200 * MILLION, null, null),
  policy(
    'hd-04',
    'kh-03',
    're-binh',
    d(25, 1, 2027),
    1_000 * MILLION,
    d(28, 1, 2027),
    1_000 * MILLION,
  ),
  policy('hd-05', 'kh-05', 're-chi', d(10, 1, 2027), 150 * MILLION, d(20, 1, 2027), 150 * MILLION),
  policy('hd-06', 'kh-05', 're-chi', d(12, 1, 2027), 250 * MILLION, d(22, 1, 2027), 250 * MILLION),
  policy('hd-07', 'kh-09', 're-dung', d(20, 12, 2026), 400 * MILLION, d(8, 1, 2027), 400 * MILLION),
];

/** Appointments that are a chuyển RF (Đã gặp, N4/N3 → N2/N1). Every other appointment is not. */
export const EXPECTED_RF_APPOINTMENT_IDS: readonly string[] = [
  'ap-02',
  'ap-03',
  'ap-04',
  'ap-06',
  'ap-09',
  'ap-11',
];

/** An exact fraction as the golden table writes it: `4/7` is `{ numerator: 4, denominator: 7 }`. */
type Fraction = { readonly numerator: number; readonly denominator: number };

export interface ExpectedMetrics {
  /** HĐ đã nộp: policies with `submittedDate` in the period. */
  readonly submittedCount: number;
  /** Case size: Σ `submittedFyp` of those policies. */
  readonly caseSize: number;
  /** HĐ phát hành: policies with `issuedDate` in the period, cancelled later or not. */
  readonly issuedCount: number;
  /** HĐ hủy: policies with `cancelledDate` in the period. */
  readonly cancelledCount: number;
  /** Tổng số HĐ = issuedCount − cancelledCount; may be below 0. */
  readonly netCount: number;
  /** FYP phát hành: Σ `issuedFyp` of the issued policies (Doanh số before golden B). */
  readonly issuedFyp: number;
  /** FYP hủy: Σ `issuedFyp` of the cancelled policies. */
  readonly cancelledFyp: number;
  /** Doanh số = issuedFyp − cancelledFyp; may be below 0. */
  readonly revenue: number;
  /** Cuộc gặp chuyển RF with the meeting day in the period. */
  readonly rfCount: number;
  /** Tỷ lệ chốt = issuedCount ÷ rfCount as an exact fraction; null (shown "—") when rfCount is 0. */
  readonly closeRate: Fraction | null;
  /** Tỷ lệ hủy = cancelledCount ÷ issuedCount; null (shown "—") when issuedCount is 0. */
  readonly cancelRate: Fraction | null;
}

export interface GoldenCase {
  /** Row id in `docs/golden/chi-so.md`. */
  readonly id: string;
  readonly period: Period;
  readonly scope: Scope;
  readonly expected: ExpectedMetrics;
}

/** "Today" for the MTD example. */
export const MTD_VIEWING_DATE = d(15, 1, 2027);

const ALL: Scope = { kind: 'all' };
const team = (teamId: string): Scope => ({ kind: 'team', teamId });
const rm = (rmId: string): Scope => ({ kind: 'rm', rmId });

/**
 * A row of section 2. Its columns of golden B follow the rule at the end of mục 4.2, as section 1
 * has no cancelled policy: Hủy 0, Tổng số HĐ = PH, FYP PH = Doanh số, FYP hủy 0, Tỷ lệ hủy 0/PH
 * (0%), or "—" when PH is 0.
 */
const expected = (
  submittedCount: number,
  caseSizeMillions: number,
  issuedCount: number,
  revenueMillions: number,
  rfCount: number,
): ExpectedMetrics => ({
  submittedCount,
  caseSize: caseSizeMillions * MILLION,
  issuedCount,
  cancelledCount: 0,
  netCount: issuedCount,
  issuedFyp: revenueMillions * MILLION,
  cancelledFyp: 0,
  revenue: revenueMillions * MILLION,
  rfCount,
  closeRate: rfCount === 0 ? null : { numerator: issuedCount, denominator: rfCount },
  cancelRate: issuedCount === 0 ? null : { numerator: 0, denominator: issuedCount },
});

const DAY_02_01 = periodOf('day', d(2, 1, 2027));
const DAY_31_01 = periodOf('day', d(31, 1, 2027));
const DAY_02_02 = periodOf('day', d(2, 2, 2027));
const WEEK_ACROSS_YEAR = periodOf('week', d(28, 12, 2026));
const WEEK_25_01 = periodOf('week', d(25, 1, 2027));
const DEC_2026 = periodOf('month', d(1, 12, 2026));
const JAN_2027 = periodOf('month', d(1, 1, 2027));
const FEB_2027 = periodOf('month', d(1, 2, 2027));
const MTD_JAN_2027 = customPeriod(d(1, 1, 2027), MTD_VIEWING_DATE);
const YEAR_2026 = periodOf('year', d(1, 1, 2026));
const YEAR_2027 = periodOf('year', d(1, 1, 2027));

export const GOLDEN_CASES: readonly GoldenCase[] = [
  // expected(submitted, case size tr, issued, revenue tr, RF)
  { id: 'G01', period: DAY_02_01, scope: ALL, expected: expected(0, 0, 0, 0, 1) },
  { id: 'G02', period: DAY_31_01, scope: ALL, expected: expected(2, 500, 0, 0, 0) },
  { id: 'G03', period: DAY_02_02, scope: ALL, expected: expected(0, 0, 1, 280, 0) },
  { id: 'G04', period: WEEK_ACROSS_YEAR, scope: ALL, expected: expected(1, 500, 0, 0, 2) },
  { id: 'G05', period: WEEK_ACROSS_YEAR, scope: rm('re-an'), expected: expected(1, 500, 0, 0, 2) },
  { id: 'G06', period: WEEK_ACROSS_YEAR, scope: team('team-b'), expected: expected(0, 0, 0, 0, 0) },
  { id: 'G07', period: WEEK_25_01, scope: ALL, expected: expected(3, 1_500, 1, 1_000, 1) },
  { id: 'G08', period: DEC_2026, scope: ALL, expected: expected(2, 900, 0, 0, 1) },
  { id: 'G09', period: JAN_2027, scope: ALL, expected: expected(5, 1_900, 5, 2_300, 5) },
  { id: 'G10', period: JAN_2027, scope: team('team-a'), expected: expected(3, 1_500, 2, 1_500, 3) },
  { id: 'G11', period: JAN_2027, scope: team('team-b'), expected: expected(2, 400, 3, 800, 2) },
  { id: 'G12', period: JAN_2027, scope: rm('re-an'), expected: expected(2, 500, 1, 500, 1) },
  { id: 'G13', period: JAN_2027, scope: rm('re-binh'), expected: expected(1, 1_000, 1, 1_000, 2) },
  { id: 'G14', period: JAN_2027, scope: rm('re-chi'), expected: expected(2, 400, 2, 400, 2) },
  { id: 'G15', period: JAN_2027, scope: rm('re-dung'), expected: expected(0, 0, 1, 400, 0) },
  { id: 'G16', period: FEB_2027, scope: ALL, expected: expected(0, 0, 1, 280, 0) },
  { id: 'G17', period: FEB_2027, scope: rm('re-an'), expected: expected(0, 0, 1, 280, 0) },
  { id: 'G18', period: MTD_JAN_2027, scope: ALL, expected: expected(2, 400, 2, 900, 3) },
  { id: 'G19', period: YEAR_2026, scope: ALL, expected: expected(2, 900, 0, 0, 1) },
  { id: 'G20', period: YEAR_2027, scope: ALL, expected: expected(5, 1_900, 6, 2_580, 5) },
  {
    id: 'G21',
    period: YEAR_2027,
    scope: team('team-a'),
    expected: expected(3, 1_500, 3, 1_780, 3),
  },
  { id: 'G22', period: YEAR_2027, scope: team('team-b'), expected: expected(2, 400, 3, 800, 2) },
];

/*
 * Scenario B — cancelled policies (golden `chi-so.md` mục 4). A data set of its own, every day in
 * 2028, with the people and teams of section 1. Section 1 has nothing in 2028, so G23–G41 come out
 * the same on scenario B alone or on section 1 and scenario B together (mục 4.3).
 */

/** A day of 2028, the year of scenario B. */
const b = (day: number, month: number): CalendarDate => calendarDate(2028, month, day);

/** Every customer of scenario B is created on 03/01/2028, at the stage of the column "Tạo". */
const CREATED_B = b(3, 1);

export const CUSTOMERS_B: readonly Customer[] = [
  { id: 'kh-11', name: 'KH 11', rmId: 're-dung', stage: 'N1' },
  { id: 'kh-12', name: 'KH 12', rmId: 're-chi', stage: 'N1' },
  { id: 'kh-13', name: 'KH 13', rmId: 're-an', stage: 'N2' },
  { id: 'kh-14', name: 'KH 14', rmId: 're-binh', stage: 'N2' },
  { id: 'kh-15', name: 'KH 15', rmId: 're-chi', stage: 'N1' },
  { id: 'kh-16', name: 'KH 16', rmId: 're-an', stage: 'N2' },
];

/** Each one a cuộc gặp chuyển RF, recorded by the RM of its customer. */
export const APPOINTMENTS_B: readonly Appointment[] = [
  meeting('ap-21', 'kh-12', 're-chi', b(4, 1), 'MET', 'N1'),
  meeting('ap-22', 'kh-13', 're-an', b(5, 1), 'MET', 'N2'),
  meeting('ap-23', 'kh-14', 're-binh', b(7, 1), 'MET', 'N2'),
  meeting('ap-24', 'kh-15', 're-chi', b(11, 1), 'MET', 'N1'),
  meeting('ap-25', 'kh-16', 're-an', b(19, 1), 'MET', 'N2'),
];

export const STAGE_TRANSITIONS_B: readonly StageTransition[] = [
  move('st-31', 'kh-11', null, 'N1', CREATED_B),
  move('st-32', 'kh-12', null, 'N3', CREATED_B),
  move('st-33', 'kh-12', 'N3', 'N1', b(4, 1), 'ap-21'),
  move('st-34', 'kh-13', null, 'N4', CREATED_B),
  move('st-35', 'kh-13', 'N4', 'N2', b(5, 1), 'ap-22'),
  move('st-36', 'kh-14', null, 'N3', CREATED_B),
  move('st-37', 'kh-14', 'N3', 'N2', b(7, 1), 'ap-23'),
  move('st-38', 'kh-15', null, 'N4', CREATED_B),
  move('st-39', 'kh-15', 'N4', 'N1', b(11, 1), 'ap-24'),
  move('st-40', 'kh-16', null, 'N3', CREATED_B),
  move('st-41', 'kh-16', 'N3', 'N2', b(19, 1), 'ap-25'),
];

/** Appointments of scenario B that are a chuyển RF: all five. */
export const EXPECTED_RF_APPOINTMENT_IDS_B: readonly string[] = [
  'ap-21',
  'ap-22',
  'ap-23',
  'ap-24',
  'ap-25',
];

/**
 * A policy of scenario B. Deletion lives outside `Policy`: the repository never returns a deleted
 * policy, so the tests drop those rows the same way (as `K-26` of `stage-snapshot.fixture.ts`).
 */
export interface GoldenPolicyRow {
  readonly policy: Policy;
  readonly deleted: boolean;
}

const policyB = (
  id: string,
  customerId: string,
  rmId: string,
  submitted: readonly [date: CalendarDate, fypMillions: number],
  issued: readonly [date: CalendarDate, fypMillions: number],
  cancelledDate: CalendarDate | null,
  extra: { readonly deleted?: boolean } = {},
): GoldenPolicyRow => ({
  policy: {
    id,
    customerId,
    rmId,
    submittedDate: submitted[0],
    submittedFyp: submitted[1] * MILLION,
    issuedDate: issued[0],
    issuedFyp: issued[1] * MILLION,
    cancelledDate,
  },
  deleted: extra.deleted ?? false,
});

/** The final state, after `hd-18` was cancelled on 08/02 and that cancellation undone. */
export const POLICY_ROWS_B: readonly GoldenPolicyRow[] = [
  // Issued in week 1, cancelled in week 2 (spec §4.1).
  policyB('hd-11', 'kh-11', 're-dung', [b(3, 1), 200], [b(4, 1), 200], b(12, 1)),
  // Issued FYP corrected by hand, so the FYP cancelled is 280.
  policyB('hd-12', 'kh-12', 're-chi', [b(4, 1), 300], [b(6, 1), 280], b(20, 1)),
  policyB('hd-13', 'kh-13', 're-an', [b(5, 1), 300], [b(10, 1), 300], null),
  // Issued and cancelled in the same week.
  policyB('hd-14', 'kh-13', 're-an', [b(5, 1), 100], [b(11, 1), 100], b(14, 1)),
  policyB('hd-15', 'kh-14', 're-binh', [b(7, 1), 500], [b(12, 1), 500], b(19, 1)),
  // Issued in January, cancelled in February.
  policyB('hd-16', 'kh-15', 're-chi', [b(11, 1), 400], [b(13, 1), 400], b(7, 2)),
  policyB('hd-17', 'kh-15', 're-chi', [b(14, 1), 250], [b(18, 1), 250], null),
  // Cancelled on 08/02, then the cancellation undone (`HD_18_CANCELLATION`, G36).
  policyB('hd-18', 'kh-16', 're-an', [b(1, 2), 200], [b(3, 2), 200], null),
  // Deleted (soft delete) after it was cancelled.
  policyB('hd-19', 'kh-14', 're-binh', [b(2, 2), 150], [b(4, 2), 150], b(9, 2), { deleted: true }),
  // Cancelled on its issue day.
  policyB('hd-20', 'kh-11', 're-dung', [b(14, 2), 100], [b(15, 2), 100], b(15, 2)),
];

/** A cancellation the final state no longer has. */
export interface PolicyCancellation {
  readonly policyId: string;
  readonly cancelledDate: CalendarDate;
}

/** `hd-18` before its cancellation was undone: G36 counts the data with it. */
export const HD_18_CANCELLATION: PolicyCancellation = { policyId: 'hd-18', cancelledDate: b(8, 2) };

/** A row of mục 4.2; `variant` is a cancellation added to the final state before counting. */
export interface GoldenBCase extends GoldenCase {
  readonly variant: PolicyCancellation | null;
}

type Rate = readonly [numerator: number, denominator: number] | null;

/** "—": the rate has nothing to divide by. */
const NONE: Rate = null;

const fraction = (rate: Rate): Fraction | null =>
  rate === null ? null : { numerator: rate[0], denominator: rate[1] };

type Counts = readonly [
  submitted: number,
  caseSize: number,
  issued: number,
  cancelled: number,
  net: number,
];
type Fyps = readonly [issued: number, cancelled: number, revenue: number];

/** A row of mục 4.2 with every column as the table writes it, money in millions. */
const caseB = (
  id: string,
  period: Period,
  scope: Scope,
  [submittedCount, caseSizeMillions, issuedCount, cancelledCount, netCount]: Counts,
  [issuedFypMillions, cancelledFypMillions, revenueMillions]: Fyps,
  rfCount: number,
  closeRate: Rate,
  cancelRate: Rate,
  variant: PolicyCancellation | null = null,
): GoldenBCase => ({
  id,
  period,
  scope,
  expected: {
    submittedCount,
    caseSize: caseSizeMillions * MILLION,
    issuedCount,
    cancelledCount,
    netCount,
    issuedFyp: issuedFypMillions * MILLION,
    cancelledFyp: cancelledFypMillions * MILLION,
    revenue: revenueMillions * MILLION,
    rfCount,
    closeRate: fraction(closeRate),
    cancelRate: fraction(cancelRate),
  },
  variant,
});

// The periods of scenario B: weeks 1–3 of 01/2028, 01/2028, 02/2028, 15/02/2028, 2028.
const B_W1 = periodOf('week', b(3, 1));
const B_W2 = periodOf('week', b(10, 1));
const B_W3 = periodOf('week', b(17, 1));
const B_JAN = periodOf('month', b(1, 1));
const B_FEB = periodOf('month', b(1, 2));
const B_15_02 = periodOf('day', b(15, 2));
const B_YEAR = periodOf('year', b(1, 1));

export const GOLDEN_B_CASES: readonly GoldenBCase[] = [
  // id, period, scope, [Nộp, Case size tr, PH, Hủy, Tổng số HĐ], [FYP PH tr, FYP hủy tr,
  // Doanh số tr], RF, Tỷ lệ chốt, Tỷ lệ hủy
  caseB('G23', B_W1, rm('re-dung'), [1, 200, 1, 0, 1], [200, 0, 200], 0, NONE, [0, 1]),
  caseB('G24', B_W2, rm('re-dung'), [0, 0, 0, 1, -1], [0, 200, -200], 0, NONE, NONE),
  caseB('G25', B_JAN, rm('re-dung'), [1, 200, 1, 1, 0], [200, 200, 0], 0, NONE, [1, 1]),
  caseB('G26', B_W1, ALL, [5, 1_400, 2, 0, 2], [480, 0, 480], 3, [2, 3], [0, 2]),
  caseB('G27', B_W2, ALL, [2, 650, 4, 2, 2], [1_300, 300, 1_000], 1, [4, 1], [2, 4]),
  caseB('G28', B_W3, ALL, [0, 0, 1, 2, -1], [250, 780, -530], 1, [1, 1], [2, 1]),
  caseB('G29', B_JAN, ALL, [7, 2_050, 7, 4, 3], [2_030, 1_080, 950], 5, [7, 5], [4, 7]),
  caseB('G30', B_JAN, team('team-a'), [3, 900, 3, 2, 1], [900, 600, 300], 3, [3, 3], [2, 3]),
  caseB('G31', B_JAN, team('team-b'), [4, 1_150, 4, 2, 2], [1_130, 480, 650], 2, [4, 2], [2, 4]),
  caseB('G32', B_JAN, rm('re-an'), [2, 400, 2, 1, 1], [400, 100, 300], 2, [2, 2], [1, 2]),
  caseB('G33', B_JAN, rm('re-binh'), [1, 500, 1, 1, 0], [500, 500, 0], 1, [1, 1], [1, 1]),
  caseB('G34', B_JAN, rm('re-chi'), [3, 950, 3, 1, 2], [930, 280, 650], 2, [3, 2], [1, 3]),
  caseB('G35', B_FEB, rm('re-chi'), [0, 0, 0, 1, -1], [0, 400, -400], 0, NONE, NONE),
  // A variant: `hd-18` still cancelled on 08/02.
  caseB(
    'G36',
    B_FEB,
    rm('re-an'),
    [1, 200, 1, 1, 0],
    [200, 200, 0],
    0,
    NONE,
    [1, 1],
    HD_18_CANCELLATION,
  ),
  caseB('G37', B_FEB, rm('re-an'), [1, 200, 1, 0, 1], [200, 0, 200], 0, NONE, [0, 1]),
  caseB('G38', B_FEB, rm('re-binh'), [0, 0, 0, 0, 0], [0, 0, 0], 0, NONE, NONE),
  caseB('G39', B_15_02, rm('re-dung'), [0, 0, 1, 1, 0], [100, 100, 0], 0, NONE, [1, 1]),
  caseB('G40', B_FEB, ALL, [2, 300, 2, 2, 0], [300, 500, -200], 0, NONE, [2, 2]),
  caseB('G41', B_YEAR, ALL, [9, 2_350, 9, 6, 3], [2_330, 1_580, 750], 5, [9, 5], [6, 9]),
];
