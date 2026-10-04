import { calendarDate, fromLocalDate } from '@p2c/domain';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { watchToday } from './today';

/** Stand-in for `document`: only its events and visibility matter. */
class FakeDocument extends EventTarget {
  visibilityState: DocumentVisibilityState = 'visible';
}

function setup() {
  const events = { window: new EventTarget(), document: new FakeDocument() };
  const watcher = watchToday(() => fromLocalDate(new Date()), events);
  const listener = vi.fn();
  return { events, watcher, listener };
}

describe('watchToday', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date(2026, 9, 31, 23, 59) });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the same object while the day stays the same', () => {
    const { watcher } = setup();
    const first = watcher.current();

    vi.setSystemTime(new Date(2026, 9, 31, 23, 59, 59));
    expect(first).toEqual(calendarDate(2026, 10, 31));
    expect(watcher.current()).toBe(first);
  });

  it('tells its listener at every midnight, and then reads the new day', () => {
    const { watcher, listener } = setup();
    watcher.subscribe(listener);

    vi.advanceTimersByTime(59_000);
    expect(listener).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2 * 60_000);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(watcher.current()).toEqual(calendarDate(2026, 11, 1));

    vi.advanceTimersByTime(24 * 60 * 60_000);
    expect(listener).toHaveBeenCalledTimes(2);
    expect(watcher.current()).toEqual(calendarDate(2026, 11, 2));
  });

  it('reads the day again when the window gets focus or turns visible, not when it hides', () => {
    const { events, watcher, listener } = setup();
    watcher.subscribe(listener);
    // The machine slept past midnight: no timer ran.
    vi.setSystemTime(new Date(2026, 10, 1, 7, 30));

    events.document.visibilityState = 'hidden';
    events.document.dispatchEvent(new Event('visibilitychange'));
    expect(listener).not.toHaveBeenCalled();

    events.document.visibilityState = 'visible';
    events.document.dispatchEvent(new Event('visibilitychange'));
    expect(listener).toHaveBeenCalledTimes(1);
    expect(watcher.current()).toEqual(calendarDate(2026, 11, 1));

    events.window.dispatchEvent(new Event('focus'));
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('stops its timer and its event listeners on unsubscribe', () => {
    const { events, watcher, listener } = setup();
    const unsubscribe = watcher.subscribe(listener);
    expect(vi.getTimerCount()).toBe(1);

    unsubscribe();
    expect(vi.getTimerCount()).toBe(0);
    events.window.dispatchEvent(new Event('focus'));
    events.document.dispatchEvent(new Event('visibilitychange'));
    vi.advanceTimersByTime(24 * 60 * 60_000);
    expect(listener).not.toHaveBeenCalled();
  });
});
