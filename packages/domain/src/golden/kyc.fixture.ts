/**
 * Golden KYC profiles for the gate (ADR-0008, approved by the Owner at G2). Expected results are
 * written by hand and mirrored 1–1 in `docs/golden/kyc.md`. Gate tests must pass against this file;
 * never edit it to make a test green — a change needs the Owner's approval again. Also the seed of
 * the ~20-profile AI eval set (Phase 5).
 */
import { KYC_FIELDS } from '../kyc-catalog';
import type { KycCategory, KycField, KycGateState } from '../kyc-catalog';
import type { KycFact, KycFactStatus, KycValue } from '../kyc-fact';
import { calendarDate } from '../period';

type FactSpec = readonly [field: KycField, value: KycValue, status?: KycFactStatus];

export interface ExpectedGate {
  readonly state: KycGateState;
  /** Hạng mục not "đã có", in catalog order; their questions are suggested. */
  readonly missingCategories: readonly KycCategory[];
  /** Cốt lõi trường in conflict: they block the AI. */
  readonly coreConflictFields: readonly KycField[];
  /** Other trường in conflict: the AI still runs, with a warning. */
  readonly warningFields: readonly KycField[];
}

export interface KycGoldenProfile {
  /** Row id in `docs/golden/kyc.md`. */
  readonly id: string;
  readonly facts: readonly KycFact[];
  readonly expected: ExpectedGate;
}

const CONFIRMED = calendarDate(2026, 9, 1);
const EARLIER = calendarDate(2026, 6, 1);

const profile = (
  id: string,
  specs: readonly FactSpec[],
  expected: ExpectedGate,
): KycGoldenProfile => ({
  id,
  facts: specs.map(([field, value, status = 'active'], index) => ({
    id: `${id}-f${String(index + 1).padStart(2, '0')}`,
    category: KYC_FIELDS[field].category,
    field,
    value,
    noteId: `${id}-note`,
    confirmedDate: status === 'superseded' ? EARLIER : CONFIRMED,
    status,
  })),
  expected,
});

const gate = (
  state: KycGateState,
  missingCategories: readonly KycCategory[],
  coreConflictFields: readonly KycField[] = [],
  warningFields: readonly KycField[] = [],
): ExpectedGate => ({ state, missingCategories, coreConflictFields, warningFields });

// Building blocks: each one makes its hạng mục "đã có".
const IDENTITY: readonly FactSpec[] = [
  ['birthYear', 1972],
  ['residence', 'TP.HCM'],
];
const FAMILY: readonly FactSpec[] = [
  ['maritalStatus', 'Đã kết hôn'],
  ['childrenCount', 2],
];
const OCCUPATION: readonly FactSpec[] = [
  ['occupation', 'Chủ doanh nghiệp'],
  ['incomeSources', 'Cổ tức doanh nghiệp, cho thuê bất động sản'],
];
const ASSETS: readonly FactSpec[] = [
  ['totalAssets', 'Trên 200 tỷ'],
  ['assetAllocation', 'Bất động sản, cổ phần doanh nghiệp'],
];
const GOALS: readonly FactSpec[] = [
  ['primaryGoal', 'Chuyển giao tài sản cho thế hệ sau'],
  ['goalHorizon', '10 năm'],
];
const RISK: readonly FactSpec[] = [['riskProfile', 'Cân bằng']];
const PROTECTION: readonly FactSpec[] = [
  ['hasProtection', true],
  ['protectionDetails', 'Bảo hiểm sức khỏe quốc tế'],
];
const CONCERNS: readonly FactSpec[] = [['mainConcern', 'Rủi ro sức khỏe khi tuổi cao']];

const ALL_CATEGORIES = [
  ...IDENTITY,
  ...FAMILY,
  ...OCCUPATION,
  ...ASSETS,
  ...GOALS,
  ...RISK,
  ...PROTECTION,
  ...CONCERNS,
];

export const KYC_GOLDEN_PROFILES: readonly KycGoldenProfile[] = [
  // Empty profile.
  profile(
    'K01',
    [],
    gate('KYC_INSUFFICIENT', [
      'IDENTITY',
      'FAMILY',
      'OCCUPATION_INCOME',
      'ASSETS',
      'GOALS',
      'RISK_APPETITE',
      'EXISTING_PROTECTION',
      'CONCERNS',
    ]),
  ),
  // Family needs both marital status and children count.
  profile(
    'K02',
    [...IDENTITY, ['maritalStatus', 'Đã kết hôn'], ['dependents', 'Bố mẹ hai bên'], ...OCCUPATION],
    gate('KYC_INSUFFICIENT', [
      'FAMILY',
      'ASSETS',
      'GOALS',
      'RISK_APPETITE',
      'EXISTING_PROTECTION',
      'CONCERNS',
    ]),
  ),
  // 7/8 but identity has no birth year: the minimum wins over coverage.
  profile(
    'K03',
    [
      ['gender', 'Nam'],
      ['residence', 'Hà Nội'],
      ...FAMILY,
      ...OCCUPATION,
      ...ASSETS,
      ...GOALS,
      ...RISK,
      ...PROTECTION,
      ...CONCERNS,
    ],
    gate('KYC_INSUFFICIENT', ['IDENTITY']),
  ),
  // Exactly the three minimum; income alone is enough; "0 children" is an answer.
  profile(
    'K04',
    [
      ['birthYear', 1985],
      ['maritalStatus', 'Độc thân'],
      ['childrenCount', 0],
      ['annualIncome', 'Khoảng 12 tỷ'],
    ],
    gate('PROFILE_DISCOVERY', [
      'ASSETS',
      'GOALS',
      'RISK_APPETITE',
      'EXISTING_PROTECTION',
      'CONCERNS',
    ]),
  ),
  // 5/8 with a goal: one hạng mục short.
  profile(
    'K05',
    [...IDENTITY, ...FAMILY, ...OCCUPATION, ...ASSETS, ...GOALS],
    gate('PROFILE_DISCOVERY', ['RISK_APPETITE', 'EXISTING_PROTECTION', 'CONCERNS']),
  ),
  // 7/8 but no main goal (a horizon alone does not count).
  profile(
    'K06',
    [
      ...IDENTITY,
      ...FAMILY,
      ...OCCUPATION,
      ...ASSETS,
      ['goalHorizon', '5 năm'],
      ...RISK,
      ...PROTECTION,
      ...CONCERNS,
    ],
    gate('PROFILE_DISCOVERY', ['GOALS']),
  ),
  // Exactly 6/8 with goal and assets.
  profile(
    'K07',
    [...IDENTITY, ...FAMILY, ...OCCUPATION, ...ASSETS, ...GOALS, ...CONCERNS],
    gate('PAIN_POINT_ANALYSIS', ['RISK_APPETITE', 'EXISTING_PROTECTION']),
  ),
  // Exactly 6/8 with goal and "chưa có bảo hiểm" as the protection answer.
  profile(
    'K08',
    [...IDENTITY, ...FAMILY, ...OCCUPATION, ...GOALS, ...RISK, ['hasProtection', false]],
    gate('PAIN_POINT_ANALYSIS', ['ASSETS', 'CONCERNS']),
  ),
  // 6/8 with goal but neither assets nor protection. Not covered by G2 3–5; proposed: discovery.
  profile(
    'K09',
    [...IDENTITY, ...FAMILY, ...OCCUPATION, ...GOALS, ...RISK, ...CONCERNS],
    gate('PROFILE_DISCOVERY', ['ASSETS', 'EXISTING_PROTECTION']),
  ),
  // Full profile.
  profile('K10', ALL_CATEGORIES, gate('PAIN_POINT_ANALYSIS', [])),
  // Core conflict and missing data: the conflict wins.
  profile(
    'K11',
    [['birthYear', 1972, 'conflict'], ['birthYear', 1974, 'conflict'], ...OCCUPATION],
    gate(
      'CONFLICT_RESOLUTION',
      ['FAMILY', 'ASSETS', 'GOALS', 'RISK_APPETITE', 'EXISTING_PROTECTION', 'CONCERNS'],
      ['birthYear'],
    ),
  ),
  // Non-core conflict on a full profile: analysis still runs, with a warning.
  profile(
    'K12',
    [
      ...IDENTITY,
      ...FAMILY,
      ...OCCUPATION,
      ...ASSETS,
      ...GOALS,
      ['riskProfile', 'Thận trọng', 'conflict'],
      ['riskProfile', 'Cân bằng', 'conflict'],
      ...PROTECTION,
      ...CONCERNS,
    ],
    gate('PAIN_POINT_ANALYSIS', [], [], ['riskProfile']),
  ),
  // Only the latest fact counts: superseded values are history, not conflicts.
  profile(
    'K13',
    [
      ['totalAssets', 'Khoảng 100 tỷ', 'superseded'],
      ['primaryGoal', 'Tích lũy hưu trí', 'superseded'],
      ...ALL_CATEGORIES,
    ],
    gate('PAIN_POINT_ANALYSIS', []),
  ),
  // Core conflict on a full profile, plus a non-core conflict.
  profile(
    'K14',
    [
      ...IDENTITY,
      ['maritalStatus', 'Đã kết hôn'],
      ['childrenCount', 2, 'conflict'],
      ['childrenCount', 3, 'conflict'],
      ...OCCUPATION,
      ...ASSETS,
      ...GOALS,
      ['riskProfile', 'Thận trọng', 'conflict'],
      ['riskProfile', 'Cân bằng', 'conflict'],
      ...PROTECTION,
      ...CONCERNS,
    ],
    gate('CONFLICT_RESOLUTION', [], ['childrenCount'], ['riskProfile']),
  ),
  // A trường chính in conflict still makes its hạng mục "đã có": exactly the minimum, one warning.
  profile(
    'K15',
    [
      ...IDENTITY,
      ...FAMILY,
      ['occupation', 'Bác sĩ', 'conflict'],
      ['occupation', 'Chủ chuỗi phòng khám', 'conflict'],
    ],
    gate(
      'PROFILE_DISCOVERY',
      ['ASSETS', 'GOALS', 'RISK_APPETITE', 'EXISTING_PROTECTION', 'CONCERNS'],
      [],
      ['occupation'],
    ),
  ),
];
