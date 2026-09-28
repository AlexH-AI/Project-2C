import type { KycNoteRecord, KycProfileRecord, KycVersionRecord } from '@p2c/db';
import {
  kycHash,
  type CalendarDate,
  type KycFact,
  type KycProfile,
  type StageTransition,
} from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { factText, kycOverview, kycTimeline, previewKycNote, resolveKycOptions } from './kyc-view';

const day = (month: number, dayOfMonth: number): CalendarDate => ({
  year: 2026,
  month,
  day: dayOfMonth,
});

const fact = (
  field: KycFact['field'],
  value: KycFact['value'],
  status: KycFact['status'] = 'active',
  category: KycFact['category'] = 'IDENTITY',
): KycFact => ({
  id: `${field}-${String(value)}`,
  category,
  field,
  value,
  noteId: 'n1',
  confirmedDate: day(9, 1),
  status,
});

describe('kycOverview', () => {
  it('lists every hạng mục with its facts in effect and the kind of conflict', () => {
    const { gate, rows } = kycOverview([
      fact('birthYear', 1984),
      fact('residence', 'Huế', 'superseded'),
      fact('maritalStatus', 'Độc thân', 'conflict', 'FAMILY'),
      fact('maritalStatus', 'Đã kết hôn', 'conflict', 'FAMILY'),
      fact('riskProfile', 'A', 'conflict', 'RISK_APPETITE'),
      fact('riskProfile', 'B', 'conflict', 'RISK_APPETITE'),
    ]);

    expect(gate.state).toBe('CONFLICT_RESOLUTION');
    expect(rows.map((row) => row.category)).toEqual([
      'IDENTITY',
      'FAMILY',
      'OCCUPATION_INCOME',
      'ASSETS',
      'GOALS',
      'RISK_APPETITE',
      'EXISTING_PROTECTION',
      'CONCERNS',
    ]);
    expect(rows[0]).toEqual({
      category: 'IDENTITY',
      present: true,
      facts: [fact('birthYear', 1984)],
      conflict: null,
    });
    // Family needs both trường chính; a trường in conflict still counts as answered (G2 1).
    expect(rows[1]).toMatchObject({ present: false, conflict: 'core' });
    expect(rows[1]!.facts).toHaveLength(2);
    expect(rows[5]).toMatchObject({ present: true, conflict: 'minor' });
    expect(rows[2]).toMatchObject({ present: false, facts: [], conflict: null });
  });
});

describe('factText', () => {
  it('shows yes/no answers in words and other values as they are', () => {
    const words = { yes: 'Có', no: 'Không' };
    expect(factText(true, words)).toBe('Có');
    expect(factText(false, words)).toBe('Không');
    expect(factText(1984, words)).toBe('1984');
    expect(factText('Bác sĩ', words)).toBe('Bác sĩ');
  });
});

describe('kycTimeline', () => {
  const move = (id: string, date: CalendarDate): StageTransition => ({
    id,
    customerId: 'c1',
    from: null,
    to: 'N4',
    date,
    appointmentId: null,
  });
  const note = (id: string, date: CalendarDate): KycNoteRecord => ({
    id,
    text: id,
    createdDate: date,
    source: 'RE',
  });
  const version = (id: string, date: CalendarDate): KycVersionRecord => ({
    id,
    hash: id,
    summary: `Cập nhật KYC ${id}`,
    date,
    material: false,
  });

  it('puts the newest first; on one day a version, then its note, then a stage change', () => {
    const events = kycTimeline(
      [move('t1', day(9, 1)), move('t2', day(9, 5))],
      [note('n1', day(9, 1)), note('n2', day(9, 5)), note('n3', day(9, 5))],
      [version('v1', day(9, 1)), version('v2', day(9, 5))],
    );

    expect(events.map((event) => `${event.kind}:${event.id}`)).toEqual([
      'version:v2',
      'note:n3',
      'note:n2',
      'stage:t2',
      'version:v1',
      'note:n1',
      'stage:t1',
    ]);
    expect(events[0]).toMatchObject({ kind: 'version', number: 2, date: day(9, 5) });
    expect(events[4]).toMatchObject({ kind: 'version', number: 1 });
  });
});

describe('previewKycNote', () => {
  const profile: KycProfile = {
    notes: [{ id: 'n1', text: 'năm sinh', createdDate: day(9, 1) }],
    facts: [fact('birthYear', 1984), fact('residence', 'Huế')],
  };
  const versions = [{ hash: kycHash(profile), summary: '', date: day(9, 1), material: true }];
  const preview = (facts: Parameters<typeof previewKycNote>[2], manual = false) =>
    previewKycNote(profile, versions, facts, day(9, 15), manual);

  it('records no version for a note alone or for facts that change nothing', () => {
    expect(preview([])).toEqual({ kind: 'none' });
    expect(preview([{ field: 'residence', value: 'Huế' }])).toEqual({ kind: 'none' });
  });

  it('numbers the next version; a cốt lõi trường makes it material on its own', () => {
    expect(preview([{ field: 'childrenCount', value: '2' }])).toEqual({
      kind: 'version',
      number: 2,
      material: true,
      auto: true,
    });
    expect(preview([{ field: 'residence', value: 'Hà Nội' }])).toEqual({
      kind: 'version',
      number: 2,
      material: false,
      auto: false,
    });
    expect(preview([{ field: 'residence', value: 'Hà Nội' }], true)).toMatchObject({
      material: true,
      auto: false,
    });
  });

  it('refuses a conflict with no value to disagree with, or with the same value', () => {
    expect(preview([{ field: 'occupation', value: 'Bác sĩ', conflict: true }])).toEqual({
      kind: 'refused',
      field: 'occupation',
    });
    expect(preview([{ field: 'residence', value: ' Huế ', conflict: true }])).toEqual({
      kind: 'refused',
      field: 'residence',
    });
    expect(preview([{ field: 'residence', value: 'Hà Nội', conflict: true }])).toMatchObject({
      kind: 'version',
    });
  });
});

describe('resolveKycOptions', () => {
  const noteRecord = (
    id: string,
    source: KycNoteRecord['source'],
    date: CalendarDate,
  ): KycNoteRecord => ({ id, text: id, createdDate: date, source });
  const conflicting = (
    id: string,
    field: KycFact['field'],
    value: KycFact['value'],
    noteId: string,
    date: CalendarDate,
    category: KycFact['category'],
  ): KycFact => ({ id, category, field, value, noteId, confirmedDate: date, status: 'conflict' });

  it('offers every value of a trường in conflict between two ghi chú', () => {
    const profile: KycProfileRecord = {
      notes: [noteRecord('n1', 'RE', day(9, 1)), noteRecord('n2', 'RE', day(9, 10))],
      facts: [
        conflicting('f1', 'childrenCount', 2, 'n1', day(9, 1), 'FAMILY'),
        conflicting('f2', 'childrenCount', 3, 'n2', day(9, 10), 'FAMILY'),
      ],
    };

    expect(resolveKycOptions(profile, 'childrenCount')).toEqual([
      { factId: 'f1', value: 2, source: 'NOTE', confirmedDate: day(9, 1), disabled: false },
      { factId: 'f2', value: 3, source: 'NOTE', confirmedDate: day(9, 10), disabled: false },
    ]);
  });

  it('keeps birth year to the hồ sơ KH value: the one from a ghi chú is locked (D2)', () => {
    const profile: KycProfileRecord = {
      notes: [noteRecord('s1', 'SYSTEM', day(9, 1)), noteRecord('n1', 'RE', day(9, 5))],
      facts: [
        conflicting('f1', 'birthYear', 1984, 's1', day(9, 1), 'IDENTITY'),
        conflicting('f2', 'birthYear', 1985, 'n1', day(9, 5), 'IDENTITY'),
      ],
    };

    expect(resolveKycOptions(profile, 'birthYear')).toEqual([
      { factId: 'f1', value: 1984, source: 'SYSTEM', confirmedDate: day(9, 1), disabled: false },
      { factId: 'f2', value: 1985, source: 'NOTE', confirmedDate: day(9, 5), disabled: true },
    ]);
  });

  it('offers nothing for a trường not in conflict', () => {
    const profile: KycProfileRecord = {
      notes: [noteRecord('n1', 'RE', day(9, 1))],
      facts: [
        { ...fact('residence', 'Huế'), noteId: 'n1' },
        { ...fact('residence', 'Hà Nội', 'superseded'), noteId: 'n1' },
      ],
    };

    expect(resolveKycOptions(profile, 'residence')).toEqual([]);
  });
});
