import { evaluateKycGate } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import type { AiCompleteRequest } from './adapter';
import { AiError } from './errors';
import { createMockAdapter } from './mock-adapter';
import {
  analysisOutputSchema,
  buildAnalysisInput,
  discoveryOutputSchema,
  mockAnalysisOutput,
  mockDiscoveryOutput,
  type AnalysisOutput,
} from './schema';
import { completeMock, mockRequest, PROFILE, TODAY } from './test-support';

// @ts-expect-error A model outside the list of spec §4.2 is a type error.
const unknownModel: AiCompleteRequest['model'] = 'gpt-5';
void unknownModel;

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

type Item = { readonly evidence: readonly string[]; readonly missingCategory?: string };
const itemsOf = (output: Partial<AnalysisOutput>): Item[] => Object.values(output).flat();

describe('createMockAdapter', () => {
  it('answers the same input with the same output and no token', async () => {
    const first = await completeMock(analysisInput);
    const second = await completeMock(analysisInput);
    expect(second.completion).toEqual(first.completion);
    expect([first.completion.promptTokens, first.completion.completionTokens]).toEqual([0, 0]);
  });

  it('writes a valid analysis that cites only facts of the input', async () => {
    const output = analysisOutputSchema.parse((await completeMock(analysisInput)).value);
    const cited = new Set(itemsOf(output).flatMap((item) => item.evidence));
    expect([...cited].sort()).toEqual(['F10', 'F12', 'F13', 'F3', 'F9']);
    const missing = itemsOf(output).flatMap((item) => item.missingCategory ?? []);
    expect(missing).toEqual(['RISK_APPETITE']);
    expect(output.personalityNotes.map((note) => note.system)).toEqual(['PSYCHOLOGY']);
  });

  it('cites a single fact when the input has only one', async () => {
    const output = analysisOutputSchema.parse(
      (await completeMock({ ...analysisInput, facts: [fact('F7')], missingCategories: [] })).value,
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
      (await completeMock({ ...analysisInput, facts, missingCategories: [] })).value,
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
    const output = (await completeMock({ ...discoveryInput, facts }))
      .value as Partial<AnalysisOutput>;
    expect(itemsOf(output).flatMap((item) => item.evidence)).toEqual([]);
  });

  it('writes a valid discovery that cites only facts and missing hạng mục of the input', async () => {
    const output = discoveryOutputSchema.parse((await completeMock(discoveryInput)).value);
    expect(output).not.toHaveProperty('needs');
    expect(output.personalityNotes).toEqual([]);
    const items = itemsOf(output);
    expect(new Set(items.flatMap((item) => item.evidence))).toEqual(new Set(['F1', 'F2']));
    expect(new Set(items.flatMap((item) => item.missingCategory ?? []))).toEqual(
      new Set(['ASSETS', 'GOALS']),
    );
  });

  it('writes a valid discovery from missing hạng mục alone when no fact is given', async () => {
    const output = discoveryOutputSchema.parse(
      (await completeMock({ ...discoveryInput, facts: [] })).value,
    );
    expect(output.hypotheses).toEqual([]);
    expect(itemsOf(output).flatMap((item) => item.evidence)).toEqual([]);
  });

  // The seed of `db` writes `mock…Output` of the input it builds: the same answer as the adapter's.
  it.each([
    ['analysis', PROFILE.facts],
    ['discovery', PROFILE.facts.filter((f) => f.category !== 'GOALS')],
  ])(
    'answers what buildAnalysisInput sends with mock output of its %s (DR5-18)',
    async (mode, facts) => {
      const input = buildAnalysisInput({ facts }, evaluateKycGate(facts), TODAY)!;
      expect(input.mode).toBe(mode);
      const codes = input.facts.map((sent) => sent.code);
      const missing = input.missingCategories.map((category) => category.code);
      const mock = mode === 'analysis' ? mockAnalysisOutput : mockDiscoveryOutput;
      expect((await completeMock(input)).value).toEqual(mock(codes, missing));
    },
  );

  it('writes no null action for a discovery with no fact and no missing hạng mục (MS-A7)', async () => {
    const value = (await completeMock({ ...discoveryInput, facts: [], missingCategories: [] }))
      .value;
    expect(value).toMatchObject({ discoveryStrategy: [], nextBestActions: [] });
    // Nothing to cite: an answer the schema rejects, as a real model's could be.
    expect(discoveryOutputSchema.safeParse(value).success).toBe(false);
  });

  it.each([
    ['missing', undefined],
    ['not a list', 'GOALS'],
    ['not codes of the catalog', ['GOALS', null, { code: 'HOBBIES' }]],
  ])('names no missing hạng mục when they are %s', async (_, missing) => {
    const output = analysisOutputSchema.parse(
      (await completeMock({ ...analysisInput, missingCategories: missing })).value,
    );
    expect(itemsOf(output).flatMap((item) => item.missingCategory ?? [])).toEqual([]);
  });

  it.each([
    ['no JSON', [{ role: 'user' as const, content: 'Xin chào' }]],
    ['no user message', [{ role: 'system' as const, content: '{"mode": "analysis"}' }]],
  ])('rejects a request with %s', async (_, messages) => {
    const adapter = createMockAdapter();
    const bad = { ...mockRequest({}), messages };
    await expect(adapter.complete(bad)).rejects.toThrow(AiError);
    await expect(adapter.complete(bad)).rejects.toMatchObject({ code: 'AI_BAD_REQUEST' });
  });
});
