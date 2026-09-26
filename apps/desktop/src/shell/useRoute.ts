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

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

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
