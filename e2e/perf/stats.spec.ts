import { expect, test } from '@playwright/test';
import {
  aiCustomer,
  compareRuns,
  loadDataError,
  markdownTable,
  parseRun,
  summarize,
  toRun,
  type PerfRun,
} from './stats';

// The pure part of the probe (e2e/perf/README.md). It runs with `pnpm e2e`; the probe itself,
// *.perf.ts, runs only with playwright.perf.config.ts against a running exe.

test('summarize gives the median, min and max of the samples', () => {
  expect(summarize([30, 10, 20])).toEqual({ runs: 3, median: 20, min: 10, max: 30 });
  // An even count takes the mean of the two middle samples.
  expect(summarize([4, 1, 3, 2])).toEqual({ runs: 4, median: 2.5, min: 1, max: 4 });
  expect(summarize([7])).toEqual({ runs: 1, median: 7, min: 7, max: 7 });
  expect(() => summarize([])).toThrow('no samples');
});

const run = (ops: PerfRun['ops']): PerfRun => ({ version: 1, at: '2026-10-13T02:00:00Z', ops });

test('toRun keys each operation by its name, rounded to 0.1, with its unit and limit', () => {
  const measured = toRun(
    [
      { name: 'appointments.period-year', unit: 'ms', samples: [14.04, 12.96, 20], limit: 200 },
      { name: 'memory.js-heap', unit: 'MB', samples: [81.234] },
    ],
    '2026-10-13T02:00:00Z',
    'Home PC',
  );
  expect(measured).toEqual({
    version: 1,
    at: '2026-10-13T02:00:00Z',
    note: 'Home PC',
    ops: {
      'appointments.period-year': { unit: 'ms', runs: 3, median: 14, min: 13, max: 20, limit: 200 },
      'memory.js-heap': { unit: 'MB', runs: 1, median: 81.2, min: 81.2, max: 81.2 },
    },
  });
  expect(parseRun(JSON.stringify(measured))).toEqual(measured);
});

test('parseRun refuses a file that is not a probe result', () => {
  expect(() => parseRun('{"version":2,"ops":{}}')).toThrow('not a perf probe result');
  expect(() => parseRun('{"version":1}')).toThrow('not a perf probe result');
  expect(() => parseRun('[1]')).toThrow('not a perf probe result');
  expect(() => parseRun('nope')).toThrow();
});

test('compareRuns gives each change and flags what got worse beyond the noise', () => {
  const base = run({
    a: { unit: 'ms', runs: 5, median: 100, min: 90, max: 110 },
    b: { unit: 'ms', runs: 5, median: 20, min: 18, max: 25 },
    c: { unit: 'ms', runs: 5, median: 100, min: 90, max: 110 },
    gone: { unit: 'ms', runs: 5, median: 5, min: 5, max: 5 },
    heap: { unit: 'MB', runs: 1, median: 80, min: 80, max: 80 },
  });
  const next = run({
    a: { unit: 'ms', runs: 5, median: 125, min: 120, max: 130 },
    // +50% but only 10 ms: noise on so short an operation.
    b: { unit: 'ms', runs: 5, median: 30, min: 28, max: 33 },
    // +15 ms but only 15%.
    c: { unit: 'ms', runs: 5, median: 115, min: 110, max: 120 },
    added: { unit: 'ms', runs: 5, median: 9, min: 8, max: 10 },
    heap: { unit: 'MB', runs: 1, median: 100, min: 100, max: 100 },
  });
  expect(compareRuns(base, next)).toEqual([
    { name: 'a', unit: 'ms', base: 100, next: 125, delta: 25, worse: true },
    { name: 'b', unit: 'ms', base: 20, next: 30, delta: 10, worse: false },
    { name: 'c', unit: 'ms', base: 100, next: 115, delta: 15, worse: false },
    { name: 'added', unit: 'ms', next: 9, worse: false },
    { name: 'heap', unit: 'MB', base: 80, next: 100, delta: 20, worse: true },
    { name: 'gone', unit: 'ms', base: 5, worse: false },
  ]);
});

test('markdownTable prints one row per operation, its limit and whether the median keeps it', () => {
  const measured = run({
    'appointments.period-year': { unit: 'ms', runs: 5, median: 14, min: 12.6, max: 20, limit: 200 },
    'reports.filter-year': { unit: 'ms', runs: 5, median: 240, min: 230, max: 260, limit: 200 },
    'memory.js-heap': { unit: 'MB', runs: 1, median: 81.2, min: 81.2, max: 81.2 },
  });
  expect(markdownTable(measured)).toBe(
    [
      '| Thao tác | Lần | Trung vị | Min | Max | Ngưỡng |',
      '|---|---|---|---|---|---|',
      '| `appointments.period-year` | 5 | 14 ms | 13 ms | 20 ms | < 200 ms ✅ |',
      '| `reports.filter-year` | 5 | 240 ms | 230 ms | 260 ms | < 200 ms ❌ |',
      '| `memory.js-heap` | 1 | 81,2 MB | 81,2 MB | 81,2 MB | — |',
    ].join('\n'),
  );
});

test('markdownTable against a base run adds the base median and the change', () => {
  const base = run({
    a: { unit: 'ms', runs: 5, median: 100, min: 90, max: 110 },
    b: { unit: 'ms', runs: 5, median: 20, min: 18, max: 25 },
  });
  const next = run({
    a: { unit: 'ms', runs: 5, median: 125, min: 120, max: 130 },
    b: { unit: 'ms', runs: 5, median: 18, min: 17, max: 19 },
    c: { unit: 'ms', runs: 5, median: 9, min: 8, max: 10 },
  });
  expect(markdownTable(next, base)).toBe(
    [
      '| Thao tác | Lần | Trung vị | Min | Max | Ngưỡng | Nền | Δ |',
      '|---|---|---|---|---|---|---|---|',
      '| `a` | 5 | 125 ms | 120 ms | 130 ms | — | 100 ms | +25 ms (+25%) ⚠️ |',
      '| `b` | 5 | 18 ms | 17 ms | 19 ms | — | 20 ms | −2 ms (−10%) |',
      '| `c` | 5 | 9 ms | 8 ms | 10 ms | — | — | — |',
    ].join('\n'),
  );
});

test('loadDataError passes the load data and names what the exe holds otherwise', () => {
  const content = (customers: string, appointments: string) =>
    `4 team · 51 nhân sự · ${customers} KH · ${appointments} lịch hẹn · 1.674 HĐ`;
  expect(loadDataError(content('1.481', '10.252'))).toBeNull();
  // The demo seed: 1 200 customers.
  expect(loadDataError(content('1.200', '6.229'))).toBe(
    'The exe holds 1200 customers and 6229 appointments, not the load data (at least 1400 and ' +
      '9000): import the load data first (e2e/perf/README.md, step 3).',
  );
  expect(loadDataError(content('1.481', '6.229'))).toContain('not the load data');
  expect(loadDataError('Đang mở dữ liệu…')).toBe(
    'Cannot read the counts of Cài đặt → Dữ liệu → Nội dung: "Đang mở dữ liệu…".',
  );
});

test('aiCustomer picks a live customer with the most AI analyses', () => {
  const customers = [
    { id: 'c1', deleted_at: null },
    { id: 'c2', deleted_at: '2026-10-12T00:00:00Z' },
    { id: 'c3', deleted_at: null },
  ];
  const analyses = (...ids: string[]) => ids.map((customer_id) => ({ customer_id }));
  expect(
    aiCustomer({ tables: { customers, ai_analyses: analyses('c1', 'c2', 'c2', 'c3', 'c3') } }),
  ).toBe('c3');
  expect(aiCustomer({ tables: { customers, ai_analyses: analyses('c2') } })).toBeUndefined();
  expect(aiCustomer({ tables: { customers, ai_analyses: [] } })).toBeUndefined();
});
