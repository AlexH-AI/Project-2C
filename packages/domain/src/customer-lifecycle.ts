/**
 * Customer lifecycle (ADR-0007, T-027): which stage changes are allowed, which count as an RF, the
 * customer's stage on a given day, and the "Đã có HĐ" badge.
 */
import { CLOSED_STAGES } from './model';
import type { ClosedStage, CustomerStage, Policy, StageTransition } from './model';
import { compareDates } from './period';
import type { CalendarDate } from './period';

const isClosed = (stage: CustomerStage): stage is ClosedStage =>
  (CLOSED_STAGES as readonly string[]).includes(stage);

/**
 * Throws unless `from → to` is allowed. `from` is null when the customer is created, in an open
 * stage. Open stages move freely up or down; any open stage may close as ON_HOLD or LOST, the two
 * closed stages move into each other, and a closed customer reopens only to N3 (G2).
 */
export function assertValidTransition(from: CustomerStage | null, to: CustomerStage): void {
  if (from === to) throw new Error(`Customer is already in ${to}`);
  if (from === null) {
    if (isClosed(to)) throw new Error(`A customer cannot be created in ${to}`);
    return;
  }
  if (isClosed(from) && !isClosed(to) && to !== 'N3') {
    throw new Error(`A customer in ${from} reopens to N3, not ${to}`);
  }
}

/**
 * Whether the stage change is an RF move: from N4/N3 up to N2/N1 (G2 B). Reopening to N3 never is.
 * Whether it happened at a `MET` appointment is for the stats engine to check.
 */
export function isRfTransition(from: CustomerStage | null, to: CustomerStage): boolean {
  return (from === 'N4' || from === 'N3') && (to === 'N2' || to === 'N1');
}

/**
 * The customer's stage at the end of `date`, or null before their first transition. Transitions on
 * the same day count in the order they were recorded (their order in `transitions`).
 */
export function stageOn(
  transitions: readonly StageTransition[],
  customerId: string,
  date: CalendarDate,
): CustomerStage | null {
  return stageAtEndOf(sortedByDate(transitions.filter((t) => t.customerId === customerId)), date);
}

/**
 * One customer's transitions by day; a stable sort, so transitions of the same day keep the order
 * they were recorded in. Shared with `stage-snapshot.ts`, which sorts each customer once.
 */
export function sortedByDate(transitions: readonly StageTransition[]): StageTransition[] {
  return [...transitions].sort((a, b) => compareDates(a.date, b.date));
}

/** The stage at the end of `date` from one customer's transitions sorted by `sortedByDate`. */
export function stageAtEndOf(
  sorted: readonly StageTransition[],
  date: CalendarDate,
): CustomerStage | null {
  return sorted.findLast((t) => compareDates(t.date, date) <= 0)?.to ?? null;
}

/** The "Đã có HĐ" badge: the number of the customer's submitted policies, or null when none. */
export function policyBadge(
  policies: readonly Policy[],
  customerId: string,
): { readonly count: number } | null {
  const count = policies.filter((policy) => policy.customerId === customerId).length;
  return count === 0 ? null : { count };
}
