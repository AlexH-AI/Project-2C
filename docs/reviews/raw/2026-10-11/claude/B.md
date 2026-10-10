# Review lại Phase 5 (vòng 2) — Claude, gói B: Rust + hợp đồng Tauri

- **SHA:** `705ea7c`. Đã kiểm `git rev-parse HEAD` = `705ea7c0e76d…` lúc đầu và lúc cuối phiên. Worktree `C:\workspace\Project-2C-review`, Home PC.
- **Reviewer:** Claude Opus 5.5, phiên sạch, không subagent. Không mở / liệt kê `deep-review-5-r2\codex\`. Đã đọc báo cáo Claude vòng 2 gói A (`claude\A.md`). Gói A không có mục nào trùng phạm vi B.
- **Không gọi AI thật:** không gọi opencode.ai, không mở chatgpt.com, không đọc mục key của app trong Credential Manager. Mọi server là server TCP / HTTP local tự dựng. Probe Credential Manager chỉ dùng mục tạm của riêng probe (service `P2C-reviewB-probe`), đã xóa hết (`cmdkey /list` không còn mục nào). Mục của app chỉ được *dựng* để in tên, không đọc.
- **Cách probe:** crate riêng `claude\B\probe` nạp **nguyên văn** `src-tauri/src/ai.rs` của repo bằng `include!` (đặt trong một module, nên gọi được cả hàm riêng `post_with` / `agent_with`) và `storage.rs` bằng `#[path]`. Không chép hay sửa file nào. Cargo dùng `--offline` và cùng `Cargo.lock`. Đột biến / gỡ sửa được áp thẳng vào `ai.rs` của worktree, chạy `cargo test --offline --lib ai::`, rồi `git checkout --` ngay (`claude\B\mutate.mjs`). Cuối phiên `git status --short` của worktree **sạch**.

## 1. Bảng R

| DR5 | Issue | Kết luận | Bằng chứng (tái hiện cũ ra gì; test nào đỏ khi gỡ sửa) | Ghi chú |
|---|---|---|---|---|
| 20 | #487 T-194 | **ĐÃ SỬA** | Tái hiện vòng 1 (P1): bom gzip **4 GB** sau giải nén (4,17 MB trên dây) → chỉ đọc 2 097 153 B, `AI_BAD_RESPONSE`, 2 ms. Bộ nhớ riêng đỉnh của tiến trình tăng **6,6 MB** (11,4 → 18,0 MB). Bom 1 GB: +5,6 MB. Vòng 1: 521 KB trên dây đã ra 512 MB trong RAM. Chunked 50 MB và thân không có độ dài (đọc tới khi đóng) cũng dừng ở 2 MB + 1. Gỡ `take(MAX_BODY + 1)` → **2 test đỏ** (`a_body_is_read_to_2_mb…`, `a_gzip_reply_is_unpacked…`) | ureq chỉ bật feature `gzip` (`cargo tree -e features -i ureq`). `deflate`, `br`, `GZIP`, `x-gzip`, `gzip, gzip` đều đi qua nguyên byte nén nên ra `AI_BAD_RESPONSE`, không giải nén nên không phình (P3) |
| 21 | #487 | **ĐÃ SỬA** | Đúng 2 097 152 B được nhận, 2 097 153 B bị từ chối, qua cả ba cách đóng khung: gzip, chunked, đọc tới khi đóng (P2). Đổi `>` thành `>=` → **2 test đỏ** | — |
| 22 | #487 | **ĐÃ SỬA** | Kết nối tới địa chỉ chặn (10.255.255.1), hẹn 0,7 s → `AI_NETWORK` sau 701 ms, cả `http` lẫn `https`. Tên miền không có → `AI_NETWORK`. Không có phần đầu trả lời / thân nhỏ giọt khi hết 120 s → `AI_TIMEOUT` (P6). Bỏ nhánh `Resolve | Connect` → **2 test đỏ**. Bỏ `timeout_resolve` → 1 test đỏ | Hết hạn phân giải tên không tái hiện được bằng server local (cần DNS treo). Đã đọc code (`ai.rs:276`) và test bảng `transport_errors_map_to_timeout_or_network` |
| 24 | #487 | **ĐÃ SỬA** (hằng / `post`); còn một kẽ hở test mới ở key `Local` → CL2-B1 | Chạy lại đủ **14 đột biến sống của vòng 1** (CL-C4): **14 / 14 giờ bị giết**. Gồm: redirect 10, `https_only` tắt, `post` dùng agent HTTP thường, bỏ timeout toàn cục / kết nối, `http_status_as_error(true)`, `Bearer{key}`, bỏ content type, bỏ header phụ, `TIMEOUT` 121 s, đổi `KEY_USER` / `KEY_SERVICE`, `GO_URL` = URL Credit, che sau khi cắt. Thêm 6 đột biến mới trên code sửa: 5 / 6 bị giết | Đột biến sống: `.filter(|secret| !secret.is_empty())` → nhận cả chuỗi rỗng. Coi là tương đương: key rỗng bị `clean_key` chặn, mã phiên rỗng bị `check` chặn. Chỉ còn ca một chương trình khác ghi mật khẩu rỗng vào đúng mục của app |
| 25 | #487 | **ĐÃ SỬA** (hành vi); test không ghim `key_entry` → CL2-B1 | Ghi thật vào Credential Manager với mục tạm (P8): lưu với `KEY_MODIFIERS` → `persistence = Local`. Mục ghi kiểu cũ (không modifier) → `Enterprise`, đọc được qua entry dựng với `Local`, **sau khi lưu lại thì thành `Local`**. Khớp spec §4.3 và ghi chú PR #503 ("lưu lại key một lần"). Đổi hằng sang `Enterprise` → 1 test đỏ. **Đổi `key_entry` truyền `None` (đường thật của app) → 0 test đỏ** | Máy chưa có key: `Ok(None)`. Xóa khi không có: `Ok(())`. Byte lạ do chương trình khác ghi → `AI_KEYRING`, không lộ byte |
| 26 | #487 | **ĐÃ SỬA** | Key có LF → `AI_BAD_REQUEST`, không lưu (P8, store thật). Test có 11 ca (LF, CR, NUL, DEL, dấu cách, ZWSP, BOM, "ă"…). Bỏ luật ASCII → **2 test đỏ**. Bỏ kiểm `reasoning` → 1 test đỏ. Cho phép dấu cách → 1 test đỏ. `MAX_KEY` 513 → 1 test đỏ | Luật Rust trùng luật webview (`settings-ai-view.ts:21–35`: `trim`, ≤ 512, `[\x21-\x7e]`). JS gửi key đã cắt. Mức `DEFAULT` gửi `null`, các mức khác viết thường, đúng tập Rust nhận (`run.ts:157`, `ai-tauri.ts`) |
| 27 | #487 | **ĐÃ SỬA** (đường vòng 1 báo); còn biến thể: lỗi HTTP mất mã khi thân **đọc lỗi** → CL2-B2 | Thân không phải JSON (HTML, chữ, tiếng vọng request) → không có message. Key và mã phiên được che, kể cả key viết bằng escape `\uXXXX` trong JSON. Lỗi 502 3 MB vẫn ra `AI_HTTP` 502 (test). Gỡ từng phần: trả lại thân thô → 2 test đỏ; không che mã phiên → 1; lỗi lớn mất mã → 1; che sau khi cắt → 1 | Biến thể của key **không** được che (P7): viết hoa / thường, URL-encode, 20 ký tự đầu, cách quãng. Chỉ hiện trên màn của chính người nhập key, không lưu (`serverMessage` chỉ vào `errorText`). Server không có lý do đổi key như vậy. Không tính là phát hiện (§4 trục S) |
| 28 | #487 | **ĐÃ SỬA** (`content`); biến thể `finish_reason` → CL2-B3 | `content` chứa nguyên key, hoặc key viết bằng escape JSON → `AI_BAD_RESPONSE`. Bỏ kiểm → 1 test đỏ | `finish_reason` chứa key, hoặc dài 1 MB, đi thẳng về webview (CL2-B3). Biến thể hoa / thường / URL-encode trong `content` lọt qua, như DR5-27 |
| 29 | #487 | **ĐÃ SỬA** | Không có `usage` → `promptTokens` / `completionTokens` = `null` (test, và P2 qua dây). `unwrap_or(0)` → 1 test đỏ. Phía JS: `run.ts:323–331` cộng các lần thử, chỉ cần một lần `null` là tổng `null`. `ai-panel-view.ts:569` không hiện số token khi `null`. `usage` âm hoặc số thực → `as_u64` trả `None` → `null` | — |
| 05 (phần Rust) | #487 | **ĐÃ SỬA** (đúng phạm vi Issue); ghi chú cho #492 → CL2-B4 | `finish_reason` lấy từ `choices[0]` và gửi tới JS. Bỏ → 2 test đỏ. Hợp đồng: đổi kiểu TS của `promptTokens` thành không `null` → `tauri-contract.test.ts` đỏ; thêm trường Rust → đỏ | Khi `content` = `null` và `finish_reason` = `length` thì Rust trả `AI_BAD_RESPONSE`, mất `finish_reason` (CL2-B4, Nit) |

## 2. Phát hiện

```
ID: CL2-B1
Mức: Low
Trục: T
Vị trí: apps/desktop/src-tauri/src/ai.rs:322–329 (key_entry), test ai.rs:1027–1040 (705ea7c)
Tình trạng: CONFIRMED
Liên quan: DR5-25, DR5-24 · mới do đợt sửa (PR #503)
Mô tả: Test `the_key_is_stored_local_to_this_machine` chỉ ghim hằng `KEY_MODIFIERS` và việc store nhận
  modifier `Local`. Nó không kiểm `key_entry()`, tức đường app dùng thật, có truyền modifier đó hay
  không. Đổi `key_entry` về `store.build(KEY_SERVICE, KEY_USER, None)` (hành vi trước T-194) thì
  35 / 35 test `ai::` vẫn xanh, và key lại lưu kiểu `Enterprise` (đi theo hồ sơ roaming) mà không ai
  thấy. Đây là tính chất G6 Owner chốt ngày 10/10 (§8 câu 4).
Tái hiện / bằng chứng: `node claude\B\mutate.mjs r25`:
    r25 key stored Enterprise (constant)   killed (1 red: the_key_is_stored_local_to_this_machine)
    r25 key_entry passes no modifiers      SURVIVED (35 passed)
  Qua P8 (store thật, mục tạm) đã xác nhận: dựng entry không modifier rồi lưu → `persistence = Enterprise`.
Ảnh hưởng: không ai gặp hôm nay, vì code đúng. Chỉ là một lần sửa / refactor sau này có thể đưa key về
  `Enterprise` mà CI vẫn xanh.
Đề xuất: test downcast entry của `key_entry()` (`windows_native_keyring_store` có `Cred` với trường
  `persistence` công khai) và so với `Local`, không cần ghi vào store. Hoặc tách
  `entry_with(store) -> Entry` để test bằng store giả. Cỡ ≈ 5–10 dòng test.
```

```
ID: CL2-B2
Mức: Nit
Trục: R
Vị trí: apps/desktop/src-tauri/src/ai.rs:387–395 (post_with: lỗi đọc thân → transport_error), ai.rs:220–232 (705ea7c)
Tình trạng: CONFIRMED
Liên quan: DR5-27 (phần "trả lời lỗi … mất mã HTTP") · có từ trước; phần sửa #503 chỉ giữ mã khi thân quá lớn
Mô tả: Mã HTTP đã biết ngay khi đọc xong phần đầu, nhưng nếu đọc thân lỗi thì cả lời gọi thành lỗi
  truyền tải và mã HTTP bị bỏ. Ca thân hỏng: server đóng sớm so với `Content-Length`, gzip hỏng, nhãn
  gzip trên thân thường. Ca thân ngừng giữa chừng: hết 120 s. Spec §5.3 xếp mọi non-2xx còn lại vào
  `AI_HTTP`; §5.2 chỉ nêu ca > 2 MB.
Tái hiện / bằng chứng: probe P3 / P4 / P6 (`probe_b.exe enc framing timeouts`):
    500 + gzip label, plain JSON error   post Err(AI_NETWORK)
    502 body shorter than its length     post Err(AI_NETWORK)
    503 whose body stops, global 1.5 s   post Err(AI_TIMEOUT)
    401 + gzip error (control)           AI_UNAUTHORIZED 401 "Bad key"
Ảnh hưởng: rất hiếm, cần gateway / proxy trả lỗi với khung hỏng hoặc treo giữa thân. Khi gặp, RE thấy
  "Không kết nối được OpenCode" hoặc "AI không trả lời trong 2 phút" thay cho câu đúng mã (vd. 401 →
  key sai, 429 → hết hạn mức).
Đề xuất: trong `post_with`, khi status không 2xx thì lỗi đọc thân trả `(status, bytes đã đọc)` thay vì
  `Err`. `reply` vẫn ra đúng mã, message `None` nếu thân dở không parse được. Cỡ ≈ 5 dòng SP + 1 test
  server local.
```

```
ID: CL2-B3
Mức: Nit
Trục: S
Vị trí: apps/desktop/src-tauri/src/ai.rs:241–250 (705ea7c)
Tình trạng: CONFIRMED
Liên quan: DR5-28 · mới do đợt sửa (PR #503 thêm `finish_reason`, nhưng kiểm key chỉ áp cho `content`)
Mô tả: Trả lời 2xx giờ chuyển thêm `finish_reason` về webview. Trường này không qua kiểm key như
  `content`, cũng không có trần độ dài, nên gateway lặp lại header vào trường này (đúng mô hình đe dọa
  của DR5-28) sẽ đưa key tới webview. Điều đó trái doc comment `ai.rs:240` ("The webview must never get
  the key") và spec §5.3 dòng `AI_BAD_RESPONSE`.
Tái hiện / bằng chứng: probe P7:
    200 finish_reason holds the key  Ok(Completion { content: "ok", …, finish_reason: Some("Bearer sk-Probe+Key/…") })
    200 finish_reason 1 MB           Ok(Some(1000000))
Ảnh hưởng: hôm nay JS chưa dùng, chưa lưu `finishReason` (chỉ trong bộ nhớ, rồi bị bỏ), nên không lộ ra
  đâu. Cần upstream phản chiếu header. #492 (T-199) sẽ bắt đầu đọc trường này.
Đề xuất: chỉ nhận `finish_reason` khi là một từ ngắn (vd. ≤ 32 ký tự `[a-z_]`), còn lại `None`; hoặc áp
  cùng kiểm key. Cỡ 2–3 dòng SP + 1 ca test.
```

```
ID: CL2-B4
Mức: Nit
Trục: C
Vị trí: apps/desktop/src-tauri/src/ai.rs:238–239 (705ea7c)
Tình trạng: CONFIRMED (test có sẵn `an_unreadable_reply_is_bad_response` chốt `content: null` → AI_BAD_RESPONSE)
Liên quan: DR5-05 (phần Rust), DR5-23 (KNOWN, đợt G5), #492 T-199 (KNOWN) · có từ trước
Mô tả: `finish_reason` chỉ tới JS khi `content` là chuỗi. API kiểu OpenAI, khi model suy luận hết
  `max_tokens` trước khi viết câu trả lời, có thể trả `content: null` + `finish_reason: "length"`. Ca
  này ra `AI_BAD_RESPONSE` "không đọc được", `finish_reason` bị bỏ. Đây đúng là ca mà DR5-23 (Kiểm tra
  kết nối `max_tokens` 64 + reasoning) và #492 ("trả lời bị cắt") cần phân biệt. Code đúng chữ spec §5.3
  ("thiếu `choices[0].message.content`"), nên chỉ ghi lại để #492 không phải đổi Rust lần nữa.
Tái hiện / bằng chứng: `reply(200, {"choices":[{"message":{"content":null},"finish_reason":"length"}]})`
  → `AI_BAD_RESPONSE`, theo test `ai.rs:581–596` và đọc `ai.rs:239` (`.as_str().ok_or_else(bad)?`
  chạy trước khi đọc `finish_reason`).
Ảnh hưởng: tới khi #492 / đợt G5 làm: Owner bấm Kiểm tra kết nối với mức Cao, hoặc phân tích bị cắt khi
  đang suy luận, thì thấy "Trả lời của OpenCode không đọc được" thay cho "bị cắt".
Đề xuất: khi làm #492, coi `content: null` + `finish_reason: "length"` là `content: ""` (để `ai` báo
  "bị cắt"), hoặc thêm mã lỗi riêng. Ghi vào thân #492. Cỡ ≈ 3 dòng SP.
```

## 3. Đọc sâu diff sửa `0df3606..705ea7c` (phạm vi B) và quét lại Phase 5

Trong phạm vi B, diff có 4 file: `ai.rs` (+611 / −98), `ai-tauri.test.ts`, `tauri-contract.test.ts`, `packages/ai/src/adapter.ts`. Đã đọc trọn cả 4. `lib.rs`, `Cargo.toml`, `tauri.conf.json`, `capabilities/` **không đổi** trong đợt sửa. Đã đọc thân PR #503 và Issue #487.

- `post_with` / `agent_with`: `take` nằm trên reader đã giải nén, đã kiểm trong nguồn ureq (`body/mod.rs:801–807`). Lỗi đọc được đổi lại thành `ureq::Error` qua `From<io::Error>`. Hàm này mở gói lỗi ureq bọc trong io (`error.rs:216–226`), nên hết hạn khi đọc thân vẫn là `Timeout(_)` và ra `AI_TIMEOUT` (P6, test). Chỉ có CL2-B2.
- `reply`: kiểm > 2 MB chỉ áp cho 2xx, còn non-2xx đọc message từ phần thân đã cắt. JSON lỗi 2 MB + khoảng trắng phía sau vẫn parse được (test). Kiểm key chạy sau khi lấy `content`. Chỉ có CL2-B3, CL2-B4.
- `server_message`: che trước khi cắt, cắt theo ký tự (không cắt giữa ký tự UTF-8). Nhánh lấy thân thô đã bỏ hẳn.
- `transport_error`: `Resolve | Connect` → `AI_NETWORK`. `Global`, `RecvBody`, `RecvResponse`, `SendBody`… → `AI_TIMEOUT`. ureq chia hẹn kết nối cho nhiều địa chỉ (`unversioned/transport/tcp.rs:90–114`), nên IPv6 bị chặn không ăn hết 10 s của IPv4.
- `clean_key`: đổi `chars().count()` sang `len()` là tương đương, vì luật ASCII chạy cùng điều kiện.
- `key_entry`: dựng với `Local` cho cả đọc / xóa. Store chỉ dùng `persistence` khi ghi (`cred.rs:91–113`), nên đọc / xóa mục `Enterprise` cũ vẫn chạy (P8).
- JS: `ai-tauri.ts` không đổi, chỉ ép kiểu (`as AiCompletion`). Test hợp đồng mới so trường `Completion` của Rust với `AiCompletion` (tên camelCase, `Option` ⇔ `| null`). Đột biến hai phía đều làm test đỏ.
- **Quét lại Phase 5** (`3e84ce8..705ea7c`, phạm vi B): đọc lại `lib.rs` (trọn), `ai.rs` (trọn), `ai-tauri.ts`, `tauri-contract.test.ts`, `capabilities/default.json`, `tauri.conf.json` (CSP), `Cargo.toml`, nguồn `windows-native-keyring-store` (`store.rs`, `cred.rs`, `utils.rs`), và nguồn ureq phần body / error / tcp. Không thấy lỗi mới ngoài 4 mục trên. Các điểm vòng 1 ghi "đã xét" đã xét lại: proxy biến môi trường, TLS `webpki-roots`, không có logger, `AI_RUNNING` / `DATA_LOCK` tách nhau, `open_chatgpt` theo đường dẫn đầy đủ. Vẫn đúng.

## 4. Đã xét, không thấy

- **E — Edge case** (probe P2–P6):
  - Khung trả lời: hai `Content-Length` khác nhau, phần đầu dòng 200 KB, dòng trạng thái rác, đóng trước khi trả lời → `AI_NETWORK`. Hai `Content-Length` bằng nhau, `Content-Length` + chunked (chunked thắng, đúng RFC 9112), HTTP/1.0 không độ dài, `100 Continue` rồi 200 → đọc đúng.
  - Hai header `Content-Encoding` (gzip rồi identity): ureq lấy cái đầu, giải nén đúng.
  - Redirect 301 / 302 / 303 / 307 / 308: **1 kết nối**, ra `AI_HTTP` + mã, có message.
  - Hai lời gọi chồng nhau: cờ `Busy` (test có sẵn, đột biến "guard bỏ ngay" bị giết). Panic → cờ tắt (test). Release `panic = "abort"`, nên panic trong release đóng app như vòng 1.
  - Tải lại webview khi đang chạy: Rust chạy tiếp, giữ cờ tối đa 120 s, nút AI sau khi tải lại nhận `AI_BUSY` "Đang có một yêu cầu AI khác". Đúng §5.2.
  - Cổng đóng trên Windows mất ~2 s (TCP thử lại SYN) → `AI_NETWORK`.
- **G — Guardrail AI:** Rust không ghi DB, không có lệnh trả key (`ai_key_status` trả `bool`), không thêm `response_format`. Validator ở gói A. Không thấy.
- **C — Hợp đồng:** bảng §5.1 khớp `Completion` / `AiCompletion` (test). Tập mã lỗi Rust = `AI_ERROR_CODES` + `AI_OPEN_BROWSER` (test). Hằng URL / mục key so chuỗi cố định. §5.2: 120 / 10 / 10 s, 2 MB sau giải nén, 3xx không theo. §4.3: `Local`, mục cũ vẫn đọc được. Ngoài CL2-B2 / B4, không thấy lệch.
- **D — Dữ liệu:** lệnh AI không ghi file, không lấy `DATA_LOCK`. Token `null` đi tới `ai_analyses` qua `isTokenCount` (`null` hợp lệ). Không thấy.
- **S — An toàn:**
  - Key không lọt vào lỗi, kể cả qua gzip (P7: `401` gzip vọng key → `"Bearer ***"`). Biến thể key không bị che: hoa / thường, URL-encode, tiền tố, cách quãng (P7). Chúng chỉ hiện trên màn của chính người nhập key, không lưu, và cần server tự biến đổi key, nên không báo. Che kiểu nhà cung cấp (`sk-Probe****XYZ=`) không lộ gì.
  - `https_only`: `ai::post` tới `http://` → `AI_NETWORK`, **0 kết nối** (P6).
  - CSP / capabilities không đổi trong đợt sửa. `connect-src 'self' ipc: http://ipc.localhost`.
  - Credential Manager: mục tạm ghi với `Local` là `Local`. Byte lạ do chương trình khác ghi → `AI_KEYRING`, không lộ chi tiết.
- **P — Hiệu năng** (đo, release, Home PC):
  - Bom gzip 16 MB / 1 GB / 4 GB: 2 ms, +6,2 / +5,6 / +6,6 MB bộ nhớ riêng đỉnh.
  - Chunked 50 MB: dừng sau 9 ms.
  - Thân đúng 2 MB (gzip / chunked / đọc tới khi đóng): 2 ms.
  - `cargo test --lib ai::`: 35 test, 0,52 s.
  - Không có vấn đề.
- **B — Thừa / lặp:** `cargo clippy --all-targets -- -W clippy::pedantic` (log `clippy-pedantic.log`): lib **17 cảnh báo, bằng vòng 1**, đều là doc thiếu backtick / `struct_field_names` / `needless_pass_by_value` của tham số lệnh Tauri. Bản test thêm 10 cảnh báo mới, đều trong helper test mới (`cast_possible_truncation` ở `gzip` / `padded_reply`, `for_each`, `;`). Không cảnh báo nào là lỗi. `agent_with` / `post_with` riêng tư, chỉ `post` và test dùng. `REASONING` chỉ dùng ở `check`. Không có export thừa.
- **T — Test:** 33 / 35 đột biến chạy được bị giết, gồm 14 đột biến sống của vòng 1. Còn sống 2: CL2-B1 (`key_entry`) và một đột biến tương đương (bỏ lọc chuỗi rỗng khi che). Test server local không phụ thuộc mạng ngoài. Các test timeout dùng hẹn ngắn (300–500 ms), trừ một: đột biến "bỏ timeout kết nối" làm test TLS chạy hết 120 s rồi mới đỏ. Như vậy vẫn bắt được, chỉ chậm. Test TS hợp đồng đỏ khi đổi kiểu một bên.
- **A — Trợ năng / i18n:** Rust không có chuỗi UI. Mã lỗi → `aiError.*` trong `vi.ts:236–252`, khớp 1-1. Không thấy.
- **KNOWN trong phạm vi B:** `storage.rs` (#196, #192) không đổi. DR5-23 (`max_tokens` 64) là KNOWN (G5), chỉ thêm ghi chú CL2-B4. Không có mục "KNOWN đã sửa".

## 5. Bảng đếm

| Mức \ Trục | R | E | G | C | D | S | P | B | T | A | Cộng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Low | | | | | | | | | 1 (B1) | | 1 |
| Nit | 1 (B2) | | | 1 (B4) | | 1 (B3) | | | | | 3 |
| **Cộng** | 1 | | | 1 | | 1 | | | 1 | | **4** |

Không có Critical / High / Medium. Cả 4 phát hiện đều CONFIRMED. Bảng R: **10 / 10 dòng ĐÃ SỬA**, không HỒI QUY. Biến thể gần bỏ sót: CL2-B1 (25), CL2-B2 (27), CL2-B3 (28), CL2-B4 (05).

## 6. Phạm vi đã đọc

- `common\plan.md`, `known.md`, `baseline.md`. `claude\A.md` (vòng 2). Tổng hợp vòng 1 §1, §4, §5.3, §7, §8. Báo cáo vòng 1 `raw/2026-10-10/claude/C.md` (trọn). Thân Issue #487, thân PR #503. Spec `phase-5-ai.md` §4.3, §5.1–§5.4.
- Code (`705ea7c`): `apps/desktop/src-tauri/src/ai.rs` (1–1402, trọn, gồm 35 test), `lib.rs` (trọn), `Cargo.toml`, `tauri.conf.json`, `capabilities/default.json`, `apps/desktop/src/data/ai-tauri.ts` (trọn), `tauri-contract.test.ts` (1–60, 140–217), diff `ai-tauri.test.ts`, `packages/ai/src/adapter.ts`, `errors.ts`, `run.ts:120–140, 150–160, 310–345`, `settings.ts`, `schema.ts:30`, `settings-ai-view.ts:20–35`, `ai-error-view.ts` (grep), `vi.ts:236–252`.
- Nguồn thư viện (registry, chỉ đọc): `ureq-3.4.2` `Cargo.toml` (features), `body/mod.rs:650–950`, `error.rs:195–230`, `unversioned/transport/tcp.rs:30–120`. `windows-native-keyring-store-1.1.0` `store.rs:100–140`, `cred.rs:36–185`, `utils.rs:20–60`.

## 7. Phụ lục — nguồn probe (`C:\workspace\deep-review-5-r2\claude\B\`)

| File | Làm gì | Lệnh |
|---|---|---|
| `probe\Cargo.toml`, `probe\Cargo.lock` (chép từ repo), `probe\src\main.rs` | Crate probe: `include!` nguyên văn `ai.rs`, `#[path]` tới `storage.rs`. Server TCP local trong cùng tiến trình. Đo bộ nhớ bằng `K32GetProcessMemoryInfo` | `cargo build --release --offline` |
| `out-p1-bomb.txt` | P1: bom gzip 16 MB / 1 GB / 4 GB, mỗi mức một tiến trình | `probe_b.exe bomb <MB>` |
| `out-p2-p7.txt` | P2: biên 2 MB (gzip / chunked / đọc tới khi đóng, 50 MB) · P3: `Content-Encoding` (deflate, br, GZIP, x-gzip, nhãn sai, nén kép, hai header, CRC hỏng, lỗi + gzip) · P4: khung (hai CL, CL + chunked, thân ngắn 200 / 502, HTTP/1.0, 100 Continue, header 200 KB, rác) · P5: redirect 301–308 · P6: timeout / mạng · P7: key / mã phiên trong lỗi và 2xx, `finish_reason` | `probe_b.exe sizes enc framing redirects timeouts secrets` |
| `out-p8-keyring.txt` | P8: Credential Manager thật, mục tạm `P2C-reviewB-probe` (fresh / old Enterprise → Local / key LF / byte lạ), đã xóa | `probe_b.exe keyring` |
| `mutate.mjs`, `mutate-out.txt`, `mutate-log.txt` | 37 đột biến (gỡ sửa 10 DR5, 14 đột biến sống vòng 1, 6 trên code mới, 2 đối chứng bỏ qua). Áp vào `ai.rs` của worktree, chạy `cargo test --offline --lib ai::`, rồi `git checkout --` | `node mutate.mjs [tiền tố]` |
| `clippy-pedantic.log` | `cargo clippy --offline --all-targets -- -W clippy::pedantic` (exit 0) | — |

Kiểm hợp đồng TS (không có file, chạy tay rồi `git checkout --` ngay): `adapter.ts` `promptTokens: number` → `tauri-contract.test.ts` 1 đỏ. Thêm trường `extra` vào `Completion` của Rust → 1 đỏ.

`probe\target\` là thư mục build, xóa được.

## 8. Thời gian

Bắt đầu ≈ 01:41, kết thúc ≈ 02:00 (11/10/2026, giờ máy Home PC). Cuối phiên: `git rev-parse HEAD` = `705ea7c`, `git status --short` của worktree **sạch**, `cargo test --offline` 85 passed, không còn mục Credential Manager tạm nào.
