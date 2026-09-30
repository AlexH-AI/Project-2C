import { describe, expect, it } from 'vitest';
import { formatCount, formatFileSize } from './number';

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

describe('formatFileSize', () => {
  it('writes bytes below 1 KB as they are', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1023)).toBe('1.023 B');
  });

  it('counts 1 KB as 1024 bytes and drops a trailing ,0', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(850 * 1024)).toBe('850 KB');
    expect(formatFileSize(2 * 1024 * 1024)).toBe('2 MB');
  });

  it('rounds to one decimal written with a comma', () => {
    expect(formatFileSize(1536)).toBe('1,5 KB');
    expect(formatFileSize(Math.round(3.1 * 1024 * 1024))).toBe('3,1 MB');
    expect(formatFileSize(Math.round(4.84 * 1024 * 1024))).toBe('4,8 MB');
    expect(formatFileSize(Math.round(4.86 * 1024 * 1024))).toBe('4,9 MB');
    expect(formatFileSize(Math.round(1.25 * 1024 ** 3))).toBe('1,3 GB');
  });

  it('moves up a unit when rounding reaches 1024', () => {
    expect(formatFileSize(1024 * 1024 - 1)).toBe('1 MB');
  });

  it('groups thousands in large values', () => {
    expect(formatFileSize(2000 * 1024 ** 3)).toBe('2 TB');
    expect(formatFileSize(2000 * 1024 ** 4)).toBe('2.000 TB');
  });

  it('refuses what is not a size', () => {
    for (const value of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() => formatFileSize(value)).toThrow(RangeError);
    }
  });
});
