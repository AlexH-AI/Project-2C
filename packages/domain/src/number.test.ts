import { describe, expect, it } from 'vitest';
import { NUMBER_GOLDEN_ROWS, type NumberGoldenRow } from './golden/so-va-tien-te.fixture';
import { formatMoneyCompact } from './money';
import { countFrame, formatBytes, formatNumber, formatPercentage } from './number';

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

describe('countFrame', () => {
  const TR = 1_000_000;
  const compact = (value: number) => formatMoneyCompact(value, 'VND', 'vi');
  const progress = Array.from({ length: 99 }, (_, index) => (index + 1) / 100);

  it('is the old value at the start and the new one at the end, both exact', () => {
    expect(countFrame(290 * TR, 310_600_000, 0, 'sig3')).toBe(290 * TR);
    expect(countFrame(290 * TR, 310_600_000, 1, 'sig3')).toBe(310_600_000);
    expect(countFrame(66.67, 50, 0, 'tenth')).toBe(66.67);
    expect(countFrame(66.67, 50, 1, 'tenth')).toBe(50);
  });

  it('never passes 310.6 tr on the way up from 290 tr (L94): in between, three significant digits rounded down', () => {
    const frames = progress.map((at) => countFrame(290 * TR, 310_600_000, at, 'sig3'));
    expect(Math.max(...frames)).toBe(310 * TR);
    expect(frames.every((frame, at) => frame <= (frames[at + 1] ?? frame))).toBe(true);
    expect(countFrame(290 * TR, 310_600_000, 0.98, 'sig3')).toBe(310 * TR);
  });

  it('goes 1.38 tỷ → 1.03 tỷ → 761 tr → 310 tr, rounding up on the way down, each frame a compact form', () => {
    expect(compact(countFrame(1_380 * TR, 310 * TR, 0.33, 'sig3'))).toBe('1.03 tỷ');
    expect(compact(countFrame(1_380 * TR, 310 * TR, 0.5786, 'sig3'))).toBe('761 tr');
    // 761,406,250 đồng, the running value at a quarter of the way: up to 762 tr, never below it.
    expect(countFrame(1_380 * TR, 310 * TR, 0.578125, 'sig3')).toBe(762 * TR);
    const frames = progress.map((at) => countFrame(1_380 * TR, 310 * TR, at, 'sig3'));
    expect(Math.min(...frames)).toBeGreaterThanOrEqual(310 * TR);
    expect(frames.every((frame) => Number.isSafeInteger(frame))).toBe(true);
  });

  it('never goes back past the old value', () => {
    expect(countFrame(290_600_000, 400 * TR, 0.001, 'sig3')).toBe(290_600_000);
    expect(countFrame(310_600_000, 100 * TR, 0.001, 'sig3')).toBe(310_600_000);
  });

  it('counts whole numbers, rounded towards the old value', () => {
    expect(countFrame(3, 12, 0.5, 'whole')).toBe(7);
    expect(countFrame(12, 3, 0.5, 'whole')).toBe(8);
    // Past 999 a count still runs by ones, not by three significant digits.
    expect(countFrame(1_204, 3_507, 0.5, 'whole')).toBe(2_355);
    expect(countFrame(3_507, 1_204, 0.5, 'whole')).toBe(2_356);
    expect(countFrame(1_204, 3_507, 0.5, 'sig3')).toBe(2_350);
    expect(countFrame(0, 57, 0.5, 'sig3')).toBe(28);
  });

  it('runs a percentage by tenths, towards the old value', () => {
    expect(countFrame(50, 66.67, 0.5, 'tenth')).toBe(58.3);
    expect(countFrame(66.67, 50, 0.5, 'tenth')).toBe(58.4);
    expect(countFrame(60, 60.1, 0.9, 'tenth')).toBe(60);
    expect(countFrame(0, 1, 0.35, 'tenth')).toBe(0.3);
    expect(countFrame(1, 0, 0.35, 'tenth')).toBe(0.7);
  });
});
