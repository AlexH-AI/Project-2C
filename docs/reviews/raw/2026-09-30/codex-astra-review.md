# Review độc lập Project-2C — Phase 1–3

Ngày: 30/09/2026 · Reviewer: Codex · Chế độ: chỉ đọc, không subagent.

**Snapshot được đánh giá:** 0fa0eea40203a17c73ed9901c576963b9857f11d, detached HEAD tại C:\workspace\Project-2C-astra. Mọi đường dẫn source dưới đây tính từ checkout này; số dòng thuộc snapshot, trừ nơi ghi rõ là lịch sử PR. Bằng chứng GitHub chỉ từ AlexH-AI/Project-2C. Các thay đổi sau snapshot không được tính là code đã có.

## 1. Executive verdict

**CHƯA SẴN SÀNG (NOT READY) để đóng G7 Phase 3 ở snapshot này.** Cần sửa A-001, xác nhận kiểm tay bản exe cuối và hoàn tất hồ sơ #72. Có thể chuẩn bị đặc tả Phase 4; chưa nên coi dữ liệu nhập backup là nền đã được bảo đảm cho dashboard/AI.

- **A-001 — High, NEW:** nhập backup kiểm cấu trúc, kiểu SQL và FK, nhưng bỏ qua bất biến nghiệp vụ. Chỉ cần thay một chuỗi KYC trong JSON ngoài vẫn hợp lệ là có thể nhập thành công rồi lỗi khi mở hồ sơ; thay nhóm KH riêng lẻ làm nhóm hiện tại lệch lịch sử. Đây là đường vào công khai ở Cài đặt, không cần sửa DB trực tiếp.
- **A-002 — Medium, NEW:** đọc và xử lý toàn bộ file backup không có giới hạn dung lượng/số dòng/độ dài chuỗi. Nguy cơ treo UI hoặc hết bộ nhớ là plausible; chưa đo ngưỡng trên máy thật.
- **B-001 — Medium, KNOWN:** tính RF quét transitions lặp theo cuộc hẹn; chưa có bằng chứng chậm vượt ngưỡng hiện tại, nhưng cần xử lý trước dashboard nhiều kỳ/nhiều RE.
- **4 Low:** phản hồi khi chưa chọn kết quả cuộc hẹn, biên năm không nhất quán, coverage chỉ ép ngưỡng gộp, tài liệu trạng thái/quy trình lệch code.
- **CI tốt:** PR code cuối có 696 unit test, 90 e2e, 36 Rust test xanh. Domain 100% coverage; db 99,25% statements. Đây là bằng chứng CI đã đọc, không phải test chạy lại trong phiên này.
- **Bảo vệ dữ liệu đã cải thiện rõ:** persist tuần tự, chặn exe thứ hai, flush khi đóng, backup theo thứ tự ghi, claim riêng cho file xuất và đóng DB cũ đều hiện diện; các lỗi cũ tương ứng không bị đếm lại.
- **Nghiệp vụ chính đáng tin cậy khi đi qua command:** golden G01–G22/K01–K15 được đưa qua DB; D7/D10, KYC SYSTEM/append-only, issued FYP và xóa mềm có assertion thực chất.
- **Mẫu 17 PR:** 17/17 có các job CI áp dụng thành công trước merge. 14/17 nằm trong ngưỡng diff theo cách đếm của audit; 16/17 có comment PASS trước merge; 13/17 ghi rõ PASS ở head cuối, các PR còn lại có hạn chế bằng chứng.
- **Phát hành cuối chưa đủ hồ sơ:** #196 ghi rõ Owner chưa kiểm tay exe ở thời điểm review; không thấy xác nhận bổ sung trong comments đã đọc. Kiểm tay #96/#125/#185 là bằng chứng có giá trị nhưng không thay thế kiểm lại build cuối sau chuỗi sửa lưu trữ.
- Không thấy lỗi Critical có đủ bằng chứng; không khẳng định mất dữ liệu vĩnh viễn, RCE, SQL injection hay path traversal. Không sửa source, fixture, test, ADR, nhãn, Issue hoặc PR.

### Số phát hiện còn tồn tại

| Severity | NEW | KNOWN | Tổng |
|---|---:|---:|---:|
| Critical | 0 | 0 | 0 |
| High | 1 | 0 | 1 |
| Medium | 1 | 1 | 2 |
| Low | 1 | 3 | 4 |
| Nit | 0 | 0 | 0 |
| **Tổng** | **3** | **4** | **7** |

CONFIRMED nghĩa là có đường đi và điều kiện được xác nhận bằng đọc source/spec; không đồng nghĩa đã chạy tái hiện. PLAUSIBLE chỉ rủi ro có cơ sở nhưng tác động chưa đo. Ghi chú nợ kỹ thuật/đề xuất ở mục 8–9 không được cộng thêm vào bảng.

## 2. Trạng thái repo, CI và bằng chứng

| Hạng mục | Bằng chứng | Kết quả / giới hạn |
|---|---|---|
| HEAD review | git rev-parse HEAD; detached tại 0fa0eea40203a17c73ed9901c576963b9857f11d | Đúng snapshot Owner chỉ định |
| Working tree đầu phiên | git status --short | Có sẵn ba mục untracked: .agents/, .codex/, AGENTS.md. Không xóa hoặc sửa |
| Code so với bản main build | git diff 724794a02e1c22999d67accee510277c86c13abb..0fa0eea… | Chỉ docs/PROJECT-STATE.md và docs/state/HANDOFF.md thay đổi; code/config/test giống nhau |
| CI đúng SHA snapshot | API actions/runs?head_sha=0fa0eea… | 0 run; phù hợp docs-only paths-ignore, không coi là CI thất bại |
| CI PR #196 | [Run 36685673382](https://github.com/AlexH-AI/Project-2C/actions/runs/36685673382), head b0b80b3 | Verify kết thúc 07:54:44 UTC; Build 07:58:53; merge 08:05:10 ngày 30/09 |
| Unit | Log Verify của run trên | 45 file / 696 test; duration 59,69 giây |
| E2E | Log run trên | 90 passed, 5,6 phút; browser web/Microsoft Edge, không phải WebView2 native |
| Rust | Log Build run trên | 36 passed; fmt/clippy thành công; unit khoảng 1,88 giây |
| Build main | [Run 36687528115](https://github.com/AlexH-AI/Project-2C/actions/runs/36687528115), SHA 724794a… | Build portable exe SUCCESS, 08:05:16–08:09:42 UTC; Verify SKIPPED đúng chính sách main |
| Artifact | Workflow upload-artifact của main | Build job thành công, path exe cấu hình đúng; không tải/chạy artifact trong audit |
| Issue còn mở | gh issue list tại thời điểm audit | Chỉ [#72 — T-053](https://github.com/AlexH-AI/Project-2C/issues/72), gate đóng Phase 3 |
| Lệnh tại máy | Chỉ đọc file/Git/GitHub | Không chạy pnpm verify, unit, e2e, cargo, build, install hoặc dev server |

### Coverage lấy từ CI, không suy từ số test

| Vùng | Statements | Branches | Functions | Lines |
|---|---:|---:|---:|---:|
| packages/domain/src | 100% | 100% | 100% | 100% |
| packages/db/src | 99,25% | 97,90% | 100% | 99,68% |
| Tổng vùng cấu hình | 99,45% | 98,56% | 100% | 99,76% |
| backup.ts | 100% | 100% | 100% | 100% |

Coverage không chứng minh bất biến nhập liệu được kiểm. A-001 vẫn tồn tại dù backup.ts đạt 100%. Coverage trong vitest.config.ts chỉ gồm domain/db, không phải toàn React/Rust.

**Hiệu năng có bằng chứng:** e2e chart dispose sau 10 lần đổi màn khoảng 11,2 giây trong run cuối; test budget chart bundle 250 KB xanh. Đây là thời gian test/chuyển màn tổng, không phải latency một phép tính RF. Seed timing test dùng performance measure: ngưỡng local 5 giây, CI **15 giây** theo quyết định Owner ghi ở [PR #96](https://github.com/AlexH-AI/Project-2C/pull/96). Không dùng duration test khoảng 7,1 giây để kết luận seed mất 7,1 giây; log tóm tắt không cung cấp riêng số đo seed.


## 3. Phát hiện chi tiết, xếp theo mức độ

### A-001 — High · CONFIRMED (static) · NEW — Backup vượt qua kiểm tra nhưng vi phạm bất biến nghiệp vụ

**Trục:** lưu trữ/toàn vẹn dữ liệu, nghiệp vụ, kiểm thử. **Công sức:** L, nên tách hai task nhỏ ở mục 10.

**File:dòng:** [packages/db/src/backup.ts:32](C:/workspace/Project-2C-astra/packages/db/src/backup.ts:32), :69, :126, :148, :183; packages/db/src/schema.ts:169 và :251; [packages/db/src/kyc.ts:488](C:/workspace/Project-2C-astra/packages/db/src/kyc.ts:488); apps/desktop/src/data/app-data.ts:251 và :276; apps/desktop/src/routes/customers/CustomerProfile.tsx:41 và :88.

**Quy tắc:** spec Phase 3 §3.4/§3.9/§4/§8; D2/D10; hợp đồng Customer.stage luôn bằng transition mới nhất; KYC có kiểu và nguồn đúng KH; [#71](https://github.com/AlexH-AI/Project-2C/issues/71) từ chối file hỏng/sai định dạng, không đổi dữ liệu hiện tại.

**Mô tả và bằng chứng:**

1. Zod chỉ định nghĩa envelope; mỗi ô của bảng là unknown. valueOf chỉ xác nhận INTEGER an toàn hoặc TEXT là string.
2. Loader INSERT trực tiếp, sau đó foreign_key_check. Không gọi các validator nghiệp vụ hoặc kiểm toàn vẹn giữa các bảng.
3. value_json là TEXT NOT NULL; không có CHECK json_valid hay schema giá trị theo trường. note_id chỉ FK tới một ghi chú tồn tại, không kiểm cùng customer.
4. readBackup chỉ countRecords cho team, nhân sự, KH, hẹn, HĐ; không đọc KYC và không kiểm nhóm/lịch sử.
5. getKycProfile dùng JSON.parse(row.valueJson) as KycValue. Type assertion không kiểm runtime. readProfile gọi trực tiếp khi render hồ sơ.
6. customers.stage và stage_transitions có enum/FK riêng nhưng không ràng buộc hai biểu diễn phải đồng nhất. UI còn giả định mỗi KH có ít nhất một transition.

**Kịch bản cụ thể, suy diễn trực tiếp từ source, chưa thực thi:**

- Xuất một backup seed hợp lệ; chỉ đổi value_json của một fact thành chuỗi **not-json**. JSON ngoài vẫn hợp lệ, kiểu ô vẫn TEXT, FK không thay đổi.
- Nhập qua Cài đặt. Preview có thể hoàn tất, người dùng xác nhận, DB được thay và lưu.
- Mở hồ sơ của KH có fact đó: JSON.parse ném SyntaxError. App không có error boundary quanh hồ sơ trong App/main đã đọc, nên lỗi render không được chuyển thành thông báo “backup không hợp lệ”.
- Biến thể độc lập: đổi customers.stage từ N3 sang N1 nhưng giữ history kết thúc N3. Loader nhận cả hai enum hợp lệ; màn KH đọc N1 trong khi stageOn đọc lịch sử N3. Tương tự, đổi note_id sang ghi chú của KH khác vẫn có FK hợp lệ.
- Các biến thể trên không cần vượt quyền hệ điều hành hoặc gọi API nội bộ. Đây là khả năng nhập file hỏng/chỉnh tay qua chức năng có sẵn, không phải khẳng định backup do bản hiện tại tự xuất thường xuyên bị hỏng.

**Tác động và giới hạn:** lỗi màn hồ sơ, provenance KYC sai, dữ liệu cho dashboard/AI không đáng tin. Không xếp Critical vì đường nhập có xác nhận, DB trước đó được backup trong exe, và không có bằng chứng mất vĩnh viễn. Web vốn không bền vững theo ADR; đó không phải lỗi mới.

**Đề xuất sửa:**

- Validator cho snapshot sau nạp/migrate nhưng trước trả preview và trước bất kỳ persist thay DB nào.
- Kiểm giá trị theo field KYC, ngày/seq/phạm vi số và quy tắc nullable; giữ nguyên giá trị, không “sửa hộ” âm thầm.
- Kiểm bất biến liên bảng: KH có initial/live transition; stage hiện tại = latest live; ngày không giảm; chain/from hợp lệ; transition gắn đúng cuộc hẹn/KH; fact và note cùng KH; D2 cùng hồ sơ; active/conflict hợp lệ.
- Phân biệt dữ liệu sai với lỗi engine; trả BACKUP_INVALID có nguyên nhân nội bộ đủ chẩn đoán, UI qua i18n.
- Không replay toàn bộ lịch sử qua command hiện tại nếu việc đó đổi seq/hash/ID hoặc biến semantic cũ; cần validator đọc thuần, hỗ trợ schema sau migrate.

**Test cần bổ sung:** từng file sửa một ô như trên bị từ chối; current export/bytes, callbacks persist/changed không đổi; không backup/thay DB sau rejection; seed round-trip byte-identical vẫn xanh; old-schema migrate rồi validate; file hợp lệ có bản ghi xóa mềm vẫn nhận. Thêm e2e nhập KYC hỏng rồi mở hồ sơ hiện tại còn dùng được.

### A-002 — Medium · PLAUSIBLE · NEW — Nhập backup không có giới hạn tài nguyên

**Trục:** an toàn input, hiệu năng. **Công sức:** M.

**File:dòng:** [apps/desktop/src/routes/SettingsBackup.tsx:62–67](C:/workspace/Project-2C-astra/apps/desktop/src/routes/SettingsBackup.tsx:62); packages/db/src/backup.ts:32, :110–121, :139; apps/desktop/src/data/app-data.ts:251.

**Quy tắc:** yêu cầu audit kiểm file nhập, chuỗi dài/JSON lớn; tính ổn định đường nhập Phase 3 §6.

**Bằng chứng:** file.text() đọc hết file trước khi gọi parser. JSON.parse tạo cây đầy đủ; safeParse kiểm/copy cấu trúc; vòng lặp INSERT chạy đồng bộ trên thread JS. Không thấy cap file.size, độ dài text, số row hoặc độ dài ô. Các bước dựng staging, export và mở lại tiếp tục tạo bản sao dữ liệu.

**Kịch bản:** chọn nhầm file JSON rất lớn hoặc backup chứa nhiều ghi chú dài. UI có thể ngừng đáp ứng trong lúc parse/insert hoặc hết bộ nhớ trước khi hiện lỗi. Không cần file hợp lệ SQL mới gây chi phí parse. Không khẳng định mức MB cụ thể hay mất dữ liệu đã lưu vì chưa benchmark/stress test.

**Đề xuất:** kiểm file.size trước file.text; giới hạn text ở API để tránh chỉ bảo vệ UI; cap tổng row và độ dài ô theo hợp đồng được Owner chọn; lỗi riêng qua i18n; dùng worker/chunk chỉ khi measurement chứng minh cần, không thêm dependency mặc định.

**Test:** file vượt size bị từ chối trước khi đọc; bypass UI vẫn bị cap; chuỗi quá dài/nhiều row bị reject; dữ liệu hiện tại/persist không đổi; seed hợp lệ và backup lớn nhất được chấp nhận không bị chặn nhầm. Stress benchmark ở task sửa, không chạy trong review này.

### B-001 — Medium · CONFIRMED về thuật toán, tác động latency PLAUSIBLE · KNOWN — RF chưa phù hợp dashboard nhiều kỳ/scope

**Trục:** hiệu năng, sẵn sàng Phase 4. **Công sức:** M.

**File:dòng:** [packages/domain/src/stats.ts:26](C:/workspace/Project-2C-astra/packages/domain/src/stats.ts:26), :62–88, :114. Nguồn đã biết: [R3 #103](https://github.com/AlexH-AI/Project-2C/issues/103); HANDOFF ghi thêm quét people trong appointments-view.

**Quy tắc:** PROJECT-PLAN Phase 4 có dashboard/team/RE/nhiều kỳ; spec §4 cho phép tính trong bộ nhớ ở quy mô demo, không hứa thuật toán hiện tại dùng vô hạn.

**Bằng chứng:** rfCount lọc kỳ và scope rồi mỗi appointment MET còn lại gọi transitions.some; scope team gọi people.some cho từng record. Chi phí xấu nhất O(A_phù_hợp × T), cộng chi phí scope, lặp lại nếu tính từng kỳ/RE. Không dùng A tổng × T làm số thao tác thực tế vì short-circuit lọc trước.

**Kịch bản:** dashboard tính 12 tháng × 30 RE trên bộ seed ~6.000 cuộc hẹn và toàn history. Cùng quan hệ appointment→transition được tìm lại nhiều lần. Đây là nợ mở rộng đã biết, chưa có benchmark chứng minh UI hiện tại vượt budget.

**Sửa:** dựng Map/Set theo appointmentId và people.id một lần cho snapshot/revision; phép tính vẫn dựa trên ngày hẹn, RE trên record và team hiện tại. Không dùng customer.stage hiện tại để suy RF.

**Test:** golden G01–G22 giữ nguyên; manual stage không thành RF; mỗi cuộc tối đa một RF; deleted records giữ semantics repository; benchmark cùng snapshot/scopes trước-sau, ghi máy và budget. Nên làm trước khi nhân số thẻ dashboard, không phải lý do độc lập chặn G7 Phase 3.

### A-003 — Low · CONFIRMED (static) · KNOWN — Lưu kết quả khi chưa chọn trạng thái không phản hồi

**Trục:** nghiệp vụ/UI, kiểm thử. **Công sức:** S.

**File:dòng:** [apps/desktop/src/routes/appointments/OutcomeDialog.tsx:55–57](C:/workspace/Project-2C-astra/apps/desktop/src/routes/appointments/OutcomeDialog.tsx:55), :81. Nguồn: HANDOFF ghi chú #169.

**Quy tắc:** mockup 6c–6i đánh dấu trạng thái bắt buộc; form cần chỉ rõ input còn thiếu.

**Bằng chứng/kịch bản:** mở Ghi kết quả cho lịch tương lai; MET bị disable nên status khởi tạo null. Bấm nút Lưu kết quả hoặc Enter → save return ngay, không setErrors/failure. Không lưu sai dữ liệu, nhưng người dùng không biết cần chọn Dời lịch/Hủy.

**Sửa:** lỗi trạng thái qua i18n gắn cạnh nhóm lựa chọn, clear khi chọn; hoặc disable submit có giải thích truy cập được. Không tự chọn một kết quả có tác dụng nghiệp vụ.

**Test:** e2e lịch tương lai, click và Enter khi chưa chọn đều có thông báo, không thay DB; chọn Hủy hoặc Dời lịch rồi xử lý bình thường.

### B-002 — Low · CONFIRMED (static) · KNOWN — Miền năm và thao tác chuyển kỳ không nhất quán

**Trục:** domain/ngày, sẵn sàng Phase 4. **Công sức:** M.

**File:dòng:** [packages/domain/src/period.ts:41](C:/workspace/Project-2C-astra/packages/domain/src/period.ts:41), :57, :180, :215; packages/db/src/common.ts:31. Nguồn: R1/R3, HANDOFF #146.

**Quy tắc:** CalendarDate phải là ngày hợp lệ; parse/format/shift dùng chung luật trong domain.

**Bằng chứng/kịch bản:** calendarDate không có MAX_YEAR; năm 10000 có thể được tạo ở API nhưng parser ngày chỉ nhận năm bốn chữ số. shift của month/year dựng ngày trực tiếp nên lùi năm 1900 về 1899, trong khi calendarDate từ chối. day/week/custom đã có addDays chặn dưới MIN_YEAR nên hành vi khác. addDays số nguyên cực lớn có thể tạo Date invalid nhưng chưa có đường gọi UI thực tế tới giá trị đó.

**Giới hạn:** không gán High cho input khó gặp; UI không cho gõ năm 10000. Biên 1900 có thể tới qua chọn kỳ và bấm lùi; phát sinh inconsistency/RangeError chứ chưa chứng minh ghi hỏng dữ liệu bình thường.

**Sửa:** quyết định một miền năm dùng chung, validate kết quả số học và period; PeriodPicker disable hướng vượt miền hoặc hiện lỗi rõ. ISO codec trong DB sử dụng cùng miền. Không tự áp năm tối đa nếu Owner muốn phạm vi khác.

**Test:** MIN_YEAR, MAX_YEAR, leap day, tuần băng năm, shift từng kind ở hai biên, addDays overflow, parse(format(date)) round-trip trong miền.

### B-003 — Low · CONFIRMED (cấu hình) · NEW — Coverage gate không ép riêng ngưỡng domain/db

**Trục:** kiểm thử/quy trình. **Công sức:** S.

**File:dòng:** [vitest.config.ts:7–15](C:/workspace/Project-2C-astra/vitest.config.ts:7); docs/process/REVIEW-CHECKLIST.md §2; Issue #60; PROJECT-PLAN §4.

**Quy tắc:** domain ≥95%, db ≥90% theo yêu cầu dự án. Thực tế hiện tại đều đạt.

**Bằng chứng/kịch bản:** cấu hình include cả hai package nhưng thresholds 95 áp vào tập gộp. Khi db lớn và phủ cao, domain có thể tụt dưới 95 mà aggregate vẫn ≥95; hoặc chiều ngược lại với ngưỡng db. 100% branch backup không chứng minh dữ liệu bất hợp lệ bị chặn như A-001.

**Sửa:** ép ngưỡng theo package/glob bằng khả năng của Vitest phiên bản ghim hoặc đọc coverage summary và kiểm riêng. Không hạ test/golden để làm xanh; không cần nâng dependency.

**Test/xác nhận:** báo cáo CI hiển thị riêng hai vùng và check thất bại khi một vùng dưới ngưỡng, kể cả tổng vẫn đạt. Có thể xác nhận cơ chế bằng fixture summary nhỏ; không cần mutation test toàn repo. Ghi rõ coverage UI/Rust vẫn đo theo cách khác.

### B-004 — Low · CONFIRMED · KNOWN — Tài liệu hiện trạng và handoff còn thông tin đã lỗi thời

**Trục:** quy trình/tài liệu. **Công sức:** S.

**File:dòng:** [docs/PROJECT-STATE.md:5](C:/workspace/Project-2C-astra/docs/PROJECT-STATE.md:5), :9, :53–58; docs/PROJECT-PLAN.md:127, :223, :241, :291–302; docs/design/phase-3-du-lieu.md:192, :229; docs/metrics/phase-1.md:22; docs/state/HANDOFF.md ghi chú #183–#192.

**Quy tắc:** GitHub là nguồn thật; người bắt đầu phiên phải nhận đúng trạng thái và lệnh cần chạy.

**Bằng chứng/kịch bản:** đầu STATE nói Phase 1 còn mở và repo private, cuối file nói đã đóng/public; PLAN còn adapter Tauri SQLite và CI build mọi PR; spec backup tên timestamp không phản ánh sequence; handoff còn formatCount ở money dù đã tách. Phiên sau có thể làm lại việc đã xong hoặc quên e2e vì sơ đồ nói pnpm verify gồm e2e.

**Sửa:** cập nhật phần “hiện tại”, đưa lịch sử vào khối có ngày; ledger known phải phân biệt OPEN/RESOLVED/ACCEPTED. Giữ ADR lịch sử và thêm liên kết superseded thay vì viết lại quyết định cũ. Không đổi kế hoạch/gate bằng task docs một cách ngầm định.

**Xác nhận:** đối chiếu các dòng ở mục 7 với scripts, workflow, #72 và source; docs-only PR không cần chạy CI theo chính sách hiện hành. Đây là drift đã được gợi ý/ghi nhận trước, không quảng cáo thành lỗi mới.


## 4. Đánh giá tám trục

Điểm là đánh giá kỹ thuật có trọng số rủi ro, không phải phần trăm test pass.

| Trục | Điểm /10 | Đã tốt | Khoảng trống đáng chú ý |
|---|---:|---|---|
| 1. Lưu trữ/toàn vẹn | 7 | Atomic file write, queue, backup, lock, staging migrate, rollback | A-001; replace/generation có các giả định vòng đời đã biết |
| 2. Nghiệp vụ | 8 | Golden qua DB; D2/D7/D10; RF/FYP/KYC đúng đường command | Import bỏ command invariants; A-003; biên ngày B-002 |
| 3. An toàn/bảo mật | 8 | SQL có tham số, tên bảng whitelist, React escape, CSP hẹp, Rust nhận kind | A-002; dữ liệu local plaintext theo thiết kế; chưa audit CVE |
| 4. Kiến trúc/chất lượng | 8 | Domain thuần, ranh giới module, storage port, command/repository tách | Một số helper ngày/giờ nằm ngoài domain; raw sqlite handle vẫn public |
| 5. Kiểm thử | 8 | CI Windows, 696+90+36, golden/assertion rollback mạnh | A-001/A-002 thiếu ca; B-003; native wiring không nằm trong web e2e |
| 6. Hiệu năng | 7 | Prepared statements, bỏ N+1 coordinator, seed batch, ECharts dispose | B-001; import nguyên file; table render mọi row |
| 7. Quy trình/tài liệu | 7 | 17/17 CI trước merge, review theo risk, Owner exceptions có dấu vết | Diff lớn, review cổ thiếu exact-head/clean-context, B-004, G7 chưa đóng |
| 8. Sẵn sàng Phase 4–6 | 7 | Domain dùng lại, KYC versions, .p2cbackup có schema, tiền/ngày chung | Validator snapshot, index metrics, MTD; AI/sync cần hợp đồng mới |

### 4.1 Lưu trữ: đường đi và failure modes

- database.transaction có BEGIN/COMMIT và savepoint khi lồng; outer commit mới persist. Có test rollback không persist và nested rollback. Sau sqlite.export, code bật lại foreign_keys; đây là chi tiết đúng và đã được test.
- migrate chạy pending migrations trong transaction. Schema mới hơn app bị chặn trước migrate/persist. Các migration 0000–0004 đã được đọc; 0004 dùng ALTER ADD giữ nguyên dữ liệu/FK, không áp nguyên SQL tái tạo bảng sai do generator sinh.
- Lịch sử có sửa migration trong giai đoạn xây dựng. Không đủ bằng chứng “migration đã phát hành bị sửa hậu kiểm” để kết luận data-loss bug. Từ đây cần giữ migration đã dùng ở bản exe thực tế bất biến.
- Persist queue giữ một write đang chạy, coalesce bản chờ, giữ bản mới nhất sau lỗi, flush/retry. Test có cả write ném đồng bộ và Promise reject. Lỗi persist sau COMMIT nghĩa dữ liệu trong RAM đã đổi; cảnh báo/CloseGuard là cơ chế dự kiến, không coi COMMIT cần rollback khi đĩa lỗi.
- Rust ghi .tmp, sync_all, rename, dọn khi lỗi; atomic replace không tự chứng minh durability dưới mọi kiểu mất điện/hỏng phần cứng. Audit không thử cắt nguồn.
- DataLock lấy trước dọn/read/backup; share_mode(0) trên Windows, handle sống trong process; lần mở sau cùng process không tự khóa mình.
- Backup mới theo sequence, không theo mtime/stamp. Giữ tối đa 10 theo best effort, tránh xóa bản vừa ghi, deduplicate bytes; locked file có thể làm số lượng/retention khác trường hợp lý tưởng. Test clock lùi, tên cũ/mới, file lạ, lock đã có.
- Export .claim + .tmp đảm bảo các lần xuất của app không tranh tên; startup chỉ dọn interrupted exports lần lấy khóa đầu. #191 bảo đảm cleanup vẫn xảy ra khi xóa DB tmp lỗi. Race với chương trình ngoài tạo đích trước rename là rủi ro Owner đã chấp nhận ở #189, không tính NEW.
- DB cũ được close sau changed và nhường một tick; test reload/import close và failure giữ DB cũ đã có. Không kết luận leak cũ còn nguyên.
- **Known chưa xử lý nhưng chưa chứng minh đường UI hiện tại:** write muộn trong khoảng chờ backup; generation tăng trước openDatabase resolve; hai replace chạy chồng nhau. Modal/nút hiện tại hạn chế thao tác cạnh tranh và Owner đã đồng ý bỏ concurrent replace trong #189. Cần transaction/lifecycle barrier trước khi thêm autosave hoặc sync async Phase 6.
- CloseGuard gọi preventDefault, flush, hỏi retry/discard, destroy; finally trả closing=false đã sửa. Unit kiểm logic thuần, kiểm tay #125 đã có; mount/unmount/listener Promise/StrictMode integration chưa có test riêng. Không dựng lại lỗi closing flag đã hết.

### 4.2 Nghiệp vụ và vàng

- Chuyển mở tự do N4–N1; KH đóng chỉ mở lại N3; tạo ở nhóm đóng bị chặn. Manual transition không có appointmentId nên không thành RF.
- RF: MET và N4/N3→N2/N1, mỗi appointment tối đa một; theo ngày hẹn và RE trên hẹn. Policy metrics dùng ngày nộp/ngày phát hành riêng, revenue dùng issued FYP; closeRate issued/RF cùng kỳ, RF=0 trả null, có thể >100% theo G2.
- D7: transition cũ hơn latest khóa status/day/stage, vẫn sửa next step/note/case size/trigger/coordinator/reviewer; sửa/xóa latest hoàn tác nhóm. D10 chặn ngày lùi qua cả manual, outcome và restore.
- Soft-delete loại KH và con khỏi repository/chỉ số; restore kiểm lại người phụ trách/coordinator/reviewer. UI Thùng rác ngoài Phase 3, không phải thiếu scope.
- KYC notes append-only có trigger SQL; facts kiểm kiểu/nguồn ở command, “latest” theo seq; profile sinh SYSTEM facts cho birthYear/gender; không đổi hash thì không tăng version; core change hoặc bật tay → material. Cổng ưu tiên conflict cốt lõi trước insufficient; K09 và giá trị false/0 đúng golden.
- G01–G22/K01–K15 có vòng it.each, không chỉ import fixture mà không dùng. DB golden kiểm cả dữ kiện/nhóm/RF rồi kết quả engine. Git log các fixture/golden chỉ hiện commit tạo #34/#35 trong lịch sử đọc được; không thấy sửa kết quả mong đợi để qua test.
- Các golden không đi qua “backup bị sửa một ô”; vì thế không bảo vệ A-001.
- MTD chưa có API chuyên biệt; G18 dựng customPeriod. Đây là nợ Phase 4 đã biết, không ép thêm feature vào Phase 3.

### 4.3 An toàn input, IPC và dependency

| Bề mặt | Nhận định |
|---|---|
| SQL injection | Giá trị INSERT là placeholders; bảng/cột lấy từ schema và phải cùng tập với file; quote escape identifier. Không thấy đường chèn SQL từ ghi chú/tên KH |
| XSS | UI hiển thị chuỗi qua React text; scan production không thấy dangerouslySetInnerHTML/innerHTML/eval/new Function. Chart hiện không đưa ghi chú/KYC nhập tùy ý vào HTML tooltip. Không khẳng định mọi feature tương lai miễn XSS |
| Tên file xuất | Chỉ ASCII chữ/số/dấu . _ -, có đuôi .p2cbackup; slash/backslash/colon bị chặn. Không thấy traversal thoát exports |
| Mở thư mục | Webview chỉ gửi exports/backups; Rust tự dựng path. #196 luôn quote đường dẫn khi gọi Explorer; test dấu phẩy/khoảng trắng có. Chưa chạy Explorer trong audit |
| CSP | default-src self; script self + wasm-unsafe-eval; style unsafe-inline; connect self, ipc, ipc.localhost. Không có wildcard remote network cho AI ở Phase 3 |
| Capability | main window dùng core:default và core:window:allow-destroy; không thêm plugin filesystem/shell tổng quát. Lệnh Rust custom là bề mặt có quyền, cần giữ validation khi mở rộng |
| Secret/log | Scan tên file tracked theo mẫu private key/token thông dụng không có hit; không thấy console.log dữ liệu trong production đã rà. Đây không phải secret scanner đầy đủ và không đọc user config/env ngoài repo |
| Dữ liệu local | DB/backup chứa KYC plaintext theo thiết kế portable; không coi thiếu mã hóa là lỗi Phase 3 khi chưa có yêu cầu. Phase 5–6 phải chốt G6 trước key/sync |
| Supply chain | Lockfile và frozen install; workflow token contents/read, pull-requests/read, không pull_request_target. Actions còn pin tag version thay vì SHA — đề xuất gia cố, không có bằng chứng compromise |
| Input lớn | A-002; SQL/Zod structural validity không thay resource limits |

**Dependency thực tế và G4:** chưa thấy thư viện chức năng mới ngoài stack được duyệt ADR-0005/0014/0016. Package types/lint/test là phần hỗ trợ; không suy diễn mỗi helper dev dependency là vi phạm G4 nếu ADR không liệt kê từng gói.

| Nơi | Dependencies đọc từ manifest |
|---|---|
| domain | Không dependency runtime |
| db | @p2c/domain workspace; drizzle-orm 0.45.3; sql.js 1.14.2; zod 4.6.5; dev drizzle-kit 0.31.11, @types/sql.js 1.4.11 |
| ui | @p2c/domain; @tanstack/react-table 9.2.4; echarts 6.1.0; react peer 19.3.0; react/types dev |
| desktop | @p2c/db/domain/ui; @tauri-apps/api 2.11.1; react/react-dom 19.3.0; sql.js 1.14.2 |
| desktop dev | @tailwindcss/vite/tailwindcss 4.3.3; @tauri-apps/cli 2.11.5; @types/react/react-dom 19.3.0; @vitejs/plugin-react 6.1.1; TypeScript 6.0.3; Vite 8.3.1 |
| root dev | @eslint/js 10.0.1; @playwright/test 1.63.0; @types/node 26.6.2; @vitest/coverage-v8/vitest 5.0.1; dependency-cruiser 18.4.0; eslint 10.11.0; eslint-plugin-react-hooks 7.1.1; globals 17.12.0; prettier 3.9.9; TypeScript 6.0.3; typescript-eslint 8.70.1 |
| Cargo | tauri 2, tauri-build 2; lớp storage chỉ std, không crate/plugin mới |

Không tra CVE/advisory hay registry ngoài repo vì giới hạn nguồn. Các version trên là inventory của snapshot, không phải khuyến nghị cập nhật hoặc xác nhận an toàn hiện hành.

### 4.4 Kiến trúc, UI và scripts

- .dependency-cruiser.cjs bảo vệ domain thuần, packages không phụ thuộc apps, db/ai chỉ phụ thuộc domain trong workspace, ui không tới db/ai; có no-circular và unresolved. CI lint:deps xanh. Không thấy ORM/raw SQL trong route UI; app-data dùng raw close cho lifecycle là coupling có chủ đích.
- Tiền phần lớn đi qua domain. ISO adapter đặt tập trung ở db/common; còn parseTime ở appointment-form, phép ngày seed và padStart lịch ở UI là nợ gom helper. Không cần mở một refactor rộng khi chưa đổi hành vi.
- UI labels/errors qua i18n, tokens dùng chung; vẫn có dấu phân cách/ghép ngày giờ viết tại component theo các ghi chú cũ. Chuỗi câu hỏi KYC và thông điệp insufficient ở domain là nội dung golden Owner đã chốt; không tùy tiện dịch/chuyển rồi đổi golden.
- Mockup được đối chiếu ở mức source/nhãn/trạng thái, **không render để chấm pixel, AA hoặc responsive**. AI panel, Excel, KPI/MTD, cây drill-down đầy đủ thuộc phase sau. Quyết định giữ ô Giờ 6f, không hỏi lý do hạ nhóm và chưa xóa lịch RESCHEDULED được tôn trọng.
- DataTable sort và chart lifecycle đã có e2e. Table chưa virtualize; chỉ nên đổi sau measurement, không thêm dependency vì dự đoán.
- Scripts PowerShell đã được đọc ở phạm vi repo. Các lỗi session-start/bootstrap R4 cũ không được báo lại như hiện tại. session-end git add -A vẫn là known hazard khi nhiều phiên chung checkout; HANDOFF đã nhắc pathspec. Audit không chạy bất kỳ script nào.
- Hook local không thay server protection; workflow main bỏ Verify là quyết định tiết kiệm phút, nên CI-before-merge phải tiếp tục được kiểm ở PR. Không đề xuất bật auto-merge hoặc đổi gate qua review này.


## 5. Mẫu quy trình PR — 17 PR

**Cách đếm:** P = additions + deletions của source .ts/.tsx/.rs (gồm type/comment/i18n), bỏ test .test/.spec và khối Rust cfg(test); T = toàn diff trừ file sinh tự động/lockfile. Không dùng “net lines”. Migration 0004 viết tay tính vào P/T; snapshot Drizzle không tính. Số P có thể lớn hơn ước lượng trong review cũ vì cách đếm này không loại comment/interface. Mốc khoảng 400/800 dùng để nhận biết cần tách task, không tự kết luận Owner vi phạm nếu đã có ngoại lệ.

“Review” chỉ xác nhận hồ sơ comment trước merge; không thể chứng minh context nội bộ reviewer sạch chỉ từ GitHub. Thời gian CI trong bảng là thời điểm job áp dụng cuối cùng kết thúc, UTC, tất cả trước mergedAt. PR xếp chồng tham chiếu cùng Issue là hợp lệ, không yêu cầu mỗi phần đóng Issue.

| PR / Issue | Risk nhãn → mức review | P / T | File ngoài literal scope | Review trước merge | CI xong → merge (UTC) | build-exe |
|---|---|---:|---|---|---|---|
| [#74](https://github.com/AlexH-AI/Project-2C/pull/74) / #60 | med → checklist thời điểm đó | 485 / 943 | pnpm-workspace.yaml; reviewer ghi chấp nhận, chưa thấy Owner riêng | PASS; sửa trong review, hạn chế clean context | 26/09 15:45:04 →15:45:24 | Build mọi PR theo policy cũ |
| [#78](https://github.com/AlexH-AI/Project-2C/pull/78) / #61 | med → checklist | 330 / 607 | Không | CHANGES → đã sửa, đúng 14d7d0b; không có PASS tách rõ | 26/09 18:21:46 →18:22:47 | Policy cũ, build xanh |
| [#83](https://github.com/AlexH-AI/Project-2C/pull/83) / #62 | med → checklist | 89 / 298 | Không | PASS; stacked phần 3/3, CI lại sau đổi base | 26/09 20:00:09 →20:00:29 | Policy cũ, build xanh |
| [#87](https://github.com/AlexH-AI/Project-2C/pull/87) / #63 | Issue high; PR không nhãn | 476 / 965 | Lockfile phát sinh từ package được phép | PASS f642ee1; head cuối 6daf43f có thêm 1 câu i18n, chưa thấy review riêng | 26/09 21:56:33 →22:01:10 | Policy cũ, build xanh |
| [#96](https://github.com/AlexH-AI/Project-2C/pull/96) / #64 | med → high (Rust) | 344 / 599 | playwright.config.ts ngoài danh sách literal, phục vụ e2e/neo ngày | PASS high đúng 3f667eb; có kiểm tay | 27/09 07:24:13 →08:16:28 | Policy cũ, build xanh |
| [#102](https://github.com/AlexH-AI/Project-2C/pull/102) / #100 | med → med | 20 / 145 | Không | PASS lại f0b89a5 sau sửa Owner yêu cầu | 27/09 09:46:42 →09:51:03 | Policy cũ, build xanh |
| [#125](https://github.com/AlexH-AI/Project-2C/pull/125) / #91 | med → high (capability) | 174 / 323 | Không | PASS 68c399a; kiểm tay save-error | 27/09 18:36:04 →19:05:17 | Có, đúng |
| [#134](https://github.com/AlexH-AI/Project-2C/pull/134) / #89 | med → high (Rust) | 109 / 193 | Không | PASS 38d1b91 | 28/09 07:45:39 →07:48:36 | Có, đúng |
| [#136](https://github.com/AlexH-AI/Project-2C/pull/136) / #90 | med → high (Rust) | 85 / 246 | Không | PASS 5d2a3ba; thay hướng mtime đã bị bác | 28/09 09:34:39 →09:43:26 | Có, đúng |
| [#166](https://github.com/AlexH-AI/Project-2C/pull/166) / #69 | med → high (schema) | 200 / 669 | Không | PASS lại 8c62ea1 sau 5 sửa | 29/09 08:11:29 →08:13:22 | Không cần; build skipped đúng |
| [#184](https://github.com/AlexH-AI/Project-2C/pull/184) / #71 | high → high | 239 / 554 | Lockfile phát sinh, dependency zod đã duyệt | PASS 25c5827 sau CHANGES | 30/09 03:21:51 →03:26:24 | Có, đúng (package) |
| [#185](https://github.com/AlexH-AI/Project-2C/pull/185) / #71 | high → high | 601 / 959 | domain + spec; Owner xác nhận domain 04:11, đổi spec theo quyết định | PASS 4dd6f44; có kiểm tay 04:27 | 30/09 04:04:35 →04:28:17 | Có, đúng |
| [#188](https://github.com/AlexH-AI/Project-2C/pull/188) / #187 | high → high | 73 / 209 | Không | PASS a27ba49 | 30/09 05:31:32 →05:34:12 | Có, đúng |
| [#190](https://github.com/AlexH-AI/Project-2C/pull/190) / #189 | high → high | 82 / 103 | Không | PASS 46c2b85 | 30/09 05:54:20 →06:16:08 | Có, đúng |
| [#192](https://github.com/AlexH-AI/Project-2C/pull/192) / #191 | high → high | 51 / 73 | Không | PASS 3db98b5 | 30/09 06:34:57 →06:36:49 | Có, đúng |
| [#194](https://github.com/AlexH-AI/Project-2C/pull/194) / #186 | low → high (Rust) | 336 / 523 | Không | PASS be1d524; native manual chưa đủ bằng chứng | 30/09 07:33:36 →07:40:27 | Có, đúng |
| [#196](https://github.com/AlexH-AI/Project-2C/pull/196) / #195 | low → high (Rust) | 23 / 38 | Không | PASS b0b80b3; Owner manual còn chờ | 30/09 07:58:53 →08:05:10 | Có, đúng |

### Tỷ lệ và cách hiểu

- **Có Issue/spec:** 17/17 = 100%.
- **CI áp dụng xanh trước merge:** 17/17 = 100%; không tính build SKIPPED #166 là lỗi.
- **Build policy/nhãn phù hợp thời điểm:** 17/17 = 100%; không áp quy tắc nhãn mới ngược về các PR build mọi lần.
- **Cỡ P≤400 và T≤800:** 14/17 = 82,4%. #74/#87/#185 vượt; #185 tăng do sửa nối tiếp theo Owner, đã công khai.
- **Có comment PASS trước merge:** 16/17 = 94,1%; #78 là “CHANGES → đã sửa” với checklist đạt nhưng không PASS tách rõ. **PASS ghi rõ SHA khớp head cuối:** 13/17 = 76,5%; #74/#83 có PASS nhưng comment không nêu SHA để đối chiếu trực tiếp, #87 PASS ở head trước (diff cuối chỉ thêm hướng dẫn thử backup cũ hơn), #78 không có PASS rõ. Không coi thiếu metadata là chứng minh review không xảy ra.
- **Tất cả file nằm literal scope:** 12/17 = 70,6% nếu đếm cả lockfile phát sinh của #87/#184 và root config #74/#96; con số này cố ý bảo thủ. Ngoại lệ #185 được Owner xác nhận rõ; lockfile phát sinh không được xem như tự ý thêm dependency.
- **Chứng minh clean context độc lập:** không đủ dữ liệu để cho tỷ lệ. #87 tự khai đã đọc comments cũ; #74/#78 có sửa trong phiên review. Không gọi tất cả là tuân thủ 100%.
- Không gộp các tỷ lệ thành một “điểm tuân thủ” duy nhất: có overlap và ngoại lệ được Owner duyệt. Low label #194/#196 không có nghĩa được tự merge như low khi review đã nâng high.
- Red→green TDD không thể chứng minh từ CI xanh cuối/commit messages. Có nhiều comment ghi đã test đỏ; audit không coi đó là execution log độc lập.
- Không đủ bằng chứng người/phiên nào thao tác merge high ngoài comment Owner và GitHub history; không cáo buộc merge trái phép. Clean branches/worktrees sau merge không kiểm được đầy đủ vì giới hạn checkout chỉ đọc.

## 6. Mẫu test chấp nhận — 14 Issue

“Có” là tìm được assertion thực chất trong source và bộ test nằm trong CI xanh cuối. Không đồng nghĩa reviewer đã tự chạy. Một Issue nhiều PR được đánh giá theo trạng thái cuối ở snapshot.

| Issue | Tiêu chí lấy mẫu | Test/bằng chứng hiện có | Kết luận và khoảng trống |
|---|---|---|---|
| [#61](https://github.com/AlexH-AI/Project-2C/issues/61) | G01–G22 qua DB; stage/latest; D6/D7; reschedule; policy; soft-delete | golden-metrics.test.ts; customers.test.ts:19,175; appointments.test.ts:153,187,212,229,771,813; policies.test.ts:35,64,115 | Có, cả nhánh lỗi/rollback. Import không qua các command này → A-001 |
| [#62](https://github.com/AlexH-AI/Project-2C/issues/62) | K01–K15; note bất biến; seq; kiểu field; D2; version/material | golden-kyc.test.ts it.each; kyc.test.ts:66,123,135,155,244,267,363,382,408 | Có. Test sai kiểu/note khác KH chỉ ở command, chưa ở backup |
| [#63](https://github.com/AlexH-AI/Project-2C/issues/63) | Web startup, persist thứ tự, exe giữ dữ liệu/backup, không crate mới | app-data.test.ts:60,73,86; persist-queue.test.ts:46; storage.rs tests; kiểm tay hậu tích hợp PR #96 | Phần tự động có; kiểm tay bản lịch sử được ghi, audit không thử native |
| [#64](https://github.com/AlexH-AI/Project-2C/issues/64) | Seed hash, quy mô, trạng thái/trigger, invariants, tốc độ | seed.test.ts:42,65,86,92,129,136; seed-invariants.test.ts:48–177; e2e/seed-timing.spec.ts | Có; local<5s/CI<15s là ngoại lệ Owner chốt, không kết luận spec thất bại từ duration test |
| [#69](https://github.com/AlexH-AI/Project-2C/issues/69) | D7 chỉ khóa ba ô; D9 reviewer; outcome+next atomic; migrate DB có dữ liệu | appointments.test.ts:243,317,329,369,419; database.test.ts:345,364; e2e/appointment-outcome.spec.ts:45,170,206 | Có. Null status UI chưa có ca phản hồi → A-003 |
| [#71](https://github.com/AlexH-AI/Project-2C/issues/71) | Round-trip; corrupt/newer/older; startup newer; confirm import | backup.test.ts:100,131,143,172,184; app-data.test.ts:102,375,398,410,453; startup-error.test.ts; e2e/backup.spec.ts | Có phần ghi rõ, nhưng “file hỏng” chủ yếu structural/SQL, thiếu semantic A-001 và resource A-002; SCHEMA_TOO_NEW dialog chưa có UI test |
| [#89](https://github.com/AlexH-AI/Project-2C/issues/89) | Second process lock không đụng DB/tmp/backups; nhả khóa; i18n | storage.rs open_while_another_process_holds_the_lock_touches_nothing, open_keeps_the_lock_and_does_not_lock_itself_out; startup-error.test.ts | Tự động có Windows handle test. Không suy ra đã kiểm tay hai exe trên build cuối |
| [#91](https://github.com/AlexH-AI/Project-2C/issues/91) | flush latest/retry/đóng sau save; save-error manual | persist-queue.test.ts:104,124,134; shell/close-guard.test.ts; PR #125 Owner manual đạt | Logic thuần tốt; thiếu mount/listener integration; manual lịch sử không bị bỏ qua |
| [#100](https://github.com/AlexH-AI/Project-2C/issues/100) | D10 ngày không lùi ở manual/outcome/restore; no persist; cùng ngày | customers.test.ts:200,223; appointments.test.ts:735,746,756,833; seed-invariants.test.ts:59 | Có. Import có thể bypass D10 là A-001, không phải #100 chưa sửa command |
| [#187](https://github.com/AlexH-AI/Project-2C/issues/187) | Cleanup interrupted export; no overwrite; close old DB; giữ old khi lỗi | storage.rs interrupted/claim/export tests; app-data.test.ts:189,205,435 | Có core acceptance. E2E backup kiểm UI/alert; không có listener pageerror riêng trong test đó nên “không console error” chưa được assert trọn |
| [#189](https://github.com/AlexH-AI/Project-2C/issues/189) | Chỉ cleanup first acquire, webview reload không xóa export đang chạy | open_again_in_the_same_process_keeps_a_running_export; export collision/claim tests | Có trực tiếp cho first/reopen. Nhánh antivirus không xóa claim chưa có fault-injection riêng; đọc code thấy best effort |
| [#191](https://github.com/AlexH-AI/Project-2C/issues/191) | Cleanup kể cả DB tmp không xóa được; giữ lock behavior | the_first_open_cleans_exports_even_when_it_cannot_remove_the_db_tmp; test dùng thư mục tên .db.tmp | Có assertion tạo lỗi thực filesystem trong Rust test, không chỉ mock return value |
| [#186](https://github.com/AlexH-AI/Project-2C/issues/186) | FileSize, lastSave thành công, folder kind, web card/export | number.test.ts; app-data.test.ts:269,305; tauri-storage.test.ts:48,58; e2e/backup.spec.ts; Rust folder/latest tests | Có tự động. Thư mục thật native/Explorer cần manual |
| [#195](https://github.com/AlexH-AI/Project-2C/issues/195) | Quote path comma/space, hai nút Explorer exe | explorer_arg_quotes_the_path_and_keeps_it_verbatim; PR #196 có tái hiện kỹ thuật trước sửa | Unit có; Owner kiểm tay exe theo acceptance chưa được xác nhận ở comments đọc được |

### Khoảng trống kiểm thử cần ưu tiên

1. Snapshot không hợp lệ về nghiệp vụ nhưng hợp lệ SQL (A-001), khác hẳn thêm assertion coverage.
2. Giới hạn tài nguyên trước parse (A-002).
3. Native smoke của build cuối: reopen persistence, second instance, locked-save→retry/close, export trùng tên, import/reload, Explorer đường dẫn có dấu phẩy/khoảng trắng; ghi SHA và kết quả vào #72/PR liên quan.
4. React CloseGuard mount/unmount/late unlisten/destroy reject, và e2e pageerror trap cho replace.
5. Migration tiếp theo: bỏ số schema 5 ghi cứng trong database.test.ts; test giả “n+1” và DB version trước có dữ liệu tiếp tục giữ.
6. Coverage package gate (B-003), sau đó benchmark metrics; không tăng số test bằng các test chỉ lặp lại implementation.


## 7. Doc drift và đối chiếu mockup

| Nguồn | Nội dung cũ / lệch | Source hoặc quyết định hiện tại | Xử lý đề xuất |
|---|---|---|---|
| PROJECT-STATE:5,9 | Phase 1 còn mở; repo private | STATE:54/58, HANDOFF, GitHub: Phase 1 đóng, repo public | Cập nhật tóm tắt đầu file; giữ chronology có ngày |
| PROJECT-PLAN §5 | 16/18 Phase 1, Phase 3 mới lập kế hoạch, ~30% | Phase 3 chỉ #72 mở | Tính lại tiến độ từ milestone, không cộng % tùy ý |
| PROJECT-PLAN:127 | pnpm verify gồm e2e | package scripts: verify và e2e riêng; CI chạy cả hai | Sửa sơ đồ lệnh |
| PROJECT-PLAN:223 | Tauri SQLite + sql.js hai adapter | ADR-0016: sql.js mọi nơi, Rust chỉ bytes/file | Gắn supersession và sửa sơ đồ hiện tại |
| PLAN:241/293, spec:229 | Phase 3 build exe mọi PR | ADR-0015 phụ lục mới: main/manual/PR build-exe; docs-only skip | Cập nhật tham chiếu, không đổi workflow |
| spec §5:192 | Backup theo tên timestamp | #90/#136: sequence quyết định thứ tự ghi, stamp để đọc | Cập nhật tên/retention; có old-name compatibility |
| metrics phase-1:22 | Icon #17 “Chưa làm” | #128 merged, STATE ghi xong | Hoàn thiện bảng kết quả, không đổi số đo lịch sử |
| HANDOFF #183–#192 | formatCount ở money; colon cứng; duplicate error string; cần PK test | Đã tách number.ts, i18n export notice, isUnsavedChangesError, backup.test PK | Chuyển RESOLVED với PR #185 |
| ADR-0003 và quy trình lịch sử | /resume, giới hạn private protection cũ | Session-start và ruleset mới | Giữ bản quyết định lịch sử; thêm “đã thay thế bởi…” nếu cần |
| Mockup overview | Tỉ lệ chốt lũy kế theo KH từng ở N2/N1 | ADR-0007/golden: issued/RF cùng kỳ | Trước Phase 4 phải sửa mockup; không sửa engine để khớp mockup cũ |
| Mockup customer/settings | AI, sync, restore controls đầy đủ, số note KYC | Phase 3 nhập liệu; #186 chốt countRecords 5 nhóm; restore UI/AI/sync ngoài scope | Gắn nhãn phase; không mở lại feature đã thống nhất hoãn |
| Mockup appointment 6f | Không có ô Giờ ở bản vẽ | Owner quyết giữ ô Giờ, HANDOFF | Cập nhật mockup khi chạm, không bỏ chức năng |
| Mockup settings 10c | Hướng dẫn backup .db khôi phục bằng Nhập backup | Import hiện nhận JSON .p2cbackup; startup hướng dẫn chép .db thủ công | Tách rõ hai loại backup trong tài liệu hỗ trợ, tránh làm người dùng nhập .db vào JSON importer |

**Known đã sửa, không còn là findings mới:** transition ngày lùi (#100), tiền “500,000” mơ hồ (R3 follow-up), UI period label i18n (R3), CI main bị hủy (R4), PowerShell fail/exit-code cũ (R4), schema quá mới (#71), đóng app lúc save lỗi (#91), hai exe (#89), retention clock rollback (#90), export overwrite cùng phút (#185), DB cũ leak và export placeholder (#187), cleanup webview reload (#189), cleanup early-error (#191), Explorer dấu phẩy (#195). Một số vẫn cần native regression trên build cuối nhưng không có nghĩa source chưa sửa.

## 8. Nợ kỹ thuật và khả năng mở rộng Phase 4–6

| Ưu tiên | Việc | Cần trước | Lý do / điều kiện hoàn thành |
|---|---|---|---|
| P0 | Validator snapshot scalar + relational (A-001) | G7 Phase 3 | Từ chối dữ liệu phá hồ sơ/KYC/history; current DB nguyên vẹn |
| P1 | Resource limits import (A-002) | Dùng backup lớn/Phase 6 | Ngưỡng rõ, UI có lỗi trước khi parse tốn tài nguyên |
| P1 | Chốt native smoke build cuối và metrics #72 | G7 Phase 3 | Có SHA, máy, ca đã thử và ca chưa thử |
| P1 | Context/index metrics (B-001), helper MTD | Dashboard Phase 4 | Golden không đổi; benchmark nhiều scopes; không tính lặp O(A×T) |
| P2 | Miền ngày thống nhất (B-002), giờ chuẩn domain | Filter/report Phase 4 | Parse/format/shift/ISO dùng một hợp đồng |
| P2 | Coverage per package (B-003), pageerror/CloseGuard seam | Mở rộng UI và lưu trữ | CI bảo vệ đúng package và wiring vòng đời |
| P2 | API snapshot/revision cho AI, cancellation và stale-result check | Phase 5 | Kết quả AI gắn KYC version/prompt/provider; không ghi đè nghiệp vụ |
| P2 | Serialize replace/save/export/sync, commit generation sau open thành công | Phase 6 async | Không lost-update; operation thất bại giữ DB cũ còn persist được |
| P2 | Định nghĩa sync snapshot identity/tombstone/conflict | Phase 6, G1/G2 | Không lấy “mới nhất thắng” theo clock máy; không biến import replace thành merge ngầm |
| P3 | Thu nhỏ public sqlite surface, chia settings shared helpers | Khi chạm module | Giữ test seam; không làm refactor rộng chỉ để làm đẹp |
| P3 | Virtualization/caching UI | Chỉ sau đo performance | Tối ưu bottleneck thật, qua G4 nếu thêm dependency |

**Phase 4:** nền RF/FYP/period có thể dùng lại. Cần chốt golden cho số lịch dự kiến/đã gặp và chuỗi dời lịch, vì spec §10 để sau. Không dùng mockup cũ làm nguồn công thức.

**Phase 5:** KYC facts/versions là nền tốt nhưng imported snapshot phải đáng tin trước. Gate deterministic không được LLM tự sửa. G5 phải duyệt prompt/guardrail, validator evidence và CURRENT/STALE/REJECTED; G6 duyệt key storage. Không giả định CSP mở remote/API key đã có.

**Phase 6:** .p2cbackup hiện là full replacement có schema, chưa phải format merge ổn định nhiều máy. Cần snapshot identity, deleted records, provenance/seq, conflict policy, retry/idempotence và xử lý clock lùi. Export-time không nên một mình quyết định bên thắng.

## 9. Quyết định đề xuất cho Owner — không phải bug tự động

1. **Chốt mức trust backup:** đề xuất từ chối file vi phạm bất biến, không âm thầm sửa. Có thể cho chế độ chẩn đoán riêng về sau; không cần import “best effort” ở Phase 3.
2. **Chốt budget input:** giới hạn bytes/rows/text dựa trên bộ seed và dữ liệu thực dự kiến. Review không tự đặt một con số rồi coi vượt là dữ liệu sai.
3. **Giữ lựa chọn đã duyệt:** sql.js mọi nơi; Rust std; không hard-link vì FAT/exFAT; không chống mọi chương trình ngoài đụng file; UI restore/AI/Excel ngoài Phase 3. Không xin đổi stack.
4. **G7:** sau A-001, chạy pipeline quy định và kiểm tay build cuối; cập nhật metrics phase-3 và đóng #72 bằng quyết định Owner. A-002 nên hoàn tất trước sử dụng backup lớn; có thể Owner nhận rủi ro có ghi nhận nếu cần phát hành demo sớm.
5. **Kỷ luật PR:** sửa tiếp vượt ngưỡng thì tách follow-up khi có thể; checklist ghi rõ head đã review, CI SHA và ngoại lệ scope. Không dùng câu “PASS” trước sửa cuối để thay review head mới.
6. **Miền ngày và giờ:** chọn phạm vi calendar thống nhất trước Phase 4; gợi ý năm trước lúc đầu năm là UX mới cần chốt, không suy từ W8 hiện tại.
7. **Gia cố supply chain/khả năng truy cập:** pin Actions theo SHA và rà non-text contrast input border ở vòng UI phù hợp. Đây là cải thiện, không bằng chứng hệ thống hiện bị khai thác hay toàn UI không đạt AA.
8. **Lộ trình dữ liệu local:** trước dữ liệu khách hàng thật và sync, chốt retention, kiểm soát file, key/encryption theo G6. Không tự cài dịch vụ hay tạo kho dữ liệu ngoài phạm vi.


## 10. Các Issue đề xuất — chỉ bản nháp, chưa tạo trên GitHub

T-xxx là placeholder, Owner/phiên triển khai gán số thật. Ước lượng là additions+deletions, cố giữ ≤400 product và ≤800 tổng mỗi task; nếu mở rộng phải tách tiếp. Không gộp sửa code vào báo cáo này.

### T-xxx — Kiểm giá trị scalar và kiểu KYC của backup trước preview

- Nhóm: A-001 phần 1. Risk: high.
- File được phép: packages/db/src/backup.ts; file mới packages/db/src/backup-validation.ts và test; test backup; apps/desktop/src/data/app-data.test.ts; e2e/backup.spec.ts nếu cần regression đầu-cuối.
- Acceptance: value_json sai JSON/null/object/sai kiểu field bị từ chối; ngày/seq/số sai hợp đồng bị từ chối; no persist/changed/current mutation; engine failure giữ loại lỗi; seed round-trip, old-schema upgrade vẫn xanh.
- Ước lượng: 180–280 product, 480–650 tổng. Không đổi golden/schema/dependency.

### T-xxx — Kiểm bất biến liên bảng của snapshot sau migrate

- Nhóm: A-001 phần 2; phụ thuộc task scalar. Risk: high.
- File được phép: packages/db/src/backup-validation.ts; file helper đọc thuần nếu cần; packages/db/src/backup.ts; backup/invariant tests; apps/desktop/src/data/app-data.test.ts.
- Acceptance: stage khác latest, thiếu initial transition, transition ngày lùi, from-chain sai, appointment khác KH, fact note khác KH, D2/profile lệch, cấu hình active/conflict sai → BACKUP_INVALID; không thay current; deleted rows hợp lệ vẫn round-trip.
- Ước lượng: 220–350 product, 600–780 tổng. Nếu validators KYC/history vượt cỡ, chia thành hai Issue theo bảng. Không replay command làm đổi history.

### T-xxx — Giới hạn tài nguyên khi chọn và phân tích backup

- Nhóm: A-002. Risk: med; G1/G2 cho ngưỡng/hợp đồng input nếu cần.
- File được phép: apps/desktop/src/routes/SettingsBackup.tsx; i18n/vi.ts; packages/db/src/backup.ts, errors.ts; các test liên quan; spec §6 cập nhật giới hạn.
- Acceptance: cap trước file.text; cap API bypass UI; lỗi có mã/chuỗi i18n; current unchanged; seed và file ở biên hợp lệ nhận; vượt bytes/rows/text bị reject.
- Ước lượng: 100–180 product, 320–500 tổng. Không worker/dependency mới nếu chưa có benchmark.

### T-xxx — Dùng index chung cho metrics nhiều kỳ và scope

- Nhóm: B-001. Risk: med; làm trước dashboard Phase 4.
- File được phép: packages/domain/src/stats.ts; helper metrics index mới; stats tests; benchmark/test dữ liệu không sửa golden.
- Acceptance: G01–G22 nguyên vẹn; manual transition không RF, tối đa một RF/hẹn, scope team hiện tại đúng; index không stale qua revision; bảng benchmark trước/sau nhiều kỳ/scopes.
- Ước lượng: 120–240 product, 350–600 tổng. MTD có thể task riêng G2 nếu cần thay interface rộng.

### T-xxx — Báo thiếu trạng thái khi lưu kết quả lịch tương lai

- Nhóm: A-003. Risk: low.
- File được phép: OutcomeDialog.tsx, outcome-form.ts nếu cần, i18n/vi.ts, e2e/appointment-outcome.spec.ts.
- Acceptance: click/Enter status=null báo rõ, no mutation; chọn hợp lệ clear lỗi; không tự chọn trạng thái; các ca future MET vẫn bị chặn.
- Ước lượng: 20–45 product, 70–130 tổng.

### T-xxx — Thống nhất miền năm và chặn chuyển kỳ ngoài miền

- Nhóm: B-002. Risk: med; qua G2 cho miền năm.
- File được phép: packages/domain/src/period.ts và test; packages/ui/src/components/PeriodPicker.tsx; i18n nếu cần; packages/db/src/common.ts và test; e2e/period-picker.spec.ts.
- Acceptance: parse/format/shift các kind cùng miền; nút biên truy cập được; addDays overflow bị chặn; round-trip ISO/ngày; tuần/tháng qua năm không sai.
- Ước lượng: 80–160 product, 300–500 tổng. Không đổi golden ngoài quyết định Owner.

### T-xxx — Ép coverage riêng domain và db

- Nhóm: B-003. Risk: low.
- File được phép: vitest.config.ts; helper coverage nhỏ trong tools nếu cấu hình không đủ; package.json chỉ khi cần script; test/helper fixture; checklist mô tả cách kiểm.
- Acceptance: domain<95 hoặc db<90 fail độc lập tổng; CI in số từng package; current suite vẫn xanh; không hạ scope include để qua.
- Ước lượng: 10–60 product/config, 80–160 tổng. Nếu đụng package.json, gắn build-exe theo quy tắc repo.

### T-xxx — Đồng bộ hiện trạng, ledger known và hướng dẫn backup

- Nhóm: B-004. Risk: low, docs-only.
- File được phép: docs/PROJECT-STATE.md; docs/PROJECT-PLAN.md; docs/state/HANDOFF.md; docs/design/phase-3-du-lieu.md; docs/metrics/phase-1.md; liên kết supersession ADR cần thiết.
- Acceptance: mỗi dòng drift mục 7 được sửa hoặc đánh dấu lịch sử; phân biệt .db/.p2cbackup; OPEN/RESOLVED/ACCEPTED; không thay quyết định gate/golden/metric lịch sử.
- Ước lượng: 0 product, 100–220 tổng. Kế hoạch thay nội dung đã duyệt cần G1, chỉnh trạng thái thật không phải tự mở rộng kế hoạch.

**Không tạo Issue trùng #72:** dùng chính #72 để thu native smoke build cuối, metrics phase-3, quyết định G7. Các nợ còn lại mục 8 có thể ghi backlog trước khi tách spec/Issue riêng.

## 11. Phạm vi, giới hạn và tính trung thực của review

### Đã làm

- Đọc đặc tả dữ liệu, PROJECT-PLAN/STATE/HANDOFF, ADR liên quan, golden, checklist, metrics Phase 1/2, COMPARISON; đối chiếu lịch sử R1–R4 và comment Owner trong các Issue/PR liên quan.
- Rà đường production trọng yếu domain, db schema/migrations/commands/backup/seed, storage Rust, persist/app-data/close guard, các form và UI dùng dữ liệu; đọc test tại các seam rủi ro, không chỉ đếm tên file.
- Kiểm cấu hình module/dependency/CSP/capability/workflow/script; đọc raw HTML mockup và trích nhãn/nội dung để so hành vi.
- Mẫu 17 PR và 14 Issue acceptance, đọc mốc CI và log run cuối; tách policy cũ/mới, stacked PR và ngoại lệ Owner.
- Không phát hiện thay đổi fixture vàng sau hai commit khởi tạo trong lịch sử của snapshot đã đọc.
- Không sửa, tạo test tạm hoặc chạy code trong repo; không fetch/pull/checkout/commit/push; không sửa GitHub.

### Chưa làm / không được suy ra

- Không pnpm/cargo/build/dev server/exe; không đo runtime/RAM/import stress tại máy. Các kịch bản A-001 là xác nhận static, A-002/performance không giả là đã benchmark.
- Không render mockup/app, không browser UAT, không kiểm pixel/AA/responsive trên bản native. Không chứng nhận native Tauri↔React chỉ từ unit/web e2e.
- Không kiểm CVE, dependency registry, Internet chung, repo dữ liệu, máy khác, thư mục Project-2 hoặc cấu hình người dùng ngoài phạm vi.
- Không line-by-line toàn bộ lockfile/snapshot sinh tự động; không cam kết đã đọc mọi test/UI branch. Review toàn Phase 1–3 dùng phân tích rủi ro và lấy mẫu có nêu nguồn, không phải chứng minh hình thức.
- Không thể xác minh độc lập mọi phiên review sạch, red-green TDD, mọi Owner approval ngoài comments, hoặc cleanup nhánh/worktree ở máy khác.
- GitHub metadata là trạng thái đọc tại thời điểm audit; nhận định code neo vào đúng 0fa0eea…, không dùng code PR sau snapshot.
- Các phát hiện không phải bản vá và không tự thay spec. Mọi task sửa vẫn theo gate/risk/CI/review của dự án.

### Tình trạng checkout và đầu ra

Checkout đầu phiên đã có .agents/, .codex/, AGENTS.md untracked. Vì chỉ đọc, reviewer giữ nguyên; không thể gọi checkout “hoàn toàn sạch”. Việc cần bảo đảm là **không đổi tracked file và không tạo thêm file trong repo**. Báo cáo này được lưu riêng tại C:\workspace\astra-reports\2026-09-30-project-2c-phase-1-3-review.md. Kết quả kiểm tra cuối được ghi bổ sung ngay dưới đây.

**Kiểm tra cuối:** HEAD vẫn 0fa0eea40203a17c73ed9901c576963b9857f11d; git diff --exit-code và git diff --cached --exit-code đều thành công. git status --short chỉ còn đúng ba mục untracked có sẵn: .agents/, .codex/, AGENTS.md. Không có file tạm/test/build được tạo trong repo.

