import type { CalendarDate, CustomerStage, PersonRole } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { recordAiAnalysis, type NewAiAnalysis } from './ai-analyses';
import {
  recordMeetingOutcome,
  rescheduleAppointment,
  scheduleAppointment,
  softDeleteAppointment,
} from './appointments';
import { exportBackup, importBackup } from './backup';
import { countRecords } from './counts';
import {
  createCustomer,
  getCustomer,
  softDeleteCustomer,
  updateCustomerProfile,
} from './customers';
import { openDatabase, type Database } from './database';
import * as entry from './index';
import { addKycNote, confirmKycFact } from './kyc';
import { LATEST_SCHEMA_VERSION, MIGRATIONS } from './migrations';
import { softDeletePolicy, submitPolicy } from './policies';
import { previewPurge, purgeTrash, type KeptBy, type PurgeCounts } from './purge';
import { createPerson, createTeam, personUsage, softDeletePerson, softDeleteTeam } from './team';
import { codeOf, d, setup } from './test-support';
import { listTrash } from './trash';

// Spec Phase 6 §4.2: the examples D1–D13 are dated as of 11/10/2026.
const TODAY = d(11, 10);

/** The tables of the data, as a backup holds them. */
const TABLES = [
  'teams',
  'people',
  'customers',
  'appointments',
  'appointment_coordinators',
  'stage_transitions',
  'policies',
  'kyc_notes',
  'kyc_facts',
  'kyc_versions',
  'ai_analyses',
  'settings',
];

const rowsOf = (db: Database, sql: string, params: string[] = []) =>
  db.sqlite.exec(sql, params)[0]?.values ?? [];

const dump = (db: Database) =>
  Object.fromEntries(
    TABLES.map((table) => [table, rowsOf(db, `SELECT * FROM ${table} ORDER BY rowid`)]),
  );

const countOf = (db: Database, sql: string, params: string[] = []) =>
  Number(rowsOf(db, sql, params)[0]![0]);

type BackupRow = Record<string, unknown>;

/** What a backup holds of the data in use: no deleted record, nothing of a deleted customer. */
function livePart(db: Database) {
  const { tables } = JSON.parse(exportBackup(db)) as { tables: Record<string, BackupRow[]> };
  const live = (table: string) => tables[table]!.filter((row) => row.deleted_at === null);
  const customers = new Set(live('customers').map((row) => row.id));
  const ofLive = (table: string) => tables[table]!.filter((row) => customers.has(row.customer_id));
  const appointments = live('appointments').filter((row) => customers.has(row.customer_id));
  const appointmentIds = new Set(appointments.map((row) => row.id));
  return {
    teams: live('teams'),
    people: live('people'),
    customers: live('customers'),
    appointments,
    coordinators: tables.appointment_coordinators!.filter((row) =>
      appointmentIds.has(row.appointment_id),
    ),
    transitions: ofLive('stage_transitions').filter((row) => row.deleted_at === null),
    policies: ofLive('policies').filter((row) => row.deleted_at === null),
    kycNotes: ofLive('kyc_notes'),
    kycFacts: ofLive('kyc_facts'),
    kycVersions: ofLive('kyc_versions'),
    aiAnalyses: ofLive('ai_analyses'),
    settings: tables.settings,
  };
}

/** An item of an AI output citing the one fact of `analysis`'s input. */
const ITEM = { text: 'Đặt gia đình lên trước', evidence: ['F1'] };

/** An accepted analysis of the Mock, as the AI panel stores it (spec Phase 5 §7.1). */
const analysis = (customerId: string, kycVersionId: string): NewAiAnalysis => ({
  input: {
    analysisDate: '2026-10-01',
    mode: 'analysis',
    facts: [
      {
        code: 'F1',
        category: 'Danh tính / tuổi',
        field: 'Tuổi',
        value: '46',
        confirmedAt: '2026-09-02',
        conflict: false,
      },
    ],
    missingCategories: [],
    conflictWarnings: [],
  },
  output: {
    hypotheses: [ITEM],
    needs: [ITEM],
    painPoints: [ITEM],
    themes: [ITEM],
    discoveryStrategy: [ITEM],
    nextBestActions: [ITEM],
    personalityNotes: [],
  },
  customerId,
  kycVersionId,
  mode: 'analysis',
  gateState: 'PAIN_POINT_ANALYSIS',
  status: 'ACCEPTED',
  provider: 'MOCK',
  model: null,
  reasoning: null,
  promptVersion: 'analysis@1',
  attempts: 1,
  rawOutput: null,
  validator: [{ attempt: 1, errors: [] }],
  promptTokens: null,
  completionTokens: null,
});

/** D1: what the trash of `trash11a` loses for good. */
const D1: PurgeCounts = {
  customers: 3,
  customerRecords: { appointments: 12, policies: 1, kycNotes: 9, aiAnalyses: 2 },
  appointments: 6,
  policies: 2,
  people: 2,
  teams: 1,
};

/** A KYC note whose text the purge must not leave anywhere in the file. */
const SECRET = 'Ghi chú riêng của Trịnh Minh Anh';

/** Records of `db` the tests build on: people, customers, appointments, policies, KYC. */
function records(db: Database) {
  const person = (name: string, role: PersonRole, teamId: string | null) =>
    createPerson(db, { name, role, teamId });
  const customer = (name: string, reId: string, stage: CustomerStage = 'N3') =>
    createCustomer(db, { name, reId, stage, date: d(1, 9) });
  const schedule = (
    customerId: string,
    reId: string,
    date: CalendarDate,
    time: string | null = null,
    coordinatorIds: string[] = [],
  ) =>
    scheduleAppointment(db, {
      customerId,
      reId,
      date,
      time,
      triggerType: 'REFERRAL',
      coordinatorIds,
    });
  const met = (id: string, stageAfter: CustomerStage) =>
    recordMeetingOutcome(db, id, { status: 'MET', stageAfter, nextStep: 'Gửi giải pháp' });
  const notes = (customerId: string, texts: string[]) =>
    texts.map((text) => addKycNote(db, customerId, { text, date: d(2, 9) }));
  const submit = (customerId: string, reId: string) =>
    submitPolicy(db, { customerId, reId, submittedDate: d(15, 9), submittedFyp: 24_000_000 });
  return { person, customer, schedule, met, notes, submit };
}

/**
 * The trash of mockup 11a as D1 counts it: 3 customers with 12 appointments, 1 policy, 9 KYC notes
 * and 2 AI analyses of theirs; 6 appointments, 2 policies, 2 people and 1 team deleted on their
 * own, among them the meeting of 02/10 that moved Phạm Gia Bảo N3 → N2 (D2).
 */
async function trash11a() {
  const base = await setup(TODAY);
  const { db, team: saoMai, tl: ha } = base;
  const { person, customer, schedule, met, notes, submit } = records(db);
  const binhMinh = createTeam(db, { name: 'Bình Minh' });
  const linh = person('Đỗ Khánh Linh', 'RE', saoMai.id);
  const tuan = person('Bùi Anh Tuấn', 'RE', saoMai.id);
  const mai = person('Vương Thị Mai', 'RE', binhMinh.id);
  const huy = person('Phó Đức Huy', 'IS', null);

  // Trịnh Minh Anh: 7 appointments, 5 KYC notes, 2 AI analyses; her planned appointment of 06/10,
  // which Phó Đức Huy coordinates, deleted on its own before her.
  const anh = customer('Trịnh Minh Anh', linh.id, 'N4');
  met(schedule(anh.id, linh.id, d(5, 9), '09:00', [ha.id]).id, 'N3');
  for (const day of [d(8, 9), d(15, 9), d(22, 9), d(29, 9), d(20, 10), d(27, 10)]) {
    schedule(anh.id, linh.id, day);
  }
  const [first] = notes(anh.id, [SECRET, 'Ghi chú 2', 'Ghi chú 3', 'Ghi chú 4', 'Ghi chú 5']);
  const { version } = confirmKycFact(db, anh.id, {
    field: 'occupation',
    value: 'Luật sư',
    noteId: first!.id,
    date: d(2, 9),
  });
  recordAiAnalysis(db, analysis(anh.id, version!.id));
  recordAiAnalysis(db, analysis(anh.id, version!.id));
  softDeleteAppointment(db, schedule(anh.id, linh.id, d(6, 10), '14:00', [huy.id]).id);
  // Đặng Quốc Việt: 3 appointments, 1 policy, 2 notes; one more appointment deleted on its own.
  const viet = customer('Đặng Quốc Việt', linh.id);
  for (const day of [d(10, 9), d(17, 9), d(24, 9)]) schedule(viet.id, linh.id, day);
  submit(viet.id, linh.id);
  notes(viet.id, ['Ghi chú 1', 'Ghi chú 2']);
  softDeleteAppointment(db, schedule(viet.id, linh.id, d(1, 10)).id);
  // Mai Thu Trang: 2 appointments, 2 notes; a policy deleted on its own.
  const trang = customer('Mai Thu Trang', tuan.id);
  for (const day of [d(12, 9), d(19, 9)]) schedule(trang.id, tuan.id, day);
  notes(trang.id, ['Ghi chú 1', 'Ghi chú 2']);
  softDeletePolicy(db, submit(trang.id, tuan.id).id);
  for (const gone of [anh, viet, trang]) softDeleteCustomer(db, gone.id);

  // Records of live customers deleted on their own.
  const bao = customer('Phạm Gia Bảo', tuan.id);
  const meeting = schedule(bao.id, tuan.id, d(2, 10), '09:30', [ha.id]);
  met(meeting.id, 'N2');
  softDeleteAppointment(db, meeting.id);
  softDeleteAppointment(db, schedule(bao.id, tuan.id, d(20, 10)).id);
  const vy = customer('Đinh Thảo Vy', tuan.id);
  const kept = schedule(vy.id, tuan.id, d(1, 10), '16:00');
  met(kept.id, 'N3');
  softDeleteAppointment(db, kept.id);
  const nam = customer('Lê Hoài Nam', linh.id, 'N4');
  const lost = schedule(nam.id, linh.id, d(28, 9), '15:00');
  met(lost.id, 'N3');
  softDeleteAppointment(db, lost.id);
  softDeletePolicy(db, submit(customer('Hoàng Ngọc Lan', linh.id).id, linh.id).id);
  softDeletePerson(db, huy.id);
  softDeletePerson(db, mai.id);
  softDeleteTeam(db, binhMinh.id);

  return {
    ...base,
    ...records(db),
    linh,
    tuan,
    mai,
    huy,
    binhMinh,
    gone: [anh, viet, trang],
    bao,
    meeting,
  };
}

/**
 * D5: Phạm Gia Bảo's Dời lịch of 08/10 10:00, deleted in a file (the app never deletes one, #171;
 * import rule 5 takes it), and the appointment of 15/10 10:00 rescheduled from it, live.
 */
function rescheduledFromFile(t: Awaited<ReturnType<typeof trash11a>>) {
  const moved = t.schedule(t.bao.id, t.tuan.id, d(8, 10), '10:00');
  const next = rescheduleAppointment(t.db, moved.id, { date: d(15, 10), time: '10:00' });
  t.db.sqlite.run('UPDATE appointments SET deleted_at = ? WHERE id = ?', [
    '2026-10-10T11:05:00.000Z',
    moved.id,
  ]);
  return { moved, next };
}

describe('previewPurge', () => {
  it('D1: counts what the purge deletes for good, kind by kind, those of the customers with them', async () => {
    const { db } = await trash11a();

    expect(listTrash(db)).toHaveLength(14);
    expect(previewPurge(db)).toEqual({ counts: D1, kept: [] });
  });

  it('counts nothing in an empty trash', async () => {
    const { db } = await setup(TODAY);

    expect(previewPurge(db)).toEqual({
      counts: {
        customers: 0,
        customerRecords: { appointments: 0, policies: 0, kycNotes: 0, aiAnalyses: 0 },
        appointments: 0,
        policies: 0,
        people: 0,
        teams: 0,
      },
      kept: [],
    });
  });
});

describe('purgeTrash', () => {
  it('D2: empties the trash, with every row of the purged customers, every reference kept whole', async () => {
    const { db, gone, bao, meeting } = await trash11a();
    const ids = gone.map((customer) => customer.id);
    const appointmentIds = rowsOf(
      db,
      'SELECT id FROM appointments WHERE customer_id IN (?, ?, ?)',
      ids,
    ).map(([id]) => String(id));

    expect(purgeTrash(db)).toEqual({ counts: D1, kept: [] });

    expect(listTrash(db)).toEqual([]);
    expect(db.sqlite.exec('PRAGMA foreign_key_check')).toEqual([]);
    expect(countOf(db, 'PRAGMA foreign_keys')).toBe(1);
    expect(countOf(db, 'SELECT COUNT(*) FROM customers WHERE id IN (?, ?, ?)', ids)).toBe(0);
    for (const table of [
      'appointments',
      'stage_transitions',
      'policies',
      'kyc_notes',
      'kyc_facts',
      'kyc_versions',
      'ai_analyses',
    ]) {
      expect(countOf(db, `SELECT COUNT(*) FROM ${table} WHERE customer_id IN (?, ?, ?)`, ids)).toBe(
        0,
      );
    }
    expect(
      countOf(
        db,
        'SELECT COUNT(*) FROM appointment_coordinators WHERE appointment_id IN (SELECT value FROM json_each(?))',
        [JSON.stringify(appointmentIds)],
      ),
    ).toBe(0);
    // The meeting of 02/10 goes with its coordinator and the transition its deletion withdrew.
    for (const sql of [
      'SELECT COUNT(*) FROM stage_transitions WHERE appointment_id = ?',
      'SELECT COUNT(*) FROM appointment_coordinators WHERE appointment_id = ?',
    ]) {
      expect(countOf(db, sql, [meeting.id])).toBe(0);
    }
    expect(getCustomer(db, bao.id)?.stage).toBe('N3');
  });

  it('D3: leaves the data in use as it was, and a file that still imports', async () => {
    const { db } = await trash11a();
    const before = livePart(db);
    const counts = countRecords(db);

    purgeTrash(db);

    expect(livePart(db)).toEqual(before);
    expect(countRecords(db)).toEqual(counts);
    const imported = await importBackup(exportBackup(db), { now: () => db.now() });
    expect(countRecords(imported.db)).toEqual(counts);
  });

  it('D4: an RE kept only by a customer in the trash can be deleted once it is purged', async () => {
    const { db, team, re } = await setup(TODAY);
    const { person, customer, schedule } = records(db);
    const khoa = person('Vũ Minh Khoa', 'RE', team.id);
    const chau = customer('Ngô Bảo Châu', khoa.id);
    schedule(chau.id, khoa.id, d(6, 10));
    // Handed over: the past appointment stays Vũ Minh Khoa's (T-233).
    updateCustomerProfile(db, chau.id, { reId: re.id });
    softDeleteCustomer(db, chau.id);
    expect(personUsage(db, khoa.id).inTrash).toEqual(['Ngô Bảo Châu']);
    expect(codeOf(() => softDeletePerson(db, khoa.id))).toBe('PERSON_IN_USE');

    purgeTrash(db);

    expect(personUsage(db, khoa.id)).toMatchObject({ appointments: 0, inTrash: [] });
    softDeletePerson(db, khoa.id);
    expect(listTrash(db).map((row) => row.id)).toEqual([khoa.id]);
  });

  it('D5: keeps a deleted Dời lịch that a live appointment was rescheduled from, and says why', async () => {
    const t = await trash11a();
    const { db } = t;
    const { moved, next } = rescheduledFromFile(t);
    const by: KeptBy = { kind: 'rescheduled', date: d(15, 10), time: '10:00' };
    const plan = { counts: D1, kept: [{ kind: 'appointment', id: moved.id, by }] };

    // Shown in the trash before the purge, on its row only.
    expect(listTrash(db).filter((row) => row.keptBy)).toEqual([
      expect.objectContaining({ kind: 'appointment', id: moved.id, keptBy: by }),
    ]);
    expect(previewPurge(db)).toEqual(plan);
    const live = rowsOf(db, 'SELECT * FROM appointments WHERE id = ?', [next.id]);

    expect(purgeTrash(db)).toEqual(plan);

    expect(listTrash(db).map((row) => [row.id, row.keptBy])).toEqual([[moved.id, by]]);
    expect(rowsOf(db, 'SELECT * FROM appointments WHERE id = ?', [next.id])).toEqual(live);
    expect(db.sqlite.exec('PRAGMA foreign_key_check')).toEqual([]);
  });

  it('D6: keeps the deleted RE and coordinator of a kept appointment, and the deleted team of that RE', async () => {
    const t = await trash11a();
    const { db, mai, huy, binhMinh } = t;
    const { moved } = rescheduledFromFile(t);
    // From the file too: the RE it was written for left, the customer was handed over.
    db.sqlite.run('UPDATE appointments SET re_id = ? WHERE id = ?', [mai.id, moved.id]);
    db.sqlite.run(
      'INSERT INTO appointment_coordinators (appointment_id, person_id) VALUES (?, ?)',
      [moved.id, huy.id],
    );
    const onMoved: KeptBy = { kind: 'appointment', date: d(8, 10), time: '10:00' };
    const kept = [
      {
        kind: 'appointment',
        id: moved.id,
        by: { kind: 'rescheduled', date: d(15, 10), time: '10:00' },
      },
      { kind: 'person', id: mai.id, by: onMoved },
      { kind: 'person', id: huy.id, by: onMoved },
      { kind: 'team', id: binhMinh.id, by: { kind: 'member', name: 'Vương Thị Mai' } },
    ];
    const plan = { counts: { ...D1, people: 0, teams: 0 }, kept };

    expect(previewPurge(db)).toEqual(plan);
    expect(purgeTrash(db)).toEqual(plan);

    expect(
      listTrash(db)
        .map((row) => [row.kind, row.id, row.keptBy])
        .sort(),
    ).toEqual(kept.map((k) => [k.kind, k.id, k.by]).sort());
    expect(db.sqlite.exec('PRAGMA foreign_key_check')).toEqual([]);
  });

  it('D9: a delete refused half way changes nothing, not even the rows deleted before it', async () => {
    const { db, persist } = await trash11a();
    const before = dump(db);
    persist.mockClear();
    // Teams go last: every other delete has run when this one refuses.
    db.sqlite.run(
      "CREATE TEMP TRIGGER refuse BEFORE DELETE ON teams BEGIN SELECT RAISE(ABORT, 'refused'); END",
    );

    expect(() => purgeTrash(db)).toThrow('refused');

    expect(dump(db)).toEqual(before);
    expect(persist).not.toHaveBeenCalled();
    db.sqlite.run('DROP TRIGGER refuse');
    purgeTrash(db);
    expect(listTrash(db)).toEqual([]);
  });

  it('refuses a purge that would leave a reference pointing nowhere, changing nothing', async () => {
    const { db, persist, schedule, bao, tuan, huy } = await trash11a();
    // No command or import leaves a live appointment coordinated by a deleted person (rule 5).
    const planned = schedule(bao.id, tuan.id, d(20, 10));
    db.sqlite.run(
      'INSERT INTO appointment_coordinators (appointment_id, person_id) VALUES (?, ?)',
      [planned.id, huy.id],
    );
    const before = dump(db);
    persist.mockClear();

    expect(() => purgeTrash(db)).toThrow('pointing nowhere');

    expect(dump(db)).toEqual(before);
    expect(persist).not.toHaveBeenCalled();
    // The keys are on again for every other command.
    expect(() => db.sqlite.run('DELETE FROM people WHERE id = ?', [huy.id])).toThrow(/FOREIGN KEY/);
  });

  it('gives the file back the room of what it purged, so nothing purged stays in it (question 3)', async () => {
    const { db, persist } = await trash11a();
    const before = db.export();
    const secret = new TextEncoder().encode(SECRET);
    const holds = (bytes: Uint8Array) =>
      bytes.some((_, at) => secret.every((byte, i) => bytes[at + i] === byte));
    expect(holds(before)).toBe(true);
    persist.mockClear();

    purgeTrash(db);

    const saved = persist.mock.calls.at(-1)![0] as Uint8Array;
    expect(saved.byteLength).toBeLessThan(before.byteLength);
    expect(holds(saved)).toBe(false);
    const reopened = await openDatabase({ bytes: saved });
    expect(listTrash(reopened)).toEqual([]);
    expect(countRecords(reopened)).toEqual(countRecords(db));
  });

  it('is public through the package entry', () => {
    expect(entry.purgeTrash).toBe(purgeTrash);
    expect(entry.previewPurge).toBe(previewPurge);
  });
});

/** A customer with a KYC note, a fact confirmed from it, the version it made and an analysis. */
function withKyc(db: Database, reId: string, name: string) {
  const customer = createCustomer(db, { name, reId, stage: 'N3', date: d(1, 9) });
  const note = addKycNote(db, customer.id, { text: 'Làm luật sư', date: d(2, 9) });
  const { version } = confirmKycFact(db, customer.id, {
    field: 'occupation',
    value: 'Luật sư',
    noteId: note.id,
    date: d(2, 9),
  });
  recordAiAnalysis(db, analysis(customer.id, version!.id));
  return customer;
}

/** Runs one SQL statement on the KYC and AI rows of a customer. */
const statement = (db: Database, customerId: string) => (sql: string) => () =>
  db.sqlite.run(`${sql} WHERE customer_id = ?`, [customerId]);

describe('the triggers of KYC notes, facts and AI analyses (D11, ADR-0008 phụ lục)', () => {
  it('refuse to edit or delete those of a live customer, as before', async () => {
    const { db, re } = await setup(TODAY);
    const run = statement(db, withKyc(db, re.id, 'Lan').id);

    expect(run("UPDATE kyc_notes SET text = 'sửa'")).toThrow(/append-only/);
    expect(run('DELETE FROM kyc_notes')).toThrow(/append-only/);
    expect(run('UPDATE kyc_facts SET value_json = \'"Bác sĩ"\'')).toThrow(/append-only/);
    expect(run('DELETE FROM kyc_facts')).toThrow(/append-only/);
    expect(run('UPDATE ai_analyses SET attempts = 2')).toThrow(/append-only/);
    expect(run('DELETE FROM ai_analyses')).toThrow(/append-only/);
  });

  it('let those of a deleted customer go, and only those, still never edited', async () => {
    const { db, re } = await setup(TODAY);
    const live = withKyc(db, re.id, 'Lan');
    const gone = withKyc(db, re.id, 'Huệ');
    softDeleteCustomer(db, gone.id);
    const run = statement(db, gone.id);
    const kyc = (customerId: string) =>
      ['kyc_notes', 'kyc_facts', 'ai_analyses'].map((table) =>
        countOf(db, `SELECT COUNT(*) FROM ${table} WHERE customer_id = ?`, [customerId]),
      );

    expect(run("UPDATE kyc_notes SET text = 'sửa'")).toThrow(/append-only/);
    expect(run('UPDATE kyc_facts SET value_json = \'"Bác sĩ"\'')).toThrow(/append-only/);
    expect(run("UPDATE kyc_facts SET status = 'superseded', updated_at = 'x'")).not.toThrow();
    expect(run('UPDATE ai_analyses SET attempts = 2')).toThrow(/append-only/);
    // One statement over both customers deletes nothing.
    expect(() => db.sqlite.run('DELETE FROM ai_analyses')).toThrow(/append-only/);
    expect(kyc(gone.id)).toEqual([1, 1, 1]);
    expect(run('DELETE FROM ai_analyses')).not.toThrow();
    expect(run('DELETE FROM kyc_facts')).not.toThrow();
    expect(run('DELETE FROM kyc_notes')).not.toThrow();
    expect(kyc(gone.id)).toEqual([0, 0, 0]);
    expect(kyc(live.id)).toEqual([1, 1, 1]);
  });
});

describe('the migration of the purge (0011)', () => {
  it('opens a database saved before it with its data, then purges it', async () => {
    const now = () => new Date(Date.UTC(2026, 9, 11, 11));
    const old = await openDatabase({ migrations: MIGRATIONS.slice(0, -1), now });
    const team = createTeam(old, { name: 'Sao Mai' });
    const re = createPerson(old, { name: 'An', role: 'RE', teamId: team.id });
    const live = withKyc(old, re.id, 'Lan');
    const gone = withKyc(old, re.id, 'Huệ');
    softDeleteCustomer(old, gone.id);
    // The trigger before it refuses the deleted customer's rows too.
    expect(statement(old, gone.id)('DELETE FROM ai_analyses')).toThrow(/append-only/);
    expect(old.schemaVersion()).toBe(LATEST_SCHEMA_VERSION - 1);
    const saved = dump(old);

    const migrated = await openDatabase({ bytes: old.export(), now });

    expect(migrated.schemaVersion()).toBe(LATEST_SCHEMA_VERSION);
    expect(dump(migrated)).toEqual(saved);
    expect(purgeTrash(migrated).counts).toMatchObject({
      customers: 1,
      customerRecords: { kycNotes: 1, aiAnalyses: 1 },
    });
    expect(
      ['kyc_notes', 'kyc_facts', 'kyc_versions', 'ai_analyses'].map((table) =>
        countOf(migrated, `SELECT COUNT(*) FROM ${table} WHERE customer_id = ?`, [live.id]),
      ),
    ).toEqual([1, 1, 1, 1]);
    expect(statement(migrated, live.id)('DELETE FROM kyc_notes')).toThrow(/append-only/);
  });
});
