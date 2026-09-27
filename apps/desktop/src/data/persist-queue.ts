/**
 * Serial save queue behind the `persist(bytes)` port (ADR-0016, spec §5): one write at a time.
 * Every snapshot is the whole file, so snapshots waiting behind a running write collapse into
 * the newest. A failed write raises `failed()`; the data stays in memory and the next save, or
 * `flush()`, writes everything again.
 */
export interface PersistQueue {
  persist(bytes: Uint8Array): void;
  /** Resolves once no write is running or waiting. */
  idle(): Promise<void>;
  /** True from a failed write until the next successful one. */
  failed(): boolean;
  /** True while a snapshot is waiting, being written, or kept after a failed write. */
  unsaved(): boolean;
  /**
   * Writes everything still unsaved, retrying the newest snapshot after a failed write.
   * Resolves once it is on disk (at once when nothing is unsaved); rejects if the write fails.
   */
  flush(): Promise<void>;
  /** Called whenever `failed()` changes; returns the unsubscribe function. */
  subscribe(listener: () => void): () => void;
}

export function createPersistQueue(write: (bytes: Uint8Array) => Promise<void>): PersistQueue {
  let waiting: Uint8Array | undefined;
  let running: Promise<void> | undefined;
  // The newest snapshot that failed to write; kept so `flush()` can retry it.
  let lost: Uint8Array | undefined;
  let failed = false;
  const listeners = new Set<() => void>();

  const setFailed = (value: boolean) => {
    if (failed === value) return;
    failed = value;
    for (const listener of listeners) listener();
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
        setFailed(false);
      } catch {
        lost = bytes;
        setFailed(true);
      }
    }
    running = undefined;
  };

  const persist = (bytes: Uint8Array) => {
    waiting = bytes;
    running ??= drain();
  };
  const idle = () => running ?? Promise.resolve();

  return {
    persist,
    idle,
    failed: () => failed,
    unsaved: () => running !== undefined || lost !== undefined,
    async flush() {
      // A write already running (and anything queued behind it) decides the outcome; only an
      // idle queue holding a failed snapshot writes it again.
      if (!running && lost) persist(lost);
      await idle();
      if (failed) throw new Error('SAVE_FAILED');
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
