// Pure helpers for tools/retro.mjs (#289): navigation metrics from Claude Code transcripts
// (~/.claude/projects/<repo folder>/*.jsonl). No I/O here, so they are unit-tested in
// retro-core.test.mjs. Only counts leave this module, never message text.

const EDIT_TOOLS = new Set(['Edit', 'Write', 'NotebookEdit']);
const PROBE_TOOLS = new Set(['Read', 'Grep', 'Glob', 'LS']);
const SHELL_TOOLS = new Set(['Bash', 'PowerShell']);

// First word of a shell command that only reads or searches.
const PROBE_COMMANDS = new Set([
  'cat',
  'head',
  'tail',
  'less',
  'sed',
  'grep',
  'rg',
  'find',
  'ls',
  'tree',
  'wc',
  'type',
  'dir',
  'get-content',
  'gc',
  'get-childitem',
  'gci',
  'get-item',
  'select-string',
  'sls',
  'test-path',
]);
const PROBE_GIT = new Set(['show', 'log', 'diff', 'grep', 'ls-files', 'blame', 'status']);

// A probe that hit a path that is not there (Read, Bash, PowerShell wordings).
const WRONG_PATH = /does not exist|no such file|cannot find path/i;
const HANDOFF = /handoff/i;
const REVIEW_PROMPT = /review[\s-]*pr\b/i;

/** One object per valid JSON line; broken lines and non-objects are skipped. */
export function parseTranscript(text) {
  const entries = [];
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      if (entry && typeof entry === 'object' && !Array.isArray(entry)) entries.push(entry);
    } catch {
      // A line cut by a crash or written mid-flush: ignore it.
    }
  }
  return entries;
}

const segments = (command) =>
  command
    .split(/&&|\|\||;|\||\n/)
    .map((p) => p.trim())
    .filter(Boolean);

const words = (segment) => segment.split(/\s+/).map((w) => w.toLowerCase());

/** First command of a shell line, after any leading `cd …`: e.g. `git log`. */
function firstCommand(command) {
  return words(segments(command).find((p) => !/^(cd|set-location)\b/i.test(p)) ?? '');
}

/** A tool call that explores the repo: Read / Grep / Glob, or a shell read / search. */
export function isProbe(toolUse) {
  if (PROBE_TOOLS.has(toolUse.name)) return true;
  if (!SHELL_TOOLS.has(toolUse.name)) return false;
  const command = toolUse.input?.command;
  if (typeof command !== 'string') return false;
  const [word, sub] = firstCommand(command);
  if (word === 'git') return PROBE_GIT.has(sub);
  return PROBE_COMMANDS.has(word);
}

function readsHandoff(toolUse) {
  const input = toolUse.input ?? {};
  if (toolUse.name === 'Read') return HANDOFF.test(String(input.file_path ?? ''));
  if (!SHELL_TOOLS.has(toolUse.name) || typeof input.command !== 'string') return false;
  // A command that starts with the read, not one that only mentions it (e.g. inside node -e).
  return segments(input.command).some(
    (p) =>
      /^node\s+\S*handoff\.mjs\s+read\b/i.test(p) ||
      (PROBE_COMMANDS.has(words(p)[0]) && /HANDOFF\.md/i.test(p)),
  );
}

const blocks = (entry) => {
  const content = entry.message?.content;
  return Array.isArray(content) ? content.filter((b) => b && typeof b === 'object') : [];
};

const resultText = (block) =>
  typeof block.content === 'string' ? block.content : JSON.stringify(block.content ?? '');

function promptText(entry) {
  const content = entry.message?.content;
  if (typeof content === 'string') return content;
  const text = blocks(entry).find((b) => b.type === 'text');
  return text ? String(text.text ?? '') : null;
}

/**
 * Counts for one session transcript, or null when it has no session line:
 * - probesBeforeEdit: probes before the first Edit / Write (null when nothing was edited)
 * - contextAt3: input + cache tokens of the 3rd API request (lines of one request share
 *   message.id and repeat its usage)
 * - wrongPaths: probes whose result says the path does not exist
 * - handoffLoads: SessionStart hook outputs that carry HANDOFF + explicit HANDOFF reads
 * - kind: review when run in a Project-2C-review* folder or opened with "review PR"
 */
export function sessionStats(entries) {
  const lines = entries.filter((e) => typeof e.sessionId === 'string' && e.isSidechain !== true);
  if (lines.length === 0) return null;

  const probeIds = new Set();
  const requests = [];
  let probes = 0;
  let probesBeforeEdit = null;
  let wrongPaths = 0;
  let handoffLoads = 0;
  let prompt = null;
  let review = false;

  for (const entry of lines) {
    if (/Project-2C-review/i.test(String(entry.cwd ?? ''))) review = true;
    const hook = entry.attachment;
    if (hook?.type === 'hook_success' && hook.hookEvent === 'SessionStart') {
      if (HANDOFF.test(String(hook.stdout ?? '') + String(hook.content ?? ''))) handoffLoads++;
    }
    if (entry.type === 'user' && prompt === null) prompt = promptText(entry);
    if (entry.type === 'user') {
      for (const block of blocks(entry)) {
        if (block.type !== 'tool_result' || !probeIds.has(block.tool_use_id)) continue;
        if (block.is_error && WRONG_PATH.test(resultText(block))) wrongPaths++;
      }
    }
    if (entry.type !== 'assistant') continue;
    const id = entry.message?.id;
    const usage = entry.message?.usage;
    if (id && usage && !requests.some((r) => r.id === id)) requests.push({ id, usage });
    for (const block of blocks(entry)) {
      if (block.type !== 'tool_use' || typeof block.name !== 'string') continue;
      if (EDIT_TOOLS.has(block.name) && probesBeforeEdit === null) probesBeforeEdit = probes;
      if (readsHandoff(block)) handoffLoads++;
      if (isProbe(block)) {
        probes++;
        probeIds.add(block.id);
      }
    }
  }
  if (prompt !== null && REVIEW_PROMPT.test(prompt)) review = true;

  const third = requests[2]?.usage;
  const contextAt3 = third
    ? (third.input_tokens ?? 0) +
      (third.cache_creation_input_tokens ?? 0) +
      (third.cache_read_input_tokens ?? 0)
    : null;
  const start = lines.map((e) => e.timestamp).find((t) => typeof t === 'string') ?? '';

  return {
    id: lines[0].sessionId,
    start,
    kind: review ? 'review' : 'task',
    probesBeforeEdit,
    contextAt3,
    wrongPaths,
    handoffLoads,
  };
}

/** Median of the numbers, nulls ignored; null when there is none. */
export function median(values) {
  const sorted = values.filter((v) => typeof v === 'number').sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Claude Code's folder name for a checkout path: every non-alphanumeric becomes "-". */
export function projectDirName(path) {
  return path.replace(/[^a-zA-Z0-9]/g, '-');
}

/** The repo's folder plus its review worktrees and Claude worktrees (name + "-…"). */
export function transcriptDirs(names, repoDir) {
  return names.filter((n) => n === repoDir || n.startsWith(`${repoDir}-`));
}

const num = (v) => (v === null ? '—' : String(Math.round(v * 10) / 10));
const tokens = (v) => (v === null ? '—' : `${(v / 1000).toFixed(1)}k`);

function cells(probes, context, wrong, handoff) {
  return [num(probes), tokens(context), num(wrong), num(handoff)];
}

const row = (cols, widths) =>
  cols
    .map((c, i) => c.padEnd(widths[i]))
    .join('  ')
    .trimEnd();

/** Table of sessions (newest first) and the median of each column per kind. */
export function formatReport(stats, machine) {
  const header = ['date', 'session', 'kind', 'probes<edit', 'ctx@3', 'wrong', 'handoff'];
  const body = stats.map((s) => [
    s.start.slice(0, 10),
    s.id.slice(0, 8),
    s.kind,
    ...cells(s.probesBeforeEdit, s.contextAt3, s.wrongPaths, s.handoffLoads),
  ]);
  const medians = ['task', 'review'].map((kind) => {
    const of = stats.filter((s) => s.kind === kind);
    const pick = (key) => median(of.map((s) => s[key]));
    return [
      `median ${kind}`,
      `(${of.length})`,
      '',
      ...cells(
        pick('probesBeforeEdit'),
        pick('contextAt3'),
        pick('wrongPaths'),
        pick('handoffLoads'),
      ),
    ];
  });
  const all = [header, ...body, ...medians];
  const widths = header.map((_, i) => Math.max(...all.map((r) => r[i].length)));
  return [
    `Navigation metrics — machine ${machine}, ${stats.length} sessions (newest first)`,
    '',
    row(header, widths),
    ...body.map((r) => row(r, widths)),
    '',
    ...medians.map((r) => row(r, widths)),
    '',
  ].join('\n');
}
