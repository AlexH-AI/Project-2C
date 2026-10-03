/* global process */
// Writes the generated export map of each package's CLAUDE.md (#287), between
// <!-- codemap:start --> and <!-- codemap:end -->; the hand-written rest is kept.
// `--check` writes nothing and exits 1 when a map is out of date (part of pnpm verify).

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, posix } from 'node:path';
import {
  END,
  START,
  listExports,
  parseSource,
  renderExportMap,
  renderRouteTable,
  replaceBlock,
  screenComponents,
  sectionsOf,
  viewImports,
} from './codemap-core.mjs';

const PACKAGES = ['packages/domain', 'packages/db', 'packages/ui', 'apps/desktop'];
// Claude Code loads the whole CLAUDE.md into context.
const MAX_CHARS = 8000;

const read = (path) => readFileSync(path, 'utf8');
const isSource = (name) => /\.tsx?$/.test(name) && !/\.test\.tsx?$|\.d\.ts$/.test(name);

/** Source files of `<pkg>/src` (no tests, no .d.ts), as package-relative POSIX paths. */
function sourceFiles(pkg) {
  return readdirSync(join(pkg, 'src'), { recursive: true })
    .map((p) => posix.join('src', p.split('\\').join('/')))
    .filter(isSource);
}

/** `from` imported by `file` (both package-relative), resolved to an existing .ts/.tsx file. */
function resolve(pkg, file, from) {
  const base = posix.join(posix.dirname(file), from);
  const hit = ['.ts', '.tsx'].map((ext) => base + ext).find((p) => existsSync(join(pkg, p)));
  if (!hit) throw new Error(`${pkg}/${file}: cannot resolve import ${from}`);
  return hit;
}

function routeTable(pkg) {
  const parse = (file) => parseSource(file, read(join(pkg, file)));
  const screenFile = 'src/routes/Screen.tsx';
  const rows = screenComponents(parse(screenFile)).map(({ screen, from }) => {
    const file = resolve(pkg, screenFile, from);
    const views = viewImports(parse(file)).map((v) => resolve(pkg, file, v));
    return { screen, file, views };
  });
  return renderRouteTable(sectionsOf(parse('src/shell/routes.ts')), rows);
}

function generate(pkg, current) {
  const files = sourceFiles(pkg).map((path) => ({
    path,
    ...listExports(parseSource(path, read(join(pkg, path)))),
  }));
  const head = pkg === 'apps/desktop' ? `### Route\n\n${routeTable(pkg)}\n\n### Export\n\n` : '';
  const outside = current.length - (current.indexOf(END) - current.indexOf(START));
  const room = MAX_CHARS - outside - head.length - START.length - 2;
  return replaceBlock(current, head + renderExportMap(files, room));
}

const check = process.argv.includes('--check');
const stale = [];
for (const pkg of PACKAGES) {
  const path = join(pkg, 'CLAUDE.md');
  const current = read(path);
  let next;
  try {
    next = generate(pkg, current);
  } catch (error) {
    process.stderr.write(`${path}: ${error.message}\n`);
    process.exit(1);
  }
  if (next.length > MAX_CHARS) {
    process.stderr.write(`${path}: ${next.length} characters (max ${MAX_CHARS})\n`);
    process.exit(1);
  }
  if (next === current) continue;
  stale.push(path);
  if (!check) writeFileSync(path, next);
}

if (check && stale.length) {
  process.stderr.write(
    `Export map out of date in:\n${stale.map((p) => `  ${p}\n`).join('')}` +
      'Run pnpm codemap and commit the result.\n',
  );
  process.exit(1);
}
process.stdout.write(
  stale.length ? `Updated: ${stale.join(', ')}\n` : 'Export maps are up to date.\n',
);
