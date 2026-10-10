# Deep review Phase 5 — gói B (db)

Ngày: 10/10/2026. Reviewer: Codex, phiên độc lập, không subagent.
SHA: **0df3606fb783cc89b1b9c413c02810340e273a4f**, HEAD detached.
Phạm vi: gói B theo §3 common/plan.md; không kết luận G7 trong gói này.

**Kết quả: 2 phát hiện mới, đều Medium và CONFIRMED.** Không tạo Issue, sửa code, commit hoặc đề xuất merge. Không gọi AI thật, đọc key thật hoặc mở ChatGPT. Không truy cập thư mục/báo cáo của reviewer còn lại.

## 1. Phạm vi đã đọc

Đường dẫn tương đối với C:/workspace/Project-2C-review-2; số dòng ở SHA ghim.

| File | Dòng/phần đã xét |
|---|---|
| CLAUDE.md, CONTEXT.md | Toàn bộ quy tắc và từ điển |
| docs/design/phase-5-ai.md | §1–14; trọng tâm 184–309 (§6–8), 369–380 (test chấp nhận) |
| docs/design/phase-5-prompts.md | Toàn bộ §1–9; đầu vào, V1–V7, G5, web@1 |
| docs/golden/ai-eval.md | Toàn bộ §1–6; không sửa golden, không chạy eval thật |
| docs/decisions/0009-ai-copilot-provider-va-guardrail.md | Toàn bộ, gồm D-1, G5, W-1 |
| packages/db/CLAUDE.md; .claude/rules/tests.md; .claude/rules/i18n-ui.md | Ranh giới db, transaction, migration, test và i18n |
| packages/db/src/ai-analyses.ts | **1–277**, toàn bộ |
| packages/db/src/schema.ts | **1–384**, toàn bộ; trọng tâm 292–384 |
| packages/db/src/migrations.ts | **1–39**, toàn bộ |
| packages/db/migrations/0005_ai_analyses.sql, 0006_ai_analyses_append_only.sql, 0007_ai_analyses_chatgpt_web.sql, 0008_ai_analyses_append_only_rebuilt.sql | Toàn bộ bốn migration |
| packages/db/migrations/meta/_journal.json | Toàn bộ; 0008_snapshot.json: khối ai_analyses đọc bằng Node, đối chiếu cột/index/CHECK/FK |
| packages/db/src/backup-validation.ts | **1–446**, toàn bộ; trọng tâm 58–67, 368–420 |
| packages/db/src/backup.ts | **1–201**, toàn bộ |
| packages/db/src/database.ts | **1–229**, toàn bộ |
| packages/db/src/common.ts | 1–157; cleanText, isLabel, nextSeq, prepared, rowInsert, liveCustomer |
| packages/db/src/seed.ts | **1–684**, toàn bộ; trọng tâm 99–157, 182, 294, 423–570 và clock/RNG |
| packages/db/src/seed-data.ts | 305–345, nhãn đầu vào AI; phần thay đổi Phase 5 qua git diff |
| packages/db/src/kyc.ts | 1–110, 375–551 và toàn bộ diff Phase 5: seq dữ kiện, normalizeKycValue, lưu/đọc phiên bản |
| packages/db/src/settings.ts; index.ts; errors.ts | Settings/index toàn bộ; errors: thay đổi Phase 5 và AI_ANALYSIS_INVALID |
| packages/db/src/ai-analyses.test.ts | **1–612**, toàn bộ |
| packages/db/src/backup-invariants.test.ts | 1–295, 620–1060; ca AI 11–14, fixture, round-trip, seq; các ca còn lại được chạy |
| packages/db/src/backup.test.ts | 1–77, 205–273; dò/đối chiếu thay đổi Phase 5, chạy toàn bộ |
| packages/db/src/database.test.ts | Các khối migration, 383–474; chạy toàn bộ |
| packages/db/src/seed.test.ts | 1–263; trọng tâm 189–228; seed-invariants.test.ts chạy toàn bộ và dò kiểm AI/KYC |
| packages/ai/src/schema.ts | **1–159**, toàn bộ |
| packages/ai/src/validator.ts | 1–110 (V1/V2); input.ts 1–130; mock-adapter.ts 1–175 để đối chiếu seed |
| apps/desktop/src/data/ai-analysis.ts | 1–142, 175–211; save Settings và row AI |
| apps/desktop/src/data/ai-tauri.ts | 1–85; invoke key giả, không gọi Tauri thật |
| apps/desktop/src/data/app-data.ts | 355–380, nối Settings/backup |
| apps/desktop/src/routes/customers/ai-panel-view.ts | 1–100, 110–205, 335–406; view thuần xác nhận ảnh hưởng |
| apps/desktop/src/i18n/vi.ts | 92–120, 974–997; nhãn seed và mã lỗi |

Đã đọc đúng ba file được phép ở common: plan.md (§1–5), baseline.md, known.md. Những mục KNOWN về hash KYC, race thay DB, statement free, hằng 20.000/provider lặp và ca evidence cũ không được báo lại: không có bằng chứng mới trong B.

## 2. Phát hiện

### CX-B1 — Command lưu ACCEPTED không đọc/khôi phục được

- **ID:** CX-B1
- **Mức:** Medium
- **Trục:** C — Đúng hợp đồng
- **Vị trí:** packages/db/src/ai-analyses.ts:140–156; đối chiếu backup-validation.ts:396–409. Test: ai-analyses.test.ts:66–88, đặc biệt dòng 83.
- **Tình trạng:** **CONFIRMED**
- **Mô tả:** recordAiAnalysis kiểm schema input nhưng với ACCEPTED chỉ kiểm output có giá trị và stringify được. Nó không kiểm schema output theo mode hoặc evidence thuộc input, nên có thể tạo dữ liệu mà chính importBackup từ chối. Đây là chênh lệch giữa hai đường kiểm trong trọng tâm gói B; view cũng giả định output đã qua schema khi lưu (ai-panel-view.ts:353–354).
- **Tái hiện/bằng chứng:**
  1. Chạy node C:/workspace/deep-review-5/codex/B/real-input.mjs.
  2. Tạo KH và xác nhận dữ kiện qua lệnh thật; buildAnalysisInput dựng input với **9 dữ kiện, gate PAIN_POINT_ANALYSIS, aiAllowed=true**.
  3. recordAiAnalysis nhận ACCEPTED với output **{}**, ghi thành công và CURRENT. Xuất rồi nhập nguyên backup: **BACKUP_INVALID, rule=13**.
  4. Output đúng schema nhưng hypotheses[0].evidence = **["F999"]**, input không có F999: command vẫn ghi CURRENT; backup nguyên bản bị rule 13 chặn.
  5. presentation.mjs: {} khiến analysisContent ném **ZodError**; F999 tới view với codes ["F999"] và evidence level=null.
  6. Probe nhỏ còn xác nhận output discovery ở dòng mode analysis cũng được command nhận, rồi bị import từ chối.
- **Ảnh hưởng:** Một caller truyền row chưa kiểm đúng có thể tạo dòng append-only khiến panel lỗi và **toàn backup** của DB đó không khôi phục được. Runner/web bình thường có validator trước save; review **chưa chứng minh** model trả sai qua luồng chuẩn trực tiếp gây lỗi này. Vì vậy không nâng lên High.
- **Chất lượng test:** Fixture command dùng **{ summary: 'Tóm tắt' }** làm ACCEPTED. Transform bổ sung kiểm schema output làm **10 test vốn xanh thành đỏ**; chúng đang coi output sai schema là hợp lệ. Test nhập backup dùng fixture đúng schema và bắt evidence giả.
- **Đề xuất:** Dùng chung kiểm input/mode/output schema/evidence giữa command và backup, chỉ qua module @p2c/ai/schema đã được phép; giữ mã lỗi của hai đường. Đổi fixture command sang output hợp lệ, thêm ca từ chối {}, sai mode, evidence giả kèm rollback/round-trip. Ước lượng ≤100 dòng sản phẩm, dưới 400 dòng; không đổi golden/thêm dependency.

### CX-B2 — Nhập raw_output chứa NUL thành công nhưng mất phần sau NUL

- **ID:** CX-B2
- **Mức:** Medium
- **Trục:** D — Dữ liệu
- **Vị trí:** packages/db/src/backup.ts:149–157, 187–191; backup-validation.ts:58–67, 396–401; đối chiếu ai-analyses.ts:180–186, schema.ts:379–381.
- **Tình trạng:** **CONFIRMED**
- **Mô tả:** Command thay NUL bằng U+FFFD, còn import chuyển raw_output vào sql.js mà không kiểm NUL trước bind. SQLite tính length đến NUL và sql.js đọc chuỗi đến NUL; invariant kiểm sau load không còn thấy phần đã bị cắt.
- **Tái hiện/bằng chứng:**
  1. Chạy node C:/workspace/deep-review-5/codex/B/probe.mjs.
  2. Xuất backup có một REJECTED hợp lệ; chỉ thay raw_output thành **"ab\u0000cd"**, JSON.stringify rồi import.
  3. Import **thành công**; xuất lại raw_output chỉ còn **"ab"** thay vì toàn bộ 5 ký tự.
  4. Đổi raw_output thành **"a\u0000" + "x".repeat(25000)** (25.002 code point): import vẫn thành công, raw xuất lại **"a"**. Đối chứng 20.001 chữ x không NUL: **BACKUP_INVALID**.
  5. Command xử lý đúng cùng chuỗi thành **"ab�cd"**; mutation bỏ replaceAll NUL bị test phát hiện.
- **Ảnh hưởng:** Backup hỏng/được chỉnh có thể báo nhập thành công dù nội dung cuối của lần AI bị loại đã mất; kiểm độ dài gốc ≤20.000 bị vượt qua. Đây là mất dữ liệu chẩn đoán lúc nhập; không chứng minh mất dữ kiện KYC hay thực thi nội dung model.
- **Chất lượng test:** Đã có ca NUL ở command, nhưng còn thiếu ca này ở import; bộ 293 test đã chạy vẫn xanh.
- **Đề xuất:** Kiểm raw_output trong **JSON gốc trước bind SQLite**: từ chối NUL bằng BACKUP_INVALID và kiểm giới hạn theo code point. Không chỉ kiểm DB staging vì phần sau NUL đã mất. Thêm hai ca trên, kiểm DB đang mở không đổi. Ước lượng ≤40 dòng sản phẩm; không migration dữ liệu giả lập.

## 3. Bảng đếm mức × trục

Mỗi phát hiện đếm một lần theo trục chính; hệ quả guardrail/test mô tả cùng phát hiện, không tạo ID trùng.

| Mức | E | G | C | D | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 2 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tổng | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 2 |

CONFIRMED: 2; PLAUSIBLE: 0; không có KNOWN với bằng chứng mới.

## 4. Mọi trục đã xét, gồm “đã xét, không thấy”

| Trục | Cách xét và kết quả |
|---|---|
| **E** | NUL ở CX-B2. **Đã xét, không thấy lỗi khác**: cùng timestamp dùng seq; ngày ghi lùi, 29/02 hợp lệ/ngày không tồn tại; seq MAX_SAFE_INTEGER bị SEQ_LIMIT và DB không đổi; F0/F01/trùng bị chặn; empty output/sai mode ở CX-B1. Xem probe/edge. Command là transaction đồng bộ, không await; Hủy/timeout/race thay DB là seam app/Rust, chưa kiểm đầy đủ ở B. |
| **G** | Thiếu bảo vệ schema/evidence: CX-B1. **Đã xét, không thấy vấn đề mới khác riêng ở db**: input strict cả ACCEPTED/REJECTED, nhập output theo mode, evidence cả personalityNotes, CHECK và REJECTED không CURRENT. Đối chiếu G5 để xác định trách nhiệm: §7.3 chỉ yêu cầu nhập kiểm schema/evidence, không chạy lại blocklist V3–V6; không báo thiếu blocklist import là lỗi trái spec. Extraction/V7 không ghi ai_analyses. |
| **C** | CX-B1. **Đã xét, không thấy lỗi khác**: CURRENT chỉ ACCEPTED seq cao nhất ở version mới nhất; ghi kết quả cũ muộn làm mọi ACCEPTED STALE đúng §7.2; rejected không thay current; lời nhắc lấy ngày sớm nhất trong version phù hợp material. Model/reasoning/token MOCK/CHATGPT_WEB phải null cả command/import; suffix web được kiểm. |
| **D** | CX-B1 ảnh hưởng round-trip; CX-B2 mất raw. **Đã xét, không thấy lỗi khác**: soft-delete giữ lịch sử, restore sau backup giữ trạng thái; FK cùng KH/seq unique; UPDATE/DELETE bị trigger chặn. Migration schemaVersion=5 (Phase 4) và =7 giữ mọi dòng, lên 9, foreign_key_check=[] và tạo lại trigger. Lỗi cuối migration: persist=0, bytes gốc mở lại vẫn version 7/đủ dòng. Seed 7 ngày 10/10: 76 dòng, mọi output đúng schema, round-trip đạt. |
| **S** | **Đã xét, không thấy trong B**: AI không có cột key/header/session/URL; db không import network/keyring. Probe createAppAi.save nhận object có FAKE_KEY_MARKER_B vẫn chỉ lưu bốn trường Settings; key tới invoke ai_key_set giả, không có trong backup. Input strict từ chối fullName/phone thừa ở cả hai đường. db chỉ serialize/parse, không thực thi model text. Prompt injection, CSP/capabilities, URL và DOM đầy đủ thuộc A/C/D/F; không gọi thật để kiểm B. |
| **P** | **Đã xét, không thấy lỗi đủ căn cứ**; số đo dưới. Chi phí tăng theo lịch sử, không suy diễn thành lỗi từ ngưỡng tự đặt. |
| **B** | **Đã xét, không thấy code thừa gây lỗi mới**: tsc noUnusedLocals/noUnusedParameters, codemap:check đạt; đối chiếu export/truy vấn/schema qua rg/diff. Hằng provider/20.000, isoDate lặp đã KNOWN. Nhãn KYC có bản sao seed/ai/i18n do ranh giới module; probe nhãn seed/i18n đều khớp. |
| **T** | Khoảng trống fixture/schema CX-B1 và import NUL CX-B2. **Đã xét, không thấy giả xanh ở bốn nhánh đã mutation**: bỏ kiểm input, bỏ sanitizer NUL, sai CURRENT/version, bỏ evidence backup đều làm test đỏ. Chỉ là mẫu mutation, không đánh giá toàn bộ mutation score. |
| **A** | **Đã xét, không thấy trong B**: nhãn 8 hạng mục/21 trường seed khớp vi.ts; AI_ANALYSIS_INVALID, KYC_VERSION_NOT_FOUND, SEQ_LIMIT có chữ tiếng Việt. db không có DOM/focus/aria; audit panel thuộc D. Không đề xuất dịch lại snapshot/dữ liệu seed đã lưu. |

### Hiệu năng có số đo

Node **v24.20.0**, pnpm **12.6.0**, sql.js của repo; clock ghim 10/10/2026. DB bộ nhớ, một KH/một version; tạo qua recordAiAnalysis trong transaction ngoài. Không persist disk, không đo Rust/file I/O. Warm-up một lần, đọc 5 lần; import một lần/mức tải.

| Số ai_analyses | listAiAnalyses, 5 lần (ms) | Import (ms) | Backup (byte) | SQLite (byte) |
|---:|---|---:|---:|---:|
| 100 | 1,10 · 1,10 · 1,08 · 1,13 · 3,13 | 9,90 | 137.503 | 253.952 |
| 1.000 | 10,05 · 10,51 · 9,37 · 9,10 · 9,44 | 43,37 | 1.359.704 | 1.253.376 |
| 10.000 | 95,00 · 97,06 · 103,83 · 102,77 · 97,30 | 364,09 | 13.590.705 | 11.210.752 |

Seed thật qua lệnh nghiệp vụ, seed=7, anchor=10/10/2026: **76 analyses (28 analysis, 48 discovery)**; seed **4.588,14 ms**; backup **10.925.966 byte**; import **956,42 ms**, giữ đủ 76 dòng và mọi output qua schema. Kết quả thô: B/probe-results.json, B/edge-results.json. Đây là số đo trên máy phiên review, không benchmark chung.

## 5. Kiểm thử và mutation

Dùng toolchain có sẵn; không cài dependency/công cụ.

- pnpm exec vitest run (ai-analyses, backup-invariants, backup, database, seed-invariants, seed): **6 file / 257 test đạt**, 40,11 s.
- pnpm exec vitest run (kyc, settings, common, backup-engine): **4 file / 36 test đạt**, 1,21 s.
- Tổng **10 file / 293 test đạt**; các lệnh đầy đủ ở verification.json. Không pnpm eval:ai, không chạy lại toàn pnpm verify.
- pnpm exec tsc -p packages/db/tsconfig.json --noUnusedLocals --noUnusedParameters: đạt.
- pnpm codemap:check: Export maps are up to date.

Mutation dùng Vite transform **trong bộ nhớ**, cấu hình/caches/log nằm B/. Không patch repo. Chọn hai file ai-analyses.test.ts/backup-invariants.test.ts, mẫu tên recordAiAnalysis|listAiAnalyses|refuses để bỏ seed/migration nặng đã baseline.

| Transform | Pass / fail / không chọn | Kết quả |
|---|---|---|
| baseline | 118 / 0 / 23 | Đạt |
| skip-input | 117 / 1 / 23 | Bỏ schema input → ca từ chối input đỏ |
| skip-nul | 117 / 1 / 23 | Bỏ replaceAll NUL → ca NUL đỏ |
| current-old-version | 114 / 4 / 23 | Bỏ so version hiện tại → 4 ca STALE/lời nhắc đỏ |
| skip-backup-evidence | 116 / 2 / 23 | Bỏ evidence lookup → 2 ca evidence giả đỏ |
| enforce-output | 108 / 10 / 23 | **Kiểm tăng cường, không tính mutant lỗi:** thêm kiểm schema làm 10 ca fixture sai đỏ; CX-B1 |

## 6. Tính độc lập và trạng thái cuối

- Chỉ đọc repo SHA ghim, common/plan.md + baseline.md + known.md và artifact của chính phiên này trong codex/B. Không đọc/tổng hợp báo cáo khác.
- Probe chỉ SQLite bộ nhớ/fake invoke/dữ liệu giả. Không dịch vụ AI, Windows Credential Manager hoặc ChatGPT thật.
- Không thay đổi tracked/staged: git diff và git diff --cached rỗng; SHA cuối giữ nguyên, HEAD detached.
- **Ngoại lệ từ đầu:** git status --short ban đầu/cuối đều có **?? .agents/**, **?? .codex/**, **?? AGENTS.md**. Giữ nguyên các mục có trước review, không xóa/sửa để làm sạch giả. Không tuyên bố toàn worktree sạch untracked; review không tạo thêm mục trong repo.
- Chỉ nộp B, không đưa kết luận G7 trước F.

## 7. Phụ lục nguồn test tạm

Nguồn nguyên văn được chép tiếp dưới; bản chạy được ở **C:/workspace/deep-review-5/codex/B/**. Loader dùng module.registerHooks/stripTypeScriptTypes sẵn trong Node 24 để nạp TS/SQL ?raw; aliases trỏ repo ghim, không thêm dependency.

~~~powershell
node C:/workspace/deep-review-5/codex/B/probe.mjs
node C:/workspace/deep-review-5/codex/B/edge.mjs
node C:/workspace/deep-review-5/codex/B/presentation.mjs
node C:/workspace/deep-review-5/codex/B/real-input.mjs
$env:B_MUTANT = 'baseline' # đổi lần lượt sang tên ở bảng
pnpm exec vitest run --config C:/workspace/deep-review-5/codex/B/mutation.config.mjs --configLoader native --testNamePattern 'recordAiAnalysis|listAiAnalyses|refuses'
Remove-Item Env:\B_MUTANT
~~~

Artifact: probe-results.json, edge-results.json, presentation-results.json, real-input-results.json và log tương ứng; mutation-<tên>.json/.log; verification.json. Harness ban đầu bị thiếu import MIGRATIONS, đã sửa ngoài repo; tất cả kết quả viện dẫn thuộc lượt hoàn chỉnh exit=0. Các mutation lỗi dự kiến exit=1.



### Nguồn loader.mjs

SHA-256 (UTF-8 không BOM): aba66c844f7bccd2e8f1698381e0c0a49a8556a01bef2ec9d2028124ed183b11

~~~javascript
import fs from 'node:fs';
import path from 'node:path';
import { registerHooks, stripTypeScriptTypes } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = 'C:/workspace/Project-2C-review-2';
const aliases = { '@p2c/domain': root+'/packages/domain/src/index.ts', '@p2c/ai/schema': root+'/packages/ai/src/schema.ts', '@p2c/ai': root+'/packages/ai/src/index.ts', '@p2c/db': root+'/packages/db/src/index.ts' };
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (aliases[specifier]) return { url: pathToFileURL(aliases[specifier]).href, shortCircuit: true };
    if (specifier.endsWith('.sql?raw')) return { url: new URL(specifier, context.parentURL).href, shortCircuit: true };
    if (specifier.startsWith('.') && context.parentURL?.startsWith('file:')) {
      const base = fileURLToPath(new URL(specifier, context.parentURL));
      for (const suffix of ['.ts', '.mjs', '/index.ts']) if (fs.existsSync(base+suffix)) return { url: pathToFileURL(base+suffix).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.endsWith('.sql?raw')) return { format:'module', source:'export default '+JSON.stringify(fs.readFileSync(fileURLToPath(url.slice(0,-4)),'utf8')), shortCircuit:true };
    if (url.endsWith('.ts') && url.startsWith(pathToFileURL(root).href)) return { format:'module', source:stripTypeScriptTypes(fs.readFileSync(fileURLToPath(url),'utf8'),{ mode:'transform', sourceUrl:url }), shortCircuit:true };
    return nextLoad(url, context);
  }
});
~~~

### Nguồn fixtures.mjs

SHA-256 (UTF-8 không BOM): eef70b07ad7a5dd6be3c44a74f47b1a991287fde9af75a75bd35ce2f039db1b0

~~~javascript
import './loader.mjs';
import { performance } from 'node:perf_hooks';
import fs from 'node:fs';
const root='file:///C:/workspace/Project-2C-review-2/';
const dbApi=await import(root+'packages/db/src/index.ts');
const { analysisOutputSchema }=await import(root+'packages/ai/src/schema.ts');
const { calendarDate }=await import(root+'packages/domain/src/index.ts');
const { openDatabase,createTeam,createPerson,createCustomer,listKycVersions,recordAiAnalysis,listAiAnalyses,exportBackup,importBackup }=dbApi;
const { MIGRATIONS }=await import(root+'packages/db/src/migrations.ts');
const now=()=>new Date('2026-10-10T11:00:00Z');
const input={analysisDate:'2026-10-10',mode:'analysis',facts:[{code:'F1',category:'Danh tính / tuổi',field:'Tuổi',value:'46',confirmedAt:'2026-09-01',conflict:false}],missingCategories:[],conflictWarnings:[]};
const item={text:'KH có thể cần làm rõ mục tiêu',evidence:['F1']};
const output={hypotheses:[item],needs:[item],painPoints:[item],themes:[item],discoveryStrategy:[item],nextBestActions:[item],personalityNotes:[]};
async function context(migrations=MIGRATIONS) {
 const db=await openDatabase({now,migrations});
 const team=createTeam(db,{name:'Nhóm giả'}); const re=createPerson(db,{name:'RE giả',role:'RE',teamId:team.id});
 const customer=createCustomer(db,{name:'KH giả',reId:re.id,stage:'N4',date:calendarDate(2026,9,1),birthDate:{year:1980}});
 const version=listKycVersions(db,customer.id).at(-1);
 const a={customerId:customer.id,kycVersionId:version.id,mode:'analysis',gateState:'PAIN_POINT_ANALYSIS',status:'ACCEPTED',provider:'MOCK',model:null,reasoning:null,promptVersion:'analysis@1',attempts:1,input,output,rawOutput:null,validator:[{attempt:1,errors:[]}],promptTokens:null,completionTokens:null};
 return {db,customer,version,a};
}

export {context,input,output,item,now,root,dbApi,calendarDate,MIGRATIONS};
~~~

### Nguồn probe.mjs

SHA-256 (UTF-8 không BOM): b68a51ee62ce423f51a73ab2c3d6b37be9af310e6e7e88866b774678b3454647

~~~javascript
import './loader.mjs';
import { performance } from 'node:perf_hooks';
import fs from 'node:fs';
const root='file:///C:/workspace/Project-2C-review-2/';
const dbApi=await import(root+'packages/db/src/index.ts');
const { analysisOutputSchema }=await import(root+'packages/ai/src/schema.ts');
const { calendarDate }=await import(root+'packages/domain/src/index.ts');
const { openDatabase,createTeam,createPerson,createCustomer,listKycVersions,recordAiAnalysis,listAiAnalyses,exportBackup,importBackup }=dbApi;
const { MIGRATIONS }=await import(root+'packages/db/src/migrations.ts');
const now=()=>new Date('2026-10-10T11:00:00Z');
const input={analysisDate:'2026-10-10',mode:'analysis',facts:[{code:'F1',category:'Danh tính / tuổi',field:'Tuổi',value:'46',confirmedAt:'2026-09-01',conflict:false}],missingCategories:[],conflictWarnings:[]};
const item={text:'KH có thể cần làm rõ mục tiêu',evidence:['F1']};
const output={hypotheses:[item],needs:[item],painPoints:[item],themes:[item],discoveryStrategy:[item],nextBestActions:[item],personalityNotes:[]};
async function context(migrations=MIGRATIONS) {
 const db=await openDatabase({now,migrations});
 const team=createTeam(db,{name:'Nhóm giả'}); const re=createPerson(db,{name:'RE giả',role:'RE',teamId:team.id});
 const customer=createCustomer(db,{name:'KH giả',reId:re.id,stage:'N4',date:calendarDate(2026,9,1),birthDate:{year:1980}});
 const version=listKycVersions(db,customer.id).at(-1);
 const a={customerId:customer.id,kycVersionId:version.id,mode:'analysis',gateState:'PAIN_POINT_ANALYSIS',status:'ACCEPTED',provider:'MOCK',model:null,reasoning:null,promptVersion:'analysis@1',attempts:1,input,output,rawOutput:null,validator:[{attempt:1,errors:[]}],promptTokens:null,completionTokens:null};
 return {db,customer,version,a};
}
const log=[];
function report(name,data){log.push({name,...data});console.log(JSON.stringify(log.at(-1)));}
async function roundtrip(text) { try { const copy=await importBackup(text,{now}); const file=JSON.parse(exportBackup(copy.db)); copy.db.sqlite.close(); return {accepted:true,rows:file.tables.ai_analyses}; } catch(e) { return {accepted:false,error:e.code,params:e.params}; } }
for(const [name,bad] of [['output-empty',{}],['evidence-F999',{...output,hypotheses:[{...item,evidence:['F999']}]}],['output-wrong-mode',{hypotheses:[],discoveryStrategy:[item,item],nextBestActions:[item]}]]) {
 const {db,a}=await context();
 let command; try {const row=recordAiAnalysis(db,{...a,output:bad});command={accepted:true,seq:row.seq};}catch(e){command={accepted:false,error:e.code};}
 report(name,{command,schemaAccepts:analysisOutputSchema.safeParse(bad).success,roundtrip:await roundtrip(exportBackup(db))}); db.sqlite.close();
}
{
 const {db,a}=await context();recordAiAnalysis(db,a);report('valid-roundtrip',{roundtrip:await roundtrip(exportBackup(db))});db.sqlite.close();
}
for(const [name,raw] of [['nul-middle','ab\0cd'],['nul-bypasses-limit','a\0'+'x'.repeat(25000)],['raw-over-limit','x'.repeat(20001)],['raw-whitespace','   '],['raw-nul-only','\0']]){
 const {db,a}=await context();recordAiAnalysis(db,{...a,status:'REJECTED',attempts:2,output:null,rawOutput:'reject'});
 const b=JSON.parse(exportBackup(db));b.tables.ai_analyses[0].raw_output=raw;
 const rt=await roundtrip(JSON.stringify(b));
 report(name,{suppliedLength:Array.from(raw).length,...rt,rows:rt.rows?.map(r=>({raw:r.raw_output,length:r.raw_output?.length}))});db.sqlite.close();
}
for(const provider of ['MOCK','CHATGPT_WEB']){
 for(const [key,value] of [['model','fake'],['reasoning','HIGH'],['promptTokens',0],['completionTokens',0]]){
 const {db,a}=await context();let cmd;
 try{recordAiAnalysis(db,{...a,provider,promptVersion:'analysis@1+web@1',[key]:value});cmd='ACCEPTED';}catch(e){cmd=e.code;}
 recordAiAnalysis(db,{...a,provider,promptVersion:'analysis@1+web@1'});
 const b=JSON.parse(exportBackup(db));const keys={model:'model',reasoning:'reasoning',promptTokens:'prompt_tokens',completionTokens:'completion_tokens'};b.tables.ai_analyses[0][keys[key]]=value;
 report('provider-null-'+provider+'-'+key,{command:cmd,roundtrip:await roundtrip(JSON.stringify(b))});db.sqlite.close();
 }}
for(const versionCount of [5,7]){
 const {db,a}=await context(MIGRATIONS.slice(0,versionCount));
 if(versionCount===7) {recordAiAnalysis(db,a);recordAiAnalysis(db,{...a,status:'REJECTED',output:null,attempts:2,rawOutput:'bad'});}
 const before=JSON.parse(exportBackup(db));
 const updated=await openDatabase({bytes:db.export(),now});
 const after=JSON.parse(exportBackup(updated));
 const retained=Object.entries(before.tables).every(([name,rows])=>JSON.stringify(rows)===JSON.stringify(after.tables[name]));
 const triggers=updated.sqlite.exec("SELECT name FROM sqlite_master WHERE type='trigger' AND tbl_name='ai_analyses'")[0]?.values.flat();
 report('migration-from-'+versionCount,{retained,schemaVersion:updated.schemaVersion(),aiRows:after.tables.ai_analyses.length,triggers,fk:updated.sqlite.exec('PRAGMA foreign_key_check')});
 db.sqlite.close();updated.sqlite.close();
}
{
 const {db,a,customer}=await context();const sizes=[100,1000,10000];let saved=0;
 for(const n of sizes){db.transaction(()=>{for(;saved<n;saved++)recordAiAnalysis(db,a);});
 listAiAnalyses(db,customer.id);
 const ms=[];for(let i=0;i<5;i++){const t=performance.now();listAiAnalyses(db,customer.id);ms.push(performance.now()-t);}
 const text=exportBackup(db);const t=performance.now();const rt=await importBackup(text,{now});const importMs=performance.now()-t;
 report('performance-'+n,{listMs:ms.map(x=>+x.toFixed(2)),importMs:+importMs.toFixed(2),backupBytes:Buffer.byteLength(text),sqliteBytes:db.export().byteLength});
 rt.db.sqlite.close();
 }
 db.sqlite.close();
}
fs.writeFileSync(new URL('./probe-results.json',import.meta.url),JSON.stringify(log,null,2)+'\n');
~~~

### Nguồn edge.mjs

SHA-256 (UTF-8 không BOM): 3fdcff6df8e20bd8e592ddada5b44f1415cb1d00088cd4acb869d8487974ed23

~~~javascript
import {context,input,output,item,now,root,dbApi,calendarDate,MIGRATIONS} from './fixtures.mjs';
import { performance } from 'node:perf_hooks';
import fs from 'node:fs';
const {recordAiAnalysis,listAiAnalyses,listKycVersions,exportBackup,importBackup,openDatabase,softDeleteCustomer,restoreCustomer,seedDemoData}=dbApi;
const {addKycNote,confirmKycFact}=await import(root+'packages/db/src/kyc.ts');
const {AI_OUTPUT_SCHEMAS}=await import(root+'packages/ai/src/schema.ts');
const {validateAnalysis}=await import(root+'packages/ai/src/validator.ts');
const logs=[];
function log(name,result){logs.push({name,...result});console.log(JSON.stringify(logs.at(-1)));}
async function rt(b){try{const {db}=await importBackup(JSON.stringify(b),{now});const parsed=JSON.parse(exportBackup(db));db.sqlite.close();return {accepted:true,analyses:parsed.tables.ai_analyses};}catch(e){return {accepted:false,error:e.code,rule:e.params?.rule};}}
function command(db,a){try{return {accepted:true,row:recordAiAnalysis(db,a)};}catch(e){return {accepted:false,error:e.code};}}
const inputCases=[
 ['duplicate-codes',{...input,facts:[input.facts[0],input.facts[0]]}],
 ['fact-zero',{...input,facts:[{...input.facts[0],code:'F0'}]}],
 ['fact-leading-zero',{...input,facts:[{...input.facts[0],code:'F01'}]}],
 ['analysis-impossible-date',{...input,analysisDate:'2026-02-29'}],
 ['confirmed-impossible-date',{...input,facts:[{...input.facts[0],confirmedAt:'2026-02-30'}]}],
 ['analysis-date-time',{...input,analysisDate:'2026-10-10T00:00:00Z'}],
 ['unknown-personal-key',{...input,fullName:'PERSONAL_MARKER'}],
 ['unknown-nested-key',{...input,facts:[{...input.facts[0],phone:'PERSONAL_MARKER'}]}],
 ['category-unknown',{...input,missingCategories:[{code:'OTHER',label:'Other'}]}],
 ['mode-mismatch',{...input,mode:'discovery'}],
 ['no-conflict-list',{...input,conflictWarnings:undefined}],
 ['valid-leap-date',{...input,analysisDate:'2024-02-29',facts:[{...input.facts[0],confirmedAt:'2024-02-29'}]}]
];
for(const [name,sent] of inputCases)for(const status of ['ACCEPTED','REJECTED']){
 const {db,a}=await context();const base={...a,status,output:status==='ACCEPTED'?output:null,rawOutput:status==='ACCEPTED'?null:'bad'};
 const supplied={...base,input:sent};const cmd=command(db,supplied);const cmddetail={accepted:cmd.accepted,error:cmd.error};
 // Use a fresh valid baseline before damaging the backup.
 if(cmd.accepted){db.sqlite.run('DROP TABLE ai_analyses');db.sqlite.close();}
 else db.sqlite.close();
 const ctx=await context();recordAiAnalysis(ctx.db,{...ctx.a,...base,customerId:ctx.customer.id,kycVersionId:ctx.version.id});
 const b=JSON.parse(exportBackup(ctx.db));b.tables.ai_analyses[0].input_json=JSON.stringify(sent);
 log('input-'+name+'-'+status,{command:cmddetail,backup:await rt(b)});ctx.db.sqlite.close();
}
{
 const {db,a,customer,version}=await context();
 const states=()=>listAiAnalyses(db,customer.id).map(x=>({seq:x.seq,state:x.state,reminder:x.reminder}));
 recordAiAnalysis(db,a);recordAiAnalysis(db,{...a,status:'REJECTED',output:null,rawOutput:'bad',attempts:2});recordAiAnalysis(db,a);
 log('same-instant-seq',{states:states()});
 function fact(field,value,date){const note=addKycNote(db,customer.id,{text:'Ghi chú giả',date});return confirmKycFact(db,customer.id,{field,value,date,noteId:note.id}).version;}
 fact('occupation','Bác sĩ',calendarDate(2026,10,8));fact('occupation','Giám đốc',calendarDate(2026,10,4));
 log('minor-backdated',{states:states()});
 fact('maritalStatus','Đã kết hôn',calendarDate(2026,10,6));
 log('material',{states:states()});
 const currentVersion=listKycVersions(db,customer.id).at(-1);
 recordAiAnalysis(db,{...a,kycVersionId:currentVersion.id});recordAiAnalysis(db,a);
 log('late-old-result',{states:states()});
 recordAiAnalysis(db,{...a,kycVersionId:currentVersion.id});
 const before=states();softDeleteCustomer(db,customer.id);let deleted;try{listAiAnalyses(db,customer.id);deleted='visible';}catch(e){deleted=e.code;}
 const b=JSON.parse(exportBackup(db));const restored=await importBackup(JSON.stringify(b),{now});restoreCustomer(restored.db,customer.id);
 log('deleted-backup-restore',{deleted,retained:JSON.stringify(listAiAnalyses(restored.db,customer.id).map(x=>({seq:x.seq,state:x.state,reminder:x.reminder})))===JSON.stringify(before)});
 restored.db.sqlite.close();db.sqlite.close();
}
{
 const {db,a,customer}=await context();recordAiAnalysis(db,a);
 const b=JSON.parse(exportBackup(db));b.tables.ai_analyses[0].seq=Number.MAX_SAFE_INTEGER;
 const {db:copy}=await importBackup(JSON.stringify(b),{now});const before=exportBackup(copy);
 const cmd=command(copy,a);log('seq-limit',{accepted:cmd.accepted,error:cmd.error,unchanged:exportBackup(copy)===before});
 copy.sqlite.close();db.sqlite.close();
}
for(const oldVersion of [5,7]){
 const {db,a}=await context(MIGRATIONS.slice(0,oldVersion));if(oldVersion===7)recordAiAnalysis(db,a);
 const before=JSON.parse(exportBackup(db));const copy=await importBackup(JSON.stringify(before),{now});
 const after=JSON.parse(exportBackup(copy.db));
 log('backup-migrate-'+oldVersion,{version:copy.db.schemaVersion(),retained:Object.entries(before.tables).every(([n,rs])=>JSON.stringify(rs)===JSON.stringify(after.tables[n])),aiRows:after.tables.ai_analyses.length,fk:copy.db.sqlite.exec('PRAGMA foreign_key_check')});
 db.sqlite.close();copy.db.sqlite.close();
}
{
 const {db,a}=await context(MIGRATIONS.slice(0,7));recordAiAnalysis(db,a);const saved=db.export();let persists=0,error;
 const broken=[...MIGRATIONS.slice(0,8),{...MIGRATIONS[8],sql:MIGRATIONS[8].sql+'\nINSERT INTO missing_table VALUES (1);'}];
 try{await openDatabase({bytes:saved,now,migrations:broken,persist:()=>persists++});}catch(e){error=e.message;}
 const reopened=await openDatabase({bytes:saved,now,migrations:MIGRATIONS.slice(0,7)});
 log('migration-failure',{error,persists,oldVersion:reopened.schemaVersion(),retainedRows:reopened.sqlite.exec('SELECT count(*) FROM ai_analyses')[0].values[0][0]});db.sqlite.close();reopened.sqlite.close();
}
{
 const db=await openDatabase({now});const t=performance.now();seedDemoData(db,{anchorDate:calendarDate(2026,10,10),seed:7});const seededMs=performance.now()-t;
 const analyses=db.sqlite.exec('SELECT mode,input_json,output_json FROM ai_analyses')[0].values;
 const check=analyses.map(([mode,i,o])=>{const result=AI_OUTPUT_SCHEMAS[mode].safeParse(JSON.parse(o));return {schema:result.success,mode};});
 const b=exportBackup(db);const t2=performance.now();const copy=await importBackup(b,{now});const importMs=performance.now()-t2;
 log('seed',{rows:analyses.length,modeCounts:Object.fromEntries(['analysis','discovery'].map(m=>[m,check.filter(c=>c.mode===m).length])),allSchemaValid:check.every(c=>c.schema),roundtrip:copy.db.sqlite.exec('SELECT count(*) FROM ai_analyses')[0].values[0][0]===analyses.length,seededMs:+seededMs.toFixed(2),importMs:+importMs.toFixed(2),backupBytes:Buffer.byteLength(b)});
 db.sqlite.close();copy.db.sqlite.close();
}
fs.writeFileSync(new URL('./edge-results.json',import.meta.url),JSON.stringify(logs,null,2)+'\n');
~~~

### Nguồn presentation.mjs

SHA-256 (UTF-8 không BOM): 807b3a78a389022f7dfd7218ad5fdb8fb3581e7afcdeb7991bd3a55da28b77e4

~~~javascript
import {context,input,output,item,now,root,dbApi} from './fixtures.mjs';
import fs from 'node:fs';
const {analysisContent}=await import(root+'apps/desktop/src/routes/customers/ai-panel-view.ts');
const {createAppAi}=await import(root+'apps/desktop/src/data/ai-analysis.ts');
const {tauriOpenCode}=await import(root+'apps/desktop/src/data/ai-tauri.ts');
const {KYC_CATEGORY_LABELS,KYC_FIELD_LABELS}=await import(root+'packages/db/src/seed-data.ts');
const {vi}=await import(root+'apps/desktop/src/i18n/vi.ts');
const results=[];
for(const [name,value] of [['invalid-output',{}],['ghost-evidence',{...output,hypotheses:[{...item,evidence:['F999']}]}]]){
 const {db,a,customer,version}=await context();dbApi.recordAiAnalysis(db,{...a,output:value});const row=dbApi.listAiAnalyses(db,customer.id)[0];
 let shown;try{const content=analysisContent(row,[version]);shown={rendered:true,hypothesis:content.sections[0]?.groups[0]?.items[0]};}catch(e){shown={rendered:false,error:e.name};}
 results.push({name,state:row.state,shown});db.sqlite.close();
}
{
 const {db}=await context();const calls=[];const client=tauriOpenCode(async(command,args)=>{calls.push({command,args});});
 const ai=createAppAi({read:()=>dbApi.getSetting(db,'ai'),write:s=>dbApi.putSetting(db,'ai',s)},{opencode:client,web:{copy:async()=>true,openChatGpt:async()=>true}});
 ai.save({provider:'OPENCODE_GO',opencodePlan:'CREDIT',model:'deepseek-v4.1-flash',reasoning:'HIGH',key:'FAKE_KEY_MARKER_B'});
 await client.setKey('FAKE_KEY_MARKER_B');
 const exported=dbApi.exportBackup(db);
 results.push({name:'fake-key-exclusion',savedSettings:dbApi.getSetting(db,'ai'),backupContainsFakeKey:exported.includes('FAKE_KEY_MARKER_B'),invokeCommands:calls.map(c=>c.command)});
 db.sqlite.close();
}
results.push({name:'labels-match-i18n',categories:Object.entries(KYC_CATEGORY_LABELS).every(([k,v])=>vi['kycCategory.'+k]===v),fields:Object.entries(KYC_FIELD_LABELS).every(([k,v])=>vi['kycField.'+k]===v)});
fs.writeFileSync(new URL('./presentation-results.json',import.meta.url),JSON.stringify(results,null,2)+'\n');for(const r of results)console.log(JSON.stringify(r));
~~~

### Nguồn real-input.mjs

SHA-256 (UTF-8 không BOM): 03e7113512bb13304a54bfef1e2f7fbfd62d72420fbfb72708fe148dea00c799

~~~javascript
import {context,output,item,now,root,dbApi,calendarDate} from './fixtures.mjs';
import fs from 'node:fs';
const {buildAnalysisInput}=await import(root+'packages/ai/src/input.ts');
const {evaluateKycGate}=await import(root+'packages/domain/src/index.ts');
const {recordKycNote,getKycProfile}=await import(root+'packages/db/src/kyc.ts');
const results=[];
for(const [name,bad] of [['output-empty',{}],['ghost-evidence',{...output,hypotheses:[{...item,evidence:['F999']}]}]]){
 const {db,a,customer}=await context();
 recordKycNote(db,customer.id,{text:'Dữ liệu giả để review: gia đình, nghề, tài sản, mục tiêu',date:calendarDate(2026,9,1),facts:[
 {field:'maritalStatus',value:'Đã kết hôn'},{field:'childrenCount',value:2},{field:'occupation',value:'Bác sĩ'},
 {field:'totalAssets',value:'Khoảng 50 tỷ'},{field:'primaryGoal',value:'Quỹ học phí cho con'},{field:'riskProfile',value:'Cân bằng'},
 {field:'hasProtection',value:true},{field:'mainConcern',value:'Ổn định tài chính gia đình'}]});
 const profile=getKycProfile(db,customer.id);const gate=evaluateKycGate(profile.facts);
 const input=buildAnalysisInput(profile,gate,calendarDate(2026,10,10));const version=dbApi.listKycVersions(db,customer.id).at(-1);
 const row=dbApi.recordAiAnalysis(db,{...a,input,kycVersionId:version.id,gateState:gate.state,output:bad});
 let roundtrip;try{const copy=await dbApi.importBackup(dbApi.exportBackup(db),{now});roundtrip={accepted:true};copy.db.sqlite.close();}catch(e){roundtrip={accepted:false,error:e.code,rule:e.params?.rule};}
 results.push({name,gate:gate.state,aiAllowed:gate.aiAllowed,mode:input.mode,factCount:input.facts.length,state:dbApi.listAiAnalyses(db,customer.id)[0].state,roundtrip});
 db.sqlite.close();
}
fs.writeFileSync(new URL('./real-input-results.json',import.meta.url),JSON.stringify(results,null,2)+'\n');for(const r of results)console.log(JSON.stringify(r));
~~~

### Nguồn mutation.config.mjs

SHA-256 (UTF-8 không BOM): 77a9d888a70610c166bd860867b76ba7be210d00ae4a49c649b2e7beb4f8a664

~~~javascript
import { defineConfig } from 'file:///C:/workspace/Project-2C-review-2/node_modules/vitest/dist/config.js';
const root='C:/workspace/Project-2C-review-2';
const mutant=process.env.B_MUTANT || 'baseline';
let changed=false;
function swap(source,from,to) { if(!source.includes(from)) throw new Error('Mutation target missing: '+mutant); changed=true;return source.replace(from,to); }
export default defineConfig({
 root,
 cacheDir:'C:/workspace/deep-review-5/codex/B/vite-cache',
 plugins:[{
 name:'review-in-memory-mutation',
 enforce:'pre',
 transform(code,id) {
  if(id.replaceAll('\\','/').endsWith('/packages/db/src/ai-analyses.ts')){
   if(mutant==='skip-input')return swap(code,'analysisInputSchema.safeParse(a.input).data?.mode === a.mode &&','true &&');
   if(mutant==='skip-nul')return swap(code,"raw.replaceAll('\\0', '�')",'raw');
   if(mutant==='current-old-version')return swap(code,'latestAccepted?.kycVersionId === latestVersion?.id ? latestAccepted : undefined','latestAccepted');
   if(mutant==='enforce-output'){
    code=swap(code,'analysisInputSchema, WEB_PROMPT_VERSION','AI_OUTPUT_SCHEMAS, analysisInputSchema, WEB_PROMPT_VERSION');
    return swap(code,"(a.status === 'ACCEPTED'\n      ?","(a.status !== 'ACCEPTED' || AI_OUTPUT_SCHEMAS[a.mode].safeParse(a.output).success) &&\n    (a.status === 'ACCEPTED'\n      ?");
   }
  }
  if(mutant==='skip-backup-evidence' && id.replaceAll('\\','/').endsWith('/packages/db/src/backup-validation.ts'))return swap(code,'.every((item) => item.evidence.every((code) => codes.has(code)))','.every(() => true)');
 },
 closeBundle(){ if(mutant!=='baseline'&&!changed)throw new Error('Mutation was never applied'); }
 }],
 test:{
  include:['packages/db/src/ai-analyses.test.ts','packages/db/src/backup-invariants.test.ts'],
  name:mutant,
  testTimeout:180000,
  fileParallelism:false,
  reporters:['json'],
  outputFile:'C:/workspace/deep-review-5/codex/B/mutation-'+mutant+'.json'
 }
});
~~~
