import { describe, expect, it } from 'vitest';
import { isStorableText, normalizeNote, normalizeText } from './text';

/** The invisible characters of DR6-72 outside `\p{Cf}`: Hangul fillers, CGJ, variation selectors… */
const INVISIBLE = [0x3164, 0x115f, 0xffa0, 0x34f, ...range(0xfe00, 0xfe0f), 0x2800].map((code) =>
  String.fromCodePoint(code),
);

/**
 * What typed or pasted text may hold: letters, tone marks, an emoji, characters NFC changes, every
 * kind of white space and invisible character the rules name, a lone surrogate half.
 */
const POOL = [
  ...[0x61, 0x42, 0x111, 0x1b0, 0x1f31f, 0x301, 0x323, 0x340, 0x2126, 0x20, 0x9, 0xa, 0xd],
  ...[0x85, 0xa0, 0x1680, 0x2000, 0x2028, 0x2029, 0x202f, 0x3000, 0xad, 0x200b, 0x200d, 0x2060],
  ...[0xfeff, 0x600, 0x1160, 0xe0100, 0xd800, ...INVISIBLE.map((char) => char.codePointAt(0)!)],
].map((code) => String.fromCodePoint(code));

/** Text of up to 12 characters of `POOL`, the same run for the same seed (Lehmer, MINSTD). */
function randomText(seed: number): () => string {
  let state = seed;
  const below = (n: number) => (state = (state * 48_271) % 0x7fff_ffff) % n;
  return () => Array.from({ length: below(13) }, () => POOL[below(POOL.length)]).join('');
}

function range(first: number, last: number): number[] {
  return Array.from({ length: last - first + 1 }, (_, i) => first + i);
}

describe('normalizeText', () => {
  it('gives one line as the screens show it: one space per run of white space, trimmed (DR6-49)', () => {
    expect(normalizeText(' Bình  Minh ')).toBe('Bình Minh');
    expect(normalizeText('Bình Minh')).toBe('Bình Minh');
    expect(normalizeText('Bình\t\r\n　Minh')).toBe('Bình Minh');
  });

  it('drops invisible format characters, so text with nothing to see is empty', () => {
    expect(normalizeText('Sao Mai​')).toBe('Sao Mai');
    expect(normalizeText('Sao⁠­ Mai')).toBe('Sao Mai');
    expect(normalizeText('​')).toBe('');
    expect(normalizeText('﻿ ⁠')).toBe('');
  });

  it('composes (NFC), also a tone mark kept from its letter by a format character', () => {
    expect(normalizeText('Hừng Đông'.normalize('NFD'))).toBe('Hừng Đông'.normalize('NFC'));
    // "à" typed as "a" + U+200B + combining grave accent.
    expect(normalizeText('Ba​̀')).toBe('Bà');
  });

  // DR6-72 (Q4): every Unicode White_Space, and every default-ignorable character, U+2800 too.
  it('takes U+0085 as white space, as Unicode does', () => {
    expect(normalizeText('Bình\u{85}Minh')).toBe('Bình Minh');
    expect(normalizeText('\u{85} \u{85}')).toBe('');
  });

  it('drops the invisible characters that are not format characters, and U+2800', () => {
    for (const char of INVISIBLE) {
      expect(normalizeText(`Sao${char} Mai${char}`)).toBe('Sao Mai');
      expect(normalizeText(char)).toBe('');
    }
    expect(normalizeText(INVISIBLE.join(' '))).toBe('');
  });

  it('still drops every format character, also one that is not default-ignorable', () => {
    expect(normalizeText('\u{600}Sao Mai\u{110BD}')).toBe('Sao Mai');
  });

  it('gives text it keeps as it is: nothing invisible, single spaces inside (random text)', () => {
    const next = randomText(72);
    for (let i = 0; i < 2000; i++) {
      const once = normalizeText(next());
      expect(normalizeText(once)).toBe(once);
      expect(once.replaceAll(' ', '')).not.toMatch(
        /[\p{White_Space}\p{Default_Ignorable_Code_Point}\p{Cf}\u{2800}]/u,
      );
      expect(once).not.toMatch(/^ | $| {2}/);
    }
  });
});

describe('normalizeNote', () => {
  it('keeps the line breaks of a note and cleans each line as normalizeText (Owner 16/10/2026)', () => {
    expect(normalizeNote('  Đã kết hôn,  2 con \r\n\nBác sĩ​\r')).toBe(
      'Đã kết hôn, 2 con\n\nBác sĩ',
    );
  });

  it('is empty when no line has anything to see', () => {
    expect(normalizeNote('\n​\n  \n')).toBe('');
    expect(normalizeNote('\u{3164}\n\u{2800}')).toBe('');
  });

  it('breaks the line at every Unicode line separator, not at a space', () => {
    expect(normalizeNote('Du học 2029\u{2028}Con thứ hai\u{2029}\u{85}Bác sĩ')).toBe(
      'Du học 2029\nCon thứ hai\n\nBác sĩ',
    );
  });

  it('gives a note it keeps as it is (random text)', () => {
    const next = randomText(2029);
    for (let i = 0; i < 2000; i++) {
      const once = normalizeNote(next());
      expect(normalizeNote(once)).toBe(once);
    }
  });
});

describe('isStorableText', () => {
  it('refuses a NUL and a lone surrogate half, which the database cannot store as they are', () => {
    expect(isStorableText('Sao Mai 🌟')).toBe(true);
    expect(isStorableText('A\u0000B')).toBe(false);
    expect(isStorableText('A\uD800')).toBe(false);
    expect(isStorableText('\uDC00B')).toBe(false);
  });
});
