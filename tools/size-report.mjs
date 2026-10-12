/* global process */
// Size report of spec Phase 6 §5.1 (T-217): lines per review package (§6.2), web bundle and exe,
// the baseline round 2 of the deep review compares against (§6.3).
//
//   node tools/size-report.mjs [--json] [--compare <file.json>] [--dist <dir>] [--exe <file>]
//
// Build first (`pnpm build:web`, `pnpm build:exe`); a missing build is reported as "Chưa build".
// `--compare` takes an earlier `--json` output and adds Δ columns to the Markdown.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { sizeReportMain } from './size-report-core.mjs';

// Paths are from the repo root, wherever the command is run from.
const root = fileURLToPath(new URL('../', import.meta.url));
const fromRoot = (path) => resolve(root, path);
const git = (...args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

function distFiles(dir) {
  const abs = fromRoot(dir);
  if (!existsSync(abs)) return null;
  return readdirSync(abs, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const file = join(entry.parentPath, entry.name);
      return { path: relative(abs, file).split(sep).join('/'), bytes: readFileSync(file) };
    });
}

process.exitCode = sizeReportMain({
  argv: process.argv.slice(2),
  io: {
    commit: () => git('rev-parse', '--short', 'HEAD').trim(),
    // A tracked file deleted in the working tree is not counted.
    trackedFiles: () =>
      git('ls-files', '-z')
        .split('\0')
        .filter((path) => path && existsSync(fromRoot(path))),
    readText: (path) => readFileSync(fromRoot(path), 'utf8'),
    distFiles,
    fileSize: (path) => (existsSync(fromRoot(path)) ? statSync(fromRoot(path)).size : null),
    readJson: (path) => JSON.parse(readFileSync(fromRoot(path), 'utf8')),
  },
  log: (line) => process.stdout.write(`${line}\n`),
});
