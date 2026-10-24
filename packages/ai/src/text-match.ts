/**
 * Text matching for V3–V6 (prompts G5 §7). A text is first cleaned (`cleanText`: no invisible
 * character, NFKC, a stray mark as a space), then `-` / `_` read as spaces. It is compared in two
 * forms: the original (case kept) and the accented form (lower case, each run of white space as one
 * space). An entry whose "Bỏ dấu" column says "có" also matches its words written bare (no tone
 * mark, no diacritic, `đ` as `d`), word by word: "Xác suat" is caught, "nghĩ định" is not "nghị
 * định" (G5 §7 item 2, DR6-23); a word whose bare form is a word too, only in a phrase all bare
 * ("khach am" is "khách ấm", "khách am hiểu" is not: DR6-124). What an entry finds is a span of the
 * text as written, which the issue quotes (review #420).
 */
import { normalizeText, stripDiacritics } from '@p2c/domain';

export interface MatchText {
  /** The text cleaned (`cleanText`): what an issue quotes. */
  readonly written: string;
  /** `written` with `-` and `_` as spaces, its indexes the same: the "bản gốc" of G5 §7 item 0. */
  readonly original: string;
  readonly accented: string;
}

/** Where a blocklist entry is found: `[start, end)` of `written`, and of `original`. */
export interface Span {
  readonly start: number;
  readonly end: number;
}

/** A blocklist entry: where it is first found in a text, or `null`. */
export type Matcher = (text: MatchText) => Span | null;

/** The letters a Vietnamese mark sits on (G5 §7 item 0). */
const VOWEL = /[aeiouyAEIOUY]/;

/**
 * G5 §7 item 0: the invisible characters K20 drops (format, default-ignorable and control
 * characters but NUL, the blank Braille pattern) and each run of white space as one space
 * (`normalizeText`), then NFKC (`％` → `%`, full-width digits and letters → ASCII). Invisible
 * characters go first, so a mark written after one still composes with its letter (DR6-17). A
 * combining mark on no vowel, decomposed (after a consonant, a digit, a space, a sign or at the
 * start), reads as a space: it was typed or copied wrong, and the words around it are found as
 * they are (§12.2, DR6-122). Also how a pasted line is read before it is compared with the app's
 * own message (G5 §6a).
 */
export function cleanText(text: string): string {
  return normalizeText(text)
    .normalize('NFKD')
    .replace(/\p{M}+/gu, (marks, at: number, all: string) =>
      VOWEL.test(all.charAt(at - 1)) ? marks : ' ',
    )
    .normalize('NFC')
    .replace(/\p{White_Space}+/gu, ' ')
    .trim();
}

export function matchText(text: string): MatchText {
  const written = cleanText(text);
  const original = written.replace(/[-_]/g, ' ');
  return { written, original, accented: original.toLowerCase().replace(/\s+/gu, ' ') };
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
  return ({ original }) => {
    const start = original.indexOf(c);
    return start === -1 ? null : { start, end: start + c.length };
  };
}

/**
 * A whole-word phrase, written lower case with its diacritics, on the accented form; `folded`: its
 * words may also be written bare. A lone combining mark is a word boundary in the accented form
 * (review #420). The phrase is read as a text is (`-` is a space), and each space in it matches one
 * space or none (G5 §7 item 4).
 */
export function phrase(words: string, folded: boolean): Matcher {
  const parts = matchText(words).accented.split(' ').map(escape);
  const source = folded ? bareOrNot(parts) : parts.join(' ');
  return pattern(`${WORD_START}${source}${WORD_END}`, 'accented');
}

/**
 * The closed list of G5 §7 item 2 (§12.4, DR6-124): words whose bare form is a word written right
 * too ("am", "lanh", "noi", "it"). Adding one goes through G5.
 */
const BARE_IS_A_WORD: readonly string[] = ['ấm', 'lạnh', 'nội', 'ít'];

/**
 * The words of a "Bỏ dấu: có" phrase, each as it is or bare (G5 §7 item 2); a word of the closed
 * list as it is only, unless the whole phrase is bare: "khách am hiểu" is not "khách ấm".
 */
function bareOrNot(parts: readonly string[]): string {
  const listed = (part: string) => BARE_IS_A_WORD.includes(part);
  const mixed = parts.map((part) => (listed(part) ? part : bareToo(part))).join(' ');
  return parts.some(listed) ? `(?:${mixed}|${parts.map(stripDiacritics).join(' ')})` : mixed;
}

/**
 * A pattern on the accented form, also with each of its words written bare (`both`), or on the
 * original text with its case (`original`). A space in the pattern matches one space or none
 * (G5 §7 item 5).
 */
export function pattern(source: string, on: 'accented' | 'both' | 'original'): Matcher {
  const spaced = source.replaceAll(' ', ' ?');
  const regex = new RegExp(on === 'both' ? bareToo(spaced) : spaced, 'u');
  return ({ original, accented }) => {
    const found = regex.exec(on === 'original' ? original : accented);
    if (found === null) return null;
    const span = { start: found.index, end: found.index + found[0].length };
    return on === 'original' ? span : inOriginal(original, span);
  };
}

/**
 * Where `span` of the accented form is in the original: lower case writes "İ" as two code units,
 * and a run of spaces is one space there, so the indexes of the two may part. A letter partly in
 * `span` counts whole.
 */
function inOriginal(original: string, { start, end }: Span): Span {
  const found = { start: 0, end: 0 };
  // Where the code points read so far end in the accented form.
  let accented = 0;
  for (let at = 0; at < original.length && accented < end;) {
    const c = String.fromCodePoint(original.codePointAt(at)!);
    accented += c === ' ' && original[at - 1] === ' ' ? 0 : c.toLowerCase().length;
    at += c.length;
    if (accented <= start) found.start = at;
    found.end = at;
  }
  return found;
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
    const bare = stripDiacritics(token);
    return bare === token ? token : `(?:${token}|${bare})`;
  });
}
