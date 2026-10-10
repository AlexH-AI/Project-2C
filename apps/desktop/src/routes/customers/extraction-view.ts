/**
 * AI trích xuất on a KYC note of the timeline (spec Phase 5 §8, mockup ai.html 3b–3e). Pure, so the
 * note only lays it out.
 */
import type { ExtractedFact } from '@p2c/ai';
import type { KycNoteRecord } from '@p2c/db';
import type { KycFact, KycValue } from '@p2c/domain';
import type { ExtractionOutcome } from '../../data/ai-analysis';
import { aiFailure, GENERAL_FAILURE, type AiFailure } from '../ai-error-view';

/** A shorter note is "Ghi chú quá ngắn" (§8 item 1, ADR-0008). */
const MIN_NOTE_LENGTH = 20;

/** The button of a note the RE wrote; none on a `SYSTEM` note, off below 20 characters trimmed. */
export function extractionButton(note: KycNoteRecord): { readonly tooShort: boolean } | null {
  if (note.source === 'SYSTEM') return null;
  // By code point, so a letter with its marks (NFC) counts once.
  return { tooShort: Array.from(note.text.trim()).length < MIN_NOTE_LENGTH };
}

export type ExtractionView =
  | { readonly kind: 'none' }
  /** Mockup 3d; `index` is the proposal's place in the AI's answer, `hidden` those already held. */
  | {
      readonly kind: 'proposals';
      readonly items: readonly { readonly index: number; readonly fact: ExtractedFact }[];
      readonly hidden: number;
    }
  /** Mockup 3e: "AI không tìm thấy dữ kiện mới trong ghi chú này" and Đóng. */
  | { readonly kind: 'empty' }
  /** Mockup 3e: the §5.3 message (2l) and Thử lại; `INVALID` is "AI trả kết quả không đọc được". */
  | { readonly kind: 'error'; readonly error: AiFailure | 'INVALID' };

const NONE: ExtractionView = { kind: 'none' };

/**
 * What the note shows of its last run. `handled`: the proposals the RE confirmed or dropped. A
 * proposal a fact in effect of its trường already holds is hidden (§8 item 4), checked against the
 * facts as they are now, so one confirmed elsewhere meanwhile hides too.
 */
export function extractionView(
  outcome: ExtractionOutcome | null,
  handled: ReadonlySet<number>,
  facts: readonly KycFact[],
): ExtractionView {
  if (outcome === null) return NONE;
  switch (outcome.kind) {
    case 'cancelled':
      return NONE;
    case 'invalid':
      return { kind: 'error', error: 'INVALID' };
    case 'error':
      return { kind: 'error', error: aiFailure(outcome) };
    case 'failed':
      return { kind: 'error', error: GENERAL_FAILURE };
    case 'facts':
      break;
    default:
      return outcome satisfies never;
  }
  const open = outcome.facts.flatMap((fact, index) =>
    handled.has(index) ? [] : [{ index, fact }],
  );
  const items = open.filter(({ fact }) => !held(fact, facts));
  if (items.length > 0) return { kind: 'proposals', items, hidden: open.length - items.length };
  // Once the RE has dealt with every proposal, there is nothing left to say.
  return handled.size === 0 ? { kind: 'empty' } : NONE;
}

function held(proposal: ExtractedFact, facts: readonly KycFact[]): boolean {
  return facts.some(
    (fact) =>
      fact.status !== 'superseded' &&
      fact.field === proposal.field &&
      comparable(fact.value) === comparable(proposal.value),
  );
}

/** A value as the RE reads it: the same words, whatever their case or spacing. */
const comparable = (value: KycValue) =>
  typeof value === 'string'
    ? value.normalize('NFC').trim().replace(/\s+/gu, ' ').toLocaleLowerCase('vi')
    : value;
