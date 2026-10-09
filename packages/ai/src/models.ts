/**
 * Providers, models and reasoning levels of Settings → AI (spec Phase 5 §4.1, §4.2). The model list
 * is fixed in code (P3): only models served on `/chat/completions`; adding one is a small task, a
 * model on another endpoint goes through G4. The providers and reasoning levels are in `./schema`,
 * which `packages/db` shares to check the stored analyses.
 */
import type { AiReasoningLevel } from './schema';

export type AiReasoningEffort = Exclude<AiReasoningLevel, 'DEFAULT'>;

export interface AiModel {
  readonly id: string;
  readonly label: string;
  /**
   * Whether the model takes `reasoning_effort`, as a real call checked it (§4.2); while false,
   * Settings turns the Reasoning field off for the model.
   */
  readonly reasoningEffort: boolean;
}

/** `reasoningEffort` from the Owner's real call on gói Credit, 09/10/2026 (T-179, §4.2). */
export const AI_MODELS = [
  // low and high answer alike: no level to choose.
  { id: 'glm-5.3', label: 'GLM-5.3', reasoningEffort: false },
  { id: 'kimi-k3', label: 'Kimi K3', reasoningEffort: true },
  // 403 "Model access is disabled" on every call: not checked yet (T-180).
  { id: 'deepseek-v4-pro', label: 'DeepSeek V4 Pro', reasoningEffort: false },
  { id: 'deepseek-v4.1-flash', label: 'DeepSeek V4.1 Flash', reasoningEffort: true },
] as const satisfies readonly AiModel[];

export type AiModelId = (typeof AI_MODELS)[number]['id'];

/** Owner 07/10/2026: cheap and fast; only the starting value, the Owner changes it in Settings. */
export const DEFAULT_AI_MODEL: AiModelId = 'deepseek-v4.1-flash';
