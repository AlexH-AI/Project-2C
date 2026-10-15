import { useCallback, useState, type ReactNode } from 'react';
import {
  changeStageManually,
  countCustomerRecords,
  createCustomer,
  DbError,
  listPeople,
  listTeams,
  previewCustomerProfile,
  previewHandover,
  softDeleteCustomer,
  updateCustomerProfile,
  type BirthDate,
  type CustomerRecord,
  type Database,
  type Gender,
  type ProfileKycPreview,
} from '@p2c/db';
import {
  CLOSED_STAGES,
  PIPELINE_STAGES,
  formatCount,
  formatDate,
  weekdayOf,
  type CalendarDate,
  type CustomerStage,
  type PipelineStage,
} from '@p2c/domain';
import { Button, Choices, Dialog, SelectField, StageBadge, TextField } from '@p2c/ui';
import { useAppData, useDatabase, useQuery } from '../../data/AppDataContext';
import { errorMessage, t } from '../../i18n';
import { reOptions } from '../../shell/scope';
import {
  ageOn,
  allowedStages,
  birthLabel,
  parseBirthDate,
  parseRecordDate,
} from './customers-view';

type Field = 'name' | 're' | 'birth' | 'date' | 'stage' | 'form';
type Errors = Partial<Record<Field, string>>;

const readRes = (db: Database) => reOptions(listPeople(db), listTeams(db));

const badge = (stage: CustomerStage) => <StageBadge stage={stage} label={t(`stage.${stage}`)} />;

export const ALERT = 'm-0 rounded-md border px-3 py-2';

export function Actions({ onClose, save }: { onClose: () => void; save: string }) {
  return (
    <>
      <Button onClick={onClose}>{t('customerForm.cancel')}</Button>
      <Button type="submit" variant="primary">
        {save}
      </Button>
    </>
  );
}

/** A day as read back under a date field, e.g. "Thứ Năm 24/09/2026" (mockups 5a, 8a). */
export const dayRead = (date: CalendarDate) =>
  t('date.read', { weekday: t(`weekdayLong.${weekdayOf(date)}`), date: formatDate(date) });

/**
 * A quick date field defaulting to today (or `initial`), showing the day it understood (mockup
 * `.read`); a day after today is refused.
 */
export function useDateField(today: CalendarDate, initial: CalendarDate = today) {
  const [text, setText] = useState(formatDate(initial));
  const parsed = parseRecordDate(text, today);
  return {
    text,
    setText,
    parsed,
    hint: parsed.ok ? dayRead(parsed.date) : undefined,
    error: parsed.ok ? undefined : t(`date.error.${parsed.error}`),
  };
}

/** Mockup 5b: how many fields to fix, above the form; each error stays under its field. */
export function InvalidAlert({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <p role="alert" className={`${ALERT} flex flex-col border-danger`}>
      <b className="text-danger">{t('form.invalid', { count })}</b>
      <span className="text-fg-3">{t('form.nothingSaved')}</span>
    </p>
  );
}

/** The red box a dialog shows when saving failed or its form cannot be read. */
export function FailureAlert({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className={`${ALERT} border-danger text-danger`}>
      {children}
    </p>
  );
}

/**
 * The failure of a dialog's last save, shown in a `FailureAlert` until a field changes: `edit`
 * wraps a field's setter so that typing clears it.
 */
export function useSaveFailure() {
  const [failure, setFailure] = useState<string>();
  const edit =
    <T,>(set: (value: T) => void) =>
    (value: T) => {
      set(value);
      setFailure(undefined);
    };
  return { failure, setFailure, edit };
}

/**
 * Mockup 5c: what saving the profile records in KYC, worked out by the same code that records it;
 * null when it records nothing or the birth date / gender cannot be saved as typed.
 */
function useKycPreview(
  customer: CustomerRecord | undefined,
  birthDate: BirthDate | null | undefined,
  gender: Gender | null,
): ProfileKycPreview | null {
  const db = useDatabase();
  if (!customer || birthDate === undefined) return null;
  try {
    return previewCustomerProfile(db, customer.id, { birthDate, gender });
  } catch (error) {
    // Clearing a birth date or gender, or a date out of range: saving reports it.
    if (error instanceof DbError || error instanceof RangeError) return null;
    throw error;
  }
}

/** Mockup 5c: how many planned appointments saving hands over to the RE picked (T-233). */
function useHandover(customer: CustomerRecord | undefined, reId: string): number {
  const db = useDatabase();
  if (!customer || !reId) return 0;
  try {
    return previewHandover(db, customer.id, reId);
  } catch (error) {
    // The customer deleted from this dialog (5f) is read once more before it closes.
    if (error instanceof DbError) return 0;
    throw error;
  }
}

function KycPreview({ preview }: { preview: ProfileKycPreview }) {
  const chip = 'rounded border border-border px-1 font-mono text-xs';
  return (
    <div role="status" className={`${ALERT} border-info`}>
      <b className="block">{t('customerForm.kycTitle')}</b>
      {t('customerForm.kycSource')} <span className={chip}>{t('customerForm.kycSystem')}</span>{' '}
      {t('customerForm.kycFacts', { note: preview.note })}{' '}
      {preview.facts.map(({ field, value }) => (
        <span key={field} className={`${chip} mr-1`}>
          {`${field} = ${String(value)}`}
        </span>
      ))}
      {t(preview.newVersion ? 'customerForm.kycNewVersion' : 'customerForm.kycSameVersion')}
    </div>
  );
}

/**
 * Mockup 5a–5c: a new customer (`customer` omitted), or the profile of one, which "Xóa KH…" deletes
 * (5f) before `onDeleted`.
 */
export function CustomerFormDialog({
  customer,
  onClose,
  onDeleted,
}: {
  customer?: CustomerRecord;
  onClose: () => void;
  onDeleted?: () => void;
}) {
  const data = useAppData();
  const today = data.today();
  const res = useQuery(readRes);
  const [name, setName] = useState(customer?.name ?? '');
  const [reId, setReId] = useState(customer?.reId ?? '');
  const [birthText, setBirthText] = useState(
    customer?.birthDate ? birthLabel(customer.birthDate) : '',
  );
  const [gender, setGender] = useState<Gender | 'UNKNOWN'>(customer?.gender ?? 'UNKNOWN');
  const [stage, setStage] = useState<PipelineStage>('N4');
  const date = useDateField(today);
  const [errors, setErrors] = useState<Errors>({});
  const [deleting, setDeleting] = useState(false);
  const edit =
    <T,>(field: Field, set: (value: T) => void) =>
    (value: T) => {
      set(value);
      setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
    };

  const birth = parseBirthDate(birthText, today);
  const profileGender = gender === 'UNKNOWN' ? null : gender;
  const kyc = useKycPreview(customer, birth.ok ? birth.birth : undefined, profileGender);
  const handover = useHandover(customer, reId);
  const invalid = (['name', 're', 'birth', 'date'] as const).filter((f) => errors[f]).length;
  const birthHint =
    birth.ok && birth.birth
      ? 'month' in birth.birth
        ? t('customerForm.birthFull', {
            date: birthLabel(birth.birth),
            age: ageOn(birth.birth, today),
          })
        : t('customerForm.birthYear', {
            year: birth.birth.year,
            age: ageOn(birth.birth, today),
            now: today.year,
          })
      : undefined;

  const save = () => {
    // The command stores the name composed (NFC) and trimmed (DR-49).
    const clean = name.trim();
    const found: Errors = {};
    if (!clean) found.name = t('error.NAME_REQUIRED');
    if (!reId) found.re = t('error.RE_REQUIRED');
    if (!birth.ok) found.birth = t(`birth.error.${birth.error}`);
    if (!customer && !date.parsed.ok) found.date = date.error;
    setErrors(found);
    if (Object.keys(found).length > 0 || !birth.ok) return;
    const profile = {
      name: clean,
      reId,
      birthDate: birth.birth,
      gender: profileGender,
    };
    try {
      data.run((db) =>
        customer
          ? updateCustomerProfile(db, customer.id, profile)
          : createCustomer(db, {
              ...profile,
              stage,
              date: date.parsed.ok ? date.parsed.date : today,
            }),
      );
      onClose();
    } catch (failure) {
      setErrors({ form: errorMessage(failure) });
    }
  };

  if (deleting && customer) {
    return (
      <DeleteCustomerDialog
        customer={customer}
        onClose={() => setDeleting(false)}
        onDeleted={onDeleted ?? onClose}
      />
    );
  }

  return (
    <Dialog
      title={
        customer ? t('customerForm.editTitle', { name: customer.name }) : t('customerForm.newTitle')
      }
      subtitle={
        customer
          ? t('customerForm.editSub', { code: customer.code, stage: t(`stage.${customer.stage}`) })
          : t('customerForm.newSub')
      }
      onClose={onClose}
      onSubmit={save}
      actions={
        <>
          {customer && (
            <Button className="mr-auto" onClick={() => setDeleting(true)}>
              {t('customerForm.delete')}
            </Button>
          )}
          <Actions
            onClose={onClose}
            save={t(customer ? 'customerForm.save' : 'customerForm.create')}
          />
        </>
      }
    >
      {errors.form && <FailureAlert>{errors.form}</FailureAlert>}
      <InvalidAlert count={invalid} />
      <TextField
        label={t('customerForm.name')}
        value={name}
        onChange={edit('name', setName)}
        error={errors.name}
        required
        autoFocus
      />
      <SelectField
        label={t('customerForm.re')}
        value={reId}
        options={res}
        placeholder={t('customerForm.rePick')}
        onChange={edit('re', setReId)}
        error={errors.re}
        help={customer ? t('customerForm.reHelp') : undefined}
        required
      />
      {handover > 0 && (
        <p role="status" className={`${ALERT} border-info`}>
          {t('customerForm.handover', { count: formatCount(handover) })}
        </p>
      )}
      <TextField
        label={t('customerForm.birth')}
        value={birthText}
        onChange={edit('birth', setBirthText)}
        error={errors.birth}
        hint={birthHint}
      />
      <Choices
        label={t('customerForm.gender')}
        value={gender}
        onChange={setGender}
        options={[
          { value: 'MALE', label: t('gender.MALE') },
          { value: 'FEMALE', label: t('gender.FEMALE') },
          { value: 'UNKNOWN', label: t('customerForm.genderUnknown') },
        ]}
      />
      {!customer && (
        <>
          <Choices
            label={t('customerForm.stage')}
            value={stage}
            onChange={setStage}
            options={PIPELINE_STAGES.map((s) => ({ value: s, label: badge(s) }))}
            help={t('customerForm.stageHelp')}
            required
          />
          <TextField
            label={t('customerForm.date')}
            value={date.text}
            onChange={edit('date', date.setText)}
            error={errors.date}
            hint={date.hint}
            required
          />
        </>
      )}
      {kyc && <KycPreview preview={kyc} />}
      {!customer && <p className="m-0 text-xs text-fg-3">{t('customerForm.kycNote')}</p>}
    </Dialog>
  );
}

/**
 * Mockup 5f (trash.html 11f): the records the deletion hides, those of the customer not deleted on
 * their own, which restoring it brings back (TR-4). The deletion is soft (D4).
 */
function DeleteCustomerDialog({
  customer,
  onClose,
  onDeleted,
}: {
  customer: CustomerRecord;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const app = useAppData();
  const counts = useQuery(
    useCallback((db: Database) => countCustomerRecords(db, customer.id), [customer.id]),
  );
  const [failure, setFailure] = useState<string>();
  const remove = () => {
    try {
      app.run((db) => softDeleteCustomer(db, customer.id));
      onDeleted();
    } catch (error) {
      setFailure(errorMessage(error));
    }
  };
  const facts = [
    [
      t('customerDelete.appointments'),
      t('customerDelete.appointmentCounts', {
        total: counts.appointments,
        met: counts.met,
        n: counts.rf,
      }),
    ],
    [t('customerDelete.policies'), formatCount(counts.policies)],
    [t('customerDelete.kyc'), t('customerDelete.kycKept', { count: counts.kycNotes })],
  ] as const;
  return (
    <Dialog
      title={t('customerDelete.title', { name: customer.name })}
      subtitle={customer.code}
      onClose={onClose}
      onSubmit={remove}
      actions={
        <>
          <Button onClick={onClose}>{t('customerForm.cancel')}</Button>
          <Button type="submit" variant="danger">
            {t('customerDelete.confirm')}
          </Button>
        </>
      }
    >
      {failure && <FailureAlert>{failure}</FailureAlert>}
      <p className="m-0 text-fg-2">{t('customerDelete.body')}</p>
      <dl className="m-0 flex flex-col gap-1.5 tabular-nums">
        {facts.map(([term, value]) => (
          <div key={term} className="flex gap-3">
            <dt className="w-24 shrink-0 text-fg-3">{term}</dt>
            <dd className="m-0">{value}</dd>
          </div>
        ))}
      </dl>
      <p className={`${ALERT} border-info`}>{t('customerDelete.soft')}</p>
    </Dialog>
  );
}

/** Mockup 5d–5e: a manual stage change, which never counts as an RF. */
export function ChangeStageDialog({
  customer,
  since,
  onClose,
}: {
  customer: CustomerRecord;
  since: CalendarDate;
  onClose: () => void;
}) {
  const data = useAppData();
  const allowed = allowedStages(customer.stage);
  const closed = (CLOSED_STAGES as readonly string[]).includes(customer.stage);
  const [to, setTo] = useState<CustomerStage | null>(null);
  const date = useDateField(data.today());
  const [errors, setErrors] = useState<Errors>({});

  const save = () => {
    if (!to || !date.parsed.ok) {
      setErrors({ stage: to ? undefined : t('stageForm.pick'), date: date.error });
      return;
    }
    const change = { to, date: date.parsed.date };
    try {
      data.run((db) => changeStageManually(db, customer.id, change));
      onClose();
    } catch (failure) {
      setErrors({ form: errorMessage(failure) });
    }
  };

  const mark = (stage: CustomerStage) =>
    stage === customer.stage
      ? t('stageForm.current')
      : closed && stage === 'N3'
        ? t('stageForm.reopen')
        : '';

  return (
    <Dialog
      title={t('stageForm.title', { name: customer.name })}
      subtitle={t('stageForm.sub', {
        code: customer.code,
        stage: t(`stage.${customer.stage}`),
        date: formatDate(since),
      })}
      onClose={onClose}
      onSubmit={save}
      actions={<Actions onClose={onClose} save={t('stageForm.save')} />}
    >
      {(errors.form ?? errors.stage) && <FailureAlert>{errors.form ?? errors.stage}</FailureAlert>}
      <Choices
        label={t('stageForm.to')}
        value={to}
        onChange={(stage) => {
          setTo(stage);
          setErrors({});
        }}
        options={[...PIPELINE_STAGES, ...CLOSED_STAGES].map((s) => ({
          value: s,
          disabled: !allowed.includes(s),
          label: (
            <>
              {badge(s)}
              {mark(s) && ` ${mark(s)}`}
            </>
          ),
        }))}
        help={closed ? t('stageForm.closedHelp') : undefined}
        required
      />
      <TextField
        label={t('stageForm.date')}
        value={date.text}
        onChange={(value) => {
          date.setText(value);
          setErrors({});
        }}
        error={errors.date}
        hint={date.hint}
        required
      />
      <p className={`${ALERT} border-warn`}>
        <b className="block">{t('stageForm.noRfTitle')}</b>
        {t('stageForm.noRfBody')}
      </p>
      {to && (
        <p className="m-0 flex items-center gap-1.5">
          {t('stageForm.after')} {badge(customer.stage)} {t('sep.arrow')} {badge(to)}
        </p>
      )}
    </Dialog>
  );
}
