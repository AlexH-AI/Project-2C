import { t } from '../i18n';

export interface ScreenErrorMessage {
  title: string;
  help: string;
  /** Technical detail for a bug report. */
  detail: string;
}

/** What a screen shows in place of its content when rendering it threw (T-077). */
export function screenErrorMessage(error: unknown): ScreenErrorMessage {
  return {
    title: t('screenError.title'),
    help: t('screenError.help'),
    detail: String(error),
  };
}
