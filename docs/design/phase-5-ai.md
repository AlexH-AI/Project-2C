# Phase 5 — AI copilot (G1 / G2)

- **Cổng:** G1 (phạm vi, luồng, lược đồ) · G2 (schema output, mức bằng chứng, golden B01–B11) · **Trạng thái:** **Owner duyệt G1 / G2 07/10/2026** (PR #399; model mặc định `deepseek-v4.1-flash`)
- **Quyết định Owner:** 07/10/2026 (AskUserQuestion trong phiên soạn spec, §1) + D-1 (07/10/2026, phụ lục ADR-0009)
- **Nền:** ADR-0009 (provider, schema, validator, CURRENT / STALE / REJECTED, phụ lục D-1), ADR-0008 (cổng KYC, cờ material, "AI trích xuất"), ADR-0005 (zod đã duyệt), `docs/golden/kyc.md` (K01–K15), mockup `customer.html` (panel KYC Intelligence), `appointments.html` (khối AI ở chi tiết lịch)
- **Không làm ở đây:** nội dung prompt và danh sách chặn (**G5**, `phase-5-prompts.md`); bố cục màn mới (**G3**, §9); hồ sơ eval E01–E20 (G2 riêng, §11)

## 1. Quyết định Owner 07/10/2026

| # | Câu hỏi | Chốt |
|---|---|---|
| P1 | Phân tích cũ thành STALE khi nào | **Mọi phiên bản KYC mới.** Cờ material chỉ đổi lời nhắc (§6) |
| P2 | Cổng chặn có ghi vào lịch sử phân tích không | **Không.** Panel tính cổng trực tiếp; nút Phân tích tắt khi cổng chặn; lịch sử chỉ có lần gọi AI thật. Bỏ dòng `KYC_INSUFFICIENT` khỏi mockup ở G3 |
| P3 | Danh sách model | **Danh sách ngắn cố định trong code**, chỉ model dùng `/chat/completions` (§4.2) |
| P4 | "AI trích xuất" | **Làm trong Phase 5.** Đề xuất không lưu DB; chỉ dữ kiện RE xác nhận mới được ghi (§8) |
| P5 | Hủy khi yêu cầu ở Rust còn chạy (Owner 07/10/2026, sau review PR #399) | **Chỉ một yêu cầu AI tại một thời điểm, không bao giờ hai.** Hủy không mở khóa nút AI tới khi yêu cầu ở Rust kết thúc; Rust tự từ chối yêu cầu thứ hai (`AI_BUSY`) (§5.2) |
| P6 | Nhãn tính cách (Owner 07/10/2026, ở G5, PR #414) | **Không cấm.** Khối riêng `personalityNotes` — "Thông tin tham khảo": tâm lý học (MBTI, DISC…) và tử vi / huyền học (con giáp, mệnh…), mỗi phần tử ghi loại, AI suy ra từ dữ kiện, bắt buộc có bằng chứng. V5 chỉ chặn nhãn ở các khối khác (§6.2, §6.4, phụ lục G5 ADR-0009) |

## 2. Phạm vi

**Làm:**

1. `packages/ai` (mới): kiểu dữ liệu, zod schema, adapter (`Mock`, `OpenCode Go`), prompt có version, validator, điều phối (cổng → prompt → gọi → kiểm → thử lại → lưu).
2. Lệnh Rust gọi OpenCode Go + giữ key (D-1) — §5.
3. Bảng `ai_analyses` (migration mới), lệnh ghi / đọc, luật nhập backup — §7.
4. Settings → AI (provider, model, reasoning, key) — §4.
5. Panel **KYC Intelligence** ở Hồ sơ KH, khối AI chỉ đọc ở chi tiết lịch hẹn, luồng "AI trích xuất" — §9.
6. Mức bằng chứng deterministic (`domain`) — §6.3.
7. Bộ eval ~20 hồ sơ, chạy tay với provider thật — §11.

**Không làm (v1):** streaming; provider Anthropic / OpenAI; legal pack; AI tự chạy khi KYC đổi (luôn do RE bấm); AI ghi vào bảng nào khác `ai_analyses`; nút "gửi" / "đặt lịch" do AI kích hoạt; tính tiền theo token (gói OpenCode Go trả theo tháng — chỉ lưu số token).

## 3. Luồng một lần phân tích

```
RE bấm "Phân tích" ở Hồ sơ KH
  │
  ├─ evaluateKycGate(dữ kiện hiện tại)
  │    CONFLICT_RESOLUTION / KYC_INSUFFICIENT → nút đã tắt, không tới đây (P2)
  │    PROFILE_DISCOVERY → chế độ discovery · PAIN_POINT_ANALYSIS → chế độ analysis
  │
  ├─ Ảnh chụp đầu vào: phiên bản KYC hiện tại (id, seq) + dữ kiện active / conflict + cổng
  ├─ Dựng messages từ prompt <mode>@<version> (G5)
  ├─ Adapter.complete()  ── lỗi mạng / key / HTTP / timeout / Hủy → báo lỗi, KHÔNG lưu, KHÔNG tính lần thử
  ├─ Validator (§6) ── đạt → lưu ACCEPTED
  │                └─ không đạt → thử lại 1 lần, kèm danh sách lỗi → đạt → ACCEPTED
  │                                                             └─ không đạt → lưu REJECTED
  └─ Panel đọc lại: CURRENT / STALE suy ra từ phiên bản KYC (§7.2)
```

1. **Mỗi lúc chỉ một yêu cầu AI** trong cả app (phân tích, trích xuất hoặc Kiểm tra kết nối), tính tới khi yêu cầu ở Rust kết thúc thật, kể cả sau Hủy (P5, §5.2). Đang chạy → mọi nút AI tắt.
2. Đầu vào được chụp **lúc bấm**. RE đổi KYC khi yêu cầu đang chạy → kết quả vẫn lưu, gắn phiên bản cũ, nên hiện là STALE ngay.
3. Lỗi mạng ở lần thử thứ hai (sau một lần output sai) → báo lỗi, không lưu gì; lần output sai trước đó cũng không lưu.

## 4. Provider và Settings → AI

### 4.1 Cấu hình

Lưu ở bảng `settings`, khóa `ai`, giá trị JSON:

```json
{ "provider": "MOCK", "model": "deepseek-v4.1-flash", "reasoning": "DEFAULT" }
```

| Trường | Giá trị | Mặc định |
|---|---|---|
| `provider` | `MOCK` · `OPENCODE_GO` | `MOCK` |
| `model` | một mã trong danh sách §4.2 | model mặc định của danh sách |
| `reasoning` | `DEFAULT` (không gửi) · `LOW` · `MEDIUM` · `HIGH` | `DEFAULT` |

- **Không có key** trong giá trị này (D-1 mục 4). Bảng `settings` đi vào backup → nhập backup ở máy kia mang theo provider / model, không mang key.
- Mock chỉ chạy khi được chọn (D-1 mục 6). Kết quả Mock luôn gắn chip **"Mock"** để không lẫn với phân tích thật.
- Bản web (`pnpm dev:web`, e2e) không có Rust: `OPENCODE_GO` hiện nhưng tắt, ghi "Chỉ có trong app exe". Test dùng adapter giả (§12).
- Giá trị đọc được nhưng sai (model không còn trong danh sách, JSON hỏng) → dùng mặc định, Settings hiện cảnh báo một dòng; không ném lỗi khi mở app.

### 4.2 Danh sách model (P3)

Hằng số trong `packages/ai`, mỗi dòng: mã model, tên hiện, có nhận `reasoning_effort` không. Đề xuất ban đầu (theo tài liệu OpenCode Go 07/10/2026, chỉ model dùng `/chat/completions`):

| Mã | Ghi chú |
|---|---|
| `glm-5.3` | |
| `kimi-k3` | |
| `deepseek-v4-pro` | |
| `deepseek-v4.1-flash` | **mặc định** (Owner 07/10/2026), rẻ, nhanh |

- Model nào nhận `reasoning_effort` thì task đầu tiên gọi thật kiểm (một request mẫu, Owner chạy, §11); chưa kiểm → ô Reasoning tắt cho model đó.
- Model mặc định chỉ là giá trị ban đầu; Owner chủ động đổi model và reasoning level trong Settings (Owner 07/10/2026). Thêm / bớt model = một task nhỏ; model cần `/responses` hay `/messages` (Grok, GPT, Qwen, MiniMax) phải qua G4 vì D-1 chỉ mở `/chat/completions`.

### 4.3 Key

- Ô nhập key **chỉ ghi**: không bao giờ hiện lại giá trị; trạng thái "Đã có key" / "Chưa có key" lấy từ lệnh `ai_key_status`.
- Nút **Lưu key** (gọi `ai_key_set`, key cắt khoảng trắng hai đầu, rỗng hoặc > 512 ký tự → báo lỗi tại ô), **Xóa key** (hộp xác nhận → `ai_key_delete`).
- **Kiểm tra kết nối**: gửi một yêu cầu rất ngắn tới model đang chọn, báo "Kết nối được" hoặc lỗi theo §5.3. Tốn rất ít token; không lưu gì.

## 5. Lệnh Rust (D-1)

### 5.1 Lệnh

| Lệnh | Vào | Ra |
|---|---|---|
| `ai_complete` | `model`, `reasoning` (`null` = không gửi), `messages` (`[{role, content}]`), `maxTokens` | `{ content, promptTokens, completionTokens }` |
| `ai_key_set` | `key` | — |
| `ai_key_delete` | — | — (không có key cũng Ok) |
| `ai_key_status` | — | `bool` |

- URL cố định trong Rust: `https://opencode.ai/zen/go/v1/chat/completions`. Webview không truyền URL. Không lệnh nào trả key.
- Key ở Windows Credential Manager, một mục chung: service `Project-2C`, user `opencode-go`.
- Body: `{ model, messages, max_tokens, reasoning_effort? }`; **không** dùng `response_format` (không phải model nào cũng nhận) — JSON lấy từ `content` (§6.1).
- Lệnh chạy ở `spawn_blocking`, **không** dùng khóa file `DataLock` (gọi AI không chặn lưu dữ liệu).
- `role` chỉ nhận `system` / `user` / `assistant`; `maxTokens` 1…16 000; `messages` tổng ≤ 200 000 ký tự → sai thì `AI_BAD_REQUEST`, không gọi mạng.

### 5.2 Timeout và Hủy

- **Timeout toàn yêu cầu 120 giây** (kết nối 10 giây). Model có reasoning có thể chậm; 120 s là trần cho một lần thử, hai lần thử tối đa ~4 phút.
- Thân trả lời đọc tối đa 2 MB; vượt → `AI_BAD_RESPONSE`.
- **Chỉ một yêu cầu AI tại một thời điểm** (P5): không bao giờ có hai yêu cầu chạy cùng lúc, kể cả sau Hủy.
  - Rust giữ một cờ "đang chạy" (`AtomicBool` trong state của app) cho cả `ai_complete`; gọi khi cờ đang bật → trả ngay `AI_BUSY`, không gọi mạng. Cờ tắt khi lệnh kết thúc theo mọi đường (xong, lỗi, timeout, panic — dùng guard `Drop`).
  - Webview cũng khóa mọi nút AI trong lúc chờ; `AI_BUSY` chỉ là chốt chặn thứ hai.
- **Hủy**: webview bỏ kết quả của yêu cầu đang chạy, không lưu gì, panel về trạng thái trước. v1 không ngắt socket nên yêu cầu ở Rust chạy tiếp tới khi xong hoặc hết timeout; **trong lúc đó mọi nút AI vẫn tắt**, hiện "Đang hủy…" (tối đa 120 s). Rust trả về → bỏ kết quả, mở khóa nút.

### 5.3 Mã lỗi

| Mã | Khi | Thông báo (i18n, ý) |
|---|---|---|
| `AI_NO_KEY` | chưa có key | Chưa có API key OpenCode Go — nhập ở Cài đặt → AI |
| `AI_UNAUTHORIZED` | HTTP 401 / 403 | Key không hợp lệ hoặc hết hạn |
| `AI_RATE_LIMITED` | HTTP 429 | Đã chạm giới hạn dùng của gói OpenCode Go — thử lại sau |
| `AI_TIMEOUT` | quá 120 s | AI không trả lời trong 2 phút |
| `AI_NETWORK` | DNS / TLS / mất kết nối | Không kết nối được OpenCode Go |
| `AI_HTTP` | HTTP khác 2xx còn lại | OpenCode Go báo lỗi (mã HTTP) |
| `AI_BAD_RESPONSE` | không phải JSON OpenAI, thiếu `choices[0].message.content`, > 2 MB | Trả lời của OpenCode Go không đọc được |
| `AI_BUSY` | đã có một yêu cầu AI đang chạy (§5.2) | Đang có một yêu cầu AI khác — chờ xong rồi thử lại |
| `AI_BAD_REQUEST` | đầu vào lệnh sai (§5.1) | lỗi lập trình — hiện thông báo chung |
| `AI_KEYRING` | Credential Manager lỗi | Không đọc / ghi được key trong Windows Credential Manager |

Thông báo lỗi **không** chứa key, header hay thân yêu cầu; chỉ mã HTTP và tối đa 200 ký tự đầu của thông điệp lỗi từ server.

## 6. Output, validator, mức bằng chứng

### 6.1 Đầu vào gửi AI (tối thiểu dữ liệu)

- **Phân tích:** chỉ dữ kiện đã xác nhận còn hiệu lực (`active`, `conflict`) của phiên bản hiện tại, mỗi dữ kiện một mã **`F{seq}`** (seq của `kyc_facts`, theo KH), kèm nhãn trường tiếng Việt, giá trị, ngày xác nhận, cờ mâu thuẫn; tuổi = năm nay − năm sinh; trạng thái cổng + hạng mục còn thiếu. **Không gửi** tên, mã KH, tên RE, ghi chú KYC, lịch hẹn, HĐ.
- **Trích xuất:** đúng một ghi chú KYC (văn bản RE đã ghi) + danh sách trường được phép. Ghi chú có thể chứa tên người: Settings → AI ghi rõ "Trích xuất gửi nguyên văn ghi chú tới OpenCode Go".
- Mã `F{seq}` cũng hiện ở danh sách dữ kiện của Hồ sơ KH (như mockup "F-09") để RE bấm từ bằng chứng tới dữ kiện.
- Trả lời: lấy khối JSON đầu tiên trong `content` (bỏ rào ```` ```json ````); không có JSON → lỗi V1.

### 6.2 Schema (zod, G2)

Mọi chuỗi là tiếng Việt, 1–300 ký tự sau khi cắt khoảng trắng. `evidence` = mảng mã `F{seq}`, không trùng.

**Chế độ `analysis`** (`PAIN_POINT_ANALYSIS`) — 4 khối của ADR-0009:

| Khối | Phần tử | Số phần tử |
|---|---|---|
| `hypotheses` (Behavioral Hypotheses) | `{ text, evidence[≥1] }` | 1–5 |
| `needs` · `painPoints` · `themes` | `{ text, evidence[≥1] }` | mỗi khối 1–5 |
| `discoveryStrategy` | `{ text, evidence[≥0], missingCategory? }` — phải có evidence **hoặc** `missingCategory` | 1–6 |
| `nextBestActions` | như `discoveryStrategy` | 1–5 |
| `personalityNotes` (Thông tin tham khảo, P6) | `{ system: 'PSYCHOLOGY' \| 'ESOTERIC', text, evidence[≥1] }` | 0–4 |

**Chế độ `discovery`** (`PROFILE_DISCOVERY`): `hypotheses` 0–3, `discoveryStrategy` 2–6, `nextBestActions` 1–5, `personalityNotes` 0–4; không có `needs` / `painPoints` / `themes`.

**Chế độ `extraction`:** `facts`: 0–20 phần tử `{ field, value, quote }` — `field` thuộc trường được phép, `quote` là đoạn trích nguyên văn từ ghi chú.

Cảnh báo mâu thuẫn phụ **không** do AI viết: app sinh từ cổng lúc chụp đầu vào (lưu trong `input_json`) và hiện như mockup.

### 6.3 Mức bằng chứng (deterministic, `domain`, G2)

Áp cho mọi phần tử có `evidence`. Đếm **số dữ kiện khác nhau** được trích; "mới" = ngày xác nhận **từ** cùng ngày tháng năm trước của ngày phân tích trở về sau (29/02 → 28/02).

1. 1 dữ kiện → **thấp** · 2 → **trung bình** · ≥ 3 → **cao**.
2. Không dữ kiện nào "mới" → hạ một mức (thấp giữ thấp).
3. Hiện: "Mức bằng chứng: <mức> · <n> dữ kiện, mới nhất dd/mm/yyyy". Không số %, không "độ tin cậy".
4. Phần tử chỉ có `missingCategory` → không có mức; hiện "Hạng mục còn thiếu: <tên>".

| Mã | Ngày phân tích | Dữ kiện trích (ngày xác nhận) | Mức |
|---|---|---|---|
| B01 | 07/10/2026 | F1 (01/09/2026) | thấp |
| B02 | 07/10/2026 | F1, F2 (01/09/2026) | trung bình |
| B03 | 07/10/2026 | F1, F2, F3 (01/09/2026) | cao |
| B04 | 07/10/2026 | F1, F2, F3 (đều 01/06/2025) | trung bình (hạ) |
| B05 | 07/10/2026 | F1 (01/06/2025), F2 (01/09/2026) | trung bình |
| B06 | 07/10/2026 | F1, F1 (trùng) — validator đã chặn trùng; hàm vẫn đếm 1 | thấp |
| B07 | 07/10/2026 | F1…F5 (01/09/2026) | cao |
| B08 | 07/10/2026 | F1, F2 (01/06/2025) | thấp (hạ) |
| B09 | 07/10/2026 | F1 (07/10/2025) | thấp (mới: đúng mốc) |
| B10 | 07/10/2026 | F1, F2 (06/10/2025) | thấp (hạ: trước mốc một ngày) |
| B11 | 29/02/2028 | F1, F2 (28/02/2027) | trung bình (mốc 28/02/2027) |

### 6.4 Validator (V1–V7)

Chạy trên output đã parse; báo cáo = danh sách `{ code, path, detail }`. Mọi luật chữ so trên bản NFC chữ thường **và** bản bỏ dấu (bắt "xac suat").

| Mã | Luật | Áp cho |
|---|---|---|
| V1 | Có JSON và đúng zod schema của chế độ | cả ba |
| V2 | Mọi `evidence` trỏ tới `F{seq}` có trong đầu vào; `missingCategory` là hạng mục đang thiếu trong cổng | analysis, discovery |
| V3 | Không số phần trăm, "xác suất", "khả năng chốt", "tỉ lệ / tỷ lệ chốt", từ ngữ đoán khả năng mua (danh sách ở G5) | analysis, discovery |
| V4 | Không tên sản phẩm / hãng bảo hiểm trong danh sách chặn (G5) | analysis, discovery |
| V5 | Nhãn tính cách — mã MBTI (`[IE][NS][TF][JP]`), DISC, cung hoàng đạo, nhóm máu… (G5) — chỉ được nằm trong `personalityNotes`; xuất hiện ở khối khác → chặn (P6) | analysis, discovery |
| V6 | Không trích dẫn văn bản pháp lý: "Điều <số>", "khoản <số> Điều <số>" ("khoản <số>" đứng riêng là cách nói tiền, không chặn — G5 Q4), "Luật …", "Nghị định", "Thông tư", số hiệu văn bản (G5) | analysis, discovery |
| V7 | `field` được phép (không `birthYear` / `gender` — lấy từ hồ sơ, D2); `value` qua `normalizeKycValue`; `quote` là chuỗi con của ghi chú (so sau khi gộp khoảng trắng) | extraction |

- Phần tử trích xuất sai V7 bị **bỏ riêng phần tử đó**, phần còn lại vẫn hiện (không cần thử lại cả lần); V1 sai → thử lại như phân tích. Trích xuất không qua V3–V6: giá trị lấy nguyên văn lời KH (vd. tên HĐ bảo hiểm đang có là dữ kiện hợp lệ).
- `normalizeKycValue` chuyển từ `db` sang `domain` để `ai` dùng được (ranh giới ADR-0006).
- Thử lại: thêm message `user` liệt kê lỗi (mã + đường dẫn + chi tiết) và yêu cầu trả lại JSON đầy đủ.

## 7. Lược đồ `ai_analyses`

### 7.1 Bảng

| Cột | Kiểu | Ghi chú |
|---|---|---|
| `id` | text PK | |
| `customer_id` | text FK `customers` | |
| `seq` | integer | thứ tự ghi theo KH; unique (`customer_id`, `seq`); "mới nhất" theo `seq`, không theo ngày |
| `kyc_version_id` | text FK `kyc_versions` | phiên bản lúc chụp đầu vào; cùng KH |
| `mode` | text | `analysis` · `discovery` (CHECK) |
| `gate_state` | text | `PAIN_POINT_ANALYSIS` · `PROFILE_DISCOVERY` (CHECK, khớp `mode`) |
| `status` | text | `ACCEPTED` · `REJECTED` (CHECK) |
| `provider` | text | `MOCK` · `OPENCODE_GO` |
| `model` | text | `null` với Mock |
| `reasoning` | text | `DEFAULT` / `LOW` / `MEDIUM` / `HIGH`; `null` với Mock |
| `prompt_version` | text | vd. `analysis@1` |
| `attempts` | integer | 1 hoặc 2 |
| `input_json` | text | ảnh chụp dữ kiện gửi đi (mã F, trường, giá trị, ngày, cờ mâu thuẫn) + cổng (hạng mục thiếu, cảnh báo mâu thuẫn phụ) |
| `output_json` | text | output đã parse của lần thử cuối; `REJECTED` mà không parse được → `null` |
| `raw_output` | text | `null` khi `ACCEPTED`; nội dung thô lần thử cuối khi `REJECTED` (≤ 20 000 ký tự) |
| `validator_json` | text | báo cáo validator của từng lần thử |
| `prompt_tokens`, `completion_tokens` | integer | cộng hai lần thử; `null` với Mock |
| `date` | text | ngày app (`db.now()`) lúc lưu |
| `created_at` | text | |

- **Chỉ thêm**: trigger chặn `UPDATE` / `DELETE` như `kyc_notes`. Không có `deleted_at`.
- Không có cột key, header, URL.
- Lệnh: `recordAiAnalysis` (kiểm KH chưa xóa, `kyc_version_id` của chính KH, `mode` khớp `gate_state`), `listAiAnalyses(customerId)`.

### 7.2 CURRENT / STALE / REJECTED (suy ra, không lưu)

- **CURRENT** = dòng `ACCEPTED` có `seq` lớn nhất **và** `kyc_version_id` = phiên bản KYC mới nhất (theo `kyc_versions.seq`) của KH.
- **STALE** = mọi dòng `ACCEPTED` khác (phiên bản cũ, hoặc cùng phiên bản nhưng đã có lần phân tích lại mới hơn) (P1).
- **REJECTED** = `status = REJECTED`; không bao giờ là kết quả hiện hành.
- Lời nhắc khi dòng `ACCEPTED` mới nhất là STALE vì KYC đổi: có phiên bản **material** nào sau phiên bản của nó → "KYC đã đổi ở trường cốt lõi từ dd/mm — nên phân tích lại"; không → "KYC có thay đổi nhỏ từ dd/mm".

### 7.3 Xóa mềm, backup

- KH đã xóa → panel không hiện (Hồ sơ KH không mở được); khôi phục KH → lịch sử trở lại nguyên vẹn.
- Backup xuất / nhập nguyên bảng. Luật nhập mới (thêm vào `validateBackupInvariants`, lỗi → `BACKUP_INVALID`):
  1. `kyc_version_id` thuộc đúng `customer_id`; `seq` không trùng theo KH.
  2. `mode` / `gate_state` / `status` / `provider` / `reasoning` trong miền; Mock ⇔ `model`, `reasoning`, token đều `null`.
  3. `input_json`, `validator_json` là JSON hợp lệ; `ACCEPTED` → `output_json` qua zod schema của `mode` và mọi `evidence` có trong `input_json`; `REJECTED` → `raw_output` không rỗng. Schema lấy từ `@p2c/ai/schema` (`db` chỉ được import module này của `ai`, ADR-0006 phụ lục 07/10/2026), luôn là **schema mới nhất** của mỗi chế độ, không giữ schema cũ theo `prompt_version`; đổi schema → nạp lại dữ liệu giả lập (R2-02).
  4. `date` không sau hôm nay (như luật 10 của Phase 3).
- Dữ liệu giả lập (R2-02): seed thêm vài dòng Mock cho KH mẫu để màn có dữ liệu; không migration cho dữ liệu cũ.

## 8. AI trích xuất (P4)

1. Nút **AI trích xuất** trên từng ghi chú nguồn RE (không có trên ghi chú `SYSTEM`). Ghi chú < 20 ký tự sau khi cắt khoảng trắng → nút tắt, chú thích "Ghi chú quá ngắn".
2. Kết quả hiện ngay dưới ghi chú dạng **đề xuất chờ xác nhận** như mockup: "AI đề xuất: <trường>: <giá trị> ("<trích>")" + **Xác nhận** / **Bỏ**.
3. **Xác nhận** mở hộp xác nhận dữ kiện đang có, điền sẵn trường, giá trị, ghi chú nguồn → đi qua lệnh hiện có (dữ kiện mới / thay thế / mâu thuẫn). RE sửa được giá trị trước khi lưu.
4. Đề xuất **không lưu DB**, không vào `ai_analyses`; rời màn hay tải lại → mất. Đề xuất trùng giá trị dữ kiện còn hiệu lực cùng trường → ẩn.
5. Lỗi mạng / key → báo như §5.3. V1 sai hai lần → "AI trả kết quả không đọc được" (không lưu gì).
6. 0 đề xuất → "AI không tìm thấy dữ kiện mới trong ghi chú này".

## 9. UI

### 9.1 Panel KYC Intelligence (Hồ sơ KH)

| Tình huống | Hiện |
|---|---|
| Cổng `CONFLICT_RESOLUTION` | "Giải quyết mâu thuẫn ở <trường cốt lõi> trước khi phân tích" (chi tiết ở thẻ Dữ kiện KYC); nút tắt. Không gọi AI, không có câu hỏi do AI sinh — sửa câu ở `kyc-forms.html` ("AI chỉ gợi ý câu hỏi làm rõ") ở G3 |
| Cổng `KYC_INSUFFICIENT` | "Cần chăm sóc, KYC thêm thông tin khách hàng" (câu hỏi gợi ý đã có ở thẻ Dữ kiện KYC); nút tắt |
| Được gọi AI, chưa có phân tích | Nút **Phân tích**, chế độ theo cổng (badge) |
| Đang chạy | "Đang phân tích…" + **Hủy**; mọi nút AI khác tắt |
| Đã Hủy, Rust chưa trả | "Đang hủy…"; mọi nút AI vẫn tắt tới khi yêu cầu kết thúc (§5.2) |
| Lỗi | Thông báo §5.3 + **Thử lại** |
| Có CURRENT | 4 khối (analysis) / 3 khối (discovery) như mockup, mỗi phần tử có bằng chứng + mức; khối **"Thông tin tham khảo — không phải kết luận"** ở cuối khi `personalityNotes` không rỗng, mỗi dòng "Tâm lý học: …" / "Tử vi / huyền học: …" + bằng chứng + mức (P6); chip "kyc v<seq> · <prompt_version> · <model hoặc Mock> · dd/mm hh:mm"; cảnh báo mâu thuẫn phụ; nút **Phân tích lại** |
| Bản mới nhất STALE | Hiện bản đó mờ + lời nhắc §7.2 + **Phân tích lại** (khi cổng cho phép) |
| Lần gần nhất REJECTED | Dòng "Lần phân tích dd/mm bị loại: <lý do đầu tiên>"; vẫn hiện bản ACCEPTED mới nhất bên dưới |
| Lịch sử | Bảng mọi dòng, mới nhất trên: ngày · kyc v · prompt · provider/model · CURRENT / STALE / REJECTED; bấm → xem nội dung dòng đó (REJECTED: báo cáo validator, không hiện output thô làm kết quả) |

### 9.2 Chi tiết lịch hẹn

Khối chỉ đọc như mockup `appointments.html`: Next Best Actions + Discovery Strategy của bản ACCEPTED mới nhất của KH, badge CURRENT / STALE, ngày; không có nút gọi AI; chưa có → "Chưa có phân tích AI" + liên kết tới Hồ sơ KH.

### 9.3 Settings → AI

Mục **AI** trong thanh mục Cài đặt (mockup `settings-data.html` đã có mục "AI"): Provider, Model, Reasoning, Key (§4.3), Kiểm tra kết nối, dòng giải thích dữ liệu gửi đi (§6.1).

### 9.4 Cần mockup (G3)

1. Settings → AI (mới hoàn toàn).
2. Panel KYC Intelligence: các trạng thái §9.1 chưa có trong mockup (cổng chặn, đang chạy, lỗi, STALE, REJECTED gần nhất, chip Mock), chế độ discovery, khối "Thông tin tham khảo" (P6); bỏ dòng `KYC_INSUFFICIENT` khỏi lịch sử (P2).
3. Mã `F{seq}` trên danh sách dữ kiện; đề xuất trích xuất (đã có một dòng mẫu — thêm trạng thái đang chạy / 0 đề xuất / lỗi).

## 10. `packages/ai` — ranh giới

- Chỉ phụ thuộc `domain` + `zod`. Không import `db`, `ui`, Tauri. Adapter OpenCode Go nhận một hàm `invoke` được tiêm từ `apps/desktop` (ADR-0006, `pnpm lint:deps` thêm luật cho `ai`).
- Ngược lại, `db` chỉ được import **đúng** module schema `@p2c/ai/schema` (cho luật nhập backup 3, §7.3); module này chỉ import `zod` + `domain` (ADR-0006 phụ lục 07/10/2026, Owner quyết).
- Giao diện adapter: `complete({ model, reasoning, messages, maxTokens }) → { content, promptTokens, completionTokens }`; lỗi là `AiError` với mã §5.3.
- **Mock**: không ngẫu nhiên, sinh output hợp lệ từ chính dữ kiện đầu vào (mỗi khối trích dữ kiện có thật, câu mẫu cố định); trích xuất Mock nhận vài mẫu chữ đơn giản ("<n> con", "kết hôn"…). Dùng cho demo, e2e.
- Prompt: `packages/ai/src/prompts/<mode>.ts`, mỗi file một hằng `version`; đổi chữ prompt = tăng version + qua G5.

## 11. Bộ eval

- `docs/golden/ai-eval.md` + fixture: ~20 hồ sơ (E01–E20) = 10 hồ sơ AI được gọi trong K01–K15 (K04–K10, K12, K13, K15) + ~10 hồ sơ mới phủ bẫy (KH nhắc tên sản phẩm, nhắc %, nhắc luật, mâu thuẫn phụ, chế độ discovery ít dữ kiện) + 5 ghi chú cho trích xuất. Owner duyệt (G2) trước khi chạy.
- Lệnh `pnpm eval:ai` (script Node trong `tools/`, đọc key từ biến môi trường `OPENCODE_GO_KEY` ở máy Owner, **không** chạy trong CI). Mỗi hồ sơ: chế độ, số lần thử, lỗi validator, token, thời gian; ghi kết quả vào `docs/metrics/ai-eval-<yyyy-mm-dd>.md`.
- **Chạy tốn tiền → Owner bấm** (G4). Ngưỡng đạt đề xuất: ≥ 18/20 hồ sơ ACCEPTED trong ≤ 2 lần thử với model mặc định; 0 vi phạm V3–V6 lọt qua (kiểm bằng đọc tay của Owner trên output đạt).

## 12. Test chấp nhận (khung cho các Issue)

| Vùng | Test |
|---|---|
| `domain` | B01–B11; `normalizeKycValue` chuyển sang giữ nguyên hành vi (test cũ chạy lại) |
| `ai` schema / validator | Mỗi luật V1–V7 một ca đạt + một ca chặn (gồm bản bỏ dấu); evidence trỏ dữ kiện không có / bị thay thế → V2; nhãn tính cách trong `personalityNotes` đạt, ở khối khác → V5 (ca kiểm G5 §8.5) |
| `ai` điều phối | Adapter giả: đạt ngay; sai rồi đạt (message thử lại chứa lỗi); sai hai lần → REJECTED; lỗi mạng lần 1 / lần 2 → không lưu; Hủy → không lưu và nút AI vẫn khóa tới khi adapter trả; yêu cầu thứ hai trong lúc chờ (kể cả sau Hủy) → không gọi adapter; cổng chặn → không gọi adapter |
| `db` | `recordAiAnalysis` kiểm như §7.1; trigger chặn sửa / xóa; CURRENT / STALE theo `seq` của phiên bản, không theo ngày; luật nhập 1–4 mỗi luật một file sai → `BACKUP_INVALID` |
| Rust | Dựng body (có / không `reasoning_effort`), đọc response mẫu, ánh xạ 401 / 429 / 500 / body hỏng / quá 2 MB sang mã lỗi; gọi khi cờ đang chạy → `AI_BUSY`, cờ tắt sau lỗi / timeout; không mã lỗi nào chứa key (dữ liệu mẫu, không gọi mạng) |
| UI / e2e | Mock: phân tích → CURRENT; thêm dữ kiện → STALE + lời nhắc đúng material; cổng chặn → nút tắt; trích xuất → Xác nhận ghi dữ kiện, Bỏ không ghi; Settings không bao giờ hiện key (adapter Tauri giả) |

## 13. Tách Issue sơ bộ (chốt bằng `to-tickets` sau G1 / G2)

| # | Việc | Cổng trước | risk |
|---|---|---|---|
| 1 | `domain`: mức bằng chứng (B01–B11) + chuyển `normalizeKycValue` | G2 | low |
| 2 | `packages/ai` khung: kiểu, zod schema, adapter, Mock, luật dependency-cruiser | G2 | med |
| 3 | `db`: `ai_analyses` + migration + lệnh + CURRENT / STALE | G2 | med |
| 4 | `db`: luật nhập backup cho `ai_analyses` + seed Mock | — | med |
| 5 | Rust: `ai_complete` + lệnh key (`keyring`, `ureq`, nhãn `build-exe`) | — | high |
| 6 | `ai`: validator V1–V7 + danh sách chặn | G5 | high |
| 7 | `ai`: prompt analysis / discovery / extraction + điều phối thử lại | G5 | high |
| 8 | Settings → AI | G3 | med |
| 9 | Panel KYC Intelligence + mã F trên dữ kiện | G3 | med |
| 10 | Khối AI ở chi tiết lịch hẹn | G3 | low |
| 11 | Luồng AI trích xuất | G3 | med |
| 12 | Bộ eval: hồ sơ E01–E20 (G2) + `pnpm eval:ai` + lần chạy đầu (Owner, G4) | G2 / G4 | med |

## 14. Owner duyệt

- [x] §1 P1–P4 ghi đúng quyết định
- [x] Phạm vi / không làm (§2)
- [x] Settings, danh sách model đề xuất (§4)
- [x] Timeout 120 s, Hủy không ngắt socket, bảng mã lỗi (§5)
- [x] Dữ liệu gửi AI tối thiểu (§6.1)
- [x] Schema output (§6.2) và mức bằng chứng B01–B11 (§6.3) — G2
- [x] Danh sách luật V1–V7 (§6.4); nội dung danh sách chặn để G5
- [x] Lược đồ `ai_analyses` và CURRENT / STALE suy ra (§7)
- [x] Trích xuất không lưu đề xuất (§8)
- [x] Danh sách mockup G3 (§9.4) và tách Issue (§13)
