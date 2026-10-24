import { isTauri } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTables } from '../data/AppDataContext';
import { joinParts, t } from '../i18n';
import { Screen } from '../routes/Screen';
import { ErrorBoundary } from './ErrorBoundary';
import { SaveWarning } from './SaveWarning';
import { routeToHash, sectionOf, teamPickerShown, usesScope, type Route } from './routes';
import { narrowScope, resolveScope, type ScopeChoice } from './scope';
import { ScopeContext } from './ScopeContext';
import { ScopePicker } from './ScopePicker';
import { Sidebar } from './Sidebar';
import { useRoute } from './useRoute';

/**
 * A new screen says so (DR6-35): the window takes its name, and the focus, gone with the screen
 * before, goes to its heading; back on Customers from a profile, to the card or row of that customer
 * when shown. Opening the app leaves the focus alone. The screens share one page, which keeps the
 * scroll of the screen before: a new one opens at its top (DR6-81), the card just seen in view.
 * The exe's title bar does not follow the page's title (Tauri 2): it is given the name too.
 */
function useScreenFocus(route: Route) {
  const heading = useRef<HTMLHeadingElement>(null);
  const main = useRef<HTMLElement>(null);
  const name = t(`screen.${route.screen}`);
  useEffect(() => {
    const title = joinParts([name, t('app.title')]);
    document.title = title;
    if (isTauri()) void getCurrentWindow().setTitle(title);
  }, [name]);
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

/** Sidebar + topbar + current screen (ADR-0013 layout). */
export function AppShell() {
  const route = useRoute();
  const { heading, main } = useScreenFocus(route);
  const { teams, people } = useTables();
  const [choice, setChoice] = useState<ScopeChoice>({ kind: 'all' });
  const picked = useMemo(() => resolveScope(choice, teams, people), [choice, teams, people]);
  const scope = useMemo(
    () => narrowScope(picked, choice.reInTeam, people),
    [picked, choice.reInTeam, people],
  );
  const pickRe = useCallback(
    (reId: string | null) => setChoice((current) => ({ ...current, reInTeam: reId ?? undefined })),
    [],
  );
  const scopeState = useMemo(() => ({ picked, scope, pickRe }), [picked, scope, pickRe]);

  return (
    <div className="flex min-h-screen">
      <Sidebar current={sectionOf(route)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <SaveWarning />
        <header className="sticky top-0 z-10 flex items-center gap-3.5 border-b border-border bg-surface-0 px-6 py-3.5">
          <h1 ref={heading} tabIndex={-1} className="m-0 text-xl font-semibold whitespace-nowrap">
            {t(`screen.${route.screen}`)}
          </h1>
          <div className="flex-1" />
          {usesScope(route.screen) && (
            <ScopePicker
              scope={picked}
              teams={teams}
              people={people}
              teamPicker={teamPickerShown(route.screen)}
              onChange={setChoice}
            />
          )}
        </header>
        <main ref={main} className="flex flex-col gap-4.5 px-6 pt-5 pb-8">
          <ScopeContext value={scopeState}>
            <ErrorBoundary key={routeToHash(route)} resetKey={scope}>
              <Screen route={route} />
            </ErrorBoundary>
          </ScopeContext>
        </main>
      </div>
    </div>
  );
}
