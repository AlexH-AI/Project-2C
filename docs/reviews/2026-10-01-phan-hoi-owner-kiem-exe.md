# Phản hồi Owner sau kiểm exe (01/10/2026)

> Tách khỏi `docs/state/HANDOFF.md` ngày 03/10/2026 (#280). Gói A, B đã xong trong Phase 3; ý 9 làm ở Phase 4 (`docs/design/phase-4-chi-so.md`).

Owner kiểm exe và gửi 16 ý (ảnh chụp trong hội thoại). Owner duyệt kế hoạch 01/10: **gói A + B làm trong Phase 3, trước G7**; có thể còn ý bổ sung; đóng Phase 3 sau khi kiểm tay exe lại + 2 review độc lập. Ý 9 sang Phase 4.

| Ý | Nội dung | Gói / Issue |
|---|---|---|
| 1 | Bộ chọn góc nhìn chữ to hơn: 12,5px → 14px, chỉ bộ chọn trên thanh đầu trang | A3 #216 |
| 2 | Khách hàng, góc nhìn Team: hàng chọn RE của team (mỗi hàng 5 RE, chỉ RE); bấm lọc theo RE, bấm lại → cả team; trình bày lại bố cục | B2 |
| 3 | Như ý 2 cho Lịch hẹn (lọc theo RE phụ trách, không tính phối hợp) | B3 |
| 4 | Danh sách chọn RE sắp theo team rồi tên (cả 4 chỗ dùng `reOptions`) | A2 #215 |
| 5, 10 | Bỏ bộ chọn góc nhìn ở màn không lọc theo nó: Team & nhân sự, Hồ sơ KH (và Cài đặt, Báo cáo, Tổng quan) | A3 #216 |
| 6 | Team: "Team Bình Minh · TL Lý Gia Trang · Sửa" (không số lịch hẹn); TL bỏ khỏi bảng; "Hỗ trợ dùng chung" → "Người hỗ trợ" | B1 |
| 7 | Bỏ chữ viết tắt 2 ký tự trước tên người | A1 #214 |
| 8 | "Tổng quan hôm nay" → "Tổng quan" | A1 #214 |
| 9 | Tổng quan chạy bằng dữ liệu thật: nút Lọc cạnh kỳ; 4 ô N4–N1 bốn màu; Toàn bộ / RE = 1 chart, Team = 3 chart (một team một chart), 4 nhóm cơ hội | **Phase 4** (G2 + G3) |
| 11 | Bỏ nhãn "material" trên dòng thời gian KYC (dữ liệu + hộp Ghi chú KYC giữ nguyên) | A1 #214 |
| 12 | Lịch tháng: số ngày ô đang chọn màu vàng gold | B4 |
| 13 | Danh sách lịch hẹn: cột Ngày tô theo hôm nay — đã qua vàng nhạt, hôm nay xanh lá nhạt, sắp tới xanh dương nhạt | B5 |
| 14 | Kỳ Tuần tô nổi dải 7 ngày trên lịch tháng | B4 |
| 15 | Kỳ Tháng giữ nguyên | — |
| 16 | Kỳ Năm: lưới 12 tháng, 4 cột = 4 quý; tương lai mờ, tháng hiện tại nổi; ô = số tháng + tổng lịch + thanh ngang 3 màu (đã gặp / dời-hủy-không đến / dự kiến) có số ở giữa | B6 |

Quyết định Owner (AskUserQuestion 01/10):
- Ý 9: đếm KH theo nhóm = **ảnh chụp cuối kỳ** (nhóm của KH tính tới ngày cuối kỳ; kỳ chưa hết → tới hôm nay). Góc nhìn Team trên Tổng quan: **ẩn ô chọn team**, luôn 3 chart. Mặc định Claude đề xuất (chốt ở mockup Phase 4): đổi kỳ / góc nhìn chỉ áp dụng khi bấm Lọc; 4 ô N4–N1 dùng màu `StageBadge` và là chú giải chart; bỏ chart mẫu "Lịch hẹn theo team".
- Ý 2–3: RE đang chọn **dùng chung** Khách hàng và Lịch hẹn; đổi team hoặc góc nhìn → tự bỏ chọn RE.
- Ý 16: bấm ô tháng → **mở kỳ Tháng đó**; khối "Trong ngày" **ẩn** ở kỳ Năm.
- G3 gói B (01/10, PR #220): B5 = **phương án A** (tô nền ô Ngày); ô hôm nay viền **xanh lá nhạt**; nút "Cả team" + số cạnh tên RE; **mỗi team tối đa 1 TL** (→ #223); giữ tổng lịch quý ở lưới năm.
- Kỳ Tùy chọn: **tô dải ngày như Tuần**. Kèm sửa lỗi Claude tìm thấy: tuần / khoảng vắt 2 tháng không xem được phần tháng sau (ngày tháng khác bị mờ, không bấm được) → ngày trong kỳ vẫn tô và bấm được, lịch chuyển sang tháng đó (B4).

Kế hoạch (thứ tự để ít rủi ro): A1 → A2 → A3 (không cần mockup) · song song mockup #217 → G3 → B1 → B2 (`risk:med`, bộ lọc team + RE dùng chung; sau A3 vì cùng thanh đầu trang) → B3 → B4 → B5 → B6 (`risk:med`; B4–B6 cùng `AppointmentsScreen.tsx` nên làm lần lượt, lưới năm tách file mới) → Owner kiểm tay exe → 2 review độc lập → G7.

`main` `abdff20` (30/09, Home PC): `pnpm verify` xanh — 757 test, coverage 99,49 / 98,4 / 100 / 99,78 (domain 100%, `db/src` 99,33 / 97,8), 0 vi phạm ranh giới; `pnpm e2e` 95/95 xanh (lần này không có test vượt 30 s); build exe trên `main` xanh (run `36732226056`, artifact `Project-2C-abdff201d0c347d0175436b6668d26e3ec667ccb`).
