import { describe, expect, it } from 'vitest';
import { byName } from './name-order';

const sorted = (names: readonly string[]) => [...names].sort(byName);

describe('byName', () => {
  it('orders Vietnamese letters as the alphabet does: Đ after D, before E; not after Z', () => {
    expect(sorted(['Zeta', 'đức', 'Đông', 'An', 'Dương', 'Em'])).toEqual([
      'An',
      'Dương',
      'Đông',
      'đức',
      'Em',
      'Zeta',
    ]);
  });

  it('orders a letter with a mark after the plain one, and lower case beside upper case', () => {
    expect(sorted(['Ánh', 'Bình', 'an', 'Ân', 'An'])).toEqual(['an', 'An', 'Ánh', 'Ân', 'Bình']);
  });

  it('orders the numbers inside a name by value: Team 2 before Team 10', () => {
    expect(sorted(['Team 10', 'Team 2', 'Team 1'])).toEqual(['Team 1', 'Team 2', 'Team 10']);
  });

  it('ties only the same name, so every list shows one order', () => {
    expect(byName('Lan', 'Lan')).toBe(0);
    expect(byName('an', 'An')).not.toBe(0);
  });
});
