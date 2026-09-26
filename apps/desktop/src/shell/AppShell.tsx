import { useState } from 'react';
import { Segmented } from '@p2c/ui';
import { t } from '../i18n';
import { Screen } from '../routes/Screen';
import { sectionOf } from './routes';
import { Sidebar } from './Sidebar';
import { useRoute } from './useRoute';

type Scope = 'all' | 'team' | 're';

const SCOPES = [
  { value: 'all', label: t('scope.all') },
  { value: 'team', label: t('scope.team') },
  { value: 're', label: t('scope.re') },
] as const;

/** Sidebar + topbar + current screen (ADR-0013 layout). */
export function AppShell() {
  const route = useRoute();
  // UI only for now: the screens start filtering by scope once they have data.
  const [scope, setScope] = useState<Scope>('all');

  return (
    <div className="flex min-h-screen">
      <Sidebar current={sectionOf(route)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center gap-3.5 border-b border-border bg-surface-0 px-6 py-3.5">
          <h1 className="m-0 text-xl font-semibold whitespace-nowrap">
            {t(`screen.${route.screen}`)}
          </h1>
          <div className="flex-1" />
          <Segmented label={t('scope.label')} options={SCOPES} value={scope} onChange={setScope} />
        </header>
        <main className="flex flex-col gap-4.5 px-6 pt-5 pb-8">
          <Screen route={route} />
        </main>
      </div>
    </div>
  );
}
