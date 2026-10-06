# Review độc lập — Gói G: tools, CI và e2e

Ngày: 05/10/2026. Reviewer: Codex, phiên chính, không subagent.

SHA đã kiểm trước review và kiểm lại cuối các lượt chạy: `f0c53eb57eb7eac8665ad87287e794ae4c5bc43b` (detached HEAD), tại `C:\workspace\Project-2C-review-2`.

**Kết quả: 5 phát hiện CONFIRMED — 1 High, 4 Medium.** Không có phát hiện PLAUSIBLE. Các phát hiện liên quan công cụ quy trình và chất lượng test; mutation Excel chứng minh khoảng trống kiểm thử, không khẳng định bản sản phẩm hiện tại xuất file hỏng.

Không mở, đọc, liệt kê hay tìm kiếm thư mục báo cáo Claude; không đọc báo cáo review Claude của đợt này. Không tổng hợp với báo cáo khác, không tạo Issue, không đề xuất merge. Không sửa file theo dõi trong repo, không commit. Chỉ ghi bản sao test, build, probe và log dưới `C:\workspace\deep-review-1-4\codex\G\`, cùng báo cáo này. Không đổi golden.

## 1. Phạm vi và cách kiểm

Đã đọc toàn bộ các file theo dõi trong `tools/`, `.github/`, `.claude/hooks/`, `e2e/` tại SHA ghim; bảng từng file và số dòng ở phụ lục A. Fixture `tools/fixtures/retro/review.jsonl` là dữ liệu test có sẵn trong repo, không phải báo cáo review của đợt này.

Đã đọc tài liệu bắt buộc: `CLAUDE.md`, `CONTEXT.md`, `docs/process/deep-review-phase-1-4.md`, `docs/design/phase-3-du-lieu.md`, `docs/design/phase-4-chi-so.md`, toàn bộ `docs/golden/*.md`. Tham chiếu bổ sung: `playwright.config.ts`, `vitest.config.ts`, `package.json`, `apps/desktop/vite.config.ts`, `.claude/rules/ci.md`, `.claude/rules/tests.md`, `.claude/settings.json`, `.githooks/pre-push`, ADR-0003 và lệnh HANDOFF. Đối chiếu giao diện test với `main.tsx`, `data/app-data.ts`, `data/AppDataContext.tsx`, `routes/team/TeamScreen.tsx`, `routes/reports/ReportExport.tsx`, `report-workbook.ts` và test của nó; đọc phần DB/backup được gọi bởi probe tải. Các file sản phẩm ngoài G chỉ được đọc để kiểm chứng seam, không nhận thêm phạm vi review gói khác.

Nguồn chung duy nhất dùng đối chiếu: `C:\workspace\deep-review-1-4\common\README.md`, `known.md`, `baseline.md`, `load/load-backup.json`. Không chép lại số baseline trong báo cáo này.

Không chạy trực tiếp script có tác dụng phụ lên repo, GitHub hoặc toolchain (`merge-pr`, `session-end`, `bootstrap`, `handoff write`). Probe merge chỉ gọi hàm quyết định thuần; probe HANDOFF dùng bản sao nguyên trạng `handoff.mjs` + `session-core.mjs`, chỉ thay lớp I/O bằng mock ngoài repo. Các lệnh Git nguy hiểm chỉ được quan sát trong kế hoạch trả về, không được thực thi.

Build Vite dùng nguồn repo chỉ đọc, `configFile:false`, cache và `outDir` ngoài repo; cùng plugin, target và quy tắc tách chunk của cấu hình thật. E2e dùng bản sao test và Microsoft Edge, cổng riêng, không dùng lại server. Chỉ chỉnh đường dẫn kiểm assets của `chart.spec.ts` để trỏ đến build tạm; giữ nguyên assertion chức năng. Ngày app cho bản clean/mutant giữ `15/09/2026`, giống cấu hình e2e của repo. Bản đo tải dùng `05/10/2026`.

## 2. Phát hiện

### CX-G1 — Dọn nhánh có thể xóa công việc đã commit nhưng chưa push

- **ID:** CX-G1
- **Mức:** High
- **Trục:** D
- **Vị trí:** `tools/pr-core.mjs:183` và `:188`; lớp gọi `tools/merge-pr.mjs:67`, `:144` (SHA `f0c53eb`).
- **Tình trạng:** CONFIRMED
- **Mô tả:** `cleanupPlan` coi working tree sạch là đủ để gỡ worktree task và xóa nhánh bằng `branch -D`. Nó không so HEAD local với `headRefOid` đã merge, dù `parseWorktrees` đã cung cấp trường `head`; lớp gọi cũng không truyền SHA của PR vào kế hoạch.
- **Tái hiện / bằng chứng:** chạy `node C:/workspace/deep-review-1-4/codex/G/tool-probes.mjs`. Trường hợp PR đã merge HEAD `aaaa…`, worktree task sạch ở HEAD `cccc…` (mô phỏng commit mới chưa push), không có PR xếp chồng. Hàm thật trả `problems: []` và các bước `push origin --delete task/T-9-probe`, `worktree remove …/scratch-task`, `branch -D task/T-9-probe`. Xem `G/tool-probes.json` / `G/tool-probes.log`; nguồn nguyên vẹn ở phụ lục B. Không chạy các bước xóa đó.
- **Ảnh hưởng:** người đã commit thêm trên nhánh task mà chưa push, hoặc phiên song song vừa tạo commit trong lúc merge. Công việc chưa merge mất worktree và tên nhánh local; có thể phải phục hồi bằng reflog. Không khẳng định commit bị mất vĩnh viễn ngay lập tức.
- **Đề xuất:** truyền SHA PR đã merge vào cleanup; trước khi xóa kiểm cả ref local và remote không tiến thêm/diverge, giữ lại và báo khi không khớp. Kiểm lại trước bước phá hủy để giảm cửa sổ race. Thêm case working tree sạch nhưng HEAD mới hơn. Ước lượng ≤ 100 dòng SP, ≤ 80 dòng test.

### CX-G2 — Thiếu nhãn bắt buộc `build-exe` vẫn qua cổng merge

- **ID:** CX-G2
- **Mức:** Medium
- **Trục:** C
- **Vị trí:** `tools/pr-core.mjs:77`; `.github/workflows/ci.yml:52` và nhánh điều kiện job build exe; quy tắc `CLAUDE.md` bước 5 (SHA `f0c53eb`).
- **Tình trạng:** CONFIRMED
- **Mô tả:** kiểm job exe chỉ chạy nếu PR đã có nhãn `build-exe`. Quên nhãn trên PR sửa Rust/Cargo hoặc cấu hình build khiến job bị bỏ qua, nhưng `mergeBlockers` vẫn trả không có chặn khi Verify xanh. Điều này bỏ sót điều kiện build bắt buộc đã được repo quy định.
- **Tái hiện / bằng chứng:** `tool-probes.mjs` tạo PR `risk:low`, REVIEW PASS đúng SHA, Verify SUCCESS, Build portable exe SKIPPED, không có nhãn `build-exe`. Với từng đường dẫn `apps/desktop/src-tauri/src/storage.rs`, `apps/desktop/src-tauri/Cargo.toml`, `rust-toolchain.toml`, `package.json`, `pnpm-lock.yaml`, `apps/desktop/vite.config.ts`, kết quả `blockers: []`. Đây là hàm thật nhận đầu vào PR giả, không gọi GitHub/merge thật. Log và JSON trong `G/`.
- **Ảnh hưởng:** lỗi Rust, cấu hình đóng gói hoặc dependency build có thể vào main sau review mà chưa từng qua job exe bắt buộc. Verify không thay thế kiểm Rust/build portable.
- **Đề xuất:** suy ra yêu cầu build từ `pr.files` theo danh sách đã duyệt; thiếu nhãn hoặc thiếu job exe SUCCESS phải chặn. Giữ hành vi docs-only đã thống nhất. Ước lượng ≤ 50 dòng SP, ≤ 60 dòng test.

### CX-G3 — Refresh HANDOFF nhận mốc của bản chưa đọc, cho phép lần ghi sau đè nó

- **ID:** CX-G3
- **Mức:** Medium
- **Trục:** D
- **Vị trí:** `tools/handoff.mjs:111`–`:113` (SHA `f0c53eb`).
- **Tình trạng:** CONFIRMED
- **Mô tả:** sau khi edit, script fetch Issue và lưu `.base.json` vô điều kiện. Nếu máy B ghi sau edit của A nhưng trước refresh, A lưu timestamp của B trong khi file đang sửa vẫn là nội dung A; lần `write <file>` kế tiếp được chấp nhận dù A chưa đọc/ghép nội dung B.
- **Tái hiện / bằng chứng:** probe dùng hai module thật chép nguyên trạng và mock `session-io`. A có base v1, ghi bản A1; B ghi v3 sau A1 và trước fetch refresh. Lần đầu trả `refreshWarning: null`, base của A trở thành v3 nhưng draft vẫn A1. A sửa thành A2 và gọi `writeHandoff` lần nữa, không reread B: lần hai cũng không có cảnh báo, nội dung B bị thay bằng A2. `G/handoff-probe.json` lưu từng trạng thái, source mock và probe ở phụ lục B. Không ghi Issue thật.
- **Ảnh hưởng:** người dùng CLI ghi lại cùng draft sau lần ghi thành công có thể đè HANDOFF của máy kia. Lệnh `/handoff` chuẩn luôn đọc lại trước khi sửa nên làm giảm khả năng gặp; phát hiện không giả định bỏ bước đó trong lệnh chuẩn.
- **Đề xuất:** chỉ cập nhật base khi body fetch sau edit khớp body vừa gửi và Issue vẫn đúng; nếu không khớp, không cấp base mới và yêu cầu `read --out` trước lần ghi tiếp theo. Ước lượng ≤ 40 dòng SP, ≤ 60 dòng test.
- **Phân biệt điều đã chấp nhận:** ADR-0003 đã chấp nhận race từ precheck đến edit vì GitHub không có conditional update. Ca này xảy ra **sau edit**, tạo base sai và cho phép một lần ghi sau đó không có cạnh tranh vẫn đè B; không đề nghị giải lại race đã ACCEPTED.

### CX-G4 — Test Team sẽ đỏ khi năm máy khác năm ghim của app

- **ID:** CX-G4
- **Mức:** Medium
- **Trục:** T
- **Vị trí:** `e2e/team.spec.ts:319`; đối chiếu `playwright.config.ts` env anchor, `apps/desktop/src/main.tsx:20`, `routes/team/TeamScreen.tsx:141` (SHA `f0c53eb`).
- **Tình trạng:** CONFIRMED
- **Mô tả:** test kỳ vọng cột `HĐ năm ${new Date().getFullYear()}` theo đồng hồ Node. App trong e2e dùng ngày ghim `15/09/2026`, nên cột hợp lệ là năm 2026. Comment “app counts the year of the machine clock” trong test không còn đúng với cấu hình ghim.
- **Tái hiện / bằng chứng:** bản sao `G/tests-year/team.spec.ts` chỉ đổi dòng lấy năm thành `new Date(2027, 0, 1).getFullYear()` để mô phỏng host năm 2027; build clean không đổi. Lệnh `node node_modules/@playwright/test/cli.js test --config C:/workspace/deep-review-1-4/codex/G/playwright-year.config.mjs --workers 1 --grep "member columns"` thất bại 1/1: hết 15 giây chờ header `/HĐ năm 2027/`; snapshot lỗi vẫn có `HĐ năm 2026`. Ca gốc xanh trong lượt 145 test chức năng. Không đổi đồng hồ hệ thống thật.
- **Ảnh hưởng:** CI và máy Owner sau khi qua năm 2027, hoặc máy đặt năm khác, bị đỏ giả dù tính toán UI đúng. Mỗi lượt retry thêm thời gian chờ và ngăn Verify/merge.
- **Đề xuất:** kỳ vọng dựa vào ngày ghim chung của e2e, hoặc truyền cùng clock/anchor cho app và test. Không đổi sản phẩm hay golden để khớp năm host. Ước lượng 0 dòng SP, < 20 dòng test/config.

### CX-G5 — File Excel hỏng hoàn toàn vẫn làm e2e xuất báo cáo xanh

- **ID:** CX-G5
- **Mức:** Medium
- **Trục:** T
- **Vị trí:** `e2e/reports.spec.ts:149`–`:157`; seam xuất thật `apps/desktop/src/routes/reports/ReportExport.tsx:89` (SHA `f0c53eb`).
- **Tình trạng:** CONFIRMED
- **Mô tả:** test có tên hứa kiểm report đúng kỳ/góc nhìn và sheet đúng từng bảng, nhưng chỉ kiểm tên file, thông báo UI “4 sheet” và console. Không đọc bytes tải xuống, workbook hoặc số liệu, nên lỗi ở bước chuyển workbook thành download không bị phát hiện.
- **Tái hiện / bằng chứng:** Vite transform tạm đúng một chỗ: `new Blob([bytes], …)` → `new Blob([bytes.subarray(0, 1)], …)`. Không sửa nguồn trong repo hay mock workbook. Chạy cả 8 test gốc `reports.spec.ts` trên build mutant: **8/8 xanh**. Probe độc lập thứ 9 lưu file thật `G/corrupted-download.xlsx`: đúng **1 byte**, ExcelJS báo `End of data reached … Corrupted zip ?`. Cả lượt 9 test xanh vì probe thứ 9 chủ ý chứng minh file hỏng. Xem `G/e2e-mutant.log`, `G/excel-mutation-evidence.json`; nguồn transform/probe ở phụ lục B.
- **Ảnh hưởng:** regression làm tải file hỏng hoặc truyền sai bytes/scope có thể qua e2e. Unit `report-workbook.test.ts` kiểm workbook builder là hữu ích, nhưng không đi qua Blob/download ở TSX; mutation nằm ngoài seam được unit đó gọi.
- **Đề xuất:** đọc download thực bằng ExcelJS đã có, kiểm workbook mở được, tên/số sheet, vài ô số khớp bảng đang hiển thị; thêm ca có lựa chọn kỳ đang chờ Lọc để kiểm applied scope. Không thêm dependency. Ước lượng 0 dòng SP, ≤ 100 dòng test.

## 3. Kết quả chạy và số đo tải

Các lệnh dưới dùng dependency có sẵn, không cài công cụ. Node `v24.20.0`, Vitest `5.0.1`, Playwright Microsoft Edge, Windows. Log/raw JSON nằm trong thư mục `G/`; nguồn probe ở phụ lục B.

| Kiểm tra riêng trong phiên này | Kết quả |
|---|---|
| Bản sao nguyên trạng 5 file unit tools | 96/96 xanh, 484 ms |
| Mutation bỏ `REVIEWERS.has(authorAssociation)` tại đúng một chỗ | 2 test đỏ / 94 xanh; quyền reviewer được test bắt lỗi |
| `node tools/codemap.mjs --check` | Xanh, export maps khớp |
| `tsc -p e2e --noEmit --noUnusedLocals --noUnusedParameters --incremental false` | Xanh |
| Lượt e2e đầy đủ ban đầu | Test seed đỏ: 6.101,5 ms > ngưỡng local 5.000 ms; 145 test dependency chưa chạy |
| Chạy riêng project chức năng `edge --no-deps` | 145/145 xanh, 10,2 phút, 2 worker, không retry |
| Chạy lại riêng project seed, không probe tải/e2e khác đồng thời | 1/1 xanh; measure thật 3503,500 ms < 5.000 ms |
| 8 test Báo cáo trên mutant cắt file + probe file hỏng | 9/9 xanh; mutation sống sót, CX-G5 |
| Ca Team mô phỏng năm Node 2027 | 1/1 đỏ đúng header năm, CX-G4 |
| Probe UI với backup tải | 1/1 xanh, nhập xong và download Excel |
| Import → export bộ tải, đối chiếu deep equality từng bảng | 3/3 lượt giữ nguyên cả 11 bảng |

Lượt seed đỏ ban đầu được giữ trong `G/e2e-clean.log`; kết quả chức năng riêng ở `G/e2e-edge.log`, `G/e2e-edge.json`; đo seed lại ở `G/e2e-seed-isolated.json`. Không trình bày lượt e2e đầy đủ ban đầu là xanh. Chưa cô lập nguyên nhân lượt 6,1 giây, nên không quy nó thành lỗi hiệu năng sản phẩm hay đề xuất nới ngưỡng.

Bộ tải dùng đúng file chung `common/load/load-backup.json`: **15.784.463 byte; 1.496 KH, 10.434 lịch hẹn, 51 nhân sự, 4 team**. Ngoài ra có 1.804 policy, 1.533 coordinator, 13.928 KYC fact, 5.705 KYC note, 13.209 KYC version, 4.978 stage transition, 0 setting. Không sinh/chỉnh lại fixture.

| Lượt Node, không chạy test khác đồng thời | Import backup (ms) | Export backup (ms) |
|---|---:|---:|
| 1 | 2.396,749 | 368,623 |
| 2 | 2.815,107 | 533,650 |
| 3 | 3.335,002 | 515,547 |
| Trung vị | 2.815,107 | 515,547 |

`importBackup` bao gồm parse/validation và mở DB; `exportBackup` gồm serialize. Mỗi lượt tạo DB riêng, gọi code DB thật, so sánh toàn bộ `tables` của JSON xuất với file gốc, rồi đóng SQLite. Thời gian assertion không nằm trong hai cột. JSON xuất mỗi lượt vẫn 15.784.463 byte. Kết quả chính ở `G/load-perf.json`; lượt đầu có e2e chạy đồng thời được giữ riêng `G/load-perf-contended.json`, không dùng nó làm số chính.

Probe Edge một lượt, cache trình duyệt/DB mới, build ngày `05/10/2026`: chọn file → hiện xác nhận **2.103,940 ms**; bấm Thay dữ liệu → hộp đóng **213,072 ms**; chuyển Báo cáo → bảng Tổng hợp hiện **281,959 ms**; bấm Xuất Excel → download lưu xong **296,106 ms**. Tên file `bao-cao_2026-10_toan-bo_2026-10-05.xlsx`. Đây là thời gian đầu-cuối có overhead Playwright/DOM, không phải profile tách riêng CPU React/SQL hay đo filesystem của Tauri. Probe UI đầu tiên lỗi selector không exact trong source probe, đã sửa probe; log lỗi setup giữ riêng `G/e2e-load-probe-setup-error.log`, không coi là lỗi sản phẩm.

Đã đọc output kích thước các chunk từ build tạm và đối chiếu cách tách chart/Excel. Không có số đo cho một regression hay điểm nghẽn riêng của G đủ để lập phát hiện P. Không gọi việc nhập tải ~2–3 giây tự nó là lỗi khi chưa có ngưỡng/hồi quy và số đo nguyên nhân.

## 4. KNOWN và mọi trục đã xét

Các mục sau được nhận diện qua `common/known.md`, không báo lại như phát hiện mới và không tính vào bảng đếm:

| KNOWN | Đối chiếu trong gói G |
|---|---|
| `DataTable`: thiếu test `sortable:false` và bảng rỗng | Đã đọc `e2e/data-table.spec.ts` và test dùng bảng ở các màn; không lập lại Issue/test-gap |
| #185 `SettingsBackup`: chưa test `SCHEMA_TOO_NEW` | E2e backup hiện kiểm các ca nhập sai/hủy/roundtrip, không có bằng chứng mới cho nhánh này |
| #163 link “Xem tất cả (n)” khi > 5 lịch | Đã đọc `appointments.spec.ts` và `customer-appointments.spec.ts`; không đánh đồng seam hồ sơ KH với seam lịch hẹn còn thiếu |
| #125 CloseGuard React wiring chưa có test tự động | E2e web không đi qua cửa sổ Tauri thật; giữ là KNOWN |
| P8/P12/T2 Chart thiếu số liệu cho screen reader | E2e chart kiểm canvas/lazy chunk/nhãn, không chứng minh đã giải quyết KNOWN |
| S-2 replace/opening chồng nhau | Probe tải là tuần tự; không tuyên bố kiểm hết race đã biết |

| Trục | Cách đã xét và kết quả |
|---|---|
| **E** | Đọc xử lý rỗng/thiếu/handoff dài, phiên bản stale, nhiều Issue handoff, REVIEW thiếu SHA/đổi head, risk thay đổi, branch bẩn/sạch và PR xếp chồng; chạy unit tools. Kiểm điểm lệch năm bằng probe CX-G4, thao tác cạnh tranh bằng CX-G1/CX-G3 (đếm theo trục chính D/T). **Đã xét, không thấy phát hiện E độc lập khác**. Không suy ra kiểm hết biên tiền/ngày nghiệp vụ từ G. |
| **C** | So workflow/merge blocker với quy tắc docs-only, CI, EXE, SHA REVIEW và scope hiển thị/xuất. CX-G2 vi phạm cổng build; CX-G5 có seam test không đáp ứng tên test. **Đã xét, không thấy thêm ngoài các mục đã nêu**. |
| **D** | So đường ghi HANDOFF, bước cleanup Git, `$LASTEXITCODE` cho native lệnh có tác dụng phụ, pathspec commit của session-end; không thực thi script mutation thật. Xác nhận CX-G1/CX-G3. Import/export tải deep-equal toàn bộ 11 bảng. **Đã xét, không thấy thêm thất thoát dữ liệu trong roundtrip tuần tự**. Không kiểm lại toàn bộ migration/Rust ở G. |
| **P** | Đo 3 lượt DB thật và 1 lượt UI tải; quan sát chunk build, dự án seed chạy đơn và workers. Giữ cả lượt seed đỏ và lượt đo lại xanh. **Đã xét, không thấy điểm nghẽn/hồi quy riêng của G đủ bằng chứng để lập phát hiện P**; giới hạn là chưa đo file I/O desktop thật và chưa profile CPU từng component. |
| **B** | Đọc mọi export của tools và entrypoint/hooks/scripts trong package/settings; dùng `rg` kiểm caller, kiểm codemap và tsc noUnused ở e2e. Các helper lặp nhỏ giữa hai test không tự coi là bloat gây lỗi. **Đã xét, không thấy code chết/export không dùng/code lặp ≥ 3 nơi có hậu quả cụ thể trong G**. |
| **T** | Đọc assertion cả 146 e2e và 96 unit tools, cách seed/clock, dependency/order, mock, skip/only. Không thấy test bị disable tùy tiện. Chạy chức năng, mutation quyền reviewer (bị bắt), mutation download (sống sót) và năm khác. CX-G4/CX-G5; các gap trùng danh sách trên là KNOWN. **Đã xét, không thấy thêm test-gap có bằng chứng mutation ngoài các mục này**. |
| **A** | Đọc và chạy selectors tiếng Việt theo role/name, nhãn form, thông báo lỗi, test submit bằng Enter, keyboard ở DataTable/điều hướng; đối chiếu locale và format ngày/số. **Đã xét, không thấy lỗi trợ năng/i18n mới trong phạm vi G**. Đây không phải audit tương phản/focus trap toàn UI; không tuyên bố role selector chứng minh thứ tự Tab hoặc screen reader hoàn chỉnh; chart SR là KNOWN. |
| **S** | Đọc/chạy e2e từ chối backup sai format/ngày, chặn file quá lớn trước đọc text, roundtrip/cancel; kiểm tên download backup/Excel. **Đã xét, không thấy lỗi an toàn hẹp mới qua các seam web của G**. E2e dùng browser download, không kiểm end-to-end đường dẫn/claim/rename của Tauri; đó là gói C. Không mở rộng sang bảo mật web/AI/API key. |

## 5. Bảng đếm mức × trục

Mỗi phát hiện tính đúng một lần theo trục chính; KNOWN không tính.

| Mức | E | C | D | P | B | T | A | S | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| Medium | 0 | 1 | 1 | 0 | 0 | 2 | 0 | 0 | 4 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Tổng** | **0** | **1** | **2** | **0** | **0** | **2** | **0** | **0** | **5** |

Chỉ kết luận cho G. Không kết luận SẴN SÀNG/CHƯA SẴN SÀNG đóng Phase 4 ở đây; phần đó thuộc gói H theo yêu cầu.

## Phụ lục A — File trong phạm vi G đã đọc

Số dòng là dòng vật lý tại SHA ghim, tính bỏ dòng rỗng do newline cuối file. Đọc toàn bộ file, gồm test/fixture/config.

| File (repo) | Dòng |
|---|---:|
| `.claude/hooks/handoff-context.mjs` | 25 |
| `.claude/hooks/review-pr-hint.mjs` | 29 |
| `.github/ISSUE_TEMPLATE/config.yml` | 1 |
| `.github/ISSUE_TEMPLATE/task.yml` | 73 |
| `.github/pull_request_template.md` | 17 |
| `.github/workflows/ci.yml` | 114 |
| `e2e/appointment-outcome.spec.ts` | 383 |
| `e2e/appointments.spec.ts` | 764 |
| `e2e/backup.spec.ts` | 164 |
| `e2e/chart.spec.ts` | 69 |
| `e2e/customer-appointments.spec.ts` | 130 |
| `e2e/customer-forms.spec.ts` | 205 |
| `e2e/customer-kyc.spec.ts` | 148 |
| `e2e/customer-policies.spec.ts` | 136 |
| `e2e/customers.spec.ts` | 151 |
| `e2e/data-table.spec.ts` | 73 |
| `e2e/demo-data.spec.ts` | 36 |
| `e2e/navigation.spec.ts` | 172 |
| `e2e/overview.spec.ts` | 178 |
| `e2e/period-picker.spec.ts` | 280 |
| `e2e/reports.spec.ts` | 196 |
| `e2e/screen-error.spec.ts` | 73 |
| `e2e/seed-timing.spec.ts` | 18 |
| `e2e/serve.mjs` | 26 |
| `e2e/smoke.spec.ts` | 36 |
| `e2e/support.ts` | 11 |
| `e2e/team.spec.ts` | 336 |
| `e2e/theme.spec.ts` | 74 |
| `e2e/tsconfig.json` | 8 |
| `tools/bootstrap.ps1` | 210 |
| `tools/codemap-core.mjs` | 187 |
| `tools/codemap-core.test.mjs` | 197 |
| `tools/codemap.mjs` | 95 |
| `tools/fixtures/retro/broken.jsonl` | 8 |
| `tools/fixtures/retro/review.jsonl` | 5 |
| `tools/fixtures/retro/task.jsonl` | 17 |
| `tools/handoff.mjs` | 154 |
| `tools/merge-pr.mjs` | 151 |
| `tools/pr-core.mjs` | 204 |
| `tools/pr-core.test.mjs` | 417 |
| `tools/pr-status.mjs` | 105 |
| `tools/retro-core.mjs` | 242 |
| `tools/retro-core.test.mjs` | 152 |
| `tools/retro.mjs` | 56 |
| `tools/review-hint-core.mjs` | 30 |
| `tools/review-hint-core.test.mjs` | 29 |
| `tools/session-core.mjs` | 107 |
| `tools/session-core.test.mjs` | 157 |
| `tools/session-end.ps1` | 71 |
| `tools/session-io.mjs` | 14 |
| `tools/session-start.ps1` | 72 |
| `tools/status.mjs` | 77 |
| **Tổng 52 file** | **6683** |

## Phụ lục B — Nguồn test tạm, patch và cách chạy

Mọi đường dẫn bên dưới nằm trong `C:/workspace/deep-review-1-4/codex/G`. Bản sao nguyên trạng tools/e2e lấy từ SHA `f0c53eb`. Mutation chỉ tồn tại trong bản sao hoặc Vite transform của build tạm. Không chạy script nào với mục tiêu ghi repo/GitHub thật.

Thiết lập module resolution: `G/node_modules` là junction tới `C:/workspace/Project-2C-review-2/node_modules`; cache Vitest/Vite/Playwright, results và build đều cấu hình dưới G. Không cài dependency, không thay file qua junction.

Các lệnh kiểm đã chạy (cwd là repo, `PWTEST_CACHE_DIR=C:/workspace/deep-review-1-4/codex/G/pw-cache`):

```powershell
node C:/workspace/deep-review-1-4/codex/G/tool-probes.mjs
node node_modules/vitest/vitest.mjs run --config C:/workspace/deep-review-1-4/codex/G/vitest-baseline.config.mjs
node node_modules/vitest/vitest.mjs run --config C:/workspace/deep-review-1-4/codex/G/vitest-mutant.config.mjs
node node_modules/vitest/vitest.mjs run --config C:/workspace/deep-review-1-4/codex/G/vitest-perf.config.mjs
node node_modules/@playwright/test/cli.js test --config C:/workspace/deep-review-1-4/codex/G/playwright-clean.config.mjs --project edge --no-deps
node node_modules/@playwright/test/cli.js test --config C:/workspace/deep-review-1-4/codex/G/playwright-seed.config.mjs --project seed-timing
node node_modules/@playwright/test/cli.js test --config C:/workspace/deep-review-1-4/codex/G/playwright-mutant.config.mjs --workers 1 reports.spec.ts evidence.spec.ts
node node_modules/@playwright/test/cli.js test --config C:/workspace/deep-review-1-4/codex/G/playwright-year.config.mjs --workers 1 --grep "member columns"
node node_modules/@playwright/test/cli.js test --config C:/workspace/deep-review-1-4/codex/G/playwright-load.config.mjs --workers 1
```

### tool-probes.mjs

Nguồn: [tool-probes.mjs](C:/workspace/deep-review-1-4/codex/G/tool-probes.mjs).

```javascript
import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'node:fs';
import { join } from 'node:path';
import { mergeBlockers, cleanupPlan } from 'file:///C:/workspace/Project-2C-review-2/tools/pr-core.mjs';
const out = 'C:/workspace/deep-review-1-4/codex/G';
const repo = 'C:/workspace/Project-2C-review-2';
const head = 'a'.repeat(40);
const base = {number:9,state:'OPEN',isDraft:false,baseRefName:'main',headRefName:'task/T-9-probe',headRefOid:head,labels:[{name:'risk:low'}],comments:[{authorAssociation:'OWNER',body:'REVIEW: PASS\nhead `aaaaaaa`, mức `risk:low`'}],statusCheckRollup:[{name:'Verify (lint, typecheck, unit, boundaries)',status:'COMPLETED',conclusion:'SUCCESS'},{name:'Build portable exe',status:'COMPLETED',conclusion:'SKIPPED'}],files:[]};
const ctx = {owner:false,mode:'squash',stacked:[],baseMerged:null};
const missingLabel = ['apps/desktop/src-tauri/src/storage.rs','apps/desktop/src-tauri/Cargo.toml','rust-toolchain.toml','package.json','pnpm-lock.yaml','apps/desktop/vite.config.ts'].map(path => ({path,blockers:mergeBlockers({...base,files:[{path}]},ctx)}));
const branch = base.headRefName;
const worktrees = [{path:out+'/scratch-main',branch:'main',head:'b'.repeat(40)},{path:out+'/scratch-task',branch,head:'c'.repeat(40)}];
const cleanup = cleanupPlan({branch,worktrees,dirty:new Set(),stacked:[],remoteExists:true,localExists:true});
const result = {missingLabel,cleanupScenario:{mergedPRHead:head,taskHead:worktrees[1].head,clean:true},cleanup};
console.log(JSON.stringify(result,null,2));
writeFileSync(out+'/tool-probes.json',JSON.stringify(result,null,2));

const dir = out+'/handoff-mock';
mkdirSync(dir+'/git-cache',{recursive:true});
for (const file of ['handoff.mjs','session-core.mjs']) cpSync(repo+'/tools/'+file,dir+'/'+file);
writeFileSync(dir+'/session-io.mjs',`import {readFileSync,writeFileSync} from 'node:fs';
const file = ${JSON.stringify(dir+'/remote.json')};
export function run(cmd,args) {
 const state = JSON.parse(readFileSync(file,'utf8'));
 if(cmd === 'git' && args[0] === 'rev-parse') return ${JSON.stringify(dir+'/git-cache')};
 if(cmd === 'gh' && args[0] === 'issue' && args[1] === 'list') return JSON.stringify([state.issue]);
 if(cmd === 'gh' && args[0] === 'issue' && args[1] === 'edit') {
  const body = readFileSync(args[4],'utf8');
  state.writes.push(body);
  state.issue.body = body;
  state.issue.updatedAt = state.writes.length === 1 ? '2026-10-05T03:00:02Z' : '2026-10-05T03:00:04Z';
  if (state.interleave) {
   state.issue.body = 'Other machine B: new handoff';
   state.issue.updatedAt = '2026-10-05T03:00:03Z';
   state.interleave = false;
  }
  writeFileSync(file,JSON.stringify(state)); return '';
 }
 throw new Error('Unexpected mocked command '+cmd+' '+args.join(' '));
}`);
const issue = {number:7,title:'HANDOFF',body:'Initial A',updatedAt:'2026-10-05T03:00:01Z',url:'mock-only'};
writeFileSync(dir+'/remote.json',JSON.stringify({issue,writes:[],interleave:true}));
const draft = dir+'/draft.md';
writeFileSync(draft,'Machine A first edit');
writeFileSync(draft+'.base.json',JSON.stringify({number:7,updatedAt:issue.updatedAt}));
const {writeHandoff} = await import('./handoff-mock/handoff.mjs');
const first = writeHandoff(dir,draft);
const afterFirst = JSON.parse(readFileSync(dir+'/remote.json','utf8'));
const savedBase = JSON.parse(readFileSync(draft+'.base.json','utf8'));
writeFileSync(draft,'Machine A second edit without reading B');
const second = writeHandoff(dir,draft);
const afterSecond = JSON.parse(readFileSync(dir+'/remote.json','utf8'));
const race = {first,afterFirst,savedBase,second,afterSecond};
writeFileSync(out+'/handoff-probe.json',JSON.stringify(race,null,2));
console.log(JSON.stringify(race,null,2));
```

### prepare.mjs

Nguồn: [prepare.mjs](C:/workspace/deep-review-1-4/codex/G/prepare.mjs).

```javascript
import { mkdirSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
const repo = 'C:/workspace/Project-2C-review-2';
const out = 'C:/workspace/deep-review-1-4/codex/G';
const req = createRequire(repo + '/package.json');
for (const dest of ['tools-baseline','tools-mutant']) {
  mkdirSync(join(out,dest),{recursive:true});
  cpSync(repo+'/tools',join(out,dest),{recursive:true});
}
const file = out+'/tools-mutant/session-core.mjs';
const original = readFileSync(file,'utf8');
const bad = original.replace("c.body.startsWith('REVIEW:') && REVIEWERS.has(c.authorAssociation)","c.body.startsWith('REVIEW:')");
if (bad === original) throw new Error('mutation not applied');
writeFileSync(file,bad);
for (const dir of ['baseline','mutant']) {
  writeFileSync(out+'/vitest-'+dir+'.config.mjs', `export default ${JSON.stringify({root:out,cacheDir:out+'/cache-'+dir,resolve:{alias:{vitest:join(dirname(req.resolve('vitest/package.json')),'dist/index.js'),typescript:req.resolve('typescript')}},test:{include:['tools-'+dir+'/**/*.test.mjs'],coverage:{enabled:false}}},null,2)};\n`);
}
const manifest = { repo, out, vitest:join(dirname(req.resolve('vitest/package.json')),'vitest.mjs'), playwright:req.resolve('@playwright/test/cli') };
writeFileSync(out+'/paths.json',JSON.stringify(manifest,null,2));
console.log(manifest);
```

### vitest-baseline.config.mjs

Nguồn: [vitest-baseline.config.mjs](C:/workspace/deep-review-1-4/codex/G/vitest-baseline.config.mjs).

```javascript
export default {
  "root": "C:/workspace/deep-review-1-4/codex/G",
  "cacheDir": "C:/workspace/deep-review-1-4/codex/G/cache-baseline",
  "resolve": {
    "alias": {
      "vitest": "C:\\workspace\\Project-2C-review-2\\node_modules\\.pnpm\\vitest@5.0.1_@types+node@26_c3eb6ea1556b53f0cf41a34657fff2a8\\node_modules\\vitest\\dist\\index.js",
      "typescript": "C:\\workspace\\Project-2C-review-2\\node_modules\\.pnpm\\typescript@6.0.3\\node_modules\\typescript\\lib\\typescript.js"
    }
  },
  "test": {
    "include": [
      "tools-baseline/**/*.test.mjs"
    ],
    "coverage": {
      "enabled": false
    }
  }
};
```

### vitest-mutant.config.mjs

Nguồn: [vitest-mutant.config.mjs](C:/workspace/deep-review-1-4/codex/G/vitest-mutant.config.mjs).

```javascript
export default {
  "root": "C:/workspace/deep-review-1-4/codex/G",
  "cacheDir": "C:/workspace/deep-review-1-4/codex/G/cache-mutant",
  "resolve": {
    "alias": {
      "vitest": "C:\\workspace\\Project-2C-review-2\\node_modules\\.pnpm\\vitest@5.0.1_@types+node@26_c3eb6ea1556b53f0cf41a34657fff2a8\\node_modules\\vitest\\dist\\index.js",
      "typescript": "C:\\workspace\\Project-2C-review-2\\node_modules\\.pnpm\\typescript@6.0.3\\node_modules\\typescript\\lib\\typescript.js"
    }
  },
  "test": {
    "include": [
      "tools-mutant/**/*.test.mjs"
    ],
    "coverage": {
      "enabled": false
    }
  }
};
```

### build-temp.mjs

Nguồn: [build-temp.mjs](C:/workspace/deep-review-1-4/codex/G/build-temp.mjs).

```javascript
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname,join} from 'node:path';
import {pathToFileURL} from 'node:url';
const repo='C:/workspace/Project-2C-review-2';
const out='C:/workspace/deep-review-1-4/codex/G';
const req=createRequire(repo+'/package.json');
const appReq=createRequire(repo+'/apps/desktop/package.json');
for(const kind of ['baseline','mutant']) {
 const path=out+'/vitest-'+kind+'.config.mjs';
 const text=readFileSync(path,'utf8');
 writeFileSync(path,text.replace(JSON.stringify(req.resolve('vitest')),JSON.stringify(join(dirname(req.resolve('vitest/package.json')),'dist/index.js'))));
}
const load=async name=>import(pathToFileURL(appReq.resolve(name)).href);
const {build}=await load('vite');
const {default:react}=await load('@vitejs/plugin-react');
const {default:tailwind}=await load('@tailwindcss/vite');
for (const kind of ['clean','mutant','load']) {
 process.env.VITE_DEMO_ANCHOR=kind==='load'?'05/10/2026':'15/09/2026';
 let changed=0;
 const mutation={name:'review-excel-truncate',enforce:'pre',transform(code,id){
  if(kind!=='mutant'||!id.endsWith('/routes/reports/ReportExport.tsx'))return;
  const next=code.replace('new Blob([bytes],','new Blob([bytes.subarray(0, 1)],');
  if(next===code)throw new Error('export mutation not applied');
  changed++; return next;
 }};
 await build({configFile:false,root:repo+'/apps/desktop',cacheDir:out+'/vite-cache-'+kind,
 plugins:[mutation,react(),tailwind()],envPrefix:['VITE_','TAURI_ENV_'],clearScreen:false,
 build:{outDir:out+'/dist-'+kind,emptyOutDir:false,target:'es2023',chunkSizeWarningLimit:600,
 rolldownOptions:{output:{codeSplitting:{groups:[{name:'chart',test:/node_modules[\\/](?:\.pnpm[\\/])?(?:echarts|zrender)/}]}}}}});
 if(kind==='mutant'&&changed!==1)throw new Error('mutation count '+changed);
 console.log('BUILD '+kind+' mutation count '+changed);
}
```

### prepare-e2e.mjs

Nguồn: [prepare-e2e.mjs](C:/workspace/deep-review-1-4/codex/G/prepare-e2e.mjs).

```javascript
import {cpSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
const repo='C:/workspace/Project-2C-review-2';
const out='C:/workspace/deep-review-1-4/codex/G';
cpSync(repo+'/e2e',out+'/tests-clean',{recursive:true});
cpSync(repo+'/e2e',out+'/tests-mutant',{recursive:true});
cpSync(repo+'/e2e',out+'/tests-year',{recursive:true});
for(const kind of ['clean','mutant','year']) {
 const path=out+'/tests-'+kind+'/chart.spec.ts';
 writeFileSync(path,readFileSync(path,'utf8').replace("join(import.meta.dirname, '../apps/desktop/dist/assets')",JSON.stringify(out+'/dist-clean/assets')));
}
const yearFile=out+'/tests-year/team.spec.ts';
writeFileSync(yearFile,readFileSync(yearFile,'utf8').replace('new Date().getFullYear()','new Date(2027, 0, 1).getFullYear()'));
writeFileSync(out+'/package.json',JSON.stringify({type:'module'}));
for(const kind of ['clean','mutant','year','load']) {
 const dist=kind==='year'?'clean':kind;
 const config=`import {defineConfig,devices} from '@playwright/test';
 export default defineConfig({testDir:${JSON.stringify(out+'/tests-'+kind)},fullyParallel:true,workers:2,retries:0,forbidOnly:true,reporter:[['list'],['json',{outputFile:${JSON.stringify(out+'/e2e-'+kind+'.json')}}]],outputDir:${JSON.stringify(out+'/results-'+kind)},expect:{timeout:15000},timeout:45000,
 use:{...devices['Desktop Edge'],channel:'msedge',baseURL:'http://localhost:4175',locale:'vi-VN',trace:'retain-on-failure',screenshot:'only-on-failure'},
 ${kind==='clean'?"projects:[{name:'seed-timing',testMatch:'seed-timing.spec.ts'},{name:'edge',testIgnore:'seed-timing.spec.ts',dependencies:['seed-timing']}],":''}
 webServer:{command:'node "${out}/serve-temp.mjs" ${dist}',url:'http://localhost:4175',reuseExistingServer:false,timeout:120000}});`;
 writeFileSync(out+'/playwright-'+kind+'.config.mjs',config);
}
```

### prepare-probes.mjs

Nguồn: [prepare-probes.mjs](C:/workspace/deep-review-1-4/codex/G/prepare-probes.mjs).

```javascript
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const out='C:/workspace/deep-review-1-4/codex/G';
for (const [kind,port] of [['mutant',4176],['year',4177],['load',4178]]) {
 const path=out+'/playwright-'+kind+'.config.mjs';
 let text=readFileSync(path,'utf8').replaceAll('localhost:4175','localhost:'+port);
 text=text.replace('serve-temp.mjs" '+(kind==='year'?'clean':kind), 'serve-temp.mjs" '+(kind==='year'?'clean':kind)+' '+port);
 writeFileSync(path,text);
}
const server=out+'/serve-temp.mjs';
let text=readFileSync(server,'utf8').replace('port:4175','port:Number(process.argv[3]??4175)');
writeFileSync(server,text);
const probes=out+'/tool-probes.mjs';
writeFileSync(probes,readFileSync(probes,'utf8').replace("state.issue.updatedAt = '2026-10-05T03:00:02Z';","state.issue.updatedAt = state.writes.length === 1 ? '2026-10-05T03:00:02Z' : '2026-10-05T03:00:04Z';"));
mkdirSync(out+'/tests-load',{recursive:true});
```

### serve-temp.mjs

Nguồn: [serve-temp.mjs](C:/workspace/deep-review-1-4/codex/G/serve-temp.mjs).

```javascript
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const out='C:/workspace/deep-review-1-4/codex/G';
const app='C:/workspace/Project-2C-review-2/apps/desktop';
const req=createRequire(app+'/package.json');
const {preview}=await import(pathToFileURL(req.resolve('vite')).href);
const kind=process.argv[2];
if(!['clean','mutant','load'].includes(kind))throw new Error('invalid build');
const server=await preview({configFile:false,root:app,cacheDir:out+'/preview-cache',build:{outDir:out+'/dist-'+kind},preview:{port:Number(process.argv[3]??4175),strictPort:true}});
server.printUrls();
const stop=()=>server.close().finally(()=>process.exit(0));
process.on('SIGTERM',stop);process.on('SIGINT',stop);
```

### playwright-clean.config.mjs

Nguồn: [playwright-clean.config.mjs](C:/workspace/deep-review-1-4/codex/G/playwright-clean.config.mjs).

```javascript
import {defineConfig,devices} from '@playwright/test';
 export default defineConfig({testDir:"C:/workspace/deep-review-1-4/codex/G/tests-clean",fullyParallel:true,workers:2,retries:0,forbidOnly:true,reporter:[['list'],['json',{outputFile:"C:/workspace/deep-review-1-4/codex/G/e2e-clean.json"}]],outputDir:"C:/workspace/deep-review-1-4/codex/G/results-clean",expect:{timeout:15000},timeout:45000,
 use:{...devices['Desktop Edge'],channel:'msedge',baseURL:'http://localhost:4175',locale:'vi-VN',trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[{name:'seed-timing',testMatch:'seed-timing.spec.ts'},{name:'edge',testIgnore:'seed-timing.spec.ts',dependencies:['seed-timing']}],
 webServer:{command:'node "C:/workspace/deep-review-1-4/codex/G/serve-temp.mjs" clean',url:'http://localhost:4175',reuseExistingServer:false,timeout:120000}});
```

### playwright-mutant.config.mjs

Nguồn: [playwright-mutant.config.mjs](C:/workspace/deep-review-1-4/codex/G/playwright-mutant.config.mjs).

```javascript
import {defineConfig,devices} from '@playwright/test';
 export default defineConfig({testDir:"C:/workspace/deep-review-1-4/codex/G/tests-mutant",fullyParallel:true,workers:2,retries:0,forbidOnly:true,reporter:[['list'],['json',{outputFile:"C:/workspace/deep-review-1-4/codex/G/e2e-mutant.json"}]],outputDir:"C:/workspace/deep-review-1-4/codex/G/results-mutant",expect:{timeout:15000},timeout:45000,
 use:{...devices['Desktop Edge'],channel:'msedge',baseURL:'http://localhost:4176',locale:'vi-VN',trace:'retain-on-failure',screenshot:'only-on-failure'},
 
 webServer:{command:'node "C:/workspace/deep-review-1-4/codex/G/serve-temp.mjs" mutant 4176',url:'http://localhost:4176',reuseExistingServer:false,timeout:120000}});
```

### playwright-year.config.mjs

Nguồn: [playwright-year.config.mjs](C:/workspace/deep-review-1-4/codex/G/playwright-year.config.mjs).

```javascript
import {defineConfig,devices} from '@playwright/test';
 export default defineConfig({testDir:"C:/workspace/deep-review-1-4/codex/G/tests-year",fullyParallel:true,workers:2,retries:0,forbidOnly:true,reporter:[['list'],['json',{outputFile:"C:/workspace/deep-review-1-4/codex/G/e2e-year.json"}]],outputDir:"C:/workspace/deep-review-1-4/codex/G/results-year",expect:{timeout:15000},timeout:45000,
 use:{...devices['Desktop Edge'],channel:'msedge',baseURL:'http://localhost:4177',locale:'vi-VN',trace:'retain-on-failure',screenshot:'only-on-failure'},
 
 webServer:{command:'node "C:/workspace/deep-review-1-4/codex/G/serve-temp.mjs" clean 4177',url:'http://localhost:4177',reuseExistingServer:false,timeout:120000}});
```

### playwright-load.config.mjs

Nguồn: [playwright-load.config.mjs](C:/workspace/deep-review-1-4/codex/G/playwright-load.config.mjs).

```javascript
import {defineConfig,devices} from '@playwright/test';
 export default defineConfig({testDir:"C:/workspace/deep-review-1-4/codex/G/tests-load",fullyParallel:true,workers:2,retries:0,forbidOnly:true,reporter:[['list'],['json',{outputFile:"C:/workspace/deep-review-1-4/codex/G/e2e-load.json"}]],outputDir:"C:/workspace/deep-review-1-4/codex/G/results-load",expect:{timeout:15000},timeout:45000,
 use:{...devices['Desktop Edge'],channel:'msedge',baseURL:'http://localhost:4178',locale:'vi-VN',trace:'retain-on-failure',screenshot:'only-on-failure'},
 
 webServer:{command:'node "C:/workspace/deep-review-1-4/codex/G/serve-temp.mjs" load 4178',url:'http://localhost:4178',reuseExistingServer:false,timeout:120000}});
```

### playwright-seed.config.mjs

Nguồn: [playwright-seed.config.mjs](C:/workspace/deep-review-1-4/codex/G/playwright-seed.config.mjs).

```javascript
import {defineConfig,devices} from '@playwright/test';
 export default defineConfig({testDir:"C:/workspace/deep-review-1-4/codex/G/tests-clean",fullyParallel:true,workers:2,retries:0,forbidOnly:true,reporter:[['list'],['json',{outputFile:"C:/workspace/deep-review-1-4/codex/G/e2e-seed-isolated.json"}]],outputDir:"C:/workspace/deep-review-1-4/codex/G/results-seed-isolated",expect:{timeout:15000},timeout:45000,
 use:{...devices['Desktop Edge'],channel:'msedge',baseURL:'http://localhost:4175',locale:'vi-VN',trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[{name:'seed-timing',testMatch:'seed-timing.spec.ts'},{name:'edge',testIgnore:'seed-timing.spec.ts',dependencies:['seed-timing']}],
 webServer:{command:'node "C:/workspace/deep-review-1-4/codex/G/serve-temp.mjs" clean',url:'http://localhost:4175',reuseExistingServer:false,timeout:120000}});
```

### tests-mutant/evidence.spec.ts

Nguồn: [tests-mutant/evidence.spec.ts](C:/workspace/deep-review-1-4/codex/G/tests-mutant/evidence.spec.ts).

```typescript
import {test,expect} from '@playwright/test';
import {readFileSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module'; const ExcelJS=createRequire('C:/workspace/Project-2C-review-2/apps/desktop/package.json')('exceljs');
const out='C:/workspace/deep-review-1-4/codex/G';
test('evidence: corrupted download has one byte and cannot open as workbook',async({page})=>{
 await page.goto('/#/reports');
 const pending=page.waitForEvent('download');
 await page.getByRole('button',{name:'Xuất Excel'}).click();
 const file=await pending;
 await file.saveAs(out+'/corrupted-download.xlsx');
 const bytes=readFileSync(out+'/corrupted-download.xlsx');
 const workbook=new ExcelJS.Workbook();
 let error='';
 try {await workbook.xlsx.load(bytes);}catch(e){error=String(e);}
 expect(bytes.length).toBe(1);
 expect(error).not.toBe('');
 writeFileSync(out+'/excel-mutation-evidence.json',JSON.stringify({name:file.suggestedFilename(),bytes:bytes.length,error},null,2));
});
```

### tests-load/load-ui.spec.ts

Nguồn: [tests-load/load-ui.spec.ts](C:/workspace/deep-review-1-4/codex/G/tests-load/load-ui.spec.ts).

```typescript
import {test,expect} from '@playwright/test';
import {writeFileSync} from 'node:fs';
const out='C:/workspace/deep-review-1-4/codex/G';
test('load dataset reaches reports and downloads Excel',async({page})=>{
 test.setTimeout(120000);
 await page.goto('/#/settings');
 await expect(page.getByRole('region',{name:'Xuất / nhập backup'})).toBeVisible();
 const start=performance.now();
 await page.getByLabel('Nhập backup',{exact:true}).setInputFiles('C:/workspace/deep-review-1-4/common/load/load-backup.json');
 const confirm=page.getByRole('dialog',{name:'Thay toàn bộ dữ liệu?'});
 await expect(confirm).toBeVisible();
 const validated=performance.now();
 await confirm.getByRole('button',{name:'Thay dữ liệu',exact:true}).click();
 await expect(confirm).toBeHidden();
 const imported=performance.now();
 await page.getByRole('navigation').getByRole('link',{name:'Báo cáo'}).click();
 await expect(page.getByRole('table',{name:'Tổng hợp'})).toBeVisible();
 const rendered=performance.now();
 const pending=page.waitForEvent('download');
 await page.getByRole('button',{name:'Xuất Excel'}).click();
 const file=await pending;
 await file.saveAs(out+'/load-report.xlsx');
 const exported=performance.now();
 writeFileSync(out+'/load-ui.json',JSON.stringify({validateMs:validated-start,replaceMs:imported-validated,reportMs:rendered-imported,excelDownloadMs:exported-rendered,filename:file.suggestedFilename()},null,2));
});
```

### load-perf.test.ts

Nguồn: [load-perf.test.ts](C:/workspace/deep-review-1-4/codex/G/load-perf.test.ts).

```typescript
import {readFileSync,writeFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
import {test,expect} from 'vitest';
import {importBackup,exportBackup} from '@p2c/db';
const out='C:/workspace/deep-review-1-4/codex/G';
const path='C:/workspace/deep-review-1-4/common/load/load-backup.json';
test('load backup imported and exported without row loss, timed',async()=>{
 const text=readFileSync(path,'utf8');
 const original=JSON.parse(text);
 const counts=Object.fromEntries(Object.entries(original.tables).map(([k,v])=>[k,v.length]));
 const samples=[];
 for(let i=0;i<3;i++) {
  const start=performance.now();
  const {db}=await importBackup(text,{now:()=>new Date('2026-10-05T05:00:00Z')});
  const imported=performance.now();
  const exported=exportBackup(db);
  const done=performance.now();
  expect(JSON.parse(exported).tables).toEqual(original.tables);
  samples.push({importMs:imported-start,exportMs:done-imported,outputBytes:Buffer.byteLength(exported)});
  db.sqlite.close();
 }
 const result={counts,inputBytes:Buffer.byteLength(text),samples};
 writeFileSync(out+'/load-perf.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify(result));
},60000);
```

### vitest-perf.config.mjs

Nguồn: [vitest-perf.config.mjs](C:/workspace/deep-review-1-4/codex/G/vitest-perf.config.mjs).

```javascript
export default {root:'C:/workspace/deep-review-1-4/codex/G',cacheDir:'C:/workspace/deep-review-1-4/codex/G/perf-cache',resolve:{alias:{'@p2c/db':'C:/workspace/Project-2C-review-2/packages/db/src/index.ts','@p2c/domain':'C:/workspace/Project-2C-review-2/packages/domain/src/index.ts'}},test:{include:['load-perf.test.ts'],coverage:{enabled:false}}};
```

## Phụ lục C — Bằng chứng và giới hạn cuối phiên

- Merge/cleanup: [tool-probes.json](C:/workspace/deep-review-1-4/codex/G/tool-probes.json), [tool-probes.log](C:/workspace/deep-review-1-4/codex/G/tool-probes.log).
- HANDOFF: [handoff-probe.json](C:/workspace/deep-review-1-4/codex/G/handoff-probe.json); I/O mock đầy đủ được sinh bởi source `tool-probes.mjs` ở trên.
- Unit tools: [tools-baseline.log](C:/workspace/deep-review-1-4/codex/G/tools-baseline.log), [tools-mutant.log](C:/workspace/deep-review-1-4/codex/G/tools-mutant.log).
- E2e clean: [e2e-clean.log](C:/workspace/deep-review-1-4/codex/G/e2e-clean.log) (seed đỏ lần đầu), [e2e-edge.log](C:/workspace/deep-review-1-4/codex/G/e2e-edge.log), [e2e-edge.json](C:/workspace/deep-review-1-4/codex/G/e2e-edge.json), [e2e-seed-isolated.json](C:/workspace/deep-review-1-4/codex/G/e2e-seed-isolated.json).
- Mutation Excel: [e2e-mutant.log](C:/workspace/deep-review-1-4/codex/G/e2e-mutant.log), [excel-mutation-evidence.json](C:/workspace/deep-review-1-4/codex/G/excel-mutation-evidence.json), [file 1 byte](C:/workspace/deep-review-1-4/codex/G/corrupted-download.xlsx).
- Năm: [e2e-year.log](C:/workspace/deep-review-1-4/codex/G/e2e-year.log), [e2e-year.json](C:/workspace/deep-review-1-4/codex/G/e2e-year.json), screenshot/trace/error-context dưới `G/results-year/`.
- Tải: [load-perf.json](C:/workspace/deep-review-1-4/codex/G/load-perf.json), [load-perf.log](C:/workspace/deep-review-1-4/codex/G/load-perf.log), [load-ui.json](C:/workspace/deep-review-1-4/codex/G/load-ui.json), [e2e-load.log](C:/workspace/deep-review-1-4/codex/G/e2e-load.log), [Excel tải](C:/workspace/deep-review-1-4/codex/G/load-report.xlsx).

HEAD cuối kiểm vẫn `f0c53eb57eb7eac8665ad87287e794ae4c5bc43b`; `git diff --exit-code` = 0. Trạng thái untracked `.agents/`, `.codex/`, `AGENTS.md` có sẵn trước review, không phải file tạo trong phiên. Không chạy lại toàn bộ `pnpm verify` / Rust trong G; kết quả baseline chỉ tham chiếu từ common. Không tuyên bố đã kiểm lỗi desktop native qua e2e web.
