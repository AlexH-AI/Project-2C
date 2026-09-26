# ADR-0014: Thư viện chart — ECharts

- **Trạng thái:** Accepted (G4, Owner duyệt 26/09/2026)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §4.4 ("ECharts hoặc Recharts, quyết định ở Phase 1 theo mockup"); ADR-0013 (tokens màu); issue #8
- **Commit / PR:** PR #15

## Bối cảnh

Mockup đã duyệt (G3, ADR-0013) cần: đường doanh số theo tháng × team, cột chồng lịch hẹn theo ngày, thanh ngang doanh số theo team, và ở chế độ Năm có thể tới 30 RE × 365 ngày. Kế hoạch để ngỏ hai lựa chọn: ECharts và Recharts.

## Đánh giá (26/09/2026)

Hai bản thử nghiệm giống hệt nhau: React 19.3 + Vite 8, cùng 4 biểu đồ, cùng tokens màu ADR-0013, build production, đo trên Microsoft Edge (cùng engine WebView2), Home PC. Ảnh: `docs/design/chart-eval/`.

| Tiêu chí | ECharts 6.1.0 | Recharts 3.10.1 |
|---|---|---|
| Bundle (gzip, không tính React) | 201 KB (tree-shake qua `echarts/core`, gồm cả renderer SVG + Canvas) | **111 KB** |
| Render 4 biểu đồ, có 30 × 365 điểm (trung vị 5 lần) | **39 ms** (Canvas cho biểu đồ nhiều điểm) | 98 ms (chỉ SVG) |
| Dependency trực tiếp | **2** (`zrender`, `tslib`) | 11 (redux toolkit, immer, react-redux, victory-vendor…) |
| Zoom / cuộn khoảng thời gian | **Có sẵn** (`dataZoom`) | Phải tự làm (Brush hạn chế) |
| Thứ tự legend | Theo thứ tự series | Mặc định sắp chữ cái — phải chỉnh |
| Dark theme theo tokens | Tốt (option object) | Tốt (props) |
| Định dạng số VN ("1,2 tỷ", dấu nghìn ".") | Cần formatter riêng | Cần formatter riêng |
| Cách viết | Option object + wrapper React nhỏ | JSX khai báo |
| Giấy phép | Apache-2.0 | MIT |
| Bản mới nhất | 19/05/2026 | 21/09/2026 |

## Quyết định

**Dùng ECharts 6** (`echarts`, không dùng `echarts-for-react`):

- Import theo module qua `echarts/core` (chỉ đăng ký biểu đồ/thành phần đang dùng).
- Một component React dùng chung trong `packages/ui` (init / `setOption` / `ResizeObserver` / dispose), theme lấy từ tokens ADR-0013.
- Canvas cho biểu đồ nhiều điểm (chế độ Năm, so sánh 30 RE), SVG cho biểu đồ nhỏ.
- Formatter tiền/ngày lấy từ hàm chuẩn của `packages/domain` (không tự format trong chart).

## Lý do

- App desktop tải bundle từ ổ đĩa: +90 KB gzip gần như không ảnh hưởng thời gian mở app; tốc độ render khi xem theo Năm (30 RE × 365 ngày) quan trọng hơn.
- Ít dependency bắc cầu hơn hẳn → bề mặt cập nhật/bảo mật nhỏ hơn.
- Zoom/cuộn thời gian có sẵn, hợp với yêu cầu "mọi trường thời gian lọc được" (ADR-0013).

## Phương án đã cân nhắc

- **Recharts** — nhỏ hơn, JSX dễ đọc; nhưng chậm hơn ~2,5× ở dữ liệu lớn (chỉ SVG), nhiều dependency (redux…), thiếu zoom có sẵn.
- **`echarts-for-react`** — không cần: wrapper tự viết ~20 dòng, bớt một dependency.
- Chart thuần CSS (như mockup) — không đủ cho trục, tooltip, zoom.

## Hệ quả

- Thêm dependency `echarts@6.1.0` vào `packages/ui` trong #7 (đã duyệt G4).
- Mục lục `docs/decisions/README.md` bổ sung dòng ADR-0014 sau khi PR #13 (ADR-0013) merge, để tránh xung đột với PR đang review.
