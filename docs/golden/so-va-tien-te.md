# Golden examples — Số, tiền tệ, ngày theo ngôn ngữ (G2)

> **Trạng thái: chờ Owner duyệt G2** (T-418, #1221). Mọi dòng dưới đây chờ duyệt. Dòng nào theo một điểm Claude đề xuất thì ghi số câu hỏi ở spec `docs/design/phase-6-phan-hoi-dung-thu.md` §11.3 (vd. "Q3"). Owner chọn khác thì dòng đó đổi trong PR này, trước khi duyệt.

Nguồn luật: ADR-0018 §3–§6. Sau khi Owner duyệt, bộ này thành fixture `packages/domain/src/golden/` (Issue G2 của spec §11.7, khớp 1–1 theo mã dòng) và là test bắt buộc của hàm định dạng / đọc trong `packages/domain`. **Không sửa để "cho xanh"**: muốn đổi phải qua Owner.

Quy ước đọc bảng:

- **Số lưu** là số nguyên theo đơn vị nhỏ nhất: đồng với VND, cent với tiền có cent. Đây là hợp đồng của các Issue code. `125050` USD = $1,250.50.
- Cột **Tiếng Việt** chỉ có với VND (tiếng Việt chỉ đi với VND). "—" = không áp dụng.
- Dấu kiểu Excel ở mọi ngôn ngữ: `,` ngăn hàng nghìn, `.` cho phần lẻ.
- Golden chỉ số (`chi-so.md`) giữ tiền theo triệu đồng; hai dòng dạng số tiếng Việt của nó đổi cùng PR code của dấu kiểu Excel.

## 1. Bảng tiền tệ

| Mã | Số lẻ | Ký hiệu | Vị trí | Trần phí (100 Billions đơn vị chính), số lưu | Số phí ở mức trần còn cộng chính xác |
|---|---|---|---|---|---|
| VND | 0 | VNĐ | sau số, cách một dấu cách | 100,000,000,000 | 90,071 |
| USD | 2 | $ | trước số, viết liền | 10,000,000,000,000 | 900 |
| EUR | 2 | € | trước số, viết liền | 10,000,000,000,000 | 900 |
| GBP | 2 | £ | trước số, viết liền | 10,000,000,000,000 | 900 |
| AUD | 2 | A$ (Q1) | trước số, viết liền | 10,000,000,000,000 | 900 |
| CAD | 2 | C$ (Q1) | trước số, viết liền | 10,000,000,000,000 | 900 |
| SGD | 2 | S$ (Q1) | trước số, viết liền | 10,000,000,000,000 | 900 |

Cột cuối = `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991) ÷ trần, bỏ phần lẻ. Quá số này thì phép cộng báo lỗi, không cộng sai.

## 2. Dạng đầy đủ

Ô số, bảng, hồ sơ, dòng đọc dưới ô nhập. Hai ngôn ngữ giống nhau.

| Mã | Số lưu | Tiền tệ | Kết quả | Ghi chú |
|---|---|---|---|---|
| F01 | `0` | VND | 0 VNĐ | số 0 |
| F02 | `999` | VND | 999 VNĐ | |
| F03 | `1000` | VND | 1,000 VNĐ | nhóm nghìn đầu tiên |
| F04 | `3000000` | VND | 3,000,000 VNĐ | ví dụ của Owner |
| F05 | `500000000` | VND | 500,000,000 VNĐ | hôm nay "500.000.000 ₫" |
| F06 | `1900000000` | VND | 1,900,000,000 VNĐ | |
| F07 | `100000000000` | VND | 100,000,000,000 VNĐ | trần phí VND |
| F08 | `-3000000` | VND | -3,000,000 VNĐ | số âm (Q4) |
| F09 | `0` | USD | $0.00 | số 0; luôn hai số lẻ (Q2) |
| F10 | `5` | USD | $0.05 | |
| F11 | `125050` | USD | $1,250.50 | |
| F12 | `125000` | USD | $1,250.00 | không bỏ ".00" (Q2) |
| F13 | `-125050` | USD | -$1,250.50 | dấu `-` trước ký hiệu (Q4) |
| F14 | `10000000000000` | USD | $100,000,000,000.00 | trần phí USD |
| F15 | `25000000` | EUR | €250,000.00 | |
| F16 | `9999` | GBP | £99.99 | |
| F17 | `125050` | AUD | A$1,250.50 | (Q1) |
| F18 | `125050` | CAD | C$1,250.50 | (Q1) |
| F19 | `125050` | SGD | S$1,250.50 | (Q1) |

## 3. Dạng gọn

Ô KPI, biểu đồ, cột hẹp. Các bậc: English K / Mil / Bil / T; tiếng Việt nghìn / tr / tỷ, không có bậc nghìn tỷ (Q3). K và T viết liền số; Mil, Bil, nghìn, tr, tỷ cách một dấu cách (Q5). Dưới 1,000 đơn vị chính thì hiện dạng đầy đủ. Tối đa hai số lẻ, bỏ số 0 cuối, làm tròn nửa xa số 0. Làm tròn chạm 1,000 của bậc thì lên bậc kế. VND không kèm chữ VNĐ; tiền có cent kèm ký hiệu trước.

| Mã | Số lưu | Tiền tệ | Tiếng Việt | English | Ghi chú |
|---|---|---|---|---|---|
| C01 | `0` | VND | 0 VNĐ | 0 VNĐ | số 0: dạng đầy đủ |
| C02 | `950` | VND | 950 VNĐ | 950 VNĐ | dưới 1,000: dạng đầy đủ |
| C03 | `999` | VND | 999 VNĐ | 999 VNĐ | sát ranh giới, dưới |
| C04 | `1000` | VND | 1 nghìn | 1K | bậc nghìn / K (Q3) |
| C05 | `750000` | VND | 750 nghìn | 750K | hôm nay "750.000 ₫" |
| C06 | `999994` | VND | 999.99 nghìn | 999.99K | sát ranh giới, chưa lên bậc |
| C07 | `999995` | VND | 1 tr | 1 Mil | làm tròn chạm 1,000 nghìn → lên bậc |
| C08 | `1000000` | VND | 1 tr | 1 Mil | |
| C09 | `1950000` | VND | 1.95 tr | 1.95 Mil | |
| C10 | `1955000` | VND | 1.96 tr | 1.96 Mil | làm tròn nửa lên |
| C11 | `500000000` | VND | 500 tr | 500 Mil | |
| C12 | `999994999` | VND | 999.99 tr | 999.99 Mil | sát ranh giới, chưa lên bậc |
| C13 | `999995000` | VND | 1 tỷ | 1 Bil | lên bậc tỷ / Bil |
| C14 | `1900000000` | VND | 1.9 tỷ | 1.9 Bil | ví dụ của Owner ("1.9 tỷ") |
| C15 | `1234567890` | VND | 1.23 tỷ | 1.23 Bil | cắt còn hai số lẻ |
| C16 | `100000000000` | VND | 100 tỷ | 100 Bil | trần phí |
| C17 | `999995000000` | VND | 1,000 tỷ | 1T | tổng; tiếng Việt không có bậc nghìn tỷ (Q3) |
| C18 | `1500000000000` | VND | 1,500 tỷ | 1.5T | tổng (hôm nay "1.500 tỷ") |
| C19 | `-1200000000` | VND | -1.2 tỷ | -1.2 Bil | số âm (Q4) |
| C20 | `0` | USD | — | $0.00 | số 0 |
| C21 | `95050` | USD | — | $950.50 | dưới 1,000: dạng đầy đủ |
| C22 | `99999` | USD | — | $999.99 | sát ranh giới, dưới |
| C23 | `100000` | USD | — | $1K | |
| C24 | `125050` | USD | — | $1.25K | |
| C25 | `25000000` | USD | — | $250K | |
| C26 | `99999500` | USD | — | $1 Mil | làm tròn chạm 1,000K → lên bậc |
| C27 | `120000000` | USD | — | $1.2 Mil | |
| C28 | `190000000000` | USD | — | $1.9 Bil | |
| C29 | `10000000000000` | USD | — | $100 Bil | trần phí |
| C30 | `250000000000000` | USD | — | $2.5T | tổng |
| C31 | `-125050` | USD | — | -$1.25K | số âm (Q4) |
| C32 | `25000000` | EUR | — | €250K | mẫu của Issue |
| C33 | `120000000` | GBP | — | £1.2 Mil | |

## 4. Chênh lệch (so kỳ trước)

Dạng gọn, có dấu "−" (U+2212) hoặc "+"; 0 thì không dấu.

| Mã | Số lưu | Tiền tệ | Tiếng Việt | English |
|---|---|---|---|---|
| D01 | `0` | VND | 0 VNĐ | 0 VNĐ |
| D02 | `200000000` | VND | +200 tr | +200 Mil |
| D03 | `-1200000000` | VND | −1.2 tỷ | −1.2 Bil |
| D04 | `0` | USD | — | $0.00 |
| D05 | `25000000` | USD | — | +$250K |
| D06 | `-125050` | USD | — | −$1.25K |

## 5. Số đếm, phần trăm, cỡ file

Hai ngôn ngữ giống nhau. Phần trăm: hàm cho con số, giao diện thêm "%".

| Mã | Loại | Đầu vào | Kết quả | Ghi chú |
|---|---|---|---|---|
| N01 | Số đếm | `0` | 0 | |
| N02 | Số đếm | `1204` | 1,204 | hôm nay "1.204" |
| N03 | Số đếm | `1000000` | 1,000,000 | |
| N04 | Phần trăm | `66.6666` | 66.7% | hôm nay "66,7" |
| N05 | Phần trăm | `100` | 100% | không ghi ".0" |
| N06 | Phần trăm | `150` | 150% | tỷ lệ có thể vượt 100% |
| N07 | Phần trăm | `-2.44` | -2.4% | số âm |
| N08 | Phần trăm | `-0.04` | 0% | tròn về 0 thì không có "-0" |
| N09 | Phần trăm | `0.05` | 0.1% | làm tròn nửa lên |
| N10 | Phần trăm | `1234.56` | 1,234.6% | nhóm nghìn |
| N11 | Cỡ file | `0` | 0 B | |
| N12 | Cỡ file | `1023` | 1,023 B | |
| N13 | Cỡ file | `1024` | 1 KB | 1 KB = 1024 B |
| N14 | Cỡ file | `1536` | 1.5 KB | |
| N15 | Cỡ file | `1048524` | 1,023.9 KB | sát ranh giới, chưa lên MB |
| N16 | Cỡ file | `1048525` | 1 MB | làm tròn chạm 1,024 KB → lên MB |
| N17 | Cỡ file | `3250585` | 3.1 MB | hôm nay "3,1 MB" |

## 6. Đọc ô nhập tiền

Một hàm đọc cho cả hai ngôn ngữ (Q6). Kết quả là số lưu. "Quá trần" nghĩa là đọc được nhưng không phải phí hợp lệ: lệnh ghi báo lỗi trần (`AMOUNT_TOO_LARGE`), giống hôm nay. Mã lỗi giữ như `parseVnd`: `empty`, `negative`, `format`, `fraction`, `too-large`.

### 6.1 Cách gõ đúng

| Mã | Gõ | Tiền tệ | Số lưu | Đọc thành | Ghi chú |
|---|---|---|---|---|---|
| I01 | `3000000` | VND | `3000000` | 3,000,000 VNĐ | viết liền |
| I02 | `3,000,000` | VND | `3000000` | 3,000,000 VNĐ | |
| I03 | `3,000,000 VNĐ` | VND | `3000000` | 3,000,000 VNĐ | |
| I04 | `3,000,000 ₫` | VND | `3000000` | 3,000,000 VNĐ | ô nhập vẫn nhận "₫" |
| I05 | `3,000,000đ` | VND | `3000000` | 3,000,000 VNĐ | |
| I06 | `500tr` | VND | `500000000` | 500,000,000 VNĐ | |
| I07 | `500 triệu` | VND | `500000000` | 500,000,000 VNĐ | |
| I08 | `1.5 tỷ` | VND | `1500000000` | 1,500,000,000 VNĐ | |
| I09 | `0.5 tỷ` | VND | `500000000` | 500,000,000 VNĐ | |
| I10 | `1.25 tr` | VND | `1250000` | 1,250,000 VNĐ | |
| I11 | `750k` | VND | `750000` | 750,000 VNĐ | |
| I12 | `750 nghìn` | VND | `750000` | 750,000 VNĐ | |
| I13 | `1.9 Bil` | VND | `1900000000` | 1,900,000,000 VNĐ | đơn vị tiếng Anh với VND (Q6) |
| I14 | `500 Mil` | VND | `500000000` | 500,000,000 VNĐ | (Q6) |
| I15 | `1,500` | VND | `1500` | 1,500 VNĐ | gợi ý của X05 |
| I16 | `1.500 tỷ` | VND | `1500000000` | 1,500,000,000 VNĐ | **1.5 tỷ**, không lỗi; hôm nay là 1,500 tỷ |
| I17 | `1tr5` | VND | `1500000` | 1,500,000 VNĐ | cách nói giữ nguyên (Q7) |
| I18 | `1 tỷ 2` | VND | `1200000000` | 1,200,000,000 VNĐ | (Q7) |
| I19 | `1250.5` | USD | `125050` | $1,250.50 | |
| I20 | `1,250.50` | USD | `125050` | $1,250.50 | |
| I21 | `$1,250.50` | USD | `125050` | $1,250.50 | |
| I22 | `$ 1,250.50` | USD | `125050` | $1,250.50 | |
| I23 | `1,250.50 USD` | USD | `125050` | $1,250.50 | mã ISO sau số |
| I24 | `USD 1,250.50` | USD | `125050` | $1,250.50 | mã ISO trước số |
| I25 | `0.05` | USD | `5` | $0.05 | |
| I26 | `250K` | USD | `25000000` | $250,000.00 | |
| I27 | `$1.2 Mil` | USD | `120000000` | $1,200,000.00 | |
| I28 | `1.2345 Mil` | USD | `123450000` | $1,234,500.00 | có đơn vị: số lẻ dài được, miễn tròn cent |
| I29 | `1.5 Bil` | USD | `150000000000` | $1,500,000,000.00 | |
| I30 | `€250K` | EUR | `25000000` | €250,000.00 | |
| I31 | `250,000.00 EUR` | EUR | `25000000` | €250,000.00 | |
| I32 | `£1,250.5` | GBP | `125050` | £1,250.50 | |
| I33 | `$100` | AUD | `10000` | A$100.00 | ba đồng đô la nhận cả "$" |
| I34 | `A$100` | AUD | `10000` | A$100.00 | |
| I35 | `C$1,000` | CAD | `100000` | C$1,000.00 | |
| I36 | `S$99.90` | SGD | `9990` | S$99.90 | |

### 6.2 Cách gõ bị từ chối

Gợi ý là cách đọc cũ (`splitNumber` hôm nay, nhóm bằng dấu cách) viết lại theo luật mới; chỉ hiện khi cách đọc đó ra một số hợp lệ. App không tự áp gợi ý.

| Mã | Gõ | Tiền tệ | Lỗi | Gợi ý | Ghi chú |
|---|---|---|---|---|---|
| X01 | `1,5 tỷ` | VND | `format` | `1.5 tỷ` | `,` không đứng trước nhóm 3 chữ số |
| X02 | `0,5 tỷ` | VND | `format` | `0.5 tỷ` | |
| X03 | `500.000.000` | VND | `format` | `500,000,000` | `.` chỉ một lần, cho phần lẻ |
| X04 | `500.000.000 VNĐ` | VND | `format` | `500,000,000 VNĐ` | gợi ý giữ chữ VNĐ như đã gõ |
| X05 | `1.500` | VND | `fraction` | `1,500` | VND không có số lẻ |
| X06 | `1.234,5 tr` | VND | `format` | `1,234.5 tr` | kiểu châu Âu |
| X07 | `500 000 000` | VND | `format` | `500,000,000` | nhóm bằng dấu cách, hôm nay nhận (Q8) |
| X08 | `1,5` | VND | `format` | — | cách đọc cũ (1.5 đồng) cũng không hợp lệ |
| X09 | `1,50` | VND | `format` | — | |
| X10 | `12,34,567` | VND | `format` | — | nhóm kiểu Ấn Độ |
| X11 | `,500` | VND | `format` | — | |
| X12 | `1.0000000001 tỷ` | VND | `fraction` | — | lẻ dưới 1 đồng |
| X13 | `1.5 T` | VND | `format` | — | ô nhập không nhận T (Q6) |
| X14 | `1.5m` | VND | `format` | — | không nhận "m" (Q6) |
| X15 | `$500` | VND | `format` | — | dấu của tiền khác |
| X16 | `-500tr` | VND | `negative` | — | phí không âm |
| X17 | (trống) | VND | `empty` | — | |
| X18 | `99,999,999,999,999,999` | VND | `too-large` | — | quá số nguyên an toàn |
| X19 | `1.500` | USD | `fraction` | `1,500` | không đơn vị: tối đa 2 chữ số sau `.`, kể cả số 0 |
| X20 | `1,250.505` | USD | `fraction` | — | quá hai chữ số lẻ |
| X21 | `12,34` | USD | `format` | `12.34` | |
| X22 | `1.234,56` | USD | `format` | `1,234.56` | kiểu châu Âu |
| X23 | `1.234,56 €` | EUR | `format` | — | ký hiệu € đặt sau số không được nhận |
| X24 | `€100` | USD | `format` | — | dấu của tiền khác |
| X25 | `1.234567891 Mil` | USD | `fraction` | — | lẻ dưới 1 cent |

### 6.3 Trần phí (100 Billions)

| Mã | Gõ | Tiền tệ | Số lưu | Là phí? |
|---|---|---|---|---|
| M01 | `100 tỷ` | VND | `100000000000` | Có: đúng trần |
| M02 | `100,000,000,001` | VND | `100000000001` | Không: quá trần 1 đồng |
| M03 | `100.000000001 tỷ` | VND | `100000000001` | Không: quá trần |
| M04 | `1,500 tỷ` | VND | `1500000000000` | Không: đọc được (1,500 tỷ), quá trần |
| M05 | `100 Bil` | USD | `10000000000000` | Có: đúng trần |
| M06 | `100,000,000,000.01` | USD | `10000000000001` | Không: quá trần 1 cent |
| M07 | `100.01 Bil` | USD | `10001000000000` | Không: quá trần |

## 7. Ngày và kỳ

Nhập dd/mm/yyyy (và dd/mm gọn) ở cả hai ngôn ngữ, Owner chốt 12/11. Ngày 12/11/2026 là Thứ Năm. Tuần tính từ Thứ Hai tới Chủ Nhật. "Chỗ rộng" (tiêu đề, dòng đọc ngày, ô kỳ) chốt ở mockup từng màn (Q9).

| Mã | Trường hợp | Đầu vào | Tiếng Việt | English | Ghi chú |
|---|---|---|---|---|---|
| Y01 | Ngày ở bảng, ô nhập | 2026-11-12 | 12/11/2026 | 12/11/2026 | giống nhau |
| Y02 | Dòng đọc ngày (chỗ rộng) | 2026-11-12 | Thứ Năm 12/11/2026 | Thu 12 Nov 2026 | tiếng Việt như hôm nay (Q9) |
| Y03 | Ngày–tháng, năm rõ từ ngữ cảnh | 2026-11-12 | 12/11 | 12/11 · chỗ rộng: 12 Nov | (Q9) |
| Y04 | Nhập đủ | `3/4/2027` | 03/04/2027 (3 tháng 4) | 03/04/2027 (3 April) | không bao giờ đọc thành 4 tháng 3 |
| Y05 | Nhập gọn, xem ngày 12/11/2026 | `11/12` | 11/12/2026 | 11/12/2026 (11 December) | `parseQuickDate`, như hôm nay |
| Y06 | Kỳ ngày | 2026-11-12 | 12/11/2026 | 12 Nov 2026 | |
| Y07 | Kỳ tuần trong một tháng | 2026-11-09 → 2026-11-15 | 09/11 – 15/11/2026 | 9 – 15 Nov 2026 | |
| Y08 | Kỳ tuần qua hai tháng | 2026-11-30 → 2026-12-06 | 30/11 – 06/12/2026 | 30 Nov – 6 Dec 2026 | |
| Y09 | Kỳ tuần qua hai năm | 2026-12-28 → 2027-01-03 | 28/12/2026 – 03/01/2027 | 28 Dec 2026 – 3 Jan 2027 | |
| Y10 | Kỳ tháng | tháng 11/2026 | Tháng 11/2026 | November 2026 · chỗ hẹp: Nov 2026 | tên tháng dạng dài |
| Y11 | Kỳ năm | 2026 | Năm 2026 | 2026 | |
| Y12 | Tên thứ ngắn (lịch) | Thứ Hai … Chủ Nhật | T2 … CN | Mon … Sun | |
| Y13 | Tên tháng ngắn | 1 … 12 | — | Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec | |
