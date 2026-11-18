import { createContext, use, useMemo, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';

/** The two places of the toolbar a screen fills: the line under its name, and its buttons. */
interface BarSlots {
  readonly sub: HTMLElement | null;
  readonly actions: HTMLElement | null;
}

const BarSlotsContext = createContext<BarSlots>({ sub: null, actions: null });

/**
 * What a screen puts on the toolbar (mockup app-shell.html `#toolbar`): `sub`, the line under its
 * name, and `actions`, its buttons, the main one last. Drawn there, they stay the screen's own:
 * its state, its handlers, and gone with it. A screen that renders none leaves the name alone.
 */
export function ScreenBar({ sub, actions }: { sub?: ReactNode; actions?: ReactNode }) {
  const slots = use(BarSlotsContext);
  return (
    <>
      {sub !== undefined && slots.sub && createPortal(sub, slots.sub)}
      {actions !== undefined && slots.actions && createPortal(actions, slots.actions)}
    </>
  );
}

/**
 * The toolbar and the screen under it. The toolbar: the name of the screen and the line under it;
 * the place kept for the "Lưu ý" pill (`data-slot="heads-up"`, VA9); then, on the right, `tools`
 * (the controls of the shell: the scope pill) and what the screen puts there: its period pill, its
 * buttons. `children` is the screen:
 * its `ScreenBar` draws into this toolbar.
 */
export function Toolbar({
  title,
  heading,
  tools,
  children,
}: {
  title: string;
  /** The name of the screen takes the focus when the screen changes (`AppShell`). */
  heading: RefObject<HTMLHeadingElement | null>;
  tools?: ReactNode;
  children: ReactNode;
}) {
  const [sub, setSub] = useState<HTMLElement | null>(null);
  const [actions, setActions] = useState<HTMLElement | null>(null);
  const slots = useMemo(() => ({ sub, actions }), [sub, actions]);
  return (
    <BarSlotsContext value={slots}>
      <header className="toolbar z-10 flex flex-none items-center gap-2.5 pr-5.5 pl-7">
        <div className="min-w-0">
          <h1 ref={heading} tabIndex={-1} className="screen-title m-0 whitespace-nowrap">
            {title}
          </h1>
          {/* --text-2, not the mockup's --text-3: over the bright cells that scroll under the
              scroll edge, --text-3 is below 4.5:1 here. A line cut short shows whole as the
              tooltip of the pointer over it. */}
          <p
            ref={setSub}
            data-slot="screen-sub"
            onPointerEnter={(event) => {
              const line = event.currentTarget;
              line.title = line.scrollWidth > line.clientWidth ? (line.textContent ?? '') : '';
            }}
            className="m-0 truncate text-sm text-fg-2 tabular-nums empty:hidden"
          />
        </div>
        <div data-slot="heads-up" className="min-w-4 flex-1" />
        <div className="flex flex-none items-center gap-2">
          {tools}
          <div ref={setActions} data-slot="screen-actions" className="contents" />
        </div>
      </header>
      {children}
    </BarSlotsContext>
  );
}
