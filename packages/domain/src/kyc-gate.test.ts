import { describe, expect, it } from 'vitest';
import {
  KYC_CATEGORIES,
  KYC_CATEGORY_SPECS,
  KYC_FIELDS,
  KYC_INSUFFICIENT_MESSAGE,
} from './kyc-catalog';
import type { KycField } from './kyc-catalog';
import type { KycFact, KycFactStatus, KycValue } from './kyc-fact';
import { evaluateKycGate } from './kyc-gate';
import { KYC_GOLDEN_PROFILES } from './golden/kyc.fixture';
import { calendarDate } from './period';

let seq = 0;
const fact = (field: KycField, value: KycValue, status: KycFactStatus = 'active'): KycFact => ({
  id: `f${++seq}`,
  category: KYC_FIELDS[field].category,
  field,
  value,
  noteId: 'n1',
  confirmedDate: calendarDate(2026, 9, 1),
  status,
});

const MINIMUM: readonly KycFact[] = [
  fact('birthYear', 1972),
  fact('maritalStatus', 'Đã kết hôn'),
  fact('childrenCount', 2),
  fact('occupation', 'Chủ doanh nghiệp'),
];

describe('KYC gate — golden profiles', () => {
  for (const { id, facts, expected } of KYC_GOLDEN_PROFILES) {
    it(`${id} → ${expected.state}`, () => {
      const result = evaluateKycGate(facts);
      expect(result.state).toBe(expected.state);
      expect(result.missingCategories).toEqual(expected.missingCategories);
      expect(result.coreConflictFields).toEqual(expected.coreConflictFields);
      expect(result.warningFields).toEqual(expected.warningFields);
    });
  }
});

describe('KYC gate', () => {
  it('lists present and missing hạng mục that together cover the catalog, in order', () => {
    const result = evaluateKycGate(MINIMUM);
    expect(result.presentCategories).toEqual(['IDENTITY', 'FAMILY', 'OCCUPATION_INCOME']);
    expect([...result.presentCategories, ...result.missingCategories].sort()).toEqual(
      [...KYC_CATEGORIES].sort(),
    );
  });

  it('treats an empty profile as KYC_INSUFFICIENT with all eight hạng mục missing', () => {
    const result = evaluateKycGate([]);
    expect(result.state).toBe('KYC_INSUFFICIENT');
    expect(result.missingCategories).toEqual([...KYC_CATEGORIES]);
    expect(result.presentCategories).toEqual([]);
  });

  it('shows the exact message and the template questions for missing hạng mục when insufficient', () => {
    const result = evaluateKycGate([fact('birthYear', 1980)]);
    expect(result.state).toBe('KYC_INSUFFICIENT');
    expect(result.message).toBe(KYC_INSUFFICIENT_MESSAGE);
    expect(result.suggestedQuestions.map((q) => q.category)).toEqual(result.missingCategories);
    expect(result.suggestedQuestions[0]).toEqual({
      category: 'FAMILY',
      questions: KYC_CATEGORY_SPECS.FAMILY.questions,
    });
  });

  it('has no message outside KYC_INSUFFICIENT', () => {
    expect(evaluateKycGate(MINIMUM).message).toBeNull();
  });

  it('does not allow the AI for KYC_INSUFFICIENT or CONFLICT_RESOLUTION', () => {
    const insufficient = evaluateKycGate([]);
    const conflict = evaluateKycGate([
      ...MINIMUM.filter((f) => f.field !== 'birthYear'),
      fact('birthYear', 1972, 'conflict'),
      fact('birthYear', 1974, 'conflict'),
    ]);
    expect(insufficient.state).toBe('KYC_INSUFFICIENT');
    expect(insufficient.aiAllowed).toBe(false);
    expect(conflict.state).toBe('CONFLICT_RESOLUTION');
    expect(conflict.aiAllowed).toBe(false);
  });

  it('allows the AI for PROFILE_DISCOVERY and PAIN_POINT_ANALYSIS', () => {
    for (const { facts, expected } of KYC_GOLDEN_PROFILES) {
      const result = evaluateKycGate(facts);
      expect(result.aiAllowed, expected.state).toBe(
        expected.state === 'PROFILE_DISCOVERY' || expected.state === 'PAIN_POINT_ANALYSIS',
      );
    }
  });

  it('only warns on a conflict on a trường phụ; the state does not change', () => {
    const clean = evaluateKycGate([...MINIMUM, fact('riskProfile', 'Cân bằng')]);
    const conflicted = evaluateKycGate([
      ...MINIMUM,
      fact('riskProfile', 'Thận trọng', 'conflict'),
      fact('riskProfile', 'Cân bằng', 'conflict'),
    ]);
    expect(conflicted.state).toBe(clean.state);
    expect(conflicted.aiAllowed).toBe(true);
    expect(conflicted.warningFields).toEqual(['riskProfile']);
    expect(conflicted.coreConflictFields).toEqual([]);
  });

  it('ignores superseded facts: they neither fill a hạng mục nor create a conflict', () => {
    const result = evaluateKycGate([
      ...MINIMUM,
      fact('primaryGoal', 'Tích lũy hưu trí', 'superseded'),
      fact('totalAssets', 'Khoảng 100 tỷ', 'superseded'),
    ]);
    expect(result.missingCategories).toContain('GOALS');
    expect(result.missingCategories).toContain('ASSETS');
    expect(result.coreConflictFields).toEqual([]);
  });

  it('lists conflicting trường in catalog order, once each', () => {
    const result = evaluateKycGate([
      fact('primaryGoal', 'A', 'conflict'),
      fact('primaryGoal', 'B', 'conflict'),
      fact('birthYear', 1972, 'conflict'),
      fact('birthYear', 1974, 'conflict'),
      fact('birthYear', 1975, 'conflict'),
    ]);
    expect(result.coreConflictFields).toEqual(['birthYear', 'primaryGoal']);
  });

  it('suggests no questions when nothing is missing', () => {
    const full = KYC_GOLDEN_PROFILES.find((p) => p.id === 'K10')!;
    expect(evaluateKycGate(full.facts).suggestedQuestions).toEqual([]);
  });
});
