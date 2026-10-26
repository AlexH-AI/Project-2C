import { showMore, type ShowMoreFoot } from './show-more';

/**
 * How a column sorts. Every column does (ADR-0013) unless it says `sortable: false`, and only such
 * a column may hide its header.
 */
export type ColumnSorting =
  | { sortable?: true; headerHidden?: never }
  | {
      sortable: false;
      /** Its header for screen readers only, e.g. over a column of buttons. */
      headerHidden?: boolean;
    };

/** How the table is sorted by a column now, as TanStack says (`getIsSorted`). */
type Sorted = false | 'asc' | 'desc';

/**
 * The header of `column`: a button that sorts, its `aria-sort` and arrow saying how the table is
 * sorted by it now, or the text of a column that does not sort.
 */
type HeaderCell<Column> = { column: Column } & (
  | { kind: 'sort'; ariaSort: 'none' | 'ascending' | 'descending'; arrow: '↕' | '↑' | '↓' }
  | { kind: 'text'; hidden: boolean }
);

const SORT_STATE = {
  none: { ariaSort: 'none', arrow: '↕' },
  asc: { ariaSort: 'ascending', arrow: '↑' },
  desc: { ariaSort: 'descending', arrow: '↓' },
} as const;

/** Whether the table sorts by `column`: unless it says `sortable: false`. */
export const sorts = (column: ColumnSorting) => column.sortable !== false;

/**
 * What a table shows: a header per column, then its rows, sorted already, cut to the hundreds
 * asked for, with the foot under them (`showMore`).
 */
export function tableView<Column extends ColumnSorting & { id: string }, Row>(
  columns: readonly Column[],
  sortedBy: (id: string) => Sorted,
  rows: readonly Row[],
  limit: number,
): { headers: HeaderCell<Column>[]; visible: readonly Row[]; foot: ShowMoreFoot } {
  return {
    headers: columns.map((column) =>
      sorts(column)
        ? { column, kind: 'sort', ...SORT_STATE[sortedBy(column.id) || 'none'] }
        : { column, kind: 'text', hidden: column.headerHidden ?? false },
    ),
    ...showMore(rows, limit),
  };
}
