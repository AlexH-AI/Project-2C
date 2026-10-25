import { describe, expect, it } from 'vitest';
import type { AppointmentRecord } from '@p2c/db';
import { calendarDate, parseVnd } from '@p2c/domain';
import { caseSizeRead, metDraftOf } from './MetFields';

const met: AppointmentRecord = {
  id: 'a-1',
  customerId: 'c-1',
  reId: 'p-re',
  coordinatorIds: [],
  date: calendarDate(2026, 9, 10),
  time: null,
  status: 'MET',
  stageAfter: 'N2',
  expectedCaseSize: 500_000_000,
  nextStep: 'Gặp cùng TL',
  note: '',
  triggerType: 'REFERRAL',
  triggerNote: null,
  rescheduledFromId: null,
  outcomeReviewerId: 'p-tl',
};

describe('metDraftOf', () => {
  it('fills the draft from a met appointment, keeping its reviewer', () => {
    const draft = metDraftOf(met);
    expect(draft).toMatchObject({ stageAfter: 'N2', reviewerId: 'p-tl', nextStep: 'Gặp cùng TL' });
    expect(parseVnd(draft.caseSize)).toEqual({ ok: true, amount: 500_000_000 });
  });

  it('leaves missing values empty', () => {
    expect(
      metDraftOf({ ...met, outcomeReviewerId: null, nextStep: null, expectedCaseSize: null }),
    ).toEqual({ stageAfter: 'N2', reviewerId: '', nextStep: '', caseSize: '' });
  });
});

// Mockups 6c, 6d; NT-LH-25. Under a million the compact form is the full one (review of PR 758).
describe('caseSizeRead', () => {
  it('reads the amount back in full, then in short', () => {
    expect(caseSizeRead(800_000_000)).toBe('800.000.000 ₫ (800 tr)');
    expect(caseSizeRead(1_234_000_000)).toBe('1.234.000.000 ₫ (1,23 tỷ)');
  });

  it('gives the full form once under a million', () => {
    expect(caseSizeRead(500_000)).toBe('500.000 ₫');
  });
});
