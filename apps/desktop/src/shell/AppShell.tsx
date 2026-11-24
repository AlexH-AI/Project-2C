import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type RefObject,
} from 'react';
import { flushSync } from 'react-dom';
import { IconButton, openFrom, riseStep } from '@p2c/ui';
import { useTables } from '../data/AppDataContext';
import { joinParts, t } from '../i18n';
import { lightCard } from '../routes/classes';
import { Screen } from '../routes/Screen';
import type { AppWindow } from './CloseGuard';
import { isPaletteKey } from './command-palette';
import { CommandPalette } from './CommandPalette';
import { ErrorBoundary } from './ErrorBoundary';
import { HeadsUp } from './HeadsUp';
import { NameMaskButton } from './NameMask';
import { SaveWarning } from './SaveWarning';
import {
  resolveRoute,
  routeToHash,
  screenTitle,
  sectionOf,
  teamPickerShown,
  usesScope,
  type Route,
} from './routes';
import { narrowScope, pinChoice, resolveScope, type ScopeChoice } from './scope';
import { ScopeContext } from './ScopeContext';
import { ScopePicker } from './ScopePicker';
import { Toolbar } from './ScreenBar';
import { Sidebar } from './Sidebar';
import { ToastProvider, ToastRegion } from './Toasts';
import { forgetWays, navigate, openWay, returnTo, useRoute, wayBack } from './useRoute';

/**
 * The link on the screen shown to the page `href`: one of "Mở" (`data-open`) first, the one a page
 * opened by it shrinks back to, else any. The focus and the way back of "Mở" find the same one.
 */
function linkTo(main: HTMLElement | null, href: string): HTMLElement | undefined {
  const links = [...(main?.querySelectorAll<HTMLElement>('a[href]') ?? [])].filter(
    (link) => link.getAttribute('href') === href,
  );
  return links.find((link) => link.hasAttribute('data-open')) ?? links[0];
}

/**
 * A new screen says so (DR6-35): the window takes its name, and the focus, gone with the screen
 * before, goes to its heading; back on a screen from a page it opened by "Mở", to its card or row
 * when shown, and on Customers to any link of the customer. Opening the app leaves the focus alone.
 * The screens share one page, which keeps the scroll of the screen before: a new one opens at its
 * top (DR6-81), the card just seen in view.
 * The exe's title bar does not follow the page's title (Tauri 2): its window is given the name too.
 */
function useScreenFocus(route: Route, name: string, appWindow: AppWindow | undefined) {
  const heading = useRef<HTMLHeadingElement>(null);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    const title = joinParts([name, t('app.title')]);
    document.title = title;
    void appWindow?.setTitle(title);
  }, [name, appWindow]);
  const hash = routeToHash(route);
  const onCustomers = route.screen === 'customers';
  const shown = useRef(hash);
  useEffect(() => {
    const before = shown.current;
    shown.current = hash;
    if (before === hash) return;
    const seen = linkTo(main.current, before);
    if (seen && (onCustomers || seen.hasAttribute('data-open'))) seen.focus();
    else {
      window.scrollTo(0, 0);
      heading.current?.focus({ preventScroll: true });
    }
  }, [hash, onCustomers]);
  return { heading, main };
}

/** A part of a screen for "Hiện": a card, or a block marked `data-part` (a row of controls). */
const PART = '.card, [data-part]';

/** Past the last move of "Hiện" (a bar of the eighth step lands at 0.9 s). */
const RISE_MS = 1_000;

/**
 * "Hiện" (VA7a, chuyen-dong.html `#hien`): a new screen is there at once, the one before gone with
 * no move; its parts rise in their order (`[data-rise]` of theme.css, `riseStep`), with the name
 * of the screen and the line under it. A part inside another rises with it: the rows of a table,
 * the cards of the board of Khách hàng. Only as a screen opens: what a change of scope or period
 * draws again is there at once. The name and its line stay from screen to screen; their move
 * starts again. A screen drawn by "Mở" (`still`) comes as one block: nothing in it rises.
 */
function useRise(
  main: RefObject<HTMLElement | null>,
  heading: RefObject<HTMLElement | null>,
  hash: string,
  still: RefObject<boolean>,
) {
  useLayoutEffect(() => {
    if (still.current) return;
    const parts = [...(main.current?.querySelectorAll<HTMLElement>(PART) ?? [])].filter(
      (part) => !part.parentElement?.closest(PART),
    );
    parts.forEach((part, index) => {
      part.style.setProperty('--rise-step', String(riseStep(index)));
      part.setAttribute('data-rise', '');
    });
    const name = heading.current;
    const lines = [name, name?.nextElementSibling].filter((line) => line instanceof HTMLElement);
    for (const line of lines) {
      line.removeAttribute('data-rise');
      void line.offsetWidth;
      line.setAttribute('data-rise', '');
    }
    const settled = setTimeout(() => {
      for (const moved of [...parts, ...lines]) moved.removeAttribute('data-rise');
    }, RISE_MS);
    return () => clearTimeout(settled);
  }, [main, heading, hash, still]);
}

/** A card of the board of Khách hàng grows itself; a name in a table, its row (`data-open="row"`). */
const grower = (link: HTMLElement): HTMLElement =>
  (link.dataset.open === 'row' && link.closest('tr')) || link;

/**
 * "Mở" (VA7b, `openFrom`; chuyen-dong.html `#mo`): a link marked `data-open` grows into the page
 * it opens, the whole of `main`; the link back to the screen it came from then shrinks the page to
 * it again, that screen as it was left: as far scrolled, the focus on the link (`useScreenFocus`).
 * A page opened so may open another (Team → an RM → a customer): each goes back to the one before
 * (`wayBack`). The new screen is drawn in `flushSync`, so the move pictures it. Another way to a
 * screen (the sidebar, any other link) forgets the ways back. Gives the click handler of `main`,
 * and `still`: set while "Mở" draws a screen, which comes as one block ("Hiện" does not play).
 */
function useOpen(main: RefObject<HTMLElement | null>, hash: string) {
  const still = useRef(false);
  useEffect(() => forgetWays(hash), [hash]);
  const go = (to: string, moving: boolean) => {
    still.current = moving;
    try {
      flushSync(() => navigate(to));
    } finally {
      still.current = false;
    }
  };
  const onOpen = (event: MouseEvent<HTMLElement>) => {
    const plain = !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey);
    if (event.defaultPrevented || event.button !== 0 || !plain) return;
    const link = event.target instanceof Element ? event.target.closest('a') : null;
    const to = link?.getAttribute('href');
    if (!link || !to) return;
    const back = wayBack(hash);
    if (link.hasAttribute('data-open')) {
      event.preventDefault();
      openWay({ from: hash, scroll: window.scrollY, to });
      openFrom(grower(link), (moving) => go(to, moving), { to: () => main.current });
    } else if (back && to === back.from) {
      event.preventDefault();
      wayBack(hash, true);
      // The link of the page on the screen returned to, if it is still there.
      const shown = () => {
        const link = linkTo(main.current, back.to);
        return link ? grower(link) : null;
      };
      const change = (moving: boolean) => {
        returnTo(() => go(to, moving));
        window.scrollTo(0, back.scroll);
      };
      openFrom(main.current, change, { back: true, to: shown });
    }
  };
  return { onOpen, still };
}

/**
 * Sidebar + toolbar + current screen (mockup app-shell.html), and the toast of the window, which every
 * screen shows through (`useToast`); `appWindow` is the exe's (see `App`).
 */
export function AppShell({ appWindow }: { appWindow?: AppWindow }) {
  return (
    <ToastProvider>
      <Shell appWindow={appWindow} />
    </ToastProvider>
  );
}

function Shell({ appWindow }: { appWindow?: AppWindow }) {
  const { teams, people } = useTables();
  const route = useRoute((parsed) => resolveRoute(parsed, people));
  const title = screenTitle(route, people);
  const { heading, main } = useScreenFocus(route, title, appWindow);
  const { onOpen, still } = useOpen(main, routeToHash(route));
  useRise(main, heading, routeToHash(route), still);
  const [choice, setChoice] = useState<ScopeChoice>({ kind: 'all' });
  const picked = useMemo(() => resolveScope(choice, teams, people), [choice, teams, people]);
  // The team or RM shown stays the one shown: a name changed or added never moves it (CLR6-D6).
  const pinned = pinChoice(choice, picked);
  if (pinned !== choice) setChoice(pinned);
  const scope = useMemo(
    () => narrowScope(picked, choice.rmInTeam, people),
    [picked, choice.rmInTeam, people],
  );
  const pickRm = useCallback(
    (rmId: string | null) => setChoice((current) => ({ ...current, rmInTeam: rmId ?? undefined })),
    [],
  );
  const scopeState = useMemo(() => ({ picked, scope, pickRm }), [picked, scope, pickRm]);
  const [palette, setPalette] = useState(false);
  usePaletteKey(setPalette);

  return (
    <div className="flex min-h-screen">
      {/* On Windows the content lies on a pane of its own, its edge and corner drawn above the
          toolbar (VA5); the column keeps the 1 px of the edge it had. */}
      <div aria-hidden="true" data-slot="content-pane" className="content-pane" />
      <div aria-hidden="true" data-slot="content-edge" className="content-edge" />
      <Sidebar current={sectionOf(route)} />
      <div className="flex min-w-0 flex-1 flex-col win:border-l win:border-transparent">
        <SaveWarning heading={heading} />
        <Toolbar
          title={title}
          heading={heading}
          headsUp={<HeadsUp scope={picked} />}
          tools={
            <>
              {/* The mask of customer names, at the same place on every screen (VA6a). */}
              <NameMaskButton />
              {usesScope(route.screen) && (
                <ScopePicker
                  scope={picked}
                  teams={teams}
                  people={people}
                  teamPicker={teamPickerShown(route.screen)}
                  onChange={setChoice}
                />
              )}
              {/* The magnifier opens the command bar on both systems (VA8; Owner 21/11/2026). */}
              <IconButton
                icon="search"
                label={t('palette.open')}
                onClick={() => setPalette(true)}
              />
            </>
          }
        >
          <main
            ref={main}
            onPointerMove={lightCard}
            onClick={onOpen}
            className="flex flex-col gap-4.5 px-7 pt-5 pb-8"
          >
            <ScopeContext value={scopeState}>
              <ErrorBoundary key={routeToHash(route)} resetKey={scope}>
                <Screen route={route} />
              </ErrorBoundary>
            </ScopeContext>
          </main>
        </Toolbar>
      </div>
      <ToastRegion heading={heading} />
      {palette && <CommandPalette onClose={() => setPalette(false)} fallback={heading} />}
    </div>
  );
}

/**
 * ⌘K / Ctrl K opens the command bar on every screen, a field being typed in too, and closes it
 * (VA8): heard before any field, and only that key is taken. Not over another dialog. The key held
 * down repeats: only its first press counts (L243).
 */
function usePaletteKey(setPalette: (change: (open: boolean) => boolean) => void) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!isPaletteKey(event)) return;
      const modal = document.querySelector('dialog:modal');
      if (modal && !modal.hasAttribute('data-palette')) return;
      event.preventDefault();
      if (!event.repeat) setPalette((open) => !open);
    };
    addEventListener('keydown', onKey, true);
    return () => removeEventListener('keydown', onKey, true);
  }, [setPalette]);
}
