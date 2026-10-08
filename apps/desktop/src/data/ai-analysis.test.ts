import {
  AiError,
  createMockAdapter,
  DEFAULT_AI_SETTINGS,
  type AiAdapter,
  type AiCompleteRequest,
  type AiCompletion,
  type AiSettings,
} from '@p2c/ai';
import {
  createCustomer,
  createPerson,
  createTeam,
  getSetting,
  listAiAnalyses,
  listPeople,
  putSetting,
  recordKycNote,
  restoreCustomer,
  softDeleteCustomer,
  type Database,
} from '@p2c/db';
import { calendarDate, type KycField } from '@p2c/domain';
import { describe, expect, it, vi } from 'vitest';
import {
  analyseCustomer,
  createAppAi,
  type AiSettingsStore,
  type AppAiOptions,
} from './ai-analysis';
import type { OpenCodeClient } from './ai-tauri';
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
  /** Waits for the one request, then answers it as the Mock would. */
  const answerWithMock = async () => {
    const [call] = await vi.waitFor(() => {
      expect(held).toHaveLength(1);
      return held;
    });
    call!.answer(await createMockAdapter().complete(call!.request));
  };
  return { adapter, held, answerWithMock };
}

/** Settings → AI kept apart from any database, for an `AppAi` of its own. */
function memoryStore(): AiSettingsStore {
  let stored: string | undefined;
  return { read: () => stored, write: (settings) => (stored = JSON.stringify(settings)) };
}

/** A customer whose facts give `PROFILE_DISCOVERY`, the app and its AI. */
async function withCustomer(options: AppAiOptions = { reportError: vi.fn() }) {
  const app = await openAppData({ today: () => TODAY, seed: emptySeed, ai: options });
  const { ai } = app;
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

  it('saves a REJECTED row when the answer fails the validator twice', async () => {
    const complete = vi.fn(() =>
      Promise.resolve({ content: 'Không có JSON', promptTokens: 0, completionTokens: 0 }),
    );
    const { app, customer, rows } = await withCustomer({
      reportError: vi.fn(),
      adapter: { complete },
    });

    expect(await analyseCustomer(app, customer.id)).toEqual({ kind: 'saved', status: 'REJECTED' });
    expect(complete).toHaveBeenCalledTimes(2);
    expect(rows()).toMatchObject([
      { state: 'REJECTED', status: 'REJECTED', attempts: 2, rawOutput: 'Không có JSON' },
    ]);
  });

  it('calls no AI and saves nothing when the gate lets none through (P2)', async () => {
    const { app, customer, confirm, rows } = await withCustomer();
    const complete = vi.fn();
    const blocked = createAppAi(memoryStore(), { reportError: vi.fn(), adapter: { complete } });
    confirm('maritalStatus', 'Độc thân', true);

    const outcome = await analyseCustomer({ ...app, ai: blocked }, customer.id);

    expect(outcome).toEqual({ kind: 'blocked', state: 'CONFLICT_RESOLUTION' });
    expect(complete).not.toHaveBeenCalled();
    expect(rows()).toEqual([]);
  });

  it('is blocked for a customer with no KYC version yet', async () => {
    const { app } = await withCustomer();
    const complete = vi.fn();
    const ai = createAppAi(memoryStore(), { reportError: vi.fn(), adapter: { complete } });
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
    const { app, customer, rows, ai } = await withCustomer({
      reportError: vi.fn(),
      adapter: { complete: () => Promise.reject(new AiError('AI_RATE_LIMITED')) },
    });

    expect(await analyseCustomer(app, customer.id)).toEqual({
      kind: 'error',
      code: 'AI_RATE_LIMITED',
    });
    expect(rows()).toEqual([]);
    expect(ai.runner.busy).toBe(false);
  });

  it('Hủy gives cancelled at once, keeps every AI button off until the adapter answers, saves nothing', async () => {
    const held = heldAdapter();
    const { app, customer, rows, ai } = await withCustomer({
      reportError: vi.fn(),
      adapter: held.adapter,
    });
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
    const { app, customer, confirm, rows } = await withCustomer({
      reportError: vi.fn(),
      adapter: held.adapter,
    });

    const running = analyseCustomer(app, customer.id);
    confirm('occupation', 'Giám đốc');
    await held.answerWithMock();

    expect(await running).toEqual({ kind: 'saved', status: 'ACCEPTED' });
    expect(rows()[0]).toMatchObject({ state: 'STALE', reminder: { material: false } });
  });

  it('discards the result, without reporting a bug, when the customer is deleted while it runs', async () => {
    const reportError = vi.fn();
    const held = heldAdapter();
    const { app, customer, rows, ai } = await withCustomer({ reportError, adapter: held.adapter });

    const running = analyseCustomer(app, customer.id);
    app.run((d) => softDeleteCustomer(d, customer.id));
    await held.answerWithMock();

    expect(await running).toEqual({ kind: 'discarded' });
    expect(reportError).not.toHaveBeenCalled();
    app.run((d) => restoreCustomer(d, customer.id));
    expect(rows()).toEqual([]);
    expect(ai.runner.busy).toBe(false);
  });

  it('discards the result when the data is replaced by Nạp lại while it runs', async () => {
    const reportError = vi.fn();
    const held = heldAdapter();
    const { app, customer, ai } = await withCustomer({ reportError, adapter: held.adapter });

    const running = analyseCustomer(app, customer.id);
    await app.reloadDemoData();
    await held.answerWithMock();

    expect(await running).toEqual({ kind: 'discarded' });
    expect(reportError).not.toHaveBeenCalled();
    expect(ai.runner.busy).toBe(false);
  });

  it('turns a bug into a failure the panel can show, and reports it', async () => {
    const reportError = vi.fn();
    const bug = new TypeError('boom');
    const { app, customer, rows, ai } = await withCustomer({
      reportError,
      adapter: { complete: () => Promise.reject(bug) },
    });

    expect(await analyseCustomer(app, customer.id)).toEqual({ kind: 'failed' });
    expect(reportError).toHaveBeenCalledWith(bug);
    expect(ai.runner.busy).toBe(false);
    expect(rows()).toEqual([]);
  });

  it('logs what it cannot give back to a screen when no reporter is passed', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const bug = new Error('boom');
    createAppAi(memoryStore()).reportError(bug);
    expect(log).toHaveBeenCalledWith(bug);
    log.mockRestore();
  });
});

describe('Settings → AI in the app (spec Phase 5 §4.1)', () => {
  const CREDIT: AiSettings = {
    provider: 'OPENCODE_GO',
    opencodePlan: 'CREDIT',
    model: 'glm-5.3',
    reasoning: 'DEFAULT',
  };

  /** Rust's OpenCode commands, answering as the Mock would. */
  function fakeOpenCode() {
    const mock = createMockAdapter();
    const complete = vi.fn((request: AiCompleteRequest) => mock.complete(request));
    const client: OpenCodeClient = {
      keyStatus: vi.fn(() => Promise.resolve(true)),
      setKey: vi.fn(() => Promise.resolve()),
      deleteKey: vi.fn(() => Promise.resolve()),
      adapter: vi.fn(() => ({ complete })),
    };
    return { client, complete };
  }

  it('starts from the defaults, with nothing to report', async () => {
    const { ai } = await withCustomer();
    expect(ai.stored()).toEqual({ settings: DEFAULT_AI_SETTINGS, problem: null });
  });

  it('saves into the settings row ai, never a key, and the screens re-read', async () => {
    const { app, ai } = await withCustomer({ opencode: fakeOpenCode().client });
    const listener = vi.fn();
    app.subscribe(listener);

    ai.save(CREDIT);

    expect(listener).toHaveBeenCalled();
    expect(JSON.parse(getSetting(app.db(), 'ai')!)).toEqual(CREDIT);
    expect(ai.stored()).toEqual({ settings: CREDIT, problem: null });
    expect(ai.settings()).toEqual(CREDIT);
  });

  it('saves only the four fields, so a key carried by the form never reaches the backup (review of PR 443)', async () => {
    const { app, ai } = await withCustomer({ opencode: fakeOpenCode().client });
    const form = { ...CREDIT, key: 'sk-secret', extra: 1 };

    ai.save(form);

    expect(JSON.parse(getSetting(app.db(), 'ai')!)).toEqual(CREDIT);
  });

  it('calls OpenCode under the saved plan and model, and saves the row under them', async () => {
    const { client, complete } = fakeOpenCode();
    const { app, ai, customer, rows } = await withCustomer({ opencode: client });
    ai.save(CREDIT);

    expect(await analyseCustomer(app, customer.id)).toEqual({ kind: 'saved', status: 'ACCEPTED' });

    expect(client.adapter).toHaveBeenCalledWith('CREDIT');
    expect(complete.mock.calls[0]![0]).toMatchObject({ model: 'glm-5.3', reasoning: null });
    expect(rows()[0]).toMatchObject({ provider: 'OPENCODE_GO', model: 'glm-5.3' });
  });

  it('sends Mặc định for a level saved on a model not checked with reasoning_effort (review of PR 424)', async () => {
    const { client, complete } = fakeOpenCode();
    const { app, ai, customer, rows } = await withCustomer({ opencode: client });
    app.run((d) => putSetting(d, 'ai', { ...CREDIT, model: 'kimi-k3', reasoning: 'HIGH' }));

    expect(ai.settings().reasoning).toBe('DEFAULT');
    await analyseCustomer(app, customer.id);
    expect(complete.mock.calls[0]![0].reasoning).toBeNull();
    expect(rows()[0]).toMatchObject({ model: 'kimi-k3', reasoning: 'DEFAULT' });
  });

  it('runs the Mock in web mode, keeping the saved provider for the exe', async () => {
    const { app, ai, customer, rows } = await withCustomer();
    ai.save(CREDIT);

    expect(ai.opencode).toBeUndefined();
    expect(ai.stored().settings).toEqual(CREDIT);
    expect(ai.settings()).toEqual({ ...CREDIT, provider: 'MOCK' });
    await analyseCustomer(app, customer.id);
    expect(rows()[0]).toMatchObject({ provider: 'MOCK', model: null });
  });

  it('falls back to the defaults, with the reason, on a stored value it cannot read (1g)', async () => {
    const { app, ai } = await withCustomer({ opencode: fakeOpenCode().client });
    app.run((d) => putSetting(d, 'ai', { ...CREDIT, model: 'gpt-6' }));

    expect(ai.stored()).toEqual({
      settings: DEFAULT_AI_SETTINGS,
      problem: { kind: 'model', model: 'gpt-6' },
    });
    expect(ai.call().settings).toEqual(DEFAULT_AI_SETTINGS);
  });

  it('reads the settings of the data in use after Nạp lại', async () => {
    const { app, ai } = await withCustomer({ opencode: fakeOpenCode().client });
    ai.save(CREDIT);
    await app.reloadDemoData();
    expect(ai.stored().settings).toEqual(DEFAULT_AI_SETTINGS);
  });
});
