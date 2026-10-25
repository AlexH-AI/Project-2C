import { describe, expect, it } from 'vitest';
import {
  DbError,
  listAppointments,
  listStageTransitions,
  openDatabase,
  seedDemoData,
  softDeleteAppointment,
  type Database,
} from '@p2c/db';
import {
  calendarDate,
  formatDate,
  type CalendarDate,
  type CustomerStage,
  type StageTransition,
} from '@p2c/domain';
import { parseTime, readScheduleDate } from './appointment-form';
import {
  editedDay,
  heldStage,
  meetingDay,
  OUTCOME_CHOICES,
  outcomeChoices,
  outcomeLock,
  readCaseSize,
  readOutcome,
  stageAfterChoices,
  undoneMove,
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
    // As the command reads it (DR6-72, Owner 23/10/2026): nothing to see is no next step.
    for (const nextStep of ['\u{3164}', '\u{2800}', '\u{FE0F}', '\u{85}']) {
      expect(readOutcome({ ...met, nextStep })).toEqual({ ok: false, errors: ['nextStep'] });
    }
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

const move = (
  id: string,
  customerId: string,
  from: CustomerStage | null,
  to: CustomerStage,
  appointmentId: string | null = null,
  date = TODAY,
): StageTransition => ({ id, customerId, from, to, date, appointmentId });
/** A met appointment of `date` whose stage after is `stage`. */
const metOn = (id: string, customerId: string, date: CalendarDate, stage: CustomerStage) => ({
  id,
  customerId,
  date,
  status: 'MET' as const,
  stageAfter: stage,
});
const a = { id: 'a1', customerId: 'c1' };

describe('outcomeLock', () => {
  it('finds nothing to lock when the appointment moved no one', () => {
    expect(outcomeLock([move('t1', 'c1', 'N3', 'N2')], [], a)).toEqual({});
  });

  it('holds the move the appointment made while it is the latest (D7)', () => {
    const caused = move('t1', 'c1', 'N3', 'N2', 'a1');
    const elsewhere = move('t2', 'c2', 'N2', 'N1');
    expect(outcomeLock([caused, elsewhere], [], a)).toEqual({ caused });
  });

  it('is locked by a later move of the same customer', () => {
    const caused = move('t1', 'c1', 'N3', 'N2', 'a1');
    const later = move('t2', 'c1', 'N2', 'N1');
    expect(outcomeLock([caused, later], [], a)).toEqual({ caused, later });
  });

  it('is locked by a later meeting that kept the stage it moved to (D7, H·CL-F3)', () => {
    const created = move('t0', 'c1', null, 'N3', null, d(1, 9, 2026));
    const caused = move('t1', 'c1', 'N3', 'N2', 'a1', d(5, 9, 2026));
    const kept = metOn('m2', 'c1', d(12, 9, 2026), 'N2');
    const other = metOn('m3', 'c2', d(12, 9, 2026), 'N2');
    expect(outcomeLock([created, caused], [other, kept], a)).toEqual({ caused, keptBy: kept });
    // Kept that day in the stage it started from, which stays when the move goes.
    const before = metOn('m4', 'c1', d(5, 9, 2026), 'N3');
    expect(outcomeLock([created, caused], [before], a)).toEqual({ caused });
  });

  it('locks just what the command refuses to take back, on the demo data with its trash (DR6-103)', async () => {
    const db = await openDatabase();
    // The seed deletes what it may take back by the same rule; a wrong pick would throw here.
    seedDemoData(db, { anchorDate: TODAY, seed: 1, scale: DEMO_SCALE, trash: true });
    const transitions = listStageTransitions(db);
    const appointments = listAppointments(db);
    const seen = new Set<string>();
    for (const appointment of appointments) {
      const lock = outcomeLock(transitions, appointments, appointment);
      if (!lock.caused) continue;
      const expected = lock.later
        ? { code: 'TRANSITION_NOT_LATEST' }
        : lock.keptBy
          ? { code: 'STAGE_KEPT_BY_MEETING', params: { date: formatDate(lock.keptBy.date) } }
          : null;
      expect(deleteRefusal(db, appointment.id)).toEqual(expected);
      seen.add(expected?.code ?? 'deletable');
    }
    expect(seen).toEqual(new Set(['TRANSITION_NOT_LATEST', 'STAGE_KEPT_BY_MEETING', 'deletable']));
  });
});

// The demo's code path at a scale a test goes through record by record (restore-roundtrip.test.ts).
const DEMO_SCALE = { teams: 1, resPerTeam: 2, customersPerRe: 10, meetingDays: [2, 2] } as const;

/** What the command refuses deleting the appointment with, the deletion rolled back; null if none. */
function deleteRefusal(db: Database, id: string) {
  const rollback = new Error('rolled back');
  try {
    db.transaction(() => {
      softDeleteAppointment(db, id);
      throw rollback;
    });
  } catch (error) {
    if (error === rollback) return null;
    if (!(error instanceof DbError)) throw error;
    return error.params ? { code: error.code, params: error.params } : { code: error.code };
  }
  return null;
}

describe('meetingDay', () => {
  const history = [
    move('t0', 'c1', null, 'N3', null, d(1, 9, 2026)),
    move('t1', 'c1', 'N3', 'N2', null, d(15, 9, 2026)),
  ];

  it('starts a late meeting from the stage of its day, held there by a later change (H·CL-E4)', () => {
    const day = meetingDay(history, [], a, d(5, 9, 2026));
    expect(day).toEqual({ from: 'N3', change: history[1] });
    expect(heldStage(day)).toBe('N3');
    expect(heldStage(meetingDay(history, [], a, d(20, 9, 2026)))).toBeUndefined();
  });

  it('starts a meeting before the customer was created from its first stage, held there (DR-43)', () => {
    const created = history[0]!;
    const day = meetingDay([created], [], a, d(25, 8, 2026));
    // The creation comes after the meeting, as D10 tells: the stage after stays the first one.
    expect(day).toEqual({ from: 'N3', change: created });
    expect(heldStage(day)).toBe('N3');
    expect(meetingDay(history, [], a, d(25, 8, 2026))).toEqual({ from: 'N3', change: history[1] });
  });

  it('starts from the current stage when nothing came after its day', () => {
    expect(meetingDay(history, [], a, d(15, 9, 2026))).toEqual({ from: 'N2' });
    expect(meetingDay(history, [], a, d(20, 9, 2026))).toEqual({ from: 'N2' });
  });

  it('is held by a later met appointment, which recorded the stage of its own day', () => {
    const kept = metOn('m2', 'c1', d(20, 9, 2026), 'N2');
    const elsewhere = metOn('m3', 'c2', d(25, 9, 2026), 'N1');
    const held = meetingDay(history, [kept, elsewhere], a, d(18, 9, 2026));
    expect(held).toEqual({ from: 'N2', meeting: kept });
    // No change after it, yet no other stage on offer: the later meeting holds it (N2, DR6-91).
    expect(heldStage(held)).toBe('N2');
    expect(meetingDay(history, [kept], a, d(20, 9, 2026))).toEqual({ from: 'N2' });
  });

  it('leaves out the appointment itself and its own move', () => {
    const own = move('t2', 'c1', 'N2', 'N1', 'a1', d(20, 9, 2026));
    const self = metOn('a1', 'c1', d(20, 9, 2026), 'N1');
    expect(meetingDay([...history, own], [self], a, d(18, 9, 2026))).toEqual({ from: 'N2' });
  });

  it('starts a meeting kept on its day from that stage, held by a change later that day (E19)', () => {
    const later = move('t2', 'c1', 'N2', 'N3', null, d(20, 9, 2026));
    expect(meetingDay([...history, later], [], a, d(20, 9, 2026), 'N2')).toEqual({
      from: 'N2',
      change: later,
    });
    expect(meetingDay(history, [], a, d(20, 9, 2026), 'N2')).toEqual({ from: 'N2' });
  });

  it('is not held by a change earlier that day that ended in the stage kept (N1, DR6-91)', () => {
    // Met on 15/09 after the move N3 → N2 of that day, keeping N2.
    expect(meetingDay(history, [], a, d(15, 9, 2026), 'N2')).toEqual({ from: 'N2' });
  });
});

describe('editedDay (6f)', () => {
  const history = [
    move('t0', 'c1', null, 'N3', null, d(1, 9, 2026)),
    move('t1', 'c1', 'N3', 'N2', null, d(15, 9, 2026)),
  ];
  const later = move('t2', 'c1', 'N2', 'N3', null, d(20, 9, 2026));
  const kept = metOn('a1', 'c1', d(20, 9, 2026), 'N2');

  it('starts a meeting kept on its own day from that stage, held by a change later that day (E19, R04g)', () => {
    const day = editedDay([...history, later], [kept], kept, d(20, 9, 2026));
    expect(day).toEqual({ from: 'N2', change: later });
    expect(heldStage(day)).toBe('N2');
  });

  it('starts from the stage of the day once moved to another day', () => {
    expect(editedDay([...history, later], [kept], kept, d(21, 9, 2026))).toEqual({ from: 'N3' });
  });

  it('starts a meeting that moved the stage from the stage of its day without the move', () => {
    const caused = move('t2', 'c1', 'N2', 'N1', 'a1', d(20, 9, 2026));
    const moved = metOn('a1', 'c1', d(20, 9, 2026), 'N1');
    expect(editedDay([...history, caused], [moved], moved, d(20, 9, 2026))).toEqual({
      from: 'N2',
    });
  });
});

describe('undoneMove (DR6-70)', () => {
  const created = move('t0', 'c1', null, 'N4', null, d(1, 9, 2026));
  const manual = move('t1', 'c1', 'N4', 'N3', null, d(10, 9, 2026));
  const caused = move('t2', 'c1', 'N3', 'N2', 'a1', d(15, 9, 2026));
  const transitions = [created, manual, caused];
  const meeting = metOn('a1', 'c1', d(15, 9, 2026), 'N2');

  it('withdraws the move of a meeting moved before another change, held at the stage of that day', () => {
    // CL2-E1: 15/09 → 05/09, before the change of 10/09; the stage after holds at N4.
    const day = editedDay(transitions, [meeting], meeting, d(5, 9, 2026));
    expect(day).toEqual({ from: 'N4', change: manual });
    const lock = outcomeLock(transitions, [meeting], meeting);
    expect(undoneMove(lock, 'MET', heldStage(day)!, day.from!)).toBe(caused);
  });

  it('withdraws it for another status, or a stage after kept at the stage of the day', () => {
    expect(undoneMove({ caused }, 'CANCELLED', null, 'N3')).toBe(caused);
    expect(undoneMove({ caused }, 'NO_SHOW', null, 'N3')).toBe(caused);
    expect(undoneMove({ caused }, 'MET', 'N3', 'N3')).toBe(caused);
  });

  it('records a move in its place for another stage after, or the same move on another day', () => {
    expect(undoneMove({ caused }, 'MET', 'N2', 'N3')).toBeUndefined();
    expect(undoneMove({ caused }, 'MET', 'N1', 'N3')).toBeUndefined();
  });

  it('has nothing to withdraw for a meeting that moved nothing or is locked (D7)', () => {
    expect(undoneMove({}, 'CANCELLED', null, 'N3')).toBeUndefined();
    const later = move('t3', 'c1', 'N2', 'N1', null, d(16, 9, 2026));
    expect(undoneMove({ caused, later }, 'MET', 'N3', 'N3')).toBeUndefined();
    const keptBy = metOn('m2', 'c1', d(16, 9, 2026), 'N2');
    expect(undoneMove({ caused, keptBy }, 'CANCELLED', null, 'N3')).toBeUndefined();
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
