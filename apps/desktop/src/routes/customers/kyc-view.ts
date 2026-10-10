/**
 * KYC in the customer profile (mockup customer.html): the hạng mục with their facts and the gate,
 * and the timeline of KYC and stage changes. Pure, so the screen only lays them out.
 */
import { factCode } from '@p2c/ai';
import {
  normalizeKycValue,
  type AppointmentRecord,
  type KycFactRecord,
  type KycNoteFact,
  type KycNoteRecord,
  type KycProfileRecord,
  type KycVersionRecord,
} from '@p2c/db';
import {
  addNote,
  compareDates,
  confirmFact,
  evaluateKycGate,
  KYC_CATEGORIES,
  KYC_FIELDS,
  markConflict,
  nextKycVersion,
  type CalendarDate,
  type KycCategory,
  type KycFact,
  type KycField,
  type KycGateResult,
  type KycProfile,
  type KycValue,
  type StageTransition,
} from '@p2c/domain';

export interface KycCategoryRow<F extends KycFact = KycFact> {
  readonly category: KycCategory;
  /** "Đã có" by the gate's rule (trường chính). */
  readonly present: boolean;
  /** Facts in effect — active or in conflict — in recording order. */
  readonly facts: readonly F[];
  /** `core` blocks the AI (`CONFLICT_RESOLUTION`), `minor` only warns; null without a conflict. */
  readonly conflict: 'core' | 'minor' | null;
}

/** Stored facts keep their `seq`, which names each one `F{seq}` on the list (spec Phase 5 §6.1). */
export function kycOverview<F extends KycFact>(
  facts: readonly F[],
): {
  readonly gate: KycGateResult;
  readonly rows: readonly KycCategoryRow<F>[];
} {
  const gate = evaluateKycGate(facts);
  const rows = KYC_CATEGORIES.map((category): KycCategoryRow<F> => {
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

/** The element of a fact on the KYC facts list, by its code (mockup ai.html 3a). */
export const factAnchor = (code: string) => `fact-${code}`;

/**
 * The fact in effect that a code cited by an analysis stands for: its own fact while in effect, else
 * the one in effect with the same trường and value. Confirming a value again (or a birth date in the
 * same year) replaces the fact without a new KYC version, so the analysis stays CURRENT while its
 * codes name replaced facts (DR5-15). `null` when the value really changed or the code is unknown.
 */
export function factInEffect(facts: readonly KycFactRecord[], code: string): KycFactRecord | null {
  const cited = facts.find((f) => factCode(f.seq) === code);
  if (!cited || cited.status !== 'superseded') return cited ?? null;
  return (
    facts.findLast(
      (f) => f.status !== 'superseded' && f.field === cited.field && f.value === cited.value,
    ) ?? null
  );
}

/**
 * Where a code cited as evidence leads (mockup ai.html 3a, G3 `ai.html#ask` 11): the fact in effect
 * it stands for, on the list (`factInEffect`). The list shows no replaced value, so a fact whose
 * value has since changed, or one no longer there, is "F5 không còn hiệu lực".
 */
export function factCodeTarget(
  facts: readonly KycFactRecord[],
  code: string,
): { readonly kind: 'shown' | 'gone'; readonly code: string } {
  const fact = factInEffect(facts, code);
  return fact ? { kind: 'shown', code: factCode(fact.seq) } : { kind: 'gone', code };
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
  /** `number`: "Lịch hẹn lần n" of a meeting held; null for any other appointment. */
  | {
      readonly kind: 'meeting';
      readonly appointment: AppointmentRecord;
      readonly number: number | null;
    }
);

/**
 * Records carry a day, not a time: on one day a version comes after the note it was saved with,
 * and a stage change is taken as earlier than both (a new customer's SYSTEM note follows it).
 * A meeting comes before the stage change it led to.
 */
const RANK = { meeting: -1, stage: 0, note: 1, version: 2 } as const;

/**
 * The appointments in date order, only the meetings held numbered (DR-67): a planned one, or one
 * past its day without an outcome, is a plain "Lịch hẹn" with its status.
 */
function meetingEvents(appointments: readonly AppointmentRecord[]): TimelineEvent[] {
  let met = 0;
  return appointments.map((appointment) => ({
    kind: 'meeting' as const,
    id: appointment.id,
    date: appointment.date,
    appointment,
    number: appointment.status === 'MET' ? ++met : null,
  }));
}

/**
 * Newest first. Each list is in recording order (appointments by date and time), which breaks
 * ties within its kind.
 */
export function kycTimeline(
  transitions: readonly StageTransition[],
  notes: readonly KycNoteRecord[],
  versions: readonly KycVersionRecord[],
  appointments: readonly AppointmentRecord[] = [],
): TimelineEvent[] {
  const events: TimelineEvent[] = [
    ...meetingEvents(appointments),
    ...transitions.map((transition) => ({
      kind: 'stage' as const,
      id: transition.id,
      date: transition.date,
      transition,
    })),
    ...notes.map((note) => ({ kind: 'note' as const, id: note.id, date: note.createdDate, note })),
    ...versions.map((version) => ({
      kind: 'version' as const,
      id: version.id,
      date: version.date,
      version,
      number: version.seq,
    })),
  ];
  // Reversed, the stable sort keeps the later record first among equal keys.
  return events
    .reverse()
    .sort((a, b) => compareDates(b.date, a.date) || RANK[b.kind] - RANK[a.kind]);
}

export type KycNotePreview =
  | { readonly kind: 'none' }
  /** `auto`: material because a cốt lõi trường changed, so the RE cannot switch it off. */
  | {
      readonly kind: 'version';
      readonly number: number;
      readonly material: boolean;
      readonly auto: boolean;
    }
  /** The trường cannot take the fact: nothing to disagree with, or a value it cannot hold. */
  | { readonly kind: 'refused'; readonly field: KycField };

/** "KYC v<n>" of the next version: one after the last stored seq, as the commands number it. */
export const nextVersionNumber = (versions: readonly Pick<KycVersionRecord, 'seq'>[]): number =>
  (versions.at(-1)?.seq ?? 0) + 1;

/**
 * Mockup 7a/7e "Sau khi lưu": the version `recordKycNote` would record for the facts of a new note,
 * worked out with the same domain rules on the profile as it stands.
 */
export function previewKycNote(
  profile: KycProfile,
  versions: readonly KycVersionRecord[],
  facts: readonly KycNoteFact[],
  date: CalendarDate,
  manualMaterial: boolean,
): KycNotePreview {
  if (facts.length === 0) return { kind: 'none' };
  const noteId = 'preview';
  let after = addNote(profile, { id: noteId, text: '', createdDate: date });
  for (const [index, fact] of facts.entries()) {
    try {
      const input = {
        id: `${noteId}-${index}`,
        field: fact.field,
        value: normalizeKycValue(fact.field, fact.value),
        noteId,
        confirmedDate: date,
      };
      after = fact.conflict ? markConflict(after, input) : confirmFact(after, input);
    } catch {
      return { kind: 'refused', field: fact.field };
    }
  }
  const previous = versions.at(-1) ?? null;
  const version = nextKycVersion(previous, previous && profile, after, date, false);
  if (!version) return { kind: 'none' };
  return {
    kind: 'version',
    number: nextVersionNumber(versions),
    material: version.material || manualMaterial,
    auto: version.material,
  };
}

export interface KycResolveOption {
  readonly factId: string;
  readonly value: KycValue;
  /** `SYSTEM`: set from the hồ sơ KH; `NOTE`: confirmed from a ghi chú KYC. */
  readonly source: 'NOTE' | 'SYSTEM';
  readonly confirmedDate: CalendarDate;
  /** A trường taken from the hồ sơ KH only keeps a value that came from it (D2). */
  readonly disabled: boolean;
}

/** Mockup 7d: the values of a trường in conflict that "Giải quyết" can keep, in recording order. */
export function resolveKycOptions(profile: KycProfileRecord, field: KycField): KycResolveOption[] {
  return profile.facts
    .filter((fact) => fact.field === field && fact.status === 'conflict')
    .map((fact) => {
      const system = profile.notes.find((note) => note.id === fact.noteId)?.source === 'SYSTEM';
      return {
        factId: fact.id,
        value: fact.value,
        source: system ? 'SYSTEM' : 'NOTE',
        confirmedDate: fact.confirmedDate,
        disabled: KYC_FIELDS[field].fromProfile && !system,
      };
    });
}
