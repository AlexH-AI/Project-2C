// Times opening the exe release again on the data it holds (T-523), the way of T-227
// (docs/metrics/phase-6.md, "Mở app lần đầu, đo lại"). Steps and options: e2e/perf/README.md.
//   node e2e/perf/reopen.mts <folder of project2c.exe> [--runs 3] [--screen overview] [--out <file>]
// The app opens on its last screen, kept in the WebView2 profile every project2c.exe shares: an
// opening not timed sets --screen for the timed ones, and the last one puts the old screen back.
// Stopped half way, it closes the exe and says which screen to put back by hand (T-525).

import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { parseArgs } from 'node:util';
import { chromium } from '@playwright/test';
import { browserPid, routeLeftNote, runCount, summarize } from './stats.ts';

const options = {
  runs: { type: 'string', default: '3' },
  screen: { type: 'string', default: 'overview' },
  out: { type: 'string' },
} as const;
const { values, positionals } = parseArgs({ allowPositionals: true, options });
const exe = resolve(positionals[0] ?? '.', 'project2c.exe');
// Without Project2C-data beside it the exe opens the installed app's data (ADR-0019 §2).
if (!existsSync(join(dirname(exe), 'Project2C-data'))) {
  throw new Error(`No portable exe at ${exe}: copy it with Project2C-data\\ beside it (README).`);
}
const runs = runCount(values.runs);
if (runs === undefined) {
  throw new Error(`--runs is ${values.runs}: give a whole number of runs, at least 1.`);
}
const CDP = 'http://127.0.0.1:9222';
process.env.WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS = '--remote-debugging-port=9222';
const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));
const portUp = () => fetch(`${CDP}/json/version`).then(Boolean, () => false);

// Started before any timing, so that its own start costs the opening nothing: puts the window of
// each process id it reads on top, once it shows (a covered WebView2 paints no frame). One line
// answers each id: `pinned True`, or `pinned False: <why>` (Add-Type blocked, no window; T-525).
const PIN = `$ErrorActionPreference = 'Stop'
try { Add-Type -Name W -Namespace P -MemberDefinition '[DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr a, int x, int y, int cx, int cy, uint f);'; $why = '' } catch { $why = $_.Exception.Message }
'ready'
while (($id = [Console]::In.ReadLine()) -ne $null) {
  try {
    if ($why) { throw $why }
    $p = Get-Process -Id $id; $w = [Diagnostics.Stopwatch]::StartNew()
    while ($p.MainWindowHandle -eq 0 -and $w.ElapsedMilliseconds -lt 10000) { Start-Sleep -Milliseconds 5; $p.Refresh() }
    if ($p.MainWindowHandle -eq 0) { throw 'no window in 10 s' }
    'pinned ' + [P.W]::SetWindowPos($p.MainWindowHandle, [IntPtr](-1), 0, 0, 0, 0, 0x43)
  } catch { 'pinned False: ' + ($_.Exception.Message -replace '\\s+', ' ') }
}`;
const pin = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', PIN]);
let pinErrors = '';
pin.stderr.setEncoding('utf8').on('data', (text: string) => (pinErrors += text));
// A write to a PowerShell already gone (EPIPE) is no crash: `said` tells why, from its stderr.
pin.stdin.on('error', () => undefined);
const lines = createInterface({ input: pin.stdout })[Symbol.asyncIterator]();

/** The next line of the PowerShell script within `ms`; else it stops, with what it wrote to stderr. */
async function said(ms: number): Promise<string> {
  let timer: NodeJS.Timeout | undefined;
  const late = new Promise<'late'>((done) => (timer = setTimeout(done, ms, 'late')));
  const next = await Promise.race([lines.next(), late]).finally(() => clearTimeout(timer));
  if (next !== 'late' && !next.done) return String(next.value);
  // Its stderr is read to the end once it has closed.
  if (next !== 'late' && pin.exitCode === null && pin.signalCode === null)
    await new Promise((done) => pin.once('close', done));
  const why = pinErrors.trim().split(/\r?\n/)[0] || 'nothing on its stderr';
  throw new Error(
    next === 'late'
      ? `PowerShell said nothing in ${ms / 1000} s: ${why}`
      : `PowerShell stopped: ${why}`,
  );
}

/** Runs in the page: the marks of its opening, and each LCP candidate with what it painted. */
async function marks() {
  const lcp = await new Promise<PerformanceEntry[]>((done) => {
    const observer = new PerformanceObserver((list) => done(list.getEntries()));
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    setTimeout(() => done([]), 1_000);
  });
  const mark = (name: string) => performance.getEntriesByName(name)[0]?.startTime ?? NaN;
  const what = (el: Element | null) =>
    el ? `${el.tagName} "${el.textContent?.trim().slice(0, 40)}"` : '?';
  return {
    ...{ origin: performance.timeOrigin, screen: location.hash },
    // "Giảm chuyển động" of the machine, which the moves of the app follow (README).
    calm: matchMedia('(prefers-reduced-motion: reduce)').matches,
    hidden: performance.getEntriesByType('visibility-state').some((e) => e.name === 'hidden'),
    ...{ dataOpen: mark('p2c:data-open'), fcp: mark('first-contentful-paint') },
    lcp: lcp.map((e) => [e.startTime, what((e as LargestContentfulPaint).element)] as const),
  };
}

const ROUTE = 'p2c.lastRoute';
/**
 * p2c.lastRoute before the first opening (undefined until read), what the script wrote there
 * (undefined until it writes one), and what it is writing there (undefined once that answered).
 */
let before: string | null | undefined;
let left: string | null | undefined;
let writing: string | null | undefined;
/** The exe open now: closed by force when the script stops half way. */
let app: ChildProcess | undefined;

/** One opening, timed or not, leaving `next` as the screen the following one opens on. */
async function open(timed: boolean, next: string | null) {
  if (await portUp()) throw new Error(`${CDP} answers already: close that exe or WebView2 first.`);
  const called = Date.now();
  const opened = (app = spawn(exe, [], { stdio: 'ignore' }));
  pin.stdin.write(`${opened.pid}\n`);
  const pinned = await said(30_000);
  if (pinned !== 'pinned True') {
    const why = pinned.replace(/^pinned False:?\s*/, '') || 'SetWindowPos refused';
    throw new Error(`The exe window was not put on top: ${why}`);
  }
  await sleep(12_000); // A debugger slows the opening: connect only once it is over.
  const browser = await chromium.connectOverCDP(CDP);
  let read: Awaited<ReturnType<typeof marks>> | undefined;
  let webview: number | undefined;
  try {
    const [page] = browser.contexts()[0]?.pages() ?? [];
    if (!page) throw new Error(`${CDP} has no window of the exe.`);
    read = timed ? await page.evaluate(marks) : undefined;
    // Read once: null (no screen kept) is an answer too.
    if (before === undefined)
      before = await page.evaluate((key) => localStorage.getItem(key), ROUTE);
    writing = next;
    await page.evaluate(
      ([key, hash]) => (hash ? localStorage.setItem(key, hash) : localStorage.removeItem(key)),
      [ROUTE, next] as const,
    );
    [left, writing] = [next, undefined];
    // Closed once its WebView2 browser process is gone too: a new exe would join one still closing.
    const session = await browser.newBrowserCDPSession();
    webview = browserPid((await session.send('SystemInfo.getProcessInfo')).processInfo);
  } finally {
    await browser.close();
  }
  const pid = webview ?? opened.pid;
  spawnSync('taskkill', ['/PID', String(opened.pid)]); // As its ✕: WM_CLOSE.
  const alive = () => spawnSync('tasklist', ['/FI', `PID eq ${pid}`]).stdout.includes(` ${pid} `);
  let forced = false;
  for (let t = 0; opened.exitCode === null || alive() || (await portUp()); t++) {
    // Now and then, once Playwright has been connected, the exe misses it: by force then.
    if (t === 150)
      forced = spawnSync('taskkill', ['/F', '/T', '/PID', String(opened.pid)]).status === 0;
    if (t === 300) throw new Error(`The exe (${opened.pid}) did not close in 60 s.`);
    await sleep(200);
  }
  app = undefined;
  if (!read) return undefined;
  if (read.hidden) throw new Error('The exe window was covered: run again.');
  // A screen the app does not know opens Tổng quan: the times would be of another screen.
  if (read.screen !== `#/${values.screen}`) {
    throw new Error(`The exe opened ${read.screen || 'no screen'}, not #/${values.screen}.`);
  }
  const [lcpAt = NaN, element] = read.lcp.at(-1) ?? [];
  const start = read.origin - called;
  const run = { ...read, forced, start, lcpAt, callToLcp: start + lcpAt };
  const ms = (key: Key) => run[key].toFixed(0);
  console.log(
    `  call → page start ${ms('start')} ms · p2c:data-open ${ms('dataOpen')} · FCP ${ms('fcp')} · LCP ` +
      `${ms('lcpAt')} (${element}) · call → LCP ${ms('callToLcp')} · ${read.screen}${forced ? ', closed by force' : ''}`,
  );
  return run;
}
type Key = 'start' | 'dataOpen' | 'fcp' | 'lcpAt' | 'callToLcp';

const done: NonNullable<Awaited<ReturnType<typeof open>>>[] = [];
try {
  if ((await said(60_000)) !== 'ready') throw new Error('PowerShell did not start its script.');
  await open(false, `#/${values.screen}`);
  for (let i = 0; i < runs; i++)
    done.push((await open(true, i < runs - 1 ? `#/${values.screen}` : (before ?? null)))!);
} catch (error) {
  if (app?.exitCode === null) spawnSync('taskkill', ['/F', '/T', '/PID', String(app.pid)]);
  const note = routeLeftNote(ROUTE, before, left, writing);
  if (note) console.error(note);
  throw error;
} finally {
  pin.stdin.end();
  pin.kill();
}
const series = (key: Key) => {
  const all = done.map((run) => Math.round(run[key]));
  const { median, min, max } = summarize(all);
  console.log(`${key}: ${median} ms (${min}–${max})`);
  return { all, median };
};
const at = new Date().toISOString();
const result = {
  ...{ version: 1, at, exe, screen: values.screen, runs },
  ...{ callToPageStartMs: series('start'), openDataMs: series('dataOpen'), fcpMs: series('fcp') },
  ...{ lcpMs: series('lcpAt'), callToLcpMs: series('callToLcp'), details: done },
};
const out = resolve(values.out ?? `.local/perf/reopen-${at.replace(/\D/g, '').slice(0, 12)}.json`);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`);
console.log(out);
