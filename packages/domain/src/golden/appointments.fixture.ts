/**
 * Golden examples for appointment counts by period (Phase 4 G2 §1), mirrored 1–1 from
 * `docs/golden/lich-hen.md` (rows `L-…`, cases `A…`). Never edit it to make a test green — a change
 * needs the Owner's approval again (G2). People are those of `metrics.fixture.ts`.
 */
import type { AppointmentCounts } from '../appointment-counts';
import type { Appointment, Scope } from '../model';
import { calendarDate, periodOf } from '../period';
import type { CalendarDate, Period } from '../period';

const d = (day: number, month: number, year = 2027): CalendarDate => calendarDate(year, month, day);

/** Hôm nay of the scenario, Wednesday 13/01/2027, unless a case says otherwise. */
export const APPOINTMENT_TODAY = d(13, 1);

/**
 * One row of the scenario. Deletion lives outside `Appointment`: the repository never returns a
 * deleted appointment or one of a deleted customer, so the tests drop those rows the same way.
 */
export interface GoldenAppointmentRow {
  readonly appointment: Appointment;
  /** The appointment this one was rescheduled from (D3 chain), kept to document the chain. */
  readonly rescheduledFromId: string | null;
  readonly deleted: boolean;
  readonly customerDeleted: boolean;
}

const row = (
  id: string,
  customerId: string,
  date: CalendarDate,
  reId: string,
  status: Appointment['status'],
  extra: {
    readonly coordinatorIds?: readonly string[];
    readonly rescheduledFromId?: string;
    readonly deleted?: boolean;
    readonly customerDeleted?: boolean;
  } = {},
): GoldenAppointmentRow => ({
  appointment: {
    id,
    customerId,
    reId,
    coordinatorIds: extra.coordinatorIds ?? [],
    date,
    status,
    stageAfter: status === 'MET' ? 'N3' : null,
    expectedCaseSize: null,
    nextStep: null,
    note: '',
  },
  rescheduledFromId: extra.rescheduledFromId ?? null,
  deleted: extra.deleted ?? false,
  customerDeleted: extra.customerDeleted ?? false,
});

export const APPOINTMENT_ROWS: readonly GoldenAppointmentRow[] = [
  row('L-01', 'kh-l01', d(5, 1), 're-an', 'MET', { coordinatorIds: ['tl-ha'] }),
  row('L-02', 'kh-l02', d(6, 1), 're-an', 'CANCELLED'),
  row('L-03', 'kh-l03', d(7, 1), 're-an', 'RESCHEDULED'),
  row('L-04', 'kh-l03', d(12, 1), 're-an', 'RESCHEDULED', { rescheduledFromId: 'L-03' }),
  row('L-05', 'kh-l03', d(20, 1), 're-an', 'SCHEDULED', { rescheduledFromId: 'L-04' }),
  row('L-06', 'kh-l06', d(11, 1), 're-chi', 'SCHEDULED'),
  row('L-07', 'kh-l07', d(13, 1), 're-chi', 'SCHEDULED'),
  row('L-08', 'kh-l08', d(29, 12, 2026), 're-chi', 'RESCHEDULED'),
  row('L-09', 'kh-l08', d(4, 1), 're-chi', 'MET', {
    coordinatorIds: ['re-dung'],
    rescheduledFromId: 'L-08',
  }),
  row('L-10', 'kh-l10', d(8, 1), 're-binh', 'NO_SHOW'),
  row('L-11', 'kh-l11', d(9, 1), 're-binh', 'RESCHEDULED'),
  row('L-12', 'kh-l11', d(15, 1), 're-binh', 'SCHEDULED', {
    rescheduledFromId: 'L-11',
    deleted: true,
  }),
  row('L-13', 'kh-l13', d(10, 1), 're-binh', 'MET', { deleted: true }),
  row('L-14', 'kh-l14', d(8, 1), 're-dung', 'SCHEDULED', { customerDeleted: true }),
];

export interface AppointmentGoldenCase {
  readonly id: string;
  readonly period: Period;
  readonly scope: Scope;
  readonly today: CalendarDate;
  /** Deleted rows restored before counting (A13). */
  readonly restoredIds: readonly string[];
  readonly expected: AppointmentCounts;
}

const ALL: Scope = { kind: 'all' };
const WEEK_04_01 = periodOf('week', d(4, 1));
const WEEK_11_01 = periodOf('week', d(11, 1));
const JANUARY = periodOf('month', d(1, 1));

const counts = (
  met: number,
  missed: number,
  unrecorded: number,
  planned: number,
  total: number,
): AppointmentCounts => ({ met, missed, unrecorded, planned, total });

const golden = (
  id: string,
  period: Period,
  scope: Scope,
  expected: AppointmentCounts,
  extra: { readonly today?: CalendarDate; readonly restoredIds?: readonly string[] } = {},
): AppointmentGoldenCase => ({
  id,
  period,
  scope,
  today: extra.today ?? APPOINTMENT_TODAY,
  restoredIds: extra.restoredIds ?? [],
  expected,
});

export const APPOINTMENT_GOLDEN_CASES: readonly AppointmentGoldenCase[] = [
  golden('A01', WEEK_04_01, ALL, counts(2, 4, 0, 0, 6)),
  golden('A02', WEEK_11_01, ALL, counts(0, 1, 1, 1, 3)),
  golden('A03', JANUARY, ALL, counts(2, 5, 1, 2, 10)),
  golden('A04', periodOf('month', d(1, 12, 2026)), ALL, counts(0, 1, 0, 0, 1)),
  golden('A05', periodOf('day', d(13, 1)), ALL, counts(0, 0, 0, 1, 1)),
  golden('A06', periodOf('year', d(1, 1)), ALL, counts(2, 5, 1, 2, 10)),
  golden('A07', JANUARY, { kind: 're', reId: 're-an' }, counts(1, 3, 0, 1, 5)),
  golden('A08', JANUARY, { kind: 're', reId: 're-chi' }, counts(1, 0, 1, 1, 3)),
  golden('A09', JANUARY, { kind: 're', reId: 're-dung' }, counts(0, 0, 0, 0, 0)),
  golden('A10', JANUARY, { kind: 'team', teamId: 'team-a' }, counts(1, 5, 0, 1, 7)),
  golden('A11', JANUARY, { kind: 'team', teamId: 'team-b' }, counts(1, 0, 1, 1, 3)),
  golden('A12', JANUARY, ALL, counts(2, 5, 3, 0, 10), { today: d(21, 1) }),
  golden('A13', WEEK_11_01, ALL, counts(0, 1, 1, 2, 4), { restoredIds: ['L-12'] }),
];
