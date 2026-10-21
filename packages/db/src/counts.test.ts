import { isRfAppointment } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import {
  editMeetingOutcome,
  listAppointments,
  recordMeetingOutcome,
  scheduleAppointment,
  softDeleteAppointment,
} from './appointments';
import { changeStageManually, createCustomer, listStageTransitions } from './customers';
import { countCustomerRecords } from './counts';
import { addKycNote } from './kyc';
import { softDeletePolicy, submitPolicy } from './policies';
import { d, setup } from './test-support';

describe('countCustomerRecords (mockup 5f, spec Phase 6 TR-4, TR-9)', () => {
  it("counts the customer's records not deleted on their own, the RFs as the metrics count them", async () => {
    const { db, re } = await setup(d(11, 10));
    const anh = createCustomer(db, {
      name: 'Trịnh Minh Anh',
      reId: re.id,
      stage: 'N3',
      date: d(1, 9),
    });
    const other = createCustomer(db, {
      name: 'Lê Văn Cường',
      reId: re.id,
      stage: 'N3',
      date: d(1, 9),
    });
    const schedule = (customerId: string, day: number) =>
      scheduleAppointment(db, {
        customerId,
        reId: re.id,
        date: d(day, 10),
        triggerType: 'REFERRAL',
        coordinatorIds: [],
      });
    const met = (id: string, stageAfter: 'N2' | 'N1') =>
      recordMeetingOutcome(db, id, { status: 'MET', stageAfter, nextStep: 'Gửi giải pháp' });
    const [first, second, third, gone, ...planned] = [1, 2, 3, 4, 5, 6, 7, 8].map((day) =>
      schedule(anh.id, day),
    );
    // N3 → N2 counts as an RF; N2 → N2 moves nothing; a manual change never counts.
    met(first!.id, 'N2');
    met(second!.id, 'N2');
    changeStageManually(db, anh.id, { to: 'N1', date: d(2, 10) });
    met(third!.id, 'N1');
    softDeleteAppointment(db, gone!.id);
    met(schedule(other.id, 1).id, 'N2');
    submitPolicy(db, {
      customerId: anh.id,
      reId: re.id,
      submittedDate: d(3, 10),
      submittedFyp: 24_000_000,
    });
    const dropped = submitPolicy(db, {
      customerId: anh.id,
      reId: re.id,
      submittedDate: d(4, 10),
      submittedFyp: 12_000_000,
    });
    softDeletePolicy(db, dropped.id);
    for (const day of [1, 2, 3, 4, 5])
      addKycNote(db, anh.id, { text: `Ghi chú ${day}`, date: d(day, 10) });
    addKycNote(db, other.id, { text: 'Ghi chú khác', date: d(1, 10) });

    const counts = countCustomerRecords(db, anh.id);
    expect(counts).toEqual({
      appointments: 3 + planned.length,
      met: 3,
      rf: 1,
      policies: 1,
      kycNotes: 5,
      aiAnalyses: 0,
      appointmentsInTrash: 1,
      policiesInTrash: 1,
    });
    const transitions = listStageTransitions(db);
    expect(
      listAppointments(db, anh.id).filter((a) => isRfAppointment(a, transitions)),
    ).toHaveLength(counts.rf);
  });

  // Moving a met meeting's day (6f) withdraws its transition and records it again on the new day:
  // the withdrawn one still points at the live appointment (DR6-59).
  it('counts one RF for a met meeting moved to another day', async () => {
    const { db, re } = await setup(d(11, 10));
    const anh = createCustomer(db, {
      name: 'Trịnh Minh Anh',
      reId: re.id,
      stage: 'N3',
      date: d(1, 9),
    });
    const meeting = scheduleAppointment(db, {
      customerId: anh.id,
      reId: re.id,
      date: d(1, 10),
      triggerType: 'REFERRAL',
      coordinatorIds: [],
    });
    const outcome = { status: 'MET', stageAfter: 'N2', nextStep: 'Gửi giải pháp' } as const;
    recordMeetingOutcome(db, meeting.id, outcome);
    editMeetingOutcome(db, meeting.id, outcome, { date: d(2, 10) });

    expect(countCustomerRecords(db, anh.id)).toMatchObject({ met: 1, rf: 1 });
  });

  // The birth year and gender of the profile are written as notes of the system (spec Phase 3 D2):
  // 5f and the trash row count them as the box of the purge does (DR6-125, mockup 11i).
  it('counts the notes the system wrote from the profile with the others', async () => {
    const { db, re } = await setup(d(11, 10));
    const lan = createCustomer(db, {
      name: 'Lan',
      reId: re.id,
      stage: 'N3',
      date: d(1, 9),
      birthDate: { year: 1985 },
      gender: 'FEMALE',
    });
    addKycNote(db, lan.id, { text: 'Làm luật sư', date: d(2, 9) });

    // One note of the system holds both fields, and the RE wrote the other.
    expect(countCustomerRecords(db, lan.id).kycNotes).toBe(2);
  });

  it('counts nothing for a customer without records', async () => {
    const { db, re } = await setup();
    const anh = createCustomer(db, {
      name: 'Trịnh Minh Anh',
      reId: re.id,
      stage: 'N4',
      date: d(1, 9),
    });

    expect(countCustomerRecords(db, anh.id)).toEqual({
      appointments: 0,
      met: 0,
      rf: 0,
      policies: 0,
      kycNotes: 0,
      aiAnalyses: 0,
      appointmentsInTrash: 0,
      policiesInTrash: 0,
    });
  });
});
