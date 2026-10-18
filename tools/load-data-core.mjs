/* global Buffer */
// The load data of spec Phase 6 §5.1 (T-216), run by tools/load-data.mjs: the simulated data of
// `seedDemoData` at a bigger scale and with Thùng rác, as a backup file the app imports
// (Cài đặt → Nhập backup) and `importBackup` reads. The same anchor day and seed give the same
// rows on any machine from UTC−12 to UTC+11 (`seedDemoData`); the hash of `tables` lets two
// machines compare at a glance.
//
// Everything here takes its I/O as arguments, so it is unit-tested in load-data-core.test.mjs.

import { createHash } from 'node:crypto';
import { exportBackup, openDatabase, seedDemoData } from '../packages/db/src/index.ts';
import { compareDates, formatIsoDate, fromIsoDate } from '../packages/domain/src/period.ts';

/** ≈ 1 500 customers, 10 000 appointments and 50 people, as the Phase 1–4 deep review's. */
export const LOAD_SCALE = {
  teams: 4,
  resPerTeam: 11,
  customersPerRe: 34,
  meetingDays: [4, 4],
};

export const LOAD_ANCHOR = '2026-10-12';
export const LOAD_SEED = 6;

const USAGE = 'node tools/load-data.mjs [--out <file>] [--anchor yyyy-mm-dd] [--seed <n>]';

/**
 * The command's options, or `{ error }`. `today` is the machine's: a later anchor day would date
 * meetings after it, which an import refuses (spec Phase 3 §6 rule 10).
 */
export function parseLoadArgs(argv, today) {
  const options = { anchor: LOAD_ANCHOR, seed: LOAD_SEED, out: undefined };
  for (let i = 0; i < argv.length; i += 2) {
    const [flag, value] = [argv[i], argv[i + 1]];
    if (value === undefined || !['--out', '--anchor', '--seed'].includes(flag)) {
      return { error: `Usage: ${USAGE}` };
    }
    options[flag.slice(2)] = value;
  }
  let anchorDate;
  try {
    anchorDate = fromIsoDate(options.anchor);
  } catch {
    return { error: `--anchor is not a yyyy-mm-dd date: ${options.anchor}` };
  }
  if (compareDates(anchorDate, today) > 0) {
    return { error: `--anchor ${options.anchor} is after today: the app would refuse the file` };
  }
  const seed = Number(options.seed);
  if (!/^\d+$/.test(options.seed) || seed > 0xffff_ffff) {
    return { error: `--seed is not an integer from 0 to 4294967295: ${options.seed}` };
  }
  const anchor = formatIsoDate(anchorDate);
  return {
    anchorDate,
    seed,
    out: options.out ?? `.local/load-data/load-${anchor}-seed${seed}.p2cbackup`,
  };
}

/** The backup text, its rows by table and the hash of its `tables`. */
export async function buildLoadData({ anchorDate, seed, scale = LOAD_SCALE }) {
  const db = await openDatabase();
  try {
    seedDemoData(db, { anchorDate, seed, scale, trash: true });
    const text = exportBackup(db);
    const { tables } = JSON.parse(text);
    return {
      text,
      rows: Object.fromEntries(Object.entries(tables).map(([name, rows]) => [name, rows.length])),
      hash: tablesHash(tables),
    };
  } finally {
    db.sqlite.close();
  }
}

/** SHA-256 of the `tables` of a backup, as the file writes them. */
export function tablesHash(tables) {
  return createHash('sha256').update(JSON.stringify(tables)).digest('hex');
}

export function formatReport({ out, rows, hash, bytes }) {
  const width = Math.max(...Object.keys(rows).map((name) => name.length));
  return [
    ...Object.entries(rows).map(([name, count]) => `${name.padEnd(width)}  ${count}`),
    '',
    `tables sha256  ${hash}`,
    `${out}  ${(bytes / 1024 / 1024).toFixed(1)} MB`,
  ].join('\n');
}

/** Runs the command; returns the exit code. */
export async function loadDataMain({ argv, today, writeFile, log }) {
  const options = parseLoadArgs(argv, today);
  if (options.error) {
    log(options.error);
    return 1;
  }
  const { text, rows, hash } = await buildLoadData(options);
  writeFile(options.out, text);
  log(formatReport({ out: options.out, rows, hash, bytes: Buffer.byteLength(text) }));
  return 0;
}
