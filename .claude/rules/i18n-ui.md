---
paths:
  - "apps/desktop/src/**"
  - "packages/ui/**"
---

# UI, i18n, tiền / ngày

- Mọi chuỗi UI qua i18n: khóa ở `apps/desktop/src/i18n/vi.ts`, gọi `t()`. Không chuỗi cứng trong JSX, `aria-label`, `title`, thông báo lỗi.
- Hai ngôn ngữ Tiếng Việt / English (ADR-0018 §1, §9). English dịch dần theo nhóm màn (G-12 … G-16); Cài đặt chưa cho chọn English tới G-16.
  - `t()` đọc theo ngôn ngữ của lần chạy (`apps/desktop/src/i18n/language.ts`); khóa `en.ts` chưa có thì hiện tiếng Việt.
  - Khóa mới ở `vi.ts` kèm English ở `apps/desktop/src/i18n/en.ts` trong cùng PR, chữ theo bảng thuật ngữ của `CONTEXT.md` § Ngôn ngữ và thuật ngữ tiếng Anh. `MISSING_EN` của `en.test.ts` (số khóa `en.ts` còn thiếu) chỉ giảm, không tăng.
  - Thuật ngữ ngành (KPI, FYP, KYC, RM, TL…) giữ nguyên ở cả hai ngôn ngữ theo danh sách "Giữ nguyên ở cả hai ngôn ngữ" của `CONTEXT.md`; chữ khác dịch theo bảng đó.
  - Câu English chỉ dùng các ô `{…}` mà câu tiếng Việt của khóa có.
  - Số nhiều: câu English có số đếm viết `{ one, other }`, chỉ khi câu có đúng một ô đếm (`COUNT_SLOTS` của `apps/desktop/src/i18n/index.ts`). Nơi gọi truyền số, không truyền chuỗi đã định dạng: ô đếm tự nhóm hàng nghìn và chọn dạng. Tiếng Việt chỉ một dạng.
  - Ngôn ngữ lưu theo máy (khóa `p2c.language`), không vào DB hay backup. Đổi bằng `changeLanguage` (lưu nốt rồi tải lại giao diện), không đổi giữa chừng một lần chạy.
- Tiền, số, ngày, kỳ, chỉ số: chỉ dùng hàm của `packages/domain` (`money.ts`, `number.ts`, `period.ts`, `stats.ts`…). Không tự `toLocaleString`, `new Date(...)` để parse / format rải rác.
- Chỉ dùng component và token của `packages/ui`; không màu / khoảng cách tùy tiện (`pnpm lint:tokens` kiểm). Số liệu dùng `tabular-nums`; tương phản đạt WCAG AA.
- Logic thuần của màn hình nằm ở `*-view.ts` cạnh màn hình (có unit test); component chỉ ghép dữ liệu và render.
- Chart ECharts: chuỗi từ DB đưa vào `tooltip.formatter` / `label.formatter` phải escape bằng `echarts.format.encodeHTML` (F-18).
- Nhãn UI hiểu theo nghĩa thường và khớp dòng mẫu của mockup (`CLAUDE.md` § Quy tắc Owner đã chốt). Mockup của màn hình: `docs/design/mockups/README.md`.
