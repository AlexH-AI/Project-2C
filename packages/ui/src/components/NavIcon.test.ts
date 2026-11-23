import { isValidElement } from 'react';
import { describe, expect, it } from 'vitest';
import { NavIcon, type NavIconName } from './NavIcon';

type Props = Record<string, unknown> & { children?: unknown };

/**
 * The shapes React would draw for `node`, written as the mockup writes the inside of a `<symbol>`:
 * `<path d="…" />`, an attribute of React's `strokeDasharray` as SVG's `stroke-dasharray`.
 * `@p2c/ui` has no react-dom, and an icon has no hooks: its element is read as it is.
 */
function shapes(node: unknown): string {
  if (Array.isArray(node)) return node.map(shapes).join('');
  if (!isValidElement<Props>(node)) return '';
  const { children, ...props } = node.props;
  if (typeof node.type !== 'string') return shapes(children);
  const attributes = Object.entries(props)
    .map(([name, value]) => ` ${name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}="${value}"`)
    .join('');
  return `<${node.type}${attributes} />`;
}

const drawn = (name: NavIconName) => NavIcon({ name }).props as Props;

// The inside of each `<symbol>` of docs/design/mockups/app-shell.html (G3 11/11/2026), as written
// there: the icon of Forecast and the magnifier (also those of forecast.html, search-rm-team.html),
// and the three of Cài đặt, drawn on a tile (Kiểu A, ADR-0013 appendix 11/11/2026 §4).
const MOCKUP: ReadonlyArray<[NavIconName, string, string]> = [
  [
    'forecast',
    '#i-forecast',
    '<path d="M3 16l5-5 3.5 3L17 8M14 8h3v3" /><path d="M3 20.5h18" stroke-dasharray="1.5 3.2" />',
  ],
  ['search', '#i-search', '<circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" />'],
  [
    'data',
    '#i-db',
    '<ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />',
  ],
  [
    'ai',
    '#i-spark',
    '<path d="M11 3l1.9 4.9L18 9.8l-5.1 1.9L11 16.6l-1.9-4.9L4 9.8l5.1-1.9zM18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />',
  ],
  ['trash', '#i-trash', '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />'],
  // The eight icons of a team, those of search-rm-team.html (G3 12/11/2026, C3).
  [
    'star',
    '#i-star',
    '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.7l5.9-.9z" />',
  ],
  [
    'sunrise',
    '#i-sunrise',
    '<path d="M3 18h18M7.5 18a4.5 4.5 0 0 1 9 0M12 7v3M5.3 10.8l1.7 1.7M18.7 10.8L17 12.5M8 21.5h8" />',
  ],
  [
    'sun',
    '#i-sun',
    '<circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />',
  ],
  ['mountain', '#i-mountain', '<path d="M3 19l6-10 3.5 5.5L15 11l6 8z" />'],
  ['leaf', '#i-leaf', '<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14zM5 19l7-7" />'],
  [
    'flame',
    '#i-flame',
    '<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 .8-3.2 2-4.3.2 2 1 3 2 3.3-.3-3 .2-6 1-9z" />',
  ],
  ['shield', '#i-shield', '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" />'],
  [
    'anchor',
    '#i-anchor',
    '<circle cx="12" cy="5.5" r="2" /><path d="M12 7.5V21M5 13c0 4 3 7 7 8 4-1 7-4 7-8M8.5 11h7" />',
  ],
];

describe('NavIcon (mockup app-shell.html)', () => {
  it.each(MOCKUP)('draws `%s` as the mockup draws %s', (name, _symbol, mockup) => {
    expect(shapes(drawn(name).children)).toBe(mockup);
  });

  it.each(MOCKUP)(
    'draws `%s` on the 24-unit grid, hidden from the reader: the words beside it name it',
    (name) => {
      expect(drawn(name)).toMatchObject({ viewBox: '0 0 24 24', 'aria-hidden': 'true' });
    },
  );
});
