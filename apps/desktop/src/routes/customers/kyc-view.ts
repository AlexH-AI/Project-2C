/**
 * KYC in the customer profile (mockup customer.html): the hạng mục with their facts and the gate,
 * and the timeline of KYC and stage changes. Pure, so the screen only lays them out.
 */
import type { KycNoteRecord, KycVersionRecord } from '@p2c/db';
import {
  compareDates,
  evaluateKycGate,
  KYC_CATEGORIES,
  KYC_FIELDS,
  type CalendarDate,
  type KycCategory,
  type KycFact,
  type KycGateResult,
  type KycValue,
  type StageTransition,
} from '@p2c/domain';

export interface KycCategoryRow {
  readonly category: KycCategory;
  /** "Đã có" by the gate's rule (trường chính). */
  readonly present: boolean;
  /** Facts in effect — active or in conflict — in recording order. */
  readonly facts: readonly KycFact[];
  /** `core` blocks the AI (`CONFLICT_RESOLUTION`), `minor` only warns; null without a conflict. */
  readonly conflict: 'core' | 'minor' | null;
}

export function kycOverview(facts: readonly KycFact[]): {
  readonly gate: KycGateResult;
  readonly rows: readonly KycCategoryRow[];
} {
  const gate = evaluateKycGate(facts);
  const rows = KYC_CATEGORIES.map((category): KycCategoryRow => {
    const current = facts.filter((f) => f.category === category && f.status !== 'superseded');
    const conflicts = current.filter((f) => f.status === 'conflict');
    return {
      category,
      present: gate.presentCategories.includes(category),
      facts: current,
      conflict:
        conflicts.length === 0
          ? null
          : conflicts.some((f) => KYC_FIELDS[f.field].core)
            ? 'core'
            : 'minor',
    };
  });
  return { gate, rows };
}

/** A fact's value as shown; yes/no answers are stored as booleans. */
export function factText(value: KycValue, words: { yes: string; no: string }): string {
  if (typeof value === 'boolean') return value ? words.yes : words.no;
  return String(value);
}

export type TimelineEvent = { readonly id: string; readonly date: CalendarDate } & (
  | { readonly kind: 'stage'; readonly transition: StageTransition }
  | { readonly kind: 'note'; readonly note: KycNoteRecord }
  | { readonly kind: 'version'; readonly version: KycVersionRecord; readonly number: number }
);

/**
 * Records carry a day, not a time: on one day a version comes after the note it was saved with,
 * and a stage change is taken as earlier than both (a new customer's SYSTEM note follows it).
 */
const RANK = { stage: 0, note: 1, version: 2 } as const;

/** Newest first. Each list is in recording order, which breaks ties within its kind. */
export function kycTimeline(
  transitions: readonly StageTransition[],
  notes: readonly KycNoteRecord[],
  versions: readonly KycVersionRecord[],
): TimelineEvent[] {
  const events: TimelineEvent[] = [
    ...transitions.map((transition) => ({
      kind: 'stage' as const,
      id: transition.id,
      date: transition.date,
      transition,
    })),
    ...notes.map((note) => ({ kind: 'note' as const, id: note.id, date: note.createdDate, note })),
    ...versions.map((version, index) => ({
      kind: 'version' as const,
      id: version.id,
      date: version.date,
      version,
      number: index + 1,
    })),
  ];
  // Reversed, the stable sort keeps the later record first among equal keys.
  return events
    .reverse()
    .sort((a, b) => compareDates(b.date, a.date) || RANK[b.kind] - RANK[a.kind]);
}
