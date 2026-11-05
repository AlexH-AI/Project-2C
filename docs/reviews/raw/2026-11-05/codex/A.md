XONG — codex gói A lượt 5, 2026-11-04 22:29:34 +07:00

## 1. Phiên review

- Bên codex, Gói A — Lõi dữ liệu, lượt 5. SHA `37a80b662861d308a110d1e2b0f65ad13b91fb51`. `git status --short` đầu phiên rỗng.
- Bắt đầu 22:09:07 ngày 04/11/2026, giờ Bangkok. Codex Desktop, `codex-cli 0.162.1`, PowerShell, Node v24.20.0, Vitest v5.0.1 và Edge qua Playwright. Agent được công cụ giới thiệu là Codex dựa trên GPT-6. Owner chọn GPT Sol 6.1 theo prompt. Phiên không hiện mã model hoặc mức suy luận cụ thể để xác nhận.
- Home PC `DESKTOP-KDURKJP`, Intel Core i9-12900K. Kiểm theo spec/golden đã duyệt và K1, K41, K46. Đột biến và bản dựng ở `A/`. Dữ liệu thử là giả lập.

## 2. Kiểm phần đã sửa

### R1

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-135 | #896 → #907 | **ĐÃ SỬA** | Ca mới `appointments.test.ts:1027` xanh ở SHA ghim. M1 đổi `date >= ?` thành `date > ?`, đỏ đúng ca cùng ngày, 1/71. | N1 thử xóa, sửa thành Hủy, đổi nhóm và đổi ngày, cả bốn từ chối đúng ngày 05/10. Xóa B rồi A, nhập backup, khôi phục sai thứ tự bị chặn, khôi phục đúng trả N2 và nhập lại được. |
| DR6-136 | #896 → #907 | **ĐÃ SỬA** | 10.255 lịch sắp theo KH, trung vị 64,15 → 11,45 ms, collator đối chứng 8,06 ms. Thứ tự trùng `2e51e25`. Thử trả comparator cũ làm chốt đếm khóa của probe đỏ 246.782 ≠ 1.269. | Cả 9 unit vẫn xanh với mã cũ (M2). Khoảng hở kiểm hồi quy ở CXR5-A3. Tên thật, tên trộn số toàn khổ/Ả Rập và số ngoài BMP cho kết quả đúng trên mẫu. |
| DR6-137 | #896 → #907 (+ #933 → #946) | **ĐÃ SỬA** | M3 trả `isLabel` cũ, đỏ 2/218, ở lệnh và ở lời gọi riêng của luật 12. N3 chặn nửa surrogate tại biên 100 đơn vị và U+FEFF đầu ở lệnh; file hỏng bị `BACKUP_INVALID` trước luật 12. | NUL và cả hai nửa surrogate bị từ chối. Nhãn đúng 100 đơn vị chứa cặp surrogate hợp lệ, U+FEFF giữa/cuối và U+0085 giữa đọc lại nguyên. |
| DR6-151 | #903 → #924 (+ #933 → #946) | **ĐÃ SỬA** | Phần A, `listTrash` trả mã KH. M4 bỏ mã làm đỏ 1/125. Edge tái hiện hai ca gốc. Hai KH cùng tên/cùng nhóm có hai tên nút với mã app sinh. Nhân sự cùng tên khác vai trò/team có hai tên nút khác nhau. | K41 Q3(a) được giữ. Hai biến thể ngoài ca gốc ở CXR5-A1 và CXR5-A2. |

### R2

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-332 | #933 → #946 | **ĐÃ SỬA** | Phần A, `isLabel` và `valueOf` cùng gọi `readsBackAsIs`. M5 bỏ chặn U+FEFF đầu làm đỏ 9/299 ở helper, lệnh và nhập. N3 thử 380 giá trị hỏng trên 95 cột chữ thuộc 12 bảng. | M7 bỏ bọc listener làm đỏ 4/108, gồm helper, AppData, hàng đợi lưu và AiJobs. N4 tự gỡ rồi ném, listener kế tiếp vẫn nhận cả hai lượt; hai lệnh vẫn trả bản ghi đã lưu. N5 kiểm chung khuôn tên + mã ở đường Thùng rác. Ô Giờ/focus thuộc D/E. |
| T-350 | #1001 → #1011 | **ĐÃ SỬA** | Phần A, `appointmentGroup` đọc trạng thái và ngày. M6 trả nhãn cũ ở Thùng rác làm đỏ 5/86. Edge thấy nhãn ở dòng, nút và hộp khôi phục; thao tác khôi phục thành công. Mockup 11a, `trash.html:192`, cùng chữ. | N2 kiểm lịch con của chuỗi Dời lịch, hôm nay/kế tiếp/đã qua, có và không có giờ theo bộ test. Trước khôi phục tổng 1, sau khôi phục tổng 2 gồm một Dời lịch và một Chưa ghi kết quả. Lịch tháng, lịch năm, số theo góc nhìn/mốc khớp. |

R1 4/4 và R2 2/2 **ĐÃ SỬA** trong phạm vi A. Các bảng ghi phần A của những Issue chia gói.

## 3. Phạm vi đã đọc

- `packages/domain/src` và `packages/db/src`. Danh mục 124 file Git và số dòng mỗi file ở `A/files.tsv`, gồm test, migration, metadata, cấu hình và tài liệu package. Rà nhóm chữ/ngày/tiền/sắp tên, vòng đời/RF, chỉ số/ảnh chụp, KYC/cổng/bằng chứng, transaction/schema/migration, các lệnh Team/KH/Lịch hẹn/HĐ/KYC/AI, tham chiếu nhân sự, Thùng rác/Dọn sạch, seed và backup/luật 1–14. Metadata sinh của migration đối chiếu bằng test schema, journal và mở DB cũ có dữ liệu.
- Diff đầy đủ `2e51e25..37a80b6` ở `A/diff-A.patch`, kèm `diff-numstat.tsv`. 5 tệp sản phẩm +53/−24, 6 tệp test +110/−19, 1 tệp tài liệu +1/−1. Đọc kỹ `name-order.ts:39–63`, `appointment-counts.ts:18–32`, `common.ts:88–106`, `backup.ts:188–199`, `trash.ts:78–90,125–139` và test đổi. Không có migration đổi trong diff.
- Điểm nối app `app-data.ts`, `tables.ts`, `listeners.ts`, `persist-queue.ts`, `ai-jobs.ts`, `trash-view.ts`, `SettingsTrash.tsx`, `RestoreDialog.tsx`, `appointments-view.ts`, các nơi gọi bộ đếm ở Tổng quan/So sánh team/Báo cáo/Lịch hẹn và `compare-cells.ts`. Đối chiếu hợp đồng `@p2c/ai/schema` cho lưu/nhập phân tích.
- Nguồn đúng gồm `CLAUDE.md` gốc và hai package, `CONTEXT.md`, spec Phase 3 §4/§6, Phase 4, Phase 5 §7.3, Phase 6 §4/§5, ADR-0007/0008 và golden `chi-so`, `kh-theo-nhom`, `kyc`, `lich-hen`. Đối chiếu bốn tổng hợp lượt 1–4, báo cáo A gốc và phần liên quan ở E/C/F theo mã và kịch bản, cùng `common/plan.md`, `known.md`, `fixes.md`, `baseline.md`.
- Vitest đối chứng xanh **1.825/1.825, 57 file**, gồm toàn bộ 44 file test của A và 13 file ở lớp dữ liệu/Thùng rác/Lịch hẹn. Test gốc đọc theo ca và seam liên quan, trọng tâm là các ca đổi trong diff. Lần đầu sandbox làm đường dẫn tạm SSR lỗi. Lượt đối chứng đã chạy lại với `TEMP` và `TMP` riêng.

## 4. Kịch bản mới đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| N1 | A nâng N3 → N2 lúc 14:00. B cùng ngày 09:00 nhưng ghi sau, giữ N2. Thử bốn thay đổi ở A, rồi xóa B và A, xuất/nhập, thử khôi phục ngược rồi đúng thứ tự. | 4 lần từ chối `STAGE_KEPT_BY_MEETING { date: '05/10/2026' }`, bảng y nguyên. B trước A → `STAGE_NOT_ON_DAY`. A rồi B → hai cuộc MET, KH N2, backup nhập lại đúng bảng. | — |
| N2 | Dời một lịch sang hôm sau, xóa lịch con không có giờ. Đọc cùng hàng trước, đúng và sau ngày hẹn. Khôi phục rồi so chỉ số và lịch. | Dự kiến, Dự kiến, Chưa ghi kết quả. Hộp “Không đổi nhóm KH”. Sau khôi phục lịch vẫn `SCHEDULED`, nhóm `unrecorded`. Tổng hai mắt xích ở cả ba bộ đếm. Edge kiểm hộp và khôi phục thật. | — |
| N3 | Thay từng cột chữ ở 12 bảng bằng NUL giữa, nửa cao tại biên, nửa thấp đầu hoặc U+FEFF đầu. Ghi các nhãn đối chứng qua lệnh. | 380/380 lần từ chối `BACKUP_INVALID` không có `rule`. Lệnh từ chối 4 nhãn lỗi, nhận 4 nhãn đối chứng và đọc/xuất/nhập lại nguyên. | — |
| N4 | Listener đầu tự hủy đăng ký rồi ném. Tạo hai team liên tiếp qua `AppData.run`. | Thứ tự `self, next, next`, revision +2, hai team trả về và đọc lại đúng ID. Có log lỗi giả lập. | — |
| N5 | Hai KH N3 tên Mai có mã app sinh. Sau đó sửa hai mã trong bản backup thành `K-X  Y` và `K-X Y`, nhập qua UI. | Bản gốc phân biệt được. Bản sửa tay được nhận. Hai snapshot nút của Edge trùng đúng tên truy cập. | CXR5-A1 |
| N6 | Nhập dữ liệu tải, xuất và nhập lại. Xuất tệp độc lập ở hai phiên bản nguồn và ở hai bản exe, nhập bằng SHA ghim, xuất lại để đối chiếu. | Tải đúng SHA-256, 1.481 KH sống, 10.255 lịch, 113 dòng Thùng rác, các bảng trùng. Hai tệp native schema v13, mỗi tệp 10.936.651 byte, nhập/lưu/xuất lại giữ mọi bảng. Hai tệp từ mã nguồn cũng qua cả AppData và UI. | — |
| N7 | Tạo qua lệnh hai RE tên Hòa Trùng trong Sao Mai, xóa mềm cả hai, mở Thùng rác qua Edge trên backup nguyên do app xuất. | Có hai nút cùng tên truy cập `Khôi phục nhân sự Hòa Trùng · RE · Sao Mai`. Ca hai người cùng tên khác vai trò/team ở R151 vẫn tách được. | CXR5-A2 |
| N8 | Sắp bằng bộ so của cột chữ trên lịch tải, sắp tên thật và tên trộn số toàn khổ/Ả Rập/toán học. Gỡ cache, chạy lại test thứ tự rồi đo và đếm lần tính khóa. | Cùng thứ tự ở cả năm tập trong probe. M2 qua 9/9 unit thứ tự, tái hiện mức chậm cũ trên tải. Probe đếm bắt được M2. | CXR5-A3 |

## 5. Phát hiện mới

### CXR5-A1 — Hai mã KH khác số dấu cách tạo cùng tên nút Khôi phục sau nhập

- ID: CXR5-A1
- Mức: Low
- Trục: A
- Vị trí: `packages/db/src/schema.ts:105`, `packages/db/src/backup.ts:194`, `packages/db/src/trash.ts:134`, `apps/desktop/src/routes/trash-view.ts:227` (37a80b6).
- Tình trạng: CONFIRMED
- Liên quan: DR6-151, T-326 (#924), phát sinh ở đường dùng mã KH của bản sửa sau lượt 4.
- Kịch bản: N5.
- Mô tả: Cột `code` phân biệt theo chuỗi lưu, còn tên truy cập gộp khoảng trắng. Hai mã duy nhất trong DB có thể xuất hiện như cùng một mã trong tên nút Khôi phục.
- Tái hiện / bằng chứng: `node A/scenarios.mjs`, rồi `node A/browser.mjs 2e51e25.p2cbackup 3d237b0-code.p2cbackup`. Log `browser.log` có `exactAccessibleMatches:2`. Hai thuộc tính thô là “Khôi phục KH Mai (K-X Y) · N3” và “Khôi phục KH Mai (K-X  Y) · N3”. Hai snapshot trợ năng đều công bố tên đầu. File đến từ app và chỉ sửa hai trường `code`.
- Ảnh hưởng: Người dùng trợ năng gặp hai KH cùng tên/nhóm khi nhập backup có mã được chỉnh tay. Hai ID và hai thao tác khôi phục vẫn riêng biệt.
- Đề xuất: Dùng dấu phân biệt thứ hai khi tên nút sau chuẩn hóa trùng, hoặc chốt luật nhập cho dạng mã do app sinh. Khoảng 15–40 dòng sản phẩm và một ca nhập/Thùng rác.

### CXR5-A2 — Hai nhân sự cùng tên, vai trò và team có cùng tên nút Khôi phục

- ID: CXR5-A2
- Mức: Nit
- Trục: A
- Vị trí: `packages/db/src/team.ts:205`, `packages/db/src/trash.ts:116`, `apps/desktop/src/routes/trash-view.ts:229` (37a80b6).
- Tình trạng: CONFIRMED
- Liên quan: DR6-151, biến thể có từ trước của ca nhân sự. Q3(a) đã thêm vai trò/team; hai trường ấy bằng nhau trong ca này.
- Kịch bản: N7.
- Mô tả: Hai nhân sự hợp lệ có thể có cùng cả ba trường trong nhãn. Cùng một tên nút được đọc hai lần.
- Tái hiện / bằng chứng: Hai lệnh tạo và xóa mềm trong `A/scenarios.mjs` sinh `staff-twins.p2cbackup`. `A/browser.log` ghi `N7-DOM` với `count:2` cho tên chính xác “Khôi phục nhân sự Hòa Trùng · RE · Sao Mai”.
- Ảnh hưởng: Khi chọn theo danh sách nút bằng trình đọc màn hình, tên không giúp xác định dòng nhân sự. Cột thời điểm xóa có thể cung cấp thêm ngữ cảnh nếu hai lần xóa khác giờ hiển thị.
- Đề xuất: Khi ba trường trùng, bổ sung dấu phân biệt dùng được cho cả ô và tên nút. Khoảng 20–40 dòng sản phẩm và ca hai nhân sự hợp lệ.

### CXR5-A3 — Test thứ tự tên vẫn xanh khi bỏ bộ nhớ đệm của DR6-136

- ID: CXR5-A3
- Mức: Low
- Trục: T
- Vị trí: `packages/domain/src/name-order.test.ts:93`, `packages/domain/src/name-order.ts:53` (37a80b6).
- Tình trạng: CONFIRMED
- Liên quan: DR6-136, khoảng hở của bộ test sau PR #907.
- Kịch bản: N8.
- Mô tả: Ca 20.002 tên giữ thứ tự qua ngưỡng cache. Khi cả cache bị bỏ, thứ tự vẫn đúng nên test đó và tám ca cùng tệp vẫn xanh. Probe hiệu năng chung có sắp KH theo tên và sắp lịch theo ngày, chưa đo sắp bảng lịch theo tên KH/RE là đường của DR6-136.
- Tái hiện / bằng chứng: `node A/mutations.mjs` đặt lại comparator `2e51e25` ở bản chép, `M2-cache.log` ghi 9/9. `node A/byname.mjs --old-as-current` chạy chốt xác định bằng số lần tính khóa, `M2-key-count.log` đỏ `246782 !== 1269`. Trên 10.255 lịch, comparator cũ 64,15 ms và hiện tại 11,45 ms trung vị.
- Ảnh hưởng: Một lần refactor có thể đưa chi phí sắp lịch theo tên về mức lượt 4 mà bộ test thứ tự vẫn qua. Hiện tại cache hoạt động đúng.
- Đề xuất: Thêm ca xác định giữ số lần tính khóa theo số tên khác nhau, hoặc đo đường sắp bảng lịch theo tên ở bộ probe hiệu năng. Khoảng 20–40 dòng test/probe.

## 6. Bloat và Hiệu năng

### Bloat

| Kiểm | Dữ liệu | Kết quả | ID |
|---|---|---|---|
| `tsc --noUnusedLocals --noUnusedParameters` | Hai tsconfig của A | Hai lượt exit 0. | — |
| `codemap --check` và dependency-cruiser | Bản đồ export, ứng dụng và package | Hai cổng exit 0, 354 module và 1.582 dependency, 0 vi phạm. | — |
| `size-report` và Git numstat | Hai package A | 8.748 dòng sản phẩm, 15.805 test, 341 sinh, 104 file theo bộ phân loại. So lượt 4 +29/+91/0, số file bằng nhau. So mốc cỡ `b139d8a` +1.275/+3.958/+52. | — |
| Bundle JS/CSS và exe, số chuẩn bị | Toàn app, byte thô | 2.366.456 B / 5.649.408 B. Lượt 4 2.358.427 B / 5.649.408 B, G7 2.366.449 B / 5.649.408 B. Bundle tăng 8.029 B so lượt 4 và 7 B so G7. So cỡ nền `b139d8a` bundle +2.173 B, exe +235.008 B. Mốc sau #656 dùng cho hiệu năng. | — |

`readsBackAsIs` dùng chung hai đường. `appointmentGroup` cũng dùng chung đường nhãn và đếm. `byName` giữ tối đa 20.000 khóa và dùng tên làm chính khóa cho tên Latinh. Đã xét chi phí thêm của cache bằng phép so sắp tên dưới đây.

### Hiệu năng

Node v24.20.0, ICU 78.3, Home PC nói ở mục 1. Dữ liệu `common/load/load-2026-10-12-seed6.p2cbackup`, SHA-256 `b3c9903321abccdf3301818d35dad7d7c6eac48d73814286694b554c94c77293`. Probe Node chạy riêng các lượt cùng phiên. Ảnh chụp tiến trình có Codex/Node và WebView2 đang mở, lưu `A/*-processes.log`. Số exe chuẩn bị trích riêng từ `common/baseline.md` và mốc trong đó. Luật nhiễu quá 20% **và** quá 10 ms.

| Đo | Mẫu | SHA ghim | Sau #656 / G7 / lượt 4 | Kết quả / ID |
|---|---|---|---|---|
| Sắp lịch theo KH, Node | 10.255 tên lặp, 15 lượt xen kẽ | **11,45** ms (11,40–11,91) | Collator trần có phân xử 8,06 ms cùng lượt, mốc trước #828 9,4 ms, lượt 4 chạy cùng probe 64,15 ms | 1,42× collator và +2,05 ms so 9,4. Đạt DR6-136. CXR5-A3 ở trục T. |
| Sắp lịch theo RE, Node | 10.255 tên lặp, 15 lượt | **6,14** ms (6,11–6,20) | Collator 5,07 ms, lượt 4 đối chứng 49,60 ms | Cùng thứ tự. — |
| Sắp tên KH, Node | 1.496 dòng, 15 lượt | **1,64** ms (1,61–1,77) | Collator 1,02 ms, lượt 4 đối chứng 7,35 ms | Cùng thứ tự. — |
| `listTrash` / preview / purge, Node | 113 dòng, 5 DB mới | **25,0 / 1,0 / 90,7** ms | Lượt 4 23,8 / 1,0 / 85,2. Chuẩn bị SHA ghim 24,6 / 1,0 / 88,5. | Dọn 113 → 0, giữ 0, DB 14.102.528 → 13.438.976 B. — |
| `listTrash` / preview / purge, Node | 1.313 dòng, 5 DB mới | **142,1 / 6,3 / 122,2** ms | Lượt 4 158,2 / 7,4 / 129,8. Chuẩn bị SHA ghim 134,6 / 6,1 / 117,5. | Dọn 1.313 → 0, giữ 0, DB 14.151.680 → 1.495.040 B. — |
| Sắp tên bảng KH, exe chuẩn bị | 5 lượt | **24** ms (22–25) | 23 / 23 / 24 ms | <200 ms, trong luật nhiễu. — |
| Mở Thùng rác, exe chuẩn bị | 5 lượt | **33** ms (31–37) | 34 / 33 / 32 ms | <200 ms, trong luật nhiễu. — |
| Dọn đến khung 11j, exe chuẩn bị | 1 lượt, 113 dòng | **128,0** ms | — / 130,5 / 123,3 ms | ≤500 ms, trong luật nhiễu. — |
| Mở lại dữ liệu tải, exe chuẩn bị | Mốc `app.open-data` | **330** ms | 387 / 320 / 370 ms | ≤600 ms, trong luật nhiễu. — |

Kết quả sắp tên trên tập thật không lệch ở bất kỳ vị trí nào so collator trần có phân xử hoặc comparator lượt 4. Tập 13 tên trộn chữ số cũng cho cùng thứ tự trên phép xáo đã dùng, và khớp đối chứng đổi chữ số độc lập. Điều này chỉ xác nhận các tập đã chạy. Ở phép đếm trên lịch theo KH, 1.269 tên khác nhau tạo đúng 1.269 lần tính khóa ở lượt 5, so 246.782 ở lượt 4.

Không có phát hiện P mới trên dữ liệu tải. Số nền lần lưu đầu của seed demo là 150 ms so 119 ms sau #656/lượt 4 và 123 ms ở G7, vượt luật nhiễu ở mốc phụ. LCP lần mở đầu 3.535 ms so 3.663 / 3.420 / 3.521 ms, vẫn trong luật. Đây là số chuẩn bị để F xem, tách khỏi phép đo dữ liệu tải của A.

## 7. Đếm mức × trục

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |

3 CONFIRMED, 0 PLAUSIBLE, 0 KNOWN mới. Dòng R và kịch bản đạt được ghi ở bảng riêng.

## 8. Đã xét, không thấy

| Trục | Căn cứ đã xét |
|---|---|
| R | 6 dòng phần A. Các biến thể mới ở §5. |
| E | D7, thứ tự ghi cùng ngày khác giờ lịch, khôi phục theo thứ tự, qua ngày ở lịch đã xóa và cả hai mắt xích Dời lịch. N1/N2 và các ca golden qua. |
| C | Đối chiếu Phases 3/4/6, TR-3/D7, luật nhập 4, 12, mockup 11a. Ca qua ngày ở Thùng rác, ô lịch và các nhóm đếm khớp. |
| D | So bảng sau rollback, xuất/nhập dữ liệu tải và hai bản native, FK, schema cũ, nhân sự liên bảng và test Dọn sạch. CXR5-A1 dùng đường nhập, hậu quả ở tên truy cập. |
| G | Biên nhãn, phân tích lưu và đọc qua schema, prompt version, KYC/golden và luật 12–14. N3 dùng dòng giả lập, không gọi dịch vụ. |
| S | Giá trị chữ hỏng ở mọi cột chữ của dữ liệu probe, strict envelope, bind/quote, kiểm FK và trigger qua test gốc. Browser loopback chặn yêu cầu ngoài, thay `window.open` trước tương tác. |
| P | Đã đo hai cỡ Thùng rác và ba phép sắp. Số exe và ngưỡng ở §6. |
| B | Kiểm TypeScript, export map, dependency-cruiser, cỡ và diff ở §6. |
| T | Bảy đột biến và một chốt đếm khóa, CXR5-A3. Test D7, luật chữ, listener, mã KH và nhãn lịch đều bắt gỡ sửa. |
| A | Edge kiểm tên KH, tên nhân sự và nhãn/hộp lịch trước/sau nhập. CXR5-A1/A2. |

## 9. Phụ lục

- Chạy `node node_modules/vitest/vitest.mjs run packages/domain packages/db apps/desktop/src/data apps/desktop/src/routes/trash-view.test.ts apps/desktop/src/routes/appointments/appointments-view.test.ts --maxWorkers=4`, log `A/vitest-goc.log`.
- Chạy `node A/mutations.mjs`. M1 đỏ 1/71, M2 unit xanh 9/9, M3 đỏ 2/218, M4 đỏ 1/125, M5 đỏ 9/299, M6 đỏ 5/86, M7 đỏ 4/108. M1–M7 có log riêng, phục hồi bản chép bằng `finally`. `A/M2-key-count.log` là chốt bổ sung cho M2.
- `A/scenarios.mjs` và `scenarios.log` dùng `openAppData`, `tables`, lệnh qua `app.run`, nhập/xuất qua lớp app. Chỉ dùng truy vấn đọc metadata trong N3 để liệt kê cột. `A/browser.mjs` và `browser.log` kiểm UI trên web build tại `A/web`, cổng loopback động. Hai bản backup mã KH và bản nhân sự ở `A/`.
- `A/byname.mjs`, `byname.json` lưu toàn mẫu. `A/purge-node.mjs`, `purge-node.log/json` dùng probe chuẩn, năm lần mỗi cỡ. `A/files.tsv`, `diff-numstat.tsv`, `diff-A.patch`, `size-report.log`, `bloat-gates.log` lưu cỡ và cổng.
- `A/compat.mjs` tái tạo hai tệp qua AppData. `A/native.mjs`, `native.log` xác nhận bằng tệp exe thật. Exe lượt 4 dựng lại từ `2e51e25`, Cargo offline, SHA-256 `20938bc35e18ed4dc2c49098004f3886e385b74120ffa34ad9a6073e76248635`. Bản exe nhận và xuất đối chứng là bản chuẩn bị SHA ghim, SHA-256 `167d4b3ba7cb2644e5544bcdf68300d293a4290fbbdf214fae971f37be75832a`. Diff ngoài tài liệu giữa `3d237b0` (ứng viên L3) và SHA ghim rỗng. Kết quả xác nhận trên bản build cục bộ cùng code ứng viên L3, không có file nhị phân CI của L3 trong dữ liệu được cấp. Tên artifact, hash backup và cổng CDP riêng ở log. Tệp native sạch tương thích. Ngoại lệ cũ K1/CLR4-F2 được giữ theo quyết định Owner, xem NT-EX-08/09.
- SHA cuối phiên `37a80b662861d308a110d1e2b0f65ad13b91fb51`, `git status --short` rỗng như đầu. `git diff --check` của gói qua. Giờ xong 2026-11-04 22:29:34 +07:00.
