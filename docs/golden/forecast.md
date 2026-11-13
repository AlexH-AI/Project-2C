# Golden examples — Forecast (G2 Phase 6, phần D)

Bảng đối chiếu cho Owner duyệt (T-423, #1242). **Trạng thái: chờ G2** (ô duyệt ở mục 5). Chưa có fixture: Issue code của phần D viết fixture khớp 1–1 (cùng mã `kh-…`, `fc-…`, `hd-…`, `F…`) và hàm tính. Sau khi Owner duyệt, bộ này là test bắt buộc của phần D; **không sửa để "cho xanh"**, muốn đổi phải qua Owner.

Nguồn: spec `docs/design/phase-6-phan-hoi-dung-thu.md` §6.1 (Owner chốt 10/11/2026), §6.2 (D-a … D-f, Owner chốt 11/11/2026), §8 gạch "Mục tiêu doanh số" (Owner 11/11/2026). Phần ghi **"đề xuất"** dưới đây là điều Claude đề xuất ở T-423, Owner duyệt ở G2 này.

Cách viết trong file: tiền ghi theo **triệu đồng (tr)** như `chi-so.md`; số viết theo ADR-0018 (`,` ngăn hàng nghìn, `.` cho phần lẻ: "1,420", "90.7%"); viết "RE" như các golden khác (Issue A5 đổi thành "RM" một lần). Trên giao diện, số hiện theo `docs/golden/so-va-tien-te.md` ("1.42 tỷ", "620 tr").

## Định nghĩa

| Thuật ngữ | Cách tính |
|---|---|
| **Lịch trong Forecast** | Cuộc hẹn chưa xóa, của KH chưa xóa, trạng thái **Đã lên lịch**, ngày **từ hôm nay trở đi**, ngày không phải Chủ Nhật, của KH **hiện** ở N3 / N2 / N1 (§6.1, D-c). Lịch của hôm nay vẫn tính dù giờ hẹn đã qua, tới khi ghi kết quả (như nhóm "Dự kiến" của `lich-hen.md`) |
| **Lịch mang số** của một KH (D-a) | Trong các lịch trong Forecast của KH đó **có case size dự kiến**: lịch có thời điểm nhập / sửa số **gần nhất**. Cùng thời điểm → lịch có ngày muộn hơn; cùng ngày → giờ muộn hơn (lịch không ghi giờ xếp trước); vẫn bằng → lịch tạo sau. Lịch thiếu case size không tham gia so |
| **Số của một KH** | Case size dự kiến của lịch mang số; nằm ở **ngày của lịch mang số** và tính cho **RE ghi trên lịch đó**. Mỗi KH một số, chọn trên mọi lịch trong Forecast của KH (mọi RE, mọi ngày từ hôm nay): **đề xuất**, câu G2-1 |
| **Forecast của một khoảng** | Σ số của các KH có lịch mang số nằm trong khoảng. Cộng thẳng, không nhân hệ số theo nhóm (D-d). Tách N1 / N2 / N3 theo nhóm **hiện tại** của KH |
| **Forecast tuần** | Khoảng từ hôm nay tới hết Thứ Bảy của tuần này. Hôm nay là Chủ Nhật → Thứ Hai tới Thứ Bảy của **tuần sau** (D-c) |
| **Forecast tháng** | Khoảng từ hôm nay tới ngày cuối tháng, không tính Chủ Nhật |
| **Lịch thiếu case size** (D-e) | Lịch trong Forecast chưa có case size dự kiến, nằm trong khoảng: đếm và liệt kê, không cộng. Điền xong thì tính ngay |
| **Lịch khác của KH đã tính** | Lịch trong Forecast có case size nhưng không phải lịch mang số, nằm trong khoảng: vẫn hiện (mờ), kèm ghi chú "tính theo số ở lịch …" |
| **Đã đạt** (D-b) | Doanh số (FYP phát hành − FYP hủy, golden B) từ ngày 1 của tháng tới hôm nay; có thể âm |
| **Về đích** | Đã đạt + Forecast tháng |
| **KPI tháng** | Mục tiêu Doanh số của một team cho một tháng, người dùng nhập. KPI của góc nhìn Toàn bộ = Σ KPI các team, **chỉ khi mọi team (chưa xóa) có KPI của tháng đó**; thiếu một team thì không có KPI toàn bộ (**đề xuất**). RE không có KPI |
| **% về đích** | Về đích ÷ KPI. **Còn thiếu** = KPI − về đích khi về đích < KPI; ngược lại là **vượt** = về đích − KPI |
| **Nhịp cần mỗi tuần** | (KPI − đã đạt) ÷ số tuần còn lại; số tuần còn lại = số ngày Thứ Hai → Thứ Bảy từ hôm nay tới cuối tháng ÷ 6. Làm tròn tới đồng. Không hiện khi đã đạt ≥ KPI, hoặc khi còn dưới 6 ngày (**đề xuất**) |

Góc nhìn: lịch tính cho RE ghi trên cuộc hẹn, team = team hiện tại của RE (như chuyển RF và đếm lịch hẹn). Số của một KH chọn **trước** khi chia theo góc nhìn, nên team = Σ RE và toàn bộ = Σ team.

## 1. Dữ liệu kịch bản D

**Kịch bản D là bộ dữ liệu riêng, mọi ngày ở năm 2029** (G01–G22 ở 2026–2027, golden B ở 2028, `lich-hen.md` ở 2027): không dòng nào của các golden đó đổi. Ngày không ghi năm là năm 2029.

**Hôm nay = Thứ Ba 13/03/2029** (trừ khi dòng kết quả ghi khác). Tháng 03/2029: ngày 1 là Thứ Năm; Chủ Nhật là 04, 11, 18, 25; ngày 31 là Thứ Bảy. Tuần này: Thứ Hai 12/03 → Thứ Bảy 17/03.

### Người và KPI

Người như `chi-so.md`: An, Bình (Team A); Chi, Dũng (Team B).

| Team | KPI tháng 03/2029 | KPI tháng 04/2029 |
|---|---|---|
| Team A | 1,800 | chưa đặt |
| Team B | 1,200 | chưa đặt |

### Khách hàng

RE phụ trách ghi ở cột RE; "Nhóm" là nhóm hiện tại.

| KH | RE | Nhóm | Ghi chú |
|---|---|---|---|
| KH 51 | An | N1 | |
| KH 52 | An | N2 | Hai lịch cùng tuần |
| KH 53 | Bình | N3 | Hai lịch, số nhập cùng lúc |
| KH 54 | Bình | N2 | Một lịch tuần này, một lịch tuần sau |
| KH 55 | Chi | N1 | Lịch thiếu case size |
| KH 56 | Chi | N2 | Lịch hôm nay |
| KH 57 | Chi | N3 | Một lịch có số, một lịch thiếu |
| KH 58 | Dũng | **N4** | Ngoài Forecast |
| KH 59 | Dũng | N1 | Lịch Đã gặp |
| KH 60 | Dũng | N2 | Lịch đã qua, chưa ghi kết quả |
| KH 61 | Dũng | N1 | Chuỗi dời + một lịch khác |
| KH 62 | Dũng | N3 | Lịch KH hủy |
| KH 63 | An | N2 | Lịch đã xóa |
| KH 64 | Bình | N1 | **KH đã xóa** |
| KH 65 | An | N1 | Lịch Chủ Nhật |
| KH 66 | Chi | N2 | Hai lịch với hai RE |
| KH 67 | Bình | N1 | Lịch tháng sau |
| KH 68 | Chi | N1 | |
| KH 69 | Dũng | N3 | |
| KH 70 | Chi | **Tạm hoãn** | Ngoài Forecast |
| KH 71 | An | N1 | Lịch 30/04 |
| KH 72 | An | N2 | Lịch 02/05 |
| KH 81 – KH 86 | (theo HĐ) | N1 | Chỉ mang HĐ, không có lịch |

### Lịch hẹn

"ĐLL" = Đã lên lịch. "Nhập số lúc" = thời điểm nhập / sửa case size dự kiến gần nhất của lịch đó.

| Mã | KH | RE trên lịch | Ngày | Trạng thái | Case size dự kiến | Nhập số lúc | Ghi chú |
|---|---|---|---|---|---|---|---|
| `fc-01` | KH 51 | An | Thứ Tư 14/03 | ĐLL | 200 | 01/03 09:00 | |
| `fc-02` | KH 52 | An | Thứ Năm 15/03 | ĐLL | 150 | 10/03 14:00 | Nhập sau `fc-03` → mang số, dù ngày sớm hơn |
| `fc-03` | KH 52 | An | Thứ Bảy 17/03 | ĐLL | 100 | 02/03 10:00 | |
| `fc-04` | KH 53 | Bình | Thứ Năm 15/03 | ĐLL | 80 | 05/03 08:00 | |
| `fc-05` | KH 53 | Bình | Thứ Sáu 16/03 | ĐLL | 120 | 05/03 08:00 | Cùng lúc với `fc-04` → ngày muộn hơn mang số |
| `fc-06` | KH 54 | Bình | Thứ Tư 14/03 | ĐLL | 200 | 01/03 11:00 | |
| `fc-07` | KH 54 | Bình | Thứ Ba 20/03 | ĐLL | 250 | 08/03 16:00 | Nhập sau `fc-06` → mang số, ở tuần sau |
| `fc-08` | KH 55 | Chi | Thứ Sáu 16/03 | ĐLL | — | — | Thiếu case size |
| `fc-09` | KH 56 | Chi | Thứ Ba 13/03, 09:00 | ĐLL | 90 | 06/03 09:00 | Hôm nay, giờ đã qua, chưa ghi kết quả |
| `fc-10` | KH 57 | Chi | Thứ Bảy 17/03 | ĐLL | 60 | 07/03 09:00 | |
| `fc-11` | KH 57 | Chi | Thứ Hai 19/03 | ĐLL | — | — | Thiếu case size; không tham gia so với `fc-10` |
| `fc-12` | KH 58 | Dũng | Thứ Năm 15/03 | ĐLL | 500 | 05/03 09:00 | KH ở N4 |
| `fc-13` | KH 59 | Dũng | Thứ Hai 12/03 | Đã gặp | 400 | 12/03 17:00 | Số ghi ở kết quả cuộc gặp |
| `fc-14` | KH 60 | Dũng | Thứ Hai 12/03 | ĐLL | 70 | 02/03 09:00 | Ngày đã qua (nhóm "Chưa ghi kết quả") |
| `fc-15` | KH 61 | Dũng | Thứ Tư 14/03 | Dời lịch | 110 | 04/03 10:00 | Ngày 09/03 dời sang `fc-16` |
| `fc-16` | KH 61 | Dũng | Thứ Tư 21/03 | ĐLL | 110 | 04/03 10:00 | Dời từ `fc-15`: mang cả số lẫn thời điểm (**đề xuất**) |
| `fc-17` | KH 62 | Dũng | Thứ Sáu 16/03 | KH hủy | 50 | 03/03 09:00 | |
| `fc-18` | KH 63 | An | Thứ Năm 15/03 | ĐLL, **đã xóa** | 300 | 03/03 09:00 | |
| `fc-19` | KH 64 | Bình | Thứ Sáu 16/03 | ĐLL | 400 | 03/03 09:00 | KH đã xóa |
| `fc-20` | KH 65 | An | **Chủ Nhật** 18/03 | ĐLL | 250 | 08/03 09:00 | |
| `fc-21` | KH 66 | Chi | Thứ Sáu 23/03 | ĐLL | 180 | 03/03 09:00 | |
| `fc-22` | KH 66 | **An** | Thứ Ba 27/03 | ĐLL | 220 | 09/03 09:00 | RE An đi gặp thay; nhập sau `fc-21` → mang số |
| `fc-23` | KH 67 | Bình | Thứ Hai 02/04 | ĐLL | 300 | 10/03 09:00 | Tháng sau |
| `fc-24` | KH 68 | Chi | Thứ Sáu 30/03 | ĐLL | 160 | 11/03 09:00 | |
| `fc-25` | KH 69 | Dũng | Thứ Bảy 31/03 | ĐLL | 40 | 11/03 10:00 | Ngày cuối tháng |
| `fc-26` | KH 61 | Dũng | Thứ Tư 28/03 | ĐLL | 130 | 06/03 15:00 | Nhập sau số của `fc-16` (04/03) → mang số |
| `fc-27` | KH 70 | Chi | Thứ Ba 20/03 | ĐLL | 90 | 05/03 09:00 | KH Tạm hoãn |
| `fc-28` | KH 71 | An | Thứ Hai 30/04 | ĐLL | 100 | 12/03 09:00 | |
| `fc-29` | KH 72 | An | Thứ Tư 02/05 | ĐLL | 200 | 12/03 09:30 | Tuần 30/04 – 05/05 vắt qua hai tháng |

### Hợp đồng (để tính "đã đạt")

FYP nộp bằng FYP phát hành. Từ 14/03/2029 trở đi không có HĐ phát hành hay hủy nào.

| Mã | KH | RE | Ngày nộp | Ngày phát hành | FYP phát hành | Ngày hủy |
|---|---|---|---|---|---|---|
| `hd-31` | KH 81 | An | 01/03 | 02/03 | 500 | — |
| `hd-32` | KH 82 | An | 05/03 | 06/03 | 300 | — |
| `hd-33` | KH 83 | Bình | 07/03 | 08/03 | 250 | — |
| `hd-34` | KH 84 | Bình | 12/02 | 15/02 | 100 | 09/03 |
| `hd-35` | KH 85 | Chi | 02/03 | 05/03 | 430 | — |
| `hd-36` | KH 86 | Dũng | 16/02 | 20/02 | 80 | 07/03 |

## 2. Kết quả mong đợi

### 2.1 Phần dự kiến

Cột: **Dự kiến** = Forecast của khoảng (tr) · **N1 / N2 / N3** = phần của từng nhóm · **Mang số** = số lịch mang số trong khoảng (= số KH được tính) · **Thiếu** = lịch thiếu case size · **Khác** = lịch khác của KH đã tính.

| Mã | Hôm nay | Khoảng | Góc nhìn | Dự kiến | N1 | N2 | N3 | Mang số | Thiếu | Khác | Kiểm điều gì |
|---|---|---|---|---|---|---|---|---|---|---|---|
| F01 | 13/03 | Tuần 13/03 – 17/03 | Toàn bộ | 620 | 200 | 240 | 180 | 5 | 1 | 3 | Thứ Hai 12/03 đã qua không tính; KH 52, KH 53 tính một lần; KH 54 có số nằm ở tuần sau |
| F02 | 13/03 | Tháng 13/03 – 31/03 | Toàn bộ | 1,420 | 490 | 710 | 220 | 10 | 2 | 5 | Không tính Chủ Nhật 18/03 (`fc-20`), lịch 02/04 (`fc-23`), N4, Tạm hoãn, Đã gặp, Dời lịch, KH hủy, lịch đã xóa, KH đã xóa |
| F03 | 13/03 | Tuần | RE An | 350 | 200 | 150 | 0 | 2 | 0 | 1 | KH 52: 150 của `fc-02` (nhập 10/03), không phải 100 của lịch muộn hơn `fc-03` |
| F04 | 13/03 | Tuần | RE Bình | 120 | 0 | 0 | 120 | 1 | 0 | 2 | KH 53: hai số nhập cùng lúc → `fc-05` (ngày muộn hơn) 120; `fc-06` của KH 54 hiện mờ |
| F05 | 13/03 | Tuần | RE Chi | 150 | 0 | 90 | 60 | 2 | 1 | 0 | `fc-09` hôm nay vẫn tính; `fc-08` thiếu: đếm, không cộng |
| F06 | 13/03 | Tuần | RE Dũng | 0 | 0 | 0 | 0 | 0 | 0 | 0 | `fc-12` N4, `fc-13` Đã gặp, `fc-14` đã qua, `fc-15` Dời lịch, `fc-17` KH hủy: không lịch nào tính |
| F07 | 13/03 | Tuần | Team A | 470 | 200 | 150 | 120 | 3 | 0 | 3 | F03 + F04 |
| F08 | 13/03 | Tuần | Team B | 150 | 0 | 90 | 60 | 2 | 1 | 0 | F05 + F06; F07 + F08 = F01 |
| F09 | 13/03 | Tháng | RE An | 570 | 200 | 370 | 0 | 3 | 0 | 1 | KH 66 (RE phụ trách là Chi): 220 của `fc-22` tính cho An, RE ghi trên lịch mang số |
| F10 | 13/03 | Tháng | RE Bình | 370 | 0 | 250 | 120 | 2 | 0 | 2 | KH 54: 250 ở 20/03 |
| F11 | 13/03 | Tháng | RE Chi | 310 | 160 | 90 | 60 | 3 | 2 | 1 | KH 66 không tính cho Chi (`fc-21` là lịch khác); KH 57: 60, `fc-11` thiếu |
| F12 | 13/03 | Tháng | RE Dũng | 170 | 130 | 0 | 40 | 2 | 0 | 1 | KH 61: 130 của `fc-26` (nhập 06/03) thắng 110 của `fc-16` (thời điểm 04/03 mang từ `fc-15`) |
| F13 | 13/03 | Tháng | Team A | 940 | 200 | 620 | 120 | 5 | 0 | 3 | F09 + F10 |
| F14 | 13/03 | Tháng | Team B | 480 | 290 | 90 | 100 | 5 | 2 | 2 | F11 + F12; F13 + F14 = F02 |
| F15 | 13/03 | Ngày 14/03 | Toàn bộ | 200 | 200 | 0 | 0 | 1 | 0 | 1 | Danh sách của ngày: `fc-01` (200), `fc-06` (mờ, "tính theo số ở lịch 20/03"); `fc-15` Dời lịch không hiện |
| F16 | 13/03 | Ngày 13/03 | Toàn bộ | 90 | 0 | 90 | 0 | 1 | 0 | 0 | Lịch của hôm nay tính theo ngày, không theo giờ |
| F17 | 13/03, **điền `fc-08` = 300** lúc 13/03 10:00 | Tuần | Toàn bộ | 920 | 500 | 240 | 180 | 6 | 0 | 3 | Điền xong cộng ngay |
| F18 | như F17 | Tháng | Toàn bộ | 1,720 | 790 | 710 | 220 | 11 | 1 | 5 | `fc-11` vẫn thiếu |
| F19 | 13/03, **nhập 0 cho `fc-08`** | Tuần | Toàn bộ | 620 | 200 | 240 | 180 | 5 | 1 | 3 | Số 0 bị từ chối (luật phí hiện có: lớn hơn 0 hoặc để trống); `fc-08` vẫn là lịch thiếu (**đề xuất**, câu G2-4) |
| F20 | 13/03, **sửa `fc-03` thành 180** lúc 13/03 11:00 | Tuần | Toàn bộ | 650 | 200 | 270 | 180 | 5 | 1 | 3 | Sửa số làm `fc-03` thành lịch mang số: 180 chuyển về 17/03, `fc-02` thành lịch khác |
| F21 | 13/03, **`fc-20` đổi ngày sang Thứ Bảy 17/03** | Tuần | Toàn bộ | 870 | 450 | 240 | 180 | 6 | 1 | 3 | Buổi hẹn Chủ Nhật nhập ở Thứ Bảy thì tính (D-c) |
| F22 | **Thứ Bảy 17/03** | Tuần 17/03 | Toàn bộ | 160 | 0 | 100 | 60 | 2 | 0 | 0 | Tuần chỉ còn một ngày; `fc-02` đã qua nên KH 52 lấy 100 của `fc-03` |
| F23 | Thứ Bảy 17/03 | Tháng 17/03 – 31/03 | Toàn bộ | 960 | 290 | 570 | 100 | 7 | 1 | 2 | |
| F24 | **Chủ Nhật 18/03** | Tuần 19/03 – 24/03 | Toàn bộ | 250 | 0 | 250 | 0 | 1 | 1 | 2 | Hôm nay Chủ Nhật → tuần sau; `fc-20` (hôm nay) không tính |
| F25 | Chủ Nhật 18/03 | Tháng 18/03 – 31/03 | Toàn bộ | 800 | 290 | 470 | 40 | 5 | 1 | 2 | KH 57 chỉ còn `fc-11` (thiếu) nên không tính |
| F26 | **Thứ Ba 27/03** | Tuần 27/03 – 31/03 | Toàn bộ | 550 | 290 | 220 | 40 | 4 | 0 | 0 | Tuần cuối tháng: Forecast tuần = Forecast tháng |
| F27 | **Thứ Hai 30/04** | Tuần 30/04 – 05/05 | Toàn bộ | 300 | 100 | 200 | 0 | 2 | 0 | 0 | Tuần vắt qua hai tháng: tính cả 02/05 |
| F28 | Thứ Hai 30/04 | Tháng 30/04 | Toàn bộ | 100 | 100 | 0 | 0 | 1 | 0 | 0 | Tháng chỉ tới 30/04: Forecast tuần lớn hơn Forecast tháng |

### 2.2 Đã đạt, về đích, KPI

Cột tiền theo tr. "—" ở cột KPI = không có KPI.

| Mã | Hôm nay | Góc nhìn | Đã đạt | Dự kiến tháng | Về đích | KPI | % về đích | Còn thiếu / vượt | Nhịp cần mỗi tuần | Kiểm điều gì |
|---|---|---|---|---|---|---|---|---|---|---|
| F29 | 13/03 | Toàn bộ | 1,300 | 1,420 | 2,720 | 3,000 | 90.7% | thiếu 280 | 600 | KPI toàn bộ = 1,800 + 1,200; 17 ngày còn lại = 17/6 tuần; 1,700 ÷ (17/6) = 600 |
| F30 | 13/03 | Team A | 950 | 940 | 1,890 | 1,800 | 105% | vượt 90 | 300 | Về đích vượt KPI nhưng đã đạt chưa tới: vẫn có nhịp (850 ÷ 17/6) |
| F31 | 13/03 | Team B | 350 | 480 | 830 | 1,200 | 69.2% | thiếu 370 | 300 | F30 + F31 = F29 ở mọi cột tiền |
| F32 | 13/03 | RE An | 800 | 570 | 1,370 | — | — | — | — | RE không có KPI |
| F33 | 13/03 | RE Dũng | −80 | 170 | 90 | — | — | — | — | Đã đạt âm (`hd-36` hủy 07/03, không phát hành gì trong tháng) |
| F34 | 13/03, **Team B chưa đặt KPI** | Toàn bộ | 1,300 | 1,420 | 2,720 | — | — | — | — | Thiếu KPI của một team → không có KPI toàn bộ, không cộng một phần (1,800) |
| F35 | 13/03, **KPI Team A = 900** | Team A | 950 | 940 | 1,890 | 900 | 210% | vượt 990 | không hiện | Đã đạt ≥ KPI: không còn nhịp |
| F36 | như F35 | Toàn bộ | 1,300 | 1,420 | 2,720 | 2,100 | 129.5% | vượt 620 | 282,352,941 VNĐ | 800 ÷ (17/6) = 282.35… tr, làm tròn tới đồng |
| F37 | Thứ Bảy 17/03 | Toàn bộ | 1,300 | 960 | 2,260 | 3,000 | 75.3% | thiếu 740 | 784,615,385 VNĐ | 13 ngày còn lại = 13/6 tuần |
| F38 | Chủ Nhật 18/03 | Toàn bộ | 1,300 | 800 | 2,100 | 3,000 | 70% | thiếu 900 | 850 | 12 ngày còn lại = 2 tuần (Chủ Nhật hôm nay không tính) |
| F39 | Thứ Ba 27/03 | Toàn bộ | 1,300 | 550 | 1,850 | 3,000 | 61.7% | thiếu 1,150 | không hiện | Còn 5 ngày, chưa đủ một tuần |
| F40 | 13/03, **không có `hd-35`** | Team B | −80 | 480 | 400 | 1,200 | 33.3% | thiếu 800 | 451,764,706 VNĐ | Đã đạt âm: về đích và nhịp tính trên số thật (1,280 ÷ 17/6) |
| F41 | Thứ Hai 30/04 | Toàn bộ | 0 | 100 | 100 | — | — | — | — | Tháng 04/2029 chưa team nào có KPI: "chưa đặt KPI" |

## 3. Diễn giải vài dòng

- **Số của từng KH, hôm nay 13/03** (lịch trong Forecast: `fc-01` … `fc-11`, `fc-16`, `fc-21` … `fc-26`, `fc-28`, `fc-29`): KH 51 → 200 ở 14/03 (An). KH 52 → `fc-02` nhập 10/03 sau `fc-03` nhập 02/03 → 150 ở 15/03 (An). KH 53 → cùng 05/03 08:00, lấy ngày muộn hơn `fc-05` → 120 ở 16/03 (Bình). KH 54 → `fc-07` nhập 08/03 sau `fc-06` nhập 01/03 → 250 ở 20/03 (Bình). KH 55 → chỉ có `fc-08` thiếu → không có số. KH 56 → 90 ở 13/03 (Chi). KH 57 → 60 ở 17/03 (Chi). KH 61 → `fc-26` nhập 06/03 sau `fc-16` (04/03) → 130 ở 28/03 (Dũng). KH 66 → `fc-22` nhập 09/03 sau `fc-21` (03/03) → 220 ở 27/03 (An). KH 67 → 300 ở 02/04 (Bình). KH 68 → 160 ở 30/03 (Chi). KH 69 → 40 ở 31/03 (Dũng). KH 71 → 100 ở 30/04, KH 72 → 200 ở 02/05 (An).
- **F01 (tuần 13/03 – 17/03)**: theo ngày 13/03: 90 · 14/03: 200 · 15/03: 150 · 16/03: 120 · 17/03: 60 → 620. N1: KH 51 200. N2: KH 52 150 + KH 56 90 = 240. N3: KH 53 120 + KH 57 60 = 180. Mang số: `fc-01`, `fc-02`, `fc-05`, `fc-09`, `fc-10` → 5. Thiếu: `fc-08`. Khác: `fc-03`, `fc-04`, `fc-06`.
- **F02 (tháng)** = F01 + tuần 19/03 – 24/03 (KH 54: 250) + tuần 26/03 – 31/03 (220 + 130 + 160 + 40 = 550) = 620 + 250 + 550 = 1,420. N1: 200 + 130 + 160 = 490. N2: 150 + 90 + 250 + 220 = 710. N3: 120 + 60 + 40 = 220. Thiếu: `fc-08`, `fc-11`. Khác: `fc-03`, `fc-04`, `fc-06`, `fc-16`, `fc-21`.
- **Kiểm cộng**: tuần F03 + F04 + F05 + F06 = 350 + 120 + 150 + 0 = 620 = F01; tháng F09 + F10 + F11 + F12 = 570 + 370 + 310 + 170 = 1,420 = F02; Team A 570 + 370 = 940, Team B 310 + 170 = 480. KH 66 có lịch với hai RE ở hai team nhưng chỉ tính một lần (220, Team A): nếu chọn số riêng trong từng góc nhìn thì Chi có thêm 180 và toàn bộ lệch khỏi tổng các team.
- **Đã đạt (01/03 – 13/03)**: An `hd-31` 500 + `hd-32` 300 = 800. Bình `hd-33` 250 − `hd-34` hủy 100 = 150. Chi `hd-35` 430. Dũng − `hd-36` hủy 80 = −80. Team A 950, Team B 350, toàn bộ 1,300.
- **F29**: về đích 1,300 + 1,420 = 2,720; 2,720 ÷ 3,000 = 90.7%; còn thiếu 280. Ngày Thứ Hai → Thứ Bảy từ 13/03 tới 31/03: 13 – 17 (5), 19 – 24 (6), 26 – 31 (6) = 17 ngày = 17/6 tuần. Nhịp (3,000 − 1,300) ÷ (17/6) = 600. Nhịp của hai team cộng lại bằng nhịp toàn bộ: 300 + 300.
- **F22 – F23 (hôm nay Thứ Bảy 17/03)**: lịch trước 17/03 đã qua. KH 52 chỉ còn `fc-03` → 100 ở 17/03; KH 57 60 ở 17/03 → tuần 160. Tháng: 160 + 250 + 220 + 130 + 160 + 40 = 960.
- **F24 – F25 (hôm nay Chủ Nhật 18/03)**: tuần sau 19/03 – 24/03 chỉ có KH 54 mang số (250 ở 20/03); `fc-11` thiếu; `fc-16` (21/03) và `fc-21` (23/03) là lịch khác. Tháng: 250 + 220 + 130 + 160 + 40 = 800.
- **Golden khác không đổi**: ngày sớm nhất của kịch bản D là 12/02/2029 (nộp `hd-34`), nên mọi dòng G01–G41, A01–A13 và golden đếm KH theo nhóm giữ nguyên.

## 4. Mô hình dữ liệu (G2)

**Owner đã chốt** (10 – 11/11/2026, spec §6.1, §6.2, §8):

- Số tiền của Forecast là case size dự kiến của từng lịch hẹn, do người dùng nhập ở hộp đặt lịch, hộp dời lịch hay điền tại chỗ trong Forecast; app không dùng AI hay thuật toán để ước tính (D-e).
- Mỗi KH tính một lần, theo số nhập (hay sửa) gần nhất (D-a). Không nhân hệ số (D-d). Không tính Chủ Nhật (D-c).
- KPI tháng theo team, do người dùng nhập; KPI toàn bộ = tổng các team, không nhập riêng; chỉ theo tháng; không có KPI của RE.

**Claude đề xuất, chờ Owner duyệt G2** (code ở phần D):

1. **Case size dự kiến của lịch:** dùng lại cột có sẵn `appointments.expected_case_size` (`Appointment.expectedCaseSize`). Hôm nay cột này chỉ ghi khi ghi kết quả cuộc gặp; từ phần D, nhập được ngay khi đặt lịch, dời lịch, sửa lịch và điền tại chỗ trong Forecast. Khi ghi kết quả, ô "Case size dự kiến" của hộp kết quả mở sẵn số của lịch. Luật phí giữ nguyên: số nguyên đồng, lớn hơn 0, tối đa 100 tỷ, hoặc để trống (= thiếu); **không nhận số 0** (F19).
2. **Thời điểm nhập / sửa số:** cột mới `appointments.expected_case_size_at` (thời điểm ISO như `created_at`; trường `expectedCaseSizeAt: string | null`). Có khi và chỉ khi lịch có case size. Đổi khi và chỉ khi số đổi: từ trống sang có số, đổi số, hay xóa số (thời điểm thành trống); sửa ngày, giờ, ghi chú không làm đổi. Không dùng `updated_at`, vì cột đó đổi cả khi sửa giờ hẹn.
3. **Lịch có sẵn:** migration thêm cột; lịch đã có số (từ kết quả cuộc gặp) lấy thời điểm bằng `updated_at` của nó; lịch Đã lên lịch chưa có số là "lịch thiếu case size" (§6.1: Forecast đếm và chỉ ra để bổ sung). Dữ liệu giả lập sinh lại có số cho phần lớn lịch tương lai của KH N3 / N2 / N1, vài lịch để thiếu, không có lịch Chủ Nhật (D-c).
4. **Điền sẵn ở hộp đặt lịch:** số có thời điểm nhập gần nhất trong mọi cuộc hẹn chưa xóa của KH (mọi trạng thái); KH chưa có số nào thì ô trống. Đây là gợi ý: lưu lịch thì số trong ô (giữ hay sửa) được ghi cho lịch mới với thời điểm là lúc lưu.
5. **Dời lịch:** ô "Case size dự kiến" của hộp dời mở sẵn số của lịch đang dời. Giữ nguyên số → lịch mới mang **cả số lẫn thời điểm** của lịch cũ (dời lịch không phải một lần ước lượng mới; `fc-15` → `fc-16`, F12). Sửa số trong hộp dời → thời điểm là lúc dời. Lịch cũ (Dời lịch) giữ số của nó, không còn trong Forecast.
6. **KPI tháng:** bảng mới `team_targets` (`team_id`, `month` dạng `yyyy-mm`, `amount` số nguyên đồng, `created_at`, `updated_at`), mỗi team mỗi tháng nhiều nhất một dòng; kiểu `TeamTarget { teamId, month, amount }`. `amount` lớn hơn 0, tối đa 1,000 tỷ. Không có dòng = chưa đặt KPI; để trống ô rồi lưu = xóa dòng (xóa hẳn: KPI là một con số đặt, không phải bản ghi nghiệp vụ, không qua Thùng rác). Không có bảng hay cột cho KPI tuần, KPI của RE, KPI toàn bộ.
7. **KPI của từng tháng được giữ:** nhập KPI tháng 4 không làm đổi KPI tháng 3. Tháng mới chưa nhập thì "chưa đặt KPI"; ô nhập mở sẵn KPI của tháng liền trước làm gợi ý. Tháng đã qua vẫn có KPI của nó (câu G2-6).
8. **KPI toàn bộ** = Σ `amount` của mọi team chưa xóa trong tháng đó, chỉ khi mọi team chưa xóa (kể cả team chưa có RE) đều có dòng; team đã xóa không tính và không chặn (F34).
9. **Lệnh:** đặt lịch, dời lịch, sửa lịch nhận thêm case size; một lệnh đặt / đổi / xóa case size của một lịch Đã lên lịch (điền tại chỗ); một lệnh đặt / xóa KPI tháng của một team. Mọi lệnh ghi một transaction như các lệnh khác.
10. **Nhập backup:** `expected_case_size_at` có khi và chỉ khi `expected_case_size` có, và là thời điểm đọc được; `team_targets`: `team_id` trỏ tới một team có trong file, `month` đúng dạng trong miền năm 1900–2100, `amount` trong khoảng cho phép, không trùng (team, tháng). File backup cũ đi qua migration như ở mục 3.
11. **Xóa mềm:** lịch đã xóa và lịch của KH đã xóa không thuộc Forecast (F02); khôi phục thì giữ số và thời điểm. Xóa team không xóa KPI; Dọn sạch Thùng rác xóa hẳn team thì xóa các dòng KPI của team đó.
12. **Hàm tính** ở `packages/domain`, thuần, nhận "hôm nay" làm tham số (các biến thể F22 – F28, F37 – F39 đổi hôm nay). Số của một KH chọn trước khi chia theo góc nhìn (mục "Kiểm cộng").

**Ghi chú cho Issue code D (fixture):**

- Kịch bản D là một bộ dữ liệu riêng của fixture, như kịch bản B. Đồng hồ của test DB đặt ở từng "hôm nay" của bảng kết quả.
- `fc-18` và KH 64 đánh dấu đã xóa ngoài kiểu dữ liệu, như `hd-19` của golden B.
- F17, F19, F20, F21 đi qua lệnh (điền, nhập 0, sửa số, đổi ngày) rồi so; F34, F35, F36, F40 là biến thể của dữ liệu KPI / HĐ.
- Chuỗi `fc-15` → `fc-16` tạo bằng lệnh dời lịch với số giữ nguyên, để kiểm thời điểm được mang sang.

## 5. Owner duyệt — chờ G2

- [ ] Dữ liệu kịch bản D đúng ý (mục 1)
- [ ] Kết quả F01–F41 đúng (mục 2)
- [ ] Mô hình dữ liệu case size dự kiến và KPI tháng (mục 4)
