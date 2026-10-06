# Deep review Phase 1–4 — gói F (Tổng quan, Báo cáo, Team & nhân sự, Cài đặt) — Claude

- **SHA:** `f0c53eb57eb7eac8665ad87287e794ae4c5bc43b` (`git rev-parse HEAD` kiểm đầu phiên trong `C:\workspace\Project-2C-review`, detached). Cuối phiên `git status` sạch: không sửa file, không commit. Mọi build / test tạm ghi ra `C:\workspace\deep-review-1-4\claude\F\` (build web có mutation ở `F\dist-mut`, kết quả Playwright ở `F\pw-out`, cache Vite riêng `F\.vite-*`).
- **Ngày / máy:** 05/10/2026, Home PC (`DESKTOP-KDURKJP`). Một phiên Claude sạch, không subagent.
- **Prompt:** prompt dán còn sót "§4 dòng gói A"; mọi chỗ khác ghi gói F (thư mục `claude\F\`, file `F.md`, ID `CL-F`). Phiên này làm **gói F** theo dòng F của §4: `routes/{overview,reports,team}`, `Settings*`, `FilterBar` (+ `applied-filter.ts`, `period-labels.ts`, `Overview.tsx`); `PeriodPicker` chỉ xét phần nối với thanh Lọc (gói D đã đọc component).
- **Nguồn ngoài repo đã đọc:** `common\README.md`, `baseline.md`, `known.md`, `common\load\load-backup.json`; `claude\A.md` … `E.md` (danh sách phát hiện, "đã xét", ghi chú "cho gói F"). Exe release dùng lại bản gói D đã build ở cùng SHA (SHA-256 `CA72E590…333D` trùng), **chép sang** `claude\F\exe` kèm file dữ liệu tải đã nhập (bản của gói E, có vài thao tác probe của D / E), chạy với cổng debug 9335. **Không mở / liệt kê / tìm trong `codex\`.**
- Lượt e2e của phiên chạy trên cổng **4183** với cấu hình riêng (`F\playwright.f.config.ts`), không dùng cổng 4173 của `pnpm e2e`, để không đụng phiên khác có thể đang chạy e2e.

## 1. Phạm vi đã đọc

| Vùng | File (dòng) | Cách đọc |
|---|---|---|
| Thanh Lọc | `routes/FilterBar.tsx` 1–79; `applied-filter.ts` 1–51; `period-labels.ts` 1–24; `Overview.tsx` 1–79 | đọc từng dòng |
| `routes/overview` (SP) | `overview-view.ts` 1–251; `stage-view.ts` 1–142; `stage-chart.ts` 1–130; `team-compare-view.ts` 1–127; `OverviewTiles.tsx` 1–76; `StageBlock.tsx` 1–127; `TeamCompare.tsx` 1–127 | đọc từng dòng |
| `routes/reports` (SP) | `reports-view.ts` 1–323; `report-workbook.ts` 1–259; `ReportsScreen.tsx` 1–131; `ReportTable.tsx` 1–154; `ReportExport.tsx` 1–96 | đọc từng dòng |
| `routes/team` (SP) | `team-view.ts` 1–119; `TeamScreen.tsx` 1–341; `PersonDialogs.tsx` 1–203; `TeamDialogs.tsx` 1–99 | đọc từng dòng |
| Cài đặt | `Settings.tsx` 1–127; `SettingsBackup.tsx` 1–280; `SettingsDataFile.tsx` 1–135 | đọc từng dòng |
| Test unit gói F (1 633 dòng, 113 test) | `overview-view.test.ts`, `stage-view.test.ts`, `stage-chart.test.ts`, `team-compare-view.test.ts`, `reports-view.test.ts`, `report-workbook.test.ts`, `team-view.test.ts`, `applied-filter.test.ts` | cấu trúc `describe/it` toàn bộ; đọc đoạn quanh mọi mutation sống (`overview-view.test.ts` 1–40, 117–131); đánh giá bằng 94 mutation |
| e2e của gói F | `overview.spec.ts` 1–178, `reports.spec.ts` 1–196, `team.spec.ts` 1–60 + 296–330, `backup.spec.ts` 1–140, `demo-data.spec.ts` 1–40; tên mọi test của `chart.spec.ts`, `period-picker.spec.ts`; `playwright.config.ts`, `e2e/serve.mjs` | đọc + đánh giá bằng mutation chạy e2e thật (phụ lục B) |
| Hợp đồng nơi khác (chỉ để kiểm) | `docs/design/phase-4-chi-so.md` toàn bộ; ADR-0007 (grep case size); mockup `reports.html` (grep mốc), `team.html` 113–120, `phase-3-feedback.html` 760–800 + 1095; `docs/reviews/2026-10-01-phan-hoi-owner-kiem-exe.md` dòng B1; `packages/ui/src/components/{Chart,PeriodPicker}.tsx`; `packages/domain/src/{stats,stage-snapshot}.ts` (phần scope, snapshot), `period.ts` 296–408; `shell/{AppShell,ScopePicker,ScopeContext,scope}.ts(x)`; `data/app-data.ts` 315–329, `AppDataContext.tsx` 26–40; `packages/db/src/{customers,policies}.ts` (list*); `i18n/vi.ts` mọi key của gói F; `tokens.css` | đọc đoạn |

Lệnh / công cụ đã chạy: 8 file test unit của gói F (113 test, xanh) dưới `TZ` = Pacific/Honolulu, Pacific/Kiritimati, America/Los_Angeles, UTC và `--sequence.shuffle` seed 7, 99 (đều 113/113; `TZ` đặt qua PowerShell, đã kiểm `getTimezoneOffset` = 600); coverage riêng vùng gói F; 94 mutation unit (phụ lục A); 43 lượt mutation / đồng hồ trên e2e + 1 lượt nền xanh (phụ lục B); 6 probe Vitest trên dữ liệu tải (phụ lục C); exe release (WebView2, cổng debug 9335) với dữ liệu tải: đo mở từng màn, Lọc, đổi bảng, Xuất Excel, một lệnh ghi ở Team, đọc thuộc tính trợ năng; tính tương phản; quét export / chuỗi cứng.

## 2. Phát hiện

### CL-F1

```
ID: CL-F1
Mức: Low
Trục: T
Vị trí: e2e/team.spec.ts:318-322 ("member columns: an RE open customers match the Customers screen") · đối chiếu apps/desktop/src/routes/team/TeamScreen.tsx:141 (năm của tiêu đề = today.year của app) · playwright.config.ts:39 (VITE_DEMO_ANCHOR 15/09/2026) (f0c53eb)
Tình trạng: CONFIRMED (chạy thật: đồng hồ thật xanh, đồng hồ Node 05/01/2027 đỏ, cùng bản build)
```

**Mô tả.** Test lấy năm kỳ vọng của cột "HĐ năm …" từ **đồng hồ máy chạy test** (`new Date().getFullYear()`, comment "The app counts the year of the machine clock"), trong khi từ T-126 app đếm theo ngày của app, mà bản e2e ghim ở 15/09/2026 (`VITE_DEMO_ANCHOR`). Hai năm trùng nhau chỉ vì hôm nay là năm 2026; comment đã lỗi thời.

**Tái hiện.** `F\e2e-mut.mjs` (phụ lục B), bản build không đổi, chỉ chạy test này (`-g "member columns"`):
- `YEAR0` đồng hồ thật (05/10/2026): **1 passed**.
- `YEAR1` chỉ đồng hồ của tiến trình Playwright (Node) dời sang 05/01/2027 bằng `NODE_OPTIONS=--require fake-year.cjs` (trình duyệt và app không đổi): **1 failed** — `getByRole('columnheader', { name: /HĐ năm 2027/ })` không thấy (tiêu đề vẫn "HĐ năm 2026", đúng theo ngày app).

**Ảnh hưởng.** Từ **01/01/2027** (theo giờ máy chạy e2e; CI GitHub chạy UTC), mọi lượt `pnpm e2e` và mọi CI của PR code đều đỏ ở test này (`retries: 1` không cứu vì lỗi xác định). Theo quy trình "CI xanh mới merge", mọi PR code bị chặn tới khi sửa test; lúc đó dự án đang ở Phase 5.

**Đề xuất.** Năm kỳ vọng lấy từ ngày ghim của bản e2e (2026, hằng như `ANCHOR` của `demo-data.spec.ts`) hoặc đọc từ chính app; sửa comment. ≤ 5 dòng test.

### CL-F2

```
ID: CL-F2
Mức: Low
Trục: T
Vị trí: unit — overview-view.ts:93, 156, 189, 192 · team-compare-view.ts:112 · reports-view.ts:293 · applied-filter.ts:19 · report-workbook.ts:113; TSX — Overview.tsx:46 · OverviewTiles.tsx:11, 50, 72 · StageBlock.tsx:70, 106 · ReportsScreen.tsx:78 · ReportTable.tsx:75, 121, 128 · TeamScreen.tsx:114-115 · PersonDialogs.tsx:186 (f0c53eb)
Tình trạng: CONFIRMED (94 mutation unit + 41 mutation chạy e2e thật: 33 trên TSX, 8 lặp lại con sống của unit; phụ lục A, B)
```

**Mô tả.** Các mutation dưới đây đổi hành vi thấy được mà test vẫn xanh.

*Unit (94 lượt: 80 bị bắt, 14 sống)* — sống mà có nghĩa:
- **OV4** câu "so với …" của cửa sổ **một ngày** khác năm bỏ năm: hôm nay 01/01/2026, kỳ Ngày (hoặc Tháng 01 MTD) → app ghi "so với 31/12/2025" / "so với 01/12/2025" (probe-edges), mutation ra "so với 31/12" / "01/12" mà không test nào đỏ (`overview-view.ts:93` là dòng chưa phủ duy nhất của hàm). **e2e cũng không bắt** (lượt U1).
- **OV9** tỉ lệ chốt lệch dưới 0,05 điểm hiện "▲ 0 điểm %" thay vì "=" (`overview-view.ts:180-189`). **e2e không bắt** (U2).
- **OV10** kỳ Tùy chọn có tỉ lệ chốt: ghi chú thành "— kỳ trước 0 RF, không so" thay vì "Kỳ Tùy chọn không so với kỳ trước" (test "gives the reason a KPI is not compared" không kiểm ô Tỉ lệ chốt của kỳ Tùy chọn). **e2e không bắt** (U3).
- **OV18** đổi chỗ ô "Case size" và "HĐ phát hành" trong hàng 6 ô KPI. **e2e không bắt** (U6: e2e chỉ đếm 6 ô).
- **AP4** sửa **chỉ ngày cuối** của kỳ Tùy chọn đang áp dụng mà nút Lọc không sáng / không có dòng nhắc (`applied-filter.ts:19`). **e2e không bắt** (U8, 31 test của Tổng quan / Báo cáo / bộ chọn kỳ xanh).
- **TC1 / RV10** bỏ hẳn bước sắp team theo tên (`team-compare-view.ts:112`, `reports-view.ts:293`): golden ("Team A", "Team B") và seed ("Bình Minh", "Hừng Đông", "Sao Mai") có thứ tự BINARY của db trùng `Intl.Collator('vi')`, nên không test nào phân biệt; với tên bắt đầu bằng "Đ" / "Á" thứ tự sai (probe-edges, CL-B10). **e2e không bắt** (U7).
- Nhỏ: **RW8** bỏ đóng băng hàng tiêu đề thứ 3 của sheet Excel.
- Tương đương (không cần test): OV3 (cửa sổ trước luôn kết thúc trước kỳ, nên năm cuối = năm đầu khi năm đầu = năm của kỳ), RV14 / RV15 (mốc chứa hôm nay đếm cả mốc hay tới hôm nay ra cùng số vì lệnh db chặn bản ghi kết quả / chuyển nhóm sau hôm nay), RV19 (mốc tuần bị cắt ở đầu tháng luôn kết thúc Chủ nhật). OV13 / OV14 sống ở unit nhưng e2e bắt được (U4: kỳ chưa bắt đầu làm `customPeriod` ném lỗi; U5: dòng "Đang xem" của kỳ Năm có chữ "MTD").

*TSX trên e2e (33 lượt, 19 bị bắt, 14 sống; chỉ chạy spec liên quan):*
- **FT1** ô "Lịch hẹn" của Tổng quan góc nhìn Team đếm theo `applied.scope` (chỉ team đầu) thay vì cộng mọi team (`Overview.tsx:46`, spec §4.3): e2e góc nhìn Team chỉ kiểm chữ "Đang xem" và số chart, không kiểm số nào.
- **FT6** cả 4 dòng nhóm của ô Lịch hẹn hiện số "Đã gặp"; **FT7** mất dòng công thức "x HĐ phát hành ÷ y RF"; **FT8** ▲ đỏ / ▼ xanh: e2e Tổng quan không đọc số nào trong ô.
- **FT9** bấm ẩn một nhóm (N4) mà chart vẫn vẽ nhóm đó: e2e chỉ kiểm `aria-pressed` và "còn 3 `svg`"; **FT10** tiêu đề chart theo team mất "N3 90 · N2 44 · N1 22".
- **FT15** Xuất Excel lấy kỳ **đang chọn chưa Lọc** cho tên file (lệch với bảng trên màn): e2e chỉ xuất khi không có gì chờ Lọc.
- **FT18 / FT19 / FT20** Báo cáo mất vạch "hôm nay" của mốc, vạch ngăn team ở Theo RE, chữ mờ của "—".
- **FT24 / FT25** cột "HĐ năm 2026" hiện số "KH đang mở", cột "Lịch hẹn 30 ngày" hiện số HĐ: e2e chỉ kiểm cột "KH đang mở" và tiêu đề năm.
- **FT31** hộp xóa nhân sự không liệt kê "đang phối hợp n lịch hẹn".
- **FT37** là KNOWN #185 (nhánh `SCHEMA_TOO_NEW`), xác nhận lại.

*Coverage* (vùng gói F, chạy riêng): Stmts 98,65 / Branch 92,61 / Funcs 99,29; dòng chưa phủ: `overview-view.ts:93, 237`, `stage-chart.ts:101`, `team-compare-view.ts:80`, `period-labels.ts:5` (không file nào đo).

**Ảnh hưởng.** Chưa có lỗi người dùng. Một lần sửa / gộp code ở các chỗ trên (nhất là câu "so với" của kỳ một ngày, ô Tỉ lệ chốt của kỳ Tùy chọn, dòng nhắc Lọc khi sửa ngày cuối, ô Lịch hẹn của góc nhìn Team, thứ tự team) qua được cả `pnpm verify` lẫn e2e.

**Đề xuất.** Thêm ≈ 8 ca unit (kỳ Ngày 01/01 và Tháng 01 MTD ngày 01/01 → "so với 31/12/2025" / "01/12/2025"; điểm % dưới 0,05 → "="; ô Tỉ lệ chốt của kỳ Tùy chọn; thứ tự 6 ô; sửa ngày cuối Tùy chọn → `isPending`; một team tên "Đông Á" trong fixture của `teamCompare` / `reportRows`; `ySplit` của sheet) và vài khẳng định e2e (số của ô Lịch hẹn góc nhìn Team = Toàn bộ; công thức tỉ lệ chốt; ẩn N4 thì chart không còn series N4 — đọc `echarts.getInstanceByDom(...).getOption().series`; Xuất Excel khi đang chờ Lọc; cột HĐ năm / Lịch hẹn 30 ngày của một RE). Cỡ ≈ 70 dòng test, không đổi SP.

### CL-F3

```
ID: CL-F3
Mức: Nit
Trục: P
Vị trí: apps/desktop/src/routes/SettingsDataFile.tsx:24 (useQuery(countRecords)) · apps/desktop/src/data/app-data.ts:321-329 (countRecords = list*().length) (f0c53eb)
Tình trạng: CONFIRMED (số đo Node + exe release, dữ liệu tải)
```

**Mô tả.** Thẻ "File dữ liệu" của Cài đặt đếm bản ghi bằng `countRecords`, tức đọc và map **toàn bộ** năm bảng (`listAppointments` 10 434 dòng × 17 cột qua drizzle…) chỉ để lấy `.length`; chạy mỗi lần mở Cài đặt và sau mỗi revision.

**Số đo.** Node, dữ liệu tải, median 9 (`probe-count`): `countRecords` **97–127 ms** (ba lượt lúc máy rảnh); cùng năm số bằng `SELECT COUNT(*)` với cùng điều kiện (bản ghi sống, KH sống) **5,7–9,6 ms**, ra đúng cùng số (4 / 51 / 1 496 / 10 434 / 1 804). Exe release (`perf-screens`, gắn debugger nhưng không có IPC trong phép đo này): mở Cài đặt từ Khách hàng 98 / 98 / 105 ms tới khung hình, màn chỉ có 101 nút DOM — gần như toàn bộ là phần đếm.

**Ảnh hưởng.** Nhỏ: ≈ 0,1 s mỗi lần mở Cài đặt với dữ liệu tải, tăng tuyến tính theo số lịch hẹn. Cùng hàm còn chạy hai lần khi chọn file backup (ghi chú gói B / D).

**Đề xuất.** `countRecords` trong db bằng `COUNT(*)` (một hàm, dùng chung cho thẻ và hộp nhập backup). ≤ 25 dòng SP + 1 test so với `list*().length`; tiêu chí: ≤ 15 ms trên dữ liệu tải.

### CL-F4

```
ID: CL-F4
Mức: Nit
Trục: A
Vị trí: apps/desktop/src/routes/FilterBar.tsx:58-65 (nút Lọc đổi màu + chấm aria-hidden + <span> dòng nhắc), 67 (dòng "Đang xem" aria-live) (f0c53eb)
Tình trạng: CONFIRMED (đọc thuộc tính trong exe release)
```

**Mô tả.** Khi chọn kỳ / góc nhìn khác số đang hiện, trạng thái "chưa áp dụng" chỉ hiện bằng màu nút Lọc, một chấm `aria-hidden` và dòng "Đã đổi kỳ / góc nhìn — bấm Lọc để cập nhật" là `<span>` thường: không `role="status"`, không nằm trong vùng `aria-live`, nút Lọc không có `aria-describedby` / `aria-pressed`. Vùng `aria-live` duy nhất là dòng "Đang xem", mà dòng này **chỉ đổi sau khi bấm Lọc**.

**Bằng chứng.** Exe, Báo cáo, chọn "Năm" chưa Lọc (`perf-export`): dòng nhắc `role = null`, tổ tiên `aria-live` = không có, nút Lọc `aria-describedby = null`, tên nút "Lọc". Bộ chọn kỳ đọc nhãn kỳ mới qua `<output aria-live>` (gói D), nên người dùng trình đọc màn hình nghe "Năm 2026" mà không được báo rằng số trên màn vẫn là của tháng.

**Ảnh hưởng.** Người dùng trình đọc màn hình ở Tổng quan / Báo cáo dễ hiểu nhầm là số đã cập nhật theo kỳ vừa chọn.

**Đề xuất.** `role="status"` cho dòng nhắc (hoặc `aria-describedby` từ nút Lọc tới nó). ≤ 5 dòng SP + 1 khẳng định e2e.

### CL-F5

```
ID: CL-F5
Mức: Nit
Trục: B
Vị trí: apps/desktop/src/routes/team/team-view.ts:72-101 (staffMetrics tính cho mọi người, kể cả TL / IS / BD / BDM) · TeamScreen.tsx:85, 88 (nhánh "—" của metricColumn), 333 (rows={entry.reps}: chỉ RE) · i18n/vi.ts:709 ('team.noMetric') · test team-view.test.ts:100 (f0c53eb)
Tình trạng: CONFIRMED (đọc code + e2e hiện hành khẳng định bảng chỉ có RE)
```

**Mô tả.** Từ quyết định B1 (01/10, "TL bỏ khỏi bảng", `phan-hoi-owner-kiem-exe.md` dòng 6; e2e `team.spec.ts:40-43` khẳng định 0 ô "TL", 10 ô "RE"), bảng thành viên chỉ nhận `entry.reps`. Vì vậy:
- `staffMetrics` vẫn tính "Lịch hẹn 30 ngày" cho TL / người hỗ trợ (vòng `filter` trên toàn bộ lịch hẹn cho cả 51 người thay vì 44 RE) mà không chỗ nào hiện; TL trên tiêu đề và danh sách "Người hỗ trợ" không có số (đúng B1).
- Nhánh `value === null → '—'` và `?? -1` ("sorts below every count") của `metricColumn` không thể tới; key `team.noMetric` chỉ còn dùng ở nhánh đó.
- Test `team-view.test.ts:100` "gives other roles only the appointments they coordinate" giữ một giá trị không hiện ở đâu.
- Phần "là người phối hợp" của `appointments30` chỉ có nghĩa cho TL / người hỗ trợ (UI không cho chọn RE làm người phối hợp, CL-B9).

**Ảnh hưởng.** Không ảnh hưởng người dùng; code / test / key i18n thừa (`staffMetrics` 12,9–13,5 ms so với 10,1–11,2 ms khi chỉ tính RE — không đáng kể).

**Đề xuất.** `staffMetrics` chỉ cho RE, bỏ nhánh `null` và `team.noMetric`, sửa test; giữ cột "Vai trò" vì mockup B1 (`phase-3-feedback.html:764`) vẫn có. Hoặc ghi ACCEPTED nếu Phase 5–6 định hiện số cho người hỗ trợ. ≤ 30 dòng, chủ yếu xóa.

### CL-F6

```
ID: CL-F6
Mức: Nit
Trục: P
Vị trí: apps/desktop/src/routes/overview/team-compare-view.ts:106-120 (figures(scope) cho mỗi team và mỗi RE) · apps/desktop/src/routes/reports/reports-view.ts:229-233, 280-299 (figures(of) cho Tổng hợp, mỗi RE, mỗi team) (f0c53eb)
Tình trạng: CONFIRMED (số đo Node + exe release, dữ liệu tải)
```

**Mô tả.** Bảng So sánh team và Báo cáo góc nhìn Toàn bộ tính từng dòng bằng `appointmentCounts` + `periodMetrics` (+ ảnh chụp nhóm ở Báo cáo) trên **toàn bộ** lịch hẹn / chuyển nhóm / HĐ, mỗi dòng một lượt: 4 team + 44 RE = 48 lượt (Báo cáo 49). Mỗi lượt dựng lại matcher của góc nhìn rồi lọc gần hết bản ghi để bỏ đi.

**Số đo** (Node, dữ liệu tải, median 9 mỗi lượt, khoảng = 2–3 lượt lúc máy rảnh; `probe-perf`, `probe-byre`):

| Hàm | Tháng | Năm | Tùy chọn 92 ngày |
|---|---|---|---|
| `teamCompare` | 28–36 ms | 28–41 ms | 27–54 ms |
| `reportRows` Toàn bộ | 37–39 ms | 40–45 ms | 38–56 ms |
| Cùng số của So sánh team, nhóm bản ghi theo RE **một lần** rồi đếm từng RE (probe, ra đúng cùng số) | 3,3 ms | 4,2 ms | — |

Trong exe (gắn debugger), mở Tổng quan 154–221 ms, Báo cáo 143–147 ms (cả hai gồm ≈ 100–140 ms đọc lại bảng — CL-B8); Lọc ở Tổng quan góc nhìn Team 44–49 ms, Toàn bộ 28–38 ms, Báo cáo 28–32 ms.

**Ảnh hưởng.** Nhỏ hôm nay (dưới 100 ms mỗi lần Lọc / mở màn), nhưng tăng theo (số team + số RE) × số bản ghi: mỗi năm dữ liệu thêm và mỗi RE thêm đều nhân vào. Phần tính này chiếm ≈ 20–30 % thời gian mở Tổng quan / Báo cáo.

**Đề xuất.** Nhóm bản ghi theo `reId` một lần (hoặc thêm một hàm domain "chỉ số theo RE" như `periodMetricsByMark` đã làm cho mốc), dòng team = tổng các RE của team. Cần một helper domain (≈ 40 dòng) + dùng ở hai màn (≈ 30 dòng). Tiêu chí: `teamCompare` và `reportRows` Toàn bộ trên dữ liệu tải ≤ 15 ms.

## 3. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | P | B | T | A | S | Tổng |
|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | 0 |
| High | | | | | | | | | 0 |
| Medium | | | | | | | | | 0 |
| Low | | | | | | 2 (F1, F2) | | | 2 |
| Nit | | | | 2 (F3, F6) | 1 (F5) | | 1 (F4) | | 4 |
| **Tổng** | 0 | 0 | 0 | 2 | 1 | 2 | 1 | 0 | **6** |

Tình trạng: 6/6 CONFIRMED (tái hiện chạy thật, mutation, số đo Node + exe, hoặc đọc thuộc tính trong exe). Không có PLAUSIBLE, không có mục trùng `known.md`; phần liên quan KNOWN / gói trước ở §4.

**Nhận định chung gói F:** các màn Tổng quan, Báo cáo, Team và Cài đặt **ra số đúng và khớp nhau**: 588 phép so chéo giữa các màn / bảng / chart trên dữ liệu tải cho 10 kỳ và 10 góc nhìn không lệch số nào, file Excel khớp màn hình từng ô (5 746 ô), các nhãn kỳ ở ranh giới năm / kỳ Tùy chọn dài đúng nghĩa. Không thấy đường nào làm mất / sai dữ liệu. Hai phát hiện Low đều là test: một test e2e sẽ đỏ chắc chắn từ 01/01/2027 (CL-F1) và các chỗ test không giữ, chủ yếu ở phần TSX mà chỉ e2e phủ (CL-F2: 14 / 33 mutation TSX sống). Hiệu năng ở mức chấp nhận được (mở màn 100–220 ms, Lọc ≤ 50 ms trên dữ liệu tải); hai điểm Nit (CL-F3, CL-F6) là chỗ đọc / lặp thừa dễ bỏ, phần lớn thời gian còn lại là CL-B8.

## 4. KNOWN và phát hiện gói trước có liên quan

- **CL-B10** (db sắp tên theo collation BINARY; gói B nhờ gói E / F kiểm hiển thị): ở gói F có **ba nơi dùng thẳng thứ tự db**: danh sách team của màn Team (`team-view.ts:35` `teams.map` trên `listTeams`), ô chọn Team của hộp Nhân sự (`PersonDialogs.tsx:108`) và **các chart theo team của Tổng quan góc nhìn Team** (`stage-view.ts:129` `data.teams.map`); còn bảng So sánh team (`team-compare-view.ts:112`) và Báo cáo Theo team (`reports-view.ts:293`) sắp bằng `Intl.Collator('vi')`. Probe `probe-edges` (thêm 3 team "Đông Á", "Ánh Dương", "an Phú" vào dữ liệu tải): chart / danh sách Team ra `[Bình Minh, Hừng Đông, Rạng Đông, Sao Mai, an Phú, Ánh Dương, Đông Á]`, bảng So sánh team **ngay dưới các chart, cùng màn** và Báo cáo ra `[an Phú, Ánh Dương, Bình Minh, Đông Á, Hừng Đông, Rạng Đông, Sao Mai]`. Với 3–4 team của seed / dữ liệu tải, hai thứ tự trùng nhau nên không test nào thấy (mutation TC1 / RV10 bỏ hẳn bước sắp vẫn xanh — xem CL-F2). Không mở phát hiện mới; sửa CL-B10 (một hàm sắp chung) là sửa luôn ba chỗ này.
- **CL-B7** (gói B: `readOverview` ở `Overview.tsx:23-30` và `readReports` ở `ReportsScreen.tsx:27-34` giống hệt nhau, `loadMetricsData` của db không ai dùng): còn nguyên, không báo lại.
- **CL-B8** (mỗi màn đọc lại toàn bộ bảng sau mỗi lệnh ghi): là phần lớn thời gian mở màn của gói F (§5 P) và của một lệnh ghi ở màn Team: đổi tên team trong exe dữ liệu tải mất 149–251 ms từ bấm "Lưu" tới khung hình (6 lần, không gắn debugger; `perf-team-write`), trong đó `staffMetrics` chỉ ≈ 13 ms. `readTeams` (`TeamScreen.tsx:32-43`) đọc cả `listAppointments` (≈ 97 ms trong Node) chỉ để đếm "Lịch hẹn 30 ngày" và số dùng của hộp xóa.
- **CL-D1 / CL-D2 / CL-D3** (Escape đóng hộp "đang chạy", `autoFocus` không ăn, focus rơi về `body`): hộp Nạp lại / Nhập backup của Cài đặt và hộp Team / Nhân sự của gói F chịu đúng các lỗi đó; không báo lại.
- **KNOWN #185** (`SettingsBackup.tsx`: nhánh `SCHEMA_TOO_NEW` của hộp 10b chưa có test): mutation FT37 xác nhận lại (SURVIVED, 9 test của `backup` / `demo-data` vẫn xanh), không có gì mới.
- **KNOWN #96 / #87 / #125** (Cài đặt: "Nạp lại" bị từ chối sau một lần lưu lỗi, hộp 10c thiếu số lượng, `backups\` không đọc được, CloseGuard): không có bằng chứng mới.
- **KNOWN R4** (`PeriodPicker` báo đỏ sớm khi Tab) và **P8** (Chart N4–N1 `role="img"` không có số liệu cho trình đọc màn hình): còn nguyên; ở gói F số liệu đó có dạng bảng ở Báo cáo → Theo mốc (đúng gợi ý của mục P8).
- **KNOWN #144** (Team: `role === 'RE' || role === 'TL'` lặp, lọc theo `reId` lặp ở `staffMetrics` / `personUsage`, "Xóa nhân sự" trong hộp Sửa bỏ thay đổi chưa lưu): còn nguyên; CL-F5 là phần khác (giá trị tính ra mà không bao giờ hiện).
- **Ghi chú gói D** (`PersonDialogs.tsx:46-57` gọi `onSaved(...)` trong cùng `try` với `data.run`): `onSaved` của `TeamScreen.tsx:226-229` chỉ gọi `setSelectedId` + `setEditing`, không ném được → không thành phát hiện.
- **Ghi chú gói D** (`Chart` dựng lại toàn bộ khi `option` đổi): ở Tổng quan, `option` chỉ đổi khi `stages` tính lại (mở màn, Lọc, qua nửa đêm) hoặc khi bấm ẩn / hiện một nhóm; chọn kỳ mà chưa Lọc không dựng lại chart (đọc code: `useMemo` theo `chart`, `shown`). Lọc trọn vẹn đo được 28–49 ms trong exe (§5 P) → không thành phát hiện.

## 5. Đã xét, không thấy

- **E — Edge case:**
  - Ranh giới năm (probe-edges, dữ liệu tải): kỳ Ngày 01/01/2026 → "so với 31/12/2025"; Tháng 01 MTD ngày 01/01 → "so với 01/12/2025", "Đang xem: Tháng 01/2026 MTD 01/01/2026"; Tuần 29/12/2025–04/01/2026 xem ngày 01/01 → "so với 22/12 – 25/12" (năm của kỳ), Tuần 05/01–11/01/2026 ngày 05/01 → "so với 29/12/2025"; Năm 2026 ngày 01/01 → "so với 01/01/2025", ô Tỉ lệ chốt "— kỳ trước 0 RF, không so". Không thấy chữ sai; chỗ test không giữ là CL-F2 (OV4).
  - Kỳ Tùy chọn dài / qua năm: Theo mốc 20/11/2025 – 19/02/2026 → "20–30/11/2025 · 01–31/12/2025 · 01–31/01/2026 · 01–19/02/2026"; 25/12/2025 – 05/01/2026 → 12 mốc ngày có năm ("T5 25/12/2025"…); chart Tùy chọn 92 ngày → 4 cột theo tháng, cột tháng chứa hôm nay chụp ngày 05/10. Mốc tuần cắt đầu tháng ghi "(T5–CN)", mốc chứa hôm nay ghi "(tới dd/mm)" / "(hôm nay)" — khớp mockup `reports.html:641-662, 694`.
  - Kỳ chưa bắt đầu: ô KPI / KH theo nhóm "—", So sánh team "—" sau Đã gặp, Báo cáo chỉ còn lịch hẹn (Dự kiến); Excel để ô trống (probe-excel, kỳ 12/2026). Kỳ trước ngoài miền 1900 → "kỳ trước ngoài miền 1900–2100 · không so" (test).
  - Nửa đêm: thanh Lọc giữ kỳ đã chọn và số chờ Lọc, "Hôm nay" nhảy sang tháng mới — có e2e (`period-picker.spec.ts:235`, `:257`); "Chưa ghi kết quả" / "Dự kiến" tính lại theo ngày mới (`useToday` vào `useMemo`). Cùng hướng với ACCEPTED "ngày được chọn của màn Lịch hẹn không tự nhảy qua nửa đêm".
  - Rỗng / một phần tử: không team (So sánh team "—" trước kỳ, 0 sau), team không RE (Theo RE rỗng, Tổng khớp Tổng hợp), kỳ không lịch ("0 / 0", "chưa có lịch"), ẩn cả 4 nhóm (chart chỉ còn series nét đứt) — test + đọc code.
  - Số lớn: tỉ lệ chốt > 100 % hiện "1.000%" trên màn, 10 (= 1000 %) trong Excel — đúng định nghĩa ADR-0007 (HĐ phát hành ÷ RF có thể > 1); tiền tới 57,27 tỷ cộng đúng (số nguyên đồng).
  - Tên: team có `<`, `"` → React escape; tooltip ECharts qua `encodeHtml` (F-18, mutation SC5 bị bắt). Tên file Excel với "Team Đông Á", "RE 李小龍", tên 220 ký tự, "Team ---", "Team ß æ ø": luôn chỉ `[A-Za-z0-9_.-]`, ≤ 120 ký tự (probe-excel). Thứ tự tên có "Đ" / "Á": CL-B10 (§4).
  - Múi giờ / thứ tự: 113 test gói F xanh dưới 4 múi giờ và 2 seed xáo; test unit gói F không đọc đồng hồ máy. Một test e2e có đọc → CL-F1.
  - Hai thao tác chồng nhau: Xuất Excel / Xuất backup / Nhập backup chặn bằng `busy` + `disabled`; Nạp lại và Nhập backup qua hộp modal (bị vượt bằng Escape — CL-D1); xuất backup đang chờ IPC mà bấm Nạp lại thì nội dung file đã dựng xong trước `await` nên không lẫn dữ liệu (đọc `app-data.ts:288-294`).
- **C — Đúng hợp đồng:**
  - **Số giữa các màn** (probe-consistency, dữ liệu tải, 10 kỳ: tháng / năm / tuần / ngày hiện tại và đã qua, Tùy chọn qua năm và đang chạy, tháng tương lai; Toàn bộ + 4 team + 5 RE): ô Lịch hẹn Tổng quan = Báo cáo Tổng hợp; So sánh team Tổng = Tổng hợp; Σ Theo team = Σ Theo RE = Tổng hợp (lịch hẹn, kết quả, KH cuối kỳ); Σ Theo mốc = Tổng hợp (lịch hẹn, kết quả) và mốc cuối có số = KH cuối kỳ; 4 ô N4–N1 = Tổng hợp = cột cuối của chart; góc nhìn Team của Tổng quan = Toàn bộ; từng chart team = dòng team của Báo cáo; Σ RE trong So sánh team = dòng team; Tổng hợp của một team / RE = dòng của nó trong Theo team / Theo RE; màn Team "KH đang mở" = N4–N1 hôm nay và "HĐ năm 2026" = HĐ phát hành Năm 2026 của Báo cáo cho cả 44 RE. **588 phép so, 0 lệch.**
  - **Excel = màn hình** (probe-excel): 4 kỳ × 3 góc nhìn, mọi sheet, mọi dòng, **5 746 ô số** đọc lại bằng ExcelJS khớp số sau `reportCells` (ô "—" để trống, tỉ lệ là phân số định dạng `0.0%`); số sheet 4 / 3 / 2 theo góc nhìn; không dòng thừa; tên dòng đúng.
  - Nhãn theo nghĩa thường: "Lịch hẹn · cả tháng" gồm Dự kiến sau hôm nay (spec §4.1), "Kết quả · tới hôm nay", "ảnh chụp cuối ngày … (hôm nay)", "Lịch hẹn 30 ngày" = 30 ngày tới hôm nay (không gồm ngày mai — mutation TV7 bị bắt), "KH đang mở" = N4–N1, "HĐ năm" = HĐ phát hành trong năm của app (Owner 28/09), "Nội dung: … nhân sự · … HĐ" = bản ghi sống. Thứ tự 6 ô KPI và cột Báo cáo khớp mockup / spec §4.4.
  - So kỳ trước C01–C11, M01–M04, G09–G11, G18 có test cùng mã và qua; Month → Tùy chọn cùng ngày vẫn là "chờ Lọc" (đúng: kỳ Tùy chọn không so, không MTD).
  - Mã lỗi của hộp Team / Nhân sự / Backup: chỗ trống `{name}`, `{role}`, `{version}`, `{supported}`, `{limitMb}` đều được truyền (đọc + e2e FT32 bị bắt).
- **D — Dữ liệu:** 8 chỗ ghi của gói F (`TeamDialogs.tsx` tạo / đổi tên / xóa team, `PersonDialogs.tsx` tạo / sửa / xóa nhân sự, `Settings.tsx` Nạp lại, `SettingsBackup.tsx` Nhập backup) mỗi chỗ đúng một lệnh db hoặc một `replace` của app-data; lỗi giữ hộp mở kèm câu báo, DB không đổi. Hộp xóa nhân sự kiểm trước bằng số dùng trên dữ liệu sống, lệnh kiểm lại (KH xóa mềm: ACCEPTED R1). Báo cáo / Tổng quan / Xuất Excel chỉ đọc. Chuẩn hóa NFC chỉ ở UI (CL-B11). Ghi muộn trong khoảng chờ backup khi thay dữ liệu: KNOWN S-2.
- **P — Hiệu năng** (exe release `f0c53eb`, dữ liệu tải, `perf-screens` lúc máy rảnh, gắn debugger nhưng các phép đo này không có IPC lưu; `perf-team-write` không gắn debugger):
  - Mở màn (route đổi → khung hình): Tổng quan 221 / 158 / 154 ms (301 nút DOM, 1 chart SVG), Báo cáo 147 / 145 / 143 ms, Team 111 / 112 / 110 ms, Cài đặt 98 / 98 / 105 ms. Phần lớn là đọc lại bảng (CL-B8: `readAll` 154–173 ms trong Node), phần còn lại CL-F6 / CL-F3.
  - Lọc: Tổng quan Toàn bộ 28–38 ms, góc nhìn Team (4 chart) 44–49 ms; Báo cáo 28–32 ms; đổi bảng Theo RE / Theo mốc / Theo team 3–17 ms.
  - Xuất Excel năm, Toàn bộ, 4 sheet: lần đầu 205 ms tới dòng "Đã xuất" (tải chunk ExcelJS, việc dài nhất trên luồng chính 136 ms), các lần sau 28–31 ms; file 16 KB; Node `buildReportWorkbook` 9 ms (lần đầu 452 ms vì nạp thư viện).
  - Một lệnh ghi ở Team (đổi tên team, không gắn debugger): 149–251 ms tới khung hình — thuộc CL-B8 (`readTeams` đọc cả `listAppointments`).
  - Node (median 9): `kpiTiles` 1,5–5,7 ms, `stageBlock` 3,4–6,6 ms (cả 4 chart team), `stageChartOption` ≤ 6,7 ms, `appointmentCounts` ≤ 1,5 ms, `reportRows` Team 10–19 ms, RE 1,9–3,4 ms, `groupByTeam` 0,01 ms. Chọn kỳ khi chưa Lọc không tính lại gì (`useMemo` theo `applied`), không dựng lại chart.
  - Bundle: ExcelJS (929,56 KB, baseline) chỉ tải ở lần xuất đầu (`import('exceljs')`), không nằm trong chunk chính; ECharts chỉ đăng ký module dùng (gói D). Không có gì mới.
- **B — Bloat:** quét mọi `export` của vùng gói F (`exports.mjs`): ngoài type nằm trong chữ ký công khai chỉ có `reportWorkbookMeta`, `reportFileName` (dùng trong file + test) và `markName` (chỉ dùng trong file, không test trực tiếp) — không báo. `tsc --noUnusedLocals --noUnusedParameters` cho `apps/desktop` sạch (gói D, cùng SHA). Mọi key i18n của gói F được dùng (probe key gói D); `team.noMetric` chỉ còn ở nhánh chết → CL-F5. Lặp: `readOverview` ≡ `readReports` (CL-B7); `new Intl.Collator('vi').compare` khai báo riêng ở 5 file (2 của gói F: `team-compare-view.ts`, `reports-view.ts`; + `appointments-view.ts`, `customers-view.ts`, `shell/scope.ts`) — mỗi chỗ một dòng, gộp khi sửa CL-B10.
- **T — Test:** 94 mutation unit (80 bị bắt) và 41 mutation chạy e2e (33 trên TSX: 19 bị bắt; 8 lặp lại con sống của unit: 2 bị bắt) → CL-F2; e2e đọc đồng hồ máy → CL-F1. Xáo thứ tự / múi giờ: xanh. Coverage vùng gói F: Stmts 98,65 / Branch 92,61 / Funcs 99,29 (`period-labels.ts` không được đo nhưng chỉ là bảng nhãn).
- **A — Trợ năng / i18n:**
  - Tương phản (`contrast.mjs`, 20 cặp chữ / nền riêng của gói F): thấp nhất 6,17:1 (`text-fg-3` trên `surface-1`: "—", tiêu đề cột So sánh team); tiêu đề cột N4–N1 / Tạm hoãn / Mất cơ hội của Báo cáo 6,79–9,59:1; dòng nhắc Lọc 9,56:1.
  - Chuỗi cứng: quét văn bản JSX / `aria-label` / `title` / `placeholder` literal trong 14 file TSX của gói F: không có; chỉ còn ký hiệu `▾ ▸` (`aria-hidden`).
  - Bảng: So sánh team có `th scope=row`, nút xổ có `aria-expanded`; Báo cáo hai hàng tiêu đề `scope=colgroup/col`, mốc hôm nay có chữ "(hôm nay)" / "(tới …)" chứ không chỉ vạch màu; ô N4–N1 là nút `aria-pressed`; ô KPI là `section` có tên. Chart chỉ có tên (KNOWN P8). Focus của hộp thoại: CL-D2 / CL-D3. Còn lại → CL-F4.
- **S — An toàn (hẹp):** tên file Excel chỉ `[a-z0-9-_]`, ≤ 120 ký tự, qua lọc Rust (gói C); không đường dẫn nào từ webview. Nội dung Excel: tên team / RE ghi dạng chuỗi (test "never a formula"), số là số. Tooltip chart escape (F-18). Nhập backup: kiểm 100 MB trước khi đọc (e2e FT35 bị bắt), mọi lỗi của file qua `DbError` → hộp 10b, lỗi khác → câu chung. Không `dangerouslySetInnerHTML` / `innerHTML` / `eval` trong gói F.

## 6. Ghi chú cho gói sau (không phải phát hiện gói F)

- **Gói G:** e2e đọc đồng hồ máy (CL-F1) — nên quét cả bộ e2e / unit tìm `new Date()` / `Date.now()` / `getFullYear()` (phiên này chỉ thấy đúng một chỗ trong `e2e/`, và `today.test.ts:12` dùng đồng hồ thật một cách có chủ ý). Bộ chạy mutation TSX trên e2e của gói F (`F\e2e-mut.mjs` + `F\playwright.f.config.ts`) chạy ở cổng 4183, không đụng cổng 4173; dùng lại được.
- **Gói H:** thời gian mở các màn gói F trong exe (§5 P) chủ yếu là CL-B8 (đọc lại toàn bảng) + vòng lặp theo RE (CL-F6); nên đo lại đầu-cuối sau khi sửa từng phần. `countRecords` đọc toàn bảng chỉ để đếm có ở ba chỗ (thẻ "File dữ liệu", hộp nhập backup hai lần — CL-F3, ghi chú gói B / D).

## Phụ lục A — Mutation unit (`mutate-results.json`)

Mỗi lượt phục vụ đúng một file đã đổi qua plugin `load` của Vite (repo không bị ghi), chạy 113 test unit của gói F (`vitest.mut.config.mts`, `--bail=1`). Tổng 94 lượt: {"KILLED":80,"SURVIVED":14} (OV19 lượt đầu sai mẫu chuỗi, chạy lại sau khi sửa → KILLED). Tiền tố (trong `apps/desktop/src/routes/`): OV = `overview/overview-view.ts`, SV = `overview/stage-view.ts`, SC = `overview/stage-chart.ts`, TC = `overview/team-compare-view.ts`, RV = `reports/reports-view.ts`, RW = `reports/report-workbook.ts`, TV = `team/team-view.ts`, AP = `applied-filter.ts`. Chuỗi thay đổi chính xác ở `mutate.mjs` (phụ lục D).

| Mutation | Kết quả | Test bắt được |
|---|---|---|
| OV1 rate text without % | KILLED | overview/team-compare-view.test.ts > teamCompare > adds the teams up in Tổng: Team A 2/3 + Team B 3/2 → 5/5 = 100% (G09–G11) |
| OV2 delta up/down swapped | KILLED | overview/overview-view.test.ts > kpiTiles > matches the worked example of spec §4.2: month to date on 15/01/2027 (G18) |
| OV3 windowText sameYear ignores end | **SURVIVED** |  |
| OV4 windowText day never with year | **SURVIVED** |  |
| OV5 windowText range never with year | KILLED | overview/overview-view.test.ts > kpiTiles > matches the worked example of spec §4.2: month to date on 15/01/2027 (G18) |
| OV6 counted: first day not started | KILLED | overview/team-compare-view.test.ts > teamCompare > counts the first day of the month as that one day |
| OV7 counted: whole period always | KILLED | overview/overview-view.test.ts > kpiTiles > matches the worked example of spec §4.2: month to date on 15/01/2027 (G18) |
| OV8 reason: custom before not-started | KILLED | overview/overview-view.test.ts > kpiTiles > a custom period not started yet says so, not that custom is never compared (mockup 1e) |
| OV9 points not rounded to = | **SURVIVED** |  |
| OV10 previousNoRf when no previous | **SURVIVED** |  |
| OV11 formula swapped | KILLED | overview/overview-view.test.ts > kpiTiles > matches the worked example of spec §4.2: month to date on 15/01/2027 (G18) |
| OV12 metricsScope keeps team | KILLED | overview/overview-view.test.ts > metricsScope > the Team scope of Tổng quan counts every team together |
| OV13 viewing: future month in progress | **SURVIVED** |  |
| OV14 viewing: year is MTD too | **SURVIVED** |  |
| OV15 scopeTeams counts 1 | KILLED | overview/overview-view.test.ts > viewingText ("Đang xem") > names the RE, or counts the teams of the Team scope; an ended year has no range |
| OV16 period name without Tháng | KILLED | overview/overview-view.test.ts > viewingText ("Đang xem") > a month in progress is MTD, with the days counted |
| OV17 noRf note never | KILLED | overview/overview-view.test.ts > kpiTiles > an ended month compares with the whole month before, down and "—" for 0 RF (G16 vs G09) |
| OV18 tiles order caseSize/issued | **SURVIVED** |  |
| OV19 closeRate delta always shown | KILLED | overview/overview-view.test.ts > kpiTiles > matches the worked example of spec §4.2: month to date on 15/01/2027 (G18) |
| SV1 week label day+month | KILLED | overview/stage-view.test.ts > stageBlock — chart of week 11/01 – 17/01 (golden S10–S13) > draws one chart of seven columns, Monday to Sunday |
| SV2 custom month label as day | KILLED | overview/stage-view.test.ts > stageBlock > names a long custom range by its months, a short one by its days |
| SV3 column title end of mark | KILLED | overview/stage-view.test.ts > stageBlock > names a year by its months and a month by its days |
| SV4 today never marked | KILLED | overview/stage-view.test.ts > stageBlock — chart of week 11/01 – 17/01 (golden S10–S13) > marks today and titles each column with the day it was taken |
| SV5 tiles of picked team only | KILLED | overview/stage-view.test.ts > stageBlock > adds every team up in the tiles and draws one chart per team (S03, S08, S09) |
| SV6 one chart for team scope | KILLED | overview/stage-view.test.ts > stageBlock > adds every team up in the tiles and draws one chart per team (S03, S08, S09) |
| SV7 note never "hôm nay" | KILLED | overview/stage-view.test.ts > stageBlock — chart of week 11/01 – 17/01 (golden S10–S13) > shows in the four tiles the last column drawn, taken today |
| SV8 note without team count | KILLED | overview/stage-view.test.ts > stageBlock > adds every team up in the tiles and draws one chart per team (S03, S08, S09) |
| SV9 snapshot day = mark end | KILLED | overview/stage-view.test.ts > stageBlock > names a year by its months and a month by its days |
| SC1 stack not reversed | KILLED | overview/stage-chart.test.ts > stageChartOption > stacks N1 against the axis and N4 on top, a mark after today left empty |
| SC2 label all up to 31 | KILLED | overview/stage-chart.test.ts > stageChartOption > labels a month on its 1st, every 5th, its last day and today, not beside today |
| SC3 beside 2 | KILLED | overview/stage-chart.test.ts > stageChartOption > labels a month on its 1st, every 5th, its last day and today, not beside today |
| SC4 total of all stages | KILLED | overview/stage-chart.test.ts > stageChartOption > adds up only the stages shown |
| SC5 title not escaped | KILLED | overview/stage-chart.test.ts > stageChartOption > shows a team name as text, never as HTML (F-18) |
| SC6 no future outline | KILLED | overview/stage-chart.test.ts > stageChartOption > draws a dashed line on the axis for each mark after today, whatever is hidden (mockup 1a) |
| SC7 tooltip rows bottom first | KILLED | overview/stage-chart.test.ts > stageChartOption > lists N4 to N1 and their total in the tooltip, under the team and the day |
| SC8 today label plain | KILLED | overview/stage-chart.test.ts > stageChartOption > sets the label of the mark holding today in the today style |
| SC9 edges not forced | KILLED | overview/stage-chart.test.ts > stageChartOption > labels a month on its 1st, every 5th, its last day and today, not beside today |
| SC10 team name not in tooltip | KILLED | overview/stage-chart.test.ts > stageChartOption > shows a team name as text, never as HTML (F-18) |
| SC11 palette order not reversed | KILLED | overview/stage-chart.test.ts > stageChartOption > leaves out the stages hidden, keeping the colours of the others |
| TC1 teams unsorted | **SURVIVED** |  |
| TC2 met up to today only | KILLED | overview/team-compare-view.test.ts > teamCompare > counts results up to today (G18), "—" for 0 RF and "0 ₫" for no money |
| TC3 total rate swapped | KILLED | overview/team-compare-view.test.ts > teamCompare > counts results up to today (G18), "—" for 0 RF and "0 ₫" for no money |
| TC4 total metrics before start | KILLED | overview/team-compare-view.test.ts > teamCompare > a period not started yet has "—" for every result |
| TC5 RE are every member | KILLED | overview/team-compare-view.test.ts > teamCompare > lists the RE of each team by name, and they add up to the team row |
| TC6 total caseSize = submitted | KILLED | overview/team-compare-view.test.ts > teamCompare > adds the teams up in Tổng: Team A 2/3 + Team B 3/2 → 5/5 = 100% (G09–G11) |
| TC7 range whole period | KILLED | overview/team-compare-view.test.ts > teamCompare > counts results up to today (G18), "—" for 0 RF and "0 ₫" for no money |
| TC8 cells rate as count | KILLED | overview/team-compare-view.test.ts > teamCompare > adds the teams up in Tổng: Team A 2/3 + Team B 3/2 → 5/5 = 100% (G09–G11) |
| RV1 total rate swapped | KILLED | reports/reports-view.test.ts > reportRows > the Team scope has no Theo team, and Theo RE holds the RE of the team only |
| RV2 total stages from rows | KILLED | reports/reports-view.test.ts > reportRows > a team without RE: Tổng of the empty Theo RE matches Tổng hợp, "—" or 0 |
| RV3 team scope name empty | KILLED | reports/reports-view.test.ts > reportRows > the Team scope has no Theo team, and Theo RE holds the RE of the team only |
| RV4 summaryMeta counts all people | KILLED | reports/reports-view.test.ts > summaryMeta > counts the RE of the scope, or names the team of the RE (mockup 2a, 2d, 2e) |
| RV5 never with year | KILLED | reports/reports-view.test.ts > reportRows Theo mốc > Ngày → 1 mark, Tuần → 7 days, Năm → 12 months; a year in the range shows its year |
| RV6 weekdays on every week | KILLED | reports/reports-view.test.ts > reportRows Theo mốc > Tháng 01/2027 → 5 weeks cut at the month (M01); Tháng 02/2027 → 4 whole weeks (M02) |
| RV7 no "hôm nay" on a day | KILLED | reports/reports-view.test.ts > reportRows Theo mốc > the mark holding today counts up to today; a mark after today has appointments only |
| RV8 until on the last day too | KILLED | reports/reports-view.test.ts > reportRows Theo mốc > Tùy chọn of 55 days → 3 months cut to the range (M03); 16 days → 16 days (M04) |
| RV9 Theo RE ignores team scope | KILLED | reports/reports-view.test.ts > reportRows > the Team scope has no Theo team, and Theo RE holds the RE of the team only |
| RV10 teams unsorted | **SURVIVED** |  |
| RV11 RE scope keeps tables | KILLED | reports/reports-view.test.ts > reportRows > the RE scope has Tổng hợp only |
| RV12 team scope keeps Theo team | KILLED | reports/reports-view.test.ts > reportRows > the Team scope has no Theo team, and Theo RE holds the RE of the team only |
| RV13 row team blank | KILLED | reports/reports-view.test.ts > reportRows > lists every RE by team, then name, with its team; 0 RF shows "—" (G15) |
| RV14 mark results = whole mark | **SURVIVED** |  |
| RV15 mark stages at mark end | **SURVIVED** |  |
| RV16 mark today flag false | KILLED | reports/reports-view.test.ts > reportRows Theo mốc > the mark holding today counts up to today; a mark after today has appointments only |
| RV17 cells: results always — | KILLED | reports/reports-view.test.ts > reportRows > adds the teams up in Tổng: Team A 2/3 + Team B 3/2 → 5/5 = 100% (G09–G11) |
| RV18 summary appts up to today | KILLED | reports/reports-view.test.ts > reportRows Theo mốc > adds up to Tổng hợp: Σ appointments and results; KH of the last mark with numbers |
| RV19 month marks named by weekday from | **SURVIVED** |  |
| RW1 rate without % format | KILLED | reports/report-workbook.test.ts > buildReportWorkbook > keeps real numbers: money in đồng, the close rate as a percentage |
| RW2 rate as percent number | KILLED | reports/report-workbook.test.ts > buildReportWorkbook > keeps real numbers: money in đồng, the close rate as a percentage |
| RW3 no Theo mốc sheet | KILLED | reports/report-workbook.test.ts > buildReportWorkbook > has one sheet per table the scope shows: 4 for Toàn bộ, 3 for a team, 2 for an RE |
| RW4 meta never MTD | KILLED | reports/report-workbook.test.ts > reportWorkbookMeta > gives the period and scope as "Đang xem" does, with the days counted so far |
| RW5 slug keeps marks | KILLED | reports/report-workbook.test.ts > exportReport > writes the workbook under its file name and gives back where it went |
| RW6 slug max 200 | KILLED | reports/report-workbook.test.ts > reportFileName > cuts a long scope to 60 characters, so the exe can always write the file |
| RW7 month stamp full day | KILLED | reports/report-workbook.test.ts > exportReport > writes the workbook under its file name and gives back where it went |
| RW8 frozen 2 rows | **SURVIVED** |  |
| RW9 total not bold | KILLED | reports/report-workbook.test.ts > buildReportWorkbook > heads the columns as the screen does, money in đồng |
| RW10 build failure as write | KILLED | reports/report-workbook.test.ts > exportReport > fails at building when ExcelJS does not load, and writes nothing |
| RW11 failed help folder swapped | KILLED | reports/report-workbook.test.ts > exportFailedHelp > names the exports folder when writing failed in the exe |
| RW12 no trailing dash trim | KILLED | reports/report-workbook.test.ts > reportFileName > keeps only letters and digits of a name, so the file name is always safe |
| RW13 groups merged wrong | KILLED | reports/report-workbook.test.ts > buildReportWorkbook > heads the columns as the screen does, money in đồng |
| RW14 money cells no format | KILLED | reports/report-workbook.test.ts > buildReportWorkbook > keeps real numbers: money in đồng, the close rate as a percentage |
| RW15 total Theo RE name col 1 | KILLED | reports/report-workbook.test.ts > buildReportWorkbook > puts Team before RE on Theo RE |
| RW16 sheet count Theo team always | KILLED | reports/report-workbook.test.ts > buildReportWorkbook > has one sheet per table the scope shows: 4 for Toàn bộ, 3 for a team, 2 for an RE |
| TV1 31 days | KILLED | team/team-view.test.ts > staffMetrics > counts open customers, appointments of the last 30 days and policies issued this year |
| TV2 coordinator not counted | KILLED | team/team-view.test.ts > staffMetrics > counts open customers, appointments of the last 30 days and policies issued this year |
| TV3 open counts closed | KILLED | team/team-view.test.ts > staffMetrics > counts open customers, appointments of the last 30 days and policies issued this year |
| TV4 issued last 30 days | KILLED | team/team-view.test.ts > staffMetrics > counts open customers, appointments of the last 30 days and policies issued this year |
| TV5 lead = last TL | KILLED | team/team-view.test.ts > groupByTeam > gives the TL of each team: the one, none, or the first by name of several |
| TV6 usage no coordinating | KILLED | team/team-view.test.ts > personUsage > counts the records still written for the person, as RE and as coordinator |
| TV7 30 days include tomorrow | KILLED | team/team-view.test.ts > staffMetrics > counts open customers, appointments of the last 30 days and policies issued this year |
| TV8 non-RE gets metrics | KILLED | team/team-view.test.ts > staffMetrics > gives other roles only the appointments they coordinate |
| AP1 period kind ignored | KILLED | applied-filter.test.ts > sameSelection > fails for a custom period of the same days |
| AP2 team id ignored | KILLED | applied-filter.test.ts > sameSelection > fails for another team |
| AP3 Lọc applies nothing | KILLED | applied-filter.test.ts > applied filter (Lọc) > Lọc applies the choice and nothing is waiting any more |
| AP4 end ignored | **SURVIVED** |  |

## Phụ lục B — Mutation TSX và đồng hồ trên e2e (`e2e-mut-results.json`)

Mỗi lượt: build web bằng Vite (cấu hình của repo + plugin `load` đổi đúng một file; `VITE_DEMO_ANCHOR=15/09/2026` như e2e) ra `F\dist-mut`, phục vụ ở cổng **4183**, chạy các spec liên quan bằng `playwright.f.config.ts` (Edge, 4 worker, output `F\pw-out`). Chỉ chạy spec liên quan đến màn bị đổi. Lượt nền (không đổi gì, 55 test của 7 spec) xanh trước. `YEAR0` / `YEAR1`: bản build không đổi, một test, đồng hồ thật / đồng hồ Node dời sang 05/01/2027 (`fake-year.cjs`).

| Lượt | Spec chạy | Kết quả | Test đỏ đầu tiên |
|---|---|---|---|
| BASE no mutation | overview, chart, reports, team, backup, demo-data, period-picker | GREEN (55 passed (1.8m)) |  |
| YEAR0 member columns, real clock | team | GREEN (1 passed (5.5s)) |  |
| YEAR1 member columns, Node clock 05/01/2027 | team | RED (1 failed) | e2e\team.spec.ts:301:1 › member columns: an RE open customers match the Customers screen |
| FT1 tile counts the picked team only | overview, chart | **SURVIVED** (12 passed (21.3s)) |  |
| FT2 compare shown for an RE | overview, chart | KILLED (1 failed, 11 passed (36.9s)) | e2e\overview.spec.ts:144:1 › So sánh team: a team opens its RE by name, closes again, and the RE scope has no table |
| FT3 no pending reminder | overview, chart, reports, period-picker | KILLED (6 failed, 25 passed (1.3m)) | e2e\overview.spec.ts:37:1 › a new period waits for Lọc, then "Đang xem" changes |
| FT4 viewing without range | overview, chart, reports | KILLED (3 failed, 17 passed (47.1s)) | e2e\overview.spec.ts:17:1 › opens on the current month to date with the appointments tile and six KPI |
| FT5 empty bar never says so | overview, chart | KILLED (1 failed, 11 passed (36.3s)) | e2e\overview.spec.ts:79:1 › a period without appointments shows "0 / 0" and "chưa có lịch" in the bar |
| FT6 group counts all = met | overview, chart | **SURVIVED** (12 passed (20.3s)) |  |
| FT7 close rate formula hidden | overview, chart | **SURVIVED** (12 passed (21.1s)) |  |
| FT8 ▲ red, ▼ green | overview, chart | **SURVIVED** (12 passed (20.8s)) |  |
| FT9 hidden stage still drawn | overview, chart | **SURVIVED** (12 passed (21.0s)) |  |
| FT10 team chart heading without last column | overview, chart | **SURVIVED** (12 passed (21.7s)) |  |
| FT11 tiles 0 before start | overview, chart | KILLED (1 failed, 11 passed (35.4s)) | e2e\overview.spec.ts:125:1 › a period not started yet has "—" in the tiles and says so over the chart |
| FT12 no "not started" over chart | overview, chart | KILLED (1 failed, 11 passed (41.2s)) | e2e\overview.spec.ts:125:1 › a period not started yet has "—" in the tiles and says so over the chart |
| FT13 RE rows always open | overview, chart | KILLED (1 failed, 11 passed (41.5s)) | e2e\overview.spec.ts:144:1 › So sánh team: a team opens its RE by name, closes again, and the RE scope has no table |
| FT15 export the chosen, not applied, period | reports | **SURVIVED** (8 passed (19.1s)) |  |
| FT16 summary meta empty | reports | KILLED (1 failed, 7 passed (22.8s)) | e2e\reports.spec.ts:18:1 › Toàn bộ: Tổng hợp over Theo team, and Theo RE can be chosen |
| FT18 no today bar | reports | **SURVIVED** (8 passed (14.3s)) |  |
| FT19 no rule between teams | reports | **SURVIVED** (8 passed (16.2s)) |  |
| FT20 "—" not dimmed | reports | **SURVIVED** (8 passed (16.8s)) |  |
| FT21 notice by identity | reports | KILLED (1 failed, 7 passed (31.2s)) | e2e\reports.spec.ts:180:1 › the export line stays when Lọc applies the same period and scope again |
| FT23 summary RE = TL count | team | KILLED (2 failed, 13 passed (32.8s)) | e2e\team.spec.ts:25:1 › lists the seeded teams, their members and the shared support staff |
| FT24 issued column shows open | team | **SURVIVED** (15 passed (28.7s)) |  |
| FT25 30-day column shows issued | team | **SURVIVED** (15 passed (29.8s)) |  |
| FT26 new team not selected | team | KILLED (3 failed, 12 passed (60.0s)) | e2e\team.spec.ts:59:1 › a team without a TL offers "+ Thêm TL", which opens the dialog on TL and that team |
| FT28 IS keeps the team | team | KILLED (3 failed, 12 passed (35.4s)) | e2e\team.spec.ts:189:1 › refuses an RE without a team, with the reason on the field |
| FT29 team errors on the form | team | KILLED (2 failed, 13 passed (34.1s)) | e2e\team.spec.ts:189:1 › refuses an RE without a team, with the reason on the field |
| FT30 delete allowed while in use | team | KILLED (1 failed, 14 passed (38.6s)) | e2e\team.spec.ts:276:1 › refuses to delete an RE who still has records, and says how many (9b) |
| FT31 coordinating not listed | team | **SURVIVED** (15 passed (24.5s)) |  |
| FT32 taken name without the name | team | KILLED (1 failed, 14 passed (28.7s)) | e2e\team.spec.ts:115:1 › refuses a team name already taken, with the reason on the field |
| FT33 reload without the word | backup, demo-data | KILLED (1 failed, 8 passed (32.9s)) | e2e\demo-data.spec.ts:6:1 › Settings reloads the simulated data after typing the confirmation word |
| FT35 no size check | backup, demo-data | KILLED (1 failed, 8 passed (31.9s)) | e2e\backup.spec.ts:139:1 › refuses a file over 100 MB without reading it |
| FT36 current counts = file counts | backup, demo-data | KILLED (1 failed, 8 passed (26.7s)) | e2e\backup.spec.ts:22:1 › exports, then imports the file back after confirming: later changes are gone |
| FT37 SCHEMA_TOO_NEW as invalid (KNOWN #185) | backup, demo-data | **SURVIVED** (9 passed (21.8s)) |  |
| FT38 counts customers ↔ appointments | backup, demo-data | KILLED (2 failed, 7 passed (26.3s)) | e2e\backup.spec.ts:58:1 › the data file card shows what the simulated data holds, and that web mode keeps no file |
| U1 OV4 day window never with year | overview, chart | **SURVIVED** (12 passed (18.9s)) |  |
| U2 OV9 points not rounded to = | overview, chart | **SURVIVED** (12 passed (19.1s)) |  |
| U3 OV10 previousNoRf when no previous | overview, chart | **SURVIVED** (12 passed (19.4s)) |  |
| U4 OV13 viewing: future month in progress | overview, chart | KILLED (1 failed, 11 passed (33.6s)) | e2e\overview.spec.ts:125:1 › a period not started yet has "—" in the tiles and says so over the chart |
| U5 OV14 viewing: year is MTD too | overview, chart | KILLED (1 failed, 11 passed (27.2s)) | e2e\overview.spec.ts:37:1 › a new period waits for Lọc, then "Đang xem" changes |
| U6 OV18 tiles order caseSize/issued | overview, chart | **SURVIVED** (12 passed (18.8s)) |  |
| U7 TC1 compare teams unsorted | overview, chart | **SURVIVED** (12 passed (19.1s)) |  |
| U8 AP4 custom end ignored by Lọc | overview, chart, reports, period-picker | **SURVIVED** (31 passed (49.9s)) |  |

## Phụ lục C — Kết quả probe

Số trong file là lượt chạy cuối (máy rảnh, sau lượt e2e). `perf-team-write` là lượt **không gắn debugger** (`run-detached.ps1`); lượt gắn debugger trước đó (lúc lượt e2e đang chạy song song) ra 525–808 ms, không dùng.

### `probe-consistency.result.json`

```json
{
 "checks": 588,
 "mismatches": [],
 "teamScreen": []
}
```

### `probe-excel.result.json`

```json
{
 "cells": 5746,
 "mismatches": [],
 "sheetsSeen": {
  "month/all": [
   "Tổng hợp",
   "Theo team",
   "Theo RE",
   "Theo mốc"
  ],
  "month/team": [
   "Tổng hợp",
   "Theo RE",
   "Theo mốc"
  ],
  "month/re": [
   "Tổng hợp",
   "Theo mốc"
  ],
  "year/all": [
   "Tổng hợp",
   "Theo team",
   "Theo RE",
   "Theo mốc"
  ],
  "year/team": [
   "Tổng hợp",
   "Theo RE",
   "Theo mốc"
  ],
  "year/re": [
   "Tổng hợp",
   "Theo mốc"
  ],
  "customAcrossYear/all": [
   "Tổng hợp",
   "Theo team",
   "Theo RE",
   "Theo mốc"
  ],
  "customAcrossYear/team": [
   "Tổng hợp",
   "Theo RE",
   "Theo mốc"
  ],
  "customAcrossYear/re": [
   "Tổng hợp",
   "Theo mốc"
  ],
  "future/all": [
   "Tổng hợp",
   "Theo team",
   "Theo RE",
   "Theo mốc"
  ],
  "future/team": [
   "Tổng hợp",
   "Theo RE",
   "Theo mốc"
  ],
  "future/re": [
   "Tổng hợp",
   "Theo mốc"
  ]
 },
 "names": [
  "bao-cao_2026-10_toan-bo_2026-10-05.xlsx",
  "bao-cao_2025-11-20-den-2026-02-19_team-dong-a_2026-10-05.xlsx",
  "bao-cao_2026-10_re_2026-10-05.xlsx",
  "bao-cao_2026-10_re-nguyen-van-nguyen-van-nguyen-van-nguyen-van-nguyen-van-ng_2026-10-05.xlsx",
  "bao-cao_2026-10_team_2026-10-05.xlsx",
  "bao-cao_2026-10_team_2026-10-05.xlsx"
 ],
 "safe": true
}
```

### `probe-edges.result.json`

```json
{
 "kpi": [
  {
   "name": "Ngày 01/01/2026",
   "rfNote": "so với 31/12/2025",
   "closeRate": "100% · ▼ 100 điểm % · so với 31/12/2025",
   "viewing": {
    "period": "01/01/2026",
    "mtd": false,
    "range": null,
    "scope": "Toàn bộ"
   },
   "compareRange": "01/01/2026"
  },
  {
   "name": "Ngày 01/01/2026 seen later",
   "rfNote": "so với 31/12/2025",
   "closeRate": "100% · ▼ 100 điểm % · so với 31/12/2025",
   "viewing": {
    "period": "01/01/2026",
    "mtd": false,
    "range": null,
    "scope": "Toàn bộ"
   },
   "compareRange": "01/01/2026"
  },
  {
   "name": "Tháng 01/2026 on 01/01",
   "rfNote": "so với 01/12/2025",
   "closeRate": "100% · ▼ 300 điểm % · so với 01/12/2025",
   "viewing": {
    "period": "Tháng 01/2026",
    "mtd": true,
    "range": "01/01/2026",
    "scope": "Toàn bộ"
   },
   "compareRange": "01/01/2026"
  },
  {
   "name": "Tuần 29/12/2025–04/01/2026 on 01/01",
   "rfNote": "so với 22/12 – 25/12",
   "closeRate": "237,5% · ▼ 12,5 điểm % · so với 22/12 – 25/12",
   "viewing": {
    "period": "29/12/2025 – 04/01/2026",
    "mtd": false,
    "range": null,
    "scope": "Toàn bộ"
   },
   "compareRange": "29/12/2025 – 01/01/2026"
  },
  {
   "name": "Tuần 05/01–11/01/2026 on 05/01",
   "rfNote": "so với 29/12/2025",
   "closeRate": "166,7% · ▼ 83,3 điểm % · so với 29/12/2025",
   "viewing": {
    "period": "05/01 – 11/01/2026",
    "mtd": false,
    "range": null,
    "scope": "Toàn bộ"
   },
   "compareRange": "05/01/2026"
  },
  {
   "name": "Năm 2026 on 01/01",
   "rfNote": "so với 01/01/2025",
   "closeRate": "100% ·  · — kỳ trước 0 RF, không so",
   "viewing": {
    "period": "Năm 2026",
    "mtd": false,
    "range": "01/01/2026",
    "scope": "Toàn bộ"
   },
   "compareRange": "01/01/2026"
  },
  {
   "name": "Tùy chọn 20/11/2025–19/02/2026",
   "rfNote": "Kỳ Tùy chọn không so với kỳ trước",
   "closeRate": "248,4% ·  · Kỳ Tùy chọn không so với kỳ trước",
   "viewing": {
    "period": "20/11/2025 – 19/02/2026",
    "mtd": false,
    "range": null,
    "scope": "Toàn bộ"
   },
   "compareRange": "20/11/2025 – 19/02/2026"
  }
 ],
 "marksAcrossYear": [
  "20–30/11/2025",
  "01–31/12/2025",
  "01–31/01/2026",
  "01–19/02/2026"
 ],
 "marksShortAcrossYear": [
  "T5 25/12/2025",
  "T6 26/12/2025",
  "T7 27/12/2025",
  "CN 28/12/2025",
  "T2 29/12/2025",
  "T3 30/12/2025",
  "T4 31/12/2025",
  "T5 01/01/2026",
  "T6 02/01/2026",
  "T7 03/01/2026",
  "CN 04/01/2026",
  "T2 05/01/2026"
 ],
 "chartLabelsLong": [
  "07/2026 [31/07/2026 · cuối ngày]",
  "08/2026 [31/08/2026 · cuối ngày]",
  "09/2026 [30/09/2026 · cuối ngày]",
  "10/2026 [05/10/2026 · cuối ngày]"
 ],
 "monthToCustomPending": true,
 "orders": {
  "teamScreenList": [
   "Bình Minh",
   "Hừng Đông",
   "Rạng Đông",
   "Sao Mai",
   "an Phú",
   "Ánh Dương",
   "Đông Á"
  ],
  "overviewTeamCharts": [
   "Bình Minh",
   "Hừng Đông",
   "Rạng Đông",
   "Sao Mai",
   "an Phú",
   "Ánh Dương",
   "Đông Á"
  ],
  "overviewCompare": [
   "an Phú",
   "Ánh Dương",
   "Bình Minh",
   "Đông Á",
   "Hừng Đông",
   "Rạng Đông",
   "Sao Mai"
  ],
  "reportsByTeam": [
   "an Phú",
   "Ánh Dương",
   "Bình Minh",
   "Đông Á",
   "Hừng Đông",
   "Rạng Đông",
   "Sao Mai"
  ]
 }
}
```

### `probe-perf.result.json`

```json
{
 "readAll": 153.71,
 "readTeams": 138.56,
 "countRecords": 127.48,
 "overview": {
  "month": {
   "appointmentCounts": 1,
   "kpiTiles": 2.78,
   "stageBlockAll": 4.71,
   "stageBlockTeam": 4.92,
   "teamCompare": 36.41,
   "chartOption": 4.35
  },
  "year": {
   "appointmentCounts": 1.33,
   "kpiTiles": 4.35,
   "stageBlockAll": 4.61,
   "stageBlockTeam": 4.75,
   "teamCompare": 35.88,
   "chartOption": 4.4
  },
  "custom92": {
   "appointmentCounts": 0.84,
   "kpiTiles": 1.41,
   "stageBlockAll": 3.42,
   "stageBlockTeam": 3.86,
   "teamCompare": 26.91,
   "chartOption": 3.05
  },
  "yearPast": {
   "appointmentCounts": 0.96,
   "kpiTiles": 3.15,
   "stageBlockAll": 3.18,
   "stageBlockTeam": 3.4,
   "teamCompare": 28.31,
   "chartOption": 3.43
  }
 },
 "reports": {
  "month": {
   "all": 39.17,
   "team": 11.13,
   "re": 1.93,
   "cells": 36.05
  },
  "year": {
   "all": 40.45,
   "team": 10.25,
   "re": 1.92,
   "cells": 41.49
  },
  "custom92": {
   "all": 37.58,
   "team": 9.86,
   "re": 1.67,
   "cells": 39.22
  },
  "yearPast": {
   "all": 40.22,
   "team": 9.99,
   "re": 1.63,
   "cells": 38.89
  }
 },
 "stageSnapshotSeriesBuild": 0.63,
 "team": {
  "groupByTeam": 0.01,
  "staffMetrics": 13.45,
  "staffMetricsReOnly": 10.07
 },
 "workbookFirstMs": 491,
 "workbookMedianMs": 12,
 "workbookBytes": 16357
}
```

### `probe-byre.result.json`

```json
{
 "month": {
  "teamCompareMs": 28.18,
  "groupedOnceMs": 3.31,
  "sameFigures": true
 },
 "year": {
  "teamCompareMs": 27.96,
  "groupedOnceMs": 4.18,
  "sameFigures": true
 }
}
```

### `probe-count.result.json`

```json
{
 "viaList": {
  "teams": 4,
  "people": 51,
  "customers": 1496,
  "appointments": 10434,
  "policies": 1804
 },
 "viaCount": {
  "teams": 4,
  "people": 51,
  "customers": 1496,
  "appointments": 10434,
  "policies": 1804
 },
 "countRecordsMs": 109.96,
 "countSqlMs": 5.66
}
```

### `perf-screens.result.json`

```json
{
 "counts": {
  "overview": {
   "dom": 301,
   "charts": 1
  },
  "reports": {
   "dom": 260,
   "charts": 0
  },
  "team": {
   "dom": 229,
   "charts": 0
  },
  "settings": {
   "dom": 101,
   "charts": 0
  }
 },
 "overview": [
  {
   "syncMs": 0,
   "toFrameMs": 221
  },
  {
   "syncMs": 1,
   "toFrameMs": 158
  },
  {
   "syncMs": 1,
   "toFrameMs": 154
  }
 ],
 "reports": [
  {
   "syncMs": 1,
   "toFrameMs": 147
  },
  {
   "syncMs": 1,
   "toFrameMs": 145
  },
  {
   "syncMs": 1,
   "toFrameMs": 143
  }
 ],
 "team": [
  {
   "syncMs": 1,
   "toFrameMs": 111
  },
  {
   "syncMs": 1,
   "toFrameMs": 112
  },
  {
   "syncMs": 1,
   "toFrameMs": 110
  }
 ],
 "settings": [
  {
   "syncMs": 1,
   "toFrameMs": 98
  },
  {
   "syncMs": 1,
   "toFrameMs": 98
  },
  {
   "syncMs": 1,
   "toFrameMs": 105
  }
 ],
 "overviewFilter Toàn bộ": [
  {
   "kind": "Năm",
   "syncMs": 1,
   "toFrameMs": 38
  },
  {
   "kind": "Tháng",
   "syncMs": 0,
   "toFrameMs": 28
  },
  {
   "kind": "Năm",
   "syncMs": 0,
   "toFrameMs": 34
  },
  {
   "kind": "Tháng",
   "syncMs": 0,
   "toFrameMs": 32
  }
 ],
 "overviewFilter Team": [
  {
   "kind": "Năm",
   "syncMs": 0,
   "toFrameMs": 49
  },
  {
   "kind": "Tháng",
   "syncMs": 0,
   "toFrameMs": 44
  },
  {
   "kind": "Năm",
   "syncMs": 0,
   "toFrameMs": 48
  },
  {
   "kind": "Tháng",
   "syncMs": 0,
   "toFrameMs": 46
  }
 ],
 "reportsFilter": [
  {
   "kind": "Năm",
   "syncMs": 1,
   "toFrameMs": 32
  },
  {
   "kind": "Tháng",
   "syncMs": 0,
   "toFrameMs": 28
  },
  {
   "kind": "Năm",
   "syncMs": 0,
   "toFrameMs": 30
  },
  {
   "kind": "Tháng",
   "syncMs": 0,
   "toFrameMs": 30
  }
 ],
 "reportsTables": [
  {
   "name": "Theo RE",
   "syncMs": 0,
   "toFrameMs": 17
  },
  {
   "name": "Theo mốc",
   "syncMs": 1,
   "toFrameMs": 8
  },
  {
   "name": "Theo team",
   "syncMs": 0,
   "toFrameMs": 3
  }
 ]
}
```

### `perf-export.result.json`

```json
{
 "reminder": {
  "text": "Đã đổi kỳ / góc nhìn — bấm Lọc để cập nhật",
  "role": null,
  "ariaLive": null,
  "filterDescribedBy": null,
  "filterLabel": null,
  "filterText": "Lọc"
 },
 "exports": [
  {
   "toNoticeMs": 205,
   "longestTaskMs": 136,
   "notice": "Đã xuất báo cáo · 4 sheet: C:\\workspace\\deep-review-1-4\\claude\\F\\exe\\Project2C-data\\exports\\bao-cao_2026_toan-bo_2026-10-05.xlsx"
  },
  {
   "toNoticeMs": 28,
   "longestTaskMs": 0,
   "notice": "Đã xuất báo cáo · 4 sheet: C:\\workspace\\deep-review-1-4\\claude\\F\\exe\\Project2C-data\\exports\\bao-cao_2026_toan-bo_2026-10-05-2.xlsx"
  },
  {
   "toNoticeMs": 31,
   "longestTaskMs": 0,
   "notice": "Đã xuất báo cáo · 4 sheet: C:\\workspace\\deep-review-1-4\\claude\\F\\exe\\Project2C-data\\exports\\bao-cao_2026_toan-bo_2026-10-05-3.xlsx"
  }
 ]
}
```

### `perf-team-write.result.json`

```json
planted
{
 "state": "done",
 "result": {
  "team": "Bình Minh",
  "renameMs": [
   251,
   224,
   196,
   149,
   170,
   163
  ]
 }
}
```

### `contrast.result.txt`

```
6.96  Báo cáo: tiêu đề cột N4 (text-n4) on surface-1
 7.41  Báo cáo: tiêu đề cột N3 (text-n3) on surface-1
 7.61  Báo cáo: tiêu đề cột N2 (text-n2) on surface-1
 9.59  Báo cáo: tiêu đề cột N1 (text-n1) on surface-1
 8.54  Báo cáo: tiêu đề cột Tạm hoãn (text-on-hold) on surface-1
 6.79  Báo cáo: tiêu đề cột Mất cơ hội (text-lost) on surface-1
 8.35  Báo cáo: "Chưa ghi kết quả" (text-appt-unrecorded) on surface-1
 6.17  Báo cáo / Tổng quan: "—" dimmed (text-fg-3) on surface-1
 9.56  Thanh Lọc: dòng nhắc (text-accent) on bg-0
  6.6  Thanh Lọc: "Đang xem" (text-fg-3) on bg-0
10.26  Xuất Excel / backup: dòng đã xuất (text-ok) on bg-0
 9.59  Ô KPI: ▲ (text-ok) on surface-1
 6.79  Ô KPI: ▼ (text-danger) on surface-1
 8.94  Tiêu đề thẻ (text-heading = accent) on surface-1
 9.61  So sánh team: hàng RE (text-fg-2) on surface-0
 6.17  So sánh team: tiêu đề cột (text-fg-3) on surface-1
 6.17  Ô N4–N1: "đang ẩn" (text-fg-3) on surface-1
13.79  Ô N4–N1: số (text-fg) on surface-2
 11.6  Team: team đang chọn (text-fg) on accent-soft
 8.94  Team: link Sửa (text-accent) on surface-1
 7.41  Cài đặt: chấm web (bg-info) — không phải chữ, bỏ qua
```

### `exports.result.json`

```json
[
 {
  "file": "routes/applied-filter.ts",
  "name": "FilterState",
  "ownFileUses": 6,
  "tests": []
 },
 {
  "file": "routes/FilterBar.tsx",
  "name": "AppliedFilter",
  "ownFileUses": 2,
  "tests": []
 },
 {
  "file": "routes/overview/overview-view.ts",
  "name": "KpiKey",
  "ownFileUses": 3,
  "tests": []
 },
 {
  "file": "routes/overview/overview-view.ts",
  "name": "KpiDelta",
  "ownFileUses": 3,
  "tests": []
 },
 {
  "file": "routes/overview/stage-view.ts",
  "name": "StageValues",
  "ownFileUses": 4,
  "tests": []
 },
 {
  "file": "routes/overview/stage-view.ts",
  "name": "StageData",
  "ownFileUses": 1,
  "tests": [
   "stage-view.test.ts"
  ]
 },
 {
  "file": "routes/overview/stage-view.ts",
  "name": "StageColumn",
  "ownFileUses": 1,
  "tests": []
 },
 {
  "file": "routes/overview/team-compare-view.ts",
  "name": "TeamCompareData",
  "ownFileUses": 1,
  "tests": []
 },
 {
  "file": "routes/overview/team-compare-view.ts",
  "name": "CompareTeam",
  "ownFileUses": 2,
  "tests": []
 },
 {
  "file": "routes/reports/report-workbook.ts",
  "name": "ReportWorkbookMeta",
  "ownFileUses": 3,
  "tests": [
   "report-workbook.test.ts"
  ]
 },
 {
  "file": "routes/reports/report-workbook.ts",
  "name": "reportWorkbookMeta",
  "ownFileUses": 1,
  "tests": [
   "report-workbook.test.ts"
  ]
 },
 {
  "file": "routes/reports/report-workbook.ts",
  "name": "ExportOutcome",
  "ownFileUses": 1,
  "tests": []
 },
 {
  "file": "routes/reports/report-workbook.ts",
  "name": "reportFileName",
  "ownFileUses": 1,
  "tests": [
   "report-workbook.test.ts"
  ]
 },
 {
  "file": "routes/reports/ReportExport.tsx",
  "name": "ExportNotice",
  "ownFileUses": 3,
  "tests": []
 },
 {
  "file": "routes/reports/reports-view.ts",
  "name": "ReportData",
  "ownFileUses": 1,
  "tests": [
   "reports-view.test.ts"
  ]
 },
 {
  "file": "routes/reports/reports-view.ts",
  "name": "markName",
  "ownFileUses": 1,
  "tests": []
 },
 {
  "file": "routes/team/team-view.ts",
  "name": "TeamView",
  "ownFileUses": 1,
  "tests": []
 },
 {
  "file": "routes/team/team-view.ts",
  "name": "StaffRecords",
  "ownFileUses": 2,
  "tests": []
 }
]
```

## Phụ lục D — Nguồn test tạm / probe

Tất cả nằm ở `C:\workspace\deep-review-1-4\claude\F\`; `node_modules` là junction tới `node_modules` của worktree review. Cách chạy: PowerShell, trong thư mục `F\`, `node node_modules/vitest/vitest.mjs run --config vitest.probe.config.mts <probe>`; `node mutate.mjs`; `node e2e-mut.mjs BASE` rồi `node e2e-mut.mjs`; exe chép ở `F\exe` chạy với `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9335`, rồi `node cdp.mjs eval <file.js>` hoặc `.\run-detached.ps1 <file.js>`.

### `vitest.probe.config.mts`

```ts
// Runs the gói F probes (probe-*.test.ts) against the review worktree, read-only.
// Usage (PowerShell, from this folder):
//   node node_modules/vitest/vitest.mjs run --config vitest.probe.config.mts [file filter]
// MUT (JSON {file, from, to}) serves ONE repo file mutated, as in vitest.mut.config.mts.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repo = 'C:/workspace/Project-2C-review';
const here = 'C:/workspace/deep-review-1-4/claude/F';
const mut = process.env.MUT ? JSON.parse(process.env.MUT) : null;
const target = mut ? resolve(repo, mut.file).replaceAll('\\', '/').toLowerCase() : null;

export default {
  root: here,
  cacheDir: `${here}/.vite-probe`,
  resolve: {
    alias: [
      { find: /^@p2c\/domain$/, replacement: `${repo}/packages/domain/src/index.ts` },
      { find: /^@p2c\/db$/, replacement: `${repo}/packages/db/src/index.ts` },
      { find: /^@p2c\/ui$/, replacement: `${repo}/packages/ui/src/index.ts` },
      { find: /^#app\/(.*)$/, replacement: `${repo}/apps/desktop/src/$1` },
      { find: /^drizzle-orm$/, replacement: `${repo}/packages/db/node_modules/drizzle-orm/index.js` },
      { find: /^exceljs$/, replacement: `${repo}/apps/desktop/node_modules/exceljs` },
    ],
  },
  server: { fs: { allow: [repo, here, 'C:/workspace/deep-review-1-4/common'] } },
  plugins: [
    {
      name: 'p2c-mutate',
      enforce: 'pre' as const,
      load(id: string) {
        if (!mut) return null;
        const clean = id.split('?')[0]!.replaceAll('\\', '/').toLowerCase();
        if (clean !== target) return null;
        const source = readFileSync(resolve(repo, mut.file), 'utf8').replaceAll('\r\n', '\n');
        return source.replace(mut.from, mut.to);
      },
    },
  ],
  test: {
    include: ['probe-*.test.ts'],
    globals: true,
    testTimeout: 900_000,
    fileParallelism: false,
  },
};
```

### `vitest.mut.config.mts`

```ts
// Gói F "phá code" probe: runs the F-scope unit tests of the review worktree with ONE file served
// mutated (from the MUT env var: {file, from, to}); the repo is only read, never written.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = 'C:/workspace/Project-2C-review';
const mut = process.env.MUT ? JSON.parse(process.env.MUT) : null;
const target = mut ? resolve(ROOT, mut.file).replaceAll('\\', '/').toLowerCase() : null;

export default {
  root: ROOT,
  cacheDir: 'C:/workspace/deep-review-1-4/claude/F/.vite-mut',
  plugins: [
    {
      name: 'p2c-mutate',
      enforce: 'pre' as const,
      load(id: string) {
        if (!mut) return null;
        const clean = id.split('?')[0]!.replaceAll('\\', '/').toLowerCase();
        if (clean !== target) return null;
        const source = readFileSync(resolve(ROOT, mut.file), 'utf8').replaceAll('\r\n', '\n');
        const count = source.split(mut.from).length - 1;
        if (count !== 1) throw new Error(`mutation "${mut.from}" found ${count} times in ${mut.file}`);
        return source.replace(mut.from, mut.to);
      },
    },
  ],
  test: {
    include: [
      'apps/desktop/src/routes/overview/**/*.test.ts',
      'apps/desktop/src/routes/reports/**/*.test.ts',
      'apps/desktop/src/routes/team/**/*.test.ts',
      'apps/desktop/src/routes/applied-filter.test.ts',
    ],
  },
};
```

### `probe-load.ts`

```ts
// Shared by the gói F probes: the load data (common/load/load-backup.json) read through the app's
// own list* commands, as the screens read it, and small timing / result helpers.
import { readFileSync, writeFileSync } from 'node:fs';
import {
  importBackup,
  listAppointments,
  listCustomers,
  listPeople,
  listPolicies,
  listStageTransitions,
  listTeams,
  type Database,
} from '@p2c/db';

export const LOAD = 'C:/workspace/deep-review-1-4/common/load/load-backup.json';
/** The load data is anchored on 05/10/2026 (load-summary.json); the clock of the probes too. */
export const NOW = () => new Date(Date.UTC(2026, 9, 5, 9, 0, 0));
export const TODAY = { year: 2026, month: 10, day: 5 } as const;

export async function loadDb(now: () => Date = NOW): Promise<Database> {
  const { db } = await importBackup(readFileSync(LOAD, 'utf8'), { now });
  return db;
}

/** What Overview.tsx `readOverview` and ReportsScreen.tsx `readReports` read (identical). */
export function readAll(db: Database) {
  return {
    appointments: listAppointments(db),
    customers: listCustomers(db),
    people: listPeople(db),
    teams: listTeams(db),
    policies: listPolicies(db),
    transitions: listStageTransitions(db),
  };
}

/** Median of `runs` runs after one warm-up, in ms with two decimals. */
export function median(fn: () => unknown, runs = 9): number {
  fn();
  const times: number[] = [];
  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  return Math.round(times[Math.floor(runs / 2)]! * 100) / 100;
}

export function save(name: string, result: unknown): void {
  writeFileSync(
    `C:/workspace/deep-review-1-4/claude/F/${name}.result.json`,
    JSON.stringify(result, null, 1),
  );
}
```

### `probe-consistency.test.ts`

```ts
// Probe gói F, trục C: do the numbers of Tổng quan, So sánh team, Báo cáo (every table), the Excel
// sheets and Team & nhân sự agree with one another on the load data, for many periods and scopes?
import {
  addDays,
  appointmentCounts,
  customPeriod,
  periodMetrics,
  periodOf,
  type Period,
  type Scope,
} from '@p2c/domain';
import { kpiTiles, metricsScope } from '#app/routes/overview/overview-view';
import { stageBlock } from '#app/routes/overview/stage-view';
import { teamCompare } from '#app/routes/overview/team-compare-view';
import { reportRows } from '#app/routes/reports/reports-view';
import { staffMetrics } from '#app/routes/team/team-view';
import { loadDb, readAll, save, TODAY } from './probe-load';

const KEYS = ['rfCount', 'submittedCount', 'caseSize', 'issuedCount', 'revenue'] as const;
const STAGES = ['N4', 'N3', 'N2', 'N1', 'ON_HOLD', 'LOST'] as const;

it('agrees across screens on the load data', async () => {
  const db = await loadDb();
  const data = readAll(db);
  const today = TODAY;
  const periods: Record<string, Period> = {
    monthNow: periodOf('month', today),
    monthPast: periodOf('month', { year: 2026, month: 2, day: 1 }),
    yearNow: periodOf('year', today),
    yearPast: periodOf('year', { year: 2025, month: 1, day: 1 }),
    weekNow: periodOf('week', today),
    dayNow: periodOf('day', today),
    dayPast: periodOf('day', addDays(today, -40)),
    customAcrossYear: customPeriod({ year: 2025, month: 11, day: 20 }, { year: 2026, month: 2, day: 19 }),
    customRunning: customPeriod({ year: 2026, month: 8, day: 10 }, { year: 2026, month: 11, day: 9 }),
    monthFuture: periodOf('month', { year: 2026, month: 12, day: 1 }),
  };
  const mismatches: string[] = [];
  // Key order differs between the sums and the domain objects; compare sorted.
  const stable = (value: unknown): string =>
    JSON.stringify(value, (_key, v) =>
      v && typeof v === 'object' && !Array.isArray(v)
        ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)))
        : v,
    );
  const check = (what: string, a: unknown, b: unknown) => {
    if (stable(a) !== stable(b)) mismatches.push(`${what}: ${stable(a)} ≠ ${stable(b)}`);
  };
  const scopes: Scope[] = [
    { kind: 'all' },
    ...data.teams.map((team): Scope => ({ kind: 'team', teamId: team.id })),
    ...data.people.filter((p) => p.role === 'RE').slice(0, 5).map((re): Scope => ({ kind: 're', reId: re.id })),
  ];
  let checks = 0;
  for (const [name, period] of Object.entries(periods)) {
    const all: Scope = { kind: 'all' };
    const report = reportRows(data, period, all, today);
    const compare = teamCompare(data, period, today);
    const tiles = kpiTiles(data, period, all, today);
    const block = stageBlock(data, period, all, today);
    const counts = appointmentCounts(data.appointments, period, all, data.people, today);
    // Tổng quan appointments tile = Báo cáo Tổng hợp appointments.
    check(`${name} tile vs summary appointments`, counts, report.summary.appointments);
    // So sánh team Tổng = Báo cáo Tổng hợp results and Đã gặp.
    check(`${name} compare total met vs summary`, compare.total.met, report.summary.appointments.met);
    check(`${name} compare total metrics vs summary`, compare.total.metrics, report.summary.metrics);
    // Σ Theo team = Σ Theo RE = Tổng hợp.
    check(`${name} byTeam total vs summary`, report.byTeam!.total.metrics, report.summary.metrics);
    check(`${name} byRe total vs summary`, report.byRe!.total.metrics, report.summary.metrics);
    check(`${name} byTeam appts vs summary`, report.byTeam!.total.appointments, report.summary.appointments);
    check(`${name} byRe appts vs summary`, report.byRe!.total.appointments, report.summary.appointments);
    check(`${name} byTeam stages vs summary`, report.byTeam!.total.stages, report.summary.stages);
    check(`${name} byRe stages vs summary`, report.byRe!.total.stages, report.summary.stages);
    // Theo mốc adds up to Tổng hợp (appointments and results; stages are a snapshot: last mark).
    const markAppts = Object.fromEntries(
      ['met', 'missed', 'unrecorded', 'planned', 'total'].map((k) => [
        k,
        report.byMark.reduce((s, r) => s + r.appointments[k as 'met'], 0),
      ]),
    );
    check(`${name} Σ byMark appts vs summary`, markAppts, report.summary.appointments);
    const markMetrics = report.summary.metrics
      ? Object.fromEntries(KEYS.map((k) => [k, report.byMark.reduce((s, r) => s + (r.metrics?.[k] ?? 0), 0)]))
      : null;
    const summaryMetrics = report.summary.metrics
      ? Object.fromEntries(KEYS.map((k) => [k, report.summary.metrics![k]]))
      : null;
    check(`${name} Σ byMark metrics vs summary`, markMetrics, summaryMetrics);
    const lastStages = report.byMark.findLast((r) => r.stages)?.stages ?? null;
    check(`${name} last mark stages vs summary`, lastStages, report.summary.stages);
    // Overview tiles: stage tiles = summary N4–N1; the stage chart's last drawn column = tiles.
    const four = report.summary.stages && { N4: report.summary.stages.N4, N3: report.summary.stages.N3, N2: report.summary.stages.N2, N1: report.summary.stages.N1 };
    check(`${name} stage tiles vs summary`, block.tiles, four);
    const lastColumn = block.charts[0]!.columns.findLast((c) => c.values)?.values ?? null;
    check(`${name} chart last column vs tiles`, lastColumn, block.tiles);
    // KPI tile values vs summary (formatted the same way?).
    const rfTile = tiles.find((tile) => tile.key === 'rf')!;
    check(`${name} rf tile vs summary`, rfTile.value, report.summary.metrics ? String(report.summary.metrics.rfCount) : '—');
    checks += 16;
    // Per team: compare row = byTeam row; team chart last column = byTeam stages N4–N1.
    const teamBlock = stageBlock(data, period, { kind: 'team', teamId: data.teams[0]!.id }, today);
    check(`${name} team-scope tiles = all-scope tiles`, teamBlock.tiles, block.tiles);
    for (const team of report.byTeam!.rows) {
      const row = compare.teams.find((r) => r.key === team.key)!;
      check(`${name} compare row ${team.name} metrics`, row.metrics, team.metrics);
      check(`${name} compare row ${team.name} met`, row.met, team.appointments.met);
      const chart = teamBlock.charts.find((c) => c.key === team.key)!;
      const last = chart.columns.findLast((c) => c.values)?.values ?? null;
      const teamFour = team.stages && { N4: team.stages.N4, N3: team.stages.N3, N2: team.stages.N2, N1: team.stages.N1 };
      check(`${name} team chart ${team.name} vs byTeam stages`, last, teamFour);
      // Σ RE of the team in the compare table = team.
      const reMet = row.res.reduce((s, r) => s + r.met, 0);
      check(`${name} Σ RE met of ${team.name}`, reMet, row.met);
      checks += 4;
    }
    // Scope-by-scope: summary of a scope = row of that scope in Theo team / Theo RE.
    for (const scope of scopes.slice(1)) {
      const scoped = reportRows(data, period, scope, today);
      const key = scope.kind === 'team' ? scope.teamId : scope.kind === 're' ? scope.reId : '';
      const table = scope.kind === 'team' ? report.byTeam! : report.byRe!;
      const row = table.rows.find((r) => r.key === key)!;
      check(`${name} ${scope.kind} ${key} summary vs row`, scoped.summary.metrics, row.metrics);
      check(`${name} ${scope.kind} ${key} summary stages vs row`, scoped.summary.stages, row.stages);
      // Tổng quan KPI with this scope (metricsScope: a team counts every team).
      const ov = periodMetrics(data, periodOf('day', today), metricsScope(scope));
      void ov;
      checks += 2;
    }
  }
  // Team & nhân sự vs Báo cáo: "KH đang theo" = N4–N1 today; "HĐ phát hành năm" = issued this year.
  const staff = staffMetrics(data.people, { customers: data.customers, appointments: data.appointments, policies: data.policies }, today);
  const year = reportRows(data, periodOf('year', today), { kind: 'all' }, today);
  const day = reportRows(data, periodOf('day', today), { kind: 'all' }, today);
  const teamScreen: string[] = [];
  for (const re of year.byRe!.rows) {
    const m = staff.get(re.key)!;
    const dayRow = day.byRe!.rows.find((r) => r.key === re.key)!;
    const open = dayRow.stages!.N4 + dayRow.stages!.N3 + dayRow.stages!.N2 + dayRow.stages!.N1;
    if (m.issuedThisYear !== re.metrics!.issuedCount) teamScreen.push(`${re.name} issued ${m.issuedThisYear} vs ${re.metrics!.issuedCount}`);
    if (m.openCustomers !== open) teamScreen.push(`${re.name} open ${m.openCustomers} vs ${open}`);
    checks += 2;
  }
  save('probe-consistency', { checks, mismatches, teamScreen });
  expect({ mismatches, teamScreen }).toEqual({ mismatches: [], teamScreen: [] });
});
```

### `probe-excel.test.ts`

```ts
// Probe gói F, trục C / S: the Excel file against the screen on the load data — every sheet, every
// row, every figure cell read back with ExcelJS equals the number behind the screen's cell
// (reportCells); file names for awkward scopes stay within what the exe's export command takes.
import ExcelJS from 'exceljs';
import { customPeriod, periodOf, type Period, type Scope } from '@p2c/domain';
import { viewingText } from '#app/routes/overview/overview-view';
import {
  buildReportWorkbook,
  reportFileName,
  reportWorkbookMeta,
} from '#app/routes/reports/report-workbook';
import { reportCells, reportRows, reportScopeName, type ReportRow } from '#app/routes/reports/reports-view';
import { loadDb, readAll, save, TODAY } from './probe-load';

const FIGURES = 17;

it('matches the screen cell by cell, on the load data', async () => {
  const db = await loadDb();
  const data = readAll(db);
  const periods: Record<string, Period> = {
    month: periodOf('month', TODAY),
    year: periodOf('year', TODAY),
    customAcrossYear: customPeriod({ year: 2025, month: 11, day: 20 }, { year: 2026, month: 2, day: 19 }),
    future: periodOf('month', { year: 2026, month: 12, day: 1 }),
  };
  const scopes: Scope[] = [
    { kind: 'all' },
    { kind: 'team', teamId: data.teams[1]!.id },
    { kind: 're', reId: data.people.find((p) => p.role === 'RE')!.id },
  ];
  const mismatches: string[] = [];
  const sheetsSeen: Record<string, string[]> = {};
  let cells = 0;
  for (const [periodName, period] of Object.entries(periods)) {
    for (const scope of scopes) {
      const rows = reportRows(data, period, scope, TODAY);
      const viewing = {
        ...viewingText({ period, scope }, TODAY, data.people, data.teams),
        scope: reportScopeName(scope, data.people, data.teams),
      };
      const bytes = await buildReportWorkbook(rows, reportWorkbookMeta(viewing, TODAY));
      const book = new ExcelJS.Workbook();
      await book.xlsx.load(bytes.buffer as ArrayBuffer);
      const tables: [string, readonly ReportRow[]][] = [
        ['summary', [rows.summary]],
        ...(rows.byTeam ? [['byTeam', [...rows.byTeam.rows, rows.byTeam.total]] as [string, ReportRow[]]] : []),
        ...(rows.byRe ? [['byRe', [...rows.byRe.rows, rows.byRe.total]] as [string, ReportRow[]]] : []),
        ['byMark', rows.byMark],
      ];
      sheetsSeen[`${periodName}/${scope.kind}`] = book.worksheets.map((w) => w.name);
      tables.forEach(([key, list], sheetIndex) => {
        const sheet = book.worksheets[sheetIndex]!;
        const lead = key === 'byRe' ? 2 : 1;
        list.forEach((row, index) => {
          const excel = sheet.getRow(4 + index);
          const screen = reportCells(row);
          for (let c = 0; c < FIGURES; c++) {
            const value = excel.getCell(lead + 1 + c).value as number | null;
            const shown = screen[c]!;
            cells++;
            if (shown === '—') {
              if (value !== null && value !== undefined) mismatches.push(`${periodName}/${scope.kind}/${key}/${row.name}/${c}: "—" vs ${value}`);
              continue;
            }
            // The screen's number, read back: counts, compact money (tr / tỷ) and percentages.
            const fmt = excel.getCell(lead + 1 + c).numFmt;
            // "1.000%" / "66,7%" on screen → 1000 / 66.7; Excel holds the fraction.
            const screenRate = c === 10 ? Number(shown.replaceAll('.', '').replace(',', '.').replace('%', '')) : null;
            if (screenRate !== null && Math.abs(screenRate - Math.round(value! * 1000) / 10) > 1e-9) {
              mismatches.push(`${periodName}/${scope.kind}/${key}/${row.name}/rate: ${shown} vs ${value} (${fmt})`);
            }
            if (typeof value !== 'number') mismatches.push(`${periodName}/${scope.kind}/${key}/${row.name}/${c}: not a number ${value}`);
          }
          const name = excel.getCell(lead).value;
          if (name !== row.name) mismatches.push(`${periodName}/${scope.kind}/${key}: name ${String(name)} vs ${row.name}`);
        });
        // No extra rows after the table.
        const after = sheet.getRow(4 + list.length).getCell(lead).value;
        if (after !== null && after !== undefined) mismatches.push(`${periodName}/${scope.kind}/${key}: extra row ${String(after)}`);
      });
    }
  }
  const names = [
    reportFileName(periods.month!, 'Toàn bộ', TODAY),
    reportFileName(periods.customAcrossYear!, 'Team Đông Á', TODAY),
    reportFileName(periods.month!, 'RE 李小龍', TODAY),
    reportFileName(periods.month!, `RE ${'Nguyễn Văn '.repeat(20)}`, TODAY),
    reportFileName(periods.month!, 'Team ---', TODAY),
    reportFileName(periods.month!, 'Team ß æ ø', TODAY),
  ];
  const safe = names.every((name) => /^[A-Za-z0-9_.-]+$/.test(name) && name.length <= 120);
  save('probe-excel', { cells, mismatches, sheetsSeen, names, safe });
  expect(mismatches).toEqual([]);
  expect(safe).toBe(true);
});
```

### `probe-edges.test.ts`

```ts
// Probe gói F, trục E / C: texts and orders of Tổng quan, Báo cáo and Team at awkward days and
// names, on the load data. Prints what the screens would show; assertions only where the spec /
// mockup is explicit.
import { createPerson, createTeam } from '@p2c/db';
import {
  addDays,
  customPeriod,
  periodOf,
  switchKind,
  type CalendarDate,
  type Period,
  type Scope,
} from '@p2c/domain';
import { isPending, chooseFilter, startFilter } from '#app/routes/applied-filter';
import { kpiTiles, viewingText } from '#app/routes/overview/overview-view';
import { stageBlock } from '#app/routes/overview/stage-view';
import { teamCompare } from '#app/routes/overview/team-compare-view';
import { reportRows } from '#app/routes/reports/reports-view';
import { groupByTeam } from '#app/routes/team/team-view';
import { listTeams } from '@p2c/db';
import { loadDb, readAll, save, TODAY } from './probe-load';

const all: Scope = { kind: 'all' };
const d = (year: number, month: number, day: number): CalendarDate => ({ year, month, day });

it('shows sensible texts at year edges and keeps one team order', async () => {
  const db = await loadDb();
  const data = readAll(db);
  const out: Record<string, unknown> = {};

  // KPI "so với …" and "Đang xem" around 01/01.
  const cases: [string, Period, CalendarDate][] = [
    ['Ngày 01/01/2026', periodOf('day', d(2026, 1, 1)), d(2026, 1, 1)],
    ['Ngày 01/01/2026 seen later', periodOf('day', d(2026, 1, 1)), TODAY],
    ['Tháng 01/2026 on 01/01', periodOf('month', d(2026, 1, 1)), d(2026, 1, 1)],
    ['Tuần 29/12/2025–04/01/2026 on 01/01', periodOf('week', d(2026, 1, 1)), d(2026, 1, 1)],
    ['Tuần 05/01–11/01/2026 on 05/01', periodOf('week', d(2026, 1, 5)), d(2026, 1, 5)],
    ['Năm 2026 on 01/01', periodOf('year', d(2026, 1, 1)), d(2026, 1, 1)],
    ['Tùy chọn 20/11/2025–19/02/2026', customPeriod(d(2025, 11, 20), d(2026, 2, 19)), TODAY],
  ];
  out.kpi = cases.map(([name, period, today]) => {
    const tiles = kpiTiles(data, period, all, today);
    const viewing = viewingText({ period, scope: all }, today, data.people, data.teams);
    return {
      name,
      rfNote: tiles[0]!.note,
      closeRate: `${tiles[5]!.value}${tiles[5]!.unit} · ${tiles[5]!.delta?.text ?? ''} · ${tiles[5]!.note}`,
      viewing,
      compareRange: teamCompare(data, period, today).range,
    };
  });

  // Theo mốc names of a custom range across the new year, and chart labels of a long one.
  out.marksAcrossYear = reportRows(data, customPeriod(d(2025, 11, 20), d(2026, 2, 19)), all, TODAY).byMark.map((r) => r.name);
  out.marksShortAcrossYear = reportRows(data, customPeriod(d(2025, 12, 25), d(2026, 1, 5)), all, TODAY).byMark.map((r) => r.name);
  out.chartLabelsLong = stageBlock(data, customPeriod(d(2026, 7, 16), d(2026, 10, 15)), all, TODAY).charts[0]!.columns.map((c) => `${c.label} [${c.title}]`);

  // Month → Tùy chọn keeps the same days: is Lọc still pending (the numbers do change meaning)?
  const month = periodOf('month', TODAY);
  const custom = switchKind(month, 'custom', TODAY);
  out.monthToCustomPending = isPending(chooseFilter(startFilter({ period: month, scope: all }), { period: custom, scope: all }));

  // One team order for every list: add teams whose names start with Đ / Á / a lower-case letter.
  for (const name of ['Đông Á', 'Ánh Dương', 'an Phú']) {
    const team = createTeam(db, { name });
    createPerson(db, { name: `RE ${name}`, role: 'RE', teamId: team.id });
  }
  const after = readAll(db);
  const orders = {
    teamScreenList: groupByTeam(listTeams(db), after.people).teams.map((e) => e.team.name),
    overviewTeamCharts: stageBlock(after, month, { kind: 'team', teamId: after.teams[0]!.id }, TODAY).charts.map((c) => c.team),
    overviewCompare: teamCompare(after, month, TODAY).teams.map((t) => t.name),
    reportsByTeam: reportRows(after, month, all, TODAY).byTeam!.rows.map((r) => r.name),
  };
  out.orders = orders;
  save('probe-edges', out);
  expect(orders.overviewCompare).toEqual(orders.reportsByTeam);
});
```

### `probe-perf.test.ts`

```ts
// Probe gói F, trục P: the pure code of Tổng quan, Báo cáo, Team & nhân sự and Cài đặt on the load
// data (1 496 KH, 10 434 lịch hẹn, 51 nhân sự), in Node, as each screen calls it after a write
// (useQuery hands every useMemo a new `data`). Median of 9 runs after a warm-up.
import {
  appointmentCounts,
  customPeriod,
  periodOf,
  stageSnapshotSeries,
  type Period,
  type Scope,
} from '@p2c/domain';
import { countRecords } from '#app/data/app-data';
import { kpiTiles, metricsScope } from '#app/routes/overview/overview-view';
import { stageBlock } from '#app/routes/overview/stage-view';
import { stageChartOption } from '#app/routes/overview/stage-chart';
import { teamCompare } from '#app/routes/overview/team-compare-view';
import { reportRows, reportCells } from '#app/routes/reports/reports-view';
import { buildReportWorkbook } from '#app/routes/reports/report-workbook';
import { groupByTeam, staffMetrics } from '#app/routes/team/team-view';
import { listAppointments, listCustomers, listPeople, listPolicies, listTeams } from '@p2c/db';
import { loadDb, median, readAll, save, TODAY } from './probe-load';

it('measures the gói F view code on the load data', async () => {
  const db = await loadDb();
  const data = readAll(db);
  const out: Record<string, unknown> = {};
  const today = TODAY;
  const all: Scope = { kind: 'all' };
  const team: Scope = { kind: 'team', teamId: data.teams[0]!.id };
  const re: Scope = { kind: 're', reId: data.people.find((p) => p.role === 'RE')!.id };
  const periods: Record<string, Period> = {
    month: periodOf('month', today),
    year: periodOf('year', today),
    custom92: customPeriod({ year: 2026, month: 7, day: 6 }, { year: 2026, month: 10, day: 5 }),
    yearPast: periodOf('year', { year: 2025, month: 6, day: 1 }),
  };

  out.readAll = median(() => readAll(db));
  out.readTeams = median(() => ({
    teams: listTeams(db),
    people: listPeople(db),
    customers: listCustomers(db),
    appointments: listAppointments(db),
    policies: listPolicies(db),
  }));
  out.countRecords = median(() => countRecords(db));

  const overview: Record<string, unknown> = {};
  for (const [name, period] of Object.entries(periods)) {
    const scope = metricsScope(all);
    overview[name] = {
      appointmentCounts: median(() => appointmentCounts(data.appointments, period, scope, data.people, today)),
      kpiTiles: median(() => kpiTiles(data, period, scope, today)),
      stageBlockAll: median(() => stageBlock(data, period, all, today)),
      stageBlockTeam: median(() => stageBlock(data, period, team, today)),
      teamCompare: median(() => teamCompare(data, period, today)),
      chartOption: median(() => {
        const block = stageBlock(data, period, all, today);
        return stageChartOption(block.charts[0]!, ['N4', 'N3', 'N2', 'N1']);
      }),
    };
  }
  out.overview = overview;

  const reports: Record<string, unknown> = {};
  for (const [name, period] of Object.entries(periods)) {
    reports[name] = {
      all: median(() => reportRows(data, period, all, today)),
      team: median(() => reportRows(data, period, team, today)),
      re: median(() => reportRows(data, period, re, today)),
      cells: median(() => {
        const rows = reportRows(data, period, all, today);
        return rows.byRe!.rows.map(reportCells);
      }),
    };
  }
  out.reports = reports;
  out.stageSnapshotSeriesBuild = median(() => stageSnapshotSeries(data.customers, data.transitions, data.people));

  const records = { customers: data.customers, appointments: data.appointments, policies: data.policies };
  out.team = {
    groupByTeam: median(() => groupByTeam(data.teams, data.people)),
    staffMetrics: median(() => staffMetrics(data.people, records, today)),
    // Only the RE are shown in the members table (rows = entry.reps).
    staffMetricsReOnly: median(() =>
      staffMetrics(data.people.filter((p) => p.role === 'RE'), records, today),
    ),
  };

  const yearRows = reportRows(data, periods.year!, all, today);
  const meta = { period: 'Năm 2026', scope: 'Toàn bộ', exported: '05/10/2026' };
  const startBuild = performance.now();
  const bytes = await buildReportWorkbook(yearRows, meta);
  out.workbookFirstMs = Math.round(performance.now() - startBuild);
  const times: number[] = [];
  for (let i = 0; i < 5; i++) {
    const s = performance.now();
    await buildReportWorkbook(yearRows, meta);
    times.push(performance.now() - s);
  }
  times.sort((a, b) => a - b);
  out.workbookMedianMs = Math.round(times[2]!);
  out.workbookBytes = bytes.byteLength;
  save('probe-perf', out);
});
```

### `probe-byre.test.ts`

```ts
// Probe gói F, trục P: So sánh team (teamCompare) and Báo cáo Toàn bộ (reportRows) count every
// team and every RE with a full pass over all records each (4 + 44 passes on the load data).
// The same figures from records grouped by RE once, then summed per team — the direction a fix
// could take — to size the gain. Median of 9.
import {
  appointmentCounts,
  periodMetrics,
  periodOf,
  type MetricsData,
  type Period,
  type Scope,
} from '@p2c/domain';
import { teamCompare } from '#app/routes/overview/team-compare-view';
import { countedWindow } from '#app/routes/overview/overview-view';
import { teamRes } from '#app/shell/scope';
import { loadDb, median, readAll, save, TODAY } from './probe-load';

function grouped(data: ReturnType<typeof readAll>, period: Period) {
  const counted = countedWindow(period, TODAY)!;
  const byRe = new Map<string, MetricsData & { appointmentsAll: typeof data.appointments }>();
  const slot = (reId: string) => {
    let entry = byRe.get(reId);
    if (!entry) {
      entry = { people: data.people, appointments: [], transitions: [], policies: [], appointmentsAll: [] };
      byRe.set(reId, entry);
    }
    return entry as { people: typeof data.people; appointments: typeof data.appointments; transitions: typeof data.transitions; policies: typeof data.policies; appointmentsAll: typeof data.appointments };
  };
  for (const a of data.appointments) slot(a.reId).appointments.push(a);
  const customerRe = new Map(data.customers.map((c) => [c.id, c.reId]));
  for (const t of data.transitions) {
    const reId = customerRe.get(t.customerId);
    if (reId) slot(reId).transitions.push(t);
  }
  for (const p of data.policies) slot(p.reId).policies.push(p);
  const all: Scope = { kind: 'all' };
  return data.teams.map((team) => ({
    team: team.id,
    res: teamRes(data.people, team.id).map((re) => {
      const own = byRe.get(re.id) ?? { people: data.people, appointments: [], transitions: [], policies: [] };
      return {
        re: re.id,
        met: appointmentCounts(own.appointments, period, all, data.people, TODAY).met,
        metrics: periodMetrics(own, counted, all),
      };
    }),
  }));
}

it('sizes the per-RE passes of So sánh team', async () => {
  const db = await loadDb();
  const data = readAll(db);
  const out: Record<string, unknown> = {};
  for (const [name, period] of Object.entries({ month: periodOf('month', TODAY), year: periodOf('year', TODAY) })) {
    // Same numbers?
    const now = teamCompare(data, period, TODAY);
    const once = grouped(data, period);
    const same = now.teams.every((team) =>
      team.res.every((row) => {
        const other = once.find((t) => t.team === team.key)!.res.find((r) => r.re === row.key)!;
        return other.met === row.met && JSON.stringify(other.metrics) === JSON.stringify(row.metrics);
      }),
    );
    out[name] = {
      teamCompareMs: median(() => teamCompare(data, period, TODAY)),
      groupedOnceMs: median(() => grouped(data, period)),
      sameFigures: same,
    };
  }
  save('probe-byre', out);
});
```

### `probe-count.test.ts`

```ts
// Probe gói F, trục P: Cài đặt → "File dữ liệu" counts the live records with countRecords
// (list*().length, every row read and mapped) on every mount / revision. The same counts with
// COUNT(*) and the same filters, for comparison. Load data, median of 9.
import { countRecords } from '#app/data/app-data';
import { loadDb, median, save } from './probe-load';

const COUNT_SQL = {
  teams: 'SELECT COUNT(*) FROM teams WHERE deleted_at IS NULL',
  people: 'SELECT COUNT(*) FROM people WHERE deleted_at IS NULL',
  customers: 'SELECT COUNT(*) FROM customers WHERE deleted_at IS NULL',
  appointments:
    'SELECT COUNT(*) FROM appointments a JOIN customers c ON c.id = a.customer_id WHERE a.deleted_at IS NULL AND c.deleted_at IS NULL',
  policies:
    'SELECT COUNT(*) FROM policies p JOIN customers c ON c.id = p.customer_id WHERE p.deleted_at IS NULL AND c.deleted_at IS NULL',
};

it('counts records two ways', async () => {
  const db = await loadDb();
  const viaList = countRecords(db);
  const viaCount = Object.fromEntries(
    Object.entries(COUNT_SQL).map(([key, sql]) => [key, db.sqlite.exec(sql)[0]!.values[0]![0]]),
  );
  const out = {
    viaList,
    viaCount,
    countRecordsMs: median(() => countRecords(db)),
    countSqlMs: median(() => Object.values(COUNT_SQL).map((sql) => db.sqlite.exec(sql))),
  };
  save('probe-count', out);
  expect(viaCount).toEqual(viaList);
});
```

### `mutate.mjs`

```js
// Deep review Phase 1–4, gói F: "phá code" probe. For each mutation, runs the F-scope unit tests
// (vitest.mut.config.mts) with one file served mutated, and records killed / survived.
// The repo is never written. Usage: node mutate.mjs [name-prefix]
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const HERE = 'C:/workspace/deep-review-1-4/claude/F';
const ROOT = 'C:/workspace/Project-2C-review';
const VITEST = `${ROOT}/node_modules/vitest/vitest.mjs`;
const R = 'apps/desktop/src/routes/';
const O = `${R}overview/`;
const P = `${R}reports/`;
const T = `${R}team/`;

/** [name, file, from, to] — `from` must occur exactly once in the file. */
const MUTATIONS = [
  // overview-view.ts
  ['OV1 rate text without %', `${O}overview-view.ts`, "rate ? `${formatPercent(percentOf(rate))}${t('overview.percentUnit')}` : t('overview.none');", "rate ? formatPercent(percentOf(rate)) : t('overview.none');"],
  ['OV2 delta up/down swapped', `${O}overview-view.ts`, "? { tone: 'up', text: t('overview.up', { value }) }\n    : { tone: 'down', text: t('overview.down', { value }) };", "? { tone: 'down', text: t('overview.down', { value }) }\n    : { tone: 'up', text: t('overview.up', { value }) };"],
  ['OV3 windowText sameYear ignores end', `${O}overview-view.ts`, '&& window.end.year === period.start.year;', ';'],
  ['OV4 windowText day never with year', `${O}overview-view.ts`, 'return sameYear ? formatDayMonth(window.start) : formatDate(window.start);', 'return formatDayMonth(window.start);'],
  ['OV5 windowText range never with year', `${O}overview-view.ts`, '  if (!sameYear) return formatPeriodValue(customPeriod(window.start, window.end));\n', '\n'],
  ['OV6 counted: first day not started', `${O}overview-view.ts`, 'if (compareDates(today, period.start) < 0) return null;\n  return compareDates', 'if (compareDates(today, period.start) <= 0) return null;\n  return compareDates'],
  ['OV7 counted: whole period always', `${O}overview-view.ts`, 'return compareDates(today, period.end) < 0 ? customPeriod(period.start, today) : period;', 'return period;'],
  ['OV8 reason: custom before not-started', `${O}overview-view.ts`, "  if (compareDates(today, period.start) < 0) return t('overview.notCompared.notStarted');\n  if (period.kind === 'custom') return t('overview.notCompared.custom');", "  if (period.kind === 'custom') return t('overview.notCompared.custom');\n  if (compareDates(today, period.start) < 0) return t('overview.notCompared.notStarted');"],
  ['OV9 points not rounded to =', `${O}overview-view.ts`, 'delta(roundsToZero ? 0 : points,', 'delta(points,'],
  ['OV10 previousNoRf when no previous', `${O}overview-view.ts`, "note: previous && !previous.closeRate ? t('overview.previousNoRf') : comparedNote,", "note: !previous?.closeRate ? t('overview.previousNoRf') : comparedNote,"],
  ['OV11 formula swapped', `${O}overview-view.ts`, 'issued: formatCount(rate.numerator),\n      count: rate.denominator,', 'issued: formatCount(rate.denominator),\n      count: rate.numerator,'],
  ['OV12 metricsScope keeps team', `${O}overview-view.ts`, "scope.kind === 'team' ? { kind: 'all' } : scope;", 'scope;'],
  ['OV13 viewing: future month in progress', `${O}overview-view.ts`, '    compareDates(period.start, today) <= 0 &&\n', '\n'],
  ['OV14 viewing: year is MTD too', `${O}overview-view.ts`, "mtd: inProgress && period.kind === 'month',", 'mtd: inProgress,'],
  ['OV15 scopeTeams counts 1', `${O}overview-view.ts`, "t('overview.scopeTeams', { teams: teams.length })", "t('overview.scopeTeams', { teams: 1 })"],
  ['OV16 period name without Tháng', `${O}overview-view.ts`, "if (period.kind === 'month') return t('period.monthLabel', { value });", ''],
  ['OV17 noRf note never', `${O}overview-view.ts`, "const note = current && previous ? t('overview.noRf') : comparedNote;", 'const note = comparedNote;'],
  ['OV18 tiles order caseSize/issued', `${O}overview-view.ts`, 'return [rf, submitted, caseSize, issued, revenue,', 'return [rf, submitted, issued, caseSize, revenue,'],
  ['OV19 closeRate delta always shown', `${O}overview-view.ts`, 'points === null\n        ? null\n        :', 'false\n        ? null\n        :'],
  // stage-view.ts
  ['SV1 week label day+month', `${O}stage-view.ts`, "date: formatDayOfMonth(mark.start),\n      });", "date: formatDayMonth(mark.start),\n      });"],
  ['SV2 custom month label as day', `${O}stage-view.ts`, "return mark.kind === 'day'", "return mark.kind !== 'year'"],
  ['SV3 column title end of mark', `${O}stage-view.ts`, "formatDate(date ?? mark.end)", 'formatDate(mark.end)'],
  ['SV4 today never marked', `${O}stage-view.ts`, 'today: isInPeriod(today, mark),', 'today: false,'],
  ['SV5 tiles of picked team only', `${O}stage-view.ts`, 'tiles: date && fourOf(series([date], counted)[0]!),', 'tiles: date && fourOf(series([date], scope)[0]!),'],
  ['SV6 one chart for team scope', `${O}stage-view.ts`, 'charts: teams\n', 'charts: false\n'],
  ['SV7 note never "hôm nay"', `${O}stage-view.ts`, 'compareDates(date, today) === 0\n', 'false\n'],
  ['SV8 note without team count', `${O}stage-view.ts`, 'teams ? data.teams.length : null', 'null'],
  ['SV9 snapshot day = mark end', `${O}stage-view.ts`, 'chartMarks(period).map((mark) => ({ mark, date: snapshotDate(mark, today) }))', 'chartMarks(period).map((mark) => ({ mark, date: compareDates(today, mark.start) < 0 ? null : mark.end }))'],
  // stage-chart.ts
  ['SC1 stack not reversed', `${O}stage-chart.ts`, 'CHART_STAGES.filter((stage) => shown.includes(stage)).reverse();', 'CHART_STAGES.filter((stage) => shown.includes(stage));'],
  ['SC2 label all up to 31', `${O}stage-chart.ts`, 'const ALL_LABELS_MAX = 12;', 'const ALL_LABELS_MAX = 31;'],
  ['SC3 beside 2', `${O}stage-chart.ts`, 'Math.abs(index - other) === 1;', 'Math.abs(index - other) <= 2 && index !== other;'],
  ['SC4 total of all stages', `${O}stage-chart.ts`, 'const total = top.reduce((sum, stage) => sum + values[stage], 0);', "const total = values.N4 + values.N3 + values.N2 + values.N1;"],
  ['SC5 title not escaped', `${O}stage-chart.ts`, 'const heading = `<div>${encodeHtml(title)}</div>`;', 'const heading = `<div>${title}</div>`;'],
  ['SC6 no future outline', `${O}stage-chart.ts`, 'data: chart.columns.map((column) => (column.values ? null : 0)),', 'data: chart.columns.map(() => null),'],
  ['SC7 tooltip rows bottom first', `${O}stage-chart.ts`, 'const top = [...stages].reverse();', 'const top = [...stages];'],
  ['SC8 today label plain', `${O}stage-chart.ts`, 'chart.columns[index]?.today ? `{today|${value}}` : value,', 'value,'],
  ['SC9 edges not forced', `${O}stage-chart.ts`, '    if (edges.includes(index)) return true;\n', '\n'],
  ['SC10 team name not in tooltip', `${O}stage-chart.ts`, 'chart.team === null\n            ? column.title', 'true\n            ? column.title'],
  ['SC11 palette order not reversed', `${O}stage-chart.ts`, "...bottomUp(shown).map((stage) => `--${stage.toLowerCase()}`),", "...CHART_STAGES.filter((s) => shown.includes(s)).map((stage) => `--${stage.toLowerCase()}`),"],
  // team-compare-view.ts
  ['TC1 teams unsorted', `${O}team-compare-view.ts`, '    .sort((a, b) => byName(a.name, b.name))\n', '\n'],
  ['TC2 met up to today only', `${O}team-compare-view.ts`, 'met: appointmentCounts(data.appointments, period, scope, data.people, today).met,', 'met: appointmentCounts(data.appointments, counted ?? period, scope, data.people, today).met,'],
  ['TC3 total rate swapped', `${O}team-compare-view.ts`, 'closeRate: closeRate(issuedCount, rfCount),', 'closeRate: closeRate(rfCount, issuedCount),'],
  ['TC4 total metrics before start', `${O}team-compare-view.ts`, '  if (!counted) return { met, metrics: null };\n', '\n'],
  ['TC5 RE are every member', `${O}team-compare-view.ts`, 'const res = teamRes(data.people, team.id).map', "const res = data.people.filter((p) => p.teamId === team.id).map"],
  ['TC6 total caseSize = submitted', `${O}team-compare-view.ts`, "caseSize: add('caseSize'),", "caseSize: add('submittedCount'),"],
  ['TC7 range whole period', `${O}team-compare-view.ts`, 'range: counted && formatPeriodValue(customPeriod(counted.start, counted.end)),', 'range: counted && formatPeriodValue(period),'],
  ['TC8 cells rate as count', `${O}team-compare-view.ts`, '    closeRateText(metrics.closeRate),\n  ];', '    formatCount(metrics.closeRate?.numerator ?? 0),\n  ];'],
  // reports-view.ts
  ['RV1 total rate swapped', `${P}reports-view.ts`, '{ ...summed, closeRate: closeRate(summed.issuedCount, summed.rfCount) }', '{ ...summed, closeRate: closeRate(summed.rfCount, summed.issuedCount) }'],
  ['RV2 total stages from rows', `${P}reports-view.ts`, '    stages: has.stages\n', '    stages: rows.some((row) => row.stages)\n'],
  ['RV3 team scope name empty', `${P}reports-view.ts`, "name: teams.find((team) => team.id === scope.teamId)?.name ?? '',", "name: '',"],
  ['RV4 summaryMeta counts all people', `${P}reports-view.ts`, "(person) => person.role === 'RE' && (scope.kind === 'all' || person.teamId === scope.teamId),", "(person) => scope.kind === 'all' || person.teamId === scope.teamId,"],
  ['RV5 never with year', `${P}reports-view.ts`, 'const withYear = period.start.year !== period.end.year;', 'const withYear = false;'],
  ['RV6 weekdays on every week', `${P}reports-view.ts`, '      weekdayOf(mark.start) !== 1 &&\n', '\n'],
  ['RV7 no "hôm nay" on a day', `${P}reports-view.ts`, "oneDay && isInPeriod(today, mark) && t('reports.mark.today'),", 'false,'],
  ['RV8 until on the last day too', `${P}reports-view.ts`, '      compareDates(today, mark.end) < 0 &&\n', '\n'],
  ['RV9 Theo RE ignores team scope', `${P}reports-view.ts`, ".filter((re) => scope.kind === 'all' || re.teamId === scope.teamId)", '.filter(() => true)'],
  ['RV10 teams unsorted', `${P}reports-view.ts`, '    .sort((a, b) => byName(a.name, b.name))\n', '\n'],
  ['RV11 RE scope keeps tables', `${P}reports-view.ts`, "  if (scope.kind === 're') return { summary, byTeam: null, byRe: null, byMark };\n", '\n'],
  ['RV12 team scope keeps Theo team', `${P}reports-view.ts`, "if (scope.kind === 'team') return { summary, byTeam: null, byRe: table(res), byMark };", ''],
  ['RV13 row team blank', `${P}reports-view.ts`, "team: (re.teamId && teamName.get(re.teamId)) ?? '',", "team: '',"],
  ['RV14 mark results = whole mark', `${P}reports-view.ts`, 'marks.flatMap((mark) => countedWindow(mark, today) ?? []),', 'marks.flatMap((mark) => (compareDates(today, mark.start) < 0 ? [] : [mark])),'],
  ['RV15 mark stages at mark end', `${P}reports-view.ts`, 'marks.flatMap((mark) => snapshotDate(mark, today) ?? []),', 'marks.flatMap((mark) => (compareDates(today, mark.start) < 0 ? [] : [mark.end])),'],
  ['RV16 mark today flag false', `${P}reports-view.ts`, 'today: isInPeriod(today, mark),', 'today: false,'],
  ['RV17 cells: results always —', `${P}reports-view.ts`, '  const resultCells = metrics\n', '  const resultCells = false\n'],
  ['RV18 summary appts up to today', `${P}reports-view.ts`, 'appointments: appointmentCounts(data.appointments, period, of, data.people, today),', 'appointments: appointmentCounts(data.appointments, counted ?? period, of, data.people, today),'],
  ['RV19 month marks named by weekday from', `${P}reports-view.ts`, "from: t(`weekday.${weekdayOf(mark.start)}`),\n        to: t(`weekday.${weekdayOf(mark.end)}`),", "from: t(`weekday.${weekdayOf(mark.start)}`),\n        to: t('weekday.7'),"],
  // report-workbook.ts
  ['RW1 rate without % format', `${P}report-workbook.ts`, "const PERCENT = '0.0%';", "const PERCENT = '0.0';"],
  ['RW2 rate as percent number', `${P}report-workbook.ts`, 'metrics.closeRate.numerator / metrics.closeRate.denominator : null,', '(metrics.closeRate.numerator / metrics.closeRate.denominator) * 100 : null,'],
  ['RW3 no Theo mốc sheet', `${P}report-workbook.ts`, "    { key: 'byMark', rows: rows.byMark },\n", '\n'],
  ['RW4 meta never MTD', `${P}report-workbook.ts`, "(mtd ? t('reports.excel.mtd', { range: counted }) : counted)", 'counted'],
  ['RW5 slug keeps marks', `${P}report-workbook.ts`, "    .normalize('NFD')\n    .replace(/\\p{M}/gu, '')\n", '\n'],
  ['RW6 slug max 200', `${P}report-workbook.ts`, 'const SCOPE_SLUG_MAX = 60;', 'const SCOPE_SLUG_MAX = 200;'],
  ['RW7 month stamp full day', `${P}report-workbook.ts`, 'return formatIsoDate(start).slice(0, 7);', 'return formatIsoDate(start);'],
  ['RW8 frozen 2 rows', `${P}report-workbook.ts`, 'ySplit: 3 }', 'ySplit: 2 }'],
  ['RW9 total not bold', `${P}report-workbook.ts`, 'addFigures(sheet.total, names).font = { bold: true };', 'addFigures(sheet.total, names);'],
  ['RW10 build failure as write', `${P}report-workbook.ts`, "    return { kind: 'failed', step: 'build' };", "    return { kind: 'failed', step: 'write' };"],
  ['RW11 failed help folder swapped', `${P}report-workbook.ts`, "      : inFolder\n        ? 'reports.exportFailedHelp'\n        : 'reports.exportFailedHelpWeb',", "      : inFolder\n        ? 'reports.exportFailedHelpWeb'\n        : 'reports.exportFailedHelp',"],
  ['RW12 no trailing dash trim', `${P}report-workbook.ts`, "    .replace(/-$/, '');", '    ;'],
  ['RW13 groups merged wrong', `${P}report-workbook.ts`, "  { label: t('reports.group.results'), span: 6 },\n  { label: t('reports.group.stages'), span: 6 },\n];\n\nconst LEAD", "  { label: t('reports.group.results'), span: 5 },\n  { label: t('reports.group.stages'), span: 7 },\n];\n\nconst LEAD"],
  ['RW14 money cells no format', `${P}report-workbook.ts`, "{ label: money(t('overview.kpi.revenue')), value: result('revenue'), numFmt: MONEY },", "{ label: money(t('overview.kpi.revenue')), value: result('revenue') },"],
  ['RW15 total Theo RE name col 1', `${P}report-workbook.ts`, "const names = sheet.key === 'byRe' ? ['', sheet.total.name] : [sheet.total.name];", 'const names = [sheet.total.name];'],
  ['RW16 sheet count Theo team always', `${P}report-workbook.ts`, "    rows.byTeam && { key: 'byTeam', ...rows.byTeam },\n", "    { key: 'byTeam', rows: [] },\n"],
  // team-view.ts
  ['TV1 31 days', `${T}team-view.ts`, 'customPeriod(addDays(today, -29), today);', 'customPeriod(addDays(today, -30), today);'],
  ['TV2 coordinator not counted', `${T}team-view.ts`, '(a.reId === person.id || a.coordinatorIds.includes(person.id)) &&', 'a.reId === person.id &&'],
  ['TV3 open counts closed', `${T}team-view.ts`, '.filter((c) => isPipelineStage(c.stage)).length', '.length'],
  ['TV4 issued last 30 days', `${T}team-view.ts`, '(p) => p.issuedDate && isInPeriod(p.issuedDate, year),', '(p) => p.issuedDate && isInPeriod(p.issuedDate, recent),'],
  ['TV5 lead = last TL', `${T}team-view.ts`, 'lead: leads[0],', 'lead: leads.at(-1),'],
  ['TV6 usage no coordinating', `${T}team-view.ts`, 'coordinating: records.appointments.filter((a) => a.coordinatorIds.includes(personId)).length,', 'coordinating: 0,'],
  ['TV7 30 days include tomorrow', `${T}team-view.ts`, 'customPeriod(addDays(today, -29), today);', 'customPeriod(addDays(today, -29), addDays(today, 1));'],
  ['TV8 non-RE gets metrics', `${T}team-view.ts`, "const isRe = person.role === 'RE';", 'const isRe = true;'],
  // applied-filter.ts
  ['AP1 period kind ignored', `${R}applied-filter.ts`, 'a.kind === b.kind && compareDates', 'compareDates'],
  ['AP2 team id ignored', `${R}applied-filter.ts`, "return b.kind === 'team' && a.teamId === b.teamId;", "return b.kind === 'team';"],
  ['AP3 Lọc applies nothing', `${R}applied-filter.ts`, 'export const applyFilter = (state: FilterState): FilterState => startFilter(state.chosen);', 'export const applyFilter = (state: FilterState): FilterState => state;'],
  ['AP4 end ignored', `${R}applied-filter.ts`, ' && compareDates(a.end, b.end) === 0;', ';'],
];

const filter = process.argv[2];
const results = {};
writeFileSync(`${HERE}/mutate.log`, '');
for (const [name, file, from, to] of MUTATIONS) {
  if (filter && !name.startsWith(filter)) continue;
  const source = readFileSync(`${ROOT}/${file}`, 'utf8').replaceAll('\r\n', '\n');
  const count = source.split(from).length - 1;
  if (count !== 1) {
    results[name] = { verdict: 'BAD-MUTATION', failing: `found ${count} times` };
    console.log(`BAD-MUTATION ${name} (found ${count} times)`);
    continue;
  }
  const run = spawnSync(
    process.execPath,
    [VITEST, 'run', '--config', `${HERE}/vitest.mut.config.mts`, '--reporter=dot', '--bail=1'],
    { env: { ...process.env, MUT: JSON.stringify({ file, from, to }) }, encoding: 'utf8', cwd: HERE },
  );
  const out = `${run.stdout}\n${run.stderr}`;
  let verdict;
  if (/found \d+ times/.test(out)) verdict = 'BAD-MUTATION';
  else if (run.status === 0) verdict = 'SURVIVED';
  else verdict = 'KILLED';
  const failing = [...out.matchAll(/FAIL\s+(\S+)\s+>\s+([^\n]+)/g)].map((m) => `${m[1]} > ${m[2]}`)[0] ?? '';
  results[name] = { verdict, failing };
  console.log(`${verdict.padEnd(12)} ${name}${failing ? `  [${failing}]` : ''}`);
  appendFileSync(`${HERE}/mutate.log`, `\n===== ${name} (${verdict})\n${out.slice(-3000)}\n`);
}
writeFileSync(`${HERE}/mutate-results${filter ? `-${filter.replace(/\W/g, '')}` : ''}.json`, JSON.stringify(results, null, 1));
const tally = Object.values(results).reduce((t, r) => ({ ...t, [r.verdict]: (t[r.verdict] ?? 0) + 1 }), {});
console.log(JSON.stringify(tally));
```

### `e2e-mut.mjs`

```js
// Deep review Phase 1–4, gói F: "phá code" for the React screens (TSX) of Tổng quan, Báo cáo,
// Team & nhân sự and Cài đặt, which only e2e covers, and for the unit survivors of mutate.mjs.
// For each mutation: builds the web app with ONE file served mutated (Vite load hook) into
// F\dist-mut (never the repo's dist), serves it on port 4183, and runs the related Playwright specs
// against it (playwright.f.config.ts, output in F\pw-out). The repo is only read.
// Usage (PowerShell): node e2e-mut.mjs [name-prefix]     ("BASE" runs every spec unmutated)
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const HERE = 'C:/workspace/deep-review-1-4/claude/F';
const ROOT = 'C:/workspace/Project-2C-review';
const APP = `${ROOT}/apps/desktop`;
const OUT = `${HERE}/dist-mut`;
const PW = `${ROOT}/node_modules/@playwright/test/cli.js`;
const R = 'apps/desktop/src/routes/';
const O = `${R}overview/`;
const P = `${R}reports/`;
const T = `${R}team/`;
const OVERVIEW = ['overview.spec.ts', 'chart.spec.ts'];
const REPORTS = ['reports.spec.ts'];
const TEAM = ['team.spec.ts'];
const SETTINGS = ['backup.spec.ts', 'demo-data.spec.ts'];
const PICKER = ['period-picker.spec.ts'];
const FAKE_YEAR = { NODE_OPTIONS: `--require ${HERE}/fake-year.cjs` };

/** [name, file, from, to, specs, extra?] — `from` must occur exactly once in the file. */
const MUTATIONS = [
  ['BASE no mutation', null, null, null, [...OVERVIEW, ...REPORTS, ...TEAM, ...SETTINGS, ...PICKER]],
  // A test reading the machine clock (team.spec.ts:319), unmutated build, Node's clock in 2027.
  ['YEAR0 member columns, real clock', null, null, null, TEAM, { grep: 'member columns' }],
  ['YEAR1 member columns, Node clock 05/01/2027', null, null, null, TEAM, { grep: 'member columns', env: FAKE_YEAR }],
  // Tổng quan
  ['FT1 tile counts the picked team only', `${R}Overview.tsx`, '() => appointmentCounts(data.appointments, applied.period, scope, data.people, today),', '() => appointmentCounts(data.appointments, applied.period, applied.scope, data.people, today),', OVERVIEW],
  ['FT2 compare shown for an RE', `${R}Overview.tsx`, "(applied.scope.kind === 're' ? null : teamCompare(data, applied.period, today)),", '(false ? null : teamCompare(data, applied.period, today)),', OVERVIEW],
  ['FT3 no pending reminder', `${R}FilterBar.tsx`, "{pending && <span className=\"text-sm text-accent\">{t('overview.pending')}</span>}", '{null}', [...OVERVIEW, ...REPORTS, ...PICKER]],
  ['FT4 viewing without range', `${R}FilterBar.tsx`, '{viewing.range && ` ${viewing.range}`}', '{null}', [...OVERVIEW, ...REPORTS]],
  ['FT5 empty bar never says so', `${O}OverviewTiles.tsx`, '{counts.total === 0 ? (', '{false ? (', OVERVIEW],
  ['FT6 group counts all = met', `${O}OverviewTiles.tsx`, '{formatCount(counts[group.key])}</b>', '{formatCount(counts.met)}</b>', OVERVIEW],
  ['FT7 close rate formula hidden', `${O}OverviewTiles.tsx`, "{tile.formula && <span>{` ${t('sep.dot')} ${tile.formula}`}</span>}", '{null}', OVERVIEW],
  ['FT8 ▲ red, ▼ green', `${O}OverviewTiles.tsx`, "const TONE = { up: 'text-ok', down: 'text-danger', same: 'text-fg-2' } as const;", "const TONE = { up: 'text-danger', down: 'text-ok', same: 'text-fg-2' } as const;", OVERVIEW],
  ['FT9 hidden stage still drawn', `${O}StageBlock.tsx`, 'const option = useMemo(() => stageChartOption(chart, shown), [chart, shown]);', 'const option = useMemo(() => stageChartOption(chart, CHART_STAGES), [chart, shown]);', OVERVIEW],
  ['FT10 team chart heading without last column', `${O}StageBlock.tsx`, '{lastText(chart, shown)}', "{''}", OVERVIEW],
  ['FT11 tiles 0 before start', `${O}StageBlock.tsx`, "{block.tiles ? formatCount(block.tiles[stage]) : t('overview.none')}", '{formatCount(block.tiles?.[stage] ?? 0)}', OVERVIEW],
  ['FT12 no "not started" over chart', `${O}StageBlock.tsx`, '      {empty && (', '      {false && (', OVERVIEW],
  ['FT13 RE rows always open', `${O}TeamCompare.tsx`, '{expanded &&\n                  team.res.map', '{true &&\n                  team.res.map', OVERVIEW],
  // Báo cáo
  ['FT15 export the chosen, not applied, period', `${P}ReportsScreen.tsx`, 'onClick={() => void exporter.run({ rows, period: applied.period, viewing, today })}', 'onClick={() => void exporter.run({ rows, period: filter.period, viewing, today })}', REPORTS],
  ['FT16 summary meta empty', `${P}ReportsScreen.tsx`, '{summaryMeta(applied.scope, data.people, data.teams)}', "{''}", REPORTS],
  ['FT18 no today bar', `${P}ReportTable.tsx`, "${'today' in row && row.today ? TODAY_BAR : ''}", "${''}", REPORTS],
  ['FT19 no rule between teams', `${P}ReportTable.tsx`, "const teamStart = lead === 're' && index > 0 && rows[index - 1]?.team !== row.team;", 'const teamStart = false;', REPORTS],
  ['FT20 "—" not dimmed', `${P}ReportTable.tsx`, "${cell === none ? 'text-fg-3' : ''}", "${''}", REPORTS],
  ['FT21 notice by identity', `${P}ReportExport.tsx`, 'const notice = last && sameSelection(last.for, applied) ? last.notice : null;', 'const notice = last && last.for === applied ? last.notice : null;', REPORTS],
  // Team & nhân sự
  ['FT23 summary RE = TL count', `${T}TeamScreen.tsx`, '            re: reCount,', '            re: tlCount,', TEAM],
  ['FT24 issued column shows open', `${T}TeamScreen.tsx`, "metricColumn('issued', t('team.colIssued', { year }), (m) => m.issuedThisYear, metrics),", "metricColumn('issued', t('team.colIssued', { year }), (m) => m.openCustomers, metrics),", TEAM],
  ['FT25 30-day column shows issued', `${T}TeamScreen.tsx`, "metricColumn('appointments', t('team.colAppointments'), (m) => m.appointments30, metrics),", "metricColumn('appointments', t('team.colAppointments'), (m) => m.issuedThisYear, metrics),", TEAM],
  ['FT26 new team not selected', `${T}TeamScreen.tsx`, '          onSaved={(team) => {\n            setSelectedId(team.id);', '          onSaved={(team) => {\n            void team;', TEAM],
  ['FT28 IS keeps the team', `${T}PersonDialogs.tsx`, "if (!needsTeam(value)) setTeamId('');", "if (false) setTeamId('');", TEAM],
  ['FT29 team errors on the form', `${T}PersonDialogs.tsx`, "else if (code === 'TEAM_REQUIRED' || code === 'TEAM_NOT_FOUND' || code === 'TEAM_NOT_ALLOWED')", 'else if (false)', TEAM],
  ['FT30 delete allowed while in use', `${T}PersonDialogs.tsx`, 'disabled={inUse || error !== undefined}', 'disabled={error !== undefined}', TEAM],
  ['FT31 coordinating not listed', `${T}PersonDialogs.tsx`, '{usage.coordinating > 0 && (', '{false && (', TEAM],
  ['FT32 taken name without the name', `${T}TeamDialogs.tsx`, 'setError(errorMessage(failure, { name: clean.trim() }));', 'setError(errorMessage(failure));', TEAM],
  // Cài đặt
  ['FT33 reload without the word', `${R}Settings.tsx`, "const confirmed = word.normalize('NFC') === confirmWord;", 'const confirmed = true;', SETTINGS],
  ['FT35 no size check', `${R}SettingsBackup.tsx`, 'if (file.size > MAX_BACKUP_BYTES) {', 'if (false) {', SETTINGS],
  ['FT36 current counts = file counts', `${R}SettingsBackup.tsx`, "[t('settings.backup.current'), countsText(chosen.current)],", "[t('settings.backup.current'), countsText(preview.counts)],", SETTINGS],
  ['FT37 SCHEMA_TOO_NEW as invalid (KNOWN #185)', `${R}SettingsBackup.tsx`, "code === 'SCHEMA_TOO_NEW'\n", 'false\n', SETTINGS],
  ['FT38 counts customers ↔ appointments', `${R}SettingsDataFile.tsx`, 'customers: formatCount(counts.customers),\n    appointments: formatCount(counts.appointments),', 'customers: formatCount(counts.appointments),\n    appointments: formatCount(counts.customers),', SETTINGS],
  // Unit survivors of mutate.mjs: does e2e hold them?
  ['U1 OV4 day window never with year', `${O}overview-view.ts`, 'return sameYear ? formatDayMonth(window.start) : formatDate(window.start);', 'return formatDayMonth(window.start);', OVERVIEW],
  ['U2 OV9 points not rounded to =', `${O}overview-view.ts`, 'delta(roundsToZero ? 0 : points,', 'delta(points,', OVERVIEW],
  ['U3 OV10 previousNoRf when no previous', `${O}overview-view.ts`, "note: previous && !previous.closeRate ? t('overview.previousNoRf') : comparedNote,", "note: !previous?.closeRate ? t('overview.previousNoRf') : comparedNote,", OVERVIEW],
  ['U4 OV13 viewing: future month in progress', `${O}overview-view.ts`, '    compareDates(period.start, today) <= 0 &&\n', '\n', OVERVIEW],
  ['U5 OV14 viewing: year is MTD too', `${O}overview-view.ts`, "mtd: inProgress && period.kind === 'month',", 'mtd: inProgress,', OVERVIEW],
  ['U6 OV18 tiles order caseSize/issued', `${O}overview-view.ts`, 'return [rf, submitted, caseSize, issued, revenue,', 'return [rf, submitted, issued, caseSize, revenue,', OVERVIEW],
  ['U7 TC1 compare teams unsorted', `${O}team-compare-view.ts`, '    .sort((a, b) => byName(a.name, b.name))\n', '\n', OVERVIEW],
  ['U8 AP4 custom end ignored by Lọc', `${R}applied-filter.ts`, ' && compareDates(a.end, b.end) === 0;', ';', [...OVERVIEW, ...REPORTS, ...PICKER]],
];

const vitePath = createRequire(`${APP}/package.json`).resolve('vite');
const { build, preview } = await import(pathToFileURL(vitePath).href);
process.env.VITE_DEMO_ANCHOR = '15/09/2026';

const mutatePlugin = (file, from, to) => ({
  name: 'p2c-mutate',
  enforce: 'pre',
  load(id) {
    if (!file) return null;
    const clean = id.split('?')[0].replaceAll('\\', '/').toLowerCase();
    if (clean !== resolve(ROOT, file).replaceAll('\\', '/').toLowerCase()) return null;
    const source = readFileSync(resolve(ROOT, file), 'utf8').replaceAll('\r\n', '\n');
    return source.replace(from, to);
  },
});

const filter = process.argv[2];
const resultsFile = `${HERE}/e2e-mut-results.json`;
let results = {};
try {
  results = JSON.parse(readFileSync(resultsFile, 'utf8'));
} catch {}
let built = null;
for (const [name, file, from, to, specs, extra = {}] of MUTATIONS) {
  if (filter ? !name.startsWith(filter) : name.startsWith('BASE')) continue;
  if (file) {
    const source = readFileSync(`${ROOT}/${file}`, 'utf8').replaceAll('\r\n', '\n');
    const count = source.split(from).length - 1;
    if (count !== 1) {
      results[name] = { verdict: 'BAD-MUTATION', detail: `found ${count} times` };
      console.log(`BAD-MUTATION ${name} (found ${count} times)`);
      continue;
    }
  }
  const started = Date.now();
  const key = file ? name : 'unmutated';
  if (built !== key) {
    await build({
      root: APP,
      configFile: `${APP}/vite.config.ts`,
      logLevel: 'error',
      cacheDir: `${HERE}/.vite-e2e`,
      build: { outDir: OUT, emptyOutDir: true },
      plugins: [mutatePlugin(file, from, to)],
    });
    built = key;
  }
  const server = await preview({
    root: APP,
    configFile: `${APP}/vite.config.ts`,
    logLevel: 'error',
    build: { outDir: OUT },
    preview: { port: 4183, strictPort: true },
  });
  // Asynchronous: the preview server runs in this process and must keep answering.
  const args = [PW, 'test', ...specs, `--config=${HERE}/playwright.f.config.ts`, '--reporter=line'];
  if (extra.grep) args.push('-g', extra.grep);
  const run = await new Promise((done) => {
    const child = spawn(process.execPath, args, {
      cwd: ROOT,
      env: { ...process.env, CI: '', ...(extra.env ?? {}) },
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('close', (status) => done({ status, stdout, stderr }));
  });
  await server.close();
  const out = `${run.stdout}\n${run.stderr}`;
  const failed = [...out.matchAll(/^\s+\d+\) \[edge\] › ([^\n]+)/gm)].map((m) => m[1].trim());
  const summary = out.match(/(\d+) (passed|failed)[^\n]*/g) ?? [];
  const verdict = file === null ? (run.status === 0 ? 'GREEN' : 'RED') : run.status === 0 ? 'SURVIVED' : 'KILLED';
  results[name] = { verdict, specs, summary, firstFailing: failed[0] ?? '', seconds: Math.round((Date.now() - started) / 1000) };
  console.log(`${verdict.padEnd(10)} ${name} ${summary.join(' / ')} ${failed[0] ?? ''}`);
  appendFileSync(`${HERE}/e2e-mut.log`, `\n===== ${name} (${verdict})\n${out.slice(-4000)}\n`);
  writeFileSync(resultsFile, JSON.stringify(results, null, 1));
}
process.exit(0);
```

### `playwright.f.config.ts`

```ts
// Gói F: the repo's e2e specs against a web build served by e2e-mut.mjs on port 4183 (not the
// e2e port 4173, which another session may be using), output outside the repo.
import { defineConfig, devices } from '@playwright/test';

const EDGE = { ...devices['Desktop Edge'], channel: 'msedge' };

export default defineConfig({
  testDir: 'C:/workspace/Project-2C-review/e2e',
  fullyParallel: true,
  workers: 4,
  reporter: 'line',
  expect: { timeout: 15_000 },
  outputDir: 'C:/workspace/deep-review-1-4/claude/F/pw-out',
  use: {
    baseURL: 'http://localhost:4183',
    locale: 'vi-VN',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'edge', testIgnore: 'seed-timing.spec.ts', use: EDGE }],
});
```

### `fake-year.cjs`

```js
// Preloaded into the Playwright runner and its workers (NODE_OPTIONS=--require): Node's clock reads
// 05/01/2027 10:00 (+07), the browser's clock and the app are untouched. Shows what an e2e that
// reads the machine clock does once the machine's year is not the year of the pinned anchor.
const Real = Date;
const OFFSET = Real.UTC(2027, 0, 5, 3, 0, 0) - Real.now();
class ShiftedDate extends Real {
  constructor(...args) {
    if (args.length === 0) super(Real.now() + OFFSET);
    else super(...args);
  }
  static now() {
    return Real.now() + OFFSET;
  }
}
globalThis.Date = ShiftedDate;
```

### `cdp.mjs`

```js
// Probe (gói F): drives the release exe copy in F\exe through WebView2's remote debugging port.
// Same as D\cdp.mjs, port 9335. Usage: node cdp.mjs eval <file.js> — runs the file's body as an
// async function in the page and prints what it returns.
// The exe is started with WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9335.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

const [, , cmd, a, b] = process.argv;
const browser = await chromium.connectOverCDP('http://127.0.0.1:9335');
const page = browser.contexts()[0].pages()[0];
let out;
if (cmd === 'eval') {
  const body = readFileSync(a, 'utf8');
  out = await page.evaluate(`(async () => { ${body} })()`);
} else if (cmd === 'key') {
  for (let i = 0; i < Number(b ?? 1); i++) await page.keyboard.press(a);
  out = 'pressed';
} else if (cmd === 'shot') {
  await page.screenshot({ path: a });
  out = a;
}
console.log(JSON.stringify(out, null, 1));
await browser.close().catch(() => {});
process.exit(0);
```

### `detached.mjs`

```js
// Probe (gói F): runs a probe body (as cdp.mjs eval) in the exe AFTER the debugger client has
// disconnected — an attached client slows the IPC part of each save (gói D, §5 P). The body's
// result lands in window.__probe; "read" prints it.
// Usage: node detached.mjs start <file.js> ; (wait) ; node detached.mjs read
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');

const [, , phase, file] = process.argv;
const browser = await chromium.connectOverCDP('http://127.0.0.1:9335');
const page = browser.contexts()[0].pages()[0];
if (phase === 'start') {
  const body = readFileSync(file, 'utf8');
  await page.evaluate(`(() => {
    window.__probe = { state: 'waiting' };
    setTimeout(async () => {
      try {
        const result = await (async () => { ${body} })();
        window.__probe = { state: 'done', result };
      } catch (error) {
        window.__probe = { state: 'failed', error: String(error) };
      }
    }, 3000);
  })()`);
  console.log('planted');
} else {
  console.log(JSON.stringify(await page.evaluate(() => window.__probe), null, 1));
}
await browser.close().catch(() => {});
process.exit(0);
```

### `run-detached.ps1`

```powershell
# Plants a probe body with detached.mjs, lets it run with no debugger attached, then reads it.
# Usage: .\run-detached.ps1 <file.js> [seconds]
param([string]$File, [int]$Seconds = 25)
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
node detached.mjs start $File
if ($LASTEXITCODE -ne 0) { throw 'start failed' }
$deadline = (Get-Date).AddSeconds($Seconds + 30)
do {
  Start-Sleep -Seconds 3
  $r = node detached.mjs read
  if ($LASTEXITCODE -ne 0) { throw 'read failed' }
} until (($r -join "`n") -match '"(done|failed)"' -or (Get-Date) -gt $deadline)
$r
```

### `perf-screens.js`

```js
// Probe body (gói F, run by `node cdp.mjs eval perf-screens.js` in the exe with the load data):
// opening each screen of gói F from Khách hàng (route change → frame after the screen painted),
// then on Tổng quan / Báo cáo: changing the period and pressing Lọc. Three runs each.
const frame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const timed = async (act) => {
  const start = performance.now();
  act();
  const sync = performance.now() - start;
  await frame();
  return { syncMs: Math.round(sync), toFrameMs: Math.round(performance.now() - start) };
};
const radio = (name) =>
  [...document.querySelectorAll('[role=radio]')].find((b) => b.textContent.trim() === name);
const button = (name) =>
  [...document.querySelectorAll('button')].find((b) => b.textContent.trim().startsWith(name));
const out = { counts: {} };
for (const screen of ['overview', 'reports', 'team', 'settings']) {
  const runs = [];
  for (let i = 0; i < 3; i++) {
    location.hash = '#/customers';
    await wait(1200);
    runs.push(await timed(() => (location.hash = `#/${screen}`)));
    await wait(800);
  }
  out[screen] = runs;
  out.counts[screen] = {
    dom: document.querySelectorAll('*').length,
    charts: document.querySelectorAll('main [role=img]').length,
  };
}
// Tổng quan: Toàn bộ / Team, period Năm then Lọc; back to Tháng then Lọc.
location.hash = '#/overview';
await wait(1500);
for (const scope of ['Toàn bộ', 'Team']) {
  radio(scope)?.click();
  await wait(600);
  button('Lọc')?.click();
  await wait(800);
  const runs = [];
  for (const kind of ['Năm', 'Tháng', 'Năm', 'Tháng']) {
    radio(kind)?.click();
    await wait(400);
    runs.push({ kind, ...(await timed(() => button('Lọc').click())) });
    await wait(600);
  }
  out[`overviewFilter ${scope}`] = runs;
}
radio('Toàn bộ')?.click();
await wait(500);
// Báo cáo: Toàn bộ, Lọc Năm / Tháng; switch tables.
location.hash = '#/reports';
await wait(1500);
button('Lọc')?.click();
await wait(800);
const reportRuns = [];
for (const kind of ['Năm', 'Tháng', 'Năm', 'Tháng']) {
  radio(kind)?.click();
  await wait(400);
  reportRuns.push({ kind, ...(await timed(() => button('Lọc').click())) });
  await wait(600);
}
out.reportsFilter = reportRuns;
const tableRuns = [];
for (const name of ['Theo RE', 'Theo mốc', 'Theo team']) {
  tableRuns.push({ name, ...(await timed(() => radio(name).click())) });
  await wait(500);
}
out.reportsTables = tableRuns;
return out;
```

### `perf-export.js`

```js
// Probe body (gói F, run by `node cdp.mjs eval perf-export.js` in the exe with the load data):
// Báo cáo → Năm, Lọc, then Xuất Excel three times: click → the "Đã xuất báo cáo" line, with the
// longest stretch the main thread stayed busy (long tasks), and what the Lọc reminder exposes to
// assistive technology. Writes into the copy's exports\ folder only.
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const radio = (name) =>
  [...document.querySelectorAll('[role=radio]')].find((b) => b.textContent.trim() === name);
const button = (name) =>
  [...document.querySelectorAll('button')].find((b) => b.textContent.trim().startsWith(name));
const longTasks = [];
new PerformanceObserver((list) => list.getEntries().forEach((e) => longTasks.push(Math.round(e.duration)))).observe({ type: 'longtask', buffered: false });
location.hash = '#/reports';
await wait(1500);
const out = {};
// The reminder after choosing another period, before Lọc.
radio('Năm').click();
await wait(300);
const reminder = [...document.querySelectorAll('main span')].find((s) => s.textContent.startsWith('Đã đổi kỳ'));
const lọc = button('Lọc');
out.reminder = {
  text: reminder?.textContent,
  role: reminder?.getAttribute('role') ?? null,
  ariaLive: reminder?.closest('[aria-live]')?.getAttribute('aria-live') ?? null,
  filterDescribedBy: lọc.getAttribute('aria-describedby'),
  filterLabel: lọc.getAttribute('aria-label'),
  filterText: lọc.textContent,
};
lọc.click();
await wait(800);
const runs = [];
for (let i = 0; i < 3; i++) {
  longTasks.length = 0;
  const start = performance.now();
  button('Xuất Excel').click();
  for (let n = 0; n < 400; n++) {
    await wait(10);
    const line = [...document.querySelectorAll('[role=status]')].find((p) => p.textContent.startsWith('Đã xuất báo cáo'));
    if (line && !button('Đang xuất')) break;
  }
  runs.push({
    toNoticeMs: Math.round(performance.now() - start),
    longestTaskMs: Math.max(0, ...longTasks),
    notice: [...document.querySelectorAll('[role=status]')].map((p) => p.textContent).join(' | '),
  });
  await wait(800);
}
out.exports = runs;
return out;
```

### `perf-team-write.js`

```js
// Probe body (gói F, run by `node cdp.mjs eval perf-team-write.js` in the exe with the load data):
// Team & nhân sự → rename the first team and back, 3 times each: from the click on "Lưu" to the
// frame after the dialog closed and the screen re-read the data (useQuery → readTeams +
// staffMetrics). Writes into the copy's project2c.db only.
const frame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const button = (name, root = document) =>
  [...root.querySelectorAll('button')].find((b) => b.textContent.trim() === name);
const setValue = (input, value) => {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  setter.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
};
location.hash = '#/team';
await wait(1500);
const original = document.querySelector('[aria-labelledby=team-list-title] button[aria-pressed=true]').firstChild.textContent;
const runs = [];
for (let i = 0; i < 6; i++) {
  button('Đổi tên team').click();
  await wait(400);
  const dialog = document.querySelector('dialog[open]');
  setValue(dialog.querySelector('input'), i % 2 === 0 ? `${original} X` : original);
  await wait(200);
  const start = performance.now();
  button('Lưu', dialog).click();
  await frame();
  runs.push(Math.round(performance.now() - start));
  await wait(700);
}
return { team: original, renameMs: runs };
```

### `contrast.mjs`

```js
// Probe (gói F, trục A): WCAG contrast of the text / background pairs the F-scope screens use
// that gói D / E did not measure (tokens.css values; rgba backgrounds composited over the surface).
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const over = ([r, g, b, a], base) => base.map((c, i) => Math.round([r, g, b][i] * a + c * (1 - a)));
const lum = (rgb) => {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};
const T = {
  bg0: hex('#0b1017'), bg1: hex('#111822'), bg2: hex('#18212d'), bg3: hex('#212c3a'),
  text: hex('#e8edf4'), text2: hex('#aeb9c8'), text3: hex('#8c99ac'), accent: hex('#d9b26a'),
  onAccent: hex('#0b1017'), danger: hex('#f07e7e'), warn: hex('#f0a04b'), ok: hex('#3fd69a'),
  info: hex('#6fa8ff'),
  n4: hex('#94a3b8'), n3: hex('#6fa8ff'), n2: hex('#b49afb'), n1: hex('#3fd69a'),
  onHold: hex('#e3a94f'), lost: hex('#f07e7e'),
};
const accentSoftOn1 = over([217, 178, 106, 0.14], T.bg1);
const pairs = [
  ['Báo cáo: tiêu đề cột N4 (text-n4) on surface-1', T.n4, T.bg1],
  ['Báo cáo: tiêu đề cột N3 (text-n3) on surface-1', T.n3, T.bg1],
  ['Báo cáo: tiêu đề cột N2 (text-n2) on surface-1', T.n2, T.bg1],
  ['Báo cáo: tiêu đề cột N1 (text-n1) on surface-1', T.n1, T.bg1],
  ['Báo cáo: tiêu đề cột Tạm hoãn (text-on-hold) on surface-1', T.onHold, T.bg1],
  ['Báo cáo: tiêu đề cột Mất cơ hội (text-lost) on surface-1', T.lost, T.bg1],
  ['Báo cáo: "Chưa ghi kết quả" (text-appt-unrecorded) on surface-1', T.warn, T.bg1],
  ['Báo cáo / Tổng quan: "—" dimmed (text-fg-3) on surface-1', T.text3, T.bg1],
  ['Thanh Lọc: dòng nhắc (text-accent) on bg-0', T.accent, T.bg0],
  ['Thanh Lọc: "Đang xem" (text-fg-3) on bg-0', T.text3, T.bg0],
  ['Xuất Excel / backup: dòng đã xuất (text-ok) on bg-0', T.ok, T.bg0],
  ['Ô KPI: ▲ (text-ok) on surface-1', T.ok, T.bg1],
  ['Ô KPI: ▼ (text-danger) on surface-1', T.danger, T.bg1],
  ['Tiêu đề thẻ (text-heading = accent) on surface-1', T.accent, T.bg1],
  ['So sánh team: hàng RE (text-fg-2) on surface-0', T.text2, T.bg0],
  ['So sánh team: tiêu đề cột (text-fg-3) on surface-1', T.text3, T.bg1],
  ['Ô N4–N1: "đang ẩn" (text-fg-3) on surface-1', T.text3, T.bg1],
  ['Ô N4–N1: số (text-fg) on surface-2', T.text, T.bg2],
  ['Team: team đang chọn (text-fg) on accent-soft', T.text, accentSoftOn1],
  ['Team: link Sửa (text-accent) on surface-1', T.accent, T.bg1],
  ['Cài đặt: chấm web (bg-info) — không phải chữ, bỏ qua', T.info, T.bg1],
];
for (const [name, fg, bg] of pairs) console.log(`${String(ratio(fg, bg)).padStart(5)}  ${name}`);
```

### `exports.mjs`

```js
// Probe (gói F, trục B): every `export` of routes/{overview,reports,team}, Settings*, FilterBar, applied-filter, and where
// it is used outside its own file (product code vs tests only). Usage: node exports.mjs
import { readdirSync, readFileSync } from 'node:fs';

const ROOT = 'C:/workspace/Project-2C-review/apps/desktop/src';
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(`${dir}/${e.name}`) : /\.(ts|tsx)$/.test(e.name) ? [`${dir}/${e.name}`] : [],
  );
const files = walk(ROOT);
const scope = files.filter(
  (f) =>
    /routes\/(overview\/|reports\/|team\/|FilterBar|Overview|Settings|applied-filter|period-labels)/.test(f) &&
    !f.includes('.test.'),
);
const rows = [];
for (const file of scope) {
  const source = readFileSync(file, 'utf8');
  for (const m of source.matchAll(/^export (?:const|function|type|interface) (\w+)/gm)) {
    const name = m[1];
    const re = new RegExp(`\\b${name}\\b`);
    const users = files.filter((f) => f !== file && re.test(readFileSync(f, 'utf8')));
    const prod = users.filter((f) => !f.includes('.test.'));
    const ownUses = (source.match(new RegExp(`\\b${name}\\b`, 'g')) ?? []).length - 1;
    if (prod.length === 0) {
      rows.push({
        file: file.replace(`${ROOT}/`, ''),
        name,
        ownFileUses: ownUses,
        tests: users.filter((f) => f.includes('.test.')).map((f) => f.split('/').pop()),
      });
    }
  }
}
console.log(JSON.stringify(rows, null, 1));
```

### `build-report.mjs`

```js
// Assembles ..\F.md from the body parts and the probe outputs of this folder. Usage: node build-report.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const HERE = 'C:/workspace/deep-review-1-4/claude/F';
const read = (name) => readFileSync(`${HERE}/${name}`, 'utf8').replaceAll('\r\n', '\n').replace(/^\uFEFF/, '');
const json = (name) => JSON.parse(read(name));

const TABLE = `| Mức \\ Trục | E | C | D | P | B | T | A | S | Tổng |
|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | 0 |
| High | | | | | | | | | 0 |
| Medium | | | | | | | | | 0 |
| Low | | | | | | 2 (F1, F2) | | | 2 |
| Nit | | | | 2 (F3, F6) | 1 (F5) | | 1 (F4) | | 4 |
| **Tổng** | 0 | 0 | 0 | 2 | 1 | 2 | 1 | 0 | **6** |

Tình trạng: 6/6 CONFIRMED (tái hiện chạy thật, mutation, số đo Node + exe, hoặc đọc thuộc tính trong exe). Không có PLAUSIBLE, không có mục trùng \`known.md\`; phần liên quan KNOWN / gói trước ở §4.

**Nhận định chung gói F:** các màn Tổng quan, Báo cáo, Team và Cài đặt **ra số đúng và khớp nhau**: 588 phép so chéo giữa các màn / bảng / chart trên dữ liệu tải cho 10 kỳ và 10 góc nhìn không lệch số nào, file Excel khớp màn hình từng ô (5 746 ô), các nhãn kỳ ở ranh giới năm / kỳ Tùy chọn dài đúng nghĩa. Không thấy đường nào làm mất / sai dữ liệu. Hai phát hiện Low đều là test: một test e2e sẽ đỏ chắc chắn từ 01/01/2027 (CL-F1) và các chỗ test không giữ, chủ yếu ở phần TSX mà chỉ e2e phủ (CL-F2: 14 / 33 mutation TSX sống). Hiệu năng ở mức chấp nhận được (mở màn 100–220 ms, Lọc ≤ 50 ms trên dữ liệu tải); hai điểm Nit (CL-F3, CL-F6) là chỗ đọc / lặp thừa dễ bỏ, phần lớn thời gian còn lại là CL-B8.`;

const unit = json('mutate-results.json');
const ov19 = json('mutate-results-OV19.json');
Object.assign(unit, ov19);
const tally = Object.values(unit).reduce((t, r) => ({ ...t, [r.verdict]: (t[r.verdict] ?? 0) + 1 }), {});
const FILES = {
  OV: 'overview/overview-view.ts',
  SV: 'overview/stage-view.ts',
  SC: 'overview/stage-chart.ts',
  TC: 'overview/team-compare-view.ts',
  RV: 'reports/reports-view.ts',
  RW: 'reports/report-workbook.ts',
  TV: 'team/team-view.ts',
  AP: 'applied-filter.ts',
};
let appendixA =
  '## Phụ lục A — Mutation unit (`mutate-results.json`)\n\n' +
  'Mỗi lượt phục vụ đúng một file đã đổi qua plugin `load` của Vite (repo không bị ghi), chạy 113 test unit của gói F ' +
  `(\`vitest.mut.config.mts\`, \`--bail=1\`). Tổng 94 lượt: ${JSON.stringify(tally)} (OV19 lượt đầu sai mẫu chuỗi, chạy lại sau khi sửa → KILLED). Tiền tố (trong \`apps/desktop/src/routes/\`): ` +
  Object.entries(FILES).map(([k, v]) => `${k} = \`${v}\``).join(', ') +
  '. Chuỗi thay đổi chính xác ở `mutate.mjs` (phụ lục D).\n\n| Mutation | Kết quả | Test bắt được |\n|---|---|---|\n';
for (const [name, r] of Object.entries(unit)) {
  const test = (r.failing ?? '').replace(/^apps\/desktop\/src\/routes\//, '').replace(/\|/g, '\\|');
  appendixA += `| ${name} | ${r.verdict === 'SURVIVED' ? '**SURVIVED**' : r.verdict} | ${test} |\n`;
}

const e2e = json('e2e-mut-results.json');
let appendixB =
  '## Phụ lục B — Mutation TSX và đồng hồ trên e2e (`e2e-mut-results.json`)\n\n' +
  'Mỗi lượt: build web bằng Vite (cấu hình của repo + plugin `load` đổi đúng một file; `VITE_DEMO_ANCHOR=15/09/2026` như e2e) ra `F\\dist-mut`, phục vụ ở cổng **4183**, ' +
  'chạy các spec liên quan bằng `playwright.f.config.ts` (Edge, 4 worker, output `F\\pw-out`). Chỉ chạy spec liên quan đến màn bị đổi. ' +
  'Lượt nền (không đổi gì, 55 test của 7 spec) xanh trước. `YEAR0` / `YEAR1`: bản build không đổi, một test, đồng hồ thật / đồng hồ Node dời sang 05/01/2027 (`fake-year.cjs`).\n\n' +
  '| Lượt | Spec chạy | Kết quả | Test đỏ đầu tiên |\n|---|---|---|---|\n';
for (const [name, r] of Object.entries(e2e)) {
  const specs = r.specs.map((s) => s.replace('.spec.ts', '')).join(', ');
  const verdict = r.verdict === 'SURVIVED' ? '**SURVIVED**' : r.verdict;
  const first = r.verdict === 'GREEN' ? '' : (r.firstFailing ?? '').replace(/─+/g, '').trim().replace(/\|/g, '\\|');
  appendixB += `| ${name} | ${specs} | ${verdict} (${(r.summary ?? []).join(', ')}) | ${first} |\n`;
}

const RESULTS = [
  'probe-consistency.result.json',
  'probe-excel.result.json',
  'probe-edges.result.json',
  'probe-perf.result.json',
  'probe-byre.result.json',
  'probe-count.result.json',
  'perf-screens.result.json',
  'perf-export.result.json',
  'perf-team-write.result.json',
  'contrast.result.txt',
  'exports.result.json',
];
let appendixC =
  '## Phụ lục C — Kết quả probe\n\nSố trong file là lượt chạy cuối (máy rảnh, sau lượt e2e). `perf-team-write` là lượt **không gắn debugger** (`run-detached.ps1`); lượt gắn debugger trước đó (lúc lượt e2e đang chạy song song) ra 525–808 ms, không dùng.\n\n';
for (const name of RESULTS) {
  appendixC += `### \`${name}\`\n\n\`\`\`${name.endsWith('.json') ? 'json' : ''}\n${read(name).trim()}\n\`\`\`\n\n`;
}

const SOURCES = [
  'vitest.probe.config.mts',
  'vitest.mut.config.mts',
  'probe-load.ts',
  'probe-consistency.test.ts',
  'probe-excel.test.ts',
  'probe-edges.test.ts',
  'probe-perf.test.ts',
  'probe-byre.test.ts',
  'probe-count.test.ts',
  'mutate.mjs',
  'e2e-mut.mjs',
  'playwright.f.config.ts',
  'fake-year.cjs',
  'cdp.mjs',
  'detached.mjs',
  'run-detached.ps1',
  'perf-screens.js',
  'perf-export.js',
  'perf-team-write.js',
  'contrast.mjs',
  'exports.mjs',
  'build-report.mjs',
];
const LANG = { mts: 'ts', ts: 'ts', mjs: 'js', cjs: 'js', js: 'js', ps1: 'powershell' };
let appendixD = '## Phụ lục D — Nguồn test tạm / probe\n\nTất cả nằm ở `C:\\workspace\\deep-review-1-4\\claude\\F\\`; `node_modules` là junction tới `node_modules` của worktree review. Cách chạy: PowerShell, trong thư mục `F\\`, `node node_modules/vitest/vitest.mjs run --config vitest.probe.config.mts <probe>`; `node mutate.mjs`; `node e2e-mut.mjs BASE` rồi `node e2e-mut.mjs`; exe chép ở `F\\exe` chạy với `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9335`, rồi `node cdp.mjs eval <file.js>` hoặc `.\\run-detached.ps1 <file.js>`.\n\n';
for (const name of SOURCES) {
  appendixD += `### \`${name}\`\n\n\`\`\`${LANG[name.split('.').pop()] ?? ''}\n${read(name).trim()}\n\`\`\`\n\n`;
}

const body = read('F.body.md')
  .replace('<<E2E-COUNT>>', '43')
  .replace('<<FINDINGS>>', read('F.findings.md').trim())
  .replace('<<TABLE>>', TABLE)
  .replace('<<CHECKED>>', read('F.checked.md').trim())
  .replace(
    '<<TEAM-WRITE>>',
    'mất 149–251 ms từ bấm "Lưu" tới khung hình (6 lần, không gắn debugger; `perf-team-write`), trong đó `staffMetrics` chỉ ≈ 13 ms',
  )
  .replace('<<FT37>>', 'SURVIVED, 9 test của `backup` / `demo-data` vẫn xanh');
const left = body.match(/<<[^>]+>>/g);
if (left) throw new Error(`placeholders left: ${left}`);
writeFileSync(
  'C:/workspace/deep-review-1-4/claude/F.md',
  `${body.trim()}\n\n${appendixA}\n${appendixB}\n${appendixC}${appendixD}`.trimEnd() + '\n',
);
console.log('written');
```
