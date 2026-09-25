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
