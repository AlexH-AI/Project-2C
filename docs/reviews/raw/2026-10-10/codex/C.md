# Deep review Phase 5 — gói C / Rust

- Reviewer: Codex độc lập, phiên chính, không subagent.
- Ngày: 10/10/2026 (Asia/Bangkok).
- SHA kiểm đầu và cuối: `0df3606fb783cc89b1b9c413c02810340e273a4f`; detached HEAD.
- Phạm vi: gói C theo `common/plan.md` §3. Không đọc, liệt kê hoặc tìm trong thư mục báo cáo của reviewer khác; không tổng hợp báo cáo khác.
- Kết quả: **3 phát hiện CONFIRMED: 1 Medium, 2 Low**. Không có Critical / High / Nit; không có PLAUSIBLE được đưa vào danh sách.
- Không sửa file repo, không commit. Test, mutant, build và log nằm dưới `C:\workspace\deep-review-5\codex\C\`. Các mutant đã được gỡ và harness đã trở về nguồn gốc.
- Không gọi OpenCode thật, không chạy eval AI, không đọc Credential Manager thật, không mở ChatGPT. Key trong probe đều là chuỗi giả; TLS dùng certificate tự ký tạm, không cài vào trust store.

## 1. Phát hiện

### CX-C1 — phản hồi 2xx có thể đưa key từ Rust về webview và vào row lưu phân tích

- **ID:** CX-C1
- **Mức:** Medium
- **Trục:** S (liên quan C, D)
- **Vị trí:** `apps/desktop/src-tauri/src/ai.rs:222–229`, `:195–199`; đường trả IPC ở `apps/desktop/src-tauri/src/lib.rs:153–158` (0df3606).
- **Tình trạng:** CONFIRMED
- **Mô tả:** `reply()` chỉ che key trong nhánh lỗi HTTP. Nhánh 2xx trả nguyên `choices[0].message.content`, kể cả khi nội dung chứa chính key dùng gửi yêu cầu. Điều này không giữ được yêu cầu D-1 mục 1/4 và spec §5.1: lệnh không bao giờ trả key về webview.
- **Tái hiện / bằng chứng:** `probe/tests/review.rs::record_secret_echo_cases` gọi hàm Rust nguyên bản với HTTP 200, body `{"choices":[{"message":{"content":"sk-REVIEW-FAKE-0123456789"}}]}` và cùng key giả. Kết quả: `SUCCESS_ECHO: key_present=true content_len=25`. Không cần Credential Manager hay mạng.
- **Kiểm tiếp đường lưu:** `node C:\workspace\deep-review-5\codex\C\key-boundary.mjs` dùng `checkAnalysisAnswer` / `analysisOutcome` nguyên bản. Khi key giả nằm trong chuỗi `text` của một output đúng schema: `issues: []`, `status: ACCEPTED`, `keyInOutput: true`. Khi content chỉ là key, hai lần V1 sai tạo `REJECTED`, `keyInRawOutput: true`. Đây là row được chuẩn bị để lưu, chưa ghi vào DB trong probe.
- **Ảnh hưởng:** nếu upstream hoặc lớp gateway phản chiếu Authorization/key vào content, key ra khỏi Rust ngay ở kết quả IPC. Validator không phải lớp che bí mật; cả output ACCEPTED lẫn raw output REJECTED đều có thể mang key tới đường lưu `ai_analyses` / backup. Chưa chứng minh OpenCode thật có hành vi phản chiếu này; mức Medium phản ánh điều kiện upstream bất thường và vi phạm ranh giới bảo mật đã chốt, không khẳng định đã có lộ key thật.
- **Đề xuất:** trước khi trả Completion, từ chối phản hồi chứa key (`AI_BAD_RESPONSE`) hoặc áp cơ chế lọc bí mật thống nhất ở Rust. Thêm test echo vào 2xx, JSON chứa key và đường REJECTED; không dựa vào validator G5 để xử lý key. Ước lượng ≤ 60 dòng sản phẩm + test, trong ngưỡng 400 dòng.

### CX-C2 — fallback lỗi HTTP trả lại header / thân request mà upstream phản chiếu

- **ID:** CX-C2
- **Mức:** Low
- **Trục:** C (liên quan S)
- **Vị trí:** `apps/desktop/src-tauri/src/ai.rs:235–253`, đặc biệt `:245`; `apps/desktop/src/data/ai-tauri.ts:39–47`, `apps/desktop/src/routes/settings-ai-view.ts:75–83` (0df3606).
- **Tình trạng:** CONFIRMED
- **Mô tả:** `server_message()` dùng toàn bộ body dưới dạng text khi không có message JSON quen thuộc; chỉ thay đúng toàn bộ key rồi cắt 200 ký tự. Một body phản chiếu header/request vẫn trở thành `AiError.message`, trái spec §5.3 và doc comment §52–54 (“never a header or the request body”), cũng trái W-1 mục 7 về session không vào thông báo lỗi.
- **Tái hiện / bằng chứng:** cùng test Rust `record_secret_echo_cases`, HTTP 500 và body giả gồm `Authorization: Bearer <key>`, `x-opencode-session: REVIEW-SESSION`, `messages: {"note":"PRIVATE-KYC-REVIEW"}`. Hàm trả:

```text
Authorization: Bearer ***
x-opencode-session: REVIEW-SESSION
messages: {"note":"PRIVATE-KYC-REVIEW"}
```

- **Kiểm thêm:** error.message chỉ chứa 16 ký tự đầu của key giả không được che vì `replace(key, "***")` chỉ khớp toàn bộ key. Đây là bằng chứng giới hạn bộ lọc hiện tại, không khẳng định upstream thật hiện trả prefix.
- **Ảnh hưởng:** thông tin request hoặc session có thể xuất hiện trong lỗi đưa về JS; với `AI_HTTP`, `errorText()` còn đưa serverMessage vào câu hiển thị của Settings. Cắt 200 ký tự giới hạn độ dài, không loại các loại dữ liệu bị cấm. Key đầy đủ trong error đơn giản hiện đã được che đúng; không có bằng chứng key thật hay dữ liệu thật đã bị ghi log.
- **Đề xuất:** bỏ fallback trả body thô, dùng mã HTTP/câu chung cho body không có message được chấp nhận; xác định một chính sách lọc message phản chiếu header, session và dữ liệu request trước khi đưa qua IPC. Nếu giữ thông điệp server tùy ý thì cần làm rõ ranh giới với Owner ở G6; không tự sửa spec để hợp thức hóa. Ước lượng ≤ 100 dòng sản phẩm + test.

### CX-C3 — test Rust không phát hiện lớp HTTP bị vô hiệu hóa hoặc mất giới hạn đọc body

- **ID:** CX-C3
- **Mức:** Low
- **Trục:** T
- **Vị trí:** `apps/desktop/src-tauri/src/ai.rs:400–420`, `:522–528`, `:766–784`; vùng thiếu kiểm trực tiếp `:319–351` (0df3606).
- **Tình trạng:** CONFIRMED
- **Mô tả:** test `complete()` tiêm closure thay `post()`. Test 2 MB và timeout kiểm parser/mapping với dữ liệu hoặc lỗi đã tạo sẵn, không kiểm hàm HTTP thật. Vì vậy các luật cấu hình có ảnh hưởng lớn ở `post()` có thể bị phá mà suite vẫn xanh.
- **Tái hiện / bằng chứng:** `node C:\workspace\deep-review-5\codex\C\mutate.mjs`; mutant chỉ nằm trong thư mục test riêng, gỡ trong `finally`.

| Mutant | Kết quả 73 test Rust gốc | Kết luận |
|---|---|---|
| Thay toàn bộ `post()` bằng `Err(AI_NETWORK)` | 73 passed, 0 failed | Sống: mọi kết nối OpenCode sẽ hỏng nhưng suite không phát hiện |
| Đổi `.limit(MAX_BODY)` thành `.limit(u64::MAX)` | 73 passed, 0 failed | Sống: giới hạn đọc HTTP bị bỏ; parser 2xx vẫn có giới hạn riêng nên test parser còn xanh |
| Bỏ guard `busy.start()` trong complete | 71 passed, 2 failed | Bị bắt bởi test BUSY/giữ cờ |
| Bỏ `message.replace(key, "***")` | 72 passed, 1 failed | Bị bắt bởi `no_error_carries_the_key` |

- **Ảnh hưởng:** rủi ro hồi quy ở đường gọi thật, timeout và giới hạn body không được suite offline hiện có chặn. Đây là phát hiện về test, không nói cấu hình `post()` hiện tại sai: probe local bổ sung kiểm nó và các luật đang cho kết quả đúng.
- **Đề xuất:** tạo seam ở tầng Agent/transport để chạy HTTP local (hoặc transport giả ở dưới `post`), dùng đúng hàm dựng/cấu hình request sản phẩm; kiểm timeout khi nhận header/body, Content-Length/chunked quá giới hạn, redirect và Authorization/session/User-Agent. Thêm test 2xx chứa bí mật theo CX-C1. Không cần dependency mới; ước lượng ≤ 80 dòng sản phẩm cho seam + ≤ 200 dòng test.

## 2. Bảng đếm mức × trục

Mỗi phát hiện đếm một lần theo **trục chính**; trục liên quan đã ghi ở phát hiện.

| Mức | E | G | C | D | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 1 |
| Low | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tổng | 0 | 0 | 1 | 0 | 1 | 0 | 0 | 1 | 0 | 3 |

Không đếm KNOWN như phát hiện mới. `common/known.md` đã được đối chiếu: quyết định không xử lý riêng Go hết hạn / rủi ro chính sách Go là **KNOWN**, không báo lại; ghi chú `storage.rs` ngoài Windows thuộc Phase 4 không có bằng chứng mới ở review Windows này.

## 3. Mọi trục đã xét

| Trục | Cách xét và kết quả |
|---|---|
| E — Edge case | **Đã xét, không thấy lỗi mới ngoài CX-C1/C2.** Đầu vào rỗng, role/plan/session sai, 1/64/65 ký tự session, token 1/16000/16001; nội dung tổng 200000/200001 code point; emoji, NFC/NFD, NBSP, zero-width; JSON rỗng/hỏng/sâu 140 cấp, content null/sai kiểu; body đúng 2 MB/+1 byte; lỗi Unicode 200/201 code point. Kiểm cạnh tranh thật bằng thread + Barrier; lỗi key/mạng/timeout/panic trả cờ. Rust không xử lý ngày/DB nên các cạnh ngày và thay DB không có phép tính tại tầng này. Cờ static tồn tại qua reload webview; không thêm lệnh Hủy socket — đúng P5. |
| G — Guardrail AI | **Đã xét, không thấy lỗi mới của V1–V7 trong gói C.** Rust kiểm envelope OpenAI, không tự triển khai V1–V7; message vẫn là JSON text và parser/validator chạy ở `packages/ai`. Roles và request body được serialize bằng serde; ghi chú hoặc output không được dùng làm URL, lệnh shell hay key service. Prompt injection không đổi được endpoint/command trong Rust. Không tự retry ở Rust; không tự ghi KYC. Bộ G5 đã đọc làm nguồn chuẩn; không audit lại đầy đủ blocklist thuộc gói A. Key không thuộc blocklist G5: CX-C1 cần giải quyết ở ranh giới bí mật. |
| C — Hợp đồng | **Có CX-C2; đã xét, không thấy lỗi khác.** Hai URL GO/CREDIT, body `{model,messages,max_tokens,reasoning_effort?}`, không `response_format`, session/User-Agent, mã HTTP, key trim/giới hạn, spawn_blocking, không DATA_LOCK và browser command đúng §5. 42 test JS↔Rust/dịch lỗi xanh. `AI_OPEN_BROWSER` được port đổi thành bool theo thiết kế, không cần nằm trong AI_ERROR_CODES. |
| D — Dữ liệu | **Đã xét, không thấy lỗi mới trực tiếp trong gói C.** Lệnh AI Rust không có API DB và không ghi `ai_analyses`/KYC, không lấy khóa file; lỗi mạng/key không trả Completion. Chỗ lưu key chỉ dùng entry `Project-2C` / `opencode-go`; lỗi keyring chỉ trả code. CX-C1 xác nhận row chuẩn bị lưu có thể mang key; không chạy lại toàn bộ nhập backup/migration thuộc gói B. |
| S — An toàn | **Có CX-C1; CX-C2 liên quan.** Đọc toàn ai.rs/lib.rs, grep logging, kiểm error serde, mock key store, URL allowlist, HTTPS-only, TLS roots/lockfile, redirect, body cap, CSP/capabilities, browser argv. Hàm `post()` nguyên bản từ chối HTTP/URL sai và certificate tự ký localhost (0 HTTP request được server nhận, 1 TLS handshake bị từ chối). Không có command đọc key về JS. Không thấy log chủ động chứa key/request trong Rust. Không có plugin http/shell, quyền remote hay URL tùy ý trong capability. AI output vẫn là text; gói C không render HTML. |
| P — Hiệu năng | **Đã xét, không thấy vấn đề đáng báo qua số đo dưới.** Đo check/body và parse ở ngưỡng; giới hạn response giữ bộ đọc ở 2 MB; timeout local kiểm giai đoạn header/body. Không suy ra latency của model, độ trễ DNS hay RSS từ phép đo này. |
| B — Bloat | **Đã xét, không thấy lỗi mới.** Đối chiếu mọi hàm/const AI với caller lib.rs và test; không tìm được export chết hoặc logic lặp ≥3 nơi gây lỗi. Config/keyring/network mỗi nơi một trách nhiệm. `clippy::pedantic` chạy một lần; cảnh báo doc/must_use/Default và cast trong test trên target 32-bit không phải phát hiện sản phẩm Windows x64. Không chạy codemap sinh file vì phiên chỉ đọc. |
| T — Chất lượng test | **Có CX-C3.** 73 test Rust gốc + 42 test TS gốc xanh; 4 mutant, 2 sống/2 bị bắt. Thêm 9 test Rust probe và 1 probe JS cho đường key/row; tất cả qua. Không dùng network AI thật hay Windows Credential Manager thật trong test. |
| A — Trợ năng/i18n | **Đã xét, không thấy lỗi mới trong phạm vi C.** Rust trả code, bool hoặc Completion; câu lỗi UI qua `vi.ts`/`errorText`. Kiểm các mã Rust với tập mã TS và câu tiếng Việt; mở browser thất bại có câu riêng. Gói C không tạo widget/focus/aria nên kiểm bàn phím/focus của panel thuộc gói D, chưa xác nhận ở phiên này. ServerMessage không render HTML tại lớp đã xét. |

## 4. Kiểm chứng và số đo

Môi trường: Windows x64, `rustc/cargo 1.98.1`; ureq 3.4.2, serde 1.0.229, serde_json 1.0.151, keyring-core 1.0.0, windows-native-keyring-store 1.1.0. Các phiên bản ureq-proto 0.6.4, rustls 0.23.45, rustls-pki-types 1.15.1, rustls-webpki 0.103.15, webpki-roots 1.0.9 của harness trùng lockfile repo.

| Phép kiểm | Kết quả | Log |
|---|---|---|
| Test Rust gốc, harness tham chiếu nguyên ai.rs + storage.rs | 73 passed; thời gian test 0,65 s | `C/baseline-test.log` |
| Test TS ai-tauri, tauri-contract, settings-ai-view | 3 file, 42 passed; 811 ms tổng | `C/ts-contract-tests.log` |
| Probe Rust biên/khóa/key/perf | 5 passed | `C/review-probes.log` |
| Probe HTTP localhost | 3 passed: 200/401/403/402/429/503/302; headers; Content-Length/chunked quá 2 MB; timeout header/body | `C/local-transport.log` |
| Probe TLS: gọi post nguyên bản tới localhost tự ký | 1 passed; AI_NETWORK, không có message; 0 request HTTP / 1 TLS handshake lỗi | `C/local-tls.log` |
| Probe JS key → analysisOutcome | output ACCEPTED và rawOutput REJECTED đều có thể giữ key giả | `C/key-boundary.log` |
| Mutation | 2 sống, 2 bị bắt; xem CX-C3 | `C/mutation-summary.json` + 4 log mutation |
| Clippy pedantic một lần | Exit 0; 33 cảnh báo lib, 36 cảnh báo lib test (33 trùng) | `C/clippy-pedantic.log` |

Số đo CPU cục bộ, **debug build**, không phải benchmark release hoặc model thật. Mỗi batch đo bằng `Instant`; kết quả test chạy song song nên đây là số đo tham khảo trên máy review, không cam kết latency:

| Tác vụ | Kích thước | Số lần | Trung bình |
|---|---:|---:|---:|
| `check` + dựng `body` | 1.024 ký tự ASCII | 100 | 0,025 ms |
| `check` + dựng `body` | 20.000 ký tự ASCII | 100 | 0,367 ms |
| `check` + dựng `body` | 200.000 ký tự ASCII | 100 | 3,490 ms |
| `reply(200)` / JSON hợp lệ | 2.097.092 byte | 30 | 5,878 ms |
| `reply(500)` / body emoji tối đa | 2.097.152 byte | 30 | 1,240 ms |
| HTTP local vượt cap có Content-Length | 2 MB + 1 byte | 1 | Từ chối sau 7,53 ms |
| HTTP local chậm nhận header | Trần test 150 ms | 1 | AI_TIMEOUT sau 157 ms |
| HTTP local chậm nhận body | Trần test 150 ms | 1 | AI_TIMEOUT sau 151 ms |

**Giới hạn kiểm chứng:**

- Harness dùng `#[path]` tham chiếu file Rust trong repo; không build shell Tauri/`generate_context!` và không kiểm giao diện exe. Clippy chạy trên nguyên ai.rs/storage.rs qua harness, không phải full Cargo target của app; phần command macro lib.rs được đọc tay và kiểm bằng 42 test hợp đồng TS.
- Probe HTTP local giữ nguyên các clause `post()` trừ HTTPS → HTTP localhost và timeout 120 s/10 s → 150 ms/100 ms. Có thêm in lỗi transport giả. Vì vậy kết quả kiểm read-limit/header/redirect/timeout ở tầng ureq là trực tiếp nhưng không phải một lần gọi HTTPS production thành công. TLS từ chối certificate được kiểm bằng chính hàm post nguyên bản.
- Không chờ 120 giây thật, không đo DNS server chậm, không đo RAM/RSS, không kiểm credential store Windows thật theo cấm của Owner. Certificate tự ký không được cài vào kho tin cậy.
- Không sửa golden/spec. Không đưa KNOWN thành lỗi mới. Không đưa kết luận G7 cho toàn Phase 5 vì phiên này chỉ làm C.

## 5. Phạm vi đã đọc

Đường dẫn dưới tương đối với `C:\workspace\Project-2C-review-2`, tất cả tại SHA ghim. “Đọc” là xem nguồn; chạy test tham chiếu cả module không đồng nghĩa đọc tay toàn module hỗ trợ.

| File / vùng | Dòng đã đọc / mục đích |
|---|---|
| `apps/desktop/src-tauri/src/ai.rs` | **1–889**, toàn bộ code và 23 test AI |
| `apps/desktop/src-tauri/src/lib.rs` | **1–205**, chú ý AI_RUNNING 24–26, ai_complete 132–159, key/browser 161–186, handler 188–205 |
| `apps/desktop/src-tauri/Cargo.toml` | **1–32**, crate pin/features, release panic abort |
| `apps/desktop/src-tauri/tauri.conf.json` | **1–31**, CSP, windows, build |
| `apps/desktop/src-tauri/capabilities/default.json` | **1–7**, quyền main window |
| `apps/desktop/src-tauri/build.rs`, `src/main.rs` | Toàn bộ (3 / 6 dòng), khởi động/build |
| `apps/desktop/src-tauri/Cargo.lock` | Đọc mục ureq 3756–3770 và các phiên bản/đồ thị dependency keyring/serde/rustls/webpki qua lookup; so phiên bản lockfile harness |
| `apps/desktop/src-tauri/src/storage.rs` | 1–84 (khóa/file layer), 386–410 (explorer), 476–499 (thư mục test); hỗ trợ command/browser và cách giữ test tạm |
| `apps/desktop/src/data/ai-tauri.ts` | **1–75**, toàn bộ port IPC |
| `apps/desktop/src/data/ai-tauri.test.ts` | **1–102**, toàn bộ test port |
| `apps/desktop/src/data/tauri-contract.test.ts` | **1–195**, toàn bộ test hợp đồng |
| `apps/desktop/src/routes/settings-ai-view.ts` | **1–107**, errorText và trạng thái kết nối |
| `apps/desktop/src/data/ai-analysis.ts` | 95–216, cấu hình/runner/đường trả và lưu; lookup mở browser 72–85/273 |
| `apps/desktop/src/routes/customers/use-ai-job.ts` | **1–48**, job state và cách giữ kết quả |
| `packages/ai/src/errors.ts` | **1–46**, mã lỗi và serverMessage cap |
| `packages/ai/src/run.ts` | 29–360, phần extraction/checkConnection cuối file; runner/Hủy, converse, chuẩn bị row, rawOutput |
| `packages/ai/src/run.test.ts` | 1–100 của run.test.ts để đối chiếu seam có sẵn; không coi đây là audit gói A |
| `apps/desktop/src/i18n/vi.ts` | 201–237, 301–302 và lookup mã lỗi mở browser |
| `CLAUDE.md`, `CONTEXT.md`, `apps/desktop/CLAUDE.md` | Toàn bộ nguồn quy tắc/thuật ngữ/hợp đồng package |
| `docs/design/phase-5-ai.md` | **1–430**, đặc biệt §5, §6.1, §7, §12 |
| `docs/design/phase-5-prompts.md` | **1–345**, chữ G5, connection prompt, web@1, danh sách chặn |
| `docs/golden/ai-eval.md` | **1–119**, golden và ngưỡng (không chạy eval) |
| `docs/decisions/0009-ai-copilot-provider-va-guardrail.md` | **1–82**, D-1, G5, W-1 |
| `package.json`, `pnpm-workspace.yaml`, `rust-toolchain.toml`, `vitest.config.ts`, `packages/ai/package.json` | Scripts/toolchain/export/test scope |
| `common/plan.md`, `baseline.md`, `known.md` | Nguồn được Owner cho phép; §1/3/4/5 plan, baseline và KNOWN |

Không mở báo cáo reviewer khác hoặc file review của đợt này trong repo.

## 6. Phụ lục — nguồn probe và lệnh chạy lại

Mọi đường dẫn bắt đầu tại `C:\workspace\deep-review-5\codex\C\`; nguồn test là file đầy đủ bên dưới, không chỉ pseudocode. Không cần key thật, không cần tải dependency mới (cargo dùng `--offline`).

| Nguồn | Nội dung |
|---|---|
| `probe/Cargo.toml` | Harness dependency pin đúng phiên bản; package version 0.1.0 để User-Agent cùng app |
| `probe/src/lib.rs` | `#[path]` tham chiếu ai.rs/storage.rs nguyên bản; không gọi key_entry |
| `probe/tests/review.rs` | 5 test: key/error echo, hai request thật chồng nhau, panic, biên Unicode/JSON/body, số đo, HTTP-only/URL sai |
| `probe/tests/transport.rs` | 3 test TCP localhost; hàm local_post và các chỗ chỉnh đã ghi ở giới hạn kiểm chứng |
| `probe/tests/tls.rs` | Test hàm post nguyên bản với certificate localhost không được tin cậy |
| `key-boundary.mjs` | Resolve TS trong Node, kiểm key giả đi vào output ACCEPTED / raw REJECTED bằng hàm sản phẩm |
| `mutate.mjs` | Bốn patch riêng ai.rs trong thư mục test; tự khôi phục harness và xóa mutant trong finally |
| `setup-local.mjs` | Dựng bản local_post từ hàm post; bản transport.rs hiện tại còn bổ sung đọc đủ body request và log lỗi transport |
| `tls-driver.mjs` | HTTPS local, chạy cargo test với URL ephemeral, đếm request/TLS error rồi đóng server |
| `local-cert.pem`, `local-cert-key.pem` | Certificate/private key **giả** chỉ cho TLS test, tạo bằng .NET CertificateRequest; không phải API key và không đi qua Credential Manager |

```powershell
$env:CARGO_TARGET_DIR = 'C:\workspace\deep-review-5\codex\C\target'
$env:TEMP = 'C:\workspace\deep-review-5\codex\C\probe\temp'
$env:TMP = $env:TEMP
cargo test --offline --manifest-path 'C:\workspace\deep-review-5\codex\C\probe\Cargo.toml' --lib
cargo test --offline --manifest-path 'C:\workspace\deep-review-5\codex\C\probe\Cargo.toml' --test review -- --nocapture
cargo test --offline --manifest-path 'C:\workspace\deep-review-5\codex\C\probe\Cargo.toml' --test transport -- --nocapture
node 'C:\workspace\deep-review-5\codex\C\tls-driver.mjs'
node 'C:\workspace\deep-review-5\codex\C\key-boundary.mjs'
node 'C:\workspace\deep-review-5\codex\C\mutate.mjs'
# Clippy đã chạy một lần trong phiên:
cargo clippy --offline --manifest-path 'C:\workspace\deep-review-5\codex\C\probe\Cargo.toml' --lib --tests -- -W clippy::pedantic
# Tại cwd repo:
pnpm exec vitest run apps/desktop/src/data/ai-tauri.test.ts apps/desktop/src/data/tauri-contract.test.ts apps/desktop/src/routes/settings-ai-view.test.ts
```

`cargo test` không chọn test TLS nếu server chưa chạy: dùng `--lib` hoặc từng `--test` như trên. Không chạy `pnpm eval:ai`.

### Toàn vẹn worktree

- `git diff --exit-code` và `git diff --cached --exit-code`: không diff.
- `git status --short` đầu và cuối cùng ba mục có sẵn: `?? .agents/`, `?? .codex/`, `?? AGENTS.md`.
- Vì worktree đã có các mục untracked khi mở phiên, không thể báo `git status` hoàn toàn sạch. Chúng được giữ nguyên; phiên không xóa file của Owner và không tạo mục mới trong repo.
- SHA vẫn ghim và detached; mutant chỉ ở thư mục probe, đã xóa.

Automatic approval review ban đầu từ chối sao chép toàn cây Rust/config/icon. Đã chuyển sang harness tham chiếu nguồn trong repo; lần kiểm mutant giới hạn ai.rs không chứa key thật đã được chấp thuận và hoàn tất. Không còn bước ghi báo cáo/probe bị chặn.

