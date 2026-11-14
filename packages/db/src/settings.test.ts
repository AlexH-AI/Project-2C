import { calendarDate } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { exportBackup, importBackup } from './backup';
import { openDatabase } from './database';
import { MIGRATIONS } from './migrations';
import { seedDemoData } from './seed';
import { getCurrency, getSetting, putSetting, setCurrency } from './settings';
import { setup } from './test-support';

describe('settings (spec Phase 5 §4.1)', () => {
  it('reads nothing for a key never written', async () => {
    const { db } = await setup();
    expect(getSetting(db, 'ai')).toBeUndefined();
  });

  it('writes a value as JSON, replaces it on the next write and saves each time', async () => {
    const { db, persist } = await setup();
    const updatedAt = () =>
      db.sqlite.exec("SELECT updated_at FROM settings WHERE key = 'ai'")[0]?.values;
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

// ADR-0018 §2, §7: the currency is data, a key of `settings` that goes into the backup.
describe('the currency of the data', () => {
  it('is VND in a database saved before the key, once opened (migration 0016)', async () => {
    const before = await openDatabase({ migrations: MIGRATIONS.filter((m) => m.id < 17) });
    putSetting(before, 'ai', { provider: 'MOCK' });
    expect(getSetting(before, 'currency')).toBeUndefined();

    const db = await openDatabase({ bytes: before.export() });

    expect(getCurrency(db)).toBe('VND');
    expect(getSetting(db, 'ai')).toBe('{"provider":"MOCK"}');
  });

  // The seed's own clock, so a day's sample data is the same file on every machine (spec §7).
  it(
    'is VND in a new database, and the seed writes it on its anchor day',
    { timeout: 60_000 },
    async () => {
      const db = await openDatabase();
      expect(getCurrency(db)).toBe('VND');

      seedDemoData(db, { anchorDate: calendarDate(2026, 9, 15), seed: 1 });

      expect(getSetting(db, 'currency')).toBe('"VND"');
      const [[updatedAt]] = db.sqlite.exec(
        "SELECT updated_at FROM settings WHERE key = 'currency'",
      )[0]!.values as [[string]];
      expect(updatedAt.slice(0, 10)).toBe('2026-09-15');
    },
  );

  it('is written once and kept by the migration, which never writes over it', async () => {
    const before = await openDatabase({ migrations: MIGRATIONS.filter((m) => m.id < 17) });
    setCurrency(before, 'USD');

    const db = await openDatabase({ bytes: before.export() });

    expect(getCurrency(db)).toBe('USD');
    setCurrency(db, 'EUR');
    expect(getSetting(db, 'currency')).toBe('"EUR"');
  });

  it('refuses a key that is not one of the seven currencies, as the app writes it', async () => {
    const { db } = await setup();
    for (const value of ['JPY', 'vnd', ' VND', 1]) {
      putSetting(db, 'currency', value);
      expect(() => getCurrency(db)).toThrow();
    }
    db.sqlite.run("UPDATE settings SET value_json = ' \"VND\"' WHERE key = 'currency'");
    expect(() => getCurrency(db)).toThrow();
    db.sqlite.run("DELETE FROM settings WHERE key = 'currency'");
    expect(() => getCurrency(db)).toThrow();
  });
});
