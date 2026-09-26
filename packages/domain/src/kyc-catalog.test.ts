import { describe, expect, it } from 'vitest';
import {
  KYC_CATEGORIES,
  KYC_CATEGORY_SPECS,
  KYC_FIELDS,
  KYC_GATE_THRESHOLDS,
  KYC_INSUFFICIENT_MESSAGE,
} from './kyc-catalog';
import type { KycField } from './kyc-catalog';

const fields = Object.keys(KYC_FIELDS) as KycField[];

describe('KYC catalog', () => {
  it('has the eight hạng mục of ADR-0008, each with at least one trường', () => {
    expect(KYC_CATEGORIES).toHaveLength(8);
    for (const category of KYC_CATEGORIES) {
      expect(
        fields.some((field) => KYC_FIELDS[field].category === category),
        category,
      ).toBe(true);
    }
  });

  it('marks exactly birth year, marital status, children, total assets and main goal as cốt lõi', () => {
    expect(fields.filter((field) => KYC_FIELDS[field].core)).toEqual([
      'birthYear',
      'maritalStatus',
      'childrenCount',
      'totalAssets',
      'primaryGoal',
    ]);
  });

  it('takes each hạng mục’s trường chính from its own trường', () => {
    for (const category of KYC_CATEGORIES) {
      const { fields: keyFields } = KYC_CATEGORY_SPECS[category].keyFields;
      expect(keyFields.length).toBeGreaterThan(0);
      for (const field of keyFields) expect(KYC_FIELDS[field].category, field).toBe(category);
    }
  });

  it('needs both marital status and children for family, and occupation or income for work', () => {
    expect(KYC_CATEGORY_SPECS.FAMILY.keyFields).toEqual({
      rule: 'all',
      fields: ['maritalStatus', 'childrenCount'],
    });
    expect(KYC_CATEGORY_SPECS.OCCUPATION_INCOME.keyFields).toEqual({
      rule: 'any',
      fields: ['occupation', 'annualIncome'],
    });
  });

  it('suggests two or three distinct questions per hạng mục', () => {
    for (const category of KYC_CATEGORIES) {
      const { questions } = KYC_CATEGORY_SPECS[category];
      expect(questions.length, category).toBeGreaterThanOrEqual(2);
      expect(questions.length, category).toBeLessThanOrEqual(3);
      expect(new Set(questions).size).toBe(questions.length);
    }
  });

  it('sets the gate thresholds approved at G2', () => {
    expect(KYC_GATE_THRESHOLDS).toEqual({
      minimumCategories: ['IDENTITY', 'FAMILY', 'OCCUPATION_INCOME'],
      analysisMinCategories: 6,
      analysisRequiredCategory: 'GOALS',
      analysisAnyOfCategories: ['ASSETS', 'EXISTING_PROTECTION'],
    });
    expect(KYC_INSUFFICIENT_MESSAGE).toBe('Cần chăm sóc, KYC thêm thông tin khách hàng');
  });
});
