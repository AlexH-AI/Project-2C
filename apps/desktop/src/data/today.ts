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
      // A timer may fire a little early; the listener then reads the same day and it waits again.
      const wait = () => {
        timer = setTimeout(() => {
          listener();
          wait();
        }, untilMidnight(new Date()));
      };
      const onFocus = () => listener();
      const onVisible = () => {
        if (events.document.visibilityState === 'visible') listener();
      };
      wait();
      events.window.addEventListener('focus', onFocus);
      events.document.addEventListener('visibilitychange', onVisible);
      return () => {
        clearTimeout(timer);
        events.window.removeEventListener('focus', onFocus);
        events.document.removeEventListener('visibilitychange', onVisible);
      };
    },
  };
}
