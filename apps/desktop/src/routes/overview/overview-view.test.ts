import {
  calendarDate,
  customPeriod,
  periodOf,
  type Appointment,
  type CalendarDate,
  type MetricsData,
  type Scope,
} from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import {
  APPOINTMENTS,
  MTD_VIEWING_DATE,
  PEOPLE,
  POLICIES,
  STAGE_TRANSITIONS,
  TEAMS,
} from '../../../../../packages/domain/src/golden/metrics.fixture';
import { kpiTiles, metricsScope, viewingText, type KpiTile } from './overview-view';

const GOLDEN: MetricsData = {
  people: PEOPLE,
  policies: POLICIES,
  appointments: APPOINTMENTS,
  transitions: STAGE_TRANSITIONS,
};
const EMPTY: MetricsData = { people: [], policies: [], appointments: [], transitions: [] };
const ALL: Scope = { kind: 'all' };
const d = calendarDate;

const byKey = (tiles: readonly KpiTile[]) =>
  Object.fromEntries(tiles.map((tile) => [tile.key, tile]));

let made = 0;
/** `rf` cuộc gặp chuyển RF and `issued` issued policies of one RE, all on `day`. */
function closing(day: CalendarDate, rf: number, issued: number): MetricsData {
  const appointments = Array.from(
    { length: rf },
    () =>
      ({
        id: `rf-${++made}`,
        customerId: 'kh',
        reId: 're-an',
        date: day,
        status: 'MET',
      }) as Appointment,
  );
  return {
    people: PEOPLE,
    appointments,
    transitions: appointments.map((a) => ({
      id: `tr-${a.id}`,
      customerId: 'kh',
      appointmentId: a.id,
      from: 'N3',
      to: 'N2',
      date: day,
    })),
    policies: Array.from({ length: issued }, () => ({
      id: `hd-${++made}`,
      customerId: 'kh',
      reId: 're-an',
      submittedDate: day,
      submittedFyp: 1_000_000,
      issuedDate: day,
      issuedFyp: 1_000_000,
    })),
  };
}

const together = (a: MetricsData, b: MetricsData): MetricsData => ({
  people: a.people,
  appointments: [...a.appointments, ...b.appointments],
  transitions: [...a.transitions, ...b.transitions],
  policies: [...a.policies, ...b.policies],
});

describe('kpiTiles', () => {
  it('matches the worked example of spec §4.2: month to date on 15/01/2027 (G18)', () => {
    const tiles = byKey(
      kpiTiles(GOLDEN, periodOf('month', MTD_VIEWING_DATE), ALL, MTD_VIEWING_DATE),
    );
    const compared = 'so với 01/12 – 15/12/2026';

    expect(tiles.rf).toMatchObject({
      value: '3',
      delta: { tone: 'up', text: '▲ 3' },
      note: compared,
    });
    expect(tiles.submitted).toMatchObject({ value: '2', delta: { text: '▲ 2' }, note: compared });
    expect(tiles.caseSize).toMatchObject({
      value: '400',
      unit: 'tr',
      unitSpaced: true,
      delta: { text: '▲ 400 tr' },
    });
    expect(tiles.issued).toMatchObject({ value: '2', delta: { text: '▲ 2' } });
    expect(tiles.revenue).toMatchObject({ value: '900', unit: 'tr', delta: { text: '▲ 900 tr' } });
    expect(tiles.closeRate).toMatchObject({
      value: '66,7',
      unit: '%',
      unitSpaced: false,
      delta: null,
      note: '— kỳ trước 0 RF, không so',
      formula: '2 HĐ phát hành ÷ 3 RF',
    });
  });

  it('an ended month compares with the whole month before, down and "—" for 0 RF (G16 vs G09)', () => {
    const tiles = byKey(kpiTiles(GOLDEN, periodOf('month', d(2027, 2, 1)), ALL, d(2027, 3, 15)));

    expect(tiles.rf).toMatchObject({
      value: '0',
      delta: { tone: 'down', text: '▼ 5' },
      note: 'so với 01/01 – 31/01',
    });
    expect(tiles.caseSize).toMatchObject({ value: '0', unit: '₫', delta: { text: '▼ 1,9 tỷ' } });
    expect(tiles.issued).toMatchObject({ value: '1', delta: { text: '▼ 4' } });
    expect(tiles.closeRate).toMatchObject({
      value: '—',
      unit: '',
      delta: null,
      note: '0 RF trong kỳ · không so',
      formula: null,
    });
  });

  it('on the last day of a month compares the same number of days (spec §4.2 C10)', () => {
    const submittedOn31March = {
      ...EMPTY,
      policies: [
        {
          id: 'hd-31-03',
          customerId: 'kh-01',
          reId: 're-an',
          submittedDate: d(2027, 3, 31),
          submittedFyp: 100_000_000,
          issuedDate: null,
          issuedFyp: null,
        },
      ],
    };
    const today = d(2027, 4, 30);
    const tiles = byKey(kpiTiles(submittedOn31March, periodOf('month', today), ALL, today));
    const compared = 'so với 01/03 – 30/03';

    expect(tiles.submitted).toMatchObject({ value: '0', delta: { text: '=' }, note: compared });
    expect(tiles.caseSize).toMatchObject({ value: '0', delta: { text: '=' }, note: compared });
  });

  it('the close rate changes in percentage points (G20 vs G19)', () => {
    const tiles = byKey(kpiTiles(GOLDEN, periodOf('year', d(2027, 1, 1)), ALL, d(2028, 1, 10)));

    expect(tiles.closeRate).toMatchObject({
      value: '120',
      delta: { tone: 'up', text: '▲ 120 điểm %' },
      note: 'so với 01/01 – 31/12/2026',
      formula: '6 HĐ phát hành ÷ 5 RF',
    });
  });

  it('lists the six tiles in the order of the screen (mockup 1a)', () => {
    const tiles = kpiTiles(GOLDEN, periodOf('month', MTD_VIEWING_DATE), ALL, MTD_VIEWING_DATE);
    expect(tiles.map((tile) => tile.key)).toEqual([
      'rf',
      'submitted',
      'caseSize',
      'issued',
      'revenue',
      'closeRate',
    ]);
  });

  it('names the one-day window before with its year only when it is another year', () => {
    const newYear = d(2027, 1, 1);
    const firstOfFeb = d(2027, 2, 1);
    expect(kpiTiles(EMPTY, periodOf('month', newYear), ALL, newYear)[0]!.note).toBe(
      'so với 01/12/2026',
    );
    expect(kpiTiles(EMPTY, periodOf('day', newYear), ALL, newYear)[0]!.note).toBe(
      'so với 31/12/2026',
    );
    expect(kpiTiles(EMPTY, periodOf('month', firstOfFeb), ALL, firstOfFeb)[0]!.note).toBe(
      'so với 01/01',
    );
  });

  it('a close rate that moved less than 0,05 point reads "=", not "▲ 0 điểm %"', () => {
    // 1 ÷ 46 RF = 2,17% against 1 ÷ 45 RF = 2,22%: -0,048 point.
    const data = together(closing(d(2027, 1, 10), 45, 1), closing(d(2027, 2, 10), 46, 1));
    const tiles = byKey(kpiTiles(data, periodOf('month', d(2027, 2, 1)), ALL, d(2027, 3, 15)));
    expect(tiles.closeRate).toMatchObject({ value: '2,2', delta: { tone: 'same', text: '=' } });
  });

  it('no change reads "="', () => {
    const tiles = byKey(kpiTiles(EMPTY, periodOf('year', d(2000, 1, 1)), ALL, d(2026, 10, 15)));

    expect(tiles.submitted).toMatchObject({ value: '0', delta: { tone: 'same', text: '=' } });
    expect(tiles.caseSize).toMatchObject({ value: '0', unit: '₫', delta: { text: '=' } });
  });

  it('gives the reason a KPI is not compared', () => {
    const today = d(2027, 1, 13);
    const custom = byKey(kpiTiles(GOLDEN, customPeriod(d(2027, 1, 5), d(2027, 1, 20)), ALL, today));
    const future = byKey(kpiTiles(GOLDEN, periodOf('month', d(2027, 2, 1)), ALL, today));
    const outOfRange = byKey(kpiTiles(EMPTY, periodOf('year', d(1900, 1, 1)), ALL, today));

    expect(custom.rf).toMatchObject({ delta: null, note: 'Kỳ Tùy chọn không so với kỳ trước' });
    const customRate = byKey(
      kpiTiles(
        closing(d(2027, 1, 8), 2, 1),
        customPeriod(d(2027, 1, 5), d(2027, 1, 20)),
        ALL,
        today,
      ),
    );
    expect(customRate.closeRate).toMatchObject({
      value: '50',
      delta: null,
      note: 'Kỳ Tùy chọn không so với kỳ trước',
    });
    expect(future.rf).toMatchObject({ value: '—', delta: null, note: 'kỳ chưa bắt đầu' });
    expect(future.closeRate).toMatchObject({ value: '—', note: 'kỳ chưa bắt đầu', formula: null });
    expect(outOfRange.submitted).toMatchObject({
      value: '0',
      delta: null,
      note: 'kỳ trước ngoài miền 1900–2100 · không so',
    });
  });

  it('a custom period not started yet says so, not that custom is never compared (mockup 1e)', () => {
    const tiles = kpiTiles(
      GOLDEN,
      customPeriod(d(2026, 11, 1), d(2026, 11, 15)),
      ALL,
      d(2026, 10, 15),
    );

    for (const tile of tiles) {
      expect(tile).toMatchObject({ value: '—', delta: null, note: 'kỳ chưa bắt đầu' });
    }
  });
});

describe('viewingText ("Đang xem")', () => {
  it('a month in progress is MTD, with the days counted', () => {
    const viewing = viewingText(
      { period: periodOf('month', MTD_VIEWING_DATE), scope: ALL },
      MTD_VIEWING_DATE,
      PEOPLE,
      TEAMS,
    );

    expect(viewing).toEqual({
      period: 'Tháng 01/2027',
      mtd: true,
      range: '01/01 – 15/01/2027',
      scope: 'Toàn bộ',
    });
  });

  it('the last day of the month is still MTD (spec §4.2 C02)', () => {
    const today = d(2027, 3, 31);
    const viewing = viewingText(
      { period: periodOf('month', today), scope: ALL },
      today,
      PEOPLE,
      TEAMS,
    );

    expect(viewing).toMatchObject({ mtd: true, range: '01/03 – 31/03/2027' });
  });

  it('the first day of the month counts that one day, written once', () => {
    const today = d(2027, 4, 1);
    const viewing = viewingText(
      { period: periodOf('month', today), scope: ALL },
      today,
      PEOPLE,
      TEAMS,
    );

    expect(viewing).toMatchObject({ period: 'Tháng 04/2027', mtd: true, range: '01/04/2027' });
  });

  it('names the RE, or counts the teams of the Team scope; an ended year has no range', () => {
    const year = periodOf('year', d(2026, 1, 1));
    const re = viewingText(
      { period: year, scope: { kind: 're', reId: 're-an' } },
      d(2027, 1, 5),
      PEOPLE,
      TEAMS,
    );
    const team = viewingText(
      { period: year, scope: { kind: 'team', teamId: 'team-a' } },
      d(2027, 1, 5),
      PEOPLE,
      TEAMS,
    );

    expect(re).toEqual({ period: 'Năm 2026', mtd: false, range: null, scope: 'RE An' });
    expect(team.scope).toBe('Team (2 team)');
  });
});

describe('metricsScope', () => {
  it('the Team scope of Tổng quan counts every team together', () => {
    expect(metricsScope({ kind: 'team', teamId: 'team-a' })).toEqual(ALL);
    expect(metricsScope({ kind: 're', reId: 're-an' })).toEqual({ kind: 're', reId: 're-an' });
    expect(metricsScope(ALL)).toEqual(ALL);
  });
});
