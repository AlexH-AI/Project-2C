import { formatNumber, type AppointmentCounts, type PeriodKind } from '@p2c/domain';
import { Count } from '@p2c/ui';
import { t } from '../../i18n';
import { routeToHash } from '../../shell/routes';
import { APPOINTMENT_GROUPS } from '../appointments/appointments-view';
import { CARD_SKIN } from '../classes';
import { KPI_STEP, kpiText, type KpiTile } from './overview-view';

const TILE = `${CARD_SKIN} flex flex-col gap-2 px-5 py-4.5`;
const LABEL = 'text-sm text-fg-2';
const VALUE = 'text-2xl leading-tight font-semibold tabular-nums';
const UNIT = 'text-md font-medium text-fg-3';
const FOOT = 'text-xs text-fg-3 tabular-nums';
const FORMULA = 'text-xs text-fg-2 tabular-nums';
const TONE = { good: 'text-ok', bad: 'text-danger', same: 'text-fg-2' } as const;
/**
 * The link of a tile covers the whole of it (its `::after`, over the card, which is `relative`), so
 * a press anywhere on the tile opens it; its focus ring goes round the tile.
 */
const OPEN =
  'after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-accent';
const GO = 'absolute top-4.5 right-5 text-md text-fg-3';
const REPORTS = routeToHash({ screen: 'reports' });

/**
 * "Lịch hẹn": met of all, a bar of the four groups and their counts (mockup overview.html 1a). The
 * number met runs to a new value ("Đếm", VA7b); the bar, a share of four, and the counts change at once.
 */
export function AppointmentsTile({
  counts,
  kind,
}: {
  counts: AppointmentCounts;
  kind: PeriodKind;
}) {
  const label = t(`overview.appointments.${kind}`);
  return (
    <section aria-label={label} className={TILE}>
      <h2 className={`m-0 font-normal ${LABEL}`}>{label}</h2>
      <p className={`m-0 ${VALUE}`}>
        <Count value={counts.met} step="whole" write={formatNumber} />{' '}
        <small className={UNIT}>{t('overview.ofTotal', { total: counts.total })}</small>
      </p>
      <p className={`m-0 -mt-1.5 ${FOOT}`}>{t('overview.appointments.foot')}</p>
      {counts.total === 0 ? (
        // An empty bar says so (mockup 1e), as the months of the Lịch hẹn year grid do.
        <p className="m-0 grid h-5 place-items-center rounded-control-sm bg-surface-3 text-xs font-medium text-fg-3">
          {t('appointments.monthEmpty')}
        </p>
      ) : (
        <div aria-hidden="true" className="flex h-2 overflow-hidden rounded-full bg-surface-3">
          {APPOINTMENT_GROUPS.map(
            (group) =>
              counts[group.key] > 0 && (
                <span key={group.key} className={group.fill} style={{ flex: counts[group.key] }} />
              ),
          )}
        </div>
      )}
      <ul className="m-0 flex list-none flex-col gap-1 p-0 text-sm tabular-nums">
        {APPOINTMENT_GROUPS.map((group) => (
          <li key={group.key} className="flex items-center gap-2 text-fg-2">
            <i aria-hidden="true" className={`inline-block size-2 rounded-full ${group.dot}`} />
            {t(group.label)}
            <b className="ml-auto font-semibold text-fg">{formatNumber(counts[group.key])}</b>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * One KPI (mockup tong-quan.html `#tiles`, `#states`): under its number how it is worked out or
 * what it counts, then its change against the previous window, green for the better and red for
 * the worse, or why there is none. Its number runs to a new value ("Đếm", VA7b), each frame written
 * as the number at rest, red below 0; the lines under it change at once. The whole tile opens Báo
 * cáo at the period and scope viewed (`onOpen` keeps the period). Doanh số, until D8 makes it the
 * lead number, spans the row (`wide`).
 */
export function KpiCard({
  tile,
  wide,
  onOpen,
}: {
  tile: KpiTile;
  wide: boolean;
  onOpen: () => void;
}) {
  return (
    <section aria-label={tile.label} className={`${TILE} ${wide ? 'col-span-3' : ''}`}>
      <h3 className={`m-0 font-normal ${LABEL}`}>{tile.label}</h3>
      <p className={`m-0 ${VALUE} ${tile.negative ? 'text-danger' : ''}`}>
        <Count
          value={tile.amount}
          step={KPI_STEP[tile.kind]}
          write={(amount) => {
            const { value, unit, unitSpaced } = kpiText(tile.kind, amount);
            return (
              <>
                {value}
                {unit && <small className={UNIT}>{unitSpaced ? ` ${unit}` : unit}</small>}
              </>
            );
          }}
        />
      </p>
      {tile.formula && <p className={`m-0 ${FORMULA}`}>{tile.formula}</p>}
      <p className={`m-0 ${FOOT}`}>
        {tile.delta && <span className={TONE[tile.delta.tone]}>{tile.delta.text} </span>}
        {tile.note}
      </p>
      <a
        href={REPORTS}
        onClick={onOpen}
        aria-label={t('overview.kpiOpen', { label: tile.label })}
        className={OPEN}
      >
        <span aria-hidden="true" className={GO}>
          {t('sep.arrow')}
        </span>
      </a>
    </section>
  );
}
