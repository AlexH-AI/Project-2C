/**
 * The table reads the screens share (T-151): `listAppointments` and `listStageTransitions` read
 * through raw SQL, and `countRecords` counts in SQL. Each must give exactly what the drizzle
 * queries they replace gave — kept here as the reference.
 */
import { calendarDate, fromIsoDate } from '@p2c/domain';
import { and, asc, eq, isNull } from 'drizzle-orm';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  listAppointments,
  recordMeetingOutcome,
  rescheduleAppointment,
  scheduleAppointment,
  softDeleteAppointment,
} from './appointments';
import {
  changeStageManually,
  createCustomer,
  listCustomers,
  listStageTransitions,
  softDeleteCustomer,
} from './customers';
import type { Database } from './database';
import { countRecords } from './counts';
import { submitPolicy, listPolicies } from './policies';
import { appointmentCoordinators, appointments, customers, stageTransitions } from './schema';
import {
  createPerson,
  createTeam,
  listPeople,
  listTeams,
  softDeletePerson,
  softDeleteTeam,
} from './team';
import { setup } from './test-support';

const day = (d: number) => calendarDate(2026, 9, d);

/** `listAppointments` as drizzle read it before T-151. */
function drizzleAppointments(db: Database, customerId?: string) {
  const rows = db.orm
    .select({ a: appointments })
    .from(appointments)
    .innerJoin(customers, eq(customers.id, appointments.customerId))
    .where(
      and(
        isNull(appointments.deletedAt),
        isNull(customers.deletedAt),
        customerId === undefined ? undefined : eq(appointments.customerId, customerId),
      ),
    )
    .orderBy(asc(appointments.date), asc(appointments.time), asc(appointments.id))
    .all();
  const coordinators = db.orm
    .select({
      appointmentId: appointmentCoordinators.appointmentId,
      personId: appointmentCoordinators.personId,
    })
    .from(appointmentCoordinators)
    .orderBy(asc(appointmentCoordinators.personId))
    .all();
  return rows.map(({ a }) => ({
    id: a.id,
    customerId: a.customerId,
    reId: a.reId,
    coordinatorIds: coordinators.filter((c) => c.appointmentId === a.id).map((c) => c.personId),
    date: fromIsoDate(a.date),
    time: a.time,
    status: a.status,
    triggerType: a.triggerType,
    triggerNote: a.triggerNote,
    stageAfter: a.stageAfter,
    expectedCaseSize: a.expectedCaseSize,
    nextStep: a.nextStep,
    note: a.note,
    rescheduledFromId: a.rescheduledFromId,
    outcomeReviewerId: a.outcomeReviewerId,
  }));
}

/** `listStageTransitions` as drizzle read it before T-151. */
function drizzleTransitions(db: Database, customerId?: string) {
  return db.orm
    .select({ t: stageTransitions })
    .from(stageTransitions)
    .innerJoin(customers, eq(customers.id, stageTransitions.customerId))
    .where(
      and(
        isNull(stageTransitions.deletedAt),
        isNull(customers.deletedAt),
        customerId === undefined ? undefined : eq(stageTransitions.customerId, customerId),
      ),
    )
    .orderBy(asc(stageTransitions.customerId), asc(stageTransitions.seq))
    .all()
    .map(({ t }) => ({
      id: t.id,
      customerId: t.customerId,
      from: t.fromStage,
      to: t.toStage,
      date: fromIsoDate(t.date),
      appointmentId: t.appointmentId,
    }));
}

/**
 * Lan: two coordinators, a met meeting with a case size and a reviewer, a rescheduled appointment,
 * a moved stage and a policy; appointments on one day with and without a time. Hoa: a met meeting
 * deleted with its transition. Kiên: deleted with an appointment, a transition and a policy.
 * Plus a deleted team and person.
 */
async function history() {
  const { db, team, re, otherRe, tl } = await setup();
  const is = createPerson(db, { name: 'Ý', role: 'IS', teamId: null });
  const lan = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N4', date: day(1) });
  const met = scheduleAppointment(db, {
    customerId: lan.id,
    reId: re.id,
    date: day(10),
    time: '09:30',
    triggerType: 'REFERRAL',
    triggerNote: 'Chị Mai giới thiệu',
    coordinatorIds: [tl.id, is.id],
  });
  recordMeetingOutcome(db, met.id, {
    status: 'MET',
    stageAfter: 'N3',
    nextStep: 'Gửi bảng minh họa',
    expectedCaseSize: 30_000_000,
    note: 'Quan tâm hưu trí',
    outcomeReviewerId: tl.id,
  });
  scheduleAppointment(db, { customerId: lan.id, reId: re.id, date: day(10), triggerType: 'EVENT' });
  const moved = scheduleAppointment(db, {
    customerId: lan.id,
    reId: re.id,
    date: day(12),
    time: '14:00',
    triggerType: 'EVENT',
    coordinatorIds: [tl.id],
  });
  rescheduleAppointment(db, moved.id, { date: day(15) }, 'Khách bận');
  changeStageManually(db, lan.id, { to: 'N2', date: day(18) });
  submitPolicy(db, {
    customerId: lan.id,
    reId: re.id,
    submittedDate: day(19),
    submittedFyp: 20_000_000,
  });

  const hoa = createCustomer(db, { name: 'Hoa', reId: otherRe.id, stage: 'N4', date: day(2) });
  const withdrawn = scheduleAppointment(db, {
    customerId: hoa.id,
    reId: otherRe.id,
    date: day(5),
    triggerType: 'OTHER',
  });
  recordMeetingOutcome(db, withdrawn.id, { status: 'MET', stageAfter: 'N2', nextStep: 'Gặp lại' });
  softDeleteAppointment(db, withdrawn.id);
  scheduleAppointment(db, {
    customerId: hoa.id,
    reId: otherRe.id,
    date: day(5),
    time: '08:00',
    triggerType: 'OTHER',
  });

  const kien = createCustomer(db, { name: 'Kiên', reId: re.id, stage: 'N3', date: day(4) });
  const kienMet = scheduleAppointment(db, {
    customerId: kien.id,
    reId: re.id,
    date: day(6),
    triggerType: 'OTHER',
  });
  recordMeetingOutcome(db, kienMet.id, { status: 'MET', stageAfter: 'N1', nextStep: 'Nộp HĐ' });
  submitPolicy(db, {
    customerId: kien.id,
    reId: re.id,
    submittedDate: day(8),
    submittedFyp: 10_000_000,
  });
  softDeleteCustomer(db, kien.id);

  const gone = createTeam(db, { name: 'Bình Minh' });
  softDeleteTeam(db, gone.id);
  const left = createPerson(db, { name: 'Tú', role: 'RE', teamId: team.id });
  softDeletePerson(db, left.id);
  return { db, ids: { lan: lan.id, hoa: hoa.id, kien: kien.id } };
}

describe('shared table reads', () => {
  let db: Database;
  let ids: Awaited<ReturnType<typeof history>>['ids'];
  beforeAll(async () => {
    ({ db, ids } = await history());
  });

  it('reads appointments exactly as drizzle did', () => {
    const all = listAppointments(db);
    expect(all.length).toBe(5);
    expect(all).toStrictEqual(drizzleAppointments(db));
    for (const id of Object.values(ids)) {
      expect(listAppointments(db, id)).toStrictEqual(drizzleAppointments(db, id));
    }
  });

  it('reads stage transitions exactly as drizzle did', () => {
    const all = listStageTransitions(db);
    expect(all.length).toBe(4);
    expect(all).toStrictEqual(drizzleTransitions(db));
    for (const id of Object.values(ids)) {
      expect(listStageTransitions(db, id)).toStrictEqual(drizzleTransitions(db, id));
    }
  });

  it('counts the live records the lists hold', () => {
    expect(countRecords(db)).toStrictEqual({
      teams: listTeams(db).length,
      people: listPeople(db).length,
      customers: listCustomers(db).length,
      appointments: listAppointments(db).length,
      policies: listPolicies(db).length,
    });
    expect(countRecords(db)).toStrictEqual({
      teams: 1,
      people: 4,
      customers: 2,
      appointments: 5,
      policies: 1,
    });
  });
});
