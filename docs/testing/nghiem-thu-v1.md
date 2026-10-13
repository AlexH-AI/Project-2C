# Danh sách nghiệm thu v1.0

Danh sách Owner dùng để nghiệm thu bản exe trước khi phát hành v1.0 (spec Phase 6 §5 mục 2–6, §7): **lượt thử** ở 6C và **lượt cuối** ở G7 trên exe phát hành. Mỗi dòng là một việc làm tay trên exe: thao tác, kết quả mong đợi, ô Đạt / Lỗi.

Kết quả mong đợi viết theo nghĩa thường của nhãn tiếng Việt và theo dòng mẫu của mockup đã duyệt (`CLAUDE.md` § "Nhãn UI hiểu theo nghĩa thường"). Cách dùng từng màn ở [hướng dẫn sử dụng](../user-guide/README.md); file này không lặp lại hướng dẫn, chỉ ghi điều cần thấy.

## Cách dùng

### Bản exe

| Lượt | Exe | Lấy ở đâu |
|---|---|---|
| Lượt thử (6C, lặp lại sau mỗi đợt sửa của 6D) | Exe của `main` mới nhất | GitHub → **Actions** → workflow **CI** → run mới nhất trên `main` → mục **Artifacts** → `Project-2C-<sha>` (zip có `project2c.exe`). Hoặc `gh run download <run-id> -n Project-2C-<sha>` |
| Lượt cuối (G7) | Exe phát hành v1.0 | Artifact của SHA phát hành (ghi trong Issue / PR G7) |
| Exe Phase 5 (chỉ cho mục nâng cấp) | `3d6c7fc` | Run CI `38117986342`, artifact `Project-2C-3d6c7fc934747a4bde3653bbc0698f399ea7983b` (GitHub giữ tới 09/01/2027) |

Mỗi lượt dùng **một thư mục mới chỉ để thử**, ví dụ `C:\nghiem-thu\L1\`: chép exe vào đó rồi chạy. Exe tạo `Project2C-data\` cạnh nó, nên thư mục thử không đụng dữ liệu của exe dùng hằng ngày.

### Dữ liệu

- **Mặc định: dữ liệu giả lập (seed demo)** — có sẵn khi mở exe lần đầu trong thư mục trống; muốn làm lại từ đầu: **Cài đặt → Dữ liệu → Nạp lại…**. Seed tính lùi từ **hôm nay** (ngày của máy) nên tên người và số liệu khác mockup: mockup quyết định *nghĩa* của nhãn và cách trình bày, không quyết định số. Dòng nào cần một KH / lịch hẹn có đặc điểm riêng thì cột Thao tác ghi cách tìm trong seed.
- **Dữ liệu tải (T-216)** chỉ dùng cho mục hiệu năng: `node tools/load-data.mjs` sinh `.local/load-data/load-2026-10-12-seed6.p2cbackup` (≈ 15 MB), nhập bằng **Cài đặt → Dữ liệu → Nhập backup**.
- Nhiều dòng sửa dữ liệu (tạo, ghi kết quả, xóa…). Làm theo thứ tự trong file; dòng sau có thể dùng bản ghi dòng trước tạo ra (cột Thao tác ghi rõ). Cần dữ liệu sạch thì Nạp lại.
- **Provider AI:** exe mới dùng **Mock**. Dòng cần OpenCode (cần API key, tốn hạn mức gói) hay tài khoản ChatGPT ghi ở cột Ghi chú; không có thì ghi `—` kèm lý do.

### Ghi kết quả

- Cột **Đạt / Lỗi** ghi theo lượt, các lượt nối nhau trong cùng ô: `L1 ✅` · `L1 ❌ #600` · `L1 —` (không làm được, lý do ở Ghi chú). Ví dụ sau hai lượt: `L1 ❌ #600 · L2 ✅`.
- **Lỗi → Issue thường** (ghi mã dòng, SHA exe, máy, các bước, ảnh chụp), Owner tự mở hoặc báo Claude mở. Lỗi **chặn phát hành** (mất / sai dữ liệu, số chỉ số sai, app không mở, không làm được việc chính) gắn `risk:high`; lệch nhỏ về giao diện gắn `risk:low`. Lệch mockup đã biết (cuối file) không cần mở Issue mới.
- **Mã dòng ổn định** (`NT-<vùng>-<số>`): Issue lỗi và `docs/metrics/phase-6.md` trỏ tới mã. Không đánh số lại; dòng bỏ giữ mã, ghi "(bỏ)"; dòng mới lấy số kế tiếp của vùng.
- Kết quả lượt thử commit qua PR docs sửa đúng file này.

### Các lượt thử

| Lượt | Ngày | Máy | Exe (SHA) | Dữ liệu | Phạm vi | Kết quả |
|---|---|---|---|---|---|---|
| L1 | | | | seed demo | | |

## Vùng và mã dòng

| Mã | Vùng | Mockup / spec |
|---|---|---|
| `NT-CH` | [Chung: sidebar, góc nhìn, bảng dài](#1-chung--sidebar-góc-nhìn-bảng-dài-nt-ch) | `phase-3-feedback.html` (gói A), `table-more.html` |
| `NT-TQ` | [Tổng quan](#2-tổng-quan-nt-tq) | `overview.html` 1a–1e; spec Phase 4 §1, §2, §4.1–4.3 |
| `NT-LH` | [Lịch hẹn](#3-lịch-hẹn-nt-lh) | `overview.html` §2, `phase-3-feedback.html` B3–B6, `appointments.html`, `appointment-forms.html` 6a–6i, `trash.html` 11f |
| `NT-KH` | [Khách hàng](#4-khách-hàng-nt-kh) | `customers.html`, `phase-3-feedback.html` B2, `customer-forms.html` 5a–5f, `trash.html` 11f |
| `NT-HS` | [Hồ sơ KH, KYC, hợp đồng](#5-hồ-sơ-kh-kyc-hợp-đồng-nt-hs) | `customer.html`, `kyc-forms.html` 7a–7e, `policy-forms.html` 8a–8d |
| `NT-AI` | [KYC Intelligence](#6-kyc-intelligence-nt-ai) | `ai.html` §2, §3, §4 (4d–4i), `customer.html`; spec Phase 5 §9.1, §9.2 |
| `NT-BC` | Báo cáo (phần 2) | `reports.html` 2a–2f |
| `NT-TM` | Team & nhân sự (phần 2) | `team.html`, `phase-3-feedback.html` B1 |
| `NT-CD` | Cài đặt → Dữ liệu (phần 2) | `settings-data.html` |
| `NT-CA` | Cài đặt → AI (phần 2) | `ai.html` §1, §4 (4a–4c) |
| `NT-TR` | Cài đặt → Thùng rác (phần 2) | `trash.html` 11a–11e, 11g |
| `NT-EX` | Exe trên máy thật (phần 2) | spec Phase 6 §5 mục 3 |
| `NT-DB` | Độ bền dữ liệu (phần 2) | spec Phase 6 §4.1 (S-2), §5 mục 4 |
| `NT-HN` · `NT-EV` · `NT-HD` | Hiệu năng · eval AI thật · hướng dẫn khớp exe (phần 2) | spec Phase 6 §5 mục 5–6, §4.3 |

Phần 2 (các vùng ghi "phần 2") thêm ở PR kế tiếp của T-221.

## 1. Chung — sidebar, góc nhìn, bảng dài (`NT-CH`)

| Mã | Màn / mockup | Thao tác | Kết quả mong đợi | Đạt / Lỗi | Ghi chú |
|---|---|---|---|---|---|
| NT-CH-01 | Sidebar · ý 8 | Mở app, bấm lần lượt từng mục sidebar | Có **Tổng quan**, **Lịch hẹn**, **Khách hàng**, **Báo cáo**; nhóm **Quản lý**: **Team & nhân sự**, **Cài đặt**. Mục đầu là "Tổng quan" (không còn "Tổng quan hôm nay"). Mỗi mục mở đúng màn | | |
| NT-CH-02 | Góc nhìn · ý 5, 10 | Mở lần lượt 6 màn và một Hồ sơ KH | Ô **Góc nhìn** (Toàn bộ / Team / RE) chỉ có ở Tổng quan, Lịch hẹn, Khách hàng, Báo cáo. Không có ở Team & nhân sự, Hồ sơ KH, Cài đặt | | |
| NT-CH-03 | Góc nhìn · ý 1, 4 | Chọn góc nhìn **RE**, mở danh sách RE | Chữ của bộ chọn góc nhìn dễ đọc, không nhỏ hơn chữ thường của màn. RE sắp **theo team rồi theo tên**; cùng thứ tự ở ô RE của hộp Lịch hẹn mới, Khách hàng mới, Hợp đồng mới | | |
| NT-CH-04 | Góc nhìn dùng chung · `overview.html` 1d | Ở Khách hàng chọn góc nhìn Team, một team X; sang Lịch hẹn, Báo cáo, rồi Tổng quan | Góc nhìn giữ Team X ở mọi màn. Ở Tổng quan, kỳ + góc nhìn đang chọn được áp dụng sẵn (không phải bấm Lọc) | | |
| NT-CH-05 | Tên người · ý 7 | Xem tên ở thẻ KH, khung Trong ngày, bảng Team | Không có chữ viết tắt 2 ký tự đứng trước tên người | | |
| NT-CH-06 | Bảng dài · `table-more.html` 1–3 | Lịch hẹn, góc nhìn Toàn bộ, kỳ **Năm**: kéo xuống cuối **Danh sách lịch hẹn**, bấm "Hiện thêm" vài lần | Chân bảng "Đang hiện 100 / N lịch" + nút "Hiện thêm 100 lịch"; mỗi lần bấm thêm 100 dòng. Lần cuối nút ghi đúng số còn lại ("Hiện thêm k lịch"), sau đó "Đã hiện hết N lịch". Số đếm ở đầu thẻ luôn là tổng thật N | | |
| NT-CH-07 | Bảng dài · `table-more.html` | Tiếp NT-CH-06: bấm tiêu đề cột Ngày; rồi đổi kỳ | Sắp cột giữ nguyên số dòng đang hiện; đổi kỳ / bộ lọc quay về 100 dòng | | |
| NT-CH-08 | Bảng dài · `table-more.html` 4 | Lịch hẹn kỳ **Ngày** (≤ 100 lịch); Khách hàng → **Bảng**, góc nhìn Toàn bộ | Bảng ≤ 100 dòng không có chân bảng, không có nút. Bảng Khách hàng > 100 dòng có "Hiện thêm 100 khách hàng" | | |

## 2. Tổng quan (`NT-TQ`)

Đối chiếu số giữa các màn: cùng kỳ, cùng góc nhìn. Sau khi sửa dữ liệu ở màn khác, quay lại Tổng quan phải bấm **Lọc** để tính lại.

| Mã | Màn / mockup | Thao tác | Kết quả mong đợi | Đạt / Lỗi | Ghi chú |
|---|---|---|---|---|---|
| NT-TQ-01 | 1a · Lọc | Mở app (màn đầu là Tổng quan) | Kỳ **Tháng** hiện tại, góc nhìn đang chọn, đã áp dụng sẵn. Dòng "Đang xem: Tháng mm/yyyy **MTD** 01/mm – dd/mm/yyyy · Toàn bộ", dd/mm = hôm nay | | |
| NT-TQ-02 | 1d · Lọc | Đổi kỳ sang **Năm**, chưa bấm Lọc | Nút **Lọc** chuyển vàng có chấm, dòng "Đã đổi kỳ / góc nhìn — bấm Lọc để cập nhật"; số trên màn và dòng "Đang xem" giữ của Tháng. Chọn lại Tháng hiện tại → nút về bình thường, dòng nhắc mất. Chọn Năm rồi bấm Lọc → số đổi, "Đang xem" ghi Năm | | |
| NT-TQ-03 | 1d · Lọc | Đổi góc nhìn ở thanh đầu trang sang Team, chưa bấm Lọc | Như NT-TQ-02: nút Lọc vàng + dòng nhắc, số giữ nguyên tới khi bấm Lọc | | |
| NT-TQ-04 | 1a · ô Lịch hẹn | Kỳ Tháng hiện tại, Toàn bộ | Tiêu đề "Lịch hẹn · cả tháng"; số lớn "đã gặp / tổng lịch"; 4 dòng theo thứ tự **Đã gặp · Dời lịch / hủy / không đến · Chưa ghi kết quả · Dự kiến**, cộng 4 dòng = tổng lịch. Đếm cả lịch sau hôm nay (Dự kiến) | | |
| NT-TQ-05 | 1a · ô Lịch hẹn ↔ Lịch hẹn | Sang Lịch hẹn, cùng kỳ Tháng, Toàn bộ, Phối hợp **Bất kỳ** | Dòng đếm "N lịch · M đã gặp · K chưa ghi kết quả" trùng ô Lịch hẹn của Tổng quan (N = tổng, M = Đã gặp, K = Chưa ghi kết quả) | | |
| NT-TQ-06 | 1a · 6 ô KPI | Kỳ Tháng hiện tại | 6 ô **Chuyển RF, HĐ nộp, Case size, HĐ phát hành, Doanh số, Tỉ lệ chốt**. Tiền dạng gọn (tr / tỷ). Tỉ lệ chốt có dòng "a HĐ phát hành ÷ b RF" và bằng a ÷ b (một chữ số thập phân, dấu phẩy) | | |
| NT-TQ-07 | 1a · so kỳ trước (C01, C02) | Kỳ Tháng hiện tại | Dưới mỗi ô KPI: "▲ x / ▼ x / = so với 01/(tháng trước) – dd/(tháng trước)" — **cùng số ngày** với MTD (hôm nay 20/10 → so 01/09 – 20/09; tháng trước ngắn hơn thì cắt ở ngày cuối của nó). Tỉ lệ chốt chênh bằng "điểm %" | | |
| NT-TQ-08 | C03 | Bấm **Kỳ trước** (tháng đã hết), Lọc | So với **cả** tháng liền trước (01 → ngày cuối). Không có nhãn MTD | | |
| NT-TQ-09 | 1b · C04 | Kỳ **Tuần** chứa hôm nay, Lọc | "Đang xem: dd/mm – dd/mm/yyyy" từ Thứ Hai tới Chủ nhật; so với Thứ Hai → cùng thứ của hôm nay ở tuần trước | | |
| NT-TQ-10 | C05 | Kỳ **Ngày** hôm nay, Lọc | So với hôm qua | | |
| NT-TQ-11 | 1c · C06 | Kỳ **Năm** hiện tại, Lọc | So với 01/01 → cùng ngày tháng năm trước. Chart 12 cột (cuối mỗi tháng; tháng này = hôm nay), các tháng sau tháng này để trống | | |
| NT-TQ-12 | 1e · C08 | Kỳ Tháng, bấm **Kỳ sau** (tháng chưa bắt đầu), Lọc | 6 ô KPI "—" kèm "kỳ chưa bắt đầu"; 4 ô N4–N1 "—"; chart mọi cột trống + "Kỳ chưa bắt đầu". Ô Lịch hẹn vẫn đếm lịch Dự kiến của tháng sau ("0 / n") | | |
| NT-TQ-13 | 1e · C09, spec Phase 4 §3.1 | Kỳ **Tùy chọn** 2 tuần chứa hôm nay, Lọc; rồi gõ Đến ngày quá 3 tháng | Không có dòng so kỳ trước, có câu "Kỳ Tùy chọn không so với kỳ trước". Khoảng quá 3 tháng: ô ngày báo đỏ "Kỳ Tùy chọn tối đa 3 tháng", kỳ đang xem không đổi | | |
| NT-TQ-14 | 1e · 0 RF | Góc nhìn RE, tìm một ngày / tuần RE đó không có RF (vd. kỳ Ngày một Chủ nhật), Lọc | Tỉ lệ chốt "—", dòng "0 RF trong kỳ · không so". Kỳ có RF mà kỳ trước 0 RF → dòng "— kỳ trước 0 RF, không so" | | |
| NT-TQ-15 | 1e · miền năm (spec Phase 4 §3) | Tùy chọn 01/01/1900 – 10/01/1900, Lọc; rồi 25/12/2100 – 31/12/2100 | Kỳ đầu: nút ‹ tắt, › bật; kỳ cuối: › tắt, ‹ bật; app không báo lỗi. Ô Lịch hẹn "0 / 0", tiền "0 ₫" | | |
| NT-TQ-16 | 1a · KH theo nhóm (spec Phase 4 §2) | Kỳ Tháng hiện tại, Toàn bộ | 4 ô **N4, N3, N2, N1** cùng màu badge nhóm, nhãn "ảnh chụp cuối ngày dd/mm/yyyy (hôm nay)". KH Tạm hoãn / Mất cơ hội không nằm trong 4 ô | | |
| NT-TQ-17 | §2 ↔ Khách hàng | Sang Khách hàng → Kanban, góc nhìn Toàn bộ | Số ở đầu 4 cột N4–N1 bằng 4 ô của NT-TQ-16 | | |
| NT-TQ-18 | §2 · kỳ đã hết | Kỳ Tháng trước, Lọc | Nhãn "ảnh chụp cuối ngày <ngày cuối tháng đó>" (không có "(hôm nay)"); cột cuối của chart bằng 4 ô | | |
| NT-TQ-19 | 1a · chart | Kỳ Tháng hiện tại; rồi Tuần, Năm, Tùy chọn > 31 ngày | Cột chồng 4 màu, N1 sát trục; Tháng: mỗi ngày một cột, cột sau hôm nay trống; Tuần 7 cột T2–CN; Năm 12 cột; Tùy chọn ≤ 31 ngày từng ngày, dài hơn từng tháng. Rê chuột lên cột hiện số từng nhóm | | |
| NT-TQ-20 | 1b · ẩn / hiện nhóm | Bấm ô **N4**, rồi bấm lại | Ô N4 ghi "đang ẩn", viền đứt, số mờ; chart chỉ còn N3–N1, trục y co lại. Bấm lại → hiện lại | | |
| NT-TQ-21 | 1b · góc nhìn Team | Góc nhìn **Team**, kỳ Tuần, Lọc; bấm ô N4 | Không có ô chọn team. "Đang xem: … · Team (3 team)"; 4 ô "cộng 3 team"; mỗi team một chart "Team <tên>". Tắt N4 áp cho cả 3 chart. Số 4 ô = góc nhìn Toàn bộ cùng kỳ | | |
| NT-TQ-22 | 1c · góc nhìn RE | Góc nhìn **RE**, chọn một RE, kỳ Năm, Lọc | "Đang xem: Năm yyyy · 01/01 – dd/mm/yyyy · RE <tên>"; một chart; **không** có bảng So sánh team | | |
| NT-TQ-23 | 1a · So sánh team | Toàn bộ, kỳ Tháng hiện tại | Bảng "So sánh team" ghi khoảng MTD và "bấm một team để xem RE"; team theo tên; cột Đã gặp, Chuyển RF, HĐ nộp, Case size, HĐ phát hành, Doanh số, Tỉ lệ chốt. Tiền 0 → "0 ₫"; dòng 0 RF → tỉ lệ "—". Bấm một team → các RE của team hiện ngay dưới, sắp theo tên; bấm lại → thu. Đầu cột không sắp. Không có cột so kỳ trước | | |
| NT-TQ-24 | 1a · dòng Tổng (golden G09–G11) | Cộng tay từng cột của bảng | Dòng **Tổng** = cộng các team; Tỉ lệ chốt Tổng = Σ HĐ phát hành ÷ Σ RF (không phải trung bình các tỉ lệ). Cộng các RE của một team = dòng team | | |
| NT-TQ-25 | Khớp chỉ số | So bảng với các ô trên cùng màn | Dòng Tổng: Đã gặp = Đã gặp của ô Lịch hẹn; 6 cột còn lại = 6 ô KPI | | |

## 3. Lịch hẹn (`NT-LH`)

Mockup `appointments.html` là vòng 2 (26/09); phần lịch tháng / năm / 4 nhóm theo `phase-3-feedback.html` và `overview.html` §2 (mockup sau thay mockup trước). Hôm nay của mockup hộp thoại là 26/09/2026: so theo nghĩa ("2 ngày nữa", "đã qua").

| Mã | Màn / mockup | Thao tác | Kết quả mong đợi | Đạt / Lỗi | Ghi chú |
|---|---|---|---|---|---|
| NT-LH-01 | Kỳ | Mở Lịch hẹn, đổi kỳ Ngày / Tuần / Tháng / Năm / Tùy chọn | Đổi kỳ áp dụng ngay, không có nút Lọc. Dòng đếm "N lịch · M đã gặp · K chưa ghi kết quả"; phần "· K chưa ghi kết quả" chỉ hiện khi K > 0 | | |
| NT-LH-02 | `overview.html` §2 · 4 nhóm | Kỳ Tháng hiện tại | Chú giải 4 nhóm theo thứ tự **Đã gặp · Dời lịch / hủy / không đến · Chưa ghi kết quả · Dự kiến**; Chưa ghi kết quả màu **cam**, Dời lịch / hủy / không đến màu **xám**. Lịch hôm nay chưa ghi kết quả là **Dự kiến**; lịch trước hôm nay còn Dự kiến là **Chưa ghi kết quả** | | |
| NT-LH-03 | §2 · lịch tháng | Xem ô các ngày đã qua có lịch chưa ghi kết quả, nhất là ngày nhiều lịch | Mỗi ô có số lịch và mỗi lịch một chấm màu theo nhóm; chấm Chưa ghi kết quả đứng **đầu** ô ngày, ngày nhiều lịch vẫn thấy chấm cam | | |
| NT-LH-04 | §2 · danh sách | Kéo xuống **Danh sách lịch hẹn** | Cột Ngày, Giờ, Khách hàng, RE, Trigger, Phối hợp, Trạng thái, Kết quả. Lịch đã qua còn Dự kiến hiện badge "Chưa ghi kết quả" ở cột Trạng thái. Kết quả dạng "N3 → N2 · RF", "N4 → N3", "Giữ N3", "Dời sang dd/mm" | | |
| NT-LH-05 | B5 · cột Ngày | Kỳ Tuần chứa hôm nay | Chỉ ô Ngày được tô: đã qua nền vàng nhạt, hôm nay xanh lá nhạt, sắp tới xanh dương nhạt; chữ vẫn rõ | | |
| NT-LH-06 | B4 4a · ngày đang chọn | Kỳ Tháng, bấm một ngày khác hôm nay | Số ngày của ô đang chọn màu vàng gold, nền vàng nhạt; ô hôm nay viền xanh lá nhạt + "· hôm nay". Kỳ Tháng không tô dải | | |
| NT-LH-07 | B4 4b, 4c · tuần vắt tháng | Kỳ Tuần, bấm ‹ / › tới một tuần chứa ngày 1 của tháng; bấm một ngày thuộc tháng kia | Mọi ngày trong kỳ được tô dải; ngày thuộc tháng kia hiện kèm tháng (vd. "28/09"), có dấu →, bấm được → lịch sang tháng đó, dải tiếp tục. Ngày ngoài kỳ, ngoài tháng mờ | | |
| NT-LH-08 | B4 4d · Tùy chọn | Tùy chọn 2 tuần vắt qua hai tháng | Tô dải như Tuần, bấm được ngày của tháng kia | | |
| NT-LH-09 | B3 · Trong ngày | Bấm một ngày có lịch, rồi một ngày không có lịch | Khung "Trong ngày dd/mm/yyyy": lịch xếp theo team rồi RE, có giờ, tên KH, trạng thái. Ngày trống: "Không có lịch hẹn trong ngày." | | |
| NT-LH-10 | B6 · lưới năm | Kỳ **Năm** hiện tại | "Lịch năm yyyy" · "bấm một tháng để mở kỳ Tháng": 4 cột = 4 quý, đầu cột "n lịch" của quý; mỗi ô tháng có tên, tổng, thanh màu theo 4 nhóm có số ("Số trong thanh = số lịch"). Tháng hiện tại nổi (vàng); tháng tương lai mờ, chỉ có phần Dự kiến. Không có khung Trong ngày; danh sách là cả năm. Tổng 4 quý = N của dòng đếm | | |
| NT-LH-11 | B6 · bấm ô tháng | Bấm ô tháng hiện tại, rồi một tháng đã qua | Mở kỳ Tháng đó: tháng hiện tại chọn hôm nay, tháng khác chọn ngày 1. Năm trước (bấm ‹ ở kỳ Năm): không có tháng nổi, không có tháng mờ | | |
| NT-LH-12 | B3 · hàng chọn RE | Góc nhìn **Team**, chọn một team | Hàng "Team <tên> · n RE": "Cả team" + số, các RE của team (chỉ RE, không TL / người hỗ trợ), mỗi hàng 5 RE, sắp theo tên; số cạnh tên = số lịch RE đó **phụ trách** trong kỳ, đổi kỳ thì số đổi. Góc nhìn Toàn bộ / RE không có hàng này | | |
| NT-LH-13 | B3 · chọn RE | Bấm một RE; sang Khách hàng; quay lại, bấm lại RE đó; rồi đổi team | Lịch tháng, Trong ngày, danh sách, dòng đếm chỉ còn lịch RE đó phụ trách (lịch RE chỉ là người phối hợp không tính). Sang Khách hàng: RE vẫn được chọn. Bấm lại RE (hoặc "Cả team") → cả team. Đổi team / góc nhìn → tự bỏ chọn RE | | |
| NT-LH-14 | Phối hợp | Ô **Phối hợp**: Bất kỳ → Không có người phối hợp → một TL cụ thể | Danh sách và dòng đếm lọc đúng: không người phối hợp; chỉ lịch có TL đó phối hợp | | |
| NT-LH-15 | Chi tiết lịch hẹn | Bấm tên KH ở lần lượt một lịch Dự kiến tương lai, một lịch Chưa ghi kết quả, một lịch Đã gặp, một lịch Dời lịch | Khung **Chi tiết lịch hẹn**: RE · team, Phối hợp, Trigger, Trạng thái, Kết quả, Ghi chú, **Hồ sơ KH →**. Nút: Dự kiến → **Ghi kết quả**, **Dời lịch**, **Xóa**; đã có kết quả → **Sửa kết quả**; lịch hôm nay / đã qua (mọi trạng thái) → **Tạo lịch hẹn tiếp theo**. Lịch Dời lịch không có nút Xóa, có liên kết "Dời sang" | | |
| NT-LH-16 | Chi tiết · KYC Intelligence (spec Phase 5 §9.2) | Chi tiết lịch của một KH đã có phân tích AI và một KH chưa có | Khối chỉ đọc: Next Best Actions + Discovery Strategy của kết quả đạt mới nhất, CURRENT / STALE, ngày; không có nút gọi AI. Chưa có: "Chưa có phân tích AI." + "Mở Hồ sơ KH để phân tích →" mở đúng hồ sơ | | Có thể dùng KH vừa phân tích ở NT-AI-04 |
| NT-LH-17 | 6a · Lịch hẹn mới | **+ Lịch hẹn**, gõ tên một KH đã gặp nhiều lần (có cả lịch tương lai) | Hộp "Lịch hẹn mới" · "Trạng thái: Dự kiến". Chọn KH: "Lần gặp thứ n · lần trước dd/mm/yyyy"; **Các lần hẹn trước** chỉ gồm lịch hôm nay trở về trước (không có lịch tương lai), tối đa 5 dòng mới nhất "dd/mm · trạng thái · chuyển nhóm · Ghi chú: …", và "Xem tất cả (n) →" khi > 5; **Đổi KH** chọn lại. RE mặc định = RE phụ trách KH | | |
| NT-LH-18 | 6a · tạo | Tiếp NT-LH-17: Ngày = 2 ngày sau hôm nay (gõ dd/mm), Giờ 14:00, Trigger **Khác** + mô tả, thêm một TL làm người phối hợp; **Tạo lịch hẹn** | Dòng đọc lại "Thứ … dd/mm/yyyy · 2 ngày nữa". Danh sách người phối hợp không có RE của lịch. Sau khi tạo: màn chuyển tới ngày của lịch mới và mở chi tiết; lịch là Dự kiến, Phối hợp có TL | | |
| NT-LH-19 | 6b · ngày, giờ, trigger | Trong hộp Lịch hẹn mới gõ lần lượt: `5/1` (đã qua lâu); `29/02` (khi năm nay không nhuận); `28-9`; giờ `25:00`; để Trigger "—"; bấm Tạo | `5/1`: "05/01/yyyy đã qua n ngày. Ý anh là 05/01/(yyyy+1)?" + nút **Dùng …**, câu "App không tự đổi năm. Giữ nguyên là ghi lịch hẹn quá khứ (nhập bù)." `29/02`: "Năm yyyy không có ngày 29/02. Ý anh là …?". `28-9`: "Gõ dd/mm hoặc dd/mm/yyyy." Giờ: "Giờ từ 00:00 đến 23:59." Trigger: "Chọn loại trigger ("—" là chưa chọn)." Không tạo lịch nào | | |
| NT-LH-20 | Ngoài góc nhìn | Góc nhìn RE A; tạo lịch cho KH của RE B (đổi ô RE sang B) | Lịch được tạo; màn báo "Đã tạo lịch hẹn dd/mm/yyyy cho B. RE này nằm ngoài góc nhìn hiện tại nên lịch không hiện ở đây; đổi góc nhìn để xem." | | |
| NT-LH-21 | 6c · Đã gặp, N2 → N1 | Tìm một lịch **Chưa ghi kết quả** của KH đang **N2**; **Ghi kết quả** → Đã gặp, nhóm **N1**, Người đánh giá một TL, Việc tiếp theo, Case size `800tr`; **Lưu kết quả** | Hộp "Kết quả cuộc gặp" · "<KH> · Thứ … dd/mm/yyyy hh:mm · hiện N2". Nhóm N2 ghi "giữ nguyên"; chọn N1 → "N2 → N1 ngày dd/mm/yyyy · không tính RF — RF chỉ khi N4 / N3 lên N2 / N1". Người đánh giá chỉ có IS / TL / BDM / BD. Case size đọc lại "800.000.000 ₫ (800 tr)". Sau khi lưu: lịch Đã gặp, Kết quả "N2 → N1", KH sang cột N1; Chuyển RF ở Tổng quan **không** đổi | | |
| NT-LH-22 | 6c · RF (ADR-0007) | Một lịch Chưa ghi kết quả của KH **N3**; Đã gặp, nhóm **N2**; ghi nhớ RE và ngày lịch; lưu; sang Tổng quan kỳ chứa ngày đó, góc nhìn RE đó, Lọc | Hộp ghi "N3 → N2 ngày … · tính RF". Danh sách "N3 → N2 · RF". Chuyển RF của RE tăng 1 ở kỳ chứa **ngày cuộc hẹn**; người phối hợp của lịch không được tính | | |
| NT-LH-23 | 6c · KYC từ cuộc gặp | Trong hộp Kết quả (Đã gặp) gõ Ghi chú cuộc gặp, bấm **+ Ghi chú KYC từ cuộc gặp này** | Hộp Ghi chú KYC mở với chữ và ngày của cuộc gặp điền sẵn. Dòng "Ghi chú cuộc gặp không phải ghi chú KYC." có trong hộp Kết quả | | |
| NT-LH-24 | 6d · thiếu mục bắt buộc | Ghi kết quả → Đã gặp, để trống nhóm và việc tiếp theo, bấm Lưu | Báo "Đã gặp thì cần nhóm sau cuộc gặp và việc tiếp theo" + "Case size được để trống."; ô nhóm "Chọn nhóm sau cuộc gặp (chọn "giữ nguyên" nếu không đổi)."; ô việc "Nhập việc tiếp theo."; không lưu gì | | |
| NT-LH-25 | 6d · số tiền | Case size lần lượt `1.234 tr`, `1,234 tr`, `12,5`, `-5tr`, `năm trăm`, `200 tỷ` | `1.234 tr` → "1.234.000.000 ₫ (1,23 tỷ)"; `1,234 tr` → 1.234.000 ₫; `12,5` → "Số tiền phải là số đồng nguyên."; âm → "Số tiền không được âm."; chữ → "Gõ số tiền như 800tr, 1,2 tỷ hoặc 500.000.000."; quá 100 tỷ → "Số tiền tối đa 100 tỷ đồng."; không lưu | | |
| NT-LH-26 | 6i · Không đến + hẹn tiếp | Một lịch Chưa ghi kết quả → Ghi kết quả → **Không đến**, Ghi chú; đánh dấu **Hẹn lần tiếp theo**, ngày 5 ngày sau hôm nay; **Lưu kết quả + tạo lịch** | Hộp ghi "Không đến / Hủy: không có nhóm sau cuộc gặp, việc tiếp theo, case size."; khung "Khi lưu (một lần bấm)": "… → Không đến" và "Tạo lịch hẹn mới … · Dự kiến". Sau một lần bấm: lịch cũ Không đến (nhóm Dời lịch / hủy / không đến), lịch mới Dự kiến cùng KH, RE, người phối hợp, trigger. Ngày hẹn tiếp đã qua → "dd/mm/yyyy đã qua. Lịch mới phải từ hôm nay (…) trở đi." | | |
| NT-LH-27 | Lịch chưa tới ngày | Ghi kết quả một lịch Dự kiến sau hôm nay | Câu "Lịch chưa tới ngày: Đã gặp và Không đến ghi được từ ngày …; trước đó chỉ Dời lịch hoặc Hủy."; chỉ chọn được Dời lịch / Hủy. Chọn **Dời lịch** trong hộp → hiện các ô của Dời lịch | | |
| NT-LH-28 | 6e · Dời lịch (D3) | Một lịch Dự kiến tương lai → **Dời lịch**: ngày mới, lý do; **Dời lịch** | Giờ mới mặc định giờ cũ. Khung "Khi lưu": "… → Dời lịch (giữ lại trong lịch sử, không tính gặp)" + "Tạo lịch hẹn mới … · Dự kiến · cùng RE, trigger, người phối hợp". Sau khi lưu: lịch cũ ở nhóm Dời lịch / hủy / không đến tại ngày cũ, lịch mới Dự kiến tại ngày mới (mỗi lịch tính ở kỳ của ngày nó). "Các lần hẹn trước" của KH có "dd/mm · Dời lịch · Ghi chú: <lý do>" | | |
| NT-LH-29 | 6e · biên | Dời lịch: ngày giờ mới trùng lịch cũ; rồi ngày đã qua | Trùng: "Ngày giờ mới trùng lịch cũ." Đã qua: "… Ngày dời phải từ hôm nay (…) trở đi; ngày đã qua chỉ dùng để nhập bù." + ô **Nhập bù: cuộc gặp đã diễn ra vào ngày này** | | |
| NT-LH-30 | 6h · Lịch hẹn tiếp theo | Chi tiết lịch Không đến của NT-LH-26 (hoặc lịch đã qua bất kỳ) → **Tạo lịch hẹn tiếp theo**; gõ một ngày đã qua | Hộp "Lịch hẹn tiếp theo" · "Từ lịch dd/mm/yyyy hh:mm · Không đến · điền sẵn, sửa được"; KH, RE, giờ, trigger, người phối hợp điền sẵn. Ngày đã qua: "… Lịch mới phải từ hôm nay (…) trở đi." kèm gợi ý năm sau. Lịch Dự kiến tương lai không có nút này | | |
| NT-LH-31 | 6f · Sửa kết quả | Lịch Đã gặp của NT-LH-21 (chuyển nhóm mới nhất) → **Sửa kết quả**, đổi Việc tiếp theo, **Lưu** | Hộp "Sửa kết quả cuộc gặp", không khóa ô nào; lưu được, chi tiết hiện việc mới | | |
| NT-LH-32 | 6f · bị khóa (D7) | KH của NT-LH-21: **Chuyển nhóm** tay N1 → N2 (Hồ sơ KH); rồi Sửa kết quả lịch Đã gặp đó | Hộp ghi "Khóa 3 ô: trạng thái, ngày cuộc hẹn, nhóm sau cuộc gặp" (🔒), "Nhóm của KH đã đổi tiếp sau cuộc gặp này, ngày …", liên kết "Chuyển nhóm tay ở Hồ sơ KH", "Các ô còn lại vẫn sửa được."; nút Xóa lịch hẹn bị chặn ("Xóa cũng bị chặn"). Các ô khác lưu được | | |
| NT-LH-33 | 6g · Xóa cuộc gặp có chuyển nhóm | Lịch Đã gặp của NT-LH-22 (chuyển nhóm mới nhất, tính RF) → Sửa kết quả → **Xóa lịch hẹn** | Hộp "Xóa lịch hẹn dd/mm/yyyy hh:mm?" · "<KH> · Đã gặp": "Cuộc gặp này đã chuyển nhóm KH. Khi xóa:" Nhóm KH "N2 → về N3 (hủy chuyển nhóm dd/mm)", RF "bớt 1 (N3 → N2 tính RF)", Ghi chú KYC "giữ nguyên"; "Xóa mềm, khôi phục được ở Cài đặt → Thùng rác." Sau khi xóa: KH về N3, Chuyển RF (Lọc lại) giảm 1, lịch không còn ở danh sách | | Lịch này dùng lại ở Thùng rác (phần 2) |
| NT-LH-34 | Xóa lịch Dự kiến | Chi tiết một lịch Dự kiến → **Xóa** | Hộp: "Cuộc hẹn này không đổi nhóm KH. Khi xóa:" … "không đổi"; câu xóa mềm như NT-LH-33. Xóa → lịch biến khỏi danh sách và số đếm | | |
| NT-LH-35 | Chuỗi dời (spec Phase 4 §1.3) | Xóa lịch mới tạo ở NT-LH-28 | Lịch gốc vẫn là Dời lịch và vẫn đếm ở nhóm Dời lịch / hủy / không đến; lịch con không còn đếm | | |
| NT-LH-36 | Khớp màn | Kỳ Năm, Toàn bộ: so lưới năm, dòng đếm với Tổng quan kỳ Năm (Lọc) | Tổng lịch, Đã gặp, Chưa ghi kết quả trùng ô Lịch hẹn của Tổng quan | | |

## 4. Khách hàng (`NT-KH`)

| Mã | Màn / mockup | Thao tác | Kết quả mong đợi | Đạt / Lỗi | Ghi chú |
|---|---|---|---|---|---|
| NT-KH-01 | `customers.html` · đầu màn | Mở Khách hàng, góc nhìn Toàn bộ | "n KH đang mở · m đã đóng"; ô **Cách xem** Kanban / Bảng; nút **+ Khách hàng**. n = cộng 4 cột N4–N1; m = Tạm hoãn + Mất cơ hội | | |
| NT-KH-02 | `customers.html` · Kanban | Xem Kanban | 4 cột N4 → N1 có số; thẻ KH: họ tên, "RE <tên>", giới tính · năm sinh; KH có HĐ có nhãn "n HĐ". Cột dài kết thúc bằng "+ n KH · xem dạng bảng" (bấm → Bảng). Khung **Tạm hoãn**, **Mất cơ hội**: tên + ngày đóng, "Mở lại được bất cứ lúc nào". Bấm thẻ → Hồ sơ KH | | |
| NT-KH-03 | Bảng | Cách xem **Bảng**; bấm từng tiêu đề cột | Cột Mã KH, Họ tên, Nhóm, RE, Ngày sinh, HĐ, Từ ngày (ngày vào nhóm hiện tại); sắp được mọi cột; số dòng = n + m của NT-KH-01; bấm tên → hồ sơ | | |
| NT-KH-04 | B2 2a · hàng chọn RE | Góc nhìn **Team**, chọn một team | Hàng "Team <tên> · 10 RE": "Cả team" + số; RE của team (chỉ RE), mỗi hàng 5, sắp theo tên; số cạnh tên = KH **đang mở** của RE. Dòng "Cả team <tên> · n KH đang mở · m đã đóng". Cộng số các RE = số "Cả team". Toàn bộ / RE không có hàng này | | |
| NT-KH-05 | B2 2b · chọn RE | Bấm một RE; bấm lại | Kanban / Bảng chỉ còn KH của RE; dòng "<RE> · n KH đang mở · m đã đóng". Bấm lại hoặc "Cả team" → cả team. RE chọn dùng chung với Lịch hẹn (NT-LH-13) | | |
| NT-KH-06 | 5a · Khách hàng mới | **+ Khách hàng**: Họ tên, RE, Ngày sinh `1984`, Giới tính Nữ, Nhóm ban đầu **N3**, Ngày ghi nhận để mặc định; **Lưu KH** | "Mã KH (vd. K-9A1C) sinh khi lưu"; ngày sinh đọc "Chỉ năm sinh 1984 · n tuổi trong năm yyyy"; Nhóm ban đầu chỉ có N4–N1 + câu "KH mới chỉ vào nhóm mở N4–N1…"; Ngày ghi nhận mặc định hôm nay; câu "Ngày sinh, giới tính được ghi thêm thành ghi chú KYC nguồn "Hệ thống"." Sau khi lưu: KH có mã K-xxxx, nằm ở cột N3; hồ sơ có dữ kiện Năm sinh, Giới tính ghi "sửa ở hồ sơ KH" | | KH này dùng tiếp ở NT-HS |
| NT-KH-07 | 5b · lỗi nhập | + Khách hàng: để trống Họ tên, không chọn RE, Ngày sinh `31/02/1984`, bấm Lưu KH; rồi Ngày sinh `12/3/84`; rồi Ngày ghi nhận ngày mai | "Chưa lưu được — n ô cần sửa" + "Không có gì được ghi vào dữ liệu."; Họ tên "Chưa nhập tên."; RE "Chọn RE phụ trách."; `31/02/1984` "Ngày này không tồn tại."; `12/3/84` "Gõ năm (1984) hoặc dd/mm/yyyy (12/03/1984)."; ngày ghi nhận sau hôm nay báo lỗi. Không tạo KH | | |
| NT-KH-08 | 5c · Sửa hồ sơ | KH của NT-KH-06 → **Sửa hồ sơ**: Ngày sinh `12/3/1984`; **Lưu** | Tiêu đề "Sửa hồ sơ · <tên>" · "K-xxxx · nhóm N3 (đổi nhóm ở "Chuyển nhóm")"; đọc "12/03/1984 · n tuổi"; khung "Khi lưu, app tự ghi vào KYC": ghi chú KYC nguồn Hệ thống + "(dữ kiện không đổi → không tạo phiên bản KYC mới)" vì năm không đổi. Đổi sang năm khác → "(dữ kiện đổi → tạo phiên bản KYC mới)" | | |
| NT-KH-09 | 5c · đổi RE | Một KH có lịch hẹn Đã gặp và HĐ: Sửa hồ sơ → đổi RE phụ trách sang RE khác; Lưu; xem Tổng quan góc nhìn RE cũ và RE mới (Lọc) | Câu "Đổi RE: lịch hẹn và HĐ cũ vẫn tính cho RE đã ghi trên từng bản ghi." KH chuyển sang Kanban của RE mới. Đã gặp, RF, HĐ cũ vẫn tính cho RE cũ; KH theo nhóm (4 ô) tính cho RE mới, cả ở các kỳ cũ | | |
| NT-KH-10 | 5d · Chuyển nhóm tay | Hồ sơ một KH **N2** → **Chuyển nhóm** → N3; Ngày chuyển để mặc định; **Chuyển nhóm** | "Chuyển nhóm · <tên>" · "K-xxxx · hiện tại N2 từ dd/mm/yyyy"; N2 ghi "hiện tại"; khung "Chuyển tay không bao giờ tính RF" + câu dùng "Ghi kết quả cuộc gặp"; "Sau khi lưu: N2 → N3". Sau khi lưu: KH ở N3, Dòng thời gian "N2 → N3 · chuyển tay · không tính RF". Thử chuyển N3 → N2 tay: RF không đổi | | Thiếu "· hạ nhóm" là lệch đã biết |
| NT-KH-11 | 5d · ngày chuyển | Chuyển nhóm với ngày mai; rồi ngày trước lần đổi nhóm gần nhất | Ngày mai: "Ngày này sau hôm nay…"; trước lần gần nhất: "Ngày chuyển trước lần đổi nhóm gần nhất (dd/mm/yyyy)." Không lưu | | |
| NT-KH-12 | 5e · KH đã đóng | Hồ sơ một KH **Tạm hoãn** → Chuyển nhóm | Câu "KH đã đóng chỉ mở lại về N3, hoặc chuyển sang nhóm đóng còn lại. Mở lại không tính RF."; N3 ghi "mở lại"; chỉ chọn được N3 hoặc Mất cơ hội. Mở lại → KH về cột N3, RF không đổi | | |
| NT-KH-13 | Đóng KH | Một KH N4 → Chuyển nhóm → **Mất cơ hội** | KH sang khung Mất cơ hội với ngày đóng; "m đã đóng" tăng 1; ô N4 ở Tổng quan (Lọc) giảm 1 | | |
| NT-KH-14 | 5f / `trash.html` 11f · Xóa KH | Ghi số lịch hẹn, số đã gặp, số HĐ ở thẻ Lịch hẹn / Hợp đồng của một KH; Sửa hồ sơ → **Xóa KH…** | Hộp "Xóa <tên>?": "KH và mọi bản ghi của KH sẽ bị ẩn khỏi danh sách và mọi chỉ số:" Lịch hẹn "n (a đã gặp · b lần tính RF)", Hợp đồng, Ghi chú KYC "n — giữ nguyên, không bao giờ xóa"; "Dữ liệu vẫn còn: khôi phục ở Cài đặt → Thùng rác." Số khớp với số đã ghi | | |
| NT-KH-15 | 5f · sau khi xóa | Tiếp NT-KH-14: **Xóa KH**; xem Khách hàng, Lịch hẹn, Tổng quan (Lọc) | Về danh sách Khách hàng, KH không còn; lịch hẹn của KH không còn ở Lịch hẹn; chỉ số giảm đúng phần của KH (Đã gặp, RF, HĐ, KH theo nhóm) | | KH này dùng lại ở Thùng rác (phần 2) |

## 5. Hồ sơ KH, KYC, hợp đồng (`NT-HS`)

| Mã | Màn / mockup | Thao tác | Kết quả mong đợi | Đạt / Lỗi | Ghi chú |
|---|---|---|---|---|---|
| NT-HS-01 | `customer.html` · đầu hồ sơ | Mở hồ sơ một KH có HĐ, rồi một KH chưa có | Họ tên, badge nhóm + "từ dd/mm/yyyy"; dòng "K-xxxx · Nữ · dd/mm/yyyy (n tuổi) · RE … · Team … · Đã có HĐ (n)" hoặc "Chưa có HĐ". Nút **Sửa hồ sơ**, **Chuyển nhóm**, **+ Lịch hẹn** (KH điền sẵn), **+ Ghi chú KYC**; **← Khách hàng** quay lại | | |
| NT-HS-02 | Dữ kiện KYC | Xem thẻ **Dữ kiện KYC** của một KH nhiều dữ kiện | "a/8 hạng mục · vN"; **Cổng KYC** + câu giải thích; 8 hạng mục (Danh tính / tuổi … Mối quan tâm) mỗi mục "đã có" ✓ hoặc "thiếu" ○; mỗi dữ kiện: trường, giá trị, mã **F** dạng `F13` (không "F-13"), ngày; Năm sinh / Giới tính có "sửa ở hồ sơ KH"; **Câu hỏi gợi ý** mở ra câu hỏi cho hạng mục thiếu | | |
| NT-HS-03 | Cổng KYC | Tìm trong seed 4 KH ứng với 4 trạng thái cổng (KH mới ít dữ kiện; KH có "Mâu thuẫn cốt lõi"…) | `CONFLICT_RESOLUTION` "Có mâu thuẫn ở trường cốt lõi: cần làm rõ trước khi phân tích."; `KYC_INSUFFICIENT` "Cần chăm sóc, KYC thêm thông tin khách hàng"; `PROFILE_DISCOVERY` "Đủ thông tin tối thiểu; nên khám phá thêm các hạng mục còn thiếu."; `PAIN_POINT_ANALYSIS` "Đủ dữ kiện để phân tích nhu cầu." | | |
| NT-HS-04 | 7a · Ghi chú KYC + dữ kiện | KH của NT-KH-06 → **+ Ghi chú KYC**: ghi chú, Ngày ghi nhận mặc định; Trường **Mục tiêu chính** + giá trị → **Thêm dữ kiện**; **Mốc thời gian mục tiêu** `2029` → Thêm; **Lưu ghi chú** | "Ghi chú KYC · <tên>" · "K-xxxx · KYC hiện tại vN (ngày)"; "Không sửa được sau khi lưu."; mỗi dữ kiện có badge "mới"; cuối hộp "Sau khi lưu: KYC v(N+1)" + "thay đổi quan trọng — tự động vì đổi trường cốt lõi, không bỏ được". Sau khi lưu: thẻ có 2 dữ kiện, phiên bản mới; Dòng thời gian có ghi chú và "kyc v(N+1)" nhãn "thay đổi quan trọng" | | |
| NT-HS-05 | 7b · trường khóa | + Ghi chú KYC → ô Trường | Năm sinh / Giới tính không chọn được (sửa ở hồ sơ KH). Thu nhập năm `6 tỷ` đọc "6.000.000.000 ₫ (6 tỷ)" | | |
| NT-HS-06 | 7c · Cập nhật | Ghi chú mới với Trường đã có giá trị (vd. Tổng tài sản), giá trị khác; chọn **Cập nhật**; Lưu | "Đang có: …" và khối **Trường đã có giá trị**: Cập nhật / Đánh dấu mâu thuẫn; dữ kiện badge "cập nhật". Sau khi lưu: giá trị mới hiệu lực, giá trị cũ thành cũ | | |
| NT-HS-07 | 7c · mâu thuẫn cốt lõi | Như NT-HS-06 với trường cốt lõi (vd. Số con), chọn **Đánh dấu mâu thuẫn**; Lưu | Thẻ ghi **Mâu thuẫn cốt lõi** ở trường đó; Cổng KYC `CONFLICT_RESOLUTION`; panel KYC Intelligence tắt nút Phân tích ("Giải quyết mâu thuẫn ở … trước khi phân tích.") | | |
| NT-HS-08 | 7d · Giải quyết | Bấm **Giải quyết** cạnh trường của NT-HS-07; chọn một giá trị; **Giải quyết** | Hộp "Giải quyết · <trường>": "Chọn giá trị đúng; giá trị còn lại thành cũ. Ghi chú gốc giữ nguyên."; mỗi giá trị kèm mã F, ghi chú, ngày; câu "Không giá trị nào đúng? …"; "Sau khi lưu: KYC v… · cổng KYC …". Sau khi lưu: hết mâu thuẫn, cổng theo câu báo trước | | |
| NT-HS-09 | 7d · mâu thuẫn phụ | KH có **Mâu thuẫn phụ** (seed, hoặc tạo như NT-HS-07 với trường phụ) → Giải quyết | Hộp có ô "Đánh dấu là thay đổi quan trọng — nên phân tích AI lại", mặc định tắt. Mâu thuẫn phụ không chặn Phân tích | | |
| NT-HS-10 | 7e · lỗi | + Ghi chú KYC: để trống ghi chú mà thêm dữ kiện, Lưu; chọn Đánh dấu mâu thuẫn ở trường chưa có giá trị / cùng giá trị; ghi chú không kèm dữ kiện; Ngày ghi nhận ngày mai | Ghi chú trống: "Mỗi dữ kiện phải gắn với một ghi chú có nội dung: nhập ghi chú."; mâu thuẫn không hợp lệ: "Không đánh dấu mâu thuẫn được: … Hãy dùng "Cập nhật"."; chỉ ghi chú: "Chỉ thêm ghi chú, không tạo phiên bản KYC."; ngày mai: báo lỗi ngày sau hôm nay. Chọn trường mà chưa bấm Thêm dữ kiện rồi Lưu → nhắc "Dữ kiện đang nhập chưa được thêm…" | | |
| NT-HS-11 | Dòng thời gian | Xem thẻ **Dòng thời gian** của một KH nhiều lịch | Mới nhất ở trên. "Lịch hẹn lần n": ngày giờ · trạng thái, Trigger, việc tiếp theo, người phối hợp ("+ TL, IS"), **Hẹn tiếp →**; chuyển nhóm "N3 → N2" ghi "tạo KH" / "sau cuộc gặp" / "chuyển tay · không tính RF"; **Ghi chú KYC** (nút AI trích xuất), **Ghi chú hệ thống** (không có nút); "kyc vN" có nhãn "thay đổi quan trọng" khi có. Không có chữ "material" (ý 11). Ghi chú không có nút sửa / xóa | | |
| NT-HS-12 | Lịch hẹn của KH | Xem thẻ **Lịch hẹn** | Mọi lịch của KH (cả lịch Dời lịch, Hủy); lịch hôm nay / đã qua có **Hẹn tiếp**, lịch tương lai không có; ghi chú dài cắt một dòng; câu ""Hẹn tiếp" = Tạo lịch hẹn tiếp theo…". KH không có lịch: "KH chưa có lịch hẹn." | | |
| NT-HS-13 | 8a · HĐ nộp | KH chưa có HĐ (thẻ Hợp đồng "Chưa có HĐ. Khi KH đóng phí…") → **+ Hợp đồng**: Ngày nộp hôm nay, FYP `250tr`; **Lưu HĐ** | Hộp "Hợp đồng mới · đã nộp" · "<tên> · K-xxxx"; RE · HĐ tính cho RE này mặc định RE của KH; FYP đọc "250.000.000 ₫ (250 tr)"; có dòng "Case size dự kiến ở cuộc gặp gần nhất: … (chỉ để tham khảo, không tự điền)" khi có. Sau khi lưu: HĐ "Đã nộp", thẻ Kanban có "1 HĐ"; Tổng quan (Lọc) HĐ nộp +1, Case size +250 tr | | |
| NT-HS-14 | 8b · Phát hành | HĐ của NT-HS-13 → **Phát hành**: ngày hôm nay | Hộp "Phát hành HĐ" · "<tên> · nộp dd/mm/yyyy · FYP nộp 250 tr"; ngày đọc "… · cùng ngày nộp" (hoặc "· n ngày sau khi nộp"); FYP phát hành mặc định = FYP nộp. Sau khi lưu: "Đã phát hành"; HĐ phát hành +1, Doanh số +250 tr, Tỉ lệ chốt tính lại | | |
| NT-HS-15 | 8b · nộp và phát hành khác tháng | Một HĐ Đã nộp của tháng trước (seed) → Phát hành ngày trong tháng này; xem Tổng quan tháng trước và tháng này | Hộp ghi "HĐ nộp tháng mm vẫn tính nộp vào tháng mm; phát hành tính vào tháng …". HĐ nộp / Case size vẫn ở tháng nộp; HĐ phát hành / Doanh số ở tháng phát hành | | |
| NT-HS-16 | 8c · lỗi HĐ | Phát hành: ngày trước ngày nộp; FYP `0`; `-50tr`; `năm trăm`; FYP `200 tỷ`; ngày mai | Trước ngày nộp: "dd/mm/yyyy trước ngày nộp dd/mm/yyyy."; 0: "FYP phải lớn hơn 0."; âm: "Số tiền không được âm."; chữ: "Gõ số tiền như 800tr, 1,2 tỷ hoặc 500.000.000."; quá 100 tỷ: "Số tiền tối đa 100 tỷ đồng."; ngày mai: báo lỗi ngày sau hôm nay. Không lưu | | |
| NT-HS-17 | 8d · Sửa HĐ | HĐ đã phát hành → **Sửa**: FYP phát hành giảm 14,5 tr (vd. 250tr → `235,5tr`); **Lưu** | "Sửa HĐ · <tên>" · "Đã phát hành dd/mm/yyyy"; FYP đọc "235.500.000 ₫ (235,5 tr) · khác FYP nộp −14,5 tr"; khung "Ảnh hưởng chỉ số": "FYP phát hành tháng mm/yyyy của RE … giảm 14,5 tr"; RE không đổi được. Sau khi lưu: Doanh số tháng đó giảm 14,5 tr | | |
| NT-HS-18 | Xóa HĐ | Sửa HĐ → **Xóa HĐ…** → **Xóa HĐ** | Hộp "Xóa HĐ nộp dd/mm/yyyy" · "<tên> · FYP nộp …": "HĐ không còn tính vào FYP nộp / phát hành của RE; nhóm của KH không đổi." + "Xóa mềm: HĐ vẫn nằm trong dữ liệu (D4), khôi phục ở Cài đặt → Thùng rác." Sau khi xóa: HĐ không còn trên thẻ và chỉ số; nhóm KH giữ nguyên | | HĐ này dùng lại ở Thùng rác (phần 2) |

## 6. KYC Intelligence (`NT-AI`)

Provider **Mock** trừ khi cột Ghi chú nói khác. Mock trả câu mẫu cố định trong tích tắc nên các trạng thái "đang chạy", "đang hủy", lỗi gọi mạng chỉ thấy được với OpenCode.

| Mã | Màn / mockup | Thao tác | Kết quả mong đợi | Đạt / Lỗi | Ghi chú |
|---|---|---|---|---|---|
| NT-AI-01 | 2a, 4d · chưa phân tích | Hồ sơ một KH `PAIN_POINT_ANALYSIS` chưa có phân tích → thẻ **KYC Intelligence** | Badge cổng; nút **Phân tích bằng ChatGPT web** (phụ) đứng trước **Phân tích** (chính); "Chưa có phân tích AI cho KH này."; dòng "Phân tích: Mock trả câu mẫu cố định từ n dữ kiện, không gọi AI (đổi ở Cài đặt → AI)." + dòng ChatGPT web + "Không gửi tên, mã KH, ghi chú." n = số dữ kiện hiệu lực ở thẻ Dữ kiện KYC | | |
| NT-AI-02 | 2b · cổng mâu thuẫn | KH `CONFLICT_RESOLUTION` (vd. KH của NT-HS-07 trước khi giải quyết) | Hai nút tắt; "Giải quyết mâu thuẫn ở <trường> trước khi phân tích."; kết quả cũ (nếu có) hiện mờ, không có Phân tích lại. Không có câu hỏi do AI sinh | | |
| NT-AI-03 | 2c · cổng thiếu | KH `KYC_INSUFFICIENT` | Hai nút tắt; "Cần chăm sóc, KYC thêm thông tin khách hàng. Còn thiếu: … — câu hỏi gợi ý ở thẻ Dữ kiện KYC." + **Xem ở Dữ kiện KYC →** (cuộn tới thẻ). Lịch sử phân tích không có dòng nào cho cổng chặn | | |
| NT-AI-04 | 2g · Mock analysis | KH của NT-AI-01 → **Phân tích** | `CURRENT` + badge **Mock**; chip "kyc vN · analysis@… · Mock · dd/mm hh:mm"; "Kết quả Mock: câu mẫu cố định để thử app, không phải phân tích AI."; 4 khối: **Behavioral Hypotheses** ("giả thuyết, cần kiểm chứng"), **Needs · Pain points · Opportunity Themes**, **Discovery Strategy**, **Next Best Actions**. Mỗi ý "Bằng chứng: F…" + "Mức bằng chứng: … · n dữ kiện, mới nhất dd/mm/yyyy" với 1 → thấp, 2 → trung bình, ≥ 3 → cao (hạ một bậc khi mọi dữ kiện đã hơn một năm). Lịch sử thêm một dòng CURRENT | | |
| NT-AI-05 | 2g · discovery | KH `PROFILE_DISCOVERY` → Phân tích | Chip "… · discovery@… · Mock …"; chỉ 3 khối (không có Needs · Pain points · Opportunity Themes); "giả thuyết ban đầu"; ý hỏi về hạng mục thiếu ghi "Hạng mục còn thiếu: …" | | |
| NT-AI-06 | 3a · mã F | Ở kết quả NT-AI-04, bấm một mã F trong "Bằng chứng" | Trang cuộn tới dữ kiện đó ở thẻ Dữ kiện KYC, viền vàng khoảng 2 giây | | |
| NT-AI-07 | 2h · STALE trường cốt lõi | KH của NT-AI-04: + Ghi chú KYC đổi một trường cốt lõi (Cập nhật); quay lại thẻ KYC Intelligence | Bản đang hiện thành `STALE`, mờ, lời nhắc "KYC đã đổi ở trường cốt lõi từ dd/mm — nên phân tích lại." (dd/mm = ngày ghi nhận của ghi chú). App không tự phân tích lại. Mã F của dữ kiện vừa bị thay: bấm → "F… không còn hiệu lực." (khi dòng giá trị cũ không hiện) | | |
| NT-AI-08 | 2h · STALE thay đổi nhỏ | **Phân tích lại**; rồi ghi chú KYC đổi một trường phụ, không đánh dấu thay đổi quan trọng | Phân tích lại → CURRENT mới. Sau ghi chú: STALE với "KYC có thay đổi nhỏ từ dd/mm." (hai lời nhắc không hiện cùng lúc) | | |
| NT-AI-09 | 2j · Lịch sử | Xem bảng **Lịch sử phân tích** của KH NT-AI-08; bấm một dòng STALE cũ; rồi **← Về bản mới nhất** | Cột Ngày, KYC (vN), Prompt, Provider / model (badge Mock), Trạng thái; mới nhất ở trên. Bấm dòng cũ: dải "Đang xem lần … · kyc vN" + nút "← Về bản mới nhất", nội dung dòng đó hiện mờ ở chỗ bản mới nhất | | |
| NT-AI-10 | 4e · phiên ChatGPT web | KH `PAIN_POINT_ANALYSIS` → **Phân tích bằng ChatGPT web**; dán clipboard vào Notepad | Trình duyệt mở chatgpt.com. Panel: "Đã copy tin nhắn và mở ChatGPT — dán tin nhắn vào ChatGPT, chờ trả lời, bấm copy câu trả lời rồi dán vào đây."; chip "kyc vN · analysis@…+web@1 · chụp dd/mm hh:mm", "Lần thử 1 / 2"; khung **Dán kết quả** trống → **Kiểm tra và lưu** tắt; **Copy lại**, **Mở lại ChatGPT**, **Hủy**. Tin nhắn trong Notepad có dữ kiện mã F, **không** có tên, mã KH. Nút Phân tích / AI trích xuất của KH này tắt; KH khác vẫn bấm được | | |
| NT-AI-11 | 4h · lỗi khung dán | Trong phiên NT-AI-10: dán lại chính tin nhắn của app; rồi dán chuỗi > 20.000 ký tự; rồi chỉ dấu cách | Tin nhắn của app: "Đây là tin nhắn của app — hãy copy câu trả lời của ChatGPT."; > 20.000: "Câu trả lời dài quá 20.000 ký tự — …"; cả hai không tính lần thử (vẫn "Lần thử 1 / 2"). Chỉ dấu cách: nút tắt, không báo gì. Chữ dán hiện thường, không thành HTML | | |
| NT-AI-12 | 4g · lần 1 không đạt | Dán chữ thường (không phải JSON), **Kiểm tra và lưu** | "Câu trả lời chưa đạt — còn 1 lần thử" + "V1 · Không có khối JSON hợp lệ"; **Copy yêu cầu sửa** là nút chính; khung dán trống lại, "Lần thử 2 / 2" | | |
| NT-AI-13 | 2i, 2k · REJECTED | Tiếp NT-AI-12: dán chữ thường lần nữa, Kiểm tra và lưu; bấm **Xem chi tiết**; bấm dòng REJECTED ở lịch sử | Phiên đóng; panel ghi "Lần phân tích dd/mm bị loại: …" và vẫn hiện bản đạt gần nhất bên dưới. Hộp "Lần phân tích … bị loại": số lần thử, lỗi của từng lần (mã, vị trí, chi tiết), không có output thô, không có số token (ChatGPT web); **Đóng**. Lịch sử có dòng REJECTED provider "ChatGPT web"; bấm dòng mở cùng hộp | | |
| NT-AI-14 | 4e · Hủy | Mở phiên ChatGPT web mới → **Hủy**; mở lại rồi rời Hồ sơ KH | Không lưu gì, lịch sử không thêm dòng; nút AI của KH bật lại | | |
| NT-AI-15 | 4i · kết quả ChatGPT web | Phiên ChatGPT web: dán tin nhắn vào ChatGPT, copy câu trả lời, dán về app, Kiểm tra và lưu | `CURRENT` + badge **ChatGPT web**; chip "kyc vN · analysis@…+web@1 · ChatGPT web · dd/mm hh:mm"; lịch sử provider "ChatGPT web", không ghi tên model ChatGPT; bản trước thành STALE | | Cần tài khoản ChatGPT |
| NT-AI-16 | 3b · nút AI trích xuất | Dòng thời gian của một KH có ghi chú KYC dài, ghi chú ngắn, ghi chú hệ thống | **AI trích xuất** dưới mỗi ghi chú KYC do RE ghi; ghi chú < 20 ký tự: nút tắt, "Ghi chú quá ngắn"; ghi chú hệ thống: không có nút | | |
| NT-AI-17 | 3d · đề xuất | KH của NT-KH-06 (chưa có dữ kiện Gia đình): thêm ghi chú KYC "Khách đã kết hôn, có 2 con nhỏ" (không thêm dữ kiện); bấm **AI trích xuất** dưới ghi chú đó | Khung **Đề xuất của AI** ngay dưới ghi chú: mỗi dòng "AI đề xuất: <trường>: <giá trị> ("<đoạn trích>")" + **Xác nhận** / **Bỏ**; "Đề xuất không lưu — rời màn là mất." Mock đề xuất Tình trạng hôn nhân "Đã kết hôn" và Số con "2" | | Mock chỉ nhận "<n> con", "đã kết hôn", "độc thân" |
| NT-AI-18 | 3f · xác nhận | Tiếp NT-AI-17: **Xác nhận** đề xuất Số con, giữ giá trị 2, **Xác nhận dữ kiện**; **Bỏ** đề xuất còn lại; rồi bấm **AI trích xuất** lần nữa trên cùng ghi chú | Hộp "+ Dữ kiện · Số con" · "Từ ghi chú dd/mm/yyyy · AI đề xuất"; "AI trích từ ghi chú:" + đoạn trích; ô Giá trị sửa được ("Sửa được trước khi lưu."); trường đã có giá trị thì có Cập nhật / Đánh dấu mâu thuẫn. Sau khi lưu: Số con 2 ở thẻ Dữ kiện KYC, gắn ghi chú nguồn, phiên bản KYC mới. Bỏ → đề xuất biến mất, không ghi gì. Lần trích xuất thứ hai: chỉ còn đề xuất Tình trạng hôn nhân, kèm dòng "1 đề xuất trùng dữ kiện đang có đã ẩn." | | |
| NT-AI-19 | 3e · không có đề xuất | AI trích xuất trên một ghi chú ≥ 20 ký tự không có mẫu nào (vd. "Khách hẹn gọi lại vào tuần sau nhé") | "AI không tìm thấy dữ kiện mới trong ghi chú này." + **Đóng** | | |
| NT-AI-20 | 2 · mâu thuẫn phụ | Phân tích một KH có Mâu thuẫn phụ | Thẻ ghi "Mâu thuẫn phụ ở "<trường>" (…) — phân tích vẫn chạy, cần RE làm rõ." | | |
| NT-AI-21 | 2d, 2e · đang chạy, Hủy | Provider OpenCode: **Phân tích** rồi **Hủy** ngay | "Đang phân tích… · <model> · tối đa 2 phút mỗi lần thử" + Hủy; bản cũ mờ. Sau Hủy: "Đang hủy… · chờ yêu cầu đang chạy kết thúc (tối đa 2 phút) rồi mới gọi AI được tiếp"; khi xong, panel về đúng như trước khi bấm, không lưu dòng nào | | OpenCode, cần key |
| NT-AI-22 | P5 · một yêu cầu AI | OpenCode: Phân tích KH A; trong lúc chạy mở hồ sơ KH B, rồi Cài đặt → AI | Ở KH B mọi nút AI tắt, dòng "Đang có một yêu cầu AI khác — chờ xong rồi thử lại."; Kiểm tra kết nối cũng không chạy được | | OpenCode, cần key |
| NT-AI-23 | 2f · lỗi | OpenCode: Cài đặt → AI xóa key → Phân tích; nhập key sai → Phân tích; tắt mạng → Phân tích | Lần lượt "Chưa có API key OpenCode — nhập ở Cài đặt → AI", "Key không hợp lệ hoặc hết hạn…", "Không kết nối được OpenCode", mỗi câu kèm **Thử lại**; không lưu gì; bản cũ vẫn hiện; không câu nào chứa key | | OpenCode; nhập lại key thật sau khi thử |
| NT-AI-24 | `customer.html` · Thông tin tham khảo | OpenCode / ChatGPT web: đọc các kết quả đạt có khối **Thông tin tham khảo — không phải kết luận** | Mỗi dòng bắt đầu "Tâm lý học:" hoặc "Tử vi / huyền học:", có bằng chứng và mức như ý khác; khối nằm cuối | | Khi kết quả có khối này |
| NT-AI-25 | Giới hạn của AI (G5) | Đọc tay mọi kết quả đạt từ OpenCode / ChatGPT web trong lượt thử | Không có tên sản phẩm / hãng bảo hiểm, số %, "xác suất", "khả năng chốt"; nhãn tính cách (MBTI, DISC, cung hoàng đạo…) chỉ ở khối Thông tin tham khảo; không trích văn bản pháp lý (Điều, Luật, Nghị định, Thông tư) | | Lọt qua → Issue `risk:high` |

## Lệch mockup đã biết

Không mở Issue mới cho các điểm dưới (đã ghi ở `docs/state/review-notes.md` hoặc đã được mockup sau thay).

- **Mockup vòng 2 được mockup sau thay:** trạng thái "Hoãn" của `appointments.html` / `table-more.html` nay là "Dời lịch"; lịch tháng 3 màu thành 4 nhóm (`overview.html` §2); bộ chọn góc nhìn thay cây Team → RE ở cột trái và khối tóm tắt tháng / trigger / chuyển nhóm của `appointments.html` (sổ review, mục Lịch hẹn #156 / #158).
- **Hộp chuyển nhóm 5d:** dòng "Sau khi lưu: N2 → N3" không có "· hạ nhóm / lên nhóm" (sổ review, Khách hàng #141).
- **Hộp 6a / 6h:** nhóm trước → sau trong "Các lần hẹn trước" hiện bằng chữ, không bằng badge; hộp 6h có thêm "Các lần hẹn trước" (sổ review #163).
- **Dòng thời gian:** chưa hiện mã F; không có bộ lọc Tất cả / KYC / Lịch hẹn như `customer.html` (sổ review #462).

**Owner xác nhận ở lượt L1** (chưa có ghi chép quyết định): `customers.html` (vòng 2) có ô tìm "Ctrl K", bộ lọc Phạm vi / RE / KYC / "Đã có HĐ", hàng kỳ, ô Sắp xếp, dòng "Độ phủ KYC", nhãn KYC / AI và ngày hẹn trên thẻ, dòng "+n vào · lên N3 trong tháng" dưới đầu cột, lý do đóng ở khung Tạm hoãn / Mất cơ hội — app và hướng dẫn sử dụng không có các phần này. Owner chọn: ghi vào danh sách này là lệch chấp nhận, hoặc mở Issue (ghi sau v1.0).
