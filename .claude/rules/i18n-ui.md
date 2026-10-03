---
paths:
  - "apps/desktop/src/**"
  - "packages/ui/**"
---

# UI, i18n, tiền / ngày

- Mọi chuỗi UI qua `apps/desktop/src/i18n/vi.ts` (tiếng Việt; thuật ngữ ngành như KPI, FYP, KYC, RE, TL giữ tiếng Anh). Không chuỗi cứng trong JSX, `aria-label`, `title`, thông báo lỗi.
- Tiền, số, ngày, kỳ, chỉ số: chỉ dùng hàm của `packages/domain` (`money.ts`, `number.ts`, `period.ts`, `stats.ts`…). Không tự `toLocaleString`, `new Date(...)` để parse / format rải rác.
- Chỉ dùng component và token của `packages/ui`; không màu / khoảng cách tùy tiện (`pnpm lint:tokens` kiểm). Số liệu dùng `tabular-nums`; tương phản đạt WCAG AA.
- Logic thuần của màn hình nằm ở `*-view.ts` cạnh màn hình (có unit test); component chỉ ghép dữ liệu và render.
- Chart ECharts: chuỗi từ DB đưa vào `tooltip.formatter` / `label.formatter` phải escape bằng `echarts.format.encodeHTML` (F-18).
- Nhãn UI hiểu theo nghĩa thường và khớp dòng mẫu của mockup (`CLAUDE.md` § Quy tắc Owner đã chốt). Mockup của màn hình: `docs/design/mockups/README.md`.
