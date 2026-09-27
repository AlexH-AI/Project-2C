/** Static lists and weights the simulated data picks from (spec §7). Data only, no logic. */
import type { CustomerStage } from '@p2c/domain';
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
