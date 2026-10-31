import { describe, expect, it } from 'vitest';
import { byName, LATIN } from './name-order';

const sorted = (names: readonly string[]) => [...names].sort(byName);

/** Fisher–Yates on a Lehmer generator (MINSTD): the same shuffles, one after another, each run. */
function shuffler(seed = 1) {
  return <T>(items: Iterable<T>): T[] => {
    const list = [...items];
    for (let i = list.length - 1; i > 0; i--) {
      seed = (seed * 48_271) % 2_147_483_647;
      const j = seed % (i + 1);
      [list[i], list[j]] = [list[j]!, list[i]!];
    }
    return list;
  };
}

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

  // Owner 23/10/2026 (T-291): the collator alone goes round on names mixing ASCII digits with others
  // ("01 2" < "0１a" < "0A" < "01 2", ICU 78), so a sort followed the order the names came in.
  it('reads each decimal digit of any script as an ASCII one before comparing', () => {
    const [a, b, c] = ['0A', '01 2', '0１a'];
    for (const round of [
      [a, b, c],
      [a, c, b],
      [b, a, c],
      [b, c, a],
      [c, a, b],
      [c, b, a],
    ]) {
      expect(sorted(round)).toEqual([a, b, c]);
    }
    expect(sorted(['Team 10', 'Team ٣', 'Team ２'])).toEqual(['Team ２', 'Team ٣', 'Team 10']);
    expect(sorted(['KH ٢', 'KH 2', 'KH ２'])).toEqual(['KH 2', 'KH ٢', 'KH ２']);
  });

  it('sorts 2 022 names mixing ASCII, full-width and Arabic-Indic digits one way, however shuffled', () => {
    // Every name of 1–4 of these characters, as stored: spaces single, none at either end.
    let names = [''];
    const all = new Set<string>();
    for (let length = 1; length <= 4; length++) {
      names = names.flatMap((name) => [...'01１٢aA '].map((char) => name + char));
      for (const name of names) all.add(name.replace(/ +/g, ' ').trim());
    }
    all.delete('');
    const shuffled = shuffler();
    expect(all.size).toBe(2022);
    const first = sorted(shuffled(all));
    for (let round = 1; round < 20; round++) expect(sorted(shuffled(all))).toEqual(first);
  });

  // DR6-136: the key of each name sorted is kept, for 20 000 names; past them the keys start again.
  it('sorts more names than it keeps the keys of in the same order', () => {
    const arabic = (n: number) =>
      String(n).replace(/\d/g, (digit) => String.fromCodePoint(0x660 + Number(digit)));
    // Each number by value, written in ASCII digits before Arabic-Indic ones: 20 002 names.
    const names = Array.from({ length: 10_001 }, (_, n) => [`KH ${n}`, `KH ${arabic(n)}`]).flat();

    expect(sorted(shuffler()(names))).toEqual(names);
  });

  it('skips no digit to read: the Latin characters a name may skip with have none but ASCII', () => {
    const digits: string[] = [];
    for (let code = 0; code <= 0x1eff; code++) {
      const char = String.fromCodePoint(code);
      if (LATIN.test(char) && /\p{Nd}/u.test(char)) digits.push(char);
    }
    expect(digits.join('')).toBe('0123456789');
    expect(LATIN.test('Nguyễn Văn Đức 2')).toBe(true);
    expect(LATIN.test('Team ２')).toBe(false);
  });
});
