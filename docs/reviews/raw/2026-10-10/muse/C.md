# Deep review Phase 5 — gói C (Rust) — Muse

- SHA ghim: `0df3606fb783cc89b1b9c413c02810340e273a4f` — đã kiểm `git rev-parse HEAD` đầu phiên 10/10/2026, khớp.
- `git status --short` đầu phiên:
  ```
  ?? .agents/
  ?? .codex/
  ?? AGENTS.md
  ?? opencode.json
  ```
- Người review: Muse, phiên độc lập, chỉ đọc repo. Không gọi dịch vụ AI thật, không đọc key,
  không mở báo cáo của bên khác.

Kết luận gói: code Rust chắc, test tốt (23 test AI + contract test phía TS), Owner đã chạy thật
qua exe (T-164/T-178/T-179). Chỉ tìm thấy 3 Nit, không có Critical/High/Medium/Low. Không có gì
chặn G7 từ phía gói C.

## 1. Phạm vi đã đọc

Tài liệu chuẩn (đọc toàn bộ): `CONTEXT.md`, `docs/design/phase-5-ai.md`,
`docs/design/phase-5-prompts.md`, `docs/golden/ai-eval.md`,
`docs/decisions/0009-ai-copilot-provider-va-guardrail.md` (cả phụ lục D-1, G5, W-1),
`apps/desktop/CLAUDE.md`, `common/plan.md`, `common/baseline.md`, `common/known.md`,
`common/build-web.log` (toàn bộ 38 dòng).

Code trong gói (ở SHA trên, số dòng đã đọc lại trước khi ghi báo cáo):

- `apps/desktop/src-tauri/src/ai.rs` — toàn bộ dòng 1–889 (code + test).
- `apps/desktop/src-tauri/src/lib.rs` — toàn bộ dòng 1–205 (trọng tâm phần AI: 24–26, 132–186).
- `apps/desktop/src-tauri/Cargo.toml`, `tauri.conf.json`, `capabilities/default.json` — toàn bộ.
- `apps/desktop/src-tauri/src/storage.rs` — dòng 380–419 (`explorer_arg`, `explorer`, DR-54).

Code nối vào (đối chiếu hợp đồng, đọc vừa đủ):

- `apps/desktop/src/data/ai-tauri.ts` — toàn bộ 1–75 (args gọi sang Rust, bảng mã lỗi).
- `apps/desktop/src/data/tauri-contract.test.ts` — dòng 1–195 (contract JS↔Rust).
- `packages/ai/src/errors.ts` — toàn bộ 1–46 (`AI_ERROR_CODES`).
- `packages/ai/src/run.ts` — đoạn sinh `sessionId` (137–149), `completeRequest` (150–159),
  `converse` (183–199), connection check (386–392), `reasoning` (233, 330).
- `packages/ai/src/models.ts` — danh sách model (25–35); `packages/ai/src/schema.ts` —
  `AI_REASONING_LEVELS` (32–35).
- `apps/desktop/src/routes/settings-ai-view.ts` — `checkKey` (19–36).
- `apps/desktop/src-tauri/Cargo.lock` — version các crate (search + đọc vùng tauri/ureq).
- `apps/desktop/package.json` — dòng `version` (0.1.0).

Nguồn dependency đã đọc (để xác nhận semantics, không phải code repo):

- `tauri-macros 2.6.3` `src/command/wrapper.rs` (dòng 30–104, 440–519): arg mặc định đổi
  sang camelCase.
- `ureq 3.4.2`: `src/body/limit.rs` (toàn bộ, `LimitReader`), `src/body/mod.rs` (495–539,
  `limit()` bọc `LimitReader`), `src/config.rs` (710–779, `timeout_global` end-to-end),
  `src/request.rs` (60–114 `header()` không panic + search vùng `send()`),
  `src/error.rs` (140–169), `src/lib.rs` + `src/run.rs` (gzip mặc định, qua search).
- `windows-native-keyring-store 1.1.0` `Cargo.toml` (toàn bộ): `default-features = false`
  chỉ tắt `search`, kho Windows vẫn đủ.

## 2. Phát hiện

### MS-C1 — Key chứa ký tự xuống dòng: Rust cho lưu, mọi lần gọi sau báo nhầm `AI_NETWORK`

```
ID: MS-C1
Mức: Nit
Trục: C
Vị trí: apps/desktop/src-tauri/src/ai.rs:267 (clean_key), :257 (transport_error), :334 (post)
Tình trạng: CONFIRMED
Mô tả: clean_key chỉ cắt khoảng trắng hai đầu và đếm ký tự, nên key chứa \n ở giữa
  vẫn được lưu; khi gọi, http crate từ chối giá trị header và lỗi rơi vào nhánh
  catch-all thành AI_NETWORK ("Không kết nối được OpenCode") thay vì lỗi key.
Tái hiện / bằng chứng: probe aiprobe gọi hàm post() và transport_error() thật trên bản
  copy nguyên văn ai.rs (SHA256 db2e49c5…, khớp file repo):
  P1 post(newline-key): code=AI_NETWORK elapsed_ms=0
  P1 underlying ureq error (newline): Http(http::Error(InvalidHeaderValue))
  P1 underlying ureq error (crlf): Http(http::Error(InvalidHeaderValue))
  P1 transport_error maps them to: AI_NETWORK / AI_NETWORK
  Lỗi xảy ra trước khi chạm mạng (0 ms), không panic, không chèn header được
  (http crate từ chối \r\n). Xem phụ lục.
Ảnh hưởng: đường UI thật không tới được (settings-ai-view.ts:21-22 đã chặn bằng
  KEY_CHARS /^[\x21-\x7e]+$/ kèm comment thừa nhận "fails only on the call"). Chỉ khi
  gọi ai_key_set trực tiếp (debug, caller tương lai) mới lưu được key kiểu này; sau đó
  mọi ai_complete báo sai mã, gây chẩn đoán nhầm. Không rò rỉ key (transport_error bỏ
  hết chi tiết).
Đề xuất: clean_key từ chối ký tự không in được/khoảng trắng ở giữa, khớp luật UI
  (vd. key.bytes().all(|b| b.is_ascii_graphic())) → AI_BAD_REQUEST ngay khi lưu.
  Cỡ: ~5 dòng + 1 test ~15 dòng (<< 400).
```

### MS-C2 — Body đúng 2 MB bị từ chối ở `post()` trong khi `reply()` chấp nhận

```
ID: MS-C2
Mức: Nit
Trục: E
Vị trí: apps/desktop/src-tauri/src/ai.rs:345 (limit) so với ai.rs:218 (kiểm > MAX_BODY)
Tình trạng: CONFIRMED
Mô tả: LimitReader của ureq báo lỗi khi đọc tới byte thứ MAX_BODY+1, nhưng cũng báo
  lỗi với body đúng bằng MAX_BODY (lần read() tiếp theo sau khi đã đủ 2 MB vẫn gặp
  left == 0). Trong khi reply() chỉ từ chối khi body.len() > MAX_BODY. Hai lớp lệch
  nhau đúng 1 biên.
Tái hiện / bằng chứng: probe chạy LimitReader chép nguyên văn (36 dòng limit.rs) +
  hàm reply() thật:
  P2 limit=2097152 body_len=2097152 read_to_end -> Err(body exceeds limit 2097152)
  P2 reply(exactly-2MB-valid-json): Ok(content 2097112 chars)
  (Với limit=16 cũng vậy: body 16 byte → Err.) Xem phụ lục.
Ảnh hưởng: hầu như không xảy ra (JSON trả lời đúng 2^21 byte); nếu xảy ra thì kết quả
  là AI_BAD_RESPONSE + thử lại, an toàn. Spec §5.2 viết "vượt → AI_BAD_RESPONSE" nên
  về chữ là lệch 1 byte ở biên.
Đề xuất: khuyến nghị giữ nguyên, không cần sửa. Nếu muốn khớp chữ spec: limit(MAX_BODY
  + 1) ở post(). Cỡ: 1 dòng.
```

### MS-C3 — Giới hạn 2 MB đếm theo byte đã nén gzip, output giải nén không giới hạn lúc đọc

```
ID: MS-C3
Mức: Nit
Trục: S
Vị trí: apps/desktop/src-tauri/src/ai.rs:325 (agent không tắt gzip), :345 (limit);
  ureq 3.4.2 src/lib.rs:139 (gzip là default feature), src/run.rs:305-306 (gửi
  Accept-Encoding: gzip), src/body/mod.rs:519-526 (LimitReader bọc DƯỚI ContentDecoder)
Tình trạng: CONFIRMED (cơ chế)
Mô tả: ureq mặc định gửi Accept-Encoding: gzip và giải nén trong suốt; LimitReader
  2 MB nằm dưới lớp giải nén nên chỉ đếm byte nén. read_to_vec gom byte ĐÃ giải nén
  mà không có trần: body nén ≤ 2 MB có thể nở ra hàng trăm MB trong bộ nhớ trước khi
  reply() kiểm lại.
Tái hiện / bằng chứng: probe đo tỉ lệ nén bằng flate2 (cùng crate ureq dùng):
  P2 gzip: 100MB of 'a' compresses to 101877 bytes (limit counts these)
  Tức tỉ lệ ~1000:1: 2 MB nén chứa được tới ~2 GB giải nén. Stack reader và default
  gzip đã đọc trong source ureq (trích ở phụ lục). Chưa chạy end-to-end qua socket
  vì sandbox cấm bind (TcpListener → PermissionDenied); các mảnh đã chạy đủ để kết luận.
Ảnh hưởng: khai thác cần server độc hại mà TLS vẫn hợp lệ cho opencode.ai (rustls +
  webpki roots ghim sẵn, không dùng kho cert Windows) — ngoài threat model. Trường hợp
  xấu thực tế chỉ là response gzip lớn nhưng hợp lệ → cấp phát transient lớn rồi bị
  reply() từ chối (kiểm decoded len > MAX_BODY ở ai.rs:218). Không mất/nhầm dữ liệu.
Đề xuất: khuyến nghị giữ nguyên. Nếu muốn triệt tiêu: không gửi Accept-Encoding: gzip
  (response AI nhỏ, không cần nén) hoặc kiểm kích thước decoded trong lúc đọc.
```

## 3. Bảng đếm mức × trục

| Mức \ Trục | E | G | C | D | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Nit | 1 | 0 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 3 |
| KNOWN | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## 4. Đã xét, không thấy (mọi trục §4)

- **E — Edge case.** Rỗng/1/rất lớn: session 1–64 ký tự (check + test biên 1/64 ở
  ai.rs:663-692), messages rỗng → BAD_REQUEST, tổng 200 000 ký tự đếm theo char (test dùng
  é đa byte, ai.rs:632-644); model 1 MB và reasoning tùy ý đã chạy probe P4 (check vẫn Ok,
  body gửi nguyên — không giới hạn nhưng vô hại vì JSON escape + server từ chối; không báo
  finding). Hai thao tác chồng: Busy compare_exchange + guard Drop, test cả đường panic
  (ai.rs:706-763). Hủy/timeout/lỗi giữa chừng: timeout_global 120 s end-to-end (xác nhận trong
  source ureq config.rs:720-723 "from DNS lookup to finishing reading the response body"),
  connect 10 s; Hủy ở webview, Rust giữ cờ tới khi xong (đúng §5.2). Tải lại webview/thay DB
  khi AI chạy: lệnh AI không giữ DATA_LOCK (lib.rs:24-26), không ảnh hưởng lưu dữ liệu.
  Riêng biên đúng-2MB xem MS-C2.
- **G — Guardrail AI.** Đã xét, không thấy: lớp Rust chỉ vận chuyển (transport), không parse
  hay kiểm nội dung output; V1–V7 thuộc `packages/ai` (gói A). Rust không thêm/bớt gì vào
  nội dung: session chỉ đi vào header (test ai.rs:444-458 assert body không chứa session).
- **C — Đúng hợp đồng.** Đã xét, không thấy thêm: §5.1 (URL cố định theo plan, test
  ai.rs:434-441; role/maxTokens/messages/session kiểm đủ; body đúng
  `{model, messages, max_tokens, reasoning_effort?}`, không `response_format`, test
  ai.rs:460-476); §5.2 (cờ Busy mọi đường, test cả panic); §5.3 (ánh xạ 401/403→UNAUTHORIZED,
  402/429→RATE_LIMITED, còn lại→AI_HTTP; message ≤200 ký tự theo char, test é×250 ở
  ai.rs:580-588); §5.4 (`open_chatgpt` không tham số, đúng URL hằng, test ai.rs:878-888).
  Hợp đồng với TS: arg camelCase khớp vì Tauri mặc định `argument_case: Camel` (đã đọc
  tauri-macros wrapper.rs:51,507) + contract test `tauri-contract.test.ts:159-178`;
  `AI_OPEN_BROWSER` vắng mặt trong `AI_ERROR_CODES` là có chủ ý và đã được contract test
  khóa lại (:180-194); sessionId 32 hex, maxTokens 8000/4000/64, reasoning DEFAULT→null→chữ
  thường đều nằm trong miền Rust chấp nhận. `check()` chạy trước `busy.start()` nên request
  sai trong lúc bận trả AI_BAD_REQUEST thay vì AI_BUSY — chữ spec P5 có thể đọc là "mọi yêu
  cầu thứ hai → AI_BUSY", nhưng mã cụ thể hơn là đúng đắn, không báo finding.
  User-Agent `Project-2C/0.1.0` khớp version ở package.json/Cargo.toml/tauri.conf.json.
- **D — Dữ liệu.** Đã xét, không thấy: Rust không ghi DB; key: set ghi đè, delete khi không có
  key vẫn Ok (ai.rs:280-286, đúng §5.1), status chỉ trả bool; set/delete key trong lúc
  `ai_complete` đang chạy không ảnh hưởng request đó (key đã đọc trước khi post).
- **S — An toàn.** Đã xét, không thấy thêm: key không vào lỗi/log/giá trị trả —
  `transport_error` và `keyring_error` chỉ giữ mã (ai.rs:256-264, 297-300),
  `server_message` mask key trước khi cắt 200 ký tự (ai.rs:235-254), test
  `no_error_carries_the_key` (ai.rs:788-813) kiểm cả Debug; không `unwrap/expect` trên đường
  có key ở code non-test (đã rà toàn file); app không khởi tạo logger nên ureq không log
  header ở đâu. Mạng: URL cố định, `https_only(true)`, `max_redirects(0)`, TLS rustls +
  webpki-roots (xác nhận trong Cargo.lock: rustls 0.23.45, webpki-roots 1.0.9).
  `windows-native-keyring-store` với `default-features = false` vẫn là kho Windows thật
  (đã đọc Cargo.toml của crate: chỉ tắt feature `search`). CSP giữ nguyên
  `connect-src 'self' ipc: http://ipc.localhost`, capabilities không đổi, không cần quyền
  mới. `open_chatgpt` truyền URL hằng qua `Command::arg` (không qua shell), explorer.exe
  gọi bằng full path từ SystemRoot tuyệt đối (DR-54, storage.rs:399-412); SystemRoot thiếu
  → AI_OPEN_BROWSER. Key còn trong bộ nhớ sau khi dùng (không zeroize) — spec không yêu cầu,
  chỉ ghi nhận, không báo finding. Riêng giới hạn gzip xem MS-C3; key xuống dòng xem MS-C1.
- **P — Hiệu năng.** Đã xét, không thấy vấn đề, có số đo trên bản copy chạy thật (bản debug,
  máy review; bản release còn nhanh hơn): `check()` với message 200 000 ký tự trung bình
  **12,0 µs**; `reply()` parse JSON 2 MB trung bình **5,68 ms**; `reply()` với trang lỗi
  500 HTML 2 MB trung bình **10,16 ms**. Agent mới mỗi request (không reuse kết nối TLS) là
  inherent của thiết kế một-lượt, mỗi lần gọi AI tốn vài giây nên overhead handshake không
  đáng kể — không đo được nếu không gọi mạng thật (bị cấm), nên không nêu số. Lệnh key chạy
  trên async pool thay vì spawn_blocking: Credential Manager thường < 10 ms, pool nhiều
  thread nên một lần chậm không chặn lệnh khác.
- **B — Bloat.** Đã xét, không thấy: build + clippy không báo `dead_code`/`unused`; mọi hằng,
  struct, hàm pub trong ai.rs đều được dùng (lib.rs hoặc test); mọi dependency trong
  Cargo.toml đều được dùng. Cảnh báo pedantic `struct_field_names`
  (`Completion.completion_tokens`, ai.rs:100) là do tên trường API, không báo theo quy tắc
  (phong cách gây lỗi mới báo).
- **T — Chất lượng test.** Đã xét, không thấy yếu tới mức báo finding: 23 test AI (ma trận
  args sai, biên cho phép, Busy giữ/xả trên 4 kết cục + panic, ánh xạ transport, mask key,
  vòng đời key, lệnh trình duyệt) + contract test JS↔Rust phía TS. Thiếu sót ghi nhận nhưng
  không báo: `post()` chưa được test với server thật (bản chất cần mạng; đã bù bằng các lần
  gọi thật của Owner T-164/T-178/T-179 và probe của phiên này); chưa có test cho thứ tự
  "args sai trong lúc bận" (xem mục C).
- **A — Trợ năng / i18n.** Đã xét, không thấy: Rust không chứa chuỗi UI (chỉ mã lỗi, UI dịch
  qua i18n); không có yếu tố giao diện.

## 5. Lệnh đã chạy (kết quả thật)

- `git rev-parse HEAD` → `0df3606fb783cc89b1b9c413c02810340e273a4f` (khớp SHA ghim).
- `cargo clippy --all-targets -- -W clippy::pedantic` (yêu cầu của gói C) → **exit 0,
  0 error**; chỉ cảnh báo style/doc: ai.rs có doc-markdown ×4 (dòng 12, 32, 84, 233),
  struct-field-names (dòng 100), 2 cảnh báo trong test (dòng 523, 864); phần AI của lib.rs
  có doc-markdown (dòng 132, 161, 178) và needless-pass-by-value (dòng 163, `String` là chữ
  ký lệnh Tauri). Còn lại (storage.rs, build.rs, main.rs, lib.rs:66) ngoài phạm vi gói.
  Log đầy đủ: `muse/C/clippy-pedantic.log`.
- `cargo test` → **73 passed, 0 failed** (khớp baseline); `cargo test ai::` → **23 passed**.
- Probe `aiprobe` (chi tiết ở phụ lục): P1/P2/P3/P4 đều chạy xong, output ở phụ lục.

Ghi chú môi trường: shell sandbox chạy dưới user khác nên (1) mọi lệnh git cần
`-c safe.directory=…`, (2) linker cần `TMP`/`TEMP` trỏ vào thư mục sandbox, (3) exe build
trong LocalLow không khởi động được (STATUS_DLL_INIT_FAILED) nên probe build với
`CARGO_TARGET_DIR` tạm trong workspace và đã xóa sau khi chạy, (4) sandbox cấm bind socket
nên P2 dùng bản copy nguyên văn `LimitReader` + đo tỉ lệ gzip thay vì server local.

## 6. Phụ lục — nguồn và kết quả probe

Thư mục: `muse/C/aiprobe/` gồm `Cargo.toml`, `Cargo.lock`, `src/main.rs`,
`src/ai_copy.rs` (copy nguyên văn `ai.rs`, SHA256 `db2e49c5…79ffe` khớp file repo, đã kiểm
bằng `certutil -hashfile`). Lệnh chạy (offline, deps từ cargo cache):

```
cargo run --offline --manifest-path <thư mục>/aiprobe/Cargo.toml
```

với `CARGO_TARGET_DIR` tạm trong workspace (đã xóa sau khi chạy; xem ghi chú môi trường).

Output thật đầy đủ:

```
P1 post(newline-key): code=AI_NETWORK elapsed_ms=0
P1 underlying ureq error (newline): Http(http::Error(InvalidHeaderValue))
P1 underlying ureq error (crlf): Http(http::Error(InvalidHeaderValue))
P1 transport_error maps them to: AI_NETWORK / AI_NETWORK
P2 limit=16 body_len=16 read_to_end -> Err(body exceeds limit 16)
P2 limit=16 body_len=17 read_to_end -> Err(body exceeds limit 16)
P2 limit=2097152 body_len=100 read_to_end -> Ok(100 bytes)
P2 limit=2097152 body_len=2097152 read_to_end -> Err(body exceeds limit 2097152)
P2 limit=2097152 body_len=2097153 read_to_end -> Err(body exceeds limit 2097152)
P2 reply(exactly-2MB-valid-json): Ok(content 2097112 chars)
P2 gzip: 100MB of 'a' compresses to 101877 bytes (limit counts these)
P3 check(200k-char message): avg_us=12.0
P3 reply(parse 2MB JSON): avg_ms=5.68
P3 reply(500 + 2MB html error page): avg_ms=10.16
P4 check(1MB model): Ok (no cap)
P4 body(reasoning='not-a-level!'): {"max_tokens":64,"messages":[{"content":"hi","role":"user"}],"model":"m","reasoning_effort":"not-a-level!"}
done
```

(Khối trên chép đúng từng dòng output của lần chạy cuối.)

Trích source ureq đã đọc cho MS-C3: `src/lib.rs:139` ("The default enabled features are:
**rustls** and **gzip**"), `src/run.rs:305-306` (`value.push_str("gzip")` khi dựng
Accept-Encoding), `src/body/mod.rs:519-526` (`do_build` bọc `LimitReader::new(self.handler,
self.limit)` dưới các lớp giải nén), `src/config.rs:720-723` (`timeout_global` "from DNS
lookup to finishing reading the response body").

Nguồn probe (tác giả: phiên review) nằm cùng thư mục với báo cáo, không dán lại vào đây:
`muse/C/aiprobe/src/main.rs` (205 dòng: 4 nhóm P1–P4 như trên),
`muse/C/aiprobe/Cargo.toml` (13 dòng), `muse/C/aiprobe/Cargo.lock` (phiên bản resolve),
`muse/C/aiprobe/src/ai_copy.rs` (copy nguyên văn `ai.rs`, SHA256 khớp, xem đầu phụ lục).
Log clippy đầy đủ: `muse/C/clippy-pedantic.log`.

## 7. `git status` cuối phiên

```
?? .agents/
?? .codex/
?? AGENTS.md
?? opencode.json
```

Repo không bị sửa: chỉ đọc và chạy lệnh (build trong `target/`, thư mục build tạm của probe
đã xóa). Báo cáo này và probe nằm ngoài repo, ở `muse/C.md` và `muse/C/`.
