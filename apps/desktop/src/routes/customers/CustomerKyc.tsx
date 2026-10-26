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
import { Button, Segmented } from '@p2c/ui';
import { useState, type ReactNode, type Ref } from 'react';
import { joinParts, t } from '../../i18n';
import { withTime } from '../appointments/appointment-form';
import { statusLabel } from '../appointments/appointments-view';
import { CARD } from '../classes';
import { stageBadge } from '../stage-badge';
import { NextButton } from './CustomerAppointments';
import {
  factAnchor,
  factText,
  inTimelineFilter,
  kycOverview,
  kycTimeline,
  stageCause,
  TIMELINE_FILTERS,
  type KycCategoryRow,
  type TimelineEvent,
  type TimelineFilter,
  type TimelineKyc,
  type TimelineVersion,
} from './kyc-view';

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
        t('kyc.mark.conflict'),
        row.conflict === 'core' ? 'text-danger' : 'text-warn',
        t(`kyc.conflict.${row.conflict}`),
      ]
    : row.present
      ? [t('kyc.mark.present'), 'text-ok', t('kyc.present')]
      : [t('kyc.mark.missing'), 'text-fg-3', t('kyc.missing')];
  return (
    <li className="flex gap-2 border-b border-border py-2 last:border-b-0">
      <span aria-hidden="true" className={`w-4 shrink-0 text-center font-bold ${color}`}>
        {mark}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
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
              // Focused by a click on its code cited as evidence (DR5-38).
              tabIndex={-1}
              aria-current={code === marked ? 'true' : undefined}
              className={`flex justify-between gap-2 rounded-sm text-fg-2 ${code === marked ? 'outline-2 outline-offset-2 outline-warn' : ''}`}
            >
              <span className="min-w-0 wrap-anywhere">
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
  heading,
  onResolve,
}: {
  profile: KycProfileRecord;
  versions: readonly KycVersionRecord[];
  /** The code of the fact a click on evidence led to, outlined for a moment (mockup ai.html 3a). */
  marked: string | null;
  /** The card's heading: the focus lands there when a resolved conflict took "Giải quyết" (7d). */
  heading: Ref<HTMLHeadingElement>;
  onResolve: (field: KycField) => void;
}) {
  const { gate, rows } = kycOverview(profile.facts);
  const asking = gate.state === 'KYC_INSUFFICIENT' || gate.state === 'PROFILE_DISCOVERY';
  return (
    <section aria-labelledby="kyc-facts" className={`${CARD} flex flex-col gap-3 text-sm`}>
      <div className="flex items-baseline gap-2">
        <h2 id="kyc-facts" ref={heading} tabIndex={-1} className={HEADING}>
          {t('kyc.title')}
        </h2>
        <span className="text-xs text-fg-3 tabular-nums">
          {t(versions.length > 0 ? 'kyc.meta' : 'kyc.metaNoVersion', {
            present: gate.presentCategories.length,
            total: rows.length,
            version: versions.at(-1)?.seq ?? 0,
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
              fields: gate.coreConflictFields.map((f) => t(`kycField.${f}`)).join(t('sep.list')),
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

/** "tạo KH", "chuyển tay · không tính RF", or "sau cuộc gặp" and whether it counted one RF. */
function StageCause({ transition }: { transition: StageTransition }) {
  const cause = stageCause(transition);
  return (
    <span className="text-xs text-fg-3">
      {cause === 'created' || cause === 'manual' ? (
        t(`customer.${cause}`)
      ) : (
        <>
          {t('customer.byMeeting')} {t('sep.dot')}{' '}
          <span className={cause === 'rf' ? 'text-accent' : undefined}>
            {t(`timeline.${cause}`)}
          </span>
        </>
      )}
    </span>
  );
}

/** A meeting's own line: the trigger while planned, else its note and next step. */
function meetingText(a: AppointmentRecord): string {
  if (a.status === 'SCHEDULED') {
    return t('timeline.trigger', { trigger: a.triggerNote ?? t(`trigger.${a.triggerType}`) });
  }
  return joinParts([a.note, a.nextStep && t('timeline.nextStep', { step: a.nextStep })]);
}

/** Mockup customer.html: "Cập nhật KYC dd/mm/yyyy", "thay đổi quan trọng" when one version is. */
export function UpdateHead({ versions }: { versions: readonly TimelineVersion[] }) {
  return (
    <>
      <b>{versions[0]!.version.summary}</b>
      {versions.some((line) => line.version.material) && (
        <span className={`${BADGE} whitespace-nowrap text-accent`}>{t('timeline.material')}</span>
      )}
    </>
  );
}

/** "+ F9, F12, F13 · kyc v3": each version with the codes of the facts it recorded, if any. */
export function VersionLines({ versions }: { versions: readonly TimelineVersion[] }) {
  return versions.map(({ version, codes }) => (
    <span key={version.id} className="text-xs wrap-anywhere text-fg-3 tabular-nums">
      {joinParts([
        codes.length > 0 && t('timeline.added', { value: codes.join(t('sep.list')) }),
        t('timeline.version', { number: version.seq }),
      ])}
    </span>
  ));
}

const FILTERS = TIMELINE_FILTERS.map((value) => ({ value, label: t(`timeline.filter.${value}`) }));

/**
 * Mockup customer.html "Dòng thời gian": the KYC updates — a note with the versions its facts
 * recorded —, notes and versions alone, the stage changes and the appointments, kept to one kind by
 * the filter; any appointment up to today offers the next one ("Hẹn tiếp", 6h). The profile lays
 * out each note, with its AI trích xuất. The filter hides the other kinds, it does not drop them:
 * a note keeps what its AI trích xuất found until the profile is left (spec Phase 5 §8 item 4).
 */
export function Timeline({
  transitions,
  kyc,
  appointments,
  people,
  today,
  onNext,
  renderNote,
}: {
  transitions: readonly StageTransition[];
  kyc: TimelineKyc;
  appointments: readonly AppointmentRecord[];
  people: readonly Person[];
  today: CalendarDate;
  onNext: (from: AppointmentRecord) => void;
  /** A KYC note, a KYC update with `versions`, with its AI trích xuất (mockup ai.html 3b). */
  renderNote: (note: KycNoteRecord, versions: readonly TimelineVersion[]) => ReactNode;
}) {
  const [filter, setFilter] = useState<TimelineFilter>('ALL');
  const roles = (a: AppointmentRecord) =>
    a.coordinatorIds.flatMap((id) => people.find((person) => person.id === id)?.role ?? []);
  const events = kycTimeline(transitions, kyc, appointments);
  const shown = (event: TimelineEvent) => inTimelineFilter(event, filter);
  return (
    <section aria-labelledby="timeline" className={CARD}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h2 id="timeline" className={HEADING}>
          {t('timeline.title')}
        </h2>
        <div className="flex-1" />
        <Segmented
          label={t('timeline.filter')}
          options={FILTERS}
          value={filter}
          onChange={setFilter}
        />
      </div>
      {!events.some(shown) && <p className="m-0 text-sm text-fg-3">{t('timeline.empty')}</p>}
      <ol className="m-0 flex list-none flex-col gap-3 p-0 text-sm">
        {events.map((event) => (
          <li key={event.id} hidden={!shown(event)} className="flex flex-col gap-0.5">
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
                      t('timeline.coordinators', {
                        roles: roles(event.appointment).join(t('sep.list')),
                      }),
                  ])}
                </b>
                <span className="flex flex-wrap items-baseline gap-x-2 wrap-anywhere text-fg-2">
                  {meetingText(event.appointment)}
                  <NextButton appointment={event.appointment} today={today} onNext={onNext}>
                    {t('timeline.next')}
                  </NextButton>
                </span>
              </>
            )}
            {event.kind === 'stage' && (
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {event.transition.from && stageBadge(event.transition.from)}
                {event.transition.from && t('sep.arrow')}
                {stageBadge(event.transition.to)}
                <StageCause transition={event.transition} />
              </span>
            )}
            {event.kind === 'note' && renderNote(event.note, event.versions)}
            {event.kind === 'version' && (
              <>
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <UpdateHead versions={[event.version]} />
                </span>
                <VersionLines versions={[event.version]} />
              </>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
