import { describe, expect, it } from 'vitest';
import { amountRead } from './money-view';

// Mockups 6c / 6d (case size, NT-LH-25), 7b / 7c (a KYC money trường, NT-HS-05), 8a / 8b (FYP).
describe('amountRead', () => {
  it('reads the amount back in full, then in short', () => {
    expect(amountRead(800_000_000)).toBe('800.000.000 ₫ (800 tr)');
    expect(amountRead(1_234_000_000)).toBe('1.234.000.000 ₫ (1,23 tỷ)');
    expect(amountRead(1_000_000)).toBe('1.000.000 ₫ (1 tr)');
  });

  // Under a million the short form is the full one (review of PR 758), a FYP too (review of PR 838).
  it('gives the full form once under a million', () => {
    expect(amountRead(500_000)).toBe('500.000 ₫');
    expect(amountRead(999_999)).toBe('999.999 ₫');
    expect(amountRead(0)).toBe('0 ₫');
  });
});
