# Tổng hợp deep review Phase 1–4 — Claude và Codex

- **Ngày tổng hợp:** 2026-10-06 · **SHA được review:** `f0c53eb` (`main` sau #347; code giống hệt `2db3e1a`) · kế hoạch: `docs/process/deep-review-phase-1-4.md` (G1 Owner duyệt 05/10)
- **Báo cáo gốc (nguyên văn):** `raw/2026-10-06/claude/{A…H}.md` (CL-*, 69 phát hiện) và `raw/2026-10-06/codex/{A…H}.md` (CX-*, 43 phát hiện); số đo nền `raw/2026-10-06/common-baseline.md`, danh sách KNOWN `raw/2026-10-06/common-known.md`.
- **Bằng chứng ngoài repo:** probe, mutation, log, exe đo đạc ở `C:\workspace\deep-review-1-4\{claude,codex}\<gói>\` trên Home PC; nguồn mọi test tạm đã chép trong phụ lục từng báo cáo.
- **Độc lập:** cả hai bên ghi đã không đọc thư mục của nhau; Claude các gói sau chỉ đọc báo cáo Claude gói trước. Phiên tổng hợp này đọc cả 16 báo cáo.
- **Kiểm lại (ADR-0001 M2):** mọi phát hiện được gộp rồi đối chiếu trên code `f0c53eb`. Cột "Kiểm" ghi cách kiểm: ✅ = phiên tổng hợp đọc đúng chỗ code và thấy khớp mô tả; 📏 = phát hiện hiệu năng, dùng số đo của reviewer (hai bên đo độc lập ra cùng cỡ thì ghi rõ); 🧪 = khoảng trống test, dùng kết quả mutation của reviewer (đã xem test hiện có không có ca đó). **Không phát hiện nào bị bác** là sai; một số được hạ / nâng mức (§6).

## 1. Kết luận chung

**Cả hai bên kết luận CHƯA SẴN SÀNG cho G7, nhưng vì lý do khác nhau:**

- **Claude (H.md §6):** vì hộp thoại (Escape đóng hộp đang chạy / hộp đóng app, focus sai nút) — CL-D1, CL-D2; F5 trong exe bỏ thay đổi chưa lưu — CL-D4 + CL-C1; một test e2e chắc chắn đỏ từ 01/01/2027 — CL-F1. "Sẵn sàng có điều kiện" nếu Owner chấp nhận ba mục đó.
- **Codex (H.md §7):** vì đường nhập backup nhận quan hệ mà lệnh không tạo được (CX-H2 người đã xóa, CX-H3 nhánh dời lịch) và tổng tiền vượt `MAX_SAFE_INTEGER` làm Tổng quan rơi vào màn lỗi (CX-H1).

**Kết luận hợp nhất (phiên tổng hợp): CHƯA SẴN SÀNG — sẵn sàng sau Nhóm A (§8), ước lượng ≈ 170 dòng SP + test, 4 Issue.**

- **Không có Critical.** Hai High của Codex (CX-C1 ghi file chồng nhau, CX-G1 dọn nhánh) có thật nhưng hạ xuống **Medium** (lý do ở §6).
- **6 Medium sau khi chốt:** DR-01 ghi file khi tải lại webview, DR-03 bảng kỳ Năm ≈ 1 s, DR-08 test đỏ từ 2027, DR-21 đổi trường KYC mang giá trị cũ (lưu sai dữ liệu qua UI thường), DR-22 `merge-pr` xóa nhánh có commit chưa push, DR-58 Escape đóng hộp đang chạy / kẹt nút X.
- **Điều cả hai cùng xác nhận là tốt:** số liệu đúng spec và golden (domain kiểm vét cạn mọi ngày 1900–2100; Claude so chéo 588 cặp số giữa các màn + 5 746 ô Excel, Codex 24 ca kỳ × góc nhìn + mọi ô 4 sheet: 0 lệch); dữ liệu do app ghi qua đủ 10 luật nhập và xuất / nhập giống hệt từng ký tự; ghi file nguyên tử, lỗi giữa chừng không để file rách; ranh giới module đúng ADR-0006 và luật kiểm bắt được vi phạm cài thử; mở exe với dữ liệu tải ≈ 0,5–0,6 s; golden không bị chiều theo code.
- **Lý do không chặn G7 bằng các lỗi nhập backup của Codex:** chỉ gặp với file backup sửa tay (lệnh của app không tạo ra được), dữ liệu hiện là giả lập (R2-02). Nhưng chúng phải sửa **trước Phase 6** (snapshot dùng lại `validateBackupInvariants`), và rẻ (≈ 100 dòng) — đề xuất làm ngay đầu Phase 5 (Nhóm B), Owner có thể kéo lên trước G7.

## 2. Số liệu

| Gói | Claude: M / L / N (tổng) | Codex: H / M / L / N (tổng) | Trùng nhau (cụm) |
|---|---|---|---|
| A domain | 0 / 3 / 5 (8) | 0 / 1 / 4 / 0 (5) | 2 |
| B db | 0 / 8 / 5 (13) | 0 / 4 / 4 / 0 (8) + 1 KNOWN | 6 |
| C Rust | 0 / 4 / 6 (10) | 1 / 1 / 1 / 0 (3) | 2 |
| D ui / shell / data / i18n | 1 / 6 / 1 (8) | 0 / 2 / 2 / 1 (5) | 4 |
| E Lịch hẹn + KH | 0 / 4 / 4 (8) | 0 / 2 / 4 / 0 (6) | 4 |
| F Tổng quan / Báo cáo / Team / Cài đặt | 0 / 2 / 4 (6) | 0 / 0 / 4 / 0 (4) | 2 |
| G tools / CI / e2e | 0 / 4 / 9 (13) | 1 / 4 / 0 / 0 (5) | 2 |
| H xuyên gói | 0 / 0 / 3 (3) | 0 / 3 / 4 / 0 (7) | (lặp lại B, D) |
| **Tổng** | **1 / 31 / 37 (69)** | **2 / 17 / 23 / 1 (43)** | |

- Sau khi gộp: **88 vấn đề riêng biệt** (DR-01 … DR-88): **20 cả hai cùng thấy** (§3), **15 chỉ Codex** (§4; Codex tự lặp trong báo cáo: A1 = H1, B2 = H2, B3 = H4, B4 = H3, B6 = H7, D2 = E6 = H5), **53 chỉ Claude** (§5).
- 26 / 43 phát hiện Codex trùng Claude; 16 / 69 phát hiện Claude trùng hoàn toàn Codex (thêm 4 trùng một phần).
- PLAUSIBLE: chỉ CL-C10 (ổ đầy) và phần "phím F5 thật" của CL-D4. Còn lại CONFIRMED bằng probe, mutation, số đo hoặc tái hiện trên exe / Edge.
- **Mức sau khi chốt:** 0 Critical · 0 High · **6 Medium** · 41 Low · 41 Nit.

## 3. Lỗi chung — cả hai cùng thấy (20)

| DR | Vấn đề | Claude | Codex | Mức C → X → **chốt** | Kiểm | Nhóm sửa |
|---|---|---|---|---|---|---|
| **01** | Lệnh file Rust (`db_open` / `db_save` / `db_backup`) chạy song song, không khóa chung; `open` xóa `project2c.db.tmp` **mọi lần** (kể cả mở lại sau F5) nên giết lần lưu đang chạy và trang mới đọc bản cũ (probe 200 lượt: 91 lần lưu lỗi, 1 lần trang hiện bản cũ rồi lần lưu sau ghi đè bản mới). Hai `save` chồng nhau dùng chung `.tmp` → file đích "đầu A, đuôi B", `integrity_check = ok`, mở ra 0 KH, mà lần lưu kia đã trả Ok. Đường vào thực tế: tải lại webview khi lưu đang chạy (xem DR-60). | CL-C1 (Low), CL-C2 (KNOWN S-2, bằng chứng mới) | CX-C1 (High) | L → H → **Medium** | ✅ `storage.rs:86` xóa `.tmp` vô điều kiện; `:249-263` một tên `.tmp`; `lib.rs:36-62` lệnh `async`, không mutex | A2 |
| 02 | `Dialog` đóng bằng unmount, không `close()` / không trả focus → sau Hủy / Escape / Lưu focus về `<body>`, Tab bắt đầu lại từ sidebar. Mọi hộp thoại. | CL-D3 (Low) | CX-D2 (M), CX-E6 (L), CX-H5 (L) | L → M → **Low** | ✅ `Dialog.tsx:20-22` chỉ `showModal()` lúc mount | A1 |
| **03** | `DataTable` render mọi dòng: Lịch hẹn kỳ Năm 7 071 dòng / 85 121 nút DOM → đổi kỳ 0,95–1,13 s, bấm sắp ≈ 0,95 s, mỗi lệnh ghi ≈ 0,5 s (Tháng ≈ 0,2 s); bảng KH 1 496 dòng 0,2–0,38 s. | CL-D7 (Low, exe) | CX-D1 (M), CX-E3 (M, Edge prod) | L → M → **Medium** | 📏 hai bên đo độc lập cùng cỡ; ✅ `DataTable.tsx:145-160` | C1 |
| 04 | Nhập backup nhận người phối hợp / người đánh giá **đã xóa** trên lịch chưa xóa (lệnh xóa người đó báo `PERSON_IN_USE`) → sửa kết quả giữ nguyên người đó báo `PERSON_NOT_FOUND`. | CL-B1 (a) | CX-B2 (M), CX-H2 (M) | L → M → **Low** | ✅ `backup-validation.ts:184-206` không xét `deleted_at` của coordinator / reviewer | B2 |
| 05 | Nhập backup nhận tên team / người / KH, ghi chú KYC, `next_step` của MET **rỗng hoặc toàn dấu cách** (và mã KH, id tùy ý) → liên kết hồ sơ KH 0 × 0 px không tên truy cập; lưu lại MET báo `OUTCOME_REQUIRED`. | CL-B1 (b) | CX-B3 (M), CX-H4 (L) | L → M → **Low** | ✅ `validValue` (`:44-53`) không có luật chữ | B2 |
| 06 | Nhập backup nhận lịch dời **tự trỏ** và **một lịch có hai lịch thay thế** → danh sách (Map, lấy con cuối) và hộp thoại (`find`, con đầu) chỉ hai ngày khác nhau cho cùng một lần dời. | CL-B1 (c) | CX-B4 (M), CX-H3 (M) | L → M → **Low** | ✅ `ownerRule` `:200-205` chỉ kiểm cùng KH + `RESCHEDULED` | B2 |
| 07 | Nhập backup nhận hồ sơ có năm sinh / giới tính mà **không có fact SYSTEM** → cổng KYC báo thiếu IDENTITY; lưu lại hồ sơ cùng giá trị không sinh lại fact (phải đổi rồi đổi lại). | CL-B2 (L) | CX-B1 (M) | L → M → **Low** | ✅ `kycRule` `:214-243` chỉ kiểm chiều fact → hồ sơ | B2 |
| **08** | `e2e/team.spec.ts:317-318` lấy năm từ đồng hồ máy chạy test, app e2e ghim 15/09/2026 → **từ 01/01/2027 test đỏ chắc chắn** ở mọi máy và CI (retry không cứu) → chặn mọi PR code giữa Phase 5. Comment "app counts the year of the machine clock" lỗi thời từ T-126. | CL-F1 (L) | CX-G4 (M) | L → M → **Medium** (có hạn chót) | ✅ | A4 |
| 09 | `merge-pr` chỉ kiểm "có nhãn `build-exe` → có check exe", không suy nhãn từ file → PR sửa `storage.rs` / Cargo / lockfile / `vite.config` thiếu nhãn merge được mà 37 test Rust, clippy, build exe chưa chạy (15 PR gần nhất giữ được nhờ kỷ luật). | CL-G1 (L) | CX-G2 (M) | L → M → **Low** | ✅ `pr-core.mjs:77-84` | D1 |
| 10 | Test không giữ "Xuất Excel dùng kỳ đã Lọc": mutation lấy kỳ chưa Lọc cho tên file vẫn xanh 8/8 e2e Báo cáo. | CL-F2 (FT15) | CX-F4 (L) | **Low** (T) | 🧪 | E2 |
| 11 | Test đếm của hộp nhập backup chỉ có team → đếm HĐ thành 0 vẫn xanh (121 unit + 7 e2e backup). | CL-D6 (D12) | CX-D4 (L) | **Low** (T) | 🧪 `app-data.test.ts:447-468` | E2 |
| 12 | Test `restorePolicy` không giữ `requireRe` → bỏ guard vẫn xanh; khôi phục HĐ của RE đã xóa tạo file xuất không nhập lại được (luật 5). | CL-B6 (PO3) | CX-H6 (L) | **Low** (T) | 🧪 ✅ `policies.ts:101` | E1 |
| 13 | `parseTime` thiếu ca biên "24:00" (test có "25:00"); mutation `> 23` → `> 24` xanh. | CL-E4 (AF5) | CX-E5 (L) | **Nit** (T) | 🧪 | E2 |
| 14 | Test Rust không giữ tính nguyên tử của `write_atomic`: ghi thẳng tên đích, xóa-trước-rename (làm **mất** DB khi rename lỗi — Codex tái hiện bằng handle Windows), để `.tmp` khi lỗi, bỏ `sync_all` — đều 37/37 xanh. Claude thêm: lá chắn `\` trong tên xuất, nhánh thư mục trùng claim, tỉa không xóa bản vừa ghi. | CL-C4 (L) | CX-C2 (M) | L → M → **Low** | 🧪 | A2 |
| 15 | Seed / test phụ thuộc múi giờ máy: `setup()` 08:00Z → 6 test đỏ ở UTC−10; seed trưa UTC → ở UTC+13 140 ghi chú / phiên bản KYC lệch ngày, cùng seed ra dữ liệu khác. Claude thêm `today.test.ts` đỏ ở ngày đổi giờ (DST). Không ảnh hưởng hai máy (+7) và CI (UTC). | CL-B12 (N), CL-D6 | CX-B7 (L) | **Nit** | 🧪 | E1 |
| 16 | Lịch tháng / lưới năm: tên trợ năng của nút chỉ có tổng; số theo nhóm (chưa ghi kết quả / đã gặp…) nằm trong phần `aria-hidden` hoặc `title`. Khác KNOWN #156. | CL-E5 (N) | CX-E4 (L) | **Low** (A) | ✅ `YearGrid.tsx:92-96, 109-128` | F |
| 17 | `inScope` dựng lại matcher (filter `people` + Set) cho **từng** bản ghi: lọc Team 10 434 lịch 6,0 ms so với 0,26 ms khi dựng một lần. | CL-A7 (N) | CX-A3 (L) | **Nit** (P) | 📏 hai bên cùng số | C2 |
| 18 | Export của `@p2c/domain` không có nơi gọi sản phẩm: `compareStages`, `isRfAppointment`, `monthToDate` (cả hai); Claude thêm `policyBadge` (UI tự đếm lại), `stageOn`, `stageSnapshot(ter)`, `EMPTY_KYC_PROFILE`, `NEXT_YEAR_SUGGESTION_DAYS`, `Math.max(monday, FIRST_DAY)` vô tác dụng. | CL-A5 (L) | CX-A5 (L) | **Nit** (B) | ✅ grep | F |
| 19 | Key i18n `app.subtitle` không nơi dùng. Claude thêm nhánh cuối `Screen` (`screen.placeholder`) không thể tới. | CL-D8 (N) | CX-D5 (N) | **Nit** (B) | ✅ grep | F |
| 20 | Mỗi lệnh ghi / mỗi lần vào màn đọc lại **toàn bộ** bảng (`listAppointments` 92–97 ms, bộ đọc của Tổng quan / Báo cáo 130–240 ms) và So sánh team / Báo cáo tính từng RE bằng cách quét toàn bộ dữ liệu (28–56 ms; gom theo RE một lần: 3–4 ms). Vào Tổng quan 150–270 ms, Báo cáo 145–250 ms. | CL-B8 (L), CL-F6 (N) | CX-F1 (L) | **Low** (P) | 📏 hai bên cùng cỡ (`listAppointments` 92–97 / 93,7 ms) | C2 |

## 4. Lỗi chỉ Codex thấy (15)

| DR | Vấn đề | Codex | Mức X → **chốt** | Kiểm | Nhóm sửa |
|---|---|---|---|---|---|
| **21** | Hộp **Ghi chú KYC**: đổi "Trường" chỉ đổi `field`, **giữ nguyên ô giá trị** → nhập "Huế" cho Nơi sinh sống, đổi sang Mục tiêu chính, Thêm dữ kiện → lưu **"Mục tiêu chính: Huế"** (tái hiện qua UI thật, ghi vào DB, sinh phiên bản v1). Sai dữ liệu qua thao tác bình thường. | CX-E1 | M → **Medium** | ✅ `KycDialogs.tsx:218-222` `onChange` chỉ `setField` + `setErrors` | A3 |
| **22** | `merge-pr` dọn nhánh khi worktree task **sạch** nhưng HEAD local có commit **chưa push** (mới hơn PR head): vẫn `worktree remove` + `branch -D` → commit chỉ còn tìm được bằng `git fsck` tới khi gc. | CX-G1 | H → **Medium** | ✅ `pr-core.mjs:183-198` không so `head` của worktree với `headRefOid`; `merge-pr.mjs:144` không truyền SHA | D1 |
| 23 | Tổng FYP không kiểm tràn: mỗi HĐ được tới `MAX_SAFE_INTEGER` (9 triệu tỷ đồng) nên hai HĐ hợp lệ cộng lại vượt → tổng sai 1 đồng và `formatVndCompact` ném `RangeError` → **Tổng quan rơi vào màn lỗi**; backup đó xuất / nhập lại được. (Review 04/10 Codex đã thấy nhưng coi là ngoài quy mô.) | CX-A1, CX-H1 | M → **Low** | ✅ `common.ts:64` chỉ `isSafeInteger`; `stats.ts` cộng không kiểm | B1 |
| 24 | "Case size dự kiến" (hồ sơ KH, hộp tạo HĐ) chỉ sắp theo ngày → hai cuộc gặp cùng ngày lấy cuộc **sớm** hơn (09:00, 100 tr) thay vì mới nhất (16:00, 900 tr). Không ảnh hưởng FYP / chỉ số. | CX-E2 | **Low** | ✅ `policy-form.ts:121-128` | A3 |
| 25 | `restorePolicy` / `restoreAppointment` không kiểm lại ngày → bản ghi đã xóa mang ngày tương lai (luật 10 cho phép) thành bản ghi sống trái luật; file xuất sau đó bị từ chối khi nhập (`rule 10`). Chưa có UI (Thùng rác Phase 6). | CX-B6, CX-H7 | **Low** | ✅ `policies.ts:96-103`, `appointments.ts:254-266` | B1 |
| 26 | `Choices` có `required` chỉ hiện dấu `*` `aria-hidden`; radio không `aria-required` (khác `TextField` / `SelectField`) → nhóm Trạng thái, Nhóm sau cuộc gặp không báo bắt buộc cho trình đọc màn hình. | CX-D3 | **Low** (A) | ✅ `Choices.tsx:38-39` | A1 |
| 27 | `PeriodPicker`: ngày không có thật / Từ > Đến chỉ viền đỏ cả hai ô, không câu giải thích, không `aria-describedby` (chỉ lỗi "quá 3 tháng" có). Khác KNOWN R4. | CX-F3 | **Low** (A) | ✅ `PeriodPicker.tsx:98-99` | F |
| 28 | `handoff.mjs write` lưu base mới **vô điều kiện** sau `gh issue edit` → máy kia ghi chen giữa edit và fetch thì base nhận mốc của bản chưa đọc, lần ghi sau đè nó. Cửa sổ vài giây; `/handoff` chuẩn luôn `read` trước. | CX-G3 | M → **Low** | ✅ `handoff.mjs:111-113` | D2 |
| 29 | e2e xuất Excel không đọc file tải về: mutation cắt file còn **1 byte** vẫn xanh 8/8. | CX-G5 | M → **Low** (T) | 🧪 `reports.spec.ts:149-157` | E2 |
| 30 | Hộp Nạp lại để mở qua nửa đêm: câu "neo ở ngày …" lấy lúc mở hộp, seed lại theo ngày lúc bấm → báo lệch một ngày. | CX-F2 | L → **Nit** | ✅ `Settings.tsx:78, 87` | F |
| 31 | Tỉa backup không thử lại ở lần mở sau nếu file DB không đổi (`find_copy` trả sớm) → thư mục giữ 11 bản tới khi có bản khác. | CX-C3 | L → **Nit** | ✅ `storage.rs:120-123` | A2 |
| 32 | `parseVnd` đệ quy theo mỗi dấu `-` → dán chuỗi 32 000 dấu trừ vào ô FYP làm tràn stack ngay trong render form HĐ. | CX-A2 | L → **Nit** | ✅ `money.ts:44-46` | F |
| 33 | Test domain để lọt 29/02/2100 (năm thế kỷ không nhuận) và biên `MAX_SAFE_INTEGER` của `parseVnd` (mutation sống 508/508). | CX-A4 | **Low** (T) | 🧪 | E1 |
| 34 | `seq = MAX_SAFE_INTEGER` qua backup → lệnh đổi nhóm kế tiếp ghi số không an toàn, rồi `UNIQUE` lỗi; file không nhập lại được. | CX-B5 | L → **Nit** | ✅ | B1 |
| 35 | Seed với ngày neo 01/01/1900 hoặc 31/12/2100 ném `RangeError` (rollback sạch). | CX-B8 | L → **Nit** | 🧪 | Owner / ACCEPTED |

Thêm **KNOWN có bằng chứng mới:** CX-B9 — export đổi thứ tự PK sang `rowid` vẫn xanh 316 test vì fixture chèn theo ULID tăng (KNOWN #184) → gộp E1.

## 5. Lỗi chỉ Claude thấy (53)

| DR | Vấn đề | Claude | Mức **chốt** | Kiểm | Nhóm sửa |
|---|---|---|---|---|---|
| **Gói A** | | | | | |
| 36 | Test trần kỳ Tùy chọn thiếu ca "ngày đầu = ngày cuối tháng thứ 3" (`>` → `>=` xanh 508/508). | CL-A1 | Low (T) | 🧪 | E1 |
| 37 | `parseVnd` từ chối "500.000 **VNĐ**" (nhận "VND", "đ", "₫"); cũng từ chối "1tr5", "1 tỷ 2", "500 000 000". | CL-A2 | Low | ✅ regex `money.ts:32-33` | F (VNĐ) / Owner (còn lại) |
| 38 | Regex `parseVnd` quay lui bậc hai khi giữa chuỗi nhiều dấu cách (20 000 → 173 ms). | CL-A3 | Nit | 📏 | F (cùng DR-32) |
| 39 | Gõ "29/02" (không năm) cuối năm trước năm nhuận → `invalid-date` thay vì gợi ý năm sau như doc comment hứa. | CL-A4 | Nit | 🧪 | Owner |
| 40 | Công thức "tỉ lệ chốt → %" ở hai nơi (`compare.ts` và `overview-view.ts`), trái quy tắc "chỉ số chỉ ở domain". | CL-A6 | Nit | ✅ | F |
| 41 | `markIndexer` mốc ngược chưa có test (v8 không tính riêng vế `||`). | CL-A8 | Nit (T) | 🧪 | E1 |
| **Gói B** | | | | | |
| 42 | Ngày ghi chú / dữ kiện / phiên bản KYC và **ngày sinh tương lai** chỉ bị chặn ở UI; lệnh db và nhập backup nhận (tới 31/12/2099). Phase 5 (AI ghi qua lệnh) sẽ không có lớp chặn này. | CL-B3 | Low | ✅ `kyc.ts:410, 433, 453` dùng `toIsoDate`, không `toPastIsoDate` | B1 |
| 43 | HĐ / cuộc gặp MET giữ nhóm **trước ngày tạo KH** được nhận; MET đổi nhóm cùng ngày lại bị chặn với mã `TRANSITION_BEFORE_LATEST`. | CL-B4 | Low | 🧪 | Owner chốt luật |
| 44 | `migrate()` chạy mọi migration trong một transaction với FK bật → migration "dựng lại bảng" do drizzle-kit sinh chạy được trên DB rỗng nhưng **hỏng trên DB có dữ liệu**; thêm `defer_foreign_keys` thì COMMIT lỗi để lại transaction mở. Bẫy cho lần đổi schema sau. | CL-B5 | Low | ✅ `database.ts:175-188` | B3 |
| 45 | 5 mutation đổi hành vi thật vẫn xanh 316 test: thứ tự giờ của `listAppointments` (AP12), `ownsLiveRecords` bỏ HĐ (TE3), xóa được người phối hợp (TE4), `markKycVersionMaterial` KH đã xóa (KY8), `birth_date` "1984-02-30" khi nhập (BV27, sau đó mọi lần đọc KH ném lỗi). | CL-B6 | Low (T) | 🧪 | E1 |
| 46 | Export db không dùng: `loadMetricsData`, `updateAppointmentDetails` (bản thứ ba của logic rút / gắn transition), `get*`, `addKycNote`/`confirmKycFact`/`markKycConflict` (chỉ seed), vài hằng; `readOverview` ≡ `readReports`. | CL-B7 | Low (B) | ✅ grep | F |
| 47 | Lệnh / nhập nhận **RE khác làm người phối hợp** (UI chỉ cho người không phải RE, ADR-0007); `updatePerson` đổi được TL đang phối hợp thành RE. | CL-B9 | Nit | ✅ | Owner chốt → B1 |
| 48 | db sắp tên theo collation BINARY ("Đ…", chữ thường, chữ có dấu đầu đứng sau "Z"); bộ chọn người đánh giá / người phối hợp, Góc nhìn, danh sách Team, **chart theo team của Tổng quan** dùng thẳng thứ tự này, còn bảng So sánh team ngay dưới sắp bằng `Intl.Collator('vi')` → hai thứ tự trên cùng màn khi có team tên "Đ…". | CL-B10 | **Low** (nâng: trái nghĩa nhãn) | ✅ `team.ts:32, 47`, `customers.ts:69` | F |
| 49 | `requireName` không chuẩn hóa NFC (UI làm ở 4 hộp) → lệnh nhận "Hừng Đông" NFD trùng tên team; ký tự NUL cắt tên. | CL-B11 | Nit | ✅ `common.ts:15-19` | B1 |
| 50 | Nhập backup `prepare` / `free` một statement cho **mỗi dòng** → nạp dòng chậm ×2,2 (≈ 0,4 s trong 1,46 s). | CL-B13 | Nit (P) | 📏 | C2 |
| **Gói C** | | | | | |
| 51 | File DB có header SQLite nhưng hỏng bên trong được `open` **chép vào `backups\` thành bản mới nhất** trước khi JS từ chối; màn lỗi khởi động hướng dẫn "chép bản mới nhất…" = chép lại đúng file hỏng. | CL-C3 | Low | ✅ `storage.rs:100-107` | A2 |
| 52 | Chương trình ngoài mở `project2c.db` không `FILE_SHARE_DELETE` (DB Browser for SQLite) → mọi lần lưu lỗi 5; câu `storage.saveFailed` không nói nguyên nhân này. | CL-C5 | Nit | 📏 | A2 |
| 53 | `find_copy` đọc trọn mọi backup cùng cỡ mỗi lần mở → mở exe +55 ms (130 MB). Codex đo cùng số (55 ms) nhưng không lập phát hiện. | CL-C6 | Nit (P) | 📏 hai bên | C2 |
| 54 | `Command::new("explorer.exe")` tên trần → `explorer.exe` đặt cạnh exe portable sẽ chạy khi bấm "Mở thư mục". | CL-C7 | Nit (S) | ✅ `lib.rs:89` | F |
| 55 | Hợp đồng JS ↔ Rust (6 tên lệnh, tham số camel ↔ snake, header `x-p2c-file-name`, `ALREADY_OPEN`) không có test chéo; lệch chỉ lộ khi thử exe. | CL-C8 | Nit (T) | 🧪 | E1 |
| 56 | ≈ 20 dòng SP + 2,5 test chỉ để đọc tên backup trước #136 và dọn file rỗng của `write_export` bản đầu (R2-02: không giữ tương thích dữ liệu cũ). | CL-C9 | Nit (B) | ✅ git log | Owner |
| 57 | (PLAUSIBLE) Ổ gần đầy: `open` ghi bản backup thứ 11 rồi mới tỉa → lỗi → app không mở dù file đọc được. | CL-C10 | Nit | đọc code | Owner (chủ ý?) |
| **Gói D** | | | | | |
| **58** | Chromium chỉ cho chặn `cancel` khi còn user activation: **Escape lần 2** đóng `<dialog>` dù `Dialog` `preventDefault()`, React không biết. Hộp "Đang nạp lại…" / "Đang nhập…" mất tác dụng chặn (mở đường từ UI tới KNOWN S-2). Hộp đóng app bị đóng như vậy → promise `ask()` không bao giờ xong, `closing` kẹt `true` → **bấm X không đóng được app nữa** (tái hiện trong exe). | CL-D1 | **Medium** | ✅ `Dialog.tsx:29-33` không nghe `close`; `CloseGuard.tsx:31` `if (closing) return` | A1 |
| 59 | `autoFocus` không ăn (React focus trước `showModal()`): hộp đóng app focus nút đầu **"Đóng và bỏ thay đổi chưa lưu"** dù code đặt ở "Thử lại" → Enter ngay = bỏ dữ liệu. Hẹn tiếp / Phát hành HĐ / Dời lịch focus sai ô. | CL-D2 | Low | ✅ `CloseGuard.tsx:68-73`; tái hiện exe | A1 |
| 60 | F5 / Ctrl+R trong exe không bị chặn, không `beforeunload` → bỏ ảnh chụp chờ lưu hoặc đã lưu lỗi mà không hỏi (tái hiện bằng `location.reload()` trong exe: team vừa thêm mất). Phần JS của DR-01. | CL-D4 | Low → gộp DR-01 | ✅ grep không có chặn | A2 |
| 61 | `flush()`: vế `!running` (giữ "ảnh chụp mới nhất ghi sau cùng") không có test. | CL-D5 | Low (T) | 🧪 | E2 |
| 62 | Mutation sống: cửa sổ `opening` lưu bản đã migrate (D2); **`token-guard` sau `*/` coi cả file là comment → `lint:tokens` xanh giả** (TG3); collator `numeric` (C2). | CL-D6 | Low (T) | 🧪 | E2 |
| **Gói E** | | | | | |
| 63 | `monthGrid` duyệt **mọi** lịch cho 42 ô (438 000 phép so): 23 ms mỗi lần bấm ngày (≈ 2/3 CPU), tăng theo số năm dữ liệu. | CL-E1 | Low (P) | ✅ `appointments-view.ts:343-347` 📏 | C2 |
| 64 | Hộp 6f "Sửa kết quả": câu `TRANSITION_BEFORE_LATEST` lấy `findLast` = transition của **chính cuộc gặp** → báo ngày cũ của nó thay vì ngày lần đổi nhóm đã chặn. | CL-E2 | Low | ✅ `EditOutcomeDialog.tsx:104` | A3 |
| 65 | Cột **"Ngày sinh"** của bảng KH sắp theo chuỗi "dd/mm/yyyy" → thứ tự theo ngày-tháng, KH chỉ có năm dồn một đầu (270 cặp kề sai). Trái quy tắc nhãn theo nghĩa thường. | CL-E3 | Low | ✅ `CustomersScreen.tsx:80-85` `kind: 'text'` | A3 |
| 66 | Test hở ở Lịch hẹn / KH: luật "Dời lịch không trùng ngày giờ cũ" **chỉ ở TSX, lệnh không kiểm, không test** (T7); `withoutError` (OF7); mức "Ảnh hưởng chỉ số" từ FYP nộp (PF4); KV2; "Tạo lịch tiếp theo" cho lịch tương lai (T2); tổng quý (T6); `*-form.ts` ngoài `coverage.include`. | CL-E4 | Low (T) | 🧪 ✅ `appointments.ts:225-242` | E2 (+ T7 → B1) |
| 67 | Dòng thời gian "Lịch hẹn lần n" trùng số khi có hai lịch dự kiến, hoặc lịch quá hạn chưa ghi rồi một lịch đã gặp. | CL-E6 | Nit | 🧪 | Owner chốt |
| 68 | Số đầu cột kanban in thô (≥ 1 000 thành "1234"), cột đã đóng dùng `formatCount`. | CL-E7 | Nit | ✅ `CustomersScreen.tsx:179` | A3 |
| 69 | Hộp lỗi đỏ chép tay 6 lần ở `customers` thay `FailureAlert`; `edit()` lặp 3 hộp. | CL-E8 | Nit (B) | ✅ grep | F |
| **Gói F** | | | | | |
| 70 | Test hở Tổng quan / Báo cáo / Team (14 mutation unit + 14 TSX sống): "so với" kỳ 1 ngày qua năm (OV4), "▲ 0 điểm %" (OV9), Tỉ lệ chốt kỳ Tùy chọn (OV10), thứ tự 6 ô (OV18), sửa ngày cuối Tùy chọn không báo chờ Lọc (AP4), thứ tự team (TC1 / RV10), ô Lịch hẹn góc nhìn Team (FT1), ẩn nhóm chart (FT9), cột Team (FT24/25)… | CL-F2 | Low (T) | 🧪 | E2 |
| 71 | `countRecords` đọc trọn 5 bảng chỉ để đếm: 97–127 ms (`COUNT(*)` 6–10 ms), mỗi lần mở Cài đặt và 2 lần khi chọn file backup. | CL-F3 | Nit (P) | ✅ `app-data.ts:321-329` 📏 | C2 |
| 72 | Dòng nhắc "bấm Lọc để cập nhật" không `role="status"` / `aria-live`. | CL-F4 | Nit (A) | 📏 exe | F |
| 73 | `staffMetrics` tính cho TL / người hỗ trợ không hiện ở đâu; nhánh "—" và key `team.noMetric` chết (sau B1 01/10). | CL-F5 | Nit (B) | ✅ | F |
| **Gói G** | | | | | |
| 74 | 4 file `CLAUDE.md` của package bị CI và `merge-pr` coi "docs-only", nhưng `pnpm verify` kiểm khối codemap + ≤ 8 000 ký tự → sửa tay merge được không qua CI, rồi **mọi PR code sau đỏ**. | CL-G2 | Low | ✅ `pr-core.mjs:15-17` | D1 |
| 75 | e2e "Hủy Nạp lại không đổi gì" chỉ kiểm hộp đóng → Hủy vẫn nạp lại ở nền vẫn xanh. | CL-G3 | Low (T) | 🧪 | E2 |
| 76 | Không e2e nào bấm Escape hay phím mũi tên (V8 coverage: `Dialog.onCancel`, `Segmented.onKeyDown` 0 lần chạy) → không bắt được DR-58. | CL-G4 | Low (T) | 🧪 | A1 |
| 77 | Không test giữ nhãn nhóm "Quản lý", `replaceState` route lạ, mũi tên ↕ (+ bằng chứng mới cho KNOWN `sortable: false`). | CL-G5 | Nit (T) | 🧪 | E2 |
| 78 | Flaky trên CI bị nuốt (`retries: 1`, không ghi lại): 2 / 110 run PR. | CL-G6 | Nit | 📏 | D2 |
| 79 | e2e seed lại dữ liệu mỗi lần tải trang: ≥ 56 % thời gian e2e, e2e = 74 % thời gian CI PR (≈ 10 phút). | CL-G7 | Nit (P) | 📏 | Owner (thiết kế) |
| 80 | Merge không đòi nhánh cập nhật theo `main`; push `main` chỉ build exe (8 / 98 PR merge khi `main` đã đổi, chưa lần nào đỏ). | CL-G8 | Nit | 📏 | D1 (tùy chọn) |
| 81 | `session-end.ps1` tạo + push nhánh `wip/…` trước khi biết có gì để commit; hai lần cùng phút → lỗi. | CL-G9 | Nit | 🧪 repo tạm | D2 |
| 82 | `bootstrap.ps1 -CheckOnly` vẫn ghi đè `$env:Path` của tiến trình. | CL-G10 | Nit | 🧪 | D2 |
| 83 | Hook `review-pr-hint` vẫn nhận "#N" trần gần chữ "review" (task, merge, deep review) — tiếp nối T1 / T-135. | CL-G11 | Nit | 🧪 | D2 |
| 84 | `period-picker.spec.ts` đặt `setFixedTime(28/09)` nhưng app ghim 15/09 → hằng / comment gây hiểu nhầm. | CL-G12 | Nit (T) | ✅ | A4 |
| 85 | 4 mutation tools sống (`isReviewWorktree`, `checkBody` đúng 9 000, `EXPECTED`, sidechain). | CL-G13 | Nit (T) | 🧪 | D2 |
| **Gói H** | | | | | |
| 86 | `readBackup` gọi `importBackup` không truyền `now` → luật 10 khi xem trước nhập theo đồng hồ máy, còn lệnh theo ngày ghim (chỉ bản có `VITE_DEMO_ANCHOR`). | CL-H1 | Nit | ✅ `app-data.ts:296` | B2 |
| 87 | `Chart` đăng ký cả `CanvasRenderer` (21,5 KB) và prop `renderer` không nơi nào truyền. | CL-H2 | Nit (B) | ✅ grep | F |
| 88 | Ngày ISO viết lại ở `db` (`toIsoDate` / `fromIsoDate` + bộ đọc riêng trong `backup-validation`) ngoài `domain`; 6 `Intl.Collator` với 2 cấu hình (thứ tự mặc định và sau khi bấm sắp có thể khác). | CL-H3 | Nit (B) | ✅ grep | F (cùng DR-48) |

## 6. Đánh giá lại mức

| DR | Reviewer | Chốt | Lý do |
|---|---|---|---|
| 01 | Codex High, Claude Low | **Medium** | Hậu quả là mất dữ liệu lặng lẽ (Codex đúng), nhưng đường vào duy nhất là tải lại webview đúng lúc đang lưu (hàng đợi lưu tuần tự trong một trang); lưu phía Rust ≈ 9–10 ms trên NVMe, trang mới cần ≥ 300 ms để mở lại → hiếm trên SSD, rộng hơn trên USB / ổ mạng. Sửa rẻ, nên làm trước G7. |
| 22 | Codex High | **Medium** | Công cụ quy trình, không phải sản phẩm; chỉ khi có commit thêm sau PR head mà chưa push; commit còn khôi phục được bằng `git fsck` tới khi gc. Vẫn đáng sửa sớm vì `merge-pr` chạy sau mọi PR. |
| 03 | Codex Medium, Claude Low | **Medium** | ≈ 1 s mỗi lần đổi kỳ / sắp ở kỳ Năm, thấy rõ; hai bên đo độc lập cùng cỡ. Sửa cần quyết định UI (§9). |
| 08 | Codex Medium, Claude Low | **Medium** | Chắc chắn xảy ra, có ngày cụ thể (01/01/2027), chặn mọi PR code; sửa ≤ 5 dòng. |
| 04–07 | Codex Medium | **Low** | Chỉ với file backup sửa tay; app tự xuất luôn hợp lệ (cả hai bên kiểm dữ liệu tải: 0 vi phạm). Quan trọng trước Phase 6. |
| 23 | Codex Medium | **Low** | Cần tổng FYP > 9 × 10¹⁵ đồng. Hậu quả nặng (Tổng quan không mở được) nhưng sửa đúng gốc là đặt trần số tiền mỗi HĐ (§9). |
| 48 | Claude Nit | **Low** | Lỗi nhìn thấy được, trái quy tắc "nhãn UI theo nghĩa thường" khi có tên "Đ…" (rất phổ biến trong tên Việt). |
| 02, 09, 14, 28, 29 | Codex Medium | **Low** | Trợ năng / test / công cụ, chưa gây lỗi dữ liệu. |

## 7. Đánh giá rủi ro

| Nhóm rủi ro | Vấn đề | Khả năng gặp | Hậu quả | Đánh giá |
|---|---|---|---|---|
| **Mất / sai dữ liệu của người dùng exe** | DR-01 + DR-60 (F5 khi đang lưu / sau lưu lỗi), DR-21 (KYC sai trường), DR-58 + DR-59 (kẹt nút X, Enter = bỏ thay đổi) | Trung bình: F5 là phản xạ khi thấy "Chưa lưu được"; đổi trường KYC là thao tác thường | Mất thay đổi chưa lưu; fact KYC sai đi vào cổng và phiên bản | **Cao nhất — sửa trước G7** |
| **Luật chỉ có ở UI** (lệnh db không giữ) | DR-42 ngày KYC / ngày sinh tương lai, DR-49 NFC, DR-66 T7 dời trùng giờ, DR-47 người phối hợp là RE, DR-25 khôi phục ngày tương lai, DR-23 tiền không trần | Thấp hôm nay (UI chặn); **cao ở Phase 5** khi AI ghi qua lệnh | Dữ liệu trái luật, file không nhập lại được | **Sửa trước khi viết `packages/ai`** |
| **Đường nhập backup lỏng hơn lệnh** | DR-04 … DR-07, DR-34, DR-86 | Thấp (file sửa tay); **cao ở Phase 6** (snapshot dùng lại validator) | Màn không sửa được bản ghi, hiển thị mâu thuẫn | Sửa đầu Phase 5 (Owner có thể kéo lên trước G7) |
| **Bẫy bảo trì** | DR-44 migration, DR-74 `CLAUDE.md` docs-only, DR-09 nhãn `build-exe`, DR-22 dọn nhánh, DR-28 HANDOFF | Thấp – trung bình, tăng theo số PR | `main` hỏng sau merge, mất commit chưa push, exe không mở file có dữ liệu | Sửa sớm (rẻ, bảo vệ mọi PR sau) |
| **CI có hạn chót** | DR-08 | **Chắc chắn** từ 01/01/2027 | Chặn mọi PR code | Sửa trước G7 (≤ 5 dòng) |
| **Hiệu năng theo quy mô dữ liệu** | DR-03, DR-20, DR-63, DR-17, DR-71, DR-50, DR-53 | Chắc chắn ở dữ liệu tải; tăng theo năm dữ liệu | Khựng 0,2–1 s; không sai số | Phase 5, task có ngưỡng đo trước / sau |
| **Test giả xanh** | DR-10–14, 29, 33, 36, 41, 45, 55, 61, 62 (`lint:tokens` xanh giả), 66, 70, 75–77 | — | Hồi quy lọt `pnpm verify` + e2e | Bổ sung dần; ưu tiên DR-62 TG3, DR-66 T7, DR-12 |
| **Trợ năng** | DR-02, 16, 26, 27, 72 | Người dùng bàn phím / trình đọc màn hình | Mất vị trí, thiếu thông tin | Gộp với Nhóm A1 / F |

## 8. Hướng giải quyết — Issue đề xuất

Mỗi nhóm một Issue theo mẫu Task (≤ ~400 dòng SP / ~800 dòng tổng). Phát hiện hiệu năng kèm số đo **trước** và ngưỡng **sau** (kế hoạch §8.4).

### Nhóm A — trước G7 (đề xuất bắt buộc)

| Issue | Phát hiện | Hướng sửa | Cỡ | Nhãn |
|---|---|---|---|---|
| **A1** Hộp thoại: Escape, focus mở / đóng | DR-58, 59, 02, 26, 76 | `Dialog` nghe sự kiện `close`: caller không cho đóng thì `showModal()` lại, cho đóng thì gọi `onClose`; `CloseGuard` coi hộp bị đóng là "chưa trả lời" và reset `closing`. Sau `showModal()` focus phần tử `[data-autofocus]` (Button / TextField gắn khi `autoFocus`). Nhớ `document.activeElement` lúc mở, trả focus khi đóng. `Choices required` → `aria-required`. e2e: Escape ×2 trên hộp đang chạy, Escape đóng hộp thường + focus về nút mở, `toBeFocused()` ở Hẹn tiếp, mũi tên trên Segmented. | ≈ 60 SP + 60 test | `risk:med` |
| **A2** Ghi file an toàn khi tải lại webview | DR-01, 60, 14, 51, 52, 31 | Rust: một `Mutex` chung giữ suốt `db_open` / `db_save` / `db_backup` (sửa luôn tên `.tmp` chung của hai lần sao lưu, KNOWN S-2 phần Rust); `open` chỉ xóa `.tmp` của DB khi lấy khóa lần đầu. JS (exe): chặn F5 / Ctrl+R / Ctrl+Shift+R. Test Rust: rename lỗi giữ DB cũ nguyên byte, không `.tmp` sót, tên có `\`, thư mục trùng claim, tỉa không xóa bản vừa ghi; tỉa cả khi dùng lại bản trùng. i18n: câu khôi phục của màn lỗi khởi động nói "bản mới nhất có thể là chính file lỗi, chép bản liền trước"; `storage.saveFailed` thêm "file có thể đang mở trong chương trình khác". | ≈ 50 SP + 120 test | `risk:med`, **`build-exe`** |
| **A3** Chữ / thứ tự sai nghĩa ở Lịch hẹn & KH | DR-21, 24, 64, 65, 68 | Đổi trường KYC → đặt lại giá trị / có-không / chế độ; `expectedCaseSize` sắp theo ngày rồi giờ; db mang ngày chặn trong `TRANSITION_BEFORE_LATEST` (`params.date`), bỏ ba cách tự tính ở UI; cột Ngày sinh sắp theo khóa `yyyy[-mm-dd]`; kanban `formatCount`. Mỗi chỗ một test (unit hoặc e2e). | ≈ 60 SP + 80 test | `risk:low` |
| **A4** Test e2e đọc đồng hồ máy | DR-08, 84 | Năm kỳ vọng lấy từ ngày ghim chung của e2e (hằng cạnh `VITE_DEMO_ANCHOR`), sửa comment; `period-picker.spec` dùng 15/09 hoặc bỏ `setFixedTime` không cần. | ≤ 15 test | `risk:low` |

### Nhóm B — ngay sau G7, trước khi viết `packages/ai` (luật vào lệnh, siết nhập)

| Issue | Phát hiện | Hướng sửa | Cỡ |
|---|---|---|---|
| **B1** Luật chỉ ở UI → vào lệnh db | DR-42, 49, 66-T7, 25, 23, 34, (47 sau khi Owner chốt) | `toPastIsoDate` cho ngày KYC và ngày sinh; `requireName` chuẩn hóa NFC (bỏ 4 chỗ ở UI); `rescheduleAppointment` từ chối ngày giờ trùng lịch cũ; `restorePolicy` / `restoreAppointment` kiểm lại ngày; trần số tiền mỗi HĐ (§9) + phép cộng có kiểm; `seq` an toàn. Cập nhật luật 10 / §6 spec cho các cột ngày mới. Theo R2-02: áp ở lệnh **và** khi nhập, không migration. | ≈ 80 SP + test |
| **B2** Siết nhập backup theo luật lệnh | DR-04, 05, 06, 07, 86 | Luật 5: người phối hợp / người đánh giá của lịch chưa xóa còn sống; mỗi lịch `RESCHEDULED` tối đa một lịch thay thế, không tự trỏ, không vòng (tính cả bản ghi xóa mềm). Kiểm giá trị: tên / ghi chú KYC / `next_step` MET trim không rỗng. Luật 8 hai chiều: hồ sơ có giá trị ⇔ có fact SYSTEM khớp đang active / conflict. `readBackup` truyền `now`. Cập nhật spec Phase 3 §6 cùng PR (G2 nếu Owner coi là đổi mô hình dữ liệu). | ≈ 100 SP + test |
| **B3** Migration dựng lại bảng an toàn | DR-44 | `migrate()` như `load()`: `foreign_keys=OFF` trước BEGIN, `foreign_key_check` trước COMMIT; `transaction()` rollback khi COMMIT lỗi; test migration giả có dữ liệu; một dòng trong `packages/db/CLAUDE.md`. Phải xong trước lần đổi schema kế tiếp có dựng lại bảng. | ≈ 20 SP + test |

### Nhóm C — hiệu năng (Phase 5, task có ngưỡng)

| Issue | Phát hiện | Hướng sửa | Ngưỡng đề xuất (dữ liệu tải) |
|---|---|---|---|
| **C1** Giới hạn dòng `DataTable` | DR-03 | Phân trang hoặc "hiện thêm" (không dependency); sắp / lọc trên toàn bộ trước khi cắt. Ảo hóa dòng (`@tanstack/react-virtual`) là G4. Đổi giao diện bảng → hỏi Owner / G3 trước. | Kỳ Năm: đổi kỳ / sắp < 200 ms; lệnh ghi không chậm hơn kỳ Tháng quá 50 ms |
| **C2** Chi phí mỗi lệnh ghi / chuyển màn | DR-20, 63, 17, 71, 50, 53 | Đọc bảng lớn bằng `sqlite.exec` + map tay; đọc một lần mỗi revision dùng chung cho các màn; chỉ số theo RE gom một lượt (helper domain kiểu `periodMetricsByMark`); `monthGrid` gom theo ngày O(N + 42); export `scopeMatcher`; `countRecords` bằng `COUNT(*)`; `load()` một statement mỗi bảng; `find_copy` so từ bản mới nhất. Đo lại đầu-cuối sau mỗi phần (thứ tự B8 → D7 → E1 / F6 theo Claude H). | `listAppointments` ≤ 65 ms; `teamCompare` / `reportRows` ≤ 15 ms; `monthGrid` ≤ 2 ms; `countRecords` ≤ 15 ms; `importBackup` ≤ 1,1 s |

### Nhóm D — quy trình / tools (`risk:low`, nên làm sớm vì bảo vệ mọi PR sau)

| Issue | Phát hiện | Hướng sửa |
|---|---|---|
| **D1** Cổng merge | DR-22, 09, 74, (80) | `cleanupPlan` nhận SHA đã merge, không xóa worktree / nhánh khi HEAD local khác SHA đó (báo Owner); `mergeBlockers` suy nhãn `build-exe` từ `pr.files` (danh sách để một chỗ, có test); `isDocsOnly` + `paths-ignore` của `ci.yml` loại trừ 4 `CLAUDE.md` có khối codemap; tùy chọn chặn khi `mergeStateStatus == BEHIND`. |
| **D2** Tools phiên | DR-28, 81, 82, 83, 78, 85 | `handoff write` chỉ lưu base khi body fetch về khớp body vừa gửi; `session-end` không tạo nhánh khi không có gì commit, tên nhánh có giây; `bootstrap -CheckOnly` không đụng PATH; hook chỉ nhận "PR #N"; in số flaky ra summary của job; 4 ca test tools. |

### Nhóm E — test còn hở (`risk:low`, 2 Issue, 0 dòng SP)

- **E1 domain / db / Rust:** DR-12, 15, 33, 36, 41, 45, 55, CX-B9 (fixture chèn id trái thứ tự). `setup()` dùng 12:00 UTC; seed ghi ngày đổi hồ sơ bằng ngày mô phỏng.
- **E2 app / e2e:** DR-10, 11, 13, 29 (đọc file `.xlsx` tải về bằng ExcelJS đã có), 61, 62 (**TG3 trước**: `lint:tokens` xanh giả), 66 (+ thêm `routes/**/*-form.ts` vào `coverage.include`), 70, 75, 77; `today.test.ts` tiến tới nửa đêm bằng `untilMidnight`.

### Nhóm F — trợ năng nhỏ + dọn code (gộp vào lần chạm file sau, hoặc T-h)

- Trợ năng: DR-16 (số theo nhóm vào `aria-label` ô ngày / ô tháng), DR-27 (câu lỗi ngày Tùy chọn + `aria-describedby`), DR-72 (`role="status"`).
- Sắp tên: DR-48 + DR-88 — một hàm `byName` chung (domain hoặc ui), db không sắp theo tên; sửa cùng 5 file tự khai collator và `compare-cells`.
- Nhập tiền: DR-37 (thêm hậu tố "vnđ"), DR-32 + DR-38 (`parseVnd` đọc dấu âm một lần, gộp dấu cách).
- Bloat: DR-18, 19, 40, 46, 54 (đường dẫn đầy đủ `%SystemRoot%\explorer.exe`), 69, 73, 87, 30.

## 9. Cần Owner quyết

1. **Phạm vi trước G7:** đề xuất Nhóm A (A1–A4). Có kéo **B2** (siết nhập backup — lý do CHƯA SẴN SÀNG của Codex) lên trước G7 không? Phiên tổng hợp đề xuất **không** (chỉ file sửa tay, dữ liệu giả lập), làm đầu Phase 5.
2. **Trần số tiền mỗi HĐ** (DR-23): đề xuất ≤ 100 tỷ đồng / HĐ (tổng an toàn tới ~90 000 HĐ, mọi FYP thực tế đều dưới), áp ở lệnh và khi nhập; hay giữ miền hiện tại và chỉ kiểm phép cộng.
3. **DataTable** (DR-03): phân trang, "hiện thêm", hay ảo hóa (G4 dependency mới)? Có cần mockup (G3)?
4. **Người phối hợp là RE** (DR-47): spec §3.6 (chỉ cấm RE của chính lịch) hay ADR-0007 (chỉ TL / IS / BD / BDM)?
5. **HĐ / cuộc gặp trước ngày tạo KH** (DR-43): chặn bằng luật mới hay ghi ACCEPTED là "nhập bù hợp lệ"?
6. **Cách gõ tiền** (DR-37): nhận "1tr5", "1 tỷ 2", nhóm nghìn bằng dấu cách?
7. **"Lịch hẹn lần n"** (DR-67): chỉ đánh số lịch đã gặp, hay đánh số liên tiếp theo ngày?
8. **Ghi ACCEPTED hay sửa:** DR-35 (seed ở biên 1900 / 2100), DR-39 (29/02 gõ tắt), DR-56 (code tên backup cũ — bỏ được theo R2-02), DR-57 (ổ đầy không mở: chủ ý "không mở khi chưa có bản sao"?), DR-79 (e2e nạp sẵn DB đã seed để CI nhanh hơn).

## 10. Đánh giá hai báo cáo

- **Claude** rộng hơn (69 so với 43): đo trên **exe release** (WebView2, IPC thật), chạy ≈ 600 mutation (unit + TSX qua e2e + Rust + tools), V8 coverage của e2e, quét 200 run CI. Phát hiện duy nhất mức Medium của Claude (DR-58 Escape lần 2) Codex không thấy — Codex có probe Escape nhưng chỉ ở lần đầu. Bỏ sót: lỗi KYC đổi trường (DR-21, sai dữ liệu qua UI thường), dọn nhánh có commit chưa push (DR-22), tràn tổng tiền (DR-23), khôi phục ngày tương lai (DR-25), case size cùng ngày (DR-24), base HANDOFF (DR-28), e2e không đọc file Excel (DR-29). Mức có xu hướng thấp (DR-01 chỉ Low).
- **Codex** sâu ở đường nhập backup (tìm cùng bốn lỗ ở gói B rồi lặp lại ở H), harness Rust có cổng điều phối tái hiện đúng file trộn A/B (DR-01), probe hành vi thật trên Edge production. Mức có xu hướng cao (hai High, nhiều Medium cho lỗi chỉ gặp với file sửa tay); tự lặp phát hiện giữa các gói (6 cặp); gói D đặt probe nhầm vào `codex\C\` (đã ghi trong báo cáo). Không có phát hiện sai.
- Kết hợp: hai bên bổ sung tốt cho nhau — 26 / 43 phát hiện Codex trùng Claude, còn 15 phát hiện riêng của Codex có 2 Medium (DR-21, DR-22) đều thật.

## 11. Việc tiếp theo

1. Owner chọn phạm vi (§9) → tạo Issue theo §8 (milestone Phase 4 cho Nhóm A, Phase 5 cho Nhóm B–F).
2. Làm Nhóm A → cập nhật `docs/state/review-notes.md` (Nhóm B–F vào OPEN, mục Owner ghi ACCEPTED) → **G7 Phase 4**.
3. Owner xóa thư mục bằng chứng `C:\workspace\deep-review-1-4\` khi không cần nữa (báo cáo gốc đã ở `raw/2026-10-06/`; probe / exe / log chỉ ở Home PC).
