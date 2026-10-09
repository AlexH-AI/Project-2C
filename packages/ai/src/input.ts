/**
 * What is sent to the model (spec Phase 5 §6.1, prompts G5 §1.1, §4.1). Analysis: only the facts
 * in effect (`active`, `conflict`) with their code `F{seq}`, the birth year as an age, and the gate;
 * never the name, codes, RE, notes, appointments or contracts of the KH. Extraction: one note and
 * the trường it may propose.
 */
import {
  formatIsoDate,
  KYC_FIELDS,
  type CalendarDate,
  type KycCategory,
  type KycFact,
  type KycField,
  type KycGateResult,
} from '@p2c/domain';
import { factCode, type AnalysisInput } from './schema';
import { EXTRACTION_FIELDS } from './validator';

/** The app's Vietnamese labels (i18n `kycCategory.*`), which `ai` cannot read (as `db` seed-data). */
export const KYC_CATEGORY_LABELS: Readonly<Record<KycCategory, string>> = {
  IDENTITY: 'Danh tính / tuổi',
  FAMILY: 'Gia đình',
  OCCUPATION_INCOME: 'Nghề nghiệp / nguồn thu',
  ASSETS: 'Tài sản / AUM',
  GOALS: 'Mục tiêu & mốc thời gian',
  RISK_APPETITE: 'Khẩu vị rủi ro',
  EXISTING_PROTECTION: 'Bảo vệ hiện có',
  CONCERNS: 'Mối quan tâm',
};

/** The app's Vietnamese labels (i18n `kycField.*`). */
export const KYC_FIELD_LABELS: Readonly<Record<KycField, string>> = {
  birthYear: 'Năm sinh',
  gender: 'Giới tính',
  residence: 'Nơi sinh sống',
  maritalStatus: 'Tình trạng hôn nhân',
  childrenCount: 'Số con',
  dependents: 'Người phụ thuộc',
  occupation: 'Nghề nghiệp',
  annualIncome: 'Thu nhập năm',
  incomeSources: 'Nguồn thu',
  totalAssets: 'Tổng tài sản',
  assetAllocation: 'Phân bổ tài sản',
  liabilities: 'Nợ phải trả',
  primaryGoal: 'Mục tiêu chính',
  goalHorizon: 'Mốc thời gian mục tiêu',
  otherGoals: 'Mục tiêu khác',
  riskProfile: 'Khẩu vị rủi ro',
  investmentExperience: 'Kinh nghiệm đầu tư',
  hasProtection: 'Đã có bảo vệ',
  protectionDetails: 'Chi tiết bảo vệ',
  mainConcern: 'Mối quan tâm chính',
  otherConcerns: 'Mối quan tâm khác',
};

/** A confirmed fact with its `seq` in `kyc_facts` (by KH), which gives its code. */
export interface AnalysisFact extends KycFact {
  readonly seq: number;
}

export interface AnalysisProfile {
  readonly facts: readonly AnalysisFact[];
}

const FIELD_ORDER = Object.keys(KYC_FIELDS) as KycField[];

/** The birth year goes as an age (G5 §1.1). */
const sentLabel = (field: KycField) => (field === 'birthYear' ? 'Tuổi' : KYC_FIELD_LABELS[field]);

function sentValue(fact: KycFact, today: CalendarDate): string {
  if (fact.field === 'birthYear') return String(today.year - Number(fact.value));
  if (typeof fact.value === 'boolean') return fact.value ? 'Có' : 'Không';
  return String(fact.value);
}

/**
 * The input of an analysis, taken when the RE clicks: `null` when the gate lets no AI through
 * (`CONFLICT_RESOLUTION`, `KYC_INSUFFICIENT` — P2, the panel offers no analysis then).
 */
export function buildAnalysisInput(
  profile: AnalysisProfile,
  gate: KycGateResult,
  today: CalendarDate,
): AnalysisInput | null {
  if (gate.state !== 'PAIN_POINT_ANALYSIS' && gate.state !== 'PROFILE_DISCOVERY') return null;
  const facts = profile.facts
    .filter((fact) => fact.status !== 'superseded')
    .sort((a, b) => FIELD_ORDER.indexOf(a.field) - FIELD_ORDER.indexOf(b.field) || a.seq - b.seq);
  return {
    analysisDate: formatIsoDate(today),
    mode: gate.state === 'PAIN_POINT_ANALYSIS' ? 'analysis' : 'discovery',
    facts: facts.map((fact) => ({
      code: factCode(fact.seq),
      category: KYC_CATEGORY_LABELS[fact.category],
      field: sentLabel(fact.field),
      value: sentValue(fact, today),
      confirmedAt: formatIsoDate(fact.confirmedDate),
      conflict: fact.status === 'conflict',
    })),
    missingCategories: gate.missingCategories.map((code) => ({
      code,
      label: KYC_CATEGORY_LABELS[code],
    })),
    conflictWarnings: gate.warningFields.map(sentLabel),
  };
}

export interface ExtractionInput {
  readonly note: string;
  readonly fields: readonly {
    readonly field: KycField;
    readonly label: string;
    readonly type: 'text' | 'integer' | 'boolean';
  }[];
}

const FIELD_TYPES: Partial<Record<KycField, 'integer' | 'boolean'>> = {
  childrenCount: 'integer',
  hasProtection: 'boolean',
};

/** One KYC note as the RE wrote it, and every trường but those from the hồ sơ KH (D2). */
export function buildExtractionInput(note: string): ExtractionInput {
  return {
    note,
    fields: EXTRACTION_FIELDS.map((field) => ({
      field,
      label: KYC_FIELD_LABELS[field],
      type: FIELD_TYPES[field] ?? 'text',
    })),
  };
}
