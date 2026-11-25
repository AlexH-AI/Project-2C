import type { AppointmentRecord } from '@p2c/db';
import {
  compareDates,
  formatDayMonth,
  formatLocalDateTime,
  formatLocalTime,
  fromLocalDate,
  minuteOfDay,
  scopeMatcher,
  weekdayOf,
  type Person,
  type Scope,
} from '@p2c/domain';
import type { WakeEvents } from '../data/today';
import { joinParts, t } from '../i18n';
import { withTime } from '../routes/appointments/appointment-form';
import type { BackgroundJob } from './background-jobs';

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
const minuteOf = (time: string | null) => (time === null ? Infinity : minuteOfDay(time));

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

/**
 * The jobs "Lưu ý" shows, in their order: not an analysis of a customer no longer there (in the
 * Thùng rác, or of data replaced), which has no name to show and would be refused if run again
 * (review of PR 1505). The customer back, so is the job.
 */
export const shownJobs = (
  jobs: readonly BackgroundJob[],
  customers: readonly { readonly id: string }[],
): BackgroundJob[] =>
  jobs.filter(
    (job) => job.customerId === undefined || customers.some((c) => c.id === job.customerId),
  );

/** `T4 11/11 09:00`: the day of an appointment whose year is clear from context, and its time. */
const dayText = (a: AppointmentRecord) =>
  withTime(`${t(`weekday.${weekdayOf(a.date)}`)} ${formatDayMonth(a.date)}`, a.time);

/** What the pill says of the next appointment (mockup search-rm-team.html `#now`). */
export interface PillText {
  /** Whether the next one is of today: a dot pulses before it; else the calendar shows. */
  readonly today: boolean;
  /** Its time, on today. */
  readonly what: string;
  /** The customer's name; once today has none left, "Hết lịch hôm nay"; with none, that. */
  readonly who: string;
  /** The time left until it; once today has none left, the day of the next. */
  readonly when: string;
  /** All of it as read out: "·" before the time left only beside a name. */
  readonly text: string;
}

/**
 * The words of the pill for `view`; `name` gives a customer's name as the window shows it. A
 * narrow window leaves out the customer's name, and only that (review of PR 1493): the time and
 * the time left stay, as do "Hết lịch hôm nay" and the day of the next.
 */
export function pillText(
  view: HeadsUp,
  now: Date,
  narrow: boolean,
  name: (a: AppointmentRecord) => string,
): PillText {
  const next = view.next;
  const today = !!next && compareDates(next.appointment.date, fromLocalDate(now)) === 0;
  const [what, who, when] = !next
    ? ['', t('headsUp.none'), '']
    : !today
      ? ['', t('headsUp.dayOver'), t('headsUp.nextOn', { when: dayText(next.appointment) })]
      : [
          next.appointment.time ?? '',
          narrow ? '' : name(next.appointment),
          next.minutesLeft === null ? t('headsUp.allDay') : leftText(next.minutesLeft),
        ];
  const head = [what, who].filter(Boolean).join(' ');
  const text = who && when ? joinParts([head, when]) : [head, when].filter(Boolean).join(' ');
  return { today, what, who, when, text };
}

/** The app's clock for "Lưu ý", for `useSyncExternalStore`. */
export interface MinuteWatcher {
  /** The moment read: the same object while its minute lasts, so memos keep. */
  current(): Date;
  /**
   * Calls `listener` as each minute starts and whenever the window wakes (gets focus, turns visible
   * again). Returns the unsubscribe function.
   */
  subscribe(listener: () => void): () => void;
}

/**
 * The app's clock (`read`: `clockNow`, the e2e day pinned) as "Lưu ý" counts from it, as the day of
 * the screens is (`watchToday`): a timer does not run while the machine sleeps (review of PR 1493).
 */
export function watchMinute(
  read: () => Date,
  events: WakeEvents = { window, document },
): MinuteWatcher {
  let now = read();
  return {
    current() {
      const next = read();
      if (formatLocalDateTime(next) !== formatLocalDateTime(now)) now = next;
      return now;
    },
    subscribe(listener) {
      let timer: ReturnType<typeof setTimeout>;
      let stopped = false;
      // From the moment read: a timer that fires a little early waits the rest of its minute.
      const wait = () => {
        clearTimeout(timer);
        if (stopped) return;
        const at = read();
        timer = setTimeout(
          () => {
            listener();
            wait();
          },
          60_000 - (at.getSeconds() * 1_000 + at.getMilliseconds()),
        );
      };
      const onFocus = () => {
        listener();
        wait();
      };
      const onVisible = () => {
        if (events.document.visibilityState === 'visible') onFocus();
      };
      wait();
      events.window.addEventListener('focus', onFocus);
      events.document.addEventListener('visibilitychange', onVisible);
      return () => {
        stopped = true;
        clearTimeout(timer);
        events.window.removeEventListener('focus', onFocus);
        events.document.removeEventListener('visibilitychange', onVisible);
      };
    },
  };
}
