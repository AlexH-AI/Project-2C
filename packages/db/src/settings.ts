/**
 * The `settings` table: one JSON value per key, e.g. `ai` for Settings → AI (spec Phase 5 §4.1).
 * It goes into the backup with the data, so nothing secret belongs here (the AI key never does).
 * The value is read back as stored: the caller checks it, as a backup may bring any JSON.
 */
import { CURRENCY_CODES, type CurrencyCode } from '@p2c/domain';
import { eq } from 'drizzle-orm';
import type { Database } from './database';
import { settings } from './schema';

/** The stored JSON of `key`, `undefined` when it was never written. */
export function getSetting(db: Database, key: string): string | undefined {
  return db.orm
    .select({ valueJson: settings.valueJson })
    .from(settings)
    .where(eq(settings.key, key))
    .get()?.valueJson;
}

/** Writes `value` as the JSON of `key`, replacing what was there. */
export function putSetting(db: Database, key: string, value: unknown): void {
  const row = { valueJson: JSON.stringify(value), updatedAt: db.now().toISOString() };
  db.transaction(() =>
    db.orm
      .insert(settings)
      .values({ key, ...row })
      .onConflictDoUpdate({ target: settings.key, set: row })
      .run(),
  );
}

/** The `settings` key of the currency of the data (ADR-0018 §2): it goes into the backup with it. */
const CURRENCY = 'currency';

/**
 * The currency of the data, one of `CURRENCY_CODES` as `setCurrency` writes it. Every database has
 * it: migration 0016 writes VND where it was missing, and an import checks the file's. Throws when
 * the key is missing or not as the app writes it, which the import reads as a damaged file.
 */
export function getCurrency(db: Database): CurrencyCode {
  const json = getSetting(db, CURRENCY);
  const currency = CURRENCY_CODES.find((code) => JSON.stringify(code) === json);
  if (currency === undefined) throw new Error(`Not a currency of the data: ${String(json)}`);
  return currency;
}

/** Writes the currency of the data: the seed, and set-up (G-08) before there is any data. */
export function setCurrency(db: Database, currency: CurrencyCode): void {
  putSetting(db, CURRENCY, currency);
}
