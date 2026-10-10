# Deep review Phase 5 — gói C (Rust) — DeepSeek

- **SHA ghim:** `0df3606fb783cc89b1b9c413c02810340e273a4f` (kiểm `git rev-parse HEAD` đầu phiên, khớp).
- **`git status --short` đầu phiên:** `?? opencode.json` (đúng như quy tắc cho phép).
- **Phạm vi gói C (theo plan §3):** `apps/desktop/src-tauri/src/ai.rs`, phần AI của `lib.rs`, `Cargo.toml`, `tauri.conf.json` (CSP), `capabilities/*.json`; trọng tâm: key chỉ ở Credential Manager, URL cố định, header `x-opencode-session` / `User-Agent`, timeout 120 s / Hủy / `AI_BUSY`, ánh xạ mã HTTP → mã lỗi §5.3, `ureq` TLS / redirect / giới hạn đọc, `open_chatgpt` §5.4, clippy pedantic.
- Mọi `path:dòng` dưới đây đã đọc lại đúng tại SHA `0df3606`.

## Phạm vi đã đọc

### Tài liệu chuẩn (đọc trước, theo yêu cầu §5 đầu prompt)

| File | Dòng đã đọc |
|---|---|
| `C:\workspace\deep-review-5\common\plan.md` | 1–119 (cả file) |
| `C:\workspace\deep-review-5\common\baseline.md` | 1–29 (cả file) |
| `C:\workspace\deep-review-5\common\known.md` | 1–104 (cả file) |
| `CONTEXT.md` | 1–46 (cả file) |
| `docs/design/phase-5-ai.md` | 1–430 (cả file; trọng tâm §5.1–5.4 dòng 132–182, §12 dòng 377) |
| `docs/design/phase-5-prompts.md` | 1–345 (cả file; §6a `web@1`, §7–§8 để đối chiếu) |
| `docs/golden/ai-eval.md` | 1–119 (cả file) |
| `docs/decisions/0009-ai-copilot-provider-va-guardrail.md` | 1–82 (D-1 dòng 37–49, G5 dòng 51–58, W-1 dòng 60–82) |
| `docs/decisions/0005-tech-stack-tauri-2.md` | dòng 40–41 (phụ lục ghim T-164) |
| `apps/desktop/CLAUDE.md` | 1–54 (cả file) |

### Mã trong phạm vi gói (đọc đủ)

| File | Dòng | Ghi chú |
|---|---|---|
| `apps/desktop/src-tauri/src/ai.rs` | 1–889 (cả file, gồm `#[cfg(test)] mod tests` 364–889) | toàn bộ logic AI |
| `apps/desktop/src-tauri/src/lib.rs` | 1–205 (cả file) | 6 lệnh AI dòng 132–186, đăng ký handler 188–205 |
| `apps/desktop/src-tauri/src/main.rs` | 1–6 | |
| `apps/desktop/src-tauri/build.rs` | 1–3 | |
| `apps/desktop/src-tauri/Cargo.toml` | 1–32 | ghim phiên bản dòng 16–25 |
| `apps/desktop/src-tauri/tauri.conf.json` | 1–31 | CSP dòng 24 (không đổi so Phase 4 — xác nhận bằng diff) |
| `apps/desktop/src-tauri/capabilities/default.json` | 1–7 | không đổi so Phase 4 |
| `apps/desktop/src-tauri/src/storage.rs` | 370–429 + các dòng khớp `explorer` / `explorer_arg` | chỗ `chatgpt_command` nối vào |
| `apps/desktop/src-tauri/Cargo.lock` | mục `ureq`/`ureq-proto` 3755–3782 + diff `3e84ce8..0df3606` toàn bộ | xác nhận cây phụ thuộc |

### Đối chiếu hợp đồng phía webview (đọc để kiểm khớp, không sửa)

| File | Dòng |
|---|---|
| `apps/desktop/src/data/ai-tauri.ts` | 1–75 (cả file) |
| `apps/desktop/src/data/tauri-contract.test.ts` | 1–195 (cả file) |
| `packages/ai/src/errors.ts` | 1–46 (cả file) |
| `apps/desktop/src/routes/settings-ai-view.ts` | 1–45 (`checkKey`, `KEY_CHARS`) |
| `packages/ai/src/run.ts`, `settings.ts`, `schema.ts`, `models.ts` | các dòng khớp `reasoning` (grep) |
| `apps/desktop/src/i18n/vi.ts` | các dòng `aiError.*` 223–234 |
| `apps/desktop/src/data/ai-analysis.ts`, `routes/customers/ai-panel-view.ts`, `KycIntelligence.tsx`, `KycWebSession.tsx`, `KycExtraction.tsx`, `SettingsAi.tsx` | các dòng khớp `AiErrorCode` / `aiError` (grep) |

### Lệnh đã chạy (trên repo, chỉ đọc + build vào `target/` bị ignore)

| Lệnh | Kết quả |
|---|---|
| `git rev-parse HEAD` | `0df3606fb783cc89b1b9c413c02810340e273a4f` |
| `cargo test --lib` (apps/desktop/src-tauri) | **73 passed; 0 failed** (0,64 s) |
| `cargo test --lib ai::` | **23 passed; 0 failed** (log `C\cargo-test-ai.log`) |
| `cargo clippy -W clippy::pedantic` | **lỗi cú pháp lệnh**: cargo-clippy 0.1.98 cần `--` (log `C\clippy-pedantic.log`) |
| `cargo clippy -- -W clippy::pedantic` | xong; 14 cảnh báo lib + 1 bin + 1 build script, đều thuộc nhóm style (log `C\clippy-pedantic-run.log`; danh sách ở Phụ lục B) |
| `git diff --stat 3e84ce8..0df3606 -- apps/desktop/src-tauri` | chỉ `Cargo.lock`, `Cargo.toml`, `src/ai.rs` (mới), `src/lib.rs`; `tauri.conf.json` / `capabilities` **không đổi** |
| Probe crate riêng (Phụ lục A) | 23 test chép + 5 test tích hợp local-host, xanh; các log PROBE ở Phụ lục A |

## Phát hiện

### DS-C1

```
ID: DS-C1
Mức: Low
Trục: E (kèm C)
Vị trí: apps/desktop/src-tauri/src/ai.rs:348 (0df3606); đối chiếu spec docs/design/phase-5-ai.md:154
Tình trạng: CONFIRMED
```

**Mô tả:** Thân bài trả lời **đúng bằng** 2 MB (2 097 152 byte) bị từ chối `AI_BAD_RESPONSE`, trong khi spec viết "đọc tối đa 2 MB; **vượt** → `AI_BAD_RESPONSE`" và comment `ai.rs:24–25` viết "a **longer** one". Nguyên nhân: `ureq` 3.4.2 `.limit(MAX_BODY)` dùng `LimitReader` trả `Error::BodyExceedsLimit` khi `left == 0` mà `read_to_vec` luôn đọc thêm một lần để dò EOF (source crate ngoài repo: `…\.cargo\registry\src\index.crates.io-…\ureq-3.4.2\src\body\limit.rs`), nên biên thật là **≤ MAX_BODY − 1**. Hệ quả kèm: nhánh tự kiểm `if body.len() as u64 > MAX_BODY` ở `ai.rs:218` thực tế không bao giờ chạy qua đường `post` (chỉ chạy khi test gọi thẳng `reply`).

**Tái hiện / bằng chứng (chạy trên bản chép `ai.rs`, không sửa repo — Phụ lục A):**
- Bản chép nguyên trạng (`C\probe-mut`, target riêng):
  - `2097151` byte (= 2 MB − 1) → `Ok((500, body 2097151))` → `reply` → `AI_HTTP` (test xanh).
  - `2097152` byte: `PROBE exactly-2MB: rejected with AI_BAD_RESPONSE`.
  - `2097153` byte: `PROBE 2MB+1: rejected with AI_BAD_RESPONSE`.
  - 200 JSON hợp lệ đúng 2 MB: `PROBE valid-json exactly-2MB: rejected with AI_BAD_RESPONSE` (log `C\probe-mut-nocapture.log`).
- Bản chép chỉ đổi `.limit(MAX_BODY)` → `.limit(MAX_BODY + 1)` (`C\probe-fix`, target riêng): `PROBE exactly-2MB: accepted, status 500, len 2097152` · `PROBE valid-json exactly-2MB: accepted, status 200, len 2097152` · `PROBE 2MB+1: rejected with AI_BAD_RESPONSE` (log `C\probe-fix-target.log`).

**Ảnh hưởng:** Thực tế gần như bằng 0 — trả lời OpenAI-compatible của app cỡ vài chục KB; chỉ đúng-cỡ-2 MB mới lệch, và khi lệch thì cũng trả một mã lỗi "đọc không được" mà spec đã dành cho "> 2 MB". Không mất dữ liệu, không lộ dữ liệu. Nhưng là lệch biên giữa code và spec/comment, và làm một lớp kiểm (`ai.rs:218`) thành vô hiệu trên đường thật — đáng sửa 1 dòng kèm test.

**Đề xuất:** Đổi `ai.rs:348` thành `.limit(MAX_BODY + 1)` (giữ `reply` kiểm `> MAX_BODY` làm lớp hai; đã đo: ≤ 2 MB đọc được, > 2 MB vẫn `AI_BAD_RESPONSE`), hoặc giữ nguyên và sửa chữ comment/spec cho đúng "≥ 2 MB". Cỡ: 1 dòng + 1 ca test (~5–10 dòng SP).

### DS-C2

```
ID: DS-C2
Mức: Low
Trục: T
Vị trí: apps/desktop/src-tauri/src/ai.rs:319–352 (`post`), danh sách test 364–889 (0df3606)
Tình trạng: CONFIRMED
```

**Mô tả:** Cấu hình HTTP thật của `post` (timeout 120 s / 10 s, `http_status_as_error(false)`, `https_only(true)`, `max_redirects(0)`, `.limit(2 MB)`) **không có test nào chạy**, vì 23 test Rust chỉ gọi `reply` / `check` / `complete` với closure giả ("dữ liệu mẫu, không gọi mạng" — đúng spec §12) và webview test `tauri-contract.test.ts` chỉ so **chữ** trong file nguồn. Đã thử phá: bỏ `.http_status_as_error(false)` → **cả 23 test unit vẫn xanh**, trong khi hành vi thật đổi: 401/403/429/5xx bị `transport_error` `_` nuốt thành `AI_NETWORK` thay vì ánh xạ §5.3. Đây cùng lớp rủi ro với DS-C1 (biên 2 MB chỉ lộ ra khi có HTTP thật). Hai mutation đối chứng chứng minh bộ test bắt tốt phần logic: bỏ `402` khỏi ánh xạ → `http_statuses_map_to_their_codes_with_the_server_message` đỏ; bỏ che key → `no_error_carries_the_key` đỏ.

**Tái hiện / bằng chứng (bản chép, Phụ lục A):**
- `C\probe-mut-m1.log`: M1 (bỏ 402) → `FAILED … left: AI_HTTP … right: AI_RATE_LIMITED` (đối chứng: test bắt được).
- `C\probe-mut-m2.log`: M2 (bỏ `message.replace(key, "***")`) → `no_error_carries_the_key FAILED` (đối chứng: test bắt được).
- `C\probe-mut-m3.log`: M3 (bỏ `.http_status_as_error(false)`) → `cargo test --lib ai::` = **23 passed**; `cargo test --test local_http statuses_map…` = `FAILED … /err/401: 4xx/5xx must come back as a response, got AiError { code: "AI_NETWORK", http_status: None, message: None }`.

**Ảnh hưởng:** Không phải lỗi hiện tại; là độ phủ test: một sửa đổi vô ý ở 5 dòng cấu hình (`ai.rs:325–332`) đổi an toàn / ánh xạ lỗi mà `pnpm verify:rust` vẫn xanh. Gói C được plan giao đúng vùng này ("`ureq` cấu hình TLS, redirect, giới hạn kích thước đọc").

**Đề xuất:** Thêm test hợp đồng nguồn theo đúng mẫu `tauri-contract.test.ts` (đọc `ai.rs`, khẳng định có `.timeout_global(Some(TIMEOUT))`, `.timeout_connect(Some(CONNECT_TIMEOUT))`, `.http_status_as_error(false)`, `.https_only(true)`, `.max_redirects(0)`, `.limit(...)`) — rẻ, không gọi mạng; hoặc (đầy đủ hơn) một test tích hợp `#[ignore]`/feature dựng server local 127.0.0.1 như Phụ lục A. Cỡ: ≤ 30 dòng SP cho phương án nguồn, ~100–150 dòng cho phương án server local.

## Bảng đếm mức × trục

| Mức | E | G | C | D | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | | 0 |
| High | | | | | | | | | | 0 |
| Medium | | | | | | | | | | 0 |
| Low | 1 (DS-C1) | | | | | | | 1 (DS-C2) | | 2 |
| Nit | | | | | | | | | | 0 |

(DS-C1 gắn `E`, có kèm khía cạnh `C` đã ghi trong mục; không đếm hai lần.)

## Đã xét, không thấy

- **E — Edge case (đã xét kỹ):** `check` biên `sessionId` 1 / 64 / 65 / rỗng / ký tự lạ `_ . khoảng trắng` / `\r\n` / tiếng Việt, `plan` sai hoa-thường, `model` rỗng, `role` sai (`tool`, `System`), `messages` rỗng, `maxTokens` 0 / 1 / 16 000 / 16 001, tổng ký tự 200 000 (đếm bằng `chars()`, Unicode "é" — test `the_limits_themselves_are_allowed`, `wrong_arguments_…`, chạy xanh). Biên thân bài 2 MB ± 1, chuyển hướng 302, thân không phải JSON, `choices` thiếu `usage` / `content` null / `content` số, thông điệp lỗi server 250 ký tự (cắt 200 theo code point): unit test + probe local (Phụ lục A) xanh, trừ DS-C1. Key dán có `\r\n` giữa: probe cho `Err(AI_NETWORK)`, server nhận **0** request, không panic, không tiêm header (`http::HeaderValue` từ chối CR/LF); UI đã chặn trước bằng `KEY_CHARS` (`settings-ai-view.ts:22,34`) → xét là phòng thủ sâu, không báo. Hủy / tải lại webview / thay DB khi AI chạy: cờ `Busy` giữ tới khi closure `spawn_blocking` kết thúc (không phụ thuộc webview), `ai_complete` không lấy `DATA_LOCK` nên không chặn `db_save`/`db_backup` (`lib.rs:22–26`).
- **G — Guardrail AI:** Rust không chứa V1–V7 (ở `packages/ai`, gói A); trong phạm vi C đã kiểm: Rust trả `content` nguyên văn không cắt/sửa/thêm JSON; không lệnh nào của Rust ghi dữ liệu KYC hay `ai_analyses` (danh sách handler `lib.rs:190–202` chỉ có file I/O + AI); không có đường "AI tự ghi"; `AI_BUSY` chặn cả sau Hủy (test `a_second_request_while_one_runs_is_busy…`); Mock không đi qua Rust (không có nhánh Mock trong Rust). Không thấy gì.
- **C — Đúng hợp đồng:** đối chiếu §5.1 bảng lệnh / tham số với `lib.rs:136–186` và `tauri-contract.test.ts:17–23, 158–194`: tên lệnh, tham số camelCase, hình dạng `{code, httpStatus?, message?}` / `{content, promptTokens, completionTokens}` khớp; `AI_ERROR_CODES` (10 mã) + `AI_OPEN_BROWSER` (đi đường boolean `openChatGpt()`), `vi.ts:223–234` có đủ thông điệp + `aiError.GENERAL` cho `AI_BAD_REQUEST`; `reasoning` được `run.ts:157` đổi `DEFAULT`→`null` rồi `ai-tauri.ts:69` hạ chữ thường, khớp "Rust gửi nguyên si" của `body()`; `KEY_SERVICE`/`KEY_USER`, hai URL hằng, `User-Agent` phiên bản khớp §5.1. Lệch duy nhất: biên 2 MB (DS-C1). Không thấy gì khác.
- **D — Dữ liệu:** Rust không mở/ghi DB, không tạo file (chỉ `explorer` mở hai thứ: thư mục exports/backups — không đổi — và `https://chatgpt.com/`); key không đi vào `settings`/backup (chỉ Credential Manager, không lệnh đọc ra webview — `ai_key_status` trả `bool`); lỗi keyring bị bỏ chi tiết (`keyring_error`, `ai.rs:298`) nên không lộ bytes. `ai_analyses`/migration/seed không thuộc C. Không thấy gì.
- **S — An toàn:** key: chỉ nằm trong `Authorization: Bearer` gửi tới đúng URL hằng; không vào lỗi (test `no_error_carries_the_key` + probe che key thật qua socket, `probe-mut-nocapture.log`), không vào log (grep `println!|eprintln!|dbg!|log::|tracing` trong `src-tauri` = 0), không lệnh nào trả key. TLS: `ureq` default `rustls` + `webpki-roots`, `gzip`, không native-tls/openssl (Cargo.lock diff chỉ thêm ring/rustls/webpki/subtle/zeroize…); `https_only(true)`; không follow redirect (302 trả nguyên trạng → `AI_HTTP`, probe đếm đúng 1 request); thân đọc tối đa 2 MB (DS-C1); timeout toàn cục 120 s phủ cả đọc thân (đọc doc source crate ngoài repo `…\ureq-3.4.2\src\config.rs` dòng 720–726: "end-to-end … finishing reading the response body"), kết nối 10 s. `open_chatgpt`: không nhận tham số, URL hằng `CHATGPT_URL` (`ai.rs:16`), test so cả program (`%SystemRoot%\explorer.exe`) lẫn đúng một arg. CSP `connect-src 'self' ipc: http://ipc.localhost` **không đổi** (diff xác nhận) nên webview không gọi được mạng; `capabilities/default.json` không đổi, không mở quyền mới. Prompt injection từ ghi chú / câu trả lời dán: Rust chỉ chở chữ hai chiều, không render (việc hiển thị ở D gói UI). Không thấy gì ngoài các ghi chú xét riêng.
- **P — Hiệu năng:** không có vòng lặp nóng; chi phí duy nhất là chờ mạng, bị chặn trên 120 s; bộ nhớ bị chặn trên bởi `MAX_BODY` (2 MB) và `MAX_MESSAGE_CHARS` (200 000 ký tự, kiểm trước khi gọi); không cấp phát theo số bản ghi. Đo được: probe local 5 test hết 0,05 s (`probe-mut-baseline.log`), 73 test Rust 0,64 s — không có bất thường. Không thấy.
- **B — Bloat:** các hằng / hàm AI đều có nơi dùng (hằng hiện ở test hợp đồng + code; `Busy`/`Running` dùng; `transport_error` dùng); không export chết trong `ai.rs` (11 hằng mã lỗi đều được `tauri-contract.test.ts:188–193` quét); điểm trùng duy nhất là `reply`'s `> MAX_BODY` với `.limit` của `post` — đã gộp vào DS-C1 (không báo riêng); `keyring_error(_: KeyringError)` bỏ tham số là có chủ ý (che dữ liệu). Không thấy gì khác.
- **T — Test:** mutation M1/M2 đỏ như kỳ vọng; M3 lộ khoảng trống config (DS-C2). Mặt khác test bám sát hành vi (biên, mask, cờ busy 4 đường thoát + panic, ánh xạ vận chuyển bằng dữ liệu mẫu). Không gọi mạng thật (đúng spec §12). Không thấy gì ngoài DS-C2.
- **A — Trợ năng / i18n:** gói C không có UI; đã kiểm mọi mã lỗi Rust có đường dịch (`vi.ts:223–234`, `aiError.GENERAL` cho `AI_BAD_REQUEST`, `AI_OPEN_BROWSER` đi nhánh boolean → dòng "4c" của panel). Không thấy.

## Phụ lục A — nguồn test tạm (thư mục `C:\workspace\deep-review-5\deepseek\C\`)

Không sửa file nào trong repo. Bản chép dùng để chạy:

- `probe\` — crate `probe-ai` 0.0.1: `src\ai.rs` là **bản chép nguyên** `ai.rs@0df3606`, chỉ đổi duy nhất `.https_only(true)` → `.https_only(false)` (có ghi chú `// PROBE` trong file) để gọi được server HTTP local; `src\storage.rs` chỉ chép hàm `explorer` (dòng 399–412 repo); `tests\local_http.rs` dựng server HTTP local 127.0.0.1 (mini, tự viết) phục vụ: 200 JSON hợp lệ, 401/402/403/429/500, 302 + `Location`, thân đúng `n` byte (200/500), echo key trong message lỗi, và ghi lại nguyên văn request nhận được.
- `probe-mut\` — bản chép của `probe\` để chạy **mutation** (M1/M2/M3); `src\ai.rs.pristine` là bản gốc để hoàn nguyên; mỗi lần chạy xong đã hoàn nguyên.
- `probe-fix\` — bản chép của `probe\` với đúng một sửa: `.limit(MAX_BODY)` → `.limit(MAX_BODY + 1)`, để kiểm chứng đề xuất DS-C1.
- Target dir riêng cho từng crate (`probe-target\`, `probe-mut-target\`, `probe-fix-target\`) để artifact không lẫn; chạy `cargo test --offline` (không mạng) với `CARGO_TARGET_DIR` trỏ vào đó.

Log (đều trong `C\`):

| Log | Nội dung |
|---|---|
| `cargo-test-ai.log` | `cargo test --lib ai::` trên repo: 23 passed |
| `probe-run.log` | lần chạy đầy đủ đầu (23 test chép + 4 test tích hợp) |
| `probe-mut-baseline.log` | baseline `probe-mut`: 23 + 5 test xanh |
| `probe-mut-nocapture.log` | PROBE: exactly-2MB rejected; CRLF key → `Err("AI_NETWORK")`, 0 request |
| `probe-limit-boundary.log` | PROBE biên (bản nguyên) |
| `probe-fix-target.log` | PROBE trên bản `limit + 1`: exactly-2MB accepted, 2MB+1 rejected |
| `probe-mut-m1.log` | M1 đỏ (đối chứng) |
| `probe-mut-m2.log` | M2 đỏ (đối chứng) |
| `probe-mut-m3.log` | M3: unit 23 xanh, tích hợp đỏ (`/err/401` → `AI_NETWORK`) |
| `clippy-pedantic.log` | `cargo clippy -W clippy::pedantic` (nguyên văn kế hoạch) lỗi cú pháp lệnh |
| `clippy-pedantic-run.log` | `cargo clippy -- -W clippy::pedantic` (cần `--` với clippy 0.1.98) |

Cách chạy lại bản chép (ví dụ): `cd C:\workspace\deep-review-5\deepseek\C\probe-mut; $env:CARGO_TARGET_DIR="C:\workspace\deep-review-5\deepseek\C\probe-mut-target"; cargo test --offline --test local_http -- --nocapture`.

## Phụ lục B — clippy pedantic (chạy một lần theo §3 dòng C)

Kết quả: **14 cảnh báo `lib` + 1 `bin` + 1 `build script`, toàn nhóm style**, không có cảnh báo đúng-sai:

- `build.rs:2:5`, `main.rs:5:5` — `semicolon_if_nothing_returned`.
- `ai.rs:12:31`, `32:33`, `84:47`, `233:33` — `doc_markdown` (thiếu backtick quanh `OpenCode`, `User-Agent`, …).
- `ai.rs:100:5` — `struct_field_names` (`completion_tokens` trong `Completion`).
- `storage.rs:63:29` — `redundant_closure` (có từ Phase 1–4, không do Phase 5).
- `lib.rs:66:16` — `cast_possible_truncation` (`as_secs() as i64`, có từ Phase 1–4).
- `lib.rs:105:26`, `120:22`, `163:20` — `needless_pass_by_value` (tham số lệnh Tauri `String` theo hợp đồng invoke; hai cái đầu có từ Phase 1–4).
- `lib.rs:132:25`, `161:16`, `178:61` — `doc_markdown`.
- `lib.rs:188:1` — `missing_panics_doc` (`run()` dùng `.expect`).

Ghi chú phương pháp: lệnh viết đúng nguyên văn kế hoạch (`cargo clippy -W clippy::pedantic`) bị chính `cargo-clippy` 0.1.98 hiểu `-W` là cờ của `cargo check` và từ chối; bản chạy thật dùng `cargo clippy -- -W clippy::pedantic`. `pnpm verify:rust` (clippy mặc định `--lib --tests -D warnings` + `cargo test`) vẫn là cổng chính, xanh theo baseline.

## `git status --short` cuối phiên

```
?? opencode.json
```

Chỉ còn `opencode.json` (đúng quy tắc); các lần `cargo test` / `cargo clippy` chỉ ghi vào `apps/desktop/src-tauri/target\` (bị ignore), bản chép / probe / log đều nằm trong `C:\workspace\deep-review-5\deepseek\C\`. Không đọc `claude\`, `codex\`, `muse\`.

