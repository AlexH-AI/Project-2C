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
 * One line of typed text — a name, a KYC value — as stored: format characters dropped (U+200B,
 * U+2060, U+FEFF…: invisible), each run of white space (NBSP, tab, line break…) one space, composed
 * (NFC: typed Vietnamese may arrive decomposed) and trimmed. Format characters go first, so one
 * between a letter and its tone mark does not keep them apart.
 */
export function normalizeText(text: string): string {
  return text
    .replace(/\p{Cf}/gu, '')
    .replace(/\s+/gu, ' ')
    .normalize('NFC')
    .trim();
}

/**
 * A note as stored: each line as `normalizeText` keeps it, the line breaks kept; no blank line at
 * either end.
 */
export function normalizeNote(text: string): string {
  return text
    .split(/\r\n?|\n/)
    .map(normalizeText)
    .join('\n')
    .trim();
}
