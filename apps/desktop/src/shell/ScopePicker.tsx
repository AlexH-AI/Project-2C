import type { Person, Scope, Team } from '@p2c/domain';
import { Segmented, SelectField } from '@p2c/ui';
import type { Dispatch, SetStateAction } from 'react';
import { t } from '../i18n';
import { chooseKind, reOptions, type ScopeChoice } from './scope';

const KINDS = [
  { value: 'all', label: t('scope.all') },
  { value: 'team', label: t('scope.team') },
  { value: 're', label: t('scope.re') },
] as const;

/** "Góc nhìn": everyone, one team or one RE, with the team or RE picked next to it. */
export function ScopePicker({
  scope,
  teams,
  people,
  onChange,
}: {
  /** The resolved scope, so the list shows the team or RE actually used. */
  scope: Scope;
  teams: readonly Team[];
  people: readonly Person[];
  /** The state setter of the choice: a click on a kind needs the choice it replaces. */
  onChange: Dispatch<SetStateAction<ScopeChoice>>;
}) {
  return (
    <div className="flex items-center gap-2">
      <Segmented
        label={t('scope.label')}
        options={KINDS}
        size="md"
        value={scope.kind}
        onChange={(kind) => onChange((choice) => chooseKind(choice, kind))}
      />
      {scope.kind === 'team' && (
        <SelectField
          label={t('scope.pickTeam')}
          labelHidden
          size="md"
          value={scope.teamId}
          options={teams.map((team) => ({ value: team.id, label: team.name }))}
          onChange={(id) => onChange({ kind: 'team', id })}
        />
      )}
      {scope.kind === 're' && (
        <SelectField
          label={t('scope.pickRe')}
          labelHidden
          size="md"
          value={scope.reId}
          options={reOptions(people, teams)}
          onChange={(id) => onChange({ kind: 're', id })}
        />
      )}
    </div>
  );
}
