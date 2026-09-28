import type { BirthDate, CustomerRecord } from '@p2c/db';
import {
  CLOSED_STAGES,
  PIPELINE_STAGES,
  compareDates,
  formatDate,
  inScope,
  type CalendarDate,
  type ClosedStage,
  type Person,
  type PipelineStage,
  type Policy,
  type Scope,
  type StageTransition,
} from '@p2c/domain';

export interface CustomerCard {
  readonly customer: CustomerRecord;
  readonly re: Person | undefined;
  /** Day of the latest stage change: the day the customer entered its current stage. */
  readonly since: CalendarDate;
  /** Submitted policies, issued or not ("Đã có HĐ"). */
  readonly policies: number;
}

export interface CustomerBoard {
  /** Kanban columns N4 → N1, the latest change first. */
  readonly open: Readonly<Record<PipelineStage, readonly CustomerCard[]>>;
  /** Tạm hoãn / Mất cơ hội, the latest change first. */
  readonly closed: Readonly<Record<ClosedStage, readonly CustomerCard[]>>;
  readonly openCount: number;
  readonly closedCount: number;
}

export interface CustomerData {
  readonly customers: readonly CustomerRecord[];
  readonly people: readonly Person[];
  /** In recording order, as the repository returns them. */
  readonly transitions: readonly StageTransition[];
  readonly policies: readonly Policy[];
}

const byName = new Intl.Collator('vi').compare;

/** The customers in scope, by stage (mockup customers.html). */
export function customerBoard(data: CustomerData, scope: Scope): CustomerBoard {
  const since = new Map<string, CalendarDate>();
  for (const transition of data.transitions) since.set(transition.customerId, transition.date);
  const policies = new Map<string, number>();
  for (const policy of data.policies) {
    policies.set(policy.customerId, (policies.get(policy.customerId) ?? 0) + 1);
  }

  const cards = data.customers
    .filter((customer) => inScope(data.people, customer.reId, scope))
    .map((customer) => ({
      customer,
      re: data.people.find((person) => person.id === customer.reId),
      // Every customer has a first transition, written with it (spec §3.4).
      since: since.get(customer.id)!,
      policies: policies.get(customer.id) ?? 0,
    }))
    .sort((a, b) => compareDates(b.since, a.since) || byName(a.customer.name, b.customer.name));
  const closed = byStage(CLOSED_STAGES, cards);
  const closedCount = CLOSED_STAGES.reduce((sum, s) => sum + closed[s].length, 0);
  return {
    open: byStage(PIPELINE_STAGES, cards),
    closed,
    openCount: cards.length - closedCount,
    closedCount,
  };
}

function byStage<S extends CustomerRecord['stage']>(
  stages: readonly S[],
  cards: readonly CustomerCard[],
): Record<S, CustomerCard[]> {
  const columns = {} as Record<S, CustomerCard[]>;
  for (const stage of stages) columns[stage] = cards.filter((c) => c.customer.stage === stage);
  return columns;
}

/** "1984" when only the year is known, else "12/03/1984". */
export function birthLabel(birth: BirthDate): string {
  return 'month' in birth ? formatDate(birth) : String(birth.year);
}

/** Full years on `today`; from a year alone, the age reached during `today`'s year. */
export function ageOn(birth: BirthDate, today: CalendarDate): number {
  const age = today.year - birth.year;
  if (!('month' in birth)) return age;
  const hadBirthday = compareDates({ ...birth, year: today.year }, today) <= 0;
  return hadBirthday ? age : age - 1;
}
