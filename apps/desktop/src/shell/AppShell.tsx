import { useCallback, useMemo, useState } from 'react';
import { listPeople, listTeams, type Database } from '@p2c/db';
import { useQuery } from '../data/AppDataContext';
import { t } from '../i18n';
import { Screen } from '../routes/Screen';
import { ErrorBoundary } from './ErrorBoundary';
import { SaveWarning } from './SaveWarning';
import { routeToHash, sectionOf, usesScope } from './routes';
import { narrowScope, resolveScope, type ScopeChoice } from './scope';
import { ScopeContext } from './ScopeContext';
import { ScopePicker } from './ScopePicker';
import { Sidebar } from './Sidebar';
import { useRoute } from './useRoute';

const readScopeOptions = (db: Database) => ({ teams: listTeams(db), people: listPeople(db) });

/** Sidebar + topbar + current screen (ADR-0013 layout). */
export function AppShell() {
  const route = useRoute();
  const { teams, people } = useQuery(readScopeOptions);
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
          <h1 className="m-0 text-xl font-semibold whitespace-nowrap">
            {t(`screen.${route.screen}`)}
          </h1>
          <div className="flex-1" />
          {usesScope(route.screen) && (
            <ScopePicker scope={picked} teams={teams} people={people} onChange={setChoice} />
          )}
        </header>
        <main className="flex flex-col gap-4.5 px-6 pt-5 pb-8">
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
