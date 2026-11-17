import type { ReactElement } from 'react';
import type { StoragePort } from '../data/app-data';
import { t } from '../i18n';
import { startupFolder, startupMessage } from './startup-error';

/**
 * Full-page message when the database cannot be opened at startup; `folder` is the data folder,
 * when known (`startupFolder`).
 */
export function StartupError({ error, folder }: { error: unknown; folder?: string }) {
  const { title, help, detail } = startupMessage(error, folder);
  return (
    <main role="alert" className="flex min-h-screen flex-col gap-2 px-6 py-8">
      <h1 className="m-0 text-xl font-semibold text-danger">{title}</h1>
      <p className="m-0 text-sm text-fg-2">{help}</p>
      {detail !== undefined && (
        <p className="m-0 text-sm text-fg-2">
          {t('storage.technicalDetail')} <code>{detail}</code>
        </p>
      )}
    </main>
  );
}

/**
 * The page `main.tsx` shows when the app cannot start: `StartupError` naming the data folder
 * `storage` gives, when it can give one (L185, L205).
 */
export async function startupErrorPage(
  error: unknown,
  storage: Pick<StoragePort, 'dataFolder'> | undefined,
): Promise<ReactElement> {
  return <StartupError error={error} folder={await startupFolder(storage)} />;
}
