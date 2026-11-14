import type { PersistQueue } from '../data/persist-queue';

/** The two interface languages (ADR-0018 §1). */
export type Language = 'vi' | 'en';

/**
 * Where this machine keeps its language: the webview's storage, never the database, so importing
 * a backup or sharing the file between two machines leaves each one's choice (ADR-0018 §1).
 */
export const LANGUAGE_KEY = 'p2c.language';

/** The part of the webview's `localStorage` the language needs. */
export type LanguageStorage = Pick<Storage, 'getItem' | 'setItem'>;

// Reached inside `try`: storage can be missing or throw (private mode, blocked site data, Vitest).
const webStorage = (): LanguageStorage => window.localStorage;

/**
 * The language this machine stored, or `undefined`: nothing stored, a value not known, or
 * storage that throws. The app opens either way.
 */
export function readStoredLanguage(
  storage: () => LanguageStorage = webStorage,
): Language | undefined {
  try {
    const value = storage().getItem(LANGUAGE_KEY);
    return value === 'vi' || value === 'en' ? value : undefined;
  } catch {
    return undefined;
  }
}

/**
 * The language to show (ADR-0018 §1): Vietnamese only for VND data. Data in another currency
 * shows English, keeping what the machine stored; for VND data the stored language, else
 * Vietnamese.
 */
export function resolveLanguage(stored: Language | undefined, currency: string): Language {
  if (currency !== 'VND') return 'en';
  return stored ?? 'vi';
}

/**
 * The language of this run, set once as the i18n loads: before any module builds its labels
 * (`PERIOD_LABELS`) and before the first render. Every database is VND until the `currency` key
 * (G-04).
 */
export const LANGUAGE: Language = resolveLanguage(readStoredLanguage(), 'VND');

export interface ChangeLanguagePorts {
  /** The app's save queue (`AppData.saves`). */
  readonly saves: Pick<PersistQueue, 'flush'>;
  readonly storage?: () => LanguageStorage;
  /** Reloads the interface; the data stays as saved. */
  readonly reload?: () => void;
}

/**
 * Settings → Language (G-09; no caller before it): saves what is still waiting, a replace of the
 * data included, as closing the window does, then stores `language` and reloads the interface.
 * Labels built when a module loads (`PERIOD_LABELS`) take a language only so (ADR-0018 §1).
 * Rejects without reloading, the language stored left as it was, when a save fails (the save
 * queue's `SAVE_FAILED`) or the language cannot be stored (`LANGUAGE_NOT_STORED`).
 */
export async function changeLanguage(
  language: Language,
  { saves, storage = webStorage, reload = () => window.location.reload() }: ChangeLanguagePorts,
): Promise<void> {
  // Stored only once saved: a failed save leaves the language in use for this run and the next.
  await saves.flush();
  try {
    storage().setItem(LANGUAGE_KEY, language);
  } catch {
    throw new Error('LANGUAGE_NOT_STORED');
  }
  reload();
}
