# Phase 5 — AI copilot (G1 / G2)

- **Cổng:** G1 (phạm vi, luồng, lược đồ) · G2 (schema output, mức bằng chứng, golden B01–B11) · **Trạng thái:** **Owner duyệt G1 / G2 07/10/2026** (PR #399; model mặc định `deepseek-v4.1-flash`)
- **Quyết định Owner:** 07/10/2026 (AskUserQuestion trong phiên soạn spec, §1) + D-1 (07/10/2026, phụ lục ADR-0009) + W-1 (08/10/2026, gói Go / Credit và cổng ChatGPT web, phụ lục ADR-0009; P7, P8 — Owner duyệt G1 08/10/2026, PR #430)
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
| P7 | Dùng model ChatGPT trong gói trả phí, không trả API riêng (Owner 08/10/2026, W-1) | **Cổng ChatGPT web làm tay**, chạy song song OpenCode: app copy prompt + đầu vào, mở `chatgpt.com`, người dùng tự dán / copy, dán câu trả lời lại vào app; app kiểm như mọi lần gọi AI. **Chỉ phân tích** (không trích xuất); **giữ 2 lần thử**; **không ghi tên model** (§3.1) |
| P8 | Gói OpenCode Go hết hạn 11/10/2026, tài khoản còn credit (Owner 08/10/2026, W-1) | **Chọn được gói Go / Credit** trong Settings; Rust giữ hai URL cố định, cùng key (§4.1, §5.1) |

## 2. Phạm vi

**Làm:**

1. `packages/ai` (mới): kiểu dữ liệu, zod schema, adapter (`Mock`, `OpenCode Go`), prompt có version, validator, điều phối (cổng → prompt → gọi → kiểm → thử lại → lưu).
2. Lệnh Rust gọi OpenCode Go + giữ key (D-1) — §5.
3. Bảng `ai_analyses` (migration mới), lệnh ghi / đọc, luật nhập backup — §7.
4. Settings → AI (provider, model, reasoning, key) — §4.
5. Panel **KYC Intelligence** ở Hồ sơ KH, khối AI chỉ đọc ở chi tiết lịch hẹn, luồng "AI trích xuất" — §9.
6. Mức bằng chứng deterministic (`domain`) — §6.3.
7. Bộ eval ~20 hồ sơ, chạy tay với provider thật — §11.
8. Cổng ChatGPT web làm tay cho phân tích (P7) + lệnh Rust mở trình duyệt — §3.1, §5.4.

**Không làm (v1):** streaming; gọi API Anthropic / OpenAI (kể cả model GPT / Claude qua OpenCode — cần `/responses`, `/messages`); tự động hóa trang ChatGPT (điền sẵn, đọc trả lời, đọc clipboard); cổng web cho "AI trích xuất"; legal pack; AI tự chạy khi KYC đổi (luôn do RE bấm); AI ghi vào bảng nào khác `ai_analyses`; nút "gửi" / "đặt lịch" do AI kích hoạt; tính tiền theo token (chỉ lưu số token; số dư credit xem trên dashboard OpenCode).

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

### 3.1 Phân tích qua ChatGPT web (P7)

```
RE bấm "Phân tích bằng ChatGPT web" (cổng cho phép như nút Phân tích)
  │
  ├─ Ảnh chụp đầu vào như §3 (phiên bản KYC, dữ kiện, cổng) → mở "phiên web" của KH này
  ├─ Dựng MỘT tin nhắn: prompt <mode>@<version> + đầu vào, bọc theo web@1 (G5)
  ├─ Copy tin nhắn vào clipboard; mở https://chatgpt.com/ bằng trình duyệt mặc định (§5.4)
  │    (người dùng tự đăng nhập, chọn model / reasoning, dán, chờ, bấm copy câu trả lời)
  ├─ Người dùng dán câu trả lời vào khung "Dán kết quả" → bấm "Kiểm tra và lưu"   [lần thử 1]
  ├─ Lấy khối JSON đầu tiên (§6.1) → Validator V1–V6 với đầu vào đã chụp
  │    đạt → lưu ACCEPTED (attempts 1), đóng phiên
  │    không đạt → hiện lỗi + nút "Copy yêu cầu sửa" (message thử lại G5 §5)
  │         người dùng dán vào CÙNG cuộc chat, dán câu trả lời mới vào khung   [lần thử 2]
  │         đạt → ACCEPTED (attempts 2) · không đạt → lưu REJECTED (attempts 2), đóng phiên
  └─ Hủy phiên / đóng panel / rời Hồ sơ KH trước khi xong → không lưu gì
```

1. **Không tự động hóa trang ChatGPT:** app không điền sẵn, không đọc câu trả lời, không đọc clipboard. Người dùng tự dán vào khung (Ctrl+V). Không đưa dữ kiện lên URL (lịch sử trình duyệt lưu URL); không dùng tham số không chính thức như `?q=`, `?temporary-chat=`.
2. Copy lỗi (quyền clipboard) → hiện ô chỉ đọc chứa tin nhắn để người dùng tự chọn và copy. Nút **Copy lại** dùng được suốt phiên.
3. Khung dán: chữ thường, không render HTML / Markdown; rỗng sau khi cắt khoảng trắng → nút tắt, không tính lần thử; quá 20 000 ký tự → báo lỗi tại khung, không tính lần thử (giới hạn `raw_output` §7.1). Câu trả lời không có JSON → V1, **có** tính lần thử (như model trả sai).
4. Mỗi KH tối đa một phiên web; phiên chỉ sống trong panel đang mở (không lưu DB, như đề xuất trích xuất §8). Trong phiên, nút **Phân tích** (OpenCode / Mock) và nút ChatGPT web của KH đó tắt.
5. Phiên web không gọi mạng từ app → **không** giữ khóa "một yêu cầu AI" (P5); yêu cầu OpenCode ở KH khác vẫn chạy được. Kiểm và lưu chạy ngay trong webview.
6. RE đổi KYC trong lúc phiên mở → kết quả vẫn lưu, gắn phiên bản đã chụp, nên hiện STALE ngay (như §3 điểm 2).
7. Lưu: `provider` = `CHATGPT_WEB`, `model` / `reasoning` / token = `null`, `prompt_version` = `<mode>@<n>+web@<m>` (vd. `analysis@1+web@1`), `raw_output` = câu trả lời dán lần cuối khi REJECTED (§7.1).
8. Bản web (`dev:web`, e2e) mở trang bằng `window.open(url, '_blank', 'noopener')`; e2e chỉ kiểm có gọi mở trang, phần dán / kiểm / lưu chạy thật (không cần mạng).

## 4. Provider và Settings → AI

### 4.1 Cấu hình

Lưu ở bảng `settings`, khóa `ai`, giá trị JSON:

```json
{ "provider": "MOCK", "opencodePlan": "GO", "model": "deepseek-v4.1-flash", "reasoning": "DEFAULT" }
```

| Trường | Giá trị | Mặc định |
|---|---|---|
| `provider` | `MOCK` · `OPENCODE_GO` (hiện "OpenCode"; mã giữ nguyên cho cả hai gói) | `MOCK` |
| `opencodePlan` | `GO` (gói Go) · `CREDIT` (credit trả theo yêu cầu) — P8; chỉ dùng khi `provider` = `OPENCODE_GO` | `GO` |
| `model` | một mã trong danh sách §4.2 | model mặc định của danh sách |
| `reasoning` | `DEFAULT` (không gửi) · `LOW` · `MEDIUM` · `HIGH` | `DEFAULT` |

- ChatGPT web (P7) **không** phải giá trị của `provider`: nút ChatGPT web luôn có ở panel khi cổng cho phép, bất kể provider đang chọn; chỉ ghi `CHATGPT_WEB` vào `ai_analyses.provider` (§7.1).
- `opencodePlan` thiếu hoặc sai (cấu hình lưu trước P8) → `GO`, như luật "giá trị sai → mặc định" dưới.

- **Không có key** trong giá trị này (D-1 mục 4). Bảng `settings` đi vào backup → nhập backup ở máy kia mang theo provider / model, không mang key.
- Mock chỉ chạy khi được chọn (D-1 mục 6). Kết quả Mock luôn gắn chip **"Mock"** để không lẫn với phân tích thật.
- Bản web (`pnpm dev:web`, e2e) không có Rust: `OPENCODE_GO` hiện nhưng tắt, ghi "Chỉ có trong app exe". Test dùng adapter giả (§12).
- Giá trị đọc được nhưng sai (model không còn trong danh sách, JSON hỏng) → dùng mặc định, Settings hiện cảnh báo một dòng; không ném lỗi khi mở app.

### 4.2 Danh sách model (P3)

Hằng số trong `packages/ai`, mỗi dòng: mã model, tên hiện, có nhận `reasoning_effort` không. Đề xuất ban đầu (theo tài liệu OpenCode Go 07/10/2026, chỉ model dùng `/chat/completions`). Các model này cũng có trên endpoint Credit (`/zen/v1/chat/completions`, tài liệu OpenCode Zen 08/10/2026) → **một danh sách chung cho hai gói**:

| Mã | `reasoning_effort` (kiểm 09/10/2026) | Ghi chú |
|---|---|---|
| `glm-5.3` | không nhận: `low` / `high` đều 200 nhưng trả lời như nhau, không báo token suy luận | |
| `kimi-k3` | **nhận**: token suy luận `low` 16 < `high` 28 | |
| `deepseek-v4.1-flash` | **nhận**: token suy luận `low` 50 < `high` 65 | **mặc định** (Owner 07/10/2026), rẻ, nhanh |

- **Đã bỏ `deepseek-v4-pro`** (Owner 09/10/2026, T-180 #450): gói Credit trả 403 "Upstream request failed: Model access is disabled" ở mọi yêu cầu, kể cả khi không gửi `reasoning_effort`. Cấu hình đã lưu (hay nhập từ backup) model này → mặc định + cảnh báo một dòng (§4.1, mockup 1g). Phân tích cũ đã lưu với model này vẫn hiện mã model như đã ghi.

- Model nào nhận `reasoning_effort` thì task đầu tiên gọi thật kiểm (một request mẫu, Owner chạy, §11); chưa kiểm hoặc không nhận → ô Reasoning tắt cho model đó.
- Kết quả kiểm (T-179 #447): Owner gọi thật trên gói Credit 09/10/2026, mỗi model 3 lần (không gửi / `low` / `high`), câu hỏi rất ngắn, một mẫu mỗi ô; 12 dòng gốc ở comment của #447 (gồm 3 dòng 403 của `deepseek-v4-pro`). Nhận = `low` và `high` đều 200 và token suy luận đổi theo mức. Một danh sách cho hai gói → áp cho cả gói Go. `medium` không kiểm riêng: nhận `low` và `high` thì coi như nhận `medium`. Mức gửi đi viết thường (`low` / `medium` / `high`).
- Model mặc định chỉ là giá trị ban đầu; Owner chủ động đổi model và reasoning level trong Settings (Owner 07/10/2026). Thêm / bớt model = một task nhỏ; model cần `/responses` hay `/messages` (Grok, GPT, Qwen, MiniMax) phải qua G4 vì D-1 chỉ mở `/chat/completions`.

### 4.3 Key

- Ô nhập key **chỉ ghi**: không bao giờ hiện lại giá trị; trạng thái "Đã có key" / "Chưa có key" lấy từ lệnh `ai_key_status`.
- Nút **Lưu key** (gọi `ai_key_set`, key cắt khoảng trắng hai đầu, rỗng hoặc > 512 ký tự → báo lỗi tại ô), **Xóa key** (hộp xác nhận → `ai_key_delete`).
- **Kiểm tra kết nối**: gửi một yêu cầu rất ngắn tới model đang chọn, báo "Kết nối được" hoặc lỗi theo §5.3. Tốn rất ít token; không lưu gì.

## 5. Lệnh Rust (D-1)

### 5.1 Lệnh

| Lệnh | Vào | Ra |
|---|---|---|
| `ai_complete` | `sessionId`, `plan` (`GO` · `CREDIT`), `model`, `reasoning` (`null` = không gửi), `messages` (`[{role, content}]`), `maxTokens` | `{ content, promptTokens, completionTokens }` |
| `ai_key_set` | `key` | — |
| `ai_key_delete` | — | — (không có key cũng Ok) |
| `ai_key_status` | — | `bool` |
| `open_chatgpt` | — | — (§5.4) |

- Hai URL cố định trong Rust, chọn theo `plan` (P8): `GO` → `https://opencode.ai/zen/go/v1/chat/completions`, `CREDIT` → `https://opencode.ai/zen/v1/chat/completions`. `plan` khác hai giá trị → `AI_BAD_REQUEST`. Webview không truyền URL. Không lệnh nào trả key.
- Key ở Windows Credential Manager, một mục chung cho hai gói: service `Project-2C`, user `opencode-go`. T-164: Owner gọi thật một lần mỗi gói để xác nhận cùng key dùng được; Credit cần key khác → dừng, quay lại G6.
- Header, cả hai gói (ADR-0009 W-1 mục 7, T-178): `x-opencode-session: <sessionId>` và `User-Agent: Project-2C/<phiên bản>`. `sessionId` do `packages/ai` sinh ngẫu nhiên, một mã cho mỗi cuộc hội thoại (hai lần thử của một lần phân tích / trích xuất dùng chung; mỗi lần Kiểm tra kết nối một mã); 1–64 ký tự `[A-Za-z0-9-]`, sai → `AI_BAD_REQUEST`. Không ghi vào DB, log, thông báo lỗi.
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
| `AI_NO_KEY` | chưa có key | Chưa có API key OpenCode — nhập ở Cài đặt → AI |
| `AI_UNAUTHORIZED` | HTTP 401 / 403 | Key không hợp lệ hoặc hết hạn (gói Go hết hạn → chọn gói Credit ở Cài đặt → AI) |
| `AI_RATE_LIMITED` | HTTP 402 / 429 | Đã chạm giới hạn gói Go hoặc hết credit OpenCode — thử lại sau, hoặc đổi gói / nạp credit |
| `AI_TIMEOUT` | quá 120 s | AI không trả lời trong 2 phút |
| `AI_NETWORK` | DNS / TLS / mất kết nối | Không kết nối được OpenCode |
| `AI_HTTP` | HTTP khác 2xx còn lại | OpenCode báo lỗi (mã HTTP) |
| `AI_BAD_RESPONSE` | không phải JSON OpenAI, thiếu `choices[0].message.content`, > 2 MB | Trả lời của OpenCode không đọc được |
| `AI_BUSY` | đã có một yêu cầu AI đang chạy (§5.2) | Đang có một yêu cầu AI khác — chờ xong rồi thử lại |
| `AI_BAD_REQUEST` | đầu vào lệnh sai (§5.1) | lỗi lập trình — hiện thông báo chung |
| `AI_KEYRING` | Credential Manager lỗi | Không đọc / ghi được key trong Windows Credential Manager |

Thông báo lỗi **không** chứa key, header hay thân yêu cầu; chỉ mã HTTP và tối đa 200 ký tự đầu của thông điệp lỗi từ server.

- Mã HTTP thật khi gói Go hết hạn / hết credit chưa có tài liệu: T-164 ghi lại từ lần gọi thật của Owner; khác bảng trên → sửa ánh xạ trong cùng task (mã lỗi `AiError` không đổi).

### 5.4 Mở ChatGPT web (P7)

- Lệnh `open_chatgpt` không nhận tham số, mở **đúng** URL hằng số `https://chatgpt.com/` bằng trình duyệt mặc định của Windows qua `std::process::Command` (ADR-0016: chỉ `std`, không crate / plugin mới). Webview không truyền URL.
- Không chờ trình duyệt, không đọc kết quả; không dùng cờ "đang chạy" của `ai_complete` (§3.1 điểm 5). Không mở được → `AI_OPEN_BROWSER` ("Không mở được trình duyệt — mở chatgpt.com bằng tay; tin nhắn đã được copy").

## 6. Output, validator, mức bằng chứng

### 6.1 Đầu vào gửi AI (tối thiểu dữ liệu)

- **Phân tích:** chỉ dữ kiện đã xác nhận còn hiệu lực (`active`, `conflict`) của phiên bản hiện tại, mỗi dữ kiện một mã **`F{seq}`** (seq của `kyc_facts`, theo KH), kèm nhãn trường tiếng Việt, giá trị, ngày xác nhận, cờ mâu thuẫn; tuổi = năm nay − năm sinh; trạng thái cổng + hạng mục còn thiếu. **Không gửi** tên, mã KH, tên RE, ghi chú KYC, lịch hẹn, HĐ.
- **Trích xuất:** đúng một ghi chú KYC (văn bản RE đã ghi) + danh sách trường được phép. Ghi chú có thể chứa tên người: Settings → AI ghi rõ "Trích xuất gửi nguyên văn ghi chú tới OpenCode".
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
| `provider` | text | `MOCK` · `OPENCODE_GO` · `CHATGPT_WEB` (P7, migration mới đổi CHECK) |
| `model` | text | `null` với Mock và ChatGPT web |
| `reasoning` | text | `DEFAULT` / `LOW` / `MEDIUM` / `HIGH`; `null` với Mock và ChatGPT web |
| `prompt_version` | text | vd. `analysis@1`; ChatGPT web: `analysis@1+web@1` (§3.1) |
| `attempts` | integer | 1 hoặc 2 |
| `input_json` | text | ảnh chụp dữ kiện gửi đi (mã F, trường, giá trị, ngày, cờ mâu thuẫn) + cổng (hạng mục thiếu, cảnh báo mâu thuẫn phụ) |
| `output_json` | text | output đã parse của lần thử cuối; `REJECTED` mà không parse được → `null` |
| `raw_output` | text | `null` khi `ACCEPTED`; nội dung thô lần thử cuối khi `REJECTED` (≤ 20 000 ký tự) |
| `validator_json` | text | báo cáo validator của từng lần thử |
| `prompt_tokens`, `completion_tokens` | integer | cộng hai lần thử; `null` với Mock và ChatGPT web |
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
  2. `mode` / `gate_state` / `status` / `provider` / `reasoning` trong miền; Mock hoặc ChatGPT web ⇔ `model`, `reasoning`, token đều `null`; ChatGPT web ⇒ `prompt_version` kết thúc bằng `+web@<n>`.
  3. `input_json` qua schema đầu vào của chế độ (`analysisInputSchema`: `analysisDate` `yyyy-mm-dd`, `mode` trùng cột `mode`, `facts[]` mã `F{seq}` không trùng, `confirmedAt` `yyyy-mm-dd`, `missingCategories[]`, `conflictWarnings[]`), áp cho **mọi** dòng kể cả `REJECTED` (đầu vào chụp trước khi gọi AI; `recordAiAnalysis` kiểm cùng schema — Owner duyệt 09/10/2026, T-176); `validator_json` là JSON hợp lệ; `ACCEPTED` → `output_json` qua zod schema của `mode` và mọi `evidence` có trong `input_json`; `REJECTED` → `raw_output` không rỗng. Schema lấy từ `@p2c/ai/schema` (`db` chỉ được import module này của `ai`, ADR-0006 phụ lục 07/10/2026), luôn là **schema mới nhất** của mỗi chế độ, không giữ schema cũ theo `prompt_version`; đổi schema → nạp lại dữ liệu giả lập (R2-02).
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
| Được gọi AI (P7) | Cạnh nút **Phân tích** có nút **Phân tích bằng ChatGPT web** (cùng điều kiện cổng; tắt khi đang có yêu cầu AI hay phiên web của KH này) |
| Phiên web: chờ dán (§3.1) | "Đã copy tin nhắn và mở ChatGPT — dán tin nhắn, rồi dán câu trả lời vào đây"; **Copy lại** · **Mở lại ChatGPT** · khung **Dán kết quả** · **Kiểm tra và lưu** · **Hủy**; badge chế độ + "kyc v<seq>" của ảnh chụp |
| Phiên web: lần 1 không đạt | Danh sách lỗi validator (mã + vị trí + chi tiết, như REJECTED) + "Còn 1 lần thử" + **Copy yêu cầu sửa** (dán vào cùng cuộc chat); khung dán trống lại |
| Kết quả ChatGPT web | Như CURRENT / STALE / REJECTED ở trên; chip thay `<model>` bằng **"ChatGPT web"** (như chip Mock); lịch sử ghi provider "ChatGPT web" |

### 9.2 Chi tiết lịch hẹn

Khối chỉ đọc như mockup `appointments.html`: Next Best Actions + Discovery Strategy của bản ACCEPTED mới nhất của KH, badge CURRENT / STALE, ngày; không có nút gọi AI; chưa có → "Chưa có phân tích AI" + liên kết tới Hồ sơ KH.

### 9.3 Settings → AI

Mục **AI** trong thanh mục Cài đặt (mockup `settings-data.html` đã có mục "AI"): Provider, **Gói OpenCode** (Go / Credit, chỉ hiện khi provider là OpenCode — P8), Model, Reasoning, Key (§4.3), Kiểm tra kết nối (theo gói đang chọn), dòng giải thích dữ liệu gửi đi (§6.1), và một dòng về ChatGPT web: "Phân tích bằng ChatGPT web: bạn tự dán dữ kiện KYC (không có tên, mã KH) vào tài khoản ChatGPT của mình".

### 9.4 Cần mockup (G3) — Owner duyệt 08/10/2026

Mockup: `mockups/ai.html` (+ `customer.html`), PR #427; quyết định ở `ai.html#ask`. Mục §9.3 "mockup `settings-data.html`" thay bằng `ai.html` §1.

1. Settings → AI (mới hoàn toàn).
2. Panel KYC Intelligence: các trạng thái §9.1 chưa có trong mockup (cổng chặn, đang chạy, lỗi, STALE, REJECTED gần nhất, chip Mock), chế độ discovery, khối "Thông tin tham khảo" (P6); bỏ dòng `KYC_INSUFFICIENT` khỏi lịch sử (P2).
3. Mã `F{seq}` trên danh sách dữ kiện; đề xuất trích xuất (đã có một dòng mẫu — thêm trạng thái đang chạy / 0 đề xuất / lỗi).

### 9.5 Cần mockup bổ sung (G3, W-1)

Mockup: `mockups/ai.html#s4` (4a–4i), quyết định ở `ai.html#ask-w1` — Owner duyệt 08/10/2026 (PR #431), gồm đổi tên provider hiện "OpenCode Go" → "OpenCode" (mã `OPENCODE_GO` không đổi).

1. Panel: nút **Phân tích bằng ChatGPT web**, phiên chờ dán, lần 1 không đạt, copy lỗi (ô chỉ đọc), chip "ChatGPT web" ở kết quả và lịch sử (§9.1).
2. Settings → AI: ô **Gói OpenCode** (Go / Credit) và dòng ChatGPT web (§9.3).

## 10. `packages/ai` — ranh giới

- Chỉ phụ thuộc `domain` + `zod`. Không import `db`, `ui`, Tauri. Adapter OpenCode Go nhận một hàm `invoke` được tiêm từ `apps/desktop` (ADR-0006, `pnpm lint:deps` thêm luật cho `ai`).
- Ngược lại, `db` chỉ được import **đúng** module schema `@p2c/ai/schema` (cho luật nhập backup 3, §7.3); module này chỉ import `zod` + `domain` (ADR-0006 phụ lục 07/10/2026, Owner quyết).
- Giao diện adapter: `complete({ model, reasoning, messages, maxTokens }) → { content, promptTokens, completionTokens }`; lỗi là `AiError` với mã §5.3.
- **Mock**: không ngẫu nhiên, sinh output hợp lệ từ chính dữ kiện đầu vào (mỗi khối trích dữ kiện có thật, câu mẫu cố định); trích xuất Mock nhận vài mẫu chữ đơn giản ("<n> con", "kết hôn"…). Dùng cho demo, e2e.
- Prompt: `packages/ai/src/prompts/<mode>.ts`, mỗi file một hằng `version`; đổi chữ prompt = tăng version + qua G5.
- ChatGPT web (P7): `ai` thêm hàm dựng tin nhắn `web@1` từ đầu vào đã chụp và hàm kiểm câu trả lời dán vào (lấy JSON → V1–V6 → thử lại / REJECTED như §3) trả `row` cho `recordAiAnalysis`. Không đi qua adapter hay `AiRunner` (không gọi mạng); luật đếm lần thử và dựng message thử lại dùng chung với luồng gọi AI, không chép lại.

## 11. Bộ eval

- `docs/golden/ai-eval.md` + fixture: ~20 hồ sơ (E01–E20) = 10 hồ sơ AI được gọi trong K01–K15 (K04–K10, K12, K13, K15) + ~10 hồ sơ mới phủ bẫy (KH nhắc tên sản phẩm, nhắc %, nhắc luật, mâu thuẫn phụ, chế độ discovery ít dữ kiện) + 5 ghi chú cho trích xuất. Owner duyệt (G2) trước khi chạy.
- Lệnh `pnpm eval:ai` (script Node trong `tools/`, đọc key từ biến môi trường `OPENCODE_GO_KEY` ở máy Owner, gói từ `OPENCODE_PLAN` = `GO` (mặc định) / `CREDIT` theo P8, **không** chạy trong CI). Mỗi hồ sơ: chế độ, số lần thử, lỗi validator, token, thời gian; ghi kết quả vào `docs/metrics/ai-eval-<yyyy-mm-dd>.md`.
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
| ChatGPT web (P7) | `ai`: tin nhắn `web@1` đúng chữ G5 (bọc + prompt + đầu vào); dán JSON hợp lệ → ACCEPTED attempts 1; sai rồi đúng → ACCEPTED attempts 2, message "Copy yêu cầu sửa" chứa lỗi; sai hai lần → REJECTED, `raw_output` = lần dán cuối; dán chữ không JSON → V1 có tính lần thử; dán rỗng / > 20 000 ký tự → không tính lần thử · `db`: `CHATGPT_WEB` với `model` / `reasoning` / token khác `null` → từ chối (lệnh + nhập backup) · e2e (bản web): bấm nút → clipboard có tin nhắn, có gọi mở trang; dán một output hợp lệ mẫu → CURRENT + chip "ChatGPT web"; đổi KYC trong phiên → STALE; Hủy → không lưu; trong phiên nút Phân tích của KH tắt |
| Gói OpenCode (P8) | `ai` / Settings: thiếu `opencodePlan` → `GO`; Rust: `GO` / `CREDIT` chọn đúng URL, giá trị khác → `AI_BAD_REQUEST`; ánh xạ 402 → `AI_RATE_LIMITED`; `open_chatgpt` chỉ mở URL hằng số (dữ liệu mẫu, không gọi mạng) |

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

**Bổ sung W-1 (08/10/2026)** — sửa Issue đang mở thay vì tạo trùng:

| # | Việc | Cổng trước | risk |
|---|---|---|---|
| 5 (sửa #405) | `ai_complete` thêm `plan` + hai URL; `open_chatgpt`; Owner gọi thật mỗi gói một lần | W-1 (G1) | high |
| 8 (sửa #408) | Settings: ô Gói OpenCode, dòng ChatGPT web | G3 bổ sung | med |
| 12 (sửa #413) | `OPENCODE_PLAN` cho `pnpm eval:ai` | W-1 (G1) | med |
| 13 (mới) | `ai`: tin nhắn `web@1` + kiểm câu trả lời dán; `db`: migration CHECK `provider` + luật nhập backup cho `CHATGPT_WEB` | W-1 (G1), G5 | high |
| 14 (mới) | Panel: luồng ChatGPT web (§3.1, §9.1) + e2e | G3 bổ sung | med |

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

**Bổ sung W-1 (Owner duyệt G1 08/10/2026, PR #430):**

- [x] P7, P8 ghi đúng quyết định 08/10/2026 (§1)
- [x] Phạm vi / không làm có ChatGPT web, không tự động hóa trang ChatGPT (§2)
- [x] Luồng ChatGPT web: copy, mở trang, dán, kiểm, 2 lần thử, hủy, STALE (§3.1)
- [x] Gói Go / Credit: cấu hình, hai URL cố định, cùng key, mã lỗi (§4.1, §5.1, §5.3)
- [x] Lệnh `open_chatgpt` chỉ `std`, URL hằng số (§5.4)
- [x] `ai_analyses` thêm `CHATGPT_WEB`, `prompt_version` `+web@n`, luật nhập backup 2 (§7)
- [x] UI, mockup bổ sung G3, test, Issue (§9.1, §9.3, §9.5, §12, §13)
