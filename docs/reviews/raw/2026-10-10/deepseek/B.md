# Deep review Phase 5 — Gói B (db) — DeepSeek

## 0. Kiểm tra đầu phiên

- `git rev-parse HEAD` → `0df3606fb783cc89b1b9c413c02810340e273a4f` — khớp SHA ghim `0df3606`.
- `git status --short` đầu phiên: `?? opencode.json` (đúng như dự kiến).
- Không đọc thư mục `deep-review-5\claude|codex|muse\`; không chạy `pnpm eval:ai` / lệnh AI thật; không sửa file trong repo.

## 1. Phạm vi đã đọc (file, dòng)

Nguồn đúng (đọc trước):

- `docs/design/phase-5-ai.md` (1–430) — spec G1/G2; `docs/design/phase-5-prompts.md` (1–345) — G5; `docs/golden/ai-eval.md` (1–119) — G2; `docs/decisions/0009-ai-copilot-provider-va-guardrail.md` (1–82) — ADR-0009 + D-1 + G5 + W-1; `CONTEXT.md` (1–46).
- `C:\workspace\deep-review-5\common\`: `plan.md`, `baseline.md`, `known.md`, `build-web.log` (1–38).

Repo ở `0df3606`:

- `packages/db/src/ai-analyses.ts` (1–277, toàn bộ) + `ai-analyses.test.ts` (1–612, toàn bộ).
- `packages/db/src/schema.ts` (1–384; phần AI 292–384), `migrations.ts` (1–39), `migrations/0005..0008*.sql` (toàn bộ), `migrations/meta/_journal.json`, `migrations/meta/0007|0008_snapshot.json` (so cấu trúc).
- `packages/db/src/backup-validation.ts` (1–446, toàn bộ) + `backup-invariants.test.ts` (1–1118, toàn bộ); `backup.ts` (1–201) + phần `backup.test.ts` liên quan.
- `packages/db/src/database.ts` (1–229) + `database.test.ts` (phần diff Phase 5 và 280–460).
- `packages/db/src/seed.ts` (1–684, toàn bộ), `seed-data.ts` (295–345 + diff), `seed.test.ts` (phần diff).
- `packages/db/src/kyc.ts` (1–548, toàn bộ), `kyc.test.ts` (diff), `common.ts` (1–153), `errors.ts` (1–92), `index.ts` (1–98), `settings.ts` (1–29), `settings.test.ts` (1–39), `counts.ts` (1–35), `test-support.ts` (1–38), `packages/db/CLAUDE.md` (1–52), `packages/db/package.json`.
- Chỗ gói nối vào (đối chiếu hợp đồng): `packages/ai/src/schema.ts` (1–159), `input.ts` (1–132), `mock-adapter.ts` (1–170), `run.ts` (1–394), `web.ts` (1–121), `prompts/retry.ts` (1–51), `extract-json.ts` (1–36), `adapter.ts`; `packages/domain/src/kyc-gate.ts` (1–85), `kyc-catalog.ts` (1–155); `apps/desktop/src/data/ai-analysis.ts` (1–304), `app-data.ts` (180–309), `i18n/index.ts` (1–132), `i18n/vi.ts` (92–120, 454–991), `i18n/index.test.ts` (phần DB_ERROR_CODES), `routes/SettingsBackup.tsx` (230–280).
- `git diff 3e84ce8..0df3606` cho `packages/db`, `apps/desktop/src/data` (kiểm soát thay đổi ngoài file mới).

## 2. Phát hiện (định dạng §5, ID `DS-B…`)

### DS-B1

- **ID:** DS-B1
- **Mức:** Low
- **Trục:** C
- **Vị trí:** `packages/db/src/ai-analyses.ts:141–143` (lệnh) ↔ `packages/db/src/backup-validation.ts:396–410` (nhập backup, luật 13)
- **Tình trạng:** CONFIRMED
- **Mô tả:** `recordAiAnalysis` không kiểm `output` của dòng `ACCEPTED` theo zod schema của `mode` và không kiểm `evidence` ⊆ mã dữ kiện như khi **nhập** backup; hai chỗ "cùng luật" lệch nhau.
- **Tái hiện / bằng chứng:** probe `probe-1-record-import.test.ts`, ca A — lệnh nhận một output thiếu 5/6 khối của `analysis`:
  ```
  A: command accepted, stored output = {"hypotheses":[{"text":"X","evidence":["F1"]}]}
  A: listAiAnalyses state = CURRENT
  A: importBackup = BACKUP_INVALID {"rule":13}
  ```
  Lệnh không chặn, `listAiAnalyses` trả `CURRENT` (panel sẽ hiện là kết quả hiện hành), nhưng chính file `exportBackup` của app bị `importBackup` từ chối (luật 13).
- **Ảnh hưởng:** hiện chưa có đường chạm thật — hai lời gọi production (`apps/desktop/src/data/ai-analysis.ts:179→202`, `:299→300`) đều lấy `row` đã qua `AI_OUTPUT_SCHEMAS[mode].parse` trong `packages/ai/src/run.ts:306` / `web.ts:112`. Rủi ro: một caller mới (hoặc hồi quy ở tầng `ai`) ghi được dòng `ACCEPTED` sai schema; người dùng chỉ phát hiện khi **khôi phục backup** — file do chính app xuất bị từ chối, không có cách sửa trong app. Kế hoạch gói B ghi rõ cần kiểm "lệnh và nhập backup kiểm cùng luật (schema đầu vào / **đầu ra** theo `mode`, `evidence`)".
- **Đề xuất:** một trong hai hướng — (1) thêm vào `toRow` nhánh `ACCEPTED`: `AI_OUTPUT_SCHEMAS[a.mode].safeParse(a.output).success` + `evidence` ⊆ `a.input.facts` (≈ 15 dòng + sửa fixture test `output: {summary:'Tóm tắt'}`); hoặc (2) nếu giữ đúng chữ spec §7.1 (lệnh chỉ kiểm 3 điều), ghi rõ ràng buộc "output đã qua validator của `@p2c/ai`" vào doc comment `NewAiAnalysis.output` và thêm một ca test hợp đồng. Cỡ: ≤ 40 dòng SP.

### DS-B2

- **ID:** DS-B2
- **Mức:** Low
- **Trục:** B (kèm C)
- **Vị trí:** `packages/db/src/seed.ts:428–467` (aiSimulation), `:474–511` (analysisInput), `:513–558` (cite / mockAnalysis / mockDiscovery) ↔ `packages/ai/src/input.ts:80–106` (buildAnalysisInput) và `packages/ai/src/mock-adapter.ts:67–128`
- **Tình trạng:** CONFIRMED
- **Mô tả:** `seed.ts` chép lại logic dựng đầu vào và bộ câu Mock của `packages/ai`, nhưng **đã lệch**: output Mock của seed khác output của `mock-adapter.ts` thật trên cùng một input.
- **Tái hiện / bằng chứng:** probe `probe-2-seed-perf-mock.test.ts` (seed=2, anchor 15/09):
  ```
  seed=3318ms customers=1200 analyses=62 withPersonalityNotes=0
  seed sample: hypotheses=1 painPointsEv=[["F3"]] themesEv=[["F1","F2","F3"]] personalityNotes=0
  live Mock : hypotheses=2 painPointsEv=[["F4"]] themesEv=[["F5","F6","F7"]] personalityNotes=1
  ```
  Khác biệt đọc được trong mã: seed luôn `hypotheses` 1 phần tử và `personalityNotes: []` (`seed.ts:544`, `:556`) trong khi adapter thêm giả thuyết thứ hai và một note PSYCHOLOGY (`mock-adapter.ts:85`, `:99–105`); vị trí `cite` lệch (`seed.ts:536,:538` vs `:91,:93`). Lệch tiềm ẩn (hôm nay không chạm tới được): seed `.slice(-6)` (`seed.ts:554`) ngược chiều adapter `.slice(0, 6)` (`mock-adapter.ts:120`) — nhưng `PROFILE_DISCOVERY` luôn còn ít nhất 3 hạng mục đã có (`kyc-catalog.ts:140`), nên tối đa 5 hạng mục thiếu và hai cách cắt cho cùng kết quả; `cite` của seed không lọc `undefined` như adapter (`seed.ts:514–516` vs `mock-adapter.ts:68–71`) — không chạm tới được vì cổng cho AI khi đã có dữ kiện.
- **Ảnh hưởng:** dữ liệu demo ("Nạp lại" mặc định, seed 1) khác thứ app tự tạo khi RE bấm Mock: khối "Thông tin tham khảo" (P6) không bao giờ xuất hiện trong demo, căn cứ mã F khác; ảnh chụp/tài liệu và thao tác thử trên demo không thấy trạng thái mà luồng thật có. Không sai schema (probe import demo qua được) nên không hỏng dữ liệu.
- **Đề xuất:** giữ hai bản nhưng khóa chúng lại: một test (tầng `apps` hoặc `tools`) seed → lấy `input_json` một dòng MOCK → chạy `createMockAdapter()` trên đúng input đó và bắt output phải bằng dòng đã lưu (đỏ ngay hôm nay); hoặc tách phần dựng output/đầu vào dùng chung qua `@p2c/ai/schema` (mặt tiếp xúc duy nhất `db` được import). Cỡ: ≤ 60 dòng.

### DS-B3

- **ID:** DS-B3
- **Mức:** Low
- **Trục:** B
- **Vị trí:** `packages/db/src/seed-data.ts:308–345`, `packages/ai/src/input.ts:19–54`, `apps/desktop/src/i18n/vi.ts:92–120`
- **Tình trạng:** CONFIRMED
- **Mô tả:** Bảng nhãn tiếng Việt của 8 hạng mục + 21 trường KYC tồn tại **3 bản** (db seed, ai input, i18n app) và không test nào so chúng với nhau.
- **Tái hiện / bằng chứng:** probe `probe-3-labels.test.ts` — cả 3 bản khớp 100% ở `0df3606` (test xanh); nhưng chính probe đó cho thấy một test so khớp chỉ ~10 dòng là đủ, hiện chưa có. Hai bản trong `packages` đều tự nhận "the same as the app's i18n" bằng comment (`seed-data.ts:309–310`, `input.ts:19`) mà không có gì chặn trôi lệch.
- **Ảnh hưởng:** thêm/đổi trường KYC (hoặc sửa chính tả nhãn) mà quên một bản → seed gửi `input_json` nhãn khác app thật (dữ liệu demo khác dữ liệu thật), CI vẫn xanh; hoặc UI hiện một đằng, model nhận một nẻo.
- **Đề xuất:** dùng bản probe làm test đồng bộ (rẻ nhất), hoặc đưa hai bảng nhãn về `@p2c/domain` cho `db` + `ai` dùng chung (i18n vẫn giữ cho UI). Cỡ: ≤ 30 dòng.

### DS-B4

- **ID:** DS-B4
- **Mức:** Nit
- **Trục:** B
- **Vị trí:** `packages/db/src/index.ts:87–97` (+ `ai-analyses.ts:25–28`)
- **Tình trạng:** CONFIRMED
- **Mô tả:** `AiAnalysisMode`, `AiAnalysisStatus`, `AiAnalysisProvider`, `AiAnalysisReasoning` được export qua `@p2c/db` nhưng không nơi nào import (grep toàn repo: chỉ có định nghĩa và re-export; `NewAiAnalysis` chỉ test dùng, import qua file con).
- **Tái hiện / bằng chứng:** `rg "AiAnalysis(Status|Mode|Provider|Reasoning)\b"` — 20 dòng, tất cả trong `ai-analyses.ts` (định nghĩa/dùng nội bộ) và `index.ts` (re-export); app và test không import từ `@p2c/db`.
- **Ảnh hưởng:** bề mặt API thừa; không gây lỗi.
- **Đề xuất:** gộp vào lần chạm sau của `index.ts`/`ai-analyses.ts` (bỏ 4 dòng type export, hoặc để nguyên cũng được). Cỡ: ≤ 5 dòng.

### Bảng đếm mức × trục

| Mức \ Trục | E | G | C | D | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | | 0 |
| High | | | | | | | | | | 0 |
| Medium | | | | | | | | | | 0 |
| Low | | | 1 | | | | 2 | | | 3 |
| Nit | | | | | | | 1 | | | 1 |
| **Tổng** | 0 | 0 | 1 | 0 | 0 | 0 | 3 | 0 | 0 | **4** |

## 3. Đã xét, không thấy (kèm cách đã xét)

- **E — Edge case:** đã đọc từng hàm của `ai-analyses.ts` + test tương ứng + probe.
  - Rỗng / một phần tử / rất nhiều: history rỗng trả `[]`; lịch sử **1 001 dòng** đọc 19 ms (probe-2, số bên dưới); `raw_output` rỗng bị chặn (CHECK + test `ai-analyses.test.ts:315`).
  - Unicode/NUL/emoji: `storedRawOutput` thay NUL bằng `�` và cắt theo code point (`ai-analyses.ts:185–187`; test `:202–226` gồm 20 001 emoji); probe-1 ca B xác nhận nhập biên `20 000` nhận, `20 001` từ chối (`BACKUP_INVALID`, không phải luật nào có số — do CHECK của bảng).
  - Ngày: `date` = ngày local của đồng hồ db lúc lưu (`:116–117`), nhập kiểm `date` ≤ hôm nay (luật 14, test `backup-invariants.test.ts:858`); ngày 29/02 chỉ thuộc schema đầu vào (`ai/schema.ts isoDate`, gói A).
  - Hai thao tác chồng nhau: "mới nhất" theo `seq` ghi, không theo ngày (test `ai-analyses.test.ts:483–506`); hai phiên bản KYC cùng ngày, ghi lùi ngày đều xét (test `:461–481`).
  - Hủy / timeout / lỗi giữa chừng: db không nhận gì trước khi runner trả `row` (đọc `run.ts:196–211`, `web.ts:98–120`, `ai-analysis.ts:179–204`); lệnh ghi chạy trong transaction, lỗi → không đổi DB (test `:861–879` của backup-invariants cho nhập; các lệnh khác theo pattern chung).
  - Tải lại / thay DB khi AI đang chạy: lệnh kiểm KH sống + phiên bản đúng KH (`ai-analyses.ts:108–111`), app xếp `CUSTOMER_NOT_FOUND`/`KYC_VERSION_NOT_FOUND` thành `discarded` (`ai-analysis.ts:165`); `replace` đổi `db` rồi lệnh đi qua `app.run` trên db mới (`app-data.ts:302–309`). Chi tiết hành vi khi rời màn / hủy phiên thuộc gói D — ở mức db, không thấy đường ghi vào DB cũ.
  - "nhiều dòng cùng thời điểm": cùng `created_at` có thật trong test (đồng hồ ghim, `test-support.ts:12`) và thứ tự vẫn theo `seq` — không thấy lỗi.
- **G — Guardrail AI (phía db):** đã so từng điều kiện của lệnh/nhập với spec §7.1/§7.3: input strict chặn khóa lạ (test `ai-analyses.test.ts:325–346`, `backup-invariants.test.ts:843–845` — tên/mã KH không lọt được vào `ai_analyses`); `mode`⇔`gate_state` (CHECK `schema.ts:350–359` + test); `CHATGPT_WEB` ⇒ `+web@<n>`, model/reasoning/token đều null (CHECK `:366–373` + test `:173–200`, `:278–289`); `REJECTED` ⇒ `raw_output` không rỗng (CHECK `:379–382`); `ACCEPTED` ⇒ có `output` (CHECK + `toRow`). AI không ghi vào dữ liệu KYC: `recordAiAnalysis` chỉ `INSERT` bảng `ai_analyses`; trích xuất không lưu (`run.ts:364–378`), đề xuất đi qua lệnh KYC hiện có sau khi RE xác nhận (`KycDialogs.tsx:456`). Lệch duy nhất: **DS-B1** (đầu ra).
  - KNOWN liên quan không báo lại: `AI_ANALYSIS_NO_MODEL`/`MAX_AI_RAW_OUTPUT` tách giữa `db` và `ai` (#455), `isoDate` **#465** — đúng như known.md, không có bằng chứng mới.
- **C — Đúng hợp đồng:** đối chiếu từng mục spec §7.1 (cột bảng), §7.2 (CURRENT/STALE/REJECTED + lời nhắc material/since), §7.3 (luật 1–4 = 11–14) với code: khớp, trừ DS-B1; "material + since sớm nhất trong các phiên bản cùng loại" đúng chú thích G3 `ai.html#ask 4` (test `:461–481`). Doc comment `ai-analyses.ts:1–6`/`schema.ts:294–315`/`settings.ts:1–5` khớp hành vi. `markKycVersionMaterial` vẫn không nằm trong index (đã có trong sổ Phase 1–4, không phải thay đổi Phase 5; UI không dùng).
- **D — Dữ liệu:** `ai_analyses` vào `dataTables` nên xuất/nhập trọn bảng (`backup.ts:43–65`, `backup-validation.ts:441–446`); round-trip giữ nguyên từng dòng (test `backup-invariants.test.ts:263–270`); luật 1 (phiên bản của chính KH) + UNIQUE `(customer_id, seq)`; xóa mềm KH: panel/ lệnh chặn, khôi phục giữ nguyên lịch sử (test `ai-analyses.test.ts:508–519`); migration 0005→0008: 0007 dựng lại bảng và **mất trigger**, 0008 tạo lại — có test mở DB cũ có dữ liệu (test `:530–562`, `:564–611`) + `foreign_key_check` sau từng migration (`database.ts:222–229`); chỉ mục/ snapshot khớp `_journal.json` (test `database.test.ts:116–118`); backup không chứa key: không có cột key/header/session (test `backup-invariants.test.ts:272–297`; bảng `schema.ts:316–347`), `settings.ai` chỉ được ghi bởi 4 trường provider/plan/model/reasoning (`ai-analysis.ts:122–124`, `app-data.ts:375–376`), không có chỗ nào trong `packages/db` ghi key.
  - KNOWN không báo lại: S-1 / D-1 (hash khi nhập backup) — ngoài phạm vi AI, đúng như known.
- **S — An toàn (phía db):** đã xét key (mục D trên), SQL (mọi truy vấn dùng placeholder/`prepare`; các chuỗi SQL dựng động chỉ ghép từ hằng số nội bộ trong `backup-validation.ts`), dữ liệu gửi đi (schema đầu vào strict — không tên, mã KH; seed cũng chỉ gửi dữ kiện), prompt injection (db chỉ lưu và đọc JSON; không nối chuỗi vào prompt), hiển thị output (db không render; `output_json` là dữ liệu cho UI — hiển thị an toàn thuộc gói D), CSP/capabilities/mở URL (không có mã nào trong gói B), câu trả lời dán (db kiểm qua schema khi lưu; luật V phía `ai`). Không thấy vấn đề trong phạm vi gói.
- **P — Hiệu năng (có số đo, probe-2, máy chạy review):**
  - Seed demo (1 200 KH, ~6 000 lịch, seed=2, anchor 15/09): **3 318 ms**.
  - 1 000 dòng phân tích thêm vào một KH: ghi 1 000 dòng **135 ms**; `listAiAnalyses` 1 001 dòng **19 ms**; `exportBackup` cả DB **164 ms** (13,3 MB JSON); `importBackup` cả file **687 ms** (gồm chạy zod toàn bộ dòng AI + luật 11–14).
  - Kết luận: không thấy vấn đề hiệu năng trong phạm vi gói; không có phát hiện P.
- **B — Bloat:** ngoài DS-B2/B3/B4, đã xét: import nội bộ `@p2c/ai` từ `db` chỉ qua `@p2c/ai/schema` (grep: 5 chỗ, đúng ADR-0006); không thấy nhánh không thể xảy ra mới; các duplication đã có trong known (#455, #465, `retry.ts` Divergent Change) không nhắc lại; `countRecords` không đếm `ai_analyses` (không được spec yêu cầu — đã xét).
- **T — Chất lượng test:** đã chạy test thật của repo và hai ca "phá code":
  - Baseline: `vitest run packages/db/src/ai-analyses.test.ts packages/db/src/backup-invariants.test.ts` → **2 files passed, 141 tests passed** (log `log-baseline-db.txt`).
  - Mutation A (bỏ kiểm `kyc_version` thuộc đúng KH trong bản chép `ai-analyses-mut.ts`): test `refuses a deleted customer, a KYC version of another customer…` **đỏ** (`expected undefined to be 'KYC_VERSION_NOT_FOUND'`) — test bắt được.
  - Mutation B (bỏ kiểm `evidence` trong bản chép `backup-validation-mut.ts`): test `refuses 13: evidence of a fact the input does not have…` **đỏ** (`expected { db… } to be an instance of DbError`) — test bắt được.
  - Đã xét độ phủ ca chéo: ca "13: evidence when the input has no facts list" (`:824`) trùng tên/thực chất như đã ghi ở known (#465) — không báo lại. Biên `raw_output` 20 001 khi **nhập** không có ca riêng (chỉ ca rỗng, `:855`); probe-1 ca B xác nhận hành vi đúng → coi là "đã xét", không đủ để báo test yếu. Không thấy test chép công thức của code, phụ thuộc ngày/thứ tự, hay mock quá tay trong phạm vi gói.
- **A — Trợ năng / i18n:** gói B không có mã UI/chuỗi người dùng; mã lỗi mới `AI_ANALYSIS_INVALID` có thông điệp i18n và được test phủ (`i18n/index.test.ts:103` lọc `DB_ERROR_CODES`; `vi.ts:980`). Không thấy vấn đề.

## 4. Phụ lục — nguồn test tạm và lệnh đã chạy

Thư mục `C:\workspace\deep-review-5\deepseek\B\`:

- `vitest.probe.config.mjs` — harness chạy probe ngoài repo (root = thư mục này; `server.fs.allow` C:\workspace; probe import nguồn repo bằng đường dẫn tương đối `../../../Project-2C-review/...`).
- `probe-sanity.test.ts` — mở DB + ghi 1 dòng Mock (kiểm harness).
- `probe-1-record-import.test.ts` — (A) lệnh nhận output sai schema rồi export/import bị từ chối; (B) biên 20 000/20 001 khi nhập. Log: `log-probe-1.txt`.
- `probe-2-seed-perf-mock.test.ts` — seed=2 anchor 15/09; đếm `personalityNotes`; gọi `createMockAdapter` trên `input_json` của một dòng seed; đo 1 000 dòng (ghi/đọc/export/import). Log: `log-probe-2.txt`.
- `probe-3-labels.test.ts` — so 3 bản nhãn KYC (db/ai/i18n). Log: `log-probe-3.txt`.
- `make-mutations.mjs` → `ai-analyses-mut.ts`, `backup-validation-mut.ts` (bản chép **ngoài repo** của 2 file nguồn, chỉ đổi import tương đối + phép phá); `vitest.mutA.config.mjs`, `vitest.mutB.config.mjs` (chạy **test gốc của repo** trên bản phá qua alias `./ai-analyses` / `./backup-validation`), log `log-mutA.txt`, `log-mutB.txt`.
- `node_modules\` trong thư mục probe: junction sang `packages/*` và store của repo để bản chép ngoài repo resolve được `zod` / `drizzle-orm` / `sql.js`; không đụng repo.
- `log-baseline-db.txt` — kết quả test gốc của repo (2 file, 141 test).

Lệnh chính (chạy từ `C:\workspace\Project-2C-review`, không sửa file repo):

- `git rev-parse HEAD` → `0df3606fb783cc89b1b9c413c02810340e273a4f`.
- `node_modules\.bin\vitest.cmd run packages/db/src/ai-analyses.test.ts packages/db/src/backup-invariants.test.ts` → 141 passed.
- `node_modules\.bin\vitest.cmd run --config C:\workspace\deep-review-5\deepseek\B\vitest.probe.config.mjs …` (probe 1/2/3).
- `node_modules\.bin\vitest.cmd run --config …\vitest.mutA.config.mjs -t "refuses a deleted customer"` → 1 failed (đúng kỳ vọng).
- `node_modules\.bin\vitest.cmd run --config …\vitest.mutB.config.mjs -t "13: evidence of a fact"` → 1 failed (đúng kỳ vọng).

## 5. git status cuối phiên

```
?? opencode.json
```

(Không sửa file nào trong repo; mọi probe/mutation/log nằm trong `C:\workspace\deep-review-5\deepseek\B\`.)
