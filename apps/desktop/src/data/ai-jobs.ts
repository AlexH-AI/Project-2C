/**
 * The AI requests the screens started, kept by the app rather than by a screen (review of PR 439):
 * leaving the customer profile while one runs and coming back still shows "Đang phân tích…" with
 * Hủy, or "Đang hủy…" until the request in Rust ends (spec Phase 5 §5.2); one that failed meanwhile
 * still says how (§5.3, T-297). One job per key: an analysis by customer, an extraction by note.
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

export interface AiJobs {
  get(key: string): AiJob | undefined;
  /** Called on each change of the jobs; returns the unsubscribe function. */
  subscribe(listener: () => void): () => void;
  /**
   * Starts `job` under `key`, run with `settings`; the job gets the signal of Hủy. A key with a job
   * still there, running or cancelled, keeps it: the start gives `AI_BUSY` and `job` never runs.
   * `keep`: an outcome a screen gone meanwhile must still say once shown again (`kept`).
   */
  start<T>(
    key: string,
    job: (signal: AiAbortSignal) => Promise<T>,
    settings?: AiSettings,
    keep?: (outcome: T) => boolean,
  ): Promise<T | typeof BUSY>;
  cancel(key: string): void;
  /**
   * The outcome `keep` kept of the job of `key` that ended last, until a screen has shown it and
   * drops it, so it is said once; a new start of the key drops it too. A change is told to the
   * listeners.
   */
  kept(key: string): unknown;
  drop(key: string): void;
}

/**
 * `reportError` gets a job that rejects (a bug: the app's jobs give their failures as outcomes), once,
 * so a screen reading `done` needs no handler of its own.
 */
export function createAiJobs(runner: AiRunner, reportError: (error: unknown) => void): AiJobs {
  const jobs = new Map<string, AiJob & { readonly controller: AbortController }>();
  const kept = new Map<string, unknown>();
  const listeners = new Set<() => void>();
  const changed = () => {
    for (const listener of listeners) listener();
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
          if (jobs.get(key) === entry && keep?.(outcome)) kept.set(key, outcome);
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
    kept: (key) => kept.get(key),
    drop(key) {
      if (kept.delete(key)) changed();
    },
  };
}
