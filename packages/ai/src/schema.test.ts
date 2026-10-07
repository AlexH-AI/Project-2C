import { describe, expect, it } from 'vitest';
import {
  analysisOutputSchema,
  discoveryOutputSchema,
  extractionOutputSchema,
  factCode,
} from './schema';

const item = (text: string, ...evidence: string[]) => ({ text, evidence });
const items = (count: number) => Array.from({ length: count }, (_, i) => item(`Ý ${i + 1}`, 'F1'));

const analysis = () => ({
  hypotheses: [item('KH ưu tiên sự an toàn cho gia đình', 'F1', 'F2')],
  needs: [item('Quỹ học vấn cho con', 'F3')],
  painPoints: [item('Thanh khoản khi cần tiền gấp', 'F4')],
  themes: [item('Gia đình là trung tâm', 'F1')],
  discoveryStrategy: [{ text: 'Hỏi thêm về khẩu vị rủi ro', missingCategory: 'RISK_APPETITE' }],
  nextBestActions: [item('Hẹn trao đổi về kế hoạch học vấn', 'F3')],
  personalityNotes: [{ system: 'PSYCHOLOGY', text: 'KH có thể thuộc nhóm INTJ', evidence: ['F1'] }],
});

const discovery = () => ({
  hypotheses: [],
  discoveryStrategy: [
    { text: 'Tìm hiểu quy mô tài sản', evidence: [], missingCategory: 'ASSETS' },
    item('Làm rõ mối quan tâm chính', 'F2'),
  ],
  nextBestActions: [item('Gửi lời mời gặp lại', 'F1')],
  personalityNotes: [],
});

const note = (system: string, ...evidence: string[]) => ({
  system,
  text: 'KH có thể tuổi Tý, mệnh Kim',
  evidence,
});
const notes = (count: number) => Array.from({ length: count }, () => note('ESOTERIC', 'F3'));

const errorsOf = (result: { success: boolean; error?: { issues: { path: PropertyKey[] }[] } }) =>
  result.success ? [] : result.error!.issues.map((issue) => issue.path.join('.'));

describe('analysisOutputSchema', () => {
  it('accepts a valid output and trims its text', () => {
    const output = analysis();
    output.themes[0]!.text = '  Gia đình là trung tâm  ';
    const parsed = analysisOutputSchema.parse(output);
    expect(parsed.themes[0]!.text).toBe('Gia đình là trung tâm');
    expect(parsed.discoveryStrategy[0]!.evidence).toEqual([]);
  });

  it.each(['hypotheses', 'needs', 'painPoints', 'themes', 'nextBestActions'] as const)(
    '%s holds 1–5 elements',
    (block) => {
      expect(analysisOutputSchema.safeParse({ ...analysis(), [block]: items(5) }).success).toBe(
        true,
      );
      expect(errorsOf(analysisOutputSchema.safeParse({ ...analysis(), [block]: [] }))).toEqual([
        block,
      ]);
      expect(
        errorsOf(analysisOutputSchema.safeParse({ ...analysis(), [block]: items(6) })),
      ).toEqual([block]);
    },
  );

  it('discoveryStrategy holds 1–6 elements', () => {
    expect(
      analysisOutputSchema.safeParse({ ...analysis(), discoveryStrategy: items(6) }).success,
    ).toBe(true);
    expect(
      errorsOf(analysisOutputSchema.safeParse({ ...analysis(), discoveryStrategy: [] })),
    ).toEqual(['discoveryStrategy']);
    expect(
      errorsOf(analysisOutputSchema.safeParse({ ...analysis(), discoveryStrategy: items(7) })),
    ).toEqual(['discoveryStrategy']);
  });

  it('needs evidence on hypotheses, needs, pain points and themes', () => {
    const output = { ...analysis(), needs: [item('Quỹ học vấn cho con')] };
    expect(errorsOf(analysisOutputSchema.safeParse(output))).toEqual(['needs.0.evidence']);
  });

  it.each([
    ['empty', ''],
    ['only spaces', '   '],
    ['over 300 characters', 'a'.repeat(301)],
  ])('rejects text that is %s', (_, text) => {
    const output = { ...analysis(), themes: [item(text, 'F1')] };
    expect(errorsOf(analysisOutputSchema.safeParse(output))).toEqual(['themes.0.text']);
  });

  it('accepts 300 characters after trimming', () => {
    const output = { ...analysis(), themes: [item(` ${'a'.repeat(300)} `, 'F1')] };
    expect(analysisOutputSchema.safeParse(output).success).toBe(true);
  });

  it('rejects the same evidence twice', () => {
    const output = { ...analysis(), themes: [item('Gia đình là trung tâm', 'F1', 'F2', 'F1')] };
    expect(errorsOf(analysisOutputSchema.safeParse(output))).toEqual(['themes.0.evidence']);
  });

  it.each(['F0', 'F01', 'f1', 'F-1', 'F1a', ''])('rejects the evidence code %j', (code) => {
    const output = { ...analysis(), themes: [item('Gia đình là trung tâm', code)] };
    expect(errorsOf(analysisOutputSchema.safeParse(output))).toEqual(['themes.0.evidence.0']);
  });

  it.each(['discoveryStrategy', 'nextBestActions'] as const)(
    '%s needs evidence or a missing hạng mục',
    (block) => {
      const neither = { ...analysis(), [block]: [{ text: 'Hỏi thêm', evidence: [] }] };
      expect(errorsOf(analysisOutputSchema.safeParse(neither))).toEqual([`${block}.0`]);
      const both = {
        ...analysis(),
        [block]: [{ text: 'Hỏi thêm', evidence: ['F1'], missingCategory: 'GOALS' }],
      };
      expect(analysisOutputSchema.safeParse(both).success).toBe(true);
    },
  );

  it('rejects a missing hạng mục that is not in the catalog', () => {
    const output = {
      ...analysis(),
      discoveryStrategy: [{ text: 'Hỏi thêm', missingCategory: 'HOBBIES' }],
    };
    expect(errorsOf(analysisOutputSchema.safeParse(output))).toEqual([
      'discoveryStrategy.0.missingCategory',
    ]);
  });

  it('rejects an output without a block', () => {
    const output: Partial<ReturnType<typeof analysis>> = analysis();
    delete output.themes;
    expect(errorsOf(analysisOutputSchema.safeParse(output))).toEqual(['themes']);
  });
});

describe('discoveryOutputSchema', () => {
  it('accepts a valid output with no hypothesis', () => {
    expect(discoveryOutputSchema.safeParse(discovery()).success).toBe(true);
  });

  it('drops the analysis-only blocks', () => {
    const parsed = discoveryOutputSchema.parse({ ...discovery(), needs: items(1) });
    expect(parsed).not.toHaveProperty('needs');
  });

  it.each([
    ['hypotheses', 0, 3],
    ['discoveryStrategy', 2, 6],
    ['nextBestActions', 1, 5],
  ] as const)('%s holds %i–%i elements', (block, min, max) => {
    expect(discoveryOutputSchema.safeParse({ ...discovery(), [block]: items(min) }).success).toBe(
      true,
    );
    expect(discoveryOutputSchema.safeParse({ ...discovery(), [block]: items(max) }).success).toBe(
      true,
    );
    if (min > 0) {
      expect(
        errorsOf(discoveryOutputSchema.safeParse({ ...discovery(), [block]: items(min - 1) })),
      ).toEqual([block]);
    }
    expect(
      errorsOf(discoveryOutputSchema.safeParse({ ...discovery(), [block]: items(max + 1) })),
    ).toEqual([block]);
  });

  it('needs evidence on hypotheses', () => {
    const output = { ...discovery(), hypotheses: [item('KH thận trọng')] };
    expect(errorsOf(discoveryOutputSchema.safeParse(output))).toEqual(['hypotheses.0.evidence']);
  });

  it('rejects a strategy with neither evidence nor a missing hạng mục', () => {
    const output = {
      ...discovery(),
      discoveryStrategy: [{ text: 'Hỏi thêm' }, item('Làm rõ', 'F2')],
    };
    expect(errorsOf(discoveryOutputSchema.safeParse(output))).toEqual(['discoveryStrategy.0']);
  });
});

describe.each([
  ['analysisOutputSchema', analysisOutputSchema, analysis],
  ['discoveryOutputSchema', discoveryOutputSchema, discovery],
] as const)('personalityNotes of %s', (_, schema, valid) => {
  const withNotes = (personalityNotes: unknown) => ({ ...valid(), personalityNotes });

  it('holds 0–4 notes of either system', () => {
    expect(schema.safeParse(withNotes([])).success).toBe(true);
    const four = [note('PSYCHOLOGY', 'F1'), ...notes(3)];
    expect(schema.parse(withNotes(four)).personalityNotes).toEqual(four);
    expect(errorsOf(schema.safeParse(withNotes(notes(5))))).toEqual(['personalityNotes']);
  });

  it('is required, as an empty list when there is no note', () => {
    const output: Partial<ReturnType<typeof valid>> = valid();
    delete output.personalityNotes;
    expect(errorsOf(schema.safeParse(output))).toEqual(['personalityNotes']);
  });

  it.each([
    ['an unknown system', note('MBTI', 'F1'), 'personalityNotes.0.system'],
    ['no evidence', note('PSYCHOLOGY'), 'personalityNotes.0.evidence'],
    ['the same evidence twice', note('ESOTERIC', 'F3', 'F3'), 'personalityNotes.0.evidence'],
    ['an empty text', { ...note('ESOTERIC', 'F3'), text: ' ' }, 'personalityNotes.0.text'],
  ])('rejects a note with %s', (_, bad, path) => {
    expect(errorsOf(schema.safeParse(withNotes([bad])))).toEqual([path]);
  });
});

describe('extractionOutputSchema', () => {
  const fact = { field: 'childrenCount', value: '2', quote: 'hai vợ chồng có 2 bé' };

  it('accepts text, number and yes/no values, and no fact at all', () => {
    expect(extractionOutputSchema.safeParse({ facts: [] }).success).toBe(true);
    const facts = [fact, { ...fact, value: 2 }, { ...fact, field: 'hasProtection', value: true }];
    expect(extractionOutputSchema.parse({ facts }).facts.map((f) => f.value)).toEqual([
      '2',
      2,
      true,
    ]);
  });

  it('holds at most 20 facts', () => {
    expect(extractionOutputSchema.safeParse({ facts: Array(20).fill(fact) }).success).toBe(true);
    expect(errorsOf(extractionOutputSchema.safeParse({ facts: Array(21).fill(fact) }))).toEqual([
      'facts',
    ]);
  });

  it.each([
    ['field', ''],
    ['quote', '  '],
    ['value', ''],
    ['value', 'a'.repeat(301)],
    ['quote', 'a'.repeat(301)],
    ['value', null],
    ['value', Number.NaN],
  ])('rejects the %s %j', (key, value) => {
    expect(
      errorsOf(extractionOutputSchema.safeParse({ facts: [{ ...fact, [key]: value }] })),
    ).toEqual([`facts.0.${key}`]);
  });
});

describe('factCode', () => {
  it('is F followed by the fact seq', () => {
    expect(factCode(12)).toBe('F12');
  });

  it.each([0, -1, 1.5])('rejects the seq %d', (seq) => {
    expect(() => factCode(seq)).toThrow(RangeError);
  });
});
