XONG — codex gói A lượt 4, 2026-10-29 01:37:52 +07:00

## 1. Thông tin phiên

- Bên: Codex; gói A — Lõi dữ liệu; phiên mới.
- SHA đầu phiên: 2e51e25eb0125f56d3d938b97ef18d6873dae076 (đúng SHA ghim).
- git status --short đầu phiên: rỗng.
- Bắt đầu: 2026-10-29 01:04:44 +07:00 (Asia/Bangkok).
- Công cụ: Codex desktop; CLI báo codex-cli 0.162.1 (có cảnh báo không tạo được PATH alias trong sandbox).
- Model: ngữ cảnh hệ thống nhận diện GPT-6; công cụ hiện có không trả tên model/effort cụ thể. Prompt Owner nêu GPT Sol 6.1; chưa có công cụ độc lập xác nhận tên và mức suy luận, không suy đoán.


- Máy: DESKTOP-KDURKJP, Intel Core i9-12900K, Node v24.20.0; giờ theo Asia/Bangkok.
- Chỉ review: không sửa/commit repo, không gh/Issue/PR, không cài dependency, không subagent. Chỉ ghi báo cáo/probe dưới codex/A. Không đọc báo cáo lượt 4 của bên khác hoặc các cây bị cấm. Không dùng trình duyệt/exe để kết luận màn; không gọi AI/key/ChatGPT.

## 2. Bảng R1 và R2

### R1 — 18 dòng của gói A

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-104 | #720 → #740 (+ #857) | **ĐÃ SỬA** | E7 trước/cùng/sau ngày; baseline trash; M01 đỏ 3/5 ca E7. | Mốc trước ngày vẫn được; N05 không làm đổi luật E7. |
| DR6-105 | #720 → #740 (+ #830) | **ĐÃ SỬA** | M02 bỏ precision: 3 → 3 test backup đỏ; N06: 5 dạng sai bị từ chối, đúng .000Z được nhận. | Đóng cả ghép mốc rút và thứ tự Thùng rác bằng từ chối dạng khác app ghi. |
| DR6-106 | #720 → #740 | **ĐÃ SỬA** | Hai test TR-3 trong baseline xanh; M03 bỏ thứ tự seq → 4 test đỏ. | TR-3 có câu giữ chỗ seq; khôi phục theo thứ tự ghi được, ngược thứ tự bị chặn. |
| DR6-107 | #721 → #738 | **ĐÃ SỬA** | M04 bỏ chặn BOM đầu → 5 test backup đỏ; N03 raw FEFF được xử lý và roundtrip. | BOM giữa chuỗi tùy chọn vẫn giữ khi có chữ (N02); nhánh model là phát hiện riêng A1. |
| DR6-108 | #721 → #738 | **ĐÃ SỬA** | M05 bỏ thay surrogate → 1 test raw đỏ; N03 đọc x�đuôi, xuất/nhập nguyên byte. | Kiểm cả nửa cao/thấp và biên dài trong bộ ai-analyses; nhãn model không thuộc raw_output. |
| DR6-110 | #721 → #738 | **ĐÃ SỬA** | M06 bỏ normalizeText tiền → 14 đỏ; M07 ngày → 6 đỏ. | Tiền/ngày dán chữ vô hình, White_Space, NFC; N09 biên năm mới. |
| DR6-111 | #721 → #738 | **ĐÃ SỬA** | M08 bỏ Cc khỏi INVISIBLE → 3 test text đỏ; baseline common/KYC xanh. | NUL vẫn từ chối trước chuẩn hóa; N02 phân biệt NEL/VT/FF có chữ thật. |
| DR6-112 | #721 → #738 (+ #828) | **ĐÃ SỬA** | M09 bỏ phân xử code unit → 3 đỏ; M25 bỏ đổi chữ số → 2 đỏ. | N08: 500.000 bộ ba trên 700 tên có số astral/NFD/dấu nối, 0 chu trình phát hiện. |
| DR6-113 | #722 → #742 (+ #805) | **ĐÃ SỬA** | M10 tắt recursive_triggers → test REPLACE đỏ; baseline kiểm trước/sau export. | D11 kiểm cả KH sống và KH đã xóa; N05 dọn/nhập lại được. |
| DR6-114 | #722 → #742, #776 → #805 | **ĐÃ SỬA** | M11 bỏ reviewer khỏi danh sách → 4/5 test person-references đỏ; baseline đủ năm kind. | POINTS_TO dùng chung cho ownsRecords và luật 5; KEPT_PEOPLE không có nhánh reviewer viết riêng. |
| DR6-125 | #722 → #742 | **ĐÃ SỬA** | M12 bỏ đệ quy: 2 đỏ; M31 D3: 1; M32 D11: 1; M33 firstOfEach: 1; M13/M34 SYSTEM: mỗi mutant 1 đỏ. | Test baseline đủ tập giữ nhiều tầng, D3, D11 và đếm SYSTEM; đã thử mẫu đột biến chính, không tuyên bố mutation coverage toàn bộ. |
| DR6-126 (a–f) | #720 → #740; #721 → #738; #722 → #742 | **ĐÃ SỬA** | a M14: 2 đỏ; b M15: 1; c M30: 2; d M16: 1; e M17/M18/M35: mỗi mutant 1; f M06: 14, M36 toàn A: 1. | M36 chỉ 5 test kyc-fact xanh, nhưng test lệnh KYC trong toàn A bắt 2.0/1e1/0x10/+2; không báo test hở giả. |
| DR6-132 (b) | #722 → #742 | **ĐÃ SỬA** | packages/db/CLAUDE.md nêu đúng DROP/tạo lại ba trigger trước khi dựng lại customers; schema.ts nêu ngoại lệ TR-11. | Đối chiếu 0011: cả ba trigger đọc OLD.customer_id trong customers; đây là dòng tài liệu, không đặt đột biến hành vi giả. |
| DR6-134 | #720 → #740 (+ #804) | **ĐÃ SỬA** | stagesOfDay dùng cho lệnh, luật nhập 4 và outcome-form; M14 làm test nhóm tạo KH đỏ. | stageAtEndOf/stageSnapshot vẫn bỏ KH trước ngày tạo khi đếm chỉ số; fallback của cuộc gặp nhập bù là hợp đồng khác có chủ ý. |
| DR6-25 (phần A) | #781 → #830 (+ #837) | **ĐÃ SỬA** | Chỉ import zod/mini; M38 đổi về zod → ESLint exit 1; so envelope/timestamp classic–mini: 63 đầu vào phân biệt, 0 lệch. | 20.000 lần parse là lặp 54 envelope + 9 timestamp, không phải 20.000 ca độc lập. Bundle dùng số chung. |
| DR6-66 (phần A) | #655 → #693; #775 → #801 | **ĐÃ SỬA** | rg không còn getter/mark/monthToDate/stageOn trong source A; M39 đưa lại đúng monthToDate cũ → codemap --check exit 1. | Kiểm cấu trúc/API; gate codemap không tự chứng minh mọi dạng dead code đều bị chặn. |
| DR6-67 (phần A) | #774 → #799; #775 → #801 | **ĐÃ SỬA** | updateRow/findRow/requireRow/lastSeq và helper domain một nơi; M40 đưa lại updateTeamRow cũ không caller → TS6133; M19 thay hành vi helper bị seed hash giết. | Bản list của schema giữ riêng vì import vòng: ngoại lệ được Issue cho phép, không báo lại. |
| CL3-A29 | #722 → #742; #776 → #805 | **ĐÃ SỬA** | M27 bỏ index mới → test lookup migration đỏ; perf-paired: listTrash 26,171 → 24,184 ms; preview 1,792 → 0,937 ms. | Cùng kết quả listTrash/preview với mã cũ, và cùng dòng khi bỏ cả hai index; CROSS JOIN đọc từ lịch đã xóa. |

18/18 dòng **ĐÃ SỬA trong phạm vi A**; 0 SỬA MỘT PHẦN, 0 CHƯA SỬA, 0 HỒI QUY. A1 là biến thể ở nhãn model, không đổi kết luận raw_output của DR6-108. Với refactor/bloat thuần, dùng gate cấu trúc và test giữ hành vi; một bản chép tương đương hành vi không buộc unit phải đỏ chỉ vì còn code lặp.

### R2 — 6 Issue có phần A

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-285 (#774) | #799 (7d5029a) | **ĐÃ SỬA** | Helper ngày/ISO/bỏ dấu/gộp khoảng trắng/hex và previous KYC đúng API mới; baseline domain/seed xanh; M37 làm material sai → 1 test đỏ. | N11: 00:00/23:59 qua năm mới và seed roundtrip tại UTC, UTC−11, UTC+14, Bangkok đều đạt; thay parseDate là chủ ý. |
| T-286 (#775) | #801 (228acac), #804 (931b9b8) | **ĐÃ SỬA** | Gộp row/seq/live; bỏ getter chỉ test; mã lỗi/params và stage đầu được baseline giữ; M19 bỏ updatedAt → 1/1.470 test đỏ (hash seed). | M19 riêng Team 31/31 xanh chưa đủ kết luận; đã mở rộng toàn A. Nhánh normalizeKycValue còn chặn INVALID_TEXT. |
| T-287 (#776) | #805 (597c632) | **ĐÃ SỬA** | Danh sách năm kind/POINTS_TO; M11 đỏ 4, M27 đỏ 1, M29 đếm RF sai đỏ 1; test migration có dữ liệu và plan trong baseline xanh. | N05 dọn–giữ–khôi phục–dọn tiếp; listTrash/preview cũ–mới bằng nhau; bỏ index không đổi dòng; empty-trash không đọc refs thừa theo test. |
| T-288 (#777), phần A | #812 (a5ff382) | **ĐÃ SỬA** | MAX_AI_RAW_OUTPUT/AI_ANALYSIS_NO_MODEL chỉ định nghĩa ở ai/schema; db import cho CHECK và toRow; M28 nâng trần raw thêm 1 → 2 test đỏ. | Chỉ kết luận phần lưu DB/hằng và seed. Chi tiết Mock/retry/validator được gói C kiểm; không gọi AI thật. |
| T-291 (#780), phần A/domain | #824 (cc65196), #828 (7cdc432) | **ĐÃ SỬA** | Hash/canonical output/chữ tùy chọn/gợi ý năm trước/thứ tự tên/VT-FF: M20 7 đỏ, M21 5, M22 1, M23 1, M24 3, M25 2, M26 1. | N01–N03, N07–N09; dòng do app ghi nhập được. Giới hạn output theo code point, REJECTED được giữ khóa/thứ tự khác. Mục AI 11–12 của Issue thuộc C. |
| T-292 (#781), phần A | #830 (78370a0) | **ĐÃ SỬA** | Mini đúng envelope và precision:3 trên 54+9 ca phân biệt; 20.000 parse lặp 0 lệch success/data/code/path; baseline mã BACKUP_INVALID giữ; M38 lint đỏ khi quay về classic. | Không so chữ lỗi tiếng Anh mặc định vì K38 đổi có chủ ý; detail V1 toàn phần thuộc C, bundle thuộc F. |

6/6 dòng **ĐÃ SỬA trong phạm vi A**. Chữ chỉ tài liệu được đối chiếu với code/spec hiện tại. Các phần C/D/E/F của Issue chung phải lấy báo cáo của gói đó, không suy rộng từ kiểm DB.

## 3. Phạm vi đã đọc

- Lõi domain: ngày/kỳ/so sánh, tiền/số, sắp tên/chữ, thực thể, vòng đời/RF, gom chỉ số theo mốc/góc nhìn, ảnh chụp nhóm; KYC catalog/giá trị/cổng/hash/material/bằng chứng. DB: schema/migration, cache statement/transaction/persist, mọi repository/lệnh, backup và luật 1–14, counts, tham chiếu nhân sự, trash/purge, seed và settings/ULID/API.
- Diff 119e2e4..2e51e25: ưu tiên T-269/270/271, T-285/286/287/288/291/292; 29 file SP +1.117/−587 và 25 file test +2.116/−287 theo baseline chung. Hai index mới 0012 và metadata đi kèm; inventory đầy đủ 124 file Git, gồm 46 source, 44 test và SQL/metadata/config/CLAUDE. Source liệt kê dưới; JSON metadata kiểm bằng các test migration/schema và chuỗi version, không coi là code viết tay.
- Test: chạy đủ 44 file, **1.470/1.470 xanh**. Đọc seam/ca biên, các test thêm trong diff và nơi đột biến đỏ; test-map.json có 2.002 lời gọi expect tĩnh và tên ca từng file. Không đồng nhất số expect hay coverage với chứng minh hết lỗi.
- Nguồn đúng: CLAUDE gốc/domain/db, CONTEXT; spec Phase 3 §4/§6; Phase 4; Phase 6 §4.1/§4.2/§5 (S2-6 mới, TR-1…13, D1…13); ADR-0007/0008 và phụ lục; golden chi-so/kh-theo-nhom/kyc/lich-hen cùng fixture/test. Điểm nối app: tables.ts, outcome-form.ts, schema AI cho lưu/nhập.
- Lịch sử: ba tổng hợp lượt 1–3; các báo cáo A gốc trong raw/2026-10-15 (cả Home PC), 2026-10-17, 2026-10-21; đối chiếu nhánh liên quan C/F qua tổng hợp và tìm theo bằng chứng model/surrogate/FEFF. common/plan (thước và phạm vi), known (K1–K40/ACCEPTED/R), fixes các Issue liên quan, baseline. Không dùng báo cáo lượt 4 của bên khác.

| File | Dòng vật lý ở SHA ghim |
|---|---:|
| packages/db/src/ai-analyses.ts | 1–387 |
| packages/db/src/appointments.ts | 1–559 |
| packages/db/src/backup-validation.ts | 1–543 |
| packages/db/src/backup.ts | 1–218 |
| packages/db/src/common.ts | 1–303 |
| packages/db/src/counts.ts | 1–92 |
| packages/db/src/customers.ts | 1–586 |
| packages/db/src/database.ts | 1–262 |
| packages/db/src/errors.ts | 1–131 |
| packages/db/src/ids.ts | 1–34 |
| packages/db/src/index.ts | 1–106 |
| packages/db/src/kyc.ts | 1–602 |
| packages/db/src/migrations.ts | 1–47 |
| packages/db/src/person-references.ts | 1–75 |
| packages/db/src/policies.ts | 1–141 |
| packages/db/src/purge.ts | 1–245 |
| packages/db/src/schema.ts | 1–412 |
| packages/db/src/seed-data.ts | 1–306 |
| packages/db/src/seed.ts | 1–708 |
| packages/db/src/settings.ts | 1–29 |
| packages/db/src/sql-raw.d.ts | 1–5 |
| packages/db/src/team.ts | 1–336 |
| packages/db/src/test-support.ts | 1–67 |
| packages/db/src/trash.ts | 1–287 |
| packages/domain/src/appointment-counts.ts | 1–116 |
| packages/domain/src/compare.ts | 1–74 |
| packages/domain/src/customer-lifecycle.ts | 1–51 |
| packages/domain/src/evidence-level.ts | 1–47 |
| packages/domain/src/golden/appointments.fixture.ts | 1–133 |
| packages/domain/src/golden/kyc.fixture.ts | 1–271 |
| packages/domain/src/golden/metrics.fixture.ts | 1–245 |
| packages/domain/src/golden/stage-snapshot.fixture.ts | 1–222 |
| packages/domain/src/index.ts | 1–134 |
| packages/domain/src/kyc-catalog.ts | 1–155 |
| packages/domain/src/kyc-fact.ts | 1–73 |
| packages/domain/src/kyc-gate.ts | 1–85 |
| packages/domain/src/kyc.ts | 1–164 |
| packages/domain/src/model.ts | 1–113 |
| packages/domain/src/money.ts | 1–190 |
| packages/domain/src/name-order.ts | 1–44 |
| packages/domain/src/number.ts | 1–43 |
| packages/domain/src/period.ts | 1–480 |
| packages/domain/src/pipeline-stage.ts | 1–8 |
| packages/domain/src/stage-snapshot.ts | 1–169 |
| packages/domain/src/stats.ts | 1–272 |
| packages/domain/src/text.ts | 1–80 |

Danh sách SQL/meta/config/test và SHA-256 từng file: A/inventory.json; diff-numstat.txt; test-map.json. File sản phẩm đọc theo logic từng module; phần test đọc tay tập trung ca/diff/seam, toàn bộ được chạy. Không nhận việc máy đọc hash là thay thế review thủ công.

## 4. Kịch bản mới đã thử

N06/N07 là replay R, không tính vào tối thiểu kịch bản mới. Các ca mới tập trung biến thể và hành vi vừa thêm sau lượt 3.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 (N01) | KYC A→B→A→mâu thuẫn→giải quyết trong một mốc created_at đứng yên; xuất/nhập dưới luật hash mới | 6 phiên bản; hash quay về bản cũ không liền kề được nhận; roundtrip nguyên byte | — |
| 2 (N02) | Tạo lịch rồi ghi MET với chữ thật xen NEL/VT/FF/FEFF/Hangul filler/emoji trong cả ba cột tùy chọn; xuất/nhập | 6/6 chuỗi được giữ theo optionalText và roundtrip nguyên byte | — |
| 3 (N03) | REJECTED có __proto__, thứ tự khóa lạ, FEFF trong chuỗi và raw nửa surrogate; lưu→đọc→xuất→nhập | Không đổi prototype; raw thành x�đuôi; roundtrip nguyên byte | — |
| 4 (N04 + labels) | Nhãn model chứa FEFF đầu/nửa surrogate; riêng 99 chữ x + nửa cao/thấp ở biên 100 unit | Lệnh nhận; đọc mất chữ/đổi độ dài; biên 100→102 làm backup BACKUP_INVALID rule 12 | CXR4-A1 |
| 5 (N05) | Chuỗi ba lịch dời: xóa hai tổ tiên→dọn giữ→khôi phục mắt giữa→xóa các lịch sống→dọn tiếp | Lần đầu giữ 2; lần sau xóa 3; sau mỗi lần roundtrip đạt | — |
| 6 (N08) | 700 tên chuẩn hóa có số astral/Ả Rập/toàn khổ, NFD và dấu nối; 500.000 bộ ba | 0 chu trình phát hiện; không khẳng định chứng minh tính bắc cầu trên mọi chuỗi | — |
| 7 (N09) | Gợi ý năm trước tại 60/61 ngày, năm nhuận 2028, biên 1900/2100 | 01/03/2027 có, 02/03 không; 29/02/2028 có, 01/03 không; không gợi ý ngoài miền | — |
| 8 (N11) | Helper giờ địa phương 00:00/23:59 qua năm mới + seed/backup tại UTC, UTC−11, UTC+14, Bangkok | 4/4 timezone đạt, hex 00010f10ff, roundtrip nguyên byte | — |
| 9 | File do nguồn lượt 3 119e2e4 xuất→nhập ở SHA ghim | Schema 12→13; 23 KH/171 lịch/30 HĐ sống giữ đúng | — |
| 10 | DB thật từng dùng ở probe exe lượt 3→exportBackup của nguồn lượt 3→nhập mới | Schema 12→13; 4 team/51 người/1.481 KH/10.255 lịch/1.674 HĐ | — |
| 11 | File sinh bằng nguồn Phase 5 0df3606 và nguồn phát hành 3d6c7fc→nhập mới | Cả hai schema 9→13; 1.200 KH/6.206 lịch/946 HĐ sống giữ đúng | — |
| 12 (N10 + verification) | Tải chuẩn→readTables của app→147 tổ hợp góc nhìn/kỳ→dọn→readTables | Toàn bộ bảng sống và KPI/snapshot trước/sau giống nhau; hash tải ad82051b…92e25 đúng baseline | — |
| 13 | Cùng DB tải: listTrash/preview của mã cũ/mới, rồi bỏ cả hai index 0012 và đọc lại | Cùng dòng/kế hoạch; không khác dữ liệu do index/CROSS JOIN | — |

Giới hạn tương thích: không tự mở exe cũ hoặc bấm nút Xuất trong UI. Ca 10 lấy **DB vật lý do exe lượt 3 đã chạy** (probe Codex của chính mình); ca 9/11 chạy chính hàm xuất của nguồn lịch sử với dependency hiện có. Vì vậy không coi đây là nghiệm thu UI/Rust của exe cũ; phần đó thuộc B/F.

## 5. Phát hiện mới

### CXR4-A1 — Nhãn model chưa chặn UTF-16 lỗi, lệnh nhận nhưng bản xuất bị luật nhập từ chối

- **ID:** CXR4-A1
- **Mức:** Low
- **Trục:** D
- **Vị trí:** packages/db/src/common.ts:89 (isLabel); packages/db/src/ai-analyses.ts:156, :180, :242 (2e51e25).
- **Tình trạng:** CONFIRMED.
- **Liên quan:** DR6-49/107/108, DR5-13 (lệnh nhận ↔ nhập nhận); **có từ trước, lượt 1–3 bỏ sót ở nhãn model**. labels-old.json chạy trên nguồn 119e2e4 cho cùng kết quả. Không phải hồi quy do T-291 hoặc phần raw_output còn chưa sửa.
- **Kịch bản:** 4.
- **Mô tả:** isLabel chỉ kiểm chuỗi không rỗng và không NUL; không dùng isStorableText hoặc chặn BOM đầu. recordAiAnalysis trả nguyên model, nhưng sql.js đọc nửa surrogate thành ba U+FFFD/mất đuôi, hoặc bỏ U+FEFF đầu; nhãn sát trần 100 unit thành 102 nên mọi backup chứa dòng đó bị BACKUP_INVALID rule 12.
- **Tái hiện/bằng chứng:** từ repo ghim chạy Node với A/label-probe.mjs (loader trong script); provider OPENCODE_GO, reasoning MEDIUM, model = 'x'.repeat(99) + '\uD800' (và '\uDC00'). A/labels.json/log thật: inputUnits=100, readUnits=102, returnedSame=true, readSame=false; importBackup(exportBackup(db)) → accepted=false, code=BACKUP_INVALID, params.rule=12. FEFFalpha nhận rồi đọc alpha, roundtrip vẫn được nhưng chữ đổi. A/new-scenarios.mjs N04 kiểm chuỗi ngắn có đuôi tiếng Việt cũng mất đuôi.
- **Ảnh hưởng:** đường gọi lệnh DB với nhãn không hợp lệ (lỗi caller/integration); dòng AI chỉ thêm nên không sửa riêng được, cần xóa KH rồi dọn để loại nó. **Chưa thấy đường tạo model này từ màn hiện tại** vì UI chọn model trong danh sách đóng; không nâng thành lỗi thao tác bình thường hay mất dữ liệu đã lưu.
- **Đề xuất:** nhãn model phải lưu/đọc nguyên văn: chặn nửa surrogate bằng isStorableText và từ chối FEFF đầu (hoặc quy tắc ID model rõ, không âm thầm đổi model). Thêm test lệnh tại biên 100 unit và invariant xuất→nhập, kiểm từ chối không ghi dòng. Ước ≤10 SP + 15–30 dòng test, dưới 400 SP.

Không có PLAUSIBLE tồn đọng. Không cấp ID cho hai đột biến xanh ở nhóm test hẹp vì toàn A đã bắt chúng; không báo lại KNOWN hoặc dòng R thành phát hiện.

## 6. Bloat

| Đã chạy/đọc | Dữ liệu/phạm vi | Số/kết quả | ID |
|---|---|---|---|
| tsc --noEmit --noUnusedLocals --noUnusedParameters | domain và db, cấu hình repo | Cả hai exit 0 | — |
| codemap --check | Repo | Export maps are up to date | — |
| dependency-cruiser (đúng bin từ package.json) | apps + packages | 341 module / 1.435 dependency, 0 vi phạm | — |
| rg getter/row helper cũ + import zod | Source A và apps/packages | Không getter/row helper đã bỏ; 5 import còn lại đều zod/mini (có import type và test của AI) | — |
| Cỡ A theo baseline ghim | 104 file theo cách đếm size-report | 8.719 SP (+530 so lượt 3), 15.714 test (+1.829), 341 sinh (+2) | — |
| Bundle chung (không build lại ở A) | baseline.md, build không biến môi trường riêng | index.js 884.698 B, giảm 43.234 B so lượt 3; riêng PR #830 giảm 62.735 B min / 17.056 B gzip so trước PR | R1 DR6-25 |
| Refactor/helpers | common/person-references/domain, source diff | Các bản getter/update/seq/bỏ dấu/hex đã gom; hai randomText/lật byte và list(schema) giữ theo lý do đã duyệt, không phát hiện mới | — |

Không cài công cụ, không tự gọi một export không có caller ngoài file là code chết nếu nó phục vụ nội bộ. Đột biến cấu trúc M38–M40 ghi gate thật; chi phí bundle/exe mới của font/logo không thuộc A.

## 6a. Hiệu năng

**Máy/dữ liệu:** DESKTOP-KDURKJP, i9-12900K, Node v24.20.0. File tải chung; tables sha256 ad82051b19415726ff2be3d86357aeb463b9f13205a30d4531667aa5a9492e25. Không chạy test/build/mutation của Codex trong vòng đo; không quan sát được hoạt động reviewer khác. Không tự đo exe ở A.

**Đo cặp thích nghi:** cùng dữ liệu/engine/dependency, xen thứ tự cũ/mới, GC trước mỗi lần. Mã cũ 119e2e4 dùng **schema/index 0012 hiện tại** để tách thay code khỏi cỡ file; vì vậy không gọi đây là số tốc độ nguyên exe lượt 3. 13 mẫu read sau 2 warmup; nhập 6 mẫu sau 1 warmup, db mới mỗi mẫu.

| API Node | 119e2e4 chạy đối chứng (ms) | 2e51e25 (ms) | Đánh giá |
|---|---:|---:|---|
| listTrash, 113 dòng | 26,171 | 24,184 | nhanh hơn |
| previewPurge | 1,792 | 0,937 | nhanh hơn |
| exportBackup | 180,957 | 178,665 | không xấu hơn |
| listStageTransitions | 10,284 | 10,247 | không xấu hơn |
| listAppointments | 46,281 | 46,619 | +0,338 ms, trong nhiễu |
| importBackup (gồm nạp/kiểm/migrate/mở DB) | 815,807 | 864,075 | +48,269 ms, +5,9%; không chạm cả hai điều kiện >20% và >10 ms |

Vòng đầu chưa đo cặp (verification.json) cho import 1.239,969 ms, export 293,495 ms, listTrash 35,819 ms; dọn 113/1.313 dòng 129,629/170,596 ms. Giữ nguyên các số này trong phụ lục, **không che số cao**. Đo cặp là kiểm thêm do chúng cao hơn mốc; cùng code cũ/mới read/export đều trở về gần nhau, chưa đủ bằng chứng quy cho hồi quy. Số Node không được áp nhầm ngưỡng 500 ms của bước xác nhận nhập trên exe.

**Đối chứng Dọn sạch bổ sung** (5 mẫu sau 1 warmup mỗi bên/cỡ, cùng bytes mới trước mỗi lần, không persist, GC trước đo):

| Dòng Thùng rác | 119e2e4 chạy cặp (ms) | 2e51e25 trung vị (min–max), ms | Lượt 3 cùng máy, Node | Chuẩn bị lượt 4, Node |
|---|---:|---:|---:|---:|
| 113 | 85,206 | 85,941 (82,253–91,308) | 93,8 | 85,2 |
| 1.313 | 118,889 | 119,056 (117,300–122,717) | 109,8 | 129,8 |

Chênh mã cũ/mới +0,735/+0,166 ms; không chạm luật nhiễu. So số lượt 3, cỡ lớn +9,256 ms (+8,4%), cũng dưới luật nhiễu. Mốc sau #656 chưa có Dọn sạch nên không có số đối chiếu cho nó. Các mẫu 129,629/170,596 ms ban đầu không lặp lại ở phép đo cặp. Không thấy hồi quy P; ngưỡng thao tác exe ≤500 ms vẫn xác nhận bằng số chung 123,3 ms, không thay bằng số API Node.

**Mốc exe chung để so sau #656/lượt 3 (nguồn baseline.md, không phải đo lại của A):**

| Thao tác exe | Sau #656 | Lượt 3 | SHA ghim | Ngưỡng/kết quả |
|---|---:|---:|---:|---|
| backup.read | 835 ms | 827 ms | 977 ms | ≤2.000; +17%/+18%, chưa quá20% |
| backup.import | 43 ms | 47 ms | 47 ms | ≤500 |
| backup.export | 438 ms | 425 ms | 436 ms | ≤1.000 |
| trash.open | 34 ms | 38 ms | 32 ms | <200 |
| purge → thông báo 11j | chưa có | 151,8 ms | 123,3 ms | ≤500 |

Nguồn perf-paired.json và verification.json giữ min/max/từng mẫu. Các bảng sống và 147 tổ hợp KPI/snapshot trước/sau dọn giống hệt (verification.unchanged); không có phát hiện P mới được xác nhận.

## 7. Đếm mức × trục

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

CONFIRMED 1/1; PLAUSIBLE 0/1 (0%). Chỉ tính trục chính; R1/R2 và KNOWN không tính lại.

## 8. Đã xét, không thấy thêm theo trục

| Trục | Đã chạy/đọc và giới hạn |
|---|---|
| R | 18 R1 + 6 R2 phần A, replay qua baseline và mutation; không thấy phần sửa thiếu/hồi quy trong phạm vi được kiểm. |
| E | N01–N11, ngày 60/61, leap/domain boundary, nhãn model lỗi có A1; Unicode có chữ thật, KYC quay lại hash cũ, dời–giữ–khôi phục–dọn. |
| C | Spec/golden với stageAtEndOf/stageSnapshot/stagesOfDay, D7/E7/E20/TR-11–13, timestamp và K33; không thấy mâu thuẫn mới. Không đề xuất sửa golden cho khớp code. |
| D | A1; ngoài ra KYC hash/canonical JSON, restore/purge, 147 KPI, live tables và backup cũ/mới đều đạt; test transaction/rollback/migration/FK trong baseline. |
| G | Phần A: cổng KYC/material/evidence, giới hạn và lưu AI, input/output/evidence references, CURRENT/STALE theo seq; unit đạt, không gọi AI. Toàn validator/prompt/Mock thuộc C. |
| S | valueOf chặn NUL/surrogate/FEFF đầu ở file; strict envelope/kiểu/check/FK, SQL bind/quote; N03 prototype giữ an toàn. A1 thuộc D, không nhân đôi. |
| P | Đã đo tải, thích nghi đo cặp khi vòng đầu cao; đối chiếu baseline exe cùng máy và luật nhiễu. Không suy ra độ trễ màn từ API SQL/Node. |
| B | tsc/codemap/dependency-cruiser/rg/helper diff, baseline size/bundle. Không thấy bloat mới có chi phí cần cấp ID. |
| T | 44 file/1.470 test xanh; 37 đột biến hành vi và gate cấu trúc bổ sung. M19/M36 phải mở rộng toàn A mới đỏ, nên không báo false-positive từ nhóm hẹp. Không tuyên bố toàn codebase đạt mutation score 100%. |
| A | Định dạng Việt/byName/NFC/money/date và bốn timezone; errors có code/params cho i18n. Không có DOM ở A, không kết luận ARIA/focus của màn D/E. |

## 9. Phụ lục và kết thúc

### 9.1 Nguồn bằng chứng/lệnh

Mọi đường dẫn tương đối ở đây tính từ C:/workspace/deep-review-1-6-r4/codex/A/. Chạy Node bằng đường dẫn file tuyệt đối; CLI của test trong bản chép gọi thẳng node_modules/vitest/vitest.mjs, **không pnpm**.

- unit-baseline.json/log: node node_modules/vitest/vitest.mjs run packages/domain packages/db --reporter=json --outputFile=…; 44 file, 1.470 pass.
- setup-copy.mjs, copy-manifest.json: chép 793 file Git từ SHA ghim; junction dependency chỉ trỏ về worktree. review.vitest.config.mjs alias source domain/AI schema sang bản chép, tránh test lẫn code gốc. copy-restored.json kiểm nguyên byte mọi file đã chép.
- mutations.mjs, extra-mutants.mjs, mutation-definitions.json, extra-mutation-definitions.json; patch/log/JSON mỗi M. mutation-full.mjs/M19-full và mutation-M36-full.mjs/M36-full chứng minh hai mẫu sống ban đầu bị test ở file khác giết.
- static-mutations.mjs/structural.mjs: M38 zod classic bị no-restricted-imports; M39 đưa lại monthToDate đúng nguồn trước #801, codemap đỏ; M40 đưa lại updateTeamRow đúng nguồn trước #801, TS6133. M39-reexport.log là bước thăm dò export mẫu trước bước phục hồi đúng helper; không dùng nó thay bằng chứng M39-structural.log.
- new-scenarios.mjs/json/log; label-probe.mjs, labels.json/log; labels-old.mjs/json/log (nguồn lượt 3); timezones.mjs/json, timezone-child.mjs.
- old-backups.mjs, snapshot-r3/p5*.zip và cây nguồn riêng; export-old.mjs trong từng snapshot. phase5-release-compatibility.json/phase5-compat.mjs kiểm đúng 3d6c7fc. DB exe lượt 3 chỉ đọc tại probe Codex cũ B/exe/purge-ui/Project2C-data/project2c.db, không sửa nguồn cũ.
- verification.mjs/json/log, perf-paired.mjs/json/log, perf-purge-paired.mjs/json/log, lint-deps.log, inventory.mjs/json, test-map.json, diff-numstat.txt, session-journal.md.

Các lỗi harness đầu phiên (gọi addKycNote không public, xóa lặp dòng đã xóa trong N05, nhầm tên bin dependency-cruiser) đã sửa **trong probe/lệnh**; lần chạy hoàn chỉnh exit 0 mới được dùng. Không lấy các lỗi đó làm lỗi sản phẩm. codex --version có cảnh báo không tạo PATH alias trong sandbox, vẫn trả 0.162.1. Không gọi pnpm trong bản chép; không truy cập mạng từ probe.

### 9.2 Đột biến

| Mẫu | Test đỏ sau mở rộng cần thiết | Bằng chứng |
|---|---:|---|
| M01-E7 | 3 | M01-E7.json |
| M02-stamps | 3 | M02-stamps.json |
| M03-E20 | 4 | M03-E20.json |
| M04-BOM | 5 | M04-BOM.json |
| M05-surrogate | 1 | M05-surrogate.json |
| M06-money | 14 | M06-money.json |
| M07-date | 6 | M07-date.json |
| M08-controls | 3 | M08-controls.json |
| M09-ties | 3 | M09-ties.json |
| M10-REPLACE | 1 | M10-REPLACE.json |
| M11-person-ref | 4 | M11-person-ref.json |
| M12-recursion | 2 | M12-recursion.json |
| M13-system-count | 1 | M13-system-count.json |
| M14-initial-stage | 2 | M14-initial-stage.json |
| M15-seq | 1 | M15-seq.json |
| M16-order | 1 | M16-order.json |
| M17-NFKC | 1 | M17-NFKC.json |
| M18-storable-order | 1 | M18-storable-order.json |
| M19-update-helper | 1 | M19-full.json; nhóm hẹp ban đầu xanh |
| M20-versions | 7 | M20-versions.json |
| M21-canonical | 5 | M21-canonical.json |
| M22-rejected-cap | 1 | M22-rejected-cap.json |
| M23-optional | 1 | M23-optional.json |
| M24-prevyear | 3 | M24-prevyear.json |
| M25-digits | 2 | M25-digits.json |
| M26-VTFF | 1 | M26-VTFF.json |
| M27-index | 1 | M27-index.json |
| M28-rawlimit | 2 | M28-rawlimit.json |
| M29-RF | 1 | M29-RF.json |
| M30-owns | 2 | M30-owns.json |
| M31-D3 | 1 | M31-D3.json |
| M32-D11-notes | 1 | M32-D11-notes.json |
| M33-firstOfEach | 1 | M33-firstOfEach.json |
| M34-system-purge | 1 | M34-system-purge.json |
| M35-note-order | 1 | M35-note-order.json |
| M36-kyc-number | 1 | M36-full.json; nhóm hẹp ban đầu xanh |
| M37-new-version | 1 | M37-new-version.json |
| M38 import classic | gate ESLint exit 1 | M38-zod-import.log |
| M39 helper monthToDate cũ | gate codemap exit 1 | M39-structural.log, M39-old-helper.txt |
| M40 helper updateTeamRow cũ | tsc exit 2, TS6133 | M40-structural.log, M40-old-helper.txt |

37/37 mẫu hành vi bị giết sau khi chạy đúng phạm vi. Hai mẫu từng sống ở tập hẹp ghi rõ ở bảng; không có mẫu sống không tương đương chưa giải quyết trong bộ đã chọn. Ba gate cấu trúc không gộp vào tỉ lệ unit. Mỗi patch chỉ trên bản chép, finally trả nguyên byte.

### 9.3 Kiểm cuối

- SHA cuối: 2e51e25eb0125f56d3d938b97ef18d6873dae076, đúng SHA đầu.
- git status --short cuối: rỗng, giống đầu; git diff --exit-code exit 0.
- Bản chép: 793/793 file Git trở về nguyên byte (final-check.json; copy-restored.json); repo gốc không bị patch.
- Giờ xong: 2026-10-29 01:37:52 +07:00 (Asia/Bangkok).
- Kết quả gói A: R1 18/18, R2 6/6 ĐÃ SỬA trong phần A; 1 phát hiện mới Low trục D, không có Medium trở lên. Không kết luận phát hành, không tổng hợp các gói khác.
