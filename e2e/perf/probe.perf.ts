import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, expect, test, type Browser, type Locator, type Page } from '@playwright/test';
import {
  aiCustomer,
  loadDataError,
  markdownTable,
  parseRun,
  toRun,
  type Measure,
  type Unit,
} from './stats';

// The operations of spec Phase 6 §5.2 on the exe release holding the load data (§5.1), through
// its WebView2 debug port. Steps and options: e2e/perf/README.md. Each time runs from the action
// to the frame after the screen shows its result, as the Phase 4 measures did
// (docs/metrics/phase-4.md, "Đo đầu-cuối"). The names are the keys two runs compare on: keep them.

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const CDP = process.env.PERF_CDP ?? 'http://127.0.0.1:9222';
const RUNS = Number(process.env.PERF_RUNS ?? 5);
const BACKUP = resolve(
  ROOT,
  process.env.PERF_BACKUP ?? '.local/load-data/load-2026-10-12-seed6.p2cbackup',
);
const STAMP = new Date().toISOString().slice(0, 16).replace(/\D/g, '');
const OUT = resolve(ROOT, process.env.PERF_OUT ?? `.local/perf/perf-${STAMP}.json`);
const BASE = process.env.PERF_BASE;
/** Nhóm C of the Phase 1–4 deep review: a screen operation under 200 ms on the load data. */
const SCREEN_LIMIT = 200;
/** How long a detached write waits before it starts: time to drop the debugger first. */
const DETACH_DELAY = 1_000;

/** What the screen shows once an operation is done: an element, with a text, or gone. */
interface Ready {
  selector: string;
  text?: string;
  absent?: boolean;
}

interface Timing {
  /** Click the element marked `data-p2c-perf`, go to a hash, or time from the page's start. */
  action: 'click' | 'hash' | 'load';
  hash?: string;
  ready?: Ready;
  /** Also wait for the file save the operation starts, and report its time. */
  saves?: boolean;
  /** Starts after this delay and leaves the result in `window.p2cPerf`, for a detached run. */
  delay?: number;
}

interface Timed {
  ms?: number;
  save?: number;
  error?: string;
}

declare global {
  interface Window {
    p2cPerf?: Timed;
  }
}

/** Runs in the page: no reference to anything outside it. */
async function timeInPage({ action, hash, ready, saves, delay }: Timing): Promise<Timed | null> {
  const met = () => {
    if (!ready) return true;
    const hit = [...document.querySelectorAll(ready.selector)].some(
      (element) => ready.text === undefined || (element.textContent ?? '').includes(ready.text),
    );
    return ready.absent ? !hit : hit;
  };
  const saved = () => performance.getEntriesByName('p2c:db-save', 'measure');
  // A hidden or covered window paints no frames: say so rather than wait for ever.
  const frame = () =>
    new Promise<boolean>((resolve) => {
      requestAnimationFrame(() => resolve(true));
      setTimeout(() => resolve(false), 2_000);
    });
  const run = async (): Promise<Timed> => {
    const target = document.querySelector<HTMLElement>('[data-p2c-perf]');
    target?.removeAttribute('data-p2c-perf');
    if (action === 'click' && !target) return { error: 'no element to click' };
    const saves0 = saved().length;
    const start = action === 'load' ? 0 : performance.now();
    if (action === 'click') target?.click();
    if (action === 'hash') location.hash = hash ?? '';
    // Checked before each paint; the time is taken once that frame is painted.
    do {
      if (!(await frame())) return { error: 'no frame painted: keep the exe window in front' };
      if (performance.now() - start > 60_000) return { error: 'not done after 60 s' };
    } while (!met());
    await new Promise((resolve) => setTimeout(resolve));
    const ms = performance.now() - start;
    if (!saves) return { ms };
    while (saved().length === saves0) {
      if (performance.now() - start > 60_000) return { ms, error: 'no file save after 60 s' };
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    return { ms, save: saved().at(-1)?.duration };
  };
  if (delay === undefined) return run();
  window.p2cPerf = undefined;
  setTimeout(() => void run().then((result) => (window.p2cPerf = result)), delay);
  return null;
}

const measures = new Map<string, Measure & { samples: number[] }>();
function add(name: string, unit: Unit, value: number, limit?: number) {
  const measure = measures.get(name) ?? { name, unit, samples: [], limit };
  measure.samples.push(value);
  process.stdout.write(`  ${name} #${measure.samples.length}: ${value.toFixed(1)} ${unit}\n`);
  measures.set(name, measure);
}

let browser: Browser;
let page: Page;

async function connect() {
  try {
    browser = await chromium.connectOverCDP(CDP, { timeout: 10_000 });
  } catch (error) {
    throw new Error(
      `No WebView2 debug port at ${CDP}: start the exe release with ` +
        'WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9222 (e2e/perf/README.md, ' +
        `step 2), or set PERF_CDP. ${String(error).split('\n')[0]}`,
      { cause: error },
    );
  }
  const found = browser
    .contexts()
    .flatMap((context) => context.pages())
    .find((p) => p.url().startsWith('http://tauri.localhost/'));
  if (!found) {
    await browser.close();
    throw new Error(`${CDP} answers, but no window of the exe (http://tauri.localhost/) is open.`);
  }
  page = found;
}

async function time(name: string, timing: Timing): Promise<Timed> {
  const result = await page.evaluate(timeInPage, timing);
  if (!result || result.error || result.ms === undefined) {
    throw new Error(`${name}: ${result?.error ?? 'no result'}`);
  }
  return result;
}

const mark = (target: Locator) => target.evaluate((el) => el.setAttribute('data-p2c-perf', ''));

/** A screen operation: the click, to the frame after it. */
async function click(name: string, target: Locator, ready?: Ready, limit = SCREEN_LIMIT) {
  await mark(target);
  add(name, 'ms', (await time(name, { action: 'click', ready })).ms as number, limit);
}

/**
 * A write: the debugger slows the file commands through IPC (Phase 4), so the click runs in the
 * page after the probe has disconnected, and the probe reads the time once it connects again.
 */
async function detached(name: string, target: Locator, ready: Ready, saves = false) {
  await mark(target);
  const timing: Timing = { action: 'click', ready, saves, delay: DETACH_DELAY };
  await page.evaluate(timeInPage, timing);
  await browser.close();
  await new Promise((resolve) => setTimeout(resolve, DETACH_DELAY + 3_000));
  await connect();
  const handle = await page.waitForFunction(() => window.p2cPerf, null, {
    polling: 100,
    timeout: 60_000,
  });
  const result = (await handle.jsonValue()) as Timed;
  if (result.error || result.ms === undefined) throw new Error(`${name}: ${result.error}`);
  add(name, 'ms', result.ms);
  if (result.save !== undefined) add('db.save', 'ms', result.save);
}

async function go(hash: string) {
  await page.evaluate((h) => (location.hash = h), hash);
  await expect(page.getByRole('main')).toBeVisible();
}

const dialogGone = { selector: 'dialog[open]', absent: true };
const status = (text: string) => ({ selector: '[role="status"]', text });

// Built on the page at hand: a detached write connects again, to a new page object.
const kind = (name: string) =>
  page.getByRole('radiogroup', { name: 'Loại kỳ' }).getByRole('radio', { name });
const list = () => page.getByRole('table', { name: 'Danh sách lịch hẹn' });
const calendar = () => page.getByRole('region', { name: /^Lịch tháng/ });
const detail = () => page.getByRole('complementary', { name: 'Chi tiết lịch hẹn' });
const inDay = () => page.getByRole('region', { name: /^Trong ngày/ }).getByRole('listitem');
const dateHeader = () => list().getByRole('columnheader', { name: 'Ngày' });
const byDate = () => dateHeader().getByRole('button');

/** Measures nothing but the load data (§5.1). */
async function checkLoadData() {
  await go('#/settings');
  const content = page.getByRole('definition').filter({ hasText: / KH · / });
  const problem = loadDataError((await content.textContent({ timeout: 5_000 })) ?? '');
  if (problem) throw new Error(problem);
}

/** Opening the app: the page's start to its data, readable only before any reload. */
async function appOpen() {
  const opened = await page.evaluate(() => ({
    kind: (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming).type,
    at: performance.getEntriesByName('p2c:data-open', 'mark')[0]?.startTime,
  }));
  if (opened.kind === 'navigate' && opened.at !== undefined) add('app.open-data', 'ms', opened.at);
}

/** Nhập backup of the same load data: each run then measures the data as generated. */
async function importBackup() {
  await go('#/overview');
  await go('#/settings');
  // From the file picked (the input's change, before the app reads it) to the confirmation.
  const input = page.locator('input[type="file"]');
  await input.evaluate((el) =>
    el.addEventListener('change', () => (el.dataset.picked = String(performance.now())), {
      capture: true,
      once: true,
    }),
  );
  await input.setInputFiles(BACKUP);
  const read = await input.evaluate(async (el) => {
    const start = Number(el.dataset.picked);
    while (!document.querySelector('dialog[open]')) {
      if (performance.now() - start > 60_000) return undefined;
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    await new Promise((resolve) => setTimeout(resolve));
    return performance.now() - start;
  });
  if (read === undefined) throw new Error(`backup.read: no confirmation for ${BACKUP}`);
  add('backup.read', 'ms', read);
  const confirm = page.getByRole('dialog').getByRole('button', { name: 'Backup rồi thay dữ liệu' });
  await detached('backup.import', confirm, status('Đã nhập backup'), true);
}

const SCREENS: [string, Ready][] = [
  // Tổng quan draws its chart (SVG) once the chart code has loaded.
  ['overview', { selector: 'main svg' }],
  ['appointments', { selector: 'main h2' }],
  // Khách hàng opens on its Kanban columns, or on its table.
  ['customers', { selector: 'main section, main table' }],
  ['reports', { selector: 'main table' }],
  ['team', { selector: 'main h2' }],
  ['settings', { selector: 'main h2' }],
];

/** The first screen after a reload, of each sidebar screen. */
async function reloads() {
  for (const [screen, ready] of SCREENS) {
    await go(`#/${screen}`);
    for (let i = 0; i < RUNS; i++) {
      await page.reload({ waitUntil: 'commit' });
      const name = `reload.${screen}`;
      add(name, 'ms', (await time(name, { action: 'load', ready })).ms as number);
    }
  }
}

/** Lịch hẹn: each period kind, sorting and picking in Năm, picking in Tháng. */
async function appointments(i: number) {
  await go('#/appointments');
  for (const [name, label] of [
    ['day', 'Ngày'],
    ['week', 'Tuần'],
    ['month', 'Tháng'],
    ['year', 'Năm'],
  ] as const) {
    await click(`appointments.period-${name}`, kind(label));
    await expect(kind(label)).toBeChecked();
  }
  // The list opens newest first: a click unsorts, the next sorts up, the last back down.
  await byDate().click();
  await expect(dateHeader()).toHaveAttribute('aria-sort', 'none');
  await click('appointments.sort-date-asc', byDate());
  await expect(dateHeader()).toHaveAttribute('aria-sort', 'ascending');
  await click('appointments.sort-date-desc', byDate());
  await expect(dateHeader()).toHaveAttribute('aria-sort', 'descending');
  const row = list()
    .getByRole('row')
    .nth(i + 1)
    .getByRole('button')
    .first();
  await click('appointments.select-row-year', row);
  await expect(detail().getByRole('button').first()).toBeVisible();
  await kind('Tháng').click();
  const met = calendar()
    .getByRole('button', { name: /Đã gặp/ })
    .nth(i);
  await click('appointments.select-day-month', met);
  await click('appointments.select-row-month', inDay().getByRole('button').first());
  await expect(detail().getByRole('button').first()).toBeVisible();
}

/** Khách hàng: the table sorted by name; a profile with its AI panel and analysis history. */
async function customers(aiId: string) {
  await go('#/customers');
  const views = page.getByRole('radiogroup', { name: 'Cách xem' });
  await views.getByRole('radio', { name: 'Kanban' }).click();
  await click('customers.view-table', views.getByRole('radio', { name: 'Bảng' }));
  // Ascending, timed; then descending and unsorted again.
  const byName = page.getByRole('columnheader', { name: 'Họ tên' }).getByRole('button');
  await click('customers.sort-name', byName);
  await expect(page.getByRole('columnheader', { name: 'Họ tên' })).toHaveAttribute(
    'aria-sort',
    'ascending',
  );
  await byName.click();
  await byName.click();

  const panel = page.getByRole('region', { name: 'KYC Intelligence' });
  const profile = `#/customers/${encodeURIComponent(aiId)}`;
  await go(profile);
  await expect(panel, `${BACKUP} is not the data the exe holds`).toBeVisible();
  await go('#/customers');
  const ready = { selector: 'main h2', text: 'KYC Intelligence' };
  const shown = await time('customer.open-ai', { action: 'hash', hash: profile, ready });
  add('customer.open-ai', 'ms', shown.ms as number, SCREEN_LIMIT);
  const history = panel.getByRole('table', { name: 'Lịch sử phân tích' });
  await click('customer.ai-history', history.getByRole('button').last());
  await expect(panel).toContainText('Đang xem lần');
}

/** Tổng quan and Báo cáo: Lọc on Năm then on Tháng; Báo cáo by RE. */
async function filters() {
  for (const screen of ['overview', 'reports']) {
    await go(`#/${screen}`);
    const filter = page.getByRole('button', { name: 'Lọc', exact: true });
    await kind('Năm').click();
    await click(`${screen}.filter-year`, filter);
    await kind('Tháng').click();
    await click(`${screen}.filter-month`, filter);
  }
  const tables = page.getByRole('radiogroup', { name: 'Bảng báo cáo' });
  await click('reports.table-re', tables.getByRole('radio', { name: 'Theo RE' }));
  await tables.getByRole('radio', { name: 'Theo team' }).click();
}

async function trash() {
  await go('#/settings');
  const sections = page.getByRole('navigation', { name: 'Mục cài đặt' });
  await click('trash.open', sections.getByRole('button', { name: 'Thùng rác' }));
  await expect(page.getByRole('table', { name: 'Bản ghi đã xóa' })).toBeVisible();
  const records = page.getByRole('radiogroup', { name: 'Loại bản ghi' });
  await click('trash.kind-appointments', records.getByRole('radio', { name: /^Lịch hẹn/ }));
  await records.getByRole('radio', { name: /^Tất cả/ }).click();
}

/** The webview's JavaScript heap once every screen has been opened. */
async function memory() {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('HeapProfiler.collectGarbage');
  const { usedSize } = await cdp.send('Runtime.getHeapUsage');
  add('memory.js-heap', 'MB', usedSize / 1024 / 1024);
  await cdp.detach();
}

/** Xuất Excel and Xuất backup, each from its screen opened afresh: no notice of the run before. */
async function exports() {
  await go('#/overview');
  await go('#/reports');
  const excel = page.getByRole('button', { name: 'Xuất Excel' });
  await detached('reports.export-excel', excel, status('Đã xuất báo cáo'));
  await go('#/overview');
  await go('#/settings');
  const backup = page.getByRole('button', { name: 'Xuất backup' });
  await detached('backup.export', backup, status('Đã xuất backup'));
}

/** Tạo lịch hẹn tiếp theo, today, from a met appointment picked in Tháng or in Năm. */
async function nextAppointment(i: number, period: 'month' | 'year') {
  await go('#/appointments');
  const next = detail().getByRole('button', { name: 'Tạo lịch hẹn tiếp theo' });
  if (period === 'month') {
    await kind('Tháng').click();
    await calendar()
      .getByRole('button', { name: /Đã gặp/ })
      .nth(i)
      .click();
    // A met appointment of the day: one rescheduled offers no next one.
    for (let k = 0; !(await next.isVisible()); k++) {
      await inDay().nth(k).getByRole('button').first().click();
    }
  } else {
    await kind('Năm').click();
    // Oldest first: the newest hundred shown are all still ahead.
    // The list keeps its order between runs: click round to ascending.
    await expect(list()).toBeVisible();
    for (let k = 0; k < 3 && (await dateHeader().getAttribute('aria-sort')) !== 'ascending'; k++) {
      await byDate().click();
    }
    await expect(dateHeader()).toHaveAttribute('aria-sort', 'ascending');
    const met = list().getByRole('row').filter({ hasText: 'Đã gặp' }).nth(i);
    await met.getByRole('button').first().click();
  }
  await next.click();
  const form = page.getByRole('dialog');
  const today = new Date();
  const day = (n: number) => String(n).padStart(2, '0');
  await form
    .getByRole('textbox', { name: /^Ngày/ })
    .fill(`${day(today.getDate())}/${day(today.getMonth() + 1)}`);
  const create = form.getByRole('button', { name: 'Tạo lịch hẹn' });
  await detached(`appointments.next-${period}`, create, dialogGone, true);
}

test('perf of spec Phase 6 §5.2 on the exe release with the load data', async () => {
  if (!existsSync(BACKUP)) {
    throw new Error(
      `No load data file at ${BACKUP}: write it with node tools/load-data.mjs ` +
        '(e2e/perf/README.md, step 1), or set PERF_BACKUP to the file the exe imported.',
    );
  }
  const aiId = aiCustomer(JSON.parse(readFileSync(BACKUP, 'utf8')));
  if (!aiId) throw new Error(`${BACKUP} has no customer with an AI analysis.`);
  await connect();
  await appOpen();
  await checkLoadData();
  await go('#/appointments');
  await page
    .getByRole('radiogroup', { name: 'Góc nhìn' })
    .getByRole('radio', { name: 'Toàn bộ' })
    .check();

  // Imports first: the writes at the end change the data the next run imports again.
  for (let i = 0; i < RUNS; i++) await importBackup();
  await reloads();
  for (let i = 0; i < RUNS; i++) {
    await appointments(i);
    await customers(aiId);
    await filters();
    await trash();
  }
  await memory();
  for (let i = 0; i < RUNS; i++) await exports();
  for (let i = 0; i < RUNS; i++) {
    await nextAppointment(i, 'month');
    await nextAppointment(i, 'year');
  }
  await browser.close();

  const run = toRun([...measures.values()], new Date().toISOString(), process.env.PERF_NOTE);
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify(run, null, 2)}\n`);
  const base = BASE ? parseRun(readFileSync(resolve(ROOT, BASE), 'utf8')) : undefined;
  process.stdout.write(`\n${markdownTable(run, base)}\n\n${OUT}\n`);
});
