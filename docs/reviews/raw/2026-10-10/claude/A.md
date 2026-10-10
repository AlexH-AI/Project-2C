# Deep review Phase 5 — gói A (`packages/ai` + phần Phase 5 của `domain`) — Claude

- **SHA:** `0df3606fb783cc89b1b9c413c02810340e273a4f` (kiểm `git rev-parse HEAD` trong `C:\workspace\Project-2C-review` đầu phiên: khớp).
- **Phiên:** Claude Opus 5.5, phiên sạch, 10/10/2026, không subagent. Không đọc `deep-review-5\codex\`. Gói A là gói đầu, chưa có báo cáo Claude nào trước.
- **Không gọi AI thật:** mọi probe chạy trên mã nguồn `packages/ai` bằng Node 24 (hook resolve chép từ `tools/eval-ai.mjs`), Mock hoặc chuỗi tự dựng. Không chạy `pnpm eval:ai`, không đụng key.
- **Worktree:** patch thử "phá code" (30 đột biến) ghi đè file rồi khôi phục từng byte trong `finally`; `git status --short` sau mỗi lượt và cuối phiên: **sạch**.
- Nguồn probe: `C:\workspace\deep-review-5\claude\A\` (phụ lục).

## 1. Phạm vi đã đọc

| File (0df3606) | Dòng | Cách đọc |
|---|---|---|
| `packages/ai/src/blocklists.ts` | 1–92 (hết) | đọc từng dòng; so máy từng hàng cụm với G5 §8 (`probe-blocklist-g5.mjs`), 9 mẫu regex so tay |
| `packages/ai/src/text-match.ts` | 1–60 | đọc từng dòng + probe |
| `packages/ai/src/validator.ts` | 1–228 | đọc từng dòng + probe + đột biến |
| `packages/ai/src/schema.ts` | 1–159 | đọc từng dòng + probe |
| `packages/ai/src/extract-json.ts` | 1–36 | đọc + probe (output bẩn, thời gian) |
| `packages/ai/src/run.ts` | 1–394 | đọc từng dòng (runner, `converse`, `analysisOutcome`, trích xuất, kết nối) + đột biến |
| `packages/ai/src/web.ts` | 1–121 | đọc + probe + đột biến |
| `packages/ai/src/input.ts` | 1–132 | đọc + đột biến |
| `packages/ai/src/mock-adapter.ts`, `models.ts`, `settings.ts`, `errors.ts`, `adapter.ts`, `index.ts`, `raw.d.ts` | hết | đọc |
| `packages/ai/src/prompts/{analysis,discovery,extraction,retry,connection}.ts` | hết | đọc; chữ prompt do `prompts.test.ts` so với G5 |
| Test của `packages/ai/src/**` | lướt tên ca toàn bộ; đọc kỹ `validator-blocklists.test.ts`, `prompts.test.ts`, `web.test.ts:72–124`, `test-support.ts` | để biết phủ gì |
| `packages/domain/src/evidence-level.ts` | 1–52 | đọc + đột biến (B09, B11) |
| `packages/domain/src/kyc-fact.ts` | 1–57 | đọc; so với bản cũ `packages/db/src/kyc.ts@3e84ce8:373–392` và wrapper mới `packages/db/src/kyc.ts:377` |
| `packages/domain/src/kyc-gate.ts`, `kyc-catalog.ts` (cờ `core` / `fromProfile`) | phần liên quan | để kiểm đầu vào AI |
| Chỗ nối (chỉ để kiểm hợp đồng, không review sâu): `apps/desktop/src-tauri/src/ai.rs:27–200`, `apps/desktop/src/data/ai-tauri.ts:1–70`, `packages/db/src/ai-analyses.ts:140–186`, `packages/db/src/schema.ts:313, 381`, `packages/db/src/common.ts:21`, `packages/db/src/kyc.ts:95–135` | | |
| Spec: `docs/design/phase-5-ai.md` (hết), `docs/design/phase-5-prompts.md` (hết), `docs/metrics/ai-eval-2026-10-10.md` (bảng + E10, X01) | | |

Chạy: `vitest run packages/ai packages/domain/src/evidence-level.test.ts packages/domain/src/kyc-fact.test.ts` → 15 file, **281 test xanh** (0,73 s). `tsc --noEmit --noUnusedLocals --noUnusedParameters` cho `packages/ai` và `packages/domain`: **0 lỗi**.

## 2. Phát hiện

### CL-A1 — V6 chặn nhầm "quyết định số …" và "luật" + chữ hoa (gồm "KH"), ngay trên bản có dấu

```
ID: CL-A1
Mức: Low
Trục: G
Vị trí: packages/ai/src/blocklists.ts:86 (mục "quyết định số"), :83 (mẫu `luật <Hoa>`) — chép đúng G5 §8.4
Tình trạng: CONFIRMED (bằng chứng mới cho mục KNOWN "G5 chặn nhầm câu thường (#420)")
```

- **Mô tả:** Hai mục V6 khớp câu thường mà **không** qua bản bỏ dấu, nên hướng sửa trong KNOWN ("Bỏ dấu: không" cho vài mục, `(?!\s*kiện)` cho khoản–Điều) không chạm tới:
  1. Cụm `quyết định số` khớp mọi "quyết định số tiền / số lượng / số năm…", câu rất tự nhiên ở `nextBestActions` / `discoveryStrategy`.
  2. Mẫu `(luật|Luật|LUẬT)\s+\p{Lu}` khớp "luật" đứng trước **mọi** từ viết hoa. Prompt bắt model gọi khách là **"KH"** (quy tắc 11 / 12), nên "kỷ luật KH…", "quy luật KH…" bị chặn; cả câu viết hoa toàn bộ "LUẬT SƯ" (C16 chỉ đạt vì "sư" viết thường).
- **Tái hiện:** `node probe-validator.mjs` (phụ lục), phần "false-block":
  - `"Hỏi KH đã quyết định số tiền dành cho học phí chưa (F1)"` → `V6: có "quyết định số"`
  - `"Làm rõ KH đã quyết định số lượng con muốn hỗ trợ du học chưa"` → `V6: có "quyết định số"`
  - `"KH có dấu hiệu giữ kỷ luật KH tự đặt khi chi tiêu"` → `V6: có "luật K"`
  - `"Tìm hiểu cách KH nhìn quy luật Thị trường"` → `V6: có "luật T"`
  - `"HỎI KH ĐÃ CÓ LUẬT SƯ GIA ĐÌNH CHƯA"` → `V6: có "LUẬT S"`
- **Ảnh hưởng:** câu thường của model bị V6 → thử lại (thêm ~20–40 s, token), lặp lại → REJECTED. Không lọt dữ liệu, không ghi sai.
- **Đề xuất (G5, không sửa code riêng):** `quyết định số` → chỉ chặn khi theo sau là số / số hiệu (`quyết định số\s*\d`); mẫu `luật` thêm `(?!KH\b|RE\b)` hoặc đòi từ hoa sau "luật" không phải chữ viết tắt toàn hoa; ca kiểm mới vào G5 §8.5. Cỡ: ~10 dòng code + test, tăng version danh sách chặn.

### CL-A2 — Thêm các ca chặn nhầm qua bản bỏ dấu và qua mục danh sách quá rộng

```
ID: CL-A2
Mức: Low
Trục: G
Vị trí: packages/ai/src/blocklists.ts:20, 27, 28, 33, 40, 63, 86 (chép đúng G5 §8.1–§8.4)
Tình trạng: CONFIRMED (bằng chứng mới cho KNOWN "G5 chặn nhầm câu thường (#420)" — các cụm dưới chưa có trong sổ)
```

- **Mô tả:** Ngoài các ca KNOWN ("để chốt", "báo mình", "khả năng kỹ", "điểm sơ", "nhóm C", "chốt được", "khoản 2 điều kiện"), probe tìm thêm:

| Câu (đúng nghĩa thường) | Kết quả | Vì sao |
|---|---|---|
| "KH có thể gắn bó với đơn vị cũ **do tin cậy** người tư vấn" | V3 "độ tin cậy" | bỏ dấu "do tin cay" |
| "KH có thể cần thời gian **suy nghĩ quyết** định" | V6 "nghị quyết" | bỏ dấu "nghi quyet" |
| "KH có **khả năng kỷ** luật tài chính tốt" | V3 "khả năng ký" | bỏ dấu "kha nang ky" |
| "RE **bảo viết** lại mục tiêu cho rõ" | V4 "bảo việt" | bỏ dấu "bao viet" |
| "KH thích **nhóm màu** trung tính" / "Chuẩn bị **nhóm mẫu** câu hỏi" | V5 "nhóm máu" | bỏ dấu "nhom mau" |
| "Làm rõ **điều 2** vợ chồng KH còn băn khoăn" | V6 "điều 2" | mẫu `điều\s+\d+` |
| "KH có thể **sẵn sàng mua** nhà trong năm 2027 (F1)" | V3 "sẵn sàng mua" | mục danh sách |
| "**Tiềm năng mua** thêm bất động sản cho con" | V3 "tiềm năng mua" | mục danh sách |
| "Con KH cần cải thiện **điểm số** để du học" / "lo **chấm điểm** đầu vào đại học" | V3 | mục danh sách |
| "Hỏi tài khoản **liên kết chung** của hai vợ chồng" | V4 | mục danh sách |

- **Mâu thuẫn trong G5 (trục C phụ):** G5 §8.1 ghi chú bỏ "sẽ mua" khỏi danh sách **vì trùng mục tiêu thật "sẽ mua nhà năm 2027"** (ca C15), nhưng "sẵn sàng mua (nhà)" và "tiềm năng mua (bất động sản)" cùng dạng lại bị chặn. Mục tiêu mua nhà / học phí của con là dữ kiện `GOALS` thường gặp.
- **Tái hiện:** `node probe-validator.mjs`, phần "false-block" (đầu ra nguyên văn ở §6).
- **Ảnh hưởng:** như CL-A1: thử lại / REJECTED oan, nhiều nhất ở `nextBestActions` và `themes`.
- **Đề xuất (G5):** gom vào lần sửa danh sách chặn của mục KNOWN: "độ tin cậy", "nghị quyết", "bảo việt", "nhóm máu" → bỏ dấu "không" (giữ bản có dấu); "khả năng ký" → thêm "Bỏ dấu: không" như ứng viên KNOWN; "sẵn sàng mua", "tiềm năng mua" → chỉ chặn khi theo sau là từ chỉ sản phẩm / HĐ, hoặc bỏ như "sẽ mua"; "điểm số", "chấm điểm" → "chấm điểm KH", "điểm số KH"; thêm ca vào G5 §8.5. Cỡ: < 50 dòng.

### CL-A3 — V3–V6 lọt với ký tự toàn độ rộng, ký tự vô hình, nối từ, homoglyph

```
ID: CL-A3
Mức: Low
Trục: G
Vị trí: packages/ai/src/text-match.ts:21–24 (chuẩn hóa NFC + `\s+`), blocklists.ts:14 (`char('%')`), :79–89 (`\d`)
Tình trạng: CONFIRMED
```

- **Mô tả:** Chuẩn hóa G5 §7 là NFC, chữ thường, gộp `\s+`. Các biến thể sau không bị chuẩn hóa nên lọt:
  - `％` (U+FF05), `﹪` (U+FE6A), `‰`: G5 chặn "`%` ở bất kỳ đâu" nhưng code (đúng chữ G5) chỉ so ký tự ASCII. Ba model trong `AI_MODELS` (GLM, Kimi, DeepSeek) là model gốc Trung Quốc, có lúc viết dấu câu toàn độ rộng.
  - Chữ số toàn độ rộng / Ả Rập: "Theo Điều ３５", "Điều ٣٥" (regex `\d` với cờ `u` chỉ nhận 0–9).
  - Ký tự vô hình giữa cụm: "Xác\u200Bsuất", "Xác\u200Dsuất" (U+200B / U+200D không thuộc `\s`).
  - Nối bằng `-` / `_`: "Xác-suất cao", "xác_suất cao"; "Theo Nghị-định mới"; "Theo Đ.35 Luật".
  - Homoglyph Cyrillic "AIА"; chữ hoa lẫn "LuẬt Đất đai" (mẫu `luật` chỉ nhận 3 dạng hoa / thường).
  - Không lọt: NBSP, xuống dòng, tab, NFD, chữ hoa thường thông thường, soft hyphen trong "Pru\u00ADdential" (bị "pru" bắt).
- **Tái hiện:** `node probe-validator.mjs`, phần "bypass": 12 / 23 biến thể `PASS` (đầu ra §6).
- **Ảnh hưởng:** model thật hiếm khi viết các dạng này một cách tự nhiên trừ `％`; prompt injection qua ghi chú KYC không tới được phân tích (phân tích chỉ gửi dữ kiện), còn câu trả lời dán ChatGPT web do chính RE dán. Rủi ro chính: `％` lọt vào phần RE đọc. R1 eval (0 vi phạm) không phủ các dạng này.
- **Đề xuất (G5 §7, đổi cách so khớp):** thêm bước NFKC (gom `％`, chữ số toàn độ rộng) và bỏ `\p{Cf}` trước khi tạo ba bản; hoặc tối thiểu thêm `％`, `﹪` vào V3. Cỡ: ~10 dòng + ca kiểm.

### CL-A4 — Câu trả lời bị cắt (hết `max_tokens`) bị đọc thành một phần tử con, lỗi V1 sai chỗ

```
ID: CL-A4
Mức: Low
Trục: C
Vị trí: packages/ai/src/extract-json.ts:10–20; hệ quả ở run.ts:306 (`output` của REJECTED) và prompts/retry.ts:47
Tình trạng: CONFIRMED
```

- **Mô tả:** `extractJson` bỏ qua `{` không đóng và thử `{` kế tiếp. Với một câu trả lời bị cắt giữa chừng (khối ngoài không bao giờ đóng), `{` đầu tiên **đóng được** là một phần tử bên trong (`{"text": …, "evidence": […]}`), nên:
  1. V1 báo 6 lỗi "`hypotheses`: sai kiểu, cần array"… thay vì "không có khối JSON"; message thử lại (G5 §5) gửi những lỗi này cho model, không nói câu trả lời bị cắt.
  2. Lần 2 cũng bị cắt → `REJECTED`, `output_json` = phần tử con đó (spec §7.1: "output đã parse của lần thử cuối"), và dòng "Lần phân tích dd/mm bị loại: <lý do đầu tiên>" (§9.1) hiện "V1 hypotheses: sai kiểu, cần array".
- **Tái hiện:** `node probe-truncated.mjs`:
  ```
  parsed = {"text":"KH có thể ưu tiên con","evidence":["F1"]}
  issues = [ 'V1 hypotheses: sai kiểu, cần array', … 'V1 nextBestActions: sai kiểu, cần array' ]
  REJECTED output_json = {"text":"KH có thể ưu tiên con","evidence":["F1"]} | status REJECTED
  ```
- **Ảnh hưởng:** thực tế có thể gặp: eval 10/10 đo token ra tới **6 632** (E17), **6 151** (E04) trên trần `maxTokens` **8 000** (G5 §1), model suy luận còn tính token suy luận vào trần. Không mất / hỏng dữ liệu; chỉ sai lý do hiển thị và message thử lại kém hữu ích.
- **Đề xuất:** khi `{` ngoài cùng đầu tiên không đóng, chỉ thử các `{` nằm **ngoài** nó (tức là dừng), báo V1 "khối JSON chưa đóng (trả lời bị cắt?)". Spec §6.1 "khối JSON đầu tiên" đọc là khối cấp ngoài — nếu Owner muốn giữ cách đọc hiện tại thì ghi rõ vào spec. Cỡ: ~20 dòng + test. Gộp với CL-A5.

### CL-A5 — `extractJson` chạy O(n²) khi có nhiều `{` không đóng

```
ID: CL-A5
Mức: Low
Trục: P
Vị trí: packages/ai/src/extract-json.ts:10–36
Tình trạng: CONFIRMED (đo)
```

- **Mô tả:** mỗi `{` không đóng làm `closingBrace` quét tới cuối chuỗi; chạy trên luồng chính của webview (cả nút "Kiểm tra và lưu" ChatGPT web).
- **Số đo** (`node probe-extract.mjs`, Node 24, Home PC):

| Nội dung | Độ dài | Thời gian |
|---|---|---|
| `"{"` × 8 000 | 8 000 | 53 ms |
| `"{"` × 20 000 (trần dán ChatGPT web) | 20 000 | 326 ms (qua `checkWebAnswer`: 334 ms) |
| `'{"'` × 10 000 | 20 000 | 251 ms |
| `"{"` × 32 000 | 32 000 | 828 ms |
| `"{"` × 200 000 | 200 000 | **35 822 ms** |

  Rust nhận thân trả lời tới 2 MB (§5.2); trên thực tế `content` bị `max_tokens` (8 000 token) giới hạn ở vài chục nghìn ký tự, và model thường không sinh dãy `{` dài. Câu trả lời bình thường lớn nhất (35 phần tử × 300 ký tự, 12 453 ký tự): lấy JSON + V1–V6 **2,70 ms**.
- **Ảnh hưởng:** chỉ với output suy biến; tệ nhất vài trăm ms tới vài giây treo UI.
- **Đề xuất:** quét một lượt với ngăn xếp vị trí `{` (O(n)), hoặc dừng như CL-A4. Cỡ: ~20 dòng.

### CL-A6 — Test không đỏ với 4 / 30 đột biến

```
ID: CL-A6
Mức: Low
Trục: T
Vị trí: extract-json.ts:29; validator.ts:121; blocklists.ts:51 (mẫu MBTI); input.ts:71
Tình trạng: CONFIRMED (đột biến tạm, đã khôi phục)
```

- **Mô tả / bằng chứng** (`node mutate.mjs`, `node mutate2.mjs`; 30 đột biến, 26 bị giết):

| Đột biến sống sót | Nghĩa |
|---|---|
| M4 `extract-json.ts`: bỏ `if (char === '\\') i++` | không ca nào có `\"` trong chuỗi rồi `}` / `{` sau đó; bỏ xử lý escape → `{"t":"a \" } b"}` cắt sai → V1 oan |
| M9 `validator.ts:121`: bỏ `normalize('NFC')` của `collapseSpaces` | không ca nào có ghi chú NFC + trích dẫn NFD (hoặc ngược lại) |
| M13 `blocklists.ts`: mẫu MBTI chạy trên bản gốc chữ HOA thay vì bản có dấu chữ thường | ca chỉ có "INTJ", "ENFP-A" viết hoa; "intj" viết thường không được kiểm |
| M18 `input.ts:71`: tuổi = năm **xác nhận** − năm sinh thay vì năm **phân tích** − năm sinh | mọi fixture xác nhận năm 2026 = năm `TODAY` (`test-support.ts:11, 18`), nên G5 §1.1 "năm phân tích − năm sinh" không được ghim |

  Đột biến bị giết (để đối chiếu): kiểm Hủy trước thử lại, cộng token hai lần, cắt `raw_output` theo code point, dán rỗng / > 20 000, runner `busy` / release, V2 `missingCategory`, bỏ lọc `superseded`, 29/02, gộp khoảng trắng, `reasoning` theo model, max 300 / 20, max / min của discovery, `evidence` ≥ 1 ở `personalityNotes`, V7 `fromProfile`, V2 evidence, provider `CHATGPT_WEB`, miễn V5 chỉ ở `personalityNotes`, cờ `conflict`, mốc "mới" `>=`, gói sai → `GO`, Mock theo `fields`.
- **Đề xuất:** 4 ca test, ~40 dòng test: chuỗi có `\"` kèm ngoặc; trích dẫn NFD; "intj" viết thường ở khối khác `personalityNotes`; dữ kiện năm sinh xác nhận năm trước `TODAY`.

### CL-A7 — Chuỗi chỉ có ký tự vô hình đạt schema và V7; chuỗi NFD bị tính dài hơn

```
ID: CL-A7
Mức: Nit
Trục: E
Vị trí: packages/ai/src/schema.ts:87 (`text`), :147; domain/src/kyc-fact.ts:33–42
Tình trạng: CONFIRMED
```

- **Mô tả:** `z.string().trim().min(1)` không coi U+200B là khoảng trắng, nên `text: "\u200B"` đạt V1 (một dòng trống ở panel) và trích xuất `value: "\u200B"` qua V7 (`normalizeKycValue` cũng nhận) thành đề xuất giá trị trống. Ngược lại schema không chuẩn hóa NFC trước khi đếm: 250 ký tự hiện ra viết ở NFD = 302 code point → V1 "quá 300 ký tự".
- **Tái hiện:** `node probe-schema.mjs`: "text only zero-width space → PASS", "text value only ZWSP → kept", "text 250 NFC chars written NFD (302 units) → V1 needs[0].text: quá 300 ký tự".
- **Ảnh hưởng:** model gần như không sinh các dạng này; RE thấy ô trống ở hộp 3f trước khi lưu.
- **Đề xuất:** `z.preprocess` NFC + coi chuỗi chỉ gồm `\p{Cf}`/khoảng trắng là rỗng (đổi schema → nạp lại dữ liệu giả lập, R2-02). Cỡ nhỏ.

### CL-A8 — Số mã `evidence` và độ dài mã không giới hạn: message thử lại, `validator_json` phình

```
ID: CL-A8
Mức: Nit
Trục: E
Vị trí: packages/ai/src/schema.ts:38, 91–93; validator.ts:92
Tình trạng: CONFIRMED (cơ chế); hậu quả chặn chỉ khi output suy biến
```

- **Mô tả:** `evidence` không có `max`, `FACT_CODE` không giới hạn độ dài; mỗi mã không có trong đầu vào sinh một issue V2 và detail chép nguyên mã (khác quy tắc 40 ký tự của G5 §5 cho chữ model viết).
- **Số đo** (`node probe-perf.mjs`, `probe-schema.mjs`): 100 mã sai → 100 issue, message thử lại 6 218 ký tự; **2 000 mã sai → message 124 218 ký tự, `validator_json` ≈ 171 991 ký tự**. Trên ~3 000 mã, lần thử 2 vượt trần 200 000 ký tự của Rust (`ai.rs:29`) → `AI_BAD_REQUEST` (thông báo "lỗi lập trình"), không lưu gì. Một mã `F` + 500 chữ số được chép nguyên vào detail.
- **Ảnh hưởng:** chỉ khi model suy biến (2 000 mã ≈ 16 000 ký tự output, sát trần `max_tokens`).
- **Đề xuất:** `evidence.max(<số dữ kiện tối đa>)` hoặc gộp mọi mã sai của một phần tử vào một issue; cắt mã trong detail bằng `quoted`. Cỡ nhỏ.

### CL-A9 — Ghi chú KYC rất dài cho ra `AI_BAD_REQUEST` ("lỗi lập trình") thay vì lỗi dữ liệu

```
ID: CL-A9
Mức: Nit
Trục: C
Vị trí: packages/ai/src/input.ts:123–132 (`buildExtractionInput`), run.ts:189–192; trần ở ai.rs:29, 138–155; db/src/kyc.ts:99–110 (ghi chú không có trần độ dài)
Tình trạng: CONFIRMED (tính toán)
```

- **Mô tả:** spec §5.3 xếp `AI_BAD_REQUEST` là lỗi lập trình (thông báo chung), nhưng dữ liệu người dùng chạm được: ghi chú KYC không có trần độ dài, và trích xuất gửi nguyên văn.
- **Bằng chứng:** `node probe-size.mjs`: phần cố định (system + `fields`) = 2 514 ký tự → ghi chú > **197 486** ký tự bị Rust từ chối ngay lần 1.
- **Ảnh hưởng:** gần như không gặp (ghi chú ~200 000 ký tự).
- **Đề xuất:** tắt nút "AI trích xuất" kèm chú thích khi ghi chú vượt trần (như "Ghi chú quá ngắn"), hoặc chấp nhận và ghi vào spec. Cỡ nhỏ.

## 3. Bảng đếm mức × trục

| Mức \ Trục | E | G | C | D | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | | 0 |
| High | | | | | | | | | | 0 |
| Medium | | | | | | | | | | 0 |
| Low | | 3 (A1, A2, A3) | 1 (A4) | | | 1 (A5) | | 1 (A6) | | 6 |
| Nit | 2 (A7, A8) | | 1 (A9) | | | | | | | 3 |
| **Tổng** | 2 | 3 | 2 | 0 | 0 | 1 | 0 | 1 | 0 | **9** |

## 4. Đã xét, không thấy

- **E — Edge case:** rỗng / một phần tử / quá dài ở mọi khối (đếm `min`/`max` của schema khớp spec §6.2 từng khối, đột biến N1–N3, M16–M17 bị giết); `missingCategory: null`, `evidence: null`, `personalityNotes: null` → V1 có thử lại (đúng chữ spec "`missingCategory?`"; eval 10/10 không có ca nào hỏng vì `null`); 29/02 và mốc "mới" đúng B09–B11 (M11, N9 bị giết); Hủy trước khi gọi, Hủy giữa hai lần thử, lỗi ở lần 1 / lần 2, job ném đồng bộ, listener ném, hai `run` chồng nhau → `AI_BUSY` không gọi adapter (đọc `run.ts:72–121, 183–212` + test `run.test.ts:329–476` + đột biến M1, M7, M14 bị giết). Tải lại webview / thay DB khi đang chạy: runner nằm trong app, không thuộc gói A → gói D / F. Đầu vào: dữ kiện `superseded` không gửi (M10), tuổi thay năm sinh, `conflictWarnings` theo nhãn; năm sinh lớn hơn năm phân tích không xảy ra vì `birthYear` lấy từ ngày sinh hồ sơ.
- **G — Guardrail:** mọi hàng cụm của G5 §8.1–§8.4 có trong `blocklists.ts`, đúng cột "Bỏ dấu" (`probe-blocklist-g5.mjs`: 0 lệch, không có hàng thừa); 9 mẫu regex/ký tự so tay với G5 (gồm `\b` → ranh giới Unicode, lookbehind "pháp"); V5 miễn chỉ ở `personalityNotes`, V3 / V4 / V6 vẫn áp (C9c); V3–V6 không áp cho `evidence` / `missingCategory` / `system`; V7 không bao giờ giữ `birthYear` / `gender` kể cả khi danh sách gửi đi có (N4); thử lại đúng 1 lần, lần 2 sai → REJECTED (đọc `retry.ts:47–51`, `web.ts:98–121`); chữ prompt, message thử lại, Kiểm tra kết nối, `web@1` do test so nguyên văn với G5; `ai` không import `db` nên không ghi được dữ liệu KYC, trích xuất chỉ trả đề xuất (`run.ts:364–378`). Khóa thừa trong output bị zod bỏ (kể cả khóa chứa cụm bị chặn), không vào `output_json` của ACCEPTED (`probe-schema.mjs`: "parsed output keeps extra key? false").
- **C — Hợp đồng:** `sessionId` 32 hex khớp `[A-Za-z0-9-]{1,64}` của Rust; `maxTokens` 8 000 / 4 000 / 64 đúng G5 §1; `reasoning` `DEFAULT` → `null`, mức gửi viết thường ở `ai-tauri.ts:69`; `opencodePlan` thiếu / sai → `GO`, model không nhận `reasoning_effort` → `DEFAULT` (`settings.ts`); `prompt_version` web `<mode>@1+web@1`; `AI_OPEN_BROWSER` cố ý nằm ngoài `AI_ERROR_CODES` (có `tauri-contract.test.ts:192`); `normalizeKycValue` chuyển sang `domain` giữ hành vi cũ (so `db/kyc.ts@3e84ce8:373–392`; wrapper `db/kyc.ts:377` vẫn ném `INVALID_TEXT` / `INVALID_KYC_VALUE` như trước).
- **D — Dữ liệu:** `ai` không ghi DB. `raw_output` cắt theo code point khớp `length()` của SQLite (`db/schema.ts:381`) và trần dán ChatGPT web; `EMPTY_RAW_OUTPUT` chỉ cho chuỗi rỗng, `db` không cắt khoảng trắng khi kiểm "không rỗng" nên chuỗi chỉ có khoảng trắng vẫn lưu được.
- **S — An toàn:** đầu vào phân tích không có tên, mã KH, RE, ghi chú, lịch hẹn, HĐ (đọc `input.ts`, test `run.test.ts:319`); đầu vào là `JSON.stringify` nên giá trị dữ kiện / ghi chú không phá được cấu trúc message hay khung `web@1` (`buildWebMessage` thay một lượt, `$` không bị hiểu); không có key / URL / header trong `packages/ai` (Settings bỏ qua khóa lạ, `AiError` chỉ giữ 200 code point thông điệp server). Giá trị dữ kiện là chữ tự do RE nhập nên có thể chứa tên người — spec §6.1 cho gửi giá trị dữ kiện, chỉ ghi nhận. Hiển thị output (HTML trong `text` / `value`, vd. `<img onerror>` qua được V7) là việc của UI → gói D.
- **P — Hiệu năng:** V1–V6 trên output lớn nhất 2,70 ms / câu trả lời; còn lại ở CL-A5.
- **B — Thừa / lặp:** `tsc --noUnusedLocals --noUnusedParameters` 0 lỗi; các export chỉ dùng trong gói (`AI_ERROR_CODES`, `AI_MODES`, `AI_PROVIDERS`, `FACT_CODE`, `extractionOutputSchema`, `VALIDATION_CODES`, `EXTRACTION_FIELDS`, `filterExtraction`, `buildExtractionInput`, `EMPTY_RAW_OUTPUT`, `AI_OPENCODE_PLANS`, `buildWebMessage`, `MAX_RAW_OUTPUT`) phần lớn là hằng sinh kiểu hoặc đã KNOWN (#455 phạm vi export của `run.ts`); lặp `isoDate`, `collapseSpaces`, `newSessionId`, hằng 20 000: KNOWN.
- **T — Test:** ngoài CL-A6, 26 / 30 đột biến bị giết; test không phụ thuộc ngày thật (`TODAY` ghim), Mock không ngẫu nhiên.
- **A — Trợ năng / i18n:** gói A không có UI. Chi tiết validator viết tiếng Việt cứng là chủ ý (gửi lại cho model, G5 §5), hiển thị ở panel → gói D.
- Ghi chú để gói D / F kiểm (không phải phát hiện của gói A): `checkWebAnswer` thuần, gọi hai lần với cùng phiên cho hai `record` → chống bấm đúp "Kiểm tra và lưu" phải ở UI; Mock trích "2 cháu" thành `childrenCount` (chỉ Mock, RE xác nhận).

## 5. Phụ lục — nguồn probe (trong `C:\workspace\deep-review-5\claude\A\`)

| File | Làm gì | Lệnh |
|---|---|---|
| `hooks.mjs` | hook resolve như `tools/eval-ai.mjs` để Node 24 nạp `.ts` không đuôi; hằng `REPO` trỏ worktree | (được import) |
| `probe-validator.mjs` | 23 biến thể lọt + 30 câu thường qua `validateOutput('analysis', …)` | `node probe-validator.mjs` |
| `probe-blocklist-g5.mjs` | so máy từng hàng cụm G5 §8 với `row(<cờ>, '…')` của `blocklists.ts` | `node probe-blocklist-g5.mjs` |
| `probe-extract.mjs` | output bẩn (fence, `{}` trước, hai khối, mảng, BOM, nháy cong) + đo thời gian `extractJson` / `checkWebAnswer` | `node probe-extract.mjs` |
| `probe-truncated.mjs` | câu trả lời bị cắt → khối được chọn, issue V1, `output` của REJECTED | `node probe-truncated.mjs` |
| `probe-schema.mjs` | `null` ở khóa tùy chọn, chuỗi vô hình, NFD, khóa thừa, `evidence` dài; V7 với trích dẫn / giá trị biên | `node probe-schema.mjs` |
| `probe-perf.mjs` | thời gian V1–V6 trên output lớn nhất; cỡ message thử lại và `validator_json` với 100 / 2 000 mã sai | `node probe-perf.mjs` |
| `probe-size.mjs` | trần độ dài ghi chú trước khi chạm 200 000 ký tự của Rust | `node probe-size.mjs` |
| `mutate.mjs`, `mutate2.mjs` | 30 đột biến một dòng trên `packages/ai` / `domain`, chạy `vitest run packages/ai packages/domain/src/evidence-level.test.ts`, khôi phục từng byte trong `finally` | `node mutate.mjs [Mx]`, `node mutate2.mjs` |

## 6. Đầu ra nguyên văn `probe-validator.mjs` (rút gọn cột)

```
--- bypass candidates (should be blocked) ---
fullwidth percent U+FF05   "KH có 70％ khả năng"            PASS
small percent U+FE6A       "KH 70﹪"                        PASS
per mille ‰                "KH 700‰"                        PASS
ZWSP inside "xác suất"     "Xác\u200Bsuất KH đồng ý"        PASS
ZWJ inside "xác suất"      "Xác\u200Dsuất KH đồng ý"        PASS
soft hyphen "prudential"   "Pru\u00ADdential"               V4:có "pru"
NBSP "xác suất"            "Xác\u00A0suất cao"              V3:có "xác suất"
hyphen "xác-suất"          "Xác-suất cao"                   PASS
underscore "xác_suất"      "xác_suất cao"                   PASS
Cyrillic а in AIA          "Rà hợp đồng AIА"                PASS
fullwidth digits           "Theo Điều ３５"                   PASS
Arabic-Indic digits        "Theo Điều ٣٥"                   PASS
NFD "xác suất"             (NFD)                            V3:có "xác suất"
mixed case LuẬt            "Theo LuẬt Đất đai"              PASS
"Nghị-định"                "Theo Nghị-định mới"             PASS
"Đ.35"                     "Theo Đ.35 Luật"                 PASS
--- false-block candidates (should pass) ---
quyết định số tiền         V6:có "quyết định số"
quyết định số lượng        V6:có "quyết định số"
do tin cậy                 V3:có "độ tin cậy"
sẵn sàng mua nhà           V3:có "sẵn sàng mua"
tiềm năng mua              V3:có "tiềm năng mua"
suy nghĩ quyết định        V6:có "nghị quyết"
kỷ luật KH                 V6:có "luật K"
quy luật Thị trường        V6:có "luật T"
LUẬT SƯ (chữ hoa)          V6:có "LUẬT S"
nhóm màu / nhóm mẫu        V5:có "nhóm máu"
khả năng kỷ luật           V3:có "khả năng ký"
bảo viết                   V4:có "bảo việt"
liên kết chung             V4:có "liên kết chung"
điều 2 vợ chồng            V6:có "điều 2"
2 điều (đối chứng)         PASS
điểm số / chấm điểm        V3
```
