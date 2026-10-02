import {
  createCustomer,
  createPerson,
  createTeam,
  DbError,
  importBackup,
  LATEST_SCHEMA_VERSION,
  listTeams,
  openDatabase,
  scheduleAppointment,
  softDeleteTeam,
  type Database,
} from '@p2c/db';
import { calendarDate, formatDate, fromLocalDate, type CalendarDate } from '@p2c/domain';
import { describe, expect, it, vi } from 'vitest';
import { isUnsavedChangesError, openAppData, type StoragePort } from './app-data';

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

const teamNames = (db: Database) => listTeams(db).map((team) => team.name);

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

  it("dates the database's writes and checks on the app's day, also after new data", async () => {
    let today = TODAY;
    const app = await openAppData({ today: () => today, seed: fakeSeed });
    expect(fromLocalDate(app.db().now())).toEqual(TODAY);

    today = calendarDate(2026, 10, 1);
    await app.reloadDemoData();
    expect(fromLocalDate(app.db().now())).toEqual(today);
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

    const backup = await app.reloadDemoData();
    await app.saves.idle();

    expect(backup).toBe('project2c-20260927-101500.db');
    expect(events).toEqual(['save', 'backup', 'save']);
    expect(app.db()).not.toBe(before);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(teamNames(app.db())).toEqual(['Seed 01/10/2026']);
    expect(teamNames(await openDatabase({ bytes: saves.at(-1) }))).toEqual(['Seed 01/10/2026']);

    createTeam(app.db(), { name: 'Hừng Đông' });
    await app.saves.idle();
    expect(teamNames(await openDatabase({ bytes: saves.at(-1) }))).toContain('Hừng Đông');
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

  it('in web mode swaps the data without a backup', async () => {
    const app = await openAppData({ today: () => TODAY, seed: fakeSeed });
    createTeam(app.db(), { name: 'Sao Mai' });

    await expect(app.reloadDemoData()).resolves.toBeUndefined();
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
