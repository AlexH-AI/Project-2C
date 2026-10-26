import { describe, expect, it } from 'vitest';
import { SHOW_MORE_STEP } from './show-more';
import { tableView, type ColumnSorting } from './table-view';

// @ts-expect-error Only a column that does not sort may hide its header.
const hiddenButSorts: ColumnSorting = { headerHidden: true };
void hiddenButSorts;

const name = { id: 'name' };
const date = { id: 'date', sortable: true as const };
const note = { id: 'note', sortable: false as const };
const actions = { id: 'actions', sortable: false as const, headerHidden: true };

const rows = (count: number) => Array.from({ length: count }, (_, index) => index);
const unsorted = () => false as const;

describe('tableView', () => {
  it('makes the header of a column that sorts a button, ↕ while the table is not sorted by it', () => {
    expect(tableView([name, date], unsorted, rows(3), SHOW_MORE_STEP).headers).toEqual([
      { column: name, kind: 'button', ariaSort: 'none', arrow: '↕' },
      { column: date, kind: 'button', ariaSort: 'none', arrow: '↕' },
    ]);
  });

  it('says how the table is sorted on the sorted column only: ↑ ascending, ↓ descending', () => {
    const ways = [
      ['asc', 'ascending', '↑'],
      ['desc', 'descending', '↓'],
    ] as const;
    for (const [way, ariaSort, arrow] of ways) {
      const sorted = (id: string) => id === 'date' && way;
      expect(tableView([name, date], sorted, rows(3), SHOW_MORE_STEP).headers).toEqual([
        { column: name, kind: 'button', ariaSort: 'none', arrow: '↕' },
        { column: date, kind: 'button', ariaSort, arrow },
      ]);
    }
  });

  it('keeps the header of sortable: false text, with no aria-sort or arrow, whatever the sort', () => {
    for (const sorted of [unsorted, () => 'asc' as const]) {
      expect(tableView([note], sorted, rows(3), SHOW_MORE_STEP).headers).toEqual([
        { column: note, kind: 'label', hidden: false },
      ]);
    }
  });

  it('shows the header of a column that does not sort to screen readers only, with headerHidden', () => {
    expect(tableView([actions], unsorted, rows(3), SHOW_MORE_STEP).headers).toEqual([
      { column: actions, kind: 'label', hidden: true },
    ]);
  });

  it('keeps the headers of an empty table, sort buttons included, with no row and no foot', () => {
    expect(tableView([name, actions], unsorted, [], SHOW_MORE_STEP)).toEqual({
      headers: [
        { column: name, kind: 'button', ariaSort: 'none', arrow: '↕' },
        { column: actions, kind: 'label', hidden: true },
      ],
      visible: [],
      foot: { kind: 'none' },
    });
  });

  it('shows the rows as sorted, cut to the hundreds asked for, with the foot under them', () => {
    const sorted = rows(250).reverse();
    expect(tableView([name], unsorted, sorted, 200)).toMatchObject({
      visible: sorted.slice(0, 200),
      foot: { kind: 'more', shown: 200, total: 250, next: 50 },
    });
  });
});
