import { describe, expect, it } from 'vitest';
import { formatVnd, formatVndCompact, parseVnd, type VndParseResult } from './money';

const amountOf = (result: VndParseResult) => (result.ok ? result.amount : result.error);

describe('parseVnd', () => {
  it.each(['500tr', '500 triệu', '500.000.000', '500000000', '500 TR', '  500 trieu  '])(
    '%s → 500 000 000 đồng',
    (text) => {
      expect(amountOf(parseVnd(text))).toBe(500_000_000);
    },
  );

  it.each(['1,2 tỷ', '1.2 tỷ', '1,2ty', '1,2 tỉ', '1,20 tỷ'])('%s → 1 200 000 000 đồng', (text) => {
    expect(amountOf(parseVnd(text))).toBe(1_200_000_000);
  });

  it.each([
    ['2 triệu', 2_000_000],
    ['750k', 750_000],
    ['750 nghìn', 750_000],
    ['750 ngàn', 750_000],
    ['1,5tr', 1_500_000],
    ['1,25 tỷ', 1_250_000_000],
    ['1.500 tỷ', 1_500_000_000_000],
    ['0', 0],
    ['1.000', 1_000],
    ['500.000.000 ₫', 500_000_000],
    ['500000đ', 500_000],
    ['500.000 vnd', 500_000],
  ])('%s → %d đồng', (text, amount) => {
    expect(amountOf(parseVnd(text))).toBe(amount);
  });

  it.each([
    ['', 'empty'],
    ['   ', 'empty'],
    ['-500tr', 'negative'],
    ['−1 tỷ', 'negative'],
    ['-abc', 'format'],
    ['abc', 'format'],
    ['500 đô', 'format'],
    ['1,2,3 tỷ', 'format'],
    ['1.2.3 tỷ', 'format'],
    ['1.20.000', 'format'],
    ['tr', 'format'],
    [',5 tr', 'format'],
    ['5, tr', 'format'],
    ['1,5', 'fraction'],
    ['1.5', 'fraction'],
    ['1,2345k', 'fraction'],
    ['99999999999 tỷ', 'too-large'],
  ])('%j → error %s', (text, error) => {
    expect(parseVnd(text)).toEqual({ ok: false, error });
  });

  it('accepts trailing zeros past the đồng, which are not a fraction', () => {
    expect(amountOf(parseVnd('1,2340k'))).toBe(1_234);
  });

  describe('treats `.` and `,` alike: 3 digits after the mark group thousands', () => {
    it.each(['500,000', '500.000', '500000', '0,5tr', '0.5 triệu', '500k'])(
      '%s → 500 000 đồng',
      (text) => {
        expect(amountOf(parseVnd(text))).toBe(500_000);
      },
    );

    it.each([
      ['1,000', 1_000],
      ['1,234,567', 1_234_567],
      ['500,000,000', 500_000_000],
      ['1,500 tỷ', 1_500_000_000_000],
      ['1.500 tỷ', 1_500_000_000_000],
      ['1,5 tỷ', 1_500_000_000],
      ['1.5 tỷ', 1_500_000_000],
      ['1,50 tỷ', 1_500_000_000],
      ['0,500 tỷ', 500_000_000],
      ['1.234,5 tr', 1_234_500_000],
      ['1,234.5 tr', 1_234_500_000],
    ])('%s → %d đồng', (text, amount) => {
      expect(amountOf(parseVnd(text))).toBe(amount);
    });

    it.each([
      '1,2,3 tỷ',
      '1.2.3',
      '1.20.000',
      '1,234,5',
      '1.234.5',
      '1,234.567.8',
      '1.234,567',
      '0,500,000',
      ',5',
      '5,',
      '5.',
    ])('%j → error format', (text) => {
      expect(parseVnd(text)).toEqual({ ok: false, error: 'format' });
    });
  });
});

describe('formatVnd', () => {
  it.each([
    [500_000_000, '500.000.000 ₫'],
    [0, '0 ₫'],
    [999, '999 ₫'],
    [1_000, '1.000 ₫'],
    [1_234_567, '1.234.567 ₫'],
    [-1_500_000, '-1.500.000 ₫'],
  ])('%d → %s', (amount, text) => {
    expect(formatVnd(amount)).toBe(text);
  });

  it('refuses amounts that are not whole đồng', () => {
    expect(() => formatVnd(1.5)).toThrow(RangeError);
    expect(() => formatVnd(Number.MAX_SAFE_INTEGER + 1)).toThrow(RangeError);
  });
});

describe('formatVndCompact', () => {
  it.each([
    [1_200_000_000, '1,2 tỷ'],
    [500_000_000, '500 tr'],
    [1_000_000_000, '1 tỷ'],
    [1_000_000, '1 tr'],
    [1_500_000, '1,5 tr'],
    [1_250_000_000, '1,25 tỷ'],
    [1_234_567_890, '1,23 tỷ'],
    [1_500_000_000_000, '1.500 tỷ'],
    [999_999_999, '1 tỷ'],
    [-1_200_000_000, '-1,2 tỷ'],
  ])('%d → %s', (amount, text) => {
    expect(formatVndCompact(amount)).toBe(text);
  });

  it('shows amounts under 1 million in full', () => {
    expect(formatVndCompact(750_000)).toBe('750.000 ₫');
    expect(formatVndCompact(0)).toBe('0 ₫');
  });

  it('refuses amounts that are not whole đồng', () => {
    expect(() => formatVndCompact(0.5)).toThrow(RangeError);
  });

  it.each([1_200_000_000, 500_000_000, 1_000_000_000, 1_500_000, 1_500_000_000_000, 750_000, 0])(
    'reads back %d from its compact form',
    (amount) => {
      expect(amountOf(parseVnd(formatVndCompact(amount)))).toBe(amount);
    },
  );

  it('reads back the full form', () => {
    expect(amountOf(parseVnd(formatVnd(1_234_567)))).toBe(1_234_567);
  });
});
