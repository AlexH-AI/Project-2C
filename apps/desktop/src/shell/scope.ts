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
    const reps = reOptions(people, teams);
    const re = reps.find((option) => option.value === choice.id) ?? reps[0];
    return re ? { kind: 're', reId: re.value } : { kind: 'all' };
  }
  return { kind: 'all' };
}

/**
 * A click on a kind of scope. The kind already chosen keeps its team or RE; compare with the
 * choice, not the resolved scope, which shows everyone while there is no team or RE to pick.
 */
export function chooseKind(choice: ScopeChoice, kind: Scope['kind']): ScopeChoice {
  return kind === choice.kind ? choice : { kind };
}

const byName = new Intl.Collator('vi').compare;

/** The RE a scope or a customer can be given, as "Name · Team", ordered by team, then by name. */
export function reOptions(
  people: readonly Person[],
  teams: readonly Team[],
): { value: string; label: string }[] {
  return people
    .filter((person) => person.role === 'RE')
    .map((re) => ({ re, team: teams.find((team) => team.id === re.teamId)?.name ?? '' }))
    .sort((a, b) => byName(a.team, b.team) || byName(a.re.name, b.re.name))
    .map(({ re, team }) => ({
      value: re.id,
      label: [re.name, team].filter(Boolean).join(' · '),
    }));
}
