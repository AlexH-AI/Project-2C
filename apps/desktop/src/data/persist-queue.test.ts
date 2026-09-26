import { describe, expect, it, vi } from 'vitest';
import { createPersistQueue } from './persist-queue';

/** A fake file: each write resolves when the test releases it. */
function fakeDisk() {
  let onDisk: string | undefined;
  let inFlight = 0;
  let maxInFlight = 0;
  const started: string[] = [];
  const pending: { finish: () => void; fail: () => void }[] = [];
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
        fail: () => {
          inFlight--;
          reject(new Error('disk full'));
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
  };
}

const bytes = (text: string) => new TextEncoder().encode(text);
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

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

  it('reports a failed write and clears it after the next successful write', async () => {
    const disk = fakeDisk();
    const queue = createPersistQueue(disk.write);
    const listener = vi.fn();
    queue.subscribe(listener);

    queue.persist(bytes('v1'));
    disk.next().fail();
    await queue.idle();
    expect(queue.failed()).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);

    // The data stays in memory; the next save writes the whole file again.
    queue.persist(bytes('v2'));
    disk.next().finish();
    await queue.idle();
    expect(queue.failed()).toBe(false);
    expect(listener).toHaveBeenCalledTimes(2);
    expect(disk.onDisk).toBe('v2');
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
