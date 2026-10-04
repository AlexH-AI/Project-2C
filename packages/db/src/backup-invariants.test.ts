/**
 * Cross-table rules of an imported backup (spec §6): a file whose every value is valid on its own
 * but whose tables disagree — a stage that is not the latest transition's, an RE that is a TL, a
 * KYC fact from another customer's note — is refused like a damaged one.
 */
import { calendarDate } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import {
  recordMeetingOutcome,
  rescheduleAppointment,
  restoreAppointment,
  scheduleAppointment,
  softDeleteAppointment,
} from './appointments';
import { exportBackup, importBackup } from './backup';
import {
  changeStageManually,
  createCustomer,
  listCustomers,
  restoreCustomer,
  softDeleteCustomer,
} from './customers';
import { openDatabase } from './database';
import { DbError } from './errors';
import { getKycProfile, markKycConflict, recordKycNote, resolveKycConflict } from './kyc';
import { submitPolicy } from './policies';
import { seedDemoData } from './seed';
import { createPerson, restorePerson, softDeletePerson, updatePerson } from './team';
import { setup } from './test-support';

type Row = Record<string, unknown>;
interface BackupJson {
  tables: Record<string, Row[]>;
}

const day = (d: number) => calendarDate(2026, 9, d);

/** The test clock's day, which the import of history() reads as today (rule 10). */
const TODAY = '2026-09-26';
const TOMORROW = '2026-09-27';

/**
 * Lan: created N4, met at an appointment with a TL coordinating (→ N3), a rescheduled appointment,
 * moved to N2 by hand, a policy, a birth year and gender, and two children counts in conflict.
 * Hoa: an appointment met and then deleted, taking its transition with it (D7). Minh: an
 * appointment met, deleted and restored (a withdrawn transition inside the chain), then the
 * customer deleted and restored. Kiên: deleted.
 */
async function history() {
  const { db, persist, re, otherRe, tl } = await setup();
  const lan = createCustomer(db, {
    name: 'Lan',
    reId: re.id,
    stage: 'N4',
    date: day(1),
    birthDate: { year: 1984 },
    gender: 'FEMALE',
  });
  const met = scheduleAppointment(db, {
    customerId: lan.id,
    reId: re.id,
    date: day(10),
    triggerType: 'REFERRAL',
    coordinatorIds: [tl.id],
  });
  recordMeetingOutcome(db, met.id, {
    status: 'MET',
    stageAfter: 'N3',
    nextStep: 'Gửi bảng minh họa',
  });
  const moved = scheduleAppointment(db, {
    customerId: lan.id,
    reId: re.id,
    date: day(12),
    triggerType: 'EVENT',
  });
  rescheduleAppointment(db, moved.id, { date: day(15) }, 'Khách bận');
  changeStageManually(db, lan.id, { to: 'N2', date: day(18) });
  submitPolicy(db, {
    customerId: lan.id,
    reId: re.id,
    submittedDate: day(19),
    submittedFyp: 20_000_000,
  });
  const { note } = recordKycNote(db, lan.id, {
    text: 'Hai con',
    date: day(20),
    facts: [{ field: 'childrenCount', value: 2 }],
  });
  markKycConflict(db, lan.id, { field: 'childrenCount', value: 3, noteId: note.id, date: day(21) });

  const hoa = createCustomer(db, { name: 'Hoa', reId: otherRe.id, stage: 'N4', date: day(2) });
  const withdrawn = scheduleAppointment(db, {
    customerId: hoa.id,
    reId: otherRe.id,
    date: day(5),
    triggerType: 'OTHER',
  });
  recordMeetingOutcome(db, withdrawn.id, { status: 'MET', stageAfter: 'N2', nextStep: 'Gặp lại' });
  softDeleteAppointment(db, withdrawn.id);
  recordKycNote(db, hoa.id, { text: 'Độc thân', date: day(6), facts: [] });

  const minh = createCustomer(db, { name: 'Minh', reId: re.id, stage: 'N1', date: day(3) });
  const restored = scheduleAppointment(db, {
    customerId: minh.id,
    reId: re.id,
    date: day(7),
    triggerType: 'OCCASION',
  });
  recordMeetingOutcome(db, restored.id, { status: 'MET', stageAfter: 'N2', nextStep: 'Gặp lại' });
  softDeleteAppointment(db, restored.id);
  restoreAppointment(db, restored.id);
  softDeleteCustomer(db, minh.id);
  restoreCustomer(db, minh.id);
  const kien = createCustomer(db, { name: 'Kiên', reId: re.id, stage: 'N3', date: day(4) });
  softDeleteCustomer(db, kien.id);
  persist.mockClear();
  return {
    db,
    persist,
    ids: {
      lan: lan.id,
      hoa: hoa.id,
      minh: minh.id,
      kien: kien.id,
      met: met.id,
      tl: tl.id,
      re: re.id,
    },
  };
}

type Ids = Awaited<ReturnType<typeof history>>['ids'];

describe('importBackup — rules across tables', () => {
  it('accepts a history with rescheduled, withdrawn, deleted and restored records', async () => {
    const { db } = await history();

    const imported = await importBackup(exportBackup(db));

    expect(listCustomers(imported.db).map((c) => c.name)).toEqual(['Hoa', 'Lan', 'Minh']);
  });

  it.each([2, 11, 42])(
    'accepts the demo data of seed %i, anchored on the e2e day',
    async (seed) => {
      const db = await openDatabase();
      seedDemoData(db, { anchorDate: day(15), seed });

      await expect(importBackup(exportBackup(db))).resolves.toBeDefined();
    },
    60_000,
  );

  it('accepts a deleted customer whose RE has since become a TL (spec §3.3)', async () => {
    const { db, ids } = await history();
    const backup = JSON.parse(exportBackup(db)) as BackupJson;
    row(backup, 'customers', (c) => c.id === ids.kien).re_id = ids.tl;

    const imported = await importBackup(JSON.stringify(backup));

    expect(listCustomers(imported.db)).toHaveLength(3);
  });

  /** Records a command could leave, next to each refused case of rules 1, 5, 8, 9 and 10 below. */
  const accepted: [string, (b: BackupJson, ids: Ids) => void][] = [
    [
      'a deleted customer of a deleted RE',
      (b, ids) => {
        const gone = person(b, ids.re, { id: 'gone-re', deleted_at: DELETED });
        row(b, 'customers', (c) => c.id === ids.kien).re_id = gone.id;
      },
    ],
    [
      'a deleted appointment reviewed by someone who has since become an RE',
      (b, ids) =>
        (row(b, 'appointments', (a) => a.customer_id === ids.hoa).outcome_reviewer_id = ids.re),
    ],
    [
      'a deleted TL next to the live TL of the team',
      (b, ids) => person(b, ids.tl, { id: 'old-tl', name: 'Cũ', deleted_at: DELETED }),
    ],
    [
      'a birth year in conflict between the profile and the RE’s note',
      (b, ids) => birthYearConflict(b, ids, '1984'),
    ],
    [
      'a stage change and a policy dated today, the day of the import',
      (b, ids) => {
        transition(b, ids.lan, 3).date = TODAY;
        b.tables.policies![0]!.issued_date = TODAY;
        b.tables.policies![0]!.issued_fyp = 20_000_000;
      },
    ],
    [
      'appointments booked or cancelled after today',
      (b) => {
        const booked = row(b, 'appointments', (a) => a.rescheduled_from_id !== null);
        booked.date = TOMORROW;
        b.tables.appointments!.push({ ...booked, id: 'cancelled', status: 'CANCELLED' });
      },
    ],
  ];

  it.each(accepted)('accepts %s', async (_label, edit) => {
    const { db, ids } = await history();
    const backup = JSON.parse(exportBackup(db)) as BackupJson;
    edit(backup, ids);

    await expect(importBackup(JSON.stringify(backup), { now: db.now })).resolves.toBeDefined();
  });

  /**
   * Each label starts with the number of the rule it breaks (spec §6), which the error names, so a
   * case cannot pass on another rule; UNIQUE is caught by the schema while loading.
   */
  const broken: [string, (b: BackupJson, ids: Ids) => void][] = [
    [
      '1: a customer created in a closed stage',
      (b, ids) => {
        row(b, 'customers', (c) => c.id === ids.kien).stage = 'ON_HOLD';
        transition(b, ids.kien, 1).to_stage = 'ON_HOLD';
      },
    ],
    [
      '1: a customer whose first transition is missing',
      (b, ids) => remove(b, 'stage_transitions', (t) => t.customer_id === ids.lan && t.seq === 1),
    ],
    [
      '1: a customer with no transition at all',
      (b, ids) => remove(b, 'stage_transitions', (t) => t.customer_id === ids.kien),
    ],
    [
      '1: a customer whose first transition is soft-deleted',
      (b, ids) => (transition(b, ids.lan, 1).deleted_at = '2026-09-26T08:00:00.000Z'),
    ],
    [
      '1: a withdrawn later transition from no stage',
      (b, ids) => (transition(b, ids.hoa, 2).from_stage = null),
    ],
    [
      '1: a customer’s creation tied to a meeting kept in its stage, same day',
      (b, ids) => {
        Object.assign(
          row(b, 'appointments', (a) => a.id === ids.met),
          {
            date: '2026-09-01',
            stage_after: 'N4',
          },
        );
        transition(b, ids.lan, 1).appointment_id = ids.met;
        remove(b, 'stage_transitions', (t) => t.customer_id === ids.lan && t.seq === 2);
        transition(b, ids.lan, 3).from_stage = 'N4';
      },
    ],
    [
      '3: a transition dated before the one recorded ahead of it (D10)',
      (b, ids) => (transition(b, ids.lan, 3).date = '2026-09-09'),
    ],
    [
      '3: a transition from a stage other than the previous live one’s',
      (b, ids) => (transition(b, ids.lan, 3).from_stage = 'N4'),
    ],
    [
      '3: a closed customer reopening to N2',
      (b, ids) => {
        Object.assign(transition(b, ids.lan, 3), { to_stage: 'LOST' });
        const reopen = { ...transition(b, ids.lan, 3), id: 'reopen', seq: 4 };
        b.tables.stage_transitions!.push({ ...reopen, from_stage: 'LOST', to_stage: 'N2' });
      },
    ],
    [
      '4: a met appointment moved to another day than its transition',
      (b, ids) => (row(b, 'appointments', (a) => a.id === ids.met).date = '2026-09-11'),
    ],
    [
      '4: a met appointment whose stage after is not its transition’s',
      (b, ids) => (row(b, 'appointments', (a) => a.id === ids.met).stage_after = 'N2'),
    ],
    [
      '4: a transition caused by another customer’s appointment',
      (b, ids) => {
        const other = row(b, 'appointments', (a) => a.customer_id === ids.hoa);
        Object.assign(other, { deleted_at: null, date: '2026-09-10', stage_after: 'N3' });
        transition(b, ids.lan, 2).appointment_id = other.id;
      },
    ],
    [
      '4: a live transition caused by a deleted appointment (D7)',
      (b, ids) =>
        (row(b, 'appointments', (a) => a.id === ids.met).deleted_at = '2026-09-26T08:00:00.000Z'),
    ],
    [
      '4: an appointment with two live transitions',
      (b, ids) => {
        Object.assign(transition(b, ids.lan, 3), { to_stage: 'LOST', date: '2026-09-10' });
        const again = { ...transition(b, ids.lan, 2), id: 'again', seq: 4, from_stage: 'LOST' };
        b.tables.stage_transitions!.push(again);
        row(b, 'customers', (c) => c.id === ids.lan).stage = 'N3';
      },
    ],
    [
      '5: a live customer whose RE is a TL',
      (b, ids) => (row(b, 'customers', (c) => c.id === ids.lan).re_id = ids.tl),
    ],
    [
      '5: a live appointment whose RE is a TL',
      (b, ids) => (row(b, 'appointments', (a) => a.rescheduled_from_id !== null).re_id = ids.tl),
    ],
    ['5: a live policy whose RE is a TL', (b, ids) => (b.tables.policies![0]!.re_id = ids.tl)],
    [
      '5: a live customer, appointment and policy of a deleted RE',
      (b, ids) => (row(b, 'people', (p) => p.id === ids.re).deleted_at = DELETED),
    ],
    [
      '5: a live met appointment reviewed by an RE (D9)',
      (b, ids) => (row(b, 'appointments', (a) => a.id === ids.met).outcome_reviewer_id = ids.re),
    ],
    [
      '5: the RE of an appointment also coordinating it',
      (b, ids) => (b.tables.appointment_coordinators![0]!.person_id = ids.re),
    ],
    [
      '5: an appointment rescheduled from one that was not rescheduled',
      (b, ids) =>
        (row(b, 'appointments', (a) => a.rescheduled_from_id !== null).rescheduled_from_id =
          ids.met),
    ],
    [
      '5: an appointment rescheduled from another customer’s',
      (b, ids) => {
        const other = row(b, 'appointments', (a) => a.customer_id === ids.hoa);
        Object.assign(other, { status: 'RESCHEDULED', stage_after: null, next_step: null });
        row(b, 'appointments', (a) => a.rescheduled_from_id !== null).rescheduled_from_id =
          other.id;
      },
    ],
    [
      '6: a KYC fact confirmed from another customer’s note',
      (b, ids) => {
        const note = row(b, 'kyc_notes', (n) => n.customer_id === ids.hoa);
        fact(b, ids.lan, 'childrenCount').note_id = note.id;
      },
    ],
    [
      'UNIQUE: two transitions of a customer with the same seq',
      (b, ids) => (transition(b, ids.lan, 3).seq = 2),
    ],
    [
      'UNIQUE: two KYC facts of a customer with the same seq',
      (b, ids) => (row(b, 'kyc_facts', (f) => f.customer_id === ids.lan && f.seq === 2).seq = 1),
    ],
    [
      'UNIQUE: two KYC versions of a customer with the same seq',
      (b, ids) => (row(b, 'kyc_versions', (v) => v.customer_id === ids.lan && v.seq === 2).seq = 1),
    ],
    [
      'UNIQUE: two notes of a customer with the same seq',
      (b, ids) => (row(b, 'kyc_notes', (n) => n.customer_id === ids.lan && n.seq === 2).seq = 1),
    ],
    [
      '7: a field with an active fact and one in conflict',
      (b, ids) => (fact(b, ids.lan, 'childrenCount').status = 'active'),
    ],
    [
      '7: a field with a single fact in conflict',
      (b, ids) => (fact(b, ids.lan, 'childrenCount').status = 'superseded'),
    ],
    [
      '8: a birth year other than the profile’s (D2)',
      (b, ids) => (fact(b, ids.lan, 'birthYear').value_json = '1985'),
    ],
    [
      '8: a gender other than the profile’s (D2)',
      (b, ids) => (row(b, 'customers', (c) => c.id === ids.lan).gender = 'MALE'),
    ],
    [
      '8: a birth year confirmed from the RE’s note, not the profile (D2)',
      (b, ids) => {
        const note = row(b, 'kyc_notes', (n) => n.customer_id === ids.lan && n.source === 'RE');
        fact(b, ids.lan, 'birthYear').note_id = note.id;
      },
    ],
    [
      '8: a birth year in conflict from the profile, other than the profile’s (D2)',
      (b, ids) => birthYearConflict(b, ids, '1983'),
    ],
    [
      '8: an occupation in effect from the profile’s note (D2)',
      (b, ids) => occupationFromProfile(b, ids, 'active'),
    ],
    [
      '8: an occupation superseded, from the profile’s note (D2)',
      (b, ids) => occupationFromProfile(b, ids, 'superseded'),
    ],
    [
      '8: children counts in conflict, one from the profile’s note (D2)',
      (b, ids) => {
        const note = row(b, 'kyc_notes', (n) => n.customer_id === ids.lan && n.source === 'SYSTEM');
        fact(b, ids.lan, 'childrenCount').note_id = note.id;
      },
    ],
    ['9: two live TLs in a team', (b, ids) => person(b, ids.tl, { id: 'second-tl', name: 'Hải' })],
    [
      '9: two live TLs in a deleted team',
      (b, ids) => {
        const team = { ...b.tables.teams![0]!, id: 'old-team', name: 'Cũ', deleted_at: DELETED };
        b.tables.teams!.push(team);
        person(b, ids.tl, { id: 'first-tl', team_id: team.id });
        person(b, ids.tl, { id: 'second-tl', team_id: team.id });
      },
    ],
    ['9: live people in a deleted team', (b) => (b.tables.teams![0]!.deleted_at = DELETED)],
    ['9: an IS in a team', (b, ids) => person(b, ids.tl, { id: 'is', role: 'IS' })],
    [
      '9: a deleted BDM in a team',
      (b, ids) => person(b, ids.tl, { id: 'bdm', role: 'BDM', deleted_at: DELETED }),
    ],
    [
      '10: a customer created after today, the day of the import',
      (b, ids) => (transition(b, ids.kien, 1).date = TOMORROW),
    ],
    [
      '10: a stage change dated after today',
      (b, ids) => (transition(b, ids.lan, 3).date = TOMORROW),
    ],
    [
      '10: a policy submitted after today',
      (b) => (b.tables.policies![0]!.submitted_date = TOMORROW),
    ],
    [
      '10: a policy issued after today',
      (b) => Object.assign(b.tables.policies![0]!, { issued_date: TOMORROW, issued_fyp: 1 }),
    ],
    [
      '10: a meeting missed after today',
      (b) => {
        const booked = row(b, 'appointments', (a) => a.rescheduled_from_id !== null);
        Object.assign(booked, { status: 'NO_SHOW', date: TOMORROW });
      },
    ],
    [
      '2: a stage other than the latest live transition’s',
      (b, ids) => (row(b, 'customers', (c) => c.id === ids.lan).stage = 'N1'),
    ],
  ];

  it.each(broken)('refuses %s, the current database unchanged', async (label, damage) => {
    const { db, persist, ids } = await history();
    const before = db.export();
    const backup = JSON.parse(exportBackup(db)) as BackupJson;
    damage(backup, ids);

    const error = await importBackup(JSON.stringify(backup), { now: db.now }).catch(
      (e: unknown) => e,
    );

    expect(error).toBeInstanceOf(DbError);
    const rule = label.split(':')[0];
    expect(error).toMatchObject({ code: 'BACKUP_INVALID' });
    expect((error as DbError).params).toEqual(
      rule === 'UNIQUE' ? undefined : { rule: Number(rule) },
    );
    expect(db.export()).toEqual(before);
    expect(persist).not.toHaveBeenCalled();
  });
});

describe('importBackup — a file the app wrote from an imported one', () => {
  it('imports again after each main command ran on the imported demo data', async () => {
    const now = () => new Date(Date.UTC(2026, 8, 15, 10, 0, 0));
    const seeded = await openDatabase({ now });
    seedDemoData(seeded, { anchorDate: day(15), seed: 2 });
    const { db } = await importBackup(exportBackup(seeded), { now });
    const first = (sql: string) => db.sqlite.exec(`${sql} LIMIT 1`)[0]!.values[0]!.map(String);
    const [reId] = first("SELECT id FROM people WHERE role = 'RE' AND deleted_at IS NULL");
    const [tlId] = first("SELECT id FROM people WHERE role = 'TL' AND deleted_at IS NULL");
    // A meeting whose transition is still its customer's latest, so deleting it withdraws it.
    const [metId] = first(
      `SELECT a.id FROM appointments a
       JOIN stage_transitions t ON t.appointment_id = a.id AND t.deleted_at IS NULL
       JOIN customers c ON c.id = a.customer_id AND c.deleted_at IS NULL
       WHERE a.deleted_at IS NULL AND t.seq = (SELECT MAX(seq) FROM stage_transitions
         WHERE customer_id = t.customer_id AND deleted_at IS NULL)`,
    );
    const [factId, conflictCustomerId] = first(
      `SELECT f.id, f.customer_id FROM kyc_facts f
       JOIN customers c ON c.id = f.customer_id AND c.deleted_at IS NULL
       WHERE f.status = 'conflict'`,
    );

    const lan = createCustomer(db, {
      name: 'Lan',
      reId: reId!,
      stage: 'N4',
      date: day(14),
      birthDate: { year: 1984 },
      gender: 'FEMALE',
    });
    const meeting = scheduleAppointment(db, {
      customerId: lan.id,
      reId: reId!,
      date: day(15),
      triggerType: 'REFERRAL',
    });
    recordMeetingOutcome(db, meeting.id, { status: 'MET', stageAfter: 'N3', nextStep: 'Gặp lại' });
    softDeleteAppointment(db, metId!);
    resolveKycConflict(db, conflictCustomerId!, { factId: factId!, date: day(15) });
    updatePerson(db, reId!, { name: 'An Mới' });
    updatePerson(db, tlId!, { name: 'Hà Mới' });
    // The RE gives another birth year; the profile's settles it (D2).
    const flagged = recordKycNote(db, lan.id, {
      text: 'KH nói sinh năm 1985',
      date: day(15),
      facts: [{ field: 'birthYear', value: 1985, conflict: true }],
    });
    expect(flagged.version).not.toBeNull();
    const fromProfile = getKycProfile(db, lan.id).facts.find(
      (f) => f.field === 'birthYear' && f.value === 1984,
    )!;
    resolveKycConflict(db, lan.id, { factId: fromProfile.id, date: day(15) });
    // Staff: the TL leaves the team for a shared role and another takes over; an RE joins, moves
    // to a shared role, is deleted and comes back (rule 9).
    const [teamId] = first(`SELECT team_id FROM people WHERE id = '${tlId}'`);
    updatePerson(db, tlId!, { role: 'BDM', teamId: null });
    createPerson(db, { name: 'Hải', role: 'TL', teamId: teamId! });
    const newcomer = createPerson(db, { name: 'Bảo', role: 'RE', teamId: teamId! });
    updatePerson(db, newcomer.id, { role: 'IS', teamId: null });
    softDeletePerson(db, newcomer.id);
    restorePerson(db, newcomer.id);

    await expect(importBackup(exportBackup(db))).resolves.toBeDefined();
  }, 60_000);
});

/** The row of `table` that `which` picks; the test fails when there is none. */
function row(backup: BackupJson, table: string, which: (row: Row) => boolean): Row {
  const found = backup.tables[table]!.find(which);
  if (!found) throw new Error(`no such row in ${table}`);
  return found;
}

function transition(backup: BackupJson, customerId: string, seq: number): Row {
  return row(backup, 'stage_transitions', (t) => t.customer_id === customerId && t.seq === seq);
}

/** The customer's first fact of the field. */
function fact(backup: BackupJson, customerId: string, field: string): Row {
  return row(backup, 'kyc_facts', (f) => f.customer_id === customerId && f.field === field);
}

const DELETED = '2026-09-26T08:00:00.000Z';

/** Adds a copy of a person's row with `changes`, and returns it. */
function person(backup: BackupJson, copyOf: string, changes: Row): Row {
  const added = { ...row(backup, 'people', (p) => p.id === copyOf), ...changes };
  backup.tables.people!.push(added);
  return added;
}

/**
 * Lan's birth year from the profile turned to a conflict, with `systemValue`, against 1985 from
 * the RE's note.
 */
function birthYearConflict(backup: BackupJson, ids: Ids, systemValue: string): void {
  const system = fact(backup, ids.lan, 'birthYear');
  Object.assign(system, { status: 'conflict', value_json: systemValue });
  const note = row(backup, 'kyc_notes', (n) => n.customer_id === ids.lan && n.source === 'RE');
  const seq = Math.max(
    ...backup.tables.kyc_facts!.filter((f) => f.customer_id === ids.lan).map((f) => Number(f.seq)),
  );
  backup.tables.kyc_facts!.push({
    ...system,
    id: 'flagged',
    note_id: note.id,
    seq: seq + 1,
    value_json: '1985',
  });
}

/**
 * Adds Lan's occupation from the profile's `SYSTEM` note with `status`; a superseded one is
 * followed by the RE's, so the trường stays settled.
 */
function occupationFromProfile(backup: BackupJson, ids: Ids, status: string): void {
  const facts = backup.tables.kyc_facts!;
  const base = fact(backup, ids.lan, 'birthYear');
  const seq = Math.max(...facts.filter((f) => f.customer_id === ids.lan).map((f) => Number(f.seq)));
  const occupation = { ...base, field: 'occupation', value_json: '"Bác sĩ"' };
  facts.push({ ...occupation, id: 'from-profile', seq: seq + 1, status });
  if (status === 'superseded') {
    const note = row(backup, 'kyc_notes', (n) => n.customer_id === ids.lan && n.source === 'RE');
    facts.push({
      ...occupation,
      id: 'from-note',
      seq: seq + 2,
      note_id: note.id,
      status: 'active',
    });
  }
}

function remove(backup: BackupJson, table: string, which: (row: Row) => boolean): void {
  const rows = backup.tables[table]!;
  rows.splice(rows.indexOf(row(backup, table, which)), 1);
}
