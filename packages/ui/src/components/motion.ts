import { countFrame, type CountStep } from '@p2c/domain';

/**
 * The motion of the app, the part a script does (VA7a, VA7b; ADR-0013 appendix 14/11/2026, mockup
 * chuyen-dong.html): the step a part of a screen rises at, the life of a layer, a glide, a number
 * that runs ("Đếm"), a thing that opens into its page ("Mở"). The moves themselves are the CSS of
 * theme.css ("Motion"), which also stills all of them in one place under the system's "Giảm
 * chuyển động".
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

/** Longer than any move out (--t-1, --t-2 of what dims behind a dialog): a layer whose move cannot
 * end (a page in the background) still goes then. */
export const GONE_MS = 400;

/** A style the script sets and takes away. */
interface Style {
  setProperty(name: string, value: string): void;
  removeProperty(name: string): string;
}

/** What glides: its style, its marks, and the end of its move. */
interface Glider {
  readonly style: Style;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
  addEventListener(type: string, listener: (event: Event) => void): void;
  removeEventListener(type: string, listener: (event: Event) => void): void;
}

const GLIDE_ENDS = ['animationend', 'animationcancel'] as const;

/**
 * "Trượt" of what is chosen (the pill of the sidebar, the thumb of a segmented control): drawn at
 * its new place, it starts `x` / `y` px away, where the one before was, and glides there in --t-3
 * by the snappy spring (`[data-glide]` of theme.css). Its place stays the layout's. Once its move
 * is over the marks go, so a copy of it, or the thing shown again, does not glide again.
 */
export function glide(mark: Glider, { x = 0, y = 0 }: { x?: number; y?: number }) {
  if (x === 0 && y === 0) return;
  mark.style.setProperty('--glide-x', String(x));
  mark.style.setProperty('--glide-y', String(y));
  mark.setAttribute('data-glide', '');
  const self: unknown = mark;
  const over = (event: Event) => {
    if (event.target !== self) return;
    for (const type of GLIDE_ENDS) mark.removeEventListener(type, over);
    mark.removeAttribute('data-glide');
    mark.style.removeProperty('--glide-x');
    mark.style.removeProperty('--glide-y');
  };
  for (const type of GLIDE_ENDS) mark.addEventListener(type, over);
}

/** "Đếm": the length of a run, --t-3. */
export const COUNT_MS = 400;

/** A page in the background draws no frame: the number still lands this long after a run ends. */
const COUNT_LATE_MS = 120;

/** What a run of "Đếm" is timed by: the frames of the page, a timer, the time now (in ms). */
export interface CountClock {
  frame(draw: (time: number) => void): number;
  cancelFrame(id: number): void;
  later(run: () => void, ms: number): number;
  cancelLater(id: number): void;
  now(): number;
}

/** --ease-out, as a script can run it: most of the way at the start, slowing to its end. */
const easeOut = (at: number) => 1 - (1 - at) ** 3;

export interface Counter {
  /** Shows `value` (null: "—"): at once the first time, from "—", or when `calm`; else it runs. */
  to(value: number | null, calm: boolean): void;
  /** Ends a run where it is (the number is gone from the screen). */
  stop(): void;
}

/**
 * "Đếm" (VA7b; ADR-0013 appendix 14/11/2026 §5): a number on screen runs to its new value in
 * --t-3, ease-out; each frame is `countFrame` of the domain, which `show` writes as the number at
 * rest is written. A value changed again while it runs goes on from the number shown.
 */
export function counter(
  show: (value: number | null) => void,
  step: CountStep,
  clock: CountClock,
): Counter {
  let shown: number | null | undefined;
  let frame = 0;
  let timer = 0;
  const put = (value: number | null) => {
    shown = value;
    show(value);
  };
  const stop = () => {
    clock.cancelFrame(frame);
    clock.cancelLater(timer);
  };
  return {
    stop,
    to(value, calm) {
      stop();
      const from = shown;
      if (from === undefined || from === null || value === null || calm || from === value) {
        put(value);
        return;
      }
      const start = clock.now();
      const land = () => {
        stop();
        put(value);
      };
      const draw = (time: number) => {
        const at = Math.max(0, (time - start) / COUNT_MS);
        if (at >= 1) return land();
        put(countFrame(from, value, easeOut(at), step));
        frame = clock.frame(draw);
      };
      frame = clock.frame(draw);
      timer = clock.later(land, COUNT_MS + COUNT_LATE_MS);
    },
  };
}

/** A View Transition, as "Mở" uses one. */
interface Transition {
  readonly ready: Promise<unknown>;
  readonly finished: Promise<unknown>;
  skipTransition(): void;
}

/** The page "Mở" runs on: the document, with View Transitions where the WebView has them. */
interface Page {
  startViewTransition?(update: () => void): Transition;
  readonly documentElement: {
    setAttribute(name: string, value: string): void;
    removeAttribute(name: string): void;
  };
  addEventListener(type: string, listener: () => void, capture: boolean): void;
  removeEventListener(type: string, listener: () => void, capture: boolean): void;
}

/** What is named "open" for the length of a move: the thing clicked, the page it opens. */
interface Opened {
  readonly style: Style;
}

const OPEN_NAME = 'view-transition-name';

let opening: Transition | null = null;

/**
 * "Mở" (VA7b; ADR-0013 appendix 14/11/2026 §3, chuyen-dong.html `#mo`): the thing clicked (`from`)
 * grows into the page `to()` gives once `change` has drawn the new screen; `back`, the page shrinks
 * to the thing again, or only fades when `to()` finds nothing. The move is the CSS of theme.css
 * (`data-open` on <html>). `change(true)` must draw the new screen before it returns (`flushSync`):
 * the page is pictured then. Without View Transitions, under "Giảm chuyển động", or with nothing
 * clicked, `change(false)` runs at once and the screen changes the plain way ("Hiện"). A new move,
 * or a press, ends the one under way at its end.
 */
export function openFrom(
  from: Opened | null,
  change: (moving: boolean) => void,
  {
    to,
    back = false,
    page = document,
  }: { to?: () => Opened | null; back?: boolean; page?: Page } = {},
): void {
  opening?.skipTransition();
  if (!from || !page.startViewTransition || calmMotion()) {
    change(false);
    return;
  }
  const root = page.documentElement;
  root.setAttribute('data-open', back ? 'back' : 'in');
  from.style.setProperty(OPEN_NAME, 'open');
  let end: Opened | null = null;
  const move = page.startViewTransition(() => {
    from.style.removeProperty(OPEN_NAME);
    change(true);
    end = to?.() ?? null;
    end?.style.setProperty(OPEN_NAME, 'open');
  });
  opening = move;
  const press = () => move.skipTransition();
  page.addEventListener('pointerdown', press, true);
  // A move skipped (a page in the background, a new move) never gets ready: that is no error.
  move.ready.catch(() => undefined);
  void move.finished
    .catch(() => undefined)
    .then(() => {
      page.removeEventListener('pointerdown', press, true);
      end?.style.removeProperty(OPEN_NAME);
      if (opening !== move) return;
      opening = null;
      root.removeAttribute('data-open');
    });
}
