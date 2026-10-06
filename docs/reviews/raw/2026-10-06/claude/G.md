# Deep review Phase 1–4 — gói G (tools + CI + e2e) — Claude

- **SHA:** `f0c53eb` (worktree `C:\workspace\Project-2C-review`, `git rev-parse HEAD` = `f0c53eb57eb7eac8665ad87287e794ae4c5bc43b`, sạch). Repo chỉ đọc; không commit; không subagent.
- **Máy:** `D13_THINKPAD` (`$env:COMPUTERNAME`, thấy trong tên nhánh wip của probe CL-G9). HANDOFF ghi thư mục bằng chứng chỉ có ở Home PC; ở máy này thư mục đã có sẵn đủ `common\` và `claude\A…F.md`. Không ảnh hưởng kết quả.
- **Ngày:** 05–06/10/2026. Probe, log, kết quả: `C:\workspace\deep-review-1-4\claude\G\`.
- Đọc trước: kế hoạch §1, §4 dòng **gói G** (prompt ghi "§4 dòng gói A" — lỗi thay chữ trong mẫu, phiên này đọc dòng G), §5, §7; `common\known.md`, `baseline.md`; danh sách phát hiện + "Ghi chú cho gói sau" của `claude\A…F.md` (không đọc `codex\`).

## 1. Phạm vi đã đọc

| Vùng | File (dòng) | Cách |
|---|---|---|
| tools — merge / PR | `tools/pr-core.mjs` 1–204, `merge-pr.mjs` 1–151, `pr-status.mjs` 1–105, `pr-core.test.mjs` 1–417 | đọc hết; probe `probe-pr-core.mjs`; 19 mutation |
| tools — phiên / HANDOFF | `session-core.mjs` 1–107, `session-io.mjs` 1–14, `handoff.mjs` 1–154, `status.mjs` 1–77, `session-start.ps1` 1–72, `session-end.ps1` 1–71, `session-core.test.mjs` 1–157 | đọc hết; chạy `session-end.ps1` trong repo tạm; 12 mutation |
| tools — khác | `bootstrap.ps1` 1–210, `codemap.mjs` 1–95, `codemap-core.mjs` 1–187, `retro.mjs` 1–56, `retro-core.mjs` 1–242, `review-hint-core.mjs` 1–30 + test của từng file, `fixtures/retro/*` | đọc hết; chạy `bootstrap.ps1 -CheckOnly`, `codemap --check` trên bản sao; 13 mutation |
| hooks / settings | `.claude/hooks/handoff-context.mjs`, `review-pr-hint.mjs`, `.claude/settings.json`, `.claude/commands/{handoff,session-start}.md`, `.claude/rules/{ci,tests}.md`, `.claude/launch.json` | đọc hết; probe `probe-hint.mjs` |
| CI / GitHub | `.github/workflows/ci.yml` 1–114, `ISSUE_TEMPLATE/*`, `pull_request_template.md`, `.githooks/pre-push`, `.gitattributes`, `.prettierignore`, `vitest.config.ts`, `package.json` scripts | đọc hết; lịch sử 200 run CI (29/09–05/10) + log 110 run PR qua `gh` (chỉ đọc) |
| e2e | `playwright.config.ts`, `e2e/serve.mjs`, `support.ts`, `tsconfig.json`; đọc hết `smoke`, `navigation`, `screen-error`, `theme`, `data-table`, `chart`, `demo-data`, `seed-timing`, `period-picker` `.spec.ts`; `backup.spec.ts` 1–60; các spec còn lại (gói E / F đã đánh giá) quét bằng grep (đồng hồ, chọn phần tử, khẳng định không chờ) | chạy cả bộ ×2, 17 mutation TSX qua e2e, đo độ phủ e2e bằng V8 coverage |

Tổng: tools 1 775 dòng SP + 952 dòng test; hooks/settings 97; CI/GitHub 218; e2e 3 700 dòng (kể cả config).

Số đo chung của gói (chi tiết ở phụ lục A):
- **E2E cả bộ ×2** (`--repeat-each=2`, 4 worker, Edge, build không đổi): **291/291 xanh, 0 flaky, 7,0 phút**; tổng thời gian các test 1 654 s, trung vị 5,5 s/test; **291 lần tải trang HTML** (mỗi lần = một lần seed dữ liệu giả lập); `seed ms` đo trong trình duyệt (chạy một mình) = **3 161 ms**.
- **CI:** 200 run gần nhất: 109 PR xanh, 14 hủy (push mới), 1 đỏ; 76 push `main` xanh. Run PR xanh: trung vị 12,5 phút, p90 16,8. Run mới nhất (37259051334): `pnpm verify` 2,2 phút, **e2e 9,6 phút** trên tổng 12,9.
- **Unit với đồng hồ máy dời** (`fake-now.cjs`, đã kiểm dời tới worker của Vitest): 04/01/2027, 31/12/2026 23:59:40 (+07), 29/02/2028 → **1 260/1 260 xanh** cả ba lượt.
- **Mutation tools:** 44 mutation → 39 KILLED, 5 SURVIVED. **Mutation TSX qua e2e:** 17 → 13 KILLED, 4 SURVIVED (1 trong đó là KNOWN).
- **Độ phủ e2e (V8, build không minify, mỗi module một file):** 145 test chạy xong (8,0 phút, có coverage), 144 file coverage (test kích thước bundle không mở trang). Hàm được chạy ít nhất một lần: **1 335 / 1 413** (94,5 %) trên 120 module; riêng `apps/desktop/src` + `packages/ui/src`: **874 / 935**.

## 2. Phát hiện

### CL-G1

```
ID: CL-G1
Mức: Low
Trục: C
Vị trí: tools/pr-core.mjs:52-107 (mergeBlockers: chỉ kiểm "có nhãn build-exe → có check exe"), :77-84 · CLAUDE.md § Quy trình bước 5 ("Nhãn build-exe bắt buộc khi PR đụng apps/desktop/src-tauri/**, Cargo, rust-toolchain.toml, package.json, pnpm-lock.yaml hoặc cấu hình build") · .github/workflows/ci.yml:72-107 (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** Luật "PR đụng Rust / lockfile / cấu hình build **phải** có nhãn `build-exe`" chỉ nằm trên giấy. `merge-pr.mjs` kiểm chiều ngược lại (có nhãn thì phải có check exe không skipped) nhưng không kiểm danh sách file, nên PR sửa `storage.rs` thiếu nhãn được merge mà **37 test Rust, clippy, fmt và build exe không chạy trước merge** (job `build-exe` là nơi duy nhất chạy chúng; ghi chú gói C cũng nêu điều này).

**Tái hiện / bằng chứng.** `probe-pr-core.mjs`: PR `risk:low`, REVIEW PASS đúng head, Verify SUCCESS, exe SKIPPED, không nhãn `build-exe`, file lần lượt `apps/desktop/src-tauri/src/storage.rs`, `…/Cargo.toml`, `pnpm-lock.yaml`, `apps/desktop/vite.config.ts`, `rust-toolchain.toml` → `mergeBlockers` = `[]` cả năm ca (merge được). Lịch sử: 18 PR đã merge đụng các đường dẫn đó; 15 PR từ #118 đều có nhãn (giữ được nhờ kỷ luật), #74 / #87 / #96 (trước phụ lục 27/09) không có.

**Ảnh hưởng.** Một PR Rust quên nhãn (gắn sau thì CI không chạy lại — CLAUDE.md đã cảnh báo) vào `main` mà chưa có test Rust; lỗi chỉ lộ ở job build exe của push `main` (sau merge), tức `main` đã hỏng.

**Đề xuất.** Thêm vào `mergeBlockers` (và `pr-status`) luật "file khớp danh sách build-exe mà thiếu nhãn → chặn"; danh sách để một chỗ trong `pr-core.mjs`, có test. ≈ 25 dòng SP + 20 dòng test.

### CL-G2

```
ID: CL-G2
Mức: Low
Trục: C
Vị trí: .github/workflows/ci.yml:7-9, 13-15 (paths-ignore '**/*.md') · tools/pr-core.mjs:15-17 (isDocsOnly), :68 · tools/codemap.mjs:65-91 (--check trong pnpm verify) · packages/{domain,db,ui}/CLAUDE.md, apps/desktop/CLAUDE.md (khối codemap) (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** Bốn file `CLAUDE.md` của package không phải "chỉ tài liệu": `pnpm verify` (`codemap:check`) so khối giữa `<!-- codemap:start/end -->` với code và giới hạn cả file ≤ 8 000 ký tự. Nhưng CI bỏ qua mọi `**/*.md` và `merge-pr.mjs` coi PR chỉ sửa chúng là docs-only (merge không cần CI). PR docs sửa tay khối sinh tự động, hoặc thêm ghi chú tay làm file vượt ngưỡng, merge được mà không ai chạy `verify`; từ đó **mọi PR code sau đều đỏ** ở `codemap:check` vì lỗi không phải của nó.

**Tái hiện / bằng chứng.** Bản sao `packages/*/{src,CLAUDE.md}` + `apps/desktop/{src,CLAUDE.md}` vào `G\codemap-copy`, chạy `node <repo>\tools\codemap.mjs --check` với cwd là bản sao: bản gốc → exit 0; đổi một chữ trong khối map của `packages/db/CLAUDE.md` → **exit 1** "Export map out of date"; thêm ≈ 3,3 KB ghi chú tay ngoài khối (file 8 184 ký tự) → **exit 1**. Cùng lúc `isDocsOnly(['packages/db/CLAUDE.md'])` = `true` và `mergeBlockers` (không có check CI nào) = `[]` (`probe-pr-core.mjs`); test `pr-core.test.mjs:49` khẳng định đúng hành vi này. Độ dư hiện tại: db 4 840 / domain 5 125 / ui 2 825 / desktop 3 895 ký tự.

**Ảnh hưởng.** Hiếm (cần sửa tay file sinh), nhưng khi xảy ra thì chặn mọi PR code cho tới khi có PR sửa, và người làm PR kế tiếp phải tự tìm nguyên nhân ngoài diff.

**Đề xuất.** Đưa 4 file đó ra khỏi "docs-only" ở cả hai nơi: workflow đổi `paths-ignore` thành `paths` có loại trừ (`'**'`, `'!docs/**'`, `'!**/*.md'`, rồi `'packages/*/CLAUDE.md'`, `'apps/desktop/CLAUDE.md'`), `isDocsOnly` loại cùng danh sách (+ test). ≈ 10 dòng SP + 10 dòng test.

### CL-G3

```
ID: CL-G3
Mức: Low
Trục: T
Vị trí: e2e/demo-data.spec.ts:27-36 ("cancelling the reload dialog changes nothing") · apps/desktop/src/routes/Settings.tsx:104-106 (nút Hủy) (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** Test "Hủy … không đổi gì" chỉ kiểm hộp đóng và chưa có dòng `status`. `toHaveCount(0)` đúng ngay lập tức, nên một lỗi để nút Hủy vẫn nạp lại dữ liệu ở nền (dữ liệu bị thay, không báo) vẫn xanh.

**Tái hiện / bằng chứng.** `e2e-g.mjs` mutation **S1**: `onClick={() => onClose()}` → `onClick={() => { void data.reloadDemoData(); onClose(); }}` → **SURVIVED** (`demo-data.spec.ts` 2/2 xanh, 9,5 s). Ở exe, `reloadDemoData` còn sao lưu file và thay DB.

**Ảnh hưởng.** Hồi quy kiểu "Hủy vẫn thay dữ liệu" (mất thay đổi chưa sao lưu ở bản web, tạo backup + thay DB ở exe) lọt e2e. Hiện code đúng.

**Đề xuất.** Sau Hủy, kiểm một dấu hiệu dữ liệu không đổi (ví dụ tạo team trước rồi kiểm còn sau vài giây, hoặc đếm "File dữ liệu" không đổi; đợi quá thời gian seed bằng `expect.poll` / so số liệu). ≈ 10 dòng test.

### CL-G4

```
ID: CL-G4
Mức: Low
Trục: T
Vị trí: packages/ui/src/components/Dialog.tsx:29-33 (onCancel — Escape) · packages/ui/src/components/Segmented.tsx:25-34, 41 (onKeyDown — phím mũi tên) · e2e/*.spec.ts (không có `Escape` / `Arrow*`; chỉ 2 lần `Enter`) (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** Không test e2e nào bấm Escape hay phím mũi tên. Đo V8 coverage của cả bộ e2e: `Dialog` `onCancel` và `Segmented` `onKeyDown` có **0 lần chạy**; các `onClose` riêng của hộp thoại chỉ mở qua Escape (`ReloadDialog.onClose`, `ImportDialog.onClose`, `EditOutcomeDialog onClose`, `PolicyDialogs onClose`) cũng 0. Đây là hai đường bàn phím trợ năng chính (đóng hộp, chọn kỳ / góc nhìn bằng mũi tên) và đúng chỗ CL-D1 (Escape đóng hộp khi không được phép) xảy ra; e2e không thể bắt lại lỗi đó hay hồi quy của nó. Unit test cũng không có (repo chưa có công cụ test component, KNOWN Phase 1).

**Tái hiện / bằng chứng.** `e2e-cov.mjs run`: build không minify + `preserveModules` vào `G\dist-cov`, `cov-preload.cjs` gắn `page.coverage` vào fixture `page` của chính các spec (không sửa spec), 145 test xanh. Kết quả `e2e-cov-result.json`: `packages/ui/src/components/Dialog` 3/4 hàm (thiếu `onCancel`), `Segmented` 3/4 (thiếu `onKeyDown`), `routes/Settings` 8/9 (thiếu `ReloadDialog.onClose`), `SettingsBackup` 14/17. `rg "Escape|Arrow" e2e` → không có.

**Ảnh hưởng.** Hồi quy bàn phím (mũi tên không đổi kỳ, Escape đóng hộp đang chạy, Escape không đóng được hộp) không bị phát hiện trước merge.

**Đề xuất.** Thêm vài e2e bàn phím: mũi tên trên "Loại kỳ" / "Góc nhìn" (một vòng trái / phải, vòng quanh), Escape đóng hộp thường, Escape không đóng hộp đang chạy (gắn với sửa CL-D1). ≈ 40 dòng test.

### CL-G5

```
ID: CL-G5
Mức: Nit
Trục: T
Vị trí: apps/desktop/src/shell/Sidebar.tsx:35-39 (nhãn nhóm "Quản lý") · apps/desktop/src/shell/useRoute.ts:40 (sửa thanh địa chỉ theo route chuẩn — doc comment dòng 32) · packages/ui/src/components/DataTable.tsx:134 (mũi tên ↕ của cột chưa sắp) (f0c53eb)
Tình trạng: CONFIRMED (mutation)
```

**Mô tả.** Ba hành vi nhìn thấy được không có test nào giữ: bỏ nhãn nhóm "Quản lý" ở thanh bên (mutation N2), bỏ bước `replaceState` sửa địa chỉ `#/nope` → `#/overview` mà doc comment `useRoute` hứa (N6), đổi mũi tên cột chưa sắp `↕` thành `↑` (DT6, trông như đang sắp tăng) — cả ba **SURVIVED** trên các spec liên quan (22 / 22 / 40 test xanh). Thêm KNOWN Phase 1 "`DataTable` chưa có test `sortable: false`": mutation DT5 (bỏ qua `sortable`) **SURVIVED** cả trên `team.spec.ts` + `customer-appointments.spec.ts`, là hai màn duy nhất dùng `sortable: false` (`TeamScreen.tsx:121`, `CustomerAppointments.tsx:111`) — bằng chứng mới cho mục KNOWN, không tính thêm.

**Tái hiện / bằng chứng.** `e2e-g.mjs N`, `e2e-g.mjs DT` (phụ lục A, bảng mutation e2e).

**Ảnh hưởng.** Thấp: lỗi trình bày / điều hướng nhỏ lọt qua.

**Đề xuất.** Thêm vào test có sẵn: kiểm text "Quản lý" đứng trước "Team & nhân sự"; `toHaveURL(/#\/overview$/)` ở test địa chỉ lạ; kiểm `↕` ở cột chưa sắp. ≈ 6 dòng test.

### CL-G6

```
ID: CL-G6
Mức: Nit
Trục: T
Vị trí: playwright.config.ts:16 (retries: CI ? 1 : 0), :19 (expect timeout 15 s), :23 (trace retain-on-failure) · .github/workflows/ci.yml:63-70 (artifact chỉ khi job đỏ) · tools/pr-core.mjs:68-74 (không đọc flaky) (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** Trên CI, test đỏ lần đầu rồi xanh khi chạy lại được tính xanh; không có chỗ nào ghi lại (job xanh nên không upload trace / ảnh, `merge-pr` chỉ nhìn kết luận). Quét log 110 run PR (29/09–05/10): **2 run có "1 flaky"** (1,8 %), cả hai là trang không render kịp: `navigation.spec.ts:61` "a customer profile keeps Customers selected" (37007780739, T-091: h1 không thấy sau 15 s) và `seed-timing.spec.ts` (36585204524, T-050c1: quá 30 s, lần chạy lại 5,7 s). Cục bộ 2 lượt × 146 test: 0 flaky.

**Tái hiện / bằng chứng.** `gh run view <id> -R AlexH-AI/Project-2C --log` cho từng id trong `pr-run-ids.txt`, grep dòng tổng kết Playwright → `flaky-scan.txt`; chi tiết lỗi ở `flaky-nav.log` 536–560, `flaky-seed.log` 420–425.

**Ảnh hưởng.** Tỉ lệ hiện thấp; nhưng một flaky thật (đua dữ liệu, thứ tự) sẽ xanh mãi mà không ai thấy, và nguyên nhân (seed chậm khi nhiều worker, CL-G7) không có số theo dõi.

**Đề xuất.** In số flaky ra summary của job (`$GITHUB_STEP_SUMMARY` từ reporter JSON) hoặc upload artifact cả khi có flaky; `pr-status` có thể hiện "1 flaky". ≈ 15 dòng.

### CL-G7

```
ID: CL-G7
Mức: Nit
Trục: P
Vị trí: playwright.config.ts:18 ("Every page load seeds the simulated data") · apps/desktop/src/data/app-data.ts:224-235 (demoData: seed mỗi lần mở bản web) · .github/workflows/ci.yml:46-47 (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** Mỗi test e2e mở trang ít nhất một lần và mỗi lần tải trang seed lại toàn bộ dữ liệu giả lập (~1 200 KH / 6 000 lịch hẹn) trong trình duyệt. Seed chiếm phần lớn thời gian e2e, là bước chiếm 74 % thời gian CI của PR code.

**Tái hiện / bằng chứng.** Lượt ×2: **291 lần tải HTML** (middleware đếm trong `e2e-g.mjs`) cho 291 kết quả test; seed một mình 3 161 ms (annotation `seed ms`) ⇒ seed ≥ 291 × 3,16 s ≈ **920 s / 1 654 s** tổng thời gian test (**≥ 56 %**, cận dưới vì 4 worker seed cùng lúc chậm hơn). CI run 37259051334: e2e 9,6 phút / job 12,9 phút; CI seed riêng 6,6–7,4 s (comment `seed-timing.spec.ts:2`).

**Ảnh hưởng.** Mỗi PR code chờ ≈ 10 phút e2e; hai flaky của CL-G6 đều là chờ seed. Repo public nên không tốn tiền phút Actions; chỉ tốn thời gian chờ.

**Đề xuất.** (Cần quyết định thiết kế, không gấp.) Bản build e2e nạp sẵn file DB đã seed (sinh một lần lúc build / `globalSetup`, phục vụ như asset tĩnh, chỉ khi có `VITE_DEMO_ANCHOR`) thay vì seed mỗi lần mở; giữ `seed-timing.spec.ts` đo seed thật. Tiêu chí: e2e cục bộ < 4 phút cho 2 lượt, hoặc CI e2e < 5 phút. Cỡ ≈ 60 dòng SP + config.

### CL-G8

```
ID: CL-G8
Mức: Nit
Trục: C
Vị trí: .github/workflows/ci.yml:32-33 (Verify bỏ qua push main: "main only receives PRs that already passed Verify") · tools/pr-core.mjs:52-107 (không kiểm PR đã cập nhật theo main) (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** CI của PR kiểm merge-ref tại thời điểm chạy. Nếu `main` có merge code khác sau đó, PR vẫn được merge (không bắt buộc "up to date", `merge-pr` không đọc `mergeStateStatus`), còn push lên `main` chỉ build exe chứ không chạy Verify / e2e. Tổ hợp mới trên `main` không được kiểm tới PR code kế tiếp.

**Tái hiện / bằng chứng.** `runs2.json` + `merged.json` (`gh run list`, `gh pr list --state merged`): trong **98 PR code** có run CI xanh từ 29/09, **8 PR** được merge khi `main` đã nhận một PR code khác sau lượt CI xanh cuối của nó (#133, #141, #169, #171, #175 (xếp chồng trên #174), #247, #299, #339). Không lần nào gây đỏ thấy được: 76 / 76 push `main` xanh (chỉ build), PR code sau đó đều xanh.

**Ảnh hưởng.** Chưa xảy ra; khi xảy ra thì `main` đỏ âm thầm và PR kế tiếp gánh.

**Đề xuất.** Cách rẻ: `merge-pr` chặn khi `mergeStateStatus == BEHIND` và có PR code khác đã merge sau lượt CI (hoặc bảo "cập nhật nhánh rồi để CI chạy lại"). ≈ 15 dòng SP + test.

### CL-G9

```
ID: CL-G9
Mức: Nit
Trục: E
Vị trí: tools/session-end.ps1:50-68 (tạo nhánh wip trước khi biết có gì để commit; tên theo phút) (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** Trên `main`, script tạo `wip/<máy>-<yyyyMMdd-HHmm>` và push **trước** khi biết `-Paths` có thay đổi. Gọi với `-Paths` không đổi → đẩy một nhánh rỗng (trùng `main`) lên origin và để checkout chính đứng trên nhánh wip đó (lần `session-start` sau `pull --ff-only` theo `origin/wip/…`, không theo `main`). Hai lần trong cùng một phút → `git switch -c` lỗi vì trùng tên.

**Tái hiện / bằng chứng.** Repo tạm `G\se-probe` (bare remote + clone, chép `session-end.ps1`): ca 1 (main sạch, `-Paths a.txt` không đổi) → in "Nothing to commit in -Paths", rồi "Switched to a new branch 'wip/d13_thinkpad-20261005-2356'", push nhánh mới, exit 0, nhánh hiện tại = wip; ca 2 (cùng phút) → `git switch -c … failed (exit 128)`. Ca thiếu file trong `-Paths` → dừng an toàn, không commit (đúng).

**Ảnh hưởng.** Thấp: `/handoff` bước 6 chỉ chạy script khi "có code chưa commit", nhưng một `-Paths` nhầm là đủ để để checkout chính lệch khỏi `main` và có nhánh rác trên remote.

**Đề xuất.** Tính `$mine` trước; không có gì để commit thì không tạo nhánh, không push (chỉ push khi đang ở nhánh có commit chưa push). Tên nhánh thêm giây. ≈ 10 dòng.

### CL-G10

```
ID: CL-G10
Mức: Nit
Trục: C
Vị trí: tools/bootstrap.ps1:10-11 ("-CheckOnly … change nothing"), 28-33 (Update-SessionPath), 159 (gọi cả khi -CheckOnly) · tools/session-start.ps1:62 (gọi bằng & trong cùng tiến trình) (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** `-CheckOnly` vẫn gọi `Update-SessionPath`, ghi đè `$env:Path` của tiến trình bằng Machine + User + `.cargo\bin`, bỏ mọi mục PATH chỉ có trong tiến trình (shell của IDE, nvm/fnm, PATH do Claude Code / CI đặt). `session-start.ps1` gọi bootstrap trong cùng tiến trình nên các lệnh sau đó (`handoff.mjs read` khi `-ShowHandoff`) chạy với PATH khác.

**Tái hiện / bằng chứng.** PowerShell: `$env:Path = 'C:\p2c-probe-only-in-this-process;' + $env:Path; & tools\bootstrap.ps1 -CheckOnly *> $null` → exit 0, mục probe **không còn** trong `$env:Path`.

**Ảnh hưởng.** Thấp: trên hai máy hiện tại node / gh nằm trong PATH Machine/User; chỉ gặp khi một công cụ có trong PATH tiến trình mà không có trong registry.

**Đề xuất.** Chỉ `Update-SessionPath` khi thật sự cài (không `-CheckOnly`), hoặc nối thêm thay vì thay. ≈ 3 dòng.

### CL-G11

```
ID: CL-G11
Mức: Nit
Trục: C
Vị trí: tools/review-hint-core.mjs:3-28 (PR_REF nhận "#N" trần; NEAR = 40) · .claude/hooks/review-pr-hint.mjs:20-24 (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** Hook nhắc "Owner asked to review PR #N. Invoke the project skill review-pr" cho nhiều câu không phải yêu cầu review: số Issue trần đứng gần chữ "review" (chỉ "issue #N" được loại).

**Tái hiện / bằng chứng.** `probe-hint.mjs`: "Làm task T-138 (#350), xem lại ghi chú review trước khi code" → 350; "Sửa theo review notes, task #351" → 351; "merge PR #346 sau khi review PASS" → 346; "Đã review xong #12, giờ merge giúp anh" → 12; "Deep review Phase 1–4, gói G, theo kế hoạch (#347 đã merge)" → 347. Mutation H2 (bỏ điều kiện khoảng cách NEAR, coi mọi "review" là gần) **SURVIVED** — test không có ca "review" xa số.

**Ảnh hưởng.** Phiên làm task / merge nhận ngữ cảnh "hãy review PR #N" và có thể rẽ sang skill `review-pr` (review ở checkout chính, sai quy trình phiên sạch) nếu không đọc kỹ câu gốc.

**Đề xuất.** Chỉ nhận "PR #N" / "pull request #N" (bỏ "#N" trần), hoặc yêu cầu "review" đứng ngay trước; thêm test ca âm ở trên. ≈ 5 dòng SP + 8 dòng test.

### CL-G12

```
ID: CL-G12
Mức: Nit
Trục: T
Vị trí: e2e/period-picker.spec.ts:3-7, 118, 170, 219 (page.clock.setFixedTime(28/09/2026)) — đối chiếu dòng 27 và playwright.config.ts:39 (f0c53eb)
Tình trạng: CONFIRMED
```

**Mô tả.** `TODAY = new Date(2026, 8, 28, 9, 30)` ("Monday 28/09/2026") được đặt cho trình duyệt ở 6 test, nhưng bản build e2e ghim ngày mở app là 15/09/2026 (`openAppData`: ngày = ngày ghim + số ngày đồng hồ chạy kể từ lúc mở), nên `setFixedTime` không đổi ngày của app; các khẳng định đều là của 15/09 (tuần "14/09 – 20/09/2026", dòng 32). Dòng 27 có ghi chú điều này, nhưng hằng và comment dòng 3 vẫn nói 28/09.

**Tái hiện / bằng chứng.** Đọc code (`app-data.ts:168-175`) + lượt BASE: test xanh với nhãn tuần của 15/09; không có khẳng định nào phụ thuộc 28/09.

**Ảnh hưởng.** Người sửa test sau dễ tưởng đang kiểm 28/09 (thứ Hai, đầu tuần) và viết khẳng định sai; không gây lỗi hiện nay.

**Đề xuất.** Bỏ `setFixedTime` ở các test không cần, hoặc đổi hằng thành 15/09 + comment đúng. ≈ 5 dòng test.

### CL-G13

```
ID: CL-G13
Mức: Nit
Trục: T
Vị trí: tools/pr-core.mjs:131-133 (isReviewWorktree) · tools/session-core.mjs:25 (checkBody, biên 9 000), :96 (EXPECTED → pending) · tools/retro-core.mjs:116 (bỏ dòng sidechain) · tools/handoff.mjs, merge-pr.mjs, status.mjs, *.ps1 (phần I/O không test, theo quy ước .claude/rules/tests.md) (f0c53eb)
Tình trạng: CONFIRMED (mutation)
```

**Mô tả.** 44 mutation trên 5 module thuần của `tools/`: 39 bị bắt. 5 con sống (ngoài H2 đã nêu ở CL-G11): **P11** nới regex `isReviewWorktree` thành `/Project-2C-review/` (một worktree task tên `…Project-2C-review-old` hay nằm trong thư mục review sẽ bị coi là review: detach thay vì xóa — phía an toàn); **S1** `>` → `>=` ở `checkBody` (thân đúng 9 000 ký tự bị từ chối; test chỉ có 9 001); **S11** trạng thái `EXPECTED` (check bắt buộc chưa báo) tính là fail thay vì pending (vẫn chặn merge, chỉ đổi câu báo); **R1** tính cả dòng sidechain trong số liệu `retro`. Không con nào làm `merge-pr` merge sai; luật chặn merge (P1–P10, P12–P19, S2–S10, S12) đều bị bắt.

**Tái hiện / bằng chứng.** `mutate-tools.mjs` (phụ lục A).

**Ảnh hưởng.** Thấp.

**Đề xuất.** Thêm 4 ca test: `isReviewWorktree('C:/workspace/Project-2C-review-old')` = false, `checkBody` đúng 9 000, rollup có `EXPECTED`, transcript có dòng `isSidechain`. ≈ 15 dòng test.

## 3. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | P | B | T | A | S | Tổng |
|---|---|---|---|---|---|---|---|---|---|
| Critical | | | | | | | | | 0 |
| High | | | | | | | | | 0 |
| Medium | | | | | | | | | 0 |
| Low | | 2 (G1, G2) | | | | 2 (G3, G4) | | | 4 |
| Nit | 1 (G9) | 3 (G8, G10, G11) | | 1 (G7) | | 4 (G5, G6, G12, G13) | | | 9 |
| **Tổng** | 1 | 5 | 0 | 1 | 0 | 6 | 0 | 0 | **13** |

Cả 13 phát hiện đều CONFIRMED (probe, mutation, số đo hoặc dữ liệu GitHub); không có PLAUSIBLE. KNOWN liên quan (không tính): `DataTable` `sortable: false` (bằng chứng mới ở CL-G5); CL-F1 (`team.spec.ts:319` đọc đồng hồ máy) — quét của gói G xác nhận đó là **chỗ duy nhất** trong `e2e/` và unit test không phụ thuộc đồng hồ máy (xem §4 trục T).

## 4. Đã xét, không thấy

- **E — Edge case.** `merge-pr` `parseArgs` (số PR không phải số, cờ lạ → exit 2); `parseWorktrees` với CRLF (test + mutation P16); `latestReview` với nhiều REVIEW, REVIEW của người ngoài, SHA viết hoa (regex chỉ nhận hex thường → "names no SHA", phía an toàn), "PASS_WITH…" (`/^PASS\b/` không nhận); `fitOutput` cắt ở giới hạn; `handoff.mjs read --out` khi offline lưu base từ bản tạm → lần `write` sau so với Issue thật và từ chối nếu đã đổi (đúng); `session-end.ps1` với `-Paths` sai tên / file chưa track (dừng an toàn, probe ca 3); `codemap` CRLF (eol=lf + `replaceBlock` chuẩn hóa, mutation C4 bị bắt); `pre-push` chặn cả `push origin --delete main` và `HEAD:refs/heads/main` (đọc `remote_ref`). Unit test cả repo với đồng hồ máy 31/12 23:59:40, 04/01/2027, 29/02/2028: xanh hết.
- **C — Đúng hợp đồng.** `merge-pr.mjs` làm đúng 6 bước dọn nhánh như comment đầu file (đối chiếu `cleanupPlan` + 11 test + mutation P12–P19); `--match-head-commit` ghim head (P9 bị bắt); `isDocsOnly` khớp `paths-ignore` của workflow (trừ phần nêu ở CL-G2); `status.mjs` / `pr-status.mjs` dùng cùng `latestReview` / `checkCounts` với `merge-pr`. Hook `SessionStart` giữ output < 10 000 ký tự (`fitOutput`, test).
- **D — Dữ liệu.** `handoff.mjs write` không đè bản của máy kia (base `updatedAt`, mutation S2/S3 bị bắt; khoảng hở giữa kiểm và ghi được ghi nhận trong code, ADR-0003); `cleanupPlan` không bao giờ đụng worktree bẩn (P13–P15 bị bắt; `isDirty` lỗi → coi là bẩn); `session-end.ps1` chỉ commit theo pathspec. E2E: mỗi test có context riêng (localStorage riêng, DB trong bộ nhớ seed lại), không `beforeAll` / `serial` / chia sẻ trạng thái — không phụ thuộc thứ tự.
- **P — Hiệu năng.** Ngoài CL-G7: `codemap --check` 0,4 s; `tools` khác chỉ gọi `gh` / `git` vài lần; `retro.mjs` đọc tối đa 30 transcript. Kích thước chunk chart 178,5 KB gzip dưới ngưỡng 250 KB của `chart.spec.ts:62` (baseline).
- **B — Bloat.** Mọi export của `tools/*.mjs` có nơi dùng ngoài file khai báo hoặc được export cho test theo quy ước `*-core.mjs` (grep từng tên trên `tools/` + `.claude/hooks/`); `e2e/support.ts` `trackConsoleErrors` dùng ở 2 spec (smoke / period-picker vẫn tự viết lại 3 dòng tương tự — lặp nhỏ, không báo). Không dependency nào chỉ cho tools ngoài `typescript` (codemap).
- **T — Chất lượng test.** Ngoài CL-G3–G6, G12, G13: mutation shell / ErrorBoundary / DataTable qua e2e bị bắt 13/17 (N1, N3–N5, N7–N10, DT1–DT4); `screen-error.spec.ts` có test canh chính trigger lỗi ("only the customers screen breaks"); `forbidOnly` bật trên CI. Đồng hồ: `e2e/` chỉ có `team.spec.ts:319` (CL-F1) đọc đồng hồ Node; unit + tools test xanh với 3 mốc đồng hồ dời. Chọn phần tử theo class CSS (trái `.claude/rules/tests.md`): chỉ `customer-policies.spec.ts` 27/46/71/100/135 (`span.rounded-full`) — làm test đỏ chứ không xanh giả khi đổi class, nên không báo.
- **A — Trợ năng / i18n.** Spec chọn phần tử theo role / tên tiếng Việt; `navigation`, `data-table` kiểm `aria-current`, `aria-sort`, focus nút sắp xếp bằng Enter. Thiếu đường bàn phím Escape / mũi tên → đã nêu ở CL-G4 (trục T). Chuỗi trong `tools/` là tiếng Anh cho người phát triển (đúng quy ước), không có chuỗi UI.
- **S — An toàn (hẹp).** Workflow: `permissions: contents: read, pull-requests: read`; mọi `uses:` ghim SHA 40 ký tự + comment bản (grep); `GH_TOKEN` chỉ dùng đọc nhãn; không `pull_request_target`. `latestReview` chỉ nhận REVIEW của OWNER / MEMBER / COLLABORATOR (repo public; mutation S4 bị bắt). Tên file xuất trong e2e (`backup.spec.ts:27` `^project2c-\d{8}-\d{4}\.p2cbackup$`). `handoff-cache.json` nằm trong git common dir (không bị commit). Hook chỉ đọc `$CLAUDE_PROJECT_DIR/tools`.

## Phụ lục A — Kết quả

### A1. Mutation TSX qua e2e (`e2e-g-results.json`)

Mỗi lượt build bản web với đúng một file đổi (plugin `load` của Vite, ra `G\dist-mut`), phục vụ ở cổng 4193, chạy các spec liên quan (4 worker, không retry). `pageLoads` = số lần tải HTML (= số lần seed).

| Lượt | Kết quả | Lần tải trang | Playwright | Tổng kết | Test đỏ (tối đa 2) |
|---|---|---|---|---|---|
| BASE whole suite | GREEN | 291 | 422 s | 291 passed (7.0m) |  |
| N1 aria-current always on overview | KILLED | 23 | 47 s | 2 failed, 20 passed (46.5s) | navigation.spec.ts:26 clicking each sidebar item switches the screen and marks it current; navigation.spec.ts:53 a customer profile keeps Customers selected |
| N2 no "Quản lý" group label | SURVIVED | 23 | 36 s | 22 passed (35.3s) |  |
| N3 settings without icon | KILLED | 23 | 39 s | 1 failed, 21 passed (38.8s) | navigation.spec.ts:6 the sidebar lists the six screens, each with an icon |
| N4 active link not accent | KILLED | 23 | 39 s | 1 failed, 21 passed (38.7s) | navigation.spec.ts:26 clicking each sidebar item switches the screen and marks it current |
| N5 last screen not remembered | KILLED | 23 | 39 s | 1 failed, 21 passed (38.7s) | navigation.spec.ts:41 reopening the app returns to the last screen |
| N6 address bar not corrected | SURVIVED | 23 | 36 s | 22 passed (35.2s) |  |
| N7 boundary not keyed by route | KILLED | 23 | 39 s | 1 failed, 21 passed (38.7s) | screen-error.spec.ts:32 a screen that fails to render shows a message and the sidebar still works |
| N8 boundary ignores resetKey | KILLED | 3 | 22 s | 1 failed, 2 passed (21.7s) | screen-error.spec.ts:53 changing the scope renders a failed screen again |
| N9 scope picker on every screen | KILLED | 23 | 42 s | 2 failed, 20 passed (41.6s) | navigation.spec.ts:116 the scope picker shows only on Overview, Customers, Appointments and Reports; navigation.spec.ts:137 the scope kept while its picker is hidden |
| N10 error detail hidden | KILLED | 3 | 22 s | 1 failed, 2 passed (21.5s) | screen-error.spec.ts:32 a screen that fails to render shows a message and the sidebar still works |
| DT1 no way back to unsorted | KILLED | 40 | 77 s | 2 failed, 38 passed (1.3m) | data-table.spec.ts:27 dates sort by time, not as text: 01/10 comes after 30/09; data-table.spec.ts:46 a header cycles none → ↑ → ↓ → none, one sorted column at a time |
| DT2 unsorted header without aria-sort | KILLED | 40 | 77 s | 3 failed, 37 passed (1.3m) | data-table.spec.ts:18 opens sorted by date, newest first; data-table.spec.ts:27 dates sort by time, not as text: 01/10 comes after 30/09 |
| DT3 descending first | KILLED | 40 | 77 s | 3 failed, 37 passed (1.3m) | data-table.spec.ts:27 dates sort by time, not as text: 01/10 comes after 30/09; data-table.spec.ts:46 a header cycles none → ↑ → ↓ → none, one sorted column at a time |
| DT4 thenBy dropped | KILLED | 40 | 63 s | 1 failed, 39 passed (1.0m) | appointments.spec.ts:295 sorting by day puts the appointments of one day in time order, either way |
| DT5 sortable:false ignored (KNOWN Phase 1) | SURVIVED | 55 | 87 s | 55 passed (1.4m) |  |
| DT6 arrow shown on unsorted | SURVIVED | 40 | 66 s | 40 passed (1.1m) |  |
| S1 cancel reloads in the background | SURVIVED | 2 | 10 s | 2 passed (9.5s) |  |

Lượt BASE chạy `--repeat-each=2` có cả project `seed-timing`. Annotation `seed ms` = 3160.7. Cột test đỏ lấy từ báo cáo JSON của Playwright (`pw-<id>.json`).

### A2. Mutation `tools/*-core.mjs` (`mutate-tools-results.json`)

Chạy 96 test của `tools/**/*.test.mjs` (`vitest.mut.config.mts`) cho mỗi mutation. Tổng: {"KILLED":39,"SURVIVED":5}.

| ID | File | Thay đổi | Kết quả | Test bắt được |
|---|---|---|---|---|
| P1 | tools/pr-core.mjs | empty file list is docs-only | KILLED | tools/pr-core.test.mjs > isDocsOnly > is false for an empty file list |
| P2 | tools/pr-core.mjs | risk: lower of label and review | KILLED | tools/pr-core.test.mjs > riskLevel > takes the higher level when the review raised it |
| P3 | tools/pr-core.mjs | PASS for any SHA | KILLED | tools/pr-core.test.mjs > mergeBlockers > stops when the PASS names another SHA than the head (P-1) |
| P4 | tools/pr-core.mjs | draft merged | KILLED | tools/pr-core.test.mjs > mergeBlockers > stops on a draft |
| P5 | tools/pr-core.mjs | pending CI is green | KILLED | tools/pr-core.test.mjs > mergeBlockers > stops a code PR with a failing, pending or missing check |
| P6 | tools/pr-core.mjs | skipped exe accepted | KILLED | tools/pr-core.test.mjs > mergeBlockers > with build-exe, waits for the exe check and refuses it skipped |
| P7 | tools/pr-core.mjs | med merged without --owner | KILLED | tools/pr-core.test.mjs > mergeBlockers > stops a med PR unless the Owner said to merge |
| P8 | tools/pr-core.mjs | stacked squash allowed | KILLED | tools/pr-core.test.mjs > mergeBlockers > asks for --merge when another PR is stacked on this branch |
| P9 | tools/pr-core.mjs | merge not pinned to head | KILLED | tools/pr-core.test.mjs > mergeSteps > merges pinned to the head, then fetches |
| P10 | tools/pr-core.mjs | docs-only: PASS SHA not checked | KILLED | tools/pr-core.test.mjs > mergeBlockers > stops when the PASS names no SHA |
| P11 | tools/pr-core.mjs | any worktree counts as review | SURVIVED |  |
| P12 | tools/pr-core.mjs | branch deleted while stacked | KILLED | tools/pr-core.test.mjs > cleanupPlan > keeps the branch, local and remote, while another PR is stacked on it |
| P13 | tools/pr-core.mjs | dirty main switched anyway | KILLED | tools/pr-core.test.mjs > cleanupPlan > stops at a dirty main checkout and keeps the local branch |
| P14 | tools/pr-core.mjs | dirty review holder detached | KILLED | tools/pr-core.test.mjs > cleanupPlan > reports every worktree holding main that cannot be moved, dirty or not |
| P15 | tools/pr-core.mjs | task worktree removed even if dirty | KILLED | tools/pr-core.test.mjs > cleanupPlan > removes a clean task worktree of the branch, reports a dirty one |
| P16 | tools/pr-core.mjs | CRLF worktree list | KILLED | tools/pr-core.test.mjs > parseWorktrees > accepts CRLF output |
| P17 | tools/pr-core.mjs | any failed remote delete is done | KILLED | tools/pr-core.test.mjs > alreadyDone > keeps any other failure of the remote delete a failure |
| P18 | tools/pr-core.mjs | base not main allowed | KILLED | tools/pr-core.test.mjs > mergeBlockers > stops when the base is another branch that is not merged yet |
| P19 | tools/pr-core.mjs | remote kept after merge | KILLED | tools/pr-core.test.mjs > cleanupPlan > deletes the remote branch, moves the main checkout to main, deletes the local branch |
| S1 | tools/session-core.mjs | body max off by one (9000 refused) | SURVIVED |  |
| S2 | tools/session-core.mjs | write ignores a changed issue | KILLED | tools/session-core.test.mjs > checkWrite > refuses when the issue changed since the file was saved |
| S3 | tools/session-core.mjs | write ignores another issue | KILLED | tools/session-core.test.mjs > checkWrite > refuses when the file was saved from another issue |
| S4 | tools/session-core.mjs | anyone may PASS | KILLED | tools/pr-core.test.mjs > mergeBlockers > ignores a REVIEW: PASS written by someone without write access |
| S5 | tools/session-core.mjs | first review, not last | KILLED | tools/pr-core.test.mjs > mergeBlockers > stops when the latest REVIEW is CHANGES, even after an older PASS |
| S6 | tools/session-core.mjs | in-progress check counts by conclusion | KILLED | tools/pr-core.test.mjs > mergeBlockers > stops a code PR with a failing, pending or missing check |
| S7 | tools/session-core.mjs | skipped counts as failure | KILLED | tools/pr-core.test.mjs > mergeBlockers > ignores skipped checks on a green code PR |
| S8 | tools/session-core.mjs | cut ignores marker room | KILLED | tools/session-core.test.mjs > fitOutput > cuts long output below the hook limit with a marker |
| S9 | tools/session-core.mjs | several handoff issues: first wins | KILLED | tools/session-core.test.mjs > pickHandoffIssue > fails when there are several, naming them |
| S10 | tools/session-core.mjs | level regex without risk: | KILLED | tools/session-core.test.mjs > latestReview > reads a level written as risk:<level> |
| S11 | tools/session-core.mjs | expected status counted pending → fail | SURVIVED |  |
| S12 | tools/session-core.mjs | empty body accepted | KILLED | tools/session-core.test.mjs > checkBody > refuses an empty body |
| H1 | tools/review-hint-core.mjs | "issue #N" taken as a PR | KILLED | tools/review-hint-core.test.mjs > reviewedPr > does not take an issue number for a PR |
| H2 | tools/review-hint-core.mjs | "review" anywhere in the prompt | SURVIVED |  |
| H3 | tools/review-hint-core.mjs | "preview" counts as review | KILLED | tools/review-hint-core.test.mjs > reviewedPr > needs the word review |
| C1 | tools/codemap-core.mjs | repeated marker accepted | KILLED | tools/codemap-core.test.mjs > replaceBlock > refuses a file with a missing, repeated or reversed marker |
| C2 | tools/codemap-core.mjs | map never falls back | KILLED | tools/codemap-core.test.mjs > renderExportMap > groups files by directory, without names, when the full map is over the limit |
| C3 | tools/codemap-core.mjs | type-only export clause not a type | KILLED | tools/codemap-core.test.mjs > listExports > lists local export clauses, type-only ones and default assignments |
| C4 | tools/codemap-core.mjs | CRLF kept | KILLED | tools/codemap-core.test.mjs > replaceBlock > is idempotent and writes LF even when the file has CRLF |
| C5 | tools/codemap-core.mjs | export default function named | KILLED | tools/codemap-core.test.mjs > listExports > lists declared exports in source order and marks types |
| C6 | tools/codemap-core.mjs | reversed markers accepted | KILLED | tools/codemap-core.test.mjs > replaceBlock > refuses a file with a missing, repeated or reversed marker |
| R1 | tools/retro-core.mjs | sidechain lines counted | SURVIVED |  |
| R2 | tools/retro-core.mjs | request usage repeated per line | KILLED | tools/retro-core.test.mjs > sessionStats > measures a task session |
| R3 | tools/retro-core.mjs | median of even list = upper middle | KILLED | tools/retro-core.test.mjs > median > ignores nulls and averages the two middle values |
| R4 | tools/retro-core.mjs | longer project name kept | KILLED | tools/retro-core.test.mjs > project directories > keeps the repo folder and its review / worktree siblings, not a longer name |

### A3. Độ phủ e2e (`e2e-cov-result.json`)

144 file coverage (một / test có trang). Mỗi hàng: số hàm được vào ít nhất một lần / số hàm (bỏ hàm cấp module), và tên các hàm chưa bao giờ chạy kèm số dòng **trong file build không minify** (`G\dist-cov\assets\…`, không phải dòng nguồn). Chỉ liệt kê module có hàm chưa chạy; các module khác 100 %.

| Module | Đã chạy | Hàm chưa chạy |
|---|---|---|
| `apps/desktop/src/data/app-data` | 26/33 | isUnsavedChangesError@20, (anonymous)@41, openDatabase.persist@59, lastSave@154, subscribeLastSave@155, latestBackup@159, openFolder@160 |
| `apps/desktop/src/data/persist-queue` | 4/10 | setFailed@8, drain@13, persist@28, unsaved@37, flush@38, (anonymous)@45 |
| `apps/desktop/src/data/tauri-storage` | 0/1 | tauriStorage@9 |
| `apps/desktop/src/data/today` | 8/9 | onFocus@25 |
| `apps/desktop/src/main` | 4/5 | (anonymous)@36 |
| `apps/desktop/src/routes/appointments/AppointmentDialog` | 30/32 | onClick@275, onClick@197 |
| `apps/desktop/src/routes/appointments/AppointmentsScreen` | 80/81 | value@166 |
| `apps/desktop/src/routes/appointments/EditOutcomeDialog` | 12/15 | (anonymous)@85, onClose@93, onChange@161 |
| `apps/desktop/src/routes/appointments/OutcomeDialog` | 18/20 | (anonymous)@84, (anonymous)@84 |
| `apps/desktop/src/routes/customers/CustomerAppointments` | 15/18 | value@70, value@83, value@94 |
| `apps/desktop/src/routes/customers/CustomerDialogs` | 23/24 | onChange@338 |
| `apps/desktop/src/routes/customers/CustomersScreen` | 27/30 | value@65, value@76, onClick@199 |
| `apps/desktop/src/routes/customers/KycDialogs` | 18/20 | onChange@36, onClick@183 |
| `apps/desktop/src/routes/customers/PolicyDialogs` | 21/23 | onClose@111, onChange@159 |
| `apps/desktop/src/routes/overview/stage-chart` | 16/18 | row@36, formatter@54 |
| `apps/desktop/src/routes/overview/TeamCompare` | 10/11 | onClick@67 |
| `apps/desktop/src/routes/reports/report-workbook` | 28/29 | exportFailedHelp@206 |
| `apps/desktop/src/routes/reports/ReportExport` | 5/6 | (anonymous)@89 |
| `apps/desktop/src/routes/reports/reports-view` | 33/34 | dayName@75 |
| `apps/desktop/src/routes/Settings` | 8/9 | ReloadDialog.onClose@112 |
| `apps/desktop/src/routes/SettingsBackup` | 14/17 | onClick@145, (anonymous)@196, ImportDialog.onClose@233 |
| `apps/desktop/src/routes/SettingsDataFile` | 3/5 | FileFacts@63, OpenFolderButton@128 |
| `apps/desktop/src/routes/team/TeamScreen` | 38/41 | value@63, value@86, value@101 |
| `apps/desktop/src/shell/close-guard` | 0/1 | closeAfterSaving@6 |
| `apps/desktop/src/shell/CloseGuard` | 0/2 | CloseGuard@17, CloseDialog@52 |
| `apps/desktop/src/shell/RePicker` | 4/5 | onClick@32 |
| `apps/desktop/src/shell/ScopeContext` | 1/2 | pickRe@10 |
| `apps/desktop/src/shell/startup-error` | 0/1 | startupMessage@8 |
| `apps/desktop/src/shell/StartupError` | 0/1 | StartupError@7 |
| `apps/desktop/src/shell/useRoute` | 6/7 | (anonymous)@21 |
| `packages/db/src/schema` | 28/44 | (anonymous)@52, (anonymous)@78, (anonymous)@87, (anonymous)@88, (anonymous)@98, (anonymous)@101, (anonymous)@110, (anonymous)@111, (anonymous)@115, (anonymous)@121, (anonymous)@132, (anonymous)@133, (anonymous)@150, (anonymous)@160, (anonymous)@165, (anonymous)@177 |
| `packages/domain/src/stats` | 30/31 | marks.forEach.previous@29 |
| `packages/ui/src/components/compare-cells` | 2/3 | number@9 |
| `packages/ui/src/components/Dialog` | 3/4 | onCancel@18 |
| `packages/ui/src/components/Segmented` | 3/4 | onKeyDown@6 |

Tổng 120 module: 1335/1413 hàm. Phần chỉ chạy trong exe (`CloseGuard`, `close-guard`, `tauri-storage`, `StartupError`, `startup-error`, một phần `persist-queue` / `app-data` / `SettingsDataFile`) là 0 theo thiết kế (e2e chạy bản web). Các `value@…` của bảng là accessor của cột chỉ gọi khi sắp theo cột đó.

### A4. CI (`flaky-scan.txt`, `runs2.json`, `merged.json`, `ci-steps.json`)

Dòng có "flaky" / "retry" trong 110 log run PR (mỗi dòng: id run, rồi các dòng tổng kết Playwright):

```
37007780739 ok  82 [edge] › e2e\navigation.spec.ts:61:1 › a customer profile keeps Customers selected (retry #1) (9.1s)|1 flaky|113 passed (10.2m)|
36724400832 x  32 [edge] › e2e\backup.spec.ts:22:1 › exports, then imports the file back after confirming: later changes are gone (retry #1) (30.2s)|x  31 [edge] › e2e\backup.spec.ts:75:1 › the export notice gives the file name and size, with no folder to open in web mode (retry #1) (30.2s)|ok 36 [edge] › e2e\backup.spec.ts:88:1 › cancelling the import changes nothing (retry #1) (14.3s)|ok 37 [edg
36585204524 ok  2 [seed-timing] › e2e\seed-timing.spec.ts:8:1 › web mode seeds the simulated data in time (#64) (retry #1) (5.7s)|1 flaky|74 passed (5.2m)|
```

Run 36724400832 (backup.spec, đỏ cả lần chạy lại) là lỗi thật lúc đó (run "failure" duy nhất), không phải flaky.

### A5. Probe khác (lệnh và kết quả)

```
> node probe-pr-core.mjs
storage.rs, no build-exe label: blockers = []
Cargo.toml, no build-exe label: blockers = []
pnpm-lock.yaml, no build-exe label: blockers = []
vite.config.ts, no build-exe label: blockers = []
rust-toolchain.toml, no build-exe label: blockers = []
packages/db/CLAUDE.md: isDocsOnly=true, blockers without any CI = []
apps/desktop/CLAUDE.md: isDocsOnly=true, blockers without any CI = []
.claude/skills/review-pr/SKILL.md: isDocsOnly=true, blockers without any CI = []
CLAUDE.md: isDocsOnly=true, blockers without any CI = []

> (cwd G\codemap-copy) node <repo>\tools\codemap.mjs --check
Export maps are up to date.                                  exit=0   (bản sao nguyên)
Export map out of date in: packages\db\CLAUDE.md            exit=1   (đổi 'src/' → 'SRC/' trong khối map)
Export map out of date in: packages\db\CLAUDE.md            exit=1   (thêm ghi chú tay, file 8 184 ký tự)

> node probe-hint.mjs
350   Làm task T-138 (#350), xem lại ghi chú review trước khi code
null  bắt đầu issue #350 — sửa các phát hiện của review đóng Phase 4
351   Sửa theo review notes, task #351
344   review lại thay đổi ở #344
347   Deep review Phase 1–4, gói G, theo kế hoạch (#347 đã merge)
346   merge PR #346 sau khi review PASS
12    Đã review xong #12, giờ merge giúp anh
12    review PR #12 và PR #13

> (PowerShell) $env:Path = 'C:\p2c-probe-only-in-this-process;' + $env:Path
> & tools\bootstrap.ps1 -CheckOnly *> $null
exit=0
probe entry still on PATH after -CheckOnly: False

> (PowerShell, G\se-probe\work: bare remote + clone, tools\session-end.ps1 chép từ repo)
--- case 1: clean main, -Paths a.txt (unchanged)
Nothing to commit in -Paths (a.txt).
Switched to a new branch 'wip/d13_thinkpad-20261005-2356'
 * [new branch]      wip/d13_thinkpad-20261005-2356 -> wip/d13_thinkpad-20261005-2356
Pushed wip/d13_thinkpad-20261005-2356. Safe to switch machines.
exit=0; branch now: wip/d13_thinkpad-20261005-2356
remote branches: refs/heads/main refs/heads/wip/d13_thinkpad-20261005-2356
--- case 2 (same minute, back on main, -Paths b.txt new)
git switch -c wip/d13_thinkpad-20261005-2356 failed (exit 128) - do not leave this machine until it succeeds.
--- case 3: -Paths c.txt,d.txt (d.txt missing)
git add c.txt d.txt failed (exit 128) ...   exit=1, nothing committed, nothing pushed

> unit suite, Node clock shifted (fake-now.cjs; probe-now.test.mjs asserts year 2027 inside a Vitest worker: passed)
=== 2027-01-04T03:00:00Z   Test Files 66 passed (66) · Tests 1260 passed (1260)
=== 2026-12-31T16:59:40Z   Test Files 66 passed (66) · Tests 1260 passed (1260)
=== 2028-02-29T05:00:00Z   Test Files 66 passed (66) · Tests 1260 passed (1260)

> CI step timing, run 37259051334: pnpm verify 2.2 min · E2E 9.6 min · job 12.9 min
> merged-behind count (runs2.json + merged.json, code PRs with a green CI run since 29/09): 98 checked, 8 merged after another code merge landed
  #339 after #338 · #299 after #300 · #247 after #246 · #175 after #174 (stacked) · #171 after #170 · #169 after #168 · #141 after #140 · #133 after #132
```

## Phụ lục B — Nguồn test tạm / probe

### `probe-pr-core.mjs`

```js
// Gói G probe: merge rules of tools/pr-core.mjs on PR shapes the rules in CLAUDE.md name.
import { mergeBlockers, isDocsOnly } from 'file:///C:/workspace/Project-2C-review/tools/pr-core.mjs';

const HEAD = 'abcdef1234567890abcdef1234567890abcdef12';
const pass = { authorAssociation: 'OWNER', body: 'REVIEW: PASS\n\nPR #9, head `abcdef1`, mức `risk:low`.' };
const green = [
  { name: 'Verify (lint, typecheck, unit, boundaries)', status: 'COMPLETED', conclusion: 'SUCCESS' },
  { name: 'Build portable exe', status: 'COMPLETED', conclusion: 'SKIPPED' },
];
const pr = (paths, labels = ['risk:low']) => ({
  number: 9, state: 'OPEN', isDraft: false, headRefOid: HEAD, baseRefName: 'main', headRefName: 'task/x',
  labels: labels.map((name) => ({ name })), comments: [pass], statusCheckRollup: green,
  files: paths.map((path) => ({ path })),
});
const ctx = { owner: false, mode: 'squash', stacked: [], baseMerged: null };
const cases = {
  'storage.rs, no build-exe label': ['apps/desktop/src-tauri/src/storage.rs'],
  'Cargo.toml, no build-exe label': ['apps/desktop/src-tauri/Cargo.toml'],
  'pnpm-lock.yaml, no build-exe label': ['pnpm-lock.yaml'],
  'vite.config.ts, no build-exe label': ['apps/desktop/vite.config.ts'],
  'rust-toolchain.toml, no build-exe label': ['rust-toolchain.toml'],
};
for (const [name, paths] of Object.entries(cases)) {
  console.log(`${name}: blockers = ${JSON.stringify(mergeBlockers(pr(paths), ctx))}`);
}
for (const p of ['packages/db/CLAUDE.md', 'apps/desktop/CLAUDE.md', '.claude/skills/review-pr/SKILL.md', 'CLAUDE.md']) {
  const docs = isDocsOnly([p]);
  const b = mergeBlockers({ ...pr([p]), statusCheckRollup: [] }, ctx);
  console.log(`${p}: isDocsOnly=${docs}, blockers without any CI = ${JSON.stringify(b)}`);
}
```

### `probe-hint.mjs`

```js
// Gói G probe: which prompts make the UserPromptSubmit hook tell Claude to review a PR.
import { reviewedPr } from 'file:///C:/workspace/Project-2C-review/tools/review-hint-core.mjs';
const prompts = [
  'Làm task T-138 (#350), xem lại ghi chú review trước khi code',
  'bắt đầu issue #350 — sửa các phát hiện của review đóng Phase 4',
  'Sửa theo review notes, task #351',
  'review lại thay đổi ở #344',
  'Deep review Phase 1–4, gói G, theo kế hoạch (#347 đã merge)',
  'merge PR #346 sau khi review PASS',
  'Đã review xong #12, giờ merge giúp anh',
  'review PR #12 và PR #13',
];
for (const p of prompts) console.log(JSON.stringify(reviewedPr(p)).padEnd(5), p);
```

### `e2e-g.mjs`

```js
// Deep review Phase 1–4, gói G: e2e quality of the shell / DataTable / Settings specs.
// For each entry: builds the web app with ONE file served mutated (Vite load hook) into
// G\dist-mut (never the repo's dist), serves it on port 4193 with a middleware that counts full
// page loads (GET of the HTML document = one seed of the simulated data each), and runs the given
// Playwright specs against it (playwright.g.config.ts). The repo is only read.
// Usage: node e2e-g.mjs <name-prefix> [extra playwright args...]
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const HERE = 'C:/workspace/deep-review-1-4/claude/G';
const ROOT = 'C:/workspace/Project-2C-review';
const APP = `${ROOT}/apps/desktop`;
const OUT = `${HERE}/dist-mut`;
const PW = `${ROOT}/node_modules/@playwright/test/cli.js`;
const SH = 'apps/desktop/src/shell/';
const DT = 'packages/ui/src/components/DataTable.tsx';
const ERR = ['screen-error.spec.ts'];
const TABLE = ['data-table.spec.ts', 'appointments.spec.ts', 'customer-appointments.spec.ts'];
const DEMO = ['demo-data.spec.ts'];
const SHELL = ['navigation.spec.ts', 'smoke.spec.ts', 'theme.spec.ts', 'screen-error.spec.ts'];

/** [name, file, from, to, specs, extra?] — `from` must occur exactly once in the file. */
const MUTATIONS = [
  ['BASE whole suite', null, null, null, [], { seedTiming: true }],
  ['N1 aria-current always on overview', `${SH}Sidebar.tsx`, "aria-current={active ? 'page' : undefined}", "aria-current={section === 'overview' ? 'page' : undefined}", SHELL],
  ['N2 no "Quản lý" group label', `${SH}Sidebar.tsx`, '{section === FIRST_MANAGE_SECTION && (', '{false && (', SHELL],
  ['N3 settings without icon', `${SH}Sidebar.tsx`, '<NavIcon name={ICONS[section]} />', "{section !== 'settings' && <NavIcon name={ICONS[section]} />}", SHELL],
  ['N4 active link not accent', `${SH}Sidebar.tsx`, "? 'bg-accent-soft font-semibold text-accent'", "? 'bg-accent-soft font-semibold text-fg'", SHELL],
  ['N5 last screen not remembered', `${SH}useRoute.ts`, '    store(canonical);\n', '\n', SHELL],
  ['N6 address bar not corrected', `${SH}useRoute.ts`, "    if (window.location.hash !== canonical) window.history.replaceState(null, '', canonical);\n", '\n', SHELL],
  ['N7 boundary not keyed by route', `${SH}AppShell.tsx`, '<ErrorBoundary key={routeToHash(route)} resetKey={scope}>', '<ErrorBoundary resetKey={scope}>', SHELL],
  ['N8 boundary ignores resetKey', `${SH}ErrorBoundary.tsx`, 'if (this.state.failed && previous.resetKey !== this.props.resetKey) {', 'if (false) {', ERR],
  ['N9 scope picker on every screen', `${SH}AppShell.tsx`, '{usesScope(route.screen) && (', '{true && (', SHELL],
  ['N10 error detail hidden', `${SH}ErrorBoundary.tsx`, "{t('storage.technicalDetail')} <code>{detail}</code>", "{t('storage.technicalDetail')}", ERR],
  ['DT1 no way back to unsorted', DT, 'enableSortingRemoval: true,', 'enableSortingRemoval: false,', TABLE],
  ['DT2 unsorted header without aria-sort', DT, "(sorted ? ARIA_SORT[sorted] : 'none')", '(sorted ? ARIA_SORT[sorted] : undefined)', TABLE],
  ['DT3 descending first', DT, 'sortDescFirst: false,', 'sortDescFirst: true,', TABLE],
  ['DT4 thenBy dropped', DT, '        column.thenBy?.(a.original),\n        column.thenBy?.(b.original),\n', '        undefined,\n        undefined,\n', TABLE],
  ['DT5 sortable:false ignored (KNOWN Phase 1)', DT, 'enableSorting: column.sortable ?? true,', 'enableSorting: true,', [...TABLE, 'team.spec.ts']],
  ['DT6 arrow shown on unsorted', DT, "{sorted ? ARROW[sorted] : '↕'}", "{sorted ? ARROW[sorted] : '↑'}", TABLE],
  ['S1 cancel reloads in the background', 'apps/desktop/src/routes/Settings.tsx', '<Button disabled={running} onClick={() => onClose()}>', '<Button disabled={running} onClick={() => { void data.reloadDemoData(); onClose(); }}>', DEMO],
];

const vitePath = createRequire(`${APP}/package.json`).resolve('vite');
const { build, preview } = await import(pathToFileURL(vitePath).href);
process.env.VITE_DEMO_ANCHOR = '15/09/2026';

const mutatePlugin = (file, from, to) => ({
  name: 'p2c-mutate',
  enforce: 'pre',
  load(id) {
    if (!file) return null;
    const clean = id.split('?')[0].replaceAll('\\', '/').toLowerCase();
    if (clean !== resolve(ROOT, file).replaceAll('\\', '/').toLowerCase()) return null;
    const source = readFileSync(resolve(ROOT, file), 'utf8').replaceAll('\r\n', '\n');
    return source.replace(from, to);
  },
});

let loads = 0;
const countLoads = {
  name: 'p2c-count-loads',
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      const path = (req.url ?? '').split('?')[0];
      if (req.method === 'GET' && (path === '/' || path === '/index.html')) loads++;
      next();
    });
  },
};

const [filter, ...pwExtra] = process.argv.slice(2);
const resultsFile = `${HERE}/e2e-g-results.json`;
let results = {};
try {
  results = JSON.parse(readFileSync(resultsFile, 'utf8'));
} catch {}
let built = null;
for (const [name, file, from, to, specs, extra = {}] of MUTATIONS) {
  if (!name.startsWith(filter ?? '')) continue;
  if (file) {
    const source = readFileSync(`${ROOT}/${file}`, 'utf8').replaceAll('\r\n', '\n');
    const count = source.split(from).length - 1;
    if (count !== 1) {
      results[name] = { verdict: 'BAD-MUTATION', detail: `found ${count} times` };
      console.log(`BAD-MUTATION ${name} (found ${count} times)`);
      continue;
    }
  }
  const started = Date.now();
  const key = file ? name : 'unmutated';
  if (built !== key) {
    await build({
      root: APP,
      configFile: `${APP}/vite.config.ts`,
      logLevel: 'error',
      cacheDir: `${HERE}/.vite-e2e`,
      build: { outDir: OUT, emptyOutDir: true },
      plugins: [mutatePlugin(file, from, to)],
    });
    built = key;
  }
  loads = 0;
  const server = await preview({
    root: APP,
    configFile: `${APP}/vite.config.ts`,
    logLevel: 'error',
    build: { outDir: OUT },
    preview: { port: 4193, strictPort: true },
    plugins: [countLoads],
  });
  const json = `${HERE}/pw-${name.split(' ')[0]}.json`;
  const args = [PW, 'test', ...specs, `--config=${HERE}/playwright.g.config.ts`, ...pwExtra];
  const pwStarted = Date.now();
  // Asynchronous: the preview server runs in this process and must keep answering.
  const run = await new Promise((done) => {
    const child = spawn(process.execPath, args, {
      cwd: ROOT,
      env: { ...process.env, CI: '', G_JSON: json, G_SEED_TIMING: extra.seedTiming ? '1' : '' },
    });
    let stdout = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stdout += d));
    child.on('close', (status) => done({ status, stdout }));
  });
  const pwMs = Date.now() - pwStarted;
  await server.close();
  const failed = [...run.stdout.matchAll(/^\s+\d+\) \[(?:edge|seed-timing)\] › (\S+) › ([^\n]+?) ─/gm)]
    .map((m) => `${m[1]} ${m[2]}`)
    .filter((v, i, a) => a.indexOf(v) === i);
  const summary = (run.stdout.match(/^\s*\d+ (passed|failed|flaky|skipped|did not run)[^\n]*/gm) ?? []).map((s) => s.trim());
  const verdict = !file ? (run.status === 0 ? 'GREEN' : 'RED') : run.status === 0 ? 'SURVIVED' : 'KILLED';
  results[name] = { verdict, pageLoads: loads, playwrightMs: pwMs, totalMs: Date.now() - started, summary, failed: failed.slice(0, 8) };
  console.log(`${verdict} ${name} · loads ${loads} · ${(pwMs / 1000).toFixed(0)} s · ${summary.join(', ')}`);
  appendFileSync(`${HERE}/e2e-g.log`, `\n===== ${name}\n${run.stdout}\n`);
  writeFileSync(resultsFile, JSON.stringify(results, null, 2));
}
```

### `playwright.g.config.ts`

```ts
// Gói G: the repo's e2e specs against a web build served by e2e-g.mjs on port 4193 (not 4173 / 4183),
// output outside the repo. Same browser, locale, timeouts and worker cap as playwright.config.ts.
import { availableParallelism } from 'node:os';
import { defineConfig, devices } from '@playwright/test';

const EDGE = { ...devices['Desktop Edge'], channel: 'msedge' };
const OUT = 'C:/workspace/deep-review-1-4/claude/G';

export default defineConfig({
  testDir: 'C:/workspace/Project-2C-review/e2e',
  fullyParallel: true,
  workers: Number(process.env.G_WORKERS) || Math.min(4, Math.max(1, availableParallelism() >> 2)),
  retries: 0,
  reporter: [['line'], ['json', { outputFile: process.env.G_JSON || `${OUT}/pw-report.json` }]],
  expect: { timeout: 15_000 },
  outputDir: `${OUT}/pw-out`,
  use: { baseURL: 'http://localhost:4193', locale: 'vi-VN', screenshot: 'only-on-failure' },
  projects:
    process.env.G_SEED_TIMING === '1'
      ? [
          { name: 'seed-timing', testMatch: 'seed-timing.spec.ts', use: EDGE },
          {
            name: 'edge',
            testIgnore: 'seed-timing.spec.ts',
            dependencies: ['seed-timing'],
            use: EDGE,
          },
        ]
      : [{ name: 'edge', testIgnore: 'seed-timing.spec.ts', use: EDGE }],
});
```

### `e2e-cov.mjs`

```js
// Gói G: e2e coverage of the app's source modules. Builds the web app unminified with one output
// file per source module (preserveModules) into G\dist-cov, serves it on port 4193, runs the whole
// e2e suite with cov-preload.cjs (V8 coverage per test), then merges the coverage: per module,
// the share of function bodies ever entered and the functions never entered by any test.
// Usage: node e2e-cov.mjs [run|report]
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const HERE = 'C:/workspace/deep-review-1-4/claude/G';
const ROOT = 'C:/workspace/Project-2C-review';
const APP = `${ROOT}/apps/desktop`;
const OUT = `${HERE}/dist-cov`;
const PW = `${ROOT}/node_modules/@playwright/test/cli.js`;
const mode = process.argv[2] ?? 'run';

if (mode === 'run') {
  const vitePath = createRequire(`${APP}/package.json`).resolve('vite');
  const { build, preview } = await import(pathToFileURL(vitePath).href);
  process.env.VITE_DEMO_ANCHOR = '15/09/2026';
  await build({
    root: APP,
    configFile: `${APP}/vite.config.ts`,
    logLevel: 'error',
    cacheDir: `${HERE}/.vite-cov`,
    build: {
      outDir: OUT,
      emptyOutDir: true,
      minify: false,
      rollupOptions: {
        output: {
          preserveModules: true,
          preserveModulesRoot: ROOT,
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
        },
      },
    },
  });
  if (existsSync(`${HERE}/cov`)) rmSync(`${HERE}/cov`, { recursive: true });
  const server = await preview({
    root: APP,
    configFile: `${APP}/vite.config.ts`,
    logLevel: 'error',
    build: { outDir: OUT },
    preview: { port: 4193, strictPort: true },
  });
  const started = Date.now();
  const status = await new Promise((done) => {
    const child = spawn(
      process.execPath,
      [PW, 'test', `--config=${HERE}/playwright.g.config.ts`, '--reporter=dot'],
      {
        cwd: ROOT,
        stdio: 'inherit',
        env: {
          ...process.env,
          CI: '',
          G_JSON: `${HERE}/pw-cov.json`,
          NODE_OPTIONS: `--require ${HERE}/cov-preload.cjs`,
        },
      },
    );
    child.on('close', done);
  });
  await server.close();
  console.log(`playwright exit ${status} in ${((Date.now() - started) / 1000).toFixed(0)} s`);
}

// Merge: a function counts as entered when any test's coverage gives its first range a count > 0.
const files = readdirSync(`${HERE}/cov`).filter((f) => f.endsWith('.json'));
const byUrl = new Map();
for (const f of files) {
  const { entries } = JSON.parse(readFileSync(`${HERE}/cov/${f}`, 'utf8'));
  for (const { url, functions } of entries) {
    let fns = byUrl.get(url);
    if (!fns) byUrl.set(url, (fns = new Map()));
    for (const fn of functions) {
      const [whole] = fn.ranges;
      const key = `${whole.startOffset}-${whole.endOffset}`;
      const prev = fns.get(key) ?? { name: fn.functionName, start: whole.startOffset, hit: 0 };
      prev.hit += whole.count;
      fns.set(key, prev);
    }
  }
}
const rows = [];
for (const [url, fns] of byUrl) {
  const path = decodeURIComponent(url.replace('http://localhost:4193/assets/', ''));
  if (!/^(apps\/desktop\/src|packages\/(ui|domain|db)\/src)\//.test(path)) continue;
  const source = readFileSync(`${OUT}/assets/${path}`, 'utf8');
  const line = (offset) => source.slice(0, offset).split('\n').length;
  // The module's top-level function (whole file) is always entered; leave it out.
  const list = [...fns.values()].filter((f) => f.start > 0);
  const missed = list.filter((f) => f.hit === 0);
  rows.push({
    file: path.replace(/\.js$/, ''),
    functions: list.length,
    entered: list.length - missed.length,
    missed: missed.map((f) => `${f.name || '(anonymous)'}@${line(f.start)}`),
  });
}
rows.sort((a, b) => a.file.localeCompare(b.file));
writeFileSync(`${HERE}/e2e-cov-result.json`, JSON.stringify({ tests: files.length, rows }, null, 2));
const tsx = rows.filter((r) => /\.tsx$/.test(r.file) || /shell\/|routes\//.test(r.file));
console.log(`coverage files (tests): ${files.length}`);
for (const r of tsx) {
  const pct = r.functions ? ((100 * r.entered) / r.functions).toFixed(0) : '—';
  console.log(`${r.file}  ${r.entered}/${r.functions} (${pct}%)  missed: ${r.missed.slice(0, 12).join(', ')}`);
}
```

### `cov-preload.cjs`

```js
// Gói G: preloaded with NODE_OPTIONS=--require into every Playwright process. Replaces the `test`
// export of playwright/test with one whose `page` fixture records V8 JS coverage (Edge is
// Chromium) and writes it to G\cov\<random>.json, so the repo's specs measure e2e coverage
// without being edited. Only scripts served from the app (localhost:4193/assets/) are kept.
const { mkdirSync, writeFileSync } = require('node:fs');
const { randomUUID } = require('node:crypto');

const OUT = 'C:/workspace/deep-review-1-4/claude/G/cov';
mkdirSync(OUT, { recursive: true });
const { realpathSync } = require('node:fs');
const { dirname } = require('node:path');
// The very module the specs reach through @playwright/test (pnpm store path), so the patch is seen.
const atTest = realpathSync(require.resolve('@playwright/test', { paths: ['C:/workspace/Project-2C-review'] }));
const pw = require(require.resolve('playwright/test', { paths: [dirname(atTest)] }));
if (!pw.__p2cCoverage) {
  const base = pw.test;
  pw.test = base.extend({
    page: async ({ page }, use, testInfo) => {
      await page.coverage.startJSCoverage({ resetOnNavigation: false });
      await use(page);
      const entries = await page.coverage.stopJSCoverage();
      const kept = entries
        .filter((e) => e.url.startsWith('http://localhost:4193/assets/'))
        .map(({ url, functions }) => ({ url, functions }));
      writeFileSync(
        `${OUT}/${randomUUID()}.json`,
        JSON.stringify({ test: `${testInfo.file}:${testInfo.line} ${testInfo.title}`, entries: kept }),
      );
    },
  });
  pw.__p2cCoverage = true;
}
```

### `mutate-tools.mjs`

```js
// Gói G: "phá code" for the pure tool modules (tools/*-core.mjs). Each mutation changes ONE place
// of ONE file (served through vitest.mut.config.mts) and runs the tools unit tests.
// KILLED = some test went red; SURVIVED = all 100+ tool tests stayed green.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const HERE = 'C:/workspace/deep-review-1-4/claude/G';
const ROOT = 'C:/workspace/Project-2C-review';
const PR = 'tools/pr-core.mjs';
const SC = 'tools/session-core.mjs';
const RH = 'tools/review-hint-core.mjs';
const CM = 'tools/codemap-core.mjs';
const RC = 'tools/retro-core.mjs';

/** [id, file, what, from, to] — `from` must occur exactly once. */
const M = [
  ['P1', PR, 'empty file list is docs-only', 'paths.length > 0 && paths.every', 'paths.every'],
  ['P2', PR, 'risk: lower of label and review', 'LEVELS[Math.max(...found)]', 'LEVELS[Math.min(...found)]'],
  ['P3', PR, 'PASS for any SHA', 'else if (!pr.headRefOid.startsWith(review.sha))', 'else if (false)'],
  ['P4', PR, 'draft merged', "if (pr.isDraft) blockers.push('PR is a draft.');", ''],
  ['P5', PR, 'pending CI is green', 'else if (fail || pending)', 'else if (fail)'],
  ['P6', PR, 'skipped exe accepted', "else if (exe.conclusion === 'SKIPPED')", 'else if (false)'],
  ['P7', PR, 'med merged without --owner', "if (risk !== 'low' && !owner)", "if (risk === 'high' && !owner)"],
  ['P8', PR, 'stacked squash allowed', "if (stacked.length && mode !== 'merge') {", 'if (false) {'],
  ['P9', PR, 'merge not pinned to head', "`--${mode}`, '--match-head-commit', pr.headRefOid]", '`--${mode}`]'],
  ['P10', PR, 'docs-only: PASS SHA not checked', "else if (!review.sha) blockers.push('Latest REVIEW: PASS names no head SHA.');", ''],
  ['P11', PR, 'any worktree counts as review', "return /[\\\\/]Project-2C-review(-\\d+)?$/.test(path);", "return /Project-2C-review/.test(path);"],
  ['P12', PR, 'branch deleted while stacked', "if (localExists && !branchInUse && !stacked.length) git(main.path, 'branch', '-D', branch);", "if (localExists && !branchInUse) git(main.path, 'branch', '-D', branch);"],
  ['P13', PR, 'dirty main switched anyway', 'if (isDirty(main) || stuck.length) {', 'if (stuck.length) {'],
  ['P14', PR, 'dirty review holder detached', "const stuck = holders.filter((w) => !isReviewWorktree(w.path) || dirty.has(w.path));", 'const stuck = holders.filter((w) => !isReviewWorktree(w.path));'],
  ['P15', PR, 'task worktree removed even if dirty', '    if (isDirty(w)) branchInUse = true;\n', '    if (false) branchInUse = true;\n'],
  ['P16', PR, 'CRLF worktree list', ".replace(/\\r\\n/g, '\\n')\n    .split('\\n\\n')", ".split('\\n\\n')"],
  ['P17', PR, 'any failed remote delete is done', 'if (/remote ref does not exist/.test(message))', 'if (true)'],
  ['P18', PR, 'base not main allowed', "if (pr.baseRefName !== 'main') {", 'if (false) {'],
  ['P19', PR, 'remote kept after merge', "    git(main.path, 'push', 'origin', '--delete', branch);\n", '\n'],
  ['S1', SC, 'body max off by one (9000 refused)', 'if (length > BODY_MAX) {', 'if (length >= BODY_MAX) {'],
  ['S2', SC, 'write ignores a changed issue', 'if (base.updatedAt !== current.updatedAt) {', 'if (false) {'],
  ['S3', SC, 'write ignores another issue', 'if (base.number !== current.number) {', 'if (false) {'],
  ['S4', SC, 'anyone may PASS', '(c) => c.body.startsWith(\'REVIEW:\') && REVIEWERS.has(c.authorAssociation),', "(c) => c.body.startsWith('REVIEW:'),"],
  ['S5', SC, 'first review, not last', 'const body = reviews[reviews.length - 1].body;', 'const body = reviews[0].body;'],
  ['S6', SC, 'in-progress check counts by conclusion', "if (check.status && check.status !== 'COMPLETED') pending++;\n    else if", 'if (false) pending++;\n    else if'],
  ['S7', SC, 'skipped counts as failure', "else if (result !== 'SKIPPED' && result !== 'NEUTRAL') fail++;", "else if (result !== 'NEUTRAL') fail++;"],
  ['S8', SC, 'cut ignores marker room', 'body.slice(0, room - 120)', 'body.slice(0, room)'],
  ['S9', SC, 'several handoff issues: first wins', 'if (issues.length > 1) {', 'if (false) {'],
  ['S10', SC, 'level regex without risk:', 'mức `(?:risk:)?(low|med|high)`', 'mức `(low|med|high)`'],
  ['S11', SC, 'expected status counted pending → fail', "else if (result === 'PENDING' || result === 'EXPECTED') pending++;", "else if (result === 'PENDING') pending++;"],
  ['S12', SC, 'empty body accepted', "if (body.trim() === '') return { error: 'The new HANDOFF body is empty.', warning: null };", ''],
  ['H1', RH, '"issue #N" taken as a PR', "if (ref[1] === '#' && AFTER_ISSUE.test(prompt.slice(0, start))) continue;", ''],
  ['H2', RH, '"review" anywhere in the prompt', '(r.end <= start && start - r.end <= NEAR) || (end <= r.start && r.start - end <= NEAR)', 'true'],
  ['H3', RH, '"preview" counts as review', 'const REVIEW = /\\breview\\b/gi;', 'const REVIEW = /review\\b/gi;'],
  ['C1', CM, 'repeated marker accepted', 'if (n > 1) throw new Error(`${marker} must appear once (found ${n})`);', ''],
  ['C2', CM, 'map never falls back', 'if (full.length <= limit) return full;', 'return full;'],
  ['C3', CM, 'type-only export clause not a type', 'type: node.isTypeOnly || element.isTypeOnly', 'type: element.isTypeOnly'],
  ['C4', CM, 'CRLF kept', "const text = content.replace(/\\r\\n/g, '\\n');", 'const text = content;'],
  ['C5', CM, 'export default function named', "names.push({ name: isDefault(node) ? 'default' : node.name.text, type });", 'names.push({ name: node.name?.text ?? \'default\', type });'],
  ['C6', CM, 'reversed markers accepted', 'if (to < from) throw new Error(`${START} must come before ${END}`);', ''],
  ['R1', RC, 'sidechain lines counted', "const lines = entries.filter((e) => typeof e.sessionId === 'string' && e.isSidechain !== true);", "const lines = entries.filter((e) => typeof e.sessionId === 'string');"],
  ['R2', RC, 'request usage repeated per line', 'if (id && usage && !requests.some((r) => r.id === id)) requests.push({ id, usage });', 'if (id && usage) requests.push({ id, usage });'],
  ['R3', RC, 'median of even list = upper middle', 'sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2', 'sorted[mid]'],
  ['R4', RC, 'longer project name kept', 'n === repoDir || n.startsWith(`${repoDir}-`)', 'n.startsWith(repoDir)'],
];

const results = {};
for (const [id, file, what, from, to] of M) {
  const source = readFileSync(`${ROOT}/${file}`, 'utf8').replaceAll('\r\n', '\n');
  const count = source.split(from).length - 1;
  if (count !== 1) {
    results[id] = { file, what, verdict: `BAD-MUTATION (found ${count})` };
    console.log(`${id} BAD-MUTATION found ${count}`);
    continue;
  }
  const run = spawnSync(
    process.execPath,
    [`${HERE}/node_modules/vitest/vitest.mjs`, 'run', '--config', `${HERE}/vitest.mut.config.mts`, '--reporter=dot'],
    { cwd: HERE, encoding: 'utf8', env: { ...process.env, MUT: JSON.stringify({ file, from, to }) } },
  );
  const out = run.stdout + run.stderr;
  const failing = [...out.matchAll(/FAIL\s+(\S+) > (.+)/g)].map((m) => `${m[1]} > ${m[2].trim()}`);
  const verdict = run.status === 0 ? 'SURVIVED' : 'KILLED';
  results[id] = { file, what, verdict, by: failing[0] ?? null };
  console.log(`${id} ${verdict} ${what}${failing[0] ? ` — ${failing[0]}` : ''}`);
}
writeFileSync(`${HERE}/mutate-tools-results.json`, JSON.stringify(results, null, 2));
const tally = Object.values(results).reduce((t, r) => ({ ...t, [r.verdict]: (t[r.verdict] ?? 0) + 1 }), {});
console.log(JSON.stringify(tally));
```

### `vitest.mut.config.mts`

```ts
// Gói G: the repo's tools/**/*.test.mjs with ONE tools file served mutated (MUT = JSON
// {file, from, to}); the repo is only read. Run from this folder:
//   node node_modules/vitest/vitest.mjs run --config vitest.mut.config.mts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repo = 'C:/workspace/Project-2C-review';
const here = 'C:/workspace/deep-review-1-4/claude/G';
const mut = process.env.MUT ? JSON.parse(process.env.MUT) : null;
const target = mut ? resolve(repo, mut.file).replaceAll('\\', '/').toLowerCase() : null;

export default {
  root: repo,
  cacheDir: `${here}/.vite-mut`,
  plugins: [
    {
      name: 'p2c-mutate',
      enforce: 'pre' as const,
      load(id: string) {
        if (!mut) return null;
        const clean = id.split('?')[0]!.replaceAll('\\', '/').toLowerCase();
        if (clean !== target) return null;
        const source = readFileSync(resolve(repo, mut.file), 'utf8').replaceAll('\r\n', '\n');
        return source.replace(mut.from, mut.to);
      },
    },
  ],
  test: { include: ['tools/**/*.test.mjs'], coverage: { enabled: false } },
};
```

### `fake-now.cjs`

```js
// Gói G: preloaded with NODE_OPTIONS=--require into Vitest and its forks. Shifts Node's clock so
// that `new Date()` / `Date.now()` read G_FAKE_NOW (ISO string, e.g. 2027-01-04T03:00:00Z) and
// then run on; explicit dates are untouched. Shows which unit / tool tests read the machine clock.
const Real = Date;
const target = Real.parse(process.env.G_FAKE_NOW ?? '');
if (Number.isFinite(target)) {
  const OFFSET = target - Real.now();
  class ShiftedDate extends Real {
    constructor(...args) {
      if (args.length === 0) super(Real.now() + OFFSET);
      else super(...args);
    }
    static now() {
      return Real.now() + OFFSET;
    }
  }
  globalThis.Date = ShiftedDate;
}
```

### `probe-now.test.mjs`

```js
import { it, expect } from 'vitest';
it('reads the shifted clock', () => { console.log('NOW', new Date().toISOString()); expect(new Date().getFullYear()).toBe(2027); });
```

### `vitest.now.config.mjs`

```js
export default { root: 'C:/workspace/deep-review-1-4/claude/G', cacheDir: 'C:/workspace/deep-review-1-4/claude/G/.vite-now', test: { include: ['probe-now.test.mjs'] } };
```

### `build-report.mjs`

```js
// Gói G: G.body.md + appendices (results read from the result files, probe sources verbatim) → ..\G.md
import { readFileSync, writeFileSync } from 'node:fs';

const HERE = 'C:/workspace/deep-review-1-4/claude/G';
const read = (f) => readFileSync(`${HERE}/${f}`, 'utf8').replaceAll('\r\n', '\n');
const json = (f) => JSON.parse(read(f));
const out = [read('G.body.md').trimEnd(), ''];

out.push('## Phụ lục A — Kết quả', '');
out.push('### A1. Mutation TSX qua e2e (`e2e-g-results.json`)', '');
out.push('Mỗi lượt build bản web với đúng một file đổi (plugin `load` của Vite, ra `G\\dist-mut`), phục vụ ở cổng 4193, chạy các spec liên quan (4 worker, không retry). `pageLoads` = số lần tải HTML (= số lần seed).', '');
out.push('| Lượt | Kết quả | Lần tải trang | Playwright | Tổng kết | Test đỏ (tối đa 2) |', '|---|---|---|---|---|---|');
const failedOf = (name) => {
  try {
    const rep = json(`pw-${name.split(' ')[0]}.json`);
    const bad = [];
    const walk = (x) => {
      for (const c of x.suites ?? []) walk(c);
      for (const sp of x.specs ?? []) if (!sp.ok) bad.push(`${sp.file}:${sp.line} ${sp.title}`);
    };
    walk(rep);
    return bad;
  } catch { return []; }
};
for (const [name, r] of Object.entries(json('e2e-g-results.json'))) {
  r.failed = failedOf(name);
  out.push(`| ${name} | ${r.verdict} | ${r.pageLoads ?? ''} | ${r.playwrightMs ? (r.playwrightMs / 1000).toFixed(0) + ' s' : ''} | ${(r.summary ?? []).join(', ')} | ${(r.failed ?? []).slice(0, 2).join('; ').replaceAll('|', '\\|')} |`);
}
out.push('', 'Lượt BASE chạy `--repeat-each=2` có cả project `seed-timing`. Annotation `seed ms` = 3160.7. Cột test đỏ lấy từ báo cáo JSON của Playwright (`pw-<id>.json`).', '');

const tools = json('mutate-tools-results.json');
const tally = Object.values(tools).reduce((t, r) => ({ ...t, [r.verdict]: (t[r.verdict] ?? 0) + 1 }), {});
out.push('### A2. Mutation `tools/*-core.mjs` (`mutate-tools-results.json`)', '');
out.push(`Chạy 96 test của \`tools/**/*.test.mjs\` (\`vitest.mut.config.mts\`) cho mỗi mutation. Tổng: ${JSON.stringify(tally)}.`, '');
out.push('| ID | File | Thay đổi | Kết quả | Test bắt được |', '|---|---|---|---|---|');
for (const [id, r] of Object.entries(tools)) out.push(`| ${id} | ${r.file} | ${r.what} | ${r.verdict} | ${(r.by ?? '').replaceAll('|', '\\|')} |`);
out.push('');

const cov = json('e2e-cov-result.json');
out.push('### A3. Độ phủ e2e (`e2e-cov-result.json`)', '');
out.push(`${cov.tests} file coverage (một / test có trang). Mỗi hàng: số hàm được vào ít nhất một lần / số hàm (bỏ hàm cấp module), và tên các hàm chưa bao giờ chạy kèm số dòng **trong file build không minify** (\`G\\dist-cov\\assets\\…\`, không phải dòng nguồn). Chỉ liệt kê module có hàm chưa chạy; các module khác 100 %.`, '');
out.push('| Module | Đã chạy | Hàm chưa chạy |', '|---|---|---|');
for (const r of cov.rows.filter((x) => x.missed.length)) out.push(`| \`${r.file}\` | ${r.entered}/${r.functions} | ${r.missed.join(', ')} |`);
const tot = cov.rows.reduce((a, r) => ({ f: a.f + r.functions, e: a.e + r.entered }), { f: 0, e: 0 });
out.push('', `Tổng ${cov.rows.length} module: ${tot.e}/${tot.f} hàm. Phần chỉ chạy trong exe (\`CloseGuard\`, \`close-guard\`, \`tauri-storage\`, \`StartupError\`, \`startup-error\`, một phần \`persist-queue\` / \`app-data\` / \`SettingsDataFile\`) là 0 theo thiết kế (e2e chạy bản web). Các \`value@…\` của bảng là accessor của cột chỉ gọi khi sắp theo cột đó.`, '');

out.push('### A4. CI (`flaky-scan.txt`, `runs2.json`, `merged.json`, `ci-steps.json`)', '');
const flaky = read('flaky-scan.txt').split('\n').filter((l) => /flaky|retry/.test(l));
out.push('Dòng có "flaky" / "retry" trong 110 log run PR (mỗi dòng: id run, rồi các dòng tổng kết Playwright):', '', '```');
for (const l of flaky) out.push(l.slice(0, 400));
out.push('```', '', 'Run 36724400832 (backup.spec, đỏ cả lần chạy lại) là lỗi thật lúc đó (run "failure" duy nhất), không phải flaky.', '');

out.push('### A5. Probe khác (lệnh và kết quả)', '', '```');
out.push(`> node probe-pr-core.mjs`);
out.push(`storage.rs, no build-exe label: blockers = []
Cargo.toml, no build-exe label: blockers = []
pnpm-lock.yaml, no build-exe label: blockers = []
vite.config.ts, no build-exe label: blockers = []
rust-toolchain.toml, no build-exe label: blockers = []
packages/db/CLAUDE.md: isDocsOnly=true, blockers without any CI = []
apps/desktop/CLAUDE.md: isDocsOnly=true, blockers without any CI = []
.claude/skills/review-pr/SKILL.md: isDocsOnly=true, blockers without any CI = []
CLAUDE.md: isDocsOnly=true, blockers without any CI = []

> (cwd G\\codemap-copy) node <repo>\\tools\\codemap.mjs --check
Export maps are up to date.                                  exit=0   (bản sao nguyên)
Export map out of date in: packages\\db\\CLAUDE.md            exit=1   (đổi 'src/' → 'SRC/' trong khối map)
Export map out of date in: packages\\db\\CLAUDE.md            exit=1   (thêm ghi chú tay, file 8 184 ký tự)

> node probe-hint.mjs
350   Làm task T-138 (#350), xem lại ghi chú review trước khi code
null  bắt đầu issue #350 — sửa các phát hiện của review đóng Phase 4
351   Sửa theo review notes, task #351
344   review lại thay đổi ở #344
347   Deep review Phase 1–4, gói G, theo kế hoạch (#347 đã merge)
346   merge PR #346 sau khi review PASS
12    Đã review xong #12, giờ merge giúp anh
12    review PR #12 và PR #13

> (PowerShell) $env:Path = 'C:\\p2c-probe-only-in-this-process;' + $env:Path
> & tools\\bootstrap.ps1 -CheckOnly *> $null
exit=0
probe entry still on PATH after -CheckOnly: False

> (PowerShell, G\\se-probe\\work: bare remote + clone, tools\\session-end.ps1 chép từ repo)
--- case 1: clean main, -Paths a.txt (unchanged)
Nothing to commit in -Paths (a.txt).
Switched to a new branch 'wip/d13_thinkpad-20261005-2356'
 * [new branch]      wip/d13_thinkpad-20261005-2356 -> wip/d13_thinkpad-20261005-2356
Pushed wip/d13_thinkpad-20261005-2356. Safe to switch machines.
exit=0; branch now: wip/d13_thinkpad-20261005-2356
remote branches: refs/heads/main refs/heads/wip/d13_thinkpad-20261005-2356
--- case 2 (same minute, back on main, -Paths b.txt new)
git switch -c wip/d13_thinkpad-20261005-2356 failed (exit 128) - do not leave this machine until it succeeds.
--- case 3: -Paths c.txt,d.txt (d.txt missing)
git add c.txt d.txt failed (exit 128) ...   exit=1, nothing committed, nothing pushed

> unit suite, Node clock shifted (fake-now.cjs; probe-now.test.mjs asserts year 2027 inside a Vitest worker: passed)
=== 2027-01-04T03:00:00Z   Test Files 66 passed (66) · Tests 1260 passed (1260)
=== 2026-12-31T16:59:40Z   Test Files 66 passed (66) · Tests 1260 passed (1260)
=== 2028-02-29T05:00:00Z   Test Files 66 passed (66) · Tests 1260 passed (1260)

> CI step timing, run 37259051334: pnpm verify 2.2 min · E2E 9.6 min · job 12.9 min
> merged-behind count (runs2.json + merged.json, code PRs with a green CI run since 29/09): 98 checked, 8 merged after another code merge landed
  #339 after #338 · #299 after #300 · #247 after #246 · #175 after #174 (stacked) · #171 after #170 · #169 after #168 · #141 after #140 · #133 after #132`);
out.push('```', '');

out.push('## Phụ lục B — Nguồn test tạm / probe', '');
const sources = [
  ['probe-pr-core.mjs', 'js'],
  ['probe-hint.mjs', 'js'],
  ['e2e-g.mjs', 'js'],
  ['playwright.g.config.ts', 'ts'],
  ['e2e-cov.mjs', 'js'],
  ['cov-preload.cjs', 'js'],
  ['mutate-tools.mjs', 'js'],
  ['vitest.mut.config.mts', 'ts'],
  ['fake-now.cjs', 'js'],
  ['probe-now.test.mjs', 'js'],
  ['vitest.now.config.mjs', 'js'],
  ['build-report.mjs', 'js'],
];
for (const [file, lang] of sources) out.push(`### \`${file}\``, '', '```' + lang, read(file).trimEnd(), '```', '');

out.push('### Lệnh một dòng đã chạy (không có file nguồn)', '', '```bash');
out.push(`# codemap probe (Git Bash): copy src + CLAUDE.md of the 4 packages to G/codemap-copy, then from there:
node /c/workspace/Project-2C-review/tools/codemap.mjs --check
node -e "const fs=require('fs');const f='packages/db/CLAUDE.md';let t=fs.readFileSync(f,'utf8');const s=t.indexOf('<!-- codemap:start -->');const i=t.indexOf('src/',s);t=t.slice(0,i)+'SRC/'+t.slice(i+4);fs.writeFileSync(f,t)"
node -e "const f='packages/db/CLAUDE.md';const fs=require('fs');let t=fs.readFileSync(f,'utf8');t=t+'\\n## Ghi chú\\n\\n'+'Ghi chú tay về cách dùng repository. '.repeat(90)+'\\n';fs.writeFileSync(f,t)"
# CI history (read-only)
gh run list --workflow ci.yml --limit 300 --json databaseId,conclusion,event,headSha,createdAt > runs2.json
gh pr list -R AlexH-AI/Project-2C --state merged --limit 150 --json number,mergedAt,headRefOid,mergeCommit,files > merged.json
for id in $(cat pr-run-ids.txt); do gh run view $id -R AlexH-AI/Project-2C --log | grep -E "Z +[0-9]+ (passed|flaky|failed|skipped|did not run)( \\(|$)|Z +[0-9]+ (flaky|failed)$|retry #1"; done
gh run view 37259051334 -R AlexH-AI/Project-2C --json jobs > ci-steps.json
# session-end probe (PowerShell): git init --bare remote.git; git clone; copy tools/session-end.ps1; pwsh -NoProfile -File tools/session-end.ps1 -Message probe -Paths a.txt
# clock-shifted unit suite (PowerShell, repo root):
$env:G_FAKE_NOW='2027-01-04T03:00:00Z'; $env:NODE_OPTIONS='--require C:/workspace/deep-review-1-4/claude/G/fake-now.cjs'; node node_modules/vitest/vitest.mjs run --coverage.enabled=false --reporter=dot
# e2e runs (PowerShell, G folder; node_modules is a junction to the repo's node_modules):
node e2e-g.mjs BASE --repeat-each=2;  node e2e-g.mjs N;  node e2e-g.mjs DT;  node e2e-g.mjs S1;  node e2e-cov.mjs run`);
out.push('```', '');

writeFileSync('C:/workspace/deep-review-1-4/claude/G.md', out.join('\n'));
console.log('written', out.join('\n').length, 'chars');
```

### Lệnh một dòng đã chạy (không có file nguồn)

```bash
# codemap probe (Git Bash): copy src + CLAUDE.md of the 4 packages to G/codemap-copy, then from there:
node /c/workspace/Project-2C-review/tools/codemap.mjs --check
node -e "const fs=require('fs');const f='packages/db/CLAUDE.md';let t=fs.readFileSync(f,'utf8');const s=t.indexOf('<!-- codemap:start -->');const i=t.indexOf('src/',s);t=t.slice(0,i)+'SRC/'+t.slice(i+4);fs.writeFileSync(f,t)"
node -e "const f='packages/db/CLAUDE.md';const fs=require('fs');let t=fs.readFileSync(f,'utf8');t=t+'\n## Ghi chú\n\n'+'Ghi chú tay về cách dùng repository. '.repeat(90)+'\n';fs.writeFileSync(f,t)"
# CI history (read-only)
gh run list --workflow ci.yml --limit 300 --json databaseId,conclusion,event,headSha,createdAt > runs2.json
gh pr list -R AlexH-AI/Project-2C --state merged --limit 150 --json number,mergedAt,headRefOid,mergeCommit,files > merged.json
for id in $(cat pr-run-ids.txt); do gh run view $id -R AlexH-AI/Project-2C --log | grep -E "Z +[0-9]+ (passed|flaky|failed|skipped|did not run)( \(|$)|Z +[0-9]+ (flaky|failed)$|retry #1"; done
gh run view 37259051334 -R AlexH-AI/Project-2C --json jobs > ci-steps.json
# session-end probe (PowerShell): git init --bare remote.git; git clone; copy tools/session-end.ps1; pwsh -NoProfile -File tools/session-end.ps1 -Message probe -Paths a.txt
# clock-shifted unit suite (PowerShell, repo root):
$env:G_FAKE_NOW='2027-01-04T03:00:00Z'; $env:NODE_OPTIONS='--require C:/workspace/deep-review-1-4/claude/G/fake-now.cjs'; node node_modules/vitest/vitest.mjs run --coverage.enabled=false --reporter=dot
# e2e runs (PowerShell, G folder; node_modules is a junction to the repo's node_modules):
node e2e-g.mjs BASE --repeat-each=2;  node e2e-g.mjs N;  node e2e-g.mjs DT;  node e2e-g.mjs S1;  node e2e-cov.mjs run
```
