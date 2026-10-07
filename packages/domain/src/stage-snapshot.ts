/**
 * Customers by stage as a snapshot at the end of a period (Phase 4 G2 §2, golden
 * `docs/golden/kh-theo-nhom.md`), shared by the Tổng quan boxes and chart and the Báo cáo columns.
 */
import { sortedByDate, stageAtEndOf } from './customer-lifecycle';
import type { Customer, CustomerStage, Person, Scope, StageTransition } from './model';
import { compareDates, formatDate } from './period';
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
 *
 * The definition of one day, read by the golden tests: the screens count with
 * `stageSnapshotSeries` and `stageSnapshotByScope`, which are tested equal to it.
 */
export function stageSnapshot(
  customers: readonly Customer[],
  transitions: readonly StageTransition[],
  date: CalendarDate,
  scope: Scope,
  people: readonly Person[],
): StageCounts {
  const matches = scopeMatcher(people, scope);
  const counts = noCustomers();
  for (const { reId, sorted } of customerHistories(customers, transitions)) {
    if (!matches(reId)) continue;
    const stage = stageAtEndOf(sorted, date);
    if (stage !== null) counts[stage] += 1;
  }
  return counts;
}

const noCustomers = (): Record<CustomerStage, number> => ({
  N4: 0,
  N3: 0,
  N2: 0,
  N1: 0,
  ON_HOLD: 0,
  LOST: 0,
});

/** Each customer with its RE and its transitions by day, grouped and sorted once. */
function customerHistories(
  customers: readonly Customer[],
  transitions: readonly StageTransition[],
): { readonly reId: string; readonly sorted: readonly StageTransition[] }[] {
  const grouped = new Map<string, StageTransition[]>();
  for (const transition of transitions) {
    const list = grouped.get(transition.customerId);
    if (list) list.push(transition);
    else grouped.set(transition.customerId, [transition]);
  }
  return customers.map((customer) => ({
    reId: customer.reId,
    sorted: sortedByDate(grouped.get(customer.id) ?? []),
  }));
}

/**
 * `stageSnapshot` of one day for any scope, after one pass over the customers (Báo cáo takes every
 * team and RE, DR-20): each customer is counted for its RE, then a scope adds up the RE it holds.
 * Equal, scope by scope, to calling `stageSnapshot`.
 */
export function stageSnapshotByScope(
  customers: readonly Customer[],
  transitions: readonly StageTransition[],
  people: readonly Person[],
  date: CalendarDate,
): (scope: Scope) => StageCounts {
  const byRe = new Map<string, Record<CustomerStage, number>>();
  for (const { reId, sorted } of customerHistories(customers, transitions)) {
    const stage = stageAtEndOf(sorted, date);
    if (stage === null) continue;
    const counts = byRe.get(reId) ?? noCustomers();
    byRe.set(reId, counts);
    counts[stage] += 1;
  }
  return (scope) => {
    const matches = scopeMatcher(people, scope);
    const total = noCustomers();
    for (const [reId, counts] of byRe) {
      if (!matches(reId)) continue;
      for (const stage of STAGES) total[stage] += counts[stage];
    }
    return total;
  };
}

const STAGES = ['N4', 'N3', 'N2', 'N1', 'ON_HOLD', 'LOST'] as const satisfies CustomerStage[];

/** The index of the first of `dates` (earliest first) on or after `date`; their length if none. */
function firstOnOrAfter(dates: readonly CalendarDate[], date: CalendarDate): number {
  let low = 0;
  let high = dates.length;
  while (low < high) {
    const middle = (low + high) >> 1;
    if (compareDates(dates[middle]!, date) < 0) low = middle + 1;
    else high = middle;
  }
  return low;
}

/**
 * `stageSnapshot` for many days at once (chart columns, Theo mốc rows), in one pass over the
 * transitions: a transition holds its stage from its day until the customer's next transition, so
 * it adds the customer to the days in between. Equal, day by day, to the snapshot of each day; the
 * days run earliest first and may repeat.
 */
export function stageSnapshotSeries(
  customers: readonly Customer[],
  transitions: readonly StageTransition[],
  people: readonly Person[],
): (dates: readonly CalendarDate[], scope: Scope) => StageCounts[] {
  const histories = customerHistories(customers, transitions);
  return (dates, scope) => {
    dates.forEach((date, index) => {
      const previous = dates[index - 1];
      if (previous && compareDates(previous, date) > 0) {
        throw new RangeError(`Snapshot day ${formatDate(date)} is out of order`);
      }
    });
    const matches = scopeMatcher(people, scope);
    // How the count of each stage moves from the previous day of `dates` to this one.
    const changes = dates.map(noCustomers);
    for (const { reId, sorted } of histories) {
      if (!matches(reId)) continue;
      sorted.forEach((transition, index) => {
        const next = sorted[index + 1];
        const from = firstOnOrAfter(dates, transition.date);
        const until = next ? firstOnOrAfter(dates, next.date) : dates.length;
        if (from >= until) return;
        changes[from]![transition.to] += 1;
        const after = changes[until];
        if (after) after[transition.to] -= 1;
      });
    }
    let counts: StageCounts = noCustomers();
    return changes.map((change) => {
      const before = counts;
      counts = {
        N4: before.N4 + change.N4,
        N3: before.N3 + change.N3,
        N2: before.N2 + change.N2,
        N1: before.N1 + change.N1,
        ON_HOLD: before.ON_HOLD + change.ON_HOLD,
        LOST: before.LOST + change.LOST,
      };
      return counts;
    });
  };
}
