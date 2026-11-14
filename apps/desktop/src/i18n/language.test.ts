import { describe, expect, it, vi } from 'vitest';
import { createPersistQueue } from '../data/persist-queue';
import { changeLanguage, readStoredLanguage, resolveLanguage } from './language';

/** A machine's storage holding `value` under `p2c.language` (or nothing). */
const storageWith = (value: string | null) => () => ({
  getItem: (key: string) => (key === 'p2c.language' ? value : null),
  setItem: () => {},
});

const throwingStorage = () => {
  throw new Error('SecurityError');
};

// ADR-0018 §1: stored on this machine; nothing stored → by the data's currency.
describe('resolveLanguage', () => {
  it('follows the currency while nothing is stored', () => {
    expect(resolveLanguage(undefined, 'VND')).toBe('vi');
    expect(resolveLanguage(undefined, 'USD')).toBe('en');
  });

  it('shows English for data not in VND, whatever the machine stored', () => {
    expect(resolveLanguage('vi', 'USD')).toBe('en');
    expect(resolveLanguage('en', 'VND')).toBe('en');
    expect(resolveLanguage('vi', 'VND')).toBe('vi');
  });
});

describe('readStoredLanguage', () => {
  it('reads the language stored under p2c.language', () => {
    expect(readStoredLanguage(storageWith('en'))).toBe('en');
    expect(readStoredLanguage(storageWith('vi'))).toBe('vi');
  });

  it('reads nothing stored, or a value it does not know, as nothing stored', () => {
    expect(readStoredLanguage(storageWith(null))).toBeUndefined();
    expect(readStoredLanguage(storageWith('fr'))).toBeUndefined();
  });

  it('reads storage that throws as nothing stored, so the currency decides', () => {
    expect(readStoredLanguage(throwingStorage)).toBeUndefined();
    const getItemThrows = () => ({
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {},
    });
    expect(resolveLanguage(readStoredLanguage(getItemThrows), 'VND')).toBe('vi');
    expect(resolveLanguage(readStoredLanguage(getItemThrows), 'USD')).toBe('en');
  });
});

/** A storage that keeps what is set, as the webview's does. */
function memoryStorage(initial: Record<string, string> = {}) {
  const items = new Map(Object.entries(initial));
  return {
    items,
    port: () => ({
      getItem: (key: string) => items.get(key) ?? null,
      setItem: (key: string, value: string) => void items.set(key, value),
    }),
  };
}

/** A save queue whose writes wait until the test settles them, one by one. */
function savingQueue() {
  const writes: { resolve: () => void; reject: (error: Error) => void }[] = [];
  const saves = createPersistQueue(
    () => new Promise<void>((resolve, reject) => void writes.push({ resolve, reject })),
  );
  return { saves, writes };
}

// Lets every promise waiting on a settled one go on.
const settle = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

// ADR-0018 §1: the labels built when a module loads take the new language only on a reload.
describe('changeLanguage', () => {
  it('stores the language and reloads once the save running is on disk', async () => {
    const { saves, writes } = savingQueue();
    const storage = memoryStorage({ 'p2c.language': 'vi' });
    const reload = vi.fn();
    saves.persist(new Uint8Array([1]));

    const changed = changeLanguage('en', { saves, storage: storage.port, reload });
    await settle();
    expect(reload).not.toHaveBeenCalled();

    writes[0]?.resolve();
    await changed;
    expect(storage.items.get('p2c.language')).toBe('en');
    expect(reload).toHaveBeenCalledOnce();
  });

  it('reloads at once when nothing waits to be saved', async () => {
    const { saves } = savingQueue();
    const storage = memoryStorage();
    const reload = vi.fn();

    await changeLanguage('vi', { saves, storage: storage.port, reload });
    expect(storage.items.get('p2c.language')).toBe('vi');
    expect(reload).toHaveBeenCalledOnce();
  });

  // Mockup ngon-ngu-tien-te.html, Cài đặt → Ngôn ngữ with changes not saved: not reloaded, and
  // the language stays the one in use, on this run and the next.
  it('neither reloads nor stores the language when a save fails', async () => {
    const { saves, writes } = savingQueue();
    const storage = memoryStorage({ 'p2c.language': 'vi' });
    const reload = vi.fn();
    saves.persist(new Uint8Array([1]));

    const changed = changeLanguage('en', { saves, storage: storage.port, reload });
    writes[0]?.reject(new Error('DISK_FULL'));
    await expect(changed).rejects.toThrow('SAVE_FAILED');
    expect(storage.items.get('p2c.language')).toBe('vi');
    expect(reload).not.toHaveBeenCalled();
  });

  it('does not reload when the language cannot be stored', async () => {
    const { saves } = savingQueue();
    const reload = vi.fn();
    const full = () => ({
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    });

    await expect(changeLanguage('en', { saves, storage: full, reload })).rejects.toThrow(
      'LANGUAGE_NOT_STORED',
    );
    expect(reload).not.toHaveBeenCalled();
  });
});
