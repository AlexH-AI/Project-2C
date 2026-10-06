# Deep review Phase 1–4 — Gói A: domain (Codex độc lập)

Ngày: **05/10/2026**, múi giờ Asia/Saigon. SHA: **f0c53eb57eb7eac8665ad87287e794ae4c5bc43b**. Worktree: `C:\workspace\Project-2C-review-2`, detached.

Kết quả: **5 phát hiện mới CONFIRMED: 1 Medium, 4 Low; 0 PLAUSIBLE**. Không có Critical/High trong phạm vi A. Hai lỗi hành vi hiện tại là tổng tiền vượt miền số nguyên an toàn và parser tiền tràn stack với chuỗi dấu trừ dài. Các số của golden khớp spec. Đây là báo cáo riêng Gói A; không kết luận SẴN SÀNG/CHƯA SẴN SÀNG cho đóng Phase 4 (kết luận đó thuộc Gói H).

## 1. Phạm vi và tính độc lập

- Đã kiểm SHA trước khi đọc, kiểm lại sau probe và lúc ghi báo cáo; tất cả khớp SHA trên.
- Không mở, đọc, liệt kê hay tìm kiếm thư mục review của bên kia; không đọc báo cáo review của bên kia cho đợt này; không tổng hợp với báo cáo khác.
- Không sửa file trong repo, không commit, không viết code sản phẩm. Mọi bản sao dùng mutation, test tạm, cache và log nằm trong `codex/A/`; báo cáo này nằm ở `codex/A.md`.
- `git diff --exit-code` xanh. Ba đường untracked đã có từ đầu phiên và giữ nguyên: `.agents/`, `.codex/`, `AGENTS.md`. Đã so SHA-256 của toàn bộ 36 file TS domain với manifest lập trước probe; không file nào đổi.
- Không tạo Issue, không đề xuất merge. Không đổi golden, kể cả ở các bản sao mutation.

Đọc trước: `docs/process/deep-review-phase-1-4.md` (§1/4/5/7), `CLAUDE.md`, `CONTEXT.md`, `docs/design/phase-3-du-lieu.md`, `docs/design/phase-4-chi-so.md`, cả bốn `docs/golden/{chi-so,kyc,lich-hen,kh-theo-nhom}.md`. Đọc thêm ADR-0008, quy tắc package domain, db và app desktop. Đã đọc `common/{README,known,baseline}.md`; không chép lại số baseline.

Đọc toàn bộ 36 file TS domain, gồm 15 file source chính, 4 fixture và 17 file test. Phạm vi từng file (dòng cuối tính theo nội dung tại SHA ghim):

| File | Dòng đã đọc |
|---|---:|
| `packages/domain/src/appointment-counts.test.ts` | 1–106 |
| `packages/domain/src/appointment-counts.ts` | 1–80 |
| `packages/domain/src/compare.test.ts` | 1–224 |
| `packages/domain/src/compare.ts` | 1–82 |
| `packages/domain/src/customer-lifecycle.test.ts` | 1–152 |
| `packages/domain/src/customer-lifecycle.ts` | 1–72 |
| `packages/domain/src/golden/appointments.fixture.test.ts` | 1–50 |
| `packages/domain/src/golden/appointments.fixture.ts` | 1–133 |
| `packages/domain/src/golden/kyc.fixture.test.ts` | 1–68 |
| `packages/domain/src/golden/kyc.fixture.ts` | 1–271 |
| `packages/domain/src/golden/metrics.fixture.test.ts` | 1–112 |
| `packages/domain/src/golden/metrics.fixture.ts` | 1–245 |
| `packages/domain/src/golden/stage-snapshot.fixture.test.ts` | 1–74 |
| `packages/domain/src/golden/stage-snapshot.fixture.ts` | 1–222 |
| `packages/domain/src/index.ts` | 1–107 |
| `packages/domain/src/kyc-catalog.test.ts` | 1–81 |
| `packages/domain/src/kyc-catalog.ts` | 1–155 |
| `packages/domain/src/kyc-fact.ts` | 1–30 |
| `packages/domain/src/kyc-gate.test.ts` | 1–136 |
| `packages/domain/src/kyc-gate.ts` | 1–85 |
| `packages/domain/src/kyc.test.ts` | 1–386 |
| `packages/domain/src/kyc.ts` | 1–166 |
| `packages/domain/src/model.ts` | 1–110 |
| `packages/domain/src/money.test.ts` | 1–174 |
| `packages/domain/src/money.ts` | 1–136 |
| `packages/domain/src/number.test.ts` | 1–72 |
| `packages/domain/src/number.ts` | 1–43 |
| `packages/domain/src/period.test.ts` | 1–692 |
| `packages/domain/src/period.ts` | 1–408 |
| `packages/domain/src/pipeline-stage.test.ts` | 1–21 |
| `packages/domain/src/pipeline-stage.ts` | 1–13 |
| `packages/domain/src/stage-snapshot.test.ts` | 1–228 |
| `packages/domain/src/stage-snapshot.ts` | 1–151 |
| `packages/domain/src/stats-rf.test.ts` | 1–195 |
| `packages/domain/src/stats.test.ts` | 1–211 |
| `packages/domain/src/stats.ts` | 1–208 |

Đọc cấu hình `packages/domain/{package.json,tsconfig.json}`, `vitest.config.ts`, `package.json`; dùng bản đồ export có sẵn trong `packages/domain/CLAUDE.md`. Để xác nhận đường gọi, chỉ đọc phần liên quan ở `packages/db/src/{common,metrics,customers,policies,backup}.ts`, các điểm gọi version ở `kyc.ts`, các đoạn caller trong `apps/desktop/src/routes/{overview/overview-view,appointments/appointments-view,customers/customers-view,customers/policy-form}.ts` và `customers/PolicyDialogs.tsx`. Rà identifier bằng TypeScript AST trên 230 file tracked trong `apps/packages/tools/e2e` cho ba export nghi không có caller; không coi đây là review đầy đủ các gói B–G.

## 2. Phát hiện

### CX-A1 — Tổng tiền hợp lệ riêng lẻ vượt miền an toàn, sai số và làm KPI ném lỗi

- **ID:** CX-A1
- **Mức:** Medium
- **Trục:** E (biên số lớn; hệ quả liên quan C/D)
- **Vị trí:** `packages/domain/src/stats.ts:88`, `:103`, `:105`, `:194`, `:199`; cổng định dạng `packages/domain/src/money.ts:95` (f0c53eb57eb7eac8665ad87287e794ae4c5bc43b). Đường nhận dữ liệu: `packages/db/src/common.ts:64`, `policies.ts:117`; đường dựng KPI: `apps/desktop/src/routes/overview/overview-view.ts:150`.
- **Tình trạng:** CONFIRMED; không trùng `common/known.md`.
- **Mô tả:** Các FYP đều có thể là số nguyên an toàn, nhưng `sum` và các phép `+=` trong tính Theo mốc không kiểm tổng. Khi tổng vượt `MAX_SAFE_INTEGER`, engine âm thầm mất độ chính xác, sau đó bộ định dạng tiền từ chối tổng đó bằng `RangeError`.
- **Tái hiện / bằng chứng:** chạy `probe.test.ts` (lệnh ở §3). Trên DB nhập từ dữ liệu tải, gọi `submitPolicy` với cùng ngày/kỳ và FYP `9007199254740991`, `2`, rồi `issuePolicy` cho cả hai. Lệnh thành công; đọc lại hai số đúng. Cô lập hai HĐ để tính: BigInt oracle = **9007199254740993**, `periodMetrics` và `periodMetricsByMark` đều trả Case size/Doanh số **9007199254740992**. `formatVndCompact` và `kpiTiles` ném `RangeError`. Xuất rồi nhập backup DB này vẫn được chấp nhận. Kết quả đầy đủ: `A/probe-results.json`, `A/probe.log`; nguồn ở Phụ lục B.
- **Ảnh hưởng:** dữ liệu tiền cực lớn nhưng hiện được app/backup cho phép, hoặc nhiều HĐ cộng lại vượt miền. Số tổng không còn chính xác và caller dựng KPI không hoàn tất. Đã xác nhận ở hàm thuần và lệnh DB; chưa chạy e2e trình duyệt cho ca này. Không phát hiện mất bản ghi DB trong probe; seed tải nguyên trạng không đạt ngưỡng này.
- **Đề xuất:** chốt cùng một miền cho tiền nhập, tổng và định dạng; kiểm phép cộng/giới hạn tổng có chủ đích, xử lý lỗi có mã trước khi đưa tổng không hợp lệ vào UI, hoặc dùng phép cộng chính xác và bộ định dạng tương ứng. Không bỏ `assertVnd` hay làm tròn để che lỗi. Guard cộng chung + xử lý caller dự kiến ≤400 dòng SP; đổi kiểu tiền xuyên DB/Excel cần ước lượng/task riêng. Thêm test tổng sát/vượt ngưỡng, cả tính một kỳ và Theo mốc; giữ nguyên golden.

### CX-A2 — Chuỗi dấu trừ dài làm parser tiền tràn stack trong đường đọc form

- **ID:** CX-A2
- **Mức:** Low
- **Trục:** E
- **Vị trí:** `packages/domain/src/money.ts:44–46` (f0c53eb57eb7eac8665ad87287e794ae4c5bc43b); caller `apps/desktop/src/routes/customers/policy-form.ts:24`, `:54` và `PolicyDialogs.tsx:88`.
- **Tình trạng:** CONFIRMED; không trùng KNOWN.
- **Mô tả:** `parseVnd` tự gọi lại sau mỗi dấu `-`/`−` ở đầu chuỗi. Chuỗi sai dài vượt stack thay vì trả `VndParseResult` lỗi, trong khi form HĐ gọi parser ngay trong render.
- **Tái hiện / bằng chứng:** `parseVnd('-'.repeat(32000) + '1')` → **RangeError: Maximum call stack size exceeded**. Cùng chuỗi qua `readPolicy({ submittedDate: '05/10/2026', submittedFyp: text, issued: null }, calendarDate(2026,10,5))` cũng ném `RangeError`; test xác nhận xanh. Lệnh/nguồn: `A/long-input.test.ts`, kết quả `A/long-input.json`, `A/long-input.log`.
- **Ảnh hưởng:** RE dán một chuỗi tiền sai dài vào form nhập/sửa HĐ hoặc đường khác dùng parser. Đường đọc form thất bại trước khi trả thông báo kiểm dữ liệu thông thường; suy luận ảnh hưởng render dựa trên caller trực tiếp, chưa bấm UI bằng trình duyệt. Đây là lỗi xử lý đầu vào cục bộ, không phải phát hiện bảo mật web hay mất DB.
- **Đề xuất:** đọc dấu âm một lần rồi kiểm phần số bằng logic không đệ quy; chuỗi nhiều dấu trả lỗi định dạng. Giữ phân biệt âm/định dạng/phần lẻ theo các test hiện có. Dự kiến <50 dòng SP; thêm test chuỗi dấu dài và chuỗi âm bình thường.

### CX-A3 — Bộ lọc Team dựng lại Set cho từng bản ghi

- **ID:** CX-A3
- **Mức:** Low
- **Trục:** P
- **Vị trí:** `packages/domain/src/stats.ts:84–85`, nhánh Team `:35–38` (f0c53eb57eb7eac8665ad87287e794ae4c5bc43b); caller `apps/desktop/src/routes/appointments/appointments-view.ts:215`, `customers/customers-view.ts:61`.
- **Tình trạng:** CONFIRMED, có số đo trên dữ liệu tải.
- **Mô tả:** `inScope` gọi `scopeMatcher` cho mỗi bản ghi. Caller lọc toàn bộ lịch hẹn theo Team vì vậy quét danh sách nhân sự và cấp phát Set 10.434 lần trong một lượt, dù bộ thành viên Team không thay đổi trong lượt đó.
- **Tái hiện / bằng chứng:** import nguyên `common/load/load-backup.json`; 1.496 KH, 10.434 lịch, 51 người, 1.804 HĐ, 4.978 transition. 10 lượt làm nóng + 60 lượt đo, không coverage, ngoài import/read/assertion. `appointments.filter(a => inScope(people,a.reId,team))`: median **5,969 ms**, p95 **6,649 ms**; dựng cùng `scopeMatcher` một lần trước filter: median **0,264 ms**, p95 **0,356 ms**, cùng danh sách ID. Chênh median khoảng **22,6 lần / 5,705 ms**. Caller thật `appointmentRows(..., team, 'any')`: median **7,113 ms**, p95 **8,034 ms**. Nguồn và toàn bộ mẫu: `A/probe.test.ts`, `A/probe-results.json`.
- **Ảnh hưởng:** mỗi lượt lọc Team trên danh sách lịch/KH. Xếp Low vì chi phí tuyệt đối ở bộ tải này còn nhỏ; không suy ra giật UI hay số FPS từ số đo Node, không coi đây là chứng minh mở app chậm.
- **Đề xuất:** dựng matcher một lần trong mỗi lượt tính/lọc, giữ `inScope` cho kiểm đơn lẻ. Không cache toàn cục dễ cũ khi RE đổi Team. Helper đã có; thay hai caller và expose seam phù hợp dự kiến <100 dòng SP. Kiểm ID trước/sau giống nhau, rồi đo cùng probe.

### CX-A4 — Test domain để lọt lỗi năm thế kỷ và biên VND lớn nhất

- **ID:** CX-A4
- **Mức:** Low
- **Trục:** T
- **Vị trí:** `packages/domain/src/period.test.ts:41`, `:379`, `:392`; `packages/domain/src/money.test.ts:24` (f0c53eb57eb7eac8665ad87287e794ae4c5bc43b).
- **Tình trạng:** CONFIRMED bằng mutation độc lập ngoài repo.
- **Mô tả:** Bộ 508 test domain kiểm nhiều năm nhuận và các miền năm, nhưng thiếu ngày 29/02 ở năm thế kỷ không chia hết 400; parser cũng thiếu ca số nguyên an toàn lớn nhất được chấp nhận. Hai lỗi cụ thể dưới đây đều để nguyên toàn bộ golden và vẫn qua 508 test.
- **Tái hiện / bằng chứng:**
  1. `m-century`: thêm đúng một nhánh trong `lastDayOfMonth`: `if (year === 2100 && month === 2) return 29;` → **17 file / 508 test xanh**, dù `calendarDate(2100,2,29)` trả ngày không có thật.
  2. `m-max`: đổi đúng một điều kiện parser để trả `too-large` cả khi `amount === Number.MAX_SAFE_INTEGER` → **17 file / 508 test xanh**, dù SHA gốc chấp nhận số này.
  3. Đối chứng `m-end`: đổi ngày cuối kỳ từ `<=` sang `<` → **36 test đỏ / 472 xanh**, 6 file đỏ; xác nhận runner thực sự chạy code bị patch.
  4. Hai test hợp đồng bổ sung trong `boundary-contract.test.ts`: baseline **2 xanh**; mỗi mutant sống nói trên **1 đỏ / 1 xanh**. Log/patch: `A/{m-century,m-max,m-end}.{log,patch}`, `A/contract-*.log`. Nguồn đầy đủ ở phụ lục.
- **Ảnh hưởng:** regression ở biên có thể được chấp nhận dù bộ domain đang đạt ngưỡng coverage. Không khẳng định hai mutation là lỗi đang có ở SHA gốc, cũng không khẳng định cả suite DB/e2e của repo để lọt; đã đo bộ domain của Gói A.
- **Đề xuất:** bổ sung literal oracle cho 1900/2000/2100 quanh 28–29/02, `MAX_SAFE_INTEGER` và số kế tiếp trong parse/format; bổ sung ca tổng vượt biên của CX-A1. Không sửa kỳ vọng golden. 0 dòng SP, dự kiến <100 dòng test.

### CX-A5 — Ba helper public không có caller sản phẩm

- **ID:** CX-A5
- **Mức:** Low
- **Trục:** B
- **Vị trí:** `packages/domain/src/pipeline-stage.ts:11` (`compareStages`), `stats.ts:114` (`isRfAppointment`), `period.ts:263` (`monthToDate`); barrel `index.ts:1`, `:26`, `:73` (f0c53eb57eb7eac8665ad87287e794ae4c5bc43b).
- **Tình trạng:** CONFIRMED qua rg và rà identifier TypeScript AST.
- **Mô tả:** Trong repo private này, cả ba helper chỉ xuất hiện ở định nghĩa, barrel và test; không có module sản phẩm gọi. `isRfAppointment`/`monthToDate` còn hữu ích làm seam/tham chiếu cho test, nhưng không cần bề mặt public của package; `compareStages` không có caller ngoài test riêng.
- **Tái hiện / bằng chứng:** `node C:/workspace/deep-review-1-4/codex/A/export-scan.mjs` quét 230 file tracked TS/TSX/MJS trong apps/packages/tools/e2e. Với mỗi tên, bỏ `*.test.*`, chỉ còn file định nghĩa và `packages/domain/src/index.ts`. Bằng chứng từng occurrence + dòng: `A/export-uses.json`. `tsc --noUnusedLocals --noUnusedParameters` xanh: kiểm này không bắt exported API không có người dùng.
- **Ảnh hưởng:** bề mặt API và logic phải bảo trì/test dù app không dùng; không khẳng định tăng bundle hay ảnh hưởng người dùng hiện tại. Đây là nhận diện export dư, không phải nhận xét phong cách/đặt tên.
- **Đề xuất:** bỏ re-export public khi không có consumer; giữ helper cần cho test ở module nội bộ. Cân nhắc bỏ `compareStages` và test riêng nếu không có use case đã chốt. Không thay fixture hoặc đổi định nghĩa MTD/RF. Dự kiến <30 dòng SP.

## 3. Lệnh và bằng chứng

Mọi lệnh chạy từ `C:\workspace\Project-2C-review-2`. Config ở ngoài repo dùng `root/cacheDir` trong `codex/A`, không coverage, không config bundling. Module sản phẩm được đọc từ SHA ghim; mutation chạy bản sao domain riêng và giữ toàn bộ test/fixture gốc.

```powershell
# Domain gốc trong bản sao, 17 file / 508 test
$env:A_TEST_TARGET = 'baseline/src/**/*.test.ts'
pnpm exec vitest run --config C:/workspace/deep-review-1-4/codex/A/vitest.config.mjs --configLoader runner

# Probe trên code SHA gốc, 6 test; DB chỉ ở bộ nhớ
$env:A_TEST_TARGET = 'probe.test.ts'
pnpm exec vitest run --config C:/workspace/deep-review-1-4/codex/A/vitest.config.mjs --configLoader runner

# Chuỗi tiền sai dài, 1 test xác nhận
$env:A_TEST_TARGET = 'long-input.test.ts'
pnpm exec vitest run --config C:/workspace/deep-review-1-4/codex/A/vitest.config.mjs --configLoader runner

# Chuẩn bị patch trên bản sao rồi chạy từng mutant (exit 1 của m-end là mong đợi)
node C:/workspace/deep-review-1-4/codex/A/mutation-setup.mjs
$env:A_TEST_TARGET = 'm-century/src/**/*.test.ts' # tiếp: m-max, m-end
pnpm exec vitest run --config C:/workspace/deep-review-1-4/codex/A/vitest.config.mjs --configLoader runner

# Test hợp đồng bổ sung: baseline xanh, m-century/m-max đỏ như dự kiến
$env:A_TEST_TARGET = 'boundary-contract.test.ts'
$env:A_VARIANT = 'baseline' # tiếp: m-century, m-max
pnpm exec vitest run --config C:/workspace/deep-review-1-4/codex/A/vitest.config.mjs --configLoader runner

# Kiểm noUnused, không sinh file
pnpm exec tsc --project packages/domain/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters --incremental false

# Test domain ở UTC và America/New_York, mỗi lượt 508 xanh
$env:A_TEST_TARGET = 'baseline/src/**/*.test.ts'
$env:TZ = 'UTC' # tiếp: America/New_York
pnpm exec vitest run --config C:/workspace/deep-review-1-4/codex/A/vitest.config.mjs --configLoader runner

node C:/workspace/deep-review-1-4/codex/A/export-scan.mjs
git rev-parse HEAD
git diff --exit-code
git status --short
```

Log: `A/domain-tests.log`, `unused.log`, `probe.log`, `long-input.log`, `mutation-boundaries.log`, `m-*.log`, `contract-*.log`, `timezone-UTC.log`, `timezone-America-New_York.log`. Không chạy lại full verify/e2e/Rust vì gói A thuần và baseline chung đã có; không nhận full repo là đã được review ở phiên này.

Máy đo riêng phiên này: **12th Gen Intel(R) Core(TM) i7-12800H**, Node **v24.20.0**, TZ **Asia/Saigon**. 10 lượt làm nóng, 60 mẫu riêng cho mỗi phép đo. Các số dưới là đo mới, không chép baseline:

| Phép tính trên load nguyên trạng | Median (ms) | p95 (ms) |
|---|---:|---:|
| Chỉ số một kỳ Năm, All | 1.614 | 2.145 |
| Chỉ số 12 mốc tháng, All | 0.889 | 1.178 |
| Đếm lịch kỳ Năm, All | 0.987 | 1.354 |
| Đếm lịch 12 mốc tháng, All | 1.049 | 1.406 |
| Dựng index KH + tính 31 ngày | 3.436 | 4.151 |
| Tính 31 ngày với index KH đã dựng | 2.779 | 3.276 |
| Lọc lịch Team bằng inScope từng dòng | 5.969 | 6.649 |
| Lọc lịch Team bằng matcher dựng một lần | 0.264 | 0.356 |
| Caller appointmentRows thực tế, Team | 7.113 | 8.034 |

## 4. Bảng đếm mức × trục

Mỗi phát hiện được đếm đúng một lần ở **trục chính**; C/D liên quan CX-A1 không cộng lặp.

| Mức | E | C | D | P | B | T | A | S | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Low | 1 | 0 | 0 | 1 | 1 | 1 | 0 | 0 | 4 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Tổng** | **2** | **0** | **0** | **1** | **1** | **1** | **0** | **0** | **5** |

CONFIRMED = 5; PLAUSIBLE = 0. KNOWN theo §5, không tính vào phát hiện mới.

## 5. KNOWN đã đối chiếu

- **KNOWN — common/known.md, OPEN, “Domain (R3): API nextKycVersion; ngày nhanh đầu năm”.** Không báo lại thiết kế API/before/previous hay gợi ý năm trước; đọc caller thấy hiện truyền `previous && before/profile` đúng cách dùng đã biết.
- **KNOWN — ACCEPTED, “Hành vi theo spec, lớp gọi phải tuân (#33, #36, #44, #62)”.** `suggestedQuestions` trả mọi hạng mục thiếu ở cả bốn trạng thái; current facts theo thao tác, không theo confirmedDate; RF dựa appointmentId; câu SYSTEM “Cập nhật KYC …” là dữ liệu đã chốt. Không coi đây là bug/i18n mới.
- **KNOWN — S-1/D-1: backup nhận kyc_versions.hash sai.** Không thử nhận lại hash sai để báo trùng. CX-A1 là tổng tiền, không liên quan hash; hash/version của domain đã xét theo tập fact hợp lệ.

## 6. Mọi trục đã xét; “đã xét, không thấy” và giới hạn

| Trục | Kết quả và cách đã xét |
|---|---|
| E — Edge case | CX-A1/CX-A2. Phần còn lại **đã xét, không thấy thêm**: rỗng/một phần tử qua 508 test; duyệt độc lập 73.414 ngày từ 1900–2100, kiểm độ dài 2.412 tháng, weekday liên tục, addDays và parse/format roundtrip; kiểm mốc báo cáo liền nhau; UTC/New_York đều xanh. Cùng ngày, reorder, chuỗi Unicode/newline/backslash, conflict/hash/immutability có test gốc và probe. |
| C — Hợp đồng | **Đã xét, không thấy sai khác golden/spec**, ngoài hệ quả tổng tiền CX-A1: đối chiếu G01–G22, K01–K15, A01–A13, S01–S13 và C/M trong spec; test golden xanh; 256 tổ hợp độ phủ KYC khớp luật G2; batch counts/metrics khớp tính từng mốc trên dữ liệu tải; stage series khớp oracle quét transition độc lập theo seq. Không đổi golden. |
| D — Dữ liệu | **Đã xét, không thấy mất bản ghi hay mutation input ở domain**; hàm A không có DB/file write/transaction. KYC operation thử trên profile đóng băng, before không đổi; hash đổi theo giá trị, không theo thứ tự. CX-A1 xác nhận sai dữ liệu tổng và dữ liệu gây lỗi được lệnh/backup chấp nhận; DB record gốc vẫn đúng. Kiểm migration/transaction/backup liên bảng đầy đủ thuộc B, không kết luận từ A. |
| P — Hiệu năng | CX-A3. Các engine còn lại **đã xét, không thấy điểm nghẽn đáng báo thêm ở bộ tải này**: số đo thật trong §3, đọc vòng lặp/index/map; không suy đoán render/bundle/mở app từ hàm Node. Dựng stage index + 31 ngày p95 4,151 ms; các engine metrics/counts p95 ≤2,145 ms trong những trường hợp đã đo. |
| B — Code dư | CX-A5. Phần khác **đã xét, không thấy thêm**: noUnused xanh, rà AST/rg + bản đồ export, đọc 15 module source và fixture; không thấy dependency mới/domain I/O; không báo wrapper/test oracle cần thiết là bloat chỉ vì một caller. Không có số đo bundle tiết kiệm cho CX-A5. |
| T — Chất lượng test | CX-A4. Xem assertion và fixture, không chiều golden; đối chứng mutation cuối kỳ bị 36 test bắt; hai mutant biên sống được test hợp đồng mới bắt. **Đã xét, không thấy assertion rỗng/flaky theo đồng hồ hay thứ tự** trong test domain đã đọc; bộ chạy ở ba múi giờ xanh. Không tuyên bố mutation score toàn bộ hoặc đủ sức bắt mọi lỗi. |
| A — Trợ năng / i18n | **Đã xét, không thấy phát hiện mới trong A**: domain không có DOM/focus/Tab/ARIA/màu. Kiểm định dạng tiền, số, ngày/giờ và dấu trong delta bằng test; câu hỏi/thông điệp KYC đối chiếu golden/ADR; câu SYSTEM theo KNOWN. Không dùng A để xác nhận trợ năng màn hình, việc đó thuộc D/E/F. |
| S — An toàn hẹp | **Đã xét, không thấy phát hiện mới trong A**: tên stamp dùng phần số của Date, formatIsoDate dùng ngày đã kiểm ở đường nhập; parser tiền không eval và hash nhận JSON entries. Không có quyền file/path/capabilities hay import backup trong A. Đã dùng importBackup để xác nhận CX-A1, không thực hiện audit S đầy đủ của B/C. CX-A2 phân loại edge đầu vào cục bộ, không mở rộng sang bảo mật web. |

## Phụ lục A. Tệp bằng chứng và tái chạy

- `A/manifest.json`: hash/line inventory trước probe, 36 file source/test; lúc ghi báo cáo đã so lại byte gốc.
- `A/probe-results.json`: dữ liệu tải, số đo máy, oracle và overflow; `A/long-input.json`: stack exception.
- `A/export-uses.json`: occurrence theo AST; `A/mutation-plan.json` và `A/m-*.patch`: thay đổi từng mutant.
- `A/baseline/src/`, `A/m-century/src/`, `A/m-max/src/`, `A/m-end/src/`: bản sao dùng thử, không phải thay đổi repo hay đề xuất code sản phẩm. Golden trong các bản sao giữ byte gốc.
- Lệnh ở §3 dùng dependency đã cài trong repo. Không cài công cụ/dependency mới.

## Phụ lục B. Nguồn đầy đủ của test/probe tạm và patch

Các test xác nhận lỗi hiện tại cố ý assert hành vi sai đã tái hiện (overflow/exception) để ghi bằng chứng; `boundary-contract.test.ts` assert đúng hợp đồng, đỏ trên mutant. Không đưa bất kỳ test tạm này vào repo.

### vitest.config.mjs

```javascript
const out = 'C:/workspace/deep-review-1-4/codex/A';
const repo = 'C:/workspace/Project-2C-review-2';
export default { root: out, cacheDir: out + '/.vite', resolve: { alias: { 'vitest': repo + '/node_modules/vitest/dist/index.js', '@p2c/domain': repo + '/packages/domain/src/index.ts', '@p2c/db': repo + '/packages/db/src/index.ts' } }, test: { include: [process.env.A_TEST_TARGET || 'baseline/src/**/*.test.ts'], testTimeout: 60000, fileParallelism: false, pool: 'forks', coverage: { enabled: false }, reporters: ['default'] } };
```

### probe.test.ts

```typescript
import { beforeAll, afterAll, expect, it } from 'vitest';
import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
import os from 'node:os';
import * as d from 'C:/workspace/Project-2C-review-2/packages/domain/src/index.ts';
import { scopeMatcher } from 'C:/workspace/Project-2C-review-2/packages/domain/src/stats.ts';
import * as dbApi from '@p2c/db';
import { kpiTiles } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/overview/overview-view.ts';
import { appointmentRows } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/appointments/appointments-view.ts';
const out = 'C:/workspace/deep-review-1-4/codex/A';
const summary: Record<string, unknown> = { node: process.version, cpu: os.cpus()[0]?.model, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone };
const save = () => fs.writeFileSync(out + '/probe-results.json', JSON.stringify(summary, null, 2));
const today = d.calendarDate(2026, 10, 5);
let database: Awaited<ReturnType<typeof dbApi.importBackup>>['db'];
let data: d.MetricsData;
let customers: ReturnType<typeof dbApi.listCustomers>;
let teams: ReturnType<typeof dbApi.listTeams>;
beforeAll(async () => {
  const text = fs.readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json', 'utf8');
  const start = performance.now();
  ({ db: database } = await dbApi.importBackup(text, { now: () => new Date(2026, 9, 5, 12) }));
  summary.importMs = performance.now() - start;
  data = dbApi.loadMetricsData(database);
  customers = dbApi.listCustomers(database);
  teams = dbApi.listTeams(database);
  summary.load = { customers: customers.length, appointments: data.appointments.length, people: data.people.length, policies: data.policies.length, transitions: data.transitions.length };
}, 60000);
afterAll(() => { database?.sqlite.close(); save(); });
it('Gregorian calendar and all month mark partitions throughout 1900..2100', () => {
  let totalDays = 0, months = 0;
  let previous: d.CalendarDate | null = null;
  for (let year = 1900; year <= 2100; year++) {
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const lengths = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (let month = 1; month <= 12; month++) {
      const length = lengths[month - 1]!;
      const period = d.periodOf('month', d.calendarDate(year, month, 1));
      expect(period.end.day).toBe(length);
      expect(() => d.calendarDate(year, month, length + 1)).toThrow(RangeError);
      const marks = d.reportMarks(period);
      expect(marks[0]?.start).toEqual(period.start);
      expect(marks.at(-1)?.end).toEqual(period.end);
      for (let i = 1; i < marks.length; i++) expect(d.daysBetween(marks[i - 1]!.end, marks[i]!.start)).toBe(1);
      months++;
      for (let day = 1; day <= length; day++) {
        const date = d.calendarDate(year, month, day);
        expect(d.parseDate(d.formatDate(date))).toEqual(date);
        expect(d.weekdayOf(date)).toBe((totalDays % 7) + 1);
        if (previous) expect(d.addDays(previous, 1)).toEqual(date);
        previous = date;
        totalDays++;
      }
    }
  }
  summary.calendar = { totalDays, months };
});
it('KYC gate exhausts 256 category combinations against explicit G2 rules', () => {
  const fieldGroups: d.KycField[][] = [['birthYear'], ['maritalStatus', 'childrenCount'], ['occupation'], ['totalAssets'], ['primaryGoal'], ['riskProfile'], ['hasProtection'], ['mainConcern']];
  for (let mask = 0; mask < 256; mask++) {
    const categories = d.KYC_CATEGORIES.filter((_, i) => mask & (1 << i));
    const fields = fieldGroups.flatMap((g, i) => mask & (1 << i) ? g : []);
    const facts: d.KycFact[] = fields.map((field, i) => ({ id: String(i), field, category: d.KYC_FIELDS[field].category, value: field === 'hasProtection' ? false : field === 'childrenCount' ? 0 : 'confirmed', noteId: 'n', confirmedDate: today, status: 'active' }));
    const count = categories.length;
    const expected = (mask & 7) !== 7 ? 'KYC_INSUFFICIENT' : count >= 6 && Boolean(mask & 16) && Boolean(mask & (8 | 64)) ? 'PAIN_POINT_ANALYSIS' : 'PROFILE_DISCOVERY';
    const gate = d.evaluateKycGate(facts);
    expect(gate.state, String(mask)).toBe(expected);
    expect(gate.presentCategories).toEqual(categories);
    expect(gate.aiAllowed).toBe(expected !== 'KYC_INSUFFICIENT');
  }
  summary.kycMasks = 256;
});
it('KYC hash preserves Unicode/newlines/backslashes and ignores only note metadata', () => {
  const base = d.addNote(d.EMPTY_KYC_PROFILE, { id: 'n', text: 'source', createdDate: today });
  const profile = (value: string) => d.confirmFact(base, { id: 'f', field: 'primaryGoal', value, noteId: 'n', confirmedDate: today });
  const values = ['Chuyển giao', 'Chuyển giao\nTài sản', 'Chuyển giao\\Tài sản', 'Chuyển giao😀', 'a'.repeat(100000)];
  expect(new Set(values.map(v => d.kycHash(profile(v)))).size).toBe(values.length);
  const a = profile(values[0]!);
  const frozen = (x: any): any => { Object.freeze(x); Object.values(x).forEach(v => { if (v && typeof v === 'object' && !Object.isFrozen(v)) frozen(v); }); return x; };
  frozen(a);
  const b = d.markConflict(a, { id: 'f2', field: 'primaryGoal', value: values[1]!, noteId: 'n', confirmedDate: today });
  expect(a.facts[0]!.status).toBe('active');
  expect(d.resolveConflict(b, 'f2').facts.find(f => f.id === 'f2')?.status).toBe('active');
  expect(d.kycHash(b)).toBe(d.kycHash({ ...b, facts: [...b.facts].reverse() }));
});
it('large legitimate policy values overflow metrics through commands and backup', async () => {
  const customer = customers[0]!;
  const original = data.policies;
  const make = (amount: number) => dbApi.submitPolicy(database, { customerId: customer.id, reId: customer.reId, submittedDate: today, submittedFyp: amount });
  const p1 = make(Number.MAX_SAFE_INTEGER), p2 = make(2);
  dbApi.issuePolicy(database, p1.id, { issuedDate: today });
  dbApi.issuePolicy(database, p2.id, { issuedDate: today });
  const created = dbApi.listPolicies(database).filter(p => p.id === p1.id || p.id === p2.id);
  expect(created.map(p => p.submittedFyp).sort((a,b) => a - b)).toEqual([2, Number.MAX_SAFE_INTEGER]);
  const testData = { ...data, policies: created };
  const day = d.periodOf('day', today);
  const metrics = d.periodMetrics(testData, day, { kind: 'all' });
  const byMark = d.periodMetricsByMark(testData, [day], { kind: 'all' })[0]!;
  const exact = created.reduce((sum, p) => sum + BigInt(p.submittedFyp), 0n);
  expect(Number.isSafeInteger(metrics.caseSize)).toBe(false);
  expect(BigInt(metrics.caseSize)).not.toBe(exact);
  expect(byMark.caseSize).toBe(metrics.caseSize);
  expect(() => d.formatVndCompact(metrics.caseSize)).toThrow(RangeError);
  expect(() => kpiTiles(testData, day, { kind: 'all' }, today)).toThrow(RangeError);
  const backup = dbApi.exportBackup(database);
  const imported = await dbApi.importBackup(backup, { now: () => new Date(2026, 9, 5, 12) });
  expect(dbApi.listPolicies(imported.db).filter(p => p.id === p1.id || p.id === p2.id)).toHaveLength(2);
  imported.db.sqlite.close();
  summary.overflow = { amounts: created.map(p => p.submittedFyp), exact: String(exact), computed: String(metrics.caseSize), revenue: String(metrics.revenue), byMark: String(byMark.caseSize), commandAccepted: true, backupAccepted: true, kpiThrows: true };
  data = { ...data, policies: original };
});
it('batch stats and stage counts match simple independent scans on load data', () => {
  const period = d.periodOf('year', today);
  const marks = d.reportMarks(period);
  const scope: d.Scope = { kind: 'all' };
  const batched = d.periodMetricsByMark(data, marks, scope);
  expect(batched).toEqual(marks.map(m => d.periodMetrics(data, m, scope)));
  expect(d.appointmentCountsByMark(data.appointments, marks, scope, data.people, today)).toEqual(marks.map(m => d.appointmentCounts(data.appointments, m, scope, data.people, today)));
  const dates = d.chartMarks(d.periodOf('month', today)).map(m => m.end);
  const series = d.stageSnapshotSeries(customers, data.transitions, data.people)(dates, scope);
  const key = (date: d.CalendarDate) => date.year * 10000 + date.month * 100 + date.day;
  const independent = dates.map(date => {
    const latest = new Map<string, d.CustomerStage>();
    for (const t of data.transitions) if (key(t.date) <= key(date)) latest.set(t.customerId, t.to);
    const counts = { N4: 0, N3: 0, N2: 0, N1: 0, ON_HOLD: 0, LOST: 0 };
    for (const c of customers) { const stage = latest.get(c.id); if (stage) counts[stage]++; }
    return counts;
  });
  expect(series).toEqual(independent);
  summary.loadOracleChecks = { marks: marks.length, snapshotDays: dates.length };
});
it('measures domain CPU costs on load data, excluding import/read/assertions', () => {
  const bench = (fn: () => unknown, iterations = 60) => {
    for (let i = 0; i < 10; i++) fn();
    const values: number[] = [];
    for (let i = 0; i < iterations; i++) { const start = performance.now(); fn(); values.push(performance.now() - start); }
    values.sort((a,b) => a-b);
    return { iterations, medianMs: +values[Math.floor(values.length / 2)]!.toFixed(3), p95Ms: +values[Math.floor(values.length * .95)]!.toFixed(3), minMs: +values[0]!.toFixed(3), maxMs: +values.at(-1)!.toFixed(3) };
  };
  const scope: d.Scope = { kind: 'team', teamId: teams[0]!.id };
  const all: d.Scope = { kind: 'all' };
  const year = d.periodOf('year', today), marks = d.reportMarks(year);
  const dates = d.chartMarks(d.periodOf('month', today)).map(m => m.end);
  const series = d.stageSnapshotSeries(customers, data.transitions, data.people);
  const filterOld = () => data.appointments.filter(a => d.inScope(data.people, a.reId, scope));
  const filterOnce = () => { const match = scopeMatcher(data.people, scope); return data.appointments.filter(a => match(a.reId)); };
  expect(filterOld().map(a => a.id)).toEqual(filterOnce().map(a => a.id));
  const viewData = { ...data, teams, customers };
  summary.benchmarks = {
    periodMetricsYear: bench(() => d.periodMetrics(data, year, all)),
    periodMetricsByMarkYear: bench(() => d.periodMetricsByMark(data, marks, all)),
    appointmentCountsYear: bench(() => d.appointmentCounts(data.appointments, year, all, data.people, today)),
    appointmentCountsByMarkYear: bench(() => d.appointmentCountsByMark(data.appointments, marks, all, data.people, today)),
    stageSeriesBuildAnd31Days: bench(() => d.stageSnapshotSeries(customers, data.transitions, data.people)(dates, all)),
    stageSeriesReuse31Days: bench(() => series(dates, all)),
    inScopePerAppointmentTeam: bench(filterOld),
    oneMatcherAppointmentsTeam: bench(filterOnce),
    appointmentRowsTeam: bench(() => appointmentRows(viewData, scope, 'any')),
  };
  console.log(JSON.stringify(summary));
});
```

### long-input.test.ts

```typescript
import fs from 'node:fs';
import { expect, it } from 'vitest';
import { parseVnd } from 'C:/workspace/Project-2C-review-2/packages/domain/src/money.ts';
import { readPolicy } from 'C:/workspace/Project-2C-review-2/apps/desktop/src/routes/customers/policy-form.ts';
import { calendarDate } from 'C:/workspace/Project-2C-review-2/packages/domain/src/period.ts';
it('long malformed signs throw rather than returning a parse error', () => {
  const text = '-'.repeat(32000) + '1';
  let error: unknown;
  try { parseVnd(text); } catch (e) { error = e; }
  expect(error).toBeInstanceOf(RangeError);
  expect(() => readPolicy({ submittedDate: '05/10/2026', submittedFyp: text, issued: null }, calendarDate(2026, 10, 5))).toThrow(RangeError);
  fs.writeFileSync('C:/workspace/deep-review-1-4/codex/A/long-input.json', JSON.stringify({ length: text.length, error: String(error), readPolicyThrows: true }, null, 2));
});
```

### mutation-setup.mjs

```javascript
import fs from 'node:fs';
const out = 'C:/workspace/deep-review-1-4/codex/A';
const variants = [
  { name: 'm-century', file: 'period.ts', before: 'function lastDayOfMonth(year: number, month: number): number {', after: 'function lastDayOfMonth(year: number, month: number): number {\n  if (year === 2100 && month === 2) return 29;' },
  { name: 'm-max', file: 'money.ts', before: "if (!Number.isSafeInteger(amount)) return { ok: false, error: 'too-large' };", after: "if (!Number.isSafeInteger(amount) || amount === Number.MAX_SAFE_INTEGER) return { ok: false, error: 'too-large' };" },
  { name: 'm-end', file: 'period.ts', before: 'return toDayNumber(period.start) <= day && day <= toDayNumber(period.end);', after: 'return toDayNumber(period.start) <= day && day < toDayNumber(period.end);' },
];
for (const v of variants) {
  fs.cpSync(out + '/baseline/src', out + '/' + v.name + '/src', { recursive: true });
  const target = out + '/' + v.name + '/src/' + v.file;
  const source = fs.readFileSync(target, 'utf8');
  if (source.split(v.before).length !== 2) throw new Error('Patch must match once: ' + v.name);
  fs.writeFileSync(target, source.replace(v.before, v.after));
  fs.writeFileSync(out + '/' + v.name + '.patch', '--- baseline/src/' + v.file + '\n+++ ' + v.name + '/src/' + v.file + '\n@@\n-' + v.before + '\n+' + v.after.replaceAll('\n', '\n+') + '\n');
}
fs.writeFileSync(out + '/mutation-plan.json', JSON.stringify(variants, null, 2));
fs.writeFileSync(out + '/mutation-boundaries.test.ts', `import { expect, it } from 'vitest';\nimport * as actual from './baseline/src/index.ts';\nimport * as century from './m-century/src/index.ts';\nimport * as maximum from './m-max/src/index.ts';\nit('baseline refuses 29/02/2100 and accepts the exact largest safe VND', () => {\n expect(() => actual.calendarDate(2100, 2, 29)).toThrow(RangeError);\n expect(actual.parseVnd(String(Number.MAX_SAFE_INTEGER))).toEqual({ ok: true, amount: Number.MAX_SAFE_INTEGER });\n});\nit('century mutant violates the calendar contract', () => {\n expect(century.calendarDate(2100, 2, 29)).toEqual({ year: 2100, month: 2, day: 29 });\n expect(() => century.calendarDate(2100, 2, 29)).not.toThrow();\n});\nit('maximum mutant rejects an amount the baseline accepts', () => {\n expect(maximum.parseVnd(String(Number.MAX_SAFE_INTEGER))).toEqual({ ok: false, error: 'too-large' });\n});\n`);
console.log('Three isolated mutants prepared; golden files unchanged.');
```

### mutation-boundaries.test.ts

```typescript
import { expect, it } from 'vitest';
import * as actual from './baseline/src/index.ts';
import * as century from './m-century/src/index.ts';
import * as maximum from './m-max/src/index.ts';
it('baseline refuses 29/02/2100 and accepts the exact largest safe VND', () => {
 expect(() => actual.calendarDate(2100, 2, 29)).toThrow(RangeError);
 expect(actual.parseVnd(String(Number.MAX_SAFE_INTEGER))).toEqual({ ok: true, amount: Number.MAX_SAFE_INTEGER });
});
it('century mutant violates the calendar contract', () => {
 expect(century.calendarDate(2100, 2, 29)).toEqual({ year: 2100, month: 2, day: 29 });
 expect(() => century.calendarDate(2100, 2, 29)).not.toThrow();
});
it('maximum mutant rejects an amount the baseline accepts', () => {
 expect(maximum.parseVnd(String(Number.MAX_SAFE_INTEGER))).toEqual({ ok: false, error: 'too-large' });
});
```

### boundary-contract.test.ts

```typescript
import { expect, it } from 'vitest';
const variant = process.env.A_VARIANT || 'baseline';
const api = await import(`./${variant}/src/index.ts`);
it('a Gregorian century not divisible by 400 has no 29 February', () => {
  expect(() => api.calendarDate(2100, 2, 29)).toThrow(RangeError);
});
it('the exact largest safe integer is a readable whole dong amount', () => {
  expect(api.parseVnd(String(Number.MAX_SAFE_INTEGER))).toEqual({ ok: true, amount: Number.MAX_SAFE_INTEGER });
});
```

### export-scan.mjs

```javascript
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
const repo = 'C:/workspace/Project-2C-review-2', out = 'C:/workspace/deep-review-1-4/codex/A';
const ts = createRequire(repo + '/package.json')('typescript');
const targets = ['compareStages', 'isRfAppointment', 'monthToDate'];
const files = execFileSync('git', ['ls-files', 'apps', 'packages', 'tools', 'e2e'], { cwd: repo, encoding: 'utf8' }).trim().split('\n').filter(f => /\.(?:[cm]?ts|tsx|mjs)$/.test(f));
const occurrences = Object.fromEntries(targets.map(n => [n, []]));
for (const file of files) {
  const source = fs.readFileSync(repo + '/' + file, 'utf8');
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  function visit(node) {
    if (ts.isIdentifier(node) && targets.includes(node.text)) {
      const line = ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1;
      occurrences[node.text].push({ file, line, kind: ts.SyntaxKind[node.parent.kind] });
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
}
fs.writeFileSync(out + '/export-uses.json', JSON.stringify({ searchedFiles: files.length, occurrences }, null, 2));
for (const name of targets) {
  const nonTests = occurrences[name].filter(o => !/\.test\./.test(o.file));
  console.log(name, JSON.stringify([...new Set(nonTests.map(o => o.file))]));
}
const manifest = JSON.parse(fs.readFileSync(out + '/manifest.json', 'utf8'));
console.log(JSON.stringify({ files: manifest.length, linesIncludingFinalBlank: manifest.reduce((sum, row) => sum + row.lines, 0), tests: manifest.filter(row => row.file.endsWith('.test.ts')).length }));
```

### m-century.patch

```diff
--- baseline/src/period.ts
+++ m-century/src/period.ts
@@
-function lastDayOfMonth(year: number, month: number): number {
+function lastDayOfMonth(year: number, month: number): number {
+  if (year === 2100 && month === 2) return 29;
```

### m-max.patch

```diff
--- baseline/src/money.ts
+++ m-max/src/money.ts
@@
-if (!Number.isSafeInteger(amount)) return { ok: false, error: 'too-large' };
+if (!Number.isSafeInteger(amount) || amount === Number.MAX_SAFE_INTEGER) return { ok: false, error: 'too-large' };
```

### m-end.patch

```diff
--- baseline/src/period.ts
+++ m-end/src/period.ts
@@
-return toDayNumber(period.start) <= day && day <= toDayNumber(period.end);
+return toDayNumber(period.start) <= day && day < toDayNumber(period.end);
```
