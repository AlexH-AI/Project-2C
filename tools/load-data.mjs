/* global process */
// The load data of spec Phase 6 §5.1 (T-216): one backup file both machines and every reviewer
// measure on, imported in the app with Cài đặt → Nhập backup.
//
//   node tools/load-data.mjs [--out <file>] [--anchor yyyy-mm-dd] [--seed <n>]
//
// Defaults: anchor 2026-10-12, seed 6, out .local/load-data/load-<anchor>-seed<n>.p2cbackup (not
// committed: tens of MB); a relative --out is from the repo root, wherever the command is run from.
// Prints the rows of each table and the hash of `tables`: the same on any machine from UTC−12 to
// UTC+11 for the same anchor and seed, as the data of `seedDemoData` is.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

// @p2c/db is TypeScript with extensionless relative imports and `?raw` migrations, as Vite reads
// them. Node strips the types; this finds `./x` as `./x.ts` or `./x/index.ts` and loads a `?raw`
// file as its text.
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (!specifier.startsWith('.') || /\.\w+$/.test(specifier)) throw error;
      for (const suffix of ['.ts', '/index.ts']) {
        try {
          return nextResolve(specifier + suffix, context);
        } catch {
          // Try the next one.
        }
      }
      throw error;
    }
  },
  load(url, context, nextLoad) {
    if (!url.endsWith('?raw')) return nextLoad(url, context);
    const text = readFileSync(new URL(url.slice(0, -'?raw'.length)), 'utf8');
    return {
      format: 'module',
      source: `export default ${JSON.stringify(text)};`,
      shortCircuit: true,
    };
  },
});

const { loadDataMain } = await import('./load-data-core.mjs');
const { fromLocalDate } = await import('../packages/domain/src/period.ts');

// Paths are from the repo root, wherever the command is run from.
const root = fileURLToPath(new URL('../', import.meta.url));

process.exitCode = await loadDataMain({
  argv: process.argv.slice(2),
  today: fromLocalDate(new Date()),
  writeFile: (path, text) => {
    const file = resolve(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  },
  log: (line) => process.stdout.write(`${line}\n`),
});
