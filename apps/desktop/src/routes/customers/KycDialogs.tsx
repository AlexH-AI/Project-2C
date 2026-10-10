import type { ExtractedFact } from '@p2c/ai';
import { useState } from 'react';
import {
  confirmKycFact,
  markKycConflict,
  normalizeKycValue,
  recordKycNote,
  resolveKycConflict,
  type CustomerRecord,
  type KycNoteFact,
  type KycNoteRecord,
  type KycProfileRecord,
  type KycVersionRecord,
} from '@p2c/db';
import {
  currentFacts,
  evaluateKycGate,
  formatDate,
  KYC_FIELDS,
  resolveConflict,
  type CalendarDate,
  type KycFact,
  type KycField,
} from '@p2c/domain';
import { Button, Choices, Dialog, SelectField, TextField } from '@p2c/ui';
import { useAppData } from '../../data/AppDataContext';
import { errorMessage, joinParts, t } from '../../i18n';
import { Actions, ALERT, FailureAlert, useDateField } from './CustomerDialogs';
import { BADGE, YES_NO } from './CustomerKyc';
import {
  factText,
  nextVersionNumber,
  previewKycNote,
  resolveKycOptions,
  type KycNotePreview,
} from './kyc-view';

/** Birth year and gender are set in the customer profile only (D2). */
const NOTE_FIELDS = (Object.keys(KYC_FIELDS) as KycField[]).filter(
  (field) => !KYC_FIELDS[field].fromProfile,
);
const FIELD_OPTIONS = NOTE_FIELDS.map((field) => ({ value: field, label: t(`kycField.${field}`) }));

function Material({
  auto,
  value,
  onChange,
}: {
  auto: boolean;
  value: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={auto || value}
        disabled={auto}
        onChange={(event) => onChange(event.target.checked)}
        className="accent-accent"
      />
      {t(auto ? 'kycNote.autoMaterial' : 'kycNote.manualMaterial')}
    </label>
  );
}

/** Mockup 7a "Sau khi lưu": the version the save records, material or not. */
function NextVersion({
  preview,
  material,
  onMaterial,
}: {
  preview: Extract<KycNotePreview, { kind: 'version' }>;
  material: boolean;
  onMaterial: (on: boolean) => void;
}) {
  return (
    <div className={`${ALERT} flex flex-col gap-1 border-ok`}>
      <b>
        {t('kycNote.after', { number: preview.number })}
        {preview.material && ` ${t('sep.dot')} ${t('timeline.material')}`}
      </b>
      <Material auto={preview.auto} value={material} onChange={onMaterial} />
    </div>
  );
}

type FactMode = 'update' | 'conflict';

/** Mockup 7b, 7c: what the trường holds, the value, and update or conflict when it holds one. */
function FactValue({
  field,
  has,
  value,
  onText,
  onAnswer,
  onMode,
  hint,
}: {
  field: KycField;
  has: readonly KycFact[];
  value: { readonly text: string; readonly answer: 'yes' | 'no' | null; readonly mode: FactMode };
  onText: (text: string) => void;
  onAnswer: (answer: 'yes' | 'no') => void;
  onMode: (mode: FactMode) => void;
  hint?: string;
}) {
  return (
    <>
      {has.length > 0 && (
        <p className="m-0 text-xs text-warn tabular-nums">
          {t('kycNote.current', {
            values: has
              .map((fact) => `${factText(fact.value, YES_NO)} (${formatDate(fact.confirmedDate)})`)
              .join('; '),
          })}
        </p>
      )}
      {field === 'hasProtection' ? (
        <Choices
          label={t('kycNote.value')}
          value={value.answer}
          onChange={onAnswer}
          options={[
            { value: 'yes', label: YES_NO.yes },
            { value: 'no', label: YES_NO.no },
          ]}
          help={hint}
        />
      ) : (
        <TextField label={t('kycNote.value')} value={value.text} onChange={onText} hint={hint} />
      )}
      {has.length > 0 && (
        <Choices
          label={t('kycNote.mode')}
          value={value.mode}
          onChange={onMode}
          options={[
            { value: 'update', label: t('kycNote.update') },
            { value: 'conflict', label: t('kycNote.conflict') },
          ]}
          help={t('kycNote.modeHelp')}
        />
      )}
    </>
  );
}

/**
 * Mockup 7a–7c, 7e: a new KYC note and the facts confirmed from it, saved as one version. Opened
 * from a meeting's outcome (6c), it starts from the meeting's note and day.
 */
export function KycNoteDialog({
  customer,
  profile,
  versions,
  initialText = '',
  initialDate,
  onClose,
}: {
  customer: CustomerRecord;
  profile: KycProfileRecord;
  versions: readonly KycVersionRecord[];
  initialText?: string;
  initialDate?: CalendarDate;
  onClose: () => void;
}) {
  const data = useAppData();
  const today = data.today();
  const [text, setText] = useState(initialText);
  const date = useDateField(today, initialDate);
  const [facts, setFacts] = useState<KycNoteFact[]>([]);
  const [field, setField] = useState<KycField | ''>('');
  const [value, setValue] = useState('');
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);
  const [mode, setMode] = useState<FactMode>('update');
  const [material, setMaterial] = useState(false);
  const [errors, setErrors] = useState<{ text?: string; fact?: string; form?: string }>({});

  const day = date.parsed.ok ? date.parsed.date : today;
  const preview = previewKycNote(profile, versions, facts, day, material);
  const has = field ? currentFacts(profile, field) : [];
  const boolean = field === 'hasProtection';
  const last = versions.at(-1);

  /** Picks a trường afresh: nothing typed or chosen for another one carries over (DR-21). */
  const pick = (next: KycField | '') => {
    setField(next);
    setValue('');
    setAnswer(null);
    setMode('update');
    setErrors({});
  };

  const add = () => {
    if (!field) return setErrors({ fact: t('kycNote.error.field') });
    if (boolean ? answer === null : value.trim() === '') {
      return setErrors({ fact: t('kycNote.error.value') });
    }
    const raw = boolean ? answer === 'yes' : value;
    let fact: KycNoteFact;
    try {
      fact = {
        field,
        value: normalizeKycValue(field, raw),
        conflict: has.length > 0 && mode === 'conflict',
      };
    } catch (failure) {
      return setErrors({ fact: errorMessage(failure) });
    }
    // A second fact on one trường replaces the first.
    const next = [...facts.filter((f) => f.field !== field), fact];
    if (previewKycNote(profile, versions, next, day, false).kind === 'refused') {
      return setErrors({ fact: t('kycNote.error.refused', { field: t(`kycField.${field}`) }) });
    }
    setFacts(next);
    pick('');
  };

  const save = () => {
    const clean = text.trim();
    // A fact picked but not added yet would be lost: the note cannot be edited after saving.
    const pending = field ? t('kycNote.error.pending') : undefined;
    if (!clean || !date.parsed.ok || pending) {
      setErrors({ text: clean ? undefined : t('error.KYC_NOTE_EMPTY'), fact: pending });
      return;
    }
    const command = { text: clean, date: date.parsed.date, facts, material };
    try {
      data.run((db) => recordKycNote(db, customer.id, command));
      onClose();
    } catch (failure) {
      setErrors({ form: errorMessage(failure) });
    }
  };

  return (
    <Dialog
      title={t('kycNote.title', { name: customer.name })}
      subtitle={
        last
          ? t('kycNote.sub', {
              code: customer.code,
              version: last.seq,
              date: formatDate(last.date),
            })
          : t('kycNote.subNoVersion', { code: customer.code })
      }
      onClose={onClose}
      onSubmit={save}
      actions={<Actions onClose={onClose} save={t('kycNote.save')} />}
    >
      {errors.form && <FailureAlert>{errors.form}</FailureAlert>}
      <TextField
        label={t('kycNote.text')}
        value={text}
        onChange={(next) => {
          setText(next);
          setErrors((prev) => ({ ...prev, text: undefined }));
        }}
        error={errors.text}
        hint={t('kycNote.textHelp')}
        rows={3}
        required
        autoFocus
      />
      <TextField
        label={t('kycNote.date')}
        value={date.text}
        onChange={date.setText}
        error={date.error}
        hint={date.hint}
        required
      />
      <div className="flex flex-col gap-2 border-t border-border pt-3">
        <span id="kyc-note-facts" className="font-medium">
          {t('kycNote.facts')}
        </span>
        <span className="text-xs text-fg-3">{t('kycNote.factsHelp')}</span>
        {facts.length > 0 && (
          <ul aria-labelledby="kyc-note-facts" className="m-0 flex list-none flex-col gap-1 p-0">
            {facts.map((fact) => (
              <li
                key={fact.field}
                className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-2 py-1"
              >
                <b className="flex-1">{t(`kycField.${fact.field}`)}</b>
                <span className="flex-1">{factText(fact.value, YES_NO)}</span>
                <span className={`${BADGE} ${fact.conflict ? 'text-danger' : 'text-info'}`}>
                  {t(
                    fact.conflict
                      ? 'kycNote.badge.conflict'
                      : currentFacts(profile, fact.field).length > 0
                        ? 'kycNote.badge.update'
                        : 'kycNote.badge.new',
                  )}
                </span>
                <Button
                  aria-label={t('kycNote.removeLabel', { field: t(`kycField.${fact.field}`) })}
                  onClick={() => setFacts(facts.filter((f) => f.field !== fact.field))}
                >
                  {t('kycNote.remove')}
                </Button>
              </li>
            ))}
          </ul>
        )}
        <SelectField
          label={t('kycNote.field')}
          value={field}
          options={FIELD_OPTIONS}
          placeholder={t('kycNote.fieldPick')}
          onChange={(next) => pick(next as KycField | '')}
        />
        {field && (
          <FactValue
            field={field}
            has={has}
            value={{ text: value, answer, mode }}
            onText={setValue}
            onAnswer={setAnswer}
            onMode={setMode}
          />
        )}
        {errors.fact && (
          <p role="alert" className="m-0 text-xs text-danger">
            {errors.fact}
          </p>
        )}
        <Button className="self-start" onClick={add}>
          {t('kycNote.add')}
        </Button>
      </div>
      {preview.kind === 'version' ? (
        <NextVersion preview={preview} material={material} onMaterial={setMaterial} />
      ) : (
        <p className="m-0 text-xs text-fg-3">{t('kycNote.noVersion')}</p>
      )}
    </Dialog>
  );
}

/** Mockup 7d: keep one value of a field in conflict; the others become history. */
export function ResolveKycDialog({
  customer,
  profile,
  versions,
  field,
  onClose,
}: {
  customer: CustomerRecord;
  profile: KycProfileRecord;
  versions: readonly KycVersionRecord[];
  field: KycField;
  onClose: () => void;
}) {
  const data = useAppData();
  const [chosen, setChosen] = useState<string | null>(null);
  const [material, setMaterial] = useState(false);
  const [error, setError] = useState<string>();
  const { core, fromProfile } = KYC_FIELDS[field];
  const gate = chosen && evaluateKycGate(resolveConflict(profile, chosen).facts).state;

  const save = () => {
    if (!chosen) return setError(t('kycResolve.pick'));
    const command = { factId: chosen, date: data.today(), material };
    try {
      data.run((db) => resolveKycConflict(db, customer.id, command));
      onClose();
    } catch (failure) {
      setError(errorMessage(failure));
    }
  };

  return (
    <Dialog
      title={t('kycResolve.title', { field: t(`kycField.${field}`) })}
      subtitle={joinParts([customer.name, t(core ? 'kyc.conflict.core' : 'kyc.conflict.minor')])}
      onClose={onClose}
      onSubmit={save}
      actions={<Actions onClose={onClose} save={t('kycResolve.save')} />}
    >
      {error && <FailureAlert>{error}</FailureAlert>}
      <p className="m-0 text-fg-2">{t('kycResolve.body')}</p>
      <Choices
        label={t('kycResolve.values')}
        value={chosen}
        onChange={(id) => {
          setChosen(id);
          setError(undefined);
        }}
        options={resolveKycOptions(profile, field).map((option) => ({
          value: option.factId,
          disabled: option.disabled,
          label: (
            <span className="flex flex-col">
              <b>"{factText(option.value, YES_NO)}"</b>
              <span className="text-xs text-fg-3 tabular-nums">
                {t(option.source === 'SYSTEM' ? 'kycResolve.systemSource' : 'kycResolve.source', {
                  date: formatDate(option.confirmedDate),
                })}
              </span>
            </span>
          ),
        }))}
        help={fromProfile ? t('kycResolve.profileOnly') : undefined}
        required
      />
      <p className={`${ALERT} border-info`}>{t('kycResolve.hint')}</p>
      <Material auto={core} value={material} onChange={setMaterial} />
      {gate && (
        <p className="m-0">
          {t('kycResolve.after', { number: nextVersionNumber(versions), gate })}
        </p>
      )}
    </Dialog>
  );
}

/**
 * Mockup ai.html 3f: Xác nhận of an AI proposal (spec Phase 5 §8 item 3). The fact filled in from
 * the proposal, its value open to change, is saved on the note it came from by the commands the RE
 * uses: a new value, an update or a conflict (7c).
 */
export function ConfirmFactDialog({
  customer,
  profile,
  versions,
  note,
  proposal,
  onSaved,
  onClose,
}: {
  customer: CustomerRecord;
  profile: KycProfileRecord;
  versions: readonly KycVersionRecord[];
  note: KycNoteRecord;
  proposal: ExtractedFact;
  onSaved: () => void;
  onClose: () => void;
}) {
  const data = useAppData();
  const today = data.today();
  const { field } = proposal;
  const proposed = proposal.value;
  const [text, setText] = useState(typeof proposed === 'boolean' ? '' : String(proposed));
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(
    typeof proposed === 'boolean' ? (proposed ? 'yes' : 'no') : null,
  );
  const [mode, setMode] = useState<FactMode>('update');
  const [material, setMaterial] = useState(false);
  const [error, setError] = useState<string>();
  const has = currentFacts(profile, field);
  const value = field === 'hasProtection' ? answer === 'yes' : text;
  const conflict = has.length > 0 && mode === 'conflict';
  const preview = previewKycNote(profile, versions, [{ field, value, conflict }], today, material);

  const save = () => {
    if (field === 'hasProtection' ? answer === null : text.trim() === '') {
      return setError(t('kycNote.error.value'));
    }
    const command = { field, value, noteId: note.id, date: today, material };
    try {
      data.run((db) => (conflict ? markKycConflict : confirmKycFact)(db, customer.id, command));
      onSaved();
      onClose();
    } catch (failure) {
      setError(errorMessage(failure));
    }
  };

  return (
    <Dialog
      title={t('kycConfirm.title', { field: t(`kycField.${field}`) })}
      subtitle={t('kycConfirm.sub', { date: formatDate(note.createdDate) })}
      onClose={onClose}
      onSubmit={save}
      actions={<Actions onClose={onClose} save={t('kycConfirm.save')} />}
    >
      {error && <FailureAlert>{error}</FailureAlert>}
      <p className={`${ALERT} border-border`}>
        {t('kycConfirm.quote')} <b>{t('kycConfirm.quoted', { value: proposal.quote })}</b>
      </p>
      <FactValue
        field={field}
        has={has}
        value={{ text, answer, mode }}
        onText={setText}
        onAnswer={setAnswer}
        onMode={setMode}
        hint={t('kycConfirm.valueHelp')}
      />
      {preview.kind === 'version' && (
        <NextVersion preview={preview} material={material} onMaterial={setMaterial} />
      )}
    </Dialog>
  );
}
