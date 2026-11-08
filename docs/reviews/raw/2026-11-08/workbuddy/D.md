XONG — workbuddy gói D lượt 6, 12:18 08/11/2026

# Báo cáo deep review Phase 1–6, lượt 6 — gói D (Màn nhập liệu), bên workbuddy

## 1. Bên, gói, môi trường

- **Bên / gói:** workbuddy, gói **D — Màn nhập liệu** (`packages/ui/**` trừ `scripts/`; `apps/desktop/src/{shell,i18n}/**`; `routes/customers/**` trừ file AI và Hợp đồng; `routes/team/**`; `routes/Screen.tsx`; `routes/{classes,money-view}.ts`; `routes/stage-badge.tsx`; file gốc `apps/desktop/src/*`; `apps/desktop/index.html`). Reviewer độc lập, chỉ đọc (ADR-0001 phụ lục M13); **không làm bảng R1 / R2** — theo `common\prompt-workbuddy.md` (Việc của gói mục 1) và `common\known.md` phần 4, 5, mọi dòng R1 (DR6-169, DR6-170) và R2 (T-376) là KNOWN.
- **SHA đầu phiên:** `5b1328ae236aa62981dbf43066ff544a9e832c8c` (`git rev-parse HEAD`), đúng SHA ghim `5b1328a`.
- **`git status --short` đầu phiên:** rỗng (không có dòng nào).
- **Giờ bắt đầu:** 11:58 08/11/2026; **giờ xong:** 12:18 08/11/2026 (máy `DESKTOP-KDURKJP`, Home PC, GMT+7).
- **Công cụ:** app desktop WorkBuddy (bản theo `common\baseline.md`; baseline không ghi số bản của lượt 6, phiên này không đọc thư mục dữ liệu của app), shell Git Bash / PowerShell của app, công cụ đọc / ghi file. **Expert:** `CodeReviewExpert` (đã chọn trong phiên; mã không thấy). Không cài skill, không connector, không mạng ngoài, không `gh`, không đọc thư mục cấm. **Không dùng agent phụ.**
- **Model:** ngữ cảnh phiên ghi `Deepseek-V4.1-Flash`; Owner chọn **Hy4** cho gói A–F (`common\baseline.md`, ghi chú sau phiên thử ≈ 23:35 07/11). Ghi cả hai, không khẳng định thay Owner. **Context:** không thấy trong ngữ cảnh phiên. **Mức suy luận:** không thấy trong ngữ cảnh phiên.
- **Bản Node đã dùng:** `v24.20.0` — lệnh đầu phiên đặt `export PATH="/c/Program Files/nodejs:$PATH"` rồi `node --version` in `v24.20.0` (≥ 24). Mọi lệnh có `node` / vitest / Playwright đặt PATH ngay trong lệnh.
- **Màn:** kết luận về màn đo trên **bản build web** `apps/desktop/dist` dựng ở cổng của bước chuẩn bị (`baseline.md`, `pnpm build:exe`), phục vụ bằng server tĩnh riêng ở `127.0.0.1:4399` (không đụng cổng 4173 của `pnpm e2e`), Playwright 1.63.0 qua **Edge** (`channel: 'msedge'`, như `playwright.config.ts`), cửa sổ 1 100 × 900 và 1 440 × 900.

## 2. Bảng R1 / R2

Không áp dụng (agent WorkBuddy không làm bảng R). Hai phát hiện dưới đây là chỗ hở mới, có "Liên quan" tới vùng của DR6-170 / DR6-174 (c) nhưng không phải dòng R.

## 3. Phạm vi đã đọc

### Diff `37a80b6..5b1328a` của gói D

`git diff --numstat 37a80b6 5b1328a -- <đường dẫn gói D>` → **9 file, +301 / −28**: sản phẩm **8 file, +124 / −28**; test **1 file, +177 / −0** — khớp `common\baseline.md` dòng gói D. Bản diff đầy đủ đã đọc hết (dán ở `workbuddy\D\diff-D.diff`, 548 dòng).

| File | +/− | Nội dung |
|---|---|---|
| `packages/ui/src/token-guard.ts` | +82 / −19 | `CALLEE` / `JOINS` (`concat(`), `JSX_JOINER` thay luật `, {` cũ, `MARKS` + `ENTITY` + `ESCAPE` + `markOf`, `types` đếm `<` lồng trong đối số kiểu (T-366, T-376; DR6-169) |
| `packages/ui/src/token-guard.test.ts` | +177 / −0 | 9 ca mới: `← – … “”‘’`, escape `\uXXXX` / `\u{…}` / `\xNN`, thực thể HTML (tên và số), lời gọi khác `.join(`, `.join(` viết nhiều dạng, `.concat(`, dạng Prettier ngắt dòng, JSX không có dấu nối, đối số kiểu lồng |
| `packages/ui/src/components/SelectField.tsx` | +9 / −1 | prop `capped` → khung `flex min-w-0 max-w-80 flex-col gap-1`, `title` = nhãn đang chọn (DR6-170 (6), T-376) |
| `apps/desktop/src/routes/classes.ts` | +7 / −0 | hằng `CELL_NAME = 'block max-w-60 wrap-anywhere'` (T-376) |
| `apps/desktop/src/routes/customers/CustomersScreen.tsx` | +14 / −6 | ô Họ tên / RE dùng `CELL_NAME`; dòng "đang xem" thêm `min-w-0 wrap-anywhere` (DR6-170 (1)) |
| `apps/desktop/src/routes/customers/CustomerProfile.tsx` | +1 / −1 | dòng meta của hồ sơ thêm `wrap-anywhere` (DR6-170 (2)) |
| `apps/desktop/src/shell/RePicker.tsx` | +2 / −1 | tiêu đề cột RE `wrap-anywhere` |
| `apps/desktop/src/shell/ScopePicker.tsx` | +3 / −0 | hai ô chọn Team / RE `capped` (DR6-170 (6)) |
| `apps/desktop/src/i18n/vi.ts` | +6 / −0 | ba khóa của Thùng rác (`trash.goneAt`, `trash.blocked.teamDeletedAt`, `trash.restoreLabel.deletedAt`; gói E dùng) |

Thay đổi sản phẩm đọc kỹ nhất (dòng ở `5b1328a`):
- `token-guard.ts:55-85` — `CALLEE` (`([\w$]+)\s*\((?:[^()[\]{}]*,)?\s*$`), `JOINS = {join, concat}`, `JSX_JOINER` (sticky, `(?!\/)`), `MARKS` (`·→–` / `✓○×▾▸—←…“”‘’`), `ENTITIES` + `ENTITY`, `ESCAPE`, `markOf`.
- `token-guard.ts:105-226` — vòng quét: `report(c, MARKS.get(c))` cho mọi ký tự, nhánh `&` (thực thể), nhánh `\` (escape), nhánh đóng chuỗi (`i - start === 2` trước, rồi `whole` + `CALLEE`), nhánh `}` của JSX (`JSX_JOINER`, cộng `line` theo số dòng dấu nối chiếm).
- `SelectField.tsx:27-32`, `:53`, `:70` — `capped` và `title`; `classes.ts:32-37` — `CELL_NAME` + chú thích vì sao bảng Báo cáo giữ `NAME` riêng.
- `CustomersScreen.tsx:58-81`, `:165`; `CustomerProfile.tsx:173`; `RePicker.tsx:38-41`; `ScopePicker.tsx:39-56`.

### `common\files-D.txt`

89 file: **63 product, 26 test**.

- **63 file sản phẩm: đọc hết, từng file**, trừ bốn file ghi rõ ở đây: `i18n/vi.ts` (1 385 dòng — đọc các khóa liên quan và grep theo mẫu, không đọc từng dòng), `packages/ui/src/theme.css` (98 dòng — đọc phần đầu và grep `--spacing` / `--text-*`), `tokens.css` (76 dòng — chỉ grep biến), `fonts.css` (153 dòng `@font-face` — **không đọc**, không có logic). Danh sách đã đọc: `packages/ui/src/components` (Button, Chart, Choices, DataTable, Dialog, NavIcon, PeriodPicker, PeriodPicker.label, PolicyBadge, Segmented, SelectField, StageBadge, TextField, chart-theme, compare-cells, dialog-focus, field-notes, show-more, table-view), `packages/ui/src/index.ts` + `token-guard.ts`, `apps/desktop/src` gốc (`App.tsx`, `main.tsx`, `index.css`), `i18n/index.ts`, `shell/**` (16 file), `routes/{Screen.tsx,classes.ts,money-view.ts,stage-badge.tsx}`, `routes/customers/**` 9 file không thuộc AI / Hợp đồng, `routes/team/**` 4 file, `apps/desktop/index.html`.
- **26 file test:** đọc kỹ `token-guard.test.ts` (cả 483 dòng) và `CustomersScreen.test.tsx`; **không đọc từng dòng** 24 file còn lại (`i18n/index.test.ts`, `customers-view.test.ts`, `kyc-view.test.ts`, `money-view.test.ts`, `team-view.test.ts`, 9 file `shell/*.test.*`, `ui-*.test.tsx`, `packages/ui/src/components/*.test.ts`). **Lý do:** phần lớn không nằm trong diff; đã **chạy hết** (28 file / 337 test, xanh) và dùng chúng làm lưới cho 2 đột biến ở mục 4 #8.

### Chỗ code gói khác mà gói D nối vào (đã đọc)

`packages/ui/scripts/check-tokens.ts` (phạm vi quét `apps/desktop/src` + `packages/ui/src/components`, bỏ `.test.*` và thư mục `i18n`), `packages/domain/src/period.ts` (`parseQuickDate` — đọc phần khai báo lỗi + chạy probe), `packages/db/src/team.ts` (`personUsage`, `IN_TRASH`, `USAGE`), `packages/db/src/common.ts` (`storedPastDate`), `apps/desktop/src/routes/customers/KycIntelligence.tsx` + `KycHistory.tsx` (chỉ phần dùng `CELL_NAME`), `e2e/long-names.spec.ts` (534 dòng, cả file), `e2e/support.ts` (`createKycCustomer`, `addKycNote`), `playwright.config.ts`, `node_modules/tailwindcss/preflight.css` (luật `[hidden]`).

### Đọc trước

`common\known.md` (cả ba phần đầu — gồm **nguyên văn** "Lệch mockup đã biết" ở phần 3 và K1–K50), `common\baseline.md`, `common\fixes.md` (Issue #1081 / PR #1092 + nhóm RESOLVED của T-376), tổng hợp lượt 5 `docs/reviews/2026-11-05-…-tong-hop.md` §5.2 và §6.4 (mô tả DR6-169 / DR6-170, K50 Q3 / Q4), `docs/golden/kyc.md` + `docs/design/phase-5-ai.md` (grep `CONFLICT_RESOLUTION` để kiểm nhãn cổng KYC), `docs/design/mockups/customer.html` (grep "Cổng KYC" — không có, cổng là của spec). **Không đọc:** `plan.md` (dùng bản trích trong prompt và trong `known.md`), `CLAUDE.md`, `CONTEXT.md`, `docs/design/phase-6-hoan-thien.md`, các mockup còn lại — gói D không có mục nào ngoài những gì đã nằm trong `known.md` / `fixes.md` cần chúng.

## 4. Kịch bản đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | `probe-1-marks.mjs`: quét độc lập 115 file `.ts/.tsx` mà `lint:tokens` chạm, tìm **mọi** ký tự trong tập `·→–✓○×▾▸—←…“”‘’` rồi hỏi bộ chặn có báo không | 208 lần xuất hiện, **208 đều nằm trong comment** (bộ chặn cho phép) — code thật không có ký hiệu cứng nào, khớp "0 vi phạm" của `lint:tokens` | — |
| 2 | `probe-3-lines.mjs`: số dòng báo của bộ chặn qua 8 dạng nhiều dòng — dấu nối JSX ngắt dòng rồi `·` ở dòng sau, escape `\` + xuống dòng, template `${}` nhiều dòng, file CRLF, dấu nối trước phần tử, thực thể + `·` cùng dòng, escape + `·` cùng chuỗi | 8 / 8 báo **đúng dòng**; dấu nối JSX chiếm 1 dòng được cộng vào `line` đúng | — |
| 3 | Prettier 3.9.9 (cấu hình repo, `printWidth: 100`) trên một dòng JSX dài có `{a}, {b}` | Prettier viết `},{' '}` ⏎ `{b}` — dạng **đã có ca** (`token-guard.test.ts:276-308`); không sinh dạng `,` ⏎ `{b}` mà doc chưa nêu | — |
| 4 | `probe-2-birth.mjs`: `parseQuickDate` với `0000`, `0001`, `0999`, `1000`, `1899`, `1900`, `2027`, `1/1/0` | Cả 8 trả `{ok:false, error:'format'}` — `parseBirthDate` không nhận được năm sinh 0 / năm ngoài 1900–2100 qua đường 4 chữ số | — |
| 5 | `node node_modules/vitest/vitest.mjs run` cho 28 file test của gói D | **28 file / 337 test xanh**, 0 đỏ, 3,7 s | — |
| 6 | `probe-4-9b.mjs` (Playwright, bản build web, 1 100 × 900): tạo KH tên 81 chữ `K` liền → đặt 1 lịch hẹn → xóa KH (vào Thùng rác) → Team & nhân sự → "Sửa" RE đó → "Xóa nhân sự" → hộp 9b | Dòng help `Có cả dữ liệu của KH đã xóa: Kxxx…` **rộng quá mép phải hộp 72 px**; `dialog.scrollWidth 519` / `clientWidth 446`; trang **không** cuộn ngang (hộp ở top layer) | WBR6-D1 |
| 7 | `probe-5-9c.mjs` (cùng bản build): tạo team tên 160 chữ `T` liền → "+ Team" lần hai cùng tên → "Tạo team" | Dòng lỗi `Đã có team "Txxx…".` **rộng quá mép phải hộp 563 px**; `dialog.scrollWidth 1010` / `clientWidth 446`; câu bị cắt ở mép hộp | WBR6-D1 |
| 8 | Đột biến trên bản repo (chép gốc, vá, chạy, trả nguyên byte, so sha256): **M1** `CELL_NAME` `max-w-60` → `max-w-96`; **M2** `SelectField` `max-w-80` → `max-w-96` | Cả hai **sống**: 24 file / 319 test của gói D vẫn xanh; sha256 sau khi trả trùng lại (`CEAD6B4D…`, `80D0D51C…`), `git status --short` rỗng | WBR6-D2 |
| 9 | `git status --short` sau mỗi lần vá và cuối phiên | Rỗng ở mọi lần | — |

## 5. Phát hiện mới

```
ID: WBR6-D1
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/team/PersonDialogs.tsx:229-233 (hai dòng help của hộp 9b — ba khóa `person.inUseTrash` / `person.inUseSupportTrash` / `person.inUseTrashMore`), :142-146 (FailureAlert của 9a); apps/desktop/src/routes/team/team-view.ts:113-144 (inUseHelp ghép tên KH vào câu); packages/ui/src/components/TextField.tsx:36, :92-96 (dòng lỗi dưới ô); apps/desktop/src/routes/team/TeamDialogs.tsx:45-55 (hộp 9c dùng dòng lỗi đó) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-170 (chín chỗ tràn; đợt sửa T-367 / T-376 đặt trần ở bảng và ô chọn, không chạm câu trong hộp thoại), DR6-148 (hộp thoại: chỉ **tiêu đề** có `wrap-anywhere`, `Dialog.tsx:83-89`) — chỗ mới cùng họ; có từ trước (9b có từ T-250, 9c từ đầu), lượt 1–5 bỏ sót
Mô tả: Tên KH / team / nhân sự không có trần độ dài, và ba câu trong hộp thoại ghép tên vào **giữa câu** mà khung không có chỗ ngắt: dòng help của 9b ("Có cả dữ liệu của KH đã xóa: {customer}…"), dòng lỗi dưới ô của 9c ("Đã có team "{name}".") và dòng lỗi của 9a ("Team này đã có TL: {name}."). Tên liền dài làm cả câu rộng hơn hộp: hộp thoại cuộn ngang và câu bị cắt ở mép hộp.
Tái hiện / bằng chứng: hai probe Playwright trên bản build web ở SHA ghim (Edge, 1 100 × 900; `serve.mjs` phục vụ `apps/desktop/dist` ở 127.0.0.1:4399), đo `Range.getClientRects()` của phần tử so với mép hộp:
  - `probe-4-9b.mjs`: KH tên 81 chữ `K` (tạo ở màn Khách hàng, RE `Bùi Kim Hùng`) + 1 lịch hẹn, xóa KH, rồi mở 9b của RE đó → span `text-xs text-fg-3` chứa tên: **quá mép phải 72 px**, 4 dòng; `dialog.scrollWidth 519` / `clientWidth 446`.
  - `probe-5-9c.mjs`: hai team cùng tên 160 chữ `T` → span `text-xs text-danger` ("Đã có team …"): **quá mép phải 563 px**, 2 dòng; `dialog.scrollWidth 1010` / `clientWidth 446`.
  - 9a (`error.TEAM_HAS_LEAD` → `FailureAlert`, `PersonDialogs.tsx:142-146`): cùng lớp `ALERT` không có `wrap-anywhere` — **đọc code**, chưa đo (cùng đường `errorMessage` → `t('error.TEAM_HAS_LEAD', { name })`).
Cùng mẫu: `rg -n "t\('[a-zA-Z.]+', \{ name" apps/desktop/src` → 36 chỗ; trừ aria-label / tiêu đề hộp (đã có `wrap-anywhere` ở `Dialog.tsx:83-89`) và các chỗ đã có `wrap-anywhere` (`CustomerProfile.tsx:173`, `CustomersScreen.tsx:165`, `TeamScreen.tsx:303`, `:309`, `KycDialogs.tsx:121`, `:331`, `:442`, `CustomerAppointments.tsx:142`), còn đúng ba chỗ trên. `rg -n "\{(name|team|customer|re|person)\}" apps/desktop/src/i18n/vi.ts` trong nhóm `error.*` chỉ có `error.TEAM_NAME_TAKEN` và `error.TEAM_HAS_LEAD` — cả hai đều đi vào dòng lỗi không ngắt.
Ảnh hưởng: RE gặp câu giải thích bị cắt đúng chỗ tên (9b: vì sao chưa xóa được nhân sự, 9c: vì sao trùng tên), và hộp thoại có thanh cuộn ngang. Chỉ xảy ra với tên liền dài (không có dấu cách) — cùng điều kiện của DR6-148 / DR6-170; không sai dữ liệu.
Chặn phát hành: không — Low ở trục C (K48).
Đề xuất: đặt `wrap-anywhere` **một lần** trên `<form>` của `Dialog` (`Dialog.tsx:76-77`) thay vì vá từng câu, để mọi câu trong hộp thoại ngắt được như tiêu đề; thêm một ca e2e mở 9b và 9c với tên liền dài và hỏi `scrolls(dialog) === false`. Cỡ: 1 dòng sản phẩm + ~20 dòng e2e.
```

```
ID: WBR6-D2
Mức: Low
Trục: T
Vị trí: apps/desktop/src/routes/classes.ts:37 (`CELL_NAME` = `block max-w-60 wrap-anywhere`), packages/ui/src/components/SelectField.tsx:53 (khung `capped` = `max-w-80`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-170, DR6-174 (c) (span `max-w-60` của `ReportTable` được e2e đo ≤ 240 px — `e2e/long-names.spec.ts:317`), T-376
Mô tả: Hai trần mới của đợt sửa — 240 px cho ô tên bảng (`CELL_NAME`, dùng ở bảng Khách hàng) và 320 px cho ô chọn góc nhìn (`capped`) — **không ca nào giữ**. Đổi `max-w-60` thành `max-w-96` và `max-w-80` thành `max-w-96` thì 24 file / 319 test đơn vị của gói D vẫn xanh; e2e chỉ hỏi "trang / `main` không cuộn ngang" (`long-names.spec.ts:26`, `:341`) và chỉ đo trần ở đúng **một** chỗ, cột Team của bảng Theo RE (`:317`).
Tái hiện / bằng chứng: `mutate-d.mjs` (chép bản gốc, vá, chạy, trả nguyên byte):
  - M1 `classes.ts:37` `max-w-60` → `max-w-96`: sha256 `CEAD6B4D…` → `1CB01E4C…`; `node node_modules/vitest/vitest.mjs run apps/desktop/src/routes/customers apps/desktop/src/routes/team apps/desktop/src/shell packages/ui/src` → **24 file / 319 test xanh**.
  - M2 `SelectField.tsx:53` `max-w-80` → `max-w-96`: sha256 `80D0D51C…` → `4C3862F9…`; cùng bộ test → **xanh**.
  - Trả lại: sha256 trùng bản đầu, `git status --short` rỗng.
Cùng mẫu: `rg -n "max-w-60|max-w-80" apps/desktop/src packages/ui/src` → `classes.ts:37`, `SelectField.tsx:53`, `AppointmentsScreen.tsx:181` (`max-w-60` của nút tên KH, cùng họ), `ReportTable.tsx:35` (`NAME` = `block w-max max-w-60 whitespace-normal wrap-anywhere`, đã có ca e2e). Trong bốn chỗ, chỉ `ReportTable` được đo.
Ảnh hưởng: một lần sửa sau đổi (hoặc bỏ) trần mà không test nào đỏ; bảng Khách hàng lại tràn ngang như DR6-170 (1) nếu trần bị nới, và không ai biết trần đang là bao nhiêu.
Chặn phát hành: không — Low ở trục T (K48).
Đề xuất: thêm vào `e2e/long-names.spec.ts` hai phép đo như ca DR6-174 (c): `contentWidth` của ô Họ tên bảng Khách hàng ≤ 240 px, và `contentWidth` khung ô chọn "Team của góc nhìn" ≤ 320 px (đã có sẵn tên KH 81 chữ và team 160 chữ trong ca quét). Cỡ: ~15 dòng e2e, 0 dòng sản phẩm.
```

## 6. Bloat / Hiệu năng

Không áp dụng cho gói D (mục bắt buộc chỉ ở gói F và chủ đề G của Claude). Ghi lại để gói F đối chiếu: diff sản phẩm của gói +124 / −28 · 8 file, không file mới, không code chết; `token-guard.ts` +82 dòng là bộ quét chạy trong `pnpm lint:tokens` (một lần, 115 file, không nằm trên đường chạy của app).

## 7. Đếm

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Tổng** | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | **2** |

2 phát hiện; **0 xếp chặn phát hành**, 2 không chặn. **0 PLAUSIBLE** — cả hai CONFIRMED bằng đo thật (D1: hai probe Playwright trên bản build web; D2: hai đột biến chạy thật). Không có Critical / High / Medium.

## 8. Đã xét, không thấy

- **E (edge case):** tên liền 81 / 160 chữ ở bảng KH (bảng + kanban + danh sách đóng), hồ sơ, dải RE, ô chọn góc nhìn, bảng Lịch hẹn của hồ sơ, Team (danh sách, đầu thẻ, TL, Người hỗ trợ), hộp 9b / 9c (mục 5). Năm sinh `0000` / `0001` / `1899` / `2027` (mục 4 #4). Ngày gõ nhanh rỗng / sai định dạng / tương lai trong 5a, 5d, 7a (`parseRecordDate`, `parseBirthDate`, `date.error.*` đủ khóa). Chuỗi rỗng / toàn ký tự vô hình ở ô Họ tên, Ghi chú KYC, Trường + Giá trị (`normalizeText`, `normalizeNote`). Không thấy lỗi mới ngoài D1.
- **C (hợp đồng / spec / mockup / nhãn):** đối chiếu với **nguyên văn** "Lệch mockup đã biết" (`known.md` phần 3) và K44 / K46: ô chọn 7c/7d, cột Kết quả 120 px, "Chưa ghi kết quả" là chữ, câu help tĩnh của Case size — mọi lệch đã có trong danh sách, không mục nào mới. Nhãn cổng KYC (`CONFLICT_RESOLUTION`…) là chữ của spec (`docs/golden/kyc.md`, `phase-5-ai.md`), không phải nhãn sót. Trần mới của T-376 / T-367 **không** tạo lệch nhìn thấy với tên thường (240 px và 320 px chỉ chạm tên dài). D1 là chỗ lệch; ngoài ra không thấy.
- **D (dữ liệu):** `createCustomer` / `updateCustomerProfile` (tên gửi nguyên văn, lệnh kiểm), `changeStageManually` (`allowedStages` lọc theo `assertValidTransition`), `recordKycNote` (`normalizeKycValue` trước, `previewKycNote` chặn cùng luật), `confirmKycFact` / `markKycConflict`, `resolveKycConflict`, `softDeleteCustomer` / `softDeletePerson` / `softDeleteTeam` + `retriesDelete` (`DATA_REPLACING`), `previewHandover` (số lịch chuyển tay), `personUsage` (`IN_TRASH` chỉ nêu KH đã xóa còn bản ghi trỏ tới nhân sự). Không thấy.
- **G (guardrail AI):** gói D không có đường AI; chỉ đọc `KycIntelligence` / `KycHistory` ở phần dùng `CELL_NAME`. Không thấy.
- **S (an toàn ranh giới):** `blockReload` (F5 / Ctrl+R / Ctrl+Shift+R / Alt+←→ / nút chuột 4–5 / menu chuột phải ngoài ô chữ, capture), `CloseGuard` + `closeAfterSaving` + `askWhileFailed` (chỉ đóng sau khi lưu xong, hỏi khi lỗi, "thử lại" khi lưu thành công xen vào), `SaveWarning` (focus về tiêu đề khi dải biến mất). Không thấy.
- **P (hiệu năng):** không đo (gói D không phải mục bắt buộc; các hàm thuần của gói chạy trên ≤ 1 496 KH / 10 414 lịch, dưới xa ngưỡng 200 ms của `phase-6.md` — không có phát hiện P).
- **B (bloat):** mục 6. Không thấy.
- **T (chất lượng test):** 483 dòng `token-guard.test.ts` phủ đủ 9 ca mới (ký hiệu `← – … “”‘’`, escape, thực thể, lời gọi khác `.join(`, `.join(` nhiều dạng, `.concat(`, dạng Prettier, JSX không dấu nối, đối số kiểu lồng); số dòng báo đúng qua 8 dạng nhiều dòng (mục 4 #2). Hai đột biến trần sống → D2. Ngoài ra: `CELL_NAME` / `capped` là hai trần duy nhất của đợt sửa không có ca; `stageSince`, `parseBirthDate`, `kycTimeline`, `inUseHelp`, `resolveScope`, `parseHash` đều có ca trong 337 test đã chạy.
- **A (trợ năng / i18n):** `aria-sort` + nút sắp xếp có tên chỉ gồm tiêu đề cột (mũi tên `aria-hidden`), `role="radiogroup"` + phím mũi tên của `Segmented`, `Choices` dùng radio thật, `label` / `aria-describedby` của `TextField` / `SelectField` (`fieldNotes` gộp lỗi + đọc lại + help), `Dialog` `aria-labelledby` + trả focus (`focusBack`, `DialogFocusFallback`), `Brand` `role="img"` + `alt=""`, `NavIcon` `aria-hidden`, `hidden` của `li` lọc Dòng thời gian và bảng Team (Tailwind 4 đặt `display: none !important` cho `[hidden]` — đã kiểm trong `node_modules/tailwindcss/preflight.css:396`). Không thấy.

## 9. Phụ lục

**Nguồn probe / test tạm / đột biến** (đều trong `C:\workspace\deep-review-1-6-r6\workbuddy\D\`):
- `probe-1-marks.mjs` — quét độc lập 115 file, 208 ký hiệu, tất cả trong comment.
- `probe-2-birth.mjs` — `parseQuickDate` với 8 dạng năm.
- `probe-3-lines.mjs` — số dòng báo qua 8 dạng nhiều dòng.
- `probe-4-9b.mjs` + `probe-4-9b.png` — chuỗi 81 chữ `K` → 9b; đo tràn 72 px.
- `probe-5-9c.mjs` + `probe-5-9c.png` — hai team 160 chữ `T` → 9c; đo tràn 563 px.
- `serve.mjs` — server tĩnh cho `apps/desktop/dist` ở `127.0.0.1:4399` (không dùng cổng 4173, không `PW_REUSE`).
- `mutate-d.mjs` + `mut/cell-name-cap.orig`, `mut/select-cap.orig` — hai đột biến trần, mỗi lần in sha256 trước / sau và trả nguyên byte.
- `prettier-joiner.tsx`, `prettier-joiner.out.tsx` — dạng Prettier viết cho dấu nối JSX dài.
- `diff-D.diff` — bản diff `37a80b6..5b1328a` của gói D đã đọc.

**Đột biến — cái bị test giết, cái sống** (chạy bộ test gói D, mỗi lần trả file rồi so sha256):
| Mã | Đột biến | Kết quả |
|---|---|---|
| M1 | `classes.ts:37` `max-w-60` → `max-w-96` | 24 file / 319 test xanh → **sống** → WBR6-D2 |
| M2 | `SelectField.tsx:53` `max-w-80` → `max-w-96` | 24 file / 319 test xanh → **sống** → WBR6-D2 |

**Test đã chạy:** `apps/desktop/src/{routes/customers,routes/team,shell,i18n}`, `apps/desktop/src/ui-*.test.tsx`, `packages/ui/src` → 28 file / 337 test xanh (lần đầu); 24 file / 319 test ở hai lần đột biến (cùng phạm vi, không có `i18n` + `ui-*`). Không chạy `pnpm e2e` (cổng 4173 để trống cho bên khác), không build lại, không đo exe.

**`git status --short` cuối phiên:** rỗng.
**Giờ xong:** 12:18 08/11/2026.
