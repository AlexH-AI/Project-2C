XONG — claude gói D lượt 2, 2026-10-17 12:57 (+07, giờ máy)

# Deep review Phase 1–6, lượt 2 — Claude, gói D (Màn nhập liệu)

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên | Claude (`claude`, ID phát hiện `CL2-D…`) |
| Gói | D — Màn nhập liệu |
| Máy | Home PC `DESKTOP-KDURKJP` |
| Worktree | `C:\workspace\Project-2C-review` (detached) |
| SHA đầu phiên | `4217ed4cd3300af1d63aa61db9eb13902fe75f16` (khớp SHA ghim) |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 2026-10-17 12:02 (+07, giờ máy) |
| Công cụ / model / mức suy luận | Claude Code (app desktop, tab Code) · Claude Opus 5.5 (`claude-opus-5-5`) · mức suy luận `max` (cấu hình phiên của Owner) |
| Bước 0 | `{GÓI}` = D (một chữ hợp lệ) · `claude\D.md` chưa có → làm mới · `claude\A.md`, `B.md`, `C.md` có đủ, dòng đầu đều `XONG …` |

## 2. Bảng R

**Cách kiểm.** Đột biến "gỡ phần sửa" (`D\mut.mjs` + `D\mut-list.mjs`, log `D\mut.log`): vá **một** file của worktree, chạy test vitest (file test của PR, hoặc `vitest related <file>` cho TSX), trả nguyên byte, so sha256 với `git show HEAD:` trước / sau; dòng cuối mỗi lượt `git status --short after: ""`. TSX không có test DOM trong vitest (jsdom là G4) nên chạy thêm e2e trên bản dựng **ngoài repo** (`D\e2e-mutants.mjs` → `D\build-dist.mjs`: vá → `vite build --outDir D\dist-<id>` → trả nguyên byte → sha256 = HEAD; phục vụ ở 127.0.0.1:4412, chạy 7 spec của gói D — `navigation`, `data-table`, `customers`, `customer-forms`, `customer-kyc`, `team`, `dialog-keyboard`; đối chứng bản ghim **68 / 68 xanh**, `D\e2e-base.log`). Đột biến sống 7 spec thì chạy **cả bộ e2e** (217 ca, `D\e2e-full.mjs`, cổng 4413; `theme.spec.ts:48` "no requests to hosts other than localhost" đỏ ở mọi bản kể cả bản ghim vì cổng của bộ chạy là `127.0.0.1` — lỗi của bộ chạy, không tính, `D\e2e-base-theme.log`). Tái hiện lượt 1: probe lượt 1 Claude Home PC (`deep-review-1-6\claude\D\p1-person-delete.mjs`, `p2-perf.mjs`) dựng lại qua lớp dữ liệu của app (`openAppData`, `tables()`), và ca của báo cáo gốc laptop (`p3-ui`, `p6-outside-scope`) dựng lại trên bản web ghim (`D\dist-base`, Edge, `D\p04-web-ui.mjs`); DR6-34 thêm **exe thật, input thật của Windows** (`D\p05-exe-back.mjs` + `D\sendinput.ps1`).

| DR6 | Issue → PR | Kết luận | Bằng chứng (tái hiện lượt 1 nay ra gì; test nào đỏ khi gỡ phần sửa) | Biến thể / ghi chú (ID phát hiện) |
|---|---|---|---|---|
| 02 (phần D: hộp 5c) | #594 → #618 | **ĐÃ SỬA** | e2e bản ghim `customer-forms.spec.ts:218 changing the RE hands the planned appointments over, not the past ones (5c, 6h)` xanh: chọn RE khác → "Khi lưu: 1 lịch hẹn Dự kiến chuyển sang RE mới."; câu `customerForm.reHelp` mới. Gỡ sửa: R02d (bỏ khung 5c) → **KILLED** e2e `customer-forms.spec.ts:218`. Phần lệnh (lịch Dự kiến sang RE mới, `recordOutcomeWithNext`): gói A — ĐÃ SỬA | Số trong khung = số lịch chuyển: dùng chung điều kiện `plannedOff` với lệnh (`packages/db/src/customers.ts:164-171, :467-474`), A K2 fuzz 313 lần khớp; "Dự kiến" của khung (ngày ≥ hôm nay) trùng nhãn màn Lịch hẹn (`statusLabel` → `appointmentGroup`, ngày < hôm nay mới là "Chưa ghi kết quả"). Nhánh "0 khi KH đã là của RE đó" không test giữ: CL2-A3 (gói A, không báo lại). 6h điền RE hiện tại: gói E |
| 26 | #602 → #636 | **ĐÃ SỬA** | Ca A của probe lượt 1 `p1-person-delete.mjs` dựng lại qua `openAppData` (`D\p01-team.mjs`): IS chỉ là người đánh giá → `personUsage` `{"…":0,"reviewing":1}`, hộp **tắt Xóa**, dòng "1 lịch hẹn là người đánh giá kết quả", chỉ câu `inUseSupportHelp` (lượt 1: mọi số 0, Xóa bật, lệnh từ chối bằng câu của RE). 6f bỏ người đánh giá → `reviewing: 0`, lệnh xóa được. Ca B trên dữ liệu tải: `dialogLetsThroughButRefused` 0 ở mọi vai. Gỡ sửa: R26a (`reviewing: 0`) → KILLED `team-view.test.ts > personUsage > counts the meetings the person reviews…`; R26b (luôn hiện câu của RE) → KILLED e2e `team.spec.ts:358`, `:381`; R26c (bỏ dòng người đánh giá) → KILLED e2e `team.spec.ts:381` | **CL2-D2** (câu hướng dẫn cho người hỗ trợ không làm được với lịch Dời lịch / Dự kiến; 7 / 7 người hỗ trợ trên dữ liệu tải). KNOWN #636 (hai câu khi RE vừa phối hợp; `error.PERSON_IN_USE` nói về RE, màn không đếm lịch của KH đã xóa): không có bằng chứng mới |
| 27 | #597 → #623 | **ĐÃ SỬA** | Ca lượt 1 (L·CL-D2 `p3-ui`: 7b "6 tỷ" không `aria-describedby`) trên bản web ghim (`p04-web-ui.mjs` S4): Tổng tài sản "6 tỷ" → "6.000.000.000 ₫ (6 tỷ)", "1.5 tỷ" → "1.500.000.000 ₫ (1,5 tỷ)", "150 tỷ" → "150.000.000.000 ₫ (150 tỷ)" (`parseVnd` không có trần, đúng: trần 100 tỷ chỉ cho phí), "Khoảng 12 tỷ" / "6 tỷ/năm" / rỗng → không dòng; giá trị lưu nguyên chữ (`p02-kyc-view.mjs` A: 36 chuỗi, `stored` = chữ gõ đã chuẩn hóa). Gỡ sửa: R27a (`kycAmountRead` luôn null) → KILLED 2 ca `kyc-view.test.ts > kycAmountRead (NT-HS-05…)`; R27b (ô Giá trị không gắn dòng đọc lại) → KILLED e2e `customer-kyc.spec.ts:151` | **CL2-D4** (Nit: đọc lại theo chữ chưa chuẩn hóa — "6" + U+200B + "tỷ" không có dòng nhưng lưu thành "6tỷ") |
| 28 | #597 → #623 | **ĐÃ SỬA** | Ca lượt 1 (H·CL-D3: hộp 7d `hasF: false`): e2e bản ghim `customer-kyc.spec.ts:151` xanh (7d có mã F); `p04` S4: 7c "Đang có: Độc thân · F4 (16/07/2026)". Mã của 7d trùng mã thẻ Dữ kiện KYC cho cùng dữ kiện ở **mọi** trường đang mâu thuẫn: seed demo 173 trường / 0 lệch, dữ liệu tải 240 / 0 (`p02-kyc-view.mjs` C). Gỡ sửa: R28a (`code: ''` ở `resolveKycOptions`) → KILLED 2 ca `kyc-view.test.ts > resolveKycOptions`; R28b (7d bỏ mã) → KILLED e2e `customer-kyc.spec.ts:151`; R28c (7c bỏ mã) → KILLED e2e `customer-kyc.spec.ts:151` | Dạng mã "F5", không "F-05 · N-0712" của mockup 7c / 7d: NT-HS-02 ghi rõ `F13` (không "F-13"), PR #623 nêu — không ghi phát hiện |
| 29 | #597 → #623 (code), #607 → #619 (ô Kỳ) | **ĐÃ SỬA**; ô Kỳ: dòng ghi lệch có, khớp app | Ca lượt 1 (L·CL-D3 `p3-ui`: chuyển nhóm do cuộc gặp chỉ "sau cuộc gặp"): nay "sau cuộc gặp · tính 1 RF" / "· không tính RF", phiên bản `material` có nhãn "thay đổi quan trọng". Trên seed demo và dữ liệu tải (`p02-kyc-view.mjs` B), số "tính 1 RF" của dòng thời gian = số "lần tính RF" của hộp 5f (`countCustomerRecords`) = RF của chỉ số (`isRfAppointment`) cho **từng** KH: 473 / 473 / 473 và 686 / 686 / 686, 0 KH lệch; kyc v1 luôn có nhãn (1 200 / 1 200, 1 481 / 1 481). Gỡ sửa: R29a (`stageCause` không bao giờ RF) → KILLED `kyc-view.test.ts > stageCause … counts one RF…`; R29b (bỏ nhãn quan trọng) → KILLED e2e `customer-kyc.spec.ts:44`, `:151`; R29c (bỏ chữ RF) → sống 7 spec, **KILLED** cả bộ e2e `appointment-outcome.spec.ts:61` ("N3→N2sau cuộc gặp · tính 1 RF"). Ô Kỳ: `docs/testing/nghiem-thu-v1.md:387` có dòng; `CustomerAppointments.tsx` không có ô chọn kỳ (đúng dòng ghi) | — |
| 30 | #597 → #623 | **ĐÃ SỬA** | Ca lượt 1 (L·CX-D4: ở 1 440 `gridTemplateColumns` = "572px 572px", panel AI ở dưới) đo trên **exe ghim**, cửa sổ mặc định (`p05-exe-back.mjs`): `innerWidth 1440`, thanh cuộn 15 px, `cols "371px 371px 371px"`, ba vùng cùng `top` 189, không cuộn ngang, 0 phần tử bị cắt trong ba cột. e2e `customer-kyc.spec.ts:20 the profile has three columns at 1 440 × 900, two at 1 100` xanh. Gỡ sửa: R30a (về `2xl:`) → KILLED e2e `customer-kyc.spec.ts:20` | Token `--breakpoint-wide: 90rem` thêm ở `packages/ui/src/theme.css:62-64` (file ngoài danh sách, PR đã nêu) |
| 31 | #602 → #636 | **ĐÃ SỬA** | Ca lượt 1 (L·CL-D4 `p6-outside-scope`: RE không điền sẵn, không dòng báo) trên bản web ghim (`p04-web-ui.mjs` S2): Góc nhìn RE "Bùi Kim Hùng · Bình Minh" → ô RE điền sẵn đúng RE đó; tạo KH cho RE khác → dòng `role="status"` "Đã tạo KH Ngoài Góc Nhìn Một cho Đặng Bảo Việt. RE này nằm ngoài góc nhìn hiện tại… Hồ sơ KH →", số "34 KH đang mở · 6 đã đóng" không đổi, focus về **+ Khách hàng**; Team + RE chọn ở dải → điền sẵn RE của dải, tạo cho RE khác cùng team → có dòng. Gỡ sửa: R31a (không điền sẵn) → KILLED e2e `customer-forms.spec.ts:33`, `:81`; R31b (không dòng báo) → KILLED e2e `customer-forms.spec.ts:81` | Dòng báo ẩn khi chọn RE của KH mới ở dải, **hiện lại** khi chọn lại RE cũ (câu vẫn đúng: KH vẫn ngoài góc nhìn đó) — không ghi phát hiện. Không có dòng nghiệm thu (PR #636 để lượt 2 cân nhắc): xem CL2-D6 |
| 32 | #602 → #636 | **ĐÃ SỬA** | e2e bản ghim `team.spec.ts:144 another team shows its first 100 RE again after "Hiện thêm"…` xanh (dựng 111 RE mỗi team). Gỡ sửa: R32a (bỏ `resetKey`) → KILLED e2e `team.spec.ts:144` | — |
| 33 | #602 → #636 | **ĐÃ SỬA** (hành vi); test giữ 3 / 6 phần | Ca lượt 1 (L·MU-D2 / D3, H·CL-D6): 7a ô Ngày đỏ khi đang gõ → e2e `customer-kyc.spec.ts:93` xanh; chọn lại Giới tính xóa lỗi lưu → `customer-forms.spec.ts:288` xanh; trên bản ghim (`D\p06-forms.mjs`, exe giả): 7a lưu bị từ chối (ghi chú có ký tự hỏng như khi dán → `INVALID_TEXT`) → khung đỏ, gõ tiếp vào ghi chú → khung mất; Xóa nhân sự / Xóa team bị `DATA_REPLACING` trong lúc Nạp lại → nút Xóa **vẫn bật**. Gỡ sửa: R33a → KILLED e2e `customer-kyc.spec.ts:93`; R33b → KILLED e2e `customer-forms.spec.ts:288`; R33f (`retriesDelete` từ chối cả S2-2) → KILLED `team-view.test.ts > retriesDelete`; **R33c, R33d, R33e SỐNG** cả bộ e2e (217 ca), dù `p06-forms.mjs` thấy cả ba (R33e: khung đỏ còn sau khi gõ; R33d: Xóa nhân sự tắt; R33c: Xóa team tắt) | **CL2-D5** (test hở: hai hộp Xóa không dùng `retriesDelete` hay khung lỗi 7a không mất khi gõ → CI xanh) |
| 34 | #603 → #638 | **ĐÃ SỬA** | Ca lượt 1 (H·CL-D5: `history.back()` trên bản web, exe PLAUSIBLE) chạy trên **exe ghim với input thật** (`SendInput`, cửa sổ exe ở trước, hộp 7a đang có chữ, `D\p05-exe-back-exe.log`): nút chuột Back (XBUTTON1), phím BrowserBack, Alt+← → trang nghe `mouseup` 3 / `keydown` với `defaultPrevented: true`, hash không đổi, hộp còn, chữ còn; Forward (XBUTTON2, BrowserForward, Alt+→) khi có mục phía trước (`p05-exe-back-exe-forward.log`) → như vậy, hộp 5a còn "Lan Đang Gõ". Đối chứng cùng input lên Edge `--app` bản web (không chạy `blockReload`): Back chuột / phím / Alt+← và Forward chuột / phím đều đổi màn, hộp mất (`p05-exe-back-edge*.log`). Gỡ sửa: R34a (bỏ phím) → KILLED `block-reload.test.ts > keeps Back and Forward…, by the keyboard`; R34b (bỏ nút chuột) → KILLED `…mouse's own Back and Forward buttons…`; N34c (chỉ chặn nút 4) / N34d (chỉ Alt+←) / N34e (nghe `mousedown`) → KILLED | Vuốt (touch / touchpad) lùi trang: tắt sẵn (`wry 0.55.1` `SetIsSwipeNavigationEnabled(back_forward_navigation_gestures)`, mặc định `false`, Tauri không đặt). Backspace trong ô chữ chỉ xóa chữ. Đóng cửa sổ khi hộp đang mở vẫn bỏ bản nháp mà không hỏi (CloseGuard chỉ hỏi khi lưu lỗi, T-057): ngoài phạm vi DR6-34, không ghi |
| 35 | #603 → #638 | **ĐÃ SỬA** | Ca lượt 1 (H·CL-D10: sau thẻ KH → hồ sơ `activeElement` = BODY, title cố định): e2e `navigation.spec.ts:68` xanh; thêm đường vào khác (`p04-web-ui.mjs` S1, S3): "Hồ sơ KH →" ở chi tiết Lịch hẹn → focus `H1 Hồ sơ khách hàng`, title "Hồ sơ khách hàng · Project-2C"; `#/settings/trash` → "Cài đặt · Project-2C", focus `h1`; sau 5f xóa KH → về Khách hàng, focus `h1`. Gỡ sửa: R35a (không focus `h1`), R35b (title cố định), R35c (về Khách hàng focus `h1` thay thẻ), N35f (mở app cũng lấy focus) → KILLED e2e `navigation.spec.ts:68`; R35d ("Hiện thêm" cuối không focus) → KILLED `data-table.spec.ts:143`; R35e ("+ n KH" không focus bảng) → KILLED `data-table.spec.ts:173` | **CL2-D3** (đổi màn giữ vị trí cuộn của màn trước). Thanh tiêu đề exe vẫn "Project-2C" khi `document.title` = "Hồ sơ khách hàng · Project-2C" (đo trên exe: KNOWN #638, không bằng chứng mới) |
| 36 | #607 → #619 | **ĐÃ SỬA** (ghi lệch đã biết) | `docs/testing/nghiem-thu-v1.md:388-391` có đủ bốn điểm. Khớp app (`p04-web-ui.mjs` S5, bản web ghim): 5c nhãn "Ngày sinh (năm hoặc đủ ngày)", đọc lại "Chỉ năm sinh 1999 · 27 tuổi trong năm 2026", không "trước: …"; 7c "Đánh dấu mâu thuẫn" ở trường cốt lõi: hộp không nhắc cổng / Phân tích (`false`); 7a dữ kiện đã thêm chỉ ghi "Nghề nghiệp"; nút tạo KH "+ Khách hàng" (e2e `customers.spec.ts`, NT-KH-01) | — |
| 62 | #606 → #644 | **SỬA MỘT PHẦN** | Áp lại đột biến lượt 1: X5 (`stageSince` giữ chuyển nhóm đầu) → KILLED 4 ca `customers-view.test.ts`; X5 ở đúng chỗ lượt 1 (hồ sơ tự lấy chuyển nhóm đầu, `X5p`) → KILLED e2e `customer-forms.spec.ts:134` ("từ 11/09/2026"); X6 → KILLED 2; D6 → KILLED 1 (`parseBirthDate('2026')`); BR4 (pha bubble) → KILLED `block-reload.test.ts > listens in the capture phase…` (ca của #638); **BR3 → SỐNG** 7 / 7. `coverage.include` có `apps/desktop/src/i18n/index.ts`, `packages/ui/src/**/*.ts` (`vitest.config.ts:23-24`, ngưỡng `:70`, `:77`) | **CL2-D1** (BR3: phần "BR3 / BR4 chặn tải lại" của DR6-62 — Issue #606 bỏ BR3 / BR4, PR #644 ghi "không đụng file đó") |

Kết luận bảng R: **12 / 13 DR6 của gói D ĐÃ SỬA, 1 SỬA MỘT PHẦN (DR6-62)**. 39 đột biến (mục 9.2): 15 file `.ts` (14 KILLED bởi vitest, BR3 sống), 24 TSX (vitest không giết cái nào; e2e 7 spec giết 20; cả bộ e2e giết thêm R29c; R33c, R33d, R33e sống).

## 3. Phạm vi đã đọc

**Danh sách file gói D** (`D\list.mjs` theo `classifyFile` của `tools/size-report-core.mjs`, log `D\list.log`): 74 file, **7 196 dòng SP / 2 023 dòng test** (trùng plan §L2.3).

**Diff sửa của gói D** (`git diff --numstat 8855345 4217ed4` trên 74 file, bản đầy đủ `D\fix-diff.patch`, 1 930 dòng): SP **+492 / −116 ở 18 file**, test **+308 / −33 ở 6 file** (trùng plan §L2.3); 11 commit chạm gói (`b563604` #616, `5d2443f` #618, `9acef55` #620, `bf87d71` #623, `e6c9078` #628, `43e6696` #630, `ffc1db7` #634, `ba3ca2d` #636, `e8d340a` #638, `d3797d7` #640, `83e0515` #644). Đọc từng hunk của: `shell/{AppShell,block-reload,SaveWarning,startup-error}.ts(x)`, `packages/ui/src/components/DataTable.tsx`, `theme.css`, `routes/customers/{CustomersScreen,CustomerProfile,CustomerDialogs,KycDialogs,CustomerKyc}.tsx`, `customers-view.ts`, `kyc-view.ts`, `routes/team/{TeamScreen,PersonDialogs,TeamDialogs}.tsx`, `team-view.ts`, `i18n/vi.ts`; test `customers-view.test.ts`, `kyc-view.test.ts`, `team-view.test.ts`, `block-reload.test.ts`, `SaveWarning.test.tsx`, `startup-error.test.ts`.

**Đọc hết ở SHA ghim:** `shell/` — `AppShell.tsx` (91), `useRoute.ts` (45), `routes.ts` (77), `block-reload.ts` (62), `CloseGuard.tsx`, `close-guard.ts`, `ErrorBoundary.tsx`, `SaveWarning.tsx`, `StartupError.tsx`, `startup-error.ts`, `screen-error.ts`, `RePicker.tsx`, `ScopeContext.tsx`, `ScopePicker.tsx`, `Sidebar.tsx`, `scope.ts`; `main.tsx`, `App.tsx`, `routes/Screen.tsx`, `index.html`, `index.css`; `i18n/index.ts` (132); `routes/customers/` — `CustomersScreen.tsx` (307), `customers-view.ts` (180), `CustomerProfile.tsx` (278), `CustomerDialogs.tsx` (516), `KycDialogs.tsx` (534), `CustomerKyc.tsx` (309), `CustomerAppointments.tsx` (154), `kyc-view.ts` (297); `routes/team/` — `TeamScreen.tsx` (317), `PersonDialogs.tsx` (212), `TeamDialogs.tsx` (101), `team-view.ts` (132); `packages/ui/src/components/` — `DataTable.tsx` (230), `Dialog.tsx`, `TextField.tsx`, `SelectField.tsx`, `Choices.tsx`, `Segmented.tsx`, `Button.tsx`, `PeriodPicker.tsx`, `PeriodPicker.label.ts`, `show-more.ts`, `compare-cells.ts`, `StageBadge.tsx`, `PolicyBadge.tsx`, `index.ts`. `vi.ts` (1 245): mọi khóa mới / đổi của diff và khóa màn gói D (`customers.*`, `customer.*`, `customerForm.*`, `customerDelete.*`, `stageForm.*`, `kyc*.*`, `timeline.*`, `team.*`, `person.*`, `scope.*`, `rePicker.*`, `error.*` của lệnh gói D gặp); phần còn lại kiểm bằng script (`D\r1-keys.mjs`, `D\r1-slots.mjs`). Không đổi từ `8855345` (không có trong `git diff --numstat 8855345 4217ed4`) và lượt 1 đã đọc hết: `Chart.tsx`, `chart-theme.ts`, `NavIcon.tsx`, `token-guard.ts`, `tokens.css`, `fonts.css` — lượt này chỉ đọc lướt.

**Chỗ gói khác nối vào (chỉ chỗ nối):** `packages/db/src/team.ts:237-272` (`ownsLiveRecords`, `isPersonInUse`, `coordinatesLiveAppointment`, `reviewsLiveAppointment`), `routes/Settings.tsx` (mục là state, không đổi hash), `routes/customers/KycIntelligence.tsx:80-110` (link `#kyc-facts` chặn mặc định), `e2e/navigation.spec.ts:60-170`, `vitest.config.ts` (`coverage.include`, ngưỡng), `apps/desktop/src-tauri/Cargo.lock` (wry 0.55.1) + `~\.cargo\registry\…\wry-0.55.1\src\webview2\mod.rs:597`, `lib.rs:736, :840` (`SetIsSwipeNavigationEnabled(back_forward_navigation_gestures)`, mặc định `false`; `tauri-runtime-wry 2.11.4` không đặt cờ này).

**Tài liệu:** `CLAUDE.md` gốc, `apps/desktop/CLAUDE.md`, `packages/ui/CLAUDE.md`, `packages/db/CLAUDE.md`, `.claude/rules/{i18n-ui,tests}.md`; `common\{plan.md (§4, §L2.1–§L2.11, Phụ lục E, H), known.md (phần 1–3), fixes.md (#594 / #618, #597 / #623, #602 / #636, #603 / #638, #606 / #644, #607 / #619), baseline.md}`; tổng hợp lượt 1 §1–§11 (đủ); báo cáo gốc lượt 1 gói D: Claude laptop (`raw/2026-10-15/claude/D.md` §1–§3), Claude Home PC (`raw/2026-10-15/home-pc/claude/D.md`, đủ), Codex laptop / Home PC (§3, §7), Muse laptop / Home PC (cấu trúc, §3); báo cáo lượt 2 của chính Claude `claude\A.md` (§1–§4), `B.md`, `C.md` (danh sách phát hiện, §2, §4, §9) để không báo lại.

## 4. Kịch bản mới đã thử

Bản web dùng cho màn: `D\dist-base` (dựng ngoài repo từ worktree ghim, `VITE_DEMO_ANCHOR=15/09/2026` như e2e, snapshot demo của ngày đó) phục vụ ở 127.0.0.1:4411; `D\dist-real` (dựng không biến môi trường, hôm nay = 17/10/2026, để nhập dữ liệu tải mốc 12/10) ở 4415. Mọi probe trình duyệt: Edge (Playwright), mạng ngoài 127.0.0.1 bị chặn từ lần chạy đầu (`--host-resolver-rules` + `route.abort`), `window.open` / clipboard thay bằng bản ghi (`D\browser.mjs`); mọi log ghi "requests blocked: []". Probe Node đi qua lớp dữ liệu của app (`openAppData`, `tables()`), không chèn SQL thô.

| # | Kịch bản (các bước, dữ liệu) | Kết quả | ID |
|---|---|---|---|
| K1 | DR6-34 **trên exe ghim, input thật của Windows** (`p05-exe-back.mjs` + `sendinput.ps1`: chép `common\exe\project2c.exe` vào `D\exe\`, cổng debug 9333, cửa sổ đưa lên trước, `SendInput`): Khách hàng → hồ sơ → **+ Ghi chú KYC** gõ chữ → nút chuột Back (XBUTTON1), Forward (XBUTTON2), phím BrowserBack / BrowserForward, Alt+← / Alt+→, Backspace; Forward thử lại khi lịch sử có mục phía trước (hộp 5a có chữ). Đối chứng: cùng input lên Edge `--app` mở bản web (không `blockReload`) | Exe: 6 / 6 input bị trang chặn (`mouseup` 3 / 4, `keydown` BrowserBack / BrowserForward / ArrowLeft / ArrowRight đều `defaultPrevented: true`), hash không đổi, hộp và chữ còn; Backspace chỉ xóa một chữ trong ô. Edge (đối chứng): Back chuột, BrowserBack, Alt+←, Forward chuột, BrowserForward đều đổi màn, hộp mất → input thật đúng là lùi / tiến. `history.back()` từ trang vẫn đổi màn trên exe (có chỗ để lùi) | không thấy |
| K2 | Bố cục hồ sơ trên **exe**, cửa sổ mặc định (`tauri.conf.json` 1 440 × 900), `p05` | `innerWidth 1440`, thanh cuộn 15 px, ba cột 371 px cùng hàng, không cuộn ngang, 0 phần tử bị cắt với dữ liệu seed | không thấy |
| K3 | Vị trí cuộn khi đổi màn (`p04-web-ui.mjs` S1, `p04b-scroll.mjs`): Khách hàng → Bảng cuộn tới cuối → bấm tên KH; hồ sơ cuộn → "← Khách hàng"; mỗi mục sidebar từ một màn đã cuộn tới cuối; chi tiết Lịch hẹn (kỳ Năm, cuộn) → "Hồ sơ KH →" | Hồ sơ mở ở `scrollY 417 / 1358`, tên KH ngoài khung nhìn; Tổng quan (cuộn 134) → Lịch hẹn mở ở `scrollY 105`; màn ngắn hơn cửa sổ thì về 0; từ chi tiết Lịch hẹn → hồ sơ ở 0 | CL2-D3 |
| K4 | Đọc lại tiền KYC (DR6-27) với 36 chuỗi RE có thể gõ / dán (`p02-kyc-view.mjs` A: "6 tỷ", "1,5 tỷ", "1.5 tỷ", "6 ty", "6 tỷ đồng / VNĐ", nhóm nghìn bằng dấu chấm / dấu cách, "800tr", "1tr5", "500k", "0", "100 tỷ", "150 tỷ", "9999999 tỷ", số âm (hai kiểu dấu trừ), "Khoảng 12 tỷ", "1–2 tỷ", "~6 tỷ", "6 tỷ/năm", NBSP, U+200B, U+3000, chữ số toàn khổ, "0.500", rỗng) so `parseVnd` và giá trị lưu (`normalizeKycValue`); trên màn 7b (`p04` S4) | Đọc lại đúng khi `parseVnd` đọc được (kể cả "150 tỷ": `parseVnd` không có trần, trần 100 tỷ chỉ cho phí — đúng); không dòng cho chữ tự do, số âm, quá `MAX_SAFE_INTEGER`; giá trị lưu nguyên chữ. Một lệch: chữ có U+200B không có dòng đọc lại nhưng lưu thành chữ đọc được | CL2-D4 |
| K5 | Câu hướng dẫn mới của 9b cho người hỗ trợ trên dữ liệu tải (`p01-team.mjs` B): mỗi IS / TL / BD / BDM, người phối hợp nằm ở lịch nào (6f sửa được / Dự kiến chỉ xóa được / Dời lịch không sửa không xóa) | 7 / 7 người hỗ trợ phối hợp ít nhất một lịch Dời lịch (2–25 lịch mỗi người) và 4–28 lịch Dự kiến → vế "bỏ khỏi người phối hợp" không làm được; vế người đánh giá thì làm được (ca A) | CL2-D2 |
| K6 | Dòng thời gian ↔ hộp 5f ↔ chỉ số (`p02-kyc-view.mjs` B): seed demo 17/10 (1 200 KH) và dữ liệu tải (1 481 KH, có Thùng rác, có chuyển nhóm khôi phục): mỗi KH so số "tính 1 RF" của `kycTimeline` + `stageCause`, số "lần tính RF" của `countCustomerRecords` (5f, Thùng rác) và số RF của `isRfAppointment` (Tổng quan / Báo cáo); nhãn "thay đổi quan trọng" của kyc v1 | 473 / 473 / 473 và 686 / 686 / 686, **0 KH lệch**; kyc v1 có nhãn 1 200 / 1 200, 1 481 / 1 481 (ADR-0008 mục 7) | không thấy |
| K7 | Mã F ở 7d ↔ thẻ Dữ kiện KYC (`p02` C): mọi trường đang mâu thuẫn của seed demo và dữ liệu tải, mã từng lựa chọn của `resolveKycOptions` so mã của chính dữ kiện đó trên thẻ (`kycOverview`) | 173 trường / 0 lệch; 240 / 0 lệch | không thấy |
| K8 | Các phần của DR6-33 không có e2e, chạy thật (`p06-forms.mjs`, exe giả): 7a ghi chú có nửa surrogate lẻ (như chữ dán hỏng) → Lưu → lệnh từ chối `INVALID_TEXT` → gõ tiếp; Nạp lại với backup giữ lại (`exe.holdBackup`), sang Team bằng hash → Xóa nhân sự / Xóa team → `DATA_REPLACING`; trên bản ghim và ba bản đột biến R33c / R33d / R33e | Bản ghim: khung đỏ hiện rồi mất khi gõ; Xóa vẫn bật sau `DATA_REPLACING` (đúng DR6-33). Ba bản đột biến đều lộ ra ở probe này, nhưng cả bộ e2e xanh. Đường `errors.form` của 7a tới được ở thao tác thường (ký tự hỏng khi dán), khác câu "chỉ tới được khi đang Nạp lại" của PR #636 | CL2-D5 |
| K9 | Tạo KH ngoài góc nhìn nhiều bước (`p04` S2): Góc nhìn RE → + Khách hàng (ô RE điền sẵn?) → RE khác team → dòng báo, số KH, focus; Góc nhìn Team + RE chọn ở dải → tạo cho RE khác cùng team → chọn RE đó ở dải → chọn lại RE cũ | Điền sẵn đúng RE của góc nhìn (cả RE của dải); dòng `role="status"` + link; "34 KH đang mở" không đổi; focus về **+ Khách hàng**; dòng ẩn khi đổi RE ở dải, **hiện lại** khi chọn lại RE cũ (câu vẫn đúng) | không thấy |
| K10 | Focus `h1` + `document.title` qua các đường vào khác sidebar (`p04` S1, S3): "Hồ sơ KH →" ở chi tiết Lịch hẹn; `#/settings/trash`; sau 5f xóa KH (`onDeleted` đổi hash); và tiêu đề cửa sổ exe (`p05`) | `H1` có focus và title đúng ở cả ba; về Khách hàng sau 5f: `H1 Khách hàng` (thẻ KH đã xóa không còn); exe: thanh tiêu đề vẫn "Project-2C" (KNOWN #638) | không thấy |
| K11 | Chuỗi bàn giao (`p07-chains.mjs` A, seed demo 17/10): KH N1 của RE A có lịch Dự kiến hôm nay → 5c sang RE B (team khác) → 9b, cột Team ("KH đang mở", "Lịch hẹn 30 ngày", "HĐ năm"), Khách hàng góc nhìn RE A / RE B | Khung 5c nói 1, đúng 1 lịch chuyển; 9b A 40 KH / 205 lịch → 39 / 204, B 40 / 202 → 41 / 203; "KH đang mở" A 37 → 36, B 33 → 34 (khớp kanban 37 → 36, 33 → 34); "Lịch hẹn 30 ngày" A 14 → 13, B 15 → 16 (lịch hôm nay nằm trong 30 ngày, chuyển theo — đúng định nghĩa) | không thấy |
| K12 | Chuỗi người đánh giá ↔ Thùng rác (`p07` B): IS mới làm người đánh giá cuộc gặp Đã gặp → 9b chặn → cuộc gặp vào Thùng rác → 9b cho xóa IS → xóa IS → Thùng rác nói gì về cuộc gặp → khôi phục cuộc gặp khi IS đã xóa → khôi phục IS rồi cuộc gặp → xuất / đọc lại backup | 9b `reviewing` 1 → 0 → xóa được; Thùng rác chặn "Người đánh giá IS Đánh Giá Thử đã xóa — khôi phục trước."; lệnh từ chối `PERSON_NOT_FOUND`; khôi phục đúng thứ tự → 9b đếm lại 1; backup đọc lại được | không thấy |
| K13 | Chữ liền dài trong hồ sơ ba cột (`p10-long-text.mjs`, `p10c-text-overflow.mjs`): ghi chú KYC có link Facebook 108 ký tự (đoạn liền 66), dữ kiện "Mục tiêu chính" 80 ký tự liền; đo ở 1 440 và 1 100, so bản R30a (bố cục trước DR6-30) | Bản ghim 1 440: chữ ghi chú tràn 128 px sang cột KYC Intelligence; R30a 1 440: không tràn; dữ kiện 80 ký tự tràn ở cả hai; 1 100: trang cuộn ngang ở cả hai | CL2-D7 |
| K14 | Tương phản chữ mới của đợt sửa (`p09-contrast.mjs`, `contrastOf` đọc màu qua canvas): dòng thời gian ("tính 1 RF" màu accent, nhãn "thay đổi quan trọng"), 7c "Đang có … · F2", 7b dòng đọc lại, khung 5c "Khi lưu…", dòng báo ngoài góc nhìn, 9b của IS | Thấp nhất 6,17:1 (chữ `text-fg-3`), 0 cặp < 4,5 ở cả 6 vùng; "Đang có" 8,35; link "Hồ sơ KH →" 9,56 | không thấy |
| K15 | Đường lùi / tiến khác trên exe: vuốt màn hình cảm ứng / touchpad (WebView2 `IsSwipeNavigationEnabled`) — đọc `wry 0.55.1` (`webview2/mod.rs:597`, `lib.rs:736, :840`) và `tauri-runtime-wry 2.11.4` | Cờ lấy từ `back_forward_navigation_gestures`, mặc định `false`, Tauri không đặt → vuốt lùi trang tắt | không thấy |
| K16 | Chuỗi trên màn (`p12-chain-ui.mjs`, bản web ghim): Góc nhìn RE A → tạo KH cho RE B (ngoài góc nhìn) → "Hồ sơ KH →" của dòng báo → + Lịch hẹn ngày mai (Dự kiến, RE B) → Sửa hồ sơ: RE về A → Lưu → "← Khách hàng" | Dòng báo đúng; hồ sơ: focus `H1`, title đúng; 5c "Khi lưu: 1 lịch hẹn Dự kiến chuyển sang RE mới."; về Khách hàng (góc nhìn A): "34 → 35 KH đang mở", focus ở **thẻ của KH vừa xem** (nay RE A); dòng báo cũ không còn | không thấy |

## 5. Phát hiện mới

### CL2-D1 — BR3 của DR6-62 vẫn sống: không test nào thử selector ô chữ thật của chặn menu chuột phải (ô chọn được coi là ô chữ thì menu có Refresh hiện lại)

```
ID: CL2-D1
Mức: Low
Trục: T
Vị trí: apps/desktop/src/shell/block-reload.ts:21-27 (TEXT_FIELD, inTextField), :55-61 (contextmenu); apps/desktop/src/shell/block-reload.test.ts:29-37 (menuBlocked giả `closest` bằng `selector.includes('textarea')`), :75-81 (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-62 (BR3) · có từ trước; Issue #606 không gồm BR3 / BR4, PR #644 ghi "không đụng file đó"
```

- **Mô tả:** DR6-62 (tổng hợp lượt 1 §5.8) gồm "BR3 / BR4 chặn tải lại". BR4 (pha capture) nay bị ca `{ capture: true }` của #638 giết; BR3 thì không: `menuBlocked` của test dựng `closest` giả trả `{}` cho mọi selector có chữ `textarea`, nên selector `TEXT_FIELD` thật (loại trừ checkbox / radio / nút…) không bao giờ được thử, và không e2e nào bấm chuột phải (`git grep "contextmenu\|button: 'right'" -- e2e` rỗng).
- **Tái hiện / bằng chứng:** `node D\mut.mjs BR3` (vá `'input:not([type="checkbox"], [type="radio"],` → `'input:not([type="radio"],`, chạy `block-reload.test.ts`, trả nguyên byte, sha256 = HEAD): `BR3 SURVIVED — 7 passed (7)` (`D\mut.log`, `D\mut-out\BR3.out`). Cùng lượt: BR4 `KILLED — listens in the capture phase, so no screen can stop an event before it`.
- **Ảnh hưởng:** sửa selector sau này (vd. thêm loại ô) có thể để chuột phải lên ô chọn "Đánh dấu là thay đổi quan trọng" (7a / 7d) hay chip `Choices` mở menu WebView2 có **Refresh** trên exe — đúng đường DR-60 chặn (tải lại bỏ thay đổi chưa lưu) — mà CI xanh. Hành vi hiện tại đúng.
- **Đề xuất:** `menuBlocked` nhận một phần tử thật (`document.createElement` cần DOM — G4) hoặc tách `inTextField` ra kiểm bằng một `closest` giả chạy `selector` qua bộ so khớp nhỏ; hoặc một ca e2e `asExe`: `dispatchEvent(new MouseEvent('contextmenu', …))` lên checkbox / radio → `defaultPrevented` true, lên textarea → false. ≈ 15 dòng test, 0 dòng SP.

### CL2-D2 — Câu hướng dẫn mới của hộp 9b cho người hỗ trợ ("Bỏ nhân sự này khỏi người phối hợp … của các lịch đó trước") không làm được với lịch Dời lịch và lịch Dự kiến: 7 / 7 người hỗ trợ trên dữ liệu tải phối hợp lịch Dời lịch

```
ID: CL2-D2
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/team/PersonDialogs.tsx:198-200 (câu person.inUseSupportHelp khi coordinating + reviewing > 0); apps/desktop/src/i18n/vi.ts:1153-1154; apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:555 (EDITABLE = MET / CANCELLED / NO_SHOW: chỉ các lịch này có 6f, nơi duy nhất sửa người phối hợp), :631-647 (lịch SCHEDULED: Ghi kết quả / Dời lịch / Xóa; lịch RESCHEDULED: không nút nào); apps/desktop/src/routes/appointments/RescheduleDialog.tsx:13 (lịch mới giữ người phối hợp); packages/db/src/team.ts:256-264 (coordinatesLiveAppointment: mọi lịch chưa xóa) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-26 · mới do đợt sửa (PR #636; chữ theo Issue #602 mục 1 "bỏ họ khỏi các lịch đó trước")
Kịch bản: K5
```

- **Mô tả:** khi người hỗ trợ (IS / TL / BD / BDM) còn là người phối hợp, hộp 9b nay hiện "Bỏ nhân sự này khỏi người phối hợp và người đánh giá kết quả của các lịch đó trước, hoặc giữ lại thay vì xóa.". App chỉ cho đổi người phối hợp ở hộp Sửa kết quả 6f (lịch Đã gặp / Hủy / Không đến). Lịch **Dời lịch** không sửa được, không xóa được (quyết định Owner K6 của `known.md`), nên người phối hợp của nó không bao giờ gỡ được. Lịch **Dự kiến** chỉ gỡ được bằng cách xóa cả lịch. Hộp chỉ có số đếm, màn Lịch hẹn không lọc được theo người phối hợp, nên người dùng không biết lịch nào cần gỡ. Lệnh đếm mọi lịch chưa xóa, kể cả lịch Dời lịch.
- **Tái hiện / bằng chứng:** `node D\p01-team.mjs` (log `D\p01-team.log`; dữ liệu tải nhập qua `openAppData` → `readBackup` / `importBackup`, đọc bằng `app.tables()` như TeamScreen): `B support people (IS / TL / BD / BDM) 7`, `… of them coordinating a RESCHEDULED appointment (no way to take them off) 7`; ví dụ `IS Võ Văn Quang {"coordinating":369,"editable in 6f":320,"RESCHEDULED: no edit, no Xóa":25,"SCHEDULED planned: Xóa only":24}`, `TL Huỳnh Thu An {… "RESCHEDULED: no edit, no Xóa":2 …}`. Phần đánh giá kết quả thì làm được: ca A, IS chỉ là người đánh giá → 6f bỏ người đánh giá → `personUsage` về 0, lệnh xóa được (`"would delete"`).
- **Ảnh hưởng:** người quản lý làm theo câu hướng dẫn để xóa một người hỗ trợ cũ, không làm được (không có nút, không danh sách lịch), dù đã sửa hết các lịch có kết quả. Không sai dữ liệu: vế "giữ lại thay vì xóa" vẫn đúng. Chỉ sai hướng dẫn → Low.
- **Đề xuất:** Owner chọn chữ (chữ của Issue #602): vd. "Nhân sự này còn là người phối hợp của lịch đã dời hoặc lịch dự kiến, không gỡ được: giữ lại thay vì xóa; người đánh giá kết quả bỏ được ở Sửa kết quả." Chỉ hiện vế "bỏ khỏi người đánh giá" khi `reviewing > 0`. ≈ 5 dòng (`vi.ts`, `PersonDialogs.tsx`). Hoặc cho đổi người phối hợp của lịch Dự kiến / Dời lịch: tính năng mới, cần G1 / G3.

### CL2-D3 — Đổi màn giữ vị trí cuộn của màn trước: mở hồ sơ KH từ bảng Khách hàng đã cuộn, hồ sơ hiện từ giữa (tên KH, các nút ở trên khung nhìn)

```
ID: CL2-D3
Mức: Low
Trục: E, A
Vị trí: apps/desktop/src/shell/AppShell.tsx:19-42 (useScreenFocus: đổi route chỉ focus h1 với preventScroll, :39, không đưa trang về đầu); apps/desktop/src/shell/useRoute.ts:23-26, :34-45 (route theo hashchange, cùng một document) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-35 (biến thể: phần nhìn thấy của "đổi màn") · có từ trước, lượt 1 bỏ sót
Kịch bản: K3
```

- **Mô tả:** màn đổi theo hash trong cùng một trang, nên trình duyệt giữ `scrollY` của màn trước, chỉ kẹp lại khi màn mới ngắn hơn. Màn mới cao hơn khung nhìn thì mở ra ở giữa. DR6-35 chỉ làm phần focus (`h1` trong header `sticky`, `preventScroll`) và `document.title`.
- **Tái hiện / bằng chứng:** `node D\p04b-scroll.mjs` (bản web ở SHA ghim `D\dist-base`, Edge 1 440 × 900, log `D\p04b-scroll.log`): Khách hàng → Bảng, cuộn tới cuối `{"scrollY":3312,"height":4212}` → bấm tên KH dòng cuối → hồ sơ `{"scrollY":417,"height":1358,"firstLineInView":false}`. `p04-web-ui.mjs` S1 lặp lại cùng số: phần tử tên KH (`#customer-name`) ra ngoài khung nhìn (`false`), trong khi focus ở `H1 Hồ sơ khách hàng`. Sidebar Tổng quan (đã cuộn 134) → Lịch hẹn: `{"scrollY":105,"height":5463,"firstLineInView":false}`. Màn mới ngắn hơn cửa sổ thì về 0.
- **Ảnh hưởng:** RE mở hồ sơ từ bảng Khách hàng dài (1 496 KH trên dữ liệu tải, "Hiện thêm") thấy giữa hồ sơ: không thấy tên, nhóm, "← Khách hàng", **Sửa hồ sơ** / **+ Ghi chú KYC**, phải cuộn lên. Người dùng bàn phím thì focus đã ở `h1` (DR6-35) nhưng khung nhìn không theo. Không sai dữ liệu → Low.
- **Đề xuất:** trong `useScreenFocus`, khi route đổi và không phải về Khách hàng có thẻ để focus (`seen`), `window.scrollTo(0, 0)` trước khi focus `h1`; thêm vào e2e DR6-35 một kiểm `scrollY === 0` sau khi mở hồ sơ từ bảng đã cuộn. ≈ 3 dòng SP + 5 dòng e2e.

### CL2-D4 — Dòng đọc lại tiền KYC đọc chữ chưa chuẩn hóa: "6" + U+200B + "tỷ" không có dòng đọc lại, nhưng lưu thành "6tỷ" (chữ `parseVnd` đọc được)

```
ID: CL2-D4
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/routes/customers/KycDialogs.tsx:149 (kycAmountRead(field, value.text): chữ thô); apps/desktop/src/routes/customers/kyc-view.ts:125-132; packages/domain/src/money.ts:64-72 (parseVnd: NFC + trim, không bỏ \p{Cf}) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-27, K20 ("cùng một hàm ở lệnh, nhập backup và UI") · mới do đợt sửa (PR #623)
Kịch bản: K4
```

- **Mô tả:** lệnh lưu giá trị KYC qua `normalizeKycValue` (bỏ `\p{Cf}`, gộp khoảng trắng). Dòng đọc lại của 7b / 7c / 3f thì gọi `parseVnd` trên chữ đang gõ. Chữ có ký tự vô hình (dán từ nguồn khác) không có dòng đọc lại ("không hiểu"), dù giá trị lưu xong là chữ đọc được.
- **Tái hiện / bằng chứng:** `node D\p02-kyc-view.mjs` (log `D\p02-kyc-view.log`): `annualIncome "6​tỷ" {"read":null,"parseVnd":"format","stored":"6tỷ"}`, so `annualIncome "6tỷ" {"read":"6.000.000.000 ₫ (6 tỷ)", …}`. NBSP / U+3000 thì đọc được (`\s`), chữ số toàn khổ "６ tỷ" thì cả hai cùng không đọc (đúng).
- **Ảnh hưởng:** chỉ một dòng đọc lại thiếu ở ca dán chữ có ký tự vô hình; không sai dữ liệu (giá trị lưu dạng chữ, K21).
- **Đề xuất:** `kycAmountRead(field, normalizeText(value.text))`, hoặc gọi trên `normalizeKycValue` như lệnh. 1 dòng + 1 ca `kyc-view.test.ts`.

### CL2-D5 — Ba phần của DR6-33 không test nào giữ: hai hộp Xóa khóa nút lại sau lỗi thử lại được, khung lỗi lưu 7a không mất khi gõ — vitest và cả bộ e2e vẫn xanh

```
ID: CL2-D5
Mức: Low
Trục: T
Vị trí: apps/desktop/src/routes/team/TeamDialogs.tsx:69-77, :87 (final = !retriesDelete); apps/desktop/src/routes/team/PersonDialogs.tsx:146-154, :165; apps/desktop/src/routes/customers/KycDialogs.tsx:287-290, :301-304 (gõ ghi chú / ngày xóa errors.form) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-33 · mới do đợt sửa (PR #636: "Lỗi lưu của 7a (errors.form) và lỗi khóa ghi S2-2 ở hai hộp Xóa không có e2e")
Kịch bản: K8
```

- **Mô tả:** test của #636 chỉ giữ hàm thuần `retriesDelete` (`team-view.test.ts`) và hai phần có e2e (ô Ngày 7a, Giới tính 5c). Hai hộp Xóa thôi dùng hàm đó (về `disabled={error !== undefined}` như trước), hoặc 7a thôi xóa khung lỗi lưu khi gõ: vitest và **cả bộ e2e** đều xanh. PR nói các đường này "chỉ tới được khi đang Nạp lại / Nhập backup". Không đúng với 7a: một ghi chú có ký tự hỏng (nửa surrogate, như chữ dán vào) qua được kiểm rỗng của hộp (`normalizeNote`), rồi lệnh từ chối `INVALID_TEXT` → khung đỏ của `errors.form` hiện ở thao tác thường.
- **Tái hiện / bằng chứng:** đột biến trên bản dựng ngoài repo, cả bộ e2e (`D\e2e-full.mjs`, `D\e2e-full.log`): `R33c SURVIVED`, `R33d SURVIVED`, `R33e SURVIVED` (chỉ `theme.spec.ts:48` đỏ, lỗi của bộ chạy, đỏ cả trên bản ghim). Cùng ba bản, `D\p06-forms.mjs` (Edge, exe giả) phân biệt được ngay: bản ghim — 7a sau Lưu `["Chữ có ký tự không lưu được (ký tự NUL hoặc ký tự hỏng khi dán)…"]`, gõ tiếp → `[]`; Xóa nhân sự / Xóa team bị `DATA_REPLACING` → `Xóa enabled true`. R33e → gõ tiếp vẫn còn khung đỏ; R33d → `Xóa nhân sự … enabled false`; R33c → `Xóa team … enabled false` (`D\p06-forms-{base,R33c,R33d,R33e}.log`).
- **Ảnh hưởng:** sửa sau này làm hỏng lại ba phần của DR6-33 mà CI không báo. Hành vi hiện tại đúng.
- **Đề xuất:** thêm vào `customer-kyc.spec.ts` một ca 7a: đặt ghi chú có `\uD83D` lẻ (setter của `HTMLTextAreaElement` + sự kiện `input`, như `p06-forms.mjs`), Lưu → `role=alert`, gõ một chữ → hết. Thêm vào `team.spec.ts` một ca `asExe`: `exe.holdBackup()` → Nạp lại → đổi hash sang Team (như `p06-forms.mjs` F2) → Xóa nhân sự / Xóa team → nút vẫn bật. ≈ 40 dòng e2e, 0 dòng SP.

### CL2-D6 — Hành vi mới của đợt sửa gói D chưa có trong danh mục nghiệm thu v1.0: chặn Back / Forward trên exe (NT-EX-05 chỉ F5, Ctrl+R), dòng báo KH ngoài góc nhìn, hộp 9b của người hỗ trợ

```
ID: CL2-D6
Mức: Nit
Trục: C
Vị trí: docs/testing/nghiem-thu-v1.md:327 (NT-EX-05 "Trong app bấm F5, Ctrl+R"), :257 (NT-TM-10 chỉ ca RE), :152-166 (NT-KH-01…15: không dòng cho KH tạo ngoài góc nhìn; NT-LH-20 có cho Lịch hẹn) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-34, DR6-31, DR6-26 · mới do đợt sửa (PR #638, #636); sổ review #638: "thêm vào lượt thử tay G7: … Alt+←, Alt+→, nút chuột 4 / 5, phím Back / Forward"
```

- **Mô tả:** đợt sửa thêm ba hành vi người dùng thấy mà danh mục nghiệm thu không kiểm: (1) exe chặn Back / Forward (DR6-34) — ghi chú review #638 dặn đưa vào lượt thử tay G7 nhưng NT-EX-05 vẫn chỉ "F5, Ctrl+R"; (2) dòng "Đã tạo KH … nằm ngoài góc nhìn…" + điền sẵn RE (DR6-31) — PR #636 tự ghi "Không thêm dòng nghiệm thu … lượt 2 cân nhắc thêm NT-KH-…"; (3) hộp 9b của IS / TL / BD / BDM: dòng "n lịch hẹn là người đánh giá kết quả", câu hướng dẫn riêng (DR6-26) — NT-TM-10 chỉ có ca RE. Mockup `team.html` 9b, `customers.html` cũng không có (2), (3), nên G7 không đối chiếu được ở đâu.
- **Tái hiện / bằng chứng:** `grep -n -i "lùi\|nút chuột\|BrowserBack\|Alt+" docs/testing/nghiem-thu-v1.md` rỗng; `grep -n "người đánh giá\|ngoài góc nhìn"` chỉ ra NT-LH-20 (Lịch hẹn). Ba hành vi đều chạy đúng ở lượt này (bảng R: DR6-34 trên exe với input thật, DR6-31 `p04` S2, DR6-26 `p01`).
- **Ảnh hưởng:** G7 không kiểm lại ba hành vi trên exe phát hành; DR6-34 là phần chỉ exe mới có (bản web không chặn). Chỉ tài liệu.
- **Đề xuất:** PR docs: NT-EX-05 thêm "nút chuột Back / Forward, Alt+← / Alt+→, phím Back / Forward khi hộp 7a đang có chữ → hộp còn, chữ còn, màn không đổi"; NT-KH-… theo mẫu NT-LH-20; NT-TM-… "IS chỉ là người đánh giá kết quả → Xóa tắt, dòng người đánh giá". Không đổi code.

### CL2-D7 — Hồ sơ ba cột ở cửa sổ mặc định: một link dán vào ghi chú KYC tràn sang cột KYC Intelligence (cột giữa hẹp 572 → 376 px, chữ không được ngắt)

```
ID: CL2-D7
Mức: Low
Trục: E, C
Vị trí: apps/desktop/src/routes/customers/CustomerProfile.tsx:159 (lg:grid-cols-2 wide:grid-cols-3), :177 (cột giữa: Dòng thời gian, không min-w-0); apps/desktop/src/routes/customers/KycExtraction.tsx:105-106 (chữ ghi chú `whitespace-pre-line`, không ngắt từ dài); apps/desktop/src/routes/customers/CustomerKyc.tsx:82-101 (dòng dữ kiện, cùng kiểu) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-30 · mới do đợt sửa (PR #623) ở cửa sổ 1 440: cùng chữ, bố cục hai cột cũ không tràn; gốc (không `overflow-wrap`) có từ trước
Kịch bản: K13
```

- **Mô tả:** không chỗ nào ở `routes/customers`, `routes/team`, `packages/ui/src/components` đặt `break-words` / `overflow-wrap` (`grep` rỗng). Một chuỗi liền dài hơn bề rộng cột vẫn nằm trên một dòng và tràn ra ngoài cột. Ba cột ở 1 440 làm mỗi cột còn 376 px, nên một link thường gặp (link Facebook / Zalo có tham số, ≈ 50+ ký tự liền) đã đủ tràn.
- **Tái hiện / bằng chứng:** `node D\p10c-text-overflow.mjs` (Edge 1 440 × 900; ghi chú KYC "Khách gửi link https://www.facebook.com/profile.php?id=100089123456789&mibextid=ZbWKwL_nguyen_van_khach_hang_rat_dai để xem thêm", 108 ký tự, đoạn liền dài nhất 66; đo `Range` của từng nút chữ so với cột chứa nó; log `D\p10c-text-overflow.log`): bản ghim `cols "376px 376px 376px"` → chữ ghi chú `right 1152 > column 1024`, **tràn 128 px** sang cột KYC Intelligence. Cùng thao tác trên bản dựng R30a (lớp `2xl:` của trước DR6-30, 2 cột ở 1 440) → `found: []`. Ảnh `D\p10-1440.png` (đuôi link đè lên vùng cột phải) và `D\p10-1440-R30a.png`. Với một giá trị dữ kiện KYC liền 80 ký tự (`p10-long-text.mjs`), dòng dữ kiện tràn ở cả hai bố cục, mã F / ngày bị đẩy ra ngoài thẻ. Ở 1 100 thì cả trang cuộn ngang (`pageScrollsSideways: true`) ở cả hai bản.
- **Ảnh hưởng:** RE dán link hồ sơ mạng xã hội của KH vào ghi chú KYC (thao tác bình thường) → ở cửa sổ mặc định, chữ ghi chú đè lên panel KYC Intelligence. Chỉ hiển thị → Low.
- **Đề xuất:** thêm `min-w-0` cho ba cột của lưới hồ sơ, `[overflow-wrap:anywhere]` (hoặc `break-words`) cho chữ ghi chú (`KycExtraction.tsx:105`) và dòng dữ kiện (`CustomerKyc.tsx:88-98`); có thể cả các ô `note` của dòng thời gian. Lớp Tailwind có sẵn, không cần token mới. ≈ 3–5 dòng + một kiểm e2e 1 440 (như `customer-kyc.spec.ts:20`) với ghi chú có link dài.

### CL2-D8 — Cột nút của hai bảng gói D có tiêu đề cột rỗng, trong khi `DataTable` đã có `headerHidden` cho đúng việc này (DR6-43 dùng ở Thùng rác)

```
ID: CL2-D8
Mức: Nit
Trục: A
Vị trí: apps/desktop/src/routes/customers/CustomerAppointments.tsx:107-118 (cột 'next', header: ''); apps/desktop/src/routes/team/TeamScreen.tsx:89-97 (cột 'actions', header: ''); packages/ui/src/components/DataTable.tsx:20-21, :181-182 (headerHidden → tiêu đề chỉ cho trình đọc màn hình) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-43 (biến thể ở gói D) · có từ trước, lượt 1 bỏ sót; prop `headerHidden` mới ở PR #630
```

- **Mô tả:** cột nút "Hẹn tiếp" của thẻ Lịch hẹn trong hồ sơ và cột nút "Sửa" của bảng thành viên team là `<th>` rỗng. Nút có `aria-label` riêng nên dùng được. Nhưng trình đọc màn hình đọc tiêu đề cột rỗng khi đi theo bảng. PR #630 thêm `headerHidden` + khóa `trash.col.actions` ("Thao tác") cho đúng tình huống này ở Thùng rác (DR6-43), hai bảng này chưa dùng.
- **Tái hiện / bằng chứng:** `node D\p11-headers.mjs` (bản web ghim, log `D\p11-headers.log`): hồ sơ, bảng "Lịch hẹn" — `columnheader` = `["NGÀY ↓","KẾT QUẢ ↕","GHI CHÚ ↕",""]`; bảng thành viên team — ô cuối `{"text":"","name":null}`.
- **Ảnh hưởng:** chỉ trình đọc màn hình; không sai dữ liệu.
- **Đề xuất:** `header: t('trash.col.actions'), headerHidden: true` (hoặc một khóa chung "Thao tác") ở hai cột. 2 dòng.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc | Trên | Kết quả | ID |
|---|---|---|---|
| `pnpm exec tsc -p packages/ui/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters`, cùng lệnh cho `apps/desktop/tsconfig.json` (log `D\tsc-unused-ui.log`, `tsc-unused-app.log`) | `packages/ui`, app (gồm shell, i18n, customers, team) | exit 0 / exit 0, 0 dòng (hai cờ vốn bật ở `tsconfig.base.json`) | — |
| `node D\r1-exports.mjs` (scanner lượt 1 Home PC, `git show HEAD:` từng file; log `D\exports.log`) | 51 file SP `.ts/.tsx` của gói D | Không export chạy thật nào chết. Export mới của đợt sửa đều có nơi dùng: `stageSince`, `kanbanColumn` (hồ sơ, Khách hàng), `kycAmountRead`, `currentFactRecords`, `stageCause`, `retriesDelete` (2 hộp), `ALERT` (Khách hàng dùng lại). Chỉ test dùng: `PLAIN_SLOTS` (KNOWN DR6-66); `SaveFailed` (`SaveWarning.tsx`, #620) export để `SaveWarning.test.tsx` dùng, cũng dùng trong file — cùng loại DR6-66, không ghi riêng. 15 kiểu chỉ dùng trong file (không tốn gì lúc chạy) | — |
| Khóa i18n: `node D\r1-keys.mjs` (log `D\keys.log`) | `vi.ts` ↔ `apps/desktop/src` | 1 113 khóa (lượt 1: 1 080; +33, gồm 11 khóa của gói D: `sep.semicolon`, `timeline.rf` / `noRf`, `kycNote.currentValue` / `amountRead`, `customers.createdOutside` / `createdProfile`, `customerForm.handover`, `person.inUseReviewing` / `inUseSupportHelp`, `error.INVALID_CHOICE`): 897 viết thẳng + 216 dựng động, **0 khóa không dùng, 0 khóa chỉ test dùng**. `birth.error.empty` vẫn không tới được (KNOWN DR6-66) | — |
| Slot i18n: `node D\r1-slots.mjs` (log `D\slots.log`) | 907 lời gọi `t()` tĩnh | 0 thiếu slot ngoài 4 khuôn cố ý như lượt 1 (`aiPanel.evidence`, `copyFixHelp`, `period.monthLabel` / `yearLabel`) | — |
| Code lặp của đợt sửa (đọc diff) | gói D | Mẫu "bộ đếm + `useEffect` dời focus" ×2 (`DataTable` `allShown`, `CustomersScreen` `toTable`); `try { preview } catch (DbError)` ×2 (`useKycPreview`, `useHandover`); khuôn chữ `'{amount} ({compact})'` ×3 khóa (`kycNote.amountRead`, `outcome.caseSizeRead`, `policyForm.fypRead`) — chưa tới 3 nơi cùng code, hoặc là chữ i18n trùng (lượt 1: 58–60 cặp, không gộp); `PersonDialogs.tsx:9` vẫn tự khai `ALERT` (KNOWN DR6-67) | — |
| Prop thừa / thiếu | `DataTable` | `headerHidden` (mới, #630) chỉ Thùng rác dùng; hai bảng của gói D nên dùng mà chưa dùng | CL2-D8 |
| Bundle (`common\baseline.md`, bản dựng ở `Project-2C-review`) | toàn app | `index.js` 909 669 B (+17 727 so nền, gồm mọi PR sửa), `index.css` 28 390 B (+26: hai lớp `wide:` của DR6-30). Không tách được phần gói D theo module khi chưa có visualizer (G4) | — |
| `pnpm lint:deps`, `pnpm codemap` | `common\baseline.md` (`pnpm verify` xanh ở SHA ghim) | `lint:deps` 0 vi phạm (315 module); bản đồ export trong `CLAUDE.md` khớp code — không chạy lại | — |
| Đề xuất refactor | — | Không có đề xuất mới ngoài DR6-66 / 67 (KNOWN, hoãn). Hai mẫu ×2 ở trên: chỉ gộp nếu có nơi thứ ba | — |

### 6.2 Hiệu năng

Máy: Home PC `DESKTOP-KDURKJP` (i9-12900K), Node v24.20.0. Lúc đo song song: phiên Codex (2 tiến trình `codex`, gói của bên đó), ≈ 19 `node`, Edge của Owner; không đo trên exe (không cần: các thao tác của gói D trong probe `e2e/perf` đều đã ở `baseline.md`). Dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (hash §L2.6).

**Hàm thuần + lệnh đọc mà màn gói D gọi** (`node D\p03-perf.mjs` = probe lượt 1 Home PC `p2-perf.mjs` chạy lại + phần mới; 12:43 17/10; log `D\p03-perf.log`; `importBackup` 861 ms; 1 481 KH sống, 10 338 lịch, 1 679 HĐ, 4 935 chuyển nhóm, 51 nhân sự). Trung vị, n = 7 / 20 / 200. Cột lượt 1: `raw/…/home-pc/claude/D.md` §4b (cùng máy, 14/10). Luật nhiễu: xấu hơn khi > 20 % **và** > 10 ms.

| Thao tác (màn gói D) | Lượt 2 | Lượt 1 Home PC | Δ | Ngưỡng | ID |
|---|---:|---:|---|---|---|
| `readTables` appointments (lần đọc đầu mỗi revision) | 45,08 ms | 45,06 ms | 0 | (một phần của màn < 200) | — |
| Khách hàng sau một lần lưu: đọc lại customers + people + transitions + policies | 22,61 ms | 22,51 ms | 0 | < 200 | — |
| `customerBoard` Toàn bộ / Team + RE dải | 1,37 / 0,59 ms | 1,40 / 0,67 ms | −2 % / −12 % | < 200 | — |
| `staffMetrics` (44 RE) | 5,94 ms | 5,92 ms | 0 | < 200 | — |
| `personUsage` một người (9b; nay thêm `reviewing`) | 0,23 ms | 0,19 ms | +0,04 ms (dưới 10 ms) | < 200 | — |
| `readProfile` (useQuery hồ sơ) KH thường / KH nhiều lịch nhất | 6,95 / 6,89 ms | 8,31 / 8,48 ms | −16 % / −19 % | < 200 | — |
| `countCustomerRecords` (hộp 5f) | **0,11 ms** | 2,01 ms | −95 % (chỉ mục `customer_id` của DR6-44) | < 200 | — |
| `previewCustomerProfile` mỗi phím 5c / `previewKycNote` mỗi render 7a | 0,16 / 0,01 ms | 0,16 / 0,01 ms | 0 | < 200 | — |
| **mới:** `previewHandover` mỗi render 5c | 0,06 ms | — | — | < 200 | — |
| **mới:** `stageSince` (mọi chuyển nhóm) / `kanbanColumn` ×4 / `stageCause` (mọi chuyển nhóm) / `kycAmountRead` một phím | 0,07 / 0,00 / 0,07 / 0,00 ms | — | — | < 200 | — |

**Trên màn** (bản web `D\dist-real`, Edge headless 1 440 × 900, sau Cài đặt → Dữ liệu → Nhập backup dữ liệu tải; đo từ thao tác tới khi DOM có kết quả, dò bằng `MessageChannel`, không gồm vẽ — cùng cách `p4-web-perf.js` lượt 1, nhưng lượt 1 chạy trong khung trình duyệt ẩn của Claude Code, lượt này Edge headless: chỉ so thô; `node D\p08-web-perf.mjs 4415`, 12:46, log `D\p08-web-perf.log`). Đọc file → hộp 10c 893 ms, Thay dữ liệu 49 ms (lượt 1: 995 / 54 ms).

| Thao tác (bản web, dữ liệu tải) | n | Lượt 2 trung vị (min–max) | Lượt 1 Home PC | Ngưỡng | ID |
|---|---:|---|---|---|---|
| Thẻ kanban → hồ sơ | 6 | 17,6 ms (17,4–35,0) | 15,1 ms | < 200 ✅ | — |
| 5c mở hộp / một phím Họ tên / **chọn RE khác (khung "Khi lưu…")** / Hủy | 6 | 5,5 / 0,9 / **1,2** / 2,0 ms | 9,0 / 0,6 / — / 3,1 ms | < 200 ✅ | — |
| 7a mở hộp / chọn Trường / **một phím ô Giá trị (đọc lại tiền)** / Lưu ghi chú | 6 | 2,7 / 0,6 / **0,3** / 14,1 ms | 12,7 / 0,4 / — / 24,4 ms | < 200 ✅ | — |
| Hồ sơ → "← Khách hàng" sau một lần ghi (đọc lại bảng; **focus thẻ vừa xem**) | 6 | 32,7 ms (31,8–40,6) | 33,5 ms | < 200 ✅ | — |
| **"+ n KH · xem dạng bảng" → bảng có focus** / Bảng → Kanban | 6 | 13,2 / 2,8 ms | — / 1,0 ms | < 200 ✅ | — |
| → Team & nhân sự (sidebar) / Sửa → Xóa nhân sự (9b) / → Khách hàng (sidebar) | 6 | 8,6 (8,1–75,8) / 3,5 / 5,8 ms | — / 3,2 / — ms | < 200 ✅ | — |

Không có phát hiện P ở gói D: mọi thao tác màn của gói D trên dữ liệu tải ≤ 35 ms trung vị (max 75,8 ms một lần), mọi phép thuần ≤ 45 ms (lần đọc bảng `appointments` mỗi revision, như lượt 1); phần đợt sửa thêm vào (khung 5c, đọc lại tiền, `stageSince`, focus) mỗi cái ≤ 1,2 ms. `countCustomerRecords` nhanh ×18 nhờ chỉ mục của DR6-44 (hành vi không đổi: gói A so kết quả trước / sau). Sáu `reload.*` của exe chậm hơn lượt 1 (+62–67 ms, `baseline.md`): gói B đã quy cho `quick_check` của DR6-06 (CL2-B7), không đo lại.

## 7. Bảng đếm mức × trục

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | | 0 |
| Low | | CL2-D3*, CL2-D7* | CL2-D2 | | | | | | CL2-D1, CL2-D5 | | 5 |
| Nit | | | CL2-D4, CL2-D6 | | | | | | | CL2-D8 | 3 |

\* gắn hai trục, đếm một lần ở trục chính: CL2-D3 E (+ A), CL2-D7 E (+ C). **8 phát hiện mới, 8 / 8 CONFIRMED** (chạy probe / đột biến / e2e thật, lệnh và trích kết quả ở từng mục), 0 PLAUSIBLE, 0 KNOWN có bằng chứng mới. Trục R (bảng R): **12 ĐÃ SỬA · 1 SỬA MỘT PHẦN (DR6-62 → CL2-D1)** · 0 CHƯA SỬA · 0 HỒI QUY. Phát hiện "mới do đợt sửa": CL2-D2 (#636), CL2-D4 (#623), CL2-D5 (#636), CL2-D6 (#636, #638), CL2-D7 (#623); có từ trước, lượt 1 bỏ sót: CL2-D1 (phần BR3 Issue #606 không gồm), CL2-D3, CL2-D8.

## 8. Đã xét, không thấy

- **R — đã sửa.** Bảng R: 13 DR6, 39 đột biến "gỡ phần sửa" / áp lại; DR6-34 thêm exe thật với input thật (K1), DR6-30 đo trên exe (K2). Hai mục "ghi lệch đã biết" của gói D (DR6-29 ô Kỳ, DR6-36): dòng có ở `nghiem-thu-v1.md:387-391`, khớp app (`p04` S5). Không HỒI QUY: e2e 7 spec của gói D trên bản ghim 68 / 68 (`e2e-base.log`); cả bộ ở SHA ghim 227 / 227 (`baseline.md`, `pnpm e2e` của bước chuẩn bị); bốn lần chạy cả bộ (217 ca) trên bản đột biến chỉ đỏ đúng ca của đột biến cộng `theme.spec.ts:48` (đỏ cả trên bản ghim với bộ chạy này vì cổng `127.0.0.1`); mọi probe không có lỗi trang.
- **E — biên.** K1, K3, K4, K9, K13, K15, K16 (ngoài CL2-D3, CL2-D4, CL2-D7, không thấy gì). Backspace trong ô chữ trên exe chỉ xóa chữ. Alt+← / Alt+→ chặn ở mọi phần tử, kể cả ô chữ (Windows không dùng Alt+mũi tên để sửa chữ). Góc nhìn trỏ RE ở dải: điền sẵn đúng. `parseBirthDate` / `parseRecordDate` / `allowedStages` / `parseHash` không đổi từ `8855345` (`git diff` rỗng ở các hàm, chỉ thêm `stageSince` / `kanbanColumn`); lượt 1 đã thử biên (29/02, 1899 / 2100, năm 2 số…). Đóng cửa sổ exe khi hộp đang có chữ vẫn bỏ bản nháp không hỏi (CloseGuard chỉ hỏi khi lưu lỗi, T-057): hành vi đã chốt, không ghi.
- **C — hợp đồng / mockup / nhãn.** Chữ mới của đợt sửa so `vi.ts` ↔ màn (`p04`, `p09`); "lịch hẹn Dự kiến" của 5c = định nghĩa màn Lịch hẹn (`statusLabel` / `appointmentGroup`, ngày ≥ hôm nay) và điều kiện của lệnh (`plannedOff`); "tính 1 RF" của dòng thời gian = 5f = chỉ số (K6); mã F 7d = thẻ KYC (K7); NT-KH-09, NT-HS-05 / 08 / 11 khớp app; dòng báo ngoài góc nhìn đúng câu NT-LH-20 kiểu Lịch hẹn. Ngoài CL2-D2, CL2-D4, CL2-D6, không thấy gì.
- **D — dữ liệu.** Mọi lệnh ghi của gói D qua `app.run` / `data.run` (11 chỗ ở `CustomerDialogs`, `KycDialogs`, `PersonDialogs`, `TeamDialogs`, `git grep`), nên vào khóa ghi S-2 và hàng lưu. `useDatabase()` chỉ ở hai bản xem trước của 5c (`useKycPreview`, `useHandover`, `CustomerDialogs.tsx:126, :139`), chỉ đọc. Hộp 5a / 5c gửi tên đã `normalizeText` (K20), 7a gửi `normalizeNote`. Chuỗi K11, K12, K16 giữ số khớp giữa 9b, cột Team, Khách hàng, Thùng rác; backup xuất ra đọc lại được sau chuỗi.
- **G — guardrail AI.** Chỗ gói D chạm AI: `ConfirmFactDialog` (3f) nay có dòng đọc lại tiền (chỉ hiển thị); lưu vẫn qua `confirmKycFact` / `markKycConflict` có `noteId`, không tự ghi. Phần còn lại: gói C.
- **S — ranh giới.** `git grep "dangerouslySetInnerHTML\|innerHTML\|eval(\|new Function\|target=\"_blank\"\|window.open"` ở `shell`, `routes/customers`, `routes/team`, `i18n`, `packages/ui/src`, `main.tsx`, `App.tsx` (không tính test): rỗng. Tên KH / RE trong dòng báo mới hiện qua React (`t()` điền slot một lượt). Link mới đều là hash nội bộ (`routeToHash`). Chạy exe K1: 0 request ra ngoài (`requests aborted (not local): []`). Chặn menu chuột phải: đúng, chỉ test hở (CL2-D1).
- **P — hiệu năng.** Mục 6.2: không có thao tác nào gần 200 ms.
- **B — bloat.** Mục 6.1.
- **T — test.** 39 đột biến (mục 9.2): 35 bị giết (14 vitest, 21 e2e), 4 sống → CL2-D1, CL2-D5. X5 ở đúng chỗ lượt 1 (hồ sơ) **bị e2e giết** (`customer-forms.spec.ts:134` kiểm "từ 11/09/2026"), khác câu "chỉ giữ bằng đọc code" của PR #644. Test của gói D không phụ thuộc giờ máy (lượt 1 đã quét; diff test lượt này dùng ngày ghim `day(…)`).
- **A — trợ năng / i18n.** Tương phản chữ mới ≥ 6,17:1 (K14). Focus khi đổi màn / sau nút tự gỡ: e2e + K10, K16. `role="status"` của khung 5c và dòng báo ngoài góc nhìn được chèn cùng lúc với nội dung (vùng live mới), nên trình đọc màn hình có thể không đọc. Đây là cách app làm ở mọi chỗ (khung "Khi lưu, app tự ghi vào KYC" 5c, NT-LH-20 của Lịch hẹn), chưa có trình đọc màn hình để thử, nên không ghi. i18n: 0 khóa thừa, 0 thiếu slot ngoài khuôn cố ý (mục 6.1). Ngoài CL2-D3, CL2-D8, không thấy gì.

## 9. Phụ lục

### 9.1 Probe, log

Mọi file ở `C:\workspace\deep-review-1-6-r2\claude\D\`. Probe Node nạp TypeScript của repo qua `hooks.mjs` (chép từ `r2\claude\C\hooks.mjs`); probe trình duyệt dùng `browser.mjs` (chép từ `r2\claude\C\`: Edge, chặn mạng ngoài 127.0.0.1, thay `window.open` / clipboard, exe giả của `e2e/support.ts`). Không ghi gì vào repo.

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `list.mjs` | danh sách 74 file gói D theo `classifyFile` | `list.log` | mục 3 |
| `fix-diff.patch` | `git diff 8855345 4217ed4` trên 74 file | — | mục 3 |
| `mut.mjs`, `mut-list.mjs` | đột biến vitest (vá một file, `vitest run` / `vitest related`, trả nguyên byte, sha256) | `mut.log`, `mut-out\<id>.out`, `mut-results.json` | mục 2, 9.2 |
| `build-dist.mjs`, `serve-dist.mjs`, `pw.config.mjs` | dựng app ngoài repo (có / không đột biến), `vite preview` ở 127.0.0.1:441x, Playwright chạy `e2e/` của repo vào đó | — | mục 2, 4 |
| `e2e-mutants.mjs` | 24 đột biến TSX × 7 spec gói D (cổng 4412) | `e2e-mutants.log`, `mut-out\<id>.e2e.out`, `e2e-base.log` | mục 2 |
| `e2e-full.mjs` | cả bộ e2e cho 4 đột biến sống 7 spec (cổng 4413) | `e2e-full.log`, `mut-out\<id>.e2e-full.out`, `e2e-base-theme.log` | mục 2, CL2-D5 |
| `p01-team.mjs` | DR6-26: ca A probe lượt 1 + dữ liệu tải; người phối hợp của người hỗ trợ theo trạng thái lịch | `p01-team.log` | DR6-26, K5, CL2-D2 |
| `p02-kyc-view.mjs` | DR6-27 / 28 / 29: 36 chuỗi tiền; dòng thời gian ↔ 5f ↔ chỉ số; mã 7d ↔ thẻ | `p02-kyc-view.log` | K4, K6, K7, CL2-D4 |
| `p03-perf.mjs` | = `p2-perf.mjs` lượt 1 Home PC + phần mới | `p03-perf.log` | mục 6.2 |
| `p04-web-ui.mjs` | S1 cuộn, S2 ngoài góc nhìn, S3 focus / title, S4 đọc lại tiền / "Đang có", S5 lệch đã ghi | `p04-web-ui.log` | DR6-27, 31, 35, 36; K3, K9, K10 |
| `p04b-scroll.mjs` | vị trí cuộn sau mỗi đường đổi màn | `p04b-scroll.log` | K3, CL2-D3 |
| `p05-exe-back.mjs`, `sendinput.ps1` | exe ghim (cổng 9333) / Edge `--app` (9334), input `SendInput`; bố cục 1 440 trên exe; tiêu đề cửa sổ | `p05-exe-back-exe.log`, `-exe-forward.log`, `-edge.log`, `-edge-{kback,altleft,xforward,kforward}.log` | DR6-30, 34, 35; K1, K2, K10 |
| `p06-forms.mjs` | DR6-33: 7a `INVALID_TEXT`, Xóa nhân sự / team khi `DATA_REPLACING`; bản ghim + R33c / d / e (cổng 4414) | `p06-forms-{base,R33c,R33d,R33e}.log` | DR6-33, K8, CL2-D5 |
| `p07-chains.mjs` | chuỗi bàn giao → Team / 9b / Khách hàng; người đánh giá → Thùng rác | `p07-chains.log` | K11, K12 |
| `p08-web-perf.mjs` | thao tác màn gói D trên dữ liệu tải (bản `dist-real`, cổng 4415) | `p08-web-perf.log` | mục 6.2 |
| `p09-contrast.mjs` | tương phản chữ mới | `p09-contrast.log` | K14 |
| `p10-long-text.mjs`, `p10b-long-text-port.mjs`, `p10c-text-overflow.mjs` | chữ liền dài ở 1 440 / 1 100, bản ghim và R30a (cổng 4416) | `p10-long-text*.log`, `p10c-text-overflow.log`, `p10-1440*.png`, `p10-1100*.png` | K13, CL2-D7 |
| `p11-headers.mjs` | tiêu đề cột của bảng gói D | `p11-headers.log` | CL2-D8 |
| `p12-chain-ui.mjs` | chuỗi ngoài góc nhìn → lịch → 5c → về Khách hàng | `p12-chain-ui.log` | K16 |
| `r1-keys.mjs`, `r1-slots.mjs`, `r1-exports.mjs`, `r1-mocktext.mjs` | script lượt 1 Home PC (chép nguyên) | `keys.log`, `slots.log`, `exports.log` | mục 6.1 |
| `tsc-unused-ui.log`, `tsc-unused-app.log` | `tsc --noUnusedLocals --noUnusedParameters` | — | mục 6.1 |

Lần chạy lỗi của probe (lỗi probe, không phải sản phẩm): `p04` lần đầu (bấm cả dòng thay vì nút tên KH ở bảng Lịch hẹn); `p08` lần đầu (bản `dist-base` ghim ngày 15/09 nên dữ liệu tải mốc 12/10 bị luật nhập từ chối — dựng `dist-real` không ghim ngày); `p09` lần đầu (nhãn nút "Sửa {tên}"); `p10b` lần đầu (dấu nháy trong đường dẫn ảnh).

### 9.2 Đột biến (39)

- **KILLED bởi vitest (14):** X5, X6, D6, BR4, R26a, R27a, R28a, R29a, R33f, R34a, R34b, N34c, N34d, N34e (tên test đỏ: mục 2, `mut.log`).
- **SỐNG vitest, không phải TSX (1):** **BR3** (`block-reload.test.ts` 7 / 7) → CL2-D1.
- **TSX, vitest `related` không giết (24); e2e trên bản dựng ngoài repo:** KILLED bởi 7 spec gói D (20): X5p, R26b, R26c, R27b, R28b, R28c, R29b, R30a, R31a, R31b, R32a, R33a, R33b, R35a, R35b, R35c, R35d, R35e, N35f, R02d; KILLED bởi cả bộ (1): R29c (`appointment-outcome.spec.ts:61`); **SỐNG cả bộ (3): R33c, R33d, R33e** → CL2-D5.
- Mọi lượt: file vá được trả nguyên byte, sha256 = `git show HEAD:` (`build-dist.mjs`: "restored (sha256 = HEAD)" ở cả 24 bản), dòng cuối `mut.log`, `e2e-mutants.log`, `e2e-full.log`: `git status --short after: ""`.

### 9.3 Chạy ngoài repo, tác dụng phụ

- Cổng dùng: 4411 (bản ghim), 4412 (đột biến × 7 spec), 4413 (đột biến × cả bộ), 4414 (`p06` trên đột biến), 4415 (`dist-real`), 4416 (R30a); 9333 (CDP exe), 9334 (CDP Edge đối chứng). Không dùng 4173, không `PW_REUSE`. Cuối phiên không cổng nào trong 4410–4419, 9333, 9334 còn nghe; không còn `project2c.exe` hay Edge của probe.
- Exe: chạy 2 lần từ bản chép `D\exe\project2c.exe` (thư mục mới → seed demo, `D\exe\Project2C-data\`, 25 MB). Không phải đo hiệu năng; mỗi lần ≈ 30 s cửa sổ ở trước để nhận `SendInput`. Trước mỗi lần đã kiểm không có `project2c.exe` nào khác. WebView2 của exe dùng thư mục dữ liệu theo identifier của app, chung cho mọi bản chép exe trên máy, nên `p2c.lastRoute` (localStorage) đổi theo lần chạy của probe: exe mở sau có thể vào Khách hàng thay vì màn cuối của người dùng trước. Không ảnh hưởng dữ liệu, probe `e2e/perf` tự đổi màn.
- Edge `--app` (đối chứng K1) dùng hồ sơ riêng `D\edge-profile` (41 MB). Bản dựng `D\dist-*` (26 thư mục) và `D\pw-results` là đầu ra build / test, không phải bằng chứng ngoài log.
- Không gọi dịch vụ AI, không đọc key, không mở chatgpt.com: mọi log trình duyệt và exe ghi 0 request ra ngoài 127.0.0.1 / `*.localhost`.

### 9.4 Ranh giới đọc

Chỉ mở theo tên đầy đủ: `common\{plan.md,known.md,fixes.md,baseline.md,prompt-claude.md}`; báo cáo lượt 2 của Claude `claude\{A,B,C}.md`; công cụ lượt 2 của chính Claude ở `claude\C\` (`hooks.mjs`, `list.mjs`, `browser.mjs`, `build-dist.mjs`, `serve-dist.mjs`, `pw.config.mjs`, `mut.mjs`, `mut-list.mjs`, `p01-web-generation.mjs`, `p09-web-reload-panel.mjs`); probe lượt 1 của Claude trên máy này `deep-review-1-6\claude\D\{p1-person-delete.mjs,p2-perf.mjs,p4-web-perf.js,mutate.mjs,mocktext.mjs,keys.mjs,slots.mjs,exports.mjs}` (sau `Test-Path` từng tên). **Một lần liệt kê không đệ quy `deep-review-1-6-r2\claude\C\`** (thư mục gói C của chính Claude, để tìm công cụ dùng lại). Liệt kê thư mục `claude\D\` của phiên này. Không mở, không liệt kê, không tìm kiếm thư mục của bên khác (`…-r2\codex\`, `deep-review-1-6\codex\`, `…\muse\`) hay `C:\workspace\`, `deep-review-1-6\`, `deep-review-1-6-r2\` ở cấp gốc.

### 9.5 Cuối phiên

- `git status --short` cuối phiên (`C:\workspace\Project-2C-review`, 2026-10-17 12:56): rỗng (như đầu phiên); `git rev-parse HEAD` → `4217ed4cd3300af1d63aa61db9eb13902fe75f16`.
- Giờ xong: 2026-10-17 12:57 (+07, giờ máy).
