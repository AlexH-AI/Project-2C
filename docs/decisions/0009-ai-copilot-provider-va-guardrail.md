# ADR-0009: AI copilot — provider OpenCode Go + Mock, output có schema và validator

- **Trạng thái:** Accepted (G1); gọi mạng + lưu key chốt ở phụ lục D-1 (G4 / G6, 07/10/2026); prompt / guardrail chốt ở phụ lục G5 (07/10/2026)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §2.2 (W6, W7), §4.5 (Q10, Q11); C2
- **Commit / PR:** `20e9c5e` · PR: —

## Bối cảnh

Copilot phân tích KYC tiếng Việt phải tuân ranh giới: không bán hàng, không chấm điểm, không "% chốt", không gợi ý sản phẩm, không tự hành động. Gói ChatGPT Business / Claude Pro không cấp API cho app bên thứ ba.

## Quyết định

1. **Provider v1:** `Mock` + `OpenCode Go` qua adapter tương thích OpenAI (Q11, C2 — giống Project-2). Chọn model và reasoning level trong Settings. Interface adapter chung để v2 thêm Anthropic / OpenAI không sửa lõi. OpenCode Go chỉ là **runtime của sản phẩm**, không dùng để viết code (ADR-0001).
2. Output ép theo **zod schema** gồm Behavioral Hypotheses, Needs/Pain points/Opportunity Themes, Discovery Strategy, Next Best Actions. Prompt có version.
3. **Validator deterministic:** schema hợp lệ; mọi giả thuyết có evidence trỏ tới fact tồn tại; không %, "xác suất", "khả năng chốt"; không tên sản phẩm (danh sách chặn); không nhãn tính cách (MBTI/DISC…); không trích dẫn điều luật/văn bản pháp lý.
4. Lỗi → thử lại 1 lần kèm phản hồi lỗi → vẫn lỗi → `REJECTED` (lưu, không hiện hành). `kyc_version` ≠ hiện tại → `STALE`. Đạt → `CURRENT`.
5. **Độ tin cậy** của giả thuyết tính deterministic từ số lượng/độ mới của bằng chứng, không do LLM tự khai.
6. **Pháp lý (Q10):** legal reference pack hoãn sang v2; v1 chỉ ghi "cần chuyên gia pháp lý xác nhận".
7. **Ranh giới được mã hóa:** AI chỉ ghi vào `ai_analyses`; không có nút "gửi"/"đặt lịch" nào do AI kích hoạt.
8. API key lưu ở Windows Credential Manager, nhập riêng mỗi máy.

## Phương án đã cân nhắc

- **Gọi Claude Sonnet / ChatGPT trực tiếp ở v1** — hoãn sang v2 (cần API key trả theo mức dùng).
- **Tin vào prompt, không validator** — loại: không kiểm chứng được ranh giới.

## Lý do

Validator + schema biến ranh giới thành thứ test được; Mock cho phép demo/test offline.

## Hệ quả

- `ai_analyses` lưu kyc_version, trạng thái cổng, provider/model/reasoning, prompt_version, trạng thái, output, báo cáo validator, token/chi phí.
- Bộ eval ~20 hồ sơ KYC giả lập, chạy thủ công với provider thật (tốn tiền → cần cổng Owner).

## Phụ lục D-1 — gọi mạng và lưu API key (G4 / G6, Owner chốt 07/10/2026)

Bối cảnh: review đóng Phase 1–3 (`docs/reviews/2026-09-30-phase-1-3-tong-hop.md`, D-1) chỉ ra CSP `connect-src` chỉ có `'self' ipc:` và Rust chỉ dùng `std` (ADR-0016), nên phải chọn cách gọi OpenCode Go trước khi viết `packages/ai`.

1. **Rust gọi mạng và giữ key.** Một lệnh Tauri (tên dự kiến `ai_complete`) nhận model, reasoning level, messages, đọc key từ Windows Credential Manager rồi `POST https://opencode.ai/zen/go/v1/chat/completions` (endpoint tương thích OpenAI của OpenCode Go). Lệnh trả nội dung trả lời và số token về webview, **không bao giờ trả key**. Thêm các lệnh đặt / xóa key và hỏi "đã có key chưa"; không có lệnh đọc key ra webview. URL gốc cố định trong Rust, webview không truyền URL tùy ý.
2. **CSP giữ nguyên** (`connect-src 'self' ipc: http://ipc.localhost`); webview không gọi mạng ra ngoài.
3. **Crate mới (G4):** `keyring` 4.x, chỉ bật kho Windows (`default-features = false`, `windows-native-keyring-store`), và `ureq` 3.x (TLS rustls + webpki roots mặc định). Ghim đúng phiên bản ở task đầu tiên dùng chúng. Đây là ngoại lệ có chủ ý cho quy tắc "Rust chỉ dùng `std`" của ADR-0016, chỉ cho lệnh AI; lệnh lưu file giữ nguyên. Thêm crate khác (`reqwest`, `tauri-plugin-http`…) vẫn qua G4.
4. **Chỗ lưu key (G6):** chỉ Windows Credential Manager, mỗi máy một key, Owner nhập ở Settings. Key **không** vào DB, bảng `settings`, `.p2cbackup`, log, thông báo lỗi hay file cạnh exe (bảng `settings` được xuất nguyên vào backup — deep review B, 06/10). Ô nhập key chỉ ghi, không hiện lại giá trị.
5. **Không streaming ở v1:** chờ đủ JSON rồi mới qua zod schema + validator. UI hiện "Đang phân tích…" có nút Hủy; lệnh Rust có timeout (giá trị chốt ở spec Phase 5).
6. **Thiếu key / lỗi mạng / 401 / timeout:** báo lỗi rõ, **không** tự đổi sang Mock và không lưu `ai_analyses`. Lỗi mạng / HTTP không tính là lần thử lại của validator (mục 4 ở trên chỉ áp cho output sai schema / bị chặn). Provider chọn rõ trong Settings (Mock / OpenCode Go); Mock chỉ chạy khi được chọn.
7. **Test:** `packages/ai` chạy Mock và adapter giả lập lệnh Rust trong Vitest / e2e (không gọi mạng thật trong CI). Lệnh Rust test phần dựng request / đọc response bằng dữ liệu mẫu; gọi thật chỉ ở bộ eval thủ công (tốn tiền → cổng Owner).

Còn chờ: **G5** (prompt + guardrail, danh sách chặn) và spec Phase 5 (timeout, Settings, lược đồ `ai_analyses`). → Spec Phase 5 duyệt G1 / G2 07/10/2026 (`docs/design/phase-5-ai.md`); G5 xem phụ lục dưới.

## Phụ lục G5 — prompt và guardrail (Owner duyệt 07/10/2026, PR #414)

Chữ prompt, danh sách chặn và ca kiểm ở `docs/design/phase-5-prompts.md`; quyết định Owner ở §9 của file đó.

1. **Nhãn tính cách không còn bị cấm** (sửa mục 3 "không nhãn tính cách (MBTI/DISC…)"). Output analysis / discovery có thêm khối riêng `personalityNotes` — "Thông tin tham khảo, không phải kết luận": mỗi phần tử ghi loại `PSYCHOLOGY` (MBTI, DISC, Enneagram, Big Five, hướng nội / hướng ngoại) hoặc `ESOTERIC` (cung hoàng đạo, con giáp, mệnh ngũ hành, nhóm máu, thần số học), AI suy ra từ dữ kiện, bắt buộc có bằng chứng (mã F), mức bằng chứng tính như các khối khác. Validator V5 chỉ chặn các nhãn này khi xuất hiện ở khối khác, để chúng không lẫn vào giả thuyết, nhu cầu hay hành động đề xuất. V3 / V4 / V6 vẫn áp cho khối này.
2. **Không gợi ý sản phẩm** (mục 3) được hiểu rộng: chặn cả tên hãng bảo hiểm lẫn tên **loại** sản phẩm (vd. "bảo hiểm trọn đời", "liên kết đơn vị"), kể cả khi tên có trong dữ kiện. Tên ngân hàng / công ty quản lý quỹ / mã chứng khoán chưa chặn ở v1.
3. **Trích dẫn pháp lý** (mục 3, mục 6): "khoản <số>" chỉ bị chặn khi đi kèm "Điều"; ý có yếu tố pháp lý / thuế viết "cần chuyên gia pháp lý xác nhận".
4. Dữ liệu gửi AI: năm sinh gửi dưới dạng tuổi.
