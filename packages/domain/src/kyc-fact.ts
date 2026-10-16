/**
 * Confirmed KYC fact (ADR-0008). Notes, the operations that create and change facts, and versions
 * live in `kyc.ts`.
 */
import type { KycCategory, KycField } from './kyc-catalog';
import type { CalendarDate } from './period';
import { isStorableText, normalizeText } from './text';

/**
 * `active`: the latest confirmed value. `superseded`: replaced by a newer fact on the same trường,
 * kept as history. `conflict`: two or more confirmed facts on the same trường disagree and none has
 * been replaced yet (G2 6).
 */
export const KYC_FACT_STATUSES = ['active', 'superseded', 'conflict'] as const;

export type KycFactStatus = (typeof KYC_FACT_STATUSES)[number];

/** A "không / chưa có" answer is a value too (e.g. `hasProtection: false`, `childrenCount: 0`). */
export type KycValue = string | number | boolean;

/** What a trường holds: text, a whole number or a yes/no answer. */
export type KycFieldType = 'text' | 'integer' | 'boolean';

const FIELD_TYPES: Partial<Record<KycField, KycFieldType>> = {
  birthYear: 'integer',
  childrenCount: 'integer',
  hasProtection: 'boolean',
};

/**
 * The one list of typed trường (CL-F4): the value check below, the trường sent for an extraction
 * and the KYC dialogs all read it.
 */
export function kycFieldType(field: KycField): KycFieldType {
  return FIELD_TYPES[field] ?? 'text';
}

/**
 * Review #36: values are compared only after taking the type of their trường; `"2"` for a number
 * trường is `2`. Text is read as `normalizeText` stores it, so a value of invisible characters only
 * is empty (DR6-49). Throws a RangeError for a value the trường cannot hold, and for text the
 * database cannot store (`isStorableText`).
 */
export function normalizeKycValue(field: KycField, value: KycValue): KycValue {
  if (typeof value === 'string' && !isStorableText(value)) {
    throw new RangeError(`KYC value that cannot be stored for ${field}`);
  }
  const text = typeof value === 'string' ? normalizeText(value) : null;
  const type = kycFieldType(field);
  if (type === 'integer') {
    const number = text !== null && /^\d+$/.test(text) ? Number(text) : value;
    if (typeof number === 'number' && Number.isSafeInteger(number) && number >= 0) return number;
  } else if (type === 'boolean') {
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
