# Phase 4 — Định nghĩa chỉ số Tổng quan và Báo cáo (G2)

- **Issue:** #253 (T-097) · **Cổng:** G2 · **Trạng thái:** chờ Owner duyệt
- **Quyết định Owner:** 03/10/2026 (AskUserQuestion trong phiên #253) + 01/10/2026 (ý 9, HANDOFF "Phản hồi Owner sau kiểm exe")
- **Nền:** ADR-0007 (định nghĩa HĐ, case size, doanh số, RF, tỉ lệ chốt, tuần T2–CN, MTD; góc nhìn G2 E); golden `docs/golden/chi-so.md` (G01–G22, không đổi)
- **Golden mới:** `docs/golden/lich-hen.md` (A01–A13), `docs/golden/kh-theo-nhom.md` (S01–S13); bảng C01–C09 và M01–M04 ngay trong file này
- **Không làm ở đây:** bố cục, màu, chữ trên màn (G3, #254); fixture TS (task cài đặt chép từ bảng đã duyệt)

Quy ước chung cho mọi số trong file:

- **Kỳ:** Ngày / Tuần (T2–CN) / Tháng / Năm / Tùy chọn; ngày đầu và ngày cuối đều thuộc kỳ.
- **Góc nhìn:** Toàn bộ / Team / RE. Bản ghi tính cho **RE ghi trên bản ghi** (KH, cuộc hẹn, HĐ); team = team **hiện tại** của RE (ADR-0007 G2 E). Người phối hợp, TL / IS / BD / BDM không có chỉ số.
- **Bản ghi đã xóa** (xóa mềm) không tính ở bất kỳ kỳ nào, kể cả kỳ đã qua; khôi phục thì tính lại. Mọi số được tính lại từ dữ liệu sống, không lưu lũy kế.
- **Hôm nay** = ngày của app (`db.now()`, #243). Kỳ "chưa hết" = kỳ chứa hôm nay.

## 1. Đếm lịch hẹn theo kỳ

**Quyết định Owner 03/10/2026:** mỗi mắt xích của chuỗi dời tính một lần; lịch đã qua mà còn Đã lên lịch tách thành nhóm riêng "Chưa ghi kết quả".

| Nhóm | Gồm |
|---|---|
| Đã gặp | Trạng thái Đã gặp |
| Dời – hủy – không đến | Dời lịch, KH hủy, Không gặp được |
| **Chưa ghi kết quả** (mới) | Đã lên lịch, ngày **trước** hôm nay |
| Dự kiến | Đã lên lịch, ngày **từ** hôm nay trở đi (lịch hôm nay vẫn là Dự kiến) |
| Tổng | Cộng 4 nhóm |

1. **Mỗi bản ghi cuộc hẹn tính một lần**, ở kỳ chứa **ngày của chính nó**, vào nhóm theo trạng thái của nó.
2. **Chuỗi dời** (D3: dời = cuộc hẹn cũ thành Dời lịch + cuộc hẹn mới trỏ `rescheduled_from_id`): mỗi mắt xích là một bản ghi → tính riêng. Lịch gốc ở kỳ của ngày gốc (nhóm Dời – hủy – không đến), lịch mới ở kỳ của ngày mới. Dời 2 lần = 3 dòng. Kết quả này khớp lịch tháng và lưới năm đang chạy ở màn Lịch hẹn.
3. **Xóa lịch con của chuỗi dời** (lịch mới còn Đã lên lịch, nút xóa #173): lịch con không tính; lịch gốc **giữ** Dời lịch và vẫn tính ở nhóm Dời – hủy – không đến. Lịch Dời lịch không có nút xóa (ACCEPTED #171) nên không có ca "xóa mắt xích giữa".
4. **Lịch của KH đã xóa** không tính (như danh sách Lịch hẹn).
5. **Góc nhìn:** RE ghi trên cuộc hẹn (`appointment.reId`); người phối hợp, kể cả khi là RE, không được tính.
6. **Nhóm Chưa ghi kết quả / Dự kiến phụ thuộc hôm nay:** cùng dữ liệu, hôm nay khác → hai nhóm này đổi, Tổng không đổi (A12).

Golden: `docs/golden/lich-hen.md` A01–A13 (dời sang tuần / năm sau, xóa lịch con, khôi phục, lịch đã xóa, KH đã xóa, người phối hợp, hôm nay đổi).

**Hệ quả:** màn Lịch hẹn (lịch tháng, thanh 3 màu của lưới năm B6, chữ đếm của kỳ) đổi sang **4 nhóm** để hai màn ra cùng số → cần mockup (gộp vào G3 #254) + task UI riêng.

## 2. Đếm KH theo nhóm — ảnh chụp cuối kỳ

**Quyết định Owner 01/10/2026 (ý 9), chi tiết 03/10/2026.**

1. **Mốc** = ngày cuối kỳ; kỳ chưa hết → hôm nay. Kỳ chưa bắt đầu (toàn bộ sau hôm nay) → không có số ("—").
2. Mỗi KH tính **một lần**, ở nhóm tại **cuối ngày mốc** = `stageOn(transitions, kh, mốc)` (`packages/domain/src/customer-lifecycle.ts`; nhiều lần chuyển cùng ngày lấy lần ghi sau cùng).
3. KH tạo **sau** mốc (chưa có lần chuyển nhóm nào tới mốc) → không tính. KH tạo trong kỳ → tính.
4. KH đóng (Tạm hoãn / Mất cơ hội) hay mở lại trong kỳ → tính theo nhóm ở mốc.
5. KH đã xóa → không tính ở mọi kỳ.
6. **Góc nhìn:** RE **hiện tại** của KH và team hiện tại của RE — đổi RE phụ trách thì mọi kỳ cũ tính cho RE mới (v1 không theo dõi lịch sử RE, ADR-0007 G2 E).
7. **Hiện ở đâu:** Tổng quan — 4 ô N4, N3, N2, N1 (màu `StageBadge`, là chú giải chart). Báo cáo — 6 cột: N4, N3, N2, N1, **Tạm hoãn, Mất cơ hội** (Owner 03/10).
8. **Chart diễn biến** (Owner 03/10): cột chồng 4 màu N4–N1; mỗi cột = ảnh chụp cuối mốc con của cột; cột sau hôm nay để trống. Cột cuối có dữ liệu = 4 ô.

| Kỳ | Mốc con (một cột) |
|---|---|
| Ngày | 1 cột (ngày đó) |
| Tuần | 7 ngày |
| Tháng | Từng ngày |
| Năm | 12 tháng (cuối tháng; tháng chứa hôm nay → hôm nay) |
| Tùy chọn | ≤ 31 ngày: từng ngày · dài hơn: từng tháng (tháng đầu / cuối cắt theo khoảng) |

Golden: `docs/golden/kh-theo-nhom.md` S01–S13 (tạo sau kỳ, đóng / mở lại, nâng rồi hạ, chuyển đúng hôm nay, đã xóa, đổi RE, chart tuần).

## 3. Miền năm

**Quyết định Owner 03/10/2026:** `MAX_YEAR = 2100`. Miền ngày của app: **01/01/1900 – 31/12/2100** (`MIN_YEAR = 1900` đã có, `packages/domain/src/period.ts`).

1. `calendarDate`, `addDays`, `parseDate` / ô nhập ngày, `toIsoDate` / `fromIsoDate` của `db`, nhập backup: ngày ngoài miền bị từ chối (domain: `RangeError` / `year-out-of-range`; db: `INVALID_DATE`; nhập backup: `BACKUP_INVALID`).
2. **Kỳ luôn nằm trong miền.** Kỳ tuần vắt qua biên được cắt theo miền: tuần cuối là **27/12 – 31/12/2100** (31/12/2100 là Thứ Sáu). 01/01/1900 là Thứ Hai nên tuần đầu đủ 7 ngày.
3. **`PeriodPicker`:** nút ‹ / › **tắt** (không ẩn) khi kỳ liền trước / sau không dùng được — Ngày / Tháng / Năm / Tuần: không còn ngày nào trong miền; Tùy chọn: có ngày nằm ngoài miền (bảng dưới). Không bao giờ ném lỗi. Nút "Hôm nay" luôn bật.
4. Lịch tháng / lưới năm: ô ngày ngoài miền (vd. 01/01/2101 ở lưới tháng 12/2100) để trống, không bấm được.
5. Kỳ trước của kỳ đầu miền (so sánh §4.2) nằm ngoài miền → không so ("—").

| Kỳ đang xem | ‹ | › |
|---|---|---|
| Ngày 01/01/1900 | tắt | bật |
| Tuần 01/01 – 07/01/1900 | tắt | bật |
| Tháng 01/1900 · Năm 1900 | tắt | bật |
| Ngày 31/12/2100 · Tháng 12/2100 · Năm 2100 | bật | tắt |
| Tuần 27/12 – 31/12/2100 (cắt) | bật | tắt |
| Tùy chọn 01/01/1900 – 10/01/1900 | tắt | bật |
| Tùy chọn 25/12/2100 – 31/12/2100 | bật | tắt |
| Tùy chọn 15/01/1900 – 24/01/1900 (10 ngày) | bật (→ 05/01 – 14/01/1900) | bật |
| Tùy chọn 10/01/1900 – 24/01/1900 (15 ngày) | tắt (kỳ trước bắt đầu 26/12/1899) | bật |

Hàng cuối: kỳ Tùy chọn dời nguyên độ dài; nếu kỳ dời ra **một phần** ngoài miền thì tắt (không cắt) — chỉ kỳ tuần được cắt vì tuần luôn neo T2–CN.

## 4. Chỉ số của Tổng quan và Báo cáo

### 4.1 Bộ chỉ số

| Chỉ số | Định nghĩa | Kỳ chưa hết |
|---|---|---|
| Lịch hẹn | §1: Đã gặp, Dời – hủy – không đến, Chưa ghi kết quả, Dự kiến, Tổng | cả kỳ (Dự kiến có ngày sau hôm nay) |
| Chuyển RF | ADR-0007 | tới hôm nay |
| HĐ nộp · Case size | ADR-0007 | tới hôm nay |
| HĐ phát hành · Doanh số | ADR-0007 | tới hôm nay |
| Tỉ lệ chốt | ADR-0007 — HĐ phát hành ÷ RF cùng kỳ; 0 RF → "—" | tới hôm nay |
| KH theo nhóm | §2 — ảnh chụp ở mốc | mốc = hôm nay |

- Kỳ tháng chưa hết = **MTD** (ngày 1 → hôm nay, ADR-0007); nhãn kỳ ghi "MTD".
- **Dòng Tổng** của mọi bảng: cộng các dòng cho số đếm và tiền; tỉ lệ chốt dòng Tổng = **Σ HĐ phát hành ÷ Σ RF** (không lấy trung bình các tỉ lệ) — vd. Team A 2/3 + Team B 3/2 → Tổng **5/5 = 100%** (G09–G11). Σ RE của team = số team; Σ team = Toàn bộ.

### 4.2 So với kỳ trước (ô KPI Tổng quan)

**Quyết định Owner 03/10/2026:** có so sánh, **cùng số ngày**. Áp cho 6 ô: Chuyển RF, HĐ nộp, Case size, HĐ phát hành, Doanh số, Tỉ lệ chốt (ô Lịch hẹn và KH theo nhóm không so).

1. **Kỳ đã hết** → so với **cả** kỳ liền trước cùng loại.
2. **Kỳ chưa hết** → cửa sổ hiện tại = ngày đầu kỳ → hôm nay (n ngày); so với n ngày đầu của kỳ liền trước, **cắt** ở ngày cuối của kỳ trước nếu kỳ trước ngắn hơn.
3. **Năm chưa hết:** 01/01 → hôm nay so với 01/01 → cùng ngày tháng năm trước; 29/02 → 28/02.
4. **Tùy chọn** và **kỳ chưa bắt đầu** → không so. Kỳ trước ra ngoài miền năm → không so.
5. Hiển thị: số và tiền → chênh lệch có dấu (▲ / ▼ / "="); tỉ lệ chốt → chênh lệch **điểm %**; kỳ trước "—" (0 RF) hoặc hiện tại "—" → không so ("—").

| Mã | Hôm nay | Kỳ đang xem | Cửa sổ hiện tại | So với |
|---|---|---|---|---|
| C01 | 13/01/2027 | Tháng 01/2027 (MTD) | 01/01 – 13/01/2027 | 01/12 – 13/12/2026 |
| C02 | 31/03/2027 | Tháng 03/2027 (MTD) | 01/03 – 31/03/2027 | 01/02 – 28/02/2027 (cắt) |
| C03 | 13/01/2027 | Tháng 12/2026 (đã hết) | 01/12 – 31/12/2026 | 01/11 – 30/11/2026 |
| C04 | 13/01/2027 (T4) | Tuần 11/01 – 17/01/2027 | 11/01 – 13/01/2027 | 04/01 – 06/01/2027 |
| C05 | 13/01/2027 | Ngày 13/01/2027 | 13/01/2027 | 12/01/2027 |
| C06 | 13/01/2027 | Năm 2027 | 01/01 – 13/01/2027 | 01/01 – 13/01/2026 |
| C07 | 29/02/2028 | Năm 2028 | 01/01 – 29/02/2028 | 01/01 – 28/02/2027 |
| C08 | 13/01/2027 | Tháng 02/2027 (chưa bắt đầu) | — | không so |
| C09 | 13/01/2027 | Tùy chọn 05/01 – 20/01/2027 | 05/01 – 13/01/2027 | không so |

Ví dụ số trên dữ liệu `docs/golden/chi-so.md`, hôm nay **15/01/2027**, Tháng 01 (MTD, G18): RF 3, HĐ nộp 2, Case size 400, HĐ phát hành 2, Doanh số 900, Tỉ lệ chốt 66,7%. Kỳ trước 01/12 – 15/12/2026: RF 0 (`ap-01` 15/12 là N4→N3), HĐ nộp 0, HĐ phát hành 0 → ▲ 3 RF, ▲ 2 HĐ nộp, ▲ 400 tr case size, ▲ 2 HĐ phát hành, ▲ 900 tr doanh số; tỉ lệ chốt kỳ trước "—" → không so.

### 4.3 Tổng quan — chỉ số theo góc nhìn

Thanh trên: bộ chọn kỳ + góc nhìn (Toàn bộ / Team / RE) + **nút Lọc** — đổi kỳ / góc nhìn chỉ áp dụng khi bấm Lọc (ý 9). Bố cục, chữ, màu: G3 #254.

| Khối | Toàn bộ | Team | RE |
|---|---|---|---|
| Ô Lịch hẹn (`Đã gặp / Tổng` + 3 nhóm còn lại) | ✓ | ✓ (cộng 3 team) | ✓ |
| 6 ô KPI + so kỳ trước (§4.2) | ✓ | ✓ (cộng 3 team) | ✓ |
| 4 ô N4–N1 (ảnh chụp cuối kỳ) | ✓ | ✓ (cộng 3 team) | ✓ |
| Chart diễn biến N4–N1 | 1 chart | **mỗi team 1 chart** (3 chart), ẩn ô chọn team | 1 chart |
| Bảng So sánh team, bấm team → xổ RE của team | ✓ | ✓ | — |

- **Bảng So sánh team** (Owner 03/10, thay khối "Top RE" của mockup cũ): cột Đã gặp, Chuyển RF, HĐ nộp, Case size, HĐ phát hành, Doanh số, Tỉ lệ chốt; dòng Tổng (§4.1). Bấm một team → các RE của team hiện ngay dưới, cùng cột, sắp theo tên; bấm lại → thu. Không so kỳ trước trong bảng.
- **Bỏ** chart mẫu "Lịch hẹn theo team" (`TeamAppointmentsChart.tsx`) và ô "Tỉ lệ chốt · lũy kế" của mockup cũ (công thức đã thay ở G2, F-10).
- Khối lịch trong ngày / 7 ngày tới của mockup cũ: giữ hay bỏ quyết ở G3; nếu giữ, số đếm theo §1.

### 4.4 Báo cáo

Màn Báo cáo + xuất Excel (`.xlsx`, mỗi bảng một sheet — ADR-0011 / Q12; thư viện Excel là G4 riêng). Kỳ: Ngày / Tuần / Tháng / Năm / Tùy chọn; góc nhìn như Tổng quan.

| Bảng / sheet | Dòng | Cột |
|---|---|---|
| Tổng hợp | 1 dòng cho góc nhìn đang chọn | Lịch hẹn (5 cột §1) · RF · HĐ nộp · Case size · HĐ phát hành · Doanh số · Tỉ lệ chốt · KH cuối kỳ N4, N3, N2, N1, Tạm hoãn, Mất cơ hội |
| Theo team | Mỗi team + dòng Tổng | như trên |
| Theo RE | Mỗi RE (sắp theo team rồi tên, như `reOptions`) + dòng Tổng | Team · RE · như trên |
| **Theo mốc** (Owner 03/10) | Mỗi mốc của kỳ, cho góc nhìn đang chọn | như Tổng hợp; KH = ảnh chụp cuối mốc |

Không có cột so sánh kỳ trước trong báo cáo.

Mốc của bảng Theo mốc:

| Kỳ | Mốc |
|---|---|
| Ngày | 1 mốc |
| Tuần | 7 ngày |
| Tháng | Từng tuần T2–CN, **cắt theo biên tháng** |
| Năm | 12 tháng |
| Tùy chọn | ≤ 31 ngày: từng ngày · dài hơn: từng tháng, cắt theo khoảng |

| Mã | Kỳ | Các mốc |
|---|---|---|
| M01 | Tháng 01/2027 | 01–03/01 (T6–CN) · 04–10/01 · 11–17/01 · 18–24/01 · 25–31/01 |
| M02 | Tháng 02/2027 | 01–07/02 · 08–14/02 · 15–21/02 · 22–28/02 (tháng bắt đầu T2, 4 mốc đủ tuần) |
| M03 | Tùy chọn 20/01 – 15/03/2027 (55 ngày) | 20–31/01 · 01–28/02 · 01–15/03 |
| M04 | Tùy chọn 05/01 – 20/01/2027 (16 ngày) | 16 mốc, từng ngày |

Mốc sau hôm nay: lịch hẹn vẫn đếm (Dự kiến); chỉ số kết quả và KH theo nhóm để trống ("—").

## 5. Hệ quả cho task sau

| Task | Việc do spec này |
|---|---|
| #254 T-098 (G3) | Mockup Tổng quan + Báo cáo theo §4; **thêm** nhóm "Chưa ghi kết quả" cho màn Lịch hẹn (lịch tháng, lưới năm) |
| #255 T-099 (T-e) | Index chỉ số + MTD + cửa sổ so sánh §4.2 (C01–C09); golden A01–A13, S01–S13 thành fixture |
| #256 T-100 (T-f) | §3: `MAX_YEAR`, cắt tuần ở biên, `PeriodPicker` tắt nút |
| Task UI Lịch hẹn (mới, sau G3) | 4 nhóm đếm thay 3 |
| Task dashboard / báo cáo (sau G3) | §4.3, §4.4; tiêu chí F-18 (escape tooltip) ở task dashboard đầu tiên |

## 6. Owner duyệt (G2)

- [ ] §1 Đếm lịch hẹn + golden A01–A13
- [ ] §2 Đếm KH theo nhóm + golden S01–S13
- [ ] §3 Miền năm 1900–2100 + hành vi biên
- [ ] §4 Bộ chỉ số từng màn, so kỳ trước C01–C09, mốc báo cáo M01–M04
