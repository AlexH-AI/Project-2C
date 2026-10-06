import { getTableConfig } from 'drizzle-orm/sqlite-core';
import initSqlJs, { type Database as SqlJsDatabase } from 'sql.js';
import { describe, expect, it, vi } from 'vitest';
import journal from '../migrations/meta/_journal.json';
import { openDatabase } from './database';
import { DbError } from './errors';
import { LATEST_SCHEMA_VERSION, MIGRATIONS } from './migrations';
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
import { createTeam, listTeams } from './team';

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

    expect(db.schemaVersion()).toBe(LATEST_SCHEMA_VERSION);
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

    expect(second.schemaVersion()).toBe(LATEST_SCHEMA_VERSION);
    const applied = second.sqlite.exec('SELECT count(*) FROM schema_migrations');
    expect(applied[0]?.values[0]?.[0]).toBe(LATEST_SCHEMA_VERSION);
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

  it('refuses a file made by a newer app, without migrating or saving it', async () => {
    const newer = await openDatabase();
    const version = LATEST_SCHEMA_VERSION + 1;
    newer.sqlite.run("INSERT INTO schema_migrations (id, applied_at) VALUES (?, 'x')", [version]);
    const persist = vi.fn();

    const error = await openDatabase({ bytes: newer.export(), persist }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(DbError);
    expect(error).toMatchObject({
      code: 'SCHEMA_TOO_NEW',
      params: { version, supported: LATEST_SCHEMA_VERSION },
    });
    expect(persist).not.toHaveBeenCalled();
  });

  it('runs the given migrations instead of the app ones (tests pass fake ones)', async () => {
    const id = LATEST_SCHEMA_VERSION + 1;
    const fake = { id, tag: 'fake', sql: 'ALTER TABLE teams ADD COLUMN color text;' };
    const db = await openDatabase({ migrations: [...MIGRATIONS, fake] });

    expect(db.schemaVersion()).toBe(id);
    expect(columnNames(db, 'teams')).toContain('color');
  });

  it('rejects with the error of a failing migration, saving nothing', async () => {
    const saved = (await openDatabase()).export();
    const fake = { id: LATEST_SCHEMA_VERSION + 1, tag: 'fake', sql: 'SELECT * FROM nowhere;' };
    const persist = vi.fn();

    const error = await openDatabase({
      bytes: saved,
      migrations: [...MIGRATIONS, fake],
      persist,
    }).catch((e: unknown) => e);

    expect(error).toMatchObject({ message: expect.stringContaining('nowhere') as unknown });
    expect(persist).not.toHaveBeenCalled();
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

  it('keeps an outcome reviewer only on met appointments, and only an existing person (D9)', async () => {
    const db = await withCustomer();
    const insert = (id: string, status: string, reviewer: string) =>
      db.sqlite.run(
        "INSERT INTO appointments (id, customer_id, re_id, date, status, trigger_type, stage_after, next_step, note, created_at, updated_at, outcome_reviewer_id) VALUES (?, 'c', 'p', '2026-01-01', ?, 'OTHER', ?, ?, '', 'x', 'x', ?)",
        [id, status, status === 'MET' ? 'N3' : null, status === 'MET' ? 'x' : null, reviewer],
      );

    insert('a1', 'MET', 'p');
    expect(() => insert('a2', 'NO_SHOW', 'p')).toThrow(/CHECK/);
    expect(() => insert('a3', 'MET', 'nobody')).toThrow(/FOREIGN KEY/);
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

describe('migrating a saved database', () => {
  const rowsOf = (sqlite: SqlJsDatabase, table: string) =>
    sqlite.exec(`SELECT * FROM ${table} ORDER BY rowid`)[0]?.values ?? [];

  /** A database file saved by the app before the outcome reviewer (schema version 4), with data. */
  async function savedAtVersion4() {
    const SQL = await initSqlJs();
    const sqlite = new SQL.Database();
    sqlite.run('PRAGMA foreign_keys = ON');
    for (const migration of MIGRATIONS.slice(0, 4)) {
      sqlite.exec(migration.sql);
      sqlite.run('INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)', [
        migration.id,
        'x',
      ]);
    }
    sqlite.exec(`
      INSERT INTO teams (id, name, created_at, updated_at) VALUES ('t', 'Sao Mai', 'x', 'x');
      INSERT INTO people (id, name, role, team_id, created_at, updated_at) VALUES
        ('re', 'An', 'RE', 't', 'x', 'x'), ('tl', 'Hà', 'TL', 't', 'x', 'x');
      INSERT INTO customers (id, code, name, re_id, stage, created_at, updated_at)
        VALUES ('c', 'K-0001', 'Lan', 're', 'N2', 'x', 'x');
      INSERT INTO appointments (id, customer_id, re_id, date, time, status, trigger_type, trigger_note,
          stage_after, next_step, expected_case_size, note, rescheduled_from_id, created_at, updated_at)
        VALUES
        ('a1', 'c', 're', '2026-09-10', '09:30', 'MET', 'REFERRAL', 'Chị Mai', 'N2', 'Gửi minh họa',
          500000000, 'Quan tâm hưu trí', NULL, 'x', 'x'),
        ('a2', 'c', 're', '2026-09-20', NULL, 'RESCHEDULED', 'OTHER', NULL, NULL, NULL, NULL,
          'KH bận', NULL, 'x', 'x'),
        ('a3', 'c', 're', '2026-09-25', NULL, 'SCHEDULED', 'OTHER', NULL, NULL, NULL, NULL, '',
          'a2', 'x', 'x');
      INSERT INTO appointment_coordinators (appointment_id, person_id) VALUES ('a1', 'tl');
      INSERT INTO stage_transitions (id, customer_id, seq, from_stage, to_stage, date, appointment_id,
          created_at) VALUES
        ('s1', 'c', 1, NULL, 'N3', '2026-09-01', NULL, 'x'),
        ('s2', 'c', 2, 'N3', 'N2', '2026-09-10', 'a1', 'x');
    `);
    return sqlite;
  }

  it('adds the outcome reviewer to a database with data, keeping every row and foreign key', async () => {
    const old = await savedAtVersion4();
    const tables = ['people', 'customers', 'appointment_coordinators', 'stage_transitions'];
    const before = Object.fromEntries(tables.map((table) => [table, rowsOf(old, table)]));
    const appointmentsBefore = rowsOf(old, 'appointments');

    const db = await openDatabase({ bytes: old.export() });

    expect(db.schemaVersion()).toBe(LATEST_SCHEMA_VERSION);
    for (const table of tables) expect(rowsOf(db.sqlite, table)).toEqual(before[table]);
    // The new column comes last and is empty on every existing appointment.
    expect(rowsOf(db.sqlite, 'appointments')).toEqual(
      appointmentsBefore.map((row) => [...row, null]),
    );
    expect(columnNames(db, 'appointments').at(-1)).toBe('outcome_reviewer_id');
    expect(foreignKeys(db, 'appointments')).toContain('outcome_reviewer_id->people.id');
    expect(db.sqlite.exec('PRAGMA foreign_key_check')).toEqual([]);
  });

  it('checks the outcome reviewer on the migrated table as on a new one', async () => {
    const db = await openDatabase({ bytes: (await savedAtVersion4()).export() });
    const setReviewer = (id: string, reviewer: string) =>
      db.sqlite.run('UPDATE appointments SET outcome_reviewer_id = ? WHERE id = ?', [reviewer, id]);

    setReviewer('a1', 'tl');
    expect(() => setReviewer('a3', 'tl')).toThrow(/CHECK/);
    expect(() => setReviewer('a1', 'nobody')).toThrow(/FOREIGN KEY/);
  });

  /** A database at the latest version where a team is referenced by a person, who has a customer. */
  async function savedWithReferences() {
    const db = await openDatabase();
    db.sqlite.exec(`
      INSERT INTO teams (id, name, created_at, updated_at) VALUES ('t', 'Sao Mai', 'x', 'x');
      INSERT INTO people (id, name, role, team_id, created_at, updated_at)
        VALUES ('re', 'An', 'RE', 't', 'x', 'x');
      INSERT INTO customers (id, code, name, re_id, stage, created_at, updated_at)
        VALUES ('c', 'K-0001', 'Lan', 're', 'N2', 'x', 'x');
    `);
    return db.export();
  }

  /** How drizzle-kit adds a CHECK: copy into a new table, drop the old one, rename the new one. */
  const rebuildTeams = {
    id: LATEST_SCHEMA_VERSION + 1,
    tag: 'rebuild_teams',
    sql: `
      PRAGMA foreign_keys=OFF;--> statement-breakpoint
      CREATE TABLE \`__new_teams\` (
        \`id\` text PRIMARY KEY NOT NULL,
        \`name\` text NOT NULL,
        \`created_at\` text NOT NULL,
        \`updated_at\` text NOT NULL,
        \`deleted_at\` text,
        CONSTRAINT "teams_name_filled" CHECK(length("__new_teams"."name") > 0)
      );
      --> statement-breakpoint
      INSERT INTO \`__new_teams\`("id", "name", "created_at", "updated_at", "deleted_at")
        SELECT "id", "name", "created_at", "updated_at", "deleted_at" FROM \`teams\`;--> statement-breakpoint
      DROP TABLE \`teams\`;--> statement-breakpoint
      ALTER TABLE \`__new_teams\` RENAME TO \`teams\`;--> statement-breakpoint
      PRAGMA foreign_keys=ON;--> statement-breakpoint
      CREATE UNIQUE INDEX \`teams_active_name\` ON \`teams\` (\`name\`) WHERE "teams"."deleted_at" IS NULL;
    `,
  };

  it('rebuilds a referenced table on a database with data, keeping every row and reference', async () => {
    const saved = await openDatabase({ bytes: await savedWithReferences() });
    const before = ['teams', 'people', 'customers'].map((table) => rowsOf(saved.sqlite, table));
    const persist = vi.fn();

    const db = await openDatabase({
      bytes: saved.export(),
      migrations: [...MIGRATIONS, rebuildTeams],
      persist,
    });

    expect(db.schemaVersion()).toBe(rebuildTeams.id);
    expect(persist).toHaveBeenCalledTimes(1);
    expect(['teams', 'people', 'customers'].map((table) => rowsOf(db.sqlite, table))).toEqual(
      before,
    );
    expect(db.sqlite.exec('PRAGMA foreign_key_check')).toEqual([]);
    expect(() =>
      db.sqlite.run(
        "INSERT INTO teams (id, name, created_at, updated_at) VALUES ('e', '', 'x', 'x')",
      ),
    ).toThrow(/CHECK/);
    // Foreign keys are enforced again once the migrations are done.
    expect(() =>
      db.sqlite.run(
        "INSERT INTO people (id, name, role, team_id, created_at, updated_at) VALUES ('p', 'Hà', 'TL', 'nowhere', 'x', 'x')",
      ),
    ).toThrow(/FOREIGN KEY/);
  });

  it('rejects a migration that leaves references pointing nowhere, saving nothing', async () => {
    const bytes = await savedWithReferences();
    const dropTeam = {
      id: LATEST_SCHEMA_VERSION + 1,
      tag: 'drop_team',
      sql: "DELETE FROM teams WHERE id = 't';",
    };
    const persist = vi.fn();

    const error = await openDatabase({
      bytes,
      migrations: [...MIGRATIONS, dropTeam],
      persist,
    }).catch((e: unknown) => e);

    expect(error).toMatchObject({
      message: expect.stringMatching(/migration 6 .*people → teams/i) as unknown,
    });
    expect(persist).not.toHaveBeenCalled();
    const reopened = await openDatabase({ bytes });
    expect(rowsOf(reopened.sqlite, 'teams')).toHaveLength(1);
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

  it('rolls back and does not persist when COMMIT fails, so the next transaction can start', async () => {
    const persist = vi.fn();
    const db = await openDatabase({ persist });
    persist.mockClear();
    const insertPerson = (id: string, team: string) =>
      db.sqlite.run(
        "INSERT INTO people (id, name, role, team_id, created_at, updated_at) VALUES (?, 'An', 'TL', ?, 'x', 'x')",
        [id, team],
      );

    // Deferred foreign keys are only checked at COMMIT.
    expect(() =>
      db.transaction(() => {
        db.sqlite.run('PRAGMA defer_foreign_keys = ON');
        insertPerson('lost', 'nowhere');
      }),
    ).toThrow(/FOREIGN KEY/);

    expect(persist).not.toHaveBeenCalled();
    expect(db.sqlite.exec('SELECT id FROM people')).toEqual([]);
    db.transaction(() => {
      db.sqlite.run(
        "INSERT INTO teams (id, name, created_at, updated_at) VALUES ('t', 'Sao Mai', 'x', 'x')",
      );
      insertPerson('kept', 't');
    });
    expect(db.sqlite.exec('SELECT id FROM people')[0]?.values).toEqual([['kept']]);
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it('undoes only a failed nested transaction and persists once, after the outer one', async () => {
    const persist = vi.fn();
    const db = await openDatabase({ persist });
    persist.mockClear();
    const insert = (key: string) =>
      db.sqlite.run('INSERT INTO settings (key, value_json, updated_at) VALUES (?, ?, ?)', [
        key,
        '1',
        'x',
      ]);

    db.transaction(() => {
      insert('outer');
      db.transaction(() => insert('kept'));
      expect(() =>
        db.transaction(() => {
          insert('undone');
          throw new Error('boom');
        }),
      ).toThrow('boom');
    });

    expect(persist).toHaveBeenCalledTimes(1);
    expect(db.sqlite.exec('SELECT key FROM settings ORDER BY key')[0]?.values).toEqual([
      ['kept'],
      ['outer'],
    ]);
  });
});

describe('sources', () => {
  it('takes ids from the given sources inside withSources, and the own ones again after', async () => {
    const db = await openDatabase({ now: () => new Date(0), random: (bytes) => bytes.fill(0) });
    const zeros = createTeam(db, { name: 'A' });
    const ones = db.withSources(
      { now: () => new Date(0), random: (bytes) => bytes.fill(255) },
      () => createTeam(db, { name: 'B' }),
    );
    const zerosAgain = () => createTeam(db, { name: 'C' });

    expect(zeros.id).toBe('0'.repeat(26));
    expect(ones.id).toBe('0'.repeat(10) + 'Z'.repeat(16));
    expect(() => zerosAgain()).toThrow(/UNIQUE/);
  });

  it('keeps queries working across an export, when statements are reused', async () => {
    const db = await openDatabase({ persist: () => undefined });
    createTeam(db, { name: 'A' });
    createTeam(db, { name: 'B' });
    expect(listTeams(db).map((t) => t.name)).toEqual(['A', 'B']);
  });
});
