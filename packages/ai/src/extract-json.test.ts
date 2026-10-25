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

  it('finds the JSON after a brace never closed and an odd quote in the text (review #521)', () => {
    // From the unclosed brace, the quote opens a string up to the JSON's first quote.
    expect(extractJson('Lưu ý {mẫu "x. Kết quả: {"a":1}')).toEqual({
      found: true,
      value: { a: 1 },
    });
    expect(extractJson('{ "x { "y {"a":1}')).toEqual({ found: true, value: { a: 1 } });
  });

  it('reads again after 3 unclosed braces with an odd quote at most', () => {
    // Each `{ \"` takes one more reading: from its brace, the escaped quote opens a string.
    const prose = (count: number) => `${'{ \\"'.repeat(count)} {"a":1}`;
    expect(extractJson(prose(3))).toEqual({ found: true, value: { a: 1 } });
    expect(extractJson(prose(4))).toEqual({ found: false });
    // The braces of the prose of a cut answer are read again as many times (Owner 23/10/2026).
    expect(extractJson(prose(3), { cut: true })).toEqual({ found: true, value: { a: 1 } });
    expect(extractJson(prose(4), { cut: true })).toEqual({ found: false });
  });

  it('reads an escaped quote inside a string, with braces after it', () => {
    expect(extractJson('x {"t": "a \\" } { b"} y')).toEqual({
      found: true,
      value: { t: 'a " } { b' },
    });
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

  // A `{` still open that opens an object (a quote after it, past white space) may be the cut
  // answer itself, printed with indents too, as the format of the prompts (the review of PR #820).
  it.each([
    ['the answer', CUT],
    [
      'the answer printed with indents',
      CUT.replace('{"hypotheses": [', '{\n  "hypotheses": [\n    '),
    ],
    ['the answer after a brace of the prose', `Ghi chú { chưa đóng. ${CUT}`],
    ['the answer after a brace and an odd quote of the prose', `Lưu ý {mẫu "x. ${CUT}`],
    ['a brace of the prose with a quote after it', 'Lưu ý {"mẫu" chưa đóng. {"a":1} rồi'],
  ])('takes no block inside a brace opening an object, in a cut answer: %s', (_, content) => {
    expect(extractJson(content, { cut: true })).toEqual({ found: false });
  });

  // Owner 23/10/2026 (spec §6.1): a brace of the prose is read as in an answer that is not cut, so
  // a whole block after it is taken, wherever after the block the answer was cut.
  it.each([
    ['cut in the prose after the block', 'Ghi chú { chưa đóng. {"a":1} rồi lời văn'],
    ['cut right after the block', 'Ghi chú { chưa đóng. JSON: {"a": 1}'],
    ['two braces of the prose before the block', 'Ghi chú { một { hai. {"a":1} rồi'],
    ['a brace and an odd quote of the prose before it', 'Lưu ý {mẫu "x. Kết quả: {"a":1} rồi'],
  ])('reads a whole block after a brace of the prose, in a cut answer: %s', (_, content) => {
    expect(extractJson(content, { cut: true })).toEqual({ found: true, value: { a: 1 } });
  });

  it('reads a whole block of an answer cut after it', () => {
    expect(extractJson('{"a": 1}\nGiải thích: kết quả trên dựa vào', { cut: true })).toEqual({
      found: true,
      value: { a: 1 },
    });
  });

  // Review #822: from the brace of the prose, its odd quote turns the quotes of the answer around,
  // and a "{}" in a text of the answer closes there as a block; only the last reading tries those.
  const ODD = 'Lưu ý { x "y. ';
  const TEXT = '{"text": "Mẫu {} trống", "evidence": ["F1"]}';

  it('takes the whole answer after a brace and an odd quote, not a "{}" of its text', () => {
    const answer = `{"hypotheses": [${TEXT}]}`;
    expect(extractJson(`${ODD}${answer}`)).toEqual({ found: true, value: JSON.parse(answer) });
  });

  it('takes no "{}" of a text of an answer cut after a brace and an odd quote', () => {
    expect(extractJson(`${ODD}{"hypotheses": [${TEXT}, {"text": "K`, { cut: true })).toEqual({
      found: false,
    });
  });

  it('takes an answer with 100 blocks that fail to parse as holding no JSON', () => {
    const failing = (count: number) => `${'{"a" x} '.repeat(count)}{"b": 2}`;
    expect(extractJson(failing(99))).toEqual({ found: true, value: { b: 2 } });
    expect(extractJson(failing(100))).toEqual({ found: false });
    expect(extractJson(`{ ${failing(99)}`)).toEqual({ found: true, value: { b: 2 } });
    expect(extractJson(`{ ${failing(100)}`)).toEqual({ found: false });
    // At the last reading, after three more, among the blocks inside a brace left open.
    const last = (count: number) => `${'{ \\"'.repeat(3)}{ ${failing(count)}`;
    expect(extractJson(last(99))).toEqual({ found: true, value: { b: 2 } });
    expect(extractJson(last(100))).toEqual({ found: false });
  });

  // DR5-04: one pass, however many braces never close (100 000 of them took 11.4 s). One pass takes
  // a few ms, but a CI runner once took 54 ms (#569); the quadratic reading took 1.2 s or more on
  // each input but the two "many small blocks". Those two were only slow by an exception per block,
  // which the test of 100 failed blocks above already bounds. Braces in a long text took 1.2–1.8 s
  // on 100 000 characters, too near the bound: three times as long, 12–17 s (review #570).
  it.each([
    ['100 000 characters of open braces', '{'.repeat(100_000)],
    ['100 000 characters of open braces and strings', '{"'.repeat(50_000)],
    ['300 000 characters of braces in a long text', `${'Ghi chú { '.repeat(30_000)}{"a": 1}`],
    [
      '100 000 characters of nested blocks that are not JSON',
      `${'{"a": '.repeat(20_000)}x${'}'.repeat(20_000)}`,
    ],
    ['100 000 characters of many small blocks that are not JSON', '{x} '.repeat(25_000)],
    ['100 000 characters of many small blocks that fail late', '{"a"x} '.repeat(14_000)],
    ['100 000 characters of unclosed braces read again', '{ \\"'.repeat(25_000)],
  ])('reads %s in one pass', (_, content) => {
    const started = Date.now();
    extractJson(content);
    expect(Date.now() - started).toBeLessThan(500);
  });
});
