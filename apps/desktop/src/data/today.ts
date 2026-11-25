import { compareDates, type CalendarDate } from '@p2c/domain';

/** The app's day for `useSyncExternalStore`: screens follow it past midnight (T-126). */
export interface DayWatcher {
  /** The day `read` gives; the same object while the day stays the same, so memos keep. */
  current(): CalendarDate;
  /**
   * Calls `listener` at every local midnight and whenever the window wakes (gets focus, turns
   * visible again: a timer does not run while the machine sleeps). Returns the unsubscribe function.
   */
  subscribe(listener: () => void): () => void;
}

/** Where the wake-up events come from; tests pass stand-ins. */
export interface WakeEvents {
  readonly window: EventTarget;
  readonly document: EventTarget & { readonly visibilityState: DocumentVisibilityState };
}

/**
 * Calls `listener` whenever the window wakes: gets focus, or turns visible again (not as it hides).
 * A timer does not run while the machine sleeps, so a clock of the app reads again then
 * (`watchToday`, and `watchMinute` of "Lưu ý"). Returns the function that stops it.
 */
export function onWake(events: WakeEvents, listener: () => void): () => void {
  const onFocus = () => listener();
  const onVisible = () => {
    if (events.document.visibilityState === 'visible') listener();
  };
  events.window.addEventListener('focus', onFocus);
  events.document.addEventListener('visibilitychange', onVisible);
  return () => {
    events.window.removeEventListener('focus', onFocus);
    events.document.removeEventListener('visibilitychange', onVisible);
  };
}

/** Milliseconds from `at` to the next local midnight. */
const untilMidnight = (at: Date) =>
  new Date(at.getFullYear(), at.getMonth(), at.getDate() + 1).getTime() - at.getTime();

export function watchToday(
  read: () => CalendarDate,
  events: WakeEvents = { window, document },
): DayWatcher {
  let day = read();
  return {
    current() {
      const next = read();
      if (compareDates(next, day) !== 0) day = next;
      return day;
    },
    subscribe(listener) {
      let timer: ReturnType<typeof setTimeout>;
      let stopped = false;
      // A timer may fire a little early; the listener then reads the same day and it waits again.
      const wait = () => {
        timer = setTimeout(() => {
          listener();
          if (!stopped) wait();
        }, untilMidnight(new Date()));
      };
      wait();
      const offWake = onWake(events, listener);
      return () => {
        stopped = true;
        clearTimeout(timer);
        offWake();
      };
    },
  };
}
