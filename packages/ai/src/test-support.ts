/**
 * A KYC profile for the tests of the input and the orchestration: six hạng mục "đã có" with
 * GOALS and EXISTING_PROTECTION, so `PAIN_POINT_ANALYSIS`; a superseded fact; a conflict on a
 * trường that is not cốt lõi (a warning only). Notes and the extra fields hold what must never
 * reach the model.
 */
import { calendarDate, type KycFact, type KycField, type KycValue } from '@p2c/domain';
import { KYC_FIELDS } from '@p2c/domain';
import type { AnalysisFact } from './input';

export const TODAY = calendarDate(2026, 10, 7);

export function fact(
  seq: number,
  field: KycField,
  value: KycValue,
  status: KycFact['status'] = 'active',
  confirmed = calendarDate(2026, 6, 1),
): AnalysisFact {
  const category = KYC_FIELDS[field].category;
  return {
    id: `fact-${seq}`,
    seq,
    category,
    field,
    value,
    noteId: 'note-1',
    confirmedDate: confirmed,
    status,
  };
}

/** Never sent: the name, codes, the RE, the note, appointments and contracts of the KH. */
export const PRIVATE = {
  name: 'Nguyễn Thị Lan',
  code: 'KH-00042',
  re: 'Trần Minh Quân',
  note: 'Chị Lan kể chuyện riêng ở quán cà phê Hòa Bình',
  appointment: 'Hẹn 14:00 ở văn phòng Lê Lợi',
  policy: 'HĐ-778899',
  birthYear: 1984,
};

export const ANALYSIS_FACTS: readonly AnalysisFact[] = [
  fact(13, 'mainConcern', 'Lợi nhuận dài hạn', 'conflict', calendarDate(2026, 9, 14)),
  fact(3, 'birthYear', PRIVATE.birthYear),
  fact(9, 'maritalStatus', 'Đã kết hôn'),
  fact(4, 'childrenCount', 2),
  fact(5, 'occupation', 'Chủ doanh nghiệp'),
  fact(6, 'primaryGoal', 'Học phí đại học', 'superseded'),
  fact(
    12,
    'primaryGoal',
    'Chuẩn bị học phí đại học cho con lớn',
    'active',
    calendarDate(2026, 9, 14),
  ),
  fact(7, 'hasProtection', false),
  fact(10, 'mainConcern', 'Thanh khoản khi cần tiền gấp', 'conflict', calendarDate(2026, 7, 12)),
];

/** The profile as the app holds it: facts, and notes and more that the input must leave out. */
export const PROFILE = {
  facts: ANALYSIS_FACTS,
  notes: [{ id: 'note-1', text: PRIVATE.note, createdDate: calendarDate(2026, 6, 1) }],
  customer: { name: PRIVATE.name, code: PRIVATE.code, re: PRIVATE.re },
  appointments: [PRIVATE.appointment],
  policies: [PRIVATE.policy],
};
