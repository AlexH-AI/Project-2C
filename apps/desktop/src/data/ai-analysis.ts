/**
 * The app's side of an AI analysis (spec Phase 5 §3, §9.1): one runner shared by every AI button
 * (P5), the adapter and settings, and one analysis from the click to the saved row.
 */
import {
  createAiRunner,
  createMockAdapter,
  DEFAULT_AI_MODEL,
  runAnalysis,
  type AiAbortSignal,
  type AiAdapter,
  type AiErrorCode,
  type AiRunner,
  type AiSettings,
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

export interface AppAi {
  /** The one runner of the app: while it is busy, every AI button is off (P5). */
  readonly runner: AiRunner;
  readonly adapter: AiAdapter;
  /** Settings → AI, read at each click. */
  settings(): AiSettings;
  /** Gets every error the AI cannot give back to a screen (a bug); the app logs it. */
  reportError(error: unknown): void;
}

/** Until Settings → AI reads the `ai` key (T-167), the starting values of spec §4.1. */
const DEFAULT_SETTINGS: AiSettings = {
  provider: 'MOCK',
  model: DEFAULT_AI_MODEL,
  reasoning: 'DEFAULT',
};

export function createAppAi(
  options: {
    readonly reportError?: (error: unknown) => void;
    /** Tests pass a stand-in; the app uses the Mock. */
    readonly adapter?: AiAdapter;
  } = {},
): AppAi {
  const { reportError = (error: unknown) => console.error(error) } = options;
  return {
    runner: createAiRunner(reportError),
    adapter: options.adapter ?? createMockAdapter(),
    settings: () => DEFAULT_SETTINGS,
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
   * The customer or its version is gone by the answer (deleted, or the data replaced by Nạp lại /
   * Nhập backup): nothing is saved and the panel follows the data as it is now.
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
      runner: ai.runner,
      adapter: ai.adapter,
      settings: ai.settings(),
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
