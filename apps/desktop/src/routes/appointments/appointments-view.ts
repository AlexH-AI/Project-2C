import type { AppointmentRecord, CustomerRecord } from '@p2c/db';
import {
  addDays,
  compareDates,
  formatDayMonth,
  inScope,
  isRfTransition,
  periodOf,
  type CalendarDate,
  type CustomerStage,
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

/** The appointments of the RE in scope, filtered by coordinator, in the repository's order. */
export function appointmentRows(
  data: AppointmentData,
  scope: Scope,
  coordinator: CoordinatorFilter,
): AppointmentRow[] {
  const person = (id: string) => data.people.find((p) => p.id === id);
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
    .filter(
      (a) =>
        inScope(data.people, a.reId, scope) &&
        (coordinator === 'any' ||
          (coordinator === 'none'
            ? a.coordinatorIds.length === 0
            : a.coordinatorIds.includes(coordinator))),
    )
    .map((a) => {
      const re = person(a.reId);
      return {
        appointment: a,
        customer: data.customers.find((c) => c.id === a.customerId),
        re,
        team: data.teams.find((team) => team.id === re?.teamId),
        coordinators: a.coordinatorIds.flatMap((id) => person(id) ?? []),
        outcome: outcome(a),
      };
    });
}

/** The weeks, Monday to Sunday, covering the month of `date`, with each day's appointments. */
export function monthGrid(date: CalendarDate, rows: readonly AppointmentRow[]): DayCell[][] {
  const month = periodOf('month', date);
  let day = periodOf('week', month.start).start;
  const last = periodOf('week', month.end).end;
  const weeks: DayCell[][] = [];
  while (compareDates(day, last) <= 0) {
    const week: DayCell[] = [];
    for (let i = 0; i < 7; i++, day = addDays(day, 1)) {
      const on = rows.filter((row) => compareDates(row.appointment.date, day) === 0);
      const count = (match: (status: string) => boolean) =>
        on.filter((row) => match(row.appointment.status)).length;
      week.push({
        date: day,
        inMonth: day.month === date.month,
        met: count((s) => s === 'MET'),
        planned: count((s) => s === 'SCHEDULED'),
        missed: count((s) => s !== 'MET' && s !== 'SCHEDULED'),
      });
    }
    weeks.push(week);
  }
  return weeks;
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
