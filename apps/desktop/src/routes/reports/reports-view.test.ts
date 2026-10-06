import {
  listAppointments,
  listCustomers,
  listPeople,
  listPolicies,
  listStageTransitions,
  listTeams,
  openDatabase,
  seedDemoData,
} from '@p2c/db';
import {
  appointmentCounts,
  calendarDate,
  customPeriod,
  periodMetrics,
  periodOf,
  reportMarks,
  snapshotDate,
  stageSnapshot,
  type Period,
  type Scope,
} from '@p2c/domain';
import { beforeAll, describe, expect, it } from 'vitest';
import { countedWindow } from '../overview/overview-view';
import {
  APPOINTMENTS,
  CUSTOMERS,
  PEOPLE,
  POLICIES,
  STAGE_TRANSITIONS,
  TEAMS,
} from '../../../../../packages/domain/src/golden/metrics.fixture';
import {
  REPORT_STAGES,
  reportCells,
  reportRows,
  summaryMeta,
  type ReportData,
  type ReportFigures,
} from './reports-view';

const GOLDEN = {
  people: PEOPLE,
  teams: TEAMS,
  customers: CUSTOMERS,
  policies: POLICIES,
  appointments: APPOINTMENTS,
  transitions: STAGE_TRANSITIONS,
};
const d = calendarDate;
const JAN_2027 = periodOf('month', d(2027, 1, 1));
/** Seeding the demo data takes seconds, more under coverage on a busy machine. */
const SEEDING = 60_000;
/** Columns 5–10 of a row: Chuyển RF, HĐ nộp, Case size, HĐ phát hành, Doanh số, Tỉ lệ chốt. */
const results = (cells: readonly string[]) => cells.slice(5, 11);
const APPOINTMENT_KEYS = ['met', 'missed', 'unrecorded', 'planned', 'total'];
const RESULT_KEYS = ['rfCount', 'submittedCount', 'caseSize', 'issuedCount', 'revenue'];
/** Each key added over the parts. */
const total = (parts: readonly object[], keys = APPOINTMENT_KEYS) =>
  Object.fromEntries(
    keys.map((key) => [
      key,
      parts.reduce((sum, part) => sum + (part as Record<string, number>)[key]!, 0),
    ]),
  );

describe('reportRows', () => {
  it('lists the teams by Vietnamese name: D before Đ, whatever order they were made in', () => {
    const [a, b] = TEAMS as [(typeof TEAMS)[number], (typeof TEAMS)[number]];
    const teams = [
      { ...b, name: 'Đông Hải' },
      { ...a, name: 'Dương Quang' },
    ];
    const rows = reportRows({ ...GOLDEN, teams }, JAN_2027, { kind: 'all' }, d(2027, 3, 15));

    expect(rows.byTeam?.rows.map((row) => row.name)).toEqual(['Dương Quang', 'Đông Hải']);
  });

  it('adds the teams up in Tổng: Team A 2/3 + Team B 3/2 → 5/5 = 100% (G09–G11)', () => {
    const rows = reportRows(GOLDEN, JAN_2027, { kind: 'all' }, d(2027, 3, 15));

    expect(rows.summary.name).toBe('Toàn bộ');
    expect(results(reportCells(rows.summary))).toEqual(['5', '5', '1,9 tỷ', '5', '2,3 tỷ', '100%']);
    expect(rows.byTeam?.rows.map((row) => row.name)).toEqual(['Team A', 'Team B']);
    expect(rows.byTeam?.rows.map((row) => results(reportCells(row)))).toEqual([
      ['3', '3', '1,5 tỷ', '2', '1,5 tỷ', '66,7%'],
      ['2', '2', '400 tr', '3', '800 tr', '150%'],
    ]);
    expect(rows.byTeam?.total.name).toBe('Tổng');
    expect(rows.byTeam?.total.metrics?.closeRate).toEqual({ numerator: 5, denominator: 5 });
    expect(results(reportCells(rows.byTeam!.total))).toEqual([
      '5',
      '5',
      '1,9 tỷ',
      '5',
      '2,3 tỷ',
      '100%',
    ]);
  });

  it('lists every RE by team, then name, with its team; 0 RF shows "—" (G15)', () => {
    const rows = reportRows(GOLDEN, JAN_2027, { kind: 'all' }, d(2027, 3, 15));

    expect(rows.byRe?.rows.map((row) => [row.team, row.name])).toEqual([
      ['Team A', 'An'],
      ['Team A', 'Bình'],
      ['Team B', 'Chi'],
      ['Team B', 'Dũng'],
    ]);
    expect(results(reportCells(rows.byRe!.rows[3]!))).toEqual([
      '0',
      '0',
      '0 ₫',
      '1',
      '400 tr',
      '—',
    ]);
    expect(rows.byRe?.total.metrics).toEqual(rows.byTeam?.total.metrics);
  });

  it('the Team scope has no Theo team, and Theo RE holds the RE of the team only', () => {
    const rows = reportRows(GOLDEN, JAN_2027, { kind: 'team', teamId: 'team-b' }, d(2027, 3, 15));

    expect(rows.summary.name).toBe('Team Team B');
    expect(rows.byTeam).toBeNull();
    expect(rows.byRe?.rows.map((row) => row.name)).toEqual(['Chi', 'Dũng']);
    expect(results(reportCells(rows.byRe!.total))).toEqual(results(reportCells(rows.summary)));
  });

  it('the RE scope has Tổng hợp only', () => {
    const rows = reportRows(GOLDEN, JAN_2027, { kind: 're', reId: 're-binh' }, d(2027, 3, 15));

    expect(rows.summary.name).toBe('RE Bình');
    expect(results(reportCells(rows.summary))).toEqual(['2', '1', '1 tỷ', '1', '1 tỷ', '50%']);
    expect(rows.byTeam).toBeNull();
    expect(rows.byRe).toBeNull();
  });

  it('a period not started yet still counts its appointments, the rest is "—"', () => {
    const rows = reportRows(GOLDEN, JAN_2027, { kind: 'all' }, d(2026, 12, 20));
    const cells = reportCells(rows.byTeam!.total);

    expect(rows.summary.appointments.total).toBeGreaterThan(0);
    expect(cells.slice(0, 5)).toEqual(reportCells(rows.summary).slice(0, 5));
    expect(cells.slice(5)).toEqual(Array(12).fill('—'));
  });

  it('a team without RE: Tổng of the empty Theo RE matches Tổng hợp, "—" or 0', () => {
    const data = { ...GOLDEN, teams: [...TEAMS, { id: 'team-c', name: 'Team C' }] };
    const scope = { kind: 'team', teamId: 'team-c' } as const;

    const notStarted = reportRows(data, JAN_2027, scope, d(2026, 12, 20));
    expect(notStarted.byRe?.rows).toEqual([]);
    expect(reportCells(notStarted.byRe!.total)).toEqual(reportCells(notStarted.summary));
    expect(reportCells(notStarted.byRe!.total).slice(5)).toEqual(Array(12).fill('—'));

    const past = reportRows(data, JAN_2027, scope, d(2027, 3, 15));
    expect(reportCells(past.byRe!.total)).toEqual(reportCells(past.summary));
    expect(reportCells(past.byRe!.total).slice(5, 11)).toEqual(['0', '0', '0 ₫', '0', '0 ₫', '—']);
  });
});

describe('reportRows Theo mốc', () => {
  const marksOf = (period: Period, today = d(2027, 3, 15), scope: Scope = { kind: 'all' }) =>
    reportRows(GOLDEN, period, scope, today).byMark;

  it('Tháng 01/2027 → 5 weeks cut at the month (M01); Tháng 02/2027 → 4 whole weeks (M02)', () => {
    expect(marksOf(JAN_2027).map((row) => row.name)).toEqual([
      '01–03/01 (T6–CN)',
      '04–10/01',
      '11–17/01',
      '18–24/01',
      '25–31/01',
    ]);
    expect(marksOf(periodOf('month', d(2027, 2, 1))).map((row) => row.name)).toEqual([
      '01–07/02',
      '08–14/02',
      '15–21/02',
      '22–28/02',
    ]);
  });

  it('Tùy chọn of 55 days → 3 months cut to the range (M03); 16 days → 16 days (M04)', () => {
    expect(marksOf(customPeriod(d(2027, 1, 20), d(2027, 3, 15))).map((row) => row.name)).toEqual([
      '20–31/01',
      '01–28/02',
      '01–15/03',
    ]);
    const days = marksOf(customPeriod(d(2027, 1, 5), d(2027, 1, 20)));
    expect(days).toHaveLength(16);
    expect(days[0]?.name).toBe('T3 05/01');
  });

  it('Ngày → 1 mark, Tuần → 7 days, Năm → 12 months; a year in the range shows its year', () => {
    expect(marksOf(periodOf('day', d(2027, 1, 13))).map((row) => row.name)).toEqual(['T4 13/01']);
    expect(marksOf(periodOf('week', d(2027, 1, 13))).map((row) => row.name)).toEqual([
      'T2 11/01',
      'T3 12/01',
      'T4 13/01',
      'T5 14/01',
      'T6 15/01',
      'T7 16/01',
      'CN 17/01',
    ]);
    expect(marksOf(periodOf('year', d(2026, 1, 1))).map((row) => row.name)).toEqual(
      Array.from({ length: 12 }, (_, index) => `Tháng ${index + 1}`),
    );
    expect(marksOf(periodOf('week', d(2026, 12, 31)))[0]?.name).toBe('T2 28/12/2026');
  });

  it('the mark holding today counts up to today; a mark after today has appointments only', () => {
    const marks = marksOf(JAN_2027, d(2027, 1, 15));

    expect(marks.map((row) => [row.name, row.today])).toEqual([
      ['01–03/01 (T6–CN)', false],
      ['04–10/01', false],
      ['11–17/01 (tới 15/01)', true],
      ['18–24/01', false],
      ['25–31/01', false],
    ]);
    expect(marks[2]?.metrics).not.toBeNull();
    for (const future of marks.slice(3)) {
      expect(future.metrics).toBeNull();
      expect(future.stages).toBeNull();
      expect(reportCells(future).slice(5)).toEqual(Array(12).fill('—'));
    }
    expect(marksOf(periodOf('week', d(2027, 1, 13)), d(2027, 1, 13))[2]?.name).toBe(
      'T4 13/01 (hôm nay)',
    );
  });

  it('adds up to Tổng hợp: Σ appointments and results; KH of the last mark with numbers', () => {
    for (const today of [d(2027, 1, 15), d(2027, 3, 15)]) {
      const rows = reportRows(GOLDEN, JAN_2027, { kind: 'team', teamId: 'team-a' }, today);
      const marks = rows.byMark;
      const counted = marks.filter((row) => row.metrics);

      expect(total(marks.map((row) => row.appointments))).toEqual(rows.summary.appointments);
      expect(
        total(
          counted.map((row) => row.metrics!),
          RESULT_KEYS,
        ),
      ).toEqual(total([rows.summary.metrics!], RESULT_KEYS));
      expect(counted.at(-1)?.stages).toEqual(rows.summary.stages);
    }
  });
});

describe('summaryMeta', () => {
  it('counts the RE of the scope, or names the team of the RE (mockup 2a, 2d, 2e)', () => {
    expect(summaryMeta({ kind: 'all' }, PEOPLE, TEAMS)).toBe('Toàn bộ · 4 RE');
    expect(summaryMeta({ kind: 'team', teamId: 'team-a' }, PEOPLE, TEAMS)).toBe(
      'Team Team A · 2 RE',
    );
    expect(summaryMeta({ kind: 're', reId: 're-chi' }, PEOPLE, TEAMS)).toBe('RE Chi · Team B');
  });
});

describe('reportRows on the demo data', () => {
  const TODAY = d(2026, 9, 15);
  const KEYS = [
    ...(['met', 'missed', 'unrecorded', 'planned', 'total'] as const).map(
      (key) => (row: ReportFigures) => row.appointments[key],
    ),
    ...(['rfCount', 'submittedCount', 'caseSize', 'issuedCount', 'revenue'] as const).map(
      (key) => (row: ReportFigures) => row.metrics?.[key],
    ),
    ...REPORT_STAGES.map((stage) => (row: ReportFigures) => row.stages?.[stage]),
  ];
  const numbers = (row: ReportFigures) => KEYS.map((key) => key(row));
  const added = (rows: readonly ReportFigures[]) =>
    KEYS.map((key) => rows.reduce((sum, row) => sum + (key(row) ?? 0), 0));

  let data: ReportData;
  beforeAll(async () => {
    const db = await openDatabase();
    seedDemoData(db, { anchorDate: TODAY, seed: 1 });
    data = {
      people: listPeople(db),
      teams: listTeams(db),
      customers: listCustomers(db),
      policies: listPolicies(db),
      appointments: listAppointments(db),
      transitions: listStageTransitions(db),
    };
  }, SEEDING);

  it('Σ RE = team and Σ team = Toàn bộ, for every column', () => {
    const rows = reportRows(data, periodOf('month', TODAY), { kind: 'all' }, TODAY);
    const teams = rows.byTeam!.rows;

    expect(teams).toHaveLength(3);
    expect(rows.byRe!.rows).toHaveLength(30);
    expect(rows.summary.metrics!.rfCount).toBeGreaterThan(0);
    expect(added(teams)).toEqual(numbers(rows.summary));
    expect(numbers(rows.byTeam!.total)).toEqual(numbers(rows.summary));
    expect(numbers(rows.byRe!.total)).toEqual(numbers(rows.summary));
    for (const team of teams) {
      const res = rows.byRe!.rows.filter((re) => re.team === team.name);
      expect(res, team.name).toHaveLength(10);
      expect(added(res), team.name).toEqual(numbers(team));
    }
  });

  it('Theo mốc of the year: 12 months adding up to Tổng hợp, the months after today "—"', () => {
    const rows = reportRows(data, periodOf('year', TODAY), { kind: 'all' }, TODAY);
    const marks = rows.byMark;
    const counted = marks.filter((row) => row.metrics);

    expect(marks).toHaveLength(12);
    expect(counted).toHaveLength(9);
    expect(marks[8]?.name).toBe('Tháng 9 (tới 15/09)');
    expect(added(marks).slice(0, 10)).toEqual(numbers(rows.summary).slice(0, 10));
    expect(counted.at(-1)?.stages).toEqual(rows.summary.stages);
  });

  it('the close rate of Tổng is Σ HĐ phát hành ÷ Σ RF, not a mean of the rates', () => {
    const rows = reportRows(data, periodOf('year', TODAY), { kind: 'all' }, TODAY);
    const teams = rows.byTeam!.rows;
    const issued = teams.reduce((sum, team) => sum + team.metrics!.issuedCount, 0);
    const rf = teams.reduce((sum, team) => sum + team.metrics!.rfCount, 0);

    expect(rows.byTeam!.total.metrics!.closeRate).toEqual({ numerator: issued, denominator: rf });
  });

  describe('Theo mốc equals each mark counted on its own', () => {
    const PERIODS: Readonly<Record<string, Period>> = {
      'Ngày đang chạy': periodOf('day', TODAY),
      'Ngày đã qua': periodOf('day', d(2026, 9, 10)),
      'Ngày chưa tới': periodOf('day', d(2026, 9, 20)),
      'Tuần đang chạy': periodOf('week', TODAY),
      'Tuần đã qua': periodOf('week', d(2026, 9, 1)),
      'Tuần chưa tới': periodOf('week', d(2026, 9, 28)),
      'Tháng đang chạy': periodOf('month', TODAY),
      'Tháng đã qua': periodOf('month', d(2026, 8, 1)),
      'Tháng chưa tới': periodOf('month', d(2026, 10, 1)),
      Năm: periodOf('year', TODAY),
      'Tùy chọn': customPeriod(d(2026, 7, 15), d(2026, 10, 14)),
    };
    const scopes = (): readonly Scope[] => [
      { kind: 'all' },
      { kind: 'team', teamId: data.teams[0]!.id },
      { kind: 're', reId: data.people.find((person) => person.role === 'RE')!.id },
    ];

    it.each(Object.entries(PERIODS))('%s, every scope', (_, period) => {
      for (const scope of scopes()) {
        const alone = reportMarks(period).map((mark) => {
          const window = countedWindow(mark, TODAY);
          const day = snapshotDate(mark, TODAY);
          return {
            appointments: appointmentCounts(data.appointments, mark, scope, data.people, TODAY),
            metrics: window && periodMetrics(data, window, scope),
            stages: day && stageSnapshot(data.customers, data.transitions, day, scope, data.people),
          };
        });
        const byMark = reportRows(data, period, scope, TODAY).byMark.map(
          ({ appointments, metrics, stages }) => ({ appointments, metrics, stages }),
        );

        expect(byMark, scope.kind).toEqual(alone);
      }
    });
  });
});
