# Chỉ số Phase 4 — Dashboard & báo cáo

Theo bảng chỉ số của `docs/COMPARISON.md`. Số đo lấy trên `main` `3d23739` (05/10/2026, Home PC `DESKTOP-KDURKJP`). Ô ghi **Owner điền** là số chỉ Owner biết (điểm UI/UX, ước lượng phiên / hạn mức, can thiệp ngoài cổng); Claude không tự ước.

- **Milestone:** "Phase 4 — Dashboard & báo cáo" — 40 Issue, 0 mở (#251 → #337; gắn thêm 27 PR vào milestone), 47 PR merge từ #260 tới #339.
- **Bắt đầu:** 2026-10-02 (mở milestone sau G7 Phase 3, Đợt 2 của review đóng phase: #251–#259) · **Task cuối merge:** 2026-10-05 giờ VN (PR #339, T-134, `main` `3d23739`) · **Đóng milestone:** chờ G7.
- **Máy:** Home PC (số đo và kiểm tay đều ở máy này). HANDOFF chuyển từ `docs/state/HANDOFF.md` sang Issue ghim #284 (ADR-0003 phụ lục, T-116).
- **Spec:** `docs/design/phase-4-chi-so.md` (G2 Owner duyệt 03/10, thêm C10–C11 ngày 04/10); mockup Tổng quan + Báo cáo duyệt ở G3 (#254).

## Task

"Review vòng đầu": kết luận của comment `REVIEW:` đầu tiên trên mỗi PR (skill `review-pr`, phiên sạch). `CHANGES` = có mục chặn phải sửa rồi review lại.

| Issue | Việc | PR | Risk | Review vòng đầu |
|---|---|---|---|---|
| #251 | e2e local ổn định (F-05, R2-06) | #261 | low | PASS |
| #252, #263 | Nhập backup kiểm lần 3 + luật nhân sự (R2-01, R2-02); fact KYC từ chối ghi chú SYSTEM | #262, #264 | high ×2 | PASS ×2 |
| #253 | G2 Phase 4: đếm lịch, đếm KH theo nhóm, miền năm, chỉ số từng màn | #265 | low · G2 | — (Owner duyệt) |
| #254 | G3 mockup Tổng quan (ý 9) + Báo cáo | #266 | low · G3 | — (Owner duyệt) |
| #255 | Index stats engine + `monthToDate` | #279 | med | PASS (kèm ghi chú) |
| #256, #258 | Miền năm 1900–2100 + bộ chọn kỳ tắt nút ở biên; lệnh DB chặn ngày tương lai, `today(db)`, câu lỗi mọi mã | #300, #303 | med ×2 | CHANGES, PASS |
| #257 | CI coverage theo từng gói + lớp app, ghim SHA Actions | #302 | med | PASS |
| #259, #307 | Dọn UI / i18n; chữ Dời lịch xám | #306, #308 | low ×2 | PASS ×2 |
| #268, #269, #270 | Domain: đếm lịch 4 nhóm; KH theo nhóm ảnh chụp cuối kỳ; so với kỳ trước | #299, #301, #304 | med ×3 | CHANGES, PASS, PASS |
| #271 | Màn Lịch hẹn 4 nhóm | #305 | med | PASS |
| #272, #273, #274 | Tổng quan: Lọc + 6 KPI; KH theo nhóm + chart; so sánh team → RE | #309, #312, #313 | med, med, low | PASS (kèm ghi chú), CHANGES, PASS |
| #275, #276, #277 | Báo cáo: Tổng hợp / Theo team / Theo RE; Theo mốc; xuất Excel (ExcelJS 4.4.0, G4) | #314, #315, #316 | med, low, med | CHANGES, PASS, PASS |
| #310 | Nút Hôm nay trong bộ chọn kỳ | #311 | low | PASS |
| #280, #283, #286–#289, #294, #296 | Retro điều hướng repo, 3 đợt: HANDOFF lên Issue ghim, rules theo đường dẫn, `CLAUDE.md` theo package + `codemap`, `pr-status` / `merge-pr` / `retro`, prompt audit | #281, #282, #285, #290–#293, #295, #297 | low / med | không tính vào số bên dưới (tooling, docs) |
| #317, #318, #319, #320, #321, #322, #323, #329, #336, #337 | Sửa từ review đóng phase (A–F) + T-132 Owner thêm + T-133 / T-134 (Owner quyết 05/10: dọn ghi chú review không chặn trước G7): kỳ trước đúng số ngày, nửa đêm, tên file Excel, backup case size, dọn hiển thị, trần kỳ Tùy chọn 3 tháng, tính Theo mốc một lượt, người đánh giá kết quả chỉ IS / TL / BDM / BD; Lịch đã qua ghi Chưa ghi kết quả ở hộp Hẹn tiếp / Dời / Xóa và timeline KYC; dọn ghi chú không chặn | #325, #334, #327, #326, #328, #331, #332, #330, #338, #339 | low / med | PASS ×10 |
| — | Review đóng phase (báo cáo gốc, tổng hợp, spec C10–C11) | #324 | low | — (docs) |
| — | Đóng phase (file này) | PR này | low · G7 | — |

## Chỉ số

| Nhóm | Chỉ số | Giá trị |
|---|---|---|
| Chất lượng | % test chấp nhận pass lần đầu | PR code của task sản phẩm: **26/30 (87%)** PASS ở review vòng đầu (4 CHANGES: #299, #300, #312, #314; không tính PR retro / docs). Phase 3: 62/75 (83%). 10 PR sửa từ review đóng phase đều PASS vòng đầu. Golden Phase 2–3 và bảng golden G2 Phase 4 chạy qua domain / DB, fixture không sửa "cho xanh" (review đóng phase kiểm: 4 commit chạm golden đều thêm bảng mới đã duyệt G2) |
| Chất lượng | Lỗi Owner phát hiện khi duyệt | **0**. Owner kiểm tay exe `595ef79` (04/10) trước review đóng phase: mọi thứ đúng mô tả, kể cả xuất Excel. T-132 (#329) là **đổi yêu cầu** của Owner (người đánh giá kết quả chỉ IS / TL / BDM / BD, đổi D9 Phase 3), không phải lỗi |
| Chất lượng | Lỗi sau merge | Do review tìm, không do người dùng gặp: review đóng phase (Claude + Codex họ GPT-6) → **0 Critical / High, 2 Medium** (so với kỳ trước ở ngày cuối kỳ cho ▼ giả; nút Hôm nay giữ kỳ cũ khi app mở qua nửa đêm), 7 Low, 3 Nit, 2 mục tooling; sửa trước G7 (#317–#323, #329, #336, #337) trừ P8 (chart N4–N1 chưa có số cho trình đọc màn hình) và P12 (coverage chưa đo `*-view.ts`) vào sổ OPEN. |
| Chất lượng | Coverage | `packages/domain`: 100% (không file nào dưới 100%). `packages/db/src`: 99,35% statements / 97,93% branches / 100% functions / 99,72% lines. Toàn bộ: **98,49 / 97,8 / 98,2 / 98,84** — thấp hơn Phase 3 (99,49 / 98,41 / 100 / 99,78) vì T-101 (#302) đo thêm lớp `apps/desktop` (trước đó không tính; `useRoute.ts` 0%, `tauri-storage.ts` 91,7%). Ngưỡng coverage giờ ép theo từng gói + lớp app |
| Chất lượng | Số test | **1.247** test / 65 file (Phase 3: 782 / 47). e2e **145/145** pass, 0 flaky, `CI=1`, Edge, 2,3 phút (Phase 3: 113 + 1 flaky / 114). Rust 37/37 (Phase 3: 36) |
| UI/UX | Điểm Owner (1–10): thẩm mỹ dark mode / độ rõ số liệu / tốc độ thao tác nhập liệu | **Owner điền** (Phase 3: 8 / 8 / 8). Mockup Tổng quan + Báo cáo Owner duyệt ở G3 (#254) |
| Tiến độ | Ngày bắt đầu / kết thúc | 02/10 → 05/10/2026 giờ VN (task cuối PR #339); đóng milestone chờ G7. Cùng thời gian có retro điều hướng repo (T-115…T-122, 03/10) |
| Tiến độ | Số phiên làm việc | **Owner điền.** Dữ liệu tham khảo: 47 PR merge (30 PR code task sản phẩm, 9 PR retro, 8 PR docs); `retro.mjs` trên Home PC thấy 15 phiên task + 15 phiên review trong 30 phiên gần nhất (gần hết là 04/10) |
| Chi phí | Mức dùng hạn mức Claude | **Owner điền** (Phase 3: ~2 tuần hạn mức) |
| Công sức Owner | Can thiệp ngoài cổng G1–G8 | **Owner điền** (Phase 3: ~3 lần). Ghi nhận từ repo: Owner chọn thứ tự sửa A–F, thêm T-132, duyệt thêm spec C10–C11 và trần kỳ Tùy chọn 3 tháng ở bước tổng hợp review đóng phase; chạy Codex review (theo ADR-0001 M2) |
| Kỹ thuật | Kích thước exe | **Chưa đo trực tiếp:** artifact CI của `main` `3d23739` (run `37227193449`) là zip **2,28 MB** (2.394.406 byte); tải về đo `project2c.exe` cần Owner đồng ý tải file. Phase 3: exe 3,93 MB, zip 2,16 MB. Có thêm ExcelJS (G4) từ Phase 4; chưa tách phần tăng do ExcelJS |
| Kỹ thuật | Thời gian khởi động | **Owner điền** (Phase 3: lần đầu ~2 s, mở lại ~1 s) |
| Kỹ thuật | Vi phạm ranh giới module | 0 (`pnpm lint:deps`: 214 module, 842 phụ thuộc; Phase 3: 179 / 680) |

## Kiểm tra trên `main` `3d23739` (05/10/2026, Home PC)

| Lệnh | Kết quả |
|---|---|
| `pnpm verify` | ✅ Prettier, ESLint `--max-warnings 0`, `lint:deps` 0 vi phạm, `lint:tokens`, `codemap:check`, typecheck, 65 file / 1.247 test, coverage như trên |
| `pnpm verify:rust` | ✅ `cargo fmt --check`, clippy `-D warnings`, 37/37 test |
| `pnpm e2e` (`CI=1`) | ✅ 145/145 pass, 2,3 phút |
| CI `main` (Verify + e2e + build exe) | ✅ run `37227193449` xanh (cả build exe) |
| Kiểm tay exe | ✅ Owner, 04/10, bản `595ef79` (trước sửa A–F): không có vấn đề. Bản cuối `3d23739` chưa kiểm tay — **Owner kiểm trước G7** (xuất Excel, nút Hôm nay, trần kỳ Tùy chọn, Lịch hẹn 4 nhóm, người đánh giá kết quả) |

## Review đóng phase

- **Review đóng Phase 4** (04/10/2026, SHA `595ef79`, diff `5eb7c03..595ef79`, 38 commit): hai review độc lập — Claude Code (phiên sạch, chạy test) và **Codex họ GPT-6** (Owner chạy, chỉ đọc + tái hiện thực). Claude kiểm lại từng phát hiện trên code, hợp nhất thành P1…P12 + 2 mục tooling. Báo cáo gốc: `docs/reviews/raw/2026-10-04/`; tổng hợp: `docs/reviews/2026-10-04-phase-4-tong-hop.md`.
- **Kết quả:** 0 Critical / High. Hai Medium thật (P1 ngày cuối kỳ, P2 nửa đêm). Claude kết luận sẵn sàng G7 sau khi sửa P1; Codex kết luận chưa sẵn sàng vì 2 Medium; Owner chọn sửa hết A–F trước G7.
- **Đóng góp của Codex:** tìm P2 (nửa đêm, tái hiện bằng `page.clock` trên Edge), P5 (`expected_case_size` âm lọt qua nhập backup), P6 (Tổng So sánh team khi không còn team) mà Claude bỏ sót; đọc lại `.xlsx` xuất ra; harness Rust trên `storage.rs`. Codex nhầm một chỗ (P8: tưởng chart có bảng thay thế). **Đóng góp của Claude:** hiển thị / i18n / a11y / hiệu năng (P7 kỳ Tùy chọn 2,7 s), đối chiếu sổ review-notes, hook `review-pr-hint` và `mergedBy` (tooling).
- **Quyết định Owner (04/10):** sửa A–F trước G7 (+ T-132 Owner thêm; T-133, T-134 thêm 05/10); thêm C10–C11 vào G2; vừa tối ưu thuật toán vừa chặn kỳ Tùy chọn tối đa 3 tháng lịch ở mọi màn.

## Điều hướng (riêng 2C, `docs/metrics/README.md`)

Đo bằng `node tools/retro.mjs` trên Home PC, 30 phiên gần nhất (đều từ 26/09 tới 04/10; 28 phiên là 04/10, nên đây là số của **cuối Phase 4**, sau retro đợt 1–3). Cột trước retro lấy từ retro #280.

| Chỉ số | Mục tiêu | Trước retro (#280) | Phase 4 (cuối) |
|---|---|---|---|
| Số lệnh dò trước lần sửa đầu (trung vị phiên task) | **≤ 5** | 6–19 | **13** (15 phiên task; ✗ chưa đạt, phiên review trung vị 7) |
| Context ở lượt 3 | theo dõi | ~62k | **73,2k** (task), 74,9k (review) — tăng so với trước retro (chưa tách nguyên nhân; có thể do hook nạp HANDOFF + rules + `CLAUDE.md` package) |
| Dò sai đường | → 0 | — | **0** ở mọi phiên |
| Số lần nạp HANDOFF mỗi phiên | **1** | — | trung vị **1** (một số phiên 3: hook báo lỗi / phiên đọc lại) |
| Độ dài HANDOFF | < 10.000 ký tự | — | **3.683** (Issue #284) |
| PR chỉ để sửa HANDOFF | **0** | 41/175 PR | **0** kể từ 03/10 |

Nhận xét: HANDOFF, dò sai đường, PR sửa HANDOFF đã đạt; số lệnh dò (13) vẫn xa mục tiêu ≤ 5 và context lượt 3 không giảm — chưa phân tích nguyên nhân. Để Phase 5 xem tiếp, không chặn G7.

## Việc hoãn sang phase sau

- **Sổ OPEN** (`docs/state/review-notes.md`): P8 chart N4–N1 chưa có số cho trình đọc màn hình; P12 coverage chưa đo `routes/**/*-view.ts`; hook `review-pr-hint.mjs` hiểu "Issue #N" thành PR (sửa trước review đóng Phase 5); `mergedBy` luôn AlexH-AI nên chưa kiểm được PR `risk:med/high` do Owner bảo merge.
- **Phase 5:** quyết định gọi mạng + lưu key trước `packages/ai` (D-1, G4 / G6); phiên task nên đo lại số lệnh dò (mục tiêu ≤ 5).
- **Phase 6:** màn Thùng rác, snapshot mỗi bảng một file (S-1), tuần tự hóa thay DB / lưu / xuất / đồng bộ (S-2), đồng bộ `Project-2C-data`.

## Ghi chú

- Phase 4 ngắn (4 ngày) vì Phase 3 đã dựng sẵn stats engine (Phase 2), DB, kỳ / bộ chọn; phần mới là đếm 4 nhóm, ảnh chụp cuối kỳ, so với kỳ trước, hai màn và xuất Excel. Sau review đóng phase vẫn mất thêm 10 task (#317–#323, #329, #336, #337) vì 2 Medium và đổi yêu cầu D9.
- Dependency mới: `exceljs` 4.4.0 (G4, Owner xác nhận 04/10).
- `docs/COMPARISON.md` không đổi (phải giống hệt Project-2).
- Cổng còn lại: **G7** — Owner kiểm tay exe bản `3d23739`, điền các ô **Owner điền** ở trên, rồi đóng milestone.
