import { calendarDate } from '@p2c/domain';
import { describe, expect, it, vi } from 'vitest';
import { BACKUP_FORMAT, exportBackup, importBackup } from './backup';
import { createCustomer, listCustomers, softDeleteCustomer } from './customers';
import { openDatabase } from './database';
import { DbError } from './errors';
import { MIGRATIONS } from './migrations';
import { seedDemoData } from './seed';
import { listTeams } from './team';
import { setup } from './test-support';

const SLOW = 60_000;
const EXPORTED_AT = new Date(Date.UTC(2026, 8, 30, 7, 45, 0));
const exportClock = () => EXPORTED_AT;

interface BackupJson {
  format: string;
  schemaVersion: number;
  exportedAt: string;
  tables: Record<string, Record<string, unknown>[]>;
}

/** A small database: one team, two REs, a TL, a live customer and a soft-deleted one. */
async function small() {
  const { db, re } = await setup();
  createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N3', date: calendarDate(2026, 9, 1) });
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
    expect(backup.schemaVersion).toBe(5);
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

      expect(imported.schemaVersion).toBe(5);
      expect(imported.exportedAt).toBe('2026-09-30T07:45:00.000Z');
      expect(imported.db.schemaVersion()).toBe(5);
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
    backup.schemaVersion = 6;

    const error = await importBackup(JSON.stringify(backup)).catch((e: unknown) => e);

    expect(error).toMatchObject({ code: 'SCHEMA_TOO_NEW', params: { version: 6, supported: 5 } });
  });

  it('loads a file from an older app at its own version, then runs the missing migrations', async () => {
    const old = await openDatabase({ migrations: MIGRATIONS.slice(0, 4) });
    old.sqlite.run(
      "INSERT INTO teams (id, name, created_at, updated_at) VALUES ('t', 'Sao Mai', 'x', 'x')",
    );
    const fake = {
      id: 6,
      tag: '0005_fake',
      sql: "ALTER TABLE teams ADD COLUMN color text DEFAULT 'blue';",
    };

    const imported = await importBackup(exportBackup(old), {
      migrations: [...MIGRATIONS, fake],
    });

    expect(imported.schemaVersion).toBe(4);
    expect(imported.db.schemaVersion()).toBe(6);
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
