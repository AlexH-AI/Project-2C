XONG — claude gói E lượt 2, 2026-10-17 16:01 (+07, giờ máy)

# Deep review Phase 1–6, lượt 2 — Claude, gói E (Lịch hẹn, chỉ số, quản lý)

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên | Claude (`CL2`) |
| Gói | E — Lịch hẹn, chỉ số, quản lý |
| Repo | worktree `C:\workspace\Project-2C-review`, detached |
| SHA đầu phiên | `4217ed4cd3300af1d63aa61db9eb13902fe75f16` (khớp SHA ghim) |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 2026-10-17 14:36 (+07, giờ máy) |
| Máy | Home PC `DESKTOP-KDURKJP` |
| Công cụ / model / mức suy luận | Claude Code (app desktop, tab Code), model Opus 5.5 (`claude-opus-5-5`), mức suy luận max; không subagent, không skill `review-pr` / `code-review` |
| Bước 0 | `E.md` chưa có → làm mới; `A.md`–`D.md` có đủ, dòng đầu đều `XONG` |
| Song song | Codex chạy các gói của Codex ở `Project-2C-review-2` cùng lúc (theo §L2.9) |
| **Phiên làm tiếp** | Phiên đầu bị cắt khoảng 15:32 (file cuối của nó: `E\p04-web-newyear-R38e.log` 15:32:26). Phiên này mở 15:35 (2026-10-17, +07), Bước 0: `E.md` có, dòng đầu `ĐANG LÀM` → làm tiếp; SHA `4217ed4cd3300af1d63aa61db9eb13902fe75f16`, `git status --short` rỗng; `A.md`–`D.md` dòng đầu `XONG`. Cùng công cụ / model: Claude Code (app desktop, tab Code), Opus 5.5 (`claude-opus-5-5`); mức suy luận do Owner đặt cho phiên (phiên này không tự đọc được giá trị; phiên đầu ghi max). Đọc hết `E.md` và `E\` (tên file, log). Giữ nguyên mọi phát hiện CL2-E1…E6 và bảng R của phiên đầu; làm nốt: bằng chứng màn của R38c–e (CL2-E5) và N2 (CL2-E4) từ log phiên đầu, giờ chạy đột biến, đo hiệu năng (mục 6.2, DR6-44 trên màn), phụ lục §9, sửa định dạng. Sáu server `serve-dist.mjs` của phiên đầu còn chạy (127.0.0.1:4525, 4526, 4528–4531); lệnh dừng bốn server đột biến bị bộ lọc quyền từ chối → để nguyên, ghi ở §9 |


## 2. Bảng R

**Cách kiểm.** (1) Tái hiện lượt 1 chạy lại: probe lượt 1 của Claude Home PC chép vào `E\r1\` (`p6-backfill.mjs`, `p1-perf.mjs`…) và ca của báo cáo gốc laptop / Codex / Muse dựng lại trên lớp dữ liệu của app hoặc trên bản web ghim (mục 4). (2) Gỡ phần sửa: `E\mut.mjs` + `E\mut-list.mjs` vá **một** file của worktree, chạy test gói E (`--bail=1`, sống thì cả bộ 2 898 test), trả nguyên byte, so sha256 với `git show HEAD:` trước / sau, dòng cuối `git status --short after: ""`; TSX (vitest chưa có DOM — G4) thì `E\e2e-mutants.mjs` → `E\build-dist.mjs` vá → `vite build` ra `E\dist-<id>` (ngoài repo) → trả nguyên byte, sha256 = HEAD → phục vụ ở 127.0.0.1:4524 → chạy 12 spec e2e của gói E (`appointment-outcome`, `appointments`, `customer-appointments`, `customer-forms`, `customer-policies`, `trash`, `backup`, `demo-data`, `overview`, `reports`, `period-picker`, `full-cycle` — 109 ca; bản ghim **109 / 109 xanh**, `E\e2e-base.log`). (3) Biến thể gần: mục 4.

| DR6 | Issue → PR | Kết luận | Bằng chứng (tái hiện lượt 1 nay ra gì; test nào đỏ khi gỡ phần sửa) | Biến thể / ghi chú (ID phát hiện) |
|---|---|---|---|---|
| 01 (phần E: Thùng rác, hộp khôi phục 11c) | #592 → #614 | **ĐÃ SỬA** | Ca L·CL-E7 (laptop `p9-kept-delete`: cuộc gặp giữ N3 → chuyển tay → xóa → Thùng rác tắt nút, lý do D10) trên màn ghim (K5, W3; e2e `trash.spec.ts:240` E18 xanh): dòng không bị chặn, hộp `Kết quả Đã gặp · nhóm sau N3 · Không đổi nhóm KH`, khôi phục xong lịch về Đã gặp, KH giữ nhóm mới. Dữ liệu tải (K10): 60 / 60 cuộc gặp giữ nhóm có KH đổi nhóm ngày sau → không chặn, khôi phục 60 / 60 (lượt 1 `p10-kept-count`: 46 / 50 bị chặn); K11: 130 / 130 bản ghi về, 0 / 1 170 ô Báo cáo lệch. Gỡ sửa: R01a (hộp chỉ còn "Trạng thái") → KILLED `trash-view.test.ts > restoreView … > E18: a met appointment that kept the stage when deleted leaves the stage`; R01db (lệnh so với nhóm hiện tại — R01 của gói A — trên bản dựng) → KILLED e2e `trash.spec.ts:240` | CL2-E2 (câu lý do E20). Phần lệnh: gói A ĐÃ SỬA |
| 02 (phần E: 6h, 6c "Hẹn lần tiếp theo" trên màn) | #594 → #618 | **ĐÃ SỬA** | Ca L·CL-D7 (laptop; tổng hợp lượt 1 §4.2: sau đổi RE, cuộc gặp và lịch hẹn tiếp đều ở RE cũ) trên màn (K4, W2): 5c chuyển 1 lịch Dự kiến; 6c trong góc nhìn RE cũ tạo lịch 20/09 cho RE mới và màn nói "nằm ngoài góc nhìn"; số theo RE sau chuỗi (K2): RF / Đã gặp của lịch ghi muộn vẫn tính cho RE trên lịch (A), lịch tiếp theo ở B, 0 lệch giữa Tổng quan / Báo cáo / Lịch hẹn / Excel. e2e `customer-forms.spec.ts:218 … (5c, 6h)` xanh (6h điền RE hiện tại). Gỡ sửa: R02a (6h điền RE của lịch cũ) → KILLED e2e `customer-forms.spec.ts:218` | Lệnh: gói A; hộp 5c: gói D |
| 04 (phần E: 6c, 6f) | #593 → #616 | **ĐÃ SỬA** | H·CL-E4 (`p6-backfill.mjs` Home PC chạy lại, K10): hộp nay đi từ N3 (nhóm ngày 05/09) và giữ ở N3 — lượt 1 đưa `N2 (giữ nguyên)`; N2 / N1 lệnh từ chối, N3 lưu `Giữ N3`. L·CL-E1 (6f giữ nhóm sau chuyển tay): hộp giữ N3 với dòng khóa `N3→N2 10/10/2026`, lưu nguyên không đổi gì (lượt 1: dòng đọc lại báo `N2 → N3` giả). Dữ liệu tải (K1): 7 503 cuộc gặp, lưu nguyên 0 lệch, 6 852 lựa chọn 0 bị từ chối sau Lưu, 0 dòng đọc lại sai. Màn (K5, K6): E19 6f, 6c giữ bởi cuộc gặp sau. Gỡ sửa: R04a–R04d (`meetingDay` / `heldStage`) → KILLED `outcome-form.test.ts > meetingDay > …`; R04e (6c đi từ nhóm hiện tại, không giữ) → KILLED e2e `appointment-outcome.spec.ts:238`; R04f (6f như cũ) → KILLED e2e `appointment-outcome.spec.ts:180`; **R04g (6f không đi từ nhóm đã giữ — E19) SỐNG** cả 109 e2e; **N1** (`kept !== ended`), **N2** (giữ bởi cuộc gặp Đã gặp sau) **SỐNG** cả bộ vitest (e2e: mục 9.2) | **CL2-E1** (dời ngày cuộc gặp có chuyển nhóm về trước một lần đổi nhóm: rút chuyển nhóm + RF mà hộp không nói); **CL2-E4** (test hở R04g / N1 / N2). Phần lệnh: gói A ĐÃ SỬA (CL2-A1: trước ngày tạo KH) |
| 38 | #600 → #634 | **ĐÃ SỬA** | Ca H·CL-E2 / H·CX-E3 / L·CX-E2 (đồng hồ dời qua giao thừa) trên màn (K3, `p04-web-newyear.mjs`): 6f giữ 30/12/2026 (lượt 1 → 30/12/2027); 6h báo đã qua, không tạo lịch 2027 (lượt 1 tạo 31/12/2027); 8b phát hành 31/12/2026, không "1 ô cần sửa" ẩn; 8d, 8a giữ ngày. Gỡ sửa: R38a (`readScheduleDate` bỏ `filled`) → KILLED `appointment-form.test.ts > readScheduleDate (a prefilled day across New Year) > …`; R38b (`readPolicy` bỏ `opened`) → KILLED `policy-form.test.ts > openDraft and readPolicy across New Year > …`; **R38c / R38d / R38e** (6f / 6h / 8a–8d không chuyển `Prefill` / `opened` cho hàm đọc) **SỐNG** vitest + 109 e2e | **CL2-E5** (phần nối ở 3 hộp không test nào giữ). Biến thể chữ **gõ tay** qua nửa đêm (K3): đọc theo hôm nay, có nói trước — theo thiết kế PR |
| 39 | #600 → #634 | **ĐÃ SỬA** | Ca L·CL-E2 / L·CX-E3 (laptop `p5-labels`: 319 / 1 190 KH hiện case size của cuộc gặp cũ) trên dữ liệu tải lượt 2 (K10): 415 KH có cuộc gặp Đã gặp gần nhất để trống → `expectedCaseSize` null (8a không hiện dòng); 324 trong đó có cuộc gặp cũ hơn có số (lượt 1 sẽ hiện). Gỡ sửa: R39a (lấy cuộc gặp gần nhất **có** số) → KILLED `policy-form.test.ts > expectedCaseSize > takes the case size of the latest met meeting, none when that one has none`; N10 (trùng ngày giờ lấy cái đầu) → KILLED | — |
| 40 | #600 → #634 | **ĐÃ SỬA** | Ca L·CX-E1 / H·CX-E2 (sửa cả FYP nộp lẫn phát hành trong 8d): e2e bản ghim `customer-policies.spec.ts:127` xanh (`385.500.000 ₫ (385,5 tr) · khác FYP nộp −4,5 tr` khi FYP nộp gõ 390tr). Gỡ sửa: R40a (so FYP nộp đã lưu) → KILLED `policy-form.test.ts > policyChange > tells how far the issued FYP is from the submitted one, both as typed (DR6-40)`; R40b (8d bỏ "khác FYP nộp") → KILLED e2e `customer-policies.spec.ts:127` | 8b không hiện "khác FYP nộp" (mockup 8b không có ca này) |
| 41 | #600 → #634 | **ĐÃ SỬA** | Ca L·MU-E1 / H·MU-E3 (đổi tháng → `metric: null`, hộp im lặng): e2e bản ghim 8d có bốn dòng tháng cũ / tháng mới; màn qua giao thừa (K3) `FYP phát hành tháng 12/2026 của RE Lê Năm Mới tăng 5 tr`. Gỡ sửa: R41a (khác tháng → không dòng) → KILLED `policyChange > takes the FYP out of the old month and puts it in the new one (DR6-41)`; R41b (bỏ FYP nộp) → KILLED; R41c (8d chỉ hiện dòng đầu) → KILLED e2e `customer-policies.spec.ts:127`; N5–N7, N16 → KILLED | KNOWN #634: số HĐ nộp / phát hành của hai tháng không được nói (không bằng chứng mới) |
| 42 | #600 → #634 | **ĐÃ SỬA** | Ca H·MU-E4 (PLAUSIBLE: ghi kèm lịch tiếp theo không chuyển tới lịch mới) trên màn: e2e `appointment-outcome.spec.ts:130 … then shows the next one` xanh; K4: lịch tiếp theo ngoài góc nhìn → màn sang ngày đó và báo. Gỡ sửa: R42a (không gọi `onShow`) → KILLED e2e `appointment-outcome.spec.ts:130` | — |
| 43 | #601 → #630 | **ĐÃ SỬA** | Ca L·CL-E3 (sắp "Bản ghi" theo chữ), H·CL-E3 (nút cùng tên), H·CX-E1 (TR-5 không tính lại sang ngày): e2e `trash.spec.ts:94`, `:156`, `:314` xanh; dữ liệu tải 113 / 113 tên nút khác nhau (K9). Gỡ sửa: R43a (`restoreLabel` = "Khôi phục…") → KILLED `trash-view.test.ts > restoreLabel (DR6-43) > …`; R43b (cột Bản ghi sắp lại) → KILLED e2e `trash.spec.ts:94`; R43c (bỏ `aria-label`) → KILLED e2e `trash.spec.ts:156`, `:240`, `:314`, `full-cycle.spec.ts:178`; R43d (bỏ `aria-describedby`) → KILLED e2e `trash.spec.ts:156`, `:314` (`toHaveAccessibleDescription`); **R43e (bỏ `headerHidden`) SỐNG** 109 e2e; R43f (`listTrash` không đọc lại khi sang ngày) → KILLED e2e `trash.spec.ts:314` (TR-5) | CL2-E3 (hai HĐ cùng ngày cùng tên nút); CL2-E6 (test hở R43e) |
| 44 (phần E: màn Thùng rác) | #601 → #630 | **ĐÃ SỬA** | Màn (bản web ghim, mục 6.2 bảng D, K14): Thùng rác 263 dòng (165 KH xóa — số đo của PR #630 / gói A) mở **136,7 ms** có chỉ mục so **475,9 ms** khi bỏ 3 chỉ mục 0009 (×3,5); 113 dòng 83,1 / 155,2 ms. Nội dung màn không đổi: cùng `["263 bản ghi",263,14]` và sha256 bảng + nhãn nút (`p17`). Node `listTrash` 113 dòng 21,3 ms so lượt 1 Home PC 43,0 ms (117 dòng). Gỡ sửa: P44 (bản dựng không có 0009) → chậm như trên; đây là phép đo, test giữ chỉ mục là test migration của gói A | **CL2-E7** (vẫn tăng tuyến tính theo số dòng Thùng rác, > 200 ms từ ≈ 500 dòng, TR-6 không dọn). Phần chỉ mục / migration: gói A ĐÃ SỬA; đo exe: gói F |
| 45 | #601 → #630 | **ĐÃ SỬA** | Ca H·CL-E7 (Nạp lại rồi Nhập → hai câu cùng hiện) trên màn (K8): chỉ còn câu của lần cuối ở mọi bước; e2e `backup.spec.ts:60` xanh. Gỡ sửa: R45a (hai section cùng giữ câu) → KILLED e2e `backup.spec.ts:60` | KNOWN #630 (state `last` / `showsNotice` mỗi section): không bằng chứng mới |
| 46 | #597 → #623 | **ĐÃ SỬA** | Ca H·CL-E1 ("Đang xem" kỳ Năm thiếu "·"): e2e `overview.spec.ts:75` (dòng kiểm `:85`), `reports.spec.ts:97` (`:108`) xanh (`Đang xem: Năm 2026 · 01/01 – 15/09/2026 · Toàn bộ`). Gỡ sửa: R46a (kỳ Năm đang chạy bỏ "·") → KILLED e2e `overview.spec.ts:75`, `reports.spec.ts:97` | Kỳ Tháng MTD giữ dạng không dấu (mockup 1c) |
| 47 | #607 → #619 | **ĐÃ SỬA** (ghi lệch đã biết) | `docs/testing/nghiem-thu-v1.md:84` (NT-TQ-06 "một chữ số thập phân … khi không tròn, tròn thì không có ',0'", ghi chú Excel `0.0%`) và `:395` (lệch mockup 1a "60,0%"). Khớp app: `packages/domain/src/number.ts` `formatPercent` bỏ ",0" (`decimal ? … : ''`), `report-workbook.ts:32` `PERCENT = '0.0%'`; L1-O1…O8, L1-W1 (ô tỉ lệ Excel) bị test giết | — |
| 48 | #607 → #619 | **ĐÃ SỬA** (ghi lệch đã biết) | `nghiem-thu-v1.md:392-398` đủ 7 điểm. Khớp app: `vi.ts:789` `outcome.sub` không có "· lần n"; `:649` `Dời lịch / hủy / không đến`; `:903` công thức đủ `{issued} HĐ phát hành ÷ {count} RF`; `:936`, `:938` meta Báo cáo; `:1039-1040` thẻ File dữ liệu 5 mục, không có ghi chú KYC; `AppointmentsScreen.tsx:392-398` chú giải chỉ 4 nhóm (không "Trong kỳ") | — |
| 63 | #606 → #644 | **ĐÃ SỬA** | Áp lại đột biến lượt 1: CX-E4 ×5 (R63a–R63e: `RESTORE` nối sai lệnh cho policy / team / person / customer / appointment) → KILLED cả 5 (`trash-view.test.ts > restoreRow > restores a … with the command of its kind, the other records left in the trash` / `runs the restore command of its kind…`); AV8 (L1-AV8: chấm "Dự kiến" lên đầu) → KILLED `appointments-view.test.ts > dayLabel / monthLabel > names the planned ones of a day last, like its dots` (lượt 1: cả 6 sống) | — |

> Đột biến vitest (`E\mut.log`, 14:47–15:02): 116 cái, 107 KILLED, 5 SURVIVED (N1, N2 có hệ quả; N9, L1-O2, L1-AV1 tương đương — cả 5 chạy thêm cả bộ: `2898 passed (2898)`, `E\mut-out\<id>.out`), 4 SKIP (dòng đã đổi). e2e bản ghim (12 spec gói E): 109 / 109 xanh. e2e trên 20 bản dựng đột biến (`E\e2e-mutants.log`, 15:05–15:28): 13 KILLED, 7 SURVIVED (R04g, R38c, R38d, R38e, R43e, N1, N2), `git status --short after: ""`. (Ghi chú phiên làm tiếp: hai dòng giờ ở đây phiên trước ghi nhầm "16:3x / 16:5x"; giờ đúng lấy từ log.)

## 3. Phạm vi đã đọc

**Danh sách file gói E** (`E\list.mjs` theo `classifyFile` của `tools/size-report-core.mjs`, log `E\list.log`): 51 file, **7 374 dòng SP / 3 843 dòng test** (trùng plan §L2.3).

**Diff sửa của gói E** (`git diff --numstat 8855345 4217ed4` trên 51 file, log `E\fix-numstat.log`, bản đầy đủ `E\fix-diff.patch` 1 821 dòng): SP **+493 / −151 ở 14 file**, test **+341 / −43 ở 5 file** (trùng plan §L2.3); 7 commit chạm gói: `23eed54` #614 (`trash-view.ts`), `b563604` #616 (`outcome-form.ts`, `OutcomeDialog`, `EditOutcomeDialog`, `MetFields`), `5d2443f` #618 (`AppointmentDialog`), `bf87d71` #623 (`FilterBar`), `43e6696` #630 (`SettingsTrash`, `Settings`, `SettingsBackup`, `trash-view.ts`), `ffc1db7` #634 (`appointment-form.ts`, `policy-form.ts`, `PolicyDialogs`, `OutcomeDialog`, `EditOutcomeDialog`, `AppointmentDialog`, `AppointmentsScreen`), `83e0515` #644 (test `trash-view`, `appointments-view`). Đọc từng hunk SP và test.

**Đọc hết ở SHA ghim (37 file SP):** `routes/appointments/` — `outcome-form.ts` (202), `OutcomeDialog.tsx` (340), `EditOutcomeDialog.tsx` (263), `MetFields.tsx` (169), `appointment-form.ts` (142), `AppointmentDialog.tsx` (450), `AppointmentsScreen.tsx` (652), `appointments-view.ts` (471), `DeleteAppointmentDialog.tsx` (100), `RescheduleDialog.tsx` (60), `RescheduleFields.tsx` (142), `YearGrid.tsx` (142); Hợp đồng — `policy-form.ts` (239), `PolicyDialogs.tsx` (340), `CustomerPolicies.tsx` (109); `routes/` — `trash-view.ts` (472), `SettingsTrash.tsx` (246), `RestoreDialog.tsx` (65), `Settings.tsx` (187), `SettingsBackup.tsx` (294), `SettingsDataFile.tsx` (135), `FilterBar.tsx` (84), `applied-filter.ts` (51), `Overview.tsx` (61), `period-labels.ts` (26); `routes/overview/` — `overview-view.ts` (252), `stage-view.ts` (142), `team-compare-view.ts` (129), `stage-chart.ts` (130), `OverviewTiles.tsx` (76), `StageBlock.tsx` (127), `TeamCompare.tsx` (127); `routes/reports/` — `reports-view.ts` (327), `ReportsScreen.tsx` (113), `ReportTable.tsx` (154), `ReportExport.tsx` (96), `report-workbook.ts` (259). Test: diff mới của 5 file test (đủ), tên ca của 14 file test gói E.

**Chỗ gói khác nối vào (chỉ chỗ nối):** `routes/customers/CustomerProfile.tsx:100-278` (mở `AppointmentDialog` với `customer` hiện tại, `PolicyDialog`, `expectedCaseSize`), `i18n/vi.ts` (khóa `trash.*`, `error.*` của 4 mã mới, `policyForm.*`, `outcome.*`), e2e của gói (tên ca + phần đổi trong đợt sửa: `appointment-outcome`, `backup`, `customer-policies`, `trash`, `overview`, `reports`, `full-cycle`, `customer-forms`).

**Tài liệu:** `CLAUDE.md` gốc, `apps/desktop/CLAUDE.md`, `.claude/rules/{i18n-ui,tests}.md`; `common\{prompt-claude.md, plan.md (§4, §L2.1–§L2.11, Phụ lục E, H), known.md (phần 1–3), fixes.md (#592/#614, #593/#616, #594/#618, #597/#623, #600/#634, #601/#630, #606/#644, #607/#619), baseline.md}`; tổng hợp lượt 1 §3, §4.2–§4.4, §5.1, §5.5, §5.8, §7, §9; báo cáo gốc lượt 1 gói E: Claude laptop (`raw/2026-10-15/claude/E.md`, đủ), Claude Home PC (`raw/…/home-pc/claude/E.md`, đủ), Codex laptop / Home PC (§3, §6), Muse laptop / Home PC (§3, §7); báo cáo lượt 2 của chính Claude `claude\A.md` (đủ), `D.md` (§1–§5 đầu, §6.2, §8, §9), danh sách phát hiện của `B.md`, `C.md`.

**Phiên làm tiếp đọc thêm (ở SHA ghim):** `packages/ui/src/components/Dialog.tsx:1-60` (trả focus), `DataTable.tsx:140-220` + `show-more.ts` (100 dòng mỗi lần), `apps/desktop/src/routes/SettingsTrash.tsx` (đủ), `RescheduleDialog.tsx`, `RescheduleFields.tsx` (6e không điền sẵn ngày → không có biến thể DR6-38), `AppointmentsScreen.tsx:125-310`, `:600-651`, `customers/CustomerPolicies.tsx:40-108`, `PolicyDialogs.tsx` (chỗ `effectText` / nút Lưu), `policy-form.ts:55-114`, `report-workbook.ts` (ô trống cho "—"), `data/AppDataContext.tsx` (`useQuery`), `packages/db/src/trash.ts:1-200` (`listTrash`), `database.ts` (bộ đệm câu lệnh); `docs/metrics/phase-6.md` (ngưỡng), `phase-6-hoan-thien.md:100` (TR-6), tổng hợp lượt 1 §7.1 và bảng DR6 (`:77`, `:121`, `:224`), `common\known.md` phần 3, `common\fixes.md` (#601 / #630 DR6-44, #603 / #638 DR6-35), `common\baseline.md` (Thùng rác, ⚠️); `claude\A.md` (dòng DR6-44), `claude\B.md` (CL2-B7), `claude\D.md` (K10, K16, mục A); báo cáo gốc lượt 1 Home PC Claude E §4b, Codex D (dòng trục A), các dòng "focus" của `raw/2026-10-15/`.

## 4. Kịch bản mới đã thử

Bản web dùng cho màn: `E\dist-base` (dựng ngoài repo từ worktree ghim, `VITE_DEMO_ANCHOR=15/09/2026` như e2e, kèm snapshot demo của ngày đó; cổng 4526) và `E\dist-real` (không ghim ngày: hôm nay là ngày của đồng hồ; cổng 4525). Mọi probe trình duyệt: Edge headless qua Playwright của repo (`E\browser.mjs`, chép từ gói D), mạng ngoài 127.0.0.1 bị chặn từ lần chạy đầu (`--host-resolver-rules` + `route.abort`), `window.open` / clipboard thay bằng bản ghi; mọi log ghi `requests blocked (not 127.0.0.1) []`. Probe Node đi qua lớp dữ liệu của app (`openAppData`, `readBackup` + `importBackup` như Cài đặt → Dữ liệu, `app.tables()`, hàm view của màn), không chèn SQL thô; lệnh `db` gọi thẳng chỉ khi kết luận về lệnh (p11).

| # | Kịch bản (các bước, dữ liệu) | Kết quả | ID |
|---|---|---|---|
| K1 | Hộp 6f ↔ lệnh trên **mọi** cuộc gặp Đã gặp của dữ liệu tải (7 503; `p01-dialog-vs-command.mjs`): trạng thái hộp như `EditOutcomeDialog` tính (`outcomeLock`, `meetingDay` với nhóm đã giữ, `heldStage`), (a) mở 6f rồi Lưu không sửa gì, (b) mỗi nhóm hộp cho chọn (không khóa / không giữ) → `editMeetingOutcome` trong transaction bỏ đi; dòng đọc lại (`StageRead`) ↔ chuyển nhóm lệnh ghi. 6c trên lịch Chưa ghi kết quả của dữ liệu tải | 2 617 khóa D7, 3 655 bị giữ; Lưu không sửa: 0 bị từ chối, 0 làm đổi chuyển nhóm / nhóm KH / nhóm sau; 6 852 lựa chọn: 0 bị lệnh từ chối, 0 dòng đọc lại sai. Dữ liệu tải (12/10) không có lịch Chưa ghi kết quả (seed ghi hết) nên 6c đo ở K4, K6, K10 | không thấy |
| K2 | Chuỗi bàn giao trên dữ liệu tải (`p02-handover-figures.mjs`): S0 → S1 5c đổi RE A → B (team khác) → S2 6c lịch Chưa ghi kết quả (của A) Đã gặp N3 → N2 + "Hẹn lần tiếp theo" → S3 xóa lịch tiếp theo rồi `restoreRow` → S4 xuất / nhập backup; mỗi bước so 6 kỳ (Tháng, Năm, tháng trước, tháng sau, Tùy chọn 3 tháng, Tuần) × 5 góc nhìn (Toàn bộ, 2 team, 2 RE): ô Lịch hẹn Tổng quan = Tổng hợp Báo cáo = dòng đếm màn Lịch hẹn, 6 ô KPI = ô Kết quả, ô nhóm = KH cuối kỳ, So sánh team = Theo team / Theo RE, Σ RE = team = Toàn bộ, Excel (4 / 3 / 2 sheet, mọi dòng × 17 cột) = màn | **0 lệch** ở 5 bước. S0→S1: Dự kiến A −2 / B +2 (tháng 10, năm, Tùy chọn); KH cuối kỳ N3 A −1 / B +1 ở **mọi** kỳ kể cả tháng 9 (spec Phase 4 §1 mục 6: RE hiện tại). S1→S2: A Chưa ghi −1, Đã gặp +1, RF +1 (RE ghi trên cuộc hẹn, ADR-0007); B Dự kiến +1. S3 = S2, S4 = S3 | không thấy |
| K3 | Giao thừa trên màn (`p04-web-newyear.mjs`, `dist-real`, `page.clock` 31/12/2026 23:58 → 01/01/2027 00:01, dữ liệu `newyear.p2cbackup` của `p03`): 6f lịch Hủy 30/12 chỉ gõ ghi chú; 6h từ cuộc gặp 31/12; 8b phát hành; 8d sửa FYP; 8a HĐ mới; **biến thể:** 6c "Hẹn lần tiếp theo" **gõ tay** "31/12" trước nửa đêm | 6f giữ `30/12/2026` (lượt 1: nhảy sang 2027); 6h báo `31/12/2026 đã qua. Lịch mới phải từ hôm nay (01/01/2027) trở đi.`, hộp ở lại, không tạo lịch 2027; 8b `Phát hành 31/12/2026`, không "1 ô cần sửa"; 8d giữ 10/12 / 28/12; 8a `Nộp 31/12/2026`. Biến thể gõ tay: sau nửa đêm dòng đọc lại và khung "Khi lưu" đổi thành `31/12/2027 · 364 ngày nữa`, lưu lịch 31/12/2027 — chữ gõ đọc theo hôm nay là thiết kế của PR #634 (test "reads a day typed over the filled-in one against today"), hộp có nói trước | không thấy |
| K4 | Bàn giao rồi ghi kết quả kèm hẹn tiếp trong góc nhìn RE cũ (`p07-web-chains.mjs` W2, `dist-base`): đặt lịch 14/09 cho KH N3 của A → hồ sơ, 5c sang B (team khác) → Lịch hẹn, Góc nhìn RE A → lịch 14/09 (Chưa ghi kết quả, vẫn của A) → 6c Đã gặp N2 + hẹn 20/09 | 5c `Khi lưu: 1 lịch hẹn Dự kiến chuyển sang RE mới.`; 6c ghi `… RE phụ trách KH — sửa ở lịch mới`; sau Lưu màn sang `Lịch tháng 09/2026` / `Trong ngày 20/09/2026`, dòng `Đã tạo lịch hẹn 20/09/2026 cho Bùi Kim Hùng. RE này nằm ngoài góc nhìn hiện tại nên lịch không hiện ở đây; đổi góc nhìn để xem.` (DR6-42 + DR6-02) | không thấy |
| K5 | E19 / E20 trên màn (W3): (E19) cuộc gặp hôm nay giữ N3 → chuyển tay N3 → N2 cùng ngày → 6f → Xóa (6g) → Thùng rác → khôi phục; (E20) cuộc gặp hôm nay N3 → N2 → Xóa (rút) → chuyển tay N3 → N1 cùng ngày → Thùng rác | E19: 6f khóa Nhóm sau ở N3 với dòng `Nhóm của KH đã đổi tiếp sau cuộc gặp này, ngày 15/09/2026: N3 → N2`; 6g `Cuộc hẹn này không đổi nhóm KH`; hộp khôi phục `Kết quả Đã gặp · nhóm sau N3`, `Không đổi nhóm KH`; khôi phục xong KH vẫn N2. E20: chặn đúng, nhưng câu lý do `Nhóm KH đã đổi ngày 15/09/2026, sau ngày cuộc hẹn này` cho lịch 15/09/2026 | CL2-E2 |
| K6 | 6c bị giữ bởi một cuộc gặp **Đã gặp sau** (không có đổi nhóm; W7) và 6f bị khóa D7 bởi cuộc gặp giữ nhóm sau (W9) trên màn | W7: không còn ô chọn, `Nhóm sau cuộc gặp khóa ở nhóm của KH ngày 14/09/2026 · Đã ghi cuộc gặp Đã gặp ngày 15/09/2026, sau cuộc gặp này.`, lưu `Giữ N3`. W9: `Khóa 3 ô … Cuộc gặp ngày 15/09/2026 sau đó ghi KH giữ nhóm N2`, Xóa tắt | không thấy (test hở: CL2-E4) |
| K7 | 6f **dời ngày** cuộc gặp đã chuyển nhóm N3 → N2 (RF) về trước một chuyển tay N4 → N3 (W8, + lệnh ở `p11-move-earlier.mjs` trên bản ghim và bản `8855345`); đối chứng W10: dời **muộn** một cuộc gặp giữ nhóm qua một chuyển tay | W8: hộp tự đặt Nhóm sau `N4 🔒`, chỉ có dòng khóa; Lưu được, chuyển nhóm của cuộc gặp và RF mất, KH N2 → N3 (lượt 1: lệnh từ chối D10, không đổi gì). W10: hộp có dòng `N2 → N3 ngày 14/09/2026 · không tính RF` trước khi lưu | CL2-E1 |
| K8 | Cài đặt → Dữ liệu (W4): Nạp lại → Xuất backup → chọn file hỏng (10b) → Đóng → Nhập backup file vừa xuất | Sau Nạp lại: một câu nạp lại; sau Xuất: chỉ câu xuất; sau file hỏng: hộp 10b, đóng xong không còn câu nào (câu xuất bị xóa khi chọn file — có từ trước, dữ liệu không đổi); sau Nhập: chỉ `Đã nhập backup xuất lúc …` (DR6-45) | không thấy |
| K9 | Tên nút Khôi phục (DR6-43) trên dữ liệu tải và với bản ghi giống nhau (`p06-trash-screen.mjs`): 113 dòng Thùng rác; rồi tạo + xóa bằng lệnh hai HĐ cùng KH cùng ngày nộp, hai lịch cùng ngày cùng giờ, hai lịch cùng ngày không giờ; id dòng lý do; hàm của màn mọi dòng; E20 bằng hàm của màn | Dữ liệu tải: 113 / 113 tên khác nhau, id lý do không trùng, `restoreView` / `recordDetail` / `restoredNotice` chạy hết. Sau khi thêm: 3 tên trùng, trong đó hai HĐ khác FYP mà cùng tên nút. E20: `Nhóm KH đã đổi ngày 12/10/2026, sau ngày cuộc hẹn này` cho lịch 12/10/2026 | CL2-E3, CL2-E2 |
| K10 | Tái hiện lượt 1 chạy lại (`p10-rerun-r1.mjs`): H·CL-E4 (`p6-backfill.mjs` Home PC), L·CL-E1 (6f giữ nhóm sau chuyển tay), case size trên dữ liệu tải, DR6-01 trên hàm Thùng rác: 60 cuộc gặp giữ nhóm có KH đổi nhóm ngày sau, xóa → dòng Thùng rác → `restoreRow` | (bảng R: DR6-04, DR6-39, DR6-01) H·CL-E4: hộp từ N3, giữ N3, N2 / N1 lệnh từ chối, N3 lưu `Giữ N3`; L·CL-E1: hộp giữ N3 với dòng `N3→N2 10/10/2026`, lưu nguyên không đổi gì; case size: 415 KH có cuộc gặp gần nhất trống nay không hiện dòng (324 trong đó lượt 1 sẽ hiện số cũ); 60 / 60 dòng không bị chặn, hệ quả `Không đổi nhóm KH`, khôi phục 60 / 60 | không thấy |
| K11 | Lượt 1 L·CL-E7 `p8-roundtrip` làm lại trên dữ liệu tải lượt 2 (`p12-delete-restore-figures.mjs`): xóa bằng lệnh của màn 40 cuộc gặp có chuyển nhóm, 40 cuộc gặp giữ nhóm (KH đổi nhóm sau), 20 lịch Dự kiến, 20 HĐ, 10 KH; khôi phục mọi dòng qua `restoreRow` theo thứ tự Thùng rác; so 1 170 ô Báo cáo (Toàn bộ + mọi RE × 24 tháng + 2 năm) | 50 lần xóa bị D7 mở rộng chặn (`STAGE_KEPT_BY_MEETING`, đúng luật), 130 bản ghi vào Thùng rác, 440 / 1 170 ô đổi; khôi phục **130 / 130**, **0 / 1 170** ô khác trước (lượt 1: 17 / 120 bị chặn, "Đã gặp" 2025 thấp đi hẳn) | không thấy |
| K12 | Đột biến TSX của phần sửa chạy cả 12 spec e2e gói E (109 ca) trên bản dựng ngoài repo, và chuỗi màn W3 trên bản đột biến R04g (`p07-W3-on-R04g.log`): CI có thấy khi phần sửa ở màn bị gỡ? | (mục 2, 9.2) R04g (6f không đi từ nhóm đã giữ — E19), R38c / R38d / R38e (6f / 6h / 8a–8d bỏ `Prefill` / `opened`) sống cả bộ e2e; trên R04g hộp 6f của ca E19 hiện lại `N2 giữ nguyên … N2 → N3 ngày 15/09/2026 · không tính RF` (chuyển nhóm không có thật — đúng triệu chứng DR6-04) | CL2-E4, CL2-E5 |
| K13 | Tương phản chữ mới của đợt sửa (`p13-contrast.mjs`, `contrastOf` đọc màu qua canvas): dòng khóa 6c (DayLockNote), khóa D7 keptBy 6f, 8d "khác FYP nộp" + "Ảnh hưởng chỉ số", Thùng rác có dòng bị chặn, câu thông báo Dữ liệu | Thấp nhất 6,17:1 (chữ `text-fg-3`), 0 chữ mới < 4,5; riêng mũi tên sắp `↕` 1,76:1 ở đầu cột Thùng rác — KNOWN (Token G3 R4 "mũi tên sắp xếp dưới 3:1") | không thấy |
| K14 | (phiên làm tiếp) Thùng rác lớn dần trên màn — TR-6 không bao giờ dọn: xóa thêm 150 / 300 / 600 KH bằng lệnh của app (`p09`, `p18`), nhập qua Cài đặt → Dữ liệu, mở Thùng rác 6 lần trên bản ghim và trên bản bỏ 3 chỉ mục 0009 (`p08` trash-only); so nội dung màn hai bản (`p17`); profile CDP (`p19`); Node có / không inspector (`p20`), số câu SQL (`p21`), một transaction đọc (`p22`) | 113 / 263 / 413 / 713 dòng: 83 / 137 / 172 / **269 ms** (bỏ chỉ mục: 155 / 476 ms ở 113 / 263); màn hai bản trùng sha256; ở 713 dòng ≈ 215 ms / lần mở là MEMFS `lookupPath` / `lookup` ném ENOENT của sql.js, đắt lên khi có DevTools (Node 79 → 130 ms); 3,1–4,5 câu SQL / dòng; một transaction đọc −25 % | CL2-E7 |
| K15 | (phiên làm tiếp) Thao tác màn mới của đợt sửa trên bản web ghim với dữ liệu tải, hôm nay thật 17/10/2026 (`p08`): 6c ở kỳ Tuần (lịch 12–16/10 Chưa ghi kết quả), 6f trên 9 cuộc gặp tháng 1 (4 bị khóa D7), 8d trên HĐ đã phát hành, Khôi phục ở Thùng rác; chi phí mỗi render của `meetingDay` / `heldStage` / `policyChange` / `prefill` trên mọi cuộc gặp (`p15`) | Mọi thao tác ≤ 88 ms (Lưu 6c), mở hộp 6–9 ms, một phím ≤ 0,6 ms; code mới ≤ 0,34 ms p95 mỗi render; không xấu hơn lượt 1 (mục 6.2 bảng B, C) | không thấy |
| K16 | (phiên làm tiếp) Focus sau khi Lưu ở các hộp gói E, mở bằng bàn phím (focus + Enter) trên bản web ghim (`p23`): 6c Hủy → Lưu; 6c Escape; 6f Lưu; 6e Dời lịch; 6g Xóa rồi Thùng rác → Khôi phục; 6h tạo lịch tương lai; 8a HĐ đầu tiên rồi 8b Phát hành | Nút mở còn (Escape, 6f, 6e): focus về nút đó. Nút mở tự gỡ (6c, 6g, Khôi phục, 6h, 8a từ ô trống, 8b): `BODY` | CL2-E8 |

## 5. Phát hiện mới

### CL2-E1 — Hộp 6f: dời ngày cuộc gặp **đã chuyển nhóm** (vd. N3 → N2, tính RF) về trước một lần đổi nhóm khác thì ô "Nhóm sau" bị giữ ở nhóm của ngày mới, Lưu rút luôn chuyển nhóm và RF của cuộc gặp mà hộp không nói

```
ID: CL2-E1
Mức: Low
Trục: C, D
Vị trí: apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx:87-92 (kept = null khi có `caused`; holding = heldStage(onDay) của NGÀY MỚI; draft.stageAfter = holding), :227-228 (MetFields khóa, chỉ DayLockNote); apps/desktop/src/routes/appointments/OutcomeDialog.tsx:271-304 (DayLockNote: chỉ nói vì sao khóa); apps/desktop/src/routes/appointments/outcome-form.ts:101-134 (meetingDay / heldStage); packages/db/src/appointments.ts:224-229 (editMeetingOutcome: dời ngày → rút chuyển nhóm, ghi lại như ghi mới) — so với DeleteAppointmentDialog.tsx:40-66 (6g nói rõ "Nhóm KH N2 → về N3 (hủy chuyển nhóm) · RF bớt 1") (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-04 (biến thể) · mới do đợt sửa (PR #616, T-232)
Kịch bản: K7
```

- **Mô tả:** T-232 cho 6f "giữ" ô Nhóm sau ở nhóm của ngày cuộc hẹn khi sau ngày đó có đổi nhóm (`heldStage`). Với cuộc gặp **đã chuyển nhóm** (có `caused`), `kept` = null, nên khi người dùng chỉ sửa ô Ngày về trước một lần đổi nhóm sớm hơn (vd. chuyển tay N4 → N3 ngày 10/09, cuộc gặp 15/09 N3 → N2, sửa ngày thành 05/09), hộp tự đặt Nhóm sau = nhóm của 05/09 (N4 🔒) với dòng khóa "Nhóm của KH đã đổi tiếp sau cuộc gặp này, ngày 10/09/2026: N4 → N3". Lưu được ngay: lệnh rút chuyển nhóm N3 → N2 của cuộc gặp, ghi cuộc gặp thành "Giữ N4", KH từ N2 về N3, RF của tháng giảm 1. Hộp không có dòng nào nói chuyển nhóm của chính cuộc gặp (tiêu đề còn ghi "N3 → N2 · RF") và RF sẽ mất — trong khi hộp Xóa 6g làm đúng việc rút này thì nêu rõ hậu quả. Ở code lượt 1, cùng thao tác bị lệnh từ chối `TRANSITION_BEFORE_LATEST` (10/09/2026), dữ liệu không đổi.
- **Tái hiện / bằng chứng:**
  - Màn (bản web ghim, `node p07-web-chains.mjs 4526`, log `E\p07-web-chains.log` W8, ảnh `E\shots\W8-6f-moved-before-manual-change.png`): KH N4 "Bùi Bảo Thảo" → Chuyển nhóm N3 ngày 10/9 → lịch 15/09 Đã gặp N2 → hồ sơ "N2 từ 15/09/2026" → 6f, gõ Ngày `5/9`: `Nhóm sau cuộc gặp | N4 | 🔒 | Nhóm sau cuộc gặp khóa ở nhóm của KH ngày 05/09/2026 | Nhóm của KH đã đổi tiếp sau cuộc gặp này, ngày 10/09/2026: | N4 | → | N3 | Đổi nhóm không được lùi ngày (D10)…` (tiêu đề hộp vẫn `… · N3 → N2 · RF`) → Lưu: không lỗi; chi tiết `05/09/2026 … Kết quả | Giữ N4`; hồ sơ `N3 từ 10/09/2026`; dòng thời gian chỉ còn `10/09/2026 N4 → N3 chuyển tay`.
  - Lệnh, bản ghim và bản `8855345` (`node p11-move-earlier.mjs`, log `p11-move-earlier.log` / `.old.log`; bản cũ chạy bằng `P2C_REPO=…\A\old-8855345\`):

    | 6f gửi (ngày 15/09 → 05/09) | `8855345` | `4217ed4` |
    |---|---|---|
    | Nhóm sau N2 (hộp lượt 1 gửi bản nháp) | `refused TRANSITION_BEFORE_LATEST {"date":"10/09/2026"}` | `refused TRANSITION_BEFORE_LATEST` |
    | Nhóm sau N4 (hộp lượt 2 giữ ở N4) | `refused TRANSITION_BEFORE_LATEST` | `saved` — KH `N2 → N3`, chuyển nhóm `N3→N2 15/09/2026 (cuộc gặp)` mất, `rfOfSeptember 1 → 0`, lịch `05/09/2026 MET N4` |
  - Đối chứng W10 (log `p07-web-chains-w9-w10.log`): dời **muộn** một cuộc gặp giữ nhóm qua một chuyển tay thì hộp có dòng `N2 → N3 ngày 14/09/2026 · không tính RF` nói trước chuyển nhóm sẽ ghi.
- **Ảnh hưởng:** RE / TL sửa ngày một cuộc gặp đã tính RF (nhập nhầm ngày) về trước một lần đổi nhóm: RF của RE và nhóm hiện tại của KH đổi khi bấm Lưu mà hộp chỉ nói "khóa"; lan sang Tổng quan / Báo cáo / Excel. Cần lịch sử cụ thể (một lần đổi nhóm nằm giữa ngày mới và ngày cũ), hộp có hiện "N4 🔒", sửa ngược được (đổi lại ngày rồi chọn lại N2) → Low.
- **Đề xuất:** khi `caused` có mà nhóm bị giữ ≠ `caused.to`, hộp nêu hậu quả như 6g ("Khi lưu: Nhóm KH N2 → về N3 (hủy chuyển nhóm 15/09) · RF bớt 1"), hoặc chặn dời ngày của cuộc gặp có chuyển nhóm qua một lần đổi nhóm khác (khóa ô Ngày như D7) — Owner chọn (G3 nếu thêm dòng). ≈ 15–30 dòng SP (`EditOutcomeDialog.tsx`, `vi.ts`) + một ca e2e `appointment-outcome.spec.ts`.

### CL2-E2 — Lý do chặn E20 ở Thùng rác nói "Nhóm KH đã đổi ngày X, sau ngày cuộc hẹn này" khi X chính là ngày cuộc hẹn

```
ID: CL2-E2
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/i18n/vi.ts:309-310 (trash.blocked.TRANSITION_BEFORE_LATEST); apps/desktop/src/routes/trash-view.ts:216-217 (dùng câu đó cho mọi TRANSITION_BEFORE_LATEST có `date`); docs/design/phase-6-hoan-thien.md:139 (E20: "Chặn như E6: 'Nhóm KH đã đổi ngày 02/10/2026, sau ngày cuộc hẹn này (D10)'" cho lịch 02/10); mockup trash.html:180, :267 chỉ có ca ngày sau (28/09 ↔ 05/10, E6 / E8) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-03 (E20) · mới do đợt sửa (PR #614 / spec #615)
Kịch bản: K5
```

- **Mô tả:** E20 (cuộc gặp có chuyển nhóm bị rút khi xóa, rồi chuyển tay **cùng ngày** cuộc hẹn) chặn đúng như spec, nhưng câu lý do dùng chung với E6 nên đọc theo nghĩa thường là sai: dòng "Lịch hẹn 15/09/2026 · Đã gặp" kèm "Nhóm KH đã đổi ngày 15/09/2026, sau ngày cuộc hẹn này". Spec E20 ghi đúng câu này (đã duyệt), mockup 11d chỉ minh họa ca ngày sau.
- **Tái hiện:** màn (W3, log `p07-web-chains.log`, ảnh `shots\W3-trash-e19-e20.png`): `Lịch hẹn 15/09/2026 · Đã gặp nhóm sau N2 Nhóm KH đã đổi ngày 15/09/2026, sau ngày cuộc hẹn này — không ghi chuyển nhóm lùi ngày (D10).`, nút `Khôi phục lịch hẹn 15/09/2026 của KH Bùi Bảo Quân` tắt, mô tả bằng đúng câu đó; hàm của màn trên dữ liệu tải (`p06-trash-screen.mjs`): `["12/10/2026",{"code":"TRANSITION_BEFORE_LATEST","params":{"date":"12/10/2026"}},"Nhóm KH đã đổi ngày 12/10/2026, sau ngày cuộc hẹn này — …"]`.
- **Ảnh hưởng:** người khôi phục đọc một lý do tự mâu thuẫn (cùng ngày mà "sau ngày"), không biết vì sao (đổi nhóm **ghi sau lúc xóa**). Chỉ chữ.
- **Đề xuất:** Owner xem (G2 / G3 vì spec và mockup ghi câu): một câu riêng khi ngày đổi nhóm = ngày cuộc hẹn, vd. "Nhóm KH đã đổi ngày 15/09/2026, ghi sau lúc xóa cuộc hẹn này — …"; ≈ 5 dòng (`trash-view.ts` so `params.date` với ngày lịch, một khóa `vi.ts`) + một ca `trash-view.test.ts`.

### CL2-E3 — Tên nút "Khôi phục…" (DR6-43) trùng nhau với hai HĐ của cùng KH nộp cùng ngày: tên không có FYP như dòng "Bản ghi"

```
ID: CL2-E3
Mức: Nit
Trục: A
Vị trí: apps/desktop/src/routes/trash-view.ts:169-173 (restoreLabel của HĐ: ngày nộp + KH), so :79-83 (recordTitle có FYP); apps/desktop/src/i18n/vi.ts:327; test trash-view.test.ts "tells apart the buttons of a whole trash" chỉ trên bộ ROWS cố định (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-43 (biến thể) · mới do đợt sửa (PR #630)
Kịch bản: K9
```

- **Mô tả:** `restoreLabel` của HĐ chỉ có ngày nộp và tên KH. Hai HĐ của cùng KH nộp cùng ngày (một KH mua hai HĐ một lần — thao tác 8a bình thường), cùng xóa, có hai nút cùng tên "Khôi phục HĐ nộp 05/10/2026 của KH …", trong khi dòng "Bản ghi" hai bên khác nhau ("Nộp 05/10/2026 · 100.000.000 ₫" / "· 200.000.000 ₫"). Hai lịch cùng KH cùng ngày cùng giờ cũng trùng, nhưng dòng "Bản ghi" của chúng cũng trùng nên không phải lệch của nhãn.
- **Tái hiện:** `node p06-trash-screen.mjs` (log `p06-trash-screen.log`): dữ liệu tải 113 dòng, 113 tên khác nhau; sau khi tạo + xóa hai HĐ cùng ngày và bốn lịch trùng ngày / giờ bằng lệnh: `rows / distinct names / duplicated names [119,116,3]`, `["Khôi phục HĐ nộp 05/10/2026 của KH Bùi Đức Hoa",["policy EFGJN2","policy NEH5TY"]]`, title hai dòng `Nộp 05/10/2026 · 200.000.000 ₫` / `· 100.000.000 ₫`.
- **Ảnh hưởng:** người dùng trình đọc màn hình nghe hai nút giống hệt, không biết nút nào khôi phục HĐ nào; người nhìn thấy thì phân biệt được qua ô Bản ghi. Hiếm (hai HĐ cùng ngày cùng bị xóa).
- **Đề xuất:** thêm FYP vào `trash.restoreLabel.policy` ("Khôi phục HĐ nộp {date} · {fyp} của KH {name}"), như `recordTitle`; ≈ 2 dòng + một ca trong `trash-view.test.ts` (hai HĐ cùng ngày).

### CL2-E4 — Ba nhánh của luật "giữ nhóm sau" mới ở 6c / 6f (T-232) không test nào giữ: giữ bởi cuộc gặp Đã gặp sau, E19 khi nhóm cuối ngày khác nhóm đã giữ, 6f đi từ nhóm đã giữ

```
ID: CL2-E4
Mức: Low
Trục: T
Vị trí: apps/desktop/src/routes/appointments/outcome-form.ts:117 (`kept !== ended`), :133 (`day.change || day.meeting`); apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx:87-88 (`kept` = nhóm đã giữ khi ngày không đổi); test outcome-form.test.ts:193-235 (meetingDay: có ca `meeting` nhưng không gọi `heldStage` trên nó; ca E19 chỉ có kept ≠ cuối ngày), e2e appointment-outcome.spec.ts:238 (chỉ ca 6c bị giữ bởi một **đổi nhóm**) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-04 · mới do đợt sửa (PR #616)
Kịch bản: K6, K12
```

- **Mô tả:** ba đột biến của phần sửa DR6-04 sống qua cả bộ vitest (2 898) và 12 spec e2e của gói E (109): **N2** — `heldStage` chỉ giữ khi có đổi nhóm sau, bỏ ca "cuộc gặp Đã gặp sau" (hộp lại cho chọn nhóm mà lệnh từ chối `TRANSITION_BEFORE_MEETING` sau khi bấm Lưu — đúng triệu chứng DR6-04); **N1** — bỏ `kept !== ended`, một đổi nhóm cùng ngày trước cuộc gặp cũng khóa 6f; **R04g** — 6f không đi từ nhóm đã giữ của ngày (E19). PR #616 viết "Cuộc gặp giữ nhóm sửa ở chính ngày của nó thì đi từ nhóm đã giữ, nên ca E19 không hiện một chuyển nhóm không có thật" mà không có test giữ câu này.
- **Tái hiện / bằng chứng:** `E\mut.log`: `N1 SURVIVED … 287 passed (287)` rồi cả bộ `2898 passed (2898)` (`mut-out\N1.out`), `N2 SURVIVED` như vậy; `E\e2e-mutants.log`: `R04g SURVIVED — 0 failed / 109 passed`, `N1 SURVIVED — 0 failed / 109 passed`, `N2 SURVIVED — 0 failed / 109 passed`. Hậu quả trên màn của R04g (`node p07-web-chains.mjs 4527 W3` trên `E\dist-R04g`, log `p07-W3-on-R04g.log`): hộp 6f của cuộc gặp E19 hiện `N2 | giữ nguyên … N2 → N3 ngày 15/09/2026 · không tính RF` (chuyển nhóm không có thật) thay cho `N3 🔒` + dòng khóa của bản ghim (`p07-web-chains.log` W3). Hậu quả trên màn của N2 (`node p16-n2-screen.mjs` trên `E\dist-N2` cổng 4531 rồi bản ghim `dist-base` cổng 4526, log `E\p16-n2-screen.log`): lịch 14/09 Chưa ghi kết quả của KH đã có cuộc gặp Đã gặp 15/09 — bản N2 hiện ô chọn nhóm (`stage radios offered / checked [1,"(none)"]`), chọn N2 thì dòng đọc lại `N3 → N2 ngày 14/09/2026 · tính RF`, bấm Lưu thì hộp ở lại (`dialog still open 1`) với lỗi `Đã ghi cuộc gặp Đã gặp ngày 15/09/2026, cuộc gặp đó ghi nhóm của KH ngày ấy: không đổi nhóm vào ngày trước 15/09/2026.` — đúng triệu chứng DR6-04 (lựa chọn bị từ chối sau Lưu); bản ghim `[0,null]`, `N3 🔒` + `Đã ghi cuộc gặp Đã gặp ngày 15/09/2026, sau cuộc gặp này.`, Lưu ghi `Kết quả | Giữ N3`.
- **Ảnh hưởng:** một lần sửa sau làm hỏng một trong ba nhánh thì triệu chứng DR6-04 (lựa chọn bị từ chối sau Lưu, dòng đọc lại báo chuyển nhóm giả) quay lại mà CI xanh. Hành vi hiện tại đúng (K1, K5, K6).
- **Đề xuất:** thêm vào `outcome-form.test.ts`: `heldStage(meetingDay(… cuộc gặp Đã gặp sau …))` = nhóm của ngày; một đổi nhóm cùng ngày làm nhóm cuối ngày **bằng** nhóm đã giữ thì không giữ; tách "nhóm bắt đầu của 6f" (`kept` / `from` / `holding` ở `EditOutcomeDialog.tsx:87-92`) thành một hàm thuần trong `outcome-form.ts` có test, hoặc một ca e2e 6f E19. ≈ 20–40 dòng test, ≤ 10 dòng SP nếu tách hàm.

### CL2-E5 — DR6-38: phần nối "chữ điền sẵn đọc theo ngày mở hộp" ở 6f, 6h, 8a–8d không test nào giữ — gỡ khỏi ba hộp thì lỗi giao thừa của lượt 1 quay lại mà vitest và e2e xanh

```
ID: CL2-E5
Mức: Low
Trục: T
Vị trí: apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx:62, :72 (`prefill`, `readScheduleDate(…, filled)`); apps/desktop/src/routes/appointments/AppointmentDialog.tsx:83, :99; apps/desktop/src/routes/customers/PolicyDialogs.tsx:65, :71 (`openDraft`, `readPolicy(draft, today, opened)`); test chỉ ở hàm thuần: appointment-form.test.ts:87-123, policy-form.test.ts:110-163; e2e không có ca `page.clock` qua giao thừa cho các hộp này (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-38 · mới do đợt sửa (PR #634; test chấp nhận của Issue #600 chỉ đòi unit)
Kịch bản: K3, K12
```

- **Mô tả:** phần sửa DR6-38 có hai nửa: hàm đọc (`readScheduleDate` với `Prefill`, `readPolicy` với `opened`) có unit test đỏ khi gỡ (R38a, R38b KILLED); và phần nối ở ba hộp TSX chuyển `Prefill` / `opened` cho hàm đọc. Gỡ phần nối ở từng hộp (R38c 6f, R38d 6h, R38e 8a–8d) thì cả 2 898 vitest lẫn 109 e2e gói E vẫn xanh, trong khi trên màn lỗi lượt 1 quay lại.
- **Tái hiện / bằng chứng:** `E\e2e-mutants.log`: `R38c SURVIVED — 0 failed / 109 passed`, `R38d SURVIVED …`, `R38e SURVIVED …`. Trên màn: `p04-web-newyear.mjs` (K3) chạy trên ba bản dựng đột biến không ghim ngày `E\dist-real-R38c|d|e` (cổng 4528–4530, `page.clock` 31/12/2026 23:58 mở hộp → 01/01/2027 00:01 Lưu; log `E\p04-web-newyear-R38{c,d,e}.log`, dựng `E\build-r38-real.log`, mỗi bản `git status --short after: ""`), so bản ghim `E\p04-web-newyear.log`:

  | Đột biến | Hộp | Bản đột biến | Bản ghim |
  |---|---|---|---|
  | R38c | 6f lịch Hủy 30/12, chỉ gõ ghi chú | `"read":{"value":"30/12","said":"Thứ Năm 30/12/2027 · 363 ngày nữa"}`, chi tiết `30/12/2027 19:30 · Giao Thừa Một` — lịch nhảy sang 2027 | `Thứ Tư 30/12/2026 · đã qua 2 ngày`, `30/12/2026 19:30` |
  | R38d | 6h từ cuộc gặp 31/12 | `"said":"Thứ Sáu 31/12/2027 · 364 ngày nữa"`, `"stayed":false`, `"mentions31122027":true` — tạo lịch 31/12/2027 | `31/12/2026 đã qua. Lịch mới phải từ hôm nay (01/01/2027) trở đi.`, hộp ở lại |
  | R38e | 8b phát hành / 8d sửa / 8a HĐ mới | 8b, 8d `Ngày này sau hôm nay. Ngày của năm trước: gõ đủ dd/mm/yyyy.` + `Chưa lưu được — 2 ô cần sửa`; 8a `Chưa lưu được — 1 ô cần sửa` — không lưu được | cả ba lưu (`Phát hành 31/12/2026`, `… 295 tr`, `Nộp 31/12/2026`) |

  Mỗi bản đột biến chỉ hỏng đúng hộp của nó (các hộp khác như bản ghim) — đúng ba triệu chứng DR6-38 của lượt 1.
- **Ảnh hưởng:** một lần dọn / đổi hộp sau (vd. bỏ tham số "không dùng") làm lại DR6-38 (lịch Hủy nhảy sang năm sau, "Hẹn tiếp" tạo lịch năm sau, 8b báo lỗi ở ô ẩn) mà CI xanh.
- **Đề xuất:** một ca e2e `page.clock` (31/12 23:58 → 00:01) cho 6f và 8b như `p04-web-newyear.mjs` (≈ 40–60 dòng e2e), hoặc gom phần nối vào một hook / hàm thuần có test. 0 dòng SP.

### CL2-E6 — DR6-43: phần "tiêu đề ẩn" của cột nút Thùng rác không test nào giữ (bỏ `headerHidden` thì e2e vẫn xanh)

```
ID: CL2-E6
Mức: Nit
Trục: T
Vị trí: apps/desktop/src/routes/SettingsTrash.tsx:115 (`headerHidden: true`); e2e/trash.spec.ts:124 (chỉ kiểm `columnheader 'Thao tác'` có 1, không kiểm nó ẩn) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-43 · mới do đợt sửa (PR #630)
Kịch bản: K12
```

- **Mô tả / bằng chứng:** đột biến R43e (bỏ `headerHidden: true`, tiêu đề "Thao tác" hiện thành chữ, khác mockup 11a cột trống) → `E\e2e-mutants.log`: `R43e SURVIVED — 0 failed / 109 passed`; vitest không chạm TSX (G4). Ba phần còn lại của DR6-43 ở màn đều có e2e đỏ khi gỡ (R43b, R43c, R43d, R43f — mục 9.2).
- **Ảnh hưởng:** một lần sửa `DataTable` / cột sau làm tiêu đề hiện ra (lệch mockup 11a) mà CI xanh. Chỉ hiển thị.
- **Đề xuất:** e2e kiểm thêm tiêu đề đó không nhìn thấy (`toHaveClass(/sr-only/)` hoặc kích thước 1 px), ≈ 2 dòng.

### CL2-E7 — Thùng rác (không tự dọn, TR-6) mở chậm dần theo số bản ghi: vượt 200 ms từ ≈ 500 dòng trên bản web; phần lớn là lớp file trong bộ nhớ của sql.js mà mỗi câu SQL của `listTrash` đi qua

```
ID: CL2-E7
Mức: Low
Trục: P
Vị trí: apps/desktop/src/routes/SettingsTrash.tsx:166 (listTrash mỗi lần mở mục, sau mỗi lần ghi — vd. mỗi lần Khôi phục — và mỗi ngày mới); packages/db/src/trash.ts:97-180 (mỗi dòng: checkRestore… + customerEffect / restoreStageMove → 3–4,5 câu SQL, mỗi câu là một transaction đọc riêng) (4217ed4)
Tình trạng: CONFIRMED (số đo trên bản web qua DevTools, như probe exe); trên exe không gắn DevTools: PLAUSIBLE nhanh hơn
Liên quan: DR6-44 (phần còn lại sau sửa) · có từ trước (lượt 1 đo `listTrash` trong Node, chưa đo màn theo cỡ Thùng rác)
Kịch bản: K14
```

- **Mô tả:** DR6-44 đã bỏ phần quét toàn bảng cho từng KH (màn nhanh ×3,5 ở 263 dòng, mục 6.2 bảng D). Thời gian mở Cài đặt → Thùng rác vẫn tăng tuyến tính theo số dòng, ≈ 0,31 ms / dòng trên bản web: **83 / 137 / 172 / 269 ms** ở 113 / 263 / 413 / 713 dòng — vượt ngưỡng màn 200 ms từ ≈ 500 dòng. Thùng rác không bao giờ tự dọn (TR-6, `phase-6-hoan-thien.md:100`), nên số dòng chỉ tăng theo thời gian dùng; mỗi lần Khôi phục cũng đọc lại cả danh sách (70 ms ở 113 dòng). Profile ở 713 dòng: ≈ 215 ms mỗi lần mở nằm ở hai hàm MEMFS của phần JS sql.js gộp trong `index.js` (`lookupPath` và `lookup` ném ENOENT — khả năng là SQLite kiểm journal ở đầu mỗi transaction đọc), SQLite (wasm) chỉ 44–52 ms, phần JS còn lại (drizzle, `listTrash`, view, React) ≈ 43 ms và `(program)` (vẽ / layout của trình duyệt) ≈ 47–51 ms (113 dòng: 15 ms và 43 ms — bảng chỉ hiện 100 dòng nên phần vẽ gần như cố định). Phần ném lỗi này đắt lên khi có DevTools gắn vào (Node: `listTrash` 713 dòng 79,0 → 129,6 ms khi bật Runtime + Debugger), nên exe dùng thật (không DevTools) có thể nhanh hơn số đo — nhưng probe `e2e/perf` đo ngưỡng cũng qua CDP.
- **Tái hiện / bằng chứng:** `node p18-make-n.mjs 300|600` (lệnh của app qua `openAppData`: xóa thêm 300 / 600 KH, xuất backup; log `E\p18-make-n.log`: `[113,413]`, `[113,713]`, Node `listTrash` 48,2 / 73,1 ms) → `node p08-run.mjs E\dist-real 4533 E\load-del{300,600}.p2cbackup trash-only` (log `E\p08-trash-scale.log`): `Thùng rác count 413 bản ghi … Cài đặt: Dữ liệu → Thùng rác (listTrash + table) 172.3 ms (169.3–192.1, n=6)`, `713 bản ghi … 268.5 ms (265.7–297.5, n=6)`; 113 / 263 dòng ở `E\p08-trash-p44.log` (83,1 / 136,7 ms). Profile `node p19-trash-profile.mjs` (log `E\p19-trash-profile.log`, chạy 2): `"108.6 mb @ index-BE768Ocs.js:19:1999","106.2 ze @ index-BE768Ocs.js:19:4546"`, `"sql.js (wasm)":52.5`; mã ở hai vị trí đó: `mb(){throw N.zb||(N.zb=new F(44)…` và `function ze(e,t={}){if(!e)throw new F(44);…` (lookupPath của MEMFS). `node p20-node-inspector.mjs` (log `E\p20-node-inspector.log`): `(a) … no inspector (rows 713) ["79.0",…]`, `(b) … Runtime + Debugger enabled (rows 713) ["129.6",…]`. `node p21-trash-statements.mjs` (log `E\p21-trash-statements.log`): 113 dòng `[513,2477,"4.5"]`, 713 dòng `[2231,6662,"3.1"]` (câu có tham số, lần `step`, câu / dòng). `node p22-trash-in-transaction.mjs` (log `E\p22-trash-in-transaction.log`, probe — app không làm): bọc `listTrash` trong một `BEGIN … COMMIT`: 113 dòng 21,1 → 15,9 ms, 713 dòng 81,4 → 60,7 ms, có inspector 129,4 → 94,2 ms, `same rows both ways true`.
- **Ảnh hưởng:** người dùng lâu năm có Thùng rác vài trăm dòng (mỗi lần xóa KH / lịch / HĐ / nhân sự thêm một dòng, không bao giờ mất) thấy mở Thùng rác và mỗi lần Khôi phục chậm dần (≈ 0,27 s ở 713 dòng trên bản web). Không sai dữ liệu. Ngưỡng `phase-6.md` chốt trên dữ liệu tải (113 dòng: 83 ms bản web, 73 ms exe) vẫn đạt; cần Thùng rác ≈ 4–5 lần dữ liệu tải → Low (như DR6-44 lượt 1).
- **Đề xuất:** (code ở gói A) chạy `listTrash` trong một transaction đọc (p22: −25 %, cùng kết quả), hoặc tính "chặn" / "hệ quả" của cả Thùng rác bằng vài truy vấn gộp thay vì 3–4 câu mỗi dòng; tối thiểu ghi vào `docs/metrics/phase-6.md` một dòng theo dõi `trash.open` theo cỡ Thùng rác. ≈ 5–40 dòng SP `packages/db/src/trash.ts` + một test (số câu SQL / thời gian trên Thùng rác lớn).

### CL2-E8 — Lưu ở các hộp gói E mà nút mở hộp tự gỡ (6c Ghi kết quả, 6g Xóa, 6h, 8b Phát hành, 8a từ ô trống, Thùng rác Khôi phục) làm focus rơi về `body`

```
ID: CL2-E8
Mức: Low
Trục: A
Vị trí: packages/ui/src/components/Dialog.tsx:37-41 (trả focus cho nút mở chỉ khi nút còn trong trang, không có chỗ dự phòng); apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:631-647 (Ghi kết quả / Xóa chỉ khi SCHEDULED, Tạo lịch hẹn tiếp theo chỉ khi ngày ≤ hôm nay); apps/desktop/src/routes/customers/CustomerPolicies.tsx:57-61, :84-93 (nút "+ Hợp đồng" của ô trống, nút Phát hành chỉ khi chưa phát hành); apps/desktop/src/routes/SettingsTrash.tsx:120-129, :238-241 (dòng và nút Khôi phục mất sau khi khôi phục) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-35 (cùng loại "nút tự gỡ", chỗ khác — #638 chỉ sửa "Hiện thêm", "+ n KH", AI trích xuất) · có từ trước, lượt 1 bỏ sót (lượt 1 chỉ thử Escape: focus về nút mở)
Kịch bản: K16
```

- **Mô tả:** `Dialog` khi đóng trả focus về phần tử đã mở nó **nếu phần tử đó còn trong trang**; không còn thì không làm gì, focus rơi về `body`. Ở gói E, nhiều thao tác chính làm chính nút mở hộp biến mất khi Lưu: 6c (lịch hết Dự kiến nên "Ghi kết quả" mất), 6g Xóa (dòng và chi tiết mất), 6h (lịch mới ở tương lai nên "Tạo lịch hẹn tiếp theo" mất), 8b (HĐ đã phát hành nên "Phát hành" mất), 8a lần đầu (nút "+ Hợp đồng" của ô trống thay bằng nút ở đầu khung), Thùng rác (dòng vừa khôi phục mất). Người dùng bàn phím / trình đọc màn hình bị đưa về đầu trang sau mỗi lần ghi kết quả. DR6-35 / #638 đã sửa đúng loại này ở ba chỗ của gói C / D (về một điểm ổn định gần đó), chưa ở gói E.
- **Tái hiện / bằng chứng:** `node p23-focus-after-save.mjs 4534` (bản web ghim `E\dist-base`, server con, mở hộp bằng focus + Enter; log `E\p23-focus-after-save.log`): `F1 6c … {"focusInDialog":"input \"\"","afterSave":"BODY","detailButtons":["Sửa kết quả","Tạo lịch hẹn tiếp theo"]}`; `F5 6g … {"afterDelete":"BODY","afterRestore":"BODY",…}`; `F6 6h … {"afterSave":"BODY","detail":"22/09/2026 · Bùi Bảo Hạnh"}`; `F7 8a + Hợp đồng … {"afterNew":"BODY","afterIssue":"BODY"}`. Đối chứng, nút mở còn: `F2 … {"afterEscape":"button \"Ghi kết quả\""}`, `F3 6f … {"afterSave":"button \"Sửa kết quả\""}`, `F4 6e … {"afterSave":"button \"Dời lịch\""}`; `requests blocked (not 127.0.0.1) []`, 0 lỗi trang.
- **Ảnh hưởng:** người dùng bàn phím / trình đọc màn hình mất chỗ sau thao tác thường ngày nhất của màn Lịch hẹn và Hợp đồng; phải Tab lại từ đầu trang. Owner đã chọn sửa đúng loại này ở DR6-35 (Issue #603 mục 3: "không rơi về `body`"). Không sai dữ liệu → Low (như DR6-35).
- **Đề xuất:** một chỗ dự phòng chung ở `Dialog` (prop `returnFocus` / callback cho nơi gọi chọn đích khi nút mở đã mất, vd. tiêu đề `h2` của khung Chi tiết, dòng `role="status"` "Đã khôi phục…", đầu khung Hợp đồng), theo cách #638 làm cho "Hiện thêm"; + một ca e2e mỗi màn (`appointment-outcome`, `customer-policies`, `trash`). ≈ 20–40 dòng SP (gói D `packages/ui` + gói E) + ≈ 30 dòng e2e.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc | Trên | Kết quả | ID |
|---|---|---|---|
| `tsc --noUnusedLocals --noUnusedParameters` | `tsconfig.base.json:12-13` bật sẵn hai cờ → `pnpm typecheck` trong `pnpm verify` (xanh ở SHA ghim, `common\baseline.md`) là phép kiểm này (gói A đã xác nhận) | 0 biến / tham số thừa (không chạy lại) | — |
| Nơi dùng mọi export của 37 file SP gói E (`E\exports.mjs` = script lượt 1 Home PC, đọc `HEAD` bằng `git grep -w`, log `E\exports.log`) | `apps`, `packages`, `e2e`, `tools` | Export runtime mới của đợt sửa đều có nơi dùng SP: `prefill`, `meetingDay`, `heldStage`, `DayLockNote`, `openDraft`, `policyChange`, `effectText`, `restoreLabel`, `DataNoticeProps`. Chỉ test dùng: `readFyp`, `OUTCOME_CHOICES`, `buildReportWorkbook`, `reportFileName`, `reportWorkbookMeta` (như lượt 1, seam test) + kiểu `Effect`; không ai import ngoài file: `markName` (DR6-66, KNOWN, không bằng chứng mới) và 24 **kiểu** (mới: `Prefill`, `OpenedDraft`, `PolicyRead`, `PolicyValues` — xóa khi biên dịch, chi phí 0) | — |
| Code lặp do đợt sửa (đọc) | gói E | "chữ điền sẵn còn nguyên thì đọc theo ngày mở hộp" ×2 (`appointment-form.ts:60`, `policy-form.ts:89-90`); khung "khóa" ×2 (`DayLockNote` `OutcomeDialog.tsx:271-304` ↔ khối D7 `EditOutcomeDialog.tsx:150-176`); `showsNotice` / `last` mỗi section (KNOWN #630). Đều dưới ngưỡng ≥ 3 nơi, không đo được chi phí | — |
| Code lặp đã biết | `plain` (`appointment-form.ts:128`, `trash-view.ts:48`, biến thể `slug` `report-workbook.ts:224`) | KNOWN #543 / DR6-67, không bằng chứng mới | KNOWN |
| `pnpm lint:deps`, `pnpm codemap` | `common\baseline.md` | 0 vi phạm (315 module, 1 277 phụ thuộc); codemap khớp (`pnpm verify` xanh) | — |
| Dependency / bundle | `common\baseline.md`, bản dựng `E\dist-base` | Không thêm dependency. `index.js` 909 669 B (+17 727 so `b139d8a`, cả app; phần gói E không tách được nếu không có visualizer — G4); `exceljs` (929 569 B) vẫn chỉ nạp ở lần Xuất Excel đầu, `chart.js` nạp sẵn vì màn đầu là Tổng quan (như lượt 1) | — |
| Cỡ dòng | `node tools/size-report.mjs` (baseline), `E\list.log` | E: SP 7 374 (+342), test 3 843 (+298), 51 file (0) | — |

Đề xuất refactor: không có đề xuất mới (hai cặp lặp mới dưới ngưỡng; gộp khi có nơi thứ ba).

### 6.2 Hiệu năng

Máy Home PC `DESKTOP-KDURKJP` (i9-12900K), Node v24.20.0. Mốc so (plan §L2.6, Home PC): `common\perf\perf-ref-r1.json` (exe lượt 1 Home PC) qua bảng của `common\baseline.md`, và số lượt 1 Claude E **Home PC** (`raw/2026-10-15/home-pc/claude/E.md` §4b, cùng máy). Luật nhiễu: xấu hơn khi > 20 % **và** > 10 ms. Ngưỡng `docs/metrics/phase-6.md`: thao tác màn < 200 ms.

**Lúc đo (phiên làm tiếp, 15:39–15:50):** tải CPU ≈ 9 % ngay trước khi đo (`Win32_Processor.LoadPercentage`); không có `project2c.exe` nào chạy (không ai đang đo exe); song song: Codex ở `Project-2C-review-2` (tiến trình ChatGPT), các phiên Claude khác của Owner chạy nền; sáu server `serve-dist.mjs` của phiên đầu nhàn rỗi. Mỗi probe một lần, nối tiếp nhau.

**A. Node — hàm thuần mà màn gói E chạy** (`node p05-perf.mjs` = probe lượt 1 Home PC `p1-perf.mjs` chép sang, trên dữ liệu tải lượt 2; log `E\p05-perf.log`; hôm nay 12/10/2026; 1 481 KH sống, 10 255 lịch, 1 674 HĐ, 4 884 chuyển nhóm; trung vị (min–max)):

| Thao tác | n | Lượt 2 (`4217ed4`) | Lượt 1 Home PC (`8855345`, §4b) | So | ID |
|---|---:|---|---|---|---|
| `importBackup` | 1 | 852 ms | 816 ms | +4 % | — |
| Tổng quan, một lần Lọc · Toàn bộ, Ngày / Tuần / Tháng / Năm / Tùy chọn 3 tháng | 7 | 5,3 / 5,0 / 6,6 / 8,2 / 5,4 ms | 6,1 / 5,0 / 7,7 / 8,5 / 5,6 ms | ≈ | — |
| … góc nhìn Team / RE | 7 | 4,9–8,7 / 1,0–1,5 ms | 5,1–8,4 / 1,0–1,4 ms | ≈ | — |
| Báo cáo `reportRows` + `reportCells` mọi dòng, 5 kỳ · Toàn bộ / Team / RE | 7 | 5,2–6,9 / 3,7–4,9 / 2,9–3,9 ms | 5,1–7,2 / 3,8–5,0 / 3,1–4,0 ms | ≈ | — |
| Báo cáo `buildReportWorkbook` Năm · Toàn bộ (4 sheet) | 5 | 7,9 ms (6,9–215,5: lần đầu nạp `exceljs`) | 7,9 ms (7,0–216) | ≈ | — |
| Lịch hẹn `appointmentRows` Toàn bộ / Team / RE | 7 | 2,5 / 1,1 / 0,6 ms | 2,6 / 1,2 / 0,6 ms | ≈ | — |
| Lịch hẹn lọc kỳ + đếm / `monthGrid` / `yearGrid` / `dayBoard` / `appointmentsByRe` (Toàn bộ) | 7 | 0,6 / 0,7 / 0,3 / 0,7 / 0,7 ms | 0,6 / 0,8 / 0,3 / 0,6 / 0,7 ms | ≈ | — |
| Thùng rác `listTrash` (113 dòng; lượt 1: 117) | 7 | **21,3 ms** (19,8–33,3) | 43,0 ms (40,8–53,3) | **−51 %** (DR6-44) | — |
| Thùng rác đếm + lọc + tìm / `restoreView` mọi dòng | 7 | 0,1 / 0,3 ms | 0,1 / 0,4 ms | ≈ | — |
| Cài đặt → Dữ liệu `countRecords` | 7 | 4,9 ms | 4,9 ms | ≈ | — |

**B. Node — chi phí mỗi lần render của code mới trong hộp** (`node p15-hold-cost.mjs`, log `E\p15-hold-cost.log`; dữ liệu tải qua `openAppData`; hộp gọi mỗi phím):

| Code mới (PR) | Trên | Trung vị · p95 · max | Lượt 1 | ID |
|---|---|---|---|---|
| 6f: `outcomeLock` + `meetingDay` + `heldStage` (#616) | 1 072 cuộc gặp Đã gặp (1 / 7) | 0,124 · 0,337 · 2,753 ms | `outcomeLock` 0,04 ms | — |
| 6c: `meetingDay` + `heldStage` (#616) | như trên | 0,033 · 0,125 · 0,210 ms | — | — |
| 6f / 6h: `readScheduleDate` với `Prefill` (#634) | 2 000 lần | 0,001 · 0,001 · 0,167 ms | — | — |
| 8d: `openDraft` + `readPolicy` + `policyChange` (#634) | 1 000 HĐ đã phát hành | 0,004 · 0,008 · 0,710 ms | `readPolicy` 0,00 ms | — |
| 8a: `expectedCaseSize` (#634) | KH nhiều lịch nhất (37) | 0,002 · 0,003 · 0,050 ms | — | — |

Mọi số ≪ 16 ms / phím: code mới của đợt sửa không làm hộp chậm.

**C. Bản web ghim — thao tác màn của gói E** (`E\dist-real`: dựng từ worktree ghim, không ghim ngày, hôm nay 17/10/2026; Edge headless 1 440 × 900; dữ liệu tải nhập qua Cài đặt → Dữ liệu; đo từ thao tác tới lúc DOM có kết quả, dò bằng `MessageChannel`, không gồm vẽ; `node p08-run.mjs E\dist-real 4533 <tải>` → `p08-web-perf.mjs`, server con tự tắt; log `E\p08-web-perf.log`; `requests blocked (not 127.0.0.1) []`; so số web lượt 1 Home PC §4b):

| Thao tác | n | Lượt 2 | Lượt 1 Home PC (web) | Ngưỡng | ID |
|---|---:|---|---|---|---|
| Đọc backup (chọn file → hộp 10c) / Thay dữ liệu (bấm → hộp đóng) | 1 | 1 015 / 30 ms | — | — | — |
| Cài đặt: Dữ liệu → Thùng rác (`listTrash` + bảng, 113 dòng) | 6 | 78,3 ms (73,4–97,5) | — (exe lượt 2 `trash.open` 73 ms) | < 200 ✅ | — |
| Cài đặt: Thùng rác → Dữ liệu (`countRecords`) | 6 | 8,1 ms | — | ✅ | — |
| Thùng rác: Khôi phục… mở hộp / Khôi phục (lệnh + `listTrash` lại, hộp đóng) | 5 | 7,4 / 70,1 ms | — / 71,8 ms | ✅, ≈ | — |
| 6c: mở hộp / một phím ở Việc tiếp theo / Lưu Hủy (lệnh + đọc lại, hộp đóng) — kỳ Tuần | 5 | 8,9 / 0,6 / 87,8 ms | 7,4 / — / 88,9 ms | ✅ (mở +1,5 ms: dưới luật nhiễu) | — |
| 6f: mở hộp (9 cuộc gặp tháng 1, 4 bị khóa D7) / một phím ở ô Ngày cuộc hẹn (5) | 9 / 5 | 8,0 / 0,6 ms | mới | ✅ | — |
| 8d: mở hộp / một phím ở FYP phát hành (`policyChange`, khung Ảnh hưởng) | 5 | 6,1 / 0,4 ms | mới | ✅ | — |

**D. DR6-44 trên màn — có / không chỉ mục, theo cỡ Thùng rác** (p08 `trash-only`, 6 lần; log `E\p08-trash-p44.log`, `E\p08-trash-scale.log`). `E\dist-real-p44` = bản dựng ghim mà migration `0009_lookup_indexes.sql` thay bằng `SELECT 1;` (đột biến `P44` của `mut-list.mjs`, `build-dist.mjs` vá rồi trả nguyên byte, `git status --short after: ""`); kiểm bản dựng: `CREATE INDEX \`appointments_customer\`` có trong `dist-real\assets\index-BE768Ocs.js`, không có trong `dist-real-p44\assets\index-DMhSFYDk.js` (còn tên chỉ mục ở định nghĩa schema drizzle, không tạo gì). Dữ liệu lớn hơn dựng bằng lệnh của app qua `openAppData` (`p09-make-165.mjs`: +150 KH xóa; `p18-make-n.mjs 300|600`):

| Thùng rác | Có chỉ mục (ghim) | Bỏ 3 chỉ mục 0009 | Node `listTrash` (ghim) | ID |
|---|---|---|---|---|
| 113 dòng (dữ liệu tải, 15 KH xóa) | 83,1 ms (73,5–100,3) | 155,2 ms (129,4–188,7) | 21,3 ms | — |
| 263 dòng (+150 KH xóa = 165, số đo của PR #630 / gói A) | **136,7 ms** (131,1–181,3) | **475,9 ms** (460,3–497,4) — ×3,5 | 33,8 ms (`p09`) | — |
| 413 dòng (+300 KH xóa) | 172,3 ms (169,3–192,1) | — | 48,2 ms (`p18`) | CL2-E7 |
| 713 dòng (+600 KH xóa) | **268,5 ms** (265,7–297,5) > 200 | — | 73,1 ms (`p18`) | CL2-E7 |

Hành vi không đổi (`node p17-trash-same.mjs`, log `E\p17-trash-same.log`): 263 dòng, cả hai bản `["263 bản ghi",263,14]` (dòng đếm, số dòng sau "Hiện thêm", số nút Khôi phục tắt) và cùng `sha256(table text + button labels) a30e105f045b479d5e20ea4b6f4ca3bf6c8b53f2d48223db14347ac4528a3053`. Thời gian còn lại tăng theo số dòng: CL2-E7 (profile `p19`, Node có / không inspector `p20`, số câu SQL `p21`, một transaction đọc `p22`).

**E. Exe (không đo lại — `common\baseline.md`, probe `e2e/perf` của bước chuẩn bị, cùng máy):** mọi thao tác màn của gói E trong ngưỡng và không xấu hơn lượt 1: `overview.filter-year` / `-month` 15 / 15 ms (lượt 1 15 / 14), `reports.filter-year` / `-month` / `table-re` 9 / 10 / 18 ms (9 / 10 / 17), `appointments.period-*` 5–18 ms (8–17), `appointments.next-month` / `next-year` 99 / 106 ms (102 / 106; Năm − Tháng 7 ms ≤ 50), `trash.open` 73 ms (80), `trash.kind-appointments` 6 ms (6), `reports.export-excel` 27 ms (24). Sáu `reload.*` +62–67 ms và `app.open-data` (⚠️ của `baseline.md`) đã được gói B quy cho `quick_check` của DR6-06 (CL2-B7) — không thuộc gói E, không đo lại. Exe không đo ở Thùng rác lớn (cần thay `Project2C-data\` của bản chép exe; số bản web đủ cho CL2-E7, gói F đo exe theo plan).

**Kết luận hiệu năng gói E:** trên dữ liệu tải không thao tác nào vượt 200 ms và không có số nào xấu hơn lượt 1 cùng máy theo luật nhiễu; DR6-44 nhanh hơn trên màn (×1,9 ở 113 dòng, ×3,5 ở 263 dòng) mà nội dung màn không đổi; một phát hiện P: CL2-E7 (Thùng rác lớn dần, TR-6).

## 7. Bảng đếm mức × trục

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | | 0 |
| Low | | | CL2-E1* | (CL2-E1*) | | | CL2-E7 | | CL2-E4, CL2-E5 | CL2-E8 | 5 |
| Nit | | | CL2-E2 | | | | | | CL2-E6 | CL2-E3 | 3 |
| **Tổng** | 0 | 0 | 2 | 0 | 0 | 0 | 1 | 0 | 3 | 2 | **8** |

\* CL2-E1 gắn C + D, đếm một lần ở trục chính C. **8 phát hiện mới, 8 / 8 CONFIRMED** (chạy probe / đột biến / màn thật, lệnh và trích kết quả ở từng mục; riêng CL2-E7 phần "trên exe không DevTools có thể nhanh hơn" là PLAUSIBLE, số đo bản web là CONFIRMED), 0 PLAUSIBLE, 0 KNOWN có bằng chứng mới. Trục R (bảng R): **15 / 15 ĐÃ SỬA** (47, 48: ghi lệch đã biết) · 0 SỬA MỘT PHẦN · 0 CHƯA SỬA · 0 HỒI QUY. "Mới do đợt sửa": CL2-E1 (#616), CL2-E2 (#614 / #615), CL2-E3 (#630), CL2-E4 (#616), CL2-E5 (#634), CL2-E6 (#630); "có từ trước, lượt 1 bỏ sót": CL2-E7 (phần còn lại của DR6-44, đo màn theo cỡ Thùng rác), CL2-E8 (cùng loại DR6-35, chỗ của gói E). Phiên đầu ghi CL2-E1…E6; phiên làm tiếp thêm CL2-E7, CL2-E8.

## 8. Đã xét, không thấy

- **R — đã sửa.** Bảng R: 15 DR6 của gói E (01, 02, 04 phần màn; 38–48; 63) đều ĐÃ SỬA; 47, 48 là "ghi lệch đã biết": dòng có ở `nghiem-thu-v1.md` và khớp app. Đột biến "gỡ phần sửa" / áp lại: mục 9.2. Không HỒI QUY: e2e 12 spec gói E trên bản ghim 109 / 109 (`E\e2e-base.log`), cả bộ ở SHA ghim 227 / 227 (`baseline.md`); 84 đột biến lượt 1 áp lại: 78 bị giết (gồm L1-AV8 — lượt 1 sống, nay bị test của #644 giết), 2 tương đương sống như lượt 1 (L1-O2, L1-AV1), 4 bỏ qua vì dòng đã đổi (thay bằng N15, N16, N7, N6 trên code mới — bị giết). Biến thể còn hở: CL2-E1 (DR6-04), CL2-E2 (DR6-03 / E20 ở màn), CL2-E3 (DR6-43); test hở: CL2-E4, CL2-E5.
- **E — biên.** Giao thừa ở 5 hộp + biến thể chữ gõ tay (K3); nửa đêm thường (không đổi năm): cùng cơ chế `Prefill.on` / `opened.on`, chữ điền sẵn đọc theo ngày mở hộp — ngày mở và ngày lưu cùng năm nên không đổi kết quả (đọc code `appointment-form.ts:60`, `policy-form.ts:89-90`); dời ngày 6f sớm / muộn qua đổi nhóm (K7, W10); cuộc gặp giữ nhóm cùng ngày đổi nhóm (K5); giữ bởi cuộc gặp sau (K6); bản ghi giống nhau trong Thùng rác (K9); cuộc gặp trước ngày tạo KH: CL2-A1 (gói A, phần 6c ghi ở đó), không báo lại. 6c "Hẹn lần tiếp theo" khi RE mới ngoài góc nhìn (K4).
- **C — hợp đồng / mockup / nhãn.** Số khớp giữa Tổng quan ↔ Báo cáo ↔ Lịch hẹn ↔ Excel sau bàn giao, xóa / khôi phục, xuất / nhập (K2: 0 lệch ở 150 tổ hợp × 5 bước; K11: 0 / 1 170 ô); chữ mới của đợt sửa so `vi.ts` ↔ màn (`outcome.dayLock*`, `outcomeEdit.lockKept`, `policyForm.effect*`, `policyForm.metric.*`, `trash.restoreLabel.*`, `appointments.createdOutside`) theo nghĩa thường: đúng, trừ CL2-E1 (6f không nói hậu quả), CL2-E2 (E20). "FYP nộp" / "FYP phát hành" ở 8d là Σ của ô KPI "Case size" / "Doanh số" (`stats.ts:16-21`) — đúng nghĩa. 8b không có "khác FYP nộp" như mockup 8b. Lệch đã biết (#543 "nhóm sau N2" thay "N3 → N2" ở dòng bị chặn, #634 số HĐ của hai tháng) không có bằng chứng mới.
- **D — dữ liệu.** Mọi lệnh ghi của gói E qua `app.run` (10 chỗ, `git grep`), không `useDatabase` trong gói; khôi phục qua `restoreRow` → lệnh `restore…` (R63a–e giữ). Lưu 6f không sửa gì không đổi dữ liệu (K1, 7 503 cuộc gặp); xóa → khôi phục = như cũ trên số (K11); S3 = S2, S4 = S3 (K2). Ngoài CL2-E1, không thấy đường ghi sai.
- **G — guardrail AI.** Gói E không có file AI (`AppointmentAi.tsx`, `appointment-ai-view.ts`, `SettingsAi.tsx` thuộc gói C); code mới của đợt sửa không gửi gì ra AI. Không áp dụng.
- **S — ranh giới.** `git grep` `dangerouslySetInnerHTML|innerHTML|eval(|new Function|target=_blank|window.open|localStorage|sessionStorage` trên 37 file SP gói E: rỗng. `aria-describedby` dựng từ `kind` + ULID của bản ghi (`trash-blocked-<kind>-<id>`), không từ chữ người dùng; 113 / 113 id không trùng (K9). Tên file Excel, chặn file > 100 MB, escape tooltip chart không đổi từ lượt 1 (L1-W4, W5, W10 vẫn bị giết). Mọi probe trình duyệt: 0 request ra ngoài 127.0.0.1.
- **P — hiệu năng.** Mục 6.2: dữ liệu tải — Node (bảng A, B), bản web (C), exe ở `baseline.md` (E): không vượt ngưỡng, không xấu hơn lượt 1 cùng máy. Ngoài CL2-E7 (Thùng rác lớn dần), không thấy.
- **B — bloat.** Mục 6.1.
- **T — test.** Mục 9.2: 116 đột biến vitest (107 KILLED, 2 SỐNG có hệ quả → CL2-E4, 3 tương đương, 4 SKIP), 20 đột biến e2e (13 KILLED, 7 SỐNG → CL2-E4, CL2-E5, CL2-E6). Ngoài ba phát hiện đó, không thấy test giả xanh: test mới của đợt sửa dùng ngày ghim (`d(…)`, `TODAY`), e2e dùng `page.clock` cho TR-5.
- **A — trợ năng / i18n.** Tương phản chữ mới ≥ 6,17:1 (K13); nút Khôi phục có tên và mô tả (e2e + R43c / R43d bị giết); dòng khóa 6c / 6f `role="note"`; thông báo ngoài góc nhìn `role="status"`. Một dấu "." viết cứng mới sau link ở `OutcomeDialog.tsx:300` (DayLockNote) cùng loại DR6-37 (KNOWN, hoãn "sửa khi chạm file") — không có hậu quả mới. Mũi tên sắp `↕` 1,76:1 (KNOWN, Token G3 R4). Ô ngoài tháng `aria-hidden` (#156), chart không có bảng cho trình đọc màn hình (P8): KNOWN, không bằng chứng mới. Focus sau Escape / khi nút mở còn: về nút mở (K16). Ngoài CL2-E3, CL2-E8, không thấy.

## 9. Phụ lục

### 9.1 Probe, log, bản dựng (thư mục `C:\workspace\deep-review-1-6-r2\claude\E\`)

Mọi probe Node đọc repo ghim qua `hooks.mjs` (bộ nạp TS như `tools/load-data.mjs`; `P2C_REPO` trỏ bản `git archive 8855345` của gói A để chạy cùng probe trên code lượt 1) hoặc `hooks-ui.mjs` (bản lượt 1 Home PC, `@p2c/ui` thay bằng `r1\ui-stub.mjs`). Mọi probe trình duyệt dùng `browser.mjs` (Edge headless qua Playwright của repo; chặn mạng ngoài 127.0.0.1 bằng `--host-resolver-rules` + `route.abort` từ lần chạy đầu; `window.open` / clipboard thay bằng bản ghi) và bản dựng ngoài repo của `build-dist.mjs` do `serve-dist.mjs` phục vụ ở 127.0.0.1 (không bao giờ 4173). Không probe nào gọi dịch vụ AI, đọc key hay mở chatgpt.com.

| File | Việc | Log / kết quả | Dùng ở |
|---|---|---|---|
| `r1\*` | Probe lượt 1 Claude Home PC chép từ `C:\workspace\deep-review-1-6\claude\E\` (`p1-perf.mjs`, `p6-backfill.mjs`, `mutate.mjs` + `mutate-results.json`, `exports.mjs`, `contrast.mjs`, `hooks.mjs`, `ui-stub.mjs`…) | — | R (tái hiện), §6 |
| `list.mjs` | File gói E theo `classifyFile` của `tools/size-report-core.mjs` | `list.log` (51 file, 7 374 / 3 843 dòng) | §3 |
| — | `git diff --numstat` / diff `8855345..4217ed4` trên 51 file | `fix-numstat.log`, `fix-diff.patch` | §3 |
| `exports.mjs` | Nơi dùng mọi export của 37 file SP (`git grep -w` ở `HEAD`) | `exports.log` | §6.1 |
| `p01-dialog-vs-command.mjs` | Hộp 6f ↔ lệnh trên 7 503 cuộc gặp | `p01-dialog-vs-command.log` | K1 |
| `p02-handover-figures.mjs` | Chuỗi bàn giao S0…S4, số Tổng quan ↔ Báo cáo ↔ Lịch hẹn ↔ Excel | `p02-handover-figures.log` (0 lệch). `…run1-probe-bug.log`: lần chạy đầu so mảng ô Excel (ExcelJS bỏ ô trống cuối dòng — "—" của màn là ô trống theo thiết kế, `report-workbook.ts:26`, `:151`) với mảng màn có `null` → 820 "problems" giả ở các mốc sau hôm nay; sửa probe (ô thiếu = `null`) → 0, các số khác trùng hai lần chạy | K2 |
| `p03-newyear-backup.mjs` | Dữ liệu giao thừa (`newyear.p2cbackup`) bằng lệnh của app | `p03-newyear-backup.log` | K3 |
| `p04-web-newyear.mjs` | 6f / 6h / 8b / 8d / 8a / 6c gõ tay qua 31/12 23:58 → 01/01 00:01 (`page.clock`) | `p04-web-newyear.log`; trên đột biến `p04-web-newyear-R38{c,d,e}.log` (bản dựng `build-r38-real.log`) | K3, CL2-E5 |
| `p05-perf.mjs` | = `r1\p1-perf.mjs` trên dữ liệu tải lượt 2 | `p05-perf.log` | §6.2 A |
| `p06-trash-screen.mjs` | Hàm của màn Thùng rác trên 113 dòng + bản ghi trùng | `p06-trash-screen.log` | K9, CL2-E3, CL2-E2 |
| `p07-web-chains.mjs` | Chuỗi màn W2, W3, W4, W7, W8, W9, W10 | `p07-web-chains.log`, `p07-web-chains-w9-w10.log`, `p07-W3-on-R04g.log`; ảnh `shots\W2-…`, `W3-…`, `W8-…` | K4–K8, CL2-E1, CL2-E2, CL2-E4 |
| `p08-web-perf.mjs` (+ `p08-run.mjs`: server con, tự tắt — phiên làm tiếp) | Thao tác màn trên bản web; `trash-only` cho DR6-44. Phiên làm tiếp sửa probe: 6c ở kỳ Tuần, 6f trên năm sắp cũ trước (danh sách chỉ hiện 100 dòng), 6f đi qua các cuộc gặp tới khi có ô Ngày, 8d chọn HĐ đã phát hành, in `requests blocked` | `p08-web-perf.log`, `p08-trash-p44.log`, `p08-trash-scale.log` | §6.2 C, D; K14, K15 |
| `p09-make-165.mjs`, `p18-make-n.mjs` | Xóa thêm 150 / 300 / 600 KH bằng lệnh của app, xuất backup | `p09-make-165.log`, `p18-make-n.log`; `load-165.p2cbackup`, `load-del300.p2cbackup`, `load-del600.p2cbackup` | §6.2 D, K14 |
| `p10-rerun-r1.mjs` | Tái hiện lượt 1 (H·CL-E4, L·CL-E1, case size, DR6-01) | `p10-rerun-r1.log` | K10, bảng R |
| `p11-move-earlier.mjs` | Lệnh `editMeetingOutcome` dời ngày, bản ghim và `8855345` | `p11-move-earlier.log`, `.old.log` | K7, CL2-E1 |
| `p12-delete-restore-figures.mjs` | Xóa → khôi phục 130 bản ghi, 1 170 ô Báo cáo | `p12-delete-restore-figures.log` | K11 |
| `p13-contrast.mjs` | Tương phản chữ mới (`contrastOf`) | `p13-contrast.log` | K13 |
| `p15-hold-cost.mjs` | Chi phí mỗi render của code mới | `p15-hold-cost.log` | §6.2 B, K15 |
| `p16-n2-screen.mjs` | Ca W7 trên bản đột biến N2 và bản ghim | `p16-n2-screen.log`; ảnh `shots\p16-6c-later-met-4526.png`, `-4531.png` | CL2-E4 |
| `p17-trash-same.mjs` | Màn Thùng rác có / không chỉ mục: số dòng, nút tắt, sha256 | `p17-trash-same.log` | DR6-44 |
| `p19-trash-profile.mjs` | Profile CDP khi mở Thùng rác | `p19-trash-profile.log` | K14, CL2-E7 |
| `p20-node-inspector.mjs`, `p21-trash-statements.mjs`, `p22-trash-in-transaction.mjs` | `listTrash` trong Node: có / không inspector; số câu SQL; một transaction đọc (probe) | `p20-…log`, `p21-…log`, `p22-…log` | K14, CL2-E7 |
| `p23-focus-after-save.mjs` | Focus sau Lưu ở 7 hộp gói E | `p23-focus-after-save.log` | K16, CL2-E8 |
| `e2e-base.mjs`, `pw.config.mjs` | 12 spec e2e gói E trên bản ghim `dist-base` (cổng 4521) | `e2e-base.log` (`BASE GREEN — 0 failed / 109 passed`), `e2e-base.out`, `e2e-base-run.txt` | mục 2 |
| `mut.mjs`, `mut-list.mjs` | Đột biến vitest (mục 9.2) | `mut.log`, `mut-results.json`, `mut-run1.txt`, `mut-out\<id>.out` | mục 2, 9.2 |
| `e2e-mutants.mjs`, `build-dist.mjs` | Đột biến TSX: dựng ngoài repo, 12 spec e2e (cổng 4524) | `e2e-mutants.log`, `e2e-mutants-run.txt`, `mut-out\<id>.e2e.out`, `pw-results\` | mục 2, 9.2 |
| `dist-base`, `dist-real`, `dist-real-p44`, `dist-real-R38{c,d,e}`, `dist-<id>` | Bản dựng ngoài repo (ghim ngày 15/09/2026 + snapshot demo / không ghim; P44; đột biến) | `build-dist-real.txt`, `build-dist-real-p44.txt`, `build-r38-real.log`, `serve-452x.txt` | — |
| `e2e-full.mjs`, `hooks.mjs`, `browser.mjs`, `serve-dist.mjs` | Chép từ gói C / D lượt 2 (`e2e-full.mjs` không dùng ở gói E) | — | — |

### 9.2 Đột biến

**Cách chạy.** `mut.mjs`: từ chối chạy khi `git status --short` không rỗng; mỗi đột biến vá **một** file của worktree, chạy 15 file test gói E (`--bail=1`), sống thì chạy cả bộ; trả nguyên byte, so sha256 với `git show HEAD:<file>` trước / sau; dòng cuối `git status --short after: ""`. `e2e-mutants.mjs`: `build-dist.mjs` vá một file, `vite build` ra `dist-<id>` ngoài repo, trả nguyên byte (sha256 = HEAD), phục vụ ở 127.0.0.1:4524, chạy 12 spec e2e gói E (109 ca), dòng cuối `git status --short after: ""`.

| Nhóm | Số | KILLED | Sống | SKIP | Ghi chú |
|---|---:|---:|---|---:|---|
| Gỡ phần sửa, vitest (R01a, R04a–d, R38a, R38b, R39a, R40a, R41a, R41b, R43a, R63a–e) | 17 | 17 | — | 0 | test giết: bảng R |
| Biến thể mới trên code mới (N1–N13, N15, N16) | 15 | 12 | **N1, N2** (→ CL2-E4); N9 tương đương (8b chỉ mở cho HĐ chưa phát hành, `issuedFyp` = null) | 0 | N1, N2, N9 sống cả bộ `2898 passed (2898)` |
| Đột biến lượt 1 áp lại (L1-O1…O8, S1–S5, C1–C4, T1–T4, R1–R10, W1–W11, A1–A4, AV1–AV11, F1–F6, OF1–OF6, PF1–PF6, TV1–TV9) | 84 | 78 | L1-O2, L1-AV1 (tương đương như lượt 1, sống cả bộ) | 4 (L1-OF3, L1-PF3, L1-PF5, L1-PF6: dòng đã đổi → thay bằng N15, N6, N7, N16, đều bị giết) | L1-AV8 lượt 1 sống, nay bị test của #644 giết |
| Gỡ phần sửa / biến thể ở TSX, e2e (R01db, R02a, R04e, R04f, R04g, R38c, R38d, R38e, R40b, R41c, R42a, R43b–f, R45a, R46a, N1, N2) | 20 | 13 | **R04g, N1, N2** (→ CL2-E4), **R38c, R38d, R38e** (→ CL2-E5), **R43e** (→ CL2-E6) | 0 | test giết: `e2e-mutants.log`, bảng R |
| P44 (bỏ 3 chỉ mục 0009) | 1 | — | — | — | chỉ dựng để đo (mục 6.2 D) |

### 9.3 Ranh giới đọc, việc còn lại, cuối phiên

- **Ranh giới đọc (phiên đầu, ghi ngay lúc xảy ra, 14:5x):** khi chép công cụ, PowerShell coi `$E` và `$e` là **cùng một biến** (không phân biệt hoa / thường), nên lệnh `Get-ChildItem -LiteralPath $E -File` để kiểm bản chép đã liệt kê (không đệ quy) thư mục **lượt 1 của chính Claude trên máy này** `C:\workspace\deep-review-1-6\claude\E\` thay vì `…-r2\claude\E\`. Chỉ thấy tên file probe / log của chính Claude lượt 1 (`contrast.*`, `exports.*`, `mock-*.txt`, `p1…p7`, `mutate.*`, `serve.mjs`, `ui-stub.mjs`, `hooks.mjs`, `list.*`); không phải thư mục của bên khác, không mở / liệt kê `codex\`, `muse\`. Từ đó dùng tên biến khác nhau và chỉ `Test-Path` theo tên đầy đủ.
- **Phiên làm tiếp:** chỉ liệt kê (không đệ quy) thư mục của chính gói `…-r2\claude\E\` (Bước 0: "đọc hết file và thư mục `<bên>\{GÓI}\`"), `E\r1\`, `E\mut-out\`; mở `A.md`, `B.md`, `D.md` (chỉ dòng tìm) theo tên đầy đủ. Không mở / liệt kê / tìm trong `codex\`, `muse\`, và không tìm trên `C:\workspace\`, `deep-review-1-6\`, `deep-review-1-6-r2\`.
- **Server còn chạy:** sáu `serve-dist.mjs` của phiên đầu (127.0.0.1:4525 `dist-real`, 4526 `dist-base`, 4528–4530 `dist-real-R38c|d|e`, 4531 `dist-N2`; chỉ phục vụ file tĩnh ngoài repo) — lệnh `Stop-Process` của phiên làm tiếp bị bộ lọc quyền từ chối, nên để nguyên; Owner tắt được bằng cách đóng các tiến trình `node … serve-dist.mjs`. Probe của phiên làm tiếp chạy server con và tự tắt (`p08-run.mjs`, `p17`, `p19`, `p23`).
- **Không làm:** đo exe ở Thùng rác lớn (gói F); chạy lại toàn bộ `pnpm e2e` (kết quả ở `baseline.md`).
- **Cuối phiên (16:01):** `git rev-parse HEAD` = `4217ed4cd3300af1d63aa61db9eb13902fe75f16`; `git status --short` rỗng (như đầu phiên). Giờ xong: 2026-10-17 16:01 (+07, giờ máy).
- **Sau XONG (16:15, phiên đầu quay lại khi hạn mức hồi):** phiên đầu đã tắt cả sáu server `serve-dist.mjs` (4525, 4526, 4528–4531 — đều là tác vụ nền của nó), sau đó không còn cổng 45xx nào mở. Không đổi gì khác trong báo cáo, trong `E\` hay trong repo: `git rev-parse HEAD` = `4217ed4cd3300af1d63aa61db9eb13902fe75f16`, `git status --short` rỗng.
