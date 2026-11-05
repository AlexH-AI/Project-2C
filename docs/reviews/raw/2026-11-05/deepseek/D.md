XONG — deepseek gói D lượt 5, 11:14 05/11/2026

# Deep review Phase 1–6, lượt 5 — DeepSeek, gói D (Màn nhập liệu)

## 1. Phiên

- **Bên / gói:** deepseek / **D — Màn nhập liệu**.
- **SHA đầu phiên:** `37a80b662861d308a110d1e2b0f65ad13b91fb51` (`37a80b6`) — khớp SHA ghim trong `common\baseline.md`.
- **`git status --short` đầu phiên:** rỗng (không có dòng nào).
- **Giờ bắt đầu:** 10:59 05/11/2026 (+07:00), máy `DESKTOP-KDURKJP`.
- **App WorkBuddy:** v5.9.4 (theo `common\baseline.md`, mục "Ghi chú của Claude sau phiên thử"); expert **CodeReviewExpert** (khối expert của ngữ cảnh phiên); model **DeepSeek-V4.1-Flash**; context **1M**; mức suy luận **Max** (Owner ghi từ giao diện, `baseline.md`); chế độ quyền **Default**.
- **Node:** `"C:\Program Files\nodejs\node.exe" --version` → **v24.20.0** (≥ 24, không dừng). Mọi lệnh `node` / `vitest` / `playwright` / `check-tokens` trong phiên đặt `C:\Program Files\nodejs` lên đầu `PATH` ngay trong lệnh đó.
- **Công cụ:** đọc file, PowerShell / Git Bash của app, Playwright, script `node` trong `…\deepseek\D\`. Không skill, không connector, không mạng ngoài.

## 2. Bảng R

### 2.1 R1 — theo mã (6 dòng của gói D)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-37 | #790 → #845, #901 → #920 | **ĐÃ SỬA** | Vị trí đầu tiên của lượt 1 (`docs/reviews/raw/2026-10-15/claude/D.md:142`, L·CL-D5: "{trường}: {giá trị}") nay là khóa `kyc.factLine` (`vi.ts:98`, `CustomerKyc.tsx:95`). Ba vị trí còn lại cũng qua i18n: `CustomerKyc.tsx:170, 243, 317` dùng `sep.list`, `KycDialogs.tsx:125-131` dùng `kycNote.currentValue` + `sep.semicolon`, `:533` dùng `kycConfirm.quoted`. Quét JSX text / thuộc tính chuỗi của 67 file `.tsx` trong gói (`D\jsx-text-scan.mjs`, TypeScript API): **0** dấu `· → ✓ ○ × ▾ ▸ — – … ←` / `, ` / `: ` / ngoặc kép viết thẳng. **Gỡ sửa** (M10, đặt lại `{t(\`kycField.…\`)}: {factText(…)}`): `check-tokens.ts` **đỏ** — `CustomerKyc.tsx:95 hardcoded-separator }: {` | Bộ chặn nay bắt đúng dạng này, nên đường cũ không quay lại được. Lượt 4 sót vị trí này vì chấm theo danh sách Issue #790 |
| DR6-145 | #901 → #920 (+ #934 → #965, #969 → #971, #973 → #975) | **SỬA MỘT PHẦN** | (a) `: ` của thẻ Dữ kiện KYC: xong (xem DR6-37). (b) bộ chặn bắt thêm: `.join(', ')`, `a + ', ' + b`, `` `${a}, ${b}` ``, chữ JSX `}, {` / `}; {` / `}: {` — **gỡ sửa M1** (bỏ bộ đếm `types`) **đỏ 2 ca**, **M2** (bỏ vế báo JSX) **đỏ 3 ca**. (c) cắt comment: `token-guard.ts:100-132` là máy trạng thái biết chuỗi; ba ca `'https://…'`, `'a /* b'`, `'*/ ✓'` xanh. **Còn hở:** bốn dạng cuối của (b) vẫn không bắt — `D\guard-probe.mjs`: `"a ← b"`, `"a – b"`, `"a…"`, `"a“b”"` đều **silent**; `'✓○×▾▸—'` (`token-guard.ts:99`) thiếu `←` (U+2190) dù `→` (U+2192) có, và `vi.ts` dùng cả hai (`customer.back`, `sep.arrow`), `…` (`aiPanel.running`), `–` (`sep.range`). Xem **DSR5-D1** | Mã hóa bằng escape (`'\u00b7'`) vẫn im lặng, nhưng đó là giới hạn đã ghi ở doc comment (`token-guard.ts:61`) và Issue #901 nói rõ ngoài phạm vi |
| DR6-146 | #902 → #922 (a), #898 → #911 (b) | **ĐÃ SỬA** | (a) ca e2e mới `e2e/customer-forms.spec.ts:383` "refuses a name broken in a paste … when editing the profile (5c)" — xanh ở phiên này; **gỡ sửa M12** (`name: customer ? normalizeText(name) : name`, đúng đột biến R109c của lượt 4): ca **đỏ** ở `:397` ("Chữ có ký tự không lưu được" không hiện). (b) `e2e/save-state.spec.ts:177` "Thử lại leaves the focus where the user moved it … (DR6-146)" — xanh; **gỡ sửa M13** (`.then` luôn đưa focus về tiêu đề, đúng RB2c): ca **đỏ** ở `:191` `expect(moved).toBeFocused()` | Cả hai nhánh đều có ca đỏ khi gỡ phần sửa, đúng yêu cầu của dòng R |
| DR6-147 | #898 → #911 | **ĐÃ SỬA** | (a) `SaveWarning.tsx:34-42` nghe hàng đợi, focus trong dải → tiêu đề. **Gỡ sửa M5e** (bỏ `subscribe`): e2e `save-state.spec.ts:202` **đỏ** — 33 lần `locator resolved to <h1 …>Team & nhân sự</h1>` mà `toBeFocused()` không đạt. (b) `close-guard.ts:44-61` `askWhileFailed`. **Gỡ sửa M4** (chỉ `show(answer)`, không nghe): `close-guard.test.ts` **đỏ 2 ca**. e2e `save-state.spec.ts:225` xanh (hộp gỡ, cửa sổ đóng, `MutationObserver` không thấy câu "chương trình khác") | Đột biến M5 ở mức unit **sống** (không có unit test cho `SaveWarning`), chỉ e2e giết — đúng thiết kế, ghi ở mục 9.1 |
| DR6-148 | #902 → #922 (+ #932 → #941, #951 → #958) | **ĐÃ SỬA** | (a) `DataTable.tsx:168-170, 178` — `th` của cột `headerHidden` có `relative`; **gỡ sửa M3**: `ui-datatable.test.tsx` **đỏ**. (b) màn Team: `TeamScreen.tsx:165-176` (`items-baseline`, `wrap-anywhere`, `shrink-0`), `:296-330` (`flex-wrap`, `min-w-0 wrap-anywhere`, hai nút gom `ml-auto`); **gỡ sửa M11** (bỏ `flex-wrap`): `long-names.spec.ts:207` **đỏ** ("title at 1100" phải 1 dòng). (c) So sánh team và (d) Báo cáo: e2e `long-names.spec.ts:211, 231` xanh ở phiên này. (a) tiêu đề/phụ đề hộp thoại: `Dialog.tsx:84`; e2e `:70, 106` xanh | Tên TL dài ở hàng tiêu đề thẻ team: dấu "·" đứng riêng dòng — ACCEPTED (Owner 02/11, `known.md` phần 1), không báo lại |
| DR6-149 | #901 → #920 (+ #905 → #928, #935 → #948) | **ĐÃ SỬA** | `Choices.tsx:54` khớp `.choice` của `forms.css:261-284` ở cả bảy điểm lượt 4 nêu: nền `bg-surface-2` (`--bg-2`), viền `border-border-strong`, bo `rounded-sm` = `--radius-sm` = `--corner-sm` = 6 px, đệm `px-2.75 py-1.25` = 11/5 px, chữ `text-fg-2`, ô đang chọn `font-semibold text-fg` + `border-accent bg-accent-soft`, ô tắt `opacity-40 line-through`. e2e `theme.spec.ts:243` đo `getComputedStyle` của chip ở 5a và 5d (nền / viền / bo / đệm / cỡ chữ / màu / đậm 600 / `opacity 0.4` / `line-through`) và tương phản AA — **xanh**. **Gỡ sửa M7e** (đặt lại class cũ): ca e2e **đỏ** ở `:237` | Unit `ui-choices.test.tsx` chỉ kiểm `aria-required`, không kiểm class; chốt chặn là e2e `theme.spec.ts` — đúng như test chấp nhận của #901 |

### 2.2 R2 — theo Issue (9 dòng của gói D)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-331 | #932 → #941 | **ĐÃ SỬA** | Mục 1 (`th` `relative`, bỏ `relative` ở khung cuộn Team): M3 đỏ. Mục 2 (`flex-wrap` + `min-w-0 wrap-anywhere` + hai nút gom): M11 đỏ. Mục 3 (`items-baseline`): **gỡ sửa M14** (đặt lại `items-center` cho nút team) → `long-names.spec.ts:171` **đỏ** ("count at 1100", `Math.abs(top(count) - tops[0]) ≤ 3`). Mục 4 (phụ đề hộp thoại): `long-names.spec.ts:106` xanh | M14 chỉ đỏ ở ca "a team and an IS of 160 letters" (số đếm), không ở ca TL 160 chữ — đúng phạm vi mục 3. Kiểm `DataTable` ở ba chỗ khác có cột ẩn (`CustomerAppointments`, `SettingsTrash`): không khung cuộn nào bọc bảng, nên `relative` không đổi hình |
| T-332 | #933 → #946 | **ĐÃ SỬA** | Phần gói D: mục 3 (một khóa i18n cho "<tên> (<mã>)"). `vi.ts:78` `customer.withCode`, gọi ở `team-view.ts:133` (`inUseHelp`) và `trash-view.ts:227` (`restoreLabel`); hai khóa cũ `person.inUseTrashCoded` / `trash.restoreLabel.coded` đã xóa (grep 0). **Gỡ sửa M8** (`'{name} · {code}'`): `team-view.test.ts` + `trash-view.test.ts` **đỏ 2 ca**. Mục 4 (chú thích e2e Thùng rác) và mục 6 (`listeners.ts`) là của gói E / B | Mục 1 (`parseTime`), 2 (focus "Chọn file…") thuộc E; mục 5 (`readsBackAsIs`) thuộc A. Khối codemap hai `CLAUDE.md` khớp (`codemap:check` trong `pnpm verify` của `baseline.md`) |
| T-333 | #934 → #965 | **ĐÃ SỬA** | Mục 1 (`{` sau `>` của kiểu generic): `token-guard.ts:76-81, 135-136, 154-156` — bộ đếm `types`; ca "reads the `{` after the type arguments of a name as code" ghim `Promise<void> {}`, `extends Foo<Bar> {}`, kiểu lồng có `=>`, và hai ca JSX vẫn báo. **Gỡ sửa M1** (bỏ `types++`): **đỏ 2 ca**. Mục 2 (`\` trước CRLF): `:102-105`; ca CRLF chỉ báo `·` ở dòng 3. Mục 3 (`globMeetsFolder`) thuộc F | Đo trên repo: `pnpm lint:tokens` xanh (`baseline.md`, cổng `pnpm verify`); 0 khác so bản trước trên 356 file là số của thân PR, phiên này không chạy lại |
| T-337 | #951 → #958 | **ĐÃ SỬA** | Mục 2 (dáng nút `aria-disabled` ở `Button`): `Button.tsx:25` có cặp `aria-disabled:cursor-default aria-disabled:opacity-50` cạnh cặp `disabled:`; `ConfirmButton` và nút "Chọn file…" không còn `className`; grep `aria-disabled:` trong `apps/desktop/src` + `packages/ui/src` (bỏ test): chỉ còn 3 dòng của `Button` và hai chỗ đặt thuộc tính. **Gỡ sửa M6**: `ui-button.test.tsx` **đỏ**. Mục 3 (e2e tiêu đề team một dòng): chính là vế `lineTops(card, 'Team Bình Minh')` mà **M11 giết** | Mục 1 (`parseTime` đọc giờ có ký tự vô hình) thuộc gói E (`appointment-form.ts`) — không kiểm ở đây |
| T-341 | #969 → #971 | **ĐÃ SỬA** | `token-guard.ts:78-80` comment nêu cả `one<b>`, `one</b>`, `one<br />` và hậu quả (chỉ bỏ sót); ca ghim `token-guard.test.ts:175-184`. **Gỡ sửa M9** (thêm `source[i+1] !== '/'`, tức đúng hướng sửa đã ghi ở mục ACCEPTED của Issue #969): ca ghim **đỏ 1** — ca này thật sự "cắn" | Đúng như thân PR #971 nói: ca xanh ngay vì hành vi không đổi, nên phải đột biến mới thấy nó bắt được thay đổi |
| T-342 | #973 → #975 | **ĐÃ SỬA** | Mục 1: `docs/metrics/phase-6.md:336` câu phạm vi mới ("Tới 03/11/2026 (T-342): 324 PR … từ #515 tới #974; 112 … có code hoặc test"), bốn dòng bảng chính `#917, #937, #939, #944` (`:363-366`), gạch "Không xét" thêm #863, #894 (`:343`), gạch tổng "23 / 112" (`:378`) khớp hai bảng. Mục 2: `token-guard.test.ts:177` có dòng `<p>one<b>{a}, {b}</b></p>` | Kiểm lại số: 19 + 4 = 23 dòng bảng chính, 8 + 4 = 12 ở bảng phụ, tổng 23 / 112 — khớp `:378-380`. Không chạy lại lệnh đếm `gh` (prompt cấm `gh`) |
| T-344 | #980 → #981 | **ĐÃ SỬA** (tài liệu) | `docs/user-guide/README.md:75` hàng "Chuyển nhóm" nay ghi `customer-forms.html` 5d–5e; các hàng khác của bảng không đổi (đọc cả bảng) | Issue chỉ một ô; không có gì để chạy |
| T-352 | #1004 → #1007 | **ĐÃ SỬA** (tài liệu) | `docs/testing/nghiem-thu-v1.md:23` danh sách dòng cần lịch Chưa ghi kết quả nay có NT-LH-15 và NT-KH-09; `:29` chú giải có `L1 ⚠️`; `:39` ô Phạm vi dòng L2 nêu đủ 6 dòng còn phần Owner; NT-AI-03 không còn "Xem ở Dữ kiện KYC →" (`docs/user-guide/06-ai.md:29` chỉ còn ở hàng `CONFLICT_RESOLUTION`) | Khớp app: `KycIntelligence` chỉ hiện `aiPanel.toKyc` khi cổng `CONFLICT_RESOLUTION` (đọc code, `:432` nhắc cùng hành vi) |
| T-356 | #1019 → #1023 | **ĐÃ SỬA** (tài liệu) | `docs/user-guide/01-bat-dau.md:8` "rồi vào màn bạn dùng lần cuối … Lần mở đầu tiên trên một máy, app vào màn **Tổng quan**", `:10` giải thích `localStorage` dùng chung theo máy. Ô Exe (SHA) dòng L3 nay là mốc SHA (`3d237b0` … `331e7a0`) | Khớp app: `apps/desktop/src/shell/useRoute.ts` đọc `p2c.lastRoute`; e2e "reopening the app returns to the last screen" xanh trong `pnpm e2e` của `baseline.md` |

## 3. Phạm vi đã đọc

- **Diff `2e51e25..37a80b6` của gói D** — 16 file, +208 / −73 dòng SP (12 file) và +276 / −2 dòng test (4 file), xếp gói bằng `classifyFile` của `tools/size-report-core.mjs` (`D\cls.mjs`, khớp bảng §L5.3 và `baseline.md`): `i18n/vi.ts`, `routes/customers/CustomerKyc.tsx`, `routes/team/TeamScreen.tsx`, `routes/team/team-view.ts`, `shell/CloseGuard.tsx`, `shell/SaveWarning.tsx`, `shell/close-guard.ts`, `packages/ui/src/components/{Button,Choices,DataTable,Dialog}.tsx`, `packages/ui/src/token-guard.ts`; test: `shell/close-guard.test.ts`, `ui-button.test.tsx`, `ui-datatable.test.tsx`, `token-guard.test.ts`. Đọc **toàn bộ diff** từng file.
- **Đọc trọn:** `packages/ui/src/token-guard.ts` (163), `packages/ui/src/components/DataTable.tsx` (243), `Choices.tsx` (76), `Dialog.tsx` (95), `table-view.ts` (55), `apps/desktop/src/shell/{SaveWarning.tsx (77), CloseGuard.tsx (94), close-guard.ts (61), SaveWarning.test.tsx (50), close-guard.test.ts (176 — phần `askWhileFailed`)}`, `apps/desktop/src/data/persist-queue.ts` (142), `apps/desktop/src/i18n/index.ts` (71), `apps/desktop/src/routes/team/{TeamScreen.tsx (348 — phần đầu và 150–330), team-view.ts:100–160, PersonDialogs.tsx:1–245}`, `apps/desktop/src/routes/customers/{CustomerKyc.tsx (đọc dòng 90–110 và các chỗ `join`), CustomerDialogs.tsx:215–250}`, `apps/desktop/src/routes/classes.ts`, `apps/desktop/src/i18n/vi.ts` (các khóa `sep.*`, `customer.*`, `kyc.*`, `trash.*`, `person.*`).
- **Đọc phần liên quan:** `e2e/{long-names, save-state, dialog-keyboard, theme, customer-forms}.spec.ts` (các ca của R1/R2), `playwright.config.ts`, `package.json`, `docs/design/mockups/forms.css` (`.choice`), `docs/metrics/phase-6.md` mục "Kích thước PR vượt ngưỡng", `docs/user-guide/{README.md, 01-bat-dau.md, 06-ai.md}`, `docs/testing/nghiem-thu-v1.md` (các dòng của T-352 / T-356).
- **Báo cáo lượt 1–4 đã đọc để không báo lại:** `docs/reviews/raw/2026-10-15/claude/D.md` (CL-D5), `docs/reviews/raw/2026-10-31/{claude,codex}/D.md`, `docs/reviews/2026-10-31-deep-review-phase-1-6-luot-4-tong-hop.md` §5.2, §6.4, §6.5.
- **Chạy:** unit 21 file / 166 test của gói (`vitest run packages/ui apps/desktop/src/shell apps/desktop/src/routes/team apps/desktop/src/i18n apps/desktop/src/ui-button.test.tsx apps/desktop/src/ui-datatable.test.tsx`) — xanh; e2e 24 ca của `save-state`, `long-names`, `dialog-keyboard` — xanh; 14 đột biến (mục 9).

## 4. Kịch bản mới đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | Bộ chặn ký hiệu gặp bốn dạng cuối của DR6-145 (b): `"a ← b"`, `"a – b"`, `"a…"`, `"a“b”"` | **Im lặng** cả bốn — phần (b) của DR6-145 chưa xong; `vi.ts` dùng đủ bốn ký tự này (`customer.back`, `sep.range`, `aiPanel.running`) | DSR5-D1 |
| 2 | Bộ chặn gặp `text.split(', ')` và `text.replace(', ', '; ')` — nối / cắt chữ kỹ thuật, không phải dấu nối UI | **Báo** `', '` và `'; '` — báo nhầm; `.join(', ')` và `.split(', ')` không phân biệt được | DSR5-D2 |
| 3 | Bộ chặn trên **toàn repo**: 356 file `.ts/.tsx` đã track, 3 184 337 ký tự | 1 359 lần báo, `pnpm lint:tokens` xanh — không có báo nhầm nào trên code hiện tại | — |
| 4 | Quét JSX text + thuộc tính chuỗi của 67 file `.tsx` trong gói (TypeScript API), tìm `· → ✓ ○ × ▾ ▸ — – … ←`, `, `, `: `, ngoặc kép viết thẳng | **0** — DR6-37 hết ở mức nguồn, không chỉ ở mức bộ chặn | — |
| 5 | Đột biến **từng** phần sửa của 6 dòng R1 và 9 dòng R2 rồi chạy lại đúng ca giữ hành vi (14 đột biến, mục 9) | 12 **KILLED**; 2 sống ở mức unit nhưng **KILLED** ở e2e (M5 / M5e, M7 / M7e) | — |
| 6 | Hộp đóng app: một lần lưu khác **thành công** trong lúc hộp đang hỏi (đường DR6-147 (b)) và một lần **lỗi** | Hộp gỡ + cửa sổ đóng khi thành công; hộp ở lại khi lỗi — đúng hợp đồng `askWhileFailed` (`close-guard.test.ts:119-148`) | — |
| 7 | `fillSlots` với giá trị "độc": `$& $' $\` $1`, `{value} {field}`, tên 120 ký tự trong `kyc.factLine` | Ghép nguyên văn, không thay lại `{…}`, không hiểu `$`; `'Hôn nhân: $& $' $\` $1'` đúng từng ký tự | — |
| 8 | `ConfirmButton` bấm Enter trong ô chữ lúc đang chạy (nút `aria-disabled` vẫn `type="submit"`) | `ConfirmWordDialog`'s `onSubmit` chặn (`!confirmed \|\| running`), không chạy hai lần | — |

## 5. Phát hiện mới

```
ID: DSR5-D1
Mức: Low
Trục: T
Vị trí: packages/ui/src/token-guard.ts:99 (37a80b6)
Tình trạng: CONFIRMED
Liên quan: DR6-145 (b) · có từ trước, lượt 1–4 bỏ sót; phần sửa #920 → #965 → #971 → #975 chỉ đóng bốn dạng nối tay
Kịch bản: 1
Mô tả: Bộ chặn ký hiệu vẫn không bắt `←` (U+2190), `–` (U+2013), `…` (U+2026) và ngoặc kép cong — bốn dạng
  DR6-145 (b) liệt kê đích danh. Tập ký hiệu là một chuỗi viết cứng `'✓○×▾▸—'` (`:99`) cộng `·` / `→`
  (`:98`); `→` có mà `←` không, dù `vi.ts` dùng cả hai (`sep.arrow` `:6`, `customer.back` `:64`), và
  `–` / `…` cũng là ký hiệu của app (`sep.range` `:7`, `aiPanel.running` `:156`).
Tái hiện / bằng chứng: `D\guard-probe.mjs` (nạp `token-guard.ts` qua `ts.transpileModule`, gọi
  `findHardcodedSeparators`) — `"a ← b"`, `"a – b"`, `"a…"`, `"a“b”"`, `"'\\u00b7'"` đều trả `[]`,
  trong khi `"a · b"` trả `hardcoded-separator:·`. Trên code hiện tại không có chỗ nào viết thẳng bốn
  ký tự đó (kịch bản 4: 0), nên đây là lỗ của bộ chặn, không phải lỗi đang thấy trên màn.
Ảnh hưởng: người viết code sau này đặt `…` hay `←` thẳng trong JSX thì `pnpm lint:tokens` xanh, tức
  quy tắc i18n (mọi dấu đi qua `sep.*` / `vi.ts`) không còn được giữ; DR6-37 quay lại được qua đúng
  đường mà nó đã đi.
Đề xuất: thêm `←–…` và `“”‘’` vào chuỗi ký hiệu ở `:99` (một dòng), hoặc một bảng `MARKS` cạnh
  `RULES`; thêm ca test cho từng ký tự. Cỡ ≤ 10 dòng, không đổi chữ ký. Dạng escape (`'\u00b7'`) và
  regex literal vẫn là giới hạn đã ghi ở doc comment — giữ nguyên.
Ghi thêm (cùng probe, cùng họ, không tính vào mức của dòng này): `: ` chỉ được báo khi nó đứng ngay
  sau một `}` vừa đóng JSX (`:147`), nên `<p>{a}: b</p>` và `<p>a: {b}</p>` cũng im lặng. DR6-145 (b)
  không liệt kê hai dạng này và code hiện tại không có (kịch bản 4: 0), nên ghi lại chứ không mở mức.
```

```
ID: DSR5-D2
Mức: Nit
Trục: T
Vị trí: packages/ui/src/token-guard.ts:53, :107 (37a80b6)
Tình trạng: CONFIRMED
Liên quan: DR6-145 (b) · mới do đợt sửa sau lượt 4 (PR #920) — luật `JOINER` mở rộng
Kịch bản: 2
Mô tả: `JOINER = /^[,;] $/` xét một chuỗi (hay một khúc template) **đứng một mình**, không xét nó là
  đối số của hàm nào. Vì vậy `text.split(', ')` và `text.replace(', ', '; ')` — cắt / thay dấu phẩy
  trên chữ kỹ thuật — bị báo như dấu nối viết tay, trong khi `.join(', ')` mới là thứ DR6-37 cấm.
Tái hiện / bằng chứng: `D\guard-probe.mjs`: `"text.split(', ')"` → `hardcoded-separator:', '`;
  `"text.replace(', ', '; ')"` → hai lần báo (`', '`, `'; '`). `"const fields = text.split(',')"`
  (không dấu cách) thì im — nên chỉ dạng có dấu cách mới vướng.
Ảnh hưởng: người viết code sau này tách một chuỗi bằng `', '` (hay `'; '`) sẽ thấy `pnpm verify` đỏ
  ở một chỗ không phải lỗi; đường vòng là viết `/, /` hoặc dùng `t('sep.list')`. Hiện repo không có
  chỗ nào như vậy (kịch bản 3).
Đề xuất: chỉ báo khi chuỗi là đối số của `.join(` (đọc ngược vài ký tự trước `start`), hoặc ghi giới
  hạn này vào doc comment cạnh "does not read a regex literal". Cỡ ≤ 15 dòng.
```

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc gì | Trên cái gì | Kết quả | ID |
|---|---|---|---|
| `tsc -p packages/ui/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` | `packages/ui` (toàn bộ) | 0 lỗi, exit 0 | — |
| `tsc -p apps/desktop/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` | `apps/desktop` (toàn bộ) | 0 lỗi, exit 0 | — |
| `D\exports2.mjs` — mọi export của 12 file SP đã đổi, đếm chỗ dùng trên 356 file `.ts/.tsx/.mjs` đã track | 12 file của gói D | **0 export chỉ một chỗ dùng** (mọi tên có ≥ 2 lần xuất hiện) | — |
| Đọc `persist-queue.ts`, `listeners.ts` (qua diff), `close-guard.ts` | vòng gọi listener / `flush()` | Không còn bản chép thứ ba: `notify` dùng chung ở `AppData.changed`, `persist-queue.changed`, `AiJobs.changed` (T-332 mục 6). `askWhileFailed` chỉ một nơi gọi | — |
| Đọc `vi.ts` | hai khóa cũ `person.inUseTrashCoded` / `trash.restoreLabel.coded` | Đã xóa, `customer.withCode` thay cả hai (grep 0) | — |
| Bundle web (`baseline.md`, bảng bundle ở `37a80b6`) | `pnpm build:web` của bước chuẩn bị | `index.js` 892 184 B (+7 486 so lượt 4), `index.css` 30 295 B (+543), tổng JS/CSS +8 029 B. Không có chunk mới, không dependency mới | — |
| Đọc `DataTable.tsx`, `Choices.tsx` | nhánh không thể xảy ra | `hidden ? 'relative' : ''` và `has-*:` của chip đều là class, không thêm nhánh code | — |

Không có phát hiện B. Không đề xuất refactor nào.

### 6.2 Hiệu năng

Máy `DESKTOP-KDURKJP`, Node `v24.20.0`, chạy một mình (không có e2e / build song song lúc đo).

| Đã đo gì | Trên dữ liệu nào | Số | So mốc | ID |
|---|---|---|---|---|
| `findHardcodedSeparators` trên **toàn repo** (5 lần, trung vị) | 356 file `.ts/.tsx` đã track, 3 184 337 ký tự | **67,7 ms** (min 67,4 · max 68,2); 1 359 lần báo | Chưa có mốc riêng cho bộ chặn ở các lượt trước; đây là số đầu tiên. Nằm trong `pnpm lint:tokens` của `pnpm verify` (159 s ở `baseline.md`) nên không đáng kể | — |
| `node packages/ui/scripts/check-tokens.ts apps/desktop/src packages/ui/src/components` (3 lần) | toàn app + component | **196 / 196 / 197 ms**, exit 0 | Ngưỡng thao tác màn < 200 ms không áp cho công cụ; ghi để so lượt sau | — |
| Unit 21 file / 166 test của gói D | `packages/ui`, `shell`, `team`, `i18n`, `ui-*.test.tsx` | 2,35 s (cả khởi động vitest) | — | — |
| e2e 24 ca (`save-state`, `long-names`, `dialog-keyboard`) | bản build web ở `dist`, Edge | 47,7 s, 24 passed, 0 flaky | `baseline.md`: `pnpm e2e` 324 passed / 174 s cho cả bộ | — |

Không có phát hiện P. Không đo lại exe: gói D không chạm Rust, `package.json`, lockfile hay cấu hình
build, và `baseline.md` đã có đủ ba bảng probe exe ở SHA ghim (không dòng nào ⚠️).

## 7. Đếm mức × trục

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 1 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 1 |
| **Tổng** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | **2** |

Cả hai phát hiện **CONFIRMED** (đã chạy probe, dán lệnh và kết quả); **0 PLAUSIBLE**, **0 KNOWN**.
Không có dòng R nào ở trạng thái CHƯA SỬA hay HỒI QUY; một dòng **SỬA MỘT PHẦN** (DR6-145) và phát
hiện DSR5-D1 là phần còn lại của chính dòng đó — ghi ở bảng R1, không ghi lại thành phát hiện riêng.

## 8. Đã xét, không thấy

- **E — Edge case:** tên 81 / 160 ký tự liền ở tiêu đề và phụ đề hộp thoại, hàng tiêu đề thẻ team, danh sách team, So sánh team, cột Báo cáo (e2e `long-names` 6 ca, xanh ở 1 100 và 1 440). `fillSlots` với `$&`, `{value}`, chuỗi 120 ký tự (kịch bản 7). `Choices` với ô tắt + ô đang chọn cùng lúc (`theme.spec.ts` đo `opacity 0.4` + `line-through`). `askWhileFailed` với lần lưu lỗi rồi thành công, và thành công trước khi hỏi (`close-guard.test.ts:119-175`). `DataTable` cột ẩn trong bảng không có khung cuộn (`CustomerAppointments`, `SettingsTrash`): `relative` không đổi hình vì không khung nào bọc. Chưa thử: tên liền dài trong **thân** hộp 9b (`inUseHelp` ghép tên KH của Thùng rác vào một `<span>` không có `wrap-anywhere`) — cần dựng một KH tên dài rồi xóa mềm, ngoài ngân sách phiên; ghi lại để lượt sau.
- **C — Đúng hợp đồng:** `Choices` đối chiếu từng dòng `.choice` / `.choice.on` / `.choice.off` của `forms.css:261-284` (7 điểm của DR6-149, khớp cả). `Button` `aria-disabled` dáng như `disabled` (K44 không đụng). `DataTable` giữ props; `th` chỉ thêm `relative` cho cột `headerHidden`. `Dialog` giữ props, chỉ thêm một class ở khối tiêu đề. `team-view.inUseHelp` và `trash-view.restoreLabel` cùng một khóa, chữ không đổi (M8 đỏ khi đổi chữ). `docs/metrics/phase-6.md` khớp số bảng (19 + 4 = 23; 8 + 4 = 12; 23 / 112). Ba dòng tài liệu của T-344 / T-352 / T-356 khớp app.
- **D — Dữ liệu:** gói D không có lệnh ghi DB; `kyc.factLine` chỉ đổi cách ghép chuỗi hiển thị (cùng nội dung: `"Hôn nhân: Đã kết hôn"`). Không có transaction, không có luật nhập backup trong phạm vi.
- **G — Guardrail AI:** không có trong gói D (khóa `kyc.factLine` là nhãn UI, không phải prompt).
- **S — An toàn ranh giới:** không có đường dẫn file, không có mạng, không có key trong phạm vi gói. `token-guard` chỉ đọc chuỗi trong bộ nhớ.
- **A — Trợ năng / i18n:** `Button` `aria-disabled` giữ focus và Tab được (đúng DR6-154); `theme.spec.ts` đo tương phản chữ của chip ≥ 4.5 và viền ô đang chọn ≥ 3:1; `Choices` giữ `role="radiogroup"` + `aria-required`. Không còn chuỗi cứng trong JSX của gói (kịch bản 4). `…`, `←`, `–` chỉ nằm trong `vi.ts` — trừ lỗ của bộ chặn ở DSR5-D1.
- **P / B:** xem mục 6, không có phát hiện.

## 9. Phụ lục

### 9.1 Đột biến (mỗi lần áp riêng, chạy, rồi trả nguyên byte — `sha256` khớp sau từng lần)

| Mã | Dòng R | Sửa gì | Chạy | Kết quả |
|---|---|---|---|---|
| M1 | DR6-145 / T-333 | bỏ nhánh `types++` (`token-guard.ts:135`) | `token-guard.test.ts` | **KILLED** (2 đỏ) |
| M2 | DR6-145 (b) | bỏ vế báo `}, {` của JSX (`:147-150`) | như trên | **KILLED** (3 đỏ) |
| M3 | DR6-148 (a) / T-331 | bỏ `relative` ở `th` (`DataTable.tsx:178`) | `ui-datatable.test.tsx` | **KILLED** (1 đỏ) |
| M4 | DR6-147 (b) | `askWhileFailed` không nghe hàng đợi (`close-guard.ts:44-61`) | `close-guard.test.ts` | **KILLED** (2 đỏ) |
| M5 | DR6-147 (a) | bỏ `subscribe` trong `SaveWarning.tsx:34-42` | `close-guard.test.ts` | SURVIVED — không có unit test cho `SaveWarning`; xem M5e |
| M5e | DR6-147 (a) | như M5 | e2e `save-state.spec.ts -g DR6-147` | **KILLED** (1 đỏ: `<h1 …>Team & nhân sự</h1>` không có focus) |
| M6 | T-337 | bỏ cặp `aria-disabled:` của `Button.tsx:25` | `ui-button.test.tsx` | **KILLED** (1 đỏ) |
| M7 | DR6-149 | đặt lại class cũ của `Choices.tsx:54` | `ui-choices.test.tsx` | SURVIVED — unit chỉ kiểm `aria-required`; xem M7e |
| M7e | DR6-149 | như M7 | e2e `theme.spec.ts -g "the choices of a dialog"` | **KILLED** (1 đỏ ở `toHaveCSS`) |
| M8 | T-332 | đổi `customer.withCode` thành `'{name} · {code}'` | `team-view.test.ts` + `trash-view.test.ts` | **KILLED** (2 đỏ) |
| M9 | T-341 | thêm `source[i+1] !== '/'` (đúng hướng sửa đã ghi ở mục ACCEPTED của #969) | `token-guard.test.ts` | **KILLED** (1 đỏ — ca ghim thật sự cắn) |
| M10 | DR6-37 | đặt lại `{t(...)}: {factText(...)}` ở `CustomerKyc.tsx:95` | `check-tokens.ts` | **KILLED** (`CustomerKyc.tsx:95 hardcoded-separator }: {`) |
| M11 | DR6-148 (b) / T-331 / T-337 | bỏ `flex-wrap` ở hàng tiêu đề thẻ team | e2e `long-names -g "a TL of 160 letters"` | **KILLED** (1 đỏ: "title at 1100" phải 1 dòng) |
| M12 | DR6-146 (a) | `name: customer ? normalizeText(name) : name` (đột biến R109c của lượt 4) | e2e `customer-forms -g "editing the profile (5c)"` | **KILLED** (1 đỏ: không hiện `INVALID_TEXT`) |
| M13 | DR6-146 (b) | `.then` của Thử lại luôn đưa focus về tiêu đề (RB2c) | e2e `save-state -g DR6-146` | **KILLED** (1 đỏ ở `expect(moved).toBeFocused()`) |
| M14 | T-331 mục 3 | `items-baseline` → `items-center` ở nút team | e2e `long-names -g "a team and an IS of 160 letters"` | **KILLED** (1 đỏ: "count at 1100", lệch > 3 px) |

`git status --short` sau **mỗi** lần: sạch; `sha256` của file trả lại khớp trước khi sửa (script kiểm
trong `D\mutate.mjs`, `D\mutate2.mjs`, `D\mutate3.mjs`).

### 9.2 Nguồn probe / script (trong `…-r5\deepseek\D\`)

| File | Việc | Kết quả |
|---|---|---|
| `cls.mjs` | xếp 93 file của diff `2e51e25..37a80b6` vào gói bằng `classifyFile` | gói D: 16 file, +208/−73 SP · +276/−2 test |
| `jsx-text-scan.mjs` | TypeScript API: JSX text + thuộc tính chuỗi của 67 file `.tsx` trong gói | 0 dấu / dấu nối viết thẳng |
| `guard-probe.mjs` | nạp `token-guard.ts`, hỏi 16 dạng của DR6-145 | 7 dạng im lặng (4 là **DSR5-D1**: `←`, `–`, `…`, ngoặc kép cong; 1 là giới hạn escape đã ghi ở doc comment; 2 là `: ` giữa chữ JSX và biểu thức — `{a}: b` và `a: {b}`, xem chú thích ở DSR5-D1), 2 dạng báo nhầm (**DSR5-D2**) |
| `perf-guard.mjs` | 5 lần chạy bộ chặn trên 356 file | trung vị 67,7 ms |
| `exports2.mjs` | đếm chỗ dùng của mọi export trong 12 file SP đã đổi | 0 export chết |
| `slots.mjs` | `t('kyc.factLine', …)` với giá trị độc | ghép nguyên văn |
| `mutate.mjs`, `mutate2.mjs`, `mutate3.mjs` | 14 đột biến | bảng 9.1 |

Thư mục `pw`, `pw2`, `pw3`, `pw4`: ảnh và trace của các lần e2e đỏ do đột biến (Playwright ghi theo
`--output`).

### 9.3 Cuối phiên

- `git rev-parse HEAD` → `37a80b662861d308a110d1e2b0f65ad13b91fb51` (không đổi).
- `git status --short` → rỗng.
- Giờ xong: xem dòng đầu file.
