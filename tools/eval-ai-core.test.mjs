/* global AbortSignal */
import { readFileSync } from 'node:fs';
import { URL } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import {
  AiError,
  createMockAdapter,
  KYC_FIELD_LABELS,
  takeAnalysisInput,
} from '../packages/ai/src/index.ts';
import { calendarDate } from '../packages/domain/src/period.ts';
import {
  evalMain,
  factLine,
  formatReport,
  gradeNote,
  openCodeAdapter,
  PLAN_URLS,
  readConfig,
  runEval,
} from './eval-ai-core.mjs';
import { EVAL_NOTES, EVAL_PROFILES, EVAL_TODAY } from './fixtures/ai-eval.mjs';

const KEY = 'sk-test-0123456789abcdef';
const DOC = readFileSync(new URL('../docs/golden/ai-eval.md', import.meta.url), 'utf8');
const RUN_DAY = calendarDate(2026, 10, 12);

/** A clock that moves 1.5 s on each read. */
const clock = () => {
  let t = 0;
  return () => (t += 1500);
};

const ok = (body) => ({ status: 200, text: async () => JSON.stringify(body) });
const reply = (content, usage = { prompt_tokens: 100, completion_tokens: 40 }) =>
  ok({ choices: [{ message: { content } }], usage });

/** A fetch that answers every call as Mock would, with token counts. */
const mockFetch = () => {
  const mock = createMockAdapter();
  return vi.fn(async (_url, init) => {
    const body = JSON.parse(init.body);
    const { content } = await mock.complete({ messages: body.messages });
    return reply(content);
  });
};

describe('the eval set (fixtures/ai-eval.mjs)', () => {
  it('has E01–E20 and X01–X05 in order', () => {
    expect(EVAL_PROFILES.map((p) => p.id)).toEqual(
      Array.from({ length: 20 }, (_, i) => `E${String(i + 1).padStart(2, '0')}`),
    );
    expect(EVAL_NOTES.map((n) => n.id)).toEqual(['X01', 'X02', 'X03', 'X04', 'X05']);
  });

  it('gives each profile the mode, hạng mục thiếu and warnings of the doc (A2)', () => {
    for (const profile of EVAL_PROFILES) {
      const input = takeAnalysisInput(profile, EVAL_TODAY);
      expect(input.mode, profile.id).toBe(profile.mode);
      expect(
        input.missingCategories.map((c) => c.code),
        profile.id,
      ).toEqual(profile.missing);
      expect(input.conflictWarnings, profile.id).toEqual(
        profile.warnings.map((field) => KYC_FIELD_LABELS[field]),
      );
    }
    const modes = EVAL_PROFILES.map((p) => p.mode);
    expect(modes.filter((m) => m === 'analysis')).toHaveLength(14);
    expect(modes.filter((m) => m === 'discovery')).toHaveLength(6);
  });

  it('sends the number of facts of the doc for E01–E10, E09 from F3', () => {
    const sent = EVAL_PROFILES.slice(0, 10).map(
      (p) => takeAnalysisInput(p, EVAL_TODAY).facts.length,
    );
    expect(sent).toEqual([4, 10, 13, 11, 10, 10, 14, 15, 14, 6]);
    const e09 = takeAnalysisInput(EVAL_PROFILES[8], EVAL_TODAY).facts.map((f) => f.code);
    expect(e09[0]).toBe('F3');
    expect(e09).not.toContain('F1');
    expect(e09).not.toContain('F2');
  });

  it('sends E11–E20 word for word as ai-eval.md §4.1 lists them', () => {
    const lines = new Map(
      [...DOC.matchAll(/^- \*\*(E\d\d)\*\* — (.+)$/gmu)].map(([, id, line]) => [id, line]),
    );
    expect(lines.size).toBe(10);
    for (const profile of EVAL_PROFILES.slice(10)) {
      expect(factLine(takeAnalysisInput(profile, EVAL_TODAY)), profile.id).toBe(
        lines.get(profile.id),
      );
    }
  });

  it('copies the notes X01–X05 word for word from ai-eval.md §5', () => {
    for (const { id, note } of EVAL_NOTES) {
      expect(DOC, id).toContain(`| ${id} | ${note} |`);
    }
  });
});

describe('readConfig', () => {
  it('needs OPENCODE_GO_KEY', () => {
    for (const env of [{}, { OPENCODE_GO_KEY: '' }, { OPENCODE_GO_KEY: '  ' }]) {
      expect(readConfig(env, [])).toEqual({
        error: expect.stringContaining('OPENCODE_GO_KEY'),
      });
    }
  });

  it('takes gói Go when OPENCODE_PLAN is missing, the default model and HIGH', () => {
    expect(readConfig({ OPENCODE_GO_KEY: ` ${KEY} ` }, [])).toEqual({
      key: KEY,
      plan: 'GO',
      url: PLAN_URLS.GO,
      model: 'deepseek-v4.1-flash',
      reasoning: 'HIGH',
    });
    expect(readConfig({ OPENCODE_GO_KEY: KEY, OPENCODE_PLAN: '' }, []).plan).toBe('GO');
  });

  it('takes the URL of gói Credit', () => {
    const config = readConfig({ OPENCODE_GO_KEY: KEY, OPENCODE_PLAN: 'CREDIT' }, []);
    expect(config.plan).toBe('CREDIT');
    expect(config.url).toBe('https://opencode.ai/zen/v1/chat/completions');
    expect(PLAN_URLS.GO).toBe('https://opencode.ai/zen/go/v1/chat/completions');
  });

  it('refuses any other plan', () => {
    for (const plan of ['credit', 'PRO', 'GO ']) {
      expect(readConfig({ OPENCODE_GO_KEY: KEY, OPENCODE_PLAN: plan }, [])).toEqual({
        error: expect.stringContaining('OPENCODE_PLAN'),
      });
    }
  });

  it('takes --model and --reasoning, and refuses what the app has not', () => {
    const env = { OPENCODE_GO_KEY: KEY };
    expect(readConfig(env, ['--model', 'kimi-k3', '--reasoning', 'DEFAULT'])).toMatchObject({
      model: 'kimi-k3',
      reasoning: 'DEFAULT',
    });
    expect(readConfig(env, ['--model', 'gpt-9'])).toEqual({
      error: expect.stringContaining('gpt-9'),
    });
    expect(readConfig(env, ['--reasoning', 'MAX'])).toEqual({
      error: expect.stringContaining('MAX'),
    });
    expect(readConfig(env, ['--model'])).toEqual({ error: expect.stringContaining('--model') });
    expect(readConfig(env, ['--fast'])).toEqual({ error: expect.stringContaining('--fast') });
  });

  it('never puts the key in an error', () => {
    const { error } = readConfig({ OPENCODE_GO_KEY: KEY, OPENCODE_PLAN: KEY }, []);
    expect(error).not.toContain(KEY);
  });
});

describe('openCodeAdapter', () => {
  const request = {
    sessionId: 'abc123',
    model: 'deepseek-v4.1-flash',
    reasoning: 'HIGH',
    messages: [
      { role: 'system', content: 'Rules' },
      { role: 'user', content: 'Facts' },
    ],
    maxTokens: 4000,
  };
  const adapter = (fetch) =>
    openCodeAdapter({ url: PLAN_URLS.CREDIT, key: KEY, userAgent: 'Project-2C/0.1.0', fetch });

  it('posts what the Rust command posts', async () => {
    const fetch = vi.fn(async () => reply('{"a":1}'));
    await adapter(fetch).complete(request);
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe(PLAN_URLS.CREDIT);
    expect(init.method).toBe('POST');
    expect(init.redirect).toBe('error');
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(init.headers).toEqual({
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      'x-opencode-session': 'abc123',
      'User-Agent': 'Project-2C/0.1.0',
    });
    expect(init.body).toBe(
      '{"model":"deepseek-v4.1-flash","messages":[{"role":"system","content":"Rules"},{"role":"user","content":"Facts"}],"max_tokens":4000,"reasoning_effort":"high"}',
    );
  });

  it('sends no reasoning_effort for null', async () => {
    const fetch = vi.fn(async () => reply('{}'));
    await adapter(fetch).complete({ ...request, reasoning: null });
    expect(JSON.parse(fetch.mock.calls[0][1].body)).not.toHaveProperty('reasoning_effort');
  });

  it('reads the content and the tokens, 0 when not given', async () => {
    await expect(adapter(async () => reply('x')).complete(request)).resolves.toEqual({
      content: 'x',
      promptTokens: 100,
      completionTokens: 40,
    });
    await expect(adapter(async () => reply('y', null)).complete(request)).resolves.toEqual({
      content: 'y',
      promptTokens: 0,
      completionTokens: 0,
    });
  });

  const fails = (response) => adapter(async () => response).complete(request);
  const http = (status, body) => ({ status, text: async () => body });

  it('maps HTTP statuses as Rust does, with the server message and the key masked', async () => {
    const cases = [
      [401, 'AI_UNAUTHORIZED'],
      [403, 'AI_UNAUTHORIZED'],
      [402, 'AI_RATE_LIMITED'],
      [429, 'AI_RATE_LIMITED'],
      [400, 'AI_HTTP'],
      [500, 'AI_HTTP'],
    ];
    for (const [status, code] of cases) {
      const body = JSON.stringify({ error: { message: ` Bad key ${KEY} ` } });
      await expect(fails(http(status, body))).rejects.toMatchObject({
        code,
        httpStatus: status,
        serverMessage: 'Bad key ***',
      });
    }
    await expect(fails(http(500, '{"error":"plain"}'))).rejects.toMatchObject({
      serverMessage: 'plain',
    });
    await expect(fails(http(500, '{"message":"top"}'))).rejects.toMatchObject({
      serverMessage: 'top',
    });
    await expect(fails(http(502, 'Bad gateway'))).rejects.toMatchObject({
      serverMessage: 'Bad gateway',
    });
    const empty = await fails(http(503, '  ')).catch((error) => error);
    expect(empty).toBeInstanceOf(AiError);
    expect(empty.serverMessage).toBeUndefined();
  });

  it('gives AI_BAD_RESPONSE for an unreadable or too long reply', async () => {
    for (const body of ['not json', '{"choices":[]}', '{"choices":[{"message":{}}]}']) {
      await expect(fails(http(200, body))).rejects.toMatchObject({ code: 'AI_BAD_RESPONSE' });
    }
    const long = JSON.stringify({ choices: [{ message: { content: 'é'.repeat(1_100_000) } }] });
    await expect(fails(http(200, long))).rejects.toMatchObject({ code: 'AI_BAD_RESPONSE' });
  });

  it('gives AI_TIMEOUT for a timeout and AI_NETWORK for any other failure', async () => {
    const timeout = Object.assign(new Error('t'), { name: 'TimeoutError' });
    await expect(
      adapter(async () => Promise.reject(timeout)).complete(request),
    ).rejects.toMatchObject({ code: 'AI_TIMEOUT' });
    await expect(
      adapter(async () => Promise.reject(new TypeError('fetch failed'))).complete(request),
    ).rejects.toMatchObject({ code: 'AI_NETWORK' });
    const slowBody = { status: 200, text: () => Promise.reject(timeout) };
    await expect(fails(slowBody)).rejects.toMatchObject({ code: 'AI_TIMEOUT' });
  });
});

describe('gradeNote', () => {
  const [X01, X02, X03, X04] = EVAL_NOTES;
  const fact = (field, value, quote) => ({ field, value, quote });
  const X01_FACTS = [
    fact('residence', 'Đà Nẵng', 'sống ở Đà Nẵng'),
    fact('maritalStatus', 'Đã kết hôn', 'cùng vợ'),
    fact('childrenCount', 2, 'Hai con đã đi làm'),
    fact('otherGoals', 'Lập quỹ từ thiện', 'lập quỹ từ thiện của gia đình'),
  ];

  it('passes when each required line has a fact, the keyword in any case', () => {
    expect(gradeNote(X01, X01_FACTS)).toEqual({ missing: [], forbidden: [], pass: true });
  });

  it('names each required line with no fact: wrong trường, keyword or value', () => {
    const facts = [
      fact('residence', 'Đà Nẵng', 'Đà Nẵng'),
      fact('dependents', 'vợ', 'cùng vợ'),
      fact('childrenCount', 3, 'hai con'),
      fact('primaryGoal', 'Từ thiện', 'một phần tiền'),
    ];
    const graded = gradeNote(X01, facts);
    expect(graded.pass).toBe(false);
    expect(graded.missing).toEqual([
      '`maritalStatus` — "vợ"',
      '`childrenCount` — "hai con" = 2',
      '`primaryGoal` / `otherGoals` — "quỹ từ thiện"',
    ]);
  });

  it('fails on a forbidden fact', () => {
    const facts = [
      fact('occupation', 'Trưởng phòng ngân hàng', 'làm trưởng phòng'),
      fact('annualIncome', 'Khoảng 5 tỷ', 'khoảng 5 tỷ'),
      fact('maritalStatus', 'Đã kết hôn', 'Chồng chị'),
      fact('occupation', 'Bác sĩ', 'Chồng chị là bác sĩ'),
    ];
    expect(gradeNote(X02, facts)).toEqual({
      missing: [],
      forbidden: ['`occupation` = "Bác sĩ"'],
      pass: false,
    });
    expect(gradeNote(X03, []).pass).toBe(true);
    expect(gradeNote(X03, [fact('residence', 'x', 'văn phòng')]).pass).toBe(false);
    expect(gradeNote(X04, [fact('riskProfile', 'Thận trọng', 'giữ tiền an toàn')]).pass).toBe(true);
  });
});

describe('runEval', () => {
  const settings = {
    provider: 'OPENCODE_GO',
    opencodePlan: 'GO',
    model: 'deepseek-v4.1-flash',
    reasoning: 'HIGH',
  };

  it('runs every profile and note once, with tokens and time', async () => {
    const adapter = openCodeAdapter({
      url: PLAN_URLS.GO,
      key: KEY,
      userAgent: 'ua',
      fetch: mockFetch(),
    });
    const progress = [];
    const results = await runEval({
      adapter,
      settings,
      now: clock(),
      log: (line) => progress.push(line),
    });
    expect(results.profiles).toHaveLength(20);
    expect(results.notes).toHaveLength(5);
    const [e01] = results.profiles;
    expect(e01).toMatchObject({
      id: 'E01',
      mode: 'discovery',
      expectedMode: 'discovery',
      status: 'ACCEPTED',
      attempts: [{ issues: [], missingBlocks: [], promptTokens: 100, completionTokens: 40 }],
      ms: 1500,
    });
    expect(e01.output).toHaveProperty('discoveryStrategy');
    expect(results.profiles.every((p) => p.status === 'ACCEPTED')).toBe(true);
    expect(results.notes[2]).toMatchObject({ id: 'X03', status: 'OK', kept: [], dropped: [] });
    expect(progress).toHaveLength(25);
    expect(progress[0]).toBe('E01 discovery ACCEPTED · 1 lần thử · 1.5 s');
  });

  it('retries once with the issues and counts a missing block apart from other V1', async () => {
    const mock = mockFetch();
    let calls = 0;
    const fetch = vi.fn(async (url, init) => {
      calls += 1;
      if (calls === 1) return reply('```json\n{"needs": [], "painPoints": "x"}\n```');
      return mock(url, init);
    });
    const adapter = openCodeAdapter({ url: PLAN_URLS.GO, key: KEY, userAgent: 'ua', fetch });
    const { profiles } = await runEval({ adapter, settings, now: clock(), log: () => {} });
    const [first] = profiles;
    expect(first.status).toBe('ACCEPTED');
    expect(first.attempts).toHaveLength(2);
    expect(first.attempts[0].missingBlocks).toEqual(['discoveryStrategy', 'nextBestActions']);
    expect(first.attempts[0].issues.map((i) => i.path)).toEqual([
      'discoveryStrategy',
      'nextBestActions',
    ]);
    const retry = JSON.parse(fetch.mock.calls[1][1].body).messages.at(-1).content;
    expect(retry).toContain('V1 tại discoveryStrategy');
  });

  it('keeps the last answer of a REJECTED profile and an unreadable note', async () => {
    const mock = mockFetch();
    const fetch = vi.fn(async (url, init) => {
      const body = JSON.parse(init.body);
      const user = body.messages[1].content;
      if (user.includes('"F1"') && !user.includes('"F5"')) return reply('không có JSON');
      if (user.includes('Gọi điện hỏi thăm')) return reply('{"facts": "none"}');
      return mock(url, init);
    });
    const adapter = openCodeAdapter({ url: PLAN_URLS.GO, key: KEY, userAgent: 'ua', fetch });
    const { profiles, notes } = await runEval({ adapter, settings, now: clock(), log: () => {} });
    expect(profiles[0]).toMatchObject({ id: 'E01', status: 'REJECTED', raw: 'không có JSON' });
    expect(profiles[0].attempts.map((a) => a.issues[0].path)).toEqual(['$', '$']);
    expect(profiles[0].attempts[0].missingBlocks).toEqual([]);
    expect(notes[2]).toMatchObject({ id: 'X03', status: 'INVALID', raw: '{"facts": "none"}' });
    expect(notes[2].attempts).toHaveLength(2);
  });

  it('records an error and goes on, but stops on a key or limit error', async () => {
    let calls = 0;
    const mock = mockFetch();
    const fetch = vi.fn(async (url, init) => {
      calls += 1;
      if (calls === 1) return { status: 500, text: async () => 'boom' };
      if (calls === 3) return { status: 429, text: async () => '{"error":{"message":"limit"}}' };
      return mock(url, init);
    });
    const adapter = openCodeAdapter({ url: PLAN_URLS.GO, key: KEY, userAgent: 'ua', fetch });
    const { profiles, notes } = await runEval({ adapter, settings, now: clock(), log: () => {} });
    expect(profiles[0]).toMatchObject({
      status: 'ERROR',
      error: { code: 'AI_HTTP', httpStatus: 500, serverMessage: 'boom' },
    });
    expect(profiles[1].status).toBe('ACCEPTED');
    expect(profiles[2]).toMatchObject({ status: 'ERROR', error: { code: 'AI_RATE_LIMITED' } });
    expect(profiles.slice(3).every((p) => p.status === 'SKIPPED')).toBe(true);
    expect(notes.every((n) => n.status === 'SKIPPED')).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(3);
  });
});

describe('formatReport', () => {
  const config = {
    plan: 'CREDIT',
    model: 'deepseek-v4.1-flash',
    reasoning: 'HIGH',
  };

  it('sums A1–A4 and the notes, with every output for the Owner to read', async () => {
    const adapter = openCodeAdapter({
      url: PLAN_URLS.GO,
      key: KEY,
      userAgent: 'ua',
      fetch: mockFetch(),
    });
    const results = await runEval({
      adapter,
      settings: { ...config, provider: 'OPENCODE_GO', opencodePlan: 'CREDIT' },
      now: clock(),
      log: () => {},
    });
    const report = formatReport(results, { ...config, day: RUN_DAY });
    expect(report).toContain('# Eval AI — 2026-10-12');
    expect(report).toContain('gói `CREDIT`');
    expect(report).toContain(
      '| A1 | Hồ sơ ACCEPTED trong ≤ 2 lần thử | 20/20 | ≥ 18/20 — **ĐẠT** |',
    );
    expect(report).toContain('| A2 | Chế độ gửi đi đúng cột "Chế độ" | 20/20 | 20/20 — **ĐẠT** |');
    expect(report).toContain('| A3 | Lần thử V1 trượt vì thiếu khóa khối | 0 | ghi nhận |');
    expect(report).toContain('| E01 | discovery | ACCEPTED | 1 | — | 100 / 40 | 1.5 s |');
    expect(report).toContain('<summary>E11 — analysis · ACCEPTED</summary>');
    expect(report).toContain(
      'F1 Tuổi: 56 · F2 Nơi sinh sống: Hà Nội · F3 Tình trạng hôn nhân: Đã kết hôn',
    );
    expect(report).toContain('<summary>X03 — OK · 0 đề xuất</summary>');
    expect(report).toContain(`Ghi chú: ${EVAL_NOTES[2].note}\n\nKhông có đề xuất.`);
    expect(report).toContain('## Đọc tay (Owner)');
    expect(report).not.toContain(KEY);
  });

  it('shows errors, rejections, missing blocks and a failed threshold', () => {
    const profile = (id, status, extra = {}) => ({
      id,
      mode: 'analysis',
      expectedMode: 'analysis',
      status,
      attempts: [],
      ms: 2000,
      input: { facts: [] },
      ...extra,
    });
    const attempt = (issues, missingBlocks = []) => ({
      issues,
      missingBlocks,
      promptTokens: 10,
      completionTokens: 5,
    });
    const results = {
      profiles: [
        profile('E01', 'ERROR', {
          error: { code: 'AI_HTTP', httpStatus: 400, serverMessage: 'bad | param' },
        }),
        profile('E02', 'REJECTED', {
          mode: 'discovery',
          raw: 'text with ``` fence',
          attempts: [
            attempt([{ code: 'V1', path: 'needs', detail: 'sai kiểu, cần array' }], ['needs']),
            attempt([{ code: 'V3', path: 'needs[0].text', detail: '"7/10"' }]),
          ],
        }),
        profile('E03', 'SKIPPED'),
        ...Array.from({ length: 17 }, (_, i) =>
          profile(`E${i + 4}`, 'ACCEPTED', { attempts: [attempt([])], output: {} }),
        ),
      ],
      notes: [
        {
          id: 'X01',
          status: 'OK',
          attempts: [attempt([])],
          ms: 1000,
          kept: [{ field: 'residence', value: 'Đà Nẵng', quote: 'Đà Nẵng' }],
          dropped: [
            { code: 'V7', path: 'facts[1].field', detail: 'trường "birthYear" không được phép' },
          ],
          grade: { missing: ['`maritalStatus` — "vợ"'], forbidden: [], pass: false },
        },
        { id: 'X02', status: 'INVALID', attempts: [attempt([]), attempt([])], ms: 1000, raw: '{}' },
        { id: 'X03', status: 'SKIPPED', attempts: [], ms: 0 },
      ],
    };
    const report = formatReport(results, { ...config, day: RUN_DAY });
    expect(report).toContain(
      '| A1 | Hồ sơ ACCEPTED trong ≤ 2 lần thử | 17/20 | ≥ 18/20 — **TRƯỢT** |',
    );
    expect(report).toContain(
      '| A2 | Chế độ gửi đi đúng cột "Chế độ" | 19/20 | 20/20 — **TRƯỢT** |',
    );
    expect(report).toContain(
      '| A3 | Lần thử V1 trượt vì thiếu khóa khối | 1 (E02 lần 1: `needs`) | ghi nhận |',
    );
    expect(report).toContain(
      '| E01 | analysis | LỖI `AI_HTTP` (HTTP 400: bad \\| param) | 0 | — | 0 / 0 | 2.0 s |',
    );
    expect(report).toContain(
      '| E02 | discovery ≠ analysis | REJECTED | 2 | lần 1: V1 `needs` · lần 2: V3 `needs[0].text` | 20 / 10 | 2.0 s |',
    );
    expect(report).toContain('| E03 | analysis | KHÔNG CHẠY | 0 | — | 0 / 0 | — |');
    expect(report).toContain('````text\ntext with ``` fence\n````');
    expect(report).toContain(
      '| X01 | OK | 1 | thiếu `maritalStatus` — "vợ" | — | 1 | 10 / 5 | 1.0 s | **TRƯỢT** |',
    );
    expect(report).toContain(
      '| X02 | KHÔNG ĐỌC ĐƯỢC | 2 | — | — | 0 | 20 / 10 | 1.0 s | **TRƯỢT** |',
    );
    expect(report).toContain('Ghi chú đạt phần script | 0/5');
    expect(report).toContain('V7 `facts[1].field`: trường "birthYear" không được phép');
  });
});

describe('evalMain', () => {
  const deps = (over = {}) => ({
    env: { OPENCODE_GO_KEY: KEY },
    argv: [],
    fetch: mockFetch(),
    now: clock(),
    day: RUN_DAY,
    userAgent: 'Project-2C/0.1.0',
    exists: () => false,
    writeFile: vi.fn(),
    log: vi.fn(),
    ...over,
  });

  it('stops before any call without a key or with a wrong plan', async () => {
    for (const env of [{}, { OPENCODE_GO_KEY: KEY, OPENCODE_PLAN: 'X' }]) {
      const d = deps({ env });
      expect(await evalMain(d)).toBe(1);
      expect(d.fetch).not.toHaveBeenCalled();
      expect(d.writeFile).not.toHaveBeenCalled();
      expect(d.log.mock.calls.at(-1)[0]).toMatch(/OPENCODE_(GO_KEY|PLAN)/);
    }
  });

  it('never overwrites a result file, before any call', async () => {
    const d = deps({ exists: () => true });
    expect(await evalMain(d)).toBe(1);
    expect(d.fetch).not.toHaveBeenCalled();
    expect(d.log.mock.calls.at(-1)[0]).toContain('docs/metrics/ai-eval-2026-10-12.md');
  });

  it('writes the result file, named by model when not the default, without the key', async () => {
    const d = deps();
    expect(await evalMain(d)).toBe(0);
    const [path, text] = d.writeFile.mock.calls[0];
    expect(path).toBe('docs/metrics/ai-eval-2026-10-12.md');
    expect(text).toContain('| A1 |');
    expect(text).not.toContain(KEY);
    const logged = d.log.mock.calls.map(([line]) => line).join('\n');
    expect(logged).not.toContain(KEY);
    expect(logged).toContain('docs/metrics/ai-eval-2026-10-12.md');

    const other = deps({ argv: ['--model', 'kimi-k3'] });
    await evalMain(other);
    expect(other.writeFile.mock.calls[0][0]).toBe('docs/metrics/ai-eval-2026-10-12-kimi-k3.md');
  });
});
