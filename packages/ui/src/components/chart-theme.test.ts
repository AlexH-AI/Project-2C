import { describe, expect, it } from 'vitest';
import { SERIES_TOKENS, chartTheme } from './chart-theme';

// Stand-in for getComputedStyle: every token resolves to a recognisable value.
const read = (name: string) => (name.startsWith('--fs-') ? '11' : `value${name}`);

describe('chartTheme', () => {
  it('colours series from the tokens, accent first', () => {
    expect(SERIES_TOKENS[0]).toBe('--accent');
    expect(chartTheme(read).color).toEqual(SERIES_TOKENS.map((name) => `value${name}`));
  });

  it('colours series from the palette given, in its order', () => {
    expect(chartTheme(read, ['--n1', '--n4']).color).toEqual(['value--n1', 'value--n4']);
  });

  it('draws text, axes and tooltips with token colours on a transparent background', () => {
    const theme = chartTheme(read);

    expect(theme.backgroundColor).toBe('transparent');
    expect(theme.textStyle).toEqual({
      color: 'value--text-2',
      fontFamily: 'value--font',
      fontSize: 11,
    });
    expect(theme.legend.textStyle.color).toBe('value--text-2');
    expect(theme.categoryAxis.axisLine.lineStyle.color).toBe('value--border-strong');
    expect(theme.categoryAxis.axisLabel.color).toBe('value--text-3');
    expect(theme.valueAxis.splitLine.lineStyle.color).toBe('value--border');
    expect(theme.tooltip).toMatchObject({
      backgroundColor: 'value--bg-2',
      borderColor: 'value--border-strong',
      textStyle: { color: 'value--text' },
    });
  });

  it('offers a `today` style for category labels: the date-today colour, bold', () => {
    expect(chartTheme(read).categoryAxis.axisLabel.rich.today).toEqual({
      color: 'value--date-today',
      fontWeight: 700,
    });
  });

  it('ignores the whitespace getComputedStyle keeps around custom properties', () => {
    expect(chartTheme((name) => ` value${name} `).color[0]).toBe('value--accent');
  });
});
