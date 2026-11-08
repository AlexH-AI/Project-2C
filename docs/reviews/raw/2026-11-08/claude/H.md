XONG — claude gói H lượt 6, 2026-11-07 22:03 (+07:00)

# Deep review Phase 1–6, lượt 6 — Claude, chủ đề H (Chữ người dùng nhập và hiển thị)

## 1. Phiên

- Bên: claude · chủ đề **H. Chữ người dùng nhập và hiển thị** (trên mọi gói; không làm bảng R, không kết luận SẴN SÀNG).
- SHA đầu phiên: `5b1328ae236aa62981dbf43066ff544a9e832c8c` (worktree `C:\workspace\Project-2C-review`, detached).
- `git status --short` đầu phiên: rỗng.
- Giờ bắt đầu: 2026-11-07 21:05 (+07:00), Home PC.
- Công cụ: Claude Code (app desktop Claude, tab Code). Model: Claude Opus 5.5 (`claude-opus-5-5`). Mức suy luận: max.
- Bước 0: `H` là một chữ trong thứ tự A → … → I; `claude\H.md` chưa có (làm mới); `claude\A.md` … `G.md` có đủ, dòng đầu đều `XONG`.
- Ultracode / Workflow: không dùng.
- **Subagent: 2 lần**, công cụ Agent, `subagent_type: general-purpose`, `model: opus` (Claude Opus 5.5), `effort: xhigh`, chạy nền song song với phiên chính; tin nhắn giao việc nêu đường dẫn đủ `C:\workspace\deep-review-1-6-r6\common\prompt-claude.md`, chữ chủ đề H, bảo đọc quy tắc riêng 2–4 và phần chung trước; không subagent nào gọi subagent khác, không ghi `H.md`; mỗi subagent một cổng riêng, dùng chung bản web `H\dist-base` của phiên chính (chỉ đọc).

  | Subagent | Việc giao | Cổng, probe | Thời gian |
  |---|---|---|---|
  | S1 | Chữ người dùng nhiều dòng / rất dài ở chỗ chưa ai đo: ghi chú / Việc tiếp theo / Mô tả trigger của lịch hẹn trên mọi màn, tooltip chart Tổng quan với tên team dài, hộp 5f / 9b / 9d / 10a / 11i và dòng `role="status"` | 4881, `H\s1\` | 1 128 s, 118 lần gọi công cụ |
  | S2 | Ma trận ô nhập ↔ lệnh qua giao diện: tên 5a / 5c / 9a / 9c, ghi chú + giá trị KYC 7a / 7c, chữ tùy chọn 6a / 6b / 6c / 6e / 6f, hai ô tìm, chữ xác nhận 10c / 11i × 14 dạng đầu vào; hộp sửa coi khoảng trắng là thay đổi? | 4891, `H\s2\` | 1 238 s, 128 lần gọi công cụ |

  Phiên chính **kiểm lại mọi phát hiện của S1, S2 trên code** (đọc lại vị trí ở SHA ghim) và **chạy lại probe của chúng trên bản ghim của mình** (cổng 4871, log ở `H\v\`: `v-s1-p1-notes.log`, `v-s1-p1d.log`, `v-s1-p1b.log`, `v-s1-p2c.log`, `v-s1-p3.log`, `v-s2-p08.log`, `v-s2-p09.log`, `v-s2-p12.log`) trước khi ghi. S1-1 và S2-1 là cùng một lỗi, hai bên tìm độc lập (→ CLR6-H3). S2-3 không ghi (không đi tới được từ app, mục 8). S1-4 ghi là vị trí bổ sung của CLR6-F2, không đếm lại.

Probe / log: `C:\workspace\deep-review-1-6-r6\claude\H\`. Bộ dựng chép theo tên đủ từ `deep-review-1-6-r5\claude\E\` (báo cáo gốc lượt 5 `docs/reviews/raw/2026-11-05/claude/E.md` §9.1: `build-dist.mjs`, `serve-dist.mjs`, `pw.config.mjs`, `browser.mjs`, `hooks.mjs`, `ui-stub.mjs`) vào `H\r5copy\`; bản làm việc ở `H\` (bỏ phần đột biến, `LOAD` → `-r6\common\load\…`, host 127.0.0.1). Bản web `H\dist-base` (Vite `build()` của worktree ghim, `outDir` ngoài repo, neo 15/09/2026 + ảnh chụp demo như `e2e/serve.mjs`; `build-base.log`: `git status --short after: ""`), phục vụ 127.0.0.1:4871 (`serve-4871.log`). Node v24.20.0 (`C:\Program Files\nodejs` đầu PATH).

## 2. Bảng R

Không làm (chủ đề G–I, quy tắc riêng 8): mọi dòng R1 / R2 là KNOWN.

## 3. Phạm vi đã đi qua

Chủ đề H trên mọi gói: chỗ đọc chữ người dùng (ô nhập, dán, nhập backup, ô tìm), hỏi trống / độ dài / so sánh / sắp, lưu (lệnh + luật nhập), hiện (bảng, hộp, tên nút / link, `aria-*`, `title`, chart, Excel, câu lỗi, tiêu đề cửa sổ, tên file).

**Đọc hết:** `packages/domain/src/text.ts`, `name-order.ts`; `kyc-fact.ts` (`normalizeKycValue`), `period.ts:228-270` (`parseQuickDate`), `money.ts:30-140` (`parseVnd`); `packages/db/src/common.ts:1-200`, `backup-validation.ts:1-140`, `schema.ts` (mọi cột `text(`), `appointments.ts` (chỗ gọi `optionalText`, `rescheduleAppointment` :228-250), `team.ts:144-220`, `customers.ts:56-100`, `index.ts`; `apps/desktop/src/i18n/index.ts`; `routes/reports/report-workbook.ts`; `routes/overview/stage-chart.ts:1-120`, `packages/ui/src/components/Chart.tsx:20-30`, `chart-theme.ts:47`; `shell/AppShell.tsx:1-60`, `shell/routes.ts:53-57`; `packages/ui/src/components/TextField.tsx`, `DataTable.tsx:60-120`, `compare-cells.ts`; `packages/ai/src/validator.ts:150-240`; ExcelJS 4.4.0 `lib/utils/utils.js:60-130`.

**Đọc theo chỗ:** `CustomersScreen.tsx:40-110`, `:255-315`; `AppointmentDialog.tsx:120-160`, `:325-420`; `AppointmentsScreen.tsx:640-700`; `CustomerKyc.tsx:200-240`, `:290-345`; `CustomerAppointments.tsx:137-142`; `OutcomeDialog.tsx:170-200`; `EditOutcomeDialog.tsx:60-110`, `:225-260`; `trash-view.ts:55-100`; `extraction-view.ts:1-30`, `:80-104`; `KycIntelligence.tsx:50-70`; `PolicyDialogs.tsx:255-275`; `policy-form.ts:239-255`; `StageBlock.tsx:150-170`; `customers-view.ts:150-175`; `appointment-form.ts:85-180`; `outcome-form.ts:30-40`, `:205-225`; mockup `appointment-forms.html:30-60`.

**Subagent đọc thêm (theo tin trả về; phiên chính đọc lại mọi vị trí của phát hiện):** S1 — `OutcomeDialog.tsx`, `EditOutcomeDialog.tsx`, `CustomerKyc.tsx` (dòng thời gian), "Các lần hẹn trước" của `AppointmentDialog.tsx`, `RescheduleFields.tsx`, `CustomerAppointments.tsx`, `RestoreDialog.tsx`, `trash-view.ts`, `stage-chart.ts`, `chart-theme.ts`, `PersonDialogs.tsx`, `TeamDialogs.tsx`, `Dialog.tsx`, `appointments.ts` (`insertScheduled`, `rescheduleAppointment`), mockup `appointments.html`, `customer.html`; S2 — `CustomerDialogs.tsx`, `KycDialogs.tsx`, `TeamDialogs.tsx`, `PersonDialogs.tsx`, `MetFields.tsx`, `OutcomeDialog.tsx`, `EditOutcomeDialog.tsx`, `RescheduleFields.tsx`, `AppointmentDialog.tsx` (ô KH), `SettingsTrash.tsx` (ô tìm), `ConfirmWordDialog.tsx`, `extraction-view.ts`, `common.ts` (`storable`, `optionalText`), `vi.ts` (câu lỗi).

**Không đọc kỹ:** `packages/ai/src/mock-extraction.ts` (chỉ chạy, K7: chữ đã chuẩn hóa trước khi vào; lô lỗi Mock là chủ đề gói C), `web.ts` (gói C đã đo câu dán), Rust `src-tauri` (không nhận chữ người dùng ngoài tên file xuất ASCII và key: gói B / C).

### 3.1 Bảng quét chủ đề H

| # | Câu hỏi | Lệnh / probe | Mọi chỗ (path:dòng, `5b1328a`) | Kết luận |
|---|---|---|---|---|
| Q1 | Màn hỏi "trống" chữ gõ bằng hàm chuẩn? | `rg -n "normalizeText\(\|normalizeNote\(\|\.trim\(\)\|trimStart\|trimEnd" apps/desktop/src packages/ui/src --glob "!*.test.*"` | `AppointmentDialog.tsx:102`, `:378`; `OutcomeDialog.tsx:216`; `RescheduleFields.tsx:75`; `appointment-form.ts:92`, `:120`; `outcome-form.ts:36`, `:213-216`; `CustomerDialogs.tsx:227`; `KycDialogs.tsx:230`, `:256`, `:503`; `PolicyDialogs.tsx:81`; `customers-view.ts:161` | Đúng cả 14: hỏi qua `normalizeText` / `normalizeNote`; `trim()` ở `appointment-form.ts:92`, `outcome-form.ts:213` chỉ cắt đầu / cuối chữ "như gõ" sau khi đã hỏi trống bằng `normalizeText` (= `optionalText` của lệnh). `trim()` còn lại: `settings-ai-view.ts:31` (API key, K8; ký tự vô hình bị `NOT_ASCII` chặn), `extraction-view.ts:19` (ghi chú đã chuẩn hóa), `policy-form.ts:250` (tên RE đã lưu): không phải chữ gõ chưa chuẩn hóa. Đột biến 9 / 9 chỗ `.ts` bị giết (K10) |
| Q2 | Lệnh và luật nhập cùng luật chữ? | `rg -n "storedAs\|requireName\|cleanNote\|optionalText\|isLabel\|readsBackAsIs" packages/db/src`; probe `p06-roundtrip.mjs` | Lệnh: `common.ts:39-79` (`cleanText`, `cleanNote`, `requireName`, `optionalText`), `:105-107` (`isLabel`), `normalizeKycValue` (`domain/kyc-fact.ts:44-62`); luật nhập: `backup-validation.ts:50-120` (`storedAs` với chính các hàm đó: tên, ghi chú KYC, ba chữ của lịch hẹn, giá trị KYC) | Cùng hàm; 28 / 28 dạng chữ khứ hồi được (K6). `normalizeText` bất biến khi chạy lại (K1) |
| Q3 | So / tìm qua hàm chuẩn? | `rg -n "searchText\(\|stripDiacritics\(\|collapseSpaces\(\|toLowerCase\(\|toLocaleLowerCase\(\|\.normalize\(" apps/desktop/src packages/*/src --glob "!*.test.*"` | `appointment-form.ts:163-171` (ô KH 6b), `trash-view.ts:62-80` (Tìm theo tên): `searchText` (K1 (4): NFD, NBSP, hai dấu cách, hoa); `extraction-view.ts:93-104` (`comparable` trên giá trị đã qua `normalizeKycValue`); `validator.ts:177-190` (V7, gói C); `ConfirmWordDialog.tsx:70` (NFC, theo D1, gói E); `report-workbook.ts:199-204`, `:227-230` (tên file ASCII) | Đúng. Khóa "trùng tên" so đúng chữ ở Thùng rác / 9b: CLR6-A1 (đã báo); so thô ở 9a: CLR6-D10 (đã báo) |
| Q4 | Sắp tên qua một hàm? | `rg -n "localeCompare\|\.sort\(\|sortedByName\|byName" apps/desktop/src packages/ui/src --glob "!*.test.*"` | `DataTable` → `compare-cells.ts:12-16` (`byName`); `data/tables.ts:36-38` (`sortedByName`); `localeCompare` chỉ cho chuỗi giờ (`appointment-form.ts:150`, `appointments-view.ts:467`, `policy-form.ts:270`) | Đúng |
| Q5 | Tên làm khóa (gộp hai bản ghi trùng tên)? | `rg -n -E "(\.set\|\.get\|\.has)\([^)]*\.name\b\|groupBy\|names\.indexOf"`; `rg -n "key=\{[^}]*(name\|label\|text\|title\|term\|line)"` | Map theo tên: chỉ `team-view.ts:131` (9b, CLR6-A1), `trash-view.ts:268` (theo id); khóa React theo chữ: `KycIntelligence.tsx:62` (tên trường cố định), `PolicyDialogs.tsx:269` (một dòng mỗi tháng × chỉ số, `policy-form.ts:239-255`), `StageBlock.tsx:163` (tên nhóm cố định), các `term` cố định | Không chỗ nào gộp số liệu hay dòng theo tên |
| Q6 | Chữ người dùng thành HTML? | K9 | 0 sink; tooltip chart `stage-chart.ts:79` qua `encodeHtml` | Đúng |
| Q7 | Chữ người dùng trong câu UI bị đọc lại? | K8 | `i18n/index.ts:31-37` (`fillSlots` một lượt, hàm thay thế) | Đúng |
| Q8 | Tên truy cập trùng trong một danh sách? | K5, K5b; `rg -n -E "\{(c\|card\|r\|row\|match\|a\|customer)\??\.(customer\??\.)?name\}" apps/desktop/src/routes --glob "*.tsx"` | `CustomersScreen.tsx:63`, `:301` (**CLR6-H2**); `AppointmentsScreen.tsx:183`, `:579` (CLR6-E3); thẻ Kanban `:275`, "KH khớp" `AppointmentDialog.tsx:393` đã phân biệt | Xem CLR6-H2; họ đã báo: CLR6-A1, C13, D5, D13, E3, F1 |
| Q9 | Excel nhận mọi chữ đã lưu? | K2, K2b; `rg -n "addRow\|getCell\(\|\.value = " apps/desktop/src --glob "!*.test.*"` | `report-workbook.ts:94`, `:106` (`:98`, `:102` chữ cố định) | **CLR6-H1** (U+FFFE / U+FFFF); CLR6-E10 (`_xHHHH_`, đã báo) |
| Q10 | Chữ rất dài: trần độ dài, chi phí | `rg -n "MAX_[A-Z_]+ *=" packages/*/src apps/desktop/src`; K7 | Không trần cho tên / ghi chú ở cả lệnh lẫn luật nhập (khớp nhau); trần chỉ ở AI (`MAX_AI_RAW_OUTPUT` 20 000, `MAX_MESSAGE_CHARS` 200 000), backup 100 MB (CLR6-A5) | Tuyến tính, ≤ 6 ms ở 190 000 ký tự |
| Q11 | Tiêu đề cửa sổ, tên file, clipboard | đọc `AppShell.tsx:24-30`, `report-workbook.ts:193-230`, `ai/src/web.ts` (gói C) | tiêu đề = tên màn; tên file Excel ASCII (`slug`), tên backup cố định; tin nhắn ChatGPT web không mang tên KH | Đúng |
| Q12 | Cắt chữ người dùng theo code unit (vỡ emoji / cặp surrogate)? | `rg -n -E "\.slice\(0, \|\.substring\(\|\.substr\(\|\.at\(0\)\|charAt\(" apps/desktop/src packages/*/src --glob "!*.test.*"` | `ai-error-view.ts:53` (tách ở chỗ link đã tìm), `overview-view.ts:79` (chữ số đã định dạng), `report-workbook.ts:203` (slug ASCII), còn lại cắt danh sách; AI cắt theo code point (`code-points.ts`, `validator.ts:216-218`) | Không chỗ nào cắt tên / ghi chú; cắt hiển thị chỉ bằng CSS `truncate` |

## 4. Kịch bản đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| K1 | Mọi code point (1 112 064, trừ nửa surrogate) qua `normalizeText` trong 5 ngữ cảnh (`a·b`, đứng một mình, giữa hai dấu cách, cuối, trước U+0301): chạy lại có đổi không; cái gì còn giữ mà XML 1.0 cấm; noncharacter (`p01-normalize.mjs`) | Bất biến 0 / 5,56 triệu lần (luật nhập `storedAs(requireName)` không từ chối tên do lệnh lưu); giữ U+0000 (đã bị `isStorableText` chặn), **U+FFFE, U+FFFF**; giữ 66 noncharacter; `searchText` khớp NFD, NBSP, hai dấu cách, chữ hoa | CLR6-H1 |
| K2 | Team "Sao\uFFFFKhuê" + RE "Vũ\uFFFEHai" qua `openAppData` (web, seed demo) → `reportRows` → `exportReport` (đường của Báo cáo → Xuất Excel); đối chứng tên thường (`p02-excel.mjs`) | Đối chứng: XML hợp lệ, ExcelJS đọc lại được. Có ký tự: app báo `exported`, `sharedStrings.xml` chứa 2 ký tự thô, saxes "disallowed character", **ExcelJS không đọc được chính file nó ghi** | CLR6-H1 |
| K3 | Các code point `normalizeText` giữ hiện ra sao trên Edge (bản web): bề rộng trong font của app; "+ Team" với tên chỉ có U+FFFE (`p03-render.mjs`, ảnh `p03-team-list.png`, `p03-team-heading.png`) | U+FFFE / U+FFFF / U+FDD0 / U+1FFFE / chưa gán / PUA: ô vuông 9,05 px (thấy được); U+200B 0 px (đã bị bỏ). Team chỉ có U+FFFE được tạo, danh sách và h2 hiện ô vuông: không phải "tên không thấy gì" | — (CLR6-H1 chỉ ở Excel) |
| K4 | KH trùng tên trong seed demo neo 15/09/2026 (`p04-seed-namesakes.mjs`, `openAppData` web) | 1 200 KH sống, 96 tên dùng chung (16 tên trùng trong cùng nhóm); 36 nhân sự, không tên trùng | CLR6-H2 |
| K5 | Tên truy cập của link mở hồ sơ ở Khách hàng (CDP `Accessibility.queryAXTree`, role link): Bảng sắp theo Họ tên, hiện đủ 1 200 dòng; mỗi cột Kanban; hai danh sách nhóm đóng (`p05-customer-dup-names.mjs`) | **Bảng: 96 tên trên 2–3 link mở hồ sơ khác nhau** (vd. "Bùi Hoài Việt" ×2: K-M6JB / K-CB2E); Kanban (6 thẻ / cột, tên + RE + giới tính / năm sinh) và nhóm đóng (5 dòng): 0 | CLR6-H2 |
| K5b | Như K5 trên Bảng mở mặc định (sắp theo "since", 100 dòng đầu) (`p05b-default-order.mjs`) | 100 link, 0 tên trùng: vì sao quét ở trạng thái mặc định không thấy | CLR6-H2 |
| K6 | Khứ hồi lệnh → backup → nhập, 28 dạng chữ (NEL đầu / giữa / cuối, LS, ZWSP, BOM đầu / giữa, NBSP, TAB, dấu cách thừa, NFD, dấu kết hợp đứng đầu, emoji ZWJ / VS16, U+FFFE, U+FFFF, VT, FF, CRLF, U+180E, U+3164, U+3000, dấu cách + dấu kết hợp, toàn khổ, chữ RTL, U+2800, C1, U+034F) cho tên team / RE / KH, ghi chú + dữ kiện KYC (`recordKycNote`), mô tả trigger, ghi chú kết quả, lý do dời; mỗi dạng một app mới (`p06-roundtrip.mjs`) | Mọi lệnh nhận; **28 / 28 backup nhập lại được**; sau nhập giống hệt: tên team / nhân sự / KH, ba chữ của lịch hẹn (28 / 28 "same texts: true") và ghi chú + giá trị dữ kiện KYC (`getKycProfile`, 28 / 28 "same KYC notes + fact values: true"). Lệnh và luật nhập cùng luật chữ | — |
| K7 | Chữ rất dài: ghi chú 2 000 / 20 000 / 100 000 / 190 000 code unit (dưới trần 200 000 của `MAX_MESSAGE_CHARS`) qua `normalizeNote`, Mock trích xuất, `searchText` (`p07-long-note.mjs`, trung vị 5 lần) | Tuyến tính: 190 000 → 3,4 / 4,7 / 5,6 ms. Không phát hiện P | — |
| K2b | File `.xlsx` của K2 ghi ra đĩa (`p02-control.xlsx`, `p02-nonchar.xlsx`), `xl/sharedStrings.xml` và `sheet1.xml` qua `System.Xml.XmlDocument.LoadXml` của .NET (PowerShell) | Đối chứng: cả hai phần nạp được. File có ký tự: `sharedStrings.xml` "hexadecimal value 0xFFFF, is an invalid character" | CLR6-H1 |
| K8 | Chữ người dùng trong câu của UI: `t` / `fillSlots` / `errorMessage` / `joinParts` với tên chứa `{date}`, `{name}`, `{count}`, `$&`, `$1`, `$$`, `` $` ``, `x}{y`, dấu nối " · " (`p08-slots.mjs`) | Điền một lượt, không đọc lại chữ đã điền: mọi tên hiện nguyên văn; `$…` không bị hiểu là mẫu thay thế. Tên chứa " · " đọc lẫn với dấu nối (vốn có, không ghi) | — |
| K10 | Mỗi chỗ đọc chữ gõ qua `normalizeText` / `collapseSpaces` trong file `.ts` đưa về `trim()` / so thô, từng chỗ một (9 đột biến: `rescheduleReason`, `parseTime`, `readCaseSize`, Việc tiếp theo của `readOutcome`, `parseBirthDate`, `optionalText` của `db`, `comparable` bỏ hạ chữ / bỏ gộp khoảng trắng, `tooShort` đếm code unit), vitest qua hook `load`, repo không ghi (`mut-list.mjs`, `mutjs.mjs`, `mutant-config.mjs` theo bản lượt 5 của Claude E; `mutjs.log`) | Đối chứng 189 / 189 xanh; **9 / 9 KILLED** ngay ở file test nhắm; `git status --short` sau: rỗng. Chỗ hỏi trống trong `.tsx` có ca e2e chữ vô hình (`e2e/appointment-outcome.spec.ts:162-198`, `appointments.spec.ts:437-445`, `customer-policies.spec.ts:138-185`): 6b ngày / giờ, ô KH, 6c case size / ngày hẹn tiếp, 6e ngày mới, 8a; không có ca chữ CHỈ vô hình cho tên 5a / 5c và giá trị / ghi chú 7a / 7c (`CustomerDialogs.tsx:227`, `KycDialogs.tsx:230`, `:256`, `:503`) — lệnh vẫn từ chối (`NAME_REQUIRED`, `KYC_NOTE_EMPTY`), nên đổi lại chỉ làm câu báo hiện ở khung thay vì dưới ô; không chạy đột biến TSX, không ghi phát hiện | — |
| K11 | Giá trị KYC liền dài 163 ký tự (`STK` + số, như số tài khoản dán vào) ở Nghề nghiệp và Mối quan tâm chính qua 7a; đối chứng giá trị có dấu cách; 1 100 và 1 440 (`p09-long-kyc-value.mjs`, ảnh `p09-long-1100.png`) | Hộp 7a 446 / 446; hồ sơ 1 100 / 1 100, 1 440 / 1 440; 0 phần tử rộng hơn hộp, 0 chữ quá mép khối: thẻ Dữ kiện KYC và Dòng thời gian ngắt chữ | — |
| K12 | (S1, chạy lại ở `H\v\`) Ghi chú cuộc gặp 3 dòng + Việc tiếp theo / Mô tả trigger có U+2028, U+0085, NBSP, tab, U+200B qua 6b → 6c → khung Chi tiết, thẻ Lịch hẹn của hồ sơ, Dòng thời gian, "Các lần hẹn trước" 6b, 6h, 6f (Đã gặp → Hủy, lưu không sửa / sửa ô), 6e lý do dời, hộp xóa, Thùng rác (`s1\p1-notes.mjs`) | Chi tiết giữ dòng; thẻ hồ sơ và "Các lần hẹn trước" cố ý một dòng; **Dòng thời gian gộp dòng**; **6f Hủy: ô một dòng dính chữ, sửa rồi lưu → chữ dính được lưu**; U+2028 / U+0085 không thành xuống dòng | CLR6-H3, H4, H7 |
| K13 | (S1, chạy lại) 6c: gõ hai dòng khi Đã gặp → Không đến → để nguyên / gõ thêm; đối chứng dán hai dòng vào ô một dòng (`s1\p1d-6c-switch.mjs`) | Để nguyên: lưu có LF; gõ thêm: lưu chữ dính; dán: LF thành dấu cách | CLR6-H3 |
| K14 | (S1, chạy lại) Bề rộng LF / VT / FF / U+0085 / U+2028 / U+2029 / U+200B / NBSP / tab ở `white-space: normal` và `pre-line` (`s1\p1b-chars.mjs`) | `pre-line` chỉ ngắt ở LF; VT / FF / U+0085 vẽ thành ký hiệu (125–130 px so với dấu cách 121,2) | CLR6-H7 |
| K15 | (S1, chạy lại với cổng 4871) Tooltip chart Tổng quan, góc nhìn Team, tên team 30 / 45 / 60 / 80 ký tự có dấu cách, rê chuột ở 12 % và 50 % bề rộng chart, 1 100 / 1 440 (`s1\p2c-threshold.mjs`); S1 thêm tên seed (`p2d`), tên liền 160 (`p2`, `p2b` + ảnh) | Từ 30 ký tự: mép trái tooltip −25 … −530 px (ngoài cửa sổ); tên seed: trong cửa sổ | CLR6-H5 |
| K16 | (S1, chạy lại) Nhánh lỗi / gợi ý của 9a / 9b / 9c, 5f, 11i với tên 81–160 ký tự ở 1 100 (`s1\p3-dialogs.mjs`) | 9a 1 151 / 446, 9c 1 010 / 446, 9b 519 / 446 (hộp cuộn ngang); 5f, 11i 446 / 446; trang không cuộn | CLR6-F2 (bổ sung) |
| K17 | (S2) Ma trận 11 ô × 14 dạng đầu vào (rỗng, chỉ dấu cách / U+200B / NBSP / U+0085, dấu cách cuối, NFD, U+FFFE, NUL, nửa surrogate, emoji ZWJ, 1 000 ký tự, xuống dòng dán vào ô một dòng, CRLF) qua giao diện (`s2\p01`…`p07`, `p13`) | Màn hỏi trống / báo lỗi khớp lệnh ở mọi ô; tên lưu NFC, gộp khoảng trắng, hiện lại đúng; chữ tùy chọn lịch hẹn lưu như gõ (K33); NUL / nửa surrogate: câu `INVALID_TEXT` ở khung form, 9c và Giá trị 7a báo dưới ô; dán xuống dòng vào ô một dòng → dấu cách; chuỗi liền dài ở chữ lịch hẹn không cuộn trang | CLR6-H6 |
| K18 | (S2, chạy lại) Sau Lưu ở chân 6f / 6c đang cuộn, khung lỗi có trong tầm nhìn không; chiều cao các hộp ở 1440×900 / 1280×720 (`s2\p08-alert-view.mjs`, `p12-alert-6c.mjs`, `p09-dialog-heights.mjs`) | Khung lỗi ở −126 … −41 px, ngoài vùng nhìn; focus ở lại nút Lưu; 6f 1 007 px trong khung 864 / 684 | CLR6-H6 |
| K19 | (S2) Hai ô tìm (6b, Thùng rác) với NFD, bỏ dấu, chữ hoa, hai dấu cách, NBSP, U+0085, tab, U+3000, dấu cách cuối, emoji có / không ZWJ, U+200B, soft hyphen (`s2\p06-search.mjs`) | Ra đúng KH ở mọi dạng | — |
| K20 | (S2) Hộp sửa coi thay đổi chỉ khoảng trắng / ký tự vô hình là "có thay đổi"? `rg "unsaved\|dirty\|changed\b" apps/desktop/src`; 5c đổi tên chỉ thêm NBSP rồi lưu (`s2\p01-customer.mjs`) | Chỉ 9a (CLR6-D10, đã báo); 5c lưu, tên giữ nguyên | — |
| K21 | (S2) `held` / `comparable` của panel trích xuất với giá trị có U+200B, U+0085, soft hyphen (`s2\p11-held.mjs`, gọi thẳng hàm trong Node) | Hàm coi là giá trị khác — nhưng giá trị đề xuất trong app luôn đã qua `normalizeKycValue` (`run.ts:318-319`, `validator.ts:187-193`): không đi tới được, không ghi | — |
| K9 | Chỗ chữ người dùng có thể thành HTML: `rg -n -E "dangerouslySetInnerHTML\|innerHTML\|outerHTML\|insertAdjacentHTML\|document\.write\|new Function\|\beval\(" apps/desktop/src packages/*/src` (trừ test, `token-guard`); formatter / rich text của ECharts | 0 sink HTML. Chart: chỉ `stage-chart.ts:71-90` dựng HTML tooltip, tên team qua `encodeHtml` (`:79`), tên cột là chữ cố định (`:57`); nhãn trục là ngày, `{today\|…}` chỉ bọc ngày (`:99-100`) | — |

## 5. Phát hiện mới

### CLR6-H1 — Tên team / RE có U+FFFE hay U+FFFF (lệnh nhận, `normalizeText` giữ) làm file Excel của Báo cáo không phải XML hợp lệ: app báo "đã xuất", chính ExcelJS không đọc lại được

```
ID: CLR6-H1
Mức: Low
Trục: E
Vị trí: packages/domain/src/text.ts:23-24 (INVISIBLE không gồm noncharacter), :32-38 (normalizeText giữ U+FFFE / U+FFFF); apps/desktop/src/routes/reports/report-workbook.ts:94 (ô A1: {scope} có tên team / RE), :106, :114 (tên team / RE của dòng); ExcelJS 4.4.0 apps/desktop/node_modules/exceljs/lib/utils/utils.js:73 (`xmlEncode`: chỉ bỏ C0 và DEL) (5b1328a)
Tình trạng: CONFIRMED (file không là XML 1.0 hợp lệ, ExcelJS không mở được); PLAUSIBLE (Excel thật báo hỏng / sửa file: không chạy Excel)
Liên quan: CLR6-E10 (cùng chỗ ghi ô chữ của Excel, `_xHHHH_`); K20 / K25 / K30 (tập ký tự `normalizeText` bỏ) · có từ trước, lượt 1–5 bỏ sót
```

- **Mô tả:** XML 1.0 (mọi phần của `.xlsx`, ECMA-376) cấm U+FFFE, U+FFFF. `normalizeText` bỏ `\p{Cf}`, `\p{Default_Ignorable_Code_Point}`, U+2800 và `\p{Cc}` không phải khoảng trắng, nhưng giữ noncharacter (66 code point, gồm U+FFFE, U+FFFF), nên lệnh nhận một tên team / nhân sự / KH có chúng (dán từ chữ hỏng mã hóa, vd. BOM đảo byte U+FFFE, hay backup sửa tay). ExcelJS ghi chữ của ô vào `sharedStrings.xml` qua `xmlEncode`, hàm này chỉ bỏ C0 và DEL. Kết quả: Xuất Excel báo thành công, file không phải XML hợp lệ, trình đọc chặt (saxes, chính trình ExcelJS dùng) dừng ở ký tự đó.
- **Tái hiện / bằng chứng:**
  - `node --import ./hooks.mjs p01-normalize.mjs` (`p01-normalize.log`): "(2) kept by normalizeText but not an XML 1.0 Char: 3 → 0000, FFFE, FFFF" (U+0000 đã bị `isStorableText` chặn); `normalizeText("Sao" + U+FFFF + "Mai")` giữ nguyên, `isStorableText true`.
  - `node --import ./hooks.mjs p02-excel.mjs` (`p02-excel.log`; `openAppData` web + seed demo, `createTeam` / `createPerson` qua `app.run`, `reportRows` trên `app.tables()`, `exportReport` như màn Báo cáo): đối chứng tên thường → "strict XML (saxes): well-formed", "ExcelJS reads its own file: loaded; sheet 2 "Theo team" names: ["Sao Khuê","Sao Mai","Tổng"]". Team "Sao" + U+FFFF + "Khuê", RE "Vũ" + U+FFFE + "Hai" → `export outcome {"kind":"exported","name":"bao-cao_2026-09_toan-bo_2026-09-15.xlsx"}`, "sharedStrings.xml: … raw U+FFFF/U+FFFE inside: 2", **"strict XML (saxes): error: 2:953: disallowed character."**, **"ExcelJS load threw: 2:1945: disallowed character."** Trình đọc XML thứ hai, độc lập (PowerShell, `System.Xml.XmlDocument.LoadXml` của .NET trên `xl/sharedStrings.xml` của hai file `p02-control.xlsx` / `p02-nonchar.xlsx` probe ghi ra; `p02-dotnet-xml.log`): đối chứng "loaded"; file có ký tự → **"'￿', hexadecimal value 0xFFFF, is an invalid character. Line 2, position 953."**
  - Trên màn: tên chỉ có U+FFFE được "+ Team" nhận, hiện ô vuông 9 px (`p03-render.log`, `p03-team-list.png`), tức người dùng thấy một ký tự lạ nhưng app không chặn.
- **Cùng mẫu:** `rg -n "addRow|getCell\(|\.value = " apps/desktop/src --glob "!*.test.*"` → nơi ghi xlsx duy nhất `report-workbook.ts:94`, `:98`, `:102`, `:106` (chữ người dùng ở `:94` và `:106`: tên team, RE, góc nhìn); `.p2cbackup` là JSON (U+FFFE / U+FFFF hợp lệ, p06: 28 / 28 dạng chữ nhập lại được, gồm hai ký tự này); clipboard, tiêu đề cửa sổ: không mang tên người dùng / là chuỗi thường. Chỉ có một chỗ sai.
- **Ảnh hưởng:** RE / TL xuất Báo cáo khi một tên team / RE có noncharacter (hiếm: chữ dán từ nguồn hỏng mã hóa, backup sửa tay): nhận file `.xlsx` mà trình đọc chặt từ chối; Excel nhiều khả năng báo "file có nội dung hỏng" và bỏ phần chữ khi sửa (PLAUSIBLE). Dữ liệu trong app không đổi; đổi tên team / RE là qua.
- **Chặn phát hành:** không — Low trục E (K48): đầu vào hiếm, hỏng chỉ ở file báo cáo xuất ra, không ở dữ liệu đã lưu / backup.
- **Đề xuất:** gộp với CLR6-E10 thành **một** helper ghi ô chữ Excel trong `report-workbook.ts`: bỏ (hay thay bằng U+FFFD) ký tự ngoài tập Char của XML 1.0 và escape `_xHHHH_` (cùng chỗ có thể cắt ở 32 767 ký tự, trần một ô của Excel: tên không có trần độ dài, Q10 — PLAUSIBLE, không chạy Excel); ca `report-workbook.test.ts` thêm tên có U+FFFF và đọc lại bằng ExcelJS. ≈ 5–8 dòng SP + ≈ 6 dòng test. (Hướng khác, rộng hơn: `normalizeText` bỏ cả `\p{Noncharacter_Code_Point}` — mở rộng K25, cần G2, dữ liệu cũ theo K1.)

### CLR6-H2 — Bảng Khách hàng: link tên KH chỉ mang tên, hai KH trùng tên có hai link cùng tên mở hai hồ sơ khác nhau (96 tên trên seed demo)

```
ID: CLR6-H2
Mức: Nit
Trục: A
Vị trí: apps/desktop/src/routes/customers/CustomersScreen.tsx:56-66 (cột Họ tên: `<a href={profileHref(c)} className={LINK}>{c.customer.name}</a>`, không aria-label / aria-describedby), :301 (link của danh sách nhóm đóng, cùng dạng), :201-207 (DataTable, mặc định sắp theo "since") (5b1328a)
Tình trạng: CONFIRMED
Liên quan: CLR6-E3 (a) (nút tên KH của danh sách Lịch hẹn, cùng họ), CLR6-D5, CLR6-C13, CLR6-A1; họ DR6-119 / 151 / 160 · có từ trước, lượt 1–5 bỏ sót (Bảng mở mặc định — sắp theo "since", 100 dòng đầu — không có tên trùng: `p05b-default-order.log` "100 links shown; names on 2+ profiles: 0", nên quét màn ở trạng thái mặc định, như claude D lượt 6 K20, không gặp)
```

- **Mô tả:** mỗi dòng của Khách hàng → Bảng có link tên KH mở hồ sơ; tên truy cập chỉ là tên. Tên KH Việt hay trùng (seed demo: 96 tên dùng chung trên 1 200 KH), nên danh sách link của trình đọc màn hình có các mục cùng tên mở hồ sơ khác nhau; sắp theo Họ tên thì chúng đứng liền nhau. Mã KH ở ô bên cạnh của cùng dòng (WCAG 2.4.4 mức A "theo ngữ cảnh" vẫn đạt; 2.4.9 mức AAA không). Kanban không trùng ở seed vì tên truy cập của thẻ gồm cả RE, giới tính, năm sinh; danh sách nhóm đóng (`:301`) cùng dạng chỉ-tên như Bảng.
- **Tái hiện / bằng chứng:** `node p05-customer-dup-names.mjs 4871` (`p05-customer-dup-names.log`; bản web ghim, CDP `Accessibility.queryAXTree` role link): "(a) Bảng by Họ tên: 1200 rows, 1200 links; names on 2+ links to different profiles: 96", vd. `"Bùi Hoài Việt" ×2 (#/customers/01K56KY5XXPH5CN9JSPEF9TEQC, #/customers/01K99Y7J2MTYTQVF0590D9KYQ0)`, `"Bùi Ngọc Việt" ×3`; "(b/c) N4: 6 links … Mất cơ hội: 5 links; same name, other profile: []". `p04-seed-namesakes.log`: 96 tên dùng chung, 16 tên trùng trong cùng nhóm.
- **Cùng mẫu:** `rg -n -E "\{(c|card|r|row|match|a|customer)\??\.(customer\??\.)?name\}" apps/desktop/src/routes --glob "*.tsx"` → link / nút chỉ mang tên KH: `CustomersScreen.tsx:63` (Bảng, **sai**), `:301` (nhóm đóng, **cùng dạng**, 5 dòng đầu mỗi nhóm, seed không gặp), `AppointmentsScreen.tsx:183`, `:579` (CLR6-E3 (a)); đã phân biệt: thẻ Kanban `:275` (tên + HĐ + RE + giới tính / năm sinh), danh sách "KH khớp" của 6b `AppointmentDialog.tsx:393` (tên + mã + nhóm); không phải nút / link: `CustomerProfile.tsx:159` (h1), `AppointmentDialog.tsx:341`, `ReportTable.tsx:131`.
- **Ảnh hưởng:** người dùng trình đọc màn hình duyệt danh sách link của Khách hàng → Bảng: hai mục đọc như nhau; phải đọc cả dòng để biết mã. Không sai dữ liệu.
- **Chặn phát hành:** không — Nit trục A (K48).
- **Đề xuất:** gộp với CLR6-E3 (a), D5, C13 ở tổng hợp: một khuôn cho "link / nút của dòng mang tên người", vd. `aria-describedby` trỏ ô mã của dòng, hay tên truy cập "<tên> (<mã>)" khi tên trùng trong danh sách (như `customer.withCode` của 9b / Thùng rác); một ca e2e trên seed (đã có 96 tên trùng) đòi tên truy cập khác nhau. ≈ 3–6 dòng SP + ≈ 15 dòng e2e.

### CLR6-H3 — 6c / 6f: ô ghi chú đổi từ textarea sang ô một dòng khi chọn Hủy / Không đến; ô một dòng bỏ ký tự xuống dòng, sửa ô rồi lưu thì ghi chú lưu với các dòng dính liền ("hưu tríDòng hai")

```
ID: CLR6-H3
Mức: Low
Trục: D (E)
Vị trí: apps/desktop/src/routes/appointments/OutcomeDialog.tsx:182-187 (`rows={met ? 3 : undefined}` :186; `note` :66); apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx:65 (`useState(a.note)`), :234-239 (`rows={status === 'MET' ? 3 : undefined}` :238); packages/ui/src/components/TextField.tsx:62 (`const Input = rows ? 'textarea' : 'input'`); lệnh lưu chữ như gõ: packages/db/src/common.ts:75-78 (`optionalText`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: K33 (4) / T-291 (chữ tùy chọn của lịch hẹn lưu như gõ) · có từ trước, lượt 1–5 bỏ sót. S1 (S1-1) và S2 (S2-1) cùng tìm, độc lập; phiên chính chạy lại hai probe trên bản ghim của mình
```

- **Mô tả:** ô Ghi chú của 6c / 6f là `textarea` 3 dòng khi trạng thái Đã gặp, và `<input>` một dòng khi Hủy / Không đến (nhãn "Ghi chú"). State của ô vẫn giữ chữ cũ có LF, nhưng `<input>` theo luật làm sạch giá trị của HTML bỏ hẳn LF (không thay bằng dấu cách), nên ô hiện các dòng dính liền. Không đụng vào ô thì vẫn lưu chữ có LF (khác chữ ô đang hiện); gõ thêm một ký tự thì `onChange` lấy giá trị đã dính của ô, và lệnh lưu đúng chữ đó (`optionalText` chỉ `trim`). Hai đường: 6f sửa kết quả một cuộc gặp Đã gặp có ghi chú nhiều dòng thành Hủy / Không đến; 6c gõ ghi chú nhiều dòng rồi đổi ý sang Không đến.
- **Tái hiện / bằng chứng** (bản ghim `dist-base`, 127.0.0.1:4871; dữ liệu qua giao diện):
  - `node ..\s1\p1-notes.mjs 4871` chạy ở `H\v\` (`v-s1-p1-notes.log`): 6c Đã gặp, ghi chú 3 dòng → "A7 6f after status → Hủy, note field {"tag":"INPUT","value":"Dòng một: KH quan tâm hưu tríDòng hai: vợ làm giáo viênDòng ba: …"} visible text width {"scroll":552,"client":396}"; "A8 … saved without touching note" → chi tiết vẫn ba dòng; "A9 after typing at the end … (sửa)" → **"A10 detail Ghi chú after the edit (stored) "Dòng một: KH quan tâm hưu tríDòng hai: vợ làm giáo viênDòng ba: hẹn gặp cả hai vợ chồng (sửa)""**; "A11 6b history row (CANCELLED, after edit)" hiện đúng chữ dính đó.
  - `node ..\s1\p1d-6c-switch.mjs 4871` (`v-s1-p1d.log`): 6c Đã gặp gõ hai dòng → Không đến → gõ " gấp" → "stored note … "Dòng một: KH quan tâm hưu tríDòng hai: vợ làm giáo viên gấp""; đối chứng dán thật (`insertText`) hai dòng vào ô một dòng → "Dán dòng A Dán dòng B" (dán thì trình duyệt đổi LF thành dấu cách; chỉ giá trị lấy từ state mới bị bỏ LF).
  - S2 `s2\p10-6c-switch.log`: 6c "KH đi công tác⏎hẹn lại sau" → Hủy → gõ "." → lưu "KH đi công táchẹn lại sau."; 6f "Chị Lan⏎vợ anh Hùng" → Không đến → "Chị Lanvợ anh Hùng".
- **Cùng mẫu:** `rg -n "rows=\{" apps/desktop/src packages/ui/src` → chỉ `OutcomeDialog.tsx:186` và `EditOutcomeDialog.tsx:238` đổi kiểu ô theo trạng thái; các `rows` khác cố định (`KycDialogs.tsx:302`, `KycWebSession.tsx:138`, `:154`). Ô một dòng nạp chữ đã lưu: Mô tả trigger (`AppointmentDialog.tsx:87` ở 6h, `EditOutcomeDialog.tsx:70`), Việc tiếp theo (`MetFields.tsx:34`): chỉ có LF khi chữ đến từ backup sửa tay (`backup-validation.ts:104-110` nhận mọi chữ `optionalText` giữ), cùng cơ chế, không dựng.
- **Ảnh hưởng:** RE sửa một cuộc gặp đã ghi Đã gặp thành Hủy / Không đến (hay đổi ý trong 6c) rồi sửa ghi chú: ghi chú đã lưu mất xuống dòng, từ cuối dòng dính từ đầu dòng sau. Người dùng thấy chữ dính trong ô trước khi lưu, nhưng ô một dòng chỉ hiện một phần (552 / 396 px).
- **Chặn phát hành:** có (đề xuất) — Low; theo §L6.1 / K48 "Low có hậu quả lên dữ liệu đã lưu … xếp D": chữ người dùng đã lưu bị đổi ngoài ý. Nếu tổng hợp xếp E (thấy được trước khi lưu, đường ít gặp) thì không chặn.
- **Đề xuất:** ô ghi chú của 6c / 6f luôn là `textarea` (2 dòng khi không phải Đã gặp), hoặc giữ `textarea` khi chữ đang có LF (`rows={met || note.includes('\n') ? 3 : undefined}`); một ca e2e: Đã gặp có ghi chú hai dòng → 6f Hủy → gõ thêm → lưu → chi tiết còn hai dòng. ≈ 2–4 dòng SP + ≈ 20 dòng e2e.

### CLR6-H4 — Dòng thời gian gộp các dòng của ghi chú cuộc gặp thành một dòng không dấu ngăn; khung Chi tiết của Lịch hẹn và ghi chú KYC cùng dòng thời gian giữ xuống dòng

```
ID: CLR6-H4
Mức: Low
Trục: E (C)
Vị trí: apps/desktop/src/routes/customers/CustomerKyc.tsx:218-224 (`meetingText`), :321 (`<span className="flex flex-wrap items-baseline gap-x-2 wrap-anywhere text-fg-2">`, không `whitespace-pre-line`); đối chiếu apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:679 và apps/desktop/src/routes/customers/KycExtraction.tsx:124 (cả hai `whitespace-pre-line`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: K33 (4) / T-291 · có từ trước. S1 tìm (S1-2); phiên chính chạy lại probe
```

- **Mô tả:** ghi chú cuộc gặp nhiều dòng (textarea 3 dòng của 6c / 6f) hiện ở Dòng thời gian của hồ sơ KH như một đoạn: các dòng chỉ cách nhau một dấu cách, không dấu chấm / ngăn, đọc thành câu dính ("… quan tâm hưu trí Dòng hai: …"). Cùng chữ hiện đủ dòng ở khung Chi tiết của Lịch hẹn; ghi chú KYC trong cùng Dòng thời gian giữ xuống dòng.
- **Tái hiện / bằng chứng:** `v-s1-p1-notes.log`: "A5 timeline meeting line {"text":"Dòng một: KH quan tâm hưu trí Dòng hai: vợ làm giáo viên Dòng ba: … · việc tiếp theo: …","ws":"normal"}"; "A5b timeline KYC note (compare) {"text":"KYC dòng một\nKYC dòng hai","lines":2,"ws":"pre-line"}"; "A2 detail Ghi chú (MET) {"text":"Dòng một: …\nDòng hai: …\nDòng ba: …","ws":"pre-line"}".
- **Cùng mẫu:** `rg -n "whitespace-pre-line" apps/desktop/src packages/ui/src` → chỉ `AppointmentsScreen.tsx:679`, `KycExtraction.tsx:124`. Các chỗ cố ý một dòng (đúng mockup "ghi chú dài cắt 1 dòng", "mỗi lần một dòng"): thẻ Lịch hẹn của hồ sơ (`CustomerAppointments.tsx:142`, `line-clamp-1`), "Các lần hẹn trước" của 6a / 6b (`truncate`). Chỉ Dòng thời gian hiện đủ chữ mà mất dòng.
- **Ảnh hưởng:** người xem hồ sơ KH đọc ghi chú cuộc gặp nhiều dòng (danh sách ý, nội dung trao đổi) thành một đoạn dính. Không sai dữ liệu.
- **Chặn phát hành:** không — Low trục E, chỉ sai hiển thị (K48).
- **Đề xuất:** bọc phần ghi chú của `meetingText` trong một khối `whitespace-pre-line` (giữ "· việc tiếp theo" và nút "Hẹn tiếp" như nay). ≈ 1–3 dòng SP; một ca e2e đọc `innerText` của mục.

### CLR6-H5 — Tooltip của chart Tổng quan (góc nhìn Team): tên team từ ~30 ký tự làm tooltip lật sang trái, ra ngoài mép cửa sổ, che mất nhãn nhóm N4…N1 / Tổng

```
ID: CLR6-H5
Mức: Low
Trục: E (A)
Vị trí: apps/desktop/src/routes/overview/stage-chart.ts:67-90 (tooltip `trigger: 'axis'`, tiêu đề `t('overview.stages.team', { name: chart.team })` :75-79, dòng `row` :55-57 flex hai đầu); packages/ui/src/components/chart-theme.ts:51-55 (tooltip của theme, không `confine`); ECharts 6.1.0 (tooltip HTML mặc định `white-space: nowrap`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: họ DR6-117 / 148 / 170 (đường vào mới: tooltip ECharts, ca quét `e2e/long-names.spec.ts:357` không rê chuột) · có từ trước. S1 tìm (S1-3); phiên chính chạy lại probe
```

- **Mô tả:** tooltip không xuống dòng và không giới hạn trong khung chart. Bề rộng theo tiêu đề "Team <tên> · …"; chart của một team hẹp (≈ 250–370 px) nên ECharts đặt tooltip bên trái con trỏ, phần trái (tên nhóm, "Tổng", đầu tiêu đề) nằm ngoài mép trái cửa sổ, chỉ còn cột số. Trang không cuộn ngang nên ca quét tên dài không bắt.
- **Tái hiện / bằng chứng:** `node p2c-threshold-4871.mjs` (bản của `s1\p2c-threshold.mjs`, chỉ đổi cổng; `H\v\v-s1-p2c.log`; đổi tên team "Bình Minh" qua 9c, Tổng quan góc nhìn Team, Lọc, rê chuột lên cột): "name 30 chars @1100 chart x 271..525 [… "L -81 R 378 W 459 OUT"]", "name 30 chars @1440 … ["L -165 R 295 W 460 OUT","L -25 R 435 W 460 OUT"]"; 45 / 60 / 80 ký tự: L −183 … −530, luôn OUT. S1 `s1\p2d-seed.log`: tên seed (≤ 9 ký tự) L ≥ 3, không ra ngoài; `s1\p2b-shot.log` + `p2b-tooltip-1440.png`: nhãn "N4" ở x −1092…−1057, số "132" ở x 259…284 (tên 160 ký tự).
- **Cùng mẫu:** `rg -n "tooltip|formatter" apps/desktop/src packages/ui/src --glob "!*.test.*"` → tooltip ECharts duy nhất của app là `stage-chart.ts:67`; chart Toàn bộ không có tên team trong tiêu đề.
- **Ảnh hưởng:** RE / TL rê chuột lên chart của một team tên dài vừa phải (≥ ~30 ký tự, vd. "Phát triển Khách hàng Miền Nam") ở Tổng quan → không thấy số nào của nhóm nào. Bảng số ẩn của chart vẫn đọc được bằng trình đọc màn hình. Không sai dữ liệu.
- **Chặn phát hành:** không — Low trục E, chỉ hiển thị (K48).
- **Đề xuất:** `confine: true` cho tooltip ở theme (`chart-theme.ts`) và `extraCssText` cho phép xuống dòng (`white-space: normal; max-width: …; overflow-wrap: anywhere`); ca e2e rê chuột lên chart team có tên 30–60 ký tự, đòi hộp tooltip nằm trong cửa sổ. ≈ 3 dòng SP + ≈ 20 dòng e2e.

### CLR6-H6 — 6c / 6f: lệnh từ chối (vd. `INVALID_TEXT` khi dán NUL / nửa surrogate) hiện ở khung đầu hộp đang cuộn, ngoài vùng nhìn sau khi bấm Lưu; câu không nói ô nào, không ô nào `aria-invalid`

```
ID: CLR6-H6
Mức: Low
Trục: A (E)
Vị trí: apps/desktop/src/routes/appointments/EditOutcomeDialog.tsx:112 (`setFailure(errorMessage(error))`), :151 (`FailureAlert` đầu hộp); apps/desktop/src/routes/appointments/OutcomeDialog.tsx:109, :132; apps/desktop/src/routes/customers/CustomerDialogs.tsx:94-100 (`FailureAlert`: `<p role="alert">`, không cuộn vào tầm nhìn, không nhận focus); apps/desktop/src/i18n/vi.ts:1297 (`error.INVALID_TEXT`, không nêu ô); packages/db/src/common.ts:49-52 (`storable`) (5b1328a)
Tình trạng: CONFIRMED (INVALID_TEXT); PLAUSIBLE (các câu từ chối khác của lệnh trong 6c / 6f, cùng chỗ hiện, chưa dựng)
Liên quan: DR6-109 (đường gửi chữ gốc tới lệnh) · có từ trước. S2 tìm (S2-2); phiên chính chạy lại ba probe
```

- **Mô tả:** 6c (khi có "Hẹn lần tiếp theo") và 6f cao hơn khung nhìn nên thân hộp cuộn; nút Lưu ở chân hộp. Lệnh từ chối thì câu lỗi vào `FailureAlert` ở đầu hộp, nằm ngoài phần đang thấy; focus ở lại nút Lưu, không gì cuộn. Với `INVALID_TEXT` (một trong 2–3 ô chữ tự do có NUL hay nửa surrogate, thường do dán; NUL trông như khoảng trống), câu lỗi không nói ô nào và không ô nào được đánh dấu. Người dùng sáng mắt bấm Lưu mà không thấy gì xảy ra; trình đọc màn hình có đọc (`role="alert"`) nhưng không biết sửa ô nào.
- **Tái hiện / bằng chứng** (bản ghim, cổng 4871; bản chép `s2\kit.mjs` chỉ đổi cổng, `H\v\`):
  - `node p08-alert-view.mjs` (`v-s2-p08.log`): 6f 1440×900, NUL trong Mô tả trigger, Lưu → `{"viewport":900,"dialog":{"top":17,"bottom":883},"dialogScrollTop":210,"dialogScrollHeight":1074,"alert":{"top":-126,"bottom":-71},"alertText":"Chữ có ký tự không lưu được (ký tự NUL hoặc ký tự hỏng khi dán): xóa ký tự đó rồi lưu lại.","active":"Lưu"}`, "alert in view (inside the dialog box)? false".
  - `node p12-alert-6c.mjs` (`v-s2-p12.log`): "1280x720 6c … alert {"top":-102,"bottom":-47} … "invalid":[] alert in view? false"; "1440x900 6c + Hẹn lần tiếp theo … {"top":-96,"bottom":-41} … false".
  - `node p09-dialog-heights.mjs` (`v-s2-p09.log`): 6f 1 007 / 864 (1440×900), 1 007 / 684 (1280×720); 6c + hẹn tiếp 925 / 864; 6c Đã gặp 772 / 684 (1280×720); 5a, 6a không cuộn.
  - S2 `s2\p07-invalid-text.log`: NUL và nửa surrogate cao ở Mô tả trigger → cùng một câu, "fields marked invalid []".
- **Cùng mẫu:** `rg -n "failure && <FailureAlert" apps/desktop/src/routes` → 6a / 6b, 6c, 6e, 6f, hộp khách hàng / KYC / HĐ / Team; chỉ 6c và 6f vừa nhiều ô chữ vừa cuộn được (`p09`). Hộp một ô chữ (5a, 9a, 7a ghi chú, 6a, 6e) không cuộn ở 1280×720 / 1440×900: khung lỗi trong tầm nhìn. 9c và Giá trị 7a báo dưới ô.
- **Ảnh hưởng:** RE dán chữ hỏng (hiếm) vào một ô của 6c / 6f, hay gặp bất kỳ câu từ chối nào của lệnh khi hộp đang cuộn (PLAUSIBLE): bấm Lưu không thấy phản hồi, không biết ô nào sai. Không sai dữ liệu (lệnh từ chối, DB không đổi).
- **Chặn phát hành:** không — Low trục A / E (K48).
- **Đề xuất:** `FailureAlert` cuộn vào tầm nhìn / nhận focus khi hiện (một chỗ cho mọi hộp); với `INVALID_TEXT`, UI kiểm `isStorableText` từng ô trước khi gọi lệnh và báo dưới đúng ô (như 9c). ≈ 10–15 dòng SP + 1 ca e2e.

### CLR6-H7 — Chữ tùy chọn của lịch hẹn giữ U+2028 / U+2029 / U+0085 / VT / FF như gõ, nhưng không màn nào hiện chúng thành xuống dòng; VT / FF / U+0085 vẽ thành ký hiệu

```
ID: CLR6-H7
Mức: Nit
Trục: E (C)
Vị trí: packages/db/src/common.ts:75-78 (`optionalText`: chỉ `trim`); apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:679 (`whitespace-pre-line` chỉ ngắt ở LF); đối chiếu packages/domain/src/text.ts:45 (`LINE_BREAK` của ghi chú KYC: CR, LF, VT, FF, U+0085, U+2028, U+2029) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: K33 (4), (7) / T-291 (chữ lịch hẹn lưu như gõ; ghi chú KYC coi VT / FF là xuống dòng) · có từ trước. S1 tìm (S1-5); phiên chính chạy lại probe
```

- **Mô tả:** ghi chú KYC đổi mọi ký tự ngắt dòng của `LINE_BREAK` thành LF khi lưu; ghi chú / Việc tiếp theo / Mô tả trigger / lý do dời của lịch hẹn giữ chúng nguyên chữ (đúng quyết định "như gõ"), nhưng màn chỉ ngắt ở LF: U+2028 / U+2029 thành dấu cách, VT / FF / U+0085 thành một ký hiệu rộng hơn dấu cách. Cùng một đoạn dán từ một nguồn dùng U+2028 hiện nhiều dòng ở ghi chú KYC, một dòng ở ghi chú cuộc gặp.
- **Tái hiện / bằng chứng:** `node ..\s1\p1b-chars.mjs 4871` (`v-s1-p1b.log`): "pre-line LF width 59.8 lines 2", "pre-line U+2028 width 121.2 lines 1", "pre-line U+0085 width 125.0 lines 1", "pre-line FF width 130.1 lines 1" (dấu cách 121.2); `v-s1-p1-notes.log`: "A13 detail Ghi chú (RESCHEDULED, the reason) "KH đi công tác<U+2028>Đà Nẵng<U+0085>tuần sau"", "A14 timeline rescheduled line … lines 1"; ảnh FF của S1 `s1\p1c-glyph.png`.
- **Cùng mẫu:** mọi chỗ hiện chữ tùy chọn của lịch hẹn (CLR6-H4 Cùng mẫu): không chỗ nào tách dòng theo `LINE_BREAK`.
- **Ảnh hưởng:** chỉ khi dán chữ có các ký tự ngắt dòng hiếm này. Không sai dữ liệu.
- **Chặn phát hành:** không — Nit (K48).
- **Đề xuất:** sau v1.0: khi hiện, tách dòng bằng `LINE_BREAK` của `domain` (không đổi chữ đã lưu, giữ T-291); gộp với CLR6-H4. ≈ 3–5 dòng SP.

### Bổ sung vị trí cho phát hiện đã báo (không đếm lại)

- **CLR6-F2** (thân `Dialog` không ngắt chữ, `packages/ui/src/components/Dialog.tsx:90`): F2 ghi 9a–9d đã đo không tràn ở nhánh thường; nhánh lỗi / gợi ý mang tên người dùng cũng tràn. S1 tìm (S1-4), phiên chính chạy lại `node ..\s1\p3-dialogs.mjs 4871` (`H\v\v-s1-p3.log`, cửa sổ 1 100, trang 1 100 / 1 100 ở mọi ca): 9a `TEAM_HAS_LEAD` với TL 160 ký tự "dialog 1151/446 SCROLLS … p.m-0.rounded-md.border.px-3 1134/412" (`PersonDialogs.tsx:142-145`); 9c `TEAM_NAME_TAKEN` với team 160 ký tự "dialog 1010/446 SCROLLS … div.flex.flex-col.gap-1 994/414" (lỗi dưới ô, `TeamDialogs.tsx:27`, `TextField.tsx` ghi chú `text-xs`); 9b khi KH đã xóa tên 81 ký tự còn dùng nhân sự "dialog 519/446 SCROLLS … span.text-xs.text-fg-3 503/414" (`PersonDialogs.tsx:229-233`, `person.inUseTrash`). 5f, 11i: 446 / 446. Cách sửa của F2 (ngắt chữ cho cả thân hộp) đóng luôn ba chỗ này; ca e2e của F2 nên đo cả nhánh lỗi.

## 6. Bloat / Hiệu năng

Không bắt buộc ở chủ đề H (Phụ lục W quy tắc riêng 8; bloat của diff là chủ đề G). Số đo của chủ đề: K7 (ghi chú 190 000 ký tự: `normalizeNote` 3,4 ms, Mock trích xuất 4,7 ms, `searchText` 5,6 ms, tuyến tính); K1 (5,56 triệu lần `normalizeText` trong 1,9 s). Không phát hiện P / B.

## 7. Bảng đếm mức × trục

Mỗi phát hiện đếm một lần ở trục đầu.

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | 0 |
| Low | 3 (H1, H4, H5) | | 1 (H3) | | | | | | 1 (H6) | 5 |
| Nit | 1 (H7) | | | | | | | | 1 (H2) | 2 |
| **Tổng** | 4 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 2 | **7** |

- **Chặn phát hành (đề xuất, K48): 1 / 7** — CLR6-H3 (Low, trục D theo câu "Low có hậu quả lên dữ liệu đã lưu … xếp D" của §L6.1: ghi chú cuộc gặp lưu với các dòng dính liền sau khi đổi Đã gặp → Hủy / Không đến và sửa ô). Nếu tổng hợp xếp E (người dùng thấy chữ dính trong ô trước khi lưu) thì 0 / 7. **Không chặn: 6.**
- **CONFIRMED 7 / 7**; hai phần PLAUSIBLE ghi rõ trong phát hiện: Excel thật xử file của CLR6-H1 thế nào (không chạy Excel), các câu từ chối khác của CLR6-H6 (chưa dựng). KNOWN có bằng chứng mới: 0. Tỉ lệ PLAUSIBLE thấp.
- **Có từ trước, lượt 1–5 bỏ sót: 7 / 7**; mới do đợt sửa sau lượt 5: 0.
- **Ai tìm:** phiên chính CLR6-H1, H2; S1 CLR6-H4, H5, H7 và vị trí bổ sung của CLR6-F2; S1 + S2 (độc lập) CLR6-H3; S2 CLR6-H6. Mọi phát hiện của subagent đã được phiên chính đọc lại code và chạy lại probe trên bản ghim (mục 1).
- **Họ lỗi của chủ đề:** "hỏi trống bằng `trim()`" (DR6-150 → 173) không tái phát: 14 / 14 chỗ màn hỏi trống qua `normalizeText` / `normalizeNote`, 9 / 9 đột biến `.ts` bị giết (Q1, K10). "Chuỗi liền dài" còn hai đường mới: tooltip chart (CLR6-H5), nhánh lỗi / gợi ý trong hộp (bổ sung CLR6-F2). "Tên truy cập trùng": thêm Bảng Khách hàng (CLR6-H2).

## 8. Đã xét, không thấy (theo trục)

- **E:** mọi code point qua `normalizeText` (K1: bất biến, chỉ giữ U+FFFE / U+FFFF / noncharacter → CLR6-H1); noncharacter hiện thành ô vuông, không phải "tên không thấy gì" (K3); 28 dạng chữ khứ hồi (K6); chữ rất dài (K7); giá trị KYC liền dài 163 ký tự ở hồ sơ (K11); ma trận 11 ô × 14 dạng của S2 (K17); chuỗi liền dài ở chữ lịch hẹn không cuộn trang (S2 `p13`); 5f, 11i với tên 81 ký tự 446 / 446 (K16). Danh sách "KH khớp" của 6b dừng ở 6 kết quả, không nói còn nữa (`AppointmentDialog.tsx:39`, `:335`): spec / mockup 6b không vẽ danh sách này, gõ thêm thì lọc lại — không ghi. Chữ RTL: ký tự điều khiển hướng (`\p{Cf}`) bị `normalizeText` bỏ; thứ tự hiển thị khi tên có chữ RTL cạnh số không xét (đầu vào rất hiếm). Tên chứa " · " đọc lẫn với dấu nối của `joinParts` (K8): vốn có, không ghi.
- **C:** hỏi trống, so, tìm, sắp đều qua hàm của `domain` (Q1–Q4); `fillSlots` một lượt (K8); 7c nhận "kỹ sư" / "Kỹ sư" là hai giá trị (mâu thuẫn được) trong khi panel trích xuất ẩn đề xuất chỉ khác hoa / thường: hai luật cho hai việc (lưu dữ kiện / ẩn đề xuất), đúng doc của `comparable`, không ghi; chữ xác nhận 10c / 11i so NFC theo D1 (gói E đã thử). Ngoài CLR6-H4, H7 không thấy.
- **D:** lệnh và luật nhập cùng hàm chữ, 28 / 28 khứ hồi giữ nguyên tên, chữ lịch hẹn, ghi chú và giá trị KYC (K6, Q2); không trần độ dài nào lệch giữa lệnh và luật nhập (Q10); không chỗ nào gộp số liệu theo tên (Q5). Ngoài CLR6-H3 không thấy.
- **G:** ghi chú KYC gửi AI đã chuẩn hóa; V7 so trên ghi chú chuẩn hóa; giá trị đề xuất qua `normalizeKycValue` trước khi tới panel (K21: S2-3 không đi tới được); tin nhắn ChatGPT web không mang tên KH. Không thấy.
- **S:** 0 sink HTML, tooltip chart qua `encodeHtml` (K9); Excel chỉ ô chuỗi, không công thức (gói E S2-K5); tên file xuất ASCII, tên backup cố định (Q11); NUL / nửa surrogate bị lệnh chặn ở mọi ô (K17). Ngoài CLR6-H1 (xếp E) không thấy.
- **P:** K7, K1. Không phát hiện.
- **B:** `collapseSpaces` (giữ đầu / cuối và hoa thường, dùng `\s`) và `normalizeText` là hai hợp đồng khác nhau, không gộp được; ma trận ký tự vô hình chép ở nhiều test là CLR6-G3. Không ghi.
- **T:** 9 / 9 đột biến `.ts` của họ "trống / so chữ" bị giết (K10); chỗ `.tsx` hỏi trống có ca e2e chữ vô hình (6b, 6c, 6e, 8a, ô KH), riêng tên 5a / 5c và giá trị / ghi chú 7a / 7c không có ca chữ chỉ vô hình nhưng lệnh vẫn chặn — không chạy đột biến TSX, không ghi.
- **A:** tên truy cập trùng ngoài CLR6-H2 đã có ở CLR6-A1, C13, D5, D13, E3, F1 (Q8); noncharacter hiện thấy được (K3). Ngoài CLR6-H2, H6 (và vế A của H5) không thấy.

## 9. Phụ lục

### 9.1 Probe, log của phiên chính (mọi file ở `C:\workspace\deep-review-1-6-r6\claude\H\`)

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `r5copy\*` | 9 file của Claude E lượt 5 chép theo tên đủ từ `deep-review-1-6-r5\claude\E\` (`Test-Path` từng tên, không liệt kê thư mục): `build-dist`, `serve-dist`, `pw.config`, `browser`, `hooks`, `ui-stub`, `mutjs`, `mutant-config`, `mut-list` | — | gốc của các bản dưới |
| `hooks.mjs`, `ui-stub.mjs` | loader TS cho probe Node (`.ts`, import không đuôi, `?raw`), `@p2c/ui` thay bằng stub | — | mọi probe Node |
| `build-dist.mjs`, `serve-dist.mjs`, `browser.mjs` | bản web ngoài repo `dist-base` (neo 15/09/2026), `vite preview` 127.0.0.1:4871, Edge chặn mạng ngoài 127.0.0.1 + thay `window.open` / clipboard | `build-base.log`, `serve-4871.log` | mọi probe màn |
| `p01-normalize.mjs` | mọi code point qua `normalizeText` (5 ngữ cảnh), ký tự XML cấm, noncharacter, `searchText` | `p01-normalize.log` | K1, CLR6-H1 |
| `p02-excel.mjs` | team / RE có U+FFFF / U+FFFE → `reportRows` → `exportReport`; saxes, ExcelJS đọc lại; ghi `p02-control.xlsx`, `p02-nonchar.xlsx` | `p02-excel.log`, `p02-dotnet-xml.log` (PowerShell `XmlDocument.LoadXml`) | K2, K2b, CLR6-H1 |
| `p03-render.mjs` | bề rộng noncharacter trên Edge; "+ Team" tên chỉ có U+FFFE | `p03-render.log`, `p03-team-list.png`, `p03-team-heading.png` | K3 |
| `p04-seed-namesakes.mjs` | KH / nhân sự trùng tên trong seed demo | `p04-seed-namesakes.log` | K4 |
| `p05-customer-dup-names.mjs`, `p05b-default-order.mjs` | tên truy cập link mở hồ sơ ở Bảng / Kanban / nhóm đóng (CDP) | `p05-customer-dup-names.log`, `p05b-default-order.log` | K5, K5b, CLR6-H2 |
| `p06-roundtrip.mjs` | 28 dạng chữ × 8 lệnh → backup → nhập | `p06-roundtrip.log` | K6 |
| `p07-long-note.mjs` | chữ rất dài | `p07-long-note.log` | K7 |
| `p08-slots.mjs` | `t` / `fillSlots` / `errorMessage` / `joinParts` với chữ có `{…}`, `$…` | `p08-slots.log` | K8 |
| `p09-long-kyc-value.mjs` | giá trị KYC liền dài qua 7a | `p09-long-kyc-value.log`, `p09-*.png` | K11 |
| `mut-list.mjs`, `mutjs.mjs`, `mutant-config.mjs` | 9 đột biến vitest qua hook `load` | `mutjs.log`, `mut\<id>.out` | K10 |
| `v\` | chạy lại probe của S1 / S2 trên cổng 4871 (`p2c-threshold-4871.mjs`, `kit.mjs` chỉ đổi cổng; `p08`, `p09`, `p10`, `p12` chép nguyên) | `v-s1-p1-notes.log`, `v-s1-p1d.log`, `v-s1-p1b.log`, `v-s1-p2c.log`, `v-s1-p3.log`, `v-s2-p08.log`, `v-s2-p09.log`, `v-s2-p12.log` | CLR6-H3…H7, F2 bổ sung |

### 9.2 Probe của subagent

- **S1** (`H\s1\`): `p1-notes.mjs`, `p1b-chars.mjs`, `p1c-glyph.mjs`, `p1d-6c-switch.mjs`, `p2-tooltip.mjs`, `p2b-shot.mjs`, `p2c-threshold.mjs`, `p2d-seed.mjs`, `p3-dialogs.mjs` (+ `p2-dbg.mjs`, `fixesc.cjs` gỡ lỗi); log cùng tên, ảnh `p1-end.png`, `p1c-glyph.png`, `p2-*-1100.png`, `p2b-tooltip-1440.png`, `p3-11i.png`.
- **S2** (`H\s2\`): `kit.mjs`, `p00`…`p13` (`.mjs`); log `p01-customer.log`, `p02-render.log`, `p03-team-person.log`, `p04a-appointments.log`, `p04-appointments.log`, `p05-kyc.log`, `p06-search.log`, `p07-invalid-text.log`, `p08-alert-view.log`, `p09-dialog-heights.log`, `p10-6c-switch.log`, `p11-held.log`, `p12-alert-6c.log`, `p13-long-text.log`; ảnh `p02-*.png`, `p07-*.png`, `p08-6f-after-save.png`, `p13-*.png`.

### 9.3 Đột biến (`mutjs.log`)

Đối chứng: 189 / 189 test của các file nhắm xanh. 9 đột biến, **9 KILLED** ngay ở file nhắm, 0 sống: `HM1-reschedule-reason`, `HM2-parse-time`, `HM3-case-size`, `HM4-next-step`, `HM5-birth-date`, `HM6-optional-text`, `HM7-held-case`, `HM8-held-spacing`, `HM9-too-short`. Repo không ghi: "repo git status --short after: """ sau mỗi đợt.

### 9.4 Cuối phiên

- Repo chỉ đọc: mọi đột biến qua hook `load`, mọi bản dựng / kết quả Playwright / file `.xlsx` ghi dưới `claude\H\`; không chạy `pnpm`, không chạy công cụ gọi `gh`, không gọi dịch vụ AI; mọi probe trình duyệt 0 request ra ngoài 127.0.0.1 ("requests blocked [] / blocked []" ở mọi log).
- Server 4881 (S1), 4891 (S2) đã tắt khi subagent xong; server 4871 của phiên chính tắt cuối phiên.
- Chỉ mở theo tên đủ: `common\{prompt-claude.md, plan.md, known.md}` (`plan.md` §4, §L6.0–§L6.8; `known.md` phần 1–3, đoạn "Rà sổ G7" dài 54 908 ký tự chỉ đọc phần đầu); `common\{fixes.md, baseline.md, files-A…F.txt}` chỉ kiểm cỡ bằng `Get-Item` (chủ đề H không làm bảng R; không dùng số đo hay dữ liệu tải), báo cáo lượt 6 của Claude `claude\{A…G}.md` (bước 0 đọc dòng đầu; đọc các phát hiện liên quan), 9 file của `deep-review-1-6-r5\claude\E\` theo tên mà báo cáo gốc lượt 5 ghi. Không liệt kê / tìm kiếm thư mục `deep-review-*` nào.
- `git rev-parse HEAD` cuối phiên: `5b1328ae236aa62981dbf43066ff544a9e832c8c`; `git status --short` cuối phiên: rỗng.
- Giờ xong: xem dòng đầu.
