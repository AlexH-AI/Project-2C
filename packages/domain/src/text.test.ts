import { describe, expect, it } from 'vitest';
import {
  collapseSpaces,
  isStorableText,
  normalizeNote,
  normalizeText,
  stripDiacritics,
  toHex,
} from './text';

/** The invisible characters of DR6-72 outside `\p{Cf}`: Hangul fillers, CGJ, variation selectors… */
const INVISIBLE = [0x3164, 0x115f, 0xffa0, 0x34f, ...range(0xfe00, 0xfe0f), 0x2800].map((code) =>
  String.fromCodePoint(code),
);

/**
 * What typed or pasted text may hold: letters, tone marks, an emoji, characters NFC changes and one
 * NFKC would, every kind of white space, invisible and control character the rules name, both
 * halves of a surrogate pair.
 */
const POOL = [
  ...[0x61, 0x42, 0x111, 0x1b0, 0x1f31f, 0x301, 0x323, 0x340, 0x2126, 0xb2, 0x20, 0x9, 0xa, 0xd],
  ...[0x85, 0xa0, 0x1680, 0x2000, 0x2028, 0x2029, 0x202f, 0x3000, 0xad, 0x200b, 0x200d, 0x2060],
  ...[0xfeff, 0x600, 0x1160, 0xe0100, 0x7, 0x9f, 0xd800, 0xdc00],
  ...INVISIBLE.map((char) => char.codePointAt(0)!),
].map((code) => String.fromCodePoint(code));

/**
 * Text of up to 12 characters of `POOL`, the same run for the same seed (Lehmer, MINSTD). The
 * import test of packages/db has its own, on a pool of what the import refuses: domain imports
 * nothing, and no package exports test code (review of PR 686).
 */
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

  // DR6-111 (Q2 a, Owner 21/10/2026): the C0 / C1 controls that are not white space show nothing.
  it('drops the control characters that are not white space, so text of them alone is empty', () => {
    expect(normalizeText('Sao Mai\u{7}')).toBe('Sao Mai');
    expect(normalizeText('Sao\u{1B} Mai\u{9F}')).toBe('Sao Mai');
    expect(normalizeText('\u{1}\u{8}\u{E}\u{1F}\u{7F}\u{80}\u{84}\u{86}\u{9F}')).toBe('');
    // "à" typed as "a" + U+0007 + combining grave accent.
    expect(normalizeText('Ba\u{7}\u{300}')).toBe('Bà');
  });

  it('keeps NUL, which isStorableText refuses, so a screen says what the command does', () => {
    expect(normalizeText('A\u{0}B')).toBe('A\u{0}B');
    expect(normalizeText('\u{0}')).toBe('\u{0}');
  });

  it('composes as NFC, not NFKC: a compatibility character stays as typed', () => {
    expect(normalizeText('Nhà 120 m²')).toBe('Nhà 120 m²');
    expect(normalizeText('Ｌａｎ ﬁ tầng ５')).toBe('Ｌａｎ ﬁ tầng ５');
  });

  it('gives text it keeps as it is: nothing invisible, single spaces inside (random text)', () => {
    const next = randomText(72);
    for (let i = 0; i < 2000; i++) {
      const once = normalizeText(next());
      expect(normalizeText(once)).toBe(once);
      expect(once.replaceAll(' ', '')).not.toMatch(
        /[\p{White_Space}\p{Default_Ignorable_Code_Point}\p{Cf}\p{Cc}\u{2800}]/u,
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

  it('breaks the line at a CR alone as at CRLF, and drops a control character', () => {
    expect(normalizeNote('Du học 2029\rCon thứ hai\r\nBác sĩ\u{7}')).toBe(
      'Du học 2029\nCon thứ hai\nBác sĩ',
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

  // DR6-107: the commands drop a U+FEFF that starts the text; only the backup import refuses one.
  it('takes a text that starts with U+FEFF', () => {
    expect(isStorableText('\u{FEFF}Sao Mai')).toBe(true);
  });
});

describe('stripDiacritics', () => {
  it('writes the text bare: no tone mark, no diacritic, đ as d, the case kept', () => {
    expect(stripDiacritics('Hừng Đông đẹp')).toBe('Hung Dong dep');
    expect(stripDiacritics('NGUYỄN Thị Ánh, ơ ư â ă ê ô')).toBe('NGUYEN Thi Anh, o u a a e o');
  });

  it('reads decomposed (NFD) text as composed text', () => {
    expect(stripDiacritics('Hừng Đông đẹp'.normalize('NFD'))).toBe('Hung Dong dep');
    // "à" typed as "a" + combining grave accent.
    expect(stripDiacritics('Ba\u{300}')).toBe('Ba');
  });

  it('leaves text without marks as it is', () => {
    expect(stripDiacritics('Team 2 - A_b')).toBe('Team 2 - A_b');
    expect(stripDiacritics('')).toBe('');
  });
});

describe('collapseSpaces', () => {
  it('makes each run of white space one space, the ends and the case kept', () => {
    expect(collapseSpaces('  Hai   vợ\tchồng\r\n\u{A0}có 2 Bé ')).toBe(' Hai vợ chồng có 2 Bé ');
  });

  it('composes (NFC), so text typed decomposed compares equal', () => {
    expect(collapseSpaces('vợ chồng'.normalize('NFD'))).toBe('vợ chồng'.normalize('NFC'));
  });
});

describe('toHex', () => {
  it('writes each byte as two lower-case hex digits: 16 bytes are 32 characters', () => {
    const bytes = Uint8Array.from({ length: 16 }, (_, i) => i * 0x11);
    expect(toHex(bytes)).toBe('00112233445566778899aabbccddeeff');
    expect(toHex(new Uint8Array([0, 1, 0xfe, 0xff]))).toBe('0001feff');
    expect(toHex(new Uint8Array())).toBe('');
  });
});
