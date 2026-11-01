import { useEffect, useMemo, useRef, useState, type ReactNode, type Ref } from 'react';
import {
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type ColumnDef,
  type ColumnSort,
  type RowData,
} from '@tanstack/react-table';
import { formatDate } from '@p2c/domain';
import { Button } from './Button';
import { compareCellsThen, type CellKind, type CellValues } from './compare-cells';
import { SHOW_MORE_STEP } from './show-more';
import { sorts, tableView, type ColumnSorting } from './table-view';

interface ColumnBase<Row extends RowData> {
  id: string;
  header: string;
  /** Custom cell content; by default the value itself, dates as dd/mm/yyyy. */
  cell?: (row: Row) => ReactNode;
  align?: 'start' | 'end';
  /** Orders rows whose cells are equal, as plain text (a day's time, 'HH:MM'); empty first. */
  thenBy?: (row: Row) => string;
  /** Extra classes for a row's cell, e.g. a translucent background kept over the row hover. */
  cellClass?: (row: Row) => string;
  /** Width class of the column (`w-21`), on its header: a `fixed` table keeps it. */
  width?: string;
}

/** A column is text, number or date; the kind decides how it sorts and how it is shown. */
export type DataTableColumn<Row extends RowData> = {
  [K in CellKind]: ColumnBase<Row> &
    ColumnSorting & { kind: K; value: (row: Row) => CellValues[K] };
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
  /** The table, then focusable from code: for the focus of a button gone as it opened the table. */
  ref?: Ref<HTMLTableElement>;
  /**
   * Columns keep their `width` whatever their cells hold, and the others share what is left
   * (`table-layout: fixed`), as in a narrow card of the mockups; else columns fit their content.
   */
  fixed?: boolean;
  /** Cells 6 px from the column's edges instead of 10, as in a narrow card of the mockups. */
  compact?: boolean;
}

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

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
    enableSorting: sorts(column),
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
  ref,
  fixed = false,
  compact = false,
}: DataTableProps<Row>) {
  const [limit, setLimit] = useState(SHOW_MORE_STEP);
  const [limitKey, setLimitKey] = useState(resetKey);
  if (limitKey !== resetKey) {
    setLimitKey(resetKey);
    setLimit(SHOW_MORE_STEP);
  }
  // The last "Hiện thêm" takes its button away: the focus goes to the line saying all are shown
  // (DR6-35). A count, so each last click moves it.
  const footLine = useRef<HTMLSpanElement>(null);
  const [allShown, setAllShown] = useState(0);
  useEffect(() => {
    if (allShown > 0) footLine.current?.focus();
  }, [allShown]);
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
  const inset = compact ? 'px-1.5' : 'px-2.5';

  const { headers, visible, foot } = tableView(
    columns,
    (id) => table.getColumn(id)?.getIsSorted() ?? false,
    table.getRowModel().rows,
    limit,
  );

  return (
    <>
      <table
        ref={ref}
        aria-label={label}
        tabIndex={ref ? -1 : undefined}
        className={`w-full border-collapse text-sm ${fixed ? 'table-fixed' : ''}`}
      >
        <thead>
          <tr>
            {headers.map((header) => {
              const { column } = header;
              const sorted = header.kind === 'button' && header.ariaSort !== 'none';
              // A hidden heading is placed absolutely: in a positioned cell it stays inside any
              // scroll box around the table instead of widening the page (DR6-148).
              const hidden = header.kind === 'label' && header.hidden;
              return (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={header.kind === 'button' ? header.ariaSort : undefined}
                  className={`border-b border-border ${inset} py-1.5 text-xs font-semibold tracking-wider whitespace-nowrap uppercase ${
                    sorted ? 'text-fg-2' : 'text-fg-3'
                  } ${align(column)} ${column.width ?? ''} ${hidden ? 'relative' : ''}`}
                >
                  {header.kind === 'button' ? (
                    <button
                      type="button"
                      onClick={table.getColumn(column.id)?.getToggleSortingHandler()}
                      className={`w-full cursor-pointer rounded-sm font-semibold uppercase select-none focus-visible:outline-2 focus-visible:outline-accent ${textAlign(column)}`}
                    >
                      {column.header}{' '}
                      <span
                        aria-hidden="true"
                        className={sorted ? 'text-accent' : 'text-border-control'}
                      >
                        {header.arrow}
                      </span>
                    </button>
                  ) : hidden ? (
                    <span className="sr-only">{column.header}</span>
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
                  className={`border-b border-border ${inset} py-2 align-middle group-last:border-b-0 ${align(column)} ${
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
          <span ref={footLine} tabIndex={-1}>
            {foot.kind === 'more'
              ? moreLabels.shown(foot.shown, foot.total)
              : moreLabels.all(foot.total)}
          </span>
          {foot.kind === 'more' && (
            <Button
              className="ml-auto"
              onClick={() => {
                setLimit(limit + SHOW_MORE_STEP);
                if (foot.shown + foot.next >= foot.total) setAllShown((count) => count + 1);
              }}
            >
              {moreLabels.more(foot.next)}
            </Button>
          )}
        </div>
      )}
    </>
  );
}
