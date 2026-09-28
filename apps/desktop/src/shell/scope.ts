import type { Person, Scope, Team } from '@p2c/domain';

/** What the "Góc nhìn" picker holds: the kind, and the team or RE picked for it. */
export interface ScopeChoice {
  readonly kind: Scope['kind'];
  readonly id?: string;
}

/**
 * The scope the screens filter by. A team or RE that no longer exists (deleted, data reloaded)
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
  if (choice.kind === 're') {
    const res = people.filter((person) => person.role === 'RE');
    const re = res.find((p) => p.id === choice.id) ?? res[0];
    return re ? { kind: 're', reId: re.id } : { kind: 'all' };
  }
  return { kind: 'all' };
}

/** The RE a scope or a customer can be given, as "Name · Team", in the order of `people`. */
export function reOptions(
  people: readonly Person[],
  teams: readonly Team[],
): { value: string; label: string }[] {
  return people
    .filter((person) => person.role === 'RE')
    .map((re) => ({
      value: re.id,
      label: [re.name, teams.find((team) => team.id === re.teamId)?.name]
        .filter(Boolean)
        .join(' · '),
    }));
}
