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

**Trạng thái: Owner duyệt G3 ngày 11/11/2026** cùng mockup đợt a (`docs/design/mockups/app-shell.html`, `components.html`; token ở khối B của `ui2.css`). Owner trả lời từng điểm trong 16 điểm `#ask` của hai mockup, câu cuối là "Duyệt" cho bộ token và phụ lục này; nguyên văn ở `docs/design/phase-6-phan-hoi-dung-thu.md` §8. Bo góc macOS được vẽ lại hai lần trong ngày theo lời Owner (mục 3). Chưa token nào vào app; code chỉ làm khi Owner bảo ra Issue. Số đo bo góc macOS và các điểm cần máy Mac thật kiểm lại ở bản thử Mac (T-413).

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
   | `--r-curve` · `--r-k` (dáng của góc) | `superellipse(1.7)` · 1,5: cong liên tục | `round` · 1: cung tròn |
   | `--r-window` (app thật: hệ điều hành vẽ) | 24 px | 8 px |
   | `--r-pop` · `--r-card` · `--r-menu` | 20 px · 16 px · 14 px | 8 px · 8 px · 8 px |
   | `--r-field` · `--r-control` (nút 34 px, nút của thanh công cụ) · `--r-control-sm` (nút gọn 28 – 30 px) | 10 px · 10 px · 8 px | 4 px · 4 px · 4 px |
   | `--r-chip` (viên chọn, ô tìm, nút trong thông báo nổi) | hình viên | 4 px |
   | `--mat-window` (khi không có hiệu ứng gốc) | `rgba(11, 16, 23, 0.62)` | `rgba(17, 24, 34, 0.84)` |

   **Bo góc trên macOS: ba quy tắc, hai quy tắc đầu của Apple** (Owner 11/11/2026, khi xem bản đầu của mockup: "bo góc cong ở MacOS phải đúng theo tỉ lệ cong, style của Apple chứ anh không duyệt như mockup của MacOS như đang xem"; bản đầu dùng cung tròn, nút nào cũng là viên, thẻ 20 px):

   - *Góc cong liên tục:* đường cong vào cạnh thẳng êm dần, không phải cung tròn. Vẽ bằng thuộc tính CSS `corner-shape` với `--r-curve`, trong ô rộng `--r-k` lần số bo góc để giữ độ tròn của một cung cùng số đo. Web view chưa có `corner-shape` thì vẽ cung tròn cùng số đo, bố cục không đổi (WebView2 có từ bản 139; Safari thêm ở bản 27.3 beta, 03/11/2026).
   - *Bo đồng tâm:* hình nằm trong lấy số bo góc của hình ngoài trừ khoảng cách giữa hai hình: cửa sổ 24 → tấm thanh bên 16 → mục thanh bên 8; menu 14 → dòng menu 8; bộ chọn kỳ 20 → ô 8; nút trượt 10 → viên trượt 8; thẻ 16 → mục trong thẻ 8.
   - *Nút là chữ nhật bo, hình viên chỉ cho viên chọn và nhãn:* nút 34 px và nút của thanh công cụ bo `--r-control`, nút gọn bo `--r-control-sm`, đều có cạnh thẳng hai bên; hình viên chỉ còn ở viên chọn, nhãn trạng thái, ô tìm và thông báo nổi. Owner 11/11/2026, khi xem bản vẽ lại có nút 34 px hình viên: "duyệt nhưng nút cỡ lớn 2 bên cong quá và không có đường thẳng dọc 2 bên, xem lại góc của nút cỡ lớn". Đây là chỗ khác với Apple (trên macOS 26 trở lên nút cỡ lớn của Apple là hình viên). Owner chọn bo 10 px cho `--r-control` ("A · Bo 10 px"; phương án còn lại là 8 px), hình ở `components.html#btn-corner`.
   - Số đo là ước lượng (Apple không công bố). Góc cửa sổ do macOS vẽ; khi có bản thử Mac (T-413) đo góc thật rồi chỉnh các số đồng tâm theo nó.

   macOS: ba nút cửa sổ nằm trong tấm thanh bên, mục đang chọn có nền bo đồng tâm với tấm thanh bên, ô tìm là nút trên thanh công cụ. Windows 11: thanh tiêu đề tự vẽ có ô tìm ở giữa (Owner chọn "Kiểu A tự vẽ"; Snap Layouts hoặc kéo cửa sổ không đạt trên máy thật thì lùi về thanh tiêu đề gốc của Windows), mục đang chọn có vạch `--accent` bên trái. Bộ `--corner-sm / md / lg` hiện có nhường chỗ cho bộ `--r-*` khi ra Issue.
4. **Điều hướng (bổ sung §6).** Thanh bên dùng logo gọn xếp ngang (Owner 11/11, thay khối dọc của phụ lục 27/10; ba mảnh ảnh và viền `--brand-outline` giữ nguyên), slogan xuống chân thanh bên dưới dòng trạng thái lưu. Thêm mục Forecast ngay trên Báo cáo. Icon nét 18 px, cùng màu chữ, mục đang chọn màu nhấn, như §6; ba mục của Cài đặt (Dữ liệu, AI, Thùng rác) có icon dạng ô màu (Owner chọn "Kiểu A ô màu").
5. **Thời gian (bổ sung §4).** Bộ chọn kỳ Ngày · Tuần · Tháng · Năm · Tùy chọn + ‹ › giữ nguyên. Ở màn có số liệu theo kỳ (Tổng quan, Báo cáo), góc nhìn và kỳ nằm thành một cụm trên thanh công cụ và áp dụng ngay khi đổi; nút "Lọc" bỏ (Owner 11/11, thay điều duyệt 03/10/2026). Lịch hẹn giữ bộ chọn kỳ trong màn.
6. **Chuyển động.** Token: `--t-1 … --t-4` = 120 · 220 · 400 · 600 ms; `--ease-out`, `--ease-in`; ba lò xo `--spring-smooth`, `--spring-snappy`, `--spring-bouncy` viết bằng CSS `linear()`, không thư viện. Luật: chuyển động chỉ đổi `transform` và `opacity`; đổi màu khi rê chuột là chuyển màu ngắn 120 – 220 ms; ra nhanh hơn vào; máy bật "Giảm chuyển động" thì không chạy. Bốn động tác (Hiện, Mở, Trượt, Đếm) và nơi dùng từng lò xo duyệt ở mockup đợt g.
7. **Tương phản và trợ năng.** Mọi cặp chữ / nền vẫn đạt WCAG AA, đo ở chỗ sáng nhất của từng chất liệu (bảng ở `components.html#contrast`; thấp nhất 4,66:1 cho chữ, 3,04:1 cho viền ô nhập). Ba luật đi kèm: không đặt `--text-3` lên `--fill-2`, `--fill-3` hay dòng đang chọn (dùng `--text-2`); nền nhãn trạng thái là màu của nhãn pha vào `--bg-0`, không trong suốt; ô nhập không đổi nền khi rê chuột. Nhãn nhóm "không diễn ra" dùng chữ `--text-2` (màu `--appt-missed` chưa đủ 4,5:1 ở cỡ nhãn). Máy bật "Giảm độ trong suốt": `--mat-window` thành `--bg-1`, `--mat-pop` thành `--bg-2`, bỏ làm mờ. Trên macOS nền dưới thanh bên là màn hình desktop của người dùng: dùng chất liệu tối của hệ điều hành và đo lại trên bản thử Mac (T-413).

Phương án đã cân nhắc: một bộ bo góc chung cho cả hai hệ điều hành (đơn giản hơn, nhưng app trên Windows trông như app Mac); giữ Be Vietnam Pro (Owner chọn font hệ thống); làm kính cho cả cửa sổ bằng CSS (không thấy được desktop thật, nên chỉ dùng CSS cho lớp nổi bên trong).

Hệ quả khi ra Issue (chưa tạo, Owner 10/11: "chưa ra issue"):

- Token mới vào `packages/ui/src/tokens.css` và `theme.css`; `pnpm lint:tokens` nhận token mới; gỡ file font Be Vietnam Pro khỏi `packages/ui/src/fonts/`; kiểm dấu tiếng Việt và độ rộng cột số trên SF Pro và Segoe UI Variable.
- Hiệu ứng cửa sổ, vị trí ba nút trên macOS và thanh tiêu đề Windows là cấu hình cửa sổ của Tauri 2 trong `tauri.conf.json` (PR gắn nhãn `build-exe`); không thêm dependency. Cửa sổ trong suốt trên macOS dùng API riêng, nên bản lên Mac App Store phải tắt hiệu ứng (`docs/design/nen-tang-mac-va-thuong-mai-hoa.md` §7). Windows 10 không có Mica: dùng nền đặc.
- Chưa kiểm trên Safari / máy Mac thật (Owner 11/11: để sau); kiểm cùng bản thử Mac của T-413, kể cả `linear()` và truy vấn "Giảm độ trong suốt" trên WKWebView.
- Các mockup đã duyệt G3 giữ bố cục và nội dung (Owner 11/11); chúng nhận vỏ mới qua token và bộ khung chung, không vẽ lại. Giao diện Sáng để sau v1.0.

## Phụ lục 14/11/2026 — hệ chuyển động: bốn động tác, ba lò xo, "Mở từ chỗ bấm" (T-426 #1253)

**Trạng thái: Owner duyệt G3 ngày 14/11/2026** cùng mockup đợt g (`docs/design/mockups/chuyen-dong.html`; CSS ở mục 19 của `ui2.css`, hành vi ở mục 20 của `ui2.js`). Phụ lục này là bản chữ của mockup. Nó chốt phần mà điểm 6 của phụ lục 11/11/2026 để lại ("Bốn động tác (Hiện, Mở, Trượt, Đếm) và nơi dùng từng lò xo duyệt ở mockup đợt g"). Không thêm token, không thêm dependency. Owner trả lời từng điểm trong 10 điểm `#ask` của mockup và chọn phương án đề xuất ở cả 10; nguyên văn ở `docs/design/phase-6-phan-hoi-dung-thu.md` §8, gạch "G3 đợt g". Bố cục và nội dung các màn đã duyệt G3 không đổi; theo điểm 10, chỗ gọi "Đếm" của `tong-quan.html`, `forecast.html` và ba luật chuyển động ở `ui2.css` đã sửa cho khớp. Chưa gì vào app; code chỉ làm khi Owner bảo ra Issue.

1. **Luật chung.**
   - Chuyển động chỉ đổi `transform` và `opacity`. Một ngoại lệ có tên: "Đếm" đổi chữ của con số (điểm 5).
   - Rê chuột chỉ đổi màu, 120 ms. Nhấn: nút thu 4%, thẻ thu 1.5%, nhả tay thì về bằng lò xo nhanh. Đây là phản hồi của nút, không phải một động tác.
   - Ra nhanh hơn vào: thứ được gọi ra tới trong 220–400 ms, thứ bị đóng đi trong 120 ms. Màn cũ không có chuyển động rời đi.
   - Không chặn tay: đang chuyển động vẫn bấm được, và cú bấm mới làm chuyển động đang chạy dừng ngay ở đích.
   - Mỗi thứ một động tác một lúc. Không vòng lặp, trừ chấm của viên "Lưu ý" và thanh của việc chạy nền (đợt b).
   - Số không dùng lò xo.
2. **Hiện** (đổi màn: thanh bên, ô lệnh, một ô hay một câu dẫn sang màn khác, bước kế của thiết lập ban đầu). Màn cũ biến mất ngay. Mỗi phần của màn mới trồi 8 px và rõ dần trong `--t-3` (400 ms), lò xo nhanh; các phần cách nhau 28 ms, tối đa 8 nhịp, nên màn nào cũng xong trong 0.6 giây. Tên màn và dòng dưới nó trồi cùng lúc (dòng dưới chậm 40 ms). Thanh trong một phần dài ra từ trái trong `--t-4`, lò xo êm, bắt đầu sau 100 ms. Một "phần" là một thẻ, một ô chỉ số, một bảng; dòng của bảng và thẻ KH của bảng Khách hàng không trồi riêng. Hiện chỉ chạy khi màn được mở, không chạy lại khi đổi góc nhìn hay kỳ.
3. **Mở** (ý 07, "Mở từ chỗ bấm"). Thứ được bấm nở thành trang nó mở ra: thẻ KH → hồ sơ KH, dòng RM → trang RM, dòng KH của trang RM → hồ sơ KH.
   - Lúc nở: khung đi từ ô của thẻ tới ô của trang trong `--t-3`, lò xo êm (không vượt đích); thẻ mờ đi trong `--t-1`; trang rõ dần trong `--t-2`, bắt đầu sau 80 ms; phần còn lại của màn cũ nhường chỗ trong `--t-1`.
   - Lúc thu về: khung về ô của thẻ trong `--t-2`, `--ease-out`. Màn trước trở về đúng như lúc rời (cuộn tới đâu ở nguyên đó). Thẻ không còn ở đó thì trang chỉ mờ đi.
   - Trang nở ra là một khối: các phần của nó không chạy Hiện, và màn quay về cũng không chạy lại Hiện.
   - Chỗ bấm nằm trong một lớp nổi sẽ đóng lại (ô lệnh, "Lưu ý", gợi ý dưới ô tìm, danh sách của một ngày ở Forecast): dùng Hiện.
   - Làm bằng `document.startViewTransition` của WebView. Không có API: lui về Hiện.
4. **Trượt.**
   - Thứ đang chọn trượt tới chỗ mới trong `--t-3`, lò xo nhanh: viên chọn của thanh bên, nút trượt của công tắc, mũi tên của hàng team.
   - Lớp nổi đi một quãng ngắn ra từ nơi gọi nó: bảng nổi và menu 6 px, ô lệnh 10 px, hộp thoại macOS 36 px từ dưới thanh công cụ, hộp thoại Windows 11 mở ở giữa (94% → 100%). Vào: rõ trong `--t-2`, dịch trong `--t-3` bằng lò xo nhanh. Ra: `--t-1`, `--ease-in`.
   - Thông báo nổi trồi lên từ 24 px dưới mép dưới: rõ trong `--t-2`, dịch trong `--t-4` bằng lò xo nảy; rời đi trong `--t-2`; tự đi sau 4.2 giây.
   - Khối đổi theo công tắc (dải tuần ↔ lưới tháng, Bản tin ↔ Sổ số) đổi ngay.
5. **Đếm.** Con số đang hiện chạy tới giá trị mới trong `--t-3`, `--ease-out`; mọi số của màn chạy cùng lúc. Mở một màn thì số có sẵn ngay, không đếm từ 0.
   - Mỗi khung hình là một cách viết đúng ADR-0018: giá trị đang chạy được làm tròn về ba chữ số có nghĩa rồi viết bằng hàm dạng gọn của `packages/domain`, nên đơn vị luôn là đơn vị của con số đang hiện (1.38 tỷ → 1.03 tỷ → 761 tr → 310 tr). Khung đầu và khung cuối là giá trị thật, viết đủ.
   - Số đếm chạy theo số nguyên, phần trăm theo một số lẻ. "—" ↔ một con số: đổi ngay. Số đổi tiếp khi đang chạy thì chạy tiếp từ con số đang hiện.
   - Chạy ở các số lớn đứng riêng: số chủ đạo và các ô chỉ số của Tổng quan, số dự kiến và ba số của Forecast, các ô số đầu trang RM. Không chạy trong bảng, trong câu, trong Báo cáo (Bản tin, Sổ số, bản in, file Excel), trong hộp thoại và thông báo nổi, ở các số nhỏ trên nhãn và nút.
   - Thanh đi kèm con số dài ra tới bề rộng mới trong `--t-4`, lò xo êm.
6. **Ba lò xo.** Êm (`--spring-smooth`, không vượt đích): thứ lớn hoặc đi xa, tức Mở và các thanh. Nhanh (`--spring-snappy`, vượt 1.5%): Hiện, Trượt, nút và thẻ lúc nhả tay, icon của mục thanh bên đang chọn, mẫu màu của team. Nảy (`--spring-bouncy`, vượt 12.6%) chỉ ở ba nơi: thông báo nổi hiện ra; nhãn "Đã hủy {ngày}" lúc vừa hủy (`--t-4`); dấu ✓ của ô chọn vừa tick và của việc chạy nền vừa xong. Mờ / rõ, đổi màu, Đếm và "Mở" lúc thu về không dùng lò xo.
7. **Giảm chuyển động.** App theo cài đặt của hệ điều hành (`prefers-reduced-motion`), không có công tắc riêng. Khi bật: màn mới hiện đủ ngay, "Mở" đổi màn ngay (bảng vẫn ở chỗ đã cuộn), viên chọn và nút trượt nhảy tới chỗ mới, lớp nổi hiện và ẩn ngay, số và thanh đổi thẳng, nhãn và thông báo hiện ngay ở đúng chỗ, chấm của viên "Lưu ý" đứng yên. Đổi màu khi rê chuột và viền tiêu điểm vẫn còn.
8. **Bảng "động tác → nơi dùng"** của mọi màn đợt a–f, kể cả nơi không có chuyển động (dòng của bảng, kết quả lọc và sắp xếp, ô nhập, cuộn, bản in, file Excel): mục `#where` của mockup. Chỗ nào mockup đợt a–f chuyển động khác bảng đó thì theo bảng đó.

Phương án đã cân nhắc (mỗi cái là "phương án khác" của một điểm `#ask`, Owner không chọn): cả màn trồi lên cùng lúc; chỉ thẻ KH dùng Mở; thu về trong 400 ms như lúc nở; app tự viết phép phóng khi không có View Transitions; lớp nổi chỉ mờ / rõ; "Đếm" kiểu lăn (số cũ lăn đi, số mới lăn vào, không có số trung gian); "Đếm" cả trên trang Bản tin; giữ lò xo nảy cho icon thanh bên và mẫu màu như mockup đợt a, b; dòng của bảng cũng chuyển động.

Khả thi và hệ quả khi ra Issue (chưa tạo):

- Lò xo `linear()`: Edge 113 / Safari 17.2 trở lên. View Transitions trong cùng một trang: Edge 111 / Safari 18 trở lên. WebView2 tự cập nhật theo Edge; bản macOS tối thiểu của app là macOS 26 (ADR-0019), có sẵn cả hai. Số phiên bản theo bảng hỗ trợ của Chrome for Developers và MDN, tra ngày 14/11/2026.
- Trong React, đổi màn của "Mở" đặt trong `flushSync` của `react-dom` (đang dùng), để trình duyệt chụp đúng màn mới. "Đếm" dùng `requestAnimationFrame` và hàm dạng gọn của `packages/domain`. Không thêm dependency (G4).
- Đã đo trên bản mockup (Edge chạy không cửa sổ, Home PC, 1440 × 900): các khung hình cách nhau 16.7 ms trong lúc từng động tác chạy; một khung 83 ms ở lần đầu dàn bảng Khách hàng.
- Chưa kiểm: Safari / WKWebView trên máy Mac thật; app thật trong Tauri (Mica, vibrancy); dữ liệu lớn (884 thẻ KH, hồ sơ nhiều lịch và HĐ); máy yếu hơn; màn hình 120 Hz. Nếu "Mở" trên một màn nặng không giữ được khung hình ở nghiệm thu, màn đó lui về Hiện; luật không đổi.
