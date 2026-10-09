import { evaluateKycGate } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { buildAnalysisInput, buildExtractionInput } from './input';
import { analysisInputSchema } from './schema';
import { ANALYSIS_FACTS, fact, PROFILE, TODAY } from './test-support';

describe('buildAnalysisInput', () => {
  it('sends the facts in effect with their code, labels, age and the gate (G5 §1.1)', () => {
    expect(buildAnalysisInput(PROFILE, evaluateKycGate(ANALYSIS_FACTS), TODAY)).toEqual({
      analysisDate: '2026-10-07',
      mode: 'analysis',
      facts: [
        {
          code: 'F3',
          category: 'Danh tính / tuổi',
          field: 'Tuổi',
          value: '42',
          confirmedAt: '2026-06-01',
          conflict: false,
        },
        {
          code: 'F9',
          category: 'Gia đình',
          field: 'Tình trạng hôn nhân',
          value: 'Đã kết hôn',
          confirmedAt: '2026-06-01',
          conflict: false,
        },
        {
          code: 'F4',
          category: 'Gia đình',
          field: 'Số con',
          value: '2',
          confirmedAt: '2026-06-01',
          conflict: false,
        },
        {
          code: 'F5',
          category: 'Nghề nghiệp / nguồn thu',
          field: 'Nghề nghiệp',
          value: 'Chủ doanh nghiệp',
          confirmedAt: '2026-06-01',
          conflict: false,
        },
        {
          code: 'F12',
          category: 'Mục tiêu & mốc thời gian',
          field: 'Mục tiêu chính',
          value: 'Chuẩn bị học phí đại học cho con lớn',
          confirmedAt: '2026-09-14',
          conflict: false,
        },
        {
          code: 'F7',
          category: 'Bảo vệ hiện có',
          field: 'Đã có bảo vệ',
          value: 'Không',
          confirmedAt: '2026-06-01',
          conflict: false,
        },
        {
          code: 'F10',
          category: 'Mối quan tâm',
          field: 'Mối quan tâm chính',
          value: 'Thanh khoản khi cần tiền gấp',
          confirmedAt: '2026-07-12',
          conflict: true,
        },
        {
          code: 'F13',
          category: 'Mối quan tâm',
          field: 'Mối quan tâm chính',
          value: 'Lợi nhuận dài hạn',
          confirmedAt: '2026-09-14',
          conflict: true,
        },
      ],
      missingCategories: [
        { code: 'ASSETS', label: 'Tài sản / AUM' },
        { code: 'RISK_APPETITE', label: 'Khẩu vị rủi ro' },
      ],
      conflictWarnings: ['Mối quan tâm chính'],
    });
  });

  it('sends "Có" for a yes and takes the discovery mode from the gate', () => {
    const facts = [
      fact(1, 'birthYear', 1990),
      fact(2, 'maritalStatus', 'Độc thân'),
      fact(3, 'childrenCount', 0),
      fact(4, 'occupation', 'Bác sĩ'),
      fact(5, 'hasProtection', true),
    ];
    const input = buildAnalysisInput({ facts }, evaluateKycGate(facts), TODAY);
    expect(input?.mode).toBe('discovery');
    expect(input?.facts.map((sent) => [sent.field, sent.value])).toEqual([
      ['Tuổi', '36'],
      ['Tình trạng hôn nhân', 'Độc thân'],
      ['Số con', '0'],
      ['Nghề nghiệp', 'Bác sĩ'],
      ['Đã có bảo vệ', 'Có'],
    ]);
    expect(input?.conflictWarnings).toEqual([]);
  });

  it('passes the input schema that db checks input_json with (§7.3 rule 3)', () => {
    const discovery = [
      fact(1, 'birthYear', 1990),
      fact(2, 'maritalStatus', 'Độc thân'),
      fact(3, 'childrenCount', 0),
      fact(4, 'occupation', 'Bác sĩ'),
    ];
    for (const facts of [ANALYSIS_FACTS, discovery]) {
      const input = buildAnalysisInput({ facts }, evaluateKycGate(facts), TODAY);
      expect(input).not.toBeNull();
      expect(analysisInputSchema.parse(input)).toEqual(input);
    }
  });

  it.each([
    ['KYC_INSUFFICIENT', [fact(1, 'birthYear', 1990)]],
    [
      'CONFLICT_RESOLUTION',
      [
        fact(1, 'birthYear', 1990),
        fact(2, 'maritalStatus', 'Độc thân', 'conflict'),
        fact(3, 'maritalStatus', 'Đã kết hôn', 'conflict'),
        fact(4, 'childrenCount', 0),
        fact(5, 'occupation', 'Bác sĩ'),
      ],
    ],
  ])('gives no input when the gate is %s', (state, facts) => {
    const gate = evaluateKycGate(facts);
    expect(gate.state).toBe(state);
    expect(buildAnalysisInput({ facts }, gate, TODAY)).toBeNull();
  });
});

describe('buildExtractionInput', () => {
  it('sends the note and every trường but birth year and gender (G5 §4.1)', () => {
    const note = 'Chị nói hai vợ chồng có 2 bé.';
    const input = buildExtractionInput(note);
    expect(input.note).toBe(note);
    expect(input.fields.slice(0, 3)).toEqual([
      { field: 'residence', label: 'Nơi sinh sống', type: 'text' },
      { field: 'maritalStatus', label: 'Tình trạng hôn nhân', type: 'text' },
      { field: 'childrenCount', label: 'Số con', type: 'integer' },
    ]);
    expect(input.fields).toContainEqual({
      field: 'hasProtection',
      label: 'Đã có bảo vệ',
      type: 'boolean',
    });
    expect(input.fields.map((sent) => sent.field)).not.toContain('birthYear');
    expect(input.fields.map((sent) => sent.field)).not.toContain('gender');
    expect(input.fields).toHaveLength(19);
  });
});
