# Review Phase 5 vòng 2 — Codex, gói B

- Worktree: `C:\workspace\Project-2C-review-2`; detached HEAD `705ea7c0e76dcdcf8c89f949fc2e3b3b6e4fff2c`.
- Gói: Rust + hợp đồng Tauri; kế hoạch `C:\workspace\deep-review-5-r2\common\plan.md` §1–§6.
- Bắt đầu: khoảng 01:45 ngày 11/10/2026; kết thúc: 2026-10-11 02:08:57 (Asia/Bangkok, UTC+7).
- Toàn bộ test tạm, bản sao bị đột biến và log ở `C:\workspace\deep-review-5-r2\codex\B\`. Không sửa repo, gọi AI thật, đọc key của app, mở ChatGPT hay đọc báo cáo vòng 2 của bên khác.

## Bảng R — kiểm lại PR #503 / Issue #487

“2 MB” trong code là 2 097 152 byte (2 MiB). Đột biến dưới đây chỉ áp dụng vào bản sao `rust-harness/src/ai.rs`, chạy test của PR, rồi khôi phục ngay. Tên log trong bảng đều nằm dưới thư mục kết quả B.

| DR5 | Issue | Kết luận | Bằng chứng: tái hiện cũ; test đỏ khi gỡ sửa; biến thể gần | Ghi chú |
|---|---|---|---|---|
| 20 | #487 | **ĐÃ SỬA** | Gzip giải nén 64 MiB hiện chỉ đọc 2 097 153 byte; HTTP 429 gzip lớn vẫn giữ 429. Trả reader về `with_config().limit(MAX_BODY).read_to_vec()`: `a_gzip_reply_is_unpacked_and_read_to_2_mb_however_small_it_is_on_the_wire` đỏ, đọc 16 777 257 thay vì 2 097 153 byte. Thử thêm gzip chunked không Content-Length và body lỗi lớn. | `R20-R21-old-wire-limit.log`; `r2-probes.log`. Bộ nhớ có số đo ở trục P. |
| 21 | #487 | **ĐÃ SỬA** | Body đúng 2 097 152 byte được nhận, thêm 1 byte bị từ chối; đúng cho body thường, gzip và gzip chunked. Reader cũ làm `a_body_is_read_to_2_mb_and_one_byte_more_shows_it_is_longer` đỏ ngay ở đúng giới hạn. | `R20-R21-old-wire-limit.log`; `r2-probes.log`. |
| 22 | #487 | **ĐÃ SỬA** | Server local không trả bắt tay TLS → NETWORK; server không trả sau kết nối → TIMEOUT. Trả Resolve/Connect về TIMEOUT: `transport_errors_map_to_timeout_or_network` và `a_server_that_never_answers_the_tls_handshake_is_a_network_error` đỏ. Config production giữ resolve/connect 10 s và global 120 s; probe dùng thời hạn ngắn. | `R22-old-timeout-code.log`. Resolve kiểm bằng loại lỗi giả + config; chưa dựng DNS thật bị treo. |
| 24 | #487 | **SỬA MỘT PHẦN** | Bỏ `http_status_as_error(false)`, bỏ giới hạn đọc, đổi URL Go hoặc tên service: test mới đều đỏ. Tuy nhiên thay cả `post()` bằng lỗi NETWORK vẫn **35/35 xanh**, đúng kiểu đột biến vòng 1. Biến thể không sinh cảnh báo clippy cũng sống. | **CX2-B4**. `R24-disable-post.log` và `warning-clean-disable-post-*.log`. |
| 25 | #487 | **ĐÃ SỬA** | Dùng chính `key_entry()` trong bản sao, chỉ thay service/user bằng tên riêng của probe: ghi/đọc/xóa key giả, no-entry, đọc key Enterprise cũ rồi ghi lại Local đều đúng. Đổi hằng Local → Enterprise làm `the_key_is_stored_local_to_this_machine` đỏ. | `r2-extra.log`. Code hiện đúng; bỏ dây truyền modifiers lại không làm test PR đỏ: khoảng trống **CX2-B4**, không kết luận implementation hiện lưu Enterprise. |
| 26 | #487 | **ĐÃ SỬA** | NUL, LF/CR bên trong key, DEL, zero-width, BOM, non-ASCII, khoảng trắng nội bộ bị chặn; trim ngoài được phép, 512 ký tự được nhận; reasoning chỉ low/medium/high. Trả clean_key về luật cũ làm `a_key_that_is_empty_over_512_characters_or_not_printable_ascii_is_bad_request_and_not_stored` và `no_error_carries_the_key_or_the_session` đỏ; bỏ kiểm reasoning làm `wrong_arguments_are_bad_request_and_reach_neither_the_key_nor_the_network` đỏ. | `R26-old-key-validation.log`, `R26-old-reasoning.log`; các biên request/Unicode cũng được thử. |
| 27 | #487 | **SỬA MỘT PHẦN** | Raw-body fallback đã bỏ; key/session nguyên văn được che trước khi cắt 200 ký tự; body lỗi lớn được đọc hữu hạn và giữ mã HTTP. Ba đột biến hồi phục lỗi cũ đều làm test đỏ. Biến thể body bị cắt, gzip hỏng hoặc timeout sau header vẫn mất mã HTTP; key URL-encode trong message không được che. | **CX2-B1**, **CX2-B3**. `R27-raw-fallback.log`, `R27-no-session-mask.log`, `R27-reject-large-before-status.log`; `r2-probes.log`. |
| 28 | #487 | **SỬA MỘT PHẦN** | Content chứa toàn bộ key nguyên văn → BAD_RESPONSE. Bỏ guard làm `a_reply_whose_content_holds_the_key_is_bad_response` đỏ. Nhưng key trong JSON con dùng Unicode escape qua guard, được validator giải mã và lưu/backup; field mới finishReason cũng lọt key nguyên văn. | **CX2-B2**, **CX2-B3**. `R28-no-content-guard.log`; `key-boundary.log`. |
| 29 | #487 | **ĐÃ SỬA** | Thiếu usage, thiếu một count, count âm/sai kiểu → count không biết là null; không biến thành 0. Trả mặc định về 0 làm `a_reply_without_usage_has_unknown_tokens_and_a_cut_one_says_length` đỏ. Kiểm thêm count một phần và hợp đồng camelCase/null ở TypeScript. | `R29-zero-usage.log`; 20 test hợp đồng Tauri xanh. |
| 05 — chỉ phần Rust | #487 | **HỒI QUY** | `finish_reason` length/null/content_filter được đưa về `finishReason` đúng. Bỏ field làm `a_reply_gives_its_content_token_counts_and_finish_reason` và `a_reply_without_usage_has_unknown_tokens_and_a_cut_one_says_length` đỏ. Field mới không qua guard key: trả key trong finish_reason vẫn thành công. | **CX2-B2** là hồi quy do field mới ở #503. Phần parser/runner xử lý trả lời bị cắt thuộc **KNOWN #492**, không báo lại. |

Tổng: **6 ĐÃ SỬA, 3 SỬA MỘT PHẦN, 1 HỒI QUY**, không có CHƯA SỬA. Có 4 phát hiện Low CONFIRMED dưới đây; một phát hiện có thể giải thích nhiều dòng R.

## Phát hiện

### CX2-B1 — Mất mã HTTP nếu đọc body thất bại sau khi đã nhận header

- **Mức:** Low.
- **Trục:** C; liên quan R, E.
- **Vị trí (705ea7c):** `C:\workspace\Project-2C-review-2\apps\desktop\src-tauri\src\ai.rs:387`, đặc biệt dòng 389–394; phân loại HTTP ở dòng 220–231.
- **Tình trạng:** CONFIRMED.
- **Liên quan:** DR5-27; biến thể của lỗi đã sửa ở PR #503, đường này có từ trước.

**Mô tả.** `post_with` đã có status, nhưng lỗi `read_to_end` được đổi ngay thành lỗi transport không có `httpStatus`. Vì vậy body lỗi lớn đọc thành công nay giữ mã HTTP, còn body lỗi bị cắt, gzip hỏng hoặc chậm vẫn bỏ mất 401/429/502 đã nhận.

**Tái hiện.** Chạy `run-probes.ps1`, test `r2_http_error_body_failures_keep_or_lose_status`, server TCP localhost:

1. Trả lần lượt HTTP 401, 402, 403, 429, 500, 502, Content-Length 1000, gửi `{"message":"down"}` rồi đóng socket.
2. Cả sáu lần: `AiError { code: "AI_NETWORK", http_status: None, message: None }`.
3. Trả `Content-Encoding: gzip` với payload gzip sai ở 401/429/502: cũng NETWORK, không status.
4. Trả header 429 rồi trì hoãn body vượt timeout 150 ms của agent probe: TIMEOUT, không status.
5. Đối chứng: 429 gzip lớn đọc được trả RATE_LIMITED, `http_status: Some(429)`. HTTP 200 gzip hỏng cũng ra NETWORK thay vì BAD_RESPONSE; đây là cùng cách ánh xạ lỗi reader.

Bằng chứng: [r2-probes.log](C:/workspace/deep-review-5-r2/codex/B/r2-probes.log); nguồn test [r2-probes.rs](C:/workspace/deep-review-5-r2/codex/B/r2-probes.rs).

**Ảnh hưởng.** Khi upstream/proxy trả header lỗi nhưng body không đọc được, UI mất chẩn đoán key sai, hết hạn mức hay server lỗi và báo mạng/timeout. Không có mất dữ liệu đã lưu. Probe xác nhận đường code; không xác nhận OpenCode thực tế đang trả những response này.

**Đề xuất.** Giữ phân loại non-2xx và status ngay cả khi body không đọc được; bỏ message trong trường hợp đó. Với 2xx, phân biệt body/decompression sai với timeout/mạng thực sự. Ước lượng 20–35 dòng sản phẩm + 60–100 dòng test.

### CX2-B2 — Field finishReason mới có thể đưa nguyên API key qua IPC

- **Mức:** Low.
- **Trục:** S; liên quan R, C.
- **Vị trí (705ea7c):** `C:\workspace\Project-2C-review-2\apps\desktop\src-tauri\src\ai.rs:249`; guard chỉ kiểm content ở dòng 241; `C:\workspace\Project-2C-review-2\apps\desktop\src-tauri\src\lib.rs:136`; `C:\workspace\Project-2C-review-2\apps\desktop\src\data\ai-tauri.ts:64`.
- **Tình trạng:** CONFIRMED.
- **Liên quan:** mới do PR #503; DR5-05 phần Rust và DR5-28.

**Mô tả.** Response 2xx có content an toàn nhưng `choices[0].finish_reason` chứa key vẫn trả Completion thành công. Field mới được sao chép nguyên văn, trong khi D-1 mục 1 yêu cầu key không sang webview.

**Tái hiện.** Test `r2_secret_variants_and_finish_reason` gọi đúng `reply` với key giả và response:

```json
{"choices":[{"message":{"content":"OK"},"finish_reason":"sk-test-SECRET-0123456789"}]}
```

Kết quả `Ok(Completion)`; serialize Completion bằng serde_json có toàn bộ key trong `finishReason`. Log: `FINISH_REASON_KEY ipc_has_exact_key=true`. Không cần AI thật hay đọc Credential Manager.

Bằng chứng: [r2-probes.log](C:/workspace/deep-review-5-r2/codex/B/r2-probes.log); đường truyền TS ở `ai-tauri.ts` không loại bỏ field.

**Ảnh hưởng.** Nếu gateway phản chiếu header key vào field này, key qua IPC sang JS. Runner hiện không lưu finishReason vào ai_analyses, nên tái hiện này **không** chứng minh key từ field này vào DB/backup. Mức Low giữ theo lý do Owner đã dùng cho DR5-28: cần response bất thường từ gateway có TLS hợp lệ; model bình thường không thấy key trong header.

**Đề xuất.** Kiểm key trên mọi string đưa ra trong Completion, kể cả finishReason, trước IPC; giữ các giá trị hợp lệ length/stop/null. Ước lượng 5–15 dòng sản phẩm + 20–40 dòng test.

### CX2-B3 — Guard key nguyên văn bị vượt bằng JSON escape; key giải mã vào DB và backup

- **Mức:** Low.
- **Trục:** S; liên quan R, D.
- **Vị trí (705ea7c):** `C:\workspace\Project-2C-review-2\apps\desktop\src-tauri\src\ai.rs:241`; biến thể error ở dòng 262–267. Đường hậu quả đối chiếu với `C:\workspace\Project-2C-review-2\packages\ai\src\run.ts` và `C:\workspace\Project-2C-review-2\packages\db\src\ai-analyses.ts` / `backup.ts`.
- **Tình trạng:** CONFIRMED.
- **Liên quan:** DR5-28 sửa chưa đủ ở PR #503; biến thể DR5-27. Không phải yêu cầu thay golden hay thêm một luật nghiệp vụ vào G5.

**Mô tả.** Guard Rust chỉ tìm key nguyên văn trong content. Content lại có thể là một chuỗi JSON phân tích: viết từng ký tự key bằng `\uNNNN` khiến Rust không thấy key, nhưng parser giải mã thành key nguyên vẹn trước khi validator và lệnh lưu nhận output.

**Tái hiện.**

1. `run-extra.ps1` / `r2_write_encoded_completion_fixture` tạo một analysis JSON hợp lệ với F1; một string output chứa toàn bộ key giả dưới dạng Unicode escape.
2. Gọi đúng Rust `reply(200, ...)`: được nhận. Fixture thực sự qua Rust được ghi vào `B/rust-harness/fixtures/encoded-completion.json`.
3. `node B/key-boundary.mjs` dùng các module gốc của repo: `checkAnalysisAnswer` → `recordAiAnalysis` trên DB sql.js in-memory có migrations thật → `exportBackup` → `importBackup`.
4. Kết quả:

```text
{"rustLiteralKey":false,"status":"ACCEPTED","decodedOutputKey":true,"issues":[]}
{"rowSaved":true,...,"backupHasFakeKey":true,"backupImport":"accepted","importedBackupHasFakeKey":true}
```

5. Biến thể gần ở `server_message`: toàn bộ key percent-encode không được mask, do `replace(secret,"***")` chỉ so nguyên văn. Probe key nguyên văn bị mask/chặn đúng. Probe prefix key và lowercase cũng đã chạy, nhưng không tính chúng thành phát hiện: prefix được test mới cho phép, lowercase không phải key nguyên vẹn.

Bằng chứng: [key-boundary.log](C:/workspace/deep-review-5-r2/codex/B/key-boundary.log), [key-boundary.mjs](C:/workspace/deep-review-5-r2/codex/B/key-boundary.mjs), [r2-extra.log](C:/workspace/deep-review-5-r2/codex/B/r2-extra.log), [r2-probes.log](C:/workspace/deep-review-5-r2/codex/B/r2-probes.log). Backup chứng cứ `B/key-encoded.p2cbackup` chỉ chứa dữ liệu/key giả.

**Ảnh hưởng.** Trong response bất thường phản chiếu key, key có thể đi qua IPC, được giải mã trong output ACCEPTED rồi tồn tại trong DB và backup. Đây là phép thử các ranh giới Rust → validator → lệnh lưu → backup bằng fixture giả, không phải chạy UI với OpenCode thật. Không chứng minh sự cố đã xảy ra với key thật. Giữ Low cùng điều kiện kích hoạt của DR5-28 đã được Owner hạ mức.

**Đề xuất.** Kiểm các biểu diễn chuẩn có thể giải mã thành secret ở ranh giới Rust, ít nhất JSON string escape trong content và URL encoding trong message. Chặn/che trước IPC, giữ nội dung hợp lệ còn lại; không mask tùy tiện mọi đoạn key ngắn. Ước lượng 40–80 dòng sản phẩm + 80–120 dòng test.

### CX2-B4 — Test mới vẫn không bảo vệ post() production và dây truyền modifiers Local

- **Mức:** Low.
- **Trục:** T; liên quan R, S, C.
- **Vị trí (705ea7c):** `C:\workspace\Project-2C-review-2\apps\desktop\src-tauri\src\ai.rs:337`, test ở dòng 1216 và 1371; `key_entry` dòng 323, test `the_key_is_stored_local_to_this_machine` dòng 1028–1038.
- **Tình trạng:** CONFIRMED.
- **Liên quan:** DR5-24 sửa một phần ở PR #503; khoảng trống trong test mới của DR5-25.

**Mô tả.** Server local kiểm `post_with` trực tiếp; lần duy nhất test dùng `post` production lại mong lỗi vì URL là HTTP. Test Local tự build một store khác và chỉ đòi `key_entry().is_ok()`, không kiểm persistence do chính helper production tạo.

**Tái hiện.** `mutate.mjs` chạy 17 đột biến, 15 bị test bắt; hai đột biến sống:

| Đột biến | Kết quả test PR |
|---|---|
| Thay toàn bộ `post()` bằng `Err(AiError::new(AI_NETWORK))` | 35 passed, 0 failed |
| Bỏ `Some(&modifiers)` trong `key_entry`, build với `None` | 35 passed, 0 failed |

Đã kiểm thêm biến thể không để cảnh báo chết biến/unused che khuất kết luận: `post` trả NETWORK cho URL không rỗng nhưng vẫn giữ tham chiếu helper; bỏ cả khai báo modifiers khi dùng None. Cả hai vẫn 35/35 xanh và clippy thường xanh trong harness.

Clippy của harness cần `-A clippy::new_without_default` vì harness xuất public Busy/DataLock, khác module private của app. Đây **không** phải kết quả chạy toàn bộ CI/Tauri app. Không dùng việc “test xanh” để khẳng định code hiện sai.

Test tạm dùng **chính** `key_entry`, tên credential riêng, ghi key giả rồi đọc persistence: implementation hiện tại PASS; đột biến bỏ modifier FAIL với `Some("Enterprise")` thay vì `Some("Local")`. Credential probe được xóa bằng guard cả khi assert panic.

Bằng chứng: [mutation-summary.json](C:/workspace/deep-review-5-r2/codex/B/mutation-summary.json), [warning-clean-mutations.mjs](C:/workspace/deep-review-5-r2/codex/B/warning-clean-mutations.mjs), [native-mutation-sensitive.log](C:/workspace/deep-review-5-r2/codex/B/native-mutation-sensitive.log).

**Ảnh hưởng.** Một sửa đổi sau này có thể làm mọi request AI thất bại hoặc đưa key về Enterprise mà toàn bộ test AI Rust của PR vẫn xanh. Test đã cải thiện thật: giờ bắt được status-as-error, đọc vô hạn, URL/service sai, timeout, key validation, raw fallback, token counts và finishReason.

**Đề xuất.** Cho test đi qua cùng đường `post` production bằng cách tiêm agent/factory; test store từ helper production với service/user riêng và kiểm persistence sau ghi. Không cần dependency mới. Ước lượng 20–40 dòng sản phẩm + 100–150 dòng test.

## Đi qua mọi trục §5

| Trục | Đã xét và kết quả |
|---|---|
| **R — kiểm lại sửa** | Đủ 10 dòng R phía trên. Mutation dựa trên tái hiện vòng 1 + test PR #503; thử thêm biến thể gần. 17 đột biến độc lập: 15 bị bắt, 2 sống; không có lỗi compile trong lượt 17 đột biến. |
| **E — edge case** | Thử 0/1/giới hạn/vượt giới hạn, request tiếng Việt NFC/NFD, CRLF, emoji; 200 000 codepoint được nhận, 200 001 bị chặn. Body plain/gzip/chunked, header lặp/sai, short-read, read timeout, TLS handshake treo, count sai kiểu. Thread/barrier chứng minh AI_BUSY khi request khác đang giữ flag; panic giả + retry chứng minh flag được nhả trong test unwind. Có CX2-B1. **Đã xét, không thấy thêm** lỗi biên trong phần B. Rust không tính ngày nghiệp vụ nên ngày 29/02/nửa đêm không có phép tính riêng để probe tại đây. Reload/thay DB do UI điều phối thuộc C; chỉ đọc lifetime flag trong lib.rs, không kết luận từ test này về UI. |
| **G — guardrail AI** | Đọc G5, golden, ADR; kiểm body gửi chỉ system/user, reasoning đúng hợp đồng, không response_format. Response không được thực thi như lệnh hay tự ghi KYC. Probe CX2-B3 dùng validator/schema thật để phân biệt luật G5 với bảo vệ secret. **Đã xét, không thấy** sai lệch V1–V7 mới do Rust/port Tauri; V1–V7/repair chủ yếu ở packages/ai. Các lỗi parser/golden còn mở gắn KNOWN ở dưới. |
| **C — hợp đồng** | Đọc mọi field Args/Completion/AiError và các command; 20 test TS hợp đồng xanh. Kiểm null token, camelCase, finishReason, mã HTTP/error, reasoning, 10 s/120 s, endpoint Go/Credit, đúng một User-Agent và session header. Có CX2-B1; đường field finishReason liên quan CX2-B2. **Đã xét, không thấy thêm** sai lệch hợp đồng trong B. |
| **D — dữ liệu** | Đọc Rust không ghi ai_analyses/KYC; key commands không đi qua DB/backup; lib.rs dùng spawn_blocking, không giữ DB lock trong gọi AI. Probe DB sql.js/migration/lệnh lưu/export/import thật chứng minh hậu quả CX2-B3. **Đã xét, không thấy thêm** mất dòng/ghi KYC tự động do phần B. Không kiểm toàn bộ transaction nghiệp vụ thuộc A/C. |
| **S — an toàn** | Có CX2-B2/B3. Probe credential service riêng: Local/Enterprise cũ/read/write/delete/no-entry; lỗi keyring chỉ trả mã, không chi tiết. Đọc HTTPS-only, no-redirect, fixed endpoint, CSP/capabilities và mở URL cố định qua explorer.exe đầy đủ đường dẫn. Không có command lấy key về JS. **Đã xét, không thấy thêm** đường gửi key tới host tùy ý, exec output AI hoặc mở URL do AI chỉ định trong B. |
| **P — hiệu năng** | Có đo thời gian request/parse/gzip và peak working set ở bảng dưới. **Đã xét, không thấy** tăng RAM theo kích thước gzip giải nén sau sửa hoặc hồi quy hiệu năng đủ bằng chứng để báo lỗi. Đây là đo local debug, không phải thời gian model. |
| **B — bloat** | Đọc diff sửa lẫn toàn bộ phần Phase 5, tra call sites/export bằng rg; `codemap --check` xanh; tsc noUnusedLocals/noUnusedParameters xanh. Helper agent_with/post_with có call site và mục đích test; không tìm thấy nhánh chết/export bỏ quên/lặp ≥3 nơi có hậu quả trong B. **Đã xét, không thấy** phát hiện bloat cần báo. Không ghi style/clippy pedantic thành lỗi. |
| **T — chất lượng test** | Có CX2-B4; mutation không chỉ đổi hằng hay chép phép tính. Chạy lại test PR, body lỗi/happy path local, busy/panic và credential Windows riêng. **Đã xét, không thấy thêm** test phụ thuộc ngày/thứ tự trong phần B; credential tạm chạy tuần tự và dọn bằng guard. |
| **A — trợ năng/i18n** | Port Rust/TS không tạo widget. Kiểm tập mã lỗi ↔ ai-error-view.ts ↔ i18n/vi.ts: các mã phát sinh có câu tiếng Việt; message server đi qua hợp đồng thông báo có giới hạn. **Đã xét, không thấy** chuỗi UI cứng hoặc mã lỗi mới chưa có bản dịch do B. Chưa chạy keyboard/screen reader của panel trong gói này; kiểm tương tác UI nằm ở C. |

### Biến thể HTTP đã thử nhưng không nâng thành phát hiện riêng

- Feature tree ureq đang bật gzip + rustls/webpki; không bật deflate hoặc br. Có gửi payload deflate/br để xác nhận không giải nén, trả BAD_RESPONSE; không quy chúng thành lỗi vì feature không bật.
- Header `Content-Encoding: GZip` trong probe không được giải nén, dẫn tới BAD_RESPONSE. Ghi nhận giới hạn decoder; chưa xác minh upstream dùng kiểu này, không tính thành một phát hiện thứ năm.
- Header Content-Encoding gzip lặp được đọc thành công trong probe. Content-Length mâu thuẫn và Content-Length + Transfer-Encoding chunked không hợp lệ bị từ chối NETWORK; không có chấp nhận body sai vượt guard.
- Redirect không được theo, HTTP thường bị agent production chặn, headers gửi đúng; không thực hiện successful request tới endpoint production.
- Token count u64 rất lớn qua Rust được ghi log; chưa có bằng chứng count thực tế/hậu quả nghiệp vụ đủ để mở phát hiện về độ chính xác số JS.

## Test, mutation, clippy và số đo

### Kiểm tra đã chạy

| Kiểm tra | Kết quả / log |
|---|---|
| Cargo offline, test AI gốc trong bản sao ai.rs + storage.rs | **35/35 PASS**, 50 test storage được filter; `rust-baseline.log`. |
| Test TS ai-tauri + tauri-contract | **20/20 PASS**, 2 file, 405 ms; `ts-contract-tests.log`. |
| 17 mutation vào code bản sao, chạy lại test PR | **15 bị bắt / 2 sống / 0 lỗi compile**; `mutation-summary.json` và log từng mutation. |
| 8 nhóm probe Rust bổ sung | **8 PASS**, 1,50 s; `r2-probes.log`. Có các assertion xác nhận hành vi sai để chứng minh phát hiện, nên “PASS” của probe không có nghĩa sản phẩm đúng. |
| 2 probe bổ sung: helper key production và fixture encoded | **2 PASS**; `r2-extra.log`. |
| Mutation test native có sức phát hiện | FAIL như dự kiến: Enterprise khác Local; `native-mutation-sensitive.log`. |
| Pipeline Rust fixture → validator → DB → backup/import | Tái hiện key giải mã trong output và backup; `key-boundary.log`. |
| `node tools/codemap.mjs --check` | Export maps up to date; `codemap-check.log`. |
| `tsc -p apps/desktop --noUnusedLocals --noUnusedParameters` | Exit 0; `ts-unused.log` rỗng. |
| `cargo clippy --offline ... --lib --tests -- -W clippy::pedantic` | Chạy **một lần**, exit 0; harness lib 36 warnings, lib-test 46 (36 trùng). `clippy-pedantic.log`. |

So với báo cáo Codex vòng 1 ở repo (33 lib / 36 lib-test, 33 trùng): tăng 3 warning lib và 7 warning riêng trong test. Đây là cùng cách tách harness ai + storage, không phải build Tauri đầy đủ. Phần tăng gồm docs/cast helper test; harness public cũng làm xuất hiện các gợi ý Default/must_use/Errors khác module app. Không thấy warning mới chứng minh lỗi hành vi; không đề nghị đổi tên/phong cách.

### Hiệu năng local debug

Mỗi phép đo request lặp 100 lần; parser lặp 30 lần. Gzip 64 MiB tạo bằng helper fixture, server localhost. Hai lượt chạy độc lập cho kết quả gần nhau.

| Probe | Lượt r2-probes | Lượt đo working set |
|---|---:|---:|
| Kiểm args + tạo body, 1 024 codepoint | 0,025 ms/lần | 0,025 ms/lần |
| 20 000 codepoint | 0,370 ms/lần | 0,346 ms/lần |
| 200 000 codepoint | 3,457 ms/lần | 3,266 ms/lần |
| Parse response đúng 2 MiB | 7,047 ms/lần | 7,368 ms/lần |
| Gzip mở ra 64 MiB, đọc đến cap + 1 | 10,677 ms | 10,810 ms |
| Số byte giữ sau giải nén | 2 097 153 | 2 097 153 |
| Gzip trên wire | 422 967 byte | 422 967 byte |

Peak working set của executable test: **16 224 256 byte ≈15,47 MiB**, 57 mẫu, gồm cả tạo fixture và vòng request/parser; log `memory-summary.json` / `memory-stdout.log`. Poll process bằng PowerShell, helper chạy `-WindowStyle Hidden`. Số đo này không khẳng định toàn app dùng 15 MiB.

Vòng 1 ghi request tương ứng 0,025 / 0,367 / 3,490 ms và parse 5,878 ms. Lượt này không thấy request chậm hơn đáng kể; chênh parse debug nhỏ chưa đủ tách khỏi nhiễu để coi là hồi quy. Không đo network/model thực.

## KNOWN và giới hạn kết luận

- **KNOWN #491 / DR5-23:** đường “Kiểm tra kết nối” 64 max_tokens không hợp reasoning model và các thay đổi G5 đã giao Phase 6. Không gọi AI thật và không báo lại.
- **KNOWN #492 / DR5-05 phần packages/ai:** parser/runner có thể dùng phần tử JSON con của câu trả lời bị cắt; các DR5-04/06/07/09 cùng đợt cũng đã giao Phase 6. Báo cáo này chỉ đánh giá field finish_reason phía Rust.
- Các mục công khai khác của `common/known.md` và quyết định Owner được dùng để lọc; không tính KNOWN vào số phát hiện mới. Chính sách URL/model Go đã được chấp nhận không được biến thành yêu cầu công cụ/dịch vụ mới.
- Không build Tauri shell, không chạy lại toàn bộ pnpm verify/e2e hay release exe trong phiên read-only này. TS contract + Rust harness không thay thế việc chạy app Windows đầy đủ.
- Không có successful HTTPS call qua `post` production; TLS treo và chặn HTTP được thử local, thành công HTTP đi qua `post_with`. Đây chính là giới hạn test được báo ở CX2-B4.
- Resolve timeout kiểm bằng enum lỗi/config, chưa đo DNS resolver treo thật. Không gây lỗi Credential Manager của máy; kiểm ánh xạ keyring bằng lỗi giả và lifecycle native bằng service tạm.
- Panic probe dùng test profile unwind. Release `panic = "abort"` kết thúc process, nên kết quả “flag được nhả” không có nghĩa process release còn chạy sau panic.
- Probe backup dùng dữ liệu giả, DB in-memory và module thật, không tự chạy normal UI workflow, không chứng minh model/gateway thực phản chiếu key.
- Không đọc báo cáo vòng 2 của gói khác hoặc bên khác; không đưa kết luận G7 cho gói B.

## Phạm vi đã đọc

Đã đọc tài liệu chuẩn trước phần kiểm R: `common/plan.md` §1–§6, baseline/known; root CLAUDE.md/CONTEXT.md; phase-5-ai.md, phase-5-prompts.md, golden ai-eval.md; ADR-0009 đầy đủ D-1/G5/W-1; tổng hợp 10/10 §3–§5, §7, §8 và quyết định Owner 10/10 trong PROJECT-STATE.md; thân Issue #482–#490 và #500. Issue được đọc read-only từ GitHub theo yêu cầu, snapshot nằm trong `B/issue-<N>.json`.

| File / vùng trong repo ghim | Phạm vi |
|---|---|
| `C:\workspace\Project-2C-review-2\apps\desktop\src-tauri\src\ai.rs` | Toàn bộ 1–1402, cả implementation/test. |
| `C:\workspace\Project-2C-review-2\apps\desktop\src-tauri\src\lib.rs` | Toàn bộ 1–205; kỹ command AI 136–186. |
| `C:\workspace\Project-2C-review-2\apps\desktop\src-tauri\Cargo.toml` | 1–32, dependencies/profile. |
| `C:\workspace\Project-2C-review-2\apps\desktop\src-tauri\Cargo.lock` | Diff Phase 5 và các entry/feature liên quan ureq, TLS, keyring. Không khẳng định đọc mọi entry không liên quan. |
| `C:\workspace\Project-2C-review-2\apps\desktop\src-tauri\tauri.conf.json` | 1–31, toàn bộ CSP/config. |
| `C:\workspace\Project-2C-review-2\apps\desktop\src-tauri\capabilities\default.json` | 1–7, toàn bộ capabilities. |
| `C:\workspace\Project-2C-review-2\apps\desktop\src-tauri\build.rs` / `src\main.rs` | Toàn bộ 3 / 6 dòng. |
| `C:\workspace\Project-2C-review-2\apps\desktop\src\data\ai-tauri.ts` | 1–75, toàn bộ port. |
| `C:\workspace\Project-2C-review-2\apps\desktop\src\data\ai-tauri.test.ts` | 1–108, toàn bộ. |
| `C:\workspace\Project-2C-review-2\apps\desktop\src\data\tauri-contract.test.ts` | 1–217, toàn bộ. |
| `C:\workspace\Project-2C-review-2\packages\ai\src\adapter.ts` / `errors.ts` | Toàn bộ, đối chiếu type/null/error. |
| `C:\workspace\Project-2C-review-2\packages\ai\src\run.ts` | 165–375, converse/checkAnalysisAnswer/analysisOutcome/runAnalysis/counts. |
| `C:\workspace\Project-2C-review-2\packages\ai\src\test-support.ts` / `run.test.ts` | Test support toàn bộ; run.test 1–125 để lấy fixture đúng. |
| `C:\workspace\Project-2C-review-2\packages\db\src\database.ts` / `backup.ts` / `team.ts` | 1–100 / 1–118 / 1–108, đường tạo DB/migration/backup và dữ liệu giả. |
| `C:\workspace\Project-2C-review-2\packages\db\src\ai-analyses.test.ts` | 1–145; helper command/fixture thật cho probe. |
| `C:\workspace\Project-2C-review-2\apps\desktop\src\routes\ai-error-view.ts` | Toàn bộ; đối chiếu `i18n\vi.ts` 241–250. |
| `C:\workspace\Project-2C-review-2\apps\desktop\src-tauri\src\storage.rs` | Bản sao phục vụ build harness; đọc helper explorer 375–420 và các chỗ liên quan clippy. Không review lại toàn storage. |
| CLAUDE.md của desktop/ai/db; configs package/tsconfig/vitest | Quy tắc ranh giới và lệnh kiểm. |
| Báo cáo **vòng 1** công khai trong repo | Codex C.md, Claude C.md ở `docs/reviews/raw/2026-10-10/`, để lấy tái hiện Rust và so clippy/số đo. |

Đọc sâu toàn diff sửa `0df3606..705ea7c` trong gói B: ai.rs +611/−98, ai-tauri.test +12/−6, tauri-contract.test +22/0. ai-tauri.ts/lib/config không có thay đổi trong đợt sửa. Sau đó quét diff Phase 5 `3e84ce8..705ea7c` theo gói (7 file, +1913/−7), đọc toàn bộ code mới, lib diff và Cargo changes. CSP/capabilities không đổi trong Phase 5.

## Bảng đếm mức × trục

Mỗi phát hiện tính một lần theo trục chính; các trục liên quan không cộng lại.

| Mức | R | E | G | C | D | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 1 | 0 | 2 | 0 | 0 | 1 | 0 | **4** |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

**4 CONFIRMED, 0 PLAUSIBLE mới.** KNOWN chỉ ghi riêng, không tính.

## Phụ lục — nguồn test tạm và cách chạy lại

Root của mọi tên rút gọn bên dưới là `C:\workspace\deep-review-5-r2\codex\B\`. Không cần sửa repo hoặc dùng key thật.

| Nguồn / artifact | Mục đích |
|---|---|
| [mutate.mjs](C:/workspace/deep-review-5-r2/codex/B/mutate.mjs) | 17 mutation trên bản sao; khôi phục finally; JSON summary + log từng ca. |
| [r2-probes.rs](C:/workspace/deep-review-5-r2/codex/B/r2-probes.rs), [run-probes.ps1](C:/workspace/deep-review-5-r2/codex/B/run-probes.ps1) | Server local, body/header/compression, key variants, busy/panic, lifecycle credential riêng, số đo. |
| [r2-extra.rs](C:/workspace/deep-review-5-r2/codex/B/r2-extra.rs), [run-extra.ps1](C:/workspace/deep-review-5-r2/codex/B/run-extra.ps1) | Thử chính helper key_entry với constants riêng; tạo fixture encoded qua Rust. |
| [native-mutation-sensitive.mjs](C:/workspace/deep-review-5-r2/codex/B/native-mutation-sensitive.mjs) | Chứng minh test native bổ sung bắt việc rơi về Enterprise; lỗi assert dự kiến, dọn credential sau panic. |
| [warning-clean-mutations.mjs](C:/workspace/deep-review-5-r2/codex/B/warning-clean-mutations.mjs) | Hai mutant sống không phụ thuộc unused warning; test + clippy log. |
| [key-boundary.mjs](C:/workspace/deep-review-5-r2/codex/B/key-boundary.mjs) | Loader source TS/migration SQL trong repo; memory DB thật và backup/import. |
| `rust-harness/Cargo.toml` / `Cargo.lock` / `src/` | Bản sao ai/storage, đúng dependency version sẵn trong lock, cargo --offline; không thêm dependency repo. |
| `rust-harness/fixtures/encoded-completion.json`, `key-encoded.p2cbackup` | Chứng cứ giả cho CX2-B3. |
| `memory-summary.json`, `memory-stdout.log`, `memory-build.log` | Số đo working set và thời gian của một executable test. |
| `issue-482.json` … `issue-490.json`, `issue-500.json` | Snapshot thân Issue đọc trước review. |

Các lệnh chính đã dùng (PowerShell, cwd worktree):

```powershell
git rev-parse HEAD

cargo test --offline --manifest-path C:\workspace\deep-review-5-r2\codex\B\rust-harness\Cargo.toml ai::tests:: -- --test-threads=1

node node_modules/vitest/vitest.mjs run apps/desktop/src/data/ai-tauri.test.ts apps/desktop/src/data/tauri-contract.test.ts --configLoader runner --cache false --coverage.enabled false --fsModuleCache false

node C:\workspace\deep-review-5-r2\codex\B\mutate.mjs
& C:\workspace\deep-review-5-r2\codex\B\run-probes.ps1
& C:\workspace\deep-review-5-r2\codex\B\run-extra.ps1
node C:\workspace\deep-review-5-r2\codex\B\key-boundary.mjs
node C:\workspace\deep-review-5-r2\codex\B\native-mutation-sensitive.mjs
node C:\workspace\deep-review-5-r2\codex\B\warning-clean-mutations.mjs

cargo clippy --offline --manifest-path C:\workspace\deep-review-5-r2\codex\B\rust-harness\Cargo.toml --lib --tests -- -W clippy::pedantic
node tools/codemap.mjs --check
node node_modules/typescript/lib/tsc.js -p apps/desktop --noUnusedLocals --noUnusedParameters

git diff --exit-code
git status --short
```

Credential fake dùng service `Project-2C-CX2-B-probe-20261011`, user `review-fake-only`, key `sk-test-SECRET-0123456789`. Đã xóa sau các lượt native; RAII cleanup dùng cả khi panic. Không đọc/ghi credential `Project-2C / opencode-go` của app.

Kiểm cuối: HEAD vẫn `705ea7c0e76dcdcf8c89f949fc2e3b3b6e4fff2c`; `git diff --exit-code` = 0; status chỉ có `?? .agents/`, `?? .codex/`, `?? AGENTS.md` đã có từ trước. Bản sao ai.rs sau probe/mutation khớp SHA-256 source ghim: `45E45E6C3641EC821E7D50C2CCAE275969289E601552D57F4B27ABF1059E2254`.
