XONG — claude gói A lượt 6, 2026-11-07 12:58 (+07:00)

# Deep review Phase 1–6, lượt 6 — Claude, gói A (Lõi dữ liệu)

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên | Claude (ID `CLR6`) |
| Gói | A — Lõi dữ liệu (`packages/domain/**`, `packages/db/**`) |
| SHA đầu phiên | `5b1328ae236aa62981dbf43066ff544a9e832c8c` (`git rev-parse HEAD` ở `C:\workspace\Project-2C-review`, khớp SHA ghim) |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 2026-11-07 12:04 (+07:00), Home PC `DESKTOP-KDURKJP` |
| Công cụ | Claude Code (app desktop, tab Code), phiên mới, worktree `C:\workspace\Project-2C-review` (detached HEAD) |
| Model / mức suy luận | Claude Opus 5.5 (`claude-opus-5-5`); mức suy luận do Owner chọn ở app, phiên không đọc được giá trị |
| Ultracode / Workflow | không dùng |
| Phiên làm tiếp? | không — phiên đầu của gói A |
| Node | v24.20.0 (`C:\Program Files\nodejs`, đầu PATH) |

**Subagent: 2 lần**, công cụ Agent, `subagent_type: general-purpose`, `model: opus` (Claude Opus 5.5), `effort: xhigh`, chạy nền song song với phiên chính; tin nhắn giao việc nêu đường dẫn đủ của `prompt-claude.md`, chữ gói A, bảo đọc quy tắc riêng 2–4 và phần chung trước; không subagent nào gọi subagent khác, không ghi `A.md`.

| Subagent | Việc giao | Probe | Thời gian |
|---|---|---|---|
| S1 | Tìm lỗi mới ở phần `packages/domain` về ngày / kỳ, tiền, số, chỉ số, KYC: `period`, `money`, `number`, `compare`, `stats`, `stage-snapshot`, `appointment-counts`, `customer-lifecycle`, `pipeline-stage`, `evidence-level`, `kyc`, `kyc-catalog`, `kyc-fact`, `kyc-gate`, `model`, `golden/*.fixture.ts` (đối chiếu spec Phase 3 / 4, golden) | `A\s1\` | 1 668 s, 105 lần gọi công cụ |
| S2 | Tìm lỗi mới ở lệnh ghi của `packages/db` qua chuỗi nhiều bước: `appointments`, `customers`, `policies`, `team`, `person-references`, `kyc`, `ai-analyses`, `counts`, `settings`, nối vào Thùng rác / Dọn sạch / backup | `A\s2\` | 1 974 s, 115 lần gọi công cụ |

Phiên chính làm bảng R, đọc diff `37a80b6..5b1328a` của gói, đọc kỹ `text.ts`, `name-order.ts`, `common.ts`, `backup.ts`, `backup-validation.ts`, `trash.ts`, `purge.ts`, `database.ts`, `migrations.ts`, `schema.ts`, `ids.ts`, `errors.ts`, `index.ts` của `db`, và **kiểm lại mọi phát hiện của S1, S2 trên code** (đọc lại vị trí, định nghĩa đột biến, log; S2-2 chạy lại đột biến trên bộ test rộng hơn) trước khi ghi. Phát hiện của subagent mang ID `CLR6-A…` ở mục 5, ghi rõ ai tìm.

Probe / log của phiên: `C:\workspace\deep-review-1-6-r6\claude\A\` (`hooks.mjs`, `mut.mjs`, `mutant-config.mjs` chép từ `deep-review-1-6-r5\claude\A\` theo đường dẫn ghi trong báo cáo gốc Claude A lượt 5, chỉ đổi chú thích và `LOAD` sang `-r6\common\load\…`).

## 2. Bảng R

Cách làm chung: probe Node nạp TypeScript của repo qua `hooks.mjs`; đột biến chạy vitest trên worktree ghim qua `mut.mjs` + `mutant-config.mjs` (hook `load` của Vite phục vụ bản đột biến của đúng một file; repo không đổi byte nào; chỉ tính **bị giết** khi có `[mutant] served` và có test đỏ). Đột biến "cả gói" chạy `packages/domain` + `packages/db` (1 503 test).

### 2.1 Bảng R1 (3 dòng của gói A)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-158 | #1045 → #1063 | **ĐÃ SỬA** | Tái hiện lượt 5 (`r1\byname-past-max.mjs`, chép `-r5\claude\A\r1\`, chỉ đổi đường dẫn): lấp bộ nhớ khóa bằng 20 000 tên rồi sắp 2 022 tên trộn chữ số, 20 lần xáo → code ghim **1 thứ tự** (`r1\byname-past-max.log`). Gỡ phần sửa (`r1\mut-r1.mjs`, cả gói, 1 503 test): **(a)** `R158-old-file` (cả `name-order.ts` về `2e51e25`, đúng lỗi DR6-136) **bị giết**, 1 đỏ: "works the key of a name out once, however many times a sort reads it" (`name-order.test.ts:124`); **(b)** `R158-past-max-raw` (quá trần trả tên trần, đưa lại DR6-112) **bị giết**, 1 đỏ: "sorts the 2 022 names one way after a session read 20 000 others" (`:108`). `name-order.ts` không đổi từ `37a80b6` (`git diff` rỗng); số đo cùng máy ở mục 6.2 (sắp 1 481 tên KH 1,44 ms ↔ 1,39 ms của `37a80b6`) | Biến thể gần: `R158-cache-swapped` (khóa ↔ tên) bị giết 4; `R158-latin-uncached` (tên LATIN không vào bộ nhớ) bị giết 1. Sống: `R158-past-max-nocache` (quá trần không nhớ thêm: thứ tự đúng, như lượt 5), `R158-never-clear` (bỏ trần: chỉ giữ thêm bộ nhớ), `R158-digit-uncached` (bỏ bộ nhớ chữ số: chỉ chi phí) — ba đột biến này không đổi hành vi nào ngoài bộ nhớ / thời gian; không ghi phát hiện |
| DR6-159 | #1045 → #1063 | **ĐÃ SỬA** | Tái hiện lượt 5 (`r1\label-blank.mjs`, `r1\label-blank-import.mjs`, chép lượt 5, chỉ đổi đường dẫn): U+200B / U+2060 / U+0085 / U+3164 / U+180E / NBSP / U+3000 → `isLabel=false`, luật 12 `false` (lượt 5: năm ký tự đầu `true`); `importBackup` dữ liệu tải với model U+200B, U+3164, NBSP → `BACKUP_INVALID {"rule":12}`; `glm-5.3` nhận, đọc lại dài 7. Gỡ phần sửa: `R159-isLabel-trim` (về `text.trim() !== ''`) **bị giết**, 8 đỏ (`common.test.ts` "refuses text with nothing to see…", `ai-analyses.test.ts` ca lệnh và ca luật 12, `backup-invariants.test.ts` 5 ca "12: a model name of U+… alone"); `R159-isLabel-no-blank` bị giết 9 | Cùng mẫu (hỏi "trống" bằng `trim()`, họ DR6-159 / 168 / 172 / 173): `rg "\.trim\(\)\s*(===\|!==\|==\|!=)\s*''\|\.trim\(\)\.length\|!\s*\w+(\.\w+)*\.trim\(\)\|\.trim\(\)\s*\?"` trên repo → không còn chỗ nào trong code sản phẩm (`apps/**`, `packages/**`); chỉ `tools/*.mjs` (chữ của công cụ) và `apps/desktop/src/routes/customers/policy-form.ts:250` (`reName?.trim()`, chữ hiện, không hỏi trống). `optionalText` (`common.ts:76`) cắt bằng `trim` có chủ ý, hỏi trống bằng `normalizeText` (Owner 23/10) |
| DR6-160 (phần A: mã KH trong `TrashOwner`, luật nhập 15) | #1050 → #1072 (+ #1082 → #1088, #1094 → #1097, #1101 → #1109) | **ĐÃ SỬA** (phần gói A; phần màn ở gói E) | (a) `r1\trash-code.mjs`: dữ liệu tải, 94 dòng lịch hẹn / HĐ của Thùng rác, `owner.customer.code` sai **0**; tái hiện CLR5-A1 qua `openAppData` (hai KH "Trần Thu Hà" khác RE, lịch 20/10 09:00 và HĐ 05/10 12 000 000 cùng xóa) → "… của KH Trần Thu Hà (K-72DQ)" / "(K-0X18)", **tên nút trùng 0** (lượt 5: 2 / 4), cả sau khi xóa thêm KH thứ hai (`r1\trash-code.log`). (c) Luật 15 (`r1\mut-r2.mjs`): `R160-no-code-rule` **bị giết** 9 đỏ (9 ca "15: …"); `R160-owner-code-name` (`code: row.name`) và `R160-owner-no-code` bị giết 2 đỏ (`trash.test.ts` E4, E12). File của app cũ vẫn nhập (K50): `gen\` dựng cây `37a80b6` (`git archive`), sinh dữ liệu tải + Thùng rác (`tables` `e256e4f1…`, = dữ liệu tải lượt 6), demo + Thùng rác, demo; cùng hai file lượt 4 (`-r5\claude\A\gen\r4-load.p2cbackup`, `r4-demo.p2cbackup`) và dữ liệu tải lượt 6 → nhập bằng code ghim **ACCEPTED cả 6** (674–969 ms; `gen\import-pinned.log`) | Biến thể luật 15: bỏ neo cuối (`R160-code-no-end-anchor`) bị giết 2; nhận mọi chữ / chữ thường (`-any-letter`) bị giết 3; chỉ xét KH chưa xóa (`-live-only`) bị giết 2. Regex = bảng `CROCKFORD_BASE32` của `ids.ts:3`; `encodeBase32` của 3 byte luôn ra 4 ký tự; chỉ `freeCode` (`customers.ts:552`, gọi ở `:124`) ghi `customers.code` (`rg "customers\.code\|\bcode:" packages/db/src`, ngoài test); `code` UNIQUE (`schema.ts:105`). Spec `phase-3-du-lieu.md:70`, `:222` khớp code. Biến thể gần còn hở: KH / nhân sự / team tên chỉ khác hoa / thường hay chỗ đặt dấu thanh → tên nút chỉ khác ở đó → **CLR6-A1** (Nit) |

### 2.2 Bảng R2 (1 Issue của gói A)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-377 (phần A: `searchText` về `@p2c/domain`) | #1082 → #1088 | **ĐÃ SỬA** (phần gói A; tên nút tới giây, team trùng tên, e2e 8b ở gói E) | Test chấp nhận của phần A: `searchText` ở `packages/domain/src/text.ts:70` = `stripDiacritics(normalizeText(text).toLowerCase())`, export `index.ts:109`, bản đồ export `packages/domain/CLAUDE.md:52`; `describe('searchText')` ở `text.test.ts:188` (dấu, hoa thường, NFD, U+200B, NBSP, hai dấu cách, chỉ ký tự vô hình). Nơi dùng chỉ hai ô tìm (`appointment-form.ts:168,170`, `trash-view.ts:74,78`); `trash-view.ts` không còn import module form 6b; `git grep codedCustomers -- apps packages e2e tools` → 0. Gỡ phần sửa (`r1\mut-r2.mjs`, test `text.test.ts` + `trash-view.test.ts` + `appointment-form.test.ts`, 161 test): `T377-search-no-normalize` (về `trim()`, như trước #1072) **bị giết** 5; `-no-lower` bị giết 9; `-no-strip` bị giết 7 | `T377-search-lower-last` (hạ chữ sau khi bỏ dấu) sống — tương đương (`stripDiacritics` đổi `Đ` → `D` rồi hạ). Cùng mẫu: `rg "stripDiacritics\|searchText\|toLowerCase\(\)\.includes"` → không còn ô tìm nào khác (`vi.ts` chỉ có `trash.search` và ô KH 6b); `report-workbook.ts:200` dùng `stripDiacritics` cho tên file, không phải ô tìm |

## 3. Phạm vi đã đọc

**Diff `37a80b6..5b1328a` của gói A** (`git diff --shortstat … -- packages/domain packages/db`: 14 file, +224 / −31 kể cả test và khối codemap; 3 commit: `75601dc` #1063 T-363, `e9f2eb1` #1072 T-368, `20c51e3` #1088 T-377): đọc từng hunk, cả sản phẩm (`backup-validation.ts`, `common.ts`, `customers.ts`, `trash.ts`, `domain/src/index.ts`, `domain/src/text.ts`, `domain/CLAUDE.md`) lẫn test (`ai-analyses.test.ts`, `backup-invariants.test.ts`, `backup.test.ts`, `common.test.ts`, `trash.test.ts`, `name-order.test.ts`, `text.test.ts`).

**91 file của `files-A.txt`:**

| Nhóm | Ai đọc, mức nào |
|---|---|
| `db/src`: `backup.ts`, `backup-validation.ts`, `common.ts`, `trash.ts`, `purge.ts`, `database.ts`, `migrations.ts`, `schema.ts`, `ids.ts`, `errors.ts`, `index.ts`, `sql-raw.d.ts`; `db/drizzle.config.ts` | phiên chính, đọc trọn |
| `db/src`: `appointments.ts`, `customers.ts`, `team.ts`, `person-references.ts`, `kyc.ts`, `ai-analyses.ts`, `counts.ts`, `settings.ts`, `policies.ts` | S2 đọc trọn (cùng đọc lại `common`, `trash`, `purge`, `backup*`, `ids`); phiên chính đọc các đoạn nối vào đợt sửa (`freeCode` `customers.ts:551-562`, `personUsage` `team.ts:75-125`, `isLabel` / `analysisLabelsFit` của `ai-analyses.ts`) |
| `domain/src`: `text.ts`, `name-order.ts` | phiên chính, đọc trọn |
| `domain/src`: `period`, `money`, `number`, `compare`, `stats`, `stage-snapshot`, `appointment-counts`, `customer-lifecycle`, `pipeline-stage`, `evidence-level`, `kyc`, `kyc-catalog`, `kyc-fact`, `kyc-gate`, `model`; `golden/{metrics,stage-snapshot,appointments}.fixture.ts`, `golden/metrics.fixture.test.ts`, `kyc-fact.test.ts` | S1 đọc trọn; phiên chính đọc lại các đoạn của CLR6-A2…A4 |
| Test của diff (7 file ở trên) | phiên chính, đọc từng hunk |

**Không đọc kỹ, và vì sao:**

- `db/src/seed.ts`, `seed-data.ts`: chỉ đọc lướt (khai báo, đầu file). Không đổi từ lượt 1; mọi dữ liệu đi qua lệnh (đầu `seed.ts`); `seed-invariants.test.ts` nhập mọi seed; lượt 3 đã chạy 7 ngày neo × 3 quy mô. Lượt này sinh lại dữ liệu bằng cây `37a80b6` và nhập bằng code ghim (K5), và S2 đo độ trôi đồng hồ seed (≤ 170 782 ms sau 12:00Z).
- `domain/src/index.ts`: chỉ re-export; `codemap:check` và `tsc` xanh (baseline; mục 6.1).
- `golden/kyc.fixture.ts` (S1 đọc dòng 1–60) và các `golden/*.fixture.test.ts` khác: K01–K15 kiểm bằng probe `s1\p02-golden.mjs` (172 / 172 khớp golden md ↔ fixture ↔ engine).
- Phần lớn 49 file test (ngoài 7 file của diff và `kyc-fact.test.ts`): không đọc từng dòng; chất lượng test đánh giá bằng đột biến — phiên chính 37 đột biến (mục 9.2), S1 54 (+ 8 chạy lại cả bộ 4 493 test), S2 5.
- `db/src/test-support.ts`: đọc danh sách export (`setup`, `errorOf`, `codeOf`, `d`, `byId`, `stageAtEndOfDay`).

**Chỗ gói khác nối vào (chỉ đọc chỗ nối):** `apps/desktop/src/routes/trash-view.ts:215-300` (`alike`, `byDeletion`, `toldApart`), `:336`, `:356` (`customer.withCode`); `apps/desktop/src/routes/team/team-view.ts:120-145` (9b); `apps/desktop/src/routes/appointments/appointment-form.ts:160-178`; `apps/desktop/src/data/app-data.ts:440-480` (`exportBackup`, `readBackup`); `apps/desktop/src/routes/SettingsBackup.tsx:60-95`; `apps/desktop/src/data/demo-snapshot.ts`; `apps/desktop/src/i18n/vi.ts` (khóa tìm, `settings.backup.exported`); `packages/ai/src/{schema.ts:120-150, web.ts:80-100, text-match.ts:40-56}` (các chỗ `trim()` còn lại); `apps/desktop/src/routes/customers/KycDialogs.tsx:226-234`; `apps/desktop/src/routes/overview/overview-view.ts:176-195`; `packages/ui/src/components/PeriodPicker.tsx:135`.

**Tài liệu:** `CLAUDE.md` gốc, `packages/{db,domain}/CLAUDE.md`, `.claude/rules/tests.md`; `phase-3-du-lieu.md:35`, `:70`, `:160-200`, `:205-222`; `common\{prompt-claude.md, known.md (phần 1–5), fixes.md (T-363, T-368, T-377), baseline.md, plan.md §4.1, §4.3}`; tổng hợp lượt 5 §6; báo cáo gốc Claude A lượt 5 (đủ), `docs/reviews/raw/2026-11-05/claude/E.md` (dòng K12, để không báo trùng).

## 4. Kịch bản đã thử

Probe ở `C:\workspace\deep-review-1-6-r6\claude\A\`, cwd = repo, code ở `5b1328a` trừ khi ghi khác; không chạy `pnpm`, không gọi dịch vụ AI, không mở trình duyệt, không chạy e2e, không đo trên exe.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| K1 | Tái hiện DR6-158 của lượt 5: bộ nhớ khóa đầy 20 000 tên, sắp 2 022 tên trộn chữ số (`r1\byname-past-max.mjs`) | 1 thứ tự / 20 lần xáo | — |
| K2 | Gỡ phần sửa DR6-158 / 159 và biến thể gần, cả gói (`r1\mut-r1.mjs`, 9 đột biến) | 6 bị giết, 3 sống (chỉ bộ nhớ / thời gian) | — |
| K3 | Tái hiện DR6-159: nhãn model chỉ có ký tự vô hình qua `isLabel`, luật 12, `importBackup` (`r1\label-blank*.mjs`) | Từ chối cả bảy ký tự; `glm-5.3` nhận | — |
| K4 | DR6-160 phần A: mã KH của 94 dòng lịch hẹn / HĐ trong Thùng rác dữ liệu tải; tái hiện CLR5-A1 qua `openAppData`, rồi xóa thêm KH thứ hai (`r1\trash-code.mjs`) | Mã sai 0; tên nút trùng 0 | — |
| K5 | File app cũ (K50): sinh bằng cây `37a80b6` (dữ liệu tải + Thùng rác, demo + Thùng rác, demo), file lượt 4, dữ liệu tải lượt 6 → nhập bằng code ghim (`gen\gen.mjs`, `gen\import.mjs`) | ACCEPTED cả 6 | — |
| K6 | Gỡ phần sửa luật 15, mã KH của "Thuộc", `searchText` và biến thể (`r1\mut-r2.mjs`, 10 đột biến) | 9 bị giết, 1 sống tương đương | — |
| K7 | Họ "hỏi trống bằng `trim()`" trên toàn repo (`rg`, mục 2.1 dòng DR6-159) | Không còn chỗ nào trong code sản phẩm | — |
| K8 | Thùng rác: hai KH / nhân sự / team tên chỉ khác hoa / thường (`r1\trash-case.mjs`, `trash-case2.mjs`) và hai KH tên chỉ khác chỗ đặt dấu thanh "Thuý" / "Thúy" (`r1\trash-tone.mjs`), qua `openAppData` | Tên nút khác nhau chỉ ở hoa / thường hay chỗ đặt dấu; không thêm mã / giờ xóa | **CLR6-A1** |
| K9 | Ô tìm khác ngoài hai ô của DR6-172 (`rg "stripDiacritics\|searchText\|…"`, khóa `vi.ts`) | Không có | — |
| K10 | `tsc --noEmit --noUnusedLocals --noUnusedParameters` cho `packages/domain`, `packages/db` (`k\tsc-*.log`) | exit 0 cả hai | — |
| K11 | 16 đột biến lấy mẫu trục T ở code không đổi mà phiên chính đọc: `backup.ts`, `backup-validation.ts`, `trash.ts`, `purge.ts`, `text.ts` (`k\mut-k.mjs`) | 14 bị giết, 2 sống (K12, mục 8 trục T) | — |
| K12 | Dòng Thùng rác cùng mốc xóa (để xét đột biến `K-trash-tie-reversed` sống): dữ liệu tải và seed demo + Thùng rác (`k\ties.mjs`) | 0 / 113 và 0 / 73 dòng chung mốc: đột biến không đổi dữ liệu thật nào | — |
| K13 | Thứ tự luật nhập liên bảng: hai đột biến của S2 chạy lại trên `packages/domain`, `packages/db`, `apps/desktop/src/data` (`k2\mut-order.mjs`) | Cả hai sống, 1 726 / 1 726 test xanh | **CLR6-A6** |
| K14 | Hiệu năng lớp `db` / `domain` trên dữ liệu tải: code `37a80b6` ↔ `5b1328a` xen kẽ, 3 vòng (`perf\run6.mjs`, `perf\p-r6.mjs`) | Không dòng nào quá luật nhiễu (mục 6.2) | — |
| K15 | (S1) `customRangeMaxEnd`, `canShift` / `shift` Tùy chọn, `switchKind`, `comparisonWindows`, `weekdayOf`, `chartMarks` / `reportMarks` vét toàn miền 01/01/1900–31/12/2100 so oracle tự viết (`s1\p01-period.mjs`, `p06-marks-cap.mjs`) | 0 lệch trên 73 414 ngày / 375 950 ca / 293 656 ca | — |
| K16 | (S1) Golden md ↔ fixture ↔ engine: G01–G22, A01–A13, S01–S13, K01–K15; câu hỏi KYC ↔ `kyc.md` §3 (`s1\p02-golden.mjs`, `p05-questions.mjs`) | 172 / 172 khớp; câu hỏi khớp từng chữ | — |
| K17 | (S1) Fuzz so sánh chéo 300 vòng: `…ByScope` / `…ByMark` / `…Series` ↔ bản một kỳ; Σ team + RE không team = Toàn bộ (`s1\p04-fuzz.mjs`) | 54 210 phép kiểm, 0 lệch | — |
| K18 | (S1) `parseVnd` ≈ 70 chuỗi mới, `formatVndCompact` quanh biên, `formatPercent` nửa âm, `normalizeKycValue` biên (`s1\p03-money.mjs`) | Đúng luật doc comment | — |
| K19 | (S1) 54 đột biến domain, 8 đột biến sống chạy lại cả bộ 4 493 test (`s1\s1-mut-domain.mjs`, `s1-mut-survivors.mjs`) | 3 sống không tương đương | **CLR6-A2**, **A3**, **A4** |
| K20 | (S2) Chuỗi nhân sự: bàn giao, xóa RE / IS phối hợp, khôi phục sai rồi đúng thứ tự, dời lịch; đánh giá TL → RE; xóa KH / RE / TL / team rồi tạo lại team cùng tên (`s2\p1-people-chains.mjs`) | Lệnh từ chối đúng câu TR-1 / TR-2 / E14–E16; mỗi bước nhập nhận, `blocked` của Thùng rác ↔ lệnh lệch 0 | — |
| K21 | (S2) Chuỗi KYC: mâu thuẫn năm sinh / giới tính, đổi hồ sơ, giải quyết bằng fact RE / SYSTEM, xóa / khôi phục KH, ghi chú ghi lùi trước ngày tạo KH (`s2\p2-kyc-chains.mjs`) | Luật 7 / 8 nhận mọi bước; roundTrip nhận | — |
| K22 | (S2) Xóa → khôi phục → xóa lại cuộc gặp Đã gặp cùng mili giây, đồng hồ lùi (`s2\p3-same-ms.mjs`) | Dữ liệu vẫn hợp lệ, nhập nhận (cần trùng đúng mili giây) | — |
| K23 | (S2) Cỡ bản xuất ↔ trần nhập 100 MB: dữ liệu tải; 11 ghi chú KYC 10 000 000 ký tự qua lệnh (`s2\p4-export-over-limit.mjs`) | Xuất 110 003 682 ký tự; nhập lại `BACKUP_TOO_LARGE` | **CLR6-A5** |
| K24 | (S2) Fuzz 13 000 bước lệnh công khai (6 seed), có / không Dọn sạch, đồng hồ đứng / lùi, xuất → nhập → làm tiếp (`s2\p6-fuzz.mjs`) | ≈ 8 985 lệnh nhận, 0 vấn đề | — |
| K25 | (S2) Emoji ZWJ / VS16 / tag, NFD, ZWNJ, U+2028, U+0085 qua tên, chữ tùy chọn của lịch, ghi chú, giá trị KYC (`s2\p7-text.mjs`) | Theo K20 / K25 (KNOWN); nhập nhận | — |

## 5. Phát hiện mới

Sáu phát hiện, cả sáu CONFIRMED; 0 Critical / High / Medium; 0 KNOWN có bằng chứng mới. CLR6-A1 do phiên chính tìm; A2–A4 do S1, A5–A6 do S2 tìm, phiên chính kiểm lại.

### CLR6-A1 — Thùng rác: hai KH / nhân sự / team tên chỉ khác hoa / thường hay chỗ đặt dấu thanh có tên nút khôi phục đọc như nhau

```
ID: CLR6-A1
Mức: Nit
Trục: A
Vị trí: apps/desktop/src/routes/trash-view.ts:222 (alike: đếm theo khóa đúng chữ), :258 (toldApart), :269 (namesakes: KH của lịch hẹn / HĐ), :271 (KH cùng nhóm, DR6-151), :278 (nhân sự), :280 (team); dữ liệu từ packages/db/src/trash.ts:38, :267-270 (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-160 (#1050 → #1072, #1082 → #1088), DR6-151, DR6-119 · có từ trước, lượt 1–5 bỏ sót (lượt 5 Claude E, K12, đã thử cặp hoa / thường và không ghi: "nút đọc giống như hai ô")
```

- **Mô tả:** `toldApart` coi hai tên là "trùng" chỉ khi đúng từng chữ (`alike` đếm theo khóa chuỗi). Hai KH "Trần Thu Hà" / "trần thu hà", hay "Nguyễn Thị Thuý" / "Nguyễn Thị Thúy" (hai cách đặt dấu thanh của bộ gõ; NFD `… 75 79 301` / `… 75 301 79`), không được tính là trùng, nên lịch hẹn / HĐ của họ không thêm mã KH, và tên nút khôi phục chỉ khác hoa / thường hay chỗ đặt dấu. Trình đọc màn hình đọc hai tên nút như nhau, mắt thường gần như không phân biệt cặp dấu thanh. Cùng mẫu ở dòng KH (cùng nhóm), nhân sự (cùng vai trò, team) và team.
- **Tái hiện / bằng chứng:** qua `openAppData` (seed demo neo 12/10/2026), lệnh qua `app.run`, đọc như `SettingsTrash` (`listTrash(app.db())`, `toldApart`, `restoreLabel`):
  - `r1\trash-case.mjs` (`trash-case.log`): "Khôi phục lịch hẹn 20/10/2026 09:00 · Dự kiến của KH Trần Thu Hà" / "… của KH trần thu hà", HĐ tương tự; `trùng đúng chữ: 0 · trùng khi bỏ hoa / thường: 2`.
  - `r1\trash-case2.mjs`: "Khôi phục team Sao Khuê" / "… sao khuê"; "Khôi phục nhân sự Phạm Hữu Lộc · IS" / "… PHẠM HỮU LỘC · IS"; "Khôi phục KH Lê Văn Bảo · N3" / "… lê văn bảo · N3"; `trùng khi bỏ hoa / thường: 3`.
  - `r1\trash-tone.mjs`: "… Đã nộp của KH Nguyễn Thị Thúy" / "… Nguyễn Thị Thuý", lịch hẹn tương tự, không mã.
  - Đối chiếu: cùng tên đúng chữ thì có mã (K4: "(K-72DQ)" / "(K-0X18)").
- **Cùng mẫu:** `rg -n "alike\(" apps/desktop/src/routes/trash-view.ts` → `:243`, `:244` (trong `byDeletion`), `:269`, `:271`; khóa nhân sự `:278`, team `:280`: cả bốn khóa so đúng chữ. `rg -n "withCode" apps/desktop/src/routes` → thêm hộp 9b (`apps/desktop/src/routes/team/team-view.ts:126-134`: chỉ thêm mã khi `names.indexOf(name) !== names.lastIndexOf(name)`, cũng đúng chữ); ở 9b hai tên nằm trong một câu (không phải hai nút), nên chỉ là cùng mẫu, nhẹ hơn. Ô tìm (`searchText`) coi các cặp này là một (bỏ dấu, hạ chữ), nên Thùng rác tìm ra cả hai mà nút không tách.
- **Ảnh hưởng:** người dùng trình đọc màn hình ở Thùng rác, khi hai KH (hay nhân sự, team) tên chỉ khác hoa / thường hay kiểu đặt dấu cùng có dòng trùng ngày giờ / trạng thái / FYP (hay cùng nhóm, vai trò, team). Không sai dữ liệu.
- **Chặn phát hành:** không — Nit trục A (K48).
- **Đề xuất:** khóa "trùng" của `toldApart` (và của 9b) so theo một dạng đọc, vd. `searchText` của `@p2c/domain` (bỏ dấu, hạ chữ: rộng hơn cần, nhưng thêm mã / giờ xóa thừa chỉ là thêm chữ), hoặc `toLocaleLowerCase('vi')` + sắp lại dấu thanh; một chỗ cho cả bốn khóa. ≈ 4–6 dòng SP + 3 ca unit (`trash-view.test.ts`). Mở rộng Q1 (a) là quyết định của Owner.

### CLR6-A2 — `switchKind`: không test nào giữ ca "hôm nay là ngày cuối của kỳ đang xem" (S1 tìm)

```
ID: CLR6-A2
Mức: Low
Trục: T
Vị trí: packages/domain/src/period.ts:390 (switchKind, vế `day <= toDayNumber(period.end)`); test packages/domain/src/period.test.ts:362-375 (describe 'switchKind', hôm nay cố định 28/09/2026); nơi dùng packages/ui/src/components/PeriodPicker.tsx:135 (5b1328a)
Tình trạng: CONFIRMED
Liên quan: có từ trước, lượt 1–5 bỏ sót (P7 của lượt 1 chỉ đột biến "luôn neo ngày đầu")
```

- **Mô tả:** đổi loại kỳ (Ngày / Tuần / Tháng / Năm ở bộ chọn kỳ của Tổng quan, Lịch hẹn, Báo cáo) neo theo hôm nay khi hôm nay nằm trong kỳ đang xem. Test chỉ dùng 28/09/2026 (giữa tuần, giữa tháng), nên đột biến `day <= end` → `day < end` sống qua **cả 4 493 test** của repo.
- **Tái hiện / bằng chứng:** `s1\s1-mut-survivors.mjs` (đột biến `s1-P04-switch-last-day-all`, định nghĩa `s1\s1-mut-domain.mjs:10`, chạy cả bộ) → `s1\mut-s1-mut-survivors.log`: `SURVIVED served=1 4493 passed (4493)`. Hệ quả (`s1\p07-mutant-effects.log`, cây chép `s1\tree\`): tuần 02/11–08/11 → Ngày (hôm nay Chủ Nhật 08/11): code ghim `08/11/2026`, đột biến `02/11/2026`; tháng 11/2026 → Tuần (hôm nay 30/11): `30/11 – 06/12/2026` ↔ `26/10 – 01/11/2026`; năm 2026 → Tháng (hôm nay 31/12): `12/2026` ↔ `01/2026`. Phiên chính đọc lại `period.ts:379-392`, `period.test.ts:362-375`: khớp.
- **Cùng mẫu:** `rg "<= day && day <=|isInPeriod\(today|compareDates\(today, period\.(start|end)\)"` (S1): `period.ts:185` (`isInPeriod`, có ca biên) và `:390` (viết lại tại chỗ, không ca biên); `compare.ts:34`, `:37`, `stage-snapshot.ts:16-17` có ca biên (đột biến `s1-C01`, `s1-T02` bị giết). Vế `start <= day` của `:390` là đột biến tương đương.
- **Ảnh hưởng:** code hiện đúng. Hồi quy ở vế này làm đổi loại kỳ vào Chủ Nhật, ngày cuối tháng hay 31/12 nhảy về đầu kỳ thay vì hôm nay, CI vẫn xanh.
- **Chặn phát hành:** không — Low trục T (K48).
- **Đề xuất:** một ca với hôm nay = ngày cuối của tuần / tháng / năm đang xem; hoặc `switchKind` gọi `isInPeriod(today, period)` thay biểu thức viết tay (một đường, có ca biên). ≈ 0–1 dòng SP + 6 dòng test.

### CLR6-A3 — `metricDeltas`: điểm % của Tỉ lệ chốt không ca nào có tỉ lệ lẻ (S1 tìm)

```
ID: CLR6-A3
Mức: Low
Trục: T
Vị trí: packages/domain/src/compare.ts:69-72 (closeRatePoints = closeRatePercent(current) − closeRatePercent(previous)); doc packages/domain/src/stats.ts:152; test packages/domain/src/compare.test.ts:208-223; nơi dùng apps/desktop/src/routes/overview/overview-view.ts:180-192 (5b1328a)
Tình trạng: CONFIRMED
Liên quan: có từ trước, lượt 1–5 bỏ sót (C3 của lượt 1 chỉ đột biến nhánh null)
```

- **Mô tả:** mọi ca của `metricDeltas` dùng tỉ lệ tròn (75 / 50 / 0 / 50 %), nên đột biến "làm tròn từng tỉ lệ rồi mới trừ" sống qua cả bộ test, kể cả `overview-view.test.ts`.
- **Tái hiện / bằng chứng:** `s1-C02-points-ratio-all` (`Math.round(closeRatePercent(current.closeRate)) - Math.round(closeRatePercent(previous.closeRate))`, `s1\s1-mut-domain.mjs:41`) → `SURVIVED served=1 4493 passed (4493)`. Hệ quả (`s1\p07-mutant-effects.log`): 2/3 sau 1/3 → code ghim 33,33… ("33,3 điểm"), đột biến 34 ("34 điểm"); 1/8 sau 1/16 → 6,25 ("6,3 điểm") ↔ 7 ("7 điểm"). Phiên chính đọc lại `compare.ts:62-74`, `compare.test.ts:200-224`, `stats.ts:152-155`: khớp.
- **Cùng mẫu:** `rg "closeRatePercent|closeRatePoints"` → chỉ `compare.ts:71` trừ hai tỉ lệ; `overview-view.ts:180-192` chỉ định dạng. Không chỗ nào khác tự tính điểm %.
- **Ảnh hưởng:** code hiện đúng; hồi quy làm ô KPI Tỉ lệ chốt ở Tổng quan ghi "▲ 34 điểm" thay "▲ 33,3 điểm" (sai hiển thị), CI xanh.
- **Chặn phát hành:** không — Low trục T.
- **Đề xuất:** một ca 2/3 sau 1/3 → `toBeCloseTo(33.33, 2)` (hoặc so chuỗi qua `formatPercent`). ≈ 3 dòng test.

### CLR6-A4 — `normalizeKycValue`: không ca nào giữ việc trường số từ chối chữ rỗng / chỉ có ký tự vô hình (S1 tìm)

```
ID: CLR6-A4
Mức: Low
Trục: T
Vị trí: packages/domain/src/kyc-fact.ts:51 (`/^\d+$/.test(text)` của trường integer); test packages/domain/src/kyc-fact.test.ts:25-33 ('refuses a value of the wrong type') (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-126 (lượt 3, CL3-A17: đột biến KF3 bỏ neo; ca thêm khi đó không có chữ rỗng) · có từ trước, biến thể gần
```

- **Mô tả:** đột biến `\d+` → `\d*` làm `""`, U+200B và `"   "` của `childrenCount` / `birthYear` thành `0` (`Number('') = 0`) và sống qua cả 4 493 test. Ca "refuses a value of the wrong type" có `'   '` nhưng chỉ cho trường chữ (`occupation`).
- **Tái hiện / bằng chứng:** `s1-F01-int-empty-zero-all` (`s1\s1-mut-domain.mjs:50`) → `SURVIVED served=1 4493 passed (4493)`; `s1\p07-mutant-effects.log`: code ghim `normalizeKycValue('childrenCount', "" | "\u200B" | "   ")` → `RangeError` cả ba; đột biến → `0`, `0`, `0`. Phiên chính đọc lại `kyc-fact.ts:38-62`, `kyc-fact.test.ts:20-40`: khớp.
- **Cùng mẫu:** Grep `/\^\\d[+*{]` trên `{apps,packages}/**/*.{ts,tsx}` (phiên chính) → `kyc-fact.ts:51` (chỗ duy nhất đọc số nguyên từ chữ tự do), `backup-validation.ts:38` và `customers-view.ts:163` (`^\d{4}$`, không nhận chữ rỗng). Nhập backup vẫn từ chối dù có hồi quy (`validKycValue` đòi `normalizeKycValue(v) === v`, `0 !== ""`); ô 3f chặn rỗng trước (`KycDialogs.tsx:230`, `normalizeText(value) === ''`).
- **Ảnh hưởng:** code hiện đúng; hồi quy để lệnh `confirmKycFact` / đề xuất có giá trị rỗng ghi "0 con" vào trường cốt lõi mà CI không báo.
- **Chặn phát hành:** không — Low trục T (không đường nào sai dữ liệu ở SHA ghim).
- **Đề xuất:** thêm `refuses('childrenCount', '')`, `'\u200B'`, `'   '` vào ca có sẵn. ≈ 3 dòng test.

### CLR6-A5 — Bản xuất `.p2cbackup` của chính app có thể không nhập lại được: xuất không giữ trần 100 MB mà nhập đòi (S2 tìm)

```
ID: CLR6-A5
Mức: Low
Trục: D
Vị trí: packages/db/src/backup.ts:44 (exportBackup: không kiểm cỡ), :81 (importBackup: text.length > MAX_BACKUP_BYTES → BACKUP_TOO_LARGE); apps/desktop/src/data/app-data.ts:456-461 (exportBackup của app tính `size` mà không so trần); apps/desktop/src/routes/SettingsBackup.tsx:75 (nhập: file.size > MAX_BACKUP_BYTES → hộp 10b) (5b1328a)
Tình trạng: CONFIRMED (lớp lệnh `db`; đường exe / IPC ghi file lớn không chạy)
Liên quan: trần 100 MB (Owner 30/09/2026, #203; spec phase-3-du-lieu.md:215) · có từ trước, lượt 1–5 bỏ sót (lượt 1 chỉ đối chiếu trần UI ↔ `db` ở phía nhập)
```

- **Mô tả:** spec đặt trần 100 MB chỉ cho phía nhập ("file lớn hơn `MAX_BACKUP_BYTES` bị từ chối ngay"). Không lệnh nào trần độ dài chữ (tên, ghi chú KYC, giá trị KYC, chữ tùy chọn của lịch; không ô nào có `maxLength`: `rg "maxLength" apps/desktop/src packages/ui/src` → 0) hay số dòng, và xuất backup ghi file bất kể cỡ, không cảnh báo. Khi dữ liệu vượt trần, xuất thành công ("Đã xuất backup: … · <cỡ>") nhưng file không nhập lại được ở máy nào, kể cả máy vừa xuất; người dùng chỉ biết khi cần khôi phục / chuyển máy (K12).
- **Tái hiện / bằng chứng:** `s2\p4-export-over-limit.mjs` (`node --max-old-space-size=8192 --import …\hooks.mjs`), log `s2\p4-export-over-limit.log`: (a) dữ liệu tải xuất 15 676 559 ký tự / 16 034 517 byte = 0,153 trần; (b) DB dựng bằng lệnh: 11 lần `recordKycNote` 10 000 000 ký tự → `OK` cả 11; `exportBackup` → 110 003 682 ký tự; `importBackup(exportBackup(d))` → `BACKUP_TOO_LARGE {"limitMb":100}`. Phiên chính đọc lại `backup.ts:44-66`, `:76-83`, `app-data.ts:456-461`, `SettingsBackup.tsx:73-79`: xuất không có nhánh nào so cỡ; nhập từ chối trước khi parse.
- **Cùng mẫu:** `rg "const MAX_[A-Z_]* *=" packages/*/src apps/desktop/src apps/desktop/src-tauri/src` (S2): trần chỉ ở phía đọc mà phía ghi không giữ — chỉ `MAX_BACKUP_BYTES`. `MAX_AI_RAW_OUTPUT` cắt lúc ghi (khớp CHECK), `MAX_FEE_VND` ở lệnh + nhập, `MAX_MODEL` từ danh sách cố định; `MAX_MESSAGE_CHARS` (`packages/ai/src/run.ts`, Rust `ai.rs`) có câu báo riêng `AI_TOO_LARGE` trước khi gọi (có chủ ý). Rust `storage.rs` không trần khi ghi file xuất.
- **Ảnh hưởng:** xuất / nhập `.p2cbackup` là đường chuyển dữ liệu giữa hai máy (K12) và khôi phục bằng file. Ngưỡng ≈ 6,5× dữ liệu tải (≈ 9 700 KH giàu như dữ liệu tải, hay ≈ 29 000 phân tích AI ở ≈ 3,4 KB / dòng, hay vài ghi chú dán rất dài). Với dữ liệu v1.0 (giả lập, ≤ 16 MB) chưa chạm được; với dữ liệu thật nhiều năm, app chạm ngưỡng hiệu năng (`phase-6.md`: mở dữ liệu ≈ 600 ms ở ≈ 2× dữ liệu tải) trước khi chạm trần, nhưng trần là lỗi cứng, không có đường vòng trong app (`project2c.db` và `backups\*.db` vẫn còn, chép tay được). Lỗi hiện rõ lúc nhập (hộp 10b), không sai dữ liệu lặng lẽ.
- **Chặn phát hành:** có — theo chữ K48 (Low ở trục D: bản xuất và luật nhập không cùng luật, bản backup của app không khôi phục được). Phiên tổng hợp có thể hạ: chưa chạm được với dữ liệu v1.0, lỗi hiện rõ, có `.db` để chép.
- **Đề xuất:** một hằng chung cho cả hai phía: `exportBackup` của app so số byte với `MAX_BACKUP_BYTES` và báo bằng câu riêng (vd. dữ liệu quá 100 MB, file này không nhập lại được, dùng bản `.db` trong `backups\`), hoặc đổi trần nhập theo cỡ app xuất được (Owner chọn). Không sửa trước v1.0 (K49) thì ghi một dòng vào spec / hướng dẫn. ≈ 10–15 dòng SP + 1 ca unit (app-data) + 1 khóa i18n.

### CLR6-A6 — Không test nào ghim thứ tự kiểm các luật nhập liên bảng (`params.rule` = luật đầu tiên bị vi phạm) (S2 tìm, phiên chính chạy lại)

```
ID: CLR6-A6
Mức: Nit
Trục: T
Vị trí: packages/db/src/backup-validation.ts:180-189 (chuỗi `??` của validateBackupInvariants; doc :168-174 "the first rule of spec §6 broken"); spec docs/design/phase-3-du-lieu.md:222 (luật 15 "sau luật 1–14") (5b1328a)
Tình trạng: CONFIRMED
Liên quan: T-368 / PR #1072 (vế luật 15) · thứ tự luật 1–14 có từ trước, lượt 1–5 bỏ sót
```

- **Mô tả:** mỗi ca hỏng của `backup-invariants.test.ts` chỉ phá đúng một luật, nên đổi thứ tự trong chuỗi `??` (đưa luật 15 lên đầu, hay đổi chỗ luật 5 ↔ luật 6–8) vẫn xanh, dù doc và spec hứa số của luật đầu tiên bị vi phạm.
- **Tái hiện / bằng chứng:** S2 (`s2\mut-s2.mjs`, `s2\mut-s2b.mjs`, trên `backup-invariants.test.ts` + `backup.test.ts`): `s2-code-rule-first SURVIVED 283 passed (283)`, `s2-rule-order-5-6 SURVIVED 283 passed (283)`. Phiên chính chạy lại hai đột biến trên cả `packages/domain`, `packages/db` và `apps/desktop/src/data` (`app-data.test.ts` đọc `params.rule`): `k2\mut-order.mjs` → `K2-code-rule-first SURVIVED 1726 passed (1726)`, `K2-rule-order-5-6 SURVIVED 1726 passed (1726)` (`k2\mut-order.stdout.txt`).
- **Cùng mẫu:** mọi cặp luật trong chuỗi `??` (`backup-validation.ts:181-188`); luật giá trị (`validateBackupValues`) không mang số nên ngoài họ này.
- **Ảnh hưởng:** chỉ số `rule` trong `params` (chẩn đoán, test); hộp 10b không hiện số luật (`rg "BACKUP_INVALID" apps/desktop/src` → câu chung). Không người dùng nào thấy.
- **Chặn phát hành:** không — Nit trục T.
- **Đề xuất:** 1–2 ca file phá hai luật cùng lúc (vd. 4 + 15, 5 + 7), chờ số nhỏ hơn. ≈ 10 dòng test.

## 6. Bloat và Hiệu năng (không bắt buộc ở gói A; ghi số đã đo)

### 6.1 Bloat

| Đã chạy / đo | Trên | Kết quả | ID |
|---|---|---|---|
| `node node_modules/typescript/bin/tsc -p packages/{domain,db}/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` | src + test của hai package | exit 0 cả hai (`k\tsc-*.log`) | — |
| Export mới của đợt sửa ↔ nơi dùng | `searchText` (domain), `TrashOwner.customer.code`, `Rule` 15 | `searchText`: hai ô tìm; `code`: `trash-view.ts:356` (`customer.withCode`); luật 15 không thêm export (`CUSTOMER_CODE` cục bộ). Không export thừa mới | — |
| Hằng chép hai nơi | khuôn mã KH: regex `backup-validation.ts:193` ↔ bảng `CROCKFORD_BASE32` `ids.ts:3` | Hai nơi, nhưng `seed-invariants.test.ts` nhập mọi seed (mã do `freeCode` sinh), nên đổi bảng mà quên regex thì đỏ; không đề xuất | — |
| Cỡ gói A (`baseline.md`) | `37a80b6` → `5b1328a` | SP 8 781 (+33), test 15 965 (+160), sinh 341 (0), 104 file (0); diff sửa SP +41 / −8 (6 file), test +182 / −22 (7 file) | — |
| Dependency | `git diff 37a80b6 5b1328a -- packages/{db,domain}/package.json` | rỗng (`git diff --stat` của gói chỉ có file `src/` và `CLAUDE.md`) | — |

### 6.2 Hiệu năng

Home PC `DESKTOP-KDURKJP`, Node v24.20.0, 07/11/2026 12:52–12:54 (+07:00). `perf\run6.mjs` chạy `perf\p-r6.mjs` (= `p-r5.mjs` của lượt 5, chỉ đổi đường dẫn) 3 vòng, mỗi vòng xen kẽ code `37a80b6` (cây `gen\tree-37a80b6\`) và code ghim, cùng file dữ liệu tải lượt 6; mỗi phép đo trung vị của n lần sau một lần khởi động; bảng lấy trung vị 3 vòng (`perf\runs.jsonl`, `perf\run6.out.txt`). CPU máy 2 s trước mỗi lần 2,0–4,5 %. Chạy song song: tiến trình Codex (`codex.exe`, phiên Codex của lượt 6 ở `-review-2`), app desktop Claude; không e2e, không build, không exe. Luật nhiễu: xấu hơn khi > 20 % **và** > 10 ms.

| Đo (Node, dữ liệu tải) | `37a80b6` | `5b1328a` | Δ | Ngưỡng / kết luận |
|---|---:|---:|---|---|
| `importBackup` | 878,12 ms | 861,77 | −16,35 ms (−2 %) | ✅ dưới luật nhiễu |
| — `validateBackupValues` / `validateBackupInvariants` (có luật 15) | 214,47 / 193,97 | 209,90 / 189,64 | −2 % / −2 % | ✅ |
| `exportBackup` | 183,49 | 187,10 | +3,61 ms (+2 %) | ✅ |
| `countRecords` / `listCustomers` / `listStageTransitions` / `listAppointments` | 4,79 / 5,63 / 10,59 / 46,51 | 4,89 / 5,37 / 10,37 / 47,17 | ≤ +0,66 ms | ✅ |
| `listTrash` 113 dòng (có `code` ở "Thuộc") / `previewPurge` | 25,37 / 0,76 | 24,26 / 0,78 | −1,11 / +0,02 | ✅ |
| `listTrash` / `previewPurge` / `personUsage`, Thùng rác + 1 200 KH | 149,13 / 6,03 / 3,60 | 148,28 / 6,04 / 3,85 | ≤ +0,25 ms | màn < 200 ✅ |
| `purgeTrash` cả `VACUUM`: dữ liệu tải / + 1 200 KH | 88,92 / 127,33 | 88,20 / 126,58 | −0,72 / −0,75 | ≤ 500 ✅ |
| `byName`: sắp 1 481 tên KH | 1,39 | 1,44 | +0,05 | ✅ (DR6-136 giữ) |
| `normalizeText` + `normalizeNote` (tên, ghi chú) | 9,01 | 8,98 | −0,03 | ✅ |
| Lệnh `scheduleAppointment` / `recordMeetingOutcome` / `softDelete…` / `restore…` | 0,23 / 0,26 / 0,13 / 0,17 | 0,24 / 0,29 / 0,15 / 0,18 | ≤ +0,03 ms | ✅ |

Số exe (probe `e2e/perf`, Dọn sạch, mở app) ở `common\baseline.md`: không dòng nào ⚠️ so mốc sau #656, G7, lượt 5; gói A không đo lại trên exe. **Không phát hiện P ở gói A.**

## 7. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | 0 |
| Low | | | A5 | | | | | A2, A3, A4 | | 4 |
| Nit | | | | | | | | A6 | A1 | 2 |
| **Tổng** | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 4 | 1 | **6** |

- 6 / 6 CONFIRMED, 0 PLAUSIBLE, 0 KNOWN có bằng chứng mới.
- Đề xuất chặn phát hành (K48): **1** (CLR6-A5, Low · D, kèm lý do để phiên tổng hợp xét hạ); không chặn: 5.
- Trục R: 3 / 3 dòng R1 và 1 / 1 dòng R2 **ĐÃ SỬA**; không SỬA MỘT PHẦN, CHƯA SỬA hay HỒI QUY. Biến thể còn hở của DR6-160 → CLR6-A1.

## 8. Đã xét, không thấy (theo trục)

- **E:** `byName` quá trần 20 000 khóa (K1); nhãn model chỉ có ký tự vô hình (K3); mã KH ở hai đầu và các khe của bảng Crockford (`K-0HJZ`, `K-PTVX`… nhận), dấu cách / chữ thường / I L O U / chữ số toàn khổ (từ chối; test của #1072 và đột biến K6); file của app cũ (K5); domain vét toàn miền 1900–2100, 29/02, tuần cắt 2100, Tùy chọn ngược / quá trần, tiền quanh trần 100 tỷ, "1tr05", chữ số toàn khổ / Ả Rập (K15, K18); cùng mili giây, đồng hồ đứng / lùi (K22, K24); hai dòng Thùng rác cùng mốc xóa (K12: không có trong dữ liệu). Nhập backup trên máy có đồng hồ chậm hơn máy xuất quanh nửa đêm bị luật 10 từ chối bản ghi "hôm nay" của máy kia: đúng luật F-11 (theo đồng hồ máy nhập), cần đồng hồ lệch — cùng loại DR6-53, không ghi.
- **C:** luật 15 ↔ `phase-3-du-lieu.md:70`, `:215`, `:222`; `searchText` ↔ doc và Issue #1082; golden 172 / 172 (K16); TR-1 / TR-2 / E14–E16 ↔ câu lỗi (K20); câu hỏi KYC ↔ `kyc.md` §3 từng chữ. Ngoài A5 (spec chỉ đặt trần phía nhập): không thấy.
- **D:** lệnh nhận ⇒ nhập nhận, lệnh từ chối không đổi bản xuất, trên mọi chuỗi và 13 000 bước fuzz (K20–K24); file app cũ nhập được (K5); chuẩn hóa chữ ở lệnh ↔ luật nhập cùng hàm (S2: tên `requireName` ↔ `storedAs(requireName)`, ghi chú `cleanNote` ↔ `requireNote`, giá trị KYC `normalizeKycValue` hai phía, chữ tùy chọn `optionalText` hai phía, nhãn `isLabel` hai phía); Dọn sạch không để tham chiếu treo (fuzz có dọn). Ngoài A5: không thấy.
- **G:** gói A chỉ lưu kết quả AI: `isLabel` / luật 12 (DR6-159), luật 11–14 hai phía khớp (S2). Không thấy.
- **S:** mọi cột chữ lúc nạp qua `readsBackAsIs` (code không đổi từ lượt 5, K7 của lượt 5); câu SQL của `trash.ts`, `purge.ts`, `backup-validation.ts` chỉ ghép hằng, tên bảng của schema hay ngày đã chuẩn hóa, giá trị bind qua tham số (`json_each`, `$appointments`); bản xuất chỉ có dòng `settings` khóa `ai` (`rg "getSetting\|putSetting"`), không key. Không thấy.
- **P:** mục 6.2. Không thấy.
- **B:** mục 6.1. Không thấy.
- **T:** ngoài A2, A3, A4, A6: đột biến của phiên chính 37, 29 bị giết; 8 sống đều tương đương hay chỉ đổi bộ nhớ / thời gian / dữ liệu không có thật: `R158-past-max-nocache`, `R158-never-clear`, `R158-digit-uncached`, `T377-search-lower-last`, `K-size-ge` (chỉ khác ở đúng 104 857 600 ký tự: ca có sẵn dùng trần + 1), `K-trash-tie-reversed` (không dữ liệu nào có hai dòng cùng mốc xóa, K12), và hai đột biến thứ tự luật (→ A6). S1: 45 / 54 bị giết ngay, 3 trong 8 sống chạy lại bị giết; còn A2–A4 và 3 sống tương đương. S2: 3 / 5 bị giết, 2 sống → A6.
- **A:** gói A không có UI; tên nút Thùng rác đọc từ `TrashRow` → A1. Không mã `DbError` mới (luật 15 dùng `BACKUP_INVALID` có câu sẵn).

## 9. Phụ lục

### 9.1 Nơi để bằng chứng

Mọi file ở `C:\workspace\deep-review-1-6-r6\claude\A\`. Repo chỉ đọc; vitest gọi thẳng `node node_modules/vitest/vitest.mjs` trong worktree (qua `mut.mjs`), không `pnpm`.

| Thư mục / file | Việc |
|---|---|
| `hooks.mjs`, `mut.mjs`, `mutant-config.mjs` | chép từ `deep-review-1-6-r5\claude\A\` (đổi chú thích, `LOAD`) |
| `r1\` | `byname-past-max.mjs` (+ `.log`), `label-blank.mjs`, `label-blank-import.mjs` (+ `.log`), `trash-code.mjs` (+ `.log`), `trash-case.mjs`, `trash-case2.mjs`, `trash-tone.mjs` (+ `.log`), `mut-r1.mjs`, `mut-r2.mjs` (+ `.stdout.txt`), `name-order.2e51e25.ts`, `common.37a80b6.ts` (bản cũ để so) |
| `gen\` | `gen.mjs`, `import.mjs` (chép lượt 5), `tree-37a80b6\` (`git archive 37a80b6 packages/{domain,db,ai}/src packages/db/migrations`), `r5-load-trash.p2cbackup`, `r5-demo-trash.p2cbackup`, `r5-demo.p2cbackup`, `gen.log`, `import-pinned.log` |
| `k\` | `mut-k.mjs` (+ `.stdout.txt`), `ties.mjs` (+ `.log`), `tsc-domain.log`, `tsc-db.log` |
| `k2\` | `mut-order.mjs` (+ `.stdout.txt`) |
| `perf\` | `p-r6.mjs`, `run6.mjs`, `runs.jsonl`, `run6.out.txt` |
| `mut-src\`, `mut-mut-*.log` | bản đột biến và output từng đột biến của phiên chính (và của S2, do `mut.mjs` ghi cạnh chính nó) |
| `s1\` | probe, đột biến, log của S1 (`p01`…`p07`, `s1-mut-*.mjs`, `mut-s1-*.log`, `tree\`, bản chép `mut.mjs` / `mutant-config.mjs` riêng) |
| `s2\` | probe, đột biến, log của S2 (`p1`…`p7`, `p6-fuzz-6*.log`, `mut-s2*.mjs` / `.log`) |

### 9.2 Đột biến của phiên chính (37)

| Id | File | Đổi | Kết quả |
|---|---|---|---|
| `R158-old-file` | `domain/src/name-order.ts` | cả file về `2e51e25` | KILLED 1 / 1 503 |
| `R158-past-max-raw` | như trên | quá trần → `return name` | KILLED 1 |
| `R158-cache-swapped` | như trên | `keys.set(key, name)` | KILLED 4 |
| `R158-past-max-nocache` | như trên | quá trần → không nhớ thêm | SURVIVED (tương đương về thứ tự) |
| `R158-never-clear` | như trên | bỏ `keys.clear()` | SURVIVED (chỉ bộ nhớ) |
| `R158-latin-uncached` | như trên | tên LATIN trả ngay, không nhớ | KILLED 1 |
| `R158-digit-uncached` | như trên | bỏ bộ nhớ chữ số | SURVIVED (chỉ thời gian) |
| `R159-isLabel-trim` | `db/src/common.ts` | `isLabel` về `trim()` | KILLED 8 |
| `R159-isLabel-no-blank` | như trên | bỏ phép hỏi trống | KILLED 9 |
| `R160-no-code-rule` | `db/src/backup-validation.ts` | luật 15 luôn qua | KILLED 9 / 346 |
| `R160-code-no-end-anchor` | như trên | bỏ `$` | KILLED 2 |
| `R160-code-any-letter` | như trên | `[0-9A-Z]` + cờ `i` | KILLED 3 |
| `R160-code-live-only` | như trên | bỏ KH đã xóa | KILLED 2 |
| `R160-owner-code-name` | `db/src/trash.ts` | `code: row.name` | KILLED 2 / 451 |
| `R160-owner-no-code` | như trên | bỏ `code` | KILLED 2 |
| `T377-search-no-normalize` | `domain/src/text.ts` | `searchText` dùng `trim()` | KILLED 5 / 161 |
| `T377-search-no-lower` | như trên | không hạ chữ | KILLED 9 |
| `T377-search-no-strip` | như trên | không bỏ dấu | KILLED 7 |
| `T377-search-lower-last` | như trên | hạ chữ sau khi bỏ dấu | SURVIVED (tương đương) |
| `K-size-ge` | `db/src/backup.ts` | `>` → `>=` trần | SURVIVED (chỉ khác ở đúng trần) |
| `K-no-fk-check` | như trên | bỏ `foreign_key_check` lúc nạp | KILLED 1 / 372 |
| `K-int-any-number` | như trên | cột integer nhận mọi số | KILLED 2 |
| `K-seq-zero` | `db/src/backup-validation.ts` | `seq >= 0` | KILLED 1 |
| `K-future-no-versions` | như trên | luật 10 bỏ `kyc_versions` | KILLED 1 |
| `K-future-no-facts` | như trên | luật 10 bỏ `kyc_facts` | KILLED 1 |
| `K-meeting-no-date` | như trên | luật 4 bỏ so ngày | KILLED 1 |
| `K-meeting-no-once` | như trên | luật 4 bỏ "một chuyển nhóm / lịch" | KILLED 1 |
| `K-staff-no-lead` | như trên | luật 9 bỏ "một TL / team" | KILLED 1 |
| `K-trash-tie-reversed` | `db/src/trash.ts` | đảo vế phụ `id` khi cùng mốc xóa | SURVIVED (K12: không dữ liệu nào chung mốc) |
| `K-trash-oldest-first` | như trên | cũ nhất trước | KILLED 1 / 477 |
| `K-purge-no-vacuum` | `db/src/purge.ts` | bỏ `VACUUM` | KILLED 2 |
| `K-purge-no-final-save` | như trên | bỏ lần lưu sau `VACUUM` | KILLED 1 |
| `K-kept-only-direct` | như trên | không giữ chuỗi Dời lịch sâu | KILLED 2 |
| `K-text-no-nfc` | `domain/src/text.ts` | `normalizeText` bỏ NFC | KILLED 5 / 145 |
| `K-note-keeps-crlf` | như trên | `LINE_BREAK` tách CR và LF riêng | KILLED 4 / 147 |
| `K2-code-rule-first` | `db/src/backup-validation.ts` | luật 15 kiểm trước | SURVIVED 1 726 / 1 726 (→ A6) |
| `K2-rule-order-5-6` | như trên | đổi chỗ luật 5 ↔ 6–8 | SURVIVED 1 726 / 1 726 (→ A6) |

### 9.3 Cuối phiên

- `git status --short` của `C:\workspace\Project-2C-review` cuối phiên (12:58): **rỗng**, như đầu phiên; `git rev-parse HEAD` = `5b1328ae236aa62981dbf43066ff544a9e832c8c`. Mục bị bỏ qua (`git status --ignored`): `.claude/settings.local.json`, `apps/desktop/dist/`, `apps/desktop/src-tauri/{gen,target}/`, `coverage/`, `playwright-report/`, `test-results/` — có từ bước chuẩn bị (cổng ở baseline); phiên này không chạy `pnpm`, e2e hay build. Lệnh ghi duy nhất của phiên ra ngoài thư mục kết quả là cache của vitest / Vite trong `node_modules` (bị bỏ qua).
- Liệt kê thư mục: phiên chính chỉ liệt kê thư mục của chính mình trong `-r6\claude\A\` (`r1\`, `mut-src\`, `k\`, `s1\`, `s2\`) và `-r6\common\load\`; S2 ghi đã `ls` không đệ quy `-r6\claude\A\` và `-r6\common\load\`. File của `-r5\claude\A\` mở theo đường dẫn đủ mà báo cáo gốc Claude A lượt 5 ghi (`hooks.mjs`, `mut.mjs`, `mutant-config.mjs`, `r1\byname-past-max.mjs`, `r1\trash-label-appdata.mjs`, `r2\label-blank.mjs`, `r2\label-blank-import.mjs`, `gen\gen.mjs`, `gen\import.mjs`, `gen\r4-load.p2cbackup`, `gen\r4-demo.p2cbackup`, `perf\byname-r5.mjs`, `perf\p-r5.mjs`, `perf\run5.mjs`). Không liệt kê / tìm kiếm trên `C:\workspace\` hay gốc `deep-review-1-6*\`; không mở thư mục `codex\`, `workbuddy\`, `deepseek\`, `muse\` nào (cả S1, S2 xác nhận như vậy); báo cáo gốc lượt 1–5 (mọi bên) chỉ đọc bản trong repo (`grep` trên `docs/reviews/raw/*/{claude,codex,deepseek}/A.md`, `docs/reviews/raw/2026-11-05/claude/{A,E}.md`); không đọc báo cáo lượt 6 nào của bên khác.
- Không gọi dịch vụ AI, không `gh`, không chạy công cụ repo gọi GitHub, không mở trình duyệt, không đo trên exe.
- Giờ xong: **2026-11-07 12:58 (+07:00)**.
