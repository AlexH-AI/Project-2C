import type { AppointmentRecord, CustomerRecord } from '@p2c/db';
import {
  addDays,
  compareDates,
  formatDayMonth,
  inScope,
  isInPeriod,
  isRfTransition,
  periodOf,
  type AppointmentStatus,
  type CalendarDate,
  type CustomerStage,
  type Period,
  type Person,
  type Scope,
  type StageTransition,
  type Team,
} from '@p2c/domain';
import { t } from '../../i18n';

export interface AppointmentData {
  readonly appointments: readonly AppointmentRecord[];
  readonly customers: readonly CustomerRecord[];
  readonly people: readonly Person[];
  readonly teams: readonly Team[];
  readonly transitions: readonly StageTransition[];
}

/** "Phối hợp": anyone, a given person's id, or appointments without coordinators. */
export type CoordinatorFilter = 'any' | 'none' | (string & {});

/** The "Kết quả" column (mockup appointments.html). */
export type Outcome =
  | {
      readonly kind: 'move';
      readonly from: CustomerStage | null;
      readonly to: CustomerStage;
      readonly rf: boolean;
    }
  | { readonly kind: 'keep'; readonly stage: CustomerStage }
  | { readonly kind: 'rescheduled'; readonly to: CalendarDate }
  | null;

/** The "Kết quả" text: `Tạm hoãn → N3`, `N3 → N2 · RF`, `Giữ N3`, `Dời sang 02/10`; empty when none. */
export function outcomeText(outcome: Outcome): string {
  if (!outcome) return '';
  switch (outcome.kind) {
    case 'move':
      return t(outcome.rf ? 'appointments.moveRf' : 'appointments.move', {
        from: outcome.from ? t(`stage.${outcome.from}`) : '—',
        to: t(`stage.${outcome.to}`),
      });
    case 'keep':
      return t('appointments.keep', { stage: t(`stage.${outcome.stage}`) });
    case 'rescheduled':
      return t('appointments.rescheduledTo', { date: formatDayMonth(outcome.to) });
  }
}

/** A coordinator as the lists show them: role, then name. */
export const personLabel = (person: Person) => `${person.role} ${person.name}`;

export interface AppointmentRow {
  readonly appointment: AppointmentRecord;
  readonly customer: CustomerRecord | undefined;
  readonly re: Person | undefined;
  readonly team: Team | undefined;
  readonly coordinators: readonly Person[];
  readonly outcome: Outcome;
}

export interface DayCell {
  readonly date: CalendarDate;
  readonly inMonth: boolean;
  readonly met: number;
  readonly planned: number;
  /** Rescheduled, cancelled or no show. */
  readonly missed: number;
}

export interface DayGroup {
  readonly team: Team | undefined;
  readonly res: readonly {
    readonly re: Person | undefined;
    readonly rows: readonly AppointmentRow[];
  }[];
}

const byName = new Intl.Collator('vi').compare;

const matchesCoordinator = (a: AppointmentRecord, coordinator: CoordinatorFilter) =>
  coordinator === 'any' ||
  (coordinator === 'none' ? a.coordinatorIds.length === 0 : a.coordinatorIds.includes(coordinator));

/** The appointments of the RE in scope, filtered by coordinator, in the repository's order. */
export function appointmentRows(
  data: AppointmentData,
  scope: Scope,
  coordinator: CoordinatorFilter,
): AppointmentRow[] {
  // Maps, not `find`: every screen visit joins the whole year of appointments (~6000 seeded).
  const people = new Map(data.people.map((p) => [p.id, p]));
  const customers = new Map(data.customers.map((c) => [c.id, c]));
  const teams = new Map(data.teams.map((team) => [team.id, team]));
  const movedBy = new Map(
    data.transitions.flatMap((tr) => (tr.appointmentId ? [[tr.appointmentId, tr] as const] : [])),
  );
  const newDay = new Map(
    data.appointments.flatMap((a) =>
      a.rescheduledFromId ? [[a.rescheduledFromId, a.date] as const] : [],
    ),
  );
  const outcome = (a: AppointmentRecord): Outcome => {
    const tr = movedBy.get(a.id);
    if (tr) return { kind: 'move', from: tr.from, to: tr.to, rf: isRfTransition(tr.from, tr.to) };
    if (a.status === 'MET' && a.stageAfter) return { kind: 'keep', stage: a.stageAfter };
    const to = newDay.get(a.id);
    return to ? { kind: 'rescheduled', to } : null;
  };

  return data.appointments
    .filter((a) => inScope(data.people, a.reId, scope) && matchesCoordinator(a, coordinator))
    .map((a) => {
      const re = people.get(a.reId);
      return {
        appointment: a,
        customer: customers.get(a.customerId),
        re,
        team: re?.teamId ? teams.get(re.teamId) : undefined,
        coordinators: a.coordinatorIds.flatMap((id) => people.get(id) ?? []),
        outcome: outcome(a),
      };
    });
}

/**
 * How the screen shows an appointment just made: the coordinator filter, cleared when it would
 * hide it; whether its RE is outside the scope, which is shared by every screen and so stays.
 */
export function revealCreated(
  created: AppointmentRecord,
  people: readonly Person[],
  scope: Scope,
  coordinator: CoordinatorFilter,
): { readonly coordinator: CoordinatorFilter; readonly outsideScope: boolean } {
  return {
    coordinator: matchesCoordinator(created, coordinator) ? coordinator : 'any',
    outsideScope: !inScope(people, created.reId, scope),
  };
}

/** The calendar dot of each status; a new status must pick one. */
const CALENDAR_GROUP: Record<AppointmentStatus, 'met' | 'planned' | 'missed'> = {
  MET: 'met',
  SCHEDULED: 'planned',
  RESCHEDULED: 'missed',
  CANCELLED: 'missed',
  NO_SHOW: 'missed',
};

/** The weeks, Monday to Sunday, covering the month of `date`, with each day's appointments. */
export function monthGrid(date: CalendarDate, rows: readonly AppointmentRow[]): DayCell[][] {
  const month = periodOf('month', date);
  let day = periodOf('week', month.start).start;
  const last = periodOf('week', month.end).end;
  const weeks: DayCell[][] = [];
  while (compareDates(day, last) <= 0) {
    const week: DayCell[] = [];
    for (let i = 0; i < 7; i++, day = addDays(day, 1)) {
      const cell = { date: day, inMonth: day.month === date.month, met: 0, planned: 0, missed: 0 };
      for (const row of rows) {
        if (compareDates(row.appointment.date, day) === 0) {
          cell[CALENDAR_GROUP[row.appointment.status]] += 1;
        }
      }
      week.push(cell);
    }
    weeks.push(week);
  }
  return weeks;
}

/**
 * The period after picking `date` on the calendar, so the list always matches the day shown:
 * the same period when the day is in it, else the day or week holding it; null when a
 * custom range does not hold it (the day cannot be picked).
 */
export function pickDay(period: Period, date: CalendarDate): Period | null {
  if (isInPeriod(date, period)) return period;
  return period.kind === 'custom' ? null : periodOf(period.kind, date);
}

/** The appointments on `date` by team, then RE (both by name), each RE's by time. */
export function dayBoard(rows: readonly AppointmentRow[], date: CalendarDate): DayGroup[] {
  const groups = new Map<string, { team: Team | undefined; res: Map<string, AppointmentRow[]> }>();
  for (const row of rows) {
    if (compareDates(row.appointment.date, date) !== 0) continue;
    const teamKey = row.team?.id ?? '';
    const group = groups.get(teamKey) ?? { team: row.team, res: new Map() };
    groups.set(teamKey, group);
    group.res.set(row.appointment.reId, [...(group.res.get(row.appointment.reId) ?? []), row]);
  }
  return [...groups.values()]
    .sort((a, b) => byName(a.team?.name ?? '', b.team?.name ?? ''))
    .map(({ team, res }) => ({
      team,
      res: [...res.values()]
        .map((list) => ({
          re: list[0]?.re,
          rows: list.sort((a, b) =>
            (a.appointment.time ?? '').localeCompare(b.appointment.time ?? ''),
          ),
        }))
        .sort((a, b) => byName(a.re?.name ?? '', b.re?.name ?? '')),
    }));
}
