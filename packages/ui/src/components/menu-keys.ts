/**
 * Where a key takes the focus in a menu of `count` rows, from row `at` (-1: on no row): ↓ and ↑ go
 * to the next and the previous row, around the ends; Home and End to the first and the last.
 * Null for any other key, and in a menu with no row.
 */
export function menuMove(key: string, at: number, count: number): number | null {
  if (count === 0) return null;
  switch (key) {
    case 'ArrowDown':
      return (at + 1) % count;
    case 'ArrowUp':
      return at <= 0 ? count - 1 : at - 1;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
}
