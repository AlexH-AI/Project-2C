import type { Person } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_ROUTE,
  SECTIONS,
  parseHash,
  resolveRoute,
  routeToHash,
  screenTitle,
  sectionOf,
  teamPickerShown,
  usesScope,
} from './routes';

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

  it('reads the AI section of Cài đặt, which a link opens at once (mockup ai.html 2f)', () => {
    expect(parseHash('#/settings/ai')).toEqual({ screen: 'settings', section: 'ai' });
    expect(parseHash('#/settings/nope')).toBeNull();
    expect(parseHash('#/settings/data')).toBeNull();
    expect(parseHash('#/settings/ai/x')).toBeNull();
  });

  it('reads Thùng rác of Cài đặt (spec Phase 6 §4.2)', () => {
    expect(parseHash('#/settings/trash')).toEqual({ screen: 'settings', section: 'trash' });
    expect(parseHash('#/settings/trash/x')).toBeNull();
  });

  it('reads the page of an RM, under Team & nhân sự (spec Phase 6 §5)', () => {
    expect(parseHash('#/team/rm/re-7')).toEqual({ screen: 'rm', id: 're-7' });
    expect(parseHash('#/team/rm/Nguy%E1%BB%85n')).toEqual({ screen: 'rm', id: 'Nguyễn' });
    expect(parseHash('#/team/rm')).toBeNull();
    expect(parseHash('#/team/x/re-7')).toBeNull();
    expect(parseHash('#/team/rm/re-7/x')).toBeNull();
    expect(parseHash('#/team/rm/%E0%A4%A')).toBeNull();
  });

  it('ignores a trailing slash', () => {
    expect(parseHash('#/customers/')).toEqual({ screen: 'customers' });
    expect(parseHash('#/team/rm/re-7/')).toEqual({ screen: 'rm', id: 're-7' });
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
    for (const route of [
      DEFAULT_ROUTE,
      { screen: 'customer', id: 'Nguyễn 1' },
      { screen: 'settings' },
      { screen: 'settings', section: 'ai' },
      { screen: 'settings', section: 'trash' },
      { screen: 'rm', id: 'Nguyễn 1' },
    ] as const) {
      expect(parseHash(routeToHash(route))).toEqual(route);
    }
  });
});

describe('sectionOf', () => {
  it('keeps Customers selected on a customer profile', () => {
    expect(sectionOf({ screen: 'customer', id: 'x' })).toBe('customers');
    expect(sectionOf({ screen: 'team' })).toBe('team');
    expect(sectionOf({ screen: 'settings', section: 'ai' })).toBe('settings');
  });

  it('keeps Team & nhân sự selected on the page of an RM', () => {
    expect(sectionOf({ screen: 'rm', id: 're-7' })).toBe('team');
  });
});

describe('resolveRoute', () => {
  const people: Person[] = [
    { id: 're-7', name: 'Hoàng Văn Tùng', role: 'RM', teamId: 't1' },
    { id: 'tl-1', name: 'Lý Gia Trang', role: 'TL', teamId: 't1' },
  ];

  it('keeps the page of an RM there is', () => {
    expect(resolveRoute({ screen: 'rm', id: 're-7' }, people)).toEqual({
      screen: 'rm',
      id: 're-7',
    });
  });

  it('takes the page of an RM gone, or of a person who is no RM, to Team & nhân sự', () => {
    expect(resolveRoute({ screen: 'rm', id: 'gone' }, people)).toEqual({ screen: 'team' });
    expect(resolveRoute({ screen: 'rm', id: 'tl-1' }, people)).toEqual({ screen: 'team' });
  });

  it('leaves the other screens alone', () => {
    const route = { screen: 'customer', id: 'gone' } as const;
    expect(resolveRoute(route, people)).toBe(route);
  });
});

describe('screenTitle', () => {
  const people: Person[] = [{ id: 're-7', name: 'Hoàng Văn Tùng', role: 'RM', teamId: 't1' }];

  it('names the page of an RM by the RM, the other screens by their name', () => {
    expect(screenTitle({ screen: 'rm', id: 're-7' }, people)).toBe('Hoàng Văn Tùng');
    expect(screenTitle({ screen: 'team' }, people)).toBe('Team & nhân sự');
    expect(screenTitle({ screen: 'customer', id: 'x' }, people)).toBe('Hồ sơ khách hàng');
  });
});

describe('usesScope', () => {
  it('is true only for Overview, Customers, Appointments and Reports', () => {
    const used = SECTIONS.filter((screen) => usesScope(screen));
    expect(used).toEqual(['overview', 'appointments', 'customers', 'reports']);
    expect(usesScope('customer')).toBe(false);
    // Thùng rác lists every deleted record, whatever the scope (spec Phase 6 TR-7).
    expect(usesScope('settings')).toBe(false);
  });
});

describe('teamPickerShown', () => {
  it('Overview counts every team together, so it has no team to pick (spec Phase 4 §4.3)', () => {
    expect(teamPickerShown('overview')).toBe(false);
    expect(teamPickerShown('customers')).toBe(true);
    expect(teamPickerShown('appointments')).toBe(true);
    expect(teamPickerShown('reports')).toBe(true);
  });
});
