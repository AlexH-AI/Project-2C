import { describe, expect, it } from 'vitest';
import { appointmentCounts, appointmentGroup } from './appointment-counts';
import { APPOINTMENT_GOLDEN_CASES, APPOINTMENT_ROWS } from './golden/appointments.fixture';
import { PEOPLE } from './golden/metrics.fixture';
import type { Appointment, AppointmentStatus } from './model';
import { calendarDate } from './period';
import type { CalendarDate } from './period';

const TODAY = calendarDate(2027, 1, 13);

const appointment = (status: AppointmentStatus, date: CalendarDate): Appointment => ({
  id: 'ap',
  customerId: 'kh',
  reId: 're-an',
  coordinatorIds: [],
  date,
  status,
  stageAfter: null,
  expectedCaseSize: null,
  nextStep: null,
  note: '',
});

describe('appointmentGroup', () => {
  it('puts a met appointment in Đã gặp, whatever its day', () => {
    expect(appointmentGroup(appointment('MET', calendarDate(2027, 1, 12)), TODAY)).toBe('met');
    expect(appointmentGroup(appointment('MET', calendarDate(2027, 1, 20)), TODAY)).toBe('met');
  });

  it('puts rescheduled, cancelled and no-show appointments in Dời – hủy – không đến', () => {
    for (const status of ['RESCHEDULED', 'CANCELLED', 'NO_SHOW'] as const) {
      expect(appointmentGroup(appointment(status, calendarDate(2027, 1, 12)), TODAY)).toBe(
        'missed',
      );
    }
  });

  it('keeps a scheduled appointment of today as Dự kiến and of yesterday as Chưa ghi kết quả', () => {
    expect(appointmentGroup(appointment('SCHEDULED', TODAY), TODAY)).toBe('planned');
    expect(appointmentGroup(appointment('SCHEDULED', calendarDate(2027, 1, 12)), TODAY)).toBe(
      'unrecorded',
    );
    expect(appointmentGroup(appointment('SCHEDULED', calendarDate(2027, 1, 14)), TODAY)).toBe(
      'planned',
    );
  });
});

describe('appointmentCounts — golden A01–A13', () => {
  // The caller passes live appointments only, as the repository returns them: no deleted
  // appointment and none of a deleted customer. A13 restores a deleted row before counting.
  const liveAppointments = (restoredIds: readonly string[]) =>
    APPOINTMENT_ROWS.filter(
      (row) => !row.customerDeleted && (!row.deleted || restoredIds.includes(row.appointment.id)),
    ).map((row) => row.appointment);

  for (const golden of APPOINTMENT_GOLDEN_CASES) {
    it(golden.id, () => {
      expect(
        appointmentCounts(
          liveAppointments(golden.restoredIds),
          golden.period,
          golden.scope,
          PEOPLE,
          golden.today,
        ),
      ).toEqual(golden.expected);
    });
  }
});
