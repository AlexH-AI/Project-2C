import {
  calendarDate,
  MAX_FEE_VND,
  periodMetricsByScope,
  periodOf,
  type CalendarDate,
  type CustomerStage,
} from '@p2c/domain';
import { describe, expect, it, vi } from 'vitest';
import {
  editMeetingOutcome,
  listAppointments,
  recordMeetingOutcome,
  recordOutcomeWithNext,
  rescheduleAppointment,
  restoreAppointment,
  scheduleAppointment,
  softDeleteAppointment,
} from './appointments';
import { exportBackup, importBackup } from './backup';
import {
  changeStageManually,
  createCustomer,
  getCustomer,
  listStageTransitions,
  softDeleteCustomer,
  updateCustomerProfile,
} from './customers';
import { listPolicies } from './policies';
import { createPerson, listPeople, softDeletePerson, updatePerson } from './team';
import { byId, codeOf, errorOf, setup, stageAtEndOfDay } from './test-support';

// The test clock reads 26/09/2026: a meeting is held or missed by then, the next one booked after.
const d = (day: number, month: number, year = 2026): CalendarDate => calendarDate(year, month, day);

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
    expect(byId(listAppointments(db), appointment.id)).toEqual(appointment);
    expect(listAppointments(db)).toEqual([appointment]);
  });

  it('takes as coordinator an IS, TL, BDM or BD, never an RE (ADR-0007)', async () => {
    const { db, re, otherRe, tl, customer } = await withCustomer();
    const support = (['IS', 'BDM', 'BD'] as const).map(
      (role) => createPerson(db, { name: role, role, teamId: null }).id,
    );
    const base = {
      customerId: customer.id,
      reId: re.id,
      date: d(10, 1),
      triggerType: 'OTHER' as const,
    };

    const coordinated = scheduleAppointment(db, { ...base, coordinatorIds: [tl.id, ...support] });
    expect(coordinated.coordinatorIds).toEqual([tl.id, ...support].sort());
    for (const coordinatorIds of [[re.id], [tl.id, otherRe.id]]) {
      expect(codeOf(() => scheduleAppointment(db, { ...base, coordinatorIds }))).toBe(
        'INVALID_COORDINATOR',
      );
    }
    expect(listAppointments(db)).toEqual([coordinated]);
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
    expect(codeOf(() => scheduleAppointment(db, { ...base, triggerType: 'X' as never }))).toBe(
      'INVALID_TRIGGER',
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
    const is = createPerson(db, { name: 'Tâm', role: 'IS', teamId: null });
    const plain = schedule(10);
    const one = queries();
    const both = scheduleAppointment(db, {
      customerId: customer.id,
      reId: re.id,
      date: d(11, 1),
      triggerType: 'EVENT',
      coordinatorIds: [tl.id, is.id],
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
    expect(both.coordinatorIds).toEqual([tl.id, is.id].sort());
    expect(listAppointments(db, other.id)).toEqual([theirs]);
  });

  // DR-45: the customer's list puts the latest first by reversing this order.
  it('orders the appointments of one day by time, those without a time first', async () => {
    const { db, re, customer } = await withCustomer();
    const at = (time: string | null) =>
      scheduleAppointment(db, {
        customerId: customer.id,
        reId: re.id,
        date: d(10, 1),
        time,
        triggerType: 'REFERRAL',
        coordinatorIds: [],
      }).id;
    const afternoon = at('15:00');
    const morning = at('09:00');
    const untimed = at(null);

    expect(listAppointments(db).map((a) => a.id)).toEqual([untimed, morning, afternoon]);
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
    // DR6-51: a stage outside the list has a code, not the raw CHECK error of the table.
    expect(
      codeOf(() => recordMeetingOutcome(db, id, { ...MET_N2, stageAfter: 'N9' as 'N2' })),
    ).toBe('INVALID_TRANSITION');
    expect(codeOf(() => recordMeetingOutcome(db, id, { ...MET_N2, expectedCaseSize: -1 }))).toBe(
      'INVALID_AMOUNT',
    );
    expect(codeOf(() => recordMeetingOutcome(db, 'x', MET_N2))).toBe('APPOINTMENT_NOT_FOUND');
    expect(
      recordMeetingOutcome(db, id, { status: 'CANCELLED', nextStep: 'Hẹn lại' }),
    ).toMatchObject({ status: 'CANCELLED', stageAfter: null, nextStep: 'Hẹn lại' });
  });

  // DR-23: a case size dự kiến is a fee, at most 100 tỷ đồng.
  it('takes a case size up to the cap and refuses one past it', async () => {
    const { db, schedule } = await withCustomer();
    const { id } = schedule();
    const sized = (expectedCaseSize: number) => ({ ...MET_N2, expectedCaseSize });

    for (const size of [MAX_FEE_VND + 1, Number.MAX_SAFE_INTEGER]) {
      expect(codeOf(() => recordMeetingOutcome(db, id, sized(size)))).toBe('AMOUNT_TOO_LARGE');
    }
    expect(byId(listAppointments(db), id)?.status).toBe('SCHEDULED');
    expect(recordMeetingOutcome(db, id, sized(MAX_FEE_VND)).expectedCaseSize).toBe(100_000_000_000);
    expect(codeOf(() => editMeetingOutcome(db, id, sized(MAX_FEE_VND + 1), {}))).toBe(
      'AMOUNT_TOO_LARGE',
    );
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
    expect(byId(listAppointments(db), id)?.status).toBe('MET');
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
    expect(codeOf(() => editMeetingOutcome(db, id, MET_N2, { date: d(11, 1) }))).toBe(
      'TRANSITION_NOT_LATEST',
    );
    expect(editMeetingOutcome(db, id, MET_N2, { triggerType: 'EVENT' }).triggerType).toBe('EVENT');
  });

  it('keeps the same transition when a met outcome is saved again unchanged', async () => {
    const { db, customer, schedule } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, MET_N2);
    const before = listStageTransitions(db, customer.id);

    recordMeetingOutcome(db, id, { ...MET_N2, note: 'Thêm ghi chú' });

    expect(listStageTransitions(db, customer.id)).toEqual(before);
  });

  it('records a meeting held or missed only by today, a cancellation ahead of time', async () => {
    const { db, customer, stage } = await withCustomer();
    const book = (date: CalendarDate) =>
      scheduleAppointment(db, {
        customerId: customer.id,
        reId: customer.reId,
        date,
        triggerType: 'OTHER',
      }).id;
    const tomorrow = book(d(27, 9));

    expect(codeOf(() => recordMeetingOutcome(db, tomorrow, MET_N2))).toBe('OUTCOME_IN_FUTURE');
    expect(codeOf(() => recordMeetingOutcome(db, tomorrow, { status: 'NO_SHOW' }))).toBe(
      'OUTCOME_IN_FUTURE',
    );
    expect(byId(listAppointments(db), tomorrow)?.status).toBe('SCHEDULED');
    expect(listStageTransitions(db, customer.id)).toHaveLength(1);
    expect(recordMeetingOutcome(db, tomorrow, { status: 'CANCELLED' }).status).toBe('CANCELLED');
    expect(recordMeetingOutcome(db, book(d(26, 9)), MET_N2).status).toBe('MET');
    expect(stage()).toBe('N2');
  });
});

// D9: who decided the stage after the meeting — optional, an IS, TL, BDM or BD (Owner,
// 04/10/2026), only on a met appointment.
describe('outcome reviewer', () => {
  it('keeps a live IS, TL, BDM or BD as reviewer of a met appointment, or none', async () => {
    const { db, tl, schedule } = await withCustomer();
    const is = createPerson(db, { name: 'Tâm', role: 'IS', teamId: null });
    const bdm = createPerson(db, { name: 'Khoa', role: 'BDM', teamId: null });
    const bd = createPerson(db, { name: 'Long', role: 'BD', teamId: null });
    const { id } = schedule();

    expect(recordMeetingOutcome(db, id, { ...MET_N2, outcomeReviewerId: is.id })).toMatchObject({
      outcomeReviewerId: is.id,
    });
    expect(byId(listAppointments(db), id)?.outcomeReviewerId).toBe(is.id);
    for (const reviewer of [tl, bdm, bd]) {
      const outcome = { ...MET_N2, outcomeReviewerId: reviewer.id };
      expect(recordMeetingOutcome(db, id, outcome).outcomeReviewerId).toBe(reviewer.id);
    }
    expect(recordMeetingOutcome(db, id, MET_N2).outcomeReviewerId).toBeNull();
  });

  it('refuses an RE as reviewer, the appointment’s own or another, recording nothing', async () => {
    const { db, re, otherRe, schedule } = await withCustomer();
    const { id } = schedule();

    for (const reviewer of [re, otherRe]) {
      expect(
        codeOf(() => recordMeetingOutcome(db, id, { ...MET_N2, outcomeReviewerId: reviewer.id })),
      ).toBe('INVALID_REVIEWER');
    }
    expect(byId(listAppointments(db), id)?.status).toBe('SCHEDULED');
  });

  it('keeps a reviewer of a live appointment from becoming an RE; others change role freely', async () => {
    const { db, team, tl, schedule } = await withCustomer();
    const is = createPerson(db, { name: 'Tâm', role: 'IS', teamId: null });
    const { id } = schedule();
    recordMeetingOutcome(db, id, { ...MET_N2, outcomeReviewerId: tl.id });

    expect(codeOf(() => updatePerson(db, tl.id, { role: 'RE' }))).toBe('REVIEWER_IN_USE');
    expect(updatePerson(db, tl.id, { name: 'Hà Lê' }).role).toBe('TL');
    expect(updatePerson(db, is.id, { role: 'RE', teamId: team.id }).role).toBe('RE');
  });

  it('lets a reviewer of a live appointment move to another reviewer role', async () => {
    const { db, schedule } = await withCustomer();
    const is = createPerson(db, { name: 'Tâm', role: 'IS', teamId: null });
    const { id } = schedule();
    recordMeetingOutcome(db, id, { ...MET_N2, outcomeReviewerId: is.id });

    expect(updatePerson(db, is.id, { role: 'BD' }).role).toBe('BD');
    expect(codeOf(() => updatePerson(db, is.id, { role: 'RE' }))).toBe('REVIEWER_IN_USE');
  });

  it('restores no appointment whose reviewer became an RE while it was deleted', async () => {
    const { db, tl, schedule } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, { ...MET_N2, outcomeReviewerId: tl.id });
    softDeleteAppointment(db, id);
    updatePerson(db, tl.id, { role: 'RE' });

    expect(codeOf(() => restoreAppointment(db, id))).toBe('INVALID_REVIEWER');
    expect(listAppointments(db)).toEqual([]);
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
    expect(byId(listAppointments(db), id)?.status).toBe('SCHEDULED');
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

    const saved = recordOutcomeWithNext(db, id, MET_N2, { date: d(20, 10), time: '14:00' });

    expect(saved.recorded).toMatchObject({ id, status: 'MET', stageAfter: 'N2' });
    expect(saved.next).toEqual({
      id: expect.any(String),
      customerId: customer.id,
      reId: re.id,
      coordinatorIds: [tl.id],
      date: d(20, 10),
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
      { date: d(1, 10) },
    );

    expect(saved.recorded.status).toBe('NO_SHOW');
    expect(saved.next).toMatchObject({ date: d(1, 10), time: null, status: 'SCHEDULED' });
  });

  it('saves nothing when the next day has passed or either part is refused', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    const { id } = schedule();
    const next = { date: d(20, 10) };

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

  // T-233 (DR6-02): the RF goes to the RE on the meeting (ADR-0007), the RE who held it.
  it('books the next appointment for the RE now in charge of the customer', async () => {
    const { db, re, otherRe, customer } = await withCustomer();
    const book = (date: CalendarDate) =>
      scheduleAppointment(db, {
        customerId: customer.id,
        reId: re.id,
        date,
        triggerType: 'REFERRAL',
      });
    const unrecorded = book(d(25, 9));
    const planned = book(d(26, 9));
    updateCustomerProfile(db, customer.id, { reId: otherRe.id });

    const missed = recordOutcomeWithNext(
      db,
      unrecorded.id,
      { status: 'NO_SHOW' },
      { date: d(1, 10) },
    );
    const met = recordOutcomeWithNext(db, planned.id, MET_N2, { date: d(20, 10) });

    expect([missed.recorded.reId, missed.next.reId]).toEqual([re.id, otherRe.id]);
    expect([met.recorded.reId, met.next.reId]).toEqual([otherRe.id, otherRe.id]);
    const metrics = periodMetricsByScope(
      {
        people: listPeople(db),
        policies: listPolicies(db),
        appointments: listAppointments(db),
        transitions: listStageTransitions(db),
      },
      periodOf('month', d(26, 9)),
    );
    expect(metrics({ kind: 're', reId: otherRe.id }).rfCount).toBe(1);
    expect(metrics({ kind: 're', reId: re.id }).rfCount).toBe(0);
  });

  it('books nothing for an appointment whose outcome is already recorded', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    const { id } = schedule();
    const met = recordMeetingOutcome(db, id, { ...MET_N2, note: 'Lần đầu' });
    const transitions = listStageTransitions(db, customer.id);

    expect(
      codeOf(() => recordOutcomeWithNext(db, id, { status: 'NO_SHOW' }, { date: d(1, 10) })),
    ).toBe('INVALID_STATUS');
    expect(byId(listAppointments(db), id)).toEqual(met);
    expect(listStageTransitions(db, customer.id)).toEqual(transitions);
    expect(stage()).toBe('N2');
    expect(listAppointments(db)).toHaveLength(1);
  });
});

// Mockup 6f: the trigger, coordinators and meeting day are edited with the outcome.
describe('editMeetingOutcome — the details', () => {
  const CANCELLED = { status: 'CANCELLED' } as const;
  const NO_SHOW = { status: 'NO_SHOW' } as const;

  it('changes the trigger, time and coordinators', async () => {
    const { db, tl, schedule } = await withCustomer();
    const bd = createPerson(db, { name: 'Khoa', role: 'BD', teamId: null });
    const { id } = schedule(10, [tl.id]);
    recordMeetingOutcome(db, id, { status: 'CANCELLED' });

    const edited = editMeetingOutcome(db, id, CANCELLED, {
      time: '15:30',
      triggerType: 'OCCASION',
      triggerNote: ' Sinh nhật ',
      coordinatorIds: [bd.id, bd.id],
    });

    expect(edited).toMatchObject({
      time: '15:30',
      triggerType: 'OCCASION',
      triggerNote: 'Sinh nhật',
      coordinatorIds: [bd.id],
    });
    expect(byId(listAppointments(db), id)).toEqual(edited);
    expect(editMeetingOutcome(db, id, CANCELLED, { triggerNote: null, time: null })).toMatchObject({
      time: null,
      triggerType: 'OCCASION',
      triggerNote: null,
      coordinatorIds: [bd.id],
    });
  });

  it('adds no coordinator who is deleted, unknown or an RE, and changes nothing then', async () => {
    const { db, re, tl, otherRe, schedule } = await withCustomer();
    const is = createPerson(db, { name: 'Tâm', role: 'IS', teamId: null });
    const { id } = schedule(10, [tl.id]);
    recordMeetingOutcome(db, id, MET_N2);
    const deleted = schedule(11).id;
    softDeleteAppointment(db, deleted);
    softDeletePerson(db, is.id);

    const refused = (coordinatorIds: string[]) =>
      codeOf(() => editMeetingOutcome(db, id, MET_N2, { triggerType: 'OTHER', coordinatorIds }));
    expect(refused([is.id])).toBe('PERSON_NOT_FOUND');
    expect(refused(['x'])).toBe('PERSON_NOT_FOUND');
    expect(refused([re.id])).toBe('INVALID_COORDINATOR');
    expect(refused([otherRe.id])).toBe('INVALID_COORDINATOR');
    expect(codeOf(() => editMeetingOutcome(db, id, MET_N2, { time: '7h' }))).toBe('INVALID_TIME');
    expect(codeOf(() => editMeetingOutcome(db, id, MET_N2, { triggerType: 'X' as never }))).toBe(
      'INVALID_TRIGGER',
    );
    expect(codeOf(() => editMeetingOutcome(db, deleted, CANCELLED, {}))).toBe(
      'APPOINTMENT_NOT_FOUND',
    );
    expect(byId(listAppointments(db), id)).toMatchObject({
      triggerType: 'REFERRAL',
      coordinatorIds: [tl.id],
    });
  });

  it('edits only an appointment with an outcome: a scheduled or rescheduled one stays as it is', async () => {
    const { db, tl, schedule } = await withCustomer();
    const scheduled = schedule(10, [tl.id]);
    const old = schedule(12);
    rescheduleAppointment(db, old.id, { date: d(15, 10) });
    const changes = { date: d(5, 1), triggerType: 'EVENT', coordinatorIds: [] } as const;

    expect(codeOf(() => editMeetingOutcome(db, scheduled.id, CANCELLED, changes))).toBe(
      'INVALID_STATUS',
    );
    expect(codeOf(() => editMeetingOutcome(db, old.id, CANCELLED, { date: d(20, 10) }))).toBe(
      'INVALID_STATUS',
    );
    expect(byId(listAppointments(db), scheduled.id)).toEqual(scheduled);
    expect(byId(listAppointments(db), old.id)).toMatchObject({
      status: 'RESCHEDULED',
      date: d(12, 1),
    });
  });

  it('edits a cancelled or no-show appointment, its day even into the future when cancelled', async () => {
    const { db, tl, schedule } = await withCustomer();
    const cancelled = schedule(10).id;
    const missed = schedule(11).id;
    recordMeetingOutcome(db, cancelled, { status: 'CANCELLED' });
    recordMeetingOutcome(db, missed, { status: 'NO_SHOW' });
    const changes = { date: d(3, 2), triggerType: 'EVENT', coordinatorIds: [tl.id] } as const;

    expect(editMeetingOutcome(db, missed, NO_SHOW, changes)).toMatchObject(changes);
    expect(editMeetingOutcome(db, cancelled, CANCELLED, changes)).toMatchObject(changes);
    expect(editMeetingOutcome(db, cancelled, CANCELLED, { date: d(27, 9) }).date).toEqual(d(27, 9));
  });

  it('keeps a met or no-show appointment from moving to a day after today', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    const met = schedule(10).id;
    const missed = schedule(11).id;
    recordMeetingOutcome(db, met, MET_N2);
    recordMeetingOutcome(db, missed, { status: 'NO_SHOW' });
    const transitions = listStageTransitions(db, customer.id);

    expect(codeOf(() => editMeetingOutcome(db, met, MET_N2, { date: d(27, 9) }))).toBe(
      'OUTCOME_IN_FUTURE',
    );
    expect(codeOf(() => editMeetingOutcome(db, missed, NO_SHOW, { date: d(27, 9) }))).toBe(
      'OUTCOME_IN_FUTURE',
    );
    expect(byId(listAppointments(db), met)?.date).toEqual(d(10, 1));
    expect(byId(listAppointments(db), missed)?.date).toEqual(d(11, 1));
    expect(listStageTransitions(db, customer.id)).toEqual(transitions);
    expect(stage()).toBe('N2');
    expect(editMeetingOutcome(db, met, MET_N2, { date: d(26, 9) }).date).toEqual(d(26, 9));
  });

  it('moves the transition of a met appointment to its new day', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, MET_N2);

    editMeetingOutcome(db, id, MET_N2, { date: d(14, 1) });

    expect(byId(listAppointments(db), id)?.date).toEqual(d(14, 1));
    expect(
      listStageTransitions(db, customer.id).map((t) => [t.to, t.date, t.appointmentId]),
    ).toEqual([
      ['N3', d(1, 1), null],
      ['N2', d(14, 1), id],
    ]);
    expect(stage()).toBe('N2');
    // D10: never before the transition that came before it, whose day the error carries: the
    // creation's, not the meeting's own old day.
    expect(
      errorOf(() => editMeetingOutcome(db, id, MET_N2, { date: d(1, 12, 2025) })),
    ).toMatchObject({
      code: 'TRANSITION_BEFORE_LATEST',
      params: { date: '01/01/2026' },
    });
    expect(byId(listAppointments(db), id)?.date).toEqual(d(14, 1));
  });

  it('makes no transition when the day of a met appointment that moved no one changes', async () => {
    const { db, customer, schedule } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, { ...MET_N2, stageAfter: 'N3' });
    changeStageManually(db, customer.id, { to: 'N2', date: d(12, 1) });

    editMeetingOutcome(db, id, { ...MET_N2, stageAfter: 'N3' }, { date: d(11, 1) });

    expect(listStageTransitions(db, customer.id).map((t) => t.to)).toEqual(['N3', 'N2']);
  });
});

describe('editMeetingOutcome', () => {
  it('saves the outcome and the details together (mockup 6f)', async () => {
    const { db, tl, customer, schedule, stage } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, MET_N2);

    const edited = editMeetingOutcome(
      db,
      id,
      { ...MET_N2, stageAfter: 'N1', outcomeReviewerId: tl.id },
      { date: d(14, 1), time: '15:30', triggerType: 'EVENT', coordinatorIds: [tl.id] },
    );

    expect(edited).toMatchObject({
      stageAfter: 'N1',
      outcomeReviewerId: tl.id,
      date: d(14, 1),
      time: '15:30',
      triggerType: 'EVENT',
      coordinatorIds: [tl.id],
    });
    expect(byId(listAppointments(db), id)).toEqual(edited);
    expect(listStageTransitions(db, customer.id).map((t) => [t.to, t.date])).toEqual([
      ['N3', d(1, 1)],
      ['N1', d(14, 1)],
    ]);
    expect(stage()).toBe('N1');
  });

  it('turns a cancellation ahead of time into a meeting once its day is moved back', async () => {
    const { db, re, customer, stage } = await withCustomer();
    const { id } = scheduleAppointment(db, {
      customerId: customer.id,
      reId: re.id,
      date: d(30, 9),
      triggerType: 'OTHER',
    });
    recordMeetingOutcome(db, id, { status: 'CANCELLED' });

    editMeetingOutcome(db, id, MET_N2, { date: d(20, 9) });

    expect(byId(listAppointments(db), id)).toMatchObject({ status: 'MET', date: d(20, 9) });
    expect(stage()).toBe('N2');
  });

  it('moves the day before recording a new stage after a later manual change', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, { ...MET_N2, stageAfter: 'N3' });
    changeStageManually(db, customer.id, { to: 'N2', date: d(12, 1) });

    editMeetingOutcome(db, id, { ...MET_N2, stageAfter: 'N1' }, { date: d(14, 1) });

    expect(listStageTransitions(db, customer.id).map((t) => [t.to, t.date])).toEqual([
      ['N3', d(1, 1)],
      ['N2', d(12, 1)],
      ['N1', d(14, 1)],
    ]);
    expect(stage()).toBe('N1');
  });

  it.each([
    ['a no-show', { status: 'NO_SHOW' } as const],
    ['a meeting that keeps the stage of that day', { ...MET_N2, stageAfter: 'N3' } as const],
  ])('moves a meeting to a day before an earlier change once it becomes %s', async (_, outcome) => {
    const { db, customer, schedule, stage } = await withCustomer();
    changeStageManually(db, customer.id, { to: 'N2', date: d(5, 1) });
    const { id } = schedule();
    recordMeetingOutcome(db, id, { ...MET_N2, stageAfter: 'N1' });

    editMeetingOutcome(db, id, outcome, { date: d(3, 1) });

    expect(byId(listAppointments(db), id)).toMatchObject({ status: outcome.status, date: d(3, 1) });
    expect(listStageTransitions(db, customer.id).map((t) => [t.to, t.date])).toEqual([
      ['N3', d(1, 1)],
      ['N2', d(5, 1)],
    ]);
    expect(stage()).toBe('N2');
  });

  it('moves the transition of an unchanged meeting to its new day', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, MET_N2);

    editMeetingOutcome(db, id, { ...MET_N2, note: 'Dời ngày' }, { date: d(14, 1) });

    expect(byId(listAppointments(db), id)).toMatchObject({ note: 'Dời ngày', date: d(14, 1) });
    expect(listStageTransitions(db, customer.id).map((t) => [t.to, t.date])).toEqual([
      ['N3', d(1, 1)],
      ['N2', d(14, 1)],
    ]);
    expect(stage()).toBe('N2');
  });

  it('turns a meeting into a cancellation moved ahead of today', async () => {
    const { db, schedule, stage } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, MET_N2);

    editMeetingOutcome(db, id, { status: 'CANCELLED' }, { date: d(30, 9) });

    expect(byId(listAppointments(db), id)).toMatchObject({ status: 'CANCELLED', date: d(30, 9) });
    expect(stage()).toBe('N3');
  });

  it('saves nothing when a part is refused', async () => {
    const { db, schedule } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, MET_N2);
    const before = byId(listAppointments(db), id);

    expect(
      codeOf(() => editMeetingOutcome(db, id, { ...MET_N2, note: 'Mới' }, { time: '7h' })),
    ).toBe('INVALID_TIME');
    expect(byId(listAppointments(db), id)).toEqual(before);
  });

  it('edits only an appointment with an outcome', async () => {
    const { db, schedule } = await withCustomer();
    const { id } = schedule();

    expect(codeOf(() => editMeetingOutcome(db, id, MET_N2, {}))).toBe('INVALID_STATUS');
    expect(byId(listAppointments(db), id)?.status).toBe('SCHEDULED');
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
    expect(byId(listAppointments(db), id)?.status).toBe('SCHEDULED');
    expect(stage()).toBe('N4');
    expect(listStageTransitions(db, customer.id)).toHaveLength(2);
  });

  it('records an outcome that makes no transition: the stage of its day, cancelled or no-show', async () => {
    const { db, customer, id, stage } = await changedAfterMeeting();

    // H·CL-E4: the current stage is not the one the customer was in on the meeting day.
    expect(codeOf(() => recordMeetingOutcome(db, id, { ...MET_N2, stageAfter: 'N4' }))).toBe(
      'TRANSITION_BEFORE_LATEST',
    );
    expect(recordMeetingOutcome(db, id, { ...MET_N2, stageAfter: 'N3' }).status).toBe('MET');
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
    expect(stageAtEndOfDay(customer, transitions.slice(0, -1), d(5, 1))).toBe('N4');
    expect(stageAtEndOfDay(customer, transitions, d(31, 1))).toBe(stage());
  });
});

// T-232 (DR6-04, DR6-05): a meeting that moved no stage records the customer's stage on its day,
// and nothing recorded later may change that day's stage from under it (spec §4, D7, D10).
describe('the stage on the meeting day', () => {
  const KEPT_N3 = { ...MET_N2, stageAfter: 'N3' } as const;
  const steps = (db: Awaited<ReturnType<typeof setup>>['db'], customerId: string) =>
    listStageTransitions(db, customerId).map((t) => [t.to, t.date, t.appointmentId]);

  it('H·CL-E4: records a late meeting as kept only in the stage of its day', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    const { id } = schedule(5);
    changeStageManually(db, customer.id, { to: 'N2', date: d(15, 1) });

    // N2 is the current stage, not the one of 05/01: it would move the customer back to 05/01.
    expect(errorOf(() => recordMeetingOutcome(db, id, MET_N2))).toMatchObject({
      code: 'TRANSITION_BEFORE_LATEST',
      params: { date: '15/01/2026' },
    });
    recordMeetingOutcome(db, id, KEPT_N3);

    expect(byId(listAppointments(db), id)).toMatchObject({ status: 'MET', stageAfter: 'N3' });
    expect(steps(db, customer.id)).toEqual([
      ['N3', d(1, 1), null],
      ['N2', d(15, 1), null],
    ]);
    expect(stage()).toBe('N2');
  });

  it('H·CL-A2: moves a kept meeting past a manual change as if recorded on the new day', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    const { id } = schedule(5);
    recordMeetingOutcome(db, id, KEPT_N3);
    changeStageManually(db, customer.id, { to: 'N2', date: d(15, 1) });

    editMeetingOutcome(db, id, KEPT_N3, { date: d(20, 1) });

    expect(steps(db, customer.id)).toEqual([
      ['N3', d(1, 1), null],
      ['N2', d(15, 1), null],
      ['N3', d(20, 1), id],
    ]);
    expect(stage()).toBe('N3');
  });

  it('H·CL-A2: refuses moving a kept meeting before the change that took the customer there', async () => {
    const { db, customer, schedule } = await withCustomer();
    changeStageManually(db, customer.id, { to: 'N2', date: d(5, 1) });
    const { id } = schedule(10);
    recordMeetingOutcome(db, id, MET_N2);
    const before = byId(listAppointments(db), id);

    expect(errorOf(() => editMeetingOutcome(db, id, MET_N2, { date: d(3, 1) }))).toMatchObject({
      code: 'TRANSITION_BEFORE_LATEST',
      params: { date: '05/01/2026' },
    });
    expect(byId(listAppointments(db), id)).toEqual(before);
    // On the day of the change it still kept N2, the stage the customer reached that day.
    editMeetingOutcome(db, id, MET_N2, { date: d(5, 1) });
    expect(steps(db, customer.id)).toHaveLength(2);
  });

  it('H·CL-F3: keeps the move of a meeting while a later meeting kept the stage it moved to (D7)', async () => {
    const { db, schedule, stage } = await withCustomer();
    const moved = schedule(5);
    recordMeetingOutcome(db, moved.id, MET_N2);
    const kept = schedule(12);
    recordMeetingOutcome(db, kept.id, MET_N2);

    const blocked = { code: 'STAGE_KEPT_BY_MEETING', params: { date: '12/01/2026' } };
    expect(errorOf(() => softDeleteAppointment(db, moved.id))).toMatchObject(blocked);
    const change = { ...MET_N2, stageAfter: 'N1' } as const;
    expect(errorOf(() => editMeetingOutcome(db, moved.id, change, {}))).toMatchObject(blocked);
    expect(
      errorOf(() => recordMeetingOutcome(db, moved.id, { status: 'CANCELLED' })),
    ).toMatchObject(blocked);
    expect(stage()).toBe('N2');

    // Its other fields stay open, and the later meeting going takes the lock with it.
    editMeetingOutcome(db, moved.id, { ...MET_N2, note: 'Đã gửi minh họa' }, {});
    softDeleteAppointment(db, kept.id);
    softDeleteAppointment(db, moved.id);
    expect(stage()).toBe('N3');
  });

  // DR6-135: the command reads the meetings from the move's day on, that day included (#805).
  it('H·CL-F3: keeps the move of a meeting while a meeting of the same day kept the stage (D7)', async () => {
    const { db, schedule, stage } = await withCustomer();
    const moved = schedule(5);
    recordMeetingOutcome(db, moved.id, MET_N2);
    const kept = schedule(5);
    recordMeetingOutcome(db, kept.id, MET_N2);

    const blocked = { code: 'STAGE_KEPT_BY_MEETING', params: { date: '05/01/2026' } };
    expect(errorOf(() => softDeleteAppointment(db, moved.id))).toMatchObject(blocked);
    const change = { ...MET_N2, stageAfter: 'N1' } as const;
    expect(errorOf(() => editMeetingOutcome(db, moved.id, change, {}))).toMatchObject(blocked);
    expect(
      errorOf(() => recordMeetingOutcome(db, moved.id, { status: 'CANCELLED' })),
    ).toMatchObject(blocked);
    expect(stage()).toBe('N2');
  });

  it('H·CL-F3: a meeting kept that day in a stage the customer is still in does not lock', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    changeStageManually(db, customer.id, { to: 'N2', date: d(5, 1) });
    const kept = schedule(5);
    recordMeetingOutcome(db, kept.id, MET_N2);
    const moved = schedule(5);
    recordMeetingOutcome(db, moved.id, { ...MET_N2, stageAfter: 'N1' });

    softDeleteAppointment(db, moved.id);
    expect(stage()).toBe('N2');
  });

  // DR6-126 (d): the meetings by day, whatever order they were booked and recorded in (a backfill),
  // so the command names the day the dialog 6f does (DR6-103).
  it('H·CL-F3: names the earliest meeting that kept the stage, though recorded last', async () => {
    const { db, schedule } = await withCustomer();
    const moved = schedule(5);
    recordMeetingOutcome(db, moved.id, MET_N2);
    const later = schedule(14);
    recordMeetingOutcome(db, later.id, MET_N2);
    const earlier = schedule(12);
    recordMeetingOutcome(db, earlier.id, MET_N2);

    expect(errorOf(() => softDeleteAppointment(db, moved.id))).toMatchObject({
      code: 'STAGE_KEPT_BY_MEETING',
      params: { date: '12/01/2026' },
    });
  });

  it('refuses a stage change dated before a met appointment already recorded (5d)', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    const kept = schedule(12);
    recordMeetingOutcome(db, kept.id, KEPT_N3);
    const late = schedule(8);

    const blocked = { code: 'TRANSITION_BEFORE_MEETING', params: { date: '12/01/2026' } };
    expect(
      errorOf(() => changeStageManually(db, customer.id, { to: 'N2', date: d(11, 1) })),
    ).toMatchObject(blocked);
    expect(errorOf(() => recordMeetingOutcome(db, late.id, MET_N2))).toMatchObject(blocked);
    expect(stage()).toBe('N3');

    // From the meeting day on, as D10 allows: the meeting kept N3, the stage it started that day.
    changeStageManually(db, customer.id, { to: 'N2', date: d(12, 1) });
    expect(stage()).toBe('N2');
  });

  // DR6-68: met first, entered in the app later — a backfill (DR-43, Owner 06/10 and 17/10/2026);
  // the stage it was created in, not the one it moved to since (DR6-126 a).
  it.each<[string, { to: CustomerStage; date: CalendarDate }[], string]>([
    ['', [], '10/09/2026'],
    [', though it moved after', [{ to: 'N2', date: d(12, 9) }], '12/09/2026'],
  ])(
    'keeps a meeting met before the customer was created in the stage it was created in%s',
    async (_label, changes, latest) => {
      const { db, re } = await setup();
      const customer = createCustomer(db, {
        name: 'Lan',
        reId: re.id,
        stage: 'N3',
        date: d(10, 9),
      });
      for (const change of changes) changeStageManually(db, customer.id, change);
      const { id } = scheduleAppointment(db, {
        customerId: customer.id,
        reId: re.id,
        date: d(5, 9),
        triggerType: 'REFERRAL',
      });

      // Moving the stage on 05/09 still comes before the creation and what followed it (D10).
      expect(errorOf(() => recordMeetingOutcome(db, id, MET_N2))).toMatchObject({
        code: 'TRANSITION_BEFORE_LATEST',
        params: { date: latest },
      });
      recordMeetingOutcome(db, id, KEPT_N3);
      expect(byId(listAppointments(db), id)).toMatchObject({ status: 'MET', stageAfter: 'N3' });
      softDeleteAppointment(db, id);
      restoreAppointment(db, id);

      expect(byId(listAppointments(db), id)).toMatchObject({ status: 'MET', stageAfter: 'N3' });
      expect(steps(db, customer.id)).toEqual([
        ['N3', d(10, 9), null],
        ...changes.map((change) => [change.to, change.date, null]),
      ]);
      await expect(importBackup(exportBackup(db), { now: db.now })).resolves.toBeDefined();
    },
  );

  it('restores a kept meeting only while the stage of its day is still the one it kept', async () => {
    const { db, customer, schedule } = await withCustomer();
    const moved = schedule(5);
    recordMeetingOutcome(db, moved.id, MET_N2);
    const kept = schedule(12);
    recordMeetingOutcome(db, kept.id, MET_N2);
    softDeleteAppointment(db, kept.id);
    softDeleteAppointment(db, moved.id);

    expect(errorOf(() => restoreAppointment(db, kept.id))).toMatchObject({
      code: 'STAGE_NOT_ON_DAY',
      params: { date: '12/01/2026' },
    });
    restoreAppointment(db, moved.id);
    restoreAppointment(db, kept.id);
    expect(steps(db, customer.id)).toEqual([
      ['N3', d(1, 1), null],
      ['N2', d(5, 1), moved.id],
    ]);
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

    expect(byId(listAppointments(db), old.id)?.status).toBe('RESCHEDULED');
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

    expect(byId(listAppointments(db), plain.id)?.note).toBe('');
    expect(byId(listAppointments(db), noted.id)?.note).toBe('KH đi công tác');
    expect(moved.note).toBe('');
  });

  // DR-66 T7: the rule of the dialog (mockup 6e) is the command's, so nothing else can break it.
  it('refuses the same day and time as the old appointment, and takes another time that day', async () => {
    const { db, customer, re, persist } = await withCustomer();
    const input = { customerId: customer.id, reId: re.id, triggerType: 'REFERRAL' } as const;
    const timed = scheduleAppointment(db, { ...input, date: d(8, 1), time: '09:00' });
    const untimed = scheduleAppointment(db, { ...input, date: d(9, 1) });
    const before = db.export();
    persist.mockClear();

    expect(
      codeOf(() => rescheduleAppointment(db, timed.id, { date: d(8, 1), time: '09:00' })),
    ).toBe('RESCHEDULE_UNCHANGED');
    expect(codeOf(() => rescheduleAppointment(db, untimed.id, { date: d(9, 1) }))).toBe(
      'RESCHEDULE_UNCHANGED',
    );
    expect(db.export()).toEqual(before);
    expect(persist).not.toHaveBeenCalled();

    expect(rescheduleAppointment(db, timed.id, { date: d(8, 1), time: '10:00' }).time).toBe(
      '10:00',
    );
    expect(rescheduleAppointment(db, untimed.id, { date: d(9, 1), time: '09:00' }).date).toEqual(
      d(9, 1),
    );
  });
});

// R2-13: sql.js would store the text cut at the NUL without a word, as the import refuses it.
describe('text with a NUL', () => {
  it('is refused by every command that takes free text, which writes nothing', async () => {
    const { db, customer, re, schedule, persist } = await withCustomer();
    const scheduled = schedule();
    const met = recordMeetingOutcome(db, schedule().id, MET_N2);
    const before = db.export();
    persist.mockClear();
    const nul = 'Gặp\u0000ở quán';

    const refused = [
      () =>
        scheduleAppointment(db, {
          customerId: customer.id,
          reId: re.id,
          date: d(12, 1),
          triggerType: 'REFERRAL',
          triggerNote: nul,
        }),
      () => recordMeetingOutcome(db, scheduled.id, { ...MET_N2, nextStep: nul }),
      () => recordMeetingOutcome(db, scheduled.id, { ...MET_N2, note: nul }),
      () => editMeetingOutcome(db, met.id, MET_N2, { triggerNote: nul }),
      () => editMeetingOutcome(db, met.id, { ...MET_N2, note: nul }, {}),
      () => rescheduleAppointment(db, scheduled.id, { date: d(15, 1) }, nul),
    ];
    for (const command of refused) expect(codeOf(command)).toBe('INVALID_TEXT');
    expect(db.export()).toEqual(before);
    expect(persist).not.toHaveBeenCalled();
  });
});

// DR6-72 (Owner 23/10/2026, T-291): as a name or a KYC value, text with nothing to see is empty.
describe('optional text with nothing to see', () => {
  const NOTHING = ['\u{3164}', '\u{2800}', '\u{FE0F}', '\u{85}', '\u{3164}\u{85}\u{2800}'];

  it('is no next step, which a meeting held needs', async () => {
    const { db, schedule } = await withCustomer();
    const { id } = schedule();

    for (const nextStep of NOTHING) {
      expect(codeOf(() => recordMeetingOutcome(db, id, { ...MET_N2, nextStep }))).toBe(
        'OUTCOME_REQUIRED',
      );
    }
  });

  it('is stored as none: no trigger note, an empty note, no reason under the old note', async () => {
    const { db, customer, re, schedule } = await withCustomer();
    for (const text of NOTHING) {
      const booked = scheduleAppointment(db, {
        customerId: customer.id,
        reId: re.id,
        date: d(12, 1),
        triggerType: 'REFERRAL',
        triggerNote: text,
      });
      expect(booked.triggerNote).toBeNull();
      expect(recordMeetingOutcome(db, booked.id, { status: 'CANCELLED', note: text }).note).toBe(
        '',
      );
      const moved = schedule();
      rescheduleAppointment(db, moved.id, { date: d(15, 1) }, text);
      expect(byId(listAppointments(db), moved.id)?.note).toBe('');
    }
  });
});

describe('deleting appointments', () => {
  it('withdraws the latest transition on delete and applies it again on restore', async () => {
    const { db, customer, schedule, stage } = await withCustomer();
    const { id } = schedule();
    recordMeetingOutcome(db, id, MET_N2);

    softDeleteAppointment(db, id);
    expect(stage()).toBe('N3');
    expect(byId(listAppointments(db), id)).toBeUndefined();
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
    expect(byId(listAppointments(db), id)).toBeUndefined();
    expect(stage()).toBe('N4');
  });

  it('DR6-71: gives back no withdrawn transition of another customer’s', async () => {
    const { db, re, schedule, stage } = await withCustomer();
    const other = createCustomer(db, { name: 'Hoa', reId: re.id, stage: 'N3', date: d(1, 1) });
    const { id } = schedule();
    recordMeetingOutcome(db, id, MET_N2);
    softDeleteAppointment(db, id);
    // As a hand-edited file would have it, which the import refuses (spec §6 rule 4).
    db.sqlite.run('UPDATE stage_transitions SET customer_id = ? WHERE appointment_id = ?', [
      other.id,
      id,
    ]);

    expect(codeOf(() => restoreAppointment(db, id))).toBe('STAGE_NOT_ON_DAY');
    expect(stage()).toBe('N3');
    expect(getCustomer(db, other.id)?.stage).toBe('N3');
    expect(listStageTransitions(db, other.id)).toHaveLength(1);
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

  it('keeps a coordinator of a live appointment from becoming an RE (ADR-0007)', async () => {
    const { db, team, tl, schedule } = await withCustomer();
    const is = createPerson(db, { name: 'Tâm', role: 'IS', teamId: null });
    schedule(10, [tl.id, is.id]);

    expect(codeOf(() => updatePerson(db, tl.id, { role: 'RE' }))).toBe('COORDINATOR_IN_USE');
    expect(codeOf(() => updatePerson(db, is.id, { role: 'RE', teamId: team.id }))).toBe(
      'COORDINATOR_IN_USE',
    );
    expect(updatePerson(db, is.id, { role: 'BDM' }).role).toBe('BDM');
    expect(updatePerson(db, tl.id, { name: 'Hà Lê' }).role).toBe('TL');
  });

  it('keeps a coordinator of a live appointment from deletion', async () => {
    const { db, tl, schedule } = await withCustomer();
    const { id } = schedule(10, [tl.id]);

    expect(codeOf(() => softDeletePerson(db, tl.id))).toBe('PERSON_IN_USE');
    softDeleteAppointment(db, id);
    softDeletePerson(db, tl.id);
    expect(codeOf(() => restoreAppointment(db, id))).toBe('PERSON_NOT_FOUND');
  });

  it('restores no appointment whose coordinator became an RE while it was deleted', async () => {
    const { db, tl, schedule } = await withCustomer();
    const { id } = schedule(10, [tl.id]);
    softDeleteAppointment(db, id);
    updatePerson(db, tl.id, { role: 'RE' });

    expect(codeOf(() => restoreAppointment(db, id))).toBe('INVALID_COORDINATOR');
    expect(listAppointments(db)).toEqual([]);
  });

  it('hides the appointments of a deleted customer and restores none of them', async () => {
    const { db, customer, schedule } = await withCustomer();
    const live = schedule();
    const { id } = schedule(12);
    softDeleteAppointment(db, id);
    softDeleteCustomer(db, customer.id);

    expect(listAppointments(db)).toEqual([]);
    expect(byId(listAppointments(db), live.id)).toBeUndefined();
    expect(codeOf(() => restoreAppointment(db, id))).toBe('CUSTOMER_NOT_FOUND');
  });
});
