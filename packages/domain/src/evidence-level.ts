/**
 * Mức bằng chứng of one AI output element (spec Phase 5 §6.3, Owner G2 07/10/2026): worked out
 * from the facts the element cites, never written by the AI. No percentage, no "độ tin cậy".
 */
import { compareDates, type CalendarDate } from './period';

export const EVIDENCE_LEVELS = ['LOW', 'MEDIUM', 'HIGH'] as const;

export type EvidenceLevel = (typeof EVIDENCE_LEVELS)[number];

/** A cited fact: its code in the AI input (`F{seq}`) and the day the RE confirmed it. */
export interface EvidenceFact {
  readonly code: string;
  readonly confirmedDate: CalendarDate;
}

export interface Evidence {
  readonly level: EvidenceLevel;
  /** Distinct facts cited: the same code twice counts once. */
  readonly factCount: number;
  readonly latestConfirmedDate: CalendarDate;
}

/**
 * 1 fact is low, 2 medium, 3 or more high; one level lower (low stays low) when no fact is recent,
 * i.e. confirmed on or after the same day a year before `analysisDate` (29/02 → 28/02).
 * An element with only a missing hạng mục has no level, so `facts` may not be empty: the type says
 * so and an empty list throws a RangeError.
 */
export function evidenceLevel(input: {
  readonly analysisDate: CalendarDate;
  readonly facts: readonly [EvidenceFact, ...EvidenceFact[]];
}): Evidence {
  const { analysisDate, facts } = input;
  if (facts.length === 0) throw new RangeError('Evidence needs at least one fact');
  const latest = facts
    .map((fact) => fact.confirmedDate)
    .reduce((a, b) => (compareDates(b, a) > 0 ? b : a));
  const factCount = new Set(facts.map((fact) => fact.code)).size;
  const rank = Math.min(factCount, EVIDENCE_LEVELS.length) - 1;
  const recent = compareDates(latest, yearBefore(analysisDate)) >= 0;
  return {
    level: EVIDENCE_LEVELS[recent ? rank : Math.max(rank - 1, 0)]!,
    factCount,
    latestConfirmedDate: latest,
  };
}

/** The same day a year before; 29/02 has none, so 28/02. */
function yearBefore({ year, month, day }: CalendarDate): CalendarDate {
  return { year: year - 1, month, day: month === 2 && day === 29 ? 28 : day };
}
