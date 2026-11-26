import { createContext, use, useMemo, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { macDragRegion } from './platform';

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
 * in the middle of the free space, `headsUp`, the "Lưu ý" pill (VA9); then, on the right, `tools`
 * (the controls of the shell: the eye of the customer-name mask, the scope pill) and what the
 * screen puts there: its period pill, its buttons. `children` is the screen: its `ScreenBar`
 * draws into this toolbar.
 */
export function Toolbar({
  title,
  heading,
  headsUp,
  tools,
  children,
}: {
  title: string;
  /** The name of the screen takes the focus when the screen changes (`AppShell`). */
  heading: RefObject<HTMLHeadingElement | null>;
  headsUp?: ReactNode;
  tools?: ReactNode;
  children: ReactNode;
}) {
  const [sub, setSub] = useState<HTMLElement | null>(null);
  const [actions, setActions] = useState<HTMLElement | null>(null);
  const slots = useMemo(() => ({ sub, actions }), [sub, actions]);
  return (
    <BarSlotsContext value={slots}>
      {/* The macOS window moves by the free space of the toolbar (VA5): the bar itself and the
          place between the name and the pills, not what they open (menus open inside the bar). */}
      <header
        data-tauri-drag-region={macDragRegion('self')}
        className="toolbar z-10 flex flex-none items-center gap-2.5 pr-5.5 pl-7"
      >
        {/* Short of room, the line under the name is cut first (`shrink-1000`), then the pill
            gives up the customer's name, then its time left; once today has none left, "kế tiếp
            …" first, "Hết lịch hôm nay" whole. The part of a pixel taken from the pill while the
            line is cut goes from its 1 px spacer (HeadsUp.tsx), not from its words. The name
            keeps 80 px at least. */}
        <div className="min-w-20 shrink-1000">
          {/* Cut at its end only (`clip` on x): the marks over a capital (Ổ) and the tails under
              the line pass its 1.15 line, and `truncate` would cut them too. */}
          <h1
            ref={heading}
            tabIndex={-1}
            className="screen-title m-0 overflow-x-clip text-ellipsis whitespace-nowrap"
          >
            {title}
          </h1>
          {/* --text-2, not the mockup's --text-3: over the bright cells that scroll under the
              scroll edge, --text-3 is below 4.5:1 here. A line cut short shows whole as the
              tooltip of the pointer over it, and only then: kept, the title would be the
              description of the line, an old one once the line changes (DR6-187). */}
          <p
            ref={setSub}
            data-slot="screen-sub"
            onPointerEnter={(event) => {
              const line = event.currentTarget;
              if (line.scrollWidth > line.clientWidth) line.title = line.textContent ?? '';
            }}
            onPointerLeave={(event) => event.currentTarget.removeAttribute('title')}
            className="m-0 truncate text-sm text-fg-2 tabular-nums empty:hidden"
          />
        </div>
        <div
          data-slot="heads-up"
          data-tauri-drag-region={macDragRegion('self')}
          className="flex min-w-0 flex-auto justify-center"
        >
          {headsUp}
        </div>
        <div className="flex flex-none items-center gap-2">
          {tools}
          <div ref={setActions} data-slot="screen-actions" className="contents" />
        </div>
      </header>
      {children}
    </BarSlotsContext>
  );
}
