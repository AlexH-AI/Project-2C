/** Static lists and weights the simulated data picks from (spec §7). Data only, no logic. */
import type { CustomerStage, KycCategory, KycField, KycValue } from '@p2c/domain';
import type { AppointmentTrigger } from './appointments';

/** Values with relative weights. */
export type Weighted<T> = readonly (readonly [T, number])[];

export const STARTING_STAGES: Weighted<CustomerStage> = [
  ['N4', 6],
  ['N3', 3],
  ['N2', 1],
];

/** Birth date given in full, only the year, or not yet. */
export const BIRTH_DATE_KINDS: Weighted<'full' | 'year' | 'none'> = [
  ['full', 6],
  ['year', 2],
  ['none', 2],
];

export const OUTCOMES: Weighted<'MET' | 'RESCHEDULE' | 'CANCELLED' | 'NO_SHOW'> = [
  ['MET', 78],
  ['RESCHEDULE', 6],
  ['CANCELLED', 8],
  ['NO_SHOW', 8],
];

/** Stage after a meeting with a customer in an open stage. */
export const MOVES: Weighted<'up' | 'stay' | 'down' | 'hold' | 'lost'> = [
  ['up', 35],
  ['stay', 45],
  ['down', 8],
  ['hold', 6],
  ['lost', 4],
];

export const TRIGGERS: Weighted<AppointmentTrigger> = [
  ['REFERRAL', 35],
  ['ASSET_MATURITY', 20],
  ['EVENT', 20],
  ['OCCASION', 15],
  ['OTHER', 10],
];

export const TEAM_NAMES = ['Sao Mai', 'Bình Minh', 'Hừng Đông'] as const;

export const FAMILY_NAMES = [
  'Nguyễn',
  'Trần',
  'Lê',
  'Phạm',
  'Hoàng',
  'Huỳnh',
  'Phan',
  'Vũ',
  'Võ',
  'Đặng',
  'Bùi',
  'Đỗ',
  'Hồ',
  'Ngô',
  'Dương',
  'Lý',
] as const;

export const MIDDLE_NAMES = [
  'Văn',
  'Thị',
  'Minh',
  'Ngọc',
  'Thanh',
  'Hoài',
  'Quốc',
  'Thu',
  'Đức',
  'Kim',
  'Gia',
  'Bảo',
] as const;

export const GIVEN_NAMES = [
  'An',
  'Bình',
  'Chi',
  'Dũng',
  'Giang',
  'Hà',
  'Hải',
  'Hạnh',
  'Hiếu',
  'Hoa',
  'Hùng',
  'Hương',
  'Khánh',
  'Lan',
  'Linh',
  'Long',
  'Mai',
  'Nam',
  'Nga',
  'Nhung',
  'Phong',
  'Phúc',
  'Quân',
  'Quang',
  'Sơn',
  'Tâm',
  'Thảo',
  'Thắng',
  'Trang',
  'Trung',
  'Tuấn',
  'Uyên',
  'Việt',
  'Vy',
  'Yến',
] as const;

export const APPOINTMENT_TIMES = [
  '08:30',
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:30',
  '18:00',
  '19:30',
] as const;

export const TRIGGER_NOTES = [
  'Được KH cũ giới thiệu',
  'Sổ tiết kiệm sắp đáo hạn',
  'Gặp ở hội thảo tài chính gia đình',
  'Chúc mừng sinh nhật',
  'KH chủ động liên hệ',
] as const;

export const NEXT_STEPS = [
  'Gửi bảng minh họa quyền lợi',
  'Hẹn gặp cả gia đình',
  'Chuẩn bị hồ sơ yêu cầu bảo hiểm',
  'Gọi lại sau 2 tuần',
  'Gửi tài liệu so sánh sản phẩm',
  'Hỏi thêm về khoản vay hiện có',
  'Mời tham dự hội thảo tháng sau',
  'Hoàn tất khám sức khỏe',
] as const;

export const MEETING_NOTES = [
  'KH quan tâm quỹ học vấn cho con',
  'KH muốn tăng quyền lợi bệnh hiểm nghèo',
  'KH còn cân nhắc ngân sách',
  'Vợ chồng cùng tham gia buổi gặp',
  'KH đã có hợp đồng ở công ty khác',
  'KH hỏi kỹ về điều khoản loại trừ',
] as const;

/** Expected case sizes and FYP, in millions of đồng. */
export const CASE_SIZES_MILLION = [10, 15, 20, 25, 30, 40, 50, 60, 80, 100] as const;

/**
 * What an RE learns about a hạng mục in one KYC note: each trường with the chance it is asked.
 * Trường chính always are (chance 1). Birth year and gender come from the customer profile (D2).
 */
export const KYC_TOPICS: readonly {
  readonly category: KycCategory;
  readonly fields: readonly (readonly [KycField, number])[];
}[] = [
  {
    category: 'FAMILY',
    fields: [
      ['maritalStatus', 1],
      ['childrenCount', 1],
      ['dependents', 0.4],
    ],
  },
  {
    category: 'OCCUPATION_INCOME',
    fields: [
      ['occupation', 1],
      ['annualIncome', 0.6],
      ['incomeSources', 0.3],
    ],
  },
  {
    category: 'GOALS',
    fields: [
      ['primaryGoal', 1],
      ['goalHorizon', 0.5],
      ['otherGoals', 0.2],
    ],
  },
  {
    category: 'EXISTING_PROTECTION',
    fields: [
      ['hasProtection', 1],
      ['protectionDetails', 0.5],
    ],
  },
  {
    category: 'ASSETS',
    fields: [
      ['totalAssets', 1],
      ['assetAllocation', 0.5],
      ['liabilities', 0.3],
    ],
  },
  {
    category: 'CONCERNS',
    fields: [
      ['mainConcern', 1],
      ['otherConcerns', 0.3],
    ],
  },
  {
    category: 'RISK_APPETITE',
    fields: [
      ['riskProfile', 1],
      ['investmentExperience', 0.5],
    ],
  },
  { category: 'IDENTITY', fields: [['residence', 1]] },
];

/** Label and possible values of each trường the RE confirms, as written in a KYC note. */
export const KYC_VALUES: Readonly<
  Partial<Record<KycField, { readonly label: string; readonly values: readonly KycValue[] }>>
> = {
  residence: {
    label: 'Nơi ở',
    values: [
      'Quận 1, TP.HCM',
      'Quận 7, TP.HCM',
      'Thủ Đức, TP.HCM',
      'Hoàn Kiếm, Hà Nội',
      'Cầu Giấy, Hà Nội',
      'Hải Châu, Đà Nẵng',
    ],
  },
  maritalStatus: { label: 'Hôn nhân', values: ['Độc thân', 'Đã kết hôn', 'Ly hôn'] },
  childrenCount: { label: 'Số con', values: [0, 1, 2, 3] },
  dependents: { label: 'Người phụ thuộc', values: ['Bố mẹ hai bên', 'Mẹ ruột', 'Không có'] },
  occupation: {
    label: 'Nghề nghiệp',
    values: [
      'Chủ doanh nghiệp',
      'Giám đốc điều hành',
      'Bác sĩ',
      'Luật sư',
      'Nhà đầu tư',
      'Kiến trúc sư',
    ],
  },
  annualIncome: { label: 'Thu nhập năm', values: ['1–2 tỷ', '2–5 tỷ', '5–10 tỷ', 'Trên 10 tỷ'] },
  incomeSources: {
    label: 'Nguồn thu',
    values: ['Cổ tức doanh nghiệp', 'Cho thuê bất động sản', 'Lương và thưởng'],
  },
  totalAssets: {
    label: 'Tổng tài sản',
    values: ['10–30 tỷ', '30–100 tỷ', '100–300 tỷ', 'Trên 300 tỷ'],
  },
  assetAllocation: {
    label: 'Phân bổ tài sản',
    values: ['Chủ yếu bất động sản', 'Doanh nghiệp và chứng khoán', 'Tiền gửi và vàng'],
  },
  liabilities: { label: 'Khoản vay', values: ['Không có', 'Vay mua nhà', 'Vay kinh doanh'] },
  primaryGoal: {
    label: 'Mục tiêu chính',
    values: [
      'Quỹ học vấn cho con',
      'Chuẩn bị nghỉ hưu',
      'Chuyển giao tài sản',
      'Bảo vệ thu nhập gia đình',
    ],
  },
  goalHorizon: { label: 'Thời hạn', values: ['5 năm', '10 năm', '15–20 năm'] },
  otherGoals: {
    label: 'Mục tiêu khác',
    values: ['Du học cho con', 'Mua nhà nghỉ dưỡng', 'Làm từ thiện'],
  },
  riskProfile: { label: 'Khẩu vị rủi ro', values: ['Thận trọng', 'Cân bằng', 'Chấp nhận rủi ro'] },
  investmentExperience: {
    label: 'Kinh nghiệm đầu tư',
    values: ['Dưới 3 năm', '3–10 năm', 'Trên 10 năm'],
  },
  hasProtection: { label: 'Đã có bảo vệ', values: [true, false] },
  protectionDetails: {
    label: 'Bảo vệ hiện có',
    values: ['Bảo hiểm sức khỏe công ty', 'Hợp đồng nhân thọ 1 tỷ', 'Quỹ dự phòng 6 tháng'],
  },
  mainConcern: {
    label: 'Trăn trở chính',
    values: [
      'Rủi ro sức khỏe',
      'Kế thừa doanh nghiệp',
      'Lạm phát bào mòn tài sản',
      'Học phí của con',
    ],
  },
  otherConcerns: {
    label: 'Trăn trở khác',
    values: ['Thuế thu nhập', 'Chăm sóc bố mẹ', 'Biến động thị trường'],
  },
};
