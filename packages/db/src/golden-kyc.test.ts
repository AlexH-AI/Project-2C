/**
 * Golden KYC gate K01–K15 through the database (spec §8): each profile is loaded with the business
 * commands only, read back, and `evaluateKycGate` must give the golden result. Birth year and gender
 * enter through the customer profile (D2); a disagreeing birth year is flagged by the RE as a
 * conflict (Owner, #62). The fixture is never edited to make this pass.
 */
import { evaluateKycGate, type KycFact } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { KYC_GOLDEN_PROFILES } from '../../domain/src/golden/kyc.fixture';
import { createCustomer, type Gender } from './customers';
import { addKycNote, confirmKycFact, getKycProfile, markKycConflict } from './kyc';
import { d, setup } from './test-support';

const GENDERS_BY_LABEL: Readonly<Record<string, Gender>> = { Nam: 'MALE', Nữ: 'FEMALE' };

const entries = (facts: readonly KycFact[]) =>
  facts.map((f) => JSON.stringify([f.field, f.value, f.status])).sort();

describe('golden KYC profiles through the database', () => {
  it.each(KYC_GOLDEN_PROFILES.map((p) => [p.id, p] as const))('%s', async (_, golden) => {
    const { db, re } = await setup();
    const fromProfile = (field: 'birthYear' | 'gender') =>
      golden.facts.find((fact) => fact.field === field);
    const birthYear = fromProfile('birthYear');
    const gender = fromProfile('gender');
    const customer = createCustomer(db, {
      name: golden.id,
      reId: re.id,
      stage: 'N4',
      date: d(1, 6, 2026),
      birthDate: birthYear ? { year: birthYear.value as number } : null,
      gender: gender ? GENDERS_BY_LABEL[gender.value as string]! : null,
    });
    const note = addKycNote(db, customer.id, { text: golden.id, date: d(1, 6, 2026) });

    const loaded = new Set<string>(
      [birthYear?.field, gender?.field].filter((f) => f !== undefined),
    );
    for (const fact of golden.facts) {
      if (fact === birthYear || fact === gender) continue;
      const input = {
        field: fact.field,
        value: fact.value,
        noteId: note.id,
        date: fact.confirmedDate,
      };
      if (fact.status === 'conflict' && loaded.has(fact.field)) {
        markKycConflict(db, customer.id, input);
      } else {
        confirmKycFact(db, customer.id, input);
      }
      loaded.add(fact.field);
    }

    const { facts } = getKycProfile(db, customer.id);
    expect(entries(facts)).toEqual(entries(golden.facts));
    const result = evaluateKycGate(facts);
    expect({
      state: result.state,
      missingCategories: result.missingCategories,
      coreConflictFields: result.coreConflictFields,
      warningFields: result.warningFields,
    }).toEqual(golden.expected);
  });
});
