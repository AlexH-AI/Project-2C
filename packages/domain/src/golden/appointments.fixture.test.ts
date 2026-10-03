import { describe, expect, it } from 'vitest';
import { compareDates } from '../period';
import { APPOINTMENT_GOLDEN_CASES, APPOINTMENT_ROWS } from './appointments.fixture';
import { PEOPLE } from './metrics.fixture';

// These tests keep the golden data internally consistent. They do not count anything: the counts
// are tested against the expected results in `appointment-counts.test.ts`.

const byId = new Map(APPOINTMENT_ROWS.map((row) => [row.appointment.id, row]));
const reIds = new Set(PEOPLE.filter((person) => person.role === 'RE').map((person) => person.id));
const personIds = new Set(PEOPLE.map((person) => person.id));

describe('golden appointments fixture', () => {
  it('gives every row and every case a unique id', () => {
    expect(byId.size).toBe(APPOINTMENT_ROWS.length);
    const caseIds = APPOINTMENT_GOLDEN_CASES.map((golden) => golden.id);
    expect(new Set(caseIds).size).toBe(caseIds.length);
  });

  it('assigns every appointment to an RE, with known people as coordinators', () => {
    for (const { appointment } of APPOINTMENT_ROWS) {
      expect(reIds.has(appointment.reId)).toBe(true);
      for (const id of appointment.coordinatorIds) expect(personIds.has(id)).toBe(true);
    }
  });

  it('chains each reschedule from an earlier rescheduled appointment of the same customer', () => {
    for (const { appointment, rescheduledFromId } of APPOINTMENT_ROWS) {
      if (rescheduledFromId === null) continue;
      const from = byId.get(rescheduledFromId)!.appointment;
      expect(from.status).toBe('RESCHEDULED');
      expect(from.customerId).toBe(appointment.customerId);
      expect(compareDates(from.date, appointment.date)).toBeLessThan(0);
    }
  });

  it('restores only rows that are deleted', () => {
    for (const golden of APPOINTMENT_GOLDEN_CASES) {
      for (const id of golden.restoredIds) expect(byId.get(id)?.deleted).toBe(true);
    }
  });

  it('makes each total the sum of the four groups', () => {
    for (const { expected } of APPOINTMENT_GOLDEN_CASES) {
      expect(expected.met + expected.missed + expected.unrecorded + expected.planned).toBe(
        expected.total,
      );
    }
  });
});
