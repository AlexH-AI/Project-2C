XONG — claude gói D lượt 3, 2026-10-20 22:08

# Deep review Phase 1–6, lượt 3 — Claude, gói D (Màn nhập liệu)

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên | claude (`<ID>` = `CL3`) |
| Gói | D — Màn nhập liệu: `packages/ui/**` (trừ `scripts/`), `apps/desktop/src/{shell,i18n}/**`, `routes/customers/**` (trừ file AI và Hợp đồng), `routes/team/**`, `routes/Screen.tsx`, `apps/desktop/src/*`, `apps/desktop/index.html` |
| SHA đầu phiên | `119e2e45cbce54d8a3943757bd826a7f1e9b694f` (`git rev-parse HEAD`) |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 2026-10-20 21:30 (Home PC `DESKTOP-KDURKJP`) |
| Công cụ | Claude Code, app desktop (tab Code), permission mode `auto` |
| Model | Claude Opus 5.5 (`claude-opus-5-5`) |
| Mức suy luận | `max` (đọc từ metadata phiên) |
| Ultracode | **tắt** (tin nhắn mở phiên không có `ultracode`) → không subagent / Workflow, mọi việc làm trong phiên chính |
| Bước 0 | `D.md` chưa có → làm mới; `A.md`, `B.md`, `C.md` có, dòng đầu `XONG …` (A 19:20, B 20:12, C 21:16) |

> Tiến độ (ghi dần): 21:30 bước 0 xong. Đã đọc `prompt-claude.md`, `plan.md` §L3 (+ §4, §L2.4, §L2.8), `known.md` (đủ), `fixes.md` (#654 / PR #669, #655 / PR #693, #656 / PR #674, #659 / PR #686, #662 / PR #707, #709, #710, #663 / PR #700), `baseline.md`, tổng hợp lượt 2 §6, báo cáo gốc Claude D lượt 2 (đủ), `claude\A.md` (mục 1–3, CL3-A3, A6, A7 chạm màn gói D), `claude\B.md` (mục 1–5: DR6-75 phần exe đã ĐÃ SỬA), `claude\C.md` (mục 1–4, CL3-C1 tràn panel AI). Danh sách gói D (`D\list.mjs`, `D\list.log`): 76 file, 7 329 SP / 2 165 test = plan §L3.3. Diff sửa (`D\fix-numstat.log`, `D\fix-diff.patch`): SP +291 / −158 ở 14 file, test +199 / −57 ở 5 file = plan §L3.3; 5 commit chạm gói (`d0a97ec` #667, `1f71029` #669, `c5a40e1` #674, `f9fb70f` #693, `6526793` #710).

> 21:36 dựng công cụ ở `D\` (không ghi vào repo): `build-dist.mjs` (Vite `build()` của worktree ghim, `--outDir` ngoài repo, đột biến phục vụ bằng `load` hook — khác lượt 2 / gói C là **không vá file repo**), `serve-dist.mjs`, `pw.config.mjs` (cổng 4461–4469, không 4173), `browser.mjs` / `hooks.mjs` (chép `claude\C\`), `mut-list.mjs` (34 đột biến), `mutant-config.mjs` (nhiều file), `mutjs.mjs` (vitest), `e2e-mut.mjs` (e2e). Đối chứng: bản dựng ghim `D\dist-base` (neo 15/09/2026) + 8 spec gói D **80 / 80 xanh** (`D\e2e-base.log`); lọc e2e của R83f / R72ui / R80h trên bản ghim 48 / 48 xanh (`D\e2e-mut.log`). 21:43 đột biến vitest: **13 / 13 KILLED** (`D\mutjs.log`). **Đang chờ** `e2e-mut.mjs` (21 đột biến TSX, chạy nền từ 21:44).

> 21:52 e2e đột biến xong (21 bản, `D\e2e-mut.log`); cả bộ e2e (`--full`) trên bản ghim và 5 đột biến sống (R82a, R82d, R82e, R82f, R72ui) chạy nền 21:52 → 22:02. 22:03 số đo hiệu năng (máy rảnh).

## 2. Bảng R (10 DR6 của gói D)

**Cách kiểm.** Đột biến "gỡ phần sửa" không ghi vào repo: vitest qua `D\mutant-config.mjs` (`load` hook phục vụ bản đột biến, `D\mutjs.mjs`, log `D\mutjs.log`); TSX qua bản dựng ngoài repo `D\build-dist.mjs` (Vite `build()` + `load` hook, repo không đổi byte nào, mỗi bản in `git status --short after: ""`) rồi chạy e2e của repo trên bản đó (`D\e2e-mut.mjs`, cổng 4462–4469, log `D\e2e-mut.log`). Đối chứng bản ghim: 8 spec gói D 80 / 80 (`D\e2e-base.log`), các lọc của R83f / R72ui / R80h 48 / 48 (`e2e-mut.log` dòng "BASE"). Tái hiện lượt 2: probe lượt 2 của chính Claude (`r2\claude\D\p04b-scroll`, `p10c-text-overflow`, `p11-headers`, `p02-kyc-view` A, `p01-team` B, `p06-forms`) chép sang `D\r0*.mjs` (đổi cổng), chạy trên bản web ghim `D\dist-base` (127.0.0.1:4461) hoặc qua lớp dữ liệu của app (`openAppData`).

| DR6 | Issue → PR | Kết luận | Bằng chứng (tái hiện lượt 2 nay ra gì; test nào đỏ khi gỡ phần sửa) | Biến thể / ghi chú |
|---|---|---|---|---|
| 72 (phần D: UI dùng chung `normalizeText`) | #659 → #686 | **ĐÃ SỬA** | Phần lệnh / domain: gói A (R72a–e KILLED, `claude\A.md` bảng R). Phần màn: 5a / 5c, 7a / 7b / 7c / 3f, 9c gọi `normalizeText` / `normalizeNote` của domain (`CustomerDialogs.tsx:225`, `KycDialogs.tsx:228`, `:252`, `:503`, `TeamDialogs.tsx:27`, `kyc-view.ts:129`) nên nhận luật mới không cần sửa (PR #686). Gỡ phần sửa dưới màn (R72ui: `text.ts` của `4217ed4` trong bản dựng): 4 spec gói D (38 ca có tên / KYC) **vẫn xanh** — không e2e nào của gói D dùng ký tự mới của K25; luật được giữ bằng test `domain` / `db` (gói A) | Hộp theo đúng luật mới: K7 (mục 4) — bản ghim chặn tên / giá trị chỉ gồm U+3164 U+2800 U+0085 U+FE0F và "Sao Mai" + U+3164, bản R72ui nhận cả ba. Biến thể còn hở ở màn đã báo: CL3-A6 (5a / 5c / 7a gửi chữ đã chuẩn hóa), CL3-A7 (ô tiền / ngày đọc chữ gốc) — không báo lại |
| 75 (phần D: trang lỗi khởi động) | #656 → #674 | **ĐÃ SỬA** | Phần exe (cửa sổ thật, khóa, mở lại): gói B ĐÃ SỬA (`claude\B.md`, M75a–c KILLED `startup-error.test.ts`). Phần màn (`p05-startup.mjs`, bản web + IPC giả mà `db_open` / `db_backup` ném đúng chuỗi lỗi của Rust; 1 100 × 700): 7 trang `ALREADY_OPEN`, `FILE_IN_USE`, `ACCESS_DENIED`, backup `DISK_FULL`, backup lỗi khác + đường dẫn 130 ký tự, file không phải SQLite, lỗi mở khác — đều `main role="alert"` + `h1`, câu có "đóng cửa sổ này" (ALREADY_OPEN thêm "đóng cả hai cửa sổ"), chi tiết kỹ thuật vừa trang (`pageSideways 0`), tương phản thấp nhất 7,26:1, không phần tử nào nhận Tab (đúng K24: không thêm nút) | `document.title` của trang lỗi vẫn "Project-2C" (không nêu lỗi): không yêu cầu nào đòi, không ghi |
| 80 | #654 → #669 (+ #710 câu Thùng rác) | **ĐÃ SỬA** | Tái hiện CL2-D2 trên dữ liệu tải (`p01-team-9b.mjs` A, qua `openAppData`): 7 / 7 người hỗ trợ phối hợp lịch Dời lịch (2–25 lịch mỗi người), nay câu của họ là `person.inUseCoordinatorHelp` "Người phối hợp của lịch Dời lịch / Dự kiến không đổi được — giữ lại thay vì xóa." (lượt 2: "Bỏ nhân sự này khỏi người phối hợp…", không làm được); 9b và lệnh khớp ở mọi nhân sự (`0` lệch, 51 người). Gỡ sửa (vitest): R80a (câu người hỗ trợ của `4217ed4`), R80b (người phối hợp nhận câu người đánh giá), R80c (RE vừa phối hợp nhận hai câu — ghi chú #636), R80d (bỏ câu Thùng rác), R80e (đảo câu Thùng rác RE / hỗ trợ), R80f (nêu 4 tên), R80g (`person.inUseTrash` bỏ vế "hoặc dọn sạch Thùng rác" của #710) → **KILLED** cả 7 (`team-view.test.ts`). TSX: R80h (9b chỉ khóa Xóa theo bản ghi của RE) → KILLED 3 ca `team.spec.ts` (`:369`, `:440`, `:458`); R80i (bỏ câu Thùng rác trên hộp) → KILLED `team.spec.ts:458` | Câu Thùng rác cho người hỗ trợ (`person.inUseSupportTrash`, "Khôi phục KH … thì mới sửa được các lịch đó") trái câu ngay trên nó khi lịch là Dời lịch / Dự kiến → **CL3-D1**. Câu Thùng rác cho RE: CL3-A3 (gói A, không báo lại) |
| 81 | #654 → #669 | **ĐÃ SỬA** | Tái hiện CL2-D3 (`r01-scroll.mjs` = p04b lượt 2): Bảng KH cuộn tới cuối (3 312 / 4 212) → hồ sơ `scrollY 0`, dòng đầu trong khung nhìn (lượt 2: 417 / 1 358, tên KH ngoài khung); hồ sơ cuộn → "← Khách hàng" 0; 6 lần đổi màn bằng sidebar từ màn đã cuộn (Lịch hẹn 4 563 / 5 463 → Khách hàng…) đều 0 (lượt 2: Tổng quan 134 → Lịch hẹn 105). Gỡ sửa: R81a (bỏ `window.scrollTo(0, 0)`) → **KILLED** `navigation.spec.ts:101` (DR6-81) | Về Khách hàng đúng thẻ vừa xem: e2e `:149-151` giữ (thẻ được focus, trong khung nhìn). Đổi mục trong Cài đặt cũng về đầu: KNOWN (ghi chú #669 "chỉ ghi lại") |
| 82 | #654 → #669 | **ĐÃ SỬA** | Tái hiện CL2-D7 (`r02-text-overflow.mjs` = p10c lượt 2, 1 440): link 108 ký tự trong ghi chú KYC **không còn** chạy qua cột (lượt 2: tràn 128 px sang KYC Intelligence); `p02-overflow.mjs` (link vừa ở ghi chú vừa ở giá trị dữ kiện, 1 440 và 1 100): thẻ Dữ kiện KYC và Dòng thời gian cách mép phải 114–117 / 18–23 px, không cuộn. Gỡ sửa: R82b (chữ ghi chú bỏ `wrap-anywhere`), R82c (dòng dữ kiện bỏ `min-w-0 wrap-anywhere`) → **KILLED** `customer-kyc.spec.ts:46` | Bốn phần khác của PR không test nào giữ: R82a (ba cột bỏ `min-w-0`), R82d (`CategoryRow` bỏ `min-w-0`), R82e (dòng cuộc gặp của Dòng thời gian bỏ `wrap-anywhere`), R82f (dòng đề xuất trích xuất) **sống** `customer-kyc.spec.ts:46` và cả bộ e2e (mục 2, cuối bảng). R82e **không tương đương**: link ở ghi chú / việc tiếp theo của cuộc gặp tràn 189 px ở 1 440, 163 px ở 1 100 (`p02-overflow-R82e.log`) → **CL3-D4**. R82a / R82d: không dựng được nội dung làm khác (bảng 755 px vẫn giữ cột 376 px, `p02-overflow-R82a.log`) — gần tương đương. Biến thể còn tràn ở bản ghim: thẻ Lịch hẹn của hồ sơ và hộp 7a / 7c / 7d → **CL3-D3** |
| 83 (phần D: `Dialog`, 7a "Bỏ", 7d) | #655 → #693 | **ĐÃ SỬA** | Gỡ sửa (vitest, `dialog-focus.test.ts`): R83a (không hỏi đích dự phòng) KILLED 2, R83b (focus nút mở đã rời trang) KILLED 2, R83c (focus nút mở có cuộn) KILLED 1. TSX: R83d (7a "Bỏ" không chuyển focus sang Trường) → KILLED `customer-kyc.spec.ts:201`; R83e (7d không có đích của thẻ KYC) → KILLED `customer-kyc.spec.ts:292`; R83f (`Dialog` không đưa đích cho `focusBack`) → KILLED 6 ca ở 5 spec (7d, 8a/8b/8d, 6c/6h/6g, 6f→6g, 6h ngoài góc nhìn, Thùng rác) | Màn Team & nhân sự không đặt đích: Xóa nhân sự (9b), đổi vai trò làm người rời bảng → focus về `BODY`; Xóa team → focus ở nút "Xóa team" nay của team khác (`p04-focus-team.log`) → **CL3-D2**. Phần màn Lịch hẹn / HĐ / Thùng rác: gói E |
| 90 | #654 → #669 | **ĐÃ SỬA** | Áp lại đột biến sống của lượt 2 (CL2-D5, CL2-D1): R33c (`TeamDialogs` `setFinal(true)`), R33d (`PersonDialogs`) → **KILLED** `team.spec.ts:511`; R33e (gõ ghi chú giữ khung lỗi lưu 7a), R33e2 (gõ ngày) → **KILLED** `customer-kyc.spec.ts:230`; nhánh lỗi `add()` xóa lỗi Ngày / Ghi chú (R90f) → **KILLED** `customer-kyc.spec.ts:168`; BR3 (checkbox thành ô chữ) và BR3b (`contenteditable="false"` thành ô chữ) → **KILLED** `block-reload.test.ts` (lượt 2: BR3 sống 7 / 7). Test nay chạy selector thật qua bộ so khớp nhỏ, selector lạ thì ném lỗi | — |
| 96 | #663 → #700 | **ĐÃ SỬA** (sửa bằng tài liệu) | `docs/testing/nghiem-thu-v1.md`: NT-EX-05 (`:333`, Alt+← / →, nút chuột 4 / 5, phím Back / Forward / Refresh, chuột phải), NT-KH-16 (`:167`, KH ngoài góc nhìn; câu = `customers.createdOutside` `vi.ts:586-587`), NT-TM-15 (`:263`, ba câu = `person.inUseReviewerHelp` / `inUseCoordinatorHelp` / `inUseSupportHelp` `vi.ts:1205-1210`), NT-TM-16 (`:264`, = `person.inUseTrash` / `inUseSupportTrash` `vi.ts:1213-1216`, đã có vế "hoặc dọn sạch Thùng rác" của #710), NT-TM-11 (= `error.PERSON_IN_USE`). So từng câu với `vi.ts`: khớp | NT-TM-16 ghi đúng cặp câu mâu thuẫn của CL3-D1 (lịch Dự kiến ngày mai, IS phối hợp) |
| 100 | #655 → #693 | **ĐÃ SỬA** | Tái hiện CL2-D8 (`r03-headers.mjs` = p11 lượt 2): cột nút của thẻ Lịch hẹn và bảng thành viên team nay có `columnheader` "Thao tác" (lượt 2: `""`). Gỡ sửa: R100a (bỏ `headerHidden`, tiêu đề hiện trên màn) → KILLED `customer-appointments.spec.ts:39`; R100b (bảng thành viên) → KILLED `team.spec.ts:28`; R100c (cột về `header: ''` như `4217ed4`) → KILLED `customer-appointments.spec.ts:39` | JSDoc `headerHidden` / cột vẫn sắp được: KNOWN (#630), không bằng chứng mới |
| 101 | #654 → #669 | **ĐÃ SỬA** | Tái hiện CL2-D4 (`r04-kyc-read.mjs`): `"6" + U+200B + "tỷ"` → "6.000.000.000 ₫ (6 tỷ)" (lượt 2: không dòng); 18 biến thể (BOM, U+2060, U+0085, U+3164, U+2800, U+FE0F, NBSP, U+2028, U+3000, NFD "tỷ", ZWSP giữa nhóm nghìn / "tr", dấu định hướng U+202A / U+202C, chữ số toàn khổ, chữ tự do): dòng đọc lại **trùng** cách đọc của chữ đã lưu ở cả 18 (0 lệch). Gỡ sửa: R101a (`parseVnd(text)`) → **KILLED** `kyc-view.test.ts` "reads the text as the command stores it…" | Ô FYP / case size / ngày vẫn đọc chữ gốc: CL3-A7 (gói A), không báo lại |

Kết luận bảng R: **10 / 10 ĐÃ SỬA**, 0 SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY. Đột biến của bảng R: 13 vitest (13 KILLED) + 21 TSX (16 KILLED bởi e2e nhắm). Năm bản sống e2e nhắm chạy **cả bộ e2e** (237 ca, `--full`): bản ghim 236 / 1, chỉ đỏ `theme.spec.ts:48` (bộ chạy dùng 127.0.0.1 nên ca "không request ra ngoài localhost" đỏ ở mọi bản, như lượt 2); R82a, R82d, R82f, R72ui 236 / 1 như bản ghim → **sống**; R82e 235 / 2 (thêm `appointment-outcome.spec.ts:280` hết giờ chờ nút "+ Khách hàng" lúc máy bận; chạy lại riêng trên chính bản R82e: 1 passed) → **sống**. R72ui được test `domain` / `db` giữ (gói A); R82e không tương đương → CL3-D4. Biến thể còn hở ghi thành phát hiện riêng: CL3-D1 (DR6-80), CL3-D2 (DR6-83), CL3-D3, CL3-D4 (DR6-82).

## 3. Phạm vi đã đọc

**Danh sách gói D** (`D\list.mjs` = `claude\C\list.mjs` với gói D, luật `classifyFile` của `tools/size-report-core.mjs`; log `D\list.log`): 76 file, **7 329 dòng SP / 2 165 dòng test** (= plan §L3.3).

**Diff sửa của gói D** (`git diff --numstat 4217ed4 119e2e4` trên 76 file, `D\fix-numstat.log`; bản đầy đủ `D\fix-diff.patch`, 1 318 dòng): SP **+291 / −158 ở 14 file**, test **+199 / −57 ở 5 file** (= plan §L3.3); 5 commit chạm gói: `d0a97ec` (#667: chữ `vi.ts` của 6f / Thùng rác), `1f71029` (#669: 9b, `wrap-anywhere` / `min-w-0`, cuộn về đầu, tiền KYC, 7a), `c5a40e1` (#674: câu trang lỗi khởi động), `f9fb70f` (#693: `DialogFocusFallback`, `dialog-focus.ts`, 7a "Bỏ", 7d, `headerHidden`), `6526793` (#710: câu 9b Thùng rác, 5f, khóa i18n của dọn sạch). Đọc từng hunk của: `vi.ts` (+82 / −19), `CustomerAppointments.tsx`, `CustomerDialogs.tsx`, `CustomerKyc.tsx`, `CustomerProfile.tsx`, `KycDialogs.tsx`, `kyc-view.ts` (+ test), `PersonDialogs.tsx`, `TeamScreen.tsx`, `team-view.ts` (+ test), `AppShell.tsx`, `block-reload.test.ts`, `startup-error.test.ts`, `Dialog.tsx`, `dialog-focus.ts` (+ test, mới), `packages/ui/src/index.ts`.

**Đọc hết ở `119e2e4`:** `shell/` — `AppShell.tsx` (95), `useRoute.ts`, `routes.ts`, `StartupError.tsx`, `startup-error.ts`, `ErrorBoundary.tsx`, `screen-error.ts`, `SaveWarning.tsx`, `CloseGuard.tsx`, `close-guard.ts`, `block-reload.ts`, `Sidebar.tsx`, `RePicker.tsx`, `ScopePicker.tsx`; `main.tsx`, `App.tsx`, `routes/Screen.tsx`, `index.html`, `index.css`; `i18n/index.ts` (132) và các khóa `vi.ts` của gói D (`customer*.*`, `customerDelete.*`, `kyc*.*`, `team.*`, `person.*`, `storage.*`, `error.PERSON_IN_USE`) — phần còn lại kiểm bằng script (`D\r1-keys.mjs`, `r1-slots.mjs`); `routes/customers/` — `CustomerProfile.tsx` (288), `CustomerDialogs.tsx` (517), `KycDialogs.tsx` (542), `CustomerKyc.tsx` (309), `CustomerAppointments.tsx` (153), `CustomersScreen.tsx` (307), `customers-view.ts` (180), `kyc-view.ts` (299); `routes/team/` — `TeamScreen.tsx` (311), `PersonDialogs.tsx` (218), `TeamDialogs.tsx` (101), `team-view.ts` (143); `packages/ui/src/` — `Dialog.tsx` (94), `dialog-focus.ts`, `DataTable.tsx` (230), `TextField.tsx`, `SelectField.tsx`, `Choices.tsx`, `Button.tsx`, `Segmented.tsx`, `StageBadge.tsx`, `PolicyBadge.tsx`, `show-more.ts`, `index.ts`, `theme.css`. Không đổi từ `4217ed4` và lượt 1–2 đã đọc hết, lượt này đọc lướt: `PeriodPicker.tsx`, `Chart.tsx`, `chart-theme.ts`, `NavIcon.tsx`, `compare-cells.ts`, `token-guard.ts`, `tokens.css`, `fonts.css`, `ScopeContext.tsx`, `scope.ts`.

**Chỗ gói khác nối vào (chỉ chỗ nối):** `packages/db/src/team.ts:60-115` (`PersonUsage`, `USAGE`, `IN_TRASH`, `personUsage`, `isPersonInUse`), `counts.ts:44-72` (`countCustomerRecords`), `trash.ts:25-104` (kiểu `TrashRow` / `TrashEffect`), `appointments.ts:69-101`, `:151-272` (lệnh 6c / 6f / Dời lịch / Xóa, `INVALID_STATUS`), `kyc.ts:555` (`summary`); `apps/desktop/src/data/tauri-storage.ts` (mã lỗi khởi động), `routes/customers/KycExtraction.tsx:40-190` (focus sau 3f, dòng đề xuất), `routes/SettingsTrash.tsx:195-330` (hộp dọn sạch, focus 11j), `routes/appointments/AppointmentDialog.tsx:205-253` (`CoordinatorsField`); e2e `customer-kyc.spec.ts`, `navigation.spec.ts:60-180`, `team.spec.ts:326-605`, `customer-appointments.spec.ts:39-60`.

**Tài liệu:** `CLAUDE.md` gốc, `apps/desktop/CLAUDE.md`, `packages/db/CLAUDE.md`, `.claude/rules/{i18n-ui,mockups,tests}.md`; mockup `trash.html` 11f, 11h (dòng 320–380); `docs/testing/nghiem-thu-v1.md` (NT-KH-16, NT-TM-10…16, NT-TR-21…23, NT-EX-05, NT-EX-06); `common\{prompt-claude.md, plan.md (§3, §4, §L2.4, §L2.8, §L3.1–§L3.11), known.md (đủ), fixes.md (#654 / #669, #655 / #693, #656 / #674, #659 / #686, #662 / #707, #709, #710, #663 / #700), baseline.md (đủ)}`; tổng hợp lượt 2 §6 (đủ); báo cáo gốc lượt 2 Claude D (đủ, gồm phụ lục probe); `claude\A.md` (mục 1–3, mục 4 tìm theo từ khóa gói D, CL3-A3 … A8), `claude\B.md` (mục 1–5), `claude\C.md` (mục 1–4, CL3-C1) để không báo trùng.

## 4. Kịch bản mới đã thử

Bản web dùng cho màn: `D\dist-base` (dựng ngoài repo từ worktree ghim bằng `D\build-dist.mjs`, `VITE_DEMO_ANCHOR = 15/09/2026` như e2e, ảnh chụp dữ liệu demo của ngày đó) phục vụ ở 127.0.0.1:4461; `D\dist-real` (không biến môi trường) cho dữ liệu tải. Mọi probe trình duyệt: Edge (Playwright), mạng ngoài 127.0.0.1 bị chặn từ lần chạy đầu (`--host-resolver-rules` + `route.abort`), `window.open` / clipboard thay bằng bản ghi (`D\browser.mjs`, chép `claude\C\`); mọi log ghi `requests blocked (not 127.0.0.1) []`. Probe Node đi qua lớp dữ liệu của app (`openAppData`, `app.run`, `app.purgeTrash`, `tables()`); SQL thô chỉ để đếm thống kê dữ liệu (`p01b`). Các kịch bản dưới không có trong báo cáo lượt 1, 2 (tìm theo từ khóa trong `docs/reviews/raw/*/*/D.md`) và trong `claude\A.md`–`C.md` lượt 3.

| # | Kịch bản (các bước, dữ liệu) | Kết quả | ID |
|---|---|---|---|
| K1 | 9b + Thùng rác + dọn sạch qua lớp dữ liệu (`p01-team-9b.mjs` B): RE + IS mới, KH có cuộc gặp Đã gặp do IS đánh giá và lịch Dự kiến IS phối hợp đã Dời lịch một lần → xóa KH (5f) → 9b RE / IS → làm theo câu: khôi phục KH, thử mọi lệnh màn có (6f cho Dời lịch / Dự kiến, 6c lịch ngày sau, Dời lịch lần nữa, 6f bỏ người đánh giá) → 9b → xóa KH lại, `app.purgeTrash()` → 9b, xóa | Sau mọi cách của màn, IS vẫn `coordinating 3`, `PERSON_IN_USE`; chỉ dọn sạch gỡ được (D4 đúng: sau dọn sạch xóa được cả RE lẫn IS) | CL3-D1 |
| K2 | Cùng chuỗi trên màn (`p07-9b-purge-ui.mjs`, đúng ca NT-TM-16): + Nhân sự RE / IS, + Khách hàng, Lịch hẹn → + Lịch hẹn ngày mai với người phối hợp IS → Sửa hồ sơ → Xóa KH… → 9b RE, 9b IS → Thùng rác: Khôi phục KH → 9b IS → xóa KH lại → Dọn sạch Thùng rác… (11i, gõ DỌN SẠCH) → 11j → 9b IS / RE → Xóa bằng phím | Chi tiết lịch Dự kiến chỉ có Ghi kết quả / Dời lịch / Xóa; 9b IS hiện hai câu trái nhau; khôi phục xong vẫn khóa Xóa; 11i "1 — kèm 1 lịch hẹn · 0 HĐ · 0 ghi chú KYC · 0 phân tích AI", 11j "Xóa hẳn 1 KH (kèm 1 lịch hẹn)."; sau dọn sạch 9b hai người mở Xóa (`person.deleteBody`); xóa xong focus `BODY` | CL3-D1, CL3-D2 |
| K3 | Focus sau mọi hộp của màn Team bằng bàn phím (`p04-focus-team.mjs`): 9b xóa IS (Người hỗ trợ), 9b xóa RE (bảng thành viên), 9c xóa team trống, 9a đổi RE → IS và IS → RE; đối chứng 5f | `BODY` ×4; 9c: focus trên "Xóa team" của team Bình Minh (cùng phần tử); 5f: `H1 Khách hàng` | CL3-D2 |
| K4 | Chuỗi liền dài (link 108 ký tự như e2e DR6-82) ở mọi chỗ của hồ sơ và hộp (`p02-overflow.mjs`): 7a danh sách đang soạn, 7c "Đang có", 7d lựa chọn, ghi chú + việc tiếp theo của cuộc gặp Đã gặp (6c qua Lịch hẹn), mô tả trigger của lịch Dự kiến, AI trích xuất (Mock) + 3f; đo ở 1 440 × 900 và 1 100 × 800; cùng probe trên bản đột biến R82e, R82a | Thẻ Dữ kiện KYC, Dòng thời gian, 3f: không tràn. Thẻ Lịch hẹn: bảng 755 px trong thẻ 376 / 402 px, tràn 342 / 316 px, trang cuộn ngang 346 px ở 1 100; 7a 161 px (hộp cuộn 259), 7c 48, 7d 151–154 (cuộn 166). R82e: Dòng thời gian tràn 189 / 163 px; R82a: như bản ghim | CL3-D3, CL3-D4 |
| K5 | Thẻ Lịch hẹn của hồ sơ trên seed, không thêm chữ (`p03-appt-table.mjs`): 120 KH đầu của Bảng (104 có lịch), mở từng hồ sơ ở 1 440 và 1 100, đo bảng so thẻ | 0 / 104 bảng rộng hơn thẻ, 0 trang cuộn ngang ở cả hai cỡ — chỉ chuỗi liền gây tràn (CL3-D3) | không thấy |
| K6 | Trang lỗi khởi động trên bản web với IPC giả (`p05-startup.mjs`, 1 100 × 700): `ALREADY_OPEN`, `FILE_IN_USE`, `ACCESS_DENIED`, backup `DISK_FULL`, backup lỗi khác kèm đường dẫn 130 ký tự, file không phải SQLite, lỗi mở khác kèm đường dẫn | 7 / 7 trang `main role="alert"` + `h1`, câu đúng `vi.ts:1020-1042` có "đóng cửa sổ này" (ALREADY_OPEN "đóng cả hai cửa sổ"), chi tiết vừa trang (`pageSideways 0`), tương phản ≥ 7,26:1, Tab không tới phần tử nào (K24: không nút), `document.title` "Project-2C" | không thấy |
| K7 | K25 trên hộp gói D (`p06-k25-ui.mjs`): 5a tên chỉ gồm U+3164 U+2800 U+0085 U+FE0F; 9c "Sao Mai" + U+3164; 7a giá trị U+2800 U+3164 — trên bản ghim và bản R72ui (`text.ts` của `4217ed4`) | Bản ghim: "Chưa nhập tên." (`aria-invalid`), "Đã có team "Sao Mai".", "Nhập giá trị." (0 dữ kiện thêm). R72ui: cả ba lưu được, có hai team "Sao Mai" — hộp theo đúng luật domain | không thấy |
| K8 | 5f ↔ Thùng rác 11b ↔ hộp dọn sạch 11i cho cùng KH (`p09-counts.mjs`, dữ liệu tải): 76 KH xóa lần lượt (mỗi KH thứ 30, KH có HĐ, KH có phân tích AI, một KH có lịch đã xóa riêng trước), so `countCustomerRecords` trước khi xóa, `effect` của dòng 11b, phần KH đó thêm vào `previewPurge` | 0 / 76 lệch; KH có lịch xóa riêng: 11b `appointmentsInTrash 1`, 11i đếm lịch đó ở loại Lịch hẹn | không thấy |
| K9 | 9b ↔ lệnh trên dữ liệu tải (`p01-team-9b.mjs` A): mọi nhân sự (51), `isPersonInUse(personUsage)` so lệnh xóa (rollback); câu 9b của 7 người hỗ trợ; trạng thái các lịch của KH đã xóa giữ họ (`p01b-trash-holds.mjs`) | 0 / 51 lệch; 6 người hỗ trợ có câu Thùng rác, lịch giữ họ đều MET / NO_SHOW (câu đúng với dữ liệu tải) | không thấy (ca sai: CL3-D1) |
| K10 | Đọc lại tiền KYC (7b / 7c / 3f) với 18 chuỗi dán (`r04-kyc-read.mjs`): BOM, U+2060, U+0085, U+3164, U+2800, U+FE0F, NBSP, U+2028, U+3000, NFD "tỷ", ZWSP giữa nhóm nghìn / trong "tr", U+202A / U+202C, chữ số toàn khổ, chữ tự do | Dòng đọc lại = cách đọc chữ đã lưu ở 18 / 18 | không thấy |
| K11 | Đổi màn ngoài các đường DR6-81 đã kiểm (`p11-more.mjs`, 1 440 × 600): KH không có trên Kanban (thứ 7 của cột) → hồ sơ cuộn → "← Khách hàng"; Thùng rác → Khôi phục KH → "Mở hồ sơ"; 5c gõ tên → "Xóa KH…" (5f) → Hủy → 5c → Hủy; hồ sơ ở 1 100 và 900 px | Về Khách hàng: `scrollY 0`, focus `H1`; sau Khôi phục: focus dòng 11e; "Mở hồ sơ": 0, `H1`; 5c giữ chữ đã gõ, focus ô Họ tên, Hủy → "Sửa hồ sơ"; 1 100 / 900: không cuộn ngang (dữ liệu seed) | không thấy |
| K12 | Đột biến không có trong PR của phần sửa gói D (mục 2): R80c, R80e, R80f, R80g, R83c, R90-BR3b, R100c, R82a/d/e/f, R72ui; cả bộ e2e cho các đột biến sống | Mọi đột biến hành vi bị giết trừ R82e (không tương đương, CL3-D4) và R72ui (luật giữ ở test `domain` / `db`) | CL3-D4 |

## 5. Phát hiện mới

### CL3-D1 — Hộp 9b của người hỗ trợ hứa "Khôi phục KH … thì mới sửa được các lịch đó" ngay dưới câu "Người phối hợp của lịch Dời lịch / Dự kiến không đổi được": với lịch Dự kiến / Dời lịch của KH đã xóa, khôi phục không gỡ được người phối hợp, chỉ dọn sạch Thùng rác gỡ được

```
ID: CL3-D1
Mức: Low
Trục: C
Vị trí: apps/desktop/src/i18n/vi.ts:1215-1216 (person.inUseSupportTrash), :1207-1210 (inUseCoordinatorHelp, inUseSupportHelp); apps/desktop/src/routes/team/team-view.ts:113-135 (inUseHelp: câu Thùng rác cho mọi người không sở hữu bản ghi, không xét lịch nào giữ họ); packages/db/src/team.ts:86-91 (IN_TRASH: lịch phối hợp / đánh giá của KH đã xóa, mọi trạng thái); tài liệu theo cùng câu: docs/testing/nghiem-thu-v1.md:264 (NT-TM-16) (119e2e4)
Tình trạng: CONFIRMED
Liên quan: DR6-80 (câu cho người hỗ trợ không làm được), CL3-A3 (cùng loại, câu của RE — gói A), K26 · mới do đợt sửa lượt 2 (PR #669 thêm câu, PR #710 nối "hoặc dọn sạch Thùng rác")
Kịch bản: K1, K2
```

- **Mô tả:** 9b ghép câu theo vai (`inUseCoordinatorHelp` / `inUseSupportHelp`: người phối hợp của lịch Dời lịch / Dự kiến không đổi được) với câu Thùng rác (`inUseSupportTrash`: khôi phục KH thì mới sửa được các lịch đó). Khi người hỗ trợ là người phối hợp của một lịch Dự kiến hay Dời lịch thuộc KH trong Thùng rác (đúng ca NT-TM-16: lịch ngày mai, IS phối hợp), hai câu trái nhau: khôi phục KH xong, lịch Dự kiến chỉ có "Ghi kết quả" (lệnh từ chối cho ngày sau hôm nay), "Dời lịch" (lịch mới giữ người phối hợp), "Xóa" (xóa cả lịch); lịch Dời lịch không có nút nào (K6). Lệnh cũng không có đường nào: `editMeetingOutcome` → `INVALID_STATUS` cho cả hai trạng thái. Chỉ dọn sạch Thùng rác (vế sau) gỡ được.
- **Tái hiện / bằng chứng:**
  - Qua lớp dữ liệu của app (`node --import ./hooks.mjs p01-team-9b.mjs`, phần B, log `D\p01-team-9b.log`): KH có cuộc gặp Đã gặp do IS đánh giá, một lịch Dự kiến IS phối hợp đã Dời lịch một lần. Xóa KH → 9b của IS: `"help":["Bỏ nhân sự này khỏi người đánh giá kết quả … ; người phối hợp của lịch Dời lịch / Dự kiến không đổi được — giữ lại thay vì xóa.","Có cả lịch hẹn của KH đã xóa: KH Thùng Rác. Khôi phục KH … thì mới sửa được các lịch đó, hoặc dọn sạch Thùng rác."]`. Làm theo: khôi phục KH `OK`; `editMeetingOutcome` Dời lịch / Dự kiến → `INVALID_STATUS` / `INVALID_STATUS`; `recordMeetingOutcome` Dự kiến → `OUTCOME_IN_FUTURE`; Dời lịch lần nữa → lịch mới `coord=1`; 6f bỏ người đánh giá của cuộc gặp → `OK`; sau mọi cách đó 9b của IS `coordinating 3`, `xoaOff true`, lệnh `PERSON_IN_USE`. Xóa KH lại + `app.purgeTrash()` → 9b `xoaOff false`, xóa `OK`.
  - Trên màn (`node p07-9b-purge-ui.mjs 4461 base`, bản web ghim, log `D\p07-9b-purge-ui.log`): chi tiết lịch Dự kiến `["Ghi kết quả","Dời lịch","Xóa"]`; KH trong Thùng rác → 9b của IS hiện đúng hai câu trên, Xóa tắt; khôi phục KH ở Thùng rác → 9b của IS vẫn "1 lịch hẹn là người phối hợp", Xóa tắt (câu Thùng rác biến mất, chỉ còn "giữ lại thay vì xóa"); xóa KH lại, dọn sạch → Xóa bật.
  - Trên dữ liệu tải (`p01b-trash-holds.mjs`): 6 / 7 người hỗ trợ thấy câu Thùng rác; lịch của KH đã xóa giữ họ đều là MET / NO_SHOW (6f sửa được), nên câu đúng với dữ liệu tải — ca sai cần lịch Dự kiến / Dời lịch của KH bị xóa (thao tác thường: xóa KH còn lịch sắp tới có người phối hợp).
- **Ảnh hưởng:** người quản lý làm theo vế đầu: khôi phục KH (KH quay lại danh sách và chỉ số), người hỗ trợ vẫn không xóa được, hộp không còn nói tới dọn sạch; phải xóa KH lần nữa rồi dọn sạch. Đảo ngược được, không sai dữ liệu → Low.
- **Đề xuất:** chọn câu Thùng rác theo bản ghi giữ người đó: chỉ nêu "khôi phục … thì mới sửa được" khi lịch của KH đã xóa là lịch 6f sửa được (Đã gặp / Hủy / Không đến) hoặc có vai người đánh giá; còn lại chỉ "dọn sạch Thùng rác". Cần `personUsage` (gói A) trả thêm số lịch Dự kiến / Dời lịch của KH đã xóa mà người đó phối hợp. Gộp với CL3-A3 (câu của RE). Sửa câu mong đợi `team-view.test.ts:148-157`, `e2e/team.spec.ts:497-499`, NT-TM-16. ≈ 10–30 dòng SP + test. Chữ 9b thuộc K26 → Owner xem câu mới.

### CL3-D2 — Màn Team & nhân sự không có đích focus dự phòng: Xóa nhân sự / đổi vai trò làm người đó rời bảng → focus về `body`; Xóa team → focus nằm trên nút "Xóa team" nay của team khác

```
ID: CL3-D2
Mức: Low
Trục: A
Vị trí: apps/desktop/src/routes/team/TeamScreen.tsx:175-214 (các hộp của màn, không DialogFocusFallback), :163-173 + :249-293 (Members không khóa theo team: nút "Xóa team" :292 được dùng lại cho team kế tiếp); packages/ui/src/components/Dialog.tsx:54, dialog-focus.ts:22-23 (nút mở đã rời trang, không có đích → không làm gì) (119e2e4)
Tình trạng: CONFIRMED
Liên quan: DR6-83 (biến thể gần: màn Issue #655 không liệt kê) · có từ trước (Dialog trước #693 cũng chỉ trả focus khi nút mở còn trong trang), lượt 1–2 bỏ sót; cùng loại ghi chú KNOWN #693 "nút mở được tái dùng" nhưng ở màn khác (KNOWN đó chỉ màn Lịch hẹn)
Kịch bản: K3
```

- **Mô tả:** bằng bàn phím, sau khi Xóa nhân sự (9b) thành công, hay Lưu đổi vai trò (9a) làm người đó rời bảng thành viên / danh sách Người hỗ trợ, nút "Sửa" đã mở hộp mất cùng dòng; màn không đặt `DialogFocusFallback` nên focus về `body`. Xóa team: thẻ thành viên chuyển sang team đầu danh sách, React giữ nguyên phần tử nút, nên focus về đúng nút "Xóa team" nay thuộc team khác (Enter lần nữa mở "Xóa team <team khác>?").
- **Tái hiện / bằng chứng:** `node p04-focus-team.mjs 4461 base` (bản web ghim, mở hộp bằng Enter trên nút, Enter trên nút lưu; log `D\p04-focus-team.log`):
  ```
  9b person deleted: focus                     "BODY"
  9b RE of the table deleted: focus            "BODY"
  9c team deleted: focus                       "BUTTON \"Xóa team\" in Thành viên team Bình Minh"
  9c same element as the deleted team's "Xóa team"   true
  9a RE made IS (row left the table): focus    "BODY"
  9a IS made RE (left Người hỗ trợ): focus     "BODY"
  5f customer deleted: focus                   "H1 \"Khách hàng\""   (đối chứng: đổi màn, DR6-35)
  ```
  `p04b-team-enter.mjs` (Xóa team trống bằng phím rồi Enter thêm một lần): `dialog after one more Enter: ["Xóa team Bình Minh?"]`. `p07-9b-purge-ui.log`: xóa IS / RE sau khi dọn sạch → `BODY`. Không e2e nào của `team.spec.ts` kiểm focus sau các hộp này.
- **Ảnh hưởng:** người dùng bàn phím / trình đọc màn hình mất chỗ sau thao tác thường của màn Team (Tab bắt đầu lại từ đầu trang, không gì được đọc); sau Xóa team, nút dưới focus là của team khác (team còn người thì lệnh từ chối; team trống khác thì xóa được nếu Enter thêm hai lần). Không sai dữ liệu → Low.
- **Đề xuất:** đặt `DialogFocusFallback` quanh các hộp của `TeamScreen` (đích: tiêu đề thẻ thành viên / "Người hỗ trợ" / "Danh sách team", `tabIndex={-1}` như mẫu `CustomerKyc.tsx:138`); khóa `Members` theo team (`key={selected.team.id}`) để nút không bị dùng lại. ≈ 10–15 dòng SP + 1 ca e2e bàn phím như các ca DR6-83.

### CL3-D3 — Chuỗi liền dài còn tràn ở thẻ "Lịch hẹn" của hồ sơ (link trong ghi chú cuộc gặp: đè sang cột KYC Intelligence ở 1 440, cả trang cuộn ngang 346 px ở 1 100) và ở hộp 7a / 7c / 7d

```
ID: CL3-D3
Mức: Low
Trục: E (C)
Vị trí: apps/desktop/src/routes/customers/CustomerAppointments.tsx:100-106 (cột Ghi chú `line-clamp-1`, bảng không giới hạn bề rộng ô); packages/ui/src/components/DataTable.tsx:146-151 (`w-full border-collapse`, bố cục tự động); apps/desktop/src/routes/customers/KycDialogs.tsx:326-327 (7a, giá trị dữ kiện đang soạn `<span className="flex-1">`), :119-131 (7c "Đang có"), :437-447 (7d lựa chọn); packages/ui/src/components/Dialog.tsx:61 (`max-w-md`) (119e2e4)
Tình trạng: CONFIRMED
Liên quan: DR6-82 (biến thể gần: #669 chỉ ngắt chữ ghi chú KYC, dòng dữ kiện, dòng cuộc gặp của Dòng thời gian, dòng đề xuất) · có từ trước, lượt 1–2 bỏ sót; khác CL3-C1 (panel KYC Intelligence / khối AI, gói C)
Kịch bản: K4
```

- **Mô tả:** (a) Ghi chú cuộc gặp (6c "Ghi chú cuộc gặp") là một link 108 ký tự (như ca e2e DR6-82): bảng của thẻ "Lịch hẹn" trong hồ sơ rộng 755 px trong thẻ 376 px (1 440) / 402 px (1 100); `line-clamp-1` chỉ giới hạn số dòng, không làm bề rộng tối thiểu của ô nhỏ lại. Ở 1 440 chữ chạy quá mép thẻ 342 px, đè lên cột KYC Intelligence (cột có `min-w-0` nên không nở); ở 1 100 cả trang cuộn ngang 346 px — đúng triệu chứng DR6-82, PR #669 ghi "Ở 1 100 px trang hết cuộn ngang". (b) Cùng link làm giá trị dữ kiện: hộp 7a (dòng dữ kiện đang soạn) chạy quá mép 161 px, hộp cuộn ngang 259 px; 7c dòng "Đang có" 48 px; 7d lựa chọn 151–154 px, hộp cuộn ngang 166 px.
- **Tái hiện / bằng chứng:** `node p02-overflow.mjs 4461 base` (bản web ghim, mọi bước qua màn: tạo KH, 7a link + dữ kiện, 7a lần hai mâu thuẫn, 7d, Lịch hẹn → 6a hôm nay → 6c ghi chú + việc tiếp theo = link, 6a ngày mai với mô tả trigger = link; log `D\p02-overflow-base.log`):
  ```
  7a pending fact (dialog)              {"past":[null,161],"boxScroll":259,"pageSideways":0}
  7c "Đang có" (dialog)                 {"past":[48],"boxScroll":49,"pageSideways":0}
  7d options (dialog)                   {"past":[151,154],"boxScroll":166,"pageSideways":0}
  1440: grid columns                    "376px 376px 376px"
  1440: Dữ kiện KYC · link 1            {"past":[-117,-114],"boxScroll":0,"pageSideways":0}
  1440: Dòng thời gian · link 1         {"past":[-23,-19,-19],"boxScroll":0,"pageSideways":0}
  1440: Lịch hẹn · link 1               {"past":[342],"boxScroll":397,"pageSideways":0}
  1440: Lịch hẹn table width / its card [755,376]
  1100: Lịch hẹn · link 1               {"past":[316],"boxScroll":371,"pageSideways":346}
  ```
  Đối chứng không có link (`p03-appt-table.mjs 4461 base 120`): 104 hồ sơ của seed có bảng lịch hẹn, không bảng nào rộng hơn thẻ ở cả 1 440 và 1 100 — chỉ chuỗi liền dài gây tràn.
- **Ảnh hưởng:** RE dán link (Zalo / Facebook / tài liệu) vào ghi chú cuộc gặp — thao tác cùng loại DR6-82 — thì ở cửa sổ mặc định, chữ của thẻ Lịch hẹn đè sang panel AI; ở 1 100 trang cuộn ngang. Hộp 7a / 7c / 7d có thanh cuộn ngang, giá trị bị cắt. Chỉ hiển thị → Low.
- **Đề xuất:** ô Ghi chú của bảng: `max-w-0 w-full truncate` (hoặc bảng của thẻ `table-fixed`); giá trị ở 7a / 7c / 7d: `min-w-0 wrap-anywhere` như `CustomerKyc.tsx:90`. Thêm vào ca e2e DR6-82 (`customer-kyc.spec.ts:46`) một cuộc gặp có link ở ghi chú (đo thẻ Lịch hẹn và Dòng thời gian — cũng giữ luôn phần của CL3-D4) và đo hộp 7a / 7d. ≈ 5–8 dòng SP + ≈ 20 dòng e2e.

### CL3-D4 — Test hở (DR6-82): dòng cuộc gặp của Dòng thời gian (`wrap-anywhere` của #669) không test nào giữ — gỡ đi thì link trong ghi chú cuộc gặp tràn 189 px mà e2e vẫn xanh

```
ID: CL3-D4
Mức: Low
Trục: T
Vị trí: apps/desktop/src/routes/customers/CustomerKyc.tsx:274 (dòng cuộc gặp `wrap-anywhere`); e2e/customer-kyc.spec.ts:46-89 (chỉ đo chữ ghi chú KYC và dòng dữ kiện) (119e2e4)
Tình trạng: CONFIRMED
Liên quan: DR6-82 · mới do đợt sửa lượt 2 (PR #669: "Ngắt dòng làm thêm ở dòng chữ cuộc gặp trong Dòng thời gian")
Kịch bản: K4
```

- **Mô tả:** PR #669 nêu hai đột biến e2e giết (chữ ghi chú, dòng dữ kiện). Bốn phần còn lại không test nào giữ: R82e (dòng cuộc gặp bỏ `wrap-anywhere`) **không tương đương**; R82a (ba cột bỏ `min-w-0`) và R82d (`CategoryRow` bỏ `min-w-0`) không dựng được nội dung làm khác (gần tương đương); R82f (dòng đề xuất trích xuất, file gói C) không dựng được bằng Mock (trích dẫn của Mock ngắn).
- **Tái hiện / bằng chứng:** `D\e2e-mut.log`: `R82e | … | SURVIVED — 1 passed, 0 failed — customer-kyc.spec.ts -g "108 characters": 1/0`; cả bộ e2e 235 / 2 (`theme.spec.ts:48` đỏ ở mọi bản; `appointment-outcome.spec.ts:280` hết giờ lúc máy bận, chạy lại riêng: passed). Cùng bản đột biến, `node p02-overflow.mjs 4475 R82e` (log `D\p02-overflow-R82e.log`): `1440: Dòng thời gian · link 1 {"past":[189,-19,185],"boxScroll":190}`, `1100: … {"past":[163,-22,159],"boxScroll":164}` — bản ghim `[-23,-19,-19]` / `[-18,-22,-22]`.
- **Ảnh hưởng:** lần sửa sau bỏ / đổi lớp ở dòng cuộc gặp làm link trong ghi chú cuộc gặp tràn sang cột KYC Intelligence lại mà CI xanh. Hành vi hiện tại đúng.
- **Đề xuất:** cùng ca e2e đề xuất ở CL3-D3: ghi kết quả một cuộc gặp có link ở ghi chú và việc tiếp theo, đo vùng "Dòng thời gian" như `past()` của `customer-kyc.spec.ts:64-76`. ≈ 15 dòng e2e, 0 dòng SP.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc | Trên | Kết quả | ID |
|---|---|---|---|
| `pnpm exec tsc -p packages/ui/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters`, cùng lệnh cho `apps/desktop/tsconfig.json` (log `D\tsc-unused-ui.log`, `tsc-unused-app.log`) | `packages/ui`, app (shell, i18n, customers, team) | exit 0 / exit 0, 0 dòng (7 s); `git status --short` sau đó rỗng | — |
| `node D\r1-exports.mjs` (scanner lượt 1–2, `git show HEAD:` từng file; log `D\exports.log`) | 52 file SP `.ts/.tsx` của gói D | Không export chạy thật nào chết. Export mới của đợt sửa đều có nơi dùng: `DialogFocusFallback` (hồ sơ KH, Lịch hẹn, Thùng rác), `inUseHelp` (9b), `focusBack` (chỉ `Dialog.tsx`, không re-export). Chỉ test dùng (có từ trước, như lượt 2): `PLAIN_SLOTS` (KNOWN DR6-66), `COUNT_SLOTS` / `fillSlots` (cũng dùng trong file), `StageHead`, `SaveFailed`, `compareCells`; 15 kiểu chỉ dùng trong file (không tốn gì lúc chạy). `personUsage` / `PersonUsage` của `team-view.ts` đã bỏ (chuyển sang `@p2c/db`) | — |
| Khóa i18n: `node D\r1-keys.mjs` (log `D\keys.log`) | `vi.ts` ↔ `apps/desktop/src` | **1 154 khóa** (lượt 2: 1 113; +41, phần gói D: `customer.colActions`, `team.colActions`, `kycResolve.value`, `person.inUseReviewerHelp` / `inUseCoordinatorHelp` / `inUseTrash` / `inUseSupportTrash` / `inUseTrashMore`, `appointments.none`, `trash.owner.none`; bỏ `customerDelete.kycKept`, `trash.restore.policies` / `kyc` / `ai` / `leftAppointments`): 938 viết thẳng + 216 dựng động, **0 khóa không dùng, 0 khóa chỉ test dùng**. Chữ trùng ≥ 2 khóa: 63 cặp (lượt 2: 58–60), gồm "Thao tác" ×3 (`trash.col.actions`, `customer.colActions`, `team.colActions`) — mỗi màn một khóa như mẫu đã chấp nhận, không ghi | — |
| Slot i18n: `node D\r1-slots.mjs` (log `D\slots.log`) | 954 lời gọi `t()` tĩnh | 0 thiếu slot ngoài 4 khuôn cố ý như lượt 1–2 (`aiPanel.evidence`, `copyFixHelp`, `period.monthLabel` / `yearLabel`) | — |
| Code lặp của đợt sửa (đọc diff) | gói D | `DialogFocusFallback` đặt hai lần trong `CustomerProfile.tsx` (đích khác nhau) — không lặp logic. `inUseHelp` gom 2 câu cũ của `PersonDialogs.tsx` vào một hàm có test (bớt lặp). Hằng `ALERT` khai riêng ở `PersonDialogs.tsx:17` và `CustomerDialogs.tsx:49` (khác lớp): KNOWN DR6-67. `CustomerAppointments.tsx` bỏ `useMemo` cột (DR6-66): `DataTable` dựng lại `columnDefs` mỗi lần hồ sơ render — trước đó cũng vậy vì `onNext` mới mỗi lần (PR nêu), không đổi chi phí | — |
| Bundle (`common\baseline.md`, bản dựng ở `Project-2C-review`) | toàn app | `index.js` 927 932 B (+18 263 so lượt 2, gồm mọi PR sửa), `index.css` 28 484 B (+94: `wrap-anywhere`, `min-w-0`, `sr-only`… của gói D và gói khác). Không tách được phần gói D theo module khi chưa có visualizer (G4) | — |
| `pnpm lint:deps`, `pnpm codemap` | `common\baseline.md` (`pnpm verify` xanh ở SHA ghim: `lint:deps` 0 vi phạm, 320 module; codemap khớp) | Không chạy lại | — |
| Đề xuất refactor | — | Không có đề xuất mới ngoài DR6-66 / 67 (KNOWN, hoãn) | — |

### 6.2 Hiệu năng

Máy: Home PC `DESKTOP-KDURKJP`, Node v24.20.0, Edge (Playwright) headless. Lúc đo (22:03): CPU 0 %, song song chỉ app Codex (2 tiến trình `codex`, rảnh); không chạy exe, không chạy `pnpm e2e` cổng 4173. Dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (hash §L3.6). Luật nhiễu: xấu hơn khi > 20 % **và** > 10 ms. Cột lượt 2: `docs/reviews/raw/2026-10-17/claude/D.md` §6.2 (cùng máy, cùng cách đo).

**Hàm thuần + lệnh đọc mà màn gói D gọi** (`node --import ./hooks.mjs p10-perf.mjs`, log `D\p10-perf.log`; `importBackup` 848 ms; 1 481 KH sống, 10 255 lịch, 51 nhân sự, 113 dòng Thùng rác). Trung vị (min–max), n.

| Thao tác (màn gói D) | Lượt 3 | Lượt 2 | Δ | Ngưỡng | ID |
|---|---:|---:|---|---|---|
| 9b `personUsage` một người, lần lượt mọi người (nay SQL `USAGE` + `IN_TRASH`; lượt 2 đếm trên bảng của màn) | 1,56 ms (1,48–3,56, n=153) | 0,23 ms | +1,33 ms (dưới 10 ms) | < 200 | — |
| 9b người bận nhất (BD, 385 lịch phối hợp, 3 KH trong Thùng rác) | 1,77 ms | — | — | < 200 | — |
| 9b, Thùng rác lớn (+1 200 KH xóa, 1 313 dòng): một người / người bận nhất (277 KH trong Thùng rác) | 8,63 / 8,19 ms | — | — | < 200 | — |
| (tổng, không màn nào làm) 51 × `personUsage` + `isPersonInUse` + `inUseHelp`: dữ liệu tải / Thùng rác lớn | 78,6 / 442 ms | — | — | — | — |
| `readProfile` (useQuery hồ sơ) KH thường / KH nhiều lịch nhất (37) | 6,92 / 6,48 ms | 6,95 / 6,89 ms | ≈ 0 | < 200 | — |
| `countCustomerRecords` (hộp 5f) KH thường / KH nhiều lịch nhất | 0,08 / 0,10 ms | 0,11 ms | ≈ 0 | < 200 | — |
| `customerBoard` Toàn bộ | 1,31 ms | 1,37 ms | ≈ 0 | < 200 | — |
| `previewHandover` mỗi render 5c | 0,06 ms | 0,06 ms | 0 | < 200 | — |
| `kycAmountRead` mỗi phím 7b (nay `normalizeText` + `parseVnd`) | 0,00 ms (max 0,42, n=200) | 0,00 ms | 0 | < 200 | — |

**Trên màn** (bản web `D\dist-real`, không neo ngày, sau Cài đặt → Dữ liệu → Nhập backup dữ liệu tải; đo từ thao tác tới khi DOM có kết quả, dò bằng `MessageChannel`, không gồm vẽ — probe lượt 2 `p08-web-perf.mjs` thêm một dòng 9b; `node p08-web-perf.mjs 4479`, log `D\p08-web-perf.log`). Đọc file → hộp 10c 868 ms, Thay dữ liệu 90 ms (lượt 2: 893 / 49 ms).

| Thao tác (bản web, dữ liệu tải) | n | Lượt 3 trung vị (min–max) | Lượt 2 | Ngưỡng | ID |
|---|---:|---|---|---|---|
| Thẻ kanban → hồ sơ | 6 | 17,6 ms (16,0–34,8) | 17,6 ms | < 200 ✅ | — |
| 5c mở hộp / một phím Họ tên / chọn RE khác / Hủy | 6 | 6,2 / 0,9 / 1,2 / 2,0 ms | 5,5 / 0,9 / 1,2 / 2,0 ms | < 200 ✅ | — |
| 7a mở hộp / chọn Trường / một phím Giá trị (đọc lại tiền) / Lưu ghi chú | 6 | 2,9 / 0,5 / 0,2 / 13,7 ms | 2,7 / 0,6 / 0,3 / 14,1 ms | < 200 ✅ | — |
| Hồ sơ → "← Khách hàng" sau một lần ghi (focus thẻ vừa xem) | 6 | 32,2 ms (31,1–40,6) | 32,7 ms | < 200 ✅ | — |
| "+ n KH · xem dạng bảng" → bảng có focus / Bảng → Kanban | 6 | 12,7 / 3,0 ms | 13,2 / 2,8 ms | < 200 ✅ | — |
| → Team & nhân sự / **Sửa → Xóa nhân sự (9b, `personUsage` SQL)** / → Khách hàng | 6 | 8,5 (8,0–65,0) / **6,0** (5,1–6,5) / 5,6 ms | 8,6 / 3,5 / 5,8 ms | < 200 ✅ | — |
| **mới:** Sửa IS Võ Văn Quang → 9b (376 lịch phối hợp, câu Thùng rác nêu 3 tên + "2 KH khác") | 6 | 5,4 ms (4,8–5,8) | — | < 200 ✅ | — |

**Trên exe** (probe `e2e/perf` của bước chuẩn bị, `common\baseline.md`; không đo lại): thao tác của màn gói D — `customers.view-table` 19 ms (nền sau #656: 20), `customers.sort-name` 22 (23), `customer.open-ai` 19 (19), `reload.customers` 307 (336), `reload.team` 348 (355): không dòng nào ⚠️, mọi dòng trong ngưỡng.

Không có phát hiện P ở gói D: mọi thao tác màn của gói D trên dữ liệu tải ≤ 33 ms trung vị (max 65 ms một lần). Phần đợt sửa thêm vào: 9b đọc `personUsage` bằng SQL, +2,5 ms trên màn (6,0 so 3,5 ms; trong luật nhiễu vì < 10 ms), ≤ 8,6 ms với Thùng rác 1 313 dòng; `kycAmountRead`, `focusBack`, `scrollTo` không đo được (< 0,01 ms).

## 7. Bảng đếm mức × trục

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | | 0 |
| Low | | CL3-D3* | CL3-D1 | | | | | | CL3-D4 | CL3-D2 | 4 |
| Nit | | | | | | | | | | | 0 |

\* CL3-D3 gắn hai trục (E, C), đếm một lần ở trục chính E. **4 phát hiện mới, 4 / 4 CONFIRMED** (probe / đột biến / e2e thật, lệnh và trích kết quả ở từng mục), 0 PLAUSIBLE, 0 KNOWN có bằng chứng mới. Trục R (bảng R): **10 ĐÃ SỬA** · 0 SỬA MỘT PHẦN · 0 CHƯA SỬA · 0 HỒI QUY. "Mới do đợt sửa lượt 2": CL3-D1 (#669, #710), CL3-D4 (#669); có từ trước, lượt 1–2 bỏ sót: CL3-D2, CL3-D3. Đã báo ở gói trước, không báo lại: CL3-A3 (câu 9b của RE), CL3-A6 (5a / 5c / 7a gửi chữ đã chuẩn hóa), CL3-A7 (ô tiền / ngày đọc chữ gốc), CL3-C1 (panel AI tràn).

## 8. Đã xét, không thấy

- **R — đã sửa.** Bảng R: 10 DR6, 34 đột biến (13 vitest, 21 TSX; mục 2, 9.2), 6 probe lượt 2 chạy lại. DR6-96 (sửa bằng tài liệu): NT-EX-05, NT-KH-16, NT-TM-11, 15, 16 so từng câu với `vi.ts`. Không HỒI QUY: 8 spec gói D trên bản ghim 80 / 80; cả bộ e2e trên bản ghim 236 / 237 (chỉ `theme.spec.ts:48` của bộ chạy).
- **E — biên.** K4, K5, K10, K11: ngoài CL3-D3 không thấy gì (seed: không bảng lịch hẹn nào tràn; 18 chuỗi dán đọc lại đúng; KH không có trên Kanban → về đầu + `h1`; hồ sơ ở 1 100 / 900 px không cuộn ngang với dữ liệu seed). Trang lỗi khởi động với chi tiết dài (K6) vừa trang.
- **C — hợp đồng / mockup / nhãn.** 5f so mockup 11f (`trash.html:322-352`): ba dòng Lịch hẹn / Hợp đồng / Ghi chú KYC chỉ là số, câu "Dữ liệu vẫn còn…" — khớp. 9b sau dọn sạch: `person.deleteBody` đúng câu của 11f. 5f ↔ 11b ↔ 11i đếm như nhau (K8). Ngoài CL3-D1 không thấy gì.
- **D — dữ liệu.** Mọi lệnh ghi của hộp gói D qua `app.run` / `data.run` (11 chỗ ở `CustomerDialogs`, `KycDialogs`, `PersonDialogs`, `TeamDialogs`; `git grep`), nên vào khóa ghi S-2; `useDatabase()` chỉ ở hai bản xem trước chỉ đọc (`CustomerDialogs.tsx:126`, `:139`). 9b đọc cùng hàm với lệnh: 0 / 51 lệch (K9); trước / sau dọn sạch đúng D4 (K1, K2). DR6-90 F1 / F2 (`r06-forms.mjs`) như lượt 2.
- **G — guardrail AI.** Chỗ gói D chạm AI: 3f (`ConfirmFactDialog`) không đổi ở đợt sửa; lưu vẫn qua `confirmKycFact` / `markKycConflict` có `noteId`; focus sau 3f vẫn do `KycExtraction` (R2-05; e2e `customer-ai.spec.ts:387` xanh trong cả bộ). Phần còn lại: gói C.
- **S — ranh giới.** `git grep -E "dangerouslySetInnerHTML|innerHTML|eval\(|new Function|target=.?_blank|window\.open|outerHTML|insertAdjacentHTML"` trên `shell`, `routes/customers` (trừ file AI), `routes/team`, `i18n`, `packages/ui/src`, `main.tsx`, `App.tsx`, `index.html` (trừ test): rỗng (exit 1). Tên KH trong câu 9b (`{customer}`) và chi tiết kỹ thuật của trang lỗi khởi động hiện qua React (chữ, không HTML). Mọi probe: 0 request ra ngoài 127.0.0.1.
- **P — hiệu năng.** Mục 6.2.
- **B — bloat.** Mục 6.1.
- **T — test.** 34 đột biến: 29 bị giết (13 vitest, 16 e2e), 5 sống cả bộ: R82e (→ CL3-D4), R82a / R82d (gần tương đương), R82f (file gói C; Mock không dựng được trích dẫn dài), R72ui (luật giữ ở test `domain` / `db`, gói A R72d). Test mới của đợt sửa trong gói D (`dialog-focus.test.ts`, `block-reload.test.ts`, `team-view.test.ts`, `startup-error.test.ts`, `kyc-view.test.ts`) không đọc giờ máy (đọc diff: không `new Date` / `Date.now`).
- **A — trợ năng / i18n.** Trang lỗi khởi động: `role="alert"`, `h1`, tương phản ≥ 7,26:1 (K6). Cột nút có tiêu đề ẩn (DR6-100). Focus sau 7a "Bỏ", 7d, 5c → 5f → Hủy, đổi màn: đúng (bảng R, K11). i18n: 0 khóa thừa, 0 thiếu slot ngoài khuôn cố ý (mục 6.1). Ngoài CL3-D2 không thấy gì.

## 9. Phụ lục

### 9.1 Probe, log

Mọi file ở `C:\workspace\deep-review-1-6-r3\claude\D\`. Không ghi gì vào repo.

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `list.mjs` | danh sách 76 file gói D (`classifyFile`) | `list.log`, `files.txt` | mục 3 |
| `fix-numstat.log`, `fix-diff.patch` | `git diff 4217ed4 119e2e4` trên 76 file | — | mục 3 |
| `build-dist.mjs`, `serve-dist.mjs`, `pw.config.mjs` | dựng bản web ngoài repo bằng Vite `build()` + `load` hook phục vụ bản đột biến (repo không bị vá), `vite preview` 127.0.0.1:446x / 447x, e2e của repo chạy vào đó | `e2e-base.log` | mục 2, 4 |
| `mut-list.mjs`, `mutant-config.mjs`, `mutjs.mjs` | 34 đột biến; vitest qua `load` hook (nhiều file) | `mutjs.log`, `mut\<id>.out`, `mut\<id>.map.json` | mục 2, 9.2 |
| `e2e-mut.mjs` | e2e đột biến (lọc nhắm / `--full`), đối chứng `base` | `e2e-mut.log`, `mut\<id>-<n>.e2e.out` | mục 2, 9.2 |
| `hooks.mjs`, `hooks-any.mjs`, `browser.mjs` | chép `claude\C\` | — | mọi probe |
| `p01-team-9b.mjs`, `p01b-trash-holds.mjs` | 9b qua lớp dữ liệu: dữ liệu tải; chuỗi Thùng rác → khôi phục → dọn sạch | `p01-team-9b.log`, `p01b-trash-holds.log` | DR6-80, K1, K9, CL3-D1 |
| `p02-overflow.mjs` | chuỗi liền ở hồ sơ / hộp, 1 440 / 1 100; bản ghim, R82e, R82a | `p02-overflow-{base,R82e,R82a}.log` | DR6-82, K4, CL3-D3, CL3-D4 |
| `p03-appt-table.mjs` | bảng Lịch hẹn của 120 hồ sơ seed | `p03-appt-table.log` | K5 |
| `p04-focus-team.mjs`, `p04b-team-enter.mjs` | focus sau các hộp của màn Team; Enter thêm sau Xóa team | `p04-focus-team.log`, `p04b-team-enter.log` | K3, CL3-D2 |
| `p05-startup.mjs` | trang lỗi khởi động, IPC giả | `p05-startup.log` | DR6-75, K6 |
| `p06-k25-ui.mjs` | K25 trên 5a / 9c / 7a; bản ghim và R72ui | `p06-k25-ui-{base,R72ui}.log` | DR6-72, K7 |
| `p07-9b-purge-ui.mjs` | 9b trên màn trước / sau dọn sạch (ca NT-TM-16) | `p07-9b-purge-ui.log` | K2, CL3-D1, CL3-D2 |
| `p08-web-perf.mjs` | thao tác màn gói D trên dữ liệu tải (`dist-real`) | `p08-web-perf.log` | mục 6.2 |
| `p09-counts.mjs` | 5f ↔ 11b ↔ 11i trên dữ liệu tải | `p09-counts.log` | K8 |
| `p10-perf.mjs` | hàm thuần / lệnh đọc của màn gói D, dữ liệu tải + Thùng rác lớn | `p10-perf.log` | mục 6.2 |
| `p11-more.mjs` | đổi màn khác, 5c → 5f → Hủy, bề rộng nhỏ | `p11-more.log` | K11 |
| `r01-scroll.mjs`, `r02-text-overflow.mjs`, `r03-headers.mjs`, `r06-forms.mjs` | probe lượt 2 (`p04b`, `p10c`, `p11`, `p06`), đổi cổng | `r01-scroll.log`, `r02-text-overflow.log`, `r03-headers.log`, `r06-forms-base.log` | DR6-81, 82, 100, 90 |
| `r04-kyc-read.mjs` | DR6-101 + 18 biến thể | `r04-kyc-read.log` | DR6-101, K10 |
| `r1-keys.mjs`, `r1-slots.mjs`, `r1-exports.mjs` | script lượt 1–2 (chép nguyên) | `keys.log`, `slots.log`, `exports.log` | mục 6.1 |
| `tsc-unused-ui.log`, `tsc-unused-app.log` | `tsc --noUnusedLocals --noUnusedParameters` | — | mục 6.1 |

Lần chạy lỗi của probe (lỗi probe, không phải sản phẩm): `p05-startup.mjs` lần đầu (ca backup đưa file rỗng nên app mở như lần đầu, không backup → sửa thành ảnh chụp demo `/demo-2026-09-15.sqlite`); `p09-counts.mjs` lần đầu (điều kiện so viết sai, viết lại trước khi lấy số).

### 9.2 Đột biến (34)

- **vitest (13), đều KILLED:** R80a, R80b, R80c, R80d, R80e, R80f, R80g (`team-view.test.ts`), R83a, R83b, R83c (`dialog-focus.test.ts`), R90-BR3, R90-BR3b (`block-reload.test.ts`), R101a (`kyc-view.test.ts`). Mỗi lượt có `[mutant] served`; `mutjs.log` dòng cuối `repo git status --short after: ""`.
- **TSX (21), e2e trên bản dựng ngoài repo:** KILLED bởi e2e nhắm (16): R81a, R82b, R82c, R83d, R83e, R83f (6 ca / 5 spec), R90c, R90d, R90e, R90e2, R90f, R100a, R100b, R100c, R80h (3 ca), R80i. **Sống cả bộ (5):** R82a, R82d, R82f, R72ui (236 / 237 như bản ghim), R82e (235 / 237: thêm `appointment-outcome.spec.ts:280` hết giờ lúc máy bận; chạy lại riêng trên bản R82e và bản ghim: passed / passed) → CL3-D4 cho R82e.
- Đối chứng: bản ghim 8 spec gói D 80 / 80; lọc của R83f / R72ui / R80h 48 / 48; cả bộ 236 / 237 (`theme.spec.ts:48` đỏ ở mọi bản vì bộ chạy dùng 127.0.0.1, như lượt 2).
- Repo không bị ghi: `build-dist.mjs` chỉ đọc file repo, phục vụ bản đột biến qua `load` hook, kiểm sha256 trước / sau; mỗi lần dựng và mỗi lượt `e2e-mut.mjs` / `mutjs.mjs` in `git status --short after: ""`.

### 9.3 Chạy ngoài repo, tác dụng phụ

- Cổng: 4461 (bản ghim, nền suốt phiên), 4462–4469 (bản đột biến của `e2e-mut.mjs`), 4475–4479 (probe trên bản đột biến / `dist-real`). Không dùng 4173, không `PW_REUSE`. Không chạy exe (số exe lấy ở `baseline.md`; gói D không có thao tác chỉ exe mới đo được).
- Đầu ra build / test: `D\dist-*` (bản dựng), `D\pw-results`.
- Không gọi dịch vụ AI, không đọc key, không mở chatgpt.com: mọi log trình duyệt ghi 0 request ra ngoài 127.0.0.1; AI trích xuất trong probe là Mock của bản web.

### 9.4 Ranh giới đọc

Chỉ mở theo tên đầy đủ: `common\{prompt-claude.md, plan.md, known.md, fixes.md, baseline.md}`; `common\load\load-2026-10-12-seed6.p2cbackup` (qua `hooks.mjs`); báo cáo lượt 3 của Claude `claude\{A,B,C}.md`; công cụ lượt 3 của Claude ở `claude\C\` (`list.mjs`, `hooks.mjs`, `hooks-any.mjs`, `browser.mjs`, `build-dist.mjs`, `serve-dist.mjs`, `pw.config.mjs`, `mut.mjs`) và `claude\B\` (`mutant-config.mjs`, `mutjs.mjs`); probe lượt 2 của Claude `deep-review-1-6-r2\claude\D\{p01-team, p02-kyc-view, p03-perf, p04b-scroll, p06-forms, p08-web-perf, p10c-text-overflow, p11-headers, r1-keys, r1-slots, r1-exports}.mjs` (sau `Test-Path` từng tên). Chỉ kiểm tồn tại bằng `Test-Path` theo tên (không đọc nội dung): `claude\A\{hooks,mutant-config}.mjs`, `claude\B\hooks.mjs` và vài tên công cụ của `r2\claude\D\` (`list`, `build-dist`, `serve-dist`, `pw.config`, `mut`, `mut-list`, `p03`, `p04`, `p07`, `p09`, `p10`, `p10b`, `p12`, `e2e-mutants`, `e2e-full`). Không liệt kê, không tìm kiếm thư mục nào ở `C:\workspace\`, `deep-review-1-6*\`; không mở thư mục `codex\` / `muse\` nào. Tìm kiếm chỉ trong repo (`docs/reviews/raw`, mã) và trong từng file được phép đọc (`plan.md`, `fixes.md`, `A.md`, `B.md`, `C.md`).

### 9.5 Cuối phiên

- `git status --short` cuối phiên (`C:\workspace\Project-2C-review`, 2026-10-20 22:07): rỗng (như đầu phiên); `git rev-parse HEAD` → `119e2e45cbce54d8a3943757bd826a7f1e9b694f`.
- Không còn cổng 4461–4479 nào nghe (máy chủ `serve-dist` của probe đã dừng); không còn `project2c.exe` / Edge của probe.
- Giờ xong: 2026-10-20 22:08 (+07, giờ máy).
