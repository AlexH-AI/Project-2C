# packages/ai — AI copilot: schema, adapter, Mock

Phase 5 (`docs/design/phase-5-ai.md`, ADR-0009). Kiểu dữ liệu, mã lỗi `AiError`, zod schema output của 3 chế độ (`analysis` / `discovery` / `extraction`), giao diện adapter, adapter Mock, validator V1–V7, prompt có version, điều phối (cổng → prompt → gọi → kiểm → thử lại) và single-flight.

## Ranh giới

- Chỉ phụ thuộc `@p2c/domain` + `zod` (rule `ai-only-on-domain-and-zod`, `pnpm lint:deps`); không import `db`, `ui`, `apps`, Tauri, `node:*`. Adapter OpenCode Go nhận hàm `invoke` được tiêm từ `apps/desktop`.
- Public API qua `src/index.ts` (`@p2c/ai`). Ngoại lệ duy nhất: `packages/db` import **đúng** `@p2c/ai/schema` (`src/schema.ts`) để kiểm `output_json` khi nhập backup (ADR-0006 phụ lục 07/10/2026). Vì vậy `src/schema.ts` chỉ import `zod` + `domain`, không import file khác của `ai` (rule `ai-schema-standalone`).
- Module nội bộ, `index.ts` không re-export (T-288): `src/attempts.ts`, `src/analysis-steps.ts` (phần `run.ts` và `web.ts` dùng chung). Script eval (`tools/eval-ai-core.mjs`) import thẳng theo đường file.
- Mỗi chế độ một schema, luôn bản mới nhất; đổi schema → nạp lại dữ liệu giả lập (R2-02), không giữ schema cũ.
- Coverage 100% (`vitest.config.ts`).

## File hay tìm

- Schema output + mã `F{seq}`: `src/schema.ts` (spec §6.2, gồm khối `personalityNotes` — P6). Kiểm field / value / quote của trích xuất là V7, không ở schema.
- Schema đầu vào analysis / discovery (`analysisInputSchema`, spec §6.1) cũng ở `src/schema.ts`; kiểu `AnalysisInput` suy từ nó (một định nghĩa). `db` kiểm `input_json` bằng schema này khi ghi và khi nhập backup (§7.3 luật 3, T-176); panel đọc `input` bằng `parse`, không ép kiểu.
- Lấy khối JSON đầu tiên từ trả lời: `src/extract-json.ts` (spec §6.1), một lượt; bị cắt → `CUT_ANSWER`. Đếm / cắt theo code point không cấp phát: `src/code-points.ts`.
- Cấu hình Settings → AI (`settings` khóa `ai`, spec §4.1): `src/settings.ts` — `readAiSettings` đọc / chuẩn hóa (hỏng → mặc định cả khối + lý do; gói thiếu / sai → `GO`; model không nhận `reasoning_effort` theo `AI_MODELS` → `DEFAULT`), không bao giờ có key.
- Mã lỗi: `src/errors.ts` (spec §5.3; mã chỉ `ai` sinh: `AI_TOO_LARGE`); lỗi AI dạng giá trị `AiFailed` (mã + `AiErrorDetails`: mã HTTP, câu của server), chép chi tiết bằng `errorDetails` (`run.ts`, app) · model: `src/models.ts` (spec §4; cờ `reasoningEffort` theo lần gọi thật 09/10/2026, T-179); danh sách provider / reasoning nằm ở `src/schema.ts` để `db` dùng chung cho `ai_analyses` (T-163; `AI_ANALYSIS_PROVIDERS` = Settings + `CHATGPT_WEB`, spec §4.1), cùng tập provider không có model / token `AI_ANALYSIS_NO_MODEL` và trần `raw_output` / câu dán `MAX_AI_RAW_OUTPUT` (20 000, T-288). Dạng `prompt_version` (`<mode>@<n>`, thêm `+web@<n>` cho ChatGPT web) do `db` kiểm (`analysisLabelsFit`, T-192).
- Adapter: `src/adapter.ts` (giao diện) · Mock: `src/mock-adapter.ts` (message `user` đầu tiên, G5 §1.1 / §4.1; câu trả lời: `mock…Output` ở `schema.ts`).
- Validator (spec §6.4): `src/validator.ts` — `validateOutput` (V1 cả ba chế độ, `detail` nêu dạng đúng: refine, mẫu `regex`, union mang message của mình ở `schema.ts`; V2–V6 analysis / discovery), `filterExtraction` (V7 bỏ riêng từng dữ kiện trích xuất). Danh sách chặn V3–V6 chép nguyên từ G5 §8: `src/blocklists.ts`; cách so khớp G5 §7 (bước 0, bản không dấu, danh sách đóng): `src/text-match.ts`. V1 (`schema.ts`, G5 §11.5): chuỗi gốc ≤ 1 000 ký tự; phần thấy được (`normalizeText`) 1–300, `text` analysis / discovery có chữ cái. Đổi danh sách = qua G5 lại.
- Prompt (G5 §2–§6, nguyên văn): `src/prompts/<mode>.ts` (mỗi file một `version`, `maxTokens`), message thử lại `src/prompts/retry.ts`, Kiểm tra kết nối `src/prompts/connection.ts`. `prompts.test.ts` so chữ với `docs/design/phase-5-prompts.md`; đổi một chữ = tăng version + qua G5.
- Dựng đầu vào (spec §6.1, G5 §1.1 / §4.1): analysis — `buildAnalysisInput` ở `src/schema.ts` (dữ kiện `active` / `conflict`, năm sinh thành tuổi); trích xuất — `src/input.ts`. Nhãn `KYC_*_LABELS`, `buildAnalysisInput`, câu Mock ở `schema.ts` cho seed `db` dùng chung (I-10); test i18n của app giữ nhãn khớp `vi.ts`.
- Điều phối (spec §3, §5.2, §8): `src/run.ts` — `runAnalysis` trả `row` cho `recordAiAnalysis` của `db` (app lưu, `ai` không import `db`), `runExtraction` trả đề xuất đã lọc V7, `checkConnection`. Mọi yêu cầu qua **một** `AiRunner` chung cả app (`createAiRunner`): `busy` tới khi adapter trả thật, kể cả sau Hủy (P5), và luôn tắt khi job kết thúc theo mọi đường; lỗi runner không trả được cho người gọi (listener ném, bug của job sau Hủy) đi qua `reportError` mà app truyền vào, không nuốt im. Vượt trần 200 000 ký tự → `AI_TOO_LARGE` trước Rust.
- Luật lần thử (tối đa 2, một lần thử lại kèm message G5 §5) và lấy JSON + kiểm một câu trả lời: `src/attempts.ts` (`nextRetry`, `checkAnswer`), dùng chung cho `run.ts` và `web.ts`; `src/prompts/retry.ts` chỉ còn chữ G5 §5.
- Phần phân tích mà `run.ts` và `web.ts` dùng chung: `src/analysis-steps.ts` — prompt theo chế độ, lấy đầu vào (`takeAnalysisInput`), kiểm câu trả lời, phần `row` do câu trả lời quyết định (`analysisOutcome`; REJECTED với trả lời rỗng lưu `EMPTY_RAW_OUTPUT`, `db` không nhận `raw_output` rỗng), `NO_MODEL` cho provider của `AI_ANALYSIS_NO_MODEL`, và `AnalysisSubject` (cặp `customerId` + `kycVersionId` của yêu cầu, `row`, phiên ChatGPT web).
- ChatGPT web (spec §3.1, P7): `src/web.ts` — `startWebAnalysis` (cổng → ảnh chụp đầu vào → tin nhắn `web@1`, chữ bọc G5 §6a nguyên văn trong `WEB_WRAPPER`), `checkWebAnswer` (dán rỗng / dán lại tin nhắn của app — dòng khung hoặc dòng đầu / cuối của message thử lại, G5 §6a, cách so ở `web.ts` / > 20 000 ký tự theo code point → không tính lần thử; lần 1 sai → lỗi + message "Copy yêu cầu sửa"; xong → `row` `CHATGPT_WEB`, `prompt_version` `<mode>@<n>+web@1` theo `webPromptVersion`, app dùng lại cho chip 4e). Không gọi mạng, không qua adapter / `AiRunner`; phiên là giá trị panel giữ, không lưu.
- Test lấy version prompt từ `PROMPT_VERSIONS` (e2e: `PROMPT` của `e2e/fixtures.ts`, đọc từ `@p2c/ai/schema`); chỉ `prompts.test.ts` ghim chữ như G5 (T-288).

## Bản đồ export

Phần dưới do `pnpm codemap` sinh (`tools/codemap.mjs`), không sửa tay; `pnpm verify` báo đỏ khi lệch code.

<!-- codemap:start -->
- `src/` — adapter.ts, analysis-steps.ts, attempts.ts, blocklists.ts, code-points.ts, errors.ts, extract-json.ts, index.ts, input.ts, mock-adapter.ts, models.ts, run.ts, schema.ts, settings.ts, test-support.ts, text-match.ts, validator.ts, web.ts
- `src/prompts/` — analysis.ts, connection.ts, discovery.ts, extraction.ts, retry.ts
<!-- codemap:end -->
