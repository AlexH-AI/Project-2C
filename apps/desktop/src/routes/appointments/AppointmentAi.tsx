import { useCallback } from 'react';
import { getKycProfile, listAiAnalyses, listKycVersions, type Database } from '@p2c/db';
import { formatDayMonth } from '@p2c/domain';
import { useQuery } from '../../data/AppDataContext';
import { t } from '../../i18n';
import { routeToHash } from '../../shell/routes';
import { LINK } from '../classes';
import { BADGE } from '../customers/CustomerKyc';
import { BADGE_COLORS, FADED, ITEMS, Item } from '../customers/KycIntelligence';
import type { AiPanelItem } from '../customers/ai-panel-view';
import { SourceBadge } from '../customers/KycHistory';
import { appointmentAiView } from './appointment-ai-view';

function Block({
  title,
  items,
  faded,
}: {
  title: string;
  items: readonly AiPanelItem[];
  faded: boolean;
}) {
  return (
    items.length > 0 && (
      <section aria-label={title}>
        <h4 className="mt-2 mb-1.5 text-sm font-medium text-heading">{title}</h4>
        <ul className={ITEMS}>
          {items.map((item, index) => (
            <Item key={index} item={item} faded={faded} />
          ))}
        </ul>
      </section>
    )
  );
}

/**
 * Mockup appointments.html "KYC Intelligence" (spec Phase 5 §9.2): what the customer's latest
 * ACCEPTED analysis says to do next, read-only. The AI runs only from the profile.
 */
export function AppointmentAi({ customerId }: { customerId: string }) {
  const view = useQuery(
    useCallback(
      (db: Database) =>
        appointmentAiView(
          listAiAnalyses(db, customerId),
          listKycVersions(db, customerId),
          getKycProfile(db, customerId).facts,
        ),
      [customerId],
    ),
  );
  const stale = view?.state === 'STALE';
  return (
    <section
      aria-labelledby="appointment-ai"
      className="flex flex-col gap-1.5 border-t border-border pt-3 text-sm"
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 id="appointment-ai" className="m-0 text-sm font-medium text-heading">
          {t('aiPanel.title')}
        </h3>
        {view && (
          <>
            <span className={`${BADGE} ${BADGE_COLORS[view.state]}`}>{view.state}</span>
            <SourceBadge source={view.source} />
            <span className="ml-auto text-xs text-fg-3 tabular-nums">
              {t('appointments.ai.meta', {
                version: view.version,
                date: formatDayMonth(view.date),
              })}
            </span>
          </>
        )}
      </div>
      {view ? (
        <div className={stale ? FADED : undefined}>
          <span className={`${BADGE} ${BADGE_COLORS[view.gateState]}`}>{view.gateState}</span>
          <Block
            title={t('aiPanel.section.nextBestActions')}
            items={view.nextBestActions}
            faded={stale}
          />
          <Block
            title={t('aiPanel.section.discoveryStrategy')}
            items={view.discoveryStrategy}
            faded={stale}
          />
        </div>
      ) : (
        <p className="m-0 text-fg-3">
          {t('appointments.ai.empty')}{' '}
          <a href={routeToHash({ screen: 'customer', id: customerId })} className={LINK}>
            {t('appointments.ai.toProfile')}
          </a>
        </p>
      )}
    </section>
  );
}
