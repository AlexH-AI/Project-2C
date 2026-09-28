import { t } from '../i18n';
import type { Route } from '../shell/routes';
import { Appointments } from './Appointments';
import { Overview } from './Overview';
import { Settings } from './Settings';
import { TeamScreen } from './team/TeamScreen';

/** Screen bodies. Mostly empty for now: each screen gets its content in Phase 3–4. */
export function Screen({ route }: { route: Route }) {
  if (route.screen === 'overview') return <Overview />;
  if (route.screen === 'appointments') return <Appointments />;
  if (route.screen === 'settings') return <Settings />;
  if (route.screen === 'team') return <TeamScreen />;
  return <p className="text-sm text-fg-3">{t('screen.placeholder')}</p>;
}
