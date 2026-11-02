import { describe, expect, it, vi } from 'vitest';
import { notify } from './listeners';

describe('notify', () => {
  it('calls each listener once, in the order they came', () => {
    const calls: string[] = [];
    notify(new Set([() => calls.push('a'), () => calls.push('b')]), vi.fn());
    expect(calls).toEqual(['a', 'b']);
  });

  // NIT #87, DR6-140, review of PR 911: a listener's bug keeps no other from hearing of the change.
  it('still calls the listeners after one that throws, and reports what it threw', () => {
    const bug = new Error('listener bug');
    const report = vi.fn();
    const after = vi.fn();
    notify(
      new Set([
        () => {
          throw bug;
        },
        after,
      ]),
      report,
    );
    expect(after).toHaveBeenCalledTimes(1);
    expect(report).toHaveBeenCalledExactlyOnceWith(bug);
  });
});
