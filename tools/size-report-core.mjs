// Pure helpers for tools/size-report.mjs (T-217): lines per review package of spec Phase 6 §6.2,
// web bundle and exe size. No file I/O here (the caller passes contents and sizes), so they are
// unit-tested in size-report-core.test.mjs.

import { gzipSync } from 'node:zlib';

export const DEFAULT_DIST = 'apps/desktop/dist';
export const DEFAULT_EXE = 'apps/desktop/src-tauri/target/release/project2c.exe';
const USAGE =
  'node tools/size-report.mjs [--json] [--compare <file.json>] [--dist <dir>] [--exe <file>]';

// Code files whose lines are counted; docs (mockups too), data, images, fonts and lock files are
// listed as not counted.
const COUNTED = /\.(?:[cm]?[jt]sx?|rs|css|html|sql|ps1|sh|ya?ml)$/;
const COUNTED_DIR = /^\.githooks\//;
const NOT_COUNTED_DIR = /^docs\//;
const GENERATED = [/^packages\/db\/migrations\//, /(?:^|\/)pnpm-lock\.yaml$/];
const TEST = [
  /\.(?:test|spec)\.[cm]?[jt]sx?$/,
  /^e2e\//,
  /(?:^|\/)test-support\.ts$/,
  /(?:^|\/)fixtures\//,
  /\/golden\//,
  /^(?:playwright[\w.]*|vitest)\.config\.ts$/,
];
// Rust keeps its tests in the same file: lines from `#[cfg(test)]` on are test lines.
const RUST_TESTS = /^\s*#\[cfg\(test\)\]/m;

const APP_SRC = 'apps/desktop/src/';
// AI screens and views of the app, and their tests, by file name.
const AI_NAME =
  /^(?:ai-|[\w-]*-ai-)|Ai\.tsx$|^Kyc(?:Extraction|Intelligence|WebSession|History)\.|^extraction-view\./;
const isAppAiFile = (path) =>
  path.startsWith(APP_SRC) && AI_NAME.test(path.slice(path.lastIndexOf('/') + 1));

/**
 * The six review packages of spec Phase 6 §6.2, in match order: the first match wins, so F and C
 * take their files out of the wider folders of the others. A counted file no package matches goes
 * to the "Chưa xếp gói" row: add it here.
 */
const PACKAGES = [
  {
    key: 'F',
    label: 'F. Xuyên gói / công cụ',
    match: [
      /^tools\//,
      /^e2e\//,
      /^\.(?:github|githooks|claude)\//,
      /^packages\/ui\/scripts\//,
      /^apps\/desktop\/vite\.config\.ts$/,
      /^[^/]+$/,
    ],
  },
  { key: 'C', label: 'C. AI', match: [/^packages\/ai\//, isAppAiFile] },
  {
    key: 'B',
    label: 'B. File và Rust',
    match: [/^apps\/desktop\/src-tauri\//, /^apps\/desktop\/src\/data\//],
  },
  { key: 'A', label: 'A. Lõi dữ liệu', match: [/^packages\/(?:domain|db)\//] },
  {
    key: 'E',
    label: 'E. Lịch hẹn, chỉ số, quản lý',
    match: [
      /^apps\/desktop\/src\/routes\/(?:appointments|overview|reports)\//,
      /^apps\/desktop\/src\/routes\/(?:Overview|Settings\w*|RestoreDialog|FilterBar)\.tsx$/,
      /^apps\/desktop\/src\/routes\/(?:trash-view|period-labels|applied-filter)(?:\.test)?\.ts$/,
    ],
  },
  {
    key: 'D',
    label: 'D. Màn nhập liệu',
    match: [
      /^packages\/ui\//,
      /^apps\/desktop\/src\/(?:shell|i18n|routes\/customers|routes\/team)\//,
      /^apps\/desktop\/src\/routes\/Screen\.tsx$/,
      /^apps\/desktop\/src\/[^/]+$/,
      /^apps\/desktop\/index\.html$/,
    ],
  },
];
const UNASSIGNED = { key: '?', label: 'Chưa xếp gói' };
const TOTAL = { key: 'total', label: 'Tổng' };

const matches = (rule, path) => (typeof rule === 'function' ? rule(path) : rule.test(path));

/**
 * `{ pkg, kind }` of a tracked file: `pkg` is A–F or null when no package matches, `kind` is
 * product, test or generated. Null when its lines are not counted.
 */
export function classifyFile(path) {
  if (NOT_COUNTED_DIR.test(path) || !(COUNTED.test(path) || COUNTED_DIR.test(path))) return null;
  const kind = GENERATED.some((r) => r.test(path))
    ? 'generated'
    : TEST.some((r) => r.test(path))
      ? 'test'
      : 'product';
  const pkg = PACKAGES.find((p) => p.match.some((rule) => matches(rule, path)));
  return { pkg: pkg ? pkg.key : null, kind };
}

/** Physical lines, as `wc -l` counts them plus a last line without newline. */
export function countLines(text) {
  if (text === '') return 0;
  return text.split('\n').length - (text.endsWith('\n') ? 1 : 0);
}

const extensionOf = (path) => {
  const name = path.slice(path.lastIndexOf('/') + 1);
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot) : '(không đuôi)';
};

/**
 * Lines of the tracked `paths` per package (A–F, then "?" for no package, then the total of every
 * counted file), split product / test / generated. `readText(path)` gives a file's content.
 */
export function lineReport(paths, readText) {
  const empty = (row) => ({ ...row, product: 0, test: 0, generated: 0, files: 0 });
  const rows = new Map(
    [...[...PACKAGES].sort((a, b) => a.key.localeCompare(b.key)), UNASSIGNED, TOTAL].map((p) => [
      p.key,
      empty({ key: p.key, label: p.label }),
    ]),
  );
  const unassigned = [];
  const skipped = { files: 0, byExtension: {} };
  for (const path of paths) {
    const kind = classifyFile(path);
    if (!kind) {
      const ext = extensionOf(path);
      skipped.files += 1;
      skipped.byExtension[ext] = (skipped.byExtension[ext] ?? 0) + 1;
      continue;
    }
    if (!kind.pkg) unassigned.push(path);
    const text = readText(path);
    const counts = { product: 0, test: 0, generated: 0 };
    const rustTests = path.endsWith('.rs') ? text.search(RUST_TESTS) : -1;
    if (rustTests >= 0) {
      counts.product = countLines(text.slice(0, rustTests));
      counts.test = countLines(text.slice(rustTests));
    } else {
      counts[kind.kind] = countLines(text);
    }
    for (const row of [rows.get(kind.pkg ?? UNASSIGNED.key), rows.get(TOTAL.key)]) {
      row.product += counts.product;
      row.test += counts.test;
      row.generated += counts.generated;
      row.files += 1;
    }
  }
  return { rows: [...rows.values()], unassigned, skipped };
}

/** Name of a built file without the 8-character content hash Vite adds. */
const withoutHash = (path) => path.replace(/-[\w-]{8}(?=\.\w+$)/, '');

/** JS and CSS files of the web build (`path` relative to it, `bytes` the content), raw and gzip. */
export function bundleReport(files) {
  const bundle = files
    .filter((f) => /\.(?:m?js|css)$/.test(f.path))
    .map((f) => ({
      name: withoutHash(f.path),
      raw: f.bytes.length,
      gzip: gzipSync(f.bytes).length,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const others = files.filter((f) => !/\.(?:m?js|css)$/.test(f.path));
  return {
    files: bundle,
    total: {
      raw: bundle.reduce((s, f) => s + f.raw, 0),
      gzip: bundle.reduce((s, f) => s + f.gzip, 0),
    },
    other: { files: others.length, raw: others.reduce((s, f) => s + f.bytes.length, 0) },
  };
}

export function parseSizeArgs(argv) {
  const options = { json: false, compare: undefined, dist: DEFAULT_DIST, exe: DEFAULT_EXE };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === '--json') {
      options.json = true;
    } else if (['--compare', '--dist', '--exe'].includes(flag) && argv[i + 1] !== undefined) {
      options[flag.slice(2)] = argv[(i += 1)];
    } else {
      return { error: `Usage: ${USAGE}` };
    }
  }
  return options;
}

const group = (n) => String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const number = (n) => (n === null || n === undefined ? '—' : (n < 0 ? '-' : '') + group(n));
const signed = (n) => (n > 0 ? `+${group(n)}` : n < 0 ? `-${group(n)}` : '0');

/**
 * A Markdown table. Each row is `{ label, values, before }`: with `compare`, every value column is
 * followed by a Δ column against `before` (undefined: nothing to compare with → "—").
 */
function table(headers, rows, compare) {
  const head = [headers[0], ...headers.slice(1).flatMap((h) => (compare ? [h, 'Δ'] : [h]))];
  const lines = [`| ${head.join(' | ')} |`, `|---${'|---:'.repeat(head.length - 1)}|`];
  for (const { label, values, before } of rows) {
    const cells = values.flatMap((value, i) => {
      if (!compare) return [number(value)];
      const old = before?.[i];
      const delta =
        before === undefined || (value == null && old == null)
          ? '—'
          : signed((value ?? 0) - (old ?? 0));
      return [number(value), delta];
    });
    lines.push(`| ${[label, ...cells].join(' | ')} |`);
  }
  return lines;
}

const LINE_COLUMNS = ['product', 'test', 'generated', 'files'];

function lineSection(lines, previous, compare) {
  const out = [
    '## Dòng code theo gói (spec Phase 6 §6.2)',
    '',
    'File git theo dõi, đọc ở thư mục làm việc. Test: `*.test.*`, `e2e/`, `test-support.ts`, ' +
      'fixture, golden và phần `#[cfg(test)]` của Rust. Sinh tự động: migration, `pnpm-lock.yaml`.',
    '',
    ...table(
      ['Gói', 'Sản phẩm', 'Test', 'Sinh tự động', 'File'],
      lines.rows.map((row) => {
        const old = previous?.rows.find((r) => r.key === row.key);
        return {
          label: row.key === TOTAL.key ? `**${row.label}**` : row.label,
          values: LINE_COLUMNS.map((c) => row[c]),
          before: LINE_COLUMNS.map((c) => old?.[c] ?? 0),
        };
      }),
      compare,
    ),
  ];
  if (lines.unassigned.length) {
    out.push(
      '',
      `Chưa xếp gói (thêm vào \`PACKAGES\` của \`tools/size-report-core.mjs\`): ${lines.unassigned
        .map((p) => `\`${p}\``)
        .join(', ')}.`,
    );
  }
  const byExtension = Object.entries(lines.skipped.byExtension)
    .sort(([a, x], [b, y]) => y - x || a.localeCompare(b))
    .map(([ext, n]) => `${ext} ${n}`);
  out.push(
    '',
    `Không đếm ${lines.skipped.files} file (tài liệu, dữ liệu, ảnh, font, lockfile)` +
      (byExtension.length ? `: ${byExtension.join(', ')}.` : '.'),
  );
  return out;
}

function bundleSection(bundle, previous, compare) {
  const out = [`## Bundle web${bundle?.dir ? ` (\`${bundle.dir}\`)` : ''}`, ''];
  if (!bundle) return [...out, 'Chưa build (chạy `pnpm build:web`).'];
  const old = new Map(previous?.files.map((f) => [f.name, f]));
  const names = [...new Set([...bundle.files.map((f) => f.name), ...old.keys()])].sort();
  const before = (values) => (previous ? values : undefined);
  const rows = names.map((name) => {
    const now = bundle.files.find((f) => f.name === name);
    const was = old.get(name);
    return {
      label: name,
      values: [now?.raw ?? null, now?.gzip ?? null],
      before: before([was?.raw ?? null, was?.gzip ?? null]),
    };
  });
  rows.push(
    {
      label: '**Tổng JS / CSS**',
      values: [bundle.total.raw, bundle.total.gzip],
      before: before([previous?.total.raw, previous?.total.gzip]),
    },
    {
      label: `Tệp khác (${bundle.other.files} file: wasm, font, ảnh…)`,
      values: [bundle.other.raw, null],
      before: before([previous?.other.raw, null]),
    },
  );
  return [...out, ...table(['File', 'Thô (byte)', 'Gzip (byte)'], rows, compare)];
}

function exeSection(exe, previous, compare) {
  const out = ['## Exe', ''];
  if (!exe) return [...out, 'Chưa build (chạy `pnpm build:exe`).'];
  const row = {
    label: `\`${exe.path}\``,
    values: [exe.bytes],
    before: previous ? [previous.bytes] : undefined,
  };
  return [...out, ...table(['File', 'Byte'], [row], compare)];
}

/** The report as Markdown; with `previous` (an earlier `--json` run), Δ columns against it. */
export function renderMarkdown(report, previous) {
  const compare = previous !== undefined;
  return [
    `# Kích thước codebase — \`${report.commit}\``,
    ...(compare ? ['', `So với \`${previous.commit}\` (cột Δ: + tăng, - giảm).`] : []),
    '',
    ...lineSection(report.lines, previous?.lines, compare),
    '',
    ...bundleSection(report.bundle, previous?.bundle, compare),
    '',
    ...exeSection(report.exe, previous?.exe, compare),
  ].join('\n');
}

/**
 * The command: `io` reads git and the disk (`distFiles` and `fileSize` return null when missing).
 * Returns the exit code; a missing build is reported, not an error.
 */
export function sizeReportMain({ argv, io, log }) {
  const options = parseSizeArgs(argv);
  if (options.error) {
    log(options.error);
    return 1;
  }
  let previous;
  if (options.compare) {
    try {
      previous = io.readJson(options.compare);
    } catch (error) {
      log(`Cannot read --compare ${options.compare}: ${error.message}`);
      return 1;
    }
    if (!Array.isArray(previous?.lines?.rows)) {
      log(`--compare ${options.compare} is not the --json output of this command`);
      return 1;
    }
  }
  const dist = io.distFiles(options.dist);
  const exeBytes = io.fileSize(options.exe);
  const report = {
    commit: io.commit(),
    lines: lineReport(io.trackedFiles(), io.readText),
    bundle: dist && { dir: options.dist, ...bundleReport(dist) },
    exe: exeBytes === null ? null : { path: options.exe, bytes: exeBytes },
  };
  log(options.json ? JSON.stringify(report, null, 2) : renderMarkdown(report, previous));
  return 0;
}
