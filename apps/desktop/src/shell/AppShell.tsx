import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { riseStep } from '@p2c/ui';
import { useTables } from '../data/AppDataContext';
import { joinParts, t } from '../i18n';
import { lightCard } from '../routes/classes';
import { Screen } from '../routes/Screen';
import type { AppWindow } from './CloseGuard';
import { ErrorBoundary } from './ErrorBoundary';
import { NameMaskButton } from './NameMask';
import { SaveWarning } from './SaveWarning';
import { routeToHash, sectionOf, teamPickerShown, usesScope, type Route } from './routes';
import { narrowScope, resolveScope, type ScopeChoice } from './scope';
import { ScopeContext } from './ScopeContext';
import { ScopePicker } from './ScopePicker';
import { Toolbar } from './ScreenBar';
import { Sidebar } from './Sidebar';
import { ToastProvider, ToastRegion } from './Toasts';
import { useRoute } from './useRoute';

/**
 * A new screen says so (DR6-35): the window takes its name, and the focus, gone with the screen
 * before, goes to its heading; back on Customers from a profile, to the card or row of that customer
 * when shown. Opening the app leaves the focus alone. The screens share one page, which keeps the
 * scroll of the screen before: a new one opens at its top (DR6-81), the card just seen in view.
 * The exe's title bar does not follow the page's title (Tauri 2): its window is given the name too.
 */
function useScreenFocus(route: Route, appWindow: AppWindow | undefined) {
  const heading = useRef<HTMLHeadingElement>(null);
  const main = useRef<HTMLElement>(null);
  const name = t(`screen.${route.screen}`);
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
    const seen = onCustomers
      ? [...(main.current?.querySelectorAll<HTMLElement>('a[href]') ?? [])].find(
          (link) => link.getAttribute('href') === before,
        )
      : undefined;
    if (seen) seen.focus();
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
 * starts again.
 */
function useRise(
  main: RefObject<HTMLElement | null>,
  heading: RefObject<HTMLElement | null>,
  hash: string,
) {
  useLayoutEffect(() => {
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
  }, [main, heading, hash]);
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
  const route = useRoute();
  const { heading, main } = useScreenFocus(route, appWindow);
  useRise(main, heading, routeToHash(route));
  const { teams, people } = useTables();
  const [choice, setChoice] = useState<ScopeChoice>({ kind: 'all' });
  const picked = useMemo(() => resolveScope(choice, teams, people), [choice, teams, people]);
  const scope = useMemo(
    () => narrowScope(picked, choice.rmInTeam, people),
    [picked, choice.rmInTeam, people],
  );
  const pickRm = useCallback(
    (rmId: string | null) => setChoice((current) => ({ ...current, rmInTeam: rmId ?? undefined })),
    [],
  );
  const scopeState = useMemo(() => ({ picked, scope, pickRm }), [picked, scope, pickRm]);

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
          title={t(`screen.${route.screen}`)}
          heading={heading}
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
            </>
          }
        >
          <main
            ref={main}
            onPointerMove={lightCard}
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
    </div>
  );
}
