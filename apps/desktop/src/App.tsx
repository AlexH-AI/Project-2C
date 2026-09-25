import { PIPELINE_STAGES } from '@p2c/domain';
import { t } from './i18n';

export function App() {
  return (
    <main className="flex min-h-screen flex-col gap-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold">{t('app.title')}</h1>
        <p className="text-sm opacity-70">{t('app.subtitle')}</p>
      </header>
      <p className="text-sm opacity-60">{t('app.placeholder')}</p>
      <section aria-labelledby="pipeline-title">
        <h2 id="pipeline-title" className="mb-2 text-sm font-medium opacity-80">
          {t('pipeline.title')}
        </h2>
        <ol className="flex gap-2">
          {PIPELINE_STAGES.map((stage) => (
            <li key={stage} className="rounded-md border border-white/10 px-3 py-1 tabular-nums">
              {stage}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
