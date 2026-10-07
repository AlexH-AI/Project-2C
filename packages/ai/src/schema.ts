/**
 * Zod schemas of the AI output (spec Phase 5 §6.2, Owner G2 07/10/2026). `packages/db` imports this
 * module alone (`@p2c/ai/schema`) to check `output_json` when a backup is loaded (§7.3 rule 3), so
 * it depends only on `zod` and `@p2c/domain`, never on another module of `packages/ai`
 * (ADR-0006, phụ lục 07/10/2026). There is one schema per mode, always the latest: a schema change
 * means reloading the simulated data (R2-02), not keeping old schemas.
 */
import { KYC_CATEGORIES } from '@p2c/domain';
import { z } from 'zod';

/** The three AI modes: `analysis` (`PAIN_POINT_ANALYSIS`), `discovery` (`PROFILE_DISCOVERY`), `extraction`. */
export const AI_MODES = ['analysis', 'discovery', 'extraction'] as const;

export type AiMode = (typeof AI_MODES)[number];

/** Settings → AI providers (spec §4.1); here so that `ai_analyses` stores the same values. */
export const AI_PROVIDERS = ['MOCK', 'OPENCODE_GO'] as const;

export type AiProvider = (typeof AI_PROVIDERS)[number];

/** `DEFAULT` sends no `reasoning_effort`; the others are sent as low / medium / high. */
export const AI_REASONING_LEVELS = ['DEFAULT', 'LOW', 'MEDIUM', 'HIGH'] as const;

export type AiReasoningLevel = (typeof AI_REASONING_LEVELS)[number];

/** A well-formed fact code: `F` and a seq with no leading zero. */
export const FACT_CODE = /^F[1-9]\d*$/;

/** Code of a confirmed fact in the AI input and on the KYC facts list: `F{seq}`. */
export function factCode(seq: number): string {
  if (!Number.isSafeInteger(seq) || seq < 1) throw new RangeError(`Not a fact seq: ${seq}`);
  return `F${seq}`;
}

/** Every string the AI writes: 1–300 characters once trimmed. */
const text = z.string().trim().min(1).max(300);

const evidence = z
  .array(z.string().regex(FACT_CODE))
  .refine((codes) => new Set(codes).size === codes.length, 'The same fact is cited twice');

/** Hypotheses, needs, pain points and themes: always cite at least one fact. */
const evidencedItem = z.object({ text, evidence: evidence.min(1) });

/** Discovery strategy and next best actions: cite facts, or name a missing hạng mục, or both. */
const actionItem = z
  .object({
    text,
    evidence: evidence.default([]),
    missingCategory: z.enum(KYC_CATEGORIES).optional(),
  })
  .refine(
    (item) => item.evidence.length > 0 || item.missingCategory !== undefined,
    'Needs evidence or a missing hạng mục',
  );

/** Personality systems of `personalityNotes`: psychology (MBTI, DISC…) or tử vi / huyền học. */
export const PERSONALITY_SYSTEMS = ['PSYCHOLOGY', 'ESOTERIC'] as const;

/**
 * "Thông tin tham khảo" (P6, Owner G5 07/10/2026): the only block where personality labels may
 * appear (V5 checks the others). Always present, `[]` when no fact supports a note.
 */
const personalityNotes = z
  .array(z.object({ system: z.enum(PERSONALITY_SYSTEMS), text, evidence: evidence.min(1) }))
  .max(4);

export const analysisOutputSchema = z.object({
  hypotheses: z.array(evidencedItem).min(1).max(5),
  needs: z.array(evidencedItem).min(1).max(5),
  painPoints: z.array(evidencedItem).min(1).max(5),
  themes: z.array(evidencedItem).min(1).max(5),
  discoveryStrategy: z.array(actionItem).min(1).max(6),
  nextBestActions: z.array(actionItem).min(1).max(5),
  personalityNotes,
});

export const discoveryOutputSchema = z.object({
  hypotheses: z.array(evidencedItem).max(3),
  discoveryStrategy: z.array(actionItem).min(2).max(6),
  nextBestActions: z.array(actionItem).min(1).max(5),
  personalityNotes,
});

/**
 * Whether `field` is allowed, `value` fits it and `quote` is in the note is V7 (spec §6.4), which
 * drops only the wrong fact; the schema checks the shape, so one wrong fact does not reject them all.
 */
export const extractionOutputSchema = z.object({
  facts: z
    .array(z.object({ field: text, value: z.union([text, z.number(), z.boolean()]), quote: text }))
    .max(20),
});

export type AnalysisOutput = z.infer<typeof analysisOutputSchema>;
export type DiscoveryOutput = z.infer<typeof discoveryOutputSchema>;
export type ExtractionOutput = z.infer<typeof extractionOutputSchema>;

export const AI_OUTPUT_SCHEMAS = {
  analysis: analysisOutputSchema,
  discovery: discoveryOutputSchema,
  extraction: extractionOutputSchema,
} as const satisfies Record<AiMode, z.ZodType>;
