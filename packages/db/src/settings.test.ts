import { describe, expect, it } from 'vitest';
import { exportBackup, importBackup } from './backup';
import { getSetting, putSetting } from './settings';
import { setup } from './test-support';

describe('settings (spec Phase 5 §4.1)', () => {
  it('reads nothing for a key never written', async () => {
    const { db } = await setup();
    expect(getSetting(db, 'ai')).toBeUndefined();
  });

  it('writes a value as JSON, replaces it on the next write and saves each time', async () => {
    const { db, persist } = await setup();
    const updatedAt = () => db.sqlite.exec('SELECT updated_at FROM settings')[0]?.values;
    putSetting(db, 'ai', { provider: 'MOCK' });
    expect(getSetting(db, 'ai')).toBe('{"provider":"MOCK"}');
    const first = updatedAt();

    putSetting(db, 'ai', { provider: 'OPENCODE_GO' });
    expect(getSetting(db, 'ai')).toBe('{"provider":"OPENCODE_GO"}');
    expect(updatedAt()).toHaveLength(1);
    expect(updatedAt()).not.toEqual(first);
    expect(persist).toHaveBeenCalledTimes(2);
  });

  it('keeps each key apart', async () => {
    const { db } = await setup();
    putSetting(db, 'ai', 1);
    putSetting(db, 'other', 2);
    expect([getSetting(db, 'ai'), getSetting(db, 'other')]).toEqual(['1', '2']);
  });

  it('goes into the backup with the data', async () => {
    const { db } = await setup();
    putSetting(db, 'ai', { provider: 'OPENCODE_GO' });
    const imported = await importBackup(exportBackup(db));
    expect(getSetting(imported.db, 'ai')).toBe('{"provider":"OPENCODE_GO"}');
  });
});
