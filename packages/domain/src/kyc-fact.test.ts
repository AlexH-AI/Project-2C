import { describe, expect, it } from 'vitest';
import type { KycField } from './kyc-catalog';
import { normalizeKycValue, type KycValue } from './kyc-fact';

// Moved from `db` (spec Phase 5 §6.4): the same cases as its command tests, same results.
describe('normalizeKycValue', () => {
  const refuses = (field: string, value: KycValue) => () =>
    normalizeKycValue(field as KycField, value);

  it('takes the type of the trường (review #36)', () => {
    expect(normalizeKycValue('childrenCount', '2')).toBe(2);
    expect(normalizeKycValue('childrenCount', ' 0 ')).toBe(0);
    expect(normalizeKycValue('childrenCount', 3)).toBe(3);
    expect(normalizeKycValue('hasProtection', 'false')).toBe(false);
    expect(normalizeKycValue('hasProtection', ' true ')).toBe(true);
    expect(normalizeKycValue('hasProtection', false)).toBe(false);
    expect(normalizeKycValue('residence', ' Hà Nội ')).toBe('Hà Nội');
    expect(normalizeKycValue('annualIncome', 12)).toBe('12');
  });

  it('composes text typed decomposed (DR-49)', () => {
    expect(normalizeKycValue('occupation', 'Kỹ sư'.normalize('NFD'))).toBe('Kỹ sư');
  });

  it('refuses a value of the wrong type', () => {
    expect(refuses('childrenCount', 'hai')).toThrow(RangeError);
    expect(refuses('childrenCount', 1.5)).toThrow(RangeError);
    expect(refuses('childrenCount', -1)).toThrow(RangeError);
    expect(refuses('hasProtection', 'có lẽ')).toThrow(RangeError);
    expect(refuses('hasProtection', 1)).toThrow(RangeError);
    expect(refuses('occupation', '   ')).toThrow(RangeError);
    expect(refuses('occupation', true)).toThrow(RangeError);
  });

  it('refuses a NUL, as stored text does', () => {
    expect(refuses('occupation', 'A\u0000B')).toThrow(RangeError);
    expect(refuses('childrenCount', '1\u0000')).toThrow(RangeError);
  });
});
