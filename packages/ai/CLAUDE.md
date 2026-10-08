# packages/ai — AI copilot: schema, adapter, Mock

Phase 5 (`docs/design/phase-5-ai.md`, ADR-0009). Kiểu dữ liệu, mã lỗi `AiError`, zod schema output của 3 chế độ (`analysis` / `discovery` / `extraction`), giao diện adapter, adapter Mock, validator V1–V7, prompt có version, điều phối (cổng → prompt → gọi → kiểm → thử lại) và single-flight.

## Ranh giới

- Chỉ phụ thuộc `@p2c/domain` + `zod` (rule `ai-only-on-domain-and-zod`, `pnpm lint:deps`); không import `db`, `ui`, `apps`, Tauri, `node:*`. Adapter OpenCode Go nhận hàm `invoke` được tiêm từ `apps/desktop`.
- Public API qua `src/index.ts` (`@p2c/ai`). Ngoại lệ duy nhất: `packages/db` import **đúng** `@p2c/ai/schema` (`src/schema.ts`) để kiểm `output_json` khi nhập backup (ADR-0006 phụ lục 07/10/2026). Vì vậy `src/schema.ts` chỉ import `zod` + `domain`, không import file khác của `ai` (rule `ai-schema-standalone`).
- Mỗi chế độ một schema, luôn bản mới nhất; đổi schema → nạp lại dữ liệu giả lập (R2-02), không giữ schema cũ.
- Coverage 100% (`vitest.config.ts`).

## File hay tìm

- Schema output + mã `F{seq}`: `src/schema.ts` (spec §6.2, gồm khối `personalityNotes` — P6). Kiểm field / value / quote của trích xuất là V7, không ở schema.
- Lấy khối JSON đầu tiên từ trả lời: `src/extract-json.ts` (spec §6.1).
- Mã lỗi: `src/errors.ts` (spec §5.3) · model: `src/models.ts` (spec §4); danh sách provider / reasoning nằm ở `src/schema.ts` để `db` dùng chung cho `ai_analyses` (T-163).
- Adapter: `src/adapter.ts` (giao diện) · Mock: `src/mock-adapter.ts` (đọc message `user` đầu tiên theo mẫu G5 §1.1 / §4.1).
- Validator (spec §6.4): `src/validator.ts` — `validateOutput` (V1 cả ba chế độ; V2–V6 analysis / discovery), `filterExtraction` (V7 bỏ riêng từng dữ kiện trích xuất). Danh sách chặn V3–V6 chép nguyên từ G5 §8: `src/blocklists.ts`; cách so khớp G5 §7 (bản có dấu / bỏ dấu, ranh giới từ Unicode): `src/text-match.ts`. Đổi danh sách = qua G5 lại.
- Prompt (G5 §2–§6, nguyên văn): `src/prompts/<mode>.ts` (mỗi file một `version`, `maxTokens`), message thử lại `src/prompts/retry.ts`, Kiểm tra kết nối `src/prompts/connection.ts`. `prompts.test.ts` so chữ với `docs/design/phase-5-prompts.md`; đổi một chữ = tăng version + qua G5.
- Dựng đầu vào (spec §6.1, G5 §1.1 / §4.1): `src/input.ts` — chỉ dữ kiện `active` / `conflict`, năm sinh gửi thành tuổi, nhãn tiếng Việt chép từ i18n của app (`ai` không đọc được `apps`, kể cả trong test).
- Điều phối (spec §3, §5.2, §8): `src/run.ts` — `runAnalysis` trả `row` cho `recordAiAnalysis` của `db` (app lưu, `ai` không import `db`), `runExtraction` trả đề xuất đã lọc V7, `checkConnection`. Mọi yêu cầu qua **một** `AiRunner` chung cả app (`createAiRunner`): `busy` tới khi adapter trả thật, kể cả sau Hủy (P5), và luôn tắt khi job kết thúc theo mọi đường; lỗi runner không trả được cho người gọi (listener ném, bug của job sau Hủy) đi qua `reportError` mà app truyền vào, không nuốt im. REJECTED với trả lời rỗng lưu `EMPTY_RAW_OUTPUT` (`db` không nhận `raw_output` rỗng).

## Bản đồ export

Phần dưới do `pnpm codemap` sinh (`tools/codemap.mjs`), không sửa tay; `pnpm verify` báo đỏ khi lệch code.

<!-- codemap:start -->
- `src/adapter.ts` — type AiMessage, type AiCompleteRequest, type AiCompletion, type AiAdapter
- `src/blocklists.ts` — BLOCKLISTS
- `src/errors.ts` — AI_ERROR_CODES, type AiErrorCode, isAiErrorCode, AiError
- `src/extract-json.ts` — type ExtractedJson, extractJson
- `src/index.ts` — re-exports ./errors, ./models, ./adapter, ./extract-json, ./schema, ./mock-adapter, ./validator, ./input, ./run
- `src/input.ts` — KYC_CATEGORY_LABELS, KYC_FIELD_LABELS, type AnalysisFact, type AnalysisProfile, type AnalysisInputFact, type AnalysisInput, buildAnalysisInput, type ExtractionInput, buildExtractionInput
- `src/mock-adapter.ts` — createMockAdapter
- `src/models.ts` — type AiReasoningEffort, type AiModel, AI_MODELS, type AiModelId, DEFAULT_AI_MODEL
- `src/prompts/analysis.ts` — analysisPrompt
- `src/prompts/connection.ts` — connectionCheck
- `src/prompts/discovery.ts` — discoveryPrompt
- `src/prompts/extraction.ts` — extractionPrompt
- `src/prompts/retry.ts` — RETRY_TEMPLATE, retryMessage
- `src/run.ts` — type AiSettings, type AiAbortSignal, type AiRunner, createAiRunner, type AnalysisRequest, type AnalysisRow, type AnalysisResult, EMPTY_RAW_OUTPUT, runAnalysis, type ExtractionRequest, type ExtractionResult, runExtraction, type ConnectionResult, checkConnection
- `src/schema.ts` — AI_MODES, type AiMode, AI_PROVIDERS, type AiProvider, AI_REASONING_LEVELS, type AiReasoningLevel, FACT_CODE, factCode, PERSONALITY_SYSTEMS, analysisOutputSchema, discoveryOutputSchema, extractionOutputSchema, type AnalysisOutput, type DiscoveryOutput, type ExtractionOutput, AI_OUTPUT_SCHEMAS
- `src/test-support.ts` — TODAY, fact, PRIVATE, ANALYSIS_FACTS, PROFILE
- `src/text-match.ts` — type MatchText, type Matcher, fold, matchText, WORD_START, WORD_END, char, phrase, pattern
- `src/validator.ts` — VALIDATION_CODES, type ValidationCode, type ValidationIssue, type OutputCheckInput, validateOutput, EXTRACTION_FIELDS, type ExtractionCheckInput, type ExtractedFact, filterExtraction
<!-- codemap:end -->
