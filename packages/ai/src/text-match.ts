/**
 * Text matching for V3–V6 (prompts G5 §7). A text is compared in three forms: the original (NFC,
 * case kept), the accented form (NFC, lower case, each run of white space as one space) and the
 * folded form (accented form without tone marks or diacritics, `đ` → `d`, so "xac suat" is caught).
 */

export interface MatchText {
  readonly original: string;
  readonly accented: string;
  readonly folded: string;
}

/** A blocklist entry: the matched phrase, for the issue detail, or `null`. */
export type Matcher = (text: MatchText) => string | null;

/** Accented → folded; also folds a pattern or a phrase the same way (G5 §7 item 3). */
export function fold(accented: string): string {
  return accented.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd');
}

export function matchText(text: string): MatchText {
  const original = text.normalize('NFC');
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
 * A whole-word phrase, written lower case with its diacritics. `folded`: also caught without
 * diacritics. The folded form of a matching accented text always holds the folded phrase, so only
 * that form is searched.
 */
export function phrase(words: string, folded: boolean): Matcher {
  const source = `${WORD_START}${escape(folded ? fold(words) : words)}${WORD_END}`;
  const regex = new RegExp(source, 'u');
  return (text) => (regex.test(folded ? text.folded : text.accented) ? words : null);
}

/**
 * A pattern on the accented form, also on the folded form with the pattern folded (`both`), or on
 * the original text with its case (`original`).
 */
export function pattern(source: string, on: 'accented' | 'both' | 'original'): Matcher {
  const regex = new RegExp(source, 'u');
  const foldedRegex = new RegExp(fold(source), 'u');
  return (text) => {
    if (on === 'original') return regex.exec(text.original)?.[0] ?? null;
    const match =
      regex.exec(text.accented) ?? (on === 'both' ? foldedRegex.exec(text.folded) : null);
    return match?.[0] ?? null;
  };
}
