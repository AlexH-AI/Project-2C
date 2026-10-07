import { describe, expect, it } from 'vitest';
import { AI_ERROR_CODES, AiError, isAiErrorCode } from './errors';

describe('AiError', () => {
  it('has the ten codes of spec §5.3', () => {
    expect(AI_ERROR_CODES).toEqual([
      'AI_NO_KEY',
      'AI_UNAUTHORIZED',
      'AI_RATE_LIMITED',
      'AI_TIMEOUT',
      'AI_NETWORK',
      'AI_HTTP',
      'AI_BAD_RESPONSE',
      'AI_BUSY',
      'AI_BAD_REQUEST',
      'AI_KEYRING',
    ]);
  });

  it('carries the code, the HTTP status and the server message', () => {
    const error = new AiError('AI_HTTP', { httpStatus: 500, serverMessage: 'Internal error' });
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AiError');
    expect(error.message).toBe('AI_HTTP');
    expect([error.code, error.httpStatus, error.serverMessage]).toEqual([
      'AI_HTTP',
      500,
      'Internal error',
    ]);
  });

  it('leaves the details out when there are none', () => {
    const error = new AiError('AI_NO_KEY');
    expect([error.httpStatus, error.serverMessage]).toEqual([undefined, undefined]);
  });

  it('keeps at most 200 characters of the server message', () => {
    const error = new AiError('AI_HTTP', { serverMessage: 'x'.repeat(250) });
    expect(error.serverMessage).toHaveLength(200);
  });

  it('does not cut a character in two at the 200th', () => {
    const error = new AiError('AI_HTTP', { serverMessage: `${'x'.repeat(199)}😀😀` });
    expect(error.serverMessage).toBe(`${'x'.repeat(199)}😀`);
  });

  it('tells the codes apart from other values', () => {
    expect(isAiErrorCode('AI_BUSY')).toBe(true);
    expect([isAiErrorCode('DB_ERROR'), isAiErrorCode(1), isAiErrorCode(null)]).toEqual([
      false,
      false,
      false,
    ]);
  });
});
