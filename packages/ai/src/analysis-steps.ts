/**
 * The steps of an analysis that the AI calls (`run.ts`) and ChatGPT web (`web.ts`, spec §3.1) share:
 * the prompt of each mode, the input taken at the click, the check of an answer and the fields of
 * the row its answers decide (§7.1). Not part of `@p2c/ai`: `index.ts` does not export it.
 */
import { evaluateKycGate, type CalendarDate, type KycGateState } from '@p2c/domain';
import { checkAnswer, lastAnswer, type CheckedAnswer } from './attempts';
import { cutCodePoints } from './code-points';
import { analysisPrompt } from './prompts/analysis';
import { discoveryPrompt } from './prompts/discovery';
import {
  AI_OUTPUT_SCHEMAS,
  buildAnalysisInput,
  MAX_AI_RAW_OUTPUT,
  type AnalysisInput,
  type AnalysisProfile,
} from './schema';
import { validateOutput, type ValidationIssue } from './validator';

/** What an analysis is of: the customer, at the KYC version its result stays tied to (§3). */
export interface AnalysisSubject {
  readonly customerId: string;
  /** The KYC version the profile is at when the RE clicks (§3 item 2, §3.1 item 6). */
  readonly kycVersionId: string;
}

/** The subject alone, out of a request or a session that carries it. */
export function subjectOf({ customerId, kycVersionId }: AnalysisSubject): AnalysisSubject {
  return { customerId, kycVersionId };
}

/** The prompt of each mode that keeps a history (G5 §2, §3). */
export const ANALYSIS_PROMPTS = { analysis: analysisPrompt, discovery: discoveryPrompt } as const;

/**
 * The input of an analysis taken from the profile now (spec §3, §6.1), or the gate state when the
 * gate lets no AI through (P2). The AI calls and ChatGPT web (§3.1) take it the same way.
 */
export function takeAnalysisInput(
  profile: AnalysisProfile,
  today: CalendarDate,
): AnalysisInput | { readonly kind: 'blocked'; readonly state: KycGateState } {
  const gate = evaluateKycGate(profile.facts);
  return buildAnalysisInput(profile, gate, today) ?? { kind: 'blocked', state: gate.state };
}

/**
 * Checks an analysis or discovery answer against the input it was given (V1–V6); `cut`: `maxTokens`
 * cut it (never known of a ChatGPT web paste).
 */
export function checkAnalysisAnswer(
  input: AnalysisInput,
  content: string,
  cut = false,
): CheckedAnswer {
  const checked = {
    factCodes: input.facts.map((fact) => fact.code),
    missingCategories: input.missingCategories.map((category) => category.code),
  };
  return checkAnswer(content, (parsed) => validateOutput(input.mode, parsed, checked), cut);
}

/** The fields of an analysis row that its input and answers decide, whoever answered (spec §7.1). */
export interface AnalysisOutcome {
  readonly mode: AnalysisInput['mode'];
  readonly gateState: 'PAIN_POINT_ANALYSIS' | 'PROFILE_DISCOVERY';
  readonly status: 'ACCEPTED' | 'REJECTED';
  readonly attempts: number;
  readonly input: AnalysisInput;
  readonly output: unknown;
  readonly rawOutput: string | null;
  readonly validator: readonly {
    readonly attempt: number;
    readonly errors: readonly ValidationIssue[];
  }[];
}

export function analysisOutcome(
  input: AnalysisInput,
  attempts: readonly CheckedAnswer[],
): AnalysisOutcome {
  const { mode } = input;
  const last = lastAnswer(attempts);
  const accepted = last.issues.length === 0;
  return {
    mode,
    gateState: mode === 'analysis' ? 'PAIN_POINT_ANALYSIS' : 'PROFILE_DISCOVERY',
    status: accepted ? 'ACCEPTED' : 'REJECTED',
    attempts: attempts.length,
    input,
    output: accepted ? AI_OUTPUT_SCHEMAS[mode].parse(last.parsed) : last.parsed,
    rawOutput: accepted ? null : rawOutput(last.content),
    validator: attempts.map((done, i) => ({ attempt: i + 1, errors: done.issues })),
  };
}

/**
 * Stored as `raw_output` when the last wrong answer was empty: `db` takes no empty `raw_output`
 * for a REJECTED row (§7.3 rule 3; review #418).
 */
export const EMPTY_RAW_OUTPUT = '(empty)';

function rawOutput(content: string): string {
  if (content === '') return EMPTY_RAW_OUTPUT;
  // By code point, as `db` cuts it, so an emoji at the limit is not cut in two.
  return cutCodePoints(content, MAX_AI_RAW_OUTPUT);
}

/** What a row tells of the model when its provider names none (`AI_ANALYSIS_NO_MODEL`, §7.1). */
export const NO_MODEL = {
  model: null,
  reasoning: null,
  promptTokens: null,
  completionTokens: null,
} as const;
