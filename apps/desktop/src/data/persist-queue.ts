/**
 * Serial save queue behind the `persist(bytes)` port (ADR-0016, spec §5): one write at a time.
 * Every snapshot is the whole file, so snapshots waiting behind a running write collapse into
 * the newest. A failed write raises `failed()`; the data stays in memory and the next save, or
 * `flush()`, writes everything again. Its `status()` is the one store of the save state: the save
 * warning, the close question and the sidebar's indicator read it (mockup settings-data 10d).
 */
export interface PersistQueue {
  persist(bytes: Uint8Array): void;
  /**
   * Counts `work` as saving until it settles: work that ends by persisting the data it changed (a
   * replace of the data, S2-1). `flush()` waits for it; `idle()` does not, so the work may.
   */
  track(work: Promise<unknown>): void;
  /** Resolves once no write is running or waiting. */
  idle(): Promise<void>;
  /** True from a failed write until the next successful one. */
  failed(): boolean;
  /** True while a snapshot is waiting, being written, or kept after a failed write. */
  unsaved(): boolean;
  /**
   * Waits for the work tracked, then writes everything still unsaved, retrying the newest snapshot
   * after a failed write. Resolves once it is on disk (at once when nothing is unsaved); rejects if
   * the write fails.
   */
  flush(): Promise<void>;
  /** The save state now, the same object until something in it changes. */
  status(): SaveStatus;
  /**
   * Called whenever `status()` changes; returns the unsubscribe function. A listener that throws
   * is reported as a bug, and the others are still called.
   */
  subscribe(listener: () => void): () => void;
}

export interface SaveStatus {
  /** A write runs or waits, or work tracked has not settled. */
  readonly saving: boolean;
  /** True from a failed write until the next successful one. */
  readonly failed: boolean;
  /** What the failed write threw: the storage's error (`DISK_FULL`…); `undefined` if not failed. */
  readonly error: unknown;
  /** The last write that succeeded in this session; `undefined` before the first. */
  readonly lastSave: LastSave | undefined;
}

export interface LastSave {
  /** Local time the write finished. */
  readonly at: Date;
  /** Bytes written. */
  readonly size: number;
}

/** @param clock Local time, for `lastSave`. */
export function createPersistQueue(
  write: (bytes: Uint8Array) => Promise<void>,
  clock: () => Date = () => new Date(),
): PersistQueue {
  let waiting: Uint8Array | undefined;
  let running: Promise<void> | undefined;
  // The newest snapshot that failed to write; kept so `flush()` can retry it.
  let lost: Uint8Array | undefined;
  const tracked = new Set<Promise<unknown>>();
  // What the last write came to; `saving` is read off the queue itself.
  let outcome: Omit<SaveStatus, 'saving'> = {
    failed: false,
    error: undefined,
    lastSave: undefined,
  };
  let status: SaveStatus = { saving: false, ...outcome };
  const listeners = new Set<() => void>();

  const changed = () => {
    const next: SaveStatus = { saving: running !== undefined || tracked.size > 0, ...outcome };
    const keys = Object.keys(next) as (keyof SaveStatus)[];
    if (keys.every((key) => Object.is(next[key], status[key]))) return;
    status = next;
    // Never inside the write's `try`: a listener's bug is not a failed save, and must not stop the
    // others or leave the queue stuck (NIT #87).
    for (const listener of listeners) {
      try {
        listener();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const drain = async () => {
    while (waiting) {
      const bytes = waiting;
      waiting = undefined;
      try {
        // A write that throws instead of rejecting must still yield here: finishing drain()
        // synchronously would leave `running` pointing at a settled promise, stalling the queue.
        await new Promise<void>((resolve) => resolve(write(bytes)));
        lost = undefined;
        const lastSave = { at: clock(), size: bytes.byteLength };
        outcome = { failed: false, error: undefined, lastSave };
      } catch (error) {
        lost = bytes;
        outcome = { ...outcome, failed: true, error };
      }
      // The queue is empty once the last write ends: one change, saved or failed, not two.
      if (!waiting) running = undefined;
      changed();
    }
  };

  const persist = (bytes: Uint8Array) => {
    waiting = bytes;
    if (running) return;
    running = drain();
    changed();
  };
  const idle = () => running ?? Promise.resolve();

  return {
    persist,
    track(work) {
      tracked.add(work);
      changed();
      const settled = () => {
        tracked.delete(work);
        changed();
      };
      void work.then(settled, settled);
    },
    idle,
    failed: () => outcome.failed,
    unsaved: () => running !== undefined || lost !== undefined,
    async flush() {
      // Work that ends in a snapshot persists it first, work tracked meanwhile too.
      while (tracked.size > 0) await Promise.allSettled(tracked);
      // A write already running (and anything queued behind it) decides the outcome; only an
      // idle queue holding a failed snapshot writes it again.
      if (!running && lost) persist(lost);
      await idle();
      if (outcome.failed) throw new Error('SAVE_FAILED');
    },
    status: () => status,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
