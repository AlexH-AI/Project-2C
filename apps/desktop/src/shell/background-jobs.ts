import { createContext, useContext } from 'react';
import { formatLocalTime, formatPercentage } from '@p2c/domain';
import { notify } from '../data/listeners';
import { joinParts, t } from '../i18n';

/** How long "Đã …" of a job done stays on "Lưu ý" before the next appointment is back. */
export const DONE_MS = 3_000;

/** How many of the jobs ended the panel of today keeps, the latest. */
const KEPT = 5;

export type JobKind = 'export' | 'backup' | 'ai';

/**
 * A job the app runs in the background, the screen still in use (VA9b-a, mockup
 * search-rm-team.html `#now`): Xuất Excel of Báo cáo, a backup, an AI analysis of a customer.
 */
export interface BackgroundJob {
  readonly id: number;
  /** What it runs: a new start of the same key takes the place of one that ended. */
  readonly key: string;
  readonly kind: JobKind;
  /** The customer an analysis is of: its name is read, and masked, as it shows. */
  readonly customerId?: string;
  readonly state: 'running' | 'done' | 'failed';
  /**
   * From 0 to 1, as the caller measures it. None of the three can (one write, one request): with
   * none, the bar has no percent.
   */
  readonly progress?: number;
  /** The file a done export wrote. */
  readonly file?: string;
  readonly endedAt?: Date;
  /** On the pill: while it runs, once failed until it is run again, once done for `DONE_MS`. */
  readonly shown: boolean;
  /** When its state last changed, in order: the latest change is the one on the pill. */
  readonly changed: number;
  /** Runs it again; a failure's. */
  readonly retry?: () => void;
}

/** What the caller of a job tells of it as it goes. */
export interface JobHandle {
  progress(share: number): void;
  done(file?: string): void;
  fail(retry: () => void): void;
  /** Gone with no word: cancelled, or nothing ran. */
  drop(): void;
}

export interface BackgroundJobs {
  start(key: string, kind: JobKind, customerId?: string): JobHandle;
  /** Latest first; the same array until a change. */
  list(): readonly BackgroundJob[];
  /** Whether a job of `key` is running: Báo cáo and Dữ liệu read it, also shown again meanwhile. */
  busy(key: string): boolean;
  subscribe(listener: () => void): () => void;
}

/** `now` is the app's clock: when a job ended ("Đã sao lưu lúc 12:10"). */
export function createBackgroundJobs(now: () => Date): BackgroundJobs {
  let jobs: readonly BackgroundJob[] = [];
  let ids = 0;
  let changes = 0;
  const listeners = new Set<() => void>();
  const set = (next: readonly BackgroundJob[]) => {
    let ended = 0;
    jobs = next.filter((job) => job.state === 'running' || ++ended <= KEPT);
    notify(listeners, console.error);
  };
  const update = (id: number, change: Partial<BackgroundJob>) => {
    if (jobs.some((job) => job.id === id))
      set(jobs.map((job) => (job.id === id ? { ...job, ...change } : job)));
  };
  return {
    start(key, kind, customerId) {
      const id = ++ids;
      const job: BackgroundJob = {
        id,
        key,
        kind,
        customerId,
        state: 'running',
        shown: true,
        changed: ++changes,
      };
      set([job, ...jobs.filter((other) => other.state === 'running' || other.key !== key)]);
      const end = (change: Partial<BackgroundJob>) =>
        update(id, { ...change, endedAt: now(), changed: ++changes });
      return {
        progress: (share) => update(id, { progress: share }),
        done(file) {
          end({ state: 'done', file });
          setTimeout(() => update(id, { shown: false }), DONE_MS);
        },
        fail: (retry) => end({ state: 'failed', retry }),
        drop: () => set(jobs.filter((other) => other.id !== id)),
      };
    },
    list: () => jobs,
    busy: (key) => jobs.some((job) => job.key === key && job.state === 'running'),
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/** The job "Lưu ý" shows: of those on the pill, the one whose state changed last; none for none. */
export const pillJob = (jobs: readonly BackgroundJob[]): BackgroundJob | null =>
  jobs.reduce<BackgroundJob | null>(
    (latest, job) => (job.shown && (!latest || job.changed > latest.changed) ? job : latest),
    null,
  );

/**
 * What a job says: "Đang xuất Excel Báo cáo", "Đã xuất <file>", "Sao lưu không xong". `name` is
 * the customer of an analysis as the window shows it, masked or not.
 */
export function jobText(job: BackgroundJob, name = ''): string {
  const time = job.endedAt ? formatLocalTime(job.endedAt) : '';
  return t(`jobs.${job.state}.${job.kind}`, { file: job.file ?? '', time, name });
}

/** The words of the pill: a failure says that a press runs it again (mockup `#now`). */
export const jobPillText = (job: BackgroundJob, name = ''): string =>
  job.state === 'failed'
    ? joinParts([jobText(job, name), t('jobs.retryHint')])
    : jobText(job, name);

/** "60%" of a job running whose progress is measured; none else. */
export const jobPercent = (job: BackgroundJob): string | null =>
  job.state === 'running' && job.progress !== undefined
    ? t('jobs.percent', { value: formatPercentage(job.progress * 100) })
    : null;

/** The jobs of the window, which `AppShell` holds. */
export const JobsContext = createContext<BackgroundJobs | null>(null);

export function useJobs(): BackgroundJobs {
  const jobs = useContext(JobsContext);
  if (!jobs) throw new Error('useJobs needs <JobsContext> above it');
  return jobs;
}
