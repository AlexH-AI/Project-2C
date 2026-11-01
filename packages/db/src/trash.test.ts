import { isRfAppointment, type CalendarDate, type CustomerStage } from '@p2c/domain';
import { describe, expect, it, vi } from 'vitest';
import {
  listAppointments,
  recordMeetingOutcome,
  restoreAppointment,
  scheduleAppointment,
  softDeleteAppointment,
} from './appointments';
import { validateBackupInvariants } from './backup-validation';
import {
  changeStageManually,
  createCustomer,
  listStageTransitions,
  restoreCustomer,
  softDeleteCustomer,
} from './customers';
import type { Database } from './database';
import { addKycNote } from './kyc';
import { listPolicies, restorePolicy, softDeletePolicy, submitPolicy } from './policies';
import {
  createPerson,
  createTeam,
  restorePerson,
  restoreTeam,
  softDeletePerson,
  softDeleteTeam,
  updatePerson,
} from './team';
import { byId, d, errorOf, setup } from './test-support';
import { listTrash, type TrashRow } from './trash';

// Spec Phase 6 §4.2: the examples E1–E16 are dated as of 11/10/2026.
const TODAY = d(11, 10);

const RESTORE = {
  team: restoreTeam,
  person: restorePerson,
  customer: restoreCustomer,
  appointment: restoreAppointment,
  policy: restorePolicy,
} as const;

/** Whether the appointment, read back as the stats read it, counts as an RF. */
const isRf = (db: Database, id: string) =>
  isRfAppointment(byId(listAppointments(db), id)!, listStageTransitions(db));

async function trash() {
  const base = await setup(TODAY);
  const { db, team } = base;
  const linh = createPerson(db, { name: 'Đỗ Khánh Linh', role: 'RE', teamId: team.id });
  const customer = (name = 'Trịnh Minh Anh', stage: CustomerStage = 'N3') =>
    createCustomer(db, { name, reId: linh.id, stage, date: d(1, 9) });
  const schedule = (customerId: string, date: CalendarDate, coordinatorIds: string[] = []) =>
    scheduleAppointment(db, {
      customerId,
      reId: linh.id,
      date,
      triggerType: 'REFERRAL',
      coordinatorIds,
    });
  const met = (id: string, stageAfter: CustomerStage, outcomeReviewerId: string | null = null) =>
    recordMeetingOutcome(db, id, {
      status: 'MET',
      stageAfter,
      nextStep: 'Gửi giải pháp',
      outcomeReviewerId,
    });
  const row = (id: string): TrashRow => {
    const found = listTrash(db).find((r) => r.id === id);
    expect(found).toBeDefined();
    return found!;
  };
  /** Restores the record: what the command throws, as `blocked` holds it, or undefined. */
  const restored = (r: TrashRow) => {
    const error = errorOf(() => RESTORE[r.kind](db, r.id));
    return error && { code: error.code, params: error.params };
  };
  return { ...base, linh, customer, schedule, met, row, restored };
}

/** E5: Phạm Gia Bảo met on `date`, moved `from → to`, then the meeting deleted (back in `from`). */
async function deletedMeeting(
  date = d(2, 10),
  from: CustomerStage = 'N3',
  to: CustomerStage = 'N2',
) {
  const base = await trash();
  const bao = base.customer('Phạm Gia Bảo', from);
  const meeting = base.schedule(bao.id, date);
  base.met(meeting.id, to);
  const transitions = listStageTransitions(base.db, bao.id);
  softDeleteAppointment(base.db, meeting.id);
  return { ...base, bao, meeting, transitions };
}

describe('listTrash: customers (TR-2, TR-4)', () => {
  it('E1: restores a customer with every record not deleted on its own', async () => {
    const { db, customer, schedule, met, row, restored } = await trash();
    const anh = customer();
    const appointments = [1, 2, 3, 4, 5, 6, 7, 8].map((day) => schedule(anh.id, d(day, 10)));
    met(appointments[0]!.id, 'N2');
    met(appointments[1]!.id, 'N3');
    softDeleteAppointment(db, appointments[7]!.id);
    for (const day of [1, 2, 3, 4, 5])
      addKycNote(db, anh.id, { text: `Ghi chú ${day}`, date: d(day, 10) });
    softDeleteCustomer(db, anh.id);

    const r = row(anh.id);
    expect(r).toMatchObject({
      kind: 'customer',
      name: 'Trịnh Minh Anh',
      // What tells two customers of a name and a stage apart (DR6-151), as in mockup 9b.
      code: anh.code,
      stage: 'N3',
      owner: {
        re: { name: 'Đỗ Khánh Linh', deleted: false },
        team: { name: 'Sao Mai', deleted: false },
      },
      effect: {
        kind: 'customer',
        appointments: 7,
        met: 2,
        rf: 1,
        policies: 0,
        kycNotes: 5,
        aiAnalyses: 0,
        appointmentsInTrash: 1,
        policiesInTrash: 0,
      },
    });
    expect(r.blocked).toBeUndefined();
    expect(restored(r)).toBeUndefined();
    expect(listAppointments(db, anh.id)).toHaveLength(7);
    expect(listTrash(db).map((t) => t.id)).toEqual([appointments[7]!.id]);
  });

  it('E2: blocks a customer whose RE was deleted, naming the RE', async () => {
    const { db, linh, customer, row, restored } = await trash();
    const anh = customer();
    softDeleteCustomer(db, anh.id);
    softDeletePerson(db, linh.id);

    const r = row(anh.id);
    expect(r.blocked).toEqual({
      code: 'PERSON_NOT_FOUND',
      params: { name: 'Đỗ Khánh Linh', as: 're' },
    });
    expect(r.owner.re).toMatchObject({ name: 'Đỗ Khánh Linh', deleted: true });
    expect(restored(r)).toEqual(r.blocked);
  });

  it('E3: blocks a customer whose RE is now a TL', async () => {
    const { db, linh, tl, customer, row, restored } = await trash();
    const anh = customer();
    softDeleteCustomer(db, anh.id);
    softDeletePerson(db, tl.id);
    updatePerson(db, linh.id, { role: 'TL' });

    const r = row(anh.id);
    expect(r.blocked).toEqual({
      code: 'RE_REQUIRED',
      params: { name: 'Đỗ Khánh Linh', role: 'TL' },
    });
    expect(restored(r)).toEqual(r.blocked);
  });
});

describe('listTrash: appointments (TR-2, TR-3, TR-5)', () => {
  it('E4: blocks an appointment of a deleted customer until the customer comes back', async () => {
    const { db, customer, schedule, row, restored } = await trash();
    const anh = customer();
    const planned = schedule(anh.id, d(6, 10));
    softDeleteAppointment(db, planned.id);
    softDeleteCustomer(db, anh.id);

    const r = row(planned.id);
    expect(r).toMatchObject({
      kind: 'appointment',
      date: d(6, 10),
      status: 'SCHEDULED',
      owner: {
        customer: { id: anh.id, name: 'Trịnh Minh Anh', deleted: true },
        re: { name: 'Đỗ Khánh Linh', deleted: false },
      },
      blocked: { code: 'CUSTOMER_NOT_FOUND', params: { name: 'Trịnh Minh Anh' } },
    });
    expect(restored(r)).toEqual(r.blocked);

    restoreCustomer(db, anh.id);
    expect(row(planned.id).blocked).toBeUndefined();
    restoreAppointment(db, planned.id);
    expect(listTrash(db)).toEqual([]);
  });

  it('E5: restores a met appointment with its stage change on the meeting day, an RF', async () => {
    const { db, bao, meeting, transitions, row, restored } = await deletedMeeting();

    const r = row(meeting.id);
    expect(r).toMatchObject({
      status: 'MET',
      stageAfter: 'N2',
      effect: { kind: 'stageChange', from: 'N3', to: 'N2', date: d(2, 10), rf: true },
    });
    expect(r.blocked).toBeUndefined();
    expect(restored(r)).toBeUndefined();
    // The very transition the deletion withdrew comes back: restoring undoes the deletion.
    expect(listStageTransitions(db, bao.id)).toEqual(transitions);
    expect(transitions.at(-1)).toMatchObject({
      from: 'N3',
      to: 'N2',
      date: d(2, 10),
      appointmentId: meeting.id,
    });
    expect(isRf(db, meeting.id)).toBe(true);
  });

  it('E5: restores a met appointment whose stage change is no RF, and says so (DR6-59)', async () => {
    const { db, meeting, row, restored } = await deletedMeeting(d(2, 10), 'N4', 'N3');

    const r = row(meeting.id);
    expect(r.effect).toEqual({
      kind: 'stageChange',
      from: 'N4',
      to: 'N3',
      date: d(2, 10),
      rf: false,
    });
    expect(restored(r)).toBeUndefined();
    expect(isRf(db, meeting.id)).toBe(false);
  });

  it('E5: records the stage change anew once the stage moved on an earlier day after deletion', async () => {
    const { db, bao, meeting, row, restored } = await deletedMeeting(d(5, 10));
    changeStageManually(db, bao.id, { to: 'N4', date: d(3, 10) });

    const r = row(meeting.id);
    expect(r.effect).toEqual({
      kind: 'stageChange',
      from: 'N4',
      to: 'N2',
      date: d(5, 10),
      rf: true,
    });
    expect(restored(r)).toBeUndefined();
    expect(listStageTransitions(db, bao.id).slice(1)).toMatchObject([
      { from: 'N3', to: 'N4', date: d(3, 10), appointmentId: null },
      { from: 'N4', to: 'N2', date: d(5, 10), appointmentId: meeting.id },
    ]);
  });

  // DR6-126 (b): back in the stage it left, yet after changes recorded since the deletion, which the
  // withdrawn transition cannot go before (spec §6 rule 3).
  it('E5: records the stage change anew once the stage moved away and back after deletion', async () => {
    const { db, bao, meeting, row, restored } = await deletedMeeting(d(5, 10));
    changeStageManually(db, bao.id, { to: 'N4', date: d(4, 10) });
    changeStageManually(db, bao.id, { to: 'N3', date: d(4, 10) });

    const r = row(meeting.id);
    expect(r.effect).toMatchObject({ kind: 'stageChange', from: 'N3', to: 'N2', rf: true });
    expect(restored(r)).toBeUndefined();
    expect(listStageTransitions(db, bao.id).slice(1)).toMatchObject([
      { from: 'N3', to: 'N4', date: d(4, 10), appointmentId: null },
      { from: 'N4', to: 'N3', date: d(4, 10), appointmentId: null },
      { from: 'N3', to: 'N2', date: d(5, 10), appointmentId: meeting.id },
    ]);
    expect(() => validateBackupInvariants(db)).not.toThrow();
  });

  it('E6: blocks a met appointment once the stage changed after its day (D10)', async () => {
    const { bao, meeting, schedule, met, row, restored } = await deletedMeeting();
    met(schedule(bao.id, d(5, 10)).id, 'N1');

    const r = row(meeting.id);
    expect(r.blocked).toEqual({
      code: 'TRANSITION_BEFORE_LATEST',
      params: { date: '05/10/2026' },
    });
    expect(restored(r)).toEqual(r.blocked);
  });

  it('E7: restores a met appointment without a transition when the stage is already its own', async () => {
    const { db, bao, meeting, row, restored } = await deletedMeeting();
    changeStageManually(db, bao.id, { to: 'N2', date: d(2, 10) });
    const transitions = listStageTransitions(db, bao.id);

    const r = row(meeting.id);
    expect(r.effect).toEqual({ kind: 'stageKept', stage: 'N2' });
    expect(restored(r)).toBeUndefined();
    expect(listStageTransitions(db, bao.id)).toEqual(transitions);
    expect(isRf(db, meeting.id)).toBe(false);
  });

  // The other side of the day check (review of PR 740): reached before the meeting day, the stage
  // is still the customer's on it.
  it('E7: restores it the same once the customer reached that stage before its day', async () => {
    const { db, bao, meeting, row, restored } = await deletedMeeting(d(5, 10));
    changeStageManually(db, bao.id, { to: 'N2', date: d(3, 10) });
    const transitions = listStageTransitions(db, bao.id);

    const r = row(meeting.id);
    expect(r.effect).toEqual({ kind: 'stageKept', stage: 'N2' });
    expect(r.blocked).toBeUndefined();
    expect(restored(r)).toBeUndefined();
    expect(listStageTransitions(db, bao.id)).toEqual(transitions);
  });

  it('E7: blocks it like E6 once the customer reached that stage after its day (Owner 15/10/2026)', async () => {
    const { db, bao, meeting, row, restored } = await deletedMeeting();
    changeStageManually(db, bao.id, { to: 'N2', date: d(10, 10) });

    const r = row(meeting.id);
    // Kept in N2 on 02/10 while the customer was in N3 that day: the import would refuse it.
    expect(r.blocked).toEqual({
      code: 'TRANSITION_BEFORE_LATEST',
      params: { date: '10/10/2026' },
    });
    expect(restored(r)).toEqual(r.blocked);
  });

  // DR6-104: a stage of the meeting day too, yet reached again only on a later day.
  it.each([
    ['in it as the meeting day started', 'N2', ['N3']],
    ['in it for a while that day', 'N3', ['N2', 'N3']],
  ] as const)(
    'E7: blocks it like E6 once the customer, %s, reached that stage again after its day',
    async (_label, created, sameDay) => {
      const { db, customer, schedule, met, row, restored } = await trash();
      const bao = customer('Phạm Gia Bảo', created);
      for (const to of sameDay) changeStageManually(db, bao.id, { to, date: d(5, 10) });
      const meeting = schedule(bao.id, d(5, 10));
      met(meeting.id, 'N2');
      softDeleteAppointment(db, meeting.id);
      changeStageManually(db, bao.id, { to: 'N2', date: d(7, 10) });

      const r = row(meeting.id);
      expect(r.blocked).toEqual({
        code: 'TRANSITION_BEFORE_LATEST',
        params: { date: '07/10/2026' },
      });
      expect(restored(r)).toEqual(r.blocked);
    },
  );

  it('E8: blocks a met appointment once the customer was lost after its day', async () => {
    const { db, bao, meeting, row, restored } = await deletedMeeting(d(28, 9), 'N4', 'N3');
    changeStageManually(db, bao.id, { to: 'LOST', date: d(1, 10) });

    const r = row(meeting.id);
    expect(r.blocked).toEqual({
      code: 'TRANSITION_BEFORE_LATEST',
      params: { date: '01/10/2026' },
    });
    expect(restored(r)).toEqual(r.blocked);
  });

  it('E18: restores a met appointment that kept the stage, though the stage changed after its day', async () => {
    const { db, customer, schedule, met, row, restored } = await trash();
    const bao = customer('Phạm Gia Bảo');
    const kept = schedule(bao.id, d(2, 10));
    met(kept.id, 'N3');
    met(schedule(bao.id, d(5, 10)).id, 'N2');
    const transitions = listStageTransitions(db, bao.id);
    softDeleteAppointment(db, kept.id);

    const r = row(kept.id);
    expect(r).toMatchObject({ status: 'MET', stageAfter: 'N3', effect: { kind: 'none' } });
    expect(r.blocked).toBeUndefined();
    expect(restored(r)).toBeUndefined();
    expect(listStageTransitions(db, bao.id)).toEqual(transitions);
    expect(byId(listAppointments(db), kept.id)?.status).toBe('MET');
  });

  it('E19: restores a met appointment that kept the stage, though moved by hand on its day', async () => {
    const { db, customer, schedule, met, row, restored } = await trash();
    const bao = customer('Phạm Gia Bảo', 'N2');
    const kept = schedule(bao.id, d(10, 10));
    met(kept.id, 'N2');
    changeStageManually(db, bao.id, { to: 'N3', date: d(10, 10) });
    softDeleteAppointment(db, kept.id);
    const transitions = listStageTransitions(db, bao.id);

    const r = row(kept.id);
    expect(r.effect).toEqual({ kind: 'none' });
    expect(restored(r)).toBeUndefined();
    expect(listStageTransitions(db, bao.id)).toEqual(transitions);
    expect(transitions.at(-1)).toMatchObject({ from: 'N2', to: 'N3', appointmentId: null });
    expect(isRf(db, kept.id)).toBe(false);
  });

  // The same code as E6, flagged as of the same day: later only by the order of recording.
  it('E20: blocks a met appointment once the stage was moved on its day after the deletion', async () => {
    const { db, bao, meeting, row, restored } = await deletedMeeting();
    changeStageManually(db, bao.id, { to: 'N1', date: d(2, 10) });

    const r = row(meeting.id);
    expect(r.blocked).toEqual({
      code: 'TRANSITION_BEFORE_LATEST',
      params: { date: '02/10/2026', sameDay: 1 },
    });
    expect(restored(r)).toEqual(r.blocked);
  });

  it('E20: a change on the meeting day recorded before the deletion does not block', async () => {
    const { db, customer, schedule, met, row, restored } = await trash();
    const bao = customer('Phạm Gia Bảo');
    changeStageManually(db, bao.id, { to: 'N4', date: d(2, 10) });
    const meeting = schedule(bao.id, d(2, 10));
    met(meeting.id, 'N2');
    const transitions = listStageTransitions(db, bao.id);
    softDeleteAppointment(db, meeting.id);

    const r = row(meeting.id);
    expect(r.effect).toMatchObject({ kind: 'stageChange', from: 'N4', to: 'N2' });
    expect(restored(r)).toBeUndefined();
    expect(listStageTransitions(db, bao.id)).toEqual(transitions);
  });

  // DR6-69: "after the deletion" is the order of recording (`seq`), not a clock, which may differ
  // between the machines of an export and an import, stand still or go back.
  const minute = (at: string, by: number) => new Date(Date.parse(at) + by * 60_000).toISOString();
  /** Stamps the customer's transition `seq` as recorded at `at` of the deletion's instant. */
  const stamp = (
    db: Database,
    customerId: string,
    seq: number,
    at: (deleted: string) => string,
  ) => {
    const [[deleted]] = db.sqlite.exec(
      'SELECT deleted_at FROM stage_transitions WHERE customer_id = ? AND deleted_at IS NOT NULL',
      [customerId],
    )[0]!.values as [[string]];
    db.sqlite.run('UPDATE stage_transitions SET created_at = ? WHERE customer_id = ? AND seq = ?', [
      at(deleted),
      customerId,
      seq,
    ]);
  };

  it.each([
    ['earlier than the deletion', (at: string) => minute(at, -1)],
    ['at the instant of the deletion', (at: string) => at],
  ])('E20: blocks a change recorded after the deletion, stamped %s', async (_label, at) => {
    const { db, bao, meeting, row, restored } = await deletedMeeting();
    changeStageManually(db, bao.id, { to: 'N1', date: d(2, 10) });
    stamp(db, bao.id, 3, at);

    const r = row(meeting.id);
    expect(r.blocked).toEqual({
      code: 'TRANSITION_BEFORE_LATEST',
      params: { date: '02/10/2026', sameDay: 1 },
    });
    expect(restored(r)).toEqual(r.blocked);
  });

  it.each([
    ['later than the deletion', (at: string) => minute(at, 1)],
    ['without milliseconds', (at: string) => at.replace(/\.\d+Z$/, 'Z')],
  ])('E20: a change recorded before the deletion does not block, stamped %s', async (_l, at) => {
    const { db, customer, schedule, met, row, restored } = await trash();
    const bao = customer('Phạm Gia Bảo');
    changeStageManually(db, bao.id, { to: 'N4', date: d(2, 10) });
    const meeting = schedule(bao.id, d(2, 10));
    met(meeting.id, 'N2');
    const transitions = listStageTransitions(db, bao.id);
    softDeleteAppointment(db, meeting.id);
    stamp(db, bao.id, 2, at);

    expect(restored(row(meeting.id))).toBeUndefined();
    expect(listStageTransitions(db, bao.id)).toEqual(transitions);
  });

  // DR6-106 (Owner 21/10/2026, Q1 a): a transition given back keeps its place in the order of
  // recording. Two meetings of a day, each recorded after the other was deleted, then both deleted.
  async function twoMeetingsOfADay() {
    const base = await trash();
    const bao = base.customer('Phạm Gia Bảo', 'N4');
    const first = base.schedule(bao.id, d(5, 10));
    const second = base.schedule(bao.id, d(5, 10));
    base.met(first.id, 'N3');
    softDeleteAppointment(base.db, first.id);
    base.met(second.id, 'N2');
    softDeleteAppointment(base.db, second.id);
    return { ...base, bao, first, second };
  }

  it('TR-3: restores two meetings of a day in the order they were recorded', async () => {
    const { db, bao, first, second, row, restored } = await twoMeetingsOfADay();

    expect(restored(row(first.id))).toBeUndefined();
    expect(row(second.id).effect).toMatchObject({ kind: 'stageChange', from: 'N3', to: 'N2' });
    expect(restored(row(second.id))).toBeUndefined();
    // As if both were recorded and neither deleted.
    expect(listStageTransitions(db, bao.id).slice(1)).toMatchObject([
      { from: 'N4', to: 'N3', date: d(5, 10), appointmentId: first.id },
      { from: 'N3', to: 'N2', date: d(5, 10), appointmentId: second.id },
    ]);
  });

  it('TR-3: blocks them in the other order like E20', async () => {
    const { first, second, row, restored } = await twoMeetingsOfADay();

    expect(restored(row(second.id))).toBeUndefined();
    const r = row(first.id);
    expect(r.blocked).toEqual({
      code: 'TRANSITION_BEFORE_LATEST',
      params: { date: '05/10/2026', sameDay: 1 },
    });
    expect(restored(r)).toEqual(r.blocked);
  });

  it('TR-3: blocks a met appointment whose stage after the closed customer cannot move to', async () => {
    const { db, bao, meeting, row, restored } = await deletedMeeting(d(5, 10));
    // Closed the day before the meeting: on its day or after would be E20 or E8.
    changeStageManually(db, bao.id, { to: 'LOST', date: d(4, 10) });

    const r = row(meeting.id);
    expect(r.blocked).toEqual({
      code: 'INVALID_TRANSITION',
      params: { from: 'LOST', to: 'N2' },
    });
    expect(restored(r)).toEqual(r.blocked);
  });

  it('E9: blocks an appointment whose coordinator was deleted', async () => {
    const { db, customer, schedule, row, restored } = await trash();
    const huy = createPerson(db, { name: 'Phó Đức Huy', role: 'IS', teamId: null });
    const planned = schedule(customer().id, d(6, 10), [huy.id]);
    softDeleteAppointment(db, planned.id);
    softDeletePerson(db, huy.id);

    const r = row(planned.id);
    expect(r.blocked).toEqual({
      code: 'PERSON_NOT_FOUND',
      params: { name: 'Phó Đức Huy', as: 'coordinator' },
    });
    expect(restored(r)).toEqual(r.blocked);
  });

  it('E10: blocks a met appointment whose reviewer is now an RE', async () => {
    const { db, team, customer, schedule, met, row, restored } = await trash();
    const tam = createPerson(db, { name: 'Vũ Thanh Tâm', role: 'IS', teamId: null });
    const meeting = schedule(customer().id, d(2, 10));
    met(meeting.id, 'N2', tam.id);
    softDeleteAppointment(db, meeting.id);
    updatePerson(db, tam.id, { role: 'RE', teamId: team.id });

    const r = row(meeting.id);
    expect(r.blocked).toEqual({
      code: 'INVALID_REVIEWER',
      params: { name: 'Vũ Thanh Tâm', role: 'RE' },
    });
    expect(restored(r)).toEqual(r.blocked);
  });

  it('E11: restores a past scheduled appointment, still without an outcome, no stage change', async () => {
    const { db, customer, schedule, row, restored } = await trash();
    const planned = schedule(customer().id, d(30, 9));
    softDeleteAppointment(db, planned.id);

    const r = row(planned.id);
    expect(r.effect).toEqual({ kind: 'none' });
    expect(restored(r)).toBeUndefined();
    expect(byId(listAppointments(db), planned.id)?.status).toBe('SCHEDULED');
  });

  it('TR-5: blocks a met appointment dated after today in an imported file', async () => {
    const { db, meeting, row, restored } = await deletedMeeting();
    db.sqlite.run("UPDATE appointments SET date = '2026-10-14' WHERE id = ?", [meeting.id]);

    const r = row(meeting.id);
    expect(r.blocked).toEqual({ code: 'OUTCOME_IN_FUTURE', params: { date: '14/10/2026' } });
    expect(restored(r)).toEqual(r.blocked);
  });
});

describe('listTrash: policies (TR-2, TR-5)', () => {
  const submit = (db: Parameters<typeof submitPolicy>[0], customerId: string, reId: string) =>
    submitPolicy(db, { customerId, reId, submittedDate: d(15, 9), submittedFyp: 24_000_000 });

  it('E12: restores a policy whose customer and RE are live', async () => {
    const { db, linh, customer, row, restored } = await trash();
    const lan = customer('Hoàng Ngọc Lan');
    const policy = submit(db, lan.id, linh.id);
    softDeletePolicy(db, policy.id);

    const r = row(policy.id);
    expect(r).toMatchObject({
      kind: 'policy',
      submittedDate: d(15, 9),
      submittedFyp: 24_000_000,
      issuedDate: null,
      issuedFyp: null,
      owner: {
        customer: { name: 'Hoàng Ngọc Lan', deleted: false },
        re: { name: 'Đỗ Khánh Linh', deleted: false },
      },
      effect: { kind: 'none' },
    });
    expect(restored(r)).toBeUndefined();
    expect(listPolicies(db)).toHaveLength(1);
  });

  it('E13: blocks a policy submitted after today in an imported file', async () => {
    const { db, linh, customer, row, restored } = await trash();
    const policy = submit(db, customer().id, linh.id);
    softDeletePolicy(db, policy.id);
    db.sqlite.run("UPDATE policies SET submitted_date = '2026-10-20' WHERE id = ?", [policy.id]);

    const r = row(policy.id);
    expect(r.blocked).toEqual({
      code: 'DATE_IN_FUTURE',
      params: { date: '20/10/2026', field: 'submitted' },
    });
    expect(restored(r)).toEqual(r.blocked);
  });

  it('TR-5: blocks a policy issued after today in an imported file', async () => {
    const { db, linh, customer, row, restored } = await trash();
    const policy = submit(db, customer().id, linh.id);
    softDeletePolicy(db, policy.id);
    db.sqlite.run(
      "UPDATE policies SET issued_date = '2026-10-12', issued_fyp = 24000000 WHERE id = ?",
      [policy.id],
    );

    const r = row(policy.id);
    expect(r.blocked).toEqual({
      code: 'DATE_IN_FUTURE',
      params: { date: '12/10/2026', field: 'issued' },
    });
    expect(restored(r)).toEqual(r.blocked);
  });
});

describe('listTrash: people and teams (TR-2)', () => {
  it('E14: blocks a person whose team was deleted until the team comes back', async () => {
    const { db, row, restored } = await trash();
    const binhMinh = createTeam(db, { name: 'Bình Minh' });
    const mai = createPerson(db, { name: 'Vương Thị Mai', role: 'RE', teamId: binhMinh.id });
    softDeletePerson(db, mai.id);
    softDeleteTeam(db, binhMinh.id);

    const r = row(mai.id);
    expect(r).toMatchObject({
      kind: 'person',
      name: 'Vương Thị Mai',
      role: 'RE',
      owner: { team: { name: 'Bình Minh', deleted: true } },
      blocked: { code: 'TEAM_NOT_FOUND', params: { name: 'Bình Minh' } },
    });
    expect(restored(r)).toEqual(r.blocked);

    restoreTeam(db, binhMinh.id);
    expect(row(mai.id).blocked).toBeUndefined();
    restorePerson(db, mai.id);
    expect(listTrash(db)).toEqual([]);
  });

  it('E15: blocks a TL whose team has another TL now', async () => {
    const { db, team, tl, row, restored } = await trash();
    softDeletePerson(db, tl.id);
    const bao = createPerson(db, { name: 'Lý Quốc Bảo', role: 'TL', teamId: team.id });
    softDeletePerson(db, bao.id);
    createPerson(db, { name: 'Nguyễn Thu Hà', role: 'TL', teamId: team.id });

    const r = row(bao.id);
    expect(r.blocked).toEqual({ code: 'TEAM_HAS_LEAD', params: { name: 'Nguyễn Thu Hà' } });
    expect(restored(r)).toEqual(r.blocked);
  });

  it('E16: blocks a team whose name another team took', async () => {
    const { db, row, restored } = await trash();
    const binhMinh = createTeam(db, { name: 'Bình Minh' });
    softDeleteTeam(db, binhMinh.id);
    createTeam(db, { name: 'Bình Minh' });

    const r = row(binhMinh.id);
    expect(r).toMatchObject({ kind: 'team', name: 'Bình Minh', effect: { kind: 'none' } });
    expect(r.blocked).toEqual({ code: 'TEAM_NAME_TAKEN', params: { name: 'Bình Minh' } });
    expect(restored(r)).toEqual(r.blocked);
  });
});

describe('listTrash', () => {
  it('lists every deleted record, newest deletion first, whatever its team or RE (TR-7)', async () => {
    const { db, re, linh, customer, schedule } = await trash();
    const binhMinh = createTeam(db, { name: 'Bình Minh' });
    const mai = createPerson(db, { name: 'Vương Thị Mai', role: 'RE', teamId: binhMinh.id });
    const anh = customer();
    const lan = createCustomer(db, {
      name: 'Hoàng Ngọc Lan',
      reId: mai.id,
      stage: 'N4',
      date: d(1, 9),
    });
    const planned = schedule(anh.id, d(6, 10));
    const policy = submitPolicy(db, {
      customerId: anh.id,
      reId: linh.id,
      submittedDate: d(15, 9),
      submittedFyp: 24_000_000,
    });
    const empty = createTeam(db, { name: 'Hoa Sen' });

    softDeletePolicy(db, policy.id);
    softDeleteAppointment(db, planned.id);
    softDeleteCustomer(db, lan.id);
    softDeletePerson(db, re.id);
    softDeleteTeam(db, empty.id);

    expect(listTrash(db).map((r) => [r.kind, r.id])).toEqual([
      ['team', empty.id],
      ['person', re.id],
      ['customer', lan.id],
      ['appointment', planned.id],
      ['policy', policy.id],
    ]);
    expect(
      listTrash(db).every((r, i, all) => i === 0 || all[i - 1]!.deletedAt >= r.deletedAt),
    ).toBe(true);
  });

  it('has each restore command refuse a record that is not there, by the code of its kind', async () => {
    const { db } = await trash();

    const refused = Object.entries(RESTORE).map(([kind, restore]) => {
      const error = errorOf(() => restore(db, 'nowhere'));
      return [kind, error?.code, error?.params];
    });

    expect(refused).toEqual([
      ['team', 'TEAM_NOT_FOUND', undefined],
      ['person', 'PERSON_NOT_FOUND', undefined],
      ['customer', 'CUSTOMER_NOT_FOUND', undefined],
      ['appointment', 'APPOINTMENT_NOT_FOUND', undefined],
      ['policy', 'POLICY_NOT_FOUND', undefined],
    ]);
  });

  // #539: what a deleted record points to is read by its id, so an empty trash reads no name.
  it('reads the teams, people and customers only for their deleted rows while the trash is empty', async () => {
    const { db, customer, schedule } = await trash();
    schedule(customer().id, d(6, 10));
    const exec = vi.spyOn(db.sqlite, 'exec');
    const prepare = vi.spyOn(db.sqlite, 'prepare');

    expect(listTrash(db)).toEqual([]);

    const reads = [...exec.mock.calls, ...prepare.mock.calls]
      .map(([sql]) => sql)
      .filter((sql) => /\b(teams|people|customers)\b/.test(sql));
    expect(reads).not.toEqual([]);
    expect(reads.filter((sql) => !/deleted_at"? is not null/i.test(sql))).toEqual([]);
  });
});
