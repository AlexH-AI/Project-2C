/**
 * Opens the app database at startup (ADR-0016, spec §5). The exe passes a storage port backed by
 * the Rust file commands; web mode passes none and keeps the database in memory.
 */
import { openDatabase, type Database } from '@p2c/db';
import { createPersistQueue, type PersistQueue } from './persist-queue';

/** Where the database file lives. */
export interface StoragePort {
  /** The saved file, or `undefined` on first start. */
  load(): Promise<Uint8Array | undefined>;
  save(bytes: Uint8Array): Promise<void>;
}

export interface AppData {
  readonly db: Database;
  /** Save status for the UI warning; never fails in web mode. */
  readonly saves: PersistQueue;
}

export interface OpenAppDataOptions {
  readonly storage?: StoragePort;
  /** Where sql.js finds its wasm file in the browser. */
  readonly locateFile?: (file: string) => string;
}

export async function openAppData(options: OpenAppDataOptions = {}): Promise<AppData> {
  const { storage, locateFile } = options;
  const saves = createPersistQueue((bytes) => storage?.save(bytes) ?? Promise.resolve());
  const db = await openDatabase({
    bytes: await storage?.load(),
    // Web mode skips exporting the file after every transaction: nothing would keep it.
    persist: storage ? saves.persist : undefined,
    locateFile,
  });
  // T-045 loads the simulated data into a new database here.
  return { db, saves };
}
