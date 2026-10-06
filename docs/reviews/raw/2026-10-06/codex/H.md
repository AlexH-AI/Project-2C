# Gói H — review độc lập xuyên gói Phase 1–4

Ngày: 05/10/2026. SHA: **f0c53eb57eb7eac8665ad87287e794ae4c5bc43b** (detached HEAD, kiểm trước và sau probe). Repo: C:/workspace/Project-2C-review-2.

**Kết quả: 7 CONFIRMED — 3 Medium, 4 Low; không có Critical/High hoặc PLAUSIBLE.** Đây là kết quả riêng của phiên H; không đọc hay tổng hợp bất kỳ báo cáo review nào khác. Không truy cập thư mục báo cáo bị cấm. Không sửa file tracked, không commit, không tạo Issue. Ba mục untracked .agents/, .codex/, AGENTS.md có từ lúc bắt đầu; trạng thái cuối không đổi, git diff --stat rỗng.

## 1. Phạm vi và cách kiểm

Phạm vi H là đường đi xuyên domain → DB → projection → UI / export / storage, ranh giới package, test và hiệu năng mở app. Không tuyên bố đã review lại từng dòng của các gói A–G. Các vị trí dưới đây dùng đường dẫn tương đối với repo ở SHA trên; khoảng dòng chỉ vùng đã tập trung đọc/đối chiếu.

| Vùng | File / dòng đã đọc, trọng tâm |
|---|---|
| Quy tắc, hợp đồng | CLAUDE.md:1–120; CONTEXT.md:1–46; docs/process/deep-review-phase-1-4.md:1–152; docs/design/phase-3-du-lieu.md:1–277; docs/design/phase-4-chi-so.md:1–220 |
| Golden | docs/golden/chi-so.md:1–126; kh-theo-nhom.md:1–58; kyc.md:1–87; lich-hen.md:1–65. Fixture và expected của repo giữ nguyên khi chạy test |
| Ranh giới, công cụ | package.json; .dependency-cruiser.cjs; tsconfig.base.json; vitest.config.ts; playwright.config.ts; apps/desktop/vite.config.ts; CLAUDE.md cấp package. Đọc cấu hình, export map, tìm tham chiếu bằng rg; chạy lint:deps, codemap:check và noUnused |
| Domain | packages/domain/src/{index,money,stats,customer-lifecycle,stage-snapshot}.ts; trọng tâm money.ts:90–120, stats.ts:1–220; các test stats / RF / golden. Đối chiếu số tiền, kỳ, nhóm, scope và tổng giữa báo cáo |
| DB | packages/db/src/{index,schema,errors,common,database,backup,backup-validation,customers,team,policies,appointments,metrics}.ts; trọng tâm backup-validation.ts:1–275, common.ts:1–90, policies.ts:1–130, appointments.ts:230–410; kyc.ts:209–400; test backup, invariants, policies, database và golden |
| Data + shell | apps/desktop/src/data/{app-data,AppDataContext,persist-queue,tauri-storage}.ts(x); main.tsx; App.tsx; shell/{routes,scope,ScopeContext,AppShell,ErrorBoundary,CloseGuard}; startup/screen error. Đọc mở DB, thay DB, queue lưu, lỗi và scope |
| Projection + màn hình | routes/overview/{overview-view,stage-view,stage-chart,team-compare-view,OverviewTiles}; reports/{reports-view,report-workbook,ReportsScreen}; appointments/{appointments-view,appointment-form,AppointmentsScreen,MetFields}; customers/{customers-view,CustomersScreen,CustomerProfile}; team/PersonDialogs, SettingsBackup và bộ lọc kỳ |
| Vùng trích dẫn UI | overview-view.ts:130–160; appointments-view.ts:175–215,255–275; AppointmentsScreen.tsx:270–300; CustomersScreen.tsx:40–95; packages/ui/src/components/Dialog.tsx:1–51; TextField, SelectField, Segmented, Choices, DataTable |
| File Tauri / tên export | apps/desktop/src-tauri/src/lib.rs toàn file; storage.rs:1–160,360–435,903–963,1089–1115 và tìm hàm/đường gọi; capabilities/default.json; tauri.conf.json; report-workbook.ts:210–275 |
| Test UI và đối chứng | e2e backup, team, customer forms, support và tìm assertion focus; toàn bộ unit của cấu hình repo chạy lại. Mutation chỉ áp lên bản sao ngoài repo |

Đã đọc common/README.md, baseline.md, known.md và dữ liệu tải chung. Dữ liệu tải thực tế: **4 team, 51 nhân sự, 1.496 KH, 10.434 lịch hẹn, 1.804 HĐ**; ngày neo 05/10/2026. DB binary từ backup: **13.074.432 byte**.

Các lệnh tái hiện chạy từ repo, dùng config/output bên ngoài:

~~~powershell
node node_modules/vitest/vitest.mjs run --config C:/workspace/deep-review-1-4/codex/H/vitest.h.config.mts
node node_modules/vitest/vitest.mjs run --config C:/workspace/deep-review-1-4/codex/H/vitest.additional.config.mts
node C:/workspace/deep-review-1-4/codex/H/browser.mjs
node C:/workspace/deep-review-1-4/codex/H/ui-cases.mjs
node C:/workspace/deep-review-1-4/codex/H/mutation.mjs
node C:/workspace/deep-review-1-4/codex/H/mutation-guard.mjs
$env:TEMP = 'C:/workspace/deep-review-1-4/codex/H/temp'
$env:TMP = $env:TEMP
node node_modules/vitest/vitest.mjs run --config C:/workspace/deep-review-1-4/codex/H/vitest.unit.config.mts --coverage --reporter=dot
pnpm lint:deps
pnpm codemap:check
pnpm -r exec tsc --noEmit --noUnusedLocals --noUnusedParameters --incremental false
pnpm lint:tokens
~~~

Kết quả chạy lại: **66 file / 1.260 unit test PASS**, ngưỡng coverage PASS; statements 98,62%, branches 96,34%, functions 98,54%, lines 98,91%. Đây là số của lần chạy H (unit.log), không chép bảng baseline. lint:deps PASS (215 module, 849 dependency), codemap:check PASS, noUnused PASS, lint:tokens PASS. Không gọi đây là một lần pnpm verify đầy đủ. Không chạy lại toàn suite e2e hoặc Rust trong H.

## 2. Phát hiện

### CX-H1 — Tổng tiền hợp lệ theo từng HĐ vượt miền số an toàn, làm sai tổng và hỏng Tổng quan

- **ID:** CX-H1
- **Mức:** Medium
- **Trục:** E (liên quan C, D)
- **Vị trí:** packages/db/src/common.ts:64; packages/domain/src/stats.ts:88,103,105,194; packages/domain/src/money.ts:95,113; apps/desktop/src/routes/overview/overview-view.ts:150 (**f0c53eb**).
- **Tình trạng:** CONFIRMED.
- **Mô tả:** Lệnh và backup chỉ kiểm FYP từng HĐ là safe integer. Phép cộng ở chỉ số không bảo vệ tổng; tổng vừa bị làm tròn vừa bị formatter từ chối, khiến một bộ dữ liệu đã được nhận làm màn Tổng quan rơi vào ErrorBoundary.
- **Tái hiện / bằng chứng:** Test “safe individual amounts…” trong probe.test.ts tạo một KH/RE, gọi submitPolicy hai lần với FYP 9.007.199.254.740.991 và 2, ngày 05/10/2026. Export → import thành công. periodMetrics.caseSize = **9.007.199.254.740.992**, trong khi tổng chính xác bằng BigInt = **9.007.199.254.740.993**; kpiTiles ném **RangeError: Not a whole đồng amount: 9007199254740992**. amount-results.json ghi đủ đầu vào/kết quả. ui-cases.mjs nhập cùng biên vào dữ liệu tải, mở Tổng quan: hiện “Màn này gặp lỗi và không hiển thị được”; tổng trong dataset này là 9007199389740992 (còn các HĐ khác), có ui-results.json và overflow.png.
- **Ảnh hưởng:** Người dùng nhập số cực lớn hoặc nhận backup có nhiều FYP hợp lệ nhưng tổng vượt MAX_SAFE_INTEGER. Bộ dữ liệu tải thông thường không gặp. Không mất file DB trong probe, nhưng chỉ số sai và màn không sử dụng được. Mức Medium vì biên số rất lớn, không phải một lỗi thường xuyên trên seed.
- **Đề xuất:** Xác định và kiểm miền tổng tiền ở mọi đường tính; nếu tiếp tục dùng number, bảo vệ phép cộng và đưa ra lỗi có thể xử lý trước khi render, đồng thời áp giới hạn nhất quán ở đường ghi/nhập. Ước lượng ≤ 150 dòng SP cho phương án giới hạn/checked aggregate; thay toàn bộ biểu diễn tiền cần thiết kế riêng. Không sửa expected golden để hợp thức hóa tổng sai.

### CX-H2 — Backup nhận nhân sự đã xóa đang phối hợp/đánh giá một cuộc hẹn sống

- **ID:** CX-H2
- **Mức:** Medium
- **Trục:** S (liên quan D, C)
- **Vị trí:** packages/db/src/backup-validation.ts:184–205 (đặc biệt 196–197); packages/db/src/appointments.ts:380–410; packages/db/src/team.ts:163–168 (guard xóa); docs/design/phase-3-du-lieu.md:24,180 (**f0c53eb**).
- **Tình trạng:** CONFIRMED.
- **Mô tả:** ownerRule kiểm người đánh giá đúng role nhưng bỏ deleted_at, và không kiểm người phối hợp còn sống. Snapshot có quan hệ mà các lệnh nghiệp vụ không cho tạo vẫn được nhận, trong khi listPeople và lệnh sửa không chấp nhận người ấy.
- **Tái hiện / bằng chứng:** additional.test.ts tạo IS “Helper” làm cả coordinator và outcomeReviewer của một lịch MET sống. softDeletePerson bị từ chối **PERSON_IN_USE**. Chỉ đặt deleted_at của Helper trong bản export rồi import: **ACCEPTED**; listPeople không còn Helper nhưng lịch vẫn giữ cả hai liên kết. editMeetingOutcome với người đánh giá hiện tại bị **PERSON_NOT_FOUND**. participant-results.json chứa lịch và danh sách người sau nhập. Probe ban đầu trên dữ liệu tải cũng nhận người đánh giá đã xóa.
- **Ảnh hưởng:** Nhập backup không hợp lệ rồi xem/sửa kết quả cuộc gặp: lựa chọn nhân sự thiếu, giữ giá trị hiện có bị từ chối. Vi phạm đồng nhất giữa command, snapshot và UI; không chứng minh mất dữ liệu từ một backup bình thường do app tự xuất.
- **Đề xuất:** Kiểm liveness của coordinator và outcome reviewer của lịch sống ở biên nhập, cùng role/quan hệ như lệnh. Giữ ngoại lệ hợp lệ cho lịch đã xóa. Ước lượng < 100 dòng SP; thêm test backup từ chối cả hai liên kết và DB hiện tại không đổi.

### CX-H3 — Backup tạo nhánh dời lịch, danh sách và hộp thoại chỉ hai ngày khác nhau

- **ID:** CX-H3
- **Mức:** Medium
- **Trục:** C (liên quan D, S)
- **Vị trí:** packages/db/src/backup-validation.ts:200–205; packages/db/src/appointments.ts:232–241; apps/desktop/src/routes/appointments/appointments-view.ts:178–192,261–269; AppointmentsScreen.tsx:289 (**f0c53eb**).
- **Tình trạng:** CONFIRMED.
- **Mô tả:** Snapshot chỉ kiểm cha cùng KH và status RESCHEDULED, bỏ bất biến một mắt xích có một lịch con. Khi có hai con, outcomeResolver lấy con cuối qua Map, còn rescheduleLinks lấy con đầu qua find; hai nơi hiển thị cùng một lần dời không còn khớp.
- **Tái hiện / bằng chứng:** additional.test.ts lấy một lịch SCHEDULED có rescheduled_from_id trên backup tải, nhân bản sang ID ZZZZZZZZZZZZZZZZZZZZZZZZZZ, ngày 30/10/2026, giữ cùng cha. Import **ACCEPTED**. Parent 01M3ESFXKMWRNCF2ZZNX301KBD: projection danh sách cho **30/10/2026**, liên kết hộp thoại cho **05/10/2026**. reschedule-results.json ghi IDs và ngày. Lệnh rescheduleAppointment thêm con lần nữa từ cha ấy bị **APPOINTMENT_NOT_SCHEDULED**; command bình thường không sinh ra nhánh này. Cả hai con sống đi vào danh sách đầu vào tính lịch.
- **Ảnh hưởng:** Backup có chuỗi dời bị phân nhánh gây hiển thị và số đếm không đại diện cho một chuỗi duy nhất; hướng theo lịch mới tùy nơi đang xem. Tái hiện mâu thuẫn ở hai projection mà UI gọi, chưa tự động bấm hộp thoại cho snapshot nhánh trong trình duyệt.
- **Đề xuất:** Kiểm đồ thị dời lịch lúc nhập theo bất biến lệnh: không nhiều con cùng cha; bảo đảm chuỗi không chu trình. Không chọn tùy ý một con để che dữ liệu sai. Ước lượng < 100 dòng SP và test nhánh/chuỗi hợp lệ qua ranh giới năm.

### CX-H4 — Tên rỗng qua backup tạo liên kết KH vô hình, không có tên truy cập

- **ID:** CX-H4
- **Mức:** Low
- **Trục:** D (liên quan A, S)
- **Vị trí:** packages/db/src/backup-validation.ts:44–52; packages/db/src/common.ts:15–18; apps/desktop/src/routes/customers/CustomersScreen.tsx:65–69 (**f0c53eb**).
- **Tình trạng:** CONFIRMED.
- **Mô tả:** requireName của command bắt buộc tên sau trim không rỗng; kiểm giá trị snapshot chấp nhận chuỗi rỗng/trắng. Tên KH là nội dung duy nhất của liên kết mở hồ sơ trong bảng, nên backup này tạo điểm mở hồ sơ không nhìn thấy và thiếu accessible name.
- **Tái hiện / bằng chứng:** probe.test.ts đổi name của một KH thành chuỗi rỗng và name team thành bốn dấu cách trong hai bản backup riêng; cả hai **ACCEPTED**. ui-cases.mjs đổi tên một KH sống thành rỗng, nhập bằng AppData, mở Khách hàng → Bảng. Link #/customers/01K2CG0WHSFTCQ8K2PN4BH37GJ vẫn tồn tại nhưng innerText rỗng, bounding box **0 × 0 px**. Không thay các trường khác. probe-results.json, ui-results.json.
- **Ảnh hưởng:** Backup có tên sai làm bảng khó sử dụng và làm mất nhãn cho điều hướng hồ sơ; không phải lỗi nhập liệu bằng form thông thường.
- **Đề xuất:** Kiểm cùng luật tên ở snapshot cho teams/people/customers (ít nhất trim không rỗng; thống nhất chuẩn hóa). Dữ liệu giả lập sai có thể nạp lại theo quy tắc Owner; không cần migration/UI chữa dữ liệu cũ. Ước lượng < 50 dòng SP.

### CX-H5 — Đóng Dialog dùng chung không trả focus về nút mở

- **ID:** CX-H5
- **Mức:** Low
- **Trục:** A
- **Vị trí:** packages/ui/src/components/Dialog.tsx:15–33 (**f0c53eb**).
- **Tình trạng:** CONFIRMED.
- **Mô tả:** Dialog mở bằng showModal nhưng đóng bằng unmount, không có cleanup close hoặc khôi phục phần tử đang focus lúc mở. Sau Hủy/Escape, người dùng bàn phím mất vị trí trong màn hiện tại.
- **Tái hiện / bằng chứng:** Browser Edge headless, viewport 1440 × 1000, locale vi-VN, dữ liệu tải. ui-cases.mjs focus nút “+ Team”, Enter mở “Team mới”, sau đó Hủy hoặc Escape. Cả hai đường đều có document.activeElement = **BODY**, thay vì nút + Team còn tồn tại. browser-results.json và ui-results.json. Bước Tab sau đó cũng ghi BODY (focus có thể sang chrome trình duyệt); không suy từ BODY này thành một lỗi bẫy focus khác.
- **Ảnh hưởng:** Người dùng bàn phím hoặc trình đọc màn hình phải tìm lại vị trí khi đóng hộp thoại. Component được nhiều màn sử dụng; probe trực tiếp chỉ xác nhận Team mới.
- **Đề xuất:** Lưu phần tử mở và close/restore focus trong cleanup, có fallback khi nút mở đã bị tháo; xử lý chuyển từ dialog này sang dialog khác. Ước lượng < 40 dòng SP, thêm e2e Hủy/Escape bằng bàn phím.

### CX-H6 — Bỏ guard RE của restorePolicy vẫn xanh toàn bộ test hiện có cho API này

- **ID:** CX-H6
- **Mức:** Low
- **Trục:** T
- **Vị trí:** packages/db/src/policies.test.ts:136–154; packages/db/src/policies.ts:101 (**f0c53eb**).
- **Tình trạng:** CONFIRMED.
- **Mô tả:** Test restorePolicy chỉ phủ khôi phục thường, ID không tồn tại và KH đã xóa, không bắt việc bỏ requireRe. Guard hiện tại đúng; phát hiện là thiếu test cho ràng buộc, không phải guard đang thiếu trong sản phẩm.
- **Tái hiện / bằng chứng:** mutation.mjs sao chép nguồn DB/domain và migrations ra H/mutation. Control chạy policies.test.ts + stats.test.ts + stats-rf.test.ts: **88/88 PASS**. Chỉ thay dòng requireRe(db, row.reId) trong bản sao policies.ts bằng comment: **88/88 vẫn PASS**. rg trong repo xác nhận các lời gọi test restorePolicy chỉ nằm ở policies.test.ts. Đối chứng “caseSize + 1” ở bản sao domain làm **61 test FAIL**, chứng minh suite đang chạy assertion thực, không phải config bỏ qua test. mutation/results.json và ba log.
- **Tái hiện tác hại của mutant:** Probe restore-guard.test.ts: xóa mềm HĐ, chuyển KH sang RE khác, xóa RE cũ rồi khôi phục HĐ. Control từ chối PERSON_NOT_FOUND và snapshot vẫn nhập được; mutant SUCCESS và snapshot xuất ra bị BACKUP_INVALID rule 5. Test bổ sung PASS với control, FAIL với mutant (guard-results.json). Không nói 1.260 test toàn repo đã chạy trên mutant; mutation chạy 88 test nêu trên.
- **Ảnh hưởng:** Regression bỏ guard quan trọng có thể lọt qua bộ test của restorePolicy dù coverage policies.ts là 100% statements. Không ảnh hưởng runtime hiện tại khi chưa sửa code.
- **Đề xuất:** Thêm test RE đã xóa/đổi role khi HĐ đang xóa mềm, kiểm lỗi, transaction không đổi dữ liệu và không gọi persist. 0 dòng SP; khoảng 40–70 dòng test.

### CX-H7 — Khôi phục dữ liệu xóa mềm không kiểm ngày, tạo backup sống không nhập lại được

- **ID:** CX-H7
- **Mức:** Low
- **Trục:** E (liên quan D, C)
- **Vị trí:** packages/db/src/policies.ts:96–103; packages/db/src/appointments.ts:254–264; packages/db/src/backup-validation.ts:266–273; docs/design/phase-3-du-lieu.md:228,272 (**f0c53eb**).
- **Tình trạng:** CONFIRMED.
- **Mô tả:** Rule 10 cho phép ngày tương lai ở HĐ/lịch MET/NO_SHOW đã xóa; khi restore, hai API kiểm KH/nhân sự nhưng không kiểm lại ngày trước khi bỏ deleted_at. DB trở thành dữ liệu sống vi phạm luật ngày, xuất backup được nhưng nhập lại bị chặn.
- **Tái hiện / bằng chứng:** additional.test.ts dùng đồng hồ cố định 05/10/2026, tạo và xóa mềm HĐ cùng lịch NO_SHOW. Trong bản export chỉ đổi submitted_date của HĐ và date của lịch đã xóa thành 06/10/2026. Import ban đầu **ACCEPTED** đúng ngoại lệ bản ghi đã xóa. restorePolicy và restoreAppointment đều SUCCESS. Export → import cùng đồng hồ: **BACKUP_INVALID, params.rule = 10**. future-restore-results.json chứa cả hai bản ghi đã phục hồi. Không cần chỉnh đồng hồ máy hay phá DB trực tiếp.
- **Ảnh hưởng:** Tầng DB hiện đã có API nhưng UI Thùng rác để Phase 6, nên chưa có đường bấm thường ngày ở Phase 4; mức Low. Caller khôi phục về sau có thể tạo snapshot không round-trip được. Chưa chứng minh mất file, không quy lỗi cho ngoại lệ nhập dữ liệu đã xóa.
- **Đề xuất:** Revalidate ngày nộp/phát hành khi restorePolicy; revalidate ngày MET/NO_SHOW khi restoreAppointment, trong cùng transaction trước undelete/applyOutcome. Không chặn lịch SCHEDULED/CANCELLED tương lai hợp lệ. Ước lượng < 40 dòng SP.

## 3. Số đo hiệu năng và giới hạn

Nguồn: probe-results.json, browser-results.json, browser.log. Node dùng sql.js thật, clock 05/10/2026. Browser dùng build production, Edge headless 1440 × 1000, locale vi-VN, local HTTP, fresh context từng lần. main.tsx chỉ được transform trong bộ nhớ qua plugin probe để nạp binary và lộ AppData cho test; không sửa nguồn repo. Storage.save/backup của harness là no-op. Vì thế **không bao gồm ghi ổ đĩa, backup khởi động hay IPC Tauri**.

| Phép đo | Cỡ mẫu | Kết quả |
|---|---:|---:|
| Nhập backup tải, gồm parse/validate/tạo DB | 3 | 1.225,81 / 1.108,24 / 1.790,90 ms |
| Đọc projection 6 tập dữ liệu | 5 | 158,14–221,77 ms; median 188,24 ms |
| reportRows tháng / năm | mỗi loại 5 | 39,37–61,58 / 42,22–75,62 ms |
| kpiTiles tháng / năm | mỗi loại 5 | 3,12–5,66 / 3,00–3,56 ms |
| teamCompare tháng / năm | mỗi loại 5 | 26,17–48,21 / 30,27–55,09 ms |
| appointmentRows (team) / monthGrid | mỗi loại 5 | 9,55–21,71 / 7,93–10,09 ms |
| customerBoard toàn bộ | 5 | 2,43–4,09 ms |
| Export JSON backup tải | 3 | 322,51 / 371,06 / 352,66 ms |
| openAppData binary có sẵn, Node / storage bộ nhớ | 3 | 3,76 / 3,65 / 3,97 ms; không gồm projection/render |
| Browser mở binary tải đến Tổng quan có KPI + 2 frame | 3 | 943,9 / 956,6 / 937,9 ms; median 943,9 ms |
| Browser mở lần đầu, seed mặc định | 1 | 3.811,5 ms; riêng seed 3.314,2 ms |
| Long task lúc mở binary / seed | 3 / 1 | binary 196–206 ms, có lần thêm 69 ms; seed có task 3.353 ms |
| Điều hướng Báo cáo/Lịch hẹn/KH/Team/Cài đặt/Tổng quan | mỗi màn 1 | 256,0 / 333,4 / 148,9 / 201,2 / 179,9 / 249,6 ms |

Phép đo điều hướng bắt đầu trước lệnh Playwright click, kết thúc sau heading và hai frame, nên bao gồm overhead automation; không phải React commit duration. Không báo lỗi P chỉ vì nhìn thấy synchronous loop hay long task. Các số trên chưa đủ để kết luận vượt một SLA của exe; không benchmark hardware/ổ đĩa hay gọi đây là thời gian Tauri thật.

Build riêng harness: main **744,06 KB / gzip 220,41 KB**, chart **527,11 / 178,51 KB**, Excel **929,56 / 256,44 KB**, sql.js wasm **658,41 / 326,00 KB**, CSS **27,03 / 6,23 KB** (đơn vị theo output Vite). Main có thêm instrumentation; chart/Excel được tách chunk. Không nêu một phát hiện bundle chỉ từ tổng dung lượng.

Trên dữ liệu tải nguyên bản, tổng Theo team/Theo RE = tổng báo cáo, nhóm của tổng RE = tổng chung, tổng lịch Theo mốc = lịch tổng, cho cả tháng và năm. Browser mở và điều hướng dữ liệu tải nguyên bản không có pageerror/console error. UI probe cố tình nhập tổng tràn mới có RangeError như CX-H1.

## 4. Bảng đếm mức × trục

Mỗi phát hiện chỉ đếm ở trục chính; trục liên quan ghi trong khối nhưng không cộng lặp.

| Mức | E | C | D | P | B | T | A | S | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 3 |
| Low | 1 | 0 | 1 | 0 | 0 | 1 | 1 | 0 | 4 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Tổng** | **2** | **1** | **1** | **0** | **0** | **1** | **1** | **1** | **7** |

## 5. Mọi trục đã xét / phần không thấy thêm

| Trục | Cách đã xét và kết quả |
|---|---|
| **E** | Số tiền safe riêng nhưng tổng lớn; snapshot rỗng/trắng, liên kết trùng; ngày tương lai trên deleted rows/restore; đọc helper ngày/kỳ và golden, chạy test biên hiện có. Có CX-H1, H7; ngoài các trường hợp đã ghi, **đã xét, không thấy thêm** trong kiểm xuyên gói này. Không nhận là đã chạy mọi timezone của Windows |
| **C** | So command/backup/UI, đối chiếu scope/count/tổng Theo RE/team/mốc tháng+năm, giữ golden đúng spec. Có CX-H3; số liệu nguyên bản giữa các projection **đã xét, không thấy** lệch khác. Excel workbook đọc đường dùng rows/format và chạy stock tests; không tự mở Excel desktop |
| **D** | Round-trip backup, lifecycle xóa/khôi phục, KH/RE/reviewer/coordinator/transition, transaction và persist-queue. Có CX-H4 và quan hệ liên quan H2/H3/H7. Với backup tải nguyên bản và các command control đã thử, **đã xét, không thấy** mất bản ghi hay rollback sai mới |
| **P** | Đo import/export/projection, build chunk, mở app và điều hướng bằng Edge trên tải đúng cỡ; tìm loop/N+1/render. **Đã xét, không thấy** phát hiện hiệu năng đủ bằng chứng/ngưỡng để phân mức. Số đo và hạn chế I/O ở §3 |
| **B** | lint:deps, codemap:check, noUnusedLocals/Parameters, đọc export map và dùng rg tìm các helper/đường dùng trong domain/db/UI/shell, xem chunk thư viện. **Đã xét, không thấy** code chết/lặp mới có tác hại rõ để báo. noUnused không tự chứng minh mọi public export/key i18n đều dùng; không dùng knip/jscpd/công cụ mới. Các lặp đã có known.md không được tính thành phát hiện mới |
| **T** | Toàn unit + coverage, đọc assertion backup/restore/golden, so ngày neo, mutation một dòng ở bản sao nguồn với cả survivor và mutant bị bắt; xem seam e2e focus/backup. Có CX-H6. Ngoài seam đó, **đã xét, không thấy** test giả xanh mới được xác nhận. Không chạy toàn e2e lặp nhiều lần để kết luận flaky |
| **A** | Native dialog, Escape/Hủy/Tab bằng Edge, link KH và tên truy cập, đọc component labels/i18n, formatter tiền/ngày và lint:tokens. Có CX-H5 và hệ quả H4. **Đã xét, không thấy** lỗi i18n mới trong các màn/đường đã thử. Không chạy screen reader hay đo toàn bộ độ tương phản; chart/viền đã biết ghi KNOWN dưới đây |
| **S** | Nhập backup biến thể với sql.js thật; trace Tauri data_dir → folder/write_export, capabilities, allowlist export_name và slug tên Excel; đọc test traversal/tên đuôi/lặp tên. Có CX-H2 và biên nhập H3/H4. Đường dẫn/tên export: **đã xét, không thấy** traversal mới từ các đầu vào UI cho phép. Không thử symlink/ổ đầy/quyền trên exe, không suy từ capabilities rằng custom commands tự được giới hạn |

### KNOWN, không đếm lại

- **KNOWN — common/known.md, S-1 / D-1:** hash KYC khi nhập snapshot. Không có bằng chứng mới trong H; không dùng làm một CX-H.
- **KNOWN — common/known.md, S-2 và ACCEPTED app-data:** replace chồng nhau / ghi muộn / opening. Đọc đường đi để hiểu giới hạn; không chạy hay biến thành phát hiện mới.
- **KNOWN — common/known.md, B:** các lặp badge, CloseGuard button, stage/report mapping, filter staff đã ghi. Không thêm nhận xét phong cách hay tính lại.
- **KNOWN — common/known.md, A:** chart N4–N1 không có dữ liệu cho trình đọc màn hình, calendar aria-hidden, tương phản viền/mũi tên và mục DataTable thiếu test đã ghi. Không có bằng chứng mới để báo lại.
- **KNOWN — common/known.md, storage.rs:** dead_code ngoài Windows và các mục ghi file đã biết. Không dùng kết quả đọc tĩnh để coi là đã chạy clippy/Rust.

## 6. Bằng chứng và phụ lục nguồn test tạm

Tất cả đường dưới đây thuộc C:/workspace/deep-review-1-4/codex/H/. Log và output nằm bên ngoài repo:
- probe.log, probe-results.json, amount-results.json; additional.log, participant-results.json, reschedule-results.json, future-restore-results.json.
- browser.log, browser-results.json, ui-results.json; team.png, overflow.png; load.db và dist/ là output harness.
- mutation/results.json, control.log, restore-re-mutant.log, sum-mutant.log; mutation/guard-results.json, guard-control.log, guard-mutant.log.
- unit.log, coverage/; cache, temp và config đều ở H.

Các nguồn sau được chép nguyên văn vào phụ lục. mutation/db, mutation/domain là bản sao stock source/test từ SHA nêu trên, không cần chép lại toàn bộ; hai patch chính xác và cách khôi phục có trong mutation.mjs. Tất cả test fixture/golden của repo giữ nguyên. Bản probe clock lùi trong probe.test.ts chỉ là thăm dò ban đầu; bằng chứng chính của CX-H7 là test future deleted trong additional.test.ts, không đổi đồng hồ. Scripts dùng dependency đã cài của repo; không cài thêm.


### Nguồn: vitest.h.config.mts

SHA-256: fe183def7f6abb99863a0535b2ceb19339eef5a0d6e9c29f1e4c2afa7f9c62fd

~~~typescript
const repo = 'C:/workspace/Project-2C-review-2';
const here = 'C:/workspace/deep-review-1-4/codex/H';
export default {
  root: here, cacheDir: here + '/vite-cache',
  resolve: {alias: [
    {find: /^@p2c\/domain$/, replacement: repo + '/packages/domain/src/index.ts'},
    {find: /^@p2c\/db$/, replacement: repo + '/packages/db/src/index.ts'},
    {find: /^vitest$/, replacement: repo + '/node_modules/vitest/dist/index.js'}
  ]},
  server: {fs: {allow: [repo, here]}},
  test: {include: [here + '/probe.test.ts'], testTimeout: 120000, globals: true, maxWorkers: 1}
};
~~~

### Nguồn: probe.test.ts

SHA-256: c8858710c1cb9ea3346b6f2c7664b9462d0b705c3f00a330abbfa8ae384d87d1

~~~typescript
import { readFileSync, writeFileSync } from 'node:fs';
import { test, expect } from 'vitest';
import * as dbApi from 'C:/workspace/Project-2C-review-2/packages/db/src/index.ts';
import * as domain from 'C:/workspace/Project-2C-review-2/packages/domain/src/index.ts';
import { openAppData, countRecords } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/data/app-data.ts';
import { reportRows, reportCells } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/reports/reports-view.ts';
import { kpiTiles } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/overview/overview-view.ts';
import { stageBlock } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/overview/stage-view.ts';
import { teamCompare } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/overview/team-compare-view.ts';
import { appointmentRows, monthGrid } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/appointments/appointments-view.ts';
import { customerBoard } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/customers/customers-view.ts';
const here = 'C:/workspace/deep-review-1-4/codex/H';
const now = () => new Date(2026,9,5,12);
const today = domain.calendarDate(2026,10,5);
const source = readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json','utf8');
const output: any = {};
async function measure(name: string, f: () => any, n=5) {
  const times=[]; let value;
  for(let i=0;i<n;i++){const start=performance.now(); value=await f(); times.push(+(performance.now()-start).toFixed(2));}
  output[name]={ms:times}; return value;
}
test('cross-package load, sums, day boundaries and permissive import', async () => {
  const starts=[];
  let imported;
  for(let i=0;i<3;i++){const t=performance.now(); imported=await dbApi.importBackup(source,{now}); starts.push(+(performance.now()-t).toFixed(2)); if(i<2) imported.db.sqlite.close();}
  output.importMs=starts;
  const db=imported!.db;
  output.counts=countRecords(db);
  output.bytes=db.export().byteLength;
  const data=await measure('readProjection',()=>({
    teams:dbApi.listTeams(db),people:dbApi.listPeople(db), customers:dbApi.listCustomers(db),
    appointments:dbApi.listAppointments(db),policies:dbApi.listPolicies(db),transitions:dbApi.listStageTransitions(db)
  }));
  for(const kind of ['month','year'] as const){
    const period=domain.periodOf(kind,today);
    const rows=await measure('reports_'+kind,()=>reportRows(data,period,{kind:'all'},today));
    expect(rows.byTeam!.total.metrics).toEqual(rows.summary.metrics);
    expect(rows.byRe!.total.metrics).toEqual(rows.summary.metrics);
    expect(rows.byRe!.total.stages).toEqual(rows.summary.stages);
    expect(rows.byMark.reduce((a,r)=>a+r.appointments.total,0)).toBe(rows.summary.appointments.total);
    await measure('kpis_'+kind,()=>kpiTiles(data,period,{kind:'all'},today));
    await measure('stages_'+kind,()=>stageBlock(data,period,{kind:'team',teamId:data.teams[0].id},today));
    await measure('teamCompare_'+kind,()=>teamCompare(data,period,today));
  }
  const ars=await measure('appointmentRows_team',()=>appointmentRows(data,{kind:'team',teamId:data.teams[0].id},'any'));
  await measure('monthGrid_team',()=>monthGrid(today,ars,domain.periodOf('month',today),today));
  await measure('customerBoard_all',()=>customerBoard(data,{kind:'all'}));
  await measure('exportJson',()=>dbApi.exportBackup(db),3);
  const bytes=db.export(); writeFileSync(here+'/load.db',bytes);
  for(let i=0;i<3;i++){const t=performance.now();const app=await openAppData({
    clock:now,storage:{load:async()=>bytes,save:async()=>{},backup:async()=>'',writeExport:async()=>'',latestBackup:async()=>undefined,openFolder:async()=>{}}
  });(output.openExistingMs??=[]).push(+(performance.now()-t).toFixed(2));app.db().sqlite.close();}
  db.sqlite.close();
  for(const variant of ['empty-name','untrimmed-name','deleted-reviewer'] as const){
    const json=JSON.parse(source);
    if(variant==='empty-name') json.tables.customers[0].name='';
    if(variant==='untrimmed-name') json.tables.teams[0].name='    ';
    if(variant==='deleted-reviewer'){
      const a=json.tables.appointments.find((a:any)=>a.status==='MET'&&a.deleted_at===null); const supporter=json.tables.people.find((p:any)=>p.role==='IS'); a.outcome_reviewer_id=supporter.id;
      const p=json.tables.people.find((p:any)=>p.id===a.outcome_reviewer_id);
      p.deleted_at=now().toISOString();
    }
    try{const r=await dbApi.importBackup(JSON.stringify(json),{now});output[variant]='ACCEPTED';r.db.sqlite.close();}
    catch(e:any){output[variant]={code:e.code,params:e.params};}
  }
  writeFileSync(here+'/probe-results.json',JSON.stringify(output,null,2));
  console.log(JSON.stringify(output));
});
test('safe individual amounts versus aggregate rendering and round-trip',async()=>{
  const db=await dbApi.openDatabase({now});
  const team=dbApi.createTeam(db,{name:'Probe'});const re=dbApi.createPerson(db,{name:'RE',role:'RE',teamId:team.id});
  const c=dbApi.createCustomer(db,{name:'KH',reId:re.id,stage:'N4',date:today});
  const amounts=[Number.MAX_SAFE_INTEGER,2];
  for(const amount of amounts) dbApi.submitPolicy(db,{customerId:c.id,reId:re.id,submittedDate:today,submittedFyp:amount});
  const imported=await dbApi.importBackup(dbApi.exportBackup(db),{now});
  const data={...dbApi.loadMetricsData(imported.db),customers:dbApi.listCustomers(imported.db),teams:dbApi.listTeams(imported.db)};
  const period=domain.periodOf('month',today);
  const metrics=domain.periodMetrics(data,period,{kind:'all'});
  const exact=amounts.reduce((a,b)=>a+BigInt(b),0n).toString();
  let render='OK';
  try {kpiTiles(data,period,{kind:'all'},today);}catch(e){render=String(e);}
  const result={acceptedAmounts:amounts,import:'ACCEPTED',caseSize:metrics.caseSize,exact,render};
  writeFileSync(here+'/amount-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
  expect(render).toContain('RangeError');
  db.sqlite.close();imported.db.sqlite.close();
});
test('restorePolicy checks dates against a clock moved backwards',async()=>{
  let at=new Date(2026,9,5,12);
  const db=await dbApi.openDatabase({now:()=>at});
  const team=dbApi.createTeam(db,{name:'T'});const re=dbApi.createPerson(db,{name:'RE',role:'RE',teamId:team.id});
  const c=dbApi.createCustomer(db,{name:'KH',reId:re.id,stage:'N4',date:domain.calendarDate(2026,10,1)});
  const p=dbApi.submitPolicy(db,{customerId:c.id,reId:re.id,submittedDate:today,submittedFyp:1000});
  dbApi.softDeletePolicy(db,p.id);at=new Date(2026,9,4,12);
  dbApi.restorePolicy(db,p.id);
  let result='ACCEPTED';try{const r=await dbApi.importBackup(dbApi.exportBackup(db),{now:()=>at});r.db.sqlite.close();}catch(e:any){result=JSON.stringify({code:e.code,params:e.params});}
  writeFileSync(here+'/restore-results.json',result);console.log('restorePolicy roundtrip '+result);db.sqlite.close();
});
~~~

### Nguồn: vitest.additional.config.mts

SHA-256: 9d02928722ba1ac11c488b8824a254728deb57182990f0967475d5753ef4d127

~~~typescript
const repo = 'C:/workspace/Project-2C-review-2';
const here = 'C:/workspace/deep-review-1-4/codex/H';
export default {
  root: here, cacheDir: here + '/vite-cache',
  resolve: {alias: [
    {find: /^@p2c\/domain$/, replacement: repo + '/packages/domain/src/index.ts'},
    {find: /^@p2c\/db$/, replacement: repo + '/packages/db/src/index.ts'},
    {find: /^vitest$/, replacement: repo + '/node_modules/vitest/dist/index.js'}
  ]},
  server: {fs: {allow: [repo, here]}},
  test: {include: [here + '/additional.test.ts'], testTimeout: 120000, globals: true, maxWorkers: 1}
};
~~~

### Nguồn: additional.test.ts

SHA-256: 4541c0b1b452254d2760f72e4d7c412a8b7da4effb63943aa5171d80f171d29f

~~~typescript
import {test,expect} from 'vitest';
import {readFileSync,writeFileSync} from 'node:fs';
import * as db from 'C:/workspace/Project-2C-review-2/packages/db/src/index.ts';
import {calendarDate,formatDate} from 'C:/workspace/Project-2C-review-2/packages/domain/src/index.ts';
import {outcomeResolver,rescheduleLinks} from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/appointments/appointments-view.ts';
const here='C:/workspace/deep-review-1-4/codex/H',now=()=>new Date(2026,9,5,12),today=calendarDate(2026,10,5);
test('branched reschedule snapshot produces contradictory list and dialog dates',async()=>{
 const json=JSON.parse(readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json','utf8'));
 const child=json.tables.appointments.find((a:any)=>a.status==='SCHEDULED'&&a.rescheduled_from_id!==null&&a.deleted_at===null);
 const duplicate={...child,id:'ZZZZZZZZZZZZZZZZZZZZZZZZZZ',date:'2026-10-30'};json.tables.appointments.push(duplicate);
 const imported=await db.importBackup(JSON.stringify(json),{now});
 const appointments=db.listAppointments(imported.db),parent=appointments.find(a=>a.id===child.rescheduled_from_id)!;
 const list=outcomeResolver({appointments,transitions:db.listStageTransitions(imported.db)})(parent);
 const dialog=rescheduleLinks(appointments,parent);
 const out={import:'ACCEPTED',parent:parent.id,firstChild:child.id,secondChild:duplicate.id,
 listDate:list?.kind==='rescheduled'?formatDate(list.to):null,dialogDate:dialog.to?formatDate(dialog.to.date):null,
 rescheduleCommand:'APPOINTMENT_NOT_SCHEDULED'};
 expect(out.listDate).not.toEqual(out.dialogDate);
 let commandCode;
 try{db.rescheduleAppointment(imported.db,parent.id,{date:calendarDate(2026,10,31)},'again');}catch(e:any){commandCode=e.code;}
 expect(commandCode).toBe('APPOINTMENT_NOT_SCHEDULED');
 writeFileSync(here+'/reschedule-results.json',JSON.stringify(out,null,2));imported.db.sqlite.close();
});
test('deleted reviewer and coordinator enter snapshot despite command checks',async()=>{
 const original=await db.openDatabase({now});
 const team=db.createTeam(original,{name:'T'}),re=db.createPerson(original,{name:'R',role:'RE',teamId:team.id}),
 helper=db.createPerson(original,{name:'Helper',role:'IS',teamId:null}),
 c=db.createCustomer(original,{name:'KH',reId:re.id,stage:'N3',date:today}),
 a=db.scheduleAppointment(original,{customerId:c.id,reId:re.id,date:today,triggerType:'OTHER',coordinatorIds:[helper.id]});
 db.recordMeetingOutcome(original,a.id,{status:'MET',stageAfter:'N3',nextStep:'Next',outcomeReviewerId:helper.id});
 let deletionCode;
 try{db.softDeletePerson(original,helper.id);}catch(e:any){deletionCode=e.code;}
 const json=JSON.parse(db.exportBackup(original));
 json.tables.people.find((p:any)=>p.id===helper.id).deleted_at=now().toISOString();
 const imported=await db.importBackup(JSON.stringify(json),{now});
 let editCode;
 try{db.editMeetingOutcome(imported.db,a.id,{status:'MET',stageAfter:'N3',nextStep:'Next changed',outcomeReviewerId:helper.id});}catch(e:any){editCode=e.code;}
 const out={commandDeletion:deletionCode,import:'ACCEPTED',visiblePeople:db.listPeople(imported.db),
 appointment:db.getAppointment(imported.db,a.id),editKeepingReviewer:editCode};
 expect(deletionCode).toBe('PERSON_IN_USE');expect(editCode).toBe('PERSON_NOT_FOUND');
 writeFileSync(here+'/participant-results.json',JSON.stringify(out,null,2));
 original.sqlite.close();imported.db.sqlite.close();
});


test('future deleted policy and missed appointment bypass date guards on restore',async()=>{
 const original=await db.openDatabase({now});
 const team=db.createTeam(original,{name:'T'}),re=db.createPerson(original,{name:'R',role:'RE',teamId:team.id}),
 c=db.createCustomer(original,{name:'KH',reId:re.id,stage:'N3',date:today}),
 p=db.submitPolicy(original,{customerId:c.id,reId:re.id,submittedDate:today,submittedFyp:1000}),
 a=db.scheduleAppointment(original,{customerId:c.id,reId:re.id,date:today,triggerType:'OTHER'});
 db.recordMeetingOutcome(original,a.id,{status:'NO_SHOW'});db.softDeleteAppointment(original,a.id);db.softDeletePolicy(original,p.id);
 const json=JSON.parse(db.exportBackup(original));json.tables.policies[0].submitted_date='2026-10-06';json.tables.appointments[0].date='2026-10-06';
 const imported=await db.importBackup(JSON.stringify(json),{now});
 db.restorePolicy(imported.db,p.id);db.restoreAppointment(imported.db,a.id);
 let after='ACCEPTED';try{const round=await db.importBackup(db.exportBackup(imported.db),{now});round.db.sqlite.close()}catch(e:any){after=JSON.stringify({code:e.code,params:e.params})}
 const out={initialImport:'ACCEPTED',restoredPolicy:db.getPolicy(imported.db,p.id),restoredAppointment:db.getAppointment(imported.db,a.id),roundtrip:after};
 expect(after).toContain('"rule":10');writeFileSync(here+'/future-restore-results.json',JSON.stringify(out,null,2));original.sqlite.close();imported.db.sqlite.close();
});
~~~

### Nguồn: browser.mjs

SHA-256: bc5853927d4e0931048a3bd96a4a8bd21ce09630608d96bc5ca774d17f5dfd3f

~~~javascript
import { createRequire } from 'node:module';
import { copyFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const repo='C:/workspace/Project-2C-review-2', here='C:/workspace/deep-review-1-4/codex/H';
const req=createRequire(repo+'/package.json');
const appReq=createRequire(repo+'/apps/desktop/package.json');
const {build,preview}=await import(pathToFileURL(appReq.resolve('vite')).href);
const patch={
  name:'review-harness-only', enforce:'pre',
  transform(code,id){
    if(!id.replaceAll('\\','/').endsWith('/src/main.tsx'))return;
    const changed=code.replace('.then(', '.then((data) => { window.__REVIEW_DATA__ = data; return data; }).then(').replace('storage: isTauri() ? tauriStorage(invoke) : undefined,',
      "storage: isTauri() ? tauriStorage(invoke) : window.__REVIEW_BINARY__ ? { load: async () => new Uint8Array(await (await fetch('/load.db')).arrayBuffer()), save: async () => {}, backup: async () => 'probe-only', writeExport: async () => 'probe-only', latestBackup: async () => undefined, openFolder: async () => {} } : undefined,")
      .replace('(data) => render(<App', '(data) => { window.__REVIEW_DATA__ = data; return render(<App')
      .replace('appWindow={isTauri() ? getCurrentWindow() : undefined} />),','appWindow={isTauri() ? getCurrentWindow() : undefined} />); },');
    if(changed===code)throw new Error('Harness transform did not match main.tsx');
    return changed;
  }
};
await build({
  root:repo+'/apps/desktop', configFile:repo+'/apps/desktop/vite.config.ts', configLoader:'runner',
  cacheDir:here+'/build-cache', plugins:[patch],
  define:{'import.meta.env.VITE_DEMO_ANCHOR':JSON.stringify('05/10/2026')},
  build:{outDir:here+'/dist',emptyOutDir:false}
});
copyFileSync(here+'/load.db',here+'/dist/load.db');
const server=await preview({root:repo+'/apps/desktop',configFile:false,build:{outDir:here+'/dist'},preview:{host:'127.0.0.1',port:4187,strictPort:true}});
const {chromium}=req('@playwright/test');
const browser=await chromium.launch({channel:'msedge',headless:true});
const out={startup:[],navigation:[],dialogs:[],errors:[]};
try {
  for(let i=0;i<4;i++){
    const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'vi-VN'});
    await context.addInitScript(({binary})=>{
      window.__REVIEW_BINARY__=binary;window.__LONGTASKS__=[];
      new PerformanceObserver(list=>window.__LONGTASKS__.push(...list.getEntries().map(e=>({start:e.startTime,ms:e.duration})))).observe({type:'longtask',buffered:true});
    },{binary:i!==0});
    const page=await context.newPage();
    page.on('pageerror',e=>out.errors.push(String(e)));
    page.on('console',m=>{if(m.type()==='error')out.errors.push(m.text());});
    await page.goto('http://127.0.0.1:4187/#/overview');
    await page.getByRole('region',{name:'Chỉ số của kỳ'}).waitFor({timeout:60000});
    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    out.startup.push(await page.evaluate(()=>({
      binary:window.__REVIEW_BINARY__,ms:performance.now(),
      seed:performance.getEntriesByName('p2c:demo-seed').map(e=>e.duration),
      tasks:window.__LONGTASKS__, counts:window.__REVIEW_DATA__.counts()
    })));
    if(i===1){
      for(const name of ['Báo cáo','Lịch hẹn','Khách hàng','Team & nhân sự','Cài đặt','Tổng quan']){
        const start=await page.evaluate(()=>performance.now());
        await page.getByRole('navigation').getByRole('link',{name,exact:true}).click();
        await page.getByRole('heading',{name,exact:true,level:1}).waitFor();
        await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
        out.navigation.push({name,ms:(await page.evaluate(()=>performance.now()))-start});
      }
      await page.getByRole('navigation').getByRole('link',{name:'Team & nhân sự',exact:true}).click();
      await page.getByRole('button',{name:'+ Team',exact:true}).click();
      const dialog=page.getByRole('dialog',{name:'Team mới'});
      await dialog.getByRole('textbox',{name:'Tên team'}).fill('Probe');
      const trap=[];
      for(let n=0;n<6;n++){await page.keyboard.press('Tab');trap.push(await page.evaluate(()=>({tag:document.activeElement.tagName,inDialog:!!document.activeElement.closest('dialog')})));}
      await dialog.getByRole('button',{name:'Hủy',exact:true}).click();
      out.dialogs.push({via:'cancel',focus:await page.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.textContent?.slice(0,120)})),trap});
      await page.getByRole('button',{name:'+ Team',exact:true}).click();await page.keyboard.press('Escape');
      out.dialogs.push({via:'escape',focus:await page.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.textContent?.slice(0,120)}))});
      await page.screenshot({path:here+'/team.png',fullPage:true});
    }
    await context.close();
  }
} finally {
  writeFileSync(here+'/browser-results.json',JSON.stringify(out,null,2));
  await browser.close();await new Promise(r=>server.httpServer.close(r));
}
console.log(JSON.stringify(out,null,2));
~~~

### Nguồn: ui-cases.mjs

SHA-256: 059214633832be5c84b7f7d6aa8088fd1885d21871950815c0eac6297093b8aa

~~~javascript
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {readFileSync,writeFileSync} from 'node:fs';
const repo='C:/workspace/Project-2C-review-2',here='C:/workspace/deep-review-1-4/codex/H';
const req=createRequire(repo+'/package.json'),appReq=createRequire(repo+'/apps/desktop/package.json');
const {preview}=await import(pathToFileURL(appReq.resolve('vite')).href);
const server=await preview({root:repo+'/apps/desktop',configFile:false,build:{outDir:here+'/dist'},preview:{host:'127.0.0.1',port:4187,strictPort:true}});
const browser=await req('@playwright/test').chromium.launch({channel:'msedge',headless:true});
const out={focus:[],overflow:null,emptyName:null,errors:[]};
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'vi-VN'});
 await context.addInitScript(()=>{window.__REVIEW_BINARY__=true});
 const page=await context.newPage();page.on('console',m=>{if(m.type()==='error')out.errors.push(m.text())});
 await page.goto('http://127.0.0.1:4187/#/team');
 await page.getByRole('button',{name:'+ Team',exact:true}).waitFor();
 for(const via of ['cancel','escape']){
  await page.getByRole('button',{name:'+ Team',exact:true}).focus();await page.keyboard.press('Enter');
  await page.getByRole('dialog',{name:'Team mới'}).waitFor();
  if(via==='cancel')await page.getByRole('dialog').getByRole('button',{name:'Hủy',exact:true}).click();
  else await page.keyboard.press('Escape');
  const afterClose=await page.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.textContent?.slice(0,60)}));
  await page.keyboard.press('Tab');
  const nextTab=await page.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.textContent?.slice(0,60)}));
  out.focus.push({via,afterClose,nextTab});
 }
 const source=JSON.parse(readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json','utf8'));
 for(const [i,p] of source.tables.policies.filter(p=>p.deleted_at===null).slice(0,2).entries()){
  p.submitted_date='2026-10-05';p.submitted_fyp=i===0?Number.MAX_SAFE_INTEGER:2;p.issued_date=null;p.issued_fyp=null;
 }
 await page.evaluate(async text=>{const data=window.__REVIEW_DATA__;await data.importBackup(await data.readBackup(text));},JSON.stringify(source));
 await page.getByRole('navigation').getByRole('link',{name:'Tổng quan',exact:true}).click();
 await page.getByRole('alert').waitFor();
 out.overflow=await page.getByRole('alert').innerText();
 await page.screenshot({path:here+'/overflow.png',fullPage:true});
 const valid=JSON.parse(readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json','utf8'));
 const customer=valid.tables.customers.find(c=>c.deleted_at===null);customer.name='';
 await page.evaluate(async text=>{const data=window.__REVIEW_DATA__;await data.importBackup(await data.readBackup(text));},JSON.stringify(valid));
 await page.getByRole('navigation').getByRole('link',{name:'Khách hàng',exact:true}).click();
 await page.getByRole('radio',{name:'Bảng',exact:true}).click();
 const link=page.locator('a[href="#/customers/'+customer.id+'"]');
 out.emptyName={id:customer.id,count:await link.count(),text:await link.innerText(),box:await link.boundingBox()};
 await context.close();
}finally{writeFileSync(here+'/ui-results.json',JSON.stringify(out,null,2));await browser.close();await new Promise(r=>server.httpServer.close(r))}
console.log(JSON.stringify(out,null,2));
~~~

### Nguồn: mutation.mjs

SHA-256: e797072a0772d2e32b66d9b43bea70420b9379ce1e74c230ac83d8a9810cb8a6

~~~javascript
import {cpSync,readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
const repo='C:/workspace/Project-2C-review-2',here='C:/workspace/deep-review-1-4/codex/H/mutation';
mkdirSync(here,{recursive:true});
cpSync(repo+'/packages/db/src',here+'/db/src',{recursive:true});
cpSync(repo+'/packages/db/migrations',here+'/db/migrations',{recursive:true});
cpSync(repo+'/packages/domain/src',here+'/domain/src',{recursive:true});
const base=here+'/vitest.config.mjs';
writeFileSync(base,"export default "+JSON.stringify({
  root:here,cacheDir:here+'/cache',
  resolve:{alias:{'drizzle-orm':repo+'/packages/db/node_modules/drizzle-orm','sql.js':repo+'/packages/db/node_modules/sql.js','zod':repo+'/packages/db/node_modules/zod','@p2c/domain':repo+'/packages/domain/src/index.ts',vitest:repo+'/node_modules/vitest/dist/index.js'}},
  test:{include:['db/src/policies.test.ts','domain/src/stats.test.ts','domain/src/stats-rf.test.ts'],testTimeout:60000,maxWorkers:1}
},null,2));
const req=createRequire(repo+'/package.json'),cli=repo+'/node_modules/vitest/vitest.mjs';
const run=(name)=>{
 const p=spawnSync(process.execPath,[cli,'run','--config',base],{cwd:repo,encoding:'utf8'});
 writeFileSync(here+'/'+name+'.log',p.stdout+p.stderr);return {exit:p.status,tail:(p.stdout+p.stderr).slice(-1500)};
};
const control=run('control');
const target=here+'/db/src/policies.ts',source=readFileSync(target,'utf8');
const marker='    requireRe(db, row.reId);';
if(source.split(marker).length!==2)throw new Error('Mutation marker ambiguous');
writeFileSync(target,source.replace(marker,'    // REVIEW MUTATION: omit the RE validation only on restore.'));
const surviving=run('restore-re-mutant');
writeFileSync(target,source);
const stats=here+'/domain/src/stats.ts',original=readFileSync(stats,'utf8');
writeFileSync(stats,original.replace('caseSize: sum(submitted.map((policy) => policy.submittedFyp)),','caseSize: sum(submitted.map((policy) => policy.submittedFyp)) + 1,'));
const killed=run('sum-mutant');
writeFileSync(stats,original);
const out={control,omitRestoreRe:surviving,addOneToCaseSize:killed};
writeFileSync(here+'/results.json',JSON.stringify(out,null,2));console.log(JSON.stringify(out,null,2));
~~~

### Nguồn: mutation-guard.mjs

SHA-256: 659329a2ac6124e45ae252cc03edbbf2273921a1bb5acbd3f208307c915e80e6

~~~javascript
import {readFileSync,writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const repo='C:/workspace/Project-2C-review-2',here='C:/workspace/deep-review-1-4/codex/H/mutation';
const config={root:here,cacheDir:here+'/guard-cache',resolve:{alias:{
 '@p2c/domain':repo+'/packages/domain/src/index.ts',vitest:repo+'/node_modules/vitest/dist/index.js',
 'drizzle-orm':repo+'/packages/db/node_modules/drizzle-orm','sql.js':repo+'/packages/db/node_modules/sql.js','zod':repo+'/packages/db/node_modules/zod'
}},test:{include:['restore-guard.test.ts'],maxWorkers:1}};
writeFileSync(here+'/guard.config.mjs','export default '+JSON.stringify(config));
const run=name=>{const r=spawnSync(process.execPath,[repo+'/node_modules/vitest/vitest.mjs','run','--config',here+'/guard.config.mjs'],{cwd:repo,encoding:'utf8'});writeFileSync(here+'/'+name+'.log',r.stdout+r.stderr);return {exit:r.status,result:JSON.parse(readFileSync(here+'/guard-result.json','utf8'))}};
const target=here+'/db/src/policies.ts',original=readFileSync(target,'utf8');
const control=run('guard-control');
writeFileSync(target,original.replace('    requireRe(db, row.reId);','    // REVIEW MUTATION: omit the RE validation only on restore.'));
const mutant=run('guard-mutant');writeFileSync(target,original);
writeFileSync(here+'/guard-results.json',JSON.stringify({control,mutant},null,2));console.log(JSON.stringify({control,mutant},null,2));
~~~

### Nguồn: mutation/restore-guard.test.ts

SHA-256: 33b4a7551644ed799e3659a8221359d75e41b0e1837e031a942b075b65c566b3

~~~typescript
import {test,expect} from 'vitest';
import {writeFileSync} from 'node:fs';
import {calendarDate} from '@p2c/domain';
import {openDatabase,createTeam,createPerson,createCustomer,submitPolicy,softDeletePolicy,updateCustomerProfile,softDeletePerson,restorePolicy,importBackup,exportBackup} from './db/src/index';
test('restoring a policy whose former RE was deleted is refused atomically',async()=>{
 const database=await openDatabase({now:()=>new Date(2026,9,5,12)});
 const team=createTeam(database,{name:'T'}),old=createPerson(database,{name:'Old',role:'RE',teamId:team.id}),other=createPerson(database,{name:'Other',role:'RE',teamId:team.id});
 const c=createCustomer(database,{name:'KH',reId:old.id,stage:'N4',date:calendarDate(2026,10,1)});
 const p=submitPolicy(database,{customerId:c.id,reId:old.id,submittedDate:calendarDate(2026,10,5),submittedFyp:1000});
 softDeletePolicy(database,p.id);updateCustomerProfile(database,c.id,{reId:other.id});softDeletePerson(database,old.id);
 let code='SUCCESS';try{restorePolicy(database,p.id)}catch(e:any){code=e.code}
 let snapshot='ACCEPTED';try{const r=await importBackup(exportBackup(database));r.db.sqlite.close()}catch(e:any){snapshot=JSON.stringify({code:e.code,params:e.params})}
 writeFileSync('C:/workspace/deep-review-1-4/codex/H/mutation/guard-result.json',JSON.stringify({restore:code,snapshot},null,2));
 database.sqlite.close();expect(code).toBe('PERSON_NOT_FOUND');
});
~~~

### Nguồn: vitest.unit.config.mts

SHA-256: d3226cac1b913a01c988bc1c977a237879a0059299f11f1138660e4a0d7cc55a

~~~typescript
import base from 'C:/workspace/Project-2C-review-2/vitest.config.ts';
const here='C:/workspace/deep-review-1-4/codex/H';
export default {...base,root:'C:/workspace/Project-2C-review-2',cacheDir:here+'/unit-cache',
test:{...base.test,maxWorkers:2,coverage:{...base.test.coverage,reportsDirectory:here+'/coverage'}}};
~~~

## 7. Kết luận đóng Phase 4 từ gói H

**CHƯA SẴN SÀNG.** CX-H2 và CX-H3 xác nhận biên nhập backup nhận quan hệ mà command không sinh ra, dẫn tới lỗi sửa cuộc gặp và hai cách hiển thị cùng lần dời không khớp. CX-H1 xác nhận một bộ số tiền hợp lệ theo từng bản ghi gây sai tổng và làm hỏng Tổng quan. Đây là căn cứ cần xử lý/Owner quyết định trước khi đóng Phase 4, dù toàn bộ unit test và ngưỡng coverage đang xanh.

Bốn mục Low là lỗi focus, tên qua backup, thiếu test guard và API khôi phục ngày; riêng API khôi phục chưa có UI ở Phase 4 nên không dùng làm lý do chính chặn đóng phase. Không có PLAUSIBLE cần suy đoán. Hiệu năng đã đo trên tải nhưng chưa bao gồm I/O Tauri; phần này không đưa ra kết luận về exe thật. Kết luận chỉ dựa vào code/probe của phiên H, không đại diện hay tổng hợp các gói/báo cáo khác, không phải đề xuất merge.
