# HANDOFF

> Trạng thái giữa các phiên / giữa 2 máy. **Giữ dưới 8.000 ký tự**: hook `SessionStart` chỉ đưa được 10.000 ký tự vào context. Chỉ ghi điều GitHub chưa ghi. Lịch sử đã có ở PR/Issue; quy tắc bền ở `CLAUDE.md`; ghi chú review ở `docs/state/review-notes.md`.

- **Cập nhật:** 2026-10-03 · máy `DESKTOP-KDURKJP` (Home PC)
- **Nhánh:** `main` (`b16f632`). Worktree review `Project-2C-review`, `Project-2C-review-2`: đưa về `origin/main` khi review
- **Phase:** 4 — Dashboard & báo cáo (milestone mở 02/10) · Phase 1, 2, 3 đã đóng

## Trạng thái

- Phase 4 đã merge: #251 T-095, #252 T-096 (+ T-104 #264), #253 T-097 G2 (PR #265), #254 T-098 G3 mockup Tổng quan + Báo cáo (PR #266), #255 T-099 index + MTD (PR #279). Quyết định G2/G3: `docs/design/phase-4-chi-so.md` §4.5.
- #280 T-115 (retro điều hướng repo, đợt 1): đang làm ở worktree `C:\workspace\Project-2C-T115`. Đợt 2 (HANDOFF thành Issue ghim + trạng thái tự sinh, phụ lục ADR-0003, mục "Tài liệu cần đọc" trong mẫu Issue) chờ **G1**. Đợt 3: `CLAUDE.md` theo package + bản đồ export tự sinh, rules theo đường dẫn, script `pr-status` / `merge-pr`.

## Bước kế tiếp chính xác

1. `/session-start` (pull `main`).
2. **Phase 4 — việc nên làm tiếp:**
   1. **Domain (không bị chặn, song song được):** **#268 T-105** đếm lịch hẹn 4 nhóm (§1, golden A) · **#269 T-106** KH theo nhóm + mốc chart / báo cáo (§2, §4.4, golden S, M01–M04) · **#270 T-107** cửa sổ so kỳ trước (§4.2, C01–C09).
   2. **#271 T-108** màn Lịch hẹn 4 nhóm (cam = chưa ghi kết quả, xám = dời / hủy / không đến) ← #268.
   3. **Tổng quan:** **#272 T-109** Lọc + ô Lịch hẹn + 6 KPI ← #268, #270, #271 → **#273 T-110** KH theo nhóm + chart (F-18 escape tooltip) ← #269, #272 · **#274 T-111** So sánh team → RE ← #272.
   4. **Báo cáo:** **#275 T-112** Lọc + Tổng hợp / Theo team / Theo RE ← #268, #269, #272 → **#276 T-113** Theo mốc ← #269, #275 → **#277 T-114** xuất Excel (ExcelJS, **G4** xác nhận, nhãn `build-exe`) ← #275, #276.
   - Làm xen khi chờ review: **#256 T-100** `MAX_YEAR` + `PeriodPicker` tắt nút ở biên · **#257 T-101** CI · **#258 T-102**, **#259 T-103** (T-h).
   5. Cuối phase: kiểm tay exe, review độc lập (Codex), `docs/metrics/phase-4.md`, G7.
   - Ý bổ sung mới của Owner: xếp vào gói A (đổi nhỏ) hoặc B (cần mockup).
3. Ngưỡng task (P1, P-2): ước lượng cỡ khi viết Issue gồm cả i18n + e2e; vượt ngưỡng thì tách từ đầu; PR liệt kê mọi file ngoài danh sách được phép.
4. Golden fixtures là test bắt buộc: **không sửa để "cho xanh"**, muốn đổi phải qua Owner (G2).
5. Merge (P-1): SHA head lúc merge phải trùng SHA trong `REVIEW: PASS`; head đổi → review lại.

## Chờ Owner

- **G1 đợt 2 retro (#280):** chuyển HANDOFF sang Issue ghim + phần trạng thái tự sinh từ GitHub; phụ lục ADR-0003.
- **G4 #277:** xác nhận ExcelJS (đã có trong ADR-0005 / ADR-0011) — phiên bản ghim, kích thước bundle — trước khi làm xuất Excel.
- Merge PR `risk:med`/`high`: Owner merge sau review PASS.

## Tài liệu tách khỏi HANDOFF (03/10)

- Sổ ghi chú review OPEN / RESOLVED / ACCEPTED: `docs/state/review-notes.md`
- Phản hồi Owner sau kiểm exe 01/10 (16 ý + quyết định): `docs/reviews/2026-10-01-phan-hoi-owner-kiem-exe.md`
- Dựng Office Laptop / máy mới (phương án A/B/C): `docs/setup/office-laptop.md`
- Ghi chú môi trường Windows / 2 máy: `CLAUDE.md` § "Môi trường Windows và 2 máy"
