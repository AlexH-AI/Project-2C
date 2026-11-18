import { describe, expect, it } from 'vitest';
import {
  createCustomer,
  createPerson,
  createTeam,
  listTrash,
  restorePerson,
  scheduleAppointment,
  softDeleteAppointment,
  softDeleteCustomer,
  softDeletePerson,
  softDeletePolicy,
  softDeleteTeam,
  submitPolicy,
  type TrashRow,
} from '@p2c/db';
import { calendarDate } from '@p2c/domain';
import { openAppData } from '../data/app-data';
import type { ToastSpec } from './toast-queue';
import { deletedToast } from './trash-undo';

const TODAY = calendarDate(2026, 10, 11);
type Kind = TrashRow['kind'];

/**
 * Sao Mai with the RM Đỗ Khánh Linh, and one deleted record of each kind, none blocked: the team
 * Bình Minh, the RM Lê Thu Hà, the customer Phạm Gia Bảo, an appointment and a policy of Trịnh Minh
 * Anh. With `orphan`, Lê Thu Hà is of Bình Minh, deleted after her.
 */
async function deleted(orphan = false) {
  const ids = {} as Record<Kind, string>;
  const app = await openAppData({
    today: () => TODAY,
    seed: (db) => {
      const teamId = createTeam(db, { name: 'Sao Mai' }).id;
      const rmId = createPerson(db, { name: 'Đỗ Khánh Linh', role: 'RM', teamId }).id;
      ids.team = createTeam(db, { name: 'Bình Minh' }).id;
      const ha = { name: 'Lê Thu Hà', role: 'RM', teamId: orphan ? ids.team : teamId } as const;
      softDeletePerson(db, (ids.person = createPerson(db, ha).id));
      softDeleteTeam(db, ids.team);
      const customer = (name: string) =>
        createCustomer(db, { name, rmId, stage: 'N3', date: TODAY }).id;
      softDeleteCustomer(db, (ids.customer = customer('Phạm Gia Bảo')));
      const customerId = customer('Trịnh Minh Anh');
      const meeting = { customerId, rmId, date: TODAY, time: '09:30' } as const;
      const booked = scheduleAppointment(db, { ...meeting, triggerType: 'REFERRAL' });
      softDeleteAppointment(db, (ids.appointment = booked.id));
      const policy = { customerId, rmId, submittedDate: TODAY, submittedFyp: 24_000_000 };
      softDeletePolicy(db, (ids.policy = submitPolicy(db, policy).id));
    },
  });
  /** "Hoàn tác" of the toast of the deleted record of `kind`; returns what it showed. */
  const undo = (kind: Kind) => {
    const shown: ToastSpec[] = [];
    deletedToast(app, { show: (toast) => void shown.push(toast) }, kind, ids[kind]).action!.run();
    return shown;
  };
  const inTrash = () => listTrash(app.db()).map((row) => row.kind);
  return { app, ids, undo, inTrash };
}

describe('deletedToast', () => {
  it.each([
    ['appointment', 'Đã chuyển lịch hẹn vào Thùng rác', 'Đã khôi phục lịch hẹn 11/10/2026 09:30'],
    ['customer', 'Đã chuyển KH vào Thùng rác', 'Đã khôi phục KH Phạm Gia Bảo'],
    ['policy', 'Đã chuyển HĐ vào Thùng rác', 'Đã khôi phục HĐ nộp 11/10/2026'],
    ['team', 'Đã chuyển team vào Thùng rác', 'Đã khôi phục team Bình Minh'],
    ['person', 'Đã chuyển nhân sự vào Thùng rác', 'Đã khôi phục nhân sự Lê Thu Hà'],
  ] as const)(
    'says a deleted %s went to the trash; "Hoàn tác" restores it alone, at once, and says so',
    async (kind, moved, restored) => {
      const { app, ids, undo, inTrash } = await deleted();
      const toast = deletedToast(app, { show: () => {} }, kind, ids[kind]);
      expect(toast).toMatchObject({ text: moved, action: { label: 'Hoàn tác' } });
      expect(toast.tone).toBeUndefined();

      expect(undo(kind)).toEqual([{ text: restored }]);
      expect(inTrash()).toHaveLength(4);
      expect(inTrash()).not.toContain(kind);
    },
  );

  it('a restore the command refuses is told in red, the record left in the trash', async () => {
    // The data changed between the deletion and "Hoàn tác": her team went to the trash too.
    const { undo, inTrash } = await deleted(true);
    expect(undo('person')).toEqual([{ text: 'Khôi phục team Bình Minh trước.', tone: 'error' }]);
    expect(inTrash()).toHaveLength(5);
  });

  it('a record no longer in the trash is told in red, nothing changed', async () => {
    const { app, ids, undo } = await deleted();
    // Restored from Thùng rác meanwhile.
    app.run((db) => restorePerson(db, ids.person));
    const revision = app.revision();
    expect(undo('person')).toEqual([
      { text: 'Bản ghi không còn ở Thùng rác nên không hoàn tác được.', tone: 'error' },
    ]);
    expect(app.revision()).toBe(revision);
  });
});
