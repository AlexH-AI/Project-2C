import type { Person, Scope, Team } from '@p2c/domain';
import { MenuButton } from '@p2c/ui';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { t } from '../i18n';
import type { ScopeChoice } from './scope';
import { openTeamOf, pickScope, scopeLabel, scopeMenu, teamOfRow } from './scope-menu';

/**
 * "Góc nhìn" on the toolbar (mockup app-shell.html `#toolbar`): one pill naming the scope shown,
 * which opens a menu: everyone, a whole team or one RM. A choice applies at once.
 */
export function ScopePicker({
  scope,
  teams,
  people,
  teamPicker = true,
  onChange,
}: {
  /** The resolved scope, so the pill names the team or RM actually used. */
  scope: Scope;
  teams: readonly Team[];
  people: readonly Person[];
  /** Whether a team of its own can be picked; Tổng quan counts every team together. */
  teamPicker?: boolean;
  /** The state setter of the choice: "Mọi team" needs the choice it replaces. */
  onChange: Dispatch<SetStateAction<ScopeChoice>>;
}) {
  const [openTeam, setOpenTeam] = useState<string | null>(null);
  const name = scopeLabel(scope, teams, people, teamPicker);
  return (
    <MenuButton
      label={t('scope.pill', { name })}
      text={name}
      title={t('scope.label')}
      rows={scopeMenu(scope, teams, people, { teamPicker, openTeam })}
      onOpen={() => setOpenTeam(openTeamOf(scope, people, teamPicker))}
      onPick={(key) => {
        const team = teamOfRow(key);
        if (team) setOpenTeam((open) => (open === team ? null : team));
        else onChange((choice) => pickScope(key, choice) ?? choice);
      }}
    />
  );
}
