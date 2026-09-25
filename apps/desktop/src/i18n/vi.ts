/** Vietnamese UI strings. Industry terms (FYP, KYC, N1–N4) stay in English — ADR-0011. */
export const vi = {
  'app.title': 'Project-2C',
  'app.subtitle': 'Quản lý hoạt động tư vấn bảo hiểm nhân thọ',
  'app.placeholder': 'Khung ứng dụng — giao diện sẽ dựng sau khi duyệt mockup (G3).',
  'pipeline.title': 'Nhóm cơ hội',
} as const;

export type MessageKey = keyof typeof vi;
