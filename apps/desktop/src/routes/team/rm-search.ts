import { byName, isRm, searchText, type Person, type Team } from '@p2c/domain';

/** An RM in the list under "Tìm RM": "RM Họ tên – Team" (mockup search-rm-team.html `#team`). */
export interface RmHit {
  readonly rm: Person;
  readonly team: Team | undefined;
}

/** At most this many RMs in the list under the field (mockup, `data-max`). */
const LISTED = 8;

/**
 * The RMs whose name the text finds, as the search of Khách hàng finds a customer (C1,
 * `customerMatches`): accents, case and the script of digits ignored (`searchText`); the name
 * starts with the text, then a word of it does, then it holds it; alike, by the order of names,
 * then of teams. The best `LISTED`; null for nothing typed.
 */
export function rmMatches(
  people: readonly Person[],
  teams: readonly Team[],
  query: string,
): RmHit[] | null {
  const needle = searchText(query);
  if (needle === '') return null;
  const teamOf = new Map(teams.map((team) => [team.id, team]));
  return people
    .filter(isRm)
    .flatMap((rm) => {
      const name = searchText(rm.name);
      const rank = name.startsWith(needle)
        ? 3
        : name.includes(` ${needle}`)
          ? 2
          : Number(name.includes(needle));
      const team = rm.teamId ? teamOf.get(rm.teamId) : undefined;
      return rank > 0 ? [{ rm, team, rank }] : [];
    })
    .sort(
      (a, b) =>
        b.rank - a.rank ||
        byName(a.rm.name, b.rm.name) ||
        byName(a.team?.name ?? '', b.team?.name ?? ''),
    )
    .slice(0, LISTED)
    .map(({ rm, team }) => ({ rm, team }));
}
