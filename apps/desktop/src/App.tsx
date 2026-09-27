import type { AppData } from './data/app-data';
import { AppDataContext } from './data/AppDataContext';
import { AppShell } from './shell/AppShell';
import { CloseGuard, type AppWindow } from './shell/CloseGuard';

/** `appWindow` is the exe window; web mode has none and keeps the database in memory. */
export function App({ data, appWindow }: { data: AppData; appWindow?: AppWindow }) {
  return (
    <AppDataContext value={data}>
      <AppShell />
      {appWindow && <CloseGuard appWindow={appWindow} />}
    </AppDataContext>
  );
}
