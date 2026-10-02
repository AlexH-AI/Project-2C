/**
 * Opens the app database at startup (ADR-0016, spec §5). The exe passes a storage port backed by
 * the Rust file commands; web mode passes none and keeps the database in memory. A new database
 * (first start of the exe, every start of web mode) gets the simulated data (spec §7).
 */
import {
  exportBackup,
  importBackup,
  listAppointments,
  listCustomers,
  listPeople,
  listPolicies,
  listTeams,
  openDatabase,
  seedDemoData,
  type Database,
} from '@p2c/db';
import { fromLocalDate, localFileStamp, type CalendarDate } from '@p2c/domain';
import { createPersistQueue, type PersistQueue } from './persist-queue';

/** Where the database file lives. */
export interface StoragePort {
  /** The saved file, or `undefined` on first start. */
  load(): Promise<Uint8Array | undefined>;
  save(bytes: Uint8Array): Promise<void>;
  /** Copies the saved file into `backups\`; returns the backup's file name. */
  backup(): Promise<string>;
  /** Writes a `.p2cbackup` file into `exports\` (never over an earlier one); returns its path. */
  writeExport(name: string, bytes: Uint8Array): Promise<string>;
  /** The name of the newest file in `backups\`; `undefined` when there is none. */
  latestBackup(): Promise<string | undefined>;
  /** Shows `exports\` or `backups\` in Explorer. */
  openFolder(kind: DataFolder): Promise<void>;
}

/** The folders of `Project2C-data\` that Settings → Data opens. */
export type DataFolder = 'exports' | 'backups';

/** The last write of the database file that succeeded in this session. */
export interface LastSave {
  /** Local time the write finished. */
  readonly at: Date;
  /** Bytes written. */
  readonly size: number;
}

/** Live records per kind, as the screens count them (soft-deleted ones left out). */
export interface RecordCounts {
  readonly teams: number;
  readonly people: number;
  readonly customers: number;
  readonly appointments: number;
  readonly policies: number;
}

export interface ExportedBackup {
  /** `project2c-YYYYMMDD-HHMM.p2cbackup`, local time. */
  readonly name: string;
  readonly text: string;
  /** Bytes in the file. */
  readonly size: number;
  /**
   * Where the exe wrote the file, with a `-n` suffix when `name` was taken; `undefined` in web
   * mode, where the screen downloads `text`.
   */
  readonly path: string | undefined;
}

/** A backup file read and checked, waiting for the user to confirm the import. */
export interface BackupPreview {
  readonly exportedAt: string;
  readonly schemaVersion: number;
  readonly counts: RecordCounts;
  /** The database the import swaps in, already migrated to this app's schema version. */
  readonly bytes: Uint8Array;
}

export interface AppData {
  /** The open database; `reloadDemoData` replaces it, see `subscribe`. */
  db(): Database;
  /** Called whenever the data changes (`run`, `reloadDemoData`); returns the unsubscribe function. */
  subscribe(listener: () => void): () => void;
  /** Grows with every change; screens re-read the database when it does. */
  revision(): number;
  /**
   * Runs a command of `@p2c/db` and, when it succeeds, tells the screens to re-read. Screens write
   * only through this; a rejected command changed nothing and rethrows its `DbError`.
   */
  run<T>(command: (db: Database) => T): T;
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
  /** The current live records, for the import confirmation. */
  counts(): RecordCounts;
  /** Settings → Data: everything as a `.p2cbackup` file; the exe writes it into `exports\`. */
  exportBackup(): Promise<ExportedBackup>;
  /**
   * Reads and checks a backup file without touching the current data. Rejects with the `DbError`
   * `BACKUP_INVALID` or `SCHEMA_TOO_NEW`.
   */
  readBackup(text: string): Promise<BackupPreview>;
  /** Replaces everything with a read backup (D5), exactly as `reloadDemoData` does. */
  importBackup(backup: BackupPreview): Promise<string | undefined>;
  /** Settings → Data: the last successful save of this session; always `undefined` in web mode. */
  lastSave(): LastSave | undefined;
  /** Called whenever `lastSave` changes; returns the unsubscribe function. */
  subscribeLastSave(listener: () => void): () => void;
  /** The newest automatic backup's file name; `undefined` in web mode or when there is none. */
  latestBackup(): Promise<string | undefined>;
  /** Shows a data folder in Explorer; does nothing in web mode. */
  openFolder(kind: DataFolder): Promise<void>;
}

export interface OpenAppDataOptions {
  readonly storage?: StoragePort;
  /** Where sql.js finds its wasm file in the browser. */
  readonly locateFile?: (file: string) => string;
  /** Defaults to the local calendar day; e2e pins it. */
  readonly today?: () => CalendarDate;
  /** Writes the simulated data into a new database; tests pass a small stand-in. */
  readonly seed?: (db: Database, anchorDate: CalendarDate) => void;
  /** Local time for export file names and the last save; tests pin it. */
  readonly clock?: () => Date;
}

const UNSAVED_CHANGES = 'RELOAD_UNSAVED_CHANGES';

/** The refusal of `reloadDemoData` / `importBackup` while the last save failed. */
export const isUnsavedChangesError = (error: unknown): boolean =>
  error instanceof Error && error.message === UNSAVED_CHANGES;

/** The same seed on every machine: the same day gives the same data (spec §7). */
const DEMO_SEED = 1;

const seedDemo = (db: Database, anchorDate: CalendarDate) =>
  seedDemoData(db, { anchorDate, seed: DEMO_SEED });

export async function openAppData(options: OpenAppDataOptions = {}): Promise<AppData> {
  const {
    storage,
    locateFile,
    today = () => fromLocalDate(new Date()),
    seed = seedDemo,
    clock = () => new Date(),
  } = options;
  // The database's clock keeps the app's day, so its "from today on" checks agree with the screens
  // when e2e pins the day; the time of day is the clock's. Unpinned, it is the clock itself: one
  // reading, so a day and a time read either side of midnight never meet.
  const now = options.today
    ? () => {
        const at = new Date(clock());
        const day = today();
        at.setFullYear(day.year, day.month - 1, day.day);
        return at;
      }
    : clock;
  let lastSave: LastSave | undefined;
  const lastSaveListeners = new Set<() => void>();
  const saves = createPersistQueue(async (bytes) => {
    if (!storage) return;
    await storage.save(bytes);
    lastSave = { at: clock(), size: bytes.byteLength };
    for (const listener of lastSaveListeners) listener();
  });
  // Only the current database saves: one replaced by `reloadDemoData` must never save again, or a
  // late write to it would overwrite the file with the old data. `current` moves only once the
  // new database opened, so a failed open leaves the current one saving. While `opening`, both
  // save: the new one's migration, the current one's changes made meanwhile.
  let opens = 0;
  let current = 0;
  let opening: number | undefined;
  const open = async (bytes: Uint8Array) => {
    const mine = ++opens;
    opening = mine;
    try {
      const db = await openDatabase({
        bytes,
        // Web mode skips exporting the file after every transaction: nothing would keep it.
        persist: storage
          ? (snapshot) => {
              if (mine === current || mine === opening) saves.persist(snapshot);
            }
          : undefined,
        locateFile,
        now,
      });
      current = mine;
      return db;
    } finally {
      if (opening === mine) opening = undefined;
    }
  };

  // Seeded apart and saved as one file: the saved file never holds a half-built database.
  const demoData = async (): Promise<Uint8Array> => {
    const db = await openDatabase({ locateFile, now });
    try {
      const start = performance.now();
      seed(db, today());
      // Read by the e2e check of #64 (under 5 s in the browser).
      performance.measure('p2c:demo-seed', { start });
      return db.export();
    } finally {
      db.sqlite.close();
    }
  };

  const openFrom = async (bytes: Uint8Array): Promise<Database> => {
    const db = await open(bytes);
    if (storage) saves.persist(bytes);
    return db;
  };
  const openNew = async (): Promise<Database> => openFrom(await demoData());

  const stored = await storage?.load();
  let db = stored ? await open(stored) : await openNew();
  const listeners = new Set<() => void>();
  let revision = 0;
  const changed = () => {
    revision++;
    for (const listener of listeners) listener();
  };

  // Settings → Data replaces everything (reload, import): save what is pending, back the file up,
  // then swap. A failed save would leave changes out of the backup, so it refuses instead.
  const replace = async (next: () => Promise<Database>): Promise<string | undefined> => {
    await saves.idle();
    if (saves.failed()) throw new Error(UNSAVED_CHANGES);
    const backup = await storage?.backup();
    const previous = db;
    db = await next();
    changed();
    // Frees its WASM memory once the screens have re-rendered on the new database; a write to it
    // before then is never saved (`current`); after it, one throws. So callers must not keep a
    // `db` across an `await`: read it again through `db()` / `run` instead.
    await new Promise((resolve) => setTimeout(resolve, 0));
    previous.sqlite.close();
    return backup;
  };

  return {
    db: () => db,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    revision: () => revision,
    run(command) {
      const result = command(db);
      changed();
      return result;
    },
    hasFile: storage !== undefined,
    saves,
    today,
    reloadDemoData: () => replace(openNew),
    counts: () => countRecords(db),
    async exportBackup() {
      const name = `project2c-${localFileStamp(clock())}.p2cbackup`;
      const text = exportBackup(db);
      const bytes = new TextEncoder().encode(text);
      const path = await storage?.writeExport(name, bytes);
      return { name, text, size: bytes.byteLength, path };
    },
    async readBackup(text) {
      const imported = await importBackup(text, { locateFile });
      try {
        return {
          exportedAt: imported.exportedAt,
          schemaVersion: imported.schemaVersion,
          counts: countRecords(imported.db),
          bytes: imported.db.export(),
        };
      } finally {
        imported.db.sqlite.close();
      }
    },
    importBackup: (backup) => replace(() => openFrom(backup.bytes)),
    lastSave: () => lastSave,
    subscribeLastSave(listener) {
      lastSaveListeners.add(listener);
      return () => lastSaveListeners.delete(listener);
    },
    latestBackup: () => storage?.latestBackup() ?? Promise.resolve(undefined),
    openFolder: (kind) => storage?.openFolder(kind) ?? Promise.resolve(),
  };
}

/** The live records per kind of db. */
export function countRecords(db: Database): RecordCounts {
  return {
    teams: listTeams(db).length,
    people: listPeople(db).length,
    customers: listCustomers(db).length,
    appointments: listAppointments(db).length,
    policies: listPolicies(db).length,
  };
}
