import { AiError } from '@p2c/ai';
import { describe, expect, it, vi } from 'vitest';
import { tauriOpenCode } from './ai-tauri';

const REQUEST = {
  sessionId: '0f3a9c1d77be4e21a0c45d2e8b6f9a10',
  model: 'kimi-k3',
  reasoning: null,
  messages: [{ role: 'user', content: 'ping' }],
  maxTokens: 64,
} as const;

const rejectedWith = async (promise: Promise<unknown>) => {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error('resolved');
};

describe('tauriOpenCode (spec Phase 5 §5.1)', () => {
  it('sends the key to ai_key_set and reads only a yes / no back', async () => {
    const invoke = vi.fn().mockResolvedValue(null);
    const client = tauriOpenCode(invoke);
    await client.setKey('sk-1');
    await client.deleteKey();
    expect(invoke.mock.calls).toEqual([
      ['ai_key_set', { key: 'sk-1' }],
      ['ai_key_delete', undefined],
    ]);

    invoke.mockResolvedValue(true);
    expect(await client.keyStatus()).toBe(true);
    invoke.mockResolvedValue(false);
    expect(await client.keyStatus()).toBe(false);
  });

  it('asks Rust to open chatgpt.com, passing nothing, and reads any failure as not opened (§5.4)', async () => {
    const invoke = vi.fn().mockResolvedValue(null);
    const client = tauriOpenCode(invoke);
    expect(await client.openChatGpt()).toBe(true);
    expect(invoke.mock.calls).toEqual([['open_chatgpt']]);

    invoke.mockRejectedValue({ code: 'AI_OPEN_BROWSER' });
    expect(await client.openChatGpt()).toBe(false);
    invoke.mockRejectedValue('command open_chatgpt not found');
    expect(await client.openChatGpt()).toBe(false);
  });

  it.each([
    { content: 'OK', promptTokens: 10, completionTokens: 1, finishReason: 'stop' },
    // No `usage` and an answer cut by `max_tokens` (T-194).
    { content: '{"hypo', promptTokens: null, completionTokens: null, finishReason: 'length' },
  ])(
    'calls ai_complete under the plan and gives the completion as Rust sends it',
    async (completion) => {
      const invoke = vi.fn().mockResolvedValue(completion);
      expect(await tauriOpenCode(invoke).adapter('CREDIT').complete(REQUEST)).toEqual(completion);
      expect(invoke).toHaveBeenCalledWith('ai_complete', { plan: 'CREDIT', ...REQUEST });
    },
  );

  it.each([
    ['LOW', 'low'],
    ['MEDIUM', 'medium'],
    ['HIGH', 'high'],
  ] as const)(
    'sends the reasoning level %s as reasoning_effort %s (spec §4.1)',
    async (level, sent) => {
      const invoke = vi
        .fn()
        .mockResolvedValue({ content: 'OK', promptTokens: 1, completionTokens: 1 });
      await tauriOpenCode(invoke)
        .adapter('CREDIT')
        .complete({ ...REQUEST, reasoning: level });
      expect(invoke).toHaveBeenCalledWith(
        'ai_complete',
        expect.objectContaining({ reasoning: sent }),
      );
    },
  );

  it('turns the error Rust sends into an AiError with its HTTP status and message', async () => {
    const invoke = vi
      .fn()
      .mockRejectedValue({ code: 'AI_HTTP', httpStatus: 502, message: 'Bad gateway' });
    const error = await rejectedWith(tauriOpenCode(invoke).adapter('GO').complete(REQUEST));
    expect(error).toBeInstanceOf(AiError);
    expect(error).toMatchObject({ code: 'AI_HTTP', httpStatus: 502, serverMessage: 'Bad gateway' });

    invoke.mockRejectedValue({ code: 'AI_KEYRING' });
    const keyring = await rejectedWith(tauriOpenCode(invoke).setKey('sk-1'));
    expect(keyring).toEqual(new AiError('AI_KEYRING'));
    expect(keyring).toMatchObject({ httpStatus: undefined, serverMessage: undefined });
  });

  it.each([
    ['the string Tauri sends for an argument it cannot read', 'invalid args `plan`'],
    ['an unknown code', { code: 'AI_SOMETHING' }],
    ['nothing', undefined],
  ])('reads %s as AI_BAD_REQUEST', async (_, reason) => {
    const invoke = vi.fn().mockRejectedValue(reason);
    expect(await rejectedWith(tauriOpenCode(invoke).keyStatus())).toEqual(
      new AiError('AI_BAD_REQUEST'),
    );
  });
});
