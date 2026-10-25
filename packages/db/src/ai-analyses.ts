/**
 * The AI analysis history (spec Phase 5 §7, ADR-0009): append-only, one row per real AI call, never
 * for a blocked gate (P2). CURRENT / STALE / REJECTED is worked out on reading, never stored: any
 * new KYC version leaves an analysis STALE, and its material flag only changes the reminder (P1).
 * "Latest" is by recording order (`seq`) for both analyses and KYC versions, never by date.
 */
import {
  AI_ANALYSIS_NO_MODEL,
  AI_OUTPUT_SCHEMAS,
  analysisInputSchema,
  MAX_AI_RAW_OUTPUT,
  type AnalysisInput,
} from '@p2c/ai/schema';
import { fromIsoDate, type CalendarDate, type KycGateState } from '@p2c/domain';
import { asc, desc, eq, sql } from 'drizzle-orm';
import {
  isLabel,
  lastSeq,
  liveCustomer,
  nextSeq,
  prepared,
  rowInsert,
  storedDate,
  today,
} from './common';
import type { Database } from './database';
import { DbError } from './errors';
import { ulid } from './ids';
import {
  AI_ANALYSIS_GATES,
  AI_ANALYSIS_PROVIDERS,
  AI_ANALYSIS_REASONING,
  AI_ANALYSIS_STATUSES,
  aiAnalyses,
  kycVersions,
} from './schema';

type AiAnalysisMode = keyof typeof AI_ANALYSIS_GATES;
type AiAnalysisStatus = (typeof AI_ANALYSIS_STATUSES)[number];
type AiAnalysisProvider = (typeof AI_ANALYSIS_PROVIDERS)[number];
type AiAnalysisReasoning = (typeof AI_ANALYSIS_REASONING)[number];

export interface NewAiAnalysis {
  readonly customerId: string;
  /** The KYC version the input was taken from; it must be the same customer's. */
  readonly kycVersionId: string;
  readonly mode: AiAnalysisMode;
  /** Must be the gate of `mode`: `PAIN_POINT_ANALYSIS` for analysis, `PROFILE_DISCOVERY` for discovery. */
  readonly gateState: KycGateState;
  readonly status: AiAnalysisStatus;
  readonly provider: AiAnalysisProvider;
  /** Null with Mock and ChatGPT web, set otherwise. */
  readonly model: string | null;
  /** Null with Mock and ChatGPT web, set otherwise. */
  readonly reasoning: AiAnalysisReasoning | null;
  /** E.g. `analysis@1`; ChatGPT web adds its wrapper's, `analysis@1+web@1` (spec §3.1). */
  readonly promptVersion: string;
  /** 1 or 2. */
  readonly attempts: number;
  /** The facts and gate sent (§7.1), of the same `mode`; checked again at run time, stored as JSON. */
  readonly input: AnalysisInput;
  /** The parsed output of the last attempt; required when accepted, null when rejected unparsed. */
  readonly output: unknown;
  /** Null when accepted; the raw text of the last attempt when rejected, cut to 20 000 characters. */
  readonly rawOutput: string | null;
  /** The validator report of each attempt; stored as JSON. */
  readonly validator: unknown;
  /** Both attempts added up; null with Mock and ChatGPT web. */
  readonly promptTokens: number | null;
  readonly completionTokens: number | null;
}

export interface AiAnalysisRecord {
  readonly id: string;
  readonly customerId: string;
  readonly seq: number;
  readonly kycVersionId: string;
  readonly mode: AiAnalysisMode;
  readonly gateState: (typeof AI_ANALYSIS_GATES)[AiAnalysisMode];
  readonly status: AiAnalysisStatus;
  readonly provider: AiAnalysisProvider;
  readonly model: string | null;
  readonly reasoning: AiAnalysisReasoning | null;
  readonly promptVersion: string;
  readonly attempts: number;
  readonly input: unknown;
  readonly output: unknown;
  readonly rawOutput: string | null;
  readonly validator: unknown;
  readonly promptTokens: number | null;
  readonly completionTokens: number | null;
  /** The app day it was saved. */
  readonly date: CalendarDate;
  /** The moment it was saved, by the database clock (the chip's time, spec §9.1). */
  readonly createdAt: Date;
}

export type AiAnalysisState = 'CURRENT' | 'STALE' | 'REJECTED';

/**
 * Why the latest accepted analysis is STALE: a material KYC version came after it, or only minor
 * ones did. `since` is the earliest day among those versions (only the material ones for a material
 * reminder): a note may be dated back, so the first recorded is not always the earliest (G3
 * `ai.html#ask` 4).
 */
export interface AiAnalysisReminder {
  readonly material: boolean;
  readonly since: CalendarDate;
}

export interface AiAnalysisView extends AiAnalysisRecord {
  readonly state: AiAnalysisState;
  /** Set only on the latest accepted analysis, when it is STALE. */
  readonly reminder: AiAnalysisReminder | null;
}

// ---- command ----------------------------------------------------------------

export function recordAiAnalysis(db: Database, analysis: NewAiAnalysis): AiAnalysisRecord {
  return db.transaction(() => {
    liveCustomer(db, analysis.customerId);
    const row = toRow(analysis);
    const version = prepared(db, versionById).get({ id: analysis.kycVersionId });
    if (version?.customerId !== analysis.customerId) throw new DbError('KYC_VERSION_NOT_FOUND');
    const stored = {
      ...row,
      id: ulid(db.now(), db.random),
      seq: nextSeq(lastSeq(db, aiAnalyses, analysis.customerId)),
      date: storedDate(today(db)),
      createdAt: db.now().toISOString(),
    };
    prepared(db, insertAnalysis).run(stored);
    return toRecord(stored);
  });
}

/** The fields of a new analysis as stored, refused when they do not fit together (§7.1). */
function toRow(a: NewAiAnalysis) {
  const noModel = AI_ANALYSIS_NO_MODEL.includes(a.provider);
  const inputJson = JSON.stringify(a.input) as string | undefined;
  const validatorJson = JSON.stringify(a.validator) as string | undefined;
  // Checked after stringifying too: NaN would be stored as `null`, a function not at all.
  const outputJson =
    a.output === null || a.output === undefined
      ? null
      : (JSON.stringify(a.output) as string | undefined);
  // The output as the text it would store, which the import reads.
  const stored = { ...a, outputJson };
  const fits =
    Object.hasOwn(AI_ANALYSIS_GATES, a.mode) &&
    AI_ANALYSIS_GATES[a.mode] === a.gateState &&
    AI_ANALYSIS_STATUSES.includes(a.status) &&
    AI_ANALYSIS_PROVIDERS.includes(a.provider) &&
    (noModel
      ? a.model === null && a.reasoning === null
      : isLabel(a.model) && AI_ANALYSIS_REASONING.includes(a.reasoning!)) &&
    isTokenCount(a.promptTokens, noModel) &&
    isTokenCount(a.completionTokens, noModel) &&
    analysisLabelsFit(stored) &&
    analysisContentFits(stored) &&
    (a.status === 'ACCEPTED'
      ? a.rawOutput === null
      : typeof a.rawOutput === 'string' && a.rawOutput !== '');
  if (
    !fits ||
    inputJson === undefined ||
    validatorJson === undefined ||
    outputJson === undefined ||
    outputJson === 'null'
  ) {
    throw new DbError('AI_ANALYSIS_INVALID');
  }
  return {
    customerId: a.customerId,
    kycVersionId: a.kycVersionId,
    mode: a.mode,
    gateState: a.gateState,
    status: a.status,
    provider: a.provider,
    model: a.model,
    reasoning: a.reasoning,
    promptVersion: a.promptVersion,
    attempts: a.attempts,
    inputJson,
    outputJson,
    rawOutput: a.rawOutput === null ? null : storedRawOutput(a.rawOutput),
    validatorJson,
    promptTokens: a.promptTokens,
    completionTokens: a.completionTokens,
  };
}

/**
 * A rejected raw output as stored. It is untrusted text kept to find out what went wrong, so what
 * the database would not read back as it is goes rather than the whole text: a NUL (which SQLite
 * would cut the text at, DR-49) and a lone surrogate half (stored as U+FFFD, cutting the text after
 * it, DR6-108) are replaced with U+FFFD, and the U+FEFF the text starts with (dropped on reading,
 * DR6-107) is dropped; nothing else left is one U+FFFD, a rejected output never being empty. Cut by
 * code point, as SQLite counts the characters of the CHECK, never inside a pair.
 */
function storedRawOutput(raw: string): string {
  const kept = raw.replace(/^\u{FEFF}+/u, '').replace(/[\0\p{Cs}]/gu, '�') || '�';
  return Array.from(kept).slice(0, MAX_AI_RAW_OUTPUT).join('');
}

function isTokenCount(count: number | null, noModel: boolean): boolean {
  return count === null || (!noModel && Number.isSafeInteger(count) && count >= 0);
}

// ---- what the command and the import both check (§7.3 rules 12, 13) ---------

/** An analysis's columns as the command takes them, or the import reads them back. */
export interface AnalysisFields {
  readonly mode: unknown;
  readonly status: unknown;
  readonly provider: unknown;
  readonly model: unknown;
  readonly promptVersion: unknown;
  readonly attempts: unknown;
  readonly input: unknown;
  /** The output as stored: its JSON text, or null. */
  readonly outputJson: unknown;
  readonly validator: unknown;
}

/** The longest model name kept (DR5-16): the app's own are far shorter. */
const MAX_MODEL = 100;

/** `<mode>@<n>`, and `+web@<n>` for ChatGPT web (§7.1). */
const PROMPT_VERSION = /^(\w+)@[1-9]\d*(\+web@[1-9]\d*)?$/;

/**
 * Rule 12: the model and prompt version are labels as the app writes them, the prompt of the
 * analysis's own mode, wrapped only by ChatGPT web; a rejected analysis had its retry (spec §3).
 */
export function analysisLabelsFit(a: AnalysisFields): boolean {
  const version = typeof a.promptVersion === 'string' ? PROMPT_VERSION.exec(a.promptVersion) : null;
  return (
    version !== null &&
    version[1] === a.mode &&
    (version[2] !== undefined) === (a.provider === 'CHATGPT_WEB') &&
    (a.model === null || (isLabel(a.model) && a.model.length <= MAX_MODEL)) &&
    (a.status === 'REJECTED' ? a.attempts === 2 : a.attempts === 1 || a.attempts === 2)
  );
}

/**
 * Rule 13: the input passes the input schema of its mode; an accepted output passes the latest
 * schema of its mode, is stored as that schema reads it, cites only facts of its input, and its
 * last attempt had no issue. A rejected output is stored as `analysisOutcome` keeps it
 * (`rejectedOutputFits`). The input is the app's own, taken before the AI is called, so it is
 * checked on a rejected one too.
 */
export function analysisContentFits(a: AnalysisFields): boolean {
  const input = analysisInputSchema.safeParse(a.input).data;
  if (input === undefined || input.mode !== a.mode) return false;
  if (a.status !== 'ACCEPTED') return rejectedOutputFits(a.outputJson);
  const result = AI_OUTPUT_SCHEMAS[input.mode].safeParse(jsonOf(a.outputJson));
  // Keys in the schema's order, none of its own, strings trimmed, defaults filled (G5 §13.3).
  if (!result.success || JSON.stringify(result.data) !== a.outputJson) return false;
  if (lastIssues(a.validator) > 0) return false;
  const codes = new Set(input.facts.map((fact) => fact.code));
  // Every block of an analysis or discovery output is a list of items that may cite facts.
  return Object.values(result.data)
    .flat()
    .every((item) => item.evidence.every((code) => codes.has(code)));
}

/**
 * A rejected output as `analysisOutcome` keeps it: none, or the JSON block of the last answer as
 * `JSON.stringify` writes it (an object, no white space outside its strings, no key twice), of
 * 20 000 characters at most, counted as `raw_output` is (G5 §13.2, §13.3; Owner 23/10/2026).
 */
function rejectedOutputFits(text: unknown): boolean {
  if (text === null) return true;
  if (typeof text !== 'string' || overRawOutput(text)) return false;
  const value = jsonOf(text);
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    JSON.stringify(value) === text
  );
}

/** More code points than `raw_output` keeps; a huge text is never read whole (DR5-09). */
const overRawOutput = (text: string) =>
  text.length > MAX_AI_RAW_OUTPUT &&
  (text.length > 2 * MAX_AI_RAW_OUTPUT || Array.from(text).length > MAX_AI_RAW_OUTPUT);

/** The JSON value of stored text; undefined when there is none or it does not parse. */
function jsonOf(text: unknown): unknown {
  if (typeof text !== 'string') return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

/** How many issues the last attempt's report lists, as `analysisOutcome` stores them. */
function lastIssues(validator: unknown): number {
  const last: unknown = Array.isArray(validator) ? validator.at(-1) : undefined;
  const errors =
    typeof last === 'object' && last !== null ? (last as { errors?: unknown }).errors : [];
  return Array.isArray(errors) ? errors.length : 0;
}

// ---- read -------------------------------------------------------------------

/** The customer's analyses, latest first, each with its state (§7.2). */
export function listAiAnalyses(db: Database, customerId: string): AiAnalysisView[] {
  liveCustomer(db, customerId);
  const versions = prepared(db, versionsOf).all({ customerId });
  const latestVersion = versions.at(-1);
  const records = prepared(db, analysesOf).all({ customerId }).map(toRecord);
  const latestAccepted = records.find((record) => record.status === 'ACCEPTED');
  const current = latestAccepted?.kycVersionId === latestVersion?.id ? latestAccepted : undefined;
  return records.map((record) => ({
    ...record,
    state: record.status === 'REJECTED' ? 'REJECTED' : record === current ? 'CURRENT' : 'STALE',
    reminder: record === latestAccepted && !current ? reminderFor(record, versions) : null,
  }));
}

function reminderFor(
  record: AiAnalysisRecord,
  versions: readonly { id: string; date: string; material: boolean }[],
): AiAnalysisReminder {
  // Not CURRENT, so the analysed version is not the latest: at least one came after it.
  const after = versions.slice(versions.findIndex((v) => v.id === record.kycVersionId) + 1);
  const material = after.some((v) => v.material);
  // Stored days (`yyyy-mm-dd`) sort as text.
  const since = after
    .filter((v) => v.material === material)
    .map((v) => v.date)
    .reduce((a, b) => (b < a ? b : a));
  return { material, since: fromIsoDate(since) };
}

function toRecord(row: typeof aiAnalyses.$inferSelect): AiAnalysisRecord {
  return {
    id: row.id,
    customerId: row.customerId,
    seq: row.seq,
    kycVersionId: row.kycVersionId,
    mode: row.mode,
    gateState: row.gateState as AiAnalysisRecord['gateState'],
    status: row.status,
    provider: row.provider,
    model: row.model,
    reasoning: row.reasoning,
    promptVersion: row.promptVersion,
    attempts: row.attempts,
    input: JSON.parse(row.inputJson),
    output: row.outputJson === null ? null : JSON.parse(row.outputJson),
    rawOutput: row.rawOutput,
    validator: JSON.parse(row.validatorJson),
    promptTokens: row.promptTokens,
    completionTokens: row.completionTokens,
    date: fromIsoDate(row.date),
    createdAt: new Date(row.createdAt),
  };
}

const insertAnalysis = rowInsert(aiAnalyses);
const byCustomer = sql.placeholder('customerId');
const versionById = (db: Database) =>
  db.orm
    .select({ customerId: kycVersions.customerId })
    .from(kycVersions)
    .where(eq(kycVersions.id, sql.placeholder('id')))
    .prepare();
const versionsOf = (db: Database) =>
  db.orm
    .select({ id: kycVersions.id, date: kycVersions.date, material: kycVersions.material })
    .from(kycVersions)
    .where(eq(kycVersions.customerId, byCustomer))
    .orderBy(asc(kycVersions.seq))
    .prepare();
const analysesOf = (db: Database) =>
  db.orm
    .select()
    .from(aiAnalyses)
    .where(eq(aiAnalyses.customerId, byCustomer))
    .orderBy(desc(aiAnalyses.seq))
    .prepare();
