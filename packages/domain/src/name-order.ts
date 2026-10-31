const collator = new Intl.Collator('vi', { numeric: true });

/** A decimal digit of a script other than ASCII: full-width "２", Arabic-Indic "٢"… */
const OTHER_DIGIT = /(?![0-9])\p{Nd}/gu;

/**
 * ASCII, Latin letters and combining marks: a name of these alone (every Vietnamese one) has no
 * other digit, so it is its own key, with no replace, and the keys kept hold no copy of it.
 */
export const LATIN = /^[\0-\u{24F}\u{1E00}-\u{1EFF}\p{M}]*$/u;

const digitValues = new Map<string, string>();

/**
 * The ASCII digit of `digit`. Unicode encodes the digits 0–9 of each script as ten code points in a
 * row, so a run of digits starts at a 0 and the value is the distance from that start, in tens.
 */
function asciiDigit(digit: string): string {
  let value = digitValues.get(digit);
  if (value === undefined) {
    const code = digit.codePointAt(0)!;
    let start = code;
    while (/\p{Nd}/u.test(String.fromCodePoint(start - 1))) start--;
    value = String((code - start) % 10);
    digitValues.set(digit, value);
  }
  return value;
}

/**
 * The one order of names on every screen (DR-48, DR-88): Vietnamese collation, so "Đ…" comes after
 * "D…" and not after "Z", and the numbers inside a name by value ("Team 2" before "Team 10"). Each
 * decimal digit reads as an ASCII one first: the collation goes round on names mixing them ("01 2"
 * before "0１a", before "0A", before "01 2"), and a sort then followed the order the names came in
 * (Owner 23/10/2026, T-291). Only the same name ties, so a list sorted by default and one sorted
 * by a click agree: names that compare the same, a number written two ways ("Team 01", "Team 1",
 * "Team ２"), go by code unit (DR6-112).
 */
export function byName(a: string, b: string): number {
  return collator.compare(keyOf(a), keyOf(b)) || (a < b ? -1 : a > b ? 1 : 0);
}

/**
 * The names sorted, each with its key: the name as the collator reads it, each digit ASCII. A sort
 * reads a name about log₂ n times, and working its key out each time made sorting the 10 255
 * appointments of the load data by customer seven times as long (DR6-136). The screens sort a few
 * thousand names at a time; past `MAX_KEYS` the keys start again, so those of data no longer open
 * do not stay.
 */
const keys = new Map<string, string>();
const MAX_KEYS = 20_000;

function keyOf(name: string): string {
  let key = keys.get(name);
  if (key === undefined) {
    if (keys.size >= MAX_KEYS) keys.clear();
    key = LATIN.test(name) ? name : name.replace(OTHER_DIGIT, asciiDigit);
    keys.set(name, key);
  }
  return key;
}
