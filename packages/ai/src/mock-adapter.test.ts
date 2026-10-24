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

const FIELDS = [{ field: 'maritalStatus' }, { field: 'childrenCount' }];
/** A first sentence long enough that a position counted from the start of the second falls in it. */
const LONG = 'Hôm qua gặp KH tại văn phòng ở quận 1 lúc 9 giờ sáng.';
const MARRIED = { field: 'maritalStatus', value: 'Đã kết hôn', quote: 'kết hôn' };
const SINGLE = { field: 'maritalStatus', value: 'Độc thân', quote: 'độc thân' };
const TWO = { field: 'childrenCount', value: '2', quote: '2 con' };
/** What the Mock extracts of `note` for the two trường it knows. */
const extracted = async (note: string) =>
  extractionOutputSchema.parse((await complete({ note, fields: FIELDS })).value).facts;

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
    'KH khôngđộc thân.',
    'KH cần kiểm tra 9 con số về thu nhập và tài sản trước buổi gặp.',
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
    'Ba chị ấy có 5 con.',
    'Em KH vẫn còn độc thân.',
    'Cô của KH độc thân cả đời.',
    'Anh họ KH đã kết hôn năm ngoái.',
    'Hàng xóm KH đã kết hôn tuần trước.',
    'Anh rể KH đã kết hôn, có 3 con.',
    'Vợ cũ của KH có 2 con riêng với chồng mới.',
    'Chồng của KH có 2 con riêng.',
    'Mợ của KH có 2 con.',
    'Anh của KH đã kết hôn.',
    // The KH's brothers and sisters are other people too (the review of PR #753).
    'Anh chị em của KH đều đã kết hôn.',
    'Hai anh em KH đều đã kết hôn.',
    'Ba anh em KH đều đã kết hôn.',
    'Chị em gái của KH đã kết hôn.',
    'KH có ba anh em, cả ba đã kết hôn.',
    'KH có hai chị em, cả hai đã kết hôn.',
    'Anh em KH đều có 2 con.',
    // A name ending in "anh" or "chị" before "em" is no exception: "em" is someone else.
    'Chị Thanh em KH đã kết hôn.',
    'Quỳnh Anh em gái KH đã kết hôn.',
    // "con" of animals and things.
    'KH nuôi 2 con chó Phú Quốc.',
    'Nhà KH có 3 con mèo.',
    'KH sở hữu 10 con bò sữa ở trang trại.',
    'Nhà KH nuôi 5 con Gà.',
    // A supposition, a wish or a plan.
    'KH hỏi nếu đã kết hôn, có 2 con thì nên chuẩn bị gì.',
    'Trường hợp KH đã kết hôn, cần thêm giấy đăng ký.',
    'KH muốn có 2 con.',
    'Hai vợ chồng dự định có 3 con.',
    // A wish reaches the whole clause, however many words stand between it and the phrase.
    'KH dự định 2 năm nữa sinh thêm 1 con.',
    'KH muốn sau khi cưới có 2 con.',
    'KH muốn trong 5 năm tới có 2 con.',
    'KH muốn đợi đến khi có 2 con mới mua bảo hiểm.',
    'KH hy vọng trong tương lai gần có 2 con.',
    'KH dự định trong vài năm tới có 2 con.',
    'KH mong muốn sớm có được 2 con.',
    'KH muốn năm sau nữa có 2 con.',
    'KH muốn nhận nuôi 2 con.',
    'KH muốn trong vài năm tới vẫn sống độc thân.',
    'KH muốn đợi đến khi đã kết hôn rồi mới mua bảo hiểm.',
    'KH dự định mua nhà sau khi đã kết hôn.',
    'KH muốn trước 30 tuổi đã kết hôn.',
    'KH hy vọng đến năm 30 tuổi đã kết hôn.',
    // A wish word opening the note, with a capital.
    'Muốn có thêm 2 con.',
    'Dự định sống độc thân.',
  ])(
    'proposes nothing from %j: someone else, animals, a supposition or a wish (DR6-78)',
    async (note) => {
      const fields = [{ field: 'maritalStatus' }, { field: 'childrenCount' }];
      const output = extractionOutputSchema.parse((await complete({ note, fields })).value);
      expect(output.facts).toEqual([]);
    },
  );

  it.each([
    'KH là bác sĩ, đã kết hôn, có 2 con.',
    'KH là cô giáo, đã kết hôn, có 2 con.',
    'Chú ý: KH đã kết hôn, có 2 con.',
    'KH đã kết hôn ba năm, có 2 con.',
    'KH và vợ đã kết hôn, có 2 con.',
    'KH và chồng đã kết hôn, có 2 con.',
  ])('reads the KH in %j: a word holding a kin word may name no one else', async (note) => {
    const fields = [{ field: 'maritalStatus' }, { field: 'childrenCount' }];
    const output = extractionOutputSchema.parse((await complete({ note, fields })).value);
    expect(output.facts).toEqual([
      { field: 'maritalStatus', value: 'Đã kết hôn', quote: 'kết hôn' },
      { field: 'childrenCount', value: '2', quote: '2 con' },
    ]);
  });

  // DR6-121: what stands after a phrase, or right before it, makes it no fact about the KH either.
  it.each([
    // A question: "chưa" / "không" ending its clause, or a "?" in its sentence.
    'Lần gặp sau hỏi KH đã kết hôn chưa.',
    'Cần hỏi lại KH có 2 con không.',
    'KH đã kết hôn?',
    // A guess, before the phrase or after it.
    'Có lẽ KH đã kết hôn.',
    'Hình như KH có 2 con.',
    'Nghe nói KH đã kết hôn.',
    'KH chắc là độc thân.',
    'KH có 2 con, hình như.',
    // Children of someone else, named after the count.
    'KH đang nuôi 2 con của anh trai đã mất.',
    'KH chăm 3 cháu của chị gái.',
    // Married, then divorced, in the same sentence.
    'KH đã kết hôn nhưng đã ly hôn năm 2020.',
    'KH đã kết hôn năm 2010, ly hôn năm 2020.',
    // Said of anyone: "người" right before the phrase.
    'KH hỏi về gói cho người đã kết hôn.',
    'Gói này dành cho người độc thân.',
    // "con" of a name, a brand or a thing outside the list.
    'KH sở hữu 3 con Lexus.',
    'KH mua 2 con robot hút bụi.',
    // A condition: "khi … thì".
    'Khi KH đã kết hôn thì cần thêm giấy đăng ký.',
    'Khi KH có 2 con thì nên lập quỹ giáo dục.',
    // Left alone before CL3-C2 too.
    'Chưa rõ KH đã kết hôn.',
    'Không biết KH đã kết hôn chưa.',
    // In a later sentence: the positions are the note's, not the sentence's.
    `${LONG} Khi KH đã kết hôn thì cần giấy đăng ký.`,
    `${LONG} KH đã kết hôn nhưng đã ly hôn năm 2020.`,
  ])('proposes nothing from %j (DR6-121)', async (note) => {
    expect(await extracted(note)).toEqual([]);
  });

  it.each([
    // A "chưa" / "không" that does not end its clause asks nothing.
    ['KH đã kết hôn, có 2 con, bảo hiểm thì chưa.', [MARRIED, TWO]],
    // Divorced first, married again.
    ['KH đã ly hôn, đã kết hôn lại, có 2 con.', [MARRIED, TWO]],
    // "người" only right before the phrase.
    ['KH là người miền Nam, độc thân.', [SINGLE]],
    // "của" no more than a name that is not a kin word.
    ['KH có 2 con của anh ấy.', [TWO]],
    // "khi" and "thì" both around the phrase, and in that order.
    ['Gặp KH lần đầu khi KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['KH đã kết hôn, vợ thì làm giáo viên.', [MARRIED]],
    ['KH đã kết hôn khi 25 tuổi, nay thì đã có 2 con.', [MARRIED, TWO]],
    // A "không" right after the phrase may ask it (the review of PR #753, CX-A4).
    ['KH đã kết hôn, có 2 con không đi nhà trẻ.', [MARRIED]],
    // A "chưa" ending a line asks, and a capital on the next line is no name after "con".
    ['KH đã kết hôn chưa\nKH có 2 con.', [TWO]],
    ['KH có 2 con\nEm trai KH độc thân.', [TWO]],
    // A supposition or a "khi" after the phrase, in a later sentence, stops nothing.
    [`${LONG} KH đã kết hôn, nếu cần KH sẽ gọi lại.`, [MARRIED]],
    [`${LONG} KH đã kết hôn khi 25 tuổi, sau đó thì sinh con.`, [MARRIED]],
    // A question or a guess in another sentence leaves this one alone.
    ['Bảo hiểm thế nào? KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['Có lẽ KH ngại. KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
    // A wish after the phrase, in an earlier clause or in an earlier sentence, stops nothing.
    ['KH đã kết hôn và muốn mua bảo hiểm.', [MARRIED]],
    ['KH muốn mua bảo hiểm, đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['KH muốn mua bảo hiểm. KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
    // "sắp" / "sẽ" reach only the words right before having children or "độc thân".
    ['KH sẽ cho 2 con đi học thêm.', [TWO]],
    ['KH sẽ cân nhắc vì còn độc thân.', [SINGLE]],
    ['KH sẽ cân nhắc vì có 2 con.', [TWO]],
    ['KH sẽ cân nhắc gói cho gia đình vì có 2 con.', [TWO]],
  ])('keeps what %j says of the KH (DR6-121)', async (note, facts) => {
    expect(await extracted(note)).toEqual(facts);
  });

  it.each([
    // A wife, a husband or a friend named as the KH's own (the review of PR #682).
    ['KH đã có vợ và 2 con.', [TWO]],
    ['KH sống cùng vợ và 2 con.', [TWO]],
    ['KH sống với chồng, có 2 con.', [TWO]],
    ['KH đã lấy chồng, có 2 con.', [TWO]],
    ['KH cưới vợ năm 2015, có 2 con.', [TWO]],
    ['KH đã kết hôn với bạn học cũ, có 2 con.', [MARRIED, TWO]],
    ['KH lấy đồng nghiệp, có 2 con.', [TWO]],
    ['KH cưới người quen năm 2015, có 2 con.', [TWO]],
    // A word that holds a kin word and names no one.
    ['Ghi chú: KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['Chú thích: KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['KH chú trọng đầu tư, đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['KH là đàn ông, đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['KH bác bỏ gói cũ, đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['KH là cô dâu mới, đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['KH có em bé, đã kết hôn, có 2 con.', [MARRIED, TWO]],
    // The other way round, a word that names someone else stops it.
    ['KH nói chuyện với bạn đã kết hôn, có 2 con.', []],
    ['Vợ KH có 2 con.', []],
    // At a wedding the KH goes to, the friend is the one marrying (the review of PR #753, round 2).
    ['KH đi đám cưới bạn đã có 2 con.', []],
    ['KH đi ăn cưới đồng nghiệp đã có 2 con.', []],
    ['KH dự tiệc cưới đồng nghiệp đã có 2 con.', []],
    ['KH nhận thiệp cưới bạn đã có 2 con.', []],
    ['KH dự lễ cưới bạn đã có 2 con.', []],
    ['KH đi mừng cưới đồng nghiệp đã có 2 con.', []],
    ['KH đi cưới bạn đã có 2 con.', []],
    ['KH đi đám cưới chồng cũ đã có 2 con.', []],
  ])('reads %j as %j (the notes of PR #628 and #682)', async (note, facts) => {
    expect(await extracted(note)).toEqual(facts);
  });

  // The notes of PR #753 (T-289): what may be said of someone else gives no proposal (CX-A4).
  it.each([
    // A word holding a kin word may name the one a phrase is about, where the KH is not the subject.
    'Đàn ông trong nhà KH đều đã kết hôn.',
    'Trong nhà KH, đàn ông đều đã kết hôn.',
    'Cô dâu đã có 2 con riêng.',
    'Hôm qua cô dâu đã có 2 con riêng.',
    'Khách mới là cô dâu, đã có 2 con riêng.',
    'Chú thích sống độc thân.',
    'Bác bỏ thuốc lá, đã kết hôn.',
    'Hôm qua bác bỏ thuốc lá, đã kết hôn.',
    'Em Bé của KH đã kết hôn.',
    'Em bé nhất của KH đã kết hôn.',
    'Nhà bên có em bé, đã kết hôn.',
    // After "KH có", the youngest, a younger one or one named Bé is someone else too.
    'KH có em bé nhất đã kết hôn.',
    'KH có em bé hơn 2 tuổi, đã kết hôn.',
    'KH có em Bé, đã kết hôn.',
    // The KH's wife, husband or friend, the subject of what follows in its clause.
    'KH lấy chồng đã có 2 con riêng.',
    'KH sống với chồng có 2 con riêng.',
    'KH kết hôn với đồng nghiệp đã có 2 con riêng.',
    'KH lấy bạn đã có 2 con riêng.',
    'KH cưới vợ có 1 con riêng.',
    // A friend the KH lives with, not marries, is someone else.
    'KH sống với bạn, có 2 con.',
    // Someone else's wife, or a wife of whoever the clause is about.
    'KH làm việc với vợ của anh Nam, chị ấy có 2 con.',
    'KH sống với vợ của anh Nam, có 2 con.',
    'KH giới thiệu anh Nam, có vợ và 2 con.',
    'KH giới thiệu anh Nam có vợ và 2 con.',
    'Khách mới có vợ và 2 con, cần tư vấn.',
    'Gói gia đình dành cho người có vợ và 2 con.',
    // A wedding the KH goes to, whatever the words before "cưới".
    'KH đi dự cưới đồng nghiệp đã có 2 con.',
    'KH đi dự cưới đồng nghiệp, đã có 2 con.',
    'KH nhận thiệp mời cưới bạn đã có 2 con.',
    'KH đi dự cưới người quen đã kết hôn một lần.',
    // Children of someone else named after "của", in any case.
    'KH nuôi 2 con của Anh trai.',
    'KH đang nuôi 2 con của Chị gái đã mất.',
    'KH chăm 3 cháu của Bà Lan.',
    'KH nuôi 2 con của ba KH.',
    'KH nuôi 2 con của ba người bạn.',
    'KH trông 2 con của cô giáo.',
    'KH chăm 2 con của bác sĩ Lan.',
    'KH nuôi 2 con của vợ chồng anh Nam.',
  ])(
    'proposes nothing from %j: it may be about someone else (the notes of PR #753)',
    async (note) => {
      expect(await extracted(note)).toEqual([]);
    },
  );

  it.each([
    // "chưa", "không" or "hay" right after a phrase asks it, however its clause goes on.
    'Lần gặp sau hỏi KH đã kết hôn chưa nhé.',
    'Hỏi KH đã kết hôn chưa ạ.',
    'KH có 2 con không nhỉ.',
    'Cần hỏi KH đã kết hôn chưa để tư vấn.',
    'Hỏi KH đã kết hôn chưa và có mấy con.',
    'KH đã kết hôn chưa rõ.',
    'KH đã kết hôn hay chưa thì chưa rõ.',
    'KH độc thân hay đã kết hôn.',
    // "hay" before a phrase in its clause: the other way it may be.
    'Lần sau hỏi KH đã kết hôn hay còn độc thân.',
    'KH đi làm hay còn độc thân.',
    // A clause ending in "chưa" or "không", maybe with a particle, asks what stands before it.
    'Cần hỏi KH đã kết hôn, có con chưa.',
    'KH đã kết hôn, có con chưa, cần hỏi lại.',
    'Cần hỏi KH đã kết hôn, có con chưa nhé.',
    'Cần hỏi KH đã kết hôn, có con chưa ạ.',
    'Cần hỏi KH đã kết hôn, có con không nhỉ.',
    // More guesses.
    'Có thể KH đã kết hôn.',
    'Có vẻ KH đã kết hôn.',
    'KH đã kết hôn, có vẻ vậy.',
    'Dường như KH có 2 con.',
    'KH đã kết hôn, dường như vậy.',
    // A wish for children not born yet is a wish.
    'KH muốn mua bảo hiểm cho 2 con sắp sinh.',
    'KH muốn mua bảo hiểm cho 2 con tương lai.',
    // "người" of anyone.
    'Gói dành cho khách là người độc thân.',
  ])('proposes nothing from %j: asked, guessed or wished (the notes of PR #753)', async (note) => {
    expect(await extracted(note)).toEqual([]);
  });

  it.each([
    // "chưa" after "thì" says what is not done yet.
    ['KH có 2 con nhưng bảo hiểm thì chưa.', [TWO]],
    // A question asks what stands before it, not what follows.
    ['Hỏi KH đã mua bảo hiểm chưa, KH có 2 con.', [TWO]],
    // "hay" as a word of its own, not inside "thay".
    ['KH vừa thay việc nhưng vẫn độc thân.', [SINGLE]],
    // After the phrase, "có thể" says what can be.
    ['KH đã kết hôn, có thể đóng phí năm.', [MARRIED]],
    // "cho" spares a count that ends its clause.
    ['KH muốn mua bảo hiểm cho 2 con, ưu tiên gói học vấn.', [TWO]],
    ['Muốn lo cho 2 con', [TWO]],
    // The KH's own "là người".
    ['KH là người độc thân, sống một mình.', [SINGLE]],
    ['KH là người đã kết hôn.', [MARRIED]],
    // The KH's partner, a word or two after "KH".
    ['KH đang sống cùng vợ và 2 con.', [TWO]],
    ['KH hiện ở với chồng và 2 con.', [TWO]],
    ['KH vừa cưới vợ, có 2 con.', [TWO]],
    ['KH mới lấy chồng, có 2 con.', [TWO]],
    ['KH kết hôn với chồng năm 2015, có 2 con.', [TWO]],
    // Words that name no one, in any case.
    ['Vợ chồng KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['Bác sĩ nói KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
  ])('reads %j as %j (the notes of PR #753)', async (note, facts) => {
    expect(await extracted(note)).toEqual(facts);
  });

  // Narrow on purpose (CX-A4): the children named first stand for the people after them in the
  // sentence, so "KH có 2 con, đã kết hôn." cannot be told from "KH có 2 con, cả hai đã kết hôn.".
  it.each([
    'KH có 2 con, đã kết hôn.',
    'KH có 2 con, cả hai đã kết hôn.',
    'KH có 2 con đã kết hôn.',
  ])('proposes only the children from %j: they may be the ones married', async (note) => {
    expect(await extracted(note)).toEqual([TWO]);
  });

  // Likewise the KH's brothers and sisters: "anh em / chị em" are other people, and what is said of
  // them after "KH có ba anh em, đã kết hôn." cannot be told from "…, cả ba đã kết hôn.".
  it.each([
    'KH sống cùng anh em, đã kết hôn, có 2 con.',
    'KH sống cùng chị em, đã kết hôn, có 2 con.',
    'KH sống cùng anh chị em, đã kết hôn, có 2 con.',
    'KH có ba anh em, đã kết hôn, có 2 con.',
    'KH có ba chị em, đã kết hôn, có 2 con.',
    'KH có ba anh chị em, đã kết hôn, có 2 con.',
  ])('proposes nothing from %j: they may be the ones married', async (note) => {
    expect(await extracted(note)).toEqual([]);
  });

  it.each([
    // More people than the KH.
    'Má KH có 4 con.',
    'Thím KH đã kết hôn.',
    'Dượng KH có 3 con.',
    'Ba ruột của KH có 5 con.',
    'Ba nuôi của KH có 5 con.',
    'Ba KH có 5 con.',
    'Ba anh ấy có 5 con.',
    'Ba ấy có 5 con.',
    // A kin word before "em bé" names the baby's own people, and "em béo" is no baby (the review
    // of PR #753, round 2).
    'Ba em bé đã kết hôn.',
    'KH có em bé, ba em bé đã có 2 con riêng.',
    'Anh em bé đã kết hôn.',
    'Chị em bé đã có 2 con.',
    'Em béo của KH đã kết hôn.',
    // More negations.
    'KH chẳng có 2 con.',
    // More suppositions.
    'Giả sử KH đã kết hôn, cần giấy tờ gì.',
    'Giả như KH đã kết hôn, cần giấy tờ gì.',
    'Giả định KH đã kết hôn, cần giấy tờ gì.',
    'Giả thử KH đã kết hôn, cần giấy tờ gì.',
    'Giá mà KH đã kết hôn thì tốt.',
    'Giá như KH đã kết hôn, cần giấy tờ gì.',
    'Lỡ như KH đã kết hôn, cần giấy tờ gì.',
    'Nhỡ như KH đã kết hôn, cần giấy tờ gì.',
    // A wish word before the phrase in its clause.
    'KH muốn sớm có thêm 2 con.',
    'KH mong rất sớm có 2 con.',
    'KH mong rất sớm sinh 2 con.',
    'KH hy vọng có 2 con.',
    'KH hi vọng có 2 con.',
    'KH muốn sống độc thân đến già.',
    // "sắp" / "sẽ", up to two words before having children or "độc thân".
    'KH sắp có 2 con.',
    'KH sẽ có 2 con.',
    'Sắp có 2 con.',
    'Sẽ có 2 con.',
    'KH sẽ có thêm 2 con.',
    'KH sẽ rất sớm có được 2 con.',
    'KH sắp sinh 2 con.',
    'KH sắp đẻ 2 con.',
    'KH sẽ nhận nuôi 2 con.',
    'KH sắp độc thân.',
    'KH sẽ rất sớm độc thân.',
    // "<n> con" of animals and things outside the first lists; a capital is a name.
    'KH nuôi 2 con vẹt.',
    'KH nuôi 3 con cún.',
    'KH có 2 con thú cưng.',
    'KH có 3 con vật nuôi.',
    'KH có 2 con xe.',
    'KH có 3 con tàu.',
    'KH có 2 con thuyền.',
    'KH có 4 con dao.',
    'KH có 2 Con.',
    'Họp ngày 15 Con trai KH đến.',
  ])(
    'proposes nothing from %j: someone else, a plan or a thing that earlier lists left out',
    async (note) => {
      expect(await extracted(note)).toEqual([]);
    },
  );

  it.each([
    ...['bê', 'trâu', 'lợn', 'heo', 'gà', 'vịt', 'ngan', 'ngỗng', 'cá', 'tôm', 'cua'],
    ...['chim', 'chuột', 'ngựa', 'dê', 'cừu', 'thỏ', 'ong'],
  ])('does not read "3 con %s" as children (DR6-78)', async (animal) => {
    expect(await extracted(`KH có 3 con ${animal}.`)).toEqual([]);
  });

  // A wish earlier in the clause is for what stands after "cho", which is there already.
  it.each([
    'KH muốn đầu tư cho 2 con.',
    'Hai vợ chồng dự định mua bảo hiểm cho 2 con.',
    'KH mong lo cho 2 con ăn học.',
    'Muốn lo cho 2 con.',
  ])('proposes what a wish is for, not the wish: %j', async (note) => {
    expect(await extracted(note)).toEqual([TWO]);
  });

  it.each([
    // "cho" spares the count only right before it.
    'KH muốn có cho đủ 2 con.',
    'KH muốn sinh cho mình 2 con.',
    // And only against a wish: what a negation denies stays denied.
    'KH không muốn đầu tư cho 2 con.',
  ])('proposes nothing from %j: "cho" spares only a wish, right before the count', async (note) => {
    expect(await extracted(note)).toEqual([]);
  });

  it('proposes at most 20 phrases, counted among those about the KH', async () => {
    expect(await extracted(`${'Em trai KH độc thân. '.repeat(25)}KH có 2 con.`)).toEqual([TWO]);
    expect(await extracted('KH độc thân. '.repeat(25))).toHaveLength(20);
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
    const note = `Em trai KH còn độc thân${end} Nếu cần, gọi lại${end} KH không hút thuốc${end} KH có 2 con.`;
    const fields = [{ field: 'maritalStatus' }, { field: 'childrenCount' }];
    const output = extractionOutputSchema.parse((await complete({ note, fields })).value);
    expect(output.facts).toEqual([{ field: 'childrenCount', value: '2', quote: '2 con' }]);
  });

  // DR6-79: each sentence and clause read once. Reading back from every phrase took 2 s on the
  // first note; the best of three runs keeps a busy CI runner from failing it.
  it.each([
    ['"độc thân"', `KH ${'độc thân '.repeat(4000)}`],
    ['"<n> con"', `KH ${'có 2 con và '.repeat(3000)}`],
    // What stands after a phrase is read once for all of them too (DR6-121).
    ['"đã kết hôn"', `KH ${'đã kết hôn '.repeat(3273)}`],
    // A phrase after a run of spaces: the lookbehinds of the words for someone else, each tried at
    // every place of the run, took a second when they read it back with `\s+` (PR #753 review).
    ['spaces, then "độc thân"', `KH${' '.repeat(36_000)}độc thân`],
    ['spaces, then "em đã kết hôn"', `KH${' '.repeat(36_000)}em đã kết hôn`],
    ['spaces inside "có … vợ và 2 con"', `KH có${' '.repeat(36_000)}vợ và 2 con`],
    // The words that may stand between "KH" and the KH's partner, read back at every place (T-289).
    ['"KH có vợ và", then "độc thân"', `${'KH có vợ và '.repeat(3000)}độc thân`],
    ['"đã" between "KH" and "có vợ"', `KH${' đã'.repeat(12_000)} có vợ và 2 con`],
    ['"chưa" and spaces', `KH đã kết hôn chưa${' '.repeat(36_000)}, có 2 con`],
  ])('reads a one-line note of 36 000 characters full of %s in under 50 ms', async (_, note) => {
    const fields = [{ field: 'maritalStatus' }, { field: 'childrenCount' }];
    const times: number[] = [];
    for (let run = 0; run < 3; run++) {
      const started = Date.now();
      extractionOutputSchema.parse((await complete({ note, fields })).value);
      times.push(Date.now() - started);
    }
    expect(note.length).toBeGreaterThanOrEqual(36_000);
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
    ['KH có 3 cháu nội.', []],
    ['Nhà có 2 cháu, đều học cấp 2.', [{ field: 'childrenCount', value: '2', quote: '2 cháu' }]],
    // Not "Đã kết hôn"; living single is said as such.
    [
      'KH chưa đăng ký kết hôn, hiện sống độc thân.',
      [{ field: 'maritalStatus', value: 'Độc thân', quote: 'độc thân' }],
    ],
    [
      'KH sống cô đơn, vẫn độc thân.',
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
