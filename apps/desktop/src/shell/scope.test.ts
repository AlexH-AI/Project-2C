import type { Person, Team } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { chooseKind, reOptions, resolveScope, type ScopeChoice } from './scope';

const teams: Team[] = [
  { id: 't1', name: 'Bình Minh' },
  { id: 't2', name: 'Sao Mai' },
];
const people: Person[] = [
  { id: 'tl1', name: 'An', role: 'TL', teamId: 't1' },
  { id: 're1', name: 'Bình', role: 'RE', teamId: 't1' },
  { id: 're2', name: 'Chi', role: 'RE', teamId: 't2' },
];

describe('resolveScope', () => {
  it('keeps everyone', () => {
    expect(resolveScope({ kind: 'all' }, teams, people)).toEqual({ kind: 'all' });
  });

  it('keeps the chosen team or RE while it still exists', () => {
    expect(resolveScope({ kind: 'team', id: 't2' }, teams, people)).toEqual({
      kind: 'team',
      teamId: 't2',
    });
    expect(resolveScope({ kind: 're', id: 're2' }, teams, people)).toEqual({
      kind: 're',
      reId: 're2',
    });
  });

  it('falls back to the first team or RE when none is chosen or it is gone', () => {
    expect(resolveScope({ kind: 'team' }, teams, people)).toEqual({ kind: 'team', teamId: 't1' });
    expect(resolveScope({ kind: 'team', id: 'gone' }, teams, people)).toEqual({
      kind: 'team',
      teamId: 't1',
    });
    // A TL has no metrics, so only an RE can be the scope.
    expect(resolveScope({ kind: 're', id: 'tl1' }, teams, people)).toEqual({
      kind: 're',
      reId: 're1',
    });
  });

  it('shows everyone when there is no team or RE to pick', () => {
    expect(resolveScope({ kind: 'team' }, [], people)).toEqual({ kind: 'all' });
    expect(resolveScope({ kind: 're' }, teams, [])).toEqual({ kind: 'all' });
  });
});

describe('chooseKind', () => {
  it('keeps the team or RE picked when its kind is clicked again', () => {
    expect(chooseKind({ kind: 'team', id: 't2' }, 'team')).toEqual({ kind: 'team', id: 't2' });
  });

  it('drops the team or RE picked when another kind is clicked', () => {
    expect(chooseKind({ kind: 'team', id: 't2' }, 're')).toEqual({ kind: 're' });
  });

  it('takes Everyone while a Team choice with no team to pick already shows everyone', () => {
    const choice: ScopeChoice = { kind: 'team' };
    expect(resolveScope(choice, [], people)).toEqual({ kind: 'all' });
    // Otherwise the scope jumps to Team as soon as a team is created.
    expect(resolveScope(chooseKind(choice, 'all'), teams, people)).toEqual({ kind: 'all' });
  });
});

describe('reOptions', () => {
  const threeTeams: Team[] = [
    { id: 'sm', name: 'Sao Mai' },
    { id: 'bm', name: 'Bình Minh' },
    { id: 'hd', name: 'Hừng Đông' },
  ];
  const staff: Person[] = [
    { id: 'r1', name: 'Yến', role: 'RE', teamId: 'sm' },
    { id: 'r2', name: 'Đạt', role: 'RE', teamId: 'bm' },
    { id: 'tl', name: 'Ánh', role: 'TL', teamId: 'bm' },
    { id: 'r3', name: 'Dung', role: 'RE', teamId: 'bm' },
    { id: 'is', name: 'Bảo', role: 'IS', teamId: 'hd' },
    { id: 'r4', name: 'Hà', role: 'RE', teamId: 'hd' },
    { id: 'bd', name: 'Cường', role: 'BD', teamId: 'sm' },
    { id: 'r5', name: 'An', role: 'RE', teamId: 'sm' },
    { id: 'bdm', name: 'Duy', role: 'BDM', teamId: 'hd' },
    { id: 'r6', name: 'Em', role: 'RE', teamId: 'bm' },
  ];

  it('orders the RE by team, then by name, with Vietnamese letters in place', () => {
    expect(reOptions(staff, threeTeams).map((option) => option.label)).toEqual([
      'Dung · Bình Minh',
      'Đạt · Bình Minh',
      'Em · Bình Minh',
      'Hà · Hừng Đông',
      'An · Sao Mai',
      'Yến · Sao Mai',
    ]);
  });

  it('is where the RE scope falls back to its first RE', () => {
    expect(resolveScope({ kind: 're' }, threeTeams, staff)).toEqual({ kind: 're', reId: 'r3' });
  });

  it('leaves out TL, IS, BD and BDM', () => {
    const values = reOptions(staff, threeTeams).map((option) => option.value);
    for (const id of ['tl', 'is', 'bd', 'bdm']) expect(values).not.toContain(id);
  });
});
