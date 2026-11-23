import type { AppointmentRecord, CustomerRecord } from '@p2c/db';
import {
  CLOSED_STAGES,
  MIN_YEAR,
  PIPELINE_STAGES,
  addDays,
  appointmentGroup,
  byName,
  calendarDate,
  compareDates,
  daysBetween,
  formatDayMonth,
  isRm,
  weekdayOf,
  type CalendarDate,
  type MetricsData,
  type Period,
  type Person,
} from '@p2c/domain';
import { t } from '../../i18n';
import { customerBoard, type CustomerCard } from '../customers/customers-view';
import { kpiTiles, type KpiTile } from '../overview/overview-view';

/** What the RM page reads: the tables of the app. */
export interface RmData extends MetricsData {
  readonly customers: readonly CustomerRecord[];
  readonly appointments: readonly AppointmentRecord[];
}

/** A customer the RM is in charge of, as a row of the RM page (mockup search-rm-team.html `#rm`). */
export interface RmCustomer {
  readonly card: CustomerCard;
  /** The customer's latest meeting, today or before, whoever the RM on it. */
  readonly lastMet: { readonly date: CalendarDate; readonly daysAgo: number } | null;
  /** Over four weeks since that meeting: its days are written in orange. */
  readonly stale: boolean;
  /** The customer's next appointment still scheduled, today or after. */
  readonly next: {
    readonly date: CalendarDate;
    readonly time: string | null;
    readonly daysAhead: number;
  } | null;
}

export interface RmView {
  readonly rm: Person;
  /** Doanh số, Tổng số HĐ, Tỷ lệ hủy, Tỷ lệ chốt of the period, each with how it is worked out. */
  readonly stats: readonly KpiTile[];
  /** N4 → N1 and the closed ones, each list longest unmet first, the ones never met last. */
  readonly open: readonly RmCustomer[];
  readonly closed: readonly RmCustomer[];
}

/** Four weeks: a last meeting further back is flagged (mockup `#rm`, "quá 4 tuần"). */
const STALE_DAYS = 28;

const RM_STATS = ['revenue', 'net', 'cancelRate', 'closeRate'] as const;

/** Past every day: what a sort key of a missing day is, so it sorts last going up. */
export const NO_DAY = Number.MAX_SAFE_INTEGER;

const FIRST_DAY = calendarDate(MIN_YEAR, 1, 1);

/** A day as a sort key, from 1: never the 0 a number column writes light, as "Chưa gặp" (L231). */
const dayKey = (date: CalendarDate): number => daysBetween(FIRST_DAY, date) + 1;

/** The "Gặp gần nhất" column sorts by this: the earliest meeting first, never met last. */
export const lastMetKey = ({ lastMet }: RmCustomer): number =>
  lastMet ? dayKey(lastMet.date) : NO_DAY;

/** The "Lịch hẹn sắp tới" column sorts by this: the nearest first, none last. */
export const nextKey = ({ next }: RmCustomer): number => (next ? dayKey(next.date) : NO_DAY);

/** The shapes of a week of "Nhịp gặp · 8 tuần", in the order a week of many takes the first. */
export const CADENCE_MARKS = ['met', 'unrecorded', 'planned', 'missed', 'none'] as const;
export type CadenceMark = (typeof CADENCE_MARKS)[number];

export interface CadenceWeek {
  /** Monday to Sunday, as the calendar of the app. */
  readonly start: CalendarDate;
  readonly end: CalendarDate;
  readonly mark: CadenceMark;
}

const WEEKS = 8;

/**
 * "Nhịp gặp · 8 tuần" of a customer with this RM (mockup search-rm-team.html `#rm`, `#ask` 8):
 * seven weeks before today's and today's, the oldest first. A week shows the first shape of
 * `CADENCE_MARKS` its appointments give (`appointmentGroup`), none without one. Only the RM's own:
 * a meeting another RM held counts in "Gặp gần nhất", not here (the `rmId` of the Issue of C2b).
 */
export function cadence(
  appointments: readonly AppointmentRecord[],
  customerId: string,
  rmId: string,
  today: CalendarDate,
): CadenceWeek[] {
  const first = addDays(today, 1 - weekdayOf(today) - (WEEKS - 1) * 7);
  const marks = Array<CadenceMark>(WEEKS).fill('none');
  const rank = (mark: CadenceMark) => CADENCE_MARKS.indexOf(mark);
  for (const appointment of appointments) {
    if (appointment.customerId !== customerId || appointment.rmId !== rmId) continue;
    const week = Math.floor(daysBetween(first, appointment.date) / 7);
    const mark = appointmentGroup(appointment, today);
    if (week >= 0 && week < WEEKS && rank(mark) < rank(marks[week]!)) marks[week] = mark;
  }
  return marks.map((mark, week) => {
    const start = addDays(first, week * 7);
    return { start, end: addDays(start, 6), mark };
  });
}

/** The appointments of `rmId` by customer, read once for the strips of the page (`cadence`). */
export function appointmentsByCustomer(
  appointments: readonly AppointmentRecord[],
  rmId: string,
): ReadonlyMap<string, readonly AppointmentRecord[]> {
  const own = new Map<string, AppointmentRecord[]>();
  for (const appointment of appointments) {
    if (appointment.rmId !== rmId) continue;
    const list = own.get(appointment.customerId);
    if (list) list.push(appointment);
    else own.set(appointment.customerId, [appointment]);
  }
  return own;
}

const days = (from: CalendarDate, to: CalendarDate) =>
  t('sep.range', { from: formatDayMonth(from), to: formatDayMonth(to) });

/** The strip as one sentence, for a screen reader: how many weeks of each shape (mockup `#rm`). */
export function cadenceLabel(weeks: readonly CadenceWeek[]): string {
  const count = (mark: CadenceMark) => weeks.filter((week) => week.mark === mark).length;
  const counts = (['met', 'missed', 'unrecorded', 'planned'] as const).map((mark) =>
    t(`rmPage.cadence.count.${mark}`, { count: count(mark) }),
  );
  return t('rmPage.cadence.read', {
    range: days(weeks[0]!.start, weeks.at(-1)!.end),
    parts: counts.join(t('sep.list')),
  });
}

/** A week as the pointer over it reads it: "Tuần 21/09 – 27/09: đã gặp". */
export const cadenceWeekTitle = ({ start, end, mark }: CadenceWeek): string =>
  t('rmPage.cadence.week', { range: days(start, end), mark: t(`rmPage.cadence.${mark}`) });

/** Whether `a` comes before `b`: an earlier day, or the same day earlier (no time first). */
const sooner = (a: AppointmentRecord, b: AppointmentRecord): boolean => {
  const order = compareDates(a.date, b.date);
  return order < 0 || (order === 0 && (a.time ?? '') < (b.time ?? ''));
};

/**
 * The RM page of `rmId` (spec Phase 6 §5, mockup search-rm-team.html `#rm`): the four numbers of
 * `period` as Tổng quan works them out, for this RM alone, and the customers whose profile names
 * this RM, as the Customers screen shows them in the scope of that RM. Null when `rmId` is no RM.
 */
export function rmView(
  data: RmData,
  rmId: string,
  period: Period,
  today: CalendarDate,
): RmView | null {
  const rm = data.people.find((person) => person.id === rmId);
  if (!rm || !isRm(rm)) return null;
  const scope = { kind: 'rm', rmId } as const;
  const stats = kpiTiles(data, period, scope, today).filter((tile) =>
    (RM_STATS as readonly string[]).includes(tile.key),
  );
  const board = customerBoard(data, scope);
  const mine = new Set(data.customers.filter((c) => c.rmId === rmId).map((c) => c.id));
  const met = new Map<string, CalendarDate>();
  const ahead = new Map<string, AppointmentRecord>();
  for (const appointment of data.appointments) {
    const { customerId, date, status } = appointment;
    if (!mine.has(customerId)) continue;
    const fromToday = compareDates(date, today);
    if (status === 'MET' && fromToday <= 0) {
      const before = met.get(customerId);
      if (!before || compareDates(date, before) > 0) met.set(customerId, date);
    } else if (status === 'SCHEDULED' && fromToday >= 0) {
      const before = ahead.get(customerId);
      if (!before || sooner(appointment, before)) ahead.set(customerId, appointment);
    }
  }
  const row = (card: CustomerCard): RmCustomer => {
    const lastDay = met.get(card.customer.id);
    const next = ahead.get(card.customer.id);
    const daysAgo = lastDay ? daysBetween(lastDay, today) : null;
    return {
      card,
      lastMet: lastDay && daysAgo !== null ? { date: lastDay, daysAgo } : null,
      stale: daysAgo !== null && daysAgo > STALE_DAYS,
      next: next
        ? { date: next.date, time: next.time, daysAhead: daysBetween(today, next.date) }
        : null,
    };
  };
  const ordered = (cards: readonly CustomerCard[]) =>
    cards
      .map(row)
      .sort(
        (a, b) =>
          lastMetKey(a) - lastMetKey(b) || byName(a.card.customer.name, b.card.customer.name),
      );
  return {
    rm,
    stats,
    open: ordered(PIPELINE_STAGES.flatMap((stage) => board.open[stage])),
    closed: ordered(CLOSED_STAGES.flatMap((stage) => board.closed[stage])),
  };
}
