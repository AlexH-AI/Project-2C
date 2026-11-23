import type { CustomerRecord } from '@p2c/db';
import { byName, scopeMatcher, searchText, type Person, type Scope, type Team } from '@p2c/domain';

/** A customer in the list under the search field: "KH – RM – Team" (spec Phase 6 phản hồi §5). */
export interface CustomerHit {
  readonly customer: CustomerRecord;
  readonly rm: Person | undefined;
  readonly team: Team | undefined;
}

/** Every customer by the order of names (`byName`), its name and code read once (`searchText`). */
export interface CustomerIndex {
  readonly hits: readonly (CustomerHit & { readonly name: string; readonly code: string })[];
  readonly people: readonly Person[];
}

export function customerIndex(data: {
  readonly customers: readonly CustomerRecord[];
  readonly people: readonly Person[];
  readonly teams: readonly Team[];
}): CustomerIndex {
  const people = new Map(data.people.map((person) => [person.id, person]));
  const teams = new Map(data.teams.map((team) => [team.id, team]));
  const hits = [...data.customers]
    .sort((a, b) => byName(a.name, b.name) || byName(a.code, b.code))
    .map((customer) => {
      const rm = people.get(customer.rmId);
      const team = rm?.teamId ? teams.get(rm.teamId) : undefined;
      return {
        customer,
        rm,
        team,
        name: searchText(customer.name),
        code: searchText(customer.code),
      };
    });
  return { hits, people: data.people };
}

/** At most this many customers in the list under the field (mockup search-rm-team.html). */
const LISTED = 8;

export interface CustomerFound {
  /** Every customer matched, closed ones too, in the view or not: the cards that light up. */
  readonly ids: ReadonlySet<string>;
  /** The best `LISTED` matches: those of the view, then the others ("Ngoài góc nhìn", `#ask` 6). */
  readonly inside: readonly CustomerHit[];
  readonly outside: readonly CustomerHit[];
}

/**
 * The customers the text finds by name or code, accents, case and the script of digits ignored
 * (`searchText`), among every customer whatever the view (spec §5); null for nothing typed. The
 * best (mockup `#palette`, "Thứ tự"): the name starts with the text, then a word of it does, then
 * it holds it, then the code does; alike, by the order of names.
 */
export function customerMatches(
  index: CustomerIndex,
  query: string,
  scope: Scope,
): CustomerFound | null {
  const needle = searchText(query);
  if (needle === '') return null;
  const ranked = index.hits.flatMap((hit) => {
    const { name, code } = hit;
    const rank = name.startsWith(needle)
      ? 4
      : name.includes(` ${needle}`)
        ? 3
        : name.includes(needle)
          ? 2
          : Number(code.includes(needle));
    return rank > 0 ? [{ hit, rank }] : [];
  });
  const best = [...ranked].sort((a, b) => b.rank - a.rank).slice(0, LISTED);
  const inView = scopeMatcher(index.people, scope);
  return {
    ids: new Set(ranked.map(({ hit }) => hit.customer.id)),
    inside: best.filter(({ hit }) => inView(hit.customer.rmId)).map(({ hit }) => hit),
    outside: best.filter(({ hit }) => !inView(hit.customer.rmId)).map(({ hit }) => hit),
  };
}

/**
 * Where the text typed is in `text` (a name, a code), as `[start, end)` of its code units; null for
 * no match. Each character is read as `searchText` reads it, so the part lit is the one written.
 */
export function foundIn(text: string, query: string): [number, number] | null {
  const needle = searchText(query);
  let read = '';
  const starts: number[] = []; // the code unit of `text` each code unit of `read` comes from
  let unit = 0;
  for (const char of text) {
    const folded = /\s/u.test(char) ? ' ' : searchText(char);
    read += folded;
    starts.push(...Array<number>(folded.length).fill(unit));
    unit += char.length;
  }
  const at = needle === '' ? -1 : read.indexOf(needle);
  return at < 0 ? null : [starts[at]!, starts[at + needle.length] ?? unit];
}
