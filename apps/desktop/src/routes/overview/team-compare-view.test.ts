import { calendarDate, periodOf, type Period } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import {
  APPOINTMENTS,
  PEOPLE,
  POLICIES,
  STAGE_TRANSITIONS,
  TEAMS,
} from '../../../../../packages/domain/src/golden/metrics.fixture';
import { teamCompare, type CompareRow } from './team-compare-view';

const GOLDEN = {
  people: PEOPLE,
  teams: TEAMS,
  policies: POLICIES,
  appointments: APPOINTMENTS,
  transitions: STAGE_TRANSITIONS,
};
const d = calendarDate;
const JAN_2027 = periodOf('month', d(2027, 1, 1));
const MILLION = 1_000_000;

const FIGURES = ['met', 'rfCount', 'submittedCount', 'caseSize', 'issuedCount', 'revenue'] as const;

const figures = (row: CompareRow) => ({
  met: row.met,
  rfCount: row.metrics?.rfCount,
  submittedCount: row.metrics?.submittedCount,
  caseSize: row.metrics?.caseSize,
  issuedCount: row.metrics?.issuedCount,
  revenue: row.metrics?.revenue,
});

describe('teamCompare', () => {
  it('adds the teams up in Tổng: Team A 2/3 + Team B 3/2 → 5/5 = 100% (G09–G11)', () => {
    const view = teamCompare(GOLDEN, JAN_2027, d(2027, 3, 15));
    const [a, b] = view.teams;

    expect(view.teams.map((team) => team.name)).toEqual(['Team A', 'Team B']);
    expect(a?.cells).toEqual(['5', '3', '3', '1,5 tỷ', '2', '1,5 tỷ', '66,7%']);
    expect(b?.cells).toEqual(['4', '2', '2', '400 tr', '3', '800 tr', '150%']);
    expect(view.total.name).toBe('Tổng');
    expect(figures(view.total)).toEqual({
      met: 9,
      rfCount: 5,
      submittedCount: 5,
      caseSize: 1_900 * MILLION,
      issuedCount: 5,
      revenue: 2_300 * MILLION,
    });
    expect(view.total.metrics?.closeRate).toEqual({ numerator: 5, denominator: 5 });
    expect(view.total.cells).toEqual(['9', '5', '5', '1,9 tỷ', '5', '2,3 tỷ', '100%']);
  });

  it('lists the teams by Vietnamese name: D before Đ, whatever order they were made in', () => {
    const [a, b] = TEAMS as [(typeof TEAMS)[number], (typeof TEAMS)[number]];
    const teams = [
      { ...b, name: 'Đông Hải' },
      { ...a, name: 'Dương Quang' },
    ];
    const view = teamCompare({ ...GOLDEN, teams }, JAN_2027, d(2027, 3, 15));

    expect(view.teams.map((team) => team.name)).toEqual(['Dương Quang', 'Đông Hải']);
  });

  it('lists the RE of each team by name, and they add up to the team row', () => {
    const view = teamCompare(GOLDEN, JAN_2027, d(2027, 3, 15));
    const [a] = view.teams;

    expect(a?.res.map((re) => re.name)).toEqual(['An', 'Bình']);
    expect(a?.res.map((re) => re.cells)).toEqual([
      ['1', '1', '2', '500 tr', '1', '500 tr', '100%'],
      ['4', '2', '1', '1 tỷ', '1', '1 tỷ', '50%'],
    ]);
    for (const team of view.teams) {
      for (const key of FIGURES) {
        const sum = team.res.reduce((total, re) => total + (figures(re)[key] ?? 0), 0);
        expect(sum, `${team.name} ${key}`).toBe(figures(team)[key]);
      }
    }
  });

  it('counts results up to today (G18), "—" for 0 RF and "0 ₫" for no money', () => {
    // 01/01 – 15/01: RF ap-03, ap-04, ap-09; submitted hd-05, hd-06; issued hd-01, hd-07.
    const view = teamCompare(GOLDEN, JAN_2027, d(2027, 1, 15));
    const [a, b] = view.teams;

    expect(view.range).toBe('01/01 – 15/01/2027');
    expect(a?.cells).toEqual(['5', '2', '0', '0 ₫', '1', '500 tr', '50%']);
    expect(b?.cells).toEqual(['4', '1', '2', '400 tr', '1', '400 tr', '100%']);
    expect(b?.res.map((re) => re.name)).toEqual(['Chi', 'Dũng']);
    expect(b?.res[1]?.cells).toEqual(['1', '0', '0', '0 ₫', '1', '400 tr', '—']);
    expect(view.total.cells).toEqual(['9', '3', '2', '400 tr', '2', '900 tr', '66,7%']);
  });

  it('a period not started yet has "—" for every result', () => {
    const view = teamCompare(GOLDEN, periodOf('month', d(2027, 2, 1)), d(2027, 1, 15));

    expect(view.range).toBeNull();
    expect(view.total.cells).toEqual(['0', '—', '—', '—', '—', '—', '—']);
  });

  it('without teams, Tổng is "—" before the period starts and 0 once it has', () => {
    const noTeams = { ...GOLDEN, teams: [] };
    const today = d(2027, 1, 15);
    const total = (period: Period) => teamCompare(noTeams, period, today).total;

    expect(total(periodOf('month', d(2027, 2, 1))).metrics).toBeNull();
    expect(total(periodOf('month', d(2027, 2, 1))).cells).toEqual([
      '0',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
    ]);
    for (const period of [periodOf('month', today), periodOf('month', d(2026, 12, 1))]) {
      expect(total(period).cells).toEqual(['0', '0', '0', '0 ₫', '0', '0 ₫', '—']);
    }
  });

  it('counts the first day of the month as that one day', () => {
    const today = d(2027, 4, 1);

    expect(teamCompare(GOLDEN, periodOf('month', today), today).range).toBe('01/04/2027');
  });
});
