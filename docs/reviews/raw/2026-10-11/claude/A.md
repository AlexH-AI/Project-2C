# Review lại Phase 5 (vòng 2) — Claude, gói A: `packages/ai` + `packages/db` (phần AI) + domain

- **SHA:** `705ea7c` (đã kiểm `git rev-parse HEAD` = `705ea7c0e76d…` trước khi làm) · worktree `C:\workspace\Project-2C-review` · Home PC.
- **Reviewer:** Claude Opus 5.5, phiên sạch, không subagent. Không mở / liệt kê `deep-review-5-r2\codex\`. Gói A là gói đầu nên không có báo cáo Claude vòng 2 nào để đọc trước.
- **Không gọi AI thật:** chỉ dùng Mock adapter, `checkWebAnswer` thuần và DB sql.js trong bộ nhớ. Không đụng Credential Manager.
- **Probe:** ở `C:\workspace\deep-review-5-r2\claude\A\` (phụ lục). Chạy bằng Vitest của repo với config riêng (`vitest.probe.config.mjs`, root = worktree, test nằm ngoài repo). Các patch "gỡ sửa" / đột biến được áp vào worktree, chạy test, rồi `git checkout --` ngay. Cuối phiên `git status --short` của worktree **sạch**.

## 1. Bảng R

| DR5 | Issue | Kết luận | Bằng chứng (tái hiện cũ ra gì; test nào đỏ khi gỡ sửa) | Ghi chú |
|---|---|---|---|---|
| 49 (a) | #483 T-190 | **ĐÃ SỬA** (đường vòng 1 báo); còn 2 biến thể gần → CL2-A1, CL2-A2 | Tái hiện trên seed demo (seed 1, mốc 11/10/2026, 767 KH có phiên web): dán nguyên tin nhắn `web@1` cho ra **767 / 767 `OWN_MESSAGE`**, kể cả khi đổi xuống dòng sang CRLF (vòng 1: 39 ACCEPTED). Gỡ dòng `isOwnMessage` (`patch-r49-unfix.diff`) thì **7 test đỏ** ở `web.test.ts` ("the app's own message pasted back (DR5-49)": cả tin nhắn analysis / discovery, phần từ `=== ĐẦU VÀO ===`, phần tới trước đầu vào, CRLF, khoảng trắng quanh dòng khung, lần thử 2). Test khóa ví dụ prompt (`web.test.ts:344`) có. | Biến thể gần: dán lại **tin nhắn "Copy yêu cầu sửa"** ở lần thử 2 thì lưu REJECTED và đóng phiên (CL2-A1). Khung bị đổi NFD / NBSP / ZWSP / hai dấu cách thì vẫn **39 ACCEPTED**, như vòng 1 (CL2-A2). Câu trả lời có một dòng là khung thì bị chặn, nhưng chỉ ra câu báo và không tính lần thử, nên không hại (§3 trục E) |
| 13 | #485 T-192 | **ĐÃ SỬA** | Tái hiện vòng 1: `recordAiAnalysis` ACCEPTED với output `{summary:'Tóm tắt'}` cho ra `AI_ANALYSIS_INVALID`. `evidence` có `F99` (không có trong đầu vào) cũng `AI_ANALYSIS_INVALID`. Lệnh và luật 12–13 dùng chung `analysisLabelsFit` / `analysisContentFits` (`ai-analyses.ts:216–243`, `backup-validation.ts:379–383`). Vòng ghi → xuất → nhập với **1 430 dòng** do chính app sinh (767 Mock + 600 phiên web ACCEPTED / REJECTED với câu dán lạ: NUL, emoji 20 000 code point, surrogate lẻ, JSON lồng sâu, ký tự vô hình, cộng 63 dòng seed): **0 dòng bị lệnh từ chối, nhập lại `ok`**. Gỡ `analysisContentFits` khỏi `toRow` (`patch-r13-unfix.diff`) thì **2 test đỏ** (`refuses an analysis whose provider, attempts or outcome do not fit together`, `refuses an input that is not as the app sends it…`). Đột biến `lastIssues` → 0, `validator.at(-1)` → `at(0)`, bỏ kiểm `evidence ⊆ input`: đều bị giết (2 / 2 / 3 test đỏ) | Lệnh nhận ACCEPTED có `missingCategory` không phải hạng mục đang thiếu (V2 thì chặn). Đúng chữ spec §7.3 luật 3 (chỉ đòi `evidence`), không tính là phát hiện |
| 14 | #485 T-192 | **ĐÃ SỬA** | Probe D: lấy một file backup hợp lệ có đủ bảng (KH, phiên bản, ghi chú KYC, lịch hẹn, 2 phân tích), lần lượt chèn `\0` vào **từng** giá trị chữ (97 giá trị, mọi bảng / cột): **97 / 97 bị `BACKUP_INVALID`**. Đã xác nhận cơ chế: sql.js cắt chuỗi ngay khi bind (`'abc\0def'` lưu thành `abc`, `length` = 3). Gỡ kiểm NUL ở `valueOf` (`patch-r14-unfix.diff`) thì **3 test đỏ** (`VALUE: a rejected raw output / a model name / a meeting note with a NUL`) | Phía lệnh còn một chỗ lệch: `optionalText` không chặn NUL (CL2-A4, Nit, code có từ Phase 2–3) |
| 16 | #485 T-192 | **ĐÃ SỬA** | Ở lệnh: REJECTED với `attempts` = 1, `prompt_version` của chế độ khác, ACCEPTED kèm báo cáo lỗi ở lần thử cuối, `model` 101 ký tự, ChatGPT web thiếu `+web@`, Mock có `+web@1`, `model` chứa NUL, `attempts` = 3, `analysis@0`, `Analysis@1`: **10 / 10 `AI_ANALYSIS_INVALID`**. Ở nhập: 5 ca tương ứng sửa trên file đều **`BACKUP_INVALID`**. Gỡ ràng chéo (`patch-r16-unfix.diff`: bỏ so `mode`, bỏ trần 100, REJECTED lại nhận `attempts` 1) thì **4 test đỏ**. Bỏ neo `$` của regex `PROMPT_VERSION`: 1 test đỏ | `analysis@99`, `model` có khoảng trắng hai đầu: lệnh và nhập cùng nhận, đúng chữ spec |
| 35 | #485 T-192 | **ĐÃ SỬA** | `isIssue` (`ai-panel-view.ts:206–214`) kiểm `code` thuộc `VALIDATION_CODES`, `path` và `detail` là chuỗi. Test `ai-panel-view.test.ts:962` dựng `path` là object (như CX-D1), `code: 'V9'`, `detail: 3`, `null`. Gỡ về `isIssue` cũ (`patch-r35-unfix.diff`) thì **1 test đỏ** (đúng ca DR5-35). `validator_json` không phải mảng, `errors` không phải mảng, `attempt` không phải số: `attemptReports` trả rỗng, không ném | Đường hiển thị (chữ, focus) là của gói C |
| 15 (phần `kyc.ts` / db) | #490 T-196 | **ĐÃ SỬA** | Phía db không đổi, và không cần đổi: phương án (a) giữ định nghĩa P1. Probe trên lệnh thật: xác nhận lại cùng giá trị thì số phiên bản KYC giữ **2 → 2**, phân tích **CURRENT**, `factCodeTarget(F2)` = `{shown, F3}` (dữ kiện hiện hành). Sửa ngày sinh cùng năm: phiên bản giữ, CURRENT. Đổi giá trị thật: **STALE**, `F2` → `gone`. `KycFactRecord.seq` có từ trước (T-168B) | Ánh xạ nằm ở `kyc-view.ts:79` (`factInEffect`); phần panel / mức bằng chứng do gói C kiểm |
| 48 (phần `kyc.ts`) | #490 T-196 | **ĐÃ SỬA** | `KycVersionRecord.seq` trả `row.seq`. Backup có `seq` ×10 nhập xong đọc ra **[10, 20]**. Gỡ `seq: row.seq` thì **2 test đỏ** ở `kyc.test.ts` (kể cả ca DR5-48) | Ngoài danh sách gói A ở plan §4 (gói C), ghi thêm vì `kyc.ts` thuộc phạm vi A |
| — (T-202) | #500 | **ĐÃ SỬA** | `rg WEB_PROMPT_VERSION` trên toàn repo trừ `docs/reviews/**`: 0 kết quả (code, `CLAUDE.md`, tools). Luật `+web@` giờ nằm ở regex `PROMPT_VERSION` (`ai-analyses.ts:210`) | — |

## 2. Phát hiện

```
ID: CL2-A1
Mức: Low
Trục: R
Vị trí: packages/ai/src/web.ts:85–89, 111 (705ea7c)
Tình trạng: CONFIRMED
Liên quan: DR5-49 (a) · có từ trước, phần sửa #497 bỏ sót biến thể này
Mô tả: Ở lần thử 2, nếu RE dán lại tin nhắn "Copy yêu cầu sửa" của app (G5 §5) thay cho câu trả lời
  mới của ChatGPT, app coi đó là một câu trả lời không có JSON: V1, tính lần thử, lưu REJECTED vào
  `ai_analyses` (bảng chỉ thêm) và đóng phiên. Đây đúng là lỗi thao tác mà DR5-49 (a) sửa (clipboard
  còn tin nhắn của app), chỉ khác là ở bước thử lại. Tin nhắn thử lại không có dòng khung
  `=== … ===` nên `isOwnMessage` không nhận ra.
Tái hiện / bằng chứng: probes/r49-retry-and-false.test.ts. Dán BAD (V2) ở lần 1, rồi dán đúng
  `retryMessage` mà app đưa:
    paste retry message -> record REJECTED "Kết quả vừa rồi chưa đạt kiểm tra tự động với các lỗi sau:\n- V2 tại painPoints…"
Ảnh hưởng: RE dùng ChatGPT web, lần dán đầu sai, bấm "Copy yêu cầu sửa", dán vào ChatGPT nhưng quên
  copy câu trả lời mới. Hậu quả: một dòng REJECTED vĩnh viễn trong lịch sử, panel hiện băng "bị từ
  chối" với V1 "không có khối JSON", câu trả lời thật của ChatGPT không lưu được, phải mở phiên mới.
  CURRENT không bị thay (nhẹ hơn DR5-49). Đúng chữ spec §3.1 điểm 3 ("không có JSON → V1, có tính
  lần thử"), nhưng trái tinh thần quyết định Owner 10/10 ("dán tin nhắn ChatGPT web của app → từ
  chối tại khung, không tính lần thử").
Đề xuất: coi câu dán có dòng đầu của `RETRY_TEMPLATE` ("Kết quả vừa rồi chưa đạt kiểm tra tự động
  với các lỗi sau:") đứng riêng một dòng là `OWN_MESSAGE` (hoặc so với `retryMessage` của phiên);
  thêm nửa câu vào spec §3.1 điểm 3 (G1 nhỏ, Owner quyết). Cỡ ≈ 5 dòng SP + 2 test.
```

```
ID: CL2-A2
Mức: Low
Trục: R
Vị trí: packages/ai/src/web.ts:85–89 (705ea7c)
Tình trạng: CONFIRMED
Liên quan: DR5-49 (a) · mới do đợt sửa (PR #497: cách nhận diện chọn so nguyên dòng sau `trim()`)
Mô tả: Dòng khung chỉ được nhận ra khi khớp từng ký tự sau `trim()`. Khi tin nhắn đã qua một công cụ
  khác trước khi dán (NFD, NBSP thay dấu cách, ký tự vô hình ở đầu dòng, hai dấu cách), app không
  nhận ra, và kết quả giống hệt vòng 1: khối JSON đầu tiên là ví dụ của prompt, nên ACCEPTED ở các KH
  có đủ mã F trong ví dụ.
Tái hiện / bằng chứng: probes/r49-own-message.test.ts trên seed demo (767 phiên):
    whole / crlf      → OWN_MESSAGE 767
    nfd               → ACCEPTED 39, retry 728
    nbspInFrame       → ACCEPTED 39, retry 728
    doubleSpace       → ACCEPTED 39, retry 728
    zwsp (đầu dòng)   → ACCEPTED 39, retry 728
    quoted ("> ")     → retry 767
  Dòng ACCEPTED (bản NFD) đi qua `recordAiAnalysis` bình thường.
Ảnh hưởng: hiếm. Ctrl+V từ clipboard mà app vừa ghi thì giữ đúng từng ký tự (đã thử, 767 / 767 bị
  chặn). Chỉ gặp khi RE chuyển tin nhắn qua công cụ khác (Zalo, Word, email) rồi copy lại. Khi gặp
  thì hậu quả bằng DR5-49: CURRENT toàn "…", không xóa được. Riêng ca dán một phần không có dòng khung
  (từ "ĐỊNH DẠNG TRẢ LỜI" trở đi, cũng ra 39 ACCEPTED) là DR5-49 (b), KNOWN (#491, đợt G5).
Đề xuất: chuẩn hóa dòng trước khi so (NFKC, bỏ `\p{Cf}`, gộp mọi khoảng trắng kể cả NBSP thành một
  dấu cách, bỏ tiền tố trích dẫn `>`), dùng cùng cách chuẩn hóa mà đợt G5 định thêm cho V3–V6.
  Cỡ ≈ 3 dòng SP + 1 test bảng biến thể.
```

```
ID: CL2-A3
Mức: Nit
Trục: T
Vị trí: packages/ai/src/web.test.ts:276–279 (705ea7c)
Tình trạng: CONFIRMED
Liên quan: DR5-49 (a) · mới do đợt sửa (PR #497)
Mô tả: Ca "with spaces around a frame line" chỉ thêm khoảng trắng quanh `=== HƯỚNG DẪN ===`, còn dòng
  `=== ĐẦU VÀO ===` giữ nguyên, nên tin nhắn vẫn bị nhận ra qua dòng kia. Kết quả là `trim()` không
  được test ghim. Thứ tự hai kiểm `OWN_MESSAGE` / `TOO_LONG` cũng không được ghim.
Tái hiện / bằng chứng: mutate.mjs. `own-message-no-trim` (bỏ `.trim()`): web.test.ts 24 / 24 xanh.
  `own-message-after-length` (kiểm độ dài trước): 24 / 24 xanh. `own-message-lf-only` cũng sống,
  nhưng đó là đột biến tương đương nhờ `trim()`.
Ảnh hưởng: không ai gặp hôm nay. Chỉ là sửa sau này có thể làm mất `trim()` mà không test nào đỏ.
Đề xuất: ca đó thêm khoảng trắng / tab quanh **cả hai** dòng khung (hoặc cắt chỉ còn một dòng khung).
  Cỡ 1–2 dòng test.
```

```
ID: CL2-A4
Mức: Nit
Trục: D
Vị trí: packages/db/src/common.ts:33–36 (`optionalText`), dùng ở appointments.ts:235, 278, 309, 360 (705ea7c)
Tình trạng: CONFIRMED
Liên quan: DR5-14 · có từ trước (Phase 2–3: DR-49 thêm chặn NUL vào `cleanText` / `isLabel`, bỏ sót
  `optionalText`), vòng 1 bỏ sót
Mô tả: Nhập backup giờ từ chối NUL ở mọi bảng, nhưng lệnh ghi lịch hẹn vẫn nhận NUL ở `triggerNote`,
  `nextStep` và lý do dời lịch. sql.js cắt chuỗi ngay khi bind, nên chữ được lưu đã bị cắt mà không
  báo. Đây là chỗ lệch "lệnh ↔ nhập" về NUL mà plan §4 hỏi. Vòng xuất → nhập vẫn qua, vì chữ đọc ra
  không còn NUL.
Tái hiện / bằng chứng: probes/r13-14-16-db.test.ts, ca B:
    B triggerNote read back: "Gặp ở"            (gửi 'Gặp ở\0 hội thảo')
    B nextStep: command saved -> read back "Gửi" (gửi 'Gửi\0 bảng minh họa')
    B export has NUL: false · import: ok
Ảnh hưởng: gần như không ai gặp. Bàn phím không gõ được NUL; clipboard Windows (CF_UNICODETEXT) kết
  thúc chuỗi tại NUL nên dán cũng không đưa được NUL vào ô nhập. Không thuộc code Phase 5.
Đề xuất: `optionalText` ném `INVALID_TEXT` khi có NUL, như `cleanText`. Cỡ ≈ 2 dòng SP + 1 test.
  Gộp vào lần chạm sau của `common.ts`.
```

## 3. Đọc sâu diff sửa `0df3606..705ea7c` (phạm vi A) và quét lại Phase 5

Đã đọc trọn diff của 16 file ở `packages/` (400 dòng thêm / 71 dòng xóa) và phần `isIssue` của `ai-panel-view.ts`.

- `web.ts` (#497): ngoài CL2-A1 / A2 / A3 không thấy gì. `FRAME_LINES` lấy từ `WEB_WRAPPER.template`, mà template có test so nguyên văn với G5, và `.gitattributes` ép LF, nên một checkout CRLF không làm `FRAME_LINES` rỗng âm thầm. Kiểm `OWN_MESSAGE` chạy trước `TOO_LONG`: câu dán dài > 20 000 có dòng khung ra câu "tin nhắn của app". Cả hai ca đều không tính lần thử.
- `ai-analyses.ts` / `backup-validation.ts` (#499): hai hàm dùng chung đúng hợp đồng Issue #485. `lastIssues` đọc đúng dạng `{attempt, errors}` mà `analysisOutcome` ghi (`run.ts:308`). Báo cáo không đọc được (`{}`, `'x'`, `errors` không phải mảng) bị coi là "không lỗi" ở **cả hai** phía, nên không lệch. Nhập vẫn kiểm `validator_json` là JSON hợp lệ. Trên bảng `ai_analyses`, lệnh và nhập khớp nhau cột theo cột: `mode` / `gate_state` / `status` / `provider` / `reasoning` qua `toRow` hoặc CHECK; `model` qua `isLabel` + trần 100 ở cả hai; token qua `isTokenCount` hoặc `valueOf` + CHECK; `date` / `created_at` qua `validValue` khi nhập, còn lệnh tự sinh.
- `backup.ts` `valueOf` (#499): doc comment nói "a text read from the database never has one". Đã xác nhận đúng: sql.js cắt khi bind, nên DB không bao giờ chứa NUL.
- `kyc.ts` (#505): chỉ thêm `seq`. `loadProfile` của lệnh vẫn không có `seq` (chủ ý, để so bằng nhau).
- `run.ts` / `adapter.ts` (#503): token `null` khi một lần thử không có số đếm. `finishReason` được khai báo nhưng chưa dùng ở `ai`. Phần dùng `finishReason` để báo "trả lời bị cắt" là DR5-05 phần `ai`, KNOWN (#492).
- `schema.ts` (#501): chỉ xóa `WEB_PROMPT_VERSION`.
- Quét lại Phase 5 (`3e84ce8..705ea7c`, phạm vi A): đọc lại `schema.ts`, `run.ts:140–320`, `validator.ts`, `settings.ts`, `input.ts`, `evidence-level.ts`, `db/settings.ts`, `db/kyc.ts` (diff Phase 5), `backup-validation.ts:25–90, 365–405`. Không thấy lỗi mới ngoài các mục KNOWN (DR5-01…12, 17–19, #420, #455, #465).

## 4. Đã xét, không thấy

- **E — Edge case:**
  - Dán: rỗng, chỉ một dòng khung, tin nhắn + câu trả lời phía sau, câu trả lời + tin nhắn phía sau đều ra `OWN_MESSAGE`. Như vậy là đúng spec ("dán lại cả hay một phần"), RE xóa phần thừa rồi dán lại.
  - Câu trả lời thật có một dòng là khung (`=== ĐẦU VÀO ===` ở đầu, `=== HƯỚNG DẪN ===` dưới tiêu đề markdown): bị chặn với câu "tin nhắn của app", **không tính lần thử, không lưu**. RE xóa dòng đó là qua. Câu nhắc khung giữa dòng chữ thì không bị chặn (có test). Prompt đòi "chỉ một khối JSON", nên ChatGPT ít khi chép lại khung.
  - Câu dán dài: 20 triệu ký tự với 10 triệu dòng mất 495 ms trên webview, phần lớn do `Array.from` (KNOWN DR5-09). `isOwnMessage` trên 2 triệu ký tự / 1 triệu dòng mất 46 ms.
  - Vòng xuất → nhập với `raw_output` có surrogate lẻ, NUL (thành U+FFFD), 20 000 emoji, JSON lồng sâu: qua (probe roundtrip).
  - Phiên bản KYC có `seq` hở sau nhập: đọc đúng `seq`, lệnh ghi phiên bản kế tiếp là `max + 1` (test DR5-48).
- **G — Guardrail:** đợt sửa không đổi validator, blocklist hay prompt (`git diff 0df3606..705ea7c -- packages/ai/src/{validator,blocklists,text-match}.ts packages/ai/src/prompts` rỗng). `OWN_MESSAGE` chỉ từ chối thêm, không mở đường nào qua V1–V6. AI vẫn không có đường ghi KYC: `ai_analyses` chỉ có INSERT qua `recordAiAnalysis`. Ví dụ prompt qua validator là DR5-49 (b), KNOWN.
- **C — Hợp đồng:** code đúng Issue #483 / #485 / #490 / #500 và quyết định Owner 10/10. Spec §3.1 điểm 3 và §7.3 luật 2–3 đã ghi luật mới, khớp code (`PROMPT_VERSION`, trần 100, REJECTED ⇒ 2, báo cáo lần cuối không lỗi, NUL ở mọi bảng). Chuỗi `aiPanel.web.refused.OWN_MESSAGE` khớp nguyên văn Issue.
- **D — Dữ liệu:** lệnh chạy trong transaction, `toRow` ném trước khi INSERT. Nhập dựng DB mới, không chạm DB đang mở. 97 / 97 giá trị chữ có NUL bị từ chối. Ngoài CL2-A4, không còn đường nào lệnh nhận mà nhập từ chối (vòng 1 430 dòng của app; 12 dòng biên lệnh nhận đều nhập lại được).
- **S — An toàn:** tin nhắn web chỉ chứa đầu vào §6.1, không tên / mã KH. `raw_output` của REJECTED có thể chứa câu dán của RE, như trước, không mới. Tin nhắn thử lại chỉ chứa `detail` ≤ 40 ký tự của model. Không có key / URL trong `packages/ai`, `packages/db`.
- **P — Hiệu năng** (đo, probes/perf-*): luật 12–13 trên 10 000 dòng `ai_analyses` mất **139 ms** (≈ 14 µs / dòng). Nhập backup seed demo (63 phân tích) mất **764 / 707 / 668 ms**. Nhập seed + 1 430 phân tích (14,8 MB) mất **956 ms**. Không có vấn đề.
- **B — Thừa / lặp:** `tsc --noUnusedLocals --noUnusedParameters` trên `packages/ai`, `db`, `domain`: 0 lỗi. `AnalysisFields`, `analysisLabelsFit`, `analysisContentFits` chỉ export cho `backup-validation.ts`, không qua `index.ts`. `finishReason` chưa dùng: KNOWN (#492). Hằng 20 000 lặp: KNOWN (#455).
- **T — Test:** mọi phần sửa của A đều có test đỏ khi gỡ (§1). 4 / 4 đột biến ở `ai-analyses.ts` bị giết. Ở `web.ts` có 2 đột biến sống (CL2-A3) và 1 đột biến tương đương. Test dùng đồng hồ ghim, không phụ thuộc ngày thật.
- **A — Trợ năng / i18n:** gói A không có UI. Câu `OWN_MESSAGE` nằm trong `vi.ts:227`. `detail` của validator viết tiếng Việt cứng là chủ ý (gửi lại cho model).
- **KNOWN trong phạm vi A, chưa sửa:** ca tên sai `backup-invariants.test.ts:864`, `text-match.ts` `detail`, các mục #455. Không có mục "KNOWN đã sửa".

## 5. Bảng đếm

| Mức \ Trục | R | E | G | C | D | S | P | B | T | A | Cộng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Low | 2 (A1, A2) | | | | | | | | | | 2 |
| Nit | | | | | 1 (A4) | | | | 1 (A3) | | 2 |
| **Cộng** | 2 | | | | 1 | | | | 1 | | **4** |

Không có Critical / High / Medium. Cả 4 phát hiện đều CONFIRMED. Bảng R: 8 / 8 dòng ĐÃ SỬA, không HỒI QUY.

## 6. Phạm vi đã đọc

- Kế hoạch `common\plan.md`, `known.md`, `baseline.md`; tổng hợp vòng 1 (§1–§8, đọc trọn); `PROJECT-STATE.md` dòng 10/10; thân Issue #483, #485, #490, #500; spec `phase-5-ai.md` §3, §3.1, §6, §7; báo cáo vòng 1 `raw/2026-10-10/claude/A.md`, `B.md` §4.
- Code (`705ea7c`): `packages/ai/src/web.ts` (trọn), `prompts/retry.ts`, `prompts/analysis.ts`, `prompts/discovery.ts`, `schema.ts:30–156`, `run.ts:125–330`, `validator.ts` (trọn), `settings.ts` (trọn), `input.ts:60–132`; `packages/db/src/ai-analyses.ts` (trọn), `backup-validation.ts:1–90, 365–405`, `backup.ts:1–60, 180–195`, `common.ts:1–80`, `schema.ts:290–385`, `kyc.ts` (diff Phase 5), `settings.ts`, `seed.ts` (phần AI); `packages/domain/src/evidence-level.ts`, `kyc-catalog.ts:20–50`; `apps/desktop/src/routes/customers/ai-panel-view.ts:160–245, 420–470, 540–600`, `kyc-view.ts:60–110`, `apps/desktop/src/data/ai-analysis.ts:190–330`.
- Test: `web.test.ts` (trọn phần DR5-49), `ai-analyses.test.ts:1–110, 380–430`, diff `backup-invariants.test.ts`, `kyc.test.ts`, `run.test.ts`, `ai-panel-view.test.ts:940–990`.
- Diff `0df3606..705ea7c -- packages/` (16 file), diff `3e84ce8..705ea7c` của phạm vi A (danh sách 59 file, đọc các file nêu trên).

## 7. Phụ lục — nguồn probe (`C:\workspace\deep-review-5-r2\claude\A\`)

| File | Làm gì | Lệnh (từ worktree) |
|---|---|---|
| `vitest.probe.config.mjs` | config Vitest: root = worktree, `dir` = `probes\`, `globals` | (dùng chung) |
| `probes/r49-own-message.test.ts` | seed demo (seed 1, mốc 11/10/2026): mọi KH có phiên web; dán tin nhắn nguyên văn và 7 biến thể; ghi thử một dòng ACCEPTED bản NFD qua `recordAiAnalysis` | `node_modules/.bin/vitest run --config <A>\vitest.probe.config.mjs r49-own --silent=false --reporter=verbose` |
| `probes/r49-retry-and-false.test.ts` | dán lại tin nhắn thử lại ở lần 2; 4 câu trả lời có dòng khung | `… r49-retry …` |
| `probes/r13-14-16-db.test.ts` | A: sql.js cắt NUL khi bind · B: lệnh lịch hẹn với NUL · C: tái hiện DR5-13, 12 dòng biên, 10 ca DR5-16 ở lệnh, vòng xuất → nhập · D: NUL vào từng giá trị chữ của file (97), 5 ca DR5-16 ở nhập | `… r13 …` |
| `probes/r15-48-kyc.test.ts` | xác nhận lại cùng giá trị / ngày sinh cùng năm / đổi giá trị: số phiên bản, trạng thái, `factCodeTarget`; `seq` ×10 qua nhập | `… r15 …` |
| `probes/roundtrip-app-rows.test.ts` | 767 phân tích Mock + 600 dòng web (câu dán lạ) qua lệnh, xuất, nhập; đo thời gian nhập | `… roundtrip … --testTimeout=250000` |
| `probes/perf-import.test.ts` | thời gian nhập seed (3 lần); luật 12–13 trên 10 000 dòng | `… perf-import …` |
| `probes/perf-own-message.test.ts` | `checkWebAnswer` trên câu dán 20 000 ký tự → 20 triệu ký tự | `… perf-own …` |
| `patch-r49-unfix.diff`, `patch-r13-unfix.diff`, `patch-r16-unfix.diff`, `patch-r35-unfix.diff`, `patch-r14-unfix.diff` (+ `unfix-r14.mjs`) | gỡ từng phần sửa; áp, chạy test của package, rồi `git checkout --` ngay | xem §1 |
| `mutate.mjs <tên>` | 7 đột biến một chỗ (`last-issues-zero`, `last-issues-first`, `version-unanchored`, `evidence-subset-off`, `own-message-no-trim`, `own-message-lf-only`, `own-message-after-length`); chạy `ai-analyses.test.ts` + `backup-invariants.test.ts` hoặc `web.test.ts`, rồi `git checkout -- packages` | `node <A>\mutate.mjs <tên>` |

Kết quả gỡ sửa: DR5-49 → 7 test đỏ · DR5-13 → 2 · DR5-16 → 4 · DR5-14 → 3 · DR5-35 → 1 · DR5-48 → 2. Đột biến: 4 / 4 ở `ai-analyses.ts` bị giết (2 / 2 / 1 / 3 test đỏ); ở `web.ts` sống 3 / 3 (một tương đương).

## 8. Thời gian

Bắt đầu ≈ 01:15, kết thúc 01:40 (11/10/2026, giờ máy Home PC). `git status --short` của worktree cuối phiên: sạch.
