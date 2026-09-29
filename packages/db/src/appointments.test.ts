import { stageOn } from '@p2c/domain';
import { describe, expect, it, vi } from 'vitest';
import {
  getAppointment,
  listAppointments,
  recordMeetingOutcome,
  recordOutcomeWithNext,
  rescheduleAppointment,
  restoreAppointment,
  scheduleAppointment,
  softDeleteAppointment,
  updateAppointmentDetails,
} from './appointments';
import {
  changeStageManually,
  createCustomer,
  getCustomer,
  listStageTransitions,
  softDeleteCustomer,
} from './customers';
import { createPerson, softDeletePerson, updatePerson } from './team';
import { codeOf, d, setup } from './test-support';

async function withCustomer() {
  const ctx = await setup();
  const customer = createCustomer(ctx.db, {
    name: 'Lan',
    reId: ctx.re.id,
    stage: 'N3',
    date: d(1, 1),
  });
  const schedule = (day = 10, coordinatorIds: string[] = []) =>
    scheduleAppointment(ctx.db, {
      customerId: customer.id,
      reId: ctx.re.id,
      date: d(day, 1),
      triggerType: 'REFERRAL',
      coordinatorIds,
    });
  const stage = () => getCustomer(ctx.db, customer.id)?.stage;
  return { ...ctx, customer, schedule, stage };
}

const MET_N2 = { status: 'MET', stageAfter: 'N2', nextStep: 'Gửi minh họa' } as const;

describe('scheduleAppointment', () => {
  it('schedules an appointment with its trigger and coordinators', async () => {
    const { db, re, tl, customer } = await withCustomer();

    const appointment = scheduleAppointment(db, {
      customerId: customer.id,
      reId: re.id,
      date: d(10, 1),
      time: '09:30',
      triggerType: 'EVENT',
      triggerNote: ' Hội thảo ',
      coordinatorIds: [tl.id],
    });

    expect(appointment).toEqual({
      id: expect.any(String),
      customerId: customer.id,
      reId: re.id,
      coordinatorIds: [tl.id],
      date: d(10, 1),
      time: '09:30',
      status: 'SCHEDULED',
      triggerType: 'EVENT',
      triggerNote: 'Hội thảo',
      stageAfter: null,
      expectedCaseSize: null,
      nextStep: null,
      note: '',
      rescheduledFromId: null,
      outcomeReviewerId: null,
    });
    expect(getAppointment(db, appointment.id)).toEqual(appointment);
    expect(listAppointments(db)).toEqual([appointment]);
  });

  it('refuses a bad time, a coordinator who is the RE or unknown, and a missing customer', async () => {
    const { db, re, tl, customer } = await withCustomer();
    const base = {
      customerId: customer.id,
      reId: re.id,
      date: d(10, 1),
      triggerType: 'OTHER' as const,
    };

    expect(codeOf(() => scheduleAppointment(db, { ...base, time: '24:00' }))).toBe('INVALID_TIME');
    expect(codeOf(() => scheduleAppointment(db, { ...base, time: '9:30' }))).toBe('INVALID_TIME');
    expect(codeOf(() => scheduleAppointment(db, { ...base, coordinatorIds: [re.id] }))).toBe(
      'INVALID_COORDINATOR',
    );
    expect(codeOf(() => scheduleAppointment(db, { ...base, coordinatorIds: ['x'] }))).toBe(
      'PERSON_NOT_FOUND',
    );
    expect(codeOf(() => scheduleAppointment(db, { ...base, reId: tl.id }))).toBe('RE_REQUIRED');
    expect(codeOf(() => scheduleAppointment(db, { ...base, customerId: 'x' }))).toBe(
      'CUSTOMER_NOT_FOUND',
    );
    expect(listAppointments(db)).toEqual([]);
  });
});

describe('listAppointments', () => {
  it('reads the coordinators of every appointment in one query, not one per appointment', async () => {
    const { db, re, otherRe, tl, customer, schedule } = await withCustomer();
    const other = createCustomer(db, {
      name: 'Minh',
      reId: otherRe.id,
      stage: 'N2',
      date: d(1, 1),
    });
    const prepare = vi.spyOn(db.sqlite, 'prepare');
    const queries = () => {
      prepare.mockClear();
      listAppointments(db);
      return prepare.mock.calls.length;
    };
    const plain = schedule(10);
    const one = queries();
    const both = scheduleAppointment(db, {
      customerId: customer.id,
      reId: re.id,
      date: d(11, 1),
      triggerType: 'EVENT',
      coordinatorIds: [tl.id, otherRe.id],
    });
    const theirs = scheduleAppointment(db, {
      customerId: other.id,
      reId: otherRe.id,
      date: d(12, 1),
      triggerType: 'OTHER',
      coordinatorIds: [tl.id],
    });

    expect(queries()).toBe(one);
    expect(listAppointments(db)).toEqual([plain, both, theirs]);
    expect(both.coordinatorIds).toEqual([tl.id, otherRe.id].sort());
    expect(listAppointments(db, other.id)).toEqual([theirs]);
  });
});

describe('recordMeetingOutcome', () => {
  it('moves the customer through a transition that points to the appointment', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    const appointment = schedule();

    const met = recordMeetingOutcome(db, appointment.id, {
      ...MET_N2,
      expectedCaseSize: 500_000_000,
      note: 'Quan tâm hưu trí',
    });

    expect(met).toMatchObject({
      status: 'MET',
      stageAfter: 'N2',
      nextStep: 'Gửi minh họa',
      expectedCaseSize: 500_000_000,
      note: 'Quan tâm hưu trí',
    });
    expect(stage()).toBe('N2');
    expect(listStageTransitions(db, customer.id).at(-1)).toMatchObject({
      from: 'N3',
      to: 'N2',
      date: d(10, 1),
      appointmentId: appointment.id,
    });
  });

  it('records no transition when the stage after is the current stage', async () => {
    const { db, customer, schedule } = await withCustomer();

    recordMeetingOutcome(db, schedule().id, { ...MET_N2, stageAfter: 'N3' });

    expect(listStageTransitions(db, customer.id)).toHaveLength(1);
  });

  it('requires a stage after and a next step when met, and neither otherwise', async () => {
    const { db, schedule } = await withCustomer();
    const { id } = schedule();

    expect(codeOf(() => recordMeetingOutcome(db, id, { status: 'MET', nextStep: 'x' }))).toBe(
      'OUTCOME_REQUIRED',
    );
    expect(codeOf(() => recordMeetingOutcome(db, id, { ...MET_N2, nextStep: ' ' }))).toBe(
      'OUTCOME_REQUIRED',
    );
    expect(
      codeOf(() => recordMeetingOutcome(db, id, { status: 'NO_SHOW', stageAfter: 'N2' })),
    ).toBe('STAGE_AFTER_NOT_ALLOWED');
    expect(
      codeOf(() => recordMeetingOutcome(db, id, { status: 'RESCHEDULED' as 'MET', ...{} })),
    ).toBe('INVALID_STATUS');
    expect(codeOf(() => recordMeetingOutcome(db, id, { ...MET_N2, expectedCaseSize: -1 }))).toBe(
      'INVALID_AMOUNT',
    );
    expect(codeOf(() => recordMeetingOutcome(db, 'x', MET_N2))).toBe('APPOINTMENT_NOT_FOUND');
    expect(
      recordMeetingOutcome(db, id, { status: 'CANCELLED', nextStep: 'Hẹn lại' }),
    ).toMatchObject({ status: 'CANCELLED', stageAfter: null, nextStep: 'Hẹn lại' });
  });

  it('re-records an outcome by withdrawing its transition while it is the latest (D7)', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, MET_N2);

    recordMeetingOutcome(db, id, { ...MET_N2, stageAfter: 'N1' });
    expect(stage()).toBe('N1');
    expect(listStageTransitions(db, customer.id).map((t) => [t.from, t.to])).toEqual([
      [null, 'N3'],
      ['N3', 'N1'],
    ]);

    recordMeetingOutcome(db, id, { status: 'NO_SHOW' });
    expect(stage()).toBe('N3');
    expect(listStageTransitions(db, customer.id)).toHaveLength(1);
  });

  it('blocks changing an outcome whose transition is no longer the latest (D7)', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, MET_N2);
    changeStageManually(db, customer.id, { to: 'N1', date: d(12, 1) });

    expect(codeOf(() => recordMeetingOutcome(db, id, { status: 'NO_SHOW' }))).toBe(
      'TRANSITION_NOT_LATEST',
    );
    expect(codeOf(() => softDeleteAppointment(db, id))).toBe('TRANSITION_NOT_LATEST');
    expect(stage()).toBe('N1');
    expect(getAppointment(db, id)?.status).toBe('MET');
  });

  it('edits the other fields once the transition is no longer the latest, keeping it (D7)', async () => {
    const { db, tl, customer, schedule, stage } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, MET_N2);
    const caused = listStageTransitions(db, customer.id)[1];
    changeStageManually(db, customer.id, { to: 'N1', date: d(12, 1) });

    const edited = recordMeetingOutcome(db, id, {
      ...MET_N2,
      nextStep: 'Gặp cùng TL',
      expectedCaseSize: 800_000_000,
      note: 'Hai vợ chồng cùng quyết',
      outcomeReviewerId: tl.id,
    });

    expect(edited).toMatchObject({
      status: 'MET',
      stageAfter: 'N2',
      nextStep: 'Gặp cùng TL',
      expectedCaseSize: 800_000_000,
      note: 'Hai vợ chồng cùng quyết',
      outcomeReviewerId: tl.id,
    });
    expect(listStageTransitions(db, customer.id)[1]).toEqual(caused);
    expect(stage()).toBe('N1');
    // The three locked fields: status, stage after and the meeting day.
    expect(codeOf(() => recordMeetingOutcome(db, id, { status: 'CANCELLED' }))).toBe(
      'TRANSITION_NOT_LATEST',
    );
    expect(codeOf(() => recordMeetingOutcome(db, id, { ...MET_N2, stageAfter: 'N1' }))).toBe(
      'TRANSITION_NOT_LATEST',
    );
    expect(codeOf(() => updateAppointmentDetails(db, id, { date: d(11, 1) }))).toBe(
      'TRANSITION_NOT_LATEST',
    );
    expect(updateAppointmentDetails(db, id, { triggerType: 'EVENT' }).triggerType).toBe('EVENT');
  });

  it('keeps the same transition when a met outcome is saved again unchanged', async () => {
    const { db, customer, schedule } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, MET_N2);
    const before = listStageTransitions(db, customer.id);

    recordMeetingOutcome(db, id, { ...MET_N2, note: 'Thêm ghi chú' });

    expect(listStageTransitions(db, customer.id)).toEqual(before);
  });
});

// D9: who decided the stage after the meeting — optional, any role, only on a met appointment.
describe('outcome reviewer', () => {
  it('keeps a live person of any role as reviewer of a met appointment, or none', async () => {
    const { db, schedule } = await withCustomer();
    const is = createPerson(db, { name: 'Tâm', role: 'IS', teamId: null });
    const { id } = schedule();

    expect(recordMeetingOutcome(db, id, { ...MET_N2, outcomeReviewerId: is.id })).toMatchObject({
      outcomeReviewerId: is.id,
    });
    expect(getAppointment(db, id)?.outcomeReviewerId).toBe(is.id);
    expect(recordMeetingOutcome(db, id, MET_N2).outcomeReviewerId).toBeNull();
  });

  it('refuses a reviewer on another status, and one deleted or unknown, recording nothing', async () => {
    const { db, tl, otherRe, schedule } = await withCustomer();
    const { id } = schedule();
    softDeletePerson(db, otherRe.id);

    expect(
      codeOf(() => recordMeetingOutcome(db, id, { status: 'NO_SHOW', outcomeReviewerId: tl.id })),
    ).toBe('REVIEWER_NOT_ALLOWED');
    expect(
      codeOf(() => recordMeetingOutcome(db, id, { ...MET_N2, outcomeReviewerId: otherRe.id })),
    ).toBe('PERSON_NOT_FOUND');
    expect(codeOf(() => recordMeetingOutcome(db, id, { ...MET_N2, outcomeReviewerId: 'x' }))).toBe(
      'PERSON_NOT_FOUND',
    );
    expect(getAppointment(db, id)?.status).toBe('SCHEDULED');
  });

  it('clears the reviewer when a met appointment becomes cancelled', async () => {
    const { db, tl, schedule } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, { ...MET_N2, outcomeReviewerId: tl.id });

    expect(recordMeetingOutcome(db, id, { status: 'CANCELLED' }).outcomeReviewerId).toBeNull();
  });

  it('keeps a reviewer of a live appointment from deletion, and restores none they left', async () => {
    const { db, tl, schedule } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, { ...MET_N2, outcomeReviewerId: tl.id });

    expect(codeOf(() => softDeletePerson(db, tl.id))).toBe('PERSON_IN_USE');
    softDeleteAppointment(db, id);
    softDeletePerson(db, tl.id);

    expect(codeOf(() => restoreAppointment(db, id))).toBe('PERSON_NOT_FOUND');
  });
});

// Mockups 6c, 6i: "Hẹn lần tiếp theo" is saved with the outcome, in one transaction.
describe('recordOutcomeWithNext', () => {
  it('records the outcome and books the next appointment like it, without linking them', async () => {
    const { db, re, tl, customer, stage } = await withCustomer();
    const { id } = scheduleAppointment(db, {
      customerId: customer.id,
      reId: re.id,
      date: d(10, 1),
      time: '09:00',
      triggerType: 'EVENT',
      triggerNote: 'Hội thảo',
      coordinatorIds: [tl.id],
    });

    const saved = recordOutcomeWithNext(db, id, MET_N2, { date: d(20, 1), time: '14:00' });

    expect(saved.recorded).toMatchObject({ id, status: 'MET', stageAfter: 'N2' });
    expect(saved.next).toEqual({
      id: expect.any(String),
      customerId: customer.id,
      reId: re.id,
      coordinatorIds: [tl.id],
      date: d(20, 1),
      time: '14:00',
      status: 'SCHEDULED',
      triggerType: 'EVENT',
      triggerNote: 'Hội thảo',
      stageAfter: null,
      expectedCaseSize: null,
      nextStep: null,
      note: '',
      rescheduledFromId: null,
      outcomeReviewerId: null,
    });
    expect(stage()).toBe('N2');
    expect(listAppointments(db).map((a) => a.id)).toEqual([id, saved.next.id]);
  });

  it('books after a cancelled or no-show appointment too', async () => {
    const { db, schedule } = await withCustomer();

    const saved = recordOutcomeWithNext(
      db,
      schedule().id,
      { status: 'NO_SHOW' },
      { date: d(1, 2) },
    );

    expect(saved.recorded.status).toBe('NO_SHOW');
    expect(saved.next).toMatchObject({ date: d(1, 2), time: null, status: 'SCHEDULED' });
  });

  it('saves nothing when the next day has passed or either part is refused', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    const { id } = schedule();
    // The test clock reads 26/09/2026.
    const next = { date: d(20, 1) };

    expect(codeOf(() => recordOutcomeWithNext(db, id, MET_N2, { date: d(25, 9, 2026) }))).toBe(
      'NEXT_APPOINTMENT_PAST',
    );
    expect(
      codeOf(() => recordOutcomeWithNext(db, id, { status: 'MET', nextStep: 'x' }, next)),
    ).toBe('OUTCOME_REQUIRED');
    expect(codeOf(() => recordOutcomeWithNext(db, id, MET_N2, { ...next, time: '25:00' }))).toBe(
      'INVALID_TIME',
    );
    expect(listAppointments(db).map((a) => a.status)).toEqual(['SCHEDULED']);
    expect(stage()).toBe('N3');
    expect(listStageTransitions(db, customer.id)).toHaveLength(1);
    expect(recordOutcomeWithNext(db, id, MET_N2, { date: d(26, 9, 2026) }).next.date).toEqual(
      d(26, 9, 2026),
    );
  });
});

// Mockup 6f: the trigger, coordinators and meeting day are edited with the outcome.
describe('updateAppointmentDetails', () => {
  it('changes the trigger, time and coordinators', async () => {
    const { db, tl, otherRe, schedule } = await withCustomer();
    const { id } = schedule(10, [tl.id]);

    const edited = updateAppointmentDetails(db, id, {
      time: '15:30',
      triggerType: 'OCCASION',
      triggerNote: ' Sinh nhật ',
      coordinatorIds: [otherRe.id, otherRe.id],
    });

    expect(edited).toMatchObject({
      time: '15:30',
      triggerType: 'OCCASION',
      triggerNote: 'Sinh nhật',
      coordinatorIds: [otherRe.id],
    });
    expect(getAppointment(db, id)).toEqual(edited);
    expect(updateAppointmentDetails(db, id, { triggerNote: null, time: null })).toMatchObject({
      time: null,
      triggerType: 'OCCASION',
      triggerNote: null,
      coordinatorIds: [otherRe.id],
    });
  });

  it('adds no coordinator who is deleted, unknown or the RE, and changes nothing then', async () => {
    const { db, re, tl, otherRe, schedule } = await withCustomer();
    const { id } = schedule(10, [tl.id]);
    const deleted = schedule(11).id;
    softDeleteAppointment(db, deleted);
    softDeletePerson(db, otherRe.id);

    const refused = (coordinatorIds: string[]) =>
      codeOf(() => updateAppointmentDetails(db, id, { triggerType: 'OTHER', coordinatorIds }));
    expect(refused([otherRe.id])).toBe('PERSON_NOT_FOUND');
    expect(refused(['x'])).toBe('PERSON_NOT_FOUND');
    expect(refused([re.id])).toBe('INVALID_COORDINATOR');
    expect(codeOf(() => updateAppointmentDetails(db, id, { time: '7h' }))).toBe('INVALID_TIME');
    expect(codeOf(() => updateAppointmentDetails(db, deleted, {}))).toBe('APPOINTMENT_NOT_FOUND');
    expect(getAppointment(db, id)).toMatchObject({
      triggerType: 'REFERRAL',
      coordinatorIds: [tl.id],
    });
  });

  it('moves the transition of a met appointment to its new day', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, MET_N2);

    updateAppointmentDetails(db, id, { date: d(14, 1) });

    expect(getAppointment(db, id)?.date).toEqual(d(14, 1));
    expect(
      listStageTransitions(db, customer.id).map((t) => [t.to, t.date, t.appointmentId]),
    ).toEqual([
      ['N3', d(1, 1), null],
      ['N2', d(14, 1), id],
    ]);
    expect(stage()).toBe('N2');
    // D10: never before the transition that came before it.
    expect(codeOf(() => updateAppointmentDetails(db, id, { date: d(1, 12, 2026) }))).toBe(
      'TRANSITION_BEFORE_LATEST',
    );
    expect(getAppointment(db, id)?.date).toEqual(d(14, 1));
  });

  it('makes no transition when the day of a met appointment that moved no one changes', async () => {
    const { db, customer, schedule } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, { ...MET_N2, stageAfter: 'N3' });
    changeStageManually(db, customer.id, { to: 'N2', date: d(12, 1) });

    updateAppointmentDetails(db, id, { date: d(11, 1) });

    expect(listStageTransitions(db, customer.id).map((t) => t.to)).toEqual(['N3', 'N2']);
  });
});

// D10 (#99): an outcome recorded late may not move the customer back before a later stage change.
describe('recording an outcome late', () => {
  async function changedAfterMeeting() {
    const ctx = await withCustomer();
    const { id } = ctx.schedule(5);
    changeStageManually(ctx.db, ctx.customer.id, { to: 'N4', date: d(20, 1) });
    return { ...ctx, id };
  }

  it('refuses a stage after dated before a later stage change, recording nothing', async () => {
    const { db, customer, id, stage } = await changedAfterMeeting();

    expect(codeOf(() => recordMeetingOutcome(db, id, { ...MET_N2, stageAfter: 'N1' }))).toBe(
      'TRANSITION_BEFORE_LATEST',
    );
    expect(getAppointment(db, id)?.status).toBe('SCHEDULED');
    expect(stage()).toBe('N4');
    expect(listStageTransitions(db, customer.id)).toHaveLength(2);
  });

  it('records an outcome that makes no transition: the current stage, cancelled or no-show', async () => {
    const { db, customer, id, stage } = await changedAfterMeeting();

    expect(recordMeetingOutcome(db, id, { ...MET_N2, stageAfter: 'N4' }).status).toBe('MET');
    expect(recordMeetingOutcome(db, id, { status: 'CANCELLED' }).status).toBe('CANCELLED');
    expect(recordMeetingOutcome(db, id, { status: 'NO_SHOW' }).status).toBe('NO_SHOW');
    expect(stage()).toBe('N4');
    expect(listStageTransitions(db, customer.id)).toHaveLength(2);
  });

  it('records a late outcome on the meeting day when nothing later happened', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    const { id } = schedule(5);
    changeStageManually(db, customer.id, { to: 'N4', date: d(3, 1) });

    recordMeetingOutcome(db, id, { ...MET_N2, stageAfter: 'N1' });

    const transitions = listStageTransitions(db, customer.id);
    expect(transitions.at(-1)).toMatchObject({ from: 'N4', to: 'N1', date: d(5, 1) });
    expect(stageOn(transitions.slice(0, -1), customer.id, d(5, 1))).toBe('N4');
    expect(stageOn(transitions, customer.id, d(31, 1))).toBe(stage());
  });
});

describe('rescheduleAppointment', () => {
  it('creates a new appointment pointing back to the old one, which becomes rescheduled', async () => {
    const { db, tl, customer, re } = await withCustomer();
    const old = scheduleAppointment(db, {
      customerId: customer.id,
      reId: re.id,
      date: d(8, 1),
      triggerType: 'OCCASION',
      coordinatorIds: [tl.id],
    });

    const moved = rescheduleAppointment(db, old.id, { date: d(15, 1), time: '14:00' });

    expect(getAppointment(db, old.id)?.status).toBe('RESCHEDULED');
    expect(moved).toMatchObject({
      date: d(15, 1),
      time: '14:00',
      status: 'SCHEDULED',
      triggerType: 'OCCASION',
      coordinatorIds: [tl.id],
      rescheduledFromId: old.id,
    });
    expect(moved.id).not.toBe(old.id);
    expect(codeOf(() => rescheduleAppointment(db, old.id, { date: d(20, 1) }))).toBe(
      'APPOINTMENT_NOT_SCHEDULED',
    );
    expect(codeOf(() => recordMeetingOutcome(db, old.id, MET_N2))).toBe('INVALID_STATUS');
  });

  it('writes the reason into the old appointment note, the new one starting without a note', async () => {
    const { db, schedule } = await withCustomer();
    const plain = schedule();
    const noted = schedule();
    rescheduleAppointment(db, plain.id, { date: d(15, 1) }, '  ');
    const moved = rescheduleAppointment(db, noted.id, { date: d(15, 1) }, ' KH đi công tác ');

    expect(getAppointment(db, plain.id)?.note).toBe('');
    expect(getAppointment(db, noted.id)?.note).toBe('KH đi công tác');
    expect(moved.note).toBe('');
  });
});

describe('deleting appointments', () => {
  it('withdraws the latest transition on delete and applies it again on restore', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, MET_N2);

    softDeleteAppointment(db, id);
    expect(stage()).toBe('N3');
    expect(getAppointment(db, id)).toBeUndefined();
    expect(listAppointments(db)).toEqual([]);
    expect(codeOf(() => softDeleteAppointment(db, id))).toBe('APPOINTMENT_NOT_FOUND');

    restoreAppointment(db, id);
    expect(stage()).toBe('N2');
    expect(listStageTransitions(db, customer.id).at(-1)?.appointmentId).toBe(id);
    changeStageManually(db, customer.id, { to: 'N3', date: d(11, 1) });
    restoreAppointment(db, id); // already live: nothing changes
    expect(stage()).toBe('N3');
    expect(codeOf(() => restoreAppointment(db, 'x'))).toBe('APPOINTMENT_NOT_FOUND');
  });

  it('restores no met appointment whose transition would now come before a later one', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, MET_N2);
    softDeleteAppointment(db, id);
    changeStageManually(db, customer.id, { to: 'N4', date: d(15, 1) });

    expect(codeOf(() => restoreAppointment(db, id))).toBe('TRANSITION_BEFORE_LATEST');
    expect(getAppointment(db, id)).toBeUndefined();
    expect(stage()).toBe('N4');
  });

  it('restores no appointment whose RE or coordinator left while it was deleted', async () => {
    const { db, re, otherRe, tl, customer } = await withCustomer();
    const book = (reId: string, coordinatorIds: string[]) =>
      scheduleAppointment(db, {
        customerId: customer.id,
        reId,
        date: d(10, 1),
        triggerType: 'OTHER',
        coordinatorIds,
      }).id;
    const coordinated = book(re.id, [tl.id]);
    const owned = book(otherRe.id, []);
    softDeleteAppointment(db, coordinated);
    softDeleteAppointment(db, owned);
    softDeletePerson(db, tl.id);
    updatePerson(db, otherRe.id, { role: 'TL' });

    expect(codeOf(() => restoreAppointment(db, coordinated))).toBe('PERSON_NOT_FOUND');
    expect(codeOf(() => restoreAppointment(db, owned))).toBe('RE_REQUIRED');
    expect(listAppointments(db)).toEqual([]);
  });

  it('hides the appointments of a deleted customer and restores none of them', async () => {
    const { db, customer, schedule } = await withCustomer();
    const live = schedule();
    const { id } = schedule(12);
    softDeleteAppointment(db, id);
    softDeleteCustomer(db, customer.id);

    expect(listAppointments(db)).toEqual([]);
    expect(getAppointment(db, live.id)).toBeUndefined();
    expect(codeOf(() => restoreAppointment(db, id))).toBe('CUSTOMER_NOT_FOUND');
  });
});
