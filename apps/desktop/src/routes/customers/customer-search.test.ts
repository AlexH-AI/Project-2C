import type { CustomerRecord } from '@p2c/db';
import type { Person, Scope, Team } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { customerIndex, customerMatches, foundIn, type CustomerFound } from './customer-search';

const teams: Team[] = [
  { id: 't1', name: 'Sao Mai' },
  { id: 't2', name: 'Bình Minh' },
];

const people: Person[] = [
  { id: 'rm1', name: 'Hoàng Văn Tùng', role: 'RM', teamId: 't1' },
  { id: 'rm2', name: 'Lê Thu Hà', role: 'RM', teamId: 't2' },
  { id: 'rm3', name: 'Phan Không Team', role: 'RM', teamId: null },
];

const customer = (
  code: string,
  name: string,
  rmId = 'rm1',
  stage: CustomerRecord['stage'] = 'N3',
): CustomerRecord => ({ id: code, code, name, rmId, stage, birthDate: null, gender: null });

const ALL: Scope = { kind: 'all' };
const SAO_MAI: Scope = { kind: 'team', teamId: 't1' };

const search = (customers: CustomerRecord[], query: string, scope: Scope = ALL) =>
  customerMatches(customerIndex({ customers, people, teams }), query, scope);

/** The names of the list under the field, group by group. */
const names = (found: CustomerFound | null) =>
  found && {
    inside: found.inside.map((hit) => hit.customer.name),
    outside: found.outside.map((hit) => hit.customer.name),
  };

describe('customerMatches (the search of Khách hàng, spec Phase 6 phản hồi §5)', () => {
  it('finds a name typed without accents, in any case', () => {
    const found = search(
      [customer('K-4H2N', 'Nguyễn Văn Hùng'), customer('K-9A2B', 'Trần Thị Mai')],
      'nguyen van hu',
    );
    expect(names(found)).toEqual({ inside: ['Nguyễn Văn Hùng'], outside: [] });
    expect(names(search([customer('K-4H2N', 'Nguyễn Văn Hùng')], 'NGUYỄN VĂN HU'))).toEqual({
      inside: ['Nguyễn Văn Hùng'],
      outside: [],
    });
  });

  it('finds a customer by its code, or a part of it', () => {
    const customers = [customer('K-4H2N', 'Nguyễn Văn Hùng'), customer('K-9A2B', 'Trần Thị Mai')];
    expect(names(search(customers, 'K-4H2N'))?.inside).toEqual(['Nguyễn Văn Hùng']);
    expect(names(search(customers, 'k-9a'))?.inside).toEqual(['Trần Thị Mai']);
  });

  // DR6-197: "KH ２" is found by "KH 2", as `byName` puts them side by side.
  it('finds a full-width digit by the ASCII one', () => {
    expect(names(search([customer('K-0001', 'KH ２')], 'KH 2'))?.inside).toEqual(['KH ２']);
  });

  it('lists the name that starts with the text, then a word, then the middle, then the code', () => {
    const found = search(
      [
        customer('K-AN00', 'Lý Thị Bình'), // the code holds "an"
        customer('K-0002', 'Trần Lan'), // "an" in the middle of a word
        customer('K-0003', 'Lê An'), // a word starts with "an"
        customer('K-0004', 'Ánh Dương'), // the name starts with "an"
        customer('K-0005', 'An Bình'),
        customer('K-0006', 'Bùi Thị Hoa'), // no match
      ],
      'an',
    );
    expect(names(found)?.inside).toEqual([
      'An Bình',
      'Ánh Dương',
      'Lê An',
      'Trần Lan',
      'Lý Thị Bình',
    ]);
  });

  it('keeps the order of names of the app among matches alike, at most 8', () => {
    const found = search(
      ['Hà 10', 'Hà 2', 'Hà 1', 'Hà 9', 'Hà 3', 'Hà 8', 'Hà 4', 'Hà 7', 'Hà 5', 'Hà 6'].map(
        (name, i) => customer(`K-H00${i}`, name),
      ),
      'ha',
    );
    expect(names(found)?.inside).toEqual([
      'Hà 1',
      'Hà 2',
      'Hà 3',
      'Hà 4',
      'Hà 5',
      'Hà 6',
      'Hà 7',
      'Hà 8',
    ]);
    expect(found?.ids.size).toBe(10);
  });

  it('finds a closed customer too', () => {
    const found = search(
      [
        customer('K-0001', 'Đỗ Hoãn', 'rm1', 'ON_HOLD'),
        customer('K-0002', 'Đỗ Mất', 'rm1', 'LOST'),
      ],
      'do',
    );
    expect(names(found)?.inside).toEqual(['Đỗ Hoãn', 'Đỗ Mất']);
  });

  it('puts a match out of the view in a group of its own, with its RM and team', () => {
    const found = search(
      [
        customer('K-0001', 'Nguyễn Văn Hùng', 'rm1'),
        customer('K-0002', 'Nguyễn Văn Hưng', 'rm2'),
        customer('K-0003', 'Nguyễn Văn Hữu', 'rm3'),
      ],
      'nguyen van h',
      SAO_MAI,
    );
    expect(names(found)).toEqual({
      inside: ['Nguyễn Văn Hùng'],
      outside: ['Nguyễn Văn Hưng', 'Nguyễn Văn Hữu'],
    });
    expect(found?.inside[0]).toMatchObject({ rm: people[0], team: teams[0] });
    expect(found?.outside.map((hit) => [hit.rm?.name, hit.team?.name])).toEqual([
      ['Lê Thu Hà', 'Bình Minh'],
      ['Phan Không Team', undefined],
    ]);
    expect([...(found?.ids ?? [])].sort()).toEqual(['K-0001', 'K-0002', 'K-0003']);
  });

  it('is nothing for nothing typed, and empty for no match', () => {
    const customers = [customer('K-0001', 'Nguyễn Văn Hùng')];
    expect(search(customers, '  ')).toBeNull();
    expect(names(search(customers, 'tran van x'))).toEqual({ inside: [], outside: [] });
    expect(search(customers, 'tran van x')?.ids.size).toBe(0);
  });
});

describe('foundIn (the part of a name or code the text matches)', () => {
  it('finds the part typed without accents, on the text as written', () => {
    expect(foundIn('Nguyễn Văn Hùng', 'nguyen van hu')).toEqual([0, 13]);
    expect(foundIn('Trần Lan', 'AN')).toEqual([2, 4]); // the first place it is
    expect(foundIn('Lê 😀 An', 'an')).toEqual([6, 8]); // in code units, as `slice` cuts
    expect(foundIn('KH ２', 'kh 2')).toEqual([0, 4]);
    expect(foundIn('K-4H2N', 'h2n')).toEqual([3, 6]);
  });

  it('is null for no match and for nothing typed', () => {
    expect(foundIn('Nguyễn Văn Hùng', 'tran')).toBeNull();
    expect(foundIn('Nguyễn Văn Hùng', ' ')).toBeNull();
  });
});
