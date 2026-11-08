XONG — claude gói D lượt 6, 2026-11-07 18:15 (+07:00)

# Deep review Phase 1–6, lượt 6 — Claude, gói D (Màn nhập liệu)

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên | Claude (ID `CLR6`) |
| Gói | D — Màn nhập liệu (`packages/ui/**` trừ `scripts/`, `apps/desktop/src/{shell,i18n}/**`, `routes/customers/**` trừ file AI và Hợp đồng, `routes/team/**`, `routes/Screen.tsx`, `routes/{classes,money-view}.ts`, `routes/stage-badge.tsx`, file gốc `apps/desktop/src/*`, `apps/desktop/index.html`) |
| SHA đầu phiên | `5b1328ae236aa62981dbf43066ff544a9e832c8c` (`git rev-parse HEAD` ở `C:\workspace\Project-2C-review`, khớp SHA ghim) |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 2026-11-07 17:17 (+07:00), Home PC `DESKTOP-KDURKJP` |
| Công cụ | Claude Code (app desktop, tab Code), phiên mới, worktree `C:\workspace\Project-2C-review` (detached HEAD) |
| Model / mức suy luận | Claude Opus 5.5 (`claude-opus-5-5`); mức suy luận do Owner chọn ở app, phiên không đọc được giá trị |
| Ultracode / Workflow | không dùng |
| Phiên làm tiếp? | không — phiên đầu của gói D |
| Node | v24.20.0 (`C:\Program Files\nodejs`, đầu PATH) |
| Bước 0 | `D.md` chưa có; `A.md`, `B.md`, `C.md` có đủ, dòng đầu `XONG` (kiểm bằng `Test-Path` + dòng đầu, không liệt kê thư mục) |

**Subagent: 2 lần**, công cụ Agent, `subagent_type: general-purpose`, `model: opus` (Claude Opus 5.5), `effort: xhigh`, chạy nền song song với phiên chính; tin nhắn giao việc nêu đường dẫn đủ của `prompt-claude.md`, chữ gói D, bảo đọc quy tắc riêng 2–4 và phần chung trước; không subagent nào gọi subagent khác, không ghi `D.md`; mỗi subagent một cổng riêng (4831…, 4841…), dùng chung bản build `D\dist-base` của phiên chính.

| Subagent | Việc giao | Probe | Thời gian |
|---|---|---|---|
| S1 | Tìm lỗi mới ở phần Khách hàng của gói D (không gồm file AI / Hợp đồng): `CustomersScreen`, `CustomerDialogs`, `CustomerProfile`, `CustomerKyc`, `KycDialogs`, `CustomerAppointments`, `customers-view`, `kyc-view` (+ test), `stage-badge`, `money-view` (+ test); chuỗi nhiều bước qua lệnh `db` / hàm `domain` mà chúng gọi | `D\s1\` | 2 022 s, 180 lần gọi công cụ |
| S2 | Tìm lỗi mới ở Team (`routes/team/**`), vỏ app (`shell/**`), `i18n/index.ts`, file gốc app, `Screen.tsx`, `classes.ts`, `packages/ui/src/components/**` và CSS của `packages/ui` | `D\s2\` | 1 331 s, 160 lần gọi công cụ |

Phiên chính làm bảng R, đọc diff `37a80b6..5b1328a` của gói, bộ chặn ký hiệu, tên dài, `vi.ts` (khóa / slot / hình giá trị), tên truy cập trùng trên mọi màn, và **kiểm lại mọi phát hiện của S1, S2 trên code** (đọc lại vị trí; chạy lại probe của subagent trên bản ghim của phiên chính, cổng 4811: `v-s2-p01.mjs`, `v-s2-p02.mjs`) trước khi ghi. Phát hiện của subagent mang ID `CLR6-D…` ở mục 5, ghi rõ ai tìm.

Probe / log của phiên: `C:\workspace\deep-review-1-6-r6\claude\D\`.

## 2. Bảng R

Cách làm chung (mọi probe, log ở `C:\workspace\deep-review-1-6-r6\claude\D\`):

- **Probe lượt 5 của chính Claude D** chép theo đường dẫn đủ mà báo cáo gốc lượt 5 (`docs/reviews/raw/2026-11-05/claude/D.md` §9.1) ghi, `Test-Path` từng tên, vào `D\r5copy\` (42 file, không liệt kê thư mục `-r5`). Bản làm việc ở `D\` chỉ đổi đường dẫn `-r5` → `-r6` và cổng 4711 → **4811** (bản ghim) / 4812–4819 (bản đột biến).
- **Bản web:** `D\dist-base` = `build-dist.mjs` (Vite `build()` của worktree ghim, `outDir` ngoài repo, `VITE_DEMO_ANCHOR=15/09/2026` + ảnh chụp demo như `e2e/serve.mjs`), phục vụ `serve-dist.mjs` trên 127.0.0.1:4811. Không dùng cổng 4173, không `pnpm e2e`, không `PW_REUSE`.
- **Gỡ tạm phần sửa:** `D\mut-defs.mjs` (36 đột biến: 23 vitest, 13 e2e; mỗi đột biến thay chữ đúng một chỗ, `check-muts.mjs` kiểm; `R169-revert` đưa cả file về `37a80b6`). Vitest qua hook `load` của Vite (`D\mutjs.mjs` + `mutant-config.mjs`, chỉ tính khi có `[mutant] served`); TSX qua bản dựng đột biến ngoài repo (`D\e2e-mut.mjs`, phục vụ 4812–4819, chạy ca quét `e2e/long-names.spec.ts -g "push no main screen"` của repo). Đối chứng: vitest `token-guard.test.ts` 37 / 37 (`vitest-control-tg.log`); ca quét trên `dist-base` **CONTROL OK** 1 / 1, 9 s (`e2e-mut.log`). Repo không bị ghi: `git status --short` rỗng sau mỗi đợt (dòng cuối `mutjs.log`, `e2e-mut.log`).

### 2.1 Bảng R1 (2 dòng của gói D)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-169 | #1048 → #1068 (+ #1081 → #1092) | **ĐÃ SỬA**; biến thể còn hở → **CLR6-D1**, **CLR6-D2** | Theo mô tả DR6-169 (tổng hợp lượt 5 §6.4) và CLR5-D1 / D2 / CXR5-D1, D2, D5 / DSR5-D1, D2. **Tái hiện lượt 5 chạy lại** (probe của chính Claude D lượt 5, `D\r5copy\guard\`, chỉ chạy, không sửa): (a) `remainder.mjs` **11 / 11 REPORTED** (`←`, `–`, `…`, ngoặc kép cong, `\u00d7`, `\u2014`, `{'\u00b7'}`, `&times;`, `&middot;`, `&rarr;`, `&#183;`; lượt 5: 11 / 11 missed) → `D\guard\remainder-r6.log`; (b) `plant-forms.mjs` (cắm `, ` / `; ` / `: ` giữa mọi cặp biểu thức JSX anh em của 67 file `.tsx` được quét, format bằng Prettier của repo) **507 / 507** bị báo: A 93 + 30, B 132 + 3, C 39, D 210 (lượt 5: 123 / 510) → `D\guard\plant-forms-r6.log`; `jsx-near.mjs`: `{t('a')}: <b>{value}</b>` REPORTED; (c) `t333-variants.mjs` 9 / 9 như mong đợi; ca `Promise<<T>() => T>`, `text.split(', ')`, `text.replace(', ', '; ')` không báo (ca của `token-guard.test.ts`). **Đối chiếu cây cú pháp, viết mới cho phạm vi sau T-366** (`D\guard\ast-compare6.mjs`: ký hiệu ngoài comment, escape trong chuỗi / template, thực thể, chuỗi nguyên / mảnh template, chữ JSX hiện ra giữa hai phần tử theo luật khoảng trắng JSX; 356 file `.ts/.tsx` đã track): 1 890 lần báo, **0 bỏ sót**; 5 báo nhầm, cả 5 ở `apps/desktop/src/data/tauri-contract.test.ts` (file test, `lint:tokens` không quét) → CLR6-D2. Thực thể nào bản build thật giải mã: `D\entity-decode.mjs` (Vite 8 `transformWithOxc`): chỉ tên HTML 4 (`&middot;` → `·`…); tên HTML 5 (`&centerdot;`, `&check;`, `&mldr;`…) để nguyên chữ, nên `ENTITIES` đủ cho tập `MARKS`. **Gỡ sửa** (`D\mutjs.log`, 23 đột biến vitest): `R169-revert` (cả file về `37a80b6`) **KILLED** 7 ca; `R169a-marks`, `-escape`, `-escape-braced`, `-escape-x`, `-escape-wide`, `-entity`, `-entity-names`, `-entity-numbers`, `-bmp` đều KILLED; `R169b-old` (luật JSX như lượt 5), `-no-element`, `-close-tag`, `-no-lead`, `-newline`, `-line` KILLED; `R169c-types`, `-callee`, `-whole` KILLED | Dạng "dấu nối sau một phần tử" (`<b>{a}</b>, {b}`) vẫn lọt: giới hạn ghi ở doc (`token-guard.ts:102-103`), gợi ý đọc cây cú pháp ACCEPTED (review #1068) → không báo lại. Còn hở: năm ký hiệu của `vi.ts` ngoài `MARKS` (`▲ ▼ ÷ − 🔒`, cả `&divide;` / `&minus;` mà oxc giải mã) và dấu nối `sep.slash` (` / `) → **CLR6-D1**; dấu `` ` `` trong regex literal làm phần sau của file đọc ngược → **CLR6-D2** |

| DR6-170 | #1049 → #1070 (+ #1081 → #1092) (phần gói D: (1) bảng Khách hàng, (2) dòng meta hồ sơ, (6) ô chọn góc nhìn / `SelectField`; thêm tiêu đề dải chọn RE `RePicker.tsx` của PR #1070) | **ĐÃ SỬA** (phần gói D; (3), (4), (5), (7), (8): gói E; (9): gói C); biến thể còn hở → **CLR6-D3** | **Tái hiện lượt 5 chạy lại** (`D\p21-overflow-culprits.mjs` = probe lượt 5, chỉ đổi cổng; `logs-p21-overflow-r6.log`): KH 81 chữ, RE 160 chữ, RE 30 chữ, RE 46 chữ có dấu cách → Bảng và hồ sơ đều `pageScrollWidth` = cửa sổ (1 100 / 1 440), không phần tử nào quá mép (lượt 5: Bảng 1 329 / 1 889 px, hồ sơ 1 375 px). **Biến thể mới** (`D\p30-overflow-boxes.mjs`, `logs-p30-overflow-boxes.log`): chữ nào vượt mép hộp khối gần nhất (đè sang bên mà trang không cuộn — ca quét không đo), KH 81 + RE 160 + team 160 (đổi tên team qua 9c), góc nhìn Toàn bộ / Team / RE, Kanban / Bảng / hồ sơ / Team & nhân sự, 1 100 và 1 440: **0 chỗ**; cùng probe với chữ rộng `W` như CXR5-D3 / D4 lượt 5 (KH, RE, team đều 160 chữ; `p30w-overflow-boxes.mjs`, `logs-p30w-overflow-boxes.log`): 0 chỗ, trang = cửa sổ ở mọi bước (lượt 5: Bảng 2 811 px, ô góc nhìn 2 409 px); đối chứng dương trên bản đột biến `R170-2-meta`: trang 1 375 / 1 100, dòng meta +299 px (`logs-p30-control-meta.log`), đúng số lượt 5. **Gỡ sửa** (`D\e2e-mut.log`; ca quét `long-names.spec.ts:357`): `R170-1-name`, `R170-1-re` KILLED ("page at Khách hàng, Bảng, Toàn bộ at 1100"), `R170-1-summary` KILLED ("Bảng, Team at 1100"), `R170-2-meta` KILLED ("hồ sơ at 1100"), `R170-6-team`, `R170-6-cap`, `R170-repicker` KILLED ("Lịch hẹn, Team at 1100"), `R170-6-re`, `R170-6-title` KILLED (`toHaveAttribute` title) | Trần `max-w-60` của tên ở ô bảng (`CELL_NAME`, nút tên KH ở Lịch hẹn) không ca nào giữ: đột biến bỏ trần sống, trong khi RE 160 chữ khi đó chiếm 307 px (1 100) / 625 px (1 440) và đẩy cột Họ tên xuống hai dòng → **CLR6-D3**. Ô chọn góc nhìn mở ra vẫn hiện đủ tên (`<option>` giữ nhãn đủ); `title` là nhãn đủ (`selectfield-probe.log`) |

Đếm R1 (2 dòng của gói D): **2 ĐÃ SỬA**, 0 SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY. Biến thể còn hở ghi riêng: CLR6-D1, CLR6-D2 (DR6-169), CLR6-D3 (DR6-170).

### 2.2 Bảng R2 (1 Issue của gói D)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-376 | #1081 → #1092 | **ĐÃ SỬA**; biến thể còn hở → **CLR6-D3** | Theo mục tiêu và test chấp nhận của Issue (`common\fixes.md`) trên code: (1) `JOINS = new Set(['join', 'concat'])` (`token-guard.ts:59`), ca "flags a separator passed to concat(, not the replacement of replace(" (`token-guard.test.ts:233`); `text.split(', ')` / `text.replace(', ', '; ')` vẫn không báo (ca "leaves a separator passed to a call other than .join(", không sửa); (2) "Limits" nêu `concat.call` và chuỗi thay thế của `replace(/\n/g, ', ')` (`:99-103`), doc nêu escape trong chuỗi thuộc tính JSX (`:95-97`); (3) phép thử độ dài trước `JOINER` (`:160`); (4) dạng `{aaaa},{" "}` ⏎ `{bbbb}` trong ca `:276` (dòng `:295`); (5) `CELL_NAME` (`classes.ts:37`) dùng ở `CustomersScreen.tsx:61`, `:80`, `AppointmentsScreen.tsx:192`, `KycHistory.tsx:93`, không còn `NAME` cục bộ ở hai màn đầu (`grep`), `NAME` của `ReportTable.tsx:35` có chú thích `:31-33`; (6) khung `SelectField` (`D\selectfield-probe.mjs`, render bằng `react-dom/server`): không `capped` / `capped={false}` → `"flex flex-col gap-1"`, `capped` → `"flex min-w-0 max-w-80 flex-col gap-1"`, `title` = nhãn đủ (323 ký tự với RE 160 + team 160), giá trị không có trong danh sách → không `title`. Vitest 37 / 37, `lint:tokens` 0 vi phạm (cổng `baseline.md`). **Gỡ sửa:** `T376-concat` **KILLED** (ca `:233`), `T376-dq-second` (nhóm sau dấu chỉ nhận `{' '}`) **KILLED**, `T376-dq-first` KILLED (`mutjs.log`); `T376-cell-nowrap` (`CELL_NAME` bỏ `wrap-anywhere`) **KILLED** ca quét ("page at Lịch hẹn, Toàn bộ at 1100") | **Biến thể gần của các ghi chú gom** (`D\guard\t376-variants.mjs`, 21 ca): `a?.concat(…)`, `a.concat?.(…)`, `[].concat(a, '; ')`, template, chuỗi đứng trước `.concat(`, `concat(` xuống dòng, chuỗi trong hàm thay thế `() => ', '`, tham số mặc định, `{" "}` hai bên / trước dấu / xuống dòng → báo đúng doc; `concat.call`, `join.call`, `replaceAll` → không báo, đúng "Limits". Lọt mà doc không nêu: dấu nối JSX có tab / NBSP / `&nbsp;` sau dấu, `&#44;` thay dấu phẩy, `{','}{' '}` (ghi ở CLR6-D1). Sống: `T376-joiner-first` (bỏ phép thử độ dài: cả bộ 4 493 test xanh — chỉ đổi chi phí, tương đương); `T376-select-space` (khung có dấu cách thừa như trước T-376: tương đương, ACCEPTED review #1092 "khung `SelectField` chỉ có probe"); `T376-cell-nocap` (bỏ trần `max-w-60` của `CELL_NAME`) → **CLR6-D3** |

Đếm R2 (1 Issue của gói D): **1 / 1 ĐÃ SỬA**.

Đối chiếu thêm các mô tả gốc lượt 5 đã gộp vào hai dòng R1 (`docs/reviews/raw/2026-11-05/{claude,codex,deepseek}/D.md`): CLR5-D1, CXR5-D1, DSR5-D1 (ký hiệu, escape) → `remainder.mjs`, `r1-37-guard.mjs` REPORTED; CLR5-D2, CXR5-D5 (`{a}:{' '}{b}`, dạng Prettier) → ca `token-guard.test.ts:276`, `plant-forms` 507 / 507; CXR5-D2 (`Promise<<T>() => T>`) → ca riêng, `R169c-types` KILLED; DSR5-D2 (`split` / `replace`) → không báo; CLR5-D3, CXR5-D3, CXR5-D4 (Bảng KH, dòng meta, ô góc nhìn) → K10, K11, K11b, đột biến e2e.

## 3. Phạm vi đã đọc

**Diff `37a80b6..5b1328a` của gói D** (`git diff --numstat -M`, xếp theo `common\files-D.txt`): 9 file, SP +124 / −28 ở 8 file, test +177 / −0 ở 1 file (= `baseline.md`). 5 commit chạm gói D: #1068 (`31f7fc2`, T-366: `token-guard.ts` +72 / −18, test +158), #1070 (`dd5ae56`, T-367: `CustomerProfile.tsx`, `CustomersScreen.tsx`, `RePicker.tsx`, `ScopePicker.tsx`, `SelectField.tsx`), #1072 (`e9f2eb1`, T-368: `vi.ts` +2), #1092 (`64720db`, T-376: `classes.ts`, `CustomersScreen.tsx`, `SelectField.tsx`, `token-guard.ts` +21 / −12, test +19), #1097 (`5d07d5e`, T-380: `vi.ts` +4). **Đọc từng hunk, cả 9 file**; đọc hết `token-guard.ts` (215 dòng) ở SHA ghim, phần mới của `token-guard.test.ts` (8 ca mới), `SelectField.tsx` (92), `ScopePicker.tsx`, `RePicker.tsx`, `classes.ts`, các chỗ đổi của `CustomersScreen.tsx` / `CustomerProfile.tsx`; ba khóa mới của `vi.ts` (`trash.goneAt`, `trash.blocked.teamDeletedAt`, `trash.restoreLabel.deletedAt`: chữ của gói E, có chỗ dùng — `keys.log` 0 khóa không dùng).

**Phần còn lại của gói, từng file của `common\files-D.txt` (89 file: 63 SP, 26 test)** — ai đọc:

| Nhóm file | Đọc hết | Không đọc kỹ (và vì sao) |
|---|---|---|
| `packages/ui/src/token-guard.ts` (+ test) | phiên chính: đọc hết `.ts`; test: 8 ca mới đọc hết, ca cũ qua tên ca + 23 đột biến | — |
| `packages/ui/src/components/**` (DataTable, `table-view`, `compare-cells`, `show-more`, Dialog, `dialog-focus`, TextField, `field-notes`, SelectField, Choices, Segmented, PeriodPicker + `label`, Button, Chart, `chart-theme`, NavIcon, StageBadge, PolicyBadge), `packages/ui/src/{index.ts, tokens.css, theme.css}` | S2 (phiên chính đọc lại SelectField, Segmented, Chart) | `fonts.css`: S2 đọc phần đầu và danh sách `@font-face`, không soát từng `unicode-range` (chỉ khai font, OFL, K39) |
| `apps/desktop/src/shell/**` (AppShell, Brand, CloseGuard + `close-guard.ts`, ErrorBoundary, RePicker, SaveWarning, ScopeContext, ScopePicker, `scope.ts`, Sidebar, StartupError + `startup-error.ts`, `screen-error.ts`, `block-reload.ts`, `routes.ts`, `useRoute.ts`) | S2 (phiên chính đọc lại `scope.ts`, `useRoute.ts`, `ScopePicker.tsx`, `RePicker.tsx`, phần `AppShell.tsx` của góc nhìn) | test của shell (`routes`, `close-guard`, `CloseGuard`, `SaveWarning`, `Sidebar`, `screen-error`, `block-reload`, `startup-error`, `scope`): S2 đọc tên ca và các `expect`, không từng dòng |
| `apps/desktop/src/routes/team/**` | S2 (phiên chính đọc lại `PersonDialogs.tsx:50-82`, `TeamScreen.tsx:118-130`, `:205-215`) | — |
| `apps/desktop/src/i18n/index.ts` (+ test) | S2 | `index.test.ts`: S2 đọc 60 dòng đầu (phần còn lại là ca dịch `DbError`, phủ bởi `r1-slots.mjs`) |
| `apps/desktop/src/i18n/vi.ts` (1 384 dòng) | phiên chính: dòng 1–330, mọi hunk của diff, các khóa của phát hiện; cả file qua probe `r1-keys`, `r1-slots`, `vi-shape`, `vi-marks`, `marks-scan`, `hardcoded-ui` | đọc từng dòng 331–1 384: không — đây là chữ của mọi màn; nhãn của từng màn gói D do S1 / S2 đọc theo khóa mà file của họ dùng, nhãn của màn gói khác thuộc gói đó |
| `apps/desktop/src/{App.tsx, main.tsx, index.css}`, `apps/desktop/index.html`, `routes/{Screen.tsx, classes.ts}`, `ui-{button,choices,datatable}.test.tsx` | S2 (phiên chính đọc `classes.ts`) | — |
| `apps/desktop/src/routes/customers/**` (không AI, không Hợp đồng: `CustomersScreen`, `CustomerDialogs`, `CustomerProfile`, `CustomerKyc`, `KycDialogs`, `CustomerAppointments`, `customers-view`, `kyc-view` và ba test), `routes/{stage-badge.tsx, money-view.ts}` (+ test) | S1: cả 14 file (phiên chính đọc phần đổi của `CustomersScreen.tsx`, `CustomerProfile.tsx`, và đọc lại `CustomerAppointments.tsx:50-56`, `CustomerKyc.tsx:296-337`, `KycDialogs.tsx:51-156`, `CustomerDialogs.tsx:145-165`, `:440-456`, `kyc-view.ts:190-205`, `:280-296`, `:345-366`) | — |

S1, S2 đọc thêm chỗ gói khác mà gói D gọi: `db` (`customers.ts`, `kyc.ts`, `counts.ts`, `team.ts`, `person-references`, `backup-validation.ts:200-239`), `domain` (`kyc.ts`, `kyc-fact.ts`, `kyc-catalog.ts`, `text.ts`, `appointment-counts.ts:1-50`, `period.ts`), `apps/desktop/src/data/*` (`app-data.ts`, `persist-queue.ts`, `today.ts`); spec Phase 3 §3.3–§4, Phase 4 §3.1, Phase 6 §4.1–§4.2; mockup `customer-forms.html` (đủ), `kyc-forms.html:120-333`, `customers.html:410-453`, `team.html`, `phase-3-feedback.html` B1 / B2, `settings-data.html` 10d. Không subagent nào đọc file AI / Hợp đồng (gói C / E) ngoài chỗ gói D gọi.

**Tài liệu (phiên chính):** `CLAUDE.md` gốc, `apps/desktop/CLAUDE.md`, `packages/ui/CLAUDE.md`, `packages/domain/CLAUDE.md`, `.claude/rules/{i18n-ui,mockups}.md`; `common\prompt-claude.md` (đủ), `plan.md` (§4, §L6.0–§L6.8), `known.md` (phần 1 OPEN / ACCEPTED, K1–K50, phần 3, bảng R1 / R2; đoạn "Rà sổ G7" dài 46 855 ký tự đọc theo từ khóa gói D), `fixes.md` (T-366, T-367, T-376 và nhóm RESOLVED), `baseline.md` (đầu, cổng, bundle); tổng hợp lượt 5 §6; báo cáo gốc lượt 5 Claude D (đủ), Codex D (CXR5-D1…D5), DeepSeek D (DSR5-D1, D2); `claude\A.md` (ID + CLR6-A1), `B.md` (ID), `C.md` (ID + CLR6-C4, C13) để không báo trùng.

## 4. Kịch bản đã thử

Mọi probe trình duyệt: Edge (Playwright, `D\browser.mjs`), chặn mạng ngoài 127.0.0.1 / localhost và thay `window.open` từ lần chạy đầu; mọi log kết thúc `requests blocked (not 127.0.0.1) []`, `page errors []`.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| K1 | Dạng "missed" của lượt 4–5 (`remainder.mjs`, `r1-37-guard.mjs`): `← – …`, ngoặc kép cong, escape, thực thể | 11 / 11 và 20 / 20 REPORTED | R1 DR6-169 |
| K2 | Cắm `, ` / `; ` / `: ` giữa mọi cặp biểu thức JSX anh em của 67 file `.tsx` được quét, format bằng Prettier của repo (`plant-forms.mjs`) | 507 / 507 bị báo (lượt 5: 123 / 510) | R1 DR6-169 |
| K3 | Bộ chặn so cây cú pháp TypeScript trên 356 file `.ts/.tsx` (`ast-compare6.mjs`, viết mới theo phạm vi sau T-366) | 1 890 lần báo; 0 bỏ sót; 5 báo nhầm, chỉ ở `tauri-contract.test.ts` (không quét) | CLR6-D2 |
| K4 | Thực thể HTML nào bản build thật (Vite 8, oxc) giải mã thành ký hiệu (`entity-decode.mjs`, 43 tên) | Chỉ tên HTML 4; `&divide;` → `÷`, `&minus;` → `−` (ngoài tập của bộ chặn) | CLR6-D1 |
| K5 | Ký hiệu / dấu nối của `vi.ts` ngoài tập của bộ chặn (`guard-gaps.mjs`) | 13 / 13 missed; đối chứng 3 / 3 REPORTED | CLR6-D1 |
| K6 | Regex literal chứa `` ` `` / `'` / `"` rồi comment có ký hiệu và dấu nối JSX (`regex-quotes.mjs`) | Báo nhầm trong comment, bỏ sót `}, {`; 32 regex như vậy trong repo, 0 ở file được quét | CLR6-D2 |
| K7 | Biến thể của các ghi chú T-376 gom (`t376-variants.mjs`, 21 ca: `concat` các dạng, `replace` / `replaceAll`, `{" "}`, tab / NBSP / `&nbsp;` / `&#44;`) | 16 đúng doc; 5 lọt mà doc không nêu (ghi ở CLR6-D1) | R2 T-376, CLR6-D1 |
| K8 | Biến thể T-333 và dấu nối cạnh phần tử (`t333-variants.mjs`, `jsx-near.mjs`) | 9 / 9 như mong đợi; `{t('a')}: <b>` REPORTED; "sau phần tử" lọt (giới hạn ghi ở doc) | R1 DR6-169 |
| K9 | Gỡ phần sửa của bộ chặn: 23 đột biến vitest (`mutjs.mjs`) | 22 KILLED; `T376-joiner-first` sống (chỉ đổi chi phí, cả bộ 4 493 test xanh) | R1, R2 |
| K10 | Tái hiện DR6-170 lượt 5 (`p21-overflow-culprits.mjs`): KH 81, RE 160, RE 30, RE 46 có dấu cách | Không tràn ở Bảng / hồ sơ, 1 100 và 1 440 | R1 DR6-170 |
| K11 | Chữ vượt mép hộp khối của nó (đè mà trang không cuộn) ở mọi màn gói D, góc nhìn Toàn bộ / Team / RE, KH 81 + RE 160 + team 160 (`p30-overflow-boxes.mjs`) | 0 chỗ; đối chứng dương trên bản đột biến: +299 px | R1 DR6-170 |
| K11b | Như K11 với chữ rộng `W`, KH / RE / team đều 160 chữ (biến thể CXR5-D3 / D4 lượt 5; `p30w-overflow-boxes.mjs`) | 0 chỗ; trang = cửa sổ ở mọi bước | R1 DR6-170 |
| K12 | Gỡ phần sửa tên dài: 13 đột biến e2e qua ca quét (`e2e-mut.mjs`) | 10 KILLED đúng màn; `T376-cell-nocap`, `X-appt-btn-nocap` sống; `T376-select-space` sống (tương đương) | R1, R2, CLR6-D3 |
| K13 | Bảng Khách hàng với RE 160 chữ, trần `max-w-60` có / không (`p31-cell-cap.mjs`) | Không trần: cột RE 307 / 625 px, Họ tên xuống 2 dòng ở 1 100 | CLR6-D3 |
| K14 | Khung và `title` của `SelectField` (`selectfield-probe.mjs`, `react-dom/server`) | Đúng test chấp nhận của T-376 ở 5 ca | R2 T-376 |
| K15 | Khóa / slot i18n và export của gói D (`r1-keys.mjs`, `r1-slots.mjs`, `r1-exports.mjs`, probe lượt 4–5) | 1 197 khóa (lượt 5: 1 194; +3 khóa Thùng rác của T-380 / T-382), 0 không dùng, 0 chỉ test dùng; 5 lời gọi thiếu slot như lượt 3–5 (4 khuôn có chủ ý + `extraction.proposed`, gói C); export như lượt 5 | — |
| K16 | Hình của mọi giá trị `vi.ts` (`vi-shape.mjs`, import chính module: 1 202 giá trị): ngoặc `{}` lệch, slot có dấu cách, hai dấu cách, dấu cách đầu / cuối, `...` | Chỉ `aiPanel.web.ready` mở bằng dấu cách (có chủ ý, theo sau tiêu đề in đậm) và đuôi file `.p2cbackup` | — |
| K17 | Chữ UI viết cứng trong JSX của app và `packages/ui` (`hardcoded-ui.mjs`, cây cú pháp, 67 file `.tsx`): chữ JSX có chữ cái; `aria-label` / `title` / `placeholder` / `alt` / `label` / `subtitle` / `help` / `error` là chuỗi có chữ cái | 0 chỗ | — |
| K18 | Tên truy cập / mô tả của ô chọn góc nhìn có trần (`p32-scope-a11y.mjs`, CDP `Accessibility.getFullAXTree`) | Mô tả = giá trị ở cả ô Team và ô RE; ô không trần (5a) không mô tả | CLR6-D4 |
| K19 | Bộ chặn có vào bundle không (`dist-base\assets\*.js`, tìm `hardcoded-separator` / `findHardcodedSeparators`) | 0 / 4 file JS; `index.js` 894 875 B (= `baseline.md` + 10 B chuỗi neo ngày) | — |
| K20 | Tên truy cập trùng của nút / link / ô trong `<main>` ở mọi màn gói D (`p33-dup-names.mjs`, CDP): Khách hàng Kanban / Bảng, 3 hồ sơ, Team & nhân sự từng team | Chỉ hồ sơ: "AI trích xuất" ×2–5 (khác ghi chú) và "Hẹn tiếp sau lịch …" ×2 (thẻ Lịch hẹn + dòng thời gian, cùng việc) | CLR6-D5 |
| K21 | Các nút "AI trích xuất" của dòng thời gian: ghi chú nào, có gì phân biệt (`p34-extraction-names.mjs`) | 2 / 5 / 5 nút trên 3 hồ sơ, không `aria-label` / `aria-describedby` | CLR6-D5 |
| K22 | Cùng probe trên màn ngoài gói D (`p35-dup-names-all.mjs`): Tổng quan, Lịch hẹn + chi tiết, Báo cáo, Cài đặt (Dữ liệu, AI, Thùng rác) | Không tên trùng | CLR6-D5 (cùng mẫu) |

**Kịch bản của subagent S2** (Team, vỏ app, `packages/ui`; probe và log ở `D\s2\`; dòng có ID đã được phiên chính chạy lại hay đọc lại code):

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| S2-K1 | Team: đổi tên team đang hiện mặc định / đã bấm chọn (`p01`) | Mặc định thì nhảy sang Hừng Đông, focus tiêu đề team khác; đã chọn thì giữ | CLR6-D6 |
| S2-K2 | Khách hàng góc nhìn Team (chưa đổi ô) + chọn RE ở dải → đổi tên team / tạo team "An Phú" (`p01`) | Nhảy team, mất RE đã chọn | CLR6-D6 |
| S2-K3 | Góc nhìn RE (chưa đổi ô) → thêm RE tên xếp đầu (`p01`) | Nhảy sang RE mới | CLR6-D6 |
| S2-K4 | Chọn team + RE rõ ràng, đổi tên team và RE, quét Khách hàng (Kanban, Bảng), Lịch hẹn, Tổng quan, Báo cáo, `aria-label` / `title` / chữ SVG (`p06`) | Không còn tên cũ; chọn theo id giữ | — |
| S2-K5 | Sửa người hỗ trợ / TL → RE (seed), so với 9b cùng người (`p02`) | Câu từ chối bảo việc không làm được | CLR6-D7 |
| S2-K6 | IS chỉ đánh giá cuộc gặp của KH đã xóa → RE (lớp dữ liệu, `p03`) | `REVIEWER_IN_USE` không nhắc Thùng rác | CLR6-D7 |
| S2-K7 | 9a: dấu cách cuối tên → Xóa nhân sự (`p02`) | Hỏi "Có thay đổi chưa lưu" | CLR6-D10 |
| S2-K8 | 9a / 9c: dán tên có NUL (`p02`) | 9a báo ở khung form (như hộp KH), 9c báo trên ô; chữ đúng | — |
| S2-K9 | Tên truy cập vùng thành viên và bảng (`p02`) | "Thành viên team Bình Minh" cho cả vùng và bảng: dư, không sai | — |
| S2-K10 | Exe giả (`asExe`): lưu lỗi → mở Sửa nhân sự → đóng cửa sổ: hộp đóng app chồng trên hộp; Escape; Thử lại vẫn lỗi; Đóng và bỏ (`p04`) | Hộp đóng app ở trên, focus "Thử lại"; Escape về ô tên, giữ chữ; Thử lại hỏi lại; bỏ thì gọi `destroy` | — |
| S2-K11 | Team mở qua giao thừa 31/12/2026 → 01/01/2027 (tua đồng hồ, `p04`) | Cột thành "HĐ năm 2027", số HĐ 22 → 0; "Lịch hẹn 30 ngày" đổi đúng | — |
| S2-K12 | 21 hash lạ khi đang chạy + 4 route lưu lạ lúc mở (`p05`) | Màn đúng, không lỗi console; thanh địa chỉ không sửa khi route trùng màn đang mở | CLR6-D9 |
| S2-K13 | Biên kỳ Tùy chọn qua hàm của bộ chọn kỳ (`p07`): 29/02, cuối tháng, 1900 / 2100, chữ số toàn hình, d/m/yyyy, đảo ngày, ‹ › ở biên | Khớp spec Phase 4 §3.1 | — |
| S2-K14 | Ctrl / chuột giữa trên link sidebar trong exe; vuốt touchpad (đọc mã wry 0.55.1 / tauri-runtime-wry 2.11.4) | `NewWindowRequested` không handler → `SetHandled(true)`; `SetIsSwipeNavigationEnabled(false)`: không mở cửa sổ thứ hai, không lùi lịch sử | — |
| S2-K15 | Đột biến `S2MA` (vế team của `changed`), `S2MB` (`ArrowDown`) trên e2e + unit | Cả hai sống | CLR6-D8 |

**Kịch bản của subagent S1** (phần Khách hàng; probe và log ở `D\s1\`; dòng có ID đã được phiên chính chạy lại hay đọc lại code):

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| S1-K1 | KH không ngày sinh / giới tính → 7a trường phụ (v1) (`p01` A) | Lý do "thay đổi quan trọng" sai | CLR6-D11 |
| S1-K2 | Đối chứng: 7a v2 trường phụ (`p01`) | Ô bật tay, đúng | — |
| S1-K3 | 5d ngày 10/09, trước ngày tạo 15/09 (`p01` B) | Câu gọi việc tạo KH là đổi nhóm | CLR6-D12 |
| S1-K4 | 5d Hủy → focus (`p01` B2) | Về nút "Chuyển nhóm" | — |
| S1-K5 | Hai RE trùng tên cùng team → 5a / 5c / hồ sơ / màn Team (`p02`) | Hai lựa chọn giống hệt, không cảnh báo | CLR6-D13 |
| S1-K6 | 7a: Enter trong ô Giá trị khi dữ kiện chưa thêm (`p03` A) | Hộp còn mở, câu "Dữ kiện đang nhập chưa được thêm…", không mất dữ liệu | — |
| S1-K7 | 7a mâu thuẫn trường cốt lõi Số con 2 → 3 (`p03` B) | v3 tự động material, cổng `CONFLICT_RESOLUTION`: đúng | — |
| S1-K8 | 7d bằng bàn phím (`p03` C) | Enter mở → focus radio đầu; Tab → Hủy; lưu khi chưa chọn → "Chọn giá trị đúng."; "Sau khi lưu: KYC v4 · cổng KYC …" đúng; sau lưu focus về H2 "Dữ kiện KYC"; tên radio đọc rõ | — |
| S1-K9 | 5c xóa ngày sinh + chọn "Chưa rõ" (`p03` D) | `KYC_PROFILE_FIELD_REQUIRED` (D2), không khung "Khi lưu" | — |
| S1-K10 | 5c đổi sang đủ ngày cùng năm + đổi giới tính (`p03` E) | Xem trước khớp kết quả lưu (v5, "+ F6, F7"), tuổi 42 | CLR6-D15 |
| S1-K11 | Chữ truy cập của khung 5c (`p04` A) | Chip dính liền | CLR6-D15 |
| S1-K12 | 7c "Đang có" ↔ mô tả của ô (`p04` B) | Không liên kết | CLR6-D16 |
| S1-K13 | `amountRead` / `kycAmountRead`: 18 số biên (1 ₫ … 100 tỷ, 9 995 000 → "10 tr", 999 999 999 → "1 tỷ") + 32 chuỗi ("1tr5", "5 TỶ", "5tỉ", "５ tỷ", "5 tỷ.", "2 trăm triệu", "200,000₫"…) (`p05`) | Không lỗi; chữ không đọc được thì không hiện dòng đọc lại; "100 tỷ 1" đọc 100,1 tỷ (trường KYC là chữ tự do, không chịu trần K3) | — |
| S1-K14 | Ba lịch cùng ngày 15/09, hai lịch không giờ (`p06`) | Nút "Hẹn tiếp" trùng tên | CLR6-D5 (b) |
| S1-K15 | Chuỗi nhiều bước (`p07`): 5a lùi ngày (01/09, N3, 1980, Nam) → 7a hai dữ kiện ("6 tỷ" đọc lại đúng) → 7a mâu thuẫn phụ → 7d có tích material → + Lịch hẹn 16/09 → 5d N3 → N2 → 5c đổi RE → 5f → Thùng rác → Khôi phục → "Mở hồ sơ" → Kanban | Số khớp: 5f "1 (0 đã gặp · 0 lần tính RF), HĐ 0, Ghi chú KYC 3" = dòng Thùng rác = hộp khôi phục; bàn giao 1 lịch, sau khôi phục lịch mang RE mới; KYC v4 có Bác sĩ, nhãn material lưu đúng; focus sau 5f về H1 | CLR6-D17 |
| S1-K16 | 18 đột biến hành vi trên 5a–5f, 7a–7d, Kanban, hồ sơ, thẻ Lịch hẹn; mỗi đột biến một bản dựng ngoài repo, chạy e2e liên quan; đối chứng 40 / 40 | 11 bị giết ở spec nhắm; `M06` (hồ sơ thiếu team) sống ở 2 spec, bị `full-cycle.spec.ts:208` giết; 6 sống (`M05`, `M07`, `M10`, `M12`, `M17`, `M18`) — `M07` ("Câu hỏi gợi ý" luôn mở) không spec / mockup nào định trạng thái, không ghi | CLR6-D14 |

## 5. Phát hiện mới

17 phát hiện, cả 17 CONFIRMED; 0 Critical / High / Medium; 0 KNOWN có bằng chứng mới riêng (CLR6-D2 nêu hậu quả mới của một giới hạn đã ACCEPTED, ghi thành phát hiện). Ai tìm: CLR6-D1…D5 (a) phiên chính; CLR6-D6…D10 subagent S2; CLR6-D5 (b), D11…D17 subagent S1. Mọi phát hiện của subagent được phiên chính đọc lại vị trí trên code, và chạy lại probe của subagent trên bản ghim của phiên chính (cổng 4811) khi phát hiện dựa trên màn. Phát hiện "S1-7" của S1 (thứ tự trong ngày của dòng thời gian) ghi thành CLR6-D17; "S1-6" gộp vào CLR6-D5 (b).

### CLR6-D1 — Bộ chặn ký hiệu không biết năm ký hiệu của `vi.ts` (`▲ ▼ ÷ − 🔒`) và dấu nối `sep.slash` (` / `)

```
ID: CLR6-D1
Mức: Nit
Trục: A (i18n), T
Vị trí: packages/ui/src/token-guard.ts:69-72 (MARKS: chỉ `·→–` và `✓○×▾▸—←…“”‘’`), :53 (JOINER `/^[,;] $/`), :66 (JSX_JOINER `[,;:]`), :87-93 (doc: "Finds a separator … or mark … of `vi.ts` … so they live in `vi.ts` only"); packages/ui/scripts/check-tokens.ts:2-3; apps/desktop/src/i18n/vi.ts:10 (`sep.slash` ' / '), :928 (`outcomeEdit.lockMark` '🔒'), :988-989 (`overview.up` / `overview.down` '▲ …' / '▼ …'), :993 (`overview.formula` '÷'), :1366 (`policyForm.countMoved` '−1') (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-169 (biến thể còn hở), DR6-145, DR6-37 · có từ trước (tập ký hiệu viết tay từ DR6-37; T-366 thêm đúng các ký hiệu Issue #1048 liệt kê), lượt 1–5 bỏ sót
```

- **Mô tả:** Doc của hàm và đầu `check-tokens.ts` hứa ký hiệu và dấu nối của `vi.ts` "chỉ ở `vi.ts`"; tên PR #1068 là "finds every mark of vi.ts". Nhưng tập ký hiệu (`MARKS`) và dấu nối (`JOINER`, `JSX_JOINER`) là danh sách viết tay, không đọc từ `vi.ts`: năm ký hiệu `vi.ts` đang dùng (`▲`, `▼`, `÷`, `−` U+2212, `🔒`) và dấu nối `sep.slash` (` / `) lọt ở mọi cách viết, kể cả thực thể `&divide;` / `&minus;` mà bản build giải mã. Ngoài ra lọt mà doc không nêu: dấu nối JSX có tab / NBSP / `&nbsp;` sau dấu, `&#44;` thay dấu phẩy, `{','}{' '}`.
- **Tái hiện / bằng chứng:**
  - `node D\guard\guard-gaps.mjs` (`guard-gaps.log`): `<span>▲ {value}</span>`, `<span>▼ {value}</span>`, `` `${issued} HĐ phát hành ÷ ${count} RF` ``, `'−1'`, `<i>🔒</i>`, `&divide;`, `&minus;`, `'÷'`, `'▲'`, `parts.join(' / ')`, `` `${a} / ${b}` ``, `<p>{a} / {b}</p>`, `a + ' / ' + b` → **13 / 13 missed**; đối chứng `·` trong JSX, `.join(', ')`, `{a}, {b}` → REPORTED.
  - `node D\entity-decode.mjs` (`entity-decode.log`, Vite 8 `transformWithOxc` của bản build): `&divide;` → `"÷"`, `&minus;` → `"−"` (giải mã), bộ chặn: missed. (Tên HTML 5 như `&check;`, `&centerdot;` thì oxc để nguyên, nên không phải lỗ.)
  - `node D\guard\t376-variants.mjs` (`t376-variants.log`): `{a},\t{b}`, `{a},` + NBSP + `{b}`, `{a},&nbsp;{b}`, `{a}&#44; {b}`, `{a}{','}{' '}{b}` → 0 báo.
  - App hôm nay không có chỗ nào: `node D\marks-scan.mjs` (`marks-scan.log`; cây cú pháp TypeScript, mọi chuỗi / template / chữ JSX ngoài comment, trừ test và `vi.ts`): trong các file `lint:tokens` quét **0 lần**; các lần có đều ngoài phạm vi quét — hàm định dạng chuẩn của domain (`money.ts:70`, `:157`, `:189`; `period.ts:71`, `:361`, `:424-425`), dữ liệu / seed của `db` (`database.ts:258`, `seed-data.ts`), prompt / danh sách chặn của `ai`.
- **Cùng mẫu:** đếm ký tự không phải chữ / dấu của `vi.ts` (`node D\vi-marks.mjs`, `vi-marks.log`): `·` 131, `—` 64, `→` 41, `…` 22, `–` 13, `₫` 4, `←` 2, `✓` 2, `×` 2, `○` 1, `▾` 1, `▸` 1, `▲` 1, `▼` 1, `÷` 1, `−` 1, `🔒` 1 (`§` chỉ trong comment). Ngoài `MARKS`: `▲ ▼ ÷ − 🔒` (và `₫`, đơn vị tiền, cũng do `formatVnd` của domain ghi). Khóa `sep.*` (`vi.ts:5-10`): `sep.dot`, `sep.arrow`, `sep.range` (trong `MARKS`), `sep.list`, `sep.semicolon` (`JOINER`), `sep.slash` (không có). Họ DR6-37 → 145 → 169: lần thứ tư một phần của "ký hiệu của `vi.ts`" lọt vì danh sách viết tay theo từng Issue.
- **Ảnh hưởng:** không ai thấy khác ở bản hiện tại; một chuỗi cứng `▲ {v}`, `` `${a} ÷ ${b}` ``, `{a} / {b}`, `.join(' / ')` viết sau này vào được repo mà `pnpm verify` xanh.
- **Chặn phát hành:** không — Nit trục A / T (K48); công cụ kiểm, không vào exe (`token-guard.ts` không có trong bundle, lượt 5 §6.1).
- **Đề xuất:** một nguồn cho cả họ: `check-tokens.ts` import `vi`, dựng tập ký tự không phải chữ / số / ASCII của các giá trị và các giá trị `sep.*`, đưa vào `findHardcodedSeparators` (hoặc một ca test đòi mọi ký hiệu và mọi `sep.*` của `vi.ts` có trong tập của bộ chặn); dấu nối nhận cả ` / `; ký tự ngoài BMP (`🔒`) đọc theo code point. ≈ 15–25 dòng công cụ + ≈ 20 dòng test. Theo K49: sau v1.0.

### CLR6-D2 — Dấu `` ` `` trong regex literal làm bộ chặn đọc ngược phần còn lại của file: báo nhầm trong comment, bỏ sót dấu nối JSX

```
ID: CLR6-D2
Mức: Nit
Trục: T
Vị trí: packages/ui/src/token-guard.ts:188-192 (ở chế độ code, `'` `"` `` ` `` luôn mở chuỗi / template, cả khi nằm trong regex literal), :177-180 (chỉ chuỗi `'` / `"` tự đóng ở cuối dòng; template chạy qua dòng), :99 (doc: "it does not read a regex literal (an escape there is missed)") (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-169, DR6-145 (c); ACCEPTED review #1068 (gợi ý đọc cây cú pháp, "các giới hạn đã ghi ở doc") — bằng chứng mới: hậu quả rộng hơn câu của doc · có từ trước (máy trạng thái của PR #920); chỗ gặp trong repo mới do đợt sửa sau lượt 5 (`tauri-contract.test.ts:374`, T-381 / T-382 / T-384)
```

- **Mô tả:** Một `` ` `` trong regex literal mở một template giả chạy qua các dòng sau tới dấu `` ` `` kế tiếp; từ đó bộ chặn đọc ngược phần còn lại của file (comment thành chữ, code thành template). Kết quả: báo nhầm ký hiệu / dấu nối nằm trong comment, và bỏ sót dấu nối JSX thật phía sau. Doc chỉ nói "không đọc regex literal (escape trong đó lọt)".
- **Tái hiện / bằng chứng:** `node D\guard\regex-quotes.mjs` (`regex-quotes.log`): mẫu bốn dòng `s.replace(/[`]/g, "")`, `// a comment may use → and ·`, `<p>{a}, {b}</p>`, `` const t = `x`; `` → báo `→`, `·` ở dòng 2 (comment) và **không** báo `}, {` dòng 3; cùng mẫu với `/[x]/g` → chỉ báo `}, {` dòng 3. Trên repo (`D\guard\ast-compare6.mjs`, `ast-compare6.log`): 5 báo nhầm ở `apps/desktop/src/data/tauri-contract.test.ts:377` (hai `` `, ` ``, `…`), `:381` (`…`), `:436` (`` `, ` ``), cả năm sau regex `/[\\`]\r?\n/g` ở `:374`.
- **Cùng mẫu:** `node D\guard\regex-quotes.mjs` (cây cú pháp, mọi regex literal có `'` / `"` / `` ` `` trong 356 file `.ts/.tsx` đã track): 32 regex; có `` ` ``: `apps/desktop/src/data/tauri-contract.test.ts:374`, `e2e/guide/links.ts:14`, `:19`, `packages/ai/src/prompts/prompts.test.ts:11`, `packages/ai/src/web.test.ts:26`. **0 regex như vậy trong file `lint:tokens` quét** (cả 32 ở file test / e2e / package khác, và `token-guard.ts:66` không thuộc thư mục quét).
- **Ảnh hưởng:** không ai thấy hôm nay (`lint:tokens` bỏ file test). Một file app sau này có regex chứa `` ` `` (vd. bỏ dấu nháy ngược khỏi chữ dán) thì `pnpm verify` đỏ vì comment, hoặc mất kiểm dấu nối JSX ở phần sau của file mà không ai biết.
- **Chặn phát hành:** không — Nit trục T (K48).
- **Đề xuất:** ở chế độ code, nhận đầu regex literal (sau `(` `,` `=` `:` `[` `!` `&` `|` `?` `{` `}` `;` hay `return`) và bỏ qua tới `/` đóng (tính lớp `[...]` và escape); tối thiểu ghi đúng hậu quả vào "Limits" kèm một ca ghim. Cách triệt để là đọc cây cú pháp (ACCEPTED, sau v1.0). ≈ 10–15 dòng công cụ + 2 ca test.

### CLR6-D3 — Trần `max-w-60` của tên ở ô bảng (`CELL_NAME`, nút tên KH ở Lịch hẹn) không ca nào giữ

```
ID: CLR6-D3
Mức: Low
Trục: T
Vị trí: apps/desktop/src/routes/classes.ts:37 (`CELL_NAME = 'block max-w-60 wrap-anywhere'`, doc :32-36; dùng ở apps/desktop/src/routes/customers/CustomersScreen.tsx:61, :80, apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:192, apps/desktop/src/routes/customers/KycHistory.tsx:93); apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:181 (nút tên KH `max-w-60 … wrap-anywhere`); e2e/long-names.spec.ts:357 (ca quét chỉ đòi trang / `main` không cuộn ngang), :317 (chỉ cột Team của Theo RE có phép đo ≤ 240 px) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-170, DR6-174 (c) (cùng họ: trần tên không ca nào giữ), T-376 · mới do đợt sửa sau lượt 5 (PR #1070 thêm trần, PR #1092 gom thành `CELL_NAME`)
```

- **Mô tả:** Doc của `CELL_NAME` hứa "dưới trần thì giữ một dòng, cột giữ bề rộng; tên dài hơn xuống dòng ở trần". Ca quét của T-367 chỉ đòi không cuộn ngang, nên bỏ trần `max-w-60` (giữ `wrap-anywhere`) vẫn xanh, trong khi bảng đổi hình rõ với tên dài.
- **Tái hiện / bằng chứng:** `node D\e2e-mut.mjs T376-cell-nocap` → **SURVIVED** (1 passed, 9 s); `X-appt-btn-nocap` (bỏ `max-w-60` của nút tên KH, `AppointmentsScreen.tsx:181`) → **SURVIVED** (`e2e-mut.log`). Đối chứng: `T376-cell-nowrap` (bỏ `wrap-anywhere`) KILLED. Hậu quả đo (`node D\p31-cell-cap.mjs`, `logs-p31-cell-cap.log`; RE đổi tên 160 chữ, Khách hàng → Bảng): bản ghim cột RE 251 px (1 100) / 363 px (1 440), Họ tên 141 / 201 px, tên một dòng; bản bỏ trần cột RE **307 / 625 px**, Họ tên **91 / 111 px**, tên KH "Bùi Ngọc Q…" xuống **2 dòng** ở 1 100; ở 1 440 các cột Nhóm 150 → 108, Ngày sinh 135 → 97, Từ ngày 139 → 99 px. Trang không cuộn ngang ở cả hai bản.
- **Cùng mẫu:** `rg -n "max-w-60" apps/desktop/src` → `CELL_NAME` (4 chỗ dùng), `AppointmentsScreen.tsx:181`, `ReportTable.tsx:35` (`NAME`); `rg -n "contentWidth|toBeLessThanOrEqual\(240" e2e` → chỉ `long-names.spec.ts:317` (cột Team của Theo RE, thêm ở T-367 cho DR6-174 (c)). Không ca nào giữ: `CELL_NAME` (bảng KH tên + RE, Lịch hẹn RE, lịch sử KYC model) và nút tên ở Lịch hẹn.
- **Ảnh hưởng:** không ai thấy hôm nay; một lần sửa class sau này bỏ trần thì tên dài bất thường làm các cột khác của bảng KH / Lịch hẹn / lịch sử phân tích hẹp lại và xuống dòng mà CI xanh. Chỉ hiển thị.
- **Chặn phát hành:** không — Low trục T (K48).
- **Đề xuất:** như DR6-174 (c): ca quét đo thêm `contentWidth ≤ 240` cho ô tên / RE của Khách hàng → Bảng, ô RE và nút tên của Lịch hẹn, ô model của lịch sử phân tích (một helper cho mọi ô có trần). ≈ 0 dòng SP + ≈ 10–15 dòng e2e.

### CLR6-D4 — Ô chọn góc nhìn có trần: `title` thành mô tả truy cập, trình đọc màn hình đọc lựa chọn hai lần

```
ID: CLR6-D4
Mức: Nit
Trục: A
Vị trí: packages/ui/src/components/SelectField.tsx:70 (`title={capped ? options.find(…)?.label : undefined}`); apps/desktop/src/shell/ScopePicker.tsx:44, :55 (`capped`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-170 (6), T-367 (PR #1070), T-376 · mới do đợt sửa sau lượt 5 (PR #1070)
```

- **Mô tả:** T-367 cho ô chọn có trần thuộc tính `title` = nhãn của lựa chọn, để đọc được tên bị cắt. Với `<select>` đã có `<label>`, Chromium / WebView2 lấy `title` làm **mô tả** truy cập; mô tả trùng giá trị, nên trình đọc màn hình đọc tên lựa chọn hai lần ("RE của góc nhìn, hộp tổ hợp, Bùi Kim Hùng · Bình Minh … Bùi Kim Hùng · Bình Minh"), cả khi tên ngắn không bị cắt. Danh sách mở ra đã hiện đủ nhãn (`<option>` giữ nhãn đủ), nên `title` chỉ có ích khi rê chuột.
- **Tái hiện / bằng chứng:** `node D\p32-scope-a11y.mjs 4811` (`logs-p32-scope-a11y.log`; CDP `Accessibility.getFullAXTree` trên bản web ghim): "Team của góc nhìn" `value "Bình Minh"`, `description "Bình Minh"`; "RE của góc nhìn" `value "Bùi Kim Hùng · Bình Minh"`, `description "Bùi Kim Hùng · Bình Minh"`; đối chứng ô không trần "RE phụ trách" (5a): `description (none)`.
- **Cùng mẫu:** `rg -n " title=" apps/desktop/src packages/ui/src --glob "*.tsx"` (trừ test, trừ prop `title` của `Dialog`): chỉ `SelectField.tsx:70` gắn `title` trùng giá trị; `KycExtraction.tsx:116` (lý do nút tắt), `YearGrid.tsx:121` (chú thích ô) không trùng tên truy cập.
- **Ảnh hưởng:** người dùng trình đọc màn hình ở thanh trên của Tổng quan, Báo cáo, Lịch hẹn, Khách hàng (góc nhìn Team / RE): nghe thừa một lần tên; không mất thông tin.
- **Chặn phát hành:** không — Nit trục A (K48).
- **Đề xuất:** chỉ gắn `title` khi nhãn dài hơn trần (vd. so độ dài với ngưỡng, hay đo `scrollWidth > clientWidth` lúc chọn), hoặc bỏ `title` vì danh sách mở ra đã đủ; giữ ca e2e "title là nhãn đủ" cho tên dài. ≈ 2–4 dòng SP + 1 ca.

### CLR6-D5 — Hồ sơ KH: nút mỗi dòng cùng tên truy cập — (a) mọi nút "AI trích xuất" (mỗi ghi chú KYC một nút), (b) "Hẹn tiếp sau lịch …" của hai lịch cùng ngày không giờ

```
ID: CLR6-D5
Mức: Nit
Trục: A
Vị trí: (a) apps/desktop/src/routes/customers/KycExtraction.tsx:111-120 (`<Button id={buttonId} …>{t('extraction.button')}</Button>`, không `aria-label` / `aria-describedby`), apps/desktop/src/i18n/vi.ts:575 (`'extraction.button': 'AI trích xuất'`); hiện trong dòng thời gian của gói D: apps/desktop/src/routes/customers/CustomerKyc.tsx:297-299, :337 (`<ol>` / `<li>`, `renderNote`), apps/desktop/src/routes/customers/CustomerProfile.tsx:205-206 (`NoteEvent`); (b) apps/desktop/src/routes/customers/CustomerAppointments.tsx:53 (`aria-label={t('customer.nextLabel', { date: withTime(dayText(a.date, today), a.time) })}`), apps/desktop/src/i18n/vi.ts:534 (`'Hẹn tiếp sau lịch {date}'`), cùng nút ở dòng thời gian CustomerKyc.tsx:323 (5b1328a)
Tình trạng: CONFIRMED
Liên quan: CLR6-C13 (cùng họ, lịch sử phân tích), DR6-119 / 151 / 160 (tên nút trùng cho trình đọc màn hình) · có từ trước (nút từ Phase 3 / 5), lượt 1–5 bỏ sót. (a) phiên chính tìm; (b) S1 tìm, phiên chính chạy lại probe
```

- **Mô tả:** (a) Mỗi ghi chú KYC trên dòng thời gian có một nút "AI trích xuất" chạy trích xuất trên **chính ghi chú đó**; các nút cùng tên, không gì phân biệt (không `aria-label`, `aria-describedby`). Danh sách nút của trình đọc màn hình có 2–5 dòng "AI trích xuất" như nhau trên một hồ sơ thường. (b) Nút "Hẹn tiếp" mang ngày giờ của lịch, nhưng lịch không giờ chỉ có ngày: hai lịch cùng ngày không giờ của một KH cho hai nút cùng tên "Hẹn tiếp sau lịch 15/09" làm việc khác nhau (ở cả thẻ Lịch hẹn lẫn dòng thời gian). Cùng màn đã có cách làm đúng: "Giải quyết · {field}" (`kycResolve.openLabel`).
- **Tái hiện / bằng chứng:**
  - (a) `node D\p33-dup-names.mjs 4811` (`logs-p33-dup-names.log`; CDP, mọi nút / link / ô trong `<main>`): hồ sơ "Hồ Văn Tâm" → `button "AI trích xuất" ×2`. `node D\p34-extraction-names.mjs 4811` (`logs-p34-extraction-names.log`): "Hồ Văn Tâm" 2 nút (ghi chú 14/09/2026, 17/04/2026), "Phan Gia Chi" 5 nút, "Hồ Quốc Long" 5 nút; mọi nút `aria-label` / `aria-describedby` / `aria-labelledby` = null.
  - (b) `node D\s1\p06-next-names.mjs 4811` (probe của S1, chạy lại trên bản ghim; `v-s1-p06.log`): ba lịch Dự kiến ngày 15/09 (một có giờ 10:00) → thẻ Lịch hẹn `["Hẹn tiếp sau lịch 15/09 10:00","Hẹn tiếp sau lịch 15/09","Hẹn tiếp sau lịch 15/09"]`, dòng thời gian như vậy.
- **Cùng mẫu:** cùng probe trên mọi màn chính (`p33`, `p35-dup-names-all.mjs`, `logs-p35-dup-names-all.log`): Khách hàng (Kanban, Bảng), Team & nhân sự (3 team), Tổng quan, Lịch hẹn (+ chi tiết), Báo cáo, Cài đặt (Dữ liệu, AI, Thùng rác): **không còn tên trùng nào khác** với dữ liệu seed. Trên hồ sơ còn `button "Hẹn tiếp sau lịch 14/09 15:00" ×2` — một ở thẻ Lịch hẹn, một ở dòng thời gian, cùng gọi `onNext(a)` cho **cùng** một lịch: cùng tên, cùng việc, không phải lỗi. `rg -n "nextLabel" apps/desktop/src` → chỉ `CustomerAppointments.tsx:53`. CLR6-C13 (gói C) nêu nút "Xem lần {when}" của lịch sử phân tích và nút Xác nhận / Bỏ của đề xuất trích xuất; hai nút ở đây chưa có ở đó.
- **Ảnh hưởng:** người dùng trình đọc màn hình duyệt danh sách nút của hồ sơ: không biết nút nào trích xuất ghi chú nào, hay hẹn tiếp sau lịch nào ((b) cần hai lịch cùng ngày không giờ: hiếm). Không sai dữ liệu.
- **Chặn phát hành:** không — Nit trục A (K48).
- **Đề xuất:** (a) `aria-label` theo ngày ghi chú (vd. khóa mới "AI trích xuất ghi chú {date}"), hoặc `aria-describedby` trỏ dòng ngày của mục; (b) thêm trạng thái / trigger vào tên khi lịch không giờ; gộp với CLR6-C13 ở tổng hợp. ≈ 3–5 dòng SP + 1–2 khóa i18n + 1–2 ca test.

### CLR6-D6 — Team & nhân sự và góc nhìn Team / RE tự đổi sang team / RE khác sau khi đổi tên hay tạo mới (khi chưa bấm chọn), bỏ luôn RE đã chọn ở dải RE

```
ID: CLR6-D6
Mức: Low
Trục: E, C
Vị trí: apps/desktop/src/routes/team/TeamScreen.tsx:124-126 (`selectedId` null → `?? view.teams[0]`), :211 (`TeamNameDialog … onSaved={close}`: không ghim `selectedId`); apps/desktop/src/shell/scope.ts:12-15 (doc: chỉ lùi về đầu khi team / RE "no longer exists"), :22 (`?? teams[0]`), :27 (`?? reps[0]`), :37-39 (`chooseKind` → `{ kind }`, không id); apps/desktop/src/shell/AppShell.tsx:57-62 (`choice` giữ "chưa chọn") (5b1328a)
Tình trạng: CONFIRMED
Liên quan: có từ trước, lượt 1–5 bỏ sót (`scope.test.ts:38-49` ghim "falls back to the first … when none is chosen"). S2 tìm; phiên chính đọc lại code và chạy lại probe
```

- **Mô tả:** Màn Team và góc nhìn giữ trạng thái "chưa chọn" (`selectedId` null, `choice` không `id`); mỗi lần vẽ chúng lấy phần tử **đầu tiên theo tên**. Vì vậy đổi tên team đang hiện mặc định, hay tạo team / RE có tên xếp trước, làm màn tự chuyển sang team / RE khác mà người dùng không chọn; RE đã chọn ở dải chọn RE (B2) mất theo vì không thuộc team mới. Doc của `resolveScope` chỉ hứa lùi về đầu khi team / RE không còn.
- **Tái hiện / bằng chứng:** `node D\v-s2-p01.mjs` (= `s2\p01-rename-jump.mjs` của S2, chỉ đổi cổng sang bản ghim 4811; `v-s2-p01.log`):
  - Team & nhân sự, chưa bấm team nào: `A0 … heading "Team Bình Minh"`; đổi tên thành "Xuân Thu" → `A1 … heading "Team Hừng Đông" | focus H2 "Team Hừng Đông"`. Đối chứng: bấm Bình Minh trước rồi đổi tên → `B … "Team Xuân Thu"`.
  - Khách hàng, góc nhìn Team (chưa đổi ô team) `"Bình Minh"`, chọn RE "Bùi Kim Hùng" ở dải → đổi tên team → `C2 … "Hừng Đông" | strip "Team Hừng Đông · 10 RE" | pressed RE ["Cả team\n274"]`; tạo team "An Phú" → `C3 … "An Phú" | strip "Team An Phú · 0 RE"`, dòng xem "Cả team An Phú · 0 KH đang mở · 0 đã đóng".
  - Góc nhìn RE (chưa đổi ô) `"Bùi Kim Hùng · Bình Minh"` → thêm RE "An Văn A" → `D1 "An Văn A · Bình Minh"`.
- **Cùng mẫu:** `rg -n "\?\?\s*[\w.]+\[0\]|\[0\]\s*\?\?" apps/desktop/src` → `shell/scope.ts:22`, `:27` (sai), `routes/team/TeamScreen.tsx:126` (sai), `routes/reports/ReportsScreen.tsx:45` (danh sách bảng theo cấu hình, không đổi theo tên: đúng), `routes/customers/ai-panel-view.ts:209` (không liên quan).
- **Ảnh hưởng:** thao tác thường (9c đổi tên team, thêm team / nhân sự) làm màn đang xem đổi team / RE; sau đó "+ Nhân sự" / "+ Thêm TL" mặc định team vừa nhảy tới; Khách hàng / Lịch hẹn mất RE đã chọn. Không sai dữ liệu: tiêu đề và ô chọn ghi đúng team đang xem.
- **Chặn phát hành:** không — Low trục E / C (K48).
- **Đề xuất:** ghim id đã giải: `chooseKind` / `AppShell` ghi id của team / RE đang hiện vào `choice` lúc chọn kind (hay lúc giải lần đầu); `TeamScreen` khởi tạo `selectedId` bằng id đầu và giữ nó qua đổi tên; chỉ lùi về đầu khi id không còn (như doc). Sửa ca `scope.test.ts:38-49`, thêm e2e "đổi tên team đang hiện thì màn giữ team đó". ≈ 10 dòng SP + ≈ 30 dòng test.

### CLR6-D7 — Câu từ chối đổi vai trò sang RE bảo một việc không làm được (cùng họ DR6-80, chưa quét)

```
ID: CLR6-D7
Mức: Low
Trục: C
Vị trí: apps/desktop/src/i18n/vi.ts:868-869 (`error.COORDINATOR_IN_USE`), :871-872 (`error.REVIEWER_IN_USE`); hiện ở apps/desktop/src/routes/team/PersonDialogs.tsx:80 (`setErrors({ form: message })`); lệnh packages/db/src/team.ts:230-236 (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-80 (câu 9b, Q5 (a): người phối hợp của lịch Dời lịch / Dự kiến không đổi được; đã sửa ở `vi.ts:1278-1282` nhưng không quét câu từ chối của 9a), DR6-115 (câu Thùng rác) · có từ trước, lượt 1–5 bỏ sót. S2 tìm; phiên chính đọc lại code và chạy lại probe
```

- **Mô tả:** Đổi một TL / IS / BD / BDM đang phối hợp lịch sang RE thì 9a báo "… Bỏ nhân sự này khỏi người phối hợp của các lịch đó trước khi đổi sang RE." Người phối hợp chỉ đổi được ở Sửa kết quả (6f), mà lịch Dự kiến / Dời lịch không có (DR6-80 Q5 (a)); hộp 9b của cùng người ghi đúng "Người phối hợp của lịch Dời lịch / Dự kiến không đổi được — giữ lại thay vì xóa." `REVIEWER_IN_USE` bảo "Bỏ người đánh giá ở các lịch đó (Sửa kết quả)" cả khi lịch thuộc KH đã xóa (không mở được), không nhắc Thùng rác như `error.PERSON_IN_USE` (`:1294-1295`) và 9b (`person.inUseSupportTrash`).
- **Tái hiện / bằng chứng:** `node D\v-s2-p02.mjs` (= `s2\p02-person-dialog.mjs`, cổng 4811; `v-s2-p02.log`): IS Bùi Văn Nga, BDM Hoàng Minh Quang, BD Phan Minh Hà, TL Lý Gia Trang, vai trò → RE → Lưu: cả bốn ra câu trên; 9b của họ ghi "222 / 235 / 220 / 82 lịch hẹn là người phối hợp" kèm "không đổi được — giữ lại thay vì xóa." `s2\p03-coordinators.log` (S2, qua `openAppData` / `run`): mọi TL / IS / BD / BDM của seed phối hợp cả lịch `RESCHEDULED` và `SCHEDULED` (vd. Bùi Văn Nga `{"MET":173,"CANCELLED":14,"NO_SHOW":10,"RESCHEDULED":14,"SCHEDULED":11}`); IS mới chỉ đánh giá một cuộc gặp của KH đã xóa (Trần Ngọc Giang) → `REVIEWER_IN_USE: … (Sửa kết quả) trước khi đổi sang RE.`, `inTrash: [{"name":"Trần Ngọc Giang",…}]`.
- **Cùng mẫu:** `rg -n "khỏi người phối hợp|Bỏ người đánh giá|khỏi người đánh giá|không đổi được" apps/desktop/src/i18n/vi.ts` → `:869` (sai), `:872` (sai ở ca Thùng rác), `:1278`, `:1280`, `:1282` (9b, đúng sau DR6-80), `:694`, `:948` (không liên quan).
- **Ảnh hưởng:** người dùng hạ TL hay đổi người hỗ trợ sang RE (với seed: mọi người như vậy) nhận chỉ dẫn không có đường làm. Không sai dữ liệu (lệnh từ chối đúng).
- **Chặn phát hành:** không — Low trục C (K48).
- **Đề xuất:** viết lại hai câu theo khuôn 9b sau DR6-80 / DR6-115 (lịch Dời lịch / Dự kiến: không đổi được, giữ vai trò; lịch của KH đã xóa: Dọn sạch Thùng rác hay khôi phục KH), có thể dùng chung khóa với 9b. ≈ 4 dòng `vi.ts` + 1–2 ca test.

### CLR6-D8 — Test hở ở gói D: đổi riêng team ở 9a rồi "Xóa nhân sự", và phím ↓ của `Segmented`

```
ID: CLR6-D8
Mức: Low
Trục: T
Vị trí: (a) apps/desktop/src/routes/team/PersonDialogs.tsx:59-61 (vế `teamId !== (person.teamId ?? '')` của `changed`); (b) packages/ui/src/components/Segmented.tsx:26 (`ArrowDown: 1`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: có từ trước. S2 tìm (đột biến); phiên chính đọc lại code và tìm ca giữ
```

- **Mô tả:** (a) Đổi riêng team trong 9a rồi bấm "Xóa nhân sự": code hỏi trước vì có thay đổi chưa lưu, nhưng không ca nào giữ — bỏ vế team thì 9a sang 9b không hỏi, mất thay đổi. (b) `Segmented` (role `radiogroup`) nhận ↓ như →, không ca nào bấm ↓.
- **Tái hiện / bằng chứng:** S2: `s2\mut-list.mjs` (đột biến `S2MA` bỏ vế team, `S2MB` bỏ `ArrowDown`, gộp `S2MAB`), bản dựng ngoài repo `s2\dist-mab`: e2e `team.spec.ts` + `dialog-keyboard.spec.ts` → `35 passed` (`s2\e2e-mab.log`); vitest `apps/desktop/src` + `packages/ui/src` → `56 passed (56) · 939 passed (939)` (`s2\vitest-mab.log`). Phiên chính: `rg -n "ArrowDown" e2e apps/desktop/src packages/ui/src` → chỉ `Segmented.tsx:26` (không test nào bấm ↓); `rg -n "Xóa nhân sự" e2e/*.spec.ts` → chỉ `team.spec.ts` (ca "Xóa nhân sự asks first…" `:246` chỉ đổi tên và đổi vai trò rồi đổi lại).
- **Cùng mẫu:** ca phím mũi tên của `Segmented` (`e2e/dialog-keyboard.spec.ts:114`) chỉ bấm → / ← / ↑; các vế khác của `changed` (tên, vai trò) có ca giữ.
- **Ảnh hưởng:** một lần sửa sau này bỏ vế team hay `ArrowDown` mà CI xanh: người dùng mất thay đổi team chưa lưu, hay mất phím ↓ ở mọi ô chọn kiểu `Segmented` (góc nhìn, Cách xem…).
- **Chặn phát hành:** không — Low trục T (K48).
- **Đề xuất:** thêm bước "chỉ đổi team → Xóa nhân sự hỏi trước" vào ca `team.spec.ts:246`, một lần ↓ vào ca `dialog-keyboard.spec.ts:114`. ≈ 8 dòng test.

### CLR6-D9 — Hash lạ gõ khi đang ở đúng màn đó: thanh địa chỉ không được sửa như comment hứa (bản web)

```
ID: CLR6-D9
Mức: Nit
Trục: C, E
Vị trí: apps/desktop/src/shell/useRoute.ts:30-33 (doc: "the address bar is then corrected to match"), :39-42 (effect chỉ chạy lại khi `canonical` đổi) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-77 (thiếu test `replaceState`), biến thể mới · có từ trước. S2 tìm; phiên chính đọc lại code
```

- **Mô tả:** Hash lạ được đọc thành màn đang mở (route lưu cuối), nên `canonical` không đổi và effect sửa thanh địa chỉ không chạy lại: hash lạ ở nguyên trên thanh địa chỉ.
- **Tái hiện / bằng chứng:** S2 `s2\p05-hash-routes.mjs` (`p05-hash-routes.log`): đang `#/team`, gõ `#/team//`, `#//team`, `#/TEAM`, `#/%74eam` → `"hash":"#/team//"` …, màn Team, không sửa; đang `#/settings/trash` gõ `#/customers/%` → giữ `#/customers/%`, màn Cài đặt. Mở trang mới với hash lạ thì được sửa (ca e2e có sẵn). Phiên chính đọc `useRoute.ts:34-42`: `useEffect(…, [canonical])`.
- **Cùng mẫu:** `rg -n "replaceState" apps/desktop/src` → chỉ `useRoute.ts:40`.
- **Ảnh hưởng:** chỉ bản web (exe không có thanh địa chỉ; link của app luôn chuẩn).
- **Chặn phát hành:** không — Nit.
- **Đề xuất:** effect phụ thuộc thêm `hash` (hay so `window.location.hash` mỗi lần render). ≈ 1 dòng + 1 ca e2e.

### CLR6-D10 — 9a coi dấu cách thêm ở cuối tên là "thay đổi chưa lưu"

```
ID: CLR6-D10
Mức: Nit
Trục: E
Vị trí: apps/desktop/src/routes/team/PersonDialogs.tsx:59-61 (`name !== person.name`, so chữ thô) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: có từ trước (issue 144, review PR #841). S2 tìm; phiên chính chạy lại probe
```

- **Mô tả:** Gõ thêm một dấu cách ở cuối tên rồi bấm "Xóa nhân sự": hộp hỏi "Có thay đổi chưa lưu", dù lưu thì `normalizeText` cho đúng tên cũ (ô chữ khác hỏi trống / so bằng `normalizeText`, K20 / K25).
- **Tái hiện / bằng chứng:** `v-s2-p02.log`: `trailing space then Xóa nhân sự → asks? ["Có thay đổi chưa lưu: Lưu để giữ, hoặc bỏ thay đổi để xóa nhân sự."] | 9b open? 0`.
- **Cùng mẫu:** `rg -n "const (changed|dirty|edited|unsaved)\b" apps/desktop/src/routes` → chỉ `PersonDialogs.tsx:59` so tên thô (`:62` là hàm, `Settings.tsx:162` khác nghĩa, còn lại ở test).
- **Chặn phát hành:** không — Nit.
- **Đề xuất:** so `normalizeText(name) !== person.name`. ≈ 1 dòng.

### CLR6-D11 — 7a / 3f: phiên bản KYC đầu tiên ghi lý do "tự động vì đổi trường cốt lõi" dù chỉ có trường phụ

```
ID: CLR6-D11
Mức: Low
Trục: C
Vị trí: apps/desktop/src/routes/customers/KycDialogs.tsx:69 (`t(auto ? 'kycNote.autoMaterial' : 'kycNote.manualMaterial')`), :90 (`<Material auto={preview.auto} …>` trong `NextVersion`, dùng ở 7a và 3f); apps/desktop/src/routes/customers/kyc-view.ts:354-362 (`auto: version.material`); packages/domain/src/kyc.ts:142-144 (`isMaterialChange`: `before === null` → luôn material, ADR-0008 7); apps/desktop/src/i18n/vi.ts:565 (5b1328a)
Tình trạng: CONFIRMED
Liên quan: có từ trước, lượt 1–5 bỏ sót. S1 tìm; phiên chính đọc lại code và chạy lại probe
```

- **Mô tả:** KH chưa có phiên bản KYC (tạo không ngày sinh, không giới tính: ca N4 chưa rõ danh tính mà spec Phase 3 §3.3 và mockup 5b cho phép). Ghi chú 7a đầu tiên chỉ có trường phụ: hộp ghi "Sau khi lưu: KYC v1 · thay đổi quan trọng", ô material tích sẵn, tắt, kèm chữ "thay đổi quan trọng — tự động vì đổi trường cốt lõi, không bỏ được". Không trường cốt lõi nào đổi: v1 material vì là phiên bản đầu (ADR-0008 7). Lý do in ra trái nghĩa. Mockup 7e (`kyc-forms.html:305-316`) chỉ vẽ ba ca (cốt lõi, trường phụ, không phiên bản), không vẽ ca v1.
- **Tái hiện / bằng chứng:** `node D\s1\p01-kyc-v1.mjs 4811` (probe của S1, chạy lại trên bản ghim; `v-s1-p01.log`): `A0 KYC meta: 0/8 hạng mục · chưa có phiên bản`; trường Nơi sinh sống "Huế" → `A2 "Sau khi lưu: KYC v1 · thay đổi quan trọng\nthay đổi quan trọng — tự động vì đổi trường cốt lõi, không bỏ được"`, `A3 checkbox: {"checked":true,"disabled":true}`. Đối chứng v2, trường phụ: `A5 "Sau khi lưu: KYC v2\nĐánh dấu là thay đổi quan trọng — nên phân tích AI lại"`, `A6 {"checked":false,"disabled":false}`. Unit `previewKycNote` (`kyc-view.test.ts:479-552`) chỉ thử khi đã có v1.
- **Cùng mẫu:** `rg -n "autoMaterial|<Material auto" apps/desktop/src` → `KycDialogs.tsx:69` (đường duy nhất), qua `NextVersion :90` ở 7a và 3f (`ConfirmFactDialog`): sai như nhau; 7d truyền `auto={core}` (`:457`): đúng, và ở 7d không thể là v1 (đã có mâu thuẫn thì đã có phiên bản).
- **Ảnh hưởng:** RE ghi KYC đầu tiên cho KH N4 chưa rõ danh tính, hay xác nhận đề xuất AI đầu tiên, đọc lý do sai. Dữ liệu đúng.
- **Chặn phát hành:** không — Low trục C, chỉ sai chữ hiển thị (K48).
- **Đề xuất:** `previewKycNote` trả thêm lý do (`first` / `core`), thêm một câu i18n (vd. "— tự động vì là phiên bản KYC đầu tiên, không bỏ được"); chữ mới cần G3 nhẹ hay một dòng "Lệch mockup". ≈ 6 dòng SP + 1–2 ca unit.

### CLR6-D12 — 5d: câu từ chối gọi việc tạo KH là "lần đổi nhóm gần nhất"

```
ID: CLR6-D12
Mức: Low
Trục: C
Vị trí: apps/desktop/src/i18n/vi.ts:690 (`error.TRANSITION_BEFORE_LATEST`: "Ngày chuyển trước lần đổi nhóm gần nhất ({date})."); packages/db/src/customers.ts:299-309 (`latestTransition` gồm cả transition tạo KH, `fromStage` null); apps/desktop/src/routes/customers/CustomerDialogs.tsx:452 (5d hiện `errorMessage`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-68 (tổng hợp lượt 2 nêu đúng câu này ở 6c: "10/10 là ngày tạo KH, không phải một lần đổi nhóm"; T-248 bỏ đường 6c, spec Phase 3 §4 dòng `recordMeetingOutcome` `phase-3-du-lieu.md:183`: "dòng giải thích không gọi việc tạo KH là một lần đổi nhóm") · có từ trước, đường 5d lượt 1–5 bỏ sót. S1 tìm; phiên chính đọc lại code và chạy lại probe
```

- **Mô tả:** KH chưa từng đổi nhóm, Chuyển nhóm tay (5d) với ngày trước ngày tạo KH → "Ngày chuyển trước lần đổi nhóm gần nhất (15/09/2026)." Ngày 15/09 là ngày tạo KH, không phải một lần đổi nhóm.
- **Tái hiện / bằng chứng:** `v-s1-p01.log`: `B0 5d subtitle: K-03Z9 · hiện tại N4 từ 15/09/2026`, `B1 5d error before creation: ["Ngày chuyển trước lần đổi nhóm gần nhất (15/09/2026)."]`.
- **Cùng mẫu:** `rg -n "TRANSITION_BEFORE_LATEST" apps/desktop/src packages/db/src` (S1): lệnh ném lỗi này là `changeStageManually` (5d, gặp được), `recordMeetingOutcome` / `editMeetingOutcome` (6c / 6f khóa nhóm trước ngày tạo, không gặp), khôi phục lịch (`trash.blocked.TRANSITION_BEFORE_LATEST` `vi.ts:336`: lịch trước ngày tạo không mang transition, không gặp). Chỉ 5d sai.
- **Ảnh hưởng:** RE ghi bù lần chuyển nhóm sớm hơn ngày nhập KH nhận câu nói sai về lịch sử KH. Lệnh từ chối đúng.
- **Chặn phát hành:** không — Low trục C (K48).
- **Đề xuất:** lệnh thêm param (vd. `created: 1`) khi `latest.fromStage === null`, câu riêng "Ngày chuyển trước ngày tạo KH ({date})." ≈ 4 dòng SP + 1 ca.

### CLR6-D13 — Hai RE trùng họ tên cùng team: mọi ô chọn người hiện hai lựa chọn giống hệt nhau

```
ID: CLR6-D13
Mức: Low
Trục: E (A)
Vị trí: apps/desktop/src/shell/scope.ts:63-75 (`reOptions`: nhãn `joinParts([re.name, team])`); apps/desktop/src/routes/customers/CustomerDialogs.tsx:49, :297-306 (ô "RE phụ trách" của 5a / 5c); packages/db/src/team.ts:205-219 (`createPerson` không kiểm tên trùng; chỉ tên team là duy nhất) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: K50 Q1 (a) (Owner đã tách hai nhân sự trùng tên, vai trò, team ở nút khôi phục Thùng rác bằng giờ xóa: coi ca này có thật), K41 Q3 · có từ trước, lượt 1–5 bỏ sót. S1 tìm; phiên chính chạy lại probe
```

- **Mô tả:** Thêm hai RE "Trần Hải Yến" vào cùng team Hừng Đông: app nhận cả hai, không báo gì. Ô RE của 5a / 5c có hai lựa chọn giống hệt nhau; chọn xong, hồ sơ chỉ ghi "RE Trần Hải Yến · Team Hừng Đông"; màn Team có 2 nút "Sửa Trần Hải Yến". Không chỗ nào trong app phân biệt hai người.
- **Tái hiện / bằng chứng:** `node D\s1\p02-same-name-re.mjs 4811` (`v-s1-p02.log`): `A1`, `A2` không cảnh báo (`[]`); `A3 … "Sửa <name>": 2`; `B1 5a options for the name: [{"v":"01M2HECPPBG5…","t":"Trần Hải Yến · Hừng Đông"},{"v":"01M2HECPTBRD…","t":"Trần Hải Yến · Hừng Đông"}]`; `B3 profile line: K-QW6X · RE Trần Hải Yến · Team Hừng Đông · Chưa có HĐ`; `B4` 5c chọn đúng id thứ hai nhưng chữ hiện giống hệt lựa chọn thứ nhất.
- **Cùng mẫu:** `rg -n "reOptions\(|teamRes\(|personLabel" apps/desktop/src` (S1, đọc code): cùng nguyên nhân (nhãn chỉ có tên + team, hay vai trò + tên) ở 5a / 5c (`CustomerDialogs.tsx:49`), 6a / 6h (`AppointmentDialog.tsx:94`, `:164`), 8a (`PolicyDialogs.tsx:188`), ô góc nhìn (`ScopePicker.tsx:58`), Báo cáo Theo RE (`reports-view.ts:283`), dải chọn RE (`RePicker.tsx:54`), người phối hợp / đánh giá (`appointments-view.ts:131` `personLabel`, dùng ở `MetFields.tsx:106-108`, `AppointmentDialog.tsx`, `AppointmentsScreen.tsx:147-153`), màn Team (nút "Sửa <tên>"). Chỉ 5a / 5c đã chạy thật.
- **Ảnh hưởng:** team có hai RE trùng họ tên (tên Việt hay trùng): tạo KH, bàn giao, đặt lịch, nộp HĐ là chọn mù; bản ghi và chỉ số theo RE có thể gắn người kia mà không ai nhận ra. Điều kiện hiếm.
- **Chặn phát hành:** không — Low trục E: lệnh lưu đúng người được chọn, chỗ hỏng là hai lựa chọn không phân biệt được. Nếu tổng hợp coi việc gắn nhầm người trùng tên là hậu quả lên dữ liệu đã lưu (K48: xếp D) thì thành chặn.
- **Đề xuất:** một hàm nhãn người chung cho mọi ô chọn, thêm phần phân biệt khi trùng tên + team (như K50 ở Thùng rác); hoặc chặn tên trùng trong một team ở `createPerson` / `updatePerson` (luật mới, G2). ≈ 10–20 dòng SP + 2 ca unit.

### CLR6-D14 — Test hở ở hồ sơ KH: công tắc "thay đổi quan trọng" của 7a / 7d / 3f và vai trò người phối hợp ở dòng thời gian

```
ID: CLR6-D14
Mức: Low
Trục: T
Vị trí: apps/desktop/src/routes/customers/KycDialogs.tsx:267 (7a), :412 (7d), :513 (3f) (lệnh gửi `material`); apps/desktop/src/routes/customers/CustomerKyc.tsx:315-317 (vai trò người phối hợp "+ TL, IS", NT-HS-11); phụ: apps/desktop/src/routes/customers/CustomersScreen.tsx:38 (`CLOSED_LIMIT = 5` của khung đóng) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: có từ trước, lượt 1–5 bỏ sót. S1 tìm (đột biến); phiên chính đọc lại code và tìm ca giữ
```

- **Mô tả:** Bỏ `material` khỏi lệnh ở 7a / 7d / 3f (công tắc "Đánh dấu là thay đổi quan trọng" mất lặng lẽ), hay bỏ vai trò người phối hợp ở dòng thời gian: không test nào đỏ. Lệnh `db` có test cho `material`; đường từ UI xuống lệnh thì không.
- **Tái hiện / bằng chứng:** S1: `s1\mut-defs.mjs` + `s1\mut-run.mjs` (bản dựng đột biến ngoài repo, `s1\mut-run.log`; đối chứng 5 spec 40 / 40 xanh): `S1-M12` (7a gửi `material: false`), `S1-M17` (7d), `S1-M18` (3f), `S1-M10` (bỏ `roles(event.appointment)`) **sống** qua `customer-kyc` 13 / 13, `customer-ai` 18 / 18, `customer-ai-web` 10 / 10, `full-cycle` 1 / 1, `appointments` 43 / 43, `appointment-outcome` 22 / 22 (và `customer-appointments` 6 / 6 cho M10); `S1-M05` (`CLOSED_LIMIT` 50) sống qua `customers` 7 / 7 và các spec trên (một ca `appointment-outcome.spec.ts:351` đỏ do chập chờn, đỏ cả ở đối chứng, không tính). Phiên chính: `rg -n "Đánh dấu là thay đổi quan trọng|thay đổi quan trọng" e2e/*.spec.ts` → chỉ các dòng của phiên bản tự động (`customer-kyc.spec.ts:244`, `:259`, `:500`, `:508`), không ca nào tích công tắc; không ca nào đọc "+ TL / IS" ở dòng thời gian.
- **Cùng mẫu:** ba hộp dùng chung `Material` (`KycDialogs.tsx:51-71`); không còn chỗ khác gửi `material`.
- **Ảnh hưởng:** một lần sửa sau này làm hỏng đường gửi `material` (mà lời nhắc "nên phân tích AI lại" dựa vào) hay mất vai trò người phối hợp mà CI xanh.
- **Chặn phát hành:** không — Low trục T (K48).
- **Đề xuất:** một ca e2e 7a / 7d tích công tắc rồi đọc nhãn "thay đổi quan trọng" của phiên bản ở dòng thời gian; một ca đọc "+ IS" của lịch có người phối hợp. ≈ 40 dòng test.

### CLR6-D15 — 5c: các chip dữ kiện của khung "Khi lưu" dính liền trong chữ của trình đọc màn hình

```
ID: CLR6-D15
Mức: Nit
Trục: A
Vị trí: apps/desktop/src/routes/customers/CustomerDialogs.tsx:157-162 (chip `mr-1`, không có dấu cách chữ giữa các chip và trước câu sau) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: có từ trước. S1 tìm; phiên chính chạy lại probe
```

- **Mô tả:** Khung `role="status"` của 5c ghi các chip dữ kiện chỉ cách nhau bằng lề, nên chữ trình đọc màn hình nhận là "birthYear = 1990gender = Nam(dữ kiện đổi → …)". Mockup (`customer-forms.html:163`) có dấu cách sau chip. (Chữ `birthYear = 1984` dạng mã là đúng mockup.)
- **Tái hiện / bằng chứng:** `node D\s1\p04-aria.mjs 4811` (`v-s1-p04.log`): `A3 5c status aria snapshot: … "xác nhận dữ kiện birthYear = 1990gender = Nam(dữ kiện đổi → tạo phiên bản KYC mới)."`.
- **Cùng mẫu:** `rg -n "className=\{\`\$\{chip\}"` (S1) → chỉ `CustomerDialogs.tsx:158`.
- **Ảnh hưởng:** người dùng trình đọc màn hình nghe "1990gender".
- **Chặn phát hành:** không — Nit.
- **Đề xuất:** thêm `{' '}` sau mỗi chip. ≈ 1 dòng.

### CLR6-D16 — 7c / 3f: dòng "Đang có: …" không nối vào mô tả của ô Giá trị

```
ID: CLR6-D16
Mức: Nit
Trục: A
Vị trí: apps/desktop/src/routes/customers/KycDialogs.tsx:120-134 (đoạn "Đang có…" không `id`), :147-152 (`TextField` Giá trị: `hint` không gồm đoạn đó) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: có từ trước. S1 tìm; phiên chính chạy lại probe
```

- **Mô tả:** Chọn một trường đã có giá trị ở 7c thì hiện "Đang có: Kỹ sư · F1 (15/09/2026)"; dòng này không thuộc mô tả (`aria-describedby`) của ô Giá trị hay ô Trường, cũng không là vùng thông báo. Người dùng trình đọc màn hình chỉ biết trường đã có giá trị khi gặp nhóm "Trường đã có giá trị".
- **Tái hiện / bằng chứng:** `v-s1-p04.log`: `B1 7c value aria-describedby texts: []`, `B2 7c "Đang có" line: "Đang có: Kỹ sư · F1 (15/09/2026)"`, `B3 Trường select aria-describedby texts: []`.
- **Cùng mẫu:** 3f dùng chung `FactValue`: như nhau. Không có chỗ khác.
- **Chặn phát hành:** không — Nit.
- **Đề xuất:** đưa dòng "Đang có" vào `hint` / `help` của `TextField` / `Choices`. ≈ 3 dòng.

### CLR6-D17 — Dòng thời gian: trong một ngày, chuyển nhóm luôn xếp dưới KYC, kể cả khi lưu sau

```
ID: CLR6-D17
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/routes/customers/kyc-view.ts:197-202 (`RANK`; comment "Records carry a day, not a time"), :286-293 (sắp xếp); ca ghim apps/desktop/src/routes/customers/kyc-view.test.ts:301; schema packages/db/src/schema.ts:202, :267, :316 (`stage_transitions`, `kyc_notes`, `kyc_versions` đều có `created_at`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: cách xếp có chủ ý, ghi ở comment · có từ trước. S1 tìm; phiên chính đọc lại code và schema
```

- **Mô tả:** Dòng thời gian xếp mới nhất lên trên; trong một ngày, chuyển nhóm luôn nằm dưới KYC, kể cả khi chuyển nhóm lưu sau (vd. RE ghi 7a rồi chuyển nhóm 5d cùng ngày): đọc như chuyển nhóm xảy ra trước các lần cập nhật KYC, trái nghĩa thường của "dòng thời gian". Comment lấy lý do "bản ghi chỉ có ngày", nhưng cả ba bảng đều có `created_at` (lúc lưu).
- **Tái hiện / bằng chứng:** S1 `s1\p07-chain.mjs` (`s1\p07-chain.log`): lưu 7a (S2, S3), 7d (S5), rồi 5d N3 → N2 (S7) → S19 `["…","15/09/2026 Cập nhật KYC … kyc v4","… kyc v3","… kyc v2","15/09/2026 N3 → N2 chuyển tay · không tính RF",…]`. Phiên chính đọc `kyc-view.ts:197-202`, `:286-293` và `schema.ts`.
- **Cùng mẫu:** chỉ `kycTimeline`.
- **Chặn phát hành:** không — Nit trục C; ứng viên sổ [sau v1.0].
- **Đề xuất:** đọc `created_at` của chuyển nhóm và xếp chung theo lúc lưu trong một ngày (giữ cuộc gặp trước chuyển nhóm nó dẫn tới). ≈ 10 dòng SP + sửa ca `:301`.

## 6. Bloat và Hiệu năng (không bắt buộc ở gói D; ghi số đã có)

| Đã chạy / đọc | Trên | Kết quả (số) | ID |
|---|---|---|---|
| Bộ chặn ký hiệu có vào bundle không | `D\dist-base\assets\*.js` (bản build ngoài repo, cùng cách `baseline.md`, neo 15/09/2026) | 0 / 4 file JS có `hardcoded-separator` / `findHardcodedSeparators`; `index.js` 894 875 B (= `baseline.md` 894 865 + 10 B chuỗi neo) | — |
| Khóa / slot i18n, export của gói D (`r1-keys`, `r1-slots`, `r1-exports`, probe lượt 4–5) | `vi.ts` ↔ `apps/desktop/src`; 58 file SP `.ts/.tsx` của gói D | 1 197 khóa, 0 không dùng, 0 chỉ test dùng; export chỉ test đọc: 7 như lượt 5 | — |
| Diff của gói D | `37a80b6..5b1328a` | SP +124 / −28 (trong đó công cụ `token-guard.ts` +82 / −19, không vào exe); T-376 gom ba chỗ viết trần tên thành `CELL_NAME` (bớt lặp) | — |
| Hiệu năng | — | Không đo lại: đường của các màn gói D không đổi ngoài class và chữ; số exe ở `baseline.md` (không dòng ⚠️). Không phát hiện P | — |


## 7. Bảng đếm mức × trục

Mỗi phát hiện đếm một lần ở trục đầu.

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | 0 |
| Low | 2 (D6, D13) | 3 (D7, D11, D12) | | | | | | 3 (D3, D8, D14) | | 8 |
| Nit | 1 (D10) | 2 (D9, D17) | | | | | | 1 (D2) | 5 (D1, D4, D5, D15, D16) | 9 |
| **Tổng** | 3 | 5 | 0 | 0 | 0 | 0 | 0 | 4 | 5 | **17** |

- **Chặn phát hành (đề xuất, K48): 0 / 17.** Không phát hiện nào ở mức Medium trở lên hay Low ở trục D, S, G. Riêng CLR6-D13 (hai RE trùng họ tên không phân biệt được trong ô chọn): tôi xếp Low trục E; nếu tổng hợp coi việc gắn nhầm người trùng tên là hậu quả lên dữ liệu đã lưu (K48: xếp D) thì thành chặn.
- **CONFIRMED 17 / 17**, PLAUSIBLE 0, KNOWN 0.
- **Mới do đợt sửa sau lượt 5: 2** (CLR6-D3: PR #1070 thêm trần không ca giữ, PR #1092 gom; CLR6-D4: PR #1070); **Có từ trước, lượt 1–5 bỏ sót: 15** (gồm CLR6-D2: máy trạng thái từ PR #920, chỗ gặp trong repo mới do T-381 / T-382 / T-384).
- **Bảng R:** R1 2 / 2 **ĐÃ SỬA** (DR6-169, DR6-170 phần gói D); R2 1 / 1 **ĐÃ SỬA** (T-376). Biến thể còn hở ghi riêng: CLR6-D1, D2 (DR6-169), D3 (DR6-170, T-376).
- **Đột biến của phiên chính: 36** (23 vitest, 13 e2e): 32 bị giết; 4 sống — `T376-joiner-first`, `T376-select-space` (tương đương), `T376-cell-nocap`, `X-appt-btn-nocap` (→ CLR6-D3). Subagent: S1 18 (12 bị giết, 6 sống → CLR6-D14, `M07` không ghi), S2 2 (cả 2 sống → CLR6-D8).

## 8. Đã xét, không thấy (theo trục)

- **R:** 2 dòng R1, 1 dòng R2 (mục 2): tái hiện lượt 5 chạy lại (`remainder`, `plant-forms`, `t333-variants`, `jsx-near`, `r1-37-guard`, `p21`), đối chiếu thêm mô tả CXR5-D1…D5, DSR5-D1, D2; 32 / 36 đột biến bị giết, 4 sống đã giải thích. Không HỒI QUY: vitest `token-guard.test.ts` 37 / 37, cả bộ 4 493 test xanh (lần chạy cả bộ của `T376-joiner-first`), ca quét e2e xanh trên bản ghim.
- **E:** tên liền dài ở mọi màn gói D, mọi góc nhìn, 1 100 / 1 440, cả chữ rộng `W` 160 (K10, K11, K11b: 0 chỗ tràn, 0 chữ đè); S2: giao thừa ở màn Team, 21 hash lạ + 4 route lưu lạ, biên `PeriodPicker` (29/02, cuối tháng, 1900 / 2100, chữ số toàn hình, đảo ngày), `DataTable` (`resetKey`, "Hiện thêm" khi số dòng giảm), `Dialog` (`onCancel`, `focusBack`, hộp thay hộp); S1: ngày tương lai / trước ngày tạo / đầu năm ở 5a / 5d / 7a, năm sinh 1899 / 2101, 29/02, 50 đầu vào số tiền (S1-K13), Enter trong ô một dòng, xóa ngày sinh / giới tính. Ngoài CLR6-D6, D10, D13 không thấy.
- **C:** test chấp nhận của T-376 trên code (mục 2.2); doc của bộ chặn so hành vi (ngoài CLR6-D1, D2); S2: nhãn 9a / 9b / B1 so `team.html`, `phase-3-feedback.html` B1 / B2, "Xóa team" không kiểm trước (NT-TM-12), chữ "Project-2C" của câu lỗi khởi động (K39); S1: 5a–5f và 7a–7d so mockup từng dòng, 5f ↔ dòng Thùng rác ↔ hộp khôi phục khớp số, câu bàn giao, "mở lại", "Sau khi lưu" của 5d / 7a / 7d. Ngoài CLR6-D7, D9, D11, D12, D17 không thấy.
- **D:** gói D không có lệnh `db` riêng; S1 chuỗi `p07` (5a lùi ngày → 7a → 7d → lịch → 5d → 5c đổi RE → 5f → Thùng rác → khôi phục) giữ đủ dữ liệu, xem trước 5c / 7a khớp kết quả lưu, cờ material lưu đúng khi chạy tay; S2 đổi tên team / RE lan ra mọi màn đúng (`p06`), đọc hết `team.ts`. Không thấy.
- **G:** gói D không gọi AI; 3f chỉ ghi qua lệnh (S1). Không thấy.
- **S:** `rg "dangerouslySetInnerHTML|innerHTML|insertAdjacentHTML|eval\(|new Function"` trên `apps/desktop/src`, `packages/ui/src` → 0 (S1, S2, phiên chính); `encodeHtml` cho tooltip chart (`stage-chart.ts:57`, `:79`; nhãn trục vẽ SVG là chữ); chữ UI viết cứng 0 chỗ (K17); S2 đọc wry: cửa sổ mới / vuốt lùi bị chặn; mọi probe 0 request ra ngoài 127.0.0.1. Không thấy.
- **P:** không đo lại (mục 6); bộ chặn không vào bundle. Không phát hiện P.
- **B:** khóa i18n 0 không dùng, export như lượt 5, bộ chặn không vào bundle, T-376 bớt lặp (mục 6). Không phát hiện B (rà gọn diff là việc của chủ đề G).
- **T:** ngoài CLR6-D3, D8, D14: bộ chặn bị 22 / 23 đột biến giết; ca quét tên dài giết 10 / 13; S1 11 / 18 giết ngay; S2 đọc tên ca và `expect` của test shell / ui, phủ rộng.
- **A:** chữ UI viết cứng 0 (K17), tên truy cập trùng ở mọi màn chính (K20, K22: chỉ hồ sơ, CLR6-D5); S2: hộp chồng, focus, Escape (`p04`), `Segmented` / `Choices` theo role radio, tên vùng trùng tên bảng (dư, không sai), `main role="alert"` của màn lỗi khởi động bỏ landmark main (màn hiếm gặp, không ghi); S1: bàn phím 7d, focus sau 5d / 7d / 5f, tên radio. Ngoài CLR6-D1, D4, D5, D15, D16 không thấy.

## 9. Phụ lục

### 9.1 Probe, log của phiên chính (mọi file ở `C:\workspace\deep-review-1-6-r6\claude\D\`)

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `r5copy\*` | 42 probe / công cụ của Claude D lượt 5, chép theo tên đầy đủ từ `deep-review-1-6-r5\claude\D\` (đường dẫn ghi ở báo cáo gốc lượt 5 §9.1), `Test-Path` từng tên | — | gốc của các bản dưới; `r5copy\guard\*.mjs` chạy nguyên (import worktree ghim) |
| `build-dist.mjs`, `serve-dist.mjs`, `pw.config.mjs`, `browser.mjs`, `hooks.mjs` | bản web ngoài repo (Vite `build()` + hook `load`), `vite preview` 127.0.0.1, cấu hình Playwright (Edge, `vi-VN`, chặn mọi host ngoài 127.0.0.1 / localhost), bộ trình duyệt (chặn mạng, thay `window.open`); chỉ đổi `-r5` → `-r6`, cổng 4711 → 4811 | `build-dist-base.log`, `serve-4811.log` | mọi probe màn |
| `mut-defs.mjs`, `mut-list.mjs`, `check-muts.mjs`, `mutant-config.mjs`, `mutjs.mjs`, `e2e-mut.mjs` | 36 đột biến (vitest qua hook `load`; TSX qua bản dựng đột biến 4812–4819) | `vitest-control-tg.log`, `mutjs.log`, `e2e-mut.log`, `mut\<id>.out`, `mut\<id>-0.e2e.out` | mục 2, 9.2 |
| `guard\guard-gaps.mjs` | ký hiệu / dấu nối của `vi.ts` ngoài tập của bộ chặn | `guard\guard-gaps.log` | CLR6-D1 |
| `entity-decode.mjs` | thực thể HTML nào oxc (Vite 8) giải mã | `entity-decode.log` | DR6-169, CLR6-D1 |
| `marks-scan.mjs`, `vi-marks.mjs` | ký hiệu trong chuỗi / chữ JSX của code sản phẩm; ký hiệu và `sep.*` của `vi.ts` | `marks-scan.log`, `vi-marks.log` | CLR6-D1 |
| `guard\ast-compare6.mjs` | bộ chặn so cây cú pháp (phạm vi sau T-366), 356 file | `guard\ast-compare6.log` | DR6-169, CLR6-D2 |
| `guard\regex-quotes.mjs` | regex literal có `'` / `"` / `` ` ``; mẫu báo nhầm / bỏ sót | `guard\regex-quotes.log` | CLR6-D2 |
| `guard\t376-variants.mjs` | 21 biến thể của các ghi chú T-376 gom | `guard\t376-variants.log` | R2 T-376, CLR6-D1 |
| `r5copy\guard\{remainder,jsx-near,t333-variants,plant-forms}.mjs`, `r5copy\{r1-37-guard,sep-scan}.mjs` | tái hiện lượt 4–5 chạy lại | `guard\{remainder,jsx-near,t333-variants,plant-forms}-r6.log`, `r1-37-guard-r6.log`, `sep-scan-r6.log` | R1 DR6-169 |
| `p21-overflow-culprits.mjs` | tái hiện DR6-170 lượt 5 | `logs-p21-overflow-r6.log` | R1 DR6-170 |
| `p30-overflow-boxes.mjs`, `p30w-overflow-boxes.mjs` | chữ vượt mép hộp khối ở mọi màn gói D (chữ `x` / `W`); đối chứng dương trên `dist-R170-2-meta` | `logs-p30-overflow-boxes.log`, `logs-p30w-overflow-boxes.log`, `logs-p30-control-meta.log` | R1 DR6-170 |
| `p31-cell-cap.mjs` | bề rộng cột bảng KH có / không trần (`dist-T376-cell-nocap`) | `logs-p31-cell-cap.log` | CLR6-D3 |
| `selectfield-probe.mjs` | khung, `title` của `SelectField` (`react-dom/server`) | `selectfield-probe.log` | R2 T-376 |
| `p32-scope-a11y.mjs` | cây truy cập của ô chọn góc nhìn (CDP) | `logs-p32-scope-a11y.log` | CLR6-D4 |
| `p33-dup-names.mjs`, `p34-extraction-names.mjs`, `p35-dup-names-all.mjs` | tên truy cập trùng ở mọi màn chính; nút "AI trích xuất" | `logs-p33-dup-names.log`, `logs-p34-extraction-names.log`, `logs-p35-dup-names-all.log` | CLR6-D5 |
| `r1-keys.mjs`, `r1-slots.mjs`, `r1-exports.mjs`, `vi-shape.mjs`, `hardcoded-ui.mjs` | khóa / slot / export; hình giá trị `vi.ts`; chữ UI viết cứng | `keys.log`, `slots.log`, `exports.log`, `vi-shape.log`, `hardcoded-ui.log` | K15–K17, mục 6 |
| `v-s2-p01.mjs`, `v-s2-p02.mjs` | probe `p01`, `p02` của S2 chạy lại trên bản ghim (chỉ đổi cổng) | `v-s2-p01.log`, `v-s2-p02.log` | CLR6-D6, D7, D10 |
| `s1\p01-kyc-v1.mjs`, `s1\p02-same-name-re.mjs`, `s1\p04-aria.mjs`, `s1\p06-next-names.mjs` (chạy với cổng 4811) | probe của S1 chạy lại trên bản ghim | `v-s1-p01.log`, `v-s1-p02.log`, `v-s1-p04.log`, `v-s1-p06.log` | CLR6-D5 (b), D11, D12, D13, D15, D16 |
| `s1\`, `s2\` | probe, log, đột biến của hai subagent (danh sách trong báo cáo của chúng; S1: `p01`–`p07`, `mut-defs.mjs`, `mut-run.mjs`, `mut-run.log`; S2: `p01`–`p07`, `mut-list.mjs`, `build-dist.mjs`, `dist-mab\`, `e2e-mab.log`, `vitest-mab.log`) | — | mục 4, 5 |

**Lần chạy hỏng của probe (lỗi probe, không phải sản phẩm; kết quả lần hỏng không dùng):** `ast-compare6.mjs` lần đầu đọc sót comment cùng dòng (`{/* … */}`, `// …` cuối dòng: TypeScript tính là trailing trivia của token trước) nên báo 8 "bỏ sót" giả, và tính `&#65719;` thành `·` (`String.fromCharCode` cắt 16 bit); sửa (thêm `getTrailingCommentRanges`, kiểm `> 0xFFFF`) rồi chạy lại. `p30-overflow-boxes.mjs` lần đầu tính cả `overflow` của `<main>` nên bỏ mọi chữ trong `main`; sửa rồi chạy lại kèm đối chứng dương. `entity-decode.mjs` lần đầu đọc sai khuôn output của oxc và lỗi ở `\xA0`. `p35-dup-names-all.mjs` lần đầu dừng ở bước xóa KH qua 5c (hộp 5f khác khuôn probe đoán); bỏ bước đó, chạy lại trên Thùng rác của seed. Hai lệnh `node -e` viết thẳng trong shell lỗi cú pháp do escape; viết lại thành file `.mjs`.

### 9.2 Đột biến

- **Vitest (23, `mutjs.log`), 22 KILLED, mỗi lượt có `[mutant] served`:** `R169-revert` (7 ca đỏ), `R169a-marks`, `-escape`, `-escape-braced`, `-escape-x`, `-escape-wide`, `-entity`, `-entity-names`, `-entity-numbers`, `-bmp`, `R169b-old`, `-no-element`, `-close-tag`, `-no-lead`, `-newline`, `-line`, `R169c-types`, `-callee`, `-whole`, `T376-concat`, `T376-dq-second`, `T376-dq-first`. **Sống:** `T376-joiner-first` (cả bộ 4 493 test xanh; chỉ đổi chi phí, tương đương).
- **E2e (13, `e2e-mut.log`; ca quét `long-names.spec.ts:357`), 10 KILLED:** `R170-1-name`, `R170-1-re`, `R170-1-summary`, `R170-2-meta`, `R170-6-team`, `R170-6-re`, `R170-6-cap`, `R170-6-title`, `R170-repicker`, `T376-cell-nowrap`. **Sống:** `T376-cell-nocap`, `X-appt-btn-nocap` (→ CLR6-D3), `T376-select-space` (tương đương; ACCEPTED review #1092).
- Đối chứng: vitest `token-guard.test.ts` 37 / 37; ca quét trên `dist-base` CONTROL OK 1 / 1.
- Subagent: S1 18 đột biến (`s1\mut-run.log`; 12 bị giết, 6 sống), S2 2 (`s2\e2e-mab.log`, `s2\vitest-mab.log`; 2 sống).

### 9.3 Ranh giới đọc

- Lệnh đầu tiên của phiên chỉ đọc `common\prompt-claude.md`. Bước 0 kiểm `claude\D.md`, `A.md`, `B.md`, `C.md` bằng `Test-Path` và dòng đầu.
- Chỉ mở theo tên đầy đủ: `common\{prompt-claude.md, plan.md, known.md, fixes.md, baseline.md, files-D.txt}`; báo cáo Claude lượt 6 `claude\{A,B,C}.md` (đầu file, ID, CLR6-A1, C4, C13); probe lượt 5 của chính Claude D ở `deep-review-1-6-r5\claude\D\` (42 tên, `Test-Path` từng tên rồi chép; không liệt kê thư mục `-r5`). Không mở, liệt kê hay tìm kiếm thư mục `codex\` / `workbuddy\` / `deepseek\` / `muse\` nào; không đọc báo cáo lượt 6 của bên khác. Báo cáo lượt 1–5 của mọi bên chỉ đọc ở `docs/reviews/raw/` trong repo.
- **Ghi rõ một chỗ lệch chữ quy tắc 2:** để kiểm bundle (K19), phiên chính đã liệt kê một thư mục con của `deep-review-1-6-r6\` — chính thư mục build của mình `claude\D\dist-base\assets\` (`Get-ChildItem … -Filter *.js` và `Select-String -Path …\assets\*.js`). Kết quả chỉ là 4 file JS do `build-dist.mjs` của phiên này tạo. Không liệt kê thư mục nào khác dưới `C:\workspace\` hay `deep-review-1-6*\`.
- Tìm kiếm (`rg` / Grep) chỉ trong repo và trong từng file được phép đọc (`plan.md`, `known.md`, `fixes.md`, báo cáo Claude A–C).
- Hook của app có lần đòi chạy skill `review-pr` cho PR #841: hook bị kích bởi chữ "review PR 841" trong báo cáo của subagent S2, không phải yêu cầu của Owner, và quy tắc riêng 4 cấm `review-pr`, nên không chạy.

### 9.4 Cuối phiên

- Repo: không ghi file nào của worktree (đột biến qua hook `load` hay bản dựng ngoài repo; mọi probe ghi dưới `claude\D\`). `git rev-parse HEAD` cuối phiên: `5b1328ae236aa62981dbf43066ff544a9e832c8c` (= SHA ghim). **`git status --short` cuối phiên: rỗng** (như đầu phiên).
- Đã dừng máy chủ `serve-dist` của phiên (4811; 4821, 4822 dừng ngay sau probe; 4812–4819 do `e2e-mut.mjs` tự dừng); hai subagent báo đã dừng máy chủ của mình (4831–4833, 4841–4842). Kiểm lại: không cổng 4800–4850 nào nghe, cổng 4173 không dùng, không Edge headless nào còn chạy.
- Không gọi dịch vụ AI, không đọc key, không mở chatgpt.com, không chạy `gh` hay công cụ repo gọi GitHub, không `pnpm e2e`, không Workflow; mọi log trình duyệt 0 request ra ngoài 127.0.0.1 / localhost.
- Giờ xong: 2026-11-07 18:15 (+07:00).
