import { describe, expect, it } from 'vitest';
import { isStorableText, normalizeNote, normalizeText } from './text';

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
});

describe('normalizeNote', () => {
  it('keeps the line breaks of a note and cleans each line as normalizeText (Owner 16/10/2026)', () => {
    expect(normalizeNote('  Đã kết hôn,  2 con \r\n\nBác sĩ​\r')).toBe(
      'Đã kết hôn, 2 con\n\nBác sĩ',
    );
  });

  it('is empty when no line has anything to see', () => {
    expect(normalizeNote('\n​\n  \n')).toBe('');
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
