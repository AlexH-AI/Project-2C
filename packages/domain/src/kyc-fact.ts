/**
 * Confirmed KYC fact (ADR-0008). Notes, the operations that create and change facts, and versions
 * live in `kyc.ts`.
 */
import type { KycCategory, KycField } from './kyc-catalog';
import type { CalendarDate } from './period';

/**
 * `active`: the latest confirmed value. `superseded`: replaced by a newer fact on the same trường,
 * kept as history. `conflict`: two or more confirmed facts on the same trường disagree and none has
 * been replaced yet (G2 6).
 */
export const KYC_FACT_STATUSES = ['active', 'superseded', 'conflict'] as const;

export type KycFactStatus = (typeof KYC_FACT_STATUSES)[number];

/** A "không / chưa có" answer is a value too (e.g. `hasProtection: false`, `childrenCount: 0`). */
export type KycValue = string | number | boolean;

/** Trường holding a whole number or a yes/no answer; every other trường holds text. */
const NUMBER_FIELDS: ReadonlySet<KycField> = new Set(['birthYear', 'childrenCount']);
const BOOLEAN_FIELDS: ReadonlySet<KycField> = new Set(['hasProtection']);

/**
 * Review #36: values are compared only after taking the type of their trường; `"2"` for a number
 * trường is `2`. Text is composed (NFC) and trimmed. Throws a RangeError for a value the trường
 * cannot hold, and for text with a NUL, which is never stored.
 */
export function normalizeKycValue(field: KycField, value: KycValue): KycValue {
  if (typeof value === 'string' && value.includes('\0')) {
    throw new RangeError(`KYC value with a NUL for ${field}`);
  }
  const text = typeof value === 'string' ? value.normalize('NFC').trim() : null;
  if (NUMBER_FIELDS.has(field)) {
    const number = text !== null && /^\d+$/.test(text) ? Number(text) : value;
    if (typeof number === 'number' && Number.isSafeInteger(number) && number >= 0) return number;
  } else if (BOOLEAN_FIELDS.has(field)) {
    if (typeof value === 'boolean') return value;
    if (text === 'true' || text === 'false') return text === 'true';
  } else if (typeof value !== 'boolean') {
    const normalized = text ?? String(value);
    if (normalized !== '') return normalized;
  }
  throw new RangeError(`Not a KYC value for ${field}: ${String(value)}`);
}

export interface KycFact {
  readonly id: string;
  readonly category: KycCategory;
  readonly field: KycField;
  readonly value: KycValue;
  /** The KYC note the fact was confirmed from. */
  readonly noteId: string;
  /** Day the RE confirmed the fact. */
  readonly confirmedDate: CalendarDate;
  readonly status: KycFactStatus;
}
