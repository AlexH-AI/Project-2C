import {
  formatPeriodValue,
  periodOf,
  searchText,
  type CalendarDate,
  type Person,
  type Team,
} from '@p2c/domain';
import { t } from '../i18n';
import {
  customerMatches,
  type CustomerHit,
  type CustomerIndex,
} from '../routes/customers/customer-search';
import { rmMatches, type RmHit } from '../routes/team/rm-search';
import { SECTIONS, type Section } from './routes';

/** The six commands of v1.0 (mockup search-rm-team.html `#ask` 2), in the order of the mockup. */
export const COMMANDS = ['appointment', 'customer', 'team', 'export', 'backup', 'mask'] as const;
export type Command = (typeof COMMANDS)[number];

/** The name of a command: the export names the month of `today` (`Báo cáo tháng 11/2026`). */
export const commandTitle = (command: Command, today: CalendarDate): string =>
  t(`palette.command.${command}`, { month: formatPeriodValue(periodOf('month', today)) });

export interface PaletteData {
  readonly index: CustomerIndex;
  readonly people: readonly Person[];
  readonly teams: readonly Team[];
  readonly today: CalendarDate;
}

/** The four groups of the box, in their order, each best first. */
export interface PaletteResults {
  readonly customers: readonly CustomerHit[];
  readonly rms: readonly RmHit[];
  readonly screens: readonly Section[];
  readonly commands: readonly Command[];
}

/** At most this many of each group once something is typed (mockup `data-max`). */
const CAP = { customers: 8, rms: 4, screens: 4, commands: 4 } as const;

/** With nothing typed: the commands shown, the first ones (mockup `data-idle`); every screen. */
const IDLE_COMMANDS = 3;

/**
 * The items whose name answers the text, best first (mockup ui2.js `score`): the name starts with
 * it, then a word of it does, then it holds it, then the other words of the item do; alike, in
 * their order.
 */
function best<T>(
  items: readonly T[],
  needle: string,
  name: (item: T) => string,
  words?: (item: T) => string,
) {
  const ranked = items.flatMap((item) => {
    const text = searchText(name(item));
    const rank = text.startsWith(needle)
      ? 4
      : text.includes(` ${needle}`)
        ? 3
        : text.includes(needle)
          ? 2
          : Number(words !== undefined && searchText(words(item)).includes(needle));
    return rank > 0 ? [{ item, rank }] : [];
  });
  return ranked.sort((a, b) => b.rank - a.rank).map(({ item }) => item);
}

/**
 * What the command box shows for the text typed (mockup `#palette`, `#ask` 1, 2): the customers by
 * name or code, closed ones too, every one whatever the view (`customerMatches`); the RMs
 * (`rmMatches`); the screens of the sidebar; the commands. Accents and case aside. Nothing typed:
 * the screens and the first commands.
 */
export function paletteResults(query: string, data: PaletteData): PaletteResults {
  const needle = searchText(query);
  if (needle === '') {
    return {
      customers: [],
      rms: [],
      screens: SECTIONS,
      commands: COMMANDS.slice(0, IDLE_COMMANDS),
    };
  }
  const found = customerMatches(data.index, query, { kind: 'all' });
  return {
    customers: (found?.inside ?? []).slice(0, CAP.customers),
    rms: (rmMatches(data.people, data.teams, query) ?? []).slice(0, CAP.rms),
    screens: best(SECTIONS, needle, (section) => t(`screen.${section}`)).slice(0, CAP.screens),
    commands: best(
      COMMANDS,
      needle,
      (command) => commandTitle(command, data.today),
      (command) => t(`palette.words.${command}`),
    ).slice(0, CAP.commands),
  };
}
