/**
 * Opens the single sql.js database used everywhere (ADR-0016): runs pending migrations and hands
 * the file bytes to the `persist` port after every successful transaction.
 */
import { drizzle, type SQLJsDatabase } from 'drizzle-orm/sql-js';
import initSqlJs, { type Database as SqlJsDatabase } from 'sql.js';
import { MIGRATIONS, type Migration } from './migrations';
import * as schema from './schema';

export interface OpenDatabaseOptions {
  /** Existing database file; omitted → a new empty database. */
  readonly bytes?: Uint8Array;
  /** Save port, called with the whole file after each successful transaction. */
  readonly persist?: (bytes: Uint8Array) => void;
  /** Where sql.js finds its wasm file (browser builds); Node resolves it on its own. */
  readonly locateFile?: (file: string) => string;
  /** Clock for timestamps and ids; tests pin it. */
  readonly now?: () => Date;
}

export interface Database {
  readonly orm: SQLJsDatabase<typeof schema>;
  /** Raw sql.js handle — for tests and the migration runner only. */
  readonly sqlite: SqlJsDatabase;
  readonly now: () => Date;
  schemaVersion(): number;
  /** Runs `fn` atomically; persists only when it returns without throwing. */
  transaction<T>(fn: () => T): T;
  export(): Uint8Array;
}

export async function openDatabase(options: OpenDatabaseOptions = {}): Promise<Database> {
  const SQL = await initSqlJs(options.locateFile ? { locateFile: options.locateFile } : {});
  const sqlite = new SQL.Database(options.bytes);
  const now = options.now ?? (() => new Date());
  const persist = options.persist;
  enableForeignKeys(sqlite);

  const exportBytes = (): Uint8Array => {
    const bytes = sqlite.export();
    // sql.js reopens the database on export, which resets connection pragmas.
    enableForeignKeys(sqlite);
    return bytes;
  };

  const db: Database = {
    orm: drizzle(sqlite, { schema }),
    sqlite,
    now,
    schemaVersion: () => schemaVersion(sqlite),
    transaction<T>(fn: () => T): T {
      sqlite.run('BEGIN');
      let result: T;
      try {
        result = fn();
        sqlite.run('COMMIT');
      } catch (error) {
        sqlite.run('ROLLBACK');
        throw error;
      }
      persist?.(exportBytes());
      return result;
    },
    export: exportBytes,
  };

  migrate(db, MIGRATIONS);
  return db;
}

function enableForeignKeys(sqlite: SqlJsDatabase): void {
  sqlite.run('PRAGMA foreign_keys = ON');
}

function hasMigrationTable(sqlite: SqlJsDatabase): boolean {
  const rows = sqlite.exec(
    "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'schema_migrations'",
  );
  return rows.length > 0;
}

function schemaVersion(sqlite: SqlJsDatabase): number {
  if (!hasMigrationTable(sqlite)) return 0;
  const rows = sqlite.exec('SELECT coalesce(max(id), 0) FROM schema_migrations');
  return Number(rows[0]?.values[0]?.[0]);
}

/** Applies every migration newer than the database, all in one transaction. */
function migrate(db: Database, migrations: readonly Migration[]): void {
  const current = schemaVersion(db.sqlite);
  const pending = migrations.filter((m) => m.id > current);
  if (pending.length === 0) return;
  db.transaction(() => {
    for (const migration of pending) {
      db.sqlite.exec(migration.sql);
      db.sqlite.run('INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)', [
        migration.id,
        db.now().toISOString(),
      ]);
    }
  });
}
