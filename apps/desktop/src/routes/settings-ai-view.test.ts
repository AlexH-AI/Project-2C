import { DEFAULT_AI_SETTINGS, type AiSettings } from '@p2c/ai';
import { describe, expect, it } from 'vitest';
import {
  checkKey,
  checkShown,
  modelList,
  modelOptions,
  problemText,
  reasoningOptions,
  takesReasoning,
} from './settings-ai-view';

const CREDIT: AiSettings = {
  ...DEFAULT_AI_SETTINGS,
  provider: 'OPENCODE_GO',
  opencodePlan: 'CREDIT',
};

describe('checkKey (spec Phase 5 §4.3, mockup ai.html 1d)', () => {
  it('trims the key', () => {
    expect(checkKey('  sk-abc_123\n')).toEqual({ key: 'sk-abc_123' });
  });

  it.each([
    ['', 'EMPTY'],
    ['   \t', 'EMPTY'],
    ['a'.repeat(513), 'TOO_LONG'],
    ['sk-a\u0007b', 'NOT_ASCII'],
    ['sk-a b', 'NOT_ASCII'],
    ['sk-ạ', 'NOT_ASCII'],
  ])('refuses %j: %s', (text, error) => {
    expect(checkKey(text)).toEqual({ error });
  });

  it('takes 512 characters, counted once trimmed', () => {
    expect(checkKey(` ${'a'.repeat(512)} `)).toEqual({ key: 'a'.repeat(512) });
  });
});

describe('the fields of Settings → AI', () => {
  it('lists the models with the default marked, and the reasoning levels', () => {
    expect(modelOptions()).toEqual([
      { value: 'glm-5.3', label: 'GLM-5.3' },
      { value: 'kimi-k3', label: 'Kimi K3' },
      { value: 'deepseek-v4.1-flash', label: 'DeepSeek V4.1 Flash · mặc định' },
    ]);
    expect(modelList()).toBe('GLM-5.3 · Kimi K3 · DeepSeek V4.1 Flash');
    expect(reasoningOptions().map(({ label }) => label)).toEqual([
      'Mặc định',
      'Thấp',
      'Vừa',
      'Cao',
    ]);
  });

  it('has the Reasoning field on only for the models checked with reasoning_effort (T-179)', () => {
    expect(takesReasoning('kimi-k3')).toBe(true);
    expect(takesReasoning('deepseek-v4.1-flash')).toBe(true);
    expect(takesReasoning('glm-5.3')).toBe(false);
    expect(takesReasoning('gpt-6')).toBe(false);
  });

  it('names the stored model that is no longer listed, and the defaults in use (1g)', () => {
    expect(problemText({ kind: 'model', model: 'gpt-6' })).toBe(
      'Cài đặt AI đã lưu không hợp lệ (model "gpt-6" không còn trong danh sách) — đang dùng mặc định: Mock · DeepSeek V4.1 Flash · Mặc định. Chọn lại để lưu.',
    );
    expect(problemText({ kind: 'invalid' })).toBe(
      'Cài đặt AI đã lưu không hợp lệ — đang dùng mặc định: Mock · DeepSeek V4.1 Flash · Mặc định. Chọn lại để lưu.',
    );
  });
});

describe('a connection check (mockup 1f, 2l, 4a, 4c)', () => {
  it('names the plan and model it ran with', () => {
    expect(checkShown({ kind: 'ok' }, CREDIT)).toEqual({
      phase: 'ok',
      detail: '· Credit · DeepSeek V4.1 Flash',
    });
    expect(checkShown({ kind: 'ok' }, { ...CREDIT, opencodePlan: 'GO', model: 'glm-5.3' })).toEqual(
      { phase: 'ok', detail: '· Gói Go · GLM-5.3' },
    );
  });

  it.each([
    ['AI_NO_KEY', 'Chưa có API key OpenCode — nhập ở Cài đặt → AI.'],
    [
      'AI_UNAUTHORIZED',
      'Key không hợp lệ hoặc hết hạn. Gói Go đã hết hạn → chọn gói Credit ở Cài đặt → AI.',
    ],
    [
      'AI_RATE_LIMITED',
      'Đã chạm giới hạn gói Go hoặc hết credit OpenCode — thử lại sau, hoặc đổi gói / nạp credit.',
    ],
    ['AI_TIMEOUT', 'AI không trả lời trong 2 phút.'],
    ['AI_NETWORK', 'Không kết nối được OpenCode.'],
    ['AI_HTTP', 'OpenCode báo lỗi.'],
    ['AI_BAD_RESPONSE', 'Trả lời của OpenCode không đọc được.'],
    ['AI_BUSY', 'Đang có một yêu cầu AI khác — chờ xong rồi thử lại.'],
    ['AI_BAD_REQUEST', 'Có lỗi trong app khi gọi AI — thử lại; nếu lặp lại, báo cho người hỗ trợ.'],
    ['AI_KEYRING', 'Không đọc / ghi được key trong Windows Credential Manager.'],
  ] as const)('shows the message of %s', (code, text) => {
    expect(checkShown({ kind: 'error', code }, CREDIT)).toEqual({ phase: 'error', text });
  });

  it('shows the general message for a check that failed by a bug, and nothing once cancelled', () => {
    expect(checkShown(null, CREDIT)).toEqual({
      phase: 'error',
      text: 'Có lỗi trong app khi gọi AI — thử lại; nếu lặp lại, báo cho người hỗ trợ.',
    });
    expect(checkShown({ kind: 'cancelled' }, CREDIT)).toEqual({ phase: 'idle' });
  });
});
