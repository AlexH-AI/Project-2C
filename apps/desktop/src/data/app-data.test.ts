import {
  createCustomer,
  createPerson,
  createTeam,
  DbError,
  getSetting,
  importBackup,
  LATEST_SCHEMA_VERSION,
  listTeams,
  openDatabase,
  scheduleAppointment,
  softDeleteTeam,
  type Database,
} from '@p2c/db';
import { byName, calendarDate, formatDate, fromLocalDate, type CalendarDate } from '@p2c/domain';
import { describe, expect, it, vi } from 'vitest';
import { errorMessage } from '../i18n';
import {
  isDamagedDataError,
  isStartupBackupError,
  isUnsavedChangesError,
  openAppData,
  type AppData,
  type BackupPreview,
  type ExportedBackup,
  type StoragePort,
} from './app-data';

const TODAY = calendarDate(2026, 9, 27);

/** Stand-in for the simulated data: one team named after the anchor day. */
function fakeSeed(db: Database, anchorDate: CalendarDate) {
  createTeam(db, { name: `Seed ${formatDate(anchorDate)}` });
}

/** In-memory stand-in for the exe's database file. */
function memoryStorage(initial?: Uint8Array) {
  const saves: Uint8Array[] = [];
  const events: string[] = [];
  let failNextSave = false;
  const storage: StoragePort = {
    load: () => Promise.resolve(initial),
    save: (bytes) => {
      events.push('save');
      if (failNextSave) {
        failNextSave = false;
        return Promise.reject(new Error('disk full'));
      }
      saves.push(bytes);
      return Promise.resolve();
    },
    backup: () => {
      events.push('backup');
      return Promise.resolve('project2c-20260927-101500.db');
    },
    writeExport: (name, bytes) => {
      events.push('export');
      exports.push({ name, text: new TextDecoder().decode(bytes) });
      return Promise.resolve(`C:\\P2C\\Project2C-data\\exports\\${name}`);
    },
    latestBackup: () => Promise.resolve('project2c-s00000001-20260927-101500.db'),
    openFolder: (kind) => {
      events.push(`open ${kind}`);
      return Promise.resolve();
    },
  };
  const exports: { name: string; text: string }[] = [];
  return { storage, saves, events, exports, failSave: () => (failNextSave = true) };
}

const teamNames = (db: Database) =>
  listTeams(db)
    .map((team) => team.name)
    .sort(byName);

/** A promise the test settles. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

/**
 * Holds the storage's backups until the test settles them; `started` resolves once a replace asks
 * for one.
 */
function holdBackup(storage: StoragePort) {
  const backup = storage.backup;
  const gate = deferred<void>();
  const started = deferred<void>();
  storage.backup = async () => {
    started.resolve();
    await gate.promise;
    return backup();
  };
  return { started: started.promise, release: () => gate.resolve() };
}

/**
 * The schema version of a saved file, read without migrating it: with no migration known, a file
 * of any version above 0 is refused as too new, and the refusal names its version.
 */
async function storedVersion(bytes: Uint8Array): Promise<number | string | undefined> {
  try {
    return (await openDatabase({ bytes, migrations: [] })).schemaVersion();
  } catch (error) {
    if (error instanceof DbError && error.code === 'SCHEMA_TOO_NEW') return error.params?.version;
    throw error;
  }
}

/** What `fn` threw; `undefined` when it did not. */
function thrownBy(fn: () => unknown): unknown {
  try {
    fn();
  } catch (error) {
    return error;
  }
  return undefined;
}

describe('openAppData', () => {
  it('without storage (web mode) opens a migrated database with the simulated data', async () => {
    const seed = vi.fn(fakeSeed);
    const app = await openAppData({ today: () => TODAY, seed });

    expect(app.db().schemaVersion()).toBeGreaterThan(0);
    expect(app.hasFile).toBe(false);
    expect(seed).toHaveBeenCalledTimes(1);
    expect(teamNames(app.db())).toEqual(['Seed 27/09/2026']);
    createTeam(app.db(), { name: 'Sao Mai' });
    await app.saves.idle();
    expect(app.saves.failed()).toBe(false);
  });

  it("opens a ready snapshot of the app's day instead of seeding, and seeds again on reload (DR-79)", async () => {
    const ready = await openDatabase();
    createTeam(ready, { name: 'Snapshot' });
    const bytes = ready.export();
    const snapshot = vi.fn((day: CalendarDate) =>
      Promise.resolve(formatDate(day) === '27/09/2026' ? bytes : undefined),
    );
    const seed = vi.fn(fakeSeed);

    const app = await openAppData({ today: () => TODAY, seed, snapshot });
    expect(snapshot).toHaveBeenCalledWith(TODAY);
    expect(seed).not.toHaveBeenCalled();
    expect(teamNames(app.db())).toEqual(['Snapshot']);

    await app.reloadDemoData();
    expect(seed).toHaveBeenCalledTimes(1);
    expect(teamNames(app.db())).toEqual(['Seed 27/09/2026']);
  });

  it('seeds when there is no snapshot for the day', async () => {
    const seed = vi.fn(fakeSeed);
    const app = await openAppData({
      today: () => TODAY,
      seed,
      snapshot: () => Promise.resolve(undefined),
    });
    expect(seed).toHaveBeenCalledTimes(1);
    expect(teamNames(app.db())).toEqual(['Seed 27/09/2026']);
  });

  it("dates the database's writes and checks on the app's day, also after new data", async () => {
    let today = TODAY;
    const app = await openAppData({ today: () => today, seed: fakeSeed });
    expect(fromLocalDate(app.db().now())).toEqual(TODAY);

    today = calendarDate(2026, 10, 1);
    await app.reloadDemoData();
    expect(fromLocalDate(app.db().now())).toEqual(today);
  });

  it("keeps the clock's time of day on the pinned day, and the clock itself when nothing is pinned", async () => {
    const at = new Date(2026, 11, 31, 23, 59, 59);
    const pinned = await openAppData({ today: () => TODAY, clock: () => at, seed: fakeSeed });
    expect(pinned.db().now()).toEqual(new Date(2026, 8, 27, 23, 59, 59));
    expect(at).toEqual(new Date(2026, 11, 31, 23, 59, 59));

    const real = await openAppData({ clock: () => at, seed: fakeSeed });
    expect(real.db().now()).toEqual(at);
  });

  it('moves a pinned day on with the clock, so an app left open crosses midnight (T-126)', async () => {
    let at = new Date(2026, 9, 31, 23, 59);
    const app = await openAppData({ today: () => TODAY, clock: () => at, seed: fakeSeed });
    expect(app.today()).toEqual(TODAY);

    at = new Date(2026, 10, 1, 0, 1);
    expect(app.today()).toEqual(calendarDate(2026, 9, 28));
    expect(fromLocalDate(app.db().now())).toEqual(calendarDate(2026, 9, 28));
  });

  it('with no file yet loads the simulated data and saves it', async () => {
    const { storage, saves } = memoryStorage();

    const app = await openAppData({ storage, today: () => TODAY, seed: fakeSeed });
    await app.saves.idle();

    expect(app.hasFile).toBe(true);
    expect(saves).toHaveLength(1);
    const reopened = await openDatabase({ bytes: saves[0] });
    expect(reopened.schemaVersion()).toBe(app.db().schemaVersion());
    expect(teamNames(reopened)).toEqual(['Seed 27/09/2026']);
  });

  it('opens the stored file without seeding and saves every later transaction', async () => {
    const original = await openDatabase();
    createTeam(original, { name: 'Sao Mai' });
    const { storage, saves } = memoryStorage(original.export());
    const seed = vi.fn(fakeSeed);

    const app = await openAppData({ storage, seed });
    expect(seed).not.toHaveBeenCalled();
    expect(teamNames(app.db())).toEqual(['Sao Mai']);

    createTeam(app.db(), { name: 'Bình Minh' });
    await app.saves.idle();
    const onDisk = await openDatabase({ bytes: saves.at(-1) });
    expect(teamNames(onDisk)).toEqual(['Bình Minh', 'Sao Mai']);
  });

  it('backs the stored file up once it opened it, before saving anything (DR-51)', async () => {
    // A file from before the latest migration: opening it migrates, and that saves at once.
    const older = await openDatabase({ migrations: [] });
    const { storage, saves, events } = memoryStorage(older.export());

    const app = await openAppData({ storage });
    await app.saves.idle();

    expect(events).toEqual(['backup', 'save']);
    expect((await openDatabase({ bytes: saves[0] })).schemaVersion()).toBe(LATEST_SCHEMA_VERSION);
  });

  it('does not start, and saves nothing, when the startup backup fails', async () => {
    const older = await openDatabase({ migrations: [] });
    const { storage, events } = memoryStorage(older.export());
    storage.backup = () => Promise.reject(new Error('disk full'));

    const error = await openAppData({ storage }).catch((e: unknown) => e);
    expect(isStartupBackupError(error)).toBe(true);
    expect((error as Error).cause).toEqual(new Error('disk full'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(events).toEqual([]);
  });

  it('refuses a file damaged inside that still opens: no backup, nothing saved (DR6-06)', async () => {
    // A real file with data, one page near its end (rows of `teams`) overwritten.
    const original = await openDatabase();
    for (let n = 0; n < 100; n++) createTeam(original, { name: `Team ${n} ${'x'.repeat(100)}` });
    const damaged = original.export();
    const pageSize = (damaged[16]! << 8) | damaged[17]!;
    const page = damaged.length / pageSize - 2;
    damaged.fill(0xff, page * pageSize, (page + 1) * pageSize);
    const { storage, events } = memoryStorage(damaged);

    const error = await openAppData({ storage }).catch((e: unknown) => e);

    expect(isDamagedDataError(error)).toBe(true);
    expect((error as Error).cause).toEqual(expect.any(String));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(events).toEqual([]);
  });

  it('never backs up a file it cannot open, so a damaged file is never the newest backup', async () => {
    const header = new TextEncoder().encode('SQLite format 3\0');
    const damaged = new Uint8Array(4096);
    damaged.set(header);
    const { storage, events } = memoryStorage(damaged);

    await expect(openAppData({ storage })).rejects.toThrow();
    expect(events).toEqual([]);
  });

  it('backs up nothing on a first start: there is no file yet', async () => {
    const { storage, events } = memoryStorage();
    const app = await openAppData({ storage, today: () => TODAY, seed: fakeSeed });
    await app.saves.idle();
    expect(events).toEqual(['save']);
  });

  it('refuses a file made by a newer app: no seeding, no migrating, nothing saved', async () => {
    const newer = await openDatabase();
    newer.sqlite.run("INSERT INTO schema_migrations (id, applied_at) VALUES (99, 'x')");
    const { storage, events } = memoryStorage(newer.export());
    const seed = vi.fn(fakeSeed);

    const error = await openAppData({ storage, seed }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(DbError);
    expect(error).toMatchObject({ code: 'SCHEMA_TOO_NEW', params: { version: 99 } });
    expect(seed).not.toHaveBeenCalled();
    expect(events).toEqual([]);
  });

  it('run() returns what the command returns and tells subscribers the data changed', async () => {
    const app = await openAppData({ today: () => TODAY, seed: fakeSeed });
    const listener = vi.fn();
    app.subscribe(listener);
    const before = app.revision();

    const team = app.run((db) => createTeam(db, { name: 'Sao Mai' }));

    expect(team.name).toBe('Sao Mai');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(app.revision()).toBeGreaterThan(before);
  });

  it('run() of a rejected command rethrows and tells no one: nothing changed', async () => {
    const app = await openAppData({ today: () => TODAY, seed: fakeSeed });
    const listener = vi.fn();
    app.subscribe(listener);
    const before = app.revision();

    expect(() => app.run((db) => createTeam(db, { name: 'Seed 27/09/2026' }))).toThrow(
      'TEAM_NAME_TAKEN',
    );
    expect(listener).not.toHaveBeenCalled();
    expect(app.revision()).toBe(before);
  });

  it('measures the seeding time for the browser check of #64', async () => {
    await openAppData({ today: () => TODAY, seed: fakeSeed });
    expect(performance.getEntriesByName('p2c:demo-seed', 'measure').length).toBeGreaterThan(0);
  });
});

describe('tables', () => {
  /** Every SQL text the database runs from now on. */
  function watchQueries(db: Database): string[] {
    const queries: string[] = [];
    const exec = db.sqlite.exec.bind(db.sqlite);
    const prepare = db.sqlite.prepare.bind(db.sqlite);
    vi.spyOn(db.sqlite, 'exec').mockImplementation((sql, params) => {
      queries.push(sql);
      return exec(sql, params);
    });
    vi.spyOn(db.sqlite, 'prepare').mockImplementation((sql, params) => {
      queries.push(sql);
      return prepare(sql, params);
    });
    return queries;
  }

  async function withCustomer() {
    const app = await openAppData({ today: () => TODAY, seed: fakeSeed });
    app.run((db) => {
      const team = createTeam(db, { name: 'Sao Mai' });
      const re = createPerson(db, { name: 'An', role: 'RE', teamId: team.id });
      const lan = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N4', date: TODAY });
      scheduleAppointment(db, {
        customerId: lan.id,
        reId: re.id,
        date: TODAY,
        triggerType: 'OTHER',
      });
    });
    return app;
  }

  it('reads each table once per revision and shares it with every screen', async () => {
    const app = await withCustomer();
    const first = app.tables();
    const { appointments, customers, people, teams, policies, transitions } = first;
    expect(appointments.map((a) => a.date)).toEqual([TODAY]);
    expect(customers.map((c) => c.name)).toEqual(['Lan']);
    expect(people.map((p) => p.name)).toEqual(['An']);
    expect(teams.map((t) => t.name)).toEqual(['Sao Mai', 'Seed 27/09/2026']);
    expect(policies).toEqual([]);
    expect(transitions.map((t) => t.to)).toEqual(['N4']);

    const queries = watchQueries(app.db());
    const again = app.tables();
    expect(again).toBe(first);
    expect(again.appointments).toBe(appointments);
    expect(again.transitions).toBe(transitions);
    expect(again.people).toBe(people);
    expect(queries).toEqual([]);
  });

  it('reads a table only when a screen asks for it', async () => {
    const app = await withCustomer();
    const queries = watchQueries(app.db());

    expect(app.tables().people.map((p) => p.name)).toEqual(['An']);
    expect(
      queries.some((sql) => /appointments|customers|policies|stage_transitions/.test(sql)),
    ).toBe(false);
  });

  it('reads again after a change, and from the new database after a reload', async () => {
    const app = await withCustomer();
    const before = app.tables();
    expect(before.teams).toHaveLength(2);

    app.run((db) => createTeam(db, { name: 'Bình Minh' }));
    const after = app.tables();
    expect(after).not.toBe(before);
    expect(after.teams.map((t) => t.name)).toEqual(['Bình Minh', 'Sao Mai', 'Seed 27/09/2026']);

    await app.reloadDemoData();
    expect(app.tables().teams.map((t) => t.name)).toEqual(['Seed 27/09/2026']);
    expect(app.tables().customers).toEqual([]);
  });

  it('keeps the tables when a command is rejected: nothing changed', async () => {
    const app = await withCustomer();
    const before = app.tables();

    expect(() => app.run((db) => createTeam(db, { name: 'Sao Mai' }))).toThrow('TEAM_NAME_TAKEN');
    expect(app.tables()).toBe(before);
  });
});

describe('reloadDemoData', () => {
  it('saves pending changes, backs the file up, then swaps in new simulated data anchored today', async () => {
    const { storage, saves, events } = memoryStorage();
    let today = TODAY;
    const app = await openAppData({ storage, today: () => today, seed: fakeSeed });
    const before = app.db();
    const listener = vi.fn();
    app.subscribe(listener);
    await app.saves.idle();
    events.length = 0;
    createTeam(before, { name: 'Sao Mai' });
    today = calendarDate(2026, 10, 1);

    const reloaded = await app.reloadDemoData();
    await app.saves.idle();

    expect(reloaded).toEqual({
      anchor: calendarDate(2026, 10, 1),
      backup: 'project2c-20260927-101500.db',
    });
    expect(events).toEqual(['save', 'backup', 'save']);
    expect(app.db()).not.toBe(before);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(teamNames(app.db())).toEqual(['Seed 01/10/2026']);
    expect(teamNames(await openDatabase({ bytes: saves.at(-1) }))).toEqual(['Seed 01/10/2026']);

    createTeam(app.db(), { name: 'Hừng Đông' });
    await app.saves.idle();
    expect(teamNames(await openDatabase({ bytes: saves.at(-1) }))).toContain('Hừng Đông');
  });

  it('anchors the new data on the day it is seeded, after a backup that ran past midnight (DR-30)', async () => {
    const { storage } = memoryStorage();
    let today = TODAY;
    const backup = storage.backup;
    storage.backup = () => {
      today = calendarDate(2026, 9, 28);
      return backup();
    };
    const app = await openAppData({ storage, today: () => today, seed: fakeSeed });

    const reloaded = await app.reloadDemoData();

    expect(reloaded.anchor).toEqual(calendarDate(2026, 9, 28));
    expect(teamNames(app.db())).toEqual(['Seed 28/09/2026']);
  });

  it('never saves the replaced database again: a late write to it cannot overwrite the file', async () => {
    const { storage, saves } = memoryStorage();
    const app = await openAppData({ storage, today: () => TODAY, seed: fakeSeed });
    const before = app.db();
    // A screen still holding the old database while the others re-render on the new one.
    app.subscribe(() => createTeam(before, { name: 'Stale' }));

    await app.reloadDemoData();
    await app.saves.idle();

    expect(teamNames(await openDatabase({ bytes: saves.at(-1) }))).toEqual(['Seed 27/09/2026']);
  });

  it('closes the replaced database once the screens moved to the new one', async () => {
    const { storage } = memoryStorage();
    const app = await openAppData({ storage, today: () => TODAY, seed: fakeSeed });
    const before = app.db();
    const close = vi.spyOn(before.sqlite, 'close');
    let closedOnChange = true;
    app.subscribe(() => (closedOnChange = close.mock.calls.length > 0));

    await app.reloadDemoData();

    expect(closedOnChange).toBe(false);
    expect(close).toHaveBeenCalledTimes(1);
    createTeam(app.db(), { name: 'Hừng Đông' });
    expect(teamNames(app.db())).toContain('Hừng Đông');
  });

  it('keeps the current database open when the new data cannot be built', async () => {
    let fail = false;
    const app = await openAppData({
      today: () => TODAY,
      seed: (db, anchorDate) => {
        if (fail) throw new Error('seed failed');
        fakeSeed(db, anchorDate);
      },
    });
    const before = app.db();
    const close = vi.spyOn(before.sqlite, 'close');
    fail = true;

    await expect(app.reloadDemoData()).rejects.toThrow('seed failed');

    expect(close).not.toHaveBeenCalled();
    expect(app.db()).toBe(before);
    createTeam(before, { name: 'Sao Mai' });
    expect(teamNames(before)).toContain('Sao Mai');
  });

  it('keeps saving the current database when the new one cannot be opened', async () => {
    const { storage, saves } = memoryStorage();
    let tooNew = false;
    const app = await openAppData({
      storage,
      today: () => TODAY,
      seed: (db, anchorDate) => {
        fakeSeed(db, anchorDate);
        // Built fine but refused by `openDatabase`: made by a newer app.
        if (tooNew)
          db.sqlite.run("INSERT INTO schema_migrations (id, applied_at) VALUES (99, 'x')");
      },
    });
    await app.saves.idle();
    tooNew = true;

    await expect(app.reloadDemoData()).rejects.toMatchObject({ code: 'SCHEMA_TOO_NEW' });
    const before = saves.length;
    app.run((db) => createTeam(db, { name: 'Sao Mai' }));
    await app.saves.flush();

    expect(app.saves.failed()).toBe(false);
    expect(saves).toHaveLength(before + 1);
    expect(teamNames(await openDatabase({ bytes: saves.at(-1) }))).toContain('Sao Mai');
  });

  it('closes the database it seeds the simulated data in', async () => {
    const seeded: Database[] = [];
    const app = await openAppData({
      today: () => TODAY,
      seed: (db, anchorDate) => {
        seeded.push(db);
        fakeSeed(db, anchorDate);
      },
    });
    await app.reloadDemoData();

    expect(seeded).toHaveLength(2);
    for (const db of seeded) {
      expect(db).not.toBe(app.db());
      expect(() => db.sqlite.exec('SELECT 1')).toThrow();
    }
  });

  it("keeps Settings → AI: they are the machine's, not simulated data (DR5-50)", async () => {
    const { storage, saves } = memoryStorage();
    const app = await openAppData({ storage, today: () => TODAY, seed: fakeSeed });
    const chosen = {
      provider: 'OPENCODE_GO',
      opencodePlan: 'CREDIT',
      model: 'kimi-k3',
      reasoning: 'HIGH',
    } as const;
    app.ai.save(chosen);

    await app.reloadDemoData();
    await app.saves.idle();

    expect(app.ai.stored()).toEqual({ settings: chosen, problem: null });
    expect(teamNames(app.db())).toEqual(['Seed 27/09/2026']);
    const saved = await openDatabase({ bytes: saves.at(-1) });
    expect(JSON.parse(getSetting(saved, 'ai')!)).toEqual(chosen);
  });

  it('leaves Settings → AI at the defaults when none were saved', async () => {
    const app = await openAppData({ today: () => TODAY, seed: fakeSeed });

    await app.reloadDemoData();

    expect(getSetting(app.db(), 'ai')).toBeUndefined();
  });

  it('still reloads when the stored Settings → AI are broken, which read as the defaults', async () => {
    const app = await openAppData({ today: () => TODAY, seed: fakeSeed });
    app
      .db()
      .sqlite.run(
        "INSERT INTO settings (key, value_json, updated_at) VALUES ('ai', '{broken', '2026-09-27T00:00:00.000Z')",
      );

    await app.reloadDemoData();

    expect(getSetting(app.db(), 'ai')).toBeUndefined();
    expect(teamNames(app.db())).toEqual(['Seed 27/09/2026']);
  });

  it('in web mode swaps the data without a backup', async () => {
    const app = await openAppData({ today: () => TODAY, seed: fakeSeed });
    createTeam(app.db(), { name: 'Sao Mai' });

    await expect(app.reloadDemoData()).resolves.toEqual({ anchor: TODAY, backup: undefined });
    expect(teamNames(app.db())).toEqual(['Seed 27/09/2026']);
  });

  it('refuses while the last save failed: the backup would miss those changes', async () => {
    const { storage, events, failSave } = memoryStorage();
    const app = await openAppData({ storage, today: () => TODAY, seed: fakeSeed });
    await app.saves.idle();
    failSave();
    events.length = 0;
    createTeam(app.db(), { name: 'Sao Mai' });
    const before = app.db();

    await expect(app.reloadDemoData()).rejects.toSatisfy(isUnsavedChangesError);
    expect(events).toEqual(['save']);
    expect(app.db()).toBe(before);
    expect(teamNames(before)).toContain('Sao Mai');
  });
});

describe('generation', () => {
  it('grows with each replace of the data that succeeds, not with a change or a failed replace', async () => {
    const { storage, failSave } = memoryStorage();
    const app = await openAppData({ storage, today: () => TODAY, seed: fakeSeed });
    const start = app.generation();

    app.run((d) => createTeam(d, { name: 'Sao Mai' }));
    expect(app.generation()).toBe(start);

    await app.reloadDemoData();
    expect(app.generation()).toBe(start + 1);

    await app.importBackup(await app.readBackup((await app.exportBackup()).text));
    expect(app.generation()).toBe(start + 2);

    await app.saves.idle();
    failSave();
    app.run((d) => createTeam(d, { name: 'Hừng Đông' }));
    await expect(app.reloadDemoData()).rejects.toSatisfy(isUnsavedChangesError);
    expect(app.generation()).toBe(start + 2);
  });
});

describe('replacing the data (S-2)', () => {
  /** The teams before Nạp lại, and those of the simulated data it brings on 01/10. */
  const OLD = ['Sao Mai', 'Seed 27/09/2026'];
  const NEW = ['Seed 01/10/2026'];
  const onDisk = async (bytes: Uint8Array | undefined) => teamNames(await openDatabase({ bytes }));
  const writeLate = (app: AppData) =>
    thrownBy(() => app.run((db) => createTeam(db, { name: 'Late' })));

  /** The exe holding a change not yet saved, its day moved on to 01/10. */
  async function exe() {
    const disk = memoryStorage();
    let today = TODAY;
    const app = await openAppData({ storage: disk.storage, today: () => today, seed: fakeSeed });
    app.run((db) => createTeam(db, { name: 'Sao Mai' }));
    today = calendarDate(2026, 10, 1);
    return { app, ...disk };
  }

  /** A read backup holding only the team `name`. */
  async function previewOf(app: AppData, name: string): Promise<BackupPreview> {
    const source = await openAppData({ seed: (db) => createTeam(db, { name }) });
    return app.readBackup((await source.exportBackup()).text);
  }

  it('refuses every write from the call of a replace until it ends, so the backup holds every change before it (S2-2)', async () => {
    const { app, storage, saves } = await exe();
    const backup = holdBackup(storage);
    const listener = vi.fn();
    app.subscribe(listener);

    const reloading = app.reloadDemoData();
    // Refused at once, before the pending change is even saved.
    const refused = writeLate(app);
    expect(refused).toBeInstanceOf(DbError);
    expect(refused).toMatchObject({ code: 'DATA_REPLACING' });
    expect(errorMessage(refused)).toBe(
      'Đang thay toàn bộ dữ liệu (Nạp lại / Nhập backup). Thay đổi này chưa được ghi — thử lại khi xong.',
    );
    await backup.started;
    const backedUp = saves.length;
    expect(await onDisk(saves.at(-1))).toEqual(OLD);
    expect(writeLate(app)).toMatchObject({ code: 'DATA_REPLACING' });
    expect(teamNames(app.db())).toEqual(OLD);
    expect(listener).not.toHaveBeenCalled();

    backup.release();
    await reloading;
    await app.saves.idle();

    // Nothing of the old data was saved after its backup: only the new data.
    expect(saves.length).toBeGreaterThan(backedUp);
    for (const bytes of saves.slice(backedUp)) expect(await onDisk(bytes)).toEqual(NEW);
    app.run((db) => createTeam(db, { name: 'Hừng Đông' }));
    await app.saves.idle();
    expect(await onDisk(saves.at(-1))).toEqual(['Hừng Đông', ...NEW]);
  });

  /** How a replace is made to fail, then the replace itself (S2-4). */
  type FailedReplace = [
    string,
    (setup: Awaited<ReturnType<typeof exe>>) => void | Promise<void>,
    (app: AppData) => Promise<unknown>,
  ];

  it.each<FailedReplace>([
    [
      'the backup fails',
      ({ storage }) => {
        storage.backup = () => Promise.reject(new Error('disk full'));
      },
      (app: AppData) => app.reloadDemoData(),
    ],
    [
      'the new data cannot be opened',
      () => undefined,
      async (app) => {
        const preview = await previewOf(app, 'Bình Minh');
        return app.importBackup({ ...preview, bytes: new TextEncoder().encode('not a database') });
      },
    ],
    ...(['reloadDemoData', 'importBackup'] as const).map((replace): FailedReplace => [
      `a save before failed, refusing ${replace}`,
      // A change whose save fails: the replace refuses at once (RELOAD_UNSAVED_CHANGES).
      async ({ app, failSave }) => {
        failSave();
        app.run((db) => createTeam(db, { name: 'Lỡ' }));
        await app.saves.idle();
        expect(app.saves.failed()).toBe(true);
      },
      async (app) =>
        replace === 'reloadDemoData'
          ? app.reloadDemoData()
          : app.importBackup(await previewOf(app, 'Bình Minh')),
    ]),
  ])(
    'when %s, writes again and keeps saving the current data, its generation unchanged (S2-4)',
    async (_, breakIt, replaceWith) => {
      const setup = await exe();
      const { app, saves } = setup;
      await app.saves.idle();
      await breakIt(setup);
      const generation = app.generation();
      const kept = teamNames(app.db());

      await expect(replaceWith(app)).rejects.toThrow();
      expect(app.replacing()).toBe(false);
      const before = saves.length;
      app.run((db) => createTeam(db, { name: 'Hừng Đông' }));
      await app.saves.idle();

      expect(saves).toHaveLength(before + 1);
      expect(await onDisk(saves.at(-1))).toEqual(['Hừng Đông', ...kept].sort(byName));
      expect(app.generation()).toBe(generation);
    },
  );

  it('runs two replaces called together one after the other, each backed up, none failing (S2-1)', async () => {
    const { app, storage } = await exe();
    const preview = await previewOf(app, 'Bình Minh');
    const seenByBackup: string[][] = [];
    const backup = storage.backup;
    storage.backup = () => {
      seenByBackup.push(teamNames(app.db()));
      return backup();
    };
    const closeFirst = vi.spyOn(app.db().sqlite, 'close');
    let closeSecond: ReturnType<typeof vi.spyOn> | undefined;
    app.subscribe(() => (closeSecond ??= vi.spyOn(app.db().sqlite, 'close')));

    const done = await Promise.all([app.reloadDemoData(), app.importBackup(preview)]);

    expect(done).toEqual([
      { anchor: calendarDate(2026, 10, 1), backup: 'project2c-20260927-101500.db' },
      'project2c-20260927-101500.db',
    ]);
    // The import began once the reload was done: it backed up the reloaded data.
    expect(seenByBackup).toEqual([OLD, NEW]);
    expect(teamNames(app.db())).toEqual(['Bình Minh']);
    expect(closeFirst).toHaveBeenCalledTimes(1);
    expect(closeSecond).toHaveBeenCalledTimes(1);
  });

  it('saves the migration of the new data while it opens, and nothing of the data it replaces (review of PR 206)', async () => {
    const { app, storage, saves } = await exe();
    // A file from before the first migration, with data: opening it migrates, and that saves.
    const old = await openDatabase({ migrations: [] });
    old.sqlite.exec("CREATE TABLE notes (text TEXT); INSERT INTO notes VALUES ('kept')");
    const older = old.export();
    const backup = holdBackup(storage);

    const importing = app.importBackup({ ...(await previewOf(app, 'x')), bytes: older });
    await backup.started;
    const backedUp = saves.length;
    backup.release();
    await importing;
    await app.saves.idle();

    const after = saves.slice(backedUp);
    expect(after[0]).not.toEqual(older);
    for (const bytes of after) expect(await onDisk(bytes)).toEqual([]);
    // The file left on disk is the migrated one, not the bytes it opened (DR6-08).
    expect(await storedVersion(saves.at(-1)!)).toBe(LATEST_SCHEMA_VERSION);
    const last = await openDatabase({ bytes: saves.at(-1) });
    expect(last.sqlite.exec('SELECT text FROM notes')[0]?.values).toEqual([['kept']]);
  });

  it('exports a whole file of the old or the new data at any step of a replace (S2-5)', async () => {
    const { app, storage } = await exe();
    const backup = holdBackup(storage);
    const exported: Promise<ExportedBackup>[] = [];
    // Right after the swap, while the old database is still open.
    app.subscribe(() => exported.push(app.exportBackup()));

    const reloading = app.reloadDemoData();
    exported.push(app.exportBackup());
    await backup.started;
    exported.push(app.exportBackup());
    backup.release();
    await reloading;

    const files = await Promise.all(exported);
    const read = await Promise.all(files.map((file) => app.readBackup(file.text)));
    expect(read.map((preview) => preview.counts.teams)).toEqual([OLD.length, OLD.length, 1]);
  });

  it('closing the app at any step of a replace leaves a whole file of the old or the new data (S2-6)', async () => {
    const { app, storage, saves } = await exe();
    const backup = holdBackup(storage);
    const lastFile = async () => {
      await app.saves.flush();
      return onDisk(saves.at(-1));
    };
    const files: Promise<string[]>[] = [];
    app.subscribe(() => files.push(lastFile()));

    const reloading = app.reloadDemoData();
    files.push(lastFile());
    await backup.started;
    files.push(lastFile());
    backup.release();
    await reloading;
    files.push(lastFile());

    expect(await Promise.all(files)).toEqual([OLD, OLD, NEW, NEW]);
  });
});

describe('the data file card', () => {
  it('records the time and size of the last successful save, and tells subscribers', async () => {
    const { storage, saves, failSave } = memoryStorage();
    let now = new Date(2026, 8, 30, 7, 42, 13);
    const app = await openAppData({
      storage,
      clock: () => now,
      today: () => TODAY,
      seed: fakeSeed,
    });
    await app.saves.idle();
    const first = app.lastSave();
    expect(first).toEqual({ at: now, size: saves[0]!.byteLength });

    const listener = vi.fn();
    app.subscribeLastSave(listener);
    failSave();
    now = new Date(2026, 8, 30, 8, 0, 0);
    createTeam(app.db(), { name: 'Sao Mai' });
    await app.saves.idle();
    expect(app.saves.failed()).toBe(true);
    expect(app.lastSave()).toBe(first);
    expect(listener).not.toHaveBeenCalled();

    await app.saves.flush();
    expect(app.lastSave()).toEqual({ at: now, size: saves[1]!.byteLength });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('keeps why the last save failed until a save succeeds, and tells subscribers (DR6-07)', async () => {
    const { storage, saves } = memoryStorage();
    const app = await openAppData({ storage, today: () => TODAY, seed: fakeSeed });
    await app.saves.idle();
    expect(app.saveError()).toBeUndefined();
    const listener = vi.fn();
    app.subscribeSaveError(listener);
    const save = storage.save;
    // What Rust answers a save that found the disk full.
    storage.save = () => Promise.reject('DISK_FULL');

    createTeam(app.db(), { name: 'Sao Mai' });
    await app.saves.idle();
    expect(app.saves.failed()).toBe(true);
    expect(app.saveError()).toBe('DISK_FULL');
    expect(listener).toHaveBeenCalledTimes(1);

    // Failing again for another reason while still unsaved: the warning must follow.
    storage.save = () => Promise.reject('Access is denied. (os error 5)');
    await app.saves.flush().catch(() => undefined);
    expect(app.saveError()).toBe('Access is denied. (os error 5)');
    expect(listener).toHaveBeenCalledTimes(2);

    storage.save = save;
    await app.saves.flush();
    expect(app.saves.failed()).toBe(false);
    expect(app.saveError()).toBeUndefined();
    expect(listener).toHaveBeenCalledTimes(3);
    expect(saves).toHaveLength(2);
  });

  it('has no last save in web mode', async () => {
    const app = await openAppData({ today: () => TODAY, seed: fakeSeed });
    createTeam(app.db(), { name: 'Sao Mai' });
    await app.saves.idle();

    expect(app.lastSave()).toBeUndefined();
  });

  it('asks the storage for the newest backup and to open a folder; web mode has neither', async () => {
    const { storage, events } = memoryStorage();
    const app = await openAppData({ storage, today: () => TODAY, seed: fakeSeed });

    expect(await app.latestBackup()).toBe('project2c-s00000001-20260927-101500.db');
    await app.openFolder('exports');
    expect(events).toContain('open exports');

    const web = await openAppData({ today: () => TODAY, seed: fakeSeed });
    expect(await web.latestBackup()).toBeUndefined();
  });
});

describe('isUnsavedChangesError', () => {
  it('tells the refusal of a replace apart from any other failure', () => {
    expect(isUnsavedChangesError(new Error('boom'))).toBe(false);
    expect(isUnsavedChangesError('RELOAD_UNSAVED_CHANGES')).toBe(false);
    expect(isUnsavedChangesError(undefined)).toBe(false);
  });
});

describe('backup files', () => {
  /** 30/09/2026 07:45 local time. */
  const clock = () => new Date(2026, 8, 30, 7, 45, 12);

  /** A backup of a database holding the teams `names`, one soft-deleted when `deleted` is set. */
  async function backupOf(names: string[], deleted?: string) {
    const app = await openAppData({
      clock,
      seed: (db) => names.forEach((name) => createTeam(db, { name })),
    });
    if (deleted) {
      const team = listTeams(app.db()).find((t) => t.name === deleted)!;
      app.run((db) => softDeleteTeam(db, team.id));
    }
    return (await app.exportBackup()).text;
  }

  it('in web mode exports a named file for the screen to download', async () => {
    const app = await openAppData({ clock, today: () => TODAY, seed: fakeSeed });

    const exported = await app.exportBackup();

    expect(exported.name).toBe('project2c-20260930-0745.p2cbackup');
    expect(exported.path).toBeUndefined();
    const imported = await importBackup(exported.text);
    expect(teamNames(imported.db)).toEqual(['Seed 27/09/2026']);
  });

  it('in the exe writes the file into exports and returns its path', async () => {
    const { storage, exports } = memoryStorage();
    const app = await openAppData({ storage, clock, today: () => TODAY, seed: fakeSeed });

    const exported = await app.exportBackup();

    expect(exported.path).toBe(
      'C:\\P2C\\Project2C-data\\exports\\project2c-20260930-0745.p2cbackup',
    );
    expect(exports).toEqual([{ name: exported.name, text: exported.text }]);
    expect(exported.size).toBe(new TextEncoder().encode(exported.text).byteLength);
  });

  it('writes a report into exports in the exe; web mode leaves it to the screen', async () => {
    const { storage, exports } = memoryStorage();
    const exe = await openAppData({ storage, clock, today: () => TODAY, seed: fakeSeed });
    const web = await openAppData({ clock, today: () => TODAY, seed: fakeSeed });
    const bytes = new TextEncoder().encode('xlsx');

    expect(await exe.exportFile('bao-cao.xlsx', bytes)).toBe(
      'C:\\P2C\\Project2C-data\\exports\\bao-cao.xlsx',
    );
    expect(exports).toEqual([{ name: 'bao-cao.xlsx', text: 'xlsx' }]);
    expect(await web.exportFile('bao-cao.xlsx', bytes)).toBeUndefined();
  });

  it('gives the size in bytes of the file, not its length in characters', async () => {
    const app = await openAppData({ clock, seed: (db) => createTeam(db, { name: 'Hừng Đông' }) });

    const exported = await app.exportBackup();

    expect(exported.size).toBeGreaterThan(exported.text.length);
  });

  it('reads a backup without touching the current data, and counts both', async () => {
    const text = await backupOf(['Sao Mai', 'Bình Minh', 'Hừng Đông'], 'Hừng Đông');
    const { storage, events } = memoryStorage();
    const app = await openAppData({ storage, today: () => TODAY, seed: fakeSeed });
    await app.saves.idle();
    events.length = 0;
    const before = app.db();

    const preview = await app.readBackup(text);

    expect(preview.schemaVersion).toBe(LATEST_SCHEMA_VERSION);
    expect(preview.counts).toEqual({
      teams: 2,
      people: 0,
      customers: 0,
      appointments: 0,
      policies: 0,
    });
    expect(app.counts()).toMatchObject({ teams: 1 });
    expect(app.db()).toBe(before);
    expect(events).toEqual([]);
  });

  it('rejects a damaged file with its code, changing nothing', async () => {
    const app = await openAppData({ today: () => TODAY, seed: fakeSeed });
    const listener = vi.fn();
    app.subscribe(listener);

    const error = await app.readBackup('{"format":"project2-backup"}').catch((e: unknown) => e);

    expect(error).toMatchObject({ code: 'BACKUP_INVALID' });
    expect(listener).not.toHaveBeenCalled();
    expect(teamNames(app.db())).toEqual(['Seed 27/09/2026']);
  });

  it("checks a backup's dates against the app's pinned day, as the commands do (DR-86)", async () => {
    // Created on 30/09, after the pinned day but before the machine's.
    const source = await openAppData({
      today: () => calendarDate(2026, 9, 30),
      seed: (db, anchorDate) => {
        const team = createTeam(db, { name: 'Sao Mai' });
        const re = createPerson(db, { name: 'An', role: 'RE', teamId: team.id });
        createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N3', date: anchorDate });
      },
    });
    const text = (await source.exportBackup()).text;
    const app = await openAppData({
      today: () => TODAY,
      clock: () => new Date(2026, 9, 6, 9, 0),
      seed: fakeSeed,
    });

    const error = await app.readBackup(text).catch((e: unknown) => e);

    expect(error).toMatchObject({ code: 'BACKUP_INVALID', params: { rule: 10 } });
  });

  it.each([
    ['a date that does not exist', '"date":"2026-09-27"', '"date":"2026-02-30"'],
    ['a stage its transitions never reached', '"stage":"N3"', '"stage":"N1"'],
    ['a customer whose RE is a TL', '"role":"RE"', '"role":"TL"'],
    ['a gender other than its KYC fact', '"gender":"FEMALE"', '"gender":"MALE"'],
  ])('rejects a file with %s before counting its records', async (_, from, to) => {
    const source = await openAppData({
      seed: (db) => {
        const team = createTeam(db, { name: 'Sao Mai' });
        const re = createPerson(db, { name: 'An', role: 'RE', teamId: team.id });
        const lan = createCustomer(db, {
          name: 'Lan',
          reId: re.id,
          stage: 'N3',
          date: TODAY,
          gender: 'FEMALE',
        });
        scheduleAppointment(db, {
          customerId: lan.id,
          reId: re.id,
          date: TODAY,
          triggerType: 'REFERRAL',
        });
      },
    });
    const text = (await source.exportBackup()).text.replace(from, to);
    expect(text).toContain(to);
    const { storage, events } = memoryStorage();
    const app = await openAppData({ storage, today: () => TODAY, seed: fakeSeed });
    await app.saves.idle();
    events.length = 0;
    const listener = vi.fn();
    app.subscribe(listener);

    const error = await app.readBackup(text).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(DbError);
    expect(error).toMatchObject({ code: 'BACKUP_INVALID' });
    expect(listener).not.toHaveBeenCalled();
    expect(events).toEqual([]);
    expect(teamNames(app.db())).toEqual(['Seed 27/09/2026']);
  });

  it('imports like a reload: saves pending changes, backs up, swaps and saves the new data', async () => {
    const text = await backupOf(['Sao Mai', 'Bình Minh'], 'Bình Minh');
    const { storage, saves, events } = memoryStorage();
    const app = await openAppData({ storage, today: () => TODAY, seed: fakeSeed });
    const before = app.db();
    const listener = vi.fn();
    app.subscribe(listener);
    const preview = await app.readBackup(text);
    await app.saves.idle();
    events.length = 0;
    createTeam(before, { name: 'Late' });

    const backup = await app.importBackup(preview);
    await app.saves.idle();

    expect(backup).toBe('project2c-20260927-101500.db');
    expect(events).toEqual(['save', 'backup', 'save']);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(teamNames(app.db())).toEqual(['Sao Mai']);
    const onDisk = await openDatabase({ bytes: saves.at(-1) });
    expect(teamNames(onDisk)).toEqual(['Sao Mai']);
    // The soft-deleted team came along, as in the file.
    expect((await app.exportBackup()).text).toContain('"Bình Minh"');
  });

  it('closes the replaced database after an import, and keeps it when the import fails', async () => {
    const text = await backupOf(['Sao Mai']);
    const app = await openAppData({ today: () => TODAY, seed: fakeSeed });
    const before = app.db();
    const close = vi.spyOn(before.sqlite, 'close');
    const preview = await app.readBackup(text);

    const damaged = { ...preview, bytes: new TextEncoder().encode('not a database') };
    await expect(app.importBackup(damaged)).rejects.toThrow();
    expect(close).not.toHaveBeenCalled();
    expect(app.db()).toBe(before);
    expect(teamNames(before)).toEqual(['Seed 27/09/2026']);

    await app.importBackup(preview);
    expect(close).toHaveBeenCalledTimes(1);
    expect(teamNames(app.db())).toEqual(['Sao Mai']);
  });

  it('keeps saving the current database after an import that cannot be opened', async () => {
    const text = await backupOf(['Sao Mai']);
    const { storage, saves } = memoryStorage();
    const app = await openAppData({ storage, today: () => TODAY, seed: fakeSeed });
    const preview = await app.readBackup(text);
    await app.saves.idle();
    const damaged = { ...preview, bytes: new TextEncoder().encode('not a database') };

    await expect(app.importBackup(damaged)).rejects.toThrow();
    const before = saves.length;
    app.run((db) => createTeam(db, { name: 'Hừng Đông' }));
    await app.saves.flush();

    expect(app.saves.failed()).toBe(false);
    expect(saves).toHaveLength(before + 1);
    expect(teamNames(await openDatabase({ bytes: saves.at(-1) }))).toEqual([
      'Hừng Đông',
      'Seed 27/09/2026',
    ]);
  });

  it('refuses to import while the last save failed', async () => {
    const text = await backupOf(['Sao Mai']);
    const { storage, events, failSave } = memoryStorage();
    const app = await openAppData({ storage, today: () => TODAY, seed: fakeSeed });
    await app.saves.idle();
    const preview = await app.readBackup(text);
    failSave();
    events.length = 0;
    createTeam(app.db(), { name: 'Hừng Đông' });
    const before = app.db();

    await expect(app.importBackup(preview)).rejects.toSatisfy(isUnsavedChangesError);
    expect(events).toEqual(['save']);
    expect(app.db()).toBe(before);
    expect(teamNames(before)).toContain('Hừng Đông');
  });
});
