# ADR-0013: Hướng UI — dark mode, màu nhấn vàng champagne, bộ lọc thời gian thống nhất

- **Trạng thái:** Accepted (G3, Owner 26/09/2026 — duyệt với điều chỉnh, điểm vòng 1: 8/10)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §4.6; C6; mockup `docs/design/mockups/` (issue #6)
- **Commit / PR:** PR #13

## Bối cảnh

Kế hoạch yêu cầu Owner duyệt mockup dark mode các màn hình chính trước khi dựng `packages/ui` (G3). Thiết kế của 2C làm độc lập với Project-2.

## Quyết định

1. **Tokens** (định nghĩa tại `docs/design/mockups/mockups.css`, chuyển sang `packages/ui` ở T-007):
   - Nền phân lớp xám-xanh `--bg-0…3` (#0B1017 → #212C3A), không đen tuyệt đối.
   - **Một màu nhấn: vàng champagne `--accent` #D9B26A** — nút chính, mục đang chọn, focus.
   - **`--heading` = `--accent`** cho đề mục bên trong thẻ (Next Best Actions, Discovery Strategy, nhóm thông tin) — không dùng trắng mặc định.
   - Màu ngữ nghĩa riêng: N4 #94A3B8 · N3 #6FA8FF · N2 #B49AFB · N1 #3FD69A · Tạm hoãn #E3A94F · Mất cơ hội #F07E7E · HĐ nộp #6FC8E8 · HĐ phát hành #3FD69A.
   - Mọi cặp chữ/nền đạt WCAG AA (thấp nhất 4,89:1). Badge luôn có chữ, không chỉ dựa vào màu.
2. **Chữ & số:** Be Vietnam Pro (nhúng cục bộ trong app), `tabular-nums`, tiền "1,2 tỷ" / "500 tr", ngày `dd/mm/yyyy`.
3. **Nhóm N4–N1:** chỉ hiển thị nhãn; **không** hiển thị định nghĩa trên UI (Owner: định nghĩa ngầm hiểu).
4. **Thời gian:** mọi màn có dữ liệu theo thời gian dùng chung **bộ chọn kỳ Ngày · Tuần · Tháng · Năm · Tùy chọn** + ‹ ›; mọi cột ngày/giờ trong bảng **sắp xếp được** (tiêu đề cột bấm được). Lịch hẹn có chế độ Ngày / Tuần / **Tháng**.
5. **Bố cục:** mật độ vừa; nhóm khối thông tin để không để trống vô ích (thẻ cao đều, khối phụ lấp cột ngắn).
6. **Điều hướng:** sidebar trái có icon cho mọi mục (Tổng quan hôm nay, Lịch hẹn, Khách hàng, Báo cáo, Team & nhân sự, Cài đặt) — icon nét 18px, cùng màu chữ, mục đang chọn màu nhấn.
7. **Màn hình chính:** Tổng quan hôm nay · Lịch hẹn · Khách hàng (kanban N4→N1 + cột Đã đóng gồm Tạm hoãn / Mất cơ hội) · Hồ sơ KH (dữ kiện KYC 8 chiều, dòng thời gian, KYC Intelligence ở cột phải).
8. **AI trên UI:** chỉ gợi ý, mọi giả thuyết trỏ về dữ kiện, "mức bằng chứng" deterministic, không nút hành động do AI kích hoạt (ADR-0009).

## Phương án đã cân nhắc

- Màu nhấn xanh dương / xanh ngọc — Owner chọn giữ vàng champagne (hợp phân khúc HNW/UHNW).
- Hiển thị định nghĩa N4–N1 dưới tiêu đề cột — Owner bỏ.
- Cột "Đã đóng" thành tab riêng — Owner giữ cạnh kanban.

## Hệ quả

- T-007 dựng `packages/ui` từ các token trên; component bộ chọn kỳ và bảng sắp xếp được là component dùng chung bắt buộc.
- Font Be Vietnam Pro phải đóng gói cục bộ (app chạy offline, CSP chặn nguồn ngoài).
- Chart (#8) phải theo tokens màu này; ADR chọn thư viện chart sẽ là ADR-0014.

## Phụ lục 27/10/2026 — tên Heritas L-CRM: logo dạng ảnh, font thương hiệu (T-308 #852)

Owner 26–27/10/2026: tên v1.0 là **Heritas L-CRM**, slogan "Where legacy meets trust". Chỉ đổi phần nhìn thấy (logo, icon, tên ở góc sidebar, tiêu đề cửa sổ); tên mã Project-2C, tên file (`project2c.exe`, `Project2C-data\`, backup) và câu báo lỗi giữ nguyên. Sau bản thử chạy trên app, Owner chọn cách (c) (G3) và duyệt font Playfair Display (G4).

- **Logo là ảnh:** ba mảnh cắt từ ảnh gốc của Owner (`apps/desktop/brand/`): cây và vòng cung (rộng 88 px), chữ "Heritas" có chiếc lá thay dấu chấm chữ "i" (150 px), "— L-CRM —" cùng tỉ lệ (≈ 132 px). Các mảnh là PNG nền trong suốt, cắt ở 3× cỡ hiện (`apps/desktop/src/assets/brand/`), xếp dọc giữa góc sidebar. Logo giữ màu gốc (navy, vàng) trên nền tối. Đó là màu trong ảnh, không thành token UI: màu nhấn của UI vẫn chỉ là `--accent` (§1).
- **Viền:** cây và "Heritas" có viền champagne nhạt rất mỏng (`--brand-outline`): bốn `drop-shadow` 0,5 px, thành một nét 1 px ở 1×. Viền này cho navy nổi trên nền tối mà không cần ô trắng. "L-CRM" đã vàng nên không viền.
- **Slogan:** chữ thật, không viền (viền trên chữ nghiêng 13 px sẽ nhòe). Font Playfair Display nghiêng 400, 13 px, màu `--brand-slogan` #E8D3A2 (12:1 trên `--bg-1`). Đây là font thương hiệu `--font-brand`, chỉ dùng cho slogan; chữ UI vẫn là Be Vietnam Pro (§2). Font đóng gói cục bộ như Be Vietnam Pro: một file woff2 bộ Latin của `@fontsource/playfair-display` 5.3.0, OFL 1.1. CSP của exe không đổi.
- **Icon exe / taskbar / tab:** cây trên ô trắng bo góc. Nguồn là PNG 1024 px `apps/desktop/app-icon.png` (thay `app-icon.svg` chữ "2C"), cây phóng 1,3× từ ảnh gốc. `tauri icon` sinh các icon của exe; favicon của bản web là icon 32 px trong bộ đó.

## Phụ lục 11/11/2026 — vỏ app hai nền tảng: font hệ thống, lớp chất liệu, bo góc, token chuyển động (T-416 #1212)

**Trạng thái: đề xuất, chờ Owner duyệt G3** cùng mockup đợt a (`docs/design/mockups/app-shell.html`, `components.html`; token ở khối B của `ui2.css`). Riêng mục 1 (font) Owner đã chốt 11/11/2026. Chưa token nào vào app; code chỉ làm sau khi Owner duyệt và bảo ra Issue.

Bối cảnh: sau bản dùng thử exe `5215b2e`, Owner yêu cầu một vòng UI/UX mới và bản macOS phát hành cùng bản Windows 11, "nhanh, mượt mà, animation mượt mà, UI/UX ấn tượng, đột phá" (10/11/2026). Owner nhận concept ba lớp **Nền · Kính · Tiêu điểm** làm nền cho mockup G3 (10/11), chốt font hệ thống và chỉ Dark Mode cho v1.0 (11/11). Nguyên văn: `docs/design/phase-6-phan-hoi-dung-thu.md` §8.

1. **Chữ (thay §2).** Chữ giao diện dùng font của hệ điều hành qua token mới `--font-ui`: SF Pro trên macOS (`-apple-system`), Segoe UI Variable trên Windows 11 (Segoe UI trên máy không có bản Variable). App không còn nhúng Be Vietnam Pro; token `--font` nhường chỗ cho `--font-ui`. `--font-brand` (Playfair Display, chỉ cho slogan, phụ lục 27/10/2026) giữ nguyên và vẫn nhúng cục bộ. `tabular-nums`, cách viết tiền và ngày của §2 không đổi.
2. **Ba lớp chất liệu.** Màu của §1 giữ nguyên giá trị. Thêm chất liệu để phân lớp bằng độ trong và ánh sáng thay cho viền:
   - **Nền** (nội dung): thẻ là `--mat-card` + `--mat-card-edge` trên `--bg-0`, thay nền `--bg-2` + viền `--border`; `--fill-1 / -2 / -3` cho ô nhập, nút phụ, trạng thái rê chuột; `--hairline` cho đường kẻ trong một bề mặt; `--mat-glow` là ánh sáng rất nhạt phía sau nội dung; `--mat-spec` là quầng sáng theo con trỏ trên thẻ.
   - **Kính** (khung app): nền cửa sổ là hiệu ứng của hệ điều hành, kính trên macOS và Mica trên Windows 11; `--mat-window` là màu thay thế khi không có hiệu ứng. Trên macOS thanh bên là một tấm nổi (`--mat-pane`, `--mat-pane-edge`); `--mat-edge` cho mép cuộn dưới thanh công cụ.
   - **Tiêu điểm** (hộp thoại, menu, bộ chọn kỳ, thông báo nổi): `--mat-pop`, `--mat-pop-edge`, `--blur-pop`; `--scrim` làm mờ phần sau hộp thoại.
   - Bóng ba mức: `--shadow-1` (thẻ), `--shadow-2` (lớp nổi nhỏ), `--shadow-3` (cửa sổ, hộp thoại).
   - `--accent-fill` là nền nút chính; `--accent` vẫn là màu chữ, icon, focus, mục đang chọn. `--heading` giữ cho đề mục bên trong thẻ. `--border-control` giữ cho viền ô nhập, viên chọn, mũi tên sắp xếp (từ 3:1). `--bg-1 … --bg-3`, `--border`, `--border-strong` giữ cho nền đặc, viền đứt và bản in.
3. **Mỗi hệ điều hành một chất.** Cùng bố cục, cùng màu; khác ở chất liệu cửa sổ, chỗ đặt nút cửa sổ và ô tìm, và bo góc:

   | Token | macOS | Windows 11 |
   |---|---|---|
   | `--r-window` | 24 px | 8 px |
   | `--r-card` · `--r-pop` | 20 px · 20 px | 8 px · 8 px |
   | `--r-control` · `--r-field` | 17 px (nút dạng viên) · 12 px | 4 px · 4 px |
   | `--mat-window` (khi không có hiệu ứng gốc) | `rgba(11, 16, 23, 0.62)` | `rgba(17, 24, 34, 0.84)` |

   macOS: ba nút cửa sổ nằm trong tấm thanh bên, mục đang chọn là viên bo tròn, ô tìm là nút trên thanh công cụ. Windows 11: thanh tiêu đề có ô tìm (hoặc thanh tiêu đề gốc, Owner chọn ở G3), mục đang chọn có vạch `--accent` bên trái. Bộ `--corner-sm / md / lg` hiện có nhường chỗ cho bộ `--r-*` khi ra Issue.
4. **Điều hướng (bổ sung §6).** Thanh bên dùng logo gọn xếp ngang (Owner 11/11, thay khối dọc của phụ lục 27/10; ba mảnh ảnh và viền `--brand-outline` giữ nguyên), slogan xuống chân thanh bên dưới dòng trạng thái lưu. Thêm mục Forecast ngay trên Báo cáo. Icon nét 18 px, cùng màu chữ, mục đang chọn màu nhấn, như §6; ba mục của Cài đặt (Dữ liệu, AI, Thùng rác) có icon, kiểu do Owner chọn ở G3.
5. **Thời gian (bổ sung §4).** Bộ chọn kỳ Ngày · Tuần · Tháng · Năm · Tùy chọn + ‹ › giữ nguyên. Ở màn có số liệu theo kỳ (Tổng quan, Báo cáo), góc nhìn và kỳ nằm thành một cụm trên thanh công cụ và áp dụng ngay khi đổi; nút "Lọc" bỏ (Owner 11/11, thay điều duyệt 03/10/2026). Lịch hẹn giữ bộ chọn kỳ trong màn.
6. **Chuyển động.** Token: `--t-1 … --t-4` = 120 · 220 · 400 · 600 ms; `--ease-out`, `--ease-in`; ba lò xo `--spring-smooth`, `--spring-snappy`, `--spring-bouncy` viết bằng CSS `linear()`, không thư viện. Luật: chuyển động chỉ đổi `transform` và `opacity`; đổi màu khi rê chuột là chuyển màu ngắn 120 – 220 ms; ra nhanh hơn vào; máy bật "Giảm chuyển động" thì không chạy. Bốn động tác (Hiện, Mở, Trượt, Đếm) và nơi dùng từng lò xo duyệt ở mockup đợt g.
7. **Tương phản và trợ năng.** Mọi cặp chữ / nền vẫn đạt WCAG AA, đo ở chỗ sáng nhất của từng chất liệu (bảng ở `components.html#contrast`; thấp nhất 4,66:1 cho chữ, 3,04:1 cho viền ô nhập). Ba luật đi kèm: không đặt `--text-3` lên `--fill-2`, `--fill-3` hay dòng đang chọn (dùng `--text-2`); nền nhãn trạng thái là màu của nhãn pha vào `--bg-0`, không trong suốt; ô nhập không đổi nền khi rê chuột. Nhãn nhóm "không diễn ra" dùng chữ `--text-2` (màu `--appt-missed` chưa đủ 4,5:1 ở cỡ nhãn). Máy bật "Giảm độ trong suốt": `--mat-window` thành `--bg-1`, `--mat-pop` thành `--bg-2`, bỏ làm mờ. Trên macOS nền dưới thanh bên là màn hình desktop của người dùng: dùng chất liệu tối của hệ điều hành và đo lại trên bản thử Mac (T-413).

Phương án đã cân nhắc: một bộ bo góc chung cho cả hai hệ điều hành (đơn giản hơn, nhưng app trên Windows trông như app Mac); giữ Be Vietnam Pro (Owner chọn font hệ thống); làm kính cho cả cửa sổ bằng CSS (không thấy được desktop thật, nên chỉ dùng CSS cho lớp nổi bên trong).

Hệ quả khi ra Issue (chưa tạo, Owner 10/11: "chưa ra issue"):

- Token mới vào `packages/ui/src/tokens.css` và `theme.css`; `pnpm lint:tokens` nhận token mới; gỡ file font Be Vietnam Pro khỏi `packages/ui/src/fonts/`; kiểm dấu tiếng Việt và độ rộng cột số trên SF Pro và Segoe UI Variable.
- Hiệu ứng cửa sổ, vị trí ba nút trên macOS và thanh tiêu đề Windows là cấu hình cửa sổ của Tauri 2 trong `tauri.conf.json` (PR gắn nhãn `build-exe`); không thêm dependency. Cửa sổ trong suốt trên macOS dùng API riêng, nên bản lên Mac App Store phải tắt hiệu ứng (`docs/design/nen-tang-mac-va-thuong-mai-hoa.md` §7). Windows 10 không có Mica: dùng nền đặc.
- Chưa kiểm trên Safari / máy Mac thật (Owner 11/11: để sau); kiểm cùng bản thử Mac của T-413, kể cả `linear()` và truy vấn "Giảm độ trong suốt" trên WKWebView.
- Các mockup đã duyệt G3 giữ bố cục và nội dung (Owner 11/11); chúng nhận vỏ mới qua token và bộ khung chung, không vẽ lại. Giao diện Sáng để sau v1.0.
