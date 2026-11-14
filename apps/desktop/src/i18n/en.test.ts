import { describe, expect, it } from 'vitest';
import { COUNT_SLOTS } from '.';
import { en } from './en';
import { vi, type MessageKey } from './vi';

/**
 * Keys of `vi.ts` that `en.ts` still lacks (ADR-0018 §9). Only ever lowered: a new key comes with
 * its English, and a translation round (G-12 … G-16) lowers this to what is left; G-16 brings it
 * to 0.
 */
const MISSING_EN = 1197;

const slotsOf = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => String(m[1]));

describe('en.ts', () => {
  it('lacks exactly MISSING_EN keys of vi.ts, and lists them', () => {
    const missing = Object.keys(vi).filter((key) => !Object.hasOwn(en, key));
    expect(
      missing.length,
      [
        `en.ts lacks ${missing.length} keys of vi.ts; MISSING_EN is ${MISSING_EN}.`,
        'More: give each new key of vi.ts its English in en.ts; never raise MISSING_EN.',
        'Fewer: lower MISSING_EN to the number above.',
        'The keys en.ts lacks:',
        ...missing,
      ].join('\n'),
    ).toBe(MISSING_EN);
  });

  // An English slot the Vietnamese lacks is never filled: no caller passes it.
  it('fills only the slots of the Vietnamese', () => {
    const strange = Object.entries(en).flatMap(([key, message]) => {
      const forms = typeof message === 'string' ? [message] : [message.one, message.other];
      const own = new Set(slotsOf(vi[key as MessageKey]));
      return forms
        .flatMap(slotsOf)
        .filter((slot) => !own.has(slot))
        .map((slot) => `${key}: {${slot}}`);
    });
    expect(strange).toEqual([]);
  });

  // ADR-0018 §9: the form goes by the count; with two counts there is no telling which.
  it('gives a plural form only to a message with one count slot', () => {
    const unclear = Object.entries(en).flatMap(([key, message]) =>
      typeof message === 'string' ||
      [message.one, message.other].every(
        (form) => slotsOf(form).filter((slot) => COUNT_SLOTS.has(slot)).length === 1,
      )
        ? []
        : [key],
    );
    expect(unclear).toEqual([]);
  });
});
