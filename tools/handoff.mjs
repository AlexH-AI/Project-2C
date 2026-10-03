/* global process */
// HANDOFF lives in the pinned GitHub issue labelled "handoff" (ADR-0003 appendix, #283).
//
//   node tools/handoff.mjs read [--out <file>]   print the handoff (or save it to edit)
//   node tools/handoff.mjs write <file>          replace the handoff with <file>
//
// Every successful read keeps a copy in the shared git dir (all worktrees), used when
// GitHub cannot be reached. A write is refused if the issue changed since this machine
// last read it, so one machine never silently overwrites the other's handoff.

import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { checkBody, checkWrite, pickHandoffIssue } from './session-core.mjs';

function run(cmd, args, root, timeout = 15000) {
  const result = spawnSync(cmd, args, { cwd: root, encoding: 'utf8', timeout });
  if (result.status !== 0) {
    const reason = result.error?.message || result.stderr?.trim() || `exit ${result.status}`;
    throw new Error(`${cmd} ${args.slice(0, 2).join(' ')} failed: ${reason}`);
  }
  return result.stdout;
}

function cachePath(root) {
  const dir = run('git', ['rev-parse', '--git-common-dir'], root).trim();
  return join(isAbsolute(dir) ? dir : resolve(root, dir), 'handoff-cache.json');
}

function loadCache(root) {
  try {
    return JSON.parse(readFileSync(cachePath(root), 'utf8'));
  } catch {
    return null;
  }
}

function fetchIssue(root, timeout) {
  const fields = 'number,title,body,updatedAt,url';
  const json = run(
    'gh',
    ['issue', 'list', '--label', 'handoff', '--state', 'open', '--limit', '5', '--json', fields],
    root,
    timeout,
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
 * Returns { body, number, source, warnings }; throws only when neither is available.
 */
export function readHandoff(root, timeout = 15000) {
  try {
    const issue = fetchIssue(root, timeout);
    saveCache(root, issue);
    return {
      body: issue.body,
      number: issue.number,
      source: `issue #${issue.number}`,
      warnings: [],
    };
  } catch (error) {
    const cache = loadCache(root);
    if (!cache) throw error;
    return {
      body: cache.body,
      number: cache.number,
      source: `local copy of #${cache.number} read ${cache.fetchedAt}`,
      warnings: [`Could not read GitHub (${error.message}): this copy may be stale.`],
    };
  }
}

export function writeHandoff(root, file) {
  const body = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const { error, warning } = checkBody(body);
  if (error) throw new Error(error);
  const current = fetchIssue(root);
  const conflict = checkWrite(loadCache(root), current);
  if (conflict) throw new Error(conflict);
  run('gh', ['issue', 'edit', String(current.number), '--body-file', file], root);
  saveCache(root, fetchIssue(root));
  return { number: current.number, warning };
}

function main([command, ...args]) {
  const root = process.cwd();
  if (command === 'read') {
    const outIndex = args.indexOf('--out');
    const { body, source, warnings } = readHandoff(root);
    for (const w of warnings) process.stderr.write(`WARNING: ${w}\n`);
    if (outIndex >= 0) {
      writeFileSync(args[outIndex + 1], body, 'utf8');
      process.stderr.write(`HANDOFF (${source}) saved to ${args[outIndex + 1]}\n`);
    } else {
      process.stdout.write(`== HANDOFF (${source})\n\n${body}\n`);
    }
  } else if (command === 'write' && args[0]) {
    const { number, warning } = writeHandoff(root, args[0]);
    if (warning) process.stderr.write(`WARNING: ${warning}\n`);
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
