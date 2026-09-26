/**
 * Cổng KYC (ADR-0008 4–6): a pure function over the confirmed facts that decides which of the four
 * states the profile is in, without calling the AI. Thresholds and questions come from the catalog.
 */
import {
  KYC_CATEGORIES,
  KYC_CATEGORY_SPECS,
  KYC_FIELDS,
  KYC_GATE_THRESHOLDS,
  KYC_INSUFFICIENT_MESSAGE,
} from './kyc-catalog';
import type { KycCategory, KycField, KycGateState } from './kyc-catalog';
import type { KycFact } from './kyc-fact';

export interface KycSuggestedQuestions {
  readonly category: KycCategory;
  readonly questions: readonly string[];
}

export interface KycGateResult {
  readonly state: KycGateState;
  /** Hạng mục "đã có", in catalog order. */
  readonly presentCategories: readonly KycCategory[];
  /** Hạng mục not "đã có", in catalog order. */
  readonly missingCategories: readonly KycCategory[];
  /** Cốt lõi trường in conflict, in catalog order: they block the AI. */
  readonly coreConflictFields: readonly KycField[];
  /** Other trường in conflict, in catalog order: the AI still runs, with a warning. */
  readonly warningFields: readonly KycField[];
  /** Template questions for each missing hạng mục, in the same order. */
  readonly suggestedQuestions: readonly KycSuggestedQuestions[];
  /** Whether the AI may be called: only in `PROFILE_DISCOVERY` and `PAIN_POINT_ANALYSIS`. */
  readonly aiAllowed: boolean;
  /** `KYC_INSUFFICIENT_MESSAGE` in `KYC_INSUFFICIENT`, otherwise null. */
  readonly message: string | null;
}

const FIELDS_IN_ORDER = Object.keys(KYC_FIELDS) as KycField[];

function stateOf(present: ReadonlySet<KycCategory>, hasCoreConflict: boolean): KycGateState {
  const t = KYC_GATE_THRESHOLDS;
  if (hasCoreConflict) return 'CONFLICT_RESOLUTION';
  if (!t.minimumCategories.every((category) => present.has(category))) return 'KYC_INSUFFICIENT';
  const ready =
    present.size >= t.analysisMinCategories &&
    present.has(t.analysisRequiredCategory) &&
    t.analysisAnyOfCategories.some((category) => present.has(category));
  return ready ? 'PAIN_POINT_ANALYSIS' : 'PROFILE_DISCOVERY';
}

/** Evaluates the gate from the facts; superseded facts are history and are ignored. */
export function evaluateKycGate(facts: readonly KycFact[]): KycGateResult {
  const current = facts.filter((fact) => fact.status !== 'superseded');
  const answered = new Set(current.map((fact) => fact.field));
  const inConflict = new Set(
    current.filter((fact) => fact.status === 'conflict').map((fact) => fact.field),
  );

  const isPresent = (category: KycCategory) => {
    const { rule, fields } = KYC_CATEGORY_SPECS[category].keyFields;
    return rule === 'all'
      ? fields.every((f) => answered.has(f))
      : fields.some((f) => answered.has(f));
  };
  const presentCategories = KYC_CATEGORIES.filter(isPresent);
  const missingCategories = KYC_CATEGORIES.filter((category) => !isPresent(category));
  const conflictFields = FIELDS_IN_ORDER.filter((field) => inConflict.has(field));
  const coreConflictFields = conflictFields.filter((field) => KYC_FIELDS[field].core);
  const warningFields = conflictFields.filter((field) => !KYC_FIELDS[field].core);

  const state = stateOf(new Set(presentCategories), coreConflictFields.length > 0);
  return {
    state,
    presentCategories,
    missingCategories,
    coreConflictFields,
    warningFields,
    suggestedQuestions: missingCategories.map((category) => ({
      category,
      questions: KYC_CATEGORY_SPECS[category].questions,
    })),
    aiAllowed: state === 'PROFILE_DISCOVERY' || state === 'PAIN_POINT_ANALYSIS',
    message: state === 'KYC_INSUFFICIENT' ? KYC_INSUFFICIENT_MESSAGE : null,
  };
}
