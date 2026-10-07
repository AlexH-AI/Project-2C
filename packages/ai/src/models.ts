/**
 * Providers, models and reasoning levels of Settings → AI (spec Phase 5 §4.1, §4.2). The model list
 * is fixed in code (P3): only models served on `/chat/completions`; adding one is a small task, a
 * model on another endpoint goes through G4.
 */
export const AI_PROVIDERS = ['MOCK', 'OPENCODE_GO'] as const;

export type AiProvider = (typeof AI_PROVIDERS)[number];

/** `DEFAULT` sends no `reasoning_effort`; the others are sent as low / medium / high. */
export const AI_REASONING_LEVELS = ['DEFAULT', 'LOW', 'MEDIUM', 'HIGH'] as const;

export type AiReasoningLevel = (typeof AI_REASONING_LEVELS)[number];

export type AiReasoningEffort = Exclude<AiReasoningLevel, 'DEFAULT'>;

export interface AiModel {
  readonly id: string;
  readonly label: string;
  /**
   * Whether the model takes `reasoning_effort`. False until the first real call checks it (§4.2,
   * §11); while false, Settings turns the Reasoning field off for the model.
   */
  readonly reasoningEffort: boolean;
}

export const AI_MODELS = [
  { id: 'glm-5.3', label: 'GLM-5.3', reasoningEffort: false },
  { id: 'kimi-k3', label: 'Kimi K3', reasoningEffort: false },
  { id: 'deepseek-v4-pro', label: 'DeepSeek V4 Pro', reasoningEffort: false },
  { id: 'deepseek-v4.1-flash', label: 'DeepSeek V4.1 Flash', reasoningEffort: false },
] as const satisfies readonly AiModel[];

export type AiModelId = (typeof AI_MODELS)[number]['id'];

/** Owner 07/10/2026: cheap and fast; only the starting value, the Owner changes it in Settings. */
export const DEFAULT_AI_MODEL: AiModelId = 'deepseek-v4.1-flash';
