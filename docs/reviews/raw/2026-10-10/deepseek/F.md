# Deep review Phase 5 — gói F (xuyên gói) — DeepSeek

- **SHA:** `0df3606fb783cc89b1b9c413c02810340e273a4f` (`git rev-parse HEAD` đầu phiên, khớp ghim `0df3606`).
- **`git status --short` đầu phiên:** `?? opencode.json` (đúng như dự kiến); cuối phiên xem §8.
- **Phạm vi gói F (plan §3):** toàn repo — đường đi đầu-cuối của một lần phân tích / trích xuất / ChatGPT web; hợp đồng giữa `ai` ↔ `db` ↔ UI ↔ Rust (mã lỗi, kiểu, giới hạn); key và dữ liệu KH đi đâu; hồi quy vào Phase 1–4 (backup, thay DB, phiên bản KYC, dòng thời gian); code lặp / chết xuyên gói; kết luận **SẴN SÀNG / CHƯA SẴN SÀNG** cho G7 Phase 5 (cuối file).
- Chỉ đọc + chạy lệnh; không sửa file nào trong repo. Test tạm ở `C:\workspace\deep-review-5\deepseek\F\`.

## 0. Bối cảnh gói F

Gói F đọc lại các báo cáo A–E của chính reviewer này (đã có: A `packages/ai` + domain; B `db`; C Rust; D UI; E tools + e2e + CI) và review **chỗ nối giữa các gói**, không lặp lại các phát hiện đã báo (chỉ dẫn ID khi cần). Tổng kết các gói trước: A 5 phát hiện (DS-A1 Medium — ký tự vô hình lọt V3–V6; DS-A2 Low; DS-A3/A4 Low hiệu năng; DS-A5 Low trùng nhãn), B 4 (DS-B1 Low lệch luật lệnh ↔ nhập; DS-B2/B3 Low trùng/ lệch seed; DS-B4 Nit), C 2 (DS-C1 Low biên 2 MB; DS-C2 Low test thiếu cho cấu hình HTTP), D 2 (DS-D1 Low thiếu lời giải thích khi AI bận ở KH khác; DS-D2 Nit model nhãn theo settings hiện tại), E 7 (DS-E1..E7, không quá Low/Nit). **Không có Critical / High / Medium nào ngoài DS-A1.**

## 1. Phạm vi đã đọc trong phiên F

**Tài liệu chuẩn (đọc trước):** `C:\workspace\deep-review-5\common\plan.md` 1–119 · `baseline.md` 1–29 · `known.md` 1–104 · `build-web.log` 1–38. Repo: `CONTEXT.md` 1–46 · `CLAUDE.md` 1–120 · `docs/design/phase-5-ai.md` 1–430 · `docs/design/phase-5-prompts.md` 1–345 (từng bảng) · `docs/golden/ai-eval.md` 1–119 · `docs/decisions/0009-ai-copilot-provider-va-guardrail.md` 1–82 (gồm D-1, G5, W-1).

**Báo cáo gói trước của chính reviewer (theo quy định gói F):** `deepseek\A.md` 1–240 · `B.md` 1–155 · `C.md` 1–183 · `D.md` 1–119 · `E.md` 1–202.

**Mã đọc trong phiên này (dòng):**

| Vùng | File (dòng) |
|---|---|
| `packages/ai` | `run.ts` 1–394 · `web.ts` 1–121 · `errors.ts` 1–46 · `settings.ts` 1–86 · `schema.ts` 1–159 · `models.ts` 1–35 · `input.ts` 1–132 · `index.ts` 1–11 · `adapter.ts` 1–37 · `mock-adapter.ts` 1–170 · `validator.ts` 1–228 · `prompts/retry.ts` 1–51 + quét `version`/`maxTokens` bốn prompt |
| `packages/db` | `ai-analyses.ts` 1–277 · `schema.ts` 280–384 · `backup-validation.ts` 300–446 · `common.ts` 1–153 · `settings.ts` 1–29 · `index.ts` 1–98 · `backup.ts` 1–201 · `kyc.ts` 54–203 + `getKycProfile` · `customers.ts` 68–94 · `appointments.ts` 80–129 · `test-support.ts` 1–38 · quét migration 0005–0008 |
| `apps/desktop` (data) | `data/ai-analysis.ts` 1–304 · `data/ai-jobs.ts` 1–76 · `data/ai-tauri.ts` 1–75 · `data/app-data.ts` 1–381 · `data/tauri-contract.test.ts` 1–195 |
| UI | `routes/customers/KycIntelligence.tsx` 1–445 · `KycWebSession.tsx` 1–172 · `use-ai-job.ts` 1–48 · `ai-panel-view.ts` 1–521 · `extraction-view.ts` 1–83 · `KycExtraction.tsx` 1–134 · `KycHistory.tsx` 1–154 · `routes/appointments/AppointmentAi.tsx` 1–81 · `appointment-ai-view.ts` 1–41 · `AppointmentsScreen.tsx` 90–134 + 555–652 · `CustomerProfile.tsx` 30–89 · `SettingsAi.tsx` 1–357 · `settings-ai-view.ts` 1–107 · `App.tsx` 1–18 · `shell/AppShell.tsx` 25–60 · `shell/routes.ts` 1–64 · `main.tsx` 1–43 · `i18n/index.ts` 1–132 · `i18n/vi.ts` khối AI (121–234, 367–379, 522–524, 980) |
| Rust / cấu hình | `src-tauri/src/ai.rs` 1–889 · `src-tauri/src/lib.rs` 1–205 · `tauri.conf.json` 1–31 · `capabilities/default.json` 1–7 · `package.json` các package |

**Lệnh đã chạy (chỉ đọc / sinh output bị ignore):**

| Lệnh | Kết quả |
|---|---|
| `git rev-parse HEAD` | `0df3606fb783cc89b1b9c413c02810340e273a4f` |
| `git status --short` | `?? opencode.json` |
| `pnpm.cmd verify` | **xanh** — format, lint, `lint:deps` 0 vi phạm (297 module / 1 156 phụ thuộc), tokens, codemap, typecheck; **102 file / 2 152 test pass**; coverage 98,89 / 97,43 / 98,86 / 99,13 (khớp `baseline.md` từng số) |
| `pnpm.cmd verify:rust` | **xanh** — `cargo fmt --check` + clippy `--lib --tests -D warnings` + **73 test pass** (0,67 s) |
| `$env:CI="1"; pnpm.cmd e2e` | **182 passed (1,5 phút)**, 0 flaky (khớp baseline) |
| Probe F (vitest ngoài repo, §7) | **2 file / 14 test xanh**; các dòng PROBE ở từng phát hiện |

## 2. Phát hiện

### DS-F1

```
ID: DS-F1
Mức: Low
Trục: C (kèm D)
Vị trí: packages/db/src/ai-analyses.ts:141–143 (toRow, nhánh ACCEPTED) ·
        apps/desktop/src/routes/customers/ai-panel-view.ts:360, 386, 399 (parse input/output khi render)
        · đối chiếu packages/db/src/backup-validation.ts:401–409 (luật 13 khi nhập)
Tình trạng: CONFIRMED (probe)
```

**Mô tả — cùng gốc DS-B1 (gói B), đây là bằng chứng hậu quả mới ở tầng F:** luật nhập backup **có** kiểm `output_json` của dòng `ACCEPTED` qua zod schema của `mode` (rule 13) nhưng lệnh `recordAiAnalysis` **không**; gói B đã ghi hậu quả "file export của chính app bị từ chối khi khôi phục". Phiên F đo thêm hậu quả ở đầu đọc: `analysisContent` gọi `analysisInputSchema.parse` / `analysisOutputSchema.parse` **ngay trong lúc render** (KycIntelligence → `Analysis`), nên một dòng `ACCEPTED` sai schema làm **cả màn Hồ sơ KH ném ZodError** (ErrorBoundary của màn hiện "màn lỗi"), không chỉ panel AI. Hôm nay chưa có đường produção tạo dòng như vậy (hai lời gọi đều lấy `row` đã qua `AI_OUTPUT_SCHEMAS[mode].parse` ở `run.ts:306` / `web.ts:112`); rủi ro mở khi có caller mới hoặc hồi quy tầng `ai`.

**Tái hiện / bằng chứng** — probe `probe-f.test.ts` (nguồn §7), dòng thật:

```
PROBE-F analysisContent threw: ZodError: [
PROBE-F bad-output import refused: rule 13
```

(ca "the db command accepts an ACCEPTED output the UI cannot read": `recordAiAnalysis` **nhận** dòng `ACCEPTED` output `{hypotheses:[…]}` thiếu 5/6 khối — test khẳng định `saved.status = 'ACCEPTED'`; gọi `analysisContent(saved, versions)` → `ZodError` (thông điệp nhiều dòng nên log cắt ở `[`); cùng file export ra bị `importBackup` **từ chối** ở luật 13 — đúng như DS-B1.)

**Ảnh hưởng:** ai / khi nào — nếu dòng `ACCEPTED` sai schema lọt vào DB (caller mới, hoặc hồi quy validator), RE mở Hồ sơ KH là cả màn lỗi (không chỉ panel); ngoài ra file `exportBackup` do app xuất bị chính app từ chối khi khôi phục (không có cách sửa trong app). Cùng lớp "đầu ra chưa khóa" mà gói B nêu.

**Đề xuất:** như DS-B1 — thêm vào nhánh `ACCEPTED` của `toRow`: `AI_OUTPUT_SCHEMAS[a.mode].safeParse(a.output).success` và `evidence ⊆ a.input.facts` (≈15 dòng + sửa fixture test cũ dùng output rút gọn); phòng thủ hai lớp (tùy chọn): `analysisContent` trả cờ "không đọc được" thay vì ném. Cỡ ≤ 40 dòng SP.

### DS-F2

```
ID: DS-F2
Mức: Nit
Trục: C
Vị trí: packages/db/src/ai-analyses.ts:138–139 (toRow: isLabel + hậu tố web) và
        packages/db/src/backup-validation.ts:381–387 (luật 12) · hiển thị: ai-panel-view.ts:404, 464
Tình trạng: CONFIRMED (probe)
```

**Mô tả:** `prompt_version` chỉ cần là "nhãn" khác rỗng (`isLabel`) + hậu tố `+web@<n>` với `CHATGPT_WEB`; **không** có ràng buộc phần đầu khớp `mode` của dòng (`analysis` / `discovery`). Cả lệnh lẫn luật nhập chấp nhận dòng `mode = analysis` mang `prompt_version = 'discovery@1'` (hoặc chuỗi rác), và chuỗi đó hiện **nguyên văn** trên chip kết quả + cột Prompt của lịch sử. Hôm nay không có đường tạo sai từ app (`run.ts:331` và `web.ts:116` lấy `ANALYSIS_PROMPTS[input.mode].version`, có test so chữ); đây là lớp cứng hóa cùng chỗ sửa với DS-F1/DS-B1, ngoài yêu cầu chữ của spec §7.3 rule 2.

**Tái hiện / bằng chứng** — probe `probe-f.test.ts`, ca "prompt_version is a label only…":

```
PROBE-F prompt_version mismatch recorded: analysis row with discovery@1
PROBE-F prompt_version mismatch imported without a rule
```

**Ảnh hưởng:** nhãn sai (prompt hiển thị không khớp chế độ đã chạy) nếu một caller/backup hỏng tạo ra; không mất dữ liệu, không đụng guardrail; mức Nit.

**Đề xuất:** khi sửa DS-F1/DS-B1, thêm kiểm `prompt_version` bắt đầu bằng `<mode>@` ở `toRow` và luật 12 (≈10 dòng + test), hoặc ghi chú chấp nhận trong doc comment. Cỡ ≤ 10 dòng SP.

## 3. Bảng đếm mức × trục

| Mức \ Trục | E | G | C | D | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| Low | | | 1 (DS-F1) | | | | | | | **1** |
| Nit | | | 1 (DS-F2) | | | | | | | **1** |
| **Tổng** | 0 | 0 | **2** | 0 | 0 | 0 | 0 | 0 | 0 | **2** |

(Không có phát hiện mới ở 7 trục còn lại; các mục đã báo ở A–E hoặc `known.md` không đếm lại.)

## 4. Đã xét, không thấy (kèm cách đã xét)

- **E — Edge case.** Đi qua từng chỗ nối đã đọc + test/probe/e2e:
  - *Rỗng / một phần tử / rất nhiều:* lịch sử 1 dòng / nhiều dòng (B đo 1 001 dòng 19 ms); `listAiAnalyses` rỗng → panel hiện `aiPanel.empty` ("Chưa có phân tích AI cho KH này."); phiên web không có paste → nút tắt (test + e2e). Không thấy lỗi mới.
  - *Unicode / dấu:* mã F thuần ASCII; đếm ký tự theo code point ở khung dán/extraction (test 😀 có từ trước); NFD/khoảng trắng của validator thuộc A.
  - *Ngày:* `analysisDate` = ngày app lúc chụp, `ai_analyses.date` = ngày app lúc lưu (`common.ts:59`); hai mốc chỉ lệch nếu vắt nửa đêm giữa chụp và lưu — cả hai đều hợp lệ theo spec §7.1/§6.1, không thấy lỗi. B01–B11 thuộc A.
  - *Hai thao tác chồng nhau:* một runner chung (`ai-jobs.ts`) + cờ `Busy` Rust là hai chốt; web không giữ khóa (đúng §3.1 item 5); trong phiên web, nút Phân tích/ChatGPT web của chính KH tắt qua `webOpen` (`ai-panel-view.ts:86`). Không thấy lỗi mới (DS-D1 đã ghi phần thiếu lời giải thích khi bận ở KH khác).
  - *Hủy / timeout / lỗi giữa chừng:* bỏ kết quả sau Hủy (`run.ts:201`), nút khóa tới khi adapter trả, `busy` giữ qua Hủy (test + e2e `customer-ai.spec.ts:345`); lỗi mạng lần 1/2 không lưu (test).
  - *Tải lại / thay DB khi đang chạy:* `discarded` khi KH/phiên bản biến mất (`ai-analysis.ts:152`); nhập backup giữa phiên web → lưu bị từ chối mềm, phiên đóng (`webAfter` default null). Không thấy lỗi mới.
  - *Đổi KH khi màn đang mở:* `ErrorBoundary key={routeToHash(route)}` (`AppShell.tsx:52`) đổi theo id → `CustomerProfile` remount, nên state phiên web / `ended` **không** rò sang KH khác; ngược lại rời KH là mất phiên (đúng spec §3.1 item 4). Đã xét kỹ vì đây là chỗ dễ lọt nhất — không thấy lỗi.
  - *Biên 2 MB / 20 000:* phần Rust ghi ở DS-C1 (gói C); khung dán web chặn > 20 000 code point trước `extractJson` (nên O(n²) của DS-A3 chỉ còn đường OpenCode 2 MB). Không thêm phát hiện.
- **G — Guardrail AI (phía xuyên gói).** AI không có đường ghi vào dữ liệu KYC: `recordAiAnalysis` chỉ INSERT `ai_analyses`; đề xuất trích xuất không đi qua `app.run` (chỉ hộp 3f sau khi RE xác nhận); REJECTED không bao giờ hiện như kết quả (`aiPanelView.shown` = ACCEPTED; probe: lịch sử có REJECTED + `shown` vẫn ACCEPTED). Cổng chặn không ghi lịch sử (P2) — nút tắt trước khi gọi. V2 dùng `factCodes` của **input đã chụp**, khớp dữ liệu `input_json` đã lưu (probe: dòng Mock tròn qua export/import). V1–V7 chi tiết thuộc A (DS-A1/A2 đứng); không thêm lỗi mới ở lớp nối.
- **C — Đúng hợp đồng (trọng tâm gói F).** Đối chiếu bằng probe + đọc:
  - *Mã lỗi:* `AI_ERROR_CODES` (10) có đủ hằng trong `ai.rs` (11, thêm `AI_OPEN_BROWSER` — chỉ dùng cho `open_chatgpt`, webview đọc thành boolean) và đủ key `aiError.*` trong `vi.ts` (`AI_BAD_REQUEST` → `GENERAL` qua `panelError`/`errorText`). `PROBE-F codes: ai 10, rust 11, vi 9`. Khớp.
  - *Lệnh / tham số:* `tauri-contract.test.ts` so camelCase từng lệnh với chữ ký Rust (C đã đọc); probe tự khẳng định lại danh sách lệnh + `ai_key_status -> bool`. Khớp.
  - *Giới hạn:* `MAX_RAW_OUTPUT = MAX_AI_RAW_OUTPUT = 20 000`; Rust `MAX_BODY 2 MB`, `MAX_MESSAGE_CHARS 200 000`, `MAX_TOKENS 16 000`, session 1–64 `[A-Za-z0-9-]`, key 512; prompt gửi 8 000 / 8 000 / 4 000 / 64 — đều nằm trong trần. Khớp (đoạn 2 MB biên ở DS-C1).
  - *URL:* hai URL gói Go/Credit + `chatgpt.com` hằng cố định ở Rust; bản web dùng hằng `CHATGPT_URL` của app (`ai-analysis.ts:67`) và bị test khẳng định riêng — hai bên có test chặn lệch, không lệch âm thầm. Khớp.
  - *prompt_version / mode:* lệch ràng buộc → DS-F2 (Nit).
  - *Nhãn UI / chip:* chip panel "kyc v· prompt · model|Mock|ChatGPT web · dd/mm hh:mm" (probe: `{"version":9,"prompt":"discovery@1+web@1","at":"01/10 12:00"}`), lịch sử 5 cột, badge CURRENT/STALE/REJECTED — khớp D; không thêm.
  - *settings.ai:* chỉ 4 trường, không key; `readAiSettings` fallback có lý do (D + test); model bỏ danh sách hiện mã thô (modelLabel fallback) — khớp spec §4.2.
- **D — Dữ liệu.** Probe: một lần chạy Mock trọn vòng `ai → recordAiAnalysis → listAiAnalyses (CURRENT) → exportBackup → importBackup → CURRENT y hệt` (input/ promptVersion giữ nguyên); phiên bản KYC mới → `STALE` + `reminder {material:true, since}` đúng; phiên web 2 lần sai → `REJECTED`, `raw_output` = lần dán cuối, không nhắc nhở; luật 12 từ chối `CHATGPT_WEB` mất hậu tố `+web@n` (`BACKUP_INVALID`); `ai_analyses` nằm trong `dataTables` nên xuất/nhập trọn bảng (B đã test round-trip từng dòng). Xóa mềm KH: panel/ lệnh chặn (`CustomerProfile.readProfile` trả `undefined` trước khi gọi `listAiAnalyses`; `listAppointments` loại KH đã xóa → `AppointmentAi` không nhận KH đã xóa — đã đọc `appointments.ts:103`, `AppointmentsScreen.tsx:649`, `Detail` trả nhánh rỗng khi không có dòng). Migration 0005→0008 + trigger chặn sửa/xóa: quét lại migration khớp schema.ts (B đã test mở DB cũ). Không thấy mất/sai dữ liệu mới ngoài DS-F1/DS-F2.
- **S — An toàn (xuyên gói).** Key: chỉ `ai.rs` đọc/ghi Credential Manager; không lệnh nào trả key (`ai_key_status -> bool`); không log (`grep println!|eprintln!|dbg!|tracing|log::` trong `src-tauri/src` = 0 match); `server_message` che key trước khi cắt (test Rust); `settings`/backup không có key (B + D đã kiểm). Gọi mạng: chỉ Rust, URL hằng, `https_only(true)`, `max_redirects(0)`, timeout 120/10 s; CSP `connect-src 'self' ipc: http://ipc.localhost` không `https:` (probe parse `tauri.conf.json`), `capabilities` đúng `core:default` + `core:window:allow-destroy`. Dữ liệu KH đi: input phân tích chỉ dữ kiện (năm sinh→tuổi) + cổng, không tên/mã KH/ghi chú/HĐ (test A + input schema strict); nhánh trích xuất gửi nguyên văn ghi chú, có dòng cảnh báo ở Settings (D). Hiển thị output: không `dangerouslySetInnerHTML`/`innerHTML`/`document.write` trong `apps/desktop/src` (grep phiên này = 0 match); mọi chuỗi model/đề xuất render dạng text. Câu trả lời dán: vào textarea → `checkWebAnswer` (≤ 20 000 code point) → validator; không render HTML; không đưa dữ kiện lên URL. Prompt injection: `JSON.stringify` giữ ghi chú/giá trị là chuỗi JSON (A đã probe `$`/`{}`); lớp chặn cuối là validator + schema (DS-A1 là lỗ hổng đã báo ở A, không mới). Mở URL ngoài: `open_chatgpt` chỉ `explorer.exe + CHATGPT_URL`, không tham số (test Rust). Không thấy vấn đề mới.
- **P — Hiệu năng (số đo phiên này).** `pnpm verify` 99,89 s / 2 152 test; `verify:rust` 0,67 s / 73 test; `pnpm e2e` 182 test / 1,5 phút; probe: seed demo 3,5 s, một vòng phân tích Mock trọn (chạy + ghi + đọc + view + export + import) ~1,05 s, import cả DB seed 0,78 s, `listAiAnalyses`/`analysisContent` tức thời trong probe. Không có điểm nóng mới ở lớp nối (DS-A3/A4 đã có số đo ở A; DS-E ở E). Kết luận: "đã xét, không thấy" cho gói F.
- **B — Bloat (xuyên gói).** `pnpm codemap:check` xanh; `tsc` không unused (A chạy `--noUnusedLocals` cho ai/domain, D cho app); quét `EMPTY_RAW_OUTPUT`, `AI_ANALYSIS_MODES/GATES/MAX_AI_RAW_OUTPUT`: chỉ dùng nội bộ package/test — không export chết mới. Các trùng lặp đã biết: DS-A5/B3 (nhãn 3 bản), #448 `newSessionId` ↔ `newPage`, #455 `MAX_RAW_OUTPUT` ↔ `MAX_AI_RAW_OUTPUT` + `AI_ANALYSIS_NO_MODEL` ↔ `null` rải chỗ, DS-B2 seed chép Mock — đọc lại, **không có bằng chứng mới**; không tìm thấy trùng lặp/code chết xuyên gói nào khác đủ ngưỡng báo. Hằng `CHATGPT_URL` ở hai tầng (Rust + app) có test hai bên tự khẳng định giá trị → lệch sẽ đỏ ngay, không phải trôi lệch âm thầm; ghi nhận, không mở phát hiện.
- **T — Chất lượng test.** F đọc lại cách các mảnh test chống nhau: `tauri-contract.test.ts` (chữ ký lệnh + mã lỗi + hằng URL/service) là dạng "hợp đồng nguồn" — đúng cách chặn loại lỗi đổi tên một bên; `prompts.test.ts`/`web.test.ts` so chữ G5; A–E đều có mutation đỏ đúng chỗ (A 3 ca, B 2 ca, C 3 ca, D 5 ca, E 8 ca + phá app khi phục vụ). Phiên F thêm 14 ca probe (biên tròn ai↔db↔view, hợp đồng mã/giới hạn/CSP) — tất cả xanh ở SHA. Không thấy test giả xanh mới; các lỗ hổng đã biết (không có test component; e2e chưa phủ "đổi KH khi đang chạy") giữ nguyên như D ghi.
- **A — Trợ năng / i18n.** `t()` typed nên typecheck phủ key: mọi chuỗi AI dùng key có trong `vi.ts` (gồm `aiError.*` 9 mã + GENERAL; `AI_BAD_REQUEST` đi GENERAL theo chủ ý); không thấy chuỗi cứng mới ngoài mục đã ghi `known.md` (`KycExtraction.tsx:96` dấu `:`, #469). `role=status/alert`, `aria-current`, bảng `aria-label` giữ như D/E đã xét. Không thấy vấn đề mới.

**Đối chiếu `known.md` (không báo lại):** đã đọc lại các mục liên quan AI — #420 (chặn nhầm câu thường; A tái hiện, không hậu quả mới), #448 (`newSessionId`↔`newPage`), #455 (ba mục ChatGPT web/`MAX_*`/`retry.ts`), #438 (`dayAndTime`), #468 (`AiJobs`), #469 (3f / nhãn / `AiJobStatus`), #462 (mã F dòng thời gian), #474 (eval), #444 (SettingsAi 1g/…), #465 (`isoDate`/luật 13 test trùng), S-1/D-1 (hash khi nhập — ngoài AI), S-2 (replace chồng — không đổi). Không có bằng chứng mới trừ phần trình bày trong DS-F1 (hậu quả đọc của DS-B1 — là báo cáo của chính tôi, không phải known.md).

## 5. Hồi quy Phase 1–4 (kết luận riêng của gói F)

- **Backup / nhập:** `ai_analyses` + `settings.ai` đi cùng file; nhập chạy luật 11–14; probe round-trip sạch; luật 12 bắt sai hậu tố web. Không hồi quy.
- **Thay DB (Nạp lại / nhập):** kết quả AI đang chạy bị `discarded` khi KH/phiên bản biến mất; `AiJobs` + phiên web là state màn, remount theo route key (đã xét). Không hồi quy.
- **Phiên bản KYC:** STALE suy ra từ `seq` phiên bản (không theo ngày), `material` chỉ đổi lời nhắc; probe + test B. Không hồi quy.
- **Dòng thời gian:** nút trích xuất trên ghi chú RE (không trên SYSTEM), nhãn lấy theo `button` (tương đương `source === 'SYSTEM'` hôm nay — #469 ghi). Mã F chưa lên dòng thời gian — #462 chờ Owner. Không hồi quy mới.
- **Bảng khác:** không bảng nào ngoài `ai_analyses`/`settings` bị đụng; `countRecords` không đếm AI (không có yêu cầu).

## 6. Kết luận cho G7 Phase 5

**SẴN SÀNG.**

Lý do:

1. Tại SHA `0df3606`, cả ba cổng chạy lại nguyên trạng đều xanh: `pnpm verify` (2 152 test, coverage khớp baseline từng số), `pnpm verify:rust` (73 test, clippy `-D warnings`), `pnpm e2e` (182 test, 0 flaky). Bộ eval AI thật đã chạy trước đó đạt ngưỡng (A1 19/20 ≥ 18, R1 0 vi phạm, X 5/5 — `docs/metrics/ai-eval-2026-10-10.md`).
2. Đường đi đầu-cuối đã kiểm bằng probe riêng của gói F (Mock phân tích + ChatGPT web + trích xuất gián tiếp qua e2e/unit), gồm cả vòng backup và STALE/REJECTED; hợp đồng `ai ↔ db ↔ UI ↔ Rust` (mã lỗi, chữ ký lệnh, giới hạn, URL, CSP/capabilities) khớp tại từng điểm đo được.
3. Không có phát hiện **Critical / High** nào trong A–F; không có mục nào chặn merge cuối milestone hay phát hành exe. Các rủi ro đã biết đều được Owner ghi nhận là không chặn (gói Go hết hạn, rủi ro chính sách W-1 mục 7, dữ liệu giả lập nạp lại khi đổi schema…).
4. Các việc nên xếp lịch sửa sau/ngoài G7 (không chặn phát hành, theo thứ tự nên làm): **DS-A1** (Medium — ký tự vô hình lọt V3–V6; gia cố `matchText` + 1 hằng `\p{Cf}`), **DS-B1 + DS-F1** (khóa đầu ra ở `recordAiAnalysis` để lệnh và nhập cùng luật, đồng thời chặn màn đọc nổ), **DS-C1** (biên 2 MB ±1 byte), các mục Low/Nit còn lại của A–E gộp theo file như đề xuất từng báo cáo.

Điều kiện kèm theo (nếu Owner muốn "đóng" sạch hơn trước khi phát hành): xử lý DS-A1 và DS-B1 trong 1 issue nhỏ ≤ 400 dòng SP mỗi bên; còn lại để sau G7.

## 7. Phụ lục — nguồn test tạm

Tất cả trong `C:\workspace\deep-review-5\deepseek\F\`; repo không bị sửa (`git diff --stat` rỗng):

- `vitest.probe.config.mjs` — harness vitest ngoài repo (root = thư mục F, `server.fs.allow` `C:/workspace`).
- `probe-f.test.ts` — 7 ca: phân tích Mock đầu-cuối (chạy → ghi → CURRENT → view → export/import), STALE + reminder material, web@1 dựng tin nhắn + dán đúng → CURRENT chip "ChatGPT web", hai lần dán sai → REJECTED `raw_output` lần cuối, `prompt_version` không gắn mode (DS-F2), lệnh nhận output sai schema rồi `analysisContent` ném ZodError (DS-F1), luật 12 từ chối `CHATGPT_WEB` mất `+web@n`.
- `probe-contracts.test.ts` — 7 ca tĩnh: mã lỗi ai↔Rust↔vi, danh sách lệnh + `ai_key_status -> bool`, giới hạn 20 000/2 MB/200 000/16 000/512/64/120 s/10 s, hai URL + ChatGPT URL, không log, không lộ key, CSP + capabilities.
- `log-probe-f.txt` — log lần chạy cuối (14 test xanh; các dòng `PROBE-F …` dẫn ở §2).
- `node_modules\@p2c\{ai,db,domain}` + `{drizzle-orm,sql.js,zod}` — junction để bản probe ngoài repo resolve được (không đụng repo).

Lệnh chính chạy lại: `C:\workspace\Project-2C-review\node_modules\.bin\vitest.cmd run --config vitest.probe.config.mjs --silent=false` (chạy từ `C:\workspace\deep-review-5\deepseek\F\`). `pnpm` qua `pnpm.cmd` (shim `.ps1` bị chặn bởi execution policy của máy review).

## 8. `git status --short` cuối phiên

```
?? opencode.json
```

Chỉ còn `opencode.json`; mọi test tạm/mutation/log nằm ngoài repo; không đọc `claude\`, `codex\`, `muse\`; không gọi dịch vụ AI thật. Xong gói F — dừng tại đây, chờ Owner.
