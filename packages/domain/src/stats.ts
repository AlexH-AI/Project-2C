/**
 * Stats engine (ADR-0007, golden examples approved at G2 in T-028; cancelled policies by its
 * appendix "HĐ hủy", golden B). Every metric is computed for one period and one scope from the raw
 * records; nothing is accumulated across periods. A policy counts on each of its days that falls
 * in the period: submitted, issued, cancelled.
 * FYP amounts are whole numbers of the currency's smallest unit (`Money`), so sums stay exact;
 * `addMoney` refuses a sum past a safe integer rather than round it (DR-23).
 */
import { isRfTransition } from './customer-lifecycle';
import type { Appointment, Person, Policy, Scope, StageTransition } from './model';
import { addMoney, type Money } from './money';
import { daysBetween, formatDate, isInPeriod } from './period';
import type { CalendarDate, Period } from './period';

export interface PolicyMetrics {
  /** HĐ đã nộp: policies with `submittedDate` in the period. */
  readonly submittedCount: number;
  /** Case size: Σ `submittedFyp` of the submitted policies. */
  readonly caseSize: Money;
  /** HĐ phát hành: policies with `issuedDate` in the period, cancelled later or not. */
  readonly issuedCount: number;
  /** HĐ hủy: policies with `cancelledDate` in the period, for the RM on the policy. */
  readonly cancelledCount: number;
  /** Tổng số HĐ: `issuedCount − cancelledCount`; below 0 when more are cancelled than issued. */
  readonly netCount: number;
  /** FYP phát hành: Σ issued FYP of the issued policies (Doanh số before golden B). */
  readonly issuedFyp: Money;
  /** FYP hủy: Σ issued FYP of the cancelled policies; a cancelled FYP is never entered. */
  readonly cancelledFyp: Money;
  /** Doanh số: `issuedFyp − cancelledFyp`; below 0 when more is cancelled than issued. */
  readonly revenue: Money;
}

/*
 * Matchers index their list once per metric call (F-06) and are never cached across calls, so
 * the caller's lists stay untouched and a later change to them is always read.
 */

/** Whether a record owned by an RM counts in the scope; built once, then checked per record. */
export function scopeMatcher(people: readonly Person[], scope: Scope): (rmId: string) => boolean {
  switch (scope.kind) {
    case 'all':
      return () => true;
    case 'rm':
      return (rmId) => rmId === scope.rmId;
    case 'team': {
      const members = new Set(
        people.filter((person) => person.teamId === scope.teamId).map((person) => person.id),
      );
      return (rmId) => members.has(rmId);
    }
  }
}

/**
 * The index of the mark holding a day, or -1 when none does; built once, then checked per record.
 * Marks run earliest first and never overlap, as `chartMarks` and `reportMarks` cut them, though
 * gaps between them are allowed: each mark must start after the previous one ends, or this throws
 * a `RangeError`. Each day of the marks is indexed, so a lookup is one subtraction.
 */
export function markIndexer(marks: readonly Period[]): (date: CalendarDate) => number {
  const first = marks[0]?.start;
  const last = marks.at(-1)?.end;
  if (first === undefined || last === undefined) return () => -1;
  marks.forEach((mark, index) => {
    const previous = marks[index - 1];
    if (
      daysBetween(mark.start, mark.end) < 0 ||
      (previous !== undefined && daysBetween(previous.end, mark.start) <= 0)
    ) {
      throw new RangeError(`Mark ${formatDate(mark.start)} is out of order or overlaps another`);
    }
  });
  // Ordered and apart, so every mark lies between `first` and `last`.
  const byDay = new Int32Array(daysBetween(first, last) + 1).fill(-1);
  marks.forEach((mark, index) => {
    byDay.fill(index, daysBetween(first, mark.start), daysBetween(first, mark.end) + 1);
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
 * Whether a record owned by `rmId` counts in the scope. A record counts for its RM and for that
 * RM's current team (G2 E).
 */
export function inScope(people: readonly Person[], rmId: string, scope: Scope): boolean {
  return scopeMatcher(people, scope)(rmId);
}

/**
 * The figures that add up, record by record and RM by RM; Tổng số HĐ, Doanh số and the two rates
 * come from them (`totals`), so a total row takes its rates from its sums.
 */
type Tally = {
  -readonly [
    K in
      | 'submittedCount'
      | 'caseSize'
      | 'issuedCount'
      | 'issuedFyp'
      | 'cancelledCount'
      | 'cancelledFyp'
      | 'rfCount'
  ]: number;
};

const noTally = (): Tally => ({
  submittedCount: 0,
  caseSize: 0,
  issuedCount: 0,
  issuedFyp: 0,
  cancelledCount: 0,
  cancelledFyp: 0,
  rfCount: 0,
});

/** Adds `part` into `total`: counts as they are, money by `addMoney`. */
function addTally(total: Tally, part: Readonly<Tally>): void {
  total.submittedCount += part.submittedCount;
  total.caseSize = addMoney(total.caseSize, part.caseSize);
  total.issuedCount += part.issuedCount;
  total.issuedFyp = addMoney(total.issuedFyp, part.issuedFyp);
  total.cancelledCount += part.cancelledCount;
  total.cancelledFyp = addMoney(total.cancelledFyp, part.cancelledFyp);
  total.rfCount += part.rfCount;
}

/**
 * Adds one policy to the tally of each of its days: submitted, issued, cancelled. `tallyOf` gives
 * the tally a day counts in, or undefined when it counts nowhere. The FYP cancelled is the one
 * issued, the FYP submitted when it has none of its own; only an issued policy has one.
 */
function tallyPolicy(policy: Policy, tallyOf: (date: CalendarDate) => Tally | undefined): void {
  const submitted = tallyOf(policy.submittedDate);
  if (submitted) {
    submitted.submittedCount += 1;
    submitted.caseSize = addMoney(submitted.caseSize, policy.submittedFyp);
  }
  if (policy.issuedDate === null) return;
  const fyp = policy.issuedFyp ?? policy.submittedFyp;
  const issued = tallyOf(policy.issuedDate);
  if (issued) {
    issued.issuedCount += 1;
    issued.issuedFyp = addMoney(issued.issuedFyp, fyp);
  }
  const cancelled = policy.cancelledDate && tallyOf(policy.cancelledDate);
  if (cancelled) {
    cancelled.cancelledCount += 1;
    cancelled.cancelledFyp = addMoney(cancelled.cancelledFyp, fyp);
  }
}

const policyTotals = (tally: Readonly<Tally>): PolicyMetrics => ({
  submittedCount: tally.submittedCount,
  caseSize: tally.caseSize,
  issuedCount: tally.issuedCount,
  cancelledCount: tally.cancelledCount,
  netCount: tally.issuedCount - tally.cancelledCount,
  issuedFyp: tally.issuedFyp,
  cancelledFyp: tally.cancelledFyp,
  revenue: addMoney(tally.issuedFyp, -tally.cancelledFyp),
});

export function policyMetrics(
  data: { readonly people: readonly Person[]; readonly policies: readonly Policy[] },
  period: Period,
  scope: Scope,
): PolicyMetrics {
  const matches = scopeMatcher(data.people, scope);
  const tally = noTally();
  const inPeriod = (date: CalendarDate) => (isInPeriod(date, period) ? tally : undefined);
  for (const policy of data.policies) {
    if (matches(policy.rmId)) tallyPolicy(policy, inPeriod);
  }
  return policyTotals(tally);
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

/** Cuộc gặp chuyển RF with the meeting day in the period, for the RM on the appointment (G2 C). */
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
      matches(appointment.rmId) && isInPeriod(appointment.date, period) && isRf(appointment),
  ).length;
}

/** An exact fraction; it may exceed 1. */
export interface Rate {
  readonly numerator: number;
  readonly denominator: number;
}

/** Tỷ lệ chốt; above 1 when more policies are issued than RF in the period. */
export type CloseRate = Rate;

/** Tỷ lệ hủy; above 1 when more policies are cancelled than issued in the period. */
export type CancelRate = Rate;

/** Tỷ lệ chốt = issued ÷ RF in the same period (G2 F); null — shown "—" — when there is no RF. */
export function closeRate(issuedCount: number, rfCount: number): CloseRate | null {
  return rfCount === 0 ? null : { numerator: issuedCount, denominator: rfCount };
}

/**
 * Tỷ lệ hủy = cancelled ÷ issued in the same period, cancelled ones included in the issued
 * (golden B); null — shown "—" — when no policy was issued.
 */
export function cancelRate(cancelledCount: number, issuedCount: number): CancelRate | null {
  return issuedCount === 0 ? null : { numerator: cancelledCount, denominator: issuedCount };
}

/**
 * A rate in percent, unrounded: the KPI shows it, its delta is the difference in points.
 * Multiplied before it is divided, so a rate at half a tenth is exact and rounds up: 23 ÷ 80 is
 * 28.75, not 28.749999999999996.
 */
export function closeRatePercent({ numerator, denominator }: Rate): number {
  return (numerator * 100) / denominator;
}

export interface PeriodMetrics extends PolicyMetrics {
  readonly rfCount: number;
  readonly closeRate: CloseRate | null;
  readonly cancelRate: CancelRate | null;
}

const totals = (tally: Readonly<Tally>): PeriodMetrics => ({
  ...policyTotals(tally),
  rfCount: tally.rfCount,
  closeRate: closeRate(tally.issuedCount, tally.rfCount),
  cancelRate: cancelRate(tally.cancelledCount, tally.issuedCount),
});

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
  return {
    ...policies,
    rfCount: rf,
    closeRate: closeRate(policies.issuedCount, rf),
    cancelRate: cancelRate(policies.cancelledCount, policies.issuedCount),
  };
}

/**
 * The total row of several rows of one period (Tổng of So sánh team and Báo cáo): counts and money
 * add up, and each rate comes from the sums, Σ issued ÷ Σ RF and Σ cancelled ÷ Σ issued, never a
 * mean of the rows' rates (golden G10 + G11 = G09; G30, G31).
 */
export function sumMetrics(rows: readonly PeriodMetrics[]): PeriodMetrics {
  const total = noTally();
  for (const row of rows) addTally(total, row);
  return totals(total);
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
  const parts = marks.map(noTally);
  const partOf = (date: CalendarDate) => parts[markOf(date)];
  for (const policy of data.policies) {
    if (matches(policy.rmId)) tallyPolicy(policy, partOf);
  }
  for (const appointment of data.appointments) {
    if (!matches(appointment.rmId) || !isRf(appointment)) continue;
    const part = partOf(appointment.date);
    if (part) part.rfCount += 1;
  }
  return parts.map(totals);
}

/**
 * `periodMetrics` of one period for any scope, after one pass over the records (So sánh team and
 * Báo cáo read every team and RM, DR-20): each policy and appointment is added to its RM, then a
 * scope adds up the RM it holds. Equal, scope by scope, to calling `periodMetrics`.
 */
export function periodMetricsByScope(
  data: MetricsData,
  period: Period,
): (scope: Scope) => PeriodMetrics {
  const isRf = rfMatcher(data.transitions);
  const byRm = new Map<string, Tally>();
  const partOf = (rmId: string) => {
    const part = byRm.get(rmId) ?? noTally();
    byRm.set(rmId, part);
    return part;
  };
  for (const policy of data.policies) {
    tallyPolicy(policy, (date) => (isInPeriod(date, period) ? partOf(policy.rmId) : undefined));
  }
  for (const appointment of data.appointments) {
    if (isInPeriod(appointment.date, period) && isRf(appointment)) {
      partOf(appointment.rmId).rfCount += 1;
    }
  }
  return (scope) => {
    const matches = scopeMatcher(data.people, scope);
    const total = noTally();
    for (const [rmId, part] of byRm) {
      if (matches(rmId)) addTally(total, part);
    }
    return totals(total);
  };
}
