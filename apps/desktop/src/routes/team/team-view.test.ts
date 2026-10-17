import { DbError, type PersonUsage } from '@p2c/db';
import type { Person, Team } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { groupByTeam, inUseHelp, retriesDelete, staffMetrics } from './team-view';

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
    { reId: 're1', coordinatorIds: ['tl1'], date: day(8, 30), outcomeReviewerId: null },
    { reId: 're1', coordinatorIds: [], date: day(9, 28), outcomeReviewerId: null },
    { reId: 're1', coordinatorIds: ['tl1', 'is'], date: day(8, 29), outcomeReviewerId: null },
    { reId: 're1', coordinatorIds: [], date: day(9, 29), outcomeReviewerId: null },
    { reId: 're2', coordinatorIds: ['re1'], date: day(9, 1), outcomeReviewerId: null },
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

    // re1 also coordinates an appointment of re2 in the fixture: only the ones as RE count.
    expect(metrics.get('re1')).toEqual({ openCustomers: 2, appointments30: 2, issuedThisYear: 1 });
    expect(metrics.get('re2')).toEqual({ openCustomers: 0, appointments30: 1, issuedThisYear: 1 });
  });

  it('gives no metrics to other roles, which the member table never lists', () => {
    const people = [person('tl1', 'TL', 't1'), person('is', 'IS', null)];

    expect(staffMetrics(people, records, TODAY).size).toBe(0);
  });
});

describe('inUseHelp (mockup 9b)', () => {
  const usage = (counts: Partial<PersonUsage>): PersonUsage => ({
    customers: 0,
    appointments: 0,
    policies: 0,
    coordinating: 0,
    reviewing: 0,
    inTrash: [],
    ...counts,
  });
  const RE = 'Chuyển KH sang RE khác trước (Sửa hồ sơ KH).';
  const REVIEWER = 'Bỏ nhân sự này khỏi người đánh giá kết quả của các lịch đó (ở Sửa kết quả)';
  // DR6-80, Q5 (a): a coordinator is changed in 6f only, never on a moved or planned appointment.
  const COORDINATOR = 'người phối hợp của lịch Dời lịch / Dự kiến không đổi được';

  it('gives an RE the way of the mockup only, a coordinator too (review of PR 636)', () => {
    const [help, ...more] = inUseHelp(usage({ customers: 38, appointments: 212, coordinating: 5 }));
    expect(help).toContain(RE);
    expect(more).toEqual([]);
    expect(inUseHelp(usage({ policies: 1 }))).toEqual([help]);
  });

  it('tells a reviewer to take them off in Sửa kết quả, a coordinator to keep them (DR6-80)', () => {
    const [reviewer, ...noMore] = inUseHelp(usage({ reviewing: 2 }));
    expect(reviewer).toContain(REVIEWER);
    expect(reviewer).toContain('hoặc giữ lại thay vì xóa');
    expect(reviewer).not.toMatch(/người phối hợp/i);
    expect(noMore).toEqual([]);

    expect(inUseHelp(usage({ coordinating: 7 }))).toEqual([
      'Người phối hợp của lịch Dời lịch / Dự kiến không đổi được — giữ lại thay vì xóa.',
    ]);

    const [both] = inUseHelp(usage({ coordinating: 7, reviewing: 2 }));
    expect(both).toContain(REVIEWER);
    expect(both).toContain(COORDINATOR);
    expect(both).not.toContain(RE);
  });

  it('names the customers in the trash the records belong to, and how they come back (T-250)', () => {
    expect(inUseHelp(usage({ appointments: 1, inTrash: ['Lan'] }))).toEqual([
      expect.stringContaining(RE),
      'Có cả dữ liệu của KH đã xóa: Lan. Khôi phục KH ở Cài đặt → Thùng rác rồi chuyển sang RE khác.',
    ]);
    expect(inUseHelp(usage({ reviewing: 1, inTrash: ['Lan', 'Ánh Hồng'] }))).toEqual([
      expect.stringContaining(REVIEWER),
      'Có cả lịch hẹn của KH đã xóa: Lan, Ánh Hồng. Khôi phục KH ở Cài đặt → Thùng rác thì mới sửa được các lịch đó.',
    ]);
  });

  it('names three customers of the trash, and counts the others', () => {
    const inTrash = ['An', 'Bảo', 'Cúc', 'Dung', 'Đức'];
    expect(inUseHelp(usage({ coordinating: 9, inTrash })).at(-1)).toContain(
      'KH đã xóa: An, Bảo, Cúc và 2 KH khác.',
    );
    expect(inUseHelp(usage({ coordinating: 9, inTrash: inTrash.slice(0, 3) })).at(-1)).toContain(
      'KH đã xóa: An, Bảo, Cúc.',
    );
  });

  it('says nothing for a person nothing keeps', () => {
    expect(inUseHelp(usage({}))).toEqual([]);
  });
});

describe('retriesDelete', () => {
  it('lets a delete refused while the data is replaced be tried again, and no other (DR6-33)', () => {
    expect(retriesDelete(new DbError('DATA_REPLACING'))).toBe(true);
    expect(retriesDelete(new DbError('TEAM_HAS_MEMBERS'))).toBe(false);
    expect(retriesDelete(new DbError('PERSON_IN_USE'))).toBe(false);
    expect(retriesDelete(new Error('bug'))).toBe(false);
  });
});
