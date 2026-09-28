import type { KycNoteRecord, KycProfileRecord, KycVersionRecord } from '@p2c/db';
import { formatDate, type KycField, type KycGateState, type StageTransition } from '@p2c/domain';
import { Button, StageBadge } from '@p2c/ui';
import { t } from '../../i18n';
import { factText, kycOverview, kycTimeline, type KycCategoryRow } from './kyc-view';

const CARD = 'rounded-lg border border-border bg-surface-1 p-4';
const HEADING = 'm-0 text-sm font-medium text-heading';
export const BADGE = 'rounded-full border border-current px-2 py-0.5 text-xs font-semibold';

const GATE_COLORS: Record<KycGateState, string> = {
  CONFLICT_RESOLUTION: 'text-danger',
  KYC_INSUFFICIENT: 'text-warn',
  PROFILE_DISCOVERY: 'text-info',
  PAIN_POINT_ANALYSIS: 'text-ok',
};

export const YES_NO = { yes: t('kyc.yes'), no: t('kyc.no') };

function CategoryRow({
  row,
  onResolve,
}: {
  row: KycCategoryRow;
  onResolve: (field: KycField) => void;
}) {
  const conflicting = [
    ...new Set(row.facts.filter((f) => f.status === 'conflict').map((f) => f.field)),
  ];
  const [mark, color, state] = row.conflict
    ? [
        '!',
        row.conflict === 'core' ? 'text-danger' : 'text-warn',
        t(`kyc.conflict.${row.conflict}`),
      ]
    : row.present
      ? ['✓', 'text-ok', t('kyc.present')]
      : ['○', 'text-fg-3', t('kyc.missing')];
  return (
    <li className="flex gap-2 border-b border-border py-2 last:border-b-0">
      <span aria-hidden="true" className={`w-4 shrink-0 text-center font-bold ${color}`}>
        {mark}
      </span>
      <div className="flex flex-1 flex-col gap-1">
        <span className="font-semibold">
          {t(`kycCategory.${row.category}`)}{' '}
          <span className={`text-xs font-normal ${row.conflict ? color : 'text-fg-3'}`}>
            {state}
          </span>
        </span>
        {row.facts.map((fact) => (
          <span key={fact.id} className="flex justify-between gap-2 text-fg-2">
            <span>
              {t(`kycField.${fact.field}`)}: {factText(fact.value, YES_NO)}
              {(fact.field === 'birthYear' || fact.field === 'gender') && (
                <span className="text-xs text-fg-3"> · {t('kyc.fromProfile')}</span>
              )}
            </span>
            <span className="text-xs whitespace-nowrap text-fg-3 tabular-nums">
              {formatDate(fact.confirmedDate)}
            </span>
          </span>
        ))}
        {conflicting.map((field) => (
          <Button
            key={field}
            className="self-start"
            aria-label={t('kycResolve.openLabel', { field: t(`kycField.${field}`) })}
            onClick={() => onResolve(field)}
          >
            {t('kycResolve.open')}
          </Button>
        ))}
      </div>
    </li>
  );
}

/** Mockup customer.html "Dữ kiện KYC": the hạng mục, the gate and, while short, the questions. */
export function KycCard({
  profile,
  versions,
  onResolve,
}: {
  profile: KycProfileRecord;
  versions: readonly KycVersionRecord[];
  onResolve: (field: KycField) => void;
}) {
  const { gate, rows } = kycOverview(profile.facts);
  const asking = gate.state === 'KYC_INSUFFICIENT' || gate.state === 'PROFILE_DISCOVERY';
  return (
    <section aria-labelledby="kyc-facts" className={`${CARD} flex flex-col gap-3 text-sm`}>
      <div className="flex items-baseline gap-2">
        <h2 id="kyc-facts" className={HEADING}>
          {t('kyc.title')}
        </h2>
        <span className="text-xs text-fg-3 tabular-nums">
          {t(versions.length > 0 ? 'kyc.meta' : 'kyc.metaNoVersion', {
            present: gate.presentCategories.length,
            total: rows.length,
            version: versions.length,
          })}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <p className="m-0 flex items-center gap-2">
          {t('kyc.gate')}{' '}
          <span className={`${BADGE} ${GATE_COLORS[gate.state]}`}>{gate.state}</span>
        </p>
        <p className="m-0 text-fg-2">
          {gate.message ? <b>{gate.message}</b> : t(`kyc.gateHelp.${gate.state}`)}
        </p>
        {gate.coreConflictFields.length > 0 && (
          <p className="m-0 text-danger">
            {t('kyc.conflictFields', {
              fields: gate.coreConflictFields.map((f) => t(`kycField.${f}`)).join(', '),
            })}
          </p>
        )}
      </div>
      <ul className="m-0 list-none p-0">
        {rows.map((row) => (
          <CategoryRow key={row.category} row={row} onResolve={onResolve} />
        ))}
      </ul>
      {asking && (
        <details open={gate.state === 'KYC_INSUFFICIENT'} className="rounded-md bg-surface-2 p-3">
          <summary className="cursor-pointer font-medium">{t('kyc.questions')}</summary>
          {gate.suggestedQuestions.map(({ category, questions }) => (
            <div key={category} className="mt-2">
              <b className="text-xs text-fg-3">{t(`kycCategory.${category}`)}</b>
              <ul className="m-0 pl-5 text-fg-2">
                {questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </div>
          ))}
        </details>
      )}
    </section>
  );
}

const badge = (stage: StageTransition['to']) => (
  <StageBadge stage={stage} label={t(`stage.${stage}`)} />
);

/** Mockup customer.html "Dòng thời gian": KYC notes and versions with the stage changes. */
export function Timeline({
  transitions,
  notes,
  versions,
}: {
  transitions: readonly StageTransition[];
  notes: readonly KycNoteRecord[];
  versions: readonly KycVersionRecord[];
}) {
  return (
    <section aria-labelledby="timeline" className={CARD}>
      <h2 id="timeline" className={`${HEADING} mb-2`}>
        {t('timeline.title')}
      </h2>
      <ol className="m-0 flex list-none flex-col gap-3 p-0 text-sm">
        {kycTimeline(transitions, notes, versions).map((event) => (
          <li key={event.id} className="flex flex-col gap-0.5">
            <span className="text-xs text-fg-3 tabular-nums">{formatDate(event.date)}</span>
            {event.kind === 'stage' && (
              <span className="flex items-center gap-2">
                {event.transition.from && badge(event.transition.from)}
                {event.transition.from && t('timeline.arrow')}
                {badge(event.transition.to)}
                <span className="text-xs text-fg-3">
                  {t(
                    event.transition.from === null
                      ? 'customer.created'
                      : event.transition.appointmentId
                        ? 'customer.byMeeting'
                        : 'customer.manual',
                  )}
                </span>
              </span>
            )}
            {event.kind === 'note' && (
              <>
                <b>{t(event.note.source === 'SYSTEM' ? 'timeline.systemNote' : 'timeline.note')}</b>
                <span className="whitespace-pre-line text-fg-2">{event.note.text}</span>
              </>
            )}
            {event.kind === 'version' && (
              <span className="flex items-center gap-2">
                <b>{event.version.summary}</b>
                {event.version.material && (
                  <span className={`${BADGE} text-accent`}>{t('timeline.material')}</span>
                )}
                <span className="text-xs text-fg-3">
                  {t('timeline.version', { number: event.number })}
                </span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
