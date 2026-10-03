# Big review Project-2C — Phase 3 (sâu) + Phase 1→3 (tổng thể)

- Reviewer: Claude Code (phiên sạch, model/effort: Opus 5.5 · effort do Owner chọn cho phiên, không subagent) · Ngày: 2026-09-30 · SHA: 0fa0eea · Thời gian review: ~40 phút wall-clock (16:58–17:35), gồm ~6 phút chạy lệnh
- Phạm vi đã đọc:
  - **Đọc kỹ:** `apps/desktop/src/data/{app-data,persist-queue,tauri-storage,AppDataContext}.ts(x)`, `apps/desktop/src/{main,App}.tsx`, `apps/desktop/src/shell/{CloseGuard,close-guard,SaveWarning,StartupError,startup-error}.ts(x)`, `apps/desktop/src/routes/{Settings,SettingsBackup}.tsx`, `apps/desktop/src/i18n/index.ts`, `apps/desktop/src-tauri/src/{lib.rs,storage.rs (phần code 1–416)}`, `tauri.conf.json`, `capabilities/default.json`, `Cargo.toml`; `packages/db/src/{database,common,migrations,backup,customers,appointments (118–500),kyc (144–513),policies,metrics,index}.ts`, `packages/db/migrations/*.sql`, `seed.ts` (1–140); `packages/domain/src/stats.ts` + diff domain Phase 3; `packages/ui/src/components/Dialog.tsx`; test: `backup.test.ts`, `golden-{metrics,kyc}.test.ts`, `app-data.test.ts` (phần replace/import); `.github/workflows/ci.yml`, `.githooks/pre-push`, `tools/*.ps1`, `.dependency-cruiser.cjs`, `vitest.config.ts`, `playwright.config.ts`, mọi `package.json`.
  - **Tài liệu:** `CLAUDE.md`, `HANDOFF.md`, `PROJECT-STATE.md`, `PROJECT-PLAN.md` §5 + §4.5, ADR-0001/0005/0006/0007/0008/0009/0010/0014/0015/0016/0017, spec `phase-3-du-lieu.md` (toàn bộ), `REVIEW-CHECKLIST.md`, `COMPARISON.md`, `metrics/phase-{1,2}.md`.
  - **Chỉ lướt:** các màn React còn lại (`routes/customers/*`, `routes/appointments/*`, `routes/team/*` — chỉ đọc đoạn liên quan phát hiện), phần test Rust trong `storage.rs`, `seed.ts` 140–475, `seed-data.ts`, `docs/golden/*.md`, mockup HTML (không so từng màn).
  - GitHub (chỉ đọc): danh sách Issue milestone Phase 3, phần "Test chấp nhận" / "File được phép" của 13 Issue, metadata + comment review của 15 PR.

## 1. Kết luận điều hành

- Verdict đóng Phase 3 (G7): **SẴN SÀNG CÓ ĐIỀU KIỆN**
  1. Sửa **A-001**: nhập `.p2cbackup` phải kiểm toàn vẹn dữ liệu (định dạng ngày, JSON dữ kiện KYC, bất biến nhóm KH / D10 / vai trò RE), không chỉ kiểm cấu trúc. Hiện một file sai nội dung vẫn nhập được, được lưu thành `project2c.db`, rồi làm trắng các màn Khách hàng / Lịch hẹn.
  2. Sửa **A-002**: khi mở DB mới lỗi trong lúc nhập hoặc nạp lại, DB đang dùng ngừng lưu mà không báo gì, và đóng app thì mất hết thay đổi sau đó. Cùng vùng code và cùng Issue với A-001 nên nên gộp.
  3. Nên có trong cùng đợt (không bắt buộc): **B-001** thêm ErrorBoundary làm lưới an toàn cho mọi lỗi render.
  4. Owner kiểm tay exe bản `724794a` như `HANDOFF.md` đã liệt kê.
- Không có phát hiện Critical. Luồng lưu chính (sql.js → `export()` → Rust ghi `.tmp` + `sync_all` + `rename`) đúng ADR-0016. Hàng đợi ghi gộp snapshot và `flush()` khi đóng, lock file chặn exe thứ hai, backup khởi động không đè bản tốt, file xuất không bao giờ ghi đè: đều đọc được từng bước và có test.
- Nghiệp vụ ở tầng DB chặt: D7, D10, D6, D9, D2 được thi hành trong lệnh nghiệp vụ. Golden G01–G22 và K01–K15 chạy **qua lệnh nghiệp vụ**, không insert thô. Fixture golden **không bị sửa** trong Phase 3 (`git log 7fddf0c..0fa0eea -- packages/domain/src/golden docs/golden` rỗng).
- Rủi ro lớn nhất còn lại nằm ở **dữ liệu không tin cậy đi vào**: nhập backup ở Phase 3, kéo snapshot ở Phase 6. Lớp kiểm hiện dựa vào CHECK/FK của SQLite, trong khi nhiều bất biến chỉ nằm trong lệnh nghiệp vụ.
- `pnpm verify` xanh: 696 test, coverage domain + db 99,45 / 98,56 / 100 / 99,76. `pnpm verify:rust` xanh: 36 test. **`pnpm e2e` local đỏ** 3/90 do vượt timeout 30 s khi 10 worker cùng seed; chạy riêng thì pass (A-003).
- Bảo mật tốt cho app local: lệnh Tauri không nhận đường dẫn, Explorer chạy qua `raw_arg` có ngoặc kép và không qua `cmd`, CSP chặt, quyền tối thiểu, CI dùng `pull_request` với token read. Chỉ còn việc ghim action theo SHA (B-004).
- Hiệu năng ổn ở quy mô demo (seed 3,7 s, DB 9,3 MB, `export()` 1–2 ms), nhưng `rfCount` O(A×T) đo được 119 ms/lần. Dashboard Phase 4 sẽ chậm rõ nếu không sửa trước (A-004).
- Sẵn sàng phase sau: Phase 5 phải quyết sớm cách gọi OpenCode Go và lưu key (CSP chặn gọi ra ngoài, Rust chỉ dùng `std` → G4/G6). Định dạng `.p2cbackup` hiện là **1 dòng JSON 10,5 MB**, chưa dùng được làm snapshot có diff đọc được như ADR-0010 (B-002).
- Quy trình: 15/15 PR mẫu có `REVIEW: PASS` trước merge, CI xanh và nhãn `build-exe` đúng. 5/15 vượt ngưỡng ~400 dòng sản phẩm nhưng đều tự khai trong PR. Tài liệu trạng thái (`PROJECT-STATE.md`, `PROJECT-PLAN.md` §5, `metrics/phase-1.md`) lệch thực tế (B-005).

| Mức | MỚI | ĐÃ BIẾT | Tổng |
|---|---|---|---|
| Critical | 0 | 0 | 0 |
| High | 1 | 0 | 1 |
| Medium | 3 | 2 | 5 |
| Low | 5 | 2 | 7 |
| Nit | 2 | 0 | 2 |
| **Tổng** | **11** | **4** | **15** |

## 2. Kết quả chạy lệnh

| Lệnh | Kết quả | Ghi chú (số test, coverage domain/db, thời gian, lỗi) |
|---|---|---|
| `git rev-parse HEAD` / `git status` (đầu phiên) | `0fa0eea40203…` · sạch | Đúng SHA yêu cầu |
| `pnpm install --frozen-lockfile` | ✅ exit 0 | 0 s, lockfile up to date, pnpm 12.6.0 |
| `pnpm verify` | ✅ exit 0 | 85 s. format, eslint, `lint:deps` (172 module / 642 phụ thuộc, 0 vi phạm), `lint:tokens` sạch, typecheck. Vitest **45 file / 696 test** pass. Coverage (chỉ đo `packages/domain` + `packages/db`, ngưỡng gộp 95%): Stmts 99,45 · Branch 98,56 · Funcs 100 · Lines 99,76. `db/src` 99,25 / 97,9 / 100 / 99,68 (≥ 90% spec §8). `domain` 100% (không file nào dưới 100 trong bảng) |
| `pnpm e2e` | ❌ exit 1 | 208 s, 10 worker (máy 20 luồng). **87 pass, 3 fail** do `Test timeout of 30000ms exceeded`: `chart.spec.ts:35` (31,3 s), `demo-data.spec.ts:6` (35,5 s), `navigation.spec.ts:56` (35,4 s). `seed-timing` 3,6 s pass |
| `pnpm exec playwright test <3 spec trên> --workers=1` | ✅ 4/4 pass | 34,5 s; từng test 8,2 / 8,0 / 4,4 / 7,8 s. Đây là test chập chờn do tải, không phải lỗi logic (A-003) |
| `pnpm verify:rust` | ✅ exit 0 | 31 s; `cargo fmt --check`, `clippy -D warnings`, `cargo test --lib` **36/36** pass |
| Script tái hiện (Vitest, trong `review-reports\tmp\`) | ✅ 2 file giữ lại | `backup-invariants.repro.ts` (A-001), `replace-open-fails.repro.ts` (A-002); chạy từ thư mục repo: `pnpm exec vitest run --config C:/workspace/review-reports/tmp/vitest.repro.config.ts --silent=false`. Script đo hiệu năng `perf.repro.ts` (A-004, §4 trục 3.6) đã xóa sau khi đo; số liệu ghi trong `notes.md` |
| `git status` cuối | sạch | Chỉ còn `dist/`, `test-results/` (gitignored) do e2e sinh |

## 3. Phát hiện chi tiết

### [A-001] Nhập backup chỉ kiểm cấu trúc: file sai nội dung được nhập, được lưu, rồi làm vỡ màn hình — High · CONFIRMED · MỚI
- **Trục:** Toàn vẹn dữ liệu
- **Vị trí:** `packages/db/src/backup.ts:32-37` (zod envelope: `tables: z.record(z.string(), z.array(z.record(z.string(), z.unknown())))`), `backup.ts:126-151` (`load`: chỉ CHECK / UNIQUE / NOT NULL / `foreign_key_check`), `backup.ts:183-188` (`valueOf`: chỉ phân biệt integer / text); `apps/desktop/src/data/app-data.ts:251-264` (`readBackup` chỉ đếm 5 bảng); `packages/db/src/common.ts:40-43` (`fromIsoDate` ném `RangeError`); `packages/db/src/kyc.ts:488` (`JSON.parse(row.valueJson)`)
- **Quy tắc liên quan:** spec §6 ("kiểm bằng zod", file hỏng → từ chối); Issue #71 test chấp nhận "file hỏng / sai định dạng → lỗi có mã, dữ liệu hiện tại không đổi"; spec §3.3/§8 bất biến `customers.stage` = transition mới nhất, D10, `re_id` là RE; ADR-0010 (snapshot Phase 6 cũng đi đường này)
- **Mô tả:** zod chỉ kiểm vỏ ngoài; từng hàng chỉ được SQLite kiểm. Vì mọi ngày lưu dạng `text` không có CHECK định dạng, `value_json` là `text` tùy ý, còn các bất biến (nhóm KH, D10, vai trò RE, người phối hợp ≠ RE, fact thuộc note cùng KH, `birthYear`/`gender` chỉ từ `SYSTEM`) chỉ nằm trong lệnh nghiệp vụ, nên một file sai nội dung đi qua được `importBackup`.
- **Bằng chứng:** `review-reports/tmp/backup-invariants.repro.ts`, tạo DB nhỏ rồi `exportBackup`, sửa một trường, sau đó `importBackup`:
  - `appointments[0].date = 'hello'`: nhập **thành công**, `listAppointments` ném `RangeError: Not a calendar date: NaN-undefined-undefined`
  - `appointments[0].date = '2026-02-30'`: nhập thành công, `RangeError: Not a calendar date: 2026-2-30`
  - `customers[0].stage = 'N1'` (transition cuối là N3) + `re_id` = id của TL: nhập thành công, `stage N1 latest transition to N3 reId is TL true`. Chỉ số lệch mà không báo
  - `kyc_facts[0].value_json = '{not json'`: nhập thành công, `getKycProfile` ném `SyntaxError`
  - Test hiện có (`backup.test.ts:221-252`) chỉ phủ hỏng cấu trúc: format, khóa, kiểu, FK, CHECK, id trùng.
- **Kịch bản lỗi:** file `.p2cbackup` bị sửa tay hoặc hỏng một phần, sai ở `stage_transitions[i].date` hoặc `kyc_*`. `readBackup` → `countRecords` không đọc transition hay KYC → hộp 10a hiện bình thường → "Backup và thay" → DB mới được `persist` thành `project2c.db` → mở **Khách hàng** (`CustomersScreen.tsx:35` gọi `listStageTransitions`) hoặc **Lịch hẹn** (`AppointmentsScreen.tsx:57`) hoặc hồ sơ KH (`CustomerProfile.tsx:35-46`) → `RangeError` khi render → app không có ErrorBoundary (B-001) nên React gỡ cả cây → **cửa sổ trắng**. Mở lại exe vẫn vậy. Chỉ gỡ được bằng Cài đặt → nhập file khác / nạp lại, hoặc chép tay từ `backups\`. Nếu ngày hỏng nằm ở `appointments` / `policies`, `readBackup` ném `RangeError` (không phải `DbError`) → UI báo lỗi chung `settings.backup.failed` thay vì hộp 10b "file không dùng được". Phase 6: kéo snapshot từ remote cũng sẽ đi đường này.
- **Đề xuất sửa:** trong `importBackup`, sau `load` + `migrate` trên DB staging và trước `export`, chạy hàm `checkIntegrity(db)` mới trong `packages/db`:
  - (a) đọc lại toàn bộ qua repository: `listTeams`, `listPeople`, `listCustomers`, `listStageTransitions`, `listAppointments`, `listPolicies`, và `getKycProfile` + `listKycVersions` cho mọi KH, kể cả bản ghi xóa mềm (cần biến thể đọc gồm cả bản ghi đã xóa);
  - (b) kiểm bất biến: stage = `to` của transition mới nhất chưa xóa, ngày transition không giảm theo `seq`, `re_id` (KH / cuộc hẹn / HĐ) là người vai trò RE, người phối hợp ≠ RE, fact trỏ note cùng KH, `birthYear`/`gender` active chỉ từ note `SYSTEM`, `time` khớp `HH:MM`;
  - lỗi bất kỳ → `BACKUP_INVALID`.
  - Lớp thứ hai tùy chọn: zod schema theo từng bảng (regex ngày, enum).
  - Test: mỗi loại hỏng ở trên → `BACKUP_INVALID` và DB hiện tại không đổi; round-trip byte seed vẫn xanh.
- **Ước lượng:** M (~150 dòng sản phẩm, ~200 dòng test)

### [A-002] Mở DB mới lỗi khi nhập / nạp lại → DB đang dùng ngừng lưu mà không báo, đóng app mất thay đổi — Medium · CONFIRMED · MỚI
- **Trục:** Toàn vẹn dữ liệu
- **Vị trí:** `apps/desktop/src/data/app-data.ts:163-178` (`open` tăng `generation` **trước** `await openDatabase`), `:194-199`, `:212-225` (`replace`)
- **Quy tắc liên quan:** spec §5 (ghi lỗi → cảnh báo, thử lại); Issue #187 test chấp nhận "DB cũ không đóng khi thay thất bại (lần lưu trước lỗi, hoặc mở DB mới lỗi) — dữ liệu hiện tại vẫn dùng được"; T-057 (không mất dữ liệu khi đóng)
- **Mô tả:** `open()` chạy `++generation` rồi mới gọi `openDatabase`. Nếu `openDatabase` reject trong `replace`, `db` vẫn trỏ DB cũ, nhưng closure `persist` của DB cũ so `mine === generation` và nhận `false` → mọi transaction sau đó không vào `PersistQueue`. `failed()` = false, `unsaved()` = false → không có `SaveWarning`, và `CloseGuard.flush()` resolve ngay.
- **Bằng chứng:** `review-reports/tmp/replace-open-fails.repro.ts` (exe mode, `StoragePort` giả): `importBackup({...preview, bytes: 'not a database'})` reject → `app.run(createTeam('After failed import'))` → `saves before edit 1 after edit 1 failed() false unsaved() false`; trên đĩa `['Seed']`, trong bộ nhớ `['After failed import','Seed']`; `flush resolves (window would close): true`. Test `app-data.test.ts:435-451` chỉ chạy ở web mode (không có `storage`, `persist` luôn `undefined`) nên không bắt được.
- **Kịch bản lỗi:** Cài đặt → Nhập backup (hoặc Nạp lại) → `openDatabase` trên bytes mới reject (lỗi WASM / bộ nhớ, bytes hỏng do lỗi tương lai của `importBackup`) → UI báo "không nhập được", người dùng làm tiếp như thường → đóng app → mọi thay đổi từ lúc đó mất, không có hộp hỏi. Đường xảy ra hẹp (bytes vừa được chính app xuất ra), nhưng hậu quả là mất dữ liệu **im lặng**.
- **Đề xuất sửa:** chỉ đổi `generation` khi `openDatabase` đã resolve. Ví dụ: `const db = await openDatabase({ persist: (s) => { if (db === current) saves.persist(s) } })`, hoặc giữ `mine` nhưng `generation--` / khôi phục trong `catch`. Test: `memoryStorage` + import bytes hỏng → ghi tiếp trên DB cũ → `saves` có bản mới; làm tương tự cho `reloadDemoData` khi `openDatabase` lỗi.
- **Ước lượng:** S

### [B-001] Không có React ErrorBoundary: một lỗi render bất kỳ làm trắng cả cửa sổ — Medium · CONFIRMED · MỚI
- **Trục:** Kiến trúc / Toàn vẹn dữ liệu (khả năng phục hồi)
- **Vị trí:** `apps/desktop/src/main.tsx:14-33`, `apps/desktop/src/App.tsx:6-13` (grep `ErrorBoundary|componentDidCatch|getDerivedStateFromError` trong `apps/desktop/src`: rỗng)
- **Quy tắc liên quan:** ADR-0013 (UI chuyên nghiệp); spec §5 (lỗi → cảnh báo trên UI)
- **Mô tả:** Ở React 19, lỗi ném trong render mà không có boundary sẽ gỡ toàn bộ root. Mọi `useQuery(read)` chạy trong render (`AppDataContext.tsx:29-35`), nên dữ liệu lạ (A-001) hay bug hiển thị tương lai (Phase 4 dashboard) đều ra cửa sổ trắng, không có thông báo i18n và không có đường về Cài đặt. `CloseGuard` nằm trong cùng cây nên cũng bị gỡ theo → nút X đóng app ngay, không `flush()`.
- **Bằng chứng:** grep ở trên; A-001 cho ra `RangeError` trong `listStageTransitions` được gọi lúc render.
- **Kịch bản lỗi:** như A-001 → màn trắng. Thêm vào đó, nếu còn bản chờ ghi mà cây đã bị gỡ → đóng app không qua `CloseGuard`.
- **Đề xuất sửa:** boundary quanh nội dung từng màn trong `AppShell` (giữ sidebar để chuyển sang Cài đặt), hiện câu i18n + chi tiết kỹ thuật; đặt `CloseGuard` ngoài boundary. Test: component ném lỗi → boundary hiện thông báo, sidebar còn dùng được (Vitest + Testing Library không có trong dependency, nên dùng e2e với route test, hoặc tách hàm thuần như `startup-error.ts`).
- **Ước lượng:** S

### [A-003] `pnpm e2e` local không xanh ổn định: 3 test vượt timeout 30 s khi chạy song song — Medium · CONFIRMED · ĐÃ BIẾT (một phần)
- **Trục:** Test
- **Vị trí:** `playwright.config.ts:10-27` (timeout mặc định 30 s, workers mặc định); `e2e/chart.spec.ts:35`, `e2e/demo-data.spec.ts:6`, `e2e/navigation.spec.ts:56`
- **Quy tắc liên quan:** `CLAUDE.md` (`pnpm e2e` trong định nghĩa hoàn thành); ghi chú #155 trong `HANDOFF.md` ("`chart.spec.ts:35` từng vượt 30 s") và R4 (server cũ ở cổng 4173). Cả hai ghi chú chỉ nói về CI hoặc một spec, nên mức độ đang bị đánh giá thấp.
- **Mô tả:** mỗi lần tải trang ở web mode seed khoảng 3–4 s CPU. Ba spec tải trang 2–10 lần. Với 10 worker (mặc định trên máy 20 luồng) chúng tranh CPU và vượt 30 s. CI có `retries: 1` và ít core hơn nên che được lỗi này.
- **Bằng chứng:** `pnpm e2e`: `3 failed, 87 passed (3.4m)` với `Test timeout of 30000ms exceeded`. Chạy lại `--workers=1`: 4/4 pass, mỗi test 4–8 s.
- **Kịch bản lỗi:** Owner hoặc Claude chạy `pnpm e2e` trước commit trên máy nhiều core → đỏ ngẫu nhiên → quen bỏ qua e2e đỏ, dễ để lọt lỗi thật.
- **Đề xuất sửa:** `workers: process.env.CI ? undefined : 4` hoặc `test.slow()` cho 3 spec; tốt hơn là giảm số lần seed (vd. `chart.spec` chuyển màn bằng điều hướng hash, không `goto` lại trang). Test: `pnpm e2e` xanh 3 lần liên tiếp trên máy 20 luồng.
- **Ước lượng:** S

### [A-004] `rfCount` O(A×T): đo được 119 ms/lần, 30 lần gọi ≈ 1 s — Medium · CONFIRMED · ĐÃ BIẾT (R3, bị đánh giá thấp)
- **Trục:** Hiệu năng
- **Vị trí:** `packages/domain/src/stats.ts:62-88` (`isRfAppointment` gọi `transitions.some(...)` cho mỗi cuộc hẹn), `stats.ts:26-35` (`inScope` quét `people` cho mỗi bản ghi)
- **Quy tắc liên quan:** R3 #103 ghi chú "hiệu năng `rfCount` O(A×T)" (không chặn); PROJECT-PLAN Phase 4 (dashboard, drill-down, báo cáo tuần/tháng/năm)
- **Mô tả:** trên seed (6 229 cuộc hẹn × 3 309 transition), mỗi lần `rfCount` mất khoảng 20 triệu phép so sánh. Phase 4 cần tỉ lệ chốt cho 3 team + 30 RE × nhiều kỳ (12 tháng cho biểu đồ, MTD, tuần) → hàng trăm lần gọi mỗi lần render dashboard.
- **Bằng chứng:** `perf.repro.ts`: `rfCount year all ms 119` (313 RF); 30 lần với scope team: `1006 ms`. `loadMetricsData` 66 ms.
- **Kịch bản lỗi:** dashboard Phase 4 với biểu đồ 12 tháng × 3 team, cộng bảng 30 RE → 400–500 lần gọi → khoảng 50 s mỗi lần tính lại (sau mỗi `run()`).
- **Đề xuất sửa:** trong `domain`, dựng một lần `Map<appointmentId, transition>` (hoặc `Set` id cuộc hẹn RF) và `Map<reId, teamId>` rồi lọc O(A+T); giữ nguyên API và golden G01–G22. Làm **đầu Phase 4**, trước màn dashboard. Test: golden không đổi + test hiệu năng thô (vd. < 20 ms trên dữ liệu seed trong `db`).
- **Ước lượng:** S

### [B-002] `.p2cbackup` chưa dùng được làm snapshot Phase 6 như ADR-0010 yêu cầu — Medium · CONFIRMED · MỚI
- **Trục:** Kiến trúc / sẵn sàng Phase 6
- **Vị trí:** `packages/db/src/backup.ts:55-60` (`JSON.stringify` không xuống dòng, một file)
- **Quy tắc liên quan:** ADR-0010 ("mỗi bảng 1 file, bản ghi theo ID → diff đọc được"); spec §6 (".p2cbackup … cũng là khuôn snapshot cho đồng bộ Phase 6")
- **Mô tả:** file xuất trên seed là **một dòng dài 10 507 412 ký tự**. `exportedAt` đổi ở mỗi lần xuất, còn `updated_at` đổi ở mọi lần sửa. Commit file này vào `Project-2C-data` sẽ ra diff một dòng 10 MB mỗi lần: không đọc được, không phát hiện được xung đột theo bản ghi (ADR-0010).
- **Bằng chứng:** `perf.repro.ts`: `exportBackup ms 161 chars 10507412 lines 1`.
- **Kịch bản lỗi:** Phase 6 dùng thẳng `exportBackup` làm snapshot → repo dữ liệu phình nhanh, `git diff` vô dụng, logic xung đột phải tự parse JSON lớn.
- **Đề xuất sửa (Phase 6, không gấp):** thêm `exportSnapshot` (mỗi bảng một file `<table>.jsonl`, một dòng mỗi bản ghi theo khóa chính, `meta.json` chứa `schemaVersion` và không chứa `exportedAt` trong file bảng), dùng chung `load` + `checkIntegrity` (A-001) khi kéo về. Giữ `.p2cbackup` cho backup tay.
- **Ước lượng:** M

### [A-005] Tầng DB không chặn ngày tương lai cho sửa nhóm tay / HĐ; bất biến `stageOn(hôm nay) = customers.stage` chỉ đúng nhờ UI — Low · CONFIRMED · MỚI
- **Trục:** Nghiệp vụ
- **Vị trí:** `packages/db/src/customers.ts:158-167` (`changeStageManually`), `:196-234` (`appendTransition` chỉ so với transition mới nhất); `packages/db/src/policies.ts:101-115` (`validate`); UI chặn ở `apps/desktop/src/routes/customers/CustomerDialogs.tsx:62-65` ("a day after today is refused")
- **Quy tắc liên quan:** spec §4 ("UI không ghi thẳng; lệnh nghiệp vụ kiểm quy tắc bằng hàm của domain"); spec §8 bất biến `stageOn(ngày neo) = customers.stage`
- **Mô tả:** cuộc hẹn có `requireOutcomeDay` (MET / NO_SHOW không sau hôm nay), nhưng transition tay và HĐ thì không có kiểm nào tương tự. Quy tắc nằm ở UI, nên lời gọi khác (seed, nhập liệu Phase 4/5, test) có thể tạo transition ngày tương lai. Hệ quả: `customers.stage` ≠ `stageOn(hôm nay)`, và mọi kết quả cuộc gặp trước ngày đó bị `TRANSITION_BEFORE_LATEST`.
- **Bằng chứng:** đọc code: `appendTransition` không tham chiếu `db.now()`.
- **Kịch bản lỗi:** `changeStageManually(db, id, { to: 'N2', date: 31/12/2026 })` hôm 30/09 → được chấp nhận; ghi MET cho cuộc hẹn 05/10 → bị từ chối.
- **Đề xuất sửa:** kiểm "không sau hôm nay" (dùng helper `today(db)`, ghi chú #166 ĐÃ BIẾT) trong `changeStageManually` và `submitPolicy` / `issuePolicy`, kèm mã lỗi + câu i18n. Test ở `customers.test.ts` và `policies.test.ts`.
- **Ước lượng:** S

### [A-006] Xóa ngày sinh / chọn "Chưa rõ" giới tính cho KH đã có → báo lỗi chung, không nói lý do — Low · CONFIRMED · MỚI
- **Trục:** Nghiệp vụ / i18n
- **Vị trí:** `apps/desktop/src/routes/customers/CustomerDialogs.tsx:153` (`profileGender = gender === 'UNKNOWN' ? null : gender`), `:186-203`; `packages/db/src/kyc.ts:258-269` (`KYC_PROFILE_FIELD_REQUIRED`); `apps/desktop/src/i18n/index.ts:16-22` (`errorMessage` → `error.unknown` khi thiếu khóa)
- **Quy tắc liên quan:** D2; `CLAUDE.md` (mọi chuỗi UI qua i18n); spec §4 (lỗi → mã → UI hiện qua i18n)
- **Mô tả:** `vi.ts` không có `error.KYC_PROFILE_FIELD_REQUIRED` → người dùng thấy "Chưa lưu được thay đổi. Dữ liệu không bị đổi." (`vi.ts:615`) mà không biết phải làm gì. `useKycPreview` nuốt lỗi (`CustomerDialogs.tsx:101-103`), nên khung xem trước cũng không cảnh báo. Các mã khác thiếu câu: `INVALID_KYC_FIELD`, `KYC_NOTE_NOT_FOUND`, `KYC_VERSION_NOT_FOUND` (UI khó chạm tới), `SEED_DATABASE_NOT_EMPTY` (nội bộ).
- **Bằng chứng:** so danh sách mã trong `errors.ts` (41 mã) với khóa `error.*` trong `vi.ts`.
- **Kịch bản lỗi:** hồ sơ KH có năm sinh 1984 → Sửa → xóa ô Ngày sinh hoặc chọn giới tính "Chưa rõ" → Lưu → câu lỗi chung.
- **Đề xuất sửa:** thêm câu `error.KYC_PROFILE_FIELD_REQUIRED`, hoặc khóa tùy chọn trống / "Chưa rõ" khi KH đã có giá trị. Thêm test i18n: mọi mã `DB_ERROR_CODES` mà UI có thể nhận đều có câu, trừ danh sách miễn trừ nội bộ.
- **Ước lượng:** S

### [A-007] Ký tự phân cách `·` / `→` viết cứng trong JSX ở khoảng 15 chỗ — Low · CONFIRMED · ĐÃ BIẾT (một phần: #141 cho `→`, #192 cho `": "`)
- **Trục:** Kiến trúc (i18n)
- **Vị trí:** `AppointmentDialog.tsx:425,428,432`; `AppointmentsScreen.tsx:508,512,526`; `EditOutcomeDialog.tsx:129`; `MetFields.tsx:157`; `CustomerDialogs.tsx:380` (`→`); `CustomerKyc.tsx:66,166,221`; `CustomerPolicies.tsx:53`; `CustomerProfile.tsx:122`; `CustomersScreen.tsx:49`; `KycDialogs.tsx:274,320`
- **Quy tắc liên quan:** `CLAUDE.md` "Mọi chuỗi UI qua i18n"; `REVIEW-CHECKLIST.md` §4
- **Mô tả:** ghi chú cũ chỉ nêu `→` và `": "`. Dấu `·` thực ra là quy ước trình bày lặp ở khắp các màn Phase 3.
- **Bằng chứng:** `git grep -n -E "(→|·)" -- "apps/desktop/src/**/*.tsx"`.
- **Kịch bản lỗi:** không sai chức năng; đổi quy ước trình bày phải sửa 15 chỗ.
- **Đề xuất sửa:** helper `joinParts(parts)` dùng `t('sep.dot')`, và `t('sep.arrow')` cho `→`; gộp vào Issue dọn i18n.
- **Ước lượng:** S

### [A-008] 5/15 PR mẫu vượt ngưỡng P1, một PR thiếu nhãn risk, một PR sửa file ngoài phạm vi không khai — Low · CONFIRMED · MỚI
- **Trục:** Quy trình
- **Vị trí:** PR #87 (~461 dòng sản phẩm, không nhãn `risk:*`; Issue #63 là `risk:high`), #139 (+444), #144 (~525), #155 (~480 sản phẩm / 863 tổng), #185 (~470); PR #96 sửa `playwright.config.ts` (không có trong danh sách của Issue #64, không khai)
- **Quy tắc liên quan:** ADR-0001 phụ lục P1; `REVIEW-CHECKLIST.md` §1; ADR-0017 (mức review lấy từ nhãn)
- **Mô tả:** các PR vượt ngưỡng đều tự khai trong body. Không phải vi phạm che giấu, nhưng là xu hướng: task UI Phase 3 thường vượt ~400 dòng. #87 không có nhãn risk trên PR (lúc đó skill `review-pr` chưa có, ADR-0017 ra ngày 27/09).
- **Bằng chứng:** `gh pr view … --json files,labels,body`, xem bảng §5.
- **Kịch bản lỗi:** PR lớn làm review phiên sạch kém sâu hơn (điểm mù tự review).
- **Đề xuất sửa:** Phase 4: ước lượng cỡ ngay lúc viết Issue (UI + i18n + e2e), tách A/B sớm; skill `review-pr` hạ PASS xuống "CHANGES [không chặn]" khi vượt mà không khai. Không cần sửa code.
- **Ước lượng:** S

### [B-003] Coverage chỉ đo `domain` + `db`: logic dữ liệu phía app không có ngưỡng — Low · CONFIRMED · MỚI
- **Trục:** Test
- **Vị trí:** `vitest.config.ts:6-15` (`coverage.include` chỉ gồm `packages/domain/src/**`, `packages/db/src/**`)
- **Quy tắc liên quan:** ADR-0006 (coverage domain ≥ 95%), spec §8 (db ≥ 90%). Không có quy định cho app, nhưng `app-data.ts` là nơi gánh luồng thay DB và lưu file.
- **Mô tả:** `app-data.ts`, `persist-queue.ts`, `close-guard.ts`, `startup-error.ts` và các view-model `*-view.ts` có test, nhưng không được đo. Nhánh của A-002 vì thế không hiện ra như một dòng chưa phủ.
- **Bằng chứng:** cấu hình ở trên; bảng coverage của `pnpm verify` chỉ có `db/src`.
- **Kịch bản lỗi:** nhánh lỗi trong `replace` / `open` thiếu test mà không ai thấy.
- **Đề xuất sửa:** thêm `apps/desktop/src/data/**/*.ts` và `apps/desktop/src/shell/*.ts` vào `include`, với ngưỡng riêng theo glob (vd. 90%).
- **Ước lượng:** S

### [B-004] GitHub Actions ghim theo tag, không theo SHA (repo đã public) — Low · CONFIRMED · MỚI
- **Trục:** Bảo mật (chuỗi cung ứng CI)
- **Vị trí:** `.github/workflows/ci.yml`: `actions/checkout@v7`, `pnpm/action-setup@v6`, `actions/setup-node@v7`, `Swatinem/rust-cache@v2`, `actions/upload-artifact@v7`
- **Quy tắc liên quan:** ADR-0015; ADR-0001 G7 (exe phát hành lấy từ artifact CI)
- **Mô tả:** tag của action bên thứ ba có thể bị dời sang commit khác. Job `build-exe` tạo artifact `Project-2C-<sha>` mà Owner dùng làm bản chạy thật. Token chỉ có quyền read (tốt), nhưng code lạ vẫn có thể sửa artifact.
- **Bằng chứng:** file workflow.
- **Kịch bản lỗi:** tag `Swatinem/rust-cache@v2` hoặc `pnpm/action-setup@v6` bị chiếm → chạy code tùy ý trong job build exe.
- **Đề xuất sửa:** ghim SHA đầy đủ và giữ tag trong comment; cập nhật định kỳ (Dependabot là công cụ mới → G4, hoặc cập nhật tay mỗi phase).
- **Ước lượng:** S

### [B-005] Tài liệu trạng thái lệch thực tế — Low · CONFIRMED · ĐÃ BIẾT (một phần: ADR-0003 để nguyên có chủ ý)
- **Trục:** Tài liệu
- **Vị trí:** chi tiết ở §7 (`PROJECT-STATE.md:5,9,45`; `PROJECT-PLAN.md` §5; `metrics/phase-1.md:22`; spec §5 tên backup, §8 lớp Rust; `TeamAppointmentsChart.tsx:11`)
- **Quy tắc liên quan:** `CLAUDE.md` (GitHub là nguồn sự thật, `PROJECT-STATE.md` + `HANDOFF.md` là trạng thái)
- **Mô tả / Bằng chứng / Kịch bản:** phiên mới đọc `PROJECT-STATE.md` sẽ thấy "Phase 1 milestone stays open", "(private)", "issues #59–#72", trong khi cùng file đó lại ghi Phase 1 đã đóng. Bảng tiến độ trong kế hoạch dừng ở 26/09.
- **Đề xuất sửa:** cập nhật trong PR đóng Phase 3 (#72, docs-only): `PROJECT-STATE.md` "Current phase", "Canonical repository", "Next decision"; bảng §5 của plan; `phase-1.md` #17; spec §5/§8 (tên backup theo T-056, CI theo nhãn + `cargo test`).
- **Ước lượng:** S

### [B-006] Phase 4: formatter / tooltip ECharts với chuỗi từ DB — Nit · PLAUSIBLE · MỚI
- **Trục:** Bảo mật (sẵn sàng Phase 4)
- **Vị trí:** `apps/desktop/src/routes/TeamAppointmentsChart.tsx:19-26` (hiện dữ liệu tĩnh), `packages/ui/src/components/chart-theme.ts:41`
- **Quy tắc liên quan:** ADR-0014 (formatter lấy từ `domain`)
- **Mô tả:** khi Phase 4 nối tên team / RE từ DB, mà DB có thể đến từ backup không tin cậy, vào tooltip thì formatter tự viết trả chuỗi HTML sẽ thành đường XSS. Tooltip mặc định của ECharts tự escape.
- **Bằng chứng / Kịch bản:** chưa xảy ra; tên team `<img src=x onerror=…>` + formatter kiểu `` `${name}: …` `` → HTML chạy trong webview, và webview gọi được mọi lệnh Tauri.
- **Đề xuất sửa:** quy ước trong `Chart` của `packages/ui`: formatter luôn escape (`echarts.format.encodeHTML`) hoặc chỉ dùng tooltip mặc định; thêm mục này vào checklist Phase 4.
- **Ước lượng:** S

### [A-009] `getPolicy` quét toàn bộ HĐ; i18n `t()` dùng `in` trên object thường — Nit · CONFIRMED · MỚI
- **Trục:** Hiệu năng / chất lượng code
- **Vị trí:** `packages/db/src/policies.ts:30-32` (`listPolicies(db).find(...)`); `apps/desktop/src/i18n/index.ts:11` (`name in params` cũng khớp khóa trên prototype như `{toString}`)
- **Mô tả:** `getPolicy` đọc toàn bộ ~1 000 HĐ, kèm join, để lấy một bản ghi (không có trong vòng lặp nóng nào hiện nay). `t()` có thể chèn nhầm hàm của prototype nếu một câu có slot `{constructor}`.
- **Đề xuất sửa:** truy vấn theo id + KH còn sống; dùng `Object.hasOwn(params, name)`.
- **Ước lượng:** S

## 4. Đánh giá theo trục

**3.1 Toàn vẹn dữ liệu & lưu trữ — 7/10.** Phần lưu cốt lõi được làm cẩn thận, và nhiều ca biên đã được nghĩ tới trước:
- transaction lồng dùng savepoint, `persist` chỉ sau `COMMIT` ngoài cùng (`database.ts:83-99`);
- `write_atomic` theo thứ tự `.tmp` → `sync_all` → `rename`;
- mất `project2c.db` mà còn backup → lỗi, không tạo DB mới đè lên;
- file không phải SQLite → lỗi và không backup;
- backup trùng nội dung không chiếm chỗ; prune theo thứ tự ghi;
- claim `.claim` với `create_new` cho export;
- lock file `share_mode(0)`;
- `PersistQueue` gộp snapshot; `CloseGuard` flush + hỏi khi lỗi;
- `generation` chặn DB cũ ghi đè;
- round-trip byte có test (`backup.test.ts:100-115`).

Điểm trừ nằm ở biên "dữ liệu đi vào": A-001 (nhập không kiểm toàn vẹn), A-002 (một nhánh lỗi làm tắt lưu mà không báo), cộng với B-001 làm hậu quả nặng thêm. Các ca đã biết (#96 ghi muộn giữa backup và thay DB, hai `replace` chồng nhau) vẫn còn nhưng được modal che. Điểm mạnh đáng giữ: comment giải thích "vì sao" ở mọi quyết định lưu trữ, và test Rust mô phỏng crash.

**3.2 Đúng nghiệp vụ — 9/10.** D6/D7/D9/D10 thi hành trong lệnh DB bằng withdraw → apply trong một transaction (`appointments.ts:122-217`). Kết quả cuộc gặp không được ghi trước ngày gặp (`requireOutcomeDay`). Dời lịch đúng D3. HĐ đủ ràng buộc §3.7 cả ở lệnh lẫn CHECK. KYC: note append-only có trigger (`0003`), `birthYear`/`gender` chỉ từ `SYSTEM`, phiên bản chỉ khi hash đổi. Golden đi qua DB bằng lệnh nghiệp vụ, và `seed-invariants.test.ts` kiểm bất biến trên ~1 200 KH. Seed đạt phân bố spec §7 (đo được: 1 200 KH, 6 229 lịch đủ 5 trạng thái, 988 HĐ, đủ 6 nhóm). Trừ điểm nhỏ ở A-005 và A-006. Điểm mạnh: mọi quy tắc có mã lỗi riêng và test rollback "writes nothing".

**3.3 Bảo mật — 9/10.**
- Không có IPC nhận đường dẫn. Tên file xuất đi qua whitelist, `open_folder` chỉ nhận hai giá trị. Explorer được gọi qua `raw_arg` có ngoặc kép, không qua shell, nên `& ^ %` vô hại.
- CSP `default-src 'self'`; `'wasm-unsafe-eval'` là cần cho sql.js; `'unsafe-inline'` chỉ cho style.
- Capabilities tối thiểu. Không `dangerouslySetInnerHTML`. Không bí mật trong repo. CI dùng `pull_request` với token read, và biểu thức trong `run` không lấy chuỗi do người dùng kiểm soát.

Chỉ còn B-004 và rủi ro tương lai B-006. Điểm mạnh: nguyên tắc "webview không bao giờ nêu đường dẫn" (`storage.rs:355-356`).

**3.4 Kiến trúc & chuẩn repo — 8/10.** Ranh giới module có luật depcruise rõ, 0 vi phạm. UI chỉ ghi qua `data.run(command)`, không đụng `orm` / `sqlite` (trừ `close()`). Dependency đều nằm trong ADR-0005/0014/0016 (zod dùng cho backup theo spec §6). Tiền, ngày, số đi qua `domain`. Không có `console.log` hay TODO. Trừ điểm ở B-001, i18n (A-006, A-007, ghi chú cũ). Tương phản token G3 là ghi chú R4, lần này không đo lại.

**3.5 Kiểm thử — 8/10.** Bộ test lớn và kiểm hành vi, không kiểm chi tiết cài đặt: 696 Vitest, 90 e2e, 36 Rust. Có golden qua DB, bất biến trên seed, round-trip byte, migration có dữ liệu (`database.test.ts:345`), rollback. 12/12 Issue mẫu có test chấp nhận tương ứng. Lỗ hổng: #71 chỉ đạt phần hỏng cấu trúc; #187 kiểm nhánh "mở DB lỗi" ở web mode; React của `CloseGuard` và hộp 10b `SCHEMA_TOO_NEW` chưa có test (ĐÃ BIẾT); e2e local chập chờn (A-003); coverage không đo app (B-003).

**3.6 Hiệu năng — 7/10.** Số đo trên seed (Node, `perf.repro.ts`):

| Việc | Kết quả |
|---|---|
| Seed | 3 738 ms (Edge 3,6 s < 5 s) |
| DB | 9 306 112 byte |
| `db.export()` | 1–2 ms |
| `exportBackup` | 161 ms / 10,5 MB |
| `importBackup` | 780 ms |
| `listAppointments` | 48 ms |
| `loadMetricsData` | 66 ms |
| `rfCount` | 119 ms/lần |

Ghi toàn file 9,3 MB sau mỗi lệnh chạy async trên threadpool Rust và được gộp trong hàng đợi, nên chấp nhận được ở quy mô demo (chưa đo IPC + `fsync` trên exe). N+1 của người phối hợp đã được bỏ (`coordinatorsByAppointment`). Việc cần làm trước Phase 4: A-004, và cân nhắc memo hóa `useQuery` theo màn thay vì đọc lại toàn bộ sau mỗi `run()`.

**3.7 Quy trình & tài liệu — 7/10.** 15/15 PR mẫu có review PASS trước merge, CI xanh và nhãn `build-exe` đúng. Issue có spec + test chấp nhận + file được phép. Script PowerShell đều kiểm `$LASTEXITCODE` (`Assert-ExitCode` / `Invoke-Git`) và chạy được trên 5.1. Trừ điểm: cỡ PR hay vượt (A-008), tài liệu trạng thái lệch (B-005), `git add -A` trong `session-end.ps1` (ĐÃ BIẾT R4). Điểm mạnh: ghi chú review không chặn được gom có hệ thống trong `HANDOFF.md`, và quyết định Owner đều ghi ngày.

**3.8 Sẵn sàng phase sau — 6/10.**
- **Phase 4:** `stats.ts` dùng thẳng được `loadMetricsData` (golden qua DB chứng minh). Cần thêm hàm MTD (ĐÃ BIẾT R3), sửa hiệu năng (A-004) và định nghĩa "lịch dự kiến / đã gặp" (spec §10).
- **Phase 5:** chưa có `packages/ai`, nhưng luật depcruise đã sẵn; `kyc_versions` (hash, seq) đủ cho `STALE`. Nút thắt là quyết định kiến trúc gọi mạng và lưu key (§8).
- **Phase 6:** cần A-001 + B-002.

## 5. Tuân thủ quy trình (mẫu PR)

Cỡ lấy theo số dòng +/− trong `gh pr view --json files`. "Sản phẩm" không gồm test, e2e, migration, `vi.ts`, lockfile, docs. `storage.rs` có module test nội tuyến nên cỡ Rust bị đếm thừa; số trong ngoặc là số PR tự khai.

| PR | Issue | risk | Cỡ (sản phẩm/tổng) | File ngoài phạm vi | Review trước merge | CI xanh khi merge | build-exe đúng | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| #87 | #63 | high (Issue); PR **không nhãn** | 752/971 (khai ~461/933) | Không (`pnpm-lock.yaml` là hệ quả của `package.json`) | CHANGES 21:05 → PASS 21:28, 21:47; merge 22:01 | Verify ✅, exe ✅ | ✅ (thời ADR-0015 phụ lục Phase 3: build mọi PR) | Vượt P1, đã khai (2 vòng sửa) |
| #96 | #64 | med | 380/599 (khai ~300) | `playwright.config.ts` (không khai) | PASS 07:03, 08:12; merge 08:16 | ✅/✅ | ✅ | `src-tauri` được Owner thêm vào Issue 27/09 |
| #125 | #91 | med | 171/323 | Không | PASS 19:02; merge 19:05 | ✅/✅ | ✅ | Có kiểm tay exe |
| #134 | #89 | med | 167/193 | Không | PASS 07:41; merge 07:48 | ✅/✅ | ✅ | |
| #136 | #90 | med | 246/246 (phần lớn test Rust) | Không | PASS 09:36; merge 09:43 | ✅/✅ | ✅ | |
| #139 | #66 (phần A2) | med | 414/643 (khai +444) | Không | PASS 11:35; merge 11:36 | ✅/skip | ✅ (không đụng build) | Vượt P1 nhẹ, đã khai |
| #144 | #131 | med | 504/770 (khai ~525) | Không (`packages/ui` được phép) | PASS 13:23, 13:43; merge 13:44 | ✅/skip | ✅ | Vượt P1, đã khai |
| #155 | #68 (A1) | med | 545/977 (khai ~480, 761+/102−) | 2 file đã được Owner ghi nhận (`HANDOFF.md` #155) | CHANGES → PASS → CHANGES → PASS 18:48; merge 18:49 | ✅/skip | ✅ | Vượt cả hai ngưỡng |
| #166 | #69 (A) | med | 194/1712 (1049 là migration + snapshot sinh tự động) | Không | PASS 07:46, 08:12; merge 08:13 | ✅/skip | ✅ | |
| #171 | #69 (C2) | med | 368/521 | Không | PASS 14:51; merge 15:56 | ✅/skip | ✅ | |
| #179 | #173 | low | 223/273 | Không | PASS 18:50; merge 18:50 | ✅/skip | ✅ | `risk:low`, Claude tự merge đúng quy tắc |
| #184 | #71 (A) | high | 239/557 | `packages/db/package.json` + lockfile (zod, đã duyệt) | CHANGES 03:03 → PASS 03:22; merge 03:26 | ✅/✅ | ✅ (đụng `package.json`) | |
| #185 | #71 (B) | high | 588/959 (khai ~470) | `packages/domain/*` (đã khai), `docs/design/phase-3-du-lieu.md` (quyết định Owner #185) | PASS 03:04, 03:36, 04:05; merge 04:28 | ✅/✅ | ✅ | Vượt P1, đã khai |
| #188 | #187 | high | 126/209 | Không | PASS 05:11, 05:31; merge 05:34 | ✅/✅ | ✅ | |
| #194 | #186 | low | 346/523 | Không | PASS 07:39; merge 07:40 | ✅/✅ | ✅ | |

Tỉ lệ:
- review PASS trước merge 15/15;
- CI xanh 15/15;
- `build-exe` đúng 15/15;
- nhãn risk trên PR 14/15;
- trong ngưỡng ~400 sản phẩm 10/15 (5 vượt, đều khai);
- file ngoài phạm vi không khai 1/15 (#96).

Mọi PR được merge bởi tài khoản `AlexH-AI`, nên không phân biệt được Owner hay Claude đã merge PR `risk:med`/`high`.

## 6. Kiểm tra test chấp nhận (mẫu Issue)

| Issue | Test chấp nhận | Test tương ứng (file:line) | Đạt? |
|---|---|---|---|
| #61 T-042 | Golden G01–G22 qua DB; stage = transition mới nhất; không tạo ở ON_HOLD/LOST; MET thiếu trường; D7; dời lịch; HĐ; xóa mềm | `golden-metrics.test.ts:132-165`; `customers.test.ts:19,54,175,235`; `appointments.test.ts:153,187,212,229,771,813,867`; `policies.test.ts:35,64,87,115` | ✅ |
| #62 T-043 | Golden K01–K15; note append-only; mới nhất theo `seq`; chuẩn hóa giá trị; RE không xác nhận `birthYear`/`gender`; phiên bản / material | `golden-kyc.test.ts:20`; `kyc.test.ts:66,123,135,267,283,363,382,408` | ✅ |
| #63 T-044 | Web DB bộ nhớ; hàng đợi tuần tự; exe kiểm tay; không crate mới | `app-data.test.ts:60,86`; `persist-queue.test.ts` (tuần tự, gộp); `Cargo.toml` chỉ `tauri` | ✅ (phần kiểm tay không kiểm lại được) |
| #64 T-045 | Deterministic; quy mô; đủ loại; bất biến; < 5 s | `seed.test.ts:65,86,92,114,129,136`; `seed-invariants.test.ts:48-177`; `e2e/seed-timing.spec.ts:8` (3,6 s) | ✅ |
| #69 T-050 | e2e N3→N2; D6; D7 khóa 3 ô; D9; một transaction cho "lưu + tạo lịch"; `PERSON_IN_USE`; migration có dữ liệu | `e2e/appointment-outcome.spec.ts:45,88,111,170`; `appointments.test.ts:243,317,329,354,369,419`; `database.test.ts:345,364` | ✅ |
| #71 T-052 | Round-trip byte; mới hơn → từ chối; hỏng → lỗi có mã; cũ → migrate; khởi động với DB mới hơn; e2e | `backup.test.ts:100,131,143,221-258`; `app-data.test.ts:102`; `startup-error.test.ts:13`; `e2e/backup.spec.ts:22,88,100` | ⚠️ Một phần: file **hỏng nội dung** vẫn nhập được (A-001) |
| #89 T-055 | Rust `ALREADY_OPEN`; nhả khóa; Vitest thông báo; không crate | test Rust trong `storage.rs` (36 test, gồm `open_keeps_the_lock…`); `startup-error.test.ts:6,20` | ✅ |
| #91 T-057 | `flush()` sau lỗi; đóng khi rảnh; logic đóng với cổng giả; i18n | `persist-queue.test.ts:104,124,134`; `close-guard.test.ts:44,53,69,87` | ✅ (React `CloseGuard` chưa test: ĐÃ BIẾT) |
| #100 T-058 | D10 manual; trước ngày tạo; cùng ngày; kịch bản #99; ghi muộn; restore; bất biến seed; golden | `customers.test.ts:200,223`; `appointments.test.ts:735,746,756,833`; `seed-invariants.test.ts:59` | ✅ |
| #187 T-071 | Dọn file 0 byte; test `write_export` cũ; đóng DB cũ; không đóng khi thay lỗi; e2e | test Rust `open_removes_what_an_interrupted_export_left…`; `app-data.test.ts:189,205,435` | ⚠️ Một phần: "mở DB mới lỗi" chỉ kiểm ở web mode, nhánh exe mất lưu (A-002) |
| #189 T-072 | Lần đầu dọn; lần hai không dọn; test cũ xanh | test Rust `open_again_in_the_same_process_keeps_a_running_export` | ✅ |
| #191 T-073 | Dọn dù `project2c.db.tmp` là thư mục; test cũ xanh | test Rust (36/36 pass) | ✅ |

## 7. Tài liệu lệch thực tế

| File | Chỗ lệch | Thực tế | Đề xuất |
|---|---|---|---|
| `docs/PROJECT-STATE.md:5` | "Phase 1 milestone stays open until the office checks (#9, #17)"; "issues #59–#72" | Phase 1 đóng 28/09 (cùng file dòng 54); milestone Phase 3 có khoảng 45 Issue (#57–#195) | Viết lại "Current phase" |
| `docs/PROJECT-STATE.md:9` | `AlexH-AI/Project-2C` (private) | Public từ 27/09 (`HANDOFF.md`) | Sửa |
| `docs/PROJECT-STATE.md:45` | "milestone stays open until #9 … #17" | Đã đóng | Xóa hoặc gạch |
| `docs/PROJECT-PLAN.md` §5 (bảng lộ trình) | Cột "Tiến độ (26/09/2026)": Phase 1 🟡 16/18; Phase 2 🟡 9/11 "còn #25, #26"; Phase 3 "kế hoạch + G2 xong; 14 issue"; "~30%" | Phase 1, 2 đóng; Phase 3 chỉ còn #72 | Cập nhật khi đóng Phase 3 |
| `docs/PROJECT-PLAN.md` §5 dòng cuối | "mỗi task = 1 Issue ≤ ~400 dòng diff" | P1: ≤ ~400 sản phẩm / ≤ ~800 tổng | Sửa |
| `docs/metrics/phase-1.md:22` | "#17 … Chưa làm" | PR #128 đã merge 28/09 | Sửa |
| `docs/design/phase-3-du-lieu.md` §5.1 | Backup `project2c-YYYYMMDD-HHMMSS.db` | `project2c-s<seq 8 chữ số>-<stamp>.db`, prune theo thứ tự ghi (T-056, `storage.rs:267-271`) | Sửa spec (docs-only) |
| `docs/design/phase-3-du-lieu.md` §8 | "Lớp Rust: kiểm tay … (CI build exe mọi PR — ADR-0015)" | Build exe theo nhãn `build-exe`; CI chạy `cargo fmt` / `clippy` / `test` (T-054) | Sửa |
| `docs/decisions/0003…md:27,29` | `/resume`, branch protection | `/session-start`, pre-push + ruleset | ĐÃ BIẾT, Owner để nguyên (PROJECT-STATE dòng 61) |
| `docs/decisions/0015…md` §"Bắt buộc mở lại build exe" | "PR đụng `apps/desktop/**`, `packages/ui/**` → `build-exe`" | Phụ lục 27/09 thu hẹp còn `src-tauri`, Cargo, `package.json`, lockfile, cấu hình build | Ghi "đã thay bởi phụ lục" ngay tại mục đó |
| `apps/desktop/src/routes/TeamAppointmentsChart.tsx:11` | "Placeholder numbers until appointments come from the database (Phase 3)" | Hết Phase 3 vẫn là số giả; nối DB ở Phase 4 | Sửa comment thành Phase 4 |
| `apps/desktop/src/data/tauri-storage.ts:23` | (ghi chú #87 ĐÃ BIẾT) | Đã sửa thành "empty only on a first start (no file and no backups)" | Không cần làm gì |

## 8. Nợ kỹ thuật & sẵn sàng Phase 4–6

**Nên làm trước khi đóng Phase 3 / trước Phase 4**
1. A-001 + A-002 + B-001: một Issue `risk:high` về toàn vẹn khi nhập và phục hồi lỗi render.
2. A-003: e2e local xanh ổn định. Nếu không, mọi task Phase 4 đều gặp e2e đỏ.
3. B-005: cập nhật tài liệu trạng thái trong PR đóng phase (#72).

**Đầu Phase 4 (trước màn dashboard)**
4. A-004: `rfCount` / `inScope` O(A+T).
5. Hàm MTD trong `domain` (ĐÃ BIẾT R3) + định nghĩa G2 cho "lịch dự kiến / đã gặp" và cách đếm chuỗi dời lịch. Seed có 347 lịch `RESCHEDULED`. Ca "xóa lịch con của chuỗi dời" (T-068 cho phép) để lại lịch cha `RESCHEDULED` không có lịch nối tiếp: định nghĩa mới phải nói rõ ca này.
6. B-006: quy ước formatter chart escape.
7. B-003: coverage cho `apps/desktop/src/data`.
8. Gom các ghi chú không chặn của `HANDOFF.md` theo file (i18n A-006/A-007, `today(db)`, `FailureAlert`, `readCaseSize`…) thành 1–2 Issue dọn dẹp `risk:low`.

**Phase 5**
9. Quyết định kiến trúc (G4/G6), cần có trước khi viết `packages/ai`: ADR-0009 §8 muốn key trong Windows Credential Manager, còn ADR-0016 giới hạn Rust ở `std` và CSP `connect-src` chỉ gồm `'self' ipc:`. Hai lựa chọn:
   - (a) nới CSP cho host OpenCode Go → key phải đi qua webview;
   - (b) lệnh Rust gọi HTTP + đọc Credential Manager → cần crate mới (`reqwest`/`ureq`, `keyring`/`windows`).
   Nên chọn (b) cho G6, nhưng đó là G4.
10. `STALE` nên so theo `kyc_versions.id` / `seq` mới nhất, không theo `date` (ngày do người nhập và không đơn điệu).

**Phase 6**
11. B-002: định dạng snapshot mỗi bảng một file, một dòng mỗi bản ghi, không có `exportedAt` trong file bảng.
12. A-001 là tiền đề: snapshot kéo về là dữ liệu không tin cậy.
13. Gộp hoặc phát hiện xung đột cần `updated_at` đáng tin. Hiện `updated_at` lấy từ `db.now()` của máy, chưa có đồng hồ logic.

## 9. Góp ý quyết định (không phải lỗi)

- **D5 / spec §6 "kiểm bằng zod":** quyết định dùng zod đúng hướng, nhưng spec chỉ nói kiểm *định dạng file*. Nên bổ sung vào spec (G2 nhỏ): "nhập = kiểm cấu trúc **và** kiểm bất biến như lệnh nghiệp vụ". Như vậy A-001 thành quy tắc, không chỉ là lỗi, và Phase 6 tự thừa hưởng.
- **T-068 cho xóa lịch Dự kiến (Owner 30/09):** việc xóa một lịch `SCHEDULED` là **con** của chuỗi dời (`rescheduled_from_id` ≠ null) để lại lịch cha "Dời lịch" không có lịch nối tiếp. Theo nghĩa nghiệp vụ, đó giống "KH hủy" hơn là "nhập nhầm". Rủi ro chỉ số Phase 4 là thật (đếm lịch dự kiến / dời). Gợi ý: chặn xóa lịch con của chuỗi dời, hoặc chuyển thành Hủy, và quyết cùng định nghĩa Phase 4.
- **ADR-0016 "ghi cả file sau mỗi transaction":** ổn với 9,3 MB. Nếu Phase 4–6 làm DB lớn lên (lưu `ai_analyses` có output dài), nên đặt ngưỡng theo dõi (vd. > 30 MB thì cân nhắc gom ghi theo thời gian), không đổi kiến trúc ngay.
- **ADR-0015 "push lên `main` bỏ Verify":** hợp lý về phút Actions. Nhưng e2e local chập chờn (A-003) cộng CI `retries: 1` làm giảm độ tin của lớp Verify duy nhất. Nên sửa A-003 trước khi tiếp tục dựa vào quyết định này.

## 10. Đề xuất Issue

| Tiêu đề | Gộp ID | risk | File được phép sửa | Test chấp nhận gợi ý | Ước lượng dòng (sản phẩm / tổng) |
|---|---|---|---|---|---|
| T-0xx: Nhập backup kiểm toàn vẹn dữ liệu, không chỉ cấu trúc | A-001 | high | `packages/db/src/{backup,integrity (mới),index}.ts`, `packages/db/src/*.test.ts`, `apps/desktop/src/data/app-data.ts` (`readBackup` bắt `RangeError` / `SyntaxError` → `BACKUP_INVALID`), `e2e/backup.spec.ts`, `docs/design/phase-3-du-lieu.md` §6 | Mỗi loại: ngày sai / không tồn tại, `value_json` hỏng, stage ≠ transition cuối, transition lùi ngày, `re_id` không phải RE, coordinator = RE, fact trỏ note KH khác → `BACKUP_INVALID`, DB hiện tại không đổi; round-trip byte seed vẫn xanh; e2e: file hỏng nội dung → hộp 10b | ~150 / ~400 |
| T-0xx: Thay DB lỗi không làm tắt lưu; ErrorBoundary cho màn hình | A-002, B-001 | high | `apps/desktop/src/data/app-data.ts`, `app-data.test.ts`, `apps/desktop/src/shell/{AppShell,ErrorBoundary (mới)}.tsx`, `apps/desktop/src/i18n/vi.ts`, `e2e/**` | Exe mode: import / reload với `openDatabase` lỗi → ghi tiếp trên DB cũ vẫn tới `save`; màn ném lỗi → thông báo i18n, sidebar dùng được, `CloseGuard` vẫn flush | ~80 / ~250 |
| T-0xx: e2e local xanh ổn định | A-003 | low | `playwright.config.ts`, `e2e/{chart,demo-data,navigation}.spec.ts` | `pnpm e2e` xanh 3 lần liên tiếp trên máy 20 luồng; CI không tăng thời gian quá 10% | ~20 / ~60 |
| T-0xx: `rfCount` / `inScope` tuyến tính | A-004 | med | `packages/domain/src/stats.ts` + test | Golden G01–G22 (domain + qua DB) không đổi; test thời gian trên seed (`packages/db`) < 20 ms/lần | ~40 / ~100 |
| T-0xx: Lệnh DB chặn ngày tương lai + câu lỗi hồ sơ KYC | A-005, A-006 | med | `packages/db/src/{customers,policies,common,errors}.ts` + test, `apps/desktop/src/i18n/vi.ts`, `apps/desktop/src/routes/customers/CustomerDialogs.tsx`, `apps/desktop/src/i18n/index.test.ts` | `changeStageManually` / `submitPolicy` / `issuePolicy` ngày > hôm nay → mã lỗi; xóa ngày sinh đã có → câu i18n riêng; test: mọi `DbErrorCode` UI chạm được đều có câu | ~60 / ~180 |
| T-0xx: Dọn i18n phân cách + `t()` an toàn | A-007, A-009 (phần i18n) | low | `apps/desktop/src/**/*.tsx` (15 chỗ ở A-007), `apps/desktop/src/i18n/{index,vi}.ts` | Không còn `·` / `→` trong JSX (thêm luật vào script token hoặc test grep); `t()` bỏ qua khóa prototype | ~60 / ~100 |
| T-0xx: Coverage cho lớp dữ liệu app | B-003 | low | `vitest.config.ts`, test trong `apps/desktop/src/data/**` nếu thiếu | `pnpm verify` báo coverage `apps/desktop/src/data` ≥ 90% | ~10 / ~80 |
| T-0xx: Ghim action CI theo SHA | B-004 | med (CI) | `.github/workflows/ci.yml` | CI xanh; mọi `uses:` ghim SHA 40 ký tự kèm comment tag | ~10 / ~10 |
| T-053 (#72, đã có): đóng Phase 3 kèm cập nhật tài liệu | B-005 | low | `docs/PROJECT-STATE.md`, `docs/PROJECT-PLAN.md`, `docs/metrics/phase-{1,3}.md`, `docs/design/phase-3-du-lieu.md`, `docs/decisions/0015…md` (ghi chú), `TeamAppointmentsChart.tsx` (comment) | Các mục ở §7 hết lệch | docs |
| Phase 6 (để sau): `exportSnapshot` mỗi bảng một file | B-002 | high | `packages/db/src/{snapshot (mới),backup}.ts` + test | Snapshot → sửa 1 bản ghi → `git diff` đúng 1 dòng; snapshot → import → snapshot giống hệt | ~150 / ~350 |

A-008 (cỡ PR) và B-006 (formatter chart) là quy ước, không cần Issue riêng: ghi vào checklist Phase 4.

## 11. Giới hạn của review này

- **Thời gian và độ phủ:** khoảng 40 phút trong một phiên, không subagent. Đọc sâu vùng lưu trữ, DB và nghiệp vụ. **Chưa đọc kỹ** phần lớn component React của `routes/customers`, `routes/appointments`, `routes/team` (khoảng 5 000 dòng), `seed.ts` từ dòng 140, `seed-data.ts`, phần test trong `storage.rs`. **Chưa so UI với mockup G3** màn nào (dựa vào ghi chú review từng PR trong `HANDOFF.md`). Chưa đo tương phản WCAG, a11y bàn phím, `tabular-nums` (chỉ đếm 43 chỗ dùng).
- **Không chạy được:** exe thật (Tauri build, `Project2C-data`, Explorer, lock file giữa hai process, đĩa đầy, thiếu quyền, `rename` khi file bị công cụ ngoài giữ). Lớp Rust chỉ được kiểm bằng đọc code + `cargo test`. Hậu quả UI của A-001 (cửa sổ trắng) là suy luận từng bước từ code (lời gọi ném lúc render + không có boundary), **chưa quan sát trên trình duyệt**: không được tạo `.claude/launch.json` trong repo để mở preview. Tầng DB của A-001 thì đã tái hiện.
- **Số liệu hiệu năng** đo trong Node / Vitest, không đo trong WebView2. IPC + `fsync` 9,3 MB mỗi lần lưu trên exe chưa đo.
- **Cỡ PR** tính theo file (Rust gồm test nội tuyến), nên chỉ là ước lượng. Kiểm "file ngoài phạm vi" làm cho 10 PR, không phải toàn bộ khoảng 60 PR code của Phase 3.
- **Trạng thái GitHub** (Issue, PR, nhãn) được đọc ở thời điểm hiện tại, không đóng băng ở `0fa0eea`. Có thấy tiêu đề #198 / #199 / #201 (sau `0fa0eea`) trong danh sách nhưng không mở. Không đọc commit hay ref nào sau `0fa0eea`.
- **Hook `UserPromptSubmit`** của repo (`review-pr-hint`) chèn gợi ý "dùng skill `review-pr` cho PR #99" do bắt nhầm chuỗi "#99" trong prompt (đúng ghi chú R4 "hook nhận issue #N thành PR"). Gợi ý này bị bỏ qua vì prompt cấm `review-pr`.
- **Tính độc lập:** không đọc báo cáo Codex Astra hay bất kỳ file nào ngoài `C:\workspace\Project-2C-review` và `C:\workspace\review-reports\`. Không thấy nội dung nào của Astra.
- Context phiên chưa bị tóm tắt trong lúc review, nên không mất chi tiết nào vì tóm tắt.
