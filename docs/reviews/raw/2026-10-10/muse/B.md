# Deep review Phase 5 — Gói B (db) — Muse

- Worktree: `C:\workspace\Project-2C-review-2`, SHA `0df3606fb783cc89b1b9c413c02810340e273a4f` (kiểm đầu phiên bằng `git -c safe.directory=... rev-parse HEAD`, khớp; `-c safe.directory` chỉ để qua Barrownership của sandbox, không đổi repo).
- `git status --short` đầu phiên:
  ```
  ?? .agents/
  ?? .codex/
  ?? AGENTS.md
  ?? opencode.json
  ```
- `git status --short` cuối phiên:
  ```
  ?? .agents/
  ?? .codex/
  ?? AGENTS.md
  ?? opencode.json
  ```
  (Không sửa file nào trong repo; probe chạy ngoài repo, xem phụ lục A.)
- Quy ước ID: `MS-B<n>` (thay `CL-`/`CX-` trong plan §5 vì phiên này là Muse).

## 0. Phạm vi đã đọc

Tài liệu: `common/plan.md` (§1, §3 dòng B, §4, §5), `common/baseline.md`, `common/known.md` (toàn bộ, để gắn KNOWN), `common/build-web.log`, `CONTEXT.md`, `docs/design/phase-5-ai.md` (toàn bộ, trọng tâm §3, §6.1–§6.4, §7), `docs/design/phase-5-prompts.md` (§1.1, §5, §6a, §7 — phần input/db dùng), `docs/golden/ai-eval.md` (§1–§2), `docs/decisions/0009-ai-copilot-provider-va-guardrail.md` (toàn bộ + phụ lục D-1, G5, W-1), `packages/db/CLAUDE.md`.

Code gói B (đọc toàn bộ từng file, số dòng ở SHA trên):

- `packages/db/src/ai-analyses.ts:1–277` (lệnh + CURRENT/STALE + reminder)
- `packages/db/src/schema.ts:1–384` (trọng tâm `aiAnalyses` + CHECK `:292–384`)
- `packages/db/src/migrations.ts:1–39`, `migrations/0005_ai_analyses.sql`, `0006_ai_analyses_append_only.sql`, `0007_ai_analyses_chatgpt_web.sql`, `0008_ai_analyses_append_only_rebuilt.sql` (toàn bộ)
- `packages/db/src/backup-validation.ts:1–446` (trọng tâm `aiRule`/`readsBack` `:368–420`, còn lại để đối chiếu luật 1–10)
- `packages/db/src/seed.ts:1–684` (trọng tâm AI `:99–102`, `:133–136`, `:151`, `:182`, `:294`, `:422–558`)

Code nối vào (đọc để kiểm hợp đồng, không báo lỗi ngoài gói B):

- `packages/db/src/backup.ts:1–201`, `database.ts:1–229`, `common.ts:1–153`, `errors.ts:1–96`, `kyc.ts:1–548` (toàn bộ)
- `packages/ai/src/schema.ts:1–159` (module duy nhất `db` được import: `analysisInputSchema`, `AI_OUTPUT_SCHEMAS`, `WEB_PROMPT_VERSION`, `factCode`), `packages/ai/src/input.ts:40–106` (`buildAnalysisInput`, đối chiếu seed), `packages/ai/src/run.ts:224–343` (`analysisOutcome`, hàng ghi khi ACCEPTED), `packages/ai/src/web.ts:85–121` (hàng ChatGPT web)
- `packages/domain/src/kyc-gate.ts` (`aiAllowed`), `kyc-catalog.ts:140–146` (ngưỡng tối thiểu)
- `apps/desktop/src/data/ai-analysis.ts:150–211` (caller duy nhất của `recordAiAnalysis`: `analyseCustomer`/`save`, chỉ đọc để đánh giá ảnh hưởng)
- Test: `ai-analyses.test.ts:1–612`, `backup-invariants.test.ts:1–270` + `:744–880` (fixture + case AI 11–14), `seed.test.ts:73–263` (trọng tâm `:189–229`), `backup.test.ts:209–267` (nhập file cũ)

## 1. Phát hiện

### MS-B1 — Nhập backup chấp nhận byte NUL và cắt chuỗi trong im lặng, trong khi lệnh thay NUL

```
ID: MS-B1
Mức: Low
Trục: D
Vị trí: packages/db/src/backup.ts:187 (valueOf), packages/db/src/backup-validation.ts:375 (aiRule); phía lệnh: packages/db/src/ai-analyses.ts:185
Tình trạng: CONFIRMED
Mô tả: `recordAiAnalysis` thay mọi NUL trong `raw_output` bằng `�` (storedRawOutput), nhưng `importBackup` nhận chuỗi chứa NUL: sql.js cắt chuỗi tại NUL lúc bind INSERT, validator đọc lại giá trị đã cắt nên không phát hiện được gì.
Tái hiện / bằng chứng: probe1-nul-raw-output.ts (phụ lục A). Backup 1 dòng REJECTED, đặt `raw_output = 'ab\0cd'` → nhập ACCEPTED, `SELECT raw_output, length(raw_output)` = `"ab"`, 2; `listAiAnalyses` đọc lại `"ab"` (5 ký tự thành 2, mất dữ liệu trong im lặng). Đối chứng: `model = 'glm\0-5.3'` (hàng OPENCODE_GO) cũng ACCEPTED, lưu lại `"glm"` — kiểm `isLabel` của rule 12 (backup-validation.ts:381–386, định từ chối NUL) bị vô hiệu vì nó chạy sau khi giá trị đã bị cắt.
Ảnh hưởng: chỉ với file backup dựng tay/chép ngoài (app không bao giờ ghi NUL: lệnh thay ở raw_output, các cột JSON escape, label bị từ chối). Hậu quả là chẩn đoán REJECTED bị cắt ngắn và nhãn (model/prompt_version) có thể đổi khác mà vẫn qua kiểm.
Đề xuất: từ chối NUL ngay trong `valueOf` (backup.ts:187, ~3 dòng: chuỗi chứa `\0` → `BACKUP_INVALID`) — một chỗ, mọi bảng cùng hưởng vì mọi validator đều đọc sau khi nạp; thêm 2 case (raw_output NUL, model NUL → từ chối). Cỡ ≤ 400 dòng SP.
```

### MS-B2 — Lệnh không kiểm `output` của ACCEPTED theo schema mode/evidence như rule 13, hàng lỗi làm hỏng toàn bộ lần nhập backup sau

```
ID: MS-B2
Mức: Low
Trục: D
Vị trí: packages/db/src/ai-analyses.ts:140–143 (toRow: chỉ kiểm input, output chỉ kiểm khác null); phía nhập: packages/db/src/backup-validation.ts:396–410 (readsBack)
Tình trạng: CONFIRMED
Mô tả: `toRow` kiểm `input` bằng đúng `analysisInputSchema` + khớp `mode` (T-176), nhưng với ACCEPTED chỉ đòi `output` khác null và `rawOutput` null — không chạy schema đầu ra của mode, không kiểm `evidence` có trong `input_json`, trong khi rule 13 lúc nhập backup kiểm cả hai. Lệnh và nhập backup không cùng luật ở đúng điểm plan gói B yêu cầu.
Tái hiện / bằng chứng: probe2-accepted-bad-output.ts (phụ lục A). (1) ACCEPTED với `output = {summary: 'Tóm tắt'}` (hình trong chính helper test `ai-analyses.test.ts:83`) → ghi được, seq 1, state CURRENT. (2) ACCEPTED với output đúng hình nhưng `evidence: ['F9']` trong khi input chỉ có F1 → ghi được, seq 2. `exportBackup` rồi `importBackup` → `BACKUP_INVALID {"rule":13}`: một hàng lỗi đầu độc cả file (file bị từ chối toàn bộ).
Ảnh hưởng: hôm nay cần một bug ở phía gọi mới tới được: `run.ts:306` (`AI_OUTPUT_SCHEMAS[mode].parse`, ACCEPTED luôn qua V1) và `web.ts:112` (dùng chung `analysisOutcome`) bảo đảm output hợp lệ; seed cũng hợp lệ (test round-trip seed 2/11/42 xanh). Nếu bug xảy ra: DB gốc còn nguyên (lỗi ồn ào, khôi phục được), nhưng mọi bản backup xuất ra đều không nhập lại được cho tới khi sửa tay file.
Đề xuất: trong `toRow`, với ACCEPTED chạy cùng kiểm tra như `readsBack` (schema mode + evidence ⊆ input — `db` đã import `AI_OUTPUT_SCHEMAS` cho rule 13, tách hàm chung để hai nơi không lệch); helper test chuyển sang output hợp lệ; thêm test lệnh-từ-chối + round-trip. Cỡ ≤ 400 dòng SP.
```

### MS-B3 — `seed.ts:analysisInput` lặp nguyên `buildAnalysisInput` của `ai` mà không có chốt chéo

```
ID: MS-B3
Mức: Nit
Trục: B
Vị trí: packages/db/src/seed.ts:474–511 so với packages/ai/src/input.ts:80–106
Tình trạng: PLAUSIBLE (đọc cả hai hàm, chưa chạy so sánh vì hàm seed không export)
Mô tả: hai hàm dựng input phân tích giống nhau từng bước (lọc superseded, sắp theo danh mục rồi seq, nhãn 'Tuổi' cho birthYear, Có/Không cho boolean, tuổi = năm phân tích − năm sinh, missingCategories + conflictWarnings), nhưng không có comment trỏ nhau (không như `mockAnalysis` ở seed.ts:526 đã ghi rõ "db không được import") và không có test nào so hai đầu ra.
Tái hiện / bằng chứng: đọc code hai bên; ranh giới `db` chỉ import `@p2c/ai/schema` nên không dùng chung hàm được — đây là lý do lặp, nhưng hiện không được ghi lại.
Ảnh hưởng: `ai` đổi hình input (nhãn, thứ tự, cách gửi tuổi) thì seed lệch trong im lặng; lệch vỡ schema sẽ nổ ồn ào ở `recordAiAnalysis` (T-176), chỉ lệch trong-schema (vd. đổi nhãn) mới lọt, và chỉ làm dữ liệu demo/e2e kém thật.
Đề xuất: thêm một dòng comment ở `seed.ts:474` trỏ về `input.ts:buildAnalysisInput` ("đổi một nơi, đổi cả hai"), hoặc test chéo đặt ở nơi import được cả hai. Cỡ vài dòng.
```

### Các mục KNOWN đã thấy (không có bằng chứng mới, không báo thành phát hiện)

- Giới hạn 20 000 có hai hằng (`run.ts:255` = 20 000, `schema.ts:313` = 20 000) và tập "provider không model" nằm hai nơi (`schema.ts:308`, `run.ts:329`/`web.ts:113`) — known.md #455. Đã đọc và xác nhận giá trị hai hằng bằng nhau hôm nay.
- `isoDate` (`ai/schema.ts:47`) lặp mẫu `validDate` (`backup-validation.ts:96`) — known.md #465.
- Tên case `backup-invariants.test.ts:823–826` ("13: evidence when the input has no facts list", thực chất bị schema đầu vào chặn trước) — known.md #465, vẫn đúng như mô tả.

## 2. Bảng đếm mức × trục

| Mức / Trục | E | G | C | D | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Low | 0 | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| Tổng | 0 | 0 | 0 | 2 | 0 | 0 | 1 | 0 | 0 | 3 |

(Không có Critical/High/Medium. Trục của MS-B1/MS-B2 là D theo định nghĩa plan §4 "lệnh và nhập backup cùng luật".)

## 3. Đã xét, không thấy (theo trục)

- **E — Edge case: đã xét, không thấy.** Đọc `recordAiAnalysis`/`listAiAnalyses`/`reminderFor`/`toRow`/`storedRawOutput` và chạy probe 3 (300 dòng: ghi 0,18 ms/dòng, đọc 6 ms — không có N+1, đúng 2 query + parse JSON). Rỗng/1 dòng: test phủ (`[]` sau restore, seq 1). Rất lớn: cắt 20 000 theo code point khớp `length()` của SQLite (test emoji 20 001 → 20 000 còn xanh). Unicode/NFC/NFD: JSON lưu nguyên, hai phía lệnh/nhập đối xử giống nhau; mã `F{seq}` ASCII và qua regex `FACT_CODE` cả hai phía. Ngày: B không làm số học ngày (chỉ so chuỗi `yyyy-mm-dd` ở rule 14 và `min` ngày ở reminder theo G3-ask4 đã có test ngày nhập bù). Hủy/lỗi giữa chừng: một transaction duy nhất, `toRow` ném trước khi insert, CHECK fail → rollback (test `persist` chứng minh). Hai thao tác chồng: code đồng bộ đơn luồng, `seq = max+1` trong transaction. Thay DB khi AI chạy: `importBackup` dựng staging, không chạm DB đang mở (test "current database unchanged"). `reduce` ở `reminderFor` không bao giờ rỗng: FK + lệnh bảo đảm KH có analysis thì luôn có version (không lệnh nào xóa `kyc_versions`, chỉ `markKycVersionMaterial` sửa cờ — `kyc.ts:200`).
- **G — Guardrail AI: đã xét, không thấy.** `db` không chạy V3–V6 (đúng spec: rule 3 §7.3 chỉ yêu cầu schema + evidence, `readsBack` làm đúng vậy, kể cả evidence trong `personalityNotes` qua `.flat()`). `recordAiAnalysis` chỉ INSERT `ai_analyses`, không ghi KYC (đọc `toRow` + `insertAnalysis`). Thử lại 1–2 lần: CHECK + lệnh cùng ép `attempts IN (1,2)`. REJECTED không bao giờ CURRENT (`listAiAnalyses:201–205`, test).
- **C — Đúng hợp đồng: đã xét, không thấy.** Đối chiếu từng ô spec §7.1–§7.3 với lệnh + CHECK + rule 11–14: mode↔gate (lệnh + CHECK `mode_gate`), provider mở rộng CHATGPT_WEB (migration 0007 + test), `model`/`reasoning`/token null với MOCK/ChatGPT_web (lệnh + CHECK `no_model`/`model` + rule 12), `prompt_version` `+web@n` (chung regex `WEB_PROMPT_VERSION` cả hai phía), CURRENT/STALE theo `seq` (test thứ tự ghi, ngày nhập bù), reminder material/since theo G3-ask4 (test), append-only (trigger 0006/0008 + test SQL thô), seed chỉ ghi MOCK ở cổng cho phép (P2). Một điểm nới lỏng có chủ ý hai phía giống nhau: OPENCODE_GO được để token null (spec §7.3 luật 2 viết `⇔`, code chỉ ép một chiều cho token) — producer thật luôn có token (`run.ts:322`), không mất dữ liệu, nên không báo. Ranh giới: `pnpm lint:deps` trong phiên: "no dependency violations found (297 modules, 1156 dependencies cruised)"; bốn file db chỉ import `@p2c/ai/schema`.
- **S — An toàn: đã xét, không thấy.** Không cột key/header/URL (test liệt kê đúng 20 cột, `grep` schema không có các cột đó); `input_json` strict (khóa lạ như tên/SĐT bị từ chối cả ở lệnh — test `fullName` — lẫn rule 13); `raw_output` ≤ 20 000 cả hai phía (lệnh cắt, nhập CHECK từ chối quá dài — xuất thật không bao giờ quá vì đã cắt lúc ghi). NUL trong cột JSON: byte NUL thô làm `JSON.parse` hỏng → rule 13 từ chối (trường hợp còn lại duy nhất là `raw_output`/nhãn, đã báo ở MS-B1). `DbError` không mang dữ liệu nhạy (`AI_ANALYSIS_INVALID` không params, `BACKUP_INVALID` chỉ số rule). Không code mạng/URL/CSP/capabilities trong `db`.
- **P — Hiệu năng: đã xét, không thấy.** Số đo thật bằng probe 3 trên máy review (không suy đoán): 300 dòng/KH → ghi 55 ms, đọc lịch sử 6 ms, xuất 383 KB 7 ms, nhập lại 32 ms. Không có vòng lặp truy vấn, không đọc thừa (đúng 2 prepared query).
- **T — Chất lượng test: đã xét, không thấy thêm.** Chạy `pnpm vitest run packages/db` trong phiên: 18 file, 439 test, xanh. Bao phủ đúng chỗ khó: lệnh cấm (mode/gate/provider/attempts/outcome/input), trigger append-only bằng SQL thô, CHECK bằng insert tay, CURRENT/STALE/reminder (kể cả ngày nhập bù và material), migration DB cũ có dữ liệu (giữ hàng + trigger), rule 11–14 mỗi luật có file sai → từ chối, seed round-trip 3 seed, nhập file cũ (v4→v9). Điểm yếu duy nhất thấy (helper test dùng output ACCEPTED sai schema) là một mặt của MS-B2, đã nêu trong đề xuất của MS-B2 nên không tách phát hiện.
- **A — Trợ năng / i18n: đã xét, không thấy.** `db` không chứa chuỗi UI (chỉ mã `DbError` để UI dịch), không render. Cách đọc `reminder`/`state` là dữ liệu thô cho panel (gói D).

## Phụ lục A. Probe và lệnh đã chạy

Cách chạy (không chạm repo): `loader.mjs` (dạy node đọc `*.sql?raw` + import `.ts` không đuôi) + `run.mjs`, nguồn repo đọc qua `file:///...` (type-stripping của node 24), file đặt ở `muse\B\`:

```
node C:\workspace\deep-review-5\muse\B\run.mjs C:\workspace\deep-review-5\muse\B\<probe>.ts
```

- `probe0-smoke.ts`: mở DB mới → `schemaVersion: 9`, đủ 13 bảng (gồm `ai_analyses`).
- `probe1-nul-raw-output.ts` (MS-B1):
  ```
  analyses in file: 1
  A: import ACCEPTED; stored raw_output = "ab" length() = 2
  A: listAiAnalyses rawOutput = "ab"
  B: import ACCEPTED; stored model = "glm" length() = 3
  ```
- `probe2-accepted-bad-output.ts` (MS-B2):
  ```
  record ACCEPTED with {summary}: ok, seq = 1
  listAiAnalyses state: CURRENT
  record ACCEPTED with evidence F9 not in input: ok, seq = 2
  re-import: REJECTED: BACKUP_INVALID {"rule":13}
  ```
- `probe3-perf.ts` (trục P):
  ```
  recordAiAnalysis x300: 55 ms (0.18 ms/row)
  listAiAnalyses (300 rows): 6 ms
  exportBackup (383 KB): 7 ms
  importBackup round-trip: 32 ms
  ```

Kiểm nền trong phiên:

- `pnpm vitest run packages/db` (đặt `TEMP`/`TMP` sang thư mục tạm của sandbox vì Temp hệ thống bị chặn EPERM): `Test Files 18 passed (18)`, `Tests 439 passed (439)`, Duration 42.54s.
- `pnpm lint:deps`: `no dependency violations found (297 modules, 1156 dependencies cruised)`.

Nguồn probe đầy đủ nằm ở `C:\workspace\deep-review-5\muse\B\` (`loader.mjs`, `run.mjs`, `probe0-smoke.ts`, `probe1-nul-raw-output.ts`, `probe2-accepted-bad-output.ts`, `probe3-perf.ts`).
