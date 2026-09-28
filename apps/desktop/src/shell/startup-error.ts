import { t } from '../i18n';

/** `db_open`'s error when another exe already has the data folder open (`storage::ALREADY_OPEN`). */
const ALREADY_OPEN = 'ALREADY_OPEN';

export interface StartupMessage {
  title: string;
  help: string;
  /** Technical detail; left out when the message alone says what to do. */
  detail?: string;
}

/** What the startup page says when the database could not be opened. */
export function startupMessage(error: unknown): StartupMessage {
  if (error === ALREADY_OPEN) {
    return { title: t('storage.alreadyOpen'), help: t('storage.alreadyOpenHelp') };
  }
  return {
    title: t('storage.openFailed'),
    help: t('storage.openFailedHelp'),
    detail: String(error),
  };
}
