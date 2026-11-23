import { isRm, type Person } from '@p2c/domain';
import { t } from '../i18n';

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

/** A section of Cài đặt a link opens at once; none is Dữ liệu, the first. */
export type SettingsSection = 'ai' | 'trash';

function isSettingsSection(value: string): value is SettingsSection {
  return value === 'ai' || value === 'trash';
}

export type Route =
  | { screen: Exclude<Section, 'settings'> }
  | { screen: 'settings'; section?: SettingsSection }
  | { screen: 'customer'; id: string }
  | { screen: 'rm'; id: string };

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

/**
 * Reads `#/<section>`, `#/customers/<id>`, `#/team/rm/<id>`, `#/settings/ai` or
 * `#/settings/trash`; else null. The page of an RM sits under Team & nhân sự, the item that stays
 * chosen on it, and names what its id is of: a page of a team may come beside it.
 */
export function parseHash(hash: string): Route | null {
  const parts = hash.replace(/^#\/?/, '').replace(/\/$/, '').split('/');
  const [first = '', second, ...rest] = parts;
  if (first === 'team' && second === 'rm' && rest.length === 1) {
    const id = decode(rest[0]!);
    return id ? { screen: 'rm', id } : null;
  }
  if (rest.length > 0) return null;
  if (second === undefined) return isSection(first) ? { screen: first } : null;
  if (first === 'settings') {
    return isSettingsSection(second) ? { screen: first, section: second } : null;
  }
  if (first !== 'customers') return null;
  const id = decode(second);
  return id ? { screen: 'customer', id } : null;
}

export function routeToHash(route: Route): string {
  if (route.screen === 'customer') return `#/customers/${encodeURIComponent(route.id)}`;
  if (route.screen === 'rm') return `#/team/rm/${encodeURIComponent(route.id)}`;
  if (route.screen === 'settings' && route.section) return `#/settings/${route.section}`;
  return `#/${route.screen}`;
}

/** The sidebar item a route belongs to. */
export function sectionOf(route: Route): Section {
  if (route.screen === 'customer') return 'customers';
  return route.screen === 'rm' ? 'team' : route.screen;
}

/**
 * The route as the data has it: the page of an RM gone (deleted, made another role, data
 * reloaded) or never there is Team & nhân sự, as an unknown hash is corrected to a screen.
 */
export function resolveRoute(route: Route, people: readonly Person[]): Route {
  if (route.screen !== 'rm') return route;
  const rm = people.find((person) => person.id === route.id);
  return rm && isRm(rm) ? route : { screen: 'team' };
}

/** The name of a screen, on the toolbar and the window: the page of an RM bears the RM's. */
export function screenTitle(route: Route, people: readonly Person[]): string {
  if (route.screen !== 'rm') return t(`screen.${route.screen}`);
  return people.find((person) => person.id === route.id)?.name ?? t('screen.team');
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
