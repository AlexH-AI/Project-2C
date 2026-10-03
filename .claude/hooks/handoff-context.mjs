/* global process */
// SessionStart hook: print docs/state/HANDOFF.md as it is on origin/main, so a session
// opened on the other machine sees the latest handoff before `/session-start` pulls.
// Claude Code keeps at most 10,000 characters of hook output (beyond that it shows only
// a 2,000-character preview), so the output is capped below that limit.

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const LIMIT = 9500;
const TARGET = 8000;
const FILE = 'docs/state/HANDOFF.md';
const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();

function git(args, timeout = 5000) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8', timeout });
  return result.status === 0 ? result.stdout : null;
}

const lf = (text) => text.replace(/\r\n/g, '\n');

let local = null;
try {
  local = lf(readFileSync(join(root, FILE), 'utf8'));
} catch {
  // No local copy (unusual checkout): rely on origin/main below.
}

const notes = [];
const fetched = git(['fetch', 'origin', 'main', '--quiet'], 8000) !== null;
if (!fetched) notes.push('git fetch failed or timed out: origin/main may be stale.');

const remote = git(['show', `origin/main:${FILE}`]);
const sha = (git(['rev-parse', '--short', 'origin/main']) ?? '').trim();
let text;
if (remote !== null) {
  text = lf(remote);
  if (local !== null && local !== text) {
    const branch = (git(['branch', '--show-current']) ?? '').trim() || 'detached HEAD';
    notes.push(
      `The local ${FILE} (${branch}) differs from origin/main: read the local file if the previous session was editing it.`,
    );
  }
} else if (local !== null) {
  text = local;
  notes.push(`Could not read ${FILE} from origin/main: showing the local copy.`);
} else {
  process.stdout.write(`${FILE} not found locally or on origin/main.\n`);
  process.exit(0);
}

if (text.length > TARGET) {
  notes.push(
    `HANDOFF is ${text.length} characters (target <= ${TARGET}): shorten it at the next /handoff.`,
  );
}

const source = remote !== null ? `origin/main ${sha}` : 'local copy';
const header = `== ${FILE} (${source})\n${notes.map((n) => `WARNING: ${n}\n`).join('')}\n`;
const room = LIMIT - header.length;
const body =
  text.length > room
    ? `${text.slice(0, room - 120)}\n\n[cut here: read the rest of ${FILE} with the Read tool]\n`
    : text;
process.stdout.write(header + body);
