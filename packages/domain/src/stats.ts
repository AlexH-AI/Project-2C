/**
 * Stats engine (ADR-0007, golden examples approved at G2 in T-028). Every metric is computed for
 * one period and one scope from the raw records; nothing is accumulated across periods.
 * FYP amounts are integer đồng (see `model.ts`), so sums stay exact.
 */
import { isRfTransition } from './customer-lifecycle';
import type { Appointment, Person, Policy, Scope, StageTransition } from './model';
import { daysBetween, formatDate, isInPeriod } from './period';
import type { CalendarDate, Period } from './period';

export interface PolicyMetrics {
  /** HĐ đã nộp: policies with `submittedDate` in the period. */
  readonly submittedCount: number;
  /** Case size: Σ `submittedFyp` of the submitted policies. */
  readonly caseSize: number;
  /** HĐ phát hành: policies with `issuedDate` in the period. */
  readonly issuedCount: number;
  /** Doanh số: Σ `issuedFyp` of the issued policies. */
  readonly revenue: number;
}

/*
 * Matchers index their list once per metric call (F-06) and are never cached across calls, so
 * the caller's lists stay untouched and a later change to them is always read.
 */

/** Whether a record owned by an RE counts in the scope; built once, then checked per record. */
export function scopeMatcher(people: readonly Person[], scope: Scope): (reId: string) => boolean {
  switch (scope.kind) {
    case 'all':
      return () => true;
    case 're':
      return (reId) => reId === scope.reId;
    case 'team': {
      const members = new Set(
        people.filter((person) => person.teamId === scope.teamId).map((person) => person.id),
      );
      return (reId) => members.has(reId);
    }
  }
}

/**
 * The index of the mark holding a day, or -1 when none does; built once, then checked per record.
 * Marks run earliest first and never overlap, as `chartMarks` and `reportMarks` cut them, though
 * gaps between them are allowed. Each day of the marks is indexed, so a lookup is one subtraction.
 */
export function markIndexer(marks: readonly Period[]): (date: CalendarDate) => number {
  const first = marks[0]?.start;
  const last = marks.at(-1)?.end;
  if (first === undefined || last === undefined) return () => -1;
  const byDay = new Int32Array(Math.max(daysBetween(first, last) + 1, 0)).fill(-1);
  marks.forEach((mark, index) => {
    const from = daysBetween(first, mark.start);
    const to = daysBetween(first, mark.end);
    if (from < 0 || to >= byDay.length || byDay.subarray(from, to + 1).some((at) => at !== -1)) {
      throw new RangeError(`Mark ${formatDate(mark.start)} is out of order or overlaps another`);
    }
    byDay.fill(index, from, to + 1);
  });
  return (date) => byDay[daysBetween(first, date)] ?? -1;
}

/** Whether an appointment is a cuộc gặp chuyển RF; built once, then checked per appointment. */
function rfMatcher(transitions: readonly StageTransition[]): (appointment: Appointment) => boolean {
  const rfIds = new Set(
    transitions
      .filter((t) => t.appointmentId !== null && isRfTransition(t.from, t.to))
      .map((t) => t.appointmentId),
  );
  return (appointment) => appointment.status === 'MET' && rfIds.has(appointment.id);
}

/**
 * Whether a record owned by `reId` counts in the scope. A record counts for its RE and for that
 * RE's current team (G2 E).
 */
export function inScope(people: readonly Person[], reId: string, scope: Scope): boolean {
  return scopeMatcher(people, scope)(reId);
}

const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0);

export function policyMetrics(
  data: { readonly people: readonly Person[]; readonly policies: readonly Policy[] },
  period: Period,
  scope: Scope,
): PolicyMetrics {
  const matches = scopeMatcher(data.people, scope);
  const policies = data.policies.filter((policy) => matches(policy.reId));
  const submitted = policies.filter((policy) => isInPeriod(policy.submittedDate, period));
  const issued = policies.filter(
    (policy) => policy.issuedDate !== null && isInPeriod(policy.issuedDate, period),
  );
  return {
    submittedCount: submitted.length,
    caseSize: sum(submitted.map((policy) => policy.submittedFyp)),
    issuedCount: issued.length,
    revenue: sum(issued.map((policy) => policy.issuedFyp ?? policy.submittedFyp)),
  };
}

/**
 * Whether the appointment is a cuộc gặp chuyển RF: it was met and its own "stage after" moved the
 * customer from N4/N3 up to N2/N1 (G2 B). Manual stage changes point to no appointment, so they
 * never count; an appointment counts at most once.
 */
export function isRfAppointment(
  appointment: Appointment,
  transitions: readonly StageTransition[],
): boolean {
  return rfMatcher(transitions)(appointment);
}

/** Cuộc gặp chuyển RF with the meeting day in the period, for the RE on the appointment (G2 C). */
export function rfCount(
  data: {
    readonly people: readonly Person[];
    readonly appointments: readonly Appointment[];
    readonly transitions: readonly StageTransition[];
  },
  period: Period,
  scope: Scope,
): number {
  const matches = scopeMatcher(data.people, scope);
  const isRf = rfMatcher(data.transitions);
  return data.appointments.filter(
    (appointment) =>
      matches(appointment.reId) && isInPeriod(appointment.date, period) && isRf(appointment),
  ).length;
}

/** An exact fraction; it may exceed 1 (more policies issued than RF in the period). */
export interface CloseRate {
  readonly numerator: number;
  readonly denominator: number;
}

/** Tỉ lệ chốt = issued ÷ RF in the same period (G2 F); null — shown "—" — when there is no RF. */
export function closeRate(issuedCount: number, rfCount: number): CloseRate | null {
  return rfCount === 0 ? null : { numerator: issuedCount, denominator: rfCount };
}

export interface PeriodMetrics extends PolicyMetrics {
  readonly rfCount: number;
  readonly closeRate: CloseRate | null;
}

export interface MetricsData {
  readonly people: readonly Person[];
  readonly policies: readonly Policy[];
  readonly appointments: readonly Appointment[];
  readonly transitions: readonly StageTransition[];
}

/** Every metric of one period and one scope. Nothing is carried over from earlier periods. */
export function periodMetrics(data: MetricsData, period: Period, scope: Scope): PeriodMetrics {
  const policies = policyMetrics(data, period, scope);
  const rf = rfCount(data, period, scope);
  return { ...policies, rfCount: rf, closeRate: closeRate(policies.issuedCount, rf) };
}

/**
 * `periodMetrics` of each mark, in one pass over the records (Theo mốc, spec Phase 4 §4.4): each
 * policy and appointment is put in the mark holding its day. Equal, mark by mark, to calling
 * `periodMetrics` for each one; marks as `markIndexer` takes them.
 */
export function periodMetricsByMark(
  data: MetricsData,
  marks: readonly Period[],
  scope: Scope,
): PeriodMetrics[] {
  const matches = scopeMatcher(data.people, scope);
  const markOf = markIndexer(marks);
  const isRf = rfMatcher(data.transitions);
  const parts = marks.map(() => ({
    submittedCount: 0,
    caseSize: 0,
    issuedCount: 0,
    revenue: 0,
    rfCount: 0,
  }));
  for (const policy of data.policies) {
    if (!matches(policy.reId)) continue;
    const submitted = parts[markOf(policy.submittedDate)];
    if (submitted) {
      submitted.submittedCount += 1;
      submitted.caseSize += policy.submittedFyp;
    }
    const issued = policy.issuedDate && parts[markOf(policy.issuedDate)];
    if (issued) {
      issued.issuedCount += 1;
      issued.revenue += policy.issuedFyp ?? policy.submittedFyp;
    }
  }
  for (const appointment of data.appointments) {
    if (!matches(appointment.reId) || !isRf(appointment)) continue;
    const part = parts[markOf(appointment.date)];
    if (part) part.rfCount += 1;
  }
  return parts.map((part) => ({ ...part, closeRate: closeRate(part.issuedCount, part.rfCount) }));
}
