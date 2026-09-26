/**
 * Serial save queue behind the `persist(bytes)` port (ADR-0016, spec §5): one write at a time.
 * Every snapshot is the whole file, so snapshots waiting behind a running write collapse into
 * the newest. A failed write raises `failed()`; the data stays in memory and the next save
 * writes everything again.
 */
export interface PersistQueue {
  persist(bytes: Uint8Array): void;
  /** Resolves once no write is running or waiting. */
  idle(): Promise<void>;
  /** True from a failed write until the next successful one. */
  failed(): boolean;
  /** Called whenever `failed()` changes; returns the unsubscribe function. */
  subscribe(listener: () => void): () => void;
}

export function createPersistQueue(write: (bytes: Uint8Array) => Promise<void>): PersistQueue {
  let waiting: Uint8Array | undefined;
  let running: Promise<void> | undefined;
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
        await write(bytes);
        setFailed(false);
      } catch {
        setFailed(true);
      }
    }
    running = undefined;
  };

  return {
    persist(bytes) {
      waiting = bytes;
      running ??= drain();
    },
    idle: () => running ?? Promise.resolve(),
    failed: () => failed,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
