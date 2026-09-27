/**
 * The rules of T-042 / T-043 (spec §3.3–3.10, §8), checked on the whole simulated data set: the seed
 * writes through the commands, so any rule a command lets slip shows up here.
 */
import {
  calendarDate,
  compareDates,
  isPipelineStage,
  KYC_FIELDS,
  kycHash,
  type KycField,
} from '@p2c/domain';
import { beforeAll, describe, expect, it } from 'vitest';
import { listAppointments, type AppointmentRecord } from './appointments';
import { listCustomers, listStageTransitions, type CustomerRecord } from './customers';
import { openDatabase, type Database } from './database';
import { getKycProfile, listKycVersions, type KycProfileRecord } from './kyc';
import { listPolicies } from './policies';
import { seedDemoData } from './seed';

const SLOW = 60_000;
const NUMBER_FIELDS: readonly KycField[] = ['birthYear', 'childrenCount'];
const BOOLEAN_FIELDS: readonly KycField[] = ['hasProtection'];
const GENDER_LABELS = { MALE: 'Nam', FEMALE: 'Nữ' } as const;

let db: Database;
let customers: CustomerRecord[];
let appointments: AppointmentRecord[];
let profiles: Map<string, KycProfileRecord>;

beforeAll(async () => {
  db = await openDatabase();
  seedDemoData(db, { anchorDate: calendarDate(2026, 9, 15), seed: 11 });
  customers = listCustomers(db);
  appointments = listAppointments(db);
  profiles = new Map(customers.map((c) => [c.id, getKycProfile(db, c.id)]));
}, SLOW);

const groupBy = <T>(items: readonly T[], key: (item: T) => string) => {
  const groups = new Map<string, T[]>();
  for (const item of items) groups.set(key(item), [...(groups.get(key(item)) ?? []), item]);
  return groups;
};

describe('T-042 rules on the simulated data', () => {
  it('keeps every customer in the stage of their latest transition, created in an open stage', () => {
    const transitions = groupBy(listStageTransitions(db), (t) => t.customerId);
    for (const customer of customers) {
      const own = transitions.get(customer.id)!;
      expect(own[0]!.from).toBeNull();
      expect(isPipelineStage(own[0]!.to)).toBe(true);
      expect(own.slice(1).every((t) => t.from !== null)).toBe(true);
      expect(own.at(-1)!.to).toBe(customer.stage);
    }
  });

  it('records a stage change from a meeting on that met appointment, once', () => {
    const byId = new Map(appointments.map((a) => [a.id, a]));
    const fromMeetings = listStageTransitions(db).filter((t) => t.appointmentId !== null);
    expect(fromMeetings.length).toBeGreaterThan(0);
    for (const t of fromMeetings) {
      const appointment = byId.get(t.appointmentId!)!;
      expect(appointment.status).toBe('MET');
      expect(appointment.stageAfter).toBe(t.to);
      expect(appointment.customerId).toBe(t.customerId);
      expect(compareDates(appointment.date, t.date)).toBe(0);
    }
    const ids = fromMeetings.map((t) => t.appointmentId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives met appointments a stage after and next step, and no other status a stage after', () => {
    for (const a of appointments) {
      if (a.status === 'MET') {
        expect(a.stageAfter).not.toBeNull();
        expect(a.nextStep).not.toBeNull();
      } else {
        expect(a.stageAfter).toBeNull();
      }
      expect(a.coordinatorIds).not.toContain(a.reId);
    }
  });

  it('replaces each rescheduled appointment with exactly one new one for the same customer', () => {
    const byId = new Map(appointments.map((a) => [a.id, a]));
    const successors = groupBy(
      appointments.filter((a) => a.rescheduledFromId !== null),
      (a) => a.rescheduledFromId!,
    );
    for (const a of appointments.filter((x) => x.status === 'RESCHEDULED')) {
      expect(successors.get(a.id)).toHaveLength(1);
    }
    for (const [fromId, [next]] of successors) {
      const from = byId.get(fromId)!;
      expect(from.status).toBe('RESCHEDULED');
      expect(next!.customerId).toBe(from.customerId);
    }
  });

  it('keeps policy amounts positive and issue dates paired and not before submission', () => {
    for (const p of listPolicies(db)) {
      expect(p.submittedFyp).toBeGreaterThan(0);
      expect(p.issuedDate === null).toBe(p.issuedFyp === null);
      if (p.issuedDate !== null) {
        expect(p.issuedFyp).toBeGreaterThan(0);
        expect(compareDates(p.issuedDate, p.submittedDate)).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

describe('T-043 rules on the simulated data', () => {
  it('numbers notes and facts in recording order and ties each fact to a note of its customer', () => {
    for (const { notes, facts } of profiles.values()) {
      const noteIds = new Set(notes.map((n) => n.id));
      expect(noteIds.size).toBe(notes.length);
      for (const fact of facts) expect(noteIds.has(fact.noteId)).toBe(true);
    }
    const seqs = db.sqlite.exec(
      `SELECT t, customer_id, COUNT(*), MIN(seq), MAX(seq) FROM (
         SELECT 'note' AS t, customer_id, seq FROM kyc_notes
         UNION ALL SELECT 'fact', customer_id, seq FROM kyc_facts
         UNION ALL SELECT 'version', customer_id, seq FROM kyc_versions)
       GROUP BY t, customer_id`,
    )[0]!.values;
    for (const [, , count, min, maxSeq] of seqs) expect([min, maxSeq]).toEqual([1, count]);
  });

  it('holds one active fact or two or more in conflict on each trường, each of its type', () => {
    for (const { facts } of profiles.values()) {
      for (const [, onField] of groupBy(facts, (f) => f.field)) {
        const current = onField.filter((f) => f.status !== 'superseded');
        const active = current.filter((f) => f.status === 'active').length;
        expect(active === current.length ? active <= 1 : active === 0 && current.length >= 2).toBe(
          true,
        );
      }
      for (const fact of facts) {
        expect(fact.category).toBe(KYC_FIELDS[fact.field].category);
        if (NUMBER_FIELDS.includes(fact.field)) expect(Number.isInteger(fact.value)).toBe(true);
        else if (BOOLEAN_FIELDS.includes(fact.field)) expect(typeof fact.value).toBe('boolean');
        else expect(typeof fact.value === 'string' && fact.value !== '').toBe(true);
      }
    }
  });

  it('takes birth year and gender from the customer profile only', () => {
    for (const customer of customers) {
      const { notes, facts } = profiles.get(customer.id)!;
      const sourceOf = new Map(notes.map((n) => [n.id, n.source]));
      const active = (field: KycField) =>
        facts.find((f) => f.field === field && f.status === 'active');
      for (const fact of facts.filter((f) => f.field === 'birthYear' || f.field === 'gender')) {
        if (fact.status === 'active') expect(sourceOf.get(fact.noteId)).toBe('SYSTEM');
      }
      expect(active('birthYear')?.value).toBe(customer.birthDate?.year);
      expect(active('gender')?.value).toBe(
        customer.gender === null ? undefined : GENDER_LABELS[customer.gender],
      );
    }
  });

  it('records a version whenever the facts in effect change: the first material, the last current', () => {
    for (const customer of customers) {
      const profile = profiles.get(customer.id)!;
      const versions = listKycVersions(db, customer.id);
      if (profile.facts.length === 0) {
        expect(versions).toEqual([]);
        continue;
      }
      expect(versions[0]!.material).toBe(true);
      for (let i = 1; i < versions.length; i++) {
        expect(versions[i]!.hash).not.toBe(versions[i - 1]!.hash);
        expect(compareDates(versions[i]!.date, versions[i - 1]!.date)).toBeGreaterThanOrEqual(0);
      }
      expect(versions.at(-1)!.hash).toBe(kycHash(profile));
    }
  });
});
