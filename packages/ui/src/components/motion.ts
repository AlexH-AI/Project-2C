/**
 * The motion of the app, the part a script does (VA7a; ADR-0013 appendix 14/11/2026, mockup
 * chuyen-dong.html): the step a part of a screen rises at, the life of a layer, a glide. The moves
 * themselves are the CSS of theme.css ("Motion"), which also stills all of them in one place under
 * the system's "Giảm chuyển động".
 */

/** "Hiện": the parts of a new screen rise 28 ms apart, in at most 8 steps, so all land by 0.6 s. */
export const RISE_STEPS = 8;

/** The step of a part by its place in the screen (0 first): the ninth and later rise with the eighth. */
export const riseStep = (index: number) => Math.min(index, RISE_STEPS - 1);

/** The system's "Giảm chuyển động"; where it cannot be asked (a test without a page), no motion. */
export const calmMotion = () =>
  typeof matchMedia !== 'function' || matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A layer that moves out before it goes (a menu, the period picker, a toast): `closing` for the
 * time of its move out, then `closed`, gone from the page. Under "Giảm chuyển động" (`calm`) it
 * goes at once; opened again while closing, it is open again.
 */
export type LayerState = 'open' | 'closing' | 'closed';

export function layerState(
  state: LayerState,
  event: 'open' | 'close' | 'gone',
  calm: boolean,
): LayerState {
  if (event === 'open') return 'open';
  if (event === 'close') return state !== 'open' ? state : calm ? 'closed' : 'closing';
  return state === 'closing' ? 'closed' : state;
}

/** What glides: its style, and its marks. */
interface Glider {
  readonly style: { setProperty(name: string, value: string): void };
  setAttribute(name: string, value: string): void;
}

/**
 * "Trượt" of what is chosen (the pill of the sidebar, the thumb of a segmented control): drawn at
 * its new place, it starts `x` / `y` px away, where the one before was, and glides there in --t-3
 * by the snappy spring (`[data-glide]` of theme.css). Its place stays the layout's.
 */
export function glide(mark: Glider, { x = 0, y = 0 }: { x?: number; y?: number }) {
  if (x === 0 && y === 0) return;
  mark.style.setProperty('--glide-x', String(x));
  mark.style.setProperty('--glide-y', String(y));
  mark.setAttribute('data-glide', '');
}
