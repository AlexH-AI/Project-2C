// Times opening the exe release again on the data it holds (T-523), the way of T-227
// (docs/metrics/phase-6.md, "Mở app lần đầu, đo lại"). Steps and options: e2e/perf/README.md.
//   node e2e/perf/reopen.mts <folder of project2c.exe> [--runs 3] [--screen overview] [--out <file>]
// The app opens on its last screen, kept in the WebView2 profile every project2c.exe shares: an
// opening not timed sets --screen for the timed ones, and the last one puts the old screen back.

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { parseArgs } from 'node:util';
import { chromium } from '@playwright/test';

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
const runs = Number(values.runs);
const CDP = 'http://127.0.0.1:9222';
process.env.WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS = '--remote-debugging-port=9222';
const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));
const portUp = () => fetch(`${CDP}/json/version`).then(Boolean, () => false);

// Started before any timing, so that its own start costs the opening nothing: puts the window of
// each process id it reads on top, once it shows (a covered WebView2 paints no frame).
const PIN = `Add-Type -Name W -Namespace P -MemberDefinition '[DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr a, int x, int y, int cx, int cy, uint f);'
'ready'
while (($id = [Console]::In.ReadLine()) -ne $null) {
  $p = Get-Process -Id $id; $n = 0
  while ($p.MainWindowHandle -eq 0 -and $n++ -lt 2000) { Start-Sleep -Milliseconds 5; $p.Refresh() }
  'pinned ' + [P.W]::SetWindowPos($p.MainWindowHandle, [IntPtr](-1), 0, 0, 0, 0, 0x43)
}`;
const pin = spawn('powershell.exe', ['-NoProfile', '-Command', PIN], { stdio: 'pipe' });
const said = createInterface({ input: pin.stdout })[Symbol.asyncIterator]();
await said.next();

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
let before: string | null = null;

/** One opening, timed or not, leaving `next` as the screen the following one opens on. */
async function open(timed: boolean, next: string | null) {
  if (await portUp()) throw new Error(`${CDP} answers already: close that exe or WebView2 first.`);
  const called = Date.now();
  const app = spawn(exe, [], { stdio: 'ignore' });
  pin.stdin.write(`${app.pid}\n`);
  const pinned = String((await said.next()).value).endsWith('True');
  await sleep(12_000); // A debugger slows the opening: connect only once it is over.
  const browser = await chromium.connectOverCDP(CDP);
  const [page] = browser.contexts()[0]?.pages() ?? [];
  if (!page) throw new Error(`${CDP} has no window of the exe.`);
  const read = timed ? await page.evaluate(marks) : undefined;
  before = timed ? before : await page.evaluate((key) => localStorage.getItem(key), ROUTE);
  await page.evaluate(
    ([key, hash]) => (hash ? localStorage.setItem(key, hash) : localStorage.removeItem(key)),
    [ROUTE, next] as const,
  );
  // Closed once its WebView2 browser process is gone too: a new exe would join one still closing.
  const session = await browser.newBrowserCDPSession();
  const { processInfo } = await session.send('SystemInfo.getProcessInfo');
  const webview = processInfo.find((p) => p.type === 'browser')?.id ?? app.pid;
  await browser.close();
  spawnSync('taskkill', ['/PID', String(app.pid)]); // As its ✕: WM_CLOSE.
  const alive = () =>
    spawnSync('tasklist', ['/FI', `PID eq ${webview}`]).stdout.includes(` ${webview} `);
  let forced = false;
  for (let t = 0; app.exitCode === null || alive() || (await portUp()); t++) {
    // Now and then, once Playwright has been connected, the exe misses it: by force then.
    if (t === 150)
      forced = spawnSync('taskkill', ['/F', '/T', '/PID', String(app.pid)]).status === 0;
    if (t === 300) throw new Error(`The exe (${app.pid}) did not close in 60 s.`);
    await sleep(200);
  }
  if (!read) return undefined;
  if (read.hidden || !pinned) throw new Error('The exe window was covered: run again.');
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

await open(false, `#/${values.screen}`);
const done: NonNullable<Awaited<ReturnType<typeof open>>>[] = [];
for (let i = 0; i < runs; i++)
  done.push((await open(true, i < runs - 1 ? `#/${values.screen}` : before))!);
pin.stdin.end();
const series = (key: Key) => {
  const all = done.map((run) => Math.round(run[key]));
  const sorted = [...all].sort((a, b) => a - b);
  const median = (sorted[(runs - 1) >> 1]! + sorted[runs >> 1]!) / 2;
  console.log(`${key}: ${median} ms (${sorted[0]}–${sorted.at(-1)})`);
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
