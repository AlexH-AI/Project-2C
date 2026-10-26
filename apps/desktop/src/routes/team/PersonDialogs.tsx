import { useCallback, useState } from 'react';
import {
  createPerson,
  DbError,
  isPersonInUse,
  personUsage,
  softDeletePerson,
  updatePerson,
  type Database,
} from '@p2c/db';
import {
  PERSON_ROLES,
  ROLES_WITH_TEAM,
  type Person,
  type PersonRole,
  type Team,
} from '@p2c/domain';
import { Button, Choices, Dialog, SelectField, TextField } from '@p2c/ui';
import { useAppData, useQuery } from '../../data/AppDataContext';
import { errorMessage, t } from '../../i18n';
import { ALERT } from '../classes';
import { inUseHelp, retriesDelete } from './team-view';

const ROLE_CHOICES = PERSON_ROLES.map((role) => ({ value: role, label: role }));

/** RE and TL belong to a team; IS / BD / BDM are shared by every team (D8). The commands' rule. */
const needsTeam = (role: PersonRole) => ROLES_WITH_TEAM.includes(role);

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
  // "Xóa nhân sự" leaves the dialog for 9b, and with it the changes not saved: it asks first (issue
  // 144). Going on is a button of its own, in the question: clicked again, or twice at once, "Xóa
  // nhân sự" only asks (review of PR 841).
  const [asked, setAsked] = useState(false);
  const changed =
    person !== undefined &&
    (name !== person.name || role !== person.role || teamId !== (person.teamId ?? ''));
  const edited = () => {
    setErrors({});
    setAsked(false);
  };

  const save = () => {
    const input = { name, role, teamId: teamId || null };
    try {
      onSaved(
        data.run((db) => (person ? updatePerson(db, person.id, input) : createPerson(db, input))),
      );
    } catch (failure) {
      const code = failure instanceof DbError ? failure.code : undefined;
      const params = failure instanceof DbError ? failure.params : undefined;
      const message = errorMessage(failure, { role, ...params });
      if (code === 'NAME_REQUIRED') setErrors({ name: message });
      else if (code === 'TEAM_REQUIRED' || code === 'TEAM_NOT_FOUND' || code === 'TEAM_NOT_ALLOWED')
        setErrors({ team: message });
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
            <Button variant="danger" onClick={() => (changed ? setAsked(true) : onDelete())}>
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
          edited();
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
          edited();
          // IS / BD / BDM have no team (spec §6 rule 9); back to RE or TL, the person's own team
          // returns, or for a new one the team being viewed.
          if (!needsTeam(value)) setTeamId('');
          else if (!teamId) setTeamId(person?.teamId ?? defaultTeamId ?? '');
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
          edited();
        }}
        error={errors.team}
        required={needsTeam(role)}
      />
      <span className="text-xs text-fg-3">{t('person.help')}</span>
      {errors.form && (
        <p role="alert" className={`${ALERT} border-danger text-danger`}>
          {errors.form}
        </p>
      )}
      {asked && onDelete && (
        <div className={`${ALERT} flex flex-wrap items-center gap-2 border-warn`}>
          <span role="alert" className="min-w-0 flex-1">
            {t('person.deleteUnsaved')}
          </span>
          <Button variant="danger" onClick={onDelete}>
            {t('person.deleteDiscard')}
          </Button>
        </div>
      )}
    </Dialog>
  );
}

/**
 * Mockup 9b: soft-deletes a person. One still in use is refused up front with the counts the
 * command refuses by, those of customers in the trash included (T-250).
 */
export function DeletePersonDialog({
  person,
  teamName,
  onClose,
}: {
  person: Person;
  teamName: string;
  onClose: () => void;
}) {
  const data = useAppData();
  const usage = useQuery(useCallback((db: Database) => personUsage(db, person.id), [person.id]));
  const [error, setError] = useState<string>();
  const [final, setFinal] = useState(false);
  const inUse = isPersonInUse(usage);

  const remove = () => {
    try {
      data.run((db) => softDeletePerson(db, person.id));
      onClose();
    } catch (failure) {
      setError(errorMessage(failure));
      setFinal(!retriesDelete(failure));
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
          <Button type="submit" variant="danger" disabled={inUse || final}>
            {t('team.deleteConfirm')}
          </Button>
        </>
      }
    >
      {inUse ? (
        <>
          <div role="alert" className={`${ALERT} border-danger text-danger`}>
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
              {usage.reviewing > 0 && (
                <li>{t('person.inUseReviewing', { count: usage.reviewing })}</li>
              )}
            </ul>
          </div>
          {inUseHelp(usage).map((help) => (
            <span key={help} className="text-xs text-fg-3">
              {help}
            </span>
          ))}
        </>
      ) : (
        <p className="m-0">{t('person.deleteBody')}</p>
      )}
      {error && (
        <p role="alert" className={`${ALERT} border-danger text-danger`}>
          {error}
        </p>
      )}
    </Dialog>
  );
}
