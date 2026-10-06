import { APPOINTMENT_STATUSES, calendarDate, evaluateKycGate, KYC_GATE_STATES } from '@p2c/domain';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { listAppointments } from './appointments';
import { toIsoDate } from './common';
import { listCustomers, listStageTransitions } from './customers';
import { openDatabase, type Database } from './database';
import { getKycProfile } from './kyc';
import { listPolicies } from './policies';
import { APPOINTMENT_TRIGGERS } from './schema';
import { seedDemoData } from './seed';
import { createTeam, listPeople, listTeams } from './team';
import { codeOf } from './test-support';

const ANCHOR = calendarDate(2026, 9, 15);
// A seed takes ~58 s alone on the Home PC, and more when other test files run in parallel: 60 s made
// `pnpm verify` flaky (T-095). Only the timeout moved, no assertion changed.
const SLOW = 180_000;

/** SHA-256 of every business row, in insertion order — equal hashes mean the same data. */
async function contentHash(db: Database): Promise<string> {
  const lines: string[] = [];
  const tables = db.sqlite.exec(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT IN ('schema_migrations', 'sqlite_sequence') ORDER BY name",
  );
  for (const [name] of tables[0]!.values) {
    lines.push(`#${String(name)}`);
    for (const result of db.sqlite.exec(`SELECT * FROM "${String(name)}" ORDER BY rowid`)) {
      for (const row of result.values) lines.push(JSON.stringify(row));
    }
  }
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(lines.join('\n')));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function seeded(seed: number, anchorDate = ANCHOR) {
  const persist = vi.fn();
  const db = await openDatabase({ persist });
  persist.mockClear();
  seedDemoData(db, { anchorDate, seed });
  return { db, persist };
}

/** Every day the data records, by table — what must not move with the machine's time zone. */
function recordedDays(db: Database): unknown[] {
  return db.sqlite
    .exec(
      `SELECT 'note', created_date FROM kyc_notes UNION ALL SELECT 'version', date FROM kyc_versions
       UNION ALL SELECT 'stage', date FROM stage_transitions UNION ALL SELECT 'meeting', date FROM appointments
       ORDER BY 1, 2`,
    )[0]!
    .values.map((row) => row.join(' '));
}

/** Runs `fn` with the process in `zone`; Vitest gives each test file a process of its own. */
async function inTimeZone<T>(zone: string, fn: () => Promise<T>): Promise<T> {
  vi.stubEnv('TZ', zone);
  try {
    return await fn();
  } finally {
    vi.unstubAllEnvs();
  }
}

describe('seedDemoData', () => {
  it(
    'writes the same data for the same anchor day and seed, and other data for another seed',
    async () => {
      const first = await seeded(1);
      const second = await seeded(1);
      const other = await seeded(2);
      expect(await contentHash(second.db)).toBe(await contentHash(first.db));
      expect(await contentHash(other.db)).not.toBe(await contentHash(first.db));
      // DR-15: at UTC+14 noon UTC is already the next day, yet a profile change keeps its day.
      const east = await inTimeZone('Pacific/Kiritimati', () => seeded(1));
      expect(recordedDays(east.db)).toEqual(recordedDays(first.db));
    },
    SLOW,
  );

  describe('on one seeded database', () => {
    let db: Database;
    beforeAll(async () => {
      ({ db } = await seeded(7));
    }, SLOW);

    const near = (actual: number, expected: number) => {
      expect(actual).toBeGreaterThanOrEqual(expected * 0.8);
      expect(actual).toBeLessThanOrEqual(expected * 1.2);
    };

    it('has 3 teams of 1 TL and 10 RE, and one shared IS, BD and BDM', () => {
      const people = listPeople(db);
      const count = (role: string) => people.filter((p) => p.role === role).length;
      expect(
        listTeams(db)
          .map((t) => t.name)
          .sort(),
      ).toEqual(['Bình Minh', 'Hừng Đông', 'Sao Mai']);
      for (const team of listTeams(db)) {
        const members = people.filter((p) => p.teamId === team.id);
        expect(members.filter((p) => p.role === 'TL')).toHaveLength(1);
        expect(members.filter((p) => p.role === 'RE')).toHaveLength(10);
      }
      expect([count('RE'), count('TL'), count('IS'), count('BD'), count('BDM')]).toEqual([
        30, 3, 1, 1, 1,
      ]);
      for (const role of ['IS', 'BD', 'BDM']) {
        expect(people.find((p) => p.role === role)?.teamId).toBeNull();
      }
    });

    it('has about 1,200 customers, 6,000 appointments and 1,000 policies', () => {
      near(listCustomers(db).length, 1200);
      near(listAppointments(db).length, 6000);
      near(listPolicies(db).length, 1000);
    });

    it('covers every appointment status and trigger, reschedules and coordinators', () => {
      const appointments = listAppointments(db);
      const statuses = new Set(appointments.map((a) => a.status));
      const triggers = new Set(appointments.map((a) => a.triggerType));
      expect([...statuses].sort()).toEqual([...APPOINTMENT_STATUSES].sort());
      expect([...triggers].sort()).toEqual([...APPOINTMENT_TRIGGERS].sort());
      expect(appointments.some((a) => a.rescheduledFromId !== null)).toBe(true);
      expect(appointments.some((a) => a.coordinatorIds.length > 0)).toBe(true);
    });

    it('keeps appointments within 12 months before and 2-4 weeks after the anchor day', () => {
      const days = listAppointments(db)
        .map((a) => toIsoDate(a.date))
        .sort();
      expect(days[0]! >= '2025-09-15').toBe(true);
      expect(days.at(-1)! > '2026-09-29').toBe(true);
      expect(days.at(-1)! <= '2026-10-13').toBe(true);
      const future = listAppointments(db).filter((a) => toIsoDate(a.date) >= '2026-09-15');
      expect(future.length).toBeGreaterThan(0);
      expect(future.every((a) => a.status === 'SCHEDULED')).toBe(true);
    });

    it('moves customers down, closes them and reopens them to N3', () => {
      const transitions = listStageTransitions(db);
      const rank = (stage: string | null) => ['N4', 'N3', 'N2', 'N1'].indexOf(stage ?? '');
      const moved = transitions.filter((t) => t.from !== null);
      expect(moved.some((t) => rank(t.to) >= 0 && rank(t.to) < rank(t.from))).toBe(true);
      expect(moved.some((t) => t.to === 'ON_HOLD')).toBe(true);
      expect(moved.some((t) => t.to === 'LOST')).toBe(true);
      expect(moved.some((t) => (t.from === 'ON_HOLD' || t.from === 'LOST') && t.to === 'N3')).toBe(
        true,
      );
      expect(moved.some((t) => t.appointmentId === null)).toBe(true);
      const stages = new Set(listCustomers(db).map((c) => c.stage));
      expect([...stages].sort()).toEqual(['LOST', 'N1', 'N2', 'N3', 'N4', 'ON_HOLD']);
    });

    it('issues policies the month after submission, some with an issued FYP set by hand', () => {
      const issued = listPolicies(db).filter((p) => p.issuedDate !== null);
      expect(issued.some((p) => p.issuedDate!.month !== p.submittedDate.month)).toBe(true);
      expect(issued.some((p) => p.issuedFyp !== p.submittedFyp)).toBe(true);
      expect(listPolicies(db).some((p) => p.issuedDate === null)).toBe(true);
    });

    it('gives each customer 1-5 KYC notes and covers every gate state and both kinds of conflict', () => {
      const profiles = listCustomers(db).map((c) => getKycProfile(db, c.id));
      for (const { notes } of profiles) {
        const fromRe = notes.filter((n) => n.source === 'RE').length;
        expect(fromRe).toBeGreaterThanOrEqual(1);
        expect(fromRe).toBeLessThanOrEqual(5);
      }
      const gates = profiles.map(({ facts }) => evaluateKycGate(facts));
      for (const state of KYC_GATE_STATES) {
        // Each state is common enough to find on screen: at least 5% of the customers.
        expect(gates.filter((g) => g.state === state).length).toBeGreaterThan(profiles.length / 20);
      }
      expect(
        gates.some((g) => g.warningFields.length > 0 && g.state !== 'CONFLICT_RESOLUTION'),
      ).toBe(true);
      expect(profiles.some(({ facts }) => facts.some((f) => f.status === 'superseded'))).toBe(true);
    });
  });

  it('refuses a database that already has data', async () => {
    const db = await openDatabase();
    createTeam(db, { name: 'Sao Mai' });
    expect(codeOf(() => seedDemoData(db, { anchorDate: ANCHOR, seed: 1 }))).toBe(
      'SEED_DATABASE_NOT_EMPTY',
    );
  });

  it(
    'saves the file once, after the whole seed',
    async () => {
      const { persist } = await seeded(1);
      expect(persist).toHaveBeenCalledTimes(1);
    },
    SLOW,
  );
});
