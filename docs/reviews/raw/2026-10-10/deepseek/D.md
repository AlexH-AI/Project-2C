# Deep review Phase 5 — Gói D (UI) — reviewer DeepSeek

- **Repo:** `C:\workspace\Project-2C-review`, detached ở SHA `0df3606fb783cc89b1b9c413c02810340e273a4f` (khớp `0df3606`).
- **git status đầu phiên:** `?? opencode.json` (chỉ còn file này).
- **Phạm vi gói D:** `apps/desktop/src/routes/customers/**` phần AI, `routes/appointments/**` khối AI, `routes/SettingsAi.tsx` + `settings-ai-view.ts`, `routes/Settings.tsx` (mục AI), `data/ai-analysis.ts` / `ai-jobs.ts` / `ai-tauri.ts`, `data/app-data.ts` (phần AI), `use-ai-job.ts`, i18n Phase 5, và phần Phase 1–4 mà gói nối vào (KYC, backup / thay DB, lịch hẹn).

## 1. Phạm vi đã đọc (file, dòng)

Tài liệu chuẩn (đọc đủ, trừ ghi chú):
- `CONTEXT.md` 1–46; `C:\workspace\deep-review-5\common\plan.md` 1–119, `baseline.md` 1–29, `known.md` 1–104.
- `docs/design/phase-5-ai.md` 1–430 (đủ); `docs/design/phase-5-prompts.md` 1–345 (đủ); `docs/golden/ai-eval.md` 1–119 (đủ); `docs/decisions/0009-ai-copilot-provider-va-guardrail.md` 1–82 (đủ).
- Mockup G3: `docs/design/mockups/ai.html` (các mục liên quan §1–§4: dòng ~300–970), `mockups/customer.html` 381–465, `mockups/appointments.html` 425–456.

Code trong gói (đọc đủ cả file, trừ ghi chú):
- `apps/desktop/src/routes/customers/KycIntelligence.tsx` 1–445, `KycWebSession.tsx` 1–172, `KycExtraction.tsx` 1–134, `KycHistory.tsx` 1–154, `CustomerKyc.tsx` 1–284, `CustomerProfile.tsx` 1–263, `KycDialogs.tsx` 1–490, `ai-panel-view.ts` 1–521, `extraction-view.ts` 1–83, `kyc-view.ts` 1–235, `use-ai-job.ts` 1–48 + test của chúng.
- `apps/desktop/src/routes/appointments/AppointmentAi.tsx` 1–81, `appointment-ai-view.ts` 1–41 + test; `AppointmentsScreen.tsx` (diff, 2 dòng).
- `apps/desktop/src/routes/SettingsAi.tsx` 1–357, `settings-ai-view.ts` 1–107 + test, `Settings.tsx` 1–164.
- `apps/desktop/src/data/ai-analysis.ts` 1–304 + test 1–677, `ai-jobs.ts` 1–76 + test 1–100, `ai-tauri.ts` 1–75 + test 1–102, `app-data.ts` 1–381, `AppDataContext.tsx` 1–52, `main.tsx` 1–43, `tauri-contract.test.ts` 1–195.
- `apps/desktop/src/i18n/index.ts` 1–132 và `vi.ts` (toàn bộ key Phase 5, dòng 121–385 + 522–524).
- Đối chiếu hợp đồng phía package: `packages/ai/src/run.ts` 1–394, `web.ts` 1–121, `input.ts` 1–132, `validator.ts` 1–228, `schema.ts` (38–160), `settings.ts` 1–86, `prompts/retry.ts` 1–51, `extract-json.ts` 1–36; `packages/db/src/ai-analyses.ts` 1–277, `schema.ts` 240–384 (CHECK của `ai_analyses`), `backup-validation.ts` 340–446, `backup.ts` (đoạn 71–201), `test-support.ts` 1–38, `backup-invariants.test.ts` 240–360.
- `apps/desktop/CLAUDE.md` 1–54 (package của gói D).

## 2. Phát hiện

### DS-D1
```
ID: DS-D1
Mức: Low
Trục: E (kèm C)
Vị trí: apps/desktop/src/routes/customers/KycIntelligence.tsx:255, 273–279, 337–346, 371–381 ·
        apps/desktop/src/routes/customers/KycExtraction.tsx:59 ·
        đối chiếu: apps/desktop/src/routes/SettingsAi.tsx:319–321 (0df3606)
Tình trạng: PLAUSIBLE (đọc code; phiên này không có môi trường DOM để chạy giao diện)
Mô tả: Trong lúc một yêu cầu AI đang chạy ở KH A, mở Hồ sơ KH B thì mọi nút AI của B tắt
       (đúng P5) nhưng panel B không nói vì sao: dòng "Đang phân tích…/Đang hủy…" gắn với
       job của từng KH nên chỉ hiện ở panel của KH đang chạy; bấm Hủy xong cũng vậy.
Tái hiện / bằng chứng: đường code — busy đọc từ runner dùng chung (KycIntelligence.tsx:255)
       → aiPanelView tắt nút khi busy (ai-panel-view.ts:86: `const enabled = !blocked && !busy && !webOpen;`)
       → dòng trạng thái keyed theo job (`shown = panelRun(analysis.phase, …)`, :280) nên KH B
       đang idle thì không có dòng nào. Nút AI trích xuất cũng chỉ `disabled={busy || …}`
       không kèm lời giải thích (KycExtraction.tsx:59). Cùng tình huống, Settings → AI có dòng
       giải thích (SettingsAi.tsx:319–321 hiện `aiError.AI_BUSY`). e2e hiện chỉ phủ rời/về
       CÙNG KH (e2e/customer-ai.spec.ts:179–213), không phủ đổi KH khi đang chạy.
Ảnh hưởng: RE đổi sang KH khác trong lúc chờ (tới ~2–4 phút với 2 lần thử, tối đa 120 s/lần)
       thấy nút tắt vô cớ, dễ tưởng app lỗi; không ảnh hưởng dữ liệu.
Đề xuất: khi `busy` và panel này không có job (`phase === 'idle'`, không phiên web) thì hiện một
       dòng nhỏ `aiError.AI_BUSY` (đã có sẵn trong `vi.ts`); NoteEvent làm tương tự (chú thích
       cạnh nút). Cỡ ước lượng: ≤ ~30 dòng SP.
```

### DS-D2
```
ID: DS-D2
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/routes/customers/KycIntelligence.tsx:322, 374–378 ·
        apps/desktop/src/data/ai-analysis.ts:179 · packages/ai/src/run.ts:156–158 (0df3606)
Tình trạng: PLAUSIBLE (đọc code; đối chiếu run.ts/ai-analysis.ts)
Mô tả: Dòng "Đang phân tích… · <model>" lấy model từ settings HIỆN TẠI mỗi lần render, không
       phải settings đã chụp lúc bấm. Đổi model/gói ở Cài đặt → AI trong lúc chờ (Settings
       cho đổi: các ô chỉ khóa nút Kiểm tra kết nối, SettingsAi.tsx:311) rồi quay lại → nhãn
       có thể sai model; đổi provider sang Mock thì phần chi tiết biến mất dù đang chạy OpenCode.
Tái hiện / bằng chứng: lời gọi chụp settings tại lúc bấm (`runAnalysis({ ...app.ai.call(), … })`,
       ai-analysis.ts:179; `completeRequest` dùng `call.settings`, run.ts:156–158) trong khi
       panel đọc `const settings = app.ai.settings()` mỗi render (KycIntelligence.tsx:322) và
       hiện tên model từ đó (:374–378).
Ảnh hưởng: chỉ sai nhãn trên màn hình lúc chờ; không ảnh hưởng dữ liệu hay request.
Đề xuất: giữ lại `AiSettings` lúc bấm cho dòng trạng thái (như `AiCall`), hoặc truyền model đã
       dùng vào job. Cỡ ước lượng: ≤ ~20 dòng SP.
```

## 3. Bảng đếm mức × trục

| Mức \ Trục | E | G | C | D | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Nit | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| **Tổng** | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | **2** |

## 4. Đã xét, không thấy (theo trục §4)

- **E — Edge case:** đọc từng nhánh và đối chiếu test: khách chưa có phiên bản KYC → nút tắt, không gọi AI (`ai-analysis.test.ts` "is blocked for a customer with no KYC version yet" xanh); cổng đổi giữa chừng → `blocked` (panel đọc lại cổng, `runAfter`); KYC đổi trong lúc chạy → kết quả gắn phiên bản cũ, STALE ngay (test "ties the result to the version taken on click"); xóa KH / Nạp lại / nhập backup trong lúc chạy → `discarded`, không lưu, không báo bug (2 test + `runAfter`); Hủy → `cancelled`, nút khóa tới khi adapter trả (test + `ai-jobs.test.ts`); hai yêu cầu chồng → `AI_BUSY` chốt thứ hai (test); dán rỗng / > 20 000 ký tự → không tính lần thử (test `ai-analysis.test.ts:496–505`); Unicode: đếm ký tự theo code point (`extractionButton`, test 😀), `F{seq}` thuần ASCII; ngày: `dayAndTime`/`webChip` chỉ định dạng; phiên bản KYC đang thiếu khi render → `versionNumber` ném RangeError nhưng đã **kiểm chứng không lọt được vào DB**: dựng backup có `ai_analyses.kyc_version_id` trỏ tới dòng `kyc_versions` bị xóa → `importBackup` từ chối `BACKUP_INVALID` qua `PRAGMA foreign_key_check` (`packages/db/src/backup.ts:160`; probe ở phụ lục, kết quả `REFUSED: DbError: BACKUP_INVALID`) và `recordAiAnalysis` tự kiểm phiên bản. Hai điểm còn lại nêu ở DS-D1/DS-D2.
- **G — Guardrail AI:** trong phạm vi UI, kiểm bằng đọc + test: cổng chặn (CONFLICT_RESOLUTION / KYC_INSUFFICIENT) tắt cả hai nút và không gọi adapter (P2, test + e2e `customer-ai.spec.ts`); dòng REJECTED không bao giờ hiện như kết quả (`shown` chỉ lấy ACCEPTED; dialog REJECTED chỉ hiện báo cáo validator); mức bằng chứng tính lại từ `input_json` đã lưu bằng `evidenceLevel` (test `analysisContent` khớp B01–B11 ở tầng hiển thị, không tự chế số); `personalityNotes` tách khối "Thông tin tham khảo" (test); đề xuất trích xuất không ghi DB (`extractFromNote` không đụng `app.run`, test so `revision` không đổi; chỉ `Xác nhận` mở hộp 3f và đi qua lệnh KYC hiện có). Validator/luật V1–V7 thuộc gói A/B — không đánh giá lại ở đây.
- **C — Đúng hợp đồng:** so từng nhãn/trạng thái với §9.1–9.3 và mockup 2a–2l, 3b–3f, 4d–4i: badge/chip "kyc v… · prompt · model hoặc Mock/ChatGPT web · dd/mm hh:mm", câu chặn 2b/2c, "Đang phân tích…/Đang hủy…", banner "Đang xem lần…", bảng lịch sử 5 cột, hộp 2k, phiên web 4e–4h, khối lịch hẹn §9.2, Settings §9.3 — khớp; thứ tự nút ChatGPT web trước nút chính đúng ghi chú mockup 4d `ai.html:966`. `settings-ai-view.ts` khớp §4.1–4.3 (512 ký tự, gói GO/CREDIT, reasoning theo model). Điểm lệch duy nhất thấy được là DS-D2; các mục `known.md` #444 (1g, kết quả kiểm giữ sau khi đổi, dòng ChatGPT web thiếu in đậm) và #438 (`dayAndTime` tách chuỗi — nay ở `ai-panel-view.ts:518–520`, dòng cũ 509 chỉ do code dịch) vẫn đúng, không có bằng chứng mới.
- **D — Dữ liệu:** UI chỉ ghi qua lệnh db trong `app.run` (`recordAiAnalysis`, `confirmKycFact`/`markKycConflict`); lưu hỏng/khách biến mất → `discarded`/`failed` không ghi nửa vời; `save` của Settings chỉ ghi 4 trường, không có key (test "saves only the four fields…"); `input_json`/`output_json`/`validator_json` do package sinh, db CHECK + luật nhập phủ; seed Mock hiện trên màn (e2e lịch sử). Không thấy mất/sai dữ liệu mới.
- **S — An toàn:** `grep dangerouslySetInnerHTML|innerHTML` toàn `apps/desktop/src` → 0; mọi chuỗi model/ghi chú/đề xuất render dạng text (kể cả `note.text` trong `whitespace-pre-line`); chỉ một URL ngoài, hằng `CHATGPT_URL` (`ai-analysis.ts:67`), mở bằng Rust hoặc `window.open(url,'_blank','noopener')` (test), không nhét dữ kiện vào URL; tin nhắn copy = prompt + JSON đầu vào theo `input.ts` (không tên/mã KH/ghi chú — có test "sends the note as written" cho nhánh trích xuất và `buildAnalysisInput` chỉ facts); câu trả lời dán chỉ qua textarea rồi validator; thông báo lỗi không chứa key (Rust cắt 200 ký tự — gói C, UI không in gì thêm); ô key chỉ ghi, không hiện lại (mockup 1d, không có password mask nhưng mockup cũng vậy); copy lỗi dạng promise rejection → ô chỉ đọc đúng §3.1 điểm 2 (e2e `failCopy`, `customer-ai-web.spec.ts:167–185`); copy "hỏng" (ném đồng bộ) → lỗi bug + Thử lại là chủ ý, đã có e2e `breakCopy` (`customer-ai-web.spec.ts:200–213`). Đã xét, không thấy mục mới.
- **P — Hiệu năng:** có số đo (phụ lục, `bench.test.ts`): 2 000 dòng lịch sử → `historyRows` ~1,3 ms/lần; `analysisContent` (20 facts, 30 phần tử) ~0,09 ms/lần; `aiPanelView` trên 2 000 dòng ~0,01 ms/lần — đều không đáng kể. Phần render DOM của bảng lịch sử (không phân trang) chưa đo được trong phiên này (Vitest không có DOM; e2e thuộc gói E); với dữ liệu thật vài chục dòng thì không thấy vấn đề, nên không nêu phát hiện.
- **B — Bloat:** rà export các file gói D (`rg` + đọc): `Item`/`ITEMS`/`BusyLine`/`BADGE_COLORS` dùng chung với `AppointmentAi`; `historyRows`/`issueText`/`sourceName` đều có nơi dùng; không thấy export runtime chết trong phạm vi gói. Các mục trùng lặp đã ghi `known.md` (#469 `AiJobStatus`, #465 `comparable`, …) giữ nguyên, không có bằng chứng mới.
- **T — Chất lượng test:** chạy 8 file test gói D (155 test xanh) + `tauri-contract.test.ts` cùng `kyc-view.test.ts` (23 test xanh). Đã phá code trên bản chép (5 mutation — xem phụ lục): cả 5 bị test bắt đỏ đúng chỗ. Điểm yếu đã biết: không có test component (không có DOM — `known.md` #240, e2e phủ), e2e chưa phủ "đổi KH khi đang chạy" (gắn DS-D1). Không thấy test giả xanh trong phạm vi đã thử.
- **A — Trợ năng / i18n:** không thấy chuỗi cứng tiếng Việt trong `routes/**/*.tsx` (grep) trừ dấu `:` trong JSX của `KycExtraction.tsx:96` (đã ghi `known.md`); mọi key có trong `vi.ts` và typed; `role="status"` cho dòng đang chạy/trích xuất, `role="alert"` cho lỗi, bảng có `aria-label` + cột trạng thái `sr-only`, hàng lịch sử có nút bấm bằng bàn phím + `aria-current`, hộp thoại focus qua `Dialog` (`data-autofocus`, trả focus — `packages/ui/src/components/Dialog.tsx:17–41`), ô dán chỉ-đọc có `aria-label`. Đã xét, không thấy mục mới.

## 5. Phụ lục — nguồn test tạm và kết quả (đều nằm ngoài repo)

Thư mục `C:\workspace\deep-review-5\deepseek\D\mut\` (không sửa file nào trong repo; có 1 junction `node_modules` → `C:\workspace\Project-2C-review\apps\desktop\node_modules` chỉ để đọc):
- Bản chép để chạy: `extraction-view.ts/.test.ts`, `ai-panel-view.ts/.test.ts` (+ `ai-analysis.ts/.test.ts`, `ai-jobs.ts`, `app-data.ts`, `persist-queue.ts`, `tables.ts` cho mutation tầng app), config `vitest.mut.config.mjs` (alias `@p2c/*`, `vitest`, `@dbsupport`).
- `import-hole.test.ts` — dựng DB nhỏ, ghi 1 phân tích Mock, xuất backup, xóa dòng `kyc_versions` được trỏ tới rồi `importBackup`. Kết quả thật: `REFUSED: DbError: BACKUP_INVALID` ⇒ không lọt dòng treo (nhờ `PRAGMA foreign_key_check`, `packages/db/src/backup.ts:160`).
- `clipboard.test.ts` — `navigator = {}` và `writeText` ném đồng bộ: `web.copy` **ném đồng bộ** (không trả `false`) ⇒ khi đó Start web đi nhánh `failed`/GENERAL. Đối chiếu e2e `customer-ai-web.spec.ts:28–33, 200–213`: đây là chủ ý ("a bug of the app"), nên không nêu phát hiện.
- `bench.test.ts` + `bench.out.txt` — số đo trục P:
  - `historyRows x25 over 2000 rows: 33.1 ms` (~1,3 ms/lần)
  - `analysisContent x250 (20 facts, 30 items): 21.9 ms` (~0,09 ms/lần)
  - `aiPanelView x250 over 2000 rows: 2.3 ms` (~0,01 ms/lần)
- Mutation (sửa trên bản chép rồi chạy `node node_modules\vitest\vitest.mjs run --config vitest.mut.config.mjs`):
  1. `extraction-view.ts` `held`: `status !== 'superseded'` → `status === 'active'` → đỏ test "hides a proposal a fact in effect…".
  2. `extraction-view.ts` `extractionButton`: bỏ nhánh `SYSTEM` → đỏ test "has no button on a SYSTEM note".
  3. `ai-panel-view.ts` `rejected`: bỏ `!blocked` → đỏ test "says no REJECTED line under a blocked gate, as no reminder (review of PR 459)" (1/44 đỏ).
  4. `ai-panel-view.ts` `runAfter('failed')` → `IDLE` → đỏ 2 test ("shows the general message for a bug or a bad request"; 2/56 đỏ).
  5. `ai-analysis.ts` `save`: trả `status:'ACCEPTED'` thay vì `saved.status` → đỏ 2 test ("saves a REJECTED row…", "saves REJECTED with the last paste…").
- Lệnh chạy test thật trong repo (không coverage): `pnpm exec vitest run` 8 file gói D → `Test Files 8 passed, Tests 155 passed`; thêm `tauri-contract.test.ts` + `kyc-view.test.ts` → `23 passed`.

`git status --short` cuối phiên:

```
?? opencode.json
```

Xong gói D — chỉ báo cáo này, không tổng hợp, không so bên khác, không tạo Issue.
