import { t } from '../i18n';
import type { Route } from '../shell/routes';
import { AppointmentsScreen } from './appointments/AppointmentsScreen';
import { CustomerProfile } from './customers/CustomerProfile';
import { CustomersScreen } from './customers/CustomersScreen';
import { Overview } from './Overview';
import { ReportsScreen } from './reports/ReportsScreen';
import { Settings } from './Settings';
import { TeamScreen } from './team/TeamScreen';

/** Screen bodies; a screen without its content yet shows a placeholder. */
export function Screen({ route }: { route: Route }) {
  if (route.screen === 'overview') return <Overview />;
  if (route.screen === 'appointments') return <AppointmentsScreen />;
  if (route.screen === 'settings') return <Settings />;
  if (route.screen === 'team') return <TeamScreen />;
  if (route.screen === 'customers') return <CustomersScreen />;
  if (route.screen === 'reports') return <ReportsScreen />;
  if (route.screen === 'customer') return <CustomerProfile key={route.id} id={route.id} />;
  return <p className="text-sm text-fg-3">{t('screen.placeholder')}</p>;
}
