import type { MessageKey } from './vi';

/**
 * An English message with a count (ADR-0018 §9): `one` for 1, `other` for any other number,
 * picked by the message's one count slot (`COUNT_SLOTS`). A message with two counts takes no
 * plural form: word it without a noun after each count, or split it into keys.
 */
export interface PluralMessage {
  readonly one: string;
  readonly other: string;
}

/** The English catalogue: the keys of `vi.ts` only, so a key it does not know fails typecheck. */
export type EnglishMessages = Partial<Record<MessageKey, string | PluralMessage>>;

/**
 * English UI strings (ADR-0018 §9), translated screen by screen (G-12 … G-16) in the terms of
 * `CONTEXT.md` § Thuật ngữ tiếng Anh. A key missing here shows its Vietnamese; `en.test.ts` lists
 * them, and their number only goes down. Settings offers English once none is missing (G-16).
 */
export const en: EnglishMessages = {
  'nav.group.manage': 'Manage',
  'screen.overview': 'Overview',
  'screen.appointments': 'Appointments',
  'screen.customers': 'Customers',
  'screen.customer': 'Customer profile',
  'screen.reports': 'Reports',
  'screen.team': 'Team management',
  'screen.settings': 'Settings',
  'scope.label': 'View',
  // A money field (G-03b): the words of mockup ngon-ngu-tien-te.html #money, tied to the codes of
  // the reading (ADR-0018 §5); "whole cents" chosen by the Owner 14/11/2026.
  'money.read': '{amount} ({compact})',
  'money.placeholder': 'e.g. 500 Mil · 1.5 Bil',
  'money.placeholder.cents': 'e.g. 1,250.50 · 250K',
  'money.error.empty': 'Enter an amount.',
  'money.error.negative': 'Amounts cannot be negative.',
  'money.error.format': 'Could not read this amount. Type it like 1,500,000 or 1.5 Mil.',
  'money.error.format.cents': 'Could not read this amount. Type it like 1,250.50 or 250K.',
  'money.error.fraction': 'VNĐ amounts have no decimals.',
  'money.error.fraction.cents': 'Amounts must be whole cents.',
  'money.error.too-large': 'This amount is too large.',
  'money.error.ambiguous': '"{text}" can be read two ways.',
  'money.mark': 'Use "," for thousands and "." for decimals.',
  'money.unit': 'The English interface uses K, Mil and Bil.',
  'money.didYouMean': 'Did you mean:',
  'money.pickOne': 'Pick one:',
  'money.fill': 'Fill in {text} = {amount}',
  'sep.equals': '=',
};
