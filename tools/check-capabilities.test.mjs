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
  $schema: '../gen/schemas/desktop-schema.json',
  identifier: 'default',
  description: 'The main window',
  windows: ['main'],
  permissions: PERMISSIONS,
};
/** gen/schemas/capabilities.json as tauri-build writes it for capabilities/default.json. */
const built = (change = {}) => ({
  default: {
    identifier: 'default',
    description: 'The main window',
    local: true,
    windows: ['main'],
    permissions: PERMISSIONS,
    ...change,
  },
});
/** Cargo's record of a run of the app's build script: the files it read and TAURI_CONFIG. */
const run = (tauriConfig = null, paths = ['tauri.conf.json', 'tauri.windows.conf.json']) => ({
  rustc: 1,
  local: [
    {
      RerunIfChanged: {
        output: 'release/build/project2c-1/output',
        paths: [...paths, 'capabilities'],
      },
    },
    { RerunIfEnvChanged: { var: 'TAURI_CONFIG', val: tauriConfig } },
    { RerunIfEnvChanged: { var: 'REMOVE_UNUSED_COMMANDS', val: null } },
  ],
});
const CONFIGS = {
  'tauri.conf.json': {
    identifier: 'com.example.app',
    app: { security: { csp: "default-src 'self'" } },
  },
  'tauri.windows.conf.json': { bundle: { targets: ['nsis'] } },
};

const folders = [];
afterEach(() => {
  for (const folder of folders.splice(0)) rmSync(folder, { recursive: true, force: true });
});

/** The three paths the script takes, of a package of src-tauri as a build leaves it. */
function build({ capabilities = built(), runs = [run()], configs = {} } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'capabilities-'));
  folders.push(root);
  const write = (path, value) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), typeof value === 'string' ? value : JSON.stringify(value));
  };
  write('gen/schemas/capabilities.json', capabilities);
  write('capabilities/default.json', DEFAULT);
  for (const [file, config] of Object.entries({ ...CONFIGS, ...configs })) write(file, config);
  runs.forEach((fingerprint, at) =>
    write(
      `target/release/.fingerprint/project2c-${at}/run-build-script-build-script-build.json`,
      fingerprint,
    ),
  );
  // Other crates' build scripts track no TAURI_CONFIG.
  write('target/release/.fingerprint/serde-1/run-build-script-build-script-build.json', {
    local: [],
  });
  return ['gen/schemas/capabilities.json', 'capabilities/default.json', 'target/release'].map(
    (path) => join(root, path),
  );
}
const problems = (setup) => checkCapabilities(...build(setup)).problems;

describe('check-capabilities: what a Tauri build compiled in, against capabilities/default.json', () => {
  it('passes the build of capabilities/default.json alone, and says what it read', () => {
    const { problems, read } = checkCapabilities(...build());
    expect(problems).toEqual([]);
    expect(read).toBe(
      'default: 2 permissions, window main; 1 build script run, TAURI_CONFIG unset, configs tauri.conf.json, tauri.windows.conf.json',
    );
  });

  it('fails a set of capabilities the build compiled that differs, and names the difference', () => {
    const extra = {
      identifier: 'extra',
      local: true,
      windows: ['main'],
      permissions: ['core:window:allow-close'],
    };
    const permissions = [...PERMISSIONS, 'core:window:allow-close'];
    expect(problems({ capabilities: built({ permissions }) })).toEqual([
      `default.permissions: ${JSON.stringify(permissions)} in the build, ${JSON.stringify(PERMISSIONS)} in default.json`,
    ]);
    expect(problems({ capabilities: { ...built(), extra } })).toEqual([
      'capability extra: in the build, not in capabilities/default.json',
    ]);
    expect(problems({ capabilities: built({ windows: ['*'] }) })).toEqual([
      'default.windows: ["*"] in the build, ["main"] in default.json',
    ]);
    const remote = { urls: ['https://example.com/*'] };
    expect(problems({ capabilities: built({ local: false, remote }) })).toEqual([
      'default.local: false in the build, true in default.json',
      'default.remote: {"urls":["https://example.com/*"]} in the build, undefined in default.json',
    ]);
    expect(problems({ capabilities: { extra } })).toEqual([
      'capability extra: in the build, not in capabilities/default.json',
      'capability default: not in the build',
    ]);
  });

  // tauri-build writes the gen file from capabilities/ alone; tauri::generate_context! then takes
  // `app.security.capabilities` of the config in place of it (probe of PR T-452: the gen file the
  // same, byte for byte, after `tauri build --config` with a capability).
  it('fails a build whose config lists capabilities: a file it read, or a patch of --config', () => {
    const probe = {
      identifier: 'probe',
      windows: ['main'],
      permissions: ['core:window:allow-close'],
    };
    const patch = JSON.stringify({ app: { security: { capabilities: [probe] } } });
    expect(problems({ runs: [run(patch)] })).toEqual([
      `TAURI_CONFIG (tauri build --config): ${patch}`,
    ]);
    // Any patch: the check reads no config but the files.
    expect(problems({ runs: [run('{"version":"1.0.1"}')] })).toEqual([
      'TAURI_CONFIG (tauri build --config): {"version":"1.0.1"}',
    ]);
    const listed = { bundle: {}, app: { security: { capabilities: ['default'] } } };
    expect(problems({ configs: { 'tauri.windows.conf.json': listed } })).toEqual([
      'tauri.windows.conf.json: app.security.capabilities, which the build takes in place of capabilities/',
    ]);
  });

  it('fails closed: no run of the build script, one of several runs, a config it cannot read', () => {
    expect(problems({ runs: [] })[0]).toMatch(/^no run of a Tauri build script in .*\.fingerprint/);
    expect(problems({ runs: [run(), run('{}')] })).toEqual([
      'TAURI_CONFIG (tauri build --config): {}',
    ]);
    expect(problems({ runs: [run(null, [])] })).toEqual([
      'a run of the build script read no Tauri config',
    ]);
    expect(
      problems({
        runs: [run(null, ['tauri.conf.json', 'Tauri.windows.toml'])],
        configs: { 'Tauri.windows.toml': '' },
      }),
    ).toEqual(['Tauri.windows.toml: not JSON, which this check does not read']);
  });

  it('prints OK and exits 0, or prints what differs and exits 1', () => {
    const cli = (paths) => spawnSync(process.execPath, [SCRIPT, ...paths], { encoding: 'utf8' });
    const ok = cli(build());
    expect([ok.status, ok.stdout]).toEqual([
      0,
      expect.stringMatching(/^OK: default: 2 permissions/),
    ]);
    const differs = cli(build({ capabilities: built({ windows: ['*'] }) }));
    expect(differs.status).toBe(1);
    expect(differs.stderr).toContain('- default.windows: ["*"] in the build');
    expect(cli([]).status).toBe(2);
  });
});
