import { describe, expect, it } from 'vitest';
import { findTokenViolations } from './token-guard';

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

  it('does not treat JSX fragments or i18n keys as violations', () => {
    expect(findTokenViolations(`<>{t('app.title')}</>`)).toEqual([]);
  });
});
