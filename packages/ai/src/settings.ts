/**
 * Settings → AI as stored in the `settings` row `ai` (spec Phase 5 §4.1, mockup ai.html 1g, 4b);
 * never the key. A stored value that cannot be read falls back to the defaults as a whole, with
 * the reason Settings shows on one line; the app opens as usual. Two fallbacks report nothing: a
 * missing or wrong `opencodePlan` is `GO` (P8: values stored before it), and a reasoning level on
 * a model not checked with `reasoning_effort` is `DEFAULT` (G3 `#ask`, review #424).
 */
import { AI_MODELS, DEFAULT_AI_MODEL, type AiModel, type AiModelId } from './models';
import {
  AI_PROVIDERS,
  AI_REASONING_LEVELS,
  type AiProvider,
  type AiReasoningLevel,
} from './schema';

/** The OpenCode plans (P8): one key, one model list, a URL each in Rust. */
export const AI_OPENCODE_PLANS = ['GO', 'CREDIT'] as const;

export type AiOpencodePlan = (typeof AI_OPENCODE_PLANS)[number];

export interface AiSettings {
  readonly provider: AiProvider;
  /** Used with `OPENCODE_GO` only, and kept while Mock is chosen. */
  readonly opencodePlan: AiOpencodePlan;
  readonly model: AiModelId;
  readonly reasoning: AiReasoningLevel;
}

export const DEFAULT_AI_SETTINGS: AiSettings = {
  provider: 'MOCK',
  opencodePlan: 'GO',
  model: DEFAULT_AI_MODEL,
  reasoning: 'DEFAULT',
};

/** Why the stored value fell back to the defaults: a model no longer listed, or anything else. */
export type AiSettingsProblem =
  { readonly kind: 'model'; readonly model: string } | { readonly kind: 'invalid' };

export interface StoredAiSettings {
  readonly settings: AiSettings;
  readonly problem: AiSettingsProblem | null;
}

const isOneOf = <T extends string>(list: readonly T[], value: unknown): value is T =>
  (list as readonly unknown[]).includes(value);

const fallback = (problem: AiSettingsProblem): StoredAiSettings => ({
  settings: DEFAULT_AI_SETTINGS,
  problem,
});

/**
 * Reads the stored JSON; no row (`undefined`) gives the defaults with nothing to report.
 * @param models The model list; tests pass one with a model that takes `reasoning_effort`.
 */
export function readAiSettings(
  json: string | undefined,
  models: readonly AiModel[] = AI_MODELS,
): StoredAiSettings {
  if (json === undefined) return { settings: DEFAULT_AI_SETTINGS, problem: null };
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch {
    return fallback({ kind: 'invalid' });
  }
  if (typeof value !== 'object' || value === null) return fallback({ kind: 'invalid' });
  const { provider, opencodePlan, model, reasoning } = value as Record<string, unknown>;
  if (!isOneOf(AI_PROVIDERS, provider) || !isOneOf(AI_REASONING_LEVELS, reasoning)) {
    return fallback({ kind: 'invalid' });
  }
  const listed = models.find((known) => known.id === model);
  if (!listed) {
    return fallback(typeof model === 'string' ? { kind: 'model', model } : { kind: 'invalid' });
  }
  return {
    settings: {
      provider,
      opencodePlan: isOneOf(AI_OPENCODE_PLANS, opencodePlan) ? opencodePlan : 'GO',
      model: listed.id as AiModelId,
      reasoning: listed.reasoningEffort ? reasoning : 'DEFAULT',
    },
    problem: null,
  };
}
