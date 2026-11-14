import { describe, expect, it } from 'vitest';
import {
  amountRead,
  formatAmount,
  formatAmountCompact,
  formatAmountDelta,
  moneySymbol,
} from './money-view';

// Money in the currency of the data, the Excel way (ADR-0018 §4, golden so-va-tien-te.md §2–§4).
// The web build and the unit tests run Vietnamese with VND.
describe('money in the currency of the data', () => {
  it('writes the full form with VNĐ after the number', () => {
    expect(formatAmount(3_000_000)).toBe('3,000,000 VNĐ');
    expect(formatAmount(-1_500_000)).toBe('-1,500,000 VNĐ');
  });

  it('writes the compact form with the units of the language', () => {
    expect(formatAmountCompact(1_900_000_000)).toBe('1.9 tỷ');
    expect(formatAmountCompact(500_000)).toBe('500K');
    expect(formatAmountCompact(950)).toBe('950 VNĐ');
  });

  it('signs a difference, with no sign for none', () => {
    expect(formatAmountDelta(-14_500_000)).toBe('−14.5 tr');
    expect(formatAmountDelta(2_000_000_000)).toBe('+2 tỷ');
    expect(formatAmountDelta(0)).toBe('0 VNĐ');
  });

  it('names the currency by its symbol', () => {
    expect(moneySymbol()).toBe('VNĐ');
  });
});

// Mockups 6c / 6d (case size, NT-LH-25), 7b / 7c (a KYC money trường, NT-HS-05), 8a / 8b (FYP);
// ngon-ngu-tien-te.html: "500,000,000 VNĐ (500 tr)".
describe('amountRead', () => {
  it('reads the amount back in full, then in short', () => {
    expect(amountRead(800_000_000)).toBe('800,000,000 VNĐ (800 tr)');
    expect(amountRead(1_234_000_000)).toBe('1,234,000,000 VNĐ (1.23 tỷ)');
    expect(amountRead(1_000_000)).toBe('1,000,000 VNĐ (1 tr)');
    expect(amountRead(500_000)).toBe('500,000 VNĐ (500K)');
    expect(amountRead(999_999)).toBe('999,999 VNĐ (1 tr)');
  });

  // Under 1,000 the short form is the full one (review of PR 758), a FYP too (review of PR 838).
  it('gives the full form once under a thousand', () => {
    expect(amountRead(999)).toBe('999 VNĐ');
    expect(amountRead(0)).toBe('0 VNĐ');
  });
});
