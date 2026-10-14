XONG — claude gói F, 2026-10-14 19:41

# Deep review Phase 1–6, lượt 1 — Claude, gói F (Xuyên gói, bloat / hiệu năng, công cụ)

## 1. Đầu phiên

- Bên: Claude (Opus 5.5), phiên sạch, chỉ đọc.
- Gói: F — `tools/**`, `e2e/**`, `.github/**`, `.githooks/**`, `.claude/**`, `packages/ui/scripts/`, `apps/desktop/vite.config.ts`, file gốc repo; luồng xuyên gói; toàn codebase cho bloat và hiệu năng.
- Worktree: `C:\workspace\Project-2C-review`, `git rev-parse HEAD` = `885534549808f42aec7f9af5743bbf86642ee4bd` (khớp SHA ghim `8855345`).
- `git status --short` đầu phiên: rỗng.
- Giờ bắt đầu: 2026-10-14 19:15 (Office Laptop `D13_THINKPAD`).
- Bước 0: `claude\F.md` chưa có → làm mới; `claude\A.md` … `E.md` đều có, dòng đầu `XONG`.

## 2. Phạm vi đã đọc

- **Tài liệu:** `CLAUDE.md` gốc, `apps/desktop/CLAUDE.md`, `packages/db/CLAUDE.md`, `.claude/rules/{ci,tests,i18n-ui}.md`, `docs/metrics/phase-6.md` (cả file: số đo nền, ngưỡng, bảng hàm thuần Phase 4), `docs/metrics/README.md` (mục `retro.mjs`), `e2e/perf/README.md`; `common\plan.md` (cả file), `known.md`, `baseline.md`, `perf\perf-ref.json` (qua bảng trong `baseline.md`); báo cáo của chính tôi `claude\A.md` … `E.md` (§1–§6 và bảng đột biến) để không báo lại và để tổng hợp số.
- **Đọc hết (từng dòng) ở `8855345`:** file gốc `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `vitest.config.ts`, `eslint.config.js`, `.dependency-cruiser.cjs`, `playwright{,.perf,.guide}.config.ts`, `.gitignore`, `.gitattributes`, `.prettierignore`, `.nvmrc`, `rust-toolchain.toml`; `apps/desktop/vite.config.ts`; `.github/workflows/ci.yml`, `.github/pull_request_template.md`; `.githooks/pre-push`; `.claude/settings.json`, `.claude/hooks/{handoff-context,review-pr-hint}.mjs`, `.claude/launch.json`; `packages/ui/scripts/check-tokens.ts`; `tools/` — `pr-core.mjs` (294), `merge-pr.mjs` (158), `pr-status.mjs` (136), `session-core.mjs` (120), `session-io.mjs`, `handoff.mjs` (160), `status.mjs` (77), `review-hint-core.mjs`, `codemap-core.mjs` (200), `codemap.mjs` (95), `size-report-core.mjs` (358), `size-report.mjs`, `load-data.mjs`, `load-data-core.mjs` (103), `eval-ai.mjs`, `retro.mjs`, `session-start.ps1`, `session-end.ps1`; `e2e/` — `serve.mjs`, `anchor.ts`, `seeded-snapshot.ts`, `seed-timing.spec.ts`, `full-cycle.spec.ts` (360), `support.ts` (1–120), `perf/stats.ts` (212).
- **Đọc một phần:** `tools/eval-ai-core.mjs` (1–330: cấu hình, gọi HTTP, che key; không chạy), `tools/retro-core.mjs` (1–60, 185–200), `tools/bootstrap.ps1` (mọi lệnh native + kiểm `$LASTEXITCODE`), test của `tools/` (tên ca, ca ngưỡng), `e2e/*.spec.ts` (quét mẫu yếu: `waitForTimeout`, `skip` / `only`, kiểm có điều kiện, `toBeDefined`, `catch` nuốt lỗi — đọc từng chỗ trúng: `demo-data.spec.ts:30-71`, `customer-ai-web.spec.ts:310-341`, `settings-ai.spec.ts:285-337`, `customer-ai.spec.ts:660-700`).
- **Chỗ gói khác mà F nối vào (luồng xuyên gói):** `apps/desktop/src/data/app-data.ts` (cả file), `AppDataContext.tsx`, `tables.ts`, `packages/db/src/trash.ts` (1–212), `backup.ts` (giới hạn cỡ), `database.ts` (khởi tạo sql.js), `kyc.ts` (`confirmKycFact`), `apps/desktop/src/routes/customers/ai-panel-view.ts` (chữ ký `aiPanelView`), `routes/SettingsBackup.tsx:180-195`; `grep` toàn repo cho xử lý ngày giờ (`toISOString`, `getUTC*`, `new Date(`), định dạng rải rác (`toLocaleString`, `Intl.`, `toFixed`, `padStart`), bỏ dấu (`normalize('NFD')`), giới hạn cỡ (`MAX_*`).

## 3. Phát hiện (đánh số theo thứ tự tìm ra)

Mục đã nêu ở gói A–E chỉ dẫn ID ở §6 / kết luận, không báo lại.

### CL-F1

```
ID: CL-F1
Mức: Low
Trục: C (công cụ đọc sai nguồn), T
Vị trí: tools/retro.mjs:36 (`join(homedir(), '.claude', 'projects')`), :6 (doc comment) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** `tools/retro.mjs` (nguồn của mục "Điều hướng" trong `docs/metrics/phase-<N>.md`, `docs/metrics/README.md:11-14`) chỉ đọc transcript ở `~/.claude/projects`, trong khi Claude Code ghi transcript vào thư mục cấu hình đang dùng (`CLAUDE_CONFIG_DIR`). Trên Office Laptop, `CLAUDE_CONFIG_DIR = C:\Users\<user>\.claude-b`, nên các phiên của repo nằm ở **hai** chỗ và lệnh bỏ sót hẳn một phần mà không báo gì (vẫn in bảng "30 phiên gần nhất").
- **Tái hiện / bằng chứng:** PowerShell, chỉ đọc siêu dữ liệu (không đọc nội dung transcript):
  ```
  CLAUDE_CONFIG_DIR=C:\Users\<user>\.claude-b
  C:\Users\<user>\.claude\projects   : 170 transcripts, newest 10/14/2026 17:07:51
  C:\Users\<user>\.claude-b\projects : 52 transcripts, newest 10/14/2026 19:21:57
  ```
  (đếm file `*.jsonl` trong các thư mục `C--workspace-Project-2C*`). Phiên này và các phiên review A–E hôm nay nằm ở `.claude-b`, `retro.mjs` không thấy.
- **Ảnh hưởng:** số "Điều hướng" của chỉ số cuối Phase 6 (G7) đo trên Office Laptop sẽ thiếu / lệch thời gian mà không ai biết. Không đụng sản phẩm.
- **Đề xuất:** gốc = `process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.claude')` (hoặc đọc mọi `~/.claude*/projects` như kế hoạch 6D §8 đã làm), in thư mục đã đọc ở đầu báo cáo. ≈ 3 dòng, không cần test mới (phần I/O).

### CL-F2

```
ID: CL-F2
Mức: Low
Trục: S (script trong tools/ — cổng merge), C
Vị trí: tools/pr-core.mjs:66-69 (ciStartedAt), :132-143 (luật DR-80 "main got code after CI started"); tools/pr-status.mjs:43-53 (loadMainSince lọc theo cùng mốc) (8855345)
Tình trạng: PLAUSIBLE (hành vi của hàm CONFIRMED bằng probe; ngữ nghĩa "chạy lại dùng SHA của sự kiện gốc" lấy từ tài liệu GitHub Actions, chưa thử trên GitHub vì không gọi `gh` trong phiên review)
```

- **Mô tả:** Luật DR-80 coi code vào `main` **trước** `startedAt` sớm nhất của các check là đã được CI thử cùng PR. Nhưng khi chạy lại job (nút "Re-run jobs" / `gh run rerun`, thường gặp khi e2e chập chờn), GitHub chạy lại trên **đúng `GITHUB_SHA` của sự kiện gốc** (commit gộp PR với `main` lúc PR được push), còn `startedAt` của check là giờ chạy lại. Code vào `main` giữa lúc push PR và lúc chạy lại vì thế được tính là "đã thử" dù CI chưa từng chạy với nó; push lên `main` sau merge lại bỏ Verify (`ci.yml:55`), nên lỗi ghép chỉ lộ ở PR code kế tiếp.
- **Tái hiện / bằng chứng:** `node F\f2-merge-rules.mjs` (nguồn §7, log `F\logs\f2-merge-rules.log`), PR push 10:00, `main` nhận code 10:05:
  ```
  (a) first run, main got code after it started → [ 'main got code after CI started on head aaaaaaa (bbbbbbb): gh pr update-branch 9, …' ]
  (a) re-run of the same event (same tested SHA) → []
  ```
- **Ảnh hưởng:** chỉ khi có hai PR code merge gần nhau (hai máy / hai phiên) **và** PR sau được chạy lại CI thay vì push / đóng-mở lại. `main` có thể nhận một tổ hợp chưa từng qua `pnpm verify` / e2e. Quy trình hiện ghi cách chạy lại bằng `gh pr close` + `gh pr reopen` (sự kiện mới, SHA mới) nên ít gặp.
- **Đề xuất:** job Verify ghi SHA của `main` mà nó đã gộp (`git rev-parse HEAD^1` của commit gộp) vào output / tóm tắt; `merge-pr` so SHA đó với `main` hiện tại thay cho so giờ. Hoặc tối thiểu: ghi vào `CLAUDE.md` "không dùng Re-run cho PR code, đóng / mở lại". ≈ 20 dòng (ci.yml + `pr-status.mjs` + test `pr-core.test.mjs`).

### CL-F3

```
ID: CL-F3
Mức: Low
Trục: S (cổng merge), E
Vị trí: tools/pr-status.mjs:24-37 (FIELDS của `gh pr view --json …,files`), tools/pr-core.mjs:36-41 (isDocsOnly), :112-113, :125-164 (mọi luật CI / build-exe nằm trong `if (!isDocsOnly(paths))`) (8855345)
Tình trạng: PLAUSIBLE (hàm CONFIRMED bằng probe; giới hạn 100 file của gh: chuỗi truy vấn `files(first: 100) {` có trong `gh.exe` 2.99.0 của máy, chưa gọi gh thật)
```

- **Mô tả:** `gh pr view --json files` chỉ trả **100 file đầu** của PR (truy vấn GraphQL `files(first: 100)`, không phân trang). `merge-pr` / `pr-status` lấy danh sách này làm toàn bộ file: PR có > 100 file mà 100 file đầu (theo thứ tự đường dẫn) đều là `docs/**` hay `*.md` bị coi là **docs-only** → bỏ qua luật "CI xanh", "main nhận code sau khi CI chạy" và "file cần nhãn `build-exe`".
- **Tái hiện / bằng chứng:** `F\f2-merge-rules.mjs` (log như trên), PR 102 file = 100 ảnh `docs/user-guide/img/*.png` + `packages/db/src/backup.ts` + `apps/desktop/src-tauri/src/storage.rs`, **không có check CI nào**:
  ```
  (b) isDocsOnly(all files) = false | isDocsOnly(first 100, as gh lists) = true
  (b) blockers with no CI check at all, first 100 files → []
  (b) same, all files → [ 'Code PR with no CI check on head aaaaaaa.', 'apps/desktop/src-tauri/src/storage.rs need the build-exe label: …' ]
  ```
  `grep -ao "files(first: *[0-9]*)" "/c/Program Files/GitHub CLI/gh"` → `files(first: 100) {`.
- **Ảnh hưởng:** hiếm (task ≤ 400 dòng SP; PR > 100 file chủ yếu là ảnh hướng dẫn / báo cáo gốc, vốn docs-only). Khi gặp, `merge-pr` cho merge một PR code chưa qua CI / thiếu build exe; vẫn còn REVIEW phiên sạch chặn.
- **Đề xuất:** lấy danh sách file bằng REST có phân trang (`gh api --paginate repos/{owner}/{repo}/pulls/<N>/files --jq '.[].filename'`), hoặc chặn hẳn khi `files.length === 100` ("quá 100 file: kiểm tay"). ≈ 10 dòng + 1 ca test.

### CL-F4

```
ID: CL-F4
Mức: Nit
Trục: T (test phụ thuộc múi giờ máy)
Vị trí: apps/desktop/src/data/tables.test.ts:14 (`now: () => new Date(Date.UTC(2026, 9, 7, 5))` + `createCustomer(… date: TODAY 07/10)` :18); liên quan KNOWN packages/db/src/test-support.ts:10 (8855345)
Tình trạng: KNOWN (cùng loại ghi chú review #539 về `test-support.ts:10`) — bằng chứng mới: một file test thứ hai có đồng hồ riêng, hẹp hơn khoảng múi giờ mà comment DR-15 hứa
```

- **Mô tả:** Chạy toàn bộ unit test (`pnpm exec vitest run`, 110 file / 2 755 test) với `TZ` khác: UTC xanh; `America/Los_Angeles` đỏ 2 test (`tables.test.ts`: 05:00 UTC 07/10 là 06/10 ở UTC−7, nên `createCustomer` ngày 07/10 bị `DATE_IN_FUTURE`); `Pacific/Kiritimati` (UTC+14) đỏ 22 test ở 8 file của `packages/db` (đồng hồ 11:00 UTC của `setup()` là ngày hôm sau — ngoài khoảng −11…+12 mà comment DR-15 ghi, đúng như comment). Mọi ca đỏ đều do đồng hồ của test, không thấy lỗi sản phẩm.
- **Tái hiện / bằng chứng:** `F\tz-run.ps1` (log `F\logs\tz-*.log`, `tz-summary.log`): `TZ=UTC exit=0`, `TZ=America/Los_Angeles exit=1` ("Tests 2 failed | 2753 passed", `DbError: DATE_IN_FUTURE … tables.test.ts:18:7`), `TZ=Pacific/Kiritimati exit=1` ("Tests 22 failed | 2733 passed").
- **Ảnh hưởng:** chỉ người chạy test trên máy đặt múi giờ từ UTC−6 về tây (CI Windows chạy UTC, hai máy UTC+7: không gặp).
- **Đề xuất:** `tables.test.ts` dùng `setup()` / đồng hồ 11:00 UTC như các test khác (1 dòng); gộp với việc sửa comment DR-15 của ghi chú #539.

### CL-F5

```
ID: CL-F5
Mức: Nit
Trục: B (code lặp ≥ 3 nơi, xuyên gói)
Vị trí: packages/ai/src/text-match.ts:28 (`fold`); apps/desktop/src/routes/appointments/appointment-form.ts:112 (`plain`), apps/desktop/src/routes/trash-view.ts:49 (`plain`), apps/desktop/src/routes/reports/report-workbook.ts:224-233 (`slug`, biến thể) (8855345)
Tình trạng: KNOWN (sổ review #543 "Có thể là Duplicated Code: `plain`… → một hàm chung khi chạm lần sau") — bằng chứng mới: bản thứ tư nằm ở gói khác (`packages/ai`)
```

- **Mô tả:** Cùng một phép "bỏ dấu tiếng Việt" (`normalize('NFD')` → bỏ `\p{M}` → `đ` → `d`) viết 4 lần ở 2 package: hai `plain` (ô tìm Lịch hẹn, Thùng rác), `slug` (tên file Excel) và `fold` của V3–V6 (G5 §7 mục 3). Sổ chỉ ghi ba chỗ trong app; chỗ của `ai` làm hàm chung không thể đặt trong app (ranh giới `ai → domain + zod`), nên chỗ chung đúng là `@p2c/domain` (cả hai bên đã import được).
- **Tái hiện / bằng chứng:** `grep -rnE "normalize\('NFD'\)" apps/desktop/src packages --include=*.ts` (bỏ test) → đúng 4 dòng trên.
- **Ảnh hưởng:** không ai gặp hôm nay (bốn bản cho cùng kết quả trên chữ thường); đổi luật bỏ dấu (vd. thêm `Đ` hoa, ký tự Latin mở rộng) phải nhớ sửa 4 chỗ, trong đó một chỗ là guardrail G5.
- **Đề xuất:** `foldVietnamese` trong `packages/domain` (≈ 5 dòng + test), 4 nơi gọi lại; giữ hành vi bằng `text-match.test.ts`, `validator-blocklists.test.ts` (C01–C30), `appointment-form.test.ts`, `trash-view.test.ts`, `report-workbook.test.ts`. Gộp vào lần chạm sau như sổ đã ghi.

## 4a. Bloat — toàn codebase

| Đã chạy / đo | Trên gì | Kết quả | ID |
|---|---|---|---|
| `tsc --noUnusedLocals --noUnusedParameters` | toàn repo | Hai cờ bật sẵn ở `tsconfig.base.json:12-13`, mọi package + `e2e` `extends` nó, `pnpm typecheck` xanh ở SHA ghim (`common\baseline.md`) → 0 biến / tham số thừa ở code TS. `tools/*.mjs` là JS, không qua `tsc`; ESLint (`js.configs.recommended`, có `no-unused-vars`) chạy trên chúng trong `pnpm lint` | — |
| Module mồ côi: `pnpm exec depcruise apps packages --output-type json` (cấu hình của repo) → `F\f6-orphans.mjs` | 290 module của `apps/` + `packages/` | Không module sản phẩm nào thiếu nơi import; chỉ còn file cấu hình / script (`vite.config.ts`, `drizzle.config.ts`, `check-tokens.ts`) và `migrations/meta/_journal.json` (test so journal) — đúng vai trò (`F\logs\f6-orphans.log`) | — |
| Export không ai dùng — phần của F: `F\f7-exports.mjs` | 109 export của `tools/*.mjs`, helper `e2e/`, `.claude/hooks`, `packages/ui/scripts` | 62 không có nơi dùng ngoài file trong code không phải test: tất cả là seam test của `*-core.mjs` (đúng quy ước `.claude/rules/tests.md`), hằng / kiểu dùng trong chính file, hoặc helper e2e (chỉ spec dùng — đúng vai trò); `DEMO_ANCHOR` dùng ở `playwright*.config.ts`. Không có hàm chết (`F\logs\f7-exports.log`). Phần `domain` / `db` / `ai` / app: gói A–E đã quét (CL-A3 là hàm chết duy nhất có chi phí đọc) | — |
| Thành phần bundle: `vite build --sourcemap --outDir F\web` (cùng hash `index-DvfluxND.js` với baseline) → `F\f5-bundle.mjs` gán từng byte sinh ra cho nguồn theo source map (không cần visualizer — G4) | `index.js` 878 329 ký tự, `chart.js` 512 723, `exceljs.min.js` 929 032 | **`index.js` (nạp lúc mở):** `react-dom` 23,6 % · màn `routes/` 21,6 % · **`zod` 10,1 % (89 067)** · `db` 7,7 % · `drizzle-orm` 7,2 % · `i18n` 6,6 % (`vi.ts` 57 276) · `sql.js` glue 4,5 % · `@tanstack/table-core` 3,4 % · `ai` 2,6 % · `domain` 2,5 % · `@tauri-apps/api` 1,7 % · `ui` 1,6 %. Không có test / golden / fixture lọt vào bundle (chỉ `seed.ts`, `seed-data.ts`, `mock-adapter.ts` — là code sản phẩm: Nạp lại, provider Mock). `chart.js` = `echarts` 64,7 % + `zrender` 35,2 % (đã tách, ngân sách gzip e2e). `exceljs` nạp lười (gói E) | xem dòng dưới |
| ↳ `zod` 4 bản "classic" (`import { z } from 'zod'` ở 3 file) | `index.js` | 89 067 ký tự, trong đó phần sinh JSON Schema (`to-json-schema.js` 8 663 + `json-schema-processors.js` 8 866) app không dùng (`grep toJSONSchema` = 0) — zod classic không tree-shake được. Chi phí: parse / biên dịch lúc mở, nằm trong `app.open-data` 273 ms (≤ 600 ✅), không đo tách được → không thành phát hiện; nếu muốn nhỏ hơn: `zod/mini` (đổi cú pháp `schema.ts` của `ai` + `backup` của `db`, ≈ 300 dòng, test giữ hành vi: `schema.test.ts`, `backup*.test.ts`) — không đề xuất cho v1.0 | — |
| Font | `packages/ui/src/fonts.css` (12 file woff2, 4 độ đậm × 3 bảng chữ) | 4 độ đậm đều được dùng (`font-normal` 10, `font-medium` 38, `font-semibold` 48, `font-bold` 8 chỗ); trình duyệt chỉ tải bảng chữ cần → không thừa | — |
| Dependency | `package.json` gốc + 5 package ↔ import thật | Mọi dependency đều có nơi import (`@tauri-apps/api` 3 file, `sql.js` 6, `exceljs` 2, `zod` 4, `drizzle-orm` 13, `@tanstack/react-table` 1, `echarts` 1…); devDependency gốc đều dùng trong script / cấu hình. Không thấy dependency thừa | — |

Đề xuất refactor bloat của gói F: chỉ CL-F5 (gộp bỏ dấu vào `domain`). Đề xuất của các gói khác vẫn giữ nguyên ở báo cáo của gói đó (CL-A3 −45 dòng, CL-A5, CL-B5 1 dòng, CL-E6 −30 dòng). Công cụ nên có (G4, chỉ đề xuất): một phân tích bundle (vd. visualizer) để khỏi phải tự giải mã source map như `F\f5-bundle.mjs`.

## 4b. Hiệu năng

### Bảng hàm thuần trong Node (đo lại theo `plan.md` §6, `phase-6.md` "Bảng hàm thuần … Gói F quyết định có đo lại")

Máy Office Laptop `D13_THINKPAD` (20 luồng, 31,7 GB), Node v24.20.0, 19:25 ngày 14/10; song song: có thể có phiên Codex ở `Project-2C-review-2` (không biết đang chạy gì), không có việc nặng nào của tôi chạy cùng. Dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` qua `importBackup`, đồng hồ 14/10/2026. Nguồn `F\p3-node-table.mjs`, log `F\logs\p3-node-table.log`. Không so với số Phase 4 (probe cũ ngoài repo, khác máy — `plan.md` §6), chỉ so ngưỡng Nhóm C / ngưỡng Phase 4 ghi ở `phase-6.md` và giữa các hàm; số của gói A / D / E đo cùng máy hôm nay ở cột cuối để thấy độ lặp lại.

| Hàm | Lần | Trung vị (min–max) | Ngưỡng Phase 4 (`phase-6.md`) | Số cùng máy ở gói khác hôm nay |
|---|---:|---:|---|---|
| `importBackup` (parse + nạp + migrate + kiểm) | 5 | 891 ms (845–997) | ≤ 1,1 s ✅ | A 784 ms |
| `exportBackup` (JSON) | 5 | 199 ms (198–205) | — | A 190 ms |
| `db.export()` (byte lưu sau mỗi lệnh ghi) | 9 | 2,1 ms (1,7–5,5) | — | A 2,7 ms |
| `readTables` đủ 6 bảng (mỗi revision) | 15 | 79,1 ms (75,5–95,8) | — | D 73,1 ms |
| `listAppointments` | 9 | 53,3 ms (50,3–62,7) | ≤ 65 ms ✅ | A 50,9 ms |
| `countRecords` | 15 | 5,8 ms | ≤ 15 ms ✅ | A 5,4 ms |
| `teamCompare` tháng / năm | 15 | 2,1 / 3,2 ms | ≤ 15 ms ✅ | E 1,95 / 2,75 ms |
| `reportRows` tháng / năm, Toàn bộ | 15 | 7,5 / 9,0 ms | ≤ 15 ms ✅ | E 6,33 / 8,43 ms |
| `appointmentRows` Toàn bộ / `monthGrid` | 15 | 2,7 / 0,75 ms | `monthGrid` ≤ 2 ms ✅ | E 2,58 / 0,96 ms |
| `listTrash` (117 dòng) | 9 | 53,0 ms (48,2–62,0) | Nhóm C < 200 ✅ | A 50,6 ms, E 48,9 ms (CL-A2: tăng theo số KH đã xóa) |
| Phần AI của hồ sơ (đọc KYC + phiên bản + phân tích, `aiPanelView`, `historyRows`, `analysisContent`) | 15 | 0,40 ms | Nhóm C ✅ | C 0,32–0,40 ms |
| `countCustomerRecords` (hộp 5f, KH 38 lịch) | 15 | 2,6 ms | — | D 2,2 ms |
| **Một lệnh ghi như app chạy:** `app.run(renameTeam)` (transaction + `db.export()` cho hàng đợi lưu) | 15 | 3,2 ms | — | — |
| **Một lệnh ghi + đọc lại đủ 6 bảng** (màn vẽ lại sau lệnh ghi; chưa tính React) | 15 | 84,5 ms (80,0–89,5) | Nhóm C < 200 ✅ | — |
| 30 lệnh ghi liên tiếp → số lần lưu file thật | — | 9 lần × 13 455 360 B (hàng đợi gộp) | — | — |

**Bộ nhớ khi nhập backup lặp lại** (8 lần `readBackup` + `importBackup` của `openAppData`, storage giả, `--expose-gc`): `rss` 478–489 MB, `arrayBuffers` 51–75 MB, `heapUsed` 63,4–63,5 MB, không tăng theo số lần → không rò bộ nhớ WASM / JS qua các lần thay dữ liệu (DB cũ và DB đọc tạm đều được đóng). `readBackup` 828–886 ms, `importBackup` (thay DB) 3–9 ms mỗi lần.

### Tổng hợp số hiệu năng của Claude (A–F, cùng máy, 14/10)

| Lớp đo | Nguồn | Chậm nhất đo được | Ngưỡng | Kết luận |
|---|---|---|---|---|
| Exe release, probe T-218 (35 thao tác, dữ liệu tải) | `common\perf\perf-ref.json` (bước chuẩn bị, không đo lại: probe cần máy rảnh, có thể va phiên Codex) | thao tác màn: `trash.open` 91 ms; `reload.*` 207–349 ms; `backup.read` 886 ms; `backup.export` 484 ms; `db.save` 160 ms; `app.open-data` 273 ms; JS heap 16,4 MB | < 200 / < 500 / ≤ 2 000 / ≤ 1 000 / ≤ 400 / ≤ 600 ms; ≤ 21 MB | ✅ mọi dòng |
| Thao tác màn chưa có trong probe, bản web trên Edge headless (cùng engine WebView2) | D `p5-ui-perf`, E `p4-ui-perf`, C `c5c` | Thùng rác mở / khôi phục 86 ms; Team & nhân sự sau một lần ghi 84 ms; Phân tích Mock lần đầu 107 ms; mọi thao tác khác ≤ 39 ms | < 200 ms | ✅ |
| Hàm thuần trong Node (bảng trên) | F `p3-node-table` + A / D / E | `importBackup` 891 ms; `exportBackup` 199 ms; một lệnh ghi + đọc lại 6 bảng 84,5 ms; `readTables` 79 ms; `listTrash` 53 ms | ngưỡng Phase 4 / Nhóm C | ✅ |
| Tăng theo dữ liệu | A `p3c-scale` | `listTrash` 197 ms ở 75 KH đã xóa, 703 ms ở 300 | < 200 ms | **CL-A2** (Low: chưa vượt trên dữ liệu đã chốt) |
| Rò bộ nhớ qua nhiều lần thay dữ liệu | F `p3-node-table` phần C | 8 lần nhập: `rss` / `arrayBuffers` không tăng | — | ✅ |
| Build | B `p4-crate-type` | thêm ≈ 11,5 s / build release, 187 MB `target` | — | **CL-B5** (Low, chỉ máy dev / CI) |

Không có phát hiện P mới ở gói F: thao tác nặng nhất của người dùng (đọc file backup ≈ 0,9 s) dưới ngưỡng ≥ 2×; chi phí ẩn của mỗi lệnh ghi (đọc lại cả 6 bảng ≈ 80 ms + lưu 13 MB qua IPC ≈ 160 ms, chạy nền, hàng đợi gộp 30 lệnh còn 9 lần lưu) vẫn dưới ngưỡng thao tác màn. Điểm cần theo dõi khi dữ liệu thật lớn dần: `readTables` / `listAppointments` tuyến tính theo số lịch hẹn (10 252 lịch → 53 ms), `db.save` tuyến tính theo cỡ file.

## 5. Bảng đếm mức × trục

### Gói F

Trục chính của mỗi phát hiện (ngoặc = trục phụ, không đếm lần hai).

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | (CL-F3) | 1 (CL-F1), (CL-F2) | 0 | 0 | 2 (CL-F2, CL-F3) | 0 | 0 | (CL-F1) | 0 | 3 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 1 (CL-F5) | 1 (CL-F4) | 0 | 2 |
| **Tổng** | 0 | 1 | 0 | 0 | 2 | 0 | 1 | 1 | 0 | **5** |

Tình trạng: CL-F1 CONFIRMED; CL-F2, CL-F3 **PLAUSIBLE** (hành vi của hàm đã chạy probe; phần ngữ nghĩa của GitHub / `gh` — chạy lại dùng SHA cũ, `files(first: 100)` — không thử trên GitHub vì phiên review không gọi `gh`); CL-F4, CL-F5 KNOWN có bằng chứng mới. Tỉ lệ PLAUSIBLE 2 / 5 — cả hai đều là quy trình merge, không đụng sản phẩm.

### Toàn bộ 6 gói của Claude (để kết luận, không phải tổng hợp với bên khác)

| Mức | A | B | C | D | E | F | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 1 (CL-D7) | 1 (CL-E7) | 0 | 2 |
| Low | 3 | 4 | 4 | 4 | 3 | 3 | 21 |
| Nit | 3 | 2 | 2 | 2 | 3 | 2 | 14 |
| **Tổng** | 6 | 6 | 6 | 7 | 7 | 5 | **37** |

## 6. Đã xét, không thấy (theo trục)

- **E — Edge case:** unit test toàn repo dưới 3 múi giờ khác (`F\tz-run.ps1`): mọi ca đỏ đều do đồng hồ của test (CL-F4), không có lỗi sản phẩm; `grep` toàn repo: mốc thời gian lưu dạng ISO UTC (`toISOString`) chỉ dùng cho `createdAt` / `updatedAt` / `deletedAt` / `exportedAt` và hiển thị qua `formatLocalDateTime`, không chỗ nào cắt `slice(0, 10)` một mốc UTC thành ngày (lỗi kinh điển 00:00–07:00 ở UTC+7); ngày nghiệp vụ đi qua `period.ts` (`Date.UTC` thuần lịch). Nhập backup ở một "hôm nay" khác (`f8`, 01/12/2026): không lệch. Tham số dòng lệnh của `merge-pr` / `pr-status` / `load-data` / `size-report` / `handoff` (thiếu giá trị, cờ lạ, số không hợp lệ: đọc từng nhánh + đột biến T34). Ngoài CL-F2, CL-F3 (đầu vào lạ của `gh` / GitHub) không thấy.
- **C — Đúng hợp đồng:** `paths` của `ci.yml` ↔ `CODE_DOCS` (test có sẵn, T01 bị giết); test nào đọc tài liệu `.md`: chỉ `phase-5-prompts.md`, `ai-eval.md` (`grep` mọi `*.test.*` / `*.spec.ts`) — khớp `CODE_DOCS`; `EXE_PATHS` ↔ danh sách nhãn `build-exe` của `CLAUDE.md` (Rust, Cargo, toolchain, `package.json`, lockfile, `vite.config.*`, `tauri.conf.json`): khớp. Hợp đồng xuyên gói: `domain` ↔ `db` (ngày / tiền: không chỗ nào ngoài `domain` tự `toLocaleString` / `Intl` / `toFixed`; `padStart(2)` ngoài `domain` chỉ ở chuỗi hex của id và giờ `HH:MM` của ô Giờ), `db` ↔ `ai` (`@p2c/ai/schema` dùng chung khi nhập — gói A / C), app ↔ Rust (`tauri-contract.test.ts` — gói B; trần token / ký tự lệch nhau không bị test chặn: CL-C3), backup xuất ↔ nhập (`MAX_BACKUP_BYTES` 100 MB, dữ liệu tải 15,3 MB ở 1 496 KH → còn ≈ 6,5×; `f8`: khứ hồi không mất gì). Đổi RE / đổi team và chỉ số: đúng ADR-0007 G2 E, spec Phase 4 §2 mục 6, golden `chi-so.md` (đọc, không lệch). Thấy: CL-F1.
- **D — Dữ liệu:** kịch bản chuyển dữ liệu giữa hai máy (K12) — `node F\f8-roundtrip.mjs` (log `F\logs\f8-roundtrip.log`): dữ liệu tải → ảnh chụp (bảng của backup trừ `exportedAt`, Thùng rác gồm lý do chặn + hệ quả, panel AI + lịch sử của mọi KH có phân tích, `countRecords`, ô Tổng hợp Báo cáo năm, `kyc_versions.hash`) → xuất → nhập → ảnh chụp, 3 vòng, xen giữa: khôi phục mọi dòng Thùng rác không bị chặn (78), xóa 5 KH + 5 lịch dự kiến, xác nhận lại cùng giá trị một dữ kiện KYC của KH có phân tích; cuối cùng nhập ở "hôm nay" 01/12/2026. **Cả 4 lần không lệch mục nào**; lần xuất thứ hai trùng từng byte lần đầu (trừ `exportedAt`); số dòng bị chặn giữ nguyên qua nhập (39 → 39; sau khôi phục 30 → 30); xác nhận lại cùng giá trị không đổi hash phiên bản KYC (K10). Bộ nhớ qua 8 lần nhập: không rò (§4b). Script có ghi: `session-end.ps1` chỉ commit `-Paths`, kiểm `$LASTEXITCODE` sau mọi lệnh `git`; `handoff.mjs write` từ chối khi Issue đổi so với mốc (T21, T22 bị giết); `merge-pr` không xóa nhánh / worktree không ở đúng SHA vừa merge (T10, T11, T16 bị giết). Không thấy.
- **G — Guardrail AI:** gói F không có code G5. `tools/eval-ai-core.mjs` (đọc, **không chạy**): key chỉ từ biến môi trường, chỉ gửi trong header `Authorization`, câu lỗi của server bị che key + mã phiên trước khi cắt 200 ký tự; không che dạng URL-encode như Rust (K8) — lệnh do Owner chạy, key OpenCode là ký tự in được nên dạng URL-encode trùng nguyên văn trừ khi có ký tự đặc biệt → không nêu. Phần G của app: gói C.
- **S — An toàn ở ranh giới (CI / script / hook):** CI dùng `pull_request` (không `pull_request_target`), quyền `contents: read`, `pull-requests: read`, mọi `uses:` ghim SHA 40 ký tự, không secret nào ngoài `GITHUB_TOKEN`; PR từ fork không tự build exe (nhãn chỉ người có quyền gắn); `latestReview` chỉ nhận REVIEW của OWNER / MEMBER / COLLABORATOR (repo public — T17 bị giết); `merge-pr` ghim `--match-head-commit`; `pre-push` chặn đẩy thẳng `main` (cả xóa nhánh); `bootstrap.ps1` / `session-*.ps1` kiểm `$LASTEXITCODE` sau mọi lệnh native có tác dụng phụ (đọc); hook `SessionStart` chỉ đọc Issue ghim (chỉ người có quyền gắn nhãn `handoff`), hook `UserPromptSubmit` chỉ in gợi ý. Thấy: CL-F2, CL-F3 (cổng merge có thể bị qua mặt bởi dữ liệu GitHub / `gh` trả về).
- **P — Hiệu năng:** §4b; không phát hiện P mới (CL-A2 vẫn là điểm duy nhất tăng theo dữ liệu).
- **B — Bloat:** §4a; CL-F5 (KNOWN, bằng chứng mới). Không module mồ côi, không dependency thừa, không test lọt vào bundle.
- **T — Chất lượng test:** đột biến `tools/*-core.mjs` 35 lần: 33 bị giết (§7.2); 2 đột biến e2e trên phần chỉ e2e thấy được: 2 / 2 bị giết, lượt đối chứng xanh (§7.3) — trong đó EM1 chính là đột biến MJ30 sống ở gói B (`useQuery` không đọc lại), nay xác nhận e2e giết nó; 1 620 khối `it` / `test` của Vitest đều có khẳng định (1 ca báo động giả: `seed.test.ts:162` dùng helper `near` có `expect`); không có `skip` / `only` / `todo`; e2e: không có kiểm có điều kiện (`if (await … isVisible())`), không `catch` nuốt lỗi; `waitForTimeout(6000)` ở `demo-data.spec.ts:47` và hai lần chờ 100 ms (`customer-ai-web.spec.ts:322`, `settings-ai.spec.ts:300`) là ca phủ định có chủ ý ("không có gì xảy ra sau Hủy / câu trả lời muộn") — chậm CI, không giả xanh. Coverage riêng của `tools/` (ngoài `coverage.include` của repo; `vitest run tools --coverage`): `pr-core.mjs` 100 / 99,14 / 100 / 100 %, `session-core`, `review-hint-core`, `load-data-core` 100 % (Vitest ẩn dòng đạt 100 %), `codemap-core` 96,7 / 89,5 %, `size-report-core` 97,6 / 93,6 %, `retro-core` 100 / 88,4 %, `eval-ai-core` 99,7 / 97,5 %; file I/O 0 % đúng quy ước. Thấy: CL-F4 (múi giờ). Đã biết, không có bằng chứng mới: e2e `customer-ai.spec.ts:663` chập chờn 0,04 % (#524), regex `pr-core.test.mjs:102` (#524), các mục probe `e2e/perf` (#572), `e2e/guide` (#547).
- **A — Trợ năng / i18n:** gói F không có màn; câu in của `tools/` / hook là cho người phát triển (tiếng Anh, `eval-ai` / `size-report` tiếng Việt). Không xét thêm.

## 7. Phụ lục

### 7.1 Probe, log

Mọi file ở `C:\workspace\deep-review-1-6\claude\F\` (nguồn đầy đủ trong từng file, giữ tới khi phát hành v1.0 theo `plan.md` §8). Probe Node nạp thẳng nguồn TS ở SHA ghim qua `hooks.mjs` (chép của gói E, cách nạp như `tools/load-data.mjs`), không sửa repo. Không gọi `gh`, không gọi dịch vụ AI, không mở trình duyệt tới trang ngoài (probe e2e chỉ chạy Playwright của repo trên bản build web ở cổng 4173, sau khi kiểm cổng trống).

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `hooks.mjs` | loader TS không đuôi + `?raw` | — | mọi probe Node |
| `tz-run.ps1` | `pnpm exec vitest run` dưới `TZ` = UTC, America/Los_Angeles, Pacific/Kiritimati (19:20–19:24) | `logs\tz-*.log`, `logs\tz-summary.log` | CL-F4, §6 E |
| `f2-merge-rules.mjs` | `mergeBlockers` / `isDocsOnly` của `tools/pr-core.mjs` với CI chạy lại và PR > 100 file | `logs\f2-merge-rules.log` | CL-F2, CL-F3 |
| `p3-node-table.mjs` | bảng hàm thuần Phase 4 + `listTrash` + phần AI hồ sơ + một lệnh ghi qua `openAppData` + bộ nhớ qua 8 lần nhập (`node --expose-gc`) | `logs\p3-node-table.log` | §4b |
| `f5-bundle.mjs` (+ bản build `web\`) | gán byte của từng chunk cho nguồn theo source map | `logs\f5-bundle.log` | §4a |
| `f6-orphans.mjs` (+ `logs\depcruise.json`) | module không được code sản phẩm nào import | `logs\f6-orphans.log` | §4a |
| `f7-exports.mjs` | nơi dùng của export trong `tools/`, `e2e/`, hook, `ui/scripts` | `logs\f7-exports.log` | §4a |
| `f8-roundtrip.mjs` | xuất → nhập backup 3 vòng + nhập ở ngày khác, so ảnh chụp | `logs\f8-roundtrip.log` | §6 D |
| `f9-no-assert.mjs` | khối test không có khẳng định | `logs\f9-no-assert.log` | §6 T |
| `m-run.mjs` | 35 đột biến `tools/*-core.mjs` | `logs\m-run.log` | §7.2 |
| `em-run.mjs` | 2 đột biến e2e + lượt đối chứng | `logs\em-run.log`, `logs\em-EM*.out` | §7.3 |
| `coverage-tools\` | báo cáo coverage riêng của `tools/` (ngoài repo) | — | §6 T |

Lệnh khác (không có file nguồn riêng): `pnpm exec vite build --sourcemap --outDir …\F\web --emptyOutDir` (trong `apps/desktop`), `pnpm exec depcruise apps packages --output-type json --config .dependency-cruiser.cjs`, `pnpm exec vitest run tools --coverage …` (báo cáo ra `F\coverage-tools`), `grep -ao "files(first: *[0-9]*)" "/c/Program Files/GitHub CLI/gh"`, PowerShell đếm transcript theo thư mục cấu hình (chỉ siêu dữ liệu).

### 7.2 Đột biến `tools/*-core.mjs` (35 lần, 19:30–19:31: 33 bị giết, 2 sống)

`node m-run.mjs <repo>`: mỗi đột biến khớp đúng một chỗ, vá file của repo, `pnpm exec vitest run <file test>`, ghi lại nguyên byte trong `finally` và kiểm sha256; `git status --short` sau lượt: rỗng.

| ID | File | Đột biến | Kết quả |
|---|---|---|---|
| T01 | `pr-core.mjs` | `CODE_DOCS` cũng là docs | giết (2 đỏ) |
| T02 | `pr-core.mjs` | `isNotesOnly([])` = true | **sống** — tương đương trên thực tế (PR không file nào) |
| T03 | `pr-core.mjs` | `REVIEW: PASS` cho SHA khác vẫn nhận | giết |
| T04 | `pr-core.mjs` | check đang chạy tính là xanh | giết |
| T05 | `pr-core.mjs` | commit docs-only trên `main` cũng chặn | giết |
| T06 | `pr-core.mjs` | `package.json` không cần `build-exe` | giết |
| T07 | `pr-core.mjs` | job exe bị bỏ qua vẫn nhận | giết |
| T08 | `pr-core.mjs` | `risk:med` merge không cần `--owner` | giết (4 đỏ) |
| T09 | `pr-core.mjs` | mức review hạ rủi ro | giết |
| T10 | `pr-core.mjs` | xóa nhánh remote ở SHA khác | giết |
| T11 | `pr-core.mjs` | gỡ worktree task không ở SHA vừa merge | giết |
| T12 | `pr-core.mjs` | mọi `Project-2C-review*` là worktree review | giết |
| T13 | `pr-core.mjs` | mọi lỗi xóa nhánh coi như đã xong | giết |
| T14 | `pr-core.mjs` | PR xếp chồng merge không `--merge` | giết |
| T15 | `pr-core.mjs` | base khác `main` vẫn merge | giết |
| T16 | `pr-core.mjs` | xóa nhánh local ở SHA khác | giết |
| T17 | `session-core.mjs` | ai cũng đăng được REVIEW | giết |
| T18 | `session-core.mjs` | REVIEW đầu tiên thắng | giết |
| T19 | `session-core.mjs` | SHA 1 ký tự là SHA | **sống** — không test ghim độ dài tối thiểu 7 |
| T20 | `session-core.mjs` | STALE / STARTUP_FAILURE tính là xanh | giết |
| T21 | `session-core.mjs` | ghi HANDOFF khi Issue đã đổi | giết |
| T22 | `session-core.mjs` | lấy mốc sau khi ghi dù thân khác | giết |
| T23 | `session-core.mjs` | trần HANDOFF +1 ký tự | giết |
| T24 | `session-core.mjs` | cắt output hook không chừa chỗ ghi chú | giết |
| T25 | `review-hint-core.mjs` | chữ "review" xa số PR | giết |
| T26 | `review-hint-core.mjs` | `#N` trần là PR | giết (3 đỏ) |
| T27 | `size-report-core.mjs` | test Rust tính là sản phẩm | giết |
| T28 | `size-report-core.mjs` | `e2e/` tính là sản phẩm | giết |
| T29 | `size-report-core.mjs` | file AI của app ở lại D / E | giết (7 đỏ) |
| T30 | `size-report-core.mjs` | giữ hash trong tên chunk | giết |
| T31 | `codemap-core.mjs` | nhận dấu mốc trùng | giết |
| T32 | `codemap-core.mjs` | type ghi như giá trị | giết |
| T33 | `codemap-core.mjs` | không gộp theo thư mục khi quá dài | giết |
| T34 | `load-data-core.mjs` | mốc sau hôm nay vẫn nhận | giết |
| T35 | `load-data-core.mjs` | dữ liệu tải không có Thùng rác | giết |

### 7.3 Đột biến e2e (19:34–19:37; cổng 4173 trống trước mỗi lượt; `CI` và `PW_REUSE` để trống)

`node em-run.mjs <repo>`: `pnpm exec playwright test e2e/trash.spec.ts e2e/backup.spec.ts e2e/full-cycle.spec.ts --reporter=line` (webServer của repo tự build bản web, cổng 4173), vá tạm repo, ghi lại nguyên byte + kiểm sha256; `git status --short` sau lượt: rỗng.

| ID | File | Đột biến | Kết quả |
|---|---|---|---|
| EM0 | — | đối chứng, không vá | xanh — 13 passed (51 s) |
| EM1 | `apps/desktop/src/data/AppDataContext.tsx` | `useQuery` không đọc lại sau lệnh ghi (MJ30 sống ở gói B) | giết — 2 failed · 11 passed |
| EM2 | `apps/desktop/src/routes/SettingsBackup.tsx` | "Backup rồi thay dữ liệu" báo xong nhưng không thay | giết — 3 failed · 10 passed |

### 7.4 Cuối phiên

- `git status --short` cuối phiên (`C:\workspace\Project-2C-review`): rỗng; `git rev-parse HEAD` = `885534549808f42aec7f9af5743bbf86642ee4bd`.
- Không còn tiến trình nền của tôi (unit test múi giờ và e2e đã xong; server e2e do Playwright tự tắt). Không đo trên exe (số exe lấy từ `common\perf\perf-ref.json`).
- Không mở / liệt kê `codex\`, `muse\`, không liệt kê `C:\workspace\` hay `deep-review-1-6\`; chỉ kiểm file theo tên đầy đủ ở bước 0.
- Giờ xong: 2026-10-14 19:41.

## 8. Kết luận cho v1.0 ở SHA `8855345` (của Claude, tham khảo — kết luận thật ở phiên tổng hợp T-223)

**CHƯA SẴN SÀNG** — gần sẵn sàng: không có lỗi Critical / High, nhưng còn hai lỗi Medium ở thao tác bình thường và vài điểm sẽ làm danh sách nghiệm thu G7 ghi "Lỗi"; cả hai nhóm sửa nhỏ, chủ yếu chờ Owner chốt luật.

Lý do chặn:

1. **CL-D7 (Medium):** bàn giao KH (5c) để lịch dự kiến và mọi lịch nối tiếp ở lại RE cũ, không lệnh nào đổi được RE của lịch → "Đã gặp" và RF của cuộc gặp do RE mới làm cứ tính cho RE cũ, lệch Tổng quan / Báo cáo / Excel **lặng lẽ** theo thời gian (nhìn từ gói F, ca này sát thước High: dữ liệu chỉ số sai lặng lẽ ở thao tác bình thường; gói D để Medium vì luật đúng còn chờ Owner).
2. **CL-E7 (Medium):** xóa một cuộc gặp Đã gặp "giữ nhóm" cũ (≈ 40 % cuộc gặp trên dữ liệu tải) rồi không khôi phục được trong app, dù hộp 6g hứa "khôi phục được"; "Đã gặp" của kỳ đó thấp đi vĩnh viễn. Cùng gốc với CL-A1 (Low) → một chỗ sửa ở `checkRestoreAppointment` / `restoreAppointment`.
3. **Nghiệm thu G7 / phát hành:** CL-D2 (NT-HS-05: thiếu dòng đọc lại giá trị tiền ở 7b / 7c), CL-E4 (NT-TQ-06 "một chữ số thập phân" ↔ "60%"; 6c thiếu "· lần n"), CL-D3 (dòng thời gian không nói RF; thiếu ô Kỳ ở thẻ Lịch hẹn), CL-B4 (exe v1.0 sẽ mang phiên bản 0.1.0 và `User-Agent: Project-2C/0.1.0`): mỗi mục hoặc sửa, hoặc Owner ghi vào "Lệch mockup đã biết" / thêm bước đặt phiên bản 1.0.0 trước G7.

Không chặn (sau v1.0 hoặc gộp đợt sửa): 21 Low + 14 Nit còn lại của A–F. Nổi bật nên làm sớm vì rẻ: CL-B1 (`quick_check` lúc mở, ≈ 10 dòng — chặn backup hỏng đẩy hết bản tốt), CL-B6 (câu khởi động sai hướng có thể khiến người dùng chép đè bản tốt), CL-C3 (test hợp đồng trần token / ký tự TS ↔ Rust), CL-C4 (`prompt_version` của seed), CL-A2 (chỉ mục `customer_id`, ≈ 5 dòng + migration).

Điều đã kiểm và đạt (cơ sở để nói "gần sẵn sàng"):

- **Dữ liệu:** khứ hồi xuất / nhập backup 3 vòng (kèm khôi phục / xóa / ghi KYC) và nhập ở ngày khác không mất gì (`f8`); lệnh ↔ luật nhập cùng luật (gói A); S-2 / Thùng rác đúng spec trừ CL-A1 / CL-E7; không rò bộ nhớ qua nhiều lần thay dữ liệu.
- **An toàn:** key chỉ ở Rust / Credential Manager, mọi đường che key có test và đột biến bị giết (gói B, C); CSP / capabilities / đường dẫn file chặt (gói B); CI và cổng merge chặt, chỉ hở ở hai ca hiếm (CL-F2, CL-F3).
- **Hiệu năng:** mọi thao tác đo được dưới ngưỡng đã chốt, phần lớn dưới 1/2 ngưỡng (exe `perf-ref.json`; Edge; Node); chỗ duy nhất tăng theo dữ liệu là `listTrash` (CL-A2, Low).
- **Test:** đột biến của Claude ở 6 gói: A 33 / 35, B 58 / 64, C 69 / 77, D 41 / 43, E 67 / 70, F 33 / 35 + e2e 2 / 2 bị giết; mỗi đột biến sống đã được giải thích ở báo cáo của gói đó (thành phát hiện T, tương đương, hoặc chỉ e2e / thử tay bắt được — vd. MJ30 của gói B nay bị e2e giết ở EM1). Cổng ở SHA ghim xanh (`common\baseline.md`: 2 755 unit, 91 Rust, 210 e2e).

Ước lượng tới SẴN SÀNG: Owner chốt luật cho CL-D7 (5c chuyển lịch dự kiến, hay cho đổi RE của lịch) và TR-3 cho cuộc gặp giữ nhóm (CL-E7 + CL-A1, + CL-E1 nếu coi là D7); rồi ≈ 3 Issue ≤ 400 dòng SP (bàn giao; khôi phục cuộc gặp; nhóm sửa nghiệm thu + phiên bản), mỗi Issue kèm test lệnh / e2e như đề xuất ở từng mục.
