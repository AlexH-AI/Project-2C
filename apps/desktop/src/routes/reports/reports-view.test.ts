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
import { calendarDate, periodOf } from '@p2c/domain';
import { beforeAll, describe, expect, it } from 'vitest';
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

describe('reportRows', () => {
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

  it('the close rate of Tổng is Σ HĐ phát hành ÷ Σ RF, not a mean of the rates', () => {
    const rows = reportRows(data, periodOf('year', TODAY), { kind: 'all' }, TODAY);
    const teams = rows.byTeam!.rows;
    const issued = teams.reduce((sum, team) => sum + team.metrics!.issuedCount, 0);
    const rf = teams.reduce((sum, team) => sum + team.metrics!.rfCount, 0);

    expect(rows.byTeam!.total.metrics!.closeRate).toEqual({ numerator: issued, denominator: rf });
  });
});
