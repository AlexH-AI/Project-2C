// The pure part of the perf probe (e2e/perf/README.md): summaries, the result file, the comparison
// with a base run, and the checks before measuring. Tested in stats.spec.ts, which `pnpm e2e` runs.

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

export type OpResult = Summary & { unit: Unit; limit?: number };

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
      ...(limit === undefined ? {} : { limit }),
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

/** Milliseconds whole, as the Phase 4 tables; megabytes with one decimal, Vietnamese style. */
function format(value: number, unit: Unit): string {
  const text = unit === 'ms' ? String(Math.round(value)) : value.toFixed(1).replace('.', ',');
  return `${text.replace('-', '−')} ${unit}`;
}

function signed(value: number, unit: Unit): string {
  return `${value >= 0 ? '+' : ''}${format(value, unit)}`;
}

/** The run as a Markdown table; against `base`, with the base median and the change. */
export function markdownTable(run: PerfRun, base?: PerfRun): string {
  const head = ['Thao tác', 'Lần', 'Trung vị', 'Min', 'Max', 'Ngưỡng'];
  if (base) head.push('Nền', 'Δ');
  const changes = base ? new Map(compareRuns(base, run).map((c) => [c.name, c])) : undefined;
  const rows = Object.entries(run.ops).map(([name, op]) => {
    const limit =
      op.limit === undefined
        ? '—'
        : `< ${format(op.limit, op.unit)} ${op.median < op.limit ? '✅' : '❌'}`;
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
        const percent = Math.round((change.delta / change.base) * 100);
        cells.push(
          format(change.base, op.unit),
          `${signed(change.delta, op.unit)} (${percent >= 0 ? '+' : '−'}${Math.abs(percent)}%)` +
            (change.worse ? ' ⚠️' : ''),
        );
      }
    }
    return `| ${cells.join(' | ')} |`;
  });
  return [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows].join('\n');
}

/** The load data of spec Phase 6 §5.1 has ≈ 1 500 customers and 10 000 appointments; the demo 1 200 and 6 000. */
const LOAD_MIN = { customers: 1400, appointments: 9000 };

const count = (text: string, label: string): number | undefined => {
  const match = new RegExp(`([\\d.]+) ${label}`).exec(text);
  return match ? Number((match[1] as string).replaceAll('.', '')) : undefined;
};

/**
 * Null when Cài đặt → Dữ liệu → Nội dung ("4 team · 51 nhân sự · 1.481 KH · 10.252 lịch hẹn ·
 * 1.674 HĐ") counts the load data; else why the probe must not measure.
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
