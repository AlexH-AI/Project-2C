import { describe, expect, it } from 'vitest';
import { extractJson } from './extract-json';

describe('extractJson', () => {
  it('reads bare JSON', () => {
    expect(extractJson('{"facts":[]}')).toEqual({ found: true, value: { facts: [] } });
  });

  it('reads JSON inside a ```json fence', () => {
    const content = '```json\n{ "facts": [ { "field": "x" } ] }\n```';
    expect(extractJson(content)).toEqual({ found: true, value: { facts: [{ field: 'x' }] } });
  });

  it('skips text before the JSON and keeps only the first block', () => {
    const content = 'Đây là kết quả {theo mẫu}:\n{"a": "} {", "b": "\\"x\\""}\n{"c": 2}';
    expect(extractJson(content)).toEqual({ found: true, value: { a: '} {', b: '"x"' } });
  });

  it('finds the JSON after a brace in the text that is never closed', () => {
    // A later `{` can close at its own depth, so an unclosed brace must not stop the search.
    const content = 'Ghi chú { chưa đóng. JSON: {"a": 1}';
    expect(extractJson(content)).toEqual({ found: true, value: { a: 1 } });
  });

  it('reads nested objects', () => {
    expect(extractJson('x {"a": {"b": [1, {"c": null}]}} y')).toEqual({
      found: true,
      value: { a: { b: [1, { c: null }] } },
    });
  });

  it.each([
    ['no JSON', 'Tôi không thể trả lời.'],
    ['an empty answer', ''],
    ['a cut-off block', '{"facts": [ {"field": "x"'],
    ['only an array', '[1, 2]'],
    ['a block that is not JSON', '{facts: []}'],
    // The outermost block is the candidate (spec §6.1): what it holds is part of its text.
    ['JSON inside a block that is not JSON', '{theo mẫu {"a": 1}}'],
  ])('reports none for %s', (_, content) => {
    expect(extractJson(content)).toEqual({ found: false });
  });

  // An answer cut by `maxTokens` (DR5-05): its outer block never closes, but its elements do.
  const CUT = '{"hypotheses": [{"text": "KH có thể ưu tiên con", "evidence": ["F1"]}, {"text": "K';

  it('reads an element of a cut answer when it is not known to be cut', () => {
    expect(extractJson(CUT)).toEqual({
      found: true,
      value: { text: 'KH có thể ưu tiên con', evidence: ['F1'] },
    });
  });

  it('takes no block inside an unclosed brace of an answer known to be cut', () => {
    expect(extractJson(CUT, { cut: true })).toEqual({ found: false });
    expect(extractJson(`Ghi chú { chưa đóng. JSON: {"a": 1}`, { cut: true })).toEqual({
      found: false,
    });
  });

  it('reads a whole block of an answer cut after it', () => {
    expect(extractJson('{"a": 1}\nGiải thích: kết quả trên dựa vào', { cut: true })).toEqual({
      found: true,
      value: { a: 1 },
    });
  });

  it('takes an answer with 100 blocks that fail to parse as holding no JSON', () => {
    const failing = (count: number) => `${'{"a" x} '.repeat(count)}{"b": 2}`;
    expect(extractJson(failing(99))).toEqual({ found: true, value: { b: 2 } });
    expect(extractJson(failing(100))).toEqual({ found: false });
    expect(extractJson(`{ ${failing(99)}`)).toEqual({ found: true, value: { b: 2 } });
    expect(extractJson(`{ ${failing(100)}`)).toEqual({ found: false });
  });

  // DR5-04: one pass, however many braces never close (100 000 of them took 11.4 s).
  it.each([
    ['open braces', '{'.repeat(100_000)],
    ['open braces and strings', '{"'.repeat(50_000)],
    ['braces in a long text', `${'Ghi chú { '.repeat(10_000)}{"a": 1}`],
    ['nested blocks that are not JSON', `${'{"a": '.repeat(20_000)}x${'}'.repeat(20_000)}`],
    ['many small blocks that are not JSON', '{x} '.repeat(25_000)],
    ['many small blocks that fail late', '{"a"x} '.repeat(14_000)],
  ])('reads 100 000 characters of %s in one pass', (_, content) => {
    const started = Date.now();
    extractJson(content);
    expect(Date.now() - started).toBeLessThan(50);
  });
});
