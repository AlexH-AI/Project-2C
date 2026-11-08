XONG — workbuddy gói A lượt 6, 00:11 08/11/2026

# Báo cáo deep review Phase 1–6, lượt 6 — gói A (Lõi dữ liệu), bên workbuddy

## 1. Bên, gói, môi trường

- **Bên / gói:** workbuddy, gói **A — Lõi dữ liệu** (`packages/domain/**`, `packages/db/**`). Reviewer độc lập, chỉ đọc (ADR-0001 phụ lục M13); không làm bảng R1 / R2 (mọi dòng R là KNOWN theo `common\known.md` phần 4, 5).
- **SHA đầu phiên:** `5b1328ae236aa62981dbf43066ff544a9e832c8c` (`git rev-parse HEAD`), đúng SHA ghim `5b1328a` của `common\prompt-workbuddy.md` / `common\baseline.md`.
- **`git status --short` đầu phiên:** rỗng (không có dòng nào; `common\baseline.md` ghi các file app tự tạo của phiên thử đã dọn, `workbuddy\` rỗng).
- **Giờ bắt đầu:** 23:44 07/11/2026; **giờ xong:** 00:11 08/11/2026 (máy `DESKTOP-KDURKJP`, Home PC, GMT+7).
- **Công cụ:** app desktop WorkBuddy bản quốc tế (lượt 5: v5.9.4 theo `common\plan.md` §L6.7; `common\baseline.md` lượt 6 ghi Owner đã đăng xuất app lúc ≈ 11:02 07/11 và không ghi số bản mới — không đọc thư mục dữ liệu của app). Shell Git Bash / PowerShell của app, công cụ đọc / ghi file, công cụ Agent phụ (4 việc, mỗi việc kèm nguyên văn quy tắc riêng 2–5, 8 và quy tắc chung 1, 2, 7; không agent phụ nào ghi `A.md`).
- **Expert:** `CodeReviewExpert` (đã chọn trong phiên; tên theo phiên thử ở `common\baseline.md`, mã không thấy).
- **Model:** **Hy4** — Owner chọn cho gói A–F lúc ≈ 23:35 07/11 (`common\baseline.md`, mục "Ghi chú của Claude sau phiên thử"; §L6.7 chốt hai lựa chọn Hy4 / GLM 5.3). Ghi thêm để đối chiếu, theo bài học phiên thử (tên model tự ghi không khớp giao diện): ngữ cảnh phiên hiện ghi `claude-opus-6`, định danh hệ thống là WorkBuddy AI / Tencent Hunyuan Hy; không đọc được giao diện app nên không khẳng định thêm.
- **Context:** không thấy trong ngữ cảnh phiên (phiên thử ở `common\baseline.md` cũng ghi "không thấy"); không đọc thư mục dữ liệu app.
- **Mức suy luận:** không thấy trong ngữ cảnh phiên (phiên thử cũng ghi "không thấy"); chạy ở mức mặc định của phiên này.
- **Bản Node đã dùng:** `v24.20.0` — lệnh đầu phiên có `export PATH="/c/Program Files/nodejs:$PATH"` rồi `node --version` in `v24.20.0` (≥ 24). Node trần của shell là v22.22.2 theo phiên thử, nên mọi lệnh có `node` / vitest / Playwright / `pnpm` đều đặt PATH ngay trong lệnh. Không chạy Playwright / `pnpm` trong phiên này.
- **Chế độ quyền của app:** không đổi so với đầu phiên (Default theo phiên thử); không cài skill, không dùng connector, không mạng ngoài, không `gh`, không đọc thư mục cấm.

## 2. Bảng R1 / R2

Không áp dụng: theo `common\prompt-workbuddy.md` (Việc của gói mục 1) và `common\known.md` phần 4, 5, **Codex, agent WorkBuddy và Claude G–I không làm bảng R**; mọi dòng R1 (DR6-158…177) và R2 (T-371…T-384) là KNOWN. Gói A của workbuddy chỉ tìm lỗi mới và edge case mới. Các phát hiện dưới đây có "Liên quan" tới DR6-xx / T-xxx nhưng là biến thể / vùng chưa được sửa, không phải dòng R.

## 3. Phạm vi đã đọc

### Diff `37a80b6..5b1328a` của gói A

`git -C C:\workspace\Project-2C-review diff --stat 37a80b6 5b1328a -- packages/domain packages/db` → **14 file, +224 / −31** (sản phẩm: `packages/db/src/backup-validation.ts`, `common.ts`, `customers.ts` (chỉ comment), `trash.ts`, `packages/domain/src/index.ts`, `text.ts`; tài liệu `packages/domain/CLAUDE.md`; 7 file test). Bản diff đầy đủ lưu ở `workbuddy\A\diff-A.diff` (489 dòng), đã đọc hết. Commit của gói A (`git log --oneline 37a80b6..5b1328a -- packages/domain packages/db`): `75601dc` (T-363, PR #1063), `e9f2eb1` (T-368, PR #1072), `20c51e3` (T-377, PR #1088).

Thay đổi sản phẩm đọc kỹ nhất:
- `packages/db/src/common.ts:105-107` — `isLabel` đổi `text.trim() !== ''` thành `normalizeText(text) !== ''` (DR6-159).
- `packages/db/src/backup-validation.ts:166,188,192-202` — luật 15 `codeRule`, `CUSTOMER_CODE = /^K-[0-9A-HJKMNP-TV-Z]{4}$/`.
- `packages/db/src/trash.ts:34-38,267-270` — `TrashOwner.customer` thêm `code`, `refs().customer` trả `code`.
- `packages/db/src/customers.ts:551-562` — chỉ thêm comment cho `freeCode` (`K-` + `encodeBase32(3 byte)` = 4 ký tự).
- `packages/domain/src/text.ts:64-72` — hàm mới `searchText = stripDiacritics(normalizeText(text).toLowerCase())`; `packages/domain/src/index.ts:109` export.
- `packages/domain/src/name-order.test.ts` — 2 ca mới giữ bộ nhớ khóa `byName` (DR6-158), không đổi `name-order.ts`.

### `common\files-A.txt`

91 file (42 product, 49 test), đã đọc file danh sách đầy đủ.

- **42 file sản phẩm: đọc hết** — 18 file `packages/domain/src/*.ts` và 24 file `packages/db/src/*.ts` / `drizzle.config.ts` / `sql-raw.d.ts`, qua đọc trực tiếp và 2 agent phụ (mỗi agent nhận nguyên văn quy tắc riêng 2–5, 8 và quy tắc chung 1, 2, 7).
- **Đọc kỹ 9 file test:** `packages/domain/src/{text,name-order}.test.ts`; `packages/db/src/{common,ai-analyses,backup-invariants,backup,trash}.test.ts` (hun k diff và các ca liên quan); `packages/ai/src/validator-extraction.test.ts` (gói khác, để dựng V7); `apps/desktop/src/routes/appointments/appointment-form.test.ts` và `apps/desktop/src/routes/trash-view.test.ts` (quét ca ô tìm).
- **Các file test còn lại không đọc từng dòng** — `packages/db/src/{backup-engine,counts,customers,database,golden-kyc,golden-metrics,ids,kyc,person-references,policies,purge,reads,restore-roundtrip,seed-invariants,seed,settings,team}.test.ts` và `test-support.ts`; `packages/domain/src/{appointment-counts,compare,customer-lifecycle,evidence-level,kyc-catalog,kyc-fact,kyc-gate,kyc,money,number,period,pipeline-stage,stage-snapshot,stats-rf,stats}.test.ts`; 4 `packages/domain/src/golden/*.fixture.ts` và 4 `*.fixture.test.ts`. **Lý do:** không nằm trong diff `37a80b6..5b1328a`, không chứa nhánh điều khiển sản phẩm; đã **chạy hết** (`node node_modules/vitest/vitest.mjs run packages/domain/src packages/db/src` → 44 file / 1 503 test xanh, 64,22 s) và quét bằng `rg` theo từng mẫu ở mục 5. Bốn `*.fixture.ts` là dữ liệu cố định, đọc qua test đi kèm và `rg`, không đọc từng dòng. Đây là phần phạm vi đọc mỏng nhất của phiên.

### Chỗ code gói khác mà gói A nối vào (đã đọc)

`apps\desktop\src\routes\trash-view.ts:61-80,188-203,258-283,327-359` (`filterTrash`, `ownerParts`, `toldApart`, `restoreLabel`, `ofCustomer`), `apps\desktop\src\routes\appointments\appointment-form.ts:159-172` và `AppointmentDialog.tsx:325-403` (`searchCustomers`), `apps\desktop\src\routes\customers\extraction-view.ts:93-104`, `apps\desktop\src\i18n\vi.ts:78,1158`, `packages\ai\src\validator.ts:160-205`, `tools\eval-ai-core.mjs:32,365-366`, `packages\db\src\ai-analyses.ts:225-265`, `backup.ts:1-120`, `database.ts:1-100`, `ids.ts` (đọc hết), `common.ts` (đọc hết), `purge.ts` (đọc hết), `trash.ts` (đọc hết), `packages\domain\src\text.ts`, `name-order.ts`, `kyc.ts`, `kyc-fact.ts` (đọc hết), `tools\ts-hooks.mjs`, `tools\ts-hooks-core.mjs`, `vitest.config.ts`; e2e `appointments.spec.ts:423-447`, `trash.spec.ts:160-179`, `customer-policies.spec.ts:133-168`; spec / golden / ADR liệt kê ở mục "Đọc trước" của `common\prompt-workbuddy.md` (đọc `phase-3-du-lieu.md` §6:216-236, `phase-6-hoan-thien.md`:135, `phase-5-ai.md`:263, `golden\kyc.md`, `golden\chi-so.md`, `golden\lich-hen.md`, `golden\kh-theo-nhom.md`, `golden\ai-eval.md`, ADR-0007, ADR-0008, `CONTEXT.md`, `nghiem-thu-v1.md`), `common\known.md`, `common\baseline.md`, `common\fixes.md` (mục T-363, T-368, T-377), `common\plan.md` §L6.0–L6.11, tổng hợp lượt 5 §6.1 / §9 / §10.1 và báo cáo gốc gói A lượt 1–5 (qua agent phụ).

## 4. Kịch bản đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | `probe-1-regex.mjs`: regex luật 15 với 20 dạng mã (`\n` `\r` `\r\n`, U+2028/2029/0085, NBSP, U+200B, U+FEFF, NUL, chữ thường, `I L O U`, full-width, độ dài 3 / 5) | `K-9A1C` đúng, 19 dạng còn lại `false`; `$` của JS **không** lọt xuống dòng cuối. `CROCKFORD_BASE32` (`ids.ts:3`) khớp hẳn regex (32 ký tự đều nhận, `I/L/O/U` đều từ chối); `encodeBase32(3 byte)` luôn 4 ký tự | — |
| 2 | `probe-1-regex.mjs`: `String.prototype.normalize` trên surrogate lẻ / NUL / U+FEFF | Không ném lỗi ở mọi dạng thử (`NFC`, `NFD`); `isLabel` → `normalizeText` không tạo đường crash mới | — |
| 3 | `probe-2-text.mjs`: hàm thật `isLabel`, `cleanText`, `searchText`, `cleanNote`, `optionalText` trên 18 nhãn + 13 chữ gõ | `isLabel` từ chối 8 dạng "trống vô hình", không ném lỗi với `\uD800` / `\uDC00` / NUL; `searchText` đối xứng giữa chữ gõ (U+200B, NBSP, 2 dấu cách, NFD, hoa / thường) và tên đã lưu; `searchText('K-Ｍ２Ｄ８')` = `k-ｍ２ｄ８` ≠ `k-m2d8` | WBR6-A1 |
| 4 | `probe-3-backup.mjs`: nhập `common\load\load-2026-10-12-seed6.p2cbackup` (16 034 517 B, sha256 `F952E062…13A0`), đếm mã KH, sửa mã của đúng một KH theo 13 biến thể, nhập lại | Nhập OK 1 000,5 ms; 1 496 KH, **0 mã sai luật 15**; 11 dạng chuỗi sai → `BACKUP_INVALID {"rule":15}`; `code: null` và `code: 12345` → `BACKUP_INVALID` **không có** `rule`. `listTrash`: 113 dòng, 94 có `owner.customer`, 0 thiếu `code` | WBR6-A6 |
| 5 | Quét cùng mẫu `rg 'searchText'`, `rg 'byName\('`, `rg '\.trim\(\)'`, `rg 'isLabel\|CUSTOMER_CODE\|codeRule'`, `rg 'collapseSpaces'`, `rg 'today\(db\)'` trong toàn repo | 2 hàm gọi `searchText` sản phẩm (4 lời gọi), 9 chỗ sắp bằng `byName` (ngoài definition và test), 4 lời gọi `collapseSpaces`, 11 chỗ `today(db)`; không còn chỗ hỏi "trống" bằng `trim()` trong `packages/domain` / `packages/db` (các `trim()` còn lại thuộc công cụ, e2e và `common.ts:76` `optionalText` theo K33) | WBR6-A1, A2, A3 |
| 6 | `probe-4-perf.mjs`: đo trên dữ liệu tải thật (1 496 tên, 113 dòng Thùng rác, 1 313 dòng giả lập) | `searchCustomers` mới 3,68 ms vs bản lượt 5 1,07 ms (chênh 2,6 ms, **dưới** luật nhiễu 10 ms); `filterTrash` 0,16 ms / 2,06 ms; `searchText` trên query 120 000 ký tự 3,26 ms; sắp 10 255 tên bằng `byName` 11,92 ms. Đều dưới ngưỡng 200 ms / 500 ms | — |
| 7 | `mut\mutate.mjs`: 5 đột biến trên bản chép `packages/domain/src` (junction `node_modules`, không đụng repo), mỗi đột biến chạy lại 810 test | Baseline 21 file / 810 test xanh. M1 (`searchText` về `trim()`), M2 (bỏ `toLowerCase()`), M3 (`normalizeText` bỏ bước xóa ký tự vô hình), M4 (`byName` bỏ bộ nhớ khóa) đều **KILLED**; M5 (`searchText` thêm `NFKC`) **SURVIVED** (810/810 xanh) → không ca nào ghim hành vi chữ số toàn khổ | WBR6-A1 |
| 8 | `probe-5-chain.mjs`: gọi thật `searchCustomers`, `byName`, `searchText`, `filterExtraction`, `normalizeKycValue` | `byName` sắp `["KH 1","KH 2","KH ２","KH 3","KH 10"]`; `searchCustomers` gõ `KH 2` chỉ ra `KH 2`, gõ `KH ２` chỉ ra `KH ２`; V7 bỏ trích dẫn có U+200B / U+0085 (dù NBSP, U+FEFF, `\n` đều giữ); `normalizeKycValue` từ chối `Infinity` / `1e20` / `1.5` / mảng / object ở mọi kiểu trường | WBR6-A1, A2 |
| 9 | `probe-6-midnight.mjs`: chèn một `ai_analyses` ngày `2026-11-08` (append-only, `seq` mới) rồi gọi `validateBackupInvariants` với đồng hồ giả | Cả hai lần đọc `today` = 07/11 → `REJECTED BACKUP_INVALID {"rule":14}`; lần 1 = 07/11, lần 2 = 08/11 (qua nửa đêm) → **ACCEPTED**; cả hai = 08/11 → ACCEPTED | WBR6-A3 |
| 10 | `node node_modules/vitest/vitest.mjs run packages/domain/src packages/db/src` | 44 file / **1 503 test xanh**, 64,22 s, Node `v24.20.0`; không test đỏ, không hồi quy so `common\baseline.md` (lượt 5: 4 493 test toàn repo) | — |
| 11 | Đọc đối chiếu tài liệu đã duyệt: ADR-0008:19 / :26, `golden\kyc.md:24`, `CONTEXT.md:43`, `PROJECT-PLAN.md:272`, `golden\chi-so.md:122-126`, `golden\ai-eval.md:115-120`, ADR-0007:3,68, `phase-3-du-lieu.md:222` | ADR-0008:19 còn 4 hạng mục cũ trong khi 3 nguồn khác chốt 5 trường cốt lõi; 2 golden còn ô "Owner duyệt" chưa tick dù ADR ghi đã duyệt G2 | WBR6-A4, A5 |
| 12 | Kiểm vùng đã xét: `value_json` dạng `1e309` / mảng / object, luật 15 trên backup do exe lượt 5 xuất (theo `baseline.md`), `freeCode` ↔ `CUSTOMER_CODE`, `readsBackAsIs` / `isStorableText`, `trash.ts` `refs().customer`, `purge.ts` TR-12, `appointmentGroup` và CHECK `appointments_status` | `normalizeKycValue` không trả nguyên giá trị cho `Infinity` / `1e20` / `1.5` / mảng / object → `validKycValue` từ chối; CHECK `schema.ts:159` chặn status lạ; không thấy đường vào thật cho các ca PLAUSIBLE của agent phụ | — |

## 5. Phát hiện mới

### WBR6-A1

```
ID: WBR6-A1
Mức: Low
Trục: E
Vị trí: packages/domain/src/text.ts:70-72; packages/domain/src/name-order.ts:4,53-58 (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-172 / T-377 (PR #1088) · biến thể còn hở sau đợt sửa lượt 5, họ "so chữ không qua cùng một hàm chuẩn"
Mô tả: searchText (mới ở T-377) gộp khoảng trắng và bỏ dấu qua normalizeText, nhưng không đổi chữ số / chữ cái toàn khổ về ASCII; byName của cùng package đổi mọi \p{Nd} không phải ASCII về chữ số thường (K33 luật 6). Cùng một tên "KH ２" và "KH 2" vì thế coi là một khi sắp nhưng không tìm thấy nhau khi gõ vào ô tìm.
Tái hiện / bằng chứng: export PATH="/c/Program Files/nodejs:$PATH"; node C:\workspace\deep-review-1-6-r6\workbuddy\A\probe-5-chain.mjs (log workbuddy\A\probe-5-chain.log): [...['KH 3','KH 1','KH ２','KH 2','KH 10']].sort(byName) → ["KH 1","KH 2","KH ２","KH 3","KH 10"]; searchText('KH 2') = "kh 2", searchText('KH ２') = "kh ２"; searchCustomers([{name:'KH ２'},{name:'KH 2'}], 'KH 2', 10) → ["KH 2"], gõ 'KH ２' → ["KH ２"]. probe-2-text.mjs: 'K-Ｍ２Ｄ８' → 'k-ｍ２ｄ８'.
Cùng mẫu: rg 'searchText' → 2 chỗ gọi sản phẩm (apps\desktop\src\routes\appointments\appointment-form.ts:168,170; apps\desktop\src\routes\trash-view.ts:74,78), mỗi chỗ gọi cả 2 vế. rg 'byName\(' → apps\desktop\src\data\tables.ts:37, apps\desktop\src\shell\scope.ts:59,70, packages\db\src\team.ts:123, apps\desktop\src\routes\appointments\appointments-view.ts:460,470, ...\overview\team-compare-view.ts:114, ...\reports\reports-view.ts:296, ...\customers\customers-view.ts:104 (và test). Hai nhóm dùng hai định nghĩa chữ số; chỉ searchText/searchCustomers/filterTrash sai ở ca toàn khổ. Đột biến M5 (thêm NFKC) sống: 810/810 test domain vẫn xanh → không ca nào ghim hành vi này.
Ảnh hưởng: RE có KH / team / nhân sự tên chứa chữ số toàn khổ (dán từ văn bản, bộ gõ tiếng Nhật / Trung) gõ chữ số thường ở ô chọn KH 6b hoặc "Tìm theo tên" Thùng rác → "Không có KH khớp." dù KH có; có đường vòng (gõ đúng ký tự toàn khổ, hoặc gõ phần tên không có số).
Chặn phát hành: không — Low ở trục E, theo K48 chỉ Critical / High / Medium và Low ở trục D, S, G chặn.
Đề xuất: tách phép đổi chữ số của byName thành một hàm trong packages/domain rồi cho searchText gọi trước stripDiacritics, hoặc gập NFKC trên bản so (không đổi chữ lưu, đúng K25); ≈ 3 dòng sản phẩm + 2 ca unit cho searchText / searchCustomers / filterTrash. Không sửa golden / spec.
```

### WBR6-A2

```
ID: WBR6-A2
Mức: Low
Trục: E
Vị trí: packages/domain/src/text.ts:79-81; packages/ai/src/validator.ts:177,190 (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-172 / T-377 (họ "so chữ không qua cùng hàm chuẩn") · có từ trước, lượt 1–5 bỏ sót; collapseSpaces không đổi trong diff sau lượt 5
Mô tả: collapseSpaces gộp \s của JavaScript, không bỏ ký tự vô hình như normalizeText / normalizeNote (K25). Ghi chú KYC lưu qua cleanNote nên U+200B bị bỏ, U+0085 thành xuống dòng; V7 (filterExtraction) so trích dẫn bằng collapseSpaces ở cả hai vế, nên một trích dẫn đúng chữ nhưng có U+200B hoặc U+0085 (output AI dán từ web / dùng NEL) bị bỏ, dù normalizeText của cùng package đọc nó thành đúng câu. Spec Phase 5 §6.4 V7 chỉ đòi "so sau khi gộp khoảng trắng"; phát hiện này là chỗ lệch giữa hàm so và cách app lưu chữ, không phải đề xuất sửa spec.
Tái hiện / bằng chứng: export PATH="/c/Program Files/nodejs:$PATH"; node C:\workspace\deep-review-1-6-r6\workbuddy\A\probe-5-chain.mjs: note 'Chị sinh năm 1984'; quote 'Chị sinh\u{200B}năm 1984' → kept 0, dropped ["facts[0].quote"]; quote 'Chị sinh\u{85}năm 1984' → kept 0; trong khi normalizeText('Chị sinh\u{85}năm 1984') = 'Chị sinh năm 1984', và NBSP / U+FEFF / '\n' trong quote đều kept 1.
Cùng mẫu: rg 'collapseSpaces' → packages\ai\src\validator.ts:177,190; apps\desktop\src\routes\customers\extraction-view.ts:104; tools\eval-ai-core.mjs:365-366; packages\domain\src\index.ts:104; text.test.ts:214-220. Chỗ extraction-view.ts:104 không lộ vì giá trị đề xuất đã qua normalizeKycValue (filterExtraction giữ value: normalized); chỗ eval-ai-core.mjs gập chữ cùng cách V7 nên eval lệch cùng chiều. Không có chỗ nào khác trong gói A.
Ảnh hưởng: một lần AI trích xuất mất dữ kiện đúng (output suy biến), RE phải tự gõ; cần output AI bất thường, không mất dữ liệu đã lưu.
Chặn phát hành: không — Low ở trục E (K48).
Đề xuất: một hàm so chữ chung đọc cả hai vế theo normalizeText / normalizeNote (giữ chữ spec "gộp khoảng trắng", nhưng ký tự vô hình đã bị bỏ khi lưu cũng phải bỏ khi so); ≈ 3 dòng sản phẩm + 2 ca V7. Không đề xuất sửa spec / golden đã duyệt.
```

### WBR6-A3

```
ID: WBR6-A3
Mức: Low
Trục: E
Vị trí: packages/db/src/backup-validation.ts:186-187,472-485,494-504 (5b1328a)
Tình trạng: CONFIRMED
Liên quan: có từ trước, lượt 1–5 bỏ sót (hai lần đọc đồng hồ không đổi trong diff 37a80b6..5b1328a)
Mô tả: validateBackupInvariants gọi storedDate(today(db)) hai lần trong cùng một biểu thức: lần cho luật 10 (futureRule, không xét ai_analyses.date), lần cho luật 14 (aiRule). today() đọc db.now() mỗi lần; qua nửa đêm giữa hai lần đọc thì cùng một file có phân tích AI mang ngày D+1 bị từ chối rule 14 khi nhập trước giao thừa nhưng được nhận khi nhập đúng giao thừa.
Tái hiện / bằng chứng: export PATH="/c/Program Files/nodejs:$PATH"; node C:\workspace\deep-review-1-6-r6\workbuddy\A\probe-6-midnight.mjs (log workbuddy\A\probe-6-midnight.log): nhập dữ liệu tải, chèn 1 dòng ai_analyses ngày 2026-11-08 (bảng append-only, seq mới), gọi validateBackupInvariants với đồng hồ giả → cả hai lần 2026-11-07T10:00Z (17:00 GMT+7): REJECTED BACKUP_INVALID {"rule":14}; lần 1 = 07/11, lần 2 = 2026-11-07T17:00:00.001Z (00:00 GMT+7 ngày 08/11): ACCEPTED; cả hai = 08/11: ACCEPTED.
Cùng mẫu: rg 'today\(db\)' trong packages\db\src → 11 chỗ (ai-analyses.ts:129, common.ts:135, appointments.ts:179,496, customers.ts:162,196,313,530, backup-validation.ts:186,187, common.test.ts:20); chỉ backup-validation.ts:186,187 có hai lần đọc trong một lần kiểm, các lệnh khác đọc một lần. futureRule liệt kê 7 bảng nhưng không có ai_analyses (luật 14 giữ cột đó), nên chỉ cột này chịu khác biệt.
Ảnh hưởng: file backup sửa tay có ngày phân tích AI ở tương lai có thể lọt qua đúng lúc giao thừa; dữ liệu hiện là giả lập (K1), không mất dữ liệu đã lưu. Điều kiện rất hiếm.
Chặn phát hành: không — Low ở trục E (K48).
Đề xuất: đọc today(db) một lần ở đầu validateBackupInvariants rồi truyền cùng chuỗi cho futureRule và aiRule; ≈ 2 dòng sản phẩm + 1 ca test với đồng hồ giả qua nửa đêm.
```

### WBR6-A4

```
ID: WBR6-A4
Mức: Nit
Trục: C
Vị trí: docs/decisions/0008-kyc-du-kien-co-cau-truc-va-cong-deterministic.md:19 so với :26 (5b1328a)
Tình trạng: CONFIRMED
Liên quan: có từ trước, lượt 1–5 bỏ sót · tài liệu đã duyệt, báo theo "chỗ spec mâu thuẫn nhau là phát hiện trục C"
Mô tả: ADR-0008:19 định nghĩa CONFLICT_RESOLUTION là "mâu thuẫn trường cốt lõi (năm sinh, gia đình, tài sản, mục tiêu)" — bốn hạng mục, trong khi chính ADR-0008:26, docs/golden/kyc.md:24 và CONTEXT.md:43 chốt năm trường cốt lõi: năm sinh, tình trạng hôn nhân, số con, tổng tài sản/AUM, mục tiêu chính. Code (packages/domain/src/kyc-catalog.ts, kyc.ts:144) theo bản 5 trường.
Tái hiện / bằng chứng: đọc trực tiếp 4 file trên; rg 'năm sinh, gia đình, tài sản, mục tiêu' → 2 chỗ còn chữ cũ: ADR-0008:19 và docs/PROJECT-PLAN.md:272. packages/domain/src/kyc-gate.test.ts và golden/kyc.fixture.ts (K11, K14) xanh theo 5 trường; 44 file / 1 503 test xanh.
Cùng mẫu: rg 'Trường cốt lõi' → ADR-0008:26, golden/kyc.md:24, CONTEXT.md:43 (đều 5 trường); rg 'mâu thuẫn trường cốt lõi' → ADR-0008:19, PROJECT-PLAN.md:272 (4 hạng mục). Không có chỗ thứ ba trong code.
Ảnh hưởng: người đọc ADR / người bảo trì có thể hiểu mâu thuẫn ở bất kỳ trường của "gia đình", "tài sản", "mục tiêu" cũng chặn AI, trong khi cổng chỉ chặn 5 trường cốt lõi; không đổi hành vi app.
Chặn phát hành: không — Nit (K48), không thuộc trục D / S / G.
Đề xuất: chỉ ghi nhận để phiên tổng hợp / Owner chốt một nguồn đúng (:26 + golden/kyc.md:24 là bản đã duyệt G2); không tự sửa golden, spec hay code, không đổi hành vi; 0 dòng sản phẩm.
```

### WBR6-A5

```
ID: WBR6-A5
Mức: Nit
Trục: C
Vị trí: docs/golden/chi-so.md:122-126; docs/golden/ai-eval.md:115-120 (5b1328a)
Tình trạng: CONFIRMED
Liên quan: có từ trước, lượt 1–5 bỏ sót · tài liệu đã duyệt
Mô tả: mục "Owner duyệt" của chi-so.md còn ba ô [ ] chưa tick và không ghi ngày / PR, dù ADR-0007:3 ghi "golden examples + mô hình dữ liệu: Accepted (G2, 26/09/2026)" và ADR-0007:68 ghi rõ "bảng đối chiếu docs/golden/chi-so.md (Owner duyệt G2)". Ba golden khác (kyc.md:82-87, lich-hen.md:63-66, kh-theo-nhom.md:55-58) đều có [x] kèm ngày G2; ai-eval.md:115-120 cũng còn bốn ô [ ]. Fixture metrics.fixture.ts vẫn là test bắt buộc và xanh.
Tái hiện / bằng chứng: đọc trực tiếp các file; rg 'Owner duyệt' trong docs/golden → 5 mục, 3 tick / 2 chưa tick; rg 'chi-so.md' trong docs\decisions → ADR-0007:68. Chạy 44 file / 1 503 test xanh.
Cùng mẫu: 2 file cùng dạng (chi-so.md:124-126, ai-eval.md:117-120); 3 file đã đồng bộ (kyc.md:84-87, lich-hen.md:65-66, kh-theo-nhom.md:57-58). Không có file golden nào khác.
Ảnh hưởng: người đọc không biết G01–G22 và bộ eval đã được Owner duyệt, dễ tưởng golden còn chờ chốt; không đổi hành vi, không đổi test, không đổi số đo.
Chặn phát hành: không — Nit (K48).
Đề xuất: để phiên tổng hợp / Owner chốt cách ghi trạng thái duyệt trong tài liệu (ghi ngày + PR như ba golden kia); không sửa nội dung kịch bản G01–G22 / E01–E20, không sửa fixture; 0 dòng sản phẩm.
```

### WBR6-A6

```
ID: WBR6-A6
Mức: Nit
Trục: C
Vị trí: packages/db/src/backup-validation.ts:188,200-202 so với docs/design/phase-3-du-lieu.md:222 (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-160 / T-368 (PR #1072) · biến thể của phần sửa luật 15
Mô tả: spec §6 ghi mọi mã KH sai bị từ chối với BACKUP_INVALID kèm params.rule = 15. codeRule chỉ chạy sau khi nạp hàng và kiểm giá trị; mã KH không phải chuỗi (null, số) bị SQLite / validateBackupValues từ chối trước đó, nên lỗi không có rule. Vẫn từ chối đúng, chỉ thiếu tham số chẩn đoán.
Tái hiện / bằng chứng: export PATH="/c/Program Files/nodejs:$PATH"; node C:\workspace\deep-review-1-6-r6\workbuddy\A\probe-3-backup.mjs (log workbuddy\A\probe-3-backup.log): customers[0].code = null → REJECTED BACKUP_INVALID undefined (234 ms); = 12345 → REJECTED BACKUP_INVALID undefined (239 ms); 11 dạng chuỗi sai (KH-0001, chữ thường, dấu cách, U+200B, U+FEFF, xuống dòng, I/L/O/U, full-width, độ dài 3 / 5) đều → BACKUP_INVALID {"rule":15}.
Cùng mẫu: rg 'BACKUP_INVALID' → apps\desktop\src\data\app-data.ts:151, apps\desktop\src\data\app-data.test.ts:1413,1437,1477, packages\db\src\backup.test.ts:266; rg 'CUSTOMER_CODE|codeRule|isLabel' → chỉ backup-validation.ts:193,200-201 và common.ts:105. Các lỗi VALUE khác cũng không có rule (chủ ý), nên đây là lệch nhỏ ở chữ spec, không phải lỗi dữ liệu. UI (apps\desktop\src\i18n\vi.ts:1158) hiện câu chung cho mọi BACKUP_INVALID.
Ảnh hưởng: chỉ tham số chẩn đoán (log / test), người dùng thấy cùng một câu lỗi; không đổi dữ liệu, không lọt file sai.
Chặn phát hành: không — Nit (K48).
Đề xuất: để phiên tổng hợp chốt: hoặc kiểm dạng mã ngay ở validateBackupValues và gán rule 15, hoặc ghi rõ trong spec rằng rule = 15 chỉ áp cho mã dạng chuỗi; 0–3 dòng sản phẩm + 1 ca. Không tự sửa spec đã duyệt.
```

## 6. Bloat / Hiệu năng

Chỉ bắt buộc ở gói F; ở gói A ghi số đo đã chạy (mục 4, kịch bản 6) để gói F dùng: `searchCustomers` 3,68 ms trên 1 496 KH (bản lượt 5: 1,07 ms; chênh +2,6 ms, dưới luật nhiễu "quá 20 % **và** quá 10 ms"), `filterTrash` 0,16 ms / 2,06 ms (113 / 1 313 dòng), `searchText` 3,26 ms trên query 120 000 ký tự, `byName` 11,92 ms cho 10 255 tên, `importBackup` 1 000,5 ms cho 16 034 517 B. Máy `DESKTOP-KDURKJP`, Node `v24.20.0`, không có tiến trình đo exe khác chạy song song lúc đo (đo trong Node, không đo trên exe). Diff gói A thêm +33 dòng sản phẩm / +160 dòng test (`common\baseline.md` §L6.3), không thêm dependency, `searchText` 3 dòng — không thấy bloat có chi phí đo được.

## 7. Đếm và đề xuất chặn phát hành

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |
| Nit | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |
| **Tổng** | **3** | **3** | **0** | **0** | **0** | **0** | **0** | **0** | **0** | **6** |

- Phát hiện xếp **chặn phát hành: 0**; **không chặn: 6**. Áp K48: 3 Low đều ở trục E, 3 Nit ở trục C; không có Critical / High / Medium, không có Low ở trục D / S / G.
- Tỉ lệ PLAUSIBLE: **0 / 6** — mọi phát hiện đều CONFIRMED bằng lệnh / probe đã chạy hoặc đọc trực tiếp file ở SHA ghim (log ở `workbuddy\A\`). Các nghi ngờ PLAUSIBLE của agent phụ (`refs().customer` thiếu hàng, `purgeTrash` lồng transaction, `appointmentGroup` thiếu `default`, `today(db)` trong lồng lệnh) đã kiểm bằng CHECK `schema.ts:159`, `rg 'purgeTrash\('` (`app-data.ts:480-485` gọi ngoài DB transaction) và probe giá trị KYC; không ghi thành phát hiện.
- **Không kết luận SẴN SÀNG / CHƯA SẴN SÀNG**: theo `common\prompt-workbuddy.md`, kết luận v1.0 chỉ ở gói F. Gói A không tổng hợp, không so với bên khác, không tạo Issue, không đề xuất merge.

## 8. "Đã xét, không thấy" theo từng trục

- **E (edge case):** đã thử U+200B / U+2060 / U+0085 / U+3164 / U+180E / NBSP / U+FEFF / NUL / surrogate lẻ / NFD-NFC / 2 dấu cách / tên 120 000 ký tự / năm vượt / qua nửa đêm; thấy 3 Low (A1, A2, A3). Các ca còn lại (mã KH có `\n` cuối, `isLabel` với UTF-16 hỏng, `searchText` với NUL) đúng như thiết kế.
- **C (hợp đồng / spec / mockup / nhãn):** đối chiếu `phase-3-du-lieu.md` §6 luật 1–15, `phase-6-hoan-thien.md` §4.2, `phase-5-ai.md` §6.4 V7, ADR-0007 / 0008, 5 golden, `nghiem-thu-v1.md`; thấy 3 Nit (A4, A5, A6). Không thấy lệch mockup mới; các mục trong `common\known.md` phần 3 giữ KNOWN.
- **D (dữ liệu):** 1 496 mã KH của dữ liệu tải đều hợp lệ luật 15; 13 biến thể nhập backup từ chối đúng; `listTrash` 113 dòng, 94 `owner.customer` đều có `code`; `exportBackup` → `importBackup` tròn; `purge.ts` TR-12 `keptRecords` / `foreign_key_check` đọc kỹ; `kycHash` / `nextKycVersion` đọc kỹ. Không thấy phát hiện mới; DR6-158…160 là KNOWN theo phần riêng.
- **G (guardrail AI):** gói A chỉ chạm nhãn `ai_analyses` (`isLabel`, `analysisLabelsFit`, `analysisContentFits`) và V7 qua `collapseSpaces`. Đã chạy `isLabel` trên 18 nhãn và `normalizeKycValue` trên 24 tổ hợp; không gọi dịch vụ AI của sản phẩm, không `eval:ai`, không đọc key (quy tắc chung 2). Không thấy phát hiện mới ngoài A2 (trục E).
- **S (an toàn ở ranh giới):** `isStorableText`, `readsBackAsIs`, `MAX_BACKUP_BYTES`, `assertSupported`, CHECK / UNIQUE của `schema.ts`, `value_json` với `1e309` / mảng / object; không thấy giá trị lạ lọt qua (probe 8, 12). Không đọc Credential Manager, không mạng ngoài.
- **P (hiệu năng):** số đo ở mục 6, so ngưỡng `docs/metrics/phase-6.md` (< 200 ms / ≤ 500 ms) và luật nhiễu (> 20 % **và** > 10 ms) so lượt 5; không có dòng vượt. Không đo trên exe (không cần cho kết luận trong gói A).
- **B (bloat):** diff gói A +33 SP / +160 test như `baseline.md`; không dependency mới, không công cụ mới, không file sinh lọt vào sản phẩm. Không thấy chi phí đo được.
- **T (chất lượng test):** 44 file / 1 503 test xanh; 5 đột biến (4 KILLED, 1 SURVIVED — chính là lỗ hở ghi ở A1); test mới của T-363 / T-368 / T-377 giữ được `byName` cache, `isLabel`, luật 15, `searchText`. e2e `appointments.spec.ts:423-447` phủ ô 6b, `trash-view.test.ts:258-264` phủ ô Thùng rác. Không thấy test hở khác.
- **A (trợ năng / i18n):** `restoreLabel` / `ofCustomer` / `toldApart` / `ownerParts` đọc kỹ, `customer.withCode` (`vi.ts:78`) dùng ở `trash-view.ts:336,356`; mã KH có mặt ở mọi `owner.customer` (probe 4). DR6-160 / K50 Q1 là KNOWN; không thấy tên truy cập trùng mới.

## 9. Phụ lục

**Nguồn probe / bản chép / log** (mọi file nằm trong `C:\workspace\deep-review-1-6-r6\workbuddy\A\`):

| File | Việc |
|---|---|
| `diff-A.diff` | `git diff 37a80b6 5b1328a -- packages/domain packages/db` (489 dòng) |
| `probe-1-regex.mjs` | regex luật 15, bảng Crockford, `encodeBase32(3 byte)`, `normalize` trên UTF-16 hỏng |
| `probe-2-text.mjs` + `.log` | `isLabel` / `cleanText` / `searchText` / `cleanNote` / `optionalText` trên chữ biên |
| `probe-3-backup.mjs` + `.log` | nhập backup dữ liệu tải, 13 biến thể mã KH, `listTrash` |
| `probe-4-perf.mjs` + `.log` | đo `searchCustomers` / `filterTrash` / `searchText` / `byName` trên dữ liệu tải |
| `probe-5-chain.mjs` + `.log` | chuỗi `byName` ↔ `searchCustomers`, V7 `filterExtraction`, `normalizeKycValue` |
| `probe-6-midnight.mjs` + `.log` | `validateBackupInvariants` với đồng hồ giả qua nửa đêm |
| `mut\domain\src\` (bản chép 36 file) + `mut\node_modules` (junction) + `mut\domain\vitest.config.ts` + `mut\mutate.mjs` + `mut\mutate.log` | 5 đột biến trên bản chép; cuối mỗi ca trả nguyên byte (`mutate.mjs` in `da tra nguyen byte hai file cua ban chep`) |

**Đột biến (trên bản chép, không đụng repo):** baseline 21 file / 810 test xanh. M1 `searchText` về `trim()` lượt 5 → KILLED (2 test đỏ); M2 bỏ `toLowerCase()` → KILLED (2); M3 `normalizeText` bỏ bước xóa ký tự vô hình → KILLED (21, gồm `money.test.ts`); M4 `byName` tính lại khóa mỗi lần → KILLED (1, `name-order.test.ts` ca DR6-158); M5 `searchText` thêm `NFKC` → **SURVIVED** (810/810) → lỗ hở ghi ở WBR6-A1. Sau phiên, bản chép vẫn nằm trong `workbuddy\A\mut\`, hai file `text.ts` / `name-order.ts` của bản chép đã trả nguyên văn.

**Kiểm cuối phiên:**
- `git -C C:\workspace\Project-2C-review rev-parse HEAD` → `5b1328ae236aa62981dbf43066ff544a9e832c8c` (như đầu phiên).
- `git -C C:\workspace\Project-2C-review status --short` → **rỗng** (không dòng nào), như đầu phiên; không sửa file được theo dõi, không vá tạm trong repo. Thư mục build / cache do vitest sinh nằm trong `node_modules\.vite` (bị ignore).
- Không ghi gì vào `…-r6\common\`, `…-r6\claude\`, `…-r6\codex\`; không đọc báo cáo lượt 6 của bên khác, không liệt kê / tìm kiếm thư mục cấm hay `C:\workspace\`.
- Giờ xong: **00:11 08/11/2026** (GMT+7, `DESKTOP-KDURKJP`).
