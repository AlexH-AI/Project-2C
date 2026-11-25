import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createBackgroundJobs,
  DONE_MS,
  jobPercent,
  jobPillText,
  jobText,
  pillJob,
  type BackgroundJobs,
} from './background-jobs';

/** 12:10 by the local clock, as the mockup's backup. */
const AT = new Date(2026, 10, 10, 12, 10);

let jobs: BackgroundJobs;
beforeEach(() => {
  vi.useFakeTimers();
  jobs = createBackgroundJobs(() => AT);
});
afterEach(() => vi.useRealTimers());

const onPill = () => pillJob(jobs.list());

describe('background jobs', () => {
  it('shows a job running on the pill, busy until it ends, with its progress when measured', () => {
    const job = jobs.start('export', 'export');
    expect(jobs.busy('export')).toBe(true);
    expect(jobs.busy('backup')).toBe(false);
    expect(onPill()).toMatchObject({ kind: 'export', state: 'running' });
    expect(jobPercent(onPill()!)).toBeNull();
    job.progress(0.6);
    expect(jobPercent(onPill()!)).toBe('60%');
    job.done('x.xlsx');
    expect(jobPercent(onPill()!)).toBeNull();
  });

  it('says a job done for about 3 seconds, then leaves the pill but stays in the list', () => {
    const job = jobs.start('export', 'export');
    job.done('bao-cao_2026-09.xlsx');
    expect(jobs.busy('export')).toBe(false);
    expect(jobText(onPill()!)).toBe('Đã xuất bao-cao_2026-09.xlsx');
    vi.advanceTimersByTime(DONE_MS - 1);
    expect(onPill()).not.toBeNull();
    vi.advanceTimersByTime(1);
    expect(onPill()).toBeNull();
    expect(jobs.list()).toMatchObject([{ state: 'done', endedAt: AT }]);
  });

  it('keeps a failure on the pill until it is run again, which runs the same job', () => {
    const run = vi.fn(() => jobs.start('backup', 'backup'));
    jobs.start('backup', 'backup').fail(run);
    vi.advanceTimersByTime(60_000);
    expect(jobPillText(onPill()!)).toBe('Sao lưu không xong · bấm để thử lại');
    onPill()!.retry!();
    expect(run).toHaveBeenCalledOnce();
    // The new run of the backup takes the place of the failure.
    expect(jobs.list()).toMatchObject([{ kind: 'backup', state: 'running' }]);
  });

  it('puts the latest change on the pill: a failure comes back once a later job is done', () => {
    jobs.start('backup', 'backup').fail(() => undefined);
    const report = jobs.start('export', 'export');
    expect(onPill()).toMatchObject({ kind: 'export', state: 'running' });
    report.done('bao-cao.xlsx');
    expect(onPill()).toMatchObject({ kind: 'export', state: 'done' });
    vi.advanceTimersByTime(DONE_MS);
    expect(onPill()).toMatchObject({ kind: 'backup', state: 'failed' });
  });

  it('keeps a failure however many jobs end after it, until it is run again', () => {
    jobs.start('backup', 'backup').fail(() => undefined);
    jobs.start('export', 'export').done('bao-cao.xlsx');
    for (const id of ['c1', 'c2', 'c3', 'c4', 'c5']) jobs.start(`ai:${id}`, 'ai', id).done();
    vi.advanceTimersByTime(DONE_MS);
    expect(onPill()).toMatchObject({ kind: 'backup', state: 'failed' });
    // Of the jobs done, the five latest.
    expect(jobs.list().map((job) => job.customerId ?? job.kind)).toEqual([
      'c5',
      'c4',
      'c3',
      'c2',
      'c1',
      'backup',
    ]);
  });

  it('drops a job cancelled with no word, and keeps the five latest of those done', () => {
    jobs.start('ai:c1', 'ai', 'c1').drop();
    expect(jobs.list()).toEqual([]);
    for (const key of ['a', 'b', 'c', 'd', 'e', 'f']) jobs.start(key, 'export').done(`${key}.xlsx`);
    // Each says so on the pill first.
    expect(jobs.list()).toHaveLength(6);
    vi.advanceTimersByTime(DONE_MS);
    expect(jobs.list().map((job) => job.file)).toEqual([
      'f.xlsx',
      'e.xlsx',
      'd.xlsx',
      'c.xlsx',
      'b.xlsx',
    ]);
  });

  it('tells its listeners of each change, the same list between changes', () => {
    const heard = vi.fn();
    const stop = jobs.subscribe(heard);
    const before = jobs.list();
    expect(jobs.list()).toBe(before);
    jobs.start('export', 'export').done('x.xlsx');
    expect(heard).toHaveBeenCalledTimes(2);
    stop();
    vi.advanceTimersByTime(DONE_MS);
    expect(heard).toHaveBeenCalledTimes(2);
  });
});

describe('job texts', () => {
  it('names each job running, done and failed, the customer of an analysis as shown', () => {
    const report = jobs.start('export', 'export');
    expect(jobText(jobs.list()[0]!)).toBe('Đang xuất Excel Báo cáo');
    report.fail(() => undefined);
    expect(jobText(jobs.list()[0]!)).toBe('Xuất Excel Báo cáo không xong');
    jobs.start('backup', 'backup').done();
    expect(jobText(jobs.list()[0]!)).toBe('Đã sao lưu lúc 12:10');
    const analysis = jobs.start('ai:c1', 'ai', 'c1');
    expect(jobText(jobs.list()[0]!, 'T. M. H.')).toBe('Đang phân tích AI T. M. H.');
    analysis.fail(() => undefined);
    expect(jobPillText(jobs.list()[0]!, 'Trần Minh Huệ')).toBe(
      'Phân tích AI Trần Minh Huệ không xong · bấm để thử lại',
    );
    // Only a failure asks for a press.
    expect(jobPillText(jobs.list()[1]!)).toBe('Đã sao lưu lúc 12:10');
  });
});
