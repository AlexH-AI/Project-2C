import { getTableConfig } from 'drizzle-orm/sqlite-core';
import { describe, expect, it, vi } from 'vitest';
import journal from '../migrations/meta/_journal.json';
import { openDatabase } from './database';
import { MIGRATIONS } from './migrations';
import {
  appointmentCoordinators,
  appointments,
  customers,
  kycFacts,
  kycNotes,
  kycVersions,
  people,
  policies,
  schemaMigrations,
  settings,
  stageTransitions,
  teams,
} from './schema';

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

function foreignKeys(db: Awaited<ReturnType<typeof openDatabase>>, table: string): string[] {
  const rows = db.sqlite.exec(
    `SELECT "from", "table", "to" FROM pragma_foreign_key_list('${table}')`,
  );
  return (rows[0]?.values ?? []).map(([from, to, column]) => `${from}->${to}.${column}`).sort();
}

describe('openDatabase', () => {
  it('migrates an empty database to the latest schema version', async () => {
    const db = await openDatabase();

    expect(db.schemaVersion()).toBe(4);
    expect(tableNames(db)).toEqual([
      'appointment_coordinators',
      'appointments',
      'customers',
      'kyc_facts',
      'kyc_notes',
      'kyc_versions',
      'people',
      'policies',
      'schema_migrations',
      'settings',
      'stage_transitions',
      'teams',
    ]);
  });

  it('creates every table exactly as the Drizzle schema declares it', async () => {
    const db = await openDatabase();

    const tables = [
      teams,
      people,
      customers,
      stageTransitions,
      appointments,
      appointmentCoordinators,
      policies,
      kycNotes,
      kycFacts,
      kycVersions,
      settings,
      schemaMigrations,
    ];
    for (const table of tables) {
      const config = getTableConfig(table);
      expect(columnNames(db, config.name)).toEqual(config.columns.map((c) => c.name));
      const declared = config.foreignKeys.map((fk) => {
        const ref = fk.reference();
        return `${ref.columns[0]!.name}->${getTableConfig(ref.foreignTable).name}.${ref.foreignColumns[0]!.name}`;
      });
      expect(foreignKeys(db, config.name)).toEqual(declared.sort());
    }
  });

  it('reopens a saved database without re-running migrations', async () => {
    const first = await openDatabase();
    const bytes = first.export();

    const second = await openDatabase({ bytes });

    expect(second.schemaVersion()).toBe(4);
    const applied = second.sqlite.exec('SELECT count(*) FROM schema_migrations');
    expect(applied[0]?.values[0]?.[0]).toBe(4);
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

  async function withCustomer() {
    const db = await openDatabase();
    db.sqlite.run(
      "INSERT INTO teams (id, name, created_at, updated_at) VALUES ('t', 'T', 'x', 'x')",
    );
    db.sqlite.run(insertPerson('RE', 't'));
    db.sqlite.run(
      "INSERT INTO customers (id, code, name, re_id, stage, created_at, updated_at) VALUES ('c', 'K-0001', 'B', 'p', 'N4', 'x', 'x')",
    );
    return db;
  }

  it('rejects unknown stages in stage transitions', async () => {
    const db = await withCustomer();
    const insert = (seq: number, from: string | null, to: string) =>
      db.sqlite.run(
        "INSERT INTO stage_transitions (id, customer_id, seq, from_stage, to_stage, date, created_at) VALUES (?, 'c', ?, ?, ?, '2026-01-01', 'x')",
        [`s${seq}`, seq, from, to],
      );

    insert(1, null, 'N4');
    insert(2, 'N4', 'N3');
    expect(() => insert(3, 'N9', 'N2')).toThrow(/CHECK/);
    expect(() => insert(4, 'N3', 'N9')).toThrow(/CHECK/);
  });

  it('requires the meeting outcome only on met appointments', async () => {
    const db = await withCustomer();
    const insert = (
      id: string,
      status: string,
      stageAfter: string | null,
      nextStep: string | null,
    ) =>
      db.sqlite.run(
        "INSERT INTO appointments (id, customer_id, re_id, date, status, trigger_type, stage_after, next_step, note, created_at, updated_at) VALUES (?, 'c', 'p', '2026-01-01', ?, 'OTHER', ?, ?, '', 'x', 'x')",
        [id, status, stageAfter, nextStep],
      );

    insert('a1', 'SCHEDULED', null, null);
    insert('a2', 'MET', 'N3', 'Gửi bảng minh họa');
    expect(() => insert('a3', 'MET', null, 'x')).toThrow(/CHECK/);
    expect(() => insert('a4', 'MET', 'N3', null)).toThrow(/CHECK/);
    expect(() => insert('a5', 'NO_SHOW', 'N3', null)).toThrow(/CHECK/);
    expect(() => insert('a6', 'DONE', null, null)).toThrow(/CHECK/);
  });

  it('keeps policy amounts positive and issue data paired and not before submission', async () => {
    const db = await withCustomer();
    const insert = (id: string, fyp: number, issuedDate: string | null, issuedFyp: number | null) =>
      db.sqlite.run(
        "INSERT INTO policies (id, customer_id, re_id, submitted_date, submitted_fyp, issued_date, issued_fyp, created_at, updated_at) VALUES (?, 'c', 'p', '2026-03-10', ?, ?, ?, 'x', 'x')",
        [id, fyp, issuedDate, issuedFyp],
      );

    insert('h1', 1, null, null);
    insert('h2', 1, '2026-03-10', 1);
    expect(() => insert('h3', 0, null, null)).toThrow(/CHECK/);
    expect(() => insert('h4', 1, '2026-03-10', null)).toThrow(/CHECK/);
    expect(() => insert('h5', 1, null, 1)).toThrow(/CHECK/);
    expect(() => insert('h6', 1, '2026-03-09', 1)).toThrow(/CHECK/);
    expect(() => insert('h7', 1, '2026-03-10', 0)).toThrow(/CHECK/);
  });

  it('checks KYC sources, trường, fact statuses and the material flag', async () => {
    const db = await withCustomer();
    const note = (id: string, seq: number, source: string) =>
      db.sqlite.run(
        "INSERT INTO kyc_notes (id, customer_id, seq, text, created_date, source, created_at) VALUES (?, 'c', ?, 'x', '2026-01-01', ?, 'x')",
        [id, seq, source],
      );
    const fact = (id: string, seq: number, field: string, status: string) =>
      db.sqlite.run(
        "INSERT INTO kyc_facts (id, customer_id, seq, field, value_json, note_id, confirmed_date, status, created_at, updated_at) VALUES (?, 'c', ?, ?, '1', 'n1', '2026-01-01', ?, 'x', 'x')",
        [id, seq, field, status],
      );
    const version = (id: string, seq: number, material: number) =>
      db.sqlite.run(
        "INSERT INTO kyc_versions (id, customer_id, seq, hash, date, material, created_at) VALUES (?, 'c', ?, 'h', '2026-01-01', ?, 'x')",
        [id, seq, material],
      );

    note('n1', 1, 'RE');
    note('n2', 2, 'SYSTEM');
    expect(() => note('n3', 3, 'AI')).toThrow(/CHECK/);
    expect(() => note('n4', 2, 'RE')).toThrow(/UNIQUE/);
    fact('f1', 1, 'childrenCount', 'active');
    expect(() => fact('f2', 2, 'shoeSize', 'active')).toThrow(/CHECK/);
    expect(() => fact('f3', 3, 'childrenCount', 'deleted')).toThrow(/CHECK/);
    expect(() => fact('f4', 1, 'occupation', 'active')).toThrow(/UNIQUE/);
    version('v1', 1, 1);
    expect(() => version('v2', 2, 2)).toThrow(/CHECK/);
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
