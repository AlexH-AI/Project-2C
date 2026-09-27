import { createTeam, listTeams, openDatabase, type Database } from '@p2c/db';
import { calendarDate, formatDate, type CalendarDate } from '@p2c/domain';
import { describe, expect, it, vi } from 'vitest';
import { openAppData, type StoragePort } from './app-data';

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
  };
  return { storage, saves, events, failSave: () => (failNextSave = true) };
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
    createTeam(before, { name: 'Sao Mai' });
    today = calendarDate(2026, 10, 1);
    events.length = 0;

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

    await app.reloadDemoData();
    await app.saves.idle();
    const count = saves.length;
    createTeam(before, { name: 'Stale' });
    await app.saves.idle();

    expect(saves).toHaveLength(count);
    expect(teamNames(await openDatabase({ bytes: saves.at(-1) }))).toEqual(['Seed 27/09/2026']);
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

    await expect(app.reloadDemoData()).rejects.toThrow('RELOAD_UNSAVED_CHANGES');
    expect(events).toEqual(['save']);
    expect(app.db()).toBe(before);
    expect(teamNames(before)).toContain('Sao Mai');
  });
});
