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
  name: string;
  stack: string;
  data: (number | null)[];
}
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
    const series = option.series as Series[];

    expect(series.map((s) => s.name)).toEqual(['N1', 'N2', 'N3', 'N4']);
    expect(new Set(series.map((s) => s.stack)).size).toBe(1);
    expect(series[3]!.data).toEqual([1200, null]);
    expect((option.xAxis as { data: string[] }).data).toEqual(['T2 12', 'T3 13']);
  });

  it('leaves out the stages hidden, keeping the colours of the others', () => {
    const shown = ['N3', 'N1'] as const;
    const series = stageChartOption(CHART, shown).series as Series[];

    expect(series.map((s) => s.name)).toEqual(['N1', 'N3']);
    expect(stagePalette(shown)).toEqual(['--n1', '--n3']);
    expect(stagePalette(ALL_SHOWN)).toEqual(['--n1', '--n2', '--n3', '--n4']);
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
