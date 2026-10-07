/**
 * "Kiểm tra kết nối" (prompts G5 §6, spec §4.3): not stored, not validated; any answer without an
 * error is a success. The reasoning is the one in Settings.
 */
import type { AiMessage } from '../adapter';

export const connectionCheck = {
  messages: [
    { role: 'system', content: 'Trả lời đúng một từ: OK' },
    { role: 'user', content: 'ping' },
  ] as const satisfies readonly AiMessage[],
  maxTokens: 64,
};
