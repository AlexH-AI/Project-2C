import { describe, expect, it } from 'vitest';
import { compareDates, formatDate, monthToDate } from '../period';
import {
  APPOINTMENTS,
  CUSTOMERS,
  EXPECTED_RF_APPOINTMENT_IDS,
  GOLDEN_CASES,
  MTD_VIEWING_DATE,
  PEOPLE,
  POLICIES,
  STAGE_TRANSITIONS,
  TEAMS,
} from './metrics.fixture';

// These tests keep the golden data internally consistent. They do not compute any metric: the
// stats engine (T-031, T-032) is tested against the expected results.

const reIds = new Set(PEOPLE.filter((person) => person.role === 'RE').map((person) => person.id));
const customerIds = new Set(CUSTOMERS.map((customer) => customer.id));
const transitionsOf = (customerId: string) =>
  STAGE_TRANSITIONS.filter((transition) => transition.customerId === customerId);

describe('golden metrics fixture', () => {
  it('gives every entity a unique id', () => {
    const ids = [TEAMS, PEOPLE, CUSTOMERS, APPOINTMENTS, STAGE_TRANSITIONS, POLICIES, GOLDEN_CASES]
      .flat()
      .map((entity) => entity.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers two teams of two RE each, plus coordinators without metrics', () => {
    for (const team of TEAMS) {
      const members = PEOPLE.filter((person) => person.teamId === team.id && person.role === 'RE');
      expect(members).toHaveLength(2);
    }
    expect(PEOPLE.some((person) => person.role !== 'RE')).toBe(true);
  });

  it('assigns customers, appointments and policies to an RE and an existing customer', () => {
    for (const customer of CUSTOMERS) expect(reIds.has(customer.reId)).toBe(true);
    for (const item of [...APPOINTMENTS, ...POLICIES]) {
      expect(reIds.has(item.reId)).toBe(true);
      expect(customerIds.has(item.customerId)).toBe(true);
    }
  });

  it('chains each customer’s transitions in date order and ends at the current stage', () => {
    for (const customer of CUSTOMERS) {
      const transitions = transitionsOf(customer.id);
      expect(transitions[0]?.from).toBeNull();
      transitions.slice(1).forEach((transition, index) => {
        const previous = transitions[index]!;
        expect(transition.from).toBe(previous.to);
        expect(compareDates(previous.date, transition.date)).toBeLessThanOrEqual(0);
      });
      expect(transitions.at(-1)?.to).toBe(customer.stage);
    }
  });

  it('gives a stage after only to appointments that were met', () => {
    for (const appointment of APPOINTMENTS) {
      if (appointment.status !== 'MET') expect(appointment.stageAfter, appointment.id).toBeNull();
    }
  });

  it('records a transition for an appointment exactly when its stage after changes the stage', () => {
    for (const appointment of APPOINTMENTS) {
      const caused = STAGE_TRANSITIONS.filter((t) => t.appointmentId === appointment.id);
      const before = transitionsOf(appointment.customerId)
        .filter((t) => t.appointmentId !== appointment.id)
        .filter((t) => compareDates(t.date, appointment.date) <= 0)
        .at(-1)?.to;
      const changes = appointment.stageAfter !== null && appointment.stageAfter !== before;
      expect(caused, `${appointment.id} on ${formatDate(appointment.date)}`).toHaveLength(
        changes ? 1 : 0,
      );
      if (changes) {
        expect(caused[0]!.to).toBe(appointment.stageAfter);
        expect(compareDates(caused[0]!.date, appointment.date)).toBe(0);
      }
    }
  });

  it('issues a policy on or after its submission, with an issued FYP only once issued', () => {
    for (const policy of POLICIES) {
      expect(policy.issuedFyp === null).toBe(policy.issuedDate === null);
      if (policy.issuedDate) {
        expect(compareDates(policy.submittedDate, policy.issuedDate)).toBeLessThanOrEqual(0);
      }
    }
  });

  it('takes G18 month to date up to the viewing day', () => {
    const g18 = GOLDEN_CASES.find((goldenCase) => goldenCase.id === 'G18');
    expect(g18?.period).toEqual(monthToDate(MTD_VIEWING_DATE));
  });

  it('lists RF only among appointments that exist', () => {
    const appointmentIds = new Set(APPOINTMENTS.map((appointment) => appointment.id));
    for (const id of EXPECTED_RF_APPOINTMENT_IDS) expect(appointmentIds.has(id)).toBe(true);
  });

  it('writes the close rate as issued ÷ RF, or none when there is no RF', () => {
    for (const { id, expected } of GOLDEN_CASES) {
      expect(expected.closeRate, id).toEqual(
        expected.rfCount === 0
          ? null
          : { numerator: expected.issuedCount, denominator: expected.rfCount },
      );
    }
  });
});
