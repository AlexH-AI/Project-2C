import { describe, expect, it } from 'vitest';
import { stageChartOption, stagePalette } from './stage-chart';
import type { StageChart } from './stage-view';

const CHART: StageChart = {
  key: 'team-x',
  team: '<b>Đội</b> & <img src=x onerror=alert(1)>',
  columns: [
    {
      label: 'T2 12',
      title: '12/10/2026 · cuối ngày',
      values: { N4: 1200, N3: 3, N2: 2, N1: 1 },
      today: false,
    },
    { label: 'T3 13', title: '13/10/2026 · cuối ngày', values: null, today: false },
  ],
};

interface Series {
  id?: string;
  name: string;
  stack: string;
  data: (number | null)[];
  barMinHeight?: number;
  itemStyle?: Record<string, unknown>;
}
interface XAxis {
  data: string[];
  axisLabel: {
    formatter: (value: string, index: number) => string;
    interval: number | ((index: number) => boolean);
  };
}
const stagesOf = (series: Series[]) => series.filter((s) => s.id !== 'future');
const futureOf = (series: Series[]) => series.find((s) => s.id === 'future');
const column = (day: number, values: StageChart['columns'][number]['values'], today = false) => ({
  label: String(day).padStart(2, '0'),
  title: '',
  values,
  today,
});
const ONE = { N4: 1, N3: 1, N2: 1, N1: 1 };
type Formatter = (params: { dataIndex: number; seriesName: string; marker: string }[]) => string;

const ALL_SHOWN = ['N4', 'N3', 'N2', 'N1'] as const;
const tooltipOf = (shown: readonly ('N4' | 'N3' | 'N2' | 'N1')[], dataIndex = 0) => {
  const option = stageChartOption(CHART, shown);
  const formatter = (option.tooltip as { formatter: Formatter }).formatter;
  return formatter(shown.map((name) => ({ dataIndex, seriesName: name, marker: `[${name}]` })));
};

describe('stageChartOption', () => {
  it('stacks N1 against the axis and N4 on top, a mark after today left empty', () => {
    const option = stageChartOption(CHART, ALL_SHOWN);
    const series = stagesOf(option.series as Series[]);

    expect(series.map((s) => s.name)).toEqual(['N1', 'N2', 'N3', 'N4']);
    expect(new Set(series.map((s) => s.stack)).size).toBe(1);
    expect(series[3]!.data).toEqual([1200, null]);
    expect((option.xAxis as { data: string[] }).data).toEqual(['T2 12', 'T3 13']);
  });

  it('leaves out the stages hidden, keeping the colours of the others', () => {
    const shown = ['N3', 'N1'] as const;
    const series = stagesOf(stageChartOption(CHART, shown).series as Series[]);

    expect(series.map((s) => s.name)).toEqual(['N1', 'N3']);
    expect(stagePalette(shown)).toEqual(['--n1', '--n3', '--border-strong']);
    expect(stagePalette(ALL_SHOWN)).toEqual(['--n1', '--n2', '--n3', '--n4', '--border-strong']);
  });

  it('draws a dashed line on the axis for each mark after today, whatever is hidden (mockup 1a)', () => {
    for (const shown of [ALL_SHOWN, [] as const]) {
      const series = stageChartOption(CHART, shown).series as Series[];
      const future = futureOf(series)!;

      // Last series, so it takes the last palette colour (--border-strong) for its outline.
      expect(series.at(-1)).toBe(future);
      expect(future.stack).toBe('stages');
      expect(future.data).toEqual([null, 0]);
      expect(future.barMinHeight).toBeGreaterThan(0);
      expect(future.itemStyle).toMatchObject({
        color: 'transparent',
        borderColor: 'auto',
        borderType: 'dashed',
      });
    }
  });

  it('sets the label of the mark holding today in the today style', () => {
    const chart: StageChart = { ...CHART, columns: [column(1, ONE), column(2, ONE, true)] };
    const { formatter } = (stageChartOption(chart, ALL_SHOWN).xAxis as XAxis).axisLabel;

    expect(formatter('01', 0)).toBe('01');
    expect(formatter('02', 1)).toBe('{today|02}');
  });

  it('labels every mark of a short chart', () => {
    const { interval } = (stageChartOption(CHART, ALL_SHOWN).xAxis as XAxis).axisLabel;
    expect(interval).toBe(0);
  });

  it('labels a month on its 1st, every 5th, its last day and today, not beside today', () => {
    const days = (today: number) =>
      Array.from({ length: 31 }, (_, index) => column(index + 1, ONE, index + 1 === today));
    const shownDays = (today: number) => {
      const chart = { ...CHART, columns: days(today) };
      const { interval } = (stageChartOption(chart, ALL_SHOWN).xAxis as XAxis).axisLabel;
      const show = interval as (index: number) => boolean;
      return chart.columns.flatMap((_, index) => (show(index) ? [index + 1] : []));
    };

    expect(shownDays(15)).toEqual([1, 5, 10, 15, 20, 25, 31]);
    expect(shownDays(12)).toEqual([1, 5, 10, 12, 15, 20, 25, 31]);
    // Today beside a labelled day: that day gives way.
    expect(shownDays(11)).toEqual([1, 5, 11, 15, 20, 25, 31]);
    expect(shownDays(30)).toEqual([1, 5, 10, 15, 20, 25, 30]);
  });

  it('lists N4 to N1 and their total in the tooltip, under the team and the day', () => {
    const tooltip = tooltipOf(ALL_SHOWN);

    expect(tooltip).toContain('12/10/2026 · cuối ngày');
    expect(tooltip.indexOf('[N4]')).toBeLessThan(tooltip.indexOf('[N1]'));
    expect(tooltip).toContain('1.200');
    expect(tooltip).toContain('Tổng');
    expect(tooltip).toContain('1.206');
  });

  it('adds up only the stages shown', () => {
    const tooltip = tooltipOf(['N3', 'N2']);
    expect(tooltip).not.toContain('[N4]');
    expect(tooltip).toContain('Tổng');
    expect(tooltip).toMatch(/Tổng.*\b5\b/s);
  });

  it('shows a team name as text, never as HTML (F-18)', () => {
    const tooltip = tooltipOf(ALL_SHOWN);

    expect(tooltip).toContain('&lt;b&gt;Đội&lt;/b&gt; &amp; &lt;img src=x onerror=alert(1)&gt;');
    expect(tooltip).not.toContain('<b>Đội');
    expect(tooltip).not.toContain('<img');
  });

  it('heads a mark after today with its day alone', () => {
    const tooltip = tooltipOf(ALL_SHOWN, 1);
    expect(tooltip).toContain('13/10/2026 · cuối ngày');
    expect(tooltip).not.toContain('Tổng');
  });
});
