XONG — claude gói G lượt 6, 2026-11-07 21:03 (+07:00)

# Deep review Phase 1–6, lượt 6 — Claude, chủ đề G (Rà gọn)

## 1. Phiên

- Bên: claude · Chủ đề: **G. Rà gọn** (trên mọi gói; không làm bảng R, không kết luận SẴN SÀNG).
- SHA đầu phiên: `5b1328ae236aa62981dbf43066ff544a9e832c8c` (đúng SHA ghim).
- `git status --short` đầu phiên: rỗng.
- Giờ bắt đầu: 2026-11-07 20:34 (+07:00).
- Máy: Home PC `DESKTOP-KDURKJP`, Node `v24.20.0` (`C:\Program Files\nodejs\node.exe`, đứng đầu PATH).
- Công cụ: Claude Code trong app desktop Claude (tab Code), Windows 11 Pro; model Claude Opus 5.5 (`claude-opus-5-5`); mức suy luận: max (Owner chọn cho phiên).
- Bước 0: G là chữ thứ 7 trong thứ tự của Claude; `claude\G.md` chưa có → làm mới; `claude\A.md` … `F.md` có đủ, dòng đầu cả sáu là `XONG` (kiểm từng file bằng `Test-Path` + đọc dòng đầu, không liệt kê thư mục).
- Subagent: **không** (phiên chính làm hết; không Workflow).

## 2. Bảng R

Không làm (chủ đề G; quy tắc riêng 8): mọi dòng R1 / R2 là KNOWN, kết luận ở `claude\F.md` mục 2.3, 2.4.

## 3. Phạm vi đã đi qua

- **Diff `37a80b6..5b1328a`** ngoài `docs/**`, `*.md`: 61 file, +2 269 / −236 (`git diff --numstat -M`); 21 commit có code (`git log --reverse 37a80b6..5b1328a`). Đọc từng hunk của **mọi file không phải test** (37 file: 35 sản phẩm theo `classifyFile`, 2 công cụ `tools/auto-wait*`; `trash-view.ts`, `SettingsTrash.tsx`, `RestoreDialog.tsx`, `vi.ts`, `classes.ts`, `FilterBar.tsx`, `AppointmentDialog.tsx`, `AppointmentsScreen.tsx`, `appointment-form.ts`, `CustomerPolicies.tsx`, `CustomerProfile.tsx`, `CustomersScreen.tsx`, `KycHistory.tsx`, `KycIntelligence.tsx`, `KycWebSession.tsx`, `PolicyDialogs.tsx`, `StageBlock.tsx`, `ReportTable.tsx`, `ReportsScreen.tsx`, `RePicker.tsx`, `ScopePicker.tsx`, `SelectField.tsx`, `token-guard.ts`, `app-data.ts`, `persist-queue.ts`, `mock-extraction.ts`, `web.ts`, `text.ts`, `domain/index.ts`, `common.ts`, `customers.ts`, `trash.ts`, `backup-validation.ts`, `.dependency-cruiser.cjs`, `tools/auto-wait*.mjs`, `task.yml`) và **mọi file test** của diff: `trash-view.test.ts`, `persist-queue.test.ts`, `tauri-contract.test.ts`, `token-guard.test.ts`, `name-order.test.ts`, `text.test.ts`, `common.test.ts`, `ai-analyses.test.ts`, `backup-invariants.test.ts`, `backup.test.ts`, `trash.test.ts`, `web.test.ts`, `mock-extraction.test.ts`, `appointment-form.test.ts`, `notes-core.test.mjs`, `review-hint-core.test.mjs`, 7 spec e2e (`long-names`, `trash`, `appointments`, `customer-policies`, `dialog-keyboard`, `customer-ai-web`, `perf/probe.perf.ts`). `tools/auto-wait-core.test.mjs`: đọc tên 19 ca mới và cách dựng đầu vào (độ mạnh đã đo ở `claude\F.md`: 29 / 30 đột biến bị giết), không đọc từng dòng.
- **Code của ba họ**, đọc cả phần ngoài diff: DR6-160 — `trash-view.ts:170-380`, `:429-520`, `:600-680`, `SettingsTrash.tsx` (đủ), `RestoreDialog.tsx` (đủ), `packages/db/src/trash.ts:150-270`, `Dialog.tsx:20-30`; DR6-169 — `token-guard.ts` (đủ), `check-tokens.ts` (đủ), `vitest.config.ts`; DR6-170 — `classes.ts`, mọi chỗ `wrap-anywhere` / `max-w-*` của diff, `ReportTable.tsx:25-40`, `e2e/long-names.spec.ts` (đủ).
- **Chỗ nối khác:** `packages/db/src/ids.ts` (`CROCKFORD_BASE32`), `tools/retro-core.mjs:40-70`, `e2e/support.ts` (danh sách export), `playwright.config.ts`, `apps/desktop/vite.config.ts`, `packages/ui/CLAUDE.md`, `apps/desktop/CLAUDE.md`.
- **Đọc trước:** `common\prompt-claude.md`, `plan.md` §4, §L6.0–§L6.8, `known.md` (phần 1 OPEN + ACCEPTED, phần 2 K1–K50, phần 4–5), `baseline.md` (đủ), `fixes.md` (Issue T-376, phần DR6-170 của T-367), `common\gates\e2e.log`, `claude\A.md` … `F.md` lượt 6 (tên, đề xuất của mọi phát hiện; F đủ mục 2, 6, 7, 10; B1, D1–D4, F1, F2, E1, E2, C4, A1 đọc cả mục), tổng hợp lượt 5 §7.5.
- **Spec:** `docs/design/phase-6-hoan-thien.md` §4.2 (TR-1, TR-8, TR-12, màn Thùng rác `:85-165`, bảng E1–E19), đọc để chắc đề xuất của CLR6-G1 không đổi hành vi spec chốt.
- **Không đọc kỹ, và vì sao:** phần diff của `tools/auto-wait-core.test.mjs` (lý do ở trên); `CONTEXT.md`, spec Phase 3–5, golden, mockup không mở: chủ đề G không kết luận đúng-sai theo spec, và không phát hiện nào của G cần đến chúng (mọi đề xuất giữ nguyên chữ và hành vi). `CLAUDE.md` gốc / của package: có sẵn trong ngữ cảnh phiên.

## 4. Kịch bản đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| G1 | Cỡ minified + gzip từng file sản phẩm mà mỗi commit sửa của `37a80b6..5b1328a` đổi, trước ↔ sau commit (rolldown 1.2.11 của vite 8.3.1, mỗi file bundle riêng, mọi import external; `G\minify-by-commit.mjs`, log `G\minify\minify-by-commit.log`) | Tổng file vào bundle +2 972 B thô / +1 016 B gzip (bản dựng thật: `index.js` +2 681 B, CSS +92 B; `baseline.md`). Theo Issue: T-367 +988 / +325, T-368 +799 / +238, T-380 +741 / +247, T-377 +275 / +121, các Issue khác ≤ 82 B; `token-guard.ts` (công cụ, không vào bundle) +956 B | CLR6-G1, G2 |
| G2 | Đồ thị import của dependency-cruiser (`apps packages`, cấu hình repo, JSON) → file sản phẩm theo `classifyFile` mà app không bao giờ import lúc chạy (đi từ `apps/desktop/src/main.tsx`, bỏ cạnh chỉ kiểu; `G\unreached.mjs`, `G\unreached.log`) | 184 file sản phẩm `.ts/.tsx`, 181 tới được; ngoài hai file khai báo kiểu `raw.d.ts` / `sql-raw.d.ts` chỉ còn `packages/ui/src/token-guard.ts` (227 dòng, chỉ `scripts/check-tokens.ts` và test import) | CLR6-G2 |
| G3 | Thời gian từng ca e2e ở cổng của bước chuẩn bị (`common\gates\e2e.log`, 329 ca, `CI=1`, 12 worker) | Tổng thời gian ca 1 758,7 s; 5 ca mới từ lượt 5 = 40,6 s (2,3 %): quét tên dài 23,7 s (chậm thứ hai cả bộ), 8b DR6-173 4,7 s, NT-TR-07 4,5 s, 8a 3,9 s, ô KH DR6-172 3,8 s | CLR6-G3 |
| G4 | Đột biến họ "chữ trống / ô tìm" qua hook `transform` của Vite (không ghi repo; `G\mut\mut-blank.mjs`, `vitest.mut.config.mjs`, log `G\mut\mut-blank.log`): đặt lại `trim` vào hàm chung (`searchText`, `isLabel`, `isBlankWebAnswer`) hay vào một chỗ gọi (`searchCustomers`, `filterTrash`) | Đối chứng 161 / 161. Lỗi ở `searchText` (M1): 5 ca đỏ ở **3 file** (domain, 6b, Thùng rác); lỗi ở chỗ gọi (M2, M3): chỉ file của chỗ đó đỏ (1 và 2 ca). Lỗi ở `isLabel` (M4): **8 ca đỏ ở 3 file** (5 ca `it.each` một ký tự / ca ở `backup-invariants`); `isBlankWebAnswer` (M5): 3 ca, 2 `describe`. `git status --short` trước = sau = rỗng | CLR6-G3 |
| G5 | Dòng mỗi commit sửa thêm / bớt, tách sản phẩm app / test / công cụ (`git show --numstat`, `classifyFile`; `G\by-issue.mjs`, `G\by-issue.log`) | Cộng theo commit: sản phẩm +490 / −192, test +1 644 / −120, công cụ +293 / −82. Họ DR6-160 (T-368 phần Thùng rác, T-377 phần Thùng rác, T-380, T-382) ≈ +275 / −94 sản phẩm (56 % dòng sản phẩm thêm) và ≈ +330 test (bỏ 17 dòng ca ô tìm DR6-172 của `trash-view.test.ts`) | CLR6-G1 |
| G6 | Ca hợp đồng capability và bộ chặn ký hiệu theo từng commit (`git show <c>:<file>`, đếm dòng) | Ca "allows the webview only the Tauri commands it uses": 19 dòng (`37a80b6`) → 33 (T-364) → 43 (T-374) → 66 (T-381) → 98 (T-382) → 119 (T-384). `token-guard.ts` 163 → 217 (T-366) → 226 (T-376); test 305 → 463 → 482 | CLR6-G4 |
| G7 | Câu hỏi (1) trên từng khối thêm của diff: tìm hàm / hằng / helper sẵn có làm được cùng việc (`rg` theo mẫu code: đếm trùng `count.set(`, bảng chữ Crockford, `max-w-60`, bộ tách lệnh shell, locator `Điều hướng chính` / `Mục cài đặt` của e2e; bản đồ codemap trong `CLAUDE.md` của package) | Đợt sửa đã gộp ba chỗ: `searchText` về domain (bỏ hai bản của 6b và Thùng rác), `CELL_NAME` (ba bản), `deletionWords` (T-382). Còn: nút tên KH ở Lịch hẹn viết trần `max-w-60 …` (có chủ ý, Issue T-376 `fixes.md:1921`); `CUSTOMER_CODE` của luật 15 chép bảng chữ của `CROCKFORD_BASE32` (`ids.ts:3`, hằng riêng), có test nhập lại mã do app sinh giữ; bộ tách lệnh `commands` của ca capability ↔ `segments` của `tools/retro-core.mjs:57`; hai helper điều hướng của `long-names.spec.ts:324-334` (mới) chép cùng locator mà nhiều spec tự khai (vd. `trash.spec.ts:8-9`, `full-cycle.spec.ts:35`, `guide/shots.guide.ts:74`, `settings-ai.spec.ts:55`): `git grep` cho 18 lần "Điều hướng chính" ở 10 file, 15 lần "Mục cài đặt" ở 8 file; `support.ts` không export helper nào cho việc này | CLR6-G4; mục 6 (họ CLR6-F11) |
| G8 | Câu hỏi (4) ngoài file công cụ: code chỉ cho test trong bundle, export chỉ test dùng, hook test trong sản phẩm của diff (`rg` `window.exe`, `VITE_DEMO_ANCHOR`, `performance.mark`; đọc mọi export mới) | `window.exe` chỉ ở `e2e/support.ts` (phía test); `VITE_DEMO_ANCHOR`, mốc `p2c:*` có từ trước (spec §7, probe `e2e/perf`), diff không thêm; mọi export mới của diff có chỗ dùng sản phẩm (Claude F `exports-all`), trừ `STALE_HEAD_MS` (công cụ) | — |

## 5. Phát hiện mới

Phát hiện của A–F không ghi lại (dẫn ID). Thứ tự theo cỡ chi phí.

### CLR6-G1 — Họ "phân biệt bản ghi trùng tên" của Thùng rác (DR6-160, Nit) là phần nặng nhất của diff sản phẩm, và cách luồn `told` / `teams` qua từng đường không mở rộng được cho phần CLR6-F1 còn thiếu

```
ID: CLR6-G1
Mức: Nit
Trục: B (phụ: T)
Vị trí: apps/desktop/src/routes/trash-view.ts:178-316 (`OwnerPart.deletedAt`, `ownerParts(row, teams?)` :192, `goneText` :210, `rowKey` :219, `alike` :222, `ToldBy` :233, `byDeletion` :239, `toldApart` :258, `TeamsDeletedAt` :290, `teamsDeletedAt` :293, `deletionWords` :310), :327-360 (`restoreLabel`, `ofCustomer`), :373-385 (`blockedReason` / `reasonSentence` nhận `teams`), :448 (`ownerLine`), :668-679 (`restoreRow(app, row, teams?)`); apps/desktop/src/routes/SettingsTrash.tsx:60-110 (`RecordCell`, `OwnerCell` nhận `teams`), :118 (`trashColumns(…, told, teams, today)`), :334-335, :423; apps/desktop/src/routes/RestoreDialog.tsx:18, :23, :33; apps/desktop/src/routes/trash-view.test.ts:393-459, :626-660, :738-764, :1240 (5b1328a)
Tình trạng: CONFIRMED (số đo, danh sách đường; ý (c) là đọc code, chưa dựng trên màn)
Liên quan: DR6-160 (Nit) và họ DR6-43 → 99 → 119 → 151 → 160; T-368, T-377, T-380, T-382; CLR6-F1, CLR6-A1, CLR6-E2 (đề xuất của chúng làm họ phình thêm) · mới do đợt sửa sau lượt 5 (PR #1072, #1088, #1097, #1109)
```

- **Mô tả:** ca DR6-160 xếp Nit (tên truy cập của nút khôi phục trùng nhau giữa bản ghi trùng tên), K50 Q1 (a) chốt ba ca của nút. Bốn PR của họ thêm phần lớn code sản phẩm của cả diff. Phần T-380 / T-382 (giờ xóa của team ở dòng lý do TR-1 và ô "Thuộc", từ ghi chú review #1088) là một map **chỉ cho team** (`TeamsDeletedAt`), luồn qua **10 chữ ký hàm / prop** với tham số tùy chọn, cạnh `told` (map của nút). Kết quả là mỗi đường hiện tên chủ sở hữu tự lo phần phân biệt của mình, mỗi đường một mức:

  | Đường hiện tên | Phân biệt bản ghi trùng tên |
  |---|---|
  | Nút khôi phục (`restoreLabel`) | đủ: mã KH, giờ xóa tới phút / giây của nhân sự, team |
  | Ô "Thuộc" (`ownerParts` + `goneText`) | chỉ team; KH / RE / nhân sự: tên trần (CLR6-F1) |
  | Dòng lý do, cũng là mô tả của nút (`reasonSentence`) | chỉ `TEAM_NOT_FOUND`; KH / RE / người phối hợp / người đánh giá: tên trần (CLR6-F1) |
  | Hộp 11b / 11c (`restoreView`, `ownerLine` :448 gọi `ownerParts(row)` không `teams`) | không (CLR6-F1) |
  | Thông báo 11e (`restoredNotice` :611, `customer.name`) | không |

  Đề xuất của CLR6-F1 (tổng quát `teamsDeletedAt` thành map theo id cho nhân sự và team, ≈ 40–70 dòng SP, ≈ 80–120 dòng test), CLR6-E2 (≈ 40 dòng e2e) và CLR6-A1 (≈ 4–6 dòng SP + 3 ca) đều thêm vào cùng cách luồn này.
- **Tái hiện / bằng chứng:**
  - (a) **Cỡ bundle** (`node G\minify-by-commit.mjs`, `G\minify\minify-by-commit.log`, mỗi file minify riêng trước ↔ sau commit): T-368 phần Thùng rác + luật 15 (`trash-view.ts` +569, `vi.ts` +50, `trash.ts` +33, `backup-validation.ts` +110) = **+762 B thô / +218 B gzip**; T-377 phần Thùng rác (`trash-view.ts` +251, `SettingsTrash.tsx` −5) = +246 / +110; **T-380 = +741 / +247** (`trash-view.ts` +505, `SettingsTrash.tsx` +99, `vi.ts` +127, `RestoreDialog.tsx` +10); T-382 = +13 / +7. Cộng ≈ **1 762 B thô / 582 B gzip = 59 %** mức tăng của mọi file vào bundle trong diff (+2 972 / +1 016). Claude F đo bằng sourcemap trên bản dựng thật: cụm Thùng rác ≈ 1 787 B, 66 % (`claude\F.md` mục 6.1). Tỉ lệ trên toàn JS / CSS: +0,07 %.
  - (b) **Dòng** (`node G\by-issue.mjs`, `G\by-issue.log`, cộng theo commit): ≈ **+275 / −94 dòng sản phẩm** (56 % của +490 dòng sản phẩm thêm trong diff), ≈ +330 dòng test (không tính 17 dòng ca ô tìm DR6-172 cùng file). Cuối diff: `trash-view.ts` 709 → 841 dòng, `trash-view.test.ts` 1 198 → 1 501, `SettingsTrash.tsx` 407 → 443, `RestoreDialog.tsx` 69 → 72 (`git show <sha>:<file>`).
  - (c) **`teams` của `restoreRow` / prop `teams` của `RestoreDialog`** (≈ 10 dòng SP, ca `trash-view.test.ts:1240` ≈ 27 dòng) chỉ đổi chữ khi `restorePerson` từ chối `TEAM_NOT_FOUND` **sau khi** hộp 11b đã mở. Đọc code: nút Khôi phục tắt khi dòng `blocked` (`SettingsTrash.tsx:168`); dòng nhân sự có team trong Thùng rác luôn `blocked` (`listTrash` tính `blocked` bằng chính `checkRestore…`, `packages/db/src/trash.ts:201-224`); hộp là modal (`packages/ui/src/components/Dialog.tsx:25` `showModal()`), nên không thao tác nào xóa được team trong lúc hộp mở. Chỉ ca unit dựng được, bằng `app.run(softDeleteTeam)`. Chưa dựng trên màn. Việc lệnh kiểm lại và hộp hiện lỗi là của spec (`phase-6-hoan-thien.md:136`, "dữ liệu có thể vừa đổi") và vẫn giữ; ý ở đây chỉ là vế "xóa lúc" của câu lỗi trong đường đó.
  - (d) **Test chồng** (đọc `trash-view.test.ts`): sau T-382, giờ xóa của team đi qua một helper (`deletionWords`), nhưng cùng ba luật được kiểm ở bốn cửa: "tới giây khi cùng phút" ở `:443`, `:626` (phần hai), `:647`, `:748`; "team tên riêng giữ tên trần" ở `:418`, `:454`, `:626` (phần cuối), `:759`; "team trùng tên tới phút" ở `:393`, `:427` (kiểm cả `restoreLabel` của hai team), `:626`, `:738`. Ba vùng `:393-459`, `:626-660`, `:738-764` cộng ca `:1240` ≈ 155 dòng.
- **Cùng mẫu:** `rg -n "teams\?: TeamsDeletedAt|teams: TeamsDeletedAt|told: ReadonlyMap|toldApart\(|teamsDeletedAt\(" apps/desktop/src` (trừ test) → `trash-view.ts:192`, `:293-295`, `:327-330`, `:373`, `:380`, `:668-672`, `SettingsTrash.tsx:60-71`, `:93`, `:118-122`, `:334-335`, `:423`, `RestoreDialog.tsx:18`, `:23`, `:33`. Đường hiện tên không qua hai map: `restoreView` (`:451`, `:461`, `:502`), `ownerLine` (`:448`), `restoredNotice` (`:611`, `:633`), `recordTitle` (ô "Bản ghi": theo thiết kế, mã chỉ ở nút). Các ca Nit khác của đợt sửa không đắt: DR6-159 (1 dòng), DR6-163 (bớt 1 dòng), DR6-166 (+42 B), DR6-171 / 175 / 177 (tài liệu, test, probe).
- **Ảnh hưởng:** chỉ chi phí giữ: một lần đổi chữ của Thùng rác chạm 3–5 đường; mỗi ghi chú review thêm một vế lại luồn qua 10 chữ ký (T-380 là ví dụ: +101 / −25 dòng SP, +139 dòng test, +741 B cho ca hai team trùng tên cùng ở Thùng rác và một nhân sự bị một trong hai chặn). Bundle +1,8 KB thô không đo được ở thời gian mở (mở lần đầu / mở lại trong luật nhiễu, `baseline.md`).
- **Chặn phát hành:** không — Nit trục B (K48); K49: không gỡ / gộp vì bloat trước v1.0 nếu Owner không chọn.
- **Đề xuất:** một chỗ đặt tên cho cả Thùng rác thay cho `told` + `teams` luồn tay: một đối tượng tính một lần mỗi danh sách (vd. `trashNames(rows)`, memo như hiện tại), trả tên của bản ghi và của bản ghi nó trỏ tới kèm đúng vế phân biệt (mã KH, "xóa lúc …" tới phút / giây). `restoreLabel`, `ownerParts`, `reasonSentence`, `restoreView`, `restoredNotice` đều đọc từ nó. Gộp `teamsDeletedAt`, `deletionWords`, tham số `teams` của 5 hàm / component; bỏ `teams` của `restoreRow` / `RestoreDialog` (ý (c)). Test: một bảng (loại bản ghi × ca trùng × đường) thay các ca chồng ở (d). Cỡ: ≈ −20…−40 dòng SP so với hiện tại; khi làm cả CLR6-F1 thì F1 chỉ còn ≈ +15–25 dòng SP thay vì +40–70; test ≈ −60…−90 dòng. Rủi ro thấp–vừa: chữ không đổi (không cần G3, khóa `vi.ts` giữ nguyên), mọi chữ đã ghim từng byte ở `trash-view.test.ts`; test giữ hành vi: các `describe` `ownerParts`, `teamsDeletedAt`, `restoreLabel`, `blockedReason`, `restoreRow`, e2e `trash.spec.ts:663`, bước Thùng rác của `long-names.spec.ts:357`. Nếu Owner không muốn gộp: tối thiểu không mở rộng thêm theo kiểu luồn (cân nhắc F1 / E2 / A1 theo cỡ này) và bỏ (c) (≈ −10 dòng SP, −27 dòng test).

### CLR6-G2 — Bộ chặn ký hiệu / token (công cụ của `pnpm lint:tokens`) nằm trong package sản phẩm `packages/ui/src`: file sản phẩm duy nhất app không import, mà được đếm là SP gói D

```
ID: CLR6-G2
Mức: Nit
Trục: B
Vị trí: packages/ui/src/token-guard.ts:1-226 (chỉ packages/ui/scripts/check-tokens.ts:6 và packages/ui/src/token-guard.test.ts:2 import); packages/ui/CLAUDE.md:13, :49 (bản đồ export ghi như export của UI kit); vitest.config.ts:24, :76-82 (ngưỡng 100 % "the .ts helpers of the UI kit (DR6-62)" áp cho nó); tools/size-report-core.mjs (`classifyFile` → gói D, `product`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-169, T-366, T-376 (phần diff: +82 / −19) · vị trí file có từ T-007.1 (`143dc7d`, 26/09), lượt 1–5 bỏ sót
```

- **Mô tả:** `token-guard.ts` là công cụ kiểm chạy bằng node trong `pnpm verify` (`check-tokens.ts`), không phải code UI, nhưng nằm trong `packages/ui/src` cạnh component. Vì vậy: (1) nó là file sản phẩm duy nhất mà app không bao giờ import; (2) `size-report` đếm 226 dòng của nó là SP gói D; ở lượt này nó chiếm +82 / −19 trên +124 / −28 SP của gói D (66 %, `claude\D.md` mục 6), và kế hoạch §L6.0 cũng đọc diff của nó như diff sản phẩm; (3) bản đồ export của `packages/ui/CLAUDE.md` liệt kê nó cùng component dù `src/index.ts` không export; (4) ngưỡng coverage 100 % đặt cho helper của UI kit áp cho một công cụ.
- **Tái hiện / bằng chứng:** `node G\unreached.mjs C:\workspace\Project-2C-review G\depcruise.json` (`G\unreached.log`): "product .ts/.tsx under apps/desktop/src, packages/*/src: 184; reached from apps/desktop/src/main.tsx (runtime edges): 181" — ba file còn lại: `packages/ai/src/raw.d.ts`, `packages/db/src/sql-raw.d.ts` (khai báo kiểu) và `packages/ui/src/token-guard.ts (227 lines; {"pkg":"D","kind":"product"}) imported by: packages/ui/scripts/check-tokens.ts, packages/ui/src/token-guard.test.ts`. `classifyFile('packages/ui/scripts/check-tokens.ts')` → `{"pkg":"F","kind":"product"}`: hai nửa của cùng công cụ ở hai gói. Không vào bundle (Claude F: 0 module `token-guard` trong 149 module; `G\minify\minify-by-commit.log` ghi +956 B của nó ngoài tổng bundle).
- **Cùng mẫu:** cùng lệnh quét mọi file sản phẩm của `apps/desktop/src` và `packages/*/src`: không file nào khác (ngoài hai `.d.ts`); `rg -n "from '\.\./src/" packages/*/scripts` → chỉ `check-tokens.ts:6`.
- **Ảnh hưởng:** số đo kích thước sản phẩm (gói D, §L6.0 của kế hoạch, câu hỏi bloat của Owner) tính cả công cụ; người đọc bản đồ export tưởng đây là API của UI kit. Không ảnh hưởng exe.
- **Chặn phát hành:** không — Nit trục B; K49.
- **Đề xuất:** chuyển `token-guard.ts` và test sang `packages/ui/scripts/` (cạnh `check-tokens.ts`); thêm `packages/*/scripts/**/*.test.ts` vào `include` của vitest (1 dòng; coverage của `scripts/` tùy chọn). `classifyFile` khi đó xếp cả công cụ vào gói F, bản đồ export của UI kit chỉ còn code UI. ≈ 0 dòng SP, 2–4 dòng cấu hình; rủi ro thấp; test giữ hành vi: `token-guard.test.ts` (chuyển theo), `pnpm lint:tokens` trong `pnpm verify`. Sau v1.0.

### CLR6-G3 — Ma trận ký tự vô hình chép lại ở mọi chỗ gọi của một hàm chung: một lỗi trong `searchText` / `isLabel` đỏ ở ba file

```
ID: CLR6-G3
Mức: Nit
Trục: B (test) (phụ: T)
Vị trí: packages/domain/src/text.test.ts:188-212 (`searchText`); apps/desktop/src/routes/appointments/appointment-form.test.ts:321-339; apps/desktop/src/routes/trash-view.test.ts:251-265; e2e/appointments.spec.ts:422-448; packages/db/src/common.test.ts:100-114 (`isLabel`, 9 đầu vào); packages/db/src/ai-analyses.test.ts:132, :396, :552 (`BLANK_MODELS` dùng hai nơi); packages/db/src/backup-invariants.test.ts:950-956 (5 ca luật 12, mỗi ca một lần nhập backup); packages/ai/src/web.test.ts:282-283, :552; e2e/customer-policies.spec.ts:138, :168 (`INVISIBLE` khai hai lần) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-159, DR6-168, DR6-172, DR6-173; T-363, T-365, T-368, T-375, T-377 · mới do đợt sửa sau lượt 5 (PR #1063, #1066, #1072, #1086, #1088)
```

- **Mô tả:** sau T-377, luật "chữ như ô lưu" là một hàm (`searchText` trên `normalizeText`), luật "trống" của nhãn model là `isLabel`, của câu dán là `isBlankWebAnswer`. Nhưng mỗi chỗ gọi vẫn chép cả ma trận ký tự (U+200B, U+2060, U+0085, U+3164, U+180E, NBSP, hai dấu cách…): ma trận đã có ở `text.test.ts` (`normalizeText`). Chỗ gọi chỉ cần một ca cho thấy nó đi qua hàm chung.
- **Tái hiện / bằng chứng:** `node G\mut\mut-blank.mjs C:\workspace\Project-2C-review` (`G\mut\mut-blank.log`; đột biến phục vụ bằng hook `transform`, repo không ghi): đối chứng 161 / 161; **M1** (`searchText` không `normalizeText`) → 5 ca đỏ ở 3 file (`text.test.ts` 2, `trash-view.test.ts` 2, `appointment-form.test.ts` 1) — cộng ca e2e `appointments.spec.ts:425` cùng ma trận (3,8 s, `common\gates\e2e.log`); **M2** / **M3** (chỗ gọi `searchCustomers` / `filterTrash` bỏ hàm chung) → chỉ file của chỗ đó đỏ (1 / 2 ca); **M4** (`isLabel` lại dùng `trim`) → **8 ca đỏ ở 3 file** (`backup-invariants.test.ts` 5 ca, mỗi ký tự một ca; `ai-analyses.test.ts` 2; `common.test.ts` 1); **M5** (`isBlankWebAnswer` dùng `trim`) → 3 ca ở 2 `describe` của `web.test.ts`. Thời gian unit không đáng kể (ca nhập backup luật 12 ≈ 32–38 ms mỗi ca).
- **Cùng mẫu:** `git grep -n -I -E '200B|200b|u\{2060\}|u2060|3164|ZWSP'` trên file test / spec / test-support: `37a80b6` 123 dòng / 23 file → `5b1328a` **153 dòng / 27 file** (nhiều nhất `validator-blocklists.test.ts` 22, `schema.test.ts` 18, `appointment-form.test.ts` 11, `web.test.ts` 11, `common.test.ts` 10). Hằng dùng chung chỉ có `packages/ai/src/test-support.ts` (`ZWSP`, `nfdZw`), trong phạm vi `ai`; mỗi nơi khác tự khai danh sách (`BLANK_MODELS`, `INVISIBLE` hai lần trong một spec, ma trận của `backup-invariants`).
- **Ảnh hưởng:** chi phí giữ test: thêm một ký tự vào K20 / K25 thì sửa nhiều file; một lỗi của hàm chung báo 5–8 ca cùng lúc. Không sai hành vi.
- **Chặn phát hành:** không — Nit trục B (K48).
- **Đề xuất:** giữ ma trận ở `text.test.ts`; mỗi chỗ gọi giữ một hai ca (một ký tự vô hình, "chỉ có ký tự vô hình = trống") — vẫn đủ đỏ khi gỡ phần sửa, như M2 / M3 cho thấy; luật 12 giữ một ca ký tự vô hình; e2e `appointments.spec.ts:425` giữ một chữ dán và ca "chỉ có ký tự vô hình" (ca này còn giữ cổng `normalizeText(query) !== ''` của `AppointmentDialog.tsx:378`, unit không phủ). Một hằng dùng chung nếu cần (test-support của `domain`). ≈ −30…−40 dòng test, ≈ −0,15 s unit, ≈ −1 s e2e; rủi ro thấp. Sau v1.0.

### CLR6-G4 — Hai bộ quét chữ viết tay (ca hợp đồng capability, bộ chặn ký hiệu) là phần test / công cụ phình nhanh nhất của diff và vẫn chưa đủ

```
ID: CLR6-G4
Mức: Nit
Trục: B (test / công cụ)
Vị trí: apps/desktop/src/data/tauri-contract.test.ts:338-456 (ca "allows the webview only the Tauri commands it uses": bộ tách lệnh `commands`, `cli`, `tauriCalls`, `samples`, `noConfig`, bộ đọc `run:` của YAML, `cargoConfigs` ≈ :368-440); packages/ui/src/token-guard.ts:48-226 (`findHardcodedSeparators`), packages/ui/src/token-guard.test.ts (482 dòng) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-161, DR6-169; T-364, T-374, T-381, T-382, T-384, T-366, T-376; CLR6-B1, CLR6-D1, CLR6-D2 (chỗ còn hở và cách sửa), ACCEPTED review #1115 (ba dạng gọi CLI), ACCEPTED review #1068 (đọc cây cú pháp) · mới do đợt sửa sau lượt 5 (PR #1064, #1090, #1099, #1109, #1115, #1068, #1092)
```

- **Mô tả:** cả hai là bộ quét chữ viết tay nhận diện từng cách viết (cách gọi CLI tauri, cách viết ký hiệu / dấu nối), và cả hai lớn lên theo từng ghi chú review: mỗi PR vá dạng mà review trước nêu, review sau nêu dạng kế. Ca capability đi từ 19 lên 119 dòng qua 5 PR trong hai ngày (05–06/11), hấp thụ 8 ghi chú review (#1064: 2, #1090: 2, #1099: 3, #1109: 1) cộng 2 ghi chú ACCEPTED (#1115). Sau đó CLR6-B1 vẫn liệt kê 7 nguồn bỏ sót. Bộ chặn ký hiệu: `token-guard.ts` 163 → 226 dòng (+39 %), test 305 → 482 (+58 %) qua T-366, T-376; CLR6-D1 (13 / 13 cách viết lọt), CLR6-D2 vẫn còn. Cả hai không vào exe, không bắt được lỗi nào trong code app hiện tại (CLR6-D1: 0 chỗ; CLR6-B1: quyền hiện tại đúng).
- **Tái hiện / bằng chứng:** `git show <sha>:apps/desktop/src/data/tauri-contract.test.ts` đếm dòng ca theo commit (mục 4 G6): 19 (`37a80b6`) → 33 (`292a63e` T-364) → 43 (`bf8dee7` T-374) → 66 (`b2ef4c1` T-381) → 98 (`4d38a72` T-382) → 119 (`a53a1d8` T-384); `token-guard.ts` / test: 163 / 305 → 217 / 463 (`31f7fc2`) → 226 / 482 (`64720db`). Số ghi chú: phần OPEN / ACCEPTED của `known.md` (nhóm review #1064, #1090, #1099, #1109, #1115, #1068).
- **Cùng mẫu:** `git grep -n -E "split\(/&&|tauriCalls|samples = \["` (cộng mẫu dòng `run:` của YAML) trên `5b1328a -- '*.test.ts' '*.test.mjs' '*.spec.ts' 'tools/*.mjs' 'e2e/*.ts'` → bộ tách lệnh shell ở `tauri-contract.test.ts:372-377` (`commands`) và một bản khác ở công cụ `tools/retro-core.mjs:57-61` (`segments`, không đổi từ lượt 5); `git grep -n -E "let mode[: ]|callAround|const commands ="` → máy trạng thái chuỗi / comment chỉ ở `token-guard.ts:112`, đếm ngoặc ở `tools/pr-core.test.mjs:48` (`callAround`, ACCEPTED review #815, không lớn thêm từ lượt 5). Không bộ quét thứ ba lớn lên trong diff.
- **Ảnh hưởng:** chi phí giữ test / công cụ và vòng review: 7 PR, ≈ 340 dòng test / công cụ thêm trong lượt này (ca capability +100, `token-guard.ts` +63, test của nó +177) cho hai họ Low trục T, mà mỗi lượt lại có dạng mới.
- **Chặn phát hành:** không — Nit trục B (K48); đóng băng K49 đã dừng vòng vá trước v1.0.
- **Đề xuất:** dừng vá theo từng dạng. Capability: làm theo CLR6-B1 (kiểm kết quả trên exe ở job build của CI), rồi bỏ phần tách lệnh / đọc YAML / config Cargo của ca (≈ −90 dòng test), giữ phần kiểm file (`capabilities/`, `tauri.conf.json`, `default.json`, ≈ 25 dòng). Bộ chặn ký hiệu: một nguồn ký hiệu từ `vi.ts` (CLR6-D1), các dạng cú pháp còn lại ghi vào "Limits" như ACCEPTED #971 / #1068 thay vì thêm nhánh. Sau v1.0. Cỡ ròng cho capability ≈ −20…−50 dòng (bỏ ≈ 90, thêm 40–70 dòng probe + CI theo ước của B1) với độ phủ đủ mọi nguồn.

## 6. Bloat (diff `37a80b6..5b1328a`)

Câu Owner hỏi ở §L6.0 ("hơn 60 file thêm, + 2252 dòng … có cách rà soát để tránh làm nặng project không cần thiết không?"): exe không lớn thêm, bundle +0,12 %, không dependency mới. Phần lớn dòng thêm là test (3,4 dòng test cho 1 dòng sản phẩm). Phần đắt nhất so với giá trị là họ Nit DR6-160 (CLR6-G1) và hai bộ quét viết tay (CLR6-G4). Code công cụ duy nhất nằm trong package sản phẩm là `token-guard.ts` (CLR6-G2). Không dòng nào dưới đây chặn phát hành; theo K49 mọi đề xuất gỡ / gộp là sau v1.0 trừ khi Owner chọn.

| Đã chạy / đo | Trên | Kết quả | ID |
|---|---|---|---|
| Thành phần diff (`G\by-issue.mjs`, cộng theo commit) | 21 commit có code | Sản phẩm app +490 / −192, test +1 644 / −120, công cụ +293 / −82. Diff cuối: 61 file, +2 269 / −236; `size-report`: SP +509, test +1 524 (`baseline.md`). Unit 4 387 → 4 493 ca, e2e 324 → 329 | — |
| Bundle và exe so lượt 5 (`baseline.md`, bản dựng thật ở SHA ghim) | `pnpm build:exe` | JS / CSS 2 369 229 B (+2 773, +0,12 %): `index.js` +2 681, `index.css` +92, chunk dependency và "Tệp khác" như lượt 5; exe 5 649 408 B (= lượt 5); không dependency đổi (Claude F) | — |
| Bundle theo họ (`G\minify-by-commit.mjs`, mỗi file minify riêng trước ↔ sau commit; gzip từng file) | 47 lượt file sản phẩm của 11 commit | DR6-160 (T-368 phần Thùng rác + luật 15, T-377 phần Thùng rác, T-380, T-382) **+1 762 / +582** (59 %); DR6-170 (T-367, phần class của T-376) +1 007 / +346 (34 %); AI (T-365, T-375) +131 / +59; ô tìm, hộp HĐ (DR6-172, DR6-173) +66 / +31; còn lại +6. Tổng +2 972 / +1 016. Claude F chia theo sourcemap của bản dựng thật (`SettingsTrash.tsx` cả phần T-367 vào cụm Thùng rác): Thùng rác ≈ 1 787 B, chống tràn ≈ 600 B | CLR6-G1 |
| Code chỉ phục vụ một ca Nit (câu hỏi 2) | 7 DR6 mức Nit của lượt 5 | DR6-160: ≈ +275 / −94 dòng SP, ≈ +330 dòng test, +1 762 B, riêng T-380 +101 / −25 SP, +139 test, +741 B. Các Nit khác rẻ: DR6-159 1 dòng, DR6-163 bớt 1 dòng, DR6-166 +42 B, DR6-171 / 175 / 177 chỉ tài liệu / test / probe | CLR6-G1 |
| Code chỉ cho test / công cụ trong package sản phẩm hay bundle (câu hỏi 4; `G\unreached.mjs` trên đồ thị dependency-cruiser) | 184 file SP `.ts/.tsx` | Chỉ `packages/ui/src/token-guard.ts` không tới được từ `main.tsx` (ngoài hai `.d.ts`); bundle: 0 module test / công cụ (Claude F, sourcemap); diff không thêm hook test vào sản phẩm (mục 4 G8) | CLR6-G2 |
| Hàm / helper sẵn có (câu hỏi 1; mục 4 G7) | mọi khối thêm | Đã gộp: `searchText`, `CELL_NAME`, `deletionWords`, rule chung test-support của dependency-cruiser. Còn chép, không ghi phát hiện riêng: nút tên KH ở Lịch hẹn (có chủ ý, T-376); `CUSTOMER_CODE` ↔ `CROCKFORD_BASE32` (test nhập lại giữ); hai helper điều hướng mới của `long-names.spec.ts:324-334` (cùng họ CLR6-F11: locator sidebar / mục cài đặt tự khai ở nhiều spec) | CLR6-G4 (bộ tách lệnh) |
| Test lặp giữa các lớp, ca thừa (câu hỏi 3; `G\mut\mut-blank.mjs`) | 5 đột biến, 9 file test | Lỗi ở hàm chung đỏ ở 3 file (M1), 8 ca (M4); lỗi ở chỗ gọi chỉ đỏ ở file của nó (M2, M3). Trong `trash-view.test.ts`: ba luật giờ xóa của team kiểm ở bốn cửa (≈ 155 dòng). E2e quét tên dài chồng một phần với ba ca cũ cùng spec (Team & nhân sự, Tổng quan ở Toàn bộ, Báo cáo) nhưng các ca cũ kiểm tính chất mạnh hơn (vị trí nút, dòng tên, cột số liệu): không đề xuất gỡ | CLR6-G3, CLR6-G1 |
| Thời gian e2e thêm (`common\gates\e2e.log`) | 5 ca mới | 40,6 s / 1 758,7 s thời gian ca (2,3 %); quét tên dài 23,7 s, chậm thứ hai cả bộ, đổi lại phủ 7 màn × 3 góc nhìn × 2 bề rộng (Q4 (a), K50) | — |
| Bộ quét viết tay theo commit (mục 4 G6) | ca capability, `token-guard` | 19 → 119 dòng qua 5 PR; 163 → 226 dòng công cụ, 305 → 482 dòng test qua 2 PR; vẫn còn chỗ hở (CLR6-B1, D1, D2) | CLR6-G4 |
| Export, khóa i18n, `tsc --noUnusedLocals`, code lặp trong SP | Claude F mục 6.1 (không chạy lại) | Không export chết mới; 3 khóa mới đều dùng; 0 lỗi; 0 nhóm thân hàm trùng mới | — |

**Đề xuất gỡ / gộp (sau v1.0, trừ khi Owner chọn), theo cỡ:**

| ID | Việc | Cỡ ước lượng | Rủi ro | Test giữ hành vi |
|---|---|---|---|---|
| CLR6-G1 | Một chỗ đặt tên cho Thùng rác thay `told` + `teams`; bỏ `teams` của `restoreRow` / `RestoreDialog`; gộp ca test chồng | SP −20…−40 dòng (CLR6-F1 sau đó ≈ +15–25 thay vì +40–70); test −60…−90 dòng; bundle ≈ −0,3…−0,5 KB thô | thấp–vừa | `trash-view.test.ts` (chữ ghim từng byte), e2e `trash.spec.ts:663`, `long-names.spec.ts:357` |
| CLR6-G4 | Capability: kiểm kết quả trên exe (CLR6-B1) rồi bỏ bộ tách lệnh / đọc YAML; bộ chặn ký hiệu: nguồn từ `vi.ts` (CLR6-D1), dừng thêm dạng | test −90 dòng (+40–70 dòng probe + CI của B1) | thấp | probe exe của B1; `token-guard.test.ts` |
| CLR6-G3 | Giữ ma trận ký tự ở `text.test.ts`, mỗi chỗ gọi một hai ca | test −30…−40 dòng, e2e ≈ −1 s | thấp | `text.test.ts`, một ca mỗi chỗ gọi (M2 / M3 vẫn bị giết) |
| CLR6-G2 | Chuyển `token-guard.ts` + test sang `packages/ui/scripts/` | 0 SP, 2–4 dòng cấu hình | thấp | `token-guard.test.ts`, `pnpm lint:tokens` |

Công cụ nên có (G4, chỉ đề xuất, như lượt 4–5): visualizer bundle, `knip` / `jscpd`. Script tự viết của phiên này thay được một phần: `G\minify-by-commit.mjs` (cỡ theo commit / Issue), `G\unreached.mjs` (file sản phẩm không tới được), `G\by-issue.mjs` (dòng theo loại); có thể đặt vào `tools/` sau v1.0 nếu Owner muốn số này ở mỗi lượt.

## 7. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Cộng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 4 (G1, G2, G3, G4) | 0 | 0 | **4** |
| **Cộng** | 0 | 0 | 0 | 0 | 0 | 0 | 4 | 0 | 0 | **4** |

Mỗi phát hiện đếm một lần ở trục chính (G1 phụ T, G3 phụ T). **CONFIRMED 4 / 4**; PLAUSIBLE 0 (riêng ý (c) của G1 là đọc code, ghi rõ trong mục). **Đề xuất chặn phát hành (K48): 0 / 4**; không chặn: 4.

## 8. Đã xét, không thấy (theo trục)

- **E:** trên đường đọc, hai ô tìm đọc một dấu thanh đứng một mình (U+0301) khác nhau: hộp 6b hiện danh sách vì `normalizeText` giữ dấu (`AppointmentDialog.tsx:378`) rồi ghi "Không có KH khớp." (`:383-384`), còn `searchText` bỏ dấu nên Thùng rác coi như ô trống và hiện mọi dòng (`node G\p-combining.mjs`, `G\p-combining.log`: `normalizeText "́"`, `searchText ""`). Không ghi phát hiện: chữ đó không gõ được bằng bộ gõ thường, cả hai cách hiện đều không sai dữ liệu; để chủ đề H xét cùng các chỗ đọc chữ khác.
- **C:** đối chiếu đề xuất G1 với spec Phase 6 §4.2 (TR-1 "nêu tên bản ghi chặn", `:136` lệnh kiểm lại và hộp hiện lỗi): đề xuất giữ nguyên chữ và hành vi. Ghi chú "nút tên KH Lịch hẹn giữ nguyên" khớp Issue T-376. Không thấy.
- **D:** đường dữ liệu của diff (luật 15, `isLabel`, `searchText` chỉ đọc) không đổi bởi đề xuất nào; `CUSTOMER_CODE` chép bảng chữ Crockford nhưng có test nhập lại mã do app sinh (`backup-invariants.test.ts` ca "accepted" `K-0HJZ`… và các ca nhập lại file của app). Không thấy.
- **G:** đọc diff `mock-extraction.ts` (regex `CHILD`, `BULLET`), `web.ts` (`isBlankWebAnswer`): không đổi guardrail, không code thừa ngoài hai lần so độ dài trong `checkWebAnswer` (`web.ts:155` và trong `isBlankWebAnswer` `:130`, một phép so, giữ để hàm dùng chung cho nút). Không thấy.
- **S:** không chỗ ranh giới mới trong diff ngoài ca capability (CLR6-G4, chỗ hở ở CLR6-B1) và luật 15. Không thấy.
- **P:** chỉ đo cỡ và thời gian test (mục 6); hiệu năng trên exe, A/B hàm thuần: Claude F mục 6.2, không dòng ⚠️. Không phát hiện P.
- **B:** CLR6-G1…G4; mục 6.
- **T:** 5 / 5 đột biến bị giết (không lỗ test ở họ "chữ trống / ô tìm"); G3 là test lặp, không phải test hở. Không thấy lỗ mới.
- **A:** đề xuất G1 giữ nguyên tên truy cập và mô tả của nút; `title` của `SelectField` (CLR6-D4) không xét lại. Không thấy.

## 9. Phụ lục

### 9.1 Probe, log (mọi file ở `C:\workspace\deep-review-1-6-r6\claude\G\`)

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `minify-by-commit.mjs` | mỗi file sản phẩm mà commit sửa đổi: `git show` trước ↔ sau, rolldown 1.2.11 (của vite 8.3.1) bundle riêng, mọi import external, minify, gzip | `minify\minify-by-commit.log`; nguồn tách ra ở `minify\src\<commit>\…` | G1, G2, mục 6 |
| `unreached.mjs` + `depcruise.json` | đồ thị dependency-cruiser (`node node_modules/dependency-cruiser/bin/dependency-cruiser.mjs apps packages --config .dependency-cruiser.cjs --output-type json`), file SP không tới được từ `main.tsx` | `unreached.log` | G2 |
| `by-issue.mjs` | `git show --numstat` mỗi commit, chia sản phẩm / test / công cụ (`classifyFile`) | `by-issue.log` | G1, mục 6 |
| `mut\mut-blank.mjs`, `mut\vitest.mut.config.mjs` | 5 đột biến + đối chứng, phục vụ bằng hook `transform` của Vite, vitest `--reporter=json` | `mut\mut-blank.log`, `mut\out\report-*.json`, `mut\out\spec-*.json` | G3 |
| `p-combining.mjs` | `normalizeText` ↔ `searchText` của dấu thanh đứng một mình (qua `tools/ts-hooks.mjs`) | `p-combining.log` | mục 8 E |

### 9.2 Đột biến

Đối chứng 161 / 161 (ba file test ô tìm). M1 `searchText` không `normalizeText`: KILLED (5 ca, 3 file). M2 `searchCustomers` needle bằng `trim`: KILLED (1 ca). M3 `filterTrash` needle bằng `trim`: KILLED (2 ca). M4 `isLabel` bằng `trim`: KILLED (8 ca, 3 file). M5 `isBlankWebAnswer` bằng `trim`: KILLED (3 ca). Không đột biến nào sống.

### 9.3 Chạy ngoài repo, tác dụng phụ, ranh giới đọc

- **Repo không ghi:** đột biến qua hook `transform` (vitest `--root` repo, `cacheDir` ở `G\mut\.vite-cache`); `minify-by-commit.mjs` đọc bằng `git show`, ghi nguồn tách ra trong `G\minify\`; dependency-cruiser ghi JSON ra `G\`. `git status --short` sau mỗi bước chạy: rỗng (dòng cuối `mut\mut-blank.log`, các lệnh ở mục 4).
- **Không** chạy `pnpm`, `pnpm e2e`, cổng 4173, exe, trình duyệt; không gọi `gh` hay công cụ repo gọi GitHub; không dịch vụ AI.
- **Ranh giới đọc:** ngoài repo chỉ mở bằng đường dẫn đủ: `-r6\common\` (`prompt-claude.md`, `plan.md`, `known.md`, `baseline.md`, `fixes.md`, `gates\e2e.log`; `gates\*` khác chỉ `Test-Path` theo tên), `-r6\claude\A.md` … `F.md`. Tìm trong file (`rg`) chỉ trên từng file theo đường dẫn đủ (`plan.md`, `known.md`, `fixes.md`), **trừ hai lần lệch:** hai lệnh `rg` lấy tiêu đề / đề xuất phát hiện chạy với đường dẫn thư mục `-r6\claude\` và bộ lọc tên `{A,B,C,D,E}.md` / `{A,B,C,D,E,F}.md`. Kết quả chỉ có dòng của sáu báo cáo của Claude, nhưng `rg` đi qua cả các thư mục probe `A\` … `F\` của Claude trong đó: trái chữ quy tắc riêng 2 ("không tìm kiếm trên … `deep-review-1-6-r6\`"). Không chạm `codex\`, `workbuddy\` (thư mục anh em, ngoài `claude\`), không thấy báo cáo của bên khác. Không mở / liệt kê / tìm kiếm thư mục `codex\`, `workbuddy\`, `deepseek\`, `muse\` của lượt nào; không liệt kê `-r6\` hay thư mục con nào ngoài `claude\G\` của chính phiên này; không mở probe lượt 6 của gói khác.
- **Cache:** vitest ghi `results.json` vào `G\mut\.vite-cache\vitest\…` (theo `cacheDir`); `node_modules\.vite` của repo giữ giờ ghi 05/11 (không do phiên này).

### 9.4 Cuối phiên

- `git rev-parse HEAD`: `5b1328ae236aa62981dbf43066ff544a9e832c8c` (= SHA ghim); `git status --short` của `C:\workspace\Project-2C-review`: **rỗng**, như đầu phiên.
- Không tiến trình `project2c`, không server / cổng nào do phiên mở.
- Giờ xong: **2026-11-07 21:03 (+07:00)**, Home PC (bắt đầu 20:34).
