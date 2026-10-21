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

  // DR6-112: the collator ties numbers of one value written apart; their order is still one.
  it('orders two names of one number written apart, whatever order they come in', () => {
    const pairs = [
      ['Team 01', 'Team 1'],
      ['KH 007', 'KH 7'],
      ['Team ２', 'Team 2'],
    ] as const;
    for (const [a, b] of pairs) {
      expect(byName(a, b)).not.toBe(0);
      expect(Math.sign(byName(a, b))).toBe(-Math.sign(byName(b, a)));
    }
    const names = pairs.flat();
    expect(sorted(names)).toEqual(sorted([...names].reverse()));
    expect(sorted(['Team 10', 'Team 01', 'Team 2'])).toEqual(['Team 01', 'Team 2', 'Team 10']);
  });
});
