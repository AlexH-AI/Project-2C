# Golden examples — Chỉ số (G2)

Bảng đối chiếu cho Owner duyệt. Khớp 1–1 với fixture `packages/domain/src/golden/metrics.fixture.ts` (cùng mã `hd-…`, `ap-…`, `G…`). Sau khi Owner duyệt, bộ này là test bắt buộc của stats engine (#31, #32); **không sửa để "cho xanh"** — muốn đổi phải qua Owner.

Định nghĩa áp dụng: ADR-0007 (bản chốt G2, 26/09/2026). HĐ hủy, Tổng số HĐ, FYP phát hành, FYP hủy, Tỷ lệ hủy và nghĩa mới của Doanh số: phụ lục "HĐ hủy" của ADR-0007 (Phase 6 phần B, Owner duyệt G2 13/11/2026), golden ở mục 4.

| Chỉ số | Cách tính |
|---|---|
| HĐ đã nộp | Số HĐ có ngày nộp (`submitted_date`) trong kỳ |
| Case size | Σ FYP nộp của các HĐ đó (tổng, không trung bình) |
| HĐ phát hành | Số HĐ có ngày phát hành (`issued_date`) trong kỳ, kể cả HĐ bị hủy sau đó |
| FYP phát hành | Σ FYP phát hành của các HĐ phát hành trong kỳ (trước phần B, đây là Doanh số) |
| HĐ hủy | Số HĐ có ngày hủy (`cancelled_date`) trong kỳ; tính cho RE ghi trên HĐ, như HĐ phát hành |
| FYP hủy | Σ FYP phát hành của các HĐ hủy trong kỳ (không nhập riêng) |
| Tổng số HĐ | HĐ phát hành − HĐ hủy; có thể âm |
| Doanh số | FYP phát hành − FYP hủy; có thể âm |
| Chuyển RF | Số cuộc hẹn **Đã gặp**, ngày gặp trong kỳ, mà "nhóm sau cuộc gặp" đưa KH từ **N4/N3** lên **N2/N1** |
| Tỷ lệ chốt | HĐ phát hành ÷ chuyển RF, cùng kỳ, không lũy kế, không trừ HĐ hủy; 0 RF → "—" |
| Tỷ lệ hủy | HĐ hủy ÷ HĐ phát hành, cùng kỳ, không lũy kế; 0 HĐ phát hành → "—"; có thể vượt 100%. Dòng Tổng = Σ HĐ hủy ÷ Σ HĐ phát hành, không lấy trung bình |

Chỉ cuộc hẹn **Đã gặp** mới có "nhóm sau cuộc gặp"; Đã lên lịch / Dời lịch / KH hủy / Không gặp được thì để trống. KH lên nhóm ngoài cuộc gặp (vd. được **gửi** giải pháp, chuyển hóa qua điện thoại) → sửa nhóm bằng tay, không tính RF.

Kỳ: tuần Thứ Hai → Chủ Nhật; MTD = ngày 1 → ngày đang xem. Góc nhìn: HĐ tính cho RE ghi trên HĐ, chuyển RF tính cho RE ghi trên cuộc hẹn; team = team hiện tại của RE. Tiền ghi theo **triệu đồng (tr)**.

## 1. Dữ liệu kịch bản

### Người

| Mã | Tên | Vai trò | Team |
|---|---|---|---|
| `re-an` | An | RE | Team A |
| `re-binh` | Bình | RE | Team A |
| `tl-ha` | Hà | TL (không có chỉ số) | Team A |
| `re-chi` | Chi | RE | Team B |
| `re-dung` | Dũng | RE | Team B |
| `is-khoa` | Khoa | IS (không có chỉ số) | — |

### Khách hàng và các lần chuyển nhóm

Mọi KH được tạo ngày 01/12/2026 ở nhóm ghi trong cột "Tạo". "Tay" = sửa nhóm ngoài cuộc hẹn.

| KH | RE | Tạo | Các lần chuyển nhóm | Nhóm hiện tại |
|---|---|---|---|---|
| KH 01 | An | N4 | 15/12/2026 N4→N3 (`ap-01`) · 29/12/2026 N3→N2 (`ap-02`) | N2 |
| KH 02 | An | N3 | 02/01/2027 N3→N1 (`ap-03`) | N1 |
| KH 03 | Bình | N4 | 06/01 N4→N2 (`ap-04`) · 13/01 N2→N3 hạ (`ap-05`) · 20/01 N3→N2 nâng lại (`ap-06`) | N2 |
| KH 04 | Bình | N4 | 08/01 N4→N2 (tay — RE gửi giải pháp, không qua cuộc gặp) · 15/01 N2→N1 (`ap-08`) | N1 |
| KH 05 | Chi | N4 | 04/01 N4→N1 (`ap-09`) | N1 |
| KH 06 | Chi | N3 | 05/01 N3→Tạm hoãn (tay) · 18/01 Tạm hoãn→N3 mở lại (`ap-10`) · 27/01 N3→N2 (`ap-11`) | N2 |
| KH 07 | Chi | N4 | 11/01 N4→N2 (tay) · 25/01 N2→Mất cơ hội (tay) | Mất cơ hội |
| KH 08 | Dũng | N3 | — | N3 |
| KH 09 | Dũng | N1 | — | N1 |

Ngày không ghi năm là năm 2027.

### Cuộc hẹn — cái nào là chuyển RF

| Mã | Ngày | KH | RE | Trạng thái | Nhóm trước → sau | RF? | Lý do |
|---|---|---|---|---|---|---|---|
| `ap-01` | 15/12/2026 | KH 01 | An | Đã gặp | N4 → N3 | Không | N4→N3 không tính |
| `ap-02` | 29/12/2026 | KH 01 | An | Đã gặp | N3 → N2 | **Có** | |
| `ap-03` | 02/01/2027 | KH 02 | An | Đã gặp | N3 → N1 | **Có** | |
| `ap-04` | 06/01/2027 | KH 03 | Bình (+ IS Khoa) | Đã gặp | N4 → N2 | **Có** | N4 nhảy thẳng N2; IS Khoa trình bày giải pháp, không được tính |
| `ap-05` | 13/01/2027 | KH 03 | Bình | Đã gặp | N2 → N3 | Không | Hạ nhóm |
| `ap-06` | 20/01/2027 | KH 03 | Bình | Đã gặp | N3 → N2 | **Có** | Nâng lại sau khi hạ |
| `ap-07` | 08/01/2027 | KH 04 | Bình | Dời lịch | — | Không | Không phải Đã gặp → không có nhóm sau |
| `ap-08` | 15/01/2027 | KH 04 | Bình | Đã gặp | N2 → N1 | Không | N2→N1 không tính |
| `ap-09` | 04/01/2027 | KH 05 | Chi (+ IS Khoa) | Đã gặp | N4 → N1 | **Có** | N4 nhảy thẳng N1 |
| `ap-10` | 18/01/2027 | KH 06 | Chi | Đã gặp | Tạm hoãn → N3 | Không | Mở lại về N3 |
| `ap-11` | 27/01/2027 | KH 06 | Chi | Đã gặp | N3 → N2 | **Có** | Sau khi mở lại |
| `ap-12` | 07/01/2027 | KH 08 | Dũng | Đã gặp | N3 → N3 | Không | Không đổi nhóm |
| `ap-13` | 14/01/2027 | KH 08 | Dũng | Không gặp được | — | Không | |
| `ap-14` | 21/01/2027 | KH 08 | Dũng | KH hủy | — | Không | |
| `ap-15` | 05/02/2027 | KH 08 | Dũng | Đã lên lịch | — | Không | |

KH 04 lên N2 ngày 08/01 và KH 07 lên N2 ngày 11/01 bằng sửa tay (không qua cuộc gặp) → **không** tính RF. RF chỉ đo hiệu quả cuộc gặp.

**Tổng: 6 cuộc gặp chuyển RF** — `ap-02`, `ap-03`, `ap-04`, `ap-06`, `ap-09`, `ap-11`.

### Hợp đồng

| Mã | KH | RE | Ngày nộp | FYP nộp | Ngày phát hành | FYP phát hành | Ghi chú |
|---|---|---|---|---|---|---|---|
| `hd-01` | KH 01 | An | 30/12/2026 | 500 | 05/01/2027 | 500 | Phát hành T1, RF ở T12 |
| `hd-02` | KH 02 | An | 31/01/2027 | 300 | 02/02/2027 | **280** | Nộp 31/01, phát hành 02/02; FYP phát hành sửa tay |
| `hd-03` | KH 02 | An | 31/01/2027 | 200 | — | — | Chưa phát hành |
| `hd-04` | KH 03 | Bình | 25/01/2027 | 1.000 | 28/01/2027 | 1.000 | |
| `hd-05` | KH 05 | Chi | 10/01/2027 | 150 | 20/01/2027 | 150 | |
| `hd-06` | KH 05 | Chi | 12/01/2027 | 250 | 22/01/2027 | 250 | 2 HĐ cùng KH |
| `hd-07` | KH 09 | Dũng | 20/12/2026 | 400 | 08/01/2027 | 400 | RE có HĐ phát hành nhưng 0 RF |

## 2. Kết quả mong đợi

Cột: **Nộp** = HĐ đã nộp · **Case size** (tr) · **PH** = HĐ phát hành · **Doanh số** (tr) · **RF** = chuyển RF · **Tỷ lệ chốt** = PH ÷ RF.

| Mã | Kỳ | Góc nhìn | Nộp | Case size | PH | Doanh số | RF | Tỷ lệ chốt | Kiểm điều gì |
|---|---|---|---|---|---|---|---|---|---|
| G01 | Ngày 02/01/2027 | Toàn bộ | 0 | 0 | 0 | 0 | 1 | 0/1 = 0% | Có RF, chưa có HĐ → 0%, không phải "—" |
| G02 | Ngày 31/01/2027 | Toàn bộ | 2 | 500 | 0 | 0 | 0 | — | 0 RF → "—" |
| G03 | Ngày 02/02/2027 | Toàn bộ | 0 | 0 | 1 | 280 | 0 | — | HĐ nộp 31/01 vào doanh số ngày 02/02, dùng FYP phát hành sửa tay |
| G04 | Tuần 28/12/2026 – 03/01/2027 | Toàn bộ | 1 | 500 | 0 | 0 | 2 | 0/2 = 0% | Tuần vắt qua năm: RF 29/12/2026 + 02/01/2027 |
| G05 | Tuần 28/12/2026 – 03/01/2027 | RE An | 1 | 500 | 0 | 0 | 2 | 0/2 = 0% | |
| G06 | Tuần 28/12/2026 – 03/01/2027 | Team B | 0 | 0 | 0 | 0 | 0 | — | Kỳ không có gì → 0, "—" |
| G07 | Tuần 25/01 – 31/01/2027 | Toàn bộ | 3 | 1.500 | 1 | 1.000 | 1 | 1/1 = 100% | Biên tuần: ngày đầu 25/01 và ngày cuối 31/01 đều tính |
| G08 | Tháng 12/2026 | Toàn bộ | 2 | 900 | 0 | 0 | 1 | 0/1 = 0% | `ap-01` N4→N3 không tính RF |
| G09 | Tháng 01/2027 | Toàn bộ | 5 | 1.900 | 5 | 2.300 | 5 | 5/5 = 100% | |
| G10 | Tháng 01/2027 | Team A | 3 | 1.500 | 2 | 1.500 | 3 | 2/3 ≈ 66,7% | |
| G11 | Tháng 01/2027 | Team B | 2 | 400 | 3 | 800 | 2 | 3/2 = 150% | Tỉ lệ > 100% |
| G12 | Tháng 01/2027 | RE An | 2 | 500 | 1 | 500 | 1 | 1/1 = 100% | `hd-01` phát hành T1 dù RF của KH 01 ở T12 |
| G13 | Tháng 01/2027 | RE Bình | 1 | 1.000 | 1 | 1.000 | 2 | 1/2 = 50% | Hạ rồi nâng lại tính 2 RF; KH 04 lên N2 bằng sửa tay, `ap-08` N2→N1 không tính |
| G14 | Tháng 01/2027 | RE Chi | 2 | 400 | 2 | 400 | 2 | 2/2 = 100% | Mở lại về N3 không tính, lên N2 sau đó có tính; KH 07 nâng tay không tính |
| G15 | Tháng 01/2027 | RE Dũng | 0 | 0 | 1 | 400 | 0 | — | Có HĐ phát hành nhưng 0 RF → "—" |
| G16 | Tháng 02/2027 | Toàn bộ | 0 | 0 | 1 | 280 | 0 | — | |
| G17 | Tháng 02/2027 | RE An | 0 | 0 | 1 | 280 | 0 | — | |
| G18 | MTD, xem ngày 15/01/2027 (01/01 – 15/01) | Toàn bộ | 2 | 400 | 2 | 900 | 3 | 2/3 ≈ 66,7% | `ap-08` ngày 15/01 là N2→N1 nên không tính |
| G19 | Năm 2026 | Toàn bộ | 2 | 900 | 0 | 0 | 1 | 0/1 = 0% | |
| G20 | Năm 2027 | Toàn bộ | 5 | 1.900 | 6 | 2.580 | 5 | 6/5 = 120% | Tỉ lệ > 100% |
| G21 | Năm 2027 | Team A | 3 | 1.500 | 3 | 1.780 | 3 | 3/3 = 100% | |
| G22 | Năm 2027 | Team B | 2 | 400 | 3 | 800 | 2 | 3/2 = 150% | |

### Diễn giải vài dòng

- **G09 (Tháng 01/2027, toàn bộ)** — Nộp: `hd-05` 10/01, `hd-06` 12/01, `hd-04` 25/01, `hd-02` + `hd-03` 31/01 → 5 HĐ, 150 + 250 + 1.000 + 300 + 200 = 1.900 tr. Phát hành: `hd-01` 05/01, `hd-07` 08/01, `hd-05` 20/01, `hd-06` 22/01, `hd-04` 28/01 → 5 HĐ, 500 + 400 + 150 + 250 + 1.000 = 2.300 tr. RF: `ap-03`, `ap-04`, `ap-06`, `ap-09`, `ap-11` → 5.
- **G20 (Năm 2027)** — như G09 cộng `hd-02` phát hành 02/02 (280 tr): 6 HĐ phát hành, 2.580 tr; RF vẫn 5 → 120%.
- **G10 + G11 = G09**: 3 + 2 = 5 HĐ nộp; 2 + 3 = 5 HĐ phát hành; 3 + 2 = 5 RF.

## 3. Owner duyệt

- [ ] Dữ liệu kịch bản đúng ý (mục 1)
- [ ] Kết quả G01–G22 đúng (mục 2)
- [ ] Mô hình dữ liệu (`packages/domain/src/model.ts`, tóm tắt trong PR)

## 4. Golden B — HĐ hủy, tỷ lệ hủy (Phase 6 phần B, Owner duyệt G2 13/11/2026)

Phần B của spec `docs/design/phase-6-phan-hoi-dung-thu.md` (§4, nội dung Owner duyệt 10/11/2026): HĐ hủy tính vào kỳ chứa **ngày hủy**; Doanh số đổi nghĩa thành FYP phát hành − FYP hủy; thêm HĐ hủy, Tổng số HĐ, FYP phát hành, FYP hủy, Tỷ lệ hủy (bảng định nghĩa ở đầu file). Mục này chưa có fixture: Issue B1 viết fixture khớp 1–1 (cùng mã `kh-…`, `ap-…`, `hd-…`, `G…`) và hàm chỉ số. Owner duyệt G2 ngày 13/11/2026 (mục 4.5), nên các dòng G23–G41 là test bắt buộc của B1, **không sửa để "cho xanh"**.

**Kịch bản B là bộ dữ liệu riêng, mọi ngày ở năm 2028.** G19–G22 là dòng cả năm 2026 / 2027, nên một HĐ mới trong hai năm đó làm đổi số của chúng; mục 1 không có gì ở năm 2028, nên tính G23–G41 trên kịch bản B hay trên mục 1 + kịch bản B đều ra cùng số (kiểm ở mục 4.3).

Cách viết "Tỷ lệ" cho cả hai chỉ số, Tỷ lệ hủy và Tỷ lệ chốt: Owner chọn ngày 13/11/2026, "Tỷ". Bảng định nghĩa và nhãn cột của mục 2 đã đổi theo; chữ "Tỉ lệ > 100%" ở ô G11, G20 giữ nguyên tới Issue A5 (spec §4.6).

### 4.1 Dữ liệu kịch bản B

Người như mục 1: An, Bình (Team A), Chi, Dũng (Team B). Ngày không ghi năm là năm **2028**. Tuần của tháng 01/2028: 03/01 – 09/01, 10/01 – 16/01, 17/01 – 23/01, 24/01 – 30/01 (01/01 và 02/01/2028 thuộc tuần 27/12/2027 – 02/01/2028; kịch bản B không có gì trong hai ngày đó).

#### Khách hàng và cuộc hẹn

Mọi KH được tạo ngày 03/01/2028 ở nhóm ghi trong cột "Tạo". Mỗi cuộc hẹn dưới là một cuộc gặp chuyển RF (Đã gặp, N4/N3 → N2/N1), để Tỷ lệ chốt có số ở tháng có HĐ hủy.

| KH | RE | Tạo | Cuộc gặp chuyển RF | Nhóm hiện tại |
|---|---|---|---|---|
| KH 11 | Dũng | N1 | — | N1 |
| KH 12 | Chi | N3 | 04/01 N3→N1 (`ap-21`) | N1 |
| KH 13 | An | N4 | 05/01 N4→N2 (`ap-22`) | N2 |
| KH 14 | Bình | N3 | 07/01 N3→N2 (`ap-23`) | N2 |
| KH 15 | Chi | N4 | 11/01 N4→N1 (`ap-24`) | N1 |
| KH 16 | An | N3 | 19/01 N3→N2 (`ap-25`) | N2 |

**Tổng: 5 cuộc gặp chuyển RF**, đều ở tháng 01/2028: `ap-21`, `ap-22`, `ap-23` (tuần 03/01 – 09/01), `ap-24` (tuần 10/01 – 16/01), `ap-25` (tuần 17/01 – 23/01). Hủy HĐ không đổi nhóm KH: KH 11 có cả hai HĐ đã hủy vẫn ở N1.

#### Hợp đồng

| Mã | KH | RE | Ngày nộp | FYP nộp | Ngày phát hành | FYP phát hành | Ngày hủy | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| `hd-11` | KH 11 | Dũng | 03/01 | 200 | 04/01 | 200 | 12/01 | Phát hành tuần 1, hủy tuần 2 (spec §4.1) |
| `hd-12` | KH 12 | Chi | 04/01 | 300 | 06/01 | **280** | 20/01 | FYP phát hành sửa tay → FYP hủy là 280 |
| `hd-13` | KH 13 | An | 05/01 | 300 | 10/01 | 300 | — | |
| `hd-14` | KH 13 | An | 05/01 | 100 | 11/01 | 100 | 14/01 | Phát hành và hủy cùng tuần |
| `hd-15` | KH 14 | Bình | 07/01 | 500 | 12/01 | 500 | 19/01 | |
| `hd-16` | KH 15 | Chi | 11/01 | 400 | 13/01 | 400 | 07/02 | Phát hành tháng 1, hủy tháng 2 |
| `hd-17` | KH 15 | Chi | 14/01 | 250 | 18/01 | 250 | — | |
| `hd-18` | KH 16 | An | 01/02 | 200 | 03/02 | 200 | — | Đã hủy 08/02 rồi **bỏ hủy** (xóa ngày hủy) |
| `hd-19` | KH 14 | Bình | 02/02 | 150 | 04/02 | 150 | 09/02 | **Đã xóa** (xóa mềm) sau khi hủy |
| `hd-20` | KH 11 | Dũng | 14/02 | 100 | 15/02 | 100 | 15/02 | Hủy ngay ngày phát hành |

Bảng trên là trạng thái cuối, sau khi bỏ hủy `hd-18`. Dòng G36 tính trên một biến thể: như bảng trên, nhưng `hd-18` còn ngày hủy 08/02 (trước khi bỏ hủy).

### 4.2 Kết quả mong đợi

Cột: **Nộp**, **Case size** (tr), **PH**, **RF**, **Tỷ lệ chốt** như mục 2 · **Hủy** = HĐ hủy · **Tổng số HĐ** = PH − Hủy · **FYP PH** = FYP phát hành (tr) · **FYP hủy** (tr) · **Doanh số** = FYP PH − FYP hủy (tr) · **Tỷ lệ hủy** = Hủy ÷ PH.

| Mã | Kỳ | Góc nhìn | Nộp | Case size | PH | Hủy | Tổng số HĐ | FYP PH | FYP hủy | Doanh số | RF | Tỷ lệ chốt | Tỷ lệ hủy | Kiểm điều gì |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| G23 | Tuần 03/01 – 09/01/2028 | RE Dũng | 1 | 200 | 1 | 0 | 1 | 200 | 0 | 200 | 0 | — | 0/1 = 0% | Spec §4.1, tuần 1: `hd-11` phát hành, doanh số +200; có PH, 0 hủy → 0%, không phải "—" |
| G24 | Tuần 10/01 – 16/01/2028 | RE Dũng | 0 | 0 | 0 | 1 | −1 | 0 | 200 | −200 | 0 | — | — | Spec §4.1, tuần 2: `hd-11` hủy, doanh số −200; 0 PH → "—"; Tổng số HĐ và Doanh số âm |
| G25 | Tháng 01/2028 | RE Dũng | 1 | 200 | 1 | 1 | 0 | 200 | 200 | 0 | 0 | — | 1/1 = 100% | Spec §4.1, tháng chứa cả hai ngày: doanh số 0, tỷ lệ hủy 100% |
| G26 | Tuần 03/01 – 09/01/2028 | Toàn bộ | 5 | 1.400 | 2 | 0 | 2 | 480 | 0 | 480 | 3 | 2/3 ≈ 66,7% | 0/2 = 0% | |
| G27 | Tuần 10/01 – 16/01/2028 | Toàn bộ | 2 | 650 | 4 | 2 | 2 | 1.300 | 300 | 1.000 | 1 | 4/1 = 400% | 2/4 = 50% | Ví dụ của Owner: 4 phát hành, 2 hủy → 50%; `hd-11` phát hành tuần trước, `hd-14` phát hành cùng tuần |
| G28 | Tuần 17/01 – 23/01/2028 | Toàn bộ | 0 | 0 | 1 | 2 | −1 | 250 | 780 | −530 | 1 | 1/1 = 100% | 2/1 = 200% | 1 phát hành, 2 hủy → 200%; FYP hủy của `hd-12` là 280 (FYP phát hành sửa tay), không phải 300 |
| G29 | Tháng 01/2028 | Toàn bộ | 7 | 2.050 | 7 | 4 | 3 | 2.030 | 1.080 | 950 | 5 | 7/5 = 140% | 4/7 ≈ 57,1% | `hd-16` hủy 07/02 không tính vào tháng 1 |
| G30 | Tháng 01/2028 | Team A | 3 | 900 | 3 | 2 | 1 | 900 | 600 | 300 | 3 | 3/3 = 100% | 2/3 ≈ 66,7% | Dòng Tổng của team: Σ hủy ÷ Σ PH = 2/3, không phải trung bình 50% và 100% (75%); Tỷ lệ chốt không trừ hủy |
| G31 | Tháng 01/2028 | Team B | 4 | 1.150 | 4 | 2 | 2 | 1.130 | 480 | 650 | 2 | 4/2 = 200% | 2/4 = 50% | Σ hủy ÷ Σ PH = 2/4, không phải trung bình ≈ 33,3% và 100% (≈ 66,7%) |
| G32 | Tháng 01/2028 | RE An | 2 | 400 | 2 | 1 | 1 | 400 | 100 | 300 | 2 | 2/2 = 100% | 1/2 = 50% | |
| G33 | Tháng 01/2028 | RE Bình | 1 | 500 | 1 | 1 | 0 | 500 | 500 | 0 | 1 | 1/1 = 100% | 1/1 = 100% | Tỷ lệ chốt vẫn 1/1 dù HĐ duy nhất đã hủy (không phải 0/1) |
| G34 | Tháng 01/2028 | RE Chi | 3 | 950 | 3 | 1 | 2 | 930 | 280 | 650 | 2 | 3/2 = 150% | 1/3 ≈ 33,3% | `hd-16` phát hành tháng 1, hủy tháng 2: tháng 1 không đổi |
| G35 | Tháng 02/2028 | RE Chi | 0 | 0 | 0 | 1 | −1 | 0 | 400 | −400 | 0 | — | — | Kỳ có hủy, 0 phát hành: "—", Tổng số HĐ và Doanh số âm |
| G36 | Tháng 02/2028 (biến thể: `hd-18` còn hủy 08/02) | RE An | 1 | 200 | 1 | 1 | 0 | 200 | 200 | 0 | 0 | — | 1/1 = 100% | Trước khi bỏ hủy |
| G37 | Tháng 02/2028 | RE An | 1 | 200 | 1 | 0 | 1 | 200 | 0 | 200 | 0 | — | 0/1 = 0% | Sau khi bỏ hủy: số trở lại như chưa từng hủy |
| G38 | Tháng 02/2028 | RE Bình | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | — | `hd-19` hủy rồi xóa mềm: không tính ở chỉ số nào, như mọi HĐ đã xóa; kỳ không có gì → 0, "—" |
| G39 | Ngày 15/02/2028 | RE Dũng | 0 | 0 | 1 | 1 | 0 | 100 | 100 | 0 | 0 | — | 1/1 = 100% | Ngày hủy = ngày phát hành được (luật "không trước") |
| G40 | Tháng 02/2028 | Toàn bộ | 2 | 300 | 2 | 2 | 0 | 300 | 500 | −200 | 0 | — | 2/2 = 100% | `hd-18` đã bỏ hủy, `hd-19` đã xóa: cả hai không tính hủy |
| G41 | Năm 2028 | Toàn bộ | 9 | 2.350 | 9 | 6 | 3 | 2.330 | 1.580 | 750 | 5 | 9/5 = 180% | 6/9 ≈ 66,7% | |

**Cột mới của G01–G22.** Mục 1 không có HĐ hủy, nên với mọi dòng G01–G22: Hủy = 0, Tổng số HĐ = PH, FYP PH = Doanh số của dòng đó, FYP hủy = 0, Tỷ lệ hủy = 0/PH = 0% khi PH > 0 và "—" khi PH = 0 (G01, G02, G04–G06, G08, G19). Các số đã duyệt của G01–G22 giữ nguyên, Doanh số theo nghĩa mới vẫn là số cũ.

### 4.3 Diễn giải vài dòng

- **G29 (Tháng 01/2028, toàn bộ)**: Nộp `hd-11` … `hd-17` → 7 HĐ, 200 + 300 + 300 + 100 + 500 + 400 + 250 = 2.050 tr. Phát hành cũng `hd-11` … `hd-17` → 7 HĐ, FYP PH 200 + 280 + 300 + 100 + 500 + 400 + 250 = 2.030 tr. Hủy trong tháng: `hd-11` 12/01, `hd-14` 14/01, `hd-15` 19/01, `hd-12` 20/01 → 4 HĐ, FYP hủy 200 + 100 + 500 + 280 = 1.080 tr (`hd-16` hủy 07/02, tính ở tháng 2). Tổng số HĐ 7 − 4 = 3; Doanh số 2.030 − 1.080 = 950 tr; Tỷ lệ hủy 4/7 ≈ 57,1%. RF `ap-21` … `ap-25` → 5; Tỷ lệ chốt 7/5 = 140%, dùng PH chứ không phải Tổng số HĐ (3/5 = 60%).
- **G26 + G27 + G28 = G29** (tuần 24/01 – 30/01 không có gì): Nộp 5 + 2 + 0 = 7; Case size 1.400 + 650 + 0 = 2.050; PH 2 + 4 + 1 = 7; Hủy 0 + 2 + 2 = 4; FYP PH 480 + 1.300 + 250 = 2.030; FYP hủy 0 + 300 + 780 = 1.080; Doanh số 480 + 1.000 − 530 = 950; RF 3 + 1 + 1 = 5.
- **Kiểm cộng team** (G32 + G33 = G30, G25 + G34 = G31, G30 + G31 = G29): Team A: PH 2 + 1 = 3, Hủy 1 + 1 = 2, FYP PH 400 + 500 = 900, FYP hủy 100 + 500 = 600, Doanh số 300 + 0 = 300, RF 2 + 1 = 3. Team B: PH 1 + 3 = 4, Hủy 1 + 1 = 2, FYP PH 200 + 930 = 1.130, FYP hủy 200 + 280 = 480, Doanh số 0 + 650 = 650, RF 0 + 2 = 2. Toàn bộ: Nộp 3 + 4 = 7, Case size 900 + 1.150 = 2.050, PH 3 + 4 = 7, Hủy 2 + 2 = 4, FYP PH 900 + 1.130 = 2.030, FYP hủy 600 + 480 = 1.080, Doanh số 300 + 650 = 950, RF 3 + 2 = 5. Tỷ lệ hủy luôn tính từ tổng: Team A 2/3, Team B 2/4, Toàn bộ 4/7.
- **G40 (Tháng 02/2028, toàn bộ)**: Nộp `hd-18` 01/02 (200), `hd-20` 14/02 (100) → 2, 300 tr; `hd-19` đã xóa không tính. Phát hành `hd-18` 03/02, `hd-20` 15/02 → 2, 300 tr. Hủy `hd-16` 07/02 (400), `hd-20` 15/02 (100) → 2, 500 tr; `hd-18` đã bỏ hủy, `hd-19` đã xóa. Doanh số 300 − 500 = −200 tr. Theo RE: An 200 (G37) + Bình 0 (G38) + Chi −400 (G35) + Dũng 0 = −200.
- **G41 = G29 + G40**: Nộp 7 + 2 = 9, Case size 2.050 + 300 = 2.350, PH 7 + 2 = 9, Hủy 4 + 2 = 6, FYP PH 2.030 + 300 = 2.330, FYP hủy 1.080 + 500 = 1.580, Doanh số 950 − 200 = 750, RF 5.
- **G19–G22 không đổi**: ngày sớm nhất của kịch bản B là 03/01/2028 (tạo KH, nộp `hd-11`), nên năm 2026, năm 2027 và tuần 27/12/2027 – 02/01/2028 không thêm gì. Tính lại từ mục 1: G19 (năm 2026) nộp `hd-07` 20/12/2026 + `hd-01` 30/12/2026 → 2, 900 tr; 0 PH; RF `ap-02` → 1. G20 (năm 2027) nộp `hd-05`, `hd-06`, `hd-04`, `hd-02`, `hd-03` → 5, 1.900 tr; PH `hd-01`, `hd-07`, `hd-05`, `hd-06`, `hd-04`, `hd-02` → 6, 2.580 tr; RF 5. G21 (Team A, 2027) nộp `hd-02`, `hd-03`, `hd-04` → 3, 1.500 tr; PH `hd-01`, `hd-02`, `hd-04` → 3, 1.780 tr; RF `ap-03`, `ap-04`, `ap-06` → 3. G22 (Team B, 2027) nộp `hd-05`, `hd-06` → 2, 400 tr; PH `hd-05`, `hd-06`, `hd-07` → 3, 800 tr; RF `ap-09`, `ap-11` → 2. Cột mới theo luật ở mục 4.2: G19 Hủy 0, Tổng số HĐ 0, FYP PH 0, FYP hủy 0, Tỷ lệ hủy "—"; G20 0, 6, 2.580, 0, 0/6 = 0%; G21 0, 3, 1.780, 0, 0/3 = 0%; G22 0, 3, 800, 0, 0/3 = 0%.

### 4.4 Mô hình dữ liệu HĐ hủy (G2)

**Owner đã chốt** (10/11/2026, spec §4.1, §4.2):

- HĐ hủy tính vào kỳ chứa ngày hủy; số của kỳ đã qua không đổi khi có HĐ hủy về sau.
- Trạng thái HĐ: Đã nộp → Đã phát hành → **Đã hủy**. Chỉ HĐ đã phát hành mới hủy được.
- Ngày hủy không trước ngày phát hành; luật ngày khác như ngày phát hành.
- FYP hủy bằng FYP phát hành của HĐ, không nhập riêng.
- Bỏ hủy, sửa ngày hủy: trong hộp Sửa của HĐ. Xóa HĐ (xóa mềm) giữ như cũ.
- Hủy không đổi nhóm KH. KH mà mọi HĐ đều đã hủy thì không còn nhãn "Đã có HĐ"; số HĐ trên thẻ KH không đếm HĐ hủy.

**Claude đề xuất, Owner duyệt G2 ngày 13/11/2026** (code ở B1):

1. **Cột:** `policies.cancelled_date` (ngày ISO như `submitted_date`, `issued_date`; trống = chưa hủy); trường `cancelledDate: CalendarDate | null` của kiểu `Policy`. Không có cột FYP hủy, không có cột trạng thái: trạng thái suy từ ngày, như hôm nay (không ngày phát hành → Đã nộp; có ngày phát hành, không ngày hủy → Đã phát hành; có ngày hủy → Đã hủy). Migration thêm cột sau hai migration của phần A (spec §4.5); HĐ có sẵn và file backup cũ đều thành chưa hủy.
2. **Ràng buộc của bảng** (CHECK, như `policies_issued`): ngày hủy chỉ có khi đã có ngày phát hành, và không trước ngày phát hành (`cancelled_date IS NULL OR (issued_date IS NOT NULL AND cancelled_date >= issued_date)`). Hủy đúng ngày phát hành được (G39).
3. **Luật ngày như ngày phát hành:** không sau hôm nay (lỗi `DATE_IN_FUTURE` như hôm nay), trong miền năm 1900–2100.
4. **Bỏ hủy = xóa ngày hủy:** HĐ trở lại Đã phát hành; app không giữ dấu vết lần hủy, nên số của kỳ chứa ngày hủy cũ trở lại như chưa từng hủy (G36 → G37). Sửa ngày hủy = đổi ngày đó: HĐ chuyển sang kỳ của ngày mới.
5. **Hộp Sửa của một HĐ đã hủy:** xóa ngày phát hành (đưa về Đã nộp) bị từ chối, phải bỏ hủy trước; đổi ngày phát hành sang sau ngày hủy bị từ chối (ràng buộc ở mục 2); sửa FYP phát hành thì FYP hủy đổi theo (cùng một số), nên số của cả kỳ phát hành lẫn kỳ hủy đổi theo, như sửa FYP phát hành hôm nay.
6. **Lệnh:** hủy (HĐ chưa xóa, đã phát hành, chưa hủy; nhận ngày hủy); sửa ngày hủy và bỏ hủy qua lệnh sửa HĐ. Hủy không tạo lần chuyển nhóm nào.
7. **Xóa mềm:** HĐ đã xóa, hủy hay không, và HĐ của KH đã xóa không tính ở mọi chỉ số, như hôm nay (CONTEXT "Xóa mềm", spec Phase 3 D4; G38). Khôi phục ở Thùng rác giữ ngày hủy và kiểm lại ngày như khi khôi phục HĐ hôm nay (DR-25).
8. **Nhập backup** (spec §4.5): ràng buộc ở mục 2 áp cho mọi HĐ; luật 10 (việc đã xảy ra không sau hôm nay, theo đồng hồ lúc nhập) thêm ngày hủy của HĐ chưa xóa.
9. **Góc nhìn:** HĐ hủy tính cho RE ghi trên HĐ và team hiện tại của RE, như HĐ phát hành (ADR-0007, G2 E).
10. **Nhãn "Đã có HĐ" (số HĐ)** đếm HĐ chưa xóa, chưa hủy, gồm cả HĐ mới nộp. Trên kịch bản B: KH 13 "Đã có HĐ" (1) vì `hd-14` đã hủy; KH 11 (`hd-11`, `hd-20` đều hủy) và KH 14 (`hd-15` hủy, `hd-19` đã xóa) không có nhãn. Golden đếm KH theo nhóm (`kh-theo-nhom.md`) không đổi, vì hủy không đổi nhóm.

**Ghi chú cho B1 (fixture):**

- Kịch bản B là một bộ dữ liệu riêng của fixture; test DB đặt đồng hồ sau ngày cuối của kịch bản (vd. 29/02/2028), vì đồng hồ của test G01–G22 là 28/02/2027.
- `hd-19` đánh dấu đã xóa ngoài kiểu `Policy`, như `K-26` của `stage-snapshot.fixture.ts`.
- G36 là biến thể (`hd-18` có ngày hủy 08/02); test DB đi qua lệnh: hủy `hd-18` ngày 08/02 → so G36, bỏ hủy → so G37.
- Kiểu kết quả của golden thêm năm trường mới; G01–G22 lấy theo luật ở cuối mục 4.2.

### 4.5 Owner duyệt — đã duyệt G2 13/11/2026 (PR #1236)

Owner, trong chat với phiên T-421 ở Home PC, trả lời câu hỏi Q1–Q3 của PR #1236: "Duyệt G2 cả ba".

- [x] Dữ liệu kịch bản B đúng ý (mục 4.1)
- [x] Kết quả G23–G41 đúng, cùng luật cột mới của G01–G22 (mục 4.2)
- [x] Mô hình dữ liệu HĐ hủy (mục 4.4)
