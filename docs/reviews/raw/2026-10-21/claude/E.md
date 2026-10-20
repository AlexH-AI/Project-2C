XONG — claude gói E lượt 3, 2026-10-20 23:35

# Deep review Phase 1–6, lượt 3 — Claude, gói E (Lịch hẹn, chỉ số, quản lý)

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên / ID | claude / `CL3` |
| Gói | E — Lịch hẹn, chỉ số, quản lý (`routes/{appointments,overview,reports}/**`, `routes/{Overview,Settings*,RestoreDialog,FilterBar}.tsx` trừ `SettingsAi.tsx`, `routes/{trash-view,period-labels,applied-filter}.ts`, Hợp đồng `routes/customers/{CustomerPolicies,PolicyDialogs,policy-form}.*`) |
| SHA đầu phiên | `119e2e45cbce54d8a3943757bd826a7f1e9b694f` (`git rev-parse HEAD`) |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 2026-10-20 22:10 (máy `DESKTOP-KDURKJP`, Home PC) |
| Công cụ / model / mức suy luận | Claude Code (app desktop, tab Code), model `claude-opus-5-5` (Opus 5.5), effort `max` (đọc từ metadata phiên) |
| Ultracode | **tắt** (tin nhắn mở phiên không bật) → làm hết trong phiên chính, không subagent / Workflow |
| Bước 0 | `E` là một chữ hợp lệ; `claude\E.md` chưa có → làm mới; `A.md`–`D.md` có đủ, dòng đầu đều `XONG` (A 19:20, B 20:12, C 21:16, D 22:08) |
| Node | v24.20.0 |

> Tiến độ (ghi dần): 22:10 bước 0 xong. Đã đọc `prompt-claude.md`, `plan.md` (§1–§12 lướt, §L2, §L3 đủ), `known.md` (đủ), `fixes.md` (#652/#666, #653/#667, #654/#669, #655/#693, #656/#674, #662/#707/#709/#710 đủ; phần khác lướt), `baseline.md` (đủ), tổng hợp lượt 2 (đủ), báo cáo gốc lượt 2 Claude E (đủ) và Codex E (đủ), lượt 1 gói E (mục 4b, 6 của Claude laptop; tiêu đề phát hiện của mọi bên), `claude\A.md` (mục 1–2, danh sách CL3-A1…A29), `B.md` (mục 2, 4, 5), `C.md` (danh sách phát hiện), `D.md` (mục 1–5). Danh sách gói E: `E\list.mjs` → `E\list.log` (51 file, **7 756 SP / 4 146 test** = plan §L3.3). Diff sửa: `E\fix-numstat.log`, `E\fix-diff.patch` (1 565 dòng): SP **+540 / −158 ở 8 file**, test **+308 / −5 ở 2 file** (= plan §L3.3); 4 commit chạm gói: `d6c2350` (#666), `d0a97ec` (#667), `f9fb70f` (#693), `6526793` (#710). Đang đọc code gói E và dựng công cụ (chép từ `claude\D\`: `build-dist.mjs`, `serve-dist.mjs`, `pw.config.mjs`, `e2e-mut.mjs`, `mut-list.mjs`, `mutant-config.mjs`, `mutjs.mjs` — không ghi vào repo).

> 22:16–22:37: công cụ ở `E\` (không ghi vào repo): `build-dist.mjs` (Vite `build()` của worktree ghim + `load` hook phục vụ bản đột biến, `--outDir` ngoài repo), `serve-dist.mjs`, `pw.config.mjs` (cổng 4481–4489, không 4173), `e2e-mut.mjs`, `mutjs.mjs` + `mutant-config.mjs` (vitest qua `load` hook), `mut-list.mjs` (44 đột biến), `browser.mjs` / `hooks.mjs` (chép `claude\D\`). Bản dựng `E\dist-base` (neo 15/09/2026 + ảnh chụp demo, như e2e) và `E\dist-real` (không biến môi trường), 22:32, `git status --short after: ""` (`build-base.log`, `build-real.log`). Đối chứng: 4 spec gói E (`appointment-outcome`, `appointments`, `customer-policies`, `trash`) trên `dist-base` **70 / 70 xanh** (`e2e-base.out`); hai file test vitest của gói E 102 / 102 qua `mutant-config.mjs`. 22:37 vitest đột biến: **20 / 20 KILLED** (`mutjs.log`). 22:38–22:55 `e2e-mut.mjs` (chạy nền): 26 đột biến TSX — 19 KILLED, 7 SỐNG; cả bộ e2e cho R04g-tsx và cho bản ghim (`e2e-mut.log`). 22:39–23:21 probe K1–K11 (mục 4), đo (mục 6.2), Bloat (mục 6.1); từ 23:23 ghi mục 3, 6–9. (Giờ ở đây lấy theo giờ ghi của từng log; bản ghi tiến độ trước của đoạn này ghi nhầm giờ.)

## 2. Bảng R (10 DR6 của gói E)

**Cách kiểm.** (1) Tái hiện lượt 2: probe lượt 2 của chính Claude (`r2\claude\E\p07-web-chains.mjs` W3 / W8, `p23-focus-after-save.mjs`) chép sang `E\` (`r2-p07-web-chains.mjs`, `r2-p23-focus-after-save.mjs`; chỉ đổi thư mục ảnh), chạy trên bản web ghim `E\dist-base` (127.0.0.1:4481); ca của lượt 2 gói A / Codex E dựng lại qua lớp dữ liệu của app. (2) Gỡ phần sửa, **không ghi vào repo**: vitest qua `E\mutant-config.mjs` (`load` hook phục vụ bản đột biến; `E\mutjs.mjs`, log `E\mutjs.log`); TSX qua bản dựng ngoài repo `E\build-dist.mjs` rồi chạy e2e của repo trên bản đó (`E\e2e-mut.mjs`, cổng 4482–4489, log `E\e2e-mut.log`); mỗi đợt in `git status --short after: ""`. Đối chứng: 4 spec gói E trên bản ghim 70 / 70 (`E\e2e-base.out`), vitest 102 / 102. (3) Biến thể: mục 4.

| DR6 | Issue → PR | Kết luận | Bằng chứng (tái hiện lượt 2 nay ra gì; test nào đỏ khi gỡ phần sửa) | Biến thể / ghi chú |
|---|---|---|---|---|
| 68 (M; phần E: hộp 6c / 6f trước ngày tạo KH) | #652 → #666 (`d6c2350`) | **ĐÃ SỬA** | Phần lệnh, luật nhập, khôi phục: gói A ĐÃ SỬA (`claude\A.md`, R68a–d KILLED). Phần màn: e2e `appointment-outcome.spec.ts:280` (KH nhập hôm nay, lịch trước ngày tạo → 6c khóa ở nhóm tạo KH, Lưu "Giữ N3") xanh trên bản ghim. Gỡ sửa: **R68e** (`meetingDay` như `4217ed4`: trước ngày tạo không có nhóm) → KILLED vitest `outcome-form.test.ts > meetingDay > starts a meeting before the customer was created from its first stage, held there (DR-43)` và e2e `:280`; **R68f** (`DayLockNote` lại kể việc tạo KH là một lần đổi nhóm "— → N3") → KILLED e2e `:280` | Lỗ test của nhánh "nhóm tạo KH" khi KH đã đổi nhóm sau ngày tạo: CL3-A13 (gói A, không báo lại). Luật viết ba nơi: CL3-A26 (gói A) |
| 70 | #653 → #667 (`d0a97ec`) | **ĐÃ SỬA** | Tái hiện CL2-E1 (W8 lượt 2, `r2-p07` W8 → `r2-p07-W3-W8-base.log`): KH N4 → chuyển tay N3 10/09 → cuộc gặp 15/09 N3 → N2 → 6f gõ ngày 5/9 → "N4 🔒" + dòng khóa, và nay khung **"Khi lưu · Nhóm KH N2 → về N3 (hủy chuyển nhóm 15/09) · RF bớt 1 (N3 → N2 tính RF)"** (`p05-6f-undone.log`; lượt 2: không có khung). Lưu ra đúng câu đã hiện (chi tiết "Giữ N4", hồ sơ "N3 từ 10/09/2026"). Gỡ sửa: **R70a** (bỏ khung) và **R70d** (hỏi `undoneMove` bằng nhóm đang gõ, không bằng nhóm bị giữ) → KILLED e2e `appointment-outcome.spec.ts:322`; **R70b** (chỉ trạng thái khác mới rút), **R70c** (bỏ điều kiện khóa D7) → KILLED vitest `undoneMove (DR6-70)` | Biến thể trên màn (`p05` W8b): khung hiện khi Hủy, khi tự chọn "giữ nguyên", khi dời qua lần đổi nhóm; không hiện khi chọn N1 (chuyển nhóm mới thay), khi dời ngày mà vẫn cùng chuyển nhóm (12/09), khi đổi lại về 15/09 — đúng ACCEPTED (Owner 17/10, `known.md`) |
| 83 (phần E: đích dự phòng của Lịch hẹn, Hợp đồng, Thùng rác) | #655 → #693 (`f9fb70f`) | **ĐÃ SỬA** | Tái hiện CL2-E8 (`r2-p23-focus-after-save.mjs` → `r2-p23-focus-after-save.log`): 6c Lưu → `h2 "15/09/2026 · Bùi Bảo Hạnh"`; 6g Xóa → `aside "Chi tiết lịch hẹn"` (khung trống); Khôi phục → dòng 11e; 6h → `h2 "22/09/2026 · …"`; 8a, 8b → `h2#customer-policies "Hợp đồng"` (lượt 2: cả 6 ca `BODY`); đối chứng nút mở còn (Escape, 6f, 6e) vẫn về nút. Gỡ sửa (đều KILLED e2e): **R83g** (Lịch hẹn không đặt đích) → `appointment-outcome.spec.ts:399`, `:448`, `appointments.spec.ts:750`; **R83h** (bỏ dòng "ngoài góc nhìn") → `appointments.spec.ts:750`; **R83i** (khung trống không sticky như `4217ed4`) → `:399`; **R83j** (tiêu đề chi tiết không nhận focus) → `:399`; **R83k** (tiêu đề Hợp đồng không là đích) → `customer-policies.spec.ts:209`; **R83l** (Thùng rác không đặt đích) → `trash.spec.ts:265` | 6e Dời lịch về nút "Dời lịch" nay của lịch mới: KNOWN (ghi chú #693, K16), không bằng chứng mới. Phần `Dialog` / 7a / 7d: gói D ĐÃ SỬA |
| 84 (phần E: màn Dọn sạch 11h–11j) | #662 → #707, #709, #710 (`6526793`) | **ĐÃ SỬA** | Đường lỗi lượt 2 (CL2-E7: Thùng rác chỉ lớn lên, mở chậm tuyến tính, TR-6 không dọn) nay có lối ra trên màn: K1–K4 (mục 4) — hộp đếm đúng lệnh, dọn qua `AppData.purgeTrash`, 11j, focus, D7 / D8, "Đang dọn…" không đóng được, bộ lọc không ảnh hưởng; số Tổng quan / Báo cáo / Excel / Lịch hẹn 0 khác ở 2 cỡ Thùng rác. Số đo: mục 6.2. Gỡ sửa: vitest **R84a** (`canPurge` bật cả khi mọi dòng được giữ), **R84c** / **R84d** (biên 1 000), **R84n** (tiêu đề hộp bỏ bản ghi giữ lại), **R84o** (thông báo bỏ tên backup), **R84p** (bỏ số giữ lại), **R84q** (D7 đọc thành lỗi khác), **R84r** (giữ loại bằng 0) → KILLED `trash-view.test.ts` (D1, D2 / D13, D5, D7–D9, D12, TR-11); e2e **R84b** (nút không bao giờ tắt), **R84k** (nút có cả khi Thùng rác trống), **R84l** (thông báo không nhận focus khi còn dòng giữ lại), **R84m** (bỏ lý do giữ lại) → KILLED `trash.spec.ts:495`, `:88` | **6 đột biến TSX sống** (bộ lọc, chữ xác nhận, lúc đang dọn) → **CL3-E3** (test hở). Phần lệnh: gói A; hàng đợi: gói B; đo exe: gói F |
| 91 | #653 → #667 | **SỬA MỘT PHẦN** | Áp lại đột biến sống lượt 2: **N1**, **N2**, **R04g** (ở hàm `editedDay` mới) → KILLED vitest `outcome-form.test.ts` (`meetingDay` N1 / N2, `editedDay (6f) … (E19, R04g)`); **R38c** (6f), **R38d** (6h) → KILLED e2e `appointment-outcome.spec.ts:478`, `:492`; **R38e** (8a–8d) → KILLED `customer-policies.spec.ts:130`; **R43e** (bỏ `headerHidden`) → KILLED `trash.spec.ts:114` (bề rộng tiêu đề ≤ 1 px). **Còn hở:** R04g của lượt 2 là đột biến ở **hộp 6f** ("6f không đi từ nhóm đã giữ"); #667 chuyển phép tính sang `editedDay` có test, nhưng chỗ nối của hộp không test nào giữ: **R04g-tsx** (hộp gọi `editedDay` không mang nhóm đã giữ) **sống** cả 17 ca `appointment-outcome.spec.ts` + E18, và hộp 6f của ca E19 hiện lại đúng triệu chứng lượt 2 | → **CL3-E4** (Liên quan: DR6-91) |
| 93 | #653 → #667 | **ĐÃ SỬA** | Tái hiện CX2-E1 / W3 lượt 2 (`r2-p07` W3): dòng Thùng rác của cuộc gặp giữ nhóm nay `15/09/2026 · Đã gặp · nhóm sau N3 · không đổi nhóm KH` (lượt 2: chỉ "15/09/2026 · Đã gặp"), hộp "Kết quả Đã gặp · nhóm sau N3 · Không đổi nhóm KH". Gỡ sửa: **R93a** (về như `4217ed4`) → KILLED vitest `recordDetail … (E18, E19)` và e2e `trash.spec.ts:289` | Biến thể **R93b** (dòng bị chặn cũng ghi "không đổi nhóm KH") → KILLED `… a blocked met appointment …` |
| 94 | #653 → #667 | **ĐÃ SỬA** | Tái hiện CL2-E2 (W3 E20): dòng bị chặn nay "Nhóm KH đã đổi ngày 15/09/2026, **ghi sau lúc xóa** cuộc hẹn này — không ghi chuyển nhóm lùi ngày (D10)." cho lịch 15/09/2026 (lượt 2: "sau ngày cuộc hẹn này"); mô tả của nút khôi phục cùng câu. Gỡ sửa: **R94a** → KILLED vitest (2 ca E20, gồm ca "as the trash finds it" trên DB thật) | Biến thể **R94b** (mọi `TRANSITION_BEFORE_LATEST` của lịch hẹn dùng câu "ghi sau lúc xóa") → KILLED `E6, E8 …`; ca E6 khác ngày vẫn "sau ngày cuộc hẹn" (đúng 11d) |
| 95 | #653 → #667 (mockup) | **ĐÃ SỬA** (sửa bằng tài liệu) | `docs/design/mockups/trash.html:268` nay: "E7 — KH đã ở N2 do chuyển tay ngày 02/10/2026, ghi sau khi xóa (chuyển tay ngày sau thì chặn như E6)" = spec E7 (`phase-6-hoan-thien.md:151`) = NT-TR-09 (`nghiem-thu-v1.md:307`, "Ngày chuyển = ngày cuộc hẹn"). Khớp app: K6 (mục 4) — chuyển tay cùng ngày ghi sau lúc xóa → khôi phục được, hộp "Nhóm KH giữ N2" + câu `trash.restore.keptBody`; chuyển tay ngày sau → chặn câu E6 | — |
| 99 | #653 → #667 | **ĐÃ SỬA** | Tái hiện CL2-E3 (hai HĐ cùng KH cùng ngày nộp khác FYP, xóa cả hai): nay "Khôi phục HĐ nộp 10/09/2026 · 24.000.000 ₫ của KH …" / "· 30.000.000 ₫ …" (`p04-same-day-labels.log`; lượt 2: cùng tên). Gỡ sửa: **R99a** (nhãn như `4217ed4`) → KILLED vitest `restoreLabel …` (2 ca) | Còn trùng tên ở thẻ Hợp đồng (**CL3-E1**) và giữa hai dòng khác trạng thái ở Thùng rác (**CL3-E2**) |
| 103 (phần E: khóa D7 của 6f) | #653 → #667 | **ĐÃ SỬA** | `outcomeLock` gọi `meetingKeepingMove` (`outcome-form.ts:80`), cùng hàm với lệnh và seed (gói A `p26`: 0 lệch). Gỡ sửa: **R103e** (`outcomeLock` không xét cuộc gặp giữ nhóm sau) → KILLED vitest `outcomeLock > is locked by a later meeting …` và `locks just what the command refuses to take back, on the demo data with its trash (DR6-103)`. Hành vi không đổi: K7 (mục 4) — khóa 6f = lỗi lệnh xóa trên mọi cuộc gặp có chuyển nhóm của dữ liệu tải | Test hở thứ tự `liveAppointmentsOf`: CL3-A20 (gói A) |

Kết luận bảng R: **9 ĐÃ SỬA** (95 sửa bằng tài liệu) · **1 SỬA MỘT PHẦN** (91) · 0 CHƯA SỬA · 0 HỒI QUY. Đột biến của bảng R: 20 vitest (20 KILLED) + 26 TSX (19 KILLED, 7 SỐNG: R04g-tsx → CL3-E4; R84e–j → CL3-E3).

## 3. Phạm vi đã đọc

**Danh sách gói E** (`E\list.mjs`, luật `classifyFile` của `tools/size-report-core.mjs` như `claude\D\list.mjs`; log `E\list.log`): 51 file (37 SP, 14 test), **7 756 dòng SP / 4 146 dòng test** (= plan §L3.3; lượt 2: 7 374 / 3 843).

**Diff sửa của gói E** (`git diff --numstat 4217ed4 119e2e4` trên 51 file, `E\fix-numstat.log`; bản đầy đủ `E\fix-diff.patch`, 1 565 dòng): SP **+540 / −158 ở 8 file**, test **+308 / −5 ở 2 file** (= plan §L3.3); 4 commit chạm gói: `d6c2350` (#666, DR6-68), `d0a97ec` (#667, DR6-70, 91, 93, 94, 95, 99, 103), `f9fb70f` (#693, DR6-83), `6526793` (#710, DR6-84). Đọc từng hunk: `SettingsTrash.tsx` (+175 / −29), `trash-view.ts` (+157 / −18) + `trash-view.test.ts` (+177 / −1), `AppointmentsScreen.tsx` (+74 / −43), `DeleteAppointmentDialog.tsx` (+62 / −35), `outcome-form.ts` (+47 / −19) + `outcome-form.test.ts` (+131 / −4), `EditOutcomeDialog.tsx` (+11 / −10), `CustomerPolicies.tsx` (+10 / −1), `OutcomeDialog.tsx` (+4 / −3).

**Đọc hết ở `119e2e4`** (file đổi và file nối thẳng với chúng): `SettingsTrash.tsx` (392), `trash-view.ts` (611), `RestoreDialog.tsx` (65), `Settings.tsx` (187), `SettingsDataFile.tsx` (135), `SettingsBackup.tsx` (294); `appointments/` — `AppointmentsScreen.tsx` (683), `OutcomeDialog.tsx` (341), `EditOutcomeDialog.tsx` (264), `DeleteAppointmentDialog.tsx` (127), `outcome-form.ts` (230); `customers/` — `CustomerPolicies.tsx` (118), `PolicyDialogs.tsx` (340). Test: `outcome-form.test.ts`, `trash-view.test.ts` — phần đổi và các ca mà đột biến nhắm.

**Đọc lướt** (không đổi từ `4217ed4`, lượt 1–2 đã đọc hết; lượt này tìm chỗ nối với dọn sạch / đợt sửa, và chạy qua probe K1, `r2-p05`): `appointments/` — `AppointmentDialog.tsx` (450), `MetFields.tsx` (169), `RescheduleDialog.tsx` (60), `RescheduleFields.tsx` (142), `YearGrid.tsx` (142), `appointment-form.ts` (142), `appointments-view.ts` (471); `customers/policy-form.ts` (239); `overview/` — `OverviewTiles.tsx`, `StageBlock.tsx`, `TeamCompare.tsx`, `overview-view.ts`, `stage-chart.ts`, `stage-view.ts`, `team-compare-view.ts`; `reports/` — `ReportExport.tsx`, `ReportTable.tsx`, `ReportsScreen.tsx`, `report-workbook.ts`, `reports-view.ts`; `Overview.tsx`, `FilterBar.tsx`, `applied-filter.ts`, `period-labels.ts`. 12 file test không đổi: không đọc lại (xanh trong `pnpm verify` của `baseline.md`).

**Chỗ gói khác nối vào (chỉ chỗ nối):** `apps/desktop/src/data/app-data.ts:397-399` (`inTurn`: chờ lượt, `backUp()`), `:485-487` (`purgeTrash` qua `inTurn`), `AppDataContext.tsx` (`useQuery`, `useTables`); `packages/db/src/purge.ts` (211 dòng: `KEPT_APPOINTMENTS` :72, `KEPT_PEOPLE` :86, `KEPT_TEAMS` :96, `previewPurge` :132, `purgeTrash` :149-171 — tắt khóa ngoại, `PRAGMA foreign_key_check` trước COMMIT, `VACUUM` ngoài transaction —, `keptRecords` :179); `apps/desktop/src/data/ai-analysis.ts:177`, `:235` và `packages/db/src/ai-analyses.ts:108` (kết quả AI về khi KH đã bị dọn); `packages/ui/src/Dialog.tsx`, `dialog-focus.ts` (Escape lần 2, `focusBack`); `shell/routes.ts:13`, `:39-60`, `shell/AppShell.tsx:54` (`resolveScope`). E2E: `trash.spec.ts`, `appointment-outcome.spec.ts`, `customer-policies.spec.ts` (đủ), `appointments.spec.ts` (ca quanh :750), `dialog-keyboard.spec.ts` (ca quanh :135), `e2e/support.ts` (`asExe`).

**Tài liệu:** spec `docs/design/phase-6-hoan-thien.md` §4.1–§4.2 (TR-1…TR-13, D1–D13, E6–E20); mockup `docs/design/mockups/trash.html` 11a–11j; `docs/testing/nghiem-thu-v1.md` (NT-TR-09, :307); `common\{prompt-claude.md, plan.md, known.md, fixes.md, baseline.md}` (như mục 1); tổng hợp lượt 2; báo cáo gốc lượt 2 Claude E, Codex E (`docs/reviews/raw/2026-10-17/`); lượt 1 gói E (`docs/reviews/raw/2026-10-15/`); `claude\A.md`–`D.md` (như mục 1) để không báo trùng.

## 4. Kịch bản mới đã thử

Bản web cho màn: `E\dist-base` (127.0.0.1:4481). Mọi probe trình duyệt: Edge headless qua Playwright của repo (`E\browser.mjs`), mạng ngoài 127.0.0.1 bị chặn từ lần chạy đầu (`--host-resolver-rules` + `route.abort`), `window.open` / clipboard thay bằng bản ghi; mọi log ghi `requests blocked (not 127.0.0.1) []`. Probe Node đi qua lớp dữ liệu của app (`openAppData`, `readBackup` + `importBackup` như Cài đặt → Dữ liệu, `app.purgeTrash()`, `app.tables()`, hàm view của màn); lệnh `db` gọi thẳng chỉ để dựng dữ liệu (xóa KH bằng lệnh xóa) hoặc đọc `listTrash` / `previewPurge` như màn đọc.

| # | Kịch bản (các bước, dữ liệu) | Kết quả | ID |
|---|---|---|---|
| K1 | Dọn sạch như màn chạy (`AppData.purgeTrash`, bản web) trên dữ liệu tải (113 bản ghi) và trên Thùng rác lớn (dữ liệu tải + 1 200 KH xóa bằng lệnh xóa = 1 313 bản ghi); mỗi bước so **mọi số của màn gói E** ở 8 kỳ (Ngày, Tuần, Tháng 10, Tháng 9, Tháng 1, Năm 2026, Năm 2025, Tùy chọn 15/08–30/11) × 9 góc nhìn (Toàn bộ, 4 team, 4 RE): ô KPI + ô nhóm Tổng quan, So sánh team, Báo cáo Tổng hợp / Theo team / Theo RE / Theo mốc, workbook Excel từng ô, dòng đếm + danh sách id của màn Lịch hẹn; cùng 6 phép kiểm chéo của r2 p02 (C1–C6); rồi xuất → nhập lại (`p01-purge-figures.mjs`) | **0 khác** trước / sau dọn và sau xuất → nhập lại (cả hai cỡ); `app.tables()` trùng từng dòng, đúng thứ tự (kiểm cả việc `VACUUM` có đổi thứ tự dòng hay không: không); `countRecords` trùng; 0 lệch chéo. Hộp 11i: "113 bản ghi · mọi loại, không theo bộ lọc", "KH 15 — kèm 83 lịch hẹn · 5 HĐ · 49 ghi chú KYC · 1 phân tích AI · Lịch hẹn 76 · HĐ 18 · Nhân sự 3 · Team 1" (= số trên exe ở `baseline.md`), số ở tiêu đề = số dòng màn (113 / 1 313); 11j đúng mẫu mockup; 1 313 bản ghi có câu nhắc TR-13 | không thấy |
| K2 | Màn, file nhập mang 999 HĐ đã xóa + một lịch Dời lịch đã xóa mà lịch dời từ nó còn (1 000 bản ghi, như e2e D12); đặt bộ lọc "Lịch hẹn" + ô tìm không khớp gì rồi mới dọn (TR-11 "không theo loại / ô tìm đang chọn") (`p02-purge-screen.mjs` A) | Câu nhắc TR-13 vẫn hiện khi lọc (đếm mọi bản ghi, đúng "số ở đầu màn"); nút Dọn sạch bật; hộp đếm đủ "HĐ 999", "1.000 bản ghi · mọi loại, không theo bộ lọc"; dọn xong "Xóa hẳn 999 HĐ. Giữ lại 1 bản ghi còn được dùng." nhận focus, nút tắt, "1 bản ghi", câu nhắc mất, số đếm bộ lọc cập nhật; dòng giữ lại có lý do "Giữ lại khi dọn: lịch 24/09/2025 10:00 dời từ lịch này." | không thấy |
| K3 | Gõ chữ xác nhận theo mọi cách (chữ thường, dấu cách đầu / cuối / đôi, NFD do IME, NBSP, ZWSP, tab) ở hộp Dọn sạch và hộp Nạp lại (`p02` A) | Cả hai hộp như nhau: chỉ đúng chữ (NFC hoặc NFD) bật nút; mọi biến thể khác giữ nút tắt — đúng D1 "nút xác nhận tắt tới khi gõ đúng DỌN SẠCH" và cùng luật Nạp lại (review R4) | không thấy |
| K4 | Bản exe giả (IPC giả của e2e, backup giữ / lỗi theo ý): D8 backup lỗi; D7 lần lưu trước lỗi; dọn khi backup đang giữ: Hủy / ô chữ / Escape 1–3 lần (mỗi lần chờ 400 ms), bấm ngoài hộp; so hộp Nạp lại cùng cách (`p02` B, `p03-running-escape.mjs`) | D8: "Chưa dọn được Thùng rác. Dữ liệu không bị đổi." (`role="alert"`), Thùng rác giữ nguyên, focus về nút Dọn sạch. D7: câu D7, 0 backup. Đang dọn: Hủy, ô chữ, nút xác nhận tắt; hộp ở lại qua 3 lần Escape (lần 2 trở đi trình duyệt tự đóng, `Dialog` mở lại — DR-58), y như Nạp lại; thả backup → 11j có "Backup: Project2C-data\backups\project2c-s00000001-20260915-0930.db", focus ở thông báo. (Lần chạy đầu của `p02` đọc trạng thái ngay sau Escape lần 2, lúc trình duyệt đã đóng mà sự kiện `close` chưa mở lại: lỗi của probe, `p03` chờ rồi đọc) | không thấy |
| K5 | Thẻ Hợp đồng của hồ sơ KH có hai HĐ nộp cùng ngày (24 tr, 30 tr); rồi HĐ thứ ba cùng ngày cùng FYP 24 tr đã phát hành; cùng KH hai lịch 14/09 10:00 (một Hủy, một Không đến); xóa cả năm bản ghi; đọc tên nút ở thẻ Hợp đồng và ở Thùng rác (`p04-same-day-labels.mjs`) | Thẻ Hợp đồng: hai nút "Phát hành HĐ nộp 10/09/2026", hai nút "Sửa HĐ nộp 10/09/2026" cho hai dòng chữ khác nhau ("Nộp 10/09 · 24 tr" / "· 30 tr"). Thùng rác: tên khôi phục có FYP (DR6-99 đúng), nhưng hai dòng khác trạng thái vẫn cùng tên: "Khôi phục lịch hẹn 14/09/2026 10:00 của KH …" cho "· Không đến" / "· Hủy"; "Khôi phục HĐ nộp 10/09/2026 · 24.000.000 ₫ của KH …" cho "Đã nộp" / "Đã phát hành" | CL3-E1, CL3-E2 |
| K6 | E7 như mockup 11c mới (DR6-95), qua lớp dữ liệu + hàm của màn Thùng rác: cuộc gặp 02/10 N3 → N2, xóa; chuyển tay N3 → N2 **cùng ngày 02/10** sau lúc xóa → dòng, hộp 11c, khôi phục; biến thể chuyển tay **10/10** (ví dụ cũ của 11c) (`p07-e7.mjs`) | E7: dòng "Nhóm KH giữ N2", hộp "Nhóm KH giữ N2 — KH đã ở nhóm sau cuộc gặp nên không ghi thêm chuyển nhóm; cuộc hẹn này không tính RF.", khôi phục được, KH N2, chỉ còn chuyển nhóm tay. 10/10: chặn "Nhóm KH đã đổi ngày 10/10/2026, sau ngày cuộc hẹn này — …" (E6) | không thấy |
| K7 | Hộp 6f ↔ lệnh trên **mọi** cuộc gặp Đã gặp của dữ liệu tải (7 503; 3 254 có chuyển nhóm, 2 617 khóa D7), theo code 6f ở `119e2e4` (`outcomeLock` → `meetingKeepingMove`, `editedDay`, `heldStage`, `undoneMove`): (a) Lưu không sửa; (b) đổi sang Hủy / Không đến; (c) mọi nhóm sau hộp cho chọn; (d) dời ngày −1, −7 ngày và về trước lần đổi nhóm trước đó; (e) khóa D7 của hộp ↔ lệnh xóa; mỗi lệnh chạy trong transaction rồi bỏ (`p06-6f-vs-command.mjs`) | (a) 0 bị từ chối, 0 đổi dữ liệu, **0 khung "Khi lưu" hiện oan**; (b) 9 772 lần: khung hiện ⇔ lệnh rút chuyển nhóm mà không ghi thay, nhóm KH sau đó = "→ về" của khung, 0 lệch; (c) 6 852 lựa chọn: 0 bị từ chối sau Lưu, 0 lệch khung ↔ lệnh; (d) 14 658 lần dời: 0 bị từ chối sau Lưu, 0 lệch; (e) 0 lệch. Lượt 2 (r2 K1) chỉ có (a), (c) | không thấy |
| K8 | Chữ mới của Thùng rác / Dọn sạch, giao diện tối của app (`html.dark`): tương phản mọi chữ thấy được (`contrastOf`) ở thẻ có câu nhắc 11h + dòng giữ lại, hộp 11i, thông báo 11j; câu nhắc khi Thùng rác 1 000 → khôi phục một HĐ (999) → xóa lại HĐ đó ở hồ sơ (1 000) (`p08-purge-contrast.mjs`) | Thấp nhất **6,17:1** (`text-fg-3`); chỉ mũi tên sắp `↕` 1,76:1 (KNOWN, token G3 R4). 999: câu nhắc mất, nút còn bật; 1 000: câu nhắc lại hiện | không thấy |
| K9 | Bố cục màn Thùng rác (1 101 bản ghi, câu nhắc, dòng giữ lại) và hộp 11i ở 1 440 × 900 và 1 100 × 700 (`p12-purge-shots.mjs`, ảnh `E\shots\p12-*.png`) | Không cuộn ngang; nút Dọn sạch cùng hàng tiêu đề như 11a; hộp 11i cao 547 px, nút xác nhận trong khung nhìn ở cả hai cỡ, hộp không phải cuộn | không thấy |
| K10 | Phần màn của DR6-68 thành chuỗi (`p13-before-creation-chain.mjs`): KH nhập hôm nay 15/09 ở N3 → lịch 10/09 → 6c → 6f đổi ngày 12/09 (vẫn trước ngày tạo), thử 15/09 (đúng ngày tạo) → Lưu 12/09 → Xóa từ 6f (6g) → dòng Thùng rác → hộp 11c → khôi phục | 6c: không có ô chọn nhóm, dòng khóa "… khóa ở nhóm của KH ngày 10/09/2026 · Đổi nhóm không được lùi ngày (D10) …" (không còn câu "đã đổi tiếp"); Lưu "Giữ N3". 6f 12/09: vẫn khóa N3; 15/09: hết khóa, 6 lựa chọn. 6g "Cuộc hẹn này không đổi nhóm KH"; Thùng rác "12/09/2026 · Đã gặp · nhóm sau N3 · không đổi nhóm KH"; 11c "Không đổi nhóm KH"; khôi phục được | không thấy |
| K11 | Sau một lần dọn còn bản ghi giữ lại (TR-12), bản web ghim (`p14-kept-restore.mjs`): **A** file nhập mang một Dời lịch đã xóa mà lịch dời từ nó còn + một HĐ đã xóa → dọn → nút Dọn sạch → Khôi phục… của chính dòng giữ lại (11c) → Thùng rác → file xuất; **B** Dời lịch và lịch dời từ nó cùng đã xóa → dọn | A: 11i "2 bản ghi · mọi loại, không theo bộ lọc … HĐ 1 … Giữ lại 1 bản ghi còn được dùng", 11j "Xóa hẳn 1 HĐ. Giữ lại 1 bản ghi còn được dùng."; còn dòng giữ lại kèm lý do, nút Dọn sạch tắt; nút khôi phục của dòng đó bật, 11c "Trạng thái Dời lịch · Không đổi nhóm KH"; khôi phục xong "Đã khôi phục lịch hẹn 15/09/2025 18:00 · KH … · Mở hồ sơ" nhận focus, "Thùng rác trống", không còn nút dọn; file xuất: Dời lịch sống lại (`deleted_at` null, `RESCHEDULED`), lịch sau vẫn trỏ về nó, HĐ đã dọn không còn. B: 11i "Lịch hẹn 2", không có dòng "Giữ lại", 11j "Xóa hẳn 2 lịch hẹn.", cả hai mất khỏi file. (Lần chạy đầu của B lấy lịch sau là cuộc gặp Đã gặp mà chuyển nhóm còn sống: app từ chối file trước hộp 10c, "File hỏng hoặc không phải backup Project-2C …" — `p14-kept-restore-C.log`; B chạy lại với lịch sau không có chuyển nhóm) | không thấy |

## 5. Phát hiện mới

### CL3-E3 — Test hở màn Dọn sạch Thùng rác: dọn "không theo bộ lọc", chữ xác nhận đúng nghĩa và hộp "Đang dọn…" không đóng được không có test — 6 đột biến sống cả e2e

```
ID: CL3-E3
Mức: Low
Trục: T
Vị trí: apps/desktop/src/routes/SettingsTrash.tsx:204 (confirmed = word.normalize('NFC') === confirmWord), :219 (onClose={running ? undefined : …}), :225 (Hủy disabled={running}), :289 (purgeReminder(rows.length)), :316 (canPurge(rows)); test hiện có: e2e/trash.spec.ts:19-29 (confirmPurge: chỉ thử "DỌN" rồi đúng chữ), :443, :495 (không đặt bộ lọc / ô tìm, bản web dọn trong một nhịp nên không có lúc "Đang dọn…"); đối chiếu: e2e/dialog-keyboard.spec.ts:135 giữ đúng hành vi này cho hộp Nạp lại; spec docs/design/phase-6-hoan-thien.md:111 ("không theo loại / ô tìm đang chọn"), :116 ("Đang dọn…", không đóng được), :130 (TR-13 "số ở đầu màn"), :170 (D1) (119e2e4)
Tình trạng: CONFIRMED
Liên quan: DR6-84 (#662 → #710) · mới do đợt sửa lượt 2 · không gồm nhánh `notice.kind === 'refused'` chưa có e2e (KNOWN, ghi chú review #710)
Kịch bản: K2, K3, K4
```

- **Mô tả:** bốn luật của spec cho màn dọn sạch đúng trên màn (K2–K4) nhưng không test nào giữ: (1) câu nhắc và nút Dọn sạch tính trên mọi bản ghi, không theo bộ lọc / ô tìm; (2) nút xác nhận chỉ bật khi gõ đúng DỌN SẠCH (không nhận chữ thường, thừa dấu cách), có chuẩn hóa NFC cho IME (review R4); (3) đang dọn thì Escape không đóng hộp; (4) đang dọn thì Hủy tắt. Gỡ từng luật thì cả `trash.spec.ts` lẫn bộ vitest vẫn xanh. Hộp Nạp lại có e2e cho (3) (`dialog-keyboard.spec.ts:135`), hộp Dọn sạch chép khung đó (KNOWN #710, mùi *Duplicated Code*) mà không chép test.
- **Tái hiện / bằng chứng:** `node e2e-mut.mjs …` (log `E\e2e-mut.log`; mỗi bản dựng ngoài repo, `git status --short after: ""`), chạy `trash.spec.ts -g "purge"` và `-g "reminds from 1 000"`:
  - `R84e | the reminder counts the rows the filter shows | SURVIVED — 1 passed, 0 failed`
  - `R84f | the purge button follows the rows the filter shows | SURVIVED — 2 passed, 0 failed`
  - `R84g | the word accepted in any case, spaces around | SURVIVED — 2 passed, 0 failed`
  - `R84h | the word compared as typed (no NFC) | SURVIVED — 2 passed, 0 failed`
  - `R84i | Escape closes the dialog while it purges | SURVIVED — 2 passed, 0 failed`
  - `R84j | Hủy stays on while it purges | SURVIVED — 2 passed, 0 failed`
  - Đối chứng: trên bản ghim, K2 (bộ lọc + ô tìm: câu nhắc còn, nút bật, hộp đếm đủ), K3 (chỉ đúng chữ / NFD bật nút), K4 (Escape ×3 hộp ở lại, Hủy tắt) — `p02-purge-screen.log`, `p03-running-escape.log`.
- **Ảnh hưởng:** một lần sửa sau (vd. gộp `PurgeDialog` với `ReloadDialog` như ghi chú KNOWN #710 gợi ý, hay "dọn theo bộ lọc") làm hỏng luật của thao tác xóa hẳn duy nhất của app mà CI xanh. Hiện tại hành vi đúng.
- **Đề xuất:** một ca e2e `asExe` + `holdBackup` cho hộp dọn sạch như `dialog-keyboard.spec.ts:135` (Escape ×3, Hủy tắt); trong `trash.spec.ts:495` đặt bộ lọc "Lịch hẹn" + ô tìm trước khi kiểm câu nhắc và trước khi dọn; trong `confirmPurge` thử thêm "dọn sạch" và "DỌN SẠCH " (tắt) và bản NFD (bật). ≈ 40–60 dòng e2e, 0 SP.

### CL3-E4 — Test hở (DR6-91, R04g): chỗ nối hộp 6f ↔ `editedDay` không test nào giữ — bỏ nhóm đã giữ ở hộp thì ca E19 hiện lại chuyển nhóm giả mà cả bộ e2e xanh

```
ID: CL3-E4
Mức: Low
Trục: T
Vị trí: apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx:88 (const onDay = editedDay(transitions, appointments, a, day)); apps/desktop/src/routes/appointments/outcome-form.ts:133-145 (editedDay, có unit test); test: apps/desktop/src/routes/appointments/outcome-form.test.ts "editedDay (6f)" (chỉ hàm thuần), không e2e nào mở 6f của ca E19 (e2e/trash.spec.ts:289 là E18, khôi phục; e2e/appointment-outcome.spec.ts không có E19) (119e2e4)
Tình trạng: CONFIRMED
Liên quan: DR6-91 (SỬA MỘT PHẦN: phần R04g ở hộp 6f) · lỗ test có từ #616, #667 chuyển phép tính sang hàm có test nhưng không giữ chỗ nối
Kịch bản: — (đột biến bảng R)
```

- **Mô tả:** R04g của lượt 2 là đột biến ở **hộp 6f** ("6f không đi từ nhóm đã giữ — E19"). #667 đưa phép tính "nhóm bắt đầu" ra hàm `editedDay` (có test), nên R04g trên hàm bị giết. Nhưng hộp phải đưa đúng lịch (trạng thái, ngày, nhóm sau) vào `editedDay`; gỡ đúng phần đó ở hộp (đột biến R04g-tsx: hộp gọi `editedDay` như với một lịch không Đã gặp, tức không mang nhóm đã giữ) thì **cả 237 ca e2e** vẫn như bản ghim.
- **Tái hiện / bằng chứng:**
  - `E\e2e-mut.log`: `R04g-tsx | … | SURVIVED — 18 passed, 0 failed — appointment-outcome.spec.ts: 17/0 || trash.spec.ts -g "E18": 1/0`; cả bộ (`--full`): `236 passed, 1 failed — ✗ e2e\theme.spec.ts:48`, bản ghim cùng lệnh `236 passed, 1 failed — ✗ e2e\theme.spec.ts:48` (ca "không request ngoài localhost" đỏ ở mọi bản dựng chạy qua 127.0.0.1, như gói D ghi).
  - Hệ quả trên màn (`node r2-p07-web-chains.mjs <port> W3` = probe W3 của lượt 2; log `E\r2-p07-W3-R04g-tsx.log` so `E\r2-p07-W3-W8-base.log`): ca E19 (cuộc gặp hôm nay giữ N3, rồi chuyển tay N3 → N2 cùng ngày) → 6f: bản ghim `Nhóm sau cuộc gặp | N3 | 🔒 | … Nhóm của KH đã đổi tiếp sau cuộc gặp này, ngày 15/09/2026: | N3 | → | N2`; bản R04g-tsx `Nhóm sau cuộc gặp * | N4 | N3 | N2 | giữ nguyên | … | N2 | → | N3 | ngày 15/09/2026 | · không tính RF` — chuyển nhóm không có thật, đúng triệu chứng lượt 2.
- **Ảnh hưởng:** một lần sửa hộp 6f sau làm lại lỗi R04g của lượt 2 (hộp đọc lại một chuyển nhóm giả; Lưu ghi nó thật) mà CI xanh. Hiện tại hành vi đúng (K7: 0 lệch).
- **Đề xuất:** một ca e2e 6f cho E19 như W3 (cuộc gặp giữ nhóm + chuyển tay cùng ngày → mở 6f: nhóm sau khóa ở nhóm đã giữ, có dòng khóa, không có dòng "→ N3"); ≈ 20–30 dòng e2e, 0 SP.

### CL3-E1 — Thẻ Hợp đồng: nút "Phát hành" / "Sửa" của hai HĐ cùng KH nộp cùng ngày có cùng tên cho trình đọc màn hình (thiếu FYP — phần DR6-99 chưa sửa ở màn này)

```
ID: CL3-E1
Mức: Nit
Trục: A
Vị trí: apps/desktop/src/routes/customers/CustomerPolicies.tsx:96 (aria-label policies.issueLabel { date }), :105 (policies.editLabel { date }); apps/desktop/src/i18n/vi.ts:1261-1262; dòng chữ thấy được có FYP: CustomerPolicies.tsx:87 (policies.submitted "Nộp {date} · {fyp}") (119e2e4)
Tình trạng: CONFIRMED
Liên quan: DR6-99 (biến thể gần: #667 thêm FYP vào tên nút khôi phục HĐ của Thùng rác, không chạm thẻ Hợp đồng) · có từ trước, lượt 1–2 bỏ sót (lượt 1 Home PC Claude E còn dẫn hai nhãn này làm mẫu đúng)
Kịch bản: K5
```

- **Mô tả:** nút "Phát hành" và "Sửa" của mỗi dòng HĐ có `aria-label` chỉ gồm ngày nộp ("Phát hành HĐ nộp {date}", "Sửa HĐ nộp {date}"). Hai HĐ của cùng KH nộp cùng ngày (thao tác 8a bình thường: một KH mua hai HĐ một lần) cho bốn nút mà trình đọc màn hình nghe thành hai cặp giống hệt, trong khi dòng chữ thấy được khác nhau ở FYP. Đúng loại DR6-99 (Thùng rác), mà #667 chỉ sửa ở Thùng rác.
- **Tái hiện:** `node p04-same-day-labels.mjs 4481` (bản web ghim, log `E\p04-same-day-labels.log`): hồ sơ KH từ lịch Đã gặp hôm qua → 8a "10/9" "24tr", 8a "10/9" "30tr" → `C card rows ["Đã nộp Nộp 10/09 · 24 tr … Phát hành Sửa","Đã nộp Nộp 10/09 · 30 tr … Phát hành Sửa"]`, `C names of their buttons ["Phát hành HĐ nộp 10/09/2026","Sửa HĐ nộp 10/09/2026","Phát hành HĐ nộp 10/09/2026","Sửa HĐ nộp 10/09/2026"]`, `getByRole('button', { name: 'Phát hành HĐ nộp 10/09/2026' })` → 2.
- **Ảnh hưởng:** người dùng trình đọc màn hình (hoặc tìm nút theo tên) không biết nút nào phát hành / sửa HĐ nào; dễ phát hành nhầm HĐ. Người nhìn màn hình phân biệt được. Hiếm (hai HĐ cùng ngày).
- **Đề xuất:** thêm FYP vào hai nhãn như `trash.restoreLabel.policy` ("Phát hành HĐ nộp {date} · {fyp}", "Sửa HĐ nộp {date} · {fyp}"); sửa chỗ e2e gọi nút theo tên cũ (`customer-policies.spec.ts`, `full-cycle.spec.ts`…). ≈ 4 dòng SP + một ca e2e hai HĐ cùng ngày.

### CL3-E2 — Thùng rác: hai bản ghi khác trạng thái (lịch Hủy / Không đến cùng ngày giờ; HĐ cùng ngày, cùng FYP, một đã phát hành) có cùng tên nút "Khôi phục…"

```
ID: CL3-E2
Mức: Nit
Trục: A
Vị trí: apps/desktop/src/routes/trash-view.ts:175-191 (restoreLabel: lịch = ngày giờ + KH, HĐ = ngày nộp + FYP + KH; không có trạng thái), so :85-97 (recordTitle của lịch có trạng thái) và SettingsTrash.tsx:54-59 (huy hiệu Đã nộp / Đã phát hành của HĐ); apps/desktop/src/i18n/vi.ts:372-373 (119e2e4)
Tình trạng: CONFIRMED
Liên quan: DR6-43, DR6-99 (biến thể gần: tên nút chưa phân biệt khi ô "Bản ghi" khác nhau ở trạng thái) · có từ trước (#630), lượt 2 chỉ thử bản ghi cùng trạng thái
Kịch bản: K5
```

- **Mô tả:** tên nút khôi phục chỉ phân biệt được những gì có trong nhãn: lịch theo ngày giờ, HĐ theo ngày nộp + FYP. Hai lịch của cùng KH cùng ngày giờ mà một Hủy, một Không đến (đặt lại đúng giờ sau khi hủy), hay hai HĐ cùng ngày cùng FYP mà một đã phát hành, có ô "Bản ghi" khác nhau trên màn nhưng cùng một tên nút. Lượt 2 (CL2-E3 → DR6-99) đã ghi "hai lịch cùng ngày cùng giờ … dòng 'Bản ghi' của chúng cũng trùng nên không phải lệch của nhãn" — đúng khi cùng trạng thái, không còn đúng khi khác trạng thái.
- **Tái hiện:** `p04` (log trên): `D restore names shared by rows that read differently [["Khôi phục lịch hẹn 14/09/2026 10:00 của KH Đỗ Quốc Dũng",["14/09/2026 10:00 · Không đến","14/09/2026 10:00 · Hủy"]],["Khôi phục HĐ nộp 10/09/2026 · 24.000.000 ₫ của KH Đỗ Quốc Dũng",["Nộp 10/09/2026 · 24.000.000 ₫ Đã nộp","Nộp 10/09/2026 · 24.000.000 ₫ Đã phát hành"]]]`.
- **Ảnh hưởng:** như DR6-99: người dùng trình đọc màn hình nghe hai nút giống hệt. Rất hiếm (hai bản ghi gần giống nhau cùng nằm trong Thùng rác).
- **Đề xuất:** thêm trạng thái vào tên nút khôi phục của lịch hẹn ("… 10:00 · Hủy của KH …") và trạng thái HĐ ("· đã phát hành") vào tên nút khôi phục HĐ, như ô "Bản ghi"; một ca `trash-view.test.ts`. ≈ 4 dòng SP. Có thể gộp với CL3-E1.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc | Trên | Kết quả | ID |
|---|---|---|---|
| `pnpm exec tsc -p apps/desktop/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` (log `E\tsc-unused-app.log`; hai cờ cũng bật sẵn ở `tsconfig.base.json:12-13`, nên `pnpm verify` xanh của `baseline.md` đã là phép kiểm này) | app (gồm 51 file gói E) | exit 0, 0 dòng (4 s); `git status --short` sau đó rỗng | — |
| Nơi dùng mọi export của 37 file SP gói E: `node E\r2-exports.mjs` (= script `exports.mjs` lượt 2, đọc `HEAD` bằng `git grep -w`; log `E\r2-exports.log`) | `apps`, `packages`, `e2e`, `tools` | 12 export mới của đợt sửa (`git diff 4217ed4 119e2e4`): `UndoneMoveNote` (6g, dùng lại ở 6f `EditOutcomeDialog.tsx:15`, `:231`), `editedDay`, `undoneMove`, `purgeReminder`, `canPurge`, `keptReason`, `purgeView`, `purgedNotice`, `purgeFailure`, kiểu `PurgeNotice` — có nơi dùng SP ngoài file; **`PURGE_REMINDER`** (hằng) và kiểu `PurgeView` chỉ dùng trong `trash-view.ts:499-503` — cùng loại DR6-66 (KNOWN, hoãn), không tốn gì lúc chạy. Còn lại như lượt 2: chỉ test dùng `OUTCOME_CHOICES`, `readFyp`, `buildReportWorkbook`, `reportFileName`, `reportWorkbookMeta` (+ 5 kiểu; seam test); không ai import ngoài file: `markName` (DR6-66) và 25 kiểu (lượt 2: 24; thêm `PurgeView`) | KNOWN (DR6-66) |
| Khóa i18n: `node E\r1-keys.mjs` (chép `claude\D\`, log `E\keys.log`) + `node E\keys-diff.mjs` (khóa thêm / bỏ từ `4217ed4`, log `E\keys-diff.log`) | `vi.ts` ↔ `apps/desktop/src` | **1 154 khóa** (lượt 2: 1 113; +47 / −6): 938 viết thẳng + 216 dựng động, **0 khóa không dùng, 0 khóa chỉ test dùng**. Phần dùng ở file gói E: +39 (`trash.purge.*` 17, `trash.purged.*` 4, `trash.records.*` 7, `trash.kept.*` 3, `trash.reminder`, `trash.helpFile`, `trash.done.mark`, `trash.owner.none`, `trash.appointment.noChange`, `trash.blocked.recordedAfter`, `outcomeEdit.onSave`, `appointments.none`), −5 (`trash.restore.{policies,kyc,ai,leftAppointments}`, `trash.restored.mark`: #710 thay bằng `trash.records.*` / `trash.done.mark`, 0 chỗ còn gọi). Chữ trùng ≥ 2 khóa: 63 cặp (như gói D) | — |
| Slot i18n: `node E\r1-slots.mjs` (log `E\slots.log`) | 954 lời gọi `t()` tĩnh (8 bỏ qua: tham số biến / spread) | 0 thiếu slot ngoài 4 khuôn cố ý như lượt 1–2 (`aiPanel.evidence`, `aiPanel.web.copyFixHelp`, `period.monthLabel` / `yearLabel` — hai khóa sau ở `period-labels.ts` của gói E, `PeriodPicker` tự điền `{value}`) | — |
| Code lặp của đợt sửa (đọc diff) | gói E | `PurgeDialog` chép khung hộp gõ chữ của `ReloadDialog` (so NFC `SettingsTrash.tsx:204` ↔ `Settings.tsx:140`, chặn đóng khi đang chạy, cặp nút): KNOWN (ghi chú review #710), không bằng chứng mới về chi phí — nhưng phần chép không mang theo test của hộp gốc (CL3-E3). `UndoneMoveNote` của 6g dùng lại ở 6f (bớt lặp). Có từ trước, 2 nơi (dưới ngưỡng ≥ 3 nơi): `download()` giống hệt ở `SettingsBackup.tsx:183-191` và `ReportExport.tsx:88-96` (chỉ khác MIME); `plain` ở `appointment-form.ts:128`, `trash-view.ts:58` + biến thể `slug` `report-workbook.ts:224` (KNOWN #543 / DR6-67) | KNOWN |
| Bundle (`common\baseline.md`) | toàn app | `index.js` 927 932 B (+18 263 so lượt 2, gồm mọi PR sửa), `index.css` 28 484 B (+94); `exceljs`, `chart.js` 0 đổi. Không tách được phần gói E theo module khi chưa có visualizer (G4) | — |
| `pnpm lint:deps`, `pnpm codemap` | `common\baseline.md` (`pnpm verify` xanh ở SHA ghim: `lint:deps` 0 vi phạm, 320 module; codemap khớp) | Không chạy lại | — |
| Cỡ dòng | `E\list.log`, `E\fix-numstat.log` | SP 7 756 (+382 so lượt 2 = +540 / −158), test 4 146 (+303), 51 file (0) | — |

Đề xuất refactor: không có đề xuất mới ngoài DR6-66 / DR6-67 và ghi chú #710 (KNOWN, hoãn). Nếu gộp `PurgeDialog` với `ReloadDialog`, nên làm sau CL3-E3 (có test giữ luật của cả hai hộp).

### 6.2 Hiệu năng

Máy Home PC `DESKTOP-KDURKJP` (i9-12900K), Node v24.20.0, Edge (Playwright) headless 1 440 × 900. Dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (hash §L3.6, `baseline.md`; 1 481 KH sống, 10 255 lịch, 1 674 HĐ, 4 884 chuyển nhóm, 113 dòng Thùng rác). Thùng rác lớn: `E\load-del1200.p2cbackup` (`p09-make-big.mjs`: dữ liệu tải nhập qua `openAppData`, 1 200 KH đang dùng đầu tiên theo `id` xóa bằng lệnh xóa, xuất như Cài đặt → Dữ liệu; 1 313 dòng, 281 KH sống, 16 060 917 B — cách dựng như DR6-84 / `baseline.md`). **Lúc đo** (bảng A–C, 23:03–23:06): sau khi `e2e-mut.mjs` đã xong (22:55), các probe chạy nối tiếp; CPU 0 % / 1 % ngay trước bảng C / bảng A–B (`Win32_Processor.LoadPercentage`, ghi trong lệnh chạy); không `project2c.exe`, không `pnpm e2e` cổng 4173; song song có máy chủ 4481 nhàn rỗi và app ChatGPT / Codex của Owner (tiến trình `ChatGPT`, `codex` thấy lúc kiểm lại 23:23, CPU khi đó 3 %; không xem chúng làm gì). Riêng số ms của `p01` (bảng D) đo lúc `e2e-mut.mjs` chạy nền → chỉ tham khảo. Luật nhiễu: xấu hơn khi > 20 % **và** > 10 ms. Cột lượt 2: `docs/reviews/raw/2026-10-17/claude/E.md` §6.2 (cùng máy, cùng probe). Ngưỡng `docs/metrics/phase-6.md` (qua bảng của `baseline.md`): thao tác màn < 200 ms.

**A. Node — hàm thuần / lệnh đọc mà màn gói E chạy** (`node --import ./hooks-ui.mjs r2-p05-perf.mjs` = probe đo lượt 2, chép; log `E\r2-p05-perf.log`; hôm nay 12/10/2026; trung vị (min–max)):

| Thao tác | n | Lượt 3 (`119e2e4`) | Lượt 2 (`4217ed4`) | So | ID |
|---|---:|---|---|---|---|
| `importBackup` | 1 | 863 ms | 852 ms | +1 % | — |
| Tổng quan, một lần Lọc · Toàn bộ, Ngày / Tuần / Tháng / Năm / Tùy chọn | 7 | 5,3 / 5,0 / 7,4 / 8,2 / 5,5 ms | 5,3 / 5,0 / 6,6 / 8,2 / 5,4 ms | ≈ (Tháng +0,8 ms) | — |
| … góc nhìn Team / RE | 7 | 5,1–8,3 / 1,0–1,3 ms | 4,9–8,7 / 1,0–1,5 ms | ≈ | — |
| Báo cáo `reportRows` + `reportCells` mọi dòng, 5 kỳ · Toàn bộ / Team / RE | 7 | 5,0–7,0 / 3,9–5,1 / 3,1–4,0 ms | 5,2–6,9 / 3,7–4,9 / 2,9–3,9 ms | ≈ | — |
| Báo cáo `buildReportWorkbook` Năm · Toàn bộ (4 sheet) | 5 | 7,7 ms (6,8–206,0: lần đầu nạp `exceljs`) | 7,9 ms (6,9–215,5) | ≈ | — |
| Lịch hẹn `appointmentRows` Toàn bộ / Team / RE | 7 | 2,5 / 1,2 / 0,6 ms | 2,5 / 1,1 / 0,6 ms | ≈ | — |
| Lịch hẹn lọc kỳ + đếm / `monthGrid` / `yearGrid` / `dayBoard` / `appointmentsByRe` (Toàn bộ) | 7 | 0,6 / 0,8 / 0,5 / 0,6 / 0,7 ms | 0,6 / 0,7 / 0,3 / 0,7 / 0,7 ms | ≈ | — |
| Thùng rác `listTrash` (113 dòng) | 7 | **26,3 ms** (24,9–40,8) | 21,3 ms (19,8–33,3) | +5,0 ms (+23 %): dưới 10 ms → trong luật nhiễu. Có thể do `keptRecords` mà #709 thêm vào `listTrash` (ghi chú KNOWN #709 nêu đúng chi phí này: luôn chạy `KEPT_PEOPLE` / `KEPT_TEAMS`); chưa đo riêng | KNOWN |
| Thùng rác đếm + lọc + tìm / `restoreView` mọi dòng | 7 | 0,1 / 0,3 ms | 0,1 / 0,3 ms | ≈ | — |
| Cài đặt → Dữ liệu `countRecords` | 7 | 4,8 ms | 4,9 ms | ≈ | — |

**B. Node — chi phí mỗi lần render của code mới trong hộp** (`node --import ./hooks.mjs p11-hold-cost.mjs` = probe `p15-hold-cost.mjs` lượt 2 trên code 6f của `119e2e4`, thêm Thùng rác; log `E\p11-hold-cost.log`; dữ liệu tải qua `openAppData`; hộp gọi mỗi phím):

| Code mới (PR) | Trên | Lượt 3: trung vị · p95 · max | Lượt 2 | ID |
|---|---|---|---|---|
| 6f: `outcomeLock` (→ `meetingKeepingMove`) + `editedDay` + `heldStage` + `undoneMove` (#667) | 1 072 cuộc gặp Đã gặp (1 / 7) | 0,179 · 0,420 · 2,219 ms | `outcomeLock` + `meetingDay` + `heldStage`: 0,124 · 0,337 · 2,753 ms | — |
| 6c: `meetingDay` + `heldStage` (#666) | như trên | 0,035 · 0,126 · 0,224 ms | 0,033 · 0,125 · 0,210 ms | — |
| 6f / 6h: `readScheduleDate` với `Prefill` | 2 000 lần | 0,001 · 0,001 · 0,166 ms | 0,001 · 0,001 · 0,167 ms | — |
| 8d: `openDraft` + `readPolicy` + `policyChange` | 1 000 HĐ đã phát hành | 0,004 · 0,009 · 0,777 ms | 0,004 · 0,008 · 0,710 ms | — |
| Thùng rác, mỗi lần render: `recordTitle`, `recordDetail`, `ownerParts`, `restoreLabel`, `blockedReason`, `keptReason` mọi dòng + `canPurge` + `purgeReminder` (#667, #710) | 113 dòng, 50 lần | 0,266 · 0,350 · 0,995 ms | — | — |
| 11i / 11j: `purgeView` + `purgedNotice` (#710) | 500 lần | 0,009 · 0,015 · 0,202 ms | — | — |

Mọi số ≪ 16 ms / phím: code mới của đợt sửa không làm hộp chậm (6f +0,06 ms trung vị mỗi phím).

**C. Bản web — Thùng rác và Dọn sạch theo cỡ Thùng rác** (`E\dist-real`: dựng từ worktree ghim, không neo ngày; nhập qua Cài đặt → Dữ liệu → Nhập backup; đo từ thao tác tới lúc DOM có kết quả, dò bằng `MessageChannel`, không gồm vẽ; Playwright gắn DevTools (×2,4–3,3 trên nhiều câu SQL, DR6-98) nên so với số web lượt 2, không so exe; `node p10-purge-web-perf.mjs 4487 <file>` hai cỡ nối tiếp trên máy chủ tạm 4487, tắt ngay sau; log `E\p10-purge-web-perf-113.log`, `E\p10-purge-web-perf-1313.log`; `requests blocked (not 127.0.0.1) []`):

| Thao tác | n | 113 dòng (dữ liệu tải) | 1 313 dòng (+1 200 KH xóa) | Lượt 2 web | Ngưỡng | ID |
|---|---:|---|---|---|---|---|
| Dữ liệu → Thùng rác, trước khi dọn (`listTrash` + bảng) | 6 | 76,5 ms (74,8–94,6) | **449,2 ms** (447,7–475,0) | 113 dòng: 78,3 ms (p08) / 83,1 ms (p08 trash-only); 713 dòng: 268,5 ms | < 200: 113 ✅ · 1 313 ❌ | DR6-84 (cách chữa đã chọn: dọn sạch) |
| Mở hộp 11i (`previewPurge` + hộp) | 5 | 13,2 ms (12,6–16,5) | 18,0 ms (17,5–21,5) | — | < 200 ✅ | — |
| Bấm "Dọn sạch" → thông báo 11j (hàng đợi + lệnh + `VACUUM` + đọc lại) | 1 | 119,4 ms | 124,0 ms | — | không đặt (plan §L3.6) | — |
| Dữ liệu → Thùng rác, sau khi dọn ("Thùng rác trống") | 6 | 9,5 ms (9,4–10,6) | 2,9 ms (2,5–3,0) | — | < 200 ✅ | — |

1 313 dòng mở 449 ms trên web: chính triệu chứng của DR6-84 (CL2-E7). Ngoại suy hai số web lượt 2 (113 → 83, 713 → 269 ms, ≈ 0,31 ms / dòng) cho 1 313 dòng ≈ 455 ms → không đổi so lượt 2: đợt sửa không làm `listTrash` nhanh hơn, Owner chọn dọn sạch + câu nhắc từ 1 000 bản ghi (K27, TR-13). Exe không DevTools ≈ 0,09 ms / dòng, 1 313 dòng 138 ms (số của DR6-84 ghi trong `fixes.md`, mục #662). Sau khi dọn: 2,9–9,5 ms. Hộp 11i chạy lại `keptRecords` mà `listTrash` vừa chạy, và chạy `previewPurge` thêm một lần sau khi dọn (KNOWN, ghi chú review #710): cả hộp 13–18 ms, không đáng kể.

**D. Node — dọn như màn chạy** (`AppData.purgeTrash`, bản web không file, không backup; `node --import ./hooks.mjs p01-purge-figures.mjs`, log `E\p01-purge-figures.log`; một lần mỗi cỡ, **đo lúc `e2e-mut.mjs` chạy nền → chỉ tham khảo**; cột so: `baseline.md` "Dọn sạch Thùng rác trong Node", máy rảnh, 5 lần):

| Đo (ms) | 113 dòng | 1 313 dòng | `baseline.md` 113 / 1 313 |
|---|---:|---:|---|
| `listTrash` trước khi dọn | 38,6 | 228,1 | 32,6 / 140,7 |
| `previewPurge` | 6,1 | 10,7 | 5,6 / 9,9 |
| `purgeTrash` qua `AppData` (hàng đợi + lệnh + `VACUUM`) | 89,1 | 110,7 | 93,8 / 109,8 (`purgeTrash` cả `VACUUM`) |
| `listTrash` sau khi dọn | 12,8 | 2,1 | 10,8 / 2,1 |

**E. Exe (không đo lại — `common\baseline.md`, probe `e2e/perf` của bước chuẩn bị, cùng máy; so mốc sau #656):** `trash.open` 38 ms (Nền 34; +4 ms, +10 %), `trash.kind-appointments` 6 (6), `overview.filter-year` / `-month` 15 / 14 (16 / 14), `reports.filter-year` / `-month` / `table-re` 9 / 10 / 17 (10 / 10 / 17), `reports.export-excel` 23 (20; +4 ms, +19 %), `appointments.period-*` 8–18 (8–17), `appointments.next-month` / `next-year` 103 / 106 (101 / 107; Năm − Tháng +3 ms ≤ 50): không dòng nào ⚠️, mọi dòng trong ngưỡng. So lượt 2: `trash.open` 38 / 73 ms không so được (cách đo đổi ở #689, DR6-98). Dọn sạch trên exe (một lần, dữ liệu tải): `trash.open` 38,9 → 9,6 ms; bấm "Backup rồi dọn sạch" → khung hình đầu có 11j 151,8 ms; `project2c.db` 14 069 760 → 13 410 304 B. Exe ở Thùng rác lớn: gói F (plan).

**Kết luận hiệu năng gói E:** trên dữ liệu tải không thao tác nào của gói E vượt ngưỡng và không số nào xấu hơn lượt 2 / mốc sau #656 theo luật nhiễu (lớn nhất: `listTrash` +5 ms, có thể do phần KNOWN của #709). Code mới của đợt sửa: 6f +0,06 ms mỗi phím, Thùng rác 0,27 ms mỗi render, mở 11i 13–18 ms, dọn 119–124 ms (web) / 152 ms (exe). Thùng rác 1 313 dòng vẫn mở 449 ms trên web — triệu chứng DR6-84 mà Owner chọn chữa bằng dọn sạch; dọn xong còn 3 ms. **Không có phát hiện P mới.**

## 7. Bảng đếm mức × trục

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | | 0 |
| Low | | | | | | | | | CL3-E3, CL3-E4 | | 2 |
| Nit | | | | | | | | | | CL3-E1, CL3-E2 | 2 |

**4 phát hiện mới, 4 / 4 CONFIRMED** (đột biến / probe trên bản ghim, lệnh và trích kết quả ở từng mục), 0 PLAUSIBLE, 0 KNOWN có bằng chứng mới. Trục R (bảng R): **9 ĐÃ SỬA** (95 sửa bằng tài liệu) · **1 SỬA MỘT PHẦN** (91 → CL3-E4) · 0 CHƯA SỬA · 0 HỒI QUY. "Mới do đợt sửa lượt 2": CL3-E3 (#710); lỗ test còn lại sau #667: CL3-E4 (chỗ nối có từ #616); có từ trước, lượt 1–2 bỏ sót: CL3-E1, CL3-E2. Đã báo ở gói trước, không báo lại: CL3-A13 (lỗ test nhánh "nhóm tạo KH"), CL3-A20 (thứ tự `liveAppointmentsOf`), CL3-A26 (luật nhóm trước ngày tạo viết ba nơi), CL3-D1 (câu 9b về khôi phục / dọn sạch).

## 8. Đã xét, không thấy

- **R — đã sửa.** Bảng R: 10 DR6, 44 đột biến (20 vitest, 26 TSX; R68e, R93a chạy cả hai đường; mục 9.2); probe lượt 2 chạy lại: `r2-p07` W3 / W8, `r2-p23`, `r2-p05`, `exports`, `p15` (thành `p11`). Không HỒI QUY: 4 spec gói E trên bản ghim 70 / 70; cả bộ e2e trên bản ghim 236 / 237 (chỉ `theme.spec.ts:48` của bộ chạy qua 127.0.0.1, như lượt 2 và gói D).
- **E — biên.** K2 (1 000 bản ghi, bộ lọc + ô tìm), K3 (9 cách gõ chữ xác nhận), K4 (D7 / D8, đang dọn, Escape ×3, bấm ngoài hộp), K8 (999 ↔ 1 000), K9 (1 440 / 1 100 px), K10 (trước ngày tạo KH, đổi ngày qua ngày tạo / sau hôm nay), K11 (khôi phục dòng giữ lại, dọn khi cả hai lịch đã xóa): ngoài các lỗ test của CL3-E3 không thấy lỗi hành vi.
- **C — hợp đồng / mockup / nhãn.** 11h–11j so mockup `trash.html`: câu nhắc, hộp, thông báo đúng mẫu (K1, K2, K9); TR-11 "mọi loại, không theo bộ lọc" đúng cả khi đang lọc (K2); TR-12 lý do giữ lại (K2, K11); D1 chữ xác nhận (K3); D7 / D8 / D13 (K4); số trong hộp 11i = số trên exe ở `baseline.md` (K1). DR6-95: mockup = spec = NT-TR-09 (K6). Ngoài CL3-E1, CL3-E2 (tên cho trình đọc màn hình) không thấy gì.
- **D — dữ liệu.** Mọi số màn gói E 0 khác trước / sau dọn ở hai cỡ, sau xuất → nhập lại, 6 phép kiểm chéo 0 lệch (K1); `app.tables()` trùng từng dòng, đúng thứ tự sau `VACUUM`; 6f ↔ lệnh 0 lệch trên 7 503 cuộc gặp (K7). Lệnh ghi của hộp gói E đều qua `app.run` (`AppointmentDialog.tsx:109`, `DeleteAppointmentDialog.tsx:34`, `EditOutcomeDialog.tsx:99`, `OutcomeDialog.tsx:91-103`, `RescheduleDialog.tsx:35`, `PolicyDialogs.tsx:109`, `:311`; khôi phục `restoreRow` `trash-view.ts:487`), dọn qua `data.purgeTrash()` (`SettingsTrash.tsx:209` → `inTurn`, `app-data.ts:485-487`). File nhập trái luật (cuộc gặp Đã gặp đã xóa mà chuyển nhóm còn sống) bị từ chối trước hộp 10c, dữ liệu không đổi (K11 / `p14` C).
- **G — guardrail AI.** Gói E không gọi AI (`SettingsAi.tsx` ngoài gói). Chỗ chạm: dọn sạch xóa hẳn phân tích AI của KH đã xóa (11i / 11j "1 phân tích AI", "99 phân tích AI"; K1); kết quả AI về sau khi KH đã bị dọn bị bỏ: `ai-analysis.ts:177`, `:235` (`GONE` → `discarded`) + `ai-analyses.ts:108` (`liveCustomer`) — đọc code, không chạy (đường AI là gói C).
- **S — ranh giới.** `git grep -E "dangerouslySetInnerHTML|innerHTML|outerHTML|insertAdjacentHTML|eval\(|new Function|target=.?_blank|window\.open|document\.write|localStorage|sessionStorage"` trên 37 file SP gói E: rỗng (exit 1). Tải file chỉ qua `Blob` + `URL.createObjectURL` (`SettingsBackup.tsx:184`, `ReportExport.tsx:89`; thu hồi sau 60 s); tên file Excel chỉ ASCII (`report-workbook.ts:224-258`); tooltip ECharts escape mọi chuỗi (`stage-chart.ts:49-51`, `:73`; F-18). Chữ xác nhận chỉ dùng để so. `new Date(…)` ở gói E chỉ để định dạng mốc đã lưu (`SettingsBackup.tsx:159`, `:198`, `trash-view.ts:194`), không đọc giờ máy. Mọi probe: 0 request ra ngoài 127.0.0.1.
- **P — hiệu năng.** Mục 6.2.
- **B — bloat.** Mục 6.1.
- **T — test.** 44 đột biến: 37 bị giết (20 bởi vitest, 19 bởi e2e; R68e, R93a bị cả hai giết), 7 sống cả lọc nhắm (R84e–j → CL3-E3) hoặc cả bộ (R04g-tsx → CL3-E4). Nhánh `refused` của màn dọn chưa có e2e: KNOWN (ghi chú #710). Test mới của đợt sửa trong gói E (`outcome-form.test.ts` +131, `trash-view.test.ts` +177) không đọc giờ máy, không ngẫu nhiên (grep diff: 0 `new Date(`, `Date.now`, `performance.now`, `Math.random`).
- **A — trợ năng / i18n.** Tương phản chữ mới ≥ 6,17:1 (K8); hộp 11i: focus vào ô chữ khi mở (`p02`: `INPUT`), đang dọn thì focus ở nút "Đang dọn…"; thông báo 11j `role="status"` nhận focus (K2, K4), D8 `role="alert"` + focus về nút Dọn sạch (K4); khôi phục dòng giữ lại → focus ở thông báo (K11); tên nút khôi phục có FYP (DR6-99). i18n: 0 khóa thừa, 0 thiếu slot ngoài khuôn cố ý (mục 6.1). Ngoài CL3-E1, CL3-E2 không thấy gì.

## 9. Phụ lục

### 9.1 Probe, log

Mọi file ở `C:\workspace\deep-review-1-6-r3\claude\E\`. Không ghi gì vào repo.

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `list.mjs` | danh sách 51 file gói E (`classifyFile`) | `list.log` | mục 3 |
| `fix-numstat.log`, `fix-diff.patch` | `git diff 4217ed4 119e2e4` trên 51 file | — | mục 3 |
| `build-dist.mjs`, `serve-dist.mjs`, `pw.config.mjs` | bản web ngoài repo: Vite `build()` của worktree ghim + `load` hook phục vụ bản đột biến (repo không bị vá), `--outDir` ở `E\dist-*`; `vite preview` trên 127.0.0.1:4481–4489; e2e của repo chạy vào đó (kết quả ở `E\pw-results\`) | `build-base.log`, `build-real.log`, `e2e-base.out` | mục 2, 4, 6.2 |
| `mut-list.mjs`, `mutant-config.mjs`, `mutjs.mjs` | 44 đột biến; vitest qua `load` hook | `mutjs.log`, `mut\` | mục 2, 9.2 |
| `e2e-mut.mjs` | e2e đột biến (lọc nhắm / `--full`), đối chứng bản ghim (`base`) | `e2e-mut.log` | mục 2, 9.2 |
| `hooks.mjs`, `hooks-ui.mjs` + `r1\ui-stub.mjs`, `browser.mjs` | nạp TS của repo trong Node (`hooks-ui`: thay `@p2c/ui` như lượt 1, dữ liệu tải lượt 3); bộ trình duyệt: chặn mạng ngoài 127.0.0.1 từ lần chạy đầu, thay `window.open` / clipboard (chép `claude\C\`, `claude\D\`, lượt 1) | — | mọi probe |
| `p01-purge-figures.mjs` | dọn như màn chạy; mọi số màn gói E trước / sau, 2 cỡ, xuất → nhập lại | `p01-purge-figures.log` | K1, mục 6.2 D |
| `p02-purge-screen.mjs`, `p03-running-escape.mjs` | màn Dọn sạch: bộ lọc / ô tìm, chữ xác nhận, D7 / D8, đang dọn (IPC giả) | `p02-purge-screen.log`, `p03-running-escape.log` | K2–K4, CL3-E3 |
| `p04-same-day-labels.mjs` | tên nút của bản ghi gần giống nhau (thẻ Hợp đồng, Thùng rác) | `p04-same-day-labels.log` | K5, DR6-99, CL3-E1, CL3-E2 |
| `r2-p07-web-chains.mjs`, `p05-6f-undone.mjs` | probe W3 / W8 lượt 2 (chép, chỉ đổi thư mục ảnh) + W8b; trên bản ghim và bản R04g-tsx | `r2-p07-W3-W8-base.log`, `r2-p07-W3-R04g-tsx.log`, `p05-6f-undone.log` | DR6-70, 91, 93, 94, CL3-E4 |
| `r2-p23-focus-after-save.mjs` | probe focus lượt 2 | `r2-p23-focus-after-save.log` | DR6-83 |
| `p06-6f-vs-command.mjs` | 6f ↔ lệnh trên mọi cuộc gặp của dữ liệu tải | `p06-6f-vs-command.log` | K7, DR6-103 |
| `p07-e7.mjs` | E7 (DR6-95) qua lớp dữ liệu + hàm màn | `p07-e7.log` | K6 |
| `p08-purge-contrast.mjs` | tương phản chữ mới (giao diện tối), câu nhắc 999 / 1 000 | `p08-purge-contrast.log` | K8 |
| `p09-make-big.mjs` | Thùng rác lớn (1 313 dòng) qua lớp dữ liệu | `p09-make-big.log` → `load-del1200.p2cbackup` | K1, mục 6.2 |
| `p10-purge-web-perf.mjs` | Thùng rác / Dọn sạch trên `dist-real`, 2 cỡ | `p10-purge-web-perf-113.log`, `p10-purge-web-perf-1313.log` | mục 6.2 C |
| `r2-p05-perf.mjs` | probe đo lượt 2 (= `p1-perf.mjs` lượt 1) | `r2-p05-perf.log` | mục 6.2 A |
| `r2-p15-hold-cost.mjs`, `p11-hold-cost.mjs` | chi phí mỗi render của hộp (bản lượt 2 chép làm gốc; bản lượt 3 trên code 6f mới + Thùng rác) | `p11-hold-cost.log` | mục 6.2 B |
| `p12-purge-shots.mjs` | bố cục Thùng rác / 11i, 2 cỡ cửa sổ | `p12-purge-shots.log`, `shots\p12-*.png` | K9 |
| `p13-before-creation-chain.mjs` | chuỗi DR6-68 trên màn | `p13-before-creation-chain.log` | K10 |
| `p14-kept-restore.mjs` | sau dọn: khôi phục dòng giữ lại; dọn khi cả hai lịch đã xóa; file nhập trái luật (C) | `p14-kept-restore.log`, `p14-kept-restore-C.log` | K11 |
| `r2-exports.mjs`, `r1-keys.mjs`, `r1-slots.mjs`, `keys-diff.mjs` | Bloat: export, khóa i18n (+ thêm / bỏ từ `4217ed4`), slot; cùng `tsc --noUnused*` | `r2-exports.log`, `keys.log`, `slots.log`, `keys-diff.log`, `tsc-unused-app.log` | mục 6.1 |

Lần chạy lỗi của probe (lỗi probe, không phải sản phẩm): `p02` lần đầu đọc trạng thái ngay sau Escape lần 2, lúc trình duyệt đã đóng hộp mà sự kiện `close` chưa mở lại (K4) → `p03` chờ rồi đọc; `p13` lần đầu thiếu bước chọn "Nhóm ban đầu" N3 → thêm; dòng đếm Lịch hẹn của `p13` đọc ra `null` (regex của probe không khớp) → không dùng số đó; `p14` lần đầu đi `#/settings` khi đang ở `#/settings/trash` để xuất file: mục Cài đặt không đổi (`Settings.tsx:31` chỉ đọc mục lúc mở, đúng chú thích "link mở ngay một mục" ở `routes.ts:13`) nên chờ nút Xuất backup hết giờ → đi qua thanh mục; `p14` B lần đầu dựng file trái luật (K11).

### 9.2 Đột biến (44)

- **vitest (20), đều KILLED** (`mutjs.log`; mỗi lượt có `served 1`, dòng cuối `repo git status --short after: ""`): R68e, R70b, R70c, N1, N2, R04g, R103e (`outcome-form.test.ts`); R84a, R84c, R84d, R84n, R84o, R84p, R84q, R84r, R93a, R93b, R94a, R94b, R99a (`trash-view.test.ts`).
- **TSX / e2e (26), trên bản dựng ngoài repo** (`e2e-mut.log`): KILLED bởi e2e nhắm (19): R68e, R68f (`appointment-outcome.spec.ts:280`), R70a, R70d (`:322`), R38c (`:478`), R38d (`:492`), R38e (`customer-policies.spec.ts:130`), R43e (`trash.spec.ts:114`), R83g (`appointment-outcome.spec.ts:399`, `:448`, `appointments.spec.ts:750`), R83h (`appointments.spec.ts:750`), R83i, R83j (`appointment-outcome.spec.ts:399`), R83k (`customer-policies.spec.ts:209`), R83l (`trash.spec.ts:265`), R84b, R84l, R84m (`trash.spec.ts:495`), R84k (`trash.spec.ts:88`), R93a (`trash.spec.ts:289`). **Sống (7):** R84e, R84f, R84g, R84h, R84i, R84j (lọc `trash.spec.ts -g "purge"` / `-g "reminds from 1 000"`) → CL3-E3; R04g-tsx (17 ca `appointment-outcome.spec.ts` + E18; cả bộ 236 / 237, đúng như bản ghim cùng lệnh — script ghi "KILLED" vì `theme.spec.ts:48`, bản ghim "CONTROL FAILED" cùng ca) → CL3-E4.
- R68e, R93a chạy cả hai đường và bị giết ở cả hai → 44 đột biến khác nhau, 46 lượt chạy.
- Đối chứng: bản ghim 4 spec gói E 70 / 70 (`e2e-base.out`); cả bộ 236 / 237 (`theme.spec.ts:48` đỏ ở mọi bản dựng chạy qua 127.0.0.1); vitest 2 file 102 / 102.
- Repo không bị ghi: `build-dist.mjs` / `mutant-config.mjs` chỉ đọc file repo, phục vụ bản đột biến qua `load` hook; mỗi lần dựng và mỗi lượt `e2e-mut.mjs` / `mutjs.mjs` in `git status --short after: ""`.

### 9.3 Chạy ngoài repo, tác dụng phụ

- Cổng: 4481 (bản ghim `dist-base`, nền suốt phiên), 4482–4489 (bản đột biến của `e2e-mut.mjs`, mỗi bản tắt sau lượt của nó), 4487 (máy chủ tạm của `dist-real` cho `p10`, tắt ngay sau). Không dùng 4173, không `PW_REUSE`. Không chạy exe (số exe lấy ở `baseline.md`; exe ở Thùng rác lớn là phần gói F).
- Đầu ra build / test / probe: `E\dist-*`, `E\pw-results\`, `E\mut\`, `E\shots\`, `E\load-del1200.p2cbackup` (16 MB).
- Không gọi dịch vụ AI, không đọc key, không mở chatgpt.com: mọi log trình duyệt ghi `requests blocked (not 127.0.0.1) []`.

### 9.4 Ranh giới đọc

Chỉ mở theo tên đầy đủ: `common\{prompt-claude.md, plan.md, known.md, fixes.md, baseline.md}`; `common\load\load-2026-10-12-seed6.p2cbackup` (qua `hooks.mjs`, Nhập backup); báo cáo lượt 3 của Claude `claude\{A,B,C,D}.md`; công cụ lượt 3 của Claude ở `claude\C\`, `claude\D\` (chép sang `E\`); probe lượt 2 của Claude gói E (`p05-perf`, `p07-web-chains`, `p15-hold-cost`, `p23-focus-after-save`, `exports`; chép sang `E\`, không ghi gì vào thư mục lượt 2); loader `hooks.mjs` + `ui-stub.mjs` của lượt 1 Claude gói E Home PC (chép thành `E\hooks-ui.mjs`, `E\r1\ui-stub.mjs`). Trong `claude\E\` chỉ kiểm file theo tên (`Test-Path`). Không liệt kê, không tìm kiếm thư mục nào ở `C:\workspace\`, `deep-review-1-6*\`; không mở thư mục `codex\` / `muse\` nào. Tìm kiếm: trong repo (`docs/reviews/raw`, mã), trong từng file được phép đọc, trong bản ghi hội thoại của chính phiên này (lấy cổng / CPU lúc đo), và **một lần** `Grep` theo thư mục trên `common\` (`*.md`, tìm số đo "1 313") — chỉ ra file của `common\` (`plan.md`, `fixes.md`, `baseline.md`, `known.md`, `perf\compare-r2.md`, `perf\table-vs-656.md`), không chạm thư mục nào khác.

### 9.5 Cuối phiên

- `git status --short` cuối phiên (`C:\workspace\Project-2C-review`, 2026-10-20 23:35): rỗng (như đầu phiên); `git rev-parse HEAD` → `119e2e45cbce54d8a3943757bd826a7f1e9b694f`.
- Máy chủ 4481 (task nền) đã dừng; không còn cổng 4470–4499 nào nghe; không còn Edge của probe, không `project2c.exe`.
- Giờ xong: 2026-10-20 23:35 (+07, giờ máy).
