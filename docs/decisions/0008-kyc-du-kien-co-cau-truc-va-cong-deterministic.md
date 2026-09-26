# ADR-0008: KYC có cấu trúc và cổng chất lượng deterministic

- **Trạng thái:** Accepted (G1); danh mục, ngưỡng cổng, hồ sơ mẫu: Accepted (G2, 26/09/2026)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §2.2 (W2), §4.5 (Q8, Q9)
- **Commit / PR:** `20e9c5e` · G2: #30

## Bối cảnh

Cổng KYC phải deterministic, nhưng KYC nhập tự do — không thể xác định deterministic "đã đủ thông tin" từ văn bản tự do mà không dùng LLM.

## Quyết định

1. Tách **ghi chú KYC thô** (`kyc_notes`, append-only, bất biến) và **dữ kiện có cấu trúc** (`kyc_facts`, có note nguồn, trạng thái active/superseded/conflict).
2. Dữ kiện đến từ: RE chọn nhanh (chip/trường) **hoặc** nút "AI trích xuất" đề xuất → **RE xác nhận**. "AI trích xuất" là thao tác chủ động, tách khỏi phân tích, không chạy nếu ghi chú quá ngắn.
3. Mỗi thay đổi dữ kiện tạo `kyc_versions` (hash, tóm tắt "Cập nhật KYC dd/mm/yyyy", cờ material).
4. **Cổng** (TS thuần trong `domain`, có unit test) chỉ đọc dữ kiện đã xác nhận, chấm độ phủ theo 8 **hạng mục KYC** (trước gọi là "chiều"): danh tính/tuổi, gia đình, nghề nghiệp/nguồn thu, tài sản/AUM, mục tiêu & mốc thời gian, khẩu vị rủi ro, bảo vệ hiện có, mối quan tâm. Hồ sơ không đủ mọi hạng mục là bình thường.
5. Bốn trạng thái, theo thứ tự ưu tiên **mâu thuẫn cốt lõi > thiếu dữ liệu > khai thác > phân tích**:
   - `CONFLICT_RESOLUTION` — mâu thuẫn trường cốt lõi (năm sinh, gia đình, tài sản, mục tiêu) → không gọi AI, liệt kê để RE xử lý. Mâu thuẫn trường phụ → vẫn gọi AI kèm cảnh báo (Q8).
   - `KYC_INSUFFICIENT` — không gọi LLM; trả đúng **"Cần chăm sóc, KYC thêm thông tin khách hàng"** + hạng mục còn thiếu + câu hỏi gợi ý từ template (Q9).
   - `PROFILE_DISCOVERY` — gọi AI chế độ khai thác.
   - `PAIN_POINT_ANALYSIS` — gọi AI phân tích đầy đủ.

6. **Danh mục và ngưỡng (G2, 26/09/2026)** — chi tiết trường, câu hỏi gợi ý, hồ sơ mẫu: `docs/golden/kyc.md`; code: `packages/domain/src/kyc-catalog.ts`.
   - Mỗi hạng mục có danh sách **trường** và **trường chính**. Hạng mục **"đã có"** khi trường chính có ≥ 1 dữ kiện RE đã xác nhận, còn hiệu lực. "Không / chưa có" vẫn tính; trường đang mâu thuẫn vẫn tính; chỉ dữ kiện mới nhất có hiệu lực. Gia đình cần **cả** hôn nhân **và** số con; Nghề nghiệp/nguồn thu cần nghề nghiệp **hoặc** thu nhập.
   - **Trường cốt lõi:** năm sinh; tình trạng hôn nhân; số con; tổng tài sản/AUM; mục tiêu chính.
   - **Mâu thuẫn:** hai dữ kiện đã xác nhận cùng trường, khác giá trị, đều chưa bị thay thế.
   - `KYC_INSUFFICIENT`: thiếu một trong 3 hạng mục tối thiểu — danh tính/tuổi, gia đình, nghề nghiệp/nguồn thu.
   - `PROFILE_DISCOVERY`: đủ 3 hạng mục tối thiểu nhưng < 6/8 hạng mục, **hoặc** chưa có mục tiêu, **hoặc** chưa có cả tài sản lẫn bảo vệ hiện có (ca cuối: Owner chốt 26/09/2026).
   - `PAIN_POINT_ANALYSIS`: ≥ 6/8 hạng mục, có mục tiêu, có tài sản **hoặc** bảo vệ hiện có.
   - Câu hỏi gợi ý: 2–3 câu mỗi hạng mục, giọng tư vấn cho KH Ultra High Net Worth.

## Phương án đã cân nhắc

- **LLM đọc ghi chú tự do để quyết định cổng** — loại: không deterministic, tốn call cả khi hồ sơ rõ ràng thiếu.
- **Chỉ form cấu trúc, bỏ ghi chú tự do** — loại: mất ngữ cảnh, RE nhập chậm.

## Lý do

Cổng deterministic thật, test được, và `KYC_INSUFFICIENT` không tốn call AI.

## Hệ quả

- Hồ sơ mẫu `packages/domain/src/golden/kyc.fixture.ts` (bảng đối chiếu `docs/golden/kyc.md`) là test bắt buộc của cổng; không sửa để "cho xanh". Là nền cho bộ eval AI ở Phase 5.
- UI hồ sơ KH cần timeline KYC và luồng xác nhận dữ kiện.
