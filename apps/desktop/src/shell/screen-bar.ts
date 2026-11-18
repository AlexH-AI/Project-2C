import type { Person, Scope, Team } from '@p2c/domain';
import { t } from '../i18n';

/**
 * Whose records a screen shows, for the line under its name on the toolbar (mockup app-shell.html
 * `#toolbar`: "team → RM đang xem"): everyone, a whole team, or the team and its RM. `scope` is
 * the one the screen filters by, the RM picked within a team included.
 */
export function viewingTrail(
  scope: Scope,
  teams: readonly Team[],
  people: readonly Person[],
): string {
  const teamName = (id: string | null | undefined) => teams.find((team) => team.id === id)?.name;
  if (scope.kind === 'all') return t('scope.all');
  if (scope.kind === 'team') {
    return t('appointments.viewingTeam', { team: teamName(scope.teamId) ?? '' });
  }
  const rm = people.find((person) => person.id === scope.rmId);
  const team = teamName(rm?.teamId);
  // An RM is always of a team; one whose team is gone is named alone.
  return team === undefined ? (rm?.name ?? '') : t('scope.viewingRm', { team, rm: rm?.name ?? '' });
}
