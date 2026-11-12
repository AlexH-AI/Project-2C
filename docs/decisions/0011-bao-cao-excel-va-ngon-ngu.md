# ADR-0011: Báo cáo Excel và giao diện tiếng Việt

- **Trạng thái:** Accepted (G1)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §4.4 (Q12, Q13)
- **Commit / PR:** `20e9c5e` · PR: —

## Bối cảnh

Owner cần xuất báo cáo theo kỳ và dùng giao diện tiếng Việt, trong khi ngành dùng nhiều thuật ngữ tiếng Anh.

## Quyết định

1. **Xuất báo cáo `.xlsx`** bằng ExcelJS, có định dạng, mỗi sheet 1 bảng (tổng hợp / theo team / theo RE), theo khoảng ngày / tháng / năm. **Không làm PDF ở v1** (Q12).
2. **Giao diện tiếng Việt**, giữ thuật ngữ ngành tiếng Anh (FYP, KYC, N1–N4, submitted/issued). Mọi chuỗi đi qua lớp **i18n** để sau này thêm ngôn ngữ (Q13).
3. Tiền định dạng kiểu "1,2 tỷ" / "500 tr"; số liệu `tabular-nums`.

## Phương án đã cân nhắc

- PDF — hoãn. CSV — loại: mất định dạng, nhiều bảng khó đọc.

## Lý do

Excel là định dạng Owner dùng để xem/chia sẻ số liệu; i18n từ đầu rẻ hơn nhiều so với tách chuỗi về sau.

## Hệ quả

- Checklist review có mục "không chuỗi UI cứng".
- Hướng thiết kế UI (tokens, font Be Vietnam Pro, bố cục màn hình) **chưa là ADR** — chốt ở G3.

## Phụ lục — song ngữ và tiền tệ (11/11/2026, ADR-0018; Owner duyệt cùng ADR-0018 ngày 12/11/2026)

Owner 11/11/2026 đưa giao diện song ngữ Việt / Anh và tiền tệ chọn một lần vào v1.0 ("Đưa vào v1.0"). ADR-0018 thay một phần ADR này:

- **Điểm 2:**
  - Thay phần "giao diện tiếng Việt": thêm English, đổi bất kỳ lúc nào trong Cài đặt; tiếng Việt chỉ chọn được khi tiền tệ của dữ liệu là VND.
  - Giữ nguyên hai phần: thuật ngữ ngành tiếng Anh, mọi chuỗi qua i18n. Lớp i18n làm từ đầu nay là chỗ thêm `en.ts`.
- **Điểm 3:**
  - Tiền viết theo tiền tệ của dữ liệu và theo dấu kiểu Excel ở mọi ngôn ngữ: "500 tr", "1.2 tỷ", "3,000,000 VNĐ", "$1,250.50", không còn "1,2 tỷ".
  - Giữ `tabular-nums`.
- **Điểm 1** giữ nguyên. Thêm: file Excel lấy ngôn ngữ của app lúc xuất, `numFmt` theo tiền tệ; làm trong phần E của spec Phase 6 phản hồi dùng thử.
