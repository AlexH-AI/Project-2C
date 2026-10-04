import { describe, expect, it } from 'vitest';
import { appointmentCounts, appointmentCountsByMark, appointmentGroup } from './appointment-counts';
import { APPOINTMENT_GOLDEN_CASES, APPOINTMENT_ROWS } from './golden/appointments.fixture';
import { PEOPLE } from './golden/metrics.fixture';
import type { Appointment, AppointmentStatus, Scope } from './model';
import { calendarDate, chartMarks, periodOf, reportMarks } from './period';
import type { CalendarDate, Period } from './period';

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

describe('appointmentCountsByMark', () => {
  const appointments = APPOINTMENT_ROWS.filter((row) => !row.deleted && !row.customerDeleted).map(
    (row) => row.appointment,
  );
  const SCOPES: readonly Scope[] = [
    { kind: 'all' },
    { kind: 'team', teamId: 'team-a' },
    { kind: 're', reId: 're-an' },
  ];
  const MARKS: Readonly<Record<string, readonly Period[]>> = {
    'days of 12/2026 – 03/2027': [
      calendarDate(2026, 12, 1),
      calendarDate(2027, 1, 1),
      calendarDate(2027, 2, 1),
      calendarDate(2027, 3, 1),
    ].flatMap((day) => chartMarks(periodOf('month', day))),
    'weeks of 01/2027 cut at the month': reportMarks(periodOf('month', TODAY)),
    'months of 2027': reportMarks(periodOf('year', TODAY)),
  };

  for (const [name, marks] of Object.entries(MARKS)) {
    it.each(SCOPES)(`equals appointmentCounts of each mark: ${name}, $kind`, (scope) => {
      expect(appointmentCountsByMark(appointments, marks, scope, PEOPLE, TODAY)).toEqual(
        marks.map((mark) => appointmentCounts(appointments, mark, scope, PEOPLE, TODAY)),
      );
    });
  }

  it('counts an appointment between two marks in neither', () => {
    const marks = [periodOf('day', calendarDate(2027, 1, 4)), periodOf('day', TODAY)];
    expect(appointmentCountsByMark(appointments, marks, { kind: 'all' }, PEOPLE, TODAY)).toEqual(
      marks.map((mark) => appointmentCounts(appointments, mark, { kind: 'all' }, PEOPLE, TODAY)),
    );
  });
});
