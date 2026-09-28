import type { Person, Team } from '@p2c/domain';

export interface TeamEntry {
  readonly team: Team;
  /** In the order given (the repository sorts by name). */
  readonly members: readonly Person[];
  readonly tl: number;
  readonly re: number;
}

export interface TeamView {
  readonly teams: readonly TeamEntry[];
  /** People without a team: the IS / BD / BDM shared by every team (D8). */
  readonly shared: readonly Person[];
}

/** Teams with their members, and the shared support staff (mockup team.html). */
export function groupByTeam(teams: readonly Team[], people: readonly Person[]): TeamView {
  return {
    teams: teams.map((team) => {
      const members = people.filter((person) => person.teamId === team.id);
      const count = (role: Person['role']) => members.filter((p) => p.role === role).length;
      return { team, members, tl: count('TL'), re: count('RE') };
    }),
    shared: people.filter((person) => person.teamId === null),
  };
}

/** Avatar letters: family name and given name, "Nguyễn Thu Hà" → "NH". */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  const first = words[0]?.charAt(0) ?? '';
  const last = words.length > 1 ? (words.at(-1)?.charAt(0) ?? '') : '';
  return (first + last).toLocaleUpperCase('vi');
}
