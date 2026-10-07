import { describe, expect, it } from 'vitest';
import type { AiMode } from './schema';
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
    ['a missing block', { ...analysis(), themes: undefined }, 'themes', 'sai kiểu, cần array'],
    ['an empty block', { ...analysis(), themes: [] }, 'themes', 'cần ít nhất 1 phần tử'],
    [
      'too many elements',
      { ...analysis(), needs: Array.from({ length: 6 }, () => item('Ý', 'F1')) },
      'needs',
      'quá 5 phần tử',
    ],
    ['an empty text', { ...analysis(), needs: [item('  ', 'F1')] }, 'needs[0].text', 'chuỗi rỗng'],
    [
      'a text over 300 characters',
      { ...analysis(), needs: [item('a'.repeat(301), 'F1')] },
      'needs[0].text',
      'quá 300 ký tự',
    ],
    [
      'a malformed fact code',
      { ...analysis(), needs: [item('Ý', 'F01')] },
      'needs[0].evidence[0]',
      'sai định dạng',
    ],
    [
      'an unknown hạng mục',
      { ...analysis(), discoveryStrategy: [{ text: 'Ý', missingCategory: 'HOBBIES' }] },
      'discoveryStrategy[0].missingCategory',
      'giá trị không hợp lệ',
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
    ).toEqual([{ code: 'V1', path: 'facts[0].value', detail: 'sai định dạng' }]);
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
