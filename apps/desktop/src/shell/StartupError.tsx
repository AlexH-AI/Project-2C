import type { ReactElement } from 'react';
import { StateNote } from '@p2c/ui';
import type { StoragePort } from '../data/app-data';
import { t } from '../i18n';
import { startupFolder, startupMessage } from './startup-error';

/**
 * Full-page message when the database cannot be opened at startup; `folder` is the data folder,
 * when known (`startupFolder`). The error of the whole app, in the shape of every empty place and
 * error (mockup components.html 10); it reads no data, which is not open.
 */
export function StartupError({ error, folder }: { error: unknown; folder?: string }) {
  const { title, help, detail } = startupMessage(error, folder);
  return (
    <main className="grid min-h-screen place-items-center">
      <StateNote
        size="screen"
        tone="error"
        icon="data"
        heading={1}
        title={title}
        next={help}
        {...(detail === undefined
          ? {}
          : { detail: { label: t('storage.technicalDetail'), text: detail } })}
      />
    </main>
  );
}

/**
 * The page `main.tsx` shows when the app cannot start: `StartupError` naming the data folder
 * `storage` gives, when it can give one (review of PR 1348, review of PR 1362).
 */
export async function startupErrorPage(
  error: unknown,
  storage: Pick<StoragePort, 'dataFolder'> | undefined,
): Promise<ReactElement> {
  return <StartupError error={error} folder={await startupFolder(storage)} />;
}
