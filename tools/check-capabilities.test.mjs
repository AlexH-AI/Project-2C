/* global process, URL */
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { checkCapabilities } from './check-capabilities.mjs';

const SCRIPT = fileURLToPath(new URL('./check-capabilities.mjs', import.meta.url));
const PERMISSIONS = ['core:event:allow-listen', 'core:window:allow-destroy'];
const DEFAULT = {
  $schema: 'x',
  identifier: 'default',
  windows: ['main'],
  permissions: PERMISSIONS,
};
/** gen/schemas/capabilities.json as tauri-build writes it for capabilities/default.json. */
const built = (change) => ({ default: { ...DEFAULT, $schema: undefined, local: true, ...change } });
/** Cargo's record of a run of the app's build script: the files it read and TAURI_CONFIG. */
const run = (tauriConfig = null, configs = ['tauri.conf.json', 'tauri.windows.conf.json']) => ({
  local: [
    { RerunIfChanged: { output: 'release/build/p-1/output', paths: [...configs, 'capabilities'] } },
    { RerunIfEnvChanged: { var: 'TAURI_CONFIG', val: tauriConfig } },
  ],
});
const FINGERPRINT = 'target/release/.fingerprint';

const folders = [];
afterEach(() => {
  for (const folder of folders.splice(0)) rmSync(folder, { recursive: true, force: true });
});

/** The three paths the script takes, of src-tauri as a build leaves it. */
function build({ capabilities = built(), runs = [run()], configs = {} } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'capabilities-'));
  folders.push(root);
  const files = {
    'gen/schemas/capabilities.json': capabilities,
    'capabilities/default.json': DEFAULT,
    'tauri.conf.json': { app: { security: { csp: "default-src 'self'" } } },
    'tauri.windows.conf.json': { bundle: { targets: ['nsis'] } },
    ...configs,
    // Another crate's build script, which tracks no TAURI_CONFIG.
    [`${FINGERPRINT}/serde-1/run-build-script-build-script-build.json`]: { local: [] },
  };
  runs.forEach((record, at) => {
    files[`${FINGERPRINT}/app-${at}/run-build-script-build-script-build.json`] = record;
  });
  for (const [path, value] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), typeof value === 'string' ? value : JSON.stringify(value));
  }
  return ['gen/schemas/capabilities.json', 'capabilities/default.json', 'target/release'].map(
    (path) => join(root, path),
  );
}
const problems = (setup) => checkCapabilities(...build(setup)).problems;
/** What each problem is about: `default.windows`, `capability extra`… */
const about = (capabilities) => problems({ capabilities }).map((line) => line.split(':')[0]);

describe('check-capabilities: what a Tauri build compiled in, against capabilities/default.json', () => {
  it('passes the build of capabilities/default.json alone, and says what it read', () => {
    expect(checkCapabilities(...build())).toEqual({
      problems: [],
      read: 'default: 2 permissions, window main; configs tauri.conf.json, tauri.windows.conf.json in 1 build script run(s)',
    });
  });

  it('fails a set of capabilities the build compiled that differs', () => {
    const extra = { identifier: 'extra', local: true, windows: ['main'], permissions: [] };
    const added = [...PERMISSIONS, 'core:window:allow-close'];
    expect(about(built({ permissions: added }))).toEqual(['default.permissions']);
    expect(about({ ...built(), extra })).toEqual(['capability extra']);
    expect(about(built({ windows: ['*'] }))).toEqual(['default.windows']);
    const remote = { urls: ['https://x.example/*'] };
    expect(about(built({ local: false, remote }))).toEqual(['default.local', 'default.remote']);
    expect(about({ extra })).toEqual(['capability extra', 'capability default']);
  });

  // tauri-build writes the gen file from capabilities/ alone; tauri::generate_context! then takes
  // `app.security.capabilities` of the config in its place (probe of PR T-452: the gen file the
  // same, byte for byte, after `tauri build --config` with a capability).
  it('fails a build whose config lists capabilities: a file it read, or a patch of --config', () => {
    const patch = '{"app":{"security":{"capabilities":[{"identifier":"probe"}]}}}';
    expect(problems({ runs: [run(patch)] })).toEqual([
      `TAURI_CONFIG (tauri build --config): ${patch}`,
    ]);
    // Any patch: the check reads the config of the files only.
    expect(problems({ runs: [run('{}')] })).toEqual(['TAURI_CONFIG (tauri build --config): {}']);
    const listed = { app: { security: { capabilities: ['default'] } } };
    expect(problems({ configs: { 'tauri.windows.conf.json': listed } })).toEqual([
      'tauri.windows.conf.json: app.security.capabilities, which the build takes in place of capabilities/',
    ]);
  });

  it('fails closed: no run of the build script, one of several runs, a config it cannot read', () => {
    expect(problems({ runs: [] })[0]).toMatch(/^no Tauri build script run in .*\.fingerprint/);
    expect(problems({ runs: [run(), run('{}')] })).toHaveLength(1);
    expect(problems({ runs: [run(null, [])] })).toEqual([
      'a run of the build script read no Tauri config',
    ]);
    const toml = { runs: [run(null, ['Tauri.toml'])], configs: { 'Tauri.toml': '' } };
    expect(problems(toml)).toEqual(['Tauri.toml: not JSON, which this check does not read']);
  });

  it('prints OK and exits 0, or prints what differs and exits 1', () => {
    const cli = (paths) => spawnSync(process.execPath, [SCRIPT, ...paths], { encoding: 'utf8' });
    expect(cli(build())).toMatchObject({
      status: 0,
      stdout: expect.stringMatching(/^OK: default/),
    });
    expect(cli(build({ capabilities: built({ windows: ['*'] }) }))).toMatchObject({
      status: 1,
      stderr: expect.stringContaining(
        '- default.windows: ["*"] in the build, ["main"] in default.json',
      ),
    });
    expect(cli([]).status).toBe(2);
  });
});
