# Golden examples — Chỉ số (G2)

Bảng đối chiếu cho Owner duyệt. Khớp 1–1 với fixture `packages/domain/src/golden/metrics.fixture.ts` (cùng mã `hd-…`, `ap-…`, `G…`). Sau khi Owner duyệt, bộ này là test bắt buộc của stats engine (#31, #32); **không sửa để "cho xanh"** — muốn đổi phải qua Owner.

Định nghĩa áp dụng: ADR-0007 (bản chốt G2, 26/09/2026).

| Chỉ số | Cách tính |
|---|---|
| HĐ đã nộp | Số HĐ có ngày nộp (`submitted_date`) trong kỳ |
| Case size | Σ FYP nộp của các HĐ đó (tổng, không trung bình) |
| HĐ phát hành | Số HĐ có ngày phát hành (`issued_date`) trong kỳ |
| Doanh số | Σ FYP phát hành của các HĐ đó |
| Chuyển RF | Số cuộc hẹn **Đã gặp**, ngày gặp trong kỳ, mà "nhóm sau cuộc gặp" đưa KH từ **N4/N3** lên **N2/N1** |
| Tỉ lệ chốt | HĐ phát hành ÷ chuyển RF, cùng kỳ, không lũy kế; 0 RF → "—" |

Kỳ: tuần Thứ Hai → Chủ Nhật; MTD = ngày 1 → ngày đang xem. Góc nhìn: HĐ/cuộc hẹn tính cho RE phụ trách ghi trên đó; team = team hiện tại của RE. Tiền ghi theo **triệu đồng (tr)**.

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
| KH 04 | Bình | N4 | 08/01 N4→N2 (`ap-07`, **Dời lịch**) · 15/01 N2→N1 (`ap-08`) | N1 |
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
| `ap-04` | 06/01/2027 | KH 03 | Bình (+ TL Hà) | Đã gặp | N4 → N2 | **Có** | N4 nhảy thẳng N2; TL Hà không được tính |
| `ap-05` | 13/01/2027 | KH 03 | Bình | Đã gặp | N2 → N3 | Không | Hạ nhóm |
| `ap-06` | 20/01/2027 | KH 03 | Bình | Đã gặp | N3 → N2 | **Có** | Nâng lại sau khi hạ |
| `ap-07` | 08/01/2027 | KH 04 | Bình | Dời lịch | N4 → N2 | Không | Không phải Đã gặp |
| `ap-08` | 15/01/2027 | KH 04 | Bình | Đã gặp | N2 → N1 | Không | N2→N1 không tính |
| `ap-09` | 04/01/2027 | KH 05 | Chi (+ IS Khoa) | Đã gặp | N4 → N1 | **Có** | N4 nhảy thẳng N1 |
| `ap-10` | 18/01/2027 | KH 06 | Chi | Đã gặp | Tạm hoãn → N3 | Không | Mở lại về N3 |
| `ap-11` | 27/01/2027 | KH 06 | Chi | Đã gặp | N3 → N2 | **Có** | Sau khi mở lại |
| `ap-12` | 07/01/2027 | KH 08 | Dũng | Đã gặp | N3 → N3 | Không | Không đổi nhóm |
| `ap-13` | 14/01/2027 | KH 08 | Dũng | Không gặp được | — | Không | |
| `ap-14` | 21/01/2027 | KH 08 | Dũng | KH hủy | — | Không | |
| `ap-15` | 05/02/2027 | KH 08 | Dũng | Đã lên lịch | — | Không | |

KH 07 lên N2 ngày 11/01 bằng sửa tay (không qua cuộc hẹn) → **không** tính RF.

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

Cột: **Nộp** = HĐ đã nộp · **Case size** (tr) · **PH** = HĐ phát hành · **Doanh số** (tr) · **RF** = chuyển RF · **Tỉ lệ chốt** = PH ÷ RF.

| Mã | Kỳ | Góc nhìn | Nộp | Case size | PH | Doanh số | RF | Tỉ lệ chốt | Kiểm điều gì |
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
| G13 | Tháng 01/2027 | RE Bình | 1 | 1.000 | 1 | 1.000 | 2 | 1/2 = 50% | Hạ rồi nâng lại tính 2 RF; `ap-07` dời lịch, `ap-08` N2→N1 không tính |
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
