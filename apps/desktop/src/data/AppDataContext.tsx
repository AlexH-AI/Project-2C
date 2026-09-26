import { createContext, useContext } from 'react';
import type { AppData } from './app-data';

/** The database opened at startup; screens read and write through it. */
export const AppDataContext = createContext<AppData | null>(null);

export function useAppData(): AppData {
  const data = useContext(AppDataContext);
  if (!data) throw new Error('useAppData needs <AppDataContext> above it');
  return data;
}
