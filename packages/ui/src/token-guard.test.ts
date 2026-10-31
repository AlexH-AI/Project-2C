import { describe, expect, it } from 'vitest';
import { findHardcodedSeparators, findTokenViolations } from './token-guard';

describe('findTokenViolations', () => {
  it('accepts token-backed utilities', () => {
    const source = `<li className="rounded-md border border-border bg-surface-2 px-3 text-fg-2 tabular-nums">`;
    expect(findTokenViolations(source)).toEqual([]);
  });

  it('flags hex colours with their line number', () => {
    const source = `const a = 1;\nbody { color: #e6ebf2; }`;
    expect(findTokenViolations(source)).toEqual([
      { line: 2, match: '#e6ebf2', rule: 'hex-colour' },
    ]);
  });

  it('flags colour functions', () => {
    expect(findTokenViolations('color: rgba(0, 0, 0, 0.5);')).toEqual([
      { line: 1, match: 'rgba(', rule: 'colour-function' },
    ]);
  });

  it('flags Tailwind arbitrary values', () => {
    expect(findTokenViolations('<div className="w-[37px] p-2">')).toEqual([
      { line: 1, match: 'w-[37px]', rule: 'arbitrary-value' },
    ]);
  });

  it("flags Tailwind's default palette, which the theme removes", () => {
    expect(findTokenViolations('<p className="border-white/10 text-sky-400">')).toEqual([
      { line: 1, match: 'border-white', rule: 'default-palette' },
      { line: 1, match: 'text-sky-400', rule: 'default-palette' },
    ]);
  });

  it('flags raw lengths in stylesheets and scripts', () => {
    expect(findTokenViolations('.x { padding: 13px; margin: 0.5rem 1.25em; }')).toEqual([
      { line: 1, match: '13px', rule: 'raw-length' },
      { line: 1, match: '0.5rem', rule: 'raw-length' },
      { line: 1, match: '1.25em', rule: 'raw-length' },
    ]);
  });

  it('flags inline styles, which bypass the token utilities', () => {
    expect(findTokenViolations('<div style={{ width: 37 }}>')).toEqual([
      { line: 1, match: 'style={', rule: 'inline-style' },
    ]);
  });

  it('allows a flex share taken from data, and nothing beside it', () => {
    expect(findTokenViolations('<span style={{ flex: cell.met }}>')).toEqual([]);
    expect(findTokenViolations('<span style={{ flex: counts[group.key] }}>')).toEqual([]);
    expect(findTokenViolations('<span style={{ flex: 1, color: c }}>')).toEqual([
      { line: 1, match: 'style={', rule: 'inline-style' },
    ]);
  });

  it('flags a flex written as a number: a design value, not a share from data', () => {
    for (const flex of ['1', '0.5', '.5']) {
      expect(findTokenViolations(`<span style={{ flex: ${flex} }}>`)).toEqual([
        { line: 1, match: 'style={', rule: 'inline-style' },
      ]);
    }
  });

  it('does not treat Tailwind spacing utilities as raw lengths', () => {
    expect(findTokenViolations('<p className="px-3 py-1 gap-6 text-2xl">')).toEqual([]);
  });

  it('does not treat JSX fragments or i18n keys as violations', () => {
    expect(findTokenViolations(`<>{t('app.title')}</>`)).toEqual([]);
  });
});

describe('findHardcodedSeparators', () => {
  it('flags a dot or arrow written into the markup or a string', () => {
    const source = [
      '<b>{re.name}</b> · {summary}',
      "parts.join(' · ')",
      '{from} → {to}',
      "{t('sep.dot')}",
    ].join('\n');
    expect(findHardcodedSeparators(source)).toEqual([
      { line: 1, match: '·', rule: 'hardcoded-separator' },
      { line: 2, match: '·', rule: 'hardcoded-separator' },
      { line: 3, match: '→', rule: 'hardcoded-separator' },
    ]);
  });

  // DR6-37: the marks live in vi.ts too, and a list is joined by `sep.list`.
  it('flags a mark, or a list joined by hand', () => {
    const source = [
      "['✓', 'text-ok', '○']",
      '{name} ×',
      "{open ? '▾' : '▸'}",
      "{from ?? '—'}",
      "names.join(', ')",
      "names.join(t('sep.list'))",
      "parts.join('')",
    ].join('\n');
    expect(findHardcodedSeparators(source)).toEqual([
      { line: 1, match: '✓', rule: 'hardcoded-mark' },
      { line: 1, match: '○', rule: 'hardcoded-mark' },
      { line: 2, match: '×', rule: 'hardcoded-mark' },
      { line: 3, match: '▾', rule: 'hardcoded-mark' },
      { line: 3, match: '▸', rule: 'hardcoded-mark' },
      { line: 4, match: '—', rule: 'hardcoded-mark' },
      { line: 5, match: "', '", rule: 'hardcoded-separator' },
    ]);
  });

  // DR6-145 (b): parts joined by hand, whatever the quote, as a template or as JSX.
  it('flags a separator that is a whole string or a whole piece of a template', () => {
    const source = [
      'names.join(`, `)',
      "a + ', ' + b",
      'a + "; " + b',
      '`${a}, ${b}`',
      '`${a}; ${b}`',
    ].join('\n');
    expect(findHardcodedSeparators(source)).toEqual([
      { line: 1, match: '`, `', rule: 'hardcoded-separator' },
      { line: 2, match: "', '", rule: 'hardcoded-separator' },
      { line: 3, match: '"; "', rule: 'hardcoded-separator' },
      { line: 4, match: '}, ${', rule: 'hardcoded-separator' },
      { line: 5, match: '}; ${', rule: 'hardcoded-separator' },
    ]);
  });

  it('leaves a separator that is only part of a string, and the strings of a list', () => {
    const source = [
      "const kinds = ['MET', 'CANCELLED', 'NO_SHOW'];",
      "const pair = 'a, b';",
      'const key = `${kind}:${id}`;',
      "const fields = text.split(',');",
    ].join('\n');
    expect(findHardcodedSeparators(source)).toEqual([]);
  });

  it('flags parts of JSX joined by hand, not the braces of code', () => {
    const source = [
      '<span className="min-w-0">',
      '  {t(`kycField.${fact.field}`)}: {factText(fact.value)}',
      '  <b>{a}, {b}; {c}</b>',
      '</span>',
      'function Row({ row }: { row: Row }) {',
      '  const pairs = [{ a: 1 }, { b: 2 }];',
      '  return pick({ a }, { b }) ? { a } : { b };',
      '}',
      'const run = async (): Promise<void> => {};',
    ].join('\n');
    expect(findHardcodedSeparators(source)).toEqual([
      { line: 2, match: '}: {', rule: 'hardcoded-separator' },
      { line: 3, match: '}, {', rule: 'hardcoded-separator' },
      { line: 3, match: '}; {', rule: 'hardcoded-separator' },
    ]);
  });

  // DR6-145 (c): a `//` or `/*` inside a string or a template opens no comment.
  it('reads on past a // in a string or a template', () => {
    const source = [
      "const url = 'https://example.com'; const s = 'a · b';",
      'const t = `${base}//x`; const u = "a → b";',
      'const v = `one line',
      '// and the next · of the template`;',
    ].join('\n');
    expect(findHardcodedSeparators(source)).toEqual([
      { line: 1, match: '·', rule: 'hardcoded-separator' },
      { line: 2, match: '→', rule: 'hardcoded-separator' },
      { line: 4, match: '·', rule: 'hardcoded-separator' },
    ]);
  });

  it('opens no comment at a /* in a string, to the end of the file', () => {
    const source = [
      "const glob = 'a /* b';",
      "const s = 'a · b';",
      "const mark = '✓';",
      "const t = 'c · d';",
    ].join('\n');
    expect(findHardcodedSeparators(source)).toEqual([
      { line: 2, match: '·', rule: 'hardcoded-separator' },
      { line: 3, match: '✓', rule: 'hardcoded-mark' },
      { line: 4, match: '·', rule: 'hardcoded-separator' },
    ]);
  });

  it('closes nothing at a */ in a string, and reads what follows it', () => {
    const source = ["const open = '/*';", "const s = 'a · b';", "const close = '*/ ✓';"].join('\n');
    expect(findHardcodedSeparators(source)).toEqual([
      { line: 2, match: '·', rule: 'hardcoded-separator' },
      { line: 3, match: '✓', rule: 'hardcoded-mark' },
    ]);
  });

  it('opens no string at a quote inside a comment', () => {
    const source = [
      "// it's N2 → N1",
      "/* don't · here */ const s = 'a · b';",
      "const t = '→'; // the RE's → arrow",
    ].join('\n');
    expect(findHardcodedSeparators(source)).toEqual([
      { line: 2, match: '·', rule: 'hardcoded-separator' },
      { line: 3, match: '→', rule: 'hardcoded-separator' },
    ]);
  });

  it('reads an escape inside a string, an escaped line break too', () => {
    const source = [
      "const s = 'it\\'s // no comment · here';",
      "const t = 'one \\",
      "two · three'; // N2 → N1",
    ].join('\n');
    expect(findHardcodedSeparators(source)).toEqual([
      { line: 1, match: '·', rule: 'hardcoded-separator' },
      { line: 3, match: '·', rule: 'hardcoded-separator' },
    ]);
  });

  it('ends a string with its line: a quote of a regex literal opens none', () => {
    const source = ['const quote = /"/;', "const s = ' · '; // N2 → N1"].join('\n');
    expect(findHardcodedSeparators(source)).toEqual([
      { line: 2, match: '·', rule: 'hardcoded-separator' },
    ]);
  });

  it('lets comments use them', () => {
    const source = [
      '/** Kanban N4 → N1 · closed beside, "—" when empty. */',
      '/**',
      ' * Mockup 6c → 7a',
      ' */',
      '// Settings → Data',
      'const a = 1; // N2 → N1',
      '{/* 5a · 5b, 1 440 × 900 */}',
    ].join('\n');
    expect(findHardcodedSeparators(source)).toEqual([]);
  });

  it('takes whichever comment opens first on a line', () => {
    const source = [
      "const a = ' · '; // N2 → N1 /* no block opens here",
      "const b = ' → ';",
      "/* N4 → N1 */ const c = ' · '; // N2 → N1",
    ].join('\n');
    expect(findHardcodedSeparators(source)).toEqual([
      { line: 1, match: '·', rule: 'hardcoded-separator' },
      { line: 2, match: '→', rule: 'hardcoded-separator' },
      { line: 3, match: '·', rule: 'hardcoded-separator' },
    ]);
  });

  it('checks the code after a block comment ends, on its line and the next', () => {
    const source = [
      '/**',
      ' * Mockup 6c → 7a',
      " */ const a = ' · ';",
      "/* N4 → N1 */ const b = ' → ';",
      "const c = ' · ';",
    ].join('\n');
    expect(findHardcodedSeparators(source)).toEqual([
      { line: 3, match: '·', rule: 'hardcoded-separator' },
      { line: 4, match: '→', rule: 'hardcoded-separator' },
      { line: 5, match: '·', rule: 'hardcoded-separator' },
    ]);
  });
});
