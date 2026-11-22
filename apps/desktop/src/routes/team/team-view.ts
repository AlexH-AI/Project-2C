import { DbError, ownsRecords, type AppointmentRecord, type PersonUsage } from '@p2c/db';
import {
  addDays,
  customPeriod,
  isInPeriod,
  isPipelineStage,
  isRm,
  periodOf,
  type CalendarDate,
  type Customer,
  type Period,
  type Person,
  type Policy,
  type Team,
} from '@p2c/domain';
import { t } from '../../i18n';

export interface TeamEntry {
  readonly team: Team;
  /** The team's TL (one per team, spec §6 rule 9). */
  readonly lead: Person | undefined;
  /** Only the RM, in the order given (the repository sorts by name). */
  readonly reps: readonly Person[];
  readonly tl: number;
  readonly rm: number;
}

export interface TeamView {
  readonly teams: readonly TeamEntry[];
  /** People without a team: the IS / BD / BDM shared by every team (D8). */
  readonly shared: readonly Person[];
}

/** Teams with their members, and the shared support staff (mockup team.html). */
export function groupByTeam(teams: readonly Team[], people: readonly Person[]): TeamView {
  return {
    teams: teams.map((team) => {
      const members = people.filter((person) => person.teamId === team.id);
      const leads = members.filter((p) => p.role === 'TL');
      const reps = members.filter(isRm);
      return { team, lead: leads[0], reps, tl: leads.length, rm: reps.length };
    }),
    shared: people.filter((person) => person.teamId === null),
  };
}

/** The live records the member columns are counted from. */
export interface StaffRecords {
  readonly customers: ReadonlyArray<Pick<Customer, 'rmId' | 'stage'>>;
  readonly appointments: ReadonlyArray<Pick<AppointmentRecord, 'rmId' | 'date'>>;
  readonly policies: ReadonlyArray<Pick<Policy, 'rmId' | 'issuedDate'>>;
}

/** Member columns of an RM (mockup team.html); the table lists only RM (B1, 01/10/2026). */
export interface StaffMetrics {
  /** Customers in charge still in N4–N1. */
  readonly openCustomers: number;
  /**
   * Appointments as RM dated in the 30 days up to today (Owner, 28/09/2026); an RM never
   * coordinates one (ADR-0007).
   */
  readonly appointments30: number;
  /** Policies issued in the current calendar year (Owner, 28/09/2026). */
  readonly issuedThisYear: number;
}

/** The 30 days ending today, today included. */
function last30Days(today: CalendarDate): Period {
  return customPeriod(addDays(today, -29), today);
}

type Counts = { -readonly [K in keyof StaffMetrics]: StaffMetrics[K] };

/**
 * The member columns of each RM among `people`; other roles have none (G2 G). Each list is read
 * once, each record counted to its RM (T-502): filtering every list again for each RM grew with
 * RM × records, ≈ 0.3 s on Windows and ≈ 2 s on a Mac at 10× the load data.
 */
export function staffMetrics(
  people: readonly Person[],
  records: StaffRecords,
  today: CalendarDate,
): Map<string, StaffMetrics> {
  const recent = last30Days(today);
  const year = periodOf('year', today);
  const counts = new Map<string, Counts>(
    people
      .filter(isRm)
      .map((person) => [person.id, { openCustomers: 0, appointments30: 0, issuedThisYear: 0 }]),
  );
  for (const customer of records.customers) {
    const rm = counts.get(customer.rmId);
    if (rm && isPipelineStage(customer.stage)) rm.openCustomers++;
  }
  for (const appointment of records.appointments) {
    const rm = counts.get(appointment.rmId);
    if (rm && isInPeriod(appointment.date, recent)) rm.appointments30++;
  }
  for (const policy of records.policies) {
    const rm = counts.get(policy.rmId);
    if (rm && policy.issuedDate && isInPeriod(policy.issuedDate, year)) rm.issuedThisYear++;
  }
  return counts;
}

/** At most this many customers of the trash are named in mockup 9b; the others are counted. */
const NAMED_IN_TRASH = 3;

/**
 * How a person gets out of what keeps them (mockup 9b): one sentence for their role — the RM's
 * whenever they own records, as the mockup shows for an RM who also coordinates (review of PR 636) —
 * then, when some of it belongs to customers in the trash, which ones (T-250): a purge of the trash
 * deletes it for good, while restoring them hands over or edits only part of it (DR6-115).
 */
export function inUseHelp(usage: PersonUsage, shown = (name: string) => name): string[] {
  const owns = ownsRecords(usage);
  const reviews = usage.reviewing > 0;
  const coordinates = usage.coordinating > 0;
  const role = owns
    ? t('person.inUseHelp')
    : reviews && coordinates
      ? t('person.inUseSupportHelp')
      : reviews
        ? t('person.inUseReviewerHelp')
        : coordinates
          ? t('person.inUseCoordinatorHelp')
          : null;
  // A name two customers of the trash share comes with each one's code (review of PR 669), as
  // `shown`: two names alike once masked too (VA6b).
  const names = usage.inTrash.map(({ name }) => shown(name));
  const named = names
    .slice(0, NAMED_IN_TRASH)
    .map((name, i) =>
      names.indexOf(name) === names.lastIndexOf(name)
        ? name
        : t('customer.withCode', { name, code: usage.inTrash[i]!.code }),
    )
    .join(t('sep.list'));
  const others = usage.inTrash.length - NAMED_IN_TRASH;
  const customer =
    others > 0 ? t('person.inUseTrashMore', { customer: named, count: others }) : named;
  const sentence = t(owns ? 'person.inUseTrash' : 'person.inUseSupportTrash', { customer });
  // A masked name ends the list with its own full stop: the sentence's goes.
  const trash =
    usage.inTrash.length === 0
      ? null
      : customer.endsWith('.')
        ? sentence.replace(`${customer}.`, customer)
        : sentence;
  return [role, trash].filter((line) => line !== null);
}

/**
 * Whether the delete dialogs of a team or person leave Xóa on after a refusal: only the write lock
 * of a data replace (spec Phase 6 S2-2) says to try again; the data refusing it stays as it is.
 */
export function retriesDelete(failure: unknown): boolean {
  return failure instanceof DbError && failure.code === 'DATA_REPLACING';
}
