import { describe, expect, it } from 'vitest';
import { NUMBER_GOLDEN_ROWS, type NumberGoldenRow } from './golden/so-va-tien-te.fixture';
import {
  formatBytes,
  formatCount,
  formatFileSize,
  formatNumber,
  formatPercent,
  formatPercentage,
} from './number';

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

describe('formatPercent', () => {
  it('shows one decimal after a comma, without ",0"', () => {
    expect(formatPercent((2 / 3) * 100)).toBe('66,7');
    expect(formatPercent(43.75)).toBe('43,8');
    expect(formatPercent(100)).toBe('100');
    expect(formatPercent(0)).toBe('0');
    expect(formatPercent(1250)).toBe('1.250');
  });

  it('keeps the sign of a negative change; one that rounds to 0 is 0', () => {
    expect(formatPercent(-2.43)).toBe('-2,4');
    expect(formatPercent(-0.04)).toBe('0');
  });

  it('rejects a value that is not a finite number', () => {
    for (const value of [Number.NaN, Infinity])
      expect(() => formatPercent(value)).toThrow(RangeError);
  });
});

// Golden `docs/golden/so-va-tien-te.md` §5 (ADR-0018 §4), through the fixture: the same in both
// languages. A percentage is golden with its "%", which the interface adds to the number.
const FORMATS: Readonly<Record<NumberGoldenRow['kind'], (input: number) => string>> = {
  count: formatNumber,
  percentage: (value) => `${formatPercentage(value)}%`,
  bytes: formatBytes,
};

describe('numbers the Excel way (golden §5)', () => {
  it.each(NUMBER_GOLDEN_ROWS)('$id: $kind $input → $text', ({ kind, input, text }) => {
    expect(FORMATS[kind](input)).toBe(text);
  });
});

describe('formatNumber', () => {
  it('refuses what is not a count', () => {
    for (const value of [-1, 1.5, Number.NaN])
      expect(() => formatNumber(value)).toThrow(RangeError);
  });
});

describe('formatPercentage', () => {
  it('gives the number without "%"', () => {
    expect(formatPercentage(0)).toBe('0');
    expect(formatPercentage(43.75)).toBe('43.8');
  });

  it('refuses a value that is not a finite number', () => {
    for (const value of [Number.NaN, Number.NEGATIVE_INFINITY]) {
      expect(() => formatPercentage(value)).toThrow(RangeError);
    }
  });
});

describe('formatBytes', () => {
  it('goes on to GB and TB, and groups thousands of TB', () => {
    expect(formatBytes(Math.round(1.25 * 1024 ** 3))).toBe('1.3 GB');
    expect(formatBytes(2000 * 1024 ** 4)).toBe('2,000 TB');
  });

  it('refuses what is not a size', () => {
    for (const value of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() => formatBytes(value)).toThrow(RangeError);
    }
  });
});
