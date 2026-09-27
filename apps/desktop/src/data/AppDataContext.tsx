import type { Database } from '@p2c/db';
import { createContext, useContext, useSyncExternalStore } from 'react';
import type { AppData } from './app-data';

/** The database opened at startup; screens read and write through it. */
export const AppDataContext = createContext<AppData | null>(null);

export function useAppData(): AppData {
  const data = useContext(AppDataContext);
  if (!data) throw new Error('useAppData needs <AppDataContext> above it');
  return data;
}

/** The current database; screens re-render when "Reload simulated data" replaces it. */
export function useDatabase(): Database {
  const data = useAppData();
  return useSyncExternalStore(data.subscribe, data.db);
}
