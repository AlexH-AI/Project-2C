import type { AppointmentRecord, CustomerRecord } from '@p2c/db';
import {
  CLOSED_STAGES,
  PIPELINE_STAGES,
  byName,
  compareDates,
  daysBetween,
  isRm,
  type CalendarDate,
  type MetricsData,
  type Period,
  type Person,
} from '@p2c/domain';
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

/** The "Gặp gần nhất" column sorts by this: the earliest meeting first, never met last. */
export const lastMetKey = ({ lastMet }: RmCustomer): number =>
  lastMet ? -lastMet.daysAgo : NO_DAY;

/** The "Lịch hẹn sắp tới" column sorts by this: the nearest first, none last. */
export const nextKey = ({ next }: RmCustomer): number => (next ? next.daysAhead : NO_DAY);

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
