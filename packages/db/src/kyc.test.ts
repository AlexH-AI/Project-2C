import { describe, expect, it } from 'vitest';
import { createCustomer, softDeleteCustomer, updateCustomerProfile } from './customers';
import * as db from './index';
import {
  addKycNote,
  confirmKycFact,
  getKycProfile,
  listKycVersions,
  markKycConflict,
  markKycVersionMaterial,
  recordKycNote,
  resolveKycConflict,
} from './kyc';
import { codeOf, d, setup } from './test-support';

async function withCustomer(profile: { birthDate?: { year: number }; gender?: 'MALE' } = {}) {
  const ctx = await setup();
  const customer = createCustomer(ctx.db, {
    name: 'Lan',
    reId: ctx.re.id,
    stage: 'N4',
    date: d(1, 9, 2026),
    ...profile,
  });
  ctx.persist.mockClear();
  const note = addKycNote(ctx.db, customer.id, { text: 'Gặp lần đầu', date: d(2, 9, 2026) });
  return { ...ctx, customer, note };
}

const current = (facts: readonly { field: string; value: unknown; status: string }[]) =>
  facts.filter((f) => f.status !== 'superseded').map((f) => [f.field, f.value, f.status]);

describe('KYC notes', () => {
  it('appends notes from the RE in recording order', async () => {
    const { db: database, customer, note, persist } = await withCustomer();

    const second = addKycNote(database, customer.id, {
      text: ' Con thứ hai ',
      date: d(1, 9, 2026),
    });

    expect(note).toEqual({
      id: expect.stringMatching(/^[0-9A-Z]{26}$/),
      text: 'Gặp lần đầu',
      createdDate: d(2, 9, 2026),
      source: 'RE',
    });
    expect(second.text).toBe('Con thứ hai');
    expect(getKycProfile(database, customer.id).notes).toEqual([note, second]);
    expect(persist).toHaveBeenCalledTimes(2);
  });

  it('refuses an empty note and an unknown or deleted customer', async () => {
    const { db: database, customer } = await withCustomer();

    expect(codeOf(() => addKycNote(database, customer.id, { text: '  ', date: d(1, 9) }))).toBe(
      'KYC_NOTE_EMPTY',
    );
    expect(codeOf(() => addKycNote(database, 'nobody', { text: 'x', date: d(1, 9) }))).toBe(
      'CUSTOMER_NOT_FOUND',
    );
    softDeleteCustomer(database, customer.id);
    expect(codeOf(() => getKycProfile(database, customer.id))).toBe('CUSTOMER_NOT_FOUND');
  });

  it('can never be edited or deleted, not even with raw SQL', async () => {
    const { db: database, customer, note } = await withCustomer();
    confirmKycFact(database, customer.id, {
      field: 'occupation',
      value: 'Bác sĩ',
      noteId: note.id,
      date: d(3, 9, 2026),
    });

    expect(
      Object.keys(db)
        .filter((name) => /Kyc/.test(name))
        .sort(),
    ).toEqual([
      'addKycNote',
      'confirmKycFact',
      'getKycProfile',
      'listKycVersions',
      'markKycConflict',
      'markKycVersionMaterial',
      'normalizeKycValue',
      'recordKycNote',
      'resolveKycConflict',
    ]);
    const run = (sql: string) => () => database.sqlite.run(sql);
    expect(run("UPDATE kyc_notes SET text = 'sửa'")).toThrow(/append-only/);
    expect(run('DELETE FROM kyc_notes')).toThrow(/append-only/);
    // A fact is never deleted and only its status changes.
    expect(run('UPDATE kyc_facts SET value_json = \'"Luật sư"\'')).toThrow(/append-only/);
    expect(run('DELETE FROM kyc_facts')).toThrow(/append-only/);
    expect(run("UPDATE kyc_facts SET status = 'superseded', updated_at = 'x'")).not.toThrow();
  });
});

describe('KYC facts', () => {
  it('confirms a fact from a note and supersedes the previous value of its trường', async () => {
    const { db: database, customer, note } = await withCustomer();
    const input = { field: 'maritalStatus', noteId: note.id, date: d(3, 9, 2026) } as const;

    const first = confirmKycFact(database, customer.id, { ...input, value: 'Độc thân' });
    const second = confirmKycFact(database, customer.id, { ...input, value: 'Đã kết hôn' });

    expect(first.fact).toEqual({
      id: expect.stringMatching(/^[0-9A-Z]{26}$/),
      category: 'FAMILY',
      field: 'maritalStatus',
      value: 'Độc thân',
      noteId: note.id,
      confirmedDate: d(3, 9, 2026),
      status: 'active',
    });
    expect(getKycProfile(database, customer.id).facts).toEqual([
      { ...first.fact, status: 'superseded' },
      second.fact,
    ]);
  });

  it('takes the latest fact by recording order, not by confirmed date', async () => {
    const { db: database, customer, note } = await withCustomer();
    const input = { field: 'occupation', noteId: note.id } as const;

    confirmKycFact(database, customer.id, { ...input, value: 'Bác sĩ', date: d(20, 9, 2026) });
    confirmKycFact(database, customer.id, { ...input, value: 'Giám đốc', date: d(5, 9, 2026) });

    expect(current(getKycProfile(database, customer.id).facts)).toEqual([
      ['occupation', 'Giám đốc', 'active'],
    ]);
  });

  it('normalises the value to the type of its trường before comparing', async () => {
    const { db: database, customer, note } = await withCustomer();
    const input = { noteId: note.id, date: d(3, 9, 2026) };

    confirmKycFact(database, customer.id, { ...input, field: 'childrenCount', value: ' 2 ' });
    confirmKycFact(database, customer.id, { ...input, field: 'hasProtection', value: true });
    confirmKycFact(database, customer.id, { ...input, field: 'hasProtection', value: 'false' });
    confirmKycFact(database, customer.id, { ...input, field: 'residence', value: '  Hà Nội ' });
    confirmKycFact(database, customer.id, { ...input, field: 'annualIncome', value: 12 });

    expect(current(getKycProfile(database, customer.id).facts)).toEqual([
      ['childrenCount', 2, 'active'],
      ['hasProtection', false, 'active'],
      ['residence', 'Hà Nội', 'active'],
      ['annualIncome', '12', 'active'],
    ]);
    const same = { ...input, field: 'childrenCount', value: 2 } as const;
    expect(codeOf(() => markKycConflict(database, customer.id, same))).toBe('KYC_NO_CONFLICT');
  });

  it('refuses a value of the wrong type, an unknown trường and a note of another customer', async () => {
    const { db: database, customer, re, note } = await withCustomer();
    const other = createCustomer(database, {
      name: 'Mai',
      reId: re.id,
      stage: 'N4',
      date: d(1, 9),
    });
    const otherNote = addKycNote(database, other.id, { text: 'x', date: d(1, 9) });
    const confirm = (field: string, value: string | number | boolean, noteId = note.id) =>
      codeOf(() =>
        confirmKycFact(database, customer.id, {
          field: field as 'occupation',
          value,
          noteId,
          date: d(3, 9, 2026),
        }),
      );

    expect(confirm('childrenCount', 'hai')).toBe('INVALID_KYC_VALUE');
    expect(confirm('childrenCount', 1.5)).toBe('INVALID_KYC_VALUE');
    expect(confirm('childrenCount', -1)).toBe('INVALID_KYC_VALUE');
    expect(confirm('hasProtection', 'có lẽ')).toBe('INVALID_KYC_VALUE');
    expect(confirm('hasProtection', 1)).toBe('INVALID_KYC_VALUE');
    expect(confirm('occupation', '   ')).toBe('INVALID_KYC_VALUE');
    expect(confirm('occupation', true)).toBe('INVALID_KYC_VALUE');
    expect(confirm('shoeSize', '42')).toBe('INVALID_KYC_FIELD');
    expect(confirm('toString', '42')).toBe('INVALID_KYC_FIELD');
    expect(confirm('occupation', 'Bác sĩ', otherNote.id)).toBe('KYC_NOTE_NOT_FOUND');
    expect(getKycProfile(database, customer.id).facts).toEqual([]);
  });

  it('marks a disagreeing value as a conflict and resolves it by choosing one fact', async () => {
    const { db: database, customer, note } = await withCustomer();
    const input = { field: 'riskProfile', noteId: note.id, date: d(3, 9, 2026) } as const;
    const first = confirmKycFact(database, customer.id, { ...input, value: 'Thận trọng' });

    const second = markKycConflict(database, customer.id, { ...input, value: 'Cân bằng' });

    expect(second.fact.status).toBe('conflict');
    expect(current(getKycProfile(database, customer.id).facts)).toEqual([
      ['riskProfile', 'Thận trọng', 'conflict'],
      ['riskProfile', 'Cân bằng', 'conflict'],
    ]);

    const resolved = resolveKycConflict(database, customer.id, {
      factId: first.fact.id,
      date: d(4, 9, 2026),
    });

    expect(resolved.fact).toEqual({ ...first.fact, status: 'active' });
    expect(current(getKycProfile(database, customer.id).facts)).toEqual([
      ['riskProfile', 'Thận trọng', 'active'],
    ]);
  });

  it('refuses a conflict with nothing to disagree with, and resolving a fact not in conflict', async () => {
    const { db: database, customer, note } = await withCustomer();
    const input = { field: 'riskProfile', noteId: note.id, date: d(3, 9, 2026) } as const;

    expect(codeOf(() => markKycConflict(database, customer.id, { ...input, value: 'A' }))).toBe(
      'KYC_NO_CONFLICT',
    );
    const { fact } = confirmKycFact(database, customer.id, { ...input, value: 'A' });
    const resolve = (factId: string) => () =>
      resolveKycConflict(database, customer.id, { factId, date: d(4, 9, 2026) });
    expect(codeOf(resolve(fact.id))).toBe('KYC_NOT_IN_CONFLICT');
    expect(codeOf(resolve('missing'))).toBe('KYC_FACT_NOT_FOUND');
  });

  it('writes nothing when a command fails', async () => {
    const { db: database, customer, note, persist } = await withCustomer();
    persist.mockClear();

    codeOf(() =>
      confirmKycFact(database, customer.id, {
        field: 'childrenCount',
        value: 'hai',
        noteId: note.id,
        date: d(3, 9, 2026),
      }),
    );

    expect(persist).not.toHaveBeenCalled();
    expect(listKycVersions(database, customer.id)).toEqual([]);
  });
});

describe('birth year and gender come from the customer profile (D2)', () => {
  it('records a SYSTEM note and facts when the customer is created with them', async () => {
    const { db: database, customer } = await withCustomer({
      birthDate: { year: 1972 },
      gender: 'MALE',
    });

    const profile = getKycProfile(database, customer.id);
    expect(profile.notes[0]).toEqual({
      id: expect.any(String),
      text: 'Hồ sơ KH: năm sinh 1972; giới tính Nam',
      createdDate: d(1, 9, 2026),
      source: 'SYSTEM',
    });
    expect(current(profile.facts)).toEqual([
      ['birthYear', 1972, 'active'],
      ['gender', 'Nam', 'active'],
    ]);
    expect(profile.facts.every((f) => f.noteId === profile.notes[0]!.id)).toBe(true);
    expect(listKycVersions(database, customer.id)).toEqual([
      expect.objectContaining({ date: d(1, 9, 2026), material: true }),
    ]);
  });

  it('refuses birthYear and gender confirmed by the RE', async () => {
    const { db: database, customer, note } = await withCustomer();
    const input = { noteId: note.id, date: d(3, 9, 2026) };

    expect(
      codeOf(() =>
        confirmKycFact(database, customer.id, { ...input, field: 'birthYear', value: 1972 }),
      ),
    ).toBe('KYC_FIELD_FROM_PROFILE');
    expect(
      codeOf(() =>
        confirmKycFact(database, customer.id, { ...input, field: 'gender', value: 'Nữ' }),
      ),
    ).toBe('KYC_FIELD_FROM_PROFILE');
  });

  it('records a new SYSTEM fact when the birth date changes, as a material version', async () => {
    const { db: database, customer } = await withCustomer({ birthDate: { year: 1972 } });

    updateCustomerProfile(database, customer.id, { birthDate: d(12, 3, 1974) });

    const profile = getKycProfile(database, customer.id);
    expect(profile.notes.map((n) => [n.source, n.text])).toEqual([
      ['SYSTEM', 'Hồ sơ KH: năm sinh 1972'],
      ['RE', 'Gặp lần đầu'],
      ['SYSTEM', 'Hồ sơ KH: ngày sinh 12/03/1974'],
    ]);
    expect(profile.facts.map((f) => [f.field, f.value, f.status])).toEqual([
      ['birthYear', 1972, 'superseded'],
      ['birthYear', 1974, 'active'],
    ]);
    expect(listKycVersions(database, customer.id).map((v) => v.material)).toEqual([true, true]);
  });

  it('records a gender change as a version that is not material, and nothing for a name change', async () => {
    const { db: database, customer } = await withCustomer({ gender: 'MALE' });

    updateCustomerProfile(database, customer.id, { name: 'Lan Anh' });
    updateCustomerProfile(database, customer.id, { gender: 'FEMALE' });

    expect(current(getKycProfile(database, customer.id).facts)).toEqual([
      ['gender', 'Nữ', 'active'],
    ]);
    expect(getKycProfile(database, customer.id).notes).toHaveLength(3);
    expect(listKycVersions(database, customer.id).map((v) => v.material)).toEqual([true, false]);
  });

  it('refuses to clear a birth date or gender that the KYC profile already holds', async () => {
    const { db: database, customer } = await withCustomer({
      birthDate: { year: 1972 },
      gender: 'MALE',
    });

    expect(codeOf(() => updateCustomerProfile(database, customer.id, { birthDate: null }))).toBe(
      'KYC_PROFILE_FIELD_REQUIRED',
    );
    expect(codeOf(() => updateCustomerProfile(database, customer.id, { gender: null }))).toBe(
      'KYC_PROFILE_FIELD_REQUIRED',
    );
  });

  it('lets the RE flag a conflicting birth year, settled only by the profile value', async () => {
    const { db: database, customer, note } = await withCustomer({ birthDate: { year: 1972 } });
    const system = getKycProfile(database, customer.id).facts[0]!;
    const input = { field: 'birthYear', noteId: note.id, date: d(3, 9, 2026) } as const;

    const flagged = markKycConflict(database, customer.id, { ...input, value: 1974 });

    expect(current(getKycProfile(database, customer.id).facts)).toEqual([
      ['birthYear', 1972, 'conflict'],
      ['birthYear', 1974, 'conflict'],
    ]);
    const resolve = (factId: string) => () =>
      resolveKycConflict(database, customer.id, { factId, date: d(4, 9, 2026) });
    expect(codeOf(resolve(flagged.fact.id))).toBe('KYC_FIELD_FROM_PROFILE');

    resolveKycConflict(database, customer.id, { factId: system.id, date: d(4, 9, 2026) });
    expect(current(getKycProfile(database, customer.id).facts)).toEqual([
      ['birthYear', 1972, 'active'],
    ]);
  });

  it('refuses a fact on a SYSTEM note: only the profile writes there (D2)', async () => {
    const { db: database, customer, note } = await withCustomer({ birthDate: { year: 1972 } });
    const system = getKycProfile(database, customer.id).notes[0]!;
    const versions = listKycVersions(database, customer.id).length;
    const onSystem = { noteId: system.id, date: d(3, 9, 2026) };

    expect(
      codeOf(() =>
        markKycConflict(database, customer.id, { ...onSystem, field: 'birthYear', value: 1974 }),
      ),
    ).toBe('KYC_NOTE_FROM_PROFILE');
    expect(
      codeOf(() =>
        confirmKycFact(database, customer.id, {
          ...onSystem,
          field: 'occupation',
          value: 'Bác sĩ',
        }),
      ),
    ).toBe('KYC_NOTE_FROM_PROFILE');
    expect(getKycProfile(database, customer.id).facts).toHaveLength(1);
    expect(listKycVersions(database, customer.id)).toHaveLength(versions);

    // The same facts on the RE's note are recorded.
    const onNote = { noteId: note.id, date: d(3, 9, 2026) };
    markKycConflict(database, customer.id, { ...onNote, field: 'birthYear', value: 1974 });
    confirmKycFact(database, customer.id, { ...onNote, field: 'occupation', value: 'Bác sĩ' });
    expect(getKycProfile(database, customer.id).facts).toHaveLength(3);
  });

  it('refuses a profile fact in conflict whose value is no longer the profile’s (D2)', async () => {
    const { db: database, customer, note } = await withCustomer({ birthDate: { year: 1972 } });
    const system = getKycProfile(database, customer.id).facts[0]!;
    const input = { field: 'birthYear', noteId: note.id, date: d(3, 9, 2026) } as const;
    markKycConflict(database, customer.id, { ...input, value: 1974 });
    // Only a hand-edited file leaves the profile on another year than its `SYSTEM` fact.
    database.sqlite.run("UPDATE customers SET birth_date = '1980' WHERE id = ?", [customer.id]);

    expect(
      codeOf(() =>
        resolveKycConflict(database, customer.id, { factId: system.id, date: d(4, 9, 2026) }),
      ),
    ).toBe('KYC_FIELD_FROM_PROFILE');
    expect(listKycVersions(database, customer.id)).toHaveLength(2);
  });

  it('settles a birth year conflict when the profile birth date is corrected', async () => {
    const { db: database, customer, note } = await withCustomer({ birthDate: { year: 1972 } });
    const input = { field: 'birthYear', noteId: note.id, date: d(3, 9, 2026) } as const;
    markKycConflict(database, customer.id, { ...input, value: 1974 });

    updateCustomerProfile(database, customer.id, { birthDate: { year: 1974 } });

    expect(current(getKycProfile(database, customer.id).facts)).toEqual([
      ['birthYear', 1974, 'active'],
    ]);
  });
});

describe('KYC versions', () => {
  it('records a version only when the facts in effect change', async () => {
    const { db: database, customer, note } = await withCustomer();
    const input = { field: 'occupation', noteId: note.id, date: d(3, 9, 2026) } as const;

    confirmKycFact(database, customer.id, { ...input, value: 'Bác sĩ' });
    const again = confirmKycFact(database, customer.id, { ...input, value: 'Bác sĩ' });

    expect(again.version).toBeNull();
    expect(listKycVersions(database, customer.id)).toEqual([
      {
        id: expect.stringMatching(/^[0-9A-Z]{26}$/),
        hash: expect.any(String),
        summary: 'Cập nhật KYC 03/09/2026',
        date: d(3, 9, 2026),
        material: true,
      },
    ]);
  });

  it('applies the material rule: core changes always, others only when switched on', async () => {
    const { db: database, customer, note } = await withCustomer();
    const input = { noteId: note.id, date: d(3, 9, 2026) };

    confirmKycFact(database, customer.id, { ...input, field: 'occupation', value: 'Bác sĩ' });
    const minor = confirmKycFact(database, customer.id, {
      ...input,
      field: 'residence',
      value: 'Huế',
    });
    const manual = confirmKycFact(database, customer.id, {
      ...input,
      field: 'riskProfile',
      value: 'Cân bằng',
      material: true,
    });
    const core = confirmKycFact(database, customer.id, {
      ...input,
      field: 'childrenCount',
      value: 1,
      material: false,
    });

    expect([minor, manual, core].map((c) => c.version?.material)).toEqual([false, true, true]);
  });

  it('lets the RE switch material on for a version, never off', async () => {
    const { db: database, customer, note } = await withCustomer();
    const input = { noteId: note.id, date: d(3, 9, 2026) };
    confirmKycFact(database, customer.id, { ...input, field: 'occupation', value: 'Bác sĩ' });
    const { version } = confirmKycFact(database, customer.id, {
      ...input,
      field: 'residence',
      value: 'Huế',
    });

    const switched = markKycVersionMaterial(database, version!.id);
    const again = markKycVersionMaterial(database, version!.id);

    expect([switched.material, again.material]).toEqual([true, true]);
    expect(listKycVersions(database, customer.id).map((v) => v.material)).toEqual([true, true]);
    expect(Object.keys(db).filter((name) => /Material/.test(name))).toEqual([
      'markKycVersionMaterial',
    ]);
    expect(codeOf(() => markKycVersionMaterial(database, 'missing'))).toBe('KYC_VERSION_NOT_FOUND');
  });
});

describe('a note with its facts, recorded at once (mockup 7a)', () => {
  it('saves the note and every fact as one version', async () => {
    const { db: database, customer, persist } = await withCustomer();
    confirmKycFact(database, customer.id, {
      field: 'riskProfile',
      value: 'Thận trọng',
      noteId: getKycProfile(database, customer.id).notes[0]!.id,
      date: d(3, 9, 2026),
    });
    persist.mockClear();

    const { note, version } = recordKycNote(database, customer.id, {
      text: ' Du học 2029 ',
      date: d(14, 9, 2026),
      facts: [
        { field: 'goalHorizon', value: '2029' },
        { field: 'childrenCount', value: ' 2 ' },
        { field: 'riskProfile', value: 'Cân bằng', conflict: true },
      ],
    });

    expect(note).toMatchObject({ text: 'Du học 2029', createdDate: d(14, 9, 2026), source: 'RE' });
    const profile = getKycProfile(database, customer.id);
    expect(current(profile.facts)).toEqual([
      ['riskProfile', 'Thận trọng', 'conflict'],
      ['goalHorizon', '2029', 'active'],
      ['childrenCount', 2, 'active'],
      ['riskProfile', 'Cân bằng', 'conflict'],
    ]);
    expect(profile.facts.slice(1).every((fact) => fact.noteId === note.id)).toBe(true);
    expect(version).toMatchObject({ summary: 'Cập nhật KYC 14/09/2026', material: true });
    expect(listKycVersions(database, customer.id)).toHaveLength(2);
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it('records a note alone without a version, and a manual material switch', async () => {
    const { db: database, customer } = await withCustomer();

    const alone = recordKycNote(database, customer.id, {
      text: 'Hỏi thăm',
      date: d(3, 9),
      facts: [],
    });
    const minor = recordKycNote(database, customer.id, {
      text: 'Ở Huế',
      date: d(4, 9, 2026),
      facts: [{ field: 'residence', value: 'Huế' }],
    });
    const manual = recordKycNote(database, customer.id, {
      text: 'Chuyển ra Hà Nội',
      date: d(5, 9, 2026),
      facts: [{ field: 'residence', value: 'Hà Nội' }],
      material: true,
    });

    expect(alone.version).toBeNull();
    // The first version is always material (ADR-0008 7).
    expect([minor.version?.material, manual.version?.material]).toEqual([true, true]);
    const later = recordKycNote(database, customer.id, {
      text: 'Về Huế',
      date: d(6, 9, 2026),
      facts: [{ field: 'residence', value: 'Huế' }],
    });
    expect(later.version?.material).toBe(false);
  });

  it('writes nothing when one fact is refused', async () => {
    const { db: database, customer, persist } = await withCustomer();
    persist.mockClear();
    const record = (fact: { field: 'occupation'; value: string; conflict?: boolean }, text = 'x') =>
      codeOf(() =>
        recordKycNote(database, customer.id, {
          text,
          date: d(3, 9, 2026),
          facts: [{ field: 'residence', value: 'Huế' }, fact],
        }),
      );

    expect(record({ field: 'occupation', value: 'A' }, '  ')).toBe('KYC_NOTE_EMPTY');
    expect(record({ field: 'occupation', value: 'A', conflict: true })).toBe('KYC_NO_CONFLICT');
    expect(record({ field: 'occupation', value: ' ' })).toBe('INVALID_KYC_VALUE');
    expect(record({ field: 'birthYear' as 'occupation', value: '1984' })).toBe(
      'KYC_FIELD_FROM_PROFILE',
    );
    expect(record({ field: 'shoeSize' as 'occupation', value: '42' })).toBe('INVALID_KYC_FIELD');

    expect(persist).not.toHaveBeenCalled();
    expect(getKycProfile(database, customer.id).notes).toHaveLength(1);
    expect(listKycVersions(database, customer.id)).toEqual([]);
  });
});
