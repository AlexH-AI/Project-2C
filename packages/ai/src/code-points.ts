/**
 * Lengths in characters as Rust and `db` count them: by code point, so an emoji is one and is never
 * cut in two. Unlike `Array.from(text)`, nothing here allocates by the size of the text, and a check
 * against a limit stops at the limit (DR5-09): a 20-million-character paste costs what one at the
 * limit does.
 */

/** The number of code points of `text`; a lone surrogate is one, as Rust reads it. */
export function codePointCount(text: string): number {
  let count = text.length;
  for (let at = 0; at < text.length - 1; at++) {
    if (isPairAt(text, at)) {
      count--;
      at++;
    }
  }
  return count;
}

/** Whether `text` has more than `max` code points; reads at most `2 × max` code units of it. */
export function codePointsOver(text: string, max: number): boolean {
  // A code point is one or two code units.
  if (text.length <= max) return false;
  if (text.length > 2 * max) return true;
  return cutAt(text, max) < text.length;
}

/** The first `max` code points of `text`. */
export function cutCodePoints(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, cutAt(text, max));
}

/** The code-unit index right after the first `max` code points of `text`. */
function cutAt(text: string, max: number): number {
  let at = 0;
  for (let count = 0; count < max && at < text.length; count++) at += isPairAt(text, at) ? 2 : 1;
  return at;
}

/** A high surrogate at `at` followed by a low one: one code point in two code units. */
function isPairAt(text: string, at: number): boolean {
  const high = text.charCodeAt(at);
  const low = text.charCodeAt(at + 1);
  return high >= 0xd800 && high <= 0xdbff && low >= 0xdc00 && low <= 0xdfff;
}
