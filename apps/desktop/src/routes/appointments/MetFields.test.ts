import { describe, expect, it } from 'vitest';
import type { AppointmentRecord } from '@p2c/db';
import { calendarDate, parseVnd } from '@p2c/domain';
import { metDraftOf } from './MetFields';

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
