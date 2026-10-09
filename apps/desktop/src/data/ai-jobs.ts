/**
 * The AI requests the screens started, kept by the app rather than by a screen (review of PR 439):
 * leaving the customer profile while one runs and coming back still shows "Đang phân tích…" with
 * Hủy, or "Đang hủy…" until the request in Rust ends (spec Phase 5 §5.2). One job per key: an
 * analysis by customer, an extraction by note.
 */
import type { AiAbortSignal, AiRunner } from '@p2c/ai';

export interface AiJob {
  /** Hủy was given: kept until the runner is free, as the request in Rust runs on. */
  readonly cancelled: boolean;
  /** What the job ends with; a screen shown again while it runs reads it here. */
  readonly done: Promise<unknown>;
}

export interface AiJobs {
  get(key: string): AiJob | undefined;
  /** Called on each change of the jobs; returns the unsubscribe function. */
  subscribe(listener: () => void): () => void;
  /** Starts `job` under `key`; the job gets the signal of Hủy. */
  start<T>(key: string, job: (signal: AiAbortSignal) => Promise<T>): Promise<T>;
  cancel(key: string): void;
}

export function createAiJobs(runner: AiRunner): AiJobs {
  const jobs = new Map<string, AiJob & { readonly controller: AbortController }>();
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
    start(key, job) {
      const controller = new AbortController();
      const done = job(controller.signal);
      const entry = { cancelled: false, done, controller };
      jobs.set(key, entry);
      // Hủy replaces the entry, so a job cancelled stays until the runner is free.
      const end = () => {
        if (jobs.get(key) !== entry) return;
        jobs.delete(key);
        changed();
      };
      done.then(end, end);
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
  };
}
