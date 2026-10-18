/* global process, fetch, performance */
// The AI eval of docs/golden/ai-eval.md against OpenCode (T-171 #413, spec Phase 5 §11):
//
//   pnpm eval:ai [--model <id>] [--reasoning DEFAULT|LOW|MEDIUM|HIGH]
//
// Needs OPENCODE_GO_KEY (the OpenCode key) and takes OPENCODE_PLAN = GO (default) or CREDIT.
// Real calls cost money: the Owner runs it on their machine (G4), never in CI. Writes
// docs/metrics/ai-eval-<yyyy-mm-dd>[-<model>].md, with the items done so far in `<file>.partial`
// while it runs; the key is never written or printed.

import { readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { URL } from 'node:url';
// @p2c/ai and @p2c/domain are TypeScript with extensionless imports, imported below.
import './ts-hooks.mjs';

const { evalMain } = await import('./eval-ai-core.mjs');
const { fromLocalDate } = await import('../packages/domain/src/period.ts');

// Paths are from the repo root, wherever the command is run from.
const root = new URL('../', import.meta.url);
const desktop = JSON.parse(readFileSync(new URL('apps/desktop/package.json', root)));

process.exitCode = await evalMain({
  env: process.env,
  argv: process.argv.slice(2),
  fetch,
  now: () => performance.now(),
  day: fromLocalDate(new Date()),
  // As the app names itself to OpenCode (ADR-0009 W-1).
  userAgent: `Project-2C/${desktop.version}`,
  files: {
    create: (path, text) => writeFileSync(new URL(path, root), text, { flag: 'wx' }),
    write: (path, text) => writeFileSync(new URL(path, root), text),
    rename: (from, to) => renameSync(new URL(from, root), new URL(to, root)),
    remove: (path) => rmSync(new URL(path, root), { force: true }),
  },
  log: (line) => process.stdout.write(`${line}\n`),
});
