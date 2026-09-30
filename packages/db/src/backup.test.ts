import { calendarDate } from '@p2c/domain';
import { describe, expect, it, vi } from 'vitest';
import { scheduleAppointment } from './appointments';
import { BACKUP_FORMAT, exportBackup, importBackup, MAX_BACKUP_BYTES } from './backup';
import { createCustomer, listCustomers, softDeleteCustomer } from './customers';
import { openDatabase } from './database';
import { DbError } from './errors';
import { recordKycNote } from './kyc';
import { LATEST_SCHEMA_VERSION, MIGRATIONS } from './migrations';
import { submitPolicy } from './policies';
import { seedDemoData } from './seed';
import { listTeams } from './team';
import { setup } from './test-support';

const SLOW = 60_000;
const EXPORTED_AT = new Date(Date.UTC(2026, 8, 30, 7, 45, 0));
const exportClock = () => EXPORTED_AT;
const STAMP = EXPORTED_AT.toISOString();

interface BackupJson {
  format: string;
  schemaVersion: number;
  exportedAt: string;
  tables: Record<string, Record<string, unknown>[]>;
}

/**
 * A small database: one team, two REs, a TL, a live customer with a birth year, an appointment, a
 * policy and a KYC note, and a soft-deleted customer — a row in every table a value check reads.
 */
async function small() {
  const { db, re } = await setup();
  const date = calendarDate(2026, 9, 1);
  const lan = createCustomer(db, {
    name: 'Lan',
    reId: re.id,
    stage: 'N3',
    date,
    birthDate: { year: 1984 },
  });
  scheduleAppointment(db, {
    customerId: lan.id,
    reId: re.id,
    date: calendarDate(2026, 9, 3),
    time: '09:30',
    triggerType: 'REFERRAL',
  });
  submitPolicy(db, {
    customerId: lan.id,
    reId: re.id,
    submittedDate: date,
    submittedFyp: 20_000_000,
  });
  recordKycNote(db, lan.id, {
    text: 'Hai con',
    date,
    facts: [{ field: 'childrenCount', value: 2 }],
  });
  const gone = createCustomer(db, {
    name: 'Minh',
    reId: re.id,
    stage: 'N4',
    date: calendarDate(2026, 9, 2),
  });
  softDeleteCustomer(db, gone.id);
  return db;
}

async function smallBackup(): Promise<BackupJson> {
  return JSON.parse(exportBackup(await small())) as BackupJson;
}

async function codeOfImport(text: string): Promise<string | undefined> {
  const error = await importBackup(text).catch((e: unknown) => e);
  if (error instanceof DbError) return error.code;
  throw new Error(`expected a DbError, got ${String(error)}`);
}

describe('exportBackup', () => {
  it('writes the envelope with fixed keys and every table except the migration log', async () => {
    const backup = await smallBackup();

    expect(Object.keys(backup)).toEqual(['format', 'schemaVersion', 'exportedAt', 'tables']);
    expect(backup.format).toBe(BACKUP_FORMAT);
    expect(backup.schemaVersion).toBe(LATEST_SCHEMA_VERSION);
    expect(Object.keys(backup.tables)).toEqual([
      'appointment_coordinators',
      'appointments',
      'customers',
      'kyc_facts',
      'kyc_notes',
      'kyc_versions',
      'people',
      'policies',
      'settings',
      'stage_transitions',
      'teams',
    ]);
  });

  it('keeps soft-deleted rows, sorts each table by id and writes columns in table order', async () => {
    const backup = await smallBackup();
    const customers = backup.tables.customers!;

    expect(customers.map((c) => c.name).sort()).toEqual(['Lan', 'Minh']);
    expect(customers.filter((c) => c.deleted_at !== null)).toHaveLength(1);
    const ids = customers.map((c) => String(c.id));
    expect(ids).toEqual([...ids].sort());
    expect(Object.keys(customers[0]!)).toEqual([
      'id',
      'code',
      'name',
      're_id',
      'birth_date',
      'gender',
      'stage',
      'created_at',
      'updated_at',
      'deleted_at',
    ]);
  });

  it('stamps the export time from the database clock', async () => {
    const db = await openDatabase({ now: exportClock });
    expect((JSON.parse(exportBackup(db)) as BackupJson).exportedAt).toBe(
      '2026-09-30T07:45:00.000Z',
    );
  });
});

describe('importBackup', () => {
  it(
    'seed → export → import → export gives the same file, byte for byte',
    async () => {
      const db = await openDatabase({ now: exportClock });
      seedDemoData(db, { anchorDate: calendarDate(2026, 9, 15), seed: 1 });
      const first = exportBackup(db);

      const imported = await importBackup(first, { now: exportClock });

      expect(imported.schemaVersion).toBe(LATEST_SCHEMA_VERSION);
      expect(imported.exportedAt).toBe('2026-09-30T07:45:00.000Z');
      expect(imported.db.schemaVersion()).toBe(LATEST_SCHEMA_VERSION);
      expect(exportBackup(imported.db)).toBe(first);
    },
    SLOW,
  );

  it('opens the new database with the given options, leaving the current one alone', async () => {
    const current = await small();
    const before = current.export();
    const persist = vi.fn();

    const { db } = await importBackup(exportBackup(current), { persist });
    db.transaction(() => undefined);

    expect(persist).toHaveBeenCalledTimes(1);
    expect(db).not.toBe(current);
    expect(listCustomers(db).map((c) => c.name)).toEqual(['Lan']);
    expect(current.export()).toEqual(before);
  });

  it('refuses a file from a newer app, naming both schema versions', async () => {
    const backup = await smallBackup();
    backup.schemaVersion = LATEST_SCHEMA_VERSION + 1;

    const error = await importBackup(JSON.stringify(backup)).catch((e: unknown) => e);

    expect(error).toMatchObject({
      code: 'SCHEMA_TOO_NEW',
      params: { version: LATEST_SCHEMA_VERSION + 1, supported: LATEST_SCHEMA_VERSION },
    });
  });

  it('loads a file from an older app at its own version, then runs the missing migrations', async () => {
    const old = await openDatabase({ migrations: MIGRATIONS.slice(0, 4) });
    old.sqlite.run(
      `INSERT INTO teams (id, name, created_at, updated_at) VALUES ('t', 'Sao Mai', '${STAMP}', '${STAMP}')`,
    );
    const fake = {
      id: LATEST_SCHEMA_VERSION + 1,
      tag: 'fake',
      sql: "ALTER TABLE teams ADD COLUMN color text DEFAULT 'blue';",
    };

    const imported = await importBackup(exportBackup(old), {
      migrations: [...MIGRATIONS, fake],
    });

    expect(imported.schemaVersion).toBe(4);
    expect(imported.db.schemaVersion()).toBe(fake.id);
    expect(listTeams(imported.db).map((t) => t.name)).toEqual(['Sao Mai']);
    const after = JSON.parse(exportBackup(imported.db)) as BackupJson;
    expect(after.tables.teams).toEqual([
      expect.objectContaining({ id: 't', color: 'blue' }) as unknown,
    ]);
    expect(
      imported.db.sqlite
        .exec("SELECT name FROM pragma_table_info('appointments')")[0]
        ?.values.at(-1),
    ).toEqual(['outcome_reviewer_id']);
  });

  it('saves nothing while importing an older file: the app asks and backs up first', async () => {
    const old = await openDatabase({ migrations: MIGRATIONS.slice(0, 4) });
    const persist = vi.fn();

    const { db } = await importBackup(exportBackup(old), { persist });

    expect(persist).not.toHaveBeenCalled();
    expect(db.schemaVersion()).toBe(LATEST_SCHEMA_VERSION);
    db.transaction(() => undefined);
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it('refuses an older file whose rows the missing migrations reject', async () => {
    const old = await openDatabase({ migrations: MIGRATIONS.slice(0, 4) });
    old.sqlite.run(
      `INSERT INTO teams (id, name, created_at, updated_at) VALUES ('t', 'Sao Mai', '${STAMP}', '${STAMP}')`,
    );
    const fake = {
      id: LATEST_SCHEMA_VERSION + 1,
      tag: 'fake',
      sql: `CREATE UNIQUE INDEX teams_name ON teams (name); INSERT INTO teams (id, name, created_at, updated_at) VALUES ('u', 'Sao Mai', '${STAMP}', '${STAMP}');`,
    };

    const error = await importBackup(exportBackup(old), {
      migrations: [...MIGRATIONS, fake],
    }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(DbError);
    expect(error).toMatchObject({ code: 'BACKUP_INVALID' });
  });

  it('only meets integer and text columns, the two kinds a backup value can be', async () => {
    const db = await openDatabase();
    const types = db.sqlite.exec(
      "SELECT DISTINCT lower(c.type) FROM sqlite_master t, pragma_table_info(t.name) c WHERE t.type = 'table' ORDER BY 1",
    );

    expect(types[0]?.values.flat()).toEqual(['integer', 'text']);
  });

  it('only meets data tables with a primary key, the order an export sorts by', async () => {
    const db = await openDatabase();
    const keyless = db.sqlite.exec(
      "SELECT t.name FROM sqlite_master t WHERE t.type = 'table' AND t.name NOT LIKE 'sqlite_%' AND NOT EXISTS (SELECT 1 FROM pragma_table_info(t.name) c WHERE c.pk > 0)",
    );

    expect(keyless).toEqual([]);
  });

  const damaged: [string, (backup: BackupJson) => unknown][] = [
    ['another format (Project-2)', (b) => ({ ...b, format: 'project2-backup' })],
    ['an unknown key', (b) => ({ ...b, extra: 1 })],
    ['no export time', (b) => ({ ...b, exportedAt: 'yesterday' })],
    ['schema version 0', (b) => ({ ...b, schemaVersion: 0 })],
    ['a fractional schema version', (b) => ({ ...b, schemaVersion: 4.5 })],
    ['tables that are not arrays', (b) => ({ ...b, tables: { ...b.tables, teams: {} } })],
    ['a missing table', (b) => ({ ...b, tables: { ...b.tables, teams: undefined } })],
    ['an extra table', (b) => ({ ...b, tables: { ...b.tables, notes: [] } })],
    ['a missing column', (b) => withRow(b, 'teams', (row) => ({ ...row, name: undefined }))],
    ['an extra column', (b) => withRow(b, 'teams', (row) => ({ ...row, color: 'red' }))],
    [
      'text in an integer column',
      (b) => withRow(b, 'stage_transitions', (row) => ({ ...row, seq: '1' })),
    ],
    [
      'a fraction in an integer column',
      (b) => withRow(b, 'stage_transitions', (row) => ({ ...row, seq: 1.5 })),
    ],
    ['a number in a text column', (b) => withRow(b, 'teams', (row) => ({ ...row, name: 7 }))],
    ['a broken reference', (b) => withRow(b, 'customers', (row) => ({ ...row, re_id: 'nobody' }))],
    ['a failed check', (b) => withRow(b, 'customers', (row) => ({ ...row, stage: 'N9' }))],
    [
      'a duplicate id',
      (b) => ({ ...b, tables: { ...b.tables, teams: [...b.tables.teams!, ...b.tables.teams!] } }),
    ],
  ];

  it.each(damaged)('refuses a file with %s', async (_, damage) => {
    const backup = await smallBackup();
    expect(await codeOfImport(JSON.stringify(damage(backup)))).toBe('BACKUP_INVALID');
  });

  type Pick = (row: Record<string, unknown>, backup: BackupJson) => boolean;
  const ofDeletedCustomer: Pick = (row, backup) =>
    backup.tables.customers!.some((c) => c.id === row.customer_id && c.deleted_at !== null);
  const badValues: [string, string, unknown, Pick?][] = [
    ['appointments', 'date', 'hello'],
    ['stage_transitions', 'date', '2026-02-30'],
    ['policies', 'submitted_date', '26/09/2026'],
    ['appointments', 'time', '25:00'],
    ['kyc_facts', 'value_json', '{not json'],
    ['kyc_facts', 'value_json', '"2"', (row) => row.field === 'childrenCount'],
    ['kyc_facts', 'value_json', '-1', (row) => row.field === 'childrenCount'],
    ['kyc_facts', 'value_json', '[2]', (row) => row.field === 'childrenCount'],
    ['kyc_notes', 'created_date', '2026-13-01'],
    ['customers', 'birth_date', '84'],
    ['stage_transitions', 'seq', 0],
    ['teams', 'created_at', 'x'],
    ['customers', 'deleted_at', '2026-09-30'],
    ['kyc_versions', 'date', '2026-9-1'],
    ['stage_transitions', 'date', 'soon', ofDeletedCustomer],
  ];

  it.each(badValues)(
    'refuses %s.%s = %j, the current database unchanged',
    async (table, column, value, which) => {
      const current = await small();
      const before = current.export();
      const backup = JSON.parse(exportBackup(current)) as BackupJson;
      const rows = backup.tables[table]!;
      const index = which ? rows.findIndex((row) => which(row, backup)) : 0;
      expect(index).toBeGreaterThanOrEqual(0);
      rows[index] = { ...rows[index], [column]: value };

      expect(await codeOfImport(JSON.stringify(backup))).toBe('BACKUP_INVALID');
      expect(current.export()).toEqual(before);
    },
  );

  it('accepts a birth year alone, no time and a soft-deleted row with valid values', async () => {
    const backup = await smallBackup();
    const lan = backup.tables.customers!.find((c) => c.name === 'Lan')!;
    expect(lan.birth_date).toBe('1984');
    backup.tables.appointments![0]!.time = null;

    const { db } = await importBackup(JSON.stringify(backup));

    expect(listCustomers(db).map((c) => c.name)).toEqual(['Lan']);
  });

  it('refuses text longer than the limit before reading it as JSON', async () => {
    const parse = vi.spyOn(JSON, 'parse');
    const text = { length: MAX_BACKUP_BYTES + 1 } as unknown as string;

    const error = await importBackup(text).catch((e: unknown) => e);

    expect(MAX_BACKUP_BYTES).toBe(100 * 1024 * 1024);
    expect(error).toMatchObject({ code: 'BACKUP_TOO_LARGE', params: { limitMb: 100 } });
    expect(parse).not.toHaveBeenCalled();
    parse.mockRestore();
  });

  it('refuses text that is not JSON, or JSON that is not a backup', async () => {
    expect(await codeOfImport('SQLite format 3\0')).toBe('BACKUP_INVALID');
    expect(await codeOfImport('[]')).toBe('BACKUP_INVALID');
    expect(await codeOfImport('')).toBe('BACKUP_INVALID');
  });
});

/** Replaces the first row of `table` (tests keep at least one row in it). */
function withRow(
  backup: BackupJson,
  table: string,
  change: (row: Record<string, unknown>) => Record<string, unknown>,
): BackupJson {
  const [first, ...rest] = backup.tables[table]!;
  return { ...backup, tables: { ...backup.tables, [table]: [change(first!), ...rest] } };
}
