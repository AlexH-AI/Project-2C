import { useEffect, useRef, useState, type AnimationEvent, type KeyboardEvent } from 'react';
import { menuMove } from './menu-keys';
import { calmMotion, layerState, type LayerState } from './motion';

/** What can take the focus a press gives: a press on one of these keeps it there. */
const CONTROL = 'a[href], button, input, select, textarea, [tabindex]';

/** Longer than any move out: a layer whose move cannot end (a page in the background) still goes. */
const GONE_MS = 400;

/**
 * The life of a layer as `open` changes (`layerState`): drawn while open or closing; what goes on
 * the layer is its state (`data-state`, for `motion-layer` of theme.css), and while it closes it
 * takes nothing (`inert`) and goes once its move out ends.
 */
export function useLayerState(open: boolean) {
  const [state, setState] = useState<LayerState>(open ? 'open' : 'closed');
  const [was, setWas] = useState(open);
  if (was !== open) {
    setWas(open);
    setState(layerState(state, open ? 'open' : 'close', calmMotion()));
  }
  const gone = () => setState((now) => layerState(now, 'gone', false));
  useEffect(() => {
    if (state !== 'closing') return;
    const late = setTimeout(gone, GONE_MS);
    return () => clearTimeout(late);
  }, [state]);
  return {
    drawn: state !== 'closed',
    layer: {
      'data-state': state,
      inert: state === 'closing',
      onAnimationEnd: (event: AnimationEvent) => {
        if (event.animationName === 'leave') gone();
      },
    },
  };
}

/**
 * A layer that opens under its button (mockup ui2.css `.tl-pop`: the menu of the scope, the period
 * picker). It closes on Esc, on a press outside, and once the focus goes to something outside;
 * Esc gives the focus back to the button, wherever the focus was: on macOS a click in the layer
 * leaves it on nothing (WebKit). So does a press outside on what takes no focus; on another
 * control, the focus stays where the press put it, or where its click puts it: on macOS a click
 * gives a button no focus (WebKit), which must not pull it back to the button first. `root` goes on
 * the box of the button and the layer; the button closes its layer with `close`. The layer moves
 * out before it goes (`useLayerState`).
 */
export function useLayer() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLSpanElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (target: EventTarget | null) =>
      target instanceof Node && !root.current?.contains(target);
    const onPress = (event: PointerEvent) => {
      if (!outside(event.target)) return;
      // What is typed in the layer is taken as when the focus leaves it, before the layer goes.
      const focused = document.activeElement;
      if (focused instanceof HTMLElement && root.current?.contains(focused)) focused.blur();
      setOpen(false);
      if (event.target instanceof Element && event.target.closest(CONTROL)) return;
      // Once the press on what takes no focus is over, the focus left on the page goes back to
      // the button; a press that ends in a drag (a cancel) leaves it alone.
      const settle = (end: PointerEvent) => {
        document.removeEventListener('pointerup', settle);
        document.removeEventListener('pointercancel', settle);
        const now = document.activeElement;
        if (end.type === 'pointerup' && (!now || now === document.body)) trigger.current?.focus();
      };
      document.addEventListener('pointerup', settle);
      document.addEventListener('pointercancel', settle);
    };
    // A click on macOS may move the focus to nothing (WebKit): only a real target counts.
    const onFocus = (event: FocusEvent) => {
      if (outside(event.target)) setOpen(false);
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener('pointerdown', onPress);
    document.addEventListener('focusin', onFocus);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPress);
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  /** Closes the layer, the focus back on its button. */
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  return { open, setOpen, close, root, trigger, ...useLayerState(open) };
}

/** Where a layer sits: under the right end of its button, over the screen; it moves in and out. */
export const LAYER = 'pop motion-layer absolute top-full right-0 z-20 mt-2';

/** One row of a menu. */
export interface MenuRow {
  readonly key: string;
  readonly label: string;
  /** At the right end of the row: a count. */
  readonly note?: string;
  /** A row of the choice: whether it is the one chosen. Picking it closes the menu. */
  readonly checked?: boolean;
  /** A row that opens rows under it: whether they show. The menu stays open when it is picked. */
  readonly expanded?: boolean;
  /** A row under an opened one, set in. */
  readonly sub?: boolean;
  /** A line over the row. */
  readonly divided?: boolean;
}

/** The marks of a menu (mockups' `#i-check`, `#i-down`, `#i-chev`), no text for a screen reader. */
function Mark({ path, className }: { path: string; className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`flex-none ${className}`}
    >
      <path d={path} />
    </svg>
  );
}

const ROW =
  'group flex min-h-8 w-full cursor-pointer items-center gap-2.5 rounded-control-sm pr-2.5 text-left text-md whitespace-nowrap hover:bg-fill-2 focus-visible:bg-fill-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent';

/**
 * The rows of a menu (mockup ui2.css `.menu`, components.html 03): a heading, then rows. A row of
 * the choice is a `menuitemradio`; a row that opens others a `menuitem` with `aria-expanded`. The
 * arrows, Home and End move the focus among the rows, which are out of the Tab order.
 */
export function MenuRows({
  title,
  rows,
  onPick,
  layer,
}: {
  /** The heading of the menu, and its name. */
  title: string;
  rows: readonly MenuRow[];
  onPick: (row: MenuRow) => void;
  /** Its state as a layer that moves in and out (`useLayerState`). */
  layer?: ReturnType<typeof useLayerState>['layer'];
}) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const buttons = [...event.currentTarget.querySelectorAll('button')];
    const to = menuMove(
      event.key,
      buttons.indexOf(event.target as HTMLButtonElement),
      buttons.length,
    );
    if (to === null) return;
    event.preventDefault();
    buttons[to]?.focus();
  };
  return (
    <div
      role="menu"
      aria-label={title}
      onKeyDown={onKeyDown}
      {...layer}
      className={`${LAYER} max-h-110 min-w-67 overflow-y-auto rounded-menu p-1.5`}
    >
      <div className="px-2.5 pt-1.5 pb-1 text-xs font-semibold text-fg-3">{title}</div>
      {rows.map((row) => {
        const opener = row.expanded !== undefined;
        // Chosen, a row of the first level takes the gold; a row under an opened one keeps its
        // colour, and its weight and the gold check say it (mockup bao-cao.html `.sub.on`).
        const tone = row.sub ? 'pl-7.5 text-fg-2' : `pl-2.5 ${row.checked ? 'text-accent' : ''}`;
        return (
          <div key={row.key} role="none">
            {row.divided && <hr className="mx-2 my-1 border-0 border-t border-hairline" />}
            <button
              type="button"
              role={opener ? 'menuitem' : 'menuitemradio'}
              aria-checked={opener ? undefined : row.checked === true}
              aria-expanded={row.expanded}
              tabIndex={-1}
              onClick={() => onPick(row)}
              className={`${ROW} ${tone} ${row.checked ? 'font-semibold' : ''}`}
            >
              {opener && (
                <Mark
                  path="M9 6l6 6-6 6"
                  className={`size-3 text-fg-3 ${row.expanded ? 'rotate-90' : ''}`}
                />
              )}
              {/* A long name is cut in the row rather than widen the menu past the window. */}
              <span className="max-w-80 truncate">{row.label}</span>
              {/* On the lighter row of the pointer or the focus, --text-3 is under 4.5:1: the
                  count goes a step brighter there. */}
              <span className="ml-auto flex items-center gap-1.5 text-fg-3 tabular-nums group-hover:text-fg-2 group-focus-visible:text-fg-2">
                {row.note}
                {row.checked && (
                  <Mark path="M5 12.5l4.5 4.5L19 7.5" className="size-4 text-accent" />
                )}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

/**
 * The picker of a toolbar (mockup ui2.css `.cap`, app-shell.html `#toolbar`): a button showing what
 * is chosen, that opens a menu under it. Opened, the focus goes to the row chosen, or to the first.
 * Esc, Tab or a press outside closes it; picking a row of the choice does too.
 */
export function MenuButton({
  label,
  text,
  title,
  rows,
  onOpen,
  onPick,
}: {
  /** The name of the button: what it picks and what is chosen, e.g. "Góc nhìn: Toàn bộ". */
  label: string;
  /** The words on the button: what is chosen. */
  text: string;
  title: string;
  rows: readonly MenuRow[];
  /** Before the menu opens: the rows may be set for what is chosen. */
  onOpen?: () => void;
  onPick: (key: string) => void;
}) {
  const { open, setOpen, close, root, trigger, drawn, layer } = useLayer();
  // The title is there only under the pointer, which it is for: kept on the button it would be
  // its description, and a screen reader would say the choice twice (DR6-187).
  const [pointed, setPointed] = useState(false);
  useEffect(() => {
    if (!open) return;
    const menu = root.current?.querySelector('[role="menu"]');
    const start = menu?.querySelector('[aria-checked="true"]') ?? menu?.querySelector('button');
    if (start instanceof HTMLElement) start.focus();
  }, [open, root]);
  return (
    <span
      ref={root}
      className="relative inline-flex"
      onKeyDown={(event) => {
        // Tab leaves the menu as Esc does: its rows are not in the Tab order.
        if (open && event.key === 'Tab') {
          event.preventDefault();
          close();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        title={pointed ? text : undefined}
        onPointerEnter={() => setPointed(true)}
        onPointerLeave={() => setPointed(false)}
        onClick={() => {
          if (open) return close();
          onOpen?.();
          setOpen(true);
        }}
        className="press btn-default inline-flex h-8.5 cursor-pointer items-center gap-1.5 rounded-control px-3.25 text-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {/* Capped: a long name would push the toolbar out of the window (DR6-170); it is read
            whole from the title. */}
        <span className="max-w-60 truncate">{text}</span>
        <Mark path="M6 9l6 6 6-6" className="size-3.25 text-fg-2" />
      </button>
      {drawn && (
        <MenuRows
          title={title}
          rows={rows}
          layer={layer}
          onPick={(row) => {
            onPick(row.key);
            if (row.expanded === undefined) close();
          }}
        />
      )}
    </span>
  );
}
