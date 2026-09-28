import type { Person, Scope, Team } from '@p2c/domain';
import { Segmented, SelectField } from '@p2c/ui';
import { t } from '../i18n';
import type { ScopeChoice } from './scope';

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
  onChange: (choice: ScopeChoice) => void;
}) {
  const teamName = (id: string | null) => teams.find((team) => team.id === id)?.name;
  const res = people
    .filter((person) => person.role === 'RE')
    .map((re) => ({
      value: re.id,
      label: [re.name, teamName(re.teamId)].filter(Boolean).join(' · '),
    }));

  return (
    <div className="flex items-center gap-2">
      <Segmented
        label={t('scope.label')}
        options={KINDS}
        value={scope.kind}
        onChange={(kind) => onChange({ kind })}
      />
      {scope.kind === 'team' && (
        <SelectField
          label={t('scope.pickTeam')}
          labelHidden
          value={scope.teamId}
          options={teams.map((team) => ({ value: team.id, label: team.name }))}
          onChange={(id) => onChange({ kind: 'team', id })}
        />
      )}
      {scope.kind === 're' && (
        <SelectField
          label={t('scope.pickRe')}
          labelHidden
          value={scope.reId}
          options={res}
          onChange={(id) => onChange({ kind: 're', id })}
        />
      )}
    </div>
  );
}
