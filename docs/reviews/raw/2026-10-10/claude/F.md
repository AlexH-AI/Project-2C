# Deep review Phase 5 — gói F (xuyên gói) — Claude

- **SHA:** `0df3606fb783cc89b1b9c413c02810340e273a4f` (kiểm `git rev-parse HEAD` trong `C:\workspace\Project-2C-review` đầu và cuối phiên: khớp).
- **Phiên:** Claude Opus 5.5, phiên sạch, 10/10/2026, không subagent. Không mở / đọc / liệt kê `deep-review-5\codex\`. Đã đọc `common\` (plan, baseline, known) và báo cáo Claude gói A–E; mục đã báo ở gói trước chỉ dẫn ID.
- **Không gọi AI thật:** probe chạy bằng Node 24 trên mã nguồn (hook resolve của gói B), adapter giả và bản build web của worktree (Playwright, Edge, ngày ghim 15/09/2026, clipboard / `window.open` bị thay trong trang). Không chạy `pnpm eval:ai`, không đụng key / Credential Manager, không mở chatgpt.com.
- **Worktree:** không sửa file nào trong repo, không commit. Probe ở `C:\workspace\deep-review-5\claude\F\`; junction `node_modules` dựng cho Playwright đã gỡ cuối phiên (`rmdir`, chỉ gỡ liên kết); `apps/desktop/dist/` do build sinh lại (bị ignore). `git status --short` cuối phiên: **sạch**.

## 1. Phạm vi đã đọc

| File / tài liệu (0df3606) | Dòng | Cách đọc |
|---|---|---|
| `apps/desktop/src/data/ai-analysis.ts` | 1–304 (hết) | đọc từng dòng: đường đi phân tích / trích xuất / ChatGPT web từ cú bấm tới dòng lưu |
| `apps/desktop/src/data/app-data.ts` | 185–380 + diff Phase 5 | `replace`, `reloadDemoData`, `importBackup`, nơi giữ Cài đặt → AI; probe F2 |
| `apps/desktop/src/data/ai-tauri.ts`, `tauri-contract.test.ts` | hết | hợp đồng JS ↔ Rust (tên lệnh, tham số, mã lỗi) |
| `apps/desktop/src/main.tsx`, `routes/Settings.tsx` | diff Phase 5 | |
| `packages/ai/src/run.ts`, `web.ts`, `errors.ts`, `schema.ts` (1–80), `input.ts` (100–132), `validator.ts` (105–107), `prompts/analysis.ts`, `prompts/discovery.ts` (khối ví dụ JSON) | hết / phần nêu | đường đi `converse` → `analysisOutcome` → `row`; khối JSON đầu tiên của tin nhắn `web@1` |
| `packages/db/src/ai-analyses.ts` | 1–277 (hết) | `toRow`, CURRENT / STALE |
| `packages/db/src/backup-validation.ts` | 340–446 (luật 10–14) | |
| `packages/db/src/schema.ts` | 290–404 | |
| `packages/db/src/settings.ts`, `kyc.ts` (diff Phase 5), `common.ts` (`cleanText`) | hết / diff | hồi quy `normalizeKycValue` chuyển sang `domain` |
| `packages/domain/src/kyc-fact.ts` | 20–57 | so với bản cũ `db/kyc.ts@3e84ce8` |
| `packages/ui/src/components/TextField.tsx`, `SelectField.tsx` | diff Phase 5 | hồi quy form Phase 1–4 (chỉ thêm prop tùy chọn) |
| `apps/desktop/src/routes/customers/ai-panel-view.ts` | 1–521 (hết) | đọc lại với góc nhìn hợp đồng db ↔ UI |
| `apps/desktop/src/routes/customers/kyc-view.ts` (1–110), `CustomerKyc.tsx` (40–140), `KycIntelligence.tsx` (280–300, 410–420), `KycDialogs.tsx` (dòng có `hasProtection`) | phần nêu | link bằng chứng → dữ kiện |
| `apps/desktop/src/routes/appointments/AppointmentAi.tsx`, `appointment-ai-view.ts` | hết | khối AI ở chi tiết lịch hẹn |
| `apps/desktop/src-tauri/src/ai.rs` (196–232), `lib.rs` (130–205) | phần nêu | `reply`, lệnh AI |
| `apps/desktop/src/i18n/vi.ts` | `aiError.*`, `settings.demo.*`, `settingsAi.sent*` | |
| `e2e/support.ts` (142–173), `e2e/serve.mjs`, `apps/desktop/src/data/demo-snapshot.ts` | hết | để dựng probe e2e trên seed |
| Spec: `docs/design/phase-5-ai.md` §1–§6.3; `docs/design/phase-5-prompts.md` dòng 20, 195, 212; `docs/reviews/*tong-hop.md` (cách kết luận G7 các đợt trước) | | |
| `git diff --stat 3e84ce8..0df3606` (130 file ngoài `docs/`) | | để chọn chỗ nối Phase 1–4 |

## 2. Đường đi đầu-cuối và hợp đồng giữa các gói

### 2.1 Ba đường đi đã lần

| Đường | Chuỗi gọi (đã đọc từng bước) | Kết quả kiểm |
|---|---|---|
| **Phân tích (OpenCode / Mock)** | `KycIntelligence` → `AiJobs.start` → `analyseCustomer` → `takeProfile` (`getKycProfile` + `listKycVersions().at(-1)`, đọc cùng lúc, đồng bộ) → `runAnalysis` → `takeAnalysisInput` (`evaluateKycGate` → `buildAnalysisInput`) → `AiRunner.run` → `converse` → `adapter.complete` → (exe) `tauriOpenCode.adapter` → `invoke('ai_complete')` → Rust `check` / `Busy` / `read_key` / `post` / `reply` → `Completion` → `checkAnalysisAnswer` (`extractJson`, V1–V6) → `nextRetry` → `analysisOutcome` → `app.run(recordAiAnalysis)` → `changed()` → `listAiAnalyses` → `aiPanelView` / `analysisContent` | Hợp đồng khớp ở mọi bước, trừ chỗ ở **CL-F1** (ví dụ trong prompt đạt validator) và các mục A–E ở §4 |
| **AI trích xuất** | `KycExtraction` → `use-ai-job` → `extractFromNote` → `runExtraction` (V1, rồi `filterExtraction` V7 với `normalizeKycValue` của `domain`) → đề xuất trong state của `NoteEvent` → `ConfirmFactDialog` → `confirmKycFact` / `markKycConflict` (chỉ khi RE bấm) | AI không ghi DB: xác nhận lại bằng `rg confirmKycFact\|markKycConflict` trong `apps/desktop/src` (chỉ các hộp thoại có nút của RE). `normalizeKycValue` của `db` = `cleanText` (chặn NUL) + bản `domain`, tương đương bản Phase 4 (so dòng–dòng với `db/kyc.ts@3e84ce8:373–392`) |
| **ChatGPT web** | `startChatGptWeb` → `takeProfile` → `startWebAnalysis` → `web.copy` (clipboard) → `web.openChatGpt` (exe: `open_chatgpt` không tham số; web: `window.open(CHATGPT_URL, '_blank', 'noopener')`) → RE dán → `saveChatGptAnswer` → `checkWebAnswer` (cùng `checkAnalysisAnswer` / `nextRetry` / `analysisOutcome`) → `recordAiAnalysis` | Đúng §3.1, trừ **CL-F1** (dán lại chính tin nhắn của app thành ACCEPTED). Phiên web nằm trong state của panel: đi sang Cài đặt (để Nạp lại / Nhập) là rời Hồ sơ KH, phiên mất, nên không có ca "lưu phiên cũ vào DB mới" |

### 2.2 Hợp đồng giữa `ai` ↔ `db` ↔ UI ↔ Rust

| Hợp đồng | Hai (ba) phía | Kết quả |
|---|---|---|
| Mã lỗi | Rust `ai.rs` (10 mã + `AI_OPEN_BROWSER`) · `AI_ERROR_CODES` · `vi.ts aiError.*` | khớp 1–1 (đếm bằng `grep`); `tauri-contract.test.ts:180–194` giữ khớp. Chữ hiện: CL-C2, CL-D1, CL-D6 |
| Tên lệnh / tham số | `lib.rs` ↔ `ai-tauri.ts` | có test so (`tauri-contract.test.ts:158–179`, xem ghi chú §5 về CL-C4) |
| Kiểu `Completion` | Rust `{content, promptTokens, completionTokens}` → `as AiCompletion` (không kiểm lúc chạy) | đúng hình; token thiếu `usage` thành `0` → **CL-F3** |
| `AnalysisRow` → `NewAiAnalysis` | `ai/run.ts:225`, `ai/web.ts:109` → `db/ai-analyses.ts:30` | khớp kiểu; `reasoning` `DEFAULT` hợp lệ cả hai phía; model / token `null` cho Mock / web ở cả hai (lặp danh sách: KNOWN #455) |
| Đầu vào lưu → đọc lại | `JSON.stringify` → `input_json` → `analysisInputSchema.parse` ở panel | khớp; đầu ra ACCEPTED: lệnh không kiểm schema (CL-B1) |
| Giới hạn độ dài | Rust 200 000 ký tự / `max_tokens` ≤ 16 000 / thân 2 MB · `ai` 8 000 / 4 000 / 64 token, 20 000 ký tự dán · `db` 20 000 ký tự `raw_output` | đếm theo code point ở JS, khớp `length()` của SQLite (B); ghi chú không trần (CL-A9); message thử lại phình (CL-A8); thân nén (CL-C1); `max_tokens` 64 hẹp (CL-C3) |
| `sessionId` | `ai` 32 hex · Rust `[A-Za-z0-9-]{1,64}` | khớp |
| Ngày | `analysisDate` = `app.today()` lúc bấm · `ai_analyses.date` = `today(db)` lúc lưu | cùng nguồn ngày (app ghim ngày cho DB); qua nửa đêm giữa hai lúc thì `date` lớn hơn `analysisDate` một ngày, mức bằng chứng tính theo `analysisDate` (đúng §6.3, không phải lỗi) |
| Ảnh chụp phiên bản KYC | `takeProfile` lấy phiên bản mới nhất · `listAiAnalyses` CURRENT theo id phiên bản · panel link bằng chứng theo trạng thái dữ kiện | lệch khi xác nhận lại cùng giá trị: **CL-B2**, bằng chứng mới ở §4 |

### 2.3 Key và dữ liệu KH đi đâu

- **API key:** ô nhập ở `SettingsAi` (state React, hiện rõ: CL-D2) → `OpenCodeClient.setKey` → `invoke('ai_key_set')` → Rust `clean_key` → Credential Manager (kiểu bền Enterprise: CL-C5) → chỉ đọc trong `ai_complete` → header `Authorization` → lỗi đã che key (mã phiên không che: CL-C7, CL-E7). **Không** vào DB: `AppAi.save` chỉ ghi 4 trường (`ai-analysis.ts:123`), backup là DB; **không** vào log: không logger Rust, JS chỉ `console.error(AiError)` mà `AiError.message` = mã lỗi (đã `rg console\.|println|log::` trên mọi đường AI: một chỗ duy nhất `ai-analysis.ts:108`); e2e giữ key giả trong IPC giả.
- **Dữ liệu KH, phân tích:** dữ kiện còn hiệu lực (nhãn, giá trị, ngày xác nhận, cờ mâu thuẫn), tuổi, cổng → Rust → hai URL hằng opencode.ai. Giá trị dữ kiện là chữ tự do (A đã ghi, theo spec §6.1).
- **Trích xuất:** nguyên văn một ghi chú → OpenCode (spec §6.1, Settings ghi rõ); đề xuất không lưu.
- **ChatGPT web:** tin nhắn (prompt + đầu vào JSON) vào clipboard Windows rồi người dùng tự dán vào chatgpt.com. App không xóa clipboard sau phiên; nếu máy bật "Clipboard history / đồng bộ giữa thiết bị" thì bản sao nằm ngoài app — hệ quả của thiết kế W-1 đã duyệt, không ghi thành phát hiện.
- **Lưu lại:** `ai_analyses.input_json` / `output_json` / `raw_output` → file DB → `backups\` và `.p2cbackup`. Bảng chỉ thêm (trigger chặn UPDATE / DELETE): một lần dán sai thứ hai của ChatGPT web lưu nguyên `raw_output` (§3.1 điểm 7) và không có cách xóa — theo spec, ghi để Owner biết (liên quan CL-F1).
- **Eval:** chỉ fixture giả lập → file `docs/metrics` commit lên repo public (CL-E2, CL-E7).

## 3. Phát hiện

### CL-F1 — Ví dụ JSON trong prompt G5 đạt mọi validator: dán lại chính tin nhắn ChatGPT web (hoặc model chép lại ví dụ) lưu thành phân tích CURRENT toàn "…"

```
ID: CL-F1
Mức: Medium
Trục: G
Vị trí: packages/ai/src/prompts/analysis.ts:39–47, prompts/discovery.ts:37–42 (khối ví dụ, G5 nguyên văn);
        packages/ai/src/web.ts:38–45 (tin nhắn web@1 đặt prompt trước đầu vào), :98–121 (checkWebAnswer);
        packages/ai/src/extract-json.ts (khối JSON đầu tiên); packages/ai/src/schema.ts (text 1–300 ký tự sau trim);
        apps/desktop/src/data/ai-analysis.ts:272 (tin nhắn vẫn nằm trong clipboard), :293–304
Tình trạng: CONFIRMED (Node trên seed demo + e2e trên bản build web, ảnh chụp)
```

- **Mô tả:** khối JSON **đầu tiên** của tin nhắn `web@1` là ví dụ định dạng output trong prompt G5: mọi `text` là `"…"`, `evidence` là mã thật dạng `F12`, `F10`, `F13`, `F9`, `F3`, `missingCategory` `RISK_APPETITE` (analysis) / `ASSETS` (discovery). `"…"` dài 1 ký tự nên qua schema (1–300 ký tự sau trim); V3–V6 không có gì để chặn; V2 đạt khi KH có đủ các mã đó (mã `F{seq}` tăng dần theo KH, KH có ≥ 13 dữ kiện là thường). Hai đường dẫn tới đây:
  1. **ChatGPT web:** app vừa copy tin nhắn vào clipboard; RE quay lại app và nhấn Ctrl+V vào "Dán kết quả" trước khi copy câu trả lời (hoặc bấm copy nhầm tin nhắn của chính mình trên chatgpt.com) → "Kiểm tra và lưu" → **ACCEPTED, lần thử 1**.
  2. **OpenCode:** model trả lời bằng cách chép lại ví dụ định dạng (kiểu hỏng có thật ở model yếu / bị cắt) → cùng kết quả.
- **Tái hiện:**
  - `node F\probe-paste-own-seed.mjs` (seed demo của app, `seed: 1`, neo 15/09/2026 — đúng dữ liệu e2e): với mọi KH cổng cho qua, dán lại chính tin nhắn: **39 / 767 ACCEPTED ngay lần 1** (analysis **38 / 270 ≈ 14 %**, discovery 1 / 497). 728 KH còn lại: lần 1 báo V2 "F12 không có trong đầu vào"…, dán lại lần nữa → **REJECTED** (hết phiên, `raw_output` = cả tin nhắn).
  - `node F\probe-echo-example.mjs`: adapter giả trả lại `system` prompt qua `runAnalysis` (provider `OPENCODE_GO`): **39 / 767 ACCEPTED** lần 1; panel đọc lại: badge `CURRENT`, chip "DeepSeek V4.1 Flash", mọi phần tử `"…"` kèm mức bằng chứng `LOW` / `MEDIUM`.
  - e2e `F\probe-paste-e2e.spec.ts` (bản build web, Mock không dính vào): mở "Bùi Thanh Hùng", bấm "Phân tích bằng ChatGPT web", dán đúng chuỗi app vừa copy (6 143 ký tự), "Kiểm tra và lưu" → panel: `CURRENT · ChatGPT web · kyc v13 · analysis@1+web@1`, "Behavioral Hypotheses … Bằng chứng: F12 · Mức bằng chứng: thấp · 1 dữ kiện, mới nhất 01/01/2026", tương tự ở Needs / Pain points / Themes / Discovery / Next Best Actions (ảnh `F\F-E1-Bùi-Thanh-Hùng.png`). Cùng kết quả với "Hồ Thanh Hạnh". 2 / 2 xanh.
- **Ảnh hưởng:**
  - Một phân tích rỗng nghĩa trở thành kết quả CURRENT của KH, có nhãn mức bằng chứng như thật, hiện cả ở khối AI của chi tiết lịch hẹn (`appointmentAiView` lấy ACCEPTED mới nhất), và đẩy phân tích thật trước đó thành STALE.
  - `ai_analyses` chỉ thêm: không xóa được, chỉ che được bằng một lần phân tích mới (tốn thêm một lượt ChatGPT / token).
  - Ở 728 KH còn lại, lỗi V2 nói về mã dữ kiện thay vì "đây là tin nhắn của app", người dùng dễ dán lại lần nữa và mất phiên thành REJECTED.
  - Không hỏng dữ liệu KYC, không lộ gì. Code làm đúng chữ G5 / G2, nên đây là lỗ của guardrail, không phải code chép sai.
- **Đề xuất (Owner quyết, chạm G5 / §3.1):**
  - (a) Không cần G5: `checkWebAnswer` coi câu dán chứa dấu khung `=== HƯỚNG DẪN ===` / `=== ĐẦU VÀO ===` (hoặc trùng `message`) là `unusable` (không tính lần thử, báo "Đây là tin nhắn của app — copy câu trả lời của ChatGPT"). Thêm một dòng vào spec §3.1 điểm 3. Cỡ ~15 dòng SP + i18n + 2 test.
  - (b) Qua G5 / G2: V1 đòi `text` có ít nhất một chữ cái (`\p{L}`), chặn được cả đường OpenCode và gộp được với CL-A7 (chuỗi chỉ có ký tự vô hình). Hoặc đổi mã trong ví dụ thành mã không bao giờ có trong đầu vào (vd. `F0`, `FACT_CODE` đã cấm số 0 đầu). Cỡ ~10 dòng + ca kiểm G5 §8.5.
  - Nên làm cả (a) và (b).

### CL-F2 — "Nạp lại dữ liệu giả lập" đưa Cài đặt → AI về Mock mà không báo

```
ID: CL-F2
Mức: Low
Trục: C
Vị trí: apps/desktop/src/data/app-data.ts:374–377 (Cài đặt → AI đọc / ghi bảng `settings` của DB đang mở), :335–341 (reloadDemoData thay cả DB),
        packages/db/src/seed.ts (không ghi `settings`); docs/design/phase-5-ai.md §4.1 (không nói gì về Nạp lại); vi.ts `settings.demo.confirmBody`
Tình trạng: CONFIRMED
```

- **Mô tả:** spec §4.1 đặt cấu hình AI trong bảng `settings` khóa `ai` để nó đi theo backup. Hệ quả mà spec không nói: "Nạp lại" dựng một DB seed mới, không có dòng `ai`, nên provider / gói / model / mức suy luận về mặc định (Mock, Go, DeepSeek Flash, DEFAULT). `problem` = `null` nên dòng cảnh báo 1g cũng không hiện. Hộp xác nhận 10c chỉ nói "Toàn bộ dữ liệu hiện tại được thay…".
- **Tái hiện** (`node F\probe-reload-settings.mjs`, `openAppData` với client OpenCode giả như exe):

  ```
  after save:      stored {"provider":"OPENCODE_GO","opencodePlan":"CREDIT","model":"kimi-k3","reasoning":"HIGH"} · next request provider OPENCODE_GO
  after Nạp lại:   stored {"provider":"MOCK","opencodePlan":"GO","model":"deepseek-v4.1-flash","reasoning":"DEFAULT"} problem null · next request provider MOCK
  after Nhập backup: stored {"provider":"OPENCODE_GO","opencodePlan":"CREDIT",…}   (đúng §4.1)
  ```
- **Ảnh hưởng:** Owner nạp lại dữ liệu giả lập thường xuyên (quy tắc R2-02, mỗi lần đổi schema). Sau đó "Phân tích" lặng lẽ chạy Mock: chip "Mock" có hiện nên không lẫn với phân tích thật, nhưng phải vào Cài đặt chọn lại. Key không mất vì nằm ở Rust. Không tốn tiền nhầm (về Mock, không về gói khác).
- **Đề xuất (Owner chọn):** (a) `reloadDemoData` chép dòng `settings.ai` của DB cũ sang DB seed mới (~5 dòng + 1 test); hoặc (b) giữ hành vi, ghi vào spec §4.1 và thêm "Cài đặt → AI cũng về mặc định" vào hộp 10c (i18n).

### CL-F3 — Rust ghi 0 token khi OpenCode không trả `usage`

```
ID: CL-F3
Mức: Nit
Trục: C
Vị trí: apps/desktop/src-tauri/src/ai.rs:225 (`as_u64().unwrap_or(0)`); packages/ai/src/run.ts:322–323 (cộng hai lần thử);
        apps/desktop/src/routes/customers/ai-panel-view.ts:496–497 (hộp 2k hiện tổng token)
Tình trạng: CONFIRMED (đọc code; chưa biết OpenCode có lúc nào bỏ `usage` không)
```

- **Mô tả:** thiếu `usage` hay `usage.prompt_tokens` thì Rust trả `0`, `db` lưu `0`, hộp REJECTED 2k hiện "0 token". Spec §7.1 dùng `null` cho "không có số token" (Mock / ChatGPT web), nên "không biết" và "0" bị gộp làm một.
- **Đề xuất:** Rust trả `Option<u64>` (`null` khi thiếu), `ai` cộng `null` thành `null`. Kiểu `Completion` phía JS và `isTokenCount` của `db` đã nhận `null`. ~10 dòng + test.

### CL-F4 — Kiểu của trường KYC (số / có–không) nằm ở 5 chỗ trong 3 gói

```
ID: CL-F4
Mức: Nit
Trục: B
Vị trí: packages/domain/src/kyc-fact.ts:21–22 (NUMBER_FIELDS, BOOLEAN_FIELDS, không export);
        packages/ai/src/input.ts:117–120 (FIELD_TYPES gửi cho model);
        apps/desktop/src/routes/customers/KycDialogs.tsx:113, 177, 446 (`field === 'hasProtection'`)
Tình trạng: CONFIRMED (đếm; hôm nay khớp)
```

- **Mô tả:** Phase 4 có 2 chỗ (`db/kyc.ts`, `KycDialogs.tsx:90`). Phase 5 chuyển một chỗ sang `domain` và thêm `FIELD_TYPES` ở `ai` cùng hai lần so `hasProtection` ở `KycDialogs` (một trong hộp 3f mới). Thêm một trường số / có–không vào `KYC_FIELDS` mà quên `ai` thì model được báo `type: 'text'`, đề xuất kiểu khác bị V7 bỏ (`normalizeKycValue` từ chối), và `pnpm verify` vẫn xanh.
- **Đề xuất:** `domain` export `kycFieldType(field): 'text' | 'integer' | 'boolean'`; `ai` và hai hộp thoại dùng chung. ~20 dòng, gộp vào task đầu tiên chạm `domain` (như KNOWN "hàm ngày còn thiếu").

## 4. Chuỗi xuyên gói từ các phát hiện A–E (không đặt ID mới)

- **CL-B2, bằng chứng mới (db → UI):** gói B để gói D kiểm link bằng chứng; gói D không nêu. `node F\probe-current-gone.mjs`: phân tích discovery trích `F2` (Nghề nghiệp); RE xác nhận lại "Kỹ sư" hôm nay → panel vẫn badge **`CURRENT`**, nút "Phân tích lại" **không** là nút chính, nhưng bấm bằng chứng `F2` thì `factCodeTarget` trả `gone` → câu "**F2 không còn hiệu lực.**" (`KycIntelligence.tsx:297, 417–419`). Cùng một màn tự mâu thuẫn: CURRENT (theo phiên bản) và bằng chứng hết hiệu lực (theo dữ kiện), trái spec §6.1 "dữ kiện … của phiên bản hiện tại". Mức giữ Low như B2; Owner cần quyết (a) / (b) của CL-B2. Hướng (a) của B2 (panel ánh xạ mã cũ sang dữ kiện cùng trường / giá trị) sửa luôn câu "không còn hiệu lực".
- **Câu trả lời bị cắt, Rust → ai → db → UI:** Rust bỏ `finish_reason` (CL-C3) → `extractJson` chọn phần tử con (CL-A4) → lần thử lại nói sai lỗi → REJECTED lưu `output_json` là phần tử con → dòng "bị loại" của panel ghi "V1 hypotheses: sai kiểu". Nên sửa chung một lần: Rust trả `finish_reason`, `ai` báo "trả lời bị cắt".
- **Câu báo lỗi, Rust → UI:** hết hạn kết nối 10 s hiện "2 phút" (CL-C2), HTTP 5xx / 404 ở panel và trích xuất mất mã và thông điệp (CL-D1), `AI_NO_KEY` không có link (CL-D6), lỗi > 2 MB mất mã HTTP (CL-C7). Bốn mục cùng đi qua `AiPanelRun` / `errorText` → nên gom một Issue.
- **Một dòng `ai_analyses` sai, db → mọi màn:** lệnh nhận đầu ra sai schema (CL-B1) → `analysisContent` ném `ZodError` → `ErrorBoundary` của **cả màn** (`AppShell.tsx:52`): Hồ sơ KH, và màn Lịch hẹn khi mở chi tiết lịch của KH đó (`AppointmentAi` gọi cùng `analysisContent`). Mọi backup sau đó cũng bị từ chối (B1). Hôm nay không đường nào của app ghi dòng như vậy.
- **Cỡ dữ liệu, ai → Rust:** message thử lại phình theo số mã sai (CL-A8) và ghi chú không trần (CL-A9) cùng chạm trần 200 000 ký tự của Rust thành `AI_BAD_REQUEST` ("lỗi lập trình"); thân nén không trần (CL-C1); `extractJson` O(n²) trên thân lớn (CL-A5). Hướng chung: `ai` tự giữ trần trước khi gọi Rust và báo lỗi dữ liệu.
- **Test không nối các phía:** `post()` và hằng URL / key (CL-C4), bản chép logic Rust trong script eval (CL-E6), e2e không qua phân tích OpenCode ACCEPTED (CL-E8). Thêm vào đó: không test nào đặt ví dụ của prompt vào validator (CL-F1). Một test "ví dụ G5 → V1 trượt" sẽ giữ được (b) của CL-F1.

## 5. Ghi chú cho phiên tổng hợp (sửa / làm rõ báo cáo gói trước)

- **CL-C4 nói quá một ý:** câu "`lib.rs`: không test nào nối … tên lệnh và tên tham số (`sessionId` → `session_id`) với phía JS" **không đúng**. `apps/desktop/src/data/tauri-contract.test.ts:158–179` so danh sách lệnh AI đăng ký trong `generate_handler!`, tên tham số Rust (đổi sang camelCase) với `AI_COMMANDS` và với đúng các khóa `tauriOpenCode` gửi; `:180–194` so mã lỗi. Phần còn đúng: static `AI_RUNNING` dùng chung không có test, và các đột biến ở `post()` / hằng URL / key sống.
- **CL-E8 đã sửa ý ở `D.md`** ("`page.content()` phủ DB / backup"): đồng ý với E, DB / backup do unit `ai-analysis.test.ts:593–613` phủ.
- **CL-F1 liên quan CL-A7** (chuỗi chỉ có ký tự vô hình đạt schema): cùng hướng sửa "text phải có chữ cái".
- **Kết luận các gói trước không đổi:** đã kiểm lại trên code các điểm nối mà F đi qua (§2), không thấy phát hiện A–E nào sai ngoài ý ở CL-C4 trên.

## 6. Bảng đếm mức × trục

### 6.1 Gói F

| Mức \ Trục | E | G | C | D | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | | 0 |
| High | | | | | | | | | | 0 |
| Medium | | 1 (F1) | | | | | | | | 1 |
| Low | | | 1 (F2) | | | | | | | 1 |
| Nit | | | 1 (F3) | | | | 1 (F4) | | | 2 |
| **Tổng** | 0 | 1 | 2 | 0 | 0 | 0 | 1 | 0 | 0 | **4** |

### 6.2 Toàn bộ phía Claude (A–F, trục chính của từng phát hiện)

| Gói | Medium | Low | Nit | Tổng |
|---|---|---|---|---|
| A `ai` + domain | 0 | 6 | 3 | 9 |
| B db | 0 | 4 | 2 | 6 |
| C Rust | 1 (C1) | 4 | 2 | 7 |
| D UI | 0 | 4 | 5 | 9 |
| E tools / e2e / CI | 0 | 6 | 3 | 9 |
| F xuyên gói | 1 (F1) | 1 | 2 | 4 |
| **Tổng** | **2** | **25** | **17** | **44** |

Không có Critical / High. Tỉ lệ PLAUSIBLE: 4 / 44 (CL-C3, CL-C5, CL-E7, phần mã phiên của CL-C7); còn lại CONFIRMED bằng probe / đột biến / số đo.

## 7. Đã xét, không thấy

- **E — Edge case xuyên gói:**
  - Nạp lại / Nhập backup khi AI đang chạy: KH hay phiên bản không còn → `discarded` (`ai-analysis.ts:165, 207`); D đã chạy e2e. Ghi muộn vào DB cũ trong khoảng chờ backup là **KNOWN S-2**. AI làm cửa sổ này dễ gặp hơn vì lần chạy kết thúc vào lúc bất kỳ, nhưng DB cũ sắp bị thay nên không mất gì người dùng muốn giữ. Không có bằng chứng mới.
  - Phiên web khi thay DB: Cài đặt là route khác, Hồ sơ KH bị gỡ, phiên mất (đọc `Screen.tsx`, `AppShell.tsx:52`).
  - Qua nửa đêm giữa bấm và lưu: `analysisDate` và `date` lệch một ngày, mức bằng chứng theo `analysisDate` (§2.2).
  - Hai phân tích chồng nhau giữa hai KH: một runner chung (`AI_BUSY`); phiên web không giữ runner, đúng §3.1 điểm 5.
- **G — Guardrail:** ngoài CL-F1, AI không có đường ghi dữ liệu KYC (§2.1). Câu dán / output chỉ hiện dạng chữ (D đã kiểm). Prompt injection qua giá trị dữ kiện: giá trị nằm trong chuỗi JSON, output vẫn qua V1–V6, không có công cụ để model gọi.
- **C — Hợp đồng:** bảng §2.2. `CHATGPT_URL` có ở JS và Rust, cả hai được test ghim bằng chuỗi cố định (`ai-analysis.test.ts:548`, `ai.rs:886`). `EXTRACTION_FIELDS` suy từ `KYC_FIELDS` (không chép tay). Khối AI ở lịch hẹn dùng cùng `analysisContent` và luật "ACCEPTED mới nhất" với panel.
- **D — Dữ liệu / hồi quy Phase 1–4:**
  - `normalizeKycValue` chuyển sang `domain`: tương đương bản cũ (NFC + trim, số / có–không, NUL → `INVALID_TEXT` qua `cleanText`).
  - `getKycProfile` thêm `seq`, lệnh vẫn đọc bản không `seq` (`loadProfile`) nên dữ kiện lệnh trả về vẫn bằng dữ kiện đọc lại.
  - `TextField` / `SelectField` chỉ thêm prop tùy chọn (`placeholder`, `disabled`).
  - Settings Dữ liệu chỉ bọc thêm thanh mục.
  - Migration / backup Phase 4 → 5: B đã probe (42 ms, nhập file schema 5).
  - Luật nhập 10 (tương lai) và 14 (AI) dùng cùng `today` của máy nhập.
  - `baseline.md`: 2 152 test + 182 e2e xanh ở SHA này. Không chạy lại toàn bộ.
- **S — An toàn:** §2.3. Không thấy đường nào đưa key vào webview (không lệnh trả key), DB, backup, log hay câu lỗi (trừ CL-C7 mã phiên). Dữ liệu gửi đi đúng §6.1. Clipboard Windows giữ tin nhắn sau phiên: hệ quả thiết kế W-1, ghi ở §2.3.
- **P — Hiệu năng:** đường đi đầu-cuối không thêm chi phí ngoài các số đo của A (V1–V6 2,7 ms), B (`listAiAnalyses` 2 000 dòng 25,5 ms), C (`reply` 2 MB 0,9 ms), D (dán 20 000 ký tự 28–35 ms). Probe F2 (mở app + lưu + Nạp lại với seed rỗng + xuất / nhập backup): 73–84 ms. Seed demo + 767 lần `startWebAnalysis` / `checkWebAnswer`: vài giây, không đo riêng. Không thấy vấn đề mới.
- **B — Thừa / lặp xuyên gói:**
  - Quét export của `@p2c/ai` không dùng ngoài gói: 41 tên, đều là kiểu / hằng sinh kiểu, đã nêu ở A hoặc là phạm vi export KNOWN #455. `text-match.ts`, `blocklists.ts`, `prompts/*` không re-export.
  - Nhãn tiếng Việt 3 bản: CL-B5. Danh sách provider không model / hằng 20 000: KNOWN #455. Thêm CL-F4.
- **T — Test:** §4 gạch cuối, cộng CL-F1 (không test nào cho ví dụ prompt qua validator).
- **A — Trợ năng / i18n:** không thêm gì ngoài D (CL-D3, CL-D9). Câu mới đề xuất ở CL-F1 (a) / CL-F2 (b) phải qua `vi.ts`.

## 8. Kết luận cho G7 Phase 5 (phía Claude)

**CHƯA SẴN SÀNG** — tối thiểu nên sửa trước khi merge cuối milestone và phát hành exe:

1. **CL-F1** (Medium, G): một thao tác dễ gặp của RE ở đường ChatGPT web (dán lại tin nhắn còn trong clipboard), hay một model chép lại ví dụ, ghi vào bảng chỉ-thêm một phân tích CURRENT toàn "…" có nhãn mức bằng chứng. Hiện ở hồ sơ KH và chi tiết lịch hẹn, không xóa được. Trên seed demo: 14 % KH ở chế độ analysis. Phần (a) không cần G5, ~15 dòng SP + test.
2. **CL-C1** (Medium, S / C): trần 2 MB của §5.2 không giữ được với trả lời gzip, có thể làm tiến trình abort. ~10–20 dòng SP + test.
3. Nên kèm (nhỏ, cùng đợt): **CL-D2** (ô key hiện rõ khi dán / sau lưu lỗi, ~10 dòng) và **CL-C2** (lỗi kết nối 10 s hiện "2 phút", ~5 dòng).

Tổng ước lượng nhóm tối thiểu (1–2): ≈ 30–40 dòng SP + ≈ 80 dòng test, vừa một Issue. Mọi mục còn lại (25 Low, 17 Nit) đều không mất / hỏng dữ liệu KYC, không lộ key, và có thể xếp sau G7 hoặc vào Phase 6.

Điểm cần Owner quyết khi tổng hợp:

- CL-F1 có làm phần (b) qua G5 (V1 đòi chữ cái / đổi mã trong ví dụ) ngay không.
- CL-F2: giữ Cài đặt → AI qua Nạp lại, hay chỉ ghi rõ.
- CL-B2: định nghĩa CURRENT khi xác nhận lại cùng giá trị.
- CL-C5: kiểu bền key "Local".

Nếu Owner coi CL-C1 là rủi ro chấp nhận được (cần server có chứng chỉ hợp lệ cho opencode.ai), điều kiện tối thiểu còn **CL-F1 (a)**.

## 9. Phụ lục — nguồn probe (trong `C:\workspace\deep-review-5\claude\F\`)

| File | Việc | Chạy |
|---|---|---|
| `hooks.mjs`, `common.mjs` | chép từ `claude\B\` (hook resolve + `?raw`, dựng DB / KH / dữ kiện) | (được import) |
| `probe-current-gone.mjs` | CL-B2 bằng chứng mới: CURRENT + `factCodeTarget` = `gone` sau khi xác nhận lại cùng giá trị | `node probe-current-gone.mjs` |
| `probe-reload-settings.mjs` | CL-F2: `openAppData` (client OpenCode giả) → lưu Cài đặt → AI → Nạp lại → Nhập backup | `node probe-reload-settings.mjs` |
| `probe-paste-own-message.mjs` | CL-F1: dán lại tin nhắn trên KH tự dựng (discovery, analysis); in khối JSON đầu tiên của tin nhắn | `node probe-paste-own-message.mjs` |
| `probe-paste-own-seed.mjs` | CL-F1: đếm trên seed demo (`seed: 1`, 15/09/2026) số KH ACCEPTED khi dán lại tin nhắn; lưu 3 dòng bằng `recordAiAnalysis` | `node probe-paste-own-seed.mjs` |
| `probe-echo-example.mjs` | CL-F1 qua OpenCode: adapter trả lại `system` prompt → `runAnalysis`; panel đọc lại | `node probe-echo-example.mjs` |
| `probe-paste-names.mjs` | tên KH không trùng bị CL-F1, để chọn KH cho e2e | `node probe-paste-names.mjs` |
| `playwright.config.ts`, `package.json`, `probe-paste-e2e.spec.ts` | e2e trên bản build web của worktree (`e2e/serve.mjs`, cổng 4183, `VITE_DEMO_ANCHOR` 15/09/2026); id KH tra từ file snapshot bằng sql.js | tạo junction `node_modules` → `C:\workspace\Project-2C-review\node_modules` (`New-Item -ItemType Junction`), rồi `node node_modules/@playwright/test/cli.js test probe-paste-e2e`; gỡ bằng `cmd /c rmdir node_modules` |
| `probe-out.txt` | đầu ra nguyên văn của 6 probe Node | |
| `F-E1-Bùi-Thanh-Hùng.png`, `F-E1-Hồ-Thanh-Hạnh.png` | ảnh panel sau khi dán lại tin nhắn | |

### Đầu ra chính (rút gọn)

```
== probe-current-gone
before: badge CURRENT · primary button false · cites F2 → link {"kind":"shown","code":"F2"}
after same-value reconfirm: badge CURRENT · primary button false · cites F2 → link {"kind":"gone","code":"F2"}
== probe-reload-settings
after save: stored {"provider":"OPENCODE_GO","opencodePlan":"CREDIT","model":"kimi-k3","reasoning":"HIGH"} problem null · next request provider OPENCODE_GO
after Nạp lại: stored {"provider":"MOCK","opencodePlan":"GO","model":"deepseek-v4.1-flash","reasoning":"DEFAULT"} problem null · next request provider MOCK
after Nhập backup: stored {"provider":"OPENCODE_GO","opencodePlan":"CREDIT","model":"kimi-k3","reasoning":"HIGH"} problem null · next request provider OPENCODE_GO
== probe-paste-own-message
discovery: paste own message → retry [V2 hypotheses[0].evidence[0] "F12 không có trong đầu vào", …] · paste it again → record REJECTED
first JSON block of the message: {"hypotheses":[{"text":"…","evidence":["F12"]}],"discoveryStrategy":[{"text":"…","evidence":[],"missingCategory":"ASSETS"},…
== probe-paste-own-seed
{"blocked":433,"discovery":{"ACCEPTED":1,"retry":496},"analysis":{"ACCEPTED":38,"retry":232}}
  Bùi Thanh Hùng (analysis) → saved ACCEPTED, output {"hypotheses":[{"text":"…","evidence":["F12"]}],"needs":[{"text":"…","evidence":["F12"]}],…
== probe-echo-example
panel badge CURRENT · attempts 1 · source {"model":"DeepSeek V4.1 Flash"}
  hypotheses: "…" F12 LOW · needs: "…" F12 LOW · painPoints: "…" F10 LOW · themes: "…" F12 LOW
  discoveryStrategy: "…" F10,F13 MEDIUM · discoveryStrategy: "…" — · nextBestActions: "…" F9 LOW
  reference: "…" MEDIUM · "…" LOW
OpenCode echo of the prompt: 39 / 767 ACCEPTED at attempt 1
== probe-paste-e2e (Playwright, 2 passed, 12.9 s)
F-E1 Bùi Thanh Hùng: message starts "Tin nhắn này có hai phần. Phần HƯỚNG DẪN…" (6143 chars)
F-E1 Bùi Thanh Hùng: panel: KYC Intelligence CURRENT ChatGPT web … PAIN_POINT_ANALYSIS kyc v13 · analysis@1+web@1 · ChatGPT web · 15/09 15:17
  Behavioral Hypotheses giả thuyết, cần kiểm chứng … Bằng chứng: F12 Mức bằng chứng: thấp · 1 dữ kiện, mới nhất 01/01/2026 …
```
