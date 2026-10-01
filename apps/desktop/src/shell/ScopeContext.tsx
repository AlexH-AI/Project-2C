import type { Scope } from '@p2c/domain';
import { createContext, useContext } from 'react';

export interface ScopeState {
  /** The "Góc nhìn" picked in the topbar. */
  readonly picked: Scope;
  /** `picked`, narrowed to the RE picked in the RE strip of a Team scope: what screens filter by. */
  readonly scope: Scope;
  /** Picks an RE of the team in the strip, or the whole team (null). */
  readonly pickRe: (reId: string | null) => void;
}

const all: Scope = { kind: 'all' };

/** The scope the screens filter by, shared by Customers and Appointments. */
export const ScopeContext = createContext<ScopeState>({
  picked: all,
  scope: all,
  pickRe: () => {},
});

export function useScopeState(): ScopeState {
  return useContext(ScopeContext);
}
