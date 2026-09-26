import { PIPELINE_STAGES } from '@p2c/domain';
import { t } from '../i18n';
import type { Route } from '../shell/routes';

/** Screen bodies. Empty for now: each screen gets its content in Phase 3–4. */
export function Screen({ route }: { route: Route }) {
  return (
    <>
      <p className="text-sm text-fg-3">{t('screen.placeholder')}</p>
      {route.screen === 'overview' && <PipelineStages />}
    </>
  );
}

function PipelineStages() {
  return (
    <section aria-labelledby="pipeline-title">
      <h2 id="pipeline-title" className="mb-2 text-sm font-medium text-heading">
        {t('pipeline.title')}
      </h2>
      <ol className="flex gap-2">
        {PIPELINE_STAGES.map((stage) => (
          <li
            key={stage}
            className="rounded-md border border-border bg-surface-2 px-3 py-1 tabular-nums"
          >
            {stage}
          </li>
        ))}
      </ol>
    </section>
  );
}
