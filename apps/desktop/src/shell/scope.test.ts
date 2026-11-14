import type { Person, Team } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import {
  chooseKind,
  narrowScope,
  rmOptions,
  resolveScope,
  teamRms,
  type ScopeChoice,
} from './scope';

const teams: Team[] = [
  { id: 't1', name: 'Bình Minh' },
  { id: 't2', name: 'Sao Mai' },
];
const people: Person[] = [
  { id: 'tl1', name: 'An', role: 'TL', teamId: 't1' },
  { id: 're1', name: 'Bình', role: 'RM', teamId: 't1' },
  { id: 're2', name: 'Chi', role: 'RM', teamId: 't2' },
];

describe('resolveScope', () => {
  it('keeps everyone', () => {
    expect(resolveScope({ kind: 'all' }, teams, people)).toEqual({ kind: 'all' });
  });

  it('keeps the chosen team or RM while it still exists', () => {
    expect(resolveScope({ kind: 'team', id: 't2' }, teams, people)).toEqual({
      kind: 'team',
      teamId: 't2',
    });
    expect(resolveScope({ kind: 'rm', id: 're2' }, teams, people)).toEqual({
      kind: 'rm',
      rmId: 're2',
    });
  });

  it('falls back to the first team or RM when none is chosen or it is gone', () => {
    expect(resolveScope({ kind: 'team' }, teams, people)).toEqual({ kind: 'team', teamId: 't1' });
    expect(resolveScope({ kind: 'team', id: 'gone' }, teams, people)).toEqual({
      kind: 'team',
      teamId: 't1',
    });
    // A TL has no metrics, so only an RM can be the scope.
    expect(resolveScope({ kind: 'rm', id: 'tl1' }, teams, people)).toEqual({
      kind: 'rm',
      rmId: 're1',
    });
  });

  it('shows everyone when there is no team or RM to pick', () => {
    expect(resolveScope({ kind: 'team' }, [], people)).toEqual({ kind: 'all' });
    expect(resolveScope({ kind: 'rm' }, teams, [])).toEqual({ kind: 'all' });
  });
});

describe('chooseKind', () => {
  it('keeps the team or RM picked when its kind is clicked again', () => {
    expect(chooseKind({ kind: 'team', id: 't2' }, 'team')).toEqual({ kind: 'team', id: 't2' });
  });

  it('drops the team or RM picked when another kind is clicked', () => {
    expect(chooseKind({ kind: 'team', id: 't2' }, 'rm')).toEqual({ kind: 'rm' });
  });

  it('drops the RM picked within the team when another kind is clicked', () => {
    expect(chooseKind({ kind: 'team', id: 't1', rmInTeam: 're1' }, 'all')).toEqual({
      kind: 'all',
    });
    expect(chooseKind({ kind: 'team', id: 't1', rmInTeam: 're1' }, 'rm')).toEqual({ kind: 'rm' });
  });

  it('takes Everyone while a Team choice with no team to pick already shows everyone', () => {
    const choice: ScopeChoice = { kind: 'team' };
    expect(resolveScope(choice, [], people)).toEqual({ kind: 'all' });
    // Otherwise the scope jumps to Team as soon as a team is created.
    expect(resolveScope(chooseKind(choice, 'all'), teams, people)).toEqual({ kind: 'all' });
  });
});

describe('rmOptions', () => {
  const threeTeams: Team[] = [
    { id: 'sm', name: 'Sao Mai' },
    { id: 'bm', name: 'Bình Minh' },
    { id: 'hd', name: 'Hừng Đông' },
  ];
  const staff: Person[] = [
    { id: 'r1', name: 'Yến', role: 'RM', teamId: 'sm' },
    { id: 'r2', name: 'Đạt', role: 'RM', teamId: 'bm' },
    { id: 'tl', name: 'Ánh', role: 'TL', teamId: 'bm' },
    { id: 'r3', name: 'Dung', role: 'RM', teamId: 'bm' },
    { id: 'is', name: 'Bảo', role: 'IS', teamId: 'hd' },
    { id: 'r4', name: 'Hà', role: 'RM', teamId: 'hd' },
    { id: 'bd', name: 'Cường', role: 'BD', teamId: 'sm' },
    { id: 'r5', name: 'An', role: 'RM', teamId: 'sm' },
    { id: 'bdm', name: 'Duy', role: 'BDM', teamId: 'hd' },
    { id: 'r6', name: 'Em', role: 'RM', teamId: 'bm' },
  ];

  it('orders the RM by team, then by name, with Vietnamese letters in place', () => {
    expect(rmOptions(staff, threeTeams).map((option) => option.label)).toEqual([
      'Dung · Bình Minh',
      'Đạt · Bình Minh',
      'Em · Bình Minh',
      'Hà · Hừng Đông',
      'An · Sao Mai',
      'Yến · Sao Mai',
    ]);
  });

  it('is where the RM scope falls back to its first RM', () => {
    expect(resolveScope({ kind: 'rm' }, threeTeams, staff)).toEqual({ kind: 'rm', rmId: 'r3' });
  });

  it('leaves out TL, IS, BD and BDM', () => {
    const values = rmOptions(staff, threeTeams).map((option) => option.value);
    for (const id of ['tl', 'is', 'bd', 'bdm']) expect(values).not.toContain(id);
  });
});

describe('narrowScope', () => {
  const team = { kind: 'team', teamId: 't1' } as const;

  it('narrows a team to the RM picked within it', () => {
    expect(narrowScope(team, 're1', people)).toEqual({ kind: 'rm', rmId: 're1' });
  });

  it('keeps the team when the RM picked is not one of its RM', () => {
    expect(narrowScope(team, undefined, people)).toBe(team);
    // Of another team, moved away, or deleted (not listed any more).
    expect(narrowScope(team, 're2', people)).toBe(team);
    expect(narrowScope(team, 'gone', people)).toBe(team);
    // A TL is not an RM.
    expect(narrowScope(team, 'tl1', people)).toBe(team);
  });

  it('leaves the Everyone and RM scopes as they are', () => {
    expect(narrowScope({ kind: 'all' }, 're1', people)).toEqual({ kind: 'all' });
    expect(narrowScope({ kind: 'rm', rmId: 're2' }, 're1', people)).toEqual({
      kind: 'rm',
      rmId: 're2',
    });
  });
});

describe('teamRms', () => {
  it('lists the RM of one team by name, with Vietnamese letters in place', () => {
    const staff: Person[] = [
      { id: 'r1', name: 'Em', role: 'RM', teamId: 'bm' },
      { id: 'tl', name: 'Ánh', role: 'TL', teamId: 'bm' },
      { id: 'r2', name: 'Đạt', role: 'RM', teamId: 'bm' },
      { id: 'r3', name: 'An', role: 'RM', teamId: 'sm' },
      { id: 'r4', name: 'Dung', role: 'RM', teamId: 'bm' },
    ];
    expect(teamRms(staff, 'bm').map((rm) => rm.name)).toEqual(['Dung', 'Đạt', 'Em']);
  });
});
