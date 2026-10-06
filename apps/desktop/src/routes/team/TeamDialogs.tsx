import { useState } from 'react';
import { createTeam, renameTeam, softDeleteTeam } from '@p2c/db';
import type { Team } from '@p2c/domain';
import { Button, Dialog, TextField } from '@p2c/ui';
import { useAppData } from '../../data/AppDataContext';
import { errorMessage, t } from '../../i18n';

/** Mockup 9c: a new team (`team` omitted) or a new name; a refused name stays in the dialog. */
export function TeamNameDialog({
  team,
  onClose,
  onSaved,
}: {
  team?: Team;
  onClose: () => void;
  onSaved: (team: Team) => void;
}) {
  const data = useAppData();
  const [name, setName] = useState(team?.name ?? '');
  const [error, setError] = useState<string>();

  const save = () => {
    try {
      onSaved(data.run((db) => (team ? renameTeam(db, team.id, name) : createTeam(db, { name }))));
    } catch (failure) {
      setError(errorMessage(failure, { name: name.trim() }));
    }
  };

  return (
    <Dialog
      title={t(team ? 'team.rename' : 'team.new')}
      onClose={onClose}
      onSubmit={save}
      actions={
        <>
          <Button onClick={onClose}>{t('team.cancel')}</Button>
          <Button type="submit" variant="primary">
            {t(team ? 'team.save' : 'team.create')}
          </Button>
        </>
      }
    >
      <TextField
        label={t('team.nameLabel')}
        value={name}
        onChange={(value) => {
          setName(value);
          setError(undefined);
        }}
        error={error}
        required
        autoFocus
      />
    </Dialog>
  );
}

/** Soft-deletes a team; one that still has people is refused with the reason. */
export function DeleteTeamDialog({ team, onClose }: { team: Team; onClose: () => void }) {
  const data = useAppData();
  const [error, setError] = useState<string>();

  const remove = () => {
    try {
      data.run((db) => softDeleteTeam(db, team.id));
      onClose();
    } catch (failure) {
      setError(errorMessage(failure));
    }
  };

  return (
    <Dialog
      title={t('team.deleteTitle', { name: team.name })}
      onClose={onClose}
      onSubmit={remove}
      actions={
        <>
          <Button onClick={onClose}>{t('team.close')}</Button>
          <Button type="submit" variant="danger" disabled={error !== undefined}>
            {t('team.deleteConfirm')}
          </Button>
        </>
      }
    >
      <p className="m-0">{t('team.deleteBody')}</p>
      {error && (
        <p role="alert" className="m-0 text-danger">
          {error}
        </p>
      )}
    </Dialog>
  );
}
