import {
  AiError,
  createMockAdapter,
  DEFAULT_AI_SETTINGS,
  type AiAdapter,
  type AiCompleteRequest,
  type AiCompletion,
  type AiSettings,
  type WebSession,
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
  CHATGPT_URL,
  createAppAi,
  extractFromNote,
  saveChatGptAnswer,
  startChatGptWeb,
  type AiSettingsStore,
  type AppAiOptions,
  type WebTools,
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

  it('keeps a run in the app jobs, so the profile shown again finds it (review of PR 439)', async () => {
    const held = heldAdapter();
    const { app, customer, ai } = await withCustomer({
      reportError: vi.fn(),
      adapter: held.adapter,
    });

    const done = ai.jobs.start(`analysis:${customer.id}`, (signal) =>
      analyseCustomer(app, customer.id, signal),
    );

    expect(ai.jobs.get(`analysis:${customer.id}`)).toMatchObject({ cancelled: false });
    await held.answerWithMock();
    expect(await done).toEqual({ kind: 'saved', status: 'ACCEPTED' });
    expect(ai.jobs.get(`analysis:${customer.id}`)).toBeUndefined();
  });
});

describe('extractFromNote (spec Phase 5 §8)', () => {
  const NOTE = 'Hai vợ chồng đã kết hôn 10 năm, có 2 con đang học cấp 1.';

  it('gives the proposals of the Mock and saves nothing', async () => {
    const { app } = await withCustomer();
    const revision = app.revision();

    expect(await extractFromNote(app.ai, NOTE)).toEqual({
      kind: 'facts',
      facts: [
        { field: 'maritalStatus', value: 'Đã kết hôn', quote: 'kết hôn' },
        { field: 'childrenCount', value: 2, quote: '2 con' },
      ],
    });
    expect(app.revision()).toBe(revision);
    expect(app.ai.runner.busy).toBe(false);
  });

  it('sends the note as written, with the trường it may propose (§6.1)', async () => {
    const complete = vi.fn(() =>
      Promise.resolve({ content: '{"facts":[]}', promptTokens: 1, completionTokens: 1 }),
    );
    const ai = createAppAi(memoryStore(), { adapter: { complete } });

    expect(await extractFromNote(ai, NOTE)).toEqual({ kind: 'facts', facts: [] });
    const [request] = complete.mock.calls[0] as unknown as [AiCompleteRequest];
    const input = JSON.parse(request.messages.find((m) => m.role === 'user')!.content) as {
      note: string;
    };
    expect(input.note).toBe(NOTE);
  });

  it('says the answer cannot be read when V1 fails twice (§8 item 5)', async () => {
    const complete = () =>
      Promise.resolve({ content: 'không có JSON', promptTokens: 1, completionTokens: 1 });
    const ai = createAppAi(memoryStore(), { adapter: { complete } });

    expect(await extractFromNote(ai, NOTE)).toEqual({ kind: 'invalid' });
  });

  it('gives the §5.3 error of the adapter', async () => {
    const ai = createAppAi(memoryStore(), {
      adapter: { complete: () => Promise.reject(new AiError('AI_NO_KEY')) },
    });

    expect(await extractFromNote(ai, NOTE)).toEqual({ kind: 'error', code: 'AI_NO_KEY' });
  });

  it('gives cancelled on Hủy, the runner busy until the adapter answers (P5)', async () => {
    const held = heldAdapter();
    const ai = createAppAi(memoryStore(), { adapter: held.adapter });
    const abort = new AbortController();

    const running = extractFromNote(ai, NOTE, abort.signal);
    abort.abort();

    expect(await running).toEqual({ kind: 'cancelled' });
    expect(ai.runner.busy).toBe(true);
    await held.answerWithMock();
    await vi.waitFor(() => expect(ai.runner.busy).toBe(false));
  });

  it('turns a bug into a failure the note can show, and reports it', async () => {
    const reportError = vi.fn();
    const bug = new TypeError('boom');
    const ai = createAppAi(memoryStore(), {
      reportError,
      adapter: { complete: () => Promise.reject(bug) },
    });

    expect(await extractFromNote(ai, NOTE)).toEqual({ kind: 'failed' });
    expect(reportError).toHaveBeenCalledWith(bug);
  });
});

/** A clipboard and a browser that record what they get. */
function recordingWeb(copies = true, opens = true) {
  const copied: string[] = [];
  let opened = 0;
  const web: WebTools = {
    copy: (text) => {
      copied.push(text);
      return Promise.resolve(copies);
    },
    openChatGpt: () => {
      opened += 1;
      return Promise.resolve(opens);
    },
  };
  return { web, copied, opened: () => opened };
}

/** What the Mock answers to the session's input: an answer that passes, as ChatGPT pastes it. */
async function goodAnswer(session: WebSession) {
  const { content } = await createMockAdapter().complete({
    sessionId: 's-1',
    model: 'glm-5.3',
    reasoning: null,
    messages: [{ role: 'user', content: JSON.stringify(session.input) }],
    maxTokens: 1,
  });
  return `Đây là kết quả:\n\`\`\`json\n${content}\n\`\`\``;
}

describe('ChatGPT web in the app (spec Phase 5 §3.1)', () => {
  async function started(options: { copies?: boolean; opens?: boolean } = {}) {
    const recording = recordingWeb(options.copies, options.opens);
    const setup = await withCustomer({ reportError: vi.fn(), web: recording.web });
    const outcome = await startChatGptWeb(setup.app, setup.customer.id);
    if (outcome.kind !== 'session') throw new Error(`no session: ${outcome.kind}`);
    return { ...setup, ...recording, outcome, session: outcome.session };
  }

  it('copies the web@1 message, opens chatgpt.com, holds no AI request and saves nothing', async () => {
    const { outcome, copied, opened, ai, rows, app, customer } = await started();

    expect(outcome).toMatchObject({ copied: true, opened: true });
    expect(outcome.takenAt).toBeInstanceOf(Date);
    expect(copied).toEqual([outcome.message]);
    expect(outcome.message).toMatch(/^Tin nhắn này có hai phần/);
    expect(outcome.message).toContain('"mode":"discovery"');
    expect(opened()).toBe(1);
    expect(outcome.session.input.mode).toBe('discovery');
    expect(ai.runner.busy).toBe(false);
    expect(rows()).toEqual([]);
    // An AI request still runs meanwhile (§3.1 item 5).
    expect(await analyseCustomer(app, customer.id)).toEqual({ kind: 'saved', status: 'ACCEPTED' });
  });

  it('keeps the session when the copy or the browser fails, and says which', async () => {
    expect((await started({ copies: false })).outcome).toMatchObject({
      copied: false,
      opened: true,
    });
    expect((await started({ opens: false })).outcome).toMatchObject({
      copied: true,
      opened: false,
    });
  });

  it('copies and opens nothing when the gate lets no AI through', async () => {
    const recording = recordingWeb();
    const { app, customer, confirm } = await withCustomer({ web: recording.web });
    confirm('childrenCount', '3', true);

    expect(await startChatGptWeb(app, customer.id)).toEqual({
      kind: 'blocked',
      state: 'CONFLICT_RESOLUTION',
    });
    expect(recording.copied).toEqual([]);
    expect(recording.opened()).toBe(0);
  });

  it('saves a pasted answer that passes as CHATGPT_WEB, with no model, reasoning or tokens', async () => {
    const { app, session, rows } = await started();

    expect(saveChatGptAnswer(app, session, await goodAnswer(session))).toEqual({
      kind: 'saved',
      status: 'ACCEPTED',
    });
    expect(rows()).toMatchObject([
      {
        state: 'CURRENT',
        provider: 'CHATGPT_WEB',
        model: null,
        reasoning: null,
        promptTokens: null,
        promptVersion: 'discovery@1+web@1',
        attempts: 1,
      },
    ]);
  });

  it('gives the issues and the retry message on a first wrong paste, then saves the second', async () => {
    const { app, session, rows } = await started();

    const retry = saveChatGptAnswer(app, session, 'Xin lỗi, tôi không chắc.');
    if (retry.kind !== 'retry') throw new Error(retry.kind);
    expect(retry.issues).toMatchObject([{ code: 'V1', path: '$' }]);
    expect(retry.retryMessage).toContain('- V1 tại $');
    expect(rows()).toEqual([]);

    expect(saveChatGptAnswer(app, retry.session, await goodAnswer(session))).toEqual({
      kind: 'saved',
      status: 'ACCEPTED',
    });
    expect(rows()).toMatchObject([{ status: 'ACCEPTED', attempts: 2 }]);
  });

  it('saves REJECTED with the last paste after two wrong ones', async () => {
    const { app, session, rows } = await started();

    const retry = saveChatGptAnswer(app, session, 'Lần 1');
    if (retry.kind !== 'retry') throw new Error(retry.kind);
    expect(saveChatGptAnswer(app, retry.session, 'Lần 2')).toEqual({
      kind: 'saved',
      status: 'REJECTED',
    });
    expect(rows()).toMatchObject([
      { state: 'REJECTED', provider: 'CHATGPT_WEB', attempts: 2, rawOutput: 'Lần 2' },
    ]);
  });

  it('counts no attempt for a blank paste or one over 20 000 characters', async () => {
    const { app, session, rows } = await started();

    expect(saveChatGptAnswer(app, session, ' \n ')).toEqual({ kind: 'unusable', reason: 'EMPTY' });
    expect(saveChatGptAnswer(app, session, 'x'.repeat(20_001))).toEqual({
      kind: 'unusable',
      reason: 'TOO_LONG',
    });
    expect(rows()).toEqual([]);
  });

  it('ties the result to the version taken on click, so a KYC change meanwhile leaves it STALE', async () => {
    const { app, session, rows, confirm } = await started();
    confirm('occupation', 'Giám đốc');

    saveChatGptAnswer(app, session, await goodAnswer(session));
    expect(rows()[0]).toMatchObject({ state: 'STALE', provider: 'CHATGPT_WEB' });
  });

  it('discards the answer, without reporting a bug, once the customer is deleted', async () => {
    const { app, session, rows, customer } = await started();
    app.run((d) => softDeleteCustomer(d, customer.id));

    expect(saveChatGptAnswer(app, session, await goodAnswer(session))).toEqual({
      kind: 'discarded',
    });
    expect(app.ai.reportError).not.toHaveBeenCalled();
    app.run((d) => restoreCustomer(d, customer.id));
    expect(rows()).toEqual([]);
  });

  it('turns a bug into a failure the panel can show, and reports it', async () => {
    const { app, session } = await started();
    const done = { content: '', parsed: null, issues: [] };
    // A session already over: `checkWebAnswer` throws.
    const over = { ...session, attempts: [done, done] };

    expect(saveChatGptAnswer(app, over, 'x')).toEqual({ kind: 'failed' });
    expect(app.ai.reportError).toHaveBeenCalledOnce();
  });

  it('copies and opens through the webview in web mode (§3.1 item 8)', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const open = vi.fn();
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    vi.stubGlobal('window', { open });
    try {
      const { web } = createAppAi(memoryStore());
      expect(await web.copy('tin nhắn')).toBe(true);
      expect(writeText).toHaveBeenCalledWith('tin nhắn');
      expect(await web.openChatGpt()).toBe(true);
      expect(open).toHaveBeenCalledWith(CHATGPT_URL, '_blank', 'noopener');
      expect(CHATGPT_URL).toBe('https://chatgpt.com/');

      writeText.mockRejectedValue(new DOMException('denied', 'NotAllowedError'));
      expect(await web.copy('tin nhắn')).toBe(false);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('opens chatgpt.com through Rust in the exe', async () => {
    const openChatGpt = vi.fn().mockResolvedValue(false);
    const opencode = { openChatGpt } as unknown as OpenCodeClient;
    const { web } = createAppAi(memoryStore(), { opencode });
    expect(await web.openChatGpt()).toBe(false);
    expect(openChatGpt).toHaveBeenCalledOnce();
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
      openChatGpt: vi.fn(() => Promise.resolve(true)),
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

  it('sends Mặc định for a level saved on a model that does not take reasoning_effort (review of PR 424)', async () => {
    const { client, complete } = fakeOpenCode();
    const { app, ai, customer, rows } = await withCustomer({ opencode: client });
    app.run((d) => putSetting(d, 'ai', { ...CREDIT, model: 'glm-5.3', reasoning: 'HIGH' }));

    expect(ai.settings().reasoning).toBe('DEFAULT');
    await analyseCustomer(app, customer.id);
    expect(complete.mock.calls[0]![0].reasoning).toBeNull();
    expect(rows()[0]).toMatchObject({ model: 'glm-5.3', reasoning: 'DEFAULT' });
  });

  it('sends and records the level saved on a model that takes reasoning_effort (T-179)', async () => {
    const { client, complete } = fakeOpenCode();
    const { app, ai, customer, rows } = await withCustomer({ opencode: client });
    app.run((d) => putSetting(d, 'ai', { ...CREDIT, model: 'kimi-k3', reasoning: 'HIGH' }));

    expect(ai.settings().reasoning).toBe('HIGH');
    await analyseCustomer(app, customer.id);
    expect(complete.mock.calls[0]![0].reasoning).toBe('HIGH');
    expect(rows()[0]).toMatchObject({ model: 'kimi-k3', reasoning: 'HIGH' });
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
