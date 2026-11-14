/**
 * The two interface languages (ADR-0018 §1). Vietnamese goes with VND only; English with every
 * currency (§2).
 */
export const LANGUAGES = ['vi', 'en'] as const;

export type Language = (typeof LANGUAGES)[number];
