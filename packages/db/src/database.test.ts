import { getTableConfig } from 'drizzle-orm/sqlite-core';
import { describe, expect, it, vi } from 'vitest';
import journal from '../migrations/meta/_journal.json';
import { openDatabase } from './database';
import { MIGRATIONS } from './migrations';
import { people, schemaMigrations, settings, teams } from './schema';

function tableNames(db: Awaited<ReturnType<typeof openDatabase>>): string[] {
  const rows = db.sqlite.exec(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
  );
  return (rows[0]?.values ?? []).map(([name]) => String(name));
}

function columnNames(db: Awaited<ReturnType<typeof openDatabase>>, table: string): string[] {
  const rows = db.sqlite.exec(`SELECT name FROM pragma_table_info('${table}') ORDER BY cid`);
  return (rows[0]?.values ?? []).map(([name]) => String(name));
}

describe('openDatabase', () => {
  it('migrates an empty database to the latest schema version', async () => {
    const db = await openDatabase();

    expect(db.schemaVersion()).toBe(1);
    expect(tableNames(db)).toEqual(['people', 'schema_migrations', 'settings', 'teams']);
  });

  it('creates every table exactly as the Drizzle schema declares it', async () => {
    const db = await openDatabase();

    for (const table of [teams, people, settings, schemaMigrations]) {
      const config = getTableConfig(table);
      expect(columnNames(db, config.name)).toEqual(config.columns.map((c) => c.name));
    }
  });

  it('reopens a saved database without re-running migrations', async () => {
    const first = await openDatabase();
    const bytes = first.export();

    const second = await openDatabase({ bytes });

    expect(second.schemaVersion()).toBe(1);
    const applied = second.sqlite.exec('SELECT count(*) FROM schema_migrations');
    expect(applied[0]?.values[0]?.[0]).toBe(1);
  });

  it('persists once after migrating, and not at all when already up to date', async () => {
    const persist = vi.fn();
    await openDatabase({ persist });
    expect(persist).toHaveBeenCalledTimes(1);

    const again = vi.fn();
    await openDatabase({ bytes: persist.mock.calls[0]?.[0] as Uint8Array, persist: again });
    expect(again).not.toHaveBeenCalled();
  });

  it('matches the migration list with the drizzle-kit journal', () => {
    expect(MIGRATIONS.map((m) => m.tag)).toEqual(journal.entries.map((e) => e.tag));
    expect(MIGRATIONS.map((m) => m.id)).toEqual(journal.entries.map((e) => e.idx + 1));
  });

  it('enforces foreign keys, also after the database was exported', async () => {
    const persist = vi.fn();
    const db = await openDatabase({ persist });
    db.transaction(() => undefined);

    expect(() =>
      db.sqlite.run(
        "INSERT INTO people (id, name, role, team_id, created_at, updated_at) VALUES ('p', 'A', 'RE', 'missing', 'x', 'x')",
      ),
    ).toThrow(/FOREIGN KEY/);
  });
});

describe('schema constraints', () => {
  const insertPerson = (role: string, teamId: string | null) =>
    `INSERT INTO people (id, name, role, team_id, created_at, updated_at) VALUES ('p', 'A', '${role}', ${teamId === null ? 'NULL' : `'${teamId}'`}, 'x', 'x')`;

  it('rejects an unknown role and an RE or TL without team', async () => {
    const db = await openDatabase();

    expect(() => db.sqlite.run(insertPerson('CEO', null))).toThrow(/CHECK/);
    expect(() => db.sqlite.run(insertPerson('RE', null))).toThrow(/CHECK/);
    expect(() => db.sqlite.run(insertPerson('TL', null))).toThrow(/CHECK/);
    db.sqlite.run(insertPerson('BDM', null));
  });

  it('keeps team names unique among teams that are not deleted', async () => {
    const db = await openDatabase();
    const insertTeam = (id: string, deletedAt: string | null) =>
      db.sqlite.run(
        'INSERT INTO teams (id, name, created_at, updated_at, deleted_at) VALUES (?, ?, ?, ?, ?)',
        [id, 'Sao Mai', 'x', 'x', deletedAt],
      );

    insertTeam('a', 'x');
    insertTeam('b', null);
    expect(() => insertTeam('c', null)).toThrow(/UNIQUE/);
  });
});

describe('transaction', () => {
  it('persists the exported bytes exactly once after a successful transaction', async () => {
    const persist = vi.fn();
    const db = await openDatabase({ persist });
    persist.mockClear();

    const result = db.transaction(() => {
      db.sqlite.run("INSERT INTO settings (key, value_json, updated_at) VALUES ('a', '1', 'x')");
      return 42;
    });

    expect(result).toBe(42);
    expect(persist).toHaveBeenCalledTimes(1);
    const reopened = await openDatabase({ bytes: persist.mock.calls[0]?.[0] as Uint8Array });
    expect(reopened.sqlite.exec('SELECT key FROM settings')[0]?.values).toEqual([['a']]);
  });

  it('rolls back and does not persist when the transaction throws', async () => {
    const persist = vi.fn();
    const db = await openDatabase({ persist });
    persist.mockClear();

    expect(() =>
      db.transaction(() => {
        db.sqlite.run("INSERT INTO settings (key, value_json, updated_at) VALUES ('a', '1', 'x')");
        throw new Error('boom');
      }),
    ).toThrow('boom');

    expect(persist).not.toHaveBeenCalled();
    expect(db.sqlite.exec('SELECT key FROM settings')).toEqual([]);
  });
});
