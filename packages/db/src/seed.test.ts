import {
  buildAnalysisInput,
  KYC_CATEGORY_LABELS,
  KYC_FIELD_LABELS,
  mockAnalysisOutput,
  mockDiscoveryOutput,
  PROMPT_VERSIONS,
} from '@p2c/ai/schema';
import {
  APPOINTMENT_STATUSES,
  calendarDate,
  evaluateKycGate,
  formatIsoDate,
  KYC_GATE_STATES,
  type KycCategory,
  type KycField,
} from '@p2c/domain';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { listAiAnalyses } from './ai-analyses';
import { listAppointments } from './appointments';
import { listCustomers, listStageTransitions } from './customers';
import { openDatabase, type Database } from './database';
import { getKycProfile } from './kyc';
import { listPolicies } from './policies';
import { APPOINTMENT_TRIGGERS } from './schema';
import { seedDemoData } from './seed';
import { createTeam, listPeople, listTeams } from './team';
import { codeOf } from './test-support';
import { listTrash } from './trash';

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

/** Rows of each business table, live and deleted. */
function rowCounts(db: Database): Record<string, number> {
  const tables = db.sqlite.exec(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT IN ('schema_migrations', 'sqlite_sequence') ORDER BY name",
  );
  return Object.fromEntries(
    tables[0]!.values.map(([name]) => [
      String(name),
      Number(db.sqlite.exec(`SELECT COUNT(*) FROM "${String(name)}"`)[0]!.values[0]![0]),
    ]),
  );
}

/** `seedDemoData` of seed 1 on ANCHOR as it was before the scale options (T-216). */
const DEMO_ROW_COUNTS = {
  ai_analyses: 63,
  appointment_coordinators: 899,
  appointments: 6229,
  customers: 1200,
  kyc_facts: 10383,
  kyc_notes: 4195,
  kyc_versions: 9726,
  people: 36,
  policies: 988,
  settings: 0,
  stage_transitions: 3309,
  teams: 3,
};
// T-232 moved it with one more read of the seed's ticking clock per stage change (stamps and ids);
// T-237 with the prompt version of the Mock analyses (`@2`, DR6-18); T-257 with `@3` (G5 18/10/2026).
// The hash of the data seeded at UTC. From UTC+12 noon UTC is already the next day, so `middayOf`
// takes local noon and every stamp and the time of every id move back 12–14 hours (DR-15); from
// UTC−12 to UTC+11 the data is the very data of UTC.
const DEMO_HASH = 'a66327bfc10f124579c5d8ff514e4133cf6ee353587f2f66835a08eda711e4b7';

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
      // The demo before the load data (T-216): no scale given, the very rows it had, seeded at UTC
      // as DEMO_HASH is. A change of schema or of the demo itself moves these pins on purpose;
      // nothing else should.
      const utc = await inTimeZone('UTC', () => seeded(1));
      expect(rowCounts(utc.db)).toEqual(DEMO_ROW_COUNTS);
      expect(await contentHash(utc.db)).toBe(DEMO_HASH);
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
        .map((a) => formatIsoDate(a.date))
        .sort();
      expect(days[0]! >= '2025-09-15').toBe(true);
      expect(days.at(-1)! > '2026-09-29').toBe(true);
      expect(days.at(-1)! <= '2026-10-13').toBe(true);
      const future = listAppointments(db).filter((a) => formatIsoDate(a.date) >= '2026-09-15');
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

    it('has a few Mock analyses (spec Phase 5 §7.3), current and stale, citing the facts sent', () => {
      const analyses = listCustomers(db).flatMap((c) => listAiAnalyses(db, c.id));
      expect(analyses.length).toBeGreaterThanOrEqual(10);
      expect(analyses.length).toBeLessThanOrEqual(100);
      expect(new Set(analyses.map((a) => a.mode))).toEqual(new Set(['analysis', 'discovery']));
      expect(analyses.some((a) => a.state === 'CURRENT')).toBe(true);
      // The latest of a customer whose KYC changed since: the panel shows the reminder (§7.2).
      expect(analyses.some((a) => a.state === 'STALE' && a.reminder !== null)).toBe(true);
      for (const analysis of analyses) {
        expect(analysis).toMatchObject({ status: 'ACCEPTED', provider: 'MOCK', attempts: 1 });
        // The version the app's prompt has now, as its own analyses carry it (DR6-18).
        expect(analysis.promptVersion).toBe(PROMPT_VERSIONS[analysis.mode]);
        expect(formatIsoDate(analysis.date) < '2026-09-15').toBe(true);
        // Each code is `F{seq}` of a fact of the customer, sent under the app's label (prompts §1.1).
        const fieldOf = new Map(
          db.sqlite
            .exec(
              `SELECT seq, field FROM kyc_facts WHERE customer_id = '${analysis.customerId}'`,
            )[0]!
            .values.map(([seq, field]) => [`F${String(seq)}`, field as KycField]),
        );
        const input = analysis.input as {
          facts: { code: string; field: string }[];
          missingCategories: { code: KycCategory; label: string }[];
        };
        for (const fact of input.facts) {
          const field = fieldOf.get(fact.code)!;
          expect(fact.field).toBe(field === 'birthYear' ? 'Tuổi' : KYC_FIELD_LABELS[field]);
        }
        for (const missing of input.missingCategories) {
          expect(missing.label).toBe(KYC_CATEGORY_LABELS[missing.code]);
        }
        const sent = input.facts.map((f) => f.code);
        const cited = Object.values(analysis.output as Record<string, { evidence: string[] }[]>)
          .flat()
          .flatMap((item) => item.evidence);
        expect(cited.length).toBeGreaterThan(0);
        expect(cited.every((code) => sent.includes(code))).toBe(true);
        // The answer of the app's Mock to that input, word for word (DR5-18).
        const mock = analysis.mode === 'analysis' ? mockAnalysisOutput : mockDiscoveryOutput;
        const missing = input.missingCategories.map((category) => category.code);
        expect(analysis.output).toEqual(mock(sent, missing));
        if (analysis.state !== 'CURRENT') continue;
        // KYC unchanged since: the input the app would send for that day (DR5-18).
        const profile = getKycProfile(db, analysis.customerId);
        const gate = evaluateKycGate(profile.facts);
        expect(analysis.input).toEqual(buildAnalysisInput(profile, gate, analysis.date));
      }
      // The demo shows the block "Thông tin tham khảo" (P6) as the app's Mock gives it (DS-B2).
      const notes = (a: (typeof analyses)[number]) =>
        (a.output as { personalityNotes: [] }).personalityNotes;
      expect(analyses.some((a) => notes(a).length > 0)).toBe(true);
    });
  });

  it(
    'scales the teams, REs, customers and meetings, and fills Thùng rác on request (T-216)',
    async () => {
      const db = await openDatabase();
      const scale = { teams: 4, resPerTeam: 2, customersPerRe: 5, meetingDays: [1, 1] as const };
      seedDemoData(db, { anchorDate: ANCHOR, seed: 1, scale, trash: true });
      expect(
        listTeams(db)
          .map((t) => t.name)
          .sort(),
      ).toEqual(['Bình Minh', 'Hừng Đông', 'Sao Mai', 'Sao Mai 2']);
      const people = listPeople(db);
      expect(people.filter((p) => p.role === 'TL')).toHaveLength(4);
      expect(people.filter((p) => p.role === 'RE')).toHaveLength(8);
      // At most one meeting booked a week for each RE (besides those moved there), most weeks one.
      const start = Date.UTC(2025, 8, 15);
      const booked = listAppointments(db).filter((a) => a.rescheduledFromId === null);
      const weeks = booked.map((a) => {
        const day = Date.UTC(a.date.year, a.date.month - 1, a.date.day);
        return `${a.reId} ${Math.floor((day - start) / (7 * 86_400_000))}`;
      });
      expect(new Set(weeks).size).toBe(weeks.length);
      expect(booked.length).toBeGreaterThan((8 * 56) / 2);

      const trash = listTrash(db).map((row) => ({
        kind: row.kind,
        name: 'name' in row ? row.name : row.owner.customer!.name,
        code: row.blocked?.code,
      }));
      const [customer] = trash.filter((row) => row.kind === 'customer');
      expect(customer).toBeDefined();
      expect(listCustomers(db)).toHaveLength(40 - 1);
      // Deleted on the anchor day, the customer last, after its appointment and policy.
      expect(trash).toEqual(
        expect.arrayContaining([
          { kind: 'team', name: 'Ánh Dương', code: undefined },
          expect.objectContaining({ kind: 'person', code: 'TEAM_NOT_FOUND' }),
          expect.objectContaining({ kind: 'person', code: undefined }),
          { kind: 'appointment', name: customer!.name, code: 'CUSTOMER_NOT_FOUND' },
          expect.objectContaining({ kind: 'appointment', code: undefined }),
          expect.objectContaining({ kind: 'policy', code: undefined }),
        ]),
      );
      expect(trash.filter((row) => row.kind === 'person')).toHaveLength(3);
      expect(trash.filter((row) => row.kind === 'person' && row.code)).toHaveLength(2);
    },
    SLOW,
  );

  it('refuses a database that already has data', async () => {
    const db = await openDatabase();
    createTeam(db, { name: 'Sao Mai' });
    expect(codeOf(() => seedDemoData(db, { anchorDate: ANCHOR, seed: 1 }))).toBe(
      'SEED_DATABASE_NOT_EMPTY',
    );
  });

  it(
    'seeds on the first and the last day of the app, keeping every day in 1900–2100 (DR-35)',
    async () => {
      for (const anchorDate of [calendarDate(1900, 1, 1), calendarDate(2100, 12, 31)]) {
        const { db } = await seeded(1, anchorDate);
        expect(listTeams(db)).toHaveLength(3);
        const days = db.sqlite.exec(
          `SELECT MIN(day), MAX(day) FROM (SELECT date AS day FROM appointments
           UNION ALL SELECT date FROM stage_transitions UNION ALL SELECT created_date FROM kyc_notes)`,
        )[0]!.values[0]!;
        expect(String(days[0]) >= '1900-01-01').toBe(true);
        expect(String(days[1]) <= '2100-12-31').toBe(true);
      }
    },
    SLOW,
  );

  it(
    'saves the file once, after the whole seed',
    async () => {
      const { persist } = await seeded(1);
      expect(persist).toHaveBeenCalledTimes(1);
    },
    SLOW,
  );
});
