import { createAiRunner, type AiAbortSignal } from '@p2c/ai';
import { describe, expect, it, vi } from 'vitest';
import { createAiJobs } from './ai-jobs';

/** A job through the runner that ends only when the test says so, as a request running in Rust. */
function held() {
  const runner = createAiRunner(vi.fn());
  const jobs = createAiJobs(runner, vi.fn());
  let answer!: (value: string) => void;
  const job = (signal: AiAbortSignal) =>
    runner.run(() => new Promise<string>((resolve) => (answer = resolve)), signal);
  return { runner, jobs, job, answer: (value: string) => answer(value) };
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

  it('stops telling a listener that unsubscribed', () => {
    const { jobs, job } = held();
    const listener = vi.fn();
    const unsubscribe = jobs.subscribe(listener);

    unsubscribe();
    jobs.start('analysis:c1', job);

    expect(listener).not.toHaveBeenCalled();
  });
});
