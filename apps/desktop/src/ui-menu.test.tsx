import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MenuButton, MenuRows, type MenuRow } from '@p2c/ui';

// `@p2c/ui` has no react-dom of its own, so its markup is checked from the app. The keys and the
// clicks of an open menu need a page: e2e/navigation.spec.ts.
const ROWS: readonly MenuRow[] = [
  { key: 'all', label: 'Toàn bộ', checked: false },
  { key: 'team', label: 'Team Sao Mai', note: '10 RM', expanded: true, divided: true },
  { key: 'whole', label: 'Cả team', sub: true, checked: true },
];
const rows = () =>
  renderToStaticMarkup(<MenuRows title="Góc nhìn" rows={ROWS} onPick={() => {}} />);
const tags = (html: string, role: string) =>
  [...html.matchAll(/<button[^>]*>/g)].map((m) => m[0]).filter((tag) => tag.includes(role));

describe('MenuRows', () => {
  it('is a menu named by its heading', () => {
    expect(rows()).toMatch(/^<div[^>]*role="menu"[^>]*aria-label="Góc nhìn"/);
  });

  it('marks the one row chosen among the rows of the choice', () => {
    const radios = tags(rows(), 'role="menuitemradio"');

    expect(radios).toHaveLength(2);
    expect(radios[0]).toContain('aria-checked="false"');
    expect(radios[1]).toContain('aria-checked="true"');
  });

  it('a row that opens others says whether they show, and is no choice', () => {
    const [opener] = tags(rows(), 'role="menuitem"');

    expect(opener).toContain('aria-expanded="true"');
    expect(opener).not.toContain('aria-checked');
  });

  it('keeps its rows out of the Tab order: the arrows move among them', () => {
    expect(tags(rows(), 'tabindex="-1"')).toHaveLength(3);
  });
});

describe('MenuButton', () => {
  const closed = () =>
    renderToStaticMarkup(
      <MenuButton
        label="Góc nhìn: Team Sao Mai"
        text="Team Sao Mai"
        title="Góc nhìn"
        rows={ROWS}
        onPick={() => {}}
      />,
    );

  it('starts closed: a button named by what it shows, that says it opens a menu', () => {
    const html = closed();

    expect(html).toContain('aria-label="Góc nhìn: Team Sao Mai"');
    expect(html).toContain('aria-haspopup="menu"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain('role="menu"');
  });
});
