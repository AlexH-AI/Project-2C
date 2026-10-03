// Process helper shared by tools/handoff.mjs and tools/status.mjs (I/O stays out of
// session-core.mjs, which is pure and unit-tested).

import { spawnSync } from 'node:child_process';

/** Run a command and return its stdout; throw with stderr (or the spawn error) on failure. */
export function run(cmd, args, { cwd, timeout = 15000 } = {}) {
  const result = spawnSync(cmd, args, { cwd, encoding: 'utf8', timeout });
  if (result.status !== 0) {
    const reason = result.error?.message || result.stderr?.trim() || `exit ${result.status}`;
    throw new Error(`${cmd} ${args.slice(0, 2).join(' ')} failed: ${reason}`);
  }
  return result.stdout;
}
