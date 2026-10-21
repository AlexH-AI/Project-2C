const collator = new Intl.Collator('vi', { numeric: true });

/**
 * The one order of names on every screen (DR-48, DR-88): Vietnamese collation, so "Đ…" comes after
 * "D…" and not after "Z", and the numbers inside a name by value ("Team 2" before "Team 10").
 * Only the same name ties, so a list sorted by default and one sorted by a click agree: names the
 * collation ties, a number written two ways ("Team 01", "Team 1", "Team ２"), go by code unit
 * (DR6-112).
 */
export function byName(a: string, b: string): number {
  return collator.compare(a, b) || (a < b ? -1 : a > b ? 1 : 0);
}
