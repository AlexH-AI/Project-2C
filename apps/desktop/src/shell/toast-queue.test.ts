import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TOAST_MS, createToastQueue } from './toast-queue';

beforeEach(() => void vi.useFakeTimers());
afterEach(() => void vi.useRealTimers());

const undo = (run: () => void) => ({ label: 'Hoàn tác', run });

describe('createToastQueue', () => {
  it('shows one toast at a time: a new one takes the place of the one shown', () => {
    const queue = createToastQueue();
    expect(queue.current()).toBeNull();
    queue.show({ text: 'Đã tạo lịch hẹn' });
    queue.show({ text: 'Đã chuyển lịch hẹn vào Thùng rác' });
    expect(queue.current()).toEqual({ text: 'Đã chuyển lịch hẹn vào Thùng rác' });
  });

  it('takes a toast away 4 200 ms after it showed, whatever it took the place of', () => {
    expect(TOAST_MS).toBe(4_200);
    const queue = createToastQueue();
    queue.show({ text: 'first' });
    vi.advanceTimersByTime(4_000);
    queue.show({ text: 'second' });
    vi.advanceTimersByTime(4_199);
    expect(queue.current()).toEqual({ text: 'second' });
    vi.advanceTimersByTime(1);
    expect(queue.current()).toBeNull();
  });

  it('keeps an error until it is closed, also in the place of a toast about to leave', () => {
    const queue = createToastQueue();
    queue.show({ text: 'Đã chuyển lịch hẹn vào Thùng rác' });
    vi.advanceTimersByTime(4_000);
    queue.show({ text: 'Khôi phục KH trước.', tone: 'error' });
    vi.advanceTimersByTime(60_000);
    expect(queue.current()).toEqual({ text: 'Khôi phục KH trước.', tone: 'error' });
    queue.dismiss();
    expect(queue.current()).toBeNull();
  });

  it('runs the action of the toast, then closes it', () => {
    const queue = createToastQueue();
    const run = vi.fn(() => expect(queue.current()).not.toBeNull());
    queue.show({ text: 'Đã chuyển lịch hẹn vào Thùng rác', action: undo(run) });
    queue.act();
    expect(run).toHaveBeenCalledOnce();
    expect(queue.current()).toBeNull();
    // Nothing shown, or a toast with no action: nothing to run.
    queue.act();
    queue.show({ text: 'Đã tạo lịch hẹn' });
    queue.act();
    expect(queue.current()).toEqual({ text: 'Đã tạo lịch hẹn' });
  });

  it('leaves the toast its action showed, with 4 200 ms of its own', () => {
    const queue = createToastQueue();
    const restored = () => queue.show({ text: 'Đã khôi phục lịch hẹn' });
    queue.show({ text: 'Đã chuyển lịch hẹn vào Thùng rác', action: undo(restored) });
    queue.act();
    expect(queue.current()).toEqual({ text: 'Đã khôi phục lịch hẹn' });
    vi.advanceTimersByTime(4_200);
    expect(queue.current()).toBeNull();
  });

  it('tells its listeners of each change, until they leave', () => {
    const queue = createToastQueue();
    const listener = vi.fn();
    const leave = queue.subscribe(listener);
    queue.show({ text: 'Đã tạo lịch hẹn' });
    vi.advanceTimersByTime(4_200);
    // Nothing shown: closing changes nothing.
    queue.dismiss();
    expect(listener).toHaveBeenCalledTimes(2);
    leave();
    queue.show({ text: 'Đã tạo lịch hẹn' });
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('stays while the pointer is over it or the focus in it, then has 4 200 ms again (L209)', () => {
    const queue = createToastQueue();
    queue.show({ text: 'Đã chuyển lịch hẹn vào Thùng rác', action: undo(() => {}) });
    vi.advanceTimersByTime(4_000);
    queue.hold('pointer', true);
    queue.hold('focus', true);
    vi.advanceTimersByTime(60_000);
    queue.hold('pointer', false);
    vi.advanceTimersByTime(60_000);
    // Held by one of the two, it still stays.
    expect(queue.current()).not.toBeNull();
    queue.hold('focus', false);
    vi.advanceTimersByTime(4_199);
    expect(queue.current()).not.toBeNull();
    vi.advanceTimersByTime(1);
    expect(queue.current()).toBeNull();
  });

  it('lets a new toast go by its own clock, and holds only what is held', () => {
    const queue = createToastQueue();
    queue.show({ text: 'first' });
    queue.hold('pointer', true);
    // The new one comes under a pointer that has not moved: no hold of its own.
    queue.show({ text: 'second' });
    vi.advanceTimersByTime(4_000);
    // Let go, or held again, a hold that was not there changes nothing: the clock keeps running.
    queue.hold('pointer', false);
    queue.hold('focus', false);
    vi.advanceTimersByTime(200);
    expect(queue.current()).toBeNull();
    // An error stays, held or not.
    queue.show({ text: 'Khôi phục KH trước.', tone: 'error' });
    queue.hold('focus', true);
    queue.hold('focus', true);
    queue.hold('focus', false);
    vi.advanceTimersByTime(60_000);
    expect(queue.current()).toEqual({ text: 'Khôi phục KH trước.', tone: 'error' });
  });
});
