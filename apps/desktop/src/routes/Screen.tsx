import type { Route } from '../shell/routes';
import { AppointmentsScreen } from './appointments/AppointmentsScreen';
import { CustomerProfile } from './customers/CustomerProfile';
import { CustomersScreen } from './customers/CustomersScreen';
import { Overview } from './Overview';
import { ReportsScreen } from './reports/ReportsScreen';
import { Settings } from './Settings';
import { TeamScreen } from './team/TeamScreen';

/** Screen bodies, one for every screen of `Route`; a new screen fails to compile until added. */
export function Screen({ route }: { route: Route }) {
  if (route.screen === 'overview') return <Overview />;
  if (route.screen === 'appointments') return <AppointmentsScreen />;
  // Keyed by its section, so a link to Settings → AI opens it from any section.
  if (route.screen === 'settings') return <Settings key={route.section} section={route.section} />;
  if (route.screen === 'team') return <TeamScreen />;
  if (route.screen === 'customers') return <CustomersScreen />;
  if (route.screen === 'reports') return <ReportsScreen />;
  if (route.screen === 'customer') return <CustomerProfile key={route.id} id={route.id} />;
  return route.screen satisfies never;
}
