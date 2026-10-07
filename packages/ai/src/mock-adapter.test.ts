import { describe, expect, it } from 'vitest';
import type { AiCompleteRequest } from './adapter';
import { AiError } from './errors';
import { extractJson } from './extract-json';
import { createMockAdapter } from './mock-adapter';
import {
  analysisOutputSchema,
  discoveryOutputSchema,
  extractionOutputSchema,
  type AnalysisOutput,
} from './schema';

const request = (input: unknown): AiCompleteRequest => ({
  model: 'deepseek-v4.1-flash',
  reasoning: null,
  maxTokens: 8000,
  messages: [
    { role: 'system', content: 'Prompt F99 không phải dữ kiện.' },
    { role: 'user', content: JSON.stringify(input) },
  ],
});

const fact = (code: string) => ({ code, field: 'Mục tiêu chính', value: 'Học phí cho con' });

const analysisInput = {
  analysisDate: '2026-10-07',
  mode: 'analysis',
  facts: ['F3', 'F9', 'F12', 'F10', 'F13'].map(fact),
  missingCategories: [{ code: 'RISK_APPETITE', label: 'Khẩu vị rủi ro' }],
  conflictWarnings: [],
};

const discoveryInput = {
  analysisDate: '2026-10-07',
  mode: 'discovery',
  facts: ['F1', 'F2'].map(fact),
  missingCategories: [
    { code: 'ASSETS', label: 'Tài sản' },
    { code: 'GOALS', label: 'Mục tiêu' },
  ],
  conflictWarnings: [],
};

async function complete(input: unknown) {
  const completion = await createMockAdapter().complete(request(input));
  const json = extractJson(completion.content);
  if (!json.found) throw new Error('Mock answered without JSON');
  return { completion, value: json.value };
}

type Item = { readonly evidence: readonly string[]; readonly missingCategory?: string };
const itemsOf = (output: Partial<AnalysisOutput>): Item[] => Object.values(output).flat();

describe('createMockAdapter', () => {
  it('answers the same input with the same output and no token', async () => {
    const first = await complete(analysisInput);
    const second = await complete(analysisInput);
    expect(second.completion).toEqual(first.completion);
    expect([first.completion.promptTokens, first.completion.completionTokens]).toEqual([0, 0]);
  });

  it('writes a valid analysis that cites only facts of the input', async () => {
    const output = analysisOutputSchema.parse((await complete(analysisInput)).value);
    const cited = new Set(itemsOf(output).flatMap((item) => item.evidence));
    expect([...cited].sort()).toEqual(['F10', 'F12', 'F13', 'F3', 'F9']);
    const missing = itemsOf(output).flatMap((item) => item.missingCategory ?? []);
    expect(missing).toEqual(['RISK_APPETITE']);
  });

  it('cites a single fact when the input has only one', async () => {
    const output = analysisOutputSchema.parse(
      (await complete({ ...analysisInput, facts: [fact('F7')], missingCategories: [] })).value,
    );
    expect(new Set(itemsOf(output).flatMap((item) => item.evidence))).toEqual(new Set(['F7']));
  });

  it('takes fact codes from the facts list, not from words inside a fact', async () => {
    const facts = [
      { code: 'F1', field: 'Phương tiện', value: 'Xe Ford F150' },
      { code: 'F2', field: 'Ghi chú F7', value: 'Không' },
      { code: 'F01', field: 'Mục tiêu chính', value: 'Mã sai' },
    ];
    const output = analysisOutputSchema.parse(
      (await complete({ ...analysisInput, facts, missingCategories: [] })).value,
    );
    expect(new Set(itemsOf(output).flatMap((item) => item.evidence))).toEqual(
      new Set(['F1', 'F2']),
    );
  });

  it.each([
    ['missing', undefined],
    ['not a list', 'F1'],
    ['not facts with a code', [null, 'F1', { code: 3 }]],
  ])('cites no fact when the facts are %s', async (_, facts) => {
    const output = (await complete({ ...discoveryInput, facts })).value as Partial<AnalysisOutput>;
    expect(itemsOf(output).flatMap((item) => item.evidence)).toEqual([]);
  });

  it('writes a valid discovery that cites only facts and missing hạng mục of the input', async () => {
    const output = discoveryOutputSchema.parse((await complete(discoveryInput)).value);
    expect(output).not.toHaveProperty('needs');
    const items = itemsOf(output);
    expect(new Set(items.flatMap((item) => item.evidence))).toEqual(new Set(['F1', 'F2']));
    expect(new Set(items.flatMap((item) => item.missingCategory ?? []))).toEqual(
      new Set(['ASSETS', 'GOALS']),
    );
  });

  it('writes a valid discovery from missing hạng mục alone when no fact is given', async () => {
    const output = discoveryOutputSchema.parse(
      (await complete({ ...discoveryInput, facts: [] })).value,
    );
    expect(output.hypotheses).toEqual([]);
    expect(itemsOf(output).flatMap((item) => item.evidence)).toEqual([]);
  });

  it('extracts simple patterns with quotes taken from the note', async () => {
    const note = 'Chị nói hai vợ chồng đã kết hôn 10 năm, có 2 bé. Em trai chị còn độc thân.';
    const output = extractionOutputSchema.parse(
      (await complete({ note, fields: [{ field: 'childrenCount' }] })).value,
    );
    expect(output.facts).toEqual([
      { field: 'maritalStatus', value: 'Đã kết hôn', quote: 'kết hôn' },
      { field: 'childrenCount', value: '2', quote: '2 bé' },
      { field: 'maritalStatus', value: 'Độc thân', quote: 'độc thân' },
    ]);
    for (const fact of output.facts) expect(note).toContain(fact.quote);
  });

  it('does not read "chưa kết hôn" as married', async () => {
    const output = extractionOutputSchema.parse(
      (await complete({ note: 'Anh ấy chưa kết hôn.', fields: [] })).value,
    );
    expect(output.facts).toEqual([]);
  });

  it('extracts nothing from a note without a known pattern', async () => {
    const output = extractionOutputSchema.parse(
      (await complete({ note: 'Khách hẹn gặp lại tuần sau.', fields: [] })).value,
    );
    expect(output.facts).toEqual([]);
  });

  it.each([
    ['missing', undefined],
    ['not a list', 'GOALS'],
    ['not codes of the catalog', ['GOALS', null, { code: 'HOBBIES' }]],
  ])('names no missing hạng mục when they are %s', async (_, missing) => {
    const output = analysisOutputSchema.parse(
      (await complete({ ...analysisInput, missingCategories: missing })).value,
    );
    expect(itemsOf(output).flatMap((item) => item.missingCategory ?? [])).toEqual([]);
  });

  it.each([
    ['no JSON', [{ role: 'user' as const, content: 'Xin chào' }]],
    ['no user message', [{ role: 'system' as const, content: '{"mode": "analysis"}' }]],
  ])('rejects a request with %s', async (_, messages) => {
    const adapter = createMockAdapter();
    const bad = { ...request({}), messages };
    await expect(adapter.complete(bad)).rejects.toThrow(AiError);
    await expect(adapter.complete(bad)).rejects.toMatchObject({ code: 'AI_BAD_REQUEST' });
  });
});
