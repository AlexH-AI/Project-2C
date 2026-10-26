import { DbError, ownsRecords, type AppointmentRecord, type PersonUsage } from '@p2c/db';
import {
  addDays,
  customPeriod,
  isInPeriod,
  isPipelineStage,
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
  /** Only the RE, in the order given (the repository sorts by name). */
  readonly reps: readonly Person[];
  readonly tl: number;
  readonly re: number;
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
      const reps = members.filter((p) => p.role === 'RE');
      return { team, lead: leads[0], reps, tl: leads.length, re: reps.length };
    }),
    shared: people.filter((person) => person.teamId === null),
  };
}

/** The live records the member columns are counted from. */
export interface StaffRecords {
  readonly customers: ReadonlyArray<Pick<Customer, 'reId' | 'stage'>>;
  readonly appointments: ReadonlyArray<Pick<AppointmentRecord, 'reId' | 'date'>>;
  readonly policies: ReadonlyArray<Pick<Policy, 'reId' | 'issuedDate'>>;
}

/** Member columns of an RE (mockup team.html); the table lists only RE (B1, 01/10/2026). */
export interface StaffMetrics {
  /** Customers in charge still in N4–N1. */
  readonly openCustomers: number;
  /**
   * Appointments as RE dated in the 30 days up to today (Owner, 28/09/2026); an RE never
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

/** The records a person is the RE of. */
function ownedBy<T extends { readonly reId: string }>(list: readonly T[], personId: string) {
  return list.filter((record) => record.reId === personId);
}

/** The member columns of each RE among `people`; other roles have none (G2 G). */
export function staffMetrics(
  people: readonly Person[],
  records: StaffRecords,
  today: CalendarDate,
): Map<string, StaffMetrics> {
  const recent = last30Days(today);
  const year = periodOf('year', today);
  return new Map(
    people
      .filter((person) => person.role === 'RE')
      .map((person) => {
        const metrics: StaffMetrics = {
          openCustomers: ownedBy(records.customers, person.id).filter((c) =>
            isPipelineStage(c.stage),
          ).length,
          appointments30: ownedBy(records.appointments, person.id).filter((a) =>
            isInPeriod(a.date, recent),
          ).length,
          issuedThisYear: ownedBy(records.policies, person.id).filter(
            (p) => p.issuedDate && isInPeriod(p.issuedDate, year),
          ).length,
        };
        return [person.id, metrics];
      }),
  );
}

/** At most this many customers of the trash are named in mockup 9b; the others are counted. */
const NAMED_IN_TRASH = 3;

/**
 * How a person gets out of what keeps them (mockup 9b): one sentence for their role — the RE's
 * whenever they own records, as the mockup shows for an RE who also coordinates (review of PR 636) —
 * then, when some of it belongs to customers in the trash, which ones (T-250): a purge of the trash
 * deletes it for good, while restoring them hands over or edits only part of it (DR6-115).
 */
export function inUseHelp(usage: PersonUsage): string[] {
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
  // A name two customers of the trash share comes with each one's code (review of PR 669).
  const names = usage.inTrash.map(({ name }) => name);
  const named = usage.inTrash
    .slice(0, NAMED_IN_TRASH)
    .map(({ name, code }) =>
      names.indexOf(name) === names.lastIndexOf(name)
        ? name
        : t('person.inUseTrashCoded', { name, code }),
    )
    .join(t('sep.list'));
  const others = usage.inTrash.length - NAMED_IN_TRASH;
  const customer =
    others > 0 ? t('person.inUseTrashMore', { customer: named, count: others }) : named;
  const trash =
    usage.inTrash.length > 0
      ? t(owns ? 'person.inUseTrash' : 'person.inUseSupportTrash', { customer })
      : null;
  return [role, trash].filter((line) => line !== null);
}

/**
 * Whether the delete dialogs of a team or person leave Xóa on after a refusal: only the write lock
 * of a data replace (spec Phase 6 S2-2) says to try again; the data refusing it stays as it is.
 */
export function retriesDelete(failure: unknown): boolean {
  return failure instanceof DbError && failure.code === 'DATA_REPLACING';
}
