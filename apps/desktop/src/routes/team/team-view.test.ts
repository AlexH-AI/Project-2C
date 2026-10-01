import type { Person, Team } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { groupByTeam, personUsage, staffMetrics } from './team-view';

const SAO_MAI: Team = { id: 't1', name: 'Sao Mai' };
const BINH_MINH: Team = { id: 't2', name: 'Bình Minh' };

const person = (id: string, role: Person['role'], teamId: string | null): Person => ({
  id,
  name: id,
  role,
  teamId,
});

describe('groupByTeam', () => {
  it('puts each person under their team and the ones without a team under shared support', () => {
    const people = [
      person('re1', 'RE', 't1'),
      person('is', 'IS', null),
      person('tl1', 'TL', 't1'),
      person('re2', 'RE', 't1'),
      person('bd', 'BD', 't2'),
    ];

    const view = groupByTeam([SAO_MAI, BINH_MINH], people);

    expect(view.teams.map((entry) => [entry.team.name, entry.reps.map((p) => p.id)])).toEqual([
      ['Sao Mai', ['re1', 're2']],
      ['Bình Minh', []],
    ]);
    expect(view.teams[0]).toMatchObject({ tl: 1, re: 2 });
    expect(view.teams[1]).toMatchObject({ tl: 0, re: 0 });
    expect(view.shared.map((p) => p.id)).toEqual(['is']);
  });

  it('gives the TL of each team: the one, none, or the first by name of several', () => {
    const view = groupByTeam(
      [SAO_MAI, BINH_MINH, { id: 't3', name: 'Hừng Đông' }],
      [
        person('tl1', 'TL', 't1'),
        person('re1', 'RE', 't1'),
        person('re2', 'RE', 't2'),
        person('tlA', 'TL', 't3'),
        person('tlB', 'TL', 't3'),
      ],
    );

    expect(view.teams.map((entry) => entry.lead?.id)).toEqual(['tl1', undefined, 'tlA']);
    expect(view.teams[2]).toMatchObject({ tl: 2, reps: [] });
  });

  it('keeps an empty team', () => {
    const view = groupByTeam([SAO_MAI], []);

    expect(view.teams).toEqual([{ team: SAO_MAI, lead: undefined, reps: [], tl: 0, re: 0 }]);
    expect(view.shared).toEqual([]);
  });
});

const TODAY = { year: 2026, month: 9, day: 28 };
const day = (month: number, date: number, year = 2026) => ({ year, month, day: date });

const records = {
  customers: [
    { id: 'c1', reId: 're1', stage: 'N4' as const },
    { id: 'c2', reId: 're1', stage: 'N1' as const },
    { id: 'c3', reId: 're1', stage: 'LOST' as const },
    { id: 'c4', reId: 're2', stage: 'ON_HOLD' as const },
  ],
  appointments: [
    // 30 days back from 28/09 start on 30/08; later dates are still to come.
    { reId: 're1', coordinatorIds: ['tl1'], date: day(8, 30) },
    { reId: 're1', coordinatorIds: [], date: day(9, 28) },
    { reId: 're1', coordinatorIds: ['tl1', 'is'], date: day(8, 29) },
    { reId: 're1', coordinatorIds: [], date: day(9, 29) },
    { reId: 're2', coordinatorIds: ['re1'], date: day(9, 1) },
  ],
  policies: [
    { reId: 're1', issuedDate: day(1, 1) },
    { reId: 're1', issuedDate: day(12, 31, 2025) },
    { reId: 're1', issuedDate: null },
    { reId: 're2', issuedDate: day(6, 15) },
  ],
};

describe('staffMetrics', () => {
  it('counts open customers, appointments of the last 30 days and policies issued this year', () => {
    const people = [
      person('re1', 'RE', 't1'),
      person('re2', 'RE', 't1'),
      person('tl1', 'TL', 't1'),
    ];

    const metrics = staffMetrics(people, records, TODAY);

    expect(metrics.get('re1')).toEqual({ openCustomers: 2, appointments30: 3, issuedThisYear: 1 });
    expect(metrics.get('re2')).toEqual({ openCustomers: 0, appointments30: 1, issuedThisYear: 1 });
  });

  it('gives other roles only the appointments they coordinate', () => {
    const people = [person('tl1', 'TL', 't1'), person('is', 'IS', null)];

    const metrics = staffMetrics(people, records, TODAY);

    expect(metrics.get('tl1')).toEqual({
      openCustomers: null,
      appointments30: 1,
      issuedThisYear: null,
    });
    expect(metrics.get('is')).toEqual({
      openCustomers: null,
      appointments30: 0,
      issuedThisYear: null,
    });
  });
});

describe('personUsage', () => {
  it('counts the records still written for the person, as RE and as coordinator', () => {
    expect(personUsage('re1', records)).toEqual({
      customers: 3,
      appointments: 4,
      policies: 3,
      coordinating: 1,
    });
    expect(personUsage('tl1', records)).toEqual({
      customers: 0,
      appointments: 0,
      policies: 0,
      coordinating: 2,
    });
    expect(personUsage('nobody', records)).toEqual({
      customers: 0,
      appointments: 0,
      policies: 0,
      coordinating: 0,
    });
  });
});
