import { describe, expect, it } from 'vitest';
import { DEFAULT_ROUTE, parseHash, routeToHash, sectionOf } from './routes';

describe('parseHash', () => {
  it('reads each sidebar screen', () => {
    expect(parseHash('#/overview')).toEqual({ screen: 'overview' });
    expect(parseHash('#/appointments')).toEqual({ screen: 'appointments' });
    expect(parseHash('#/customers')).toEqual({ screen: 'customers' });
    expect(parseHash('#/reports')).toEqual({ screen: 'reports' });
    expect(parseHash('#/team')).toEqual({ screen: 'team' });
    expect(parseHash('#/settings')).toEqual({ screen: 'settings' });
  });

  it('reads a customer profile with its id', () => {
    expect(parseHash('#/customers/kh-42')).toEqual({ screen: 'customer', id: 'kh-42' });
    expect(parseHash('#/customers/Nguy%E1%BB%85n')).toEqual({ screen: 'customer', id: 'Nguyễn' });
  });

  it('ignores a trailing slash', () => {
    expect(parseHash('#/customers/')).toEqual({ screen: 'customers' });
  });

  it('returns null for an empty or unknown hash', () => {
    expect(parseHash('')).toBeNull();
    expect(parseHash('#')).toBeNull();
    expect(parseHash('#/')).toBeNull();
    expect(parseHash('#/nope')).toBeNull();
    expect(parseHash('#/overview/extra')).toBeNull();
    expect(parseHash('#/customers/a/b')).toBeNull();
    expect(parseHash('#/customers/%E0%A4%A')).toBeNull();
  });
});

describe('routeToHash', () => {
  it('round-trips through parseHash', () => {
    for (const route of [DEFAULT_ROUTE, { screen: 'customer', id: 'Nguyễn 1' }] as const) {
      expect(parseHash(routeToHash(route))).toEqual(route);
    }
  });
});

describe('sectionOf', () => {
  it('keeps Customers selected on a customer profile', () => {
    expect(sectionOf({ screen: 'customer', id: 'x' })).toBe('customers');
    expect(sectionOf({ screen: 'team' })).toBe('team');
  });
});
