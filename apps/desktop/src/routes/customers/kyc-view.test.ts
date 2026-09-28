import type { KycNoteRecord, KycVersionRecord } from '@p2c/db';
import type { CalendarDate, KycFact, StageTransition } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { factText, kycOverview, kycTimeline } from './kyc-view';

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
