# Review độc lập Project-2C — Phase 1–3, lần 2

- Review ngày 02/10/2026, giờ Việt Nam (UTC+07:00), theo AGENTS.md và prompt-codex.md.
- Worktree: `C:\workspace\Project-2C-astra`, detached HEAD `5eb7c035e35c8e40539b1221a6f7d35f7606ebb0`.
- Phạm vi diff: `0fa0eea..5eb7c03`, 78 file, 4.393 dòng thêm / 380 dòng bỏ; sau đó rà đường rủi ro Phase 1→3.
- Artifact: `Project-2C-5eb7c035e35c8e40539b1221a6f7d35f7606ebb0`, CI run `37010438107`, `exe\project2c.exe` trong thư mục báo cáo. SHA256 đọc tại máy **khớp** `46079F7E30CEE1FB27CBA9CD7622FCDC299424E21CF19945AA7845E6D18B1C00`.
- Reviewer chỉ đọc, chạy kiểm chứng, tạo/xóa test tạm và viết báo cáo; không sửa tracked, commit hoặc ghi lên GitHub. Tất cả `file:dòng` dưới đây ở SHA snapshot trên.

## 1. Kết luận G7

**CHƯA SẴN SÀNG để reviewer xác nhận đóng G7 tại snapshot này.** Kiểm tra nền đều xanh; chưa xác nhận regression mới của gói A/B. Tuy nhiên, C-001 tái hiện được backup thỏa cấu trúc và tám quy tắc hiện tại nhưng làm thao tác nghiệp vụ tiếp theo lỗi hoặc KYC lệch hồ sơ. Backup xuất sau thao tác resolve còn bị chính importer từ chối. Phiên này cũng chưa kiểm được exe thật để xác nhận giữ dữ liệu, khóa hai process và đóng app.

Đề nghị Claude kiểm lại C-001 trước khi chốt sửa hoặc đề nghị Owner nhận rủi ro có ghi rõ. C-002 cần quyết định cho nhân sự cũ; B1b chặn thêm TL nhưng chưa giải quyết dữ liệu cũ. C-003…C-008 chủ yếu là nợ đã nằm trong kế hoạch Phase 4, không tự động trở thành lỗi chặn mới G7. C-009 là Nit tài liệu.

Không có Critical/High hoặc NEW được xác nhận. **NEW = 0 không có nghĩa lỗi cũ đã hết.** C-001 là phần còn thiếu của F-01 đã ghi RESOLVED, không đổi tên thành NEW. Medium phản ánh hậu quả cụ thể lần này; không giữ High của F-01 cũ khi các ca cũ đã sửa và chưa chứng minh mất dữ liệu không phục hồi.

| Severity | NEW | KNOWN | Tổng |
|---|---:|---:|---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 0 | 3 | 3 |
| Low | 0 | 5 | 5 |
| Nit | 0 | 1 | 1 |
| **Tổng** | **0** | **9** | **9** |

Chỉ đếm C-001…C-009. Ba ca C-001 gộp theo vấn đề kiểm bất biến backup. ACCEPTED, probe chẩn đoán và backlog đối chiếu không cộng vào bảng.

## 2. Bằng chứng đã chạy

Chạy đúng worktree/SHA, không checkout khác. Coverage lấy từ log/artifact thật của verify. Test tạm chạy riêng, không cộng vào 782 test nền và không nằm trong lần đo coverage.

| Lệnh | Bắt đầu → kết thúc (02/10, UTC+07) | Thời gian thực | Kết quả |
|---|---|---:|---|
| `pnpm verify` | 20:45:49.967 → 20:47:02.166 | 72,20 s | Exit 0; format/lint/deps/tokens/typecheck/coverage pass; **47 file / 782 test pass**, Vitest 55,26 s |
| `pnpm lint:deps` (verify gọi) | Trong lượt trên | Không đo riêng | **0 vi phạm**, 179 module / 680 dependency |
| `pnpm verify:rust` | 20:48:45.644 → 20:52:13.304 | 207,66 s | Exit 0; fmt/clippy `-D warnings`/cargo test pass; **36 pass / 0 fail**, test 0,12 s |
| `pnpm exec vitest run packages/db/src/backup-review.astra.test.ts` | 20:52:54.576 → 20:52:55.816 | 1,24 s | Exit 0; **6/6 probe pass**, Vitest 790 ms; có probe chủ động loại khỏi số lỗi |
| `$env:CI='1'; pnpm e2e` — lần 1 | 20:53:40.496 → 21:06:02.800 | 742,30 s | Exit 0; **114 passed (12.4m), 0 flaky, 0 failed**; dừng Vite thủ công để xong teardown |
| `$env:CI='1'; pnpm e2e` — chạy lại | 21:06:42.965 → 21:14:02.336 | 439,37 s | Exit 0; **114 passed (7.3m), 0 flaky, 0 failed**; cũng dừng Vite thủ công |
| `pnpm exec vitest run packages/db/src/legacy-period-review.astra.test.ts` | 21:15:15.718 → 21:15:16.707 | 0,99 s | Exit 0; **2/2 probe pass**, Vitest 546 ms; nhân sự support có team và biên kỳ |

Hai lượt e2e dùng CI=1, dựng server mới 4173 với strictPort, retry tối đa 1; không dùng lại server checkout khác. Mỗi log có đủ 114 dòng `ok`, không retry/flaky. Seed-timing pass, thời lượng test 3,7 s / 3,4 s; **không gọi đó là thời gian mở exe**. Không tái hiện timeout seed F-05.

Sau khi test xong, cả hai runner mắc ở dừng webserver. Đã xác nhận command line Vite `C:\workspace\Project-2C-astra\apps\desktop\…\vite.js preview --port 4173 --strictPort`, rồi `taskkill /PID 9752 /F` và `/PID 39044 /F`, chỉ server của chính lượt review. Playwright sau đó in summary, exit 0. Dòng `[WebServer] ELIFECYCLE ... exit code 1` cuối log là hậu quả dừng server, không phải test failed. Thời gian gồm chờ teardown; **không coi hai lượt là lệnh kết thúc tự nhiên sạch**. Chưa xác định nguyên nhân Windows/sandbox hay Playwright; ghi giới hạn, không gán lỗi sản phẩm hoặc cùng nguyên nhân F-05. Một lần thử Stop-Process thất bại, không dùng lần thử đó làm bằng chứng đã dừng process.

Verify có **1 warning, 0 error** về dependency `today` ở `AppointmentsScreen.tsx:189`. Code dùng `[today.year, today.month, today.day]`, đủ các trường dateTone sử dụng; chưa thấy lỗi hành vi do warning, không lập phát hiện riêng.

| Coverage | Statements | Branches | Functions | Lines |
|---|---:|---:|---:|---:|
| Toàn tập được đo | 99,49% (1588/1596) | 98,41% (868/882) | 100% (451/451) | 99,78% (1368/1371) |
| db/src | 99,33% (1203/1211) | 97,82% (629/643) | 100% (340/340) | 99,71% (1046/1049) |
| domain/src — file trực tiếp | 100% (332/332) | 100% (224/224) | 100% (101/101) | 100% (271/271) |
| domain/src/golden | 100% (53/53) | 100% (15/15) | 100% (10/10) | 100% (51/51) |

Coverage không gồm React app/Rust; test app vẫn nằm trong 782 test. G01–G22, K01–K15 chạy qua domain/DB, có round-trip backup bổ sung; golden không sửa. `git diff 0fa0eea..5eb7c03 -- packages/domain/src/golden` rỗng. Build:web được cả hai lượt e2e dựng thành công. Không install, không đổi lockfile; Cargo dùng cache/toolchain sẵn có theo chấp thuận của anh.

Log/metadata cạnh báo cáo: `pnpm-verify{.log,-result.json}`, `pnpm-verify-rust{.log,-result.json}`, `pnpm-e2e{.log,-result.json}`, `pnpm-e2e-rerun{.log,-result.json}`, `backup-review-repro{.log,-result.json}`, `legacy-period-review-repro{.log,-result.json}`. Bản sao hai test tạm cũng ở thư mục báo cáo; toàn bộ nội dung được chép ở phụ lục.

## 3. Phát hiện

### C-001 — Medium · KNOWN F-01 / A-001 · REPRODUCED — Backup còn nhận trạng thái mà command không xử lý an toàn

**Đối chiếu:** báo cáo tổng hợp `docs/reviews/2026-09-30-phase-1-3-tong-hop.md:57`, A-001 của Codex lần 1; `HANDOFF.md:120` ghi F-01…F-04 RESOLVED. Các ca scalar/ngày/JSON và tám relational rules đã bổ sung là tiến bộ thật, test xanh. Đây là biến thể còn thiếu của cùng vấn đề nhập bỏ qua giả định nghiệp vụ, cần xét lại mức hoàn tất F-01.

**Nguồn:** `packages/db/src/backup-validation.ts:116`, `:154`, `:175`, `:200`; `packages/db/src/customers.ts:240`; `packages/db/src/kyc.ts:162`; `apps/desktop/src/routes/customers/kyc-view.ts:203`.

| Biến thể | Chuẩn bị JSON export | Hành vi sau import thành công |
|---|---|---|
| Live KH thuộc RE đã xóa | Tạo KH bằng command; export; đặt deleted_at của RE thành timestamp hợp lệ | KH còn đọc được, RE không ở listPeople; chỉ sửa tên KH ném **PERSON_NOT_FOUND** |
| Transition tạo KH gắn vào cuộc gặp | Tạo KH N3 + cuộc gặp MET giữ N3 cùng ngày; export; đặt appointment_id của transition đầu thành ID cuộc gặp | softDeleteAppointment ném **NOT NULL constraint failed: customers.stage**; transaction rollback giữ N3 |
| SYSTEM năm sinh sai trong conflict | KH 1984; tạo conflict 1985; export; đổi fact SYSTEM conflict 1984 thành 1983 | Resolve chọn SYSTEM cho **hồ sơ 1984 / KYC active 1983**; export rồi import lại bị **BACKUP_INVALID rule 8** |

ownerRule chỉ kiểm role (`backup-validation.ts:180`), không kiểm RE đã xóa cho bản ghi sống. transitionRule không buộc appointment_id của transition đầu null; meetingRule nhận MET cùng KH/ngày/nhóm, còn lệnh rút giả định fromStage luôn có giá trị (`customers.ts:257`). Rule 8 chỉ kiểm active (`backup-validation.ts:213`); resolve chỉ kiểm nguồn SYSTEM (`kyc.ts:173`), không so giá trị với hồ sơ. UI cũng chỉ disable nguồn không phải SYSTEM (`kyc-view.ts:213`), không chặn thêm giá trị SYSTEM sai.

**Tái hiện:** ba test tương ứng ở phụ lục A; chạy lệnh §2, assertions hành vi sai đều pass. Đây là seam DB, không quan sát exe. Đường Cài đặt → preview → thay DB đã đọc code, không giả đã bấm import những file này.

**Rủi ro:** dữ liệu nhận được làm command sau nhập lỗi hoặc vi phạm D2; chưa chứng minh mất DB gốc không phục hồi, ca xóa lịch rollback đúng. Không tố #204 vi phạm tám quy tắc: spec `docs/design/phase-3-du-lieu.md:219`–`:226` hẹp đúng implementation. Cần bổ sung hợp đồng để dữ liệu nhận vẫn dùng được bởi command.

**Hướng sửa:** xét thêm owner sống cho bản ghi sống, appointment_id null ở transition tạo KH, giá trị SYSTEM có thể được chọn khi resolve phải khớp hồ sơ; có thể kiểm lại tại resolve. Giữ các ca xóa mềm/khôi phục hợp lệ #210, không chặn mọi tham chiếu tới bản ghi xóa. Thêm regression nhập → thao tác → export/import lại, cập nhật spec/ledger; không viết patch.

### C-002 — Medium · KNOWN HANDOFF #231 · REPRODUCED — Nhân sự cũ có thể biến mất khỏi màn Team

**Đối chiếu:** `HANDOFF.md:93` đã ghi IS/BD/BDM có team không hiện và TL thứ hai bị ẩn. B1b (#233) chặn thêm TL, chưa migrate dữ liệu cũ/từ chối backup nhiều TL; không phải NEW.

**Nguồn:** `apps/desktop/src/routes/team/team-view.ts:33` (lead đầu, reps RE, shared teamId null); `packages/db/src/team.ts:245` (support có team hợp lệ), `:257` (kiểm TL ở mọi update); `backup-validation.ts:102` không rule số TL.

**Tái hiện:** (1) tạo IS/BD/BDM có team bằng command hợp lệ: cả ba ở listPeople, không ID nào ở lead/reps/shared (phụ lục B). (2) export setup, nhân bản TL cùng team với ID khác, import nhận: view đếm TL=2 nhưng chỉ hiện TL đầu; update tên **cả hai** ném TEAM_HAS_LEAD (test thứ 2 phụ lục A). Trước B1b dữ liệu nhiều TL từng hợp lệ. UI tạo support mới đã tự bỏ team, e2e chặn TL thứ hai xanh; không tố hai luồng mới đó sai.

**Hậu quả:** mất khả năng tìm/sửa qua màn Team, không xóa bản ghi khỏi DB. **Hướng sửa:** chốt cách hiện/migrate support có team và cảnh báo/quy trình xử lý nhiều TL cũ; không âm thầm bỏ dữ liệu. Thống nhất importer với quy tắc dữ liệu cũ; cân nhắc cho sửa tên không đổi vai trò nếu nghiệp vụ cho phép.

### C-003 — Medium · KNOWN F-06/F-07 / B-001 · CONFIRMED — Metrics còn quét lồng, MTD chưa có helper riêng

**Đối chiếu:** `HANDOFF.md:64`, T-e Phase 4. **Nguồn:** `packages/domain/src/stats.ts:26`, `:62`, `:73`; export domain chưa có MTD riêng.

rfCount lọc cuộc hẹn rồi gọi isRfAppointment, mỗi cuộc MET quét transitions.some (có thể O(A×T)); scope Team quét people.some theo record (O(A×P)). Dashboard nhiều kỳ/scope lặp công việc. MTD thiếu seam thống nhất ngày cắt. Đọc code xác nhận thuật toán; **không đo latency mới**, không chép benchmark cũ thành số đo snapshot này. Golden xanh, không có bằng chứng sai RF trên dữ liệu hợp lệ; MTD thuộc Phase 4, không tố màn Phase 3 đang sai MTD.

**Hướng sửa:** theo T-e/G2 Phase 4, index dùng chung và helper MTD, giữ golden, benchmark seed; không đổi công thức RF tại G7.

### C-004 — Low · KNOWN F-14 / B-002 · REPRODUCED — Chuyển kỳ ở biên năm không nhất quán

**Đối chiếu:** `HANDOFF.md:65`, T-f; năm >9999 gộp cùng miền năm ở `HANDOFF.md:136`. **Nguồn:** `packages/domain/src/period.ts:40`, `:58`, `:138`, `:215`; `packages/ui/src/components/PeriodPicker.tsx:113`, `:127` gọi shift trực tiếp.

**Tái hiện:** từ 01/01/1900, lùi tháng cho 12/1899, lùi năm cho 1899; lùi ngày/tuần/tùy chọn ném RangeError. addDays(31/12/9999,1) cho 10000 nhưng parseDate(formatDate(...)) null. Test thứ hai phụ lục B pass. UI không guard nút lùi, ErrorBoundary màn không bắt event handler. Chỉ chạy domain, chưa bấm UI ở biên. Không tách phần năm >9999 thành NEW.

**Hướng sửa:** Owner chốt MIN/MAX tại G2 Phase 4, áp nhất quán parser/arithmetic/DB và disable/báo lỗi chuyển vượt miền. Vắt tháng/năm thông thường vẫn xanh.

### C-005 — Low · KNOWN F-08 / B-003 · CONFIRMED — Coverage gate áp gộp và không đo app

**Đối chiếu:** F-08, T-g. **Nguồn:** `vitest.config.ts:8` include domain/db; `:10` thresholds 95 gộp, không riêng package.

Đọc cấu hình xác nhận một package có thể tụt ngưỡng yêu cầu mà tổng vẫn đủ. App-data/queue/React CloseGuard không trong báo cáo coverage, dù app test chạy và e2e có boundary. Số hiện tại của domain/db đều cao; 99,49% không là coverage toàn app.

**Hướng sửa:** gate riêng theo ngưỡng ADR/spec mỗi package, bổ sung seam app cho lưu/thay DB/đóng app theo hạ tầng; không tăng test chỉ để đếm dòng.

### C-006 — Low · KNOWN F-11 · CONFIRMED — Lệnh DB chuyển nhóm tay/HĐ chưa chặn tương lai

**Đối chiếu:** `HANDOFF.md:67`, T-h. **Nguồn:** `packages/db/src/customers.ts:158` gọi appendTransition không so hôm nay; `packages/db/src/policies.ts:101` chỉ so issuedDate với submittedDate.

**Cách tái hiện theo code:** gọi chuyển nhóm tay/nộp/phát hành HĐ ngày tương lai, các ràng buộc khác hợp lệ. UI nhập bản ghi có chặn, không khẳng định bấm màn hiện tại nhập được; chưa chạy probe riêng. PR đồng hồ DB đã sửa nguồn ngày, không tự thêm giới hạn này.

**Hướng sửa:** thống nhất hợp đồng command/UI, kiểm hôm nay bằng đồng hồ DB/app theo T-h và kiểm reject/rollback; không đổi đồng hồ hệ thống.

### C-007 — Low · KNOWN F-12 · CONFIRMED — Xóa ngày sinh/chọn giới tính chưa rõ chỉ nhận lỗi chung

**Đối chiếu:** `HANDOFF.md:68`, T-h. **Nguồn:** `packages/db/src/kyc.ts:273`, `:282` ném KYC_PROFILE_FIELD_REQUIRED; `apps/desktop/src/i18n/index.ts:17` fallback error.unknown, vi.ts thiếu key lỗi này.

**Cách tái hiện theo code:** hồ sơ đã có ngày sinh/giới tính, sửa rồi xóa ngày sinh/chọn Chưa rõ. DB/preview từ chối theo D2, UI không chỉ ra phải giữ trường, chỉ lỗi chung. Chưa bấm exe. Giá trị cũ không mất; không gọi quy tắc cấm xóa dữ kiện đã có là lỗi.

**Hướng sửa:** message/chỉ rõ trường ở form và preview; giữ D2/rollback.

### C-008 — Low · KNOWN F-13 / A-003 · CONFIRMED — Lưu kết quả chưa chọn trạng thái không phản hồi

**Đối chiếu:** `HANDOFF.md:69`, #169/T-h. **Nguồn:** `apps/desktop/src/routes/appointments/OutcomeDialog.tsx:55` có thể status null khi MET disable; `:81` trả ngay nếu null.

**Cách tái hiện theo code:** mở kết quả lịch tương lai, chưa chọn Hủy/Không đến/Dời lịch, bấm Lưu kết quả: không lưu, không báo thiếu trạng thái và không disable theo status. Không tái hiện thêm bằng exe.

**Hướng sửa:** báo chọn kết quả hoặc disable nút với lý do; không tự chọn hộ. Các luồng MET/ngày quá khứ đang xanh.

### C-009 — Nit · KNOWN F-10 / B-004 · CONFIRMED — Handoff còn nói B6 chưa xong

**Đối chiếu:** F-10/B-004; AGENTS đã cảnh báo. **Nguồn:** `docs/state/HANDOFF.md:5`, `:142` nói #228/T-091 đang làm/bước kế tiếp, trong khi HEAD là PR #247 YearGrid, unit/e2e xanh.

Có thể làm phiên sau chọn việc đã xong. Chỉ ghi một Nit, không tố B6 thiếu code. **Hướng sửa:** cập nhật handoff/checklist #72/metrics theo snapshot cuối; reviewer không sửa repo.

### 3.10. Đối chiếu lỗi cũ và các mục không tính là lỗi mới

| Mục | Kết quả lần 2 |
|---|---|
| F-01 | Scalar/tám relational rules đã có, test xanh; còn C-001. Ca TL của C-002 không đếm lại ở C-001 |
| F-02 failed-open làm DB cũ ngừng lưu | Fix opening/current (`app-data.ts:180`) giữ generation khi open fail; app-data test xanh. Không tái hiện lỗi cũ. Race S-2 vẫn OPEN (`HANDOFF.md:73`), chưa chứng minh đã hết |
| F-03 thiếu boundary | Boundary đã có, screen-error e2e xanh: thông báo, sidebar dùng được, đổi scope render lại. CloseGuard là sibling ngoài AppShell (`App.tsx:15`) |
| F-04 không giới hạn backup | Giới hạn 100 MB/scalar có test unit/e2e xanh; không thử >100 MB trên exe lần nữa |
| F-05 seed timeout | Hai lượt 10 workers không timeout/retry/flaky. Teardown treo ghi riêng §2/§5, chưa gán cùng nguyên nhân |
| F-06/F-07, F-08 | C-003, C-005; T-e/T-g Phase 4 |
| F-09 Actions ghim tag | Nợ T-g đã ghi lần trước; không audit supply chain hay lập NEW lần này |
| F-10 | C-009; không lặp mockup dashboard đã lên kế hoạch G2 Phase 4 |
| F-11…F-14 | C-006, C-007, C-008, C-004 |
| F-15 / F-19 | Nợ T-h ký tự JSX/lookup policy/i18n (`HANDOFF.md:70`–`:71`); không nâng thành lỗi toàn vẹn dữ liệu mới, không đếm lại trong 9 mục ưu tiên này |
| F-16/F-17 | P-1/P-2 đã ghi; review này giữ head, không tracked edit/commit. Không kiểm lại mọi comment PR để tuyên bố mọi PR đã tuân thủ |
| F-18 tooltip | Checklist T-i cho Phase 4 (`HANDOFF.md:72`); không tuyên bố XSS tái hiện trên dashboard chưa triển khai |
| Probe RF bỏ appointment_id | RF từ 1 về 0 sau cố ý đổi nguồn transition thành manual là quan sát thật. Domain tin appointmentId là hợp đồng **ACCEPTED** (`HANDOFF.md:134`); dữ liệu không đủ để suy đó phải là chuyển từ cuộc gặp. **Không tính lỗi** |
| Probe hash KYC sai | Import nhận hash bị đổi; tám quy tắc chưa cam kết tính lại hash. Chưa chứng minh hậu quả người dùng ở Phase 1–3; chẩn đoán cho nền Phase 5, **không tính lỗi** |
| ACCEPTED khác | Không đếm: không xóa lịch RESCHEDULED, khôi phục mềm Phase 6, giữ ô Giờ, boundary không in stack, race rename do chương trình ngoài, chart/Team tree Phase 4, DataTable dùng e2e thay unit, ADR cũ Owner giữ |

### 3.11. Rà các đường rủi ro Phase 1→3 và diff trọng tâm

| Trục | Bằng chứng / nhận định |
|---|---|
| Lưu, thay DB, đóng app | Đọc queue/app-data/storage Tauri/Rust/CloseGuard: giữ snapshot lỗi để retry, replace chờ idle và từ chối khi failed, mở DB staging trước đổi. Atomic write/lock/claim/retention được Rust test kiểm. Chưa kiểm wiring đĩa/close exe; S-2 còn là giới hạn đã biết |
| Nhập/xuất | Corrupt/scalar/newer schema/round-trip và không đổi current DB khi reject có test xanh; C-001 kiểm thêm nhập → command. Không suy mọi JSON hợp lệ SQL đều an toàn nghiệp vụ |
| KH/RF/FYP/KYC | Golden không đổi và xanh qua domain/DB/round-trip. D7/D10, soft-delete/restore có regression. D2 trên command bình thường được bảo vệ; C-001 trạng thái nhập vẫn phá giả định |
| Ngày/giờ/kỳ; #243/#245 | Fix PR #244/#246 giữ thời gian thật, pin ngày app khi cần, đọc clock một lần; test clock/date pass. B4/B5/B6 pass với ngày neo 15/09/2026; miền năm/future-date giữ KNOWN |
| Module | 0 lỗi dependency; domain không dựa app/db, file/IPC thuộc storage layer. Test tạm import view app từ DB chỉ dùng chẩn đoán, đã xóa; không thay kiến trúc repo |
| #202–#204/#210 | Đọc diff validator, failed-open/boundary/size limits/soft-deleted tests; có probe riêng, không suy coverage cao là đóng hết F-01 |
| A/B #214–#228; B6 #247 | Đối chiếu 16 ý Owner HANDOFF và phase-3-feedback.html. Nhãn/avatar/material, scope 14px, RE sorting/strip, TL header, màu/dải lịch/cột Ngày/year grid đúng các nhánh được test; dữ liệu nhân sự cũ còn C-002 |

## 4. Kiểm exe và bảng hành vi

**Chưa chạy/thao tác exe thật.** Computer use phiên này chỉ có browser; native computer APIs bị disable. Theo bước 5 của prompt, bỏ qua exe và ghi giới hạn. Hash artifact đã khớp, nhưng không thay thế kiểm ứng dụng. Bảng phân biệt rõ web/unit/code với các mục exe chưa làm.

| Mục | Exe | Bằng chứng khác đã có / giới hạn |
|---|---|---|
| Mở lần đầu, đo tới UI đầy đủ | Chưa thực hiện | Web seed-timing pass; không quy thành thời gian mở exe |
| Đóng/mở lại giữ dữ liệu | Chưa thực hiện | Unit queue/storage; web in-memory không chứng minh file DB giữ dữ liệu |
| Exe thứ hai cùng thư mục bị chặn | Chưa thực hiện | Đọc lock/share mode, Rust test; chưa mở hai process |
| A1: Tổng quan, bỏ hai ký tự tên, bỏ material dòng thời gian | Chưa thực hiện | Navigation/team/customer-KYC e2e pass, code nhãn đúng |
| A2: RE theo team rồi tên | Chưa thực hiện | Đọc scope/person options, unit/e2e RE pass; chưa quan sát dropdown native |
| A3: scope 14px, chỉ Khách hàng/Lịch hẹn | Chưa thực hiện | E2e đo 14px, segmented khác 12,5px, hidden scope giữ trạng thái |
| B1: TL header, Người hỗ trợ, chặn TL thứ hai | Chưa thực hiện | E2e header/Edit/+Thêm TL/chặn TL/support bỏ team pass; unit dữ liệu cũ C-002 |
| B2/B3: hàng RE Team dùng chung, đổi team/góc nhìn bỏ chọn | Chưa thực hiện | Unit scope/context và e2e Customers/Appointments share/narrow/toggle/clear pass |
| B4: ngày chọn gold, hôm nay viền xanh, dải Tuần/Tùy chọn vắt tháng | Chưa thực hiện | E2e computed CSS/custom band/tuần vắt tháng pass |
| B5: cột Ngày theo hôm nay/giữ màu khi hover | Chưa thực hiện | E2e past/today/future/hover, không tô ô Giờ pass |
| B6: 12 tháng/4 quý, click Tháng, ẩn Trong ngày | Chưa thực hiện | E2e 12 ô/4 quý/tổng khớp danh sách/click/ẩn pass, unit yearGrid pass |
| KH → lịch → kết quả đổi nhóm → KYC → HĐ | Chưa thực hiện | Unit/golden/e2e từng luồng pass; không giả đã chạy một chuỗi liên tục trên exe |
| Dời/hủy/xóa lịch, rollback nhóm | Chưa thực hiện | Unit D7/D10 và e2e outcome/reschedule/delete pass; C-001 ca import gắn transition đầu lỗi được tái hiện riêng |
| Export → sửa → import backup cũ | Chưa thực hiện | backup e2e đưa dữ liệu về bản export, unit round-trip pass; chưa kiểm folder cạnh exe |
| Nhập file hỏng | Chưa thực hiện | Unit scalar/invariants và e2e hộp từ chối pass; chưa bấm native dialog |

Trước G7, Owner/Claude cần ghi riêng kết quả exe còn thiếu trên artifact đã xác minh SHA; không đổi các ô Chưa thực hiện thành PASSED từ web.

## 5. Việc không làm được / giới hạn

- Không native computer use: không Explorer, hai process, mở/đóng/lưu thật, đĩa đầy/file khóa hoặc nhập/xuất exe. Không mở bản Downloads của anh, không chạm dữ liệu exe.
- Shell sandbox bị khóa tài khoản (`CreateProcessWithLogonW failed: 1909`). Có thời điểm dừng mở lệnh mới theo yêu cầu anh để e2e đã chạy hoàn tất; khi anh bảo thử lại, lệnh đọc chạy được. Một số lệnh dùng runtime được auto-review cho phép khi sandbox lỗi; không có auto-review rejection cần xin lại quyền.
- E2e hai lần phải dừng server thủ công; không xác định nguyên nhân teardown. Không test failed/flaky nhưng không tuyên bố teardown sạch.
- Cargo dùng cache/toolchain sẵn có theo chấp thuận “Cho phép dùng cache sẵn có” của anh. Output build/test thuộc worktree; không cài công cụ mới.
- Probe backup sửa JSON có chủ đích, giữ kiểu/SQL/schema hợp lệ. Chứng minh importer chưa bảo vệ đủ command; không chứng minh export bình thường tự tạo các ca C-001.
- Probe dùng sql.js trong bộ nhớ, không Rust IPC/native UI. Các bước UI ở CONFIRMED là đường code, không giả đã bấm.
- Không benchmark metrics mới, thử >100 MB lần nữa, đổi đồng hồ hệ thống, stress dữ liệu lớn hoặc nhận đã kiểm mọi combination ngày/kỳ.
- Không kiểm từng review comment khoảng 30 PR; ưu tiên diff/đường rủi ro. Có vài file được đọc ở đúng SHA bằng connector GitHub GET lúc shell khóa; không ghi Issue/PR/comment/workflow.
- Không đọc checkout cách ly/báo cáo Claude; chỉ báo cáo Codex lần 1 được yêu cầu và tài liệu worktree snapshot.

## 6. Nội dung test tái hiện tạm

Hai file đã lưu bản sao cạnh báo cáo và xóa khỏi worktree ngay sau chạy. Assertions mô tả hành vi hiện tại; 8 probe pass không phải tám lỗi mới và không sửa regression test của repo. Phụ lục A gồm 6 probe, RF/hash chủ động loại khỏi số lỗi; phụ lục B gồm 2 probe.

### Phụ lục A — backup-review.astra.test.ts

```ts
import { describe, expect, it } from 'vitest';
import { calendarDate, kycHash, periodOf, rfCount } from '@p2c/domain';
import { exportBackup, importBackup } from './backup';
import { createCustomer, getCustomer, listStageTransitions, updateCustomerProfile } from './customers';
import { listAppointments, recordMeetingOutcome, scheduleAppointment, softDeleteAppointment } from './appointments';
import { getKycProfile, markKycConflict, recordKycNote, resolveKycConflict } from './kyc';
import { listPeople, listTeams, updatePerson } from './team';
import { setup } from './test-support';
import { groupByTeam } from '../../../apps/desktop/src/routes/team/team-view';

const day = calendarDate(2026, 9, 10);
type Row = Record<string, unknown>;
type File = { tables: Record<string, Row[]> };
const read = (db: Parameters<typeof exportBackup>[0]) => JSON.parse(exportBackup(db)) as File;

describe('Astra: imported snapshots accepted but contradict command invariants', () => {
  it('accepts a deleted RE for a live customer; saving the profile then fails', async () => {
    const { db, re } = await setup();
    const customer = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N4', date: day });
    const file = read(db);
    file.tables.people!.find(p => p.id === re.id)!.deleted_at = '2026-09-26T08:00:00.000Z';
    const imported = await importBackup(JSON.stringify(file));
    expect(getCustomer(imported.db, customer.id)).toBeDefined();
    expect(listPeople(imported.db).some(p => p.id === re.id)).toBe(false);
    expect(() => updateCustomerProfile(imported.db, customer.id, { name: 'Lan sửa' })).toThrowError(expect.objectContaining({ code: 'PERSON_NOT_FOUND' }));
    imported.db.sqlite.close(); db.sqlite.close();
  });

  it('accepts two live TL of a team; one is hidden and neither name can be updated', async () => {
    const { db, tl, team } = await setup();
    const file = read(db);
    const original = file.tables.people!.find(p => p.id === tl.id)!;
    file.tables.people!.push({ ...original, id: 'astra-second-tl', name: 'Z TL thứ hai' });
    const imported = await importBackup(JSON.stringify(file));
    const people = listPeople(imported.db);
    const view = groupByTeam(listTeams(imported.db), people);
    const entry = view.teams.find(t => t.team.id === team.id)!;
    expect(entry.tl).toBe(2);
    expect(entry.lead!.id).toBe(tl.id);
    expect([...entry.reps, ...view.shared].some(p => p.id === 'astra-second-tl')).toBe(false);
    expect(() => updatePerson(imported.db, tl.id, { name: 'Hà sửa' })).toThrowError(expect.objectContaining({ code: 'TEAM_HAS_LEAD' }));
    expect(() => updatePerson(imported.db, 'astra-second-tl', { name: 'TL sửa' })).toThrowError(expect.objectContaining({ code: 'TEAM_HAS_LEAD' }));
    imported.db.sqlite.close(); db.sqlite.close();
  });

  it('accepts a creation transition attached to a meeting; deleting it fails at NOT NULL', async () => {
    const { db, re } = await setup();
    const customer = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N3', date: day });
    const a = scheduleAppointment(db, { customerId: customer.id, reId: re.id, date: day, triggerType: 'OTHER' });
    recordMeetingOutcome(db, a.id, { status: 'MET', stageAfter: 'N3', nextStep: 'Hẹn tiếp' });
    const file = read(db);
    file.tables.stage_transitions!.find(t => t.customer_id === customer.id)!.appointment_id = a.id;
    const imported = await importBackup(JSON.stringify(file));
    expect(() => softDeleteAppointment(imported.db, a.id)).toThrowError(/NOT NULL constraint failed: customers.stage/);
    expect(getCustomer(imported.db, customer.id)!.stage).toBe('N3');
    imported.db.sqlite.close(); db.sqlite.close();
  });

  it('accepts an RF transition relabelled manual; RF silently changes from one to zero', async () => {
    const { db, re } = await setup();
    const customer = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N3', date: day });
    const a = scheduleAppointment(db, { customerId: customer.id, reId: re.id, date: day, triggerType: 'OTHER' });
    recordMeetingOutcome(db, a.id, { status: 'MET', stageAfter: 'N2', nextStep: 'Hẹn tiếp' });
    const count = (database: typeof db) => rfCount({ people: listPeople(database), appointments: listAppointments(database), transitions: listStageTransitions(database) }, periodOf('month', day), { kind: 'all' });
    expect(count(db)).toBe(1);
    const file = read(db);
    file.tables.stage_transitions!.find(t => t.appointment_id === a.id)!.appointment_id = null;
    const imported = await importBackup(JSON.stringify(file));
    expect(count(imported.db)).toBe(0);
    expect(getCustomer(imported.db, customer.id)!.stage).toBe('N2');
    imported.db.sqlite.close(); db.sqlite.close();
  });

  it('accepts a wrong SYSTEM birth year while in conflict; resolving it breaks D2', async () => {
    const { db, re } = await setup();
    const customer = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N4', date: day, birthDate: { year: 1984 } });
    const { note } = recordKycNote(db, customer.id, { text: 'Năm sinh khác', date: day, facts: [] });
    markKycConflict(db, customer.id, { field: 'birthYear', value: 1985, noteId: note.id, date: day });
    const file = read(db);
    const system = file.tables.kyc_facts!.find(f => f.field === 'birthYear' && f.value_json === '1984')!;
    system.value_json = '1983';
    const imported = await importBackup(JSON.stringify(file));
    resolveKycConflict(imported.db, customer.id, { factId: system.id as string, date: day });
    expect(getCustomer(imported.db, customer.id)!.birthDate!.year).toBe(1984);
    expect(getKycProfile(imported.db, customer.id).facts.find(f => f.status === 'active')!.value).toBe(1983);
    await expect(importBackup(exportBackup(imported.db))).rejects.toMatchObject({ code: 'BACKUP_INVALID', params: { rule: 8 } });
    imported.db.sqlite.close(); db.sqlite.close();
  });

  it('accepts a stale latest KYC version hash', async () => {
    const { db, re } = await setup();
    const customer = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N4', date: day, birthDate: { year: 1984 } });
    const file = read(db);
    file.tables.kyc_versions!.at(-1)!.hash = 'astra-stale-hash';
    const imported = await importBackup(JSON.stringify(file));
    expect(imported.db.sqlite.exec('SELECT hash FROM kyc_versions')[0]!.values[0]![0]).toBe('astra-stale-hash');
    expect(kycHash(getKycProfile(imported.db, customer.id))).not.toBe('astra-stale-hash');
    imported.db.sqlite.close(); db.sqlite.close();
  });
});
```


### Phụ lục B — legacy-period-review.astra.test.ts

```ts
import { describe, expect, it } from 'vitest';
import { addDays, calendarDate, customPeriod, formatDate, parseDate, periodOf, shift } from '@p2c/domain';
import { createPerson, listPeople, listTeams } from './team';
import { setup } from './test-support';
import { groupByTeam } from '../../../apps/desktop/src/routes/team/team-view';

describe('Astra: known legacy staff and period boundaries', () => {
  it('keeps IS/BD/BDM with a team in the DB but shows none in the team or shared lists', async () => {
    const { db, team } = await setup();
    const staff = (['IS', 'BD', 'BDM'] as const).map(role =>
      createPerson(db, { name: `Support ${role}`, role, teamId: team.id }),
    );
    const people = listPeople(db);
    const view = groupByTeam(listTeams(db), people);
    const visibleIds = [
      ...view.shared.map(p => p.id),
      ...view.teams.flatMap(t => [...t.reps.map(p => p.id), ...(t.lead ? [t.lead.id] : [])]),
    ];
    for (const person of staff) {
      expect(people.some(p => p.id === person.id)).toBe(true);
      expect(visibleIds).not.toContain(person.id);
    }
    db.sqlite.close();
  });

  it('steps month/year below 1900 while day/week/custom throw, and creates a five-digit year', () => {
    const first = calendarDate(1900, 1, 1);
    expect(shift(periodOf('month', first), -1).start).toEqual({ year: 1899, month: 12, day: 1 });
    expect(shift(periodOf('year', first), -1).start.year).toBe(1899);
    expect(() => shift(periodOf('day', first), -1)).toThrowError(RangeError);
    expect(() => shift(periodOf('week', first), -1)).toThrowError(RangeError);
    expect(() => shift(customPeriod(first, first), -1)).toThrowError(RangeError);
    const next = addDays(calendarDate(9999, 12, 31), 1);
    expect(next.year).toBe(10000);
    expect(parseDate(formatDate(next))).toBeNull();
  });
});
```


## 7. Trạng thái cuối phiên

Kiểm tra lúc 2026-10-02T21:30:49.8101066+07:00. HEAD vẫn `5eb7c035e35c8e40539b1221a6f7d35f7606ebb0`, detached (`HEAD`). Tracked diff và staged diff rỗng; cả hai test tạm đã xóa khỏi worktree. Không commit/checkout hoặc chỉnh file đã track. Đầu phiên và cuối phiên đều chỉ có AGENTS.md untracked. Metadata: `final-worktree-check.json` cạnh báo cáo.

Lệnh `git status --short`, output nguyên văn:

```text
?? AGENTS.md
```

