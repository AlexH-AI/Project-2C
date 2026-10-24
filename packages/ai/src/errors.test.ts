import { describe, expect, it } from 'vitest';
import { AI_ERROR_CODES, AiError, errorDetails, isAiErrorCode } from './errors';

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

  it('has AI_TOO_LARGE of its own, which Rust never sends', () => {
    expect(new AiError('AI_TOO_LARGE').code).toBe('AI_TOO_LARGE');
    expect(isAiErrorCode('AI_TOO_LARGE')).toBe(false);
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

  it('gives the HTTP status and server message a value holds, with no key for a missing one', () => {
    const error = new AiError('AI_HTTP', { httpStatus: 502, serverMessage: 'Bad gateway' });
    expect(errorDetails(error)).toStrictEqual({ httpStatus: 502, serverMessage: 'Bad gateway' });
    expect(errorDetails(new AiError('AI_HTTP', { httpStatus: 500 }))).toStrictEqual({
      httpStatus: 500,
    });
    expect(errorDetails(new AiError('AI_TIMEOUT'))).toStrictEqual({});
  });

  it('reads what Rust sent: a status that is no number or a message that is no string is none', () => {
    expect(errorDetails({ httpStatus: '502', serverMessage: 42 })).toStrictEqual({});
    expect(errorDetails({ httpStatus: null, serverMessage: '' })).toStrictEqual({
      serverMessage: '',
    });
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
