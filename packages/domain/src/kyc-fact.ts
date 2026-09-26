/**
 * Minimal confirmed KYC fact, as far as the gate needs it (ADR-0008). T-029 owns the full KYC model
 * (notes, operations, versions) and extends this type.
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
