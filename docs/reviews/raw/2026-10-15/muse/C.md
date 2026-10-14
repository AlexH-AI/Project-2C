XONG — muse gói C, 23:23 14/10/2026

# Báo cáo gói C — AI (Muse, lượt 1)

## 1. Thông tin phiên

- Bên: muse
- Gói: C (AI)
- SHA đầu phiên: 885534549808f42aec7f9af5743bbf86642ee4bd
- Trạng thái kho đầu phiên (`git status --short`): trống (sạch)
- Giờ bắt đầu: 23:05 14/10/2026
- Máy: Office Laptop (máy chạy lượt này, trùng máy đo nền trong `common\perf\perf-ref.json`)
- Quy định: chỉ đọc kho, không ghi vào kho; thử tạm đặt trong `muse\C\`; không gọi dịch vụ AI thật; không mở `claude\`, `codex\`.

## 2. Phạm vi đã đọc

Đọc sâu toàn bộ 36 tệp sản phẩm thuộc gói (5 193 dòng, đếm bằng `Get-Content`):

- `packages/ai/src`: `adapter.ts` (43), `blocklists.ts` (108), `code-points.ts` (45), `errors.ts` (56), `extract-json.ts` (84), `index.ts` (11), `input.ts` (29), `mock-adapter.ts` (112), `models.ts` (35), `prompts/analysis.ts` (48), `prompts/connection.ts` (14), `prompts/discovery.ts` (43), `prompts/extraction.ts` (27), `prompts/retry.ts` (63), `run.ts` (428), `schema.ts` (356), `settings.ts` (86), `test-support.ts` (69), `text-match.ts` (74), `validator.ts` (269), `web.ts` (150).
- App: `data/ai-analysis.ts` (333), `data/ai-jobs.ts` (82), `data/ai-tauri.ts` (75), `routes/ai-error-view.ts` (66), `routes/appointments/AppointmentAi.tsx` (86), `routes/appointments/appointment-ai-view.ts` (49), `routes/customers/ai-panel-view.ts` (622), `routes/customers/extraction-view.ts` (106), `routes/customers/KycExtraction.tsx` (180), `routes/customers/KycHistory.tsx` (154), `routes/customers/KycIntelligence.tsx` (572), `routes/customers/KycWebSession.tsx` (191), `routes/customers/use-ai-job.ts` (53), `routes/SettingsAi.tsx` (387), `routes/settings-ai-view.ts` (87).

Đọc thêm chỗ nối sang gói khác: `routes/customers/kyc-view.ts` (toàn bộ, `factInEffect`/`factCodeTarget`), `data/app-data.ts` (số thế hệ, cờ thay, xuất/nhập), `packages/db/src/ai-analyses.ts` (`analysisLabelsFit`, `analysisContentFits`, `listAiAnalyses`), `src-tauri/src/ai.rs` (kiểm key, trần token, địa chỉ ChatGPT), `routes/Screen.tsx` (gắn màn), mockup `ai.html` (vùng 4e–4g), đặc tả (`phase-5-ai.md`, `phase-5-prompts.md`, `ai-eval.md`, ADR-0009, `phase-6-hoan-thien.md` §4–§5), `plan.md`, `known.md`, `baseline.md`, `perf-ref.json`.

Chạy: toàn bộ test gói C (783 test xanh), 3 probe (P1, P2, P3), 2 đột biến trên bản chép (M1, M2 đều bị test giết), `tsc --noUnusedLocals --noUnusedParameters`, `pnpm lint:deps`.

## 3. Phát hiện

```
ID: MU-C1
Mức: Low
Trục: D
Vị trí: apps/desktop/src/data/ai-analysis.ts:321 (8855345)
Tình trạng: CONFIRMED
Mô tả: Phiên ChatGPT web không chụp số thế hệ dữ liệu lúc mở, nên dán đáp án sau khi thay dữ liệu thành công vẫn lưu, trong khi Phân tích và AI trích xuất đều loại ở đúng tình huống này (DR5-36, S2-3).
Tái hiện / bằng chứng: probe P2 (nguồn ở phụ lục): mở phiên web, xuất rồi nhập lại cùng backup (số thế hệ 0 → 1, cùng ID), gọi `saveChatGptAnswer` thì trả `{"kind":"saved","status":"ACCEPTED"}`, dòng CURRENT. Trong khi `ai-analysis.test.ts:320` ghim `analyseCustomer` loại ở đúng tình huống này.
Ảnh hưởng: hôm nay không tới được qua màn hình (rời Hồ sơ KH để Nạp lại/Nhập backup thì panel hủy gắn và phiên mất theo state trong `KycIntelligence.tsx`), nên chỉ là lệch ở tầng hàm; kể cả khi tới được, dữ liệu sai chỉ khi ID phiên bản còn mà dữ kiện dưới nó đã khác (backup sửa tay), vì dữ kiện và phiên bản bất biến nên ID chung luôn cùng nội dung ở các bản y nguyên hay nối tiếp nhau.
Đề xuất: chụp số thế hệ lúc `startChatGptWeb` và loại khi đã đổi trong `saveChatGptAnswer`; cỡ ~30 dòng sản phẩm + test.
```

```
ID: MU-C2
Mức: Low
Trục: G
Vị trí: packages/ai/src/validator.ts:249 (8855345)
Tình trạng: CONFIRMED
Mô tả: Chi tiết V1 cho mã bằng chứng sai dạng và enum sai không nói dạng đúng, nên tin thử lại không giúp model sửa trong lần thử duy nhất.
Tái hiện / bằng chứng: probe P1: bằng chứng `F0` cho `V1 @ hypotheses[0].evidence[0]: sai định dạng`; `system` là `HOROSCOPE` cho `V1 @ personalityNotes[0].system: giá trị không hợp lệ`. Zod 4.6.5 có sẵn mẫu và giá trị mong đợi trong issue nhưng `schemaDetail` bỏ.
Ảnh hưởng: khi model viết sai dạng (hiếm), lần thử lại dễ trượt tiếp rồi thành REJECTED, RE phải bấm chạy lại.
Đề xuất: kèm mẫu và giá trị mong đợi vào chi tiết (vd. `mã dạng F12`, `một trong PSYCHOLOGY, ESOTERIC`); cỡ ~30 dòng + test.
```

```
ID: MU-C3
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/routes/SettingsAi.tsx:309 (8855345)
Tình trạng: CONFIRMED
Mô tả: Chú thích "the request is 64 tokens at most" đã cũ từ DR5-23: kiểm tra kết nối dùng `maxTokens` 1024.
Tái hiện / bằng chứng: đọc `SettingsAi.tsx:307-310` và `packages/ai/src/prompts/connection.ts:13` (`maxTokens: 1_024`).
Ảnh hưởng: người đọc hiểu sai chi phí lần kiểm.
Đề xuất: sửa số trong chú thích; 1 dòng.
```

```
ID: MU-C4
Mức: Nit
Trục: B
Vị trí: packages/ai/src/errors.ts:25, apps/desktop/src/routes/customers/KycExtraction.tsx:17 (8855345)
Tình trạng: CONFIRMED
Mô tả: Hai export không nơi nào nhập: giá trị `AI_LOCAL_ERROR_CODES` (chỉ kiểu `AiErrorCode` dùng tới) và kiểu `ConfirmProposal` (chỉ dùng trong file).
Tái hiện / bằng chứng: tìm toàn repo (`packages/ai/src`, `apps/desktop/src`, `tools`, `e2e`) chỉ thấy chỗ định nghĩa và test của chính nó.
Ảnh hưởng: mặt ngoài API rộng hơn cần.
Đề xuất: bỏ export, hoặc giữ như API có chủ ý; 1–2 dòng.
```

Các mục KNOWN thuộc gói C đã đối chiếu mà không có bằng chứng mới nên không nêu: `phrase()` ghi tên mục vào chi tiết, issue trùng khi mục giao nhau (#420); `extract-json` bỏ khối sau dấu `{` chưa đóng khi bị cắt, `issueLine` so chuỗi `CUT_ANSWER`, tin rỗng của `assistant` khi thử lại, thứ tự kiểm `TOO_LONG` (#521); `use-ai-job` mất kết quả lỗi và `start` ghi đè (#468); nhãn và dấu `:` của `KycExtraction` (#469); dòng 1g và thẻ kiểm tra của `SettingsAi`, `sentChatgpt` thiếu đầu in đậm (#444); `newSessionId` lặp `newPage` (#448); danh sách provider, hằng 20 000, logic trong `retry.ts`, cặp `customerId`/`kycVersionId`, export thừa của `run.ts` (#455).

## 4. Bloat và hiệu năng

### Bloat

| Đã chạy / đọc | Trên dữ liệu nào | Số | ID |
|---|---|---|---|
| `tsc --noEmit --noUnusedLocals --noUnusedParameters -p packages/ai` | mã nguồn | sạch, mã thoát 0 | — |
| Lệnh trên cho `apps/desktop`, lọc tệp gói C | mã nguồn | không lỗi nào ở tệp gói C | — |
| `pnpm lint:deps` | toàn repo | không vi phạm (309 module, 1 244 phụ thuộc) | — |
| Tìm nơi nhập từng export gói C | toàn repo | 2 export thừa | MU-C4 |
| Đọc `packages/ai/package.json` | khai báo | chỉ phụ thuộc `domain` + `zod` | — |
| Rà lặp ≥ 3 nơi trong gói C | mã nguồn | không thấy mới (các mục lặp đã ở KNOWN) | — |

### Hiệu năng

Máy Office Laptop, lúc đo chỉ chạy phiên này. Dữ liệu tải `load-2026-10-12-seed6.p2cbackup` (1 496 KH, 10 414 lịch hẹn, 54 nhân sự, 103 phân tích AI).

| Đã chạy / đo | Trên dữ liệu nào | Số | ID |
|---|---|---|---|
| Probe P3: `importBackup` | dữ liệu tải | 900 ms (một lần) | — |
| Probe P3: `buildAnalysisInput` | KH nhiều dữ kiện nhất (19) | 0,04 ms/lần (trung bình 50 lần) | — |
| Probe P3: `validateOutput` | đầu ra mẫu chế độ `analysis`, 19 dữ kiện | 4,76 ms/lần (trung bình 50 lần) | — |
| Probe P3: `extractJson` | câu dán 17,0 nghìn ký tự, khối nằm cuối | 0,24 ms/lần (trung bình 20 lần) | — |
| Probe P3: `checkWebAnswer` | câu dán như trên | 0,88 ms/lần (trung bình 20 lần) | — |
| Số tham chiếu `perf-ref.json` (exe, cùng máy) | dữ liệu tải | `customer.open-ai` 23,1 ms; `customer.ai-history` 6,5 ms | — |

Ngưỡng thao tác màn < 200 ms: mọi số AI đều đạt xa. Không phát hiện P.

## 5. Bảng đếm mức × trục

|  | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Low | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 2 |
| Nit | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 2 |
| Tổng | 0 | 1 | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 4 |

Tình trạng: CONFIRMED 4/4 (100%), PLAUSIBLE 0. Không có Critical/High/Medium.

## 6. Đã xét, không thấy

- E (edge case): đã đọc `extract-json.ts`, `run.ts` (`converse`, `AiRunner`), `web.ts`, `ai-jobs.ts`, `use-ai-job.ts`; đã chạy P2 (thay dữ liệu giữa phiên web → MU-C1) và toàn bộ test (gồm Hủy, AI_BUSY, S2-2/S2-3/S2-4). Nút bấm đúp không lưu trùng vì React dọn giữa các sự kiện rời rạc và lưu web là đồng bộ; kiểm `replaced()` rồi lưu là một đoạn đồng bộ nên không đua. Không thấy thêm.
- C (đúng hợp đồng): đã đối chiếu từng mục G5 §8 với `blocklists.ts` (mục, kiểu, cờ bỏ dấu, phạm vi regex đều khớp); chữ prompt có test ghim nguyên văn và xanh; mockup 4g vẫn còn nút Copy lại nên code khớp; `PROMPT_VERSION` và `analysisLabelsFit` khớp spec §7.1–§7.3. Còn lại MU-C3.
- D (dữ liệu): đã đọc `takeProfile`/`save`/`lost`, `recordAiAnalysis` qua `app.run` chịu khóa S2-2, `listAiAnalyses` suy CURRENT/STALE; đã chạy P2. `save` của AI luôn qua lệnh có kiểm, trích xuất không tự lưu. Còn lại MU-C1.
- G (guardrail): đã đọc schema V1, V2–V6, V7, luật thử lại (tối đa 2, tin G5 §5), STALE khi KYC đổi; đã chạy 598 test `packages/ai` xanh. Còn lại MU-C2.
- S (an toàn ranh giới): đã đọc `ai-tauri.ts` (lỗi lạ thành `AI_BAD_REQUEST`, không lộ key), `save` lọc đúng 4 trường (key không vào backup), trần 200 000/20 000 ký tự theo điểm mã, `openChatGpt` dùng địa chỉ hằng khớp Rust (`https://chatgpt.com/`), hiển thị output model và tin nhắn thủ công đều là chữ thuần/khung chỉ đọc, ghi chú KYC chỉ vào đầu vào trích xuất đúng spec. Đối chiếu kiểm key JS/Rust: JS nhận thì Rust nhận (không lệch từ chối sai hướng). Không thấy.
- P (hiệu năng): đã đo P3 và đối chiếu `perf-ref.json` (mục 4). Không thấy.
- B (bloat): đã chạy `tsc`, `lint:deps`, rà import (mục 4). Còn lại MU-C4.
- T (chất lượng test): đã chạy 783 test gói C xanh (`packages/ai` 598, app 185); đột biến M1 (bỏ miễn V5) bị 3 test giết, M2 (bỏ kiểm tin của app) bị 17 test giết; phủ `packages/ai` 100% theo chuẩn. Không thấy.
- A (trợ năng/i18n): đã đọc 6 tệp `.tsx` (vùng live, focus sau Đóng/Hủy, `role=alert/status`) và rà chuỗi Việt cứng (chỉ còn dấu `:` đã KNOWN). Không thấy.

## 7. Phụ lục

### Probe P1 — chi tiết V1 (`muse\C\p1-v1detail.mts`)

Chạy bằng `tsx` trong `packages/ai`. Kết quả:

```
--- evidence F0 ---
  V1 @ hypotheses[0].evidence[0]: sai định dạng
--- evidence F99 unknown ---
  V2 @ needs[0].evidence[0]: F99 không có trong đầu vào
--- missing needs ---
  V1 @ needs: sai kiểu, cần array
--- bad system enum ---
  V1 @ personalityNotes[0].system: giá trị không hợp lệ
--- hypotheses string ---
  V1 @ hypotheses: sai kiểu, cần array
```

### Probe P2 — phiên web sau khi thay dữ liệu (`muse\C\p2-websession-replace.mjs`)

Mở `AppData` thật trong Node, tạo KH đủ cổng `discovery`, mở phiên web, xuất rồi nhập lại cùng backup, dán đáp án mẫu. Kết quả:

```
input facts: F1,F2,F3,F4
generation before: 0
generation after: 1
saveChatGptAnswer after replace: {"kind":"saved","status":"ACCEPTED"}
rows: [{"state":"CURRENT","provider":"CHATGPT_WEB","attempts":1}]
```

### Probe P3 — hiệu năng (`muse\C\p3-perf.mjs`)

Nạp dữ liệu tải bằng `importBackup` trong Node rồi đo các hàm thuần. Kết quả:

```
importBackup: 900 ms
customers: 1481 | max facts in effect: 19
buildAnalysisInput x50: 0.04 ms/op
validateOutput(analysis, 19 facts) x50: 4.76 ms/op
paste chars: 16969
extractJson(17.0k chars) x20: 0.24 ms/op
checkWebAnswer(17.0k chars) x20: 0.88 ms/op
```

### Đột biến trên bản chép

- M1 (`muse\C\mut1`, bỏ miễn V5 trong `validator.ts`): chạy `validator-blocklists.test.ts` thật trên bản chép → 3 test đỏ, 99 xanh → bị giết.
- M2 (`muse\C\mut3`, bỏ kiểm tin của app trong `web.ts`): chạy `web.test.ts` thật trên bản chép → 17 test đỏ, 20 xanh → bị giết.
- (`muse\C\mut2` là bản dựng dở của M2, thiếu file prompt, đã thay bằng `mut3`.)

### Trạng thái cuối phiên

- `git -C C:\workspace\Project-2C-review-2 status --short` cuối phiên: trống (như đầu phiên).
- Giờ xong: 23:23 14/10/2026
