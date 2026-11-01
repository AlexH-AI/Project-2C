# packages/ai — AI copilot: schema, adapter, Mock

Phase 5 (`docs/design/phase-5-ai.md`, ADR-0009): kiểu dữ liệu, mã lỗi, zod schema output của 3 chế độ, adapter (Mock), validator V1–V7, prompt có version, điều phối (cổng → prompt → gọi → kiểm → thử lại) và single-flight.

## Ranh giới

- Chỉ phụ thuộc `@p2c/domain` + `zod` (rule `ai-only-on-domain-and-zod`, `pnpm lint:deps`); không import `db`, `ui`, `apps`, Tauri, `node:*`. Adapter OpenCode Go nhận hàm `invoke` được tiêm từ `apps/desktop`.
- Public API qua `src/index.ts` (`@p2c/ai`). Ngoại lệ duy nhất: `packages/db` import **đúng** `@p2c/ai/schema` (`src/schema.ts`) để kiểm `output_json` khi nhập backup (ADR-0006 phụ lục 07/10/2026). Vì vậy `src/schema.ts` chỉ import `zod` + `domain`, không import file khác của `ai` (rule `ai-schema-standalone`).
- Mỗi chế độ một schema, luôn bản mới nhất; đổi schema → nạp lại dữ liệu giả lập (R2-02), không giữ schema cũ.
- Coverage 100% (`vitest.config.ts`).

## File hay tìm

- Schema output + mã `F{seq}`: `src/schema.ts` (spec §6.2, gồm khối `personalityNotes` — P6). Kiểm field / value / quote của trích xuất là V7, không ở schema.
- Schema đầu vào analysis / discovery (`analysisInputSchema`, spec §6.1; kiểu `AnalysisInput` suy từ nó) cũng ở `src/schema.ts`: `db` kiểm `input_json` bằng nó khi ghi và khi nhập backup (§7.3 luật 3, T-176), panel đọc `input` bằng `parse`.
- Lấy khối JSON đầu tiên từ trả lời: `src/extract-json.ts` (spec §6.1), một lượt; bị cắt → `CUT_ANSWER`. Đếm / cắt theo code point không cấp phát: `src/code-points.ts`.
- Cấu hình Settings → AI (`settings` khóa `ai`, spec §4.1): `src/settings.ts` — `readAiSettings` đọc / chuẩn hóa (hỏng → mặc định cả khối + lý do), không bao giờ có key.
- Mã lỗi: `src/errors.ts` (spec §5.3; mã chỉ `ai` sinh: `AI_TOO_LARGE`) · model: `src/models.ts` (spec §4; cờ `reasoningEffort` theo lần gọi thật 09/10/2026, T-179); danh sách provider / reasoning và hằng của `ai_analyses` nằm ở `src/schema.ts` để `db` dùng chung (T-163, T-288; `AI_ANALYSIS_PROVIDERS` = Settings + `CHATGPT_WEB`, spec §4.1). Dạng `prompt_version` (`<mode>@<n>`, thêm `+web@<n>` cho ChatGPT web) do `db` kiểm (`analysisLabelsFit`, T-192).
- Adapter: `src/adapter.ts` (giao diện) · Mock: `src/mock-adapter.ts` (message `user` đầu tiên, G5 §1.1 / §4.1; câu trả lời: `mock…Output` ở `schema.ts`).
- Validator (spec §6.4): `src/validator.ts` — `validateOutput` (V1 cả ba chế độ, `detail` nêu dạng đúng; V2–V6 analysis / discovery), `filterExtraction` (V7 bỏ riêng từng dữ kiện trích xuất). Danh sách chặn V3–V6 chép nguyên từ G5 §8: `src/blocklists.ts`; cách so khớp G5 §7 (bước 0, bản không dấu, danh sách đóng): `src/text-match.ts`. V1 (`schema.ts`, G5 §11.5): chuỗi gốc ≤ 1 000 ký tự; phần thấy được (`normalizeText`) 1–300, `text` analysis / discovery có chữ cái. Đổi danh sách = qua G5 lại.
- Prompt (G5 §2–§6, nguyên văn): `src/prompts/<mode>.ts` (mỗi file một `version`, `maxTokens`), message thử lại `src/prompts/retry.ts`, Kiểm tra kết nối `src/prompts/connection.ts`. `prompts.test.ts` so chữ với `docs/design/phase-5-prompts.md`; đổi một chữ = tăng version + qua G5.
- Dựng đầu vào (spec §6.1, G5 §1.1 / §4.1): analysis — `buildAnalysisInput` ở `src/schema.ts` (dữ kiện `active` / `conflict`, năm sinh thành tuổi); trích xuất — `src/input.ts`. Nhãn `KYC_*_LABELS`, `buildAnalysisInput`, câu Mock ở `schema.ts` cho seed `db` dùng chung (I-10); test i18n của app giữ nhãn khớp `vi.ts`.
- Điều phối (spec §3, §5.2, §8): `src/run.ts` — `runAnalysis` trả `row` cho `recordAiAnalysis` của `db` (app lưu, `ai` không import `db`), `runExtraction` trả đề xuất đã lọc V7, `checkConnection`. Mọi yêu cầu qua **một** `AiRunner` chung cả app (`createAiRunner`): `busy` tới khi adapter trả thật, kể cả sau Hủy (P5), luôn tắt khi job kết thúc; lỗi runner không trả được cho người gọi (listener ném, bug của job sau Hủy) đi qua `reportError` của app, không nuốt im. REJECTED với trả lời rỗng lưu `EMPTY_RAW_OUTPUT` (`db` không nhận `raw_output` rỗng). Vượt trần 200 000 ký tự → `AI_TOO_LARGE` trước Rust.
- Luật lần thử (tối đa 2, một lần thử lại kèm message G5 §5) và lấy JSON + kiểm một câu trả lời: `src/attempts.ts`; phần phân tích `run.ts` và `web.ts` cùng dùng (đầu vào, kiểm, `analysisOutcome`): `src/analysis-steps.ts`. Cả hai nội bộ, không qua `index.ts` (T-288).
- ChatGPT web (spec §3.1, P7): `src/web.ts` — `startWebAnalysis` (cổng → ảnh chụp đầu vào → tin nhắn `web@1`, chữ bọc G5 §6a nguyên văn trong `WEB_WRAPPER`), `checkWebAnswer` (dán rỗng, dán lại tin nhắn của app — dòng khung, dòng đầu / cuối của message thử lại, G5 §6a — hay quá `MAX_AI_RAW_OUTPUT` code point → không tính lần thử; lần 1 sai → lỗi + "Copy yêu cầu sửa"; xong → `row` `CHATGPT_WEB`, `prompt_version` `webPromptVersion`). Không gọi mạng, không qua adapter / `AiRunner`; phiên là giá trị panel giữ, không lưu.

## Bản đồ export

Phần dưới do `pnpm codemap` sinh (`tools/codemap.mjs`), không sửa tay; `pnpm verify` báo đỏ khi lệch code.

<!-- codemap:start -->
- `src/adapter.ts` — type AiMessage, type AiCompleteRequest, type AiCompletion, type AiAdapter
- `src/analysis-steps.ts` — type AnalysisSubject, subjectOf, ANALYSIS_PROMPTS, takeAnalysisInput, checkAnalysisAnswer, type AnalysisOutcome, analysisOutcome, EMPTY_RAW_OUTPUT, NO_MODEL
- `src/attempts.ts` — MAX_ATTEMPTS, type CheckedAnswer, checkAnswer, lastAnswer, nextRetry
- `src/blocklists.ts` — BLOCKLISTS
- `src/code-points.ts` — codePointCount, codePointsOver, cutCodePoints
- `src/errors.ts` — AI_ERROR_CODES, type AiErrorCode, type AiErrorDetails, type AiErrorResult, errorDetails, isAiErrorCode, AiError
- `src/extract-json.ts` — type ExtractedJson, type ExtractOptions, extractJson
- `src/index.ts` — re-exports ./errors, ./models, ./adapter, ./extract-json, ./schema, ./mock-adapter, ./validator, ./input, ./run, ./settings, ./web
- `src/input.ts` — type ExtractionInput, buildExtractionInput
- `src/mock-adapter.ts` — createMockAdapter
- `src/mock-extraction.ts` — mockExtractionOutput
- `src/models.ts` — type AiReasoningEffort, type AiModel, AI_MODELS, type AiModelId, DEFAULT_AI_MODEL
- `src/prompts/analysis.ts` — analysisPrompt
- `src/prompts/connection.ts` — connectionCheck
- `src/prompts/discovery.ts` — discoveryPrompt
- `src/prompts/extraction.ts` — extractionPrompt
- `src/prompts/retry.ts` — RETRY_TEMPLATE, retryMessage
- `src/run.ts` — type AiAbortSignal, type AiRunner, createAiRunner, type AnalysisRequest, type AnalysisRow, type AnalysisResult, runAnalysis, type ExtractionRequest, type ExtractionResult, runExtraction, type ConnectionResult, checkConnection
- `src/schema.ts` — AI_MODES, type AiMode, AI_PROVIDERS, type AiProvider, AI_ANALYSIS_PROVIDERS, type AiAnalysisProvider, AI_ANALYSIS_NO_MODEL, MAX_AI_RAW_OUTPUT, AI_REASONING_LEVELS, type AiReasoningLevel, FACT_CODE, factCode, analysisInputSchema, type AnalysisInput, PERSONALITY_SYSTEMS, analysisOutputSchema, discoveryOutputSchema, extractionOutputSchema, type AnalysisOutput, type DiscoveryOutput, type ExtractionOutput, AI_OUTPUT_SCHEMAS, KYC_CATEGORY_LABELS, KYC_FIELD_LABELS, type AnalysisFact, type AnalysisProfile, buildAnalysisInput, PROMPT_VERSIONS, mockAnalysisOutput, mockDiscoveryOutput
- `src/settings.ts` — AI_OPENCODE_PLANS, type AiOpencodePlan, type AiSettings, DEFAULT_AI_SETTINGS, type AiSettingsProblem, type StoredAiSettings, readAiSettings
- `src/test-support.ts` — ZWSP, NUL, nfdZw, lettersAround, TODAY, mockRequest, completeMock, fact, PRIVATE, ANALYSIS_FACTS, PROFILE
- `src/text-match.ts` — type MatchText, type Span, type Matcher, cleanText, matchText, WORD_START, WORD_END, char, phrase, pattern
- `src/validator.ts` — VALIDATION_CODES, type ValidationCode, type ValidationIssue, type OutputCheckInput, CUT_ANSWER, validateOutput, EXTRACTION_FIELDS, type ExtractionCheckInput, type ExtractedFact, filterExtraction
- `src/web.ts` — WEB_WRAPPER, webPromptVersion, buildWebMessage, type WebSession, type WebAnalysisRequest, type WebStart, startWebAnalysis, type WebAnswerResult, checkWebAnswer
<!-- codemap:end -->
