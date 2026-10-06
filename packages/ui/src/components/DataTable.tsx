import { useMemo, useState, type ReactNode } from 'react';
import {
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type ColumnDef,
  type ColumnSort,
  type RowData,
  type SortDirection,
} from '@tanstack/react-table';
import { formatDate } from '@p2c/domain';
import { Button } from './Button';
import { compareCellsThen, type CellKind, type CellValues } from './compare-cells';
import { SHOW_MORE_STEP, showMore } from './show-more';

interface ColumnBase<Row extends RowData> {
  id: string;
  header: string;
  /** Custom cell content; by default the value itself, dates as dd/mm/yyyy. */
  cell?: (row: Row) => ReactNode;
  align?: 'start' | 'end';
  /** Defaults to true (ADR-0013: every column sorts). */
  sortable?: boolean;
  /** Orders rows whose cells are equal, as plain text (a day's time, 'HH:MM'); empty first. */
  thenBy?: (row: Row) => string;
  /** Extra classes for a row's cell, e.g. a translucent background kept over the row hover. */
  cellClass?: (row: Row) => string;
}

/** A column is text, number or date; the kind decides how it sorts and how it is shown. */
export type DataTableColumn<Row extends RowData> = {
  [K in CellKind]: ColumnBase<Row> & { kind: K; value: (row: Row) => CellValues[K] };
}[CellKind];

export type DataTableSort = ColumnSort;

/** Words of the foot under a table of over a hundred rows, from the app's i18n. */
export interface DataTableMoreLabels {
  /** "Đang hiện 100 / 7.071 lịch" */
  shown: (shown: number, total: number) => string;
  /** "Hiện thêm 100 lịch" */
  more: (count: number) => string;
  /** "Đã hiện hết 7.071 lịch" */
  all: (total: number) => string;
}

interface DataTableProps<Row extends RowData> {
  /** Accessible name of the table. */
  label: string;
  columns: ReadonlyArray<DataTableColumn<Row>>;
  /** Keep the array stable between renders (state or memo), or sorting is recomputed. */
  rows: readonly Row[];
  getRowId?: (row: Row, index: number) => string;
  initialSort?: DataTableSort;
  moreLabels: DataTableMoreLabels;
  /** Back to the first hundred rows when this changes (period, filters); a sort keeps the count. */
  resetKey?: string;
}

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const;
const ARROW = { asc: '↑', desc: '↓' } as const;

function defaultCell<Row extends RowData>(column: DataTableColumn<Row>, row: Row): ReactNode {
  return column.kind === 'date' ? formatDate(column.value(row)) : column.value(row);
}

function toColumnDef<Row extends RowData>(
  column: DataTableColumn<Row>,
): ColumnDef<typeof features, Row> {
  return {
    id: column.id,
    header: column.header,
    accessorFn: (row: Row) => column.value(row),
    enableSorting: column.sortable ?? true,
    sortFn: (a, b, id) =>
      compareCellsThen(
        column.kind,
        a.getValue(id),
        b.getValue(id),
        column.thenBy?.(a.original),
        column.thenBy?.(b.original),
      ),
  };
}

/**
 * Sortable table (ADR-0013, TanStack Table). A header click cycles none → ↑ → ↓; one column is
 * sorted at a time. Dates sort by time, text by Vietnamese collation. It shows the first hundred
 * rows of the whole sorted list, and a hundred more on each "Hiện thêm" (T-150).
 */
export function DataTable<Row extends RowData>({
  label,
  columns,
  rows,
  getRowId,
  initialSort,
  moreLabels,
  resetKey,
}: DataTableProps<Row>) {
  const [limit, setLimit] = useState(SHOW_MORE_STEP);
  const [limitKey, setLimitKey] = useState(resetKey);
  if (limitKey !== resetKey) {
    setLimitKey(resetKey);
    setLimit(SHOW_MORE_STEP);
  }
  const columnDefs = useMemo(() => columns.map(toColumnDef), [columns]);
  const table = useTable({
    features,
    columns: columnDefs,
    // TanStack types `data` as mutable but only reads it.
    data: rows as Row[],
    getRowId,
    initialState: { sorting: initialSort ? [initialSort] : [] },
    enableMultiSort: false,
    enableSortingRemoval: true,
    sortDescFirst: false,
  });

  const textAlign = (column: DataTableColumn<Row>) =>
    column.align === 'end' ? 'text-right' : 'text-left';
  const align = (column: DataTableColumn<Row>) =>
    `${textAlign(column)} ${column.kind === 'text' ? '' : 'tabular-nums'}`;

  const { visible, foot } = showMore(table.getRowModel().rows, limit);

  return (
    <>
      <table aria-label={label} className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {columns.map((column) => {
              const sortable = table.getColumn(column.id);
              const sorted: false | SortDirection = sortable?.getIsSorted() ?? false;
              const canSort = sortable?.getCanSort() ?? false;
              return (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={canSort ? (sorted ? ARIA_SORT[sorted] : 'none') : undefined}
                  className={`border-b border-border px-2.5 py-1.5 text-xs font-semibold tracking-wider whitespace-nowrap uppercase ${
                    sorted ? 'text-fg-2' : 'text-fg-3'
                  } ${align(column)}`}
                >
                  {canSort ? (
                    <button
                      type="button"
                      onClick={sortable?.getToggleSortingHandler()}
                      className={`w-full cursor-pointer rounded-sm font-semibold uppercase select-none focus-visible:outline-2 focus-visible:outline-accent ${textAlign(column)}`}
                    >
                      {column.header}{' '}
                      <span
                        aria-hidden="true"
                        className={sorted ? 'text-accent' : 'text-border-strong'}
                      >
                        {sorted ? ARROW[sorted] : '↕'}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {visible.map((row) => (
            <tr key={row.id} className="group hover:bg-surface-2">
              {columns.map((column) => (
                <td
                  key={column.id}
                  className={`border-b border-border px-2.5 py-2 align-middle group-last:border-b-0 ${align(column)} ${
                    column.cellClass?.(row.original) ?? ''
                  }`}
                >
                  {column.cell ? column.cell(row.original) : defaultCell(column, row.original)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {foot.kind !== 'none' && (
        <div className="flex items-center gap-3 px-2.5 pt-3 pb-1 text-sm text-fg-2 tabular-nums">
          <span>
            {foot.kind === 'more'
              ? moreLabels.shown(foot.shown, foot.total)
              : moreLabels.all(foot.total)}
          </span>
          {foot.kind === 'more' && (
            <Button className="ml-auto" onClick={() => setLimit(limit + SHOW_MORE_STEP)}>
              {moreLabels.more(foot.next)}
            </Button>
          )}
        </div>
      )}
    </>
  );
}
