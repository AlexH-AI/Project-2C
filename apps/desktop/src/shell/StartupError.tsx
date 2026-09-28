import { t } from '../i18n';
import { startupMessage } from './startup-error';

/** Full-page message when the database cannot be opened at startup. */
export function StartupError({ error }: { error: unknown }) {
  const { title, help, detail } = startupMessage(error);
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
