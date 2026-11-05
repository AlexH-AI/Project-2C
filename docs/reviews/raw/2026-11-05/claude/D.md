XONG — claude gói D lượt 5, 2026-11-05 00:48 (+07:00)

# Deep review Phase 1–6, lượt 5 — Claude, gói D (Màn nhập liệu)

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên | claude (ID `CLR5`) |
| Gói | D. Màn nhập liệu — `packages/ui/**` (trừ `scripts/`), `apps/desktop/src/{shell,i18n}/**`, `routes/customers/**` (trừ file AI và Hợp đồng), `routes/team/**`, `routes/Screen.tsx`, `routes/{classes,money-view}.ts`, `routes/stage-badge.tsx`, file gốc `apps/desktop/src/*`, `apps/desktop/index.html` |
| SHA đầu phiên | `37a80b662861d308a110d1e2b0f65ad13b91fb51` (`git rev-parse HEAD`, worktree `C:\workspace\Project-2C-review`, detached) = SHA ghim |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 2026-11-05 00:09 (+07:00), Home PC `DESKTOP-KDURKJP` |
| Công cụ | Claude Code, app desktop (tab Code), Windows 11 Pro |
| Model | Claude Opus 5.5 (`claude-opus-5-5`) |
| Mức suy luận | `xhigh` (đọc bằng `get_session self`: `effort: "xhigh"`, `permissionMode: "auto"`, fast mode tắt) |
| Ultracode | tắt (Owner không bật) → không subagent / Workflow; mọi việc ở phiên chính |
| Phiên làm tiếp? | không — phiên đầu của gói D |
| Node | v24.20.0 (`C:\Program Files\nodejs`, đặt đầu PATH ở mọi lệnh) |
| Bước 0 | gói D hợp lệ; `claude\D.md` chưa có → làm mới; `claude\A.md`, `B.md`, `C.md` có, dòng đầu `XONG …` |
| Chạy song song | Codex đợt 1 ở `Project-2C-review-2` (2 tiến trình `codex`); CPU 8–20 % lúc đo (`Win32_Processor.LoadPercentage`) |

## 2. Bảng R

**Cách làm chung** (mọi probe, log, nguồn ở `C:\workspace\deep-review-1-6-r5\claude\D\`):

- **Công cụ lượt 4 của chính Claude** (`deep-review-1-6-r4\claude\D\`) chép theo tên đầy đủ (`Test-Path` từng tên) vào `D\r4copy\`; bản làm việc ở `D\` chỉ đổi đường dẫn `r4` → `r5` và cổng 4611 → **4711** (bản ghim) / 4712–4719 (bản đột biến) / 4720 (bản không neo ngày). `e2e/support.ts`, `fixtures.ts`, `serve.mjs`, `playwright.config.ts` không đổi từ `2e51e25` (`git diff --stat` rỗng), nên `browser.mjs` (bản JS của `asExe`) và `pw.config.mjs` (Desktop Edge, `msedge`, `vi-VN`, `expect` 15 s, host `localhost`, chặn mọi host ngoài 127.0.0.1 / localhost) dùng lại nguyên.
- **Bản web:** `D\dist-base` = `build-dist.mjs` (Vite `build()` của worktree ghim, `outDir` ngoài repo, `VITE_DEMO_ANCHOR=15/09/2026` + ảnh chụp demo như `e2e/serve.mjs`), 5,5 s; `D\dist-real` (không neo, cho đo trên dữ liệu tải). Không dùng cổng 4173, không `pnpm e2e`, không `PW_REUSE`.
- **Đối chứng:** e2e 16 spec của gói D + `long-names` trên `dist-base`, 4 worker: **157 / 157 passed** (`D\e2e-control-base.log`). Vitest 9 file liên quan qua `D\mutant-config.mjs`: **161 / 161** (`D\vitest-control-D.log`).
- **Gỡ tạm phần sửa:** `D\mut-defs.mjs` (34 đột biến, mỗi đột biến là phép thay chữ đúng một chỗ, `check-muts.mjs` kiểm; một đột biến `revert` cả file về `2e51e25`). Vitest qua hook `load` của Vite (`D\mutjs.mjs`, chỉ tính khi có `[mutant] served`); TSX qua bản dựng đột biến ngoài repo (`D\e2e-mut.mjs`, phục vụ 4712–4719, chạy bộ lọc e2e của repo). Repo không bị ghi: `git status --short` rỗng sau mỗi đợt (dòng cuối `D\mutjs.log`, `D\e2e-mut.log`).
- **Bộ chặn ký hiệu** (`packages/ui/src/token-guard.ts`): probe Node trong `D\guard\` gọi thẳng hàm của repo ghim; so với cây cú pháp TypeScript 6.0.3 và Prettier 3.9.9 của `node_modules` repo (không cài gì).

### 2.1 Bảng R1 (6 dòng của gói D)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-37 | #790 → #845, #901 → #920 (phần gói D) | **ĐÃ SỬA** (phần gói D) | Theo mô tả lượt 1 (L·CL-D5, `docs/reviews/raw/2026-10-15/claude/D.md:148`): bốn vị trí. (1) "{trường}: {giá trị}" của thẻ Dữ kiện KYC: `CustomerKyc.tsx:95-98` gọi `t('kyc.factLine', …)` (`vi.ts:98` `'{field}: {value}'`); `git grep -E "\)\}[:,;] \{"` trên `*.tsx` của app và `packages/ui`: 0 dòng (lượt 4: `CustomerKyc.tsx:95`). (2), (3) `.join(', ')` của thẻ KYC → `.join(t('sep.list'))` (`CustomerKyc.tsx:170`, `:243`, `:317`). (4) `'; '` và ngoặc kép của 7c / 3f → `sep.semicolon` (`KycDialogs.tsx:131`), `kycNote.currentValue`, `kycConfirm.quoted` (`:533`). `D\sep-scan.log` (probe lượt 4 chạy lại, 56 file SP gói D, bỏ comment): chỉ còn dương tính giả của mảng hằng và mũi tên sắp của `table-view.ts`, như lượt 4. **Gỡ sửa:** `D\guard\r145a.mjs` đưa dòng dữ kiện về chữ JSX như `2e51e25` rồi Prettier → bộ chặn báo `}: {` dòng 95 | Phần L·CL-E5: gói E. Chỗ hở còn lại của bộ chặn giữ DR6-37: dòng DR6-145 |
| DR6-145 | #901 → #920 (+ #934 → #965, #969 → #971, #973 → #975) | **SỬA MỘT PHẦN** → **CLR5-D1**; biến thể còn hở → **CLR5-D2** | (a) như dòng DR6-37: ĐÃ SỬA. (c) máy trạng thái biết chuỗi / template / comment: ba ca DSR4-D1 bị báo đúng dòng; **gỡ sửa** G4 (dấu nháy không mở chuỗi, tức cắt comment như trước #920) **KILLED** 6 ca, G5 (chuỗi chạy qua dòng) KILLED, G6b (`\` không thoát) KILLED (`D\mutjs.log`). (b) mọi dạng Issue #901 mục 2 liệt kê nay bị báo (`D\r1-37-guard.log`, probe lượt 4 chạy lại: `` .join(`, `) ``, `a + ', ' + b`, `` `${a}, ${b}` ``, `a + '; ' + b`, chữ JSX `{a}, {b}` / `{a}; {b}` → REPORTED); **gỡ sửa** G1 (không xét chuỗi / mảnh template) KILLED 2, G2 (không xét dấu nối JSX) KILLED 3, G3 (`{` sau `}` của JSX là code) KILLED 1, G6 (`${` không mở code) KILLED 1. **Còn:** mô tả DR6-145 (b) ở tổng hợp lượt 4 §6.4 và tiêu chí của nhóm L4-F §8.2 ("Các dạng 'missed' của CLR4-D1 … bị báo") có cả `←`, `–`, `…`, ngoặc kép cong, ký hiệu viết bằng escape: 6 / 6 vẫn `missed` (`D\r1-37-guard.log`, `D\guard\remainder.log`). Issue #901 thu hẹp (escape "ngoài phạm vi"; không nêu `← – …` / ngoặc kép), PR #920 ghi "không thêm"; không quyết định Owner nào trong `known.md` chốt bỏ phần này → CLR5-D1 | Biến thể của dạng đã sửa: dấu nối JSX mà Prettier ngắt dòng (`{a},{' '}`⏎`{b}`, `{a}`⏎`, {b}`…) — dạng duy nhất `format:check` cho vào repo khi dòng dài — bị bỏ sót 387 / 510 lần cắm thử trên 67 file thật → CLR5-D2. Không báo nhầm: 0 / 1 359 lần báo trên 356 file `.ts/.tsx` sai chỗ theo cây cú pháp TypeScript (`D\guard\ast-compare.log`) |
| DR6-146 | #902 → #922 (a), #898 → #911 (b) | **ĐÃ SỬA** | (a) **gỡ sửa** R109c (5c gửi `normalizeText(name)`, đột biến lượt 4 sống cả bộ 296 ca) nay **KILLED** `customer-forms.spec.ts:387` ("refuses a name broken in a paste … when editing the profile (5c)"). (b) **gỡ sửa** RB2c (Thử lại luôn đưa focus về tiêu đề, lượt 4 sống) nay **KILLED** `save-state.spec.ts:177` (`D\e2e-mut.log`) | S2 (mọi lần lưu thành công kéo focus về tiêu đề, kể cả khi focus không ở dải) cũng KILLED ở `:177` |
| DR6-147 | #898 → #911 (phần gói D: dải lưu, hộp đóng app) | **ĐÃ SỬA** (phần gói D; hàng đợi: `claude\B.md`) | **Tái hiện lượt 4 chạy lại** trên bản ghim (`D\logs-p13-retry-focus.log`, `D\logs-p16-close-question.log`): K1 (focus ở "Thử lại", phân tích OpenCode giả của `asExe` ghi xong) → `focus after the strip went (not by Thử lại) H1 "Hồ sơ khách hàng"` (lượt 4: `BODY`); K7 (hộp đóng app đang hỏi `READ_ONLY`, lần lưu của phân tích thành công) → `saves seen ["save"×5,"destroy"]`, `close question still open false` (lượt 4: hộp ở lại, câu đổi sang "chương trình khác"). **Gỡ sửa:** S1 (listener của dải không đưa focus) KILLED `save-state.spec.ts:202`; C4 (`CloseGuard.tsx` về `2e51e25`) KILLED `:225`; C1 (lần lưu thành công không trả lời), C2 (trả lời mà không thôi nghe), C3 (luôn hiện hộp) KILLED `close-guard.test.ts` | Biến thể mới: focus ở "Thử lại" mà người dùng đã cuộn trang xuống (dải ngoài màn) rồi lần lưu khác thành công (`D\logs-p25-strip-scrolled.log`): focus về `H1`, `scrollY` giữ 522 (không nhảy). Hai điểm mockup không vẽ của #817: ACCEPTED, không báo lại |
| DR6-148 | #902 → #922 (+ #932 → #941, #951 → #958) (phần gói D: (a) hộp thoại, (b) màn Team) | **ĐÃ SỬA** (phần gói D; (c), (d): gói E); biến thể còn hở → **CLR5-D3** | **Gỡ sửa:** D1 (khối tiêu đề `Dialog` bỏ `wrap-anywhere`) KILLED `long-names.spec.ts:70`, `:106`; T3 (tên người hỗ trợ không ngắt), T4 (tiêu đề team không ngắt), T6 (nút team không ngắt) KILLED `:146` (`D\e2e-mut.log`). Thân hộp thoại có tên dài, ngoài e2e (`D\logs-p20-long-bodies.log`, `D\logs-p22-long-more.log`): 5a / 5c với RE 160 chữ trong ô chọn và câu bàn giao, 5f của KH 81 chữ, 9b của RE 160 chữ có KH 81 chữ trong Thùng rác, 9c của team 160 chữ, 9a với team 160 chữ: `scrollWidth` = `clientWidth` = 446 ở 1 100 và 1 440 | **Chỗ DR6-148 chưa nêu, còn tràn:** Khách hàng → Bảng với KH 81 chữ (trang 1 329 px ở 1 100) hay RE 160 chữ (1 889 px ở 1 100 và 1 440), dòng meta của hồ sơ KH với RE 160 chữ ở 1 100 (+299 px) → CLR5-D3 |
| DR6-149 | #901 → #920 (+ #905 → #928, #935 → #948) | **ĐÃ SỬA**; lệch mockup chưa ghi → **CLR5-D4** | Sáu điểm của mô tả: e2e `theme.spec.ts:243` xanh ở đối chứng; **gỡ sửa** CH1 (class của `Choices` về `2e51e25`) KILLED, CH2 (ô tắt không gạch ngang) KILLED (`D\e2e-mut.log`). Ngoài 5a / 5d của e2e (`D\logs-p24-choices.log`): chip 9a "Vai trò" và 7c đúng `.choice` / `.choice.on` của `forms.css:261-279` (nền rgb(24,33,45) / rgba(217,178,106,.14), viền rgb(52,66,90) / rgb(217,178,106), bo 6px, đệm 5 / 11, 12,5px, chữ rgb(174,185,200) / rgb(232,237,244), đậm 400 / 600). K44 (viền 3:1 chỉ ở ô đang chọn): như PR | Bàn phím ở 5d (`D\logs-p26-choices-keys.log`): mũi tên bỏ qua "N2 hiện tại" (tắt), vòng hết lượt; viền focus `solid`. Màu cưỡng bức (forced colors giả lập): ô đang chọn chỉ còn khác ở chữ đậm 600 (viền, chữ cùng màu hệ thống) — vẫn có dấu hiệu không dựa vào màu, không ghi phát hiện. Mockup 7c vẽ hàng `.radio` mà "Lệch mockup đã biết" chỉ ghi 7d → CLR5-D4 |

Đếm R1 (6 dòng của gói D): **5 ĐÃ SỬA, 1 SỬA MỘT PHẦN** (DR6-145 → CLR5-D1), 0 CHƯA SỬA, 0 HỒI QUY. Biến thể còn hở ghi riêng: CLR5-D2 (DR6-145), CLR5-D3 (DR6-148), CLR5-D4 (DR6-149).

### 2.2 Bảng R2 (9 Issue của gói D)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-331 | #932 → #941 | **ĐÃ SỬA** | Mục 1: `th` của cột tiêu đề ẩn có `relative` (`DataTable.tsx:168-178`), khung cuộn của Team không còn `relative`. Mục 2: hàng tiêu đề thẻ team `flex-wrap`, tên TL `min-w-0 wrap-anywhere`, hai nút trong một `div` `ml-auto` (`TeamScreen.tsx:302-329`). Mục 3: `items-baseline` (`:173`). Mục 4: ca phụ đề `long-names.spec.ts:106`. **Gỡ sửa:** DT1 (không `relative`) KILLED `ui-datatable.test.tsx`; DT1e cùng đột biến KILLED `long-names.spec.ts:146`, `:186`; T1 (bỏ `flex-wrap`) KILLED `:146`, `:186`; T2 (`items-center`) KILLED `:146`; T5 (tên TL không ngắt) KILLED `:186`; D2 (`wrap-anywhere` chỉ ở `h2`) KILLED `:106` | Ghi chú sổ đã gom (RESOLVED #922): không hỏng lại. `DataTable` của Khách hàng không nằm trong khung cuộn, nên tên dài kéo cả trang (không phải lỗi `sr-only`): CLR5-D3 |
| T-332 | #933 → #946 (phần gói D: khóa i18n chung, mục 3) | **ĐÃ SỬA** (phần gói D) | `customer.withCode` (`vi.ts:78`) thay `trash.restoreLabel.coded` và `person.inUseTrashCoded` (đã gỡ); `team-view.ts:133` và `trash-view.ts:227` cùng gọi. **Gỡ sửa / chứng minh dùng chung:** K1 (đổi khuôn của khóa thành `{name} [{code}]`) KILLED cả `team-view.test.ts` ("tells two customers of one name apart by their codes…") lẫn `trash-view.test.ts` ("tells apart two customers of the same name and stage by their code (DR6-151)") (`D\mutjs.log`) | Ô Giờ, focus 10a / 10b: gói E; `readsBackAsIs`: gói A; `listeners.ts`: gói B. `grep "({code})"` trong `vi.ts`: chỉ còn `aiPanel.rejectedReason*` (mã lỗi của validator, khác nghĩa) |
| T-333 | #934 → #965 (phần gói D: bộ chặn ký hiệu) | **ĐÃ SỬA** (phần gói D; `globMeetsFolder`: gói F) | Mục 1: bộ đếm `types` (`token-guard.ts:76-81`, `:135-136`, `:154-156`). Mục 2: `\` trước CRLF (`:103-105`). **Gỡ sửa:** G7 (không đếm đối số kiểu) KILLED 2 ca, G7b (`>` đóng đối số kiểu vẫn đặt `last = '>'`) KILLED 2, G8 (`\` trước CRLF chỉ bỏ `\r`) KILLED 1 (`D\mutjs.log`). Trên mã thật: 356 file, 0 báo nhầm theo cây cú pháp (`ast-compare.log`); 116 file được quét đều kết thúc `types 0, braces 0, mode code` (`end-state.log`); `node packages/ui/scripts/check-tokens.ts …` xanh | Biến thể gần (`D\guard\t333-variants.log`, 9 / 9 như mong đợi): `extends Foo<Bar> implements Baz<Q> {}`, phương thức `map<U>(…): Box<U> {}`, hàm mũi tên `<T,>(x: T): Promise<T> => {}`, `satisfies Record<…>`, kiểu mặc định lồng `Map<string, Set<number>>` → 0 báo; JSX sau `useMemo<Row[]>(` và sau `as ReactElement<P>` vẫn báo; CRLF trong template và comment `//` → đúng dòng |
| T-337 | #951 → #958 (phần gói D: `Button`) | **ĐÃ SỬA** (phần gói D; ô Giờ, hai chỗ gọi: gói E) | `Button.tsx:25` có cặp `aria-disabled:cursor-default aria-disabled:opacity-50` cạnh cặp `disabled:`. **Gỡ sửa:** B1 (bỏ cặp đó) KILLED `ui-button.test.tsx`. Bản build `dist-base`: CSS có `aria-disabled\:cursor-default[aria-disabled=true]{cursor:default}` và `aria-disabled\:opacity-50[aria-disabled=true]{opacity:.5}`; `git grep aria-disabled` trong app: chỉ `ConfirmWordDialog.tsx:33`, `SettingsBackup.tsx:137` (thuộc tính, không class) | e2e mục 3 (tiêu đề team một dòng cạnh TL 160 chữ): `long-names.spec.ts:186` xanh ở đối chứng, T5 làm nó đỏ |
| T-341 | #969 → #971 | **ĐÃ SỬA** | Comment của `types` (`token-guard.ts:76-80`) nêu thẻ mở / đóng / tự đóng dính chữ và hậu quả (chỉ bỏ sót). Ca ghim `token-guard.test.ts` "takes an opening, closing or self-closing tag…". **Ca ghim có cắn:** G9 = đúng cách sửa của mục ACCEPTED (không đếm `<` trước `/`, `/>` đóng thì đặt `last = '>'`) → **KILLED** đúng ca ghim | Mục ACCEPTED (Issue #969 không đổi hành vi): KNOWN, không báo lại |
| T-342 | #973 → #975 (phần gói D: ca ghim thẻ mở) | **ĐÃ SỬA** (phần gói D; bảng PR vượt ngưỡng: gói F) | Dòng `<p>one<b>{a}, {b}</b></p>` có trong ca ghim. **Gỡ sửa:** G10 (`<b>` dính chữ không mở đối số kiểu) KILLED đúng ca ghim | — |
| T-344 | #980 → #981 | **ĐÃ SỬA** (tài liệu, khớp mockup) | `docs/user-guide/README.md:75` hàng "Chuyển nhóm" ghi `customer-forms.html` 5d–5e; mockup vẽ hộp Chuyển nhóm ở 5d (`customer-forms.html:175-209`, KH đang mở) và 5e (`:214-249`, KH đã đóng); `git show 57d6330 --stat`: 1 dòng | — |
| T-352 | #1004 → #1007 (phần gói D: bảng "Cổng KYC" của hướng dẫn) | **ĐÃ SỬA** (tài liệu, khớp app) | `docs/user-guide/06-ai.md:29-30`. Trên bản web (`D\logs-p23-guide-rows.log`): KH chỉ có mã (cổng `KYC_INSUFFICIENT`) → panel không có "Xem ở Dữ kiện KYC →" (0), nút Phân tích tắt, câu "Cần chăm sóc, KYC thêm thông tin khách hàng. Còn thiếu: Gia đình, Nghề nghiệp / nguồn thu — câu hỏi gợi ý ở thẻ Dữ kiện KYC."; sau mâu thuẫn Tình trạng hôn nhân (`CONFLICT_RESOLUTION`) → có link (1), câu "Giải quyết mâu thuẫn ở Tình trạng hôn nhân trước khi phân tích." — khớp hai hàng của bảng | Phần nghiệm thu của T-352: gói F |
| T-356 | #1019 → #1023 | **ĐÃ SỬA** (tài liệu, khớp app) | `01-bat-dau.md:8-10`, `02-tong-quan.md:5`. Trên bản web, hồ sơ trình duyệt mới (`p23`): lần mở đầu `#/overview` "Tổng quan · Heritas L-CRM"; sau Cài đặt → mở lại `#/settings`; sau Team → `#/team` (`useRoute.ts`, khóa `p2c.lastRoute`) | Cài đặt mở lại ở mục đầu (File dữ liệu), không ở mục AI vừa mở: hướng dẫn chỉ nói "màn", đúng. Màn dùng cuối là hồ sơ một KH không có trong dữ liệu (thư mục khác) → "Không tìm thấy KH này (có thể đã bị xóa)." (như B K10): không trái câu của hướng dẫn |

Đếm R2 (9 Issue của gói D): **9 / 9 ĐÃ SỬA** (phần gói D), 0 SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY.

**Refactor không đổi hành vi:** T-332 mục 3 (một khóa cho hai nơi) chữ không đổi — test có sẵn của hai nơi xanh ở đối chứng, K1 làm cả hai đỏ. T-331 / T-325 với tên thường: e2e đối chứng 157 / 157 (gồm `team.spec.ts`, `data-table.spec.ts`); PR #941 chụp so byte. Khóa i18n: `D\keys.log` 1 194 khóa, 0 khóa không dùng, 0 chỉ test dùng.

## 3. Phạm vi đã đọc

**Danh sách gói D** (`D\list.mjs` = probe lượt 4, luật `classifyFile`; `D\list.log`, `D\files.txt`): **89 file, 8 134 dòng SP / 3 094 dòng test** (= `common\baseline.md`).

**Diff sửa của gói D** `2e51e25..37a80b6` (`D\fix-numstat.log`): SP +208 / −73 ở 12 file, test +276 / −2 ở 4 file (= baseline). 10 commit (`D\fix-commits.log`): #911, #920, #922, #924, #941, #946, #958, #965, #971, #975. Đọc từng hunk: `SaveWarning.tsx`, `CloseGuard.tsx`, `close-guard.ts` (+ test), `token-guard.ts` (+ test, đủ), `Choices.tsx`, `Button.tsx`, `DataTable.tsx`, `Dialog.tsx`, `TeamScreen.tsx`, `team-view.ts`, `CustomerKyc.tsx`, `vi.ts` (3 hunk), `ui-button.test.tsx`, `ui-datatable.test.tsx` (mới).

**Đọc hết ở `37a80b6`:** `token-guard.ts` (163), `Choices.tsx` (80), `Dialog.tsx` (94), `Button.tsx` (29), `SaveWarning.tsx`, `CloseGuard.tsx`, `close-guard.ts`, `useRoute.ts`, `packages/ui/scripts/check-tokens.ts`; `CustomersScreen.tsx:41-300`, `CustomerProfile.tsx:160-185`, `KycDialogs.tsx:108-170`, `:425-440`, `:530-535`, `CustomerDialogs.tsx:220-240`, `DataTable.tsx:160-225`, `AppShell.tsx` (chỗ `heading`), `ConfirmWordDialog.tsx:1-80`, `i18n/index.ts:31-55`. Các file gói D không đổi từ `2e51e25`: lượt 1–4 đã đọc hết; phiên này chỉ đọc lại phần nêu trên.

**Chỗ gói khác nối vào:** `e2e/{long-names,save-state,theme,customer-forms}.spec.ts` (phần mới), `e2e/support.ts:105-121`; `docs/design/mockups/{forms.css:255-284, kyc-forms.html:228-282, customer-forms.html:175-249}`; `docs/user-guide/{README.md:70-80, 01-bat-dau.md:5-12, 02-tong-quan.md:1-8, 06-ai.md:20-40}`; `docs/testing/nghiem-thu-v1.md:407` ("Lệch mockup đã biết", mục Ô chọn).

**Tài liệu:** `CLAUDE.md` gốc, `apps/desktop/CLAUDE.md`, `packages/ui/CLAUDE.md`, `.claude/rules/{i18n-ui,mockups,tests}.md`; `common\{prompt-claude.md (đủ), plan.md (§4, §L5.1–§L5.8), known.md (đủ), baseline.md (đầu, cổng, bundle, số đo exe), fixes.md (#898 / #911, #901 / #920, #902 / #922, #932 / #941, #933 / #946, #934 / #965, #951 / #958, #969 / #971, #973 / #975 (Issue), #980 / #981, #1004 / #1007 (phần hướng dẫn), #1019 / #1023 và nhóm RESOLVED)}`; tổng hợp lượt 4 §6.4, §8.2 (L4-F); báo cáo gốc lượt 4 Claude D (đủ), Codex D (dòng R, CXR4-D1, D2, kịch bản N1–N4), lượt 1 Claude D (CL-D5); `claude\A.md` (ID phát hiện), `claude\B.md` (đủ), `claude\C.md` (ID phát hiện) để không báo trùng. Tìm theo từ khóa (`cuộn ngang`, `liền dài`, `Bảng`, `{' '}`, `Prettier`) trong `docs/reviews/raw/2026-10-*/` và `docs/state/review-notes.md` để biết kịch bản chưa ai thử.

## 4. Kịch bản mới đã thử

Chưa có trong báo cáo gói D lượt 1–4 và trong `claude\A.md`–`C.md` lượt 5 (tìm theo từ khóa ở các báo cáo gốc). Mọi probe trình duyệt: Edge, chặn mạng ngoài 127.0.0.1 / localhost và thay `window.open` từ lần chạy đầu; mọi log kết thúc bằng `requests blocked (not 127.0.0.1) []`, `page errors []`.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| K1 | Bộ chặn ký hiệu trên mã **đã qua Prettier** (`D\guard\plant-forms.mjs`): ở mọi cặp biểu thức JSX anh em (chỉ khoảng trắng / `{' '}` giữa) của 67 file `.tsx` được quét, cắm `, ` / `; ` / `: `, format bằng Prettier của repo, xác định dạng Prettier cho qua cây cú pháp, hỏi bộ chặn | 510 lần cắm: dạng A `{a}, {b}` cùng dòng **123 / 123** bị báo; dạng B `{a},{' '}`⏎`{b}` **0 / 138**; C `{a}`⏎`, {b}` **0 / 39**; D `{a}`⏎`,{' '}`⏎`{b}` **0 / 210**. Cặp "chữ" (hai lời gọi `t()` / tên): A 30 / 30, B 0 / 3 | CLR5-D2 |
| K2 | Báo nhầm của bộ chặn trên **toàn repo** (`ast-compare.mjs`): 356 file `.ts/.tsx` đã track (gồm test, tools, e2e), mỗi lần báo dấu nối đối chiếu cây cú pháp TypeScript (chữ JSX ", " giữa hai biểu thức; chuỗi / mảnh template đúng bằng ", ") | 1 359 lần báo, **0** sai chỗ | — |
| K3 | Trạng thái cuối file của bộ chặn (bản chép có đo, `end-state.mjs`) trên 116 file `lint:tokens` quét: bộ đếm `types`, ngăn xếp `{`, chế độ | 116 / 116 về `types 0, braces 0, mode code` (không file nào để một `<` hay một chuỗi treo tới cuối) | — |
| K4 | Ký hiệu của danh sách "missed" lượt 4 cộng dạng gần (`remainder.mjs`): `←`, `–`, `…`, ngoặc kép cong, `\u00d7` / `\u2014` trong chuỗi, `{'\u00b7'}` trong JSX, thực thể HTML `&times;` / `&middot;` / `&rarr;` / `&#183;` trong chữ JSX | 11 / 11 `missed`; app hiện không có dạng nào (`git grep`) | CLR5-D1 |
| K5 | Dấu nối JSX cạnh một phần tử (`jsx-near.mjs`): `{t('a')}: <b>{v}</b>`, `<b>{a}</b>, {b}`, `<b>{a}</b>, <i>{b}</i>` | Cả ba `missed` (luật chỉ xét giữa hai biểu thức) | CLR5-D2 (biến thể) |
| K6 | Biến thể của T-333 (9 ca: generic kép / phương thức / hàm mũi tên / `satisfies` / kiểu mặc định lồng; JSX sau lời gọi generic và sau `as`; CRLF trong template, comment `//` CRLF) | 9 / 9 như mong đợi | — |
| K7 | Tên liền dài ở **thân** hộp thoại và ở màn gói D mà e2e của #922 / #941 không đo (`p20`, `p21`, `p21b`, `p21c`, `p22`): RE 160 chữ trong ô chọn 5a và câu bàn giao 5c, 5f của KH 81 chữ, 9b của RE 160 chữ có KH 81 chữ trong Thùng rác, 9c team 160 chữ, ô Team của 9a; Khách hàng Kanban / Bảng; hồ sơ KH; màn Team (bảng thành viên) | Hộp thoại: không tràn (446 / 446). Kanban: `truncate` như thiết kế. **Bảng Khách hàng** tràn trang (KH 81: 1 329 px ở 1 100; RE 160: 1 889 px ở 1 100 và 1 440); **dòng meta của hồ sơ** tràn 299 px ở 1 100 với RE 160 | CLR5-D3 |
| K8 | Tên dài nhưng thật hơn (`p21`): RE 30 chữ liền; RE "Nguyễn Thị Phương Thảo Hoàng Minh Châu Bảo Ngọc" (46 chữ, có dấu cách) | Không tràn ở Bảng và hồ sơ, 1 100 và 1 440 | — |
| K9 | Ô chọn ngoài 5a / 5d (`p24`): chip của 9a "Vai trò" và chế độ ghi của 7c (trường đã có giá trị) so `.choice` / `.choice.on`; nội dung 7c so mockup | Kiểu chip đúng mockup; 7c: app vẽ hai ô chọn + một dòng help chung, mockup 7c vẽ hai hàng `.radio` có mô tả riêng; "Lệch mockup đã biết" chỉ ghi 7d | CLR5-D4 |
| K10 | 5d bằng bàn phím và ở màu cưỡng bức (`p26`): Space ở N3, ←/→ qua ô tắt "N2 hiện tại"; `forcedColors: 'active'` ở 5a | Mũi tên bỏ qua ô tắt, vòng; viền focus `solid`. Màu cưỡng bức: viền / chữ cùng màu hệ thống, ô đang chọn còn chữ đậm 600 (trước #920 không còn gì) | — |
| K11 | Dải lưu lỗi mất vì lần lưu khác khi focus ở "Thử lại" mà trang **đã cuộn xuống** (dải ở trên, ngoài màn), cửa sổ 1 100 × 700 (`p25`) | Focus về `H1 "Hồ sơ khách hàng"`, `scrollY` giữ 522 (không kéo về đầu trang) | — |
| K12 | Mở lại app theo màn dùng cuối với các màn khác nhau (`p23`): Cài đặt (đang ở mục AI), Team, hồ sơ một KH không có trong dữ liệu | `#/settings` (mục Dữ liệu), `#/team`, `#/customers/<mã>` "Không tìm thấy KH này (có thể đã bị xóa)." | — |
| K13 | `kyc.factLine` (DR6-145 (a)) với giá trị có tên slot và mẫu thay của `String.replace` (`p27`): `{field}`, `{value}`, `$& $1 $$`, chuỗi rỗng | "Năm sinh: {field}", "Năm sinh: {value}", "Năm sinh: $& $1 $$", "Năm sinh: " — không quét lại, không diễn giải `$` | — |

## 5. Phát hiện mới

### CLR5-D1 — DR6-145 (b) sửa một phần: bộ chặn ký hiệu vẫn không bắt `←`, `–`, `…`, ngoặc kép cong và ký hiệu viết bằng escape / thực thể HTML

```
ID: CLR5-D1
Mức: Nit
Trục: A (i18n), T
Vị trí: packages/ui/src/token-guard.ts:98-99 (chỉ `·`, `→` và `✓○×▾▸—`), :55-62 (doc: "nor a mark written as a Unicode escape") (37a80b6)
Tình trạng: CONFIRMED
Liên quan: DR6-145 (b), DR6-37, T-324 (#901 → #920) · có từ trước; Issue #901 thu hẹp phạm vi so với mô tả DR6-145 và tiêu chí L4-F
Kịch bản: K4
```

- **Mô tả:** Mô tả DR6-145 (b) ở tổng hợp lượt 4 §6.4 nêu bộ chặn không bắt `` .join(`, `) ``, `a + ', ' + b`, template `${a}, ${b}`, chữ JSX `}, {`…, **`←`, `–`, `…`, ngoặc kép cong, ký hiệu viết bằng escape**; tiêu chí của nhóm L4-F (§8.2) là "Các dạng 'missed' của CLR4-D1 … bị báo". Issue #901 mục 2 chỉ giao các dạng nối, ghi escape "ngoài phạm vi"; PR #920 ghi `←`, `–`, `…`, ngoặc kép cong "Issue mục 2 không nêu, nên không thêm". Không quyết định Owner nào (`known.md` K1–K47, ACCEPTED) chốt bỏ phần này.
- **Tái hiện / bằng chứng:** `node D\r1-37-guard.mjs` (probe lượt 4, `D\r1-37-guard.log`): `missed` cho `'←' (back arrow)`, `'–' (en dash range)`, `'…' (ellipsis)`, `'“…”' (quotes)`, `escape × (backslash-u text)`, `escape — (backslash-u text)`; các dạng nối của Issue #901 đều `REPORTED`. `node D\guard\remainder.mjs` (`remainder.log`): thêm `{'\u00b7'}` trong JSX, `&times;`, `&middot;`, `&rarr;`, `&#183;` trong chữ JSX → 11 / 11 `missed`. App hiện không có dạng nào: `git grep -P "[←–…“”‘’]"` và `git grep -E "&[a-z]+;|&#[0-9]+;"` trên mã được quét (ngoài comment, i18n, test) → 0 dòng.
- **Ảnh hưởng:** không ai thấy khác ở bản hiện tại; cam kết "ký hiệu chỉ ở `vi.ts`" của bộ chặn không giữ cho các ký hiệu này, nên lần viết sau có thể lọt mà `pnpm verify` vẫn xanh.
- **Đề xuất:** thêm `←–…“”‘’` vào tập `hardcoded-mark` (chuỗi, template, code; comment vẫn được dùng); trong chuỗi / template bắt escape `\u2190`, `\u2013`, `\u2026`, `\u201c`, `\u201d`, `\u00d7`, `\u2014`, `\u00b7`, `\u2192`; trong code bắt thực thể `&times;`, `&middot;`, `&rarr;`, `&larr;`, `&mdash;`, `&ndash;`, `&hellip;`, `&ldquo;`, `&rdquo;`, `&#…;`. Kèm ca test cho từng dạng, chạy lại trên repo (cùng kết quả 0). ≈ 10 dòng SP công cụ + ≈ 25 dòng test. Hoặc Owner chốt để ngoài và ghi giới hạn vào doc của hàm.

### CLR5-D2 — Luật dấu nối JSX của bộ chặn bỏ sót mọi dạng Prettier ngắt dòng (`{a},{' '}`⏎`{b}`, `{a}`⏎`, {b}`…): 387 / 510 lần cắm thử trên mã thật lọt

```
ID: CLR5-D2
Mức: Low
Trục: T, A (i18n)
Vị trí: packages/ui/src/token-guard.ts:146-150 (`closesJsx && /^[,;:] \{/.test(source.slice(i + 1, i + 4))`: chỉ một dấu, một dấu cách rồi `{`, liền sau `}`) (37a80b6)
Tình trạng: CONFIRMED
Liên quan: DR6-145 (b) (biến thể của dạng đã sửa), T-324 · mới do đợt sửa sau lượt 4 (PR #920 thêm luật dấu nối JSX)
Kịch bản: K1, K5
```

- **Mô tả:** `pnpm verify` chạy `format:check` trước `lint:tokens`, nên mọi file trong repo đã qua Prettier. Khi `{a}, {b}` không vừa dòng (printWidth 100), Prettier viết lại dấu nối thành `{a},{' '}` rồi `{b}` ở dòng sau, hoặc đưa `, {b}` xuống đầu dòng sau, hoặc để `,{' '}` một mình một dòng. Luật JSX chỉ nhận dạng `}` `, ` `{` liền nhau, nên ba dạng đó lọt; với một dòng dài, đó là dạng duy nhất vào được repo. App đã có 20+ chỗ Prettier viết `{' '}` cuối dòng (vd. `CustomerKyc.tsx:78`, `:208`, `CustomerAppointments.tsx:126`, `CustomerDialogs.tsx:155-156`), nên dạng ngắt dòng là thường gặp. Dấu nối cạnh một phần tử (`{t('a')}: <b>{v}</b>`, `<b>{a}</b>, {b}`) cũng lọt.
- **Tái hiện / bằng chứng:**
  - `D\guard\wrap-src3.tsx` → Prettier → `wrap-fmt3.tsx`: chính dòng của DR6-145 (a), khi dài hơn một chút, thành `` {t(`kycField.${fact.field}`)}:{' '} `` ⏎ `{factText(…)}`; `node run-guard.mjs wrap-src3.tsx wrap-fmt3.tsx` → bản gốc 2 lần báo, bản đã format chỉ còn 1 (ca còn lại vừa 100 cột, không bị ngắt). `wrap-fmt2.tsx`: `},{' '}` và `};{' '}` → không báo (`guard-wrap.log`); `prettier --check wrap-fmt2.tsx` → "All matched files use Prettier code style!".
  - `node D\guard\plant-forms.mjs` (`plant-forms.log`): 510 lần cắm trên 67 file `.tsx` thật, dạng do cây cú pháp của file đã format xác định, "bị báo" = có báo ở dòng biểu thức đầu kết thúc: `other A 93 / 93`, `text A 30 / 30`, `other B 0 / 135`, `text B 0 / 3`, `other C 0 / 39`, `other D 0 / 210` (vd. `KycIntelligence.tsx:596`: `{t('sep.dot')},{' '}` ⏎ `{t('aiPanel.history.viewingVersion', …)}` không báo).
  - `node D\guard\jsx-near.mjs` (`jsx-near.log`): `{t('a')}: <b>{value}</b>`, `<b>{a}</b>, {b}`, `<b>{a}</b>, <i>{b}</i>` → `missed`; `{a}, {b}` → `REPORTED`.
  - App hiện không có dạng nào: `git grep -E "\}[,;:]\{' '\}"` trên `*.tsx` → 0.
- **Ảnh hưởng:** cùng loại DR6-145: dấu nối viết tay ở một dòng JSX dài (hay cạnh một phần tử) vào được repo mà `lint:tokens` xanh. Không ai thấy khác khi app chỉ có tiếng Việt; chỉ là lỗ của công cụ giữ quy tắc i18n.
- **Đề xuất:** sau `}` của JSX, bỏ qua khoảng trắng / xuống dòng và một `{' '}` / `{" "}`, rồi xét một dấu `,;:` mà sau nó (kể cả qua `{' '}` và xuống dòng) là `{` hay `<` của JSX; chữ JSX `{a}: <b>` xét như `}: {`. Ca test lấy đúng ba dạng B / C / D ở trên (chép output của Prettier) và hai dạng cạnh phần tử; chạy lại `ast-compare.mjs` (0 báo nhầm) và `plant-forms.mjs`. ≈ 15 dòng SP công cụ + ≈ 30 dòng test.

### CLR5-D3 — Tên liền dài còn kéo trang cuộn ngang ở Khách hàng → Bảng và ở dòng meta của hồ sơ KH (chỗ DR6-148 chưa nêu)

```
ID: CLR5-D3
Mức: Low
Trục: E, A
Vị trí: apps/desktop/src/routes/customers/CustomersScreen.tsx:53-73 (cột Họ tên, RE của bảng, ô không ngắt), :193-202 (DataTable không trong khung cuộn); packages/ui/src/components/DataTable.tsx:208-212 (`td` không `wrap-anywhere`); apps/desktop/src/routes/customers/CustomerProfile.tsx:173 (`<p className="m-0 text-sm text-fg-2 tabular-nums">{joinParts(facts)}</p>`) (37a80b6)
Tình trạng: CONFIRMED
Liên quan: DR6-148 (biến thể), họ DR6-117 · có từ trước, lượt 1–4 bỏ sót
Kịch bản: K7, K8
```

- **Mô tả:** DR6-148 (tên không có trần độ dài; tên liền dài là đầu vào hợp lệ) đã sửa bốn chỗ được nêu, cộng thân hộp thoại (K7: không tràn). Hai chỗ của gói D chưa ai đo: ô Họ tên / RE của bảng Khách hàng không ngắt chuỗi liền, bảng `w-full` không nằm trong khung cuộn nên giãn cả trang; dòng meta dưới tên KH ở hồ sơ ("mã · giới tính · ngày sinh · RE …") không ngắt.
- **Tái hiện / bằng chứng:** `node D\p21-overflow-culprits.mjs 4711` (`logs-p21-overflow.log`): KH 81 chữ, RE của seed: "Bảng @1100 pageScrollWidth 1329, table.w-full… right 1329", @1440 không tràn; RE đổi tên 160 chữ: "Bảng @1100 1889", "Bảng @1440 1889", "profile @1100 1375". `node D\p21b-profile-culprit.mjs 4711` (`logs-p21b-profile.log`): văn bản vượt cửa sổ duy nhất là `p.m-0.text-sm.text-fg-2.tabular-nums … right 1375 "K-VKWJ · Nam · 15/09/199"`; `p21c` (`logs-p21c-profile-boxes.log`): KH 81 chữ + RE 160 chữ ở 1 100: chỉ dòng đó (+299 px), ở 1 440 không tràn. Đối chứng: RE 30 chữ liền và RE 46 chữ có dấu cách → không tràn (K8); Kanban dùng `truncate` (thiết kế).
- **Ảnh hưởng:** chỉ khi có tên liền dài bất thường (như DR6-148). Bảng Khách hàng (màn chính) cuộn ngang cả trang, cột Ngày tạo / số HĐ ra ngoài cửa sổ 1 100; hồ sơ ở 1 100 cuộn ngang theo dòng meta. Không sai dữ liệu.
- **Đề xuất:** như DR6-117 / DR6-148: ô Họ tên và RE của bảng Khách hàng bọc `block max-w-60 wrap-anywhere` (cách của `ReportTable.tsx`, chỉ đổi khi tên dài), dòng meta `CustomerProfile.tsx:173` thêm `wrap-anywhere`; ca e2e trong `long-names.spec.ts` (KH 81, RE 160 ở 1 100 / 1 440: trang và `main` không cuộn ngang). ≈ 4 dòng SP + ≈ 30 dòng e2e.

### CLR5-D4 — "Lệch mockup đã biết" (mục Ô chọn) chỉ ghi 7d; 7c cũng vẽ hàng `.radio` mà app dùng ô chọn

```
ID: CLR5-D4
Mức: Nit
Trục: C
Vị trí: docs/testing/nghiem-thu-v1.md:407 (mục "Ô chọn"); docs/design/mockups/kyc-forms.html:241-248 (7c); apps/desktop/src/routes/customers/KycDialogs.tsx:154-164 (`Choices` "Trường đã có giá trị"), apps/desktop/src/i18n/vi.ts:546-549 (37a80b6)
Tình trạng: CONFIRMED
Liên quan: DR6-149, K44 ("các lệch còn lại của ô chọn … ghi ở 'Lệch mockup đã biết'"), T-328 (#905 → #928), T-334 (#935 → #948; review #928) · có từ trước (ô chọn từ T-048, #150); hai lần ghi mục Ô chọn đều sót 7c
Kịch bản: K9
```

- **Mô tả:** Mockup 7c ("Trường đã có giá trị khác — cập nhật hay mâu thuẫn") vẽ hai hàng `.radio`, mỗi hàng chấm tròn, chữ đậm "Cập nhật" / "Đánh dấu mâu thuẫn" và dòng mô tả riêng ("KH cho số mới; 25 tỷ thành giá trị cũ…", "Chưa rõ số nào đúng; giữ cả hai…"). App vẽ hai ô chọn và một dòng help chung. Mục "Ô chọn" của "Lệch mockup đã biết" ghi đúng trường hợp này cho 7d (T-334 thêm sau review #928) nhưng không ghi 7c; theo K44 mọi lệch còn lại của ô chọn phải nằm ở đó.
- **Tái hiện / bằng chứng:** `node D\p24-choices.mjs 4711` (`logs-p24-choices.log`): 7c của KH có Tình trạng hôn nhân, nhập giá trị mới: `7c mode group (text) Trường đã có giá trị Cập nhật Đánh dấu mâu thuẫn Cập nhật: giá trị đang có thành cũ. Mâu thuẫn: chưa rõ giá trị nào đúng, giữ cả hai tới khi giải quyết.`, hai `label` kiểu `.choice` (đậm 600 / 400). `grep -n 'class="radio' kyc-forms.html` → `:241`, `:245` (7c), `:272`, `:276` (7d). `nghiem-thu-v1.md:407`: "Hộp 7d của `kyc-forms.html` không vẽ ô chọn mà vẽ mỗi giá trị bằng một hàng `.radio`…", không có 7c.
- **Ảnh hưởng:** người nghiệm thu đối chiếu 7c với mockup gặp lệch không có trong danh sách; không ảnh hưởng người dùng.
- **Đề xuất:** thêm 7c vào câu của 7d ở mục "Ô chọn" (hai hàng `.radio` có mô tả riêng → hai ô chọn + một dòng help chung), PR docs; không đổi app hay mockup. ≈ 1 dòng.

Ngoài CLR5-D1…D4 không có phát hiện mới ở gói D.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc | Trên | Kết quả (số) | ID |
|---|---|---|---|
| `tsc --noUnusedLocals --noUnusedParameters` | `tsconfig.base.json` bật sẵn hai cờ → `pnpm typecheck` trong `pnpm verify` (xanh ở SHA ghim, `baseline.md`) | 0 biến / tham số thừa (không chạy lại) | — |
| `node D\r1-exports.mjs` (scanner lượt 1–4; `D\exports.log`) | 58 file SP `.ts/.tsx` của gói D | Không export chạy thật nào chết. Chỉ test đọc (chính file cũng dùng): 7 như lượt 4 (`COUNT_SLOTS`, `StageHead`, `stageSince`, `CloseDialog`, `SaveFailed`, `SaveStateLine`, `compareCells`); 11 kiểu chỉ dùng trong file. `askWhileFailed` mới: `CloseGuard.tsx` dùng | — |
| Khóa i18n `node D\r1-keys.mjs` (`D\keys.log`) | `vi.ts` ↔ `apps/desktop/src` | **1 194 khóa** (962 viết thẳng + 232 dựng động), **0 không dùng, 0 chỉ test dùng**; chữ trùng ≥ 2 khóa 68 cặp (= lượt 4). Hai khóa cũ trùng khuôn (`trash.restoreLabel.coded`, `person.inUseTrashCoded`) đã gỡ | — |
| Slot i18n `node D\r1-slots.mjs` (`D\slots.log`) | 952 lời gọi `t()` tĩnh | 0 thiếu slot ngoài 4 khuôn cố ý như lượt 3–4 và `extraction.proposed` (gói C) | — |
| Code lặp của đợt sửa (đọc diff + `git grep`) | gói D | Vòng gọi listener: 1 chỗ (`listeners.ts`, gói B). Cặp class `aria-disabled:` một chỗ (`Button.tsx`). `min-w-0 wrap-anywhere` 3 lần trong `TeamScreen.tsx`: tổ hợp utility, không đáng tách. Không lặp mới ≥ 3 nơi | — |
| Bundle (`D\dist-base`, cùng cách `baseline.md`; neo 15/09/2026) | `assets/*` | `index.js` 892 194 B (baseline 892 184, +10 B của chuỗi neo), `index.css` 30 295 B (= baseline; +543 B so lượt 4, gồm `has-checked:font-semibold`, `has-disabled:line-through`, `aria-disabled:*`, `py-1.25`, `px-2.75`). `token-guard.ts` không vào bundle (`grep hardcoded-separator`: 0 / 5 file JS) | — |
| Dependency | `package.json` các package, lockfile | `git diff --stat 2e51e25 37a80b6 -- package.json pnpm-lock.yaml apps/desktop/package.json packages/ui/package.json` rỗng | — |

Không có đề xuất refactor mới.

### 6.2 Hiệu năng

Máy: Home PC `DESKTOP-KDURKJP`, Node v24.20.0, Edge (Playwright) headless 1 440 × 900. Song song: Codex đợt 1 (2 tiến trình `codex`), CPU 8–20 % lúc đo; không chạy exe, không `pnpm e2e`. Dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (nhập qua Cài đặt → Dữ liệu → Nhập backup ở bản web; qua `importBackup` trong Node). Luật nhiễu: xấu hơn khi > 20 % **và** > 10 ms. Ngưỡng `phase-6.md`: thao tác màn < 200 ms.

**Trên màn** (`D\p08-web-perf.mjs` = probe lượt 2–4, bản ghim `D\dist-real` 127.0.0.1:4720; hai lần liền nhau, `D\p08-web-perf-{1,2}.log`; trung vị n = 6). Cột lượt 4: cặp "Mới 1 / mới 2" (bản `2e51e25`) của báo cáo gốc Claude D lượt 4 §6.2, cùng máy, cùng probe (lượt 4 cũng đo lúc Codex chạy song song, CPU 19 %).

| Thao tác (bản web, dữ liệu tải) | Lượt 5 lần 1 / 2 | Lượt 4 (mới 1 / 2) | Δ lớn nhất | Ngưỡng | ID |
|---|---|---|---|---|---|
| Đọc file → hộp 10c / Thay dữ liệu | 1 208 · 46 / 1 320 · 35 ms | 1 124 / 1 126 · 32 / 33 | +196 ms (+17 %) | ≤ 2 000 / ≤ 500 ✅ | — |
| Thẻ kanban → hồ sơ | 28,6 / 28,9 | 22,3 / 23,7 | +6,6 ms (dưới 10 ms) | < 200 ✅ | — |
| 5c mở / một phím / chọn RE / Hủy | 8,5 · 1,1 · 1,4 · 3,3 / 7,9 · 1,2 · 2,0 · 4,5 | 5,7 · 1,1 · 1,5 · 2,5 / 6,3 · 1,1 · 1,2 · 3,0 | +2,8 ms | < 200 ✅ | — |
| 7a mở / chọn Trường / một phím / **Lưu ghi chú** | 5,4 · 0,9 · 0,6 · 18,9 / 4,0 · 1,1 · 0,6 · 24,0 | 4,6 · 0,7 · 0,3 · 18,2 / 4,5 · 0,7 · 0,3 · 19,0 | +5,8 ms | < 200 ✅ | — |
| Hồ sơ → "← Khách hàng" sau một lần ghi | 52,1 / 51,2 | 44,6 / 48,1 | +7,5 ms (+17 %) | < 200 ✅ | — |
| "+ n KH" → bảng / Bảng → Kanban | 19,7 · 4,1 / 15,2 · 4,8 | 11,5 · 3,4 / 20,0 · 5,1 | +8,2 ms | < 200 ✅ | — |
| → Team / 9b Sửa → Xóa / 9b IS / → Khách hàng | 10,8 · 9,8 · 10,4 · 7,9 / 15,9 · 11,3 · 10,3 · 9,3 | 10,4 · 8,9 · 8,9 · 7,3 / 11,1 · 9,4 · 8,7 · 8,4 | +5,5 ms | < 200 ✅ | — |

**Hàm / lệnh đọc mà màn gói D gọi** (`node --import ./hooks.mjs D\p10b-perf.mjs`, `D\p10b-perf.log`; `importBackup` 983 ms; 1 481 KH sống, 10 255 lịch, 51 nhân sự, 113 dòng Thùng rác): 9b `personUsage` 3,63 ms (lượt 4: 3,63), người bận nhất 4,43 (4,49), Thùng rác lớn 3,75 / 5,01 (3,86 / 5,75); `readProfile` 8,64 / 7,79 / 7,83 ms (8,39 / 10,46 / 7,61); `customerBoard` 1,48 (2,44); `kycTimeline` 0,03 (0,04); `countCustomerRecords` 0,14 / 0,11 (0,13 / 0,17). Không dòng nào xấu hơn theo luật nhiễu.

**Trên exe** (probe `e2e/perf` của bước chuẩn bị, `common\baseline.md`; không đo lại): `customers.view-table` 19 ms (mốc sau #656 20, G7 20, lượt 4 19), `customers.sort-name` 24 (23 / 23 / 24), `customer.open-ai` 20 (19 / 20 / 20), `reload.customers` 316 (336 / 308 / 317), `reload.team` 362 (355 / 350 / 359): không dòng nào ⚠️.

**Bộ chặn ký hiệu** (công cụ, không phải thao tác của app; `D\guard\guard-time.log`): `findHardcodedSeparators` trên 115 file / 676 966 ký tự mà `lint:tokens` quét, 20 vòng xen kẽ: bản ghim 13,50 ms, bản `2e51e25` (regex) 6,23 ms; cả lệnh `check-tokens.ts` 0,18 s. Không có ngưỡng; không ghi phát hiện.

Kết luận P gói D: không có phát hiện. Các chênh so lượt 4 trên bản web đều dưới 10 ms (luật nhiễu) và xa ngưỡng 200 ms; đường của các màn này không đổi code từ lượt 4 ngoài class (mục 3).

## 7. Bảng đếm mức × trục

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | | 0 |
| Low | | 1 (D3) | | | | | | | 1 (D2) | | 2 |
| Nit | | | 1 (D4) | | | | | | | 1 (D1) | 2 |
| **Tổng** | | 1 | 1 | | | | | | 1 | 1 | **4** |

Mỗi phát hiện đếm một lần ở trục đầu (D1: A, T; D2: T, A; D3: E, A). **CONFIRMED 4 / 4**, PLAUSIBLE 0, KNOWN 0. Mới do đợt sửa sau lượt 4: 1 (D2, PR #920); có từ trước (lượt 1–4 bỏ sót, hay Issue thu hẹp): 3 (D1, D3, D4). Bảng R: **R1 5 ĐÃ SỬA + 1 SỬA MỘT PHẦN** (DR6-145 → CLR5-D1); **R2 9 / 9 ĐÃ SỬA**. Đột biến: **34** (vitest 18, e2e 16), **34 bị giết**, 0 sống.

## 8. Đã xét, không thấy (theo trục)

- **R:** 6 dòng R1 và 9 dòng R2 (mục 2); 34 / 34 đột biến bị giết, gồm R109c, RB2c (sống ở lượt 4) và G9 (cách sửa ACCEPTED: ca ghim cắn); tái hiện lượt 4 chạy lại (`p13`, `p16`, `r1-37-guard`, `sep-scan`). Không HỒI QUY: 157 / 157 e2e, 161 / 161 vitest ở đối chứng.
- **E:** tên liền dài ở thân hộp thoại 5a / 5c / 5f / 9a / 9b / 9c (K7, không tràn), RE 30 chữ và tên dài có dấu cách (K8), dải lưu lỗi khi trang đã cuộn (K11), mở lại app ở các màn khác nhau (K12), giá trị có `{slot}` / `$&` (K13), CRLF trong template / comment (K6). Ngoài CLR5-D3 không thấy.
- **C:** bảng "Cổng KYC" và chương 1 / 2 của hướng dẫn khớp app (T-352, T-356); hàng "Chuyển nhóm" khớp mockup (T-344); chip của 5a / 5d / 9a / 7c khớp `.choice` (DR6-149); `customer.withCode` giữ khuôn của 9b (T-332). Ngoài CLR5-D4 không thấy lệch mockup mới.
- **D:** gói D không có lệnh `db` riêng; các đổi của đợt sửa chỉ là class, khóa i18n, listener focus và câu hỏi đóng app (không ghi dữ liệu). Hộp đóng app tự trả lời "retry" chỉ khi hàng đợi hết lỗi (C1–C3 bị giết); file cuối đủ dữ liệu: `claude\B.md` K4. Không thấy.
- **G:** gói D không có guardrail AI; hộp 3f / KYC Intelligence: gói C. Bảng cổng KYC của hướng dẫn kiểm trên màn (T-352). Không thấy.
- **S:** không ranh giới file / IPC mới ở gói D; tên nhập qua UI hiện như chữ ở mọi chỗ đã đo; mọi probe 0 request ra ngoài 127.0.0.1. Không thấy.
- **P:** mục 6.2 — không phát hiện P.
- **B:** mục 6.1 — export chết 0, khóa i18n chết 0, dependency không đổi, bộ chặn không vào bundle. Không phát hiện B.
- **T:** 34 đột biến bị giết; bộ chặn đối chiếu cây cú pháp (K2, K3) và cắm thử (K1) → CLR5-D2. Class của `DataTable` (`cellClass`…) chỉ e2e phủ: ACCEPTED, không báo lại.
- **A:** focus sau dải lưu / hộp đóng app (DR6-147, K11), chip bằng bàn phím và màu cưỡng bức (K10), nút `aria-disabled` giữ trong thứ tự Tab, mờ như nút `disabled` (T-337), cột tiêu đề ẩn vẫn có tên (`ui-datatable.test.tsx`), i18n (CLR5-D1, D2). Không thấy gì khác.

## 9. Phụ lục

### 9.1 Probe, log (mọi file ở `C:\workspace\deep-review-1-6-r5\claude\D\`)

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `r4copy\*.mjs` | công cụ / probe lượt 4 của Claude, chép nguyên theo tên (`Test-Path` từng tên) | — | gốc của các bản dưới |
| `list.mjs`, `files.txt` | danh sách 89 file gói D; diff `2e51e25..37a80b6` | `list.log`, `fix-numstat.log`, `fix-commits.log` | mục 3 |
| `build-dist.mjs`, `serve-dist.mjs`, `pw.config.mjs`, `browser.mjs`, `hooks.mjs` | bản web ngoài repo (Vite `build()` + hook `load`), `vite preview`, cấu hình Playwright, bộ trình duyệt (chặn mạng, `asExe`), loader TS (chỉ đổi `r4` → `r5`, cổng) | `e2e-control-base.log`, `serve-4711.log`, `serve-4720.log` | mọi probe |
| `mut-defs.mjs`, `mut-list.mjs`, `check-muts.mjs`, `mutant-config.mjs`, `mutjs.mjs`, `e2e-mut.mjs` | 34 đột biến (vitest qua hook `load`; TSX qua bản dựng đột biến, cổng 4712–4719) | `vitest-control-D.log`, `mutjs.log`, `e2e-mut.log`, `mut\<id>.out`, `mut\<id>-<n>.e2e.out` | mục 2, 9.2 |
| `r1-37-guard.mjs`, `sep-scan.mjs` | dạng nào bộ chặn báo; ký hiệu viết thẳng trong code gói D (probe lượt 4) | `r1-37-guard.log`, `sep-scan.log` | DR6-37, DR6-145, CLR5-D1 |
| `guard\run-guard.mjs`, `wrap-src*.tsx`, `wrap-fmt*.tsx` | bộ chặn trên mẫu trước / sau Prettier | `guard-wrap.log` | CLR5-D2 |
| `guard\plant-forms.mjs`, `plant-forms.json` | cắm dấu nối ở 510 chỗ thật, format, xác định dạng qua cây cú pháp | `plant-forms.log` | K1, CLR5-D2 |
| `guard\ast-compare.mjs`, `ast-debug.mjs`, `plant-one.mjs` | báo nhầm trên 356 file so cây cú pháp (phần 1); bản debug và cắm một chỗ để xem dạng | `ast-compare.log`, `ast-debug.log` | K2 |
| `guard\guard-copy.ts`, `guard-state.ts`, `end-state.mjs` | bản chép có đo trạng thái cuối file | `end-state.log` | K3 |
| `guard\remainder.mjs`, `jsx-near.mjs`, `t333-variants.mjs`, `r145a.mjs` | dạng "missed" + escape / thực thể; dấu nối cạnh phần tử; biến thể T-333; dòng dữ kiện về chữ JSX | `remainder.log`, `jsx-near.log`, `t333-variants.log`, `r145a.log` | K4–K6, DR6-145 |
| `guard\guard-2e51e25.ts`, `guard-time.mjs` | thời gian bộ chặn ghim ↔ `2e51e25` | `guard-time.log` | 6.2 |
| `p13-retry-focus.mjs`, `p16-close-question.mjs` | tái hiện DR6-147 của lượt 4 | `logs-p13-retry-focus.log`, `logs-p16-close-question.log` | DR6-147 |
| `p20-long-bodies.mjs`, `p21-overflow-culprits.mjs`, `p21b-profile-culprit.mjs`, `p21c-profile-boxes.mjs`, `p22-long-more.mjs` | tên liền dài ở thân hộp thoại và màn gói D | `logs-p20-long-bodies.log`, `logs-p21-overflow.log`, `logs-p21b-profile.log`, `logs-p21c-profile-boxes.log`, `logs-p22-long-more.log` | K7, K8, CLR5-D3 |
| `p23-guide-rows.mjs` | bảng cổng KYC của hướng dẫn; mở lại màn dùng cuối | `logs-p23-guide-rows.log` | T-352, T-356, K12 |
| `p24-choices.mjs`, `p26-choices-keys.mjs` | kiểu chip ngoài 5a / 5d, 7c so mockup; bàn phím, màu cưỡng bức | `logs-p24-choices.log`, `logs-p26-choices-keys.log` | DR6-149, K9, K10, CLR5-D4 |
| `p25-strip-scrolled.mjs` | dải lưu mất khi trang đã cuộn | `logs-p25-strip-scrolled.log` | K11 |
| `p27-factline.mjs` | `kyc.factLine` với `{slot}` / `$&` | `logs-p27-factline.log` | K13 |
| `p08-web-perf.mjs`, `p10b-perf.mjs` | thời gian màn (bản web), hàm / lệnh đọc (Node), probe lượt 2–4 | `p08-web-perf-{1,2}.log`, `p10b-perf.log` | 6.2 |
| `r1-exports.mjs`, `r1-keys.mjs`, `r1-slots.mjs` | export / khóa / slot i18n (probe lượt 4) | `exports.log`, `keys.log`, `slots.log` | 6.1 |

**Lần chạy hỏng của probe (lỗi probe, không phải sản phẩm; kết quả lần hỏng không dùng):** `p20` lần đầu chọn RE bằng `selectOption({ label })` trong khi nhãn ô chọn là "<tên> · <team>" (hết giờ); chạy lại chọn theo chữ chứa tên. `p20` lần hai dừng ở 9b vì đợi tên hộp sai cách đọc (`p22` làm lại 9b). `p23` lần đầu đóng trang ngay sau khi bấm Team (màn chưa kịp lưu `p2c.lastRoute`): chạy lại chờ tiêu đề. `p16` dừng ở bước đọc câu của hộp sau khi hộp đã tự đóng (đúng phần sửa; kết quả cần đã in trước đó). `plant-forms.mjs` hai lần đầu nhận dạng dạng A bằng tìm chuỗi `}: {` trong cả file (dính chú thích kiểu `({ a }: { a: T })`) và lọc khoảng trắng bằng regex hỏng escape: số của hai lần đó bỏ; bản cuối xác định dạng qua cây cú pháp của file đã format. `ast-debug.mjs`, `guard-time.mjs` lần đầu lỗi cú pháp do escape trong heredoc (sửa bằng Edit). `p24` mục 7b chọn nhầm nhóm (tên "Trường đã có giá trị" chứa "giá trị"): dòng đó không dùng. Bản chép có đo `guard-state.ts` cũng chèn dòng đo vào `findTokenViolations` (hàm không được gọi trong probe; không ảnh hưởng kết quả).

### 9.2 Đột biến (34, mọi đột biến bị giết)

- **Vitest (18, `D\mutjs.log`), cả 18 KILLED, mỗi lượt có `[mutant] served`:** G1, G2, G3, G4, G5, G6, G6b, G7, G7b, G8, G9, G10 (`token-guard.test.ts`), C1, C2, C3 (`close-guard.test.ts`), DT1 (`ui-datatable.test.tsx`), B1 (`ui-button.test.tsx`), K1 (`team-view.test.ts` + `trash-view.test.ts`).
- **E2e (16, `D\e2e-mut.log`), cả 16 KILLED:** C4 (`save-state.spec.ts:225`), S1 (`:202`), S2 (`:177`), RB2c (`:177`), R109c (`customer-forms.spec.ts:387`), D1 (`long-names.spec.ts:70`, `:106`), D2 (`:106`), T1 (`:146`, `:186`), T2, T3, T4, T6 (`:146`), T5 (`:186`), DT1e (`:146`, `:186`), CH1, CH2 (`theme.spec.ts:243`).
- Đối chứng: bản ghim 16 spec gói D + `long-names` 157 / 157; vitest 9 file 161 / 161.

### 9.3 Ranh giới đọc

- Chỉ mở theo tên đầy đủ: `common\{prompt-claude.md, plan.md, known.md, fixes.md, baseline.md}`, `common\load\load-2026-10-12-seed6.p2cbackup`; báo cáo lượt 5 của Claude `claude\{A,B,C}.md` (bước 0 đọc dòng đầu; B đủ, A / C mục ID phát hiện); probe lượt 4 của chính Claude ở `deep-review-1-6-r4\claude\D\` (26 file, `Test-Path` từng tên rồi chép).
- **Ghi rõ một chỗ lệch chữ quy tắc 2:** đầu phiên (trước bước chép) đã chạy `ls` trên `C:\workspace\deep-review-1-6-r4\claude\` và `…\claude\D\` (thư mục probe của chính Claude, được đọc theo quy tắc 3), tức liệt kê một thư mục con của `deep-review-1-6-r4\`. Kết quả chỉ là tên file probe của Claude (`A`…`E`, `*.md`, `*.mjs`, `dist-*`). Không liệt kê, không tìm kiếm `C:\workspace\`, `deep-review-1-6*\` ở cấp khác; không mở thư mục `codex\` / `deepseek\` / `muse\` nào; không đọc báo cáo lượt 5 của bên khác.
- Tìm kiếm chỉ trong repo (mã, `docs/`) và trong từng file được phép đọc.

### 9.4 Cuối phiên

- Repo: không ghi file nào của worktree (mọi đột biến qua hook `load` hoặc bản dựng ngoài repo; mọi probe ghi dưới `claude\D\`). `git rev-parse HEAD` cuối phiên: `37a80b662861d308a110d1e2b0f65ad13b91fb51` (= SHA ghim). **`git status --short` cuối phiên: rỗng** (như đầu phiên).
- Đã dừng hai máy chủ `serve-dist` của phiên (4711, 4720; 4712–4719 do `e2e-mut.mjs` tự dừng); kiểm lại: không cổng 4700–4730 nào nghe, không Edge headless nào của probe còn chạy. Không chạy exe, không dùng cổng 4173.
- Không gọi dịch vụ AI, không đọc key, không mở chatgpt.com: AI trong probe là OpenCode giả của `asExe` (`window.exe.aiContent`) hoặc Mock / ChatGPT web không bấm; mọi log trình duyệt 0 request ra ngoài 127.0.0.1 / localhost.
- Giờ xong: 2026-11-05 00:48 (+07:00).
