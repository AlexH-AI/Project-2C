import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
/** A stylesheet without its comments, every run of white space one space. */
const plain = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ');
/** Every declaration of a custom property, with the selector of its rule: `:root|--r-k|1.5`. */
const tokens = (css: string) =>
  [...plain(css).matchAll(/([^{}]+)\{([^{}]*)\}/g)].flatMap(([, selector, body]) =>
    [...body!.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(
      ([, name, value]) => `${selector!.trim()}|${name}|${value!.trim()}`,
    ),
  );

const app = read('../src/tokens.css');
// Block B of the mockup stylesheet: the tokens the Owner approved at G3 on 11/11/2026 (ADR-0013).
const mockup = read('../../../docs/design/mockups/ui2.css');
const blockB = mockup.slice(
  mockup.indexOf('/* B. New tokens'),
  mockup.indexOf('/* C. Mockup only'),
);

describe('tokens.css (VA1)', () => {
  it('holds every token of block B of the mockup, by name, value and system', () => {
    const approved = tokens(blockB);
    expect(approved).toHaveLength(53);
    expect(tokens(app)).toEqual(expect.arrayContaining(approved));
    // A web view without corner-shape draws the nominal radius as a circular arc.
    expect(plain(app)).toContain(
      '@supports not (corner-shape: superellipse(1.7)) { :root { --r-k: 1; } }',
    );
  });

  it('turns the window and the focus layer solid under reduced transparency, on both systems', () => {
    const [, reduced] = plain(app).split('@media (prefers-reduced-transparency: reduce)');
    expect(tokens(reduced ?? '')).toEqual([
      ":root, [data-os='win']|--mat-window|var(--bg-1)",
      ":root, [data-os='win']|--mat-pop|var(--bg-2)",
      ":root, [data-os='win']|--mat-edge|var(--bg-0)",
      ":root, [data-os='win']|--blur-pop|none",
    ]);
  });

  it('keeps no old corner or font token, and takes none of the mockup page (block C)', () => {
    const names = new Set(tokens(app).map((token) => token.split('|')[1]));
    expect([...names].filter((name) => /^--(corner-|font$)/.test(name!))).toEqual([]);
    expect([...names].filter((name) => /^--font/.test(name!))).toEqual([
      '--font-brand',
      '--font-ui',
    ]);
    for (const name of ['--font-page', '--font-code', '--page-bg', '--blur-window', '--wall']) {
      expect(names).not.toContain(name);
    }
  });

  it('bundles Playfair Display only: the text of the app is in the font of the system', () => {
    expect(readdirSync(new URL('../src/fonts', import.meta.url)).sort()).toEqual([
      'OFL-playfair-display.txt',
      'playfair-display-latin-400-italic.woff2',
    ]);
    const families = [...read('../src/fonts.css').matchAll(/font-family:\s*([^;]+);/g)];
    expect(families.map((family) => family[1])).toEqual(["'Playfair Display'"]);
  });
});
