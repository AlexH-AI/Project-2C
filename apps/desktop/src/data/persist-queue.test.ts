import { describe, expect, it, vi } from 'vitest';
import { createPersistQueue, type SaveStatus } from './persist-queue';

/** A fake file: each write resolves when the test releases it, or fails with what it is given. */
function fakeDisk() {
  let onDisk: string | undefined;
  let inFlight = 0;
  let maxInFlight = 0;
  const started: string[] = [];
  const pending: { finish: () => void; fail: (error?: unknown) => void }[] = [];
  const write = (bytes: Uint8Array) =>
    new Promise<void>((resolve, reject) => {
      const text = new TextDecoder().decode(bytes);
      started.push(text);
      inFlight++;
      maxInFlight = Math.max(maxInFlight, inFlight);
      pending.push({
        finish: () => {
          inFlight--;
          onDisk = text;
          resolve();
        },
        fail: (error: unknown = new Error('disk full')) => {
          inFlight--;
          reject(error);
        },
      });
    });
  return {
    write,
    started,
    get onDisk() {
      return onDisk;
    },
    get maxInFlight() {
      return maxInFlight;
    },
    next: () => pending.shift()!,
    /**
     * Finishes every write, those it leads the queue to start too, so that a wrong extra write
     * shows on disk instead of hanging the test.
     */
    async finishAll() {
      for (let write = pending.shift(); write; write = pending.shift()) {
        write.finish();
        await tick();
      }
    },
  };
}

const bytes = (text: string) => new TextEncoder().encode(text);
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

/** A promise the test settles. */
function deferred() {
  let resolve!: () => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const NOTHING_YET: SaveStatus = {
  saving: false,
  failed: false,
  error: undefined,
  lastSave: undefined,
};

describe('createPersistQueue', () => {
  it('writes one file at a time and ends with the last snapshot on disk', async () => {
    const disk = fakeDisk();
    const queue = createPersistQueue(disk.write);

    queue.persist(bytes('v1'));
    queue.persist(bytes('v2'));
    queue.persist(bytes('v3'));
    disk.next().finish();
    await tick();
    disk.next().finish();
    await queue.idle();

    expect(disk.maxInFlight).toBe(1);
    // Snapshots queued behind a running write collapse into the newest one.
    expect(disk.started).toEqual(['v1', 'v3']);
    expect(disk.onDisk).toBe('v3');
  });

  it('says it is saving while a write runs or waits, then when the last write ended and its size', async () => {
    const disk = fakeDisk();
    let now = new Date(2026, 9, 25, 7, 42, 13);
    const queue = createPersistQueue(disk.write, () => now);
    const told: SaveStatus[] = [];
    queue.subscribe(() => told.push(queue.status()));
    expect(queue.status()).toEqual(NOTHING_YET);

    queue.persist(bytes('v1'));
    const saving = queue.status();
    expect(saving).toEqual({ ...NOTHING_YET, saving: true });
    // A snapshot waiting behind the running write changes nothing the store shows: same object.
    queue.persist(bytes('v22'));
    expect(queue.status()).toBe(saving);
    disk.next().finish();
    await tick();
    now = new Date(2026, 9, 25, 7, 43, 0);
    disk.next().finish();
    await queue.idle();

    expect(queue.status()).toEqual({ ...NOTHING_YET, lastSave: { at: now, size: 3 } });
    expect(told.at(-1)).toBe(queue.status());
    expect(told.every((status) => status.failed === false)).toBe(true);
  });

  it('keeps what a failed write threw, and the last save, until a write succeeds (DR6-07)', async () => {
    const disk = fakeDisk();
    const at = new Date(2026, 9, 25, 7, 42, 13);
    const queue = createPersistQueue(disk.write, () => at);
    queue.persist(bytes('v1'));
    disk.next().finish();
    await queue.idle();
    const { lastSave } = queue.status();
    const listener = vi.fn();
    queue.subscribe(listener);

    // What Rust answers a save that found the disk full.
    queue.persist(bytes('v2'));
    disk.next().fail('DISK_FULL');
    await queue.idle();
    expect(queue.failed()).toBe(true);
    expect(queue.status()).toEqual({ saving: false, failed: true, error: 'DISK_FULL', lastSave });
    expect(listener).toHaveBeenCalled();

    // Failing again for another reason while still unsaved: the warning must follow.
    const retried = queue.flush();
    await tick();
    disk.next().fail('Access is denied. (os error 5)');
    await expect(retried).rejects.toThrow('SAVE_FAILED');
    expect(queue.status()).toMatchObject({ failed: true, error: 'Access is denied. (os error 5)' });

    // The data stays in memory; the next save writes the whole file again.
    queue.persist(bytes('v3'));
    disk.next().finish();
    await queue.idle();
    expect(queue.failed()).toBe(false);
    expect(queue.status()).toEqual({ ...NOTHING_YET, lastSave: { at, size: 2 } });
    expect(disk.onDisk).toBe('v3');
  });

  it('counts tracked work as saving until it settles; flush() waits for it and what it persists', async () => {
    const disk = fakeDisk();
    const queue = createPersistQueue(disk.write);
    const replace = deferred();

    queue.track(replace.promise);
    expect(queue.status()).toEqual({ ...NOTHING_YET, saving: true });
    // The work itself may wait for the writes before it (a replace backs the file up first).
    await queue.idle();
    let closed = false;
    const flushed = queue.flush().then(() => (closed = true));
    await tick();
    expect(closed).toBe(false);

    // It ends by persisting the data it changed, as a replace does: the store stays saving.
    queue.persist(bytes('new'));
    replace.resolve();
    await tick();
    expect(closed).toBe(false);
    expect(queue.status().saving).toBe(true);
    disk.next().finish();
    await flushed;

    expect(disk.onDisk).toBe('new');
    expect(queue.status().saving).toBe(false);
  });

  it('stops counting tracked work that fails; flush() then writes a snapshot that failed again', async () => {
    const disk = fakeDisk();
    const queue = createPersistQueue(disk.write);
    queue.persist(bytes('v1'));
    disk.next().fail();
    await queue.idle();
    // A replace refused because the last save failed changed nothing.
    const replace = deferred();
    queue.track(replace.promise);

    const flushed = queue.flush();
    replace.reject(new Error('RELOAD_UNSAVED_CHANGES'));
    await tick();
    expect(queue.status()).toMatchObject({ saving: true, failed: true });
    disk.next().finish();
    await flushed;

    expect(disk.started).toEqual(['v1', 'v1']);
    expect(queue.status()).toMatchObject({ saving: false, failed: false });
  });

  it('tells every listener when one throws, reports the error, and keeps saving (NIT #87)', async () => {
    const report = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const disk = fakeDisk();
    const queue = createPersistQueue(disk.write);
    const bug = new Error('listener bug');
    queue.subscribe(() => {
      throw bug;
    });
    const other = vi.fn();
    queue.subscribe(other);

    queue.persist(bytes('v1'));
    disk.next().fail();
    await queue.idle();
    expect(queue.status()).toMatchObject({ saving: false, failed: true });
    // A listener's error never makes a write that succeeds a failed one, nor stalls the queue.
    queue.persist(bytes('v2'));
    disk.next().finish();
    await queue.idle();
    queue.persist(bytes('v3'));
    disk.next().finish();
    await queue.idle();

    expect(queue.status()).toMatchObject({ saving: false, failed: false });
    expect(disk.onDisk).toBe('v3');
    expect(other).toHaveBeenCalledTimes(report.mock.calls.length);
    expect(report).toHaveBeenCalledWith(bug);
    report.mockRestore();
  });

  it('keeps saving after a write throws before returning a promise', async () => {
    const written: string[] = [];
    let calls = 0;
    const queue = createPersistQueue((data) => {
      if (++calls === 1) throw new Error('sync failure');
      written.push(new TextDecoder().decode(data));
      return Promise.resolve();
    });

    queue.persist(bytes('v1'));
    await queue.idle();
    expect(queue.failed()).toBe(true);

    queue.persist(bytes('v2'));
    await queue.idle();
    expect(written).toEqual(['v2']);
    expect(queue.failed()).toBe(false);
  });

  it('flush() writes the latest snapshot again after a failed write, and only once', async () => {
    const disk = fakeDisk();
    const queue = createPersistQueue(disk.write);

    queue.persist(bytes('v1'));
    disk.next().fail();
    await queue.idle();
    expect(queue.status()).toMatchObject({ saving: false, failed: true });

    const flushed = queue.flush();
    await tick();
    disk.next().finish();
    await flushed;

    expect(disk.started).toEqual(['v1', 'v1']);
    expect(disk.onDisk).toBe('v1');
    expect(queue.status()).toMatchObject({ saving: false, failed: false });
    // The retry that succeeded dropped the snapshot: closing the app (flush()) writes nothing more.
    const closed = queue.flush();
    await disk.finishAll();
    await closed;
    expect(disk.started).toEqual(['v1', 'v1']);
  });

  it('flush() leaves a newer running write last on disk, never the snapshot that failed', async () => {
    const disk = fakeDisk();
    const queue = createPersistQueue(disk.write);

    queue.persist(bytes('v1'));
    disk.next().fail();
    await queue.idle();
    queue.persist(bytes('v2'));

    const flushed = queue.flush();
    await disk.finishAll();
    await flushed;

    expect(disk.started).toEqual(['v1', 'v2']);
    expect(disk.onDisk).toBe('v2');
    expect(queue.status()).toMatchObject({ saving: false, failed: false });
    // Nor later: the write that succeeded dropped the snapshot that failed, so closing the app
    // (flush()) cannot write it over the newer data.
    const closed = queue.flush();
    await disk.finishAll();
    await closed;
    expect(disk.started).toEqual(['v1', 'v2']);
    expect(disk.onDisk).toBe('v2');
  });

  it('flush() resolves at once when nothing is unsaved', async () => {
    const disk = fakeDisk();
    const queue = createPersistQueue(disk.write);

    await queue.flush();

    expect(queue.status()).toMatchObject({ saving: false, failed: false });
    expect(disk.started).toEqual([]);
  });

  it('flush() waits for a waiting snapshot, and rejects when that write fails', async () => {
    const disk = fakeDisk();
    const queue = createPersistQueue(disk.write);

    queue.persist(bytes('v1'));
    queue.persist(bytes('v2'));
    expect(queue.status().saving).toBe(true);
    const flushed = queue.flush();
    disk.next().finish();
    await tick();
    disk.next().fail();

    await expect(flushed).rejects.toThrow('SAVE_FAILED');
    expect(disk.started).toEqual(['v1', 'v2']);
    expect(queue.status()).toMatchObject({ saving: false, failed: true });
  });

  it('stops notifying a listener after it unsubscribes', async () => {
    const disk = fakeDisk();
    const queue = createPersistQueue(disk.write);
    const listener = vi.fn();
    queue.subscribe(listener)();

    queue.persist(bytes('v1'));
    disk.next().fail();
    await queue.idle();

    expect(listener).not.toHaveBeenCalled();
  });
});
