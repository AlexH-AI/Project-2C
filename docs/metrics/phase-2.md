# Chỉ số Phase 2 — Lõi domain

Theo bảng chỉ số của `docs/COMPARISON.md`. Phase 2 chỉ có code `packages/domain` (không UI, không exe mới), nên nhóm UI/UX và kích thước exe không áp dụng.

- **Milestone:** "Phase 2 — Lõi domain"
- **Bắt đầu:** 2026-09-26 · **Kết thúc:** 2026-09-26 (task cuối #26 merge; Owner duyệt G7, đóng milestone cùng ngày)
- **Máy:** Home PC (`DESKTOP-KDURKJP`)

## Task

| Issue | Việc | PR | Risk | Test chấp nhận pass lần đầu |
|---|---|---|---|---|
| #28 | G2 golden examples chỉ số + mô hình dữ liệu | #34 | G2 | — (Owner duyệt bảng) |
| #30 | G2 danh mục KYC, ngưỡng cổng, 15 hồ sơ mẫu | #35 | G2 | — (Owner chỉnh K09 → `PROFILE_DISCOVERY`) |
| #29 | Mô hình KYC: notes, facts, versions | #36 | med | ✅ |
| #27 | Vòng đời nhóm KH + chuyển RF | #41 (+ ADR #42) | med | ✅ (spec bổ sung: KH mới vào nhóm mở) |
| #31 | Chỉ số HĐ theo kỳ/scope | #43 | med | ✅ |
| #32 | Chuyển RF + tỉ lệ chốt; đủ G01–G22 | #44 | med | ✅ |
| #38 | Cờ material phiên bản KYC | #46 | med | ✅ (Owner chốt thêm cách hash mâu thuẫn) |
| #33 | Cổng KYC 4 trạng thái | #47 | med | ✅ 15/15 hồ sơ mẫu K01–K15 |
| #25 | Nhập ngày nhanh dd/mm | #51 | low | ✅ |
| #26 | Tiền VND | #52 | low | ✅ |

## Chỉ số

| Nhóm | Chỉ số | Giá trị |
|---|---|---|
| Chất lượng | % test chấp nhận pass lần đầu | 100% ở các task đã merge (golden G01–G22, K01–K15 không phải sửa) |
| Chất lượng | Lỗi Owner phát hiện khi duyệt | 2 ca spec ở G2 (K09; công thức tỉ lệ chốt), không phải lỗi code |
| Chất lượng | Lỗi sau merge | 0 đã biết |
| Chất lượng | Coverage `packages/domain` | 100% statements / branches / functions / lines (tại #52) |
| UI/UX | Điểm Owner | Không áp dụng (không có UI) |
| Tiến độ | Số phiên làm việc | Khoảng 20 phiên (Owner ước lượng) |
| Chi phí | Mức dùng hạn mức Claude | 100% usage limit (Owner ghi) |
| Công sức Owner | Can thiệp ngoài cổng G1–G8 | **2** — Owner tự phát hiện: công thức tỉ lệ chốt (sửa lúc duyệt G2, ADR-0007), cách ghi nhận năm sinh. 3 quyết định spec khác — KH mới vào nhóm mở (ADR-0007), luật cờ material (ADR-0008 §7), cách hash mâu thuẫn (#38) — do Claude dừng hỏi → tính trong cổng G1/G8 (Owner xác nhận 26/09/2026) |
| Kỹ thuật | Kích thước exe, thời gian khởi động | Không đo (không đổi app) |
| Kỹ thuật | Vi phạm ranh giới module | 0 (`pnpm lint:deps`) |

## Ghi chú

- Golden fixtures (`golden/metrics.fixture.ts`, `golden/kyc.fixture.ts`) không bị sửa để "cho xanh" trong suốt phase.
- #31 merge bằng `--merge` (Owner duyệt); review phiên sạch PASS có ghi trên PR #43.
- `docs/PROJECT-PLAN.md` §2.3 đã đồng bộ với ADR-0007 (26/09/2026).
- Review đóng phase (26/09/2026, phiên riêng): `pnpm verify` xanh — 279 test, coverage 100%, 0 vi phạm ranh giới; đọc lại toàn bộ `packages/domain/src` và dò thêm ca biên tiền/ngày/kỳ/nhóm KH. Không có lỗi; chỉ đổi tên một test (ghi chú review #44).
- Ca biên để lại cho Phase 3 (đúng spec hiện tại): gõ `29/02` không năm khi năm nay không nhuận → lỗi, dù năm sau nhuận (vd. 31/12/2027 → 29/02/2028); `1.234 tr` đọc là 1.234 triệu (`.` ngăn nghìn) còn `12.34 tr` là 12,34 triệu — UI phải luôn hiện giá trị đã diễn giải.
