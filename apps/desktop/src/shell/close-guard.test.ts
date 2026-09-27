import { describe, expect, it, vi } from 'vitest';
import { createPersistQueue } from '../data/persist-queue';
import { closeAfterSaving, type CloseChoice } from './close-guard';

const bytes = (text: string) => new TextEncoder().encode(text);
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

/** A disk whose writes the test finishes or fails one by one. */
function fakeDisk() {
  const onDisk: string[] = [];
  const pending: { finish: () => void; fail: () => void }[] = [];
  const write = (data: Uint8Array) =>
    new Promise<void>((resolve, reject) => {
      pending.push({
        finish: () => {
          onDisk.push(new TextDecoder().decode(data));
          resolve();
        },
        fail: () => reject(new Error('file locked')),
      });
    });
  return { write, onDisk, next: () => pending.shift()! };
}

/** The window side: records the close and answers the question with the queued choices. */
function fakeWindow(...choices: CloseChoice[]) {
  const events: string[] = [];
  return {
    events,
    port: {
      ask: vi.fn(() => {
        events.push('ask');
        return Promise.resolve(choices.shift()!);
      }),
      close: vi.fn(() => {
        events.push('close');
        return Promise.resolve();
      }),
    },
  };
}

describe('closeAfterSaving', () => {
  it('closes at once when everything is saved', async () => {
    const disk = fakeDisk();
    const win = fakeWindow();

    await closeAfterSaving(createPersistQueue(disk.write), win.port);

    expect(win.events).toEqual(['close']);
  });

  it('closes only after the waiting snapshot is on disk', async () => {
    const disk = fakeDisk();
    const saves = createPersistQueue(disk.write);
    const win = fakeWindow();

    saves.persist(bytes('v1'));
    const closing = closeAfterSaving(saves, win.port);
    await tick();
    expect(win.port.close).not.toHaveBeenCalled();

    disk.next().finish();
    await closing;
    expect(disk.onDisk).toEqual(['v1']);
    expect(win.events).toEqual(['close']);
  });

  it('asks instead of closing when the save fails, and closes after a successful retry', async () => {
    const disk = fakeDisk();
    const saves = createPersistQueue(disk.write);
    const win = fakeWindow('retry');

    saves.persist(bytes('v1'));
    const closing = closeAfterSaving(saves, win.port);
    disk.next().fail();
    await tick();
    await tick();
    expect(win.events).toEqual(['ask']);

    disk.next().finish();
    await closing;
    expect(disk.onDisk).toEqual(['v1']);
    expect(win.events).toEqual(['ask', 'close']);
  });

  it('closes without saving when the user chooses to discard', async () => {
    const disk = fakeDisk();
    const saves = createPersistQueue(disk.write);
    const win = fakeWindow('discard');

    saves.persist(bytes('v1'));
    const closing = closeAfterSaving(saves, win.port);
    disk.next().fail();
    await closing;

    expect(disk.onDisk).toEqual([]);
    expect(win.events).toEqual(['ask', 'close']);
  });
});
