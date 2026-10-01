import { useState } from 'react';
import { createPerson, DbError, softDeletePerson, updatePerson } from '@p2c/db';
import { PERSON_ROLES, type Person, type PersonRole, type Team } from '@p2c/domain';
import { Button, Choices, Dialog, SelectField, TextField } from '@p2c/ui';
import { useAppData } from '../../data/AppDataContext';
import { errorMessage, t } from '../../i18n';
import type { PersonUsage } from './team-view';

const ALERT = 'm-0 rounded-md border border-danger px-3 py-2 text-danger';
const ROLE_CHOICES = PERSON_ROLES.map((role) => ({ value: role, label: role }));

/** RE and TL belong to a team; IS / BD / BDM are shared by every team (D8). */
const needsTeam = (role: PersonRole) => role === 'RE' || role === 'TL';

/** Where a refused save shows its reason: on the field it is about, else above the buttons. */
type Errors = { readonly name?: string; readonly team?: string; readonly form?: string };

/** Mockup 9a: a new person (`person` omitted) or changes to one, with a way to delete them. */
export function PersonDialog({
  person,
  teams,
  defaultTeamId,
  defaultRole = 'RE',
  onClose,
  onSaved,
  onDelete,
}: {
  person?: Person;
  teams: readonly Team[];
  defaultTeamId?: string;
  defaultRole?: PersonRole;
  onClose: () => void;
  onSaved: (person: Person) => void;
  onDelete?: () => void;
}) {
  const data = useAppData();
  const [name, setName] = useState(person?.name ?? '');
  const [role, setRole] = useState<PersonRole>(person?.role ?? defaultRole);
  const [teamId, setTeamId] = useState(person ? (person.teamId ?? '') : (defaultTeamId ?? ''));
  const [errors, setErrors] = useState<Errors>({});

  const save = () => {
    // Typed Vietnamese may arrive decomposed; names are stored as NFC (review R4).
    const input = { name: name.normalize('NFC'), role, teamId: teamId || null };
    try {
      onSaved(
        data.run((db) => (person ? updatePerson(db, person.id, input) : createPerson(db, input))),
      );
    } catch (failure) {
      const code = failure instanceof DbError ? failure.code : undefined;
      const params = failure instanceof DbError ? failure.params : undefined;
      const message = errorMessage(failure, { role, ...params });
      if (code === 'NAME_REQUIRED') setErrors({ name: message });
      else if (code === 'TEAM_REQUIRED' || code === 'TEAM_NOT_FOUND') setErrors({ team: message });
      else setErrors({ form: message });
    }
  };

  return (
    <Dialog
      title={t(person ? 'person.edit' : 'person.new')}
      onClose={onClose}
      onSubmit={save}
      actions={
        <>
          {onDelete && (
            <Button variant="danger" onClick={onDelete}>
              {t('person.delete')}
            </Button>
          )}
          <span className="flex-1" />
          <Button onClick={onClose}>{t('team.cancel')}</Button>
          <Button type="submit" variant="primary">
            {t(person ? 'team.save' : 'person.create')}
          </Button>
        </>
      }
    >
      <TextField
        label={t('person.name')}
        value={name}
        onChange={(value) => {
          setName(value);
          setErrors({});
        }}
        error={errors.name}
        required
        autoFocus
      />
      <Choices
        label={t('person.role')}
        options={ROLE_CHOICES}
        value={role}
        onChange={(value) => {
          setRole(value);
          setErrors({});
          // A new person starts on the team being viewed, which only suits RE and TL.
          if (!person) {
            if (!needsTeam(value)) setTeamId('');
            else if (!teamId) setTeamId(defaultTeamId ?? '');
          }
        }}
        required
      />
      <SelectField
        label={t('person.team')}
        value={teamId}
        options={teams.map((team) => ({ value: team.id, label: team.name }))}
        placeholder={t(needsTeam(role) ? 'person.pickTeam' : 'person.noTeam')}
        onChange={(value) => {
          setTeamId(value);
          setErrors({});
        }}
        error={errors.team}
        required={needsTeam(role)}
      />
      <span className="text-xs text-fg-3">{t('person.help')}</span>
      {errors.form && (
        <p role="alert" className={ALERT}>
          {errors.form}
        </p>
      )}
    </Dialog>
  );
}

/**
 * Mockup 9b: soft-deletes a person. One the screens still show records for is refused up front
 * with the counts; records of deleted customers only show up as the command's refusal (review R1).
 */
export function DeletePersonDialog({
  person,
  teamName,
  usage,
  onClose,
}: {
  person: Person;
  teamName: string;
  usage: PersonUsage;
  onClose: () => void;
}) {
  const data = useAppData();
  const [error, setError] = useState<string>();
  const inUse = Object.values(usage).some((count) => count > 0);

  const remove = () => {
    try {
      data.run((db) => softDeletePerson(db, person.id));
      onClose();
    } catch (failure) {
      setError(errorMessage(failure));
    }
  };

  return (
    <Dialog
      title={t('person.deleteTitle', { name: person.name })}
      subtitle={t('person.deleteSub', { role: person.role, team: teamName })}
      onClose={onClose}
      onSubmit={remove}
      actions={
        <>
          <Button onClick={onClose}>{t('team.close')}</Button>
          <Button type="submit" variant="danger" disabled={inUse || error !== undefined}>
            {t('team.deleteConfirm')}
          </Button>
        </>
      }
    >
      {inUse ? (
        <>
          <div role="alert" className={ALERT}>
            <b>{t('person.inUse', { role: person.role })}</b>
            <ul className="m-0 mt-1 pl-5 tabular-nums">
              {usage.customers > 0 && (
                <li>{t('person.inUseCustomers', { count: usage.customers })}</li>
              )}
              {usage.appointments + usage.policies > 0 && (
                <li>
                  {t('person.inUseRecords', {
                    appointments: usage.appointments,
                    policies: usage.policies,
                  })}
                </li>
              )}
              {usage.coordinating > 0 && (
                <li>{t('person.inUseCoordinating', { count: usage.coordinating })}</li>
              )}
            </ul>
          </div>
          <span className="text-xs text-fg-3">{t('person.inUseHelp')}</span>
        </>
      ) : (
        <p className="m-0">{t('person.deleteBody')}</p>
      )}
      {error && (
        <p role="alert" className={ALERT}>
          {error}
        </p>
      )}
    </Dialog>
  );
}
