/**
 * KYC profile (ADR-0008 1–3): raw notes that are only ever appended, structured facts confirmed by
 * the RE with their source note and history, and versions with an order-independent hash. Every
 * operation returns a new profile; nothing is mutated.
 */
import { KYC_FIELDS } from './kyc-catalog';
import type { KycField } from './kyc-catalog';
import type { KycFact, KycValue } from './kyc-fact';
import { formatDate } from './period';
import type { CalendarDate } from './period';

/** Raw KYC note, as the RE wrote it. Immutable: there is no edit or delete. */
export interface KycNote {
  readonly id: string;
  readonly text: string;
  readonly createdDate: CalendarDate;
}

export interface KycProfile {
  readonly notes: readonly KycNote[];
  readonly facts: readonly KycFact[];
}

/** A fact as the RE confirms it; its hạng mục comes from the catalog. */
export interface KycFactInput {
  readonly id: string;
  readonly field: KycField;
  readonly value: KycValue;
  readonly noteId: string;
  readonly confirmedDate: CalendarDate;
}

export interface KycVersion {
  /** Hash of the active facts; equal hashes mean the facts did not change. */
  readonly hash: string;
  /** `Cập nhật KYC dd/mm/yyyy`. */
  readonly summary: string;
  readonly date: CalendarDate;
  /** Whether the change matters for the analysis, as flagged when recording it. */
  readonly material: boolean;
}

export const EMPTY_KYC_PROFILE: KycProfile = { notes: [], facts: [] };

export function addNote(profile: KycProfile, note: KycNote): KycProfile {
  if (profile.notes.some((existing) => existing.id === note.id)) {
    throw new Error(`KYC note ${note.id} already exists`);
  }
  return { ...profile, notes: [...profile.notes, note] };
}

function toFact(profile: KycProfile, input: KycFactInput, status: KycFact['status']): KycFact {
  if (!profile.notes.some((note) => note.id === input.noteId)) {
    throw new Error(`KYC fact ${input.id} points to missing note ${input.noteId}`);
  }
  if (profile.facts.some((fact) => fact.id === input.id)) {
    throw new Error(`KYC fact ${input.id} already exists`);
  }
  return { ...input, category: KYC_FIELDS[input.field].category, status };
}

/** Facts on the trường that are not superseded: one active fact, or several in conflict. */
const currentOn = (profile: KycProfile, field: KycField) =>
  profile.facts.filter((fact) => fact.field === field && fact.status !== 'superseded');

/**
 * Confirms a fact as the latest value of its trường. Whatever was current on that trường — an
 * active fact or facts in conflict — becomes superseded.
 */
export function confirmFact(profile: KycProfile, input: KycFactInput): KycProfile {
  const fact = toFact(profile, input, 'active');
  const facts = profile.facts.map((existing) =>
    existing.field === input.field && existing.status !== 'superseded'
      ? { ...existing, status: 'superseded' as const }
      : existing,
  );
  return { ...profile, facts: [...facts, fact] };
}

/**
 * Records a confirmed fact that disagrees with the current value of its trường: all of them stay in
 * `conflict` until `resolveConflict` (or a new `confirmFact`) settles it (G2 6).
 */
export function markConflict(profile: KycProfile, input: KycFactInput): KycProfile {
  const current = currentOn(profile, input.field);
  if (current.length === 0 || current.some((fact) => fact.value === input.value)) {
    throw new Error(`KYC fact ${input.id} does not disagree with the current ${input.field}`);
  }
  const fact = toFact(profile, input, 'conflict');
  const facts = profile.facts.map((existing) =>
    current.includes(existing) ? { ...existing, status: 'conflict' as const } : existing,
  );
  return { ...profile, facts: [...facts, fact] };
}

/** Keeps the chosen fact of a conflict as active; the other facts in the conflict are superseded. */
export function resolveConflict(profile: KycProfile, factId: string): KycProfile {
  const chosen = profile.facts.find((fact) => fact.id === factId);
  if (chosen?.status !== 'conflict') throw new Error(`KYC fact ${factId} is not in conflict`);
  const facts = profile.facts.map((fact): KycFact => {
    if (fact === chosen) return { ...fact, status: 'active' };
    if (fact.field === chosen.field && fact.status === 'conflict') {
      return { ...fact, status: 'superseded' };
    }
    return fact;
  });
  return { ...profile, facts };
}

/** cyrb53: a small, stable 53-bit string hash; not cryptographic, only for change detection. */
function cyrb53(text: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ code, 2654435761);
    h2 = Math.imul(h2 ^ code, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(14, '0');
}

/** Hash of the active facts' trường and values, independent of their order. */
export function kycHash(profile: KycProfile): string {
  const entries = profile.facts
    .filter((fact) => fact.status === 'active')
    .map((fact) => JSON.stringify([fact.field, fact.value]))
    .sort();
  return cyrb53(entries.join('\n'));
}

/** The version to record after a change, or null when the active facts are the same as before. */
export function nextKycVersion(
  previous: KycVersion | null,
  profile: KycProfile,
  date: CalendarDate,
  material: boolean,
): KycVersion | null {
  const hash = kycHash(profile);
  if (previous?.hash === hash) return null;
  return { hash, summary: `Cập nhật KYC ${formatDate(date)}`, date, material };
}
