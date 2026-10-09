// The AI eval set of docs/golden/ai-eval.md (G2, Owner 08/10/2026), copied 1–1: profiles E01–E20
// and notes X01–X05 with the same codes. Never edit it to make a run pass; a change goes through
// the Owner (G2). eval-ai-core.test.mjs checks it against the gate and against the doc.

import { KYC_FIELDS } from '../../packages/domain/src/kyc-catalog.ts';
import { KYC_GOLDEN_PROFILES } from '../../packages/domain/src/golden/kyc.fixture.ts';
import { calendarDate } from '../../packages/domain/src/period.ts';

/** The analysis day of every profile (ai-eval.md §1). */
export const EVAL_TODAY = calendarDate(2026, 10, 1);
const CONFIRMED = calendarDate(2026, 9, 1);

const age = (years) => ['birthYear', EVAL_TODAY.year - years];

/** Facts with their `seq` (1, 2…, superseded ones counted), as `buildAnalysisInput` takes them. */
const withSeq = (facts) => facts.map((fact, i) => ({ ...fact, seq: i + 1 }));

const factsOf = (id, specs) =>
  withSeq(
    specs.map(([field, value, status = 'active'], i) => ({
      id: `${id}-f${i + 1}`,
      category: KYC_FIELDS[field].category,
      field,
      value,
      noteId: `${id}-note`,
      confirmedDate: CONFIRMED,
      status,
    })),
  );

const fromGolden = (id, kycId, mode, missing, warnings = []) => {
  const golden = KYC_GOLDEN_PROFILES.find((p) => p.id === kycId);
  return { id, from: kycId, mode, missing, warnings, facts: withSeq(golden.facts) };
};

const profile = (id, mode, missing, warnings, specs) => ({
  id,
  mode,
  missing,
  warnings,
  facts: factsOf(id, specs),
});

const MT = 'conflict';

/**
 * E01–E20 (ai-eval.md §3, §4): `mode`, `missing` (hạng mục codes) and `warnings` (trường in a
 * non-core conflict) are the columns "Chế độ", "Hạng mục thiếu" and "Cảnh báo" of the doc.
 */
export const EVAL_PROFILES = [
  fromGolden('E01', 'K04', 'discovery', [
    'ASSETS',
    'GOALS',
    'RISK_APPETITE',
    'EXISTING_PROTECTION',
    'CONCERNS',
  ]),
  fromGolden('E02', 'K05', 'discovery', ['RISK_APPETITE', 'EXISTING_PROTECTION', 'CONCERNS']),
  fromGolden('E03', 'K06', 'discovery', ['GOALS']),
  fromGolden('E04', 'K07', 'analysis', ['RISK_APPETITE', 'EXISTING_PROTECTION']),
  fromGolden('E05', 'K08', 'analysis', ['ASSETS', 'CONCERNS']),
  fromGolden('E06', 'K09', 'discovery', ['ASSETS', 'EXISTING_PROTECTION']),
  fromGolden('E07', 'K10', 'analysis', []),
  fromGolden('E08', 'K12', 'analysis', [], ['riskProfile']),
  fromGolden('E09', 'K13', 'analysis', []),
  fromGolden(
    'E10',
    'K15',
    'discovery',
    ['ASSETS', 'GOALS', 'RISK_APPETITE', 'EXISTING_PROTECTION', 'CONCERNS'],
    ['occupation'],
  ),
  profile(
    'E11',
    'analysis',
    ['RISK_APPETITE'],
    [],
    [
      age(56),
      ['residence', 'Hà Nội'],
      ['maritalStatus', 'Đã kết hôn'],
      ['childrenCount', 3],
      ['occupation', 'Chủ tập đoàn bất động sản'],
      ['totalAssets', 'Khoảng 1.000 tỷ'],
      ['primaryGoal', 'Bảo toàn tài sản cho ba con'],
      ['hasProtection', true],
      ['protectionDetails', 'Prudential PRU-Hành Trang từ 2015 và AIA Vitality từ 2020'],
      ['mainConcern', 'Hai hợp đồng đang có không đủ bảo vệ khi có rủi ro lớn'],
    ],
  ),
  profile(
    'E12',
    'analysis',
    ['EXISTING_PROTECTION'],
    [],
    [
      age(48),
      ['maritalStatus', 'Đã kết hôn'],
      ['childrenCount', 2],
      ['occupation', 'Giám đốc tài chính công ty niêm yết'],
      ['annualIncome', 'Khoảng 8 tỷ'],
      ['totalAssets', 'Khoảng 150 tỷ'],
      ['assetAllocation', '60% bất động sản, 30% cổ phiếu, 10% tiền gửi'],
      ['primaryGoal', 'Nghỉ hưu ở tuổi 55'],
      ['goalHorizon', '2033'],
      ['riskProfile', 'Chấp nhận lỗ tối đa 10% mỗi năm'],
      ['mainConcern', 'Lạm phát làm giảm giá trị tiền gửi'],
    ],
  ),
  profile(
    'E13',
    'analysis',
    [],
    [],
    [
      age(66),
      ['residence', 'TP.HCM'],
      ['maritalStatus', 'Góa'],
      ['childrenCount', 2],
      ['occupation', 'Chủ chuỗi nhà thuốc'],
      ['totalAssets', 'Trên 300 tỷ'],
      ['liabilities', 'Không có'],
      ['primaryGoal', 'Lập di chúc, chia tài sản cho hai con theo Luật Thừa kế'],
      ['riskProfile', 'Thận trọng'],
      ['hasProtection', false],
      ['mainConcern', 'Thuế khi chuyển nhượng tài sản theo Nghị định mới'],
    ],
  ),
  profile(
    'E14',
    'analysis',
    [],
    ['riskProfile', 'mainConcern'],
    [
      age(51),
      ['maritalStatus', 'Đã kết hôn'],
      ['childrenCount', 1],
      ['occupation', 'Bác sĩ, đồng sở hữu bệnh viện tư'],
      ['totalAssets', 'Khoảng 80 tỷ'],
      ['primaryGoal', 'Quỹ học tập cho con ở nước ngoài'],
      ['goalHorizon', '2030'],
      ['riskProfile', 'Thận trọng', MT],
      ['riskProfile', 'Mạo hiểm', MT],
      ['hasProtection', true],
      ['protectionDetails', 'Bảo hiểm sức khỏe do bệnh viện mua'],
      ['mainConcern', 'Thiếu thời gian quản lý tài sản', MT],
      ['mainConcern', 'Lo con không muốn về nước', MT],
    ],
  ),
  profile(
    'E15',
    'discovery',
    ['ASSETS', 'GOALS', 'RISK_APPETITE', 'EXISTING_PROTECTION', 'CONCERNS'],
    [],
    [
      age(34),
      ['maritalStatus', 'Độc thân'],
      ['childrenCount', 0],
      ['occupation', 'Nhà sáng lập công ty công nghệ vừa gọi vốn'],
      ['incomeSources', 'Lương và cổ phần công ty'],
    ],
  ),
  profile(
    'E16',
    'analysis',
    [],
    [],
    [
      age(44),
      ['maritalStatus', 'Đã kết hôn'],
      ['childrenCount', 2],
      ['occupation', 'Chủ chuỗi nhà hàng'],
      ['totalAssets', 'Khoảng 60 tỷ'],
      ['primaryGoal', 'Bảo vệ thu nhập gia đình nếu có rủi ro sức khỏe'],
      ['riskProfile', 'Cân bằng'],
      ['hasProtection', false],
      ['mainConcern', 'Muốn mua bảo hiểm cho cả nhà ngay trong năm nay'],
    ],
  ),
  profile(
    'E17',
    'analysis',
    ['EXISTING_PROTECTION'],
    [],
    [
      age(46),
      ['maritalStatus', 'Đã kết hôn'],
      ['childrenCount', 2],
      ['occupation', 'Kiến trúc sư, chủ văn phòng thiết kế'],
      ['totalAssets', 'Khoảng 40 tỷ'],
      ['primaryGoal', 'Mua nhà cho bố mẹ ở quê'],
      ['goalHorizon', '2028'],
      ['riskProfile', 'Thận trọng'],
      ['mainConcern', 'Ngại quyết định khi chưa hỏi ý kiến thầy phong thủy'],
      ['otherConcerns', 'Tự nhận là người hướng nội, rất tin tử vi'],
    ],
  ),
  profile(
    'E18',
    'analysis',
    ['CONCERNS'],
    [],
    [
      age(58),
      ['maritalStatus', 'Đã kết hôn'],
      ['childrenCount', 3],
      ['occupation', 'Chủ doanh nghiệp xuất khẩu thủy sản'],
      ['totalAssets', 'Khoảng 500 tỷ'],
      ['liabilities', 'Khoản vay 50 tỷ đáo hạn 15/03/2027'],
      ['primaryGoal', 'Trả hết nợ trước khi chuyển giao công ty'],
      ['goalHorizon', '5 năm'],
      ['riskProfile', 'Cân bằng'],
      ['hasProtection', true],
      ['protectionDetails', 'Bảo hiểm tài sản nhà xưởng'],
    ],
  ),
  profile(
    'E19',
    'analysis',
    [],
    [],
    [
      age(71),
      ['maritalStatus', 'Đã kết hôn'],
      ['childrenCount', 4],
      ['dependents', 'Mẹ 95 tuổi'],
      ['occupation', 'Chủ tịch công ty gia đình ngành dệt may'],
      ['totalAssets', 'Trên 1.500 tỷ'],
      ['assetAllocation', 'Chủ yếu cổ phần công ty và đất nhà xưởng'],
      ['primaryGoal', 'Chuyển giao công ty cho con trai cả'],
      ['riskProfile', 'Thận trọng'],
      ['hasProtection', true],
      ['protectionDetails', 'Bảo hiểm sức khỏe quốc tế cho hai vợ chồng'],
      ['mainConcern', 'Các con tranh chấp tài sản sau này'],
    ],
  ),
  profile(
    'E20',
    'analysis',
    ['ASSETS'],
    [],
    [
      age(39),
      ['residence', 'Hải Phòng'],
      ['maritalStatus', 'Đã kết hôn'],
      ['childrenCount', 1],
      ['occupation', 'Chủ công ty vận tải biển'],
      ['primaryGoal', 'Tích lũy cho con học đại học'],
      ['riskProfile', 'Thận trọng'],
      ['hasProtection', false],
      ['protectionDetails', 'Từng hủy hợp đồng bảo hiểm năm 2022 vì thấy không hiệu quả'],
      ['mainConcern', 'Không tin bảo hiểm'],
    ],
  ),
];

/**
 * X01–X05 (ai-eval.md §5). `required`: each needs a kept fact of one of `fields` whose quote holds
 * one of `keywords` (any case) and, when given, exactly `value`. `forbidden`: no kept fact may
 * match it. Text values are for the Owner to read.
 */
export const EVAL_NOTES = [
  {
    id: 'X01',
    note: 'Anh Hùng năm nay nghỉ hưu sớm sau khi bán phần lớn cổ phần công ty logistics. Hiện sống ở Đà Nẵng cùng vợ, hai con đã đi làm. Anh muốn dành một phần tiền lập quỹ từ thiện của gia đình.',
    required: [
      { fields: ['residence'], keywords: ['Đà Nẵng'] },
      { fields: ['maritalStatus'], keywords: ['vợ'] },
      { fields: ['childrenCount'], keywords: ['hai con'], value: 2 },
      { fields: ['primaryGoal', 'otherGoals'], keywords: ['quỹ từ thiện'] },
    ],
    forbidden: null,
  },
  {
    id: 'X02',
    note: 'Chị Mai sinh năm 1979, làm trưởng phòng tại một ngân hàng nước ngoài, thu nhập khoảng 5 tỷ mỗi năm. Chồng chị là bác sĩ.',
    required: [
      { fields: ['occupation'], keywords: ['trưởng phòng'] },
      { fields: ['annualIncome'], keywords: ['5 tỷ'] },
      { fields: ['maritalStatus'], keywords: ['chồng'] },
    ],
    forbidden: {
      label: '`occupation` có giá trị chứa "bác sĩ"',
      test: (fact) =>
        fact.field === 'occupation' && String(fact.value).toLowerCase().includes('bác sĩ'),
    },
  },
  {
    id: 'X03',
    note: 'Gọi điện hỏi thăm sau chuyến công tác, hẹn gặp lại tuần sau tại văn phòng.',
    required: [],
    forbidden: { label: 'mọi đề xuất', test: () => true },
  },
  {
    id: 'X04',
    note: 'Lần trước chị nói khẩu vị cân bằng, hôm nay chị bảo giờ chỉ muốn giữ tiền an toàn, không chấp nhận lỗ.',
    required: [{ fields: ['riskProfile'], keywords: ['giữ tiền an toàn', 'không chấp nhận lỗ'] }],
    forbidden: {
      label: 'đề xuất có `field` khác `riskProfile`',
      test: (fact) => fact.field !== 'riskProfile',
    },
  },
  {
    id: 'X05',
    note: 'Anh đang có hợp đồng AIA Vitality từ 2019, phí 150 triệu/năm, và khoản vay 20 tỷ mua nhà đáo hạn 2030. Tổng tài sản khoảng 300 tỷ, phần lớn là đất ở Thủ Đức.',
    required: [
      { fields: ['hasProtection'], keywords: ['hợp đồng', 'AIA Vitality'], value: true },
      { fields: ['protectionDetails'], keywords: ['AIA Vitality'] },
      { fields: ['liabilities'], keywords: ['20 tỷ'] },
      { fields: ['totalAssets'], keywords: ['300 tỷ'] },
    ],
    forbidden: null,
  },
];
