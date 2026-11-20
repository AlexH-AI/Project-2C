import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import type { CountStep } from '@p2c/domain';
import { calmMotion, counter, glide, type CountClock } from './motion';

/**
 * "Trượt" of what is chosen (VA7a): as `value` changes, the mark (`data-slot={slot}`) of the item
 * now chosen glides there from the item chosen before. `item` finds the item of a value on screen.
 */
export function useGlide<T>(
  value: T,
  item: (value: T) => HTMLElement | null | undefined,
  slot: string,
) {
  const before = useRef(value);
  useLayoutEffect(() => {
    const was = before.current;
    before.current = value;
    if (Object.is(was, value)) return;
    const [from, to] = [item(was), item(value)];
    const mark = to?.querySelector<HTMLElement>(`[data-slot="${slot}"]`);
    if (from && to && mark) {
      glide(mark, { x: from.offsetLeft - to.offsetLeft, y: from.offsetTop - to.offsetTop });
    }
  });
}

/** The frames of the page, and its timer. */
const PAGE_CLOCK: CountClock = {
  frame: (draw) => requestAnimationFrame(draw),
  cancelFrame: (id) => cancelAnimationFrame(id),
  later: (run, ms) => window.setTimeout(run, ms),
  cancelLater: (id) => window.clearTimeout(id),
  now: () => performance.now(),
};

/** The number "Đếm" shows for `value` now: the value itself at rest, a frame while it runs. */
export function useCount(value: number | null, step: CountStep): number | null {
  const [shown, setShown] = useState(value);
  const [count] = useState(() => counter(setShown, step, PAGE_CLOCK));
  // Before the page is painted: a value that changes at once is never drawn old for a frame.
  useLayoutEffect(() => count.to(value, calmMotion()), [count, value]);
  useEffect(() => () => count.stop(), [count]);
  return shown;
}

/**
 * A large number standing on its own that runs to its new value ("Đếm", VA7b): `write` gives what
 * a value reads as, at rest and in each frame (null: "—"). While it runs, a screen reader reads the
 * new value, not the frames; at rest the number is written once.
 */
export function Count<V extends number | null>({
  value,
  step,
  write,
}: {
  value: V;
  step: CountStep;
  write: (value: V) => ReactNode;
}) {
  // Null only when `value` is: a run is between two numbers.
  const shown = useCount(value, step) as V;
  if (shown === value) return write(value);
  return (
    <>
      <span aria-hidden="true">{write(shown)}</span>
      <span className="sr-only">{write(value)}</span>
    </>
  );
}
