// The pure part of the perf probe (e2e/perf/README.md): summaries, the result file, the comparison
// with a base run, and the checks before measuring. Tested in stats.spec.ts, which `pnpm e2e` runs.

import type { SpawnSyncReturns } from 'node:child_process';

export type Unit = 'ms' | 'MB';

export interface Summary {
  runs: number;
  median: number;
  min: number;
  max: number;
}

/** The samples of one operation, under its fixed name: the key two runs compare on. */
export interface Measure {
  name: string;
  unit: Unit;
  samples: readonly number[];
  /** The median must stay under it (spec Phase 6 §5.2). */
  limit?: number;
}

export type OpResult = Summary & {
  unit: Unit;
  limit?: number;
  /** Whether the median, before it was rounded, keeps the limit (CLR6-F10). */
  within?: boolean;
};

/** The JSON file of one run of the probe. */
export interface PerfRun {
  version: 1;
  /** ISO time of the run. */
  at: string;
  /** Free text: machine, exe build. */
  note?: string;
  ops: Record<string, OpResult>;
}

export function summarize(samples: readonly number[]): Summary {
  if (samples.length === 0) throw new Error('no samples');
  const sorted = [...samples].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  const median =
    sorted.length % 2 === 1
      ? (sorted[mid] as number)
      : ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2;
  return {
    runs: sorted.length,
    median,
    min: sorted[0] as number,
    max: sorted[sorted.length - 1] as number,
  };
}

const round = (value: number) => Math.round(value * 10) / 10;

export function toRun(measures: readonly Measure[], at: string, note?: string): PerfRun {
  const ops: Record<string, OpResult> = {};
  for (const { name, unit, samples, limit } of measures) {
    const { runs, median, min, max } = summarize(samples);
    ops[name] = {
      unit,
      runs,
      median: round(median),
      min: round(min),
      max: round(max),
      ...(limit === undefined ? {} : { limit, within: median < limit }),
    };
  }
  return { version: 1, at, ...(note === undefined ? {} : { note }), ops };
}

/** Reads a result file of the probe; throws on anything else. */
export function parseRun(text: string): PerfRun {
  const value: unknown = JSON.parse(text);
  const run = value as Partial<PerfRun> | null;
  if (
    typeof run !== 'object' ||
    run === null ||
    Array.isArray(run) ||
    run.version !== 1 ||
    typeof run.ops !== 'object' ||
    run.ops === null
  ) {
    throw new Error('not a perf probe result (version 1)');
  }
  return run as PerfRun;
}

export interface Change {
  name: string;
  unit: Unit;
  base?: number;
  next?: number;
  delta?: number;
  /** Worse beyond the noise: more than 20% and more than 10 ms (5 MB) above the base median. */
  worse: boolean;
}

const NOISE: Record<Unit, number> = { ms: 10, MB: 5 };
const NOISE_RATIO = 1.2;

const isWorse = (unit: Unit, base: number, next: number) =>
  next > base * NOISE_RATIO && next - base > NOISE[unit];

/** Each operation of `next` in its order, then those only `base` has. */
export function compareRuns(base: PerfRun, next: PerfRun): Change[] {
  const changes: Change[] = Object.entries(next.ops).map(([name, op]) => {
    const before = base.ops[name];
    if (!before) return { name, unit: op.unit, next: op.median, worse: false };
    return {
      name,
      unit: op.unit,
      base: before.median,
      next: op.median,
      delta: round(op.median - before.median),
      worse: isWorse(op.unit, before.median, op.median),
    };
  });
  for (const [name, op] of Object.entries(base.ops)) {
    if (!(name in next.ops)) changes.push({ name, unit: op.unit, base: op.median, worse: false });
  }
  return changes;
}

/** The value as the table shows it: milliseconds whole, megabytes to 0.1; never −0. */
const shown = (value: number, unit: Unit) =>
  (unit === 'ms' ? Math.round(value) : Math.round(value * 10) / 10) || 0;

/** Milliseconds whole, as the Phase 4 tables; megabytes with one decimal, Vietnamese style. */
function format(value: number, unit: Unit): string {
  const number = shown(value, unit);
  const text = unit === 'ms' ? String(number) : number.toFixed(1).replace('.', ',');
  return `${text.replace('-', '−')} ${unit}`;
}

/** Signed by the value shown: a change that rounds to 0 has no sign (CLR6-F10). */
function signed(value: number, unit: Unit): string {
  return `${shown(value, unit) > 0 ? '+' : ''}${format(value, unit)}`;
}

/** The change in percent of the base median; none of a base median rounded to 0. */
function ratio(delta: number, base: number): string {
  if (base === 0) return '—';
  const percent = Math.round((delta / base) * 100);
  return `${percent >= 0 ? '+' : '−'}${Math.abs(percent)}%`;
}

/**
 * The run as a Markdown table; against `base`, with the base median and the change, then a row for
 * each operation only the base has. The limit is checked on the median before it was rounded,
 * when the run kept that (`within`).
 */
export function markdownTable(run: PerfRun, base?: PerfRun): string {
  const head = ['Thao tác', 'Lần', 'Trung vị', 'Min', 'Max', 'Ngưỡng'];
  if (base) head.push('Nền', 'Δ');
  const compared = base ? compareRuns(base, run) : [];
  const changes = base ? new Map(compared.map((c) => [c.name, c])) : undefined;
  const rows = Object.entries(run.ops).map(([name, op]) => {
    const limit =
      op.limit === undefined
        ? '—'
        : `< ${format(op.limit, op.unit)} ${(op.within ?? op.median < op.limit) ? '✅' : '❌'}`;
    const cells = [
      `\`${name}\``,
      String(op.runs),
      format(op.median, op.unit),
      format(op.min, op.unit),
      format(op.max, op.unit),
      limit,
    ];
    const change = changes?.get(name);
    if (change) {
      if (change.base === undefined || change.delta === undefined) cells.push('—', '—');
      else {
        cells.push(
          format(change.base, op.unit),
          `${signed(change.delta, op.unit)} (${ratio(change.delta, change.base)})` +
            (change.worse ? ' ⚠️' : ''),
        );
      }
    }
    return `| ${cells.join(' | ')} |`;
  });
  for (const { name, unit, base: was, next } of compared) {
    if (next === undefined && was !== undefined)
      rows.push(`| \`${name}\` | — | — | — | — | — | ${format(was, unit)} | — |`);
  }
  return [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows].join('\n');
}

/** The load data of spec Phase 6 §5.1 has ≈ 1 500 customers and 10 000 appointments; the demo 1 200 and 6 000. */
const LOAD_MIN = { customers: 1400, appointments: 9000 };

const count = (text: string, label: string): number | undefined => {
  const match = new RegExp(`([\\d,]+) ${label}`).exec(text);
  return match ? Number((match[1] as string).replaceAll(',', '')) : undefined;
};

/**
 * Null when Cài đặt → Dữ liệu → Nội dung ("4 team · 51 nhân sự · 1,481 KH · 10,252 lịch hẹn ·
 * 1,674 HĐ") counts the load data; else why the probe must not measure.
 */
export function loadDataError(content: string): string | null {
  const customers = count(content, 'KH');
  const appointments = count(content, 'lịch hẹn');
  if (customers === undefined || appointments === undefined) {
    return `Cannot read the counts of Cài đặt → Dữ liệu → Nội dung: "${content}".`;
  }
  if (customers >= LOAD_MIN.customers && appointments >= LOAD_MIN.appointments) return null;
  return (
    `The exe holds ${customers} customers and ${appointments} appointments, not the load data ` +
    `(at least ${LOAD_MIN.customers} and ${LOAD_MIN.appointments}): import the load data first ` +
    '(e2e/perf/README.md, step 3).'
  );
}

/**
 * The most a backup file may weigh, to import or to export: `MAX_BACKUP_BYTES` of @p2c/db
 * (packages/db/src/backup.ts). The probe does not load @p2c/db, so the number is kept here too.
 */
export const BACKUP_LIMIT_BYTES = 100 * 1024 * 1024;

/**
 * Why the probe neither imports nor exports a backup of the load data of this size (T-485: 10× is
 * 153 MB), or null when it does both. Such data reaches the exe as its project2c.db (README).
 */
export function backupSkipped(bytes: number): string | null {
  if (bytes <= BACKUP_LIMIT_BYTES) return null;
  const mb = (n: number) => Math.round(n / 1024 / 1024);
  return (
    `The load data file is ${mb(bytes)} MB, over the ${mb(BACKUP_LIMIT_BYTES)} MB the app ` +
    'imports or exports: backup.read, backup.import and backup.export are not measured.'
  );
}

/** The number of runs `text` asks for: a whole number, at least 1; else undefined (T-525). */
export function runCount(text: string | undefined): number | undefined {
  const runs = Number(text);
  return text?.trim() && Number.isInteger(runs) && runs >= 1 ? runs : undefined;
}

/**
 * The WebView2 browser process the CDP session belongs to, in what `SystemInfo.getProcessInfo`
 * lists: the probe and the script that times reopening both find the exe's processes by it.
 */
export function browserPid(processes: readonly { type: string; id: number }[]): number | undefined {
  return processes.find((p) => p.type === 'browser')?.id;
}

/** A WebView2 process (msedgewebview2.exe), as Windows lists it. */
export interface WebviewProcess {
  id: number;
  parentId: number;
  commandLine: string;
  /** Private Bytes. */
  privateBytes: number;
}

/**
 * The Private Bytes, in MB, of the WebView2 processes of the exe the probe is connected to: its
 * browser process (`browserId`, which CDP gives) and that process's children, all of them, and the
 * renderer, where the page and the WebAssembly memory of sql.js live (which `memory.js-heap` leaves
 * out). Not by the exe's name: the installed app, the trial exe and `pnpm dev` run as project2c.exe
 * too (T-523). Undefined when that process is not in the list.
 */
export function webviewMemory(
  processes: readonly WebviewProcess[],
  browserId: number | undefined,
): { total: number; renderer: number } | undefined {
  if (!processes.some((p) => p.id === browserId)) return undefined;
  const own = processes.filter((p) => p.id === browserId || p.parentId === browserId);
  const mb = (list: readonly WebviewProcess[]) =>
    list.reduce((sum, p) => sum + p.privateBytes, 0) / 1024 / 1024;
  return {
    total: mb(own),
    renderer: mb(own.filter((p) => p.commandLine.includes('--type=renderer'))),
  };
}

/**
 * The WebView2 processes in the JSON list the probe's PowerShell query printed, or why none: it did
 * not run, failed (`-ErrorAction Stop` exits 1) or printed no list. `[]` is no WebView2 (T-523).
 */
export function readProcessList(
  ran: Pick<SpawnSyncReturns<string>, 'status' | 'stdout' | 'stderr' | 'error'>,
): { processes: WebviewProcess[] } | { error: string } {
  if (ran.error) return { error: `PowerShell did not run: ${ran.error.message}` };
  if (ran.status !== 0) {
    const reason = ran.stderr.trim().split('\n')[0]?.trim();
    return { error: `the process query failed (exit ${ran.status}): ${reason}` };
  }
  const printed = ran.stdout.trim();
  let list: (Partial<Record<keyof WebviewProcess, unknown>> | null)[] | undefined;
  try {
    list = JSON.parse(printed);
  } catch {
    // No list: below.
  }
  const fit = (p: Partial<Record<keyof WebviewProcess, unknown>> | null) =>
    typeof p?.commandLine === 'string' &&
    (['id', 'parentId', 'privateBytes'] as const).every((key) => typeof p[key] === 'number');
  return Array.isArray(list) && list.every(fit)
    ? { processes: list as WebviewProcess[] }
    : { error: `the process query printed no list: "${printed.slice(0, 80)}"` };
}

interface BackupTables {
  tables: {
    customers: readonly { id: string; deleted_at: string | null }[];
    ai_analyses: readonly { customer_id: string }[];
  };
}

/** A customer not in Thùng rác with the most AI analyses: its profile shows the history. */
export function aiCustomer(backup: BackupTables): string | undefined {
  const live = new Set(
    backup.tables.customers.filter((c) => c.deleted_at === null).map((c) => c.id),
  );
  const counts = new Map<string, number>();
  for (const { customer_id: id } of backup.tables.ai_analyses) {
    if (live.has(id)) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  let best: string | undefined;
  for (const [id, n] of counts)
    if (best === undefined || n > (counts.get(best) as number)) best = id;
  return best;
}
