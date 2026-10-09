/* global AbortSignal, Buffer */
// The AI eval of docs/golden/ai-eval.md (T-171 #413, spec Phase 5 §11), run by
// tools/eval-ai.mjs. Calls OpenCode as the Rust command `ai_complete` does (same URLs, headers,
// body, status codes) and the app's own flow from @p2c/ai (gate → prompt → validator → one
// retry). The key is only ever sent in the Authorization header: it is masked out of server
// messages and never written to the output or the result file.
//
// Everything here takes its I/O as arguments (fetch, clock, file system), so it is unit-tested in
// eval-ai-core.test.mjs without the network.

import {
  AI_MODELS,
  AI_REASONING_LEVELS,
  AiError,
  checkAnalysisAnswer,
  createAiRunner,
  DEFAULT_AI_MODEL,
  extractJson,
  runAnalysis,
  runExtraction,
  takeAnalysisInput,
  validateOutput,
} from '../packages/ai/src/index.ts';
import { formatIsoDate } from '../packages/domain/src/period.ts';
import { EVAL_NOTES, EVAL_PROFILES, EVAL_TODAY } from './fixtures/ai-eval.mjs';

/** The two fixed URLs of the Rust command (spec §5.1, P8). */
export const PLAN_URLS = {
  GO: 'https://opencode.ai/zen/go/v1/chat/completions',
  CREDIT: 'https://opencode.ai/zen/v1/chat/completions',
};

/** ai-eval.md §1: the Owner's reasoning level for the eval. */
const DEFAULT_REASONING = 'HIGH';
const TIMEOUT_MS = 120_000;
const MAX_BODY = 2 * 1024 * 1024;
/** Errors after which every later call fails the same way. */
const FATAL = new Set(['AI_UNAUTHORIZED', 'AI_RATE_LIMITED']);

/**
 * The key, plan, model and reasoning of a run, or `{ error }` with a message for the Owner; nothing
 * is called before this passes.
 */
export function readConfig(env, argv) {
  const key = (env.OPENCODE_GO_KEY ?? '').trim();
  if (key === '') {
    return { error: 'Thiếu biến môi trường OPENCODE_GO_KEY (key OpenCode) — không gọi gì.' };
  }
  const plan = env.OPENCODE_PLAN || 'GO';
  if (!Object.hasOwn(PLAN_URLS, plan)) {
    return { error: 'OPENCODE_PLAN chỉ nhận GO (mặc định) hoặc CREDIT — không gọi gì.' };
  }
  const options = { model: DEFAULT_AI_MODEL, reasoning: DEFAULT_REASONING };
  for (let i = 0; i < argv.length; i += 2) {
    const [name, value] = [argv[i], argv[i + 1]];
    if (name !== '--model' && name !== '--reasoning') {
      return { error: `Tham số không nhận: ${name} (chỉ có --model, --reasoning).` };
    }
    if (value === undefined) return { error: `${name} cần một giá trị.` };
    options[name.slice(2)] = value;
  }
  if (!AI_MODELS.some((model) => model.id === options.model)) {
    const ids = AI_MODELS.map((model) => model.id).join(', ');
    return { error: `Model ${options.model} không có trong app (${ids}).` };
  }
  if (!AI_REASONING_LEVELS.includes(options.reasoning)) {
    return {
      error: `Reasoning ${options.reasoning} không hợp lệ (${AI_REASONING_LEVELS.join(', ')}).`,
    };
  }
  return { key, plan, url: PLAN_URLS[plan], ...options };
}

/** The server's error message as Rust reads it: the key masked, `undefined` when empty. */
function serverMessage(text, key) {
  let message = text;
  try {
    const json = JSON.parse(text);
    message =
      [json?.error?.message, json?.error, json?.message].find((m) => typeof m === 'string') ?? text;
  } catch {
    // Not JSON: the body as text.
  }
  const masked = message.trim().replaceAll(key, '***');
  return masked === '' ? undefined : masked;
}

function readReply(status, text, key) {
  if (Buffer.byteLength(text) > MAX_BODY) throw new AiError('AI_BAD_RESPONSE');
  if (status < 200 || status > 299) {
    const code =
      status === 401 || status === 403
        ? 'AI_UNAUTHORIZED'
        : status === 402 || status === 429
          ? 'AI_RATE_LIMITED'
          : 'AI_HTTP';
    const message = serverMessage(text, key);
    throw new AiError(code, { httpStatus: status, ...(message && { serverMessage: message }) });
  }
  let content;
  let usage;
  try {
    const reply = JSON.parse(text);
    content = reply?.choices?.[0]?.message?.content;
    usage = reply?.usage;
  } catch {
    throw new AiError('AI_BAD_RESPONSE');
  }
  if (typeof content !== 'string') throw new AiError('AI_BAD_RESPONSE');
  const tokens = (name) => (Number.isInteger(usage?.[name]) ? usage[name] : 0);
  return {
    content,
    promptTokens: tokens('prompt_tokens'),
    completionTokens: tokens('completion_tokens'),
  };
}

/** An `AiAdapter` that posts what `ai_complete` posts (spec §5.1–§5.3), straight from Node. */
export function openCodeAdapter({ url, key, userAgent, fetch }) {
  return {
    async complete({ sessionId, model, reasoning, messages, maxTokens }) {
      const body = {
        model,
        messages: messages.map(({ role, content }) => ({ role, content })),
        max_tokens: maxTokens,
        ...(reasoning !== null && { reasoning_effort: reasoning.toLowerCase() }),
      };
      let status;
      let text;
      try {
        const response = await fetch(url, {
          method: 'POST',
          redirect: 'error',
          signal: AbortSignal.timeout(TIMEOUT_MS),
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
            'x-opencode-session': sessionId,
            'User-Agent': userAgent,
          },
          body: JSON.stringify(body),
        });
        status = response.status;
        text = await response.text();
      } catch (error) {
        throw new AiError(error?.name === 'TimeoutError' ? 'AI_TIMEOUT' : 'AI_NETWORK');
      }
      return readReply(status, text, key);
    },
  };
}

/** The facts sent, one line as ai-eval.md §4.1 writes them; "(MT)" marks a conflict. */
export function factLine(input) {
  return input.facts
    .map(
      ({ code, field, value, conflict }) => `${code} ${field}: ${value}${conflict ? ' (MT)' : ''}`,
    )
    .join(' · ');
}

/** Top-level blocks the answer left out that V1 asked for (#413: apart from other V1 issues). */
function missingBlocks(content, issues) {
  const json = extractJson(content);
  const parsed = json.found ? json.value : null;
  if (parsed === null || typeof parsed !== 'object') return [];
  return issues
    .filter(({ code, path }) => code === 'V1' && /^\w+$/.test(path) && !Object.hasOwn(parsed, path))
    .map(({ path }) => path);
}

/** An adapter that keeps each answer of the current conversation (tokens, content). */
function recording(adapter) {
  const calls = [];
  return {
    calls,
    adapter: {
      async complete(request) {
        const answer = await adapter.complete(request);
        calls.push(answer);
        return answer;
      },
    },
  };
}

const errorOf = ({ code, httpStatus, serverMessage }) => ({
  code,
  ...(httpStatus !== undefined && { httpStatus }),
  ...(serverMessage !== undefined && { serverMessage }),
});

function attemptsOf(calls, issuesOf) {
  return calls.map(({ content, promptTokens, completionTokens }, i) => {
    const issues = issuesOf(content, i);
    return {
      issues,
      missingBlocks: missingBlocks(content, issues),
      promptTokens,
      completionTokens,
    };
  });
}

const extractionIssues = (content) => {
  const json = extractJson(content);
  return validateOutput('extraction', json.found ? json.value : null);
};

/**
 * Whether a note's kept facts pass the script's part of ai-eval.md §5: each required line has a
 * fact of its trường whose quote holds a keyword (and the exact value when given); no fact is
 * forbidden. `missing` / `forbidden` name what failed.
 */
export function gradeNote(spec, facts) {
  const has = ({ fields, keywords, value }) =>
    facts.some(
      (fact) =>
        fields.includes(fact.field) &&
        keywords.some((word) => fact.quote.toLowerCase().includes(word.toLowerCase())) &&
        (value === undefined || fact.value === value),
    );
  const missing = spec.required
    .filter((line) => !has(line))
    .map(({ fields, keywords, value }) => {
      const names = fields.map((field) => `\`${field}\``).join(' / ');
      const words = keywords.map((word) => `"${word}"`).join(' / ');
      return `${names} — ${words}${value === undefined ? '' : ` = ${value}`}`;
    });
  const forbidden = spec.forbidden
    ? facts.filter(spec.forbidden.test).map((fact) => `\`${fact.field}\` = "${fact.value}"`)
    : [];
  return { missing, forbidden, pass: missing.length === 0 && forbidden.length === 0 };
}

/**
 * Runs E01–E20 then X01–X05 once each, one at a time, as the app would. An error is recorded and
 * the run goes on, except a key or limit error: every later call would fail too, so the rest is
 * `SKIPPED`. `log` gets one line per profile / note.
 */
export async function runEval({ adapter, settings, now, log }) {
  const runner = createAiRunner((error) => {
    throw error;
  });
  let stopped = false;
  const profiles = [];
  for (const spec of EVAL_PROFILES) {
    const input = takeAnalysisInput(spec, EVAL_TODAY);
    const base = { id: spec.id, mode: input.mode, expectedMode: spec.mode, input };
    if (stopped) {
      profiles.push({ ...base, status: 'SKIPPED', attempts: [], ms: 0 });
      continue;
    }
    const record = recording(adapter);
    const start = now();
    const result = await runAnalysis({
      runner,
      adapter: record.adapter,
      settings,
      customerId: spec.id,
      kycVersionId: `${spec.id}-v1`,
      profile: spec,
      today: EVAL_TODAY,
    });
    const ms = now() - start;
    let done;
    if (result.kind === 'record') {
      const { row } = result;
      const attempts = attemptsOf(record.calls, (_, i) => row.validator[i].errors);
      done = {
        ...base,
        status: row.status,
        attempts,
        ms,
        ...(row.status === 'ACCEPTED' ? { output: row.output } : { raw: row.rawOutput }),
      };
    } else {
      stopped = FATAL.has(result.code);
      // An answer before the error was checked as the app does it, but `row` is gone.
      const attempts = attemptsOf(
        record.calls,
        (content) => checkAnalysisAnswer(input, content).issues,
      );
      done = { ...base, status: 'ERROR', error: errorOf(result), attempts, ms };
    }
    profiles.push(done);
    log(`${done.id} ${done.mode} ${statusWord(done)} · ${tries(done)} · ${seconds(ms)}`);
  }

  const notes = [];
  for (const spec of EVAL_NOTES) {
    if (stopped) {
      notes.push({ id: spec.id, status: 'SKIPPED', attempts: [], ms: 0 });
      continue;
    }
    const record = recording(adapter);
    const start = now();
    const result = await runExtraction({
      runner,
      adapter: record.adapter,
      settings,
      note: spec.note,
    });
    const ms = now() - start;
    const attempts = attemptsOf(record.calls, extractionIssues);
    let done;
    if (result.kind === 'facts') {
      const kept = result.facts;
      done = {
        id: spec.id,
        status: 'OK',
        attempts,
        ms,
        kept,
        dropped: result.dropped,
        grade: gradeNote(spec, kept),
      };
    } else if (result.kind === 'invalid') {
      done = { id: spec.id, status: 'INVALID', attempts, ms, raw: record.calls.at(-1).content };
    } else {
      stopped = FATAL.has(result.code);
      done = { id: spec.id, status: 'ERROR', error: errorOf(result), attempts, ms };
    }
    notes.push(done);
    log(`${done.id} extraction ${statusWord(done)} · ${tries(done)} · ${seconds(ms)}`);
  }
  return { profiles, notes };
}

// ---- the result file ----------------------------------------------------------

const STATUS_WORDS = { SKIPPED: 'KHÔNG CHẠY', INVALID: 'KHÔNG ĐỌC ĐƯỢC' };

function statusWord(done) {
  if (done.status !== 'ERROR') return STATUS_WORDS[done.status] ?? done.status;
  const { code, httpStatus, serverMessage } = done.error;
  const http =
    httpStatus === undefined
      ? ''
      : ` (HTTP ${httpStatus}${serverMessage ? `: ${serverMessage}` : ''})`;
  return `LỖI \`${code}\`${http}`;
}

const tries = (done) => `${done.attempts.length} lần thử`;
const seconds = (ms) => `${(ms / 1000).toFixed(1)} s`;
const cell = (text) => text.replaceAll('|', '\\|').replace(/\s*\n\s*/g, ' ');
const sum = (attempts, key) => attempts.reduce((total, attempt) => total + attempt[key], 0);
const tokens = (attempts) =>
  `${sum(attempts, 'promptTokens')} / ${sum(attempts, 'completionTokens')}`;
const time = (done) => (done.status === 'SKIPPED' ? '—' : seconds(done.ms));

function issuesCell(attempts) {
  const parts = attempts
    .map((attempt, i) => [i, attempt.issues])
    .filter(([, issues]) => issues.length > 0)
    .map(
      ([i, issues]) => `lần ${i + 1}: ${issues.map((x) => `${x.code} \`${x.path}\``).join(', ')}`,
    );
  return parts.length === 0 ? '—' : parts.join(' · ');
}

/** A fence longer than any run of backticks in `text`. */
function fenced(text, language) {
  const longest = Math.max(2, ...[...text.matchAll(/`+/g)].map(([run]) => run.length));
  const fence = '`'.repeat(longest + 1);
  return `${fence}${language}\n${text}\n${fence}`;
}

function issueLines(attempts) {
  return attempts.flatMap((attempt, i) =>
    attempt.issues.map(
      ({ code, path, detail }) => `- lần ${i + 1}: ${code} \`${path}\`: ${detail}`,
    ),
  );
}

function profileDetails(done) {
  const { input } = done;
  const lines = [`<details><summary>${done.id} — ${done.mode} · ${done.status}</summary>`, ''];
  lines.push(`Đầu vào: ${factLine(input) || '—'}`, '');
  if (input.missingCategories?.length) {
    lines.push(`Hạng mục thiếu: ${input.missingCategories.map((c) => c.label).join(', ')}`, '');
  }
  if (input.conflictWarnings?.length) {
    lines.push(`Cảnh báo mâu thuẫn: ${input.conflictWarnings.join(', ')}`, '');
  }
  const issues = issueLines(done.attempts);
  if (issues.length > 0) lines.push('Lỗi validator:', '', ...issues, '');
  if (done.status === 'ACCEPTED') lines.push(fenced(JSON.stringify(done.output, null, 2), 'json'));
  if (done.status === 'REJECTED') lines.push('Trả lời cuối:', '', fenced(done.raw, 'text'));
  if (done.status === 'ERROR') lines.push(statusWord(done));
  if (done.status === 'SKIPPED') lines.push('Không chạy (dừng sau lỗi key / giới hạn).');
  lines.push('', '</details>', '');
  return lines;
}

function noteDetails(done) {
  const kept = done.kept?.length ?? 0;
  const lines = [
    `<details><summary>${done.id} — ${STATUS_WORDS[done.status] ?? done.status} · ${kept} đề xuất</summary>`,
    '',
    `Ghi chú: ${EVAL_NOTES.find((spec) => spec.id === done.id).note}`,
    '',
  ];
  if (done.status === 'OK' && kept === 0) lines.push('Không có đề xuất.');
  for (const { field, value, quote } of done.kept ?? []) {
    lines.push(`- \`${field}\` = ${JSON.stringify(value)} — trích: "${quote}"`);
  }
  for (const { code, path, detail } of done.dropped ?? []) {
    lines.push(`- ${code} \`${path}\`: ${detail}`);
  }
  const issues = issueLines(done.attempts);
  if (issues.length > 0) lines.push('', 'Lỗi validator:', '', ...issues);
  if (done.status === 'INVALID') lines.push('', 'Trả lời cuối:', '', fenced(done.raw, 'text'));
  if (done.status === 'ERROR') lines.push(statusWord(done));
  if (done.status === 'SKIPPED') lines.push('Không chạy (dừng sau lỗi key / giới hạn).');
  lines.push('', '</details>', '');
  return lines;
}

const verdict = (pass) => (pass ? '**ĐẠT**' : '**TRƯỢT**');

/** The result file `docs/metrics/ai-eval-<yyyy-mm-dd>.md`: A1–A4, the notes, the Owner's part. */
export function formatReport({ profiles, notes }, { plan, model, reasoning, day }) {
  const accepted = profiles.filter((p) => p.status === 'ACCEPTED').length;
  const rightMode = profiles.filter((p) => p.mode === p.expectedMode).length;
  const blocks = [...profiles, ...notes].flatMap((done) =>
    done.attempts
      .map((attempt, i) => [i, attempt.missingBlocks])
      .filter(([, missing]) => missing.length > 0)
      .map(
        ([i, missing]) => `${done.id} lần ${i + 1}: ${missing.map((b) => `\`${b}\``).join(', ')}`,
      ),
  );
  const all = [...profiles, ...notes];
  const allAttempts = all.flatMap((done) => done.attempts);
  const totalMs = all.reduce((total, done) => total + done.ms, 0);
  const notesPassed = notes.filter((n) => n.grade?.pass).length;

  const lines = [
    `# Eval AI — ${formatIsoDate(day)}`,
    '',
    `- Lệnh \`pnpm eval:ai\` · gói \`${plan}\` · model \`${model}\` · reasoning \`${reasoning}\``,
    `- Bộ eval \`docs/golden/ai-eval.md\` (E01–E20, X01–X05) · ngày phân tích ${formatIsoDate(EVAL_TODAY)} · prompt \`analysis@1\`, \`discovery@1\`, \`extraction@1\``,
    '- Mỗi hồ sơ / ghi chú chạy một lần, tối đa 2 lần thử như app. File do script sinh; phần "Đọc tay" Owner điền.',
    '',
    '## Tổng hợp (tự động)',
    '',
    '| Mã | Đo | Kết quả | Ngưỡng |',
    '|---|---|---|---|',
    `| A1 | Hồ sơ ACCEPTED trong ≤ 2 lần thử | ${accepted}/20 | ≥ 18/20 — ${verdict(accepted >= 18)} |`,
    `| A2 | Chế độ gửi đi đúng cột "Chế độ" | ${rightMode}/20 | 20/20 — ${verdict(rightMode === 20)} |`,
    `| A3 | Lần thử V1 trượt vì thiếu khóa khối | ${blocks.length === 0 ? '0' : `${blocks.length} (${blocks.join('; ')})`} | ghi nhận |`,
    `| A4 | Token vào / ra, thời gian (tổng E01–E20, X01–X05) | ${tokens(allAttempts)} · ${seconds(totalMs)} | ghi nhận |`,
    `| X | Ghi chú đạt phần script | ${notesPassed}/5 | ≥ 4/5, cùng phần đọc tay của Owner |`,
    '',
    '## Hồ sơ E01–E20',
    '',
    '| Mã | Chế độ | Kết quả | Lần thử | Lỗi validator (mã + đường dẫn) | Token vào / ra | Thời gian |',
    '|---|---|---|---|---|---|---|',
    ...profiles.map((p) => {
      const mode = p.mode === p.expectedMode ? p.mode : `${p.mode} ≠ ${p.expectedMode}`;
      return `| ${p.id} | ${mode} | ${cell(statusWord(p))} | ${p.attempts.length} | ${cell(issuesCell(p.attempts))} | ${tokens(p.attempts)} | ${time(p)} |`;
    }),
    '',
    '## Ghi chú X01–X05',
    '',
    'Script chấm V1, `field` + từ khóa trong `quote`, giá trị `childrenCount` / `hasProtection` và cột "Không được có", trên đề xuất còn lại sau V7. Giá trị chữ Owner đọc tay.',
    '',
    '| Mã | Kết quả | Lần thử | Phải có | Không được có | V7 bỏ | Token vào / ra | Thời gian | Script |',
    '|---|---|---|---|---|---|---|---|---|',
    ...notes.map((n) => {
      const required = n.grade
        ? n.grade.missing.length
          ? `thiếu ${n.grade.missing.join('; ')}`
          : 'đủ'
        : '—';
      const forbidden = n.grade?.forbidden.length ? n.grade.forbidden.join('; ') : '—';
      return `| ${n.id} | ${cell(statusWord(n))} | ${n.attempts.length} | ${cell(required)} | ${cell(forbidden)} | ${n.dropped?.length ?? 0} | ${tokens(n.attempts)} | ${time(n)} | ${verdict(n.grade?.pass)} |`;
    }),
    '',
    '## Đọc tay (Owner)',
    '',
    'Trên output ACCEPTED ở dưới, theo `docs/golden/ai-eval.md` §2.2 và §5. Chỉ R1 là ngưỡng (0 vi phạm).',
    '',
    '| Mã | Kiểm | Kết quả (mã hồ sơ + ghi chú) |',
    '|---|---|---|',
    '| R1 | Không vi phạm V3–V6 lọt qua validator | |',
    '| R2 | Không bịa, không dùng dữ kiện cũ (E09) | |',
    '| R3 | Giả thuyết viết "có thể…" | |',
    '| R4 | Mâu thuẫn phụ → làm rõ từng trường, trích đủ mã | |',
    '| R5 | Discovery: mỗi hạng mục thiếu có ≥ 1 `missingCategory` | |',
    '| R6 | `personalityNotes` đúng `system`, có bằng chứng, nhãn không lọt sang khối khác | |',
    '| R7 | Không đề xuất sản phẩm / việc tự động; ý pháp lý → "cần chuyên gia pháp lý xác nhận" | |',
    '| X | Giá trị chữ của đề xuất trích xuất đúng ý (X01, X02, X04, X05) | |',
    '',
    '## Output hồ sơ',
    '',
    ...profiles.flatMap(profileDetails),
    '## Output ghi chú',
    '',
    ...notes.flatMap(noteDetails),
  ];
  return `${lines.join('\n').trimEnd()}\n`;
}

/**
 * The whole command: reads the config, refuses to overwrite a result, runs, writes the file.
 * Returns the exit code; nothing is called before the config and the file name pass.
 */
export async function evalMain({ env, argv, fetch, now, day, userAgent, exists, writeFile, log }) {
  const config = readConfig(env, argv);
  if (config.error) {
    log(config.error);
    return 1;
  }
  const suffix = config.model === DEFAULT_AI_MODEL ? '' : `-${config.model}`;
  const path = `docs/metrics/ai-eval-${formatIsoDate(day)}${suffix}.md`;
  if (exists(path)) {
    log(`${path} đã có — không ghi đè kết quả của một lần chạy. Xóa hoặc đổi tên rồi chạy lại.`);
    return 1;
  }
  const { key, plan, url, model, reasoning } = config;
  log(`Eval AI: gói ${plan}, model ${model}, reasoning ${reasoning}.`);
  const adapter = openCodeAdapter({ url, key, userAgent, fetch });
  const settings = { provider: 'OPENCODE_GO', opencodePlan: plan, model, reasoning };
  const results = await runEval({ adapter, settings, now, log });
  writeFile(path, formatReport(results, { plan, model, reasoning, day }));
  log(`Đã ghi ${path}.`);
  return 0;
}
