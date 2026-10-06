# Deep review Phase 1–4 — Gói B (Codex)

Ngày: 05/10/2026. Phạm vi chính: `packages/db`. SHA ghim: **f0c53eb57eb7eac8665ad87287e794ae4c5bc43b**; worktree detached tại `C:/workspace/Project-2C-review-2`.

Có **8 phát hiện mới CONFIRMED**: 4 Medium, 4 Low; không có Critical, High hoặc PLAUSIBLE. Có thêm 1 mục KNOWN với bằng chứng phá test mới, đếm riêng. Các lỗi chủ yếu xuất hiện khi nhập backup lệch luật lệnh nghiệp vụ; hai lỗi seed cần ngày/múi giờ biên. Không có kết luận đóng Phase 4 trong gói B; kết luận đó thuộc gói H.

## Phạm vi và tính độc lập

Đọc tài liệu bắt buộc trước khi xét DB: `docs/process/deep-review-phase-1-4.md` (§1, §4–7), `CLAUDE.md`, `CONTEXT.md`, `docs/design/phase-3-du-lieu.md`, `docs/design/phase-4-chi-so.md`, bốn file `docs/golden/{lich-hen,kyc,kh-theo-nhom,chi-so}.md`. Golden được dùng làm chuẩn; không sửa hay đề xuất đổi fixture.

Đọc toàn bộ source, test, SQL migration và cấu hình DB dưới đây. Snapshot Drizzle và journal được đọc/parse cấu trúc để đối chiếu bảng, cột, khóa, chỉ mục và chuỗi migration; không coi mỗi dòng JSON sinh tự động là một dòng logic đã review thủ công.

| File (từ gốc repo) | Dòng | Cách đọc |
|---|---:|---|
| `packages/db/CLAUDE.md` | 49 | Đọc toàn file |
| `packages/db/drizzle.config.ts` | 7 | Đọc toàn file |
| `packages/db/migrations/0000_init.sql` | 33 | Đọc toàn file |
| `packages/db/migrations/0001_customers_policies.sql` | 86 | Đọc toàn file |
| `packages/db/migrations/0002_kyc.sql` | 44 | Đọc toàn file |
| `packages/db/migrations/0003_kyc_append_only.sql` | 22 | Đọc toàn file |
| `packages/db/migrations/0004_appointment_outcome_reviewer.sql` | 6 | Đọc toàn file |
| `packages/db/migrations/meta/0000_snapshot.json` | 203 | Parse/đối chiếu cấu trúc |
| `packages/db/migrations/meta/0001_snapshot.json` | 742 | Parse/đối chiếu cấu trúc |
| `packages/db/migrations/meta/0002_snapshot.json` | 1016 | Parse/đối chiếu cấu trúc |
| `packages/db/migrations/meta/0003_snapshot.json` | 1016 | Parse/đối chiếu cấu trúc |
| `packages/db/migrations/meta/0004_snapshot.json` | 1036 | Parse/đối chiếu cấu trúc |
| `packages/db/migrations/meta/_journal.json` | 41 | Parse/đối chiếu cấu trúc |
| `packages/db/package.json` | 23 | Đọc toàn file |
| `packages/db/src/appointments.test.ts` | 929 | Đọc toàn file |
| `packages/db/src/appointments.ts` | 510 | Đọc toàn file |
| `packages/db/src/backup-engine.test.ts` | 22 | Đọc toàn file |
| `packages/db/src/backup-invariants.test.ts` | 606 | Đọc toàn file |
| `packages/db/src/backup-validation.ts` | 302 | Đọc toàn file |
| `packages/db/src/backup.test.ts` | 435 | Đọc toàn file |
| `packages/db/src/backup.ts` | 201 | Đọc toàn file |
| `packages/db/src/common.test.ts` | 15 | Đọc toàn file |
| `packages/db/src/common.ts` | 119 | Đọc toàn file |
| `packages/db/src/customers.test.ts` | 334 | Đọc toàn file |
| `packages/db/src/customers.ts` | 339 | Đọc toàn file |
| `packages/db/src/database.test.ts` | 459 | Đọc toàn file |
| `packages/db/src/database.ts` | 188 | Đọc toàn file |
| `packages/db/src/errors.ts` | 78 | Đọc toàn file |
| `packages/db/src/golden-kyc.test.ts` | 71 | Đọc toàn file |
| `packages/db/src/golden-metrics.test.ts` | 175 | Đọc toàn file |
| `packages/db/src/ids.test.ts` | 33 | Đọc toàn file |
| `packages/db/src/ids.ts` | 34 | Đọc toàn file |
| `packages/db/src/index.ts` | 90 | Đọc toàn file |
| `packages/db/src/kyc.test.ts` | 566 | Đọc toàn file |
| `packages/db/src/kyc.ts` | 534 | Đọc toàn file |
| `packages/db/src/metrics.ts` | 16 | Đọc toàn file |
| `packages/db/src/migrations.ts` | 31 | Đọc toàn file |
| `packages/db/src/policies.test.ts` | 155 | Đọc toàn file |
| `packages/db/src/policies.ts` | 148 | Đọc toàn file |
| `packages/db/src/schema.ts` | 284 | Đọc toàn file |
| `packages/db/src/seed-data.ts` | 306 | Đọc toàn file |
| `packages/db/src/seed-invariants.test.ts` | 193 | Đọc toàn file |
| `packages/db/src/seed.test.ts` | 173 | Đọc toàn file |
| `packages/db/src/seed.ts` | 475 | Đọc toàn file |
| `packages/db/src/sql-raw.d.ts` | 5 | Đọc toàn file |
| `packages/db/src/team.test.ts` | 320 | Đọc toàn file |
| `packages/db/src/team.ts` | 301 | Đọc toàn file |
| `packages/db/src/test-support.ts` | 32 | Đọc toàn file |
| `packages/db/tsconfig.json` | 8 | Đọc toàn file |

Tổng dòng theo git: source/support 3993; test 4486; SQL migration 191; metadata sinh tự động 4054; cấu hình/hướng dẫn 87.

Đọc thêm các điểm gọi cần đối chiếu: i18n DB errors của desktop, bộ chuyển dữ liệu DB → domain, các consumer của export DB trong `apps/desktop/src` và `packages`, riêng `appointments-view.ts` cho liên kết dời lịch. Các điểm này chỉ dùng giải thích ảnh hưởng của B, không thay cho review UI/Rust các gói sau.

Nguồn chung đã đọc: `common/README.md`, `common/baseline.md`, `common/known.md`, dữ liệu và cấu hình/script sinh trong `common/load`. Không đọc, mở, liệt kê hay tìm kiếm thư mục/báo cáo của bên review còn lại. Không tổng hợp với báo cáo khác.

Mọi probe, patch, cache và log nằm ở `C:/workspace/deep-review-1-4/codex/B/`. Repo chỉ đọc; không commit, không sửa golden, không tạo Issue. Các junction `B/node_modules`, `B/domain` và `B/mutant-db/node_modules` chỉ phục vụ phân giải dependency/import của bản sao tạm; không ghi qua junction.

## Cách kiểm và kết quả chạy

- Bộ test DB gốc: **15 file / 316 test PASS**; log `B/original-tests.log`.
- Probe đúng-sai, biên, an toàn và số đo: **3 file / 11 test PASS**; log `B/probe-tests-final.log`. Test phá thứ tự còn được chạy lại riêng với patch một vị trí cuối cùng.
- `tsc --noEmit --noUnusedLocals --noUnusedParameters --incremental false` trên package DB gốc: exit 0. Trên bản sao mutant cuối cùng cũng exit 0.
- Patch cuối cùng chỉ đổi chọn tên cột khóa trong `backup.ts:50` sang `rowid`; kết quả bộ 316 test và probe phân biệt ghi ở `B/mutant-tests-validated.log`, `B/ordering-validated.log`.
- Nguồn và lệnh tái chạy đầy đủ ở phụ lục. Không chạy lại cả baseline verify/e2e/Rust của các gói khác; baseline chung giữ nguyên, không chép số đo nền vào báo cáo này.
- Trong lúc dựng harness có lần gọi cổng KYC nhầm với cả profile thay vì `profile.facts`, lần thiếu import/dependency ở bản sao, và lần patch thay cả hai chuỗi giống nhau. Đã sửa harness rồi chạy lại. Log thất bại ban đầu được giữ để truy vết; không dùng chúng làm bằng chứng lỗi sản phẩm.

## Phát hiện mới

### CX-B1 — Backup nhận hồ sơ có năm sinh nhưng không có dữ kiện KYC tương ứng

**ID:** CX-B1  
**Mức:** Medium  
**Trục:** D  
**Vị trí:** `packages/db/src/backup-validation.ts:214`, `packages/db/src/kyc.ts:277`, `packages/db/src/customers.ts:138` (SHA f0c53eb).  
**Tình trạng:** CONFIRMED.

**Mô tả:** `kycRule` kiểm fact đã tồn tại nhưng không kiểm chiều ngược từ hồ sơ KH sang fact. Nhập backup giữ `birth_date=1984` mà bỏ mọi fact `birthYear` vẫn thành công, trái D2 “hồ sơ KH là gốc” và yêu cầu cổng KYC đọc được năm sinh.

**Tái hiện / bằng chứng:** Chạy test `backup with profile birth year but no birthYear fact...` trong `correctness.probe.test.ts`. Tạo KH năm sinh 1984, có gia đình và nghề nghiệp; xuất backup; xóa fact `birthYear` và toàn bộ `kyc_versions` để tránh lẫn với KNOWN hash sai. Nhập lại thành công. Lưu hồ sơ với cùng năm sinh 1984 vẫn không sinh lại fact. Cổng KYC trả `KYC_INSUFFICIENT`, chỉ có FAMILY và OCCUPATION_INCOME, thiếu IDENTITY. Chuẩn golden `docs/golden/kyc.md:15` xác định có năm sinh là đủ IDENTITY; với ba hạng mục này phải đạt PROFILE_DISCOVERY.

**Ảnh hưởng:** Hồ sơ nhìn có năm sinh nhưng đánh giá KYC thiếu thông tin, làm sai trạng thái/gợi ý chăm sóc. Lưu lại hồ sơ không đổi giá trị không xử lý được sự lệch này. Đã tái hiện với năm sinh; giới tính có cùng thiếu sót chiều kiểm nhưng không có probe riêng.

**Đề xuất:** Khi nhập, kiểm tồn tại fact SYSTEM đang có hiệu lực/đang mâu thuẫn khớp mỗi trường hồ sơ khác null, phù hợp D2 và luật conflict. Từ chối backup sai; không migration hay UI sửa dữ liệu giả lập. Ước lượng dưới 100 dòng SP, thêm test dữ kiện thiếu.

### CX-B2 — Backup nhận người đã xóa làm người phối hợp/đánh giá cuộc hẹn sống

**ID:** CX-B2  
**Mức:** Medium  
**Trục:** D  
**Vị trí:** `packages/db/src/backup-validation.ts:184`, `packages/db/src/backup-validation.ts:196` (SHA f0c53eb).  
**Tình trạng:** CONFIRMED.

**Mô tả:** Luật chủ sở hữu kiểm RE còn sống, người phối hợp khác RE và vai trò người đánh giá, nhưng bỏ trạng thái xóa của người phối hợp/người đánh giá. Trong khi lệnh nghiệp vụ chỉ nhận nhân sự chưa xóa và chặn xóa người đang được tham chiếu.

**Tái hiện / bằng chứng:** Test `backup accepts a deleted reviewer/coordinator on a live meeting...`. Tạo cuộc hẹn MET còn sống, TL Hà vừa phối hợp vừa đánh giá. Trong backup đặt `people.deleted_at` của Hà rồi nhập: thành công. Ghi lại kết quả giữ nguyên người đánh giá Hà: `PERSON_NOT_FOUND`. Xem `correctness-results.json`; lệnh gốc kiểm người sống ở `appointments.ts:379` và xóa nhân sự kiểm sử dụng ở `team.ts:164`.

**Ảnh hưởng:** Dữ liệu nhập vào có quan hệ nhân sự mà lệnh không cho tạo; danh sách nhân sự sống loại người đó, sửa kết quả với cùng lựa chọn bị từ chối. Không báo nhầm trường hợp cuộc hẹn đã xóa: trường hợp đó được phép giữ nhân sự đã rời đi.

**Đề xuất:** Bổ sung kiểm `deleted_at IS NULL` cho người phối hợp/người đánh giá của cuộc hẹn chưa xóa; giữ đúng ngoại lệ dữ liệu đã xóa. Ước lượng dưới 80 dòng SP.

### CX-B3 — Các trường văn bản bắt buộc có thể rỗng sau nhập backup

**ID:** CX-B3  
**Mức:** Medium  
**Trục:** C  
**Vị trí:** `packages/db/src/backup-validation.ts:44`, `packages/db/src/appointments.ts:274` (SHA f0c53eb).  
**Tình trạng:** CONFIRMED.

**Mô tả:** Kiểm giá trị backup bỏ qua điều kiện văn bản bắt buộc sau trim. NOT NULL chỉ loại null, không loại chuỗi rỗng/trắng. Do đó tên team, người, KH, nội dung ghi chú KYC và `next_step` của MET có thể vi phạm hợp đồng lệnh nhập liệu.

**Tái hiện / bằng chứng:** Test `backup accepts required texts empty or whitespace...`: sửa tên team thành `""`, tên người thành ba dấu cách, tên KH và một ghi chú KYC thành `""`, bước tiếp theo MET thành ba dấu cách. `importBackup` nhận tất cả; `listCustomers` trả tên rỗng. Ghi lại MET với cùng bước tiếp theo → `OUTCOME_REQUIRED`; tạo KH tên rỗng → `NAME_REQUIRED`.

**Ảnh hưởng:** Màn danh sách và KYC nhận dữ liệu thiếu nhãn/nội dung mà form bình thường không thể lưu. Cuộc hẹn MET có kết quả thiếu hành động bắt buộc; sửa/lưu lại bị từ chối. Chỉ báo các trường đã tái hiện, không giả định mọi cột text đều bắt buộc.

**Đề xuất:** Kiểm theo bảng+cột các text bắt buộc có `trim().length > 0`; dùng cùng quy tắc lệnh, không ép mọi text tùy chọn thành bắt buộc. Từ chối backup lệch luật. Ước lượng dưới 80 dòng SP.

### CX-B4 — Backup nhận chuỗi dời lịch tự trỏ và phân nhánh

**ID:** CX-B4  
**Mức:** Medium  
**Trục:** D  
**Vị trí:** `packages/db/src/backup-validation.ts:200` (SHA f0c53eb); điểm dùng `apps/desktop/src/routes/appointments/appointments-view.ts:184`, `:261`.  
**Tình trạng:** CONFIRMED (nhập DB); ảnh hưởng hiển thị đối chiếu từ code, chưa chạy browser.

**Mô tả:** Rule 5 chỉ kiểm lịch cha cùng KH và status RESCHEDULED, không kiểm chuỗi không có vòng và mỗi lịch bị dời chỉ có một lịch tiếp nối. Lệnh D3 tạo lịch mới trỏ lịch cũ; test bất biến seed `seed-invariants.test.ts:104` cũng yêu cầu đúng một successor.

**Tái hiện / bằng chứng:** Test `backup accepts rescheduling branches and cycles...` trong `edges.probe.test.ts`. (1) Một lịch RESCHEDULED tự có `rescheduled_from_id=id`: nhập thành công. (2) Một cha RESCHEDULED và hai con SCHEDULED cùng trỏ cha: nhập thành công. Cả hai kết quả ở `edge-results.json`.

**Ảnh hưởng:** Lịch sử dời lịch không còn là chuỗi thao tác mà lệnh tạo ra. Với phân nhánh, `newDay` dựng Map giữ con cuối nhưng `rescheduleLinks` dùng find lấy con đầu, nên ngày chuyển tới và liên kết đọc từ cùng bộ dữ liệu có thể chọn hai con khác nhau. Với tự trỏ, liên kết quay lại chính cuộc hẹn.

**Đề xuất:** Kiểm self-reference/vòng và cardinality successor của chuỗi, tính cả bản ghi xóa mềm vì lịch sử phải giữ. Thêm test chuỗi hợp lệ có con đã xóa; không chặn nhầm trường hợp đó. Ước lượng dưới 120 dòng SP.

### CX-B5 — seq hợp lệ ở MAX_SAFE_INTEGER làm lệnh tiếp theo ghi số không an toàn

**ID:** CX-B5  
**Mức:** Low  
**Trục:** E  
**Vị trí:** `packages/db/src/customers.ts:226`, `packages/db/src/backup-validation.ts:49` (SHA f0c53eb).  
**Tình trạng:** CONFIRMED.

**Mô tả:** Backup cho phép `seq=Number.MAX_SAFE_INTEGER`; lệnh thêm transition cộng 1 không kiểm số an toàn. DB sau thao tác chứa số mà chính importer không nhận.

**Tái hiện / bằng chứng:** Test `accepted maximum seq lets commands store an unsafe integer...`: đổi seq transition đầu KH thành 9007199254740991, nhập thành công. Đổi nhóm N3 → N2 tạo seq **9007199254740992**. Xuất rồi nhập lại → `BACKUP_INVALID`. Đổi tiếp N2 → N1 → `UNIQUE constraint failed: stage_transitions.customer_id, stage_transitions.seq` do phép cộng không còn tăng đúng.

**Ảnh hưởng:** KH trong backup được dựng với seq cực lớn có thể bị kẹt chuyển nhóm và tạo backup không nhập lại được. Không phải tình huống tích lũy thao tác thực tế của người dùng nên xếp Low. Các seq KYC cũng có phép tăng cùng kiểu nhưng probe này chỉ xác nhận transition.

**Đề xuất:** Kiểm an toàn trước khi tăng/ghi seq, và thống nhất điều kiện importer với lệnh. Từ chối dữ liệu không thể tăng hợp lệ, không sửa âm thầm seq cũ. Ước lượng dưới 80 dòng SP.

### CX-B6 — Khôi phục có thể làm sống kết quả/HĐ mang ngày tương lai

**ID:** CX-B6  
**Mức:** Low  
**Trục:** D  
**Vị trí:** `packages/db/src/appointments.ts:254`, `packages/db/src/policies.ts:96` (SHA f0c53eb).  
**Tình trạng:** CONFIRMED.

**Mô tả:** Importer rule 10 cho phép bản ghi đã xóa có ngày tương lai, đúng ngoại lệ của spec. Restore kiểm KH/nhân sự nhưng không kiểm lại giới hạn ngày của kết quả cuộc hẹn và HĐ; thao tác biến dữ liệu đó thành bản ghi sống trái luật.

**Tái hiện / bằng chứng:** Test `restoration admits future held/missed appointments and policies...`, clock 05/10/2026. Backup có cuộc hẹn đã xóa ngày 06/10 (lần lượt MET không đổi nhóm và NO_SHOW), HĐ đã xóa nộp 06/10/phát hành 07/10. Nhập thành công, `restoreAppointment` và `restorePolicy` đều thành công. Xuất DB mới rồi nhập lại → `BACKUP_INVALID:{"rule":10}` cho cả hai vòng. MET không đổi nhóm được dùng để không lẫn luật ngày transition.

**Ảnh hưởng:** Lệnh restore tạo dữ liệu sống không xuất–nhập lại được và có thể đưa sự kiện tương lai vào chỉ số. UI Thùng rác đang để Phase 6; hiện là lỗi API DB nên xếp Low, không nói người dùng Phase 4 đã có nút thực hiện.

**Đề xuất:** Trong transaction restore, chạy lại `requireOutcomeDay` cho lịch và kiểm ngày HĐ bằng luật `toPastIsoDate` trước khi bỏ `deleted_at`. Ước lượng dưới 40 dòng SP.

### CX-B7 — Seed cùng ngày/seed khác dữ liệu KYC giữa UTC+7 và UTC+13

**ID:** CX-B7  
**Mức:** Low  
**Trục:** C  
**Vị trí:** `packages/db/src/seed.ts:116`, `packages/db/src/customers.ts:138` (SHA f0c53eb).  
**Tình trạng:** CONFIRMED.

**Mô tả:** Seed dùng trưa UTC để ngày local giống ngày mô phỏng trong vùng UTC±11. Cam kết đầu file và spec §7 là cùng anchor/seed cho dữ liệu giống hệt trên máy khác; ở UTC+13, ngày SYSTEM KYC của lần cập nhật hồ sơ bị cộng một ngày.

**Tái hiện / bằng chứng:** Test `seed differs across Asia/Ho_Chi_Minh and Pacific/Auckland...`: chạy seed thật với anchor 05/10/2026, seed 1, chỉ đổi `process.env.TZ`, phục hồi TZ sau test. Có **140 ghi chú SYSTEM và 140 phiên bản KYC khác nhau**; ID và timestamp mẫu giống nhau nhưng created_date/confirmedDate đổi 06/10/2025 → 07/10/2025. Hai SHA-256 của JSON là:
- Asia/Ho_Chi_Minh: `ae1473cf9e7930be7f3c172a9bda0e9823ed84e2e1d6cbf6100405de63f8cc16`
- Pacific/Auckland: `2f33698c9c437bc37efad95f64ef72a0561111fb448f7b13751698d40657c36d`

**Ảnh hưởng:** Cùng seed không còn cùng dữ liệu/ngày KYC khi máy ở vùng UTC+12 trở lên. Hai máy Owner hiện cùng UTC+7 không gặp; đây là giới hạn tái lập seed, không có bằng chứng mất dữ liệu nghiệp vụ thường.

**Đề xuất:** Truyền ngày mô phỏng tường minh vào nhánh ghi KYC từ hồ sơ trong seed, hoặc tách cổng ngày mô phỏng khỏi ngày local suy ra từ timestamp UTC; giữ timestamp/ID có tính tái lập. Không chỉ đổi timestamp sang giờ local vì sẽ làm bytes khác giữa máy. Ước lượng dưới 100 dòng SP.

### CX-B8 — Seed không chạy được ở biên ngày hợp lệ 1900–2100

**ID:** CX-B8  
**Mức:** Low  
**Trục:** E  
**Vị trí:** `packages/db/src/seed.ts:111`, `:125`, `:131`, `:423` (SHA f0c53eb).  
**Tình trạng:** CONFIRMED.

**Mô tả:** Anchor là CalendarDate hợp lệ nhưng seed kéo lịch sử 365 ngày và lịch tương lai 24 ngày ra ngoài miền năm của domain, rồi gọi `calendarDate` qua `toDate`.

**Tái hiện / bằng chứng:** Test `seed at the two supported day boundaries throws and rolls back`: anchor 01/01/1900 → `RangeError: Not a calendar date: 1899-1-1`; anchor 31/12/2100 → `RangeError: Not a calendar date: 2101-1-2`. Cả hai lần `listTeams` vẫn rỗng sau rollback.

**Ảnh hưởng:** Không nạp được demo khi ngày máy/anchor ở sát biên miền hỗ trợ. Không tác động ngày hiện tại 2026; transaction đã bảo vệ, không ghi dở dữ liệu. Xếp Low vì đầu vào biên hiếm.

**Đề xuất:** Giới hạn khoảng mô phỏng trong miền ngày domain, tính lại các cửa sổ RNG/history để vẫn hợp lệ khi khoảng bị rút ngắn. Hoặc từ chối anchor ngoài khoảng seed hỗ trợ bằng lỗi rõ ở đầu API nếu đó là hợp đồng đã chọn. Ước lượng dưới 100 dòng SP.

## KNOWN — bằng chứng mới, không đếm là phát hiện mới

### CX-B9 — Bộ test không bắt được export đổi thứ tự PK thành rowid

**ID:** CX-B9  
**Mức:** Low  
**Trục:** T  
**Vị trí:** `packages/db/src/backup.ts:50`, `packages/db/src/backup.test.ts:101`, `:133`, `:244` (SHA f0c53eb).  
**Tình trạng:** **KNOWN (#184)**; bằng chứng bổ sung **CONFIRMED**.

**Mô tả:** `common/known.md` đã ghi vấn đề test ORDER BY/PK. Hiện đã có test mọi bảng có PK, nhưng dữ liệu fixture chèn theo ULID tăng nên chưa phân biệt thứ tự PK và rowid. Export hiện tại đúng; đây là phát hiện về sức bắt lỗi của test.

**Tái hiện / bằng chứng:** Sao chép riêng DB ra `B/mutant-db`; chỉ tại chọn khóa export đổi:
```diff
-      .map((c) => quote(c.name))
+      .map(() => quote('rowid'))
```
Bản sao vẫn typecheck (exit 0) và chạy bộ DB gốc xanh: 15 file / 316 test PASS, 93,94 giây. Probe phân biệt chạy lại riêng: 1 test PASS, 1,05 giây. Probe `ordering.probe.test.ts` chèn team theo thứ tự id `z`, `a`: bản gốc xuất `["a","z"]`, mutant xuất `["z","a"]`. Đây là phân biệt độc lập, không assert theo cùng công thức của exporter. Kết quả cuối cùng ở `mutation-discriminator.json` và hai log validated.

**Ảnh hưởng:** Regression trong thứ tự xuất không bị suite hiện tại phát hiện, dù hợp đồng backup yêu cầu sắp theo PK và bytes ổn định. Không nói exporter gốc đang lỗi; không yêu cầu đổi golden.

**Đề xuất:** Fixture chèn id trái thứ tự; kiểm riêng bảng PK ghép `appointment_coordinators` với thứ tự chèn khác thứ tự khóa. Test kỳ vọng thứ tự cụ thể và so bytes; không cần sửa SP, dưới 100 dòng test.

Các KNOWN khác đã đối chiếu nhưng không báo lại vì không có bằng chứng mới: hash KYC version sai khi nhập (S-1/D-1), `valueOf` chỉ integer/text, hai khối close try/catch, chuỗi SYSTEM là dữ liệu DB được chấp nhận. Không đọc các báo cáo review của đợt này để đối chiếu.

## Hiệu năng trên dữ liệu tải chung

Môi trường: Windows x64, Node **v24.20.0**, sql.js trong repo, Vitest không coverage, chạy tuần tự. Clock ghim 05/10/2026 08:00 UTC. Input đọc từ `common/load/load-backup.json`: **1.496 KH, 10.434 lịch hẹn, 51 nhân sự/4 team, 1.804 HĐ, 4.978 transition**. JSON xuất **15.784.463 bytes**, SQLite binary **13.074.432 bytes**.

Đo 4 lần trong cùng process, mỗi lần import DB mới rồi gọi repository; tách lần đầu khỏi median của ba lần sau. Import bao gồm parse, staging, kiểm giá trị/bất biến và mở lại DB; không tính đọc file từ đĩa. Binary export chỉ đo `db.export()`, không phải persist Tauri hay ghi file. `loadMetricsData` chỉ là tải dữ liệu đầu vào chỉ số, không đo toàn bộ tính/render báo cáo.

| Thao tác | Lần đầu (ms) | Median 3 lần sau (ms) | Min–max 3 lần sau (ms) |
|---|---:|---:|---:|
| Nhập backup | 1333.86 | 1220.96 | 1206.15–1264.87 |
| listCustomers (toàn bộ) | 8.45 | 8.48 | 8.04–8.72 |
| listAppointments (toàn bộ) | 104.03 | 93.73 | 90.20–94.29 |
| listPolicies | 13.22 | 11.14 | 10.40–11.63 |
| listStageTransitions | 23.48 | 22.31 | 21.32–22.41 |
| loadMetricsData | 137.02 | 127.20 | 122.11–127.22 |
| Xuất JSON | 252.42 | 230.98 | 224.29–231.38 |
| Xuất binary | 2.64 | 2.73 | 2.58–2.84 |
| listAppointments (một KH) | 2.98 | 2.67 | 2.54–2.68 |

Nguồn raw bốn mẫu: `B/performance-results.json`; test đo nằm trong phụ lục. Đọc query thấy `listAppointments` dùng truy vấn chung cộng truy vấn phối hợp, không N+1 theo từng lịch; các thao tác tải/quét được đo riêng. Với số đo này, **P — đã xét, không thấy phát hiện đủ bằng chứng** để kết luận nghẽn cần sửa trong gói B; không gắn mức lỗi chỉ vì import >1 giây. Chưa đo thời gian mở desktop, ghi file hay render UI; các phép đo đó thuộc C/D/F/H.

## Bảng đếm mức × trục

Đếm mỗi phát hiện mới đúng một trục chính, không nhân đôi lỗi importer vào S.

| Mức | E | C | D | P | B | T | A | S | Tổng mới |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 1 | 3 | 0 | 0 | 0 | 0 | 0 | 4 |
| Low | 2 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 4 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Tổng mới** | **2** | **2** | **4** | **0** | **0** | **0** | **0** | **0** | **8** |

KNOWN có bằng chứng mới: **Low × T = 1** (CX-B9). PLAUSIBLE = 0.

## Đã xét theo mọi trục; phần không thấy thêm

| Trục | Cách đã xét | Kết quả |
|---|---|---|
| E | Đọc validator/schema/lệnh, test biên ngày/tháng/năm/số/tên trùng; probe MAX_SAFE_INTEGER, anchor biên, múi giờ, Unicode/quote/backslash; xem nested transaction và restore | CX-B5/B8. Ngoài các mục đó, đã xét, không thấy thêm lỗi có thể xác nhận |
| C | Đối chiếu D1–D10, bảng lệnh/backup, golden, hợp đồng deterministic/order, cùng giá trị qua command và import | CX-B3/B7; ordering hiện tại đúng. Ngoài các mục đó, đã xét, không thấy thêm |
| D | Đọc 5 SQL migrations, metadata, FK/CHECK/index, toàn bộ đường ghi và staging import; chạy 316 test có rollback/savepoint/migration/roundtrip và probe khôi phục | CX-B1/B2/B4/B6. Đã xét, không thấy thêm migration làm mất dữ liệu hoặc transaction ghi dở ở các đường đã thử |
| P | Đọc SQL và cache prepared statement, đếm dạng truy vấn, đo 4 mẫu bộ tải chung ở trên | **Đã xét, không thấy** vấn đề P đủ bằng chứng; chưa đo IO/native/UI thuộc gói khác |
| B | tsc noUnused, rg export → consumer trong apps/packages, đọc codemap/export index, đối chiếu các API chưa có UI | **Đã xét, không thấy** code chết/lặp gây lỗi đáng báo. API restore dành cho Phase 6 nên không coi là chết; duplicate close đã KNOWN |
| T | Đọc toàn bộ 15 test; chạy gốc, probe độc lập, patch một vị trí ngoài repo và kiểm phân biệt thứ tự chèn | CX-B9 KNOWN với bằng chứng mới. **Đã xét, không thấy** phát hiện T mới khác đủ bằng chứng |
| A | Đối chiếu 48 mã lỗi DB với i18n; kiểm dùng hàm domain cho ngày/tiền, persisted SYSTEM strings, ranh giới DB không có DOM | **Đã xét, không thấy** lỗi A mới trong B. Bốn mã seed/schema/backup có thông điệp riêng ở màn gọi; DOM, focus, contrast thuộc gói UI |
| S | Đọc giới hạn/envelope/table whitelist/column whitelist/binding, staging/FK; probe tên chứa SQL, Unicode và backslash, thêm table độc; kiểm DB gốc không đổi khi import lỗi | **Đã xét, không thấy** thêm injection/truy cập file trong B. Khoảng trống toàn vẹn backup đã đếm D/C/E; hash sai đã KNOWN. Đường dẫn Tauri/tên file xuất không nằm trong DB, chưa xác minh ở B |

Lỗi từ `persist` xảy ra sau COMMIT, trong khi callback được tài liệu hóa và lớp app quản lý lỗi lưu; không coi đó là bằng chứng SQL rollback thiếu. Không suy ra mất dữ liệu đĩa từ probe DB trong bộ nhớ.

## Phụ lục — nguồn test tạm và tái chạy

Không có file probe nào trong repo. Các đường dẫn sau đều thuộc `C:/workspace/deep-review-1-4/codex/B/`. Lệnh chạy từ checkout ghim, bằng PowerShell:

```powershell
$env:B_MODE = 'original'
pnpm exec vitest run --config C:/workspace/deep-review-1-4/codex/B/vitest.B.config.mts --configLoader native
if ($LASTEXITCODE -ne 0) { throw 'Original tests failed' }

$env:B_MODE = 'probe'
pnpm exec vitest run --config C:/workspace/deep-review-1-4/codex/B/vitest.B.config.mts --configLoader native
if ($LASTEXITCODE -ne 0) { throw 'Probe tests failed' }

pnpm exec tsc -p C:/workspace/deep-review-1-4/codex/B/mutant-db/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters --incremental false
if ($LASTEXITCODE -ne 0) { throw 'Mutant typecheck failed' }

$env:B_MODE = 'mutant'
pnpm exec vitest run --config C:/workspace/deep-review-1-4/codex/B/vitest.B.config.mts --configLoader native
if ($LASTEXITCODE -ne 0) { throw 'Mutant tests failed' }

$env:B_MODE = 'probe'
pnpm exec vitest run ordering.probe.test.ts --config C:/workspace/deep-review-1-4/codex/B/vitest.B.config.mts --configLoader native
if ($LASTEXITCODE -ne 0) { throw 'Ordering discriminator failed' }
Remove-Item Env:B_MODE
```

`mutant-db` sao chép `packages/db/{src,migrations,package.json}`, giữ nguyên toàn bộ test; patch `mutation.patch` chỉ đổi **lần xuất hiện đầu tiên** tại chọn PK của `backup.ts`, không đổi `columnList`. Junction dependency trỏ đúng checkout ghim. Config bên dưới đưa cache/include/alias ra ngoài repo. Toàn bộ nguồn test dùng làm bằng chứng được chép nguyên văn sau đây.

### vitest.B.config.mts

```typescript
const repo = 'C:/workspace/Project-2C-review-2';
const here = 'C:/workspace/deep-review-1-4/codex/B';
const mutant = process.env.B_MODE === 'mutant';
const db = mutant ? `${here}/mutant-db` : `${repo}/packages/db`;
export default {
  root: repo,
  cacheDir: `${here}/cache`,
  resolve: { alias: [
    { find: /^@p2c\/domain$/, replacement: `${repo}/packages/domain/src/index.ts` },
    { find: /^@p2c\/db$/, replacement: `${db}/src/index.ts` },
  ] },
  server: { fs: { allow: [repo, here] } },
  test: {
    include: process.env.B_MODE === 'original' ? [`${repo}/packages/db/src/**/*.test.ts`] : mutant ? [`${here}/mutant-db/src/**/*.test.ts`] : [`${here}/*.probe.test.ts`],
    globals: true, testTimeout: 120000, fileParallelism: false,
    coverage: { enabled: false },
    reporters: ['default'],
  },
};
```

### correctness.probe.test.ts

```typescript
import { readFileSync, writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import {
 openDatabase, createTeam, createPerson, createCustomer, recordKycNote, scheduleAppointment,
 recordMeetingOutcome, submitPolicy, issuePolicy, exportBackup, importBackup,
 restoreAppointment, restorePolicy, getAppointment, getPolicy, getKycProfile, updateCustomerProfile,
 changeStageManually, listStageTransitions, listCustomers, listAppointments, listPolicies,
 loadMetricsData, addKycNote, DbError,
} from '@p2c/db';
import { calendarDate, evaluateKycGate } from '@p2c/domain';
const here = 'C:/workspace/deep-review-1-4/codex/B';
const now = () => new Date('2026-10-05T08:00:00Z');
const d = (day: number, month = 10, year = 2026) => calendarDate(year, month, day);
const findings: unknown[] = [];
async function small() {
 const db = await openDatabase({now});
 const t = createTeam(db,{name:'Sao Mai'});
 const re = createPerson(db,{name:'An', role:'RE',teamId:t.id});
 const tl = createPerson(db,{name:'Hà', role:'TL',teamId:t.id});
 const c = createCustomer(db,{name:'Lan', reId:re.id, date:d(1),stage:'N3',birthDate:{year:1984},gender:'FEMALE'});
 const a = scheduleAppointment(db,{customerId:c.id,reId:re.id,date:d(2),triggerType:'OTHER',coordinatorIds:[tl.id]});
 recordMeetingOutcome(db,a.id,{status:'MET',stageAfter:'N3',nextStep:'Gọi lại',outcomeReviewerId:tl.id});
 const p = submitPolicy(db,{customerId:c.id,reId:re.id,submittedDate:d(2),submittedFyp:20000000});
 issuePolicy(db,p.id,{issuedDate:d(3)});
 recordKycNote(db,c.id,{text:'Gia đình và nghề nghiệp',date:d(2),facts:[{field:'maritalStatus',value:'Đã kết hôn'},{field:'childrenCount',value:2},{field:'occupation',value:'Bác sĩ'}]});
 return {db,t,re,tl,c,a,p,json:JSON.parse(exportBackup(db))};
}
const capture = async (fn:()=>unknown) => {try {await fn();return 'ACCEPTED';} catch(e) {return e instanceof DbError ? `${e.code}:${JSON.stringify(e.params)}` : String(e);}};
afterAll(()=>writeFileSync(`${here}/correctness-results.json`,JSON.stringify(findings,null,2)));
it('restoration admits future held/missed appointments and policies, then reimport rejects them', async()=> {
 for(const status of ['MET','NO_SHOW']) {
  const {db,json,a,p} = await small();
  const ap = json.tables.appointments.find((r:any)=>r.id===a.id);
  Object.assign(ap,{date:'2026-10-06',status,deleted_at:now().toISOString(),outcome_reviewer_id:null});
  if(status==='NO_SHOW') Object.assign(ap,{stage_after:null,next_step:null});
  const pol = json.tables.policies.find((r:any)=>r.id===p.id);
  Object.assign(pol,{submitted_date:'2026-10-06',issued_date:'2026-10-07',deleted_at:now().toISOString()});
  const {db:imp} = await importBackup(JSON.stringify(json),{now});
  restoreAppointment(imp,a.id); restorePolicy(imp,p.id);
  expect(getAppointment(imp,a.id)?.date).toEqual(d(6));
  expect(getPolicy(imp,p.id)?.issuedDate).toEqual(d(7));
  const roundtrip=await capture(()=>importBackup(exportBackup(imp),{now}));
  expect(roundtrip).toBe('BACKUP_INVALID:{"rule":10}');
  findings.push({probe:'restore-future',status,roundtrip});
  db.sqlite.close();imp.sqlite.close();
 }
});
it('backup accepts required texts empty or whitespace although commands reject', async()=> {
 const {db,json,c,a,re} = await small();
 json.tables.teams[0].name=''; json.tables.people[0].name='   ';
 json.tables.customers[0].name='';json.tables.kyc_notes[0].text='';
 json.tables.appointments[0].next_step='   ';
 const {db:imp}=await importBackup(JSON.stringify(json),{now});
 expect(listCustomers(imp)[0]?.name).toBe('');
 const command = await capture(()=>recordMeetingOutcome(imp,a.id,{status:'MET',stageAfter:'N3',nextStep:'   '}));
 expect(command).toBe('OUTCOME_REQUIRED:undefined');
 expect(await capture(()=>createCustomer(imp,{name:'',reId:re.id,stage:'N3',date:d(1)}))).toBe('NAME_REQUIRED:undefined');
 findings.push({probe:'empty-texts',command,customer:listCustomers(imp)[0]?.name});
 db.sqlite.close();imp.sqlite.close();
});
it('backup accepts a deleted reviewer/coordinator on a live meeting; unchanged outcome edit fails',async()=> {
 const {db,json,tl,a}=await small();
 json.tables.people.find((r:any)=>r.id===tl.id).deleted_at=now().toISOString();
 const {db:imp}=await importBackup(JSON.stringify(json),{now});
 const error=await capture(()=>recordMeetingOutcome(imp,a.id,{status:'MET',stageAfter:'N3',nextStep:'Gọi lại',outcomeReviewerId:tl.id}));
 expect(error).toBe('PERSON_NOT_FOUND:undefined');
 findings.push({probe:'deleted-meeting-people',error});db.sqlite.close();imp.sqlite.close();
});
it('backup with profile birth year but no birthYear fact stays inconsistent after an unchanged profile save',async()=> {
 const {db,json,c}=await small();
 json.tables.kyc_facts=json.tables.kyc_facts.filter((r:any)=>r.field!=='birthYear');
 // No version hash left to falsify: this is the profile/fact relationship alone.
 json.tables.kyc_versions=[];
 const {db:imp}=await importBackup(JSON.stringify(json),{now});
 updateCustomerProfile(imp,c.id,{birthDate:{year:1984}});
 const profile=getKycProfile(imp,c.id); const gate=evaluateKycGate(profile.facts);
 expect(profile.facts.some(f=>f.field==='birthYear')).toBe(false);
 findings.push({probe:'profile-without-fact',gate});db.sqlite.close();imp.sqlite.close();
});
it('accepted maximum seq lets commands store an unsafe integer and breaks reimport',async()=> {
 const {db,json,c}=await small();
 const first=json.tables.stage_transitions.find((r:any)=>r.customer_id===c.id);
 first.seq=Number.MAX_SAFE_INTEGER;
 const {db:imp}=await importBackup(JSON.stringify(json),{now});
 changeStageManually(imp,c.id,{to:'N2',date:d(4)});
 const seq=imp.sqlite.exec('SELECT MAX(seq) FROM stage_transitions')[0].values[0][0];
 expect(seq).toBe(Number.MAX_SAFE_INTEGER+1);
 const roundtrip=await capture(()=>importBackup(exportBackup(imp),{now}));
 const next=await capture(()=>changeStageManually(imp,c.id,{to:'N1',date:d(5)}));
 expect(roundtrip.startsWith('BACKUP_INVALID')).toBe(true);
 findings.push({probe:'maximum-seq',seq,roundtrip,next});db.sqlite.close();imp.sqlite.close();
});
it('measures repository, JSON backup and binary export on the shared load data',async()=> {
 const text=readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json','utf8');
 const samples:any[]=[];
 for(let run=0;run<4;run++) {
  const start=performance.now();const {db}=await importBackup(text,{now});const imported=performance.now()-start;
  const timed=(fn:()=>unknown)=>{const start=performance.now();const value=fn();return {ms:performance.now()-start,value};};
  const customers=timed(()=>listCustomers(db));const appts=timed(()=>listAppointments(db));
  const policies=timed(()=>listPolicies(db));const trans=timed(()=>listStageTransitions(db));
  const metrics=timed(()=>loadMetricsData(db));const json=timed(()=>exportBackup(db));const binary=timed(()=>db.export());
  const customerId=(customers.value as any[])[0].id;
  const oneCustomer=timed(()=>listAppointments(db,customerId));
  samples.push({run,imported,customers:customers.ms,appointments:appts.ms,policies:policies.ms,transitions:trans.ms,metrics:metrics.ms,jsonExport:json.ms,binaryExport:binary.ms,oneCustomer:oneCustomer.ms,jsonBytes:Buffer.byteLength(json.value as string),binaryBytes:(binary.value as Uint8Array).length,counts:{customers:(customers.value as any[]).length,appointments:(appts.value as any[]).length,policies:(policies.value as any[]).length,transitions:(trans.value as any[]).length}});
  db.sqlite.close();
 }
 writeFileSync(`${here}/performance-results.json`,JSON.stringify(samples,null,2));
 console.log('B_PERFORMANCE',JSON.stringify(samples));
});
```

### edges.probe.test.ts

```typescript
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { openDatabase, seedDemoData, exportBackup, listTeams, createTeam, importBackup, createPerson, createCustomer, scheduleAppointment } from '@p2c/db';
import { calendarDate } from '@p2c/domain';
const here='C:/workspace/deep-review-1-4/codex/B';
const now=()=>new Date('2026-10-05T08:00:00Z');
const results: unknown[]=[];
afterAll(()=>writeFileSync(`${here}/edge-results.json`,JSON.stringify(results,null,2)));
it('seed differs across Asia/Ho_Chi_Minh and Pacific/Auckland for the same anchor/seed',async()=> {
 const old=process.env.TZ;
 try {
  const outputs:any[]=[];
  for(const zone of ['Asia/Ho_Chi_Minh','Pacific/Auckland']) {
   process.env.TZ=zone;
   const db=await openDatabase({now});seedDemoData(db,{anchorDate:calendarDate(2026,10,5),seed:1});
   const text=exportBackup(db);const json=JSON.parse(text);
   outputs.push({zone,hash:createHash('sha256').update(text).digest('hex'),notes:json.tables.kyc_notes,versions:json.tables.kyc_versions});
   db.sqlite.close();
  }
  const differences=(table:string)=>outputs[0][table].filter((r:any,i:number)=>JSON.stringify(r)!==JSON.stringify(outputs[1][table][i]));
  const notes=differences('notes'),versions=differences('versions');
  expect(outputs[0].hash).not.toBe(outputs[1].hash);
  expect(notes.length).toBeGreaterThan(0);
  results.push({probe:'seed-timezones',hashes:outputs.map(({zone,hash})=>({zone,hash})),differentNotes:notes.length,differentVersions:versions.length,firstNote:notes[0],otherNote:outputs[1].notes.find((r:any)=>r.id===notes[0].id)});
 } finally { if(old===undefined) delete process.env.TZ;else process.env.TZ=old; }
});
it('seed at the two supported day boundaries throws and rolls back',async()=> {
 for(const anchor of [calendarDate(1900,1,1),calendarDate(2100,12,31)]) {
  const db=await openDatabase({now});let error:unknown;
  try { seedDemoData(db,{anchorDate:anchor,seed:1}); }catch(e) {error=String(e);}
  expect(error).toBeDefined();expect(listTeams(db)).toEqual([]);
  results.push({probe:'seed-calendar-boundary',anchor,error});db.sqlite.close();
 }
});
it('backup binds SQL-looking text and rejects an extra table without touching current DB',async()=> {
 const db=await openDatabase({now});
 const text='Tên "; DROP TABLE teams;-- \\ Unicode: Nguyễn 🧪';
 createTeam(db,{name:text});const first=exportBackup(db);
 const {db:imp}=await importBackup(first,{now});expect(listTeams(imp)[0].name).toBe(text);
 const json=JSON.parse(first);json.tables['evil"; DROP TABLE teams;--']=[];
 await expect(importBackup(JSON.stringify(json),{now})).rejects.toMatchObject({code:'BACKUP_INVALID'});
 expect(exportBackup(db)).toBe(first);
 results.push({probe:'sql-like-text',roundtrip:true,unknownTableRejected:true});db.sqlite.close();imp.sqlite.close();
});
it('backup accepts rescheduling branches and cycles not reachable through commands',async()=> {
 const db=await openDatabase({now});const team=createTeam(db,{name:'A'});
 const re=createPerson(db,{name:'An',role:'RE',teamId:team.id});
 const customer=createCustomer(db,{name:'Lan',reId:re.id,stage:'N3',date:calendarDate(2026,10,1)});
 const a=scheduleAppointment(db,{customerId:customer.id,reId:re.id,date:calendarDate(2026,10,2),triggerType:'OTHER'});
 const json=JSON.parse(exportBackup(db));const original=json.tables.appointments[0];
 original.status='RESCHEDULED';original.rescheduled_from_id=a.id;
 const {db:cycle}=await importBackup(JSON.stringify(json),{now});
 results.push({probe:'rescheduling-self-cycle',accepted:true});cycle.sqlite.close();
 original.rescheduled_from_id=null;
 json.tables.appointments.push({...original,id:'b',status:'SCHEDULED',rescheduled_from_id:a.id});
 json.tables.appointments.push({...original,id:'c',status:'SCHEDULED',rescheduled_from_id:a.id});
 const {db:branch}=await importBackup(JSON.stringify(json),{now});
 results.push({probe:'rescheduling-branch',accepted:true});branch.sqlite.close();db.sqlite.close();
});
```

### ordering.probe.test.ts

```typescript
import { writeFileSync } from 'node:fs';
import { openDatabase, exportBackup } from '@p2c/db';
import { exportBackup as mutantExport } from './mutant-db/src/backup';
it('discriminates primary-key ordering from rowid on adversarial insertion order', async()=> {
 const db=await openDatabase({now:()=>new Date('2026-10-05T08:00:00Z')});
 const stamp='2026-10-05T08:00:00.000Z';
 for(const id of ['z','a']) db.sqlite.run('INSERT INTO teams(id,name,created_at,updated_at) VALUES (?,?,?,?)',[id,id,stamp,stamp]);
 const original=JSON.parse(exportBackup(db)).tables.teams.map((r:any)=>r.id);
 const mutant=JSON.parse(mutantExport(db)).tables.teams.map((r:any)=>r.id);
 expect(original).toEqual(['a','z']);expect(mutant).toEqual(['z','a']);
 writeFileSync('C:/workspace/deep-review-1-4/codex/B/mutation-discriminator.json',JSON.stringify({original,mutant},null,2));
 db.sqlite.close();
});
```

### mutant-db/tsconfig.json

```json
{
 "extends":"C:/workspace/Project-2C-review-2/tsconfig.base.json",
 "compilerOptions":{"lib":["ES2023","DOM"],"types":[]},
 "include":["src"]
}
```

### mutation.patch

```diff
--- packages/db/src/backup.ts (original SHA f0c53eb)
+++ codex/B/mutant-db/src/backup.ts (temporary copy)
@@
-      .map((c) => quote(c.name))
+      .map(() => quote('rowid'))
```

### correctness-results.json

```json
[
  {
    "probe": "restore-future",
    "status": "MET",
    "roundtrip": "BACKUP_INVALID:{\"rule\":10}"
  },
  {
    "probe": "restore-future",
    "status": "NO_SHOW",
    "roundtrip": "BACKUP_INVALID:{\"rule\":10}"
  },
  {
    "probe": "empty-texts",
    "command": "OUTCOME_REQUIRED:undefined",
    "customer": ""
  },
  {
    "probe": "deleted-meeting-people",
    "error": "PERSON_NOT_FOUND:undefined"
  },
  {
    "probe": "profile-without-fact",
    "gate": {
      "state": "KYC_INSUFFICIENT",
      "presentCategories": [
        "FAMILY",
        "OCCUPATION_INCOME"
      ],
      "missingCategories": [
        "IDENTITY",
        "ASSETS",
        "GOALS",
        "RISK_APPETITE",
        "EXISTING_PROTECTION",
        "CONCERNS"
      ],
      "coreConflictFields": [],
      "warningFields": [],
      "suggestedQuestions": [
        {
          "category": "IDENTITY",
          "questions": [
            "Để các giải pháp đồng hành cùng anh/chị qua từng giai đoạn cuộc sống, anh/chị cho phép em được biết năm sinh của mình không ạ?",
            "Hiện anh/chị và gia đình đang sinh sống và làm việc chủ yếu tại đâu ạ?"
          ]
        },
        {
          "category": "ASSETS",
          "questions": [
            "Tài sản của gia đình hiện được phân bổ chủ yếu vào những kênh nào — bất động sản, doanh nghiệp, chứng khoán hay tiền gửi ạ?",
            "Để em đề xuất cấu trúc tương xứng, anh/chị có thể hình dung giúp em quy mô tài sản của gia đình đang ở khoảng nào không ạ?",
            "Có tài sản nào anh/chị đặc biệt muốn gìn giữ hoặc chuyển giao cho thế hệ sau không ạ?"
          ]
        },
        {
          "category": "GOALS",
          "questions": [
            "Trong 5–10 năm tới, điều gì là ưu tiên lớn nhất của anh/chị cho bản thân và gia đình ạ?",
            "Anh/chị có mốc thời gian nào đang hướng tới, như kế hoạch học tập của các cháu, nghỉ hưu hay chuyển giao doanh nghiệp không ạ?"
          ]
        },
        {
          "category": "RISK_APPETITE",
          "questions": [
            "Với các khoản đầu tư hiện tại, anh/chị thường ưu tiên sự ổn định hay sẵn sàng đón nhận biến động để hướng tới lợi nhuận cao hơn ạ?",
            "Những lần thị trường điều chỉnh mạnh, anh/chị thường chọn cách ứng xử thế nào ạ?"
          ]
        },
        {
          "category": "EXISTING_PROTECTION",
          "questions": [
            "Hiện anh/chị và gia đình đã có những giải pháp bảo vệ nào, như bảo hiểm nhân thọ, sức khỏe hay quỹ dự phòng ạ?",
            "Anh/chị thấy các giải pháp hiện có đã thật sự tương xứng với mong muốn của mình chưa, hay còn điểm nào anh/chị muốn xem lại ạ?"
          ]
        },
        {
          "category": "CONCERNS",
          "questions": [
            "Khi nghĩ về tương lai tài chính của gia đình, điều gì khiến anh/chị trăn trở nhất ạ?",
            "Nếu có một việc anh/chị mong được giải quyết trọn vẹn trong năm nay, đó sẽ là việc gì ạ?"
          ]
        }
      ],
      "aiAllowed": false,
      "message": "Cần chăm sóc, KYC thêm thông tin khách hàng"
    }
  },
  {
    "probe": "maximum-seq",
    "seq": 9007199254740992,
    "roundtrip": "BACKUP_INVALID:undefined",
    "next": "Error: UNIQUE constraint failed: stage_transitions.customer_id, stage_transitions.seq"
  }
]
```

### edge-results.json

```json
[
  {
    "probe": "seed-timezones",
    "hashes": [
      {
        "zone": "Asia/Ho_Chi_Minh",
        "hash": "ae1473cf9e7930be7f3c172a9bda0e9823ed84e2e1d6cbf6100405de63f8cc16"
      },
      {
        "zone": "Pacific/Auckland",
        "hash": "2f33698c9c437bc37efad95f64ef72a0561111fb448f7b13751698d40657c36d"
      }
    ],
    "differentNotes": 140,
    "differentVersions": 140,
    "firstNote": {
      "id": "01K6WP9C8JVFHX0V4WF8XCKZE3",
      "customer_id": "01K6T3WH0KJV71ZVZ2T2CRS73N",
      "seq": 3,
      "text": "Hồ sơ KH: năm sinh 1967",
      "created_date": "2025-10-06",
      "source": "SYSTEM",
      "created_at": "2025-10-06T12:00:07.955Z"
    },
    "otherNote": {
      "id": "01K6WP9C8JVFHX0V4WF8XCKZE3",
      "customer_id": "01K6T3WH0KJV71ZVZ2T2CRS73N",
      "seq": 3,
      "text": "Hồ sơ KH: năm sinh 1967",
      "created_date": "2025-10-07",
      "source": "SYSTEM",
      "created_at": "2025-10-06T12:00:07.955Z"
    }
  },
  {
    "probe": "seed-calendar-boundary",
    "anchor": {
      "year": 1900,
      "month": 1,
      "day": 1
    },
    "error": "RangeError: Not a calendar date: 1899-1-1"
  },
  {
    "probe": "seed-calendar-boundary",
    "anchor": {
      "year": 2100,
      "month": 12,
      "day": 31
    },
    "error": "RangeError: Not a calendar date: 2101-1-2"
  },
  {
    "probe": "sql-like-text",
    "roundtrip": true,
    "unknownTableRejected": true
  },
  {
    "probe": "rescheduling-self-cycle",
    "accepted": true
  },
  {
    "probe": "rescheduling-branch",
    "accepted": true
  }
]
```

### mutation-discriminator.json

```json
{
  "original": [
    "a",
    "z"
  ],
  "mutant": [
    "z",
    "a"
  ]
}
```

### performance-results.json

```json
[
  {
    "run": 0,
    "imported": 1333.8614999999998,
    "customers": 8.451700000000073,
    "appointments": 104.03430000000026,
    "policies": 13.218900000000303,
    "transitions": 23.476400000000012,
    "metrics": 137.01809999999978,
    "jsonExport": 252.42380000000003,
    "binaryExport": 2.6410000000000764,
    "oneCustomer": 2.9806000000003223,
    "jsonBytes": 15784463,
    "binaryBytes": 13074432,
    "counts": {
      "customers": 1496,
      "appointments": 10434,
      "policies": 1804,
      "transitions": 4978
    }
  },
  {
    "run": 1,
    "imported": 1264.8748,
    "customers": 8.719600000000355,
    "appointments": 94.28900000000021,
    "policies": 11.63339999999971,
    "transitions": 22.412199999999757,
    "metrics": 127.19639999999981,
    "jsonExport": 231.3796999999995,
    "binaryExport": 2.8407999999999447,
    "oneCustomer": 2.6847999999999956,
    "jsonBytes": 15784463,
    "binaryBytes": 13074432,
    "counts": {
      "customers": 1496,
      "appointments": 10434,
      "policies": 1804,
      "transitions": 4978
    }
  },
  {
    "run": 2,
    "imported": 1220.9620999999997,
    "customers": 8.041999999999462,
    "appointments": 90.20120000000043,
    "policies": 11.135800000000017,
    "transitions": 21.317799999999806,
    "metrics": 127.21929999999975,
    "jsonExport": 230.98120000000017,
    "binaryExport": 2.581199999999626,
    "oneCustomer": 2.672599999999875,
    "jsonBytes": 15784463,
    "binaryBytes": 13074432,
    "counts": {
      "customers": 1496,
      "appointments": 10434,
      "policies": 1804,
      "transitions": 4978
    }
  },
  {
    "run": 3,
    "imported": 1206.1504000000004,
    "customers": 8.477200000000266,
    "appointments": 93.72530000000006,
    "policies": 10.399599999999737,
    "transitions": 22.31380000000081,
    "metrics": 122.10659999999916,
    "jsonExport": 224.28539999999975,
    "binaryExport": 2.7335000000002765,
    "oneCustomer": 2.539099999999962,
    "jsonBytes": 15784463,
    "binaryBytes": 13074432,
    "counts": {
      "customers": 1496,
      "appointments": 10434,
      "policies": 1804,
      "transitions": 4978
    }
  }
]
```



Kiểm cuối: HEAD vẫn f0c53eb57eb7eac8665ad87287e794ae4c5bc43b; git diff rỗng. Ba mục untracked `.agents/`, `.codex/`, `AGENTS.md` đã có trước phiên, không do probe này tạo. Không có thay đổi tracked trong checkout.
