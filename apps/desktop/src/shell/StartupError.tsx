import { t } from '../i18n';

/** Full-page message when the database cannot be opened at startup. */
export function StartupError({ error }: { error: unknown }) {
  return (
    <main role="alert" className="flex min-h-screen flex-col gap-2 px-6 py-8">
      <h1 className="m-0 text-xl font-semibold text-danger">{t('storage.openFailed')}</h1>
      <p className="m-0 text-sm text-fg-2">{String(error)}</p>
    </main>
  );
}
