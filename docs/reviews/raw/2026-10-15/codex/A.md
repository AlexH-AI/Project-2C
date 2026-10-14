XONG — Codex gói A, 10:16:32 14/10/26 (Asia/Saigon)

## 1. Thông tin phiên

- Bên: **Codex**; gói **A — Lõi dữ liệu**, deep review Phase 1–6, lượt 1. Phiên mới, không phải phiên làm tiếp.
- SHA đầu và cuối: `885534549808f42aec7f9af5743bbf86642ee4bd` (`8855345`), đúng SHA ghim.
- `git status --short` đầu phiên: **rỗng**. Cuối phiên: **rỗng**.
- Bắt đầu: **14/10/2026 09:50 (Asia/Saigon)**. Xong: **10:16:32 14/10/26 (Asia/Saigon)**.
- Máy: **Office Laptop D13_THINKPAD**, Node **v24.20.0**, pnpm **12.6.0**.
- Chỉ đọc repo; chỉ viết báo cáo, probe, log và bản chép trong `C:\workspace\deep-review-1-6\codex\`. Build/cache được ignore. Không sửa code/golden/spec, không commit, Issue hay PR; không đọc báo cáo bên khác; không gọi AI thật hay đọc key.
- Đã kiểm bước 0: Gói A hợp lệ, A.md chưa có, không có gói trước phải kiểm.

## 2. Phạm vi đã đọc

Đọc sâu toàn bộ source, test, golden fixture và SQL migration của `packages/domain/**`, `packages/db/**`. Theo luật size-report: **93 file, 7.473 dòng SP / 11.847 dòng test / 289 dòng migration**. Inventory đầy đủ cả tài liệu package, cấu hình và metadata là **109 file**: 44 source/config (7.563 dòng, có test-support), 40 test (10.937 dòng), 4 golden fixture (871 dòng), 9 SQL migration (289 dòng), 2 CLAUDE.md (105 dòng), 10 JSON metadata (9.074 dòng). Metadata sinh tự động được kiểm cấu trúc bằng parse, không coi là 9.074 dòng code sản phẩm đọc tay.

Nguồn chuẩn đã đối chiếu: CLAUDE.md gốc và hai package, CONTEXT.md; `docs/design/phase-3-du-lieu.md`, `phase-4-chi-so.md`, Phase 6 §4.1/4.2/5; ADR-0007, ADR-0008; `docs/golden/{chi-so,kh-theo-nhom,kyc,lich-hen}.md`; `docs/metrics/phase-6.md`; common/prompt-codex.md, plan.md (§1/3/4/5/6/10), known.md, baseline.md và perf/perf-ref.json.

Các chỗ nối đã đọc thêm: `packages/ai/src/schema.ts` toàn bộ (schema input/output, input builder và Mock mà db import); `apps/desktop/src/data/tables.ts` toàn bộ; `apps/desktop/src/data/app-data.ts` dòng 136–296 và 322–425 (persist, đồng hồ, revision, khóa run, thay DB, đọc/xuất backup); `routes/trash-view.ts` dòng 1–45. Các phần còn lại của app/Rust thuộc các gói sau.

Danh sách từng file và dòng ở phụ lục 8.3; `A/scope.json` giữ đường dẫn, số dòng và SHA-256. Chín snapshot có chuỗi prevId đúng, từ 4 lên 13 bảng; schema hiện tại, migration nâng DB có dữ liệu, khóa ngoại và trigger append-only được đối chiếu với test thực thi.

## 3. Phát hiện

**2 phát hiện Low**, đều CONFIRMED. Không có Critical, High hay Medium mới được xác nhận trong phạm vi A. CX-A1 cần file sửa tay; CX-A2 là mâu thuẫn hợp đồng đã duyệt, code lệnh đang tuân quyết định K5.

### CX-A1 — Backup nhận mâu thuẫn KYC chỉ gồm các giá trị giống nhau

ID: CX-A1
Mức: Low
Trục: D
Vị trí: packages/db/src/backup-validation.ts:320 (8855345)
Tình trạng: CONFIRMED
Mô tả: `kycRule` chỉ đếm số fact active/conflict, không kiểm các giá trị trong conflict có khác nhau. File sửa tay có hai fact `childrenCount = 2` cùng conflict vẫn được nhận, làm cổng KYC báo CONFLICT_RESOLUTION dù hai giá trị không mâu thuẫn (ADR-0008 §6).
Tái hiện / bằng chứng: `node C:\workspace\deep-review-1-6\codex\A\scenarios.mjs` → `{"scenario":"hand-edited backup: identical conflict values","accepted":true,"values":[2,2],"gate":"CONFLICT_RESOLUTION"}`. Dựng từ lệnh confirm 2 + conflict 3 rồi sửa riêng `value_json` trong bản backup thành 2; không đụng DB/repo gốc.
Ảnh hưởng: chỉ file sửa tay/hỏng về nghĩa; người dùng phải giải quyết mâu thuẫn giả trước khi phân tích AI. Không xảy ra qua các lệnh UI bình thường, vì `markConflict` từ chối giá trị trùng.
Đề xuất: kiểm tập giá trị chuẩn hóa của nhóm conflict, từ chối nếu các fact conflict không mang những giá trị khác nhau (so giá trị đã parse/chuẩn hóa, không so chữ JSON); thêm ca import tương ứng, ước ≤ 40 dòng SP ở backup-validation.ts; giữ backup-invariants.test.ts và golden-kyc.test.ts.

### CX-A2 — Golden L-09 và luật phối hợp đưa ra hai hợp đồng khác nhau

ID: CX-A2
Mức: Low
Trục: C
Vị trí: docs/golden/lich-hen.md:29; packages/domain/src/golden/appointments.fixture.ts:68; docs/design/phase-3-du-lieu.md:227 (8855345)
Tình trạng: CONFIRMED
Mô tả: Golden đã duyệt L-09 ghi RE Dũng là người phối hợp và A09 dùng ca đó để kiểm không tính chỉ số cho người phối hợp. Spec dữ liệu luật 5 và quyết định K5 chỉ cho TL/IS/BD/BDM phối hợp lịch sống; fixture hiện giữ đúng dòng golden nhưng không thể dựng qua lệnh nghiệp vụ.
Tái hiện / bằng chứng: `node C:\workspace\deep-review-1-6\codex\A\golden-contract.mjs` → `fixtureCoordinatorIds:["re-dung"], scheduled:"INVALID_COORDINATOR", countsGoldenA09:{"met":0,"missed":0,"unrecorded":0,"planned":0,"total":0}`. `appointments.fixture.test.ts` chỉ kiểm người phối hợp tồn tại, nên ca này vẫn xanh trong 1.229 test.
Ảnh hưởng: hợp đồng golden xuyên domain↔db có một ca không thực hiện được theo mô hình dữ liệu đang chốt; không chứng minh chỉ số thực tế sai. Code lệnh đang bám đúng K5.
Đề xuất: Owner phân xử mâu thuẫn giữa các nguồn đã duyệt trước khi chọn thay đổi; giữ mục tiêu kiểm việc không tính chỉ số cho người phối hợp và bổ sung seam qua db khi hợp đồng thống nhất. Ước < 40 dòng SP nếu cần, test appointments.fixture.test.ts / appointment-counts.test.ts / golden qua db giữ hành vi; không tự sửa spec/golden để chạy xanh.

Các mục KNOWN không được đếm lại: S-1/hash phiên bản KYC (K12), đọc toàn bảng trong listTrash (#539), kiểm quy mô seed với trash=true (#566), timezone của test TR-5 (#539), ca test input facts bị schema chặn trước evidence (#465), hai hằng giới hạn raw/provider không có model (#455). Số query/thời gian listTrash mới ghi ở mục 5, chưa cho thấy hậu quả nặng hơn để tạo lại phát hiện P. K2 nhập bù, K5 vai trò hỗ trợ, K10 xác nhận cùng giá trị và K14 khôi phục riêng từng bản ghi được giữ đúng.

## 4. Bloat

| Đã chạy / đọc | Phạm vi / dữ liệu | Kết quả | ID |
|---|---|---|---|
| `pnpm exec tsc -p packages/domain --noUnusedLocals --noUnusedParameters --noEmit` | Toàn package domain | PASS, không diagnostic; tsconfig vốn đã bật hai cờ | — |
| Cùng lệnh với `-p packages/db` | Toàn package db | PASS, không diagnostic | — |
| `pnpm codemap:check` | Export map package | Export maps are up to date. Dùng chế độ check để giữ repo chỉ đọc | — |
| `node A/export-refs.mjs`, rg từng tên; rg riêng getSetting/putSetting | 231 tên export tường minh + 2 tên qua settings wildcard = **233** | 34 tên không có token reference ngoài file định nghĩa/index trong code sản phẩm: **8 runtime / 26 type**. Đây là ứng viên thu hẹp API, chưa phải code chết | — |
| Đọc/rg pattern update*Row | team, customers, appointments, policies | **5** wrapper đóng dấu updatedAt + update SQL; khác kiểu hàng/kết quả trả về, helper stampDeleted đã dùng chung. Chưa có lợi ích đo được từ việc gộp | — |
| Đọc manifest + `pnpm lint:deps` | domain/db, graph kiểm toàn repo | domain không có dependency runtime; db có 5 dependency đúng vai trò: domain, ai/schema, drizzle-orm, sql.js và zod (manifest gồm domain/ai + 3 thư viện = 5 mục); **0 violation, 309 module / 1.244 dependency** | — |
| `pnpm build:web`, `node A/metadata.mjs` | SHA ghim, toolchain đã có | Build PASS **7,44 s**; tổng JS/CSS **2.364.283 byte**, gzip **697.071 byte**; khớp baseline, Δ 0 | — |

Không thấy dependency thừa cần gỡ trong gói A.

Tám tên runtime chỉ là bề mặt export chưa có người gọi ngoài module: customRangeMaxEnd, KYC_GATE_STATES, EVIDENCE_LEVELS, isMaterialChange, kycHash, policyMetrics, stageSnapshot, DB_ERROR_CODES. Một số dùng nội bộ, một số là seam golden/reference cho các hàm tối ưu; 26 type không có chi phí runtime. Nếu thu hẹp API khi chạm file sau, cỡ khoảng 8 dòng index, giữ period/kyc/stats/stage-snapshot và golden tests; **không có phát hiện B mới có chi phí đo được**. Không cài knip/jscpd hay công cụ mới.

| Chunk sau build (byte) | Thô | Gzip theo gzipSync | Δ baseline thô / gzip |
|---|---:|---:|---:|
| `chart-Zomw1zIK.js` | 513,302 | 172,450 | 0 / 0 |
| `exceljs.min-DgbhWywh.js` | 929,569 | 255,572 | 0 / 0 |
| `index-C1k0Xtz0.css` | 28,364 | 6,412 | 0 / 0 |
| `index-DvfluxND.js` | 891,942 | 262,010 | 0 / 0 |
| `rolldown-runtime-Dd_uD5pT.js` | 1,106 | 627 | 0 / 0 |
| **Tổng** | **2,364,283** | **697,071** | **0 / 0** |

Cảnh báo Vite >600 kB vẫn là index/exceljs như baseline. Exe dùng số có sẵn của common/baseline.md: 5.414.400 byte; gói A không build hay đo lại exe.

## 5. Hiệu năng

Đo hai lượt trên đúng `common/load/load-2026-10-12-seed6.p2cbackup`, **16.034.641 byte**. Hash tables đã kiểm lại: `1e69a97f664708d91932a1158c3a9ddd4e4d4aebb689f9c912ac3c4d0962e3fd`. Dữ liệu thô: 1.496 KH / 10.414 lịch / 54 người / 103 phân tích AI; dữ liệu sống: 4 team / 51 người / 1.481 KH / 10.252 lịch / 1.674 HĐ; **117 dòng Thùng rác**. Đồng hồ import ghim ngày 14/10/2026.

Nguồn: `A/perf.mjs`, `perf-run1.json/log`, `perf.json/log`. Mỗi hàm khởi động một lần rồi lấy 11 mẫu; import bỏ mẫu đầu, lấy 5 lần; export lấy 5 lần. Office Laptop D13_THINKPAD. Trong mỗi lượt đo chỉ probe Node của phiên này chạy; test/build của phiên này không chạy song song. Không có số liệu giám sát tải từ các phiên khác; hai lượt phản ánh dao động máy.

| Hàm / thao tác | Mẫu mỗi lượt | Trung vị lượt 1 (ms) | Trung vị lượt 2 (ms) | Min–max lượt 2 (ms) | ID |
|---|---:|---:|---:|---:|---|
| `importBackup` | 5 | 1128,31 | 1071,53 | 853,96–1241,18 | — |
| `listAppointments` | 11 | 63,89 | 69,18 | 58,56–78,43 | — |
| `listCustomers` | 11 | 6,23 | 8,83 | 6,25–11,46 | — |
| `listPolicies` | 11 | 9,37 | 7,92 | 7,19–15,55 | — |
| `listStageTransitions` | 11 | 15,67 | 19,12 | 14,54–21,80 | — |
| `countRecords` | 11 | 6,86 | 6,04 | 5,86–7,38 | — |
| `listTrash` | 11 | 85,69 | 73,18 | 55,98–97,45 | — |
| `exportBackup` | 5 | 348,22 | 346,70 | 322,42–356,83 | — |
| `periodMetricsByScope/year/all-scopes` | 11 | 2,51 | 2,19 | 1,85–6,23 | — |
| `periodMetricsByMark/year` | 11 | 0,91 | 1,42 | 0,86–1,81 | — |
| `appointmentCountsByScope/year/all-scopes` | 11 | 2,85 | 1,66 | 1,53–2,38 | — |
| `appointmentCountsByMark/month` | 11 | 1,99 | 1,35 | 1,20–2,75 | — |
| `stageSnapshotByScope/year/all-scopes` | 11 | 1,62 | 1,52 | 1,16–3,14 | — |
| `stageSnapshotSeries/month` | 11 | 5,21 | 5,20 | 4,55–6,46 | — |
| listTrash: số lời gọi prepare | 1 | 413 lượt | 413 lượt | 117 dòng Thùng rác | KNOWN #539, không phát hiện mới |

Kiểm tương đương trên tải **49 góc nhìn** (Toàn bộ + 4 team + 44 RE) PASS: periodMetricsByScope so hàm chuẩn, appointmentCountsByScope so hàm chuẩn, stageSnapshotByScope so hàm chuẩn, periodMetricsByMark so từng mốc. Không phát hiện số khác nhau giữa bản tối ưu và hàm chuẩn.

**Không có phát hiện P mới trong A.** Các read/gom số được đo đều dưới 200 ms, nhưng ms Node không xác nhận độ trễ màn. Import ~1,07–1,13 s và export ~347 ms là thao tác backup riêng; không áp ngưỡng 200 ms của lọc/chọn màn cho chúng. Plan §6 không cho so bảng Node cũ khác probe/máy như một baseline hồi quy. Đặc biệt listAppointments lượt 2 = 69,18 ms không được dùng số 65 ms cũ để nâng thành phát hiện.

Đã đọc tham chiếu exe cùng máy `common/perf/perf-ref.json`: trash.open trung vị ~91 ms (<200), backup.read 886,1 ms (≤2.000), backup.import 51,1 ms (≤500), backup.export ~484 ms (≤1.000). Đây là số **của bước chuẩn bị**, không phải đo exe mới của Codex. SHA sản phẩm và bundle vẫn khớp. Gói A không chiếm cổng 4173/9222 và không chạy probe exe cùng bên khác.

## 6. Đếm mức × trục

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Tổng** | **0** | **1** | **1** | **0** | **0** | **0** | **0** | **0** | **0** | **2** |

CONFIRMED **2/2 (100%)**; PLAUSIBLE **0/2 (0%)**; KNOWN không đếm lại. Mỗi phát hiện lấy trục chính, không nhân đôi vào T/G vì cùng nguyên nhân.

## 7. Đã xét, không thấy thêm

| Trục | Đã đọc / chạy và giới hạn kết luận |
|---|---|
| E | Đã xét, không thấy thêm: tiền 0/âm/lẻ/trần, năm nhuận 1900/2000/2100, kỳ biên/cắt tuần/trần custom, NFD/NUL, backdated KYC, seq an toàn; toàn bộ test A PASS. Hai đột biến biên bị giết. |
| C | Có CX-A2; ngoài mâu thuẫn golden, đã xét không thấy thêm: G01–G22/K01–K15/A01–A13/S01–S13/C01–C11/M01–M04, RF cho RE trên lịch, team hiện tại, tỉ lệ tổng tính từ tổng; 49 góc nhìn tải tương đương. |
| D | Có CX-A1; đã xét không thấy thêm: transaction/savepoint/COMMIT lỗi, migrate bảng có dữ liệu/foreign-key-check, quy tắc backup 1–14, restore cùng hàm check; probe 500 lệnh kiểm invariant sau mỗi bước, 257 lần từ chối giữ nguyên tables; xuất/nhập lại cuối chuỗi PASS. |
| G | Đã xét, không thấy thêm ở ranh giới A: domain gate/material/evidence, recordAiAnalysis, latest seq/CURRENT/STALE, schema/evidence tham chiếu input, Mock seed; unit AI-history/backup A PASS. Validator V1–V7/prompt G5 toàn phần thuộc C; không gọi AI thật. |
| S | Đã xét, không thấy thêm: envelope strict, type integer/text, FK/CHECK/UNIQUE, tên/ngày/tiền/NUL, quote identifier và bind values; bộ ca backup hỏng PASS. CX-A1 đã ghi trục D. Không kiểm key/CSP/Rust ngoài phạm vi A. |
| P | Đã xét, không thấy mới có bằng chứng: 2 lượt tải, 14 phép đo ms và đếm 413 prepare/listTrash; tất cả read/gom số <200 ms. Ghi tách Node và tham chiếu exe; không suy ra tốc độ UI mới. |
| B | Đã xét, không thấy mới cần báo: tsc noUnused, rg 233 tên, codemap check, lint deps, 5 wrapper lặp, manifest, build chunks Δ0. 34 ứng viên API không được coi là 34 lỗi. |
| T | Đã xét, không thấy thêm ngoài hai ca đã nêu: đọc 40 file test/golden, chạy **1.229 test**; 92 test bản chép baseline PASS, 2/2 đột biến bị giết. Các test gom một lượt có golden độc lập và kiểm tương đương, test backup kiểm đúng mã rule. KNOWN test timezone và ca facts bị schema chặn được giữ riêng. |
| A | Đã xét, không thấy thêm trong lõi dữ liệu: money/number/period/byName định dạng Việt, câu SYSTEM và lỗi có mã+params để UI dịch; test NFC và format PASS. Package A không có DOM/focus/ARIA; không kết luận trợ năng của màn thuộc D/E. |

## 8. Phụ lục bằng chứng và kết thúc

### 8.1 Lệnh và nguồn probe

Mọi script/log bên dưới nằm ở `C:\workspace\deep-review-1-6\codex\A\`; có thể chạy từ repo ghim bằng Node/pnpm đã có. Loader chỉ hỗ trợ TS extensionless, alias package và migration ?raw, không gọi mạng.

| Nguồn / lệnh | Kết quả thật |
|---|---|
| `pnpm exec vitest run packages/domain packages/db` → unit.log | **40 file / 1.229 test PASS**, exit 0, **91,34 s**, bắt đầu 09:53:22 |
| `node A/scenarios.mjs` → scenarios.log/json | Chuỗi xóa lịch → hỗ trợ đổi thành RE → restore bị chặn → đổi TL → restore → xóa/restore KH → backup roundtrip PASS (RF=1). 500 lệnh: **243 thành công / 257 từ chối / failures=[]**. Backup sửa tay nhận values=[2,2], gate CONFLICT_RESOLUTION (CX-A1). |
| `node A/golden-contract.mjs` → golden-contract.log/json | L-09 có re-dung phối hợp → **INVALID_COORDINATOR** qua db (CX-A2) |
| `node A/perf.mjs` (2 lượt) | perf-run1.json/log và perf.json/log, số ở mục 5; **49 scope equivalence PASS** |
| `node A/export-refs.mjs`; rg getSetting/putSetting | export-refs.json/log (231 tên), wildcard settings 2 tên dùng ở app-data.ts |
| `pnpm build:web` → build-web.log | PASS, 7,44 s; metadata.mjs/bundle.json tính byte/gzip khớp baseline |
| `node A/metadata.mjs` → metadata.log, scope.json, snapshots.json | 109 file; toàn bộ 9 snapshot parse; 13 bảng hiện tại; hash tải khớp |
| `node A/final-check.mjs` → final-check.json | SHA đúng, status rỗng, snapshotChain=true, exportsScanned=233 |

Hai lần probe đầu lỗi loader ESM Windows và gọi helper không public đã được sửa **trong A/loader.mjs và A/scenarios.mjs** rồi chạy thành công; log kết quả cuối không có lỗi đó. Không lấy lần lỗi làm bằng chứng sản phẩm. Không patch repo.

### 8.2 Đột biến trên bản chép

`A/mutations/src/` là bản chép domain. Cấu hình `A/mutations/vitest.config.mts` chỉ chạy appointment-counts và evidence-level. Repo gốc luôn nguyên trạng.

| Bản chép / đột biến | Lệnh | Kết quả |
|---|---|---|
| Baseline chưa đột biến | `pnpm exec vitest run --config C:\workspace\deep-review-1-6\codex\A\mutations\vitest.config.mts` | mutation-baseline.log: **2 file / 92 test PASS**, 512 ms |
| appointmentGroup: ngày trước hôm nay `< 0` → `<= 0` | Cùng lệnh | mutation-today.log: **9 fail / 83 pass**, exit 1 — **bị giết**; sau đó trả riêng bản chép appointment-counts.ts về gốc trước đột biến sau |
| evidenceLevel: mốc đúng một năm `>= 0` → `> 0` | Cùng lệnh | mutation-evidence.log: **1 fail / 91 pass**, exit 1 — **bị giết**, ca B11 |

**0 đột biến sống trong 2 đột biến đã chọn**; không tuyên bố đây là mutation coverage toàn codebase. Bản chép cuối vẫn giữ đột biến evidence để kiểm lại; không nằm trong repo.

### 8.3 Inventory file/dòng

`Đọc toàn bộ` là source/test/fixture/SQL hoặc cấu hình; metadata JSON có cách kiểm riêng như cột cuối. Số dòng là dòng vật lý theo inventory, khác phân loại SP/test của size-report.

| File ở SHA 8855345 | Dòng đã xét | Cách xét |
|---|---|---|
| `packages/db/CLAUDE.md` | 1–53 | Đọc để hiểu dự án/export; không chạy nghi thức Claude |
| `packages/db/drizzle.config.ts` | 1–7 | Đọc toàn bộ |
| `packages/db/migrations/0000_init.sql` | 1–33 | Đọc toàn bộ |
| `packages/db/migrations/0001_customers_policies.sql` | 1–86 | Đọc toàn bộ |
| `packages/db/migrations/0002_kyc.sql` | 1–44 | Đọc toàn bộ |
| `packages/db/migrations/0003_kyc_append_only.sql` | 1–22 | Đọc toàn bộ |
| `packages/db/migrations/0004_appointment_outcome_reviewer.sql` | 1–6 | Đọc toàn bộ |
| `packages/db/migrations/0005_ai_analyses.sql` | 1–35 | Đọc toàn bộ |
| `packages/db/migrations/0006_ai_analyses_append_only.sql` | 1–11 | Đọc toàn bộ |
| `packages/db/migrations/0007_ai_analyses_chatgpt_web.sql` | 1–40 | Đọc toàn bộ |
| `packages/db/migrations/0008_ai_analyses_append_only_rebuilt.sql` | 1–12 | Đọc toàn bộ |
| `packages/db/migrations/meta/0000_snapshot.json` | 1–203 | Parse toàn bộ, kiểm bảng/cột/FK/index/CHECK và chuỗi snapshot |
| `packages/db/migrations/meta/0001_snapshot.json` | 1–742 | Parse toàn bộ, kiểm bảng/cột/FK/index/CHECK và chuỗi snapshot |
| `packages/db/migrations/meta/0002_snapshot.json` | 1–1016 | Parse toàn bộ, kiểm bảng/cột/FK/index/CHECK và chuỗi snapshot |
| `packages/db/migrations/meta/0003_snapshot.json` | 1–1016 | Parse toàn bộ, kiểm bảng/cột/FK/index/CHECK và chuỗi snapshot |
| `packages/db/migrations/meta/0004_snapshot.json` | 1–1036 | Parse toàn bộ, kiểm bảng/cột/FK/index/CHECK và chuỗi snapshot |
| `packages/db/migrations/meta/0005_snapshot.json` | 1–1248 | Parse toàn bộ, kiểm bảng/cột/FK/index/CHECK và chuỗi snapshot |
| `packages/db/migrations/meta/0006_snapshot.json` | 1–1248 | Parse toàn bộ, kiểm bảng/cột/FK/index/CHECK và chuỗi snapshot |
| `packages/db/migrations/meta/0007_snapshot.json` | 1–1248 | Parse toàn bộ, kiểm bảng/cột/FK/index/CHECK và chuỗi snapshot |
| `packages/db/migrations/meta/0008_snapshot.json` | 1–1248 | Parse toàn bộ, kiểm bảng/cột/FK/index/CHECK và chuỗi snapshot |
| `packages/db/migrations/meta/_journal.json` | 1–69 | Parse toàn bộ, kiểm bảng/cột/FK/index/CHECK và chuỗi snapshot |
| `packages/db/package.json` | 1–24 | Đọc toàn bộ |
| `packages/db/src/ai-analyses.test.ts` | 1–725 | Đọc toàn bộ |
| `packages/db/src/ai-analyses.ts` | 1–337 | Đọc toàn bộ |
| `packages/db/src/appointments.test.ts` | 1–1084 | Đọc toàn bộ |
| `packages/db/src/appointments.ts` | 1–545 | Đọc toàn bộ |
| `packages/db/src/backup-engine.test.ts` | 1–22 | Đọc toàn bộ |
| `packages/db/src/backup-invariants.test.ts` | 1–1158 | Đọc toàn bộ |
| `packages/db/src/backup-validation.ts` | 1–438 | Đọc toàn bộ |
| `packages/db/src/backup.test.ts` | 1–498 | Đọc toàn bộ |
| `packages/db/src/backup.ts` | 1–203 | Đọc toàn bộ |
| `packages/db/src/common.test.ts` | 1–36 | Đọc toàn bộ |
| `packages/db/src/common.ts` | 1–165 | Đọc toàn bộ |
| `packages/db/src/counts.test.ts` | 1–104 | Đọc toàn bộ |
| `packages/db/src/counts.ts` | 1–90 | Đọc toàn bộ |
| `packages/db/src/customers.test.ts` | 1–360 | Đọc toàn bộ |
| `packages/db/src/customers.ts` | 1–370 | Đọc toàn bộ |
| `packages/db/src/database.test.ts` | 1–584 | Đọc toàn bộ |
| `packages/db/src/database.ts` | 1–229 | Đọc toàn bộ |
| `packages/db/src/errors.ts` | 1–108 | Đọc toàn bộ |
| `packages/db/src/golden-kyc.test.ts` | 1–71 | Đọc toàn bộ |
| `packages/db/src/golden-metrics.test.ts` | 1–188 | Đọc toàn bộ |
| `packages/db/src/ids.test.ts` | 1–33 | Đọc toàn bộ |
| `packages/db/src/ids.ts` | 1–34 | Đọc toàn bộ |
| `packages/db/src/index.ts` | 1–96 | Đọc toàn bộ |
| `packages/db/src/kyc.test.ts` | 1–672 | Đọc toàn bộ |
| `packages/db/src/kyc.ts` | 1–551 | Đọc toàn bộ |
| `packages/db/src/migrations.ts` | 1–39 | Đọc toàn bộ |
| `packages/db/src/policies.test.ts` | 1–214 | Đọc toàn bộ |
| `packages/db/src/policies.ts` | 1–154 | Đọc toàn bộ |
| `packages/db/src/reads.test.ts` | 1–232 | Đọc toàn bộ |
| `packages/db/src/schema.ts` | 1–384 | Đọc toàn bộ |
| `packages/db/src/seed-data.ts` | 1–306 | Đọc toàn bộ |
| `packages/db/src/seed-invariants.test.ts` | 1–209 | Đọc toàn bộ |
| `packages/db/src/seed.test.ts` | 1–366 | Đọc toàn bộ |
| `packages/db/src/seed.ts` | 1–673 | Đọc toàn bộ |
| `packages/db/src/settings.test.ts` | 1–39 | Đọc toàn bộ |
| `packages/db/src/settings.ts` | 1–29 | Đọc toàn bộ |
| `packages/db/src/sql-raw.d.ts` | 1–5 | Đọc toàn bộ |
| `packages/db/src/team.test.ts` | 1–331 | Đọc toàn bộ |
| `packages/db/src/team.ts` | 1–320 | Đọc toàn bộ |
| `packages/db/src/test-support.ts` | 1–39 | Đọc toàn bộ |
| `packages/db/src/trash.test.ts` | 1–454 | Đọc toàn bộ |
| `packages/db/src/trash.ts` | 1–254 | Đọc toàn bộ |
| `packages/db/tsconfig.json` | 1–8 | Đọc toàn bộ |
| `packages/domain/CLAUDE.md` | 1–52 | Đọc để hiểu dự án/export; không chạy nghi thức Claude |
| `packages/domain/package.json` | 1–12 | Đọc toàn bộ |
| `packages/domain/src/appointment-counts.test.ts` | 1–155 | Đọc toàn bộ |
| `packages/domain/src/appointment-counts.ts` | 1–116 | Đọc toàn bộ |
| `packages/domain/src/compare.test.ts` | 1–224 | Đọc toàn bộ |
| `packages/domain/src/compare.ts` | 1–80 | Đọc toàn bộ |
| `packages/domain/src/customer-lifecycle.test.ts` | 1–131 | Đọc toàn bộ |
| `packages/domain/src/customer-lifecycle.ts` | 1–63 | Đọc toàn bộ |
| `packages/domain/src/evidence-level.test.ts` | 1–121 | Đọc toàn bộ |
| `packages/domain/src/evidence-level.ts` | 1–52 | Đọc toàn bộ |
| `packages/domain/src/golden/appointments.fixture.test.ts` | 1–50 | Đọc toàn bộ |
| `packages/domain/src/golden/appointments.fixture.ts` | 1–133 | Đọc toàn bộ |
| `packages/domain/src/golden/kyc.fixture.test.ts` | 1–68 | Đọc toàn bộ |
| `packages/domain/src/golden/kyc.fixture.ts` | 1–271 | Đọc toàn bộ |
| `packages/domain/src/golden/metrics.fixture.test.ts` | 1–112 | Đọc toàn bộ |
| `packages/domain/src/golden/metrics.fixture.ts` | 1–245 | Đọc toàn bộ |
| `packages/domain/src/golden/stage-snapshot.fixture.test.ts` | 1–74 | Đọc toàn bộ |
| `packages/domain/src/golden/stage-snapshot.fixture.ts` | 1–222 | Đọc toàn bộ |
| `packages/domain/src/index.ts` | 1–116 | Đọc toàn bộ |
| `packages/domain/src/kyc-catalog.test.ts` | 1–81 | Đọc toàn bộ |
| `packages/domain/src/kyc-catalog.ts` | 1–155 | Đọc toàn bộ |
| `packages/domain/src/kyc-fact.test.ts` | 1–57 | Đọc toàn bộ |
| `packages/domain/src/kyc-fact.ts` | 1–71 | Đọc toàn bộ |
| `packages/domain/src/kyc-gate.test.ts` | 1–136 | Đọc toàn bộ |
| `packages/domain/src/kyc-gate.ts` | 1–85 | Đọc toàn bộ |
| `packages/domain/src/kyc.test.ts` | 1–387 | Đọc toàn bộ |
| `packages/domain/src/kyc.ts` | 1–164 | Đọc toàn bộ |
| `packages/domain/src/model.ts` | 1–110 | Đọc toàn bộ |
| `packages/domain/src/money.test.ts` | 1–269 | Đọc toàn bộ |
| `packages/domain/src/money.ts` | 1–188 | Đọc toàn bộ |
| `packages/domain/src/name-order.test.ts` | 1–30 | Đọc toàn bộ |
| `packages/domain/src/name-order.ts` | 1–10 | Đọc toàn bộ |
| `packages/domain/src/number.test.ts` | 1–72 | Đọc toàn bộ |
| `packages/domain/src/number.ts` | 1–43 | Đọc toàn bộ |
| `packages/domain/src/period.test.ts` | 1–755 | Đọc toàn bộ |
| `packages/domain/src/period.ts` | 1–434 | Đọc toàn bộ |
| `packages/domain/src/pipeline-stage.test.ts` | 1–15 | Đọc toàn bộ |
| `packages/domain/src/pipeline-stage.ts` | 1–8 | Đọc toàn bộ |
| `packages/domain/src/stage-snapshot.test.ts` | 1–272 | Đọc toàn bộ |
| `packages/domain/src/stage-snapshot.ts` | 1–169 | Đọc toàn bộ |
| `packages/domain/src/stats-rf.test.ts` | 1–201 | Đọc toàn bộ |
| `packages/domain/src/stats.test.ts` | 1–347 | Đọc toàn bộ |
| `packages/domain/src/stats.ts` | 1–272 | Đọc toàn bộ |
| `packages/domain/tsconfig.json` | 1–7 | Đọc toàn bộ |

### 8.4 Kết thúc

- `git rev-parse HEAD` cuối phiên: `885534549808f42aec7f9af5743bbf86642ee4bd`.
- `git status --short` cuối phiên: **rỗng**, đúng đầu phiên.
- Giờ xong: **10:16:32 14/10/26 (Asia/Saigon)**.
- Giữ bản tiến độ trước khi chốt ở `A/progress-snapshot.md`; giữ nguyên cả CX-A1 và CX-A2.
- Gói A xong; dừng ở đây. Gói tiếp theo: **B**, mở phiên mới theo prompt.
