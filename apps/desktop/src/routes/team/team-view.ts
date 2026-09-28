import {
  fromLocalDate,
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
  /** In the order given (the repository sorts by name). */
  readonly members: readonly Person[];
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
      const count = (role: Person['role']) => members.filter((p) => p.role === role).length;
      return { team, members, tl: count('TL'), re: count('RE') };
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
  // `Date` rolls day −29 over into the previous month or year; the domain has no day arithmetic.
  const start = fromLocalDate(new Date(today.year, today.month - 1, today.day - 29));
  return { kind: 'custom', start, end: today };
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
      const own = <T extends { readonly reId: string }>(list: readonly T[]) =>
        list.filter((record) => record.reId === person.id);
      const appointments30 = records.appointments.filter(
        (a) =>
          (a.reId === person.id || a.coordinatorIds.includes(person.id)) &&
          isInPeriod(a.date, recent),
      ).length;
      const metrics: StaffMetrics = {
        openCustomers: isRe
          ? own(records.customers).filter((c) => isPipelineStage(c.stage)).length
          : null,
        appointments30,
        issuedThisYear: isRe
          ? own(records.policies).filter((p) => p.issuedDate && isInPeriod(p.issuedDate, year))
              .length
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
  const count = (list: ReadonlyArray<{ readonly reId: string }>) =>
    list.filter((record) => record.reId === personId).length;
  return {
    customers: count(records.customers),
    appointments: count(records.appointments),
    policies: count(records.policies),
    coordinating: records.appointments.filter((a) => a.coordinatorIds.includes(personId)).length,
  };
}

/** Avatar letters: family name and given name, "Nguyễn Thu Hà" → "NH". */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  const first = words[0]?.charAt(0) ?? '';
  const last = words.length > 1 ? (words.at(-1)?.charAt(0) ?? '') : '';
  return (first + last).toLocaleUpperCase('vi');
}
