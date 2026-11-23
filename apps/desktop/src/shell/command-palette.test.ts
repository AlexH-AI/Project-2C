import type { CustomerRecord } from '@p2c/db';
import { calendarDate, type Person, type Team } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { customerIndex } from '../routes/customers/customer-search';
import { paletteResults } from './command-palette';

const teams: Team[] = [
  { id: 't1', name: 'Sao Mai' },
  { id: 't2', name: 'Bình Minh' },
];

const people: Person[] = [
  { id: 'rm1', name: 'Hoàng Văn Tùng', role: 'RM', teamId: 't1' },
  { id: 'rm2', name: 'Nguyễn Văn Hùng', role: 'RM', teamId: 't1' },
  { id: 'rm3', name: 'Lê Thu Hà', role: 'RM', teamId: 't2' },
  { id: 'tl1', name: 'Nguyễn Văn Huân', role: 'TL', teamId: 't2' },
];

const customer = (
  code: string,
  name: string,
  stage: CustomerRecord['stage'] = 'N3',
): CustomerRecord => ({ id: code, code, name, rmId: 'rm1', stage, birthDate: null, gender: null });

// The sample of the mockup (search-rm-team.html `#palette`): four names start with "nguyen van hu",
// others hold it in a word or in the middle; one is closed.
const customers = [
  customer('K-1A1A', 'Trần Nguyễn Văn Hưng'),
  customer('K-2B2B', 'Nguyễn Văn Hùng'),
  customer('K-3C3C', 'Nguyễn Văn Huy', 'LOST'),
  customer('K-4D4D', 'Nguyễn Văn Hữu'),
  customer('K-5E5E', 'Nguyễn Văn Hưng'),
  customer('K-9A2B', 'Trần Thị Mai'),
  customer('K-6F6F', 'Phạm Thị Lan', 'ON_HOLD'),
];

const today = calendarDate(2026, 11, 10);
const data = { index: customerIndex({ customers, people, teams }), people, teams, today };
const search = (query: string, list = customers) =>
  paletteResults(query, { ...data, index: customerIndex({ customers: list, people, teams }) });

describe('paletteResults (the command box, mockup search-rm-team.html `#palette`)', () => {
  it('puts the names that start with the text first, a word of a name next, by the order of names', () => {
    const found = search('nguyen van hu');
    expect(found.customers.map((hit) => hit.customer.name)).toEqual([
      'Nguyễn Văn Hùng',
      'Nguyễn Văn Huy',
      'Nguyễn Văn Hưng',
      'Nguyễn Văn Hữu',
      'Trần Nguyễn Văn Hưng',
    ]);
    // A closed customer is there; every customer, whatever the view.
    expect(found.customers.find((hit) => hit.customer.stage === 'LOST')).toBeDefined();
    expect(found.customers[0]).toMatchObject({
      rm: { name: 'Hoàng Văn Tùng' },
      team: { name: 'Sao Mai' },
    });
  });

  it('finds an RM by name, with the team, and only RMs', () => {
    const found = search('nguyen van hu');
    expect(found.rms.map((hit) => [hit.rm.name, hit.team?.name])).toEqual([
      ['Nguyễn Văn Hùng', 'Sao Mai'],
    ]);
  });

  it('finds a customer by its code, or a part of it, accents and case aside', () => {
    expect(search('k-9a').customers.map((hit) => hit.customer.name)).toEqual(['Trần Thị Mai']);
    expect(search('PHAM THI').customers.map((hit) => hit.customer.code)).toEqual(['K-6F6F']);
  });

  it('caps each group: 8 customers, 4 RMs, 4 screens, 4 commands', () => {
    const many = Array.from({ length: 12 }, (_, at) =>
      customer(`K-${String(at).padStart(4, '0')}`, `An ${String(at).padStart(2, '0')}`),
    );
    expect(search('an', many).customers).toHaveLength(8);
    const rms: Person[] = Array.from({ length: 6 }, (_, at) => ({
      id: `r${at}`,
      name: `An RM ${at}`,
      role: 'RM',
      teamId: 't1',
    }));
    expect(paletteResults('an', { ...data, people: rms }).rms).toHaveLength(4);
    // Five screens hold an "a", five commands an "n": the caps keep 4 of each.
    expect(search('a').screens).toHaveLength(4);
    expect(search('n').commands).toHaveLength(4);
  });

  it('finds a screen and a command by their names, or by the other words of a command', () => {
    expect(search('bao cao').screens).toEqual(['reports']);
    expect(search('lich hen moi').commands).toEqual(['appointment']);
    expect(search('backup').commands).toEqual(['backup']);
    expect(search('an ten').commands).toEqual(['mask']);
  });

  it('with nothing typed, shows the screens and the first commands, no customer or RM', () => {
    expect(search('  ')).toEqual({
      customers: [],
      rms: [],
      screens: ['overview', 'appointments', 'customers', 'reports', 'team', 'settings'],
      commands: ['appointment', 'customer', 'team'],
    });
  });

  it('finds nothing for "xyz"', () => {
    expect(search('xyz')).toEqual({ customers: [], rms: [], screens: [], commands: [] });
  });
});
