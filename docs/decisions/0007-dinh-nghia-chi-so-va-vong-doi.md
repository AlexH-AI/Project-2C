# ADR-0007: Định nghĩa chỉ số và vòng đời khách hàng / hợp đồng

- **Trạng thái:** Accepted (G1) cho định nghĩa; golden examples + mô hình dữ liệu: Accepted (G2, 26/09/2026) — định nghĩa RF và tỉ lệ chốt đổi ở G2
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §2.2 (W3, W4, W5, W8), §2.3, §4.4, §7 (Q3–Q7)
- **Commit / PR:** `20e9c5e` · G2: #28

## Bối cảnh

Chỉ số mơ hồ → hai người đọc ra hai con số khác nhau. Pipeline N4→N1 thiếu trạng thái cuối; kết quả cuộc gặp dạng văn bản tự do không thống kê được.

## Quyết định

**Vòng đời (Q7):**

- HĐ là thực thể riêng, chỉ `submitted → issued`. `submitted` = RE chốt thành công, KH **đã đóng phí**. Một KH có nhiều HĐ.
- Nhóm KH N4 → N3 → N2 → N1: được nâng, được **hạ**; thêm trạng thái đóng `ON_HOLD` (Tạm hoãn) / `LOST` (Mất cơ hội), mở lại được — mở lại luôn về **N3** (G2).
- Định nghĩa nhóm (G2):
  - **N4** — KH mới, thiếu thông tin KYC; hoặc đã có KYC và mục tiêu là khơi gợi nhu cầu.
  - **N3** — KH quan tâm, lắng nghe; khơi gợi nhu cầu thành công.
  - **N2** — KH được IS trình bày giải pháp cụ thể, hoặc được gửi giải pháp cụ thể.
  - **N1** — KH chấp nhận giải pháp, chưa chốt HĐ chỉ vì một số yếu tố: cân nhắc tài chính, thời gian, lý do khác.
- **Tạo KH mới chỉ ở nhóm mở** N4/N3/N2/N1, không tạo thẳng ở `ON_HOLD`/`LOST` (Owner chốt 26/09/2026). Hai trạng thái đóng nghĩa là đã từng theo đuổi rồi dừng; KH "sinh ra đã đóng" làm lệch chỉ số mất cơ hội và tỉ lệ chốt. Nhập dữ liệu cũ (KH đã mất từ trước) chưa xử lý — quyết riêng khi làm tính năng nhập dữ liệu (vd. đánh dấu là dữ liệu nhập, không tính vào chỉ số kỳ). Code: `assertValidTransition` (#27).
- Sau khi có HĐ: KH giữ nhóm + nhãn "Đã có HĐ" (số HĐ).
- Mọi lần chuyển nhóm lưu thành sự kiện `stage_transitions`.

**Chỉ số:**

| Chỉ số | Định nghĩa | Trạng thái |
|---|---|---|
| HĐ đã nộp | Số HĐ có `submitted_date` trong kỳ | Chốt (G2) |
| HĐ phát hành | Số HĐ có `issued_date` trong kỳ | Chốt (G2) |
| Case size | **Σ FYP** HĐ đã nộp trong kỳ (tổng, không trung bình) — Q6 | Chốt |
| Doanh số | **Σ issued FYP** theo `issued_date` — Q5. FYP phát hành mặc định = FYP nộp, Owner sửa tay được theo thực tế (G2 D) | Chốt |
| Tỉ lệ chốt | **Số HĐ có `issued_date` trong kỳ ÷ số cuộc gặp chuyển RF trong kỳ** — tỉ lệ chuyển hóa RF → HĐ phát hành. Kỳ = ngày/tuần/tháng/năm/tùy chọn, **không lũy kế**; như nhau cho RE và team; có thể > 100%; 0 RF → hiện "—" (G2 F, H — thay Q3/Q3c) | Chốt (G2) |
| Cuộc gặp chuyển RF (Refer) | Cuộc hẹn **Đã gặp** mà "nhóm sau cuộc gặp" của chính cuộc hẹn đó đưa KH từ **N4/N3** lên **N2/N1** (kể cả N4→N2, N4→N1). N4→N3 và N2→N1 không tính; hạ nhóm không tính; nâng lại sau khi hạ có tính; mở lại từ Tạm hoãn/Mất cơ hội về N3 không tính. Mỗi cuộc gặp tối đa 1 RF, tính vào ngày gặp; nâng nhóm sửa tay ngoài cuộc hẹn không tính (G2 B, C — thay Q4) | Chốt (G2) |
| Tuần | Thứ Hai → Chủ Nhật | Chốt (G2) |
| MTD | Ngày 1 của tháng → ngày đang xem | Chốt (G2) |

**Góc nhìn và vai trò (G2 E, G):**

- HĐ và KH tính cho **RE phụ trách ghi trên HĐ/KH**; chuyển RF tính cho **RE ghi trên cuộc hẹn** (`appointment.reId`); team = team **hiện tại** của RE (v1 không theo dõi lịch sử chuyển team).
- Chỉ **RE** có chỉ số. TL/IS/BD/BDM là người phối hợp trong cuộc hẹn; team đã có chỉ số tổng nên không tính riêng cho TL.

**Trạng thái cuộc hẹn (G2 B):** Đã lên lịch / Đã gặp / Dời lịch / KH hủy / Không gặp được. Chỉ **Đã gặp** được xét chuyển RF.

- **Chỉ cuộc hẹn Đã gặp mới được ghi "nhóm sau cuộc gặp"**; các trạng thái khác để trống (G2). Cuộc hẹn chưa diễn ra thì chưa trình bày giải pháp (điều kiện lên N2), KH vẫn ở nhóm cũ.
- KH đổi nhóm ngoài cuộc gặp — được **gửi** giải pháp, chuyển hóa qua điện thoại… — thì sửa nhóm bằng tay; sửa tay **không** tính RF. RF chỉ đo hiệu quả cuộc gặp.

**Nhập liệu:**

- Kết quả cuộc gặp = văn bản + **trường có cấu trúc bắt buộc** (trạng thái, nhóm sau cuộc gặp, case size dự kiến, việc tiếp theo) (W3).
- Ngày `dd/mm` mặc định năm hiện tại; luôn hiện ngày đầy đủ đã diễn giải; nếu đã qua > 60 ngày → gợi ý năm sau (W8).

## Phương án đã cân nhắc

- Case size = trung bình — loại (Q6). Doanh số theo ngày nộp — loại (Q5).
- Tỉ lệ chốt = HĐ nộp lũy kế ÷ KH từng ở N2/N1 lũy kế (Q3, Q3c) — **thay ở G2** bằng HĐ phát hành ÷ RF trong cùng kỳ: đo trực tiếp hiệu quả chuyển RF thành HĐ, đọc được theo từng tuần/tháng.
- RF tính cả N4→N3 (Q4 cũ) — **thay ở G2**: chỉ lên N2/N1 mới là cơ hội thật.
- Theo dõi từ chối/hủy/pending HĐ — hoãn, ngoài v1.

## Lý do

Định nghĩa bằng **golden examples** biến thành unit test → con số không thể hiểu sai.

## Hệ quả

- Golden examples: `packages/domain/src/golden/metrics.fixture.ts`, bảng đối chiếu `docs/golden/chi-so.md` (Owner duyệt G2). Là test bắt buộc của stats engine; không sửa để "cho xanh".
- Mô hình dữ liệu cho chỉ số: `packages/domain/src/model.ts` (`Team`, `Person`, `Customer`, `StageTransition`, `Appointment`, `Policy`, `Scope`).
- Thực thể cốt lõi: `teams`, `people`, `customers`, `kyc_notes`, `kyc_facts`, `kyc_versions`, `stage_transitions`, `appointments`, `policies`, `ai_analyses`, `settings` — các thực thể dùng cho chỉ số chốt ở G2 (xem trên); KYC chốt ở ADR-0008 / #30.

## Phụ lục — G2 Phase 4 (03/10/2026, #253)

Chi tiết + golden: `docs/design/phase-4-chi-so.md`, `docs/golden/lich-hen.md` (A01–A13), `docs/golden/kh-theo-nhom.md` (S01–S13). Định nghĩa trong bảng chỉ số ở trên không đổi; G01–G22 giữ nguyên.

- **Đếm lịch hẹn:** 4 nhóm — Đã gặp / Dời – hủy – không đến / **Chưa ghi kết quả** (Đã lên lịch, ngày trước hôm nay) / Dự kiến (Đã lên lịch, từ hôm nay). Mỗi mắt xích của chuỗi dời tính một lần ở kỳ của ngày mình; xóa lịch con → lịch gốc vẫn là Dời lịch. Góc nhìn theo RE trên cuộc hẹn.
- **KH theo nhóm:** ảnh chụp ở mốc (cuối kỳ; kỳ chưa hết → hôm nay), theo RE hiện tại của KH; KH đã xóa không tính. Tổng quan 4 ô N4–N1 + chart diễn biến; báo cáo thêm Tạm hoãn, Mất cơ hội.
- **Miền năm:** 1900–2100 (`MAX_YEAR = 2100`); kỳ luôn nằm trong miền, `PeriodPicker` tắt nút ở biên.
- **Tổng quan / Báo cáo:** kỳ chưa hết tính tới hôm nay (tháng = MTD); 6 ô KPI so với kỳ trước cùng số ngày; bảng So sánh team bấm xổ RE; báo cáo có bảng Theo mốc; dòng Tổng tính tỉ lệ chốt từ tổng (Σ PH ÷ Σ RF).
