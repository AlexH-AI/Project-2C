import { describe, expect, it, vi } from 'vitest';
import { recordMeetingOutcome, scheduleAppointment, softDeleteAppointment } from './appointments';
import {
  createCustomer,
  restoreCustomer,
  softDeleteCustomer,
  updateCustomerProfile,
} from './customers';
import { openDatabase } from './database';
import { DbError } from './errors';
import { softDeletePolicy, submitPolicy } from './policies';
import {
  createPerson,
  createTeam,
  isPersonInUse,
  listPeople,
  listTeams,
  ownsRecords,
  personUsage,
  renameTeam,
  restorePerson,
  restoreTeam,
  softDeletePerson,
  softDeleteTeam,
  updatePerson,
} from './team';
import { byId, d, setup as withStaff } from './test-support';

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
    expect(byId(listTeams(db), team.id)).toEqual(team);
    expect(listTeams(db)).toEqual([team]);
  });

  // DR-48: SQLite would put "Đ…" after "Z"; the screens order names with `byName` of domain.
  it('lists teams in creation order, leaving the order of names to the screens', async () => {
    const { db } = await setup();
    for (const name of ['Zeta', 'Đông', 'An']) createTeam(db, { name });

    expect(listTeams(db).map((t) => t.name)).toEqual(['Zeta', 'Đông', 'An']);
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

  // DR-49: the command itself composes the name, so a decomposed copy is the same name.
  it('takes a name typed decomposed (NFD) as the composed one it looks like', async () => {
    const { db } = await setup();
    const team = createTeam(db, { name: 'Hừng Đông' });
    const decomposed = 'Hừng Đông'.normalize('NFD');

    expect(codeOf(() => createTeam(db, { name: decomposed }))).toBe('TEAM_NAME_TAKEN');
    expect(createTeam(db, { name: 'Bình Minh'.normalize('NFD') }).name).toBe('Bình Minh');
    expect(renameTeam(db, team.id, decomposed)).toEqual(team);
  });

  // DR6-49: a name the screens show the same is the same name, and an invisible one is empty.
  it('takes white space as one space and drops invisible characters before comparing names', async () => {
    const { db } = await setup();
    const team = createTeam(db, { name: 'Bình Minh' });
    createTeam(db, { name: 'Sao Mai' });

    for (const name of ['Bình  Minh', 'Bình Minh', '\tBình ⁠Minh\n', 'Sao Mai​']) {
      expect(codeOf(() => createTeam(db, { name }))).toBe('TEAM_NAME_TAKEN');
    }
    expect(codeOf(() => createTeam(db, { name: '​' }))).toBe('NAME_REQUIRED');
    expect(codeOf(() => createTeam(db, { name: ' ⁠ ﻿' }))).toBe('NAME_REQUIRED');
    expect(renameTeam(db, team.id, 'Bình　 Minh')).toEqual(team);
    expect(createTeam(db, { name: 'Hừng​  Đông' }).name).toBe('Hừng Đông');
  });

  // DR6-72: the invisible characters outside `\p{Cf}` and U+2800 are dropped, U+0085 is white space.
  it('takes a name of the other invisible characters as empty, and as the same name', async () => {
    const { db } = await setup();
    const team = createTeam(db, { name: 'Sao Mai' });
    const taken = ['Sao Mai\u{3164}', 'Sao\u{85}Mai', '\u{115F}Sao\u{34F} Mai\u{FE0F}\u{FFA0}'];

    for (const name of taken) {
      expect(codeOf(() => createTeam(db, { name }))).toBe('TEAM_NAME_TAKEN');
    }
    for (const name of ['\u{3164}', '\u{2800}', '\u{85}', '\u{115F}\u{FFA0}\u{34F}\u{FE00}']) {
      expect(codeOf(() => createTeam(db, { name }))).toBe('NAME_REQUIRED');
      expect(codeOf(() => createPerson(db, { name, role: 'RE', teamId: team.id }))).toBe(
        'NAME_REQUIRED',
      );
    }
    expect(renameTeam(db, team.id, 'Sao Mai\u{2800}')).toEqual(team);
  });

  // DR6-111 (Q2 a): a control character shows nothing, and the report's Excel file drops it.
  it('takes a name with a control character as the same name, and one of them alone as empty', async () => {
    const { db } = await setup();
    const team = createTeam(db, { name: 'Sao Mai' });

    for (const name of ['Sao Mai\u{7}', '\u{1B}Sao\u{9F} Mai']) {
      expect(codeOf(() => createTeam(db, { name }))).toBe('TEAM_NAME_TAKEN');
    }
    expect(codeOf(() => createTeam(db, { name: '\u{1}' }))).toBe('NAME_REQUIRED');
    expect(
      codeOf(() => createPerson(db, { name: '\u{7}\u{7F}', role: 'RE', teamId: team.id })),
    ).toBe('NAME_REQUIRED');
  });

  // DR6-49: a lone surrogate half would be stored as U+FFFD, so the name would not read back.
  it('refuses a name that is not whole UTF-16', async () => {
    const { db } = await setup();

    expect(codeOf(() => createTeam(db, { name: 'A\uD800' }))).toBe('INVALID_TEXT');
    expect(codeOf(() => createTeam(db, { name: '\uDC00B' }))).toBe('INVALID_TEXT');
    expect(createTeam(db, { name: 'Sao 🌟' }).name).toBe('Sao 🌟');
  });

  it('renames a team', async () => {
    const { db } = await setup();
    const team = createTeam(db, { name: 'Sao Mai' });

    expect(renameTeam(db, team.id, 'Hừng Đông')).toEqual({ id: team.id, name: 'Hừng Đông' });
    expect(byId(listTeams(db), team.id)?.name).toBe('Hừng Đông');
  });

  it('reports an unknown team', async () => {
    const { db } = await setup();

    expect(codeOf(() => renameTeam(db, 'nope', 'X'))).toBe('TEAM_NOT_FOUND');
    expect(codeOf(() => softDeleteTeam(db, 'nope'))).toBe('TEAM_NOT_FOUND');
    expect(codeOf(() => restoreTeam(db, 'nope'))).toBe('TEAM_NOT_FOUND');
    expect(byId(listTeams(db), 'nope')).toBeUndefined();
  });

  it('hides a soft-deleted team and brings it back on restore', async () => {
    const { db } = await setup();
    const team = createTeam(db, { name: 'Sao Mai' });

    softDeleteTeam(db, team.id);
    expect(listTeams(db)).toEqual([]);
    expect(byId(listTeams(db), team.id)).toBeUndefined();
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
    expect(byId(listPeople(db), re.id)).toEqual(re);
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

  // DR6-51: a role outside the list has a code the UI can show, not the raw CHECK error.
  it('refuses a role outside the list with a code, with a team or without', async () => {
    const { db } = await setup();
    const team = createTeam(db, { name: 'Sao Mai' });
    const is = createPerson(db, { name: 'Bình', role: 'IS', teamId: null });
    const role = 'ADMIN' as 'IS';

    expect(codeOf(() => createPerson(db, { name: 'An', role, teamId: null }))).toBe(
      'INVALID_CHOICE',
    );
    expect(codeOf(() => createPerson(db, { name: 'An', role, teamId: team.id }))).toBe(
      'INVALID_CHOICE',
    );
    expect(codeOf(() => updatePerson(db, is.id, { role }))).toBe('INVALID_CHOICE');
    expect(listPeople(db)).toEqual([is]);
  });

  it('refuses a team for IS, BD and BDM, also when the role changes', async () => {
    const { db } = await setup();
    const team = createTeam(db, { name: 'Sao Mai' });
    const re = createPerson(db, { name: 'An', role: 'RE', teamId: team.id });
    const bd = createPerson(db, { name: 'Bình', role: 'BD', teamId: null });

    for (const role of ['IS', 'BD', 'BDM'] as const) {
      expect(codeOf(() => createPerson(db, { name: role, role, teamId: team.id }))).toBe(
        'TEAM_NOT_ALLOWED',
      );
    }
    expect(codeOf(() => updatePerson(db, bd.id, { teamId: team.id }))).toBe('TEAM_NOT_ALLOWED');
    expect(codeOf(() => updatePerson(db, re.id, { role: 'BD' }))).toBe('TEAM_NOT_ALLOWED');
    expect(updatePerson(db, re.id, { role: 'BD', teamId: null })).toMatchObject({
      role: 'BD',
      teamId: null,
    });
    // Not even a deleted one holds a team, so none comes back with one: the schema refuses it
    // (DR6-52).
    softDeletePerson(db, bd.id);
    expect(() =>
      db.sqlite.run('UPDATE people SET team_id = ? WHERE id = ?', [team.id, bd.id]),
    ).toThrow(/CHECK constraint failed: people_team_none/);
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

  it('keeps fields that are passed as undefined', async () => {
    const { db } = await setup();
    const team = createTeam(db, { name: 'Sao Mai' });
    const person = createPerson(db, { name: 'An', role: 'RE', teamId: team.id });

    expect(
      updatePerson(db, person.id, { name: undefined, role: undefined, teamId: undefined }),
    ).toEqual(person);
  });

  it('hides a soft-deleted person and restores them only into a live team', async () => {
    const { db } = await setup();
    const team = createTeam(db, { name: 'Sao Mai' });
    const person = createPerson(db, { name: 'An', role: 'RE', teamId: team.id });

    softDeletePerson(db, person.id);
    expect(listPeople(db)).toEqual([]);
    expect(byId(listPeople(db), person.id)).toBeUndefined();
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

describe('one TL per team (B1b)', () => {
  async function withLead() {
    const { db, persist } = await setup();
    const saoMai = createTeam(db, { name: 'Sao Mai' });
    const binhMinh = createTeam(db, { name: 'Bình Minh' });
    const lead = createPerson(db, { name: 'Lan', role: 'TL', teamId: saoMai.id });
    persist.mockClear();
    return { db, persist, saoMai, binhMinh, lead };
  }

  function errorOf(fn: () => unknown): DbError | undefined {
    try {
      fn();
    } catch (error) {
      if (error instanceof DbError) return error;
      throw error;
    }
    return undefined;
  }

  it('refuses a second TL in a team and leaves the database untouched', async () => {
    const { db, persist, saoMai, lead } = await withLead();

    const error = errorOf(() => createPerson(db, { name: 'Minh', role: 'TL', teamId: saoMai.id }));

    expect(error?.code).toBe('TEAM_HAS_LEAD');
    expect(error?.params).toEqual({ name: 'Lan' });
    expect(listPeople(db)).toEqual([lead]);
    expect(persist).not.toHaveBeenCalled();
  });

  it('makes an RE the TL only of a team without one', async () => {
    const { db, saoMai, binhMinh } = await withLead();
    const an = createPerson(db, { name: 'An', role: 'RE', teamId: saoMai.id });
    const binh = createPerson(db, { name: 'Bình', role: 'RE', teamId: binhMinh.id });

    expect(codeOf(() => updatePerson(db, an.id, { role: 'TL' }))).toBe('TEAM_HAS_LEAD');
    expect(byId(listPeople(db), an.id)?.role).toBe('RE');
    expect(updatePerson(db, binh.id, { role: 'TL' }).role).toBe('TL');
  });

  it('refuses to move a TL into a team that has one, but lets the TL be edited', async () => {
    const { db, saoMai, binhMinh, lead } = await withLead();
    const other = createPerson(db, { name: 'Hà', role: 'TL', teamId: binhMinh.id });

    expect(codeOf(() => updatePerson(db, other.id, { teamId: saoMai.id }))).toBe('TEAM_HAS_LEAD');
    expect(updatePerson(db, lead.id, { name: 'Lan Trần', role: 'TL', teamId: saoMai.id })).toEqual({
      ...lead,
      name: 'Lan Trần',
    });
  });

  it('does not count a soft-deleted TL, but checks again on restore', async () => {
    const { db, saoMai, lead } = await withLead();
    softDeletePerson(db, lead.id);

    const next = createPerson(db, { name: 'Minh', role: 'TL', teamId: saoMai.id });

    expect(next.role).toBe('TL');
    expect(codeOf(() => restorePerson(db, lead.id))).toBe('TEAM_HAS_LEAD');
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

describe('personUsage: what keeps a person from deletion (mockup 9b, spec §4, T-250)', () => {
  const NONE = { customers: 0, appointments: 0, policies: 0, coordinating: 0, reviewing: 0 };
  /** The customers in the trash as `inTrash` names them. */
  const named = (...customers: { readonly name: string; readonly code: string }[]) =>
    customers.map(({ name, code }) => ({ name, code }));

  /** Customers of the RE, each met on `day` with the TL joining and the IS reviewing. */
  async function withRecords() {
    const ctx = await withStaff();
    const { db, re, tl } = ctx;
    const is = createPerson(db, { name: 'Quang', role: 'IS', teamId: null });
    const customer = (name: string) =>
      createCustomer(db, { name, reId: re.id, stage: 'N3', date: d(1, 1) });
    const meet = (customerId: string, day: number) => {
      const { id } = scheduleAppointment(db, {
        customerId,
        reId: re.id,
        date: d(day, 1),
        triggerType: 'REFERRAL',
        coordinatorIds: [tl.id],
      });
      recordMeetingOutcome(db, id, {
        status: 'MET',
        stageAfter: 'N3',
        nextStep: 'Gửi minh họa',
        outcomeReviewerId: is.id,
      });
      return id;
    };
    const submit = (customerId: string) =>
      submitPolicy(db, { customerId, reId: re.id, submittedDate: d(31, 1), submittedFyp: 1e6 }).id;
    return { ...ctx, is, customer, meet, submit };
  }

  it('counts the records pointing to the person, those of a customer in the trash named; the delete refuses them as before', async () => {
    const { db, re, otherRe, tl, is, customer, meet, submit } = await withRecords();
    const lan = customer('Lan');
    meet(lan.id, 10);
    submit(lan.id);
    const usage = { ...NONE, customers: 1, appointments: 1, policies: 1, inTrash: [] };
    expect(personUsage(db, re.id)).toEqual(usage);
    expect(personUsage(db, tl.id)).toEqual({ ...NONE, coordinating: 1, inTrash: [] });
    expect([is, otherRe].map((p) => isPersonInUse(personUsage(db, p.id)))).toEqual([true, false]);
    softDeletePerson(db, otherRe.id);
    softDeleteCustomer(db, lan.id);

    // Deleting a customer only hides its appointments and policies (TR-4).
    expect(personUsage(db, re.id)).toEqual({
      ...NONE,
      appointments: 1,
      policies: 1,
      inTrash: named(lan),
    });
    expect(personUsage(db, tl.id)).toEqual({ ...NONE, coordinating: 1, inTrash: named(lan) });
    expect(personUsage(db, is.id)).toEqual({ ...NONE, reviewing: 1, inTrash: named(lan) });
    for (const person of [re, tl, is]) {
      expect(codeOf(() => softDeletePerson(db, person.id))).toBe('PERSON_IN_USE');
    }

    // The customer still comes back, its RE and supporters with it.
    restoreCustomer(db, lan.id);
    expect(personUsage(db, re.id)).toMatchObject({ customers: 1, inTrash: [] });
    expect(personUsage(db, is.id)).toMatchObject({ reviewing: 1, inTrash: [] });
  });

  it('leaves out what was deleted on its own, and names each customer in the trash once, by name', async () => {
    const { db, re, is, customer, meet, submit } = await withRecords();
    const bao = customer('Bảo');
    meet(bao.id, 10);
    meet(bao.id, 12);
    const anh = customer('Ánh');
    submit(anh.id);
    const cuc = customer('Cúc');
    softDeleteAppointment(db, meet(cuc.id, 14));
    softDeletePolicy(db, submit(cuc.id));
    const live = customer('Dung');
    for (const { id } of [bao, anh, cuc]) softDeleteCustomer(db, id);

    // "Ánh" before "Bảo" as the screens order names (DR-48); Cúc holds nothing live any more.
    expect(personUsage(db, re.id)).toEqual({
      ...NONE,
      customers: 1,
      appointments: 2,
      policies: 1,
      inTrash: named(anh, bao),
    });
    expect(personUsage(db, is.id)).toEqual({ ...NONE, reviewing: 2, inTrash: named(bao) });

    // A customer in the trash with nothing left pointing to the RE is not named.
    softDeleteCustomer(db, live.id);
    for (const { id } of [bao, anh]) restoreCustomer(db, id);
    expect(personUsage(db, re.id)).toMatchObject({ customers: 2, inTrash: [] });
  });

  // Review of PR 669: by name alone, 9b said "Lan, Lan".
  it('names two customers of one name in the trash apart, by their codes', async () => {
    const { db, re, customer, submit } = await withRecords();
    const lans = [customer('Lan'), customer('Lan')];
    for (const { id } of lans) {
      submit(id);
      softDeleteCustomer(db, id);
    }

    const { inTrash } = personUsage(db, re.id);

    expect(inTrash).toEqual(named(...lans.sort((a, b) => (a.code < b.code ? -1 : 1))));
    expect(new Set(inTrash.map((c) => c.code)).size).toBe(2);
  });

  it('is the RE of records only through customers, appointments and policies', () => {
    expect(ownsRecords({ ...NONE, customers: 1 })).toBe(true);
    expect(ownsRecords({ ...NONE, appointments: 1 })).toBe(true);
    expect(ownsRecords({ ...NONE, policies: 1 })).toBe(true);
    expect(ownsRecords({ ...NONE, coordinating: 1, reviewing: 1 })).toBe(false);
    expect(isPersonInUse({ ...NONE, reviewing: 1 })).toBe(true);
    expect(isPersonInUse(NONE)).toBe(false);
  });

  // The past appointments of a customer stay with their RE after a handover (T-233), who is no
  // longer the customer's RE nor the RE of a policy, and still may not leave the role (DR6-126).
  it('keeps an RE left only with appointments from before a handover in the role', async () => {
    const { db, re, otherRe, customer, meet } = await withRecords();
    const lan = customer('Lan');
    meet(lan.id, 10);
    updateCustomerProfile(db, lan.id, { reId: otherRe.id });
    expect(personUsage(db, re.id)).toMatchObject({ customers: 0, appointments: 1, policies: 0 });

    expect(codeOf(() => updatePerson(db, re.id, { role: 'IS', teamId: null }))).toBe(
      'PERSON_IN_USE',
    );

    expect(byId(listPeople(db), re.id)?.role).toBe('RE');
  });
});
