# ADR-0008: KYC có cấu trúc và cổng chất lượng deterministic

- **Trạng thái:** Accepted (G1); **ngưỡng cổng chờ Owner duyệt ở Phase 2**
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §2.2 (W2), §4.5 (Q8, Q9)
- **Commit / PR:** `20e9c5e` · PR: —

## Bối cảnh

Cổng KYC phải deterministic, nhưng KYC nhập tự do — không thể xác định deterministic "đã đủ thông tin" từ văn bản tự do mà không dùng LLM.

## Quyết định

1. Tách **ghi chú KYC thô** (`kyc_notes`, append-only, bất biến) và **dữ kiện có cấu trúc** (`kyc_facts`, có note nguồn, trạng thái active/superseded/conflict).
2. Dữ kiện đến từ: RE chọn nhanh (chip/trường) **hoặc** nút "AI trích xuất" đề xuất → **RE xác nhận**. "AI trích xuất" là thao tác chủ động, tách khỏi phân tích, không chạy nếu ghi chú quá ngắn.
3. Mỗi thay đổi dữ kiện tạo `kyc_versions` (hash, tóm tắt "Cập nhật KYC dd/mm/yyyy", cờ material).
4. **Cổng** (TS thuần trong `domain`, có unit test) chỉ đọc dữ kiện đã xác nhận, chấm độ phủ theo các chiều: danh tính/tuổi, gia đình, nghề nghiệp/nguồn thu, tài sản/AUM, mục tiêu & mốc thời gian, khẩu vị rủi ro, bảo vệ hiện có, mối quan tâm. Hồ sơ không đủ mọi chiều là bình thường.
5. Bốn trạng thái, theo thứ tự ưu tiên **mâu thuẫn cốt lõi > thiếu dữ liệu > khai thác > phân tích**:
   - `CONFLICT_RESOLUTION` — mâu thuẫn trường cốt lõi (năm sinh, gia đình, tài sản, mục tiêu) → không gọi AI, liệt kê để RE xử lý. Mâu thuẫn trường phụ → vẫn gọi AI kèm cảnh báo (Q8).
   - `KYC_INSUFFICIENT` — không gọi LLM; trả đúng **"Cần chăm sóc, KYC thêm thông tin khách hàng"** + chiều còn thiếu + câu hỏi gợi ý từ template (Q9).
   - `PROFILE_DISCOVERY` — gọi AI chế độ khai thác.
   - `PAIN_POINT_ANALYSIS` — gọi AI phân tích đầy đủ.

## Phương án đã cân nhắc

- **LLM đọc ghi chú tự do để quyết định cổng** — loại: không deterministic, tốn call cả khi hồ sơ rõ ràng thiếu.
- **Chỉ form cấu trúc, bỏ ghi chú tự do** — loại: mất ngữ cảnh, RE nhập chậm.

## Lý do

Cổng deterministic thật, test được, và `KYC_INSUFFICIENT` không tốn call AI.

## Hệ quả

- Ngưỡng cụ thể đề xuất ở Phase 2 bằng bộ hồ sơ mẫu, Owner duyệt.
- UI hồ sơ KH cần timeline KYC và luồng xác nhận dữ kiện.
