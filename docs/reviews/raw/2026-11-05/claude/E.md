XONG — claude gói E lượt 5, 2026-11-05 01:17 (+07:00)

# Deep review Phase 1–6, lượt 5 — Claude, gói E (Lịch hẹn, chỉ số, quản lý)

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên | claude (ID `CLR5`) |
| Gói | E. Lịch hẹn, chỉ số, quản lý — `routes/{appointments,overview,reports}/**`, `routes/{Overview,Settings*,RestoreDialog,FilterBar,ConfirmWordDialog}.tsx` (trừ `SettingsAi.tsx`), `routes/{trash-view,period-labels,applied-filter}.ts`, Hợp đồng (`routes/customers/{CustomerPolicies,PolicyDialogs,policy-form}.*`) |
| SHA đầu phiên | `37a80b662861d308a110d1e2b0f65ad13b91fb51` (`git rev-parse HEAD`, worktree `C:\workspace\Project-2C-review`, detached) = SHA ghim |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 2026-11-05 00:49 (+07:00), Home PC `DESKTOP-KDURKJP` |
| Công cụ | Claude Code, app desktop (tab Code), Windows 11 Pro; PowerShell + Git Bash |
| Model | Claude Opus 5.5 (`claude-opus-5-5`) |
| Mức suy luận | `xhigh` (đọc bằng `get_session self`: `effort: "xhigh"`, `permissionMode: "auto"`, fast mode tắt) |
| Ultracode | tắt (Owner không bật) → không subagent / Workflow; mọi việc ở phiên chính |
| Phiên làm tiếp? | không — phiên đầu của gói E |
| Node | v24.20.0 (`C:\Program Files\nodejs`, đặt đầu PATH ở mọi lệnh) |
| Bước 0 | gói `E` hợp lệ; `claude\E.md` chưa có → làm mới; `claude\A.md`…`D.md` có, dòng đầu đều `XONG …` |
| Chạy song song | Codex đợt 1 ở `Project-2C-review-2` (2 tiến trình `codex`); CPU 2–6 % ngay trước các lần đo (`Win32_Processor.LoadPercentage`) |

## 2. Bảng R

**Cách làm chung** (mọi probe, log, nguồn ở `C:\workspace\deep-review-1-6-r5\claude\E\`):

- **Công cụ lượt 4 của chính Claude E** (`deep-review-1-6-r4\claude\E\`, 37 tên lấy ở phụ lục 9.1 của `docs/reviews/raw/2026-10-31/claude/E.md`, `Test-Path` từng tên) chép nguyên vào `E\r4copy\`; bản làm việc ở `E\` do `make-working.mjs` dựng (chỉ đổi đường dẫn r4 → r5 và cổng 4631 → 4811, 4632–4639 → 4812–4819, 4640 → 4820). `e2e/support.ts`, `fixtures.ts`, `serve.mjs`, `playwright.config.ts` không đổi từ `2e51e25` (như `claude\D.md`), nên `browser.mjs` (`asExe` bản JS, chặn mạng ngoài localhost / 127.0.0.1 bằng `--host-resolver-rules` + `route.abort`, thay `window.open` / clipboard từ lần chạy đầu) và `pw.config.mjs` dùng lại nguyên.
- **Bản web ngoài repo:** `E\dist-base` (Vite `build()` của worktree ghim, neo 15/09/2026 + ảnh chụp demo như `e2e/serve.mjs`; cổng 4811), `E\dist-real` (không neo, ngày = đồng hồ trang; cổng 4820), bản đột biến `E\dist-<id>` (4812–4819). Không dùng 4173, không `pnpm e2e`, không `PW_REUSE`, không chạy exe. `git status --short after: ""` sau mỗi lần dựng.
- **Đối chứng:** cả bộ e2e của repo trên `dist-base` (trừ `seed-timing`, `perf`, `guide` như `playwright.config.ts`): **312 / 312 passed** (149 s; `E\e2e-mut.log`, `E\control.json`). Vitest `apps/desktop/src/routes/` qua `mutant-config.mjs`: 24 file, **531 / 531** (`E\vitest-control-routes.log`).
- **Gỡ tạm phần sửa:** `E\mut-list.mjs` — 26 đột biến lượt 5 (mỗi đột biến thay đúng một chỗ, `check-muts.mjs` 26 / 26 khớp đúng một lần). Vitest qua hook `load` (`mutjs.mjs`); TSX qua bản dựng đột biến ngoài repo (`e2e-mut.mjs`: **KILLED chỉ khi một ca xanh ở đối chứng đỏ ở bản đột biến**, so theo tên ca). Repo không bị ghi: dòng cuối `E\mutjs.log` và `E\e2e-mut.log` là `git status --short after: ""`.

### 2.1 Bảng R1 (7 dòng của gói E)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-37 | #790 → #845, #901 → #920 (phần gói E) | **ĐÃ SỬA** (phần gói E) | Theo mô tả lượt 1 (L·CL-E5, `docs/reviews/raw/2026-10-15/claude/E.md:148`): 8 chỗ. Ở `37a80b6` cả 8 qua i18n: `AppointmentsScreen.tsx:72`, `:648` `.join(t('sep.list')) \|\| t('appointments.none')`, `:652`, `:653` `t('appointments.none')`; `AppointmentDialog.tsx:239` `t('appointmentForm.coordinatorRemoveMark')`; `TeamCompare.tsx:93` `overview.compare.expanded/collapsed`; `SettingsTrash.tsx:72` `t('trash.owner.none')` (`git grep`). `sep-scan.mjs` (probe lượt 4, 38 file SP gói E, bỏ comment; `E\sep-scan.log`): 2 dòng báo đều là chú thích kiểu `}: {` (như lượt 4), `findHardcodedSeparators` 0. **Gỡ sửa** (`r37-guard-e.mjs`, đặt lại từng ký hiệu như trước #845 rồi chạy bộ chặn của `lint:tokens`): R37Ea `×`, R37Eb `▾ ▸`, R37Ec `—`, R37Ed `·`, R37Ee `→`, R37Ef `', '` → **6 / 6 CAUGHT** (`E\r37-guard-e.log`) | Phần gói D và chỗ hở của bộ chặn: `claude\D.md` (DR6-145, CLR5-D1, D2), không báo lại |
| DR6-148 | #902 → #922 (+ #932 → #941, #951 → #958) (phần gói E: (c) So sánh team, (d) Báo cáo) | **ĐÃ SỬA** (phần gói E); biến thể còn hở → **CLR5-E1**; một phần sửa không ca nào giữ → **CLR5-E4 (c)** | **Tái hiện lượt 4 chạy lại** (N1, N2 của Codex lượt 4, `docs/reviews/raw/2026-10-31/codex/E.md:122-123`; `node p41-long-names-e.mjs 4811`, `E\p41-long-names-e.log`): team `W`×160 → Tổng quan `scrollWidth` 1 100 = cửa sổ 1 100 (lượt 4: 3 005), cả khi mở hàng team (1 440: 1 440); RE `R`×160 → Báo cáo Theo RE cuộn hết sang phải: cột ghim 257 px, khung 790 px, **11 / 18 ô số thấy** ở 1 100 (17 / 18 ở 1 440; lượt 4: cột ghim 1 770 px che mọi số). **Gỡ sửa:** E148c (ô tên So sánh team `whitespace-nowrap` lại) **KILLED** `long-names.spec.ts:211`; E148d (bỏ `max-w-60` của span tên) **KILLED** `:231` (`E\e2e-mut.log`). E148e (cột Team của Theo RE không bọc span) **SỐNG** (6 / 6 `long-names`) | Tên dài có dấu cách (RE 46 chữ, team 49 chữ, KH 61 chữ; `p41b-long-spaced.mjs`): không màn nào tràn. **Chỗ DR6-148 chưa nêu, còn tràn với tên liền dài:** bảng + khung chi tiết Lịch hẹn, bảng Thùng rác, thẻ Hợp đồng của hồ sơ, ô chọn "RE của góc nhìn" → CLR5-E1 |
| DR6-150 | #903 → #924 (+ #933 → #946, #951 → #958) | **ĐÃ SỬA**; biến thể còn hở → **CLR5-E3**; cùng họ → **CLR5-E2** | Theo mô tả tổng hợp lượt 4 §6.5 (Case size 6c / 6d / 6f; ba `pending` của 6b / 6e / 6c). **Tái hiện lượt 4 chạy lại** (`p26-blank-case-size.mjs 4811`, `E\p26-blank-case-size.log`): 6c, Case size dán U+200B / U+0085 / U+2060 → không lỗi, "Lưu kết quả" đóng hộp, chi tiết ghi "Đã gặp" (lượt 4: "Chưa nhập số tiền.", hộp còn mở); ô trống: như cũ. **Gỡ sửa:** E150a (`readCaseSize` hỏi trống bằng `trim()`) **KILLED** 2 ca `outcome-form.test.ts` + `appointment-outcome.spec.ts:159`; E150b / E150c / E150d (`pending` của 6b / 6e / ngày hẹn tiếp 6c bằng `trim()`) **KILLED** `:159` (`E\mutjs.log`, `E\e2e-mut.log`) | Hộp Hợp đồng 8a–8d hỏi "trống" của ô ngày / FYP bằng `trim()` nên ô chỉ có ký tự vô hình báo lỗi trước khi bấm Lưu → CLR5-E3. Hai ô tìm của gói E so chữ gõ qua `trim()` → CLR5-E2 |
| DR6-151 | #903 → #924 (+ #933 → #946) | **ĐÃ SỬA** | **Tái hiện lượt 4 chạy lại** (`node --import ./hooks.mjs p23r5-restore-names.mjs`, `E\p23r5-restore-names.log`; lớp dữ liệu của app, `codedCustomers(listTrash)` + `restoreLabel(row, coded, today)` như màn): dữ liệu tải 113 dòng → 113 tên khác nhau; Thùng rác lớn (dữ liệu tải + 1 200 KH xóa bằng lệnh xóa) → **42 KH mang mã, 0 tên KH dùng chung** (lượt 4: 21 tên KH dùng chung). (b) nhân sự: "Khôi phục nhân sự Trần Văn Trùng · RE · Bình Minh". **Gỡ sửa:** E151a (không KH nào mang mã) **KILLED** `trash-view.test.ts` + `trash.spec.ts:637`; E151b (nhân sự không vai trò / team) **KILLED** 2 ca; E151c (mã theo tên, bỏ nhóm) **KILLED** "tells apart two customers of the same name by their stage". E151d (`codedCustomers` tính trên dòng đang lọc thay mọi dòng) **sống** (12 / 12 `trash.spec.ts`): gần tương đương — chỉ khác khi bộ lọc / ô tìm giấu một KH của cặp, lúc đó nút còn lại không có mã nhưng trên bảng không còn dòng nào cùng tên | Biến thể ngoài mô tả (`p23r5`): hai nhân sự cùng tên, vai trò, team; team xóa → tạo lại cùng tên → xóa: hai nút cùng tên, nhưng hai dòng cũng giống hệt nhau ở "Bản ghi" / "Thuộc" (chỉ "Xóa lúc" có thể khác) — đúng nguyên tắc "cái gì tách hai dòng thì tách hai nút" của `restoreLabel`, không ghi phát hiện. Hai KH khác nhau chỉ ở hoa / thường ("Lê Thị Hoa" / "lê thị hoa"): hai nút đọc giống nhau khi nói, như chính hai ô; không ghi |
| DR6-152 | #903 → #924 | **ĐÃ SỬA** | `trash-view.ts:552` `const PURGE_REMINDER = 1_000;` (không `export`); `git grep -n PURGE_REMINDER 37a80b6 -- apps` → 3 dòng, cùng file. `r2-exports.mjs` (scanner lượt 2–4, `E\exports.log`): `PURGE_REMINDER` không còn trong danh sách "unused outside file" | Danh sách "chỉ test dùng" như lượt 4 (seam test: `OUTCOME_CHOICES`, `readFyp`, `buildReportWorkbook`, `reportFileName`, `reportWorkbookMeta`) + kiểu |
| DR6-153 | #903 → #924 | **ĐÃ SỬA** | Hai đột biến sống của lượt 4 nay bị giết (`E\e2e-mut.log`): **RB2e** (câu từ chối của Nhập backup bỏ vế "Thử lại") **KILLED** `save-state.spec.ts:126` (lượt 4: sống 296 / 296); **T305b** (ô "Bản ghi" của KH không vẽ huy hiệu nhóm) **KILLED** `trash.spec.ts:197` (lượt 4: sống 296 / 296) | — |
| DR6-154 | #903 → #924 (+ #933 → #946, #951 → #958) | **ĐÃ SỬA**; một nhánh chặn không ca nào giữ → **CLR5-E4 (a)** | **Tái hiện lượt 4 chạy lại** (`p34r5-confirm-focus.mjs 4811` = `p34` + `p34b` lượt 4 thêm phím, `E\p34r5-confirm-focus.log`; exe giả `holdBackup`): lúc chạy focus ở `BUTTON (aria-disabled=true) "Đang dọn…" / "Đang nạp lại…" / "Đang nhập…" in dialog` (lượt 4: `BODY` cả ba); cây trợ năng: `button "Đang dọn…" [disabled]`; Shift+Tab về lại nút; Enter + Space + click lên nút lúc chạy → **1** backup sau khi thả (chạy một lần); xong: 11i → thông báo 11j, 10c → "Nạp lại…", 10a → "Chọn file…". **Gỡ sửa:** E154a (nút tắt bằng `disabled` như trước #924) **KILLED** `dialog-keyboard.spec.ts:150`, `:186`, `trash.spec.ts:662`; E154b (nút không nhận focus) **KILLED** `:150`; E154c (hộp gõ chữ chạy lại khi bấm nút đang chạy, = R128m lượt 4 khi đó tương đương) **KILLED** `trash.spec.ts:662`. **E154d** (hộp 10a nhập lại khi bấm nút đang chạy) **SỐNG** 45 / 45 → CLR5-E4 (a) | Một Tab lúc chạy đưa focus ra `BODY`, Tab thứ hai về lại nút: bước "chrome" của `showModal` (lượt 1 gói E đã ghi; e2e `dialog-keyboard.spec.ts:176-178` giữ hai Tab) |

Đếm R1 (7 dòng của gói E): **7 ĐÃ SỬA**, 0 SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY. Biến thể còn hở ghi riêng: CLR5-E1 (DR6-148), CLR5-E2, CLR5-E3 (họ DR6-150), CLR5-E4 (a) (DR6-154), (c) (DR6-148).

### 2.2 Bảng R2 (5 Issue của gói E)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-331 | #932 → #941 (phần gói E: mục 3 ở So sánh team) | **ĐÃ SỬA** (phần gói E; mục 1, 2, 4 và nút team của màn Team: `claude\D.md`) | `TeamCompare.tsx:87` nút tên team `items-baseline … text-left`, mũi tên `shrink-0 text-center` (`:91`). **Gỡ sửa:** E331a (`items-center` lại) **KILLED** `long-names.spec.ts:211` (`E\e2e-mut.log`). Tên thường: đối chứng 312 / 312 (gồm `overview.spec.ts`) | Ghi chú sổ đã gom (RESOLVED #922): không hỏng lại |
| T-332 | #933 → #946 (phần gói E: mục 1 ô Giờ, mục 2 focus 10a / 10b, mục 4 chú thích e2e Thùng rác) | **ĐÃ SỬA** (phần gói E; mục 3: `claude\D.md`; mục 5: `claude\A.md`; mục 6: `claude\B.md`) | Mục 1: `appointment-form.ts:119-125` hỏi trống bằng `normalizeText`. **Gỡ sửa** E332a (`parseTime` như trước #946) **KILLED** 2 ca `appointment-form.test.ts` + `appointment-outcome.spec.ts:159`. Mục 2: `SettingsBackup.tsx:135-143` (`aria-disabled` lúc đọc, `onClick` chỉ mở khi `busy === null`); **gỡ sửa** E332b (`disabled={busy !== null}` lại) **KILLED** `dialog-keyboard.spec.ts:186`, `:225`; E332c (bỏ điều kiện `busy === null`) **KILLED** `:225`. Trên màn (`p34r5`, đường 10a): đóng hộp → focus "Chọn file…". Mục 4: `e2e/trash.spec.ts:660-662` hai dòng "TR-11, 11i…" ngay trên ca "the dialog of a purge that runs stays…" | — |
| T-337 | #951 → #958 (phần gói E: mục 1 ô Giờ; hai chỗ gọi của mục 2) | **ĐÃ SỬA** (phần gói E; class nền `Button`, mục 3: `claude\D.md`) | Mục 1: `parseTime` khớp trên `normalizeText(text)` (`appointment-form.ts:122`). **Gỡ sửa** E337a (rỗng theo `normalizeText`, khớp trên `trim()` = bản sau #946, trước #958) **KILLED** "reads a time with invisible characters as the time it shows". Trên màn (`p40-invisible-more.mjs 4811`, `E\p40-invisible-more.log`): 6b Giờ dán U+200B + `14:00` → lưu, chi tiết "20/09/2026 14:00 · Bùi Bảo Giang". Mục 2: `ConfirmWordDialog.tsx:28-36` và `SettingsBackup.tsx:135-143` không truyền `className`; `git grep aria-disabled 37a80b6 -- apps/desktop/src` chỉ ra thuộc tính / comment, không class | Dạng giờ khác (`14h00`, `14 : 00`, toàn khổ `１４:００`, `14∶00`, `14.00`) → "Giờ từ 00:00 đến 23:59.", không lưu; mockup 6b chỉ vẽ `25:00` → câu này (`appointment-forms.html:117-121`): không lệch, không ghi |
| T-350 | #1001 → #1011 | **ĐÃ SỬA**; phần nối ở màn không ca nào giữ → **CLR5-E4 (b)** | `recordTitle(row, today)` và `appointmentRestore` dùng `statusLabel(row, today)` (`trash-view.ts:89-92`, `:421-431`); màn truyền `useToday()` (`SettingsTrash.tsx:291`, `:304`; `RestoreDialog.tsx:27-28`). **Trên màn** (`p43-t350-screen.mjs 4820`, `E\p43-t350-screen.log`, `dist-real`, đồng hồ trang 15/09/2026 09:30): nhập bù 10/09 10:00 → chi tiết, hộp xóa "Chưa ghi kết quả"; dòng Thùng rác "10/09/2026 10:00 · Chưa ghi kết quả", tên nút "Khôi phục lịch hẹn 10/09/2026 10:00 · Chưa ghi kết quả của KH Bùi Bảo Giang", hộp khôi phục "Trạng thái Chưa ghi kết quả · Không đổi nhóm KH"; khôi phục → ô Tổng quan "Chưa ghi kết quả" 0 (đã xóa) → 1. **Gỡ sửa:** E350a (`recordTitle` ghi trạng thái lưu) **KILLED** 4 ca `trash-view.test.ts`; E350b (hộp khôi phục ghi trạng thái lưu) **KILLED** 2 ca. **E350c** (màn Thùng rác truyền một ngày rất cũ cho cột) và **E350d** (hộp khôi phục đọc một ngày rất cũ) **SỐNG** 12 / 12 `trash.spec.ts` → CLR5-E4 (b) | Thùng rác mở qua nửa đêm (`p43` B: lịch Dự kiến 15/09 20:00 xóa lúc 23:58, đồng hồ trang chạy 3 phút): dòng, tên nút và hộp khôi phục đang mở tự đổi "Dự kiến" → "Chưa ghi kết quả" lúc 00:01. Dữ liệu tải: 3 lịch Dự kiến trong Thùng rác, cả 3 từ hôm nay trở đi (12/10) → "Dự kiến". Mockup `trash.html:192` "06/10/2026 14:00 · Chưa ghi kết quả" (hướng (a)). Các màn khác đều đọc `statusLabel` (`git grep statusLabel\(`; 6f ghi trạng thái lưu nhưng chỉ cho lịch đã có kết quả) |
| T-353 | #1005 → #1009 (tài liệu) | **ĐÃ SỬA** (dòng ghi có và khớp app) | `nghiem-thu-v1.md:134` (NT-LH-19), `:143` (NT-LH-28), mục "Lệch mockup đã biết" (6b `29/02`). **Trên màn** (`p42-lh19-28.mjs`, `p42b-suggestion.mjs`, `dist-real`, đồng hồ trang): 15/09/2026 `29/02` → "Ngày này không tồn tại.", không nút Dùng; **30/04/2027** `29/02` → "Ngày này không tồn tại." + khối "Năm 2027 không có ngày 29/02. Ý anh là 29/02/2028? Dùng 29/02/2028", không câu "App không tự đổi năm" (ca L3 ghi "không thử được trên ngày máy năm 2026"); 29/04/2027 (60 ngày) → không gợi ý; `5/1` → "05/01/yyyy đã qua n ngày. Ý anh là 05/01/(yyyy+1)? … App không tự đổi năm. Giữ nguyên là ghi lịch hẹn quá khứ (nhập bù)."; `28-9` → "Gõ dd/mm hoặc dd/mm/yyyy."; `25:00` → "Giờ từ 00:00 đến 23:59."; Trigger "—" → câu của dòng; không tạo lịch. NT-LH-28: hộp ghi "Trong "Các lần hẹn trước": dd/mm · Dời lịch · Ghi chú: …" ở cả hai ca; (a) lịch 16/09 dời → "Các lần hẹn trước" chưa có dòng; sau khi đồng hồ trang qua nửa đêm (16/09) → có "16/09 · Dời lịch · Ghi chú: …"; (b) lịch hôm nay → có ngay | — |

Đếm R2 (5 Issue của gói E): **5 / 5 ĐÃ SỬA** (phần gói E), 0 SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY. Test hở ghi riêng: CLR5-E4 (b) (T-350).

**Refactor không đổi hành vi (phần gói E):** T-326 / T-332 đổi chữ ký `restoreLabel`, `recordTitle`, `restoreView` và nới kiểu `statusLabel` / `appointmentGroup` (`Pick<…, 'status' | 'date'>`): đối chứng 312 / 312 e2e, 531 / 531 vitest `routes/`; `tsc --noUnusedLocals --noUnusedParameters` app exit 0. Khôi phục ở Thùng rác lớn sau khi cột được dựng lại theo `coded` / `today` (`useMemo(…, [coded, today])`, `SettingsTrash.tsx:303-304`) giữ cách sắp, số dòng "Hiện thêm" và ô tìm (`p44`, mục 4 K11).

## 3. Phạm vi đã đọc

**Danh sách gói E** (`E\list.mjs` = probe lượt 4, luật `classifyFile` của `tools/size-report-core.mjs` ở `37a80b6`; `E\list.log`, `E\files.txt`): **52 file (38 SP, 14 test), 8 272 dòng SP / 4 700 dòng test** (= `common\baseline.md`).

**Diff sửa của gói E** `2e51e25..37a80b6` (`E\fix-diff.patch`, 1 104 dòng): SP +178 / −61 ở 13 file, test +200 / −56 ở 3 file (= baseline). 6 commit (`E\fix-commits.log`): #922 (`06c5a1b`), #924 (`4d7e689`), #941 (`023cf3b`), #946 (`66019cc`), #958 (`2cc4464`), #1011 (`3d237b0`). Đọc từng hunk của: `ConfirmWordDialog.tsx` (đủ, 105 dòng), `RestoreDialog.tsx`, `SettingsBackup.tsx` (đủ phần 60–303), `SettingsTrash.tsx` (đủ phần đổi + 280–406), `AppointmentDialog.tsx`, `OutcomeDialog.tsx`, `RescheduleFields.tsx`, `appointment-form.ts` (80–169), `appointments-view.ts`, `outcome-form.ts`, `TeamCompare.tsx`, `ReportTable.tsx`, `trash-view.ts` (đủ 1–570); test đổi: `appointment-form.test.ts`, `outcome-form.test.ts`, `trash-view.test.ts` (phần đột biến nhắm).

**Đọc thêm ở `37a80b6`:** `PolicyDialogs.tsx:1-200`, `policy-form.ts:20-130`, `EditOutcomeDialog.tsx:60-100`, `AppointmentDialog.tsx:170-305`, `:370-385`, `CustomerPolicies.tsx` (chỗ tên RE), `ScopePicker.tsx` (gói D, nối vào màn gói E), `SelectField.tsx:46-80`, `DataTable.tsx:100-160` (gói D). Các file gói E không đổi từ `2e51e25`: lượt 1–4 đã đọc hết; phiên này đọc lại phần nêu trên và chạy qua probe.

**Chỗ gói khác nối vào:** `packages/domain/src/appointment-counts.ts` (đủ), `text.ts:32-71`; `packages/db/src/team.ts:144-313` (`assertTeamNameFree`, `createPerson`), `customers.ts:40-120`; `e2e/{dialog-keyboard.spec.ts:150-281, trash.spec.ts:630-700}` và tên ca của mọi spec mà đột biến nhắm; mockup `appointment-forms.html:95-130` (6b); `nghiem-thu-v1.md:132-143`, `:312`.

**Tài liệu:** `CLAUDE.md` gốc, `apps/desktop/CLAUDE.md`, `packages/{domain,db,ui}/CLAUDE.md`, `.claude/rules/{i18n-ui,tests,mockups}.md`; `common\{prompt-claude.md (đủ), known.md (đủ), baseline.md (đủ), fixes.md (#902 / #922, #903 / #924, #932 / #941, #933 / #946, #951 / #958, #1001 / #1011, #1005 / #1009 đủ và nhóm RESOLVED)}`; tổng hợp lượt 4 §6.4, §6.5, §5.2; báo cáo gốc lượt 4 Claude E (đủ), Codex E (bảng R, kịch bản N1–N11, CXR4-E1, E2), lượt 1 Claude E (CL-E5); `claude\D.md` lượt 5 (đủ), dòng đầu `claude\A.md`–`C.md`. Tìm theo từ khóa (`searchCustomers`, `filterTrash`, `ô tìm`, `Tìm theo tên`) trong `docs/reviews/` để biết kịch bản ô tìm chưa ai thử với chữ dán.

## 4. Kịch bản mới đã thử

Chưa có trong báo cáo gói E lượt 1–4 (đọc mục 4 / kịch bản của Claude, Codex lượt 4; tìm từ khóa trong `docs/reviews/raw/`) và trong `claude\A.md`–`D.md` lượt 5. Mọi probe trình duyệt: Edge headless, chặn mạng ngoài localhost / 127.0.0.1 và thay `window.open` từ lần chạy đầu; mọi log kết thúc bằng `requests blocked (not localhost / 127.0.0.1) []`, page errors `[]`.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| K1 | Ô tìm của gói E với tên dán như người dùng hay dán (`p40` C): 6b "Khách hàng" và Thùng rác "Tìm theo tên", tên đúng như hiện / U+200B đứng trước / NBSP thay dấu cách / hai dấu cách / U+200B giữa chữ | Tên như hiện: 1 khớp / 2 dòng; bốn dạng còn lại: **0 khớp**, "Không có KH khớp." / "Không có bản ghi đã xóa nào khớp." | CLR5-E2 |
| K2 | Ô bắt buộc của hộp Hợp đồng 8a chỉ có ký tự vô hình (`p40` A): FYP nộp U+200B, U+2060 + U+0085; Ngày nộp U+200B; đối chứng ô trống | Ký tự vô hình: báo ngay "Chưa nhập số tiền." / "Nhập ngày." (`aria-invalid`) trước khi bấm Lưu; ô trống: không báo tới khi Lưu. U+200B + "15/9", U+200B + "50tr" đọc đúng | CLR5-E3 |
| K3 | Ô Giờ của 6b với các dạng giờ người gõ hay dùng (`p40` B): U+200B `14:00`, `14h00`, `14 : 00`, toàn khổ, `14∶00`, `14.00` | U+200B `14:00` lưu 14:00 (T-337); 5 dạng khác "Giờ từ 00:00 đến 23:59.", không lưu — như mockup 6b (chỉ vẽ `25:00`), không ghi | — |
| K4 | Tên liền dài ở các màn gói E mà DR6-148 và e2e chưa đo (`p41`): KH 81 chữ + RE 160 chữ — Lịch hẹn (bảng, chi tiết), Thùng rác (bảng, hộp khôi phục), thẻ Hợp đồng của hồ sơ, góc nhìn RE ở Tổng quan / Báo cáo / Lịch hẹn; 1 100 và 1 440 | Tổng quan, Báo cáo, hộp khôi phục: không tràn. **Tràn trang:** Lịch hẹn 2 038 px (1 100) / 2 324 px (1 440); Thùng rác 1 992 px; hồ sơ 1 392 px (1 100); ô chọn góc nhìn rộng 1 367 px → trang 1 932–2 037 px ở cả hai bề rộng | CLR5-E1 |
| K5 | Như K4 với tên dài có dấu cách (`p41b`): RE 46 chữ, team 49 chữ, KH 61 chữ | Không màn nào tràn; ô chọn góc nhìn 496 px | — |
| K6 | NT-LH-19 ở ngày mà L3 không thử được (`p42`, `p42b`, đồng hồ trang 29/04/2027 và 30/04/2027): `29/02` hai bên mốc 60 ngày, `5/1`, `28-9`, `25:00`, Trigger "—" | Khớp từng ý của dòng (mục 2.2 T-353); 29/04/2027 không gợi ý, 30/04/2027 gợi ý "29/02/2028" | — |
| K7 | NT-LH-28 qua nửa đêm (`p42`): dời lịch Dự kiến ngày mai rồi để đồng hồ trang chạy qua 00:00 với app đang mở | Ngay sau khi lưu: chưa có dòng "Dời lịch"; sau nửa đêm: có "16/09 · Dời lịch · Ghi chú: …" mà không cần tải lại | — |
| K8 | Thùng rác mở qua nửa đêm, hộp khôi phục đang mở (`p43` B): lịch Dự kiến hôm nay xóa lúc 23:58 | Dòng, tên nút và hộp đang mở đổi sang "Chưa ghi kết quả" lúc 00:01 | — |
| K9 | Chuỗi nhập bù → xóa → Thùng rác → khôi phục → chỉ số (`p43` A): lịch 10/09 chưa ghi kết quả | Nhãn "Chưa ghi kết quả" ở mọi bước; ô Tổng quan 0 → 1 sau khi khôi phục | — |
| K10 | Bấm Enter, Space rồi click lên nút "Đang …" lúc hộp xác nhận đang chạy (`p34r5`), ở 11i, 10c, 10a; rồi cùng thao tác trên bản đột biến E154d (`p34r5-on-E154d.log`) | Bản ghim: 1 backup mỗi hộp. Bản đột biến E154d: 10a **4 backup / 4 lần nhập**, không ca e2e nào đỏ | CLR5-E4 (a) |
| K11 | Thùng rác lớn (1 313 dòng, `p44`): sắp theo "Thuộc", "Hiện thêm" hai lần (300 dòng), khôi phục dòng thứ 250; rồi gõ "Nguyễn", khôi phục một dòng khớp | Sau khôi phục: vẫn sắp "Thuộc ↑", vẫn 300 dòng ("Đang hiện 300 / 1.312 bản ghi"), focus ở thông báo 11e; ô tìm giữ "Nguyễn", 74 → 73 dòng. Không hồi quy do cột dựng lại theo `coded` / `today` | — |
| K12 | Biến thể DR6-151 ngoài mô tả (`p23r5`): hai nhân sự cùng tên / vai trò / team; team xóa, tạo lại cùng tên, xóa; hai KH khác nhau chỉ ở hoa / thường | Hai cặp đầu: nút trùng tên nhưng hai dòng giống hệt nhau ở "Bản ghi" / "Thuộc"; cặp hoa / thường: nút đọc giống như hai ô. Không ghi (mục 2.1) | — |

## 5. Phát hiện mới

### CLR5-E1 — Tên liền dài còn kéo trang cuộn ngang ở Lịch hẹn (bảng, chi tiết), Thùng rác, thẻ Hợp đồng và ô chọn "RE của góc nhìn" (chỗ DR6-148 chưa nêu)

```
ID: CLR5-E1
Mức: Low
Trục: E, A
Vị trí: apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:316-320 (bảng danh sách không trong khung cuộn), :669 (`<dd className="m-0 whitespace-pre-line">` của khung chi tiết); apps/desktop/src/routes/SettingsTrash.tsx:70-80 (`OwnerCell`), :372 (DataTable không trong khung cuộn); apps/desktop/src/routes/customers/CustomerPolicies.tsx:89 (`<span className="text-fg-3">{re.name}</span>`); apps/desktop/src/shell/ScopePicker.tsx:49-57 + packages/ui/src/components/SelectField.tsx:55-63 (ô chọn không giới hạn rộng; gói D, thấy trên màn gói E) (37a80b6)
Tình trạng: CONFIRMED
Liên quan: DR6-148 (biến thể), họ DR6-117, cùng loại CLR5-D3 (gói D) · có từ trước, lượt 1–4 bỏ sót
Kịch bản: K4, K5
```

- **Mô tả:** DR6-148 (tên không có trần độ dài; tên liền dài là đầu vào hợp lệ) đã sửa đúng bốn chỗ nêu trong mô tả. Trên các màn khác của gói E, chuỗi liền dài vẫn không ngắt: ô KH / RE của bảng Lịch hẹn và dòng RE trong khung chi tiết; ô "Thuộc" của bảng Thùng rác; tên RE trong hàng HĐ của thẻ Hợp đồng. Hai bảng không nằm trong khung cuộn nên giãn cả trang. Khi chọn góc nhìn RE, ô chọn "RE của góc nhìn" rộng bằng lựa chọn dài nhất nên đẩy thanh trên ra ngoài, ở cả Tổng quan, Báo cáo, Lịch hẹn, kể cả ở 1 440.
- **Tái hiện / bằng chứng:** `node p41-long-names-e.mjs 4811` (`E\p41-long-names-e.log`; RE đầu team Bình Minh đổi tên `R`×160 qua hộp "Sửa nhân sự" của màn Team, KH mới `K`×81 qua 5a, lịch 15/09 10:00):
  - `L Lịch hẹn list + detail @1100 {"scrollWidth":2038,…"dd.m-0.whitespace-pre-line right 1984 … in aside[Chi tiết lịch hẹn]","table.w-full… right 2038 … in section[appointments-list]"}`; @1440: 2 324.
  - `T Thùng rác … @1100 {"scrollWidth":1992,… "table.w-full… right 1992 … in section[trash-title]"}` (cả 1 440); hộp khôi phục `scroll 446 = client 446` (không tràn).
  - `H hồ sơ with Hợp đồng card @1100 {"scrollWidth":1392,… "span.text-fg-3 right 1392 "Rxxx…" in section[customer-policies]"}`; @1440 không tràn.
  - `S scope RE 160 on /#/reports @1100 {"scrollWidth":1932,… "div.flex.items-center.gap-2 right 1932 "Toàn bộTeamRERE của góc" in header[]"}`; `/#/overview` 1 954, `/#/appointments` 2 037 (cả 1 440); `select width 1367`.
  - Đối chứng: cùng probe với tên dài có dấu cách (`p41b-long-spaced.mjs`, `E\p41b-long-spaced.log`): mọi màn `scrollWidth` = cửa sổ, ô chọn 496 px; DR6-148 (c), (d) không tràn (mục 2.1).
- **Ảnh hưởng:** chỉ khi có tên liền dài bất thường (như DR6-148). Lịch hẹn (màn chính) và Thùng rác cuộn ngang cả trang, cột phải ra ngoài cửa sổ; chọn góc nhìn RE có tên như vậy làm thanh trên của ba màn cuộn ngang. Không sai dữ liệu.
- **Đề xuất:** như DR6-117 / DR6-148: ô tên / RE / "Thuộc" của hai bảng và tên RE của thẻ Hợp đồng bọc `block max-w-60 wrap-anywhere` (cách của `ReportTable.tsx`), `dd` của khung chi tiết thêm `wrap-anywhere`; ô chọn góc nhìn giới hạn bề rộng (`max-w-*`, lựa chọn vẫn hiện đủ khi mở); ca e2e trong `long-names.spec.ts` (KH 81, RE 160 ở 1 100 / 1 440: trang không cuộn ngang ở Lịch hẹn, Thùng rác, hồ sơ, và sau khi chọn góc nhìn RE). Có thể gộp với CLR5-D3. ≈ 8 dòng SP + ≈ 50 dòng e2e.

### CLR5-E2 — Hai ô tìm của gói E (chọn KH ở 6b, "Tìm theo tên" ở Thùng rác) không tìm ra tên dán có ký tự vô hình / NBSP hay gõ hai dấu cách

```
ID: CLR5-E2
Mức: Low
Trục: E
Vị trí: apps/desktop/src/routes/appointments/appointment-form.ts:165 (`searchCustomers`: `stripDiacritics(query.trim().toLowerCase())`); apps/desktop/src/routes/trash-view.ts:74 (`filterTrash`: cùng cách); apps/desktop/src/routes/appointments/AppointmentDialog.tsx:378 (`query.trim() !== ''`) (37a80b6)
Tình trạng: CONFIRMED
Liên quan: họ DR6-150 (ô hỏi "trống" / đọc chữ bằng `trim()` thay `normalizeText`), K20 / K25 (tên lưu đã gộp mọi khoảng trắng Unicode, bỏ ký tự vô hình) · có từ trước, lượt 1–4 bỏ sót
Kịch bản: K1
```

- **Mô tả:** Tên KH / nhân sự / team được lưu qua `normalizeText` (K20, K25: gộp mọi khoảng trắng Unicode thành một dấu cách, bỏ `\p{Default_Ignorable_Code_Point}`). Hai ô tìm của gói E chỉ `trim()` chữ gõ rồi bỏ dấu, nên chữ dán kèm U+200B, NBSP thay dấu cách, hay hai dấu cách liền nhau không bao giờ khớp một tên đã lưu. Ô Ngày cùng hộp (`parseQuickDate`) và ô Giờ (T-337) đã đọc qua `normalizeText`.
- **Tái hiện / bằng chứng:** `node p40-invisible-more.mjs 4811` (`E\p40-invisible-more.log`, bản ghim `dist-base`, dán bằng setter + sự kiện `input` như e2e `pasteAsIs`):
  - `C 6b search as shown "Bùi Bảo Giang": matches 1`; `U+200B before "​Bùi Bảo Giang": matches 0, "none" line 1`; `no-break space "Bùi Bảo Giang": matches 0`; `two spaces "Bùi  Bảo  Giang": matches 0`; `U+200B inside word "Bù​i": matches 0`.
  - `C Thùng rác search as shown "Bùi Bảo Giang": table rows 2`; ba dạng còn lại: `table rows 0, "Không có bản ghi đã xóa nào khớp." 1`.
- **Ảnh hưởng:** RE dán tên KH từ tin nhắn / trang web (NBSP, ký tự vô hình hay gặp khi chép) hoặc lỡ gõ hai dấu cách thì 6b báo "Không có KH khớp." dù KH có, Thùng rác báo không có bản ghi; phải xóa rồi gõ lại. Không sai dữ liệu.
- **Đề xuất:** so trên `stripDiacritics(normalizeText(query).toLowerCase())` ở cả hai hàm (một hàm chung "chuỗi tìm" cạnh `stripDiacritics` của `@p2c/domain` hay trong app), và `AppointmentDialog.tsx:378` hỏi trống bằng `normalizeText`; ca unit cho `searchCustomers` / `filterTrash` với U+200B, NBSP, hai dấu cách. ≈ 6 dòng SP + ≈ 15 dòng test.

### CLR5-E3 — Hộp Hợp đồng 8a–8d: ô ngày / FYP chỉ có ký tự vô hình báo lỗi ngay, trước khi bấm Lưu, trong khi ô trống chờ lần bấm Lưu

```
ID: CLR5-E3
Mức: Nit
Trục: E, A
Vị trí: apps/desktop/src/routes/customers/PolicyDialogs.tsx:79 (`const shown = (text: string) => attempted || text.trim() !== '';`), dùng ở :81-93 (37a80b6)
Tình trạng: CONFIRMED
Liên quan: DR6-150 (biến thể của phần `pending`; Issue #903 chỉ giao 6b / 6e / 6c) · có từ trước, lượt 1–4 bỏ sót
Kịch bản: K2
```

- **Mô tả:** Theo comment của hộp, "An empty field shows its error only once saving was tried". `shown` hỏi trống bằng `trim()`, nên ô Ngày nộp / FYP nộp (và hai ô phát hành) chỉ có U+200B / U+2060 / U+0085 hiện lỗi ngay, ô không hiện gì mà đã đỏ; ô trống thật thì chờ lần bấm Lưu. Ở 6b / 6e / 6c, DR6-150 đã cho ô ngày chỉ có ký tự vô hình chờ như ô trống (`normalizeText`).
- **Tái hiện / bằng chứng:** `p40-invisible-more.mjs` phần A (`E\p40-invisible-more.log`): `A 8a FYP nộp at open (empty) {"invalid":null,"described":""}`; `FYP nộp = U+200B, before Lưu {"invalid":"true","described":"Chưa nhập số tiền."}`; `= U+2060 U+0085 … "Chưa nhập số tiền."`; `emptied again … {"invalid":null,"described":""}`; `Ngày nộp emptied … {"invalid":null}`; `Ngày nộp = U+200B, before Lưu {"invalid":"true","described":"Nhập ngày."}`.
- **Ảnh hưởng:** chỉ lúc nào lỗi hiện: ô bắt buộc nên bấm Lưu vẫn bị chặn với cùng câu; không sai dữ liệu.
- **Đề xuất:** `shown = (text) => attempted || normalizeText(text) !== ''`, như ba `pending` của #924; một ca e2e cạnh ca DR6-150 của `appointment-outcome.spec.ts` (hay `customer-policies.spec.ts`). ≈ 1 dòng SP + ≈ 10 dòng e2e.

### CLR5-E4 — Test hở của đợt sửa gói E: chặn chạy lại của hộp 10a, phần nối `today` của T-350 ở màn, cột Team của Báo cáo Theo RE

```
ID: CLR5-E4
Mức: Low
Trục: T
Vị trí: (a) apps/desktop/src/routes/SettingsBackup.tsx:243-245 (`onSubmit={() => { if (!running) void replace(); }}`); (b) apps/desktop/src/routes/SettingsTrash.tsx:291, :304 (`trashColumns(setRestoring, coded, today)`), apps/desktop/src/routes/RestoreDialog.tsx:27-28; (c) apps/desktop/src/routes/reports/ReportTable.tsx:119-123 (span `NAME` của cột Team) (37a80b6)
Tình trạng: CONFIRMED
Liên quan: DR6-154 (#903 → #924), T-350 (#1001 → #1011), DR6-148 (#902 → #922) · mới do đợt sửa sau lượt 4 (PR #924, #1011, #922)
Kịch bản: K10
```

- **Mô tả:**
  - (a) PR #924 cho nút xác nhận của hộp 10a nhận focus và bấm được lúc đang chạy (`aria-disabled` thay `disabled`, `type="submit"`); từ đó chỉ còn điều kiện `!running` của `onSubmit` chặn lần nhập thứ hai. Ở hộp gõ chữ (11i, 10c), ca `trash.spec.ts:662` click nút đang chạy rồi đếm một backup (E154c bị giết); ở 10a không ca nào bấm nút lúc chạy (`dialog-keyboard.spec.ts:186` chỉ Escape).
  - (b) T-350 sửa nhãn trong `trash-view.ts` (unit giữ: E350a, E350b bị giết), nhưng phần màn truyền `today` vào cột và hộp khôi phục không ca nào giữ: e2e Thùng rác chỉ xóa lịch của hôm nay ("Dự kiến" với mọi `today` từ hôm đó trở về trước), PR #1011 ghi "E2E không đổi".
  - (c) PR #922 bọc cả cột Team (không ghim) của Theo RE bằng span `max-w-60` "để tên team dài không đẩy bảng thêm ~1 300 px"; ca `long-names.spec.ts:231` chỉ đo cột ghim và ô số thấy được, nên bỏ span ở cột Team vẫn xanh.
- **Tái hiện / bằng chứng:** `E\e2e-mut.log`:
  - `E154d | DR6-154 | the import dialog (10a) imports again when its running button is pressed | SURVIVED — 45 ran, 45 passed, 0 control-green failed … filters dialog-keyboard.spec.ts | trash.spec.ts | demo-data.spec.ts | save-state.spec.ts | backup.spec.ts`. Trên chính bản đột biến (`dist-E154d`, cổng 4821; `node p34r5-confirm-focus.mjs 4821`, `E\p34r5-on-E154d.log`): `[import] … Enter + Space + click on the running button: backups while held 0, after release 4` (bản ghim: 1).
  - `E350c | T-350 | Thùng rác screen passes a day long gone … | SURVIVED — 12 ran, 12 passed`; `E350d | T-350 | restore dialog reads a day long gone … | SURVIVED — 12 ran, 12 passed` (`trash.spec.ts`).
  - `E148e | DR6-148 (d) | Báo cáo: the Team column of Theo RE not capped | SURVIVED — 6 ran, 6 passed` (`long-names.spec.ts`).
  - Hành vi hiện tại đúng: bản ghim nhập một lần (K10), Thùng rác ghi "Chưa ghi kết quả" (`p43`), cột Team bị giới hạn (đọc code).
- **Ảnh hưởng:** chỉ chất lượng test: một lần đổi sau ở ba chỗ này không làm CI đỏ — (a) Enter / Space trên nút "Đang nhập…" sẽ nhập và backup lại (4 lần ở K10), (b) NT-TR-07 quay lại mà không ca nào báo, (c) tên team liền dài kéo bảng Theo RE rộng thêm.
- **Đề xuất:** (a) trong `dialog-keyboard.spec.ts:186` sau khi nút "Đang nhập…" có focus: Enter rồi click (force) lên nó, thả backup, đòi đúng một `backup` trong `exe.events` (≈ 4 dòng); (b) một ca `trash.spec.ts` nhập bù lịch Dự kiến ngày trước hôm nay (như `p43` A), xóa, đòi dòng / tên nút / hộp khôi phục ghi "Chưa ghi kết quả" (≈ 20 dòng); (c) trong `long-names.spec.ts:231` đòi ô Team của Theo RE ≤ 240 px (≈ 3 dòng). 0 SP.

Ngoài CLR5-E1…E4 không có phát hiện mới ở gói E.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc | Trên | Kết quả (số) | ID |
|---|---|---|---|
| `node node_modules/typescript/bin/tsc -p apps/desktop/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` (`E\tsc-unused-app.log`) | app (gồm 52 file gói E) | exit 0, 0 dòng (4 s); `git status --short` sau đó rỗng | — |
| `node r2-exports.mjs` (scanner lượt 2–4, `git grep -w`; `E\exports.log`) | 38 file SP gói E | Không export giá trị nào chết. "Chỉ test dùng": `OUTCOME_CHOICES`, `readFyp`, `buildReportWorkbook`, `reportFileName`, `reportWorkbookMeta` (seam test, như lượt 2–4) + 7 kiểu; "không ai import ngoài file": 22 kiểu, **không còn `PURGE_REMINDER`** (DR6-152) | — |
| Code lặp của đợt sửa (đọc diff + `git grep`) | gói E | `ConfirmButton` một nơi cho 10a / 10c / 11i; cặp class `aria-disabled:` một nơi (`Button.tsx`, gói D); vòng gọi listener một nơi (`listeners.ts`, gói B); `customer.withCode` một khóa. Mẫu `normalizeText(x) === ''` ở 5 chỗ (`readCaseSize`, `parseTime`, ba `pending`): thành ngữ một dòng, không đáng tách. Hai ô tìm cùng một dòng "bỏ dấu + `trim()`" (`appointment-form.ts:165`, `trash-view.ts:74`): gộp được khi sửa CLR5-E2 | — |
| Khóa i18n | `claude\D.md` mục 6.1 (toàn app, `r1-keys`: 1 194 khóa, 0 không dùng); gói E: `sep-scan` 0 ký hiệu viết thẳng | — | — |
| Bundle | `common\baseline.md` (không dựng lại cho số; bản `E\dist-*` có neo) | `index.js` 892 184 B (+7 486 so lượt 4), `index.css` 30 295 B (+543); diff SP gói E +178 / −61 dòng, không thêm dependency (`git diff --stat 2e51e25 37a80b6 -- package.json apps/desktop/package.json packages/*/package.json pnpm-lock.yaml` rỗng, như `claude\D.md`) | — |
| Cỡ dòng | `E\list.log` | SP 8 272 (+117 so lượt 4), test 4 700 (+144), 52 file (0) | — |

Không có đề xuất refactor mới; bloat của gói E không có chi phí đo được.

### 6.2 Hiệu năng

Máy Home PC `DESKTOP-KDURKJP`, Node v24.20.0, Edge (Playwright) headless 1 440 × 900, DevTools gắn (so web với web). Song song: Codex đợt 1 (2 tiến trình `codex`); CPU 2–6 % ngay trước mỗi lần đo; e2e đột biến của phiên đã xong trước khi đo. Dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (nhập qua Cài đặt → Dữ liệu → Nhập backup ở `E\dist-real`; qua `importBackup` của lớp dữ liệu app trong Node) và Thùng rác lớn `E\load-del1200.p2cbackup` (dữ liệu tải + 1 200 KH xóa bằng lệnh xóa, 1 313 dòng; `r3-p09-make-big.mjs`, 16 060 917 B = lượt 4). Luật nhiễu: xấu hơn khi > 20 % **và** > 10 ms. Ngưỡng `phase-6.md`: thao tác màn < 200 ms; Dọn sạch ≤ 500 ms. Cột lượt 4: báo cáo gốc Claude E lượt 4 §6.2, cùng máy, cùng probe.

**A. Node — Thùng rác qua lớp dữ liệu** (`p32-trash-node-perf.mjs`, chữ ký mới `recordTitle(row, today)`, `restoreLabel(row, coded, today)`; `E\p32-trash-node-perf.log`; trung vị):

| Thao tác | 113 dòng (lượt 4) | 1 313 dòng (lượt 4) | ID |
|---|---|---|---|
| `listTrash` | 20,66 ms (20,4) | 140,26 ms (154,9) | — |
| `codedCustomers` (mới, một lần mỗi lần đọc) | 0,01 ms | 0,56 ms | — |
| Một lần render mọi dòng (`recordTitle`, `recordBadge`, `recordDetail`, `ownerParts`, `restoreLabel`, lý do chặn / giữ, `canPurge`, `purgeReminder`) | 0,35 ms (0,34) | 2,59 ms (2,67) | — |
| Mở 11i `purgeView(purgePlan(rows))` | 0,02 ms (0,02) | 0,11 ms (0,18) | — |

**B. Bản web — Thùng rác và Dọn sạch** (`r3-p10-purge-web-perf.mjs` = probe `p10` lượt 3–4; `E\r3-p10-purge-web-perf-{113,1313}.log`; từ thao tác tới khi DOM có kết quả):

| Thao tác | n | 113 dòng (lượt 4) | 1 313 dòng (lượt 4, ba lần) | Ngưỡng | ID |
|---|---:|---|---|---|---|
| Dữ liệu → Thùng rác, trước khi dọn | 6 | 67,2 ms (78,2) | 418,8 ms (621,4 / 524,9 / 510,1) | < 200: 113 ✅ · 1 313 ❌ như lượt 3–4 | DR6-84 (Owner: dọn sạch + câu nhắc từ 1 000) |
| Mở hộp 11i | 5 | 8,0 ms (8,5) | 7,2 ms (9,1–10,9) | ✅ | — |
| Bấm "Dọn sạch" → thông báo 11j | 1 | 99,7 ms (102,1) | 134,8 ms (140,7–168,8) | ≤ 500 ✅ | — |
| Dữ liệu → Thùng rác, sau khi dọn | 6 | 1,5 ms (2,4) | 1,3 ms (1,3–2,1) | ✅ | — |

**C. Bản web — Lịch hẹn và Tổng quan trên dữ liệu tải** (`p28-web-perf.mjs`, không đồng hồ trang; `E\p28-web-perf.log`; trung vị n = 6):

| Thao tác | Lượt 5 | Lượt 4 | Δ | Ngưỡng | ID |
|---|---|---|---|---|---|
| Lịch hẹn, Năm (vẽ 100 dòng): sắp theo Ngày | 11,5 ms | 4,7 ms | +6,8 ms (dưới 10 ms) | < 200 ✅ | — |
| … sắp theo Khách hàng | 25,7 ms | 60,4 ms | −34,7 ms (DR6-136 đã sửa, gói A) | < 200 ✅ | — |
| … sắp theo RE | 21,1 ms | 54,0 ms | −32,9 ms | < 200 ✅ | — |
| Tổng quan: Lọc Năm / Tháng (Toàn bộ) | 16,9 / 16,1 ms | 18,9 / 19,0 ms | ≤ | < 200 ✅ | — |
| Tổng quan: Lọc Năm / Tháng (Team, 4 chart + 4 bảng ẩn) | 33,0 / 32,7 ms | 37,5 / 50,3 ms | ≤ | < 200 ✅ | — |

**D. Exe (không đo lại — `common\baseline.md`, probe `e2e/perf` của bước chuẩn bị, cùng máy):** các thao tác của gói E so mốc sau #656 / G7 / lượt 4: `overview.filter-year` / `-month` 16 / 14 ms (16 / 14 · 17 / 14 · 17 / 17), `reports.filter-year` / `-month` / `table-re` 10 / 10 / 17 (= cả ba mốc), `reports.export-excel` 21 (20 · 25 · 29), `appointments.period-*` 5–11, `sort-date-*` 12–17, `select-*` 5–7, `next-month` / `next-year` 111 / 108 (Năm − Tháng −3 ms ≤ 50), `trash.open` 33 (34 · 33 · 32), `trash.kind-appointments` 8 (6 · 9 · 6; +2 ms), `backup.read` 983 (835 → +18 %, dưới luật nhiễu · 975 · 977), `backup.import` 50 (43 · 44 · 47): không dòng nào ⚠️, mọi dòng trong ngưỡng. Dọn sạch trên exe (dữ liệu tải): 11j sau 128,0 ms ≤ 500 (lượt 4 123,3; G7 130,5).

**Kết luận hiệu năng gói E:** không thao tác nào của gói E vượt ngưỡng trên dữ liệu tải, không số nào xấu hơn lượt 4 / mốc sau #656 / G7 theo luật nhiễu. Code mới của gói E (`codedCustomers`, nhãn theo `today`, `ConfirmButton`) không đo được chi phí (`codedCustomers` 0,56 ms trên 1 313 dòng). Thùng rác 1 313 dòng mở 419 ms trên web như triệu chứng DR6-84 mà Owner chữa bằng dọn sạch. **Không có phát hiện P.**

## 7. Bảng đếm mức × trục

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | | 0 |
| Low | | 2 (E1, E2) | | | | | | | 1 (E4) | | 3 |
| Nit | | 1 (E3) | | | | | | | | | 1 |
| **Tổng** | | 3 | | | | | | | 1 | | **4** |

Mỗi phát hiện đếm một lần ở trục đầu (E1: E, A; E3: E, A). **CONFIRMED 4 / 4**, PLAUSIBLE 0, KNOWN 0. Mới do đợt sửa sau lượt 4: 1 (E4, PR #924, #1011, #922); có từ trước, lượt 1–4 bỏ sót: 3 (E1, E2, E3). Bảng R: **R1 7 / 7 ĐÃ SỬA**, **R2 5 / 5 ĐÃ SỬA** (phần gói E). Đột biến: **29** (vitest 8, e2e 21) — **24 bị giết**, 5 sống (E151d gần tương đương; E154d, E350c, E350d, E148e → CLR5-E4).

## 8. Đã xét, không thấy (theo trục)

- **R:** 7 dòng R1 + 5 dòng R2 (mục 2); tái hiện lượt 4 chạy lại (`p26`, `p23r5`, `p34r5`, N1 / N2 của Codex qua `p41`); RB2e, T305b (sống ở lượt 4) nay bị giết. Không HỒI QUY: đối chứng 312 / 312 e2e, 531 / 531 vitest `routes/`.
- **E:** ký tự vô hình / NBSP / hai dấu cách ở ô Giờ, Case size, ô ngày, ô Hợp đồng, ô tìm (K1–K3); tên liền dài và tên dài có dấu cách (K4, K5); `29/02` hai bên mốc 60 ngày năm 2027 (K6); qua nửa đêm với app mở ở Lịch hẹn và Thùng rác (K7, K8); Thùng rác lớn sắp / "Hiện thêm" / tìm sau khôi phục (K11). Ngoài CLR5-E1, E2, E3 không thấy.
- **C:** NT-LH-19, NT-LH-28 (K46) khớp app ở mọi ý, kể cả ca L3 chưa thử (K6, K7); NT-TR-07 và mockup `trash.html:192` khớp app (T-350); ô Giờ theo mockup 6b (K3); tên nút KH có mã theo khuôn 9b (`customer.withCode`). Lệch mockup đã biết của gói E (8d, 10c, 10d, 6b `29/02`, 6h, Case size) còn đúng như ghi. Không thấy lệch mới.
- **D:** khôi phục lịch Dự kiến đã qua giữ trạng thái lưu, về nhóm Chưa ghi kết quả, ô Tổng quan 0 → 1 (K9); 10a / 10c / 11i chạy một lần dù bấm lại nút đang chạy (K10, bản ghim); dữ liệu tải: 113 tên nút khác nhau. Lệnh ghi của gói E vẫn qua `app.run` / hàng đợi thay thế. Không thấy.
- **G:** gói E không gọi AI (`SettingsAi.tsx` thuộc gói C); dọn sạch xóa phân tích AI của KH đã xóa, 11j đếm đúng ("1 phân tích AI", "99 phân tích AI", mục 6.2 B). Không thấy.
- **S:** `grep -E "dangerouslySetInnerHTML|innerHTML|eval\(|new Function|window\.open|localStorage"` trên các dòng thêm của `E\fix-diff.patch`: 0 dòng; tên nhập qua UI hiện như chữ ở mọi màn đã đo (K4); mọi probe 0 request ra ngoài localhost / 127.0.0.1. Không thấy.
- **P:** mục 6.2 — không phát hiện P.
- **B:** mục 6.1 — không export chết, không ký hiệu viết thẳng, không dependency mới.
- **T:** 29 đột biến (mục 9.2); ngoài CLR5-E4, test mới của đợt sửa gói E không đọc giờ máy hay số ngẫu nhiên (`grep -E "new Date\(|Date\.now|Math\.random|performance\.now"` trên các dòng thêm của `E\fix-diff.patch`: 0 dòng; `trash-view.test.ts` dùng hằng `TODAY` = 11/10/2026 và hàm `at` có sẵn).
- **A:** focus và tên trợ năng của nút "Đang …" lúc chạy (DR6-154, K10); hộp khôi phục / tên nút đọc "Chưa ghi kết quả" (T-350); một Tab lúc chạy ra `BODY` rồi về (bước "chrome" của `showModal`, đã biết, e2e giữ hai Tab). Ngoài CLR5-E1, E3 không thấy.

## 9. Phụ lục

### 9.1 Probe, log (mọi file ở `C:\workspace\deep-review-1-6-r5\claude\E\`)

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `r4copy\*.mjs` | 37 công cụ / probe lượt 4 của Claude E, chép nguyên theo tên (`Test-Path` từng tên) | — | gốc của các bản dưới |
| `make-working.mjs` | bản làm việc: đường dẫn r4 → r5, cổng 46xx → 48xx | — | mọi probe |
| `list.mjs`, `files.txt`, `fix-diff.patch`, `fix-commits.log` | 52 file gói E (`classifyFile`), diff `2e51e25..37a80b6` | `list.log` | mục 3 |
| `build-dist.mjs`, `serve-dist.mjs`, `pw.config.mjs`, `browser.mjs`, `hooks.mjs`, `ui-stub.mjs` | bản web ngoài repo (Vite `build()` + hook `load`), `vite preview` host `localhost`, cấu hình Playwright, bộ trình duyệt (chặn mạng, `asExe`), loader TS | `build-base.log`, `build-real.log`, `serve-4811.*`, `serve-4820.*` | mọi probe |
| `mut-list.mjs`, `check-muts.mjs`, `mutjs.mjs`, `mutant-config.mjs`, `e2e-mut.mjs`, `control.json` | 26 đột biến lượt 5 (vitest qua hook `load`; TSX qua bản dựng đột biến 4812–4819) | `vitest-control-routes.log`, `mutjs.log`, `e2e-mut.log`, `mut\<id>.out`, `mut\<id>-<n>.e2e.out`, `mut\<id>-<n>.json` | mục 2, 9.2 |
| `p23r5-restore-names.mjs` | tên nút khôi phục (dữ liệu tải, biến thể, Thùng rác lớn); T-350 trên dữ liệu tải | `p23r5-restore-names.log` | DR6-151, K12 |
| `p26-blank-case-size.mjs` | tái hiện CLR4-E1 / DR6-150 | `p26-blank-case-size.log` | DR6-150 |
| `p34r5-confirm-focus.mjs` | tái hiện CLR4-E5 / DR6-154 (+ Tab, Shift+Tab, Enter / Space / click lúc chạy, ARIA) | `p34r5-confirm-focus.log`, `p34r5-on-E154d.log` | DR6-154, K10, CLR5-E4 |
| `p40-invisible-more.mjs` | 8a, ô Giờ, hai ô tìm với chữ dán | `p40-invisible-more.log` | K1–K3, CLR5-E2, E3, T-337 |
| `p41-long-names-e.mjs`, `p41b-long-spaced.mjs` | tên dài trên màn gói E (N1 / N2 của Codex lượt 4; chỗ mới) | `p41-long-names-e.log`, `p41b-long-spaced.log` | DR6-148, K4, K5, CLR5-E1 |
| `p42-lh19-28.mjs`, `p42b-suggestion.mjs` | NT-LH-19, NT-LH-28 trên app, đồng hồ trang 2026 / 2027 | `p42-lh19-28.log`, `p42b-suggestion.log` | T-353, K6, K7 |
| `p43-t350-screen.mjs` | T-350 trên màn, qua nửa đêm | `p43-t350-screen.log` | T-350, K8, K9 |
| `p44-big-trash-restore.mjs` | Thùng rác lớn: sắp / "Hiện thêm" / tìm sau khôi phục | `p44-big-trash-restore.log` | K11 |
| `r3-p09-make-big.mjs` | Thùng rác lớn → `load-del1200.p2cbackup` | `r3-p09-make-big.log` | K11, 6.2 |
| `p32-trash-node-perf.mjs`, `r3-p10-purge-web-perf.mjs`, `p28-web-perf.mjs` | hiệu năng Node / web | `p32-trash-node-perf.log`, `r3-p10-purge-web-perf-{113,1313}.log`, `p28-web-perf.log` | 6.2 |
| `sep-scan.mjs`, `r37-guard-e.mjs`, `r2-exports.mjs`, `tsc-unused-app.log` | ký hiệu viết thẳng, bộ chặn, export, `tsc` unused | `sep-scan.log`, `r37-guard-e.log`, `exports.log` | DR6-37, DR6-152, 6.1 |

**Lần chạy hỏng của probe (lỗi probe, không phải sản phẩm; kết quả lần hỏng không dùng):** `p23r5` lần đầu tạo nhân sự vai trò IS kèm team (`TEAM_NOT_ALLOWED`, IS không có team): chạy lại với RE. `p41` lần đầu chọn dòng KH trong bảng Lịch hẹn bằng bộ lọc chữ (dòng nằm sau 100 dòng đầu, hết giờ) và tìm `th` của Báo cáo khi chưa mở bảng Theo RE ("no th"): chạy lại dùng khung chi tiết vừa mở sau khi tạo lịch và bấm "Theo RE"; số của lần đầu ở phần đã đo được trùng lần hai. `p41` / `p41b` tìm radio "Ngày" của kỳ theo tên nhóm `/Kỳ/` không có (bỏ qua, phần đo "kỳ Ngày" thực ra đo lại cùng màn). `p42` lần đầu đọc khối ngày tới chữ "Giờ" nên không thấy khối gợi ý nằm dưới ô Giờ: `p42b` đọc thẳng khối gợi ý.

### 9.2 Đột biến (29: 26 của `mut-list.mjs`, trong đó 5 chạy cả vitest lẫn e2e; 24 bị giết, 5 sống)

- **Vitest (8, `E\mutjs.log`, mỗi lượt `served 1`, cả 8 KILLED):** E150a, E332a, E337a, E151a, E151b, E151c, E350a, E350b.
- **E2e (21, `E\e2e-mut.log`):** **16 KILLED** — E150a, E150b, E150c, E150d, E332a (`appointment-outcome.spec.ts:159`); E332b (`dialog-keyboard.spec.ts:186`, `:225`); E332c (`:225`); E151a (`trash.spec.ts:637`); RB2e (`save-state.spec.ts:126`); T305b (`trash.spec.ts:197`); E154a (`dialog-keyboard.spec.ts:150`, `:186`, `trash.spec.ts:662`); E154b (`dialog-keyboard.spec.ts:150`); E154c (`trash.spec.ts:662`); E148c (`long-names.spec.ts:211`); E148d (`:231`); E331a (`:211`). **5 SURVIVED** — E151d (gần tương đương, mục 2.1), E154d, E350c, E350d, E148e (→ CLR5-E4).
- Đối chứng: e2e cả bộ 312 / 312 trên `dist-base`; vitest `routes/` 24 file 531 / 531.

### 9.3 Ranh giới đọc

- Chỉ mở theo tên đầy đủ: `common\{prompt-claude.md, known.md, fixes.md, baseline.md}`, `common\load\load-2026-10-12-seed6.p2cbackup`; báo cáo lượt 5 của Claude `claude\{A,B,C,D}.md` (bước 0 đọc dòng đầu; `D.md` đủ); probe lượt 5 của chính Claude gói D `claude\D\p21-overflow-culprits.mjs` (đọc để chép cách đổi tên RE, `Test-Path` theo tên); probe lượt 4 của chính Claude ở `deep-review-1-6-r4\claude\E\` (37 tên, `Test-Path` từng tên rồi chép). `plan.md` không mở (đủ chỉ dẫn ở `prompt-claude.md` và `known.md`).
- Không liệt kê, không tìm kiếm thư mục nào ở `C:\workspace\`, `deep-review-1-6*\`; không mở thư mục `codex\` / `deepseek\` / `muse\` nào; không đọc báo cáo lượt 5 của bên khác. Tìm kiếm chỉ trong repo (mã, `docs/`, gồm báo cáo gốc lượt 1–4 được phép đọc) và trong từng file được phép đọc.

### 9.4 Cuối phiên

- Repo: không ghi file nào của worktree (mọi đột biến qua hook `load` hoặc bản dựng ngoài repo; mọi probe, bản dựng, kết quả Playwright ghi dưới `claude\E\`). `git rev-parse HEAD` cuối phiên: `37a80b662861d308a110d1e2b0f65ad13b91fb51` (= SHA ghim). **`git status --short` cuối phiên: rỗng** (như đầu phiên).
- Đã dừng hai máy chủ `serve-dist` của phiên (4811, 4820; 4812–4819 do `e2e-mut.mjs` tự dừng; 4821 của bản đột biến E154d dừng ngay sau probe); kiểm lại: không cổng 4800–4830 nào nghe, 0 Edge headless còn chạy. Không chạy exe, không dùng cổng 4173, không `PW_REUSE`.
- Không gọi dịch vụ AI, không đọc key, không mở chatgpt.com: không probe nào của gói E chạm AI; mọi log trình duyệt 0 request ra ngoài localhost / 127.0.0.1.
- Giờ xong: 2026-11-05 01:17 (+07:00).
