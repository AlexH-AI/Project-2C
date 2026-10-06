import { describe, expect, it } from 'vitest';
import {
  formatVnd,
  formatVndCompact,
  formatVndDelta,
  MAX_FEE_VND,
  parseVnd,
  type VndParseResult,
} from './money';

describe('formatVndDelta', () => {
  it('signs a difference with − or +, in the compact form', () => {
    expect(formatVndDelta(-14_500_000)).toBe('−14,5 tr');
    expect(formatVndDelta(2_000_000_000)).toBe('+2 tỷ');
    expect(formatVndDelta(500_000)).toBe('+500.000 ₫');
  });

  it('shows no sign when there is no difference', () => {
    expect(formatVndDelta(0)).toBe('0 ₫');
  });
});

const amountOf = (result: VndParseResult) => (result.ok ? result.amount : result.error);

describe('MAX_FEE_VND', () => {
  // Owner, 06/10/2026 (DR-23): a fee — FYP or case size — is at most 100 tỷ đồng.
  it('is 100 tỷ đồng', () => {
    expect(MAX_FEE_VND).toBe(100_000_000_000);
    expect(amountOf(parseVnd('100 tỷ'))).toBe(MAX_FEE_VND);
  });
});

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

  // The table of #356, approved by the Owner on 06/10/2026 (DR-37).
  describe('reads amounts as an RE says them', () => {
    it.each([
      ['500tr VNĐ', 500_000_000],
      ['500.000.000 vnđ', 500_000_000],
      ['500000000VND', 500_000_000],
      ['500.000 VNĐ', 500_000],
      ['500 000 000', 500_000_000],
      ['1 234 567', 1_234_567],
      ['1 500 000', 1_500_000],
      ['1 500 tỷ', 1_500_000_000_000],
      ['500 000 000 vnđ', 500_000_000],
      ['1tr5', 1_500_000],
      ['1 tr 5', 1_500_000],
      ['1tr50', 1_050_000],
      ['1tr250', 1_250_000],
      ['1 tỷ 2', 1_200_000_000],
      ['1tỷ2', 1_200_000_000],
      ['1 tỷ 25', 1_025_000_000],
      ['1 tỷ 250', 1_250_000_000],
      ['2k5', 2_500],
      ['1.500 tỷ 2', 1_500_200_000_000],
      ['5tr ₫', 5_000_000],
      ['1tr5 VNĐ', 1_500_000],
    ])('%s → %d đồng', (text, amount) => {
      expect(amountOf(parseVnd(text))).toBe(amount);
    });

    it.each([
      ['1tr5k', 'format'],
      ['2 tỷ 5 tr', 'format'],
      ['1 tỷ 200 triệu', 'format'],
      ['1tr2345', 'format'],
      ['1tr5555555', 'format'],
      ['1tr5,5', 'format'],
      ['1,5tr5', 'format'],
      ['500 00', 'format'],
      ['500 000.000', 'format'],
      ['1 500.000', 'format'],
      ['1 2', 'format'],
      ['12 34', 'format'],
      ['0 500', 'format'],
      ['1 tỷ2 5', 'format'],
      ['-500tr', 'negative'],
      ['−500tr', 'negative'],
      ['- 1tr5', 'negative'],
      ['--500', 'format'],
      ['-', 'format'],
      ['−-500', 'format'],
    ])('%j → error %s', (text, error) => {
      expect(parseVnd(text)).toEqual({ ok: false, error });
    });
  });

  describe('at the edges of what a number holds', () => {
    it('takes the largest safe integer and refuses the next one', () => {
      expect(amountOf(parseVnd('9007199254740991'))).toBe(Number.MAX_SAFE_INTEGER);
      expect(amountOf(parseVnd('9.007.199.254.740.991'))).toBe(Number.MAX_SAFE_INTEGER);
      expect(parseVnd('9007199254740992')).toEqual({ ok: false, error: 'too-large' });
      expect(parseVnd('9007199254740993')).toEqual({ ok: false, error: 'too-large' });
    });

    // DR-32: the sign is read once, not once per character.
    it('reads a long run of minus signs as a malformed number', () => {
      expect(parseVnd('-'.repeat(32_000) + '1')).toEqual({ ok: false, error: 'format' });
      expect(parseVnd('−'.repeat(32_000) + '1')).toEqual({ ok: false, error: 'format' });
    });

    // DR-38: spaces in a row are one space, so the pattern never backtracks over them.
    it('reads a long run of spaces quickly', () => {
      const texts = ['1' + ' '.repeat(20_000) + 'x', '1' + ' '.repeat(20_000) + '2'];
      const started = Date.now();
      const results = texts.map(parseVnd);
      const elapsed = Date.now() - started;
      expect(results).toEqual([
        { ok: false, error: 'format' },
        { ok: false, error: 'format' },
      ]);
      expect(elapsed).toBeLessThan(20);
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
