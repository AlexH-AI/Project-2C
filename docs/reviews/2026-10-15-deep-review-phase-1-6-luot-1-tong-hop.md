# Tổng hợp deep review Phase 1–6, lượt 1 — Claude, Codex, Muse (Office Laptop + Home PC)

- **Ngày tổng hợp:** 2026-10-15 · **SHA được review:** `8855345` · kế hoạch `docs/process/deep-review-phase-1-6.md` (T-222) · Issue T-223 #563 (`gate`).
- **36 báo cáo = 2 máy × 3 bên × 6 gói** (A lõi dữ liệu · B file và Rust · C AI · D màn nhập liệu · E lịch hẹn, chỉ số, quản lý · F xuyên gói, bloat / hiệu năng, công cụ):
  - **Chính thức — Office Laptop `D13_THINKPAD`** (ADR-0001 M6): Claude A–F 14/10 09:43 → 19:41 · Codex A–F 14/10 09:50 → 21:47 · Muse A–F 14/10 22:12 → 15/10 01:03.
  - **Tham khảo — Home PC `DESKTOP-KDURKJP`** (Owner quyết 14/10, HANDOFF #284): Claude A–E 13/10 21:47 → 14/10 01:45, F xong 14/10 22:21 · Codex A–E 13/10 21:11 → 14/10 00:31, F xong 14/10 21:52 · Muse A–F 14/10 22:38 → 15/10 01:13.
- **Reviewer:** Claude Opus 5.5 (phiên sạch mỗi gói, không subagent) · Codex (Owner chạy; 0.162.1 trên laptop) · Muse Spark 1.3 (`muse-spark-1.3-contributor`, effort `max`, `--yolo`; Muse Code trên laptop tự cập nhật 1.3.0 → 1.4.7 trước đợt 2).
- **Ký hiệu ID:** ID gốc của hai máy trùng nhau (cùng khuôn `CL-A1`…), nên ở đây thêm tiền tố máy: `L·CL-A1` (laptop), `H·CL-A1` (Home PC). Muse laptop gói D, E không theo khuôn ID (`muse-D1`, `P2C-E-001`) → đọc là `L·MU-D1…D3`, `L·MU-E1…E4` theo thứ tự trong báo cáo.
- **Báo cáo gốc:** chưa vào repo — bước 1 của §8.1 (PR docs riêng, `docs/reviews/raw/2026-10-15/`). Bằng chứng (probe, đột biến, log, ảnh) ở `C:\workspace\deep-review-1-6\<bên>\<gói>\` trên từng máy.

**Cách kiểm (ADR-0001 M2, M4):** 145 phát hiện của 36 báo cáo được gộp thành 67 vấn đề `DR6-01…67`, rồi đối chiếu trên code ở checkout chính (`main` `f557fb4`: từ `8855345` chỉ đổi `docs/**` + `CLAUDE.md` gốc, code giống hệt). Cột "Kiểm": ✅ đọc đúng chỗ code, khớp mô tả · 🔁 phiên tổng hợp tự chạy lại (probe Node trên `@p2c/db` của repo) · 📏 số đo / probe của reviewer · 🧪 khoảng trống test (đột biến của reviewer, đã xem test hiện có không có ca đó) · 📄 lệch giữa hai tài liệu / mockup đã duyệt. Mức trong bảng là **mức chốt** theo thước plan §4.3, không theo mức bên đó gán. **3 phát hiện bị bác** (§6).

## 1. Kết luận

| Máy | Bên | Kết luận ở gói F | Lý do chính |
|---|---|---|---|
| Laptop | Claude | **CHƯA SẴN SÀNG** | `L·CL-D7` (bàn giao KH, Medium), `L·CL-E7` (khôi phục cuộc gặp giữ nhóm, Medium) + vài dòng nghiệm thu G7 sẽ đỏ |
| Laptop | Codex | SẴN SÀNG | không có Critical / High / Medium ở A–F |
| Laptop | Muse | SẴN SÀNG | chỉ Low / Nit |
| Home PC | Claude | **CHƯA SẴN SÀNG** | `H·CL-F2` (= `L·CL-E7`, Medium) |
| Home PC | Codex | SẴN SÀNG | không có Critical / High / Medium |
| Home PC | Muse | SẴN SÀNG | chỉ Low / Nit |

**Kết luận hợp nhất: CHƯA SẴN SÀNG cho v1.0 ở `8855345`.** Hai lỗi Medium đều đúng sau khi kiểm (phiên tổng hợp chạy lại được cả hai, §4.2), đường vào là thao tác bình thường, và spec Phase 6 §1 mục 3 đòi sửa mọi phát hiện từ Medium trở lên trước v1.0. Codex và Muse không thấy cả hai lỗi này nên kết luận SẴN SÀNG của họ không đứng.

- **Không có Critical / High.** Sau khi gộp: **67 vấn đề**: **2 Medium · 48 Low · 17 Nit**; 5 mục KNOWN có bằng chứng mới; 3 phát hiện bị bác.
- **DR6-01 (Medium):** xóa một cuộc gặp Đã gặp "giữ nhóm" — hộp 6g hứa "khôi phục được" — thì 2 690 / 4 254 cuộc gặp như vậy trên dữ liệu tải (63 %) **không khôi phục được ngay sau khi xóa**; "Đã gặp" của kỳ đó giảm vĩnh viễn.
- **DR6-02 (Medium):** bàn giao KH (5c, đổi RE phụ trách) để lịch Dự kiến và mọi lịch "Hẹn tiếp" sau đó ở RE cũ, không lệnh nào đổi được RE của lịch → RF / Đã gặp của cuộc gặp RE mới làm cứ tính cho RE cũ trên Tổng quan / Báo cáo / Excel.
- **Cả hai cần Owner chốt luật trước khi sửa** (thêm ca vào spec, G2) — câu hỏi Q1–Q3 (§9). Sửa nhỏ: ≈ 120 dòng SP + test cho cả họ lỗi.
- **Trước G7 còn phải quyết:** 4 dòng nghiệm thu sẽ ghi "Lỗi" theo đúng chữ danh mục (NT-HS-05, NT-HS-08, NT-TQ-22, NT-TQ-06 — DR6-27, 28, 46, 47) và exe v1.0 đang mang phiên bản `0.1.0` (DR6-12).
- **Điều cả ba bên cùng xác nhận là tốt:** cổng ở SHA ghim xanh (2 755 unit, 91 Rust, 210 e2e, coverage ≈ 99 %); `lint:deps` 0 vi phạm, bundle Δ 0 so số nền; **mọi thao tác đo được đạt ngưỡng đã chốt** trên dữ liệu tải (exe, Edge, Node — §7.1); key chỉ ở Rust / Credential Manager, mọi đường che key có test (trừ kẽ hở hai lớp DR6-10); AI không tự ghi KYC; lệnh và luật nhập backup cùng luật; khứ hồi xuất / nhập backup không mất gì (Claude 3 vòng, Muse so `tables` trùng hệt); S-2 đúng spec; Thùng rác đúng spec trừ họ DR6-01; không rò bộ nhớ qua 8 lần nhập backup; Tổng quan ↔ Báo cáo ↔ Lịch hẹn ↔ Excel khớp 0 lệch trên 2 242 dòng.

## 2. Số liệu

### 2.1 Theo báo cáo (mức do chính bên đó gán)

| Máy | Bên | Phát hiện | Medium / Low / Nit | Bị bác | Thời gian A–F (đồng hồ) |
|---|---|---|---|---|---|
| Laptop | Claude | 37 | 2 / 21 / 14 | 0 | 09:43 → 19:41 (song song Codex) |
| Laptop | Codex | 19 | 0 / 18 / 1 | 0 | 09:50 → 21:47 |
| Laptop | Muse | 15 | 0 / 7 / 8 | 0 | 22:12 → 01:03 (≈ 2 h 50, một mình) |
| Home PC | Claude | 43 | 1 / 27 / 15 | 0 | A–E ≈ 4 h (13/10 đêm), F 14/10 tối |
| Home PC | Codex | 13 | 0 / 13 / 0 | 0 | A–E ≈ 3 h 20 (13/10 đêm), F 14/10 tối |
| Home PC | Muse | 18 | 0 / 13 / 5 | **3** | 22:38 → 01:13 (≈ 2 h 35) |
| **Tổng** | | **145** | 3 / 99 / 43 | 3 | |

### 2.2 Theo vấn đề đã gộp (67)

| | Claude | Codex | Muse |
|---|---|---|---|
| Số vấn đề bên đó thấy (gộp hai máy) | **52** (78 %) | 22 (33 %) | 20 (30 %) |
| Chỉ bên đó thấy (và đúng) | **28** | 8 | 7 |
| Medium sau khi chốt (2) | **2** (DR6-01 cả hai máy; DR6-02 chỉ laptop) | 0 | 0 |
| Cùng một bên, hai máy cùng thấy | 18 / 37 vấn đề của Claude H | 10 / 13 của Codex H | 5 / 13 của Muse H (không tính 3 bị bác) |

- **Cả ba bên (3):** DR6-27 (tiền KYC không đọc lại), DR6-54 (golden L-09), DR6-66 (export / hàm chỉ test dùng). **Hai bên (21).** **Một bên (43).**
- **Bộ chính thức (laptop) thấy 50 / 67**, gồm cả hai Medium. Bộ tham khảo (Home PC) thêm **17** vấn đề, không có Medium; đáng kể nhất: DR6-05 (D7 bỏ qua cuộc gặp giữ nhóm), DR6-21 (STALE dưới AA), DR6-34 (Back mất bản nháp), DR6-35 (đổi màn mất focus), DR6-46 (NT-TQ-22), DR6-49 (khoảng trắng / ký tự vô hình trong tên, KYC).
- **Độ lặp lại giữa hai máy:** Codex lặp lại cao nhất (10 / 13 vấn đề của bản Home có ở bản laptop: CX-A1, A2, openFrom, Mock trích xuất, người đánh giá, FYP, giao thừa, hai lỗi eval); Claude 18 / 37; Muse thấp (5 / 13) và có 3 phát hiện sai — kết quả Muse thay đổi nhiều giữa hai lần chạy cùng model.

## 3. Điểm các bên cùng thấy

| DR6 | Vấn đề | Ai thấy (mức gốc) | Mức chốt | Kiểm |
|---|---|---|---|---|
| **01** | Khôi phục cuộc gặp Đã gặp giữ nhóm bị D10 chặn khi KH đã đổi nhóm sau ngày gặp — kể cả ngay sau khi xóa (§4.2) | L·CL-E7 (M), H·CL-F2 (M) — Claude **cả hai máy, độc lập** | **Medium** | 🔁 ✅ |
| 54 | Golden `lich-hen.md` L-09 có RE làm người phối hợp, trái DR-47 / K5 (lệnh và luật nhập backup đều từ chối); comment `model.ts:76` "or other RE", `appointment-counts.ts:35` | L·CL-A4 (N), H·CL-A10 (N), L·CX-A2 (L), H·CX-A2 (L), L·MU-A2 (N) | Nit | 📄 ✅ |
| 27 | Ô Giá trị của trường tiền KYC (Thu nhập năm, Tổng tài sản, Nợ) không đọc lại "6.000.000.000 ₫ (6 tỷ)" như mockup 7b / 7c; NT-HS-05 sẽ đỏ. Golden / seed lại dùng chữ tự do ("Khoảng 12 tỷ", "1–2 tỷ") | L·CL-D2, H·CL-D2, L·CX-D3, H·MU-D1 (đều L) | Low | 📄 ✅ |
| 26 | Hộp 9b Xóa nhân sự không đếm "người đánh giá kết quả": nút Xóa bật, lệnh từ chối `PERSON_IN_USE` với câu nói về RE / KH / HĐ | L·CL-D1, H·CL-D1, L·CX-D1, H·CX-D2 (đều L) | Low | ✅ 📏 4 probe |
| 22 | Chữ cũ: "64 tokens" ở `SettingsAi.tsx:309` + ghi chú mockup 1f (nay 1 024); `ai-eval.md:13` "`reasoningEffort: false`"; `aiError.AI_TOO_LARGE` "200 000" | L·CL-C6, H·CL-C4, L·MU-C3, H·MU-C2 (đều N) | Nit | ✅ |
| 08 | `openFrom` lưu bytes **chưa migrate** sau bản đã migrate (file cuối trên đĩa là bản cũ); test "saves the migration…" mở lại bằng `openDatabase` (tự migrate) nên xanh. Không đường sản phẩm nào đưa bytes cũ vào hôm nay | L·CL-B2, L·CX-B2, H·CX-B1 (đều L) | Low | ✅ 📏 3 probe |
| 55 | Script eval (`eval-ai-core.mjs`) không chặn key trong `content`, chỉ che key nguyên văn trong lỗi server → file kết quả `docs/metrics/ai-eval-*.md` (repo public) có thể chứa key nếu server dội lại header | H·CL-F1, L·CX-F1, H·CX-F1 (đều L) | Low | 📏 3 probe (key giả) |
| 38 | Hộp mở qua giao thừa: ngày điền sẵn `dd/mm` đọc lại theo năm mới → lịch Hủy nhảy sang năm sau khi chỉ sửa ghi chú (6f); "Hẹn tiếp" tạo lịch 31/12 năm sau (6h); 8b báo lỗi không chỉ ô | H·CL-E2, L·CX-E2, H·CX-E3 (đều L) | Low | ✅ 📏 UI probe 3 lần |
| 07 | Câu lỗi sai hướng: file DB bị chương trình khác giữ (os error 32) / thư mục không ghi được (5) / `.tmp` không xóa được → màn khởi động bảo **chép backup đè** (làm theo là mất phiên cuối); `save()` không tách `DISK_FULL`, dải lỗi gợi ý "file đang mở trong chương trình khác" | L·CL-B6, H·CL-B1, H·MU-B2 (đều L) | Low | ✅ |
| 47 | Tỉ lệ chốt tròn: màn "60%", mockup 1a "60,0%", golden "100%", NT-TQ-06 "một chữ số thập phân", Excel `0.0%` | L·CL-E4 (N), H·CL-E5 (N), L·MU-E4 (N) | Nit | 📄 |
| 04 | Hộp 6c / 6f lấy **nhóm hiện tại** làm "giữ nguyên" cho cuộc gặp cũ; dòng đọc lại báo chuyển nhóm không có thật; dời ngày cuộc gặp giữ nhóm không kiểm D10 | H·CL-A2, L·CL-E1, H·CL-E4 (đều L) | Low | ✅ |
| 15 | Phiên ChatGPT web không mang mốc `generation`: phiên mở trước lần thay dữ liệu vẫn lưu vào dữ liệu mới, hoặc `webChip` ném `RangeError` làm sập hồ sơ | L·MU-C1, H·CL-C6 (đều L) | Low | ✅ 📏 probe Node |
| 17 | Ký tự vô hình làm lọt V3–V6: NFKC chạy **trước** bỏ `\p{Cf}` (NFD + U+200B trước dấu → lọt cả V3, V4, V5, V6); mẫu V6 `\s+` không khớp khi giữa chỉ là U+200B | L·CX-C1, H·CL-C1 (đều L) | Low | ✅ 📏 |
| 44 | `listTrash` tốn ≈ 2 ms / KH đã xóa (đếm từng KH, thiếu chỉ mục `customer_id`), vượt 200 ms từ ≈ 75–100 KH trong Thùng rác (không tự dọn, TR-6) | L·CL-A2, H·CL-A1 (đều L) | Low | 📏 2 máy |
| 28 | Hộp 7d không ghi mã F cạnh từng giá trị; NT-HS-08 đòi | H·CL-D3, L·MU-D1 (đều L) | Low | 📄 ✅ |
| 29 | Hồ sơ KH lệch mockup chưa ghi: dòng thời gian không ghi "tính / không tính RF", không có nhãn "thay đổi quan trọng" (e2e ghim bản thiếu); thẻ Lịch hẹn không có ô Kỳ | L·CL-D3, H·CX-D1, L·CX-D2, H·CL-D9 (L / N) | Low | ✅ 📄 |
| 35 | Đổi màn làm focus rơi về `body`, không báo màn mới, `<title>` cố định; nút tự gỡ ("Hiện thêm" lần cuối, "+ n KH") cũng mất focus | H·CL-D10, H·MU-D3, H·MU-D2 (đều L) | Low | 📏 web |
| 39 | "Case size dự kiến ở cuộc gặp gần nhất" lấy số của cuộc gặp cũ hơn khi cuộc gặp gần nhất để trống (319 / 1 190 KH trên dữ liệu tải); test ghim | L·CL-E2, L·CX-E3 (đều L) | Low | ✅ |
| 40 | Hộp Sửa HĐ: "khác FYP nộp" so với FYP nộp **đã lưu**, không theo ô đang sửa | L·CX-E1, H·CX-E2 (đều L) | Low | ✅ 📏 UI probe 2 máy |
| 41 | Đổi tháng phát hành / nộp: `issuedChange` trả `metric: null` → hộp không hiện "Ảnh hưởng chỉ số" dù doanh số hai tháng đổi | L·MU-E1, H·MU-E3 (đều L) | Low | ✅ |
| 50 | Nhập backup nhận mâu thuẫn KYC gồm hai giá trị **giống nhau** (luật 7 chỉ đếm) | L·CX-A1, H·CX-A1 (đều L) | Low | 📏 |
| 19 | Mock trích xuất nhận sai ngữ cảnh ("em trai độc thân", "không có 2 con", "9 con số"); test ghim một ca sai | L·CX-C3, H·CX-C1 (đều L) | Low | ✅ |
| 56 | Script eval bỏ `finish_reason` và `content: null` + `length` → chấm khác app (ERROR / ACCEPTED ngược nhau) | L·CX-F2, H·CX-F2 (đều L) | Low | 📏 |
| 51 | Giá trị liệt kê sai (giới tính, vai trò, nhóm) → lỗi `CHECK constraint` thô, không mã | L·MU-A1 (L), H·MU-A2 (N) | Nit | ✅ |

## 4. Điểm khác nhau và kiểm lại

### 4.1 Vì sao kết luận khác nhau

Khác nhau chỉ ở **hai lỗi Medium**: cả hai chỉ Claude thấy, và chỉ thấy khi dựng **chuỗi nhiều bước qua nhiều gói** (xóa → đổi nhóm → khôi phục; bàn giao → ghi kết quả → hẹn tiếp → chỉ số theo RE) — đúng loại lỗi kế hoạch §1 dặn ưu tiên. Codex thử nhiều chuỗi khôi phục nhưng toàn trên cuộc gặp **có** chuyển nhóm (E5–E8 của spec); Muse không dựng chuỗi nào qua Thùng rác với cuộc gặp giữ nhóm. Không bên nào báo Critical / High.

### 4.2 Hai Medium — kiểm lại

**DR6-01 — khôi phục cuộc gặp giữ nhóm.** Đúng, Medium.

- Code: `restoreAppointment` → `checkRestoreAppointment` tính `to = outcomeStage(row, stage)` với `stage` là nhóm **hiện tại** của KH (`packages/db/src/appointments.ts:278-293`). Cuộc gặp giữ nhóm có `stage_after` = nhóm lúc gặp; KH đổi nhóm sau đó thì `to ≠ null` → `checkTransition` ở ngày gặp → `TRANSITION_BEFORE_LATEST` (D10) hoặc `INVALID_TRANSITION` (KH đã đóng). Xóa thì luôn được (không có chuyển nhóm để rút), hộp 6g ghi "Xóa mềm, khôi phục được", Thùng rác ghi "Khôi phục đưa bản ghi về như trước".
- 🔁 Phiên tổng hợp chạy lại trên dữ liệu tải (`importBackup`, đồng hồ 12/10/2026), xóa rồi khôi phục **ngay** từng cuộc gặp Đã gặp sống không có chuyển nhóm: `{"met":7571,"kept":4254,"restored":1564,"refused":{"TRANSITION_BEFORE_LATEST":2689,"INVALID_TRANSITION":1}}` — trùng số của H·CL-F2; L·CL-E7 đếm 2 973 cuộc gặp giữ nhóm có KH đổi nhóm sau ngày gặp, thử 50 cái đầu: 46 bị từ chối.
- Spec: TR-3 viết cho cuộc gặp **có** chuyển nhóm ("ghi lại chuyển nhóm của cuộc gặp"); gạch đầu dòng "nhóm KH đã đổi sau ngày cuộc hẹn → từ chối" đọc theo chữ thì code làm đúng, nhưng trái với câu của 6g / Thùng rác và với ý "khôi phục = về như trước". Gốc sâu hơn nằm ở spec Phase 3 §4 (`phase-3-du-lieu.md:182`, dòng `recordMeetingOutcome`): "`stage_after` ≠ nhóm **hiện tại** → transition", "`MET` với `stage_after` = nhóm hiện tại … vẫn ghi được" — mọi chỗ so "nhóm sau" với nhóm hiện tại (DR6-01, 03, 04, 05) đều làm đúng chữ spec này. Spec thiếu ca → cần Owner chốt (G2: thêm E18 vào TR-3 và sửa dòng §4 thành "so với nhóm của KH **tại ngày cuộc hẹn**"), không phải chỉ sửa code.
- Mức: thao tác bình thường (xóa nhầm rồi khôi phục), không đảo ngược được trong app (đường vòng đều mất dữ liệu: ghi lại tay thì DR6-04 làm sai nhóm; nhập lại backup cũ mất mọi thay đổi sau) → **Medium** (thước §4.3). Không High: bản ghi còn trong DB / backup, không lặng lẽ (Thùng rác nói lý do, dù lý do sai bản chất).

**DR6-02 — bàn giao KH.** Đúng, Medium; luật đúng cần Owner chốt.

- Code: `updateCustomerProfile` chỉ đổi `customers.re_id` (`packages/db/src/customers.ts:130-148`); `AppointmentDetails` không có `reId`, dời lịch giữ RE (`appointments.ts:88-94`, `:227-249`) → không lệnh nào đổi được RE của một lịch; "Hẹn lần tiếp theo" ở 6c chép `{ ...recorded }` (`appointments.ts:185`); "Hẹn tiếp" 6h điền sẵn `from.reId` (`AppointmentDialog.tsx:80`, ô RE sửa được nhưng mặc định là RE cũ).
- 🔁 Phiên tổng hợp: KH của RE A, lịch Dự kiến 12/10; đổi RE sang B; ghi kết quả N3 → N2 kèm hẹn 20/10 → `"12/10 MET RE=A (cũ)"`, `"20/10 SCHEDULED RE=A (cũ)"`. ADR-0007: chuyển RF tính cho **RE ghi trên cuộc hẹn** → RF của cuộc gặp do RE B làm vào RE A.
- Câu 5c (`vi.ts:544`) "Đổi RE: lịch hẹn và HĐ **cũ** vẫn tính cho RE đã ghi" — theo nghĩa thường (quy tắc PR #163) không bao gồm lịch **chưa diễn ra** và lịch **tạo sau** bàn giao. NT-KH-09 chỉ kiểm lịch Đã gặp / HĐ cũ nên không lộ.
- Mức: thao tác bình thường (RE nghỉ, chia lại KH), chỉ số RF / Đã gặp / Tỉ lệ chốt theo RE và theo team lệch dần mà không ai thấy trừ khi xem cột RE từng lịch. L·CL-F gọi là "sát High"; giữ **Medium** vì cột RE của lịch hiện trên màn Lịch hẹn và luật mong muốn chưa được chốt.

### 4.3 Chênh mức

| DR6 | Bên gán | Chốt | Lý do |
|---|---|---|---|
| 54 | Codex L (cả hai máy) | Nit | Golden chỉ lệch tài liệu; số không sai (A09 vẫn kiểm đúng "người phối hợp không tính"); code giữ đúng K5 |
| 51 | L·MU-A1 L | Nit | Chỉ tới được bằng lỗi lập trình (màn dùng ô chọn); H·MU-A2 cũng chấm Nit |
| 53 | H·MU-A1 L | Nit | Cần đồng hồ máy trước 1970; mã vẫn khác nhau, không lẫn dữ liệu |
| 33 | L·MU-D3 L (phần nút Xóa) | Nit (phần đó) | Lỗi khóa ghi S2-2 trong hộp Xóa team / nhân sự gần như không tới được (phải đang ở Team khi dữ liệu đang thay) |
| 24 | L·MU-C2 L | Nit | Chỉ ảnh hưởng chất lượng lần thử lại khi output sai dạng; đổi chữ `detail` đi vào message thử lại G5 §5 |
| 25 | H·CL-C3 L; L·CL-F không thành phát hiện | Low, hoãn | Hai bên cùng số đo (zod ≈ 10 % `index.js`); chi phí đổi ≈ 120–300 dòng, lợi vài ms lúc mở → để sau v1.0 |
| 44 | Claude L; Codex / Muse coi là KNOWN #539 | Low (mới) | Bằng chứng mới: phần tốn **không** ở `refs` (KNOWN) mà ở đếm từng KH quét toàn bảng; chỉ mục `customer_id` 389 → 36 ms |

### 4.4 Chỉ một bên / một máy thấy — kết quả kiểm

| DR6 | Ai thấy | Kiểm | Kết quả |
|---|---|---|---|
| 02 | L·CL-D7 | 🔁 ✅ (§4.2) | Đúng, Medium |
| 06 | L·CL-B1 | ✅ `openDatabase` chỉ `new SQL.Database(bytes)` + migrate, không `quick_check` (`database.ts:50-60`); `openAppData` gọi `storage.backup()` sau khi mở (`app-data.ts:308-319`); 📏 probe ghi đè một trang | Đúng, Low (hiếm) — nhưng hậu quả nặng: sau ≈ 10 phiên có ghi, `backups\` chỉ còn bản hỏng, trái spec §5 mục 4. Sửa ≈ 10 dòng, `quick_check` 79 ms |
| 10 | L·CX-B1 | ✅ `unescape` một lượt (`ai.rs:322-342`): `\u0025` thành `%` rồi `73…` để nguyên → `reveals` không thấy key | Đúng, Low (cần server dội key hai lớp) |
| 05 | H·CL-F3 | 📏 dữ liệu tải có đúng 1 ca do `fillTrash` | Đúng, Low |
| 49 | H·CL-A3, A6 | 📏 probe (U+200B làm cổng KYC lên `PAIN_POINT_ANALYSIS`) | Đúng, Low |
| 30 | L·CX-D4 | ✅ `CustomerProfile.tsx:158` `lg:grid-cols-2 2xl:grid-cols-3` (3 cột từ 1 536 px), mockup `customer.html:16` 3 cột ở 1 440; không có quyết định nào (commit #439) | Đúng, Low — Owner chọn |
| 29 (nhãn) | H·CX-D1 | ✅ `CustomerKyc.tsx:273-278` không đọc `version.material`; khóa `timeline.material` có sẵn; `e2e/customer-kyc.spec.ts:104` ghim chữ không nhãn | Đúng, Low |
| 32 | H·CX-D3 | ✅ `TeamScreen.tsx:304-310` thiếu `resetKey` (ba bảng khác có) | Đúng, Low (team > 100 RE mới thấy) |
| 33 | L·MU-D2, D3; H·CL-D6 | ✅ `KycDialogs.tsx:271` `error={date.error}` (hook báo lỗi ngay khi gõ), hai hộp khác chỉ báo sau Lưu; `TeamDialogs.tsx:81`, `PersonDialogs.tsx:163` khóa nút sau mọi lỗi | Đúng, Low / Nit |
| 42 | H·MU-E4 (PLAUSIBLE) | ✅ `OutcomeDialog.tsx:92-96` ghi kèm lịch tiếp theo rồi chỉ `onClose()`, nhánh dời lịch gọi `onMoved` | Đúng, Low |
| 48 (chú giải) | L·MU-E2 | ✅ `AppointmentsScreen.tsx:392-398` vs `phase-3-feedback.html:980` "Trong kỳ" | Đúng, Nit |
| 11 | H·MU-B1 | ✅ `ai.rs:165` chỉ `!model.is_empty()` | Đúng, Low |
| 52 | H·MU-A3 | ✅ `schema.ts:64` | Đúng, Nit |
| 12, 13 | L·CL-B4, B5 | ✅ `tauri.conf.json:4`, `Cargo.toml:3`, `:11` | Đúng |
| 46 | H·CL-E1 | ✅ `FilterBar.tsx:77` ghép `` ` ${range}` `` không có `sep.dot`; NT-TQ-22 ghi có "·" | Đúng, Low |
| 16 | L·CL-C1, L·CX-C2 | ✅ `schema.ts:110` đếm trên chuỗi còn `\p{Cf}`, G5 §10.4 (dòng 459) đếm **sau khi bỏ**; `blocklists.ts:93` `(?!(KH\|RE\|…sư)…)` — KH / RE chỉ viết hoa, G5 §8.4 (dòng 301) "mọi kiểu chữ" | Đúng, Low — code lệch G5, sửa code cho khớp G5, không đổi G5 |
| 18 | L·CL-C4 | ✅ `seed.ts:535` `${mode}@1`, prompt hiện `@2` | Đúng, Low |
| 57 | L·CL-F2, F3 (PLAUSIBLE) | Hàm CONFIRMED bằng probe; hành vi "Re-run dùng SHA của sự kiện gốc" và `files(first: 100)` của `gh` theo tài liệu / chuỗi trong `gh.exe` | Giữ PLAUSIBLE, Low |

### 4.5 Cùng chỗ, khác nhận định

- **DR6-15 (ChatGPT web):** L·MU-C1 cho là "hôm nay không tới được qua màn hình"; H·CL-C6 chỉ ra đường vào: hộp Nạp lại chỉ chặn đóng hộp, không chặn lịch sử trình duyệt (nút Back chuột / Alt+←, router theo `hashchange`), trong ≈ 3–4 s sinh seed người dùng về được hồ sơ KH cũ. Phiên tổng hợp xác nhận Back làm đổi màn (H·CL-D5, `useRoute.ts:24-45`) → đường vào **có thật nhưng hiếm**; giữ Low, sửa cùng DR6-34 (chặn Back trên exe).
- **DR6-44 (`listTrash`):** Codex, Muse coi là KNOWN #539 (đọc cả ba bảng); Claude đo được nguyên nhân khác và tăng tuyến tính theo KH đã xóa → vấn đề mới (§4.3).
- **DR6-25 (zod):** cùng số đo, khác đề xuất → hoãn sau v1.0.
- **DR6-27 (tiền KYC):** Claude / Codex coi là lệch mockup; H·MU-D1 chỉ thêm golden / seed dùng chữ tự do → hai nguồn đã duyệt mâu thuẫn; phương án "đọc lại khi `parseVnd` hiểu được, giữ chữ tự do" thỏa cả hai (Q4).

## 5. Bảng đầy đủ

Mức: M = Medium, L = Low, N = Nit. Nhóm sửa: §8.

### 5.1 Họ "nhóm sau cuộc gặp" và bàn giao (gói A, E, F)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 01 | Khôi phục cuộc gặp Đã gặp giữ nhóm bị D10 chặn khi KH đổi nhóm sau ngày gặp (§4.2) | L·CL-E7, H·CL-F2 | **M** | 🔁 ✅ | S1-A |
| 02 | Bàn giao KH: lịch Dự kiến + lịch hẹn tiếp ở RE cũ, không đổi được (§4.2) | L·CL-D7 | **M** | 🔁 ✅ | S1-B |
| 03 | Khôi phục lịch Đã gặp khi đã có chuyển tay **cùng ngày**: thêm chuyển nhóm / RF chưa từng có, hoặc hạ nhóm, mất RF | L·CL-A1 | L | ✅ 📏 | S1-A |
| 04 | 6c / 6f lấy nhóm hiện tại làm "giữ nguyên" cho cuộc gặp cũ; dòng đọc lại báo chuyển nhóm không có thật; dời ngày cuộc gặp giữ nhóm không kiểm D10 (`appointments.ts:198-221`, `OutcomeDialog.tsx:163`, `EditOutcomeDialog.tsx:51, 78`) | H·CL-A2, L·CL-E1, H·CL-E4 | L | ✅ | S1-A |
| 05 | D7 cho xóa cuộc gặp có chuyển nhóm khi có cuộc gặp giữ nhóm ghi sau; chuyển tay (5d) lùi ngày qua cuộc gặp giữ nhóm → lịch sử nhóm tự mâu thuẫn, xóa → khôi phục sau đó đổi nhóm / thêm RF; dữ liệu tải có 1 ca (`customers.ts:170-180, 250-294`) | H·CL-F3 | L | ✅ 📏 | S1-A |

### 5.2 File, Rust, cấu hình phát hành (gói B)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 06 | DB hỏng một trang giữa file vẫn mở; startup chép bản hỏng thành backup mới nhất, sau ≈ 10 phiên hết bản tốt; xuất backup báo lỗi sai hướng | L·CL-B1 | L | ✅ 📏 | S2-C |
| 07 | Câu lỗi khởi động / lưu sai hướng (§3) | L·CL-B6, H·CL-B1, H·MU-B2 | L | ✅ | S2-C |
| 08 | `openFrom` lưu bytes chưa migrate sau cùng; test che (§3) | L·CL-B2, L·CX-B2, H·CX-B1 | L | ✅ 📏 | S2-C |
| 09 | `backups\*.db.tmp` sót sau khi bị tắt ngang (4 × 13,4 MB / 40 lần), không dọn; mỗi `cargo test` để lại 46 thư mục `%TEMP%` | H·CL-B5 | N | KNOWN #87 + 📏 | S2-C |
| 10 | Nhận diện key một lượt: key URL-encode rồi JSON-escape `%` (`\u0025`) lọt `reply` / `mask` | L·CX-B1 | L | ✅ 📏 | S2-D |
| 11 | `check()` không giới hạn độ dài / ký tự tên model (5 MB qua) | H·MU-B1 | L | ✅ | S2-D |
| 12 | Phiên bản `0.1.0` ở `tauri.conf.json`, `Cargo.toml` (User-Agent), `package.json`; chưa có bước đặt 1.0.0 | L·CL-B4 | N | ✅ | S2-D |
| 13 | `crate-type = ["staticlib", "cdylib", "rlib"]`: mỗi build release thêm ≈ 11,5 s (83 vs 72 s) và 187 MB | L·CL-B5 | L | ✅ 📏 | S2-D |
| 14 | `core:default` cấp lệnh app không dùng (đọc ảnh theo đường dẫn, menu, tray); CSP thiếu `base-uri` / `form-action` | H·CL-B3 | N | ✅ | S2-D |

### 5.3 AI (gói C)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 15 | Phiên ChatGPT web không mang `generation` (§3, §4.5) | L·MU-C1, H·CL-C6 | L | ✅ 📏 | S2-F |
| 16 | Code lệch G5: V1 đếm 300 trên chuỗi còn `\p{Cf}`; `LAW_NAME` miễn KH / RE chỉ viết hoa | L·CL-C1, L·CX-C2 | L | ✅ | S2-F |
| 17 | Ký tự vô hình làm lọt V3–V6 (thứ tự NFKC / bỏ Cf; mẫu V6 `\s+`) | L·CX-C1, H·CL-C1 | L | ✅ 📏 | G5 |
| 18 | Seed ghi `prompt_version` `analysis@1` / `discovery@1`, app ghi `@2`; e2e ghim `@1` | L·CL-C4 | L | ✅ | S2-F |
| 19 | Mock trích xuất sai ngữ cảnh; test ghim một ca sai | L·CX-C3, H·CX-C1 | L | ✅ | S2-F |
| 20 | Hủy / Thử lại của AI trích xuất gỡ chính nút đang focus → focus về `body` | L·CX-C4 | L | 📏 UI | S2-J |
| 21 | Bản STALE mờ 50 %: chữ dưới AA (dòng mức bằng chứng 2,38:1); mockup `ai.html` `.faded` mâu thuẫn ADR-0013 | H·CL-C2 | L | 📄 📏 | G3 |
| 22 | Chữ cũ "64 token", `ai-eval.md:13`, "200 000" (§3) | L·CL-C6, H·CL-C4, L·MU-C3, H·MU-C2 | N | ✅ | S2-F + docs |
| 23 | Bản bỏ dấu khớp nhầm câu thường ("định hướng nơi ở" → "hướng nội", "nghĩ định cư" → "nghị định"…); 0 / 1 101 câu eval thật | L·CL-C5 | N | 📏 | G5 (sau) |
| 24 | Chi tiết V1 không nêu dạng đúng (`F12`, enum) → lần thử lại kém | L·MU-C2 | N | ✅ | hoãn |
| 25 | `zod` bản đầy đủ ≈ 89 KB (10 % `index.js`), `zod/mini` cùng gói ≈ −60 KB | H·CL-C3 (+ số L·CL-F) | L | 📏 | hoãn |

### 5.4 Màn nhập liệu, trợ năng (gói D)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 26 | Hộp 9b không đếm người đánh giá; câu `PERSON_IN_USE` / `person.inUseHelp` nói về RE (§3) | L·CL-D1, H·CL-D1, L·CX-D1, H·CX-D2 | L | ✅ 📏 | S2-I |
| 27 | Trường tiền KYC không đọc lại (NT-HS-05) (§3) | L·CL-D2, H·CL-D2, L·CX-D3, H·MU-D1 | L | 📄 ✅ | S2-E |
| 28 | Hộp 7d thiếu mã F (NT-HS-08) | H·CL-D3, L·MU-D1 | L | 📄 ✅ | S2-E |
| 29 | Hồ sơ KH: không "tính / không tính RF" ở dòng thời gian, không nhãn "thay đổi quan trọng", thẻ Lịch hẹn thiếu ô Kỳ (bộ lọc dòng thời gian là KNOWN #462) | L·CL-D3, H·CX-D1, L·CX-D2, H·CL-D9 | L | ✅ 📄 | S2-E |
| 30 | Hồ sơ ở 1 440 × 900 chỉ 2 cột, panel AI xuống dưới (mockup 3 cột) | L·CX-D4 | L | ✅ | S2-E (Q9) |
| 31 | Tạo KH cho RE ngoài góc nhìn: không báo, RE không điền sẵn → dễ tạo trùng (Lịch hẹn có NT-LH-20) | L·CL-D4 | L | 📏 web | S2-I |
| 32 | Đổi team không đưa bảng về 100 dòng | H·CX-D3 | L | ✅ | S2-I |
| 33 | Lỗi form: ô Ngày ghi chú KYC đỏ khi đang gõ; câu lỗi lưu còn sau khi sửa Giới tính; nút Xóa team / nhân sự khóa sau mọi lỗi | L·MU-D2, L·MU-D3, H·CL-D6 | L | ✅ | S2-I |
| 34 | Lùi lịch sử (Back chuột, Alt+←) khi hộp đang mở: mất bản nháp; exe chặn F5 nhưng không chặn Back | H·CL-D5 | L | 📏 web | S2-J |
| 35 | Đổi màn / nút tự gỡ làm mất focus, không báo màn mới (§3) | H·CL-D10, H·MU-D3, H·MU-D2 | L | 📏 | S2-J |
| 36 | Lệch mockup nhỏ chưa ghi: 5c "trước: 1984"; 7c cảnh báo cổng khi đánh dấu mâu thuẫn trường cốt lõi; 7a nhãn "cốt lõi"; hai mockup ghi "+ KH mới" / "+ Khách hàng" | H·CL-D9 | N | 📄 | docs |
| 37 | Dấu nối / ký hiệu viết cứng trong JSX (`', '`, `'; '`, `—`, `×`, `▾`) thay `sep.*` | L·CL-D5, L·CL-E5 | N | ✅ | lần chạm sau |

### 5.5 Lịch hẹn, HĐ, Thùng rác, Cài đặt (gói E)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 38 | Ngày điền sẵn đọc lại theo năm mới qua giao thừa (§3) | H·CL-E2, L·CX-E2, H·CX-E3 | L | ✅ 📏 | S2-G |
| 39 | Case size "ở cuộc gặp gần nhất" lấy số cuộc gặp cũ (§3) | L·CL-E2, L·CX-E3 | L | ✅ | S2-G (Q8) |
| 40 | Sửa HĐ: "khác FYP nộp" so FYP đã lưu (§3) | L·CX-E1, H·CX-E2 | L | ✅ 📏 | S2-G |
| 41 | Đổi tháng phát hành / nộp không hiện "Ảnh hưởng chỉ số" (§3) | L·MU-E1, H·MU-E3 | L | ✅ | S2-G |
| 42 | Ghi kết quả kèm "Hẹn lần tiếp theo" không chuyển tới lịch mới / không báo khi ngoài kỳ, góc nhìn | H·MU-E4 | L | ✅ | S2-G |
| 43 | Thùng rác: cột "Bản ghi" sắp theo chữ `dd/mm/yyyy`; nút "Khôi phục…" giống nhau, không `aria-label`, lý do chặn không nối nút; không tính lại khi sang ngày mới (TR-5) | L·CL-E3, H·CL-E3, H·CX-E1 | L | ✅ 📏 | S2-H |
| 44 | `listTrash` tăng tuyến tính theo KH đã xóa, thiếu chỉ mục `customer_id` (§3) | L·CL-A2, H·CL-A1 | L | 📏 | S2-H |
| 45 | Cài đặt → Dữ liệu: "Đã nạp lại…" và "Đã nhập backup…" cùng hiện sau lần thay thứ hai | H·CL-E7 | L | 📏 web | S2-H |
| 46 | "Đang xem" kỳ Năm thiếu "·" (NT-TQ-22); e2e `overview.spec.ts:85` ghim bản lệch | H·CL-E1 | L | ✅ | S2-E |
| 47 | Cách viết tỉ lệ chốt (§3) | L·CL-E4, H·CL-E5, L·MU-E4 | N | 📄 | S2-E (Q4) |
| 48 | Lệch mockup nhỏ chưa ghi: 6c "· lần n"; "Dời – hủy – không đến"; meta Báo cáo; mockup tự lệch "÷ RF"; thẻ File dữ liệu thiếu "ghi chú KYC" (mockup tự lệch với 10a); chú giải "Trong kỳ" | L·CL-E4, H·CL-E5, L·MU-E2, L·MU-E3 | N | 📄 ✅ | docs |

### 5.6 Lõi dữ liệu (gói A)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 49 | `cleanText` chỉ NFC + trim: hai dấu cách / NBSP / U+200B → team "trùng tên" nhìn thấy; giá trị KYC chỉ có ký tự vô hình thành dữ kiện, đổi cổng KYC; surrogate lẻ thành U+FFFD | H·CL-A3, H·CL-A6 | L | 📏 | S2-K |
| 50 | Nhập backup nhận mâu thuẫn KYC hai giá trị trùng (§3) | L·CX-A1, H·CX-A1 | L | 📏 | S2-K |
| 51 | Enum sai → lỗi CHECK thô (§3) | L·MU-A1, H·MU-A2 | N | ✅ | S2-K |
| 52 | CHECK `people` chỉ giữ "RE / TL phải có team", không giữ "IS / BD / BDM không có team" | H·MU-A3 | N | ✅ | S2-K |
| 53 | `ulid` với đồng hồ trước 1970 cho mã 16–17 ký tự | H·MU-A1 | N | ✅ | chấp nhận |
| 54 | Golden L-09 và comment trái DR-47 (§3) | L·CL-A4, H·CL-A10, L·CX-A2, H·CX-A2, L·MU-A2 | N | 📄 | docs (G2) + comment |

### 5.7 Công cụ, CI (gói F)

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 55 | Script eval có thể ghi key vào file kết quả (§3) | H·CL-F1, L·CX-F1, H·CX-F1 | L | 📏 | S2-L |
| 56 | Script eval bỏ `finish_reason` / `content: null` + `length` (§3) | L·CX-F2, H·CX-F2 | L | 📏 | S2-L |
| 57 | Cổng merge: Re-run CI dùng SHA cũ nhưng `startedAt` mới (luật DR-80 so giờ); `gh pr view --json files` chỉ 100 file → PR > 100 file bị coi docs-only | L·CL-F2, L·CL-F3 | L | PLAUSIBLE | S2-L |
| 58 | `tools/retro.mjs` chỉ đọc `~/.claude/projects`, bỏ `CLAUDE_CONFIG_DIR` (máy dùng `.claude-b`) → số "Điều hướng" thiếu | L·CL-F1 | L | ✅ | S2-L |

### 5.8 Test hở (đột biến sống) và bloat

| DR6 | Vấn đề | Ai thấy | Mức | Kiểm | Nhóm |
|---|---|---|---|---|---|
| 59 | Gói A: giá trị `kycHash` không ghim (giá trị lưu trong DB / backup); M15 bỏ `t.deleted_at IS NULL` (`counts.ts:75`); M10 `valueOf` nhận số lẻ (`backup.ts:191`, cột token chỉ có lớp này); N19 `rf: true` (`trash.ts:159`) | L·CL-A6, H·CL-A4, A5, A7 | L | 🧪 | S2-M |
| 60 | Gói B: tên xuất bắt đầu "." (RS4 / R8); `has_same_bytes` bỏ so độ dài (RS9); `close()` DB tạm của `readBackup` (MJ15); thứ tự `check` / `busy` (A14); bỏ `sync_all` (50 / 50 test vẫn qua); J5 | L·CL-B3, H·CL-B2, H·CX-B2 | L | 🧪 | S2-M |
| 61 | Gói C: ngoại lệ "kỷ" / "quy" / "RE" của `LAW_NAME`; trần `maxTokens` / ký tự TS ↔ Rust không có test hợp đồng (C74, C75); V4 / V6 cho `personalityNotes` | L·CL-C2, L·CL-C3, H·CL-C7 | L | 🧪 | S2-M |
| 62 | Gói D: X5 ngày "từ …" của hồ sơ, X6 "+ n KH", BR3 / BR4 chặn tải lại; `coverage.include` thiếu `packages/ui/src`, `i18n/index.ts`; D6 năm sinh = năm nay | H·CL-D4, L·CL-D6 | L | 🧪 | S2-M |
| 63 | Gói E: `restoreRow` nối sai lệnh khôi phục HĐ vẫn 47 / 47 (e2e không có luồng khôi phục HĐ); AV8 thứ tự chấm | L·CX-E4, H·CL-E6 | L | 🧪 | S2-M |
| 64 | Gói F: P3 `isNotesOnly` mọi file `docs/state/`, P5 verdict chỉ cần **chứa** "PASS", S3 SHA REVIEW 1–6 ký tự, S9 `fitOutput` | H·CL-F4 | L | 🧪 | S2-M |
| 65 | KNOWN có bằng chứng mới: `tables.test.ts` đỏ ở UTC−7 / UTC+14 (#539); `+Infinity%` ở `stats.ts:153` (#572); e2e "1984" quét cả `sessionId` (0,049 %, #524) | L·CL-F4, H·MU-F1, H·MU-F2 | N | KNOWN | S2-M |
| 66 | Export / hàm chỉ test dùng hoặc không ai dùng: `getAppointment`, `getPolicy`, `getTeam`, `getPerson`, `markKycVersionMaterial`, `isCustomerLive`, `monthToDate`, bí danh `liveCustomer`; `PersistQueue.unsaved()`; `markName`, `AI_LOCAL_ERROR_CODES`, `ConfirmProposal`, `TokenReader`, `ShowMoreFoot`, `TokenViolation`; `class="dark"`, `birth.error.empty`, `PLAIN_SLOTS`, `useMemo` vô tác dụng | L·CL-A3, H·CL-A8, H·CL-B4, L·MU-B1, L·CX-E5, L·MU-C4, H·MU-D4, H·CL-D8 | N | ✅ | hoãn |
| 67 | Code lặp ≥ 3 nơi: `update<X>Row` ×5, `nextSeq` ×5, `find / live<X>` ×6, `yearBefore` ×2 + `DAY_MS` của seed; hằng `CARD` ×4–6 / `ALERT` ×4 / `LINK` ×3; 17 cột báo cáo khai ×3; kiểu "lỗi AI có mã HTTP" ×5; bỏ dấu ×4 (KNOWN #543 + `fold` của `ai`); `read_dir` bỏ lỗi ×3 | L·CL-A5, H·CL-A9, H·CL-D7, L·MU-F1, L·CL-E6, H·CL-C5, L·CL-F5, H·MU-B3 | N | ✅ | hoãn |

## 6. KNOWN có bằng chứng mới, phát hiện bị bác

**KNOWN có bằng chứng mới (giữ ở sổ, cập nhật dòng):** #87 `.tmp` trong `backups\` + thư mục tạm của test Rust (DR6-09: số lượng / cỡ); #539 `listTrash` (DR6-44 tách thành vấn đề mới vì nguyên nhân khác) và comment DR-15 của `test-support.ts` (DR6-65: thêm `tables.test.ts`); #543 `plain` (DR6-67: bản thứ tư ở `packages/ai`); #572 `+Infinity%`; #524 "1984" (DR6-65).

**Bác (3, đều Muse bản Home PC — probe gọi thẳng lệnh `db`, không đi đúng đường app):**

| ID | Nói | Vì sao sai |
|---|---|---|
| H·MU-C1 | Chữ AI có NUL qua V1, lưu `output_json`, đọc lại vỡ JSON | `recordAiAnalysis` lưu `JSON.stringify(output)` (`ai-analyses.ts:145-148`), NUL thành `\u0000` sáu ký tự ASCII. 🔁 sql.js: chuỗi qua `JSON.stringify` đọc lại và `JSON.parse` đúng; chỉ chèn NUL thô vào SQL (như probe) mới bị cắt. Không có đường app nào ghi NUL thô |
| H·MU-E1 | Chart từng team xếp theo thứ tự dữ liệu, không theo tên | Màn đọc `useTables()`, `teams` đã `sortedByName` (`tables.ts:42`); probe dùng `listTeams` (theo id) |
| H·MU-E2 | `searchCustomers` không sắp theo tên | Hộp 6a truyền `data.customers` đã `sortedByName` (`tables.ts:44`, `AppointmentDialog.tsx:141`); hàm lọc giữ thứ tự đầu vào nên kết quả theo tên |

## 7. Bloat và hiệu năng

### 7.1 Hiệu năng — không có phát hiện P nào vượt ngưỡng trên dữ liệu tải

**Exe release ở SHA ghim** (`common\perf\perf-ref.json` của laptop, bước chuẩn bị 14/10 09:28; cùng máy với số đo nền T-219, `docs/metrics/phase-6.md`):

| Thao tác | Số nền T-219 (`b139d8a`) | Lượt 1 (`8855345`) | Ngưỡng | |
|---|---|---|---|---|
| `app.open-data` | 251 ms | 272,5 ms | ≤ 600 ms | ✅ |
| `reload.*` (6 màn) | 206–338 ms | 206,9–348,8 ms | < 500 ms | ✅ |
| `trash.open` | 89 ms | 91,2 ms | < 200 ms | ✅ |
| `customer.open-ai` / `customer.ai-history` | 24 / 3 ms | 23,1 / 6,5 ms | < 200 ms | ✅ |
| Các thao tác màn còn lại (lịch hẹn, KH, Tổng quan, Báo cáo, lọc Thùng rác) | 6–20 ms | 6,1–21,7 ms | < 200 ms | ✅ |
| `backup.read` / `backup.import` / `backup.export` | 1 035 / 50 / 481 ms | 886,1 / 51,1 / 483,8 ms | ≤ 2 000 / 500 / 1 000 ms | ✅ |
| `reports.export-excel` | 35 ms | 36,4 ms | ≤ 500 ms | ✅ |
| `appointments.next-month` / `next-year` | 116 / 134 ms | 116,8 / 120,1 ms | ≤ 300 ms; Năm − Tháng ≤ 50 ms | ✅ |
| `db.save` | 162 ms | 160,4 ms | ≤ 400 ms | ✅ |
| JS heap | — | 16,4 MB | ≤ 21 MB | ✅ |

Code sản phẩm ở `8855345` giống hệt `b139d8a` nên chênh lệch là nhiễu đo. **Codex Home PC** chạy lại probe trên exe (cổng 9357, so `perf-ref` của Home PC): mọi dòng đạt; `app.open-data` 279 ms so nền 188,5 ms (+48 %, ⚠️ theo luật nhiễu > 20 % và > 10 ms), đo thêm 230–283 ms — **cờ theo dõi cho lượt 2**, chưa quy được nguyên nhân (cùng exe, khác profile WebView2); vẫn dưới 600 ms.

**Thao tác màn chưa có trong probe** (Edge headless / bản web, cùng engine WebView2): chậm nhất là Thùng rác mở / khôi phục 72–86 ms, Phân tích Mock lần đầu 105–107 ms (dịch ≈ 175 regex V3–V6), Team sau một lần ghi 59–84 ms, Lưu kết quả 89 ms; mọi thao tác khác ≤ 40 ms (Claude D, E, C hai máy).

**Bảng hàm thuần Phase 4 đo lại trong Node** (plan §6; không so số Phase 4 khác máy):

| Hàm | Laptop (Claude F) | Home PC (Claude F / Codex F) | Ngưỡng Phase 4 |
|---|---|---|---|
| `importBackup` | 891 ms (Claude A 784; Codex 784–1 128, có nhiễu song song) | 710 / 729 ms | ≤ 1 100 ms ✅ |
| `listAppointments` | 53,3 ms (Codex 54–74) | 46,5 / 47,7 ms | ≤ 65 ms ✅ (Codex laptop lượt nhiễu 74 ms) |
| `teamCompare` tháng / năm | 2,1 / 3,2 ms | 2,1 / 3,5 ms | ≤ 15 ms ✅ |
| `reportRows` tháng / năm | 7,5 / 9,0 ms | 6,5 / 10,4 ms | ≤ 15 ms ✅ |
| `monthGrid` | 0,75 ms | 1,0 / 0,64 ms | ≤ 2 ms ✅ |
| `countRecords` | 5,8 ms | 4,8 / 4,9 ms | ≤ 15 ms ✅ |
| `listTrash` (117 dòng, 15 KH đã xóa) | 53 ms | 48,7 / 45,6 ms | màn < 200 ms ✅ |
| `listTrash` khi Thùng rác lớn dần | 75 KH xóa → 197 ms, 150 → 368, 300 → 703 | 100 KH → **211 ms**, 400 → 815 | **DR6-44**; chỉ mục `customer_id`: 389 → 36 ms (150 KH), 815 → 48 ms (400 KH) |
| Một lệnh ghi + đọc lại đủ 6 bảng | 84,5 ms | `tables()` 80,6 ms | màn < 200 ms ✅ |
| Phần AI của hồ sơ KH | 0,40 ms | 0,42 ms | ✅ |

- **Bộ nhớ:** 8 lần `readBackup` + `importBackup` liên tiếp: `rss` 478–489 MB, `heapUsed` 63,4–63,5 MB, không tăng → không rò WASM / JS (L·CL-F).
- **Lưu file:** `storage::save` 9,5–10,4 ms cho 13,4 MB; còn lại của `db.save` (≈ 140–160 ms) là IPC → tuyến tính theo cỡ file, ngoại suy chạm 400 ms ở ≈ 38 MB (theo dõi khi có dữ liệu thật).
- **Cần theo dõi khi dữ liệu thật lớn dần:** `readTables` / `listAppointments` tuyến tính theo số lịch (10 252 lịch → 46–74 ms); `listTrash` (DR6-44); `db.save`.

### 7.2 Bloat — không có code chết chạy được có chi phí đo được

| Đã chạy / đo | Kết quả | DR6 |
|---|---|---|
| `tsc --noUnusedLocals --noUnusedParameters` mọi package + app + e2e (ba bên) | 0 — hai cờ vốn bật ở `tsconfig.base.json` | — |
| `pnpm lint:deps` | 0 vi phạm, 309 module / 1 244 phụ thuộc | — |
| Module mồ côi (depcruise, L·CL-F) | 0 module sản phẩm không ai import | — |
| Quét export ↔ nơi dùng (cả ba bên, ≈ 1 000 export) | Không hàm sản phẩm chạy thật nào chết; vài hàm `db` chỉ test dùng (≈ 45 dòng), vài export / kiểu thừa | 66 |
| Code lặp (đọc + quét nguyên thân hàm / cấu trúc, H·CL-F `dup-scan`) | 2 nhóm trùng nguyên thân (đều KNOWN); lặp cấu trúc ngắn ở `db`, hằng class Tailwind, cột báo cáo | 67 |
| Bundle (`pnpm build:web`, Δ 0 cả 3 bên) | JS / CSS 2 364 283 B, gzip 697 071 B. `index.js` theo source map (L·CL-F): `react-dom` 23,6 % · màn 21,6 % · **`zod` 10,1 %** (89 KB, gồm ≈ 17 KB sinh JSON Schema không dùng) · `db` 7,7 % · `drizzle-orm` 7,2 % · `vi.ts` 6,6 %. `chart.js` (ECharts 513 KB) nạp sẵn vì màn đầu là Tổng quan; `exceljs` (930 KB) chỉ nạp ở lần xuất đầu | 25 |
| Exe | 5 414 400 B, Δ 0; dependency Rust 6 trực tiếp / 294 crate, đều dùng; `cargo clippy -W pedantic`: 18 cảnh báo lib, không cái nào là lỗi / code thừa | — |
| Build | `crate-type` thừa: +11,5 s mỗi build release, 187 MB `target` | 13 |
| Khóa i18n | 1 080–1 085 khóa, 0 khóa không dùng; mã lỗi ↔ câu i18n đủ | — |

Đề xuất refactor bloat (giữ hành vi, test cũ xanh trước / sau, không đổi golden): DR6-66 (≈ −50 dòng SP), DR6-67 (≈ −100 dòng, nhiều file), DR6-25 (≈ 120–300 dòng đổi cú pháp, −60 KB min). **Đề xuất hoãn cả ba sau v1.0** (§8.5); chỉ làm DR6-13 (1 dòng, lợi đo được) trong đợt sửa.

### 7.3 Chất lượng test

Đột biến của Claude (hai máy, trên bản chép / patch gỡ ngay): laptop A 33 / 35 · B 58 / 64 · C 69 / 77 · D 41 / 43 · E 67 / 70 · F 33 / 35 bị giết; Home PC 412 đột biến, 30 sống. Codex, Muse chạy thêm đột biến chọn lọc. Mỗi đột biến sống có hệ quả thật đã thành DR6-59…64 (≈ 25 ca test, không đổi code sản phẩm). Lỗ đáng kể nhất: không có test thuộc tính "xóa rồi khôi phục = như cũ" — chính lỗ để DR6-01 lọt (E1–E16 chỉ có cuộc gặp có chuyển nhóm; fuzz gói A so "lý do chặn của màn = lỗi của lệnh", cả hai cùng sai).

## 8. Kế hoạch xử lý

### 8.1 Việc còn lại của T-223 (phiên tổng hợp)

1. **PR docs báo cáo gốc** → `docs/reviews/raw/2026-10-15/`: `{claude,codex,muse}/{A…F}.md` của laptop (chính thức) + `home-pc/{claude,codex,muse}/{A…F}.md` (tham khảo, Q11); `common-known.md`, `common-baseline.md` của **laptop** (cần chép từ `C:\workspace\deep-review-1-6\common\` trên laptop — bộ `.rar` chỉ có báo cáo), `common-baseline-home-pc.md`; cập nhật `raw/README.md`. Tên user Windows trong đường dẫn (`L·CL-F`, 4 chỗ) thay bằng `<user>` như raw 2026-10-06.
2. **Kiểm độc lập bằng log phiên** (plan §8) — **phải làm trên laptop** (log ở đó): transcript Claude (`.claude*\projects\C--workspace-Project-2C-review\`), log Codex, `muse export` 6 gói → quét đầu vào lệnh công cụ theo danh sách plan §8. Kèm: Owner xác nhận ACL §7.2 đã đặt trước phiên Muse đầu tiên và gỡ sau F (HANDOFF lúc 14/10 tối ghi "chưa đặt").
3. **Owner trả lời §9** → tạo Issue sửa theo §8.2–§8.4 (mẫu Task, milestone Phase 6, ≤ ~400 / ~800 dòng), thêm vào "Bị chặn bởi" của #564 (bước 0 lượt 2).
4. **PR riêng `docs/state/review-notes.md`:** mục hoãn / chấp nhận (§8.5) và cập nhật 5 mục KNOWN (§6).

### 8.2 Đợt S1 — bắt buộc trước v1.0 (Medium + họ của nó)

Cả hai cần Owner chốt luật trước (G2): thêm ca vào spec, rồi mới sửa code.

| Nhóm | DR6 | Việc | Cỡ ước lượng | File chính | Test chấp nhận | Rủi ro |
|---|---|---|---|---|---|---|
| **S1-A** Nhóm tại ngày cuộc gặp | 01, 03, 04, 05 (+ M15, N19 của 59) | (1) Spec (G2): TR-3 thêm E18 "cuộc gặp giữ nhóm, KH đổi nhóm sau → khôi phục được, không thêm chuyển nhóm", E19 (ca cùng ngày của DR6-03), E20 (DR6-05); spec Phase 3 §4 dòng `recordMeetingOutcome` so "nhóm sau" với nhóm **tại ngày cuộc hẹn** thay cho nhóm hiện tại. (2) Một hàm `meetingStageMove(db, row)` so `stage_after` với **nhóm của KH tại ngày cuộc gặp** (`stageOn` của `domain`) thay cho nhóm hiện tại, dùng chung cho `checkRestoreAppointment`, `restoreAppointment`, `listTrash` (hệ quả TR-8), `recordMeetingOutcome` / `editMeetingOutcome`. (3) 6c / 6f lấy `from` = nhóm tại ngày gặp, khóa ô nhóm như D7 khi KH đã có chuyển nhóm sau ngày đó. (4) D7 từ chối xóa cuộc gặp có chuyển nhóm khi có cuộc gặp Đã gặp sau nó ghi nhóm mới; 5d không chuyển tay lùi qua cuộc gặp đã ghi; luật nhập backup kiểm "cuộc gặp không có chuyển nhóm thì nhóm sau = nhóm tại ngày đó" (K1: nạp lại). | ≈ 80–110 SP + ≈ 200 test → **tách hai Issue**: A1 lệnh + Thùng rác (1)(2), A2 hộp + D7 + nhập backup (3)(4) | `packages/db/src/{appointments,trash,customers,backup-validation}.ts`, `apps/desktop/src/routes/appointments/{OutcomeDialog,EditOutcomeDialog,outcome-form}.ts(x)`, `docs/design/phase-6-hoan-thien.md` | E18–E20 ở `trash.test.ts`; **test thuộc tính** trên seed demo: xóa rồi khôi phục từng lịch / HĐ / KH → `exportBackup` (bỏ `updated_at`, `deleted_at`) như cũ; probe tổng hợp: 0 / 4 254 bị từ chối | med |
| **S1-B** Bàn giao KH | 02 | Theo Q3 (đề xuất a): 5c chuyển luôn lịch **Dự kiến** (chưa có kết quả) của KH sang RE mới trong cùng transaction, hộp 5c nói "n lịch dự kiến chuyển sang RE mới"; 6c "Hẹn lần tiếp theo" và 6h "Hẹn tiếp" lấy **RE hiện tại của KH**; lịch đã có kết quả, HĐ giữ RE cũ (ADR-0007). Spec Phase 3 ghi luật (G2). | ≈ 40 SP + test lệnh + e2e NT-KH-09 mở rộng | `packages/db/src/{customers,appointments}.ts`, `CustomerDialogs.tsx`, `AppointmentDialog.tsx`, `vi.ts` | lịch Dự kiến đổi RE, lịch Đã gặp không đổi; RF của cuộc gặp sau bàn giao tính cho RE mới (`periodMetricsByScope`); luật nhập backup 5 vẫn giữ | med |

### 8.3 Đợt S2 — trước G7 (đề xuất, Owner chọn phạm vi ở Q10)

| Nhóm | DR6 | Việc | Cỡ | Nhãn |
|---|---|---|---|---|
| **S2-C** File và thông báo lỗi | 06, 07, 08, 09 | `PRAGMA quick_check` trong `openAppData` trước `storage.backup()` (khác `ok` → lỗi khởi động như file không mở được); Rust trả mã riêng cho file bị giữ (os 32 / 33) và thư mục không ghi được (5), `save()` ánh xạ `DISK_FULL`; câu khởi động / dải lưu tương ứng; `openFrom` lưu `db.export()`; `open` dọn `backups\*.db.tmp`; `temp_dir()` của test Rust tự xóa | ≈ 50 SP + test Rust / TS | `build-exe`, med |
| **S2-D** Rust + phát hành | 10, 11, 12, 13, 14 | `reveals` / `mask` giải hai lượt có giới hạn (JSON → %XX); `check()` giới hạn model ≤ 128 ký tự tên hợp lệ; phiên bản **1.0.0** ở 3 file (hoặc bước G7, Q12); `crate-type = ["rlib"]`; capability chỉ quyền dùng + `base-uri 'none'; form-action 'none'` (thử tay đóng cửa sổ trên exe) | ≈ 40 SP | `build-exe`, med |
| **S2-E** Nghiệm thu G7 | 27, 28, 29, 30, 46, 47 | Theo Q4 / Q9: đọc lại tiền KYC khi `parseVnd` hiểu được; mã F ở 7d (và "Đang có:" 7c); "·" ở "Đang xem" + sửa e2e; "· tính RF / không tính RF" + nhãn "thay đổi quan trọng" ở dòng thời gian (+ sửa e2e); bố cục 3 cột ở 1 440 nếu Owner chọn; các điểm không sửa → docs (§8.4) | ≈ 60–80 SP | low |
| **S2-F** AI (không cần G5) | 15, 16, 18, 19, 22 (phần code) | Phiên ChatGPT web ghi `generation`, `saveChatGptAnswer` trả `discarded` khi đổi, `webChip` không ném; V1 đếm sau khi bỏ `\p{Cf}`; `LAW_NAME` miễn KH / RE mọi kiểu chữ (đúng chữ G5 §8.4, Q6); seed ghi version prompt hiện hành (đưa vào `schema.ts`), sửa e2e; Mock trích xuất chỉ nhận câu có chủ thể KH, không phủ định; comment "64 tokens", `vi.ts` "200.000" | ≈ 60 SP | med |
| **S2-G** Hộp lịch hẹn / HĐ | 38, 39, 40, 41, 42 | Ô ngày chưa sửa giữ ngày đã lưu (hoặc điền đủ năm) ở 6f, 6h, 8b, 8d; case size theo Q8; "khác FYP nộp" so ô đang sửa; dòng ảnh hưởng hai tháng khi đổi tháng; ghi kèm lịch tiếp theo gọi `show` | ≈ 70 SP | low |
| **S2-H** Thùng rác / Cài đặt | 43, 44, 45 | Chỉ mục `appointments(customer_id)`, `policies(customer_id)` (migration + test mở DB cũ có dữ liệu) hoặc đếm một lượt `GROUP BY`; cột "Bản ghi" không sắp (hoặc giá trị sắp theo loại); `aria-label` nút khôi phục + `aria-describedby` lý do; `listTrash` theo `useToday`; một thông báo chung cho mục Dữ liệu | ≈ 45 SP + migration | med |
| **S2-I** Team / Khách hàng | 26, 31, 32, 33 | `personUsage` đếm người đánh giá + câu riêng; báo / điền sẵn RE khi tạo KH ngoài góc nhìn; `resetKey` bảng Team; ô Ngày 7a báo lỗi sau Lưu, Giới tính xóa lỗi form, nút Xóa không khóa với lỗi thử lại được | ≈ 50 SP | low |
| **S2-J** Trợ năng điều hướng | 20, 34, 35 | Exe chặn Back / Forward (phím, nút chuột 4 / 5) như F5 (đóng luôn đường vào của DR6-15); đổi màn focus `h1` + `document.title`; điểm focus ổn định sau Hủy / Thử lại trích xuất, sau "Hiện thêm" cuối, "+ n KH" | ≈ 40 SP + e2e `asExe` | low |
| **S2-K** Chữ và nhập backup | 49, 50, 51, 52 | `cleanText` gộp khoảng trắng Unicode, bỏ `\p{Cf}`, từ chối chuỗi UTF-16 hỏng (lệnh + nhập backup, K1); luật 7 nhập backup kiểm giá trị mâu thuẫn khác nhau; kiểm enum ở lệnh (mã lỗi có sẵn); CHECK `people` đủ hai vế (migration) | ≈ 50 SP | med |
| **S2-L** Công cụ | 55, 56, 57, 58 | Script eval dùng chung luật key của Rust (chặn `content`, che %XX / escape) và `finish_reason` / `null + length`; `merge-pr` so SHA `main` mà CI đã gộp (hoặc cấm Re-run trong `CLAUDE.md`), lấy file PR bằng REST phân trang / chặn khi đúng 100 file; `retro.mjs` đọc `CLAUDE_CONFIG_DIR` | ≈ 80 dòng `tools/` + test | low |
| **S2-M** Test hở | 59–65 | ≈ 25 ca test như từng mục §5.8 (gồm test hợp đồng trần TS ↔ Rust, `kycHash` ghim, `coverage.include`), không đổi code sản phẩm | ≈ 200 dòng test | low |

### 8.4 Đợt G5, G3 và PR docs

- **G5 (Q5):** DR6-17 (chuẩn hóa lại sau khi bỏ `\p{Cf}`; mẫu V6 khớp khi giữa là ký tự vô hình), DR6-23 ("hướng nội / hướng ngoại", "nghị định" sang "Bỏ dấu: không"), có thể DR6-24. Tăng `prompt_version` nếu đổi chữ prompt; danh sách chặn đổi = qua G5. Đề xuất: **hoãn sau v1.0** (Low, cần output suy biến; G5 §10.10 coi model không đối kháng).
- **G3 (Q7):** DR6-21 STALE — giữ "mờ" mà vẫn ≥ AA (chỉ làm mờ viền / nền, hoặc `opacity` ≥ 0,75 kiểm lại từng cặp) và sửa mockup `ai.html`; hoặc ghi ngoại lệ vào ADR-0013.
- **PR docs (không cần CI):** thêm vào "Lệch mockup đã biết" của `nghiem-thu-v1.md` các điểm Owner chọn không sửa (DR6-29 ô Kỳ, DR6-36, DR6-48, và phần của DR6-27 / 47 theo Q4); ghi chú golden L-09 "dữ liệu trước DR-47" (DR6-54, G2, không sửa số / fixture); `ai-eval.md:13`; ghi chú mockup 1f "1 024 token" ở lần sửa `ai.html` sau. Comment trong code (`model.ts:76`, `appointment-counts.ts:35`, `seed.ts:575`) đi cùng S2-F hoặc S1-B.

### 8.5 Hoãn sau v1.0 / chấp nhận (ghi `review-notes.md`)

DR6-23, 24 (G5 sau) · DR6-25 (`zod/mini`) · DR6-37 (dấu nối cứng, lần chạm sau) · DR6-53 (`ulid` trước 1970, chấp nhận) · DR6-66, 67 (dọn export / code lặp khi chạm file) · cờ `app.open-data` Home PC (đo lại ở lượt 2).

### 8.6 Thứ tự, ước lượng

1. Owner trả lời §9 (một lượt). 2. PR spec G2 cho S1-A / S1-B (docs). 3. S1-A1 → S1-A2 → S1-B (mỗi Issue một phiên, review phiên sạch, `risk:med` → Owner merge). 4. S2 theo phạm vi Q10; nhóm `build-exe` (S2-C, S2-D) gộp để build exe ít lần. 5. Lượt 2 (#564) chạy trên SHA sau đợt sửa, so hiệu năng với `perf-ref.json` laptop.

| Phương án | Gồm | Issue | Dòng SP (ước) |
|---|---|---|---|
| **1 — tối thiểu** | S1-A (2 Issue), S1-B, S2-E (quyết NT), S2-D phần phiên bản / key, S2-L phần key eval | ≈ 6 | ≈ 230 |
| **2 — sửa hết trừ phần hoãn** (đề xuất, như quyết định 06/10 "sửa hết") | S1 + S2-C…M + PR docs; G5 / G3 theo Q5 / Q7 | ≈ 15 | ≈ 650 + ≈ 400 test |

## 9. Câu hỏi cần Owner quyết

Mỗi câu có đề xuất; Owner đồng ý mà không ghi gì khác thì lấy đề xuất.

1. **DR6-01 — khôi phục cuộc gặp giữ nhóm.** (a) Khôi phục "về như lúc xóa": cuộc gặp không có chuyển nhóm bị rút khi xóa thì khôi phục không ghi chuyển nhóm, không kiểm D10 (thêm E18 vào TR-3). (b) Giữ TR-3, nhưng 6g không cho xóa (hoặc nói "không khôi phục được") khi KH đã đổi nhóm sau ngày gặp. **Đề xuất: (a).**
2. **DR6-03 / 04 / 05 — một luật "nhóm tại ngày cuộc gặp"** cho ghi / sửa / xóa / khôi phục cuộc gặp và chuyển tay lùi ngày (§8.2 S1-A (2)–(4)): đổi dòng `recordMeetingOutcome` của spec Phase 3 §4 (hiện so với nhóm hiện tại), kèm luật nhập backup (K1: nạp lại dữ liệu giả lập, hash `tables` của dữ liệu tải sẽ đổi). **Đề xuất: đồng ý cả gói, sửa cùng DR6-01.**
3. **DR6-02 — bàn giao KH.** (a) 5c chuyển lịch Dự kiến sang RE mới; "Hẹn tiếp" / "Hẹn lần tiếp theo" lấy RE hiện tại của KH; lịch đã có kết quả và HĐ giữ RE cũ. (b) Không chuyển tự động, nhưng cho đổi RE của lịch Dự kiến ở 6f và mặc định "Hẹn tiếp" theo RE hiện tại. (c) Giữ như hiện nay, chỉ sửa câu 5c. **Đề xuất: (a).**
4. **Bốn dòng nghiệm thu G7 sẽ đỏ.** NT-HS-05 (DR6-27): đọc lại "6.000.000.000 ₫ (6 tỷ)" khi gõ hiểu được, giữ chữ tự do khi không ("Khoảng 12 tỷ"). NT-HS-08 (DR6-28): thêm mã F. NT-TQ-22 (DR6-46): thêm "·". NT-TQ-06 (DR6-47): giữ golden "100%" / "60%" (một chữ số chỉ khi không tròn), sửa câu NT-TQ-06 và ghi lệch mockup 1a. **Đề xuất: như trên** (sửa code ba dòng đầu, docs cho dòng cuối).
5. **DR6-17 (Unicode lọt V3–V6) cần một đợt G5:** làm trước v1.0, hay hoãn? **Đề xuất: hoãn sau v1.0**, ghi `review-notes.md`.
6. **DR6-16:** sửa `schema.ts` (đếm sau khi bỏ `\p{Cf}`) và `LAW_NAME` (KH / RE mọi kiểu chữ) cho **đúng chữ G5 đã duyệt**, không qua G5 lại. **Đề xuất: đồng ý.**
7. **DR6-21 (STALE dưới AA, G3):** (a) mờ mà vẫn ≥ AA + sửa mockup; (b) ghi ngoại lệ AA vào ADR-0013. **Đề xuất: (a).**
8. **DR6-39 (case size):** (a) chỉ hiện case size của cuộc gặp Đã gặp gần nhất (trống thì không hiện dòng); (b) đổi câu thành "… gần nhất đã ước lượng: {số} (cuộc gặp dd/mm/yyyy)" (đổi chữ mockup 8a). **Đề xuất: (a)**, đúng nhãn đã duyệt.
9. **DR6-30 (hồ sơ KH 2 cột ở 1 440):** làm 3 cột như mockup từ bề rộng mặc định của cửa sổ, hay ghi lệch đã biết? **Đề xuất: làm** (5–15 dòng, kiểm bằng ảnh ở 1 440 và 1 100).
10. **Phạm vi đợt sửa:** Phương án 1 hay 2 (§8.6)? **Đề xuất: Phương án 2** (sửa hết trừ phần hoãn §8.5).
11. **Báo cáo Home PC:** đưa vào repo (`raw/2026-10-15/home-pc/`) làm tham khảo, hay chỉ giữ trên máy? **Đề xuất: đưa vào** — bản tổng hợp dẫn ID của chúng (17 vấn đề chỉ bản Home thấy).
12. **Phiên bản 1.0.0 (DR6-12):** đặt trong S2-D (đề xuất) hay là một bước của checklist G7.

## 10. Kiểm độc lập và tuân thủ quy trình

Theo nội dung báo cáo (kiểm bằng log phiên **chưa làm** — §8.1 bước 2, cần log trên laptop):

- **SHA và `git status`:** cả 36 báo cáo ghi `8855345` đầu phiên; `git status --short` đầu / cuối phiên rỗng ở cả hai worktree (worktree `-review-2` của Home PC có sẵn `AGENTS.md`, `.codex/`, `.agents/` do Codex sinh từ 10/10 — đúng plan §8). Lệnh build / e2e chỉ ghi thư mục bị ignore: `apps/desktop/dist` của `-review-2` trên laptop còn bản dựng với mốc ngày demo (`index.js` +10 byte, ảnh dữ liệu mẫu) từ gói D (Codex dựng với `VITE_DEMO_ANCHOR`; Muse F ghi nhận và quy cho lần chạy e2e của gói D) — Muse F đọc số bundle từ thư mục này nên lệch +10 byte so số nền.
- **Không gọi AI thật / không đọc key:** mọi probe AI dùng Mock, `fetch` giả hoặc server loopback; key trong probe là key giả. Codex / Muse không mở exe khi bên khác đo (Codex Home PC đo exe ở cổng 9337–9357, đã kiểm cổng trống trước).
- **Chỉ đọc báo cáo của mình:** không báo cáo nào nhắc nội dung của bên khác. Muse chạy `--yolo`: lớp chặn chính là ACL (§7.2) + quét log; **Owner xác nhận ACL đã đặt** trước phiên Muse đầu tiên trên mỗi máy (HANDOFF 14/10 tối còn ghi "chưa đặt" ở laptop).
- **Khuôn báo cáo:** Muse laptop gói D, E không dùng ID `MU-<gói><số>` và gói E không theo khuôn trường (Mức / Trục / Tình trạng nằm ở tiêu đề); Codex Home PC gói A, B không có dòng đầu `XONG` (soạn trước luật "ghi dần" 13/10). Không ảnh hưởng nội dung; đã đọc theo thứ tự.
- **Muse Code tự cập nhật** 1.3.0 → 1.4.7 giữa chuẩn bị và đợt 2 (HANDOFF); model và effort không đổi.

## 11. Ghi chú phương pháp

- Phiên tổng hợp (Home PC, 15/10) đọc đủ 36 báo cáo (phần phát hiện, bloat, hiệu năng, kết luận F), gộp theo vị trí code + hậu quả, rồi kiểm mọi điểm **các bên nói khác nhau hoặc chỉ một bên / một máy thấy** trên code; với hai Medium và một phát hiện nghi sai, chạy lại probe Node (`--import` hook của `tools/load-data.mjs`, dữ liệu tải `load-2026-10-12-seed6.p2cbackup` hash khớp §6, đồng hồ 12/10/2026). Điểm nhiều bên cùng thấy, có probe của reviewer và vị trí đúng thì chỉ đọc lại code.
- Số đo Node của các bên chênh nhau tới ×2 (Codex laptop chạy song song Claude); chỉ so ngưỡng và so giữa các hàm, không suy hồi quy từ chênh lệch đó.
- Muse bản Home PC có 3 phát hiện sai cùng một kiểu: probe gọi thẳng lệnh `db` (thứ tự theo id, chèn SQL thô) thay vì đi qua lớp dữ liệu của app (`useTables` đã sắp theo tên, `recordAiAnalysis` stringify). Bài học cho prompt lượt 2: dặn reviewer dựng probe qua `apps/desktop/src/data` (`openAppData`, `tables`) khi kết luận về màn.

## Phụ lục — đối chiếu ID của từng báo cáo ↔ DR6

Mỗi phát hiện của 36 báo cáo (145) có đúng một dòng ở đây; một phát hiện gộp hai ý thì ghi cả hai DR6. "Bác" = §6.

| Báo cáo | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| **L·Claude** (37) | A1→03 · A2→44 · A3→66 · A4→54 · A5→67 · A6→59 | B1→06 · B2→08 · B3→60 · B4→12 · B5→13 · B6→07 | C1→16 · C2→61 · C3→61 · C4→18 · C5→23 · C6→22 | D1→26 · D2→27 · D3→29 · D4→31 · D5→37 · D6→62 · D7→**02** | E1→04 · E2→39 · E3→43 · E4→47, 48 · E5→37 · E6→67 · E7→**01** | F1→58 · F2→57 · F3→57 · F4→65 · F5→67 |
| **L·Codex** (19) | A1→50 · A2→54 | B1→10 · B2→08 | C1→17 · C2→16 · C3→19 · C4→20 | D1→26 · D2→29 · D3→27 · D4→30 | E1→40 · E2→38 · E3→39 · E4→63 · E5→66 | F1→55 · F2→56 |
| **L·Muse** (15) | A1→51 · A2→54 | B1→66 | C1→15 · C2→24 · C3→22 · C4→66 | D1 (`muse-D1`)→28 · D2→33 · D3→33 | E1 (`P2C-E-001`)→41 · E2→48 · E3→48 · E4→47 | F1→67 |
| **H·Claude** (43) | A1→44 · A2→04 · A3→49 · A4→59 · A5→59 · A6→49 · A7→59 · A8→66 · A9→67 · A10→54 | B1→07 · B2→60 · B3→14 · B4→66 · B5→09 | C1→17 · C2→21 · C3→25 · C4→22 · C5→67 · C6→15 · C7→61 | D1→26 · D2→27 · D3→28 · D4→62 · D5→34 · D6→33 · D7→67 · D8→66 · D9→29, 36 · D10→35 | E1→46 · E2→38 · E3→43 · E4→04 · E5→47, 48 · E6→63 · E7→45 | F1→55 · F2→**01** · F3→05 · F4→64 |
| **H·Codex** (13) | A1→50 · A2→54 | B1→08 · B2→60 | C1→19 | D1→29 · D2→26 · D3→32 | E1→43 · E2→40 · E3→38 | F1→55 · F2→56 |
| **H·Muse** (18) | A1→53 · A2→51 · A3→52 | B1→11 · B2→07 · B3→67 | C1→bác · C2→22 | D1→27 · D2→35 · D3→35 · D4→66 | E1→bác · E2→bác · E3→41 · E4→42 | F1→65 · F2→65 |
