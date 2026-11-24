import type { AppointmentRecord } from '@p2c/db';
import {
  compareDates,
  formatLocalTime,
  fromLocalDate,
  scopeMatcher,
  type Person,
  type Scope,
} from '@p2c/domain';
import { t } from '../i18n';

/** How an appointment of today stands in the panel of "Lưu ý" (mockup search-rm-team.html `#now`). */
export type HeadsUpState = 'met' | 'missed' | 'unrecorded' | 'next' | 'planned';

export interface HeadsUpRow {
  readonly appointment: AppointmentRecord;
  readonly state: HeadsUpState;
}

export interface HeadsUpNext {
  readonly appointment: AppointmentRecord;
  /** Whole minutes until it starts: on today, with a time; `null` on a later day or with none. */
  readonly minutesLeft: number | null;
}

export interface HeadsUp {
  /** The first appointment still ahead, today or on a later day; none when there is none. */
  readonly next: HeadsUpNext | null;
  /** Every appointment of today, by time; those with no time last. */
  readonly today: readonly HeadsUpRow[];
  /** Sessions passed with no outcome recorded, today's and before ("Cần làm"). */
  readonly unrecorded: number;
}

/** The minute of the day of a stored `HH:MM`; one with no time ends its day. */
const minuteOf = (time: string | null) =>
  time === null ? Infinity : Number(time.slice(0, 2)) * 60 + Number(time.slice(3));

/** By day, then by time, those with no time after the timed ones of their day. */
const byWhen = (a: AppointmentRecord, b: AppointmentRecord) =>
  compareDates(a.date, b.date) || minuteOf(a.time) - minuteOf(b.time);

/**
 * "Lưu ý" for the scope picked (VA9, mockup search-rm-team.html `#now`, `#ask` 3): the next
 * appointment and how long until it, the day by time, and how many sessions wait for their outcome.
 * A scheduled session has passed once its minute has: one due this very minute is still the next.
 * One with no time passes only with its day, as the screens count it (`appointmentGroup`).
 */
export function headsUp(
  appointments: readonly AppointmentRecord[],
  people: readonly Person[],
  scope: Scope,
  now: Date,
): HeadsUp {
  const today = fromLocalDate(now);
  const minute = minuteOf(formatLocalTime(now));
  const matches = scopeMatcher(people, scope);
  const passed = (a: AppointmentRecord) => {
    const order = compareDates(a.date, today);
    return order < 0 || (order === 0 && minuteOf(a.time) < minute);
  };
  let next: AppointmentRecord | undefined;
  let unrecorded = 0;
  const ofToday: AppointmentRecord[] = [];
  for (const a of appointments) {
    if (!matches(a.rmId)) continue;
    if (compareDates(a.date, today) === 0) ofToday.push(a);
    if (a.status !== 'SCHEDULED') continue;
    if (passed(a)) unrecorded += 1;
    else if (!next || byWhen(a, next) < 0) next = a;
  }
  const stateOf = (a: AppointmentRecord): HeadsUpState => {
    if (a.status === 'MET') return 'met';
    if (a.status !== 'SCHEDULED') return 'missed';
    return passed(a) ? 'unrecorded' : a === next ? 'next' : 'planned';
  };
  const todayNext = next && compareDates(next.date, today) === 0 && next.time !== null;
  return {
    next: next
      ? { appointment: next, minutesLeft: todayNext ? minuteOf(next.time) - minute : null }
      : null,
    today: ofToday
      .sort(byWhen)
      .map((appointment) => ({ appointment, state: stateOf(appointment) })),
    unrecorded,
  };
}

/** "còn 25 phút", "còn 1 giờ 25 phút"; "đến giờ" at the minute itself. */
export function leftText(minutes: number): string {
  if (minutes <= 0) return t('headsUp.due');
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return t('headsUp.leftMinutes', { count: rest });
  return t(rest === 0 ? 'headsUp.leftHours' : 'headsUp.leftHoursMinutes', {
    n: hours,
    count: rest,
  });
}
