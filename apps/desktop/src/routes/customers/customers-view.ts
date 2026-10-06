import type { BirthDate, CustomerRecord } from '@p2c/db';
import {
  CLOSED_STAGES,
  PIPELINE_STAGES,
  assertValidTransition,
  compareDates,
  formatDate,
  formatIsoDate,
  parseQuickDate,
  scopeMatcher,
  type CalendarDate,
  type ClosedStage,
  type CustomerStage,
  type QuickDateError,
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
  /** Open customers per RE id, for the RE strip; an RE with none is not listed. */
  readonly openByRe: ReadonlyMap<string, number>;
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

  const matches = scopeMatcher(data.people, scope);
  const people = new Map(data.people.map((person) => [person.id, person]));

  const cards = data.customers
    .filter((customer) => matches(customer.reId))
    .map((customer) => ({
      customer,
      re: people.get(customer.reId),
      // Every customer has a first transition, written with it (spec §3.4).
      since: since.get(customer.id)!,
      policies: policies.get(customer.id) ?? 0,
    }))
    .sort((a, b) => compareDates(b.since, a.since) || byName(a.customer.name, b.customer.name));
  const closed = byStage(CLOSED_STAGES, cards);
  const closedCount = CLOSED_STAGES.reduce((sum, s) => sum + closed[s].length, 0);
  const open = byStage(PIPELINE_STAGES, cards);
  const openByRe = new Map<string, number>();
  for (const { customer } of PIPELINE_STAGES.flatMap((s) => open[s])) {
    openByRe.set(customer.reId, (openByRe.get(customer.reId) ?? 0) + 1);
  }
  return { open, closed, openCount: cards.length - closedCount, closedCount, openByRe };
}

function byStage<S extends CustomerRecord['stage']>(
  stages: readonly S[],
  cards: readonly CustomerCard[],
): Record<S, CustomerCard[]> {
  const columns = {} as Record<S, CustomerCard[]>;
  for (const stage of stages) columns[stage] = cards.filter((c) => c.customer.stage === stage);
  return columns;
}

export type RecordDateResult =
  | { readonly ok: true; readonly date: CalendarDate }
  | { readonly ok: false; readonly error: QuickDateError | 'future' };

/**
 * Reads a quick date for something that already happened: today or earlier. A later day would
 * become the latest transition and block every stage change dated before it.
 */
export function parseRecordDate(text: string, today: CalendarDate): RecordDateResult {
  const parsed = parseQuickDate(text, today);
  if (!parsed.ok) return parsed;
  return compareDates(parsed.date, today) > 0
    ? { ok: false, error: 'future' }
    : { ok: true, date: parsed.date };
}

export type BirthDateResult =
  | { readonly ok: true; readonly birth: BirthDate | null }
  | { readonly ok: false; readonly error: QuickDateError | 'future' };

/**
 * Reads a birth date typed as a year (`1984`) or a full `dd/mm/yyyy`; empty means none (a N4
 * customer may be unknown). A year must be written in full: `12/3/84` or `12/3` is a format error.
 */
export function parseBirthDate(text: string, today: CalendarDate): BirthDateResult {
  const trimmed = text.trim();
  if (trimmed === '') return { ok: true, birth: null };
  const year = /^\d{4}$/.test(trimmed) ? Number(trimmed) : null;
  const parsed = parseQuickDate(year === null ? trimmed : `1/1/${year}`, today);
  if (!parsed.ok) return parsed;
  if (parsed.yearInferred) return { ok: false, error: 'format' };
  const birth = year === null ? parsed.date : { year };
  const tooLate = year === null ? compareDates(parsed.date, today) > 0 : year > today.year;
  return tooLate ? { ok: false, error: 'future' } : { ok: true, birth };
}

/** Stages a manual change may move the customer to (ADR-0007: closed reopens only to N3). */
export function allowedStages(current: CustomerStage): CustomerStage[] {
  return [...PIPELINE_STAGES, ...CLOSED_STAGES].filter((stage) => {
    try {
      assertValidTransition(current, stage);
      return true;
    } catch {
      return false;
    }
  });
}

/** "1984" when only the year is known, else "12/03/1984". */
export function birthLabel(birth: BirthDate): string {
  return 'month' in birth ? formatDate(birth) : String(birth.year);
}

/**
 * What the "Ngày sinh" column sorts by: "1984" or "1984-03-12", so the days of birth come in
 * order and a year alone goes ahead of the full dates in it.
 */
export function birthSortKey(birth: BirthDate): string {
  return 'month' in birth ? formatIsoDate(birth) : String(birth.year);
}

/** Full years on `today`; from a year alone, the age reached during `today`'s year. */
export function ageOn(birth: BirthDate, today: CalendarDate): number {
  const age = today.year - birth.year;
  if (!('month' in birth)) return age;
  const hadBirthday = compareDates({ ...birth, year: today.year }, today) <= 0;
  return hadBirthday ? age : age - 1;
}
