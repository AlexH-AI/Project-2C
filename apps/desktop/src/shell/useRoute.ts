import { useEffect, useSyncExternalStore } from 'react';
import { DEFAULT_ROUTE, parseHash, routeToHash, type Route } from './routes';

const STORAGE_KEY = 'p2c.lastRoute';

// Storage can be missing or throw (private mode, blocked site data); the app must still open.
function readStored(): Route | null {
  try {
    return parseHash(localStorage.getItem(STORAGE_KEY) ?? '');
  } catch {
    return null;
  }
}

function store(hash: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, hash);
  } catch {
    // Remembering the last screen is a convenience only.
  }
}

/** Who reads the route: told at once by `navigate`, and by `hashchange` for any other change. */
const readers = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  readers.add(onChange);
  window.addEventListener('hashchange', onChange);
  return () => {
    readers.delete(onChange);
    window.removeEventListener('hashchange', onChange);
  };
}

/**
 * Goes to `hash` as a link to it would, but tells the screen at once rather than at the
 * `hashchange` that comes later: inside `flushSync` the new screen is drawn before it returns, as
 * "Mở" needs (VA7b). The `hashchange` then finds the screen already there.
 */
export function navigate(hash: string): void {
  window.location.hash = hash;
  for (const read of readers) read();
}

let returning = false;

/**
 * Draws, by `change`, the screen the way back of "Mở" returns to: that screen comes back as it was
 * left (VA7b), which a screen keeping more than the scroll reads by `isReturning` as it is drawn.
 */
export function returnTo(change: () => void): void {
  returning = true;
  try {
    change();
  } finally {
    returning = false;
  }
}

/** Whether the screen being drawn is the one the way back of "Mở" returns to (`returnTo`). */
export const isReturning = () => returning;

const getHash = () => window.location.hash;

/**
 * The current screen, from the URL hash (`#/overview`…). An empty or unknown hash opens the last
 * screen used, or the overview; the address bar is then corrected to match.
 */
export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getHash);
  const route = parseHash(hash) ?? readStored() ?? DEFAULT_ROUTE;
  const canonical = routeToHash(route);

  useEffect(() => {
    if (window.location.hash !== canonical) window.history.replaceState(null, '', canonical);
    store(canonical);
  }, [canonical]);

  return route;
}
