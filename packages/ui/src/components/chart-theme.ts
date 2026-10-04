/** Reads one CSS custom property, e.g. `--accent` (in the app: getComputedStyle). */
export type TokenReader = (name: string) => string;

/** Series colours in order (ADR-0013): the accent first, then the stage colours. */
export const SERIES_TOKENS = [
  '--accent',
  '--n3',
  '--n2',
  '--n1',
  '--submitted',
  '--on-hold',
  '--n4',
] as const;

/**
 * ECharts theme built from the ADR-0013 tokens, so charts follow the app's colours and font; series
 * take the `palette` colours in order.
 */
export function chartTheme(readToken: TokenReader, palette: readonly string[] = SERIES_TOKENS) {
  const token = (name: string) => readToken(name).trim();
  const text2 = token('--text-2');
  const text3 = token('--text-3');
  const border = token('--border');
  const borderStrong = token('--border-strong');

  const axis = {
    axisLine: { lineStyle: { color: borderStrong } },
    axisTick: { lineStyle: { color: borderStrong } },
    axisLabel: { color: text3 },
    splitLine: { lineStyle: { color: border } },
  };

  return {
    color: palette.map(token),
    backgroundColor: 'transparent',
    textStyle: {
      color: text2,
      fontFamily: token('--font'),
      fontSize: Number.parseFloat(token('--fs-xs')),
    },
    legend: { textStyle: { color: text2 } },
    // A label formatted `{today|…}` marks the column of today, as the calendars do.
    categoryAxis: {
      ...axis,
      axisLabel: {
        ...axis.axisLabel,
        rich: { today: { color: token('--date-today'), fontWeight: 700 } },
      },
    },
    valueAxis: axis,
    tooltip: {
      backgroundColor: token('--bg-2'),
      borderColor: borderStrong,
      textStyle: { color: token('--text') },
    },
  };
}
