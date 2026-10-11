/**
 * Text matching for V3–V6 (prompts G5 §7). A text is first cleaned (`cleanText`: NFKC, no format
 * characters), then `-` / `_` read as spaces. It is compared in three forms: the original (case kept),
 * the accented form (lower case, each run of white space as one space) and the folded form (accented
 * form without tone marks or diacritics, `đ` → `d`, so "xac suat" is caught).
 */

export interface MatchText {
  readonly original: string;
  readonly accented: string;
  readonly folded: string;
}

/** A blocklist entry: the matched phrase, for the issue detail, or `null`. */
export type Matcher = (text: MatchText) => string | null;

/**
 * G5 §7 item 0: NFKC (`％` → `%`, full-width digits and letters → ASCII), then format characters
 * (U+200B, U+00AD, U+2060…) dropped. Also how a pasted line is read before it is compared with the
 * app's own message (G5 §6a).
 */
export function cleanText(text: string): string {
  return text.normalize('NFKC').replace(/\p{Cf}/gu, '');
}

/** Accented → folded; also folds a pattern or a phrase the same way (G5 §7 item 3). */
export function fold(accented: string): string {
  return accented.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd');
}

export function matchText(text: string): MatchText {
  const original = cleanText(text).replace(/[-_]/g, ' ');
  const accented = original.toLowerCase().replace(/\s+/gu, ' ');
  return { original, accented, folded: fold(accented) };
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
 * A whole-word phrase, written lower case with its diacritics, on the accented form; `folded`:
 * also, folded, on the folded form. Both forms are searched: a lone combining mark is a word
 * boundary in the accented form but is gone from the folded one (review #420). The phrase is read
 * as a text is (`-` is a space), and each space in it matches one space or none (G5 §7 item 4).
 */
export function phrase(words: string, folded: boolean): Matcher {
  const source = matchText(words).accented.split(' ').map(escape).join(' ');
  const found = pattern(`${WORD_START}${source}${WORD_END}`, folded ? 'both' : 'accented');
  return (text) => (found(text) === null ? null : words);
}

/**
 * A pattern on the accented form, also on the folded form with the pattern folded (`both`), or on
 * the original text with its case (`original`). A space in the pattern matches one space or none
 * (G5 §7 item 5).
 */
export function pattern(source: string, on: 'accented' | 'both' | 'original'): Matcher {
  const spaced = source.replaceAll(' ', ' ?');
  const regex = new RegExp(spaced, 'u');
  if (on === 'original') return (text) => regex.exec(text.original)?.[0] ?? null;
  const foldedRegex = on === 'both' ? new RegExp(fold(spaced), 'u') : null;
  return (text) => (regex.exec(text.accented) ?? foldedRegex?.exec(text.folded))?.[0] ?? null;
}
