import { notify } from '../data/listeners';

/**
 * Where this machine keeps whether customer names are masked (mockup app-shell.html `#privacy`,
 * "Có nhớ"): the webview's storage, as the language (ADR-0018 §1), never the database nor a backup.
 */
export const NAME_MASK_KEY = 'p2c.maskNames';

/** The part of the webview's `localStorage` the mask needs. */
export type MaskStorage = Pick<Storage, 'getItem' | 'setItem'>;

// Reached inside `try`: storage can be missing or throw (private mode, blocked site data, Vitest).
const webStorage = (): MaskStorage => window.localStorage;

/** The first letter or digit of a word, where it has one. */
const FIRST = /[\p{L}\p{N}]/u;

/**
 * A customer's name as the mask shows it: the first letter of each word, upper case, with its
 * marks ("Nguyễn Văn Hùng" → "N. V. H.", "ánh" → "Á."); nothing for nothing. Letters written as a
 * base and its marks count as the one letter.
 */
export function maskName(name: string): string {
  return name
    .normalize('NFC')
    .split(/\s+/u)
    .flatMap((word) => word.match(FIRST) ?? [])
    .map((letter) => `${letter.toLocaleUpperCase('vi')}.`)
    .join(' ');
}

/** Whether names are masked, for the run of the app; every screen listens to it. */
export interface NameMask {
  masked(): boolean;
  /** Masks or shows names at once, and stores it for the next run. */
  set(on: boolean): void;
  subscribe(listener: () => void): () => void;
}

/**
 * The mask, starting as this machine stored it. Storage that throws leaves names shown at first,
 * and a change kept for this run only.
 */
export function createNameMask(storage: () => MaskStorage = webStorage): NameMask {
  let on = false;
  try {
    on = storage().getItem(NAME_MASK_KEY) === 'on';
  } catch {
    // Shown: the app opens either way.
  }
  const listeners = new Set<() => void>();
  return {
    masked: () => on,
    set(next) {
      if (next === on) return;
      on = next;
      try {
        storage().setItem(NAME_MASK_KEY, next ? 'on' : 'off');
      } catch {
        // Masked or shown for this run all the same.
      }
      notify(listeners, console.error);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
  };
}
