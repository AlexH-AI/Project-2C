import { byName, type Person, type Scope, type Team } from '@p2c/domain';
import { joinParts } from '../i18n';

/** What the "Góc nhìn" picker holds: the kind, and the team or RM picked for it. */
export interface ScopeChoice {
  readonly kind: Scope['kind'];
  readonly id?: string;
  /** The RM picked within the team on Customers and Appointments; another kind or team drops it. */
  readonly rmInTeam?: string;
}

/**
 * The scope the screens filter by. A team or RM that no longer exists (deleted, data reloaded)
 * falls back to the first one; with none to pick, everyone is shown.
 */
export function resolveScope(
  choice: ScopeChoice,
  teams: readonly Team[],
  people: readonly Person[],
): Scope {
  if (choice.kind === 'team') {
    const team = teams.find((t) => t.id === choice.id) ?? teams[0];
    return team ? { kind: 'team', teamId: team.id } : { kind: 'all' };
  }
  if (choice.kind === 'rm') {
    const reps = rmOptions(people, teams);
    const rm = reps.find((option) => option.value === choice.id) ?? reps[0];
    return rm ? { kind: 'rm', rmId: rm.value } : { kind: 'all' };
  }
  return { kind: 'all' };
}

/**
 * A click on a kind of scope. The kind already chosen keeps its team or RM; compare with the
 * choice, not the resolved scope, which shows everyone while there is no team or RM to pick.
 */
export function chooseKind(choice: ScopeChoice, kind: Scope['kind']): ScopeChoice {
  return kind === choice.kind ? choice : { kind };
}

/**
 * The scope the screens filter by once an RM is picked within the team. An RM no longer in the
 * team (moved, deleted) counts as none picked.
 */
export function narrowScope(
  scope: Scope,
  rmInTeam: string | undefined,
  people: readonly Person[],
): Scope {
  if (scope.kind !== 'team' || rmInTeam === undefined) return scope;
  const rm = teamRms(people, scope.teamId).find((person) => person.id === rmInTeam);
  return rm ? { kind: 'rm', rmId: rm.id } : scope;
}

/** The RM of one team, by name, as the RM strip of Customers and Appointments lists them. */
export function teamRms(people: readonly Person[], teamId: string): Person[] {
  return people
    .filter((person) => person.role === 'RM' && person.teamId === teamId)
    .sort((a, b) => byName(a.name, b.name));
}

/** The RM a scope or a customer can be given, as "Name · Team", ordered by team, then by name. */
export function rmOptions(
  people: readonly Person[],
  teams: readonly Team[],
): { value: string; label: string }[] {
  return people
    .filter((person) => person.role === 'RM')
    .map((rm) => ({ rm, team: teams.find((team) => team.id === rm.teamId)?.name ?? '' }))
    .sort((a, b) => byName(a.team, b.team) || byName(a.rm.name, b.rm.name))
    .map(({ rm, team }) => ({
      value: rm.id,
      label: joinParts([rm.name, team]),
    }));
}
