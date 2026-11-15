/* global process */
// The capabilities a Tauri build compiled into the app, against capabilities/default.json
// (DR6-204, T-452), right after the build of each platform in CI (ci.yml, macos.yml). The app gets
// those tauri-build wrote to gen/schemas/capabilities.json from capabilities/, unless the config of
// the build lists its own (`app.security.capabilities`): tauri.conf.json, the platform's file, or
// `tauri build --config`, handed on as TAURI_CONFIG. Only Cargo's record of the build script run
// keeps that config: the files read, TAURI_CONFIG. The Rust code is tauri-contract.test.ts's.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const USAGE = `Usage: node tools/check-capabilities.mjs <gen/schemas/capabilities.json> \
<capabilities/default.json> <target/release>: OK and exit 0, or what differs and exit 1`;
const RUN = 'run-build-script-build-script-build.json';
/** A file of the config tauri-build reads: tauri.conf.json or tauri.<platform>.conf.json, or TOML. */
const CONFIG = /^(?:tauri(?:\.\w+)?\.conf\.json5?|Tauri(?:\.\w+)?\.toml)$/;

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));
const show = (value) => (value === undefined ? 'undefined' : JSON.stringify(value));

/** What differs between the capabilities of the build and capabilities/default.json. */
function differences(built, expected) {
  // tauri-build writes a capability that is not `remote` with `local: true`.
  const want = { ...expected, local: true };
  delete want.$schema;
  const problems = Object.keys(built)
    .filter((id) => id !== want.identifier)
    .map((id) => `capability ${id}: in the build, not in capabilities/default.json`);
  const got = built[want.identifier];
  if (!got) return [...problems, `capability ${want.identifier}: not in the build`];
  for (const key of new Set([...Object.keys(want), ...Object.keys(got)])) {
    if (show(got[key]) !== show(want[key])) {
      problems.push(
        `${want.identifier}.${key}: ${show(got[key])} in the build, ${show(want[key])} in default.json`,
      );
    }
  }
  return problems;
}

/** The runs of a Tauri build script Cargo recorded in a profile folder (target/release). */
function buildScriptRuns(profile) {
  const folder = join(profile, '.fingerprint');
  return (existsSync(folder) ? readdirSync(folder) : [])
    .map((crate) => join(folder, crate, RUN))
    .filter((file) => existsSync(file))
    .map((file) => readJson(file).local ?? [])
    .map((local) => ({
      tauriConfig: local.find(({ RerunIfEnvChanged }) => RerunIfEnvChanged?.var === 'TAURI_CONFIG')
        ?.RerunIfEnvChanged,
      configs: local
        .flatMap(({ RerunIfChanged }) => RerunIfChanged?.paths ?? [])
        .filter((path) => CONFIG.test(basename(path))),
    }))
    .filter(({ tauriConfig }) => tauriConfig);
}

/**
 * `problems`, what makes the app's capabilities differ from capabilities/default.json, none when
 * they match; `read`, what the check read.
 */
export function checkCapabilities(builtFile, defaultFile, profile) {
  const problems = differences(readJson(builtFile), readJson(defaultFile));
  // The package, where tauri-build writes gen/schemas/ and reads its config from.
  const app = resolve(dirname(builtFile), '../..');
  const runs = buildScriptRuns(profile);
  if (runs.length === 0) {
    problems.push(`no Tauri build script run in ${join(profile, '.fingerprint')}: build first`);
  }
  const configs = new Set();
  for (const { tauriConfig, configs: read } of runs) {
    if (tauriConfig.val !== null) {
      problems.push(`TAURI_CONFIG (tauri build --config): ${tauriConfig.val}`);
    }
    if (read.length === 0) problems.push('a build script run read no Tauri config');
    for (const config of read) configs.add(config);
  }
  for (const config of configs) {
    if (!config.endsWith('.json')) {
      problems.push(`${config}: not JSON, which this check does not read`);
    } else if (Object.hasOwn(readJson(resolve(app, config)).app?.security ?? {}, 'capabilities')) {
      problems.push(
        `${config}: app.security.capabilities, which the build takes in place of capabilities/`,
      );
    }
  }
  const { identifier, windows, permissions } = readJson(defaultFile);
  const read = `${identifier}: ${permissions.length} permissions, window ${windows.join(', ')}; configs ${[...configs].join(', ')} in ${runs.length} build script run(s)`;
  return { problems, read };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const paths = process.argv.slice(2);
  if (paths.length !== 3) {
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }
  const { problems, read } = checkCapabilities(...paths);
  if (problems.length === 0) {
    process.stdout.write(`OK: ${read}, no TAURI_CONFIG\n`);
  } else {
    const list = problems.map((problem) => `- ${problem}`).join('\n');
    process.stderr.write(`The capabilities of the build differ from default.json:\n${list}\n`);
    process.exitCode = 1;
  }
}
