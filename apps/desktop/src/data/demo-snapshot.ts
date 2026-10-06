/**
 * The simulated data of one anchor day as a ready database file (DR-79): the e2e build opens it
 * instead of seeding on every page load. `e2e/serve.mjs` writes it next to the web build; the app
 * fetches it by its day's name, so a file seeded for another day is never opened.
 */
import { openDatabase, type Database } from '@p2c/db';
import { formatIsoDate, type CalendarDate } from '@p2c/domain';
import { seedDemo } from './app-data';

export const demoSnapshotName = (day: CalendarDate): string => `demo-${formatIsoDate(day)}.sqlite`;

/** Every SQLite file starts with these bytes. */
const SQLITE_HEADER = new TextEncoder().encode('SQLite format 3\0');

const isSqlite = (bytes: Uint8Array) => SQLITE_HEADER.every((byte, i) => bytes[i] === byte);

/** The day's file next to the page; `undefined` when there is none, and the app seeds instead. */
export async function fetchDemoSnapshot(
  day: CalendarDate,
  fetchFile: (url: string) => Promise<Response> = (url) => fetch(url),
): Promise<Uint8Array | undefined> {
  try {
    const response = await fetchFile(demoSnapshotName(day));
    if (!response.ok) return undefined;
    const bytes = new Uint8Array(await response.arrayBuffer());
    // A server with a page fallback answers a missing file with the page itself.
    return isSqlite(bytes) ? bytes : undefined;
  } catch {
    return undefined;
  }
}

/** The database file a new web-mode database of `day` starts from: the same seed as the app's. */
export async function buildDemoSnapshot(
  day: CalendarDate,
  seed: (db: Database, anchorDate: CalendarDate) => void = seedDemo,
): Promise<Uint8Array> {
  const db = await openDatabase();
  try {
    seed(db, day);
    return db.export();
  } finally {
    db.sqlite.close();
  }
}
