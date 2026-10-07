# packages/ai — AI copilot: schema, adapter, Mock

Phase 5 (`docs/design/phase-5-ai.md`, ADR-0009). Kiểu dữ liệu, mã lỗi `AiError`, zod schema output của 3 chế độ (`analysis` / `discovery` / `extraction`), giao diện adapter và adapter Mock. Validator, prompt, điều phối thử lại thêm ở các task sau (T-165, T-166).

## Ranh giới

- Chỉ phụ thuộc `@p2c/domain` + `zod` (rule `ai-only-on-domain-and-zod`, `pnpm lint:deps`); không import `db`, `ui`, `apps`, Tauri, `node:*`. Adapter OpenCode Go nhận hàm `invoke` được tiêm từ `apps/desktop`.
- Public API qua `src/index.ts` (`@p2c/ai`). Ngoại lệ duy nhất: `packages/db` import **đúng** `@p2c/ai/schema` (`src/schema.ts`) để kiểm `output_json` khi nhập backup (ADR-0006 phụ lục 07/10/2026). Vì vậy `src/schema.ts` chỉ import `zod` + `domain`, không import file khác của `ai` (rule `ai-schema-standalone`).
- Mỗi chế độ một schema, luôn bản mới nhất; đổi schema → nạp lại dữ liệu giả lập (R2-02), không giữ schema cũ.
- Coverage 100% (`vitest.config.ts`).

## File hay tìm

- Schema output + mã `F{seq}`: `src/schema.ts` (spec §6.2, gồm khối `personalityNotes` — P6). Kiểm field / value / quote của trích xuất là V7, không ở schema.
- Lấy khối JSON đầu tiên từ trả lời: `src/extract-json.ts` (spec §6.1).
- Mã lỗi: `src/errors.ts` (spec §5.3) · provider / model / reasoning: `src/models.ts` (spec §4).
- Adapter: `src/adapter.ts` (giao diện) · Mock: `src/mock-adapter.ts` (đọc message `user` đầu tiên theo mẫu G5 §1.1 / §4.1).

## Bản đồ export

Phần dưới do `pnpm codemap` sinh (`tools/codemap.mjs`), không sửa tay; `pnpm verify` báo đỏ khi lệch code.

<!-- codemap:start -->
- `src/adapter.ts` — type AiMessage, type AiCompleteRequest, type AiCompletion, type AiAdapter
- `src/errors.ts` — AI_ERROR_CODES, type AiErrorCode, isAiErrorCode, AiError
- `src/extract-json.ts` — type ExtractedJson, extractJson
- `src/index.ts` — re-exports ./errors, ./models, ./adapter, ./extract-json, ./schema, ./mock-adapter
- `src/mock-adapter.ts` — createMockAdapter
- `src/models.ts` — AI_PROVIDERS, type AiProvider, AI_REASONING_LEVELS, type AiReasoningLevel, type AiReasoningEffort, type AiModel, AI_MODELS, type AiModelId, DEFAULT_AI_MODEL
- `src/schema.ts` — AI_MODES, type AiMode, FACT_CODE, factCode, PERSONALITY_SYSTEMS, analysisOutputSchema, discoveryOutputSchema, extractionOutputSchema, type AnalysisOutput, type DiscoveryOutput, type ExtractionOutput, AI_OUTPUT_SCHEMAS
<!-- codemap:end -->
