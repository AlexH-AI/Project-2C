/**
 * Zod schemas of the AI input and output (spec Phase 5 §6.1, §6.2, Owner G2 07/10/2026). `packages/db`
 * imports this module alone (`@p2c/ai/schema`) to check `input_json` and `output_json` (§7.3 rule 3), so
 * it depends only on `zod` and `@p2c/domain`, never on another module of `packages/ai`
 * (ADR-0006, phụ lục 07/10/2026). There is one schema per mode, always the latest: a schema change
 * means reloading the simulated data (R2-02), not keeping old schemas.
 */
import { fromIsoDate, KYC_CATEGORIES } from '@p2c/domain';
import { z } from 'zod';

/** The three AI modes: `analysis` (`PAIN_POINT_ANALYSIS`), `discovery` (`PROFILE_DISCOVERY`), `extraction`. */
export const AI_MODES = ['analysis', 'discovery', 'extraction'] as const;

export type AiMode = (typeof AI_MODES)[number];

/** Settings → AI providers (spec §4.1); here so that `ai_analyses` stores the same values. */
export const AI_PROVIDERS = ['MOCK', 'OPENCODE_GO'] as const;

export type AiProvider = (typeof AI_PROVIDERS)[number];

/**
 * Who gave a stored analysis (`ai_analyses.provider`, §7.1): a Settings provider, or ChatGPT web
 * (P7), which is never a Settings value (§4.1).
 */
export const AI_ANALYSIS_PROVIDERS = [...AI_PROVIDERS, 'CHATGPT_WEB'] as const;

export type AiAnalysisProvider = (typeof AI_ANALYSIS_PROVIDERS)[number];

/** How a ChatGPT web `prompt_version` ends: the wrapper's version, as in `analysis@1+web@1` (§7.1). */
export const WEB_PROMPT_VERSION = /\+web@[1-9]\d*$/;

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

/** A day as the app stores it: `yyyy-mm-dd`, a real day of the calendar. */
const isoDate = z.string().refine((text) => {
  try {
    fromIsoDate(text);
    return true;
  } catch {
    return false;
  }
}, 'không phải ngày yyyy-mm-dd');

/**
 * What the app sends for an analysis or discovery (spec §6.1), stored as `input_json` (§7.1): the
 * facts in effect, each with its code `F{seq}`, and the gate. `db` checks it when an analysis is
 * recorded or a backup loaded (§7.3 rule 3), so the panel reads it without trusting a cast.
 */
export const analysisInputSchema = z.object({
  analysisDate: isoDate,
  mode: z.enum(['analysis', 'discovery']),
  facts: z
    .array(
      z.object({
        code: z.string().regex(FACT_CODE),
        category: z.string(),
        field: z.string(),
        value: z.string(),
        confirmedAt: isoDate,
        conflict: z.boolean(),
      }),
    )
    .refine(
      (facts) => new Set(facts.map((fact) => fact.code)).size === facts.length,
      'trùng mã dữ kiện',
    ),
  missingCategories: z.array(z.object({ code: z.enum(KYC_CATEGORIES), label: z.string() })),
  conflictWarnings: z.array(z.string()),
});

export type AnalysisInput = z.infer<typeof analysisInputSchema>;

/** Every string the AI writes: 1–300 characters once trimmed. */
const text = z.string().trim().min(1).max(300);

// Refinement messages are Vietnamese: the validator puts them in a V1 detail, which goes back to the
// model in the retry message (prompts §5).
const evidence = z
  .array(z.string().regex(FACT_CODE))
  .refine((codes) => new Set(codes).size === codes.length, 'trích trùng một dữ kiện');

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
    'cần evidence hoặc missingCategory',
  );

/** Personality systems of `personalityNotes`: psychology (MBTI, DISC…) or tử vi / huyền học. */
export const PERSONALITY_SYSTEMS = ['PSYCHOLOGY', 'ESOTERIC'] as const;

/**
 * "Thông tin tham khảo" (P6, Owner G5 07/10/2026): the only block where personality labels may
 * appear (V5 checks the others). `[]` when no fact supports a note, also when the model leaves the
 * block out: an empty block is a right answer, not worth a retry (review #416).
 */
const personalityNotes = z
  .array(z.object({ system: z.enum(PERSONALITY_SYSTEMS), text, evidence: evidence.min(1) }))
  .max(4)
  .default([]);

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
  // May be empty, so the model may leave it out, as `personalityNotes`.
  hypotheses: z.array(evidencedItem).max(3).default([]),
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
