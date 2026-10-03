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
    expect(findTokenViolations('<span style={{ flex: 1, color: c }}>')).toEqual([
      { line: 1, match: 'style={', rule: 'inline-style' },
    ]);
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

  it('lets comments use them', () => {
    const source = [
      '/** Kanban N4 → N1 · closed beside. */',
      '/**',
      ' * Mockup 6c → 7a',
      ' */',
      '// Settings → Data',
      'const a = 1; // N2 → N1',
      '{/* 5a · 5b */}',
    ].join('\n');
    expect(findHardcodedSeparators(source)).toEqual([]);
  });
});
