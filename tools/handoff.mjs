/* global process */
// HANDOFF lives in the pinned GitHub issue labelled "handoff" (ADR-0003 appendix, #283).
//
//   node tools/handoff.mjs read [--out <file>]   print the handoff (or save it to edit)
//   node tools/handoff.mjs write <file>          replace the handoff with <file>
//
// Every successful read keeps a copy in the shared git dir (all worktrees), used only when
// GitHub cannot be reached. `read --out <file>` also saves the version it came from in
// <file>.base.json; `write <file>` is refused if the issue changed since that version, so
// one machine never silently overwrites the other's handoff (other reads do not move it).

import { readFileSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { checkBody, checkWrite, pickHandoffIssue } from './session-core.mjs';
import { run } from './session-io.mjs';

function cachePath(root) {
  const dir = run('git', ['rev-parse', '--git-common-dir'], { cwd: root }).trim();
  return join(isAbsolute(dir) ? dir : resolve(root, dir), 'handoff-cache.json');
}

function loadCache(root) {
  try {
    return JSON.parse(readFileSync(cachePath(root), 'utf8'));
  } catch {
    return null;
  }
}

const basePath = (file) => `${file}.base.json`;

function saveBase(file, number, updatedAt) {
  writeFileSync(basePath(file), JSON.stringify({ number, updatedAt }), 'utf8');
}

function loadBase(file) {
  try {
    return JSON.parse(readFileSync(basePath(file), 'utf8'));
  } catch {
    return null;
  }
}

function fetchIssue(root, timeout) {
  const fields = 'number,title,body,updatedAt,url';
  const json = run(
    'gh',
    ['issue', 'list', '--label', 'handoff', '--state', 'open', '--limit', '5', '--json', fields],
    { cwd: root, timeout },
  );
  const issue = pickHandoffIssue(JSON.parse(json));
  return { ...issue, body: issue.body.replace(/\r\n/g, '\n') };
}

function saveCache(root, issue) {
  const { number, updatedAt, body, url } = issue;
  const cache = { number, updatedAt, url, fetchedAt: new Date().toISOString(), body };
  writeFileSync(cachePath(root), JSON.stringify(cache, null, 2), 'utf8');
}

/**
 * The current handoff: from GitHub when reachable (and cached), else the cached copy.
 * Returns { body, number, updatedAt, source, warnings }; throws only when neither is available.
 */
export function readHandoff(root, timeout = 15000) {
  let issue;
  try {
    issue = fetchIssue(root, timeout);
  } catch (error) {
    const cache = loadCache(root);
    if (!cache) throw error;
    return {
      body: cache.body,
      number: cache.number,
      updatedAt: cache.updatedAt,
      source: `local copy of #${cache.number} read ${cache.fetchedAt}`,
      warnings: [`Could not read GitHub (${error.message}): this copy may be stale.`],
    };
  }
  // The data from GitHub is good even if the offline copy cannot be saved.
  const warnings = [];
  try {
    saveCache(root, issue);
  } catch (error) {
    warnings.push(`Read from GitHub, but the offline copy was not saved (${error.message}).`);
  }
  return {
    body: issue.body,
    number: issue.number,
    updatedAt: issue.updatedAt,
    source: `issue #${issue.number}`,
    warnings,
  };
}

export function writeHandoff(root, file) {
  const body = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const { error, warning } = checkBody(body);
  if (error) throw new Error(error);
  const current = fetchIssue(root);
  const conflict = checkWrite(loadBase(file), current);
  if (conflict) throw new Error(conflict);
  // GitHub has no conditional issue update: a write from the other machine landing between
  // this check and the edit would still be overwritten. Accepted for two machines (ADR-0003).
  run('gh', ['issue', 'edit', String(current.number), '--body-file', file], { cwd: root });
  // The edit is done; failing to refresh the copies afterwards must not report it as failed.
  // The base is saved first: if it is not, the next write is refused (the safe side).
  let refreshWarning = null;
  try {
    const updated = fetchIssue(root);
    saveBase(file, updated.number, updated.updatedAt);
    saveCache(root, updated);
  } catch (error) {
    refreshWarning =
      `Written, but the local copy was not refreshed (${error.message}). ` +
      'Run read --out again before the next write.';
  }
  return { number: current.number, warning, refreshWarning };
}

function main([command, ...args]) {
  const root = process.cwd();
  if (command === 'read') {
    const outIndex = args.indexOf('--out');
    const { body, number, updatedAt, source, warnings } = readHandoff(root);
    for (const w of warnings) process.stderr.write(`WARNING: ${w}\n`);
    if (outIndex >= 0) {
      const out = args[outIndex + 1];
      writeFileSync(out, body, 'utf8');
      saveBase(out, number, updatedAt);
      process.stderr.write(`HANDOFF (${source}) saved to ${out}\n`);
    } else {
      process.stdout.write(`== HANDOFF (${source})\n\n${body}\n`);
    }
  } else if (command === 'write' && args[0]) {
    const { number, warning, refreshWarning } = writeHandoff(root, args[0]);
    if (warning) process.stderr.write(`WARNING: ${warning}\n`);
    if (refreshWarning) process.stderr.write(`WARNING: ${refreshWarning}\n`);
    process.stdout.write(`HANDOFF #${number} updated.\n`);
  } else {
    process.stderr.write('Usage: node tools/handoff.mjs read [--out <file>] | write <file>\n');
    process.exitCode = 2;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`ERROR: ${error.message}\n`);
    process.exitCode = 1;
  }
}
