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
  APPOINTMENTS_B,
  GOLDEN_B_CASES,
  MTD_VIEWING_DATE,
  PEOPLE,
  POLICIES,
  POLICY_ROWS_B,
  STAGE_TRANSITIONS,
  STAGE_TRANSITIONS_B,
  TEAMS,
} from '../../../../../packages/domain/src/golden/metrics.fixture';
import {
  KPI_STEP,
  kpiText,
  kpiTiles,
  metricsScope,
  viewingLine,
  viewingText,
  type KpiTile,
} from './overview-view';

const GOLDEN: MetricsData = {
  people: PEOPLE,
  policies: POLICIES,
  appointments: APPOINTMENTS,
  transitions: STAGE_TRANSITIONS,
};
const EMPTY: MetricsData = { people: [], policies: [], appointments: [], transitions: [] };
/** Golden B (`chi-so.md` §4): the final state, the policy deleted after it was cancelled left out. */
const GOLDEN_B: MetricsData = {
  people: PEOPLE,
  policies: POLICY_ROWS_B.filter((row) => !row.deleted).map((row) => row.policy),
  appointments: APPOINTMENTS_B,
  transitions: STAGE_TRANSITIONS_B,
};
/** After every day of golden B: each of its periods is counted whole. */
const AFTER_B = calendarDate(2028, 3, 15);
const ALL: Scope = { kind: 'all' };
const d = calendarDate;

/** The six tiles and Doanh số for the period and scope of a golden B row. */
function tilesOfB(id: string) {
  const golden = GOLDEN_B_CASES.find((row) => row.id === id)!;
  return byKey(kpiTiles(GOLDEN_B, golden.period, golden.scope, AFTER_B));
}

const byKey = (tiles: readonly KpiTile[]) =>
  Object.fromEntries(tiles.map((tile) => [tile.key, tile]));

let made = 0;
/** `rf` cuộc gặp chuyển RF and `issued` issued policies of one RM, all on `day`. */
function closing(day: CalendarDate, rf: number, issued: number): MetricsData {
  const appointments = Array.from(
    { length: rf },
    () =>
      ({
        id: `rf-${++made}`,
        customerId: 'kh',
        rmId: 're-an',
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
      rmId: 're-an',
      submittedDate: day,
      submittedFyp: 1_000_000,
      issuedDate: day,
      issuedFyp: 1_000_000,
      cancelledDate: null,
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
      kind: 'count',
      amount: 3,
      delta: { tone: 'good', text: '▲ 3' },
      note: compared,
    });
    expect(tiles.submitted).toMatchObject({ value: '2', delta: { text: '▲ 2' }, note: compared });
    expect(tiles.caseSize).toMatchObject({
      value: '400',
      unit: 'tr',
      unitSpaced: true,
      kind: 'money',
      amount: 400_000_000,
      delta: { text: '▲ 400 tr' },
    });
    expect(tiles.net).toMatchObject({ value: '2', delta: { text: '▲ 2' } });
    expect(tiles.revenue).toMatchObject({ value: '900', unit: 'tr', delta: { text: '▲ 900 tr' } });
    expect(tiles.closeRate).toMatchObject({
      value: '66.7',
      unit: '%',
      unitSpaced: false,
      kind: 'percent',
      amount: 200 / 3,
      delta: null,
      note: '— kỳ trước 0 RF, không so',
      formula: '2 HĐ phát hành ÷ 3 RF',
    });
  });

  it('an ended month compares with the whole month before, down and "—" for 0 RF (G16 vs G09)', () => {
    const tiles = byKey(kpiTiles(GOLDEN, periodOf('month', d(2027, 2, 1)), ALL, d(2027, 3, 15)));

    expect(tiles.rf).toMatchObject({
      value: '0',
      delta: { tone: 'bad', text: '▼ 5' },
      note: 'so với 01/01 – 31/01',
    });
    expect(tiles.caseSize).toMatchObject({ value: '0', unit: 'VNĐ', delta: { text: '▼ 1.9 tỷ' } });
    expect(tiles.net).toMatchObject({ value: '1', delta: { text: '▼ 4' } });
    // No RF, no rate: "—", but the division is still written, to show why (mockup #tiles).
    expect(tiles.closeRate).toMatchObject({
      value: '—',
      unit: '',
      kind: 'percent',
      amount: null,
      delta: null,
      note: '0 RF trong kỳ · không so',
      formula: '1 HĐ phát hành ÷ 0 RF',
    });
  });

  it('G27: Tổng số HĐ, Tỷ lệ hủy, Doanh số with their formulas; a tile for what each counts', () => {
    const tiles = tilesOfB('G27');
    const compared = 'so với 03/01 – 09/01';

    expect(tiles.revenue).toMatchObject({
      value: '1',
      unit: 'tỷ',
      negative: false,
      formula: 'FYP phát hành 1.3 tỷ − FYP hủy 300 tr',
      delta: { tone: 'good', text: '▲ 520 tr' },
      note: compared,
    });
    expect(tiles.net).toMatchObject({
      value: '2',
      kind: 'count',
      negative: false,
      formula: '4 phát hành − 2 hủy',
      delta: { tone: 'same', text: '=' },
      note: compared,
    });
    expect(tiles.cancelRate).toMatchObject({
      label: 'Tỷ lệ hủy',
      value: '50',
      unit: '%',
      kind: 'percent',
      amount: 50,
      formula: '2 hủy ÷ 4 phát hành',
      // 0% the week before: a rise of the cancel rate is for the worse.
      delta: { tone: 'bad', text: '▲ 50 điểm %' },
      note: compared,
    });
    expect(tiles.closeRate).toMatchObject({
      label: 'Tỷ lệ chốt',
      value: '400',
      formula: '4 HĐ phát hành ÷ 1 RF',
      delta: { tone: 'good', text: '▲ 333.3 điểm %' },
    });
    expect(tiles.rf).toMatchObject({ value: '1', formula: 'từ 1 buổi đã gặp' });
    expect(tiles.submitted).toMatchObject({ value: '2', formula: 'HĐ có ngày nộp trong kỳ' });
    expect(tiles.caseSize).toMatchObject({ value: '650', unit: 'tr', formula: 'FYP nộp của 2 HĐ' });
  });

  it('G28: more cancelled than issued: a cancel rate over 100%, Tổng số HĐ and Doanh số below 0', () => {
    const tiles = tilesOfB('G28');

    expect(tiles.cancelRate).toMatchObject({
      value: '200',
      unit: '%',
      formula: '2 hủy ÷ 1 phát hành',
      delta: { tone: 'bad', text: '▲ 150 điểm %' },
    });
    expect(tiles.net).toMatchObject({
      value: '-1',
      amount: -1,
      negative: true,
      formula: '1 phát hành − 2 hủy',
      delta: { tone: 'bad', text: '▼ 3' },
    });
    expect(tiles.revenue).toMatchObject({
      value: '-530',
      unit: 'tr',
      negative: true,
      formula: 'FYP phát hành 250 tr − FYP hủy 780 tr',
      delta: { tone: 'bad', text: '▼ 1.53 tỷ' },
    });
  });

  it('G24: cancelled, none issued: "—" with its division and "không so"; below 0 in red', () => {
    const tiles = tilesOfB('G24');

    expect(tiles.cancelRate).toMatchObject({
      value: '—',
      amount: null,
      formula: '1 hủy ÷ 0 phát hành',
      delta: null,
      note: '0 HĐ phát hành trong kỳ · không so',
    });
    expect(tiles.closeRate).toMatchObject({ value: '—', formula: '0 HĐ phát hành ÷ 0 RF' });
    expect(tiles.net).toMatchObject({
      value: '-1',
      negative: true,
      formula: '0 phát hành − 1 hủy',
    });
    expect(tiles.revenue).toMatchObject({ value: '-200', unit: 'tr', negative: true });
    expect(tiles.rf).toMatchObject({ value: '0', negative: false, formula: 'từ 0 buổi đã gặp' });
  });

  it('a cancel rate is not compared when the period before had none issued (G23)', () => {
    expect(tilesOfB('G23').cancelRate).toMatchObject({
      value: '0',
      formula: '0 hủy ÷ 1 phát hành',
      delta: null,
      note: '— kỳ trước 0 HĐ phát hành, không so',
    });
  });

  it('a fall of the cancel rate is for the better: green (G37 against G32)', () => {
    expect(tilesOfB('G37').cancelRate).toMatchObject({
      value: '0',
      delta: { tone: 'good', text: '▼ 50 điểm %' },
      note: 'so với 01/01 – 31/01',
    });
  });

  it('on the last day of a month compares the same number of days (spec §4.2 C10)', () => {
    const submittedOn31March = {
      ...EMPTY,
      policies: [
        {
          id: 'hd-31-03',
          customerId: 'kh-01',
          rmId: 're-an',
          submittedDate: d(2027, 3, 31),
          submittedFyp: 100_000_000,
          issuedDate: null,
          issuedFyp: null,
          cancelledDate: null,
        },
      ],
    };
    const today = d(2027, 4, 30);
    const tiles = byKey(kpiTiles(submittedOn31March, periodOf('month', today), ALL, today));
    const compared = 'so với 01/03 – 30/03';

    expect(tiles.submitted).toMatchObject({ value: '0', delta: { text: '=' }, note: compared });
    expect(tiles.caseSize).toMatchObject({ value: '0', delta: { text: '=' }, note: compared });
  });

  it('sets K beside the number, a longer unit after a space (ADR-0018 §4, Q5)', () => {
    const today = d(2027, 3, 15);
    const submitted = (id: string, submittedFyp: number) => ({
      id,
      customerId: 'kh-01',
      rmId: 're-an',
      submittedDate: today,
      submittedFyp,
      issuedDate: null,
      issuedFyp: null,
      cancelledDate: null,
    });
    const tiles = (fyp: number) =>
      byKey(
        kpiTiles(
          { ...EMPTY, policies: [submitted('hd', fyp)] },
          periodOf('month', today),
          ALL,
          today,
        ),
      );

    expect(tiles(500_000).caseSize).toMatchObject({
      value: '500',
      unit: 'K',
      unitSpaced: false,
      delta: { text: '▲ 500K' },
    });
    expect(tiles(950).caseSize).toMatchObject({ value: '950', unit: 'VNĐ', unitSpaced: true });
    expect(tiles(1_250_000_000).caseSize).toMatchObject({ value: '1.25', unit: 'tỷ' });
  });

  it('the close rate changes in percentage points (G20 vs G19)', () => {
    const tiles = byKey(kpiTiles(GOLDEN, periodOf('year', d(2027, 1, 1)), ALL, d(2028, 1, 10)));

    expect(tiles.closeRate).toMatchObject({
      value: '120',
      delta: { tone: 'good', text: '▲ 120 điểm %' },
      note: 'so với 01/01 – 31/12/2026',
      formula: '6 HĐ phát hành ÷ 5 RF',
    });
  });

  it('lists Doanh số, then the six tiles in the order of the screen (mockup tong-quan.html #tiles)', () => {
    const tiles = kpiTiles(GOLDEN, periodOf('month', MTD_VIEWING_DATE), ALL, MTD_VIEWING_DATE);
    expect(tiles.map((tile) => [tile.key, tile.label])).toEqual([
      ['revenue', 'Doanh số'],
      ['net', 'Tổng số HĐ'],
      ['cancelRate', 'Tỷ lệ hủy'],
      ['closeRate', 'Tỷ lệ chốt'],
      ['rf', 'Chuyển RF'],
      ['submitted', 'HĐ nộp'],
      ['caseSize', 'Case size'],
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

  it('a close rate that moved less than 0.05 point reads "=", not "▲ 0 điểm %"', () => {
    // 1 ÷ 46 RF = 2.17% against 1 ÷ 45 RF = 2.22%: -0.048 point.
    const data = together(closing(d(2027, 1, 10), 45, 1), closing(d(2027, 2, 10), 46, 1));
    const tiles = byKey(kpiTiles(data, periodOf('month', d(2027, 2, 1)), ALL, d(2027, 3, 15)));
    expect(tiles.closeRate).toMatchObject({ value: '2.2', delta: { tone: 'same', text: '=' } });
  });

  it('writes a number of "Đếm" as a tile writes one at rest, its unit that of the number (VA7b)', () => {
    expect(kpiText('money', 1_030_000_000)).toEqual({
      value: '1.03',
      unit: 'tỷ',
      unitSpaced: true,
    });
    expect(kpiText('money', 761_000_000)).toEqual({ value: '761', unit: 'tr', unitSpaced: true });
    expect(kpiText('count', 1_204)).toEqual({ value: '1,204', unit: '', unitSpaced: false });
    // Below 0, "-" first (ADR-0018): Tổng số HĐ, and every frame of it on its way there.
    expect(kpiText('count', -1_204)).toEqual({ value: '-1,204', unit: '', unitSpaced: false });
    expect(kpiText('money', -530_000_000)).toEqual({ value: '-530', unit: 'tr', unitSpaced: true });
    expect(kpiText('percent', 58.3)).toEqual({ value: '58.3', unit: '%', unitSpaced: false });
    expect(kpiText('percent', null)).toEqual({ value: '—', unit: '', unitSpaced: false });
    expect(KPI_STEP).toEqual({ count: 'whole', money: 'sig3', percent: 'tenth' });
  });

  it('no change reads "="', () => {
    const tiles = byKey(kpiTiles(EMPTY, periodOf('year', d(2000, 1, 1)), ALL, d(2026, 10, 15)));

    expect(tiles.submitted).toMatchObject({ value: '0', delta: { tone: 'same', text: '=' } });
    expect(tiles.caseSize).toMatchObject({ value: '0', unit: 'VNĐ', delta: { text: '=' } });
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

  it('names the RM, or counts the teams of the Team scope; an ended year has no range', () => {
    const year = periodOf('year', d(2026, 1, 1));
    const rm = viewingText(
      { period: year, scope: { kind: 'rm', rmId: 're-an' } },
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

    expect(rm).toEqual({ period: 'Năm 2026', mtd: false, range: null, scope: 'RM An' });
    expect(team.scope).toBe('Mọi team (2 team)');
  });
});

describe('viewingLine (the line under the name of the screen)', () => {
  const viewing = { period: 'Tháng 01/2027', mtd: false, range: null, scope: 'Toàn bộ' };

  it('is the period, then the scope', () => {
    expect(viewingLine(viewing)).toBe('Tháng 01/2027 · Toàn bộ');
  });

  it('puts the days counted between them, marked MTD for a month in progress', () => {
    expect(viewingLine({ ...viewing, mtd: true, range: '01/01 – 15/01/2027' })).toBe(
      'Tháng 01/2027 · 01/01 – 15/01/2027 (MTD) · Toàn bộ',
    );
    expect(viewingLine({ ...viewing, period: 'Năm 2027', range: '01/01 – 15/01/2027' })).toBe(
      'Năm 2027 · 01/01 – 15/01/2027 · Toàn bộ',
    );
  });
});

describe('metricsScope', () => {
  it('the Team scope of Tổng quan counts every team together', () => {
    expect(metricsScope({ kind: 'team', teamId: 'team-a' })).toEqual(ALL);
    expect(metricsScope({ kind: 'rm', rmId: 're-an' })).toEqual({ kind: 'rm', rmId: 're-an' });
    expect(metricsScope(ALL)).toEqual(ALL);
  });
});
