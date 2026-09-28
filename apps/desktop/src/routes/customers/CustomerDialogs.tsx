import { useState } from 'react';
import {
  changeStageManually,
  createCustomer,
  listPeople,
  listTeams,
  updateCustomerProfile,
  type CustomerRecord,
  type Database,
  type Gender,
} from '@p2c/db';
import {
  CLOSED_STAGES,
  PIPELINE_STAGES,
  formatDate,
  type CalendarDate,
  type CustomerStage,
  type PipelineStage,
} from '@p2c/domain';
import { Button, Choices, Dialog, SelectField, StageBadge, TextField } from '@p2c/ui';
import { useAppData, useQuery } from '../../data/AppDataContext';
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

const ALERT = 'm-0 rounded-md border px-3 py-2';

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

/**
 * A quick date field defaulting to today, showing the day it understood (mockup `.read`); a day
 * after today is refused.
 */
export function useDateField(today: CalendarDate) {
  const [text, setText] = useState(formatDate(today));
  const parsed = parseRecordDate(text, today);
  return {
    text,
    setText,
    parsed,
    hint: parsed.ok ? formatDate(parsed.date) : undefined,
    error: parsed.ok ? undefined : t(`date.error.${parsed.error}`),
  };
}

/** Mockup 5a–5c: a new customer (`customer` omitted), or the profile of one. */
export function CustomerFormDialog({
  customer,
  onClose,
}: {
  customer?: CustomerRecord;
  onClose: () => void;
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
  const edit =
    <T,>(field: Field, set: (value: T) => void) =>
    (value: T) => {
      set(value);
      setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
    };

  const birth = parseBirthDate(birthText, today);
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
    // Typed Vietnamese may arrive decomposed; stored names are NFC (review R4).
    const clean = name.normalize('NFC').trim();
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
      gender: gender === 'UNKNOWN' ? null : gender,
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
        <Actions
          onClose={onClose}
          save={t(customer ? 'customerForm.save' : 'customerForm.create')}
        />
      }
    >
      {errors.form && (
        <p role="alert" className={`${ALERT} border-danger text-danger`}>
          {errors.form}
        </p>
      )}
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
        required
      />
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
      <p className="m-0 text-xs text-fg-3">{t('customerForm.kycNote')}</p>
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
      setErrors({ form: errorMessage(failure, { date: formatDate(since) }) });
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
      {(errors.form ?? errors.stage) && (
        <p role="alert" className={`${ALERT} border-danger text-danger`}>
          {errors.form ?? errors.stage}
        </p>
      )}
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
          {t('stageForm.after')} {badge(customer.stage)} → {badge(to)}
        </p>
      )}
    </Dialog>
  );
}
