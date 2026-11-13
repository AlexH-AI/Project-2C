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

## Phụ lục — Báo cáo và file Excel của đợt e (13/11/2026; Owner duyệt G3 cùng ngày, T-424 #1247)

Mockup `docs/design/mockups/bao-cao.html` (đợt e của vòng UI/UX mới; phần E của spec `docs/design/phase-6-phan-hoi-dung-thu.md` §7.1, §8) trình bày lại màn Báo cáo và file Excel. Phụ lục này ghi phần đổi so với thân ADR. Owner duyệt G3 đợt e ngày 13/11/2026 (16 điểm, chọn phương án đề xuất ở mọi điểm; spec §8, gạch "G3 đợt e"): "A · Bảy sheet", "Duyệt" bảng màu và kiểu của file, "Duyệt cả hai" cho sheet Forecast và file của màn Forecast, "Duyệt" luật của file, "Duyệt" bản in. Lời Owner làm căn cứ: "cả báo cáo trên app và báo cáo trên excel phải được mockup trình bày lại cho anh duyệt, phong cách đẳng cấp, chuyên nghiệp" (10/11); "Dùng màu logo", "In giấy sáng", "Có xuất Excel" cho Forecast (11/11).

- **Điểm 1, cấu trúc file** ("mỗi sheet 1 bảng"): đổi thành bảy sheet.
  - **Tóm tắt:** trang 1 của Bản tin (đầu sheet có logo, bốn số chính, bảng theo team, nhận xét theo bảng luật Điểm nhấn); in vừa một tờ A4 dọc.
  - **Team – RM** và **Theo mốc:** hai sheet sổ, mỗi dòng đủ 23 cột trong bốn nhóm cột có tên (Kết quả 8, Chuyển đổi 3, Lịch hẹn 5, Khách hàng cuối kỳ 7); RM là dòng nhóm gập dưới team; dòng tiêu đề và cột tên đứng yên khi cuộn.
  - **HĐ hủy:** mỗi dòng một HĐ có ngày hủy trong kỳ. **Xu hướng:** 6 kỳ gần nhất cùng loại (không có ở kỳ Ngày, Tùy chọn). **Forecast:** chỉ khi kỳ của báo cáo đang chạy. **Định nghĩa.**
  - Nút Xuất Excel của màn Forecast (spec §6.2, D-f) ghi một file riêng: Forecast, Lịch hẹn, Định nghĩa.
  - Phương án bị bỏ: mỗi bảng của Sổ số một sheet (mười sheet hẹp). Các sheet Tóm tắt, Team – RM, Xu hướng của kỳ Tháng có cột / dòng "KPI tháng" (Owner: "A · Báo cáo có KPI").
- **Luật của file:**
  - Số là số thật có `numFmt` (tiền đủ đồng `#,##0`, tiêu đề cột ghi "(VNĐ)"; tỷ lệ `0.0%`); chỗ màn ghi "—" là ô trống. `numFmt` theo tiền tệ và ngôn ngữ theo app lúc xuất: ADR-0018 §4, §10.
  - Công thức kèm kết quả tính sẵn: Tổng số HĐ, Doanh số, hai tỷ lệ (`IFERROR`), dòng team (`SUM` các RM), dòng Tổng (tổng các dòng team). Ở sheet Theo mốc, các cột Khách hàng của dòng Tổng là ảnh chụp cuối kỳ, không phải tổng các mốc.
  - Thanh dữ liệu ở cột Doanh số; không tô màu theo ngưỡng; số âm chữ đỏ.
  - Khổ in: Tóm tắt A4 dọc, một tờ; sheet khác A4 ngang, vừa chiều ngang, lặp dòng tiêu đề.
  - Tên file giữ luật đang có `bao-cao_<kỳ>_<góc nhìn>_<ngày xuất>.xlsx`; thêm `forecast_<góc nhìn>_<ngày xuất>.xlsx`. Nơi lưu và câu lỗi không đổi.
  - Sheet có tên KH (HĐ hủy, Lịch hẹn) luôn ghi tên đầy đủ, kể cả khi màn đang che tên (G3 đợt a).
- **Điểm 1, "Không làm PDF ở v1": giữ.** Bản tin có công tắc "Xem bản in" (giấy sáng) và nút "In…" mở hộp in của hệ điều hành; người dùng lưu PDF từ hộp đó. App không sinh file PDF và không thêm thư viện. Khổ A4 dọc, mỗi trang của Bản tin một tờ. Lệnh in của cửa sổ app (WebView2, WKWebView) chưa kiểm trên máy thật: kiểm ở Issue code, không đạt trên một nền tảng thì báo Owner trước khi làm tiếp.
- **Bảng màu của giấy** (bản in và file Excel dùng chung; token `--paper-*` ở `docs/design/mockups/ui2.css` mục 17; app vẫn chỉ có giao diện tối, ADR-0013):

  | Token | Mã | Dùng cho | Tương phản |
  |---|---|---|---|
  | `--paper` | `#FFFFFF` | nền giấy, nền sheet | — |
  | `--paper-navy` | `#16243A` | tiêu đề, tên báo cáo; nền dòng tiêu đề của bảng Excel | 15.6 : 1 trên trắng |
  | `--paper-gold` | `#E9CF9A` | chữ trên nền navy; vạch dưới số lớn | 10.3 : 1 trên navy |
  | `--paper-gold-ink` | `#7A5A12` | chữ và vạch nhấn trên giấy trắng (`--accent` của app chỉ đạt 2 : 1 trên trắng) | 6.4 : 1 trên trắng |
  | `--paper-gold-soft` | `#F6ECD2` | thanh dữ liệu, nền nhấn nhạt | chữ mực 13.3 : 1 |
  | `--paper-ink`, `--paper-ink-2`, `--paper-ink-3` | `#1B2433`, `#4A5568`, `#5F6876` | chữ thường, chữ phụ, chú thích | 15.6 · 7.5 · 5.6 : 1 trên trắng |
  | `--paper-red`, `--paper-red-soft` | `#A12A22`, `#FDE8E6` | số âm, phần hủy; nền ô cảnh báo | 7.3 : 1 trên trắng; 6.2 : 1 trên nền nhạt |
  | `--paper-green` | `#1C6B45` | "vượt", mức đổi tốt | 6.5 : 1 trên trắng |
  | `--paper-line`, `--paper-well` | `#DFE3E8`, `#F4F5F7` | đường kẻ; nền ô phụ | không phải chữ |

- **Không đổi:** thư viện ExcelJS (không vẽ biểu đồ gốc của Excel, nên Xu hướng là bảng có thanh dữ liệu); không có dependency mới (không qua G4); định nghĩa chỉ số (ADR-0007 và hai phụ lục HĐ hủy, Forecast).
