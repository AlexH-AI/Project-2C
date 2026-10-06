# Review độc lập — Gói D: UI + shell + data + i18n

- Ngày: 05/10/2026, Asia/Saigon.
- Reviewer: Codex, phiên chính; không subagent.
- SHA kiểm đầu và cuối phiên: **f0c53eb57eb7eac8665ad87287e794ae4c5bc43b**, detached HEAD.
- Repo: C:\workspace\Project-2C-review-2.
- Chỉ đọc source repo; không commit, không sửa code sản phẩm, không tạo Issue, không đề xuất merge. git diff rỗng cuối phiên. Các mục untracked .agents/, .codex/, AGENTS.md có sẵn từ đầu phiên.
- Không mở, đọc, liệt kê hoặc tìm kiếm thư mục/báo cáo của reviewer bên kia; không tổng hợp báo cáo khác.
- Probe, patch trong bộ nhớ, cache, build và log: **C:\workspace\deep-review-1-4\codex\C\**, đúng đường dẫn tạm anh yêu cầu dù phiên này là Gói D.
- Phạm vi phiên chỉ D; không đưa kết luận sẵn sàng đóng Phase 4 của Gói H vào báo cáo này.

## 1. Phạm vi đã đọc

Đọc trước: docs/process/deep-review-phase-1-4.md (§1, §4, §5, §7 và quy tắc độc lập), CLAUDE.md, CONTEXT.md, docs/design/phase-3-du-lieu.md, docs/design/phase-4-chi-so.md, toàn bộ bốn golden chi-so.md, kh-theo-nhom.md, kyc.md, lich-hen.md. Golden giữ nguyên theo spec. Đối chiếu common/known.md, common/README.md, common/baseline.md; dùng common/load/load-backup.json.

Đọc toàn bộ source TS/TSX/CSS trong phạm vi D, các test cạnh source, package/config tương ứng. Danh mục file + dòng ở cuối báo cáo. Những phần chính:

- packages/ui/src/components: Button, Chart, chart-theme, Choices, compare-cells, DataTable, Dialog, NavIcon, PeriodPicker, PeriodPicker.label, PolicyBadge, Segmented, SelectField, StageBadge, TextField.
- packages/ui/src: index.ts, token-guard.ts, tokens.css, theme.css, fonts.css; scripts/check-tokens.ts; package.json, tsconfig*.json, CLAUDE.md. Font nhúng được kiểm qua khai báo CSS và danh mục, không giải mã binary font.
- apps/desktop/src/data: app-data.ts, AppDataContext.tsx, persist-queue.ts, tauri-storage.ts, today.ts và cả bốn file test.
- apps/desktop/src/shell: toàn bộ source + test (AppShell, CloseGuard, close-guard, ErrorBoundary, Sidebar, ScopeContext, ScopePicker, scope, RePicker, SaveWarning, StartupError, startup-error, screen-error, routes, useRoute).
- apps/desktop/src/i18n: vi.ts, index.ts, index.test.ts.
- Nối luồng: App.tsx, main.tsx, routes/Screen.tsx; các đoạn gọi component ở AppointmentsScreen, CustomerDialogs, OutcomeDialog, MetFields, PersonDialogs; SettingsBackup cho đường nhập, report-workbook:235–259 cho tên xuất; storage.rs:414–429, lib.rs:35–94, capabilities/default.json cho hợp đồng port Tauri.
- Đọc các e2e liên quan: data-table, chart, navigation, screen-error, backup; đoạn period-picker/customer-forms/appointment-outcome/team liên quan. Không gọi đây là review toàn bộ các route của Gói E/F hoặc toàn bộ Rust của Gói C.

## 2. Kết quả kiểm chứng và số đo

Không chạy lại pnpm verify/e2e toàn repo trong phiên này. Baseline toàn repo là common/baseline.md. Kiểm riêng phiên D:

| Kiểm | Kết quả |
|---|---|
| Unit D, cấu hình ngoài repo | **14 file / 121 test xanh** |
| Cũng 121 test với mutation countRecords.policies = 0 | **121 vẫn xanh** |
| Bảy e2e backup.spec.ts gốc trên server mutant | **7 xanh**, 1 worker Edge, 1,2 phút |
| Test bổ sung ngoài repo, preview có HĐ | Source gốc: xanh, 1.804 HĐ; mutant: **đỏ**, nhận 0 thay vì 1.804 |
| Probe app-data trên backup tải | **2 test xanh** |
| tsc -p packages/ui và -p apps/desktop, noUnusedLocals/noUnusedParameters/noEmit | Xanh |
| Probe DataTable/Dialog/Choices trong Edge | Bảng rỗng, sortable:false, chu kỳ sắp số âm/0/dương đúng; xác nhận CX-D2/CX-D3 |
| Production build đặt ngoài repo, plugin/target/chia chart chunk theo config repo | Xanh; neo ngày 05/10/2026 để hợp bộ tải |
| Production UI, backup tải qua chính màn Cài đặt | Đủ 4 team / 51 người / 1.496 KH / 10.434 lịch / 1.804 HĐ; không pageerror |

Số đo Node/sql.js, 5 lượt, không coverage (ms):

| Thao tác | Các lượt |
|---|---|
| app.readBackup(text tải) | 1.421,06 / 1.702,63 / 1.654,45 / 1.818,26 / 1.656,98 |
| app.importBackup(preview đã kiểm) | 5,22 / 4,56 / 6,75 / 5,99 / 4,24 |
| app.counts() | 115,43 / 121,60 / 130,96 / 143,44 / 137,10 |
| app.exportBackup() | 250,24 / 304,54 / 375,87 / 399,09 / 351,96 |
| app.run(createTeam), có export snapshot để lưu | 5,28 / 5,77 / 4,19 / 3,94 / 3,88 |

Snapshot sau thay đổi: **13.074.432 byte**. StoragePort của probe giữ byte trong bộ nhớ, vì vậy số này **không đo ghi đĩa/Tauri thật**. Lỗi save sau reload được giữ ở saves.failed(); dữ liệu mới vẫn trong RAM, flush thành công khi port hết lỗi. Không suy diễn trường hợp này là mất dữ liệu hay phát hiện mới.

Edge **154.0.4258.53**, production, viewport 1440×1000, một browser/page, chạy tuần tự. Lượt cuối lưu production-results.json:

- Mở web với seed tới Cài đặt: 3.610,61 ms.
- Chọn backup tải tới hộp xác nhận: 2.209,21 ms (bao gồm đọc file + kiểm + count/render).
- Năm 2026: **7.071 dòng, 56.568 ô td**.
- Đổi Tháng → Năm, click tới bảng đủ dòng: **1.313,80 / 1.138,01 / 1.350,27 / 1.640,60 / 1.416,86 ms**.
- Click header Khách hàng bằng Playwright: **1.382,54 / 1.237,97 / 1.819,25 / 1.646,31 / 1.265,57 ms**.
- Click trực tiếp trong page + chờ hai requestAnimationFrame (bỏ chi phí actionability/scroll của Playwright): **1.186,20 / 952,70 / 939,60 / 1.543,30 / 952,10 ms**. Đây là thời gian tương tác đến frame, không phải phép tách riêng CPU của thuật toán sort.
- Probe dev React Profiler riêng: render ứng với Năm khoảng 609–735 ms; chỉ dùng bổ trợ, **không lấy số dev làm số production**.
- Chuỗi HĐ trong hộp nhập gốc đúng: 1.804 HĐ. CX-D4 nói về test thiếu, không nói code gốc đang đếm HĐ sai.

## 3. Phát hiện

### CX-D1 — Bảng dựng toàn bộ dòng khiến sắp bảng năm chậm rõ rệt

- **ID:** CX-D1
- **Mức:** Medium
- **Trục:** P
- **Vị trí:** packages/ui/src/components/DataTable.tsx:146–158; caller apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:303–309 (**f0c53eb**).
- **Tình trạng:** CONFIRMED.
- **Mô tả:** DataTable render mọi hàng và mọi ô của getRowModel(), không giới hạn phần nhìn thấy. Một kỳ Năm hợp lệ trên bộ tải dựng 7.071 dòng × 8 cột; mỗi lần sắp lại phải cập nhật bảng DOM rất lớn.
- **Tái hiện / bằng chứng:** chạy node C:/workspace/deep-review-1-4/codex/C/production-probe.mjs. Script build ngoài repo, nhập common/load/load-backup.json qua Cài đặt, mở Lịch hẹn → Năm 2026 rồi bấm sắp Khách hàng. production-results.json xác nhận 56.568 td; sắp trực tiếp trong page tới hai frame tốn 939,60–1.543,30 ms, median 952,70 ms. Lệnh Playwright tốn 1.237,97–1.819,25 ms. Không lỗi console/page.
- **Ảnh hưởng:** người dùng xem lịch cả năm hoặc danh sách lớn sẽ thấy gần một giây hoặc hơn cho mỗi lần đổi sắp, kể cả trên dữ liệu tải đã thống nhất, không cần dữ liệu lớn hơn giả định.
- **Đề xuất:** giới hạn số dòng DOM bằng phân trang hoặc cách hiển thị phù hợp với thiết kế đã duyệt; giữ đúng sort toàn bộ tập trước khi cắt trang. Nếu dùng thư viện mới thì cần G4; không cần dependency mới để phân trang. Ước lượng một hướng phân trang dưới 400 dòng SP, cần quyết định UI khi thực hiện; test hiệu năng phải giữ dữ liệu này và ngưỡng có số đo.
- **Giới hạn:** số đo trên web production Edge, không phải exe/WebView2 thực tế; không quy toàn bộ độ trễ cho comparator.

### CX-D2 — Hủy/Escape hộp thoại không trả focus về nút mở

- **ID:** CX-D2
- **Mức:** Medium
- **Trục:** A
- **Vị trí:** packages/ui/src/components/Dialog.tsx:20–22, 29–33 (**f0c53eb**).
- **Tình trạng:** CONFIRMED.
- **Mô tả:** component chỉ gọi showModal() khi mount, không đóng dialog/khôi phục focus khi caller unmount. onCancel còn preventDefault rồi giao caller tháo node, nên bỏ bước đóng native vốn trả focus.
- **Tái hiện / bằng chứng:** node .../codex/C/browser-probe.mjs: opener → dialog → Hủy hoặc Escape; cả hai đều document.activeElement = BODY. Kiểm lại bằng app production thật trong production-probe.mjs: Khách hàng → + Khách hàng → Hủy cũng ra BODY; Tab kế tiếp đi vào link KH “Lê Minh Thảo…” thay vì giữ vị trí ở nút + Khách hàng. JSON lưu activeElement/href.
- **Ảnh hưởng:** thao tác bàn phím/trình đọc màn hình bị mất vị trí sau các hộp thoại dùng chung; phải tìm lại trigger hoặc điểm thao tác. Bẫy Tab khi hộp đang mở vẫn hoạt động native; không báo sai thành lỗi thoát modal.
- **Đề xuất:** quản lý đóng/cleanup dialog và khôi phục focus vào trigger còn tồn tại; kiểm cả Hủy, Escape, Lưu và đổi hộp thoại. Test bằng Edge có trigger thực. Ước lượng dưới 40 dòng SP, cộng e2e.
- **Giới hạn:** không chạy screen reader thật; chứng cứ là focus DOM và điều hướng Tab của Edge.

### CX-D3 — Choices che dấu bắt buộc nhưng không cung cấp trạng thái bắt buộc cho trợ năng

- **ID:** CX-D3
- **Mức:** Low
- **Trục:** A
- **Vị trí:** packages/ui/src/components/Choices.tsx:32–42, 50–57; caller MetFields.tsx:78–92, OutcomeDialog.tsx:155–174 (**f0c53eb**).
- **Tình trạng:** CONFIRMED.
- **Mô tả:** required chỉ thêm dấu * với aria-hidden=true. Các radio không có aria-required/native required và nhóm cũng không có semantics required, khác TextField/SelectField đã truyền aria-required.
- **Tái hiện / bằng chứng:** browser-probe.mjs mount Choices required; cả hai radio chọn được đều required=false, aria-required=null. Legend chỉ đọc nhãn vì dấu sao đã bị ẩn. Trong app, nhóm Trạng thái và Nhóm sau cuộc gặp dùng chính prop required này.
- **Ảnh hưởng:** người dùng trợ năng không được báo trước nhóm phải chọn; chỉ biết khi submit bị kiểm nghiệp vụ từ chối. Kiểm nghiệp vụ hiện có vẫn chặn thiếu lựa chọn, nên đây không phải lỗi ghi dữ liệu thiếu.
- **Đề xuất:** khai báo trạng thái bắt buộc bằng semantics radio group/radio phù hợp, giữ chính sách kiểm bằng lệnh của app; không nhất thiết bật browser validation. Thêm assertion required trong accessibility snapshot/e2e. Ước lượng dưới 20 dòng SP.

### CX-D4 — Test đếm backup không bắt việc mất toàn bộ số HĐ

- **ID:** CX-D4
- **Mức:** Low
- **Trục:** T
- **Vị trí:** apps/desktop/src/data/app-data.test.ts:447–466; app-data.ts:327; e2e/backup.spec.ts:44–46, 65–68 (**f0c53eb**).
- **Tình trạng:** CONFIRMED.
- **Mô tả:** test preview dùng fixture chỉ có team, nên policies=0 là kết quả đúng duy nhất được assert. E2E kiểm cụ thể phần team/người/KH, không khẳng định số HĐ. Patch đúng một dòng đưa countRecords.policies về 0 vẫn qua cả suite D và bảy e2e backup.
- **Tái hiện / bằng chứng:** loader trong vitest.mutation.config.mts/mutation-server.mjs thay policies: listPolicies(db).length bằng policies: 0 **chỉ trong bộ nhớ**, giữ file repo gốc. unit-baseline.log: 121 xanh; unit-mutation.log: 121 xanh; e2e-mutation.log: 7 xanh. Test ngoài repo mutation-proof.test.ts đọc bộ tải: gốc previewPolicies=1804 xanh; mutant previewPolicies=0 đỏ. proof-mutation.log có assertion expected 1804, received 0, chứng minh mutant thực sự chạy.
- **Ảnh hưởng:** regression làm hộp xác nhận nhập/file card hiện 0 HĐ trong backup có HĐ có thể qua CI hiện tại. Không kết luận code gốc đang mất HĐ hoặc đang sai count.
- **Đề xuất:** fixture nhỏ có KH, lịch và HĐ còn hiệu lực + đã xóa; assert đủ năm count và bỏ con của KH đã xóa đúng hợp đồng. Ít nhất e2e assert số HĐ >0 trong dữ liệu biết trước. Không cần code SP mới; khoảng 40–100 dòng test.

### CX-D5 — Key app.subtitle không còn nơi sử dụng

- **ID:** CX-D5
- **Mức:** Nit
- **Trục:** B
- **Vị trí:** apps/desktop/src/i18n/vi.ts:4 (**f0c53eb**).
- **Tình trạng:** CONFIRMED.
- **Mô tả:** app.subtitle nằm trong dictionary nhưng không được tham chiếu bởi source/caller. Đây là dữ liệu chết nhỏ, không phải vấn đề đặt tên hay phong cách.
- **Tái hiện / bằng chứng:** node .../codex/C/i18n-audit.mjs dùng TypeScript AST quét literal/template với tiền tố key trong app/UI: 759 key, candidate duy nhất app.subtitle. Kiểm thêm rg -n 'app.subtitle' apps packages tools e2e --glob '!*.test.*' chỉ trả dòng khai báo vi.ts:4; không có t() động tiền tố app. dùng key này.
- **Ảnh hưởng:** chỉ tăng phần dictionary cần bảo trì; không lỗi hành vi và không có ý nghĩa đáng kể về bundle.
- **Đề xuất:** bỏ key khi chạm dictionary tiếp theo nếu không có yêu cầu dùng lại. Một dòng, dưới 400 dòng SP; không cần task riêng chỉ vì mục này.

## 4. Bảng đếm mức × trục

Mỗi phát hiện tính một lần theo trục chính. KNOWN không tính vào bảng phát hiện mới.

| Mức | E | C | D | P | B | T | A | S | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 2 |
| Low | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 1 |
| **Tổng** | **0** | **0** | **0** | **1** | **1** | **1** | **2** | **0** | **5** |

**5 CONFIRMED, 0 PLAUSIBLE.** Không tìm thấy phát hiện Critical/High mới trong D; không dùng kết quả riêng D để kết luận cho toàn Phase 4.

## 5. Đã xét, không thấy / các trục đã đi qua

| Trục | Kết luận và cách xét |
|---|---|
| **E** | **Đã xét, không thấy phát hiện mới độc lập.** Đọc/chạy test compare số, ngày, tiếng Việt, thenBy rỗng và khác ngày; probe DOM bảng 0 dòng, sortable:false, số -1/0/10, chu kỳ none→asc→desc; đọc routing percent escape/trailing slash, scope khi team/RE biến mất; chạy today test ranh giới 31/10→1/11, wake/hidden/unsubscribe; đọc giới hạn ngày/kỳ theo golden/spec và test nhãn. Các thao tác replace chồng nhau là KNOWN S-2, không biến thành phát hiện mới. |
| **C** | **Đã xét, không thấy phát hiện mới ngoài những mục trợ năng/hiệu năng đã tách ở trên.** DataTable sort label/aria-sort/order đồng nhất trong probe; scope fallback/RE-team theo test; i18n count có phân nghìn, year giữ nguyên; AppData run thất bại không đổi revision, readBackup không đổi DB; các golden là chuẩn, không sửa để chiều code. Hợp đồng đếm ở source gốc cho bộ tải khớp cả 5 số. |
| **D** | **Đã xét, không thấy lỗi mất/sai dữ liệu mới ngoài KNOWN.** Trace persist queue drain/failed/lost/flush, seed DB riêng và chỉ snapshot hoàn chỉnh, previous DB close sau đổi, lỗi mở/backup giữ DB cũ. Chạy test/probe backup hỏng không đổi identity/revision, save failure giữ data trong RAM và flush phục hồi. Các ràng buộc chi tiết bảng thuộc B; không tuyên bố đã kiểm toàn schema trong D. |
| **P** | Đã xét, **có CX-D1**. Đo read/count/export/replace và render/sort bảng trên đúng load-backup; phân biệt port RAM với ghi file thật. Đọc Chart useEffect init/dispose/resize, AppDataContext useMemo/useSyncExternalStore và AppShell query ổn định; chưa có số đo chỉ ra regression Chart nên không ghi thêm một phát hiện P suy đoán. |
| **B** | Đã xét, **có CX-D5**. tsc noUnused hai vùng xanh; đọc public index/codemap/caller, kiểm PolicyBadge thực sự có dùng, DataTableSort có dùng trong prop. AST + rg tìm key chết. Không coi CSS font variants và helper chỉ dùng bởi test nhưng thuộc public API là code cần xóa. Lặp BUTTON/CloseGuard và token-guard flex đã KNOWN; không có bằng chứng mới cho lặp ≥3 nơi trong D. |
| **T** | Đã xét, **có CX-D4**. 121 test xanh source gốc; mutation đúng một dòng ngoài repo sống qua 121 unit +7 e2e; regression probe mới giết mutant. Đọc coverage config: UI TSX/hooks/component không được coverage unit đầy đủ, e2e là bằng chứng nối UI; không dùng tỷ lệ baseline để suy ra component đã được kiểm hết. Không tự thêm công cụ test component. |
| **A** | Đã xét, **có CX-D2/CX-D3**. Đọc labels, aria-sort, aria-current/pressed, native dialog, input description/error, Segmented roving tab/arrow, i18n và format domain. Probe Tab trong dialog không vào opener/background; Hủy/Escape mất focus; required thiếu ARIA. Token màu/viền và Chart chỉ có role=img không có dữ liệu cho screen reader là KNOWN; không đọc screen reader thật hay đo tương phản lại toàn theme nên không tuyên bố QA WCAG đầy đủ. |
| **S** | **Đã xét, không thấy phát hiện mới trong phạm vi hẹp D.** readBackup gọi importBackup kiểm JSON/bất biến trên DB tạm, đóng DB tạm; port gọi openFolder bằng enum, không truyền đường dẫn tùy ý; filename backup từ localFileStamp; reportFileName slug + giới hạn độ dài; export_write lấy header rồi storage is_export_name giới hạn ASCII/ký tự/extension trước ghi vào exports. capabilities không cấp filesystem/shell tổng quát. Test adapter kiểm raw bytes/header, error từ Rust truyền lên. Không pentest exe/Rust race/ACL Windows trong D; phần đó là C. Hash KYC là KNOWN S-1/D-1. |

## 6. KNOWN đã đối chiếu

Không tính lại thành CX-D mới vì chưa có bằng chứng mới:

- **S-2** (#96/#192/#206): ghi trong khoảng backup/replace, hai replace chồng nhau, cửa sổ opening; ACCEPTED điều kiện mine === current || mine === opening trong app-data.
- **DataTable Phase 1**: thiếu test rỗng/sortable:false; probe hiện xác nhận hành vi source gốc đúng. cellClass chủ yếu e2e, chưa có framework unit component (#240/#227).
- **Chart/StageBlock P8/P12/T2**: role=img chỉ có nhãn, chưa cung cấp dữ liệu từng cột cho screen reader.
- **CloseGuard #125**: đóng lúc seed nạp lại, thiếu dấu đang lưu, thiếu nối React test; BUTTON lặp. Settings mất khả năng retry qua nạp lại sau save fail (#96/#87) vẫn đã biết.
- **Token G3 R4**: tương phản viền/mũi tên; token-guard flex (#247); untilMidnight đặt ngoài domain và ngày chọn lịch không tự nhảy qua nửa đêm (ACCEPTED #334/#318).
- **S-1/D-1**: hash KYC backup chưa kiểm/tính lại. Không báo lại từ D.

## 7. Lệnh tái chạy và giới hạn

Các script dùng thư viện đã cài của chính repo, không tải/cài tool mới. Mọi loader mutation/HTML harness/source đều nằm ngoài repo. Server probe là localhost headless, không chạm phiên trình duyệt người dùng.

Chạy từ repo:

~~~powershell
pnpm exec vitest run --config C:/workspace/deep-review-1-4/codex/C/vitest.probe.config.mts
pnpm exec vitest run --config C:/workspace/deep-review-1-4/codex/C/vitest.mutation.config.mts
$env:MUTATION='policies-zero'
pnpm exec vitest run --config C:/workspace/deep-review-1-4/codex/C/vitest.mutation.config.mts
Remove-Item Env:MUTATION
node C:/workspace/deep-review-1-4/codex/C/browser-probe.mjs
node C:/workspace/deep-review-1-4/codex/C/production-probe.mjs
node C:/workspace/deep-review-1-4/codex/C/i18n-audit.mjs
~~~

Mutation e2e: chạy mutation-server.mjs (1433), rồi pnpm exec playwright test --config .../C/playwright.mutation.config.mjs, dừng server khi xong. Cấu hình này chỉ chạy backup.spec.ts. Test proof dùng PROOF=1, có/không MUTATION; lượt mutant **phải đỏ**.

Các lỗi cấu hình probe ban đầu (alias Vitest CJS/Playwright CJS và alias CSS) đã sửa **trong probe ngoài repo**, không phải lỗi sản phẩm. Log/nguồn cuối đủ tái chạy. Không dùng scan key AST để khẳng định toàn bộ key động đều còn cần; mục CX-D5 được kiểm thêm bằng rg.

## 8. Phụ lục nguồn probe / patch tạm

Patch duy nhất của thử phá:

~~~diff
--- apps/desktop/src/data/app-data.ts (source chỉ đọc)
+++ loader trong codex/C (không ghi vào repo)
@@ countRecords
-    policies: listPolicies(db).length,
+    policies: 0,
~~~

Nguồn thực tế các file tạm và danh mục file đã đọc được chép nguyên văn bên dưới; mutant-app-data.ts là bản 329 dòng được loader tạo, không lặp toàn bộ source sản phẩm trong báo cáo.


### vitest.probe.config.mts

~~~text

import { createRequire } from 'node:module';
const repo='C:/workspace/Project-2C-review-2';
const scratch='C:/workspace/deep-review-1-4/codex/C';
const req=createRequire(repo+'/package.json');
export default {
 root:repo, cacheDir:scratch+'/vitest-cache',
 resolve:{alias:{vitest:req.resolve('vitest/package.json').replace('package.json','dist/index.js'), '@p2c/domain':repo+'/packages/domain/src/index.ts','@p2c/db':repo+'/packages/db/src/index.ts'}},
 test:{disableConsoleIntercept:true,include:[scratch+'/probe.test.ts'],coverage:{enabled:false},testTimeout:30000},
};




~~~

### probe.test.ts

~~~text

import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { expect,it } from 'vitest';
import { openAppData, countRecords } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/data/app-data.ts';
import { createTeam, listTeams, openDatabase } from '@p2c/db';
import { calendarDate } from '@p2c/domain';
const text=readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json','utf8');
const times=(tag:string,values:number[])=>console.log(tag,JSON.stringify(values.map(x=>+x.toFixed(2))));
it('load measurements and failure isolation',async()=>{
 const app=await openAppData({seed:()=>{},today:()=>calendarDate(2026,10,5)});
 const read:number[]=[],replace:number[]=[],counts:number[]=[],exports:number[]=[];
 for(let n=0;n<5;n++){
  let t=performance.now();const p=await app.readBackup(text);read.push(performance.now()-t);
  t=performance.now();await app.importBackup(p);replace.push(performance.now()-t);
  t=performance.now();const c=app.counts();counts.push(performance.now()-t);
  expect(c).toMatchObject({customers:1496,appointments:10434,people:51});
  t=performance.now();await app.exportBackup();exports.push(performance.now()-t);
 }
 times('readBackup_ms',read);times('importPreview_ms',replace);times('counts_ms',counts);times('exportBackup_ms',exports);
 const before=app.db(),revision=app.revision();
 for(const bad of ['{','{}','{"format":"project2c-backup","schemaVersion":999,"exportedAt":"x","tables":{}}']){
  await expect(app.readBackup(bad)).rejects.toBeDefined();
  expect(app.db()).toBe(before);expect(app.revision()).toBe(revision);
 }
 app.db().sqlite.close();
});
it('file persist timing on load dataset and failed replacement save',async()=>{
 const prep=await openAppData({seed:()=>{}});const preview=await prep.readBackup(text);prep.db().sqlite.close();
 const saved:number[]=[];let onDisk=preview.bytes;let fail=false;
 const storage={load:async()=>onDisk,save:async(b:Uint8Array)=>{if(fail)throw Error('disk full');onDisk=b;saved.push(b.length)},
 backup:async()=> 'backup.db',writeExport:async(n:string)=>n,latestBackup:async()=>undefined,openFolder:async()=>{}};
 const app=await openAppData({storage,seed:db=>createTeam(db,{name:'Replacement'}),today:()=>calendarDate(2026,10,5)});
 const writes:number[]=[];
 for(let n=0;n<5;n++){const t=performance.now();app.run(db=>createTeam(db,{name:'Probe '+n}));writes.push(performance.now()-t);await app.saves.idle();}
 times('runCreateTeam_full_snapshot_ms',writes);console.log('snapshot_bytes',saved.at(-1));
 fail=true;await app.reloadDemoData();await app.saves.idle();
 console.log('replacement_write_failure',JSON.stringify({resolved:true,failed:app.saves.failed(),liveTeams:listTeams(app.db()).map(t=>t.name)}));
 fail=false;await app.saves.flush();expect(app.saves.failed()).toBe(false);
 app.db().sqlite.close();
});


~~~

### ui-harness.tsx

~~~text

import React,{useState,Profiler} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {DataTable,Dialog,Choices,Segmented,TextField,Chart} from 'C:/workspace/Project-2C-review-2/packages/ui/src/index.ts';
import {App} from 'C:/workspace/Project-2C-review-2/apps/desktop/src/App.tsx';
import {openAppData} from 'C:/workspace/Project-2C-review-2/apps/desktop/src/data/app-data.ts';
import {calendarDate} from '@p2c/domain';
import 'C:/workspace/Project-2C-review-2/apps/desktop/src/index.css';
const root=createRoot(document.getElementById('root')!);
const measurements:any[]=[];
const record=(id:any,phase:any,actual:any)=>measurements.push({id,phase,actual});
const cols=[
{id:'key',kind:'text',header:'Khóa',value:(r:any)=>r.key,sortable:false},
{id:'name',kind:'text',header:'Tên',value:(r:any)=>r.name},
{id:'n',kind:'number',header:'Số',value:(r:any)=>r.n},
];
function Harness(){
 const [dialog,setDialog]=useState(false),[value,setValue]=useState<string|null>(null),[rows,setRows]=useState([{key:'a',name:'Đào',n:10},{key:'b',name:'An',n:-1},{key:'c',name:'Ân',n:0}]);
 (window as any).setRows=(rows:any)=>flushSync(()=>setRows(rows));
 return <><button id="before">Trước</button><button id="opener" onClick={()=>setDialog(true)}>Mở hộp</button><button id="after">Sau</button>
 <Choices label="Chọn bắt buộc" required options={[{value:'a',label:'Một'},{value:'b',label:'Hai'},{value:'c',label:'Khóa',disabled:true}]} value={value} onChange={setValue}/>
 <TextField label="Text bắt buộc" required value="" onChange={()=>{}}/>
 <DataTable label="Probe" columns={cols as any} rows={rows} getRowId={r=>r.key}/>
 {dialog&&<Dialog title="Hộp probe" onClose={()=>setDialog(false)} actions={<button id="closer" onClick={()=>setDialog(false)}>Hủy</button>}><input id="field" aria-label="Ô probe"/></Dialog>}</>;
}
function showHarness(){flushSync(()=>root.render(<Profiler id="harness" onRender={record}><Harness/></Profiler>));}
showHarness();
(window as any).probe={measurements,showHarness,async mountApp(){
 const t=performance.now();const data=await openAppData({seed:()=>{},today:()=>calendarDate(2026,10,5),locateFile:()=>'/wasm'});
 const text=await (await fetch('/load.json')).text();
 const p=await data.readBackup(text);await data.importBackup(p);
 const ready=performance.now();(window as any).appData=data;
 location.hash='#/appointments';
 flushSync(()=>root.render(<Profiler id="app" onRender={record}><App data={data}/></Profiler>));
 return {readImportMs:ready-t,renderMs:performance.now()-ready,counts:data.counts()};
}};


~~~

### index.html

~~~text
<html lang="vi"><head><meta charset="UTF-8"></head><body><div id="root"></div><script type="module" src="/ui-harness.tsx"></script></body></html>

~~~

### browser-probe.mjs

~~~text

import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';
const repo='C:/workspace/Project-2C-review-2', scratch='C:/workspace/deep-review-1-4/codex/C';
const req=createRequire(repo+'/package.json'), desktop=createRequire(repo+'/apps/desktop/package.json'),dbreq=createRequire(repo+'/packages/db/package.json');
const {createServer}=await import(pathToFileURL(desktop.resolve('vite')).href);
const react=(await import(pathToFileURL(desktop.resolve('@vitejs/plugin-react')).href)).default;
const tailwind=(await import(pathToFileURL(desktop.resolve('@tailwindcss/vite')).href)).default;
const {chromium}=req('@playwright/test');
const aliases=[{find:'@p2c/ui/theme.css',replacement:repo+'/packages/ui/src/theme.css'},{find:/^react$/,replacement:desktop.resolve('react')},{find:'react/jsx-runtime',replacement:desktop.resolve('react/jsx-runtime')},
{find:'react/jsx-dev-runtime',replacement:desktop.resolve('react/jsx-dev-runtime')},{find:/^react-dom$/,replacement:desktop.resolve('react-dom')},
{find:'react-dom/client',replacement:desktop.resolve('react-dom/client')},
{find:'@p2c/domain',replacement:repo+'/packages/domain/src/index.ts'},{find:'@p2c/db',replacement:repo+'/packages/db/src/index.ts'},{find:/^@p2c\/ui$/,replacement:repo+'/packages/ui/src/index.ts'}];
const server=await createServer({configFile:false,root:scratch,cacheDir:scratch+'/vite-cache',plugins:[react(),tailwind(),{name:'probe-data',configureServer(s){s.middlewares.use((req,res,next)=>{
if(req.url==='/load.json'){res.setHeader('Content-Type','application/json');res.end(readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json'));return}
if(req.url==='/wasm'){res.setHeader('Content-Type','application/wasm');res.end(readFileSync(dbreq.resolve('sql.js/dist/sql-wasm.wasm')));return}next();
})}}],resolve:{alias:aliases},server:{host:'127.0.0.1',port:1432,strictPort:true,fs:{allow:[repo,scratch]}}});
await server.listen();const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const results={};
try{
await page.goto('http://127.0.0.1:1432/');await page.waitForFunction(()=>window.probe);
const table=page.getByRole('table',{name:'Probe'});
results.sortableFalse={buttons:await table.getByRole('columnheader',{name:'Khóa'}).getByRole('button').count(),aria:await table.getByRole('columnheader',{name:'Khóa'}).getAttribute('aria-sort')};
results.sortCycle=[];
for(let n=0;n<3;n++){await table.getByRole('button',{name:'Số'}).click();results.sortCycle.push({aria:await table.getByRole('columnheader',{name:'Số'}).getAttribute('aria-sort'),values:await table.locator('tbody tr td:nth-child(3)').allTextContents()});}
await page.evaluate(()=>window.setRows([]));results.empty=await table.locator('tbody tr').count();
results.choicesRequired=await page.locator('input[type=radio]').evaluateAll(es=>es.map(e=>({required:e.required,aria:e.getAttribute('aria-required'),disabled:e.disabled})));
await page.locator('#opener').click();await page.locator('#field').focus();
results.dialogTrap=[];for(let n=0;n<4;n++){await page.keyboard.press('Tab');results.dialogTrap.push(await page.evaluate(()=>document.activeElement.id));}
await page.getByRole('button',{name:'Hủy',exact:true}).click();results.focusAfterCancel=await page.evaluate(()=>({tag:document.activeElement.tagName,id:document.activeElement.id}));
await page.locator('#opener').click();await page.keyboard.press('Escape');results.focusAfterEscape=await page.evaluate(()=>({tag:document.activeElement.tagName,id:document.activeElement.id}));
results.mountApp=await page.evaluate(()=>window.probe.mountApp());await page.getByRole('heading',{level:1}).waitFor();
results.year=[];
for(let n=0;n<3;n++){
 await page.getByRole('radio',{name:'Tháng',exact:true}).click();
 const t=performance.now();await page.getByRole('radio',{name:'Năm',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('output')?.textContent?.includes('Năm'));
 results.year.push({wallMs:performance.now()-t,rows:await page.getByRole('table',{name:'Danh sách lịch hẹn'}).locator('tbody tr').count()});
}
results.react=await page.evaluate(()=>window.probe.measurements);
results.errors=errors;console.log(JSON.stringify(results,null,2));writeFileSync(scratch+'/browser-results.json',JSON.stringify(results,null,2));
}finally{await browser.close();await server.close();}




~~~

### production-probe.mjs

~~~text

import {createRequire} from 'node:module';import {pathToFileURL} from 'node:url';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';import {createServer} from 'node:http';import {join,extname,resolve} from 'node:path';
const repo='C:/workspace/Project-2C-review-2',scratch='C:/workspace/deep-review-1-4/codex/C';
const req=createRequire(repo+'/package.json'),desktop=createRequire(repo+'/apps/desktop/package.json');
const {build}=await import(pathToFileURL(desktop.resolve('vite')).href);
const react=(await import(pathToFileURL(desktop.resolve('@vitejs/plugin-react')).href)).default;
const tailwind=(await import(pathToFileURL(desktop.resolve('@tailwindcss/vite')).href)).default;
await build({configFile:false,root:repo+'/apps/desktop',cacheDir:scratch+'/build-cache',plugins:[react(),tailwind()],
 define:{'import.meta.env.VITE_DEMO_ANCHOR':JSON.stringify('05/10/2026')},
 build:{outDir:scratch+'/prod',emptyOutDir:true,target:'es2023',chunkSizeWarningLimit:600,rolldownOptions:{output:{codeSplitting:{groups:[{name:'chart',test:/node_modules[\\/](?:\.pnpm[\\/])?(?:echarts|zrender)/}]}}}}});
const dist=resolve(scratch+'/prod');
const server=createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');const name=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname).slice(1);
 const path=resolve(dist,name);if(!path.startsWith(dist+'/') && !path.startsWith(dist+'\\')){res.statusCode=403;res.end();return}
 if(!existsSync(path)){res.statusCode=404;res.end();return}
 const type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.wasm':'application/wasm','.svg':'image/svg+xml'}[extname(path)];
 if(type)res.setHeader('Content-Type',type);res.end(readFileSync(path));
});await new Promise(r=>server.listen(1434,'127.0.0.1',r));
const {chromium}=req('@playwright/test');const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},locale:'vi-VN'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const results={browser:await browser.version(),viewport:'1440x1000',mode:'production'};
try{
 let t=performance.now();await page.goto('http://127.0.0.1:1434/#/settings');await page.getByRole('heading',{level:1,name:'Cài đặt'}).waitFor();
 results.seedOpenMs=performance.now()-t;
 t=performance.now();await page.getByLabel('Nhập backup',{exact:true}).setInputFiles('C:/workspace/deep-review-1-4/common/load/load-backup.json');
 const dialog=page.getByRole('dialog',{name:'Thay toàn bộ dữ liệu?'});await dialog.waitFor();results.readBackupDialogMs=performance.now()-t;
 results.confirmCounts=await dialog.innerText();await dialog.getByRole('button',{name:'Thay dữ liệu',exact:true}).click();await dialog.waitFor({state:'hidden'});
 await page.getByRole('navigation').getByRole('link',{name:'Khách hàng',exact:true}).click();
 await page.getByRole('button',{name:'+ Khách hàng',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Hủy',exact:true}).click();
 results.realDialogFocus=await page.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.textContent?.slice(0,100)}));
 await page.keyboard.press('Tab'); results.realDialogAfterTab=await page.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.textContent,href:document.activeElement.getAttribute('href')})); await page.getByRole('navigation').getByRole('link',{name:'Lịch hẹn',exact:true}).click();
 results.year=[];results.sort=[];results.sortMainThread=[];
 for(let n=0;n<5;n++){
  await page.getByRole('radio',{name:'Tháng',exact:true}).click();
  t=performance.now();await page.getByRole('radio',{name:'Năm',exact:true}).click();
  const table=page.getByRole('table',{name:'Danh sách lịch hẹn'});await table.locator('tbody tr').nth(7070).waitFor({state:'attached'});
  results.year.push({wallMs:performance.now()-t,rows:await table.locator('tbody tr').count(),cells:await table.locator('tbody td').count()});
  t=performance.now();await table.getByRole('columnheader',{name:'Khách hàng',exact:true}).getByRole('button').click();
  results.sort.push(performance.now()-t); results.sortMainThread.push(await table.getByRole('columnheader',{name:'Khách hàng',exact:true}).getByRole('button').evaluate(async el=>{const t=performance.now();el.click();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return performance.now()-t;}));
 }
 results.errors=errors;writeFileSync(scratch+'/production-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();await new Promise(r=>server.close(r));}




~~~

### vitest.mutation.config.mts

~~~text

import {readFileSync,writeFileSync} from 'node:fs'; import {createRequire} from 'node:module'; const req=createRequire('C:/workspace/Project-2C-review-2/package.json');
const repo='C:/workspace/Project-2C-review-2',scratch='C:/workspace/deep-review-1-4/codex/C';
const mutation=process.env.MUTATION;
export default {
 resolve:{alias:{vitest:req.resolve('vitest/package.json').replace('package.json','dist/index.js')}},root:repo,cacheDir:scratch+'/unit-cache',
 plugins:[{name:'outside-repo-mutation',enforce:'pre',load(id){
  if(mutation && id.replaceAll('\\','/').endsWith('/apps/desktop/src/data/app-data.ts')){
   const source=readFileSync(id,'utf8');
   const code=source.replace('policies: listPolicies(db).length','policies: 0');
   if(code===source)throw Error('Mutation not applied');
   writeFileSync(scratch+'/mutant-app-data.ts',code);
   return code;
  }
 }}],
 test:{include:process.env.PROOF ? [scratch+'/mutation-proof.test.ts'] : ['apps/desktop/src/{data,shell,i18n}/**/*.test.ts','packages/ui/src/**/*.test.ts'],coverage:{enabled:false},disableConsoleIntercept:true},
};



~~~

### mutation-server.mjs

~~~text

import { createRequire } from 'node:module';import { pathToFileURL } from 'node:url';import {readFileSync,writeFileSync} from 'node:fs';
const repo='C:/workspace/Project-2C-review-2',scratch='C:/workspace/deep-review-1-4/codex/C',desktop=createRequire(repo+'/apps/desktop/package.json');
const {createServer}=await import(pathToFileURL(desktop.resolve('vite')).href);
const react=(await import(pathToFileURL(desktop.resolve('@vitejs/plugin-react')).href)).default,tailwind=(await import(pathToFileURL(desktop.resolve('@tailwindcss/vite')).href)).default;
const server=await createServer({configFile:false,root:repo+'/apps/desktop',cacheDir:scratch+'/mutation-vite-cache',
 define:{'import.meta.env.VITE_DEMO_ANCHOR':JSON.stringify('15/09/2026')},
 plugins:[{name:'policies-zero',enforce:'pre',load(id){
 if(id.replaceAll('\\','/').endsWith('/src/data/app-data.ts')){const source=readFileSync(id,'utf8');const code=source.replace('policies: listPolicies(db).length','policies: 0');
 if(code===source)throw Error('Mutation not applied');writeFileSync(scratch+'/mutant-app-data.ts',code);return code}
 }},react(),tailwind()],server:{host:'127.0.0.1',port:1433,strictPort:true}});
await server.listen();console.log('MUTANT_READY');


~~~

### playwright.mutation.config.mjs

~~~text

import {createRequire} from 'node:module';
const req=createRequire('C:/workspace/Project-2C-review-2/package.json');const {defineConfig,devices}=req('@playwright/test');
export default defineConfig({testDir:'C:/workspace/Project-2C-review-2/e2e',testMatch:'backup.spec.ts',workers:1,
 outputDir:'C:/workspace/deep-review-1-4/codex/C/pw-mutation-output',reporter:'list',expect:{timeout:15000},
 use:{...devices['Desktop Edge'],channel:'msedge',baseURL:'http://127.0.0.1:1433',locale:'vi-VN'}});


~~~

### mutation-proof.test.ts

~~~text

import {readFileSync} from 'node:fs';
import {expect,it} from 'vitest';
import {openAppData} from 'C:/workspace/Project-2C-review-2/apps/desktop/src/data/app-data.ts';
it('counts policies in a nonempty backup preview',async()=>{
 const app=await openAppData({seed:()=>{}});
 const p=await app.readBackup(readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json','utf8'));
 console.log('previewPolicies',p.counts.policies,'expected',1804);
 expect(p.counts.policies).toBe(1804);app.db().sqlite.close();
});


~~~

### i18n-audit.mjs

~~~text

import {createRequire} from 'node:module';import {readFileSync,readdirSync,writeFileSync} from 'node:fs';import {join} from 'node:path';
const repo='C:/workspace/Project-2C-review-2',req=createRequire(repo+'/package.json'),ts=req('typescript');
const dictionary=readFileSync(repo+'/apps/desktop/src/i18n/vi.ts','utf8');
const keys=[...dictionary.matchAll(/^\s*'([^']+)':/gm)].map(m=>m[1]);
const literals=new Set(),patterns=[];
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function walk(dir){for(const ent of readdirSync(dir,{withFileTypes:true})){const path=join(dir,ent.name);if(ent.isDirectory())walk(path);else if(/\.tsx?$/.test(path)&&!path.endsWith('vi.ts')&&!/\.test\.tsx?$/.test(path)){
const ast=ts.createSourceFile(path,readFileSync(path,'utf8'),ts.ScriptTarget.Latest,true,path.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
function visit(n){if(ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n))literals.add(n.text);
if(ts.isTemplateExpression(n) && /^[A-Za-z]\w*\./.test(n.head.text))patterns.push(new RegExp('^'+escape(n.head.text)+n.templateSpans.map(s=>'.*'+escape(s.literal.text)).join('')+'$'));
ts.forEachChild(n,visit)}visit(ast);
}}}
walk(repo+'/apps/desktop/src');walk(repo+'/packages/ui/src');
const unused=keys.filter(k=>!literals.has(k)&&!patterns.some(p=>p.test(k)));
console.log(JSON.stringify({keyCount:keys.length,unused},null,2));
writeFileSync('C:/workspace/deep-review-1-4/codex/C/i18n-audit.json',JSON.stringify({keyCount:keys.length,unused},null,2));



~~~

## 9. Danh mục source/test D đã đọc (dòng 1 tới N)

| File | N |
|---|---:|
| packages/ui/src/components/Button.tsx | 24 |
| packages/ui/src/components/chart-theme.test.ts | 47 |
| packages/ui/src/components/chart-theme.ts | 57 |
| packages/ui/src/components/Chart.tsx | 77 |
| packages/ui/src/components/Choices.tsx | 70 |
| packages/ui/src/components/compare-cells.test.ts | 41 |
| packages/ui/src/components/compare-cells.ts | 37 |
| packages/ui/src/components/DataTable.tsx | 163 |
| packages/ui/src/components/Dialog.tsx | 53 |
| packages/ui/src/components/NavIcon.tsx | 63 |
| packages/ui/src/components/PeriodPicker.label.test.ts | 26 |
| packages/ui/src/components/PeriodPicker.label.ts | 21 |
| packages/ui/src/components/PeriodPicker.tsx | 168 |
| packages/ui/src/components/PolicyBadge.tsx | 13 |
| packages/ui/src/components/Segmented.tsx | 64 |
| packages/ui/src/components/SelectField.tsx | 83 |
| packages/ui/src/components/StageBadge.tsx | 22 |
| packages/ui/src/components/TextField.tsx | 75 |
| packages/ui/src/fonts.css | 140 |
| packages/ui/src/index.ts | 12 |
| packages/ui/src/theme.css | 76 |
| packages/ui/src/token-guard.test.ts | 93 |
| packages/ui/src/token-guard.ts | 77 |
| packages/ui/src/tokens.css | 69 |
| packages/ui/scripts/check-tokens.ts | 37 |
| apps/desktop/src/data/app-data.test.ts | 605 |
| apps/desktop/src/data/app-data.ts | 329 |
| apps/desktop/src/data/AppDataContext.tsx | 42 |
| apps/desktop/src/data/persist-queue.test.ts | 163 |
| apps/desktop/src/data/persist-queue.ts | 79 |
| apps/desktop/src/data/tauri-storage.test.ts | 65 |
| apps/desktop/src/data/tauri-storage.ts | 44 |
| apps/desktop/src/data/today.test.ts | 80 |
| apps/desktop/src/data/today.ts | 58 |
| apps/desktop/src/shell/AppShell.tsx | 63 |
| apps/desktop/src/shell/close-guard.test.ts | 100 |
| apps/desktop/src/shell/close-guard.ts | 30 |
| apps/desktop/src/shell/CloseGuard.tsx | 80 |
| apps/desktop/src/shell/ErrorBoundary.tsx | 49 |
| apps/desktop/src/shell/RePicker.tsx | 88 |
| apps/desktop/src/shell/routes.test.ts | 72 |
| apps/desktop/src/shell/routes.ts | 64 |
| apps/desktop/src/shell/SaveWarning.tsx | 15 |
| apps/desktop/src/shell/scope.test.ts | 157 |
| apps/desktop/src/shell/scope.ts | 77 |
| apps/desktop/src/shell/ScopeContext.tsx | 24 |
| apps/desktop/src/shell/ScopePicker.tsx | 61 |
| apps/desktop/src/shell/screen-error.test.ts | 21 |
| apps/desktop/src/shell/screen-error.ts | 17 |
| apps/desktop/src/shell/Sidebar.tsx | 58 |
| apps/desktop/src/shell/startup-error.test.ts | 31 |
| apps/desktop/src/shell/startup-error.ts | 27 |
| apps/desktop/src/shell/StartupError.tsx | 18 |
| apps/desktop/src/shell/useRoute.ts | 45 |
| apps/desktop/src/i18n/index.test.ts | 98 |
| apps/desktop/src/i18n/index.ts | 113 |
| apps/desktop/src/i18n/vi.ts | 813 |

