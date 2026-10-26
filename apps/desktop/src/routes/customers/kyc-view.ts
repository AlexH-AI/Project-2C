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
  isRfTransition,
  KYC_CATEGORIES,
  KYC_FIELDS,
  markConflict,
  nextKycVersion,
  parseVnd,
  type CalendarDate,
  type KycCategory,
  type KycFact,
  type KycField,
  type KycGateResult,
  type KycProfile,
  type KycValue,
  type StageTransition,
} from '@p2c/domain';
import { errorMessage, t } from '../../i18n';
import { amountRead } from '../money-view';

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

/** The trường that hold an amount of money; their value is kept as typed, a text. */
const AMOUNT_FIELDS: ReadonlySet<KycField> = new Set([
  'annualIncome',
  'totalAssets',
  'liabilities',
]);

/**
 * Mockup 7b / 7c (NT-HS-05): what a value typed for a money trường reads as, as every money input
 * reads (`amountRead`): "6.000.000.000 ₫ (6 tỷ)". Null for another trường, or for words `parseVnd`
 * cannot read ("Khoảng 12 tỷ"), which are kept all the same.
 * Read from the text as the command stores it, `normalizeText` of `parseVnd` (K20, DR6-101).
 */
export function kycAmountRead(field: KycField, text: string): string | null {
  if (!AMOUNT_FIELDS.has(field)) return null;
  const parsed = parseVnd(text);
  return parsed.ok ? amountRead(parsed.amount) : null;
}

/** `currentFacts` of a stored profile: each keeps the seq it is coded by (mockup 7c "Đang có"). */
export const currentFactRecords = (profile: KycProfileRecord, field: KycField): KycFactRecord[] =>
  profile.facts.filter((fact) => fact.field === field && fact.status !== 'superseded');

/** A KYC version on the timeline: "+ F9, F12, F13 · kyc v3", its facts named as on the facts list. */
export interface TimelineVersion {
  readonly version: KycVersionRecord;
  /** `F{seq}` of the facts the version recorded, in recording order; none for a conflict settled. */
  readonly codes: readonly string[];
}

export type TimelineEvent = { readonly id: string; readonly date: CalendarDate } & (
  | { readonly kind: 'stage'; readonly transition: StageTransition }
  /**
   * A KYC note; with the versions its facts recorded on its own day it is a KYC update, "Cập nhật
   * KYC" (mockup customer.html), else a note alone (ai.html 3b).
   */
  | {
      readonly kind: 'note';
      readonly note: KycNoteRecord;
      readonly versions: readonly TimelineVersion[];
    }
  /** A version on no note of its day: a conflict settled, a fact of an older note confirmed later. */
  | { readonly kind: 'version'; readonly version: TimelineVersion }
  /** `number`: "Lịch hẹn lần n" of a meeting held; null for any other appointment. */
  | {
      readonly kind: 'meeting';
      readonly appointment: AppointmentRecord;
      readonly number: number | null;
    }
);

/**
 * What the timeline reads of KYC; `versionFacts` is `listKycVersionFacts` of `db`, and
 * `recordingOrder` (the ids of the notes and versions in the order they were saved)
 * `listKycRecordingOrder`.
 */
export interface TimelineKyc {
  readonly notes: readonly KycNoteRecord[];
  readonly facts: readonly KycFactRecord[];
  readonly versions: readonly KycVersionRecord[];
  readonly versionFacts: ReadonlyMap<string, readonly string[]>;
  readonly recordingOrder: readonly string[];
}

/** Mockup customer.html "Tất cả / KYC / Lịch hẹn". */
export const TIMELINE_FILTERS = ['ALL', 'KYC', 'APPOINTMENTS'] as const;
export type TimelineFilter = (typeof TIMELINE_FILTERS)[number];

/** KYC is its notes and versions, Lịch hẹn the appointments; a stage change is under Tất cả only. */
export function inTimelineFilter(event: TimelineEvent, filter: TimelineFilter): boolean {
  if (filter === 'KYC') return event.kind === 'note' || event.kind === 'version';
  if (filter === 'APPOINTMENTS') return event.kind === 'meeting';
  return true;
}

/**
 * Mockup customer.html "Dòng thời gian": how a stage change came about — the customer created, a
 * change by hand (never an RF), or a meeting's outcome, one RF when it moves N4 / N3 up to N2 / N1.
 */
export function stageCause(transition: StageTransition): 'created' | 'manual' | 'rf' | 'noRf' {
  if (transition.from === null) return 'created';
  if (transition.appointmentId === null) return 'manual';
  return isRfTransition(transition.from, transition.to) ? 'rf' : 'noRf';
}

/**
 * Records carry a day, not a time: on one day KYC comes after a stage change (a new customer's
 * SYSTEM note follows it), in the order `kycEvents` gives; a meeting comes before the stage change
 * it led to.
 */
const RANK = { meeting: -1, stage: 0, note: 1, version: 1 } as const;

/** An event with where it comes among the KYC of its day: higher is later. */
interface Ordered {
  readonly event: TimelineEvent;
  readonly order: number;
}

/**
 * Each version with the codes of the facts it recorded, on the note of those facts when that note
 * is of the version's day: saved with them, or one of its AI proposals confirmed that day (mockup
 * customer.html "+ F9, F12, F13 · kyc v3"). Any other version stands alone. Within a day the KYC
 * comes as it was saved: a note or a version alone where it was, a KYC update where its last
 * version was.
 */
function kycEvents({
  notes,
  facts,
  versions,
  versionFacts,
  recordingOrder,
}: TimelineKyc): Ordered[] {
  const factById = new Map(facts.map((fact) => [fact.id, fact]));
  const noteById = new Map(notes.map((note) => [note.id, note]));
  const saved = new Map(recordingOrder.map((id, index) => [id, index]));
  const savedAt = (id: string) => saved.get(id) ?? -1;
  const onNote = new Map<string, TimelineVersion[]>(notes.map((note) => [note.id, []]));
  const apart: Ordered[] = [];
  for (const version of versions) {
    const recorded = (versionFacts.get(version.id) ?? []).flatMap((id) => factById.get(id) ?? []);
    const line = { version, codes: recorded.map((fact) => factCode(fact.seq)) };
    const [noteId, ...others] = new Set(recorded.map((fact) => fact.noteId));
    const note = others.length === 0 && noteId !== undefined ? noteById.get(noteId) : undefined;
    if (note && compareDates(note.createdDate, version.date) === 0) {
      onNote.get(note.id)!.push(line);
    } else {
      const event = { kind: 'version' as const, id: version.id, date: version.date, version: line };
      apart.push({ event, order: savedAt(version.id) });
    }
  }
  const onNotes = notes.map((note): Ordered => {
    const lines = onNote.get(note.id)!;
    const event = { kind: 'note' as const, id: note.id, date: note.createdDate, note };
    return {
      event: { ...event, versions: lines },
      order: savedAt(lines.at(-1)?.version.id ?? note.id),
    };
  });
  return [...onNotes, ...apart];
}

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
  kyc: TimelineKyc,
  appointments: readonly AppointmentRecord[] = [],
): TimelineEvent[] {
  const events: Ordered[] = [
    ...meetingEvents(appointments).map((event) => ({ event, order: 0 })),
    ...transitions.map((transition) => ({
      event: { kind: 'stage' as const, id: transition.id, date: transition.date, transition },
      order: 0,
    })),
    ...kycEvents(kyc),
  ];
  // Reversed, the stable sort keeps the later record first among equal keys.
  return events
    .reverse()
    .sort(
      (a, b) =>
        compareDates(b.event.date, a.event.date) ||
        RANK[b.event.kind] - RANK[a.event.kind] ||
        b.order - a.order,
    )
    .map(({ event }) => event);
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

/**
 * Why a fact `previewKycNote` refuses cannot be saved, as the command would say it: a value the
 * trường cannot hold (or text it cannot store), else a conflict with nothing to disagree with (7a).
 */
export function refusalText(field: KycField, value: KycValue): string {
  try {
    normalizeKycValue(field, value);
  } catch (failure) {
    return errorMessage(failure);
  }
  return t('kycNote.error.refused', { field: t(`kycField.${field}`) });
}

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
  const latest = versions.at(-1);
  const version = nextKycVersion(latest ? { version: latest, profile } : null, after, date, false);
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
  /** `F{seq}`, as on the KYC facts list (NT-HS-08). */
  readonly code: string;
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
        code: factCode(fact.seq),
        value: fact.value,
        source: system ? 'SYSTEM' : 'NOTE',
        confirmedDate: fact.confirmedDate,
        disabled: KYC_FIELDS[field].fromProfile && !system,
      };
    });
}
