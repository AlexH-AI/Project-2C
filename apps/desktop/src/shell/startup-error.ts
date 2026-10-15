import { DbError } from '@p2c/db';
import { isDamagedDataError, isStartupBackupError } from '../data/app-data';
import { ACCESS_DENIED, ALREADY_OPEN, DISK_FULL, FILE_IN_USE } from '../data/tauri-storage';
import { t } from '../i18n';

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
  // The file is whole: copying a backup over it would lose the changes since (DR6-07).
  if (error === FILE_IN_USE) {
    return { title: t('storage.fileInUse'), help: t('storage.fileInUseHelp') };
  }
  if (error === ACCESS_DENIED) {
    return { title: t('storage.accessDenied'), help: t('storage.accessDeniedHelp') };
  }
  if (isStartupBackupError(error)) {
    if (error.cause === DISK_FULL) {
      return { title: t('storage.diskFull'), help: t('storage.diskFullHelp') };
    }
    return {
      title: t('storage.backupFailed'),
      help: t('storage.backupFailedHelp'),
      detail: String(error.cause),
    };
  }
  if (isDamagedDataError(error)) {
    return {
      title: t('storage.damaged'),
      help: t('storage.openFailedHelp'),
      detail: String(error.cause),
    };
  }
  if (error instanceof DbError && error.code === 'SCHEMA_TOO_NEW') {
    return { title: t('storage.tooNew'), help: t('storage.tooNewHelp', error.params) };
  }
  return {
    title: t('storage.openFailed'),
    help: t('storage.openFailedHelp'),
    detail: String(error),
  };
}
