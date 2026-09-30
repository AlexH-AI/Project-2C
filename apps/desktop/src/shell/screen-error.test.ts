import { describe, expect, it } from 'vitest';
import { t } from '../i18n';
import { screenErrorMessage } from './screen-error';

describe('screenErrorMessage', () => {
  it('says the screen failed, what to do, and keeps the error as the technical detail', () => {
    const message = screenErrorMessage(new TypeError('boom'));

    expect(message).toEqual({
      title: t('screenError.title'),
      help: t('screenError.help'),
      detail: 'TypeError: boom',
    });
    expect(message.title).not.toBe('screenError.title');
  });

  it('describes a thrown value that is not an Error', () => {
    expect(screenErrorMessage('ALREADY_OPEN').detail).toBe('ALREADY_OPEN');
    expect(screenErrorMessage(undefined).detail).toBe('undefined');
  });
});
