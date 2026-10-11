/**
 * What is sent to the model for an extraction (spec Phase 5 §6.1, prompts G5 §4.1): one note and
 * the trường it may propose. The analysis input, which `db` builds too for its seed, is
 * `buildAnalysisInput` of `schema.ts`.
 */
import { kycFieldType, type KycField, type KycFieldType } from '@p2c/domain';
import { KYC_FIELD_LABELS } from './schema';
import { EXTRACTION_FIELDS } from './validator';

export interface ExtractionInput {
  readonly note: string;
  readonly fields: readonly {
    readonly field: KycField;
    readonly label: string;
    readonly type: KycFieldType;
  }[];
}

/** One KYC note as the RE wrote it, and every trường but those from the hồ sơ KH (D2). */
export function buildExtractionInput(note: string): ExtractionInput {
  return {
    note,
    fields: EXTRACTION_FIELDS.map((field) => ({
      field,
      label: KYC_FIELD_LABELS[field],
      type: kycFieldType(field),
    })),
  };
}
