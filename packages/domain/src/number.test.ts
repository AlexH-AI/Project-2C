import { describe, expect, it } from 'vitest';
import { formatCount } from './number';

describe('formatCount', () => {
  it('groups thousands with dots', () => {
    expect(formatCount(0)).toBe('0');
    expect(formatCount(998)).toBe('998');
    expect(formatCount(1204)).toBe('1.204');
    expect(formatCount(1_234_567)).toBe('1.234.567');
  });

  it('refuses what is not a count', () => {
    for (const value of [-1, 1.5, Number.NaN]) expect(() => formatCount(value)).toThrow(RangeError);
  });
});
