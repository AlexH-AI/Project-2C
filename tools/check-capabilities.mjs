/* global process */
// The capabilities a Tauri build compiled into the app, against capabilities/default.json
// (DR6-204, T-452). CI runs it right after the build of each platform (ci.yml, macos.yml):
//   node tools/check-capabilities.mjs <gen/schemas/capabilities.json> <capabilities/default.json>
//     <target/release>
// Prints OK and exits 0, or prints what differs and exits 1.
//
// tauri-build writes gen/schemas/capabilities.json from the capability files it read; the app gets
// those, unless the config the build read lists capabilities of its own
// (`app.security.capabilities`), which tauri::generate_context! then takes in their place, from
// tauri.conf.json, tauri.<platform>.conf.json or `tauri build --config` (handed on as
// TAURI_CONFIG). That config reaches no file of the build but Cargo's record of the build script
// run: the files it read, and TAURI_CONFIG. Rust code that adds one (`generate_context!` with an
// argument, `add_capability`) is tauri-contract.test.ts's to check.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

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
    problems.push(
      `no run of a Tauri build script in ${join(profile, '.fingerprint')}: build first`,
    );
  }
  const configs = new Set();
  for (const { tauriConfig, configs: read } of runs) {
    if (tauriConfig.val !== null) {
      problems.push(`TAURI_CONFIG (tauri build --config): ${tauriConfig.val}`);
    }
    if (read.length === 0) problems.push('a run of the build script read no Tauri config');
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
  const read =
    `${identifier}: ${permissions.length} permissions, window ${windows.join(', ')}; ` +
    `${runs.length} build script run${runs.length === 1 ? '' : 's'}, ` +
    `TAURI_CONFIG ${runs.every(({ tauriConfig }) => tauriConfig.val === null) ? 'unset' : 'set'}, ` +
    `configs ${[...configs].join(', ')}`;
  return { problems, read };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const paths = process.argv.slice(2);
  if (paths.length !== 3) {
    process.stderr.write(
      'Usage: node tools/check-capabilities.mjs <gen/schemas/capabilities.json> <capabilities/default.json> <target/release>\n',
    );
    process.exit(2);
  }
  const { problems, read } = checkCapabilities(...paths);
  if (problems.length === 0) {
    process.stdout.write(`OK: ${read}\n`);
  } else {
    process.stderr.write(
      `The capabilities of the build differ from capabilities/default.json:\n${problems.map((problem) => `- ${problem}`).join('\n')}\n`,
    );
    process.exitCode = 1;
  }
}
