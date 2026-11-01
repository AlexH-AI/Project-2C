import { describe, expect, it } from 'vitest';
import type { AiMode } from './schema';
import { NUL, ZWSP } from './test-support';
import { validateOutput, type OutputCheckInput } from './validator';

const item = (text: string, ...evidence: string[]) => ({ text, evidence });

const input: OutputCheckInput = {
  factCodes: ['F1', 'F2', 'F3', 'F4'],
  missingCategories: ['RISK_APPETITE'],
};

const analysis = () => ({
  hypotheses: [item('KH có thể ưu tiên sự an toàn cho gia đình', 'F1', 'F2')],
  needs: [item('Quỹ học vấn cho con', 'F3')],
  painPoints: [item('Thanh khoản khi cần tiền gấp', 'F4')],
  themes: [item('Gia đình là trung tâm', 'F1')],
  discoveryStrategy: [{ text: 'Hỏi thêm về khẩu vị đầu tư', missingCategory: 'RISK_APPETITE' }],
  nextBestActions: [item('Hẹn trao đổi về kế hoạch học vấn', 'F3')],
  personalityNotes: [{ system: 'PSYCHOLOGY', text: 'KH có thể thuộc nhóm INTJ', evidence: ['F1'] }],
});

const discovery = () => ({
  hypotheses: [],
  discoveryStrategy: [
    { text: 'Tìm hiểu khẩu vị đầu tư', evidence: [], missingCategory: 'RISK_APPETITE' },
    item('Làm rõ mối quan tâm chính', 'F2'),
  ],
  nextBestActions: [item('Hẹn buổi gặp tiếp', 'F1')],
  personalityNotes: [],
});

describe('validateOutput — V1', () => {
  it('passes a well-formed analysis and discovery', () => {
    expect(validateOutput('analysis', analysis(), input)).toEqual([]);
    expect(validateOutput('discovery', discovery(), input)).toEqual([]);
  });

  it('reports a missing JSON block at the root', () => {
    expect(validateOutput('analysis', null, input)).toEqual([
      { code: 'V1', path: '$', detail: 'không có khối JSON' },
    ]);
    expect(validateOutput('extraction', null)).toEqual([
      { code: 'V1', path: '$', detail: 'không có khối JSON' },
    ]);
  });

  it('reports an answer with no JSON block given as undefined the same way', () => {
    expect(validateOutput('analysis', undefined, input)).toEqual([
      { code: 'V1', path: '$', detail: 'không có khối JSON' },
    ]);
  });

  it('needs the input whenever the mode may be analysis or discovery', () => {
    const mode = 'analysis' as AiMode;
    expect(validateOutput(mode, analysis(), input)).toEqual([]);
    // @ts-expect-error V2–V6 cannot run without the input
    expect(() => validateOutput(mode, analysis())).toThrow(TypeError);
    // @ts-expect-error same for a literal mode
    expect(() => validateOutput('discovery', discovery())).toThrow(TypeError);
  });

  it.each([
    ['a value of the wrong type', { ...analysis(), needs: 'x' }, 'needs', 'sai kiểu, cần array'],
    ['a missing block', { ...analysis(), themes: undefined }, 'themes', 'thiếu, cần array'],
    ['a block that is null', { ...analysis(), themes: null }, 'themes', 'sai kiểu, cần array'],
    [
      'a missing text',
      { ...analysis(), needs: [{ evidence: ['F1'] }] },
      'needs[0].text',
      'thiếu, cần string',
    ],
    ['an empty block', { ...analysis(), themes: [] }, 'themes', 'cần ít nhất 1 phần tử'],
    [
      'too many elements',
      { ...analysis(), needs: Array.from({ length: 6 }, () => item('Ý', 'F1')) },
      'needs',
      'quá 5 phần tử',
    ],
    ['an empty text', { ...analysis(), needs: [item('  ', 'F1')] }, 'needs[0].text', 'chuỗi rỗng'],
    [
      'a text of format characters only',
      { ...analysis(), needs: [item(ZWSP, 'F1')] },
      'needs[0].text',
      'chuỗi rỗng',
    ],
    [
      'a text with no letter',
      { ...analysis(), needs: [item('…', 'F1')] },
      'needs[0].text',
      'không có chữ',
    ],
    // G5 §14.5: V3–V6 drop NUL, V1 counts it as K20 does, so it is no empty text.
    [
      'a text of NUL only',
      { ...analysis(), needs: [item(NUL, 'F1')] },
      'needs[0].text',
      'không có chữ',
    ],
    [
      'a text over 300 characters',
      { ...analysis(), needs: [item('a'.repeat(301), 'F1')] },
      'needs[0].text',
      'quá 300 ký tự',
    ],
    [
      'a text over 1 000 characters as written (DR6-77)',
      { ...analysis(), needs: [item(`Ý${ZWSP.repeat(1000)}`, 'F1')] },
      'needs[0].text',
      'quá 1 000 ký tự kể cả ký tự vô hình',
    ],
    [
      'a text of default-ignorable characters only',
      { ...analysis(), needs: [item('\u3164\u034f', 'F1')] },
      'needs[0].text',
      'chuỗi rỗng',
    ],
    [
      'a malformed fact code',
      { ...analysis(), needs: [item('Ý', 'F01')] },
      'needs[0].evidence[0]',
      'sai định dạng, cần mã dữ kiện dạng F12',
    ],
    [
      'an unknown hạng mục',
      { ...analysis(), discoveryStrategy: [{ text: 'Ý', missingCategory: 'HOBBIES' }] },
      'discoveryStrategy[0].missingCategory',
      'giá trị không hợp lệ, cần một trong: IDENTITY, FAMILY, OCCUPATION_INCOME, ASSETS, GOALS, RISK_APPETITE, EXISTING_PROTECTION, CONCERNS',
    ],
    [
      'an unknown personality system',
      {
        ...analysis(),
        personalityNotes: [{ system: 'MBTI', text: 'KH có thể thuộc nhóm INTJ', evidence: ['F1'] }],
      },
      'personalityNotes[0].system',
      'giá trị không hợp lệ, cần một trong: PSYCHOLOGY, ESOTERIC',
    ],
    [
      'the same fact twice',
      { ...analysis(), needs: [item('Ý', 'F1', 'F1')] },
      'needs[0].evidence',
      'trích trùng một dữ kiện',
    ],
    [
      'an action with neither evidence nor hạng mục',
      { ...analysis(), nextBestActions: [{ text: 'Ý', evidence: [] }] },
      'nextBestActions[0]',
      'cần evidence hoặc missingCategory',
    ],
  ])('reports %s with its path', (_, output, path, detail) => {
    expect(validateOutput('analysis', output, input)).toEqual([{ code: 'V1', path, detail }]);
  });

  it('checks the schema of the mode', () => {
    expect(validateOutput('discovery', analysis(), input)).toEqual([
      { code: 'V1', path: 'discoveryStrategy', detail: 'cần ít nhất 2 phần tử' },
    ]);
    expect(validateOutput('analysis', discovery(), input).map((issue) => issue.path)).toEqual([
      'hypotheses',
      'needs',
      'painPoints',
      'themes',
    ]);
  });

  it('lists 30 issues at most, the rest counted in one (review #521)', () => {
    // Thousands of malformed codes are one V1 issue each from the schema.
    const codes = Array.from({ length: 3000 }, (_, i) => `X${i}`);
    const output = { ...analysis(), hypotheses: [item('KH ưu tiên con', ...codes)] };
    const issues = validateOutput('analysis', output, input);
    expect(issues).toHaveLength(30);
    expect(issues[28]).toEqual({
      code: 'V1',
      path: 'hypotheses[0].evidence[28]',
      detail: 'sai định dạng, cần mã dữ kiện dạng F12',
    });
    expect(issues[29]).toEqual({ code: 'V1', path: '$', detail: 'và 2971 lỗi khác' });
  });

  it('lists exactly 30 issues as they are', () => {
    const codes = Array.from({ length: 30 }, (_, i) => `X${i}`);
    const output = { ...analysis(), hypotheses: [item('KH ưu tiên con', ...codes)] };
    const issues = validateOutput('analysis', output, input);
    expect(issues).toHaveLength(30);
    expect(issues[29]).toMatchObject({ path: 'hypotheses[0].evidence[29]' });
  });

  // G5 §13.2 (Owner 23/10/2026): the panel tells an answer with no JSON block, or one cut, by its one
  // V1 issue on the whole output. The block of an answer is always an object, the schemas objects
  // neither strict nor refined at their root, and "và K lỗi khác" comes after 29 other issues: no
  // block ever gets that report.
  it.each([
    ['an empty block', {}],
    ['a block with a key of its own', { tomTat: 'Tóm tắt' }],
    ['a block of the wrong types', { hypotheses: 1, needs: 'x', themes: null }],
    [
      'a block with more than 30 issues',
      {
        ...analysis(),
        hypotheses: [item('KH ưu tiên con', ...Array.from({ length: 40 }, (_, i) => `X${i}`))],
      },
    ],
  ])('never reports %s as one V1 issue on the whole output', (_, block) => {
    for (const mode of ['analysis', 'discovery'] as const) {
      const issues = validateOutput(mode, block, input);
      expect(issues.length === 1 && issues[0]!.code === 'V1' && issues[0]!.path === '$').toBe(
        false,
      );
    }
  });

  it('runs no other rule on an output the schema rejects', () => {
    const output = { ...analysis(), needs: [item('Xác suất 90%', 'F99')], themes: [] };
    expect(validateOutput('analysis', output, input).map((issue) => issue.code)).toEqual(['V1']);
  });

  it('reports a root that is not an object, and an extraction value of no allowed type', () => {
    expect(validateOutput('analysis', [], input)).toEqual([
      { code: 'V1', path: '$', detail: 'sai kiểu, cần object' },
    ]);
    expect(
      validateOutput('extraction', { facts: [{ field: 'occupation', value: null, quote: 'Ý' }] }),
    ).toEqual([
      { code: 'V1', path: 'facts[0].value', detail: 'sai kiểu, cần string, number hoặc boolean' },
    ]);
  });

  // G5 §11.6 (Owner 18/10/2026, DR6-24): a key left out is said to be missing.
  it('says which keys are missing, in an extraction and at the root of an analysis', () => {
    expect(validateOutput('extraction', {})).toEqual([
      { code: 'V1', path: 'facts', detail: 'thiếu, cần array' },
    ]);
    expect(validateOutput('extraction', { facts: [{ field: 'occupation', quote: 'Ý' }] })).toEqual([
      { code: 'V1', path: 'facts[0].value', detail: 'thiếu, cần string, number hoặc boolean' },
    ]);
    expect(validateOutput('analysis', {}, input).map((issue) => issue.detail)).toEqual(
      Array(6).fill('thiếu, cần array'),
    );
    const note = { text: 'KH có thể thuộc nhóm INTJ', evidence: ['F1'] };
    expect(validateOutput('analysis', { ...analysis(), personalityNotes: [note] }, input)).toEqual([
      {
        code: 'V1',
        path: 'personalityNotes[0].system',
        detail: 'thiếu, cần một trong: PSYCHOLOGY, ESOTERIC',
      },
    ]);
  });

  it.each([
    ['empty', '', 'chuỗi rỗng'],
    ['of invisible characters only', ZWSP.repeat(3), 'chuỗi rỗng'],
    ['over 1 000 characters as written', 'a'.repeat(1001), 'quá 1 000 ký tự kể cả ký tự vô hình'],
  ])('tells an extraction value that is a string %s the rule it breaks', (_, value, detail) => {
    const facts = [{ field: 'occupation', value, quote: 'Ý' }];
    expect(validateOutput('extraction', { facts })).toEqual([
      { code: 'V1', path: 'facts[0].value', detail },
    ]);
  });

  // G5 §11.5: the cap is checked first and alone, so a huge string costs nothing more.
  it.each([
    ['letters', 'a'.repeat(1001)],
    ['invisible characters', ZWSP.repeat(1001)],
    ['an ellipsis and invisible characters', `…${ZWSP.repeat(1000)}`],
  ])('reports only the cap for a text of 1 001 %s', (_, text) => {
    expect(validateOutput('analysis', { ...analysis(), needs: [item(text, 'F1')] }, input)).toEqual(
      [{ code: 'V1', path: 'needs[0].text', detail: 'quá 1 000 ký tự kể cả ký tự vô hình' }],
    );
  });
});

describe('validateOutput — V2', () => {
  it('passes evidence and hạng mục taken from the input', () => {
    expect(validateOutput('analysis', analysis(), input)).toEqual([]);
  });

  it('reports a fact code that is not in the input, such as a superseded fact', () => {
    const output = {
      ...analysis(),
      themes: [item('Gia đình là trung tâm', 'F1', 'F7')],
      personalityNotes: [{ system: 'ESOTERIC', text: 'KH có thể tuổi Tý', evidence: ['F9'] }],
    };
    // F7 was in an older version of the facts; F9 never existed.
    expect(
      validateOutput('analysis', output, { ...input, factCodes: ['F1', 'F2', 'F3', 'F4'] }),
    ).toEqual([
      { code: 'V2', path: 'themes[0].evidence[1]', detail: 'F7 không có trong đầu vào' },
      { code: 'V2', path: 'personalityNotes[0].evidence[0]', detail: 'F9 không có trong đầu vào' },
    ]);
  });

  it('reports the wrong fact codes of one element together', () => {
    const output = { ...analysis(), themes: [item('Gia đình là trung tâm', 'F1', 'F7', 'F8')] };
    expect(validateOutput('analysis', output, input)).toEqual([
      { code: 'V2', path: 'themes[0].evidence', detail: 'F7, F8 không có trong đầu vào' },
    ]);
  });

  it('names five wrong codes of an element and counts the rest, each cut to 40 characters', () => {
    // CL-A8, MS-A1: thousands of wrong codes made a retry message over the Rust limit.
    const codes = Array.from({ length: 2000 }, (_, i) => `F${i + 100}`);
    const long = `F${'9'.repeat(500)}`;
    const output = { ...analysis(), needs: [item('Quỹ học vấn cho con', long, ...codes)] };
    expect(validateOutput('analysis', output, input)).toEqual([
      {
        code: 'V2',
        path: 'needs[0].evidence',
        detail: `F${'9'.repeat(38)}…, F100, F101, F102, F103 và 1996 mã khác không có trong đầu vào`,
      },
    ]);
  });

  it('reports a missingCategory that is not a missing hạng mục of the gate', () => {
    const output = {
      ...discovery(),
      discoveryStrategy: [
        { text: 'Tìm hiểu quy mô tài sản', evidence: ['F1'], missingCategory: 'ASSETS' },
        { text: 'Tìm hiểu khẩu vị đầu tư', missingCategory: 'RISK_APPETITE' },
      ],
      nextBestActions: [{ text: 'Hỏi về gia đình', missingCategory: 'FAMILY' }],
    };
    expect(validateOutput('discovery', output, input)).toEqual([
      {
        code: 'V2',
        path: 'discoveryStrategy[0].missingCategory',
        detail: 'ASSETS không phải hạng mục đang thiếu',
      },
      {
        code: 'V2',
        path: 'nextBestActions[0].missingCategory',
        detail: 'FAMILY không phải hạng mục đang thiếu',
      },
    ]);
  });
});
