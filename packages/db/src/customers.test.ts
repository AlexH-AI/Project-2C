import { stageOn, type CalendarDate, type CustomerStage, type StageTransition } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import {
  changeStageManually,
  createCustomer,
  getCustomer,
  listCustomers,
  listStageTransitions,
  meetingKeepingMove,
  previewCustomerProfile,
  previewHandover,
  restoreCustomer,
  softDeleteCustomer,
  stagesOfDay,
  updateCustomerProfile,
} from './customers';
import {
  getAppointment,
  listAppointments,
  recordMeetingOutcome,
  restoreAppointment,
  scheduleAppointment,
  softDeleteAppointment,
} from './appointments';
import { exportBackup, importBackup } from './backup';
import { getKycProfile, listKycVersions } from './kyc';
import { getPolicy, submitPolicy } from './policies';
import { createPerson, softDeletePerson, updatePerson } from './team';
import { codeOf, d, errorOf, setup } from './test-support';

describe('customers', () => {
  it('creates a customer in an open stage with its first transition', async () => {
    const { db, re, persist } = await setup();

    const customer = createCustomer(db, {
      name: ' Lan ',
      reId: re.id,
      stage: 'N4',
      date: d(1, 9),
      birthDate: { year: 1985 },
      gender: 'FEMALE',
    });

    expect(customer).toEqual({
      id: expect.stringMatching(/^[0-9A-Z]{26}$/),
      code: expect.stringMatching(/^K-[0-9A-HJKMNP-TV-Z]{4}$/),
      name: 'Lan',
      reId: re.id,
      stage: 'N4',
      birthDate: { year: 1985 },
      gender: 'FEMALE',
    });
    expect(getCustomer(db, customer.id)).toEqual(customer);
    expect(listStageTransitions(db)).toEqual([
      {
        id: expect.any(String),
        customerId: customer.id,
        from: null,
        to: 'N4',
        date: d(1, 9),
        appointmentId: null,
      },
    ]);
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it('refuses a closed stage, a missing RE, a non-RE owner and a bad date', async () => {
    const { db, re, tl } = await setup();
    const base = { name: 'Lan', reId: re.id, stage: 'N3' as const, date: d(1, 1) };

    expect(codeOf(() => createCustomer(db, { ...base, stage: 'ON_HOLD' }))).toBe(
      'INVALID_TRANSITION',
    );
    expect(codeOf(() => createCustomer(db, { ...base, stage: 'LOST' }))).toBe('INVALID_TRANSITION');
    expect(codeOf(() => createCustomer(db, { ...base, reId: 'nobody' }))).toBe('PERSON_NOT_FOUND');
    expect(codeOf(() => createCustomer(db, { ...base, reId: tl.id }))).toBe('RE_REQUIRED');
    expect(codeOf(() => createCustomer(db, { ...base, name: ' ' }))).toBe('NAME_REQUIRED');
    // DR6-72: the blank Braille pattern shows nothing.
    expect(codeOf(() => createCustomer(db, { ...base, name: '\u{2800}' }))).toBe('NAME_REQUIRED');
    expect(codeOf(() => createCustomer(db, { ...base, birthDate: { year: 1800 } }))).toBe(
      'INVALID_DATE',
    );
    expect(
      codeOf(() => createCustomer(db, { ...base, birthDate: { year: 1990, month: 2, day: 30 } })),
    ).toBe('INVALID_DATE');
    expect(
      codeOf(() => createCustomer(db, { ...base, date: { year: 2027, month: 13, day: 1 } })),
    ).toBe('INVALID_DATE');
    expect(codeOf(() => createCustomer(db, { ...base, birthDate: { year: 2101 } }))).toBe(
      'INVALID_DATE',
    );
    expect(
      codeOf(() => createCustomer(db, { ...base, date: { year: 2101, month: 1, day: 1 } })),
    ).toBe('INVALID_DATE');
    expect(listCustomers(db)).toEqual([]);
  });

  // DR6-51: a value outside its list has a code the UI can show, not the raw CHECK error.
  it('refuses a gender or a stage outside their lists with a code', async () => {
    const { db, re, persist } = await setup();
    const base = { name: 'Lan', reId: re.id, stage: 'N3' as const, date: d(1, 1) };
    const lan = createCustomer(db, base);
    const before = db.export();
    persist.mockClear();
    const gender = 'X' as 'MALE';
    const stage = 'N9' as 'N2';

    expect(codeOf(() => createCustomer(db, { ...base, gender }))).toBe('INVALID_CHOICE');
    expect(codeOf(() => updateCustomerProfile(db, lan.id, { gender }))).toBe('INVALID_CHOICE');
    expect(codeOf(() => createCustomer(db, { ...base, stage }))).toBe('INVALID_TRANSITION');
    expect(codeOf(() => changeStageManually(db, lan.id, { to: stage, date: d(2, 1) }))).toBe(
      'INVALID_TRANSITION',
    );
    expect(db.export()).toEqual(before);
    expect(persist).not.toHaveBeenCalled();
  });

  it('stores a full birth date or none, and lists customers in creation order', async () => {
    const { db, re } = await setup();
    const mai = createCustomer(db, {
      name: 'Mai',
      reId: re.id,
      stage: 'N1',
      date: d(1, 1),
      birthDate: d(9, 3, 1990),
    });
    const lan = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N3', date: d(1, 1) });

    expect(mai.birthDate).toEqual(d(9, 3, 1990));
    expect(lan).toMatchObject({ birthDate: null, gender: null });
    expect(listCustomers(db).map((c) => c.name)).toEqual(['Mai', 'Lan']);
    expect(new Set([mai.code, lan.code]).size).toBe(2);
  });

  // Clearing a birth date or gender once set is refused (D2, see kyc.test.ts).
  it('updates the profile, keeping what is not given', async () => {
    const { db, re, otherRe, tl } = await setup();
    const customer = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N3', date: d(1, 1) });

    const updated = updateCustomerProfile(db, customer.id, {
      name: 'Lan Anh',
      reId: otherRe.id,
      birthDate: { year: 1985 },
    });

    expect(updated).toEqual({
      ...customer,
      name: 'Lan Anh',
      reId: otherRe.id,
      birthDate: { year: 1985 },
      gender: null,
    });
    expect(updateCustomerProfile(db, customer.id, {})).toEqual(updated);
    expect(updateCustomerProfile(db, customer.id, { gender: null }).gender).toBeNull();
    expect(codeOf(() => updateCustomerProfile(db, customer.id, { reId: tl.id }))).toBe(
      'RE_REQUIRED',
    );
    expect(codeOf(() => updateCustomerProfile(db, 'nobody', { name: 'X' }))).toBe(
      'CUSTOMER_NOT_FOUND',
    );
  });

  // Owner 15/10/2026 (deep review round 1 §9 Q3, T-233): what has an outcome or is past, and the
  // policies, keep counting for the RE recorded on them (ADR-0007).
  it('hands the planned appointments over to a new RE, and nothing else (5c)', async () => {
    const { db, re, otherRe, tl } = await setup();
    const customer = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N3', date: d(1, 1) });
    const schedule = (date: CalendarDate) =>
      scheduleAppointment(db, {
        customerId: customer.id,
        reId: re.id,
        date,
        triggerType: 'REFERRAL',
        coordinatorIds: [tl.id],
      });
    const today = schedule(d(26, 9));
    const nextWeek = schedule(d(3, 10));
    const unrecorded = schedule(d(25, 9));
    const met = recordMeetingOutcome(db, schedule(d(15, 9)).id, {
      status: 'MET',
      stageAfter: 'N3',
      nextStep: 'Gọi lại',
    });
    const cancelled = recordMeetingOutcome(db, schedule(d(5, 10)).id, { status: 'CANCELLED' });
    const deleted = schedule(d(10, 10));
    softDeleteAppointment(db, deleted.id);
    const policy = submitPolicy(db, {
      customerId: customer.id,
      reId: re.id,
      submittedDate: d(16, 9),
      submittedFyp: 1_000_000,
    });

    expect(previewHandover(db, customer.id, otherRe.id)).toBe(2);
    expect(previewHandover(db, customer.id, re.id)).toBe(0);
    updateCustomerProfile(db, customer.id, { reId: otherRe.id });

    const reOf = new Map(listAppointments(db, customer.id).map((a) => [a.id, a.reId]));
    expect(reOf).toEqual(
      new Map([
        [met.id, re.id],
        [unrecorded.id, re.id],
        [today.id, otherRe.id],
        [nextWeek.id, otherRe.id],
        [cancelled.id, re.id],
      ]),
    );
    expect(getAppointment(db, today.id)?.coordinatorIds).toEqual([tl.id]);
    expect(getPolicy(db, policy.id)?.reId).toBe(re.id);
    expect(previewHandover(db, customer.id, otherRe.id)).toBe(0);
    // The trash gives an appointment back as it was deleted (spec Phase 6 TR-3).
    restoreAppointment(db, deleted.id);
    expect(getAppointment(db, deleted.id)?.reId).toBe(re.id);
    // Backup rule 5 holds: every live record is on a live RE.
    await expect(importBackup(exportBackup(db), { now: db.now })).resolves.toBeDefined();
  });

  it('hands over only when the RE changes, and saves nothing when refused', async () => {
    const { db, team, re, otherRe, tl } = await setup();
    const third = createPerson(db, { name: 'Chi', role: 'RE', teamId: team.id });
    const customer = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N3', date: d(1, 1) });
    // Booked for another RE than the customer's, which the dialog allows (mockups 6a, 6h).
    const booked = scheduleAppointment(db, {
      customerId: customer.id,
      reId: otherRe.id,
      date: d(30, 9),
      triggerType: 'REFERRAL',
    });

    updateCustomerProfile(db, customer.id, { name: 'Lan Anh', birthDate: { year: 1985 } });
    expect(getAppointment(db, booked.id)?.reId).toBe(otherRe.id);
    // Theirs already: nothing to hand over, the appointment booked for another RE included (R16).
    expect(previewHandover(db, customer.id, re.id)).toBe(0);
    expect(previewHandover(db, customer.id, otherRe.id)).toBe(0);
    expect(previewHandover(db, customer.id, third.id)).toBe(1);
    expect(codeOf(() => updateCustomerProfile(db, customer.id, { reId: tl.id }))).toBe(
      'RE_REQUIRED',
    );
    expect(
      codeOf(() => updateCustomerProfile(db, customer.id, { reId: third.id, name: ' ' })),
    ).toBe('NAME_REQUIRED');
    expect(getAppointment(db, booked.id)?.reId).toBe(otherRe.id);

    updateCustomerProfile(db, customer.id, { reId: otherRe.id });
    updateCustomerProfile(db, customer.id, { reId: re.id });
    expect(getAppointment(db, booked.id)?.reId).toBe(re.id);
    expect(codeOf(() => previewHandover(db, 'nobody', re.id))).toBe('CUSTOMER_NOT_FOUND');
  });

  it('previews the KYC note, facts and version that saving the profile records (5c)', async () => {
    const { db, re } = await setup();
    const customer = createCustomer(db, {
      name: 'Lan',
      reId: re.id,
      stage: 'N3',
      date: d(1, 1),
      birthDate: { year: 1984 },
      gender: 'FEMALE',
    });
    const kyc = () => ({
      notes: getKycProfile(db, customer.id).notes.map((note) => [note.source, note.text]),
      facts: getKycProfile(db, customer.id)
        .facts.filter((fact) => fact.status === 'active')
        .map((fact) => [fact.field, fact.value])
        .sort(([a], [b]) => String(a).localeCompare(String(b))),
      versions: listKycVersions(db, customer.id).length,
    });

    expect(previewCustomerProfile(db, customer.id, { birthDate: { year: 1984 } })).toBeNull();
    expect(previewCustomerProfile(db, customer.id, { gender: 'FEMALE' })).toBeNull();

    const sameYear = { birthDate: d(12, 3, 1984) };
    const before = kyc();
    expect(previewCustomerProfile(db, customer.id, sameYear)).toEqual({
      note: 'Hồ sơ KH: ngày sinh 12/03/1984',
      facts: [{ field: 'birthYear', value: 1984 }],
      newVersion: false,
    });
    expect(kyc()).toEqual(before);
    updateCustomerProfile(db, customer.id, sameYear);
    expect(kyc().notes.at(-1)).toEqual(['SYSTEM', 'Hồ sơ KH: ngày sinh 12/03/1984']);
    expect(kyc().facts).toEqual(before.facts);
    expect(kyc().versions).toBe(before.versions);

    const otherYear = { birthDate: { year: 1985 }, gender: 'MALE' as const };
    expect(previewCustomerProfile(db, customer.id, otherYear)).toEqual({
      note: 'Hồ sơ KH: năm sinh 1985; giới tính Nam',
      facts: [
        { field: 'birthYear', value: 1985 },
        { field: 'gender', value: 'Nam' },
      ],
      newVersion: true,
    });
    updateCustomerProfile(db, customer.id, otherYear);
    expect(kyc().notes.at(-1)).toEqual(['SYSTEM', 'Hồ sơ KH: năm sinh 1985; giới tính Nam']);
    expect(kyc().facts).toEqual([
      ['birthYear', 1985],
      ['gender', 'Nam'],
    ]);
    expect(kyc().versions).toBe(before.versions + 1);
  });

  it('changes the stage by hand, keeping the stage equal to the latest transition', async () => {
    const { db, re } = await setup();
    const customer = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N3', date: d(1, 1) });

    const hold = changeStageManually(db, customer.id, { to: 'ON_HOLD', date: d(5, 1) });
    changeStageManually(db, customer.id, { to: 'N3', date: d(5, 1) });

    expect(hold).toMatchObject({ from: 'N3', to: 'ON_HOLD', appointmentId: null });
    expect(getCustomer(db, customer.id)?.stage).toBe('N3');
    expect(listStageTransitions(db, customer.id).map((t) => [t.from, t.to])).toEqual([
      [null, 'N3'],
      ['N3', 'ON_HOLD'],
      ['ON_HOLD', 'N3'],
    ]);
    expect(codeOf(() => changeStageManually(db, customer.id, { to: 'N3', date: d(6, 1) }))).toBe(
      'INVALID_TRANSITION',
    );
    changeStageManually(db, customer.id, { to: 'LOST', date: d(7, 1) });
    expect(codeOf(() => changeStageManually(db, customer.id, { to: 'N1', date: d(8, 1) }))).toBe(
      'INVALID_TRANSITION',
    );
  });

  // D10: a transition dated before the customer's latest would make `stageOn` disagree with
  // `customers.stage`, so it is refused; the same day is fine and counts in recording order.
  it('refuses a stage change dated before the latest transition, even before creation', async () => {
    const { db, re, persist } = await setup();
    const customer = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N3', date: d(10, 1) });
    changeStageManually(db, customer.id, { to: 'N4', date: d(20, 1) });
    persist.mockClear();

    expect(
      errorOf(() => changeStageManually(db, customer.id, { to: 'N2', date: d(19, 1) })),
    ).toMatchObject({
      code: 'TRANSITION_BEFORE_LATEST',
      params: { date: '20/01/2026' },
    });
    // Checked before the transition rule: an earlier date is reported even for a disallowed move.
    expect(codeOf(() => changeStageManually(db, customer.id, { to: 'N4', date: d(19, 1) }))).toBe(
      'TRANSITION_BEFORE_LATEST',
    );
    expect(getCustomer(db, customer.id)?.stage).toBe('N4');
    expect(listStageTransitions(db, customer.id)).toHaveLength(2);
    expect(persist).not.toHaveBeenCalled();

    const fresh = createCustomer(db, { name: 'Mai', reId: re.id, stage: 'N3', date: d(10, 1) });
    expect(codeOf(() => changeStageManually(db, fresh.id, { to: 'N2', date: d(1, 1) }))).toBe(
      'TRANSITION_BEFORE_LATEST',
    );
  });

  // F-11: `stageOn(today)` equals `customers.stage` only while no transition, the creation's
  // included, is dated after today.
  it('refuses a creation or stage change dated after today, and takes today itself', async () => {
    const { db, re, persist } = await setup();
    const input = { name: 'Lan', reId: re.id, stage: 'N3', birthDate: { year: 1984 } } as const;

    expect(codeOf(() => createCustomer(db, { ...input, date: d(27, 9) }))).toBe('DATE_IN_FUTURE');
    expect(listCustomers(db)).toEqual([]);
    expect(persist).not.toHaveBeenCalled();

    const customer = createCustomer(db, { ...input, date: d(26, 9) });
    persist.mockClear();

    expect(codeOf(() => changeStageManually(db, customer.id, { to: 'N2', date: d(27, 9) }))).toBe(
      'DATE_IN_FUTURE',
    );
    expect(listStageTransitions(db, customer.id)).toHaveLength(1);
    expect(getCustomer(db, customer.id)?.stage).toBe('N3');
    expect(persist).not.toHaveBeenCalled();

    changeStageManually(db, customer.id, { to: 'N2', date: d(26, 9) });
    expect(stageOn(listStageTransitions(db), customer.id, d(26, 9))).toBe('N2');
  });

  // DR-42: a birth date has already happened too; a year alone is after today only from next year.
  it('refuses a birth date or birth year after today, and takes today and this year', async () => {
    const { db, re, persist } = await setup();
    const input = { name: 'Lan', reId: re.id, stage: 'N3', date: d(1, 9) } as const;

    for (const birthDate of [d(27, 9), { year: 2027 }]) {
      expect(codeOf(() => createCustomer(db, { ...input, birthDate }))).toBe('DATE_IN_FUTURE');
    }
    expect(listCustomers(db)).toEqual([]);
    expect(persist).not.toHaveBeenCalled();

    const customer = createCustomer(db, { ...input, birthDate: { year: 2026 } });
    expect(codeOf(() => updateCustomerProfile(db, customer.id, { birthDate: d(27, 9) }))).toBe(
      'DATE_IN_FUTURE',
    );
    expect(codeOf(() => previewCustomerProfile(db, customer.id, { birthDate: d(27, 9) }))).toBe(
      'DATE_IN_FUTURE',
    );
    expect(updateCustomerProfile(db, customer.id, { birthDate: d(26, 9) }).birthDate).toEqual(
      d(26, 9),
    );
  });

  it('allows a stage change on the day of the latest transition, in recording order', async () => {
    const { db, re } = await setup();
    const customer = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N3', date: d(10, 1) });

    changeStageManually(db, customer.id, { to: 'N2', date: d(10, 1) });
    changeStageManually(db, customer.id, { to: 'N1', date: d(10, 1) });

    const stage = getCustomer(db, customer.id)?.stage;
    expect(stage).toBe('N1');
    expect(stageOn(listStageTransitions(db), customer.id, d(10, 1))).toBe(stage);
  });

  it('hides a soft-deleted customer and its transitions until restored', async () => {
    const { db, re } = await setup();
    const customer = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N3', date: d(1, 1) });

    softDeleteCustomer(db, customer.id);

    expect(getCustomer(db, customer.id)).toBeUndefined();
    expect(listCustomers(db)).toEqual([]);
    expect(listStageTransitions(db)).toEqual([]);
    expect(codeOf(() => softDeleteCustomer(db, customer.id))).toBe('CUSTOMER_NOT_FOUND');
    expect(codeOf(() => changeStageManually(db, customer.id, { to: 'N2', date: d(2, 1) }))).toBe(
      'CUSTOMER_NOT_FOUND',
    );

    restoreCustomer(db, customer.id);
    expect(getCustomer(db, customer.id)).toEqual(customer);
    expect(listStageTransitions(db)).toHaveLength(1);
    expect(codeOf(() => restoreCustomer(db, 'nobody'))).toBe('CUSTOMER_NOT_FOUND');
  });

  it('restores a customer only while its RE is live, and keeps a used RE from deletion', async () => {
    const { db, re } = await setup();
    const customer = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N3', date: d(1, 1) });

    expect(codeOf(() => softDeletePerson(db, re.id))).toBe('PERSON_IN_USE');
    softDeleteCustomer(db, customer.id);
    softDeletePerson(db, re.id);

    expect(codeOf(() => restoreCustomer(db, customer.id))).toBe('PERSON_NOT_FOUND');
  });

  it('keeps an RE who owns a live customer from leaving the RE role', async () => {
    const { db, re } = await setup();
    const customer = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N3', date: d(1, 1) });

    expect(codeOf(() => updatePerson(db, re.id, { role: 'TL' }))).toBe('PERSON_IN_USE');
    expect(updatePerson(db, re.id, { name: 'An Nguyễn', role: 'RE' }).name).toBe('An Nguyễn');

    softDeleteCustomer(db, customer.id);
    // The team already has its one TL (B1b), so leave for a shared role instead.
    expect(updatePerson(db, re.id, { role: 'IS', teamId: null }).role).toBe('IS');
  });

  it('refuses to withdraw a first transition tied to an appointment, leaving the stage as it was', async () => {
    const { db, re } = await setup();
    const customer = createCustomer(db, {
      name: 'Lan',
      reId: re.id,
      stage: 'N3',
      date: d(1, 9),
    });
    const met = scheduleAppointment(db, {
      customerId: customer.id,
      reId: re.id,
      date: d(1, 9),
      triggerType: 'REFERRAL',
    });
    recordMeetingOutcome(db, met.id, { status: 'MET', stageAfter: 'N3', nextStep: 'Gặp lại' });
    // Only a hand-edited file ties the creation to a meeting kept in the same stage, same day.
    db.sqlite.run('UPDATE stage_transitions SET appointment_id = ? WHERE customer_id = ?', [
      met.id,
      customer.id,
    ]);

    expect(codeOf(() => softDeleteAppointment(db, met.id))).toBe('INVALID_TRANSITION');
    expect(getCustomer(db, customer.id)?.stage).toBe('N3');
    expect(listStageTransitions(db, customer.id)).toHaveLength(1);
  });
});

const step = (
  id: string,
  from: CustomerStage | null,
  to: CustomerStage,
  date: CalendarDate,
  appointmentId: string | null = null,
  customerId = 'c1',
): StageTransition => ({ id, customerId, from, to, date, appointmentId });

describe('stagesOfDay (T-232, DR-43; DR6-134)', () => {
  const created = step('t0', null, 'N3', d(10, 9));
  const moved = step('t1', 'N3', 'N2', d(12, 9));
  const back = step('t2', 'N2', 'N3', d(12, 9));
  const later = step('t3', 'N3', 'N1', d(20, 9));
  const history = [created, moved, back, later];

  it('starts the day in the stage the day before ended in, then each change of the day', () => {
    expect(stagesOfDay(history, d(12, 9))).toEqual(['N3', 'N2', 'N3']);
    expect(stagesOfDay(history, d(15, 9))).toEqual(['N3']);
    expect(stagesOfDay(history, d(20, 9))).toEqual(['N3', 'N1']);
    expect(stagesOfDay(history, d(25, 9))).toEqual(['N1']);
  });

  it('starts the day of the creation, and any day before it, in the stage it was created in', () => {
    expect(stagesOfDay(history, d(10, 9))).toEqual(['N3']);
    expect(stagesOfDay(history, d(5, 9))).toEqual(['N3']);
    expect(stagesOfDay([created, step('t1', 'N3', 'N2', d(10, 9))], d(10, 9))).toEqual([
      'N3',
      'N2',
    ]);
  });

  it('has none without a transition', () => {
    expect(stagesOfDay([], d(5, 9))).toEqual([]);
  });
});

describe('meetingKeepingMove (D7, T-232; DR6-103)', () => {
  const meeting = (
    id: string,
    date: CalendarDate,
    stageAfter: CustomerStage | null,
    status = 'MET',
    customerId = 'c1',
  ) => ({ id, customerId, date, status, stageAfter });
  const created = step('t0', null, 'N3', d(1, 9));
  const moved = step('t1', 'N3', 'N2', d(5, 9), 'a1');

  it('finds the first meeting from its day on that kept the stage the move reached', () => {
    const kept = meeting('m2', d(12, 9), 'N2');
    const later = meeting('m3', d(14, 9), 'N2');
    expect(meetingKeepingMove([created, moved], [kept, later], moved)).toBe(kept);
    // The same day, after the move.
    const sameDay = meeting('m4', d(5, 9), 'N2');
    expect(meetingKeepingMove([created, moved], [sameDay, kept], moved)).toBe(sameDay);
  });

  it('leaves out the meeting itself, other customers, other statuses and earlier days', () => {
    const others = [
      meeting('a1', d(5, 9), 'N2'),
      meeting('m2', d(12, 9), 'N2', 'MET', 'c2'),
      meeting('m3', d(12, 9), null, 'CANCELLED'),
      meeting('m4', d(4, 9), 'N2'),
    ];
    const elsewhere = step('t2', 'N3', 'N1', d(2, 9), null, 'c2');
    expect(meetingKeepingMove([created, elsewhere, moved], others, moved)).toBeUndefined();
    // As the command asks, the move already withdrawn.
    expect(meetingKeepingMove([created, elsewhere], others, moved)).toBeUndefined();
  });

  it('does not hold the move for a stage the customer is in that day without it', () => {
    // Kept N3, the stage the day started in; kept N1, reached by a later change that day.
    const startOfDay = meeting('m2', d(5, 9), 'N3');
    const change = step('t2', 'N2', 'N1', d(12, 9));
    const afterChange = meeting('m3', d(12, 9), 'N1');
    expect(
      meetingKeepingMove([created, moved, change], [startOfDay, afterChange], moved),
    ).toBeUndefined();
  });
});
