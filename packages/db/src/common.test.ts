import { describe, expect, it, vi } from 'vitest';
import { requireName, today } from './common';
import { openDatabase } from './database';
import { codeOf, d } from './test-support';

describe('today', () => {
  it('is the local calendar day of one read of the database clock', async () => {
    const now = vi.fn(() => new Date(2026, 8, 26, 23, 59));
    const db = await openDatabase({ now });
    now.mockClear();

    expect(today(db)).toEqual(d(26, 9, 2026));
    expect(now).toHaveBeenCalledTimes(1);
  });
});

describe('requireName', () => {
  it('stores a name trimmed and composed (NFC), whatever form it was typed in (DR-49)', () => {
    expect(requireName(' Hừng Đông '.normalize('NFD'))).toBe('Hừng Đông');
    expect(requireName('Hừng Đông')).toBe('Hừng Đông'.normalize('NFC'));
  });

  it('refuses an empty name, and a NUL that the database would cut the name at', () => {
    expect(codeOf(() => requireName('  '))).toBe('NAME_REQUIRED');
    expect(codeOf(() => requireName('A\u0000B'))).toBe('INVALID_TEXT');
  });
});
