/**
 * OpenCode through the Rust AI commands (spec Phase 5 §5.1, ADR-0009 D-1): the key stays in the
 * Windows Credential Manager and the webview never talks to the network. Web mode has no Rust, so
 * no client: OpenCode is off there (§4.1).
 */
import {
  AiError,
  isAiErrorCode,
  type AiAdapter,
  type AiCompletion,
  type AiOpencodePlan,
} from '@p2c/ai';
import type { InvokeArgs } from '@tauri-apps/api/core';

type Invoke = (command: string, args?: InvokeArgs) => Promise<unknown>;

export interface OpenCodeClient {
  /** Whether a key is stored (`ai_key_status`); no command gives the key back. */
  keyStatus(): Promise<boolean>;
  /** Stores the key; the caller trims and checks it first (§4.3), Rust checks again. */
  setKey(key: string): Promise<void>;
  /** Deleting when no key is stored is fine. */
  deleteKey(): Promise<void>;
  /** `ai_complete` under `plan`: Rust picks the plan's URL (P8). */
  adapter(plan: AiOpencodePlan): AiAdapter;
  /**
   * `open_chatgpt` (§5.4): Rust opens its fixed URL in the default browser. It fails only with
   * `AI_OPEN_BROWSER`, so any failure reads as not opened.
   */
  openChatGpt(): Promise<boolean>;
}

/**
 * Rust rejects with `{ code, httpStatus?, message? }`. Anything else, such as Tauri's own string
 * when an argument cannot be read, is a bug of the webview: `AI_BAD_REQUEST` (review of PR 436).
 */
function aiError(reason: unknown): AiError {
  if (typeof reason !== 'object' || reason === null) return new AiError('AI_BAD_REQUEST');
  const { code, httpStatus, message } = reason as Record<string, unknown>;
  if (!isAiErrorCode(code)) return new AiError('AI_BAD_REQUEST');
  return new AiError(code, {
    ...(typeof httpStatus === 'number' && { httpStatus }),
    ...(typeof message === 'string' && { serverMessage: message }),
  });
}

/** @param invoke Tauri's `invoke`. */
export function tauriOpenCode(invoke: Invoke): OpenCodeClient {
  const call = (command: string, args?: InvokeArgs) =>
    invoke(command, args).catch((reason: unknown) => {
      throw aiError(reason);
    });
  return {
    keyStatus: async () => (await call('ai_key_status')) === true,
    setKey: async (key) => void (await call('ai_key_set', { key })),
    deleteKey: async () => void (await call('ai_key_delete')),
    openChatGpt: () =>
      invoke('open_chatgpt').then(
        () => true,
        () => false,
      ),
    adapter: (plan) => ({
      complete: async ({ sessionId, model, reasoning, messages, maxTokens }) =>
        (await call('ai_complete', {
          sessionId,
          plan,
          model,
          // Rust sends it as it comes; OpenCode takes low / medium / high (spec §4.1, T-179).
          reasoning: reasoning?.toLowerCase() ?? null,
          messages: messages.map(({ role, content }) => ({ role, content })),
          maxTokens,
        })) as AiCompletion,
    }),
  };
}
