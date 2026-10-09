import { evaluateKycGate } from '@p2c/domain';
import { describe, expect, it, vi } from 'vitest';
import type { AiAdapter, AiCompleteRequest, AiCompletion } from './adapter';
import { AiError } from './errors';
import { buildAnalysisInput } from './input';
import { createMockAdapter } from './mock-adapter';
import {
  checkConnection,
  createAiRunner,
  EMPTY_RAW_OUTPUT,
  runAnalysis,
  runExtraction,
  type AiAbortSignal,
  type AiRunner,
} from './run';
import { readAiSettings, type AiSettings } from './settings';
import { fact, PRIVATE, PROFILE, TODAY } from './test-support';

const OPENCODE: AiSettings = {
  provider: 'OPENCODE_GO',
  opencodePlan: 'GO',
  model: 'kimi-k3',
  reasoning: 'HIGH',
};
const MOCK: AiSettings = {
  provider: 'MOCK',
  opencodePlan: 'GO',
  model: 'deepseek-v4.1-flash',
  reasoning: 'DEFAULT',
};

type Reply = string | AiError | Promise<string>;

/** An adapter that gives the replies in turn and keeps every request; 10 + 5 tokens a reply. */
function scripted(...replies: Reply[]) {
  const requests: AiCompleteRequest[] = [];
  const adapter: AiAdapter = {
    complete: async (request) => {
      requests.push(request);
      const reply = replies.shift();
      if (reply === undefined) throw new Error('no reply left');
      if (reply instanceof AiError) throw reply;
      return { content: await reply, promptTokens: 10, completionTokens: 5 } as AiCompletion;
    },
  };
  return { adapter, requests };
}

function deferred() {
  let resolve!: (content: string) => void;
  const promise = new Promise<string>((done) => (resolve = done));
  return { promise, resolve };
}

/** A Hủy button: the app passes a DOM `AbortSignal`, which `packages/ai` types structurally. */
function cancelButton(pressed = false) {
  let listener: (() => void) | undefined;
  let aborted = pressed;
  const signal: AiAbortSignal = {
    get aborted() {
      return aborted;
    },
    addEventListener: (_, added) => (listener = added),
    removeEventListener: (_, removed) => {
      if (listener === removed) listener = undefined;
    },
  };
  return {
    signal,
    press: () => {
      aborted = true;
      listener?.();
    },
    get listening() {
      return listener !== undefined;
    },
  };
}

/** Resolves when the runner turns idle. */
const idle = (runner: AiRunner) =>
  new Promise<void>((resolve) => {
    const stop = runner.subscribe(() => {
      if (!runner.busy) {
        stop();
        resolve();
      }
    });
  });

const item = (text: string, ...evidence: string[]) => ({ text, evidence });

/** Passes V1–V6 for the input of `PROFILE` (facts F3 … F13, ASSETS and RISK_APPETITE missing). */
const GOOD = JSON.stringify({
  hypotheses: [item('KH có thể ưu tiên học phí của con', 'F12')],
  needs: [item('Quỹ học vấn cho con lớn', 'F12', 'F4')],
  painPoints: [item('Chưa có giải pháp bảo vệ', 'F7')],
  themes: [item('Gia đình là trung tâm', 'F9')],
  discoveryStrategy: [
    item('Làm rõ mối quan tâm chính', 'F10', 'F13'),
    { text: 'Tìm hiểu quy mô tài sản', evidence: [], missingCategory: 'ASSETS' },
  ],
  nextBestActions: [item('Chuẩn bị nội dung về học phí', 'F12')],
});

/** Valid JSON that fails V2 (a fact not in the input). */
const BAD = GOOD.replace('"F7"', '"F99"');

const analysis = (settings: AiSettings, adapter: AiAdapter, extra: object = {}) => ({
  runner: createAiRunner(vi.fn()),
  adapter,
  settings,
  customerId: 'customer-1',
  kycVersionId: 'version-7',
  profile: PROFILE,
  today: TODAY,
  ...extra,
});

describe('runAnalysis', () => {
  it('records an accepted analysis on a first good answer', async () => {
    const { adapter, requests } = scripted(GOOD);
    const result = await runAnalysis(analysis(OPENCODE, adapter));
    expect(result).toEqual({
      kind: 'record',
      row: {
        customerId: 'customer-1',
        kycVersionId: 'version-7',
        mode: 'analysis',
        gateState: 'PAIN_POINT_ANALYSIS',
        status: 'ACCEPTED',
        provider: 'OPENCODE_GO',
        model: 'kimi-k3',
        reasoning: 'HIGH',
        promptVersion: 'analysis@1',
        attempts: 1,
        input: buildAnalysisInput(PROFILE, evaluateKycGate(PROFILE.facts), TODAY),
        // `personalityNotes` left out is stored as the schema reads it: [].
        output: { ...JSON.parse(GOOD), personalityNotes: [] },
        rawOutput: null,
        validator: [{ attempt: 1, errors: [] }],
        promptTokens: 10,
        completionTokens: 5,
      },
    });
    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject({ model: 'kimi-k3', reasoning: 'HIGH', maxTokens: 8000 });
    expect(requests[0]!.messages.map((message) => message.role)).toEqual(['system', 'user']);
    expect(requests[0]!.messages[0]!.content).toMatch(/^Bạn là trợ lý phân tích hồ sơ KYC/);
  });

  it('retries once with the issues and records the second answer when it passes', async () => {
    const { adapter, requests } = scripted(BAD, GOOD);
    const result = await runAnalysis(analysis(OPENCODE, adapter));
    expect(result).toMatchObject({
      kind: 'record',
      row: {
        status: 'ACCEPTED',
        attempts: 2,
        rawOutput: null,
        validator: [
          {
            attempt: 1,
            errors: [{ code: 'V2', path: 'painPoints[0].evidence[0]', detail: expect.any(String) }],
          },
          { attempt: 2, errors: [] },
        ],
        promptTokens: 20,
        completionTokens: 10,
      },
    });
    const retry = requests[1]!.messages;
    expect(retry.slice(0, 2)).toEqual(requests[0]!.messages);
    expect(retry[2]).toEqual({ role: 'assistant', content: BAD });
    expect(retry[3]?.role).toBe('user');
    expect(retry[3]?.content).toContain(
      '- V2 tại painPoints[0].evidence[0]: F99 không có trong đầu vào',
    );
  });

  it('records a rejected analysis after two wrong answers, with both reports', async () => {
    const long = `${'x'.repeat(20_500)} không có JSON`;
    const { adapter } = scripted(BAD, long);
    const result = await runAnalysis(analysis(OPENCODE, adapter));
    expect(result).toMatchObject({
      kind: 'record',
      row: {
        status: 'REJECTED',
        attempts: 2,
        output: null,
        rawOutput: 'x'.repeat(20_000),
        validator: [
          { attempt: 1, errors: [{ code: 'V2' }] },
          { attempt: 2, errors: [{ code: 'V1', path: '$' }] },
        ],
      },
    });
  });

  it('keeps the JSON of a rejected last answer as its output', async () => {
    const { adapter } = scripted(BAD, BAD);
    const result = await runAnalysis(analysis(OPENCODE, adapter));
    expect(result).toMatchObject({
      kind: 'record',
      row: { status: 'REJECTED', output: JSON.parse(BAD), rawOutput: BAD },
    });
  });

  it('stores a fixed text for an empty rejected answer, which `db` would refuse', async () => {
    const { adapter } = scripted('', '');
    const result = await runAnalysis(analysis(OPENCODE, adapter));
    expect(result).toMatchObject({
      kind: 'record',
      row: { status: 'REJECTED', output: null, rawOutput: EMPTY_RAW_OUTPUT },
    });
    expect(EMPTY_RAW_OUTPUT).not.toBe('');
  });

  it.each([
    ['the first attempt', [new AiError('AI_NETWORK')]],
    ['the second attempt', [BAD, new AiError('AI_TIMEOUT')]],
  ])('gives an error and nothing to save on a failure at %s', async (_, replies) => {
    const { adapter } = scripted(...replies);
    const code = (replies.at(-1) as AiError).code;
    expect(await runAnalysis(analysis(OPENCODE, adapter))).toEqual({ kind: 'error', code });
  });

  it('lets an error that is not an AiError through', async () => {
    const adapter: AiAdapter = { complete: () => Promise.reject(new TypeError('bug')) };
    const run = analysis(OPENCODE, adapter);
    await expect(runAnalysis(run)).rejects.toThrow('bug');
    expect(run.runner.busy).toBe(false);
  });

  it('records Mock answers with no model, reasoning or token', async () => {
    const result = await runAnalysis(analysis(MOCK, createMockAdapter()));
    expect(result).toMatchObject({
      kind: 'record',
      row: {
        status: 'ACCEPTED',
        provider: 'MOCK',
        model: null,
        reasoning: null,
        promptTokens: null,
        completionTokens: null,
      },
    });
  });

  it('sends no reasoning for the Settings "Mặc định"', async () => {
    const { adapter, requests } = scripted(GOOD);
    await runAnalysis(analysis({ ...OPENCODE, reasoning: 'DEFAULT' }, adapter));
    expect(requests[0]?.reasoning).toBeNull();
  });

  it.each([
    ['kimi-k3', 'HIGH'],
    ['deepseek-v4.1-flash', 'LOW'],
    ['glm-5.3', null],
    ['deepseek-v4-pro', null],
  ] as const)(
    'sends the stored Cao / Thấp on %s only when it takes reasoning_effort (T-179)',
    async (model, sent) => {
      const stored = JSON.stringify({ ...OPENCODE, model, reasoning: sent ?? 'HIGH' });
      const { adapter, requests } = scripted(GOOD);
      await runAnalysis(analysis(readAiSettings(stored).settings, adapter));
      expect(requests[0]).toMatchObject({ model, reasoning: sent });
    },
  );

  it('runs the discovery prompt when the gate is PROFILE_DISCOVERY', async () => {
    const facts = [
      fact(1, 'birthYear', 1990),
      fact(2, 'maritalStatus', 'Độc thân'),
      fact(3, 'childrenCount', 0),
      fact(4, 'occupation', 'Bác sĩ'),
    ];
    const { adapter, requests } = scripted(
      JSON.stringify({
        discoveryStrategy: [
          { text: 'Tìm hiểu tài sản', missingCategory: 'ASSETS' },
          item('Hỏi thêm về công việc', 'F4'),
        ],
        nextBestActions: [item('Chuẩn bị câu hỏi', 'F4')],
      }),
    );
    const result = await runAnalysis(analysis(OPENCODE, adapter, { profile: { facts } }));
    expect(result).toMatchObject({
      kind: 'record',
      row: {
        mode: 'discovery',
        gateState: 'PROFILE_DISCOVERY',
        status: 'ACCEPTED',
        promptVersion: 'discovery@1',
        output: { hypotheses: [], personalityNotes: [] },
      },
    });
    expect(requests[0]!.messages[0]!.content).toContain('Hồ sơ này chưa đủ thông tin');
  });

  it.each([
    ['KYC_INSUFFICIENT', [fact(1, 'birthYear', 1990)]],
    [
      'CONFLICT_RESOLUTION',
      [
        fact(1, 'birthYear', 1990),
        fact(2, 'maritalStatus', 'Độc thân', 'conflict'),
        fact(3, 'maritalStatus', 'Đã kết hôn', 'conflict'),
        fact(4, 'childrenCount', 0),
        fact(5, 'occupation', 'Bác sĩ'),
      ],
    ],
  ])('does not call the adapter when the gate is %s', async (state, facts) => {
    const { adapter, requests } = scripted(GOOD);
    const result = await runAnalysis(analysis(OPENCODE, adapter, { profile: { facts } }));
    expect(result).toEqual({ kind: 'blocked', state });
    expect(requests).toEqual([]);
  });

  it('sends no name, code, RE, birth year, note, appointment or contract', async () => {
    const { adapter, requests } = scripted(BAD, GOOD);
    await runAnalysis(analysis(OPENCODE, adapter));
    const sent = JSON.stringify(requests.map((request) => request.messages));
    for (const value of [...Object.values(PRIVATE), 'customer-1', 'version-7', 'note-1']) {
      expect(sent).not.toContain(String(value));
    }
  });
});

describe('the shared runner', () => {
  it('is busy until the adapter answers', async () => {
    const answer = deferred();
    const { adapter } = scripted(answer.promise);
    const run = analysis(OPENCODE, adapter);
    const seen: boolean[] = [];
    run.runner.subscribe(() => seen.push(run.runner.busy));
    const result = runAnalysis(run);
    expect(run.runner.busy).toBe(true);
    answer.resolve(GOOD);
    expect(await result).toMatchObject({ kind: 'record' });
    expect(run.runner.busy).toBe(false);
    expect(seen).toEqual([true, false]);
  });

  it('cancels at once, saves nothing, and stays busy until the adapter answers', async () => {
    const answer = deferred();
    const { adapter, requests } = scripted(answer.promise, GOOD);
    const cancel = cancelButton();
    const run = analysis(OPENCODE, adapter, { signal: cancel.signal });
    const result = runAnalysis(run);
    cancel.press();
    expect(await result).toEqual({ kind: 'cancelled' });
    expect(run.runner.busy).toBe(true);
    const done = idle(run.runner);
    answer.resolve(BAD);
    await done;
    expect(cancel.listening).toBe(false);
    // A wrong first answer after Hủy is not retried.
    expect(requests).toHaveLength(1);
  });

  it('cancels without calling the adapter when Hủy came first', async () => {
    const { adapter, requests } = scripted(GOOD);
    const { signal } = cancelButton(true);
    expect(await runAnalysis(analysis(OPENCODE, adapter, { signal }))).toEqual({
      kind: 'cancelled',
    });
    expect(requests).toEqual([]);
  });

  it('refuses a second request while busy, also after Hủy, without calling the adapter', async () => {
    const answer = deferred();
    const first = scripted(answer.promise);
    const second = scripted(GOOD, GOOD, 'OK');
    const cancel = cancelButton();
    const run = analysis(OPENCODE, first.adapter, { signal: cancel.signal });
    const pending = runAnalysis(run);
    const shared = { ...run, adapter: second.adapter, signal: undefined };

    expect(await runAnalysis(shared)).toEqual({ kind: 'error', code: 'AI_BUSY' });
    cancel.press();
    await pending;
    expect(await runAnalysis(shared)).toEqual({ kind: 'error', code: 'AI_BUSY' });
    expect(await runExtraction({ ...shared, note: 'Có 2 bé.' })).toEqual({
      kind: 'error',
      code: 'AI_BUSY',
    });
    expect(await checkConnection(shared)).toEqual({ kind: 'error', code: 'AI_BUSY' });
    expect(second.requests).toEqual([]);

    const done = idle(run.runner);
    answer.resolve(GOOD);
    await done;
    expect(await runAnalysis(shared)).toMatchObject({ kind: 'record' });
    expect(second.requests).toHaveLength(1);
  });

  it('stops telling a listener once it unsubscribes', async () => {
    const runner = createAiRunner(vi.fn());
    let calls = 0;
    const unsubscribe = runner.subscribe(() => calls++);
    unsubscribe();
    await checkConnection({ runner, adapter: scripted('OK').adapter, settings: OPENCODE });
    expect(calls).toBe(0);
  });

  it('turns idle when the job throws before giving a promise', async () => {
    const report = vi.fn();
    const runner = createAiRunner(report);
    const bug = new TypeError('bug');
    const job = (): Promise<string> => {
      throw bug;
    };
    await expect(runner.run(job)).rejects.toBe(bug);
    expect(runner.busy).toBe(false);
    expect(await runner.run(async () => 'next')).toBe('next');
    expect(report).not.toHaveBeenCalled();
  });

  it('runs the job and tells the other listeners when one throws as it turns busy', async () => {
    const report = vi.fn();
    const runner = createAiRunner(report);
    const bug = new Error('listener');
    runner.subscribe(() => {
      if (runner.busy) throw bug;
    });
    const seen: boolean[] = [];
    runner.subscribe(() => seen.push(runner.busy));
    const answer = deferred();
    const result = runner.run(() => answer.promise);
    expect(runner.busy).toBe(true);
    answer.resolve('done');
    expect(await result).toBe('done');
    expect(runner.busy).toBe(false);
    expect(seen).toEqual([true, false]);
    expect(report).toHaveBeenCalledExactlyOnceWith(bug);
  });

  // An unhandled rejection here would fail the Vitest run.
  it('turns idle and reports a listener that throws as it turns idle', async () => {
    const report = vi.fn();
    const runner = createAiRunner(report);
    const bug = new Error('listener');
    runner.subscribe(() => {
      if (!runner.busy) throw bug;
    });
    expect(await runner.run(async () => 'done')).toBe('done');
    expect(runner.busy).toBe(false);
    expect(report).toHaveBeenCalledExactlyOnceWith(bug);
  });

  it('reports a bug of the job after Hủy, which the caller no longer hears', async () => {
    const report = vi.fn();
    const runner = createAiRunner(report);
    let fail!: (error: unknown) => void;
    const job = new Promise<string>((_, reject) => (fail = reject));
    const cancel = cancelButton();
    const result = runner.run(() => job, cancel.signal);
    cancel.press();
    expect(await result).toEqual({ kind: 'cancelled' });
    const done = idle(runner);
    const bug = new TypeError('bug');
    fail(bug);
    await done;
    expect(runner.busy).toBe(false);
    expect(report).toHaveBeenCalledExactlyOnceWith(bug);
  });

  it('gives a bug of the job to the caller and does not report it too', async () => {
    const report = vi.fn();
    const runner = createAiRunner(report);
    const bug = new TypeError('bug');
    await expect(runner.run(() => Promise.reject(bug))).rejects.toBe(bug);
    expect(runner.busy).toBe(false);
    expect(report).not.toHaveBeenCalled();
  });
});

describe('runExtraction', () => {
  const NOTE = 'Chị nói hai vợ chồng đã kết hôn, có 2 bé.';
  const extraction = (adapter: AiAdapter, settings = OPENCODE) => ({
    runner: createAiRunner(vi.fn()),
    adapter,
    settings,
    note: NOTE,
  });

  it('proposes the facts that pass V7 and drops the others', async () => {
    const { adapter, requests } = scripted(
      JSON.stringify({
        facts: [
          { field: 'childrenCount', value: '2', quote: 'có 2 bé' },
          { field: 'birthYear', value: '1984', quote: 'hai vợ chồng' },
          { field: 'maritalStatus', value: 'Đã kết hôn', quote: 'đã ly hôn' },
        ],
      }),
    );
    expect(await runExtraction(extraction(adapter))).toEqual({
      kind: 'facts',
      facts: [{ field: 'childrenCount', value: 2, quote: 'có 2 bé' }],
      dropped: [
        { code: 'V7', path: 'facts[1].field', detail: expect.any(String) },
        { code: 'V7', path: 'facts[2].quote', detail: expect.any(String) },
      ],
    });
    expect(requests[0]).toMatchObject({ maxTokens: 4000 });
    expect(requests[0]!.messages[0]!.content).toMatch(/^Bạn giúp RE/);
    expect(JSON.parse(requests[0]!.messages[1]!.content)).toMatchObject({ note: NOTE });
  });

  it('retries a V1 failure once, then gives up as unreadable', async () => {
    const { adapter, requests } = scripted('không có JSON', '{"facts": "2 bé"}');
    expect(await runExtraction(extraction(adapter))).toEqual({ kind: 'invalid' });
    expect(requests[1]!.messages[3]!.content).toContain('- V1 tại $: không có khối JSON');
  });

  it('passes on a good second answer', async () => {
    const { adapter } = scripted('không có JSON', '{"facts": []}');
    expect(await runExtraction(extraction(adapter))).toEqual({
      kind: 'facts',
      facts: [],
      dropped: [],
    });
  });

  it('proposes what the Mock finds in the note', async () => {
    expect(await runExtraction(extraction(createMockAdapter(), MOCK))).toMatchObject({
      kind: 'facts',
      facts: [
        { field: 'maritalStatus', value: 'Đã kết hôn' },
        { field: 'childrenCount', value: 2 },
      ],
    });
  });

  it('gives the adapter error', async () => {
    const { adapter } = scripted(new AiError('AI_NO_KEY'));
    expect(await runExtraction(extraction(adapter))).toEqual({ kind: 'error', code: 'AI_NO_KEY' });
  });
});

describe('checkConnection', () => {
  it('sends the G5 §6 messages and passes on any answer', async () => {
    const { adapter, requests } = scripted('Xin chào');
    const runner = createAiRunner(vi.fn());
    expect(await checkConnection({ runner, adapter, settings: OPENCODE })).toEqual({ kind: 'ok' });
    expect(requests[0]).toMatchObject({ model: 'kimi-k3', reasoning: 'HIGH', maxTokens: 64 });
    expect(requests[0]!.messages).toEqual([
      { role: 'system', content: 'Trả lời đúng một từ: OK' },
      { role: 'user', content: 'ping' },
    ]);
  });

  it('gives the adapter error', async () => {
    const { adapter } = scripted(new AiError('AI_UNAUTHORIZED'));
    const runner = createAiRunner(vi.fn());
    expect(await checkConnection({ runner, adapter, settings: OPENCODE })).toStrictEqual({
      kind: 'error',
      code: 'AI_UNAUTHORIZED',
    });
  });

  it('gives the HTTP status and the start of the server message Rust passed on', async () => {
    const error = new AiError('AI_HTTP', { httpStatus: 502, serverMessage: 'Bad gateway' });
    const runner = createAiRunner(vi.fn());
    const result = await checkConnection({
      runner,
      adapter: scripted(error).adapter,
      settings: OPENCODE,
    });
    expect(result).toStrictEqual({
      kind: 'error',
      code: 'AI_HTTP',
      httpStatus: 502,
      serverMessage: 'Bad gateway',
    });
  });
});

describe('sessionId (ADR-0009 W-1: x-opencode-session)', () => {
  const SESSION_ID = /^[A-Za-z0-9-]{1,64}$/;
  const ids = (requests: AiCompleteRequest[]) => requests.map((request) => request.sessionId);

  it('is one id for both attempts of an analysis and a new one for the next analysis', async () => {
    const first = scripted('không có JSON', GOOD);
    await runAnalysis(analysis(OPENCODE, first.adapter));
    const [id, retryId] = ids(first.requests);
    expect(id).toMatch(SESSION_ID);
    expect(retryId).toBe(id);

    const second = scripted(GOOD);
    await runAnalysis(analysis(OPENCODE, second.adapter));
    expect(second.requests[0]!.sessionId).toMatch(SESSION_ID);
    expect(second.requests[0]!.sessionId).not.toBe(id);
  });

  it('is one id for both attempts of an extraction', async () => {
    const { adapter, requests } = scripted('không có JSON', '{"facts": []}');
    await runExtraction({
      runner: createAiRunner(vi.fn()),
      adapter,
      settings: OPENCODE,
      note: 'Có 2 bé.',
    });
    expect(requests).toHaveLength(2);
    expect(requests[0]!.sessionId).toMatch(SESSION_ID);
    expect(requests[1]!.sessionId).toBe(requests[0]!.sessionId);
  });

  it('is a new id for each connection check, never one of an analysis', async () => {
    const { adapter, requests } = scripted(GOOD, 'OK', 'OK');
    const runner = createAiRunner(vi.fn());
    await runAnalysis({ ...analysis(OPENCODE, adapter), runner });
    await checkConnection({ runner, adapter, settings: OPENCODE });
    await checkConnection({ runner, adapter, settings: OPENCODE });
    const sent = ids(requests);
    for (const id of sent) expect(id).toMatch(SESSION_ID);
    expect(new Set(sent).size).toBe(3);
  });
});
