import { describe, expect, it } from 'vitest';
import {
  APPOINTMENT_ACTIONS,
  appointmentActions,
  canAppointment,
  isOutcomeStatus,
  OUTCOME_STATUSES,
} from './appointment-lifecycle';
import { APPOINTMENT_STATUSES, type AppointmentStatus } from './model';

// What the app offers on an appointment of each status today (Issue #1177, mockups 6c, 6e, 6f,
// 6g): written out by hand, so that a status or an action added without its row fails here.
const OFFERED: Record<AppointmentStatus, Record<(typeof APPOINTMENT_ACTIONS)[number], boolean>> = {
  SCHEDULED: { record: true, reschedule: true, edit: false, delete: true },
  MET: { record: false, reschedule: false, edit: true, delete: true },
  RESCHEDULED: { record: false, reschedule: false, edit: false, delete: false },
  CANCELLED: { record: false, reschedule: false, edit: true, delete: true },
  NO_SHOW: { record: false, reschedule: false, edit: true, delete: true },
};

describe('appointment actions by status', () => {
  it('lists the four actions of the app, in their order', () => {
    expect(APPOINTMENT_ACTIONS).toEqual(['record', 'reschedule', 'edit', 'delete']);
  });

  it('allows each action of each status as the app offers it', () => {
    expect(Object.keys(OFFERED).sort()).toEqual([...APPOINTMENT_STATUSES].sort());
    for (const status of APPOINTMENT_STATUSES) {
      for (const action of APPOINTMENT_ACTIONS) {
        expect([status, action, canAppointment(status, action)]).toEqual([
          status,
          action,
          OFFERED[status][action],
        ]);
      }
    }
  });

  it('lists the actions of a status in the order of the actions', () => {
    expect(appointmentActions('SCHEDULED')).toEqual(['record', 'reschedule', 'delete']);
    expect(appointmentActions('MET')).toEqual(['edit', 'delete']);
    expect(appointmentActions('CANCELLED')).toEqual(['edit', 'delete']);
    expect(appointmentActions('NO_SHOW')).toEqual(['edit', 'delete']);
  });

  it('closes a rescheduled appointment: a new one took its place (D3)', () => {
    expect(appointmentActions('RESCHEDULED')).toEqual([]);
  });
});

describe('outcome statuses', () => {
  it('are held, cancelled and missed: what recording or editing an outcome sets', () => {
    expect(OUTCOME_STATUSES).toEqual(['MET', 'CANCELLED', 'NO_SHOW']);
    expect(APPOINTMENT_STATUSES.filter(isOutcomeStatus)).toEqual(['MET', 'CANCELLED', 'NO_SHOW']);
  });

  it('are the statuses whose outcome can be edited', () => {
    expect(APPOINTMENT_STATUSES.filter((status) => canAppointment(status, 'edit'))).toEqual(
      OUTCOME_STATUSES,
    );
  });

  it('refuses what is not a status of an outcome', () => {
    for (const value of ['SCHEDULED', 'RESCHEDULED', 'met', '']) {
      expect(isOutcomeStatus(value)).toBe(false);
    }
  });
});
