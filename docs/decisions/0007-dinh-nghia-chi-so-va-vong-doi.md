# ADR-0007: Định nghĩa chỉ số và vòng đời khách hàng / hợp đồng

- **Trạng thái:** Accepted (G1) cho định nghĩa; **golden examples + mô hình dữ liệu chờ G2**
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §2.2 (W3, W4, W5, W8), §2.3, §4.4, §7 (Q3–Q7)
- **Commit / PR:** `20e9c5e` · PR: —

## Bối cảnh

Chỉ số mơ hồ → hai người đọc ra hai con số khác nhau. Pipeline N4→N1 thiếu trạng thái cuối; kết quả cuộc gặp dạng văn bản tự do không thống kê được.

## Quyết định

**Vòng đời (Q7):**

- HĐ là thực thể riêng, chỉ `submitted → issued`. `submitted` = RE chốt thành công, KH **đã đóng phí**. Một KH có nhiều HĐ.
- Nhóm KH N4 → N3 → N2 → N1: được nâng, được **hạ**; thêm trạng thái đóng `ON_HOLD` (Tạm hoãn) / `LOST` (Mất cơ hội), mở lại được.
- Sau khi có HĐ: KH giữ nhóm + nhãn "Đã có HĐ" (số HĐ).
- Mọi lần chuyển nhóm lưu thành sự kiện `stage_transitions`.

**Chỉ số:**

| Chỉ số | Định nghĩa | Trạng thái |
|---|---|---|
| HĐ đã nộp | Số HĐ có `submitted_date` trong kỳ | Đề xuất (G2) |
| HĐ phát hành | Số HĐ có `issued_date` trong kỳ | Đề xuất (G2) |
| Case size | **Σ FYP** HĐ đã nộp trong kỳ (tổng, không trung bình) — Q6 | Chốt |
| Doanh số | **Σ issued FYP** theo `issued_date` — Q5 | Chốt |
| Tỉ lệ chốt | Σ HĐ submitted có `submitted_date` ≤ cuối kỳ ÷ số KH khác nhau từng ở N2/N1 tại thời điểm ≤ cuối kỳ — lũy kế cả tử và mẫu, có thể > 100% (Q3, Q3c) | Chốt |
| Cuộc gặp chuyển RF (Refer) | Cuộc hẹn *đã gặp* mà sau đó KH được **nâng** lên nhóm mới ∈ {N3, N2, N1}, kể cả nhảy cóc; hạ nhóm không tính, nâng lại sau khi hạ có tính (Q4) | Chốt |
| Tuần | Thứ Hai → Chủ Nhật | Đề xuất (G2) |
| MTD | Ngày 1 của tháng → ngày đang xem | Đề xuất (G2) |

**Nhập liệu:**

- Kết quả cuộc gặp = văn bản + **trường có cấu trúc bắt buộc** (trạng thái, nhóm sau cuộc gặp, case size dự kiến, việc tiếp theo) (W3).
- Ngày `dd/mm` mặc định năm hiện tại; luôn hiện ngày đầy đủ đã diễn giải; nếu đã qua > 60 ngày → gợi ý năm sau (W8).

## Phương án đã cân nhắc

- Case size = trung bình — loại (Q6). Doanh số theo ngày nộp — loại (Q5). Tỉ lệ chốt theo KH / chỉ trong kỳ — loại (Q3, Q3c).
- Theo dõi từ chối/hủy/pending HĐ — hoãn, ngoài v1.

## Lý do

Định nghĩa bằng **golden examples** biến thành unit test → con số không thể hiểu sai.

## Hệ quả

- Owner cung cấp/duyệt golden examples ở **G2**; chúng là test bắt buộc của `domain`.
- Thực thể cốt lõi: `teams`, `people`, `customers`, `kyc_notes`, `kyc_facts`, `kyc_versions`, `stage_transitions`, `appointments`, `policies`, `ai_analyses`, `settings` — chi tiết chốt ở G2.
