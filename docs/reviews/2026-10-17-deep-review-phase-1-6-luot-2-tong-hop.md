# Tổng hợp deep review Phase 1–6, lượt 2 — Claude, Codex (Home PC)

- **Ngày tổng hợp:** 2026-10-17 · **SHA được review:** `4217ed4` · kế hoạch `docs/process/deep-review-phase-1-6.md` §L2 (T-224) · Issue T-225 #565 (`gate`).
- **12 báo cáo = 2 bên × 6 gói** (A lõi dữ liệu · B file và Rust · C AI · D màn nhập liệu · E lịch hẹn, chỉ số, quản lý · F xuyên gói, bloat / hiệu năng, công cụ), một đợt trên **Home PC `DESKTOP-KDURKJP`** (ADR-0001 M7). Bước chuẩn bị 17/10 01:01–01:55, giờ máy:
  - **Claude:** A 01:57–02:39 · B 07:32–08:17 · C 11:08–12:01 · D 12:02–12:57 · E 14:36–16:01 (phiên bị cắt 15:32, làm tiếp 15:35) · F 16:20–17:50 (cắt ≈ 17:09, làm tiếp 17:12).
  - **Codex:** A 01:58–02:18 · B 02:20–02:42 · C 07:31–07:48 · D 11:09–11:27 · E 11:29–14:43 · F 14:46–15:16.
- **Reviewer:** Claude Opus 5.5 (phiên sạch mỗi gói, không subagent; mức suy luận do Owner đặt: gói C, D, E ghi `max`, A, B, F ghi "không ghim") · Codex (Owner chạy; codex-cli 0.162.1; model "GPT-6" theo hệ thống, công cụ không cho biết mức suy luận).
- **ID:** phát hiện `CL2-<gói><số>` (Claude), `CX2-<gói><số>` (Codex); vấn đề đã gộp đánh số tiếp lượt 1: **`DR6-68…103`**.
- **Báo cáo gốc:** PR docs riêng → `docs/reviews/raw/2026-10-17/{claude,codex}/{A…F}.md` + `common-known.md`, `common-baseline.md`, `common-fixes.md` (`common\plan.md` trùng bản trong repo nên không chép). Bằng chứng (probe, đột biến, log, ảnh) ở `C:\workspace\deep-review-1-6-r2\<bên>\<gói>\` trên Home PC, giữ tới phát hành v1.0.

**Cách kiểm (ADR-0001 M2):** phiên tổng hợp đọc đủ 12 báo cáo, gộp hai bảng R thành một bảng 59 DR6, rồi đối chiếu trên code ở checkout chính (`main` `d33dda9`: từ `4217ed4` chỉ đổi `docs/**` + `CLAUDE.md` gốc, code giống hệt) mọi kết luận khác ĐÃ SỬA, mọi chỗ hai bên chấm khác nhau và **mọi** phát hiện mới. 57 phát hiện gộp thành 36 vấn đề. Cột "Kiểm": ✅ đọc đúng chỗ code, khớp mô tả · 🔁 phiên tổng hợp tự chạy lại (probe Node trên `@p2c/db` / `@p2c/ai` / `@p2c/domain` của repo, hook nạp TypeScript như `tools/load-data.mjs`) · 📏 số đo / probe của reviewer · 🧪 đột biến của reviewer · 📄 lệch giữa tài liệu / mockup đã duyệt. Mức trong bảng là **mức chốt** theo thước plan §4.3, không theo mức bên đó gán. **0 phát hiện bị bác.**

## 1. Kết luận

| Bên | Kết luận ở gói F | Lý do chính |
|---|---|---|
| Claude | SẴN SÀNG | 0 Critical / High / Medium; 44 Low / Nit chờ Owner quyết; CL2-A1 chấm Low |
| Codex | **CHƯA SẴN SÀNG** | CX2-A1 (Medium): hồi quy K2 / DR-43 do #616 |

**Kết luận hợp nhất: CHƯA SẴN SÀNG cho v1.0 ở `4217ed4`.** Còn đúng một Medium, **DR6-68**: từ PR #616 (T-232, sửa DR6-04), mọi cuộc gặp Đã gặp ghi bù mang ngày **trước ngày tạo KH** bị từ chối. Bị chặn cả cuộc gặp giữ nhóm, loại mà Owner đã quyết là "nhập bù hợp lệ" (DR-43 ACCEPTED 06/10, K2 của lượt này). Phiên tổng hợp chạy lại được (§5.1). Cách sửa: ≈ 10–20 dòng SP nếu giữ K2 (Q1 phương án a), hoặc Owner đổi K2 (phương án b, vẫn phải sửa hộp 6c). Spec Phase 6 §1 mục 3 đòi sửa mọi phát hiện từ Medium trở lên trước v1.0.

- **Hai Medium của lượt 1 đã sửa.**
  - DR6-01: xóa rồi khôi phục ngay 4 249 / 4 249 cuộc gặp giữ nhóm trên dữ liệu tải (lượt 1: 2 690 / 4 254 bị chặn). Sau 130 lần xóa → khôi phục trên màn, 0 / 1 170 ô Báo cáo khác trước.
  - DR6-02: bàn giao chuyển lịch Dự kiến; "Hẹn tiếp" / "Hẹn lần tiếp theo" lấy RE hiện tại. Số Tổng quan ↔ Báo cáo ↔ Lịch hẹn ↔ Excel 0 lệch ở 6 kỳ × 5 góc nhìn qua 5 bước.
  - Cả hai có test đỏ khi gỡ phần sửa.
- **Bảng R (59 DR6 có Issue sửa): 52 ĐÃ SỬA · 4 SỬA MỘT PHẦN (01, 49, 60, 62) · 3 HỒI QUY (04, 19, 30) · 0 CHƯA SỬA** (§3).
  - Ở cả 59 DR6, đường lỗi lượt 1 đã hết.
  - Ba hồi quy là ba chỗ phần sửa làm một thao tác trước đó đúng thành sai: DR6-68 (M), DR6-79 (L: Mock trích xuất chậm bậc hai), DR6-82 (L: link dài tràn cột ở bố cục 3 cột).
  - Bốn mục SỬA MỘT PHẦN đều nhỏ: một dòng chữ ở Thùng rác, U+0085 của K20, test J5, test BR3.
- **Phát hiện mới:** 57 (Claude 44, Codex 13) → **36 vấn đề `DR6-68…103`: 1 Medium · 23 Low · 12 Nit**. Không Critical / High. 0 bị bác. 1 mục KNOWN có bằng chứng mới (#642 `retro.mjs`).
- **Số đo (§7):** mọi thao tác trong ngưỡng `phase-6.md`; mở lần đầu LCP 3 526 ms (mốc xấu hơn > 4 724 ms).
  - 7 dòng ⚠️ so lượt 1 cùng máy (sáu `reload.*` +62–67 ms, `app.open-data` +113 ms) là chi phí `quick_check` của DR6-06 (60–68 ms, hai bên đo độc lập) cộng file lớn hơn 4,6 % (chỉ mục 0009). Chi phí này có chủ ý; cần ghi mốc mới (DR6-98).
  - DR6-44: `listTrash` nhanh ×8–16 trong Node, ×3,5 trên màn ở 263 dòng; kết quả giống hệt khi có / bỏ chỉ mục.
- **Kiểm log phiên (§10):** không đọc chéo, không lệnh ghi ngoài phạm vi cho phép, không gọi AI của sản phẩm.
- **Còn trước G7:**
  - Sửa ba hồi quy (DR6-68 Medium, DR6-79, DR6-82) và các nhóm Owner chọn (§8).
  - Owner quyết 35 mục Low / Nit còn lại (§9).
  - Các tiêu chí ngoài review của spec §1: mục 2 (nghiệm thu của Owner, exe trên máy sạch và nâng từ exe Phase 5) và mục 4 (cổng trên SHA phát hành, eval AI thật).

## 2. Số liệu

### 2.1 Theo báo cáo (mức do chính bên đó gán)

| Bên | Phát hiện | Medium / Low / Nit | PLAUSIBLE | Bảng R của bên | Kịch bản mới | Đột biến (bị giết / tổng) | Thời gian A–F |
|---|---|---|---|---|---|---|---|
| Claude | 44 (A 6 · B 7 · C 7 · D 8 · E 8 · F 8) | 0 / 27 / 17 | 1 (CL2-F3) | 58 ĐÃ SỬA · 1 SỬA MỘT PHẦN (62) | 80 (A 11 · B 14 · C 12 · D 16 · E 16 · F 11) | 323 / 358 (A 40/41 · B 32/35 · C 22/26 · D 35/39 · E 120/136, 4 bỏ qua · F 74/81) | ≈ 6 h 10 phiên, rải từ 01:57 tới 17:50 |
| Codex | 13 (A 3 · B 4 · C 1 · D 1 · E 2 · F 2) | 1 / 11 / 1 | 1 (CX2-F1) | 55 ĐÃ SỬA · 3 SỬA MỘT PHẦN (01, 49, 60) · 1 HỒI QUY (04) | 74 (A 16 · B 15 · C 12 · D 10 · E 11 · F 10) | 105 / 108 (B 18/21, còn lại 100 %) | ≈ 5 h, E dài nhất (3 h 14) |

Chỉ tiêu ≥ 5 kịch bản mới mỗi gói (gói F ≥ 5 chuỗi nhiều bước qua nhiều gói) đạt ở cả 12 báo cáo. Đột biến sống của Claude đều đã giải thích: tương đương, phần I/O không unit test theo `.claude/rules/tests.md`, hoặc thành phát hiện T.

### 2.2 Theo vấn đề đã gộp (36)

| | Claude | Codex |
|---|---|---|
| Số vấn đề bên đó thấy | **34** (94 %) | 10 (28 %) |
| Chỉ bên đó thấy | 26 | 2 (DR6-93, DR6-95) |
| Medium sau khi chốt (1) | DR6-68 (chấm Low) | DR6-68 (chấm **Medium**) |

- **Cả hai bên (8):** DR6-68 (cùng ca), DR6-69 (E20 theo mốc thời gian, hai kịch bản khác nhau), DR6-72 (hàm chữ, khác ký tự), DR6-76 (key nhiều lớp escape, khác dạng), DR6-78 (Mock trích xuất sai chủ thể), DR6-83 (focus về `body`, khác chỗ), DR6-85 (`compare` một trang), DR6-88 (test hở gói B, khác mục).
- So lượt 1 (Claude thấy cả hai Medium, Codex không thấy Medium nào), lượt này cả hai bên thấy Medium duy nhất, nhưng chỉ Codex chấm đúng mức.

## 3. Bảng R gộp đủ 59 DR6

### 3.1 Chỗ hai bên chấm khác nhau, và hai chỗ cả hai chấm ĐÃ SỬA mà phiên tổng hợp chấm lại

| DR6 | Claude | Codex | Chốt | Kiểm | Lý do |
|---|---|---|---|---|---|
| 01 | ĐÃ SỬA | SỬA MỘT PHẦN | **SỬA MỘT PHẦN** | ✅ 📄 | Phần Medium (dữ liệu) đã hết. Mục tiêu 1 của Issue #592 và TR-3 (`phase-6-hoan-thien.md:92`) viết "Hộp xác nhận **và dòng Thùng rác**: 'Không đổi nhóm KH'". Hộp có câu đó. Dòng thì không: `appointmentDetail` (`trash-view.ts:121-137`) trả `null` khi `effect` là `none`, trong khi dòng bị chặn của cùng cuộc gặp lại ghi "nhóm sau N3". Mockup 11a không vẽ dòng phụ cho lịch không Đã gặp, nên câu "như lịch không Đã gặp" của TR-3 tự mơ hồ. Phần còn: DR6-93 (Nit, Q7) |
| 04 | ĐÃ SỬA | HỒI QUY | **HỒI QUY** | 🔁 ✅ | Đường lỗi lượt 1 (S1 / S2, H·CL-E4, L·CL-E1) nay đúng; 7 503 cuộc gặp lưu nguyên ở 6f, 0 lệch. Nhưng #616 làm cuộc gặp giữ nhóm trước ngày tạo KH, trước đó nhận đúng theo quyết định Owner (DR-43 / K2), nay bị từ chối → DR6-68 (§5.1) |
| 19 | ĐÃ SỬA | ĐÃ SỬA | **HỒI QUY** | 🔁 | 4–5 câu lượt 1 nay 0 đề xuất. Nhưng `aboutTheKh` (#628) quét ngược từng ký tự cho mỗi cụm khớp → ghi chú một dòng dài chậm bậc hai. 🔁: 18 003 ký tự 518 ms, 36 003 ký tự 2 042 ms; bản `8855345` 1–7 ms (Claude C). Claude tự ghi CL2-C4 là "mới do đợt sửa" → DR6-79 |
| 30 | ĐÃ SỬA | ĐÃ SỬA | **HỒI QUY** | ✅ 📏 | 3 cột ở 1 440 đúng (exe 371 px, Codex 376 px). Nhưng ở cửa sổ mặc định, một link 66 ký tự liền trong ghi chú KYC nay tràn 128 px sang cột KYC Intelligence; bố cục 2 cột cũ không tràn (Claude D đo cả bản R30a). Không chỗ nào đặt `overflow-wrap` → DR6-82 |
| 49 | ĐÃ SỬA | SỬA MỘT PHẦN | **SỬA MỘT PHẦN** | 🔁 | K20 (Owner 16/10): "gộp **mọi** khoảng trắng Unicode". `normalizeText` dùng `\s` của JS, không có U+0085 (Unicode White_Space). 🔁: `"Bình\u0085Minh"` giữ nguyên, `"\u0085"` không rỗng. Claude A có thấy U+0085 được giữ nhưng không ghi phát hiện → DR6-72 |
| 60 | ĐÃ SỬA | SỬA MỘT PHẦN | **SỬA MỘT PHẦN** | ✅ 📄 | Mô tả DR6-60 (tổng hợp lượt 1 §5.8) có J5. Issue #606 chỉ nhận "phần TS: `readBackup` đóng DB tạm" (MJ15), không nói tới J5, không có quyết định hoãn. J5 vẫn sống (Claude B, Codex B). Lượt 1 đề xuất "không cần sửa, hoặc đổi comment" → DR6-88, Q10 |
| 62 | SỬA MỘT PHẦN | ĐÃ SỬA | **SỬA MỘT PHẦN** | ✅ 🧪 | BR3 lượt 1 là "checkbox coi là ô chữ" (`home-pc/claude/D.md:94`) và vẫn sống: `menuBlocked` của test giả `closest` bằng `selector.includes('textarea')` (`block-reload.test.ts:29-37`), nên selector thật không bao giờ được thử. Đột biến "BR3" của Codex là bỏ hẳn miễn trừ ô chữ, một đột biến khác, nên bị giết. Issue #606 không gồm BR3 / BR4 (PR #644 tự ghi) → DR6-90 |

Luật chấm của phiên tổng hợp (plan §L2.4): **HỒI QUY** khi phần sửa làm một thao tác người dùng làm được bằng app (kể cả chữ suy biến nhập qua màn) từ đúng thành sai; biến thể chỉ tới được bằng file sửa tay (DR6-71) không tính. Mục "Liên quan" của phát hiện mới cho biết DR6 nào kéo theo.

### 3.2 Bảng đủ 59 DR6

"Gỡ sửa" = đột biến "gỡ tạm phần sửa" / áp lại đột biến lượt 1 (K = bị giết, S = sống), gộp hai bên. Cột cuối là vấn đề lượt 2 liên quan.

| DR6 | Mức L1 | Issue → PR | Claude | Codex | **Chốt** | Bằng chứng chính (lượt 2) | Gỡ sửa | Lượt 2 |
|---|---|---|---|---|---|---|---|---|
| 01 | M | #592 → #614 | ĐÃ SỬA | SMP | **SỬA MỘT PHẦN** | Dữ liệu tải: 4 249 / 4 249 cuộc gặp giữ nhóm khôi phục ngay (cả hai bên); màn: E18, 60 / 60, 130 / 130 bản ghi, 0 / 1 170 ô | K 8 | 69, 71, 93 |
| 02 | M | #594 → #618 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Lịch hôm nay + hẹn tiếp ở RE mới; 5c nói đúng số lịch chuyển; 6h / 6c lấy RE hiện tại; 0 lệch số sau bàn giao | K 12 · S 1 (R16) | 87 |
| 03 | L | #592 → #614 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Ca cùng ngày không thêm chuyển nhóm; E20 chặn | K 4 | 69, 94 |
| 04 | L | #593 → #616 | ĐÃ SỬA | HỒI QUY | **HỒI QUY** | Ca lượt 1 đúng; 7 503 cuộc gặp lưu nguyên 6f 0 lệch; **cuộc gặp trước ngày tạo KH bị từ chối** | K 10 · S 3 (R04g, N1, N2) | **68**, 70, 91 |
| 05 | L | #593 → #616 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Chuyển tay lùi qua cuộc gặp → `TRANSITION_BEFORE_MEETING`; bất biến dữ liệu tải 0 ca | K 6 | 103 |
| 06 | L | #595 → #620 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | 382 trang ghi đè: 0 lọt; exe từ chối, không backup | K 5 | 73, 98 |
| 07 | L | #595 → #620 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | `FILE_IN_USE` / `ACCESS_DENIED` / đĩa đầy đúng câu trên exe; CloseGuard thử lại được | K 12 · S 1 (G07d) | 74, 75, 88 |
| 08 | L | #595 → #620 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Lần lưu cuối schema 11 (lượt 1: schema 0) | K 2 | — |
| 09 | N | #595 → #620 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | 40 lần giết giữa backup: 0 `.tmp` còn lại; `%TEMP%` không tăng | K 3 · S 1 (Drop) | 88 |
| 10 | L | #596 → #617 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Key URL-encode rồi `\u0025` → `AI_BAD_RESPONSE`, che `***` | K 6 | 76 |
| 11 | L | #596 → #617 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Tên model sai → `AI_BAD_REQUEST` | K 3 | 88 |
| 12 | N | #596 → #617 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | exe `FileVersion` / `ProductVersion` 1.0.0; ba file 1.0.0 | K 2 · S 1 (cả ba về 0.1.0) | 88 |
| 13 | L | #596 → #617 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Chỉ `rlib`; Home PC: kiểm bằng `Cargo.toml` + `target`, build release 1 m 37 s ghi lại (không có số lượt 1 cùng máy) | K 2 | — |
| 14 | N | #596 → #617 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Lệnh `core:default` cũ "not allowed by ACL"; CSP chặn `base-uri`, `form-action` trên exe | K 4 | — |
| 15 | L | #598 → #628 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Phiên mở trước / trong lúc thay → `discarded`; `webChip` không ném; màn bỏ phiên | K 3 · S 2 (R15b, R15d) | 89 |
| 16 | L | #598 → #628 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | V1 đếm sau `\p{Cf}`; `LAW_NAME` mọi kiểu chữ đúng G5 | K 5 | 77, 102 |
| 18 | L | #598 → #628 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Seed / dữ liệu tải / snapshot `@2` | K 4 | — |
| 19 | L | #598 → #628 | ĐÃ SỬA | ĐÃ SỬA | **HỒI QUY** | Câu lượt 1 → 0 đề xuất; **ghi chú một dòng dài chậm bậc hai** | K 7 · S 1 (N19d) | 78, **79** |
| 20 | L | #603 → #638 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Hủy / Thử lại: focus ở chữ ghi chú (e2e của PR đỏ khi gỡ) | K 2 (e2e) | — |
| 21 | L | #599 → #632 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Thấp nhất 4,81:1 ở mọi khối mờ (hai bên đo, cùng số) | K 2 (e2e) · S 1 (R21c) | 89 |
| 22 | N | #598 → #628, #599 → #632 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Chữ "1 024 token", "200.000", `ai-eval.md:13` đúng | K 1 | 97 |
| 26 | L | #602 → #636 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | IS chỉ là người đánh giá → 9b tắt Xóa, câu riêng | K 4 | 80 |
| 27 | L | #597 → #623 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | "6 tỷ" → dòng đọc lại; chữ tự do không | K 3 | 101 |
| 28 | L | #597 → #623 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | 7d / 7c có mã F; 173 + 240 trường 0 lệch | K 4 | — |
| 29 | L | #597 → #623, #607 → #619 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | "tính 1 RF" = 5f = chỉ số (473 / 686 KH 0 lệch); ô Kỳ: dòng ghi lệch có, khớp app | K 5 | — |
| 30 | L | #597 → #623 | ĐÃ SỬA | ĐÃ SỬA | **HỒI QUY** | 3 cột ở 1 440 (exe); **link dài tràn sang cột bên** | K 2 (e2e) | **82** |
| 31 | L | #602 → #636 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Điền sẵn RE góc nhìn; dòng báo ngoài góc nhìn | K 3 | 96 |
| 32 | L | #602 → #636 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | e2e 111 RE / team | K 2 | — |
| 33 | L | #602 → #636 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Hành vi đúng (gồm ca 7a `INVALID_TEXT` ở thao tác thường); test giữ 3 / 6 phần | K 6 · S 3 (R33c–e) | 90 |
| 34 | L | #603 → #638 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Exe: Back / Forward chuột, phím, Alt+← / → bị chặn (Claude bằng `SendInput` thật, Codex bằng CDP Input), hộp và bản nháp còn | K 6 | 96 |
| 35 | L | #603 → #638 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Focus `h1` + `document.title` ở mọi đường vào | K 9 | 81, 83 |
| 36 | N | #607 → #619 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** (ghi lệch) | `nghiem-thu-v1.md:388-391` khớp app | — | — |
| 38 | L | #600 → #634 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Giao thừa: 5 hộp giữ năm cũ | K 4 · S 3 (R38c–e) | 91 |
| 39 | L | #600 → #634 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | 415 KH có cuộc gặp gần nhất trống → không hiện dòng | K 3 | — |
| 40 | L | #600 → #634 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | 8d so FYP nộp đang gõ | K 3 | — |
| 41 | L | #600 → #634 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | 8d bốn dòng tháng cũ / mới | K 8 | — |
| 42 | L | #600 → #634 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | 6c chuyển tới lịch mới (e2e đỏ khi gỡ) | K 2 | — |
| 43 | L | #601 → #630 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Sắp cột, `aria-label` / `aria-describedby`, TR-5 sang ngày | K 7 · S 1 (R43e) | 91, 99, 100 |
| 44 | L | #601 → #630 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Kết quả giống hệt có / bỏ chỉ mục; Node ×8–16, màn ×3,5 (§7.4) | K 4 | 84, 98 |
| 45 | L | #601 → #630 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Một thông báo mỗi lúc | K 2 | — |
| 46 | L | #597 → #623 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | "Năm 2026 · 01/01 – …" | K 2 | — |
| 47 | N | #607 → #619 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** (ghi lệch) | NT-TQ-06 + lệch 1a khớp `formatPercent` | — | — |
| 48 | N | #607 → #619 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** (ghi lệch) | 7 điểm `nghiem-thu-v1.md:392-398` khớp app | — | — |
| 49 | L | #604 → #640 | ĐÃ SỬA | SMP | **SỬA MỘT PHẦN** | U+200B / NBSP / NFD / surrogate bị chặn ở lệnh + nhập; **U+0085 chưa gộp** | K 8 | 72 |
| 50 | L | #604 → #640 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Mâu thuẫn 2 / `2.0` → luật 7 | K 3 | — |
| 51 | N | #604 → #640 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | `INVALID_CHOICE` / `INVALID_TRANSITION` thay lỗi CHECK thô | K 3 | — |
| 52 | N | #604 → #640 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | CHECK `people_team_none` sau migration 0010 | K 2 | — |
| 54 | N | #607 → #619, #604 → #640 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** (ghi chú golden) | Ghi chú L-09 có, khớp app | — | — |
| 55 | L | #605 → #642 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Key trong `content` → `AI_BAD_RESPONSE`, 0 lần trong file kết quả (lượt 1: 25) | K 11 · S 1 (tương đương) | 76 |
| 56 | L | #605 → #642 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | `null` + `length` → thử lại như app | K 8 · S 1 (N5, chỉ chữ cột token) | — |
| 57 | L | #605 → #642 (+ #646) | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | `pr-status` / `merge-pr --dry-run` thật với `gh` giả: re-run + code → chặn; 150 file đọc đủ; 3 001 → chặn | K 14 · S 3 (I/O) | 85 |
| 58 | L | #605 → #642 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | Đọc `CLAUDE_CONFIG_DIR` + `~/.claude`, in thư mục đã đọc | K 3 · S 1 (tương đương) | 86 |
| 59 | L | #606 → #644 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | M31, M15, M10, N19 bị giết (lượt 1: sống) | K 9 | — |
| 60 | L | #595, #596, #606 | ĐÃ SỬA | SMP | **SỬA MỘT PHẦN** | RS4 / R8, RS9, `sync_all`, A14, MJ15 bị giết; **J5 vẫn sống** | K 10 · S 2 (J5, hai bên) | 88 |
| 61 | L | #598 → #628 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | C25 / C26, C74 / C75, V3 / V14 bị giết | K 15 | 88 |
| 62 | L | #606 → #644 | SMP | ĐÃ SỬA | **SỬA MỘT PHẦN** | X5, X6, D6, BR4 bị giết; **BR3 vẫn sống** | K 10 · S 1 (BR3) | 90 |
| 63 | L | #606 → #644 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | CX-E4 ×5, AV8 bị giết | K 8 | — |
| 64 | L | #605 → #642 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | P3, P5, S3, S9 bị giết | K 8 | — |
| 65 | N | #606 → #644 | ĐÃ SỬA | ĐÃ SỬA | **ĐÃ SỬA** | `tables.test.ts` cũ đỏ dưới UTC−7, mới xanh; `stats.ts` nền 0; e2e chỉ quét `content` | K 5 | 92 |

Đếm: **52 ĐÃ SỬA** (gồm năm mục "ghi lệch đã biết": DR6-29 ô Kỳ, 36, 47, 48, 54, đã đối chiếu dòng ghi với app) · **4 SỬA MỘT PHẦN** · **3 HỒI QUY** · 0 CHƯA SỬA. Mục hồi quy có việc sửa ở §8 (Issue tạo sau khi Owner trả lời §9).

**Refactor / hiệu năng không đổi hành vi (plan §L2.4):** DR6-44 nhanh hơn như PR nói; hai bên so JSON `listTrash` + đếm từng KH có / bỏ ba chỉ mục 0009 trên cùng DB (giống hệt), gói E so sha256 nội dung màn hai bản (trùng). DR6-13: trên Home PC kiểm bằng `Cargo.toml` + `target` (không còn `.lib` 186 MB); thời gian build không có mốc cùng máy. Refactor bloat (DR6-25, 66, 67) đã hoãn nên không có gì khác để kiểm.

## 4. Lượt 2 kiểm được gì (không có lỗi)

- **Khứ hồi và bất biến dữ liệu.**
  - Fuzz lệnh: Claude A 16 000 lệnh (8 hạt giống); Codex A 3 000 bước (2 hạt giống, 13 loại lệnh). Lệnh bị từ chối không đổi dữ liệu; lệnh nhận luôn để lại dữ liệu luật nhập nhận; xóa → khôi phục = như cũ (333 + 637 + 4 249 lần).
  - Dữ liệu cũ: migration 0009 / 0010 trên DB schema 9 có dữ liệu tải giữ mọi dòng. Exe lượt 2 mở được `Project2C-data\` do code lượt 1 ghi (512 ms, backup đúng bản trước migration).
  - Demo sinh được và qua luật nhập backup ở **mọi ngày** 17/10/2026 → 31/12/2027 (+ 29/02/2028, 01/01/2029); lệnh dữ liệu tải qua 5 ngày neo × 8 hạt giống.
  - Hai phiên bản: backup của app 0.1.0 nhập được vào v1.0; chiều ngược bị chặn đúng `SCHEMA_TOO_NEW`.
- **Chuỗi nhiều bước qua nhiều gói** (gói F hai bên, gói E, gói A):
  - bàn giao → dời → bàn giao lần hai → ghi kết quả + hẹn tiếp → xóa / khôi phục → xuất / nhập → chỉ số và Excel theo từng RE;
  - xóa KH lúc 23:59 → nhập ở máy khác 00:01 hôm sau → khôi phục: 0 / 209 dòng màn, 0 / 49 dòng Excel khác trước;
  - phiên ChatGPT web qua bàn giao, ghi chú KYC mới, xóa / khôi phục KH, xuất / nhập.
  - Không chuỗi nào lộ lỗi mức Medium ngoài DR6-68.
- **Lớp file và exe.**
  - Hỏng file: cả trang (382 trang, 0 lọt), sector 512 B (0 lọt so `integrity_check`); một byte thì có DR6-73.
  - 40 lần giết tiến trình giữa backup; fuzz S-2 900 vòng × 40 thao tác: 0 vi phạm.
  - ACL / CSP mới chặn đúng trên exe; CloseGuard thử lại lưu được.
- **AI.** Phiên web theo `generation` ở mọi thời điểm so với lần thay dữ liệu; V1 / `LAW_NAME` đúng chữ G5; tương phản mọi khối mờ ≥ 4,81:1; focus sau Hủy / Thử lại / Bỏ / Đóng; seed / tải / snapshot `@2`.
- **Màn.** Exe chặn Back / Forward với input thật; 3 cột ở 1 440 trên exe; mã F 7d = thẻ KYC (413 trường); "tính 1 RF" của dòng thời gian = 5f = chỉ số cho từng KH; tương phản chữ mới ≥ 6,17:1.

## 5. Phát hiện mới — kiểm lại

### 5.1 DR6-68 (Medium) — cuộc gặp Đã gặp ghi bù trước ngày tạo KH

**Đúng, Medium.** Hồi quy do #616, trái quyết định Owner còn hiệu lực.

- **Code ở `4217ed4`.**
  - `applyOutcome` so "nhóm sau" với `stageOnDay(…, ngày cuộc hẹn)` (`appointments.ts:405-409`). Trước transition đầu, `stageOnDay` trả `null` (`customers.ts:324-336`), nên mọi "nhóm sau" đều thành chuyển nhóm.
  - `appendTransition` ghi ở ngày trước transition tạo KH → D10 (`customers.ts:283-289`) → `TRANSITION_BEFORE_LATEST {date: <ngày tạo KH>}`.
  - Khôi phục: `isStageOfDay` (`customers.ts:343-355`) trả `false` trước ngày tạo → `STAGE_NOT_ON_DAY` (`appointments.ts:304-312`). Luật nhập 4 dùng cùng hàm (`backup-validation.ts:220-226`) nên từ chối file có cuộc gặp như vậy.
  - Hộp 6c: `meetingDay` trả `from: null`, `OutcomeDialog.tsx:170` lấy nhóm hiện tại → hộp cho chọn "giữ nguyên"; Lưu thì nhận câu "Ngày chuyển trước lần đổi nhóm gần nhất (10/10/2026)" — 10/10 là ngày tạo KH, không phải một lần đổi nhóm.
- **Ở `8855345`:** `applyOutcome` so với nhóm **hiện tại** (`git show 8855345:packages/db/src/appointments.ts`, dòng 358-361) → giữ N3 không sinh chuyển nhóm → nhận.
- **🔁 Phiên tổng hợp chạy lại** (probe Node, `openDatabase` đồng hồ 17/10/2026; KH tạo N3 ngày 10/10, lịch 05/10):

  ```text
  MET keep N3 on 05/10 (created 10/10): TRANSITION_BEFORE_LATEST {"date":"10/10/2026"}
  MET change N2 on 05/10: TRANSITION_BEFORE_LATEST {"date":"10/10/2026"}
  NO_SHOW on 05/10: OK
  control MET keep N3 on 10/10 (= creation): OK
  ```

  Trùng Claude A (`p01-before-creation`, có cả bản `8855345`: "OK") và Codex A (`precreation.mjs`: lượt 1 "OK / MET", lượt 2 "TRANSITION_BEFORE_LATEST / SCHEDULED"; nhập backup lượt 2 `BACKUP_INVALID rule 4`; khôi phục `STAGE_NOT_ON_DAY`).
- **Quyết định đang có hiệu lực.**
  - DR-43 (Owner 06/10, deep review Phase 1–4 §11 điểm 5; review-notes ACCEPTED): "HĐ / cuộc gặp MET mang ngày hoặc nhóm trước ngày tạo KH là **nhập bù hợp lệ** — không thêm luật ở lệnh hay khi nhập backup". Đây là K2 của `common\known.md` lượt 2.
  - K18 (Owner 15/10, "nhóm của KH tại ngày cuộc hẹn") không nói tới ca trước ngày tạo; Issue #593 / PR #616 không nhắc DR-43.
  - Spec Phase 3 §4 dòng `recordMeetingOutcome` (sau T-232) so "với nhóm tại ngày cuộc hẹn (`stageOn`)", mà trước ngày tạo thì `stageOn` không có nhóm. Hai quyết định Owner mâu thuẫn ở ca này; spec thiếu ca → cần Owner chốt (G2).
- **Mức.**
  - Thao tác bình thường: RE gặp KH trước, nhập KH vào app sau (ô Ngày của hộp tạo KH mặc định là hôm nay), rồi ghi bù buổi gặp. Chính luồng này đã được Owner quyết là hợp lệ.
  - App chặn hẳn việc ghi kết quả Đã gặp cho mọi lịch trước ngày tạo. Đường vòng: xóa rồi tạo lại KH với ngày sớm hơn (mất ghi chú KYC, lịch đã nhập), hoặc ghi sai trạng thái. Ngày tạo KH không sửa được ở 5c.
  - → **Medium** (thước §4.3: chặn việc chính, có đường vòng). Không High: không sai dữ liệu đã lưu, câu báo hiện ngay.
  - Claude chấm Low vì "cần ngày gặp trước ngày tạo KH". Phiên tổng hợp không coi đó là điều kiện hiếm, vì đây là luồng nhập bù mà DR-43 được ghi ra để cho phép.
- **Đề xuất (Q1).**
  - (a) Trước ngày tạo, "nhóm của ngày" = nhóm tạo KH (transition đầu) ở `stageOnDay`, `isStageOfDay`, `meetingDay`. Khi đó cuộc gặp giữ nhóm ghi / khôi phục / nhập được như trước #616; đổi nhóm trước ngày tạo vẫn bị D10 như DR-43 đã ghi; hộp 6c đi từ nhóm tạo KH. ≈ 10–20 dòng SP + test lệnh, luật nhập, `outcome-form`, e2e 6c ghi bù.
  - (b) Bỏ K2 cho cuộc gặp: sửa ACCEPTED DR-43 + spec Phase 3 §4; hộp 6c khóa ô nhóm, nói rõ "trước ngày tạo KH" thay câu D10.

### 5.2 Chênh mức

| Phát hiện | Bên gán | Chốt | Lý do |
|---|---|---|---|
| CL2-A1 | Low | **Medium** (DR6-68) | §5.1 |
| CL2-F3 | Nit | Low (DR6-85) | Cổng an toàn mở khi đọc thiếu; cùng loại phần "PR > 100 file" của DR6-57 (Low). Hiếm, nên không lên Medium |
| CL2-A5 | Nit | trong DR6-69 (Low) | Cùng nguyên nhân với CL2-F2 / CX2-A3: E20 so mốc thời gian |
| CL2-F4 | Nit (KNOWN) | trong DR6-86 (Low) | Cùng hàm `projectRoots` với CL2-F8 |
| CX2-B1 | Low | Nit (trong DR6-88) | Test hở của một mục Nit (DR6-12 phiên bản): cả ba file cùng về 0.1.0 mới lọt; ghim "1.0.0" thì mỗi lần đổi phiên bản phải sửa test |
| CX2-B2 | Low | Nit (trong DR6-88) | Test hở của một mục Nit (DR6-09): chỉ để rác `%TEMP%` trên máy dev |
| CX2-B4 (J5) | Low | Nit (trong DR6-88) | Lượt 1 đã nói đột biến gần tương đương ở React 19, đề xuất "không cần sửa, hoặc đổi comment" |
| CX2-E1 | Low | Nit (DR6-93) | Chỉ thiếu một dòng chữ trên dòng Thùng rác; hộp xác nhận nói đúng; spec TR-3 tự mơ hồ (§3.1) |

### 5.3 Cùng chỗ, khác nhận định

- **DR6-76 (key qua nhiều lớp escape).**
  - PR #617 cố ý **không** đọc hai lượt JSON: comment `ai.rs:335-337` "the webview parses an answer once"; test `ai.rs:1342-1350` ghim dạng JSON hai lớp là hợp lệ.
  - Claude: cùng lý của DR6-10 (key URL-encode trong chữ webview vẫn là lộ, vì giải một lần là ra) thì JSON / URL hai lớp cùng loại cũng là lộ. Codex: thêm dạng trộn thứ tự theo từng đoạn, có cả ở bản `8855345`.
  - Script eval port đúng luật của Rust nên có cùng kẽ hở; ở đó key vào file kết quả mà Owner commit vào repo public.
  - Mọi dạng đều cần server / proxy cố ý dội key ở đúng dạng đó → Low. Đây là lựa chọn mô hình đe dọa → Q2.
- **DR6-84 (Thùng rác tuyến tính).**
  - Gói E đo trên bản web (gắn DevTools): vượt 200 ms từ ≈ 500 dòng.
  - Gói F đo trên exe: gắn DevTools 264,9 ms ở 713 dòng, đã ngắt 87,6 ms; 1 313 dòng 450,8 / 138,3 ms. Người dùng thật (không DevTools) chạm 200 ms ở ≈ 2 000 dòng (ngoại suy).
  - Probe `e2e/perf` đo `trash.open` khi còn gắn DevTools, nên phóng đại ×2,4–3,3; các thao tác không chạy SQL chỉ lệch ±1 ms (DR6-98).
- **DR6-73 (`quick_check`).** #620 chọn `quick_check` theo Issue #595 (≈ 79 ms). `quick_check` không so nội dung chỉ mục với bảng (tài liệu SQLite), trong khi doc comment `database.ts:48-52` hứa bắt "an index out of step". Claude B: 257 / 600 lần lật một byte chỉ `integrity_check` bắt được. Q3.

## 6. Bảng đầy đủ DR6-68…103

Mức: M = Medium, L = Low, N = Nit. "Ai thấy" ghi mức gốc. Nhóm sửa: §8.

### 6.1 Lõi dữ liệu: cuộc gặp, Thùng rác, hộp lịch hẹn, chữ (gói A, E)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| **68** | Cuộc gặp Đã gặp ghi bù trước ngày tạo KH bị từ chối ở lệnh, khôi phục, luật nhập 4; hộp 6c báo câu D10 sai bản chất. Hồi quy K2 / DR-43 do #616 (§5.1) | CL2-A1 (L), CX2-A1 (M) | **M** | 🔁 ✅ | L2-A |
| 69 | E20 so mốc thời gian (`latest.createdAt > recordedAfter`, `customers.ts:286`) thay vì thứ tự ghi. Hai máy lệch giờ khi xuất / nhập: máy xóa chậm giờ thì chặn sai, nhanh giờ thì khôi phục đè lên chuyển tay ghi sau lúc xóa. Cùng mili giây / đồng hồ lùi: lọt. File có mốc không phần nghìn giây (`z.iso.datetime()` nhận) xếp sai khi so chữ. Sửa: so `seq` | CL2-F2 (L), CX2-A3 (L), CL2-A5 (N) | L | ✅ 📏 | L2-A |
| 70 | Hộp 6f: dời ngày một cuộc gặp **đã chuyển nhóm** (vd. N3 → N2, tính RF) về trước một lần đổi nhóm khác → ô Nhóm sau tự giữ ở nhóm của ngày mới (N4 🔒); Lưu rút chuyển nhóm + RF, KH N2 → N3, mà hộp không nói (tiêu đề vẫn "N3 → N2 · RF"). Lượt 1: lệnh từ chối D10. Hộp 6g làm đúng việc rút này thì nêu hậu quả | CL2-E1 (L) | L | 🔁 ✅ | L2-B1 |
| 71 | Khôi phục cuộc gặp đưa lại chuyển nhóm đã rút mà không kiểm cùng KH (`reinstateTransition`, `customers.ts:430-453`); luật nhập 4 không xét chuyển nhóm đã rút → file sửa tay làm khôi phục đổi nhóm / RF của KH khác, rồi file xuất sau đó bị từ chối | CL2-A4 (L) | L | ✅ 📏 | L2-A |
| 72 | `normalizeText` (`domain/src/text.ts:22-28`) không gộp U+0085 (Unicode White_Space — phần K20 chưa làm, DR6-49) và giữ ký tự vô hình không thuộc `\p{Cf}`: U+3164, U+115F, U+FFA0, U+034F, U+FE00–FE0F (`Default_Ignorable_Code_Point`), U+2800. Tên chỉ gồm các ký tự này không rỗng; "Sao Mai" + U+3164 là team mới; giá trị KYC U+3164 đổi cổng lên PAIN_POINT_ANALYSIS | CX2-A2 (L), CL2-A2 (L) | L | 🔁 📏 | L2-G |

### 6.2 File, Rust, key (gói B, F)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 73 | `quick_check` không bắt hỏng làm chỉ mục lệch nội dung bảng (một byte trong khóa chỉ mục): file mở, chép thành backup mới nhất, hồ sơ KH / hộp 5f / Thùng rác đếm thiếu bản ghi. Claude B: 257 / 600 lần lật một byte chỉ `integrity_check` bắt; trên exe "1 lịch" cho KH có 5 lịch | CL2-B1 (L) | L | ✅ 📏 | L2-C |
| 74 | `project2c.db` có thuộc tính chỉ đọc: app mở bình thường, mọi lần lưu lỗi `PermissionDenied`, dải lưu bảo "file có thể đang mở trong chương trình khác… sẽ được lưu lại ở lần thay đổi tiếp theo", hộp đóng app "Thử lại" không bao giờ được; Nhập backup báo xong mà không vào file | CL2-B2 (L) | L | ✅ 📏 | L2-C |
| 75 | Màn lỗi khởi động giữ `project2c.lock` tới khi tiến trình thoát; câu "…rồi mở lại app" (`fileInUseHelp`, `backupFailedHelp`, `diskFullHelp`) → mở lại khi cửa sổ lỗi còn thì cửa sổ mới "Hãy dùng cửa sổ đó", cửa sổ lỗi không có nút | CL2-B6 (L) | L | ✅ 📏 | L2-C |
| 76 | Nhận diện / che key còn hở: hai lớp escape cùng loại (JSON rồi JSON, URL rồi URL) và thứ tự trộn theo từng đoạn — ở `ai.rs` `readings` (trả lời 2xx vào webview, thông điệp 401 / 429 không che) và `eval-ai-core.mjs` (vào file kết quả eval, `.partial`) (§5.3) | CL2-B4, CL2-F1, CX2-B3, CX2-F2 (đều L) | L | ✅ 📏 | L2-D |

### 6.3 AI (gói C)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 77 | Sau DR6-16, V1 đếm 300 trên chữ đã bỏ `\p{Cf}` nhưng lưu chữ gốc và không còn trần nào cho chuỗi gốc: 300 chữ + 650 000 × U+200B được nhận, ≈ 2 MB vô hình vào `ai_analyses` (chỉ thêm, không xóa) và mọi backup. Cần G5 | CL2-C1 (L) | L | ✅ 📏 | hoãn (G5) |
| 78 | Mock trích xuất vẫn đề xuất cho KH điều nói về người khác (ông nội, bà ngoại, em, anh họ, anh rể, vợ cũ, cô, ba, sếp, hàng xóm), "con" là loại từ (2 con chó, 3 con mèo, 10 con bò) và câu giả định ("nếu đã kết hôn, có 2 con"); không ca test nào cho dấu "!", "?", ";" hay xuống dòng làm ranh giới câu (N19d sống) | CL2-C2 (L), CX2-C1 (L) | L | 🔁 ✅ | L2-E |
| 79 | Hồi quy hiệu năng của DR6-19: `aboutTheKh` quét ngược từng ký tự cho mỗi cụm, trước khi cắt 20 → ghi chú một dòng dài bậc hai. 🔁: 18 003 ký tự 518 ms, 36 003 ký tự 2 042 ms (Claude: Edge 512 ms, 2 298 ms, trang đứng); ghi chú thật 4 640 ký tự 0,5 ms | CL2-C4 (L) | L | 🔁 📏 | L2-E |

### 6.4 Màn, trợ năng (gói D, E)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 80 | Câu mới của hộp 9b cho người hỗ trợ ("Bỏ nhân sự này khỏi người phối hợp và người đánh giá kết quả của các lịch đó trước…") không làm được: người phối hợp chỉ đổi ở 6f (Đã gặp / Hủy / Không đến); lịch Dời lịch không sửa, không xóa được; lịch Dự kiến chỉ xóa cả lịch. 7 / 7 người hỗ trợ trên dữ liệu tải phối hợp lịch Dời lịch | CL2-D2 (L) | L | ✅ 📏 | L2-F |
| 81 | Đổi màn giữ vị trí cuộn của màn trước: mở hồ sơ từ bảng Khách hàng đã cuộn → hồ sơ hiện từ giữa (tên KH, Sửa hồ sơ ở trên khung nhìn); focus đã ở `h1` (`preventScroll`) nhưng khung nhìn không theo | CL2-D3 (L) | L | ✅ 📏 | L2-F |
| 82 | Hồi quy của DR6-30: hồ sơ 3 cột ở cửa sổ mặc định, chuỗi liền dài (link Facebook / Zalo dán vào ghi chú KYC) tràn 128 px sang cột KYC Intelligence; không chỗ nào đặt `overflow-wrap`, cột không `min-w-0`. Ở 1 100 cả trang cuộn ngang (có từ trước) | CL2-D7 (L) | L | ✅ 📏 | L2-F |
| 83 | Focus rơi về `body` khi nút mở hộp / nút bấm tự gỡ: Lưu ở 6c, 6g, 6h, 8a (ô trống), 8b, Khôi phục ở Thùng rác (`Dialog` chỉ trả focus khi nút mở còn trong trang, `Dialog.tsx:37-41`); Bỏ một dữ kiện đang soạn ở 7a (`KycDialogs.tsx:334`). Cùng loại DR6-35, chỗ khác | CL2-E8 (L), CX2-D1 (L) | L | ✅ 📏 | L2-B2 |
| 84 | Thùng rác (TR-6 không tự dọn) mở chậm tuyến tính theo số dòng (3–4,5 câu SQL mỗi dòng). Exe không DevTools: 31,6 / 48,3 / 87,6 / 138,3 ms ở 113 / 263 / 713 / 1 313 dòng → 200 ms ở ≈ 2 000 dòng; probe (gắn DevTools) vượt 200 ms từ ≈ 510 dòng (§5.3) | CL2-E7 (L) + số CL2-F7 | L | ✅ 📏 | hoãn (Q8) |

### 6.5 Công cụ (gói F)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 85 | Cổng "tested base" đọc `gh api compare` một lần, không phân trang, không so `total_commits` (`pr-status.mjs:53-60`). Theo tài liệu REST, danh sách tối đa 250 commit, mới nhất → > 250 commit trên `main` sau bản đã test thì commit code ở phần cũ hơn không chặn | CL2-F3 (N), CX2-F1 (L) | L | ✅ (PLAUSIBLE phần API) | L2-H |
| 86 | `retro.mjs` chỉ đọc thư mục cấu hình của phiên + `~/.claude`: Home PC có `.claude`, `.claude-b`, `.claude-c` (76 / 77 / 16 transcript của repo) → chạy từ phiên `.claude-c` thì bỏ 77 transcript của `.claude-b`. Khử trùng bằng so chuỗi nên `CLAUDE_CONFIG_DIR` dạng 8.3 / khác hoa thường đếm đôi (KNOWN #642 + bằng chứng mới: cách "so chữ thường" của sổ không đủ). `docs/metrics/README.md:24` vẫn nói chỉ đọc `~/.claude` | CL2-F8 (L), CL2-F4 (N), CL2-F6 (N) | L | ✅ 📏 | L2-H |

### 6.6 Test hở (đột biến sống)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 87 | Gói A: nhánh "0 khi KH đã là của RE đó" của `previewHandover` (R16) — hộp 5c sẽ báo "1 lịch chuyển" ngay khi mở mà không test nào đỏ | CL2-A3 | L | 🧪 ✅ | L2-A |
| 88 | Gói B: `create_dir_all` → `ACCESS_DENIED` (G07d, ca Program Files); `TempDir` không có `Drop` vẫn 58 / 58; test phiên bản chỉ so ba file với nhau (cả ba về 0.1.0 vẫn xanh); id `AI_MODELS` ↔ luật tên model của Rust; J5 (phần còn của DR6-60) | CL2-B3 (L), CL2-B5 (N), CX2-B1 (L), CX2-B2 (L), CX2-B4 (L) | L | 🧪 ✅ | L2-C |
| 89 | Gói C: DR6-15 — panel bỏ phiên khi dữ liệu thay (R15b sống cả e2e) và thứ tự "đọc `generation` trước `await`" (R15d); DR6-21 — khối AI chi tiết lịch hẹn STALE (R21c: 4,44:1, e2e 68 / 68 xanh) | CL2-C7, CL2-C5 | L | 🧪 | L2-E |
| 90 | Gói D: DR6-33 ba phần (hai hộp Xóa `retriesDelete`, khung lỗi lưu 7a mất khi gõ — R33c–e sống cả bộ e2e); BR3 của DR6-62 | CL2-D5, CL2-D1 | L | 🧪 ✅ | L2-F |
| 91 | Gói E: ba nhánh "giữ nhóm" của 6c / 6f (N1, N2, R04g — trên R04g hộp 6f hiện lại chuyển nhóm giả); phần nối DR6-38 ở 6f / 6h / 8a–8d (R38c–e: trên màn lỗi giao thừa quay lại); `headerHidden` Thùng rác (R43e) | CL2-E4, CL2-E5, CL2-E6 (N) | L | 🧪 📏 | L2-B1 |

### 6.7 Chữ, tài liệu, trợ năng nhỏ, bloat (Nit)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 92 | `backup-invariants.test.ts:1078` đặt đồng hồ 10:00 UTC → đỏ ở UTC−11 (Pago Pago), trong khoảng UTC−11…+12 mà comment DR-15 (#644) bảo đảm | CL2-F5 | N | 📏 ✅ | L2-H |
| 93 | Dòng Thùng rác của cuộc gặp giữ nhóm không nói "Không đổi nhóm KH" hay nhóm đã ghi, như TR-3 và mục tiêu Issue #592 viết; dòng bị chặn của cùng loại thì có "nhóm sau N3" (§3.1) | CX2-E1 (L) | N | ✅ 📄 | L2-B1 (Q7) |
| 94 | Câu chặn E20 "Nhóm KH đã đổi ngày 15/09/2026, **sau** ngày cuộc hẹn này" cho lịch 15/09/2026 — sai theo nghĩa thường; spec E20 (`phase-6-hoan-thien.md:139`) ghi đúng câu này | CL2-E2 | N | ✅ 📄 | L2-B1 (Q7) |
| 95 | Mockup 11c (`trash.html:249-250`) còn ví dụ E7 cũ: chuyển tay ngày 10/10 → "Nhóm KH giữ N2"; E7 đã thu hẹp (Owner 15/10): ngày sau → chặn như E6. "Lệch mockup đã biết" chưa ghi | CX2-E2 | N | 📄 | docs |
| 96 | Danh mục nghiệm thu chưa có hành vi mới của đợt sửa: exe chặn Back / Forward (NT-EX-05 chỉ F5, Ctrl+R; ghi chú review #638 dặn thêm), dòng báo KH tạo ngoài góc nhìn (PR #636 để lượt 2 cân nhắc), hộp 9b của người hỗ trợ / người đánh giá (NT-TM-10 chỉ ca RE) | CL2-D6 | N | 📄 | docs |
| 97 | `docs/user-guide/10-su-co.md:82` còn chép "(quá 200 000 ký tự)", app nay "200.000" (DR6-22) | CL2-C6 | N | ✅ | docs |
| 98 | `docs/metrics/phase-6.md` chưa có mốc Home PC lượt 2 (`reload.*`, `app.open-data` đã gồm `quick_check`) nên lần đo sau / G7 sẽ còn báo ⚠️; probe `e2e/perf` đo `trash.open` khi còn gắn DevTools (×2,4–3,3) mà README chỉ nói debugger làm chậm lệnh ghi | CL2-B7, CL2-F7 | N | 📏 | docs (+ `probe.perf.ts` nếu Owner muốn) |
| 99 | Tên nút "Khôi phục HĐ nộp {ngày} của KH {tên}" trùng nhau khi hai HĐ cùng KH nộp cùng ngày (thiếu FYP như dòng "Bản ghi") | CL2-E3 | N | ✅ 📏 | L2-B1 |
| 100 | Cột nút của thẻ Lịch hẹn trong hồ sơ và bảng thành viên team có tiêu đề cột rỗng; `DataTable` đã có `headerHidden` (DR6-43 dùng ở Thùng rác) | CL2-D8 | N | ✅ 📏 | L2-B2 |
| 101 | Dòng đọc lại tiền KYC (7b / 7c / 3f) gọi `parseVnd` trên chữ chưa chuẩn hóa: "6" + U+200B + "tỷ" không có dòng nhưng lưu thành "6tỷ" (K20 "cùng một hàm ở UI") | CL2-D4 | N | ✅ 📏 | L2-F |
| 102 | `LAW_NAME` chỉ miễn "kỷ", "quy" (chính tả y, đúng chữ G5 §8.4): "kỉ luật Thép", "qui luật Thị trường" bị V6 chặn nhầm; 0 lần trong eval thật | CL2-C3 | N | ✅ 📏 | hoãn (G5) |
| 103 | Luật D7 mở rộng (cuộc gặp giữ nhóm sau giữ chuyển nhóm) viết ba nơi: lệnh, `fillTrash` của seed, `outcomeLock` của màn. Không đo được chi phí; cùng loại DR6-67 | CL2-A6 | N | ✅ | hoãn |

## 7. Bloat và hiệu năng

### 7.1 Exe release ở SHA ghim — mọi thao tác trong ngưỡng

`common\baseline.md` (probe `e2e/perf`, Home PC, so `perf-ref` lượt 1 cùng máy; không so nền T-219 vì đo ở laptop — plan §L2.6):

| Thao tác | Lượt 1 Home PC (`8855345`) | Lượt 2 (`4217ed4`) | Ngưỡng `phase-6.md` | |
|---|---|---|---|---|
| `app.open-data` | 189 ms | 301 ms ⚠️ (+60 %) | ≤ 600 ms | ✅ |
| `reload.*` (6 màn) | 180–293 ms | 247–355 ms ⚠️ (+62…+67 ms) | < 500 ms | ✅ |
| `trash.open` | 80 ms | 73 ms | < 200 ms | ✅ |
| `customer.open-ai` / `customer.ai-history` | 20 / 12 ms | 18 / 2 ms | < 200 ms | ✅ |
| Các thao tác màn còn lại (lịch hẹn, KH, Tổng quan, Báo cáo, lọc Thùng rác) | 6–22 ms | 5–22 ms | < 200 ms | ✅ |
| `backup.read` / `backup.import` / `backup.export` | 794 / 49 / 424 ms | 814 / 43 / 422 ms | ≤ 2 000 / 500 / 1 000 ms | ✅ |
| `reports.export-excel` | 24 ms | 27 ms | ≤ 500 ms | ✅ |
| `appointments.next-month` / `next-year` | 102 / 106 ms | 99 / 106 ms | ≤ 300 ms; Năm − Tháng ≤ 50 ms | ✅ |
| `db.save` | 140 ms | 147 ms | ≤ 400 ms | ✅ |
| JS heap | 16,4 MB | 16,5 MB | ≤ 21 MB | ✅ |
| Mở lần đầu (gọi exe → màn đầu có số liệu, LCP, cách T-227) | exe Phase 4 max 3 937 ms | 3 526 ms | xấu hơn khi > 4 724 ms | ✅ |

**7 dòng ⚠️ đã quy được nguyên nhân, không phải phát hiện P:**

- Mỗi lần trang mở dữ liệu có file (khởi động, mọi lần tải lại webview) nay chạy `quick_check` đồng bộ (DR6-06). Claude B đo ngay trong WebView2 của exe: 60,5–63,5 ms. Codex B đo trong Node: 68,2 ms; `openAppData` từ file 71,0 ms so ≈ 3,5 ms lượt 1.
- File lớn hơn 4,6 % (14 069 760 so 13 455 360 B) vì ba chỉ mục 0009.
- Hai phần cộng lại khớp +62…+67 ms của `reload.*`.
- `app.open-data` (1 mẫu mỗi lần chạy) còn phụ thuộc trạng thái profile WebView2 (Claude F): mở lần đầu của profile mới ≈ 406 ms, mở lại cùng profile 301 ms, tải lại trang 221–236 ms. Điều này giải thích phần lớn cờ `app.open-data` của lượt 1 (Codex F Home PC: "cùng exe, khác profile WebView2").
- DevTools gắn chỉ phóng đại `trash.open`, nên 7 dòng ⚠️ không do cách đo (hai lượt cùng đo gắn).
- Chi phí đã chấp nhận ở #620; người dùng chỉ trả lúc mở app (exe chặn tải lại). Cần ghi mốc mới (DR6-98).

### 7.2 Hàm thuần trong Node (dữ liệu tải lượt 2; so lượt 1 cùng máy)

| Hàm | Lượt 2: Claude F / Codex F (trừ dòng ghi khác) | Lượt 1 Home PC, cùng thứ tự | Ngưỡng Phase 4 |
|---|---|---|---|
| `importBackup` | 731 / 756 ms | 710 / 729 ms | ≤ 1 100 ms ✅ |
| `listAppointments` (10 255 lịch) | 44,7 / 45,6 ms | 46,5 / 47,7 ms | ≤ 65 ms ✅ |
| `teamCompare` năm / tháng | 2,95 / 1,46 ms (Codex 2,61 / 1,78) | 3,5 / 2,1 ms | ≤ 15 ms ✅ |
| `reportRows` năm / tháng | 7,51 / 5,93 ms (Codex 7,28 / 6,22) | 10,4 / 6,5 ms | ≤ 15 ms ✅ |
| `monthGrid` | 0,77 / 0,61 ms | 1,0 / 0,64 ms | ≤ 2 ms ✅ |
| `countRecords` | 5,02 / 4,79 ms | 4,8 / 4,9 ms | ≤ 15 ms ✅ |
| `listTrash` (113 dòng; lượt 1 117) | 20,95 / 20,65 ms | 48,7 / 45,6 ms | màn < 200 ms ✅ (×2,3) |
| `exportBackup` | 170,4 ms (Codex lần đầu 246 ⚠️, đo cặp cũ / mới cùng DB: 176,4 / 177,2 — nhiễu) | 169,3 / 180,0 ms | exe ≤ 1 000 ms ✅ |
| Một lệnh ghi + đọc lại đủ 6 bảng | 66,9 / 73,5 ms | `tables()` 80,6 ms | màn < 200 ms ✅ |
| Phần AI của hồ sơ KH (KH nhiều phân tích nhất) | 0,37 / 0,21 ms | 0,42 ms | ✅ |
| Bộ nhớ: 8 lần `readBackup` + `importBackup` | `rss` 502–506 MB, heap 55,6–55,9 MB, không tăng | — | không rò |

Không hàm nào xấu hơn lượt 1 cùng máy theo luật nhiễu (> 20 % **và** > 10 ms). Code mới của đợt sửa trong hộp (`meetingDay`, `heldStage`, `policyChange`, `prefill`…) ≤ 0,34 ms p95 mỗi lần render (Claude E). Mọi thao tác màn đo trên bản web với dữ liệu tải ≤ 88 ms (gói D, E).

### 7.3 Phát hiện P

DR6-79 (Low, hồi quy Mock trích xuất trên ghi chú suy biến), DR6-84 (Low, Thùng rác tuyến tính), DR6-98 (Nit, mốc / cách đo). Không thao tác chính nào vượt ngưỡng trên dữ liệu tải.

### 7.4 DR6-44 — nhanh hơn, kết quả không đổi

| Thùng rác | Node có chỉ mục (Claude F) | Node bỏ 3 chỉ mục 0009, cùng DB | Lượt 1 Home PC | Exe `trash.open` gắn / ngắt DevTools (Claude F) |
|---|---|---|---|---|
| 113 dòng (dữ liệu tải, 15 KH xóa) | 20,95 ms | 85 ms (Codex A) | 48,7 ms | 74,8 / 31,6 ms |
| +100 KH xóa | 26,7 ms (Codex A 33,1; Codex F 51,6–67,5) | 254,6–262,7 ms | **211 ms** | — |
| +150 KH xóa (263 dòng) | 31,5 ms | 363–375 ms (Claude A, Codex F) | — | 126,5 / 48,3 ms |
| +400 KH xóa | 52,1 ms (Codex 56,7–66,5) | 884,6–905,3 ms | **815 ms** | — |
| +600 / +1 200 KH xóa (713 / 1 313 dòng) | 68,2 / 115,9 ms | — | — | 264,9 / 450,8 · 87,6 / 138,3 ms |

Hai bên so `listTrash` có / bỏ chỉ mục trên cùng DB: giống hệt (`deepEqual`, sha256 nội dung màn). Trên màn bản web: 263 dòng 136,7 ms so 475,9 ms khi bỏ chỉ mục (×3,5).

### 7.5 Bloat — không có code chết chạy được có chi phí đo được

| Đã chạy / đo | Kết quả | DR6 |
|---|---|---|
| `tsc --noUnusedLocals --noUnusedParameters` (mọi package + app + e2e; hai bên) | 0 | — |
| `pnpm lint:deps` | 0 vi phạm, 315 module / 1 277 phụ thuộc (lượt 1: 309 / 1 244) | — |
| Export ↔ nơi dùng (cả hai bên, ≈ 1 015 export) | Export mới của đợt sửa đều có nơi dùng sản phẩm; phần còn lại là DR6-66 (KNOWN, hoãn) | — |
| Code lặp (Claude F `dup-scan`) | 2 nhóm trùng nguyên thân như lượt 1 (KNOWN #566, #543); 9 nhóm lặp cấu trúc (họ DR6-67); mới: luật D7 mở rộng ×3 | 103 |
| Bundle (`pnpm build:web`) | JS / CSS 2 382 036 B (**+17 753**, gzip +5 038). Chia theo package (Claude F): toàn bộ phần tăng là code app (màn +6 447, i18n +3 619, `db` +3 371, data / shell +1 630, migration +1 390…); **mọi dependency giống từng byte lượt 1** (`zod` 89 716, ECharts 512 882, `exceljs` 931 625…) | — |
| Exe | 5 404 672 B (Δ −9 728 so nền: phiên bản / `crate-type`); dependency Rust không đổi; `cargo clippy -W pedantic` lib 19 cảnh báo (lượt 1: 18; mới là một `doc_markdown`), không cái nào là lỗi | — |
| Dependency | Chỉ đổi phiên bản 1.0.0 và `crate-type = ["rlib"]`; không thêm / bớt | — |
| Khóa i18n | 1 113 khóa (+33), 0 khóa không dùng; 59 mã lỗi `db` (+4) đều có câu | — |
| Coverage | 99,03 / 96,99 / 98,93 / 99,28 % (lượt 1: 98,99 / 97,03 / 98,94 / 99,24) | — |

Đề xuất refactor bloat: không có mục mới ngoài DR6-103 (≈ −15 dòng, gộp khi chạm file như DR6-67).

### 7.6 Chất lượng test

Hai bên áp lại đột biến sống của lượt 1 và "gỡ tạm" phần sửa của 16 PR. Gần như mọi luật sửa có test đỏ khi gỡ: Claude ≈ 195 lần giết / 23 sống ở các dòng R, Codex 105 / 108. Đột biến còn sống có hệ quả thật đã thành DR6-87…91. Chỗ hở đáng kể nhất là **phần nối ở TSX** (6f / 6h / 8a–8d của DR6-38, nhánh giữ nhóm của 6c / 6f, hai hộp Xóa của DR6-33, panel của DR6-15). Vitest không có DOM (thêm là G4), còn e2e chỉ giữ một phần, nên gỡ phần nối thì lỗi lượt 1 quay lại mà CI xanh. Claude bù bằng cách chạy e2e trên bản dựng ngoài repo cho mỗi đột biến TSX.

## 8. Kế hoạch xử lý

### 8.1 Việc còn lại của T-225

1. **PR docs báo cáo gốc** → `docs/reviews/raw/2026-10-17/` (PR riêng, mở cùng lúc với PR này).
2. **Kiểm độc lập bằng log phiên** — xong (§10).
3. **Owner trả lời §9** → tạo Issue sửa theo §8.2 (mẫu Task, milestone Phase 6, ≤ ~400 / ~800 dòng, "Bị chặn bởi" theo file dùng chung).
4. **PR riêng sau khi Owner quyết:**
   - `docs/state/review-notes.md`: mục hoãn / chấp nhận (§8.4), cập nhật KNOWN #642 (8.3 / nhiều thư mục cấu hình).
   - `docs/metrics/phase-6.md`: số liệu deep review lượt 2 và mốc Home PC (DR6-98).
5. Sau đợt sửa: G7. Spec §6.3 không có lượt 3; mỗi PR sửa review phiên sạch như thường.

### 8.2 Nhóm sửa (Phương án 2, §8.5)

| Nhóm | DR6 | Việc | Cỡ ước lượng | File chính | Test chấp nhận | Rủi ro / nhãn | Bị chặn bởi |
|---|---|---|---|---|---|---|---|
| **L2-A** Lõi cuộc gặp | **68**, 69, 71, 87 | Theo Q1 (a): trước ngày tạo, "nhóm của ngày" = nhóm tạo KH ở `stageOnDay`, `isStageOfDay` (lệnh, khôi phục, luật nhập 4) và `meetingDay` (hộp 6c). E20 so `seq` thay mốc thời gian (`checkTransition` nhận `afterSeq`; sửa luôn ca hai máy lệch giờ, cùng mili giây, mốc không phần nghìn giây). `reinstateTransition` chỉ đưa lại chuyển nhóm của chính KH; luật nhập 4 xét chuyển nhóm đã rút có `appointment_id`. Ca test `previewHandover` | ≈ 25–35 SP + ≈ 150 test | `packages/db/src/{customers,appointments,backup-validation}.ts`, `apps/desktop/src/routes/appointments/outcome-form.ts`, spec Phase 3 §4 (G2: ca trước ngày tạo) | Ca CL2-A1 (giữ nhóm 05/10, KH tạo 10/10) nhận ở lệnh, khôi phục, nhập; đổi nhóm trước ngày tạo vẫn D10; E20 với `created_at` đảo thứ tự / bằng nhau; file có chuyển nhóm đã rút của KH khác bị từ chối; R16 bị giết | med | — |
| **L2-B1** Hộp 6f và Thùng rác | 70, 91, 93, 94, 99 | Theo Q6 (a): 6f nêu hậu quả khi dời ngày cuộc gặp có chuyển nhóm làm rút nó (như 6g). Theo Q7 (a): dòng Thùng rác của cuộc gặp giữ nhóm ghi "nhóm sau N3 · không đổi nhóm KH"; câu chặn riêng khi ngày đổi nhóm = ngày cuộc hẹn; spec TR-3 / E20 sửa theo (G2 / G3). Tên nút khôi phục HĐ có FYP. Test hở gói E: N1, N2, R04g, R38c–e (e2e `page.clock` giao thừa cho 6f, 8b), R43e | ≈ 30–45 SP + ≈ 150 test / e2e | `EditOutcomeDialog.tsx`, `trash-view.ts`, `vi.ts`, `outcome-form.test.ts`, e2e `appointment-outcome`, `customer-policies`, `trash`; `docs/design/phase-6-hoan-thien.md` | Mỗi đột biến sống ở DR6-91 có test đỏ; ca CL2-E1 trên màn hiện hậu quả trước khi Lưu; ca E20 cùng ngày đúng câu mới | med | L2-A |
| **L2-B2** Focus và tiêu đề cột | 83, 100 | `Dialog` có đích focus dự phòng khi nút mở đã mất (do nơi gọi chọn: tiêu đề khung Chi tiết, dòng `role="status"`, đầu khung Hợp đồng); 7a Bỏ dữ kiện → focus ô chọn trường; `headerHidden` cho hai cột nút gói D | ≈ 20–40 SP + ≈ 50 e2e | `packages/ui/src/components/Dialog.tsx`, `AppointmentsScreen.tsx`, `CustomerPolicies.tsx`, `SettingsTrash.tsx`, `KycDialogs.tsx`, `CustomerAppointments.tsx`, `TeamScreen.tsx` | e2e bàn phím: sau Lưu ở 6c / 6g / 6h / 8a / 8b / Khôi phục / 7a Bỏ, `activeElement` ≠ `BODY`; tiêu đề cột nút có tên ẩn | low | L2-F (cùng `KycDialogs.tsx`) |
| **L2-C** Lớp file | 73, 74, 75, 88 | Theo Q3 (a): `integrity_check` thay `quick_check` (+ sửa doc comment). `open` từ chối `project2c.db` chỉ đọc bằng `ACCESS_DENIED`. Màn lỗi khởi động: nút "Thử lại" chạy lại `openAppData`, hoặc tối thiểu câu "đóng cửa sổ này rồi mở lại app" (5 khóa). Test: G07d (seam `create_dir`), `TempDir` `Drop`, id `AI_MODELS` ↔ luật tên model Rust; J5 theo Q10 (sửa comment) | ≈ 15–35 SP + ≈ 100 test | `packages/db/src/database.ts`, `apps/desktop/src/data/app-data.ts`, `src-tauri/src/storage.rs`, `shell/StartupError.tsx`, `startup-error.ts`, `vi.ts`, `tauri-contract.test.ts` | Chỉ mục lệch nội dung → từ chối mở, không backup; file chỉ đọc → `ACCESS_DENIED`, không mở; G07d, Drop có test đỏ | med, `build-exe` | — |
| **L2-D** Key nhiều lớp | 76 | Theo Q2 (a): thêm hai cách đọc JSON→JSON, URL→URL ở `readings` của Rust và script eval; đổi ca `ai.rs:1342-1350` thành ca bị chặn; dạng trộn theo từng đoạn hoãn | ≈ 10 SP + ≈ 40 test | `src-tauri/src/ai.rs`, `tools/eval-ai-core.mjs` (+ test) | Hai dạng hai lớp cùng loại → `AI_BAD_RESPONSE`, che trong thông điệp 401 / 429, 0 lần trong file kết quả | med, `build-exe` (gộp build với L2-C) | — |
| **L2-E** AI Mock | **79**, 78, 89 | `aboutTheKh` tính đầu câu / đầu vế một lượt (hoặc dừng ở 20 cụm được nhận); `SOMEONE_ELSE` thêm người khác thường gặp, "<n> con" chỉ khi không theo sau là danh từ con vật / đồ vật, bỏ câu giả định; ca test dấu kết thúc câu. e2e: panel bỏ phiên khi dữ liệu thay (`holdBackup`), unit thứ tự `generation`; e2e tương phản khối AI chi tiết lịch hẹn | ≈ 25 SP + ≈ 80 test / e2e | `packages/ai/src/mock-adapter.ts` (+ test), `ai-analysis.test.ts`, e2e `customer-ai-web`, `appointments` | Ghi chú một dòng 36 000 ký tự < 50 ms; các câu của DR6-78 → 0 đề xuất; R15b, R15d, R21c bị giết | low | — |
| **L2-F** Màn nhập liệu | **82**, 80, 81, 90, 101 | `overflow-wrap` cho chữ ghi chú / dòng dữ kiện + `min-w-0` cột hồ sơ; câu 9b theo Q5 (a); đổi màn cuộn về đầu (trừ khi về thẻ vừa xem); đọc lại tiền trên chữ đã `normalizeText`. Test: hai hộp Xóa khi `DATA_REPLACING`, khung lỗi lưu 7a mất khi gõ, BR3 (selector thật) | ≈ 15 SP + ≈ 100 e2e | `CustomerProfile.tsx`, `KycExtraction.tsx`, `CustomerKyc.tsx`, `PersonDialogs.tsx`, `AppShell.tsx`, `KycDialogs.tsx`, `vi.ts`, `block-reload.test.ts`, e2e | Link 108 ký tự không tràn ở 1 440; `scrollY === 0` sau khi mở hồ sơ từ bảng đã cuộn; R33c–e, BR3 bị giết | low | — |
| **L2-G** Chữ | 72 | Theo Q4: `normalizeText` gộp mọi Unicode White_Space (thêm U+0085) và bỏ mọi `\p{Default_Ignorable_Code_Point}` (gồm `\p{Cf}`), thêm U+2800; lệnh, nhập backup, UI cùng hàm. Dữ liệu giả lập nạp lại (K1) | ≈ 3–5 SP + ≈ 40 test | `packages/domain/src/text.ts` (+ test), test lệnh / nhập ở `packages/db` | Các ký tự của DR6-72 → rỗng / gộp; hai hàm ổn định trên chuỗi ngẫu nhiên; hash dữ liệu tải mới ghi vào PR | med | — |
| **L2-H** Công cụ | 85, 86, 92 | `loadMainSince` đọc `total_commits` (hoặc phân trang), đọc thiếu → chặn như file PR; `retro.mjs` đọc mọi `~/.claude*` có `projects\` + `CLAUDE_CONFIG_DIR`, khử trùng bằng `realpathSync.native`, README dòng 24; đồng hồ 11:00 UTC cho ca `backup-invariants.test.ts:1078` | ≈ 15 dòng `tools/` + ≈ 40 test | `tools/pr-status.mjs`, `tools/pr-core.mjs`, `tools/retro*.mjs`, `docs/metrics/README.md`, `packages/db/src/backup-invariants.test.ts` | Ca 251 commit (code ở phần cũ) bị chặn; ba thư mục cấu hình đọc đủ, 8.3 không đếm đôi; cả bộ unit xanh dưới `TZ=Pacific/Pago_Pago` | low | — |

Tổng Phương án 2: **9 Issue** (+ 2 PR docs), ≈ 160–230 dòng SP + ≈ 750 dòng test. Ba hồi quy (DR6-68, 79, 82) nằm ở L2-A, L2-E, L2-F. Hai nhóm `build-exe` (L2-C, L2-D) nên làm liền nhau để build exe ít lần.

### 8.3 PR docs (không cần CI)

DR6-95 (ghi lệch mockup 11c E7 vào "Lệch mockup đã biết"), DR6-96 (NT-EX-05 thêm Back / Forward, NT-KH-… KH tạo ngoài góc nhìn, NT-TM-… hộp 9b người hỗ trợ), DR6-97 (hướng dẫn "200.000"), DR6-98 (mốc Home PC lượt 2 trong `phase-6.md` + câu "đo khi gắn DevTools chậm ×2–3 với thao tác nhiều câu SQL" ở `e2e/perf/README.md`).

### 8.4 Hoãn sau v1.0 / chấp nhận (ghi `review-notes.md`)

- **Hoãn cùng đợt G5 sau** (cùng DR6-17, 23, 24): DR6-77 (trần chuỗi gốc của V1), DR6-102 ("kỉ" / "qui").
- **Hoãn, dọn khi chạm file** (cùng DR6-67): DR6-103.
- **Hoãn, theo dõi** (Q8 a): DR6-84 — dòng theo dõi `trash.open` theo cỡ Thùng rác, ghi cả số không DevTools.
- **Hoãn** (Q2 a): DR6-76 phần thứ tự trộn theo từng đoạn.
- **Chấp nhận** (Q10): J5 của DR6-60 — đột biến gần tương đương ở React 19; sửa comment `app-data.ts:394-396` trong L2-C.

### 8.5 Phương án, thứ tự, ước lượng

| Phương án | Gồm | Issue | Dòng SP (ước) |
|---|---|---|---|
| **1 — tối thiểu** (đủ điều kiện G7) | DR6-68 + hai hồi quy còn lại (DR6-79, DR6-82) + PR docs; mọi Low / Nit khác vào `review-notes.md` (hoãn / chấp nhận) | 3 + docs | ≈ 30–50 |
| **2 — đề xuất** (như lượt 1: "sửa hết trừ phần hoãn") | §8.2 L2-A…H + §8.3; hoãn / chấp nhận theo §8.4 | 9 + docs | ≈ 160–230 + ≈ 750 test |
| **3 — sửa hết** | Như 2 + một đợt G5 (DR6-17, 23, 24, 77, 102) + DR6-76 dạng trộn (≈ 80–180 SP mỗi nơi) + DR6-84 (gộp truy vấn) | ≈ 12 + G5 | ≈ 400–700 |

Thứ tự đề xuất:

1. Owner trả lời §9 (một lượt).
2. PR spec G2: ca trước ngày tạo (Phase 3 §4), câu TR-3 / E20 (Phase 6).
3. L2-A (risk:med → Owner merge).
4. Song song theo file: L2-C → L2-D (build exe một lần), L2-E, L2-F → L2-B2, L2-G, L2-H.
5. L2-B1 sau L2-A.
6. PR docs, `review-notes.md`, `phase-6.md`.
7. G7.

Mỗi Issue một phiên, review phiên sạch như thường.

## 9. Câu hỏi cần Owner quyết

Mỗi câu có đề xuất; Owner đồng ý mà không ghi gì khác thì lấy đề xuất.

1. **DR6-68 — cuộc gặp trước ngày tạo KH (Medium).** (a) Giữ K2 / DR-43: trước ngày tạo, nhóm của ngày = nhóm tạo KH. Cuộc gặp giữ nhóm ghi / khôi phục / nhập được; đổi nhóm trước ngày tạo vẫn bị D10 như trước; hộp 6c đi từ nhóm tạo KH. (b) Bỏ K2 cho cuộc gặp Đã gặp: lịch trước ngày tạo chỉ ghi được Không đến / Hủy; sửa ACCEPTED DR-43 + spec Phase 3 §4; hộp 6c khóa, nói "trước ngày tạo KH". **Đề xuất: (a).**
2. **DR6-76 — key qua nhiều lớp escape (Rust + script eval).** (a) Thêm hai cách đọc cùng loại (JSON→JSON, URL→URL) ở cả hai nơi; dạng trộn thứ tự theo từng đoạn hoãn sau v1.0. (b) Làm cả dạng trộn (thuật toán theo từng đoạn, ≈ 80–180 SP mỗi nơi). (c) Chấp nhận cả họ, ghi vào ADR-0009 D-1: chỉ chặn một lớp và hai lớp khác loại; server cố ý mã hóa key nằm ngoài mô hình đe dọa. **Đề xuất: (a).**
3. **DR6-73 — `quick_check` không bắt chỉ mục lệch nội dung.** (a) `integrity_check`: bắt thêm 257 / 600 ca lật byte, +≈ 30 ms mỗi lần mở (`app.open-data` ≈ 330 ms, ngưỡng 600). (b) Giữ `quick_check`, sửa doc comment và ghi giới hạn ở spec §5 mục 4. **Đề xuất: (a).**
4. **DR6-72 — mở rộng K20.** `normalizeText` gộp mọi Unicode White_Space (thêm U+0085) và bỏ mọi `\p{Default_Ignorable_Code_Point}` (gồm `\p{Cf}` và U+3164, U+115F, U+FFA0, U+034F, U+FE00–FE0F), thêm U+2800; dữ liệu giả lập nạp lại (K1). **Đề xuất: đồng ý.**
5. **DR6-80 — câu hộp 9b cho người hỗ trợ.** (a) Đổi chữ: vế "bỏ khỏi người đánh giá kết quả (ở Sửa kết quả)" chỉ hiện khi có lịch người đó đánh giá; người phối hợp → "Người phối hợp của lịch Dời lịch / Dự kiến không đổi được — giữ lại thay vì xóa". (b) Cho đổi người phối hợp của lịch Dự kiến / Dời lịch (tính năng mới, G1 / G3). **Đề xuất: (a).**
6. **DR6-70 — 6f dời ngày cuộc gặp có chuyển nhóm qua một lần đổi nhóm khác.** (a) Hộp nêu hậu quả như 6g ("Khi lưu: Nhóm KH N2 → về N3 (hủy chuyển nhóm 15/09) · RF bớt 1"). (b) Khóa ô Ngày như D7 khi ngày mới đi qua một lần đổi nhóm khác. **Đề xuất: (a)** — vẫn sửa được ngày nhập nhầm, hậu quả nói trước như hộp Xóa.
7. **DR6-93, 94 — chữ Thùng rác (spec G2 / G3).** (a) Dòng Thùng rác của cuộc gặp giữ nhóm ghi "nhóm sau N3 · không đổi nhóm KH"; câu chặn khi ngày đổi nhóm = ngày cuộc hẹn đổi thành "Nhóm KH đã đổi ngày 15/09/2026, ghi sau lúc xóa cuộc hẹn này — …"; sửa TR-3 / E20 của spec theo. (b) Giữ màn, chỉ sửa chữ spec: TR-3 ghi "dòng không có chuyển nhóm, như lịch không Đã gặp"; E20 cùng ngày ghi vào "Lệch đã biết". **Đề xuất: (a).**
8. **DR6-84 — Thùng rác chậm dần theo số dòng.** (a) Hoãn sau v1.0, thêm dòng theo dõi `trash.open` theo cỡ Thùng rác ở `phase-6.md` (người dùng chạm 200 ms ở ≈ 2 000 dòng). (b) Sửa trước v1.0 (đọc trong một transaction không lưu file, hoặc gộp truy vấn). **Đề xuất: (a).**
9. **Phạm vi đợt sửa:** Phương án 1, 2 hay 3 (§8.5)? **Đề xuất: Phương án 2.**
10. **DR6-60 phần J5:** chấp nhận (đột biến gần tương đương ở React 19; lượt 1 đã đề xuất "không cần sửa"), sửa comment `app-data.ts:394-396` cho khớp điều test kiểm, ghi ACCEPTED. **Đề xuất: đồng ý.**

## 10. Kiểm độc lập và tuân thủ quy trình

Theo nội dung báo cáo:

- **SHA và `git status`:** cả 12 báo cáo ghi `4217ed4` đầu / cuối phiên. `git status --short` đầu / cuối như nhau: `Project-2C-review` rỗng; `Project-2C-review-2` chỉ có `AGENTS.md`, `.codex/`, `.agents/` của Codex (plan §8).
- **Không gọi AI thật, không đọc key:** mọi probe AI dùng Mock, `fetch` giả hoặc server loopback, key giả. Mọi probe trình duyệt chặn mạng ngoài 127.0.0.1 và thay `window.open` từ lần chạy đầu ("requests blocked: []" ở mọi log). Không ai mở exe khi bên kia đang đo: cổng debug 9333–9348, kiểm trước mỗi lần.
- **Khuôn báo cáo:** đủ mục §L2.8 ở cả 12 báo cáo; gói F của cả hai có bảng R gộp 59 DR6 và kết luận.

### 10.1 Kiểm bằng log phiên (plan §8, §L2.10)

Làm 17/10 trên Home PC. Log đọc bằng CLI local, không gọi model. Script `node` quét **đầu vào lệnh công cụ** (không quét prompt hay kết quả trả về) theo danh sách §L2.10, rồi xét tay từng chỗ khớp.

| Bên | Log | Phiên | Lệnh công cụ |
|---|---|---|---|
| Claude | transcript `projects\C--workspace-Project-2C-review\*.jsonl` ở `.claude-c` (A, B, C, D, F làm tiếp), `.claude` (E phiên đầu), `.claude-b` (E làm tiếp, F phiên đầu) | 8 phiên gói (E, F mỗi gói hai phiên; B thêm một phiên mở trống 5 s) | 1 852 (A 193 · B 229 · C 218 · D 298 · E 315 + 163 · F 265 + 171) |
| Codex | `.codex\sessions\2026\10\17\rollout-*.jsonl` | 6 phiên chính + 7 phiên con 0 lệnh (mỗi gói một, gói E hai; như lượt 1) | 386 (A 60 · B 55 · C 60 · D 63 · E 69 · F 79) |

**Không phát hiện nhiễm và không phát hiện vi phạm chỉ đọc.**

- **Thư mục của bên kia** (`deep-review-1-6-r2\{claude,codex}` của bên kia, `deep-review-1-6\{claude,codex,muse}` không phải của mình): **0 lần** ở cả hai nguồn log. Chỗ khớp duy nhất là chữ trong báo cáo của chính bên đó (Claude D §9.4 nêu tên `…-r2\codex\` để nói đã không mở). Mọi đích Read / Write / Edit / Glob / Grep của Claude ngoài worktree nằm trong `…-r2\claude\`, `…-r2\common\` hoặc `deep-review-1-6\claude\` (probe lượt 1 của chính Claude).
- **Liệt kê / tìm kiếm trên `C:\workspace\`, `deep-review-1-6\`, `deep-review-1-6-r2\` ở cấp gốc:** 0 lần. `rg --files` chỉ chạy trong repo.
- **Ghi vào worktree:** Write / Edit của Claude vào repo: 0 lần. Đột biến "vá rồi trả nguyên byte" có kiểm sha256 chạy trong script (plan cho phép). Codex không vá repo (bản chép ngoài repo). `git init` / `git add` của Codex F chỉ chạy ở `…\codex\F\copy` (`workdir` của lệnh).
- **`gh`, `git push`, đổi quyền thư mục:** 0 lần. Chỗ khớp là chữ trong báo cáo, và `git commit` trong một repo nháp `…\claude\F\ci-notice` (dựng để chạy bước CI "Note the tested base").
- **AI của sản phẩm:** 0 lần chạy `eval:ai` / `eval-ai.mjs` / `cmdkey`. Chỗ khớp là Read mã `tools/eval-ai.mjs`, chữ trong báo cáo, và luật chặn `chatgpt.com` trong config Playwright của Claude C.

**Ghi nhận quy trình** (không đổi phát hiện nào):

1. **Liệt kê không đệ quy thư mục của chính bên đó** (đều tự khai trong báo cáo):
   - Claude D liệt kê `…-r2\claude\C\` để tìm công cụ dùng lại.
   - Claude E liệt kê `deep-review-1-6\claude\E\` (lượt 1 của chính Claude) vì PowerShell coi `$E` và `$e` là một biến.
   - Claude E, F (phiên làm tiếp) liệt kê thư mục gói của mình, như bước 0 cho phép.
   - Codex D liệt kê `deep-review-1-6\codex\D` (`-Name`).
2. **Codex F đổi junction `node_modules` của worktree** (tự khai): một lượt `pnpm` trong bản chép làm 8 junction `@p2c` của `node_modules` (bị ignore) trỏ sang bản chép. Codex F tự khôi phục bằng `pnpm install --offline --frozen-lockfile` + script nối lại; sau đó kiểm graph 315 module / 1 277 phụ thuộc, bundle (dựng sau khi khôi phục) trùng baseline, `git status` như đầu phiên.
3. **Phiên bị cắt, đổi thư mục cấu hình:**
   - Claude E: cắt 15:32, làm tiếp 15:35, `.claude` → `.claude-b`. Phiên đầu quay lại 16:15, chỉ để tắt 6 server `serve-dist` nó để chạy (cổng 4525–4531).
   - Claude F: cắt ≈ 17:09, làm tiếp 17:12, `.claude-b` → `.claude-c`.
   - Model không đổi. Mức suy luận: C, D, E ghi `max`; A, B, F ghi "do Owner đặt, không đọc được".
4. **Ghi ngày:** `common\baseline.md` và HANDOFF ghi bước chuẩn bị "17–18/10" / "18/10/2026", nhưng thời điểm file cho thấy mọi bước chạy 17/10 (chuẩn bị 01:01–01:55, probe exe 01:51–01:54). Chỉ sai chữ.
5. **Codex không ghi được model / mức suy luận** ("GPT-6 theo hệ thống"), như lượt 1.

**Cho lần sau:**

- Bản chép repo để chạy test không chạy `pnpm` trong đó: dùng junction sẵn có hoặc `--ignore-workspace`.
- Probe PowerShell tránh biến chỉ khác hoa / thường.

## 11. Ghi chú phương pháp

- Phiên tổng hợp (Home PC, 17/10 sau 17:55) đọc đủ 12 báo cáo, gộp theo vị trí code + hậu quả, rồi kiểm mọi phát hiện trên code ở `d33dda9` (code = `4217ed4`).
- 🔁 Chạy lại bốn probe Node, hook nạp TS như `tools/load-data.mjs`:
  - ghi bù trước ngày tạo KH (DR6-68);
  - `normalizeText` với U+0085 / U+3164 / U+034F / U+FE0F / U+2800 (DR6-72);
  - Mock trích xuất: chủ thể và thời gian ghi chú một dòng (DR6-78, 79);
  - `editMeetingOutcome` dời ngày qua một lần đổi nhóm (DR6-70: `saved`, chuyển nhóm `N3→N2 15/09` mất, KH N2 → N3, lịch `05/09 MET N4`).
- Các phát hiện còn lại: đọc lại đúng chỗ code + bằng chứng (probe / đột biến / ảnh) của reviewer; không đo lại exe (bước chuẩn bị và hai bên đo cùng máy, số khớp nhau).
- Số đo Node của hai bên chạy song song và có lúc trùng thời gian. Chỉ so ngưỡng và so lượt 1 cùng máy theo luật nhiễu, không suy hồi quy từ chênh lệch giữa hai bên (vd. `exportBackup` của Codex F, đã đo lại cặp cũ / mới: nhiễu).
- Khác lượt 1, lần này không bác phát hiện nào. Mọi probe "kết luận về màn" đi qua lớp dữ liệu của app (`openAppData`, `tables()`) hoặc bản dựng, đúng bài học lượt 1 (plan §L2.7).

## Phụ lục — đối chiếu ID của từng báo cáo ↔ DR6

Mỗi phát hiện của 12 báo cáo (57) có đúng một dòng ở đây.

| Báo cáo | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| **Claude** (44) | A1→**68** · A2→72 · A3→87 · A4→71 · A5→69 · A6→103 | B1→73 · B2→74 · B3→88 · B4→76 · B5→88 · B6→75 · B7→98 | C1→77 · C2→78 · C3→102 · C4→79 · C5→89 · C6→97 · C7→89 | D1→90 · D2→80 · D3→81 · D4→101 · D5→90 · D6→96 · D7→82 · D8→100 | E1→70 · E2→94 · E3→99 · E4→91 · E5→91 · E6→91 · E7→84 · E8→83 | F1→76 · F2→69 · F3→85 · F4→86 · F5→92 · F6→86 · F7→98 · F8→86 |
| **Codex** (13) | A1→**68** · A2→72 · A3→69 | B1→88 · B2→88 · B3→76 · B4→88 | C1→78 | D1→83 | E1→93 · E2→95 | F1→85 · F2→76 |
