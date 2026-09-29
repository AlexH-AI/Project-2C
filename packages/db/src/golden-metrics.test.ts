/**
 * Golden metrics G01–G22 through the database (spec §8): the fixture is loaded with the business
 * commands only, read back, and the stats engine must give every golden result. The fixture is
 * never edited to make this pass.
 */
import {
  compareDates,
  isRfAppointment,
  periodMetrics,
  type Appointment,
  type Scope,
} from '@p2c/domain';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  APPOINTMENTS,
  CUSTOMERS,
  EXPECTED_RF_APPOINTMENT_IDS,
  GOLDEN_CASES,
  PEOPLE,
  POLICIES,
  STAGE_TRANSITIONS,
  TEAMS,
} from '../../domain/src/golden/metrics.fixture';
import { recordMeetingOutcome, rescheduleAppointment, scheduleAppointment } from './appointments';
import {
  changeStageManually,
  createCustomer,
  listCustomers,
  listStageTransitions,
} from './customers';
import { openDatabase, type Database } from './database';
import { loadMetricsData } from './metrics';
import { issuePolicy, submitPolicy } from './policies';
import { createPerson, createTeam } from './team';

/** D6 needs a next step on every met appointment; the fixture leaves most of them empty. */
const DEFAULT_NEXT_STEP = 'Gặp lại';

/** Loads the fixture and returns fixture id → database id. */
function loadFixture(db: Database): Map<string, string> {
  const ids = new Map<string, string>();
  const id = (fixtureId: string) => ids.get(fixtureId)!;

  for (const team of TEAMS) ids.set(team.id, createTeam(db, { name: team.name }).id);
  for (const person of PEOPLE) {
    const teamId = person.teamId === null ? null : id(person.teamId);
    ids.set(person.id, createPerson(db, { ...person, teamId }).id);
  }

  const schedule = (a: Appointment): string => {
    if (!ids.has(a.id)) {
      const scheduled = scheduleAppointment(db, {
        customerId: id(a.customerId),
        reId: id(a.reId),
        date: a.date,
        triggerType: 'OTHER',
        coordinatorIds: a.coordinatorIds.map(id),
      });
      ids.set(a.id, scheduled.id);
    }
    return id(a.id);
  };
  const recordOutcome = (a: Appointment) =>
    recordMeetingOutcome(db, schedule(a), {
      status: a.status as 'MET' | 'CANCELLED' | 'NO_SHOW',
      stageAfter: a.stageAfter,
      nextStep: a.nextStep ?? (a.status === 'MET' ? DEFAULT_NEXT_STEP : null),
      expectedCaseSize: a.expectedCaseSize,
    });

  const linked = new Set(STAGE_TRANSITIONS.map((t) => t.appointmentId));
  for (const customer of CUSTOMERS) {
    const own = APPOINTMENTS.filter((a) => a.customerId === customer.id);
    // Replay the customer's history in date order; transitions first on the same day.
    const events = [
      ...STAGE_TRANSITIONS.filter((t) => t.customerId === customer.id).map((t) => ({
        date: t.date,
        run: () => {
          if (t.from === null) {
            const created = createCustomer(db, {
              ...customer,
              reId: id(customer.reId),
              stage: t.to,
              date: t.date,
            });
            ids.set(customer.id, created.id);
          } else if (t.appointmentId === null) {
            changeStageManually(db, id(customer.id), { to: t.to, date: t.date });
          } else {
            recordOutcome(own.find((a) => a.id === t.appointmentId)!);
          }
        },
      })),
      ...own
        .filter((a) => !linked.has(a.id))
        .map((a) => ({
          date: a.date,
          run: () => {
            if (a.status === 'SCHEDULED') schedule(a);
            else if (a.status === 'RESCHEDULED') {
              // The fixture's next appointment of the customer is the one it was moved to (D3).
              const next = own[own.indexOf(a) + 1]!;
              const moved = rescheduleAppointment(db, schedule(a), { date: next.date });
              ids.set(next.id, moved.id);
            } else recordOutcome(a);
          },
        })),
    ].sort((x, y) => compareDates(x.date, y.date));
    for (const event of events) event.run();
  }

  for (const p of POLICIES) {
    const submitted = submitPolicy(db, { ...p, customerId: id(p.customerId), reId: id(p.reId) });
    if (p.issuedDate !== null) {
      issuePolicy(db, submitted.id, { issuedDate: p.issuedDate, issuedFyp: p.issuedFyp! });
    }
  }
  return ids;
}

describe('golden metrics through the database', () => {
  let db: Database;
  let ids: Map<string, string>;

  beforeAll(async () => {
    // The fixture is entered once its last meeting (February 2027) is over: an outcome is never
    // recorded ahead of its day.
    db = await openDatabase({ now: () => new Date(Date.UTC(2027, 1, 28, 12)) });
    ids = loadFixture(db);
  });

  const scopeOf = (scope: Scope): Scope => {
    switch (scope.kind) {
      case 'all':
        return scope;
      case 'team':
        return { kind: 'team', teamId: ids.get(scope.teamId)! };
      case 're':
        return { kind: 're', reId: ids.get(scope.reId)! };
    }
  };

  it('ends every customer in the fixture stage, with one transition per fixture transition', () => {
    const stages = new Map(listCustomers(db).map((c) => [c.id, c.stage]));
    for (const customer of CUSTOMERS)
      expect(stages.get(ids.get(customer.id)!)).toBe(customer.stage);
    const transitions = listStageTransitions(db);
    expect(transitions).toHaveLength(STAGE_TRANSITIONS.length);
    expect(transitions.filter((t) => t.appointmentId !== null)).toHaveLength(
      STAGE_TRANSITIONS.filter((t) => t.appointmentId !== null).length,
    );
  });

  it('finds exactly the golden RF appointments', () => {
    const data = loadMetricsData(db);
    const back = new Map([...ids].map(([fixtureId, dbId]) => [dbId, fixtureId]));
    const rf = data.appointments
      .filter((a) => isRfAppointment(a, data.transitions))
      .map((a) => back.get(a.id));
    expect(rf.sort()).toEqual([...EXPECTED_RF_APPOINTMENT_IDS].sort());
  });

  it.each(GOLDEN_CASES)('$id', ({ period, scope, expected }) => {
    expect(periodMetrics(loadMetricsData(db), period, scopeOf(scope))).toEqual(expected);
  });
});
