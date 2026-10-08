# Mockup UI — bản đồ

Mockup HTML tĩnh, dữ liệu giả lập, mở trực tiếp trong trình duyệt (tốt nhất 1440×900). `index.html` là trang mục lục kèm nguyên tắc, token màu và quyết định G3 vòng 1–2. Quy ước sửa mockup: `.claude/rules/mockups.md`.

Mockup lớn có **mục lục ở comment đầu file** (khối → neo `#id` → dòng): đọc đúng khối cần xem, không đọc cả file.

## Mockup → màn hình → G3 → spec

| Mockup | Màn hình / route (`apps/desktop/src/routes/`) | G3 | Spec / tài liệu |
|---|---|---|---|
| `overview.html` (lớn, §1a–1e, §2) | `Overview.tsx` (thay ở #272 T-109, #273 T-110, #274 T-111); §2 → `appointments/AppointmentsScreen.tsx` (#271 T-108) | #254, duyệt 03/10/2026 | `docs/design/phase-4-chi-so.md` §1, §2, §4.1–4.3, §4.5 |
| `reports.html` (lớn, §2a–2f) | Chưa có route (#275 T-112, #276 T-113, #277 T-114 xuất Excel) | #254, duyệt 03/10/2026 | `phase-4-chi-so.md` §4.4, §4.5; ADR-0011 |
| `appointments.html` | `appointments/AppointmentsScreen.tsx` (+ `appointments-view.ts`) | Vòng 2, 26/09/2026 | ADR-0007; `docs/golden/lich-hen.md` |
| `customers.html` | `customers/CustomersScreen.tsx` (+ `customers-view.ts`) | Vòng 2, 26/09/2026 | ADR-0007; `docs/golden/kh-theo-nhom.md` |
| `customer.html` | `customers/CustomerProfile.tsx`, `CustomerKyc.tsx`, `CustomerPolicies.tsx`, `CustomerAppointments.tsx` | Vòng 2, 26/09/2026; panel KYC Intelligence, mã F, nút trích xuất cập nhật ở Phase 5 (#427, duyệt 08/10/2026) | ADR-0008; `docs/golden/kyc.md`; `phase-5-ai.md` §9.1 |
| `customer-forms.html` | `customers/CustomerDialogs.tsx` | #59, vòng 2 | `docs/design/phase-3-du-lieu.md` §3.3, §4 |
| `appointment-forms.html` | `appointments/AppointmentDialog.tsx`, `OutcomeDialog.tsx`, `EditOutcomeDialog.tsx`, `RescheduleDialog.tsx`, `DeleteAppointmentDialog.tsx` | #59, vòng 2 | `phase-3-du-lieu.md` §3.5, §4 |
| `kyc-forms.html` | `customers/KycDialogs.tsx` (+ `kyc-view.ts`) | #59, vòng 2 | `phase-3-du-lieu.md` §3.8–3.10, §4; ADR-0008 |
| `policy-forms.html` | `customers/PolicyDialogs.tsx` (+ `policy-form.ts`) | #59, vòng 2 | `phase-3-du-lieu.md` §3.7, §4 |
| `team.html` | `team/TeamScreen.tsx`, `TeamDialogs.tsx`, `PersonDialogs.tsx` | #59, vòng 2 | `phase-3-du-lieu.md` §3.1, §3.2 |
| `settings-data.html` | `Settings.tsx`, `SettingsDataFile.tsx`, `SettingsBackup.tsx` | #59, vòng 2 | `phase-3-du-lieu.md` §5–§7; ADR-0010, ADR-0016 |
| `phase-3-feedback.html` (lớn, B1–B6) | B1 → `team/`; B2 → `CustomersScreen.tsx`; B3, B5 → `AppointmentsScreen.tsx`; B4 → `MonthCalendar` trong `AppointmentsScreen.tsx`; B6 → `appointments/YearGrid.tsx` | #217, duyệt 01/10/2026 (B5 = phương án A) | `docs/reviews/2026-10-01-phan-hoi-owner-kiem-exe.md` |
| `ai.html` (§1 Cài đặt → AI, §2 panel, §3 mã F + trích xuất) | Chưa có route: `SettingsAi.tsx` (#408 T-167); panel trong `customers/` (#409 T-168A, #410 T-168B); trích xuất ở Dòng thời gian `CustomerKyc.tsx` (#412 T-170) | #427, duyệt 08/10/2026 (đề xuất `#ask` 1–12) | `docs/design/phase-5-ai.md` §4, §5.2–5.3, §7.2, §8, §9 |
| `table-more.html` | Bảng lớn của `packages/ui` `DataTable` (Lịch hẹn, Khách hàng, hồ sơ KH, Team) | Chờ duyệt (T-150) | `docs/reviews/2026-10-06-deep-review-phase-1-4-tong-hop.md` DR-03, §11.3 |

`mockups.css` dùng chung cho mọi mockup; `forms.css` thêm cho các mockup hộp thoại (`*-forms.html`, `team.html`, `settings-data.html`).

## Khối của mockup lớn

- **`overview.html`** — `#p1a` Toàn bộ · Tháng (MTD): Lọc, ô Lịch hẹn, 6 KPI, KH theo nhóm + chart, So sánh team, bảng khối ↔ chỉ số · `#p1b` Team · Tuần · `#p1c` RE · Năm · `#p1d` đổi kỳ chưa bấm Lọc · `#p1e` trạng thái rỗng · `#p2` màn Lịch hẹn 4 nhóm · `#ask` quyết định G3.
- **`reports.html`** — `#r2a` Tổng hợp + Theo team · `#r2b` Theo RE · `#r2c` Theo mốc (Tháng → tuần) · `#r2d` Team · Tuần · Theo mốc · `#r2e` RE · Năm · Theo mốc · `#r2f` Xuất Excel · `#ask` quyết định G3.
- **`ai.html`** — `#s1` Cài đặt → AI (1a–1g) · `#s2` panel KYC Intelligence (2a–2l) · `#s3` mã F + AI trích xuất (3a–3f) · `#ask` quyết định G3.
- **`phase-3-feedback.html`** — `#b1` Team & nhân sự · `#b2` Khách hàng, hàng chọn RE · `#b3` Lịch hẹn, hàng chọn RE · `#b4` lịch tháng, dải kỳ · `#b5` cột Ngày (A chọn, B / C bỏ) · `#b6` lưới năm · `#ask` quyết định G3.
