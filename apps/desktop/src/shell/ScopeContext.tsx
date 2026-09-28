import type { Scope } from '@p2c/domain';
import { createContext, useContext } from 'react';

/** The "Góc nhìn" picked in the topbar; screens filter their data by it. */
export const ScopeContext = createContext<Scope>({ kind: 'all' });

export function useScope(): Scope {
  return useContext(ScopeContext);
}
