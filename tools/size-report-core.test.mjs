import { Buffer } from 'node:buffer';
import { describe, expect, it } from 'vitest';
import {
  bundleReport,
  classifyFile,
  countLines,
  lineReport,
  parseSizeArgs,
  renderMarkdown,
  sizeReportMain,
} from './size-report-core.mjs';

const lines = (n) => 'x\n'.repeat(n);

describe('classifyFile', () => {
  it.each([
    ['packages/domain/src/money.ts', 'A', 'product'],
    ['packages/domain/src/money.test.ts', 'A', 'test'],
    ['packages/domain/src/golden/kyc.fixture.ts', 'A', 'test'],
    ['packages/db/src/test-support.ts', 'A', 'test'],
    ['packages/db/migrations/0000_init.sql', 'A', 'generated'],
    ['apps/desktop/src-tauri/src/storage.rs', 'B', 'product'],
    ['apps/desktop/src/data/persist-queue.ts', 'B', 'product'],
    ['apps/desktop/src/data/persist-queue.test.ts', 'B', 'test'],
    ['packages/ai/src/validator.ts', 'C', 'product'],
    ['packages/ai/src/test-support.ts', 'C', 'test'],
    ['apps/desktop/src/data/ai-analysis.ts', 'C', 'product'],
    ['apps/desktop/src/routes/SettingsAi.tsx', 'C', 'product'],
    ['apps/desktop/src/routes/settings-ai-view.test.ts', 'C', 'test'],
    ['apps/desktop/src/routes/appointments/AppointmentAi.tsx', 'C', 'product'],
    ['apps/desktop/src/routes/customers/KycHistory.tsx', 'C', 'product'],
    ['apps/desktop/src/routes/customers/extraction-view.ts', 'C', 'product'],
    ['apps/desktop/src/routes/customers/use-ai-job.ts', 'C', 'product'],
    ['packages/ui/src/components/Button.tsx', 'D', 'product'],
    ['apps/desktop/src/shell/scope.test.ts', 'D', 'test'],
    ['apps/desktop/src/i18n/vi.ts', 'D', 'product'],
    ['apps/desktop/src/routes/customers/CustomerKyc.tsx', 'D', 'product'],
    ['apps/desktop/src/routes/team/team-view.ts', 'D', 'product'],
    ['apps/desktop/src/routes/Screen.tsx', 'D', 'product'],
    ['apps/desktop/src/routes/classes.ts', 'D', 'product'],
    ['apps/desktop/src/routes/stage-badge.tsx', 'D', 'product'],
    ['apps/desktop/src/routes/money-view.ts', 'D', 'product'],
    ['apps/desktop/src/routes/money-view.test.ts', 'D', 'test'],
    ['apps/desktop/src/App.tsx', 'D', 'product'],
    ['apps/desktop/index.html', 'D', 'product'],
    ['apps/desktop/src/routes/appointments/YearGrid.tsx', 'E', 'product'],
    ['apps/desktop/src/routes/overview/stage-view.test.ts', 'E', 'test'],
    ['apps/desktop/src/routes/reports/report-workbook.ts', 'E', 'product'],
    ['apps/desktop/src/routes/SettingsTrash.tsx', 'E', 'product'],
    ['apps/desktop/src/routes/customers/CustomerPolicies.tsx', 'E', 'product'],
    ['apps/desktop/src/routes/customers/PolicyDialogs.tsx', 'E', 'product'],
    ['apps/desktop/src/routes/customers/policy-form.ts', 'E', 'product'],
    ['apps/desktop/src/routes/customers/policy-form.test.ts', 'E', 'test'],
    ['apps/desktop/src/routes/customers/CustomerAppointments.tsx', 'D', 'product'],
    ['apps/desktop/src/routes/trash-view.ts', 'E', 'product'],
    ['apps/desktop/src/routes/FilterBar.tsx', 'E', 'product'],
    ['apps/desktop/src/routes/ConfirmWordDialog.tsx', 'E', 'product'],
    ['tools/codemap-core.mjs', 'F', 'product'],
    ['tools/codemap-core.test.mjs', 'F', 'test'],
    ['tools/fixtures/ai-eval.mjs', 'F', 'test'],
    ['e2e/support.ts', 'F', 'test'],
    ['.github/workflows/ci.yml', 'F', 'product'],
    ['.githooks/pre-push', 'F', 'product'],
    ['.claude/hooks/handoff-context.mjs', 'F', 'product'],
    ['packages/ui/scripts/check-tokens.ts', 'F', 'product'],
    ['apps/desktop/vite.config.ts', 'F', 'product'],
    ['eslint.config.js', 'F', 'product'],
    ['vitest.config.ts', 'F', 'test'],
    ['playwright.guide.config.ts', 'F', 'test'],
    ['pnpm-lock.yaml', 'F', 'generated'],
  ])('%s → %s %s', (path, pkg, kind) => {
    expect(classifyFile(path)).toEqual({ pkg, kind });
  });

  it('puts a counted file outside every package in no package', () => {
    expect(classifyFile('apps/desktop/src/routes/NewScreen.tsx')).toEqual({
      pkg: null,
      kind: 'product',
    });
    expect(classifyFile('apps/web/src/a.test.ts')).toEqual({ pkg: null, kind: 'test' });
  });

  it('does not count docs, data, images, fonts or lock files', () => {
    for (const path of [
      'docs/design/mockups/ai.html',
      'README.md',
      'packages/db/migrations/meta/_journal.json',
      'apps/desktop/src-tauri/icons/icon.png',
      'packages/ui/src/fonts/x.woff2',
      'apps/desktop/src-tauri/Cargo.lock',
    ]) {
      expect(classifyFile(path)).toBeNull();
    }
  });
});

describe('countLines', () => {
  it('counts physical lines, with or without a final newline', () => {
    expect(countLines('')).toBe(0);
    expect(countLines('a')).toBe(1);
    expect(countLines('a\nb\n')).toBe(2);
    expect(countLines('a\r\nb')).toBe(2);
  });
});

describe('lineReport', () => {
  const files = {
    'packages/domain/src/a.ts': lines(10),
    'packages/domain/src/a.test.ts': lines(4),
    'packages/db/migrations/0000_init.sql': lines(7),
    // The blank line before the test module stays a product line.
    'apps/desktop/src-tauri/src/lib.rs': `${lines(6)}\n#[cfg(test)]\nmod tests {\n${lines(3)}}\n`,
    'packages/ai/src/b.ts': lines(5),
    'tools/c.test.mjs': lines(2),
    'apps/desktop/src/routes/NewScreen.tsx': lines(8),
    'docs/x.md': lines(100),
    'logo.png': '',
  };
  const report = lineReport(Object.keys(files), (path) => files[path]);
  const row = (key) => report.rows.find((r) => r.key === key);

  it('splits product, test and generated lines into their package', () => {
    expect(row('A')).toMatchObject({ product: 10, test: 4, generated: 7, files: 3 });
    expect(row('C')).toMatchObject({ product: 5, test: 0, generated: 0, files: 1 });
    expect(row('F')).toMatchObject({ product: 0, test: 2, generated: 0, files: 1 });
    expect(row('D')).toMatchObject({ product: 0, test: 0, generated: 0, files: 0 });
  });

  it('counts a Rust test module as test lines of the same file', () => {
    expect(row('B')).toMatchObject({ product: 7, test: 6, files: 1 });
  });

  it('shows files outside every package on their own row', () => {
    expect(row('?')).toMatchObject({ product: 8, test: 0, generated: 0, files: 1 });
    expect(report.unassigned).toEqual(['apps/desktop/src/routes/NewScreen.tsx']);
  });

  it('totals every counted file, equal to the packages plus the unassigned row', () => {
    const total = row('total');
    expect(total).toMatchObject({ product: 30, test: 12, generated: 7, files: 7 });
    const sum = report.rows
      .filter((r) => r.key !== 'total')
      .reduce((s, r) => s + r.product + r.test + r.generated, 0);
    expect(sum).toBe(total.product + total.test + total.generated);
    expect(report.skipped).toEqual({ files: 2, byExtension: { '.md': 1, '.png': 1 } });
  });
});

describe('bundleReport', () => {
  it('lists JS and CSS files by name without hash, with raw and gzip size', () => {
    const text = Buffer.from('a'.repeat(1000));
    const report = bundleReport([
      { path: 'assets/index-Ctj3jqWM.js', bytes: text },
      { path: 'assets/exceljs.min-DgbhWywh.js', bytes: Buffer.from('b') },
      { path: 'assets/index-C1k0Xtz0.css', bytes: Buffer.from('c') },
      { path: 'assets/sql-wasm-DfANybxk.wasm', bytes: Buffer.alloc(50) },
      { path: 'index.html', bytes: Buffer.alloc(7) },
    ]);
    expect(report.files.map((f) => f.name)).toEqual([
      'assets/exceljs.min.js',
      'assets/index.css',
      'assets/index.js',
    ]);
    const index = report.files.find((f) => f.name === 'assets/index.js');
    expect(index.raw).toBe(1000);
    expect(index.gzip).toBeGreaterThan(0);
    expect(index.gzip).toBeLessThan(100);
    expect(report.total.raw).toBe(1002);
    expect(report.other).toEqual({ files: 2, raw: 57 });
  });

  it('adds up the chunks that share a name once the hash is gone', () => {
    const report = bundleReport([
      { path: 'assets/index-Ctj3jqWM.js', bytes: Buffer.alloc(10) },
      { path: 'assets/index-AbCd_-12.js', bytes: Buffer.alloc(5) },
    ]);
    expect(report.files).toEqual([
      { name: 'assets/index.js', files: 2, raw: 15, gzip: expect.any(Number) },
    ]);
    expect(report.files[0].gzip).toBe(report.total.gzip);
  });
});

describe('parseSizeArgs', () => {
  it('reads the flags and keeps the default paths', () => {
    expect(parseSizeArgs([])).toEqual({
      json: false,
      compare: undefined,
      dist: 'apps/desktop/dist',
      exe: 'apps/desktop/src-tauri/target/release/project2c.exe',
    });
    expect(
      parseSizeArgs(['--json', '--compare', 'old.json', '--exe', 'x.exe', '--dist', 'd']),
    ).toEqual({ json: true, compare: 'old.json', dist: 'd', exe: 'x.exe' });
  });

  it('refuses an unknown flag or a flag without its value', () => {
    expect(parseSizeArgs(['--nope']).error).toMatch(/Usage/);
    expect(parseSizeArgs(['--compare']).error).toMatch(/Usage/);
  });
});

describe('sizeReportMain', () => {
  const tracked = { 'packages/domain/src/a.ts': lines(3), 'tools/b.mjs': lines(2) };

  function run(argv, overrides = {}) {
    const out = [];
    const io = {
      commit: () => 'abc1234',
      trackedFiles: () => Object.keys(tracked),
      readText: (path) => tracked[path],
      distFiles: () => [{ path: 'assets/index-Ctj3jqWM.js', bytes: Buffer.from('x'.repeat(2000)) }],
      fileSize: () => 4_179_968,
      readJson: () => {
        throw new Error('ENOENT: old.json');
      },
      ...overrides,
    };
    const code = sizeReportMain({ argv, io, log: (line) => out.push(line) });
    return { code, text: out.join('\n') };
  }

  it('writes "chưa build" for a missing web build or exe and still exits 0', () => {
    const { code, text } = run([], { distFiles: () => null, fileSize: () => null });
    expect(code).toBe(0);
    expect(text).toMatch(/Bundle web\n\nChưa build/);
    expect(text).toMatch(/Exe\n\nChưa build/);
    const json = JSON.parse(run(['--json'], { distFiles: () => null, fileSize: () => null }).text);
    expect(json.bundle).toBeNull();
    expect(json.exe).toBeNull();
  });

  it('prints the same numbers as JSON', () => {
    const json = JSON.parse(run(['--json']).text);
    expect(json.commit).toBe('abc1234');
    expect(json.exe).toEqual({
      path: 'apps/desktop/src-tauri/target/release/project2c.exe',
      bytes: 4_179_968,
    });
    expect(json.bundle.total.raw).toBe(2000);
    expect(json.lines.rows.find((r) => r.key === 'total')).toMatchObject({ product: 5 });
  });

  it('adds a signed difference column against an earlier JSON run', () => {
    const before = JSON.parse(run(['--json']).text);
    before.lines.rows.find((r) => r.key === 'A').product = 5; // now 3: down 2
    before.lines.rows.find((r) => r.key === 'F').product = 1; // now 2: up 1
    before.exe.bytes = 4_000_000; // now 4 179 968: up
    before.bundle.files[0].raw = 2500; // now 2000: down
    const { code, text } = run(['--compare', 'old.json'], { readJson: () => before });
    expect(code).toBe(0);
    expect(text).toMatch(/\| A\. Lõi dữ liệu \| 3 \| -2 \|/);
    expect(text).toMatch(/\| F\. Xuyên gói \/ công cụ \| 2 \| \+1 \|/);
    expect(text).toMatch(/\| C\. AI \| 0 \| 0 \|/);
    expect(text).toMatch(/\| assets\/index\.js \| 2 000 \| -500 \|/);
    expect(text).toMatch(/4 179 968 \| \+179 968/);
    expect(text).toMatch(/So với `abc1234`/);
  });

  it('marks a bundle file that is new or gone since the earlier run', () => {
    const before = JSON.parse(run(['--json']).text);
    before.bundle.files[0].name = 'assets/old.js';
    const { text } = run(['--compare', 'old.json'], { readJson: () => before });
    expect(text).toMatch(/\| assets\/index\.js \| 2 000 \| \+2 000 \|/);
    expect(text).toMatch(/\| assets\/old\.js \| — \| -2 000 \|/);
  });

  it('fails with a message when the compare file cannot be read', () => {
    const { code, text } = run(['--compare', 'old.json']);
    expect(code).toBe(1);
    expect(text).toMatch(/old\.json/);
  });

  it('fails on bad arguments', () => {
    expect(run(['--what']).code).toBe(1);
  });
});

describe('renderMarkdown', () => {
  it('lists the unassigned files under the line table', () => {
    const files = { 'apps/x/new.ts': lines(1) };
    const text = renderMarkdown({
      commit: 'abc1234',
      lines: lineReport(Object.keys(files), (p) => files[p]),
      bundle: null,
      exe: null,
    });
    expect(text).toMatch(/\| Chưa xếp gói \| 1 \|/);
    expect(text).toMatch(/`apps\/x\/new\.ts`/);
  });

  it('leaves out the unassigned row once no file is in it, unless the earlier run had some', () => {
    const report = (files) => ({
      commit: 'abc1234',
      lines: lineReport(Object.keys(files), (p) => files[p]),
      bundle: null,
      exe: null,
    });
    const now = report({ 'tools/a.mjs': lines(1) });
    expect(renderMarkdown(now)).not.toMatch(/Chưa xếp gói/);
    expect(renderMarkdown(now, now)).not.toMatch(/Chưa xếp gói/);
    // A file since added to `PACKAGES`: the row shows it gone.
    const before = report({ 'tools/a.mjs': lines(1), 'apps/x/new.ts': lines(2) });
    expect(renderMarkdown(now, before)).toMatch(
      /\| Chưa xếp gói \| 0 \| -2 \| 0 \| 0 \| 0 \| 0 \| 0 \| -1 \|/,
    );
  });

  it('says how many chunks a bundle row adds up', () => {
    const text = renderMarkdown({
      commit: 'abc1234',
      lines: lineReport([], () => ''),
      bundle: bundleReport([
        { path: 'assets/index-Ctj3jqWM.js', bytes: Buffer.alloc(10) },
        { path: 'assets/index-AbCd_-12.js', bytes: Buffer.alloc(5) },
      ]),
      exe: null,
    });
    expect(text).toMatch(/\| assets\/index\.js \(2 file\) \| 15 \|/);
  });
});
