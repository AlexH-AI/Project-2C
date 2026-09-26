import { describe, expect, it } from 'vitest';
import { KYC_CATEGORIES, KYC_FIELDS, KYC_GATE_STATES } from '../kyc-catalog';
import { KYC_GOLDEN_PROFILES } from './kyc.fixture';

// These tests keep the golden profiles internally consistent. They do not run the gate: the gate
// (T-033) is tested against the expected results.

describe('golden KYC profiles', () => {
  it('gives every profile and fact a unique id', () => {
    const ids = KYC_GOLDEN_PROFILES.flatMap((p) => [p.id, ...p.facts.map((fact) => fact.id)]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers all four gate states', () => {
    const states = new Set(KYC_GOLDEN_PROFILES.map((p) => p.expected.state));
    expect([...states].sort()).toEqual([...KYC_GATE_STATES].sort());
  });

  it('files every fact under its trường’s hạng mục', () => {
    for (const { facts } of KYC_GOLDEN_PROFILES) {
      for (const fact of facts)
        expect(fact.category, fact.id).toBe(KYC_FIELDS[fact.field].category);
    }
  });

  it('keeps one active value per trường, or two or more differing values in conflict', () => {
    for (const { id, facts } of KYC_GOLDEN_PROFILES) {
      for (const field of new Set(facts.map((fact) => fact.field))) {
        const current = facts.filter((f) => f.field === field && f.status !== 'superseded');
        const where = `${id} ${field}`;
        expect(current.length, where).toBeGreaterThan(0);
        if (current.length === 1) {
          expect(current[0]!.status, where).toBe('active');
        } else {
          for (const fact of current) expect(fact.status, where).toBe('conflict');
          expect(new Set(current.map((fact) => fact.value)).size, where).toBe(current.length);
        }
      }
    }
  });

  it('lists missing hạng mục in catalog order', () => {
    for (const { id, expected } of KYC_GOLDEN_PROFILES) {
      const ordered = KYC_CATEGORIES.filter((c) => expected.missingCategories.includes(c));
      expect(expected.missingCategories, id).toEqual(ordered);
    }
  });

  it('expects conflicts only on trường in conflict, split into cốt lõi and warnings', () => {
    for (const { id, facts, expected } of KYC_GOLDEN_PROFILES) {
      const inConflict = new Set(facts.filter((f) => f.status === 'conflict').map((f) => f.field));
      expect(new Set([...expected.coreConflictFields, ...expected.warningFields]), id).toEqual(
        inConflict,
      );
      for (const field of expected.coreConflictFields)
        expect(KYC_FIELDS[field].core, id).toBe(true);
      for (const field of expected.warningFields) expect(KYC_FIELDS[field].core, id).toBe(false);
    }
  });

  it('expects CONFLICT_RESOLUTION exactly when a cốt lõi trường is in conflict', () => {
    for (const { id, expected } of KYC_GOLDEN_PROFILES) {
      expect(expected.state === 'CONFLICT_RESOLUTION', id).toBe(
        expected.coreConflictFields.length > 0,
      );
    }
  });
});
