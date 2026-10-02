# Golden examples — Đếm KH theo nhóm, ảnh chụp cuối kỳ (G2 Phase 4)

Bảng đối chiếu, **Owner duyệt G2 03/10/2026** (#253, PR #265). Định nghĩa: `docs/design/phase-4-chi-so.md` §2. Sau khi Owner duyệt, task cài đặt chép bảng này thành fixture `packages/domain/src/golden/*.fixture.ts` (cùng mã `K-…`, `S…`); **không sửa để "cho xanh"** — muốn đổi phải qua Owner.

Mỗi KH tính **một lần**, ở nhóm của KH **tại cuối ngày mốc** (`stageOn`, ADR-0007): mốc = ngày cuối kỳ; kỳ chưa hết → hôm nay. KH chưa có lần chuyển nhóm nào tới ngày mốc (tạo sau mốc) không tính. KH đã xóa (xóa mềm) không tính ở mọi kỳ. Góc nhìn: RE **hiện tại** của KH; team = team hiện tại của RE (ADR-0007 G2 E). Tổng quan hiện 4 ô N4–N1; báo cáo thêm Tạm hoãn và Mất cơ hội.

## 1. Dữ liệu kịch bản

**Hôm nay = Thứ Tư 13/01/2027.** Người như `docs/golden/chi-so.md`. Ngày không ghi năm là năm 2027. Ngày đầu tiên của mỗi KH là ngày tạo (lần chuyển nhóm đầu, `from` trống).

| KH | RE hiện tại | Các lần chuyển nhóm | Ghi chú |
|---|---|---|---|
| `K-21` | An | 01/12/2026 tạo N4 · 20/12/2026 N4→N3 · 05/01 N3→N2 | |
| `K-22` | An | 08/01 tạo N3 | KH tạo sau tháng 12 |
| `K-24` | Bình | 01/12/2026 tạo N3 · 10/12/2026 N3→Tạm hoãn · 06/01 Tạm hoãn→N3 | Đóng rồi mở lại |
| `K-25` | Bình | 01/12/2026 tạo N2 · 07/01 N2→Mất cơ hội | Đóng trong kỳ |
| `K-26` | Chi | 01/12/2026 tạo N1 | **KH đã xóa** |
| `K-27` | Chi | 01/12/2026 tạo N4 · 11/01 N4→N2 · 12/01 N2→N3 | Nâng rồi hạ, ảnh chụp lấy lần cuối |
| `K-28` | Dũng | 02/01 tạo N4 · 13/01 N4→N3 | Chuyển nhóm đúng hôm nay |
| `K-29` | An (trước 10/01 là Dũng) | 01/12/2026 tạo N1 | Đổi RE phụ trách 10/01 → tính cho An ở **mọi** kỳ |

## 2. Kết quả mong đợi

Cột: **TH** = Tạm hoãn · **MCH** = Mất cơ hội (chỉ báo cáo hiện). Tổng quan chỉ hiện N4–N1.

| Mã | Kỳ | Mốc | Góc nhìn | N4 | N3 | N2 | N1 | TH | MCH | Kiểm điều gì |
|---|---|---|---|---|---|---|---|---|---|---|
| S01 | Tháng 12/2026 | 31/12/2026 | Toàn bộ | 1 | 1 | 1 | 1 | 1 | 0 | `K-22`, `K-28` tạo sau kỳ → không tính; `K-26` đã xóa; `K-24` đang Tạm hoãn |
| S02 | Tuần 04/01 – 10/01 | 10/01 | Toàn bộ | 2 | 2 | 1 | 1 | 0 | 1 | `K-24` mở lại 06/01 → N3; `K-25` đóng 07/01 → MCH; `K-22` tạo trong kỳ có tính |
| S03 | Tháng 01/2027 (chưa hết) | 13/01 | Toàn bộ | 0 | 4 | 1 | 1 | 0 | 1 | Kỳ chưa hết → mốc hôm nay; `K-27` nâng rồi hạ → N3; `K-28` lên N3 đúng hôm nay |
| S04 | Ngày 06/01 | 06/01 | Toàn bộ | 2 | 1 | 2 | 1 | 0 | 0 | Mở lại trong ngày tính ở cuối ngày; `K-22` chưa tạo |
| S05 | Năm 2026 | 31/12/2026 | Toàn bộ | 1 | 1 | 1 | 1 | 1 | 0 | Như S01 |
| S06 | Tháng 01/2027 | 13/01 | RE An | 0 | 1 | 1 | 1 | 0 | 0 | `K-29` đổi RE → tính cho An |
| S07 | Tháng 12/2026 | 31/12/2026 | RE Dũng | 0 | 0 | 0 | 0 | 0 | 0 | `K-29` thuộc Dũng lúc đó nhưng tính theo RE **hiện tại** (An); `K-28` chưa tạo |
| S08 | Tháng 01/2027 | 13/01 | Team A | 0 | 2 | 1 | 1 | 0 | 1 | An + Bình |
| S09 | Tháng 01/2027 | 13/01 | Team B | 0 | 2 | 0 | 0 | 0 | 0 | S08 + S09 = S03; `K-26` đã xóa không tính cho Chi |

### Chart diễn biến (Tổng quan)

Mỗi cột = ảnh chụp cuối ngày của cột. Kỳ Tuần 11/01 – 17/01, Toàn bộ, hôm nay 13/01:

| Mã | Cột | N4 | N3 | N2 | N1 | Ghi chú |
|---|---|---|---|---|---|---|
| S10 | 11/01 | 1 | 2 | 2 | 1 | `K-27` lên N2 |
| S11 | 12/01 | 1 | 3 | 1 | 1 | `K-27` hạ về N3 |
| S12 | 13/01 | 0 | 4 | 1 | 1 | `K-28` lên N3; = 4 ô của kỳ (S03) |
| S13 | 14/01 – 17/01 | — | — | — | — | Sau hôm nay → để trống, không vẽ |

### Diễn giải vài dòng

- **S03** — tới 13/01: `K-21` N2, `K-22` N3, `K-24` N3, `K-25` Mất cơ hội, `K-27` N3, `K-28` N3, `K-29` N1. N3 = 4 (`K-22`, `K-24`, `K-27`, `K-28`).
- **S02** — tới 10/01: `K-21` N2, `K-22` N3, `K-24` N3, `K-25` Mất cơ hội, `K-27` N4, `K-28` N4, `K-29` N1.
- Số KH đã đóng (TH, MCH) không cộng vào 4 ô của Tổng quan.

## 3. Owner duyệt — đã duyệt G2 03/10/2026 (PR #265)

- [x] Dữ liệu kịch bản đúng ý (mục 1)
- [x] Kết quả S01–S13 đúng (mục 2)
