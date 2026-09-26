import { t } from '../i18n';
import type { Route } from '../shell/routes';
import { Overview } from './Overview';

/** Screen bodies. Mostly empty for now: each screen gets its content in Phase 3–4. */
export function Screen({ route }: { route: Route }) {
  if (route.screen === 'overview') return <Overview />;
  return <p className="text-sm text-fg-3">{t('screen.placeholder')}</p>;
}
