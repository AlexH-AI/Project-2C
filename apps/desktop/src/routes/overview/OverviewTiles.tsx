import { formatCount, type AppointmentCounts, type PeriodKind } from '@p2c/domain';
import { t } from '../../i18n';
import { APPOINTMENT_GROUPS } from '../appointments/appointments-view';
import type { KpiTile } from './overview-view';

const TILE = 'flex flex-col gap-2 rounded-md border border-border bg-surface-1 px-3.5 py-3';
const LABEL = 'text-sm text-fg-2';
const VALUE = 'text-2xl leading-tight font-semibold tabular-nums';
const UNIT = 'text-md font-medium text-fg-3';
const FOOT = 'text-xs text-fg-3 tabular-nums';
const TONE = { up: 'text-ok', down: 'text-danger', same: 'text-fg-2' } as const;

/** "Lịch hẹn": met of all, a bar of the four groups and their counts (mockup overview.html 1a). */
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
        {formatCount(counts.met)}{' '}
        <small className={UNIT}>{t('overview.ofTotal', { total: counts.total })}</small>
      </p>
      <p className={`m-0 -mt-1.5 ${FOOT}`}>{t('overview.appointments.foot')}</p>
      <div aria-hidden="true" className="flex h-2 overflow-hidden rounded-full bg-surface-3">
        {APPOINTMENT_GROUPS.map(
          (group) =>
            counts[group.key] > 0 && (
              <span key={group.key} className={group.fill} style={{ flex: counts[group.key] }} />
            ),
        )}
      </div>
      <ul className="m-0 flex list-none flex-col gap-1 p-0 text-sm tabular-nums">
        {APPOINTMENT_GROUPS.map((group) => (
          <li key={group.key} className="flex items-center gap-2 text-fg-2">
            <i aria-hidden="true" className={`inline-block size-2 rounded-full ${group.dot}`} />
            {t(group.label)}
            <b className="ml-auto font-semibold text-fg">{formatCount(counts[group.key])}</b>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** One KPI with its change against the previous window, or why there is none (mockup 1a, 1e). */
export function KpiCard({ tile }: { tile: KpiTile }) {
  return (
    <section aria-label={tile.label} className={TILE}>
      <h3 className={`m-0 font-normal ${LABEL}`}>{tile.label}</h3>
      <p className={`m-0 ${VALUE}`}>
        {tile.value}
        {tile.unit && (
          <small className={UNIT}>{tile.unitSpaced ? ` ${tile.unit}` : tile.unit}</small>
        )}
      </p>
      <p className={`m-0 ${FOOT}`}>
        {tile.delta && <span className={TONE[tile.delta.tone]}>{tile.delta.text} </span>}
        {tile.note}
        {tile.formula && <span>{` ${t('sep.dot')} ${tile.formula}`}</span>}
      </p>
    </section>
  );
}
