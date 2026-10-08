/**
 * The app's side of the AI (spec Phase 5 §3, §4, §9.1): one runner shared by every AI button (P5),
 * Settings → AI stored in the `settings` row `ai`, the adapter of the chosen provider, and one
 * analysis from the click to the saved row.
 */
import {
  createAiRunner,
  createMockAdapter,
  readAiSettings,
  runAnalysis,
  type AiAbortSignal,
  type AiAdapter,
  type AiErrorCode,
  type AiRunner,
  type AiSettings,
  type StoredAiSettings,
} from '@p2c/ai';
import {
  DbError,
  getKycProfile,
  listKycVersions,
  recordAiAnalysis,
  type Database,
  type DbErrorCode,
} from '@p2c/db';
import type { CalendarDate, KycGateState } from '@p2c/domain';
import type { OpenCodeClient } from './ai-tauri';

/** What one AI request runs with, read at the click. */
export interface AiCall {
  readonly runner: AiRunner;
  readonly adapter: AiAdapter;
  readonly settings: AiSettings;
}

export interface AppAi {
  /** The one runner of the app: while it is busy, every AI button is off (P5). */
  readonly runner: AiRunner;
  /** OpenCode through Rust (key, calls); `undefined` in web mode, where OpenCode is off (§4.1). */
  readonly opencode: OpenCodeClient | undefined;
  /** Settings → AI as stored, with why it fell back to the defaults (mockup ai.html 1g). */
  stored(): StoredAiSettings;
  /** The settings a request runs with: the stored ones, but always the Mock in web mode. */
  settings(): AiSettings;
  /** Saves Settings → AI; never the key, which only Rust keeps. */
  save(settings: AiSettings): void;
  /** The runner, the settings and the adapter of their provider (and plan). */
  call(): AiCall;
  /** Gets every error the AI cannot give back to a screen (a bug); the app logs it. */
  reportError(error: unknown): void;
}

/** Where Settings → AI is kept: the `settings` row `ai`, which goes into the backup. */
export interface AiSettingsStore {
  read(): string | undefined;
  write(settings: AiSettings): void;
}

export interface AppAiOptions {
  readonly reportError?: (error: unknown) => void;
  /** The exe passes Rust's OpenCode commands; web mode has none. */
  readonly opencode?: OpenCodeClient;
  /** Tests pass a stand-in for every provider. */
  readonly adapter?: AiAdapter;
}

export function createAppAi(store: AiSettingsStore, options: AppAiOptions = {}): AppAi {
  const { reportError = (error: unknown) => console.error(error), opencode } = options;
  const runner = createAiRunner(reportError);
  const mock = createMockAdapter();
  const stored = () => readAiSettings(store.read());
  const settings = (): AiSettings => {
    const { settings: chosen } = stored();
    return opencode ? chosen : { ...chosen, provider: 'MOCK' };
  };
  return {
    runner,
    opencode,
    stored,
    settings,
    save: (next) => store.write(next),
    call() {
      const chosen = settings();
      const adapter =
        options.adapter ??
        (chosen.provider === 'MOCK' || !opencode ? mock : opencode.adapter(chosen.opencodePlan));
      return { runner, adapter, settings: chosen };
    },
    reportError,
  };
}

export type AnalysisOutcome =
  | { readonly kind: 'saved'; readonly status: 'ACCEPTED' | 'REJECTED' }
  /** The gate changed between showing the button and the click: its sentence, not an error. */
  | { readonly kind: 'blocked'; readonly state: KycGateState }
  /** §5.3 message and Thử lại; `AI_BUSY` too. */
  | { readonly kind: 'error'; readonly code: AiErrorCode }
  /** Hủy: the panel goes back to how it was. */
  | { readonly kind: 'cancelled' }
  /**
   * The customer is gone: already deleted at the click (no AI called), or it or its version is
   * gone by the answer (deleted, or the data replaced by Nạp lại / Nhập backup). Nothing is saved
   * and the panel follows the data as it is now.
   */
  | { readonly kind: 'discarded' }
  /** A bug, or the save was refused: the panel shows the general message. */
  | { readonly kind: 'failed' };

/** What an analysis needs of `AppData` (named here, as `app-data` imports this module). */
export interface AnalysisApp {
  readonly ai: AppAi;
  db(): Database;
  run<T>(command: (db: Database) => T): T;
  today(): CalendarDate;
}

/** The refusals of the save when what was analysed is no longer there: a user's doing, not a bug. */
const GONE: readonly DbErrorCode[] = ['CUSTOMER_NOT_FOUND', 'KYC_VERSION_NOT_FOUND'];

/**
 * One click on Phân tích. The latest KYC version and its facts are read together, at once, so the
 * result is tied to the version the RE saw (§3 item 2); a change while it runs leaves it STALE.
 */
export async function analyseCustomer(
  app: AnalysisApp,
  customerId: string,
  signal?: AiAbortSignal,
): Promise<AnalysisOutcome> {
  const { ai } = app;
  try {
    const db = app.db();
    const { facts } = getKycProfile(db, customerId);
    const version = listKycVersions(db, customerId).at(-1);
    // No version means no facts confirmed yet: nothing for the gate to let through.
    if (!version) return { kind: 'blocked', state: 'KYC_INSUFFICIENT' };
    const result = await runAnalysis({
      ...ai.call(),
      customerId,
      kycVersionId: version.id,
      profile: { facts },
      today: app.today(),
      signal,
    });
    if (result.kind !== 'record') return result;
    const saved = app.run((d) => recordAiAnalysis(d, result.row));
    return { kind: 'saved', status: saved.status };
  } catch (error) {
    if (error instanceof DbError && GONE.includes(error.code)) return { kind: 'discarded' };
    ai.reportError(error);
    return { kind: 'failed' };
  }
}
