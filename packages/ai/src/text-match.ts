/**
 * Text matching for V3–V6 (prompts G5 §7). A text is first cleaned (`cleanText`: no invisible
 * character, NFKC), then `-` / `_` read as spaces. It is compared in two forms: the original (case
 * kept) and the accented form (lower case, each run of white space as one space). An entry whose
 * "Bỏ dấu" column says "có" also matches its words written bare (no tone mark, no diacritic, `đ` as
 * `d`), word by word: "Xác suat" is caught, "nghĩ định" is not "nghị định" (G5 §7 item 2, DR6-23).
 */
import { normalizeText } from '@p2c/domain';

export interface MatchText {
  readonly original: string;
  readonly accented: string;
}

/** A blocklist entry: the matched phrase, for the issue detail, or `null`. */
export type Matcher = (text: MatchText) => string | null;

/**
 * G5 §7 item 0: the invisible characters K20 drops (format and default-ignorable characters, the
 * blank Braille pattern) and each run of white space as one space (`normalizeText`), then NFKC
 * (`％` → `%`, full-width digits and letters → ASCII). Invisible characters go first, so a mark
 * written after one still composes with its letter (DR6-17). Also how a pasted line is read before
 * it is compared with the app's own message (G5 §6a).
 */
export function cleanText(text: string): string {
  return normalizeText(text).normalize('NFKC');
}

/** A word as written bare: no tone mark, no diacritic, `đ` → `d` (G5 §7 item 2). */
export function fold(accented: string): string {
  return accented.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd');
}

export function matchText(text: string): MatchText {
  const original = cleanText(text).replace(/[-_]/g, ' ');
  return { original, accented: original.toLowerCase().replace(/\s+/gu, ' ') };
}

/**
 * Word boundaries of G5 §7 item 4: no letter or digit (Unicode) right before / after. JavaScript's
 * `\b` only knows ASCII letters, so it is wrong next to "đ", "ề"…
 */
export const WORD_START = String.raw`(?<![\p{L}\p{N}])`;
export const WORD_END = String.raw`(?![\p{L}\p{N}])`;

const escape = (phrase: string) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** A character anywhere in the text. */
export function char(c: string): Matcher {
  return (text) => (text.original.includes(c) ? c : null);
}

/**
 * A whole-word phrase, written lower case with its diacritics, on the accented form; `folded`: its
 * words may also be written bare. A lone combining mark is a word boundary in the accented form
 * (review #420). The phrase is read as a text is (`-` is a space), and each space in it matches one
 * space or none (G5 §7 item 4).
 */
export function phrase(words: string, folded: boolean): Matcher {
  const source = matchText(words).accented.split(' ').map(escape).join(' ');
  const found = pattern(`${WORD_START}${source}${WORD_END}`, folded ? 'both' : 'accented');
  return (text) => (found(text) === null ? null : words);
}

/**
 * A pattern on the accented form, also with each of its words written bare (`both`), or on the
 * original text with its case (`original`). A space in the pattern matches one space or none
 * (G5 §7 item 5).
 */
export function pattern(source: string, on: 'accented' | 'both' | 'original'): Matcher {
  const spaced = source.replaceAll(' ', ' ?');
  const regex = new RegExp(on === 'both' ? bareToo(spaced) : spaced, 'u');
  return (text) => regex.exec(on === 'original' ? text.original : text.accented)?.[0] ?? null;
}

/** An escape (`\p{Nd}`, `\s`…) or a class (`[a-zđ]`, `[\p{L}\p{N}]`), kept whole; or a word. */
const TOKEN = /\\(?:[pP]\{[^}]*\}|.)|\[(?:\\(?:[pP]\{[^}]*\}|.)|[^\]\\])*\]|\p{L}+/gsu;

/**
 * `source` with each word outside escapes and classes matching itself or its bare form, so
 * `xác ?suất` reads `(?:xác|xac) ?(?:suất|suat)`: a word with other marks matches neither (G5 §7
 * item 2). A class keeps its letters: the bare ones are in it already (`[a-zđ]`).
 */
function bareToo(source: string): string {
  return source.replace(TOKEN, (token) => {
    if (!/^\p{L}/u.test(token)) return token;
    const bare = fold(token);
    return bare === token ? token : `(?:${token}|${bare})`;
  });
}
