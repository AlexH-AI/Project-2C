/**
 * The AI requests the screens started, kept by the app rather than by a screen (review of PR 439):
 * leaving the customer profile while one runs and coming back still shows "Đang phân tích…" with
 * Hủy, or "Đang hủy…" until the request in Rust ends (spec Phase 5 §5.2); one that failed meanwhile
 * still says how (§5.3, T-297), unless the data was replaced since (DR6-144). One job per key: an
 * analysis by customer, an extraction by note.
 */
import type { AiAbortSignal, AiRunner, AiSettings } from '@p2c/ai';

/** A start refused because its key has a job already: the runner's own refusal (§5.2). */
const BUSY = Object.freeze({ kind: 'error', code: 'AI_BUSY' } as const);

export interface AiJob {
  /** Hủy was given: kept until the runner is free, as the request in Rust runs on. */
  readonly cancelled: boolean;
  /** What the job ends with; a screen shown again while it runs reads it here. */
  readonly done: Promise<unknown>;
  /** The settings the request runs with, taken at the click: what the screen says runs (DR5-31). */
  readonly settings: AiSettings | undefined;
}

/** What of a job's outcome a screen gone meanwhile must still say once shown again (`kept`). */
export interface AiJobKeep<T> {
  /** Whether the outcome is one to say. */
  readonly keeps: (outcome: T) => boolean;
  /**
   * The data's generation (`AppData.generation`), read as the job ends: an outcome kept of data
   * since replaced (Nạp lại, Nhập backup, even with the same IDs) is no longer said (DR6-144).
   */
  readonly generation: () => number;
}

export interface AiJobs {
  get(key: string): AiJob | undefined;
  /** Called on each change of the jobs; returns the unsubscribe function. */
  subscribe(listener: () => void): () => void;
  /**
   * Starts `job` under `key`, run with `settings`; the job gets the signal of Hủy. A key with a job
   * still there, running or cancelled, keeps it: the start gives `AI_BUSY` and `job` never runs.
   * `keep`: what of its outcome to keep for `kept`.
   */
  start<T>(
    key: string,
    job: (signal: AiAbortSignal) => Promise<T>,
    settings?: AiSettings,
    keep?: AiJobKeep<T>,
  ): Promise<T | typeof BUSY>;
  cancel(key: string): void;
  /**
   * The outcome `keep` kept of the job of `key` that ended last, while the data is the one it ended
   * on, until a screen has shown it and drops it, so it is said once; a new start of the key drops
   * it too. A change is told to the listeners, but for the data replaced: Nạp lại and Nhập backup run
   * on Cài đặt, and a profile shown after reads `kept` anew.
   */
  kept(key: string): unknown;
  drop(key: string): void;
}

/**
 * `reportError` gets a job that rejects (a bug: the app's jobs give their failures as outcomes), once,
 * so a screen reading `done` needs no handler of its own, and a listener that throws.
 */
export function createAiJobs(runner: AiRunner, reportError: (error: unknown) => void): AiJobs {
  const jobs = new Map<string, AiJob & { readonly controller: AbortController }>();
  const kept = new Map<
    string,
    { readonly outcome: unknown; readonly generation: number; readonly current: () => number }
  >();
  const listeners = new Set<() => void>();
  const changed = () => {
    // As `AppData`'s and the save queue's (NIT #87, DR6-140): a listener's bug must not make `start`
    // throw for a job it has started, nor keep the others from hearing of the change.
    for (const listener of listeners) {
      try {
        listener();
      } catch (error) {
        reportError(error);
      }
    }
  };
  // A job cancelled ends once the request in Rust has, which frees the runner.
  runner.subscribe(() => {
    if (runner.busy) return;
    const cancelled = [...jobs].filter(([, job]) => job.cancelled);
    for (const [key] of cancelled) jobs.delete(key);
    if (cancelled.length > 0) changed();
  });
  return {
    get: (key) => jobs.get(key),
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    start(key, job, settings, keep) {
      if (jobs.has(key)) return Promise.resolve(BUSY);
      kept.delete(key);
      const controller = new AbortController();
      const done = job(controller.signal);
      const entry = { cancelled: false, done, settings, controller };
      jobs.set(key, entry);
      // Hủy replaces the entry, so a job cancelled stays until the runner is free.
      const end = () => {
        if (jobs.get(key) !== entry) return;
        jobs.delete(key);
        changed();
      };
      done.then(
        (outcome) => {
          // A screen shown now drops it at once, once it has shown it (`useAiJob`).
          if (jobs.get(key) === entry && keep?.keeps(outcome)) {
            kept.set(key, { outcome, generation: keep.generation(), current: keep.generation });
          }
          end();
        },
        (error: unknown) => {
          reportError(error);
          end();
        },
      );
      changed();
      return done;
    },
    cancel(key) {
      const job = jobs.get(key);
      if (!job || job.cancelled) return;
      // With the runner free already, nothing runs on in Rust to wait for.
      if (runner.busy) jobs.set(key, { ...job, cancelled: true });
      else jobs.delete(key);
      job.controller.abort();
      changed();
    },
    kept(key) {
      const one = kept.get(key);
      return one && one.current() === one.generation ? one.outcome : undefined;
    },
    drop(key) {
      if (kept.delete(key)) changed();
    },
  };
}
