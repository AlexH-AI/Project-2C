/**
 * Golden metrics G01–G22 and golden B G23–G41 through the database (spec §8): each scenario is
 * loaded with the business commands only, read back, and the stats engine must give every golden
 * result. The fixture is never edited to make this pass.
 */
import {
  compareDates,
  isRfAppointment,
  periodMetrics,
  type Appointment,
  type Customer,
  type MetricsData,
  type Scope,
  type StageTransition,
} from '@p2c/domain';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  APPOINTMENTS,
  APPOINTMENTS_B,
  CUSTOMERS,
  CUSTOMERS_B,
  EXPECTED_RF_APPOINTMENT_IDS,
  EXPECTED_RF_APPOINTMENT_IDS_B,
  GOLDEN_B_CASES,
  GOLDEN_CASES,
  HD_18_CANCELLATION,
  PEOPLE,
  POLICIES,
  POLICY_ROWS_B,
  STAGE_TRANSITIONS,
  STAGE_TRANSITIONS_B,
  TEAMS,
  type GoldenPolicyRow,
} from '../../domain/src/golden/metrics.fixture';
import {
  listAppointments,
  recordMeetingOutcome,
  rescheduleAppointment,
  scheduleAppointment,
} from './appointments';
import { exportBackup, importBackup } from './backup';
import {
  changeStageManually,
  createCustomer,
  listCustomers,
  listStageTransitions,
} from './customers';
import { openDatabase, type Database } from './database';
import {
  cancelPolicy,
  issuePolicy,
  listPolicies,
  softDeletePolicy,
  submitPolicy,
  updatePolicy,
} from './policies';
import { createPerson, createTeam, listPeople } from './team';

/** A scenario of the golden file, as the fixture writes it. */
interface Scenario {
  readonly customers: readonly Customer[];
  readonly transitions: readonly StageTransition[];
  readonly appointments: readonly Appointment[];
  readonly policies: readonly GoldenPolicyRow[];
}

/** Section 1 (G01–G22): no policy cancelled or deleted. */
const SECTION_1: Scenario = {
  customers: CUSTOMERS,
  transitions: STAGE_TRANSITIONS,
  appointments: APPOINTMENTS,
  policies: POLICIES.map((policy) => ({ policy, deleted: false })),
};

/** Scenario B (G23–G41), in its final state. */
const SCENARIO_B: Scenario = {
  customers: CUSTOMERS_B,
  transitions: STAGE_TRANSITIONS_B,
  appointments: APPOINTMENTS_B,
  policies: POLICY_ROWS_B,
};

/** Every live record the stats engine reads, as the app reads it (spec §4: computed in memory). */
const readMetricsData = (db: Database): MetricsData => ({
  people: listPeople(db),
  policies: listPolicies(db),
  appointments: listAppointments(db),
  transitions: listStageTransitions(db),
});

/** D6 needs a next step on every met appointment; the fixture leaves most of them empty. */
const DEFAULT_NEXT_STEP = 'Gặp lại';

/** Loads a scenario of the fixture and returns fixture id → database id. */
function loadFixture(db: Database, scenario: Scenario): Map<string, string> {
  const { customers, transitions, appointments, policies } = scenario;
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
        rmId: id(a.rmId),
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

  const linked = new Set(transitions.map((t) => t.appointmentId));
  for (const customer of customers) {
    const own = appointments.filter((a) => a.customerId === customer.id);
    const moves = transitions.filter((t) => t.customerId === customer.id);
    // Replay the customer's history in date order; transitions first on the same day.
    const events = [
      ...moves.map((t) => ({
        date: t.date,
        run: () => {
          if (t.from === null) {
            const created = createCustomer(db, {
              ...customer,
              rmId: id(customer.rmId),
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

  for (const { policy: p, deleted } of policies) {
    const submitted = submitPolicy(db, { ...p, customerId: id(p.customerId), rmId: id(p.rmId) });
    ids.set(p.id, submitted.id);
    if (p.issuedDate !== null) {
      issuePolicy(db, submitted.id, { issuedDate: p.issuedDate, issuedFyp: p.issuedFyp! });
    }
    if (p.cancelledDate !== null) cancelPolicy(db, submitted.id, p.cancelledDate);
    if (deleted) softDeletePolicy(db, submitted.id);
  }
  return ids;
}

/** The fixture's scope with the database ids of its team or RM. */
const scopeIn = (ids: ReadonlyMap<string, string>, scope: Scope): Scope => {
  switch (scope.kind) {
    case 'all':
      return scope;
    case 'team':
      return { kind: 'team', teamId: ids.get(scope.teamId)! };
    case 'rm':
      return { kind: 'rm', rmId: ids.get(scope.rmId)! };
  }
};

/** The RF appointments of the database, by their fixture id. */
const rfAppointmentIds = (db: Database, ids: ReadonlyMap<string, string>) => {
  const data = readMetricsData(db);
  const back = new Map([...ids].map(([fixtureId, dbId]) => [dbId, fixtureId]));
  return data.appointments
    .filter((a) => isRfAppointment(a, data.transitions))
    .map((a) => back.get(a.id))
    .sort();
};

describe('golden metrics through the database', () => {
  let db: Database;
  let ids: Map<string, string>;

  beforeAll(async () => {
    // The fixture is entered once its last meeting (February 2027) is over: an outcome is never
    // recorded ahead of its day.
    db = await openDatabase({ now: () => new Date(Date.UTC(2027, 1, 28, 12)) });
    ids = loadFixture(db, SECTION_1);
  });

  const scopeOf = (scope: Scope): Scope => scopeIn(ids, scope);

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
    expect(rfAppointmentIds(db, ids)).toEqual([...EXPECTED_RF_APPOINTMENT_IDS].sort());
  });

  it.each(GOLDEN_CASES)('$id', ({ period, scope, expected }) => {
    expect(periodMetrics(readMetricsData(db), period, scopeOf(scope))).toEqual(expected);
  });

  it('exports a backup that imports again, every rule across tables kept (spec §6)', async () => {
    const text = exportBackup(db);

    const imported = await importBackup(text, { now: db.now });

    // Each export takes an instant of its own: the database clock never gives one twice (DR6-178).
    const unstamped = (backup: string) => backup.replace(/"exportedAt":"[^"]*"/, '');
    expect(unstamped(exportBackup(imported.db))).toBe(unstamped(text));
  });
});

// Golden B (`docs/golden/chi-so.md` mục 4.4, "Ghi chú cho B1"): entered once 2028's last day of
// the scenario is over, as no day of a policy may be after today.
const openScenarioB = async () => {
  const db = await openDatabase({ now: () => new Date(Date.UTC(2028, 1, 29, 12)) });
  return { db, ids: loadFixture(db, SCENARIO_B) };
};

describe('golden B metrics through the database (G23–G41)', () => {
  let db: Database;
  let ids: Map<string, string>;

  beforeAll(async () => {
    ({ db, ids } = await openScenarioB());
  });

  it('ends every customer in the fixture stage: a cancellation moves no stage', () => {
    const stages = new Map(listCustomers(db).map((c) => [c.id, c.stage]));
    for (const customer of CUSTOMERS_B)
      expect(stages.get(ids.get(customer.id)!)).toBe(customer.stage);
    expect(listStageTransitions(db)).toHaveLength(STAGE_TRANSITIONS_B.length);
  });

  it('finds exactly the golden RF appointments of scenario B', () => {
    expect(rfAppointmentIds(db, ids)).toEqual([...EXPECTED_RF_APPOINTMENT_IDS_B].sort());
  });

  // G36 is a variant of the data: the next test goes through the commands for it.
  it.each(GOLDEN_B_CASES.filter((golden) => golden.variant === null))(
    '$id',
    ({ period, scope, expected }) => {
      expect(periodMetrics(readMetricsData(db), period, scopeIn(ids, scope))).toEqual(expected);
    },
  );

  it('G36 → G37: cancels hd-18 on 08/02/2028, then undoes the cancellation', async () => {
    const own = await openScenarioB();
    const g36 = GOLDEN_B_CASES.find((golden) => golden.id === 'G36')!;
    const g37 = GOLDEN_B_CASES.find((golden) => golden.id === 'G37')!;
    const hd18 = own.ids.get(HD_18_CANCELLATION.policyId)!;
    const metricsOf = ({ period, scope }: typeof g36) =>
      periodMetrics(readMetricsData(own.db), period, scopeIn(own.ids, scope));

    cancelPolicy(own.db, hd18, HD_18_CANCELLATION.cancelledDate);
    expect(g36.variant).toEqual(HD_18_CANCELLATION);
    expect(metricsOf(g36)).toEqual(g36.expected);

    updatePolicy(own.db, hd18, { cancelledDate: null });
    expect(metricsOf(g37)).toEqual(g37.expected);
  });
});
