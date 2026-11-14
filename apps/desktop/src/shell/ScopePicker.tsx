import type { Person, Scope, Team } from '@p2c/domain';
import { Segmented, SelectField } from '@p2c/ui';
import type { Dispatch, SetStateAction } from 'react';
import { t } from '../i18n';
import { chooseKind, rmOptions, type ScopeChoice } from './scope';

const KINDS = [
  { value: 'all', label: t('scope.all') },
  { value: 'team', label: t('scope.team') },
  { value: 'rm', label: t('scope.rm') },
] as const;

/** "Góc nhìn": everyone, one team or one RM, with the team or RM picked next to it. */
export function ScopePicker({
  scope,
  teams,
  people,
  teamPicker = true,
  onChange,
}: {
  /** The resolved scope, so the list shows the team or RM actually used. */
  scope: Scope;
  teams: readonly Team[];
  people: readonly Person[];
  /** Whether the Team scope shows its team list; Tổng quan counts every team together. */
  teamPicker?: boolean;
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
      {/* Capped: a long name would push the top bar out of the window (DR6-170). */}
      {scope.kind === 'team' && teamPicker && (
        <SelectField
          label={t('scope.pickTeam')}
          labelHidden
          capped
          size="md"
          value={scope.teamId}
          options={teams.map((team) => ({ value: team.id, label: team.name }))}
          onChange={(id) => onChange({ kind: 'team', id })}
        />
      )}
      {scope.kind === 'rm' && (
        <SelectField
          label={t('scope.pickRm')}
          labelHidden
          capped
          size="md"
          value={scope.rmId}
          options={rmOptions(people, teams)}
          onChange={(id) => onChange({ kind: 'rm', id })}
        />
      )}
    </div>
  );
}
