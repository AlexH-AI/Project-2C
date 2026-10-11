/* global AbortSignal, Buffer, ReadableStream, Response */
import { readFileSync } from 'node:fs';
import { URL } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import {
  AiError,
  ANALYSIS_PROMPTS,
  createMockAdapter,
  KYC_FIELD_LABELS,
  takeAnalysisInput,
} from '../packages/ai/src/index.ts';
import { extractionPrompt } from '../packages/ai/src/prompts/extraction.ts';
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

const http = (status, body) => new Response(body, { status });
const ok = (body) => http(200, JSON.stringify(body));
const reply = (content, usage = { prompt_tokens: 100, completion_tokens: 40 }) =>
  ok({ choices: [{ message: { content } }], usage });
const MB = 1024 * 1024;

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

  /** The cells of each row of the doc's tables whose first cell is `E…` / `X…`, by code. */
  const rows = (prefix) =>
    new Map(
      [...DOC.matchAll(new RegExp(`^\\| (${prefix}\\d\\d) \\|(.+)\\|$`, 'gmu'))].map(
        ([, id, rest]) => [id, rest.split(' | ').map((cell) => cell.trim())],
      ),
    );
  const CATEGORIES = {
    'Tài sản': 'ASSETS',
    'Mục tiêu': 'GOALS',
    'Rủi ro': 'RISK_APPETITE',
    'Bảo vệ': 'EXISTING_PROTECTION',
    'Quan tâm': 'CONCERNS',
  };
  const list = (cell) => (cell === '—' ? [] : cell.split(', '));

  it('copies the columns "Chế độ", "Hạng mục thiếu" and "Cảnh báo" of ai-eval.md §3, §4', () => {
    const table = rows('E');
    expect(table.size).toBe(20);
    for (const profile of EVAL_PROFILES) {
      // §3: Mã | Từ | Chế độ | Dữ kiện gửi | Hạng mục thiếu | Cảnh báo · §4: Mã | Chế độ | … | Cảnh báo
      const cells = table.get(profile.id);
      const [mode, missing, warnings] = profile.from
        ? [cells[1], cells[3], cells[4]]
        : cells.slice(0, 3);
      expect(mode, profile.id).toBe(profile.mode);
      expect(
        list(missing).map((label) => CATEGORIES[label]),
        profile.id,
      ).toEqual(profile.missing);
      expect(
        list(warnings).map((cell) => cell.replace(/ \(F\d+ \/ F\d+\)$/u, '')),
        profile.id,
      ).toEqual(profile.warnings.map((field) => KYC_FIELD_LABELS[field]));
    }
  });

  it('copies the columns "Phải có" and "Không được có" of ai-eval.md §5', () => {
    const table = rows('X');
    for (const { id, required, forbidden } of EVAL_NOTES) {
      const [, must, mustNot] = table.get(id);
      const lines = must.startsWith('—')
        ? []
        : must.split(' · ').map((line) => {
            const [fields, rest] = line.split(' — ');
            const [, words, value] = /^(.+?"): (.+)$/u.exec(rest);
            return {
              fields: [...fields.matchAll(/`(\w+)`/gu)].map(([, field]) => field),
              keywords: [...words.matchAll(/"([^"]+)"/gu)].map(([, word]) => word),
              ...(/^`(.+)`$/u.test(value) && { value: JSON.parse(value.slice(1, -1)) }),
            };
          });
      expect(required, id).toEqual(lines);
      if (forbidden === null) expect(mustNot, id).toBe('—');
      else expect(mustNot.startsWith(forbidden.label), id).toBe(true);
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

  it('posts what the Rust command posts, with its 120 s for the whole call', async () => {
    const timeout = vi.spyOn(AbortSignal, 'timeout');
    const fetch = vi.fn(async () => reply('{"a":1}'));
    await adapter(fetch).complete(request);
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe(PLAN_URLS.CREDIT);
    expect(init.method).toBe('POST');
    expect(init.redirect).toBe('manual');
    expect(timeout).toHaveBeenCalledWith(120_000);
    expect(init.signal).toBe(timeout.mock.results[0].value);
    timeout.mockRestore();
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

  it('reads the content and the tokens, null as Rust when not a count', async () => {
    await expect(adapter(async () => reply('x')).complete(request)).resolves.toEqual({
      content: 'x',
      promptTokens: 100,
      completionTokens: 40,
    });
    for (const usage of [null, { prompt_tokens: -7, completion_tokens: 1.5 }]) {
      await expect(adapter(async () => reply('y', usage)).complete(request)).resolves.toEqual({
        content: 'y',
        promptTokens: null,
        completionTokens: null,
      });
    }
  });

  const fails = (response) => adapter(async () => response).complete(request);

  it('maps HTTP statuses as Rust does, with the server message and the key masked', async () => {
    const cases = [
      [302, 'AI_HTTP'],
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
    await expect(fails(http(500, '{"message":"top abc123"}'))).rejects.toMatchObject({
      serverMessage: 'top ***',
    });
    // Only a message from the JSON, never the body as it is (spec §5.3).
    for (const body of ['Bad gateway', '  ', '{"error":{"code":1}}']) {
      const error = await fails(http(502, body)).catch((e) => e);
      expect(error).toBeInstanceOf(AiError);
      expect(error).toMatchObject({ code: 'AI_HTTP', httpStatus: 502 });
      expect(error.serverMessage, body).toBeUndefined();
    }
  });

  it('cuts the server message to 200 characters after masking the key, as Rust', async () => {
    const body = JSON.stringify({ error: `<html>${KEY}${'x'.repeat(400)}</html>` });
    const error = await fails(http(502, body)).catch((e) => e);
    expect(Array.from(error.serverMessage)).toHaveLength(200);
    expect(error.serverMessage.startsWith('<html>***x')).toBe(true);
  });

  it('gives AI_BAD_RESPONSE for an unreadable or too long reply', async () => {
    for (const body of ['not json', '{"choices":[]}', '{"choices":[{"message":{}}]}']) {
      await expect(fails(http(200, body))).rejects.toMatchObject({ code: 'AI_BAD_RESPONSE' });
    }
    const long = JSON.stringify({ choices: [{ message: { content: 'é'.repeat(1_100_000) } }] });
    await expect(fails(http(200, long))).rejects.toMatchObject({ code: 'AI_BAD_RESPONSE' });
  });

  it('takes a reply of exactly 2 MB, as Rust', async () => {
    const shell = JSON.stringify({ choices: [{ message: { content: '' } }] });
    const content = 'a'.repeat(2 * MB - shell.length);
    const body = JSON.stringify({ choices: [{ message: { content } }] });
    expect(Buffer.byteLength(body)).toBe(2 * MB);
    await expect(fails(http(200, body))).resolves.toMatchObject({ content });
  });

  /** A body of `chunks` MiB, counting what is pulled from it and whether it was cancelled. */
  const bigBody = (chunks) => {
    const seen = { pulled: 0, cancelled: false };
    const chunk = new Uint8Array(MB).fill(0x61);
    const stream = new ReadableStream({
      pull(controller) {
        if (seen.pulled === chunks) return controller.close();
        seen.pulled += 1;
        controller.enqueue(chunk);
      },
      cancel() {
        seen.cancelled = true;
      },
    });
    return { stream, seen };
  };

  it('stops reading a 32 MiB reply past 2 MB, with the code of Rust', async () => {
    const ok = bigBody(32);
    await expect(fails(new Response(ok.stream, { status: 200 }))).rejects.toMatchObject({
      code: 'AI_BAD_RESPONSE',
    });
    expect(ok.seen.pulled).toBeLessThanOrEqual(4);
    expect(ok.seen.cancelled).toBe(true);
    // An error status stays an error of its status, with no message from a cut body.
    const failed = bigBody(32);
    const error = await fails(new Response(failed.stream, { status: 500 })).catch((e) => e);
    expect(error).toMatchObject({ code: 'AI_HTTP', httpStatus: 500 });
    expect(error.serverMessage).toBeUndefined();
    expect(failed.seen.pulled).toBeLessThanOrEqual(4);
  });

  it('gives AI_TIMEOUT for a timeout and AI_NETWORK for any other failure', async () => {
    const timeout = Object.assign(new Error('t'), { name: 'TimeoutError' });
    await expect(
      adapter(async () => Promise.reject(timeout)).complete(request),
    ).rejects.toMatchObject({ code: 'AI_TIMEOUT' });
    await expect(
      adapter(async () => Promise.reject(new TypeError('fetch failed'))).complete(request),
    ).rejects.toMatchObject({ code: 'AI_NETWORK' });
    // Node's fetch gives up connecting after 10 s, as Rust: the model was not asked yet.
    const connect = new TypeError('fetch failed', { cause: { code: 'UND_ERR_CONNECT_TIMEOUT' } });
    await expect(
      adapter(async () => Promise.reject(connect)).complete(request),
    ).rejects.toMatchObject({ code: 'AI_NETWORK' });
    const broken = (reason, status) =>
      new Response(new ReadableStream({ start: (controller) => controller.error(reason) }), {
        status,
      });
    await expect(fails(broken(timeout, 200))).rejects.toMatchObject({ code: 'AI_TIMEOUT' });
    await expect(fails(broken(new TypeError('terminated'), 200))).rejects.toMatchObject({
      code: 'AI_NETWORK',
    });
    // An error status is known from the head alone, as Rust.
    const error = await fails(broken(timeout, 429)).catch((e) => e);
    expect(error).toMatchObject({ code: 'AI_RATE_LIMITED', httpStatus: 429 });
    expect(error.serverMessage).toBeUndefined();
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

  it('reads a quote as V7 does: NFC, white space collapsed (NFD, NBSP, a line break)', () => {
    const facts = [
      fact('residence', 'Đà Nẵng', 'sống ở Đà Nẵng'.normalize('NFD')),
      fact('maritalStatus', 'Đã kết hôn', 'cùng vợ'),
      fact('childrenCount', 2, 'Hai\ncon đã đi làm'),
      fact('otherGoals', 'Lập quỹ từ thiện', 'lập quỹ  từ\tthiện'),
    ];
    expect(gradeNote(X01, facts)).toEqual({ missing: [], forbidden: [], pass: true });
  });

  it('catches a forbidden value however its spaces are written, as plain text', () => {
    const facts = [
      fact('occupation', 'Trưởng phòng ngân hàng', 'làm trưởng phòng'),
      fact('annualIncome', 'Khoảng 5 tỷ', 'khoảng 5 tỷ'),
      fact('maritalStatus', 'Đã kết hôn', 'Chồng chị'),
      fact('occupation', 'Bác\nsĩ', 'Chồng chị là bác sĩ'),
    ];
    expect(gradeNote(X02, facts)).toMatchObject({
      forbidden: ['`occupation` = "Bác\nsĩ"'],
      pass: false,
    });
    expect(gradeNote(X03, [fact('residence', '<!-- x', 'văn phòng')]).forbidden).toEqual([
      '`residence` = "&lt;!-- x"',
    ]);
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

  it('does not count a block of the wrong type as a missing block', async () => {
    const mock = mockFetch();
    let calls = 0;
    const fetch = vi.fn(async (url, init) => {
      calls += 1;
      const answer = await mock(url, init);
      if (calls > 1) return answer;
      const output = JSON.parse((await answer.json()).choices[0].message.content);
      return reply(JSON.stringify({ ...output, nextBestActions: 'x' }));
    });
    const adapter = openCodeAdapter({ url: PLAN_URLS.GO, key: KEY, userAgent: 'ua', fetch });
    const { profiles } = await runEval({ adapter, settings, now: clock(), log: () => {} });
    expect(profiles[0].attempts[0].issues.map((i) => [i.code, i.path])).toEqual([
      ['V1', 'nextBestActions'],
    ]);
    expect(profiles[0].attempts[0].missingBlocks).toEqual([]);
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
      if (calls === 1) return http(500, '{"error":"boom"}');
      if (calls === 3) return http(429, '{"error":{"message":"limit"}}');
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

  it('stops on a key or limit error in the notes too', async () => {
    const fetch = vi.fn(async () => http(401, '{}'));
    const adapter = openCodeAdapter({ url: PLAN_URLS.GO, key: KEY, userAgent: 'ua', fetch });
    const { notes } = await runEval({
      adapter,
      settings,
      now: clock(),
      log: () => {},
      profileSpecs: [],
    });
    expect(notes[0]).toMatchObject({ status: 'ERROR', error: { code: 'AI_UNAUTHORIZED' } });
    expect(notes.slice(1).map((n) => n.status)).toEqual([
      'SKIPPED',
      'SKIPPED',
      'SKIPPED',
      'SKIPPED',
    ]);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('counts a call that failed as an attempt, its tokens unknown', async () => {
    const mock = mockFetch();
    const timeout = Object.assign(new Error('t'), { name: 'TimeoutError' });
    let calls = 0;
    const fetch = vi.fn(async (url, init) => {
      calls += 1;
      if (calls === 1) return http(500, '{}');
      if (calls === 2) return reply('không có JSON');
      if (calls === 3) throw timeout;
      return mock(url, init);
    });
    const adapter = openCodeAdapter({ url: PLAN_URLS.GO, key: KEY, userAgent: 'ua', fetch });
    const progress = [];
    const results = await runEval({
      adapter,
      settings,
      now: clock(),
      log: (line) => progress.push(line),
      profileSpecs: EVAL_PROFILES.slice(0, 2),
      noteSpecs: [],
    });
    const [first, second] = results.profiles;
    expect(first.attempts).toEqual([
      {
        failed: 'AI_HTTP',
        issues: [],
        missingBlocks: [],
        promptTokens: null,
        completionTokens: null,
      },
    ]);
    expect(second.attempts.map((a) => a.failed)).toEqual([undefined, 'AI_TIMEOUT']);
    expect(second.attempts[0].issues[0].path).toBe('$');
    expect(progress).toEqual([
      'E01 discovery LỖI `AI_HTTP` (HTTP 500) · 1 lần thử · 1.5 s',
      'E02 discovery LỖI `AI_TIMEOUT` · 2 lần thử · 1.5 s',
    ]);
    const report = formatReport(results, { ...settings, plan: 'GO', day: RUN_DAY });
    expect(report).toContain(
      '| E01 | discovery | LỖI `AI_HTTP` (HTTP 500) | 1 | lần 1: lỗi | 0+? / 0+? |',
    );
    expect(report).toContain(
      '| E02 | discovery | LỖI `AI_TIMEOUT` | 2 | lần 1: V1 `$` · lần 2: lỗi | 100+? / 40+? |',
    );
  });

  it('keeps going after a bug of the script or the app, as an error of that one item', async () => {
    const mock = createMockAdapter();
    let calls = 0;
    const adapter = {
      complete: async (request) => {
        calls += 1;
        if (calls === 1 || calls === 22) throw new TypeError('x is undefined');
        return mock.complete(request);
      },
    };
    const { profiles, notes } = await runEval({ adapter, settings, now: clock(), log: () => {} });
    expect(profiles[0]).toMatchObject({
      status: 'ERROR',
      error: { code: 'SCRIPT', message: 'x is undefined' },
    });
    expect(profiles[1].status).toBe('ACCEPTED');
    expect(notes[1]).toMatchObject({ status: 'ERROR', error: { code: 'SCRIPT' } });
    expect(notes[2].status).toBe('OK');
    const report = formatReport({ profiles, notes }, { ...settings, plan: 'GO', day: RUN_DAY });
    expect(report).toContain('| E01 | discovery | LỖI script: x is undefined | 1 |');
  });

  it('formats notes beyond the golden ones, with their own text', async () => {
    const note = { ...EVAL_NOTES[2], id: 'C01', note: 'Ghi chú riêng.' };
    const results = await runEval({
      adapter: createMockAdapter(),
      settings,
      now: clock(),
      log: () => {},
      profileSpecs: [],
      noteSpecs: [note],
    });
    const report = formatReport(results, { ...settings, plan: 'GO', day: RUN_DAY });
    expect(report).toContain('<summary>C01 — OK · 0 đề xuất</summary>\n\nGhi chú: Ghi chú riêng.');
  });

  it('calls nothing for a profile the gate blocks', async () => {
    const adapter = { complete: vi.fn() };
    const blocked = { id: 'B01', mode: 'analysis', facts: [] };
    const results = await runEval({
      adapter,
      settings,
      now: clock(),
      log: () => {},
      profileSpecs: [blocked],
      noteSpecs: [],
    });
    expect(adapter.complete).not.toHaveBeenCalled();
    expect(results.profiles[0]).toMatchObject({ status: 'BLOCKED', state: 'KYC_INSUFFICIENT' });
    const report = formatReport(results, { ...settings, plan: 'GO', day: RUN_DAY });
    expect(report).toContain(
      '| B01 | — ≠ analysis | CỔNG CHẶN (`KYC_INSUFFICIENT`) | 0 | — | 0 / 0 | — |',
    );
    expect(report).toContain('| A2 | Chế độ gửi đi đúng cột "Chế độ" | 0/1 | 1/1 — **TRƯỢT** |');
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
          error: { code: 'AI_HTTP', httpStatus: 400, serverMessage: 'bad | <b>param</b>' },
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
      '| E01 | analysis | LỖI `AI_HTTP` (HTTP 400: bad \\| &lt;b&gt;param&lt;/b&gt;) | 0 | — | 0 / 0 | 2.0 s |',
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
    expect(report).toContain('Ghi chú đạt phần script | 0/3 | ≥ 4/3');
    expect(report).toContain('V7 `facts[1].field`: trường "birthYear" không được phép');
    expect(report).toContain(
      '- Có thông điệp lỗi của server trong file (đã che key): đọc lại trước khi commit',
    );
  });

  const done = (id, status) => ({
    id,
    mode: 'analysis',
    expectedMode: 'analysis',
    status,
    attempts: [],
    ms: 1000,
    input: { facts: [] },
    output: {},
    raw: '',
  });

  it('passes A1 at exactly 18 of 20, and names the prompts the run used', () => {
    const profiles = Array.from({ length: 20 }, (_, i) =>
      done(`E${i + 1}`, i < 18 ? 'ACCEPTED' : 'REJECTED'),
    );
    const report = formatReport({ profiles, notes: [] }, { ...config, day: RUN_DAY });
    expect(report).toContain(
      '| A1 | Hồ sơ ACCEPTED trong ≤ 2 lần thử | 18/20 | ≥ 18/20 — **ĐẠT** |',
    );
    const { analysis, discovery } = ANALYSIS_PROMPTS;
    expect(report).toContain(
      `prompt \`${analysis.version}\`, \`${discovery.version}\`, \`${extractionPrompt.version}\``,
    );
    expect(report).not.toContain('đọc lại trước khi commit');
    expect(report).not.toContain('Chưa xong');
  });

  it('writes the words of the model as plain text: no </details> or | breaks the file', () => {
    const attack = '</details><b>x</b> | y\n| z';
    const attempt = {
      issues: [{ code: 'V3', path: 'needs[0].text', detail: `"${attack}"` }],
      missingBlocks: [],
      promptTokens: 1,
      completionTokens: 1,
    };
    const results = {
      profiles: [{ ...done('E01', 'REJECTED'), attempts: [attempt] }],
      notes: [
        {
          id: 'X03',
          note: EVAL_NOTES[2].note,
          status: 'OK',
          attempts: [attempt],
          ms: 1000,
          kept: [{ field: 'residence', value: attack, quote: attack }],
          dropped: [
            { code: 'V7', path: 'facts[1].field', detail: `trường "${attack}" không được phép` },
          ],
          grade: gradeNote(EVAL_NOTES[2], [{ field: 'residence', value: attack, quote: 'x' }]),
        },
      ],
    };
    const report = formatReport(results, { ...config, day: RUN_DAY });
    expect(report.match(/<\/details>/g)).toHaveLength(2);
    expect(report).not.toContain('<b>');
    expect(report).not.toMatch(/^\| z/m);
    expect(report).toContain('&lt;/details&gt;&lt;b&gt;x&lt;/b&gt; \\| y \\| z');
  });
});

describe('evalMain', () => {
  const RESULT = 'docs/metrics/ai-eval-2026-10-12.md';
  const PARTIAL = `${RESULT}.partial`;

  /** Files in memory; `create` refuses a path that is there, as the flag `wx` does. */
  const memoryFiles = (initial = {}) => {
    const files = new Map(Object.entries(initial));
    return {
      files,
      create: vi.fn((path, text) => {
        if (files.has(path)) throw Object.assign(new Error(`EEXIST ${path}`), { code: 'EEXIST' });
        files.set(path, text);
      }),
      write: vi.fn((path, text) => files.set(path, text)),
      rename: vi.fn((from, to) => {
        files.set(to, files.get(from));
        files.delete(from);
      }),
      remove: vi.fn((path) => files.delete(path)),
    };
  };

  const deps = (over = {}) => ({
    env: { OPENCODE_GO_KEY: KEY },
    argv: [],
    fetch: mockFetch(),
    now: clock(),
    day: RUN_DAY,
    userAgent: 'Project-2C/0.1.0',
    files: memoryFiles(),
    log: vi.fn(),
    ...over,
  });

  it('stops before any call without a key or with a wrong plan', async () => {
    for (const env of [{}, { OPENCODE_GO_KEY: KEY, OPENCODE_PLAN: 'X' }]) {
      const d = deps({ env });
      expect(await evalMain(d)).toBe(1);
      expect(d.fetch).not.toHaveBeenCalled();
      expect(d.files.files.size).toBe(0);
      expect(d.log.mock.calls.at(-1)[0]).toMatch(/OPENCODE_(GO_KEY|PLAN)/);
    }
  });

  it('never overwrites a result or the part of a stopped run, before any call', async () => {
    for (const [path, text] of [
      [RESULT, 'paid'],
      [PARTIAL, 'part'],
    ]) {
      const d = deps({ files: memoryFiles({ [path]: text }) });
      expect(await evalMain(d)).toBe(1);
      expect(d.fetch).not.toHaveBeenCalled();
      expect([...d.files.files]).toEqual([[path, text]]);
      expect(d.log.mock.calls.at(-1)[0]).toContain(`${path} đã có`);
    }
  });

  it('lets only one of two runs of the same file go, the other stops at once', async () => {
    const files = memoryFiles();
    const [first, second] = [
      deps({ files }),
      deps({ files, env: { ...deps().env, OPENCODE_PLAN: 'CREDIT' } }),
    ];
    expect(await Promise.all([evalMain(first), evalMain(second)])).toEqual([0, 1]);
    expect(second.fetch).not.toHaveBeenCalled();
    expect([...files.files.keys()]).toEqual([RESULT]);
    expect(files.files.get(RESULT)).toContain('gói `GO`');
  });

  it('keeps the items done in the .partial file after each one, when the run stops at item k', async () => {
    const k = 4;
    const mock = mockFetch();
    const fetch = vi.fn((url, init) =>
      fetch.mock.calls.length === k ? new Promise(() => {}) : mock(url, init),
    );
    const d = deps({ fetch });
    void evalMain(d);
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(k));
    const part = d.files.files.get(PARTIAL);
    expect(part.match(/^\| E\d\d \|/gm)).toHaveLength(k - 1);
    expect(part).toContain('| E03 | discovery | ACCEPTED |');
    expect(part).toContain('**Chưa xong:**');
    expect(d.files.files.get(RESULT)).toContain(`${PARTIAL.split('/').at(-1)}`);
  });

  it('writes the result file, named by model when not the default, without the key', async () => {
    const d = deps();
    expect(await evalMain(d)).toBe(0);
    expect([...d.files.files.keys()]).toEqual([RESULT]);
    const text = d.files.files.get(RESULT);
    expect(text).toContain('| A1 |');
    expect(text).not.toContain('Chưa xong');
    expect(text).not.toContain(KEY);
    expect(d.files.rename).toHaveBeenCalledWith(PARTIAL, RESULT);
    const logged = d.log.mock.calls.map(([line]) => line).join('\n');
    expect(logged).not.toContain(KEY);
    expect(logged).toContain(RESULT);

    const other = deps({ argv: ['--model', 'kimi-k3'] });
    await evalMain(other);
    expect([...other.files.files.keys()]).toEqual(['docs/metrics/ai-eval-2026-10-12-kimi-k3.md']);
  });

  it('prints the result when the file cannot be written, so a paid run is not lost', async () => {
    const files = memoryFiles();
    files.rename.mockImplementation(() => {
      throw new Error('EACCES');
    });
    const d = deps({ files });
    expect(await evalMain(d)).toBe(1);
    const last = d.log.mock.calls.at(-1)[0];
    expect(last).toContain(`Không ghi được ${RESULT} (EACCES)`);
    expect(last).toContain('| A1 | Hồ sơ ACCEPTED trong ≤ 2 lần thử | 20/20 |');
    expect(last).not.toContain(KEY);
  });

  it('runs on when the .partial file cannot be written, saying so once', async () => {
    const files = memoryFiles();
    files.write.mockImplementation(() => {
      throw new Error('ENOSPC');
    });
    const d = deps({ files });
    expect(await evalMain(d)).toBe(1);
    expect(d.fetch).toHaveBeenCalledTimes(25);
    const lines = d.log.mock.calls.map(([line]) => line);
    expect(lines.filter((line) => line.includes(`Không ghi được ${PARTIAL}`))).toHaveLength(1);
  });
});
