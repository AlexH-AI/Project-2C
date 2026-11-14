import { describe, expect, it } from 'vitest';
import { NUMBER_GOLDEN_ROWS, type NumberGoldenRow } from './golden/so-va-tien-te.fixture';
import { formatBytes, formatNumber, formatPercentage } from './number';

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
