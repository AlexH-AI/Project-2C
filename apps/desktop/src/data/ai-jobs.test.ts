import { createAiRunner, DEFAULT_AI_SETTINGS, type AiAbortSignal } from '@p2c/ai';
import { describe, expect, it, vi } from 'vitest';
import { createAiJobs } from './ai-jobs';

/** A job through the runner that ends only when the test says so, as a request running in Rust. */
function held() {
  const runner = createAiRunner(vi.fn());
  const reportError = vi.fn();
  const jobs = createAiJobs(runner, reportError);
  let answer!: (value: string) => void;
  const job = (signal: AiAbortSignal) =>
    runner.run(() => new Promise<string>((resolve) => (answer = resolve)), signal);
  return { runner, jobs, job, answer: (value: string) => answer(value), reportError };
}

describe('createAiJobs (review of PR 439: a run outlives the screen that started it)', () => {
  it('keeps a running job by its key until it ends, and gives its outcome', async () => {
    const { jobs, job, answer } = held();
    const listener = vi.fn();
    jobs.subscribe(listener);

    const done = jobs.start('analysis:c1', job);

    expect(jobs.get('analysis:c1')).toMatchObject({ cancelled: false });
    expect(jobs.get('analysis:c2')).toBeUndefined();
    expect(listener).toHaveBeenCalledTimes(1);
    answer('saved');
    await expect(done).resolves.toBe('saved');
    // Once ended, the job is gone.
    expect(jobs.get('analysis:c1')).toBeUndefined();
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('reports a job that fails, once, and lets it go (review of PR 468)', async () => {
    const reportError = vi.fn();
    const jobs = createAiJobs(createAiRunner(vi.fn()), reportError);
    const bug = new TypeError('boom');

    const done = jobs.start('analysis:c1', () => Promise.reject(bug));

    await expect(done).rejects.toBe(bug);
    await vi.waitFor(() => expect(jobs.get('analysis:c1')).toBeUndefined());
    expect(reportError).toHaveBeenCalledExactlyOnceWith(bug);
  });

  it('gives a screen shown again the outcome of the job still running', async () => {
    const { jobs, job, answer } = held();
    jobs.start('extraction:n1', job);

    const seen = jobs.get('extraction:n1')!.done;
    answer('facts');

    await expect(seen).resolves.toBe('facts');
  });

  it('after Hủy keeps the job, cancelled, until the request has really ended (§5.2)', async () => {
    const { runner, jobs, job, answer } = held();
    const done = jobs.start('analysis:c1', job);

    jobs.cancel('analysis:c1');

    await expect(done).resolves.toEqual({ kind: 'cancelled' });
    expect(jobs.get('analysis:c1')).toMatchObject({ cancelled: true });
    expect(runner.busy).toBe(true);
    answer('saved');
    await vi.waitFor(() => expect(jobs.get('analysis:c1')).toBeUndefined());
    expect(runner.busy).toBe(false);
  });

  it('keeps the settings taken at the click while it runs, also after Hủy (DR5-31)', () => {
    const { jobs, job } = held();
    const settings = { ...DEFAULT_AI_SETTINGS, provider: 'OPENCODE_GO', model: 'kimi-k3' } as const;

    jobs.start('analysis:c1', job, settings);
    expect(jobs.get('analysis:c1')).toMatchObject({ settings });
    jobs.cancel('analysis:c1');
    expect(jobs.get('analysis:c1')).toMatchObject({ cancelled: true, settings });

    jobs.start('extraction:n1', job);
    expect(jobs.get('extraction:n1')!.settings).toBeUndefined();
  });

  it('ignores Hủy of a key with no job', () => {
    const { jobs } = held();
    const listener = vi.fn();
    jobs.subscribe(listener);

    jobs.cancel('analysis:c1');

    expect(listener).not.toHaveBeenCalled();
  });

  it('lets a job whose start was refused (another request runs) end at once', async () => {
    const { jobs, job } = held();
    jobs.start('analysis:c1', job);

    const refused = jobs.start('extraction:n1', job);

    await expect(refused).resolves.toEqual({ kind: 'error', code: 'AI_BUSY' });
    await vi.waitFor(() => expect(jobs.get('extraction:n1')).toBeUndefined());
    expect(jobs.get('analysis:c1')).toBeDefined();
  });

  it('refuses a second start on a key whose job still runs, or waits after Hủy (AI_BUSY)', async () => {
    const { runner, jobs, job, answer } = held();
    const done = jobs.start('analysis:c1', job);
    const listener = vi.fn();
    jobs.subscribe(listener);
    const again = vi.fn(job);

    await expect(jobs.start('analysis:c1', again)).resolves.toEqual({
      kind: 'error',
      code: 'AI_BUSY',
    });
    jobs.cancel('analysis:c1');
    listener.mockClear();
    await expect(jobs.start('analysis:c1', again)).resolves.toEqual({
      kind: 'error',
      code: 'AI_BUSY',
    });

    // The job was never run, nor the one there replaced: still "Đang hủy…" until the request ends.
    expect(again).not.toHaveBeenCalled();
    expect(listener).not.toHaveBeenCalled();
    expect(jobs.get('analysis:c1')).toMatchObject({ cancelled: true });
    await expect(done).resolves.toEqual({ kind: 'cancelled' });
    answer('saved');
    await vi.waitFor(() => expect(runner.busy).toBe(false));
    expect(jobs.get('analysis:c1')).toBeUndefined();
  });

  /** Keeps a failure, of data that is never replaced unless the test says so. */
  const keep = (generation = () => 0) => ({
    keeps: (outcome: unknown) => outcome === 'failed',
    generation,
  });
  const failed = keep();

  it('keeps how a job failed for a screen that was gone meanwhile, until it was shown (T-297)', async () => {
    const { jobs, job, answer } = held();
    const done = jobs.start('analysis:c1', job, undefined, failed);

    answer('failed');
    await expect(done).resolves.toBe('failed');

    await vi.waitFor(() => expect(jobs.get('analysis:c1')).toBeUndefined());
    // The profile shown again says it, then drops it, as a screen that stayed would lose it.
    expect(jobs.kept('analysis:c1')).toBe('failed');
    expect(jobs.kept('analysis:c2')).toBeUndefined();
    const listener = vi.fn();
    jobs.subscribe(listener);
    jobs.drop('analysis:c1');
    jobs.drop('analysis:c1');
    expect(jobs.kept('analysis:c1')).toBeUndefined();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('keeps nothing else: an outcome `keep` refuses, or a job cancelled, even one failing after', async () => {
    const { runner, jobs, job, answer } = held();
    const done = jobs.start('analysis:c1', job, undefined, failed);
    answer('saved');
    await expect(done).resolves.toBe('saved');
    expect(runner.busy).toBe(false);

    const cancelled = jobs.start('analysis:c2', job, undefined, failed);
    jobs.cancel('analysis:c2');
    await expect(cancelled).resolves.toEqual({ kind: 'cancelled' });
    answer('failed');
    await vi.waitFor(() => expect(runner.busy).toBe(false));

    // Deaf to Hủy, unlike a request through the runner: it ends as it fails, after Hủy all the same.
    let fail!: (outcome: string) => void;
    const deaf = jobs.start(
      'analysis:c3',
      () => new Promise<string>((resolve) => (fail = resolve)),
      undefined,
      failed,
    );
    jobs.cancel('analysis:c3');
    fail('failed');
    await expect(deaf).resolves.toBe('failed');

    expect(jobs.kept('analysis:c1')).toBeUndefined();
    expect(jobs.kept('analysis:c2')).toBeUndefined();
    expect(jobs.kept('analysis:c3')).toBeUndefined();
  });

  it('drops a failure kept once a new run of its key starts', async () => {
    const { runner, jobs, job, answer } = held();
    const first = jobs.start('extraction:n1', job, undefined, failed);
    answer('failed');
    await expect(first).resolves.toBe('failed');
    expect(runner.busy).toBe(false);

    const second = jobs.start('extraction:n1', job, undefined, failed);
    expect(jobs.kept('extraction:n1')).toBeUndefined();
    answer('facts');
    await expect(second).resolves.toBe('facts');

    expect(jobs.kept('extraction:n1')).toBeUndefined();
  });

  it('keeps a failure only for the data it ended on: none once the data is replaced (DR6-144)', async () => {
    const { runner, jobs, job, answer } = held();
    let generation = 1;
    const ofData = keep(() => generation);

    const done = jobs.start('analysis:c1', job, undefined, ofData);
    answer('failed');
    await expect(done).resolves.toBe('failed');
    expect(jobs.kept('analysis:c1')).toBe('failed');
    // Nạp lại or Nhập backup, even of the same data: the profile shown again says nothing of it.
    generation = 2;
    expect(jobs.kept('analysis:c1')).toBeUndefined();

    // The generation is read as the job ends: a job that ends on the new data keeps its failure.
    expect(runner.busy).toBe(false);
    const later = jobs.start('analysis:c2', job, undefined, ofData);
    generation = 3;
    answer('failed');
    await expect(later).resolves.toBe('failed');
    expect(jobs.kept('analysis:c2')).toBe('failed');
  });

  it('reports a listener that throws, still telling the others, and gives the job it started (review of PR 911)', async () => {
    const { jobs, job, answer, reportError } = held();
    const bug = new TypeError('listener');
    jobs.subscribe(() => {
      throw bug;
    });
    const other = vi.fn();
    jobs.subscribe(other);

    const done = jobs.start('analysis:c1', job);

    expect(jobs.get('analysis:c1')).toMatchObject({ cancelled: false });
    expect(other).toHaveBeenCalledTimes(1);
    answer('saved');
    await expect(done).resolves.toBe('saved');
    await vi.waitFor(() => expect(jobs.get('analysis:c1')).toBeUndefined());
    expect(other).toHaveBeenCalledTimes(2);
    expect(reportError).toHaveBeenCalledTimes(2);
    expect(reportError).toHaveBeenCalledWith(bug);
  });

  it('stops telling a listener that unsubscribed', () => {
    const { jobs, job } = held();
    const listener = vi.fn();
    const unsubscribe = jobs.subscribe(listener);

    unsubscribe();
    jobs.start('analysis:c1', job);

    expect(listener).not.toHaveBeenCalled();
  });
});
