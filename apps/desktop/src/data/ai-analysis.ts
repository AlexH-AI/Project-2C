/**
 * The app's side of the AI (spec Phase 5 §3, §4, §9.1): one runner shared by every AI button (P5),
 * Settings → AI stored in the `settings` row `ai`, the adapter of the chosen provider, and one
 * analysis from the click to the saved row.
 */
import {
  checkWebAnswer,
  createAiRunner,
  createMockAdapter,
  readAiSettings,
  runAnalysis,
  runExtraction,
  startWebAnalysis,
  type AiAbortSignal,
  type AiAdapter,
  type AiErrorCode,
  type AiRunner,
  type AiSettings,
  type AnalysisRow,
  type ExtractedFact,
  type StoredAiSettings,
  type ValidationIssue,
  type WebAnalysisRequest,
  type WebSession,
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
import { createAiJobs, type AiJobs } from './ai-jobs';
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
  /** The runs the screens started, kept while the screen that started one is left. */
  readonly jobs: AiJobs;
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
  /** The clipboard and the browser of ChatGPT web (§3.1). */
  readonly web: WebTools;
}

/** The only page ChatGPT web opens (§5.4): no data in the URL, no unofficial parameter. */
export const CHATGPT_URL = 'https://chatgpt.com/';

/** What ChatGPT web does outside the webview; each says whether it worked, never throws. */
export interface WebTools {
  copy(text: string): Promise<boolean>;
  openChatGpt(): Promise<boolean>;
}

function webTools(opencode: OpenCodeClient | undefined): WebTools {
  return {
    copy: (text) =>
      navigator.clipboard.writeText(text).then(
        () => true,
        () => false,
      ),
    openChatGpt: () => {
      if (opencode) return opencode.openChatGpt();
      // `noopener` makes `open` return null whether it opened or not: nothing to read back.
      window.open(CHATGPT_URL, '_blank', 'noopener');
      return Promise.resolve(true);
    },
  };
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
  /** Tests pass a stand-in clipboard and browser. */
  readonly web?: WebTools;
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
    jobs: createAiJobs(runner, reportError),
    opencode,
    stored,
    settings,
    // Only the four fields: a form object may carry more (the key), which must not reach the backup.
    save: ({ provider, opencodePlan, model, reasoning }) =>
      store.write({ provider, opencodePlan, model, reasoning }),
    call() {
      const chosen = settings();
      const adapter =
        options.adapter ??
        (chosen.provider === 'OPENCODE_GO' && opencode
          ? opencode.adapter(chosen.opencodePlan)
          : mock);
      return { runner, adapter, settings: chosen };
    },
    reportError,
    web: options.web ?? webTools(opencode),
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
  try {
    const taken = takeProfile(app, customerId);
    if ('kind' in taken) return taken;
    const result = await runAnalysis({ ...app.ai.call(), ...taken, signal });
    if (result.kind !== 'record') return result;
    return save(app, result.row);
  } catch (error) {
    return lost(app, error);
  }
}

/**
 * The input of an analysis: the latest KYC version and its facts, read together, at once. No
 * version means no facts confirmed yet: nothing for the gate to let through.
 */
function takeProfile(
  app: AnalysisApp,
  customerId: string,
): WebAnalysisRequest | { readonly kind: 'blocked'; readonly state: 'KYC_INSUFFICIENT' } {
  const db = app.db();
  const { facts } = getKycProfile(db, customerId);
  const version = listKycVersions(db, customerId).at(-1);
  if (!version) return { kind: 'blocked', state: 'KYC_INSUFFICIENT' };
  return { customerId, kycVersionId: version.id, profile: { facts }, today: app.today() };
}

function save(app: AnalysisApp, row: AnalysisRow) {
  const saved = app.run((d) => recordAiAnalysis(d, row));
  return { kind: 'saved', status: saved.status } as const;
}

function lost(app: AnalysisApp, error: unknown) {
  if (error instanceof DbError && GONE.includes(error.code)) return { kind: 'discarded' } as const;
  app.ai.reportError(error);
  return { kind: 'failed' } as const;
}

export type ExtractionOutcome =
  /** Proposals for the RE to confirm or drop, never saved (§8 item 4). */
  | { readonly kind: 'facts'; readonly facts: readonly ExtractedFact[] }
  /** V1 failed twice: "AI trả kết quả không đọc được" (§8 item 5). */
  | { readonly kind: 'invalid' }
  | Extract<AnalysisOutcome, { kind: 'error' | 'cancelled' | 'failed' }>;

/** One click on AI trích xuất: the note as the RE wrote it goes to the AI (§6.1), nothing is saved. */
export async function extractFromNote(
  ai: AppAi,
  note: string,
  signal?: AiAbortSignal,
): Promise<ExtractionOutcome> {
  try {
    const result = await runExtraction({ ...ai.call(), note, signal });
    switch (result.kind) {
      case 'facts':
        return { kind: 'facts', facts: result.facts };
      case 'error':
        return { kind: 'error', code: result.code };
      default:
        return result;
    }
  } catch (error) {
    ai.reportError(error);
    return { kind: 'failed' };
  }
}

export type WebStartOutcome =
  /**
   * A session for the panel to keep (§3.1 item 4) and the message to paste. `copied` false: show
   * it to copy by hand (mockup 4f); `opened` false: `AI_OPEN_BROWSER` (4c). The session goes on.
   */
  | {
      readonly kind: 'session';
      readonly session: WebSession;
      readonly message: string;
      /** When the input was taken, by the database's clock (mockup 4e "chụp dd/mm hh:mm"). */
      readonly takenAt: Date;
      readonly copied: boolean;
      readonly opened: boolean;
    }
  | Extract<AnalysisOutcome, { kind: 'blocked' | 'discarded' | 'failed' }>;

/**
 * One click on Phân tích bằng ChatGPT web: the input is taken now, as for Phân tích; the message is
 * copied, then chatgpt.com opened. No AI request is held (§3.1 item 5) and nothing is saved.
 */
export async function startChatGptWeb(
  app: AnalysisApp,
  customerId: string,
): Promise<WebStartOutcome> {
  try {
    const taken = takeProfile(app, customerId);
    if ('kind' in taken) return taken;
    const takenAt = app.db().now();
    const started = startWebAnalysis(taken);
    if (started.kind !== 'session') return started;
    const copied = await app.ai.web.copy(started.message);
    const opened = await app.ai.web.openChatGpt();
    return { ...started, takenAt, copied, opened };
  } catch (error) {
    return lost(app, error);
  }
}

export type WebAnswerOutcome =
  /** Not an attempt (§3.1 item 3): the error at the paste box, or the button off when blank. */
  | { readonly kind: 'unusable'; readonly reason: 'EMPTY' | 'TOO_LONG' }
  /** Mockup 4g: the issues, "Copy yêu cầu sửa" copies `retryMessage`; go on with `session`. */
  | {
      readonly kind: 'retry';
      readonly session: WebSession;
      readonly issues: readonly ValidationIssue[];
      readonly retryMessage: string;
    }
  | Extract<AnalysisOutcome, { kind: 'saved' | 'discarded' | 'failed' }>;

/** Kiểm tra và lưu: checks the pasted answer and saves the row once the session is over. */
export function saveChatGptAnswer(
  app: AnalysisApp,
  session: WebSession,
  pasted: string,
): WebAnswerOutcome {
  try {
    const result = checkWebAnswer(session, pasted);
    return result.kind === 'record' ? save(app, result.row) : result;
  } catch (error) {
    return lost(app, error);
  }
}
