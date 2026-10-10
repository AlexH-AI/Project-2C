# Deep review Phase 5 — gói C (Rust) — Claude

- **Ngày:** 10/10/2026 · **SHA:** `0df3606` (đã kiểm `git rev-parse HEAD` = `0df3606fb783cc89b1b9c413c02810340e273a4f` đầu và cuối phiên) · worktree `C:\workspace\Project-2C-review`, chỉ đọc; cuối phiên `git status --short` rỗng.
- **Không gọi dịch vụ AI thật:** không chạm Credential Manager (không đọc / ghi key), không gọi opencode.ai, không mở chatgpt.com. Mọi probe dùng server TCP / HTTP local tự dựng.
- **Cách probe:** crate riêng `claude\C\probe` nạp **nguyên văn** `src-tauri/src/ai.rs` và `storage.rs` của repo bằng `#[path = "…"]` (không chép, không sửa), nên `ai::post`, `ai::reply`, `ai::clean_key`, `ai::transport_error` là code thật. Riêng các probe cần server HTTP thường dùng `post_http`: bản chép của `ai::post` chỉ khác `https_only(false)`, vì `ai::post` chỉ nói HTTPS và server TLS local không được `webpki-roots` tin. Đột biến test chạy trên một **bản chép** `ai.rs` trong `claude\C\mut` (repo không bị sửa lần nào).
- Gói trước: CL-A4 (câu trả lời bị cắt do `max_tokens`) và CL-A9 (ghi chú rất dài → `AI_BAD_REQUEST`) liên quan một phần, chỉ dẫn ID.

## 1. Phạm vi đã đọc

| File (0df3606) | Dòng | Ghi chú |
|---|---|---|
| `apps/desktop/src-tauri/src/ai.rs` | 1–889 (toàn bộ, gồm 23 test) | file mới Phase 5 |
| `apps/desktop/src-tauri/src/lib.rs` | 1–205 (toàn bộ; phần AI 24–26, 132–186, 197–201) | diff Phase 5 `git diff 3e84ce8..0df3606` |
| `apps/desktop/src-tauri/src/storage.rs` | 380–412 (`explorer_arg`, `explorer`, dùng lại cho `open_chatgpt`) | Phase 1–4 nối vào |
| `apps/desktop/src-tauri/Cargo.toml`, diff `Cargo.lock` (15 crate mới) | toàn bộ | |
| `apps/desktop/src-tauri/tauri.conf.json` (CSP), `capabilities/default.json`, `build.rs` | toàn bộ | không đổi trong Phase 5 (diff rỗng) |
| Phía gọi: `apps/desktop/src/data/ai-tauri.ts` (1–79), `ai-tauri.test.ts` (lướt), `packages/ai/src/errors.ts`, `run.ts` 140–200 / 375–400, `prompts/connection.ts`, `routes/settings-ai-view.ts` 15–45, `routes/SettingsAi.tsx` 140–200, `i18n/vi.ts` 222–234 | | để đối chiếu hợp đồng mã lỗi / key |
| Spec / ADR: `phase-5-ai.md` §1, §3, §3.1, §4, §5 (toàn bộ), §6.1; `phase-5-prompts.md` dòng 20, 195; ADR-0009 phụ lục D-1, W-1; ADR-0005 dòng 39–41 | | |
| Nguồn thư viện (registry, chỉ đọc): `ureq-3.4.2` `config.rs`, `body/mod.rs`, `body/limit.rs`, `proxy.rs`, `run.rs`; `windows-native-keyring-store-1.1.0` `lib.rs`, `store.rs`, `utils.rs`; `tauri-2.12.1` `webview/mod.rs` (kiểm ACL lệnh theo origin) | | |

Đã chạy: `cargo test --offline` trong repo (73 passed); `cargo clippy --all-targets -- -W clippy::pedantic` một lần (log `claude\C\clippy-pedantic.log`, 17 cảnh báo, 0 lỗi, mục 4).

## 2. Phát hiện

### CL-C1 — Trần 2 MB đo trên byte đã nén: trả lời gzip được giải nén không giới hạn vào RAM

```
ID: CL-C1
Mức: Medium
Trục: S / C
Vị trí: apps/desktop/src-tauri/src/ai.rs:345-350 (post: .with_config().limit(MAX_BODY).read_to_vec()), ai.rs:218 (reply kiểm lại sau khi đã nạp), Cargo.toml:22 (ureq feature mặc định có gzip)
Tình trạng: CONFIRMED
Mô tả: ureq 3.4.2 gửi `accept-encoding: gzip` (feature mặc định đã duyệt ở ADR-0005) và đặt `LimitReader` dưới bộ giải nén (`body/mod.rs:519-526`, `801-807`), nên `limit(MAX_BODY)` chỉ chặn 2 MB **byte trên đường truyền**; thân đã giải nén đọc hết vào `Vec` không trần. `reply()` mới so `body.len() > MAX_BODY` sau khi toàn bộ đã nằm trong RAM. Spec §5.2 "Thân trả lời đọc tối đa 2 MB" không đúng với trả lời nén.
Tái hiện / bằng chứng: probe P5 (`probe_c.exe p5`), server local trả `Content-Encoding: gzip`, cấu hình ureq giống hệt `ai::post` (trừ https_only), rồi gọi `ai::reply` thật:
  control: plain 2097153 B → Err("AI_BAD_RESPONSE")         (trần chặn đúng khi không nén)
  gzip    65211 B trên dây → read_to_vec 67 108 864 B, 46 ms
  gzip   521481 B trên dây → read_to_vec 536 870 912 B, 380 ms; ai::reply → AI_BAD_RESPONSE
  Tỉ lệ ≈ 1 030 : 1 → 2 MB nén cho ≈ 2 GB trong RAM (chưa chạy mức này để không treo máy; Vec tăng gấp đôi nên đỉnh có thể tới ~4 GB).
  Request head thật (probe P4) có `accept-encoding: gzip`.
Ảnh hưởng: chỉ khi server (hoặc ai đó có chứng chỉ công khai hợp lệ cho opencode.ai) trả thân nén lớn — xác suất thấp vì TLS + webpki-roots. Khi xảy ra: cấp phát thất bại làm tiến trình abort (release `panic = "abort"`), app đóng giữa lúc RE đang làm; dữ liệu đã lưu không mất (ghi file nguyên tử) nhưng thao tác chưa lưu thì mất. Tối thiểu là trái hợp đồng §5.2.
Đề xuất: đọc qua `response.body_mut().as_reader().take(MAX_BODY + 1)` (giới hạn sau giải nén) rồi coi `len > MAX_BODY` là `AI_BAD_RESPONSE`, hoặc tắt gzip bằng `.accept_encoding(...)`/feature (đổi feature = hỏi G4). Thêm test với server local (xem CL-C4). ≈ 10–20 dòng SP + test.
```

### CL-C2 — Hết hạn kết nối 10 s (kể cả bắt tay TLS) báo `AI_TIMEOUT` "AI không trả lời trong 2 phút"

```
ID: CL-C2
Mức: Low
Trục: C
Vị trí: ai.rs:257-263 (transport_error: Timeout(_) → AI_TIMEOUT), ai.rs:23 (CONNECT_TIMEOUT 10 s), test ai.rs:770 khẳng định Timeout::Connect → AI_TIMEOUT; apps/desktop/src/i18n/vi.ts:228
Tình trạng: CONFIRMED
Mô tả: Spec §5.3: `AI_TIMEOUT` = "quá 120 s", `AI_NETWORK` = "DNS / TLS / mất kết nối". `transport_error` gộp mọi `ureq::Error::Timeout(_)`, nên hết hạn kết nối 10 s (ureq tính cả bắt tay TLS vào `connect`, `config.rs` doc "including any TLS handshake") ra `AI_TIMEOUT`, câu UI "AI không trả lời trong 2 phút." hiện sau 10 giây.
Tái hiện / bằng chứng: probe P3, server local nhận TCP rồi im lặng, gọi `ai::post` thật: `result=Err("AI_TIMEOUT") after 10.0 s`. Đột biến "Timeout::Connect → AI_NETWORK" bị test `transport_errors_map_to_timeout_network_or_bad_response` giết, tức test đang chốt hành vi trái spec.
Ảnh hưởng: RE / Owner ở mạng chặn gói tin (tường lửa văn phòng, captive portal, proxy treo) thấy "AI không trả lời trong 2 phút" sau 10 s, đi tìm lỗi ở model thay vì mạng.
Đề xuất: `Timeout(Global)` (và `RecvBody` / `RecvResponse` nếu có) → `AI_TIMEOUT`; `Timeout(Connect | Resolve)` → `AI_NETWORK`; sửa test. ≈ 5 dòng SP.
```

### CL-C3 — "Kiểm tra kết nối" với Mức suy luận Cao có thể báo `AI_BAD_RESPONSE` dù kết nối được

```
ID: CL-C3
Mức: Low
Trục: C / E
Vị trí: ai.rs:222-224 (`content` phải là chuỗi, `null` → AI_BAD_RESPONSE, không đọc `finish_reason`); packages/ai/src/prompts/connection.ts:12 (`maxTokens: 64`); spec phase-5-ai.md:118; phase-5-prompts.md:20
Tình trạng: PLAUSIBLE (không gọi server thật; bằng chứng là số đo trong spec)
Mô tả: Kiểm tra kết nối gửi `max_tokens` 64 kèm `reasoning` theo Cài đặt (prompts:195). Spec §4.2 ghi lần gọi thật T-179 (câu hỏi rất ngắn): `deepseek-v4.1-flash` (model mặc định) dùng **65** token suy luận ở `high` — đã quá 64. API kiểu OpenAI khi hết `max_tokens` trong lúc suy luận trả `finish_reason: "length"` với `content` rỗng hoặc `null`; Rust coi `null` là "Trả lời của OpenCode không đọc được". G5 dòng 20 tự ghi "Model có reasoning có thể tính token suy luận vào trần này, nên để rộng", nhưng trần 64 lại không rộng so với số đo §4.2 → hai tài liệu không khớp nhau.
Tái hiện / bằng chứng: đọc code + test `an_unreadable_reply_is_bad_response` (ai.rs:510, `content: null` → AI_BAD_RESPONSE). Chưa có câu trả lời thật để biết OpenCode trả `null` hay `""` (`""` thì Kiểm tra kết nối vẫn "Kết nối được").
Ảnh hưởng: Owner chọn Mức suy luận Cao rồi bấm Kiểm tra kết nối → có thể thấy lỗi "không đọc được" dù key và mạng đều đúng. Cùng gốc với CL-A4 (Rust không chuyển `finish_reason` lên nên `packages/ai` không phân biệt được "bị cắt").
Đề xuất: sửa trần qua G5 (vd. 512) hoặc gửi Kiểm tra kết nối không kèm `reasoning`; ở Rust có thể trả `finish_reason` cùng `Completion` để `ai` báo đúng lỗi (gộp với CL-A4). Cỡ nhỏ.
```

### CL-C4 — `post()` và các hằng URL / key không có test đỏ khi sai: 14 / 24 đột biến sống

```
ID: CL-C4
Mức: Low
Trục: T
Vị trí: ai.rs:319-352 (post, 0 test), ai.rs:13-14 + test ai.rs:435-441 (so URL với chính hằng), ai.rs:19-20 (KEY_SERVICE / KEY_USER, không test), test ai.rs:789-813 (`no_error_carries_the_key`), lib.rs (không có test nào)
Tình trạng: CONFIRMED
Mô tả: 23 test của `ai.rs` phủ tốt `check`, `body`, `reply`, `Busy`, key store; nhưng cấu hình mạng trong `post` (https_only, không redirect, trần thân, timeout, header Authorization / Content-Type) và các hằng nhận diện không có test nào bắt được khi sai. Đáng chú ý:
  - Đổi `GO_URL` thành URL của Credit: mọi test xanh, vì `each_plan_posts_to_its_own_url` so với chính hằng `GO_URL` (khác `CHATGPT_URL` có test so chuỗi cố định, ai.rs:886). Gói Go sẽ âm thầm trừ credit trả tiền.
  - Đổi `KEY_SERVICE` / `KEY_USER`: xanh; bản cập nhật như vậy làm key đã lưu ở mọi máy "biến mất" (`AI_NO_KEY`).
  - Che key **sau** khi cắt 200 ký tự (lộ một đoạn đầu key): xanh, vì ca `long_echo` (ai.rs:791) chỉ kiểm chuỗi không chứa **nguyên** key — 10 ký tự đầu key vẫn lọt mà test không thấy, đúng điều doc comment ai.rs:234 hứa chặn.
  - `lib.rs`: không test nào nối `AI_RUNNING` (static dùng chung), tên lệnh và tên tham số (`sessionId` → `session_id`) với phía JS; `ai-tauri.test.ts` chỉ kiểm phía JS gọi gì. e2e chạy bản web nên không chạm Rust.
Tái hiện / bằng chứng: `node claude\C\mut\mutate.mjs` (bản chép ai.rs, mỗi đột biến chạy `cargo test --lib ai::`). Sống: redirects 10, https_only false, limit u64::MAX, timeout_global None, timeout_connect None, http_status_as_error true, "Bearer{key}", bỏ content_type, bỏ header phụ, TIMEOUT 12 s, KEY_USER, KEY_SERVICE, GO_URL, che sau khi cắt — 14 dòng "SURVIVED" trong `mutate-out.txt`. Bị giết 10: 402, 403, Busy sau đọc key, guard bỏ ngay, đếm byte thay ký tự, reasoning khi None, usage sai chỗ, Connect timeout, bỏ trim key, model rỗng.
Ảnh hưởng: hồi quy ở phần chạm tiền / bí mật (URL gói, header key, trần thân, che key) chỉ lộ khi Owner gọi thật.
Đề xuất: (1) test URL so chuỗi cố định như `CHATGPT_URL`, và assert `GO_URL != CREDIT_URL`; (2) test hằng `KEY_SERVICE` / `KEY_USER` bằng chuỗi; (3) ca `long_echo` kiểm không còn tiền tố ≥ 4 ký tự của key; (4) tách `post` thành `agent()` + `post_with(agent, …)` để test với server HTTP local (redirect 302 trả về nguyên, thân > 2 MB kể cả gzip — CL-C1, header gửi đi, timeout). ≈ 100–150 dòng test.
```

### CL-C5 — Key lưu với kiểu bền "Enterprise" (đi theo hồ sơ roaming), trái "mỗi máy một key"

```
ID: CL-C5
Mức: Low
Trục: S
Vị trí: ai.rs:303-309 (`store.build(KEY_SERVICE, KEY_USER, None)`); windows-native-keyring-store-1.1.0 src/store.rs:115-119 (thiếu modifier → "Enterprise"), lib.rs:40 của crate
Tình trạng: PLAUSIBLE (đọc nguồn crate; không ghi thử vào Credential Manager theo quy tắc phiên)
Mô tả: Không truyền modifier `persistence` nên mục key được ghi `CRED_PERSIST_ENTERPRISE`. Theo tài liệu Windows (`CREDENTIALW`), kiểu này hiện cho phiên đăng nhập của cùng user **trên máy khác** khi tài khoản có hồ sơ roaming (máy domain). ADR-0009 D-1 mục 4: "chỉ Windows Credential Manager, **mỗi máy một key**"; CLAUDE.md "API key nhập riêng từng máy".
Tái hiện / bằng chứng: nguồn crate `store.rs:115-119` `.unwrap_or("Enterprise")`; `utils.rs:28` `Enterprise = CRED_PERSIST_ENTERPRISE`.
Ảnh hưởng: máy cá nhân / không roaming: như `Local`, không khác gì. Máy công ty có roaming profile (Office Laptop có thể vậy): key OpenCode theo tài khoản sang máy khác trong domain, ra ngoài phạm vi Owner đã chốt.
Đề xuất: `build(KEY_SERVICE, KEY_USER, Some(&HashMap::from([("persistence", "Local")])))`; mục đã lưu kiểu cũ giữ kiểu cũ tới khi ghi lại (crate chỉ áp kiểu khi ghi) → ghi chú "lưu lại key một lần". ≈ 5 dòng + test mock. Cần Owner xác nhận ý "mỗi máy" (G6) trước khi đổi.
```

### CL-C6 — Rust kiểm key / tham số ít hơn webview; key có ký tự lạ cho `AI_NETWORK` ở mọi lần gọi

```
ID: CL-C6
Mức: Nit
Trục: C / E
Vị trí: ai.rs:266-274 (clean_key: chỉ trim + 1–512 ký tự), ai.rs:132-161 (check: không kiểm `reasoning`, `model` không trần độ dài); apps/desktop/src/data/ai-tauri.ts:20 ("Rust checks again"), apps/desktop/src/routes/settings-ai-view.ts:21-22 (JS chặn ngoài ASCII in được)
Tình trạng: CONFIRMED (hành vi Rust); không tới được qua UI hiện nay
Mô tả: Webview từ chối key ngoài `[\x21-\x7e]` (`NOT_ASCII`), Rust thì nhận và lưu. Key như vậy không bao giờ gửi đi được: ký tự điều khiển → `http::Error(InvalidHeaderValue)`, ngoài ASCII (vd. zero-width space, chữ "ă") → `Protocol(BadAuthorizationHeader)`; cả hai thành `AI_NETWORK` "Không kết nối được OpenCode", không gợi ý key sai. `reasoning` là chuỗi bất kỳ được chuyển thẳng lên OpenCode.
Tái hiện / bằng chứng: probe P1 (`ai::clean_key` + `ai::post` thật): 7 / 7 key lạ `clean_key=true`, `post→AI_NETWORK`; LF / CR / NUL / DEL không mở kết nối nào (`connections=0`).
Ảnh hưởng: chỉ khi webview có lỗi (hoặc đường gọi `ai_key_set` mới bỏ `checkKey`). Chốt chặn thứ hai không chặn được điều nó tự nhận.
Đề xuất: `clean_key` thêm luật ASCII in được như `KEY_CHARS` (→ `AI_BAD_REQUEST`); `check` nhận `reasoning` ∈ {low, medium, high}. ≈ 5 dòng + test.
```

### CL-C7 — Thông điệp lỗi của server chỉ che key, không che mã phiên; trả lời lỗi > 2 MB mất mã HTTP

```
ID: CL-C7
Mức: Nit
Trục: C
Vị trí: ai.rs:235-254 (server_message), ai.rs:340-350 (post đọc thân cả khi lỗi HTTP)
Tình trạng: CONFIRMED (P6); phần mã phiên PLAUSIBLE
Mô tả: (a) Spec §5.1 / W-1 mục 7: mã phiên `x-opencode-session` "không ghi vào … thông báo lỗi"; `server_message` chỉ thay key, nên server lặp lại header (lỗi 400 gói Go đã từng nhắc header này, W-1 mục 7) thì mã phiên đi nguyên vào câu lỗi ở Cài đặt → AI. Mã ngẫu nhiên, không có gì của KH, nên chỉ là lệch chữ spec. (b) Trả lời lỗi (vd. 502 của proxy) có thân > 2 MB → `BodyExceedsLimit` → `AI_BAD_RESPONSE` không `httpStatus`, trong khi §5.3 xếp mọi mã non-2xx còn lại vào `AI_HTTP`.
Tái hiện / bằng chứng: P6: `502` + thân 2 097 162 B → `AiError { code: "AI_BAD_RESPONSE", http_status: None }`. P7 (đối chứng): `302` → `AI_HTTP` 302 đúng như test.
Ảnh hưởng: rất hiếm; câu lỗi kém chính xác.
Đề xuất: che thêm `session_id` trong `server_message`; với status non-2xx, lỗi đọc thân vẫn trả `AI_HTTP` + status (thân bỏ). ≈ 10 dòng.
```

## 3. Bảng đếm mức × trục

Mỗi phát hiện đếm ở trục chính (trục đầu tiên).

| Mức \ Trục | E | G | C | D | S | P | B | T | A | Cộng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | | 0 |
| High | | | | | | | | | | 0 |
| Medium | | | | | 1 (C1) | | | | | 1 |
| Low | | | 2 (C2, C3) | | 1 (C5) | | | 1 (C4) | | 4 |
| Nit | | | 2 (C6, C7) | | | | | | | 2 |
| **Cộng** | 0 | 0 | 4 | 0 | 2 | 0 | 0 | 1 | 0 | **7** |

## 4. Đã xét, không thấy

- **E — Edge case:** `check` với phiên rỗng / 65 ký tự / `_` / `.` / CRLF / tiếng Việt, plan sai hoa thường, `max_tokens` 0 / 16 001, 200 000 vs 200 001 ký tự đếm theo ký tự (test sẵn + đột biến "đếm byte" bị giết). Hai lời gọi chồng nhau: `compare_exchange` nguyên tử, lời gọi thứ hai `AI_BUSY` trước khi đọc key (đột biến "Busy sau đọc key" bị giết). Hủy / tải lại webview khi đang chạy: tác vụ `spawn_blocking` chạy tiếp, giữ cờ tới khi xong — đúng P5 / §5.2 (lần gọi sau nhận `AI_BUSY`). Ký tự nửa cặp UTF-16 trong `messages`: serde từ chối (P8) → JS đổi thành `AI_BAD_REQUEST`; không thấy nguồn nào sinh ra (ô nhập trình duyệt không cắt giữa cặp, SQLite lưu UTF-8), nên không báo. Mức 29/02, nửa đêm: Rust AI không xử lý ngày. Key 1 ký tự làm câu lỗi bị che lỗ chỗ (P9 `"Inv***lid…"`): JS không cho key ngắn hơn thực tế, bỏ qua.
- **G — Guardrail AI:** Rust không ghi DB, không có lệnh trả key (`ai_key_status` chỉ trả `bool`, lib.rs:174-176), không thêm `response_format`; validator nằm ở gói A. Không thấy gì thêm.
- **D — Dữ liệu:** lệnh AI không lấy `DATA_LOCK` (lib.rs:24-26) nên không chặn lưu; không ghi file. `open_chatgpt` không dùng cờ `AI_RUNNING` (đúng §5.4). Không thấy.
- **S — An toàn (ngoài C1, C5–C7):**
  - Key: không lệnh nào trả key; `keyring_error` bỏ chi tiết (kể cả `BadEncoding` chứa byte key); `transport_error` chỉ giữ mã; không có logger nào được cài (không `tauri-plugin-log`, không `env_logger`) nên `log::debug!` của ureq là no-op. Che key trước khi cắt 200 ký tự đúng (test đỏ khi đảo thứ tự là không — xem CL-C4).
  - Mạng: hai URL hằng chọn theo `plan`; `https_only(true)` (P2: URL `http://` → `AI_NETWORK`, 0 kết nối); `max_redirects(0)` trả nguyên 3xx (nguồn ureq `config.rs:323-327`, P7) nên header `Authorization` không bao giờ theo redirect; TLS rustls + `webpki-roots` 1.0.9 bundled (không tin kho chứng chỉ hệ thống → proxy chặn TLS của công ty không đọc được key, đổi lại sẽ báo `AI_NETWORK`). Timeout toàn cục bao cả đọc thân: P10, server nhỏ giọt 1 byte / 500 ms, bản chép với trần 5 s → `AI_TIMEOUT` sau 5,0 s. Request head thật (P4): `authorization`, `x-opencode-session`, đúng **một** `user-agent: Project-2C/0.1.0`, `content-type: application/json`, `accept-encoding: gzip`, không có header lạ.
  - Proxy: ureq đọc `ALL_PROXY` / `HTTPS_PROXY` / `HTTP_PROXY` từ biến môi trường (`proxy.rs:222-239`), không đọc proxy hệ thống Windows (feature `win-system-proxy` tắt). Qua proxy vẫn là đường hầm CONNECT + TLS nên key không lộ; mạng bắt buộc proxy hệ thống sẽ báo `AI_NETWORK` — giới hạn vận hành, không phải lỗi an toàn.
  - Header injection: `session_id` chỉ `[A-Za-z0-9-]`; key có CR / LF bị `http` từ chối trước khi mở kết nối (P1).
  - CSP / capabilities: không đổi trong Phase 5 (`git diff 3e84ce8..0df3606` rỗng cho `tauri.conf.json`, `capabilities/`); `connect-src 'self' ipc: http://ipc.localhost` nên webview không gọi được opencode.ai; Tauri 2 từ chối lệnh app từ origin remote khi không có capability `remote` (`webview/mod.rs:2080`).
  - Mở URL ngoài: `open_chatgpt` không nhận tham số, chạy `%SystemRoot%\explorer.exe https://chatgpt.com/` theo đường dẫn đầy đủ (DR-54), không đi qua shell; test so chuỗi URL cố định.
- **P — Hiệu năng (P11, release, máy Home PC):** một `ai::post` tới cổng local nhận rồi đóng (dựng Agent + cấu hình rustls + TCP + TLS hỏng): 0,36 ms / lần; `ai::reply` trên câu trả lời 20 000 ký tự: 17,6 µs; trên 2 000 000 ký tự: 0,91 ms. Dựng Agent mới mỗi lần (không giữ kết nối) tốn một bắt tay TLS ~ trăm ms so với hàng chục giây chờ model → không đáng kể. Exe tăng 1 216 000 B so với Phase 4 (baseline), phần lớn do ring / rustls / webpki-roots đã duyệt G4. Không thấy vấn đề.
- **B — Bloat:** không có export thừa (`ai` là module riêng của crate; mọi `pub` được `lib.rs` hoặc test dùng). `flate2` đã có sẵn từ Tauri trước Phase 5 (không phải crate mới; 15 crate mới trong `Cargo.lock` đều do ureq / rustls / keyring kéo về). Clippy pedantic (17 cảnh báo): phần Phase 5 chỉ có doc thiếu backtick (ai.rs:12, 32, 84, 233; lib.rs:132, 161, 178), `struct_field_names` (ai.rs:100 `completion_tokens` trong `Completion`), `needless_pass_by_value` ở `ai_key_set(key: String)` (lib.rs:163, Tauri cần sở hữu tham số — dương tính giả), `cast_possible_truncation` trong test (ai.rs:523), `semicolon_if_nothing_returned` trong test (ai.rs:864). Không cảnh báo nào là lỗi. Cảnh báo ở `storage.rs` / `lib.rs:66` / `main.rs` / `build.rs` là code Phase 1–4.
- **T — Test (ngoài CL-C4):** 10 / 10 đột biến về logic thuần (`check`, `reply`, `Busy`, key store) bị giết; test không phụ thuộc ngày / thứ tự (mock keyring riêng mỗi test, `Busy::new()` riêng). `cargo test` trong repo: 73 passed.
- **A — Trợ năng / i18n:** Rust không có chuỗi UI; mã lỗi `AI_*` khớp 1-1 với `AI_ERROR_CODES` (`packages/ai/src/errors.ts`) và khóa `aiError.*` trong `vi.ts`; `AI_OPEN_BROWSER` cố ý không vào danh sách vì `openChatGpt` chỉ trả `boolean` (ai-tauri.ts:57-61). Không thấy.
- **KNOWN liên quan, không báo lại:** `storage.rs` `explorer_arg` / `open_lock_file` (#196, #192) — `open_chatgpt` chỉ dùng `explorer()`, không dùng `explorer_arg`. Phạm vi export `run.ts` / hằng 20 000 lặp (#455) thuộc gói A / B.

## 5. Phụ lục — nguồn probe (trong `C:\workspace\deep-review-5\claude\C\`)

| File | Việc |
|---|---|
| `probe\Cargo.toml`, `probe\Cargo.lock` (chép từ repo để ghim cùng bản), `probe\src\main.rs` | Crate probe: `#[path]` tới `ai.rs` / `storage.rs` của repo; P1 key lạ, P2 URL http, P3 server im lặng, P4 request head, P5 gzip, P6 502 lớn, P7 302, P8 nửa cặp UTF-16, P9 key 1 ký tự, P10 thân nhỏ giọt, P11 chi phí cục bộ. Chạy: `cargo build --release --offline` rồi `target\release\probe_c.exe p1 p2 …` |
| `probe-out-1.txt` (P1, P2, P4, P6–P9), `probe-out-2.txt` (P3, P5), `probe-out-3.txt` (P10), `probe-out-4.txt` (P11) | Đầu ra nguyên văn |
| `mut\mutate.mjs`, `mut\ai.orig.rs` (bản chép `ai.rs` @0df3606), `mut\src\` | 24 đột biến trên bản chép, mỗi lần `cargo test --offline --lib ai::`; kết quả `mut\mutate-out.txt` |
| `clippy-pedantic.log` | `cargo clippy --all-targets -- -W clippy::pedantic` (17 cảnh báo, exit 0, 16,9 s) |

`probe\target\` (118 MB) và `mut\target\` (265 MB) là thư mục build, xóa được.

### Đầu ra chính (rút gọn)

```
== P1: keys clean_key accepts, then ai::post (https://127.0.0.1:<port>)
  valid ascii                  clean_key=true  post→AI_NETWORK  connections=2 | ureq: Io(ConnectionAborted)   (server local không nói TLS; đối chứng)
  inner LF (two keys pasted)   clean_key=true  post→AI_NETWORK  connections=0 | ureq: Http(http::Error(InvalidHeaderValue))
  inner CR / NUL / DEL         clean_key=true  post→AI_NETWORK  connections=0 | ureq: Http(http::Error(InvalidHeaderValue))
  zero-width space / BOM / "ă" clean_key=true  post→AI_NETWORK  connections=2 | ureq: Protocol(BadAuthorizationHeader)
== P2: ai::post on an http:// URL → Err("AI_NETWORK") connections=0
== P3: silent server → Err("AI_TIMEOUT") after 10.0 s
== P4: request head: POST … / accept-encoding: gzip / content-length / accept: */* / host / authorization: Bearer <KEY> / x-opencode-session: … / user-agent: Project-2C/0.1.0 / content-type: application/json
== P5: control plain 2097153 B → AI_BAD_RESPONSE
       gzip 65211 B → 67108864 B (46 ms) · gzip 521481 B → 536870912 B (380 ms); ai::reply → AI_BAD_RESPONSE
== P6: 502 + 2097162 B → AiError { code: "AI_BAD_RESPONSE", http_status: None, message: None }
== P7: 302 → AiError { code: "AI_HTTP", http_status: Some(302) }
== P8: "\ud83d\ude00" → Ok · "\ud83d" lẻ → Err("unexpected end of hex escape …")
== P10: trickle, global 5 s → Err("AI_TIMEOUT") after 5.0 s
== P11: post 0.36 ms · reply 20k 17.6 µs · reply 2M 0.91 ms
```

`mutate-out.txt`:

```
402 no longer rate-limited           killed
403 no longer unauthorized           killed
post: redirects followed             SURVIVED
post: https_only off                 SURVIVED
post: no body limit                  SURVIVED
post: no global timeout              SURVIVED
post: no connect timeout             SURVIVED
post: http status as error           SURVIVED
post: Authorization without space    SURVIVED
post: no content type                SURVIVED
post: extra headers dropped          SURVIVED
TIMEOUT 12 s                         SURVIVED
KEY_USER renamed                     SURVIVED
KEY_SERVICE renamed                  SURVIVED
GO_URL typo                          SURVIVED   (GO_URL = URL Credit)
busy taken after the key read        killed
busy guard dropped at once           killed
mask after the cut                   SURVIVED
message chars counted as bytes       killed
reasoning sent even when None        killed
usage read from wrong field          killed
Connect timeout → network            killed     (test chốt hành vi của CL-C2)
clean_key no trim                    killed
model may be empty                   killed
```
