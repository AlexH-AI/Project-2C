# Review đóng Phase 4 — Claude

- **Ngày:** 04/10/2026 (18:50 → 19:10, giờ máy Home PC `DESKTOP-KDURKJP`)
- **Reviewer:** Claude Code, model Opus 5.5 (`claude-opus-5-5`), phiên sạch, làm inline (không subagent, không `review-pr` / `code-review`)
- **SHA snapshot:** `595ef7906d1f40a14498831418d47d535998147d` (`main` sau PR #316)
- **Worktree:** `C:\workspace\Project-2C-review`, detached HEAD, chỉ đọc
- **Phạm vi diff:** `5eb7c03..595ef79`: 38 commit, 196 file, +15 416 / −1 112 dòng. Đọc thêm phần code cũ mà Phase 4 gọi vào: `packages/domain` (period, stats, lifecycle), `packages/db` (team, customers, appointments, policies, backup-validation), `apps/desktop/src/data`, `shell/scope.ts`, `src-tauri/src/storage.rs`.
- **Nguồn để phân loại NEW / KNOWN:**
  - `docs/state/review-notes.md` (OPEN / RESOLVED / ACCEPTED);
  - `docs/reviews/2026-09-30-phase-1-3-tong-hop.md` (F-01…F-19);
  - `docs/reviews/2026-10-02-phase-1-3-review-2-tong-hop.md` (R2-01…R2-07);
  - `docs/reviews/2026-10-01-phan-hoi-owner-kiem-exe.md`;
  - HANDOFF (Issue #284, hook nạp lúc mở phiên): mục "3 ghi chú không chặn của review #316", chưa chép vào sổ.
  - Không đọc comment review của từng PR trước khi kết luận. Riêng P-1, em chỉ trích dòng đầu `REVIEW: PASS` + SHA.
- **Spec đã đối chiếu:**
  - `CLAUDE.md` (gốc + package), `.claude/rules/*.md`, `CONTEXT.md`;
  - `docs/design/phase-4-chi-so.md` (§1–§4.5);
  - mockup `overview.html` (1a–1e, phần 2), `reports.html` (2a–2f), phần Lịch hẹn;
  - ADR-0005, ADR-0011;
  - golden `docs/golden/{chi-so,lich-hen,kh-theo-nhom}.md` + fixture `packages/domain/src/golden/**`;
  - Issue #255, #256, #268–#277, #307, #310.

## 1. Kết luận G7

**SẴN SÀNG cho G7**, kèm một khuyến nghị: sửa **CL4-001** (Medium) trước G7 hoặc làm task đầu tiên sau G7. Đây là task nhỏ trong `packages/domain/src/compare.ts`, khoảng 5 dòng sản phẩm + 30 dòng test, `risk:med`.

Lý do:

- **Không có Critical / High.** Không có đường mất dữ liệu, không lỗ bảo mật:
  - tooltip escape (F-18);
  - Excel ghi tên dạng chuỗi, không thành công thức;
  - tên file chỉ gồm ASCII an toàn.
- **Số liệu khớp nhau ở luồng chính.** Trên seed (6 229 lịch, 1 200 KH, 988 HĐ, 3 309 lần chuyển nhóm, 36 người, 3 team) em thử **55 tổ hợp** kỳ × góc nhìn (11 kỳ gồm Ngày / Tuần / Tháng đang chạy, đã qua, chưa tới / Năm / Tùy chọn × 5 góc nhìn). Các cặp sau khớp từng ô:
  - ô Lịch hẹn và 6 KPI của Tổng quan với dòng Tổng hợp của Báo cáo;
  - 4 ô N4–N1 với 4 cột KH cuối kỳ;
  - dòng Tổng của So sánh team với Tổng của Theo team / Theo RE;
  - Σ Theo mốc với Tổng hợp;
  - sheet Excel với màn hình.
- **Golden đúng spec G2, không bị sửa "cho xanh".**
- **Bằng chứng xanh:** `pnpm verify` 1 125 test, Rust 37/37, e2e 137/137 không flaky, build exe trên `main` xanh.
- **CL4-001 là lệch spec §4.2 mục 2 ở một ca biên có thật:** ngày cuối các tháng 30 ngày và tháng 2 (5 ngày mỗi năm). Lỗi nằm ở màn mặc định (Tháng MTD), nên dễ gặp, nhưng chỉ làm sai dòng "so với kỳ trước", không làm sai số chính của kỳ.

| Severity | NEW | KNOWN | Tổng |
|---|---|---|---|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 1 (CL4-001) | 0 | 1 |
| Low | 2 (CL4-002, CL4-003) | 2 (CL4-004, CL4-005) | 4 |
| Nit | 4 (CL4-006…CL4-009) | 1 (CL4-010) | 5 |

## 2. Bằng chứng đã chạy

| Lệnh | Bắt đầu → kết thúc | Thời gian | Kết quả |
|---|---|---|---|
| `git fetch origin` · `git checkout --detach 595ef79…` · `git rev-parse HEAD` · `git status --short` | 18:50:23 | — | HEAD = `595ef7906d1f40a14498831418d47d535998147d`, status sạch |
| `pnpm install --frozen-lockfile` | 18:50:26 → 18:50:26 | < 1 s | "Lockfile is up to date", pnpm 12.6.0 |
| `pnpm verify` | 18:50:31 → 18:51:57 | 86 s | ✅ (chi tiết ngay dưới bảng) |
| `pnpm verify:rust` | 18:52:17 → 18:52:28 | 11 s (build có cache) | ✅ `cargo fmt --check`, `clippy -D warnings`; **37/37** test |
| Kiểm cổng 4173 (`Get-NetTCPConnection`) | 18:52:50 | — | trống; không có phiên e2e khác (có Codex + một Vite dev ở cổng 1420, không đụng 4173) |
| `$env:CI='1'; pnpm e2e` | 18:52:58 → 18:55:14 | 2 phút 16 s | ✅ **137 passed**, 0 flaky, 0 failed (12 worker) |
| `gh run list --branch main` | 18:57 | — | run `37198749364` (`595ef79`, push): **Build portable exe ✅**, Verify skipped (push `main` chỉ build). Artifact `Project-2C-595ef7906d1f40a14498831418d47d535998147d` 2,39 MB. 5 run `main` trước (#311–#315) đều xanh |
| P-1: `gh pr view <n> --json headRefOid,comments,reviews,mergedBy,labels` | 18:58 | — | Xem đoạn P-1 dưới bảng |
| Golden: `git log 5eb7c03..595ef79 -- packages/domain/src/golden/ docs/golden/` | 18:56 | — | Xem đoạn Golden dưới bảng |
| Test tạm `pnpm exec vitest run apps/desktop/src/routes/zz-p4review.repro.test.ts` | 18:59:27 → 18:59:37 | 9 s | 8/8 pass (tái hiện CL4-001, đo CL4-002, kiểm khớp số 55 tổ hợp, Excel). Đã xóa, nội dung ở §6 |
| `pnpm audit --prod` | 19:05 | — | 1 moderate: `uuid <11.1.1` qua `exceljs` (GHSA-w5hq-g745-h8pq, chỉ v3/v5/v6 khi truyền `buf`). Xem §3 "Đã kiểm" |
| Bundle (`apps/desktop/dist/assets` do e2e build) | 19:04 | — | `exceljs.min-*.js` 930 KB / **256 KB gzip**, chunk riêng, `index` chỉ gọi qua `import()`. `chart-*.js` 176 KB gzip (≤ 250 KB). `index-*.js` 216 KB gzip |
| `git status --short` cuối phiên | 19:08 | — | sạch; HEAD vẫn `595ef79` |

**Chi tiết `pnpm verify`:**

- `prettier` sạch. `eslint --max-warnings 0`: **0 cảnh báo**.
- `depcruise`: 0 vi phạm (212 module, 834 phụ thuộc). `lint:tokens`, `codemap:check`, `typecheck` đều xanh.
- Vitest: **64 file / 1 125 test**.
- Coverage:

  | Vùng | Stmts | Branch | Funcs | Lines |
  |---|---|---|---|---|
  | Toàn bộ | 98,38 | 97,66 | 98,1 | 98,76 |
  | `packages/domain` | 100 | 100 | 100 | 100 (ngưỡng 100, không file nào bị liệt kê) |
  | `packages/db/src` | 99,35 | 97,9 | 100 | 99,71 |
  | `apps/desktop/src/data` | 96,62 | 91,48 | 92,45 | 98,43 |
  | `apps/desktop/src/shell/*.ts` | 75,94 | 86,66 | 78,12 | 76,11 |

**P-1 trên 20 PR Phase 4:**

- PR đã kiểm: #261, #262, #264, #279, #299–#306, #308, #309, #311–#316.
- **20/20 PR có SHA trong `REVIEW: PASS` cuối cùng trùng `headRefOid` lúc merge.** Có PASS lại sau khi head đổi: #279, #303, #305.
- Có 14 PR `risk:med/high`. Cả 20 PR đều có `mergedBy = AlexH-AI`: Owner và Claude dùng cùng tài khoản `gh`, nên GitHub không cho biết ai đã merge (xem §5).

**Golden:**

- Bốn commit chạm golden:
  - `0b0e884` (#265): bảng docs G2;
  - `b16f632` (#279): thêm test G18 = `monthToDate`, không đổi số;
  - `250db4a` (#299): fixture A01–A13. Trong vòng review, Owner duyệt đổi id KH thành `kh-l01…`; số kỳ vọng không đổi;
  - `38e6531` (#301): fixture S01–S13 + M01–M04.
- `metrics.fixture.ts` và `kyc.fixture.ts` không đổi.
- So từng dòng: A01–A13, S01–S13, M01–M04 trong fixture khớp `docs/golden/*.md` và spec §4.4.

## 3. Phát hiện

### CL4-001 — Ngày cuối tháng: "so với kỳ trước" lấy cả tháng trước thay vì cùng số ngày — Medium · NEW · REPRODUCED

- **File:** `packages/domain/src/compare.ts:44` (`if (compareDates(today, period.end) >= 0) return { current: period, previous: before };`)
- **Tình huống:**
  - Hôm nay 30/04/2027, Tổng quan mở mặc định Tháng 04/2027. Dòng "Đang xem" ghi **MTD 01/04 – 30/04/2027**, đúng §4.1 (`overview-view.ts:220`, test "the last day of the month is still MTD (C02)").
  - Nhưng `comparisonWindows` coi kỳ đã hết vì `today >= end`, nên so với **01/03 – 31/03** (31 ngày).
  - Theo spec phải so với **01/03 – 30/03** (30 ngày đầu kỳ trước).
  - Tương tự:
    - 28/02/2027 so với 01/01 – 31/01 (đúng: 01/01 – 28/01);
    - 29/02/2028 so với cả tháng 1 (đúng: 01/01 – 29/01);
    - 30/06, 30/09, 30/11 so với cả tháng trước 31 ngày.
  - Test tạm: một HĐ phát hành ngày 31/03. Ngày 29/04 ô HĐ phát hành hiện "= so với 01/03 – 29/03"; ngày 30/04 hiện **"▼ 1 so với 01/03 – 31/03"**. Kỳ trước dài hơn một ngày nên số so sánh lệch.
- **Spec bị vi phạm:**
  - `phase-4-chi-so.md` quy ước chung: "Kỳ 'chưa hết' = kỳ chứa hôm nay";
  - §4.2 mục 2: "Kỳ chưa hết → cửa sổ hiện tại = ngày đầu kỳ → hôm nay (n ngày); so với n ngày đầu của kỳ liền trước, cắt ở ngày cuối của kỳ trước nếu kỳ trước ngắn hơn";
  - Issue #270 "so với cùng số ngày".
  - C02 (31/03) vẫn xanh chỉ vì tháng 2 ngắn hơn, nên hai cách hiểu ra cùng kết quả.
  - Code đang tự mâu thuẫn: nhãn MTD coi ngày cuối là "chưa hết", còn cửa sổ so sánh coi là "đã hết".
- **Bằng chứng:** test tạm `CL4-001 last day of a month` (§6). Output:
  - `April 30 MTD label true 01/04 – 30/04/2027 | current 01/04/2027 – 30/04/2027 | previous 01/03/2027 – 31/03/2027`
  - `Feb 28 … previous 01/01/2027 – 31/01/2027`
  - `Nov 30 … previous 01/10/2026 – 31/10/2026`
  - `29/04 { tone: 'same', text: '=' } so với 01/03 – 29/03`
  - `30/04 { tone: 'down', text: '▼ 1' } so với 01/03 – 31/03`
- **Ảnh hưởng:** 5 ô so sánh (RF, HĐ nộp, Case size, HĐ phát hành, Doanh số) và điểm % tỉ lệ chốt. Xảy ra 5 ngày mỗi năm, ở kỳ mặc định của Tổng quan. Báo cáo / Excel không có cột so sánh nên không bị.
- **Đề xuất sửa:**
  - Kỳ chỉ "đã hết" khi `today > period.end`. Khi `today === end`, đi nhánh "đang chạy": `previousEnd = earlier(addDays(before.start, n − 1), before.end)`.
    - Ngày, Tuần: kết quả không đổi.
    - Năm: không đổi, vì `sameDayYearBefore(31/12)` = 31/12.
  - Thêm test: 30/04 → 01/03–30/03; 28/02/2027 → 01/01–28/01; 29/02/2028 (Tháng) → 01/01–29/01; 31/12 (Năm, Tuần, Ngày) không đổi; C01–C09 giữ nguyên.
  - Cỡ: ~5 dòng sản phẩm, ~30 dòng test.
  - File: `packages/domain/src/compare.ts`, `compare.test.ts`.
  - Có thể cần thêm một dòng vào bảng C của spec. Đổi bảng C là G2, nên hỏi Owner.

### CL4-002 — Kỳ Tùy chọn rất dài làm màn đứng vài giây — Low · NEW · REPRODUCED (đo trong Node)

- **File:**
  - `apps/desktop/src/routes/reports/reports-view.ts:251-257`: mỗi mốc gọi lại `appointmentCounts` + `periodMetrics`, mỗi lần duyệt toàn bộ lịch / HĐ / lần chuyển nhóm và dựng lại `rfMatcher`;
  - `stage-view.ts:103-114`;
  - `packages/domain/src/period.ts:357-361` (Tùy chọn > 31 ngày tách theo tháng, không giới hạn số cột).
- **Tình huống:** kỳ Tùy chọn 01/01/1900 – 31/12/2100 (ô nhập cho phép), góc nhìn Toàn bộ, trên seed. Đo:
  - `reportRows` **2 658 ms**, 2 412 mốc;
  - `stageBlock` 342 ms (Toàn bộ) / 450 ms (Team);
  - chart 2 412 cột × 5 series vẽ bằng SVG (Team: 3 chart).
- **Kết quả đúng:** đúng spec (chưa có trần độ dài). Tuy vậy WebView sẽ đứng vài giây sau khi bấm Lọc, có thể lâu hơn trong exe.
- **So sánh:** cùng seed, kỳ Năm chỉ mất 52 ms (`reportRows`), 13 ms (`teamCompare`), 6 ms (`stageBlock` Team). Không có phép tính O(n²) theo số lịch / KH.
- **Đề xuất sửa (chọn một):**
  - Gom bản ghi vào mốc trong một lượt (O(N + M)): đánh chỉ số mốc theo ngày, rồi cộng dồn.
  - Hoặc đặt trần cho kỳ Tùy chọn (ví dụ ≤ 5 năm). Cách này cần Owner quyết (G2 / G3).
- **Cỡ:** ~60 / ~150 dòng. File: `reports-view.ts`, có thể `period.ts` / `PeriodPicker.tsx`.

### CL4-003 — Chart N4–N1 không có số liệu cho trình đọc màn hình — Low · NEW · CONFIRMED (đọc code)

- **File:** `packages/ui/src/components/Chart.tsx:76` (`role="img" aria-label={label}`), `apps/desktop/src/routes/overview/StageBlock.tsx:238-249`.
- **Tình huống:**
  - Trình đọc màn hình chỉ đọc "Diễn biến khách hàng theo nhóm" hoặc "… · Team X".
  - Số từng cột chỉ có trong tooltip (cần chuột).
  - 4 ô N4–N1 cho số cuối kỳ, nhưng diễn biến theo ngày / tháng thì không có cách đọc.
- **Quy tắc:** `.claude/rules/i18n-ui.md` (tương phản AA, bàn phím / trình đọc màn hình); checklist review mục a11y. Bảng So sánh team và bảng Báo cáo thì đạt: `th scope`, `aria-expanded`, nút bàn phím được.
- **Đề xuất sửa:** thêm `aria-describedby` trỏ tới một bảng ẩn (`sr-only`) "mốc · N4 · N3 · N2 · N1", sinh từ `StageChart.columns`. Hoặc ghi chú trong mockup rằng Báo cáo → Theo mốc là bản thay thế dạng bảng.
- **Cỡ:** ~40 / ~80 dòng. File: `StageBlock.tsx`, `vi.ts`, e2e `overview.spec.ts`.

### CL4-004 — Tên file Excel không giới hạn độ dài; lỗi nào cũng báo "đầy ổ đĩa hoặc không có quyền" — Low · KNOWN (HANDOFF 04/10, ghi chú review #316, chưa vào sổ) · CONFIRMED

- **File:** `apps/desktop/src/routes/reports/report-workbook.ts:165-172` (`slug`), `:194-197`; `ReportExport.tsx:192-193`; `vi.ts:554-555`; `src-tauri/src/storage.rs:139-155`.
- **Tình huống:**
  - Tên góc nhìn "RE " + 360 ký tự cho tên file **454 ký tự** (test tạm).
  - Windows giới hạn 255 ký tự cho một thành phần đường dẫn. Thử ghi bằng Node: 244–250 ký tự (+`.tmp`) ghi được; 448 ký tự ra `ENOENT`. Rust còn cộng `.claim` / `.tmp`.
  - Lệnh xuất lỗi, nhưng UI báo "Không ghi được vào thư mục exports\ (đầy ổ đĩa hoặc không có quyền)". Câu báo này sai nguyên nhân.
  - Lỗi khi dựng workbook (vd. nạp chunk ExcelJS thất bại) cũng ra câu này.
  - Tên không có chữ Latin ("Team 東京", "RE 😀") thành `team`, `re`, không rỗng, không lỗi. Trùng tên đã có hậu tố `-2`.
- **Đề xuất sửa:**
  - Cắt slug, ví dụ ≤ 60 ký tự.
  - Tách câu báo theo pha: dựng file / ghi file. Bản web đã có câu riêng.
- **Cỡ:** ~15 / ~40 dòng.

### CL4-005 — Thông báo "Đã xuất báo cáo" còn hiện sau khi Lọc sang kỳ / góc nhìn khác — Low · KNOWN (HANDOFF 04/10, ghi chú review #316) · CONFIRMED (đọc code)

- **File:** `ReportExport.tsx:174-198` (`notice` chỉ xóa khi bấm Xuất lần sau); `ReportsScreen.tsx:86`.
- **Tình huống:** xuất Tháng 10 · Toàn bộ, rồi Lọc sang Năm · RE. Dòng "Đã xuất báo cáo · 4 sheet: …tháng 10…" vẫn đứng ngay dưới thanh lọc. Người dùng có thể hiểu nhầm là file của số đang xem. Tên file có ghi kỳ nên ít khả năng nhầm.
- **Đề xuất:** xóa `notice` khi `applied` đổi (truyền `applied` vào hook hoặc dùng `key`). Cỡ ~5 dòng + 1 e2e.

### CL4-006 — Kỳ Tùy chọn chưa bắt đầu: ô KPI "—" kèm câu "Kỳ Tùy chọn không so với kỳ trước" — Nit · NEW · CONFIRMED (đọc code)

- **File:** `apps/desktop/src/routes/overview/overview-view.ts:105-109`.
- **Tình huống:** Tùy chọn 01/11 – 15/11/2026 khi hôm nay là 15/10.
  - 6 ô KPI ghi "—" và câu "Kỳ Tùy chọn không so với kỳ trước", vì nhánh `custom` được xét trước nhánh "chưa bắt đầu".
  - Câu này không giải thích vì sao ô ghi "—".
  - Mockup 1e cho kỳ chưa bắt đầu ghi "kỳ chưa bắt đầu".
- **Đề xuất:** xét "chưa bắt đầu" trước `custom` (2 dòng + 1 test).

### CL4-007 — Ngày 1 của tháng: "Đang xem" ghi "MTD 01/04 – 01/04/2027" — Nit · NEW · CONFIRMED (đọc code)

- **File:** `overview-view.ts:227`, `team-compare-view.ts:256` và `report-workbook.ts:97`, cả ba qua `formatPeriodValue(customPeriod(start, today))` ở `period.ts:312-316`.
- **Tình huống:** khoảng một ngày hiện thành "01/04 – 01/04/2027" ở "Đang xem", ở So sánh team "(MTD)" và ở dòng đầu sheet Excel. Đọc vẫn đúng nhưng thừa. Mockup không vẽ ca này.
- **Đề xuất:** khoảng một ngày dùng `formatDate`. Cỡ ~3 dòng + test.

### CL4-008 — Lịch đã qua còn "Đã lên lịch": cột Trạng thái ghi "Chưa ghi kết quả", nơi khác vẫn ghi "Đã lên lịch" — Nit · NEW · CONFIRMED (đọc code)

- **File:**
  - đúng spec: `AppointmentsScreen.tsx:189-193` (`statusLabel`);
  - còn chữ cũ:
    - `AppointmentsScreen.tsx:562` (khối "Trong ngày");
    - `:623` (panel chi tiết);
    - `customers/CustomerAppointments.tsx:24` (Hồ sơ KH, "Các lần hẹn trước").
- **Spec:** §4.5 chỉ yêu cầu cột Trạng thái của danh sách, nên đây **không trái spec**. Nhưng cùng một lịch lại có hai chữ khác nhau giữa danh sách và panel cạnh nó. "Đã lên lịch" màu xanh `info` cho lịch hôm qua cũng trái nghĩa thường của nhãn.
- **Đề xuất:** dùng `statusLabel` ở 3 chỗ còn lại, hoặc ghi ACCEPTED nếu Owner muốn giữ. Cỡ ~10 dòng.

### CL4-009 — Phân cách " – " và glyph ▾ ▸ viết cứng trong view Phase 4 — Nit · NEW · CONFIRMED

- **File:** `overview-view.ts:96` (`` `${formatDayMonth(start)} – ${formatDayMonth(end)}` ``), `TeamCompare.tsx:348` (`'▾' : '▸'`, `aria-hidden`).
- **Quy tắc:** `.claude/rules/i18n-ui.md` không cho chuỗi cứng; F-15 đã đưa `·` / `→` qua `sep.*`, nhưng `lint:tokens` chỉ chặn hai ký tự đó.
- **Đề xuất:** thêm `sep.range` hoặc dùng hàm định dạng của domain. Glyph trang trí có thể ghi ACCEPTED.

### CL4-010 — Coverage không đo `apps/desktop/src/routes/**/*-view.ts` — Nit · KNOWN (phần còn lại của F-08) · CONFIRMED

- **File:** `vitest.config.ts:12-17`. `include` chỉ gồm domain, db, `data/**`, `shell/*.ts`.
- **Tình huống:** Phase 4 dồn logic vào `overview-view.ts`, `stage-view.ts`, `stage-chart.ts`, `team-compare-view.ts`, `reports-view.ts`, `report-workbook.ts`, `applied-filter.ts`, đúng quy tắc "logic thuần ở `*-view.ts` có test". Test có đủ (xem "Đã kiểm" bên dưới), nhưng không ngưỡng nào giữ chúng nếu có người xóa test.
- **Đề xuất:** thêm glob `apps/desktop/src/routes/**/*-view.ts` (+ `applied-filter.ts`, `report-workbook.ts`, `stage-chart.ts`) với ngưỡng đo được lúc thêm. Cỡ ~10 dòng.

### Đã kiểm, không thành phát hiện

**1. Kỳ và ngày**

- MTD ngày 1:
  - cửa sổ 01/04–01/04, so với 01/03–01/03;
  - `countedWindow` ra kỳ một ngày.
- MTD ngày cuối: nhãn MTD đúng; phần so sánh xem CL4-001.
- Tháng 2:
  - `lastDayOfMonth` qua `Date.UTC`;
  - C07: 29/02/2028 so tới 28/02/2027 (test domain);
  - Năm chưa hết ngày 28/02/2028 so với 01/01–28/02/2027.
- Tuần vắt tháng / năm:
  - `periodOf('week')` neo Thứ Hai;
  - `markName` / `markLabel` thêm năm khi kỳ vắt năm (`withYear`);
  - `windowText` thêm năm khi khác năm.
- Năm đang chạy / đã qua / tương lai:
  - `snapshotDate` null khi `today < start`;
  - KPI "—" + "kỳ chưa bắt đầu";
  - tháng sau hôm nay ở Theo mốc là "—" (e2e).
- Tùy chọn:
  - ngược bị từ chối (`customPeriod` ném, picker báo đỏ);
  - một ngày ra 1 mốc / 1 cột;
  - rất dài: xem CL4-002.
- Biên 1900 / 2100:
  - `canShift` tắt ‹ ›;
  - `comparisonWindows` null kèm câu "kỳ trước ngoài miền 1900–2100" (khớp 1e);
  - tuần cuối cắt 27/12–31/12/2100;
  - `monthGrid` không `shift` qua 2100.
- "Hôm nay":
  - `todayPeriod`: Tùy chọn → Tháng hiện tại; đang đúng kỳ thì không đổi;
  - luôn bật (e2e ở năm 1900);
  - ở Tổng quan / Báo cáo chỉ đổi lựa chọn, chờ Lọc.
- Ngày local / UTC: `fromLocalDate` theo giờ máy. Đồng hồ DB `now()` cùng nguồn với `today()` (#245). Không còn `new Date()` rải rác ở màn Phase 4 (grep `apps/desktop/src`: chỉ `app-data.ts` mặc định và hai chỗ hiển thị thời điểm file của Settings).
- Qua nửa đêm khi màn đang mở: `today` đọc lại ở mỗi lần render, số đổi ở lần render sau (vd. khi bấm Lọc), không lẫn hai ngày trong một lần tính.
- Đồng hồ máy ngoài 1900–2100 thì `calendarDate` trong `Overview.tsx:39` ném lỗi và ErrorBoundary bắt. Ca này không thực tế.

**2. Chỉ số**

- Tỉ lệ chốt khi 0 RF: "—" (`closeRate` null).
- Tỉ lệ > 100%: G11 150%, G20 120%; `formatPercent` nhóm nghìn.
- Dòng Tổng: Σ HĐ phát hành ÷ Σ RF, không lấy trung bình (test G09–G11 ở cả `team-compare-view` và `reports-view`).
- Làm tròn:
  - `formatPercent` và định dạng Excel `0.0%` cùng làm tròn nửa lên (số dương);
  - tiền compact chỉ ảnh hưởng hiển thị, Excel giữ số đồng đầy đủ.
- Khớp chéo: 55 tổ hợp trên seed khớp từng chuỗi ô (§6).
- Số lớn / âm / NaN:
  - `formatCount` ném khi số âm, nhưng chênh lệch luôn qua `Math.abs`;
  - mẫu số luôn > 0;
  - Vnd là số nguyên an toàn.
- "—" và 0: trước khi kỳ bắt đầu là "—", sau đó là 0 (`sumFigures` dùng cờ của kỳ, test "a team without RE").

**3. Đếm lịch hẹn**

- Một bản ghi tính một lần ở kỳ của ngày mình. Chuỗi dời 3 mắt xích ra 3 dòng (A03).
- Xóa lịch con thì lịch gốc vẫn là Dời lịch (A13). KH đã xóa bị loại qua join ở `listAppointments`.
- Người phối hợp không tính (A07, A09).
- Lịch hôm nay là Dự kiến; hôm qua là Chưa ghi kết quả (A05, A12).
- Lịch tương lai:
  - `OUTCOME_IN_FUTURE` chặn MET / NO_SHOW;
  - CANCELLED / RESCHEDULED tương lai tính ở nhóm Dời – hủy – không đến theo §1 mục 2 (đúng spec).
- `monthGrid` là 42 ô × N lịch, không phải O(n²).

**4. Ảnh chụp nhóm KH**

- `stageAtEndOf` lấy lần cuối trong ngày, thứ tự `seq` (`listStageTransitions` sắp theo `customer_id, seq`; sort ổn định).
- `appendTransition` cấm ngày lùi (`TRANSITION_BEFORE_LATEST`).
- KH tạo sau mốc không tính. KH xóa mềm / transition rút lại bị loại.
- Kỳ tương lai ra "—". Đổi RE thì mọi kỳ tính cho RE mới (S07).
- Tháng trong Năm → cuối tháng, tháng chứa hôm nay → hôm nay.
- S01–S13 xanh; 4 ô = cột cuối có dữ liệu (test + test tạm).

**5. Góc nhìn và nhân sự**

- RE / TL luôn có team sống (`TEAM_REQUIRED`); team có thành viên sống không xóa được (`TEAM_HAS_MEMBERS`); RE còn bản ghi sống không đổi vai được (`PERSON_IN_USE`). Mọi `restore*` gọi `requireRe`. Vì vậy Σ RE = team và Σ team = Toàn bộ luôn đúng (unit trên seed + test tạm).
- Team không có RE: Theo RE rỗng, Tổng vẫn khớp Tổng hợp; chart toàn 0.
- RE chuyển team: tính theo team hiện tại (G2 E).
- TL / IS / BD / BDM không có dòng (`reOptions`, `teamRes` lọc `role === 'RE'`); `summaryMeta` chỉ đếm RE.
- Góc nhìn trỏ người / team đã xóa: `resolveScope` lùi về phần tử đầu, tên rỗng không ném lỗi.
- Ô chọn team: Báo cáo hiện, Tổng quan ẩn (`teamPickerShown`, e2e).

**6. Chuỗi từ DB**

- ECharts: formatter tooltip `encodeHtml` mọi chuỗi; nhãn trục chỉ là ngày; test "team name as text (F-18)".
- React escape mọi tên khác.
- Excel:
  - `=HYPERLINK(...)`, `+cmd`, `@s` ghi kiểu chuỗi (`cell.type` 3, `formula` undefined);
  - tên sheet là chuỗi i18n cố định ≤ 31 ký tự.
- Tên file:
  - `slug` chỉ ra `[a-z0-9-]`, khớp `is_export_name` của Rust;
  - emoji / chữ không Latin bị bỏ;
  - khoảng trắng thừa gộp thành một `-`;
  - độ dài: xem CL4-004.
- Header `x-export-name` luôn ASCII.
- e2e Phase 4 (`overview.spec.ts`, `reports.spec.ts`) không dựng `RegExp` từ tên. Chỗ cũ ở `appointments.spec.ts:637` đã có trong sổ.

**7. Xuất Excel**

- Số sheet: 4 / 3 / 2 (unit + e2e).
- "—" thành ô trống (unit + test tạm).
- `#,##0` cho tiền, `0.0%` cho tỉ lệ (dạng phân số).
- Dòng Tổng sheet Theo team khớp Tổng hợp (test tạm).
- Rust:
  - hậu tố `-n` trước `.xlsx`;
  - claim `create_new` nên hai lần xuất cùng lúc không trùng tên;
  - `.claim` / `.tmp` / file 0 byte `.xlsx` dọn khi mở app (test Rust);
  - tên sai đuôi / có khoảng trắng ra `InvalidInput`.
- Nút Xuất tắt khi `busy`.
- Web: `Blob` + `<a download>`, `revokeObjectURL` sau 60 s.
- ExcelJS 4.4.0 ghim đúng bản, ghi ở ADR-0005:39 (G4 04/10), chỉ nạp khi bấm xuất.
- `pnpm audit`: `uuid` của ExcelJS có advisory moderate, chỉ ảnh hưởng v3/v5/v6 khi truyền `buf`. App chỉ ghi file, không đọc `.xlsx` lạ nên không khai thác được. Nên ghi chú khi cập nhật ExcelJS.

**8. UI / i18n**

- Nhãn khớp mockup:
  - "Lịch hẹn · cả tháng", "đã gặp / tổng lịch", "so với dd/mm – dd/mm";
  - "0 RF trong kỳ · không so", "— kỳ trước 0 RF, không so";
  - "Team (3 team)", "cộng 3 team", "ảnh chụp cuối ngày … (hôm nay)";
  - "Lịch hẹn · cả kỳ / Kết quả · tới hôm nay / KH cuối kỳ".
- Lệch nhỏ đã cân nhắc, không lập phát hiện:
  - mockup bảng ghi "60,0%" / "100,0%" (`toFixed(1)` trong script mockup), còn code ghi "60%" / "100%". Code theo `formatPercent` và golden `chi-so.md` ("5/5 = 100%"), là nguồn G2;
  - dòng phụ "Theo RE" của mockup có thêm "· Tháng 10/2026 (MTD) · Toàn bộ";
  - Năm có thêm "·" giữa kỳ và khoảng ngày (1c).
- Lọc: Excel, "Đang xem", `summaryMeta`, mọi bảng đều đọc `applied`, nên kỳ / góc nhìn chưa Lọc không làm đổi số (unit + e2e cả hai màn).
- `tabular-nums` ở mọi ô số.
- Tương phản: tính trên token, mọi màu chữ mới ≥ 4,5:1 trên `bg-0…bg-3`:
  - `--appt-missed` = `text-3`: 4,89–6,60;
  - `--appt-unrecorded` = `warn`: 6,62–8,94;
  - `date-today`: ≥ 9,89.
- Bàn phím:
  - hàng team là `<button aria-expanded>`;
  - ô N4–N1 là `button aria-pressed`;
  - bảng có `th scope`.

**9. Hiệu năng**

- Kỳ Năm Toàn bộ trên seed: `reportRows` 52 ms, `teamCompare` 13 ms, `kpiTiles` 2 ms, `stageBlock` Team 6 ms.
- `stageSnapshotter` sắp mỗi KH một lần.
- Memo ổn định:
  - `today` memo theo trường;
  - `useQuery` theo `revision`;
  - option chart memo theo `[chart, shown]`;
  - e2e "10 lần chuyển màn giữ 1 instance".
- Ca chậm duy nhất: CL4-002.

**10. Kiến trúc**

- `depcruise` 0 vi phạm.
- Tiền / ngày / chỉ số qua domain (`formatVndCompact`, `formatPercent`, `formatCount`, `formatPeriodValue`…). Không `toLocaleString` / `new Date()` mới ở màn Phase 4.
- Logic ở `*-view.ts` có test (coverage: xem CL4-010).
- Test chấp nhận của từng Issue đều có test tương ứng:

  | Issue | Test |
  |---|---|
  | #272 | G18, Lọc, e2e MTD / Năm / Team |
  | #273 | S10–S13, F-18 `<b>`, e2e 3 chart + ẩn N4, `chart.spec` 1 chunk ≤ 250 KB + 10 lần chuyển màn |
  | #274 | G09–G11, Σ RE = team, e2e 10 RE |
  | #275 | Σ trên seed, e2e theo góc nhìn, Lọc |
  | #276 | M01–M04, Σ mốc = Tổng hợp, e2e RE · Năm 12 dòng |
  | #277 | sheet / định dạng / `=` / e2e tải file / build exe |
  | #310 | e2e "Hôm nay" + biên 1900 |
  | #271 | unit + e2e 4 nhóm |

**11. Batch 2 (T-095…T-104)**

- Nhập backup lần 3 (luật 1, 5, 8, 9) và luật 10 ngày tương lai: đọc `backup-validation.ts`.
- `TRANSITION_BEFORE_LATEST`, `DATE_IN_FUTURE`, `OUTCOME_IN_FUTURE` ở lệnh.
- CI ghim SHA 40 ký tự cho mọi `uses:`; coverage theo vùng.
- Không thấy lỗi mới.
- Ghi nhận (không lập phát hiện): luật 10 dùng đồng hồ máy nhập. Hai máy lệch đồng hồ qua nửa đêm có thể từ chối một backup vừa xuất. Hai máy hiện cùng múi giờ; xem lại khi làm đồng bộ Phase 6.

## 4. Đối chiếu sổ review-notes

| Dòng OPEN | Trạng thái ở `595ef79` | Đề xuất |
|---|---|---|
| **T-f (F-14)** `MAX_YEAR`, `shift` sát 1900 ném `RangeError`, `addDays` ra `NaN` | `MAX_YEAR = 2100`; `addDays` kiểm `Number.isInteger` + miền rồi ném `RangeError` (không còn `NaN`); `canShift` tắt ‹ › (PR #300 T-100) | **RESOLVED** (#300) |
| **T-i (F-18)** escape formatter ECharts | `stage-chart.ts` escape mọi chuỗi qua `encodeHtml`, có test (PR #312 T-110) | **RESOLVED** (#312) |
| `Overview.tsx:9` (R4): "hôm nay" theo đồng hồ máy | `Overview.tsx:38` dùng `useAppData().today()` (PR #309 T-109) | **RESOLVED** (#309) |
| R4: ô ngày Tùy chọn báo đỏ sớm khi Tab | Vẫn còn: `PeriodPicker.tsx` áp dụng khi `onBlur` của từng ô | Giữ **OPEN** |
| Tooling (R4): hook `review-pr-hint.mjs` nhận "issue #N" gần chữ "review" thành PR | **Còn đúng, gặp lại ngay ở phiên này.** Lời nhắc "…`REVIEW-CHECKLIST.md`, Issue #253–#277…" bị hook hiểu thành "Owner asked to review PR #253" | Giữ **OPEN**. Nên sửa trước review đóng phase sau, vì lời nhắc đóng phase luôn chứa cả "review" lẫn "#N" |
| Tooling: `session-end.ps1:39` `git add -A` | Còn nguyên | Giữ OPEN |
| `DataTable`, `AppointmentsScreen.tsx` `caused={undefined}` (`:347`), `outcomeChoices`, lưới năm, `token-guard`, `e2e/appointments.spec.ts` `RegExp` | Phase 4 không chạm, còn nguyên | Giữ OPEN |
| `app-data.ts` `opening`, `ErrorBoundary` `resetKey`, `storage.rs` `explorer_arg` / `Some(32)`, `database.test.ts` số phiên bản 5 | Còn nguyên. `storage.rs` đổi ở T-114 nhưng không chạm mấy chỗ này | Giữ OPEN, gộp lần chạm sau |
| S-1 / D-1 hash KYC; S-2 tuần tự hóa replace / save / export | Ngoài Phase 4. Lưu ý: xuất Excel thêm một lối ghi `exports\` nữa, nhưng không chạm DB nên không đổi S-2 | Giữ OPEN (Phase 5 / 6) |
| **HANDOFF: 3 ghi chú của review #316** (slug dài, "đầy ổ đĩa" cho mọi lỗi, thông báo còn sau Lọc) | Đã xác nhận cả ba (CL4-004, CL4-005) | Chép vào OPEN như HANDOFF dự kiến. Đề xuất gom thành một task nhỏ với CL4-006 / CL4-007 |

## 5. Giới hạn / việc không làm được

- **Không chạy exe thật.** Owner đã kiểm tay exe `595ef79` (HANDOFF 04/10). Lỗi đường dẫn dài của Rust em chỉ suy từ code + thử Node trên NTFS. Chưa thử đầy ổ hoặc thư mục không quyền.
- **Hiệu năng đo trong Node** (Vitest), không phải WebView2. Chưa đo thời gian vẽ ECharts với 2 412 cột.
- **P-1 về người merge:** cả 20 PR có `mergedBy = AlexH-AI`, vì Claude dùng chung tài khoản `gh` của Owner. GitHub không cho biết PR `risk:med/high` do Owner bấm hay do `merge-pr.mjs --owner`. Em chỉ kiểm được điều kiện SHA. Muốn kiểm được người merge, cần `merge-pr.mjs` ghi một comment "merged by Owner request" hoặc tương tự.
- Không so pixel với mockup. Không chạy trình đọc màn hình thật; a11y chỉ suy từ DOM / ARIA trong code.
- `pnpm audit` cần mạng (registry npm): chỉ đọc, không đổi lockfile.
- Không kiểm lại toàn bộ Phase 1–3 (đã có hai review). Chỉ đọc phần mà Phase 4 gọi vào.

## 6. Phụ lục — test tái hiện (đã xóa khỏi worktree)

File tạm `apps/desktop/src/routes/zz-p4review.repro.test.ts`, chạy bằng `pnpm exec vitest run apps/desktop/src/routes/zz-p4review.repro.test.ts --reporter=verbose`, kết quả **8/8 pass** (18:59:27 → 18:59:37). Test được viết để **ghi nhận hành vi hiện tại**: các `expect` của CL4-001 khẳng định hành vi sai đang có (note "so với 01/03 – 31/03", "▼ 1").

Output chính:

```
April 30 MTD label true 01/04 – 30/04/2027 | current 01/04/2027 – 30/04/2027 | previous 01/03/2027 – 31/03/2027
Feb 28 MTD label true 01/02 – 28/02/2027 | current 01/02/2027 – 28/02/2027 | previous 01/01/2027 – 31/01/2027
Nov 30 MTD label true 01/11 – 30/11/2026 | current 01/11/2026 – 30/11/2026 | previous 01/10/2026 – 31/10/2026
29/04 { tone: 'same', text: '=' } so với 01/03 – 29/03
30/04 { tone: 'down', text: '▼ 1' } so với 01/03 – 31/03
seed sizes { appointments: 6229, customers: 1200, people: 36, teams: 3, policies: 988, transitions: 3309 }
reportRows all year: 52.4 ms
reportRows team year: 15.4 ms
stageBlock team year: 6.0 ms
teamCompare year: 12.7 ms
kpiTiles year: 2.1 ms
reportRows all 1900–2100: 2658.0 ms
byMark rows 2412
stageBlock all 1900–2100: 342.1 ms
chart columns 2412
stageBlock team 1900–2100: 449.9 ms
consistency cases checked 55
36 bao-cao_2026-10_team_2026-10-15.xlsx
34 bao-cao_2026-10_re_2026-10-15.xlsx
43 bao-cao_2026-10_team-sum-a1_2026-10-15.xlsx
454 bao-cao_2026-10_re-nguyen-nguyen-nguyen-…
43 bao-cao_2026-10_team-dong-a_2026-10-15.xlsx
cell type 3 "=HYPERLINK(\"http://x\",\"y\")" formula? undefined
sheets [ 'Tổng hợp', 'Theo RE', 'Theo mốc' ] byMark rows 3
```

Thử thêm bằng Node trong scratchpad (ngoài repo): ghi `bao-cao_…xlsx.tmp` dài 244 / 250 ký tự được; 448 ký tự ra `ENOENT`.

```ts
// Temporary repro for the Phase 4 close review. Deleted before the session ends.
import ExcelJS from 'exceljs';
import {
  listAppointments,
  listCustomers,
  listPeople,
  listPolicies,
  listStageTransitions,
  listTeams,
  openDatabase,
  seedDemoData,
} from '@p2c/db';
import {
  appointmentCounts,
  calendarDate,
  comparisonWindows,
  customPeriod,
  formatDate,
  periodOf,
  type CalendarDate,
  type Period,
  type Policy,
  type Scope,
} from '@p2c/domain';
import { beforeAll, describe, expect, it } from 'vitest';
import { kpiTiles, metricsScope, viewingText } from './overview/overview-view';
import { stageBlock } from './overview/stage-view';
import { teamCompare } from './overview/team-compare-view';
import { buildReportWorkbook, reportFileName, reportWorkbookMeta } from './reports/report-workbook';
import { reportCells, reportRows, type ReportData } from './reports/reports-view';

const d = (day: number, month: number, year: number) => calendarDate(year, month, day);
const span = (p: Period) => `${formatDate(p.start)} – ${formatDate(p.end)}`;

describe('CL4-001 last day of a month', () => {
  for (const [today, label] of [
    [d(30, 4, 2027), 'April 30'],
    [d(28, 2, 2027), 'Feb 28'],
    [d(30, 11, 2026), 'Nov 30'],
  ] as const) {
    it(`${label}: month viewed on its last day`, () => {
      const month = periodOf('month', today);
      const w = comparisonWindows(month, today)!;
      const view = viewingText({ period: month, scope: { kind: 'all' } }, today, [], []);
      console.log(label, 'MTD label', view.mtd, view.range, '| current', span(w.current), '| previous', span(w.previous));
    });
  }

  it('a policy issued on 31/03 counts in the previous window on 30/04 but not on 29/04', () => {
    const policy: Policy = {
      id: 'p',
      customerId: 'c',
      reId: 're',
      submittedDate: d(31, 3, 2027),
      submittedFyp: 100_000_000,
      issuedDate: d(31, 3, 2027),
      issuedFyp: 100_000_000,
    };
    const data = {
      people: [{ id: 're', name: 'An', role: 'RE' as const, teamId: 't' }],
      policies: [policy],
      appointments: [],
      transitions: [],
    };
    const april = periodOf('month', d(1, 4, 2027));
    const on29 = kpiTiles(data, april, { kind: 'all' }, d(29, 4, 2027));
    const on30 = kpiTiles(data, april, { kind: 'all' }, d(30, 4, 2027));
    const issued = (tiles: typeof on29) => tiles.find((t) => t.key === 'issued')!;
    console.log('29/04', issued(on29).delta, issued(on29).note);
    console.log('30/04', issued(on30).delta, issued(on30).note);
    expect(issued(on30).note).toBe('so với 01/03 – 31/03');
    expect(issued(on30).delta?.text).toBe('▼ 1');
  });
});

describe('seed', () => {
  let data: ReportData;
  const today = d(15, 10, 2026);

  beforeAll(async () => {
    const db = await openDatabase({ persist: () => {} });
    seedDemoData(db, { anchorDate: today, seed: 1 });
    data = {
      appointments: listAppointments(db),
      customers: listCustomers(db),
      people: listPeople(db),
      teams: listTeams(db),
      policies: listPolicies(db),
      transitions: listStageTransitions(db),
    };
    console.log(
      'seed sizes',
      Object.fromEntries(Object.entries(data).map(([k, v]) => [k, (v as unknown[]).length])),
    );
  }, 600_000);

  const time = <T,>(label: string, fn: () => T): T => {
    const start = performance.now();
    const out = fn();
    console.log(`${label}: ${(performance.now() - start).toFixed(1)} ms`);
    return out;
  };

  it('perf', () => {
    const all: Scope = { kind: 'all' };
    const team: Scope = { kind: 'team', teamId: data.teams[0]!.id };
    const year = periodOf('year', today);
    time('reportRows all year', () => reportRows(data, year, all, today));
    time('reportRows team year', () => reportRows(data, year, team, today));
    time('stageBlock team year', () => stageBlock(data, year, team, today));
    time('teamCompare year', () => teamCompare(data, year, today));
    time('kpiTiles year', () => kpiTiles(data, year, all, today));
    const long = customPeriod(d(1, 1, 1900), d(31, 12, 2100));
    const rows = time('reportRows all 1900–2100', () => reportRows(data, long, all, today));
    console.log('byMark rows', rows.byMark.length);
    const block = time('stageBlock all 1900–2100', () => stageBlock(data, long, all, today));
    console.log('chart columns', block.charts[0]!.columns.length);
    time('stageBlock team 1900–2100', () => stageBlock(data, long, team, today));
  }, 600_000);

  const periods: Period[] = [
    periodOf('day', today),
    periodOf('day', d(14, 10, 2026)),
    periodOf('week', today),
    periodOf('month', today),
    periodOf('month', d(1, 9, 2026)),
    periodOf('month', d(1, 11, 2026)),
    periodOf('year', today),
    periodOf('year', d(1, 1, 2025)),
    customPeriod(d(20, 9, 2026), d(10, 10, 2026)),
    customPeriod(d(1, 3, 2026), d(31, 12, 2026)),
    customPeriod(today, today),
  ];

  it('Overview, Báo cáo and Excel agree for the same period and scope', async () => {
    const scopes: Scope[] = [
      { kind: 'all' },
      ...data.teams.map((t): Scope => ({ kind: 'team', teamId: t.id })),
      { kind: 're', reId: data.people.find((p) => p.role === 'RE')!.id },
    ];
    let checked = 0;
    for (const period of periods) {
      for (const scope of scopes) {
        const rows = reportRows(data, period, scope, today);
        // Overview tile counts for Toàn bộ / RE (Team on Overview adds every team).
        if (scope.kind !== 'team') {
          const counts = appointmentCounts(data.appointments, period, metricsScope(scope), data.people, today);
          expect(rows.summary.appointments).toEqual(counts);
          const tiles = kpiTiles(data, period, scope, today);
          const cells = reportCells(rows.summary);
          const tileText = (key: string) => {
            const tile = tiles.find((t) => t.key === key)!;
            return tile.unit && tile.unitSpaced ? `${tile.value} ${tile.unit}` : `${tile.value}${tile.unit}`;
          };
          expect([tileText('rf'), tileText('submitted'), tileText('caseSize'), tileText('issued'), tileText('revenue'), tileText('closeRate')]).toEqual(cells.slice(5, 11));
          const block = stageBlock(data, period, scope, today);
          const four = rows.summary.stages && { N4: rows.summary.stages.N4, N3: rows.summary.stages.N3, N2: rows.summary.stages.N2, N1: rows.summary.stages.N1 };
          expect(block.tiles).toEqual(four);
        }
        // Theo mốc adds up to Tổng hợp; the last mark with stages equals it.
        const marks = rows.byMark;
        for (const key of ['met', 'missed', 'unrecorded', 'planned', 'total'] as const) {
          expect(marks.reduce((s, m) => s + m.appointments[key], 0)).toBe(rows.summary.appointments[key]);
        }
        if (rows.summary.metrics) {
          for (const key of ['rfCount', 'submittedCount', 'caseSize', 'issuedCount', 'revenue'] as const) {
            expect(marks.reduce((s, m) => s + (m.metrics?.[key] ?? 0), 0)).toBe(rows.summary.metrics[key]);
          }
          expect(marks.findLast((m) => m.stages)!.stages).toEqual(rows.summary.stages);
        }
        // Tổng of Theo team / Theo RE equals Tổng hợp.
        for (const table of [rows.byTeam, rows.byRe]) {
          if (!table) continue;
          expect(reportCells(table.total)).toEqual(reportCells(rows.summary));
        }
        if (scope.kind === 'all') {
          const compare = teamCompare(data, period, today);
          expect(compare.total.cells).toEqual([reportCells(rows.summary)[0], ...reportCells(rows.summary).slice(5, 11)]);
          // Excel: the summary sheet carries the same numbers.
          const view = viewingText({ period, scope }, today, data.people, data.teams);
          const bytes = await buildReportWorkbook(rows, reportWorkbookMeta(view, today));
          const book = new ExcelJS.Workbook();
          await book.xlsx.load(bytes.buffer);
          const sheet = book.worksheets[0]!;
          const values = (sheet.getRow(4).values as unknown[]).slice(2);
          const s = rows.summary;
          expect(values.slice(0, 5)).toEqual([s.appointments.met, s.appointments.missed, s.appointments.unrecorded, s.appointments.planned, s.appointments.total]);
          if (!s.metrics) expect(values.slice(5, 11).every((v) => v === undefined || v === null)).toBe(true);
          const teamSheet = book.worksheets[1]!;
          // Tổng row of Theo team: after header rows 1–3 and one row per team.
          const totalRow = (teamSheet.getRow(4 + data.teams.length).values as unknown[]).slice(2);
          expect(totalRow.slice(0, 5)).toEqual(values.slice(0, 5));
        }
        checked++;
      }
    }
    console.log('consistency cases checked', checked);
  }, 600_000);
});

describe('file names and Excel strings', () => {
  it('slugs', () => {
    const month = periodOf('month', d(1, 10, 2026));
    const today = d(15, 10, 2026);
    for (const scope of ['Team 東京', 'RE 😀', 'Team =SUM(A1)', 'RE ' + 'Nguyễn '.repeat(60), 'Team   Đông   Á  ']) {
      const name = reportFileName(month, scope, today);
      console.log(name.length, name.slice(0, 120));
    }
  });

  it('a name starting with = stays text in the workbook', async () => {
    const figures = {
      appointments: { met: 0, missed: 0, unrecorded: 0, planned: 0, total: 0 },
      metrics: null,
      stages: null,
    };
    const row = { key: 'x', name: '=HYPERLINK("http://x","y")', team: '+cmd', ...figures };
    const bytes = await buildReportWorkbook(
      { summary: row, byTeam: null, byRe: { rows: [row], total: row }, byMark: [] },
      { period: 'p', scope: '@s', exported: '15/10/2026' },
    );
    const book = new ExcelJS.Workbook();
    await book.xlsx.load(bytes.buffer);
    const cell = book.worksheets[1]!.getCell(4, 2);
    console.log('cell type', cell.type, JSON.stringify(cell.value), 'formula?', cell.formula);
    expect(cell.formula).toBeUndefined();
    console.log('sheets', book.worksheets.map((w) => w.name), 'byMark rows', book.worksheets[2]!.rowCount);
  });
});
```

## 7. Cuối phiên

- File test tạm đã xóa. `git status --short` ở `C:\workspace\Project-2C-review`: **sạch** (không file tracked bị sửa, không file lạ).
- `git rev-parse HEAD` = `595ef7906d1f40a14498831418d47d535998147d` (detached, đúng snapshot).
- Không commit, không push, không ghi gì lên GitHub. Mọi lệnh `gh` chỉ đọc.
- `apps/desktop/dist/` do e2e build nằm trong `.gitignore`, không hiện trong `git status`.
- Báo cáo này nằm ngoài repo: `C:\workspace\phase-4-review\claude-review.md`.
