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
import { markKycConflict, recordKycNote } from './kyc';
import { submitPolicy } from './policies';
import { seedDemoData } from './seed';
import { setup } from './test-support';

type Row = Record<string, unknown>;
interface BackupJson {
  tables: Record<string, Row[]>;
}

const day = (d: number) => calendarDate(2026, 9, d);

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
      '2: a stage other than the latest live transition’s',
      (b, ids) => (row(b, 'customers', (c) => c.id === ids.lan).stage = 'N1'),
    ],
  ];

  it.each(broken)('refuses %s, the current database unchanged', async (label, damage) => {
    const { db, persist, ids } = await history();
    const before = db.export();
    const backup = JSON.parse(exportBackup(db)) as BackupJson;
    damage(backup, ids);

    const error = await importBackup(JSON.stringify(backup)).catch((e: unknown) => e);

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

function remove(backup: BackupJson, table: string, which: (row: Row) => boolean): void {
  const rows = backup.tables[table]!;
  rows.splice(rows.indexOf(row(backup, table, which)), 1);
}
