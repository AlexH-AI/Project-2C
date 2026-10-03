import { describe, expect, it, vi } from 'vitest';
import { today } from './common';
import { openDatabase } from './database';
import { d } from './test-support';

describe('today', () => {
  it('is the local calendar day of one read of the database clock', async () => {
    const now = vi.fn(() => new Date(2026, 8, 26, 23, 59));
    const db = await openDatabase({ now });
    now.mockClear();

    expect(today(db)).toEqual(d(26, 9, 2026));
    expect(now).toHaveBeenCalledTimes(1);
  });
});
