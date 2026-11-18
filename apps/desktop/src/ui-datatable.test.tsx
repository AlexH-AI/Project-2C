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

describe('DataTable with no row', () => {
  const empty = (note?: string) =>
    renderToStaticMarkup(
      <DataTable
        label="Thành viên"
        columns={columns}
        rows={[]}
        {...(note === undefined ? {} : { empty: <b>{note}</b> })}
        moreLabels={{ shown: () => '', more: () => '', all: () => '' }}
      />,
    );

  // VA3c (components.html 09): an empty table keeps its headers, so one sees what it holds.
  it('keeps its headers over one row holding what the app says of it, across every column', () => {
    const html = empty('Team chưa có RM.');
    expect(html).toContain('<th scope="col"');
    expect(html.match(/<tr/g)).toHaveLength(2);
    expect(html).toMatch(/<tbody><tr><td colSpan="2"[^>]*><b>Team chưa có RM\.<\/b><\/td><\/tr>/);
  });

  it('has no row at all when the app says nothing of it', () => {
    expect(empty()).toContain('<tbody></tbody>');
  });
});

describe('DataTable numbers', () => {
  interface Count {
    id: string;
    met: number;
  }
  const counts: ReadonlyArray<DataTableColumn<Count>> = [
    { id: 'id', header: 'RM', kind: 'text', value: (row) => row.id },
    { id: 'met', header: 'Đã gặp', kind: 'number', align: 'end', value: (row) => row.met },
  ];

  // components.html 05 (`.tbl td.zero`): a zero is written lighter, so the figures stand out (L201).
  it('writes a zero of a number column lighter than the other figures', () => {
    const html = renderToStaticMarkup(
      <DataTable
        label="Chỉ số"
        columns={counts}
        rows={[
          { id: '0', met: 0 },
          { id: 'an', met: 3 },
        ]}
        moreLabels={{ shown: () => '', more: () => '', all: () => '' }}
      />,
    );
    const cells = [...html.matchAll(/<td class="([^"]*)">([^<]*)<\/td>/g)].map(
      ([, classes, text]) => [text, classes?.split(/\s+/).includes('text-fg-3')],
    );
    // The text "0" of the first column is no number: it keeps its colour.
    expect(cells).toEqual([
      ['0', false],
      ['0', true],
      ['an', false],
      ['3', false],
    ]);
  });
});
