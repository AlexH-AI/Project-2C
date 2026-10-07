import { byName, compareDates, type CalendarDate } from '@p2c/domain';

/** What a sortable column holds. Dates are calendar days shown as dd/mm/yyyy. */
export interface CellValues {
  text: string;
  number: number;
  date: CalendarDate;
}

export type CellKind = keyof CellValues;

const COMPARE: { [K in CellKind]: (a: CellValues[K], b: CellValues[K]) => number } = {
  text: byName,
  number: (a, b) => a - b,
  date: compareDates,
};

/**
 * Sort order of two cells of the same kind: text by `byName` of domain, the order the lists show
 * before a click (DR-88), dates by time.
 */
export function compareCells<K extends CellKind>(kind: K, a: CellValues[K], b: CellValues[K]) {
  return COMPARE[kind](a, b);
}

/**
 * Like `compareCells`, then the tie-break texts when the cells are equal (the time of a day);
 * an empty tie-break sorts first.
 */
export function compareCellsThen<K extends CellKind>(
  kind: K,
  a: CellValues[K],
  b: CellValues[K],
  thenA = '',
  thenB = '',
) {
  return compareCells(kind, a, b) || (thenA < thenB ? -1 : thenA > thenB ? 1 : 0);
}
