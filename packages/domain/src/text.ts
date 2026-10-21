/**
 * Typed text as stored (DR-49, DR6-49): text the screens show the same is the same text, and text
 * with nothing to see is empty. Names and KYC values are one line; a KYC note keeps its line breaks
 * (Owner 16/10/2026, T-243). The commands, the backup import and the screens' empty checks all read
 * text through these.
 */

/**
 * Whether the database can store the text as it is: no NUL, which SQLite would cut it at, and no
 * lone surrogate half, which would be stored as U+FFFD.
 */
export function isStorableText(text: string): boolean {
  return !text.includes('\0') && !/\p{Cs}/u.test(text);
}

/**
 * What shows nothing: format characters such as U+200B, U+2060, U+FEFF; the other default-ignorable
 * ones such as the Hangul fillers, U+034F and the variation selectors; the blank Braille pattern
 * U+2800 (DR6-72); the control characters that are not white space (DR6-111). Not NUL, which
 * `isStorableText` refuses: a screen then says what the command does.
 */
const INVISIBLE =
  /[\p{Cf}\p{Default_Ignorable_Code_Point}\u{2800}]|(?![\0\p{White_Space}])\p{Cc}/gu;

/**
 * One line of typed text — a name, a KYC value — as stored: invisible characters dropped, each run
 * of Unicode white space (NBSP, tab, line break, U+0085…) one space, composed (NFC, not NFKC: typed
 * Vietnamese may arrive decomposed, and "m²" stays as typed) and trimmed. Invisible characters go
 * first, so one between a letter and its tone mark does not keep them apart.
 */
export function normalizeText(text: string): string {
  return text
    .replace(INVISIBLE, '')
    .replace(/\p{White_Space}+/gu, ' ')
    .normalize('NFC')
    .trim();
}

/**
 * A note as stored: each line as `normalizeText` keeps it, the line breaks kept — CR, LF and the
 * Unicode line separators U+0085, U+2028, U+2029; no blank line at either end.
 */
export function normalizeNote(text: string): string {
  return text
    .split(/\r\n?|[\n\u{85}\u{2028}\u{2029}]/u)
    .map(normalizeText)
    .join('\n')
    .trim();
}
