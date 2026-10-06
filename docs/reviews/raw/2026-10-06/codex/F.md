# Deep review Phase 1–4 — Gói F (Codex độc lập)

Ngày: 05/10/2026. SHA đã kiểm trước và sau review: `f0c53eb57eb7eac8665ad87287e794ae4c5bc43b` (`f0c53eb`), worktree detached tại `C:\workspace\Project-2C-review-2`.

Kết quả: **4 phát hiện mới, đều Low / CONFIRMED**, thuộc C, P, T, A. Không có phát hiện Critical / High / Medium. Không phát hiện sai số giữa các màn hoặc trong các ô số của Excel trên ma trận tải đã chạy. Thiếu sót T được chứng minh bằng mutant ngoài repo; code sản phẩm gốc hiện xử lý đúng ca đó.

Review chỉ dùng repo ghim, `common` và bằng chứng tự tạo trong `codex/F`. Không đọc báo cáo của bên khác, không tạo Issue, không đề xuất merge, không sửa / commit repo. Root `CLAUDE.md` được đọc theo yêu cầu như quy tắc repo. Các mục trong `common/known.md` được nhận diện là KNOWN và không tính vào 4 phát hiện mới.

## 1. Phạm vi và phương pháp

Đã đọc các tài liệu bắt buộc: `docs/process/deep-review-phase-1-4.md`, `CLAUDE.md`, `CONTEXT.md`, `docs/design/phase-3-du-lieu.md`, `docs/design/phase-4-chi-so.md`, toàn bộ bốn file `docs/golden/{chi-so,kyc,lich-hen,kh-theo-nhom}.md`; `common/{README.md,baseline.md,known.md}` và cấu hình load. Không sửa golden.

Danh sách file sản phẩm / unit test chính đã đọc trọn nằm ở phụ lục A, với phạm vi dòng chính xác tại SHA trên. Bao gồm toàn bộ `routes/{overview,reports,team}`, `Overview.tsx`, `Settings*`, `FilterBar`, `applied-filter`, `period-labels`, `PeriodPicker` và các unit test đi kèm.

Đã đọc thêm để lần theo hợp đồng và đường dữ liệu: `App.tsx`, `main.tsx`, `shell/{AppShell,ScopeContext}.tsx`, `data/{AppDataContext.tsx,today.ts,app-data.ts,tauri-storage.ts}`, `i18n/index.ts` và các key liên quan trong `vi.ts`; domain `period.ts`, `stats.ts`, `stage-snapshot.ts`; DB `team.ts`, `appointments.ts`, phần neo ngày của `seed.ts`; UI `Dialog`, `Choices`, `SelectField`, `TextField`, `Segmented`, `Chart`; quy tắc UI / i18n và test cùng các tài liệu package. Đọc e2e `overview.spec.ts`, `reports.spec.ts`, `team.spec.ts`, `backup.spec.ts`, `period-picker.spec.ts`; các cấu hình Vitest, Playwright, Vite và server e2e. An toàn hẹp: `src-tauri/capabilities/default.json`, `storage.rs:139–195,362–435,903–963` và các tên command liên quan; không review lại toàn bộ Rust.

### Những phép chạy thực tế

- `pnpm exec vitest run --config C:\workspace\deep-review-1-4\codex\F\vitest.config.mts`: **10 file / 117 test xanh**, gồm 116 test gốc của F và một probe tải; 61,53 s. Log: `F/unit.log`.
- Probe tải dùng đúng `common/load/load-backup.json`: **1.496 KH, 10.434 lịch hẹn, 51 nhân sự, 4 team, 1.804 hợp đồng, 4.978 chuyển nhóm**. Kiểm 8 kỳ × 3 scope = 24 ca; Ngày / Tuần / Tháng hiện tại / Năm / Tháng đã kết thúc / hai Tùy chọn / Tháng tương lai. Đối chiếu tổng lịch, RF / HĐ / tiền, tổng RE / team, tổng mốc, ảnh chụp cuối, KPI và **mọi ô số** của cả bốn sheet Excel năm. Workbook mở lại bằng ExcelJS: `F/load-report.xlsx` (16.357 byte); evidence: `F/node-evidence.json`.
- Browser probe trên Edge headless: nhập tải, Hủy không đổi DB, xác nhận thay DB, bộ lọc chờ Lọc, tên xuất khi còn kỳ chờ, cap Tùy chọn, bốn chart team, mở team bằng Enter, qua nửa đêm, từ chối schema v999 không đổi DB, Nạp lại qua nửa đêm. Không có `pageerror`. Evidence: `F/browser-evidence.json`; ảnh `F/reports-load.png`, `F/overview-team-load.png`.
- Hai mutant, mỗi mutant đổi đúng một biểu thức bằng transform của Vite, không sửa file gốc: đảo tử / mẫu tỷ lệ chốt bị unit test gốc bắt; kỳ pending trong tên Excel qua được cả 8 e2e Báo cáo, nhưng probe bổ sung bắt được (CX-F4).
- `pnpm exec tsc -p apps/desktop/tsconfig.json --noEmit --incremental false --noUnusedLocals --noUnusedParameters`: exit 0. Kiểm export / nơi dùng bằng `rg` và bản đồ package; không dùng công cụ / dependency mới.
- Build web production riêng ra `F/production-dist`, cache trong F, đo 5 lượt mỗi màn và 6 lần Lọc. Chỉ thêm điểm quan sát `window.__cxData`, giữ nguyên logic nghiệp vụ. Log / số đo: `F/production-build.log`, `F/production-evidence.json`.

Các phép đo chạy trên Windows, **Intel i7-12800H**, Node v24.20.0, Edge 154 headless, viewport 1365×900, ngày neo 05/10/2026. Không suy ra chênh lệch so với baseline máy khác. Số đo browser dev phục vụ tái hiện; số production bên dưới mới dùng đánh giá độ trễ màn.

## 2. Phát hiện mới

### CX-F1 — Chuyển màn đọc lại và tính đồng bộ trên toàn bộ dữ liệu

- **Mức:** Low
- **Trục:** P
- **Vị trí:** `apps/desktop/src/routes/Overview.tsx:23,39,54`; `routes/reports/ReportsScreen.tsx:27,48,59`; `routes/overview/team-compare-view.ts:106`; `routes/reports/reports-view.ts:229,284`; hỗ trợ `data/AppDataContext.tsx:26–31` (SHA `f0c53eb`).
- **Tình trạng:** CONFIRMED (số đo Node và browser production).
- **Mô tả:** Mỗi lần quay lại Tổng quan / Báo cáo, route mới đọc lại toàn bộ sáu danh sách; memo nằm trong component nên không giữ qua unmount. Các bảng team / RE tiếp tục gọi hàm chỉ số quét dữ liệu theo từng scope; Tổng quan tính cả RE của team chưa mở, Báo cáo tính cả bảng chưa chọn. Đây là độ trễ quan sát được, chưa phải vi phạm một SLA trong spec.
- **Tái hiện / bằng chứng:** Chạy probe tải (phụ lục B), nhập tải rồi luân phiên Tổng quan → Báo cáo → Team 5 lượt ở production (phụ lục E). Node warm: đọc sáu repository, 10 lượt, median **238,568 ms**, p95 **330,191 ms**; hàm Báo cáo toàn bộ tháng, 30 lượt, median **98,999 ms**, p95 **265,240 ms**; cùng hàm ở scope một RE median **7,545 ms**. Tổng quan toàn bộ tháng (KPI + stage + compare), median **95,156 ms**, p95 **161,391 ms**. Năm / Tùy chọn toàn bộ khoảng **101–107 ms** median. Không cộng số Node vào số browser.

  | Production, dữ liệu tải | Lượt | Median chuyển màn → sau hai animation frame | Khoảng |
  |---|---:|---:|---:|
  | Tổng quan | 5 | 266,7 ms | 249,6–318,6 ms |
  | Báo cáo | 5 | 245,4 ms | 231,0–265,7 ms |
  | Team & nhân sự | 5 | 199,3 ms | 199,3–219,3 ms |

  `PerformanceObserver` ghi các long task khi chuyển màn khoảng **113–216 ms**, phần lớn **147–170 ms**. Bấm Lọc tháng / năm production khoảng **76,4–95,9 ms** (6 lượt). Thời gian navigation có cả chi phí điều khiển Playwright và chờ paint; long task là số chặn luồng UI đo trong browser.
- **Ảnh hưởng:** Với tải yêu cầu, thao tác chuyển màn lặp lại gây các khoảng khựng ngắn dù DB không đổi. Xếp Low vì độ trễ hiện khoảng một phần tư giây, không có crash / sai dữ liệu hay ngưỡng bắt buộc bị vi phạm.
- **Đề xuất:** Dùng chung snapshot đọc theo revision, và gom số liệu từng RE / team qua một lượt thay vì quét toàn bộ cho từng scope; cân nhắc chỉ dựng phần chi tiết khi cần nhưng giữ đủ bảng khi xuất Excel. Ước lượng 150–300 dòng SP cho một thay đổi có giới hạn, giữ golden và đối chiếu tổng hiện có; đo lại trên cùng dữ liệu / máy.

### CX-F2 — Nạp lại sau nửa đêm báo ngày neo cũ

- **Mức:** Low
- **Trục:** C (edge case nửa đêm)
- **Vị trí:** `apps/desktop/src/routes/Settings.tsx:78,86–87`; đường seed `data/app-data.ts:229,243,286` (SHA `f0c53eb`).
- **Tình trạng:** CONFIRMED.
- **Mô tả:** ReloadDialog lấy `anchor` khi render và giữ nó trong callback xác nhận. Nó không theo dõi ngày như các màn dùng `useToday`; `reloadDemoData` lại seed theo ngày tại lúc chạy. Khi hộp thoại giữ mở qua nửa đêm, thông báo thành công ghi sai ngày neo thực tế.
- **Tái hiện / bằng chứng:** Browser probe (phụ lục C): ngày ứng dụng 01/11/2026, mở Cài đặt → Nạp lại, gõ `NẠP LẠI`, giữ mở qua 02/11 rồi xác nhận. Trước bấm, hộp vẫn nói `neo ở ngày 01/11/2026`; `data.today()` đã là `{year:2026,month:11,day:2}`. Sau bấm: status `Đã nạp lại dữ liệu giả lập, neo ở ngày 01/11/2026.`; SQL `SELECT MIN(date) FROM stage_transitions WHERE from_stage IS NULL` trả **2025-11-02**, đúng với seed neo **02/11/2026** (seed đặt khách đầu tiên lùi 365 ngày). Evidence đầy đủ trong `F/browser-evidence.json`, các key `reload*`.
- **Ảnh hưởng:** Người dùng giữ hộp qua nửa đêm nhận mô tả dữ liệu giả lập lệch một ngày; việc tạo dữ liệu vẫn chạy và không chứng minh mất dữ liệu ngoài hành vi thay toàn bộ đã xác nhận. Không phải mục KNOWN về thiếu số lượng trong hộp Nạp lại.
- **Đề xuất:** Dùng một ngày neo duy nhất cho seed và kết quả trả về, hoặc để thao tác Nạp lại trả ngày thực sự đã dùng; nội dung hộp cũng theo dõi ngày hiện tại. Lấy ngày ở lúc bấm đơn thuần vẫn cần xét thời gian chờ backup có thể qua nửa đêm. Ước lượng ≤40 dòng SP và một ca clock e2e.

### CX-F3 — Ngày Tùy chọn sai không có lời giải thích lỗi

- **Mức:** Low
- **Trục:** A
- **Vị trí:** `packages/ui/src/components/PeriodPicker.tsx:44,53–56,98–99`; `apps/desktop/src/routes/period-labels.ts:22` (SHA `f0c53eb`).
- **Tình trạng:** CONFIRMED.
- **Mô tả:** Nhánh `invalid` (ngày không có thật, không parse được, hoặc Từ > Đến) đánh dấu cả hai ô `aria-invalid`, nhưng không hiển thị thông báo và không có `aria-describedby`. Chỉ lỗi quá ba tháng có giải thích. Người dùng không biết ô nào sai hoặc cần sửa ngày hay thứ tự khoảng.
- **Tái hiện / bằng chứng:** Báo cáo → Tùy chọn, nhập Từ `31/02/2026`, Đến `15/10/2026`, Enter. AX snapshot ghi hai textbox `[invalid]`, Từ vẫn là `31/02/2026`, Đến vẫn là `15/10/2026`; `aria-describedby` của Từ = null, không có mô tả lỗi trong group. Kỳ hợp lệ trước đó vẫn giữ. Ca quá ba tháng ngay trước đó có `aria-describedby`, chứng minh probe đọc được thuộc tính khi có. Nguồn / snapshot ở phụ lục C và `F/browser-evidence.json:invalidDate`.
- **Ảnh hưởng:** Đặc biệt khó sửa với trình đọc màn hình; người nhìn thấy chỉ có viền đỏ và hai ô đều bị đánh dấu dù có thể chỉ một ô sai. Nhánh sai thứ tự có cùng đường code nhưng probe lần này tái hiện ngày không có thật. Khác mục KNOWN về báo đỏ sớm khi Tab.
- **Đề xuất:** Thêm chuỗi i18n mô tả ngày không hợp lệ / thứ tự khoảng, nối với `aria-describedby`, đánh dấu đúng ô hoặc giải thích lỗi của cả khoảng. Ước lượng ≤40 dòng SP cùng một ca e2e kiểm mô tả lỗi qua AX / thuộc tính.

### CX-F4 — Test xuất Excel chưa bắt việc dùng kỳ chưa bấm Lọc

- **Mức:** Low
- **Trục:** T
- **Vị trí:** `e2e/reports.spec.ts:130,143,160`; seam sản phẩm `apps/desktop/src/routes/reports/ReportsScreen.tsx:78` (SHA `f0c53eb`).
- **Tình trạng:** CONFIRMED (mutant sống qua suite; đây là thiếu test, không phải lỗi đang có trong code gốc).
- **Mô tả:** Test riêng kiểm bảng giữ kỳ đã áp dụng và test riêng kiểm xuất khi không có pending; ca pending còn lại chỉ kiểm thông báo của lần xuất trước. Chưa có thao tác xuất mới trong khi kỳ mới đang chờ Lọc.
- **Tái hiện / bằng chứng:** Transform ngoài repo đổi duy nhất `exporter.run({ rows, period: applied.period, viewing, today })` thành `...period: filter.period...`. Với mutant đó, `pnpm exec playwright test --config ...\F\playwright.mutation.config.mts`: **8/8 e2e Báo cáo xanh**, 51,3 s (`F/mutation-export-e2e.log`). Probe bổ sung: đang xem Tháng 09/2026, chọn Năm không bấm Lọc, bấm Xuất Excel. Mong `bao-cao_2026-09_toan-bo_2026-09-15.xlsx`, nhận **`bao-cao_2026_toan-bo_2026-09-15.xlsx`**; assertion mới đỏ (`F/mutation-pending-evidence.json`). Trên code gốc, probe October tương ứng nhận đúng tên tháng. Nguồn mutant / config / probe ở phụ lục D; bản module mutant lưu ngoài repo.
- **Ảnh hưởng:** Một refactor nối nhầm kỳ picker vào export vẫn có thể qua các test hiện có, tạo tên file năm cho nội dung tháng. Mutant này chỉ làm sai tên file: rows và metadata workbook vẫn là tháng, không có bằng chứng mutant làm sai số.
- **Đề xuất:** Thêm ca e2e chọn kỳ pending rồi xuất, kiểm tên download vẫn theo Đang xem; có thể mở workbook kiểm tiêu đề / một ô số để bảo vệ cả nội dung. Ước lượng 0 dòng SP, 30–60 dòng test. Không đổi golden.

## 3. Kiểm KNOWN

Chỉ nhận diện và tránh tính thành phát hiện mới; nguồn là `common/known.md`, không dùng báo cáo review khác:

- **KNOWN — Phase 4 P8 / P12 / T2:** Chart N4–N1 không cung cấp số liệu cho screen reader. Probe đếm được bốn `role=img`, có nhãn team nhưng không thay thế bảng dữ liệu. Không báo lại như lỗi mới.
- **KNOWN — PeriodPicker R4:** onBlur báo lỗi sớm khi Tab. CX-F3 nói về thiếu lời giải thích khi lỗi đã xác định, không nói về thời điểm validate.
- **KNOWN — #185:** nhánh SCHEMA_TOO_NEW chưa có test gốc. Probe review lần này chạy được schema v999 và DB giữ nguyên; không tạo phát hiện T trùng.
- **KNOWN — #144, #96 / #87 / #125:** role condition / lọc theo RE lặp, bỏ thay đổi chưa lưu khi đi từ sửa sang xóa nhân sự, tình trạng lưu lỗi chặn Nạp lại, hộp thiếu số lượng, CloseGuard và lưu file; không báo lại. Race hai replace thuộc S-2, không được xem là đã giải quyết bởi probe tuần tự.
- **KNOWN — #332:** ghép theo chỉ số ở Theo mốc / stage-view hiện đúng theo bất biến mốc; ma trận tải vẫn khớp. Chưa thấy nơi thứ ba tạo bản lặp mới đủ ngưỡng B.
- **KNOWN — R4 token:** tương phản viền ô nhập / mũi tên sắp xếp được ghi sẵn; ảnh review không phải phép đo tương phản mới.

## 4. Bảng đếm mức × trục

Một phát hiện được đếm ở trục chính; CX-F2 thuộc C, dù tái hiện bằng edge case nửa đêm. KNOWN không đếm.

| Mức | E | C | D | P | B | T | A | S | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 1 | 0 | 1 | 0 | 1 | 1 | 0 | 4 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Tổng mới** | **0** | **1** | **0** | **1** | **0** | **1** | **1** | **0** | **4** |

CONFIRMED 4; PLAUSIBLE 0. Chỉ review F; kết luận đóng Phase 4 dành cho gói H.

## 5. Mọi trục đã xét; phần không có phát hiện mới

| Trục | Kết quả và cách đã xét |
|---|---|
| E | **Đã xét, không thấy** lỗi mới độc lập ngoài ca nửa đêm CX-F2. Chạy test gốc có kỳ tương lai, team rỗng, 0 RF, đầu / cuối tháng, năm, mốc bị cắt; đối chiếu golden G / S / M; tải 24 ca scope×kỳ, cap Tùy chọn vừa đủ / vượt một ngày; đọc canShift / miền 1900–2100 và e2e ranh giới / năm nhuận. Chuỗi Unicode, công thức, ký tự đường dẫn / tên dài được kiểm ở workbook và filename; không ép số âm / MAX_SAFE vào DB ngoài luật nhập. Không thực hiện thử mọi tổ hợp múi giờ / tranh chấp thao tác. |
| C | CX-F2. **Đã xét, không thấy** sai khác số liệu khác: RF theo lịch, tỉ lệ tổng không lấy trung bình, lịch cả kỳ so với kết quả tới hôm nay, snapshot cuối kỳ, Σ RE / team / mốc, tiền đồng và tỷ lệ Excel. Team ở Tổng quan là mọi team; Team ở Báo cáo là team chọn, đúng hai hợp đồng riêng. 275% trên tải là HĐ phát hành ÷ RF theo spec, không xem tỷ lệ >100% là lỗi. Picker đổi kỳ chờ Lọc kể cả qua nửa đêm; xuất gốc dùng kỳ đã áp dụng. |
| D | **Đã xét, không thấy** mất / sai dữ liệu mới ở luồng F đã xét: mọi ghi Team / Person đi qua lệnh db/team, xem transaction / kiểm role-team / team đang dùng / người đang dùng; không thấy SQL ghi rải ở UI. Hủy preview giữ counts, schema mới bị từ chối giữ DB, nhập hợp lệ đúng counts, export là đọc và workbook giữ các giá trị số. Đọc disabled / running và luồng đóng hộp khi bận. Race thay DB và lỗi lưu file đã KNOWN; probe tuần tự không chứng minh an toàn mọi interleaving. |
| P | CX-F1. Đo Node 10 / 30 lượt và browser production; staffMetrics median 35,760 ms / p95 45,213 ms; dựng workbook warm 49,755 ms. Preview nhập production 2.523,2 ms (có UI / transport; không dùng làm phát hiện F riêng vì đường validate thuộc B / D). ExcelJS có dynamic import: chunk riêng 929,55 kB (gzip 256,42 kB), không nạp chỉ vì vào Báo cáo. Đã xét, không thấy điểm tải sớm ExcelJS hoặc rò chart rõ trong ba lượt đổi màn dev; không đo heap dài hạn. |
| B | **Đã xét, không thấy** export chết / tham số local thừa hoặc bản lặp mới ≥3 nơi gây lỗi trong F: tsc noUnused xanh; rg lần theo các export UI và helper đến nơi dùng, đọc bản đồ package. readOverview / readReports lặp hai nơi; chưa đủ ngưỡng ≥3. Các bản lặp role / byMark đã KNOWN. Không suy rộng kết quả tsc thành chứng minh mọi export / key i18n toàn repo đều có người dùng. |
| T | CX-F4. Test gốc F 116/116 xanh; mutant đảo closeRate bị bắt ngay ở `team-compare-view.test.ts:82` (66,7% thành 150%, 1 đỏ / 5 xanh). Mutant tên file pending sống 8/8 và probe mới đỏ. Đọc các seam `applied-filter` / workbook / thao tác dialog / clock, cố định ngày các probe. Không tuyên bố mutation coverage toàn bộ hoặc dựa vào assertion rỗng. |
| A | CX-F3 cùng các mục KNOWN đã nêu. **Đã xét, không thấy** chuỗi UI cứng mới ở F sau lần theo t / PERIOD_LABELS / label templates; raw nội dung tên người / team là dữ liệu. Đọc aria-label, row/column header, radio, trạng thái, focus Dialog; dùng AX snapshot, thao tác Enter mở team, ảnh bảng ở tải / bốn chart. Chưa thử screen reader thật, zoom 200% hay đo mọi màu tương phản. |
| S | **Đã xét, không thấy** đường thoát file mới ở luồng xuất F: reportFileName chỉ ASCII, hạn chế scope 60 ký tự, kiểm tên ác ý / Unicode / dài; workbook tên team / RE là text chứ không formula (test gốc xanh). Tauri write_export kiểm whitelist + extension, chỉ ghi exports; folder chỉ nhận exports / backups, command open không nhận path tùy ý, claim tên tránh trùng, capabilities không cấp quyền shell / fs rộng. UI nhập đọc file được chọn qua File.text, chặn kích thước trước đọc, validate bằng importBackup; schema v999 từ chối không đổi DB. Đọc test Rust path traversal / overwrite / xlsx; chưa chạy exe / lỗi quyền Windows thực tế trong F. Không audit bảo mật web ngoài phạm vi. |

## 6. Giới hạn và trạng thái cuối

Số liệu đúng trên các fixture / ma trận đã chạy không chứng minh mọi backup có thể có; oracle đối chiếu còn dùng API domain ở SHA ghim, được bổ sung bằng golden cố định, phép cộng phân hoạch và kiểm workbook mở lại. Không sửa golden để làm test xanh. Không chạy lại toàn bộ verify / coverage / e2e / Rust; baseline chung được đọc, còn các kết quả chạy mới được liệt kê riêng. E2e 8/8 trong CX-F4 chạy trên mutant qua dev server, không phải kết quả production gốc mới.

Các probe can thiệp chỉ ở môi trường review: điểm quan sát data, clock giả, chặn anchor click để lấy tên dự kiến download; nội dung Excel được kiểm riêng bằng workbook thật. File `load-report.xlsx` đã tạo và mở lại. Không có phép đo desktop exe; production web vẫn giữ SQLite sql.js và logic chỉ số gốc.

Repo cuối review giữ đúng SHA, detached; `git diff --name-only` rỗng. Các untracked `.agents/`, `.codex/`, `AGENTS.md` đã có từ đầu và giữ nguyên. Toàn bộ cache / build / profile / log / mutant / nguồn probe của phiên nằm dưới `codex/F`; báo cáo ở `codex/F.md`.

## Phụ lục A — File chính đã đọc trọn

| File tại SHA f0c53eb | Dòng đã đọc |
|---|---:|
| `apps/desktop/src/routes/Overview.tsx` | 1–79 |
| `apps/desktop/src/routes/overview/overview-view.ts` | 1–251 |
| `apps/desktop/src/routes/overview/OverviewTiles.tsx` | 1–76 |
| `apps/desktop/src/routes/overview/stage-view.ts` | 1–142 |
| `apps/desktop/src/routes/overview/stage-chart.ts` | 1–130 |
| `apps/desktop/src/routes/overview/StageBlock.tsx` | 1–127 |
| `apps/desktop/src/routes/overview/team-compare-view.ts` | 1–127 |
| `apps/desktop/src/routes/overview/TeamCompare.tsx` | 1–127 |
| `apps/desktop/src/routes/overview/overview-view.test.ts` | 1–214 |
| `apps/desktop/src/routes/overview/stage-view.test.ts` | 1–235 |
| `apps/desktop/src/routes/overview/stage-chart.test.ts` | 1–150 |
| `apps/desktop/src/routes/overview/team-compare-view.test.ts` | 1–117 |
| `apps/desktop/src/routes/reports/ReportsScreen.tsx` | 1–131 |
| `apps/desktop/src/routes/reports/reports-view.ts` | 1–323 |
| `apps/desktop/src/routes/reports/ReportTable.tsx` | 1–154 |
| `apps/desktop/src/routes/reports/ReportExport.tsx` | 1–96 |
| `apps/desktop/src/routes/reports/report-workbook.ts` | 1–259 |
| `apps/desktop/src/routes/reports/reports-view.test.ts` | 1–355 |
| `apps/desktop/src/routes/reports/report-workbook.test.ts` | 1–325 |
| `apps/desktop/src/routes/team/team-view.ts` | 1–119 |
| `apps/desktop/src/routes/team/TeamScreen.tsx` | 1–341 |
| `apps/desktop/src/routes/team/TeamDialogs.tsx` | 1–99 |
| `apps/desktop/src/routes/team/PersonDialogs.tsx` | 1–203 |
| `apps/desktop/src/routes/team/team-view.test.ts` | 1–139 |
| `apps/desktop/src/routes/Settings.tsx` | 1–127 |
| `apps/desktop/src/routes/SettingsBackup.tsx` | 1–280 |
| `apps/desktop/src/routes/SettingsDataFile.tsx` | 1–135 |
| `apps/desktop/src/routes/FilterBar.tsx` | 1–79 |
| `apps/desktop/src/routes/applied-filter.ts` | 1–51 |
| `apps/desktop/src/routes/applied-filter.test.ts` | 1–98 |
| `apps/desktop/src/routes/period-labels.ts` | 1–24 |
| `packages/ui/src/components/PeriodPicker.tsx` | 1–168 |
| `packages/ui/src/components/PeriodPicker.label.ts` | 1–21 |
| `packages/ui/src/components/PeriodPicker.label.test.ts` | 1–26 |

## Phụ lục B–E — Nguồn test tạm và lệnh tái hiện

Đường dẫn dưới đây đều tuyệt đối khi chạy. Công cụ chỉ dùng dependency đã cài của repo. `serve.mjs` dùng port 1432 cho gốc; mutant export dùng port 1433, ngày 15/09/2026. `production-serve.mjs` build và serve port 1434. Các server review được dừng sau khi đo.

```powershell
pnpm exec vitest run --config C:\workspace\deep-review-1-4\codex\F\vitest.config.mts
node C:\workspace\deep-review-1-4\codex\F\serve.mjs
node C:\workspace\deep-review-1-4\codex\F\browser-probe.mjs
$env:CX_F_MUTANT = 'wrong-close-rate'
pnpm exec vitest run --config C:\workspace\deep-review-1-4\codex\F\vitest.mutation.config.mts apps/desktop/src/routes/overview/team-compare-view.test.ts
$env:CX_F_MUTANT = 'export-pending'
$env:CX_F_PORT = '1433'
$env:CX_F_ANCHOR = '15/09/2026'
node C:\workspace\deep-review-1-4\codex\F\serve.mjs
# Terminal khác, sau khi server đã sẵn sàng:
pnpm exec playwright test --config C:\workspace\deep-review-1-4\codex\F\playwright.mutation.config.mts
node C:\workspace\deep-review-1-4\codex\F\mutation-pending-probe.mjs
node C:\workspace\deep-review-1-4\codex\F\production-serve.mjs
# Terminal khác, sau khi build / server đã sẵn sàng:
node C:\workspace\deep-review-1-4\codex\F\production-perf.mjs
```

Nguồn nguyên văn các file tạm được chép tiếp dưới đây. Mutant đã emit `F/team-compare-view.mutant.ts` và `F/ReportsScreen.mutant.tsx`; thay đổi chính xác của chúng nằm trong transform, không cần chép lại toàn module sản phẩm.

### B — vitest.config.mts

```typescript
import { createRequire } from 'node:module';
const repo = 'C:/workspace/Project-2C-review-2';
const here = 'C:/workspace/deep-review-1-4/codex/F';
const appRequire = createRequire(`${repo}/apps/desktop/package.json`);
const rootRequire = createRequire(`${repo}/package.json`);
export default {
  root: repo,
  cacheDir: `${here}/vite-cache`,
  resolve: { alias: [
    { find: /^@p2c\/domain$/, replacement: `${repo}/packages/domain/src/index.ts` },
    { find: /^@p2c\/db$/, replacement: `${repo}/packages/db/src/index.ts` },
    { find: /^@p2c\/ui$/, replacement: `${repo}/packages/ui/src/index.ts` },
    { find: /^exceljs$/, replacement: appRequire.resolve('exceljs') },
    { find: /^vitest$/, replacement: 'C:/workspace/Project-2C-review-2/node_modules/vitest/dist/index.js' },
  ] },
  server: { fs: { allow: [repo, here] } },
  test: {
    include: [
      `${here}/probe.test.ts`,
      'apps/desktop/src/routes/overview/*.test.ts',
      'apps/desktop/src/routes/reports/*.test.ts',
      'apps/desktop/src/routes/team/*.test.ts',
      'apps/desktop/src/routes/applied-filter.test.ts',
      'packages/ui/src/components/PeriodPicker.label.test.ts',
    ],
    testTimeout: 120000,
    fileParallelism: false,
  },
};
```


### B — probe.test.ts

```typescript
import fs from 'node:fs';
import os from 'node:os';
import ExcelJS from 'exceljs';
import { describe, it, expect } from 'vitest';
import { importBackup, listAppointments, listCustomers, listPeople, listPolicies, listStageTransitions, listTeams } from '@p2c/db';
import { calendarDate, periodOf, customPeriod, periodMetrics, appointmentCounts, formatCount, formatVndCompact, reportMarks } from '@p2c/domain';
import { kpiTiles, countedWindow } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/overview/overview-view';
import { stageBlock } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/overview/stage-view';
import { teamCompare } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/overview/team-compare-view';
import { reportRows, reportCells } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/reports/reports-view';
import { buildReportWorkbook, reportFileName } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/reports/report-workbook';
import { staffMetrics } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/team/team-view';
const HERE = 'C:/workspace/deep-review-1-4/codex/F';
const today = calendarDate(2026,10,5);
const all = {kind:'all'} as const;
const read = db => ({appointments:listAppointments(db),customers:listCustomers(db),people:listPeople(db),policies:listPolicies(db),transitions:listStageTransitions(db),teams:listTeams(db)});
const metricsKeys = ['rfCount','submittedCount','caseSize','issuedCount','revenue'];
const appointmentKeys = ['met','missed','unrecorded','planned','total'];
const stages = ['N4','N3','N2','N1','ON_HOLD','LOST'];
const evidence:any = {node:process.version,cpu:os.cpus()[0]?.model,platform:os.platform(),today,measurements:{},checks:[]};
function bench(name,fn,n=30) {fn();const samples=[];for(let i=0;i<n;i++){const t=performance.now();fn();samples.push(performance.now()-t)} samples.sort((a,b)=>a-b);evidence.measurements[name]={runs:n,medianMs:+samples[Math.floor(n/2)].toFixed(3),p95Ms:+samples[Math.min(n-1,Math.floor(n*.95))].toFixed(3),maxMs:+samples.at(-1).toFixed(3)};}
it('load data: cross-screen, totals, marks, Excel and measured performance', async()=>{
 const text=fs.readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json','utf8');
 const t=performance.now();const imported=await importBackup(text);evidence.importMs=performance.now()-t;
 const db=imported.db;
 try {
  const data=read(db);evidence.counts=Object.fromEntries(Object.entries(data).map(([k,v]:any)=>[k,v.length]));
  const scopes=[all,{kind:'team',teamId:data.teams[0].id},{kind:'re',reId:data.people.find(p=>p.role==='RE').id}];
  const periods=[periodOf('day',today),periodOf('week',today),periodOf('month',today),periodOf('year',today),periodOf('month',calendarDate(2026,9,1)),customPeriod(calendarDate(2026,7,15),calendarDate(2026,10,14)),customPeriod(calendarDate(2026,9,15),calendarDate(2026,10,15)),periodOf('month',calendarDate(2026,11,1))];
  for(const p of periods){for(const scope of scopes){
   const rows=reportRows(data,p,scope,today);const m=countedWindow(p,today);
   expect(rows.summary.appointments).toEqual(appointmentCounts(data.appointments,p,scope,data.people,today));
   expect(rows.summary.metrics).toEqual(m&&periodMetrics(data,m,scope));
   for(const k of appointmentKeys)expect(rows.byMark.reduce((n,r)=>n+r.appointments[k],0)).toBe(rows.summary.appointments[k]);
   for(const k of metricsKeys)expect(rows.byMark.reduce((n,r)=>n+(r.metrics?.[k]??0),0)).toBe(rows.summary.metrics?.[k]??0);
   if(rows.summary.stages)expect(rows.byMark.findLast(r=>r.stages)?.stages).toEqual(rows.summary.stages);
   for(const tab of [rows.byTeam,rows.byRe])if(tab){expect(reportCells(tab.total)).toEqual(reportCells(rows.summary));}
   const block=stageBlock(data,p,scope.kind==='team'?all:scope,today);
   if(scope.kind!=='team'&&block.tiles){for(const k of ['N4','N3','N2','N1'])expect(block.tiles[k]).toBe(rows.summary.stages[k]);}
   const kpis=kpiTiles(data,p,scope,today);if(m){expect(kpis[0].value).toBe(formatCount(rows.summary.metrics.rfCount));expect(kpis[1].value).toBe(formatCount(rows.summary.metrics.submittedCount));expect(`${kpis[2].value} ${kpis[2].unit}`).toBe(formatVndCompact(rows.summary.metrics.caseSize));}
   evidence.checks.push({kind:p.kind,start:p.start,end:p.end,scope:scope.kind,marks:rows.byMark.length});
  }}
  const p=periodOf('year',today);const rows=reportRows(data,p,all,today);const wbT=performance.now();const bytes=await buildReportWorkbook(rows,{period:'Năm 2026',scope:'Toàn bộ',exported:'05/10/2026'});evidence.workbookBuildMs=performance.now()-wbT;evidence.workbookBytes=bytes.byteLength;
  const wb=new ExcelJS.Workbook();await wb.xlsx.load(bytes.buffer);fs.writeFileSync(`${HERE}/load-report.xlsx`,bytes);
  for(const [name,rs,leads] of [['Tổng hợp',[rows.summary],1],['Theo team',[...rows.byTeam.rows,rows.byTeam.total],1],['Theo RE',[...rows.byRe.rows,rows.byRe.total],2],['Theo mốc',rows.byMark,1]] as any){const ws=wb.getWorksheet(name);for(let i=0;i<rs.length;i++){const r=rs[i];const expected=[...appointmentKeys.map(k=>r.appointments[k]),...metricsKeys.map(k=>r.metrics?.[k]??null),r.metrics?.closeRate?r.metrics.closeRate.numerator/r.metrics.closeRate.denominator:null,...stages.map(k=>r.stages?.[k]??null)];expect(expected.map((_,j)=>ws.getCell(i+4,j+leads+1).value)).toEqual(expected);}}
  bench('readOverview/listRepositories',()=>read(db),10);
  for(const [name,p] of [['month',periodOf('month',today)],['year',periodOf('year',today)],['custom',customPeriod(calendarDate(2026,7,15),calendarDate(2026,10,14))]] as any){bench(`reports-${name}-all`,()=>reportRows(data,p,all,today));bench(`overview-${name}-all`,()=>{kpiTiles(data,p,all,today);stageBlock(data,p,all,today);teamCompare(data,p,today)});bench(`reports-${name}-re`,()=>reportRows(data,p,scopes[2],today));}
  bench('team-staffMetrics',()=>staffMetrics(data.people,data,today));
  for(const name of ['..\\CON/../../evil:*?"','=cmd|x','東京','😀'.repeat(1000),'Team '+('Đông Á'.repeat(100))]){const filename=reportFileName(p,name,today);expect(filename).toMatch(/^[a-z0-9_-]+\.xlsx$/);expect(filename.length).toBeLessThanOrEqual(120);}
 }finally{db.sqlite.close();fs.writeFileSync(`${HERE}/node-evidence.json`,JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence.measurements));}
});
```


### C — serve.mjs

```javascript
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const repo = 'C:/workspace/Project-2C-review-2';
const here = 'C:/workspace/deep-review-1-4/codex/F';
const appRequire = createRequire(`${repo}/apps/desktop/package.json`);
const {createServer} = await import(pathToFileURL(appRequire.resolve('vite')).href);
const {default:react} = await import(pathToFileURL(appRequire.resolve('@vitejs/plugin-react')).href);
const {default:tailwind} = await import(pathToFileURL(appRequire.resolve('@tailwindcss/vite')).href);
const mutation = process.env.CX_F_MUTANT ?? '';
const server = await createServer({
 configFile:false,root:`${repo}/apps/desktop`,cacheDir:`${here}/browser-cache-${mutation||'original'}`,clearScreen:false,
 plugins:[{name:'cx-f-instrumentation',enforce:'pre',transform(code,id){
   if(id.endsWith('/src/main.tsx')) return code.replace('(data) => render(', '(data) => (window.__cxData = data, render(').replace('appWindow={isTauri() ? getCurrentWindow() : undefined} />),','appWindow={isTauri() ? getCurrentWindow() : undefined} />)),');
   if(mutation==='export-pending'&&id.endsWith('/reports/ReportsScreen.tsx')) { const mutantCode = code.replace('rows, period: applied.period, viewing, today','rows, period: filter.period, viewing, today'); fs.writeFileSync('C:/workspace/deep-review-1-4/codex/F/ReportsScreen.mutant.tsx',mutantCode); return mutantCode; }
   return null;
 }},react(),tailwind()],
 define:{'import.meta.env.VITE_DEMO_ANCHOR':JSON.stringify(process.env.CX_F_ANCHOR??'05/10/2026')},
 server:{port:Number(process.env.CX_F_PORT??1432),host:'127.0.0.1',strictPort:true,fs:{allow:[repo,here]},watch:{ignored:['**/src-tauri/**']}},
});
await server.listen();server.printUrls();
process.on('SIGINT',()=>server.close().then(()=>process.exit(0)));
process.on('SIGTERM',()=>server.close().then(()=>process.exit(0)));
```


### C — browser-probe.mjs

```javascript
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require=createRequire('C:/workspace/Project-2C-review-2/package.json');
const {chromium,expect}=require('@playwright/test');
const here='C:/workspace/deep-review-1-4/codex/F';
const context=await chromium.launchPersistentContext(`${here}/browser-profile`,{channel:'msedge',headless:true,viewport:{width:1365,height:900},downloadsPath:`${here}/downloads`,acceptDownloads:true,locale:'vi-VN'});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const evidence={errors,navigations:[],filters:[],checks:[]};
const nav=async(name)=>page.getByRole('navigation').getByRole('link',{name,exact:true}).click();
const originalCounts=await page.clock.install({time:new Date(2026,9,5,10,0)});
try{
 await page.goto('http://127.0.0.1:1432/#/settings');await expect(page.getByRole('heading',{name:'Cài đặt',exact:true})).toBeVisible({timeout:60000});
 await page.waitForFunction(()=>window.__cxData);evidence.initialCounts=await page.evaluate(()=>window.__cxData.counts());
 await page.evaluate(()=>{window.__cxTasks=[];new PerformanceObserver(list=>window.__cxTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({entryTypes:['longtask']});});
 const backup=page.getByRole('region',{name:'Xuất / nhập backup'});
 const buffer=fs.readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json');
 const importStart=await page.evaluate(()=>performance.now());
 await backup.getByLabel('Nhập backup').setInputFiles({name:'load.p2cbackup',mimeType:'application/json',buffer});
 const dialog=page.getByRole('dialog',{name:'Thay toàn bộ dữ liệu?'});await expect(dialog).toBeVisible();
 evidence.importPreviewWallMs=(await page.evaluate(()=>performance.now()))-importStart;
 evidence.previewText=await dialog.innerText();
 await dialog.getByRole('button',{name:'Hủy',exact:true}).click();
 expect(await page.evaluate(()=>window.__cxData.counts())).toEqual(evidence.initialCounts);evidence.checks.push('cancel backup preserves current counts');
 await backup.getByLabel('Nhập backup').setInputFiles({name:'load.p2cbackup',mimeType:'application/json',buffer});
 await expect(dialog).toBeVisible();await dialog.getByRole('button',{name:'Thay dữ liệu',exact:true}).click();await expect(dialog).toBeHidden();evidence.loadCounts=await page.evaluate(()=>window.__cxData.counts());
 for(let repeat=0;repeat<3;repeat++)for(const [name,screen] of [['Tổng quan','overview'],['Báo cáo','reports'],['Team & nhân sự','team']]){
  const start=await page.evaluate(()=>performance.now());await nav(name);await expect(page.getByRole('heading',{name,exact:true})).toBeVisible();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));const end=await page.evaluate(()=>performance.now());evidence.navigations.push({screen,wallMs:end-start});
 }
 await nav('Báo cáo');
 const picker=page.getByRole('group',{name:'Kỳ thống kê'});const kinds=picker.getByRole('radiogroup',{name:'Loại kỳ'});
 for(const kind of ['Năm','Tháng','Năm','Tháng']){await kinds.getByRole('radio',{name:kind,exact:true}).click();const start=await page.evaluate(()=>performance.now());await page.getByRole('button',{name:'Lọc',exact:true}).click();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));evidence.filters.push({kind,wallMs:(await page.evaluate(()=>performance.now()))-start});}
 const summary=page.getByRole('table',{name:'Tổng hợp'});const before=await summary.innerText();
 await kinds.getByRole('radio',{name:'Năm',exact:true}).click();expect(await summary.innerText()).toBe(before);
 await page.evaluate(()=>{window.__cxDownloads=[];HTMLAnchorElement.prototype.click=function(){window.__cxDownloads.push(this.download);};});await page.getByRole('button',{name:'Xuất Excel',exact:true}).click();await page.waitForFunction(()=>window.__cxDownloads.length>0);evidence.pendingExportName=await page.evaluate(()=>window.__cxDownloads[0]);expect(evidence.pendingExportName).toBe('bao-cao_2026-10_toan-bo_2026-10-05.xlsx');evidence.checks.push('export pending filename captured at download handoff');
 await kinds.getByRole('radio',{name:'Tùy chọn',exact:true}).click();const startField=picker.getByRole('textbox',{name:'Từ ngày'});const endField=picker.getByRole('textbox',{name:'Đến ngày'});
 await startField.fill('15/07/2026');await endField.fill('14/10/2026');await endField.press('Enter');await page.getByRole('button',{name:'Lọc',exact:true}).click();await page.getByRole('radiogroup',{name:'Bảng báo cáo'}).getByRole('radio',{name:'Theo mốc',exact:true}).click();expect(await page.getByRole('table',{name:'Theo mốc'}).getByRole('rowheader').count()).toBe(4);
 await endField.fill('15/10/2026');await endField.press('Enter');await expect(endField).toHaveAttribute('aria-invalid','true');evidence.capDescription=await endField.getAttribute('aria-describedby');expect(evidence.capDescription).toBeTruthy();evidence.checks.push('custom cap and 4 marks');
 await startField.fill('31/02/2026');await startField.press('Enter');evidence.invalidDate={invalid:await startField.getAttribute('aria-invalid'),description:await startField.getAttribute('aria-describedby'),snapshot:await picker.ariaSnapshot()};
 await picker.getByRole('button',{name:'Hôm nay',exact:true}).click();await page.getByRole('button',{name:'Lọc',exact:true}).click();await page.screenshot({path:`${here}/reports-load.png`,fullPage:true});
 await nav('Tổng quan');await page.getByRole('radiogroup',{name:'Góc nhìn'}).getByRole('radio',{name:'Team',exact:true}).click();await page.getByRole('button',{name:'Lọc',exact:true}).click();expect(await page.getByRole('img',{name:/Diễn biến khách hàng theo nhóm · Team /}).count()).toBe(4);
 await page.screenshot({path:`${here}/overview-team-load.png`,fullPage:true});
 // Keyboard operation reaches the expandable team button and opens its members.
 const compare=page.getByRole('table',{name:'So sánh team'});const team=compare.getByRole('button').first();await team.focus();await page.keyboard.press('Enter');await expect(team).toHaveAttribute('aria-expanded','true');evidence.checks.push('team expansion by keyboard');
 const oldViewing=await page.locator('p',{hasText:'Đang xem:'}).innerText();await page.clock.fastForward(15*24*60*60*1000);await page.clock.fastForward(12*24*60*60*1000);await page.evaluate(()=>window.dispatchEvent(new Event('focus')));evidence.afterMidnightToday=await page.evaluate(()=>window.__cxData.today());expect(evidence.afterMidnightToday).toEqual({year:2026,month:11,day:1});await page.getByRole('button',{name:'Hôm nay',exact:true}).click();evidence.midnightBeforeApply=await page.locator('p',{hasText:'Đang xem:'}).innerText();expect(evidence.midnightBeforeApply).toContain('Tháng 10/2026');await page.getByRole('button',{name:'Lọc',exact:true}).click();evidence.midnightAfterApply=await page.locator('p',{hasText:'Đang xem:'}).innerText();expect(evidence.midnightAfterApply).toContain('Tháng 11/2026');evidence.checks.push('midnight keeps selected period until apply');
 await nav('Cài đặt');const countsBeforeRefusal=await page.evaluate(()=>window.__cxData.counts());const broken=JSON.parse(buffer.toString());broken.schemaVersion=999;await backup.getByLabel('Nhập backup').setInputFiles({name:'future.p2cbackup',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(broken))});const refused=page.getByRole('dialog',{name:'Không nhập được file'});await expect(refused).toBeVisible();evidence.futureSchema=await refused.innerText();expect(await page.evaluate(()=>window.__cxData.counts())).toEqual(countsBeforeRefusal);await refused.getByRole('button',{name:'Đóng',exact:true}).click();evidence.checks.push('schema too new refused without data change');
  await page.getByRole('button',{name:'Nạp lại…',exact:true}).click();const reloadDialog=page.getByRole('dialog',{name:'Nạp lại dữ liệu giả lập?'});await reloadDialog.getByRole('textbox').fill('NẠP LẠI');evidence.reloadBeforeMidnight=await reloadDialog.innerText();await page.clock.fastForward(14*60*60*1000+60000);await page.evaluate(()=>window.dispatchEvent(new Event('focus')));evidence.reloadAfterMidnightBeforeClick=await reloadDialog.innerText();evidence.reloadActualDay=await page.evaluate(()=>window.__cxData.today());await reloadDialog.getByRole('button',{name:'Nạp lại',exact:true}).click();await expect(reloadDialog).toBeHidden({timeout:60000});evidence.reloadNotice=await page.getByRole('status').filter({hasText:'Đã nạp lại dữ liệu giả lập'}).innerText();evidence.reloadEarliestCustomerDay=await page.evaluate(()=>window.__cxData.db().sqlite.exec('SELECT MIN(date) FROM stage_transitions WHERE from_stage IS NULL')[0].values[0][0]);
 evidence.longTasks=await page.evaluate(()=>window.__cxTasks);expect(errors).toEqual([]);
}catch(e){evidence.failure=String(e);console.error(e);process.exitCode=1;}finally{fs.writeFileSync(`${here}/browser-evidence.json`,JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence));await context.close();}
```


### D — mutate.mjs

```javascript
import fs from 'node:fs';
export default {name:'cx-f-single-mutation',enforce:'pre',transform(code,id){
 const mutant=process.env.CX_F_MUTANT;
 const plain=id.split('?')[0];
 if(mutant==='wrong-close-rate'&&plain.endsWith('/overview/team-compare-view.ts')){
  const bad=code.replace('closeRate: closeRate(issuedCount, rfCount)','closeRate: closeRate(rfCount, issuedCount)');
  if(bad===code)throw new Error('mutation target missing');
  fs.writeFileSync('C:/workspace/deep-review-1-4/codex/F/team-compare-view.mutant.ts',bad);return bad;
 }
 return null;
}};
```


### D — vitest.mutation.config.mts

```typescript
import mutation from './mutate.mjs';
import { createRequire } from 'node:module';
const repo = 'C:/workspace/Project-2C-review-2';
const here = 'C:/workspace/deep-review-1-4/codex/F';
const appRequire = createRequire(`${repo}/apps/desktop/package.json`);
const rootRequire = createRequire(`${repo}/package.json`);
export default { plugins: [mutation],
  root: repo,
  cacheDir: `${here}/vite-cache`,
  resolve: { alias: [
    { find: /^@p2c\/domain$/, replacement: `${repo}/packages/domain/src/index.ts` },
    { find: /^@p2c\/db$/, replacement: `${repo}/packages/db/src/index.ts` },
    { find: /^@p2c\/ui$/, replacement: `${repo}/packages/ui/src/index.ts` },
    { find: /^exceljs$/, replacement: appRequire.resolve('exceljs') },
    { find: /^vitest$/, replacement: 'C:/workspace/Project-2C-review-2/node_modules/vitest/dist/index.js' },
  ] },
  server: { fs: { allow: [repo, here] } },
  test: {
    include: [
      `${here}/probe.test.ts`,
      'apps/desktop/src/routes/overview/*.test.ts',
      'apps/desktop/src/routes/reports/*.test.ts',
      'apps/desktop/src/routes/team/*.test.ts',
      'apps/desktop/src/routes/applied-filter.test.ts',
      'packages/ui/src/components/PeriodPicker.label.test.ts',
    ],
    testTimeout: 120000,
    fileParallelism: false,
  },
};
```


### D — playwright.mutation.config.mts

```typescript
export default {
 testDir:'C:/workspace/Project-2C-review-2/e2e',testMatch:'reports.spec.ts',workers:1,retries:0,
 outputDir:'C:/workspace/deep-review-1-4/codex/F/mutation-e2e',reporter:'list',
 expect:{timeout:15000},timeout:60000,
 use:{baseURL:'http://127.0.0.1:1433',channel:'msedge',headless:true,locale:'vi-VN',acceptDownloads:true},
};
```


### D — mutation-pending-probe.mjs

```javascript
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire('C:/workspace/Project-2C-review-2/package.json');
const {chromium,expect}=require('@playwright/test');
const here='C:/workspace/deep-review-1-4/codex/F';
const context=await chromium.launchPersistentContext(`${here}/mutation-probe-profile`,{channel:'msedge',headless:true,locale:'vi-VN',downloadsPath:`${here}/downloads`});
const page=await context.newPage();const evidence={};
try{
 await page.goto('http://127.0.0.1:1433/#/reports');await expect(page.getByRole('table',{name:'Tổng hợp'})).toBeVisible({timeout:60000});
 evidence.applied=await page.locator('p',{hasText:'Đang xem:'}).innerText();
 await page.getByRole('radiogroup',{name:'Loại kỳ'}).getByRole('radio',{name:'Năm',exact:true}).click();
 await page.evaluate(()=>{window.__cxDownload=null;HTMLAnchorElement.prototype.click=function(){window.__cxDownload=this.download;};});
 await page.getByRole('button',{name:'Xuất Excel',exact:true}).click();await page.waitForFunction(()=>window.__cxDownload);
 evidence.expected='bao-cao_2026-09_toan-bo_2026-09-15.xlsx';evidence.actual=await page.evaluate(()=>window.__cxDownload);
 try{expect(evidence.actual).toBe(evidence.expected);evidence.assertionFailed=false;}catch(e){evidence.assertionFailed=true;evidence.assertion=String(e);}
 if(!evidence.assertionFailed)throw new Error('Mutant did not reproduce');
}finally{fs.writeFileSync(`${here}/mutation-pending-evidence.json`,JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence));await context.close();}
```


### E — production-serve.mjs

```javascript
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const repo='C:/workspace/Project-2C-review-2';
const here='C:/workspace/deep-review-1-4/codex/F';
const appRequire=createRequire(`${repo}/apps/desktop/package.json`);
const {build}=await import(pathToFileURL(appRequire.resolve('vite')).href);
const {default:react}=await import(pathToFileURL(appRequire.resolve('@vitejs/plugin-react')).href);
const {default:tailwind}=await import(pathToFileURL(appRequire.resolve('@tailwindcss/vite')).href);
await build({configFile:false,root:`${repo}/apps/desktop`,cacheDir:`${here}/production-cache`,plugins:[{name:'cx-f-data-observation',enforce:'pre',transform(code,id){if(id.endsWith('/src/main.tsx'))return code.replace('(data) => render(', '(data) => (window.__cxData = data, render(').replace('appWindow={isTauri() ? getCurrentWindow() : undefined} />),','appWindow={isTauri() ? getCurrentWindow() : undefined} />)),');return null;}},react(),tailwind()],define:{'import.meta.env.VITE_DEMO_ANCHOR':JSON.stringify('05/10/2026')},build:{outDir:`${here}/production-dist`,emptyOutDir:true}});
const root=`${here}/production-dist`;
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.wasm':'application/wasm','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const rel=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);let file=path.resolve(root,`.${rel}`);if(!file.startsWith(path.resolve(root)+path.sep)){file=path.join(root,'index.html');}if(!fs.existsSync(file)||fs.statSync(file).isDirectory())file=path.join(root,'index.html');res.setHeader('Content-Type',types[path.extname(file)]??'application/octet-stream');res.end(fs.readFileSync(file));});
server.listen(1434,'127.0.0.1',()=>console.log(`CX-F production PID ${process.pid} http://127.0.0.1:1434`));
process.on('SIGINT',()=>server.close(()=>process.exit(0)));
process.on('SIGTERM',()=>server.close(()=>process.exit(0)));
```


### E — production-perf.mjs

```javascript
import fs from 'node:fs';
import {createRequire} from 'node:module';
import os from 'node:os';
const require=createRequire('C:/workspace/Project-2C-review-2/package.json');
const {chromium,expect}=require('@playwright/test');
const here='C:/workspace/deep-review-1-4/codex/F';
const context=await chromium.launchPersistentContext(`${here}/production-profile`,{channel:'msedge',headless:true,viewport:{width:1365,height:900},locale:'vi-VN'});
const page=await context.newPage();const evidence={cpu:os.cpus()[0].model,node:process.version,kind:'Vite production build; only __cxData observation injected; no business-code mutation',navigations:[],filters:[],errors:[]};
page.on('pageerror',e=>evidence.errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:1434/#/settings');await expect(page.getByRole('heading',{name:'Cài đặt',exact:true})).toBeVisible({timeout:90000});
 evidence.edge=await page.evaluate(()=>navigator.userAgent);
 await page.evaluate(()=>{window.__cxTasks=[];new PerformanceObserver(list=>window.__cxTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({entryTypes:['longtask']});});
 const importStart=await page.evaluate(()=>performance.now());await page.getByRole('region',{name:'Xuất / nhập backup'}).getByLabel('Nhập backup').setInputFiles({name:'load.p2cbackup',mimeType:'application/json',buffer:fs.readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json')});
 const dialog=page.getByRole('dialog',{name:'Thay toàn bộ dữ liệu?'});await expect(dialog).toBeVisible({timeout:60000});evidence.importPreviewMs=(await page.evaluate(()=>performance.now()))-importStart;await dialog.getByRole('button',{name:'Thay dữ liệu',exact:true}).click();await expect(dialog).toBeHidden();evidence.counts=await page.evaluate(()=>window.__cxData.counts());
 const nav=async(name)=>page.getByRole('navigation').getByRole('link',{name,exact:true}).click();
 for(let repeat=0;repeat<5;repeat++)for(const [name,screen]of[['Tổng quan','overview'],['Báo cáo','reports'],['Team & nhân sự','team']]){
  const start=await page.evaluate(()=>performance.now());await nav(name);await expect(page.getByRole('heading',{name,exact:true})).toBeVisible();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));evidence.navigations.push({repeat,screen,wallMs:(await page.evaluate(()=>performance.now()))-start});
 }
 await nav('Báo cáo');const picker=page.getByRole('group',{name:'Kỳ thống kê'});
 for(const kind of ['Năm','Tháng','Năm','Tháng','Năm','Tháng']){await picker.getByRole('radiogroup',{name:'Loại kỳ'}).getByRole('radio',{name:kind,exact:true}).click();const start=await page.evaluate(()=>performance.now());await page.getByRole('button',{name:'Lọc',exact:true}).click();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));evidence.filters.push({kind,wallMs:(await page.evaluate(()=>performance.now()))-start});}
 evidence.longTasks=await page.evaluate(()=>window.__cxTasks);expect(evidence.errors).toEqual([]);
}catch(e){evidence.failure=String(e);console.error(e);process.exitCode=1;}finally{fs.writeFileSync(`${here}/production-evidence.json`,JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence));await context.close();}
```
