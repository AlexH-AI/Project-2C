import type { AppointmentRecord } from '@p2c/db';
import {
  formatDate,
  formatVnd,
  formatVndCompact,
  isRfTransition,
  parseVnd,
  type CustomerStage,
  type Person,
} from '@p2c/domain';
import { Choices, SelectField, StageBadge, TextField } from '@p2c/ui';
import { t } from '../../i18n';
import { LOCKED, personLabel } from './appointments-view';
import { stageAfterChoices, type OutcomeError } from './outcome-form';

export const badge = (stage: CustomerStage) => (
  <StageBadge stage={stage} label={t(`stage.${stage}`)} />
);
const FIELD_ERROR = 'm-0 text-sm text-danger';

/** What a met meeting adds to its outcome (mockups 6c, 6f). */
export interface MetDraft {
  readonly stageAfter: CustomerStage | null;
  /** Empty when no one reviewed it. */
  readonly reviewerId: string;
  readonly nextStep: string;
  readonly caseSize: string;
}

export const EMPTY_MET: MetDraft = { stageAfter: null, reviewerId: '', nextStep: '', caseSize: '' };

/** The draft of a met appointment as recorded, for the edit dialog (6f). */
export const metDraftOf = (a: AppointmentRecord): MetDraft => ({
  stageAfter: a.stageAfter,
  reviewerId: a.outcomeReviewerId ?? '',
  nextStep: a.nextStep ?? '',
  caseSize: a.expectedCaseSize === null ? '' : formatVnd(a.expectedCaseSize),
});

/**
 * Stage after, reviewer (D9), next step and case size of a met meeting. `from` is the stage the
 * meeting started at; `stageLocked` shows the stage after without letting it change (D7).
 */
export function MetFields({
  draft,
  onChange,
  from,
  date,
  people,
  errors,
  stageLocked = false,
}: {
  draft: MetDraft;
  /** The new draft and the field that changed, so its error can go. */
  onChange: (draft: MetDraft, field: keyof MetDraft) => void;
  from: CustomerStage;
  date: AppointmentRecord['date'];
  people: readonly Person[];
  errors: readonly OutcomeError[];
  stageLocked?: boolean;
}) {
  const set =
    <K extends keyof MetDraft>(field: K) =>
    (value: MetDraft[K]) =>
      onChange({ ...draft, [field]: value }, field);
  const size = draft.caseSize.trim() === '' ? null : parseVnd(draft.caseSize);
  const { stageAfter } = draft;
  return (
    <>
      {stageLocked && stageAfter ? (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{t('outcome.stageAfter')}</span>
          <p className={LOCKED}>
            {badge(stageAfter)} {t('outcomeEdit.lockMark')}
          </p>
        </div>
      ) : (
        <>
          <Choices
            label={t('outcome.stageAfter')}
            value={stageAfter}
            onChange={set('stageAfter')}
            options={stageAfterChoices(from).map((choice) => ({
              value: choice.stage,
              disabled: !choice.allowed,
              label: (
                <>
                  {badge(choice.stage)}
                  {choice.current && ` ${t('outcome.keep')}`}
                </>
              ),
            }))}
            required
          />
          {errors.includes('stageAfter') && (
            <p className={FIELD_ERROR}>{t('outcome.stageAfterRequired')}</p>
          )}
          {stageAfter && <StageRead from={from} to={stageAfter} date={date} />}
        </>
      )}
      <SelectField
        label={t('outcome.reviewer')}
        value={draft.reviewerId}
        options={people.map((person) => ({ value: person.id, label: personLabel(person) }))}
        placeholder={t('outcome.reviewerNone')}
        onChange={set('reviewerId')}
      />
      <span className="-mt-2 text-xs text-fg-3">{t('outcome.reviewerHelp')}</span>
      <TextField
        label={t('outcome.nextStep')}
        value={draft.nextStep}
        onChange={set('nextStep')}
        error={errors.includes('nextStep') ? t('outcome.nextStepRequired') : undefined}
        required
      />
      <TextField
        label={t('outcome.caseSize')}
        value={draft.caseSize}
        onChange={set('caseSize')}
        error={
          size && !size.ok
            ? t(`money.error.${size.error}`)
            : size && size.amount <= 0
              ? t('outcome.caseSizePositive')
              : undefined
        }
        hint={
          size?.ok && size.amount > 0
            ? t('outcome.caseSizeRead', {
                amount: formatVnd(size.amount),
                compact: formatVndCompact(size.amount),
              })
            : undefined
        }
      />
    </>
  );
}

/** Under the stage after: `N2 → N1 ngày 14/09/2026 · không tính RF`, or that it stays (6c). */
function StageRead({
  from,
  to,
  date,
}: {
  from: CustomerStage;
  to: CustomerStage;
  date: AppointmentRecord['date'];
}) {
  if (from === to) return <p className="m-0 text-sm text-fg-2">{t('outcome.keepRead')}</p>;
  const rf = isRfTransition(from, to);
  return (
    <p className="m-0 flex flex-wrap items-center gap-1.5 text-sm tabular-nums">
      {badge(from)} {t('sep.arrow')} {badge(to)} {t('outcome.moveOn', { date: formatDate(date) })}{' '}
      <span className={rf ? 'text-accent' : 'text-fg-3'}>
        {t('sep.dot')} {t(rf ? 'outcome.rf' : 'outcome.noRf')}
      </span>
    </p>
  );
}
