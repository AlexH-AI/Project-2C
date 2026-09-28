import type { Person, Team } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { groupByTeam, initials } from './team-view';

const SAO_MAI: Team = { id: 't1', name: 'Sao Mai' };
const BINH_MINH: Team = { id: 't2', name: 'Bình Minh' };

const person = (id: string, role: Person['role'], teamId: string | null): Person => ({
  id,
  name: id,
  role,
  teamId,
});

describe('groupByTeam', () => {
  it('puts each person under their team and the ones without a team under shared support', () => {
    const people = [
      person('re1', 'RE', 't1'),
      person('is', 'IS', null),
      person('tl1', 'TL', 't1'),
      person('re2', 'RE', 't1'),
      person('bd', 'BD', 't2'),
    ];

    const view = groupByTeam([SAO_MAI, BINH_MINH], people);

    expect(view.teams.map((entry) => [entry.team.name, entry.members.map((p) => p.id)])).toEqual([
      ['Sao Mai', ['re1', 'tl1', 're2']],
      ['Bình Minh', ['bd']],
    ]);
    expect(view.teams[0]).toMatchObject({ tl: 1, re: 2 });
    expect(view.teams[1]).toMatchObject({ tl: 0, re: 0 });
    expect(view.shared.map((p) => p.id)).toEqual(['is']);
  });

  it('keeps an empty team', () => {
    const view = groupByTeam([SAO_MAI], []);

    expect(view.teams).toEqual([{ team: SAO_MAI, members: [], tl: 0, re: 0 }]);
    expect(view.shared).toEqual([]);
  });
});

describe('initials', () => {
  it('takes the family and the given name', () => {
    expect(initials('Nguyễn Thu Hà')).toBe('NH');
    expect(initials('  đỗ   khánh linh ')).toBe('ĐL');
    expect(initials('Huy')).toBe('H');
  });
});
