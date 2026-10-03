import { describe, expect, it } from 'vitest';
import {
  listExports,
  parseSource,
  renderExportMap,
  renderRouteTable,
  replaceBlock,
  screenComponents,
  sectionsOf,
  viewImports,
} from './codemap-core.mjs';

const exportsOf = (text, file = 'src/a.ts') => listExports(parseSource(file, text));

describe('listExports', () => {
  it('lists declared exports in source order and marks types', () => {
    const text = [
      'import { x } from "./x";',
      'export const A = 1, B = 2;',
      'export function f() {}',
      'export class C {}',
      'export enum E { One }',
      'export type T = string;',
      'export interface I { a: number }',
      'function hidden() {}',
      'export default function main() {}',
    ].join('\n');
    expect(exportsOf(text)).toEqual({
      names: [
        { name: 'A', type: false },
        { name: 'B', type: false },
        { name: 'f', type: false },
        { name: 'C', type: false },
        { name: 'E', type: false },
        { name: 'T', type: true },
        { name: 'I', type: true },
        { name: 'default', type: false },
      ],
      reexports: [],
    });
  });

  it('lists local export clauses, type-only ones and default assignments', () => {
    const text = [
      'const a = 1; type B = number; const c = 2;',
      'export { a, c as see };',
      'export type { B };',
      'export default a;',
    ].join('\n');
    expect(exportsOf(text).names).toEqual([
      { name: 'a', type: false },
      { name: 'see', type: false },
      { name: 'B', type: true },
      { name: 'default', type: false },
    ]);
  });

  it('keeps re-exports as module specifiers, not as names', () => {
    const text = [
      "export { a, type B } from './a';",
      "export type { C } from './c';",
      "export * from './d';",
      "export { e } from './a';",
    ].join('\n');
    expect(exportsOf(text)).toEqual({ names: [], reexports: ['./a', './c', './d'] });
  });

  it('parses TSX and returns nothing for a file without exports', () => {
    expect(exportsOf('const x = <div />;', 'src/main.tsx')).toEqual({ names: [], reexports: [] });
    expect(exportsOf('export const X = () => <p />;', 'src/X.tsx').names).toEqual([
      { name: 'X', type: false },
    ]);
  });
});

describe('renderExportMap', () => {
  const files = [
    { path: 'src/z/b.ts', names: [{ name: 'b', type: false }], reexports: [] },
    { path: 'src/main.tsx', names: [], reexports: [] },
    {
      path: 'src/index.ts',
      names: [{ name: 'VERSION', type: false }],
      reexports: ['./period', './z/b'],
    },
    {
      path: 'src/period.ts',
      names: [
        { name: 'addDays', type: false },
        { name: 'Period', type: true },
      ],
      reexports: [],
    },
    { path: 'src/z/a.ts', names: [], reexports: ['./b'] },
  ];

  it('writes one line per file, sorted by path', () => {
    expect(renderExportMap(files)).toBe(
      [
        '- `src/index.ts` — VERSION; re-exports ./period, ./z/b',
        '- `src/main.tsx` — (no exports)',
        '- `src/period.ts` — addDays, type Period',
        '- `src/z/a.ts` — re-exports ./b',
        '- `src/z/b.ts` — b',
      ].join('\n'),
    );
  });

  it('groups files by directory, without names, when the full map is over the limit', () => {
    expect(renderExportMap(files, 100)).toBe(
      ['- `src/` — index.ts, main.tsx, period.ts', '- `src/z/` — a.ts, b.ts'].join('\n'),
    );
  });
});
describe('replaceBlock', () => {
  const start = '<!-- codemap:start -->';
  const end = '<!-- codemap:end -->';

  it('replaces only the text between the markers', () => {
    const content = `# Hand\n\nintro\n\n${start}\nold\nlines\n${end}\n\nfooter\n`;
    expect(replaceBlock(content, 'new')).toBe(
      `# Hand\n\nintro\n\n${start}\nnew\n${end}\n\nfooter\n`,
    );
  });

  it('is idempotent and writes LF even when the file has CRLF', () => {
    const once = replaceBlock(`a\r\n${start}\r\n${end}\r\nb\r\n`, 'x');
    expect(once).toBe(`a\n${start}\nx\n${end}\nb\n`);
    expect(replaceBlock(once, 'x')).toBe(once);
  });

  it('refuses a file with a missing, repeated or reversed marker', () => {
    expect(() => replaceBlock('no markers', 'x')).toThrow(/codemap:start/);
    expect(() => replaceBlock(`${start}\n`, 'x')).toThrow(/codemap:end/);
    expect(() => replaceBlock(`${start}\n${start}\n${end}`, 'x')).toThrow(/once/);
    expect(() => replaceBlock(`${end}\n${start}`, 'x')).toThrow(/before/);
  });
});
describe('route table', () => {
  const routes = parseSource(
    'src/shell/routes.ts',
    "export const SECTIONS = ['overview', 'customers', 'reports'] as const;\nexport const X = 1;",
  );
  const screen = parseSource(
    'src/routes/Screen.tsx',
    [
      "import { t } from '../i18n';",
      "import { Overview } from './Overview';",
      "import { CustomersScreen } from './customers/CustomersScreen';",
      "import { CustomerProfile } from './customers/CustomerProfile';",
      'export function Screen({ route }) {',
      "  if (route.screen === 'overview') return <Overview />;",
      "  if (route.screen === 'customers') return <CustomersScreen />;",
      "  if (route.screen === 'customer') return <CustomerProfile id={route.id} />;",
      "  return <p>{t('screen.placeholder')}</p>;",
      '}',
    ].join('\n'),
  );

  it('reads the sidebar sections and the component each route renders', () => {
    expect(sectionsOf(routes)).toEqual(['overview', 'customers', 'reports']);
    expect(screenComponents(screen)).toEqual([
      { screen: 'overview', from: './Overview' },
      { screen: 'customers', from: './customers/CustomersScreen' },
      { screen: 'customer', from: './customers/CustomerProfile' },
    ]);
  });

  it('finds the *-view modules a file imports', () => {
    const file = parseSource(
      'src/routes/team/TeamScreen.tsx',
      "import { a } from './team-view';\nimport { b } from '../customers/customers-view';\nimport { c } from './TeamDialogs';",
    );
    expect(viewImports(file)).toEqual(['./team-view', '../customers/customers-view']);
  });

  it('renders sections first, then other routes, and marks sections without a screen', () => {
    const rows = [
      { screen: 'customer', file: 'src/routes/customers/CustomerProfile.tsx', views: [] },
      {
        screen: 'customers',
        file: 'src/routes/customers/CustomersScreen.tsx',
        views: ['src/routes/customers/customers-view.ts'],
      },
      { screen: 'overview', file: 'src/routes/Overview.tsx', views: [] },
    ];
    expect(renderRouteTable(['overview', 'customers', 'reports'], rows)).toBe(
      [
        '| route | screen | view |',
        '|---|---|---|',
        '| `overview` | `src/routes/Overview.tsx` | — |',
        '| `customers` | `src/routes/customers/CustomersScreen.tsx` | `src/routes/customers/customers-view.ts` |',
        '| `reports` | (placeholder) | — |',
        '| `customer` | `src/routes/customers/CustomerProfile.tsx` | — |',
      ].join('\n'),
    );
  });
});
