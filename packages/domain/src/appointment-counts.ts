/**
 * Appointment counts by period in four groups (Phase 4 G2 §1, golden `docs/golden/lich-hen.md`),
 * shared by Tổng quan, Báo cáo and the Lịch hẹn screen so they show the same numbers.
 */
import type { Appointment, Person, Scope } from './model';
import { compareDates, isInPeriod } from './period';
import type { CalendarDate, Period } from './period';
import { markIndexer, scopeMatcher } from './stats';

/** Đã gặp · Dời – hủy – không đến · Chưa ghi kết quả · Dự kiến. */
export type AppointmentGroup = 'met' | 'missed' | 'unrecorded' | 'planned';

/**
 * The group of one appointment. A scheduled appointment before `today` has no outcome recorded
 * yet; one on `today` or later is still planned, so these two groups move as `today` moves.
 */
export function appointmentGroup(appointment: Appointment, today: CalendarDate): AppointmentGroup {
  switch (appointment.status) {
    case 'MET':
      return 'met';
    case 'RESCHEDULED':
    case 'CANCELLED':
    case 'NO_SHOW':
      return 'missed';
    case 'SCHEDULED':
      return compareDates(appointment.date, today) < 0 ? 'unrecorded' : 'planned';
  }
}

export type AppointmentCounts = Readonly<Record<AppointmentGroup | 'total', number>>;

/**
 * Appointments of the period and scope by group (§1). Each appointment counts once, in the period
 * holding its own day, so every link of a reschedule chain counts on its own. The scope follows the
 * RE on the appointment; coordinators, even RE, never count.
 *
 * `appointments` must be the live ones only, as the repository lists them: a deleted appointment
 * or one of a deleted customer is left out by the caller, never passed here.
 */
export function appointmentCounts(
  appointments: readonly Appointment[],
  period: Period,
  scope: Scope,
  people: readonly Person[],
  today: CalendarDate,
): AppointmentCounts {
  const matches = scopeMatcher(people, scope);
  const counts = noCounts();
  for (const appointment of appointments) {
    if (!matches(appointment.reId) || !isInPeriod(appointment.date, period)) continue;
    counts[appointmentGroup(appointment, today)] += 1;
    counts.total += 1;
  }
  return counts;
}

/**
 * `appointmentCounts` of one period for any scope, after one pass over the appointments (So sánh
 * team and Báo cáo count every team and RE, DR-20): each one is added to its RE, then a scope adds
 * up the RE it holds. Equal, scope by scope, to calling `appointmentCounts`.
 */
export function appointmentCountsByScope(
  appointments: readonly Appointment[],
  period: Period,
  people: readonly Person[],
  today: CalendarDate,
): (scope: Scope) => AppointmentCounts {
  const byRe = new Map<string, Counts>();
  for (const appointment of appointments) {
    if (!isInPeriod(appointment.date, period)) continue;
    const counts = byRe.get(appointment.reId) ?? noCounts();
    byRe.set(appointment.reId, counts);
    counts[appointmentGroup(appointment, today)] += 1;
    counts.total += 1;
  }
  return (scope) => {
    const matches = scopeMatcher(people, scope);
    const total = noCounts();
    for (const [reId, counts] of byRe) {
      if (!matches(reId)) continue;
      for (const key of COUNT_KEYS) total[key] += counts[key];
    }
    return total;
  };
}

type Counts = Record<AppointmentGroup | 'total', number>;

const COUNT_KEYS = ['met', 'missed', 'unrecorded', 'planned', 'total'] as const;

const noCounts = (): Counts => ({ met: 0, missed: 0, unrecorded: 0, planned: 0, total: 0 });

/**
 * `appointmentCounts` of each mark, in one pass over the appointments (Theo mốc, spec Phase 4 §4.4):
 * each one is put in the mark holding its day. Equal, mark by mark, to calling `appointmentCounts`
 * for each one; marks as `markIndexer` takes them.
 */
export function appointmentCountsByMark(
  appointments: readonly Appointment[],
  marks: readonly Period[],
  scope: Scope,
  people: readonly Person[],
  today: CalendarDate,
): AppointmentCounts[] {
  const matches = scopeMatcher(people, scope);
  const markOf = markIndexer(marks);
  const counts = marks.map(noCounts);
  for (const appointment of appointments) {
    if (!matches(appointment.reId)) continue;
    const mark = counts[markOf(appointment.date)];
    if (!mark) continue;
    mark[appointmentGroup(appointment, today)] += 1;
    mark.total += 1;
  }
  return counts;
}
