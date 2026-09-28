/**
 * KYC catalog (ADR-0008, approved by the Owner at G2): the eight hạng mục KYC, their trường, which
 * trường make a hạng mục count as "đã có" (trường chính), which trường are cốt lõi, the gate
 * thresholds and the suggested questions. The gate function itself lives elsewhere (T-033).
 */

/** Hạng mục KYC, in the order they are shown and listed as missing. */
export const KYC_CATEGORIES = [
  'IDENTITY',
  'FAMILY',
  'OCCUPATION_INCOME',
  'ASSETS',
  'GOALS',
  'RISK_APPETITE',
  'EXISTING_PROTECTION',
  'CONCERNS',
] as const;

export type KycCategory = (typeof KYC_CATEGORIES)[number];

/**
 * Trường, each in exactly one hạng mục. A cốt lõi trường in conflict blocks the AI
 * (`CONFLICT_RESOLUTION`); a conflict on any other trường is only a warning (G2 2, 6).
 * A `fromProfile` trường is only ever taken from the hồ sơ KH, never from a ghi chú (D2).
 */
export const KYC_FIELDS = {
  birthYear: { category: 'IDENTITY', core: true, fromProfile: true },
  gender: { category: 'IDENTITY', core: false, fromProfile: true },
  residence: { category: 'IDENTITY', core: false, fromProfile: false },
  maritalStatus: { category: 'FAMILY', core: true, fromProfile: false },
  childrenCount: { category: 'FAMILY', core: true, fromProfile: false },
  dependents: { category: 'FAMILY', core: false, fromProfile: false },
  occupation: { category: 'OCCUPATION_INCOME', core: false, fromProfile: false },
  annualIncome: { category: 'OCCUPATION_INCOME', core: false, fromProfile: false },
  incomeSources: { category: 'OCCUPATION_INCOME', core: false, fromProfile: false },
  totalAssets: { category: 'ASSETS', core: true, fromProfile: false },
  assetAllocation: { category: 'ASSETS', core: false, fromProfile: false },
  liabilities: { category: 'ASSETS', core: false, fromProfile: false },
  primaryGoal: { category: 'GOALS', core: true, fromProfile: false },
  goalHorizon: { category: 'GOALS', core: false, fromProfile: false },
  otherGoals: { category: 'GOALS', core: false, fromProfile: false },
  riskProfile: { category: 'RISK_APPETITE', core: false, fromProfile: false },
  investmentExperience: { category: 'RISK_APPETITE', core: false, fromProfile: false },
  hasProtection: { category: 'EXISTING_PROTECTION', core: false, fromProfile: false },
  protectionDetails: { category: 'EXISTING_PROTECTION', core: false, fromProfile: false },
  mainConcern: { category: 'CONCERNS', core: false, fromProfile: false },
  otherConcerns: { category: 'CONCERNS', core: false, fromProfile: false },
} as const satisfies Record<
  string,
  { readonly category: KycCategory; readonly core: boolean; readonly fromProfile: boolean }
>;

export type KycField = keyof typeof KYC_FIELDS;

export interface KycCategorySpec {
  /**
   * Trường chính: the hạng mục counts as "đã có" when `all` (or `any`) of these trường hold at
   * least one confirmed fact that is not superseded. A "không / chưa có" answer counts, and so does
   * a trường in conflict (G2 1).
   */
  readonly keyFields: { readonly rule: 'all' | 'any'; readonly fields: readonly KycField[] };
  /** 2–3 suggested questions for when the hạng mục is missing, in a UHNW advisory tone (G2 7). */
  readonly questions: readonly string[];
}

export const KYC_CATEGORY_SPECS: Readonly<Record<KycCategory, KycCategorySpec>> = {
  IDENTITY: {
    keyFields: { rule: 'all', fields: ['birthYear'] },
    questions: [
      'Để các giải pháp đồng hành cùng anh/chị qua từng giai đoạn cuộc sống, anh/chị cho phép em được biết năm sinh của mình không ạ?',
      'Hiện anh/chị và gia đình đang sinh sống và làm việc chủ yếu tại đâu ạ?',
    ],
  },
  FAMILY: {
    keyFields: { rule: 'all', fields: ['maritalStatus', 'childrenCount'] },
    questions: [
      'Anh/chị có thể chia sẻ đôi nét về gia đình mình — hiện anh/chị đã lập gia đình chưa ạ?',
      'Gia đình anh/chị đã có các cháu chưa ạ? Nếu có, các cháu đang ở độ tuổi nào?',
      'Ngoài gia đình nhỏ, anh/chị có đang chăm lo cho ai khác, chẳng hạn bố mẹ hai bên, không ạ?',
    ],
  },
  OCCUPATION_INCOME: {
    keyFields: { rule: 'any', fields: ['occupation', 'annualIncome'] },
    questions: [
      'Công việc hay hoạt động kinh doanh chính của anh/chị hiện nay là gì ạ?',
      'Nguồn thu của gia đình hiện đến chủ yếu từ doanh nghiệp, từ đầu tư hay từ công việc chuyên môn ạ?',
    ],
  },
  ASSETS: {
    keyFields: { rule: 'all', fields: ['totalAssets'] },
    questions: [
      'Tài sản của gia đình hiện được phân bổ chủ yếu vào những kênh nào — bất động sản, doanh nghiệp, chứng khoán hay tiền gửi ạ?',
      'Để em đề xuất cấu trúc tương xứng, anh/chị có thể hình dung giúp em quy mô tài sản của gia đình đang ở khoảng nào không ạ?',
      'Có tài sản nào anh/chị đặc biệt muốn gìn giữ hoặc chuyển giao cho thế hệ sau không ạ?',
    ],
  },
  GOALS: {
    keyFields: { rule: 'all', fields: ['primaryGoal'] },
    questions: [
      'Trong 5–10 năm tới, điều gì là ưu tiên lớn nhất của anh/chị cho bản thân và gia đình ạ?',
      'Anh/chị có mốc thời gian nào đang hướng tới, như kế hoạch học tập của các cháu, nghỉ hưu hay chuyển giao doanh nghiệp không ạ?',
    ],
  },
  RISK_APPETITE: {
    keyFields: { rule: 'all', fields: ['riskProfile'] },
    questions: [
      'Với các khoản đầu tư hiện tại, anh/chị thường ưu tiên sự ổn định hay sẵn sàng đón nhận biến động để hướng tới lợi nhuận cao hơn ạ?',
      'Những lần thị trường điều chỉnh mạnh, anh/chị thường chọn cách ứng xử thế nào ạ?',
    ],
  },
  EXISTING_PROTECTION: {
    keyFields: { rule: 'all', fields: ['hasProtection'] },
    questions: [
      'Hiện anh/chị và gia đình đã có những giải pháp bảo vệ nào, như bảo hiểm nhân thọ, sức khỏe hay quỹ dự phòng ạ?',
      'Anh/chị thấy các giải pháp hiện có đã thật sự tương xứng với mong muốn của mình chưa, hay còn điểm nào anh/chị muốn xem lại ạ?',
    ],
  },
  CONCERNS: {
    keyFields: { rule: 'all', fields: ['mainConcern'] },
    questions: [
      'Khi nghĩ về tương lai tài chính của gia đình, điều gì khiến anh/chị trăn trở nhất ạ?',
      'Nếu có một việc anh/chị mong được giải quyết trọn vẹn trong năm nay, đó sẽ là việc gì ạ?',
    ],
  },
};

/** Trạng thái cổng KYC, in priority order (ADR-0008 5). */
export const KYC_GATE_STATES = [
  'CONFLICT_RESOLUTION',
  'KYC_INSUFFICIENT',
  'PROFILE_DISCOVERY',
  'PAIN_POINT_ANALYSIS',
] as const;

export type KycGateState = (typeof KYC_GATE_STATES)[number];

/** Gate thresholds (G2 3–5). */
export const KYC_GATE_THRESHOLDS = {
  /** Missing any of these → `KYC_INSUFFICIENT` (G2 3). */
  minimumCategories: ['IDENTITY', 'FAMILY', 'OCCUPATION_INCOME'],
  /** `PAIN_POINT_ANALYSIS` needs at least this many hạng mục "đã có"… (G2 4, 5) */
  analysisMinCategories: 6,
  /** …including this one… */
  analysisRequiredCategory: 'GOALS',
  /** …and at least one of these. Otherwise `PROFILE_DISCOVERY`. */
  analysisAnyOfCategories: ['ASSETS', 'EXISTING_PROTECTION'],
} as const satisfies {
  readonly minimumCategories: readonly KycCategory[];
  readonly analysisMinCategories: number;
  readonly analysisRequiredCategory: KycCategory;
  readonly analysisAnyOfCategories: readonly KycCategory[];
};

/** Exact text shown for `KYC_INSUFFICIENT`, without calling the AI (ADR-0008, Q9). */
export const KYC_INSUFFICIENT_MESSAGE = 'Cần chăm sóc, KYC thêm thông tin khách hàng';
