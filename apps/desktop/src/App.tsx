import type { AppData } from './data/app-data';
import { AppDataContext } from './data/AppDataContext';
import { AppShell } from './shell/AppShell';

export function App({ data }: { data: AppData }) {
  return (
    <AppDataContext value={data}>
      <AppShell />
    </AppDataContext>
  );
}
