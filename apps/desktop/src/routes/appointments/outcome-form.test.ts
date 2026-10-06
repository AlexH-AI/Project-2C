import { describe, expect, it } from 'vitest';
import { calendarDate, formatDate, type CustomerStage, type StageTransition } from '@p2c/domain';
import { parseTime, readScheduleDate } from './appointment-form';
import {
  OUTCOME_CHOICES,
  outcomeChoices,
  outcomeLock,
  readCaseSize,
  readOutcome,
  stageAfterChoices,
  withoutError,
  type OutcomeDraft,
} from './outcome-form';

const d = (day: number, month: number, year: number) => calendarDate(year, month, day);
const TODAY = d(26, 9, 2026);

const met: OutcomeDraft = {
  status: 'MET',
  stageAfter: 'N1',
  reviewerId: 'p-tl',
  nextStep: '  Gặp cùng TL  ',
  caseSize: '800tr',
  note: 'Con lớn du học 2029',
  next: null,
};

const next = (date: string, time = '') => ({
  date: readScheduleDate(date, TODAY, 'fromToday'),
  time: parseTime(time),
});

describe('readOutcome', () => {
  it('reads a met outcome with its stage after, next step, case size and reviewer', () => {
    expect(readOutcome(met)).toEqual({
      ok: true,
      outcome: {
        status: 'MET',
        stageAfter: 'N1',
        nextStep: 'Gặp cùng TL',
        expectedCaseSize: 800_000_000,
        note: 'Con lớn du học 2029',
        outcomeReviewerId: 'p-tl',
      },
      next: null,
    });
  });

  it('needs a stage after and a next step when met; case size and reviewer may stay empty', () => {
    expect(readOutcome({ ...met, stageAfter: null, nextStep: '  ' })).toEqual({
      ok: false,
      errors: ['stageAfter', 'nextStep'],
    });
    const read = readOutcome({ ...met, caseSize: ' ', reviewerId: '' });
    expect(read.ok && read.outcome).toMatchObject({
      expectedCaseSize: null,
      outcomeReviewerId: null,
    });
  });

  it('refuses a case size that is not a whole, positive amount of đồng', () => {
    for (const caseSize of ['12,5 đồng', '0']) {
      expect(readOutcome({ ...met, caseSize })).toEqual({
        ok: false,
        errors: ['caseSize'],
      });
    }
  });

  it('keeps only the note when not met, whatever else was typed', () => {
    for (const status of ['CANCELLED', 'NO_SHOW'] as const) {
      expect(readOutcome({ ...met, status, caseSize: 'sai' })).toEqual({
        ok: true,
        outcome: { status, note: 'Con lớn du học 2029' },
        next: null,
      });
    }
  });

  it('books the next appointment from today on, with its time when given', () => {
    const read = readOutcome({ ...met, status: 'NO_SHOW', next: next('1/10', '9:00') });
    expect(read.ok && read.next && formatDate(read.next.date)).toBe('01/10/2026');
    expect(read.ok && read.next?.time).toBe('09:00');

    expect(readOutcome({ ...met, next: next('20/9', '25:00') })).toEqual({
      ok: false,
      errors: ['nextDate', 'nextTime'],
    });
    expect(readOutcome({ ...met, next: next('') })).toEqual({ ok: false, errors: ['nextDate'] });
  });
});

describe('withoutError', () => {
  it('drops the error of the field just changed and keeps the others', () => {
    expect(withoutError(['stageAfter', 'nextStep', 'nextDate'], 'nextStep')).toEqual([
      'stageAfter',
      'nextDate',
    ]);
    expect(withoutError(['stageAfter'], 'note')).toEqual(['stageAfter']);
  });
});

describe('outcomeChoices', () => {
  const scheduled = (date = TODAY) => ({ status: 'SCHEDULED' as const, date });
  const disabled = (choices: ReturnType<typeof outcomeChoices>) =>
    choices.filter((choice) => choice.disabled).map((choice) => choice.value);

  it('offers every status for a scheduled appointment of today or before', () => {
    expect(outcomeChoices(scheduled(), TODAY).map((choice) => choice.value)).toEqual([
      'MET',
      'RESCHEDULED',
      'CANCELLED',
      'NO_SHOW',
    ]);
    expect(disabled(outcomeChoices(scheduled(), TODAY))).toEqual([]);
    expect(disabled(outcomeChoices(scheduled(d(1, 9, 2026)), TODAY))).toEqual([]);
  });

  it('holds met and no-show until the day comes (Owner 29/09)', () => {
    expect(disabled(outcomeChoices(scheduled(d(27, 9, 2026)), TODAY))).toEqual(['MET', 'NO_SHOW']);
  });

  it('offers nothing for an appointment that was already moved (D3)', () => {
    for (const date of [TODAY, d(27, 9, 2026)]) {
      expect(disabled(outcomeChoices({ status: 'RESCHEDULED', date }, TODAY))).toEqual(
        OUTCOME_CHOICES,
      );
    }
  });

  it('reschedules only a scheduled appointment', () => {
    expect(disabled(outcomeChoices({ status: 'MET', date: TODAY }, TODAY))).toEqual([
      'RESCHEDULED',
    ]);
  });
});

describe('outcomeLock', () => {
  const move = (
    id: string,
    customerId: string,
    from: CustomerStage,
    to: CustomerStage,
    appointmentId: string | null = null,
  ): StageTransition => ({ id, customerId, from, to, date: TODAY, appointmentId });
  const a = { id: 'a1', customerId: 'c1' };

  it('finds nothing to lock when the appointment moved no one', () => {
    expect(outcomeLock([move('t1', 'c1', 'N3', 'N2')], a)).toEqual({});
  });

  it('holds the move the appointment made while it is the latest (D7)', () => {
    const caused = move('t1', 'c1', 'N3', 'N2', 'a1');
    const elsewhere = move('t2', 'c2', 'N2', 'N1');
    expect(outcomeLock([caused, elsewhere], a)).toEqual({ caused });
  });

  it('is locked by a later move of the same customer', () => {
    const caused = move('t1', 'c1', 'N3', 'N2', 'a1');
    const later = move('t2', 'c1', 'N2', 'N1');
    expect(outcomeLock([caused, later], a)).toEqual({ caused, later });
  });
});

describe('stageAfterChoices', () => {
  it('offers every stage from an open one, the current one kept', () => {
    const choices = stageAfterChoices('N3');
    expect(choices.map((c) => c.stage)).toEqual(['N4', 'N3', 'N2', 'N1', 'ON_HOLD', 'LOST']);
    expect(choices.filter((c) => c.current).map((c) => c.stage)).toEqual(['N3']);
    expect(choices.every((c) => c.allowed)).toBe(true);
  });

  it('from a closed stage, no open stage but N3 (ADR-0007)', () => {
    const refused = stageAfterChoices('LOST').filter((c) => !c.allowed);
    expect(refused.map((c) => c.stage)).toEqual(['N4', 'N2', 'N1']);
  });
});

describe('readCaseSize', () => {
  it('reads an empty text as no case size', () => {
    expect(readCaseSize('')).toBeNull();
    expect(readCaseSize('  ')).toBeNull();
  });

  it('reads a positive amount', () => {
    expect(readCaseSize('800tr')).toEqual({ ok: true, amount: 800_000_000 });
  });

  it('rejects zero and text that is not an amount', () => {
    expect(readCaseSize('0')).toMatchObject({ ok: false });
    expect(readCaseSize('sai')).toMatchObject({ ok: false });
  });
});
