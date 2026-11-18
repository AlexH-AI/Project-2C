import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DataTable, type DataTableColumn } from '@p2c/ui';

interface Row {
  id: string;
  name: string;
}

const columns: ReadonlyArray<DataTableColumn<Row>> = [
  { id: 'name', header: 'Họ tên', kind: 'text', value: (row) => row.name },
  {
    id: 'actions',
    header: 'Thao tác',
    headerHidden: true,
    kind: 'text',
    sortable: false,
    value: () => '',
  },
];

// `@p2c/ui` has no react-dom of its own, so its markup is checked from the app.
const table = (selectedId?: string) =>
  renderToStaticMarkup(
    <DataTable
      label="Thành viên"
      columns={columns}
      rows={[
        { id: 'an', name: 'An' },
        { id: 'binh', name: 'Bình' },
      ]}
      getRowId={(row) => row.id}
      {...(selectedId === undefined ? {} : { selectedId })}
      moreLabels={{ shown: () => '', more: () => '', all: () => '' }}
    />,
  );

describe('DataTable', () => {
  it('positions the header cell of a hidden heading, which then stays inside any scroll box', () => {
    const cell = /<th[^>]*class="([^"]*)"[^>]*><span class="sr-only">Thao tác<\/span><\/th>/.exec(
      table(),
    );
    expect(cell?.[1]?.split(/\s+/)).toContain('relative');
  });

  it('marks the row of `selectedId` as the current one, and no row without it (L21)', () => {
    const current = (markup: string) =>
      [...markup.matchAll(/<tr[^>]*aria-current="true"[^>]*>.*?<\/tr>/g)].map(([row]) =>
        row.replace(/<[^>]*>/g, ''),
      );
    expect(current(table('binh'))).toEqual(['Bình']);
    expect(current(table())).toEqual([]);
  });
});
