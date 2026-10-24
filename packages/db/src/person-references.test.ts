import { describe, expect, it } from 'vitest';
import { recordMeetingOutcome, scheduleAppointment } from './appointments';
import { validateBackupInvariants } from './backup-validation';
import { createCustomer, updateCustomerProfile } from './customers';
import type { Database } from './database';
import { PERSON_REFERENCES } from './person-references';
import { submitPolicy } from './policies';
import { createPerson, isPersonInUse, personUsage, softDeletePerson } from './team';
import { codeOf, d, errorOf, setup } from './test-support';

/**
 * A value in each column of the schema that points to a person, each column its own person: Lan was
 * Chi's when her policy was submitted, Bình's when he met her with Hà coordinating and Quang
 * reviewing, and is An's now; the RE of a record stays the one it was written for (ADR-0007).
 */
async function oneOfEach() {
  const { db, team, re: an, otherRe: binh, tl: ha } = await setup();
  const chi = createPerson(db, { name: 'Chi', role: 'RE', teamId: team.id });
  const quang = createPerson(db, { name: 'Quang', role: 'IS', teamId: null });
  const lan = createCustomer(db, { name: 'Lan', reId: chi.id, stage: 'N3', date: d(1, 9) });
  submitPolicy(db, { customerId: lan.id, reId: chi.id, submittedDate: d(2, 9), submittedFyp: 1e6 });
  updateCustomerProfile(db, lan.id, { reId: binh.id });
  const { id } = scheduleAppointment(db, {
    customerId: lan.id,
    reId: binh.id,
    date: d(10, 9),
    triggerType: 'REFERRAL',
    coordinatorIds: [ha.id],
  });
  recordMeetingOutcome(db, id, {
    status: 'MET',
    stageAfter: 'N3',
    nextStep: 'Gửi minh họa',
    outcomeReviewerId: quang.id,
  });
  updateCustomerProfile(db, lan.id, { reId: an.id });
  return { db, people: [an, binh, chi, ha, quang] };
}

const valuesOf = (db: Database, sql: string, params: string[] = []) =>
  (db.sqlite.exec(sql, params)[0]?.values ?? []).map((row) => row.map(String));

describe('PERSON_REFERENCES: the one list of what points to a person', () => {
  // A column added to the schema shows here as a key: it reads as no reference until the list has
  // a kind for it, so no change of the expected value alone makes the test pass (review of PR 742).
  it('reads each column of the schema that points to a person, once per value, as a kind of its own', async () => {
    const { db } = await oneOfEach();
    const columns = valuesOf(
      db,
      `SELECT m.name, f."from" FROM sqlite_master m, pragma_foreign_key_list(m.name) f
       WHERE m.type = 'table' AND f."table" = 'people' ORDER BY 1, 2`,
    );

    const kinds = columns.map(([table, column]) => {
      const people = valuesOf(db, `SELECT ${column} FROM ${table} WHERE ${column} IS NOT NULL`);
      const read = valuesOf(
        db,
        `SELECT kind FROM (${PERSON_REFERENCES}) WHERE person_id IN (SELECT value FROM json_each(?))`,
        [JSON.stringify(people.flat())],
      );
      return [`${table}.${column}`, read.flat()];
    });

    expect(Object.fromEntries(kinds)).toEqual({
      'appointment_coordinators.person_id': ['coordinator'],
      'appointments.outcome_reviewer_id': ['reviewer'],
      'appointments.re_id': ['appointment'],
      'customers.re_id': ['customer'],
      'policies.re_id': ['policy'],
    });
  });

  it('keeps the person of each kind of reference from deletion (spec §4, mockup 9b)', async () => {
    const { db, people } = await oneOfEach();

    for (const person of people) {
      expect(isPersonInUse(personUsage(db, person.id))).toBe(true);
      expect(codeOf(() => softDeletePerson(db, person.id))).toBe('PERSON_IN_USE');
    }
  });

  it('has import rule 5 check the person of each kind of reference (spec §6)', async () => {
    const { db, people } = await oneOfEach();
    expect(() => validateBackupInvariants(db)).not.toThrow();

    for (const person of people) {
      // Deleted in a file while still pointed to: no command leaves the data so.
      db.sqlite.run('UPDATE people SET deleted_at = ? WHERE id = ?', [
        '2026-09-26T11:00:00.000Z',
        person.id,
      ]);
      expect(errorOf(() => validateBackupInvariants(db))?.params).toEqual({ rule: 5 });
      db.sqlite.run('UPDATE people SET deleted_at = NULL WHERE id = ?', [person.id]);
    }
  });
});
