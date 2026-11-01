import { evaluateKycGate } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import type { AiCompleteRequest } from './adapter';
import { AiError } from './errors';
import { extractJson } from './extract-json';
import { createMockAdapter } from './mock-extraction';
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
    'KH là bác sĩ, KH đã kết hôn, có 2 con.',
    'KH là cô giáo, KH đã kết hôn, có 2 con.',
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
    ['KH đã ly hôn, KH đã kết hôn lại, có 2 con.', [MARRIED, TWO]],
    // "người" only right before the phrase.
    ['KH là người miền Nam, KH độc thân.', [SINGLE]],
    // "khi" and "thì" both around the phrase, and in that order.
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
    ['KH muốn mua bảo hiểm, KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['KH muốn mua bảo hiểm. KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
  ])('keeps what %j says of the KH (DR6-121)', async (note, facts) => {
    expect(await extracted(note)).toEqual(facts);
  });

  it.each([
    // A wife, a husband or a friend named as the KH's own (the review of PR #682).
    ['KH đã có vợ và 2 con.', [TWO]],
    ['KH sống cùng vợ và 2 con.', [TWO]],
    ['KH sống với chồng, KH có 2 con.', [TWO]],
    ['KH đã lấy chồng, KH có 2 con.', [TWO]],
    ['KH cưới vợ năm 2015, KH có 2 con.', [TWO]],
    // After "kết hôn", when the KH married but not whom: no simple statement (DR6-141).
    ['KH đã kết hôn với bạn học cũ, KH có 2 con.', [TWO]],
    ['KH lấy đồng nghiệp, KH có 2 con.', [TWO]],
    ['KH cưới người quen năm 2015, KH có 2 con.', [TWO]],
    // A word that holds a kin word and names no one.
    ['Ghi chú: KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['Chú thích: KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['KH chú trọng đầu tư, KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['KH là đàn ông, KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['KH bác bỏ gói cũ, KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['KH là cô dâu mới, KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['KH có em bé, KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
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
    // After the phrase, "có thể" says what can be.
    ['KH đã kết hôn, có thể đóng phí năm.', [MARRIED]],
    // What a wish is for, "cho" before the count, is no simple statement either (DR6-141).
    ['KH muốn mua bảo hiểm cho 2 con, ưu tiên gói học vấn.', []],
    ['Muốn lo cho 2 con', []],
    // The KH's own "là người".
    ['KH là người độc thân, sống một mình.', [SINGLE]],
    ['KH là người đã kết hôn.', [MARRIED]],
    // The KH's partner, a word or two after "KH".
    ['KH đang sống cùng vợ và 2 con.', [TWO]],
    ['KH hiện ở với chồng và 2 con.', [TWO]],
    ['KH vừa cưới vợ, KH có 2 con.', [TWO]],
    ['KH mới lấy chồng, KH có 2 con.', [TWO]],
    ['KH kết hôn với chồng năm 2015, KH có 2 con.', [TWO]],
    // Words that name no one, in any case; someone else saying it is no simple statement (DR6-141).
    ['Vợ chồng KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['Bác sĩ khám xong, KH đã kết hôn.', [MARRIED]],
    ['Bác sĩ nói KH đã kết hôn, có 2 con.', []],
  ])('reads %j as %j (the notes of PR #753)', async (note, facts) => {
    expect(await extracted(note)).toEqual(facts);
  });

  it.each([
    // "thì / :" and "chưa / không" right after a phrase say it is not so, however the clause goes on.
    'KH đã kết hôn thì chưa, mới có người yêu.',
    'Đã kết hôn thì chưa, KH mới đính hôn.',
    'KH độc thân thì không.',
    'Độc thân thì không, KH đã có vợ.',
    'Có 2 con thì chưa, KH mới có 1 con.',
    'KH có 2 con thì không, chỉ có 1 con.',
    'KH đã kết hôn thì không đúng.',
    'Đã kết hôn: chưa rõ.',
    // Ending a clause, they say so of its topic, which holds the phrase.
    'KH đã kết hôn chính thức thì chưa.',
    'KH độc thân thật thì không.',
    'KH có 2 con riêng thì chưa nhé.',
    'KH đã kết hôn chính thức: chưa.',
    // "màu" is not "mà": no other topic starts there.
    'KH có 2 con riêng màu da khác thì không.',
    // "KH" not opening its clause is someone's, or an object, not the subject.
    'Người thụ hưởng của KH là người đã kết hôn.',
    'Đối tác của KH là người độc thân.',
    'Người yêu của KH là người độc thân.',
    'Người giới thiệu KH là người độc thân.',
    'Người yêu của KH đã có vợ và 2 con.',
    'Người yêu của KH là đàn ông, đã kết hôn.',
    // A couple someone lives with or has is not the KH's own, whether "KH" opens the clause or not.
    'KH sống cùng vợ chồng anh Nam, đã kết hôn.',
    'Năm 2015 KH cùng vợ chồng anh Nam, đã kết hôn.',
    'Khách mới ở với vợ chồng anh Nam, có 2 con.',
  ])(
    'proposes nothing from %j: said not to be, or of someone else (the review of PR #809)',
    async (note) => {
      expect(await extracted(note)).toEqual([]);
    },
  );

  it.each([
    // An answer ending a clause says nothing of what stands before its topic.
    ['KH đã kết hôn mà bảo hiểm thì chưa.', [MARRIED]],
    ['KH có 2 con còn bảo hiểm thì chưa.', [TWO]],
    ['KH đã kết hôn, có 2 con, bệnh nền: không.', [MARRIED, TWO]],
    ['KH độc thân, nợ: không.', [SINGLE]],
    ['KH độc thân, nợ:không.', [SINGLE]],
    // Inside a clause, "thì không" after more words is no answer, nor a simple statement (DR6-141).
    ['KH đã kết hôn hai năm thì không có con.', []],
    // The KH opening its clause after a bullet, a number or "Hiện…", or with a word before "là".
    ['- KH đã có vợ và 2 con.', [TWO]],
    ['1) KH đã có vợ và 2 con.', [TWO]],
    ['Hiện KH đã có vợ và 2 con.', [TWO]],
    ['Theo chị Lan, hiện KH đã có vợ và 2 con.', [TWO]],
    ['Hiện tại KH là đàn ông, KH đã kết hôn.', [MARRIED]],
    ['Hiện nay KH là người độc thân.', [SINGLE]],
    ['KH hiện là người độc thân.', [SINGLE]],
  ])('reads %j as %j (the review of PR #809)', async (note, facts) => {
    expect(await extracted(note)).toEqual(facts);
  });

  // The notes of the review of PR #809 (T-288): more ways a phrase is asked, guessed, said of
  // someone else or said not to be.
  it.each([
    // "hoặc" is "hay": the other way it may be.
    'KH đã kết hôn hoặc độc thân.',
    'Lần sau hỏi KH đã kết hôn hoặc còn độc thân.',
    'KH là người độc thân hoặc đã ly hôn.',
    // More particles after "chưa / không", and "à / hả" ending a sentence ask it.
    'Cần hỏi KH đã kết hôn, có con chưa nha.',
    'KH độc thân à.',
    'KH là người độc thân à.',
    'KH đã kết hôn hả.',
    // More guesses, and doubts: "chắc" said unsure.
    'Chắc KH đã kết hôn rồi.',
    'KH độc thân thì phải.',
    'KH đã kết hôn, hỏi lại cho chắc.',
    'KH đã kết hôn, nhưng không chắc chắn.',
    'KH đã có 2 con, nhưng chưa biết chắc.',
    // To be made sure of, or a doubt, even before "chắn"; "chắc" before what it guesses (the
    // review of PR #812).
    'KH đã kết hôn, hỏi lại cho chắc chắn.',
    'KH đã kết hôn, cần hỏi lại để chắc chắn.',
    'KH đã kết hôn, nhưng không hoàn toàn chắc chắn.',
    'KH chắc đã kết hôn.',
    // A word that only ends like one of those that are sure: "căn" is not "ăn".
    'KH đã kết hôn, mua căn chắc là ở quận 7.',
    // "của" and a count or "người": someone else's children.
    'KH nuôi 2 con của hai người bạn.',
    'KH nuôi 2 con của một người bạn.',
    'KH nuôi 2 con của người khác.',
    // Verbs that deny.
    'KH bác bỏ tin đã kết hôn.',
    'KH phủ nhận đã kết hôn.',
  ])('proposes nothing from %j (the review of PR #809)', async (note) => {
    expect(await extracted(note)).toEqual([]);
  });

  it.each([
    // "\n" ends a sentence (N19d): "Không / Chưa / Hay…" opening the next line asks nothing above.
    ['KH đã kết hôn\nKhông hút thuốc.', [MARRIED]],
    ['KH độc thân\nChưa có con.', [SINGLE]],
    ['KH đã kết hôn\nHay đi công tác.', [MARRIED]],
    ['KH có 2 con\nchưa mua bảo hiểm.', [TWO]],
    // Sure or firm is no guess (the review of PR #812 too), nor is "ạ" a question.
    ['KH chắc chắn đã kết hôn.', [MARRIED]],
    ['KH có tài chính vững chắc, KH đã kết hôn.', [MARRIED]],
    ['KH có thân hình săn chắc, KH đã kết hôn.', [MARRIED]],
    ['KH có cơ bắp rắn chắc, KH đã kết hôn.', [MARRIED]],
    ['KH biết chắc mình muốn mua bảo hiểm, KH đã kết hôn.', [MARRIED]],
    ['KH nắm chắc tài chính gia đình, KH đã có 2 con.', [TWO]],
    ['KH có 2 con, chắc ăn nên mua gói gia đình.', [TWO]],
    ['KH khẳng định chắc nịch đã kết hôn.', [MARRIED]],
    ['KH ăn chắc mặc bền, KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['KH thích nhà cửa bền chắc, KH đã có 2 con.', [TWO]],
    ['KH đã kết hôn ạ.', [MARRIED]],
    ['KH có 2 con của mình.', [TWO]],
  ])('reads %j as %j (the review of PR #809, T-288)', async (note, facts) => {
    expect(await extracted(note)).toEqual(facts);
  });

  it.each(['.', '!', '?', ';', ',', ':', '\n'])(
    'reads the KH opening a clause after %j as its subject (the review of PR #809)',
    async (mark) => {
      expect(await extracted(`Gặp KH${mark} KH là người độc thân.`)).toEqual([SINGLE]);
    },
  );

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

  // A wish earlier in the clause, whatever it is for: "cho" before the count, which T-289 read as
  // children there already, is no simple statement about the KH (DR6-141).
  it.each([
    'KH muốn đầu tư cho 2 con.',
    'Hai vợ chồng dự định mua bảo hiểm cho 2 con.',
    'KH mong lo cho 2 con ăn học.',
    'Muốn lo cho 2 con.',
    'KH muốn có cho đủ 2 con.',
    'KH muốn sinh cho mình 2 con.',
    'KH không muốn đầu tư cho 2 con.',
  ])('proposes nothing from %j: a wish, whatever it is for (DR6-141)', async (note) => {
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
    // The look back for the start of a clause, from "KH" over a long bullet (the review of PR #809).
    ['"- ", then "KH là người độc thân"', `${'- '.repeat(18_000)}KH là người độc thân`],
    // A run of spaces opening a sentence or a clause that does not open on the KH: a heading of any
    // words before ":" was read again from each place of it (the review of PR #917).
    ['spaces, then "Lan độc thân"', `${' '.repeat(36_000)}Lan độc thân`],
    [
      '"KH có 2 con,", spaces, then "Lan độc thân"',
      `KH có 2 con,${' '.repeat(36_000)}Lan độc thân`,
    ],
    [
      '"KH ở quận 1.", spaces, then "Lan đã kết hôn."',
      `KH ở quận 1.${' '.repeat(36_000)}Lan đã kết hôn.`,
    ],
    // Another count looked for after each count, to the end of its sentence (the review of PR #917):
    // "bé" is no word of `PEOPLE`, so every count reaches that look.
    ['"có 2 bé và"', `KH ${'có 2 bé và '.repeat(3273)}`],
    ['"có 2 bé", then words and no other count', `KH có 2 bé ${'đi học '.repeat(5200)}`],
    // Clauses carrying the KH on or not, a phrase in them or not; marks with no word between them,
    // each a sentence or a clause of its own.
    ['"đã kết hôn, " after one "KH"', `KH ${'đã kết hôn, '.repeat(3000)}`],
    ['"đi làm, ", then "độc thân"', `KH ${'đi làm, '.repeat(4500)}độc thân`],
    ['"KH độc thân,", spaces, then "và có 2 bé"', `KH độc thân,${' '.repeat(36_000)}và có 2 bé`],
    ['".", then "KH độc thân"', `${'.'.repeat(36_000)}KH độc thân`],
    ['",", then "KH độc thân"', `${','.repeat(36_000)}KH độc thân`],
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
    // Q1 (a) lists "con / bé" said of the KH, not "Nhà có 2 cháu" (DR6-141).
    ['Nhà có 2 cháu, đều học cấp 2.', []],
    // Not "Đã kết hôn"; living single is said as such.
    [
      'KH chưa đăng ký kết hôn, KH hiện sống độc thân.',
      [{ field: 'maritalStatus', value: 'Độc thân', quote: 'độc thân' }],
    ],
    [
      'KH sống cô đơn, KH vẫn độc thân.',
      [{ field: 'maritalStatus', value: 'Độc thân', quote: 'độc thân' }],
    ],
  ])('reads %j as %j', async (note, facts) => {
    const fields = [{ field: 'maritalStatus' }, { field: 'childrenCount' }];
    const output = extractionOutputSchema.parse((await complete({ note, fields })).value);
    expect(output.facts).toEqual(facts);
  });

  // DR6-141 (Owner 31/10, Q1 a): only a simple statement about the KH gives a proposal, so the
  // sentences of CLR4-C1 and CXR4-C1 that the rules above let through give none.
  it.each([
    // Said not to be, in words the rules do not list.
    'KH đâu có 2 con, chỉ có 1 bé.',
    'KH làm gì có 2 con, toàn nói đùa.',
    'KH có 2 con đâu, mới 1 bé thôi.',
    'KH đã kết hôn đâu, vẫn ở một mình.',
    'Ghi nhầm hôm trước, KH độc thân là sai.',
    'Thông tin KH độc thân là sai.',
    'Khẳng định KH có 2 con là sai.',
    // A time that is over.
    'Trước đây KH độc thân, năm ngoái đã kết hôn.',
    'Hồi trẻ KH có 2 con với vợ đầu, nay nuôi cả 4 con.',
    // Someone with the KH.
    'Người đi cùng KH đã kết hôn, có 2 con.',
    'Khách đi cùng KH độc thân.',
    // Things counted with "con".
    'KH có 2 con dấu công ty.',
    'KH giữ 3 con tem cổ.',
    // A plan or a condition.
    'KH định có 2 con.',
    'KH tính sinh 2 con.',
    'KH đang chuẩn bị kết hôn, đã kết hôn thì báo lại.',
    'Khi đã kết hôn, KH sẽ mua thêm gói.',
    'Đến lúc có 2 con thì KH mua gói học vấn.',
    // Choices.
    'Tình trạng: độc thân / đã kết hôn (chưa xác nhận).',
    'Chọn: [x] Độc thân [ ] Đã kết hôn',
  ])('proposes nothing from %j: not a simple statement about the KH (DR6-141)', async (note) => {
    expect(await extracted(note)).toEqual([]);
  });

  // DR6-141: what a simple statement may hold. The KH named as notes name them, the KH saying it, a
  // field line of the seed ("Hôn nhân: …", every proposal on the notes of the seed and the load
  // data), when the KH married, the children described after their count.
  it.each([
    // NT-AI-17, the note of e2e/customer-ai.spec.ts, that of run.test.ts.
    ['Khách đã kết hôn, có 2 con nhỏ', [MARRIED, TWO]],
    ['Hai vợ chồng đã kết hôn, có 2 con đang học cấp 1.', [MARRIED, TWO]],
    ['Chị nói hai vợ chồng đã kết hôn, có 2 bé.', [MARRIED, { ...TWO, quote: '2 bé' }]],
    ['Hôn nhân: Đã kết hôn; Số con: 2; Nghề nghiệp: Bác sĩ', [MARRIED]],
    ['Nơi ở: Quận 1, TP.HCM; Hôn nhân: Độc thân; Số con: 0', [{ ...SINGLE, quote: 'Độc thân' }]],
    ['KH cho biết lại Hôn nhân: Độc thân', [{ ...SINGLE, quote: 'Độc thân' }]],
    ['Tình trạng hôn nhân: Đã kết hôn', [MARRIED]],
    ['KH cho biết đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['KH đã kết hôn năm 2010, có 2 con trai.', [MARRIED, TWO]],
    ['KH đã kết hôn được 5 năm nay và có 2 con.', [MARRIED, TWO]],
    ['KH còn độc thân nên muốn mua gói hưu trí.', [SINGLE]],
    // A heading of the closed list, the KH with ":", more words that add nothing, the children told
    // apart after their count (the review of PR #917).
    ['Lưu ý: KH đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['KH: đã kết hôn, có 2 con.', [MARRIED, TWO]],
    ['KH hiện tại độc thân.', [SINGLE]],
    ['KH cũng đã kết hôn.', [MARRIED]],
    ['KH có 2 con, 1 trai 1 gái.', [TWO]],
    // Where the children are in life, from the closed list after their count.
    ['KH có 2 con đều đã lớn.', [TWO]],
    ['KH có 2 con gái đang học đại học.', [TWO]],
    // Someone named, then a clause or a sentence opening on the KH again; a word that starts another
    // clause on the KH right after a phrase about the KH.
    ['KH gặp anh Nam, KH đã kết hôn.', [MARRIED]],
    ['KH giới thiệu anh Nam. KH cho biết đã kết hôn.', [MARRIED]],
    ['Gặp anh Nam ở quận 1.\nHôn nhân: Độc thân', [{ ...SINGLE, quote: 'Độc thân' }]],
    ['KH độc thân nhưng có 2 con.', [SINGLE, TWO]],
    ['KH đã kết hôn, và có 2 con.', [MARRIED, TWO]],
    // Another value said of someone else, or said not to be, is none said of the KH.
    ['KH đã kết hôn, em trai KH độc thân.', [MARRIED]],
    ['KH đã kết hôn, không còn độc thân.', [MARRIED]],
    ['KH độc thân. Em gái đã kết hôn.', [SINGLE]],
    // "mất" without "đã" ends nothing.
    ['KH đã kết hôn, mất việc năm ngoái.', [MARRIED]],
    // "khách" after the KH may be someone else: "người" before a phrase is then of anyone.
    ['KH đã kết hôn, khách là người độc thân.', [MARRIED]],
  ])('reads %j as %j: a simple statement about the KH (DR6-141)', async (note, facts) => {
    expect(await extracted(note)).toEqual(facts);
  });

  it.each([
    // A clause that does not open on the KH speaks of the KH only after one that does.
    'Hôm qua gặp KH, đã kết hôn, có 2 con.',
    'KH sống ở quận 7. Đã kết hôn, có 2 con.',
    // "Anh" or "chị" may be the KH, or not: only the KH saying it ("Chị nói …") names the KH.
    'Anh ấy đã kết hôn, có 2 con.',
    'Chị gái đã kết hôn, có 2 con.',
    // A field line of someone else; a phrase in the heading before the KH, in a clause that opens
    // on no KH (":" ends none).
    'Vợ: đã kết hôn, có 2 con.',
    'Độc thân và có 2 con: KH chưa xác nhận.',
    'Độc thân: KH đã kết hôn.',
    // Grandchildren, as (a) lists only "con / bé".
    'KH có 2 cháu.',
    // Kept by DR6-121 before (a) (Owner 31/10): "khi" before the phrase, a verb before the count.
    'Gặp KH lần đầu khi KH đã kết hôn, có 2 con.',
    'KH sẽ cho 2 con đi học thêm.',
  ])('proposes nothing from %j: not said of the KH (DR6-141)', async (note) => {
    expect(await extracted(note)).toEqual([]);
  });

  // The review of PR #917.
  it.each([
    // A heading outside the closed list: a correction, a question, hearsay, someone else.
    'Sai: KH độc thân.',
    'Ghi nhầm: KH có 2 con.',
    'Đính chính: KH có 2 con.',
    'Cần hỏi: KH đã kết hôn, có 2 con.',
    'Câu hỏi: KH đã kết hôn, có 2 con.',
    'Kiểm tra: KH đã kết hôn, có 2 con.',
    'Tin đồn: KH đã kết hôn.',
    'Bác sĩ cho biết: KH đã kết hôn, có 2 con.',
    'Bác sĩ: KH đã kết hôn, có 2 con.',
    // "nên" (should), "mà" (if) right after the KH end no clause before the phrase.
    'KH nên có 2 con.',
    'KH nên độc thân.',
    'KH mà có 2 con, thì đã mua gói.',
    // After someone, "mà" and "còn" say who they are ("một người mà / còn …"), not the KH.
    'KH quen một người mà độc thân.',
    'KH thích người còn độc thân.',
    'KH quen một người còn độc thân.',
    'KH đang hẹn hò với một người còn độc thân.',
    'KH có người yêu mà đã kết hôn.',
    'KH đang tìm hiểu một người mà đã có 2 con.',
    'KH lấy người mà đã có 2 con.',
    // Another count of children after the first: neither is how many the KH has.
    'KH có 2 con trai và 1 con gái.',
    'KH có 2 con nhỏ và 1 con lớn.',
    'KH có 2 con gái, 1 con trai.',
    // Wherever it stands after the first in the sentence, past the children described, in figures
    // or in words.
    'KH có 2 con đang đi học và 1 con đã đi làm.',
    'KH có 2 con gái đang đi học và 1 con trai đã đi làm.',
    'KH có 2 con đang học, 1 con đã đi làm.',
    'KH có 2 con đều đã lập gia đình, 1 con đang học.',
    'KH có 2 con đã lớn, 1 bé mới sinh.',
    'KH có 2 con, và 1 con riêng.',
    'KH có 2 con của mình và 1 con nuôi.',
    'KH có 2 con trai và một con gái.',
    'KH có 2 bé, thêm một bé nữa.',
    // After the children described, only words of the closed list: whoever else's children they
    // are, a baby not born, children looked after for someone; "anh ấy" may be the KH's partner or
    // someone else (kept by DR6-121 before, Owner 31/10).
    'KH có 2 con của anh ấy.',
    'KH ở với 2 con nhỏ của em gái.',
    'KH sống cùng 2 con trai của anh họ.',
    'KH có 2 con gái của bạn thân.',
    'KH có 2 con nhỏ của Lan.',
    'KH có 2 con của Lan gửi nuôi.',
    'KH có 2 bé đang trong bụng.',
    'KH có 2 con đang nuôi giúp người quen.',
    // A clause that does not open on the KH speaks of the KH only after one ending on a phrase
    // about the KH: after any other words, it may speak of whoever they name, however named.
    'KH giới thiệu anh Nam, đã kết hôn, có 2 con.',
    'KH đi cùng chị Lan, độc thân.',
    'KH gặp Bà Tư, có 2 con.',
    'KH giới thiệu Nam, đã kết hôn.',
    'KH giới thiệu anh nam, đã kết hôn.',
    'KH đi cùng một người, đã kết hôn.',
    'KH gặp người yêu cũ, đã kết hôn, có 2 con.',
    'KH giới thiệu khách mới, đã kết hôn, có 2 con.',
    'KH là bác sĩ, Lan là y tá, độc thân.',
    'KH là bác sĩ, lan là y tá, độc thân.',
    'KH gặp sinh viên, độc thân.',
    'KH tư vấn cho giám đốc, đã kết hôn.',
    'KH đi với ai đó, đã kết hôn.',
    'KH đi cùng họ, có 2 con.',
    'KH là chủ nhà của một sinh viên, độc thân.',
    // Nor after a first clause that is no phrase, whatever it says of the KH: a job, a partner, a
    // baby (Owner 31/10; the tests above say the same with "KH" opening the later clause).
    'KH là bác sĩ, đã kết hôn, có 2 con.',
    'KH là người miền Nam, độc thân.',
    'KH sống với chồng, có 2 con.',
    'KH cưới người quen năm 2015, có 2 con.',
    'KH có em bé, đã kết hôn.',
    // After a comma only "KH" opens a clause on the KH: "chị nói", "khách", "hai vợ chồng" may be
    // someone named before them.
    'KH đi cùng chị Lan, chị nói đã kết hôn.',
    'KH giới thiệu anh Nam, anh cho biết đã kết hôn.',
    'KH giới thiệu anh Nam, hai vợ chồng đã kết hôn 5 năm.',
    'KH là chủ nhà, khách độc thân.',
    'KH giới thiệu khách mới, khách đã kết hôn.',
    // Nor after a sentence's end: they name the KH only opening the note, before anything else, and
    // a field line says it is the KH's by "KH" only, as the seed writes it.
    'KH giới thiệu khách mới. Khách đã kết hôn.',
    'KH đi cùng chị Lan. Chị nói đã kết hôn.',
    'KH giới thiệu anh Nam. Hai vợ chồng đã kết hôn 5 năm.',
    'KH giới thiệu anh Nam. Anh cho biết đã kết hôn.',
    'KH đi cùng chị Lan. Chị nói hôn nhân: độc thân.',
    'KH giới thiệu anh Nam. Anh cho biết lại hôn nhân: đã kết hôn.',
    'KH giới thiệu khách mới. Khách cho biết hôn nhân: độc thân.',
    // "Khách" spares no "người" of anyone, as "KH" does (`KH_SUBJECT`): the safe way.
    'Khách là người độc thân.',
    // In a clause, a word that starts another carries the KH on only right after a phrase about the
    // KH (Owner 31/10): after other words, it may be said of whoever they name.
    'KH giới thiệu anh nam nhưng đã kết hôn.',
    'KH đi cùng một người và độc thân.',
    'KH gặp người yêu cũ vì có 2 con.',
    'KH giới thiệu khách mới và đã kết hôn.',
    'KH sẽ cân nhắc vì còn độc thân.',
    'KH sẽ cân nhắc vì có 2 con.',
    'KH sẽ cân nhắc gói cho gia đình vì có 2 con.',
    'KH vừa thay việc nhưng vẫn độc thân.',
    'KH đi làm xa, nhưng vẫn độc thân.',
    // A field line opens on the KH only opening its sentence, as the seed writes it: after a
    // comma, it may be the line of someone named before it.
    'Người giới thiệu: chị Lan, hôn nhân: độc thân.',
    'Chị Lan, hôn nhân: độc thân.',
    'Anh Nam, hôn nhân: đã kết hôn.',
    // Said to be wrong in the note, in the sentence or a later one (Correctness 5, the family of
    // CXR4-C1; Owner 31/10).
    'KH độc thân, điều này sai.',
    'KH đã kết hôn, không đúng.',
    'KH có 2 con, ghi nhầm.',
    'KH đã kết hôn, thông tin chưa chính xác.',
    'KH độc thân, điều này không còn đúng.',
    'KH độc thân. Điều này sai.',
    'KH có 2 con. Sai rồi, chỉ 1 con.',
    // Two values of one trường in the note, none of someone else: a note that corrects itself, in
    // the sentence or a later one (Owner 31/10).
    'KH độc thân, thực ra đã kết hôn.',
    'KH độc thân, nay đã kết hôn.',
    'KH độc thân, KH đã kết hôn.',
    'KH có 2 con. Thực ra chỉ 1 con.',
    'KH độc thân. Nay KH đã kết hôn.',
    'KH độc thân. Hiện KH đã kết hôn.',
    // What ends a marriage later in the sentence, as "ly hôn" does (DR6-121): "ly dị", "ly thân", a
    // death, "góa"; and a death after the children (Owner 31/10).
    'KH đã kết hôn năm 2010 nhưng đã ly dị.',
    'KH đã kết hôn, đã ly dị năm 2020.',
    'KH đã kết hôn nhưng đang ly thân.',
    'KH đã kết hôn nhưng vợ đã mất.',
    'KH đã kết hôn mà vợ đã mất.',
    'KH đã kết hôn nhưng chồng qua đời năm 2020.',
    'KH đã kết hôn, nay góa vợ.',
    'KH có 2 con nhưng đều đã mất.',
  ])(
    'proposes nothing from %j: not a simple statement either (the review of PR #917)',
    async (note) => {
      expect(await extracted(note)).toEqual([]);
    },
  );

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
