# ADR-0009: AI copilot — provider OpenCode Go + Mock, output có schema và validator

- **Trạng thái:** Accepted (G1); **prompt/guardrail chờ G5, lưu key chờ G6**
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
