/* global process */
// Navigation metrics from this machine's Claude Code transcripts (#289, docs/metrics/README.md):
//
//   node tools/retro.mjs [--last N]      (default and max: 30 newest sessions)
//
// Reads ~/.claude/projects/<repo folder>*/*.jsonl (main checkout, review worktrees,
// Claude worktrees) and prints counts only: never message text.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { homedir, hostname } from 'node:os';
import { dirname, join } from 'node:path';
import {
  formatReport,
  parseTranscript,
  projectDirName,
  sessionStats,
  transcriptDirs,
} from './retro-core.mjs';
import { run } from './session-io.mjs';

const MAX = 30;

function lastArg(argv) {
  const at = argv.indexOf('--last');
  if (at === -1) return MAX;
  const n = Number(argv[at + 1]);
  if (!Number.isInteger(n) || n < 1) throw new Error('--last needs a whole number >= 1');
  return Math.min(n, MAX);
}

try {
  const last = lastArg(process.argv.slice(2));
  // The main checkout, even when run from a worktree: its folder names the transcript folders.
  const gitDir = run('git', ['rev-parse', '--path-format=absolute', '--git-common-dir']).trim();
  const repoDir = projectDirName(dirname(gitDir));
  const root = join(homedir(), '.claude', 'projects');

  const files = transcriptDirs(readdirSync(root), repoDir).flatMap((dir) =>
    readdirSync(join(root, dir))
      .filter((f) => f.endsWith('.jsonl'))
      .map((f) => join(root, dir, f)),
  );
  files.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);

  const stats = [];
  for (const file of files) {
    if (stats.length === last) break;
    const s = sessionStats(parseTranscript(readFileSync(file, 'utf8')));
    if (s) stats.push(s);
  }
  stats.sort((a, b) => b.start.localeCompare(a.start));
  process.stdout.write(formatReport(stats, hostname()));
} catch (error) {
  process.stderr.write(`retro: ${error.message}\n`);
  process.exitCode = 1;
}
