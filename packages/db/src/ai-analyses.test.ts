import { describe, expect, it } from 'vitest';
import { listAiAnalyses, recordAiAnalysis, type NewAiAnalysis } from './ai-analyses';
import { createCustomer, restoreCustomer, softDeleteCustomer } from './customers';
import { openDatabase } from './database';
import * as db from './index';
import { addKycNote, confirmKycFact, listKycVersions } from './kyc';
import { LATEST_SCHEMA_VERSION, MIGRATIONS } from './migrations';
import { seedDemoData } from './seed';
import { createPerson, createTeam } from './team';
import { codeOf, d, setup } from './test-support';
import type { Database } from './database';
import type { KycField } from '@p2c/domain';

/** A customer whose birth year makes the first KYC version (material) on 01/09/2026. */
async function withCustomer() {
  const ctx = await setup();
  const customer = createCustomer(ctx.db, {
    name: 'Lan',
    reId: ctx.re.id,
    stage: 'N4',
    date: d(1, 9),
    birthDate: { year: 1980 },
  });
  return { ...ctx, customer };
}

/** Confirms one fact from a new note; returns the KYC version it records. */
function changeKyc(
  database: Database,
  customerId: string,
  field: KycField,
  value: string,
  day = d(10, 9),
) {
  const note = addKycNote(database, customerId, { text: 'Gặp lại', date: day });
  const { version } = confirmKycFact(database, customerId, {
    field,
    value,
    noteId: note.id,
    date: day,
  });
  return version!;
}

const latestVersionId = (database: Database, customerId: string) =>
  listKycVersions(database, customerId).at(-1)!.id;

/** An input as the app sends it (spec §6.1), which `@p2c/ai/schema` checks. */
const sentInput = (mode: 'analysis' | 'discovery' = 'analysis') => ({
  analysisDate: '2026-09-26',
  mode,
  facts: [
    {
      code: 'F1',
      category: 'Danh tính / tuổi',
      field: 'Tuổi',
      value: '46',
      confirmedAt: '2026-09-01',
      conflict: false,
    },
  ],
  missingCategories: [],
  conflictWarnings: [],
});

function analysis(
  customerId: string,
  kycVersionId: string,
  overrides: Partial<NewAiAnalysis> = {},
): NewAiAnalysis {
  return {
    input: sentInput(overrides.mode === 'discovery' ? 'discovery' : 'analysis'),
    customerId,
    kycVersionId,
    mode: 'analysis',
    gateState: 'PAIN_POINT_ANALYSIS',
    status: 'ACCEPTED',
    provider: 'MOCK',
    model: null,
    reasoning: null,
    promptVersion: 'analysis@1',
    attempts: 1,
    output: { summary: 'Tóm tắt' },
    rawOutput: null,
    validator: [{ attempt: 1, errors: [] }],
    promptTokens: null,
    completionTokens: null,
    ...overrides,
  };
}

const rejected = (customerId: string, kycVersionId: string): NewAiAnalysis =>
  analysis(customerId, kycVersionId, {
    status: 'REJECTED',
    attempts: 2,
    output: null,
    rawOutput: 'không phải JSON',
    validator: [
      { attempt: 1, errors: ['V1'] },
      { attempt: 2, errors: ['V1'] },
    ],
  });

describe('recordAiAnalysis', () => {
  it('appends analyses numbered per customer, dated by the app clock', async () => {
    const { db: database, customer, re, persist } = await withCustomer();
    const other = createCustomer(database, {
      name: 'Minh',
      reId: re.id,
      stage: 'N4',
      date: d(2, 9),
      birthDate: { year: 1975 },
    });
    persist.mockClear();

    const first = recordAiAnalysis(
      database,
      analysis(customer.id, latestVersionId(database, customer.id)),
    );
    const elsewhere = recordAiAnalysis(
      database,
      analysis(other.id, latestVersionId(database, other.id), {
        mode: 'discovery',
        gateState: 'PROFILE_DISCOVERY',
        promptVersion: 'discovery@1',
        provider: 'OPENCODE_GO',
        model: 'deepseek-v4.1-flash',
        reasoning: 'DEFAULT',
        attempts: 2,
        promptTokens: 1200,
        completionTokens: 300,
      }),
    );
    const second = recordAiAnalysis(
      database,
      rejected(customer.id, latestVersionId(database, customer.id)),
    );

    expect(first).toEqual({
      id: expect.stringMatching(/^[0-9A-Z]{26}$/),
      customerId: customer.id,
      seq: 1,
      kycVersionId: latestVersionId(database, customer.id),
      mode: 'analysis',
      gateState: 'PAIN_POINT_ANALYSIS',
      status: 'ACCEPTED',
      provider: 'MOCK',
      model: null,
      reasoning: null,
      promptVersion: 'analysis@1',
      attempts: 1,
      input: sentInput(),
      output: { summary: 'Tóm tắt' },
      rawOutput: null,
      validator: [{ attempt: 1, errors: [] }],
      promptTokens: null,
      completionTokens: null,
      date: d(26, 9),
      // The moment it was saved, for the chip's time (spec §9.1).
      createdAt: expect.any(Date),
    });
    expect(first.createdAt.getTime()).toBeLessThan(second.createdAt.getTime());
    expect([first.seq, second.seq, elsewhere.seq]).toEqual([1, 2, 1]);
    expect(elsewhere).toMatchObject({
      provider: 'OPENCODE_GO',
      model: 'deepseek-v4.1-flash',
      promptTokens: 1200,
    });
    expect(listAiAnalyses(database, customer.id).map((a) => a.id)).toEqual([second.id, first.id]);
    expect(persist).toHaveBeenCalledTimes(3);
  });

  it('records a ChatGPT web analysis, with no model, reasoning or token (spec §3.1, P7)', async () => {
    const { db: database, customer } = await withCustomer();
    const version = latestVersionId(database, customer.id);
    const web = { provider: 'CHATGPT_WEB', promptVersion: 'analysis@1+web@1' } as const;

    const accepted = recordAiAnalysis(database, analysis(customer.id, version, web));
    const rejectedWeb = recordAiAnalysis(database, {
      ...rejected(customer.id, version),
      ...web,
      promptVersion: 'discovery@2+web@12',
      mode: 'discovery',
      input: sentInput('discovery'),
      gateState: 'PROFILE_DISCOVERY',
    });

    expect(accepted).toMatchObject({
      provider: 'CHATGPT_WEB',
      model: null,
      reasoning: null,
      promptVersion: 'analysis@1+web@1',
      promptTokens: null,
      completionTokens: null,
    });
    expect(listAiAnalyses(database, customer.id)).toEqual([
      { ...rejectedWeb, state: 'REJECTED', reminder: null },
      { ...accepted, state: 'CURRENT', reminder: null },
    ]);
  });

  it('keeps at most 20 000 characters of a rejected raw output', async () => {
    const { db: database, customer } = await withCustomer();
    const raw = '😀'.repeat(20_001);

    const record = recordAiAnalysis(database, {
      ...rejected(customer.id, latestVersionId(database, customer.id)),
      rawOutput: raw,
    });

    expect(Array.from(record.rawOutput!)).toHaveLength(20_000);
    expect(listAiAnalyses(database, customer.id)[0]!.rawOutput).toBe(record.rawOutput);
  });

  it('keeps a rejected raw output with NUL characters whole, each NUL replaced', async () => {
    const { db: database, customer } = await withCustomer();
    const version = latestVersionId(database, customer.id);

    const kept = ['ab\0cd', '\0abc', '\0\0'].map(
      (raw) =>
        recordAiAnalysis(database, { ...rejected(customer.id, version), rawOutput: raw }).rawOutput,
    );

    expect(kept).toEqual(['ab�cd', '�abc', '��']);
    expect(listAiAnalyses(database, customer.id).map((a) => a.rawOutput)).toEqual(kept.reverse());
  });

  it('refuses a deleted customer, a KYC version of another customer and a mode that is not its gate', async () => {
    const { db: database, customer, re, persist } = await withCustomer();
    const other = createCustomer(database, {
      name: 'Minh',
      reId: re.id,
      stage: 'N4',
      date: d(2, 9),
      birthDate: { year: 1975 },
    });
    const version = latestVersionId(database, customer.id);
    persist.mockClear();

    expect(
      codeOf(() =>
        recordAiAnalysis(database, analysis(customer.id, latestVersionId(database, other.id))),
      ),
    ).toBe('KYC_VERSION_NOT_FOUND');
    expect(codeOf(() => recordAiAnalysis(database, analysis(customer.id, 'nothing')))).toBe(
      'KYC_VERSION_NOT_FOUND',
    );
    for (const wrong of [
      { mode: 'analysis', gateState: 'PROFILE_DISCOVERY' },
      { mode: 'discovery', gateState: 'PAIN_POINT_ANALYSIS' },
      { mode: 'analysis', gateState: 'KYC_INSUFFICIENT' },
      { mode: 'extraction', gateState: 'PAIN_POINT_ANALYSIS' },
    ] as const) {
      expect(
        codeOf(() => recordAiAnalysis(database, analysis(customer.id, version, wrong as never))),
      ).toBe('AI_ANALYSIS_INVALID');
    }
    softDeleteCustomer(database, customer.id);
    persist.mockClear();
    expect(codeOf(() => recordAiAnalysis(database, analysis(customer.id, version)))).toBe(
      'CUSTOMER_NOT_FOUND',
    );
    expect(codeOf(() => recordAiAnalysis(database, analysis('nobody', version)))).toBe(
      'CUSTOMER_NOT_FOUND',
    );

    restoreCustomer(database, customer.id);
    expect(listAiAnalyses(database, customer.id)).toEqual([]);
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it('refuses an analysis whose provider, attempts or outcome do not fit together', async () => {
    const { db: database, customer } = await withCustomer();
    const version = latestVersionId(database, customer.id);
    const live = { provider: 'OPENCODE_GO', model: 'glm-5.3', reasoning: 'LOW' } as const;
    const web = { provider: 'CHATGPT_WEB', promptVersion: 'analysis@1+web@1' } as const;

    for (const wrong of [
      { provider: 'OTHER' },
      // ChatGPT web: no model, reasoning or token, and a prompt version ending in `+web@<n>`.
      { ...web, model: 'gpt-5' },
      { ...web, reasoning: 'DEFAULT' },
      { ...web, promptTokens: 0 },
      { ...web, completionTokens: 0 },
      { ...web, promptVersion: 'analysis@1' },
      { ...web, promptVersion: 'analysis@1+web@' },
      { ...web, promptVersion: 'analysis@1+web@0' },
      { ...web, promptVersion: 'analysis@1+web@1 ' },
      { ...web, promptVersion: 'analysis@1+web@1+x' },
      { model: 'glm-5.3' },
      { reasoning: 'LOW' },
      { promptTokens: 10 },
      { ...live, model: null },
      { ...live, model: ' ' },
      { ...live, model: 'glm\0-5.3' },
      { ...live, reasoning: null },
      { ...live, reasoning: 'MAX' },
      { ...live, promptTokens: -1 },
      { ...live, completionTokens: 1.5 },
      { attempts: 0 },
      { attempts: 3 },
      { promptVersion: '' },
      { promptVersion: 'analysis\0@1' },
      { output: null },
      { output: Number.NaN },
      { output: () => 'Tóm tắt' },
      { rawOutput: 'thừa' },
      { input: undefined },
      { validator: undefined },
    ]) {
      expect(
        codeOf(() => recordAiAnalysis(database, analysis(customer.id, version, wrong as never))),
      ).toBe('AI_ANALYSIS_INVALID');
    }
    for (const wrong of [{ rawOutput: null }, { rawOutput: '' }, { status: 'PENDING' }]) {
      expect(
        codeOf(() =>
          recordAiAnalysis(database, { ...rejected(customer.id, version), ...(wrong as object) }),
        ),
      ).toBe('AI_ANALYSIS_INVALID');
    }
    expect(listAiAnalyses(database, customer.id)).toEqual([]);
  });

  it('refuses an input that is not as the app sends it, accepted or rejected (§7.3 rule 3)', async () => {
    const { db: database, customer, persist } = await withCustomer();
    const version = latestVersionId(database, customer.id);
    const fact = sentInput().facts[0]!;
    persist.mockClear();

    for (const input of [
      { ...sentInput(), conflictWarnings: undefined },
      { ...sentInput(), analysisDate: '26/09/2026' },
      { ...sentInput(), facts: [{ ...fact, confirmedAt: '2026-9-1' }] },
      { ...sentInput(), fullName: 'Nguyễn Văn A' },
      sentInput('discovery'),
    ]) {
      for (const base of [analysis(customer.id, version), rejected(customer.id, version)]) {
        expect(codeOf(() => recordAiAnalysis(database, { ...base, input: input as never }))).toBe(
          'AI_ANALYSIS_INVALID',
        );
      }
    }
    expect(listAiAnalyses(database, customer.id)).toEqual([]);
    expect(persist).not.toHaveBeenCalled();
  });

  it('can never be edited or deleted, not even with raw SQL', async () => {
    const { db: database, customer } = await withCustomer();
    recordAiAnalysis(database, analysis(customer.id, latestVersionId(database, customer.id)));

    expect(() => database.sqlite.run(`UPDATE ai_analyses SET status = 'REJECTED'`)).toThrow(
      /append-only/,
    );
    expect(() => database.sqlite.run('DELETE FROM ai_analyses')).toThrow(/append-only/);
    expect(listAiAnalyses(database, customer.id)).toHaveLength(1);
  });

  it('is checked by the table too, for a row the command would refuse', async () => {
    const { db: database, customer } = await withCustomer();
    const version = latestVersionId(database, customer.id);
    const insert = (row: Record<string, string | number | null>) => {
      const values = {
        id: 'x',
        customer_id: customer.id,
        seq: 1,
        kyc_version_id: version,
        mode: 'analysis',
        gate_state: 'PAIN_POINT_ANALYSIS',
        status: 'ACCEPTED',
        provider: 'MOCK',
        prompt_version: 'analysis@1',
        attempts: 1,
        input_json: '{}',
        output_json: '{}',
        validator_json: '[]',
        date: '2026-09-26',
        created_at: 'x',
        ...row,
      };
      const columns = Object.keys(values);
      database.sqlite.run(
        `INSERT INTO ai_analyses (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
        Object.values(values),
      );
    };
    const web = { id: 'w', seq: 2, provider: 'CHATGPT_WEB', prompt_version: 'analysis@1+web@1' };

    expect(() => insert({ gate_state: 'PROFILE_DISCOVERY' })).toThrow(/CHECK/);
    expect(() => insert({ mode: 'extraction' })).toThrow(/CHECK/);
    expect(() => insert({ status: 'REJECTED' })).toThrow(/CHECK/);
    expect(() => insert({ ...web, model: 'gpt-5' })).toThrow(/CHECK/);
    expect(() => insert({ ...web, prompt_tokens: 10 })).toThrow(/CHECK/);
    insert({});
    insert(web);
    expect(listAiAnalyses(database, customer.id)).toHaveLength(2);
  });
});

describe('listAiAnalyses: CURRENT / STALE / REJECTED', () => {
  const states = (database: Database, customerId: string) =>
    listAiAnalyses(database, customerId).map((a) => [a.seq, a.state]);

  it('makes the latest accepted analysis of the latest KYC version CURRENT, and a rejected one never', async () => {
    const { db: database, customer } = await withCustomer();
    const version = latestVersionId(database, customer.id);

    recordAiAnalysis(database, analysis(customer.id, version));
    recordAiAnalysis(database, rejected(customer.id, version));
    expect(states(database, customer.id)).toEqual([
      [2, 'REJECTED'],
      [1, 'CURRENT'],
    ]);

    // Analysing the same version again leaves the earlier one STALE.
    recordAiAnalysis(database, analysis(customer.id, version));
    expect(states(database, customer.id)).toEqual([
      [3, 'CURRENT'],
      [2, 'REJECTED'],
      [1, 'STALE'],
    ]);
    expect(listAiAnalyses(database, customer.id).map((a) => a.reminder)).toEqual([
      null,
      null,
      null,
    ]);
  });

  it('leaves no analysis CURRENT once a new KYC version is recorded, even a minor one', async () => {
    const { db: database, customer } = await withCustomer();
    recordAiAnalysis(database, analysis(customer.id, latestVersionId(database, customer.id)));
    recordAiAnalysis(database, rejected(customer.id, latestVersionId(database, customer.id)));

    const minor = changeKyc(database, customer.id, 'occupation', 'Bác sĩ', d(12, 9));

    expect(minor.material).toBe(false);
    expect(states(database, customer.id)).toEqual([
      [2, 'REJECTED'],
      [1, 'STALE'],
    ]);
    const [, latestAccepted] = listAiAnalyses(database, customer.id);
    expect(latestAccepted!.reminder).toEqual({ material: false, since: d(12, 9) });
  });

  it('reminds of a core change since the first material version after the analysed one', async () => {
    const { db: database, customer } = await withCustomer();
    recordAiAnalysis(database, analysis(customer.id, latestVersionId(database, customer.id)));
    recordAiAnalysis(database, analysis(customer.id, latestVersionId(database, customer.id)));

    changeKyc(database, customer.id, 'occupation', 'Bác sĩ', d(12, 9));
    const core = changeKyc(database, customer.id, 'maritalStatus', 'Đã kết hôn', d(15, 9));
    changeKyc(database, customer.id, 'maritalStatus', 'Độc thân', d(20, 9));

    expect(core.material).toBe(true);
    expect(listAiAnalyses(database, customer.id).map((a) => [a.seq, a.state, a.reminder])).toEqual([
      [2, 'STALE', { material: true, since: d(15, 9) }],
      [1, 'STALE', null],
    ]);
  });

  it('reminds since the earliest day among the versions after the analysed one (G3 ask 4)', async () => {
    const { db: database, customer } = await withCustomer();
    recordAiAnalysis(database, analysis(customer.id, latestVersionId(database, customer.id)));

    // A note written up later but dated earlier: the first version by recording order is not the
    // earliest by day.
    changeKyc(database, customer.id, 'occupation', 'Bác sĩ', d(12, 9));
    changeKyc(database, customer.id, 'occupation', 'Giám đốc', d(5, 9));
    expect(listAiAnalyses(database, customer.id)[0]!.reminder).toEqual({
      material: false,
      since: d(5, 9),
    });

    // Once one is material, only the material versions count.
    changeKyc(database, customer.id, 'maritalStatus', 'Đã kết hôn', d(20, 9));
    changeKyc(database, customer.id, 'maritalStatus', 'Độc thân', d(18, 9));
    expect(listAiAnalyses(database, customer.id)[0]!.reminder).toEqual({
      material: true,
      since: d(18, 9),
    });
  });

  it('goes by the KYC version recording order, not its date', async () => {
    const { db: database, customer } = await withCustomer();
    const first = latestVersionId(database, customer.id);
    // Recorded later but dated earlier, then another version on that same day.
    const backdated = changeKyc(database, customer.id, 'occupation', 'Bác sĩ', d(1, 9));
    const sameDay = changeKyc(database, customer.id, 'occupation', 'Giám đốc', d(1, 9));

    recordAiAnalysis(database, analysis(customer.id, backdated.id));
    recordAiAnalysis(database, analysis(customer.id, sameDay.id));
    recordAiAnalysis(database, analysis(customer.id, first));
    expect(states(database, customer.id)).toEqual([
      [3, 'STALE'],
      [2, 'STALE'],
      [1, 'STALE'],
    ]);

    recordAiAnalysis(database, analysis(customer.id, sameDay.id));
    expect(states(database, customer.id)).toEqual([
      [4, 'CURRENT'],
      [3, 'STALE'],
      [2, 'STALE'],
      [1, 'STALE'],
    ]);
  });

  it('keeps the history of a deleted customer whole for when it is restored', async () => {
    const { db: database, customer } = await withCustomer();
    recordAiAnalysis(database, analysis(customer.id, latestVersionId(database, customer.id)));
    recordAiAnalysis(database, rejected(customer.id, latestVersionId(database, customer.id)));
    const before = listAiAnalyses(database, customer.id);

    softDeleteCustomer(database, customer.id);
    expect(codeOf(() => listAiAnalyses(database, customer.id))).toBe('CUSTOMER_NOT_FOUND');

    restoreCustomer(database, customer.id);
    expect(listAiAnalyses(database, customer.id)).toEqual(before);
  });

  it('is public through the package entry', () => {
    expect(db.recordAiAnalysis).toBe(recordAiAnalysis);
    expect(db.listAiAnalyses).toBe(listAiAnalyses);
  });
});

// Seeding takes up to a minute on a slow machine with other test files running (T-095).
const SLOW = 180_000;

describe('the ai_analyses migration', () => {
  it(
    'runs on a seeded database saved before it, keeping every row',
    async () => {
      // The seed writes analyses too (T-163): seed, then take the table and its migrations away.
      const old = await openDatabase();
      seedDemoData(old, { anchorDate: d(15, 9), seed: 7 });
      const added = MIGRATIONS.filter((m) => m.tag.includes('ai_analyses')).map((m) => m.id);
      old.sqlite.run(
        `DROP TABLE ai_analyses; DELETE FROM schema_migrations WHERE id IN (${added.join(', ')})`,
      );
      expect(old.schemaVersion()).toBe(Math.min(...added) - 1);
      const tables = ['customers', 'kyc_versions', 'kyc_facts', 'appointments', 'policies'];
      const rows = (database: Database, table: string) =>
        database.sqlite.exec(`SELECT * FROM ${table} ORDER BY rowid`)[0]?.values ?? [];
      const saved = Object.fromEntries(tables.map((table) => [table, rows(old, table)]));

      const migrated = await openDatabase({
        bytes: old.export(),
        now: () => new Date(Date.UTC(2026, 8, 26, 11)),
      });

      expect(migrated.schemaVersion()).toBe(LATEST_SCHEMA_VERSION);
      for (const table of tables) expect(rows(migrated, table)).toEqual(saved[table]);
      const [customerId, versionId] = migrated.sqlite.exec(
        `SELECT v.customer_id, v.id FROM kyc_versions v JOIN customers c ON c.id = v.customer_id
       WHERE c.deleted_at IS NULL ORDER BY v.rowid DESC LIMIT 1`,
      )[0]!.values[0] as [string, string];
      recordAiAnalysis(migrated, analysis(customerId, versionId));
      expect(listAiAnalyses(migrated, customerId).map((a) => a.state)).toEqual(['CURRENT']);
    },
    SLOW,
  );

  it('lets ChatGPT web in on a database saved before it, keeping every analysis and the triggers', async () => {
    const now = () => new Date(Date.UTC(2026, 8, 26, 11));
    const before = MIGRATIONS.findIndex((m) => m.tag === '0006_ai_analyses_append_only') + 1;
    const old = await openDatabase({ migrations: MIGRATIONS.slice(0, before), now });
    const team = createTeam(old, { name: 'Sao Mai' });
    const re = createPerson(old, { name: 'An', role: 'RE', teamId: team.id });
    const customer = createCustomer(old, {
      name: 'Lan',
      reId: re.id,
      stage: 'N4',
      date: d(1, 9),
      birthDate: { year: 1980 },
    });
    const version = latestVersionId(old, customer.id);
    recordAiAnalysis(old, analysis(customer.id, version));
    recordAiAnalysis(old, {
      ...rejected(customer.id, version),
      provider: 'OPENCODE_GO',
      model: 'glm-5.3',
      reasoning: 'DEFAULT',
      promptTokens: 10,
      completionTokens: 5,
    });
    const web = analysis(customer.id, version, {
      provider: 'CHATGPT_WEB',
      promptVersion: 'analysis@1+web@1',
    });
    // The CHECK of the old table refuses it.
    expect(() => recordAiAnalysis(old, web)).toThrow(/CHECK/);
    const rows = (database: Database) =>
      database.sqlite.exec('SELECT * FROM ai_analyses ORDER BY rowid')[0]!.values;
    const saved = rows(old);

    const migrated = await openDatabase({ bytes: old.export(), now });

    expect(migrated.schemaVersion()).toBe(LATEST_SCHEMA_VERSION);
    expect(rows(migrated)).toEqual(saved);
    expect(migrated.sqlite.exec('PRAGMA foreign_key_check')).toEqual([]);
    recordAiAnalysis(migrated, web);
    expect(listAiAnalyses(migrated, customer.id).map((a) => [a.provider, a.state])).toEqual([
      ['CHATGPT_WEB', 'CURRENT'],
      ['OPENCODE_GO', 'REJECTED'],
      ['MOCK', 'STALE'],
    ]);
    // The rebuilt table is still append-only.
    expect(() => migrated.sqlite.run(`UPDATE ai_analyses SET attempts = 2`)).toThrow(/append-only/);
    expect(() => migrated.sqlite.run('DELETE FROM ai_analyses')).toThrow(/append-only/);
  });
});
