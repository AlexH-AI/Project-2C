import { describe, expect, it } from 'vitest';
import * as kyc from './kyc';
import {
  EMPTY_KYC_PROFILE,
  addNote,
  confirmFact,
  kycHash,
  markConflict,
  nextKycVersion,
  resolveConflict,
} from './kyc';
import type { KycProfile } from './kyc';
import { calendarDate } from './period';

const DAY = calendarDate(2025, 12, 1);
const LATER = calendarDate(2026, 1, 5);

const note = (id: string, text = 'Gặp KH tại văn phòng') => ({ id, text, createdDate: DAY });

const withNotes = (...ids: string[]): KycProfile =>
  ids.reduce((profile, id) => addNote(profile, note(id)), EMPTY_KYC_PROFILE);

const statusOf = (profile: KycProfile, id: string) =>
  profile.facts.find((fact) => fact.id === id)?.status;

describe('KYC notes', () => {
  it('appends a note without touching the notes already there', () => {
    const before = withNotes('n1');
    const after = addNote(before, note('n2'));
    expect(before.notes.map((n) => n.id)).toEqual(['n1']);
    expect(after.notes.map((n) => n.id)).toEqual(['n1', 'n2']);
    expect(after.notes[0]).toBe(before.notes[0]);
  });

  it('refuses a second note with the same id', () => {
    expect(() => addNote(withNotes('n1'), note('n1', 'Khác'))).toThrow(/n1/);
  });

  it('offers no way to edit or delete a note', () => {
    const noteOperations = Object.keys(kyc).filter((name) => /note/i.test(name));
    expect(noteOperations).toEqual(['addNote']);
  });
});

describe('KYC facts', () => {
  it('rejects a fact whose source note does not exist', () => {
    expect(() =>
      confirmFact(withNotes('n1'), {
        id: 'f1',
        field: 'birthYear',
        value: 1972,
        noteId: 'missing',
        confirmedDate: DAY,
      }),
    ).toThrow(/missing/);
  });

  it('rejects a second fact with the same id', () => {
    const profile = confirmFact(withNotes('n1'), {
      id: 'f1',
      field: 'birthYear',
      value: 1972,
      noteId: 'n1',
      confirmedDate: DAY,
    });
    expect(() =>
      confirmFact(profile, {
        id: 'f1',
        field: 'gender',
        value: 'Nam',
        noteId: 'n1',
        confirmedDate: DAY,
      }),
    ).toThrow(/f1/);
  });

  it('files a confirmed fact under its trường’s hạng mục, as active', () => {
    const profile = confirmFact(withNotes('n1'), {
      id: 'f1',
      field: 'childrenCount',
      value: 0,
      noteId: 'n1',
      confirmedDate: DAY,
    });
    expect(profile.facts).toEqual([
      {
        id: 'f1',
        category: 'FAMILY',
        field: 'childrenCount',
        value: 0,
        noteId: 'n1',
        confirmedDate: DAY,
        status: 'active',
      },
    ]);
  });

  it('supersedes the active fact on the same trường and leaves other trường alone', () => {
    const base = { noteId: 'n1', confirmedDate: DAY };
    let profile = withNotes('n1', 'n2');
    profile = confirmFact(profile, { ...base, id: 'f1', field: 'totalAssets', value: '100 tỷ' });
    profile = confirmFact(profile, { ...base, id: 'f2', field: 'birthYear', value: 1972 });
    const before = profile;
    profile = confirmFact(profile, {
      id: 'f3',
      field: 'totalAssets',
      value: 'Trên 200 tỷ',
      noteId: 'n2',
      confirmedDate: LATER,
    });
    expect(statusOf(profile, 'f1')).toBe('superseded');
    expect(statusOf(profile, 'f2')).toBe('active');
    expect(statusOf(profile, 'f3')).toBe('active');
    expect(statusOf(before, 'f1')).toBe('active');
  });
});

describe('KYC conflicts', () => {
  const twoBirthYears = () => {
    const profile = confirmFact(withNotes('n1', 'n2'), {
      id: 'f1',
      field: 'birthYear',
      value: 1972,
      noteId: 'n1',
      confirmedDate: DAY,
    });
    return markConflict(profile, {
      id: 'f2',
      field: 'birthYear',
      value: 1974,
      noteId: 'n2',
      confirmedDate: LATER,
    });
  };

  it('keeps both disagreeing facts in conflict', () => {
    const profile = twoBirthYears();
    expect(statusOf(profile, 'f1')).toBe('conflict');
    expect(statusOf(profile, 'f2')).toBe('conflict');
  });

  it('adds a further disagreeing value to the conflict', () => {
    const profile = markConflict(twoBirthYears(), {
      id: 'f3',
      field: 'birthYear',
      value: 1973,
      noteId: 'n1',
      confirmedDate: LATER,
    });
    expect(profile.facts.map((fact) => fact.status)).toEqual(['conflict', 'conflict', 'conflict']);
  });

  it('refuses a conflict with nothing to disagree with, or with an equal value', () => {
    const fact = { id: 'f9', noteId: 'n1', confirmedDate: DAY } as const;
    expect(() => markConflict(withNotes('n1'), { ...fact, field: 'gender', value: 'Nữ' })).toThrow(
      /gender/,
    );
    expect(() =>
      markConflict(twoBirthYears(), { ...fact, field: 'birthYear', value: 1974 }),
    ).toThrow(/birthYear/);
  });

  it('keeps the conflict until it is resolved, then keeps the chosen fact', () => {
    const withGender = confirmFact(twoBirthYears(), {
      id: 'f3',
      field: 'gender',
      value: 'Nam',
      noteId: 'n1',
      confirmedDate: DAY,
    });
    const profile = resolveConflict(withGender, 'f2');
    expect(statusOf(profile, 'f1')).toBe('superseded');
    expect(statusOf(profile, 'f2')).toBe('active');
    expect(statusOf(profile, 'f3')).toBe('active');
  });

  it('resolves a conflict with a newly confirmed value too', () => {
    const profile = confirmFact(twoBirthYears(), {
      id: 'f3',
      field: 'birthYear',
      value: 1973,
      noteId: 'n1',
      confirmedDate: LATER,
    });
    expect(profile.facts.map((fact) => fact.status)).toEqual([
      'superseded',
      'superseded',
      'active',
    ]);
  });

  it('refuses to resolve on a fact that is not in conflict', () => {
    const profile = confirmFact(withNotes('n1'), {
      id: 'f1',
      field: 'gender',
      value: 'Nam',
      noteId: 'n1',
      confirmedDate: DAY,
    });
    expect(() => resolveConflict(profile, 'f1')).toThrow(/f1/);
    expect(() => resolveConflict(profile, 'nope')).toThrow(/nope/);
  });
});

describe('KYC versions', () => {
  const profileOf = (
    facts: [id: string, field: 'birthYear' | 'gender', value: string | number][],
  ) =>
    facts.reduce(
      (profile, [id, field, value]) =>
        confirmFact(profile, { id, field, value, noteId: 'n1', confirmedDate: DAY }),
      withNotes('n1'),
    );

  it('hashes the active facts regardless of their order', () => {
    const a = profileOf([
      ['f1', 'birthYear', 1972],
      ['f2', 'gender', 'Nam'],
    ]);
    const b = profileOf([
      ['f2', 'gender', 'Nam'],
      ['f1', 'birthYear', 1972],
    ]);
    expect(kycHash(a)).toBe(kycHash(b));
  });

  it('changes the hash when one value changes, including its type', () => {
    const base = kycHash(profileOf([['f1', 'birthYear', 1972]]));
    expect(kycHash(profileOf([['f1', 'birthYear', 1974]]))).not.toBe(base);
    expect(kycHash(profileOf([['f1', 'birthYear', '1972']]))).not.toBe(base);
  });

  it('creates the first version with the dated summary', () => {
    const profile = profileOf([['f1', 'birthYear', 1972]]);
    expect(nextKycVersion(null, profile, DAY, true)).toEqual({
      hash: kycHash(profile),
      summary: 'Cập nhật KYC 01/12/2025',
      date: DAY,
      material: true,
    });
  });

  it('creates no new version when the facts did not change', () => {
    const profile = profileOf([['f1', 'birthYear', 1972]]);
    const first = nextKycVersion(null, profile, DAY, false);
    expect(nextKycVersion(first, addNote(profile, note('n2')), LATER, false)).toBeNull();
    const changed = confirmFact(profile, {
      id: 'f2',
      field: 'birthYear',
      value: 1974,
      noteId: 'n1',
      confirmedDate: LATER,
    });
    expect(nextKycVersion(first, changed, LATER, false)?.summary).toBe('Cập nhật KYC 05/01/2026');
  });
});
