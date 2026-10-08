import {
  AiError,
  createMockAdapter,
  type AiAdapter,
  type AiCompleteRequest,
  type AiCompletion,
} from '@p2c/ai';
import {
  createCustomer,
  createPerson,
  createTeam,
  listAiAnalyses,
  listPeople,
  recordKycNote,
  type Database,
} from '@p2c/db';
import { calendarDate, type KycField } from '@p2c/domain';
import { describe, expect, it, vi } from 'vitest';
import { analyseCustomer, createAppAi, type AppAi } from './ai-analysis';
import { openAppData } from './app-data';

const TODAY = calendarDate(2026, 9, 27);

const emptySeed = (db: Database) => {
  const team = createTeam(db, { name: 'Đội 1' });
  createPerson(db, { name: 'An', role: 'RE', teamId: team.id });
};

/** Answers only when the test says so, as a request still running in Rust. */
function heldAdapter() {
  const held: { request: AiCompleteRequest; answer: (completion: AiCompletion) => void }[] = [];
  const adapter: AiAdapter = {
    complete: (request) => new Promise((resolve) => held.push({ request, answer: resolve })),
  };
  return { adapter, held };
}

/** A customer whose facts give `PROFILE_DISCOVERY`, the app and its AI. */
async function withCustomer(ai: AppAi = createAppAi({ reportError: vi.fn() })) {
  const app = await openAppData({ today: () => TODAY, seed: emptySeed, ai });
  const reId = listPeople(app.db())[0]!.id;
  const customer = app.run((d) =>
    createCustomer(d, {
      name: 'Lan',
      reId,
      stage: 'N4',
      date: calendarDate(2026, 9, 1),
      birthDate: { year: 1984 },
    }),
  );
  const confirm = (field: KycField, value: string, conflict = false) =>
    app.run((d) =>
      recordKycNote(d, customer.id, {
        text: 'Gặp KH',
        date: calendarDate(2026, 9, 2),
        facts: [{ field, value, conflict }],
      }),
    );
  confirm('maritalStatus', 'Đã kết hôn');
  confirm('childrenCount', '2');
  confirm('occupation', 'Bác sĩ');
  const rows = () => listAiAnalyses(app.db(), customer.id);
  return { app, ai, customer, confirm, rows };
}

describe('analyseCustomer (spec Phase 5 §3, §9.1)', () => {
  it('runs the Mock on the facts of the latest KYC version and saves an ACCEPTED row', async () => {
    const { app, customer, rows } = await withCustomer();

    const outcome = await analyseCustomer(app, customer.id);

    expect(outcome).toEqual({ kind: 'saved', status: 'ACCEPTED' });
    const [row] = rows();
    expect(row).toMatchObject({
      state: 'CURRENT',
      mode: 'discovery',
      provider: 'MOCK',
      model: null,
      promptVersion: 'discovery@1',
    });
    // The facts are sent with their stored code F{seq}: birth year (F1), then those confirmed.
    expect((row!.input as { facts: { code: string }[] }).facts.map((f) => f.code)).toEqual([
      'F1',
      'F2',
      'F3',
      'F4',
    ]);
  });

  it('calls no AI and saves nothing when the gate lets none through (P2)', async () => {
    const { app, customer, confirm, rows } = await withCustomer();
    const complete = vi.fn();
    const blocked = createAppAi({ reportError: vi.fn(), adapter: { complete } });
    confirm('maritalStatus', 'Độc thân', true);

    const outcome = await analyseCustomer({ ...app, ai: blocked }, customer.id);

    expect(outcome).toEqual({ kind: 'blocked', state: 'CONFLICT_RESOLUTION' });
    expect(complete).not.toHaveBeenCalled();
    expect(rows()).toEqual([]);
  });

  it('is blocked for a customer with no KYC version yet', async () => {
    const { app } = await withCustomer();
    const complete = vi.fn();
    const ai = createAppAi({ reportError: vi.fn(), adapter: { complete } });
    const bare = app.run((d) =>
      createCustomer(d, {
        name: 'Minh',
        reId: listPeople(d)[0]!.id,
        stage: 'N4',
        date: calendarDate(2026, 9, 1),
      }),
    );

    expect(await analyseCustomer({ ...app, ai }, bare.id)).toEqual({
      kind: 'blocked',
      state: 'KYC_INSUFFICIENT',
    });
    expect(complete).not.toHaveBeenCalled();
  });

  it('gives the error of the adapter and saves nothing', async () => {
    const ai = createAppAi({
      reportError: vi.fn(),
      adapter: { complete: () => Promise.reject(new AiError('AI_RATE_LIMITED')) },
    });
    const { app, customer, rows } = await withCustomer(ai);

    expect(await analyseCustomer(app, customer.id)).toEqual({
      kind: 'error',
      code: 'AI_RATE_LIMITED',
    });
    expect(rows()).toEqual([]);
    expect(ai.runner.busy).toBe(false);
  });

  it('Hủy gives cancelled at once, keeps every AI button off until the adapter answers, saves nothing', async () => {
    const held = heldAdapter();
    const ai = createAppAi({ reportError: vi.fn(), adapter: held.adapter });
    const { app, customer, rows } = await withCustomer(ai);
    const abort = new AbortController();

    const running = analyseCustomer(app, customer.id, abort.signal);
    expect(ai.runner.busy).toBe(true);
    abort.abort();

    expect(await running).toEqual({ kind: 'cancelled' });
    // "Đang hủy…": the request in Rust runs on, so a second one is refused meanwhile (P5).
    expect(ai.runner.busy).toBe(true);
    expect(await analyseCustomer(app, customer.id)).toEqual({ kind: 'error', code: 'AI_BUSY' });

    held.held[0]!.answer({ content: '{}', promptTokens: 0, completionTokens: 0 });
    await vi.waitFor(() => expect(ai.runner.busy).toBe(false));
    expect(rows()).toEqual([]);
  });

  it('ties the result to the version taken on click, so a KYC change meanwhile leaves it STALE', async () => {
    const held = heldAdapter();
    const ai = createAppAi({ reportError: vi.fn(), adapter: held.adapter });
    const { app, customer, confirm, rows } = await withCustomer(ai);

    const running = analyseCustomer(app, customer.id);
    confirm('occupation', 'Giám đốc');
    const [call] = await vi.waitFor(() => {
      expect(held.held).toHaveLength(1);
      return held.held;
    });
    call!.answer(await createMockAdapter().complete(call!.request));

    expect(await running).toEqual({ kind: 'saved', status: 'ACCEPTED' });
    expect(rows()[0]).toMatchObject({ state: 'STALE', reminder: { material: false } });
  });

  it('turns a bug into a failure the panel can show, and reports it', async () => {
    const reportError = vi.fn();
    const bug = new TypeError('boom');
    const ai = createAppAi({ reportError, adapter: { complete: () => Promise.reject(bug) } });
    const { app, customer, rows } = await withCustomer(ai);

    expect(await analyseCustomer(app, customer.id)).toEqual({ kind: 'failed' });
    expect(reportError).toHaveBeenCalledWith(bug);
    expect(ai.runner.busy).toBe(false);
    expect(rows()).toEqual([]);
  });

  it('logs what it cannot give back to a screen when no reporter is passed', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const bug = new Error('boom');
    createAppAi().reportError(bug);
    expect(log).toHaveBeenCalledWith(bug);
    log.mockRestore();
  });

  it('uses Mock with the default model until Settings → AI exists (T-167)', () => {
    expect(createAppAi({ reportError: vi.fn() }).settings()).toEqual({
      provider: 'MOCK',
      model: 'deepseek-v4.1-flash',
      reasoning: 'DEFAULT',
    });
  });
});
