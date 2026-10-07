/**
 * What every AI provider adapter offers (spec Phase 5 §10). The OpenCode Go adapter wraps the Rust
 * command `ai_complete`, whose `invoke` `apps/desktop` injects; `Mock` answers from the input alone.
 * A failure is thrown as an `AiError`.
 */
import type { AiReasoningEffort } from './models';

export interface AiMessage {
  readonly role: 'system' | 'user' | 'assistant';
  readonly content: string;
}

export interface AiCompleteRequest {
  readonly model: string;
  /** `null` sends no `reasoning_effort` (Settings → AI "Mặc định", or a model that takes none). */
  readonly reasoning: AiReasoningEffort | null;
  readonly messages: readonly AiMessage[];
  readonly maxTokens: number;
}

export interface AiCompletion {
  /** The answer as text; the output is its first JSON block (`extractJson`). */
  readonly content: string;
  readonly promptTokens: number;
  readonly completionTokens: number;
}

export interface AiAdapter {
  complete(request: AiCompleteRequest): Promise<AiCompletion>;
}
