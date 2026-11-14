import { describe, expect, it } from 'vitest';
import {
  CAP_GOLDEN_ROWS,
  COMPACT_GOLDEN_ROWS,
  CURRENCY_GOLDEN_ROWS,
  DELTA_GOLDEN_ROWS,
  FULL_GOLDEN_ROWS,
  INPUT_GOLDEN_ROWS,
  NUMBER_GOLDEN_ROWS,
  REFUSED_GOLDEN_ROWS,
} from './so-va-tien-te.fixture';

// These tests keep the fixture whole against `docs/golden/so-va-tien-te.md`. They format and read
// nothing: the rows are run through the functions in `money.test.ts` and `number.test.ts`.

/** The codes of a golden section, in order: `codes('F', 3)` → F01, F02, F03. */
const codes = (prefix: string, last: number) =>
  Array.from({ length: last }, (_, index) => `${prefix}${String(index + 1).padStart(2, '0')}`);

describe('golden numbers and currencies fixture', () => {
  it('has every row of §2–§6 once, in the golden order, and no other', () => {
    expect(FULL_GOLDEN_ROWS.map((row) => row.id)).toEqual(codes('F', 21));
    expect(COMPACT_GOLDEN_ROWS.map((row) => row.id)).toEqual(codes('C', 36));
    expect(DELTA_GOLDEN_ROWS.map((row) => row.id)).toEqual(codes('D', 7));
    expect(NUMBER_GOLDEN_ROWS.map((row) => row.id)).toEqual(codes('N', 17));
    expect(INPUT_GOLDEN_ROWS.map((row) => row.id)).toEqual(codes('I', 41));
    expect(REFUSED_GOLDEN_ROWS.map((row) => row.id)).toEqual(codes('X', 35));
    expect(CAP_GOLDEN_ROWS.map((row) => row.id)).toEqual(codes('M', 7));
  });

  it('reads money with cents in English only (§6)', () => {
    for (const row of [...INPUT_GOLDEN_ROWS, ...REFUSED_GOLDEN_ROWS, ...CAP_GOLDEN_ROWS]) {
      if (row.currency !== 'VND') expect(row.language).toBe('en');
    }
  });

  it('has one row of §1 per currency, in the golden order', () => {
    expect(CURRENCY_GOLDEN_ROWS.map((row) => row.currency)).toEqual([
      'VND',
      'USD',
      'EUR',
      'GBP',
      'AUD',
      'CAD',
      'SGD',
    ]);
  });

  it('writes a Vietnamese text for VND only: Vietnamese goes with VND alone', () => {
    for (const row of [...COMPACT_GOLDEN_ROWS, ...DELTA_GOLDEN_ROWS]) {
      expect(row.vi === null).toBe(row.currency !== 'VND');
    }
  });
});
