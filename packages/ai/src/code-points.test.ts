import { describe, expect, it } from 'vitest';
import { codePointCount, codePointsOver, cutCodePoints } from './code-points';

const EMOJI = '😀'; // two code units, one code point

describe('code points', () => {
  it.each([
    ['', 0],
    ['abc', 3],
    [EMOJI.repeat(3), 3],
    [`a${EMOJI}b`, 3],
    ['tiếng Việt', 'tiếng Việt'.length],
    // A lone surrogate is one character, as Rust reads the string the webview sends.
    ['\ud800x', 2],
    [`x\udc00${EMOJI}`, 3],
  ])('counts %j as %i', (text, count) => {
    expect(codePointCount(text)).toBe(count);
    expect(codePointCount(text)).toBe(Array.from(text).length);
  });

  it.each([
    ['abc', 3, false],
    ['abcd', 3, true],
    [EMOJI.repeat(3), 3, false],
    [EMOJI.repeat(4), 3, true],
    [`${EMOJI.repeat(2)}ab`, 3, true],
    [`${EMOJI}ab`, 3, false],
  ])('tells whether %j has more than %i', (text, max, over) => {
    expect(codePointsOver(text, max)).toBe(over);
  });

  it.each([
    ['abcdef', 3, 'abc'],
    ['ab', 3, 'ab'],
    [EMOJI.repeat(5), 3, EMOJI.repeat(3)],
    [`ab${EMOJI}c`, 3, `ab${EMOJI}`],
    ['', 0, ''],
    ['abc', 0, ''],
  ])('cuts %j to %i', (text, max, cut) => {
    expect(cutCodePoints(text, max)).toBe(cut);
  });

  it('answers on a 20-million-character text without reading it all', () => {
    // DR5-09: `Array.from` of this is a 140 MB array; a limit check stops at the limit.
    const huge = 'x'.repeat(20_000_000);
    const started = Date.now();
    expect(codePointsOver(huge, 20_000)).toBe(true);
    expect(cutCodePoints(huge, 20_000)).toHaveLength(20_000);
    expect(Date.now() - started).toBeLessThan(50);
  });
});
