import { describe, expect, it, vi } from 'vitest';
import {
  cleanNote,
  cleanText,
  isLabel,
  optionalText,
  readsBackAsIs,
  requireName,
  today,
} from './common';
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

  // DR6-72 (Owner 23/10/2026, T-291): as a name or a KYC value, text with nothing to see is empty.
  it('gives null for text with nothing to see, and keeps text with something as typed, trimmed', () => {
    for (const text of ['\u{3164}', '\u{2800}', '\u{FE0F}', '\u{85}', ' \u{200B}\u{85}\u{7} ']) {
      expect(optionalText(text)).toBeNull();
    }
    // `trim` of JavaScript keeps U+0085, as the spec says (Phase 3 §4).
    expect(optionalText(' \u{85}Gửi\u{3164} ')).toBe('\u{85}Gửi\u{3164}');
  });
});

// DR6-137 (review of PR 907): one rule, which a label of an AI analysis and the backup import read.
describe('readsBackAsIs', () => {
  it('takes text the database reads back as it is, a U+FEFF inside it or at its end too', () => {
    for (const text of ['Sao Mai', '', 'glm-5.3 😀', 'a\u{FEFF}b', 'x\u{FEFF}']) {
      expect(readsBackAsIs(text)).toBe(true);
    }
  });

  it('refuses a NUL, a lone surrogate half and a U+FEFF that starts the text', () => {
    for (const text of ['A\u0000B', 'Gặp lại\u{D800}', '\u{DC00}', '\u{FEFF}', '\u{FEFF}alpha']) {
      expect(readsBackAsIs(text)).toBe(false);
    }
  });
});

describe('isLabel', () => {
  it('takes text with something to see that reads back as it is', () => {
    for (const text of ['glm-5.3', `${'g'.repeat(98)}😀`, 'glm\u{200B}-5.3']) {
      expect(isLabel(text)).toBe(true);
    }
  });

  // DR6-159: blank as every other check of the app reads it (`normalizeText`), not as `trim` does.
  it('refuses text with nothing to see, invisible characters alone too', () => {
    for (const text of [
      '',
      '  ',
      '\u{A0}',
      '\u{200B}',
      '\u{2060}',
      '\u{85}',
      '\u{3164}',
      '\u{180E}',
      ' \u{200B}\u{3164} ',
    ]) {
      expect(isLabel(text)).toBe(false);
    }
  });

  it('refuses what is not text or does not read back as it is', () => {
    for (const text of [null, undefined, 5, 'glm\0-5.3', '\u{FEFF}glm', 'glm\u{D800}']) {
      expect(isLabel(text)).toBe(false);
    }
  });
});
