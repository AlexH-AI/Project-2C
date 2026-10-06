// Builds the web app and serves it with `vite preview` inside this one process, so Playwright
// stops the whole server by stopping this process (a `pnpm … && pnpm … preview` chain leaves a
// process tree on Windows that outlives the run).
import { execSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import process from 'node:process';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const port = Number(process.env.E2E_PORT);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const app = resolve(root, 'apps/desktop');

execSync('pnpm build:web', { cwd: root, stdio: 'inherit' });

const vite = createRequire(resolve(app, 'package.json')).resolve('vite');
const { preview, runnerImport } = await import(pathToFileURL(vite).href);

// The pinned day's simulated data, seeded once here with the app's own code: every page load
// opens this file instead of seeding again (DR-79). seed-timing.spec.ts blocks it to time the seed.
const anchor = process.env.VITE_DEMO_ANCHOR;
if (anchor) {
  const load = async (id) =>
    (await runnerImport(id, { root: app, configFile: false, logLevel: 'warn' })).module;
  const { parseDate } = await load('@p2c/domain');
  const { buildDemoSnapshot, demoSnapshotName } = await load(
    resolve(app, 'src/data/demo-snapshot.ts'),
  );
  const day = parseDate(anchor);
  if (!day) throw new Error(`VITE_DEMO_ANCHOR is not a date: ${anchor}`);
  await writeFile(resolve(app, 'dist', demoSnapshotName(day)), await buildDemoSnapshot(day));
}

const server = await preview({
  root: app,
  preview: { port, strictPort: true },
});
server.printUrls();

const stop = () => server.close().finally(() => process.exit(0));
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
