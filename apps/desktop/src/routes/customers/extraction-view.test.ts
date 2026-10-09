import type { ExtractedFact } from '@p2c/ai';
import type { KycNoteRecord } from '@p2c/db';
import { calendarDate, type KycFact } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { extractionButton, extractionView } from './extraction-view';

const note = (text: string, source: KycNoteRecord['source'] = 'RE'): KycNoteRecord => ({
  id: 'n1',
  text,
  createdDate: calendarDate(2026, 9, 14),
  source,
});

const fact = (
  field: KycFact['field'],
  value: KycFact['value'],
  status: KycFact['status'] = 'active',
): KycFact => ({
  id: `f-${field}-${String(value)}`,
  field,
  category: field === 'riskProfile' ? 'RISK_APPETITE' : 'FAMILY',
  value,
  noteId: 'n0',
  confirmedDate: calendarDate(2026, 9, 1),
  status,
});

const RISK: ExtractedFact = {
  field: 'riskProfile',
  value: 'Không muốn đầu tư chứng khoán',
  quote: 'Không muốn đầu tư chứng khoán',
};
const MARRIED: ExtractedFact = { field: 'maritalStatus', value: 'Đã kết hôn', quote: 'kết hôn' };
const KIDS: ExtractedFact = { field: 'childrenCount', value: 2, quote: '2 con' };
const NONE: ReadonlySet<number> = new Set();

describe('extractionButton (spec Phase 5 §8 item 1, mockup ai.html 3b)', () => {
  it('has no button on a SYSTEM note', () => {
    expect(extractionButton(note('Năm sinh cập nhật từ hồ sơ KH: 1984', 'SYSTEM'))).toBeNull();
  });

  it('turns it off on a note under 20 characters once trimmed', () => {
    expect(extractionButton(note('   Gọi lại sau.   '))).toEqual({ tooShort: true });
    expect(extractionButton(note(' 1234567890123456789 '))).toEqual({ tooShort: true });
  });

  it('turns it on from 20 characters, counting a letter with its marks as one', () => {
    expect(extractionButton(note('12345678901234567890'))).toEqual({ tooShort: false });
    expect(extractionButton(note('Đã kết hôn, có hai con'))).toEqual({ tooShort: false });
  });
});

describe('extractionView (spec Phase 5 §8, mockup ai.html 3c–3e)', () => {
  it('shows nothing before a run, or after Hủy', () => {
    expect(extractionView(null, NONE, [])).toEqual({ kind: 'none' });
    expect(extractionView({ kind: 'cancelled' }, NONE, [])).toEqual({ kind: 'none' });
  });

  it('lists the proposals in the order the AI gave them', () => {
    expect(extractionView({ kind: 'facts', facts: [RISK, KIDS] }, NONE, [])).toEqual({
      kind: 'proposals',
      items: [
        { index: 0, fact: RISK },
        { index: 1, fact: KIDS },
      ],
      hidden: 0,
    });
  });

  it('hides a proposal a fact in effect of its trường already holds, and counts it (§8 item 4)', () => {
    const facts = [
      fact('maritalStatus', 'đã  kết hôn'),
      fact('childrenCount', 2, 'conflict'),
      fact('riskProfile', 'Không muốn đầu tư chứng khoán', 'superseded'),
    ];

    expect(extractionView({ kind: 'facts', facts: [RISK, MARRIED, KIDS] }, NONE, facts)).toEqual({
      kind: 'proposals',
      items: [{ index: 0, fact: RISK }],
      hidden: 2,
    });
  });

  it('keeps a proposal whose value differs from the one in effect', () => {
    const view = extractionView({ kind: 'facts', facts: [KIDS] }, NONE, [fact('childrenCount', 3)]);
    expect(view).toMatchObject({ kind: 'proposals', hidden: 0 });
  });

  it('drops the proposals the RE confirmed or dropped, and shows nothing once all are', () => {
    const outcome = { kind: 'facts', facts: [RISK, KIDS] } as const;

    expect(extractionView(outcome, new Set([0]), [])).toEqual({
      kind: 'proposals',
      items: [{ index: 1, fact: KIDS }],
      hidden: 0,
    });
    expect(extractionView(outcome, new Set([0, 1]), [])).toEqual({ kind: 'none' });
  });

  it('says it found nothing new when the AI proposed nothing, or only what is held (§8 item 6)', () => {
    expect(extractionView({ kind: 'facts', facts: [] }, NONE, [])).toEqual({ kind: 'empty' });
    expect(
      extractionView({ kind: 'facts', facts: [KIDS] }, NONE, [fact('childrenCount', 2)]),
    ).toEqual({ kind: 'empty' });
  });

  it('gives the message of a failed run (§8 item 5, §5.3)', () => {
    expect(extractionView({ kind: 'invalid' }, NONE, [])).toEqual({
      kind: 'error',
      error: 'INVALID',
    });
    expect(extractionView({ kind: 'error', code: 'AI_NETWORK' }, NONE, [])).toEqual({
      kind: 'error',
      error: 'AI_NETWORK',
    });
    expect(extractionView({ kind: 'error', code: 'AI_BAD_REQUEST' }, NONE, [])).toEqual({
      kind: 'error',
      error: 'GENERAL',
    });
    expect(extractionView({ kind: 'failed' }, NONE, [])).toEqual({
      kind: 'error',
      error: 'GENERAL',
    });
  });
});
