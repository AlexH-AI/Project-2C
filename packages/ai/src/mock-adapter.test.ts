import { evaluateKycGate } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import type { AiCompleteRequest } from './adapter';
import { AiError } from './errors';
import { extractJson } from './extract-json';
import { createMockAdapter } from './mock-adapter';
import {
  analysisOutputSchema,
  buildAnalysisInput,
  discoveryOutputSchema,
  extractionOutputSchema,
  mockAnalysisOutput,
  mockDiscoveryOutput,
  type AnalysisOutput,
} from './schema';
import { PROFILE, TODAY } from './test-support';

// @ts-expect-error A model outside the list of spec §4.2 is a type error.
const unknownModel: AiCompleteRequest['model'] = 'gpt-5';
void unknownModel;

const request = (input: unknown): AiCompleteRequest => ({
  sessionId: 'session-1',
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
    expect(output.personalityNotes.map((note) => note.system)).toEqual(['PSYCHOLOGY']);
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
    expect(output.personalityNotes).toEqual([]);
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
      expect((await complete(input)).value).toEqual(mock(codes, missing));
    },
  );

  it('writes no null action for a discovery with no fact and no missing hạng mục (MS-A7)', async () => {
    const value = (await complete({ ...discoveryInput, facts: [], missingCategories: [] })).value;
    expect(value).toMatchObject({ discoveryStrategy: [], nextBestActions: [] });
    // Nothing to cite: an answer the schema rejects, as a real model's could be.
    expect(discoveryOutputSchema.safeParse(value).success).toBe(false);
  });

  it('extracts simple patterns with quotes taken from the note', async () => {
    const note = 'Chị nói hai vợ chồng đã kết hôn 10 năm, có 2 bé. Em trai chị còn độc thân.';
    const fields = [{ field: 'maritalStatus' }, { field: 'childrenCount' }];
    const output = extractionOutputSchema.parse((await complete({ note, fields })).value);
    // The brother's "độc thân" is not the KH's (DR6-19).
    expect(output.facts).toEqual([
      { field: 'maritalStatus', value: 'Đã kết hôn', quote: 'kết hôn' },
      { field: 'childrenCount', value: '2', quote: '2 bé' },
    ]);
    for (const fact of output.facts) expect(note).toContain(fact.quote);
  });

  it.each([
    'KH có một con trai đang sống độc thân tại Hà Nội.',
    'Em trai KH còn độc thân.',
    'KH không có 2 con như người quen tưởng.',
    'KH không còn độc thân.',
    'KH muốn kiểm tra 9 con số về thu nhập và tài sản trước buổi gặp.',
  ])(
    'proposes nothing from %j: about someone else, said not to be, or no child (DR6-19)',
    async (note) => {
      const fields = [{ field: 'maritalStatus' }, { field: 'childrenCount' }];
      const output = extractionOutputSchema.parse((await complete({ note, fields })).value);
      expect(output.facts).toEqual([]);
    },
  );

  it.each([
    // Someone else, whoever is named (DR6-78).
    'Ông nội KH có 9 con.',
    'Bà ngoại KH có 7 con, KH là cháu đích tôn.',
    'Sếp của KH có 3 con.',
    'Ba của KH có 5 con.',
    'Em KH vẫn còn độc thân.',
    'Cô của KH độc thân cả đời.',
    'Anh họ KH đã kết hôn năm ngoái.',
    'Hàng xóm KH đã kết hôn tuần trước.',
    'Anh rể KH đã kết hôn, có 3 con.',
    'Vợ cũ của KH có 2 con riêng với chồng mới.',
    'Chồng của KH có 2 con riêng.',
    // "con" of animals and things.
    'KH nuôi 2 con chó Phú Quốc.',
    'Nhà KH có 3 con mèo.',
    'KH sở hữu 10 con bò sữa ở trang trại.',
    // A supposition.
    'KH hỏi nếu đã kết hôn, có 2 con thì nên chuẩn bị gì.',
  ])('proposes nothing from %j: someone else, animals or a supposition (DR6-78)', async (note) => {
    const fields = [{ field: 'maritalStatus' }, { field: 'childrenCount' }];
    const output = extractionOutputSchema.parse((await complete({ note, fields })).value);
    expect(output.facts).toEqual([]);
  });

  it('reads each sentence on its own: a relative named in one leaves the KH of another', async () => {
    const fields = [{ field: 'maritalStatus' }, { field: 'childrenCount' }];
    const both = [
      { field: 'maritalStatus', value: 'Đã kết hôn', quote: 'kết hôn' },
      { field: 'childrenCount', value: '2', quote: '2 con' },
    ];
    for (const note of [
      'KH đã kết hôn, có 2 con.',
      'KH đã kết hôn, có 2 con. Em trai KH còn độc thân.',
      'Ông nội KH mất sớm. KH đã kết hôn, có 2 con.',
      'Nếu cần, KH sẽ gọi lại. KH đã kết hôn, có 2 con. Nhà nuôi 3 con chó.',
    ]) {
      const output = extractionOutputSchema.parse((await complete({ note, fields })).value);
      expect(output.facts).toEqual(both);
    }
  });

  it.each(['!', '?', ';', '\n'])('ends a sentence at %j too (N19d)', async (end) => {
    const note = `Em trai KH còn độc thân${end} Nếu cần, gọi lại${end} KH có 2 con.`;
    const fields = [{ field: 'maritalStatus' }, { field: 'childrenCount' }];
    const output = extractionOutputSchema.parse((await complete({ note, fields })).value);
    expect(output.facts).toEqual([{ field: 'childrenCount', value: '2', quote: '2 con' }]);
  });

  // DR6-79: each sentence and clause read once. Reading back from every phrase took 2 s on the
  // first note; the best of three runs keeps a busy CI runner from failing it.
  it.each([
    ['"độc thân"', `KH ${'độc thân '.repeat(4000)}`],
    ['"<n> con"', `KH ${'có 2 con và '.repeat(3000)}`],
  ])('reads a one-line note of 36 000 characters full of %s in under 50 ms', async (_, note) => {
    const fields = [{ field: 'maritalStatus' }, { field: 'childrenCount' }];
    const times: number[] = [];
    for (let run = 0; run < 3; run++) {
      const started = Date.now();
      extractionOutputSchema.parse((await complete({ note, fields })).value);
      times.push(Date.now() - started);
    }
    expect(note.length).toBe(36_003);
    expect(Math.min(...times)).toBeLessThan(50);
  });

  it.each([
    ['childrenCount only', [{ field: 'childrenCount' }], ['childrenCount']],
    ['no list', undefined, []],
    ['no field code', [null, { label: 'Số con' }], []],
  ])('proposes only trường of the input fields: %s', async (_, fields, proposed) => {
    const note = 'Hai vợ chồng đã kết hôn, có 2 bé.';
    const output = extractionOutputSchema.parse((await complete({ note, fields })).value);
    expect(output.facts.map((fact) => fact.field)).toEqual(proposed);
  });

  it.each([
    'Anh ấy chưa kết hôn.',
    'Anh ấy chưa từng kết hôn.',
    'Chị nói sẽ không kết hôn.',
    // CX-A4
    'KH không muốn kết hôn, đang ưu tiên công việc.',
    'KH vừa ly hôn sau 12 năm kết hôn.',
    'Anh ấy đã từng kết hôn.',
  ])('does not read %j as married', async (note) => {
    const fields = [{ field: 'maritalStatus' }];
    const output = extractionOutputSchema.parse((await complete({ note, fields })).value);
    expect(output.facts).toEqual([]);
  });

  it.each([
    // CX-A4: the KH's grandchildren are not their children.
    ['KH có 2 cháu ngoại, cả hai đang học tiểu học.', []],
    ['Ông bà có 3 cháu nội.', []],
    ['Nhà có 2 cháu, đều học cấp 2.', [{ field: 'childrenCount', value: '2', quote: '2 cháu' }]],
    // Not "Đã kết hôn"; living single is said as such.
    [
      'KH chưa đăng ký kết hôn, hiện sống độc thân.',
      [{ field: 'maritalStatus', value: 'Độc thân', quote: 'độc thân' }],
    ],
  ])('reads %j as %j', async (note, facts) => {
    const fields = [{ field: 'maritalStatus' }, { field: 'childrenCount' }];
    const output = extractionOutputSchema.parse((await complete({ note, fields })).value);
    expect(output.facts).toEqual(facts);
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
