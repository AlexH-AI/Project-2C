import type { Person, Team } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { rmMatches } from './rm-search';

const rm = (id: string, name: string, teamId = 'sm'): Person => ({ id, name, role: 'RM', teamId });
const teams: Team[] = [
  { id: 'sm', name: 'Sao Mai' },
  { id: 'bm', name: 'Bình Minh' },
];
const people: Person[] = [
  rm('huy', 'Nguyễn Văn Huy'),
  rm('mid', 'Lê Thanguyen'),
  rm('hung', 'Nguyễn Văn Hùng'),
  rm('word', 'Trần An Nguyên'),
  rm('hung-bm', 'Nguyễn Văn Hùng', 'bm'),
  { id: 'tl', name: 'Nguyễn Văn Hữu', role: 'TL', teamId: 'sm' },
  { id: 'is', name: 'Nguyễn Văn Hưng', role: 'IS', teamId: null },
];
const found = (query: string, among = people) =>
  rmMatches(among, teams, query)?.map(({ rm, team }) => `${rm.name} – ${team?.name}`);

// C2b (mockup search-rm-team.html #team): as the search of Khách hàng finds a customer (C1).
describe('rmMatches', () => {
  it('finds an RM by a name typed without accents, as "RM Họ tên – Team"', () => {
    expect(found('nguyen van hu')).toEqual([
      'Nguyễn Văn Hùng – Bình Minh',
      'Nguyễn Văn Hùng – Sao Mai',
      'Nguyễn Văn Huy – Sao Mai',
    ]);
  });

  it('puts a name that starts with the text first, then a word of it, then within; RM only', () => {
    expect(found('NGUYEN')).toEqual([
      'Nguyễn Văn Hùng – Bình Minh',
      'Nguyễn Văn Hùng – Sao Mai',
      'Nguyễn Văn Huy – Sao Mai',
      'Trần An Nguyên – Sao Mai',
      'Lê Thanguyen – Sao Mai',
    ]);
  });

  it('lists the best 8, and nothing for nothing typed', () => {
    const many = Array.from({ length: 10 }, (_, i) => rm(`r${i}`, `Lan ${i}`));
    expect(found('lan', many)).toHaveLength(8);
    expect(found(' ​ ')).toBeUndefined();
    expect(found('xyz')).toEqual([]);
  });
});
