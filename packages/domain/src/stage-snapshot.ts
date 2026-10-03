/**
 * Customers by stage as a snapshot at the end of a period (Phase 4 G2 §2, golden
 * `docs/golden/kh-theo-nhom.md`), shared by the Tổng quan boxes and chart and the Báo cáo columns.
 */
import { sortedByDate, stageAtEndOf } from './customer-lifecycle';
import type { Customer, CustomerStage, Person, Scope, StageTransition } from './model';
import { compareDates } from './period';
import type { CalendarDate, Period } from './period';
import { scopeMatcher } from './stats';

/**
 * The day the snapshot is taken (mốc): the last day of the period, or today while the period
 * runs. Null when the whole period is after today, so it has no numbers yet ("—").
 */
export function snapshotDate(period: Period, today: CalendarDate): CalendarDate | null {
  if (compareDates(today, period.start) < 0) return null;
  return compareDates(today, period.end) < 0 ? today : period.end;
}

/** Customers in each of the six stages; Tổng quan shows N4–N1, Báo cáo all six. */
export type StageCounts = Readonly<Record<CustomerStage, number>>;

/**
 * Customers of the scope by their stage at the end of `date` (§2). Each customer counts once; one
 * with no transition up to `date` (created later) does not count. The scope follows the customer's
 * current RE, so a change of RE moves every past period too (v1 keeps no RE history, G2 E).
 *
 * `customers` must be the live ones only, as the repository lists them: a deleted customer is left
 * out by the caller, never passed here.
 */
export function stageSnapshot(
  customers: readonly Customer[],
  transitions: readonly StageTransition[],
  date: CalendarDate,
  scope: Scope,
  people: readonly Person[],
): StageCounts {
  return stageSnapshotter(customers, transitions, people)(date, scope);
}

/**
 * `stageSnapshot` for many days or scopes over the same data (chart columns, Theo mốc rows, one
 * row per team or RE): each customer's transitions are grouped and sorted once, then every call
 * only looks up the stage at its day.
 */
export function stageSnapshotter(
  customers: readonly Customer[],
  transitions: readonly StageTransition[],
  people: readonly Person[],
): (date: CalendarDate, scope: Scope) => StageCounts {
  const grouped = new Map<string, StageTransition[]>();
  for (const transition of transitions) {
    const list = grouped.get(transition.customerId);
    if (list) list.push(transition);
    else grouped.set(transition.customerId, [transition]);
  }
  const histories = customers.map((customer) => ({
    reId: customer.reId,
    sorted: sortedByDate(grouped.get(customer.id) ?? []),
  }));
  return (date, scope) => {
    const matches = scopeMatcher(people, scope);
    const counts = { N4: 0, N3: 0, N2: 0, N1: 0, ON_HOLD: 0, LOST: 0 };
    for (const { reId, sorted } of histories) {
      if (!matches(reId)) continue;
      const stage = stageAtEndOf(sorted, date);
      if (stage !== null) counts[stage] += 1;
    }
    return counts;
  };
}
