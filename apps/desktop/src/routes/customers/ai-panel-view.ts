/**
 * The KYC Intelligence panel of the customer profile (spec Phase 5 §9.1, mockups ai.html §2 and
 * customer.html). Pure, so the panel only lays it out.
 */
import {
  AI_MODELS,
  ANALYSIS_PROMPTS,
  WEB_WRAPPER,
  analysisInputSchema,
  analysisOutputSchema,
  discoveryOutputSchema,
  factCode,
  VALIDATION_CODES,
  type AiOpencodePlan,
  type AiSettings,
  type DiscoveryOutput,
  type PERSONALITY_SYSTEMS,
  type ValidationCode,
  type ValidationIssue,
  type WebSession,
} from '@p2c/ai';
import type { AiAnalysisReminder, AiAnalysisView, KycFactRecord, KycVersionRecord } from '@p2c/db';
import {
  evidenceLevel,
  formatDayMonth,
  formatLocalDateTime,
  fromIsoDate,
  fromLocalDate,
  KYC_GATE_THRESHOLDS,
  type CalendarDate,
  type Evidence,
  type KycCategory,
  type KycFact,
  type KycField,
  type KycGateResult,
  type KycGateState,
} from '@p2c/domain';
import type { AnalysisOutcome, WebAnswerOutcome } from '../../data/ai-analysis';
import { aiFailure, GENERAL_FAILURE, type AiFailure } from '../ai-error-view';
import { factInEffect } from './kyc-view';

/** What naming "kyc v<seq>" needs of the customer's versions. */
export type VersionRef = Pick<KycVersionRecord, 'id' | 'seq'>;

export type AiPanelBlocked =
  /** Mockup 2b: "Giải quyết mâu thuẫn ở <trường> trước khi phân tích". */
  | { readonly state: 'CONFLICT_RESOLUTION'; readonly fields: readonly KycField[] }
  /** Mockup 2c: "Cần chăm sóc, KYC thêm thông tin khách hàng. Còn thiếu: <hạng mục tối thiểu>". */
  | { readonly state: 'KYC_INSUFFICIENT'; readonly categories: readonly KycCategory[] };

export interface AiPanelView {
  /** Set when the gate lets no AI through: the button is off and nothing is called (P2). */
  readonly blocked: AiPanelBlocked | null;
  /** The head badge: the shown analysis's state, else the gate. */
  readonly badge: 'CURRENT' | 'STALE' | KycGateState;
  /** The latest ACCEPTED analysis, CURRENT or STALE; a REJECTED row is never shown as a result. */
  readonly shown: AiAnalysisView | null;
  /** Mockup 2j: an older ACCEPTED analysis picked in the history, shown faded in place of `shown`. */
  readonly viewing: AiAnalysisView | null;
  /** Mockup 2h: why the shown analysis is STALE, while the gate allows analysing again. */
  readonly reminder: AiAnalysisReminder | null;
  /** Mockup 2i: the latest analysis was REJECTED, after the latest ACCEPTED one. */
  readonly rejected: {
    readonly date: CalendarDate;
    /** The first issue of its last attempt; null when the report cannot be read. */
    readonly issue: AiPanelIssue | null;
  } | null;
  /**
   * The buttons are off only because an AI request runs elsewhere: another customer's, AI trích
   * xuất or Kiểm tra kết nối. The panel says so, as Settings → AI does (DR5-40).
   */
  readonly busyElsewhere: boolean;
  /**
   * `again`: "Phân tích lại" once there is an analysis to replace. Phân tích bằng ChatGPT web
   * follows `enabled` too (mockup 4d), never as the main button.
   */
  readonly button: {
    readonly again: boolean;
    readonly primary: boolean;
    readonly enabled: boolean;
  };
}

export function aiPanelView(input: {
  readonly gate: KycGateResult;
  /** `listAiAnalyses`: latest first. */
  readonly analyses: readonly AiAnalysisView[];
  /** The app's one AI runner is busy (P5): every AI button is off. */
  readonly busy: boolean;
  /** This customer's ChatGPT web session is open: its AI buttons are off (§3.1 item 4). */
  readonly webOpen?: boolean;
  /** The id of the history row picked to see; only an older ACCEPTED one shows apart. */
  readonly viewing?: string | null;
  /** The panel's own Phân tích runs, which says "Đang phân tích…" itself. */
  readonly running?: boolean;
  /** The mode of the input the open web session took: the head badge follows it (§9.1, 4e). */
  readonly webMode?: WebSession['input']['mode'] | null;
}): AiPanelView {
  const { gate, analyses, busy, webOpen = false, running = false, webMode = null } = input;
  const blocked = blockedBy(gate);
  const shown = analyses.find((analysis) => analysis.status === 'ACCEPTED') ?? null;
  const picked = analyses.find((analysis) => analysis.id === input.viewing);
  const latest = analyses[0];
  const enabled = !blocked && !busy && !webOpen;
  return {
    blocked,
    badge: webMode
      ? MODE_GATES[webMode]
      : shown && !blocked
        ? shown.state === 'CURRENT'
          ? 'CURRENT'
          : 'STALE'
        : gate.state,
    shown,
    viewing: picked?.status === 'ACCEPTED' && picked !== shown ? picked : null,
    reminder: blocked ? null : (shown?.reminder ?? null),
    // Like the reminder, never beside the sentence of a blocked gate (review of PR 459).
    rejected:
      !blocked && latest?.status === 'REJECTED'
        ? { date: latest.date, issue: firstIssue(latest) }
        : null,
    busyElsewhere: busy && !blocked && !running && !webOpen,
    button: {
      again: shown !== null && !blocked,
      primary: !blocked && !webOpen && shown?.state !== 'CURRENT',
      enabled,
    },
  };
}

const MODE_GATES = {
  analysis: 'PAIN_POINT_ANALYSIS',
  discovery: 'PROFILE_DISCOVERY',
} as const satisfies Record<WebSession['input']['mode'], KycGateState>;

/**
 * The help line under "Chưa có phân tích AI" (mockups 2a, 4d): how many facts Phân tích sends and
 * where, as Settings → AI say now.
 */
export type AiPanelHelp = { readonly count: number } & (
  | { readonly provider: 'MOCK' }
  | { readonly provider: 'OPENCODE_GO'; readonly plan: AiOpencodePlan; readonly model: string }
);

export function aiPanelHelp(
  facts: readonly Pick<KycFact, 'status'>[],
  settings: AiSettings,
): AiPanelHelp {
  // What `buildAnalysisInput` sends: every fact still in effect, a conflicting one too.
  const count = facts.filter((fact) => fact.status !== 'superseded').length;
  return settings.provider === 'MOCK'
    ? { count, provider: 'MOCK' }
    : {
        count,
        provider: 'OPENCODE_GO',
        plan: settings.opencodePlan,
        model: modelLabel(settings.model),
      };
}

/** One validator issue as the panel lists it (mockups 2k, 4g): "V3 · Behavioral Hypotheses #1: …". */
export interface AiPanelIssue {
  readonly code: ValidationCode;
  /** The block and, for an element, its number from 1; null for the whole output. */
  readonly place: { readonly key: AiPanelIssuePlace; readonly number: number | null } | null;
  /** The validator's words; null for an answer with no JSON, which the panel says itself. */
  readonly detail: string | null;
}

export type AiPanelIssuePlace = AiPanelGroupKey | 'personalityNotes';

const ISSUE_PLACES: readonly string[] = [
  'hypotheses',
  'needs',
  'painPoints',
  'themes',
  'discoveryStrategy',
  'nextBestActions',
  'personalityNotes',
] satisfies AiPanelIssuePlace[];

/** @param noJson The answer had no JSON block: its one issue is V1 on the whole output. */
export function issueLine(issue: ValidationIssue, noJson: boolean): AiPanelIssue {
  const { code, path, detail } = issue;
  if (noJson && code === 'V1' && path === '$') return { code, place: null, detail: null };
  const [, key = '', index] = /^(\w+)(?:\[(\d+)\])?/.exec(path) ?? [];
  if (!ISSUE_PLACES.includes(key)) {
    return { code, place: null, detail: path === '$' ? detail : `${path}: ${detail}` };
  }
  const number = index === undefined ? null : Number(index) + 1;
  return { code, place: { key: key as AiPanelIssuePlace, number }, detail };
}

/** The first issue of the last attempt of a REJECTED row. */
function firstIssue(row: AiAnalysisView): AiPanelIssue | null {
  return attemptReports(row).at(-1)?.issues[0] ?? null;
}

/** The issues of one attempt of a REJECTED row (mockup 2k). */
export interface AiAttemptReport {
  readonly attempt: number;
  readonly issues: readonly AiPanelIssue[];
}

/** An issue as the validator writes it; a backup may hold anything else (DR5-35). */
function isIssue(issue: unknown): issue is ValidationIssue {
  if (typeof issue !== 'object' || issue === null) return false;
  const { code, path, detail } = issue as Record<string, unknown>;
  return (
    (VALIDATION_CODES as readonly unknown[]).includes(code) &&
    typeof path === 'string' &&
    typeof detail === 'string'
  );
}

/**
 * The validator report of each attempt, as `analysisOutcome` stores it; a report it cannot read
 * lists nothing. Only the last attempt's output is kept: an earlier one had no JSON when its one
 * issue is V1 on the whole output, the way the validator reports a missing block.
 */
function attemptReports(row: AiAnalysisView): AiAttemptReport[] {
  if (!Array.isArray(row.validator)) return [];
  const stored: unknown[] = row.validator;
  return stored.flatMap((report, index) => {
    const { attempt, errors } = (report ?? {}) as { attempt?: unknown; errors?: unknown };
    if (typeof attempt !== 'number' || !Array.isArray(errors)) return [];
    const issues = errors.filter(isIssue);
    const noJson =
      index === stored.length - 1
        ? row.output === null
        : issues.length === 1 && issues[0]!.code === 'V1' && issues[0]!.path === '$';
    return [{ attempt, issues: issues.map((issue) => issueLine(issue, noJson)) }];
  });
}

function blockedBy(gate: KycGateResult): AiPanelBlocked | null {
  if (gate.state === 'CONFLICT_RESOLUTION') {
    return { state: gate.state, fields: gate.coreConflictFields };
  }
  if (gate.state === 'KYC_INSUFFICIENT') {
    // What blocks the gate: the minimum hạng mục still missing, not every one (mockup 2c).
    const needed: readonly KycCategory[] = KYC_GATE_THRESHOLDS.minimumCategories;
    const categories = gate.missingCategories.filter((category) => needed.includes(category));
    return { state: gate.state, categories };
  }
  return null;
}

/** The panel's own click on Phân tích, until it ends. */
export type AiPanelRun =
  | { readonly phase: 'idle' }
  | { readonly phase: 'running' }
  /** Hủy given while the request still runs in Rust (§5.2). */
  | { readonly phase: 'cancelling' }
  /** Mockup 2f: the §5.3 message, with its HTTP status (2l), and Thử lại; nothing was saved. */
  | { readonly phase: 'error'; readonly error: AiFailure };

/** Where a run the app keeps is (`AiJobs`): none for the key, running, or cancelled. */
export type AiJobPhase = 'idle' | 'running' | 'cancelling';

const IDLE: AiPanelRun = { phase: 'idle' };

/**
 * Where the panel goes once `analyseCustomer` ends. A save goes back to idle: the panel shows what
 * `listAiAnalyses` reads again, never what the outcome says was saved, as the data may have been
 * replaced meanwhile (review of PR 437). A blocked gate is read again too, so its sentence shows.
 * After Hủy the job says "Đang hủy…" until the request ends; then the panel is back as it was.
 */
export function runAfter(outcome: AnalysisOutcome): AiPanelRun {
  switch (outcome.kind) {
    case 'error':
      return { phase: 'error', error: aiFailure(outcome) };
    case 'failed':
      return { phase: 'error', error: GENERAL_FAILURE };
    case 'cancelled':
    case 'saved':
    case 'blocked':
    case 'discarded':
      return IDLE;
    default:
      return outcome satisfies never;
  }
}

/** The job while the app keeps it, also on a profile shown again; then how it ended. */
export function panelRun(job: AiJobPhase, ended: AnalysisOutcome | null): AiPanelRun {
  if (job !== 'idle') return { phase: job };
  return ended ? runAfter(ended) : IDLE;
}

/**
 * What the panel tells a screen reader once a run or a web session ends (DR5-33): the row it saved,
 * the web session's when both are there, as it is the later one. Null when nothing was saved.
 */
export function panelDone(
  ended: AnalysisOutcome | null,
  web: WebAnswerOutcome | null,
): 'ACCEPTED' | 'REJECTED' | null {
  if (web) return web.kind === 'saved' ? web.status : null;
  return ended?.kind === 'saved' ? ended.status : null;
}

/** This customer's ChatGPT web session, kept by the panel only, never stored (§3.1 item 4). */
export interface AiPanelWeb {
  readonly session: WebSession;
  readonly message: string;
  readonly takenAt: Date;
  /** The text a copy failed on, shown read-only to copy by hand (mockup 4f). */
  readonly manual: string | null;
  /** `AI_OPEN_BROWSER` (4c): the session goes on. */
  readonly openFailed: boolean;
  /** Mockup 4g: the first paste was wrong; "Copy yêu cầu sửa" copies `message`. */
  readonly retry: { readonly issues: readonly AiPanelIssue[]; readonly message: string } | null;
  /**
   * The paste refused at the box, no attempt counted: over 20 000 characters (mockup 4h), or the
   * app's own message pasted back (DR5-49).
   */
  readonly refused: 'TOO_LONG' | 'OWN_MESSAGE' | null;
  /** A bug on Kiểm tra và lưu: the general message; the paste stays to try again. */
  readonly failed: boolean;
}

/** The session opened by a click (`kind: 'session'` of `startChatGptWeb`). */
export function webOpened(started: {
  readonly session: WebSession;
  readonly message: string;
  readonly takenAt: Date;
  readonly copied: boolean;
  readonly opened: boolean;
}): AiPanelWeb {
  const { session, message, takenAt, copied, opened } = started;
  const manual = copied ? null : message;
  const fresh = { retry: null, refused: null, failed: false };
  return { session, message, takenAt, manual, openFailed: !opened, ...fresh };
}

/** Where the session goes after Kiểm tra và lưu: null once saved or discarded, it is over. */
export function webAfter(web: AiPanelWeb, outcome: WebAnswerOutcome): AiPanelWeb | null {
  switch (outcome.kind) {
    case 'unusable':
      return { ...web, refused: outcome.reason === 'EMPTY' ? null : outcome.reason, failed: false };
    case 'retry': {
      const noJson = outcome.session.attempts.at(-1)!.parsed === null;
      // The first message left to copy by hand would be pasted into the same chat (review of PR 459).
      return {
        ...web,
        session: outcome.session,
        manual: null,
        retry: {
          issues: outcome.issues.map((issue) => issueLine(issue, noJson)),
          message: outcome.retryMessage,
        },
        refused: null,
        failed: false,
      };
    }
    case 'failed':
      return { ...web, refused: null, failed: true };
    default:
      return null;
  }
}

/** Mockup 4e: "kyc v<n> · <mode>@<n>+web@1 · chụp dd/mm hh:mm" of the input taken. */
export function webChip(web: AiPanelWeb, versions: readonly VersionRef[]) {
  const { mode } = web.session.input;
  return {
    version: versionNumber(web.session, versions),
    prompt: `${ANALYSIS_PROMPTS[mode].version}+${WEB_WRAPPER.version}`,
    at: dayAndTime(web.takenAt),
  };
}

// ---- one analysis -------------------------------------------------------------

type PersonalitySystem = (typeof PERSONALITY_SYSTEMS)[number];

/** One element of the output: its text, the facts it cites with their level, or a missing hạng mục. */
export interface AiPanelItem {
  readonly text: string;
  /** Only in "Thông tin tham khảo" (P6). */
  readonly system: PersonalitySystem | null;
  /** `F{seq}` codes cited. */
  readonly codes: readonly string[];
  readonly missing: KycCategory | null;
  /** Null when no fact is cited: "Hạng mục còn thiếu" alone, no level (§6.3 item 4). */
  readonly evidence: Evidence | null;
}

export type AiPanelGroupKey =
  'hypotheses' | 'needs' | 'painPoints' | 'themes' | 'discoveryStrategy' | 'nextBestActions';

/** The sub-labelled groups of Needs · Pain points · Opportunity Themes. */
export type AiPanelSubgroup = 'needs' | 'painPoints' | 'themes';

/** A heading of the panel; Needs · Pain points · Opportunity Themes has three sub-labelled groups. */
export interface AiPanelSection {
  readonly key: 'hypotheses' | 'needsThemes' | 'discoveryStrategy' | 'nextBestActions';
  readonly groups: readonly { readonly key: AiPanelGroupKey; readonly items: AiPanelItem[] }[];
}

export interface AiPanelContent {
  /** "kyc v<n> · <prompt> · <model, Mock or ChatGPT web> · dd/mm hh:mm". */
  readonly chip: {
    readonly version: number;
    readonly prompt: string;
    readonly source: AiPanelSource;
    readonly at: string;
  };
  /** Minor conflicts sent with the input (§6.2): the trường as sent, and its facts' codes. */
  readonly conflicts: readonly { readonly field: string; readonly codes: readonly string[] }[];
  readonly sections: readonly AiPanelSection[];
  /** "Thông tin tham khảo — không phải kết luận": none, no block. */
  readonly reference: readonly AiPanelItem[];
}

type OutputItem = {
  readonly text: string;
  readonly evidence: readonly string[];
  readonly missingCategory?: KycCategory | undefined;
  readonly system?: PersonalitySystem;
};

/**
 * What an ACCEPTED analysis shows. Its input and output passed their schemas when saved (and when a
 * backup was loaded), so they are read with those schemas; its input gives each cited fact's day.
 * Given the customer's facts, a CURRENT analysis weighs a code by the fact in effect it stands for
 * (`factInEffect`): confirmed again with the same value, it counts with its new day (DR5-15).
 */
export function analysisContent(
  analysis: AiAnalysisView,
  versions: readonly VersionRef[],
  facts: readonly KycFactRecord[] = [],
): AiPanelContent {
  const input = analysisInputSchema.parse(analysis.input);
  const analysisDate = fromIsoDate(input.analysisDate);
  const confirmed = new Map(input.facts.map((f) => [f.code, fromIsoDate(f.confirmedAt)]));
  const now = (code: string) => {
    const fact = analysis.state === 'CURRENT' ? factInEffect(facts, code) : null;
    return fact && { code: factCode(fact.seq), confirmedDate: fact.confirmedDate };
  };
  const toItem = (item: OutputItem): AiPanelItem => {
    const cited = item.evidence.flatMap((code) => {
      const confirmedDate = confirmed.get(code);
      return confirmedDate ? [now(code) ?? { code, confirmedDate }] : [];
    });
    return {
      text: item.text,
      system: item.system ?? null,
      codes: item.evidence,
      missing: item.missingCategory ?? null,
      evidence: isNonEmpty(cited) ? evidenceLevel({ analysisDate, facts: cited }) : null,
    };
  };
  const group = (key: AiPanelGroupKey, items: readonly OutputItem[]) => ({
    key,
    items: items.map(toItem),
  });
  const single = (key: AiPanelSection['key'] & AiPanelGroupKey, items: readonly OutputItem[]) =>
    items.length > 0 ? [{ key, groups: [group(key, items)] }] : [];

  let output: DiscoveryOutput;
  let middle: AiPanelSection[] = [];
  if (analysis.mode === 'analysis') {
    const full = analysisOutputSchema.parse(analysis.output);
    output = full;
    middle = [
      {
        key: 'needsThemes',
        groups: [
          group('needs', full.needs),
          group('painPoints', full.painPoints),
          group('themes', full.themes),
        ],
      },
    ];
  } else {
    output = discoveryOutputSchema.parse(analysis.output);
  }
  return {
    chip: {
      version: versionNumber(analysis, versions),
      prompt: analysis.promptVersion,
      source: analysisSource(analysis),
      at: dayAndTime(analysis.createdAt),
    },
    conflicts: input.conflictWarnings.map((field) => ({
      field,
      codes: input.facts.filter((f) => f.field === field && f.conflict).map((f) => f.code),
    })),
    sections: [
      ...single('hypotheses', output.hypotheses),
      ...middle,
      ...single('discoveryStrategy', output.discoveryStrategy),
      ...single('nextBestActions', output.nextBestActions),
    ],
    reference: output.personalityNotes.map(toItem),
  };
}

/**
 * Who answered: a model by its Settings name, or a provider that keeps no model (Mock, ChatGPT web),
 * shown by its own badge (mockups 2e, 4i). It follows `provider`, never `model === null`.
 */
export type AiPanelSource = { readonly badge: 'MOCK' | 'CHATGPT_WEB' } | { readonly model: string };

export function analysisSource(
  analysis: Pick<AiAnalysisView, 'provider' | 'model'>,
): AiPanelSource {
  const { provider, model } = analysis;
  return provider === 'OPENCODE_GO' ? { model: modelLabel(model ?? '') } : { badge: provider };
}

/** The name Settings → AI shows for a model; an id no longer listed shows as stored. */
export function modelLabel(id: string): string {
  return AI_MODELS.find((model) => model.id === id)?.label ?? id;
}

// ---- the history --------------------------------------------------------------

/** One row of "Lịch sử phân tích" (mockup 2j): Ngày · KYC · Prompt · Provider / model · state. */
export interface AiHistoryRow {
  readonly id: string;
  /** `dd/mm hh:mm` of the save. */
  readonly at: string;
  readonly version: number;
  readonly prompt: string;
  readonly source: AiPanelSource;
  readonly state: AiAnalysisView['state'];
}

/** Every analysis, latest first by recording order (`seq`), never by date (§7.1). */
export function historyRows(
  analyses: readonly AiAnalysisView[],
  versions: readonly VersionRef[],
): AiHistoryRow[] {
  return [...analyses]
    .sort((a, b) => b.seq - a.seq)
    .map((analysis) => ({
      id: analysis.id,
      at: dayAndTime(analysis.createdAt),
      version: versionNumber(analysis, versions),
      prompt: analysis.promptVersion,
      source: analysisSource(analysis),
      state: analysis.state,
    }));
}

/** Mockup 2k: what a REJECTED row shows — its validator report, never its output. */
export interface AiRejectedReport {
  readonly at: string;
  readonly version: number;
  readonly prompt: string;
  readonly source: AiPanelSource;
  readonly attempts: number;
  /** Both attempts added up, with OpenCode only (mockup 2k). */
  readonly tokens: number | null;
  readonly reports: readonly AiAttemptReport[];
  /** The day of the latest ACCEPTED analysis, which stays the one shown; null with none. */
  readonly latest: CalendarDate | null;
}

export function rejectedReport(
  row: AiAnalysisView,
  analyses: readonly AiAnalysisView[],
  versions: readonly VersionRef[],
): AiRejectedReport {
  const { provider, promptTokens, completionTokens } = row;
  const counted = provider === 'OPENCODE_GO' && promptTokens !== null && completionTokens !== null;
  return {
    at: dayAndTime(row.createdAt),
    version: versionNumber(row, versions),
    prompt: row.promptVersion,
    source: analysisSource(row),
    attempts: row.attempts,
    tokens: counted ? promptTokens + completionTokens : null,
    reports: attemptReports(row),
    latest: analyses.find((analysis) => analysis.status === 'ACCEPTED')?.date ?? null,
  };
}

/** "kyc v<seq>": the stored number of the version, which a backup may leave with gaps (DR5-48). */
function versionNumber(
  analysis: Pick<AiAnalysisView, 'kycVersionId'>,
  versions: readonly VersionRef[],
): number {
  const version = versions.find((candidate) => candidate.id === analysis.kycVersionId);
  // Rule 11 of a backup and `recordAiAnalysis` keep it the customer's own: never "kyc v0".
  if (!version) throw new RangeError(`Not a KYC version of the customer: ${analysis.kycVersionId}`);
  return version.seq;
}

const isNonEmpty = <T>(list: readonly T[]): list is readonly [T, ...T[]] => list.length > 0;

/** `dd/mm HH:MM` of a moment in the local time zone. */
function dayAndTime(at: Date): string {
  const [, time] = formatLocalDateTime(at).split(' ');
  return `${formatDayMonth(fromLocalDate(at))} ${time}`;
}
