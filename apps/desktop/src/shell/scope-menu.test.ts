import type { Person, Team } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { SECTIONS, teamPickerShown, usesScope } from './routes';
import { openTeamOf, pickScope, scopeLabel, scopeMenu, teamOfRow } from './scope-menu';

const teams: Team[] = [
  { id: 't2', name: 'Sao Mai' },
  { id: 't1', name: 'Bình Minh' },
];
const people: Person[] = [
  { id: 'tl1', name: 'An', role: 'TL', teamId: 't1' },
  { id: 'rm2', name: 'Chi', role: 'RM', teamId: 't1' },
  { id: 'rm1', name: 'Bình', role: 'RM', teamId: 't1' },
  { id: 'rm3', name: 'Dung', role: 'RM', teamId: 't2' },
];
const closed = { teamPicker: true, openTeam: null };
const keys = (rows: readonly { key: string }[]) => rows.map((row) => row.key);

describe('scopeMenu (mockup app-shell.html #toolbar)', () => {
  it('lists everyone, then each team by name with its number of RM', () => {
    const rows = scopeMenu({ kind: 'all' }, teams, people, closed);

    expect(rows).toEqual([
      { key: 'all', label: 'Toàn bộ', checked: true },
      { key: 'team:t1', label: 'Team Bình Minh', note: '2 RM', expanded: false, divided: true },
      { key: 'team:t2', label: 'Team Sao Mai', note: '1 RM', expanded: false, divided: false },
    ]);
  });

  it('opens a team into "Cả team" and its RM by name; the TL is no row', () => {
    const rows = scopeMenu({ kind: 'all' }, teams, people, { teamPicker: true, openTeam: 't1' });

    expect(rows.slice(1, 5)).toEqual([
      { key: 'team:t1', label: 'Team Bình Minh', note: '2 RM', expanded: true, divided: true },
      { key: 'whole:t1', label: 'Cả team', sub: true, checked: false },
      { key: 'rm:rm1', label: 'Bình', sub: true, checked: false },
      { key: 'rm:rm2', label: 'Chi', sub: true, checked: false },
    ]);
  });

  it('checks the one row of the scope shown: the whole team, or the RM', () => {
    const open = { teamPicker: true, openTeam: 't1' };
    const checked = (rows: readonly { key: string; checked?: boolean }[]) =>
      keys(rows.filter((row) => row.checked));

    expect(checked(scopeMenu({ kind: 'team', teamId: 't1' }, teams, people, open))).toEqual([
      'whole:t1',
    ]);
    expect(checked(scopeMenu({ kind: 'rm', rmId: 'rm2' }, teams, people, open))).toEqual([
      'rm:rm2',
    ]);
    // The row of the scope is under a closed team: none is checked until it opens.
    expect(checked(scopeMenu({ kind: 'rm', rmId: 'rm3' }, teams, people, open))).toEqual([]);
  });

  it('on Tổng quan every team is one row, and a team opens into its RM alone (spec Phase 4 §4.3)', () => {
    const rows = scopeMenu({ kind: 'team', teamId: 't2' }, teams, people, {
      teamPicker: false,
      openTeam: 't2',
    });

    expect(rows).toEqual([
      { key: 'all', label: 'Toàn bộ', checked: false },
      { key: 'teams', label: 'Mọi team', checked: true },
      { key: 'team:t1', label: 'Team Bình Minh', note: '2 RM', expanded: false, divided: true },
      { key: 'team:t2', label: 'Team Sao Mai', note: '1 RM', expanded: true, divided: false },
      { key: 'rm:rm3', label: 'Dung', sub: true, checked: false },
    ]);
  });

  it('keeps the rule of each screen: only Tổng quan has no team of its own to pick', () => {
    const withMenu = SECTIONS.filter((screen) => usesScope(screen));
    const picksTeam = (screen: (typeof SECTIONS)[number]) =>
      keys(
        scopeMenu({ kind: 'all' }, teams, people, {
          teamPicker: teamPickerShown(screen),
          openTeam: 't1',
        }),
      ).includes('whole:t1');

    expect(withMenu).toEqual(['overview', 'appointments', 'customers', 'reports']);
    expect(withMenu.filter(picksTeam)).toEqual(['appointments', 'customers', 'reports']);
  });
});

describe('pickScope', () => {
  it('picks everyone, a whole team or an RM', () => {
    expect(pickScope('all', { kind: 'rm', id: 'rm1' })).toEqual({ kind: 'all' });
    expect(pickScope('whole:t2', { kind: 'all' })).toEqual({ kind: 'team', id: 't2' });
    expect(pickScope('rm:rm3', { kind: 'team', id: 't1' })).toEqual({ kind: 'rm', id: 'rm3' });
  });

  it('"Cả team" drops the RM picked within the team', () => {
    expect(pickScope('whole:t1', { kind: 'team', id: 't1', rmInTeam: 'rm1' })).toEqual({
      kind: 'team',
      id: 't1',
    });
  });

  it('"Mọi team" keeps the team already chosen, for the screens that show one', () => {
    const choice = { kind: 'team', id: 't2' } as const;

    expect(pickScope('teams', choice)).toBe(choice);
    expect(pickScope('teams', { kind: 'rm', id: 'rm1' })).toEqual({ kind: 'team' });
  });

  it('a team row picks nothing: it only opens its team', () => {
    expect(pickScope('team:t1', { kind: 'all' })).toBeNull();
    expect(teamOfRow('team:t1')).toBe('t1');
    expect(teamOfRow('whole:t1')).toBeNull();
    expect(teamOfRow('all')).toBeNull();
  });
});

describe('scopeLabel (the words on the pill)', () => {
  it('names everyone, the team, or the RM alone', () => {
    expect(scopeLabel({ kind: 'all' }, teams, people, true)).toBe('Toàn bộ');
    expect(scopeLabel({ kind: 'team', teamId: 't2' }, teams, people, true)).toBe('Team Sao Mai');
    expect(scopeLabel({ kind: 'rm', rmId: 'rm1' }, teams, people, true)).toBe('Bình');
  });

  it('says "Mọi team" where the Team scope adds up every team', () => {
    expect(scopeLabel({ kind: 'team', teamId: 't2' }, teams, people, false)).toBe('Mọi team');
  });

  it('leaves the name of an RM that is gone empty', () => {
    expect(scopeLabel({ kind: 'rm', rmId: 'gone' }, teams, people, true)).toBe('');
  });
});

describe('openTeamOf (the team open when the menu opens)', () => {
  it('is the team of the scope, or of its RM', () => {
    expect(openTeamOf({ kind: 'team', teamId: 't2' }, people, true)).toBe('t2');
    expect(openTeamOf({ kind: 'rm', rmId: 'rm1' }, people, true)).toBe('t1');
  });

  it('is none for everyone, for an RM that is gone, and for "Mọi team"', () => {
    expect(openTeamOf({ kind: 'all' }, people, true)).toBeNull();
    expect(openTeamOf({ kind: 'rm', rmId: 'gone' }, people, true)).toBeNull();
    expect(openTeamOf({ kind: 'team', teamId: 't2' }, people, false)).toBeNull();
  });
});
