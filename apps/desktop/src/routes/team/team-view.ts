import {
  addDays,
  customPeriod,
  isInPeriod,
  isPipelineStage,
  periodOf,
  type Appointment,
  type CalendarDate,
  type Customer,
  type Period,
  type Person,
  type Policy,
  type Team,
} from '@p2c/domain';

export interface TeamEntry {
  readonly team: Team;
  /** The team's TL (one per team); the first by name if old data has several. */
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

/** The live records the member columns and the delete check are counted from. */
export interface StaffRecords {
  readonly customers: ReadonlyArray<Pick<Customer, 'reId' | 'stage'>>;
  readonly appointments: ReadonlyArray<Pick<Appointment, 'reId' | 'coordinatorIds' | 'date'>>;
  readonly policies: ReadonlyArray<Pick<Policy, 'reId' | 'issuedDate'>>;
}

/** Member columns (mockup team.html); null where the role has no metrics (only RE do, G2 G). */
export interface StaffMetrics {
  /** Customers in charge still in N4–N1. */
  readonly openCustomers: number | null;
  /** Appointments as RE or coordinator, dated in the 30 days up to today (Owner, 28/09/2026). */
  readonly appointments30: number;
  /** Policies issued in the current calendar year (Owner, 28/09/2026). */
  readonly issuedThisYear: number | null;
}

/** The 30 days ending today, today included. */
function last30Days(today: CalendarDate): Period {
  return customPeriod(addDays(today, -29), today);
}

/** The records a person is the RE of. */
function ownedBy<T extends { readonly reId: string }>(list: readonly T[], personId: string) {
  return list.filter((record) => record.reId === personId);
}

export function staffMetrics(
  people: readonly Person[],
  records: StaffRecords,
  today: CalendarDate,
): Map<string, StaffMetrics> {
  const recent = last30Days(today);
  const year = periodOf('year', today);
  return new Map(
    people.map((person) => {
      const isRe = person.role === 'RE';
      const appointments30 = records.appointments.filter(
        (a) =>
          (a.reId === person.id || a.coordinatorIds.includes(person.id)) &&
          isInPeriod(a.date, recent),
      ).length;
      const metrics: StaffMetrics = {
        openCustomers: isRe
          ? ownedBy(records.customers, person.id).filter((c) => isPipelineStage(c.stage)).length
          : null,
        appointments30,
        issuedThisYear: isRe
          ? ownedBy(records.policies, person.id).filter(
              (p) => p.issuedDate && isInPeriod(p.issuedDate, year),
            ).length
          : null,
      };
      return [person.id, metrics];
    }),
  );
}

/** What still points to a person and blocks deleting them (mockup 9b). */
export interface PersonUsage {
  readonly customers: number;
  readonly appointments: number;
  readonly policies: number;
  readonly coordinating: number;
}

export function personUsage(personId: string, records: StaffRecords): PersonUsage {
  const count = (list: ReadonlyArray<{ readonly reId: string }>) => ownedBy(list, personId).length;
  return {
    customers: count(records.customers),
    appointments: count(records.appointments),
    policies: count(records.policies),
    coordinating: records.appointments.filter((a) => a.coordinatorIds.includes(personId)).length,
  };
}
