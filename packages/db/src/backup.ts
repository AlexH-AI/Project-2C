/**
 * `.p2cbackup` files (spec §6, ADR-0010 B): the whole database as JSON with fixed key order, each
 * table sorted by its primary key, soft-deleted rows included. Importing builds a new database and
 * never touches the open one (D5: the app replaces it afterwards).
 */
import type { Database as SqlJsDatabase, SqlValue } from 'sql.js';
import { z } from 'zod';
import { assertSupported, openDatabase, type Database, type OpenDatabaseOptions } from './database';
import { DbError } from './errors';
import { MIGRATIONS } from './migrations';

/** Tells our files apart from any other JSON, including Project-2's `.p2backup`. */
export const BACKUP_FORMAT = 'project2c-backup';

export interface ImportedBackup {
  /** The new database, migrated to the app's schema version. */
  readonly db: Database;
  /** When the file was exported (ISO-8601 UTC). */
  readonly exportedAt: string;
  /** The schema version the file was written at. */
  readonly schemaVersion: number;
}

type Row = Record<string, SqlValue>;

const envelope = z.strictObject({
  format: z.literal(BACKUP_FORMAT),
  schemaVersion: z.int().positive(),
  exportedAt: z.iso.datetime(),
  tables: z.record(z.string(), z.array(z.record(z.string(), z.unknown()))),
});

export function exportBackup(db: Database): string {
  const tables: Record<string, Row[]> = {};
  for (const table of dataTables(db.sqlite)) {
    const columns = columnsOf(db.sqlite, table);
    const key = columns
      .filter((c) => c.pk > 0)
      .sort((a, b) => a.pk - b.pk)
      .map((c) => quote(c.name))
      .join(', ');
    const result = db.sqlite.exec(
      `SELECT ${columnList(columns)} FROM ${quote(table)} ORDER BY ${key}`,
    );
    tables[table] = (result[0]?.values ?? []).map((values) =>
      Object.fromEntries(columns.map((c, i) => [c.name, values[i]!])),
    );
  }
  return JSON.stringify({
    format: BACKUP_FORMAT,
    schemaVersion: db.schemaVersion(),
    exportedAt: db.now().toISOString(),
    tables,
  });
}

/**
 * Builds a database at the file's schema version, loads the rows, then runs the migrations the
 * file is missing. Rejects with `SCHEMA_TOO_NEW` or `BACKUP_INVALID`; the open database is never
 * touched. `options` are those of the new database: nothing is saved while importing, `persist`
 * fires only for later transactions (the app asks and backs up the current file first, spec §6).
 */
export async function importBackup(
  text: string,
  options: OpenDatabaseOptions = {},
): Promise<ImportedBackup> {
  const file = parse(text);
  const migrations = options.migrations ?? MIGRATIONS;
  assertSupported(file.schemaVersion, migrations);
  const loaded = await staged(
    {
      ...options,
      bytes: undefined,
      migrations: migrations.filter((m) => m.id <= file.schemaVersion),
    },
    (staging) => load(staging, file.tables),
  );
  // Migrating is a transaction, which would persist: run it apart too.
  const migrated = await staged({ ...options, bytes: loaded, migrations }, () => undefined);
  const db = await openDatabase({ ...options, bytes: migrated, migrations });
  return { db, exportedAt: file.exportedAt, schemaVersion: file.schemaVersion };
}

/**
 * Opens a database that is never saved, runs `fn` on it and returns its bytes. Errors of SQLite
 * (CHECK, UNIQUE, NOT NULL, a migration the file's rows break) mean a damaged file too.
 */
async function staged(
  options: OpenDatabaseOptions,
  fn: (db: Database) => void,
): Promise<Uint8Array> {
  let db: Database | undefined;
  try {
    db = await openDatabase({ ...options, persist: undefined });
    fn(db);
    return db.export();
  } catch (error) {
    throw error instanceof DbError ? error : invalid();
  } finally {
    db?.sqlite.close();
  }
}

function parse(text: string): z.infer<typeof envelope> {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw invalid();
  }
  const result = envelope.safeParse(json);
  if (!result.success) throw invalid();
  return result.data;
}

/** Inserts every row with foreign keys off (rows reference each other in any order), then checks. */
function load(db: Database, tables: Record<string, Record<string, unknown>[]>): void {
  const names = dataTables(db.sqlite);
  if (!sameSet(Object.keys(tables), names)) throw invalid();
  db.sqlite.run('PRAGMA foreign_keys = OFF');
  db.transaction(() => {
    for (const table of names) {
      const columns = columnsOf(db.sqlite, table);
      const insert = `INSERT INTO ${quote(table)} (${columnList(columns)}) VALUES (${columns.map(() => '?').join(', ')})`;
      for (const row of tables[table]!) {
        if (
          !sameSet(
            Object.keys(row),
            columns.map((c) => c.name),
          )
        )
          throw invalid();
        db.sqlite.run(
          insert,
          columns.map((c) => valueOf(c, row[c.name])),
        );
      }
    }
    if (db.sqlite.exec('PRAGMA foreign_key_check').length > 0) throw invalid();
  });
}

interface Column {
  readonly name: string;
  readonly type: string;
  /** Position in the primary key, 0 when not part of it. */
  readonly pk: number;
}

/** Every table that holds data: all but SQLite's own and the migration log. */
function dataTables(sqlite: SqlJsDatabase): string[] {
  const result = sqlite.exec(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name <> 'schema_migrations' ORDER BY name",
  );
  return result[0]!.values.map(([name]) => String(name));
}

function columnsOf(sqlite: SqlJsDatabase, table: string): Column[] {
  const result = sqlite.exec('SELECT name, type, pk FROM pragma_table_info(?) ORDER BY cid', [
    table,
  ]);
  return result[0]!.values.map(([name, type, pk]) => ({
    name: String(name),
    type: String(type).toLowerCase(),
    pk: Number(pk),
  }));
}

/**
 * The file's value for an insert; SQLite alone would store text in an integer column. The schema
 * has integer and text columns only (a test checks it): a new kind of column needs a case here.
 */
function valueOf(column: Column, value: unknown): SqlValue {
  if (value === null) return null;
  if (column.type === 'integer' && Number.isSafeInteger(value)) return value as number;
  if (column.type === 'text' && typeof value === 'string') return value;
  throw invalid();
}

const sameSet = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && b.every((name) => a.includes(name));

const columnList = (columns: readonly Column[]) => columns.map((c) => quote(c.name)).join(', ');

const quote = (name: string) => `"${name.replaceAll('"', '""')}"`;

const invalid = () => new DbError('BACKUP_INVALID');
