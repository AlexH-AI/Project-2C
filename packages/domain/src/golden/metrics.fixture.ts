/**
 * Golden examples for the metrics (ADR-0007, approved by the Owner at G2). One scenario, two teams,
 * December 2026 – February 2027. Expected results are written by hand and mirrored 1–1 in
 * `docs/golden/chi-so.md`. Stats engine tests must pass against this file; never edit it to make a
 * test green — a change needs the Owner's approval again.
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
  { id: 're-an', name: 'An', role: 'RE', teamId: 'team-a' },
  { id: 're-binh', name: 'Bình', role: 'RE', teamId: 'team-a' },
  { id: 'tl-ha', name: 'Hà', role: 'TL', teamId: 'team-a' },
  { id: 're-chi', name: 'Chi', role: 'RE', teamId: 'team-b' },
  { id: 're-dung', name: 'Dũng', role: 'RE', teamId: 'team-b' },
  { id: 'is-khoa', name: 'Khoa', role: 'IS', teamId: null },
];

export const CUSTOMERS: readonly Customer[] = [
  { id: 'kh-01', name: 'KH 01', reId: 're-an', stage: 'N2' },
  { id: 'kh-02', name: 'KH 02', reId: 're-an', stage: 'N1' },
  { id: 'kh-03', name: 'KH 03', reId: 're-binh', stage: 'N2' },
  { id: 'kh-04', name: 'KH 04', reId: 're-binh', stage: 'N1' },
  { id: 'kh-05', name: 'KH 05', reId: 're-chi', stage: 'N1' },
  { id: 'kh-06', name: 'KH 06', reId: 're-chi', stage: 'N2' },
  { id: 'kh-07', name: 'KH 07', reId: 're-chi', stage: 'LOST' },
  { id: 'kh-08', name: 'KH 08', reId: 're-dung', stage: 'N3' },
  { id: 'kh-09', name: 'KH 09', reId: 're-dung', stage: 'N1' },
];

const meeting = (
  id: string,
  customerId: string,
  reId: string,
  date: CalendarDate,
  status: Appointment['status'],
  stageAfter: Appointment['stageAfter'],
  extra: Partial<Pick<Appointment, 'coordinatorIds' | 'expectedCaseSize' | 'nextStep'>> = {},
): Appointment => ({
  id,
  customerId,
  reId,
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
  meeting('ap-04', 'kh-03', 're-binh', d(6, 1, 2027), 'MET', 'N2', { coordinatorIds: ['tl-ha'] }),
  meeting('ap-05', 'kh-03', 're-binh', d(13, 1, 2027), 'MET', 'N3'),
  meeting('ap-06', 'kh-03', 're-binh', d(20, 1, 2027), 'MET', 'N2', {
    expectedCaseSize: 1_000 * MILLION,
  }),
  meeting('ap-07', 'kh-04', 're-binh', d(8, 1, 2027), 'RESCHEDULED', 'N2'),
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
  move('st-11', 'kh-04', 'N4', 'N2', d(8, 1, 2027), 'ap-07'),
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
  reId: string,
  submittedDate: CalendarDate,
  submittedFyp: number,
  issuedDate: CalendarDate | null,
  issuedFyp: number | null,
): Policy => ({ id, customerId, reId, submittedDate, submittedFyp, issuedDate, issuedFyp });

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

export interface ExpectedMetrics {
  /** HĐ đã nộp: policies with `submittedDate` in the period. */
  readonly submittedCount: number;
  /** Case size: Σ `submittedFyp` of those policies. */
  readonly caseSize: number;
  /** HĐ phát hành: policies with `issuedDate` in the period. */
  readonly issuedCount: number;
  /** Doanh số: Σ `issuedFyp` of those policies. */
  readonly revenue: number;
  /** Cuộc gặp chuyển RF with the meeting day in the period. */
  readonly rfCount: number;
  /** Tỉ lệ chốt = issuedCount ÷ rfCount as an exact fraction; null (shown "—") when rfCount is 0. */
  readonly closeRate: { readonly numerator: number; readonly denominator: number } | null;
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
const re = (reId: string): Scope => ({ kind: 're', reId });

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
  revenue: revenueMillions * MILLION,
  rfCount,
  closeRate: rfCount === 0 ? null : { numerator: issuedCount, denominator: rfCount },
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
  { id: 'G05', period: WEEK_ACROSS_YEAR, scope: re('re-an'), expected: expected(1, 500, 0, 0, 2) },
  { id: 'G06', period: WEEK_ACROSS_YEAR, scope: team('team-b'), expected: expected(0, 0, 0, 0, 0) },
  { id: 'G07', period: WEEK_25_01, scope: ALL, expected: expected(3, 1_500, 1, 1_000, 1) },
  { id: 'G08', period: DEC_2026, scope: ALL, expected: expected(2, 900, 0, 0, 1) },
  { id: 'G09', period: JAN_2027, scope: ALL, expected: expected(5, 1_900, 5, 2_300, 5) },
  { id: 'G10', period: JAN_2027, scope: team('team-a'), expected: expected(3, 1_500, 2, 1_500, 3) },
  { id: 'G11', period: JAN_2027, scope: team('team-b'), expected: expected(2, 400, 3, 800, 2) },
  { id: 'G12', period: JAN_2027, scope: re('re-an'), expected: expected(2, 500, 1, 500, 1) },
  { id: 'G13', period: JAN_2027, scope: re('re-binh'), expected: expected(1, 1_000, 1, 1_000, 2) },
  { id: 'G14', period: JAN_2027, scope: re('re-chi'), expected: expected(2, 400, 2, 400, 2) },
  { id: 'G15', period: JAN_2027, scope: re('re-dung'), expected: expected(0, 0, 1, 400, 0) },
  { id: 'G16', period: FEB_2027, scope: ALL, expected: expected(0, 0, 1, 280, 0) },
  { id: 'G17', period: FEB_2027, scope: re('re-an'), expected: expected(0, 0, 1, 280, 0) },
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
