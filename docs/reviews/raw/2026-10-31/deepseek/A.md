XONG — deepseek gói A lượt 4, 2026-10-30 19:23 (+07:00)

# DSR4-A — Gói A. Lõi dữ liệu (`packages/domain/**`, `packages/db/**`)

## 1. Bên, gói, SHA, trạng thái đầu phiên

| Mục | Giá trị |
|---|---|
| Bên | deepseek |
| Gói | A. Lõi dữ liệu |
| SHA đầu phiên | `2e51e25eb0125f56d3d938b97ef18d6873dae076` (`git rev-parse HEAD`) |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 2026-10-30 18:56 (+07:00) |
| App | WorkBuddy AI v5.9.3 (theo `common\baseline.md`, mục "Owner làm lại bước 1–4") |
| Model | Deepseek-V4.1-Flash |
| Context | 1M token (bộ chọn model của app) |
| Mức suy luận | Thinking effort Max |
| Expert | Code review expert (`ex_uZzSAScSy7FZ`), cùng model |
| Ngoại lệ Owner | Được dùng agent phụ + Code review expert của app (quy tắc riêng 4 nới); mọi quy tắc khác giữ nguyên |

## 2. Bảng R1 (theo mã) và bảng R2 (theo Issue)

Cách kiểm mỗi dòng: (1) chạy lại tái hiện của lượt 3; (2) gỡ tạm phần sửa trên worktree bằng một bản vá đúng một chỗ, chạy test của PR, rồi `git checkout --` và so lại sha256 + `git status` (mọi dòng dưới: `restored: same=true git-status-lines=0`); (3) thử biến thể gần. Nguồn: `A\mutate.mjs` + `A\m-*.json` (phụ lục 9).

### 2.1 Bảng R1 — 18 dòng gói A kiểm

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-104 | #720 → #740 | ĐÃ SỬA | Gỡ khối `if (move && compareDates(latest.date, date) > 0) throw TRANSITION_BEFORE_LATEST` (`appointments.ts:299-301`) → `trash.test.ts` đỏ **3 test** (`E7: blocks it like E6 once the customer, %s, reached that stage again after its day`, hai tham số + ca "after its day"). Khôi phục: sha256 trùng. | Đọc `appointments.ts:293-305`: nhánh E7 chỉ chạy khi `move` khác null (đã rút chuyển nhóm và KH đang ở đúng nhóm sau), rồi chặn khi chuyển nhóm cuối cùng của KH có ngày **sau** ngày cuộc hẹn. Biến thể: KH tới nhóm sau **trước** ngày hẹn (03/10 cho cuộc hẹn 05/10) vẫn khôi phục được — ca "reached that stage before its day" xanh. |
| DR6-105 | #720 → #740 (+ #781 → #830) | ĐÃ SỬA | Đổi `z.iso.datetime({ precision: 3 })` → `z.iso.datetime()` (`backup-validation.ts:46`) → `backup.test.ts` đỏ **3 test** ("refuses a stamp without milliseconds / with tenths / with microseconds, in any of the three columns"). | Mốc giờ chỉ nhận đúng dạng `toISOString()`; `transitionWithdrawnAt` so chữ `eq(deletedAt, at)` (`customers.ts:477`) và `listTrash` xếp theo chữ (`trash.ts:185-187`) chỉ đúng khi mọi mốc cùng một dạng. Test "stamps as the app writes them" ghim cả ba cột. |
| DR6-106 | #720 → #740 | ĐÃ SỬA | Ép `reinstateTransition` luôn `appendTransition` (`const follows = false && …`, `customers.ts:495-500`) → `trash.test.ts` đỏ **5 test**, gồm "TR-3: restores two meetings of a day in the order they were recorded" và "…blocks them in the other order like E20" (`sameDay: 1`). | Chuyển nhóm được đưa lại giữ `seq` cũ khi nó vẫn đi sau chuyển nhóm mới nhất và cùng `from`/`to`/ngày; nhờ vậy "khôi phục theo thứ tự đã ghi" được, ngược lại bị chặn. |
| DR6-107 | #721 → #738 | ĐÃ SỬA | Bỏ `!value.startsWith('\u{FEFF}')` (`backup.ts:204`) → `backup.test.ts` đỏ **5 test** (nhóm "a text that starts with U+FEFF"). | Kiểm ba lớp: `normalizeText` bỏ U+FEFF (probe: `normalizeText("\uFEFFBến")` = `"Bến"`); `valueOf` từ chối chuỗi bắt đầu bằng nó khi nhập; `storedRawOutput` bỏ tiền tố đó của `raw_output`. |
| DR6-108 | #721 → #738 | ĐÃ SỬA | Trả `storedRawOutput` về chỉ thay NUL (`replaceAll('\0','\uFFFD')`) → `ai-analyses.test.ts` đỏ. | `replace(/[\0\p{Cs}]/gu, '\uFFFD')` thay cả nửa surrogate lẻ; `\|\| '\uFFFD'` giữ bất biến "REJECTED không rỗng" khi chuỗi chỉ có U+FEFF. |
| DR6-110 | #721 → #738 | ĐÃ SỬA | (a) `parseVnd` về `text.normalize('NFC').trim().toLowerCase()` → `money.test.ts` đỏ **11 test**; (b) `parseQuickDate` về `text.trim()` → `period.test.ts` đỏ **6 test**. | Probe: `parseVnd("500tr\u200B")` = 500 000 000; `parseVnd("500\u200B000")` = 500 000; `parseQuickDate("12/10/2026\u200B")` đọc được. Biến thể: `"1\u0085000"` = 1 000 (U+0085 thành dấu cách), `"500\u0007"` = 500 (Cc bị bỏ). |
| DR6-111 | #721 → #738 (+ G5 §7 #728 → #762) | ĐÃ SỬA | Bỏ nhánh `(?![\0\p{White_Space}])\p{Cc}` khỏi `INVISIBLE` (`text.ts:23-24`) → `text.test.ts` đỏ **3 test** ("breaks the line at a CR alone …, and drops a control character"). | Probe: `normalizeText("Sao Mai\u0007")` = `"Sao Mai"`, `\u0081` cũng bỏ; `\u0085` và `\u000B` thành dấu cách (White_Space), đúng để `LINE_BREAK` còn tách được. |
| DR6-112 | #721 → #738 (+ luật 6 #780 → #828) | ĐÃ SỬA | Bỏ vế `\|\| (a < b ? -1 : a > b ? 1 : 0)` (`name-order.ts:40`) → `name-order.test.ts` đỏ **3 test** (ca 2 022 tên xáo 20 lần). | Probe: `byName("Team 01","Team 1")` = −1, `("Team 1","Team １")` = −1, `("a","A")` = −1, `("A","A")` = 0. Corpus 53 tên trộn 7 bộ chữ số: 0 cặp hoà khác tên, 0 cặp phi đối xứng, 0 vi phạm bắc cầu trên 24³ bộ ba → vẫn là comparator hợp lệ cho `sort`. |
| DR6-113 | #722 → #742 (+ #776 → #805) | ĐÃ SỬA | Bỏ `PRAGMA recursive_triggers = ON` (`database.ts:212`) → `purge.test.ts` đỏ **1 test** ("refuse to replace those of a live customer, as the file is opened and after it was exported"). | `enableConnectionPragmas` bật lại cả hai pragma sau mỗi `export()` (sql.js mở lại kết nối). |
| DR6-114 | #722 → #742, #776 → #805 | ĐÃ SỬA | (a) Đổi `POINTS_TO.reviewer` sang `'re'` → `person-references.test.ts` đỏ **2 test**; (b) trả `ownsRecords` về cộng tay ba field → **sống** (đột biến tương đương: 5 kind hiện có chia đúng ba field đó, xem phụ lục 9). | Đọc `person-references.ts`: 5 kind sinh từ một bảng `Record`, `USAGE_FIELDS` và `POINTS_TO` cũng `Record` theo kind nên thiếu kind thì `tsc` báo (TS2741); `PERSON_REFERENCES` là câu ghép thường, không `WITH` (mục 10). `person-references.test.ts` đọc mọi khoá ngoại trỏ `people` từ `pragma_foreign_key_list`. |
| DR6-125 | #722 → #742 | ĐÃ SỬA | (a) `firstOfEach` → `rows` (giữ lại mọi dòng) → `purge.test.ts` đỏ; (b) `DELETE FROM stage_transitions … OR deleted_at IS NOT NULL` → đỏ **1 test** (`livePart(db)` khác trước); (d) trừ ghi chú `SYSTEM` khỏi câu đếm của `purge.ts` → đỏ **1 test** (`kycNotes` 2 → 1). | (c) D11 đã có ca "as the file is opened and after it was exported" (xem DR6-113). Ba câu đếm (11b/5f của `countCustomerRecords`, 11i của `purge.COUNTS`) nay cùng đếm mọi ghi chú, kể cả `SYSTEM`. |
| DR6-126 | #720 → #740 (a, b, d), #721 → #738 (e, f), #722 → #742 (c) | ĐÃ SỬA | (a) `stagesOfDay` lấy `transitions.at(-1)!.to` làm nhóm đầu ngày → `customers.test.ts` đỏ **3 test**; (c) bỏ khối chặn RE rời vai trò trong `updatePerson` → `team.test.ts` đỏ **1 test**; (d) bỏ `ORDER BY date` của `unmovedMeetingsFrom` → `appointments.test.ts` đỏ **1 test** (`STAGE_KEPT_BY_MEETING`); (e) `normalize('NFC')` → `NFKC` → `text.test.ts` đỏ **1 test** ("composes as NFC, not NFKC"); (f) `normalizeKycValue` bỏ `storable(value)` → `kyc.test.ts` đỏ. | (b) `latest.seq < withdrawn.seq` chính là biểu thức đã gỡ ở DR6-106 (đột biến đó giết 5 test). (e) thêm: `normalizeNote("a\rb")` = `"a\nb"`, `normalizeNote("a\vb\fc")` = `"a\nb\nc"`. (f) `parseVnd` gom khoảng trắng: `"1 000 000"` = 1 000 000. |
| DR6-132 (b) | #722 → #742 (+ #756 → #758) | ĐÃ SỬA | Đọc `packages/db/CLAUDE.md:13` (mục "File hay tìm") và `packages/db/migrations/0011_trash_purge.sql:8-11,16-19,24-27`: cả ba trigger `*_no_delete` đều `WHEN NOT EXISTS (SELECT 1 FROM customers WHERE id = OLD.customer_id AND deleted_at IS NOT NULL)`. | Chữ trong `CLAUDE.md` khớp đúng ba trigger và nêu hệ quả (migration "dựng lại bảng" `customers` hỏng ở RENAME, phải DROP ba trigger trước rồi tạo lại sau) — đúng mẫu `0008` / `0011`. |
| DR6-134 | #720 → #740 (+ #775 → #804) | ĐÃ SỬA | `git grep stagesOfDay`: một hàm ở `customers.ts:348`, dùng ở `appointments.ts:302`, `:397`, `backup-validation.ts:249`, `customers.ts:433` và `apps/.../outcome-form.ts:107`. Không còn `stageOnDay` / `isStageOfDay` (grep rỗng). | Luật DR-43 nay một bản; `customers.test.ts` "stagesOfDay (T-232, DR-43; DR6-134)" ghim cả nhánh "nhóm tạo KH" (đột biến (a) ở DR6-126 giết 3 test). |
| DR6-25 | #781 → #830 (+ #831 → #837) | ĐÃ SỬA | `git grep "from 'zod"` trên `packages apps e2e tools`: 5 dòng, **tất cả** `zod/mini` (ba dòng còn lại là chuỗi mẫu trong `tools/pr-core.test.mjs`, không phải import). Bundle: `assets/index.js` 884 698 B ở SHA ghim, −43 234 B so lượt 3; số tách riêng của `zod/mini` ở #830 là 940 771 → 878 036 B (−62 735). | vitest `packages/domain` + `packages/db` xanh (44 file, 1 470 test, 66,5 s). "Cùng kết quả kiểm": PR #830 so 3 × 200 000 ca (`validateOutput` / `safeParse` / `filterExtraction` / `analysisInputSchema`) — 0 khác biệt; tôi không dựng lại phép so đó (ngoài ngân sách gói), chỉ đọc bản ghi và chạy lại bộ test. |
| DR6-66 | #655 → #693 (một phần), #775 → #801, #777 → #812, #790 → #845 | ĐÃ SỬA | `git grep -E '\b(getAppointment\|isCustomerLive\|getPolicy\|getTeam\|getPerson\|markKycVersionMaterial\|monthToDate\|stageOn\|liveAppointmentsOf\|AI_LOCAL_ERROR_CODES)\b' -- packages apps`: **0 dòng**. `git grep "export { liveCustomer }"`: **0 dòng**. | Test đọc lại qua `byId(list*(db), id)` và `stageAtEndOfDay` (`test-support.ts`), không qua hàm chỉ-test-dùng. |
| DR6-67 | #774 → #799, #775 → #801, #777 → #812, #782 → #807, #790 → #845 | ĐÃ SỬA | `git grep` "bỏ dấu" (`normalize('NFD')` / `\p{M}`) trên mã sản phẩm: chỉ còn `text.ts:61` (`stripDiacritics`), `name-order.ts:10` (lớp ký tự của `LATIN`), `ai/test-support.ts:16` (chèn ZWSP trước dấu, không phải bỏ dấu) và `ai/text-match.ts:46` (dấu lạc thành dấu cách, G5 §7 bước 0). `toString(16)`: chỉ `text.ts:79` (`toHex`) và `kyc.ts:119` (`cyrb53`, số → hex, không phải byte). | Năm `update<X>Row` → `updateRow`; năm câu "seq lớn nhất" → `lastSeq`; sáu `find` / `live<X>` → `findRow` / `liveRow`; năm `restore*` → `requireRow` (`common.ts:227-303`). `kyc_versions` giữ `seq` đọc từ dòng phiên bản mới nhất (lý do ghi trong PR #801). |
| CL3-A29 | #722 → #742 (một phần), #776 → #805 (chỉ mục `0012`) | ĐÃ SỬA | `EXPLAIN QUERY PLAN` trên dữ liệu tải, có chuỗi giữ lại dựng bằng lệnh (A ← B ← C, xoá A và B): `SETUP \| SEARCH f USING INDEX appointments_deleted (deleted_at>?) \| SEARCH a USING INDEX appointments_rescheduled_from (rescheduled_from_id=?) …`. Bỏ `CROSS JOIN` → `SCAN a USING INDEX appointments_rescheduled_from` (đọc mọi lịch được dời từ lịch khác), đúng mô tả CL3-A29. Kết quả hai câu **giống hệt** (2 dòng). | Chỉ mục `appointments_deleted`, `appointments_rescheduled_from` có trong `sqlite_master`; `0012_trash_lookups.sql` chỉ hai `CREATE INDEX`, không đổi dữ liệu. Số đo: `listTrash` 20,1 ms / `previewPurge` 0,8 ms (114 dòng, Node, dữ liệu tải) — xem mục 6. |

### 2.2 Bảng R2 — 6 Issue gói A kiểm

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-285 | #774 → #799 | ĐÃ SỬA | Mục tiêu 6 phần đúng trên code: `formatLocalDayMonthTime` / `formatLocalTime` (`period.ts:104-111`), `isIsoDate` (`:130`), `parseDate` đọc trên `normalizeText` (`:193`), `stripDiacritics` / `collapseSpaces` / `toHex` (`text.ts:60-80`), `sameDayYearBefore` (`period.ts:173`), `nextKycVersion(previous: {version, profile} \| null, …)` (`kyc.ts:154`). Gỡ `parseDate` về `text.trim()` → `period.test.ts` đỏ; gỡ `parseQuickDate` (DR6-110) → đỏ 6 test. | "Hành vi không đổi": `plain` cũ = `toLowerCase().normalize('NFD').replace(/\p{M}/g,'').replace(/đ/g,'d')`, `stripDiacritics` mới chỉ thêm `Đ`→`D` (không đổi vì chỗ gọi đã hạ chữ thường) — đọc `trash-view.ts:73,77`, `appointment-form.ts:161,163`, `report-workbook.ts:200`. Seed: `DEMO_ROW_COUNTS` **trùng** bản `119e2e4`; `dayNumber` / `toDate` / `middayOf` tính lại bằng `daysBetween` / `addDays` / `Date.UTC(y,m-1,d,12)` — cùng một thời điểm như `(day+0.5)×DAY_MS`. `DEMO_HASH` đổi `a66327bf…` → `2e078bf0…` chỉ vì `contentHash` coi `prompt_version` là một dấu (T-288) và `@3` → `@4` (K31), không phải vì dữ liệu. |
| T-286 | #775 → #801, #804 | ĐÃ SỬA | `common.ts`: `updateRow`, `findRow`, `liveRow`, `requireRow`, `lastSeq`, `storable`; `createCustomer` gọi `checkTransition` **một lần** trước INSERT (`customers.ts:119`); `normalizeKycValue` gọi `storable` (`kyc.ts:439`). Gỡ `storable(value)` → `kyc.test.ts` đỏ. Gỡ `assertScale` (T-287) → `seed.test.ts` đỏ. | Kỳ vọng test phải đổi đúng như PR nêu (bỏ test `markKycVersionMaterial`, `monthToDate`, `stageOn`) — đọc `period.test.ts` / `kyc.test.ts` ở SHA ghim, không còn test của ba hàm đó. `#804` (tài liệu) đổi `stageOn` → `stageAtEndOf` / `stageSnapshot` ở `phase-3-du-lieu.md`, `phase-4-chi-so.md`, `golden/kh-theo-nhom.md`; `git grep stageOn` trong `docs/design docs/golden` = 0 dòng. |
| T-287 | #776 → #805 | ĐÃ SỬA | `person-references.ts` mới (5 kind, `POINTS_TO`, `quotedKinds`); `trash.ts` `refs` đọc theo id (`rowsById` + `json_each`); `0012` hai chỉ mục; `counts.ts` đếm `Set` theo `appointment_id`; `unmovedMeetingsFrom` lọc trong SQL; `PersonUsage.inTrash` thành `{name, code}[]`; `assertScale`. Đột biến: `POINTS_TO.reviewer` (DR6-114) đỏ 2 test; `counts.ts` đếm theo chuyển nhóm thay vì cuộc hẹn → `counts.test.ts` đỏ; `inTrash` trả mã rỗng → `team.test.ts` đỏ; bỏ `assertScale` → `seed.test.ts` đỏ. | `listTrash` / `previewPurge` cho cùng dòng trước / sau (sha 16 ký tự: `d1f5fb6e5969fc88` / `47008737201f491d` trên dữ liệu tải + chuỗi giữ lại). Số đo #805 (Home PC): `listTrash` 24,7 → 17,9 ms, `previewPurge` 5,7 → 0,7 ms; tôi đo lại ở máy này: 20,1 / 0,8 ms (114 dòng) — cùng bậc. |
| T-288 | #777 → #812 | ĐÃ SỬA | Phần `db` của Issue: `AI_ANALYSIS_NO_MODEL` và `MAX_AI_RAW_OUTPUT` chỉ định nghĩa ở `packages/ai/src/schema.ts:50,56`, `db` import lại (`ai-analyses.ts:7-13`, `schema.ts:16-19`). `git grep "MAX_AI_RAW_OUTPUT ="` → 1 dòng (`schema.ts:56`). | `recordAiAnalysis` ghi `row` theo danh sách (`AI_ANALYSIS_NO_MODEL.includes(provider)`), không còn `mock`. Phần `ai` (dời `retry.ts`, `analysis-steps.ts`, `subjectOf`) thuộc gói C. |
| T-291 | #780 → #824, #828 | ĐÃ SỬA | Bảy luật, mỗi luật một đột biến (tất cả đều **đỏ**): (1) bỏ `hashes.at(-1) === storedKycHash(current)` → `backup-invariants.test.ts`; (2) bỏ `JSON.stringify(result.data) !== a.outputJson` → cùng file; (3) `overRawOutput` luôn `false` → cùng file; (4) `optionalText` về `trimmed === ''` → `appointments.test.ts`; (5) `previousYearSuggestion` luôn null → `period.test.ts`; (6) `byName` (DR6-112) → `name-order.test.ts`; (7) `LINE_BREAK` bỏ `\v\f` → `text.test.ts`. | Luật 1 (`versionsFit`): KH có dữ kiện hiệu lực ⇔ có phiên bản, hash mới nhất = `kycHash` tính lại, hai phiên bản liền nhau khác hash, mọi hash `/^[0-9a-f]{14}$/`. Luật 3: `storedRawOutput` cắt 20 000 code point; `overRawOutput` đếm code point (25 000 code unit nhưng 15 000 code point vẫn nhận). Luật 4: `appointmentTextStored` kiểm `trigger_note`, `next_step`, `note` của **mọi** lịch, kể cả đã xoá. |
| T-292 | #781 → #830 | ĐÃ SỬA | Xem DR6-25. Thêm: `storedKycHash` (`backup-validation.ts:412`) dùng chung cho luật 7 và `rehash` của test — `git grep storedKycHash` chỉ 1 định nghĩa. | `zod/mini` là subpath của gói `zod` đã có trong ADR-0005; `package.json` / lockfile không đổi (đọc `git diff --stat 119e2e4 2e51e25 -- pnpm-lock.yaml packages/*/package.json`: rỗng). |

## 3. Phạm vi đã đọc

- **Toàn bộ mã sản phẩm của gói** (đọc từng file, không chỉ diff): `packages/domain/src/*.ts` trừ `*.test.ts` (2 298 dòng, gồm cả `golden/*.fixture.ts`) và `packages/db/src/*.ts` trừ `*.test.ts` (6 481 dòng), trừ `ids.ts` và `seed-data.ts` chỉ đọc lướt (không đổi ở lượt này).
- **Phần diff `119e2e4..2e51e25` của gói**: `git diff --stat` 59 file, +4 544 / −891; đọc trọn diff của 22 file sản phẩm (domain 8, db 14) và đọc lướt diff test để biết test nào ghim hành vi nào.
- **Chỗ code gói khác mà gói A nối vào**: `packages/ai/src/schema.ts` (`AI_ANALYSIS_NO_MODEL`, `MAX_AI_RAW_OUTPUT`, `AI_OUTPUT_SCHEMAS`, `analysisInputSchema`), `packages/ai/src/analysis-steps.ts` (`analysisOutcome`, `rejectedOutput`), `apps/desktop/src/routes/appointments/outcome-form.ts` (`stagesOfDay`), `apps/desktop/src/routes/{trash-view,appointments/appointment-form,reports/report-workbook}.ts` (`stripDiacritics`), `packages/db/migrations/0011_trash_purge.sql`, `0012_trash_lookups.sql`.
- **Tài liệu**: `docs/design/phase-3-du-lieu.md` §4, §6 (luật 7 nguyên văn), `phase-4-chi-so.md` §2, `docs/golden/kh-theo-nhom.md`, `docs/decisions/0007`, `docs/state/review-notes.md` (mục RESOLVED của T-285…292), `docs/reviews/2026-10-21-deep-review-phase-1-6-luot-3-tong-hop.md` §6.1–§6.3, §6.7, §7, §8.4–§8.5, `docs/reviews/2026-10-15-…-luot-1-tong-hop.md` §3–§5 (DR6-25, 37, 66, 67), `packages/{domain,db}/CLAUDE.md`.
- **Báo cáo gốc lượt 3** (`docs/reviews/raw/2026-10-21/{claude,codex}/A.md`) để lấy tái hiện của DR6-104…126, 134 và `raw/2026-10-15/` cho DR6-25, 37, 66, 67.
- **Không đọc**: mọi thư mục trong quy tắc riêng 2, báo cáo lượt 4 của bên khác, `docs/reviews/raw/2026-10-17/` (không mở; DR6-25, 37, 66, 67 lấy mô tả từ `common\known.md` phần 4 và `plan.md` §L4.5).

## 4. Kịch bản mới đã thử

Tất cả chạy trên dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (15 676 559 B, 1 496 KH / 10 414 lịch hẹn / 13 114 phiên bản KYC) trong Node, trừ khi ghi khác.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | Xuất ở SHA ghim → nhập lại → xuất lần hai, so từng byte | **Trùng** (15 676 559 B, cùng `exportedAt`, cùng `schemaVersion` 13) | — |
| 2 | Cùng file khai `schemaVersion: 12` (bản trước chỉ mục `0012`) → nhập | **Nhận**, migrate lên 13, dữ liệu đọc lại đủ. `schemaVersion: 14` → `SCHEMA_TOO_NEW` | — |
| 3 | Dòng REJECTED do **lệnh** ghi (khối JSON nhỏ, và không có khối) → xuất → nhập | **Nhận** cả hai; luật 2 nhánh REJECTED đúng dạng `JSON.stringify` viết lại | — |
| 4 | Biên 20 000 code point của `output_json`, đo **cả hai phía** trên cùng một chuỗi: 19 999 / 20 000 / 20 001 / 20 008 | Lệnh: nhận 19 999 và 20 000, từ chối 20 001 (`AI_ANALYSIS_INVALID`); nhập: nhận 19 999 và 20 000, từ chối 20 001 và 20 008 (`BACKUP_INVALID` rule 13). **Hai phía khớp đúng** (DR5-13) | — |
| 5 | Sửa tay chữ tùy chọn của lịch hẹn: chỉ U+0085, chỉ U+2800, `a\u0085b`, `a\nb`, ` a`, `a\uFEFF` | Từ chối 4 ca (chỉ U+0085, chỉ U+2800, ` a`, `a\uFEFF`); **nhận** `a\u0085b` và `a\nb` — đúng `optionalText` (trim của JS giữ U+0085, không cắt giữa dòng) | — |
| 6 | Dọn sạch trên chuỗi giữ lại **ba tầng** (A←B←C, xoá A và B) + một lịch giữ lại mà RE đã bàn giao rồi bị xoá cùng team | 3 lịch + 1 nhân sự + 1 team được giữ, `previewPurge` = `purgeTrash`, Thùng rác 118 → 5 dòng, file sau khi dọn **nhập lại được** | — |
| 7 | `byName` có còn là comparator hợp lệ cho `sort`? 53 tên trộn 7 bộ chữ số (ASCII, toàn khổ, Ả Rập, Devanagari) | 0 cặp hoà khác tên, 0 cặp phi đối xứng, 0 vi phạm bắc cầu trên 24³ bộ ba | — |
| 8 | Chi phí sắp xếp của `byName` so collator trần, trên tên thật và trên 20 000 tên | 1 496 tên: 4,8 ms so 1,1 ms; 20 000 tên: 109,6 ms so 26,2 ms → **DSR4-A1** | DSR4-A1 |
| 9 | `parseQuickDate` đầu năm và 29/02: hôm nay 02/01/2027 gõ "28/12"; 15/03; hôm nay 15/01/2028 gõ "29/02" | "28/12" → gợi ý 28/12/2026; "15/03" → không gợi ý; "29/02" (năm nhuận, ngày chưa tới) → không gợi ý năm trước (29/02/2027 không có) — hai gợi ý không bao giờ cùng có | — |
| 10 | Ký tự vô hình trong tiền và ngày: `"500tr\u200B"`, `"500\u200B000"`, `"1\u0085000"`, `"500\u0007"`, `"12/10/2026\u200B"` | 500 000 000 · 500 000 · 1 000 · 500 · đọc được — DR6-110 đúng, và không nới lỏng gì thêm (`"1,5 tỷ"` vẫn 1,5 tỷ) | — |

## 5. Phát hiện mới

### DSR4-A1 — `byName` chạy `LATIN.test` hai lần mỗi phép so: sắp tên chậm 4,2 lần so collator trần, và "lối tắt" của T-291 chỉ cắt được 15 % chi phí nó gây ra

```
ID: DSR4-A1
Mức: Low
Trục: P
Vị trí: packages/domain/src/name-order.ts:39-44 (2e51e25)
Tình trạng: CONFIRMED
Liên quan: DR6-112 / T-291 (PR #780 → #828) · mới do đợt sửa sau lượt 3 (PR #828)
Kịch bản: 8
Mô tả: `byName` gọi `asciiDigits` cho cả hai vế của mỗi phép so, tức `LATIN.test` (một regex có cờ `u`) hai lần mỗi lần so — O(n log n) lần — nên sắp xếp đắt gấp ~4 lần collator trần. "Lối tắt `LATIN`" thêm ở T-291 để tránh `replace` lại chính là chỗ đắt: bỏ lối tắt thì 129,9 ms, có lối tắt 109,6 ms, trong khi chỉ collator + tie-break là 26,2 ms.
Tái hiện / bằng chứng: `A\probe-byname2.mjs`, dữ liệu tải (1 496 tên KH) và 20 000 tên tổng hợp từ chính các tên đó; Node v22.22.2, Home PC, trung vị 7 lần, không chạy gì song song:
  20 000 tên — collator trần 26,7 ms · collator + tie-break 26,2 ms · `replace` luôn + tie-break 129,9 ms · `byName` hiện tại 109,6 ms;
  1 496 tên — collator trần 1,1 ms · `byName` hiện tại 4,8 ms;
  `LATIN.test` một mình: 34,4 ms cho 200 000 lần (≈ 0,17 µs/lần) → ~572 000 lần cho một lần sắp 20 000 tên.
  Bản sửa thử (tính khoá một lần rồi sắp): 20 000 tên 32,7 ms, 1 496 tên 1,3 ms — cùng thứ tự.
Ảnh hưởng: mọi màn sắp tên bằng `byName` (danh sách KH, Team & nhân sự, báo cáo, hộp 9b). Trên dữ liệu tải: +3,7 ms mỗi lần sắp — **dưới luật nhiễu** (quá 20 % **và** quá 10 ms), nên không phải phát hiện hiệu năng theo ngưỡng; chỉ vượt ngưỡng ở quy mô ~20 000 tên (+83 ms). Con số "17 → ~31 ms" trong PR #828 không tái hiện được ở máy này.
Đề xuất: tính `asciiDigits` một lần cho mỗi tên rồi sắp theo khoá (Schwartzian), giữ nguyên tie-break theo tên gốc — ~10 dòng trong `name-order.ts` + một ca test so thứ tự với bản hiện tại. Cỡ ≤ 40 dòng.
```

Ngoài DSR4-A1, gói A **không có phát hiện mới nào** ở mức Medium trở lên: 30 đột biến (29 bị test giết, 1 sống là đột biến tương đương — phụ lục 9) (phụ lục 9), 10 kịch bản mới ở mục 4 không lộ chỗ hở, và các đường vào mà plan §L4.4 phần 2 nêu (nhập backup chặt hơn, mốc `precision: 3`, U+FEFF, tham chiếu nhân sự một danh sách, chỉ mục `0012`, hàm dùng chung của `domain` / `db`, khôi phục theo E7) đều đúng như mô tả.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đo gì | Trên dữ liệu nào | Số | ID |
|---|---|---|---|
| `tsc -p packages/{db,domain}/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` | mã sản phẩm của gói | 0 lỗi ở cả hai package | — |
| Đối chiếu 145 tên export của `domain/src/index.ts` và 111 của `db/src/index.ts` với mọi file `.ts/.tsx/.mjs` của `apps`, `packages`, `e2e`, `tools` ngoài package đó (`A\probe-bloat.mjs`) | toàn repo | 14 tên của `domain`, 19 của `db` không được import ngoài package; **13/14 và 19/19 là kiểu** dùng trong chữ ký hàm công khai (`VndParseResult`, `OpenDatabaseOptions`, `NewCustomer`…), 5 là hàm / hằng chỉ dùng trong chính package: `customRangeMaxEnd`, `policyMetrics`, `isMaterialChange`, `EVIDENCE_LEVELS`, `KYC_CATEGORY_SPECS` | — |
| `git grep` cho các bản sao đã gộp (bỏ dấu, hex của byte, `try { fromIsoDate }`, `split(formatLocalDateTime`) | mã sản phẩm | còn đúng 4 chỗ, đều có lý do trong PR #799 / #801 (xem DR6-67) | — |
| `git grep` cho `updateRow`, `findRow`, `liveRow`, `lastSeq`, `requireRow` | `packages/db/src` | một định nghĩa mỗi hàm, ở `common.ts`; 0 bản chép | — |

Năm hàm / hằng export thừa ở trên **không đáng một phát hiện**: chúng được dùng trong chính `domain`, bị tree-shake khi build, và bỏ khỏi `index.ts` là ~5 dòng không có chi phí đo được (Nit theo thước §4.3). Ghi lại để phiên sau không phải đếm lại. `LATIN` cũng nằm trong nhóm này nhưng **có** người dùng: `name-order.test.ts` khẳng định tiền đề của lối tắt.

### 6.2 Hiệu năng

Máy Home PC `DESKTOP-KDURKJP`, phiên này, không chạy gì song song; Node v22.22.2; dữ liệu tải `load-2026-10-12-seed6.p2cbackup`. Mốc so: `common\baseline.md` (Node, cùng máy) và số trong PR #805 / #828.

| Đo | Số ở SHA ghim | Mốc | Kết luận |
|---|---|---|---|
| `listTrash`, 114 dòng (113 của dữ liệu tải + 1 lịch thử) | 20,1 ms (trung vị 40 lần) | baseline Node: 23,8 ms (113 dòng); #805: 24,7 → 17,9 ms | Không xấu hơn (nhanh hơn 3,7 ms) |
| `previewPurge`, cùng dữ liệu | 0,8 ms | baseline 1,0 ms; #805: 5,7 → 0,7 ms | Không xấu hơn |
| `listTrash` sau khi dọn (Thùng rác trống) | 0,3 ms | baseline 2,1 ms | Không xấu hơn |
| `previewPurge` sau khi dọn | 0,4 ms | baseline 1,0 ms | Không xấu hơn |
| `EXPLAIN QUERY PLAN` của `KEPT_APPOINTMENTS`, có chuỗi giữ lại | `SEARCH f USING INDEX appointments_deleted` → `SEARCH a USING INDEX appointments_rescheduled_from` | #805: 4,5 → 0,06 ms cho câu này | Đúng chỉ mục; không còn quét cả bảng |
| `importBackup` (dựng DB + migrate + 14 luật) | 1 010,7 ms (5 lần) | #830: 946–950 ms (trước) → 947–948 ms (sau) ở PR | +62 ms so số PR; PR đo trên cây khác, không có mốc cùng máy cho hàm này nên **không kết luận** |
| `validateBackupValues` (luật 4 trên mọi lịch hẹn) | 236,5 ms (trung vị 9 lần) | #828: 199–205 → 217–219 ms | +17 ms so số PR; cùng bậc, không có mốc cùng máy |
| `validateBackupInvariants` (luật 1 trên 13 114 phiên bản) | 202,3 ms | #828: 169–171 → 186–194 ms | +8 ms so số PR; cùng bậc |
| `byName` sắp 1 496 tên KH | 4,8 ms | lượt 3 (`collator.compare`): 1,1 ms | **+3,7 ms (+336 %) nhưng dưới 10 ms → không tính là xấu hơn**; xem DSR4-A1 |
| `byName` sắp 20 000 tên | 109,6 ms | lượt 3: 26,2 ms | +83 ms, vượt cả hai ngưỡng — nhưng 20 000 tên là 13× dữ liệu tải; DSR4-A1 |
| `stagesOfDay` cho cả 1 481 KH (4 884 chuyển nhóm) | 0,7 ms | chưa có mốc (hàm mới của DR6-134) | Rẻ; gọi một lần mỗi lệnh ghi kết quả |

Không phát hiện P nào theo ngưỡng `docs/metrics/phase-6.md` (mọi thao tác màn < 200 ms; Dọn sạch ≤ 500 ms — số exe ở `baseline.md`). DSR4-A1 là P duy nhất, mức Low, và chỉ vượt luật nhiễu ở quy mô 20 000 tên.

## 7. Bảng đếm mức × trục

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 1 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Tổng** | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | **1** |

Tỉ lệ PLAUSIBLE: 0/1 (DSR4-A1 là CONFIRMED, có số đo). 18 dòng R1 và 6 dòng R2 đều ĐÃ SỬA, không có SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY nên không sinh phát hiện kèm "Liên quan".

## 8. Đã xét, không thấy

- **R (kiểm phần đã sửa)** — đã xét: 18 dòng R1 + 6 dòng R2, mỗi dòng có ít nhất một đột biến hoặc một phép so trực tiếp (riêng DR6-132 (b) kiểm bằng tài liệu + mã). Không dòng nào SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY. Hai dòng chỉ kiểm bằng tài liệu (DR6-132 (b), DR6-134) đã đối chiếu với mã: `CLAUDE.md` khớp ba trigger của `0011`; `stagesOfDay` còn đúng một định nghĩa và 5 chỗ gọi.
- **E (edge case)** — đã xét: ngày (29/02, đầu năm, nửa đêm qua `parseQuickDate` / `sameDayYearBefore`), chuỗi (U+FEFF, Cc, Cf, nửa surrogate, NFD, toàn khổ), số (0, âm, trần 100 tỷ qua `isFee` / `parseVnd`), 20 000 code point hai phía, chuỗi giữ lại ba tầng, Thùng rác trống. Không thấy lỗi mới.
- **C (đúng hợp đồng)** — đã xét: spec Phase 3 §6 luật 7 (nguyên văn) ↔ `versionsFit`; §4 "Thứ tự tên" ↔ `byName`; ADR-0007 phụ lục ↔ `parseQuickDate`; `docs/golden/kh-theo-nhom.md` ↔ `stageSnapshot` (không đổi). Không thấy lệch.
- **D (dữ liệu)** — đã xét: `exportBackup` → `importBackup` → `exportBackup` trùng từng byte; file khai `schemaVersion` 12 nhập được; lệnh ghi REJECTED rồi nhập lại được; `previewPurge` = `purgeTrash` trên chuỗi giữ lại; `foreign_key_check` sau mỗi lần nhập và trước COMMIT của Dọn sạch. Không thấy mất / hỏng dữ liệu.
- **G (guardrail AI)** — gói A chỉ chạm hai chỗ: `analysisContentFits` (luật 13) và `MAX_AI_RAW_OUTPUT`. Đã đọc cả hai + `analysisOutcome` / `rejectedOutput` của `packages/ai`; chạy `backup-invariants.test.ts` và `ai-analyses.test.ts`. Không thấy lỗ mới; các luật V1–V7 là của gói C.
- **S (an toàn ranh giới)** — đã xét nhập backup như một ranh giới: tên bảng lấy từ `dataTables(db.sqlite)` (DB đích), **không** lấy từ file, nên không có đường chèn SQL qua tên bảng; tên cột lấy từ `columnsOf`; mọi giá trị qua `valueOf` (`isStorableText`, không U+FEFF đầu); `MAX_BACKUP_BYTES` 100 MB. Không thấy lỗ mới.
- **P (hiệu năng)** — xem §6.2; một phát hiện Low.
- **B (bloat)** — xem §6.1; không có phát hiện.
- **T (chất lượng test)** — 30 đột biến, 29 bị giết; 1 sống là **đột biến tương đương** (phụ lục 9). Không thấy test hở mới.
- **A (trợ năng / i18n)** — không áp dụng cho gói này (không có JSX, không có chuỗi i18n). Chữ trong `DbError` chỉ là `params` số / ngày, không đổi ở lượt này.

## 9. Phụ lục — nguồn probe / đột biến

Thư mục `C:\workspace\deep-review-1-6-r4\deepseek\A\`.

**Đột biến** (`mutate.mjs` + `m-*.json`): mỗi lần vá đúng một chỗ bằng chuỗi thay thế, chạy một file test, rồi `git checkout --` và so sha256 + `git status`. Mọi dòng dưới đều `restored: same=true git-status-lines=0`.

| # | Đột biến | File | Test | Kết quả |
|---|---|---|---|---|
| 1 | bỏ khối chặn E7 khi chuyển nhóm cuối sau ngày hẹn | `appointments.ts` | `trash.test.ts` | đỏ 3 |
| 2 | `z.iso.datetime({precision:3})` → `z.iso.datetime()` | `backup-validation.ts` | `backup.test.ts` | đỏ 3 |
| 3 | `reinstateTransition` luôn `appendTransition` | `customers.ts` | `trash.test.ts` | đỏ 5 |
| 4 | bỏ `!value.startsWith('\u{FEFF}')` | `backup.ts` | `backup.test.ts` | đỏ 5 |
| 5 | `storedRawOutput` chỉ thay NUL | `ai-analyses.ts` | `ai-analyses.test.ts` | đỏ |
| 6 | `parseVnd` về `text.normalize('NFC').trim()` | `money.ts` | `money.test.ts` | đỏ 11 |
| 7 | `parseQuickDate` về `text.trim()` | `period.ts` | `period.test.ts` | đỏ 6 |
| 8 | bỏ nhánh `\p{Cc}` khỏi `INVISIBLE` | `text.ts` | `text.test.ts` | đỏ 3 |
| 9 | bỏ tie-break của `byName` | `name-order.ts` | `name-order.test.ts` | đỏ 3 |
| 10 | bỏ `PRAGMA recursive_triggers = ON` | `database.ts` | `purge.test.ts` | đỏ 1 |
| 11 | `POINTS_TO.reviewer` → `'re'` | `person-references.ts` | `person-references.test.ts` | đỏ 2 |
| 12 | `ownsRecords` cộng tay ba field | `team.ts` | `person-references.test.ts` | **sống — tương đương** |
| 13 | `firstOfEach` → `rows` | `purge.ts` | `purge.test.ts` | đỏ |
| 14 | xoá mọi chuyển nhóm đã rút | `purge.ts` | `purge.test.ts` | đỏ 1 |
| 15 | câu đếm 11i trừ ghi chú `SYSTEM` | `purge.ts` | `purge.test.ts` | đỏ 1 |
| 16 | `stagesOfDay` lấy nhóm cuối làm nhóm đầu ngày | `customers.ts` | `customers.test.ts` | đỏ 3 |
| 17 | bỏ chặn RE rời vai trò | `team.ts` | `team.test.ts` | đỏ 1 |
| 18 | bỏ `ORDER BY date` của `unmovedMeetingsFrom` | `customers.ts` | `appointments.test.ts` | đỏ 1 |
| 19 | `normalize('NFC')` → `NFKC` | `text.ts` | `text.test.ts` | đỏ 1 |
| 20 | bỏ `storable(value)` trong `normalizeKycValue` | `kyc.ts` | `kyc.test.ts` | đỏ |
| 21 | bỏ `hashes.at(-1) === storedKycHash(current)` | `backup-validation.ts` | `backup-invariants.test.ts` | đỏ |
| 22 | bỏ so `JSON.stringify(result.data) !== a.outputJson` | `ai-analyses.ts` | `backup-invariants.test.ts` | đỏ |
| 23 | `overRawOutput` luôn `false` | `ai-analyses.ts` | `backup-invariants.test.ts` | đỏ |
| 24 | `optionalText` về `trimmed === ''` | `common.ts` | `appointments.test.ts` | đỏ |
| 25 | `previousYearSuggestion` luôn null | `period.ts` | `period.test.ts` | đỏ |
| 26 | `LINE_BREAK` bỏ `\v\f` | `text.ts` | `text.test.ts` | đỏ |
| 27 | đếm RF theo chuyển nhóm thay vì cuộc hẹn | `counts.ts` | `counts.test.ts` | đỏ |
| 28 | bỏ `assertScale` | `seed.ts` | `seed.test.ts` | đỏ |
| 29 | `inTrash` trả mã rỗng | `team.ts` | `team.test.ts` | đỏ |
| 30 | `parseDate` về `text.trim()` | `period.ts` | `period.test.ts` | đỏ |

Đột biến số 12 sống vì **tương đương**: `POINTS_TO` có đúng ba kind `'re'` (`customer`, `appointment`, `policy`), trùng đúng ba field mà bản cộng tay đếm, nên hai bản cho cùng kết quả trên 5 kind hiện có. PR #828 đã nêu đúng ca này: đột biến của nó **thêm** một kind thứ sáu rồi so, và ca đó đỏ. Tôi không dựng lại phép thêm kind (phải sửa 4 bảng `Record` cùng lúc); đột biến 11 chứng minh `POINTS_TO` là nguồn duy nhất mà cả `ownsRecords` lẫn luật 5 đọc.

**Probe** (chỉ đọc, mở dữ liệu tải trong bộ nhớ):
- `probe-domain.mjs` — DR6-107/110/111/112/126(e) ở mức hàm thuần.
- `probe-db.mjs` — chỉ mục `0012`, `EXPLAIN QUERY PLAN` của `KEPT_APPOINTMENTS` (có / không `CROSS JOIN`), `listTrash` / `previewPurge` (số đo §6.2), sha của hai lần đọc.
- `probe-import.mjs` — xuất → nhập → xuất, `schemaVersion` 12 / 14, REJECTED do lệnh ghi, chữ tùy chọn sửa tay.
- `probe-roundtrip.mjs` — so từng bảng của hai lần xuất (ghi `round1.json`, `round2.json`).
- `probe-20000.mjs` — biên 20 000 code point hai phía.
- `probe-purge-chain.mjs` — Dọn sạch trên chuỗi giữ lại ba tầng + RE đã bàn giao + team đã xoá.
- `probe-perf.mjs`, `probe-byname.mjs`, `probe-byname2.mjs` — số đo §6.2 và DSR4-A1.
- `probe-bloat.mjs` — export không dùng ngoài package.

**Không chạy**: `pnpm verify` toàn bộ (dùng số ở `common\baseline.md`), `pnpm e2e` (gói A không có màn; cổng e2e ở `baseline.md`), probe trên exe (gói B / F), `pnpm eval:ai`. Chạy tại chỗ: `node node_modules/vitest/vitest.mjs run packages/domain packages/db` → **44 file, 1 470 test, xanh** (66,5 s; chạy lại hai lần cuối phiên: 70,9 s và 65,8 s, cùng 44/1 470). Một lần chạy giữa phiên báo 43 file + 1 error mà không có test nào đỏ và không in thông báo: nghi một worker không gom được file dưới áp lực bộ nhớ (lúc đó có ba tiến trình Node giữ dữ liệu tải trong bộ nhớ). Hai lần chạy lại sạch, nên ghi lại làm ghi chú, không phải phát hiện.

**`git status --short` cuối phiên**: rỗng (kiểm sau mỗi lần đột biến và ở cuối). **Giờ xong**: 2026-10-30 19:23 (+07:00).
