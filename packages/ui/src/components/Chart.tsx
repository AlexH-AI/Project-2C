import { useEffect, useRef, useState } from 'react';
import { format, init, use as registerModules, type ComposeOption } from 'echarts/core';
import { BarChart, type BarSeriesOption } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  type GridComponentOption,
  type LegendComponentOption,
  type TooltipComponentOption,
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import { SERIES_TOKENS, chartTheme } from './chart-theme';

// Register only the ECharts modules in use (ADR-0014); add a chart type here when a screen needs it.
// Every chart is small and drawn in SVG; register CanvasRenderer once one has many points (ADR-0014).
registerModules([BarChart, GridComponent, LegendComponent, TooltipComponent, SVGRenderer]);

export type ChartOption = ComposeOption<
  BarSeriesOption | GridComponentOption | LegendComponentOption | TooltipComponentOption
>;

/**
 * Escapes text for the HTML of a tooltip or label formatter: every string from the database (team,
 * RM, customer names) goes through it (F-18).
 */
export const encodeHtml: (text: string) => string = format.encodeHTML;

/**
 * A chart of the first frame is drawn this long after it at the latest, when no frame is painted (a
 * page in the background, whose timers run about once a second anyway): longer than a first frame
 * takes on a busy machine, so that one is never kept waiting.
 */
const DRAW_LATE_MS = 1_000;

/** Set from `chartsAfterFirstFrame` until the first frame of the app is painted. */
let opening = false;

/**
 * Called by the app as it draws the screen it opens on (T-525: ECharts held the first frame of
 * Tổng quan ≈ 100 ms): the charts of that draw are drawn once its frame is painted. Every other
 * chart (a new screen, another stage, period or scope) is drawn at once, never empty for a frame.
 */
export function chartsAfterFirstFrame(): void {
  opening = true;
  const over = () => {
    opening = false;
  };
  requestAnimationFrame(() => window.setTimeout(over));
  window.setTimeout(over, DRAW_LATE_MS);
}

interface ChartProps {
  /** Accessible name; the chart is exposed as one image. */
  label: string;
  /**
   * Ids (`aria-describedby`) of what gives a screen reader the numbers drawn, e.g. a short line kept
   * `hidden`: Chromium stops a long description short (review of PR 841).
   */
  describedBy?: string;
  /** Keep the object stable between renders (constant or memo), or the chart redraws. */
  option: ChartOption;
  /** Series colours as token names, in series order; the default palette otherwise. Keep stable. */
  palette?: readonly string[];
  /** Size classes; the chart fills the box. */
  className?: string;
}

/**
 * ECharts wrapper (ADR-0014): themed from the tokens, resizes with its box, disposed on unmount.
 * The box clips at its sides: a tooltip stays between them (`confine` of the theme), and on WebKit
 * the box counted a width past the window while its tooltip sat inside it, which let the page
 * scroll sideways (DR6-183; CI run 44214901028). Not at its bottom: a tooltip whose title takes
 * lines is taller than a low chart, and shows down to its last line.
 */
export function Chart({
  label,
  describedBy,
  option,
  palette = SERIES_TOKENS,
  className = 'h-64 w-full',
}: ChartProps) {
  const box = useRef<HTMLDivElement>(null);
  const [, fail] = useState<unknown>();

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    let chart: ReturnType<typeof init> | undefined;
    let observer: ResizeObserver | undefined;
    const draw = () => {
      const style = getComputedStyle(element);
      chart = init(
        element,
        chartTheme((name) => style.getPropertyValue(name), palette),
        {
          renderer: 'svg',
        },
      );
      chart.setOption(option);
      observer = new ResizeObserver(() => chart?.resize());
      observer.observe(element);
    };
    let [next, frame, late, tried] = [0, 0, 0, false];
    // A chart of the first frame is drawn once that frame is painted (`chartsAfterFirstFrame`); a
    // page in the background paints no frame: the timer draws it then. A drawing that fails is
    // thrown into React, as in the effect: the screen's ErrorBoundary shows it.
    const later = () => {
      if (tried) return;
      tried = true;
      try {
        draw();
      } catch (error) {
        fail(() => {
          throw error;
        });
      }
    };
    if (!opening) draw();
    else {
      frame = requestAnimationFrame(() => (next = window.setTimeout(later)));
      late = window.setTimeout(later, DRAW_LATE_MS);
    }
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(next);
      clearTimeout(late);
      observer?.disconnect();
      chart?.dispose();
    };
  }, [option, palette]);

  return (
    <div
      ref={box}
      role="img"
      aria-label={label}
      aria-describedby={describedBy}
      className={`overflow-x-clip ${className}`}
    />
  );
}
