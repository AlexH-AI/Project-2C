import { describe, expect, it, vi } from 'vitest';
import { cleanNote, cleanText, optionalText, requireName, today } from './common';
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

  it('drops a U+FEFF that starts the name, and takes control characters alone as empty', () => {
    expect(requireName('\u{FEFF}Sao Mai')).toBe('Sao Mai');
    expect(codeOf(() => requireName('\u0001\u0007\u009F'))).toBe('NAME_REQUIRED');
  });
});

// CL3-A16: text is checked as typed, before the invisible characters go. Dropping U+200B first
// would join the halves of the emoji around it into one, a character no one typed.
describe('cleanText, cleanNote', () => {
  it('refuse halves of a pair kept apart by an invisible character, not join them', () => {
    for (const clean of [cleanText, cleanNote]) {
      expect(codeOf(() => clean('\uD83D\u{200B}\uDE00 Lan'))).toBe('INVALID_TEXT');
      expect(clean('😀\u{200B} Lan')).toBe('😀 Lan');
    }
  });
});

describe('optionalText', () => {
  it('trims the text, gives null when empty, and refuses a NUL as requireName does (R2-13)', () => {
    expect(optionalText(' Gửi minh họa ')).toBe('Gửi minh họa');
    expect(optionalText('  ')).toBeNull();
    expect(optionalText(undefined)).toBeNull();
    expect(codeOf(() => optionalText('A\u0000B'))).toBe('INVALID_TEXT');
  });

  it('refuses a lone surrogate half, which the database would store as U+FFFD', () => {
    expect(codeOf(() => optionalText('Gặp lại\u{D800}'))).toBe('INVALID_TEXT');
    expect(codeOf(() => optionalText('\u{DC00}'))).toBe('INVALID_TEXT');
    expect(optionalText('Gửi 🌟')).toBe('Gửi 🌟');
  });
});
