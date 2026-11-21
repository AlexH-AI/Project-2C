import { beforeAll, describe, expect, it } from 'vitest';
import {
  importBackup,
  listAppointments,
  listCustomers,
  listPeople,
  listTrash,
} from '../packages/db/src/index.ts';
import { calendarDate } from '../packages/domain/src/period.ts';
import {
  buildLoadData,
  formatReport,
  LOAD_ANCHOR,
  LOAD_SCALE,
  LOAD_SEED,
  loadDataMain,
  loadScale,
  parseLoadArgs,
  tablesHash,
} from './load-data-core.mjs';

const TODAY = calendarDate(2026, 10, 12);
const SMALL = { teams: 2, rmsPerTeam: 2, customersPerRm: 10, meetingDays: [3, 4] };
const SLOW = 180_000;

describe('parseLoadArgs', () => {
  it('pins the anchor day, the seed, the scale and the file by default', () => {
    expect(parseLoadArgs([], TODAY)).toEqual({
      anchorDate: calendarDate(2026, 10, 12),
      seed: 6,
      scale: 1,
      out: '.local/load-data/load-2026-10-12-seed6.p2cbackup',
    });
    expect([LOAD_ANCHOR, LOAD_SEED]).toEqual(['2026-10-12', 6]);
  });

  it('takes another anchor day, seed, scale and file', () => {
    expect(
      parseLoadArgs(
        ['--seed', '0', '--anchor', '2026-02-28', '--scale', '5', '--out', 'C:/data/x.p2cbackup'],
        TODAY,
      ),
    ).toEqual({
      anchorDate: calendarDate(2026, 2, 28),
      seed: 0,
      scale: 5,
      out: 'C:/data/x.p2cbackup',
    });
    expect(parseLoadArgs(['--seed', '4294967295'], TODAY).seed).toBe(4_294_967_295);
  });

  it('names the default file after a scale above 1', () => {
    expect(parseLoadArgs(['--scale', '1'], TODAY).out).toBe(
      '.local/load-data/load-2026-10-12-seed6.p2cbackup',
    );
    expect(parseLoadArgs(['--scale', '10', '--seed', '2'], TODAY).out).toBe(
      '.local/load-data/load-2026-10-12-seed2-x10.p2cbackup',
    );
    expect(parseLoadArgs(['--scale', '20'], TODAY).scale).toBe(20);
  });

  it.each([
    [['--anchor', '2026-02-29'], '--anchor is not a yyyy-mm-dd date: 2026-02-29'],
    [['--anchor', '12/10/2026'], '--anchor is not a yyyy-mm-dd date: 12/10/2026'],
    [
      ['--anchor', '2026-10-13'],
      '--anchor 2026-10-13 is after today: the app would refuse the file',
    ],
    [['--seed', '-1'], '--seed is not an integer from 0 to 4294967295: -1'],
    [['--seed', '1.5'], '--seed is not an integer from 0 to 4294967295: 1.5'],
    [['--seed', '4294967296'], '--seed is not an integer from 0 to 4294967295: 4294967296'],
    [['--scale', '0'], '--scale is not an integer from 1 to 20: 0'],
    [['--scale', '-2'], '--scale is not an integer from 1 to 20: -2'],
    [['--scale', 'five'], '--scale is not an integer from 1 to 20: five'],
    [['--scale', '2.5'], '--scale is not an integer from 1 to 20: 2.5'],
    [['--scale', '21'], '--scale is not an integer from 1 to 20: 21'],
  ])('refuses %j', (argv, error) => {
    expect(parseLoadArgs(argv, TODAY)).toEqual({ error });
  });

  it.each([[['--out']], [['--size', '2']], [['out', 'x']]])('shows the usage for %j', (argv) => {
    expect(parseLoadArgs(argv, TODAY).error).toMatch(/^Usage: node tools\/load-data\.mjs/);
  });
});

describe('buildLoadData', () => {
  it(
    'gives the same tables for the same anchor day and seed, and others for another seed',
    async () => {
      const anchorDate = calendarDate(2026, 9, 15);
      const first = await buildLoadData({ anchorDate, seed: 1, scale: SMALL });
      const second = await buildLoadData({ anchorDate, seed: 1, scale: SMALL });
      const other = await buildLoadData({ anchorDate, seed: 2, scale: SMALL });
      expect(second.hash).toBe(first.hash);
      expect(other.hash).not.toBe(first.hash);
      // The hash is of the tables alone: the export time differs from run to run.
      expect(first.hash).toBe(tablesHash(JSON.parse(first.text).tables));
      expect(first.rows.customers).toBe(40);
    },
    SLOW,
  );
});

describe('loadScale', () => {
  it('is the load data itself at 1, and its teams times n above', () => {
    expect(loadScale(1)).toEqual(LOAD_SCALE);
    expect(loadScale(5)).toEqual({ ...LOAD_SCALE, teams: LOAD_SCALE.teams * 5 });
    expect(loadScale(3, SMALL)).toEqual({ ...SMALL, teams: 6 });
  });
});

describe('--scale', () => {
  /** The tables the command writes on a small base scale, and the file it names. */
  const run = async (argv) => {
    const written = new Map();
    const code = await loadDataMain({
      argv,
      today: TODAY,
      base: SMALL,
      writeFile: (path, text) => written.set(path, text),
      log: () => {},
    });
    expect(code).toBe(0);
    const [[path, text]] = written;
    return { path, tables: JSON.parse(text).tables };
  };

  it(
    'gives about 5 times the customers and appointments, in teams of the same make',
    async () => {
      const one = await run([]);
      const five = await run(['--scale', '5']);
      expect(five.path).toBe('.local/load-data/load-2026-10-12-seed6-x5.p2cbackup');
      const times = (name) => five.tables[name].length / one.tables[name].length;
      for (const name of ['customers', 'appointments']) {
        expect(times(name), name).toBeGreaterThan(4.5);
        expect(times(name), name).toBeLessThan(5.5);
      }
      // Each base team again, plus the one team of Thùng rác.
      expect(five.tables.teams).toHaveLength(SMALL.teams * 5 + 1);
    },
    SLOW,
  );
});

describe('the load data of the command', () => {
  const written = new Map();
  const logged = [];
  let code;
  let db;
  beforeAll(async () => {
    code = await loadDataMain({
      argv: [],
      today: TODAY,
      writeFile: (path, text) => written.set(path, text),
      log: (line) => logged.push(line),
    });
    ({ db } = await importBackup(written.get('.local/load-data/load-2026-10-12-seed6.p2cbackup')));
  }, SLOW);

  it(
    'writes the same tables with --scale 1',
    async () => {
      const again = new Map();
      await loadDataMain({
        argv: ['--scale', '1'],
        today: TODAY,
        writeFile: (path, text) => again.set(path, text),
        log: () => {},
      });
      const hash = (text) => tablesHash(JSON.parse(text).tables);
      const [[path, text]] = again;
      expect(path).toBe('.local/load-data/load-2026-10-12-seed6.p2cbackup');
      expect(hash(text)).toBe(hash(written.get(path)));
    },
    SLOW,
  );

  it('writes a file the import takes and prints its rows and hash', () => {
    expect(code).toBe(0);
    expect(written.size).toBe(1);
    expect(logged).toHaveLength(1);
    expect(logged[0]).toMatch(/^customers {2,}\d+$/m);
    expect(logged[0]).toMatch(/^tables sha256 {2}[0-9a-f]{64}$/m);
    expect(logged[0]).toMatch(
      /^\.local\/load-data\/load-2026-10-12-seed6\.p2cbackup {2}\d+\.\d MB$/m,
    );
  });

  it('has about 1 500 customers, 10 000 appointments, 50 people and some AI analyses', () => {
    const between = (count, min, max) => {
      expect(count).toBeGreaterThanOrEqual(min);
      expect(count).toBeLessThanOrEqual(max);
    };
    between(listCustomers(db).length, 1400, 1600);
    between(listAppointments(db).length, 9500, 10500);
    between(listPeople(db).length, 45, 55);
    const analyses = db.sqlite.exec('SELECT COUNT(*) FROM ai_analyses')[0].values[0][0];
    expect(analyses).toBeGreaterThan(0);
  });

  it('fills Thùng rác with every kind of record, some restorable and some blocked', () => {
    const trash = listTrash(db);
    const kinds = (rows) => [...new Set(rows.map((row) => row.kind))].sort();
    const all = ['appointment', 'customer', 'person', 'policy', 'team'];
    expect(kinds(trash)).toEqual(all);
    expect(kinds(trash.filter((row) => !row.blocked))).toEqual(all);
    expect(kinds(trash.filter((row) => row.blocked))).toEqual(['appointment', 'person', 'policy']);
  });
});

describe('loadDataMain', () => {
  it('writes nothing on wrong options', async () => {
    const logged = [];
    const code = await loadDataMain({
      argv: ['--seed', 'x'],
      today: TODAY,
      writeFile: () => expect.unreachable(),
      log: (line) => logged.push(line),
    });
    expect(code).toBe(1);
    expect(logged).toEqual(['--seed is not an integer from 0 to 4294967295: x']);
  });
});

describe('formatReport', () => {
  it('lines up the rows of each table, then the hash and the file', () => {
    expect(
      formatReport({
        out: 'load.p2cbackup',
        rows: { teams: 5, appointments: 10414 },
        hash: 'ab',
        bytes: 16_000_000,
      }),
    ).toBe(
      [
        'teams         5',
        'appointments  10414',
        '',
        'tables sha256  ab',
        'load.p2cbackup  15.3 MB',
      ].join('\n'),
    );
  });
});
