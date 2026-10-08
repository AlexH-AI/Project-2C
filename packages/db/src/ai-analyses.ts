/**
 * The AI analysis history (spec Phase 5 §7, ADR-0009): append-only, one row per real AI call, never
 * for a blocked gate (P2). CURRENT / STALE / REJECTED is worked out on reading, never stored: any
 * new KYC version leaves an analysis STALE, and its material flag only changes the reminder (P1).
 * "Latest" is by recording order (`seq`) for both analyses and KYC versions, never by date.
 */
import { fromIsoDate, type CalendarDate, type KycGateState } from '@p2c/domain';
import { asc, desc, eq, max, sql } from 'drizzle-orm';
import { isLabel, liveCustomer, nextSeq, prepared, rowInsert, storedDate, today } from './common';
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
  MAX_AI_RAW_OUTPUT,
} from './schema';

export type AiAnalysisMode = keyof typeof AI_ANALYSIS_GATES;
export type AiAnalysisStatus = (typeof AI_ANALYSIS_STATUSES)[number];
export type AiAnalysisProvider = (typeof AI_ANALYSIS_PROVIDERS)[number];
export type AiAnalysisReasoning = (typeof AI_ANALYSIS_REASONING)[number];

export interface NewAiAnalysis {
  readonly customerId: string;
  /** The KYC version the input was taken from; it must be the same customer's. */
  readonly kycVersionId: string;
  readonly mode: AiAnalysisMode;
  /** Must be the gate of `mode`: `PAIN_POINT_ANALYSIS` for analysis, `PROFILE_DISCOVERY` for discovery. */
  readonly gateState: KycGateState;
  readonly status: AiAnalysisStatus;
  readonly provider: AiAnalysisProvider;
  /** Null with Mock, set otherwise. */
  readonly model: string | null;
  /** Null with Mock, set otherwise. */
  readonly reasoning: AiAnalysisReasoning | null;
  /** E.g. `analysis@1`. */
  readonly promptVersion: string;
  /** 1 or 2. */
  readonly attempts: number;
  /** The facts and gate sent (§7.1); stored as JSON. */
  readonly input: unknown;
  /** The parsed output of the last attempt; required when accepted, null when rejected unparsed. */
  readonly output: unknown;
  /** Null when accepted; the raw text of the last attempt when rejected, cut to 20 000 characters. */
  readonly rawOutput: string | null;
  /** The validator report of each attempt; stored as JSON. */
  readonly validator: unknown;
  /** Both attempts added up; null with Mock. */
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
      seq: nextSeq(prepared(db, lastSeq).get({ customerId: analysis.customerId })?.seq),
      date: storedDate(today(db)),
      createdAt: db.now().toISOString(),
    };
    prepared(db, insertAnalysis).run(stored);
    return toRecord(stored);
  });
}

/** The fields of a new analysis as stored, refused when they do not fit together (§7.1). */
function toRow(a: NewAiAnalysis) {
  const mock = a.provider === 'MOCK';
  const fits =
    Object.hasOwn(AI_ANALYSIS_GATES, a.mode) &&
    AI_ANALYSIS_GATES[a.mode] === a.gateState &&
    AI_ANALYSIS_STATUSES.includes(a.status) &&
    AI_ANALYSIS_PROVIDERS.includes(a.provider) &&
    (mock
      ? a.model === null && a.reasoning === null
      : isLabel(a.model) && AI_ANALYSIS_REASONING.includes(a.reasoning!)) &&
    isTokenCount(a.promptTokens, mock) &&
    isTokenCount(a.completionTokens, mock) &&
    (a.attempts === 1 || a.attempts === 2) &&
    isLabel(a.promptVersion) &&
    (a.status === 'ACCEPTED'
      ? a.output !== null && a.output !== undefined && a.rawOutput === null
      : typeof a.rawOutput === 'string' && a.rawOutput !== '');
  const inputJson = JSON.stringify(a.input) as string | undefined;
  const validatorJson = JSON.stringify(a.validator) as string | undefined;
  // Checked after stringifying too: NaN would be stored as `null`, a function not at all.
  const outputJson =
    a.output === null || a.output === undefined
      ? null
      : (JSON.stringify(a.output) as string | undefined);
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
 * A rejected raw output as stored. It is untrusted text kept to find out what went wrong, so a NUL
 * (which SQLite would cut the text at, DR-49) is replaced rather than refused. Cut by code point, as
 * SQLite counts the characters of the CHECK, never inside a pair.
 */
function storedRawOutput(raw: string): string {
  return Array.from(raw.replaceAll('\0', '�')).slice(0, MAX_AI_RAW_OUTPUT).join('');
}

function isTokenCount(count: number | null, mock: boolean): boolean {
  return count === null || (!mock && Number.isSafeInteger(count) && count >= 0);
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
const lastSeq = (db: Database) =>
  db.orm
    .select({ seq: max(aiAnalyses.seq) })
    .from(aiAnalyses)
    .where(eq(aiAnalyses.customerId, byCustomer))
    .prepare();
