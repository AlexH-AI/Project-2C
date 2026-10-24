import { describe, expect, it } from 'vitest';
import {
  changeStageManually,
  createCustomer,
  createPerson,
  createTeam,
  listCustomers,
  listTrash,
  recordMeetingOutcome,
  scheduleAppointment,
  softDeleteAppointment,
  softDeleteCustomer,
  softDeletePerson,
  softDeletePolicy,
  softDeleteTeam,
  submitPolicy,
  type KeptRecord,
  type PurgePlan,
  type TrashBlock,
  type TrashRow,
} from '@p2c/db';
import { calendarDate } from '@p2c/domain';
import {
  TRASH_MORE,
  blockedReason,
  canPurge,
  deletedAtText,
  filterTrash,
  keptReason,
  ownerParts,
  purgedNotice,
  purgeFailure,
  purgeReminder,
  purgeView,
  recordDetail,
  recordTitle,
  restoreLabel,
  restoreRow,
  restoreView,
  restoredNotice,
  trashCounts,
} from './trash-view';
import { openAppData } from '../data/app-data';
import { t } from '../i18n';

const ref = (name: string, deleted = false) => ({ id: `id-${name}`, name, deleted });

/** A local moment as `deleted_at` stores it, so the shown time is the same in any time zone. */
const at = (day: number, hour: number, minute: number) =>
  new Date(2026, 9, day, hour, minute).toISOString();

const minhAnh: TrashRow = {
  kind: 'customer',
  id: 'c1',
  deletedAt: at(10, 16, 42),
  name: 'Trịnh Minh Anh',
  stage: 'N3',
  owner: { re: ref('Đỗ Khánh Linh'), team: ref('Sao Mai') },
  effect: {
    kind: 'customer',
    appointments: 7,
    met: 3,
    rf: 1,
    policies: 0,
    kycNotes: 5,
    aiAnalyses: 2,
    appointmentsInTrash: 1,
    policiesInTrash: 0,
  },
};

const met: TrashRow = {
  kind: 'appointment',
  id: 'a1',
  deletedAt: at(9, 11, 5),
  date: calendarDate(2026, 10, 2),
  time: '09:30',
  status: 'MET',
  stageAfter: 'N2',
  owner: { customer: ref('Phạm Gia Bảo'), re: ref('Bùi Anh Tuấn') },
  effect: { kind: 'stageChange', from: 'N3', to: 'N2', date: calendarDate(2026, 10, 2), rf: true },
};

const planned: TrashRow = {
  kind: 'appointment',
  id: 'a2',
  deletedAt: at(8, 10, 12),
  date: calendarDate(2026, 10, 6),
  time: '14:00',
  status: 'SCHEDULED',
  stageAfter: null,
  owner: { customer: ref('Trịnh Minh Anh', true), re: ref('Đỗ Khánh Linh') },
  effect: { kind: 'none' },
  blocked: { code: 'CUSTOMER_NOT_FOUND', params: { name: 'Trịnh Minh Anh' } },
};

const blockedMet: TrashRow = {
  kind: 'appointment',
  id: 'a3',
  deletedAt: at(7, 9, 48),
  date: calendarDate(2026, 9, 28),
  time: '15:00',
  status: 'MET',
  stageAfter: 'N2',
  owner: { customer: ref('Lê Hoài Nam'), re: ref('Lâm Bảo Phương') },
  // Counted from the customer's stage now, which the blocked restore would not move from.
  effect: { kind: 'stageChange', from: 'N1', to: 'N2', date: calendarDate(2026, 9, 28), rf: false },
  blocked: { code: 'TRANSITION_BEFORE_LATEST', params: { date: '05/10/2026' } },
};

const policy: TrashRow = {
  kind: 'policy',
  id: 'p1',
  deletedAt: at(6, 17, 20),
  submittedDate: calendarDate(2026, 9, 15),
  submittedFyp: 24_000_000,
  issuedDate: null,
  issuedFyp: null,
  owner: { customer: ref('Hoàng Ngọc Lan'), re: ref('Hoàng Nhật Minh') },
  effect: { kind: 'none' },
};

const mai: TrashRow = {
  kind: 'person',
  id: 'r1',
  deletedAt: at(5, 8, 31),
  name: 'Vương Thị Mai',
  role: 'RE',
  owner: { team: ref('Bình Minh', true) },
  effect: { kind: 'none' },
  blocked: { code: 'TEAM_NOT_FOUND', params: { name: 'Bình Minh' } },
};

const binhMinh: TrashRow = {
  kind: 'team',
  id: 't1',
  deletedAt: at(5, 8, 33),
  name: 'Bình Minh',
  owner: {},
  effect: { kind: 'none' },
};

const bao: TrashRow = {
  kind: 'person',
  id: 'r2',
  deletedAt: at(3, 13, 2),
  name: 'Lý Quốc Bảo',
  role: 'TL',
  owner: { team: ref('Sao Mai') },
  effect: { kind: 'none' },
  blocked: { code: 'TEAM_HAS_LEAD', params: { name: 'Nguyễn Thu Hà' } },
};

const ROWS = [minhAnh, met, planned, blockedMet, policy, binhMinh, mai, bao];

describe('trashCounts', () => {
  it('counts every record, and each kind (mockup 11a)', () => {
    expect(trashCounts(ROWS)).toEqual({
      all: 8,
      customer: 1,
      appointment: 3,
      policy: 1,
      person: 2,
      team: 1,
    });
  });

  it('is all zero for an empty trash', () => {
    expect(trashCounts([])).toEqual({
      all: 0,
      customer: 0,
      appointment: 0,
      policy: 0,
      person: 0,
      team: 0,
    });
  });
});

describe('filterTrash', () => {
  it('keeps the order of the trash, newest deletion first', () => {
    expect(filterTrash(ROWS, 'all', '')).toEqual(ROWS);
  });

  it('keeps one kind', () => {
    expect(filterTrash(ROWS, 'appointment', '')).toEqual([met, planned, blockedMet]);
    expect(filterTrash(ROWS, 'person', '')).toEqual([mai, bao]);
    expect(filterTrash(ROWS, 'team', '')).toEqual([binhMinh]);
  });

  it('finds a customer, a person or a team by its name, accents and case ignored', () => {
    expect(filterTrash(ROWS, 'all', 'quoc bao')).toEqual([bao]);
    expect(filterTrash(ROWS, 'all', '  BÌNH minh ')).toEqual([binhMinh]);
    expect(filterTrash(ROWS, 'customer', 'trinh')).toEqual([minhAnh]);
  });

  it("finds an appointment or a policy by its customer's name", () => {
    expect(filterTrash(ROWS, 'all', 'Trịnh Minh Anh')).toEqual([minhAnh, planned]);
    expect(filterTrash(ROWS, 'all', 'hoang ngoc')).toEqual([policy]);
    // Not by the RE's name: the box searches customers, people and teams by their own name.
    expect(filterTrash(ROWS, 'all', 'Hoàng Nhật Minh')).toEqual([]);
  });

  it('combines the kind and the name', () => {
    expect(filterTrash(ROWS, 'appointment', 'trinh')).toEqual([planned]);
    expect(filterTrash(ROWS, 'policy', 'trinh')).toEqual([]);
  });
});

describe('recordTitle and recordDetail (spec Phase 6 §4.2 "Bản ghi")', () => {
  it('a customer: its name, and the records restored with it', () => {
    expect(recordTitle(minhAnh)).toBe('Trịnh Minh Anh');
    expect(recordDetail(minhAnh)).toBe('khôi phục kèm 7 lịch hẹn · 0 HĐ · 5 ghi chú KYC');
  });

  it('an appointment: day, time and status; a met one its stage change and RF', () => {
    expect(recordTitle(met)).toBe('02/10/2026 09:30 · Đã gặp');
    expect(recordDetail(met)).toBe('N3 → N2 · tính RF');
    expect(recordTitle(planned)).toBe('06/10/2026 14:00 · Dự kiến');
    expect(recordDetail(planned)).toBeNull();
  });

  it('a met appointment without an RF, or already in its stage after (E7)', () => {
    const date = calendarDate(2026, 10, 2);
    const noRf = {
      ...met,
      effect: { kind: 'stageChange', from: 'N2', to: 'N1', date, rf: false },
    } as TrashRow;
    expect(recordDetail(noRf)).toBe('N2 → N1');
    const kept = { ...met, effect: { kind: 'stageKept', stage: 'N2' } } as TrashRow;
    expect(recordDetail(kept)).toBe('Nhóm KH giữ N2');
  });

  it('a blocked met appointment: its stage after, not a change it cannot make', () => {
    expect(recordDetail(blockedMet)).toBe('nhóm sau N2');
  });

  it('a met appointment that kept the stage when deleted (E18, E19): its stage after, no change', () => {
    const kept = { ...met, stageAfter: 'N3', effect: { kind: 'none' } } as TrashRow;
    expect(recordDetail(kept)).toBe('nhóm sau N3 · không đổi nhóm KH');
  });

  it('an appointment without a time, or of another outcome', () => {
    const lost = { ...planned, time: null, status: 'NO_SHOW' } as TrashRow;
    expect(recordTitle(lost)).toBe('06/10/2026 · Không đến');
    expect(recordDetail(lost)).toBeNull();
  });

  it('a policy: submission day and FYP, its status shown as a badge', () => {
    expect(recordTitle(policy)).toBe('Nộp 15/09/2026 · 24.000.000 ₫');
    expect(recordDetail(policy)).toBeNull();
  });

  it('a person: name and role; a team: name, its members restored one by one', () => {
    expect(recordTitle(mai)).toBe('Vương Thị Mai');
    expect(recordDetail(mai)).toBe('RE');
    expect(recordTitle(binhMinh)).toBe('Bình Minh');
    expect(recordDetail(binhMinh)).toBe('khôi phục chưa kèm thành viên — khôi phục từng người sau');
  });
});

describe('ownerParts (spec Phase 6 §4.2 "Thuộc")', () => {
  it('a customer: its RE and team', () => {
    expect(ownerParts(minhAnh)).toEqual([
      { text: 'RE Đỗ Khánh Linh', deleted: false },
      { text: 'Sao Mai', deleted: false },
    ]);
  });

  it('an appointment or a policy: customer and RE, a deleted one marked', () => {
    expect(ownerParts(planned)).toEqual([
      { text: 'KH Trịnh Minh Anh', deleted: true },
      { text: 'RE Đỗ Khánh Linh', deleted: false },
    ]);
    expect(ownerParts(policy)).toEqual([
      { text: 'KH Hoàng Ngọc Lan', deleted: false },
      { text: 'RE Hoàng Nhật Minh', deleted: false },
    ]);
  });

  it('a person: its team; a team or a person without one: nothing', () => {
    expect(ownerParts(mai)).toEqual([{ text: 'Team Bình Minh', deleted: true }]);
    expect(ownerParts(binhMinh)).toEqual([]);
    expect(ownerParts({ ...bao, owner: {} })).toEqual([]);
  });
});

describe('restoreLabel (DR6-43)', () => {
  it('names the customer, person or team the button restores', () => {
    expect(restoreLabel(minhAnh)).toBe('Khôi phục KH Trịnh Minh Anh');
    expect(restoreLabel(mai)).toBe('Khôi phục nhân sự Vương Thị Mai');
    expect(restoreLabel(binhMinh)).toBe('Khôi phục team Bình Minh');
  });

  it('names an appointment or a policy by its day, its status and its customer', () => {
    expect(restoreLabel(met)).toBe(
      'Khôi phục lịch hẹn 02/10/2026 09:30 · Đã gặp của KH Phạm Gia Bảo',
    );
    expect(restoreLabel({ ...planned, time: null })).toBe(
      'Khôi phục lịch hẹn 06/10/2026 · Dự kiến của KH Trịnh Minh Anh',
    );
    expect(restoreLabel(policy)).toBe(
      'Khôi phục HĐ nộp 15/09/2026 · 24.000.000 ₫ · Đã nộp của KH Hoàng Ngọc Lan',
    );
  });

  it('tells apart the buttons of a whole trash', () => {
    expect(new Set(ROWS.map(restoreLabel)).size).toBe(ROWS.length);
  });

  it('tells apart two policies of a customer submitted the same day by their FYP (DR6-99)', () => {
    const other = { ...policy, id: 'p2', submittedFyp: 100_000_000 } as TrashRow;
    expect(restoreLabel(other)).toBe(
      'Khôi phục HĐ nộp 15/09/2026 · 100.000.000 ₫ · Đã nộp của KH Hoàng Ngọc Lan',
    );
    expect(restoreLabel(other)).not.toBe(restoreLabel(policy));
  });

  // DR6-119: the "Bản ghi" cell of such rows differs by the status, and so must the button's name.
  it('tells apart two appointments of a customer at the same time by their status (DR6-119)', () => {
    const noShow = { ...met, id: 'a4', status: 'NO_SHOW', stageAfter: null } as TrashRow;
    const cancelled = { ...noShow, id: 'a5', status: 'CANCELLED' } as TrashRow;
    expect(restoreLabel(noShow)).toBe(
      'Khôi phục lịch hẹn 02/10/2026 09:30 · Không đến của KH Phạm Gia Bảo',
    );
    expect(restoreLabel(cancelled)).toBe(
      'Khôi phục lịch hẹn 02/10/2026 09:30 · Hủy của KH Phạm Gia Bảo',
    );
  });

  it('tells apart a policy submitted and one issued, the same day, the same FYP (DR6-119)', () => {
    const issued = {
      ...policy,
      id: 'p3',
      issuedDate: calendarDate(2026, 9, 20),
      issuedFyp: 24_000_000,
    } as TrashRow;
    expect(restoreLabel(issued)).toBe(
      'Khôi phục HĐ nộp 15/09/2026 · 24.000.000 ₫ · Đã phát hành của KH Hoàng Ngọc Lan',
    );
    expect(restoreLabel(issued)).not.toBe(restoreLabel(policy));
  });

  it('leaves "của KH" out for a row with no customer, which the foreign key keeps from existing', () => {
    expect(restoreLabel({ ...met, owner: { re: ref('Bùi Anh Tuấn') } } as TrashRow)).toBe(
      'Khôi phục lịch hẹn 02/10/2026 09:30 · Đã gặp',
    );
    expect(restoreLabel({ ...policy, owner: {} } as TrashRow)).toBe(
      'Khôi phục HĐ nộp 15/09/2026 · 24.000.000 ₫ · Đã nộp',
    );
  });
});

describe('TRASH_MORE', () => {
  it('words the foot of a trash over a hundred records, thousands grouped (DR-03)', () => {
    expect(TRASH_MORE.shown(100, 1240)).toBe('Đang hiện 100 / 1.240 bản ghi');
    expect(TRASH_MORE.more(100)).toBe('Hiện thêm 100 bản ghi');
    expect(TRASH_MORE.all(1240)).toBe('Đã hiện hết 1.240 bản ghi');
  });
});

describe('deletedAtText', () => {
  it('shows the moment of the deletion in local time', () => {
    expect(deletedAtText(minhAnh)).toBe('10/10/2026 16:42');
  });
});

describe('blockedReason (mockup 11d)', () => {
  const reason = (row: TrashRow, blocked: TrashBlock) => blockedReason(row, blocked);

  it('E2: the RE deleted', () => {
    expect(
      reason(minhAnh, { code: 'PERSON_NOT_FOUND', params: { name: 'Đỗ Khánh Linh', as: 're' } }),
    ).toBe('RE Đỗ Khánh Linh đã xóa — khôi phục RE trước.');
  });

  it('E3: the RE now a TL', () => {
    expect(
      reason(minhAnh, { code: 'RE_REQUIRED', params: { name: 'Đỗ Khánh Linh', role: 'TL' } }),
    ).toBe('Đỗ Khánh Linh nay là TL, không phụ trách KH được — đổi lại vai trò RE trước.');
  });

  it('E4: the customer deleted', () => {
    expect(reason(planned, planned.blocked!)).toBe('Khôi phục KH Trịnh Minh Anh trước.');
  });

  it('E6, E8: the stage changed after the meeting (D10)', () => {
    expect(reason(blockedMet, blockedMet.blocked!)).toBe(
      'Nhóm KH đã đổi ngày 05/10/2026, sau ngày cuộc hẹn này — không ghi chuyển nhóm lùi ngày (D10).',
    );
  });

  it('E20: the stage changed on the day of the meeting, recorded after the deletion (DR6-94)', () => {
    const sameDay = { code: 'TRANSITION_BEFORE_LATEST', params: { date: '28/09/2026' } } as const;
    expect(reason(blockedMet, sameDay)).toBe(
      'Nhóm KH đã đổi ngày 28/09/2026, ghi sau lúc xóa cuộc hẹn này — không ghi chuyển nhóm lùi ngày (D10).',
    );
  });

  it('E20 as the trash finds it: a change by hand on the meeting day after the deletion', async () => {
    const day = calendarDate(2026, 10, 2);
    const app = await openAppData({
      today: () => calendarDate(2026, 10, 11),
      seed: (db) => {
        const team = createTeam(db, { name: 'Sao Mai' });
        const reId = createPerson(db, { name: 'Bùi Anh Tuấn', role: 'RE', teamId: team.id }).id;
        const customer = createCustomer(db, { name: 'Phạm Gia Bảo', reId, stage: 'N3', date: day });
        const meeting = scheduleAppointment(db, {
          customerId: customer.id,
          reId,
          date: day,
          triggerType: 'REFERRAL',
        });
        const met = { status: 'MET', stageAfter: 'N2', nextStep: 'Gửi minh họa' } as const;
        recordMeetingOutcome(db, meeting.id, met);
        softDeleteAppointment(db, meeting.id);
        changeStageManually(db, customer.id, { to: 'N1', date: day });
      },
    });
    const [row] = listTrash(app.db());
    expect(blockedReason(row!, row!.blocked!)).toBe(
      'Nhóm KH đã đổi ngày 02/10/2026, ghi sau lúc xóa cuộc hẹn này — không ghi chuyển nhóm lùi ngày (D10).',
    );
  });

  it('TR-3: a closed customer reopens only to N3', () => {
    expect(reason(met, { code: 'INVALID_TRANSITION', params: { from: 'LOST', to: 'N2' } })).toBe(
      'KH đang Mất cơ hội, chỉ mở lại được về N3 — không chuyển sang N2.',
    );
  });

  it('E9: a coordinator deleted; a reviewer deleted', () => {
    expect(
      reason(met, { code: 'PERSON_NOT_FOUND', params: { name: 'Phó Đức Huy', as: 'coordinator' } }),
    ).toBe('Người phối hợp Phó Đức Huy đã xóa — khôi phục trước.');
    expect(
      reason(met, { code: 'PERSON_NOT_FOUND', params: { name: 'Vũ Thanh Tâm', as: 'reviewer' } }),
    ).toBe('Người đánh giá Vũ Thanh Tâm đã xóa — khôi phục trước.');
  });

  it('E10: the reviewer now an RE; a coordinator likewise', () => {
    expect(
      reason(met, { code: 'INVALID_REVIEWER', params: { name: 'Vũ Thanh Tâm', role: 'RE' } }),
    ).toBe('Người đánh giá Vũ Thanh Tâm nay là RE.');
    expect(
      reason(met, { code: 'INVALID_COORDINATOR', params: { name: 'Phó Đức Huy', role: 'RE' } }),
    ).toBe('Người phối hợp Phó Đức Huy nay là RE.');
  });

  it('TR-5: an outcome after today', () => {
    expect(reason(met, { code: 'OUTCOME_IN_FUTURE', params: { date: '14/10/2026' } })).toBe(
      'Kết quả ngày 14/10/2026 sau hôm nay.',
    );
  });

  it('E13, TR-5: a policy submitted or issued after today', () => {
    expect(
      reason(policy, {
        code: 'DATE_IN_FUTURE',
        params: { date: '20/10/2026', field: 'submitted' },
      }),
    ).toBe('Ngày nộp 20/10/2026 sau hôm nay.');
    expect(
      reason(policy, { code: 'DATE_IN_FUTURE', params: { date: '12/10/2026', field: 'issued' } }),
    ).toBe('Ngày phát hành 12/10/2026 sau hôm nay.');
  });

  it('E14: the team deleted', () => {
    expect(reason(mai, mai.blocked!)).toBe('Khôi phục team Bình Minh trước.');
  });

  it("E15: the team has another TL, named with the person's team", () => {
    expect(reason(bao, bao.blocked!)).toBe('Sao Mai đã có TL Nguyễn Thu Hà.');
  });

  it('E16: another team took the name', () => {
    expect(reason(binhMinh, { code: 'TEAM_NAME_TAKEN', params: { name: 'Bình Minh' } })).toBe(
      'Đã có team Bình Minh — đổi tên team kia trước.',
    );
  });

  it("falls back to the command's own message for a reason without a sentence of its own", () => {
    expect(reason(mai, { code: 'TEAM_REQUIRED', params: { role: 'RE' } })).toBe(
      'RE phải thuộc một team.',
    );
    expect(reason(minhAnh, { code: 'PERSON_NOT_FOUND' })).toBe(
      'Nhân sự không còn trong dữ liệu (có thể đã bị xóa).',
    );
    expect(reason({ ...bao, owner: {} }, bao.blocked!)).toBe('Team này đã có TL: Nguyễn Thu Hà.');
  });
});

const keptMet = {
  ...met,
  id: 'a4',
  effect: { kind: 'stageKept', stage: 'N2' },
} as TrashRow;

/** E11: a planned appointment of a past day, not blocked. */
const pastPlanned = {
  ...planned,
  id: 'a5',
  date: calendarDate(2026, 9, 30),
  time: '10:00',
  owner: { customer: ref('Phạm Gia Bảo'), re: ref('Bùi Anh Tuấn') },
  blocked: undefined,
} as TrashRow;

describe('restoreView (mockup 11b, 11c; TR-8)', () => {
  it('E1: a customer, with the records that come back with it and those left in the trash', () => {
    const view = restoreView(minhAnh);
    expect(view.title).toBe('Khôi phục Trịnh Minh Anh?');
    expect(view.subtitle).toBe('KH · xóa lúc 10/10/2026 16:42');
    expect(view.facts).toEqual([
      { term: 'Nhóm', stage: 'N3' },
      { term: 'RE', text: 'Đỗ Khánh Linh · Sao Mai' },
      {
        term: 'Hiện lại cùng KH',
        text: '7 lịch hẹn (3 đã gặp · 1 lần tính RF) · 0 HĐ · 5 ghi chú KYC · 2 phân tích AI',
      },
    ]);
    expect(view.effect).toEqual({
      body: 'KH và các bản ghi trên vào lại danh sách và chỉ số theo đúng ngày của từng bản ghi. Lịch hẹn / HĐ đã xóa riêng trước đó vẫn ở Thùng rác (1 lịch hẹn), khôi phục riêng sau.',
    });
  });

  it('a customer with nothing deleted on its own, or policies only', () => {
    const body = (appointmentsInTrash: number, policiesInTrash: number) =>
      restoreView({
        ...minhAnh,
        effect: { ...minhAnh.effect, appointmentsInTrash, policiesInTrash },
      } as TrashRow).effect.body;
    expect(body(0, 0)).toBe(
      'KH và các bản ghi trên vào lại danh sách và chỉ số theo đúng ngày của từng bản ghi.',
    );
    expect(body(0, 2)).toContain('vẫn ở Thùng rác (2 HĐ), khôi phục riêng sau.');
    expect(body(1_200, 1)).toContain('vẫn ở Thùng rác (1.200 lịch hẹn · 1 HĐ)');
  });

  it('E5: a met appointment records its stage change again, with its RF', () => {
    const view = restoreView(met);
    expect(view.title).toBe('Khôi phục lịch hẹn 02/10/2026 09:30?');
    expect(view.subtitle).toBe('KH Phạm Gia Bảo · RE Bùi Anh Tuấn');
    expect(view.facts).toEqual([
      { term: 'Kết quả', text: 'Đã gặp · nhóm sau', stage: 'N2' },
      { term: 'Nhóm KH hiện tại', stage: 'N3' },
    ]);
    expect(view.effect).toEqual({
      title: 'Nhóm KH: N3 → N2 từ 02/10/2026',
      body: 'Ghi lại chuyển nhóm của cuộc gặp; tính 1 RF cho Bùi Anh Tuấn trong kỳ có ngày 02/10/2026.',
    });
  });

  it('a met appointment whose change counts no RF', () => {
    const date = calendarDate(2026, 10, 2);
    const view = restoreView({
      ...met,
      stageAfter: 'N3',
      effect: { kind: 'stageChange', from: 'N2', to: 'N3', date, rf: false },
    } as TrashRow);
    expect(view.effect).toEqual({
      title: 'Nhóm KH: N2 → N3 từ 02/10/2026',
      body: 'Ghi lại chuyển nhóm của cuộc gặp; chuyển nhóm này không tính RF.',
    });
  });

  it('E7: a met appointment whose customer is already in its stage after', () => {
    const view = restoreView(keptMet);
    expect(view.facts).toEqual([
      { term: 'Kết quả', text: 'Đã gặp · nhóm sau', stage: 'N2' },
      { term: 'Nhóm KH hiện tại', stage: 'N2' },
    ]);
    expect(view.effect).toEqual({
      title: 'Nhóm KH giữ N2',
      body: 'KH đã ở nhóm sau cuộc gặp nên không ghi thêm chuyển nhóm; cuộc hẹn này không tính RF.',
    });
  });

  it('E18: a met appointment that kept the stage when deleted leaves the stage', () => {
    const view = restoreView({ ...met, stageAfter: 'N3', effect: { kind: 'none' } } as TrashRow);
    expect(view.facts).toEqual([{ term: 'Kết quả', text: 'Đã gặp · nhóm sau', stage: 'N3' }]);
    expect(view.effect).toEqual({
      title: 'Không đổi nhóm KH',
      body: 'Lịch hẹn vào lại danh sách Lịch hẹn và hồ sơ KH theo ngày của lịch.',
    });
  });

  it('E11: another appointment leaves the stage', () => {
    const view = restoreView(pastPlanned);
    expect(view.title).toBe('Khôi phục lịch hẹn 30/09/2026 10:00?');
    expect(view.facts).toEqual([{ term: 'Trạng thái', text: 'Dự kiến' }]);
    expect(view.effect).toEqual({
      title: 'Không đổi nhóm KH',
      body: 'Lịch hẹn vào lại danh sách Lịch hẹn và hồ sơ KH theo ngày của lịch.',
    });
    const noTime = restoreView({ ...pastPlanned, time: null } as TrashRow);
    expect(noTime.title).toBe('Khôi phục lịch hẹn 30/09/2026?');
  });

  it('a policy, a person and a team', () => {
    expect(restoreView(policy)).toEqual({
      title: 'Khôi phục HĐ nộp 15/09/2026?',
      subtitle: 'KH Hoàng Ngọc Lan · RE Hoàng Nhật Minh',
      facts: [
        { term: 'FYP nộp', text: '24.000.000 ₫' },
        { term: 'Trạng thái', text: 'Đã nộp' },
      ],
      effect: { body: 'HĐ vào lại hồ sơ KH và chỉ số theo ngày nộp / phát hành.' },
    });
    const issued = {
      ...policy,
      issuedDate: calendarDate(2026, 9, 30),
      issuedFyp: 20_000_000,
    } as TrashRow;
    expect(restoreView(issued).facts).toEqual([
      { term: 'FYP nộp', text: '24.000.000 ₫' },
      { term: 'Trạng thái', text: 'Đã phát hành 30/09/2026 · 20.000.000 ₫' },
    ]);
    const lan = { ...mai, owner: { team: ref('Bình Minh') }, blocked: undefined } as TrashRow;
    expect(restoreView(lan)).toEqual({
      title: 'Khôi phục Vương Thị Mai?',
      subtitle: 'Nhân sự · xóa lúc 05/10/2026 08:31',
      facts: [
        { term: 'Vai trò', text: 'RE' },
        { term: 'Team', text: 'Bình Minh' },
      ],
      effect: { body: 'Nhân sự vào lại Team & nhân sự; dữ liệu cũ của người này giữ nguyên.' },
    });
    expect(restoreView({ ...lan, role: 'BD', owner: {} } as TrashRow).facts).toEqual([
      { term: 'Vai trò', text: 'BD' },
    ]);
    expect(restoreView(binhMinh)).toEqual({
      title: 'Khôi phục Bình Minh?',
      subtitle: 'Team · xóa lúc 05/10/2026 08:33',
      facts: [],
      effect: {
        body: 'Team vào lại Team & nhân sự. Thành viên đã xóa chưa về kèm — khôi phục từng người sau.',
      },
    });
  });
});

describe('restoredNotice (mockup 11e)', () => {
  it('a customer: what came back with it, and its profile', () => {
    expect(restoredNotice(minhAnh)).toEqual({
      title: 'Đã khôi phục KH Trịnh Minh Anh',
      detail: 'cùng 7 lịch hẹn, 5 ghi chú KYC',
      open: 'Mở hồ sơ',
      href: '#/customers/c1',
    });
    const alone = {
      ...minhAnh,
      effect: { ...minhAnh.effect, appointments: 0, kycNotes: 0, policies: 2 },
    } as TrashRow;
    expect(restoredNotice(alone).detail).toBe('cùng 2 HĐ');
    const bare = { ...alone, effect: { ...alone.effect, policies: 0 } } as TrashRow;
    expect(restoredNotice(bare).detail).toBeNull();
  });

  it('an appointment or a policy: the profile of its customer', () => {
    expect(restoredNotice(met)).toEqual({
      title: 'Đã khôi phục lịch hẹn 02/10/2026 09:30',
      detail: 'KH Phạm Gia Bảo',
      open: 'Mở hồ sơ',
      href: `#/customers/${encodeURIComponent('id-Phạm Gia Bảo')}`,
    });
    expect(restoredNotice(policy)).toMatchObject({
      title: 'Đã khôi phục HĐ nộp 15/09/2026',
      detail: 'KH Hoàng Ngọc Lan',
      href: `#/customers/${encodeURIComponent('id-Hoàng Ngọc Lan')}`,
    });
  });

  it('a person or a team: Team & nhân sự', () => {
    expect(restoredNotice(mai)).toEqual({
      title: 'Đã khôi phục nhân sự Vương Thị Mai',
      detail: null,
      open: 'Mở Team & nhân sự',
      href: '#/team',
    });
    expect(restoredNotice(binhMinh)).toMatchObject({
      title: 'Đã khôi phục team Bình Minh',
      href: '#/team',
    });
  });
});

describe('restoreRow', () => {
  const TODAY = calendarDate(2026, 10, 11);

  /** Trịnh Minh Anh deleted, her RE Đỗ Khánh Linh of Sao Mai still there. */
  async function deletedCustomer() {
    let reId = '';
    const app = await openAppData({
      today: () => TODAY,
      seed: (db) => {
        const team = createTeam(db, { name: 'Sao Mai' });
        reId = createPerson(db, { name: 'Đỗ Khánh Linh', role: 'RE', teamId: team.id }).id;
        const customer = createCustomer(db, {
          name: 'Trịnh Minh Anh',
          reId,
          stage: 'N3',
          date: TODAY,
        });
        softDeleteCustomer(db, customer.id);
      },
    });
    const [row] = listTrash(app.db());
    return { app, row: row!, reId };
  }

  it('runs the restore command of its kind: the record leaves the trash', async () => {
    const { app, row } = await deletedCustomer();
    expect(restoreRow(app, row)).toBeNull();
    expect(listTrash(app.db())).toEqual([]);
    expect(listCustomers(app.db()).map((c) => c.name)).toEqual(['Trịnh Minh Anh']);
  });

  /** One deleted record of each kind, none of them blocked. */
  async function oneOfEach() {
    const app = await openAppData({
      today: () => TODAY,
      seed: (db) => {
        const team = createTeam(db, { name: 'Sao Mai' });
        const reId = createPerson(db, { name: 'Đỗ Khánh Linh', role: 'RE', teamId: team.id }).id;
        softDeleteTeam(db, createTeam(db, { name: 'Bình Minh' }).id);
        const ha = createPerson(db, { name: 'Lê Thu Hà', role: 'RE', teamId: team.id });
        softDeletePerson(db, ha.id);
        const customer = (name: string) =>
          createCustomer(db, { name, reId, stage: 'N3', date: TODAY });
        softDeleteCustomer(db, customer('Phạm Gia Bảo').id);
        const anh = customer('Trịnh Minh Anh');
        const meeting = scheduleAppointment(db, {
          customerId: anh.id,
          reId,
          date: TODAY,
          triggerType: 'REFERRAL',
        });
        softDeleteAppointment(db, meeting.id);
        const policy = submitPolicy(db, {
          customerId: anh.id,
          reId,
          submittedDate: TODAY,
          submittedFyp: 24_000_000,
        });
        softDeletePolicy(db, policy.id);
      },
    });
    return { app, rows: listTrash(app.db()) };
  }

  // Another kind's command refuses the id, or restores another record (DR6-63).
  it.each(['team', 'person', 'customer', 'appointment', 'policy'] as const)(
    'restores a %s with the command of its kind, the other records left in the trash',
    async (kind) => {
      const { app, rows } = await oneOfEach();
      expect(rows.map((r) => r.kind).sort()).toEqual([
        'appointment',
        'customer',
        'person',
        'policy',
        'team',
      ]);
      const row = rows.find((r) => r.kind === kind)!;
      expect(row.blocked).toBeUndefined();

      expect(restoreRow(app, row)).toBeNull();
      expect(listTrash(app.db())).toEqual(rows.filter((r) => r !== row));
    },
  );

  it('refuses with the blocked reason when the data changed after the dialog opened', async () => {
    const { app, row, reId } = await deletedCustomer();
    expect(row.blocked).toBeUndefined();
    app.run((db) => softDeletePerson(db, reId));

    const failure = restoreRow(app, row);
    expect(failure).toBe('RE Đỗ Khánh Linh đã xóa — khôi phục RE trước.');
    const now = listTrash(app.db()).find((r) => r.id === row.id)!;
    expect(failure).toBe(blockedReason(now, now.blocked!));
    expect(listCustomers(app.db())).toEqual([]);
  });

  it('E17: refuses with the sentence of S2-2 while the data is replaced, changing nothing', async () => {
    const { app, row } = await deletedCustomer();
    const reloading = app.reloadDemoData();
    expect(restoreRow(app, row)).toBe(
      'Đang thay toàn bộ dữ liệu (Nạp lại / Nhập backup). Thay đổi này chưa được ghi — thử lại khi xong.',
    );
    expect(listTrash(app.db()).map((r) => r.id)).toEqual([row.id]);
    expect(listCustomers(app.db())).toEqual([]);
    await reloading;
  });

  it('a failure that is no command refusal reads as the general message', () => {
    const app = {
      run: () => {
        throw new Error('boom');
      },
    };
    expect(restoreRow(app, minhAnh)).toBe('Chưa lưu được thay đổi. Dữ liệu không bị đổi.');
  });
});

describe('Dọn sạch Thùng rác (TR-11…TR-13; mockup 11h–11j)', () => {
  /** D1: the trash of mockup 11a. */
  const D1: PurgePlan = {
    counts: {
      customers: 3,
      customerRecords: { appointments: 12, policies: 1, kycNotes: 9, aiAnalyses: 2 },
      appointments: 6,
      policies: 2,
      people: 2,
      teams: 1,
    },
    kept: [],
  };
  /** D5: the Dời lịch of 08/10, which the appointment of 15/10 was rescheduled from. */
  const moved: KeptRecord = {
    kind: 'appointment',
    id: 'a9',
    by: { kind: 'rescheduled', date: calendarDate(2026, 10, 15), time: '10:00' },
  };

  it('D12: reminds to purge from 1 000 records, not under', () => {
    expect(purgeReminder(1_000)).toBe(
      'Thùng rác có 1.000 bản ghi nên mở chậm dần. Nên dọn sạch khi không cần khôi phục các bản ghi này nữa.',
    );
    expect(purgeReminder(1_313)).toContain('Thùng rác có 1.313 bản ghi');
    expect(purgeReminder(999)).toBeNull();
    expect(purgeReminder(0)).toBeNull();
  });

  it('D5, D6: says why the purge keeps a record, as a blocked one says why it waits', () => {
    expect(keptReason(moved.by)).toBe('Giữ lại khi dọn: lịch 15/10/2026 10:00 dời từ lịch này.');
    expect(
      keptReason({ kind: 'appointment', date: calendarDate(2026, 10, 8), time: '10:00' }),
    ).toBe('Giữ lại khi dọn: lịch 08/10/2026 10:00 còn ghi người này.');
    expect(keptReason({ kind: 'appointment', date: calendarDate(2026, 10, 8), time: null })).toBe(
      'Giữ lại khi dọn: lịch 08/10/2026 còn ghi người này.',
    );
    expect(keptReason({ kind: 'member', name: 'Vương Thị Mai' })).toBe(
      'Giữ lại khi dọn: nhân sự Vương Thị Mai còn thuộc team này.',
    );
  });

  it('offers the purge while some record would go, not once every one is kept (TR-11)', () => {
    expect(canPurge([])).toBe(false);
    expect(canPurge([met, planned])).toBe(true);
    const kept = { ...planned, keptBy: moved.by } as TrashRow;
    expect(canPurge([kept])).toBe(false);
    expect(canPurge([kept, met])).toBe(true);
  });

  it('D1: the dialog counts what goes for good, kind by kind, the customers with their records', () => {
    expect(purgeView(D1)).toEqual({
      subtitle: '14 bản ghi · mọi loại, không theo bộ lọc',
      facts: [
        { term: 'KH', text: '3 — kèm 12 lịch hẹn · 1 HĐ · 9 ghi chú KYC · 2 phân tích AI' },
        { term: 'Lịch hẹn', text: '6' },
        { term: 'HĐ', text: '2' },
        { term: 'Nhân sự', text: '2' },
        { term: 'Team', text: '1' },
      ],
      kept: null,
    });
  });

  it('D5: the dialog leaves what is kept out of the counts, and says how much it keeps', () => {
    const view = purgeView({ ...D1, kept: [moved] });
    expect(view.subtitle).toBe('15 bản ghi · mọi loại, không theo bộ lọc');
    expect(view.facts[1]).toEqual({ term: 'Lịch hẹn', text: '6' });
    expect(view.kept).toBe('Giữ lại 1 bản ghi còn được dùng');
    const none = purgeView({
      counts: { ...D1.counts, customers: 0, people: 0 },
      kept: [moved],
    });
    expect(none.facts[0]).toEqual({ term: 'KH', text: '0' });
  });

  it('D2, D13: the notice says what went for good, and the backup in the exe (11j)', () => {
    expect(purgedNotice({ ...D1, backup: 'project2c-s00000013-20261011-164512.db' })).toEqual({
      title: 'Đã dọn sạch Thùng rác',
      detail:
        'Xóa hẳn 3 KH (kèm 12 lịch hẹn · 1 HĐ · 9 ghi chú KYC · 2 phân tích AI) · 6 lịch hẹn · 2 HĐ · 2 nhân sự · 1 team. Backup: Project2C-data\\backups\\project2c-s00000013-20261011-164512.db',
    });
    expect(purgedNotice({ ...D1, backup: undefined }).detail).toBe(
      'Xóa hẳn 3 KH (kèm 12 lịch hẹn · 1 HĐ · 9 ghi chú KYC · 2 phân tích AI) · 6 lịch hẹn · 2 HĐ · 2 nhân sự · 1 team.',
    );
  });

  it('D5: the notice leaves a kind with none out, and counts what it kept', () => {
    const counts = {
      ...D1.counts,
      customers: 1,
      customerRecords: { appointments: 0, policies: 0, kycNotes: 4, aiAnalyses: 0 },
      appointments: 0,
      people: 0,
    };
    expect(purgedNotice({ counts, kept: [moved], backup: undefined }).detail).toBe(
      'Xóa hẳn 1 KH (kèm 4 ghi chú KYC) · 2 HĐ · 1 team. Giữ lại 1 bản ghi còn được dùng.',
    );
    const bare = { ...counts, customerRecords: { ...counts.customerRecords, kycNotes: 0 } };
    expect(purgedNotice({ counts: bare, kept: [], backup: undefined }).detail).toBe(
      'Xóa hẳn 1 KH · 2 HĐ · 1 team.',
    );
  });

  it('D7, D8, D9: a purge refused says why, and that nothing changed', () => {
    expect(purgeFailure(new Error('RELOAD_UNSAVED_CHANGES'))).toEqual({
      title:
        'Chưa dọn: lần lưu gần nhất bị lỗi, backup sẽ thiếu các thay đổi đó. Bấm "Thử lại" ở dải cảnh báo đầu màn, lưu được rồi thì dọn lại.',
      detail: 'Dữ liệu không bị đổi.',
    });
    for (const error of [new Error('disk full'), new Error('refused')]) {
      expect(purgeFailure(error)).toEqual({
        title: 'Chưa dọn được Thùng rác.',
        detail: 'Dữ liệu không bị đổi.',
      });
    }
  });
});

describe('the delete dialogs point at Thùng rác (TR-10, mockup 11f)', () => {
  it('6g, a policy, a person and a team', () => {
    expect(t('appointmentDelete.soft')).toBe('Xóa mềm, khôi phục được ở Cài đặt → Thùng rác.');
    expect(t('policyDelete.soft')).toBe(
      'Xóa mềm: HĐ vẫn nằm trong dữ liệu (D4), khôi phục ở Cài đặt → Thùng rác.',
    );
    expect(t('person.deleteBody')).toBe(
      'Nhân sự được xóa mềm: ẩn khỏi danh sách, dữ liệu cũ vẫn giữ; khôi phục ở Cài đặt → Thùng rác.',
    );
    expect(t('team.deleteBody')).toBe(
      'Team được xóa mềm: ẩn khỏi danh sách, dữ liệu cũ vẫn giữ; khôi phục ở Cài đặt → Thùng rác.',
    );
  });
});
