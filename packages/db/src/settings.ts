/**
 * The `settings` table: one JSON value per key, e.g. `ai` for Settings → AI (spec Phase 5 §4.1).
 * It goes into the backup with the data, so nothing secret belongs here (the AI key never does).
 * The value is read back as stored: the caller checks it, as a backup may bring any JSON.
 */
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
