/**
 * A KYC profile for the tests of the input and the orchestration: six hạng mục "đã có" with
 * GOALS and EXISTING_PROTECTION, so `PAIN_POINT_ANALYSIS`; a superseded fact; a conflict on a
 * trường that is not cốt lõi (a warning only). Notes and the extra fields hold what must never
 * reach the model. Also the invisible texts and NUL the tests of V1 and V3–V6 share, and how the
 * tests of the Mock ask it.
 */
import { calendarDate, type KycFact, type KycField, type KycValue } from '@p2c/domain';
import { KYC_FIELDS } from '@p2c/domain';
import { assert } from 'vitest';
import type { AiCompleteRequest } from './adapter';
import { extractJson } from './extract-json';
import { createMockAdapter } from './mock-adapter';
import type { AnalysisFact } from './schema';

/** U+200B: dropped wherever it stands (K20, G5 §7 item 0). */
export const ZWSP = String.fromCodePoint(0x200b);

/**
 * NUL: K20 keeps it for the store to refuse; V3–V6 drop it, and so does a pasted line as it is
 * compared (G5 §6a, §7 item 0, §14.2, DR6-142).
 */
export const NUL = String.fromCodePoint(0);

/** `text` written NFD with a ZWSP before each combining mark (DR6-17). */
export const nfdZw = (text: string) =>
  text.normalize('NFD').replace(/\p{M}/gu, (mark) => ZWSP + mark);

/** 150 letters, `count` U+200B, 150 letters: around the 1 000 cap of a written text (C71, C72). */
export const lettersAround = (count: number) =>
  `${'a'.repeat(150)}${ZWSP.repeat(count)}${'a'.repeat(150)}`;

export const TODAY = calendarDate(2026, 10, 7);

/** A request to the Mock, `input` as the JSON of its first `user` message (prompts §1.1, §4.1). */
export const mockRequest = (input: unknown): AiCompleteRequest => ({
  sessionId: 'session-1',
  model: 'deepseek-v4.1-flash',
  reasoning: null,
  maxTokens: 8000,
  messages: [
    { role: 'system', content: 'Prompt F99 không phải dữ kiện.' },
    { role: 'user', content: JSON.stringify(input) },
  ],
});

/** What the Mock answers `input`, and the JSON value of that answer. */
export async function completeMock(input: unknown) {
  const completion = await createMockAdapter().complete(mockRequest(input));
  const json = extractJson(completion.content);
  assert(json.found, 'Mock answered without JSON');
  return { completion, value: json.value };
}

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
