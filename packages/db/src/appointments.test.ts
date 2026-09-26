import { describe, expect, it } from 'vitest';
import {
  getAppointment,
  listAppointments,
  recordMeetingOutcome,
  rescheduleAppointment,
  restoreAppointment,
  scheduleAppointment,
  softDeleteAppointment,
} from './appointments';
import {
  changeStageManually,
  createCustomer,
  getCustomer,
  listStageTransitions,
  softDeleteCustomer,
} from './customers';
import { softDeletePerson, updatePerson } from './team';
import { codeOf, d, setup } from './test-support';

async function withCustomer() {
  const ctx = await setup();
  const customer = createCustomer(ctx.db, {
    name: 'Lan',
    reId: ctx.re.id,
    stage: 'N3',
    date: d(1, 1),
  });
  const schedule = (day = 10) =>
    scheduleAppointment(ctx.db, {
      customerId: customer.id,
      reId: ctx.re.id,
      date: d(day, 1),
      triggerType: 'REFERRAL',
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
