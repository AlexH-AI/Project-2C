import { DbError } from '@p2c/db';
import { isDamagedDataError, isStartupBackupError, type StoragePort } from '../data/app-data';
import {
  ACCESS_DENIED,
  ALREADY_OPEN,
  DATA_DIR_UNREACHABLE,
  DISK_FULL,
  FILE_IN_USE,
} from '../data/tauri-storage';
import { t } from '../i18n';

export interface StartupMessage {
  title: string;
  help: string;
  /** Technical detail; left out when the message alone says what to do. */
  detail?: string;
}

/**
 * The data folder the startup page names (L185): the one Rust chose (`data_folder`), asked once the
 * page shows, as Rust's errors are bare codes the webview matches exactly. `undefined` in web mode,
 * or when Rust could not choose the folder (the data folder itself failed); never an error of its
 * own in place of the one the page tells.
 */
export async function startupFolder(
  storage: Pick<StoragePort, 'dataFolder'> | undefined,
): Promise<string | undefined> {
  try {
    return await storage?.dataFolder();
  } catch {
    return undefined;
  }
}

/**
 * What the startup page says when the database could not be opened. `folder` is the data folder
 * (`startupFolder`); unknown, the page names the folder of each platform and mode instead.
 */
export function startupMessage(error: unknown, folder?: string): StartupMessage {
  const where = { folder: folder ?? t('storage.dataFolderModes') };
  if (error === ALREADY_OPEN) {
    return { title: t('storage.alreadyOpen'), help: t('storage.alreadyOpenHelp') };
  }
  // The file is whole: copying a backup over it would lose the changes since (DR6-07, L184).
  if (error === FILE_IN_USE) {
    return { title: t('storage.fileInUse'), help: t('storage.fileInUseHelp', where) };
  }
  if (error === ACCESS_DENIED) {
    return { title: t('storage.accessDenied'), help: t('storage.accessDeniedHelp', where) };
  }
  if (error === DATA_DIR_UNREACHABLE) {
    return { title: t('storage.dataDirUnreachable'), help: t('storage.dataDirUnreachableHelp') };
  }
  if (isStartupBackupError(error)) {
    if (error.cause === DISK_FULL) {
      return { title: t('storage.diskFull'), help: t('storage.diskFullHelp', where) };
    }
    return {
      title: t('storage.backupFailed'),
      help: t('storage.backupFailedHelp', where),
      detail: String(error.cause),
    };
  }
  if (isDamagedDataError(error)) {
    return {
      title: t('storage.damaged'),
      help: t('storage.openFailedHelp', where),
      detail: String(error.cause),
    };
  }
  if (error instanceof DbError && error.code === 'SCHEMA_TOO_NEW') {
    return { title: t('storage.tooNew'), help: t('storage.tooNewHelp', error.params) };
  }
  return {
    title: t('storage.openFailed'),
    help: t('storage.openFailedHelp', where),
    detail: String(error),
  };
}
