# Deep review Phase 5 — gói F (xuyên gói) — Muse

- SHA ghim: `0df3606fb783cc89b1b9c413c02810340e273a4f` (kiểm bằng
  `git -c safe.directory='*' rev-parse HEAD` đầu phiên; khớp tiền tố `0df3606`).
- `git status --short` đầu phiên: `?? .agents/`, `?? .codex/`, `?? AGENTS.md`,
  `?? opencode.json` (đúng 4 mục prompt cho phép).
- Ngày: 10/10/2026. Viết bằng tiếng Việt. ID: `MS-F<n>`.
- Ghi chú môi trường: sandbox chặn ghi ra `C:\workspace\deep-review-5\`, nên nháp +
  probe làm ở thư mục tạm của sandbox rồi chép ra bằng một lệnh `Copy-Item` có phê
  duyệt (như gói E); báo cáo này ghi một lần cuối phiên thay vì ghi dần.

Kết quả tóm tắt: **0 phát hiện mới**. Mọi seam xuyên gói đã kiểm (đường đi đầu-cuối
3 luồng, hợp đồng `ai ↔ db ↔ UI ↔ Rust`, key và dữ liệu KH, hồi quy Phase 1–4) đều
khớp spec hoặc đã có trong báo cáo A–E / `known.md` (chỉ dẫn ID, không báo lại).
Bằng chứng là 3 probe chạy thật qua code repo ở SHA trên (§5) + đọc diff toàn bộ
file Phase 1–4 bị chạm. Kết luận G7 ở §6.

## 1. Phạm vi đã đọc

Tài liệu chuẩn (đọc toàn bộ): `plan.md` (§1, §3-dòng F, §4, §5), `baseline.md`,
`known.md` (toàn bộ, để gắn KNOWN), `build-web.log` (38 dòng), `CONTEXT.md`,
`docs/design/phase-5-ai.md` (1–430), `docs/design/phase-5-prompts.md` (1–345),
`docs/golden/ai-eval.md` (1–120),
`docs/decisions/0009-ai-copilot-provider-va-guardrail.md` (1–82, cả phụ lục D-1,
G5, W-1), `CLAUDE.md` (gốc), `packages/ai/CLAUDE.md`, `packages/db/CLAUDE.md`,
`packages/domain/CLAUDE.md`, `apps/desktop/CLAUDE.md`, `docs/design/mockups/ai.html`
(330–459: thẻ key / kiểm tra kết nối / mẫu 1b–1f; các vùng khác qua grep),
`muse/A.md`–`muse/E.md` (toàn bộ 5 báo cáo).

Code repo ở SHA trên (số là dòng đã đọc):

- `apps/desktop/src/data/ai-analysis.ts` 1–304 (toàn bộ: `AppAi`, `analyseCustomer`,
  `extractFromNote`, `startChatGptWeb`, `saveChatGptAnswer`), `ai-jobs.ts` 1–76
  (toàn bộ), `ai-tauri.ts` 1–75 (toàn bộ), `app-data.ts` 185–215 (clock) + 270–381
  (`replace`/`run`/lưu AI), `tables.ts` 1–68 (toàn bộ), `demo-snapshot.ts` 1–31.
- `apps/desktop/src/routes/settings-ai-view.ts` 1–107 (toàn bộ),
  `SettingsAi.tsx` 48–137 + 278–357, `Settings.tsx` (qua diff),
  `customers/use-ai-job.ts` 1–48 (toàn bộ), `customers/ai-panel-view.ts` 180–235
  (`panelError`/`runAfter`) + grep toàn file, `customers/extraction-view.ts` 1–83
  (toàn bộ), `customers/KycExtraction.tsx` 1–134 (toàn bộ), `customers/CustomerKyc.tsx`,
  `CustomerProfile.tsx`, `KycDialogs.tsx` (+ `has`/`boolean` ở 176–177),
  `kyc-view.ts`, `appointments/AppointmentsScreen.tsx` (qua diff đầy đủ),
  `shell/close-guard.ts` 1–34, `shell/block-reload.ts` 1–41, `i18n/index.ts` 1–132,
  `i18n/vi.ts` (khóa `aiError.*`, `settingsAi.check*`, slot mới).
- `packages/ai/src/run.ts` 1–394 (toàn bộ), `web.ts` 1–121 (toàn bộ),
  `mock-adapter.ts` 1–170 (toàn bộ), `schema.ts` + `errors.ts` (hằng enum/mã lỗi).
- `packages/db/src/ai-analyses.ts` 1–277 (toàn bộ), `counts.ts` 1–35 (toàn bộ),
  `common.ts` 14–38 (`cleanText`/`isLabel`), `backup.ts` 60–105 + `MAX_BACKUP_BYTES`,
  `schema.ts` (hằng `AI_*`), `seed.ts` 74–103 + 455–467, `kyc.ts` 100–219 (lệnh) +
  qua diff, `settings.ts` (mới, 29 dòng, qua diff), `test-support.ts` (tham khảo).
- `packages/domain/src/kyc-catalog.ts` (ngưỡng cổng 137–155, khóa trường),
  `customers.ts` 30–63 (`NewCustomer`, đọc cho probe).
- `apps/desktop/src-tauri/src/ai.rs` 225–304 (`server_message`, `transport_error`,
  `clean_key`, lệnh key), `lib.rs` (qua diff đầy đủ).
- Hồi quy: `git diff 3e84ce8..0df3606 --stat` (74 file) + đọc toàn bộ nội dung diff
  của mọi file Phase 1–4 bị sửa (db/domain: `kyc.ts`, `common.ts`, `errors.ts`,
  `backup-validation.ts`, `kyc-fact.ts`, `index.ts`, `migrations.ts`, `settings.ts`;
  app: `app-data.ts`, `i18n/index.ts`, `main.tsx`, `Settings.tsx`,
  `AppointmentsScreen.tsx`, `CustomerKyc.tsx`, `CustomerProfile.tsx`, `KycDialogs.tsx`,
  `kyc-view.ts`, `lib.rs`; e2e: `customer-kyc.spec.ts`, `appointment-outcome.spec.ts`,
  `dialog-keyboard.spec.ts`; `vi.ts` các dòng xóa).
- Không đọc lại sâu phần đã thuộc gói khác khi A–E đã phủ và không phải seam
  (validator/blocklist, migration SQL chi tiết, component panel/history, script eval):
  dùng kết quả A–E làm đầu vào, kiểm lại chỗ nối.

## 2. Phát hiện

Không có phát hiện mới nào ở gói F.

Các phát hiện A–E chạm phạm vi xuyên gói (liệt kê để khỏi sót khi xét G7, không
báo lại): MS-A1 (E: input vượt trần Rust 200k), MS-A4 + MS-B3 (B: seed chép logic
dựng input của `ai` — hai gói cùng thấy, nội dung trùng nhau), MS-A5 (T: nhãn KYC
3 nơi), MS-B1 (D: NUL khi nhập backup), MS-B2 (D: lệnh ACCEPTED không kiểm output),
MS-C1 (C: key xuống dòng), MS-D1 (C, Medium duy nhất: panel mất mã HTTP của AI_HTTP),
MS-D3 (C: khối lịch hẹn thiếu badge ChatGPT web), MS-D4 (A: nút tắt không lý do khi
bận việc nơi khác), MS-E1 (C: chấm X sai quote xuống dòng/NFD), MS-E4/MS-E5 (KNOWN
có bằng chứng mới). Không thấy hai phát hiện A–E nào mâu thuẫn nhau.

## 3. Bảng đếm mức × trục

| Mức \ Trục | E | G | C | D | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| KNOWN mới | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## 4. Đã xét, không thấy (mọi trục §4)

- **E — Edge case: đã xét, không thấy.** Chạy thật 6 đường đầu-cuối qua code repo
  (probe F1/F3, §5): phân tích ACCEPTED → CURRENT → STALE sau phiên bản KYC mới;
  REJECTED sau 2 lần rác (giữ `raw_output`, `output` null, đủ 2 báo cáo validator);
  lỗi mạng lần 2 → báo lỗi, 0 dòng (spec §3.3); Hủy → `cancelled` ngay, `busy` giữ
  tới khi adapter xong, 0 dòng (spec §5.2); hai phân tích chồng nhau → `AI_BUSY`;
  phiên ChatGPT web (dán do Mock dựng) → `CHATGPT_WEB`, `analysis@1+web@1`. Đã đọc:
  Nạp lại/Nhập backup giữa chừng → lưu rơi vào `GONE` (`CUSTOMER_NOT_FOUND` /
  `KYC_VERSION_NOT_FOUND`) thành `discarded`, không crash (`ai-analysis.ts:164–165,
  207–211`; cùng đường cho cả 3 luồng); reload webview bị chặn ở exe
  (`block-reload.ts`), bản web không có Rust để kẹt; đóng app giữa chừng chỉ mất
  kết quả chưa lưu (CloseGuard chỉ giữ hàng đợi ghi, đúng vì chưa có gì để lưu);
  qua nửa đêm giữa chừng: `analysisDate` (lúc bấm) và `date` (lúc lưu) có thể lệch
  1 ngày nhưng cùng một clock (`app-data.ts:200–210`, db giữ ngày của app) nên chỉ
  xảy ra đúng qua nửa đêm, hiển thị và mức bằng chứng vẫn đúng mỗi thứ một việc.
  Input vượt trần Rust và note trích xuất không giới hạn dài: cùng gốc MS-A1, không
  báo lại. Dán cả tin nhắn web vào khung đáp án (nhầm): thành V1 tính lần thử, đúng
  spec §3.1.3 (đọc `checkWebAnswer`, gói A đã kiểm V1).
- **G — Guardrail AI: đã xét, không thấy thêm.** Gói F không cài guardrail; đã xác
  minh đường đi: cổng chặn → nút tắt + kiểm lại lúc bấm (`takeAnalysisInput` dùng
  chung cho Phân tích và ChatGPT web, `run.ts:270–276`); V1–V7 + thử lại dùng chung
  (`retry.ts` qua cả `run.ts` lẫn `web.ts`); AI chỉ ghi `ai_analyses`
  (`recordAiAnalysis` một INSERT, không chạm KYC; trích xuất không lưu — probe §5
  chỉ trả đề xuất); `raw_output` không bao giờ render (gói D đã kiểm). Nội dung
  V3–V6: gói A đối chiếu 682 điểm, xanh.
- **C — Đúng hợp đồng: đã xét, không thấy thêm (1 Medium đã ở MS-D1).** Đối chiếu
  từng seam `ai ↔ db ↔ UI ↔ Rust`: 10 mã lỗi Rust đều có câu UI
  (`AI_BAD_REQUEST` → GENERAL ở cả 3 nơi render: `settings-ai-view.ts:76`,
  `ai-panel-view.ts:189–190`, `extraction-view.ts:53`; `AI_OPEN_BROWSER` do desktop
  sở hữu, không thuộc `AI_ERROR_CODES` — gói C đã chốt); giới hạn khớp hai đầu
  (key 512 ký tự: UI `settings-ai-view.ts:20,33` = Rust `ai.rs:267–269`;
  20 000: ba nơi cùng đếm code point — khác hằng đã KNOWN #455;
  `maxTokens` 8000/4000/64 trong miền Rust 1…16 000; `sessionId` 32 hex trong
  1–64 `[A-Za-z0-9-]`; reasoning UI chữ hoa → Rust chữ thường, lưu DB chữ hoa);
  enum dùng chung một nguồn (`db` import `AI_ANALYSIS_PROVIDERS`/
  `AI_REASONING_LEVELS` từ `@p2c/ai/schema`, `satisfies` ghim); token cộng 2 lần
  thử, null đúng với Mock/ChatGPT web (probe §2/§4); `attempts` ∈ {1,2} ở cả 3 lớp;
  `prompt_version` `analysis@1` / `+web@1` (probe §4); Kiểm tra kết nối với Mock
  không bao giờ tới adapter (button ẩn khi provider hiệu dụng là Mock,
  `SettingsAi.tsx:59,133` — đã suýt báo nhầm, đọc lại thì đúng mockup 1b); URL
  ChatGPT 3 nơi (Rust hằng, `CHATGPT_URL`, e2e literal) mỗi nơi một test ghim đúng
  literal nên lệch là đỏ. MS-D1 (panel mất mã HTTP) và MS-D3 (thiếu badge ChatGPT
  web ở khối lịch hẹn) giữ nguyên ở gói D.
- **D — Dữ liệu: đã xét, không thấy thêm.** Probe §7: backup đi-về giữ nguyên 3
  dòng AI kèm trạng thái; `settings.ai` trong backup đúng 4 trường, không key kể
  cả khi `save()` nhận thừa trường key; toàn bộ file backup không chứa chuỗi key.
  `recordAiAnalysis` một transaction, `toRow` ném trước insert; CHECK + trigger
  append-only (gói B); CURRENT/STALE theo `seq` (probe §2–§4, kể cả STALE-ngay khi
  cùng phiên bản mà có lần mới hơn); reminder material/minor (probe §3);
  `listAiAnalyses` an toàn khi versions rỗng trên lý thuyết nhờ FK (đọc
  `versionsOf`/`analysesOf`: không lọc, FK bảo đảm). Lệnh ACCEPTED không kiểm
  output (MS-B2) và NUL khi nhập (MS-B1) giữ nguyên ở gói B.
- **S — An toàn: đã xét, không thấy.** Key: chỉ Rust chạm Credential Manager
  (`set`/`read`/`delete`/`status`, không lệnh đọc ra); webview chỉ truyền chuỗi
  opaque tới `invoke`, không log (grep `password|Credential|api_key|secret` trong
  `packages/db/src` chỉ trúng 1 comment cảnh báo ở `settings.ts:3`; seed không
  chứa key/token thật); lỗi/log che key (gói C) và cắt 200 ký tự; backup không key
  (probe §7). Mạng: webview không gọi mạng — grep `fetch(|XMLHttpRequest` trong
  `apps/desktop/src` chỉ trúng `demo-snapshot.ts:20` (tải file seed cùng origin,
  có từ trước Phase 5); URL cố định trong Rust, TLS rustls, redirect 0, CSP/
  capabilities không đổi (gói C). Dữ liệu gửi đi: tin nhắn web không tên KH
  (probe §4 `hasName: false`); trích xuất nguyên văn + ChatGPT web tự dán đều đã
  công bố ở thẻ "Dữ liệu gửi đi" (`SettingsAi.tsx:338–357`); output model hiện
  dạng text, không `innerHTML`, không link ngoài ở UI AI (gói D); mở trình duyệt
  qua URL hằng + `noopener` (gói C/E). Nén gzip đếm dưới lớp giải nén (MS-C3) và
  key xuống dòng (MS-C1) giữ nguyên ở gói C.
- **P — Hiệu năng: đã xét, không thấy (số đo thật, probe trên máy review).** Một
  lần phân tích Mock đầu-cuối (cổng → Mock → V1–V6 → lưu): **~205 ms**; export
  backup 17 KB: **2,5 ms**, import lại: **13 ms**; `listAiAnalyses` 100 lần:
  **17,7 ms** (0,18 ms/lần). Bundle: baseline `index-*.js` +113 KB so với Phase 4
  (857 KB, gzip 254 KB) — tăng theo đúng lượng code AI + panel mới, không thấy
  chunk lạ hay trùng lặp trong `build-web.log` (1 087 module như baseline).
  Không có N+1 (đọc panel/db: mỗi màn vài query + tính trong bộ nhớ; gói B/D đo
  chi tiết). Không nêu phát hiện P.
- **B — Bloat: đã xét, không thấy thêm.** `tsc --noUnusedLocals
  --noUnusedParameters` sạch ở `db` (chạy phiên này, exit 0), cộng `ai`/`domain`
  (gói A) và desktop (gói D) → cả 4 package sạch. Rà export AI dùng chéo
  (`AnalysisApp`, `WebTools`, `CHATGPT_URL`, `modelLabel`, `EMPTY_RAW_OUTPUT`…)
  đều có người dùng. Trùng lặp còn lại đều đã ghi: hai hằng 20 000, tập provider
  không model, `newSessionId`/`newPage`, nhãn KYC 3 nơi (MS-A5), seed chép builder
  (MS-A4/MS-B3 — hai gói cùng thấy, nên gộp khi tổng hợp), `retry.ts`,
  `comparable`/`collapseSpaces` (KNOWN #455/#420/#465/#468/#469). Excel không đọc
  AI (grep `reports/` 0 kết quả) — đúng spec (không yêu cầu), không phải thiếu.
- **T — Chất lượng test: đã xét, không thấy thêm.** Probe của gói F chạy qua code
  thật (DB thật, lệnh thật, Mock thật), không mock lớp nào ngoài adapter giữ,
  clipboard/trình duyệt giả và Rust (bị cấm gọi): 6/6 đường đúng. Mutations thuộc
  gói E (UM0–UM4 + M1–M4 đều đỏ đúng). Ghi nhận (không thành phát hiện):
  `AI_BUSY` của Rust chưa có e2e nào dựng (gói E đã ghi); component React +
  `useAiJob` không unit test vì repo chưa có hạ tầng (KNOWN, G4).
- **A — Trợ năng / i18n: đã xét, không thấy thêm.** Gói D đã kiểm (role status/
  alert/note, focus dialog, không chuỗi cứng). F kiểm chéo: slot i18n mới
  (`message`, `model`, `models`, `plan`, `provider`, `reasoning`, `defaults`) chỉ
  dùng ở chuỗi AI mới + 1 chuỗi cũ `{message}` vốn đã hiển thị thô (thêm vào
  PLAIN_SLOTS không đổi hành vi vì `fillSlots` chỉ nhóm số ở COUNT_SLOTS);
  `settings.nav.*` cho nav Cài đặt mới; nhãn timeline sau refactor giữ nguyên
  (null nút ⇔ SYSTEM, `extraction-view.ts:15–19`); 3 khóa `vi.ts` bị xóa chỉ là
  đổi chữ "material" → "thay đổi quan trọng" (T-188, typecheck ghim mọi chỗ dùng).
  MS-D4 (nút tắt không lý do) và MS-D5 (focus sau đóng phiên) giữ nguyên ở gói D.
- **Hồi quy Phase 1–4 (trọng tâm F): đã xét, không thấy.** Đọc toàn bộ diff
  `3e84ce8..0df3606` của mọi file cũ bị sửa: `normalizeKycValue` chuyển sang
  domain giữ nguyên hành vi (NUL → `INVALID_TEXT` qua `cleanText` như cũ, còn lại
  → `INVALID_KYC_VALUE`; NFC+trim tính lại giống hệt); `getKycProfile` thêm `seq`
  (tương thích cộng thêm, test đã cập nhật); backup thêm rule 11–14 nối sau rule
  1–10, nhập file cũ đã có test (gói B); migration 6–9 cộng thêm (B đã kiểm DB cũ
  có dữ liệu); `app-data.ts` chỉ thêm trường `ai` + nhấc `run` ra ngoài (thân hàm
  giữ nguyên); `KycNoteDialog` tách `FactValue`/`NextVersion` tương đương từng
  nhánh (`has` rỗng khi chưa chọn trường nên điều kiện hiển thị không đổi);
  Timeline ủy thác note cho `NoteEvent` nhưng nhãn + text giữ nguyên từng chữ;
  Settings thêm nav (mặc định vẫn Data, nội dung Data giữ nguyên thứ tự); e2e cũ
  sửa theo đúng thay đổi có chủ ý (heading h2 vì thêm khối AI, chữ "AI trích xuất"
  trên timeline, "thay đổi quan trọng", `asExe` gom về `support.ts`); `RecordCounts`
  và `Tables` không gồm `ai_analyses` — hộp 10c thiếu số đã KNOWN, hai bên
  file/hiện tại đối xứng nên không sai lệch; seed AI dùng stream riêng không đổi
  dữ liệu cũ (`seed.ts:135–136`).

## 5. Phụ lục — test tạm và lệnh đã chạy

`C:\workspace\deep-review-5\muse\F\`: `loader.mjs`, `run.mjs` (chạy nguồn `.ts`
của repo bằng type-stripping của node 24 + resolve `*.sql?raw`, không chạm repo),
`probe-f1-e2e.ts` (§1–§8), `probe-f2-settings.ts` (hình JSON backup),
`probe-f3-paths.ts` (§1–§3). Chạy từ chính thư mục đó: `node run.mjs <probe>`.

Kết quả thật (lần chạy cuối, node v24.20.0):

```
§1 gate: PAIN_POINT_ANALYSIS aiAllowed: true
§2 outcome: {"kind":"saved","status":"ACCEPTED"} (205.5 ms)
§2 rows: seq 1, analysis, ACCEPTED, CURRENT, MOCK, model/reasoning/token null,
  promptVersion analysis@1, attempts 1, analysisDate 2026-10-10
§3 after new version: seq 1 STALE, reminder {material:false}
§4 web start: copied true, opened true, msgLen 6220, hasName false
§4 web save: {"kind":"saved","status":"ACCEPTED"}
§4 rows: seq 2 CHATGPT_WEB analysis@1+web@1 CURRENT; seq 1 MOCK STALE
§5 extraction: facts [maritalStatus "Đã kết hôn", childrenCount 2]
§6 second: {"kind":"error","code":"AI_BUSY"} | first: {"kind":"saved","status":"ACCEPTED"}
§7 settings.ai in backup: 4 fields provider,opencodePlan,model,reasoning; no SECRET
§7 export 17581 chars (2.5 ms), import (13.2 ms), 3 ai rows kept with states
§8 listAiAnalyses x100: 17.7 ms
F3 §1: saved/REJECTED, attempts 2, raw kept, output null, 2 validator reports
F3 §2: error AI_TIMEOUT, 2 calls, 0 rows
F3 §3: cancelled at once, busy until adapter settles, 0 rows
F2: settings rows value_json carries the 4-field JSON (probe F1 ban đầu đọc nhầm
  tên cột camelCase — lỗi của probe, đã sửa; sản phẩm đúng)
```

Lệnh khác trong phiên (kết quả thật): `git rev-parse HEAD` → `0df3606f…`
(khớp); `git diff 3e84ce8..0df3606 --stat` → 74 file, +11020/−248;
`tsc --noUnusedLocals --noUnusedParameters` trên `@p2c/db` → exit 0;
grep key/mạng/Excel/clock như trích ở §4.

`git status --short` cuối phiên: (ghi trước khi chép báo cáo ra — xem §7).

## 6. Kết luận G7 Phase 5 (gói F)

**SẴN SÀNG** cho G7, với một đề xuất sửa trước/sát G7 và danh sách theo dõi dưới
đây. Lý do: (1) không có Critical/High ở cả 6 gói; Medium duy nhất là MS-D1 (mất
mã HTTP ở panel — có đường vòng qua Cài đặt → Kiểm tra kết nối, sửa chỉ vài chục
dòng); (2) mọi đường đầu-cuối (phân tích / trích xuất / ChatGPT web / REJECTED /
lỗi / Hủy / bận) chạy đúng qua code thật ở phiên này; (3) key và dữ liệu KH đi
đúng chỗ (key chỉ ở Rust/Credential Manager, backup không key, tin nhắn AI không
tên KH, webview không gọi mạng); (4) không phát hiện hồi quy nào ở code Phase
1–4 (diff đã đọc hết, chỗ rủi ro nhất là `normalizeKycValue` và refactor dialog
đều tương đương); (5) guardrail V1–V7 đã được gói A đối chiếu toàn bộ G5.

Đề xuất thứ tự (nhỏ, mỗi mục ≤ 400 dòng SP; Owner quyết có sửa trước G7 hay gom
Issue sau): MS-D1 trước (đúng mùa gói Go hết hạn 11/10, Owner cần đọc mã HTTP
thật ở màn làm việc); sau đó MS-B2, MS-A1, MS-E1, MS-B1; các Low/Nit còn lại và
mục KNOWN gom vào lần chạm file theo lệ. Rủi ro đã biết và chấp nhận, không chặn:
rủi ro chính sách gói Go (ADR-0009 W-1 mục 7), chất lượng output model lần eval đầu
là việc G5 không phải lỗi code, dữ liệu giả lập nạp lại khi đổi schema (R2-02).

## 7. Trạng thái git cuối phiên

`git -c safe.directory='*' rev-parse HEAD` → `0df3606fb783cc89b1b9c413c02810340e273a4f`
(không đổi). `git status --short` cuối phiên:

```
?? .agents/
?? .codex/
?? AGENTS.md
?? opencode.json
```

Đúng 4 mục như đầu phiên — repo không bị sửa (chỉ đọc + chạy lệnh; probe và nháp
ở ngoài repo).
