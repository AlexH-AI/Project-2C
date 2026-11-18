import { byName, type Person, type Scope, type Team } from '@p2c/domain';
import type { MenuRow } from '@p2c/ui';
import { t } from '../i18n';
import { chooseKind, scopeName, teamRms, type ScopeChoice } from './scope';

export interface ScopeMenuOptions {
  /** Whether a team of its own can be picked; on Tổng quan the Team scope is every team (§4.3). */
  readonly teamPicker: boolean;
  /** The team whose rows show under it, if any. */
  readonly openTeam: string | null;
}

/**
 * The rows of the "Góc nhìn" menu (mockup app-shell.html `#toolbar`): everyone; then each team by
 * name with its number of RM, which opens into "Cả team" and its RM by name. Where no team of its
 * own can be picked, "Mọi team" stands for the Team scope and a team opens into its RM alone. The
 * row of the scope shown is the one checked.
 */
export function scopeMenu(
  scope: Scope,
  teams: readonly Team[],
  people: readonly Person[],
  { teamPicker, openTeam }: ScopeMenuOptions,
): MenuRow[] {
  const rows: MenuRow[] = [{ key: 'all', label: t('scope.all'), checked: scope.kind === 'all' }];
  if (!teamPicker) {
    rows.push({ key: 'teams', label: t('scope.everyTeam'), checked: scope.kind === 'team' });
  }
  [...teams]
    .sort((a, b) => byName(a.name, b.name))
    .forEach((team, index) => {
      const rms = teamRms(people, team.id);
      const expanded = team.id === openTeam;
      rows.push({
        key: `team:${team.id}`,
        label: t('scope.teamName', { name: team.name }),
        note: t('scope.rmCount', { rm: rms.length }),
        expanded,
        divided: index === 0,
      });
      if (!expanded) return;
      if (teamPicker) {
        rows.push({
          key: `whole:${team.id}`,
          label: t('rmPicker.all'),
          sub: true,
          checked: scope.kind === 'team' && scope.teamId === team.id,
        });
      }
      for (const rm of rms) {
        rows.push({
          key: `rm:${rm.id}`,
          label: rm.name,
          sub: true,
          checked: scope.kind === 'rm' && scope.rmId === rm.id,
        });
      }
    });
  return rows;
}

/** The team a team row of the menu opens, or null for any other row. */
export const teamOfRow = (key: string): string | null =>
  key.startsWith('team:') ? key.slice('team:'.length) : null;

/** The choice a row of the menu picks; null for a team row, which only opens. */
export function pickScope(key: string, choice: ScopeChoice): ScopeChoice | null {
  if (key === 'all') return { kind: 'all' };
  // The team already chosen stays, for the screens that show one.
  if (key === 'teams') return chooseKind(choice, 'team');
  if (key.startsWith('whole:')) return { kind: 'team', id: key.slice('whole:'.length) };
  if (key.startsWith('rm:')) return { kind: 'rm', id: key.slice('rm:'.length) };
  return null;
}

/** The words on the pill: everyone, the team ("Mọi team" where none can be picked), the RM alone. */
export function scopeLabel(
  scope: Scope,
  teams: readonly Team[],
  people: readonly Person[],
  teamPicker: boolean,
): string {
  if (scope.kind === 'rm') return people.find((person) => person.id === scope.rmId)?.name ?? '';
  return scope.kind === 'team' && !teamPicker
    ? t('scope.everyTeam')
    : scopeName(scope, teams, people);
}

/** The team open when the menu opens: that of the scope shown, so its checked row is in sight. */
export function openTeamOf(
  scope: Scope,
  people: readonly Person[],
  teamPicker: boolean,
): string | null {
  if (scope.kind === 'team') return teamPicker ? scope.teamId : null;
  if (scope.kind === 'rm') return people.find((person) => person.id === scope.rmId)?.teamId ?? null;
  return null;
}
