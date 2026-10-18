# ADR-0008: KYC có cấu trúc và cổng chất lượng deterministic

- **Trạng thái:** Accepted (G1); danh mục, ngưỡng cổng, hồ sơ mẫu: Accepted (G2, 26/09/2026); cờ material: Accepted (Owner, 26/09/2026); dọn sạch Thùng rác xóa dữ liệu KYC của KH đã xóa ở phụ lục (Accepted G1, Owner duyệt 19/10/2026, PR #707)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §2.2 (W2), §4.5 (Q8, Q9)
- **Commit / PR:** `20e9c5e` · G2: #30

## Bối cảnh

Cổng KYC phải deterministic, nhưng KYC nhập tự do — không thể xác định deterministic "đã đủ thông tin" từ văn bản tự do mà không dùng LLM.

## Quyết định

1. Tách **ghi chú KYC thô** (`kyc_notes`, append-only, bất biến) và **dữ kiện có cấu trúc** (`kyc_facts`, có note nguồn, trạng thái active/superseded/conflict).
2. Dữ kiện đến từ: RE chọn nhanh (chip/trường) **hoặc** nút "AI trích xuất" đề xuất → **RE xác nhận**. "AI trích xuất" là thao tác chủ động, tách khỏi phân tích, không chạy nếu ghi chú quá ngắn.
3. Mỗi thay đổi dữ kiện tạo `kyc_versions` (hash, tóm tắt "Cập nhật KYC dd/mm/yyyy", cờ material — luật ở mục 7).
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

7. **Cờ material của phiên bản KYC (Owner chốt 26/09/2026, hướng kết hợp)** — code: #38.
   - Phiên bản đầu tiên (chưa có phiên bản trước) luôn material.
   - Các phiên bản sau material khi ít nhất một **trường cốt lõi** có tập dữ kiện còn hiệu lực (active hoặc conflict) thay đổi so với phiên bản trước: thêm, đổi giá trị, bỏ, hoặc vào/ra trạng thái mâu thuẫn. Thay đổi chỉ ở trường phụ → không material.
   - RE được **bật** material thủ công khi thay đổi chỉ ở trường phụ; **không được tắt** khi luật đã bật. Giá trị cuối = `luật || bật tay`.

## Phương án đã cân nhắc

- **LLM đọc ghi chú tự do để quyết định cổng** — loại: không deterministic, tốn call cả khi hồ sơ rõ ràng thiếu.
- **Chỉ form cấu trúc, bỏ ghi chú tự do** — loại: mất ngữ cảnh, RE nhập chậm.

## Lý do

Cổng deterministic thật, test được, và `KYC_INSUFFICIENT` không tốn call AI.

## Hệ quả

- Hồ sơ mẫu `packages/domain/src/golden/kyc.fixture.ts` (bảng đối chiếu `docs/golden/kyc.md`) là test bắt buộc của cổng; không sửa để "cho xanh". Là nền cho bộ eval AI ở Phase 5.
- UI hồ sơ KH cần timeline KYC và luồng xác nhận dữ kiện.

## Phụ lục — dọn sạch Thùng rác xóa dữ liệu KYC của KH đã xóa (Accepted G1, Owner duyệt 19/10/2026 · Issue #662, PR #707)

Bối cảnh: deep review lượt 2 thấy Thùng rác mở chậm dần theo số bản ghi (DR6-84). Owner chọn thêm nút "Dọn sạch Thùng rác…" (17/10/2026, tổng hợp lượt 2 §9 Q8 (c)). Dọn một KH đã xóa mềm là xóa hẳn KH cùng mọi dữ liệu con, trong đó có ghi chú KYC, dữ kiện và lịch sử phân tích AI. Ba bảng này đang chỉ thêm, có trigger chặn mọi lần xóa: ghi chú, dữ kiện theo Quyết định 1 (migration `0003`); phân tích AI theo spec Phase 5 §7.1 (migration `0006`, dựng lại ở `0008`).

- **Ngoại lệ duy nhất của append-only:** lệnh dọn sạch Thùng rác (spec Phase 6 §4.2 TR-6, TR-11) xóa hẳn `kyc_notes`, `kyc_facts` (và `kyc_versions`, vốn không có trigger) cùng `ai_analyses` của KH **đã xóa mềm**. Không có thao tác nào khác xóa các dòng này. Với KH chưa xóa, mọi thứ vẫn bất biến như trước.
- **Trigger:** migration tự viết mới tạo lại `kyc_notes_no_delete`, `kyc_facts_no_delete`, `ai_analyses_no_delete`, chỉ cho xóa khi dòng thuộc KH có `deleted_at`; xóa dòng của KH chưa xóa vẫn bị chặn. Trigger chặn sửa (`kyc_notes_no_update`, `kyc_facts_status_only`, `ai_analyses_no_update`) không đổi: dòng của KH đã xóa cũng không sửa được.
- **Lý do:** KH đã xóa không vào danh sách và chỉ số, nên xóa hẳn dữ liệu của nó không đổi cổng KYC, phiên bản hay phân tích nào của KH khác. Giữ mãi dữ liệu con của KH đã xóa làm Thùng rác chậm dần và file chỉ lớn lên (≈ 9–10 KB mỗi KH). Dọn có hỏi trước và tự backup trước, nên phần đã dọn còn trong bản backup đó và trong các backup / file xuất cũ hơn.
- **Phương án loại:** tắt trigger trong lúc dọn (xóa trigger rồi tạo lại trong cùng transaction). SQLite hoàn tác được cả hai, nhưng trong lúc đó mọi dòng của mọi KH đều xóa được, và DDL nằm trong code của app thay vì migration.
