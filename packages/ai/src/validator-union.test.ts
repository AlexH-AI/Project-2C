/**
 * V1 detail of a union whose options take one type (a NIT of the review of PR #812): no output
 * schema has one, so the extraction schema is swapped here for one with such a `quote`.
 */
import { describe, expect, it, vi } from 'vitest';
import * as z from 'zod/mini';
import { validateOutput } from './validator';

vi.mock('./schema', async (importOriginal) => {
  const schema = await importOriginal<typeof import('./schema')>();
  const code = (letter: string) =>
    z.string().check(z.regex(new RegExp(`^${letter}\\d+$`), `sai định dạng, cần mã ${letter}`));
  const extraction = z.object({ quote: z.union([code('F'), code('X')], 'cần mã F hoặc X') });
  return { ...schema, AI_OUTPUT_SCHEMAS: { ...schema.AI_OUTPUT_SCHEMAS, extraction } };
});

describe('validateOutput — a union of options of one type', () => {
  it('tells a value two options take the message of the union, not the rule of the first', () => {
    expect(validateOutput('extraction', { quote: 'abc' })).toEqual([
      { code: 'V1', path: 'quote', detail: 'cần mã F hoặc X' },
    ]);
  });

  it('tells a value no option takes that it is of no allowed type', () => {
    expect(validateOutput('extraction', { quote: 7 })).toEqual([
      { code: 'V1', path: 'quote', detail: 'sai kiểu, cần mã F hoặc X' },
    ]);
  });
});
