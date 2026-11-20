import { describe, expect, it, vi } from 'vitest';
import { createNameMask, maskName, NAME_MASK_KEY, type MaskStorage } from './name-mask';

/** A machine's webview storage, kept in a map: two stores on one stand for two runs of the app. */
function fakeStorage(): () => MaskStorage {
  const kept = new Map<string, string>();
  const storage: MaskStorage = {
    getItem: (key) => kept.get(key) ?? null,
    setItem: (key, value) => void kept.set(key, value),
  };
  return () => storage;
}

const throwing = (): MaskStorage => {
  throw new Error('SecurityError');
};

// app-shell.html #privacy: the first letter of each word, the code of a customer left alone.
describe('maskName', () => {
  it('keeps the first letter of each word, upper case, with its marks', () => {
    expect(maskName('Nguyễn Văn Hùng')).toBe('N. V. H.');
    expect(maskName('Đỗ Khánh Linh')).toBe('Đ. K. L.');
    expect(maskName('ánh')).toBe('Á.');
    expect(maskName('Ông Ích Ưng')).toBe('Ô. Í. Ư.');
  });

  it('reads letters typed as a base and its marks as the one letter they write', () => {
    expect(maskName('Ánh Đỗ')).toBe('Á. Đ.');
  });

  it('leaves out the spaces around and between the words', () => {
    expect(maskName('  Trịnh   Minh\tAnh \n')).toBe('T. M. A.');
  });

  it('writes a name of one word as one letter, and nothing as nothing', () => {
    expect(maskName('Linh')).toBe('L.');
    expect(maskName('')).toBe('');
    expect(maskName('   ')).toBe('');
  });

  it('gives two customers with the same first letters the same short form', () => {
    // Told apart by their codes, which are not masked (Phạm Gia Long, Phan Gia Lộc).
    expect(maskName('Phạm Gia Long')).toBe(maskName('Phan Gia Lộc'));
  });

  it('skips what holds no letter or digit, and starts a word at its first letter', () => {
    expect(maskName('Lê - (Văn) Tám')).toBe('L. V. T.');
  });
});

describe('createNameMask', () => {
  it('starts unmasked on a machine that stored nothing', () => {
    expect(createNameMask(fakeStorage()).masked()).toBe(false);
  });

  it('remembers a change for the next run of the app', () => {
    const storage = fakeStorage();
    createNameMask(storage).set(true);
    expect(storage().getItem(NAME_MASK_KEY)).toBe('on');
    const next = createNameMask(storage);
    expect(next.masked()).toBe(true);
    next.set(false);
    expect(createNameMask(storage).masked()).toBe(false);
  });

  it('tells its listeners of a change, once, and not of a change to what it was', () => {
    const mask = createNameMask(fakeStorage());
    const heard = vi.fn();
    const leave = mask.subscribe(heard);
    mask.set(true);
    mask.set(true);
    expect(heard).toHaveBeenCalledTimes(1);
    leave();
    mask.set(false);
    expect(heard).toHaveBeenCalledTimes(1);
  });

  it('keeps working on storage that throws: unmasked at first, a change kept for this run', () => {
    const mask = createNameMask(throwing);
    expect(mask.masked()).toBe(false);
    mask.set(true);
    expect(mask.masked()).toBe(true);
  });

  it('reads a value it does not know as unmasked', () => {
    const storage = fakeStorage();
    storage().setItem(NAME_MASK_KEY, 'yes');
    expect(createNameMask(storage).masked()).toBe(false);
  });
});
