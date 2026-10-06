# Deep review Phase 1–4 — gói H (xuyên gói) — Claude

- **SHA:** `f0c53eb57eb7eac8665ad87287e794ae4c5bc43b` (`git rev-parse HEAD` kiểm đầu và cuối phiên, worktree `C:\workspace\Project-2C-review`, detached). Cuối phiên `git status` sạch: không sửa file, không commit.
- **Ngày:** 06/10/2026, Home PC. Một phiên, không subagent.
- **Prompt:** prompt Owner dán ghi "§4 dòng gói A" và "phạm vi gói G" ở hai chỗ; phiên này hiểu là gói **H** (đúng tiêu đề prompt và phụ lục A của kế hoạch).
- **Nguồn ngoài repo đã đọc:** `common\README.md`, `baseline.md`, `known.md`, `load\` (dùng `load-backup.json`); báo cáo Claude `claude\A.md` … `G.md` (§1–§6 mỗi gói, phụ lục khi cần). Dùng bản exe release của gói D (`claude\D\exe\project2c.exe`, build tại SHA này) bằng cách **chép** sang `claude\H\exe\` với thư mục dữ liệu riêng. **Không mở / liệt kê / tìm trong `codex\`.**
- **Probe, test tạm:** `C:\workspace\deep-review-1-4\claude\H\` (nguồn ở phụ lục). `node_modules` của thư mục probe là junction tới `node_modules` của worktree. Build có sourcemap ghi ra `H\dist-map\` (`vite build --outDir`), không ghi vào repo.

## 1. Phạm vi đã đọc

| Vùng | File (dòng) | Cách |
|---|---|---|
| Ranh giới module | `.dependency-cruiser.cjs` 1–62; `package.json` (gốc + 4 package); `tsconfig.base.json`; `e2e/tsconfig.json` | đọc hết; `pnpm lint:deps`; cấu hình chặt hơn (`depcruise-extra.cjs`) trên `apps packages e2e`; 10 vi phạm cài thử trên bản sao (`dc-copy\`) |
| Mở app / dữ liệu dùng chung | `apps/desktop/src/main.tsx` 1–33; `App.tsx` 1–18; `data/app-data.ts` 1–329; `data/AppDataContext.tsx` 1–42; `data/tauri-storage.ts` 1–44; `shell/AppShell.tsx` 1–63 | đọc hết |
| Lớp db mà mọi màn dùng | `packages/db/src/database.ts` 1–188; `common.ts` 1–119; `errors.ts` 1–78; `index.ts` 1–90; `backup.ts` 60–135; `backup-validation.ts` 55–120, 260–280; `appointments.ts` 55–135, 415–428; `customers.ts` 48–90, 99–111; `team.ts` 59–71, 110–128; `kyc.ts` 370–383 | đọc đoạn |
| Domain dùng chung | `appointment-counts.ts` 1–80; `period.ts` 90–110; `index.ts` (grep export) | đọc đoạn |
| UI / i18n / lỗi | `packages/ui/src/index.ts`, `components/Chart.tsx` 1–75, `compare-cells.ts` 1–37, `tokens.css` 1–69, `theme.css` 1–76; `i18n/index.ts` 1–113; `vi.ts` (mọi `error.*`, `storage.*`, `startup.*`); mọi nơi gọi `errorMessage(` (14 chỗ); `KycDialogs.tsx` 80–140; `appointment-form.ts` 1–119 | đọc hết / đọc đoạn |
| Đọc dữ liệu của từng màn | `readAppointments`, `readOverview`, `readReports`, `readTeams`, `readCustomers`, `readProfile`, `readScopeOptions` (mọi `useQuery(`) | đọc đoạn |
| Cấu hình build / test | `apps/desktop/vite.config.ts`, `index.html`, `dist/index.html`; `vitest.config.ts`; ADR-0014 | đọc hết |
| Quét toàn repo | mọi `throw` trong code sản phẩm; mọi `DbError` code (nơi ném / nơi UI dùng); định dạng ngày / số ngoài `domain`; `normalize(`, `Intl.Collator`; token CSS; dependency khai báo vs dùng | grep + script |

Lệnh / công cụ đã chạy: `pnpm lint:deps`; `depcruise` với cấu hình probe (orphan, dependency chưa khai báo, prod → test, prod → devDependency, import sâu vào package khác); `tsc -p e2e --noUnusedLocals --noUnusedParameters`; `vitest --coverage` riêng cho các file nằm ngoài `coverage.include`; `vite build --sourcemap` ra `H\dist-map` + phân tích sourcemap (cấu thành bundle, trùng phiên bản); exe release với dữ liệu tải qua cổng debug WebView2 9340 (lần mở đầu + 6 màn × 5 lần tải lại, CPU profile CDP); 2 probe Vitest (`probe-makedb`, `probe-importclock`).

## 2. Phát hiện

### CL-H1

```
ID: CL-H1
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/data/app-data.ts:296-297 (readBackup gọi importBackup(text, { locateFile }) không có `now`) · đối chiếu app-data.ts:176-186 (comment T-126: "The database's clock keeps the app's day, so its 'from today on' checks agree with the screens when e2e pins the day") · packages/db/src/backup-validation.ts:117, 266-277 (luật 10 dùng today(db) của DB tạm) (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** Khi ngày của app bị ghim (`VITE_DEMO_ANCHOR`, bản e2e), app-data cố ý cho DB của app dùng đồng hồ mang ngày của app, để luật "không sau hôm nay" của lệnh khớp với màn hình. Đường xem trước nhập backup (`readBackup`) lại dựng DB tạm qua `importBackup` mà không truyền `now`, nên luật 10 (việc đã xảy ra không sau hôm nay) xét theo **ngày của máy**. Hai lớp dùng hai "hôm nay" khác nhau cho cùng một luật.

**Tái hiện** (`probe-importclock.test.ts`, kết quả `importclock.result.json`). App mở như bản e2e: ngày ghim 15/09/2026, đồng hồ máy 06/10/2026. File backup có một cuộc gặp MET ngày 01/10/2026:
- `app.readBackup(file)` → **nhận** (`counts` 1 team / 1 người / 1 KH / 1 lịch hẹn), `app.importBackup` → màn có "01/10/2026 MET" trong khi hôm nay của app là 15/09/2026.
- Cùng file, `importBackup(file, { now: 15/09/2026 })` → `BACKUP_INVALID {"rule":10}`.
- Ngay sau đó, lệnh của chính app ghi MET cho một lịch ngày 01/10/2026 → `OUTCOME_IN_FUTURE`.

**Ảnh hưởng.** Chỉ bản build có ngày ghim (e2e; mọi bản có `VITE_DEMO_ANCHOR`). Exe thật không ghim ngày, hai đồng hồ trùng nhau nên không gặp. Ở bản e2e, một test nhập backup có ngày nằm giữa ngày ghim và ngày máy sẽ có kết quả phụ thuộc ngày chạy test.

**Đề xuất.** `readBackup` truyền `now` (cùng hàm `now` đang đưa vào `openDatabase` ở dòng 215), và một test unit của `app-data` với ngày ghim. ≤ 5 dòng SP + 1 test.

### CL-H2

```
ID: CL-H2
Mức: Nit
Trục: B
Vị trí: packages/ui/src/components/Chart.tsx:12, 16-23 (đăng ký cả SVGRenderer lẫn CanvasRenderer), 42-43, 53 (prop `renderer`, mặc định 'svg') · nơi dùng duy nhất apps/desktop/src/routes/overview/StageBlock.tsx:114 (không truyền `renderer`) · apps/desktop/vite.config.ts:20-26 + dist/index.html (chunk chart được modulepreload lúc mở app) (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** `Chart` có một nơi dùng (`StageBlock`), không truyền `renderer`, nên luôn là SVG. Bộ dựng Canvas (ADR-0014 dự kiến cho chart nhiều điểm kỳ Năm / 30 RE, chưa có màn nào) vẫn được đăng ký và nằm trong chunk `chart`, chunk này được `modulepreload` và import tĩnh ngay khi mở app, kể cả khi màn đầu không có chart.

**Bằng chứng.** `chart-canvas-bytes.mjs` trên sourcemap của `vite build --sourcemap` (cùng hash chunk với `dist` của repo): chunk `chart` 514,1 KB mã nguồn ánh xạ được, trong đó đường Canvas (`zrender/lib/canvas/*`, `installCanvasRenderer`) **21,5 KB** (4,2 %), đường SVG 21,0 KB. `rg "renderer=" apps/desktop/src` → không có. Chi phí CPU của cả chunk `chart` khi mở app chỉ **2–3 ms** mỗi lần tải lại trong exe (`startup-1.result.json`, trung vị 5 lần, 6 màn), nên đây là code thừa chứ không phải điểm nghẽn.

**Ảnh hưởng.** Không ảnh hưởng người dùng; ≈ 21 KB (raw) code không đường nào chạy, và một prop không nơi nào truyền.

**Đề xuất.** Bỏ `CanvasRenderer` và prop `renderer` cho tới khi có chart cần Canvas (ghi chú trong ADR-0014 / CLAUDE.md của `ui`), hoặc giữ và ghi ACCEPTED. ≤ 10 dòng.

### CL-H3

```
ID: CL-H3
Mức: Nit
Trục: B
Vị trí: packages/db/src/common.ts:33-49 (pad, toIsoDate, fromIsoDate) · packages/db/src/backup-validation.ts:55-70 (đọc ngày ISO riêng) · packages/domain/src/period.ts:98-100 (formatIsoDate) · Intl.Collator('vi'): appointments-view.ts:175, customers-view.ts:49, team-compare-view.ts:49, reports-view.ts:90, shell/scope.ts:55 + packages/ui/src/components/compare-cells.ts:12 (cấu hình khác: sensitivity 'base', numeric) (f0c53eb)
Tình trạng: CONFIRMED (grep + probe so thứ tự)
```

**Mô tả.** Hai chỗ lặp xuyên package mà mỗi gói trước chỉ thấy một nửa:
1. **Ngày ISO `YYYY-MM-DD`** (định dạng lưu, spec Phase 3 §2) được viết ở `domain` (`formatIsoDate`, cho tên file) và viết lại ở `db` (`toIsoDate` + `pad` riêng để ghi; `fromIsoDate` và một bộ đọc khác trong `backup-validation` để đọc). CLAUDE.md: "Tiền, ngày, chỉ số: chỉ dùng hàm chuẩn trong `packages/domain`. Không tự parse / format rải rác". Hôm nay hai bản ra cùng chuỗi trong miền 1900–2100.
2. **Sắp theo tên:** 5 file tự khai `new Intl.Collator('vi').compare` (gói F đã ghi ở "đã xét"), và `DataTable` dùng collator thứ sáu với cấu hình khác (`sensitivity: 'base', numeric: true`). Thứ tự mặc định của một danh sách và thứ tự sau khi bấm sắp cột tên có thể khác nhau: probe `collator-diff.result.json`: `["Team 10","Team 2"]` ra hai thứ tự ngược nhau; "an" / "An" bằng nhau ở một bên, khác ở bên kia. Trên dữ liệu tải (1 496 KH, 51 người, 4 team) **không lệch vị trí nào**, nên chưa thấy được trên màn.

**Ảnh hưởng.** Không lỗi hôm nay. Đổi định dạng ngày lưu hoặc cách sắp tên phải sửa nhiều nơi ở hai package; liên quan CL-B10 (db sắp theo BINARY).

**Đề xuất.** `domain` export `parseIsoDate` / dùng `formatIsoDate` (có kiểm ngày) cho `db`; một `byName` chung (domain hoặc ui) dùng cho cả 5 nơi và `compare-cells`, sửa cùng CL-B10. ≤ 40 dòng, chủ yếu xóa.

## 3. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | P | B | T | A | S | Tổng |
|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | 0 |
| High | | | | | | | | | 0 |
| Medium | | | | | | | | | 0 |
| Low | | | | | | | | | 0 |
| Nit | | 1 (H1) | | | 2 (H2, H3) | | | | 3 |
| **Tổng** | 0 | 1 | 0 | 0 | 2 | 0 | 0 | 0 | **3** |

Cả 3 CONFIRMED (probe hoặc số đo), không PLAUSIBLE, không trùng `known.md`. Gói H ít phát hiện mới vì phần lớn chỗ xuyên gói đã được gói A–G nêu kèm vị trí ở cả hai đầu (xem §4); gói H không báo lại.

**Nhận định chung gói H:** ranh giới module đúng ADR-0006 và luật kiểm thật sự bắt vi phạm; mã lỗi nhất quán từ db tới i18n (một ngoại lệ đã có: CL-E2); mở app đầu-cuối với dữ liệu tải nhanh (≈ 0,5 s lần đầu). Điểm yếu xuyên gói lớn nhất vẫn là chi phí mỗi lệnh ghi (đọc lại toàn bộ bảng + tính lại view + render bảng đầy đủ), đã có ở CL-B8 / CL-E1 / CL-D7.

## 4. Phát hiện gói trước có tính xuyên gói (không báo lại, chỉ dẫn ID)

- **Chi phí một lệnh ghi = tổng ba phát hiện.** Mỗi `AppData.run` tăng `revision` → mọi `useQuery` đang gắn (màn hiện tại + `AppShell` đọc `listTeams` / `listPeople`) đọc lại toàn bảng (**CL-B8**, ≈ 115–140 ms Node) → view tính lại (**CL-E1** `monthGrid` 23 ms, **CL-F6** 28–56 ms) → `DataTable` dựng lại mọi dòng (**CL-D7**). Đầu-cuối trong exe: Lịch hẹn kỳ Tháng 205–266 ms, kỳ Năm 487–519 ms (CL-D7); Team 149–251 ms (CL-F). Sửa riêng một phần không đưa lệnh ghi kỳ Năm về dưới 200 ms; nên đo lại đầu-cuối sau mỗi phần, theo thứ tự B8 → D7 → E1 / F6.
- **Luật chỉ có ở UI, lệnh db không giữ:** ngày KYC / ngày sinh tương lai (**CL-B3**), NFC tên (**CL-B11**), người phối hợp không phải RE (**CL-B9**), lịch dời trùng ngày giờ lịch cũ (**CL-E4** T7). Cùng một hướng sửa: đưa luật vào lệnh trước Phase 5 (AI ghi qua lệnh).
- **Lỗi không mang tham số mà câu báo cần:** `TRANSITION_BEFORE_LATEST` (**CL-E2**). Đã quét mọi mã có chỗ trống (`TEAM_REQUIRED`, `TEAM_NAME_TAKEN`, `TEAM_HAS_LEAD`, `SCHEMA_TOO_NEW`, `BACKUP_TOO_LARGE`): chỉ mã này lệch; xem "đã xét" C.
- **Hợp đồng JS ↔ Rust chép hai nơi:** **CL-C8**. **F5 trong exe:** **CL-C1** (Rust) + **CL-D4** (JS). **Escape đóng hộp đang chạy → đường từ UI tới KNOWN S-2:** **CL-D1**.
- **Export / hàm không dùng ở mỗi package:** **CL-A5** (domain), **CL-B7** (db, gồm `readOverview` ≡ `readReports` ≈ `loadMetricsData`), **CL-D8** / **CL-F5** (i18n, nhánh chết).
- **Đồng hồ / múi giờ trong test:** **CL-B12**, **CL-D6**, **CL-F1** (e2e đỏ từ 01/01/2027), **CL-G12**.

## 5. Đã xét, không thấy

- **E — Edge case (xuyên gói):**
  - "Hôm nay" giữa các lớp: `domain` (`fromLocalDate`), `db` (`today(db)` = ngày địa phương của `db.now()`, `common.ts:52-54`), app (`app-data.ts:171-186`, ngày ghim + đồng hồ), Rust (độ lệch múi giờ truyền từ JS khi đặt tên file): cùng định nghĩa ngày địa phương; ngoại lệ duy nhất là đường nhập backup → CL-H1.
  - Bản ghi "sống" mà `domain` đòi lớp gọi lọc (`appointment-counts.ts:31-34`): `listAppointments`, `listStageTransitions`, `listPolicies` đều lọc cả bản ghi xóa mềm lẫn KH đã xóa (`appointments.ts:93-110`, `customers.ts:80-88`, `policies.ts:19-24`).
  - Sau mỗi lần lưu, `sql.js export()` mở lại kết nối: `database.ts:69-75` bật lại `foreign_keys` và xóa bộ đệm statement; bộ đệm truy vấn drizzle (`common.ts:81-93`) không giữ statement nên vẫn đúng sau khi mở lại.
- **C — Đúng hợp đồng (nhất quán lỗi / mã lỗi):**
  - 48 mã `DB_ERROR_CODES`: mã nào cũng có chỗ ném trong `db` (grep `'<CODE>'` ngoài `errors.ts` và test: 1–3 chỗ mỗi mã), có câu `error.*` (test sẵn có). `domain` ném `Error` / `RangeError` chỉ khi lớp gọi vi phạm tiền điều kiện; `db` đổi các ca có thể đến từ người dùng thành `DbError` (`toIsoDate` → `INVALID_DATE`, `normalizeKycValue` → `INVALID_KYC_VALUE`).
  - 14 nơi gọi `errorMessage(` đều nằm trên đường ghi (lệnh trong `try`), nên câu chung `error.unknown` "Chưa lưu được thay đổi. Dữ liệu không bị đổi." đúng nghĩa ở mọi nơi nó có thể hiện. Hai lỗi chuỗi của app (`RELOAD_UNSAVED_CHANGES`, `SAVE_FAILED`) được nhận bằng hàm riêng (`isUnsavedChangesError`, `flush`) chứ không qua `errorMessage`.
  - Phân loại nhóm lịch hẹn: Tổng quan / Báo cáo / Lịch hẹn dùng chung `appointmentGroup` của `domain` (`appointment-counts.ts:17`; `appointments-view.ts:105, 345, 364`; `AppointmentsScreen.tsx:131`), không có bản thứ hai.
- **D — Dữ liệu (xuyên gói):** đường ghi duy nhất là `AppData.run` → lệnh db → `db.transaction` → `persist` sau `COMMIT` → `persist-queue` → `db_save`; mỗi lớp đã được gói B / C / D kiểm. Nhập backup: `readBackup` dựng DB tạm, kiểm, rồi `replace` (KNOWN S-2; CL-H1 chỉ là đồng hồ của luật 10). Không thấy đường ghi nào bỏ qua lệnh db (grep `db.orm.insert|update|delete` và `sqlite.run|exec` ngoài `packages/db`: không có).
- **P — Hiệu năng mở app đầu-cuối** (exe release `f0c53eb`, `project2c.db` 13,07 MB sinh từ `load-backup.json` qua `importBackup` → `export`, WebView2, cổng debug 9340; `startup-1.result.json`):
  - **Lần mở đầu** (tiến trình mới, route nhớ là Lịch hẹn): tải `index` / `chart` / CSS xong ở 31 ms; `DOMContentLoaded` 72 ms; IPC `db_open` 72 → 163 ms (91 ms, gồm mở + sao lưu phía Rust và chuyển 13 MB); chữ "Đang mở dữ liệu…" vẽ ở 188 ms; `sql-wasm.wasm` chỉ bắt đầu tải ở 192 ms (sau khi `db_open` trả về, vì `openDatabase` chạy sau `storage.load()`), xong ở 201 ms; một long task 212 → 402 ms (190 ms: khởi tạo wasm, mở DB, đọc bảng, render màn); **màn đầu vẽ xong (LCP) ở 540 ms**; heap JS 26 MB. Cùng cỡ với số của gói D (609–668 ms, đo từ lúc khởi động tiến trình).
  - **Tải lại** (5 lần mỗi màn, trung vị, tới khi `main` có nội dung): Lịch hẹn 361 ms, Tổng quan 344 ms, Báo cáo 352 ms, Team 314 ms, Cài đặt 295 ms, Khách hàng 234 ms; `db_open` 85–88 ms mỗi lần. CPU tới màn đầu: chunk `index` 26–105 ms, wasm 8–29 ms, GC 1–5 ms, chunk `chart` **2–3 ms**.
  - Không thành phát hiện: mở app < 0,6 s với dữ liệu tải. Tải `sql-wasm` song song với `db_open` chỉ bớt được ≈ 10–40 ms (tải 9 ms + khoảng chờ 29 ms).
  - **Bundle:** chunk `index` 737 KB nguồn ánh xạ: react-dom 202,6 KB · zod 86,3 KB · drizzle-orm 62,2 KB · `packages/db` 51,4 KB (seed + seed-data 9,0 KB) · sql.js 39,0 KB · `i18n/vi.ts` 36,8 KB · tanstack table 28,8 KB · domain 17,9 KB (`bundle-composition.result.json`, `bundle-files.result.json`). `zod` chỉ dùng cho nhập / xuất backup nhưng nạp lúc mở; vì cả chunk `chart` 527 KB chỉ tốn 2–3 ms CPU khi mở (WebView2 có cache mã), phần zod không đo được tác động riêng → không báo. Không gói npm nào bị bundle hai phiên bản (`bundle-dup-versions.result.json`). ExcelJS tách chunk, nạp khi xuất (gói F).
  - Chi phí mỗi lệnh ghi: §4 (CL-B8, CL-D7, CL-E1, CL-F6), không đo lại.
- **B — Bloat (xuyên gói):**
  - Dependency: mọi dependency khai báo trong 4 `package.json` đều được import (grep), không import gói chưa khai báo (luật probe `x-no-non-package-json`: 0), không file sản phẩm nào import devDependency (0) hay file test / `test-support` (0).
  - File mồ côi: luật `x-no-orphans` trên `apps packages e2e`: 0.
  - Token CSS: 33 / 33 màu Tailwind của `theme.css` có class dùng, 44 / 44 biến của `tokens.css` có nơi đọc (`--sidebar-w` qua `w-(--sidebar-w)`) (`tokens-usage.result.json`).
  - Export của `ui` chỉ một nơi dùng (`NavIcon`, `Chart`, `PolicyBadge`): đúng vai trò thư viện dùng chung của ADR-0006, không báo (ngoài prop thừa ở CL-H2).
  - `tsc -p e2e --noUnusedLocals --noUnusedParameters`: sạch (`tsconfig.base.json` đã bật hai cờ cho mọi package).
  - Lặp ≥ 3 nơi: CL-H3; các lặp khác đã có ID (§4, CL-E8, KNOWN #141 / #144).
- **T — Chất lượng test (xuyên gói):**
  - **Luật ranh giới có bắt thật:** bản sao của `apps/packages` với 10 vi phạm cài thử (`dc-mutation.log`): luật repo bắt `ui → db`, `ui → apps`, `db → ui`, `domain → db`, `domain → react`, vòng `a ↔ b` (6/6 vi phạm thuộc luật). Không bắt (đúng thiết kế): `db → domain/src/period.ts`, `apps → db/src/schema.ts` (luật không cấm import sâu), `domain/*.test.ts → db` (test được miễn). Code thật không có import sâu nào ngoài 7 test đọc golden fixture của `domain` (`depcruise-extra.log`) — chủ ý, không báo.
  - `lint:deps` chỉ chạy `apps packages`; `e2e/` chỉ import `@playwright/test`, `./support`, `node:*` (grep) nên không cần.
  - File logic có unit test nhưng ngoài `coverage.include`: `*-form.ts` (CL-E4), `period-labels.ts` (CL-F2), `packages/ui` (`token-guard.ts` → CL-D6 TG3). Đo riêng (`cov-outside*.log`): `i18n/index.ts`, `chart-theme.ts`, `PeriodPicker.label.ts` 100 %; `compare-cells.ts` 100 % dòng / 87,5 % nhánh; `token-guard.ts` 90,9 % nhánh. Không thêm gì ngoài các ID trên.
- **A — Trợ năng / i18n (xuyên gói):** chuỗi do `db` / `domain` sinh ra mà UI hiện (`Cập nhật KYC …`, ghi chú `SYSTEM`, đơn vị tiền) là ACCEPTED / ADR-0013; lỗi Rust chỉ hiện ở "Chi tiết kỹ thuật" (gói C). Không có chuỗi UI nào đi thẳng từ `DbError.message` (mã) ra màn: mọi nơi qua `errorMessage`. Focus / Escape: CL-D1–D3, CL-G4.
- **S — An toàn (hẹp, đầu-cuối):** nhập backup: giới hạn 100 MB ở UI (bytes) và db (ký tự) khớp; tên bảng / cột lấy từ schema; giá trị bind (gói B). Tên file xuất sinh trong `domain` (`localFileStamp`) / `report-workbook` (ASCII) rồi Rust lọc lại (gói C, F). Webview không gửi đường dẫn nào (`openFolder` chỉ `'exports' | 'backups'`). `capabilities/default.json` chỉ `core:default` + `window:allow-destroy` (gói C). Không thấy gì mới.

## 6. Kết luận cho G7 (phía Claude)

**CHƯA SẴN SÀNG** — sẵn sàng sau khi sửa một nhóm nhỏ (ước lượng ≤ 150 dòng SP + test, có thể 2–3 Issue `risk:low`/`med`).

Cơ sở (tổng 8 gói Claude: A 8, B 13, C 10, D 8, E 8, F 6, G 13, H 3 = **69 phát hiện**; 0 Critical, 0 High, **1 Medium** (CL-D1), còn lại Low / Nit; PLAUSIBLE chỉ CL-C10 và một phần CL-D4):

- **Điều tốt:** số liệu đúng spec và golden trên mọi phép thử (domain vét cạn 1900–2100; 588 phép so chéo giữa các màn và 5 746 ô Excel không lệch — gói F); dữ liệu do app ghi qua đủ 10 luật nhập và xuất / nhập giống hệt từng ký tự (gói B); ghi file nguyên tử, không mất dữ liệu khi lỗi giữa chừng (gói C); ranh giới module và mã lỗi nhất quán (gói H); mở app với dữ liệu tải ≈ 0,5 s.
- **Nên sửa trước khi phát hành exe Phase 4** (đụng trực tiếp người dùng exe hoặc chặn CI sắp tới):
  1. **CL-D1** (Medium) + **CL-D2** (Low): Escape đóng hộp "đang chạy" / hộp đóng app → không đóng được app bằng X nữa; Enter ngay khi hộp đóng app hiện là "Đóng và bỏ thay đổi chưa lưu" (focus sai nút). Cùng file `Dialog.tsx` / `CloseGuard.tsx`.
  2. **CL-D4** + **CL-C1** (Low): F5 / Ctrl+R trong exe bỏ thay đổi chưa lưu mà không hỏi, và có thể xóa `.tmp` của lần lưu đang chạy. Chặn phím tải lại trong exe là đủ cho cả hai.
  3. **CL-F1** (Low): một test e2e chắc chắn đỏ từ 01/01/2027, chặn mọi PR code giữa Phase 5. ≤ 5 dòng.
- **Có thể để Phase 5 / sổ OPEN** (Owner chọn): hiệu năng mỗi lệnh ghi (CL-B8, CL-D7, CL-E1, CL-F6 — chậm nhưng không sai, kỳ Năm ≈ 0,5 s / lệnh ghi); luật chỉ ở UI cần đưa vào lệnh **trước khi AI ghi qua lệnh ở Phase 5** (CL-B3, B9, B11, E4-T7); đường nhập backup lỏng (CL-B1, B2) trước snapshot Phase 6; bẫy migration (CL-B5) trước lần đổi schema kế tiếp; quy trình (CL-G1 nhãn `build-exe`, CL-G2); câu chữ / trợ năng / test / bloat còn lại.

Nếu Owner chấp nhận ba mục trên là rủi ro đã biết (dữ liệu hiện là giả lập, R2-02), phía Claude không thấy lỗi nào làm sai số liệu hay mất dữ liệu đã lưu, và khi đó coi là **sẵn sàng có điều kiện**. Chờ Owner yêu cầu đọc tất cả báo cáo và tổng hợp (§8 kế hoạch).

## Phụ lục A — Kết quả probe

### `importclock.result.json` (CL-H1)

```json
{
 "appToday": "15/09/2026",
 "preview": "accepted: {\"teams\":1,\"people\":1,\"customers\":1,\"appointments\":1,\"policies\":0}",
 "imported": [
  "01/10/2026 MET"
 ],
 "withAppClock": "BACKUP_INVALID {\"rule\":10}",
 "ownCommand": "OUTCOME_IN_FUTURE {}"
}
```

### `chart-canvas-bytes.result.json` (CL-H2)

```json
{
 "chunk": "chart-C8LBIHNl.js",
 "totalKB": 514.1,
 "canvasKB": 21.5,
 "svgKB": 21,
 "canvasFiles": [
  "zrender/lib/canvas/helper.js",
  "zrender/lib/canvas/dashStyle.js",
  "zrender/lib/canvas/graphic.js",
  "zrender/lib/canvas/Layer.js",
  "zrender/lib/canvas/Painter.js",
  "echarts/lib/renderer/installCanvasRenderer.js"
 ]
}
```

### `collator-diff.result.json` (CL-H3)

```json
{
 "customers": {
  "n": 1496,
  "positionsDiffer": 0,
  "sample": []
 },
 "people": {
  "n": 51,
  "positionsDiffer": 0,
  "sample": []
 },
 "teams": {
  "n": 4,
  "positionsDiffer": 0,
  "sample": []
 },
 "synthetic": {
  "n": 3,
  "positionsDiffer": 2,
  "sample": [
   [
    "Team 10",
    "Team 2"
   ],
   [
    "Team 2",
    "Team 10"
   ]
  ]
 },
 "ties": [
  -1,
  0,
  -1,
  -1
 ]
}
```

### `tokens-usage.result.json` (đã xét B)

```json
{
 "unusedThemeColor": [],
 "themeColorUses": {
  "surface-0": 7,
  "surface-1": 20,
  "surface-2": 17,
  "surface-3": 6,
  "border": 45,
  "border-strong": 16,
  "fg": 17,
  "fg-2": 54,
  "fg-3": 97,
  "accent": 47,
  "accent-soft": 6,
  "on-accent": 4,
  "heading": 15,
  "period-band": 1,
  "period-band-border": 1,
  "date-today": 3,
  "date-past-bg": 1,
  "date-today-bg": 1,
  "date-future-bg": 1,
  "n4": 3,
  "n3": 3,
  "n2": 3,
  "n1": 3,
  "on-hold": 2,
  "lost": 2,
  "submitted": 1,
  "issued": 2,
  "ok": 11,
  "warn": 9,
  "danger": 47,
  "info": 15,
  "appt-unrecorded": 4,
  "appt-missed": 3
 },
 "unusedVar": [
  "sidebar-w"
 ]
}
```

### `bundle-dup-versions.result.json` (đã xét P / B)

```json
{
 "packages": {
  "tslib": [
   "tslib@2.3.0"
  ],
  "zrender": [
   "zrender@6.1.0"
  ],
  "echarts": [
   "echarts@6.1.0"
  ],
  "exceljs": [
   "exceljs@4.4.0"
  ],
  "@tauri-apps/api": [
   "@tauri-apps+api@2.11.1"
  ],
  "react": [
   "react@19.3.0"
  ],
  "scheduler": [
   "scheduler@0.28.0"
  ],
  "react-dom": [
   "react-dom@19.3.0_react@19.3.0"
  ],
  "sql.js": [
   "sql.js@1.14.2"
  ],
  "drizzle-orm": [
   "drizzle-orm@0.45.3_@types+sql.js@1.4.11_sql.js@1.14.2"
  ],
  "zod": [
   "zod@4.6.5"
  ],
  "@tanstack/react-table": [
   "@tanstack+react-table@9.2.4_6382c6160242113014fc5c759bd4b2fc"
  ],
  "@tanstack/store": [
   "@tanstack+store@0.11.1"
  ],
  "use-sync-external-store": [
   "use-sync-external-store@1.7.0_react@19.3.0"
  ],
  "@tanstack/react-store": [
   "@tanstack+react-store@0.11._24bd51e295017816a0f8da416ed131ab"
  ],
  "@tanstack/table-core": [
   "@tanstack+table-core@9.2.4"
  ]
 },
 "duplicates": []
}
```

### `makedb.result.json` (dữ liệu exe)

```json
{"bytes":13074432}
```

### `startup-1.result.json` (đã xét P — lần mở đầu + tóm tắt tải lại; từng lượt ở file)

```json
{
 "first": {
  "hash": "#/appointments",
  "nav": {
   "dcl": 72,
   "load": 74
  },
  "paint": [
   [
    "first-paint",
    188
   ],
   [
    "first-contentful-paint",
    188
   ]
  ],
  "lcp": [
   {
    "t": 540,
    "size": 4032,
    "el": "SPAN"
   }
  ],
  "longtasks": [
   [
    212,
    190
   ]
  ],
  "resources": [
   {
    "name": "tauri.localhost/assets/index-jly9vMSz.js",
    "start": 17,
    "end": 28,
    "dur": 12,
    "bytes": 744058
   },
   {
    "name": "tauri.localhost/assets/index-C7x0tB0p.css",
    "start": 17,
    "end": 22,
    "dur": 5,
    "bytes": 27334
   },
   {
    "name": "tauri.localhost/assets/rolldown-runtime-Dd_uD5pT.js",
    "start": 17,
    "end": 21,
    "dur": 4,
    "bytes": 1406
   },
   {
    "name": "tauri.localhost/assets/chart-C8LBIHNl.js",
    "start": 17,
    "end": 31,
    "dur": 14,
    "bytes": 527418
   },
   {
    "name": "ipc.localhost/db_open",
    "start": 72,
    "end": 163,
    "dur": 91,
    "bytes": 0
   },
   {
    "name": "tauri.localhost/assets/be-vietnam-pro-latin-ext-400-normal-CiZNW1ec.woff2",
    "start": 77,
    "end": 78,
    "dur": 1,
    "bytes": 13356
   },
   {
    "name": "tauri.localhost/assets/be-vietnam-pro-latin-400-normal-PpnXBOrz.woff2",
    "start": 81,
    "end": 82,
    "dur": 1,
    "bytes": 21468
   },
   {
    "name": "tauri.localhost/assets/be-vietnam-pro-vietnamese-400-normal-CRcqvyg1.woff2",
    "start": 81,
    "end": 82,
    "dur": 2,
    "bytes": 11832
   },
   {
    "name": "tauri.localhost/assets/sql-wasm-DfANybxk.wasm",
    "start": 192,
    "end": 201,
    "dur": 9,
    "bytes": 658710
   },
   {
    "name": "tauri.localhost/assets/be-vietnam-pro-latin-700-normal-DlW1Zbsh.woff2",
    "start": 411,
    "end": 413,
    "dur": 2,
    "bytes": 22452
   },
   {
    "name": "tauri.localhost/assets/be-vietnam-pro-latin-600-normal-BZDkUTrt.woff2",
    "start": 411,
    "end": 413,
    "dur": 1,
    "bytes": 22332
   },
   {
    "name": "tauri.localhost/assets/be-vietnam-pro-latin-500-normal-B6LVzGNe.woff2",
    "start": 411,
    "end": 413,
    "dur": 2,
    "bytes": 22192
   },
   {
    "name": "tauri.localhost/assets/be-vietnam-pro-vietnamese-600-normal-nyU-ZL2p.woff2",
    "start": 422,
    "end": 423,
    "dur": 1,
    "bytes": 12476
   },
   {
    "name": "tauri.localhost/assets/be-vietnam-pro-latin-ext-600-normal-BNd8euf0.woff2",
    "start": 425,
    "end": 426,
    "dur": 1,
    "bytes": 13908
   },
   {
    "name": "tauri.localhost/assets/be-vietnam-pro-vietnamese-500-normal-DREgrEoJ.woff2",
    "start": 430,
    "end": 431,
    "dur": 1,
    "bytes": 12472
   },
   {
    "name": "tauri.localhost/assets/be-vietnam-pro-latin-ext-500-normal-h0Fp6aX0.woff2",
    "start": 435,
    "end": 436,
    "dur": 1,
    "bytes": 13848
   },
   {
    "name": "ipc.localhost/plugin%3Aevent%7Clisten",
    "start": 568,
    "end": 574,
    "dur": 6,
    "bytes": 0
   }
  ],
  "heapMB": 26
 },
 "summary": {
  "#/appointments": {
   "firstScreenMedian": 361,
   "firstScreen": [
    374,
    365,
    361,
    347,
    359
   ],
   "dbOpenIpcMedian": 85,
   "dbOpenEndMedian": 135,
   "cpuMedian": {
    "program": 93,
    "idle": 107,
    "index-chunk": 105,
    "chart-chunk": 2,
    "native/other": 50,
    "wasm": 26,
    "gc": 5,
    "other-js": 0
   }
  },
  "#/overview": {
   "firstScreenMedian": 344,
   "firstScreen": [
    344,
    346,
    340,
    337,
    351
   ],
   "dbOpenIpcMedian": 85,
   "dbOpenEndMedian": 127,
   "cpuMedian": {
    "program": 45,
    "idle": 119,
    "index-chunk": 98,
    "chart-chunk": 3,
    "native/other": 46,
    "wasm": 29,
    "gc": 3,
    "other-js": 0
   }
  },
  "#/customers": {
   "firstScreenMedian": 234,
   "firstScreen": [
    233,
    234,
    234,
    251,
    250
   ],
   "dbOpenIpcMedian": 88,
   "dbOpenEndMedian": 130,
   "cpuMedian": {
    "program": 44,
    "idle": 122,
    "native/other": 13,
    "chart-chunk": 3,
    "index-chunk": 26,
    "wasm": 8,
    "gc": 1,
    "other-js": 0
   }
  },
  "#/reports": {
   "firstScreenMedian": 352,
   "firstScreen": [
    352,
    347,
    349,
    363,
    364
   ],
   "dbOpenIpcMedian": 87,
   "dbOpenEndMedian": 127,
   "cpuMedian": {
    "program": 58,
    "idle": 119,
    "native/other": 48,
    "chart-chunk": 3,
    "index-chunk": 101,
    "wasm": 26,
    "gc": 3
   }
  },
  "#/team": {
   "firstScreenMedian": 314,
   "firstScreen": [
    298,
    321,
    300,
    314,
    320
   ],
   "dbOpenIpcMedian": 87,
   "dbOpenEndMedian": 140,
   "cpuMedian": {
    "program": 59,
    "idle": 120,
    "gc": 5,
    "native/other": 37,
    "index-chunk": 64,
    "chart-chunk": 3,
    "wasm": 20
   }
  },
  "#/settings": {
   "firstScreenMedian": 295,
   "firstScreen": [
    302,
    288,
    295,
    291,
    307
   ],
   "dbOpenIpcMedian": 85,
   "dbOpenEndMedian": 127,
   "cpuMedian": {
    "program": 56,
    "idle": 119,
    "index-chunk": 60,
    "chart-chunk": 2,
    "gc": 3,
    "native/other": 38,
    "wasm": 26,
    "other-js": 0
   }
  }
 }
}
```

### `bundle-composition.result.json` (đã xét P — cấu thành chunk, 30 nhóm đầu)

```text
== chart-C8LBIHNl.js (526497 bytes)
324.0 KB 63.0% echarts
189.6 KB 36.9% zrender
0.4 KB 0.1% tslib
0.1 KB 0.0% (unmapped)
== index-jly9vMSz.js (737071 bytes)
202.6 KB 28.2% react-dom
86.3 KB 12.0% zod
62.2 KB 8.6% drizzle-orm
51.4 KB 7.1% packages/db/src
42.0 KB 5.8% apps/desktop/src/routes/appointments
39.0 KB 5.4% sql.js
38.6 KB 5.4% apps/desktop/src/routes/customers
37.3 KB 5.2% apps/desktop/src/i18n
28.8 KB 4.0% @tanstack/table-core
17.9 KB 2.5% packages/domain/src
14.8 KB 2.1% @tauri-apps/api
13.7 KB 1.9% apps/desktop/src/routes
13.7 KB 1.9% apps/desktop/src/routes/reports
13.4 KB 1.9% apps/desktop/src/routes/overview
12.6 KB 1.8% packages/ui/src/components
10.9 KB 1.5% apps/desktop/src/routes/team
8.9 KB 1.2% apps/desktop/src/shell
8.0 KB 1.1% react
4.3 KB 0.6% @tanstack/store
3.9 KB 0.5% apps/desktop/src/data
3.4 KB 0.5% scheduler
2.1 KB 0.3% (unmapped)
1.5 KB 0.2% use-sync-external-store
1.4 KB 0.2% @tanstack/react-table
0.5 KB 0.1% apps/desktop/src
0.2 KB 0.0% @tanstack/react-store
```

### `dc-mutation.log` (đã xét T — vi phạm cài thử, đã bỏ các dòng `not-to-unresolvable` do bản sao không có `node_modules`)

```text
  error ui-not-to-data: packages/ui/src/zz-ui-to-db.ts → packages/db/src/index.ts
  error packages-not-to-apps: packages/ui/src/zz-ui-to-app.ts → apps/desktop/src/i18n/index.ts
  error no-circular: packages/db/src/zz-cycle-a.ts → 
  error domain-is-pure: packages/domain/src/zz-domain-to-npm.ts → react
  error domain-is-pure: packages/domain/src/zz-domain-to-db.ts → packages/db/src/index.ts
  error db-and-ai-only-on-domain: packages/db/src/zz-db-to-ui.ts → packages/ui/src/index.ts
x 314 dependency violations (314 errors, 0 warnings). 225 modules, 922 dependencies cruised.
```

### `depcruise-extra.log` (đã xét B / T — luật chặt hơn trên repo thật)

```text

  error x-no-deep-into-other-package: packages/db/src/golden-metrics.test.ts → packages/domain/src/golden/metrics.fixture.ts
    Apps and packages reach another workspace package only through its entry.

  error x-no-deep-into-other-package: packages/db/src/golden-kyc.test.ts → packages/domain/src/golden/kyc.fixture.ts
    Apps and packages reach another workspace package only through its entry.

  error x-no-deep-into-other-package: apps/desktop/src/routes/reports/reports-view.test.ts → packages/domain/src/golden/metrics.fixture.ts
    Apps and packages reach another workspace package only through its entry.

  error x-no-deep-into-other-package: apps/desktop/src/routes/overview/team-compare-view.test.ts → packages/domain/src/golden/metrics.fixture.ts
    Apps and packages reach another workspace package only through its entry.

  error x-no-deep-into-other-package: apps/desktop/src/routes/overview/stage-view.test.ts → packages/domain/src/golden/stage-snapshot.fixture.ts
    Apps and packages reach another workspace package only through its entry.

  error x-no-deep-into-other-package: apps/desktop/src/routes/overview/stage-view.test.ts → packages/domain/src/golden/metrics.fixture.ts
    Apps and packages reach another workspace package only through its entry.

  error x-no-deep-into-other-package: apps/desktop/src/routes/overview/overview-view.test.ts → packages/domain/src/golden/metrics.fixture.ts
    Apps and packages reach another workspace package only through its entry.


x 7 dependency violations (7 errors, 0 warnings). 228 modules, 792 dependencies cruised.
```

### `cov-outside.log` (đã xét T — file ngoài `coverage.include`; lỗi ngưỡng ở cuối là do chạy riêng một phần)

```text
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   97.68 |    95.62 |   93.75 |   98.63 |                   
 ...top/src/routes |       0 |      100 |     100 |       0 |                   
  period-labels.ts |       0 |      100 |     100 |       0 | 5                 
 ...s/appointments |   96.25 |     94.8 |    87.5 |    98.3 |                   
  ...tment-form.ts |   97.22 |    87.09 |    92.3 |     100 | 62,96             
  outcome-form.ts  |   95.45 |      100 |   81.81 |   96.66 | 96                
 ...utes/customers |     100 |    97.87 |     100 |     100 |                   
  policy-form.ts   |     100 |    97.87 |     100 |     100 | 95                
 packages/ui/src   |     100 |     90.9 |     100 |     100 |                   
  token-guard.ts   |     100 |     90.9 |     100 |     100 | 63                
 ...src/components |     100 |    91.66 |     100 |     100 |                   
  compare-cells.ts |     100 |     87.5 |     100 |     100 | 36                
-------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 97.68% ( 169/173 )
Branches     : 95.62% ( 153/160 )
Functions    : 93.75% ( 45/48 )
Lines        : 98.63% ( 144/146 )
================================================================================
ERROR: Coverage for lines (97.64%) does not meet "apps/desktop/src/routes/**" threshold (99%)
ERROR: Coverage for functions (90.9%) does not meet "apps/desktop/src/routes/**" threshold (99%)
ERROR: Coverage for statements (96.33%) does not meet "apps/desktop/src/routes/**" threshold (99%)
```

## Phụ lục B — Nguồn test tạm / probe

Vi phạm cài thử cho `dc-copy\` (mỗi dòng một file mới trong bản sao `packages/*/src`, `apps/desktop/src`; chạy luật của repo bằng `depcruise apps packages --config .dependency-cruiser.cjs` trong `dc-copy`):

```text
packages/db/src/zz-db-to-ui.ts:          import '../../ui/src/index.ts'
packages/ui/src/zz-ui-to-db.ts:          import '../../db/src/index.ts'
packages/domain/src/zz-domain-to-db.ts:  import '../../db/src/index.ts'
packages/ui/src/zz-ui-to-app.ts:         import '../../../apps/desktop/src/i18n/index.ts'
packages/domain/src/zz-domain-to-npm.ts: import 'react'
packages/db/src/zz-db-deep-domain.ts:    import '../../domain/src/period.ts'
apps/desktop/src/data/zz-app-deep-db.ts: import '../../../../packages/db/src/schema.ts'
packages/db/src/zz-cycle-a.ts / zz-cycle-b.ts: import lẫn nhau
packages/domain/src/zz-domain.test.ts:   import '../../db/src/index.ts'
```

### `vitest.probe.config.mts`

```ts
// Runs the gói H probes (probe-*.test.ts) against the review worktree's packages, read-only.
// Usage (PowerShell, from this folder): node node_modules/vitest/vitest.mjs run --config vitest.probe.config.mts [filter]
const repo = 'C:/workspace/Project-2C-review';
const here = 'C:/workspace/deep-review-1-4/claude/H';

export default {
  root: here,
  resolve: {
    alias: [
      { find: /^@p2c\/domain$/, replacement: `${repo}/packages/domain/src/index.ts` },
      { find: /^@p2c\/db$/, replacement: `${repo}/packages/db/src/index.ts` },
      { find: /^@p2c\/ui$/, replacement: `${repo}/packages/ui/src/index.ts` },
      { find: /^#db\/(.*)$/, replacement: `${repo}/packages/db/src/$1` },
      { find: /^#app\/(.*)$/, replacement: `${repo}/apps/desktop/src/$1` },
      { find: /^drizzle-orm$/, replacement: `${repo}/packages/db/node_modules/drizzle-orm/index.js` },
    ],
  },
  server: { fs: { allow: [repo, here, 'C:/workspace/deep-review-1-4/common'] } },
  test: {
    include: ['probe-*.test.ts'],
    globals: true,
    testTimeout: 900_000,
    fileParallelism: false,
  },
};
```

### `probe-makedb.test.ts`

```ts
// Writes the load data as the exe's database file (H\exe\Project2C-data\project2c.db), exactly the
// bytes the app saves after importing load-backup.json (importBackup → export).
import { readFileSync, writeFileSync } from 'node:fs';
import { importBackup } from '@p2c/db';

it('writes project2c.db from the load backup', async () => {
  const text = readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json', 'utf8');
  const { db } = await importBackup(text);
  const bytes = db.export();
  writeFileSync('C:/workspace/deep-review-1-4/claude/H/exe/Project2C-data/project2c.db', bytes);
  writeFileSync(
    'C:/workspace/deep-review-1-4/claude/H/makedb.result.json',
    JSON.stringify({ bytes: bytes.byteLength }),
  );
  expect(bytes.byteLength).toBeGreaterThan(10_000_000);
});
```

### `probe-importclock.test.ts`

```ts
// CL-H probe: the app's database keeps the app's (pinned) day as its clock (app-data.ts:176-186),
// but readBackup checks an import with the machine clock (importBackup without `now`).
// App day pinned to 15/09/2026 (as e2e builds do); a file holds a MET meeting on 01/10/2026,
// after the app's day and before the machine's (06/10/2026).
import { writeFileSync } from 'node:fs';
import {
  createCustomer,
  createPerson,
  createTeam,
  DbError,
  exportBackup,
  importBackup,
  listAppointments,
  openDatabase,
  recordMeetingOutcome,
  scheduleAppointment,
} from '@p2c/db';
import { calendarDate, formatDate } from '@p2c/domain';
import { openAppData } from '#app/data/app-data';

const code = (f: () => unknown) => {
  try {
    f();
    return 'accepted';
  } catch (e) {
    return e instanceof DbError ? `${e.code} ${JSON.stringify(e.params ?? {})}` : String(e);
  }
};

it('checks an import against the machine day, not the app day', async () => {
  const machineNow = new Date(2026, 9, 6, 10, 0); // 06/10/2026, as the review day
  const clock = () => new Date(machineNow);
  const appDay = calendarDate(2026, 9, 15);

  // A file made on a machine on 01/10/2026: one RE, one customer, one meeting held 01/10.
  const src = await openDatabase({ now: () => new Date(2026, 9, 1, 12, 0) });
  const team = createTeam(src, { name: 'Team X' });
  const re = createPerson(src, { name: 'RE X', role: 'RE', teamId: team.id });
  const customer = createCustomer(src, {
    name: 'KH X',
    reId: re.id,
    stage: 'N4',
    date: calendarDate(2026, 9, 1),
  });
  const appt = scheduleAppointment(src, {
    customerId: customer.id,
    reId: re.id,
    date: calendarDate(2026, 10, 1),
    triggerType: 'REFERRAL',
  });
  recordMeetingOutcome(src, appt.id, { status: 'MET', stageAfter: 'N4', nextStep: 'gọi lại' });
  const text = exportBackup(src);

  // The app as e2e builds open it: day pinned to 15/09/2026, the clock at 06/10/2026.
  const app = await openAppData({
    today: () => appDay,
    clock,
    seed: (db, anchor) => {
      const t = createTeam(db, { name: 'Seed' });
      createPerson(db, { name: 'RE seed', role: 'RE', teamId: t.id });
      void anchor;
    },
  });

  let preview: string;
  try {
    const read = await app.readBackup(text);
    preview = `accepted: ${JSON.stringify(read.counts)}`;
    await app.importBackup(read);
  } catch (e) {
    preview = e instanceof DbError ? `${e.code} ${JSON.stringify(e.params ?? {})}` : String(e);
  }
  const imported = listAppointments(app.db()).map((a) => `${formatDate(a.date)} ${a.status}`);

  // The same file checked with the app's clock, as app-data gives its own database.
  let withAppClock: string;
  try {
    await importBackup(text, { now: () => new Date(2026, 8, 15, 10, 0) });
    withAppClock = 'accepted';
  } catch (e) {
    withAppClock = e instanceof DbError ? `${e.code} ${JSON.stringify(e.params ?? {})}` : String(e);
  }

  // After the import, the app's own command refuses the same kind of record on that day.
  const fresh = app.run((db) =>
    scheduleAppointment(db, {
      customerId: listAppointments(db)[0]!.customerId,
      reId: listAppointments(db)[0]!.reId,
      date: calendarDate(2026, 10, 1),
      triggerType: 'REFERRAL',
    }),
  );
  const ownCommand = code(() =>
    app.run((db) =>
      recordMeetingOutcome(db, fresh.id, { status: 'MET', stageAfter: 'N4', nextStep: 'x' }),
    ),
  );

  const result = { appToday: formatDate(app.today()), preview, imported, withAppClock, ownCommand };
  writeFileSync('C:/workspace/deep-review-1-4/claude/H/importclock.result.json', JSON.stringify(result, null, 1));
  expect(preview.startsWith('accepted')).toBe(true);
  expect(withAppClock.startsWith('BACKUP_INVALID')).toBe(true);
  expect(ownCommand).toMatch(/OUTCOME_IN_FUTURE/);
});
```

### `depcruise-extra.cjs`

```js
/**
 * Probe config for package H: the repo's own rules (.dependency-cruiser.cjs)
 * plus stricter checks dependency-cruiser ships with. Run from the repo root:
 *   pnpm exec depcruise apps packages e2e tools --config <this file> --output-type err-long
 */
const base = require('C:/workspace/Project-2C-review/.dependency-cruiser.cjs');

module.exports = {
  forbidden: [
    ...base.forbidden,
    {
      name: 'x-no-orphans',
      severity: 'warn',
      from: {
        orphan: true,
        pathNot: [
          '\\.(test|spec)\\.(ts|tsx|mjs)$',
          '\\.d\\.ts$',
          '(^|/)(vite|vitest|playwright|drizzle)\\.config\\.',
          '(^|/)tsconfig',
        ],
      },
      to: {},
    },
    {
      name: 'x-prod-not-to-test',
      severity: 'error',
      from: { pathNot: '\\.(test|spec)\\.(ts|tsx|mjs)$|(^|/)e2e/|test-support|(^|/)tools/' },
      to: { path: '\\.(test|spec)\\.(ts|tsx)$|test-support' },
    },
    {
      name: 'x-no-non-package-json',
      severity: 'error',
      from: {},
      to: { dependencyTypes: ['npm-no-pkg', 'npm-unknown'] },
    },
    {
      name: 'x-prod-not-to-dev-dep',
      severity: 'error',
      from: {
        path: '^(apps|packages)/',
        pathNot: '\\.(test|spec)\\.(ts|tsx)$|test-support|(^|/)scripts/|\\.config\\.',
      },
      to: { dependencyTypes: ['npm-dev'], dependencyTypesNot: ['type-only'] },
    },
    {
      name: 'x-no-deep-into-other-package',
      comment: 'Apps and packages reach another workspace package only through its entry.',
      severity: 'error',
      from: { path: '^(apps/desktop|packages/db|packages/ui|packages/domain|e2e)/' },
      to: {
        path: '^packages/(db|ui|domain)/src/',
        pathNot: [
          '^$1/',
          '^packages/(db|ui|domain)/src/index\\.ts$',
          '^packages/ui/src/theme\\.css$',
        ],
      },
    },
  ],
  options: { ...base.options, exclude: { path: '(^|/)(dist|coverage|src-tauri|node_modules)/' } },
};
```

### `tokens-usage.mjs`

```js
// Which ADR-0013 tokens / Tailwind theme entries are referenced anywhere outside the two CSS files?
// Run: node tokens-usage.mjs (cwd anywhere). Reads the review worktree only.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const R = 'C:/workspace/Project-2C-review';
const theme = readFileSync(join(R, 'packages/ui/src/theme.css'), 'utf8');
const tokens = readFileSync(join(R, 'packages/ui/src/tokens.css'), 'utf8');

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css|html)$/.test(name) && !/\.test\./.test(name)) files.push(p);
  }
};
walk(join(R, 'apps/desktop/src'));
walk(join(R, 'packages/ui/src'));
files.push(join(R, 'apps/desktop/index.html'));
const src = files
  .filter((f) => !/[\\/](tokens|theme)\.css$/.test(f))
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n');

const themeColors = [...theme.matchAll(/--color-([a-z0-9-]+):/g)].map((m) => m[1]).filter((n) => n !== '*');
const result = { unusedThemeColor: [], themeColorUses: {}, unusedVar: [] };
for (const c of themeColors) {
  // Tailwind utilities: bg-c, text-c, border-c, ring-c, outline-c, fill-c, stroke-c, from-/to-, decoration-, divide-, accent-, caret-, plus opacity /NN
  const re = new RegExp(`(?<![\\w-])(?:[a-z]+:)*(?:bg|text|border(?:-[trblxy])?|ring|outline|fill|stroke|from|to|via|decoration|divide|accent|caret|shadow|placeholder)-${c}(?![\\w-])`, 'g');
  const n = (src.match(re) ?? []).length;
  result.themeColorUses[c] = n;
  if (n === 0) result.unusedThemeColor.push(c);
}
const vars = [...tokens.matchAll(/^\s*--([a-z0-9-]+):/gm)].map((m) => m[1]);
const all = src + theme.replace(/--([a-z0-9-]+):/g, '') + tokens.replace(/^\s*--([a-z0-9-]+):/gm, '');
for (const v of vars) {
  const n = (all.match(new RegExp(`var\\(--${v}\\)|['"\`]--${v}['"\`]|['"\`]${v}['"\`]`, 'g')) ?? []).length;
  if (n === 0) result.unusedVar.push(v);
}
console.log(JSON.stringify(result, null, 1));
```

### `bundle-composition.mjs`

```js
// Bundle composition from the sourcemaps of a `vite build --sourcemap` into dist-map\:
// generated bytes of each chunk attributed to the source (grouped by npm package / workspace folder).
// Run: node bundle-composition.mjs [dist-map]   (no dependency: decodes VLQ itself)
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(process.argv[2] ?? 'dist-map', 'assets');
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const val = Object.fromEntries([...B64].map((c, i) => [c, i]));

function decodeSegment(str) {
  const out = [];
  let shift = 0;
  let value = 0;
  for (const ch of str) {
    const d = val[ch];
    value += (d & 31) << shift;
    if (d & 32) shift += 5;
    else {
      const neg = value & 1;
      value >>>= 1;
      out.push(neg ? -value : value);
      value = 0;
      shift = 0;
    }
  }
  return out;
}

const group = (src) => {
  const s = src.replace(/\\/g, '/');
  const pnpm = s.match(/node_modules\/\.pnpm\/[^/]+\/node_modules\/((?:@[^/]+\/)?[^/]+)/);
  if (pnpm) return pnpm[1];
  const nm = s.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/);
  if (nm) return nm[1];
  // DETAIL=1: one line per workspace file instead of per folder.
  if (process.env.DETAIL) {
    const file = s.match(/((?:packages|apps)\/.+)$/);
    if (file) return file[1];
  }
  const ws = s.match(/(packages\/[^/]+\/src(?:\/[^/]+)?|apps\/desktop\/src(?:\/[^/]+(?:\/[^/]+)?)?)/);
  if (ws) return ws[1].replace(/\/[^/]+\.(tsx?|css)$/, '');
  return s;
};

const result = {};
for (const name of readdirSync(dir).filter((n) => n.endsWith('.js') && readdirSync(dir).includes(n + '.map'))) {
  const code = readFileSync(join(dir, name), 'utf8');
  const map = JSON.parse(readFileSync(join(dir, `${name}.map`), 'utf8'));
  const lines = code.split('\n');
  const bytes = {};
  let src = 0;
  const add = (s, n) => {
    const g = s === -1 ? '(unmapped)' : group(map.sources[s]);
    bytes[g] = (bytes[g] ?? 0) + n;
  };
  map.mappings.split(';').forEach((lineMap, li) => {
    const line = lines[li] ?? '';
    let col = 0;
    let prevCol = 0;
    let prevSrc = -1;
    let first = true;
    for (const seg of lineMap.split(',').filter(Boolean)) {
      const d = decodeSegment(seg);
      col += d[0];
      if (first && col > 0) add(-1, col);
      else if (!first) add(prevSrc, col - prevCol);
      first = false;
      if (d.length >= 4) {
        src += d[1];
        prevSrc = src;
      } else prevSrc = -1;
      prevCol = col;
    }
    add(first ? -1 : prevSrc, line.length - prevCol + 1);
  });
  const total = Object.values(bytes).reduce((a, b) => a + b, 0);
  result[name] = {
    total,
    top: Object.entries(bytes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, process.env.DETAIL ? 80 : 30)
      .map(([g, n]) => `${(n / 1024).toFixed(1)} KB ${((100 * n) / total).toFixed(1)}% ${g}`),
  };
}
console.log(JSON.stringify(result, null, 1));
```

### `chart-canvas-bytes.mjs`

```js
// Bytes of the chart chunk from the Canvas renderer path (zrender/lib/canvas, echarts installCanvasRenderer)
// vs the SVG one, from the dist-map sourcemap. Run from H\: node chart-canvas-bytes.mjs
import { readFileSync, readdirSync } from 'node:fs';

const dir = 'dist-map/assets';
const name = readdirSync(dir).find((n) => n.startsWith('chart-') && n.endsWith('.js'));
const code = readFileSync(`${dir}/${name}`, 'utf8');
const map = JSON.parse(readFileSync(`${dir}/${name}.map`, 'utf8'));
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const val = Object.fromEntries([...B64].map((c, i) => [c, i]));
const dec = (str) => {
  const o = [];
  let sh = 0;
  let v = 0;
  for (const ch of str) {
    const d = val[ch];
    v += (d & 31) << sh;
    if (d & 32) sh += 5;
    else {
      const n = v & 1;
      v >>>= 1;
      o.push(n ? -v : v);
      v = 0;
      sh = 0;
    }
  }
  return o;
};
const bytes = new Map();
const lines = code.split('\n');
let src = 0;
map.mappings.split(';').forEach((lm, li) => {
  let col = 0;
  let prev = 0;
  let ps = -1;
  let first = true;
  const add = (s, n) => {
    if (s >= 0) bytes.set(s, (bytes.get(s) ?? 0) + n);
  };
  for (const seg of lm.split(',').filter(Boolean)) {
    const d = dec(seg);
    col += d[0];
    if (!first) add(ps, col - prev);
    first = false;
    if (d.length >= 4) {
      src += d[1];
      ps = src;
    } else ps = -1;
    prev = col;
  }
  add(ps, (lines[li] ?? '').length - prev);
});
let canvas = 0;
let svg = 0;
let total = 0;
const canvasFiles = [];
for (const [s, n] of bytes) {
  const p = map.sources[s].split('\\').join('/');
  total += n;
  if (/zrender\/lib\/canvas\/|echarts\/lib\/renderer\/installCanvasRenderer/.test(p)) {
    canvas += n;
    canvasFiles.push(p.replace(/.*node_modules\//, ''));
  }
  if (/zrender\/lib\/svg\/|echarts\/lib\/renderer\/installSVGRenderer/.test(p)) svg += n;
}
const kb = (n) => +(n / 1024).toFixed(1);
console.log(
  JSON.stringify({ chunk: name, totalKB: kb(total), canvasKB: kb(canvas), svgKB: kb(svg), canvasFiles }, null, 1),
);
```

### `bundle-dup-versions.mjs`

```js
// Which npm packages are bundled in more than one version (index + chart chunks), from dist-map sourcemaps.
// Run from H\: node bundle-dup-versions.mjs
import { readFileSync, readdirSync } from 'node:fs';

const dir = 'dist-map/assets';
const versions = new Map();
for (const name of readdirSync(dir).filter((n) => n.endsWith('.js.map'))) {
  const map = JSON.parse(readFileSync(`${dir}/${name}`, 'utf8'));
  for (const source of map.sources) {
    const path = source.split('\\').join('/');
    const match = path.match(/\.pnpm\/([^/]+)\/node_modules\/((?:@[^/]+\/)?[^/]+)/);
    if (!match) continue;
    const [, store, pkg] = match;
    if (!versions.has(pkg)) versions.set(pkg, new Set());
    versions.get(pkg).add(store);
  }
}
const result = Object.fromEntries([...versions].map(([pkg, set]) => [pkg, [...set]]));
const duplicates = Object.entries(result).filter(([, list]) => list.length > 1);
console.log(JSON.stringify({ packages: result, duplicates }, null, 1));
```

### `startup-h.mjs`

```js
// Probe (gói H): exe start, end to end, with the load data (H\exe\Project2C-data\project2c.db, 13 MB).
// run-startup.ps1 starts the exe with WebView2's debug port 9340, then runs this. It reads:
//  1. the first load as it happened (navigation timing, resource timing incl. the db_open IPC call,
//     LCP = the first screen painted), relative to the page's time origin;
//  2. `reloads` reloads per route with an init script that stamps the first screen (MutationObserver)
//     and a CDP CPU profile, aggregated by script (index / chart / wasm / GC / other).
// Usage: node startup-h.mjs <outFile> [reloads=5]
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';

const require = createRequire('C:/workspace/Project-2C-review/package.json');
const { chromium } = require('@playwright/test');
const [, , outFile = 'startup.result.json', reloadsArg = '5'] = process.argv;
const reloads = Number(reloadsArg);

let browser;
for (let i = 0; i < 300 && !browser; i++) {
  try {
    browser = await chromium.connectOverCDP('http://127.0.0.1:9340');
  } catch {
    await new Promise((r) => setTimeout(r, 100));
  }
}
const context = browser.contexts()[0];
const page = context.pages()[0];

const SCREEN = () => {
  const main = document.querySelector('main');
  return !!main && !!main.querySelector('table, section, [role=img], [role=grid], ol, ul, h2');
};

await page.waitForFunction(SCREEN, null, { timeout: 60000, polling: 20 });
await page.waitForTimeout(1500);
const first = await page.evaluate(async () => {
  const lcp = await new Promise((resolve) => {
    const out = [];
    new PerformanceObserver((list) => out.push(...list.getEntries())).observe({
      type: 'largest-contentful-paint',
      buffered: true,
    });
    setTimeout(() => resolve(out.map((e) => ({ t: Math.round(e.startTime), size: e.size, el: e.element?.tagName }))), 200);
  });
  const longtasks = await new Promise((resolve) => {
    const out = [];
    try {
      new PerformanceObserver((list) => out.push(...list.getEntries())).observe({ type: 'longtask', buffered: true });
    } catch {}
    setTimeout(() => resolve(out.map((e) => [Math.round(e.startTime), Math.round(e.duration)])), 200);
  });
  const nav = performance.getEntriesByType('navigation')[0];
  const res = performance
    .getEntriesByType('resource')
    .map((e) => ({
      name: e.name.replace(/^.*\/\/(ipc\.localhost|tauri\.localhost)\//, '$1/').slice(0, 80),
      start: Math.round(e.startTime),
      end: Math.round(e.responseEnd),
      dur: Math.round(e.duration),
      bytes: e.transferSize || e.encodedBodySize || 0,
    }));
  return {
    hash: location.hash,
    nav: { dcl: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd) },
    paint: performance.getEntriesByType('paint').map((e) => [e.name, Math.round(e.startTime)]),
    lcp,
    longtasks,
    resources: res,
    heapMB: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1e6) : null,
  };
});

// Reloads: init script stamps when the first screen appears.
await context.addInitScript(() => {
  const isScreen = () => {
    const main = document.querySelector('main');
    return !!main && !!main.querySelector('table, section, [role=img], [role=grid], ol, ul, h2');
  };
  const obs = new MutationObserver(() => {
    if (window.__firstScreen === undefined && isScreen()) {
      window.__firstScreen = performance.now();
      obs.disconnect();
    }
  });
  document.addEventListener('DOMContentLoaded', () =>
    obs.observe(document.body, { childList: true, subtree: true }),
  );
});

const cdp = await context.newCDPSession(page);
await cdp.send('Profiler.enable');
await cdp.send('Profiler.setSamplingInterval', { interval: 200 });

const classify = (url, fn) => {
  if (fn === '(garbage collector)') return 'gc';
  if (fn === '(program)' || fn === '(idle)' || fn === '(root)') return fn.slice(1, -1);
  if (/wasm/.test(url) || url.startsWith('wasm://')) return 'wasm';
  if (/\/chart-/.test(url)) return 'chart-chunk';
  if (/\/index-/.test(url)) return 'index-chunk';
  if (/exceljs/.test(url)) return 'exceljs';
  if (url === '') return 'native/other';
  return 'other-js';
};

const routes = ['#/appointments', '#/overview', '#/customers', '#/reports', '#/team', '#/settings'];
const perRoute = {};
for (const route of routes) {
  perRoute[route] = [];
  await page.evaluate((h) => (location.hash = h), route);
  await page.waitForTimeout(800);
  for (let i = 0; i < reloads; i++) {
    await cdp.send('Profiler.start');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.__firstScreen !== undefined, null, { timeout: 60000, polling: 20 });
    const stamp = await page.evaluate(() => {
      const ipc = performance
        .getEntriesByType('resource')
        .filter((e) => /ipc\.localhost\/db_open/.test(e.name))
        .map((e) => [Math.round(e.startTime), Math.round(e.responseEnd)]);
      const wasm = performance
        .getEntriesByType('resource')
        .filter((e) => /\.wasm/.test(e.name))
        .map((e) => [Math.round(e.startTime), Math.round(e.responseEnd)]);
      const nav = performance.getEntriesByType('navigation')[0];
      return {
        firstScreen: Math.round(window.__firstScreen),
        dcl: Math.round(nav.domContentLoadedEventEnd),
        dbOpenIpc: ipc[0] ?? null,
        wasm: wasm[0] ?? null,
      };
    });
    const { profile } = await cdp.send('Profiler.stop');
    // self time per node, cut at the first screen (time origin of the profile ~ reload start)
    const byId = new Map(profile.nodes.map((n) => [n.id, n]));
    const self = {};
    const dts = profile.timeDeltas;
    let t = profile.startTime;
    const cutoff = profile.startTime + 1e3 * (stamp.firstScreen + 50); // µs, generous: reload start ≈ origin
    for (let k = 0; k < profile.samples.length; k++) {
      t += dts[k];
      if (t > cutoff) break;
      const node = byId.get(profile.samples[k]);
      const key = classify(node.callFrame.url, node.callFrame.functionName);
      self[key] = (self[key] ?? 0) + (dts[k + 1] ?? 0) / 1000;
    }
    for (const k of Object.keys(self)) self[k] = Math.round(self[k]);
    perRoute[route].push({ ...stamp, cpuMs: self });
  }
}
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};
const summary = Object.fromEntries(
  Object.entries(perRoute).map(([r, runs]) => [
    r,
    {
      firstScreenMedian: median(runs.map((x) => x.firstScreen)),
      firstScreen: runs.map((x) => x.firstScreen),
      dbOpenIpcMedian: median(runs.map((x) => (x.dbOpenIpc ? x.dbOpenIpc[1] - x.dbOpenIpc[0] : -1))),
      dbOpenEndMedian: median(runs.map((x) => (x.dbOpenIpc ? x.dbOpenIpc[1] : -1))),
      cpuMedian: Object.fromEntries(
        [...new Set(runs.flatMap((x) => Object.keys(x.cpuMs)))].map((k) => [k, median(runs.map((x) => x.cpuMs[k] ?? 0))]),
      ),
    },
  ]),
);
writeFileSync(outFile, JSON.stringify({ first, summary, perRoute }, null, 1));
console.log(JSON.stringify({ first: { ...first, resources: first.resources.length }, summary }, null, 1));
await browser.close().catch(() => {});
process.exit(0);
```

### `run-startup.ps1`

```powershell
# Starts H\exe\project2c.exe with WebView2's debug port 9340, runs startup-h.mjs, then stops the exe.
# Usage: .\run-startup.ps1 <outFile> [reloads]
param([string]$Out = 'startup.result.json', [int]$Reloads = 5)
$ErrorActionPreference = 'Stop'
$here = 'C:\workspace\deep-review-1-4\claude\H'
Get-Process project2c -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "$here*" } | Stop-Process -Force
Start-Sleep -Milliseconds 500
$env:WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS = '--remote-debugging-port=9340'
$started = Get-Date
$p = Start-Process -FilePath "$here\exe\project2c.exe" -WorkingDirectory "$here\exe" -PassThru
Remove-Item Env:\WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS
node "$here\startup-h.mjs" "$here\$Out" $Reloads
$code = $LASTEXITCODE
Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
"spawned at $($started.ToString('HH:mm:ss.fff')), node exit $code"
if ($code -ne 0) { throw "startup-h.mjs failed ($code)" }
```

### `build-report.mjs`

```js
// Builds ..\H.md from H.body.md plus the probe results (appendix A) and probe sources (appendix B).
// Run from H\: node build-report.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const read = (f) => readFileSync(f, 'utf8').trimEnd();
const block = (lang, text) => '```' + lang + '\n' + text + '\n```\n';

let out = read('H.body.md') + '\n\n';

const results = [
  ['importclock.result.json', 'CL-H1'],
  ['chart-canvas-bytes.result.json', 'CL-H2'],
  ['collator-diff.result.json', 'CL-H3'],
  ['tokens-usage.result.json', 'đã xét B'],
  ['bundle-dup-versions.result.json', 'đã xét P / B'],
  ['makedb.result.json', 'dữ liệu exe'],
];
for (const [file, why] of results) {
  out += `### \`${file}\` (${why})\n\n` + block('json', read(file)) + '\n';
}

// Startup: first load in full, reload summary only (per-run arrays are in the file).
const startup = JSON.parse(read('startup-1.result.json'));
out += '### `startup-1.result.json` (đã xét P — lần mở đầu + tóm tắt tải lại; từng lượt ở file)\n\n';
out += block('json', JSON.stringify({ first: startup.first, summary: startup.summary }, null, 1)) + '\n';

const composition = JSON.parse(read('bundle-composition.result.json'));
out += '### `bundle-composition.result.json` (đã xét P — cấu thành chunk, 30 nhóm đầu)\n\n';
out += block(
  'text',
  Object.entries(composition)
    .filter(([name]) => !name.startsWith('exceljs'))
    .map(([name, v]) => `== ${name} (${v.total} bytes)\n${v.top.join('\n')}`)
    .join('\n'),
) + '\n';

const strip = (text) =>
  text
    .split('\n')
    .filter((l) => /error (?!not-to-unresolvable)|violations/.test(l))
    .join('\n');
out += '### `dc-mutation.log` (đã xét T — vi phạm cài thử, đã bỏ các dòng `not-to-unresolvable` do bản sao không có `node_modules`)\n\n';
out += block('text', strip(read('dc-mutation.log'))) + '\n';
out += '### `depcruise-extra.log` (đã xét B / T — luật chặt hơn trên repo thật)\n\n';
out += block('text', read('depcruise-extra.log')) + '\n';
out += '### `cov-outside.log` (đã xét T — file ngoài `coverage.include`; lỗi ngưỡng ở cuối là do chạy riêng một phần)\n\n';
out += block('text', read('cov-outside.log').split('\n').slice(-25).join('\n')) + '\n';

out += '## Phụ lục B — Nguồn test tạm / probe\n\n';
out +=
  'Vi phạm cài thử cho `dc-copy\\` (mỗi dòng một file mới trong bản sao `packages/*/src`, `apps/desktop/src`; chạy luật của repo bằng `depcruise apps packages --config .dependency-cruiser.cjs` trong `dc-copy`):\n\n' +
  block(
    'text',
    [
      "packages/db/src/zz-db-to-ui.ts:          import '../../ui/src/index.ts'",
      "packages/ui/src/zz-ui-to-db.ts:          import '../../db/src/index.ts'",
      "packages/domain/src/zz-domain-to-db.ts:  import '../../db/src/index.ts'",
      "packages/ui/src/zz-ui-to-app.ts:         import '../../../apps/desktop/src/i18n/index.ts'",
      "packages/domain/src/zz-domain-to-npm.ts: import 'react'",
      "packages/db/src/zz-db-deep-domain.ts:    import '../../domain/src/period.ts'",
      "apps/desktop/src/data/zz-app-deep-db.ts: import '../../../../packages/db/src/schema.ts'",
      "packages/db/src/zz-cycle-a.ts / zz-cycle-b.ts: import lẫn nhau",
      "packages/domain/src/zz-domain.test.ts:   import '../../db/src/index.ts'",
    ].join('\n'),
  ) +
  '\n';
const sources = [
  ['vitest.probe.config.mts', 'ts'],
  ['probe-makedb.test.ts', 'ts'],
  ['probe-importclock.test.ts', 'ts'],
  ['depcruise-extra.cjs', 'js'],
  ['tokens-usage.mjs', 'js'],
  ['bundle-composition.mjs', 'js'],
  ['chart-canvas-bytes.mjs', 'js'],
  ['bundle-dup-versions.mjs', 'js'],
  ['startup-h.mjs', 'js'],
  ['run-startup.ps1', 'powershell'],
  ['build-report.mjs', 'js'],
];
for (const [file, lang] of sources) {
  if (!existsSync(file)) continue;
  out += `### \`${file}\`\n\n` + block(lang, read(file)) + '\n';
}
out +=
  '### Lệnh một dòng đã chạy (không có file nguồn)\n\n' +
  block(
    'text',
    [
      '# build có sourcemap ra thư mục H (PowerShell, apps/desktop):',
      'pnpm exec vite build --sourcemap --outDir C:\\workspace\\deep-review-1-4\\claude\\H\\dist-map --emptyOutDir',
      '# collator-diff (node -e, đọc load-backup.json): sắp tên KH / người / team bằng Intl.Collator("vi") và Intl.Collator("vi",{sensitivity:"base",numeric:true}), đếm vị trí lệch',
      '# độ phủ file ngoài coverage.include (PowerShell, gốc repo):',
      'pnpm exec vitest run apps/desktop/src/i18n apps/desktop/src/routes/appointments/appointment-form apps/desktop/src/routes/appointments/outcome-form apps/desktop/src/routes/customers/policy-form packages/ui --coverage --coverage.include=... --coverage.reportsDirectory=H\\cov-out --coverage.reporter=text',
      '# e2e unused: pnpm exec tsc -p e2e --noEmit --noUnusedLocals --noUnusedParameters  → exit 0',
      '# mã lỗi: với mỗi mã của DB_ERROR_CODES, grep "\'<CODE>\'" trong packages/db/src (bỏ errors.ts, *.test.ts), packages/domain/src, apps/desktop/src',
    ].join('\n'),
  );

writeFileSync('../H.md', out);
console.log(`H.md: ${out.length} chars`);
```

### Lệnh một dòng đã chạy (không có file nguồn)

```text
# build có sourcemap ra thư mục H (PowerShell, apps/desktop):
pnpm exec vite build --sourcemap --outDir C:\workspace\deep-review-1-4\claude\H\dist-map --emptyOutDir
# collator-diff (node -e, đọc load-backup.json): sắp tên KH / người / team bằng Intl.Collator("vi") và Intl.Collator("vi",{sensitivity:"base",numeric:true}), đếm vị trí lệch
# độ phủ file ngoài coverage.include (PowerShell, gốc repo):
pnpm exec vitest run apps/desktop/src/i18n apps/desktop/src/routes/appointments/appointment-form apps/desktop/src/routes/appointments/outcome-form apps/desktop/src/routes/customers/policy-form packages/ui --coverage --coverage.include=... --coverage.reportsDirectory=H\cov-out --coverage.reporter=text
# e2e unused: pnpm exec tsc -p e2e --noEmit --noUnusedLocals --noUnusedParameters  → exit 0
# mã lỗi: với mỗi mã của DB_ERROR_CODES, grep "'<CODE>'" trong packages/db/src (bỏ errors.ts, *.test.ts), packages/domain/src, apps/desktop/src
```
