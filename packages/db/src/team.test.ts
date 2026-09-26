import { describe, expect, it, vi } from 'vitest';
import { openDatabase } from './database';
import { DbError } from './errors';
import {
  createPerson,
  createTeam,
  getPerson,
  getTeam,
  listPeople,
  listTeams,
  renameTeam,
  restorePerson,
  restoreTeam,
  softDeletePerson,
  softDeleteTeam,
  updatePerson,
} from './team';

async function setup() {
  let clock = Date.UTC(2026, 8, 26, 8, 0, 0);
  const persist = vi.fn();
  const db = await openDatabase({ persist, now: () => new Date(clock++) });
  persist.mockClear();
  return { db, persist };
}

function codeOf(fn: () => unknown): string | undefined {
  try {
    fn();
  } catch (error) {
    if (error instanceof DbError) return error.code;
    throw error;
  }
  return undefined;
}

describe('teams', () => {
  it('creates a team and reads it back as a domain Team', async () => {
    const { db } = await setup();

    const team = createTeam(db, { name: '  Sao Mai ' });

    expect(team).toEqual({ id: expect.stringMatching(/^[0-9A-Z]{26}$/), name: 'Sao Mai' });
    expect(getTeam(db, team.id)).toEqual(team);
    expect(listTeams(db)).toEqual([team]);
  });

  it('lists teams by name', async () => {
    const { db } = await setup();
    createTeam(db, { name: 'Sao Mai' });
    createTeam(db, { name: 'Bình Minh' });

    expect(listTeams(db).map((t) => t.name)).toEqual(['Bình Minh', 'Sao Mai']);
  });

  it('rejects an empty or duplicate name', async () => {
    const { db } = await setup();
    const team = createTeam(db, { name: 'Sao Mai' });
    const other = createTeam(db, { name: 'Bình Minh' });

    expect(codeOf(() => createTeam(db, { name: '   ' }))).toBe('NAME_REQUIRED');
    expect(codeOf(() => createTeam(db, { name: 'Sao Mai' }))).toBe('TEAM_NAME_TAKEN');
    expect(codeOf(() => renameTeam(db, other.id, 'Sao Mai'))).toBe('TEAM_NAME_TAKEN');
    expect(renameTeam(db, team.id, 'Sao Mai')).toEqual(team);
  });

  it('renames a team', async () => {
    const { db } = await setup();
    const team = createTeam(db, { name: 'Sao Mai' });

    expect(renameTeam(db, team.id, 'Hừng Đông')).toEqual({ id: team.id, name: 'Hừng Đông' });
    expect(getTeam(db, team.id)?.name).toBe('Hừng Đông');
  });

  it('reports an unknown team', async () => {
    const { db } = await setup();

    expect(codeOf(() => renameTeam(db, 'nope', 'X'))).toBe('TEAM_NOT_FOUND');
    expect(codeOf(() => softDeleteTeam(db, 'nope'))).toBe('TEAM_NOT_FOUND');
    expect(codeOf(() => restoreTeam(db, 'nope'))).toBe('TEAM_NOT_FOUND');
    expect(getTeam(db, 'nope')).toBeUndefined();
  });

  it('hides a soft-deleted team and brings it back on restore', async () => {
    const { db } = await setup();
    const team = createTeam(db, { name: 'Sao Mai' });

    softDeleteTeam(db, team.id);
    expect(listTeams(db)).toEqual([]);
    expect(getTeam(db, team.id)).toBeUndefined();
    expect(codeOf(() => renameTeam(db, team.id, 'X'))).toBe('TEAM_NOT_FOUND');
    // The name is free again while the team is deleted.
    const reused = createTeam(db, { name: 'Sao Mai' });

    expect(codeOf(() => restoreTeam(db, team.id))).toBe('TEAM_NAME_TAKEN');
    softDeleteTeam(db, reused.id);
    restoreTeam(db, team.id);
    expect(listTeams(db)).toEqual([team]);
  });

  it('refuses to delete a team that still has people', async () => {
    const { db } = await setup();
    const team = createTeam(db, { name: 'Sao Mai' });
    const re = createPerson(db, { name: 'An', role: 'RE', teamId: team.id });

    expect(codeOf(() => softDeleteTeam(db, team.id))).toBe('TEAM_HAS_MEMBERS');

    softDeletePerson(db, re.id);
    softDeleteTeam(db, team.id);
    expect(listTeams(db)).toEqual([]);
  });
});

describe('people', () => {
  it('creates people and reads them back as domain Person', async () => {
    const { db } = await setup();
    const team = createTeam(db, { name: 'Sao Mai' });

    const re = createPerson(db, { name: ' An ', role: 'RE', teamId: team.id });
    const is = createPerson(db, { name: 'Bình', role: 'IS', teamId: null });

    expect(re).toEqual({ id: expect.any(String), name: 'An', role: 'RE', teamId: team.id });
    expect(is.teamId).toBeNull();
    expect(getPerson(db, re.id)).toEqual(re);
    expect(listPeople(db)).toEqual([re, is]);
  });

  it('requires a team for RE and TL only', async () => {
    const { db } = await setup();

    expect(codeOf(() => createPerson(db, { name: 'An', role: 'RE', teamId: null }))).toBe(
      'TEAM_REQUIRED',
    );
    expect(codeOf(() => createPerson(db, { name: 'An', role: 'TL', teamId: null }))).toBe(
      'TEAM_REQUIRED',
    );
    for (const role of ['IS', 'BD', 'BDM'] as const) {
      expect(createPerson(db, { name: role, role, teamId: null }).teamId).toBeNull();
    }
  });

  it('rejects an empty name or a team that does not exist', async () => {
    const { db } = await setup();
    const team = createTeam(db, { name: 'Sao Mai' });
    softDeleteTeam(db, team.id);

    expect(codeOf(() => createPerson(db, { name: ' ', role: 'IS', teamId: null }))).toBe(
      'NAME_REQUIRED',
    );
    expect(codeOf(() => createPerson(db, { name: 'An', role: 'RE', teamId: 'nope' }))).toBe(
      'TEAM_NOT_FOUND',
    );
    expect(codeOf(() => createPerson(db, { name: 'An', role: 'RE', teamId: team.id }))).toBe(
      'TEAM_NOT_FOUND',
    );
  });

  it('updates name, role and team with the same rules', async () => {
    const { db } = await setup();
    const saoMai = createTeam(db, { name: 'Sao Mai' });
    const binhMinh = createTeam(db, { name: 'Bình Minh' });
    const person = createPerson(db, { name: 'An', role: 'RE', teamId: saoMai.id });

    expect(updatePerson(db, person.id, { teamId: binhMinh.id })).toEqual({
      ...person,
      teamId: binhMinh.id,
    });
    expect(updatePerson(db, person.id, { name: 'An Nguyễn', role: 'TL' })).toMatchObject({
      name: 'An Nguyễn',
      role: 'TL',
    });
    expect(codeOf(() => updatePerson(db, person.id, { teamId: null }))).toBe('TEAM_REQUIRED');
    expect(updatePerson(db, person.id, { role: 'BDM', teamId: null }).teamId).toBeNull();
    expect(codeOf(() => updatePerson(db, person.id, { name: '' }))).toBe('NAME_REQUIRED');
    expect(codeOf(() => updatePerson(db, 'nope', { name: 'X' }))).toBe('PERSON_NOT_FOUND');
  });

  it('hides a soft-deleted person and restores them only into a live team', async () => {
    const { db } = await setup();
    const team = createTeam(db, { name: 'Sao Mai' });
    const person = createPerson(db, { name: 'An', role: 'RE', teamId: team.id });

    softDeletePerson(db, person.id);
    expect(listPeople(db)).toEqual([]);
    expect(getPerson(db, person.id)).toBeUndefined();
    expect(codeOf(() => updatePerson(db, person.id, { name: 'X' }))).toBe('PERSON_NOT_FOUND');
    expect(codeOf(() => softDeletePerson(db, person.id))).toBe('PERSON_NOT_FOUND');

    softDeleteTeam(db, team.id);
    expect(codeOf(() => restorePerson(db, person.id))).toBe('TEAM_NOT_FOUND');
    restoreTeam(db, team.id);
    restorePerson(db, person.id);
    expect(listPeople(db)).toEqual([person]);
    expect(codeOf(() => restorePerson(db, 'nope'))).toBe('PERSON_NOT_FOUND');
  });
});

describe('commands and the save port', () => {
  it('persists once per successful command and never on a rejected one', async () => {
    const { db, persist } = await setup();

    createTeam(db, { name: 'Sao Mai' });
    expect(persist).toHaveBeenCalledTimes(1);

    expect(codeOf(() => createPerson(db, { name: 'An', role: 'RE', teamId: null }))).toBe(
      'TEAM_REQUIRED',
    );
    expect(persist).toHaveBeenCalledTimes(1);
    expect(listPeople(db)).toEqual([]);
  });

  it('stamps created, updated and deleted times from the clock', async () => {
    const { db } = await setup();
    const team = createTeam(db, { name: 'Sao Mai' });
    renameTeam(db, team.id, 'Bình Minh');
    softDeleteTeam(db, team.id);

    const row = db.sqlite.exec('SELECT created_at, updated_at, deleted_at FROM teams')[0];
    const [created, updated, deleted] = (row?.values[0] ?? []).map(String);
    expect(created).toMatch(/^2026-09-26T08:00:00\.\d{3}Z$/);
    expect(created! < updated!).toBe(true);
    expect(updated! <= deleted!).toBe(true);
  });
});
