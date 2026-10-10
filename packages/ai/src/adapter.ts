/**
 * What every AI provider adapter offers (spec Phase 5 §10). The OpenCode Go adapter wraps the Rust
 * command `ai_complete`, whose `invoke` `apps/desktop` injects; `Mock` answers from the input alone.
 * A failure is thrown as an `AiError`.
 */
import type { AiModelId, AiReasoningEffort } from './models';

export interface AiMessage {
  readonly role: 'system' | 'user' | 'assistant';
  readonly content: string;
}

export interface AiCompleteRequest {
  /**
   * Names the conversation, sent as `x-opencode-session` (ADR-0009 W-1): one random id for both
   * attempts of an analysis or an extraction, a new one for each run and each connection check.
   * Never anything of the customer; 32 hex digits, as Rust takes 1–64 of `[A-Za-z0-9-]`.
   */
  readonly sessionId: string;
  /** One of the models of spec §4.2. */
  readonly model: AiModelId;
  /** `null` sends no `reasoning_effort` (Settings → AI "Mặc định", or a model that takes none). */
  readonly reasoning: AiReasoningEffort | null;
  readonly messages: readonly AiMessage[];
  readonly maxTokens: number;
}

export interface AiCompletion {
  /** The answer as text; the output is its first JSON block (`extractJson`). */
  readonly content: string;
  /** `null` when OpenCode gives no count: unknown, not zero. */
  readonly promptTokens: number | null;
  readonly completionTokens: number | null;
  /**
   * Why the model stopped, as OpenCode says: `length` when `maxTokens` cut the answer. Rust always
   * sends it (`null` when OpenCode does not say); Mock has none.
   */
  readonly finishReason?: string | null;
}

export interface AiAdapter {
  complete(request: AiCompleteRequest): Promise<AiCompletion>;
}
