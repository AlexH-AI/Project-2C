import { createTeam, listTeams, openDatabase } from '@p2c/db';
import { describe, expect, it } from 'vitest';
import { openAppData, type StoragePort } from './app-data';

/** In-memory stand-in for the exe's database file. */
function memoryStorage(initial?: Uint8Array) {
  const saves: Uint8Array[] = [];
  const storage: StoragePort = {
    load: () => Promise.resolve(initial),
    save: (bytes) => {
      saves.push(bytes);
      return Promise.resolve();
    },
  };
  return { storage, saves };
}

describe('openAppData', () => {
  it('without storage (web mode) opens a migrated in-memory database', async () => {
    const { db, saves } = await openAppData();

    expect(db.schemaVersion()).toBeGreaterThan(0);
    createTeam(db, { name: 'Sao Mai' });
    await saves.idle();
    expect(saves.failed()).toBe(false);
  });

  it('with no file yet creates the database and saves it', async () => {
    const { storage, saves } = memoryStorage();

    const app = await openAppData({ storage });
    await app.saves.idle();

    expect(saves).toHaveLength(1);
    const reopened = await openDatabase({ bytes: saves[0] });
    expect(reopened.schemaVersion()).toBe(app.db.schemaVersion());
  });

  it('opens the stored file and saves every later transaction', async () => {
    const original = await openDatabase();
    createTeam(original, { name: 'Sao Mai' });
    const { storage, saves } = memoryStorage(original.export());

    const app = await openAppData({ storage });
    expect(listTeams(app.db).map((team) => team.name)).toEqual(['Sao Mai']);

    createTeam(app.db, { name: 'Bình Minh' });
    await app.saves.idle();
    const onDisk = await openDatabase({ bytes: saves.at(-1) });
    expect(listTeams(onDisk).map((team) => team.name)).toEqual(['Bình Minh', 'Sao Mai']);
  });
});
