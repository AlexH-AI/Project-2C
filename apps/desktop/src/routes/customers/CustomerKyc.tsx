import { factCode } from '@p2c/ai';
import type {
  AppointmentRecord,
  KycFactRecord,
  KycNoteRecord,
  KycProfileRecord,
  KycVersionRecord,
} from '@p2c/db';
import {
  formatDate,
  KYC_FIELDS,
  type CalendarDate,
  type KycField,
  type KycGateState,
  type Person,
  type StageTransition,
} from '@p2c/domain';
import { Button, StageBadge } from '@p2c/ui';
import type { ReactNode } from 'react';
import { joinParts, t } from '../../i18n';
import { withTime } from '../appointments/appointment-form';
import { statusLabel } from '../appointments/appointments-view';
import { NextButton } from './CustomerAppointments';
import { factAnchor, factText, kycOverview, kycTimeline, type KycCategoryRow } from './kyc-view';

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
  marked,
  onResolve,
}: {
  row: KycCategoryRow<KycFactRecord>;
  marked: string | null;
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
        {row.facts.map((fact) => {
          const code = factCode(fact.seq);
          return (
            <span
              key={fact.id}
              id={factAnchor(code)}
              aria-current={code === marked ? 'true' : undefined}
              className={`flex justify-between gap-2 rounded-sm text-fg-2 ${code === marked ? 'outline-2 outline-offset-2 outline-warn' : ''}`}
            >
              <span>
                {t(`kycField.${fact.field}`)}: {factText(fact.value, YES_NO)}
                {KYC_FIELDS[fact.field].fromProfile && (
                  <span className="text-xs text-fg-3">
                    {' '}
                    {t('sep.dot')} {t('kyc.fromProfile')}
                  </span>
                )}
              </span>
              <span className="text-xs whitespace-nowrap text-fg-3 tabular-nums">
                {joinParts([code, formatDate(fact.confirmedDate)])}
              </span>
            </span>
          );
        })}
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
  marked,
  onResolve,
}: {
  profile: KycProfileRecord;
  versions: readonly KycVersionRecord[];
  /** The code of the fact a click on evidence led to, outlined for a moment (mockup ai.html 3a). */
  marked: string | null;
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
          <CategoryRow key={row.category} row={row} marked={marked} onResolve={onResolve} />
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

/** A meeting's own line: the trigger while planned, else its note and next step. */
function meetingText(a: AppointmentRecord): string {
  if (a.status === 'SCHEDULED') {
    return t('timeline.trigger', { trigger: a.triggerNote ?? t(`trigger.${a.triggerType}`) });
  }
  return joinParts([a.note, a.nextStep && t('timeline.nextStep', { step: a.nextStep })]);
}

/**
 * Mockup customer.html "Dòng thời gian": KYC notes and versions, the stage changes and the
 * appointments; any appointment up to today offers the next one ("Hẹn tiếp", 6h). The profile
 * lays out each note, with its AI trích xuất.
 */
export function Timeline({
  transitions,
  notes,
  versions,
  appointments,
  people,
  today,
  onNext,
  renderNote,
}: {
  transitions: readonly StageTransition[];
  notes: readonly KycNoteRecord[];
  versions: readonly KycVersionRecord[];
  appointments: readonly AppointmentRecord[];
  people: readonly Person[];
  today: CalendarDate;
  onNext: (from: AppointmentRecord) => void;
  /** A KYC note with its AI trích xuất (mockup ai.html 3b). */
  renderNote: (note: KycNoteRecord) => ReactNode;
}) {
  const roles = (a: AppointmentRecord) =>
    a.coordinatorIds.flatMap((id) => people.find((person) => person.id === id)?.role ?? []);
  return (
    <section aria-labelledby="timeline" className={CARD}>
      <h2 id="timeline" className={`${HEADING} mb-2`}>
        {t('timeline.title')}
      </h2>
      <ol className="m-0 flex list-none flex-col gap-3 p-0 text-sm">
        {kycTimeline(transitions, notes, versions, appointments).map((event) => (
          <li key={event.id} className="flex flex-col gap-0.5">
            <span className="text-xs text-fg-3 tabular-nums">
              {event.kind === 'meeting'
                ? t('timeline.meetingWhen', {
                    when: withTime(formatDate(event.date), event.appointment.time),
                    status: statusLabel(event.appointment, today).text.toLocaleLowerCase('vi'),
                  })
                : formatDate(event.date)}
            </span>
            {event.kind === 'meeting' && (
              <>
                <b>
                  {joinParts([
                    event.number === null
                      ? t('timeline.meetingPlain')
                      : t('timeline.meeting', { number: event.number }),
                    roles(event.appointment).length > 0 &&
                      t('timeline.coordinators', { roles: roles(event.appointment).join(', ') }),
                  ])}
                </b>
                <span className="flex flex-wrap items-baseline gap-x-2 text-fg-2">
                  {meetingText(event.appointment)}
                  <NextButton appointment={event.appointment} today={today} onNext={onNext}>
                    {t('timeline.next')}
                  </NextButton>
                </span>
              </>
            )}
            {event.kind === 'stage' && (
              <span className="flex items-center gap-2">
                {event.transition.from && badge(event.transition.from)}
                {event.transition.from && t('sep.arrow')}
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
            {event.kind === 'note' && renderNote(event.note)}
            {event.kind === 'version' && (
              <span className="flex items-center gap-2">
                <b>{event.version.summary}</b>
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
