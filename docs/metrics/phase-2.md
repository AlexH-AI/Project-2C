# Chỉ số Phase 2 — Lõi domain

Theo bảng chỉ số của `docs/COMPARISON.md`. Phase 2 chỉ có code `packages/domain` (không UI, không exe mới), nên nhóm UI/UX và kích thước exe không áp dụng.

- **Milestone:** "Phase 2 — Lõi domain"
- **Bắt đầu:** 2026-09-26 · **Kết thúc:** _khi #25, #26, #33 merge_
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
| #33 | Cổng KYC 4 trạng thái | _PR này_ | med | ✅ 15/15 hồ sơ mẫu K01–K15 |
| #25 | Nhập ngày nhanh dd/mm | _chưa_ | low | |
| #26 | Tiền VND | _chưa_ | low | |

## Chỉ số

| Nhóm | Chỉ số | Giá trị |
|---|---|---|
| Chất lượng | % test chấp nhận pass lần đầu | 100% ở các task đã merge (golden G01–G22, K01–K15 không phải sửa) |
| Chất lượng | Lỗi Owner phát hiện khi duyệt | 1 ca spec ở G2 (K09), không phải lỗi code |
| Chất lượng | Lỗi sau merge | 0 đã biết |
| Chất lượng | Coverage `packages/domain` | 100% statements / branches / functions / lines (tại #33) |
| UI/UX | Điểm Owner | Không áp dụng (không có UI) |
| Tiến độ | Số phiên làm việc | _Owner điền_ |
| Chi phí | Mức dùng hạn mức Claude | _Owner điền_ |
| Công sức Owner | Can thiệp ngoài cổng G1–G8 | Quyết định spec phát sinh: KH mới vào nhóm mở (ADR-0007), luật cờ material (ADR-0008 §7), cách hash mâu thuẫn (#38) — _Owner xác nhận có tính là ngoài cổng không_ |
| Kỹ thuật | Kích thước exe, thời gian khởi động | Không đo (không đổi app) |
| Kỹ thuật | Vi phạm ranh giới module | 0 (`pnpm lint:deps`) |

## Ghi chú

- Golden fixtures (`golden/metrics.fixture.ts`, `golden/kyc.fixture.ts`) không bị sửa để "cho xanh" trong suốt phase.
- #31 merge bằng `--merge` khi chưa có review phiên sạch (Owner duyệt).
- Việc để lại: `docs/PROJECT-PLAN.md` §2.3 còn định nghĩa RF / tỉ lệ chốt cũ (ADR-0007 là nguồn đúng).
