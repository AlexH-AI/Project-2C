# Tổng hợp review đóng Phase 4 — Claude và Codex

- **Ngày:** 2026-10-04 · **SHA:** `595ef79` (`main` sau PR #316) · diff `5eb7c03..595ef79`, 38 commit
- **Hai báo cáo gốc (nguyên văn):** `raw/2026-10-04/claude-review.md` (CL4-001…CL4-010), `raw/2026-10-04/codex-review.md` (CX4-001…CX4-005, Codex họ GPT-6)
- **Bằng chứng ngoài repo:** log, probe, file `.xlsx` đọc lại và exe tải từ CI nằm ở `C:\workspace\phase-4-review\` trên Home PC; nguồn mọi test tạm đã chép trong phụ lục hai báo cáo.
- **Kiểm lại:** mọi phát hiện đã được Claude (phiên tổng hợp) đối chiếu trên code `595ef79` trước khi tạo Issue (ADR-0001 phụ lục M2).
- **Owner (chat 04/10):** đã kiểm tay exe `595ef79` trước review, không có vấn đề. Sau tổng hợp: làm A–F trước G7, duyệt G2 thêm C10–C11, tối ưu thuật toán **và** đặt trần kỳ Tùy chọn 3 tháng lịch ở mọi màn (§4).

## 1. Kết luận chung

**Không có Critical / High** ở cả hai báo cáo. Hai bên khác nhau ở kết luận:
- Claude: SẴN SÀNG cho G7, nên sửa CL4-001 trước.
- Codex: CHƯA SẴN SÀNG, vì hai lỗi Medium (CX4-001 trùng CL4-001, và CX4-002 nửa đêm).

Kết luận hợp nhất: hai lỗi Medium đều có thật (đã kiểm trên code). **Owner chọn sửa toàn bộ A–F (#317–#323) trước G7.**

Cả hai cùng xác nhận:
- `pnpm verify` 1 125 test, Rust 37/37, e2e 137/137 không flaky (Codex chạy 2 lượt), build exe `main` xanh;
- golden không bị sửa "cho xanh" (4 commit chạm golden đều thêm bảng / test mới đã duyệt G2);
- số liệu khớp nhau giữa Tổng quan, Báo cáo và Excel trên seed (Claude 55 tổ hợp kỳ × góc nhìn, Codex kỳ Năm × 3 góc nhìn + đọc lại `.xlsx`);
- không lỗ bảo mật: tooltip ECharts escape tên, Excel ghi tên kiểu chuỗi (không thành công thức), tên file chỉ ASCII an toàn.

## 2. Phát hiện đã gộp

| # | Phát hiện | Claude | Codex | Mức | Kiểm lại trên code | Task |
|---|---|---|---|---|---|---|
| **P1** | Ngày cuối kỳ (30/04, 28/02…) "so với kỳ trước" lấy cả tháng trước dài hơn → ▼ giả | CL4-001 | CX4-001 | **Medium** | ✅ `compare.ts:45` `>= 0` coi ngày cuối là đã hết; nhãn MTD coi là chưa hết | T-125 #317 |
| **P2** | App mở qua nửa đêm: nút Hôm nay giữ kỳ cũ; số "tới hôm nay" dùng ngày cũ tới lần render sau | — (đã xét nửa đêm, không thấy đường nút Hôm nay) | CX4-002 | **Medium** | ✅ `today` đọc lúc render (`Overview.tsx:38` và 4 màn khác); `PeriodPicker` không đổi kỳ khi đích trùng kỳ cũ | T-126 #318 |
| P3 | Tên RE / team dài → tên file > 255 ký tự → xuất lỗi; câu báo "đầy ổ đĩa / không có quyền" sai nguyên nhân | CL4-004 (KNOWN, review #316) | CX4-004 | Low | ✅ `slug` không giới hạn; một `catch` chung | T-127 #319 |
| P4 | Thông báo "Đã xuất báo cáo" còn sau khi Lọc sang kỳ khác | CL4-005 (KNOWN, review #316) | không coi là lỗi | Low | ✅ `notice` chỉ xóa khi Xuất lần sau | T-127 #319 |
| P5 | Nhập backup nhận `expected_case_size` âm (lệnh chặn `INVALID_AMOUNT`) | — | CX4-005 (KNOWN F-01, phần sót) | Low | ✅ không CHECK schema, `validValue` không kiểm | T-128 #320 |
| P6 | So sánh team không còn team: Tổng kỳ tương lai ra 0 thay vì "—" | — | CX4-003 | Low | ✅ `rows.some` trên mảng rỗng; Báo cáo đúng nhờ `sumFigures` | T-129 #321 |
| P7 | Kỳ Tùy chọn rất dài (1900–2100, 2 412 mốc): `reportRows` ~2,7 s | CL4-002 | ghi nhận 2 412 mốc, không lập phát hiện | Low | Đo trong Node | T-130 #322 (trần) + T-131 #323 (tối ưu) |
| P8 | Chart N4–N1 không có số cho trình đọc màn hình | CL4-003 | ghi "có bảng thay thế" | Low | ✅ Chart chỉ `role="img"` + nhãn, **không** có bảng thay thế → Codex nhầm, Claude đúng | Sổ OPEN |
| P9 | Lịch đã qua chưa ghi kết quả: cột Trạng thái "Chưa ghi kết quả", panel / Hồ sơ KH vẫn "Đã lên lịch" | CL4-008 (Nit) | — | Low | ✅ Trái quy tắc "nhãn UI theo nghĩa thường" → lỗi, không hỏi Owner | T-129 #321 |
| P10 | Tùy chọn chưa bắt đầu: lý do "Tùy chọn không so" thay vì "kỳ chưa bắt đầu" | CL4-006 | — | Nit | ✅ `notComparedReason` xét `custom` trước | T-129 #321 |
| P11 | Ngày 1: "MTD 01/04 – 01/04"; " – " ghép cứng ở `overview-view.ts` | CL4-007, CL4-009 | — | Nit | | T-129 #321 |
| P12 | Coverage không đo `routes/**/*-view.ts` | CL4-010 (KNOWN, F-08) | — | Nit | | Sổ OPEN |
| T1 | Hook `review-pr-hint.mjs` hiểu "Issue #N" gần chữ "review" thành PR — gặp lại ngay trong phiên review | ✅ | — | Tooling | đã có ở sổ OPEN | Sổ OPEN, sửa trước review đóng Phase 5 |
| T2 | `mergedBy` luôn là AlexH-AI → không kiểm được PR `risk:med/high` có đúng do Owner bảo merge | ✅ (P-1, §5) | — | Tooling | | Sổ OPEN |

Codex kiểm thêm, không lập phát hiện: tổng tiền vượt `MAX_SAFE_INTEGER` làm formatter ném lỗi (trên 9 triệu tỷ đồng, ngoài quy mô); 8 lần xuất đồng thời giữ đủ file; đường dẫn tổng 318 ký tự với thành phần ngắn ghi được.

## 3. Đánh giá hai báo cáo

- **Claude** rộng hơn ở hiển thị / i18n / a11y / hiệu năng và đối chiếu sổ review-notes; bỏ sót ba lỗi Codex thấy (P2 nút Hôm nay qua nửa đêm, P5 case size âm khi nhập backup, P6 Tổng khi không còn team).
- **Codex** mạnh ở tái hiện thực (Edge + `page.clock`, harness Rust trên `storage.rs`, đọc lại `.xlsx`), có SHA256 exe; nhầm một chỗ (P8: không có bảng thay thế cho chart) và đánh giá P4 khác Claude.
- Cả hai cùng thấy P1 và P3 độc lập.

## 4. Quyết định Owner 04/10/2026

1. **Làm A–F trước G7:** T-125 #317 … T-131 #323 (milestone Phase 4).
2. **G2:** thêm C10 (30/04/2027 → so 01/03 – 30/03) và C11 (28/02/2027 → so 01/01 – 28/01) vào spec §4.2; làm rõ "kỳ đã hết" = hôm nay **sau** ngày cuối kỳ.
3. **P7:** tối ưu thuật toán (T-131) **và** đặt trần kỳ Tùy chọn **tối đa 3 tháng lịch**, áp **mọi màn có bộ chọn kỳ** (T-130). Luật chi tiết: spec §3.1. Claude chọn thêm (Owner có thể đổi): chuyển từ Năm sang Tùy chọn → giữ ngày đầu, cắt ngày cuối về trần; ‹ › tắt khi kỳ dời vượt trần.

## 5. Thứ tự làm đề xuất

1. PR docs này (spec C10–C11, §3.1) — mở khóa T-125, T-130.
2. T-125 #317 (`risk:med`), T-128 #320, T-127 #319 (độc lập, nhỏ).
3. T-129 #321 (sau T-125: cùng `overview-view.test.ts`).
4. T-130 #322, rồi T-131 #323 (cùng vùng kỳ / mốc).
5. T-126 #318 (`risk:med`, chạm 5 màn — làm khi các task trên đã merge để tránh xung đột).
6. Sổ review-notes, `docs/metrics/phase-4.md`, dòng Phase 4 trong `docs/PROJECT-PLAN.md`, rồi **G7**.

## 6. Đối chiếu sổ review-notes (đã cập nhật trong PR này)

- **RESOLVED:** T-f / F-14 (`MAX_YEAR`, `canShift`, `addDays` ném `RangeError` — #300); T-i / F-18 (escape formatter ECharts — #312); `Overview.tsx` lấy hôm nay qua `useAppData().today()` (#309). Phần "ngày cũ sau nửa đêm" mở riêng thành T-126.
- **OPEN mới:** P8 (chart a11y), P12 (coverage view), T2 (người merge); F-01 bổ sung "case size dự kiến" → T-128.
- **Giữ OPEN:** ô ngày Tùy chọn báo đỏ sớm khi Tab; hook `review-pr-hint.mjs` (T1, ưu tiên sửa trước review đóng Phase 5); `session-end.ps1` `git add -A`; S-1 / D-1; S-2; các ghi chú theo file Phase 4 không chạm.
- Ba ghi chú review #316 trong HANDOFF (slug dài, "đầy ổ đĩa", thông báo sau Lọc) → T-127, không chép vào sổ.
