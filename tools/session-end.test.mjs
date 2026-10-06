/* global process */
// session-end.ps1 run for real against a throwaway clone and bare remote: the script is mostly
// git calls, so the behaviour worth pinning is what it does to branches (DR-81).
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { URL, fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const SCRIPT = fileURLToPath(new URL('./session-end.ps1', import.meta.url));
const hasPwsh = spawnSync('pwsh', ['-NoProfile', '-Command', 'exit 0']).status === 0;

let dir;
let clone;

const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();

function sessionEnd(...args) {
  return spawnSync(
    'pwsh',
    ['-NoProfile', '-File', join(clone, 'tools', 'session-end.ps1'), ...args],
    { cwd: clone, encoding: 'utf8', env: { ...process.env, COMPUTERNAME: 'PROBE-PC' } },
  );
}

const remoteBranches = () => git(dir, '--git-dir', join(dir, 'remote.git'), 'branch', '--list');

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'p2c-session-end-'));
  git(dir, 'init', '--bare', '--initial-branch=main', 'remote.git');
  clone = join(dir, 'clone');
  git(dir, 'clone', '--quiet', join(dir, 'remote.git'), clone);
  git(clone, 'config', 'user.name', 'probe');
  git(clone, 'config', 'user.email', 'probe@example.invalid');
  git(clone, 'config', 'core.hooksPath', 'no-hooks');
  git(clone, 'symbolic-ref', 'HEAD', 'refs/heads/main');
  mkdirSync(join(clone, 'tools'));
  copyFileSync(SCRIPT, join(clone, 'tools', 'session-end.ps1'));
  writeFileSync(join(clone, 'a.txt'), 'a\n');
  git(clone, 'add', '.');
  git(clone, 'commit', '--quiet', '-m', 'init');
  git(clone, 'push', '--quiet', '-u', 'origin', 'main');
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe.skipIf(!hasPwsh)('session-end.ps1', { timeout: 60_000 }, () => {
  it('on main with nothing to commit in -Paths, creates and pushes no branch', () => {
    const result = sessionEnd('-Paths', 'a.txt');
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toMatch(/Nothing to commit/);
    expect(git(clone, 'branch', '--show-current')).toBe('main');
    expect(git(clone, 'branch', '--list', 'wip/*')).toBe('');
    expect(remoteBranches()).toBe('* main');
  });

  it('on main with changes, commits them on a wip branch named to the second and pushes it', () => {
    writeFileSync(join(clone, 'a.txt'), 'changed\n');
    const result = sessionEnd('-Message', 'probe', '-Paths', 'a.txt');
    expect(result.status, result.stderr).toBe(0);
    const branch = git(clone, 'branch', '--show-current');
    expect(branch).toMatch(/^wip\/probe-pc-\d{8}-\d{6}$/);
    expect(git(clone, 'log', '-1', '--format=%s')).toBe('wip: probe');
    expect(remoteBranches()).toContain(branch);
  });
});
