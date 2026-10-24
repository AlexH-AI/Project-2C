/* global AbortSignal, Buffer */
// The AI eval of docs/golden/ai-eval.md (T-171 #413, spec Phase 5 §11), run by
// tools/eval-ai.mjs. Calls OpenCode as the Rust command `ai_complete` does (same URLs, headers,
// body, status codes, reading of the reply) and the app's own flow from @p2c/ai (gate → prompt →
// validator → one retry). The key is only ever sent in the Authorization header. As in Rust, a
// reply that holds it (as it is, in JSON escapes or a URL's `%XX`) is `AI_BAD_RESPONSE`, and it is
// masked out of server messages in any of those forms, so it never reaches the output, the
// `.partial` file or the result file (DR6-55).
//
// Everything here takes its I/O as arguments (fetch, clock, file system), so it is unit-tested in
// eval-ai-core.test.mjs without the network.

import {
  ANALYSIS_PROMPTS,
  checkAnalysisAnswer,
  takeAnalysisInput,
} from '../packages/ai/src/analysis-steps.ts';
import { checkAnswer } from '../packages/ai/src/attempts.ts';
import {
  AI_MODELS,
  AI_REASONING_LEVELS,
  AiError,
  createAiRunner,
  DEFAULT_AI_MODEL,
  extractJson,
  runAnalysis,
  runExtraction,
  validateOutput,
} from '../packages/ai/src/index.ts';
import { extractionPrompt } from '../packages/ai/src/prompts/extraction.ts';
import { formatIsoDate } from '../packages/domain/src/period.ts';
import { collapseSpaces } from '../packages/domain/src/text.ts';
import { EVAL_NOTES, EVAL_PROFILES, EVAL_TODAY } from './fixtures/ai-eval.mjs';

/** The two fixed URLs of the Rust command (spec §5.1, P8). */
export const PLAN_URLS = {
  GO: 'https://opencode.ai/zen/go/v1/chat/completions',
  CREDIT: 'https://opencode.ai/zen/v1/chat/completions',
};

/** ai-eval.md §1: the Owner's reasoning level for the eval. */
const DEFAULT_REASONING = 'HIGH';
/** For the whole call; connecting has 10 s of its own (Node's fetch default), as in Rust. */
const TIMEOUT_MS = 120_000;
/** The most of a reply body taken: one byte past it is read, no more, as Rust reads it. */
const MAX_BODY = 2 * 1024 * 1024;
/** The most of the server's error message kept, in characters, as Rust cuts it. */
const MAX_SERVER_MESSAGE = 200;
/** A `finish_reason` passed on: a word of lowercase letters and `_`, as Rust's `is_finish_word`. */
const FINISH_WORD = /^[a-z_]{1,32}$/;
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

// ---- the key in a reply, read as Rust's `reveals` and `mask` read it (DR6-10, DR6-55) ----------

/** JSON's escapes (`\uXXXX`, `\"`, `\\`, `\/`, `\n`…) and a URL's `%XX`. */
const ESCAPE = /\\u[0-9a-fA-F]{4}|\\["\\/bfnrt]|%[0-9a-fA-F]{2}/g;
/** JSON's escapes alone. */
const JSON_ESCAPE = /\\u[0-9a-fA-F]{4}|\\["\\/bfnrt]/g;

/** The character of an escape; a `%XX` is a byte, so `%C4%83` gives two (the secrets are ASCII). */
const decode = (escape) =>
  escape[0] === '%'
    ? String.fromCharCode(Number.parseInt(escape.slice(1), 16))
    : JSON.parse(`"${escape}"`);

/**
 * One pass over a reading, from the left as `JSON.parse` reads: each `escape` (all of `ESCAPE`, or
 * `JSON_ESCAPE`) gives the character it stands for, which comes from the whole escape; the rest is
 * kept (Rust's `unescape`). A reading is a `text` and, for each of its UTF-16 units, the `start` and
 * `end` of the part of the first text it came from.
 */
function unescape(reading, escape = ESCAPE) {
  const out = { text: '', start: [], end: [] };
  let kept = 0;
  const keep = (to) => {
    out.text += reading.text.slice(kept, to);
    for (let i = kept; i < to; i += 1) {
      out.start.push(reading.start[i]);
      out.end.push(reading.end[i]);
    }
  };
  for (const { 0: found, index } of reading.text.matchAll(escape)) {
    keep(index);
    out.text += decode(found);
    out.start.push(reading.start[index]);
    out.end.push(reading.end[index + found.length - 1]);
    kept = index + found.length;
  }
  keep(reading.text.length);
  return out;
}

/**
 * The ways `text` may give a secret away, as Rust's `readings` (DR6-10, DR6-76): as it is, with
 * every escape undone once and twice, and with JSON's alone undone once. A pass undoes the outer
 * layer of each part of the text, so a secret whose parts are each in up to two layers, of the same
 * kind or not, in either order and each its own way, shows in the third reading. Three layers are
 * out of reach (ADR-0009 D-1). The tests prove it for secrets with no `\` or `%` of their own, as
 * OpenCode's keys and the session id are: a pass may undo those too. Such a secret still shows as
 * it is and in one layer of each kind: `JSON.stringify` leaves its `%XX` as they are, and so does
 * the last reading.
 */
function readings(text) {
  const units = Array.from({ length: text.length }, (_, i) => i);
  const plain = { text, start: units, end: units.map((i) => i + 1) };
  const once = unescape(plain);
  return [plain, once, unescape(once), unescape(plain, JSON_ESCAPE)];
}

/** Whether `text` holds `key` in one of its readings. */
const reveals = (text, key) =>
  key !== '' && readings(text).some((reading) => reading.text.includes(key));

/** `text` with each whole `secret` replaced by `***`, in any of its readings, as Rust's `mask`. */
function mask(text, secret) {
  const found = [];
  for (const { text: read, start, end } of readings(text)) {
    for (let at = read.indexOf(secret); at !== -1; at = read.indexOf(secret, at + secret.length)) {
      found.push([start[at], end[at + secret.length - 1]]);
    }
  }
  found.sort(([a], [b]) => a - b);
  let masked = '';
  let copied = 0;
  for (const [from, to] of found) {
    // One that overlaps the last one masked (another reading of it) is masked with it.
    if (from >= copied) masked += `${text.slice(copied, from)}***`;
    copied = Math.max(copied, to);
  }
  return masked + text.slice(copied);
}

/**
 * The server's error message as Rust reads it (spec §5.3): only `error.message`, `error` or
 * `message` of a JSON body, never the body as it is; the secrets masked before the cut to 200
 * characters (by code point); `undefined` when there is none.
 */
function serverMessage(text, secrets) {
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    return undefined;
  }
  const message = [json?.error?.message, json?.error, json?.message].find(
    (m) => typeof m === 'string',
  );
  if (message === undefined) return undefined;
  const masked = secrets
    .filter((secret) => secret !== '')
    .reduce((masking, secret) => mask(masking, secret), message.trim());
  const cut = Array.from(masked).slice(0, MAX_SERVER_MESSAGE).join('');
  return cut === '' ? undefined : cut;
}

const isOk = (status) => status >= 200 && status <= 299;

/** The body, read to one byte past `MAX_BODY` and no further (Rust's `take(MAX_BODY + 1)`). */
async function readBody(response) {
  const chunks = [];
  let size = 0;
  if (response.body !== null) {
    const reader = response.body.getReader();
    while (size <= MAX_BODY) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      size += value.byteLength;
    }
    if (size > MAX_BODY) await reader.cancel().catch(() => {});
  }
  return Buffer.concat(chunks).subarray(0, MAX_BODY + 1);
}

const transportError = (error) =>
  new AiError(error?.name === 'TimeoutError' ? 'AI_TIMEOUT' : 'AI_NETWORK');

/** A reply as Rust's `reply` reads it, `key` and `session` masked out of the server's message. */
function readReply(status, bytes, key, session) {
  if (!isOk(status)) {
    const code =
      status === 401 || status === 403
        ? 'AI_UNAUTHORIZED'
        : status === 402 || status === 429
          ? 'AI_RATE_LIMITED'
          : 'AI_HTTP';
    const message = serverMessage(bytes.toString('utf8'), [key, session]);
    throw new AiError(code, { httpStatus: status, ...(message && { serverMessage: message }) });
  }
  if (bytes.length > MAX_BODY) throw new AiError('AI_BAD_RESPONSE');
  let reply;
  try {
    reply = JSON.parse(bytes.toString('utf8'));
  } catch {
    throw new AiError('AI_BAD_RESPONSE');
  }
  const choice = reply?.choices?.[0];
  const reason = choice?.finish_reason;
  // No content at all, cut by `max_tokens` (a reasoning model that spent them all): an empty
  // answer that says `length`, which the app reads as cut (R2-16, DR6-56).
  const content = choice?.message?.content ?? (reason === 'length' ? '' : undefined);
  // The key never reaches the app, nor here the output or the result file (DR6-55).
  if (typeof content !== 'string' || reveals(content, key)) throw new AiError('AI_BAD_RESPONSE');
  // A count, or `null` as Rust's `as_u64` gives for anything else (missing, negative, a fraction).
  const tokens = (name) => {
    const count = reply?.usage?.[name];
    return Number.isSafeInteger(count) && count >= 0 ? count : null;
  };
  return {
    content,
    promptTokens: tokens('prompt_tokens'),
    completionTokens: tokens('completion_tokens'),
    finishReason:
      typeof reason === 'string' && FINISH_WORD.test(reason) && !reveals(reason, key)
        ? reason
        : null,
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
      let response;
      try {
        response = await fetch(url, {
          method: 'POST',
          // No redirect is followed: a 3xx is a reply, `AI_HTTP` as in Rust.
          redirect: 'manual',
          signal: AbortSignal.timeout(TIMEOUT_MS),
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
            'x-opencode-session': sessionId,
            'User-Agent': userAgent,
          },
          body: JSON.stringify(body),
        });
      } catch (error) {
        throw transportError(error);
      }
      let bytes;
      try {
        bytes = await readBody(response);
      } catch (error) {
        // An error status is known from the head alone: kept, with no message, as in Rust.
        if (isOk(response.status)) throw transportError(error);
        bytes = Buffer.alloc(0);
      }
      return readReply(response.status, bytes, key, sessionId);
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
function missingBlocks(content, cut, issues) {
  const json = extractJson(content, { cut });
  const parsed = json.found ? json.value : null;
  if (parsed === null || typeof parsed !== 'object') return [];
  return issues
    .filter(({ code, path }) => code === 'V1' && /^\w+$/.test(path) && !Object.hasOwn(parsed, path))
    .map(({ path }) => path);
}

/**
 * An adapter that keeps each call of the current conversation: its answer (content, tokens, finish
 * reason), or `{ failed }` with the code of a call that failed, which counts as an attempt too.
 */
function recording(adapter) {
  const calls = [];
  return {
    calls,
    adapter: {
      async complete(request) {
        try {
          const answer = await adapter.complete(request);
          calls.push(answer);
          return answer;
        } catch (error) {
          calls.push({ failed: error instanceof AiError ? error.code : 'SCRIPT' });
          throw error;
        }
      },
    },
  };
}

const errorOf = ({ code, httpStatus, serverMessage, message }) => ({
  code,
  ...(httpStatus !== undefined && { httpStatus }),
  ...(serverMessage !== undefined && { serverMessage }),
  ...(message !== undefined && { message }),
});

/** Each call as an attempt; `issuesOf(content, cut, i)`, `cut` when `maxTokens` cut it, as the app. */
function attemptsOf(calls, issuesOf) {
  return calls.map(({ failed, content, finishReason, promptTokens, completionTokens }, i) => {
    if (failed !== undefined) {
      return { failed, issues: [], missingBlocks: [], promptTokens: null, completionTokens: null };
    }
    const cut = finishReason === 'length';
    const issues = issuesOf(content, cut, i);
    return {
      issues,
      missingBlocks: missingBlocks(content, cut, issues),
      promptTokens,
      completionTokens,
    };
  });
}

const extractionIssues = (content, cut) =>
  checkAnswer(content, (parsed) => validateOutput('extraction', parsed), cut).issues;

/** Text as V7 reads a quote (`collapseSpaces`, as `validator.ts` does), in lower case. */
const fold = (text) => collapseSpaces(String(text)).toLowerCase();

/**
 * Whether a note's kept facts pass the script's part of ai-eval.md §5: each required line has a
 * fact of its trường whose quote holds a keyword (and the exact value when given); no fact is
 * forbidden. Quotes and keywords are compared folded (`fold`); `forbidden.test` gets each fact with
 * a text value folded. `missing` / `forbidden` name what failed.
 */
export function gradeNote(spec, facts) {
  const has = ({ fields, keywords, value }) =>
    facts.some(
      (fact) =>
        fields.includes(fact.field) &&
        keywords.some((word) => fold(fact.quote).includes(fold(word))) &&
        (value === undefined || fact.value === value),
    );
  const missing = spec.required
    .filter((line) => !has(line))
    .map(({ fields, keywords, value }) => {
      const names = fields.map((field) => `\`${field}\``).join(' / ');
      const words = keywords.map((word) => `"${word}"`).join(' / ');
      return `${names} — ${words}${value === undefined ? '' : ` = ${value}`}`;
    });
  const folded = (fact) =>
    typeof fact.value === 'string' ? { ...fact, value: fold(fact.value) } : fact;
  const forbidden = spec.forbidden
    ? facts
        .filter((fact) => spec.forbidden.test(folded(fact)))
        .map((fact) => `\`${fact.field}\` = "${plain(fact.value)}"`)
    : [];
  return { missing, forbidden, pass: missing.length === 0 && forbidden.length === 0 };
}

/**
 * A thrown error is a bug of the script or the app, not an answer of the model: it becomes the
 * result of that one profile / note, so the run goes on and the paid answers are still written.
 */
async function settle(run) {
  try {
    return await run();
  } catch (error) {
    return { kind: 'error', code: 'SCRIPT', message: String(error?.message ?? error) };
  }
}

/**
 * Runs E01–E20 then X01–X05 once each, one at a time, as the app would. An error is recorded and
 * the run goes on, except a key or limit error: every later call would fail too, so the rest is
 * `SKIPPED`. A profile the gate blocks is `BLOCKED`, with no call. `log` gets one line per profile /
 * note, `onItem` the results so far after each one.
 */
export async function runEval({
  adapter,
  settings,
  now,
  log,
  onItem = () => {},
  profileSpecs = EVAL_PROFILES,
  noteSpecs = EVAL_NOTES,
}) {
  const runner = createAiRunner((error) => {
    throw error;
  });
  let stopped = false;
  const profiles = [];
  const notes = [];
  const add = (list, item) => {
    list.push(item);
    onItem({ profiles, notes });
  };
  for (const spec of profileSpecs) {
    const input = takeAnalysisInput(spec, EVAL_TODAY);
    if ('kind' in input) {
      const blocked = { id: spec.id, mode: '—', expectedMode: spec.mode, input: null };
      add(profiles, { ...blocked, status: 'BLOCKED', state: input.state, attempts: [], ms: 0 });
      log(`${spec.id} ${statusWord(profiles.at(-1))}`);
      continue;
    }
    const base = { id: spec.id, mode: input.mode, expectedMode: spec.mode, input };
    if (stopped) {
      add(profiles, { ...base, status: 'SKIPPED', attempts: [], ms: 0 });
      continue;
    }
    const record = recording(adapter);
    const start = now();
    const result = await settle(() =>
      runAnalysis({
        runner,
        adapter: record.adapter,
        settings,
        customerId: spec.id,
        kycVersionId: `${spec.id}-v1`,
        profile: spec,
        today: EVAL_TODAY,
      }),
    );
    const ms = now() - start;
    let done;
    if (result.kind === 'record') {
      const { row } = result;
      const attempts = attemptsOf(record.calls, (_, __, i) => row.validator[i].errors);
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
        (content, cut) => checkAnalysisAnswer(input, content, cut).issues,
      );
      done = { ...base, status: 'ERROR', error: errorOf(result), attempts, ms };
    }
    add(profiles, done);
    log(`${done.id} ${done.mode} ${statusWord(done)} · ${tries(done)} · ${seconds(ms)}`);
  }

  for (const spec of noteSpecs) {
    const base = { id: spec.id, note: spec.note };
    if (stopped) {
      add(notes, { ...base, status: 'SKIPPED', attempts: [], ms: 0 });
      continue;
    }
    const record = recording(adapter);
    const start = now();
    const result = await settle(() =>
      runExtraction({ runner, adapter: record.adapter, settings, note: spec.note }),
    );
    const ms = now() - start;
    const attempts = attemptsOf(record.calls, extractionIssues);
    let done;
    if (result.kind === 'facts') {
      const kept = result.facts;
      done = {
        ...base,
        status: 'OK',
        attempts,
        ms,
        kept,
        dropped: result.dropped,
        grade: gradeNote(spec, kept),
      };
    } else if (result.kind === 'invalid') {
      done = { ...base, status: 'INVALID', attempts, ms, raw: record.calls.at(-1).content };
    } else {
      stopped = FATAL.has(result.code);
      done = { ...base, status: 'ERROR', error: errorOf(result), attempts, ms };
    }
    add(notes, done);
    log(`${done.id} extraction ${statusWord(done)} · ${tries(done)} · ${seconds(ms)}`);
  }
  return { profiles, notes };
}

// ---- the result file ----------------------------------------------------------

const STATUS_WORDS = { SKIPPED: 'KHÔNG CHẠY', INVALID: 'KHÔNG ĐỌC ĐƯỢC' };

/** Text from outside (the server, the model) as plain text in Markdown: no HTML gets through. */
const plain = (text) =>
  String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
/** A table cell: no `|` or line break of the text ends it. */
const cell = (text) => text.replaceAll('|', '\\|').replace(/\s*\n\s*/g, ' ');
/** Text from outside on one line of the file, in a table or not. */
const inline = (text) => cell(plain(text));

function statusWord(done) {
  if (done.status === 'BLOCKED') return `CỔNG CHẶN (\`${done.state}\`)`;
  if (done.status !== 'ERROR') return STATUS_WORDS[done.status] ?? done.status;
  const { code, httpStatus, serverMessage, message } = done.error;
  if (code === 'SCRIPT') return `LỖI script: ${plain(message)}`;
  const http =
    httpStatus === undefined
      ? ''
      : ` (HTTP ${httpStatus}${serverMessage ? `: ${plain(serverMessage)}` : ''})`;
  return `LỖI \`${code}\`${http}`;
}

const tries = (done) => `${done.attempts.length} lần thử`;
const seconds = (ms) => `${(ms / 1000).toFixed(1)} s`;
/** The counts known, `+?` after them when an attempt has none (a failed call, no `usage`). */
function sum(attempts, key) {
  const counts = attempts.map((attempt) => attempt[key]);
  const known = counts.reduce((total, count) => total + (count ?? 0), 0);
  return counts.includes(null) ? `${known}+?` : `${known}`;
}
const tokens = (attempts) =>
  `${sum(attempts, 'promptTokens')} / ${sum(attempts, 'completionTokens')}`;
const time = (done) => (['SKIPPED', 'BLOCKED'].includes(done.status) ? '—' : seconds(done.ms));

function issuesCell(attempts) {
  const parts = attempts
    .map((attempt, i) => [i, attempt])
    .filter(([, attempt]) => attempt.failed !== undefined || attempt.issues.length > 0)
    .map(([i, { failed, issues }]) =>
      failed === undefined
        ? `lần ${i + 1}: ${issues.map((x) => `${x.code} \`${x.path}\``).join(', ')}`
        : `lần ${i + 1}: lỗi`,
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
      ({ code, path, detail }) => `- lần ${i + 1}: ${code} \`${path}\`: ${inline(detail)}`,
    ),
  );
}

function profileDetails(done) {
  const { input } = done;
  const lines = [`<details><summary>${done.id} — ${done.mode} · ${done.status}</summary>`, ''];
  if (input === null) {
    lines.push(`${statusWord(done)}: không gọi AI.`, '', '</details>', '');
    return lines;
  }
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
  if (done.status === 'ERROR') lines.push(cell(statusWord(done)));
  if (done.status === 'SKIPPED') lines.push('Không chạy (dừng sau lỗi key / giới hạn).');
  lines.push('', '</details>', '');
  return lines;
}

function noteDetails(done) {
  const kept = done.kept?.length ?? 0;
  const lines = [
    `<details><summary>${done.id} — ${STATUS_WORDS[done.status] ?? done.status} · ${kept} đề xuất</summary>`,
    '',
    `Ghi chú: ${done.note}`,
    '',
  ];
  if (done.status === 'OK' && kept === 0) lines.push('Không có đề xuất.');
  for (const { field, value, quote } of done.kept ?? []) {
    lines.push(`- \`${field}\` = ${inline(JSON.stringify(value))} — trích: "${inline(quote)}"`);
  }
  for (const { code, path, detail } of done.dropped ?? []) {
    lines.push(`- ${code} \`${path}\`: ${inline(detail)}`);
  }
  const issues = issueLines(done.attempts);
  if (issues.length > 0) lines.push('', 'Lỗi validator:', '', ...issues);
  if (done.status === 'INVALID') lines.push('', 'Trả lời cuối:', '', fenced(done.raw, 'text'));
  if (done.status === 'ERROR') lines.push(cell(statusWord(done)));
  if (done.status === 'SKIPPED') lines.push('Không chạy (dừng sau lỗi key / giới hạn).');
  lines.push('', '</details>', '');
  return lines;
}

/** The thresholds of ai-eval.md §2.1 (A1, spec §11) and §5. */
const MIN_ACCEPTED = 18;
const MIN_NOTES_PASSED = 4;

const verdict = (pass) => (pass ? '**ĐẠT**' : '**TRƯỢT**');

/**
 * The result file `docs/metrics/ai-eval-<yyyy-mm-dd>.md`: A1–A4, the notes, the Owner's part.
 * `partial`: the items done so far of a run going on, or stopped.
 */
export function formatReport(
  { profiles, notes },
  { plan, model, reasoning, day, partial = false },
) {
  const total = profiles.length;
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
  const prompts = [ANALYSIS_PROMPTS.analysis, ANALYSIS_PROMPTS.discovery, extractionPrompt]
    .map(({ version }) => `\`${version}\``)
    .join(', ');

  const lines = [
    `# Eval AI — ${formatIsoDate(day)}`,
    '',
    ...(partial
      ? [
          `- **Chưa xong:** ${all.length} mục đã chạy của một lượt đang chạy hoặc bị ngắt; các ngưỡng chưa có nghĩa.`,
        ]
      : []),
    `- Lệnh \`pnpm eval:ai\` · gói \`${plan}\` · model \`${model}\` · reasoning \`${reasoning}\``,
    `- Bộ eval \`docs/golden/ai-eval.md\` (E01–E20, X01–X05) · ngày phân tích ${formatIsoDate(EVAL_TODAY)} · prompt ${prompts}`,
    '- Mỗi hồ sơ / ghi chú chạy một lần, tối đa 2 lần thử như app; một lần gọi lỗi cũng là một lần thử. Token `+?`: có lần thử không biết token. File do script sinh; phần "Đọc tay" Owner điền.',
    ...(all.some((done) => done.error?.serverMessage)
      ? [
          '- Có thông điệp lỗi của server trong file (đã che key): đọc lại trước khi commit, repo public.',
        ]
      : []),
    '',
    '## Tổng hợp (tự động)',
    '',
    '| Mã | Đo | Kết quả | Ngưỡng |',
    '|---|---|---|---|',
    `| A1 | Hồ sơ ACCEPTED trong ≤ 2 lần thử | ${accepted}/${total} | ≥ ${MIN_ACCEPTED}/${total} — ${verdict(accepted >= MIN_ACCEPTED)} |`,
    `| A2 | Chế độ gửi đi đúng cột "Chế độ" | ${rightMode}/${total} | ${total}/${total} — ${verdict(rightMode === total)} |`,
    `| A3 | Lần thử V1 trượt vì thiếu khóa khối | ${blocks.length === 0 ? '0' : `${blocks.length} (${blocks.join('; ')})`} | ghi nhận |`,
    `| A4 | Token vào / ra, thời gian (tổng E01–E20, X01–X05) | ${tokens(allAttempts)} · ${seconds(totalMs)} | ghi nhận |`,
    `| X | Ghi chú đạt phần script | ${notesPassed}/${notes.length} | ≥ ${MIN_NOTES_PASSED}/${notes.length}, cùng phần đọc tay của Owner |`,
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

/** Creates `path` only when it is not there (the flag `wx`); `false`, said, when it cannot. */
function claim(files, path, text, log) {
  try {
    files.create(path, text);
    return true;
  } catch (error) {
    log(
      error?.code === 'EEXIST'
        ? `${path} đã có — không ghi đè kết quả, lượt đang chạy hay phần đã chạy của lượt bị ngắt. Xóa hoặc đổi tên rồi chạy lại.`
        : `Không tạo được ${path} (${error?.message}) — không gọi gì.`,
    );
    return false;
  }
}

/**
 * The whole command: reads the config, claims the result file and its `.partial` (neither may be
 * there: one run per file, nothing overwritten), runs, writing the items done to `.partial` after
 * each one so a stopped run keeps them, then renames `.partial` to the result. Returns the exit
 * code; nothing is called before the config and both claims pass. `files`: `create` (flag `wx`),
 * `write`, `rename`, `remove`.
 */
export async function evalMain({ env, argv, fetch, now, day, userAgent, files, log }) {
  const config = readConfig(env, argv);
  if (config.error) {
    log(config.error);
    return 1;
  }
  const suffix = config.model === DEFAULT_AI_MODEL ? '' : `-${config.model}`;
  const path = `docs/metrics/ai-eval-${formatIsoDate(day)}${suffix}.md`;
  const partial = `${path}.partial`;
  const running = `# Eval AI — chưa xong\n\nLượt chạy đang chạy hoặc bị ngắt; phần đã chạy ở \`${partial.split('/').at(-1)}\`.\n`;
  if (!claim(files, path, running, log)) return 1;
  if (!claim(files, partial, '', log)) {
    files.remove(path);
    return 1;
  }
  const { key, plan, url, model, reasoning } = config;
  log(`Eval AI: gói ${plan}, model ${model}, reasoning ${reasoning}.`);
  const adapter = openCodeAdapter({ url, key, userAgent, fetch });
  const settings = { provider: 'OPENCODE_GO', opencodePlan: plan, model, reasoning };
  const meta = { plan, model, reasoning, day };
  let saveFailed = false;
  const save = (results) => {
    try {
      files.write(partial, formatReport(results, { ...meta, partial: true }));
    } catch (error) {
      if (!saveFailed) log(`Không ghi được ${partial} (${error.message}) — chạy tiếp.`);
      saveFailed = true;
    }
  };
  const results = await runEval({ adapter, settings, now, log, onItem: save });
  const report = formatReport(results, meta);
  try {
    files.write(partial, report);
    files.rename(partial, path);
  } catch (error) {
    // The run is paid for: the result goes to the output rather than nowhere.
    log(`Không ghi được ${path} (${error.message}). Kết quả:\n\n${report}`);
    return 1;
  }
  log(`Đã ghi ${path}.`);
  return 0;
}
