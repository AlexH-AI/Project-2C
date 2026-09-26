import { compareDates, type CalendarDate } from '@p2c/domain';

/** What a sortable column holds. Dates are calendar days shown as dd/mm/yyyy. */
export interface CellValues {
  text: string;
  number: number;
  date: CalendarDate;
}

export type CellKind = keyof CellValues;

const collator = new Intl.Collator('vi', { sensitivity: 'base', numeric: true });

const COMPARE: { [K in CellKind]: (a: CellValues[K], b: CellValues[K]) => number } = {
  text: collator.compare,
  number: (a, b) => a - b,
  date: compareDates,
};

/** Sort order of two cells of the same kind: text by Vietnamese collation, dates by time. */
export function compareCells<K extends CellKind>(kind: K, a: CellValues[K], b: CellValues[K]) {
  return COMPARE[kind](a, b);
}
