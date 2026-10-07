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
  ])('reports none for %s', (_, content) => {
    expect(extractJson(content)).toEqual({ found: false });
  });
});
