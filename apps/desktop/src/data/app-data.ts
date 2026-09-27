/**
 * Opens the app database at startup (ADR-0016, spec §5). The exe passes a storage port backed by
 * the Rust file commands; web mode passes none and keeps the database in memory. A new database
 * (first start of the exe, every start of web mode) gets the simulated data (spec §7).
 */
import { openDatabase, seedDemoData, type Database } from '@p2c/db';
import { fromLocalDate, type CalendarDate } from '@p2c/domain';
import { createPersistQueue, type PersistQueue } from './persist-queue';

/** Where the database file lives. */
export interface StoragePort {
  /** The saved file, or `undefined` on first start. */
  load(): Promise<Uint8Array | undefined>;
  save(bytes: Uint8Array): Promise<void>;
  /** Copies the saved file into `backups\`; returns the backup's file name. */
  backup(): Promise<string>;
}

export interface AppData {
  /** The open database; `reloadDemoData` replaces it, see `subscribe`. */
  db(): Database;
  /** Called whenever `db()` changes; returns the unsubscribe function. */
  subscribe(listener: () => void): () => void;
  /** True in the exe (saved to a file, backed up); false in web mode (in memory only). */
  readonly hasFile: boolean;
  /** Save status for the UI warning; never fails in web mode. */
  readonly saves: PersistQueue;
  /** The anchor day of new simulated data. */
  today(): CalendarDate;
  /**
   * Settings → Data: replaces everything with new simulated data anchored today. The exe first
   * saves pending changes and backs the file up; resolves to the backup's file name (`undefined`
   * in web mode). Rejects with `RELOAD_UNSAVED_CHANGES` while the last save failed.
   */
  reloadDemoData(): Promise<string | undefined>;
}

export interface OpenAppDataOptions {
  readonly storage?: StoragePort;
  /** Where sql.js finds its wasm file in the browser. */
  readonly locateFile?: (file: string) => string;
  /** Defaults to the local calendar day; e2e pins it. */
  readonly today?: () => CalendarDate;
  /** Writes the simulated data into a new database; tests pass a small stand-in. */
  readonly seed?: (db: Database, anchorDate: CalendarDate) => void;
}

/** The same seed on every machine: the same day gives the same data (spec §7). */
const DEMO_SEED = 1;

const seedDemo = (db: Database, anchorDate: CalendarDate) =>
  seedDemoData(db, { anchorDate, seed: DEMO_SEED });

export async function openAppData(options: OpenAppDataOptions = {}): Promise<AppData> {
  const { storage, locateFile, today = () => fromLocalDate(new Date()), seed = seedDemo } = options;
  const saves = createPersistQueue((bytes) => storage?.save(bytes) ?? Promise.resolve());
  const open = (bytes: Uint8Array) =>
    openDatabase({
      bytes,
      // Web mode skips exporting the file after every transaction: nothing would keep it.
      persist: storage ? saves.persist : undefined,
      locateFile,
    });

  // Seeded apart and saved as one file: the saved file never holds a half-built database.
  const demoData = async (): Promise<Uint8Array> => {
    const db = await openDatabase({ locateFile });
    const start = performance.now();
    seed(db, today());
    // Read by the e2e check of #64 (under 5 s in the browser).
    performance.measure('p2c:demo-seed', { start });
    return db.export();
  };

  const openNew = async (): Promise<Database> => {
    const bytes = await demoData();
    const db = await open(bytes);
    if (storage) saves.persist(bytes);
    return db;
  };

  const stored = await storage?.load();
  let db = stored ? await open(stored) : await openNew();
  const listeners = new Set<() => void>();

  return {
    db: () => db,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    hasFile: storage !== undefined,
    saves,
    today,
    async reloadDemoData() {
      await saves.idle();
      if (saves.failed()) throw new Error('RELOAD_UNSAVED_CHANGES');
      const backup = await storage?.backup();
      db = await openNew();
      for (const listener of listeners) listener();
      return backup;
    },
  };
}
