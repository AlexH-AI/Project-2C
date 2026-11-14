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
};
