XONG — claude gói E lượt 6, 2026-11-07 19:37 (+07:00)

# Deep review Phase 1–6, lượt 6 — Claude, gói E (Lịch hẹn, chỉ số, quản lý)

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên | Claude (ID `CLR6`) |
| Gói | E — Lịch hẹn, chỉ số, quản lý (`routes/{appointments,overview,reports}/**`, `routes/{Overview,Settings*,RestoreDialog,FilterBar,ConfirmWordDialog}.tsx` trừ `SettingsAi.tsx`, `routes/{trash-view,period-labels,applied-filter}.ts`, Hợp đồng `routes/customers/{CustomerPolicies,PolicyDialogs,policy-form}.*`) |
| SHA đầu phiên | `5b1328ae236aa62981dbf43066ff544a9e832c8c` (`git rev-parse HEAD` ở `C:\workspace\Project-2C-review`, khớp SHA ghim) |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 2026-11-07 18:52 (+07:00), Home PC `DESKTOP-KDURKJP` |
| Công cụ | Claude Code (app desktop, tab Code), phiên mới, worktree `C:\workspace\Project-2C-review` (detached HEAD) |
| Model / mức suy luận | Claude Opus 5.5 (`claude-opus-5-5`); mức suy luận **`max`** (đọc bằng `get_session self`: `effort: "max"`, `permissionMode: "auto"`, fast mode tắt) |
| Ultracode / Workflow | không dùng |
| Phiên làm tiếp? | không — phiên đầu của gói E |
| Node | v24.20.0 (`C:\Program Files\nodejs`, đầu PATH) |
| Bước 0 | `E.md` chưa có; `A.md`, `B.md`, `C.md`, `D.md` có đủ, dòng đầu `XONG` (kiểm bằng `Test-Path` + dòng đầu, không liệt kê thư mục) |

**Subagent: 2 lần**, công cụ Agent, `subagent_type: general-purpose`, `model: opus` (Claude Opus 5.5), `effort: xhigh`, chạy nền song song với phiên chính (≈ 18:59 → 19:25); tin nhắn giao việc nêu đường dẫn đủ của `prompt-claude.md`, chữ gói E, bảo đọc quy tắc riêng 2–4 và phần chung trước; không subagent nào gọi subagent khác, không ghi `E.md`. Cả hai dùng chung bản build của phiên chính (`E\dist-base` cổng 4911, `E\dist-real` cổng 4920); không subagent nào mở máy chủ riêng (cổng 4931–4949 dành cho chúng không dùng tới).

| Subagent | Việc giao | Probe | Thời gian |
|---|---|---|---|
| S1 | Tìm lỗi mới ở phần Lịch hẹn: mọi file `routes/appointments/**` của gói E (12 SP + 5 test), chuỗi nhiều bước qua lệnh `db` / Tổng quan / Báo cáo / hồ sơ / Thùng rác | `E\s1\` | 1 480 s, 154 lần gọi công cụ |
| S2 | Tìm lỗi mới ở Tổng quan, Báo cáo (+ Excel), `FilterBar` / `period-labels` / `applied-filter`, Cài đặt (trừ Thùng rác, AI): `Settings`, `SettingsBackup`, `SettingsDataFile`, `ConfirmWordDialog`; Hợp đồng (`CustomerPolicies`, `PolicyDialogs`, `policy-form`) | `E\s2\` | 1 406 s, 154 lần gọi công cụ |

Harness không cho subagent ghi file báo cáo ("Subagents should return findings as text"), nên cả hai trả báo cáo trong tin; phiên chính chép lại thành `E\s1\report.md`, `E\s2\report.md`.

Phiên chính làm bảng R, đọc diff `37a80b6..5b1328a` của gói, đọc trọn Thùng rác (`trash-view.ts`, `SettingsTrash.tsx`, `RestoreDialog.tsx`), chuỗi Thùng rác nhiều bước, tên dài ở dòng chỉ hiện sau thao tác, tên truy cập trùng ở Lịch hẹn, và **kiểm lại mọi phát hiện của S1, S2 trên code**: đọc lại từng vị trí (cả ADR-0007, mockup, `nghiem-thu-v1.md`, sổ và báo cáo cũ để biết đã biết chưa), **chạy lại 16 probe của subagent trên bản ghim** (`E\v\v-*.log`), và dựng tiếp chuỗi của S1-5 tới lúc lưu (`p55`). Phát hiện của subagent mang ID `CLR6-E…` ở mục 5, ghi rõ ai tìm; S2-4 gộp vào CLR6-E3 (cùng họ tên nút trùng).

Probe / log của phiên: `C:\workspace\deep-review-1-6-r6\claude\E\`.

## 2. Bảng R

Cách làm chung (mọi probe, log ở `C:\workspace\deep-review-1-6-r6\claude\E\`):

- **Probe lượt 5 của chính Claude E** chép theo tên đầy đủ mà báo cáo gốc lượt 5 (`docs/reviews/raw/2026-11-05/claude/E.md` §9.1) ghi, `Test-Path` từng tên, vào `E\r5copy\` (31 file, không liệt kê thư mục `-r5`). Bản làm việc ở `E\` do `make-working.mjs` dựng: chỉ đổi đường dẫn `-r5` → `-r6` và cổng 4811 → **4911** (bản ghim), 4812–4819 → 4912–4919 (bản đột biến), 4820 → 4920 (bản không neo). `e2e/support.ts`, `fixtures.ts`, `serve.mjs`, `playwright.config.ts` không đổi từ `2e51e25` (`git diff --stat 2e51e25 5b1328a -- …` rỗng), nên `browser.mjs` (chặn mạng ngoài localhost / 127.0.0.1, thay `window.open` / clipboard từ lần chạy đầu, `asExe` bản JS) và `pw.config.mjs` dùng nguyên.
- **Bản web ngoài repo:** `E\dist-base` (Vite `build()` của worktree ghim, neo 15/09/2026 + ảnh chụp demo như `e2e/serve.mjs`; cổng 4911) và `E\dist-real` (không neo; cổng 4920). `git status --short after: ""` sau mỗi lần dựng (`build-base.log`, `build-real.log`). Không cổng 4173, không `pnpm e2e`, không `PW_REUSE`, không chạy exe.
- **Gỡ tạm phần sửa:** `E\mut-list.mjs` — 42 đột biến lượt 6 cho bảng R (mỗi đột biến thay đúng chữ ở một hay hai chỗ; `check-muts.mjs` 42 / 42 áp đúng một lần, `check-muts.log`), sau thêm `S2M3e` để kiểm một đột biến sống của S2 (43 / 43). Vitest qua hook `load` (`mutjs.mjs` + `mutant-config.mjs`; chỉ tính khi có `[mutant] served`); TSX qua bản dựng đột biến ngoài repo (`e2e-mut.mjs`: **KILLED chỉ khi một ca xanh ở đối chứng đỏ ở bản đột biến**, so theo tên ca). Đối chứng: vitest 3 file (`trash-view.test.ts`, `appointment-form.test.ts`, `domain/text.test.ts`) **161 / 161** (`vitest-control.log`); e2e 5 spec (`trash`, `customer-policies`, `appointments`, `dialog-keyboard`, `long-names`) trên `dist-base` **82 / 82** (63 s, `e2e-mut.log`). Repo không bị ghi: dòng cuối `mutjs.log`, `e2e-mut.log` là `git status --short after: ""`.

### 2.1 Bảng R1 (5 dòng của gói E)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-160 (phần màn: tên nút khôi phục ở Thùng rác; mã KH trong `TrashOwner` và luật nhập 15: `claude\A.md`) | #1050 → #1072 (+ #1082 → #1088, #1094 → #1097, #1101 → #1109) | **ĐÃ SỬA** (phần gói E) | Theo mô tả tổng hợp lượt 5 §6.1 (a) lịch hẹn / HĐ của hai KH cùng tên, (b) hai nhân sự trùng tên / vai trò / team, và CXR5-A1 / A2, CLR5-A1. **Trên màn** (`p50-namesakes-screen.mjs 4911`, `p50-namesakes-screen.log`; dữ liệu vào bằng xuất → sửa bảng → nhập như `importChanged` của e2e): hai KH "Trần Thu Hà" (K-HT2A, K-MT8R), mỗi KH một HĐ đã xóa cùng ngày nộp, cùng FYP → "Khôi phục HĐ Nộp 10/09/2026 · 24.000.000 ₫ · Đã nộp của KH Trần Thu Hà (K-MT8R)" / "… (K-HT2A)" (lượt 5: hai tên trùng); ba nhân sự "Phạm Văn Trùng · RE · Sao Mai" xóa 08:31:05, 08:31:40, 09:15 → "… · xóa lúc 12/09/2026 08:31:05" / "… 08:31:40" / "… 09:15"; **14 dòng, 14 tên nút khác nhau**. **Gỡ sửa:** `R160a` (lịch / HĐ của KH trùng tên không mang mã) **KILLED** 3 ca `trash-view.test.ts`; `R160b` (vế "của KH" bỏ mã) **KILLED** 3; `R160c` (không tách nhân sự trùng) **KILLED** 4 (`mutjs.log`); `R160s` (màn đặt tên nút với `new Map()`) **KILLED** `trash.spec.ts:663` (`e2e-mut.log`) | Hoa / thường, chỗ đặt dấu thanh → `claude\A.md` **CLR6-A1** (không báo lại). Team đã xóa trùng tên một team **đang dùng** (`p50`, dòng "Hồ Thị Yến"): dòng lý do "Khôi phục team Sao Mai trước.", "Thuộc" "Team Sao Mai (đã xóa)"; dòng của chính team đó "Đã có team Sao Mai — đổi tên team kia trước." (E16): chuỗi đọc được, chỉ một team trùng tên trong Thùng rác nên không có vế "xóa lúc" (đúng phạm vi Q1 (a) / T-380) — không ghi. Hai dòng cùng giây xóa (chỉ khi đồng hồ máy lùi hay file sửa tay): hai dòng giống hệt ở mọi cột nên tên nút cũng giống — đúng nguyên tắc "cái gì tách hai dòng thì tách hai nút", không ghi |
| DR6-172 | #1050 → #1072 (+ #1082 → #1088) | **ĐÃ SỬA** | **Tái hiện lượt 5 chạy lại** (`p40-invisible-more.mjs 4911`, phần C, `p40-invisible-more.log`): 6b "Khách hàng" và Thùng rác "Tìm theo tên" với U+200B đứng trước / NBSP thay dấu cách / hai dấu cách → **6b 1 khớp, Thùng rác 2 dòng** cả bốn dạng (lượt 5: 0 khớp, "Không có KH khớp." / "Không có bản ghi đã xóa nào khớp."); U+200B giữa chữ "Bù​i" → 6 khớp như "Bùi". **Gỡ sửa:** `R172a` (Thùng rác: chữ gõ qua `trim()` như trước) **KILLED** 2 ca `trash-view.test.ts` ("finds a name pasted with…", "keeps every row for text of invisible characters alone…"); `R172b` (6b: như trước) **KILLED** `appointment-form.test.ts` + `appointments.spec.ts:425`; `R172c` (6b hỏi trống bằng `trim()`) **KILLED** `appointments.spec.ts:425` | Hàm chung `searchText` ở `@p2c/domain` (T-377; gỡ ở domain: `claude\A.md` R2). Không còn ô tìm nào khác (`claude\A.md` K9) |
| DR6-173 | #1050 → #1072 | **ĐÃ SỬA** | **Tái hiện lượt 5 chạy lại** (`p40` phần A): 8a FYP nộp U+200B, U+2060 + U+0085, Ngày nộp U+200B → **không `aria-invalid`, không câu lỗi trước khi bấm Lưu** (lượt 5: "Chưa nhập số tiền." / "Nhập ngày." ngay); U+200B + "15/9", U+200B + "50tr" đọc "Thứ Ba 15/09/2026", "50.000.000 ₫ (50 tr)". **Gỡ sửa:** `R173a` (`shown` về `trim()`) **KILLED** `customer-policies.spec.ts:135` (8a) và `:165` (8b); `T377d` (chỉ hai ô phát hành về `trim()`) **KILLED** `:165` | 8a–8d là một component (`PolicyDialog`, `PolicyDialogs.tsx:46`), `shown` dùng ở bốn ô (`:84`, `:87`, `:89`, `:93`); 8c / 8d (sửa) dùng cùng hàm |
| DR6-174 | #1050 → #1072 (a, b), #1049 → #1070 (c) | **ĐÃ SỬA** | Ba đột biến sống của lượt 5 nay bị giết (`e2e-mut.log`): (a) **E154d** (10a nhập lại khi bấm nút đang chạy) **KILLED** `dialog-keyboard.spec.ts:186`; (b) **E350c** (màn Thùng rác truyền ngày 1900 cho cột) và **E350d** (hộp khôi phục đọc ngày 1900) **KILLED** `trash.spec.ts:199`; (c) **E148e** (cột Team của Theo RE không bọc span) **KILLED** `long-names.spec.ts:251`. Hành vi trên bản ghim (`p34r5-confirm-focus.mjs 4911`, `p34r5-confirm-focus.log`): 11i / 10c / 10a lúc chạy, Enter + Space + click lên nút "Đang …" → **1 backup** mỗi hộp; focus ở nút `aria-disabled` | Ca mới của (b) chỉ có lịch Dự kiến đã qua; phần màn của T-380 (`teams`) không ca nào giữ → **CLR6-E2** (cùng loại test hở, dòng R2 T-380) |
| DR6-170 (phần gói E: (3) Lịch hẹn, (4) Thùng rác, (5) thẻ Hợp đồng, (7) "Đang xem", (8) tiêu đề chart team; meta Tổng hợp của PR #1070; (1), (2), (6): `claude\D.md`; (9): `claude\C.md`) | #1049 → #1070 (+ #1081 → #1092) | **ĐÃ SỬA** (phần gói E); biến thể còn hở → **CLR6-E1**; hai phần sửa không ca nào giữ → **CLR6-E2** (b), (c) | **Tái hiện lượt 5 chạy lại** (`p41-long-names-e.mjs 4911`, `p41-long-names-e.log`; RE `R`×160 đổi qua hộp Sửa nhân sự, KH `K`×81 qua 5a): Lịch hẹn bảng + chi tiết `scrollWidth` 1 100 / 1 440 = cửa sổ (lượt 5: 2 038 / 2 324); Thùng rác 1 100 / 1 440 (lượt 5: 1 992); hồ sơ có thẻ Hợp đồng 1 100 (lượt 5: 1 392); góc nhìn RE ở Báo cáo / Tổng quan / Lịch hẹn = cửa sổ, ô chọn rộng 320 px (lượt 5: 1 367 px, trang 1 932–2 037); Tổng quan team 160 và Báo cáo Theo RE như lượt 5 (cột ghim 257 px, 11 / 18 ô số thấy ở 1 100). Mọi dòng `"over":[]`. **Gỡ sửa** (16 đột biến, ca quét `long-names.spec.ts:357`; `e2e-mut.log`): **14 KILLED** — Lịch hẹn nút KH (`R170-3-btn`), ô RE (`-3-re`), `h2` / `dd` của chi tiết (`-3-h2`, `-3-dd`), team / RE của bảng ngày (`-3-h3`, `-3-h4`), dòng tóm tắt góc nhìn (`-3-sum`); Thùng rác ô "Thuộc" (`-4-owner`), tên ở "Bản ghi" (`-4-named`), dòng lý do chặn (`-4-blocked`); RE của thẻ HĐ (`-5`), "Đang xem" (`-7`), tiêu đề chart team (`-8`), meta Tổng hợp (`-meta`). **2 SỐNG**: `R170-4-cap` (bỏ trần `max-w-96` của "Thuộc"), `R170-4-kept` (dòng lý do giữ lại không ngắt) → CLR6-E2 (b), (c) | Trần `max-w-60` của `CELL_NAME` / nút tên KH ở Lịch hẹn không ca nào giữ: `claude\D.md` **CLR6-D3** (không báo lại). Dòng chỉ hiện sau một thao tác (11e, "Đã tạo … ngoài góc nhìn") còn tràn → **CLR6-E1**. Tên dài có dấu cách: không tràn (lượt 5 `p41b`, code bọc không đổi từ đó) |

### 2.2 Bảng R2 (3 Issue của gói E)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-377 (phần E: tên nút tới giây, team trùng tên, đổi tên `codedCustomers`, e2e 8b; `searchText` về domain: `claude\A.md`) | #1082 → #1088 | **ĐÃ SỬA** | Test chấp nhận trên code: `byDeletion` (`trash-view.ts:239-246`) thêm giây khi chữ phút cũng trùng; `toldApart` (`:258-283`) tách team trùng tên (`byDeletion(teams, …)`, `:280`); `restoreLabel(row, told, today)` (`:327`); `git grep -n codedCustomers 5b1328a` → chỉ còn trong `docs/reviews/raw/**` (0 trong `apps`, `packages`, `e2e`, `tools`); ca 8b `customer-policies.spec.ts:165`. **Trên màn** (`p50`): ba nhân sự trùng (08:31:05 / 08:31:40 / 09:15), hai team "Sao Khuê" xóa 10:00:05 / 10:00:40 → "Khôi phục team Sao Khuê · xóa lúc 10/09/2026 10:00:05" / "… 10:00:40", hai team "Sao Băng" khác phút → "… 05/09/2026 08:33" / "… 09/09/2026 14:20". **Gỡ sửa:** `T377a` (không bao giờ tới giây) **KILLED** 5 ca; `T377b` (không tách team trùng) **KILLED** 8; `T377c` (tới giây với mọi dòng trùng, kể cả khác phút) **KILLED** 8 (`mutjs.log`); `T377d` (hai ô phát hành 8b hỏi trống bằng `trim()`) **KILLED** `customer-policies.spec.ts:165` | Ghi chú gom (5 mục review #1072, RESOLVED ở `fixes.md`): không hỏng lại. Team trùng tên một team đang dùng: xem dòng R1 DR6-160 |
| T-380 | #1094 → #1097 | **ĐÃ SỬA**; phần màn (truyền `teams` cho dòng lý do, ô "Thuộc", hộp khôi phục) không ca nào giữ → **CLR6-E2** | Test chấp nhận trên code: `teamsDeletedAt` (`trash-view.ts:293-303`), `blockedReason(row, block, teams?)` (`:373`, nhánh `:384-385`), `ownerParts(row, teams?)` (`:192`), `goneText` (`:210`), `restoreRow(app, row, teams?)` (`:668`); `SettingsTrash.tsx:335` dựng `teams` từ mọi dòng, truyền ở `:83`, `:94`, `:423`; `RestoreDialog.tsx:33`. **Trên màn** (`p50`): RE "Đỗ Văn Xuân" của team "Sao Băng" đã xóa → dòng lý do "Khôi phục team Sao Băng (xóa lúc 05/09/2026 08:33) trước.", "Thuộc" "Team Sao Băng (đã xóa lúc 05/09/2026 08:33)", đúng chữ nút "Khôi phục team Sao Băng · xóa lúc 05/09/2026 08:33"; hai RE "Vũ Văn Hai" của hai team "Sao Khuê" → "(xóa lúc 10/09/2026 10:00:05)" / "(… 10:00:40)", đúng nút của từng team. **Gỡ sửa ở `trash-view.ts`:** `T380a` (câu lý do bỏ `teams`) **KILLED** 3; `T380b` (`ownerParts` bỏ `teams`) **KILLED** 1; `T380c` (`goneText` bỏ giờ) **KILLED** 1; `T380d` (`restoreRow` không truyền `teams`) **KILLED** 1. **Gỡ phần màn** (`e2e-mut.log`): `T380s1` (dòng lý do không nhận `teams`), `T380s2` ("Thuộc" không nhận `teams`), `T380s3` (hộp khôi phục không truyền `teams`), `T380s4` (`teams` dựng từ 0 dòng) **cả bốn SỐNG**, 13 / 13 `trash.spec.ts` | Thân PR #1097 tự ghi "không có test component cho màn này; kiểm bằng typecheck + đọc code"; e2e làm được (như ca T-350 của T-368) |
| T-382 (phần E: helper `deletionWords`; ca capability: `claude\B.md`) | #1101 → #1109 | **ĐÃ SỬA** | `deletionWords` (`trash-view.ts:310-314`, không export) dùng ở `teamsDeletedAt` (`:299`) và `restoreLabel` (`:339`); `git grep -c "by === 'minute' \|\| by === 'second'" 5b1328a -- apps/desktop/src/routes/trash-view.ts` → **1**. Chữ trên màn không đổi: `p50` cho cùng chữ như test chấp nhận của T-377 / T-380. **Gỡ sửa:** `T382a` (helper bỏ giây) **KILLED** 5; `T382b` (helper chỉ nhận `minute`) **KILLED** 5 | — |

## 3. Phạm vi đã đọc

**Diff `37a80b6..5b1328a` của gói E** (`git diff --numstat -M`, xếp theo `common\files-E.txt`; `E\fix-diff.patch`, 1 202 dòng): 14 file, SP +274 / −80 ở 12 file, test +334 / −10 ở 2 file (= `baseline.md`). 6 commit chạm gói E: #1070 (`dd5ae56`, T-367), #1072 (`e9f2eb1`, T-368), #1088 (`20c51e3`, T-377), #1092 (`64720db`, T-376), #1097 (`5d07d5e`, T-380), #1109 (`4d38a72`, T-382). **Phiên chính đọc từng hunk của cả 14 file** (`FilterBar.tsx`, `RestoreDialog.tsx`, `SettingsTrash.tsx`, `AppointmentDialog.tsx`, `AppointmentsScreen.tsx`, `appointment-form.ts` + test, `CustomerPolicies.tsx`, `PolicyDialogs.tsx`, `StageBlock.tsx`, `ReportTable.tsx`, `ReportsScreen.tsx`, `trash-view.ts` + test), và đọc hết ở SHA ghim `trash-view.ts` (841 dòng), `SettingsTrash.tsx` (443), `RestoreDialog.tsx` (72); `trash-view.test.ts`: phần mới của diff (+313 dòng, 23 ca mới) đọc hết, ca cũ qua tên ca và 14 đột biến vitest.

**Phần còn lại của gói, từng file của `common\files-E.txt` (52 file: 38 SP, 14 test)** — ai đọc:

| Nhóm file | Đọc hết | Không đọc kỹ (và vì sao) |
|---|---|---|
| Thùng rác: `trash-view.ts` (+ test), `SettingsTrash.tsx`, `RestoreDialog.tsx` | phiên chính | `trash-view.test.ts` ca cũ (trước diff): tên ca + 14 đột biến vitest |
| Lịch hẹn: `AppointmentsScreen`, `AppointmentDialog`, `OutcomeDialog`, `EditOutcomeDialog`, `MetFields`, `RescheduleDialog`, `RescheduleFields`, `DeleteAppointmentDialog`, `YearGrid` (`.tsx`), `appointment-form`, `appointments-view`, `outcome-form` (`.ts`), `DateSuggestion.test.tsx`, `MetFields.test.ts` | S1 (phiên chính đọc lại mọi hunk của diff, `AppointmentsScreen.tsx:150-230`, `:279-285`, `:380-475`, `:548-600`, `:654-660`, `AppointmentDialog.tsx:225-310`, `:386-394`, `OutcomeDialog.tsx:70-90`, `:200-245`, `appointments-view.ts:72-84`, `:370-416`, `outcome-form.ts:180-235`, `YearGrid.tsx:85-100`, `RescheduleFields.tsx:120-134`) | `appointments-view.test.ts`, `appointment-form.test.ts` (ngoài phần diff), `outcome-form.test.ts`: S1 đọc tên ca, độ chặt đo bằng 26 đột biến vitest (25 giết) |
| Tổng quan / Báo cáo: `Overview.tsx`, `overview/**` (7 SP + 4 test), `reports/**` (5 SP + 2 test), `FilterBar.tsx`, `period-labels.ts`, `applied-filter.ts` (+ test) | S2 (phiên chính đọc lại hunk diff, `OverviewTiles.tsx:15-66`, `Overview.tsx:40-60`, `ReportsScreen.tsx:50-78`, `report-workbook.ts:88-120`) | 7 file test: S2 đọc tên ca và `report-workbook.test.ts:195-214`, độ chặt đo bằng 12 đột biến vitest (10 giết, 1 tương đương, 1 do e2e giữ) |
| Cài đặt: `Settings.tsx`, `SettingsBackup.tsx`, `SettingsDataFile.tsx`, `ConfirmWordDialog.tsx` | S2 (phiên chính đọc lại `SettingsBackup.tsx:100-170`, `:285-302`, `ConfirmWordDialog.tsx:92-100`) | — |
| Hợp đồng: `CustomerPolicies.tsx`, `PolicyDialogs.tsx`, `policy-form.ts` (+ test) | S2 (phiên chính đọc lại hunk diff, `PolicyDialogs.tsx:70-110`, `:248-262`, `CustomerPolicies.tsx:70-106`, `policy-form.ts:240-256`) | `policy-form.test.ts`: S2 đọc tên ca |

Không file nào của `files-E.txt` bị bỏ không đọc. S1, S2 đọc thêm chỗ gói khác mà gói E gọi (`db` `appointments`, `counts`, `policies`, `person-references`, `team.ts:80-279`; `domain` `appointment-counts`, `stats`, `compare`, `stage-snapshot`, `name-order`, `text`, `pipeline-stage`, `period` (một phần); `data/{tables,today,AppDataContext}`, `app-data.ts` (một phần); `shell/{scope,ScopePicker,ScopeContext}`; `ui` `DataTable`, `table-view`, `PeriodPicker`, `Dialog`, `dialog-focus`), spec Phase 3 §3.5–§4, §6, Phase 4 (đủ), golden `lich-hen.md`, ADR-0007, mockup `appointment-forms.html`, `appointments.html`, `phase-3-feedback.html` B4 / B5, `overview.html`, `settings-data.html`, `policy-forms.html`, các dòng NT-LH / NT-TQ / NT-BC / NT-CD / NT-DB / NT-HS của `nghiem-thu-v1.md`. Không đọc kỹ (subagent ghi): `money.ts`, `number.ts`, `backup-validation.ts`, `db/settings.ts`, `TextField` / `SelectField` (chỉ chỗ dùng); golden `chi-so.md` / `kh-theo-nhom.md` chỉ grep (test golden của domain giữ; số trên màn đối chiếu bằng chuỗi `pe` của S2, 594 ca).

**Chỗ gói khác nối vào (phiên chính):** `packages/db/src/schema.ts:42-75` (team, nhân sự), `packages/db/src/backup-validation.ts:428-448` (`storedKycHash` — để dựng file nhập), `apps/desktop/src/routes/classes.ts` (`ALERT`, `CELL_NAME`), `packages/ui/src/components/Dialog.tsx:84` (`wrap-anywhere`), `apps/desktop/src/routes/customers/CustomersScreen.tsx:182-197` (dòng "ngoài góc nhìn", gói D), `apps/desktop/src/i18n/vi.ts` (khóa `trash.*`, `*.createdOutside`, `appointments.linkedOutside`); e2e `trash.spec.ts` (đủ phần trợ giúp `:1-100`, `:196-222`, `:416-536`, `:585-687`), `long-names.spec.ts` (`:1-90`, `:338-534`), tên ca của `customer-policies.spec.ts`, `dialog-keyboard.spec.ts`, `appointments.spec.ts:422-425`; `e2e/support.ts:100-121`, `:310-323`.

**Tài liệu (phiên chính):** `CLAUDE.md` gốc, `apps/desktop/CLAUDE.md`, `packages/db/CLAUDE.md`, `.claude/rules/{i18n-ui,tests}.md`; `docs/design/phase-6-hoan-thien.md` §4.2 (TR-1…TR-13, màn, E1–E20, D1–D13); `common\{prompt-claude.md (đủ), known.md (phần 1 OPEN / ACCEPTED, K40–K50, phần 3, bảng R1 / R2), fixes.md (T-367, T-368, T-377, T-380, T-382 và nhóm RESOLVED), baseline.md (đủ), plan.md (§L6.0–§L6.4)}`; tổng hợp lượt 5 §6; báo cáo gốc lượt 5 Claude E (đủ); `claude\A.md` (mục 1–5 đầu, CLR6-A1), `claude\C.md` (ID, CLR6-C4), `claude\D.md` (mục 1–4, ID, CLR6-D3) để không báo trùng; `claude\B.md` (ID).

## 4. Kịch bản đã thử

Mọi probe trình duyệt của phiên chính: Edge headless (`E\browser.mjs`), chặn mạng ngoài localhost / 127.0.0.1 và thay `window.open` / clipboard từ lần chạy đầu; mọi log kết thúc `requests blocked (not localhost / 127.0.0.1) []`, `page errors []`.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| K1 | Tái hiện lượt 5 của DR6-172 / 173 (`p40`): ô KH 6b và "Tìm theo tên" với U+200B / NBSP / hai dấu cách; 8a Ngày / FYP chỉ có ký tự vô hình; ô Giờ 6b các dạng | Tìm ra cả bốn dạng; 8a không báo trước khi Lưu; ô Giờ như lượt 5 | R1 DR6-172, 173 |
| K2 | Tái hiện lượt 5 của DR6-170 trên màn gói E (`p41`): KH 81 + RE / team 160, góc nhìn RE ở ba màn, 1 100 / 1 440 | Không màn nào cuộn ngang; ô chọn 320 px | R1 DR6-170 |
| K3 | Hộp xác nhận lúc chạy (`p34r5`): 11i / 10c / 10a, Enter + Space + click lên nút "Đang …" | 1 backup mỗi hộp; focus ở nút `aria-disabled` | R1 DR6-174 (a) |
| K4 | Thùng rác với tên trùng mọi loại qua file nhập (`p50`): hai KH cùng tên có HĐ đã xóa; ba nhân sự trùng (hai cùng phút); hai team "Sao Khuê" cùng phút, hai team "Sao Băng" khác phút, RE của mỗi team; team đã xóa trùng tên một team đang dùng | 14 dòng, 14 tên nút khác nhau; dòng lý do / "Thuộc" mang đúng chữ "xóa lúc" của nút team; team trùng tên team đang dùng: câu E16, không vế "xóa lúc" (đúng phạm vi) | R1 DR6-160, R2 T-377, T-380 |
| K5 | Gỡ phần sửa của bảng R: 14 đột biến vitest, 29 đột biến e2e (`mutjs.mjs`, `e2e-mut.mjs`) | Vitest 14 / 14 KILLED; e2e 23 KILLED, 6 SỐNG (`T380s1`–`s4`, `R170-4-cap`, `R170-4-kept`) | R1, R2, CLR6-E2 |
| K6 | Chạy `p50` trên bản đột biến `T380s4` (cổng 4916) | Dòng lý do / "Thuộc" quay về "Khôi phục team Sao Khuê trước." / "(đã xóa)" cho cả hai RE, e2e vẫn xanh | CLR6-E2 (a) |
| K7 | Khôi phục ở Thùng rác với tên liền dài (`p51`): team `G`×160, KH `K`×81, lịch hẹn của KH đó; đo thông báo 11e và hộp 11b ở 1 100 / 1 440 | Team: trang 1 652 px ở cả hai bề rộng; KH: chữ chờm 8 px qua thẻ; lịch hẹn, hộp 11b: không tràn | CLR6-E1 |
| K8 | Tạo ngoài góc nhìn với RE `R`×160 (`p52`): góc nhìn team khác, "+ Khách hàng" `K`×81, rồi "+ Lịch hẹn" | Dòng "Đã tạo … ngoài góc nhìn" làm trang 1 392 px ở 1 100 (Khách hàng và Lịch hẹn) | CLR6-E1 |
| K9 | Mọi dòng `role="status"` / `role="alert"` / `aria-live` của app có chữ người dùng (`rg`, 50 dòng) | Sai ba chỗ của CLR6-E1; vùng AI là CLR6-C4; còn lại có `break-all` / `wrap-anywhere` hay không mang tên | CLR6-E1 |
| K10 | Dòng giữ lại (TR-12) và trần "Thuộc" qua file nhập: Dời lịch đã xóa còn lịch dời từ nó, RE `R`×160 và team `T`×160 đã xóa (`p53`, bản ghim + hai bản đột biến) | Bản ghim không tràn; bỏ `wrap-anywhere` của dòng giữ lại → trang 1 837 px; bỏ trần → cột đổi bề rộng | CLR6-E2 (b), (c) |
| K11 | File dựng có KH đã xóa mà RE là người đã xóa ở team đã xóa (`p53-check.mjs`, `readBackup` trong Node) | Luật nhập 5 từ chối (`BACKUP_INVALID {"rule":5}`): đúng luật, chỉ là dữ liệu probe | — |
| K12 | Chi phí phần Thùng rác mới trong Node (`p32r6`): `toldApart`, `teamsDeletedAt`, một lần vẽ mọi dòng trên 113 / 1 313 dòng | 0,03 / 0,73 ms; 0,00 / 0,01 ms; 0,37 / 3,51 ms (lượt 5 `codedCustomers` 0,01 / 0,56, vẽ 0,35 / 2,59); 113 / 113 và 1 313 / 1 313 tên nút khác nhau | — |
| K13 | Tên truy cập của nút / link trong bảng Lịch hẹn, từng kỳ Ngày / Tuần / Tháng / Năm (`p54`, seed 15/09/2026) | Tuần: "Lê Thị Hương" ×2 (hai KH), "Hồ Minh Dũng" ×2 (một KH, hai lịch) | CLR6-E3 (a) |
| K14 | Chạy lại 16 probe của S1, S2 trên bản ghim (`v\v-*.log`) | Mọi phát hiện của subagent tái hiện đúng như tin trả về | CLR6-E3…E15 |
| K15 | S1-5 tới lúc lưu (`p55`): 6b, ArrowDown ×2 trên "+ thêm" đang đóng, Tạo lịch hẹn; tìm vùng thông báo, đường sửa người phối hợp | Lịch lưu với 2 người phối hợp; 0 vùng thông báo; Chi tiết chỉ có Ghi kết quả / Dời lịch / Xóa | CLR6-E4 |
| K16 | Chỗ hỏi trống bằng `trim()` còn trong `routes/`, `shell/` (`rg "\.trim\(\)\|trimStart\|trimEnd"`, 6 chỗ) | `appointment-form.ts:92`, `outcome-form.ts:213`, `policy-form.ts:250`: đều hỏi trống bằng `normalizeText` hay chỉ cắt chữ hiện; ba chỗ còn lại thuộc gói C | — |
| K17 | API nguy hiểm trong 38 file SP gói E (`rg "dangerouslySetInnerHTML\|innerHTML\|eval\(\|new Function\|window\.open\|localStorage\|console\.\|@ts-ignore\|eslint-disable"`) | Chỉ `SettingsTrash.tsx:325` `eslint-disable-next-line` (ACCEPTED, review #630) | — |

**Kịch bản của S1** (Lịch hẹn; probe, log ở `E\s1\`; dòng có ID đã được phiên chính chạy lại):

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| S1-K1 | Tùy chọn 25/05–10/06/2026, 15/04–14/07/2026; đối chứng 25/06–10/07 (`p01`) | Hai kỳ đầu không tới được tháng sau ranh CN; đối chứng tới được | CLR6-E5 |
| S1-K2 | Đồng hồ 15/03/2027: Năm → Tùy chọn 01/01–31/03/2027 (`p01b`) | Chỉ tới tháng 03/2027 | CLR6-E5 |
| S1-K3 | Đồng hồ 28/12/2026: gõ `5/1` ở ngày hẹn tiếp 6c / 6i, ở 6h, 6e (`p02` A–C) | 6c không nút "Dùng"; 6h, 6e có | CLR6-E6 |
| S1-K4 | Dời lịch 29/12/2026 → 05/01/2027, cột Kết quả (`p02` D) | "Dời sang 05/01" | CLR6-E11 |
| S1-K5 | Enter trên ô tháng của lưới năm (`p03` A) | Focus `BODY` | CLR6-E7 |
| S1-K6 | Enter trên tên KH ở "Trong ngày"; Esc ở 6e (`p03` C, D) | Focus ở lại nút tên; Esc trả focus về "Dời lịch" | — |
| S1-K7 | 6b bằng phím: KH khớp, "Dùng 05/01/2027", chip người phối hợp, "Đổi KH" (`p04`) | Ba nút đầu `BODY`; "Đổi KH" vào ô tìm | CLR6-E7 |
| S1-K8 | "Dùng …" ở 6e; chip ở 6f (`p04b`) | Cả hai `BODY` | CLR6-E7 |
| S1-K9 | Bấm tên KH ở dòng 3 của danh sách (`p05` A) | Dòng không tô, không `aria-selected` | CLR6-E9 |
| S1-K10 | Tuần 31/08–06/09, Enter trên ô "→" (`p05` B) | Focus giữ ở ô vừa bấm; lịch sang 09 | — |
| S1-K11 | ArrowDown ×3 trên "+ thêm" người phối hợp (`p06`) | Mỗi lần thêm một người | CLR6-E4 |
| S1-K12 | 6c mở 23:50 cho lịch ngày mai, đồng hồ trang qua 00:00 (`p07`) | Bốn ô trạng thái bật sau nửa đêm, câu "Lịch chưa tới ngày" mất, ô hôm nay sang 16/09 | — |
| S1-K13 | Biên năm: tuần 28/12/2026–03/01/2027, ô 01/01/2027, Ngày / Năm ‹ › qua năm (`p08`) | Đúng | — |
| S1-K14 | 26 đột biến vitest trên `appointments-view`, `appointment-form`, `outcome-form` | 25 giết; S1M05 sống (tương đương: CHECK `stage_after` chỉ khi MET) | — |
| S1-K15 | Đọc chuỗi bàn giao → khôi phục lịch Dự kiến; dời lịch giữ RE; xóa / đổi vai trò người phối hợp | Đúng spec §4, TR-1; `PERSON_IN_USE` / `COORDINATOR_IN_USE` chặn | — |

**Kịch bản của S2** (Tổng quan, Báo cáo, Cài đặt, Hợp đồng; probe, log ở `E\s2\`; dòng có ID đã được phiên chính chạy lại):

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| S2-K1 | Enter trên "Xuất Excel" / "Xuất backup", web và asExe (`pa`) | Excel: `BODY`; backup giữ focus (chạy đồng bộ trước lần render) | CLR6-E8 |
| S2-K2 | Như trên trên dữ liệu tải (`pb`, 4920) | Backup 344–434 ms giữ focus; Excel 173 ms `BODY` | CLR6-E8 |
| S2-K3 | asExe, `export_write` trễ 5 / 20 / 40 / 100 ms (`pc`) | Cả hai nút `BODY` | CLR6-E8 |
| S2-K4 | Năm, Enter "Kỳ sau" 74 lần tới 2100 (`pk`) | `›` tắt dưới focus: `BODY` | CLR6-E8 |
| S2-K5 | Tên team / RE có `=…`, `@…`, `+…`, `<b>`, `&`, ngoặc kép, emoji, `_xHHHH_` → Excel (`pd`) | 0 công thức; `_xHHHH_` đọc ra chữ khác | CLR6-E10 |
| S2-K6 | Dữ liệu tải, 9 kỳ × (Toàn bộ, 4 team, 6 RE); RE chuyển team; team hết RE; hôm nay 30/09, 01/01, CN 11/10 (`pe`, 594 ca) | 0 lệch giữa ô Tổng quan, chart, So sánh team, các bảng Báo cáo, Excel | — |
| S2-K7 | 8a → 8b → 8d → xóa → khôi phục → 5c đổi RE → xóa KH → khôi phục → xóa RE của HĐ (`pf`) | Khung 8d khớp chênh thật; RE của HĐ sống: `PERSON_IN_USE` | — |
| S2-K8 | Các cách gõ chữ xác nhận 10c (`pg`) | Đúng D1; nhãn không in đậm | CLR6-E15 |
| S2-K9 | Cấp tiêu đề Tổng quan / Báo cáo (`ph`) | KPI h3 dưới h2 ô Lịch hẹn; hai vùng không tiêu đề | CLR6-E14 |
| S2-K10 | Hai HĐ cùng ngày nộp, cùng FYP, phát hành 05/09 và 06/09 (`pi`) | Hai nút "Sửa" cùng tên | CLR6-E3 (b) |
| S2-K11 | asExe: `db_backup` lỗi ở 10a, 10c; tạo team; lưu lỗi `DISK_FULL` sau nhập (`pj`) | Câu đúng NT-DB-10 / NT-CD, focus về nút mở hộp, lệnh ghi sau đó chạy | — |
| S2-K12 | 8b cùng tháng (nộp 02/09, phát hành 15/09 và 03/09) (`pl`) | Câu "vẫn tính …" hiện cả khi cùng tháng | CLR6-E13 |
| S2-K13 | 12 đột biến vitest (`mutjs-s2`) | 10 giết, 2 sống (S2M1 tương đương; S2M3 do `e2e/overview.spec.ts:85` giữ, chưa chạy e2e) | — |

## 5. Phát hiện mới

### CLR6-E1 — Tên liền dài còn kéo trang cuộn ngang ở các dòng chỉ hiện sau một thao tác: thông báo "Đã khôi phục …" (11e) và dòng "Đã tạo … ngoài góc nhìn" (Lịch hẹn, Khách hàng)

```
ID: CLR6-E1
Mức: Low
Trục: E (A)
Vị trí: apps/desktop/src/routes/SettingsTrash.tsx:189-224 (`Done`: tiêu đề `<b className="block font-semibold">{title}</b>` :211, dòng phụ `<span className="text-fg-2">{children}</span>` :212; dùng cho 11e ở :229-235); apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:279-285 (`<p … role="status" className={`${ALERT} border-info text-sm`}>`, khóa `appointments.createdOutside` / `linkedOutside` với `{re}`); apps/desktop/src/routes/customers/CustomersScreen.tsx:189-197 (gói D: `customers.createdOutside` với `{name}`, `{re}`); `ALERT` không có `wrap-anywhere` (apps/desktop/src/routes/classes.ts:30) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-170 (T-367 #1049 → PR #1070: ca quét `e2e/long-names.spec.ts:357` chỉ quét màn ở trạng thái tĩnh, không khôi phục, không tạo ngoài góc nhìn), họ DR6-117 / 148 / 170; cùng họ CLR6-C4 (vùng AI) · có từ trước, lượt 1–5 bỏ sót
```

- **Mô tả:** tên không có trần độ dài (`requireName` chỉ kiểm rỗng), nên tên liền dài là đầu vào hợp lệ. Sau T-367 mọi màn chính ở trạng thái tĩnh không còn tràn, nhưng ba dòng chỉ hiện sau một thao tác vẫn in tên mà không cho ngắt: thông báo 11e sau khi khôi phục ở Thùng rác ("Đã khôi phục team <tên>" / "… KH <tên>" / "… nhân sự <tên>", dòng phụ "KH <tên>"), và dòng NT-LH-20 "Đã tạo lịch hẹn dd/mm/yyyy cho <RE>. RE này nằm ngoài góc nhìn…" của Lịch hẹn, "Đã tạo KH <tên> cho <RE>…" của Khách hàng. Dòng dài hơn cột thì đẩy `main` và cả trang cuộn ngang.
- **Tái hiện / bằng chứng** (bản ghim `dist-base`, cổng 4911; đo như `sideways` / `scrolls` của `e2e/support.ts`):
  - `node p51-restore-notice-long.mjs 4911` (`p51-restore-notice-long.log`; KH `K`×81 qua 5a, lịch 16/09 của KH đó, team `G`×160 qua "+ Team"; xóa cả ba như ca quét rồi khôi phục từng dòng): trước khi khôi phục `page 1100/1100`, `main 868/868`; **sau khi khôi phục team `G`×160: `page {"scrollWidth":1652,"window":1100}`, `main {"scroll":1420,"client":868}`, chữ tiêu đề tới x = 1 652; ở 1 440: `page 1652/1440`, `main 1420/1208`**. KH `K`×81: thông báo `scroll 633 > client 624` ở 1 100 (chữ chờm 8 px qua viền thẻ, trang chưa cuộn); lịch hẹn: không tràn. Hộp khôi phục 11b không tràn (`scroll 446 = client 446`; `Dialog` có `wrap-anywhere`).
  - `node p52-outside-line-long.mjs 4911` (`p52-outside-line-long.log`; RE `R`×160 của team Bình Minh đổi qua backup như ca quét; góc nhìn team Sao Mai): "+ Khách hàng" `K`×81 cho RE đó → **`page {"scrollWidth":1392,"window":1100}`, `main {"scroll":1160,"client":868}`**, dòng `scroll 1135 > client 818`; "+ Lịch hẹn" cho KH đó → **`page 1392/1100`, `main 1160/868`**. Ở 1 440 hai dòng vừa cột (1 158 px).
- **Cùng mẫu:** `rg -n 'role="status"|role="alert"|aria-live' apps/desktop/src packages/ui/src --glob '!*.test.*'` (50 dòng), đọc từng chỗ có chữ người dùng: **sai** đúng ba chỗ trên (2 gói E, 1 gói D); vùng AI (`KycIntelligence.tsx:313`, `SettingsAi.tsx:79-83`, `:379-383`, `KycWebSession.tsx:92-98`, `KycIntelligence.tsx:554-566`) là **CLR6-C4**, không đếm lại; **không sai**: dòng xuất của Báo cáo / backup (`ReportExport.tsx:79`, `SettingsBackup.tsx:148`: `break-all`), mọi dòng trong hộp thoại (`Dialog` có `wrap-anywhere`, `packages/ui/src/components/Dialog.tsx:84`), các dòng không có tên (`Settings.tsx:123`, `:129`, `SettingsBackup.tsx:158`, `:164`, `SettingsTrash.tsx:256`, `ReportExport.tsx:70`, `FilterBar.tsx:66`; `FilterBar.tsx:71` đã có `wrap-anywhere`). `rg -n "createdOutside|linkedOutside|'trash.restored\." apps/desktop/src/i18n/vi.ts` → 3 khóa "ngoài góc nhìn" (`{re}`, `{name}`) và 3 khóa `trash.restored.{customer,person,team}` có `{name}` (`:428`, `:431`, `:432`).
- **Ảnh hưởng:** chỉ khi có tên liền dài bất thường (như DR6-170): khôi phục team / nhân sự / KH như vậy ở Thùng rác, hay tạo KH / lịch hẹn cho RE như vậy khi đang ở góc nhìn khác, làm Cài đặt / Lịch hẹn / Khách hàng cuộn ngang tới khi rời màn. Không sai dữ liệu.
- **Chặn phát hành:** không — Low trục E (K48).
- **Đề xuất:** cho cả họ một chỗ: thêm `wrap-anywhere` vào `ALERT` (`classes.ts:30`, đề xuất chung với CLR6-C4) và vào `div.min-w-0.flex-1` của `Done`; ca quét `long-names.spec.ts` thêm hai bước có thao tác: khôi phục dòng team `G`×160 (rồi KH `K`×81) ở Thùng rác, và tạo KH / lịch hẹn cho RE `R`×160 khi đang ở góc nhìn team khác. ≈ 2–3 dòng SP + ≈ 20–25 dòng e2e.

### CLR6-E2 — Test hở của đợt sửa gói E: phần màn của T-380, trần `max-w-96` và dòng lý do giữ lại của Thùng rác

```
ID: CLR6-E2
Mức: Low
Trục: T
Vị trí: (a) apps/desktop/src/routes/SettingsTrash.tsx:335 (`teams = teamsDeletedAt(rows, told)`), :83 (`blockedReason(row, row.blocked, teams)`), :94 (`ownerParts(row, teams)`), :423 (`teams={teams}` cho hộp khôi phục), apps/desktop/src/routes/RestoreDialog.tsx:33 (`restoreRow(app, row, teams)`); (b) apps/desktop/src/routes/SettingsTrash.tsx:100 (`<span className="block max-w-96 wrap-anywhere">` của "Thuộc"); (c) :87 (`className="mt-1 block text-xs wrap-anywhere text-info"` của dòng lý do giữ lại); e2e/trash.spec.ts (13 ca, không ca nào có hai team trùng tên), e2e/long-names.spec.ts:357 (ca quét không có dòng giữ lại, chỉ đòi không cuộn ngang) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: T-380 (#1094 → PR #1097), DR6-170 (#1049 → PR #1070); cùng họ DR6-174 (b) (phần màn của T-350 không ca nào giữ, lượt 5) và CLR6-D3 (trần tên ô bảng không ca nào giữ) · mới do đợt sửa sau lượt 5 (PR #1097, #1070)
```

- **Mô tả:**
  - (a) T-380 sửa trong `trash-view.ts` (unit giữ: `T380a`–`d` bị giết), nhưng phần màn — dựng `teams` từ mọi dòng và truyền cho dòng lý do TR-1, ô "Thuộc", hộp khôi phục — không ca nào giữ. Thân PR #1097 tự ghi "Không có test component cho màn này; kiểm bằng typecheck + đọc code"; e2e làm được, như ca T-350 của T-368 (DR6-174 (b)).
  - (b) PR #1070 cho "Thuộc" trần `max-w-96` ("Two names fit under the cap on their line"); ca quét chỉ đòi không cuộn ngang, nên bỏ trần vẫn xanh (cùng họ CLR6-D3, mà danh sách cùng mẫu ở đó chỉ quét `max-w-60`).
  - (c) PR #1070 cho dòng lý do giữ lại `wrap-anywhere` (câu "Giữ lại khi dọn: nhân sự <tên> còn thuộc team này." mang tên người); ca quét không có dòng giữ lại (chỉ file nhập mới có, TR-12), nên bỏ nó vẫn xanh.
- **Tái hiện / bằng chứng** (`e2e-mut.log`; đối chứng 82 / 82):
  - (a) `T380s1` (dòng lý do không nhận `teams`), `T380s2` ("Thuộc" không nhận `teams`), `T380s3` (hộp khôi phục không truyền `teams`), `T380s4` (`teams` dựng từ 0 dòng): **SURVIVED cả bốn**, 13 / 13 `trash.spec.ts`. Trên chính bản `T380s4` (`node p50-namesakes-screen.mjs 4916`, `p50-on-T380s4.log`): hai RE "Vũ Văn Hai" của hai team "Sao Khuê" lại cùng ghi "Khôi phục team Sao Khuê trước." và "Team Sao Khuê (đã xóa)" — đúng lỗi T-380 sửa — trong khi bản ghim ghi "(xóa lúc 10/09/2026 10:00:05)" / "(… 10:00:40)" (`p50-namesakes-screen.log`).
  - (b) `R170-4-cap` **SURVIVED** (ca quét 1 / 1 xanh). Hậu quả đo (`p53-trash-kept-cap.mjs`, dữ liệu file: lịch Dời lịch đã xóa giữ lại, RE `R`×160 và team `T`×160 đã xóa): bản ghim cột "Bản ghi" / "Thuộc" 198 / 102 px ở 1 100, 257 / 119 px ở 1 440 (`p53-base.log`); bản đột biến 159 / 141 px, 195 / 181 px (`p53-cap.log`); trang không cuộn ở cả hai.
  - (c) `R170-4-kept` **SURVIVED** (ca quét 1 / 1 xanh). Trên bản đột biến cùng dữ liệu (`p53-kept.log`): **`page {"scrollWidth":1837,"window":1100}`** và 1 837 / 1 440, cột "Bản ghi" 1 005 px; bản ghim 1 100 / 1 100, 1 440 / 1 440 (`p53-base.log`): đột biến không tương đương.
- **Cùng mẫu:** đột biến của mọi phần màn của đợt sửa gói E (`mut-list.mjs`, 29 đột biến e2e): 23 KILLED, 6 SỐNG đúng ba nhóm trên. `rg -n "max-w-(60|80|96)" apps/desktop/src` → `CELL_NAME` và nút tên KH (CLR6-D3), `ReportTable.tsx:35` (giữ bởi `long-names.spec.ts:317`), `SelectField` `capped` (`max-w-80`, giữ bởi ca quét qua `title`, `claude\D.md` R1), `SettingsTrash.tsx:100` (b). `rg -n "teams=|teamsDeletedAt|toldApart" apps/desktop/src --glob '!*.test.*'` → chỉ `SettingsTrash.tsx`, `RestoreDialog.tsx` (a).
- **Ảnh hưởng:** chỉ chất lượng test: một lần đổi sau ở các chỗ này không làm CI đỏ — (a) dòng lý do / "Thuộc" / câu lỗi của hộp khôi phục quay về không nói team nào khi hai team trùng tên; (b) "Thuộc" giãn, các cột khác hẹp lại với tên dài; (c) tên dài trong dòng giữ lại làm Thùng rác cuộn ngang 1 837 px.
- **Chặn phát hành:** không — Low trục T (K48).
- **Đề xuất:** (a) một ca `trash.spec.ts` nhập file có hai team trùng tên đã xóa và một RE của mỗi team (như `p50`), đòi dòng lý do, "Thuộc" có vế "(xóa lúc …)" đúng nút của team đó (≈ 25 dòng); (b), (c) ca quét đo `contentWidth ≤ 384` của "Thuộc" và thêm một dòng giữ lại có tên dài (cùng helper đề xuất ở CLR6-D3; ≈ 15 dòng). 0 SP.

### CLR6-E3 — Nút theo dòng cùng tên truy cập mà làm việc khác nhau: (a) nút tên KH của danh sách Lịch hẹn, (b) nút "Sửa" của hai HĐ đã phát hành khác ngày

```
ID: CLR6-E3
Mức: Nit
Trục: A
Vị trí: (a) apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:172-186 (cột "Khách hàng": `<button … onClick={() => setSelectedId(r.appointment.id)}>{r.customer?.name}</button>`, không `aria-label` / `aria-describedby`; cùng mẫu ở bảng ngày :573-579, `DayTable`); (b) apps/desktop/src/routes/customers/CustomerPolicies.tsx:75-78 (`nameParams` = ngày nộp + FYP nộp), :103 (`aria-label={t('policies.editLabel', { ...nameParams, status })}`), apps/desktop/src/i18n/vi.ts:1336 ('Sửa HĐ nộp {date} · {fyp} · {status}') (5b1328a)
Tình trạng: CONFIRMED
Liên quan: họ DR6-119 / 151 / 160 (tên nút trùng cho trình đọc màn hình), CLR6-D5, CLR6-C13 (cùng họ ở hồ sơ KH, lịch sử phân tích) · có từ trước, lượt 1–5 bỏ sót ((a) `claude\D.md` K22 quét Lịch hẹn ở kỳ mặc định, không thấy; (b) DR6-119 thêm FYP và trạng thái, không thêm ngày phát hành). (a) phiên chính tìm; (b) S2 tìm (S2-4), phiên chính chạy lại probe và đọc lại code
```

- **Mô tả:** (a) nút ở cột "Khách hàng" của danh sách chọn **một lịch** nhưng tên truy cập chỉ là tên KH: hai lịch của cùng KH trong kỳ, hay hai KH cùng tên, cho hai nút cùng tên mở chi tiết hai lịch khác nhau. (b) tên nút "Sửa" của thẻ Hợp đồng gồm ngày nộp · FYP nộp · trạng thái, không có ngày phát hành: hai HĐ cùng ngày nộp, cùng FYP, phát hành hai ngày khác nhau là hai dòng khác nhau trên màn ("Phát hành 05/09" / "Phát hành 06/09") mà hai nút "Sửa" cùng tên. Trên màn các dòng khác nhau; danh sách nút của trình đọc màn hình thì không.
- **Tái hiện / bằng chứng:**
  - (a) `node p54-appt-dup-names.mjs 4911` (`p54-appt-dup-names.log`; seed của bản e2e, 15/09/2026; mọi nút / link trong `tbody`, tên = `aria-label` hoặc chữ): kỳ **Tuần** 100 nút, 2 tên gặp hai lần — `"Lê Thị Hương"` ×2 (hai KH khác nhau: "19/09/2026 | 19:30 | … | Bùi Kim Hùng …", "17/09/2026 | 18:00 | … | Đỗ Thị Lan …"), `"Hồ Minh Dũng"` ×2 (cùng KH: "17/09/2026 | | … Dự kiến", "14/09/2026 | 11:00 | … Đã gặp | Giữ N1"); kỳ Ngày 20 nút, Tháng / Năm 100 nút đầu: 0.
  - (b) `node s2\pi-policy-names.mjs 4911` chạy lại trên bản ghim (`v\v-s2-pi-policy-names.log`): sau khi phát hành 05/09 và 06/09, `"rows":["Đã phát hành Nộp 01/09 · 123 tr Phát hành 05/09 · 123 tr …","… Phát hành 06/09 · 123 tr …"]`, `"buttons":["Sửa HĐ nộp 01/09/2026 · 123.000.000 ₫ · Đã phát hành","Sửa HĐ nộp 01/09/2026 · 123.000.000 ₫ · Đã phát hành"]`. Hai HĐ chưa phát hành cùng ngày, cùng FYP: hai dòng cũng giống hệt, nên tên trùng ở ca đó là đúng.
- **Cùng mẫu:** `rg -n "onClick=\{\(\) => (setSelectedId|onSelect)\(" apps/desktop/src/routes` → `AppointmentsScreen.tsx:180` (danh sách), `:576` (bảng ngày: cùng ngày, cùng RE mới trùng). `rg -n "editLabel|issueLabel" apps/desktop/src` → `CustomerPolicies.tsx:94` ("Phát hành": chỉ HĐ chưa phát hành, ngày + FYP đủ tách như dòng), `:103` (b). Các danh sách khác của gói E có nút theo dòng đã tách đủ: Thùng rác (`restoreLabel`, `p50`: 14 / 14), Báo cáo / So sánh team (tên team đang dùng là duy nhất, `teams_active_name`).
- **Ảnh hưởng:** người dùng trình đọc màn hình duyệt danh sách nút của Lịch hẹn / hồ sơ KH: hai mục đọc như nhau; phải vào bảng / thẻ đọc cả dòng. Không sai dữ liệu.
- **Chặn phát hành:** không — Nit trục A (K48).
- **Đề xuất:** (a) `aria-describedby` trỏ ô ngày / giờ của dòng, hay `aria-label` "<tên KH>, <ngày giờ>" (một khóa, như `customer.nextLabel` của hồ sơ); (b) thêm "phát hành {date}" vào `policies.editLabel` khi đã phát hành; mỗi chỗ một ca e2e đòi hai tên khác nhau. Gộp với CLR6-D5, CLR6-C13 ở tổng hợp. ≈ 4–6 dòng SP + 1–2 khóa + ≈ 20 dòng e2e.

### CLR6-E4 — 6a / 6b / 6h / 6f: mỗi lần nhấn phím mũi tên trên ô "+ thêm" người phối hợp (đang đóng) thêm một người, rồi được lưu

```
ID: CLR6-E4
Mức: Low
Trục: D (A)
Vị trí: apps/desktop/src/routes/appointments/AppointmentDialog.tsx:244-251 (`<SelectField … value="" … onChange={(id) => id && onChange([...ids, id])} />` của `CoordinatorsField`; ô `<select>` gốc); dùng ở 6a / 6b / 6h (`AppointmentDialog.tsx`) và 6f (`EditOutcomeDialog.tsx:252`); không vùng thông báo nào trong hộp (`rg -n "aria-live|role=\"status\"" apps/desktop/src/routes/appointments/AppointmentDialog.tsx` → 0) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: có từ trước (người phối hợp từ Phase 3), lượt 1–5 bỏ sót (`rg "ArrowDown|phím mũi tên|\+ thêm" docs/reviews docs/state`: không ai thử). S1 tìm (S1-5); phiên chính chạy lại probe, rồi dựng tới lúc lưu
```

- **Mô tả:** `<select>` đang đóng trên Chromium Windows (cũng là WebView2 của exe — nền tảng duy nhất của app) đổi giá trị và bắn `change` ở mỗi lần ArrowDown / ArrowUp. Ô "+ thêm" coi mỗi `change` là "thêm người này", rồi quay về "+ thêm" (`value=""`), nên người dùng bàn phím duyệt danh sách thêm mọi người mình đi qua. Trình đọc màn hình chỉ nghe lại "+ thêm"; không có vùng thông báo nào nói đã thêm ai. Bấm Lưu thì các người đó vào lịch hẹn.
- **Tái hiện / bằng chứng:**
  - `node s1\p06-coordinator-arrows.mjs 4911` chạy lại (`v\v-s1-p06-coordinator-arrows.log`): `after ArrowDown #1: chips ["IS Bùi Văn Nga ×"] | focus SELECT` … `#3: chips ["IS Bùi Văn Nga ×","BDM Hoàng Minh Quang ×","TL Lý Gia Trang ×"]`.
  - Tới lúc lưu (`node p55-coordinator-arrows-save.mjs 4911`, `p55-coordinator-arrows-save.log`): 6b, KH Bùi Bảo Giang, 20/09, Trigger Khác; focus ô "Thêm người phối hợp", ArrowDown ×2 (không Enter, không click) → chip `["IS Bùi Văn Nga ×","BDM Hoàng Minh Quang ×"]`; `live regions in 6b before []`; "Tạo lịch hẹn" → Chi tiết **"Phối hợp IS Bùi Văn Nga, BDM Hoàng Minh Quang"**; nút của Chi tiết `["Ghi kết quả","Dời lịch","Xóa"]`: lịch Dự kiến không có đường sửa người phối hợp (6f chỉ cho lịch đã có kết quả; Dời lịch chép cả người phối hợp sang lịch mới, `reschedule.newOne`).
  - Hậu quả ở dữ liệu (đọc code): người phối hợp không vào chỉ số (`packages/domain/src/appointment-counts.ts:39` "coordinators never count"), nhưng là tham chiếu nhân sự (`packages/db/src/person-references.ts:20`, `:57-59`): xóa người đó bị từ chối `PERSON_IN_USE` (`team.ts:254`), đổi vai trò bị từ chối `COORDINATOR_IN_USE` (`team.ts:235`) tới khi lịch bị xóa; ô lọc "Phối hợp" và Chi tiết hiện họ.
- **Cùng mẫu:** `git grep -n -B2 -A6 'value=""' -- 'apps/desktop/src/**/*.tsx'` (S1) → chỉ chỗ này; 14 `<SelectField` khác của app giữ giá trị trong state (vd. `KycDialogs.tsx:354`), hoặc đổi ngay nhưng chỉ đổi phần đang xem (ô lọc "Phối hợp", `ScopePicker`), không ghi dữ liệu.
- **Ảnh hưởng:** người dùng bàn phím (Tab tới ô rồi mũi tên để xem danh sách) ở thao tác thường của 6b / 6h / 6f: thêm người phối hợp ngoài ý muốn; người dùng trình đọc màn hình không được báo. Lưu rồi thì lịch mang người đó, người đó không xóa / đổi vai trò được tới khi xóa lịch; lịch Dự kiến không sửa được người phối hợp. Không đổi chỉ số.
- **Chặn phát hành:** **có (đề xuất)** — Low có hậu quả lên dữ liệu đã lưu, nên theo K48 (plan §L6.1: "Low có hậu quả lên dữ liệu đã lưu … thì xếp D") là trục D, chặn; nếu phiên tổng hợp xếp trục A (người dùng sáng mắt thấy chip trước khi lưu) thì không chặn.
- **Đề xuất:** ô "+ thêm" chỉ thêm khi chọn hẳn (Enter / click), không theo `change`: giữ lựa chọn trong state và thêm bằng nút "Thêm", hoặc dùng danh sách nút; thêm một dòng thông báo (`aria-live`) "Đã thêm <người>"; một ca e2e: ArrowDown trên ô đang đóng không thêm ai. ≈ 15 dòng SP + ≈ 15 dòng e2e.

### CLR6-E5 — Kỳ Tùy chọn qua một ranh tháng rơi vào Chủ nhật / Thứ Hai: lịch tháng không tới được tháng kia

```
ID: CLR6-E5
Mức: Low
Trục: E (C)
Vị trí: apps/desktop/src/routes/appointments/appointments-view.ts:378-416 (`monthGrid`: chỉ các tuần của tháng chứa `date`; ngày tháng khác chỉ là phần đệm của tuần đầu / cuối; `inPeriod` :409); apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:389 (lưới theo `day`), :421 (`pickable`), :468 (`otherMonth`: ô "→" của ngày trong kỳ thuộc tháng khác) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: mockup B4 4d / NT-LH-08 (sang tháng khác bằng ô "→"); khác mục Owner chọn không sửa "chú giải Trong kỳ" (DR6-48) · có từ trước, lượt 1–5 bỏ sót. S1 tìm (S1-1); phiên chính chạy lại hai probe và đọc lại code
```

- **Mô tả:** lịch tháng chỉ sang tháng khác qua ô "→" của một ngày trong kỳ thuộc tháng kia, mà ô đó chỉ có khi tuần đầu / cuối của lưới chứa ngày tháng kia. Tháng kết thúc Chủ nhật thì lưới không có ngày nào của tháng sau; tháng bắt đầu Thứ Hai thì không có ngày nào của tháng trước. Kỳ Tùy chọn vắt qua ranh đó thì phần kỳ còn lại không mở được trên lịch tháng và "Trong ngày", dù danh sách vẫn có các lịch đó. Không có ‹ › đổi tháng trong khung lịch.
- **Tái hiện / bằng chứng** (chạy lại trên bản ghim, `v\`):
  - `s1\p01-custom-calendar.mjs 4911` (`v-s1-p01-custom-calendar.log`): Tùy chọn 25/05–10/06/2026 (31/05/2026 là CN) → `"otherMonthButtons":[]`, `months the calendar reached ["Lịch tháng 05/2026"]`, danh sách "Đang hiện 100 / 270 lịch"; 15/04–14/07/2026 → tới 04, 05 rồi dừng (không sang 06, 07). Đối chứng 25/06–10/07/2026 → tới 06 và 07.
  - `s1\p01b-year-to-custom.mjs 4920` (`v-s1-p01b-year-to-custom.log`; đồng hồ trang 15/03/2027, Năm → Tùy chọn 01/01–31/03/2027): `calendar at open Lịch tháng 03/2027 | "→" days []`, `months the calendar reached ["Lịch tháng 03/2027"]`, danh sách 1 416 lịch (31/01/2027, 28/02/2027 là CN; 01/03/2027 là T2).
- **Cùng mẫu:** `git grep -n "monthGrid\|pickDay\|inMonth" -- apps packages` (S1): một lịch tháng duy nhất (Lịch hẹn). Kỳ Tuần không mắc (tuần neo T2–CN nằm trọn trong lưới). Không e2e nào giữ việc tới được mọi tháng của kỳ (`appointments.spec.ts:199`, `:290` chỉ kỳ trong một tháng).
- **Ảnh hưởng:** RE xem kỳ Tùy chọn qua nhiều tháng (cả kỳ mặc định khi đổi từ Năm sang Tùy chọn) không mở được lịch tháng / "Trong ngày" của các tháng kia. Đường vòng: đổi sang Tháng / Tuần, hay mở lịch qua tạo lịch / liên kết dời. Không sai dữ liệu.
- **Chặn phát hành:** không — Low trục E (K48).
- **Đề xuất:** với kỳ Tùy chọn, `monthGrid` thêm tuần chứa ngày trong kỳ thuộc tháng kề (luôn có ô "→"), hoặc thêm ‹ › đổi tháng trong khung lịch, giới hạn trong kỳ; 1 ca unit + 1 ca e2e. ≈ 15–30 dòng SP + ≈ 30 dòng test.

### CLR6-E6 — Ô "Ngày hẹn tiếp" của 6c / 6i không gợi ý năm sau (luật W8 của ADR-0007), khác 6b / 6h / 6e

```
ID: CLR6-E6
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/appointments/OutcomeDialog.tsx:80 (`readScheduleDate(nextDateText, today, 'fromToday')` có `suggestion`), :209-224 (ô ngày hẹn tiếp: không render `DateSuggestion`); đối chiếu apps/desktop/src/routes/appointments/AppointmentDialog.tsx:187, RescheduleFields.tsx:108 (có `DateSuggestion`); docs/decisions/0007-dinh-nghia-chi-so-va-vong-doi.md:53 (W8), :87 (phụ lục: chỉ ô của 6f "không gợi ý năm nào") (5b1328a)
Tình trạng: CONFIRMED
Liên quan: W8 / DR-39 / phụ lục ADR-0007 23/10 (T-291); họ NT-LH-19 (K46) · có từ trước, lượt 1–5 bỏ sót (`rg "hẹn tiếp.*(gợi ý|Dùng)" docs/reviews docs/state docs/testing`: không ai thử). S1 tìm (S1-2); phiên chính chạy lại probe, đọc lại code và ADR
```

- **Mô tả:** ADR-0007 W8: "Ngày `dd/mm` mặc định năm hiện tại; … nếu đã qua > 60 ngày → gợi ý năm sau"; phụ lục chỉ miễn ô ngày của 6f. 6b, 6h ("Lịch hẹn tiếp theo", cũng chỉ nhận ngày từ hôm nay) và 6e có nút "Dùng <ngày năm sau>"; ô "Ngày hẹn tiếp" của 6c / 6i (đọc cùng `readScheduleDate`, có sẵn `suggestion`) chỉ báo lỗi. Cuối tháng 12, gõ `5/1` để hẹn đầu tháng 1 là ca thường gặp; ca `29/02` (DR-39) cũng không có nút ở đây.
- **Tái hiện / bằng chứng:** `s1\p02-year-end-next.mjs 4920` chạy lại (`v\v-s1-p02-year-end-next.log`; đồng hồ trang 28/12/2026): A. 6c "Ngày hẹn tiếp (dd/mm) * 05/01/2026 đã qua. Lịch mới phải từ hôm nay (28/12/2026) trở đi." · `"Dùng" buttons in 6c: []`; B. 6h: "… 05/01/2026 đã qua 357 ngày. Ý anh là 05/01/2027? Dùng 05/01/2027" · `["Dùng 05/01/2027"]`; C. 6e: `["Dùng 05/01/2027"]`.
- **Cùng mẫu:** `git grep -n "readScheduleDate(\|parseQuickDate(" -- 'apps/**'` (S1): `AppointmentDialog:99` có gợi ý, `RescheduleFields:32` có, `OutcomeDialog:80` **không**, `EditOutcomeDialog:76` không (ADR miễn); `customers-view.ts:143`, `:164` là ô chỉ nhận ngày đã qua (ngoài luật). Không unit / e2e nào cho gợi ý ở 6c.
- **Ảnh hưởng:** RE ghi kết quả cuối năm kèm hẹn tiếp phải tự gõ đủ năm (ô báo lỗi, không lưu nhầm). Không sai dữ liệu.
- **Chặn phát hành:** không — Low trục C (K48).
- **Đề xuất:** thêm `<DateSuggestion date={nextDate} onUse={edit(setNextDateText)} help={false} />` dưới ô ngày hẹn tiếp (như 6h); 1 ca e2e. ≈ 2–3 dòng SP + ≈ 15 dòng e2e.

### CLR6-E7 — Nút tự gỡ của Lịch hẹn làm focus rơi về `body`: ô tháng của lưới năm, KH khớp ở 6b, "Dùng …", chip "Bỏ" người phối hợp

```
ID: CLR6-E7
Mức: Low
Trục: A
Vị trí: apps/desktop/src/routes/appointments/YearGrid.tsx:93 (ô tháng `onPick` → lưới năm bị thay bằng lịch tháng); apps/desktop/src/routes/appointments/AppointmentDialog.tsx:391 (KH khớp → danh sách bị thay bằng KH đã chọn), :303 ("Dùng …" của `DateSuggestion` → nút mất khi hết gợi ý; dùng ở 6b, 6h, 6e), :237 (chip "Bỏ …" của `CoordinatorsField`; 6a / 6b / 6h, 6f) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: họ DR6-35 (lượt 1: nút tự gỡ "Hiện thêm", "+ n KH"), DR6-83 (lượt 2: Lưu ở 6c, 6g, 6h, 8a, 8b, Khôi phục, "Bỏ" của 7a) — các chỗ đó đã sửa, chỗ ở đây chưa nêu · có từ trước, lượt 1–5 bỏ sót. S1 tìm (S1-3); phiên chính chạy lại ba probe và đọc lại code
```

- **Mô tả:** nhấn Enter / Space trên các nút này thì chính nút bị gỡ khỏi trang và `document.activeElement` thành `BODY` (ra khỏi hộp thoại ở 6b): trình đọc màn hình không đọc gì, người dùng mất chỗ. Cách đúng đã có ở 7a: chuyển focus trước khi gỡ (`KycDialogs.tsx:344`, `factsBox.current?.querySelector('select')?.focus()`), và "Đổi KH" có `autoFocus` cho ô tìm.
- **Tái hiện / bằng chứng** (chạy lại trên bản ghim, `v\`): `v-s1-p03-keyboard-focus.log`: "A. focus before Enter BUTTON "Tháng 3/2026: 499 lịch …" · after Enter on a month of the year grid **BODY**"; `v-s1-p04-dialog-focus.log`: "A. after Enter on a match **BODY** … inDialog=false", "B. after Enter on "Dùng …" **BODY** … inDialog=false", "C. after Enter on a coordinator chip **BODY** … inDialog=false"; đối chứng "D. after Enter on "Đổi KH" INPUT … inDialog=true"; `v-s1-p04b-dialog-focus-6e-6f.log`: "6e: after Enter on "Dùng …" BODY", "6f: after Enter on a coordinator chip BODY".
- **Cùng mẫu:** `git grep -n "onPick\b\|onPickMonth\|onPick=" -- 'apps/desktop/src/routes/**' 'apps/desktop/src/shell/**'`, `git grep -n "DateSuggestion\b\|<CoordinatorsField\|CustomerField\b"` (S1): đúng các chỗ trên (`AppointmentDialog.tsx:144`, `:187`, `:202`, `EditOutcomeDialog.tsx:252`, `RescheduleFields.tsx:108`); các nút `onClick` khác của gói E (Hợp đồng, Cài đặt, Thùng rác, Tổng quan, Báo cáo) không tự gỡ hoặc đã có đường trả focus. `e2e/dialog-keyboard.spec.ts` không có ca nào cho các nút này.
- **Ảnh hưởng:** người dùng bàn phím / trình đọc màn hình ở thao tác thường (mở tháng từ lưới năm, chọn KH, dùng gợi ý ngày, bỏ người phối hợp). Không sai dữ liệu.
- **Chặn phát hành:** không — Low trục A (K48).
- **Đề xuất:** một cách cho cả họ, như `KycDialogs.tsx:344`: chuyển focus trước khi gỡ — chọn KH → "Đổi KH" (hay ô kế tiếp); "Dùng" → ô ngày; bỏ chip → ô "+ thêm"; ô tháng → tiêu đề "Lịch tháng" (như đích dự phòng của DR6-83); ca e2e bàn phím trong `dialog-keyboard.spec.ts`. ≈ 15–25 dòng SP + ≈ 40 dòng e2e.

### CLR6-E8 — Nút tự tắt bằng `disabled` lúc chạy làm focus rơi về `body`: "Xuất Excel", "Xuất backup" (exe), ‹ / › ở biên miền năm

```
ID: CLR6-E8
Mức: Low
Trục: A
Vị trí: apps/desktop/src/routes/reports/ReportsScreen.tsx:56-62 (`<Button … disabled={exporter.busy}>`; trạng thái `reports/ReportExport.tsx:33`, `:63`); apps/desktop/src/routes/SettingsBackup.tsx:108 (`<Button disabled={busy !== null} …>` của "Xuất backup"); packages/ui/src/components/PeriodPicker.tsx:140, :155 (‹ / › `disabled={!canShift(value, ±1)}`; gói D) (5b1328a)
Tình trạng: CONFIRMED (Xuất Excel, Xuất backup khi `export_write` trễ, ‹ › ở Năm 2100); PLAUSIBLE (cùng mẫu ở gói C, chưa chạy)
Liên quan: họ DR6-154 (lượt 4: `ConfirmButton` tắt bằng `disabled` → `aria-disabled`, T-326), T-332 mục 2 ("Chọn file…" của 10a / 10b) — hai nút xuất chưa theo · có từ trước, lượt 1–5 bỏ sót. S2 tìm (S2-1); phiên chính chạy lại ba probe và đọc lại code
```

- **Mô tả:** hai nút xuất tự tắt bằng `disabled` khi đang chạy; nút đang có focus bị tắt nên Chromium bỏ focus về `body`: trình đọc màn hình không nghe "Đang xuất…" và mất chỗ. "Xuất backup" chỉ mất focus khi lệnh ghi `export_write` không xong ngay (IPC thật của exe), vì phần dựng backup chạy đồng bộ trước lần render. Nút ‹ / › của bộ chọn kỳ tắt dưới focus khi tới biên 1900 / 2100 hay trần 3 tháng của Tùy chọn. `ConfirmButton` (`ConfirmWordDialog.tsx:32-33`) và "Chọn file…" (`SettingsBackup.tsx:136-137`) đã sửa cùng loại bằng `aria-disabled`.
- **Tái hiện / bằng chứng** (chạy lại trên bản ghim, `v\`): `v-s2-pa-export-focus.log`: `web Xuất Excel {"before":"BUTTON \"Xuất Excel\"","after":"BODY",…,"focusLog":["out:Đang xuất…→null"]}`, `exe Xuất Excel {…"after":"BODY"…}`; "Xuất backup" không trễ giữ focus; `v-s2-pc-backup-focus-slow.log` (asExe, `export_write` +40 ms): `Xuất backup {"during":"BODY",…,"after":"BODY"}`, `Xuất Excel {"after":"BODY"}`; `v-s2-pk-picker-edge-focus.log`: Năm, Enter "Kỳ sau" 74 lần → "Năm 2100", `"focus":"BODY"`.
- **Cùng mẫu:** `git grep -n -E "disabled=\{" -- 'apps/desktop/src/**/*.tsx' 'packages/ui/src/**/*.tsx'` (S2), các nút tự tắt khi đang có focus: CONFIRMED ba chỗ trên; PLAUSIBLE, chưa chạy (gói C): `SettingsAi.tsx:275` (Lưu key), `:294`, `:309` (Xóa key), `:363` (Kiểm tra kết nối), `customers/KycExtraction.tsx:115` (AI trích xuất); đúng mẫu `aria-disabled`: `ConfirmWordDialog.tsx:32-33`, `SettingsBackup.tsx:136-137`.
- **Ảnh hưởng:** người dùng bàn phím / trình đọc màn hình bấm Xuất Excel, Xuất backup (exe), hay đi kỳ tới biên. Tab vẫn đi tiếp từ chỗ cũ. Không sai dữ liệu.
- **Chặn phát hành:** không — Low trục A (K48).
- **Đề xuất:** một nút chạy dùng chung như `ConfirmButton` (`aria-disabled` lúc chạy, `onClick` bỏ qua khi bận) cho hai nút xuất (và các nút AI); ‹ / › ở biên chuyển focus sang nút còn bật; 1 ca e2e focus. ≈ 15–25 dòng SP + 1 ca e2e.

### CLR6-E9 — Danh sách Lịch hẹn: dòng đang xem ở khung Chi tiết không được tô (mockup `tr.selected`), không có trạng thái trợ năng

```
ID: CLR6-E9
Mức: Low
Trục: C (A)
Vị trí: apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:180 (`setSelectedId`), :326-335 (`DataTable` không nhận dòng chọn); packages/ui/src/components/DataTable.tsx:206 (`<tr key={row.id} className="group hover:bg-surface-2">`); mockup docs/design/mockups/appointments.html:485 (`<tr class="selected">`, đúng dòng của khung Chi tiết), mockups.css:428 (`tr.selected td`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: không có trong "Lệch mockup đã biết" (`known.md` phần 3); B5 của `phase-3-feedback.html` chỉ thay cách tô ô Ngày (mẫu bảng không có khung Chi tiết) · có từ trước, lượt 1–5 bỏ sót. S1 tìm (S1-4); phiên chính chạy lại probe, đọc lại code và hai mockup
```

- **Mô tả:** mockup `appointments.html` tô dòng của lịch đang ở khung Chi tiết (`tr.selected`, nền `--accent-soft`). App không tô, không gắn `aria-selected` / `aria-current`: dòng vừa bấm giống hệt mọi dòng khác.
- **Tái hiện / bằng chứng:** `s1\p05-row-select.mjs 4911` chạy lại (`v\v-s1-p05-row-select.log`): "A. row clicked (3rd) 30/09/2026 19:30 Phạm Ngọc Nhung … `{"ariaSelected":null,"ariaCurrent":null,"className":"group hover:bg-surface-2","cellBg":["rgba(0, 0, 0, 0)",…]}`", dòng thứ 5 y hệt.
- **Cùng mẫu:** `git grep -n "bg-accent-soft\|aria-current\|aria-selected" -- 'apps/desktop/src/routes/**/*.tsx' 'packages/ui/src/components/*.tsx'` (S1): dòng chọn chỉ có ở `KycHistory.tsx:68`, cây team `TeamScreen.tsx:174`; `DataTable` không có prop chọn dòng; danh sách Lịch hẹn là bảng duy nhất có khung chi tiết bên cạnh (`team.html:124` cũng `tr.selected`, nhưng bảng đó đã được B1 thay).
- **Ảnh hưởng:** chỉ hiển thị / trợ năng: ở bảng 100+ dòng khó thấy lịch nào đang ở khung Chi tiết. Không sai dữ liệu.
- **Chặn phát hành:** không — Low trục C (K48).
- **Đề xuất:** prop `selectedId` cho `DataTable` (nền `bg-accent-soft` giữ tô ô Ngày B5, `aria-selected` / `aria-current="true"`), hoặc ghi vào "Lệch mockup đã biết" nếu Owner chọn. ≈ 10 dòng SP + ≈ 10 dòng e2e.

### CLR6-E10 — Excel của Báo cáo: tên team / RE dạng `_xHHHH_` được ghi nguyên, đọc ra chữ khác

```
ID: CLR6-E10
Mức: Low
Trục: E
Vị trí: apps/desktop/src/routes/reports/report-workbook.ts:94 (ô A1: tên bảng + góc nhìn), :106 (`worksheet.addRow([...names, …])`), :114, :118 (tên team / RE của dòng, dòng Tổng); ExcelJS 4.4.0 (`apps/desktop/node_modules/exceljs/package.json`) (5b1328a)
Tình trạng: CONFIRMED (XML ghi nguyên, ExcelJS đọc lại ra chữ khác); PLAUSIBLE (Excel hiện chữ đã giải mã: theo ECMA-376 `ST_Xstring`, không chạy Excel)
Liên quan: ca `report-workbook.test.ts:195` "writes team and RE names as they are" không có tên dạng này · có từ trước, lượt 1–5 bỏ sót. S2 tìm (S2-2); phiên chính chạy lại probe và đọc lại code
```

- **Mô tả:** chuỗi trong sharedStrings của xlsx dùng `_xHHHH_` làm escape; ExcelJS không escape dạng này khi ghi (ghi nguyên) nhưng giải mã khi đọc. Tên team / RE có đúng mẫu `_x` + 4 chữ số hex + `_` ra chữ khác trong file Excel ("_x0041_ Đông" → "A Đông"). Ô vẫn là chuỗi (`t="s"`), không công thức.
- **Tái hiện / bằng chứng:** `node --import ../hooks.mjs s2\pd-excel-text.mjs` chạy lại (`v\v-s2-pd-excel-text.log`; lệnh Team qua `openAppData`, `reportRows` + `exportReport`): `raw XML has "_x0041_ Đông" as written true`; `ExcelJS reads sheet "Theo RE" names [[3,"A Đông","B Lan"],[3,"@SUM(1)","+84 Hà"],…,[3,"Team 😀","Lê_x0043_"],…]`; `sheet2 (Theo team) cells with <f> (formula) 0`.
- **Cùng mẫu:** `git grep -n -E "formatter|encodeHtml|addRow|getCell\(|\.value = "` (S2): nơi ghi xlsx duy nhất là `report-workbook.ts:94`, `:98`, `:102`, `:106` (chỉ `:94`, `:106` mang chữ người dùng); tooltip chart qua `encodeHtml` (`stage-chart.ts:57`, `:79`); `.p2cbackup` là JSON.
- **Ảnh hưởng:** chỉ khi tên có đúng dạng đó (gõ tay bất thường); chỉ ở hiển thị trong file xuất. Dữ liệu và chỉ số không đổi.
- **Chặn phát hành:** không — Low trục E (K48).
- **Đề xuất:** một helper trong `report-workbook.ts` đổi `_x([0-9A-Fa-f]{4})_` thành `_x005F_x$1_` trước khi ghi ô chữ; thêm một tên dạng này vào ca `:195`. ≈ 5 dòng SP + ≈ 3 dòng test.

### CLR6-E11 — "Dời sang dd/mm" không ghi năm khi ngày mới ở năm khác

```
ID: CLR6-E11
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/routes/appointments/appointments-view.ts:79-80 (`t('appointments.rescheduledTo', { date: formatDayMonth(outcome.to) })`), hiện ở AppointmentsScreen.tsx:212 (cột Kết quả), :658 (Chi tiết); apps/desktop/src/i18n/vi.ts:766 (5b1328a)
Tình trạng: CONFIRMED
Liên quan: mockup `appointments.html:539` "Dời sang 02/10" (cùng năm), NT-LH-04 · có từ trước. S1 tìm (S1-6); phiên chính chạy lại probe và đọc lại code
```

- **Mô tả:** dòng của lịch Dời lịch ghi ngày mới dạng `dd/mm`; qua năm (29/12/2026 → 05/01/2027) thì đọc là "Dời sang 05/01", không biết năm nào; "Dời sang" còn có thể lùi ngày khi nhập bù. Liên kết "Dời từ / Dời sang" ở Chi tiết có đủ năm.
- **Tái hiện / bằng chứng:** `v\v-s1-p02-year-end-next.log` D: `["29/12/2026\t11:00\tBùi Bảo Giang\t…\tKhác\t—\tDời lịch\tDời sang 05/01"]`.
- **Cùng mẫu:** `git grep -n "outcomeText(\|rescheduledTo'"` (S1): `AppointmentsScreen.tsx:212`, `:658`; `EditOutcomeDialog.tsx:135` (không gặp kind `rescheduled`).
- **Ảnh hưởng:** chỉ chữ. **Chặn phát hành:** không — Nit (K48).
- **Đề xuất:** ghi năm khi năm của ngày mới khác năm của lịch (như `dayText`). ≈ 3 dòng.

### CLR6-E12 — Khung "Khi lưu" của 6e / 6i ghi ngày đủ năm và trạng thái dạng chữ; mockup ghi `dd/mm hh:mm` và badge

```
ID: CLR6-E12
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/routes/appointments/RescheduleFields.tsx:128 (`t('reschedule.oldBecomes', { when: whenText(old) })`), OutcomeDialog.tsx:236-240 (`outcome.oldBecomes`); apps/desktop/src/i18n/vi.ts:858, :914; mockup docs/design/mockups/appointment-forms.html:299 ("28/09 14:00 → <badge>Dời lịch</badge>"), :490 ("25/09 09:00 → <badge>Không đến</badge>") (5b1328a)
Tình trạng: CONFIRMED
Liên quan: không có trong "Lệch mockup đã biết" · có từ trước. S1 tìm (S1-7); phiên chính đọc lại code và mockup, chạy lại probe
```

- **Mô tả / bằng chứng:** `v\v-s1-p02-year-end-next.log` A: "Khi lưu (một lần bấm) 28/12/2026 10:00 → Không đến"; mockup 6i "25/09 09:00 → [badge Không đến]", 6e "28/09 14:00 → [badge Dời lịch] (giữ lại trong lịch sử, không tính gặp)".
- **Cùng mẫu:** hai chỗ trên (`reschedule.oldBecomes`, `outcome.oldBecomes`).
- **Ảnh hưởng:** chỉ hình chữ. **Chặn phát hành:** không — Nit (K48).
- **Đề xuất:** theo mockup, hoặc ghi vào "Lệch mockup đã biết" (đủ năm là có chủ ý thì ghi lý do).

### CLR6-E13 — Hộp 8b: câu "HĐ nộp tháng … vẫn tính nộp …; phát hành tính vào tháng …" hiện cả khi nộp và phát hành cùng tháng

```
ID: CLR6-E13
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/routes/customers/PolicyDialogs.tsx:253-260 (`mode.kind === 'issue' && issuedRead && read.submittedDate.ok`); apps/desktop/src/i18n/vi.ts:1356-1357 ('policyForm.months'); mockup docs/design/mockups/policy-forms.html:83 (chỉ ca khác tháng: "HĐ nộp tháng 08 vẫn tính nộp vào tháng 08; phát hành tính vào tháng 09."); docs/user-guide/05-ho-so-kh.md:100 ("… mà phát hành tháng sau … hộp ghi rõ điều này") (5b1328a)
Tình trạng: CONFIRMED
Liên quan: có từ trước. S2 tìm (S2-3); phiên chính chạy lại probe và đọc lại code, mockup, hướng dẫn
```

- **Mô tả / bằng chứng:** `v\v-s2-pl-issue-months.log`: mở 8b hôm nay 15/09 → `"HĐ nộp tháng 09/2026 vẫn tính nộp vào tháng 09/2026; phát hành tính vào tháng 09/2026."`; ngày phát hành 03/09 cũng vậy. Chữ "vẫn" đối lập mà không có gì để đối lập.
- **Cùng mẫu:** khung 8d lọc dòng chênh 0 (`policy-form.ts:229`); không chỗ khác cùng mẫu (S2).
- **Ảnh hưởng:** chỉ chữ. **Chặn phát hành:** không — Nit (K48).
- **Đề xuất:** chỉ hiện khi tháng nộp ≠ tháng phát hành. ≈ 1 dòng SP + 1 ca e2e.

### CLR6-E14 — Tổng quan / Báo cáo: cấp tiêu đề — 6 KPI (h3) nằm dưới h2 "Lịch hẹn · cả tháng"; vùng KPI và bảng thứ hai của Báo cáo không có tiêu đề

```
ID: CLR6-E14
Mức: Nit
Trục: A
Vị trí: apps/desktop/src/routes/overview/OverviewTiles.tsx:24 (h2 của ô Lịch hẹn), :62 (h3 của `KpiCard`); apps/desktop/src/routes/Overview.tsx:51 (`<section aria-label={t('overview.kpis')}>`, không tiêu đề); apps/desktop/src/routes/reports/ReportsScreen.tsx:75 (vùng bảng thứ hai, không tiêu đề) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: mockup `overview.html` 1a vẽ ô bằng nhãn, không thẻ tiêu đề (cấp tiêu đề là của app) · có từ trước. S2 tìm (S2-5); phiên chính chạy lại probe và đọc lại code, mockup
```

- **Mô tả / bằng chứng:** `v\v-s2-ph-headings.log`: `/#/overview ["H1 Tổng quan","H2 Lịch hẹn · cả tháng","H3 Chuyển RF","H3 HĐ nộp","H3 Case size","H3 HĐ phát hành","H3 Doanh số","H3 Tỉ lệ chốt","H2 Khách hàng theo nhóm",…]`; `/#/reports ["H1 Báo cáo","H2 Tổng hợp"]`. Danh sách tiêu đề của trình đọc màn hình xếp sáu KPI là mục con của ô Lịch hẹn, trong khi trên màn chúng ngang hàng (WCAG 1.3.1).
- **Cùng mẫu:** đọc hết `OverviewTiles.tsx`, `Overview.tsx`, `ReportsScreen.tsx`, `StageBlock.tsx`, `TeamCompare.tsx` (S2): chỉ hai chỗ trên.
- **Ảnh hưởng:** người dùng trình đọc màn hình duyệt theo tiêu đề. **Chặn phát hành:** không — Nit (K48).
- **Đề xuất:** h2 ẩn "Chỉ số của kỳ" cho vùng KPI (hay ô Lịch hẹn cùng cấp KPI); tiêu đề ẩn cho bảng thứ hai của Báo cáo. ≈ 3 dòng.

### CLR6-E15 — Hộp 10c / 11i: chữ cần gõ ("NẠP LẠI", "DỌN SẠCH") không in đậm như mockup

```
ID: CLR6-E15
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/routes/ConfirmWordDialog.tsx:97 (`label={t('settings.demo.confirmWordLabel', { word })}`: nhãn là chuỗi thường); apps/desktop/src/i18n/vi.ts:1174 ('Gõ {word} để xác nhận'); mockup docs/design/mockups/settings-data.html:210, trash.html:405 (`Gõ <b>NẠP LẠI</b> để xác nhận`, `Gõ <b>DỌN SẠCH</b> …`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: "Lệch mockup đã biết" của 10c chỉ nêu ngày neo và câu backup (`known.md` phần 3), không nêu chữ cần gõ · có từ trước. S2 tìm (S2-6); phiên chính chạy lại probe, đọc lại code và hai mockup
```

- **Mô tả / bằng chứng:** `v\v-s2-pg-confirm-word.log`: `label HTML Gõ NẠP LẠI để xác nhận` (không thẻ `b`); cách gõ nhận đúng spec D1 (`"exact":"on","decomposed":"on"`, chữ thường / dấu cách / U+200B / NBSP / không dấu: `off`).
- **Cùng mẫu:** một component cho cả 10c và 11i.
- **Ảnh hưởng:** chỉ hình chữ. **Chặn phát hành:** không — Nit (K48).
- **Đề xuất:** ghi vào "Lệch mockup đã biết", hoặc cho nhãn `TextField` nhận ReactNode. ≈ 3–5 dòng.

## 6. Bloat và Hiệu năng (không bắt buộc ở gói E; ghi số đã đo)

- **Hiệu năng.** Node, Home PC `DESKTOP-KDURKJP`, Node v24.20.0, `@p2c/db` / trash-view của worktree ghim qua `hooks.mjs`; song song: hai subagent và đợt e2e đột biến (CPU 34 % ngay sau lần đo), nên chỉ so thô với lượt 5 (`p32r6-trash-node-perf.log`, trung vị):

  | Đo | 113 dòng (lượt 5) | 1 313 dòng (lượt 5) |
  |---|---|---|
  | `listTrash` | 19,57 ms (20,66) | 164,18 ms (140,26) |
  | `toldApart` (lượt 5: `codedCustomers`), một lần mỗi lần đọc | 0,03 ms (0,01) | 0,73 ms (0,56) |
  | `teamsDeletedAt` (mới, T-380) | 0,00 ms | 0,01 ms |
  | Một lần vẽ mọi dòng (`recordTitle` … `restoreLabel`, lý do chặn / giữ, có `teams`) | 0,37 ms (0,35) | 3,51 ms (2,59) |
  | Mở 11i `purgeView(purgePlan(rows))` | 0,02 ms (0,02) | 0,20 ms (0,11) |

  Mọi chênh dưới 10 ms (luật nhiễu: > 20 % **và** > 10 ms); `listTrash` +24 ms đo khi máy bận, là `packages/db` (gói A đo lại không thấy, `claude\A.md` mục 6.2). Exe: `baseline.md` (không dòng nào ⚠️; `trash.open` 33 ms, `reports.export-excel` 27 ms, `appointments.*` 4–109 ms). S2: Xuất Excel 173 ms, Xuất backup 344–434 ms trên web với dữ liệu tải (ngưỡng ≤ 500 / ≤ 1 000 ms). **Không có phát hiện P.**
- **Bloat.** Diff SP gói E +274 / −80, không dependency mới (`claude\D.md`, `baseline.md`); `rg` API / chú thích tạm (K17): 0 chỗ mới; nhánh phòng thủ không chạy được: `effectDownNoRe` / `effectUpNoRe` (`policy-form.ts`, S2), `liveIds` (`AppointmentDialog.tsx`, S1) — chi phí không đo được, không ghi phát hiện; T-377 / T-380 / T-382 (họ DR6-160, mức Nit) là phần Thùng rác lớn nhất của diff — để chủ đề G.

## 7. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | 0 |
| Low | 3 (E1, E5, E10) | 2 (E6, E9) | 1 (E4) | | | | | 1 (E2) | 2 (E7, E8) | **9** |
| Nit | | 4 (E11, E12, E13, E15) | | | | | | | 2 (E3, E14) | **6** |
| **Tổng** | 3 | 6 | 1 | | | | | 1 | 4 | **15** |

Mỗi phát hiện đếm một lần ở trục chính (E1: E, A; E4: D, A; E5: E, C; E9: C, A). **CONFIRMED 15 / 15** (E8, E10 có một phần PLAUSIBLE ghi rõ: cùng mẫu ở gói C chưa chạy; Excel hiển thị theo ECMA-376), PLAUSIBLE 0, KNOWN 0. **Đề xuất chặn phát hành: 1** (CLR6-E4, Low trục D theo K48); không chặn: 14. Ai tìm: E1, E2, E3 (a) phiên chính; E3 (b), E8, E10, E13, E14, E15 S2; E4, E5, E6, E7, E9, E11, E12 S1 — mọi phát hiện của subagent phiên chính đã chạy lại probe và đọc lại code. Mới do đợt sửa sau lượt 5: 1 (E2: PR #1097, #1070); có từ trước, lượt 1–5 bỏ sót: 14. Bảng R: **R1 5 / 5 ĐÃ SỬA** (DR6-160, 170, 172, 173, 174; phần gói E), **R2 3 / 3 ĐÃ SỬA** (T-377, T-380, T-382; phần gói E); biến thể / phần sửa không ca nào giữ ghi riêng ở CLR6-E1, E2.

## 8. Đã xét, không thấy (theo trục)

- **R:** 5 dòng R1 + 3 dòng R2 (mục 2); tái hiện lượt 5 chạy lại (`p40`, `p41`, `p34r5`); ba đột biến sống của lượt 5 (E154d, E350c, E350d) và E148e nay bị giết; 14 / 14 đột biến vitest, 23 / 29 đột biến e2e của bảng R bị giết (6 sống → CLR6-E2). Không HỒI QUY: đối chứng e2e 82 / 82 + 8 / 8 (`overview.spec.ts`), vitest 161 / 161.
- **E:** tên trùng mọi loại ở Thùng rác (K4, `p50`); chữ dán ở hai ô tìm và 8a (K1); tên liền dài trên màn tĩnh (K2) và sau thao tác (K7, K8 → CLR6-E1); qua nửa đêm với 6c mở (S1-K12); biên năm Tuần / Ngày / Năm (S1-K13); 9 kỳ × 11 góc nhìn trên dữ liệu tải, kể cả RE chuyển team, team hết RE, hôm nay 30/09 / 01/01 / CN (S2-K6, 594 ca, 0 lệch); ngoài CLR6-E1, E5, E10 không thấy.
- **C:** NT-TR-07, TR-1 / E14 / E16 trên màn (`p50`); NT-LH-15, chuỗi bàn giao → dời → xóa → khôi phục theo spec §4 / TR-1 (S1); NT-TQ-24 / 25, NT-BC-03…06, Σ RE = team, Σ team = Toàn bộ (S2); 10a / 10c lỗi giữa chừng đúng câu NT-DB-10 / NT-CD (S2-K11); mockup 11e khớp chữ app (`trash.html:316`); ngoài E6, E9, E11–E13, E15 không thấy.
- **D:** khôi phục / dọn sạch với tên trùng không đổi dữ liệu nào ngoài dòng của nó (`p50`, `p32r6`: 1 313 tên nút khác nhau); khung 8d ↔ chỉ số sau khi lưu, xóa / khôi phục HĐ / KH, 5c giữ RE của HĐ (S2-K7); lệnh `rescheduleAppointment`, `recordOutcomeWithNext`, `editMeetingOutcome`, `softDelete` / `restore` (S1 đọc hết); luật nhập 5 từ chối dữ liệu dựng sai (K11). Ngoài CLR6-E4 không thấy.
- **G:** gói E không gọi AI (`SettingsAi.tsx` là gói C); dọn sạch đếm phân tích AI đúng (`p34r5` 11i, `baseline.md` 11j). Không thấy.
- **S:** 38 file SP gói E: 0 `dangerouslySetInnerHTML` / `innerHTML` / `eval` / `new Function` / `window.open` / `localStorage` (K17, S1); Excel chỉ ô chuỗi, 0 công thức với tên `=…`, `@…`, `+…` (S2-K5); tooltip chart qua `encodeHtml`; tên file Excel ASCII; mọi probe 0 request ra ngoài localhost / 127.0.0.1. Không thấy.
- **P:** mục 6 — không phát hiện P.
- **B:** mục 6 — không phát hiện B.
- **T:** 43 đột biến của phiên chính (mục 9.2), 26 của S1, 12 của S2; sống không tương đương: chỉ 6 của bảng R (CLR6-E2). S2M3 (S2: "năm đang chạy cũng MTD", sống 4 493 vitest) bị `overview.spec.ts:75` giết khi phiên chính chạy e2e (`S2M3e`). Test mới của đợt sửa không đọc giờ máy / số ngẫu nhiên (`git diff … | rg "new Date\(|Date\.now|Math\.random"`: chỉ `new Date(2026, 9, …)` cố định).
- **A:** tên nút khôi phục 14 / 14 khác nhau, dòng lý do nối `aria-describedby` (`p50`); focus và tên nút "Đang …" lúc chạy (`p34r5`); ô "→" của Tuần giữ focus, Esc trả focus (S1). Ngoài CLR6-E3, E7, E8, E14 (và vế A của E1, E4, E9) không thấy.

## 9. Phụ lục

### 9.1 Probe, log (mọi file ở `C:\workspace\deep-review-1-6-r6\claude\E\`)

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `r5copy\*` | 31 công cụ / probe lượt 5 của chính Claude E, chép theo tên (`Test-Path` từng tên) | — | gốc của các bản dưới |
| `make-working.mjs` | bản làm việc: `-r5` → `-r6`, cổng 48xx → 49xx | — | mọi probe |
| `build-dist.mjs`, `serve-dist.mjs`, `pw.config.mjs`, `browser.mjs`, `hooks.mjs`, `ui-stub.mjs` | bản web ngoài repo, `vite preview`, cấu hình Playwright, bộ trình duyệt (chặn mạng, `asExe`), loader TS | `build-base.log`, `build-real.log` | mọi probe |
| `fix-diff.patch` | diff `37a80b6..5b1328a` của 14 file gói E (1 202 dòng) | — | mục 3 |
| `mut-list.mjs` (43 đột biến), `check-muts.mjs`, `mutjs.mjs`, `mutant-config.mjs`, `e2e-mut.mjs`, `control.json` | đột biến lượt 6 (vitest qua hook `load`; TSX qua bản dựng đột biến 4912–4919) | `check-muts.log`, `vitest-control.log`, `mutjs.log`, `e2e-mut.log`, `e2e-run1.out`, `e2e-run2.out`, `mut\`, `pw-results\` | mục 2, CLR6-E2 |
| `mut-list-r5.mjs`, `check-muts-r5list.log` | danh sách đột biến lượt 5 (chép, để riêng; 4 / 26 không còn áp được ở SHA ghim) | — | — |
| `p40-invisible-more.mjs`, `p41-long-names-e.mjs`, `p34r5-confirm-focus.mjs` | tái hiện lượt 5 (chạy nguyên) | `.log` cùng tên | R1 DR6-170, 172, 173, 174 |
| `p50-namesakes-screen.mjs` | Thùng rác với tên trùng mọi loại qua file nhập | `p50-namesakes-screen.log`, `p50-on-T380s4.log` | R1 DR6-160, R2 T-377, T-380, CLR6-E2 |
| `p51-restore-notice-long.mjs`, `p52-outside-line-long.mjs` | tên liền dài ở 11e và dòng "ngoài góc nhìn" | `.log` cùng tên | CLR6-E1 |
| `p53-trash-kept-cap.mjs`, `p53-check.mjs` | dòng giữ lại / trần "Thuộc" trên bản ghim và hai bản đột biến; luật nhập của dữ liệu dựng | `p53-base.log`, `p53-kept.log`, `p53-cap.log`, `p53-check.log` | CLR6-E2 |
| `p54-appt-dup-names.mjs` | tên nút trùng trong bảng Lịch hẹn theo kỳ | `p54-appt-dup-names.log` | CLR6-E3 |
| `p55-coordinator-arrows-save.mjs` | ArrowDown trên "+ thêm" tới lúc lưu | `p55-coordinator-arrows-save.log` | CLR6-E4 |
| `r3-p09-make-big.mjs`, `p32r6-trash-node-perf.mjs` | Thùng rác lớn (1 313 dòng, `load-del1200.p2cbackup`), chi phí phần Thùng rác mới | `r3-p09-make-big.log`, `p32r6-trash-node-perf.log` | mục 6 |
| `v\v-*.log` | 16 probe của S1, S2 chạy lại trên bản ghim | `v\` | CLR6-E3…E15 |
| `s1\`, `s2\` | probe, log, đột biến của subagent; `report.md` chép lại từ tin trả về | xem `s1\report.md`, `s2\report.md` | mục 1, 4, 5 |

Chép nhưng không chạy (code đổi chữ ký hay không cần ở lượt này): `p23r5-restore-names.mjs` (thay bằng `p50`), `p26`, `p42`, `p42b`, `p43`, `p44`, `p28`, `r3-p10`, `p32-trash-node-perf.mjs` (thay bằng `p32r6`), `sep-scan`, `r37-guard-e`, `r2-exports`, `list.mjs`.

**Lần chạy hỏng của probe (lỗi probe, không phải sản phẩm; kết quả lần hỏng không dùng):** `p52` lần đầu chọn RE theo nhãn trần (nhãn lựa chọn có kèm team) → chạy lại chọn theo `value`; `p53` lần đầu dựng thêm một KH đã xóa có RE đã xóa → luật nhập 5 từ chối (K11) → bỏ phần đó; `p41` "Ngày kỳ" hết giờ như lượt 5 (bỏ qua, các bước khác đo đủ).

### 9.2 Đột biến

- **Phiên chính, 43** (`mut-list.mjs`): vitest **14 / 14 KILLED** (R160a–c, T377a–c, T380a–d, T382a–b, R172a–b); e2e **24 / 30 KILLED** — R160s, T377d, R172b, R172c, R173a, E154d, E350c, E350d, E148e, R170-3-btn, -3-re, -3-h2, -3-dd, -3-h3, -3-h4, -3-sum, -4-owner, -4-named, -4-blocked, -5, -7, -8, -meta, S2M3e; **6 SỐNG**: T380s1–s4, R170-4-cap, R170-4-kept (→ CLR6-E2; R170-4-kept và T380s4 đã đo trên bản dựng là không tương đương).
- **S1, 26 vitest** (`s1\mutjs.log`): 25 giết, S1M05 sống (tương đương). **S2, 12 vitest** (`s2\mutjs-s2.log`): 10 giết, S2M1 sống (tương đương), S2M3 sống ở vitest nhưng bị e2e giết (`S2M3e`).
- Đối chứng: vitest 161 / 161 (3 file); e2e 82 / 82 (5 spec) + 8 / 8 (`overview.spec.ts`) trên `dist-base`. Repo không bị ghi: dòng cuối `mutjs.log`, `e2e-mut.log` là `git status --short after: ""`.

### 9.3 Ranh giới đọc

- Chỉ mở theo tên đầy đủ: `common\{prompt-claude.md, known.md, fixes.md, baseline.md, files-E.txt, plan.md (§L6.0–§L6.4 bằng Grep / Read trong file)}`, `common\load\load-2026-10-12-seed6.p2cbackup`; báo cáo lượt 6 của Claude `claude\{A,B,C,D}.md` (bước 0: dòng đầu; A, C, D: đoạn cần để không báo trùng); probe lượt 5 của chính Claude E ở `deep-review-1-6-r5\claude\E\` (31 tên lấy ở §9.1 của báo cáo gốc lượt 5, `Test-Path` từng tên rồi chép).
- Không liệt kê, không tìm kiếm thư mục nào ở `C:\workspace\`, `deep-review-1-6*\`; không mở thư mục `codex\` / `workbuddy\` / `deepseek\` / `muse\` nào; không đọc báo cáo lượt 6 của bên khác. Tìm kiếm chỉ trong repo (mã, `docs/`, gồm báo cáo gốc lượt 1–5 được phép đọc) và trong từng file được phép đọc; `ls` chỉ trong thư mục của chính phiên (`claude\E\…`).
- Không gọi `gh`, không chạy công cụ repo gọi GitHub, không gọi dịch vụ AI, không đọc key, không mở chatgpt.com; không chạy `pnpm`, không cổng 4173, không `PW_REUSE`, không chạy exe.

### 9.4 Cuối phiên

- Repo: không ghi file nào của worktree (mọi đột biến qua hook `load` hoặc bản dựng ngoài repo; mọi probe, bản dựng, kết quả Playwright ghi dưới `claude\E\`). `git rev-parse HEAD` cuối phiên: `5b1328ae236aa62981dbf43066ff544a9e832c8c` (= SHA ghim). **`git status --short` cuối phiên: rỗng** (như đầu phiên).
- Đã dừng hai máy chủ `serve-dist` của phiên (4911, 4920; ba máy chủ tạm 4916–4918 của bản đột biến dừng ngay sau probe; 4912–4919 của `e2e-mut.mjs` tự dừng); kiểm lại: không cổng 4911–4949 nào nghe, 0 Edge headless còn chạy. Hai subagent đã xong, không mở máy chủ nào.
- Giờ xong: 2026-11-07 19:37 (+07:00).
