import type { Database } from '@p2c/db';
import type { CalendarDate } from '@p2c/domain';
import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';
import type { AppData } from './app-data';
import type { Tables } from './tables';
import { watchToday } from './today';

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

/**
 * `read` run on the current database, again after every change (`AppData.run`, a reload). Pass a
 * function defined outside the component, or it runs on every render.
 */
export function useQuery<T>(read: (db: Database) => T): T {
  const data = useAppData();
  const revision = useSyncExternalStore(data.subscribe, data.revision);
  // `revision` is the point: the database object stays the same while its rows change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => read(data.db()), [data, read, revision]);
}

/**
 * The tables of the current revision (`AppData.tables`), shared by every screen; screens re-render
 * when the data changes. Destructure only the tables a screen shows: each is read when first used.
 */
export function useTables(): Tables {
  const data = useAppData();
  return useSyncExternalStore(data.subscribe, data.tables);
}

/**
 * The app's day (`AppData.today`), the same object while the day stays the same. Screens re-render
 * at midnight and when the window wakes on a new day (T-126).
 */
export function useToday(): CalendarDate {
  const data = useAppData();
  const watcher = useMemo(() => watchToday(data.today), [data]);
  return useSyncExternalStore(watcher.subscribe, watcher.current);
}
