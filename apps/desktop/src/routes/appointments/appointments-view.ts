import type { AppointmentRecord, CustomerRecord } from '@p2c/db';
import {
  addDays,
  appointmentGroup,
  compareDates,
  daysBetween,
  formatDayMonth,
  inScope,
  isInPeriod,
  isRfTransition,
  periodOf,
  shift,
  type AppointmentGroup,
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

/** The colour of each status wherever it is written. */
export const STATUS_TONE = {
  SCHEDULED: 'text-info',
  MET: 'text-ok',
  RESCHEDULED: 'text-warn',
  CANCELLED: 'text-fg-2',
  NO_SHOW: 'text-danger',
} as const satisfies Record<AppointmentStatus, string>;

export const FOCUS = 'focus-visible:outline-2 focus-visible:outline-accent';
/** A field shown but locked (mockup 6f `.input.locked`). */
export const LOCKED =
  'm-0 flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-fg-2 tabular-nums';
/** An action written as a link in running text or a table ("Hẹn tiếp", "Xem tất cả"). */
export const LINK = `cursor-pointer rounded-sm text-accent hover:underline ${FOCUS}`;

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

/** Where a day stands against today; tints the "Ngày" cell of the list (mockup B5). */
export type DateTone = 'past' | 'today' | 'future';

/** The "Ngày" cell of each tone (`--date-*-bg`; text stays `--text`). */
export const DATE_TONE_CELL = {
  past: 'bg-date-past-bg',
  today: 'bg-date-today-bg font-semibold',
  future: 'bg-date-future-bg',
} as const satisfies Record<DateTone, string>;

/** The "Chưa ghi kết quả" badge (mockup overview.html part 2 `.badge.plain.unrec`). */
const UNRECORDED_BADGE =
  'rounded-full border border-current px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-appt-unrecorded';

/**
 * The "Trạng thái" column: a scheduled appointment before today says no outcome is recorded yet,
 * so the list matches the counts (display only, the status stays).
 */
export function statusLabel(
  a: AppointmentRecord,
  today: CalendarDate,
): { readonly text: string; readonly tone: string } {
  return appointmentGroup(a, today) === 'unrecorded'
    ? { text: t('appointments.statusUnrecorded'), tone: UNRECORDED_BADGE }
    : { text: t(`appointmentStatus.${a.status}`), tone: '' };
}

/** The count line of a period or a month: "172 lịch · 64 đã gặp", then "· 5 chưa ghi kết quả" if any. */
export function summaryText(counts: {
  readonly total: number;
  readonly met: number;
  readonly unrecorded: number;
}): string {
  return t(counts.unrecorded > 0 ? 'appointments.summaryUnrecorded' : 'appointments.summary', {
    ...counts,
  });
}

export function dateTone(date: CalendarDate, today: CalendarDate): DateTone {
  const order = compareDates(date, today);
  return order < 0 ? 'past' : order === 0 ? 'today' : 'future';
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
  /** In a week or custom period, which the calendar bands; a month or a day is not banded. */
  readonly inPeriod: boolean;
  readonly met: number;
  readonly planned: number;
  /** Rescheduled, cancelled or no show. */
  readonly missed: number;
  /** Scheduled before today: no outcome recorded yet. */
  readonly unrecorded: number;
}

/** A month of the year grid (mockup B6): its appointments by calendar group, where it stands. */
export interface MonthCell {
  readonly month: number;
  readonly met: number;
  /** Rescheduled, cancelled or no show. */
  readonly missed: number;
  /** Scheduled before today: no outcome recorded yet. */
  readonly unrecorded: number;
  readonly planned: number;
  readonly state: 'past' | 'current' | 'future';
}

export interface DayGroup {
  readonly team: Team | undefined;
  readonly res: readonly {
    readonly re: Person | undefined;
    readonly rows: readonly AppointmentRow[];
  }[];
}

const byName = new Intl.Collator('vi').compare;

/** What each appointment came to: the stage move it caused, the stage kept, or its new day. */
export function outcomeResolver(
  data: Pick<AppointmentData, 'appointments' | 'transitions'>,
): (a: AppointmentRecord) => Outcome {
  const movedBy = new Map(
    data.transitions.flatMap((tr) => (tr.appointmentId ? [[tr.appointmentId, tr] as const] : [])),
  );
  const newDay = new Map(
    data.appointments.flatMap((a) =>
      a.rescheduledFromId ? [[a.rescheduledFromId, a.date] as const] : [],
    ),
  );
  return (a) => {
    const tr = movedBy.get(a.id);
    if (tr) return { kind: 'move', from: tr.from, to: tr.to, rf: isRfTransition(tr.from, tr.to) };
    if (a.status === 'MET' && a.stageAfter) return { kind: 'keep', stage: a.stageAfter };
    const to = newDay.get(a.id);
    return to ? { kind: 'rescheduled', to } : null;
  };
}

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
  const outcome = outcomeResolver(data);

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
 * The appointments in `period` per RE in charge (`re_id`; a coordinator counts nothing), for the
 * RE strip; an RE with none is not listed.
 */
export function appointmentsByRe(
  rows: readonly AppointmentRow[],
  period: Period,
): ReadonlyMap<string, number> {
  const counts = new Map<string, number>();
  for (const { appointment: a } of rows) {
    if (isInPeriod(a.date, period)) counts.set(a.reId, (counts.get(a.reId) ?? 0) + 1);
  }
  return counts;
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

/** The appointment `a` replaced and the one that replaced it (D3), each when there is one. */
export function rescheduleLinks(
  appointments: readonly AppointmentRecord[],
  a: AppointmentRecord,
): { readonly from: AppointmentRecord | undefined; readonly to: AppointmentRecord | undefined } {
  return {
    from: appointments.find((other) => other.id === a.rescheduledFromId),
    to: appointments.find((other) => other.rescheduledFromId === a.id),
  };
}

const noAppointments = (): Record<AppointmentGroup, number> => ({
  met: 0,
  missed: 0,
  unrecorded: 0,
  planned: 0,
});

/**
 * The weeks, Monday to Sunday, covering the month of `date`, with each day's appointments by group
 * (spec Phase 4 §1, against `today`) and whether it is in the banded `period`. A day after 31/12/2100 is null: a blank cell (spec Phase 4
 * §3.4); 01/01/1900 is a Monday, so the first week is whole.
 */
export function monthGrid(
  date: CalendarDate,
  rows: readonly AppointmentRow[],
  period: Period,
  today: CalendarDate,
): (DayCell | null)[][] {
  const banded = period.kind === 'week' || period.kind === 'custom';
  const month = periodOf('month', date);
  const weeks: (DayCell | null)[][] = [];
  for (let span = periodOf('week', month.start); ; span = shift(span, 1)) {
    const week: (DayCell | null)[] = [];
    const days = daysBetween(span.start, span.end) + 1;
    for (let i = 0; i < 7; i++) {
      if (i >= days) {
        week.push(null);
        continue;
      }
      const day = addDays(span.start, i);
      const cell = {
        date: day,
        inMonth: day.month === date.month,
        inPeriod: banded && isInPeriod(day, period),
        ...noAppointments(),
      };
      for (const row of rows) {
        if (compareDates(row.appointment.date, day) === 0) {
          cell[appointmentGroup(row.appointment, today)] += 1;
        }
      }
      week.push(cell);
    }
    weeks.push(week);
    if (compareDates(span.end, month.end) >= 0) return weeks;
  }
}

/** The twelve months of `year`, each with its appointments by group (§1) and against today. */
export function yearGrid(
  year: number,
  rows: readonly AppointmentRow[],
  today: CalendarDate,
): MonthCell[] {
  const counts = Array.from({ length: 12 }, noAppointments);
  for (const { appointment: a } of rows) {
    const cell = a.date.year === year ? counts[a.date.month - 1] : undefined;
    if (cell) cell[appointmentGroup(a, today)] += 1;
  }
  return counts.map((count, i) => {
    const order = year === today.year ? i + 1 - today.month : year - today.year;
    return {
      month: i + 1,
      ...count,
      state: order < 0 ? 'past' : order === 0 ? 'current' : 'future',
    };
  });
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
