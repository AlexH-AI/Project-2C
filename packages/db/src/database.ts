/**
 * Opens the single sql.js database used everywhere (ADR-0016): runs pending migrations and hands
 * the file bytes to the `persist` port after every successful transaction.
 */
import { drizzle, type SQLJsDatabase } from 'drizzle-orm/sql-js';
import initSqlJs, { type Database as SqlJsDatabase, type Statement } from 'sql.js';
import { DbError } from './errors';
import { cryptoFill, type RandomFill } from './ids';
import { latestVersion, MIGRATIONS, type Migration } from './migrations';
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
  /** Random bytes for ids and customer codes; defaults to `crypto`. */
  readonly random?: RandomFill;
  /** The migrations to run; defaults to the app's. Tests pass fake ones. */
  readonly migrations?: readonly Migration[];
}

/** Where timestamps, ids and customer codes come from. */
export interface Sources {
  readonly now: () => Date;
  readonly random: RandomFill;
}

export interface Database {
  readonly orm: SQLJsDatabase<typeof schema>;
  /** Raw sql.js handle — for tests and the migration runner only. */
  readonly sqlite: SqlJsDatabase;
  now(): Date;
  random: RandomFill;
  schemaVersion(): number;
  /**
   * Runs `fn` atomically; persists only when it returns without throwing. A nested call runs in a
   * savepoint of the outer transaction, which alone persists.
   */
  transaction<T>(fn: () => T): T;
  /** Runs `fn` with other sources, e.g. the seeded ones of the simulated data. */
  withSources<T>(sources: Sources, fn: () => T): T;
  export(): Uint8Array;
}

export async function openDatabase(options: OpenDatabaseOptions = {}): Promise<Database> {
  const SQL = await initSqlJs(options.locateFile ? { locateFile: options.locateFile } : {});
  const sqlite = new SQL.Database(options.bytes);
  const migrations = options.migrations ?? MIGRATIONS;
  try {
    assertSupported(schemaVersion(sqlite), migrations);
  } catch (error) {
    sqlite.close();
    throw error;
  }
  let sources: Sources = {
    now: options.now ?? (() => new Date()),
    random: options.random ?? cryptoFill,
  };
  const persist = options.persist;
  let depth = 0;
  enableForeignKeys(sqlite);
  const statements = cacheStatements(sqlite);

  const exportBytes = (): Uint8Array => {
    statements.clear();
    const bytes = sqlite.export();
    // sql.js reopens the database on export, which resets connection pragmas.
    enableForeignKeys(sqlite);
    return bytes;
  };

  const db: Database = {
    orm: drizzle(sqlite, { schema }),
    sqlite,
    now: () => sources.now(),
    random: (bytes) => sources.random(bytes),
    schemaVersion: () => schemaVersion(sqlite),
    transaction<T>(fn: () => T): T {
      const nested = depth > 0;
      sqlite.run(nested ? 'SAVEPOINT nested' : 'BEGIN');
      depth++;
      let result: T;
      try {
        result = fn();
      } catch (error) {
        sqlite.exec(nested ? 'ROLLBACK TO nested; RELEASE nested' : 'ROLLBACK');
        throw error;
      } finally {
        depth--;
      }
      if (nested) {
        sqlite.run('RELEASE nested');
      } else {
        commit(sqlite);
        persist?.(exportBytes());
      }
      return result;
    },
    withSources<T>(next: Sources, fn: () => T): T {
      const previous = sources;
      sources = next;
      try {
        return fn();
      } finally {
        sources = previous;
      }
    },
    export: exportBytes,
  };

  try {
    migrate(db, migrations);
  } catch (error) {
    sqlite.close();
    throw error;
  }
  return db;
}

/** A newer app wrote this schema version: opening it could lose what this app does not know. */
export function assertSupported(version: number, migrations: readonly Migration[]): void {
  const supported = latestVersion(migrations);
  if (version > supported) throw new DbError('SCHEMA_TOO_NEW', { version, supported });
}

/**
 * Drizzle prepares and frees a statement for every query; keeping one per SQL text, reset instead
 * of freed, makes the simulated data (~100k queries) several times faster. Export reopens the
 * database, so the cached statements must really be freed before it.
 */
function cacheStatements(sqlite: SqlJsDatabase): { clear(): void } {
  const cache = new Map<string, { statement: Statement; free: () => boolean }>();
  const prepare = sqlite.prepare.bind(sqlite);
  sqlite.prepare = (sql, params) => {
    let entry = cache.get(sql);
    if (!entry) {
      const statement = prepare(sql);
      entry = { statement, free: statement.free.bind(statement) };
      statement.free = () => {
        statement.reset();
        return true;
      };
      cache.set(sql, entry);
    }
    if (params !== undefined) entry.statement.bind(params);
    return entry.statement;
  };
  return {
    clear() {
      for (const { free } of cache.values()) free();
      cache.clear();
    },
  };
}

/**
 * A failed COMMIT (deferred foreign keys) leaves the transaction open; roll it back so the error is
 * the only effect and the next BEGIN works.
 */
function commit(sqlite: SqlJsDatabase): void {
  try {
    sqlite.run('COMMIT');
  } catch (error) {
    try {
      sqlite.run('ROLLBACK');
    } catch {
      // SQLite already ended the transaction; the COMMIT error is the one to report.
    }
    throw error;
  }
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

/**
 * Applies every migration newer than the database, all in one transaction. Foreign keys are off
 * while they run, as for loading a backup: drizzle-kit rebuilds a table (copy, drop, rename) to add
 * a CHECK, and its own `PRAGMA foreign_keys=OFF` does nothing inside a transaction, so dropping a
 * referenced table with rows would fail. Every reference is checked before COMMIT instead.
 */
export function migrate(db: Database, migrations: readonly Migration[]): void {
  const current = schemaVersion(db.sqlite);
  const pending = migrations.filter((m) => m.id > current);
  if (pending.length === 0) return;
  db.sqlite.run('PRAGMA foreign_keys = OFF');
  try {
    db.transaction(() => {
      for (const migration of pending) {
        db.sqlite.exec(migration.sql);
        assertReferencesKept(db.sqlite, migration);
        db.sqlite.run('INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)', [
          migration.id,
          db.now().toISOString(),
        ]);
      }
    });
  } finally {
    enableForeignKeys(db.sqlite);
  }
}

function assertReferencesKept(sqlite: SqlJsDatabase, migration: Migration): void {
  const broken = sqlite.exec('PRAGMA foreign_key_check')[0]?.values ?? [];
  if (broken.length === 0) return;
  const pairs = new Set(broken.map(([table, , parent]) => `${String(table)} → ${String(parent)}`));
  throw new Error(
    `Migration ${migration.id} (${migration.tag}) leaves references pointing nowhere: ${[...pairs].join(', ')}`,
  );
}
