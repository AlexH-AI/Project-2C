# Golden examples — Đếm lịch hẹn theo kỳ (G2 Phase 4)

Bảng đối chiếu, **Owner duyệt G2 03/10/2026** (#253, PR #265). Định nghĩa: `docs/design/phase-4-chi-so.md` §1. Sau khi Owner duyệt, task cài đặt chép bảng này thành fixture `packages/domain/src/golden/*.fixture.ts` (cùng mã `L-…`, `A…`); **không sửa để "cho xanh"** — muốn đổi phải qua Owner.

| Nhóm | Gồm |
|---|---|
| **Đã gặp** | Trạng thái Đã gặp |
| **Dời – hủy – không đến** | Dời lịch, KH hủy, Không gặp được |
| **Chưa ghi kết quả** | Đã lên lịch, ngày **trước** hôm nay |
| **Dự kiến** | Đã lên lịch, ngày **từ** hôm nay trở đi |
| **Tổng** | Cộng 4 nhóm |

Mỗi cuộc hẹn (mỗi mắt xích của chuỗi dời) tính **một lần**, ở kỳ chứa **ngày của chính nó**, theo trạng thái của nó. Cuộc hẹn đã xóa (xóa mềm) và cuộc hẹn của KH đã xóa không tính. Góc nhìn: RE ghi trên cuộc hẹn; team = team hiện tại của RE; người phối hợp không được tính.

## 1. Dữ liệu kịch bản

**Hôm nay = Thứ Tư 13/01/2027** (trừ khi dòng kết quả ghi khác). Người như `docs/golden/chi-so.md`: An, Bình (Team A); Chi, Dũng (Team B); Hà (TL Team A). Ngày không ghi năm là năm 2027.

| Mã | Ngày | RE | Trạng thái | Dời từ | Xóa | Nhóm | Ghi chú |
|---|---|---|---|---|---|---|---|
| `L-01` | 05/01 | An (+ TL Hà) | Đã gặp | — | | Đã gặp | Người phối hợp TL Hà không được tính |
| `L-02` | 06/01 | An | KH hủy | — | | Dời – hủy – không đến | |
| `L-03` | 07/01 | An | Dời lịch | — | | Dời – hủy – không đến | Chuỗi dời 2 lần: `L-03` → `L-04` → `L-05` |
| `L-04` | 12/01 | An | Dời lịch | `L-03` | | Dời – hủy – không đến | Mắt xích giữa, sang tuần sau |
| `L-05` | 20/01 | An | Đã lên lịch | `L-04` | | Dự kiến | Mắt xích cuối, sau hôm nay |
| `L-06` | 11/01 | Chi | Đã lên lịch | — | | Chưa ghi kết quả | Ngày đã qua, chưa ghi kết quả |
| `L-07` | 13/01 | Chi | Đã lên lịch | — | | Dự kiến | Đúng hôm nay → vẫn Dự kiến |
| `L-08` | 29/12/2026 | Chi | Dời lịch | — | | Dời – hủy – không đến | Dời sang năm sau |
| `L-09` | 04/01 | Chi (+ RE Dũng phối hợp) | Đã gặp | `L-08` | | Đã gặp | Dũng phối hợp, không được tính cho Dũng |
| `L-10` | 08/01 | Bình | Không gặp được | — | | Dời – hủy – không đến | |
| `L-11` | 09/01 | Bình | Dời lịch | — | | Dời – hủy – không đến | Lịch con `L-12` đã xóa → `L-11` vẫn là Dời lịch |
| `L-12` | 15/01 | Bình | Đã lên lịch | `L-11` | **Có** | — | Lịch con của chuỗi dời bị xóa → không tính |
| `L-13` | 10/01 | Bình | Đã gặp | — | **Có** | — | Lịch đã xóa không tính |
| `L-14` | 08/01 | Dũng | Đã lên lịch | — | KH đã xóa | — | Lịch của KH đã xóa không tính |

## 2. Kết quả mong đợi

Cột: **Gặp** = Đã gặp · **DHK** = Dời – hủy – không đến · **Chưa** = Chưa ghi kết quả · **DK** = Dự kiến.

| Mã | Kỳ | Góc nhìn | Gặp | DHK | Chưa | DK | Tổng | Kiểm điều gì |
|---|---|---|---|---|---|---|---|---|
| A01 | Tuần 04/01 – 10/01 | Toàn bộ | 2 | 4 | 0 | 0 | 6 | `L-01`, `L-09` gặp; `L-02`, `L-03`, `L-10`, `L-11`; `L-13` đã xóa không tính |
| A02 | Tuần 11/01 – 17/01 | Toàn bộ | 0 | 1 | 1 | 1 | 3 | Mắt xích giữa `L-04` tính ở tuần của nó; `L-06` quá hạn; `L-07` hôm nay = Dự kiến; `L-12` đã xóa |
| A03 | Tháng 01/2027 | Toàn bộ | 2 | 5 | 1 | 2 | 10 | Chuỗi `L-03` → `L-05` tính 3 dòng (2 DHK + 1 DK) |
| A04 | Tháng 12/2026 | Toàn bộ | 0 | 1 | 0 | 0 | 1 | `L-08` tính ở tháng của lịch gốc; lịch mới `L-09` ở tháng 01 |
| A05 | Ngày 13/01 | Toàn bộ | 0 | 0 | 0 | 1 | 1 | Lịch hôm nay là Dự kiến, chưa quá hạn |
| A06 | Năm 2027 | Toàn bộ | 2 | 5 | 1 | 2 | 10 | Như A03 (chưa có lịch sau tháng 01) |
| A07 | Tháng 01/2027 | RE An | 1 | 3 | 0 | 1 | 5 | Người phối hợp (TL Hà) không làm đổi số |
| A08 | Tháng 01/2027 | RE Chi | 1 | 0 | 1 | 1 | 3 | `L-08` ở tháng 12 không vào đây |
| A09 | Tháng 01/2027 | RE Dũng | 0 | 0 | 0 | 0 | 0 | Phối hợp `L-09` không tính; `L-14` của KH đã xóa |
| A10 | Tháng 01/2027 | Team A | 1 | 5 | 0 | 1 | 7 | An + Bình |
| A11 | Tháng 01/2027 | Team B | 1 | 0 | 1 | 1 | 3 | A10 + A11 = A03 |
| A12 | Tháng 01/2027, **hôm nay = 21/01** | Toàn bộ | 2 | 5 | 3 | 0 | 10 | Hôm nay đổi → `L-05`, `L-07` thành Chưa ghi kết quả; Tổng không đổi |
| A13 | Tuần 11/01 – 17/01, **khôi phục `L-12`** | Toàn bộ | 0 | 1 | 1 | 2 | 4 | Khôi phục lịch con → tính lại ở ngày của nó |

### Diễn giải vài dòng

- **A03** — Gặp: `L-01`, `L-09`. DHK: `L-02`, `L-03`, `L-04`, `L-10`, `L-11`. Chưa: `L-06`. DK: `L-05`, `L-07`. Không tính: `L-12`, `L-13` (xóa), `L-14` (KH xóa), `L-08` (tháng 12).
- **Chuỗi dời** `L-03` (07/01) → `L-04` (12/01) → `L-05` (20/01): ba bản ghi, ba lần tính, mỗi lần ở kỳ của ngày mình. Tuần 04–10/01 thấy `L-03`, tuần 11–17/01 thấy `L-04`, tuần 18–24/01 thấy `L-05`. Khớp lịch tháng và lưới năm của màn Lịch hẹn.
- **Ô "Lịch hẹn" của Tổng quan** ghi `Gặp / Tổng` — A03: **2 / 10**, kèm số của 3 nhóm còn lại.

## 3. Owner duyệt — đã duyệt G2 03/10/2026 (PR #265)

- [x] Dữ liệu kịch bản đúng ý (mục 1)
- [x] Kết quả A01–A13 đúng (mục 2)
