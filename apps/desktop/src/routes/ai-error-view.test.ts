import { describe, expect, it } from 'vitest';
import { aiFailure, errorParts, errorText, SETTINGS_AI_HASH } from './ai-error-view';

describe('the §5.3 message of an AI error (mockup ai.html 2l, 4c)', () => {
  it('adds the HTTP status Rust got, and the server message of AI_HTTP', () => {
    expect(errorText({ code: 'AI_HTTP', httpStatus: 502, serverMessage: 'Bad gateway' })).toBe(
      'OpenCode báo lỗi (HTTP 502): Bad gateway',
    );
    expect(errorText({ code: 'AI_HTTP', httpStatus: 500 })).toBe('OpenCode báo lỗi (HTTP 500).');
    expect(errorText({ code: 'AI_UNAUTHORIZED', httpStatus: 401, serverMessage: 'expired' })).toBe(
      'Key không hợp lệ hoặc hết hạn. Gói Go đã hết hạn → chọn gói Credit ở Cài đặt → AI. (HTTP 401)',
    );
    expect(errorText({ code: 'AI_RATE_LIMITED', httpStatus: 429 })).toBe(
      'Đã chạm giới hạn gói Go hoặc hết credit OpenCode — thử lại sau, hoặc đổi gói / nạp credit. (HTTP 429)',
    );
  });

  it('shows the message alone when Rust gave no status', () => {
    expect(errorText({ code: 'AI_HTTP' })).toBe('OpenCode báo lỗi.');
    expect(errorText({ code: 'AI_NETWORK' })).toBe('Không kết nối được OpenCode.');
  });

  it('shows the general message for a bug or a bad request (G3 ai.html#ask 10)', () => {
    const general = 'Có lỗi trong app khi gọi AI — thử lại; nếu lặp lại, báo cho người hỗ trợ.';
    expect(errorText({ code: 'GENERAL' })).toBe(general);
    expect(errorText({ code: 'AI_BAD_REQUEST', httpStatus: 400 })).toBe(general);
  });
});

describe('aiFailure', () => {
  it('keeps the code, the HTTP status and the server message of a failed call', () => {
    const outcome = {
      kind: 'error',
      code: 'AI_HTTP',
      httpStatus: 502,
      serverMessage: 'Bad gateway',
    } as const;
    expect(aiFailure(outcome)).toEqual({
      code: 'AI_HTTP',
      httpStatus: 502,
      serverMessage: 'Bad gateway',
    });
    expect(aiFailure({ code: 'AI_TIMEOUT' })).toEqual({ code: 'AI_TIMEOUT' });
  });

  it('turns a bad request into the general message, a bug the app made', () => {
    expect(aiFailure({ code: 'AI_BAD_REQUEST', httpStatus: 400 })).toEqual({ code: 'GENERAL' });
  });
});

describe('errorParts (mockups 2f, 2l)', () => {
  it('links "Cài đặt → AI" of AI_NO_KEY to Settings → AI', () => {
    expect(errorParts({ code: 'AI_NO_KEY' })).toEqual({
      before: 'Chưa có API key OpenCode — nhập ở ',
      link: 'Cài đặt → AI',
      after: '.',
    });
    expect(SETTINGS_AI_HASH).toBe('#/settings/ai');
  });

  it('gives any other message whole, with no link', () => {
    expect(errorParts({ code: 'AI_UNAUTHORIZED' })).toEqual({
      before: 'Key không hợp lệ hoặc hết hạn. Gói Go đã hết hạn → chọn gói Credit ở Cài đặt → AI.',
      link: null,
      after: '',
    });
    expect(errorParts({ code: 'AI_HTTP', httpStatus: 502 })).toEqual({
      before: 'OpenCode báo lỗi (HTTP 502).',
      link: null,
      after: '',
    });
  });
});
