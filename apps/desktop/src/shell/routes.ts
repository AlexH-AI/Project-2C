/** Screens reachable from the sidebar, in sidebar order. */
export const SECTIONS = [
  'overview',
  'appointments',
  'customers',
  'reports',
  'team',
  'settings',
] as const;

export type Section = (typeof SECTIONS)[number];

export type Route = { screen: Section } | { screen: 'customer'; id: string };

export const DEFAULT_ROUTE: Route = { screen: 'overview' };

function isSection(value: string): value is Section {
  return (SECTIONS as readonly string[]).includes(value);
}

function decode(segment: string): string | null {
  try {
    return decodeURIComponent(segment);
  } catch {
    return null;
  }
}

/** Reads `#/<section>` or `#/customers/<id>`; anything else is null. */
export function parseHash(hash: string): Route | null {
  const parts = hash.replace(/^#\/?/, '').replace(/\/$/, '').split('/');
  const [first = '', second, ...rest] = parts;
  if (rest.length > 0) return null;
  if (second === undefined) return isSection(first) ? { screen: first } : null;
  if (first !== 'customers') return null;
  const id = decode(second);
  return id ? { screen: 'customer', id } : null;
}

export function routeToHash(route: Route): string {
  return route.screen === 'customer'
    ? `#/customers/${encodeURIComponent(route.id)}`
    : `#/${route.screen}`;
}

/** The sidebar item a route belongs to. */
export function sectionOf(route: Route): Section {
  return route.screen === 'customer' ? 'customers' : route.screen;
}

/** Only these screens filter by the scope picker; the others do not read it. */
export function usesScope(screen: Route['screen']): boolean {
  return (
    screen === 'overview' ||
    screen === 'customers' ||
    screen === 'appointments' ||
    screen === 'reports'
  );
}

/** Tổng quan counts every team together in the Team scope (spec Phase 4 §4.3): no team to pick. */
export function teamPickerShown(screen: Route['screen']): boolean {
  return screen !== 'overview';
}
