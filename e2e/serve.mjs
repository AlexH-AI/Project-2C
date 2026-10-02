// Builds the web app and serves it with `vite preview` inside this one process, so Playwright
// stops the whole server by stopping this process (a `pnpm … && pnpm … preview` chain leaves a
// process tree on Windows that outlives the run).
import { execSync } from 'node:child_process';
import process from 'node:process';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const port = Number(process.env.E2E_PORT);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const app = resolve(root, 'apps/desktop');

execSync('pnpm build:web', { cwd: root, stdio: 'inherit' });

const vite = createRequire(resolve(app, 'package.json')).resolve('vite');
const { preview } = await import(pathToFileURL(vite).href);
const server = await preview({
  root: app,
  preview: { port, strictPort: true },
});
server.printUrls();

const stop = () => server.close().finally(() => process.exit(0));
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
