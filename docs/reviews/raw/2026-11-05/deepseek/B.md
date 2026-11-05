XONG — deepseek gói B lượt 5, 10:29

# DeepSeek — gói B (File và Rust), deep review Phase 1–6 lượt 5

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên | `deepseek` (DeepSeek V4.1 Flash trong app WorkBuddy, qua Code review expert) |
| Gói | B — File và Rust |
| Repo | `C:\workspace\Project-2C-review`, detached |
| SHA đầu phiên | `37a80b662861d308a110d1e2b0f65ad13b91fb51` (`37a80b6`) — khớp `common\baseline.md` |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 05/11/2026 10:09 +07:00 |
| App | WorkBuddy v5.9.4 (Owner ghi ở `common\baseline.md`, "Kiểm ACL với Code review expert") |
| Expert | CodeReviewExpert (khối expert của ngữ cảnh phiên) |
| Model | `DeepSeek-V4.1-Flash` (dòng "This conversation is powered by DeepSeek-V4.1-Flash") |
| Mức suy luận | Max (Owner ghi ở `baseline.md`) |
| Context | 1M (Owner ghi ở `baseline.md`) |
| Node | `v24.20.0` — `"C:\Program Files\nodejs\node.exe" --version`; mọi lệnh chạy `node` / vitest / Playwright đặt `C:\Program Files\nodejs` lên đầu `PATH` trong chính lệnh đó |
| Chế độ quyền | Default |
| Bước 0 | Gói B hợp lệ; `deepseek\B.md` chưa có → làm mới; `deepseek\A.md` dòng đầu `XONG — deepseek gói A lượt 5, 10:38` (không `ĐANG LÀM`) → đủ điều kiện |
| Máy | Home PC `DESKTOP-KDURKJP` (như `baseline.md`) |

## 2. Bảng R

### 2.1 Bảng R1 — theo mã (4 dòng của gói B)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-138 | #897 → #915 (`ea2aa34`) | **ĐÃ SỬA** | 8 đột biến, cả 8 bị giết (bảng ở §9): CSP — `font-src` +`https://fonts.gstatic.com` (NC7), `script-src` +host (NC8), `script-src` +`'unsafe-eval' 'unsafe-inline'` (NC9), `img-src *` (NC10), thêm `frame-src *` (NC11), `identifier` → `dev.alexh.heritas` (NC13): mỗi cái 1 test đỏ, đúng ca `keeps the CSP closed…` / `keeps the identifier of the build`. Rust: bỏ `.filter(… is_file())` của `backup_names` (`storage.rs:564`) → 3 test đỏ (`a_folder_named_like_a_backup_costs_no_backup`, `a_missing_file_with_only_a_folder_named_like_a_backup_is_a_first_start`, `a_folder_named_like_a_later_backup_is_never_the_latest_backup`); bỏ `.map_err(disk_full)` ở `backup_with` (`:262`) → 1 test đỏ (`a_backup_that_finds_the_disk_full_is_reported_as_disk_full`). Gốc: `tauri-contract.test.ts` 18/18 xanh, Rust `storage::` 77/77 xanh | (a) ca CSP nay so **đủ 8 chỉ thị đã sắp** nên cả một chỉ thị mới lẫn một chỉ thị bị nới đều đỏ; thử thêm CSP có `;` cuối (phần tử `''` thứ 9) → đỏ, đúng ý. (b) Ba test thư mục phủ cả ba chỗ dùng `backup_names` (`without_file`, `prune_backups`, `latest_backup`). (c) seam `backup_with` giống `save_with`, `write_export` vẫn dùng `write_atomic` — không đổi hành vi |
| DR6-139 | #898 → #911 (`59fdfca`) | **ĐÃ SỬA** | Trả `flush()` về bản cũ (`await idle()`) → 2 test đỏ: `flush() waits for work tracked once it began… (DR6-139)` (`persist-queue.test.ts:179`) và `closing the app waits for a replace called while the close waits for a save… (DR6-139)` (`app-data.test.ts:1002`). Ca thứ hai đỏ đúng kiểu lỗi cũ: file lúc đóng là `["Hừng Đông","Sao Mai","Seed 27/09/2026"]` thay vì dữ liệu mới `["Seed 01/10/2026"]`. Biến thể gần `while (running) await running` (chỉ chờ lần ghi) → cũng 2 test đỏ. Bản ghim: `persist-queue.test.ts` 13/13, `app-data.test.ts` 79/79, e2e `save-state.spec.ts` 9/9 | Vòng lặp `while (running \|\| tracked.size > 0) await (running ?? Promise.allSettled(tracked))` (`persist-queue.ts:133`) chờ được cả việc `track` **sau** khi `flush()` bắt đầu, và lần ghi do việc đó persist. Đo lại chuỗi X → Nạp lại → lưu lỗi (§4 kịch bản 1): `flush()` từ chối `SAVE_FAILED`, lần thay từ chối `RELOAD_UNSAVED_CHANGES`, `replacing()` về `false`, file = dữ liệu cũ đủ — đúng S2-6 + K13 |
| DR6-140 | #898 → #911 (+ #933 → #946) | **ĐÃ SỬA** | Bỏ `try` trong `notify()` (`listeners.ts:9-13`) → 3 test đỏ: `run() of a command still returns when a subscriber throws… (DR6-140)` (`app-data.test.ts:419`), `notify › still calls the listeners after one that throws…`, `createPersistQueue › tells every listener when one throws… (NIT #87)`. Bản ghim: cả 3 xanh | T-332 gom vòng gọi listener của ba store về `notify` (`app-data.ts:379`, `persist-queue.ts:80`, `ai-jobs.ts:72`) — cùng một `try` mỗi listener, `report` khác nhau (`console.error` / `console.error` / `reportError`), đúng hợp đồng của Issue. Listener gỡ chính mình trong lúc gọi: `notify` duyệt thẳng `Set`, gỡ phần tử đang gọi không bỏ ai (§4 kịch bản 5) |
| DR6-147 | #898 → #911 | **ĐÃ SỬA** | e2e trên bản build web (`--project=edge --no-deps`): `another save that succeeds while "Thử lại" has the focus takes it to the heading, not the page (DR6-147)` và `the close question goes, and the window closes, once another save succeeds while it asks (DR6-147)` — cả hai **passed** trong bộ 9/9. Gỡ phần sửa: (a) listener của `SaveWarning` không đưa focus (`SaveWarning.tsx:37-39`) → ca (a) đỏ (`expect(locator).toBeFocused() failed`); (b) `askWhileFailed` không tự trả lời "retry" khi `failed` về false (`close-guard.ts:55-57`) → ca (b) đỏ (hộp ở lại, không `destroy`) | Phần của gói B là ngữ nghĩa `failed()` / `status()` của hàng đợi mà hai ca dựa vào: `failed` chỉ về `false` sau một lần ghi **thành công**, nên hộp/dải không đọc phải một lỗi đã hết. Trả file về nguyên byte sau mỗi lần gỡ (`sha256` trùng, §9) |

### 2.2 Bảng R2 — theo Issue (1 dòng của gói B)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-332 | #933 → #946 (`66019cc`) | **ĐÃ SỬA** (phần gói B) | Sáu mục của Issue: mục 5 (`readsBackAsIs`, `packages/db/src/common.ts` — gói A) và mục 6 (`listeners.ts` — gói B) là phần mã của gói này; mục 1 (`parseTime`, gói E), 2 (`SettingsBackup`, gói D), 3 (`customer.withCode`, gói D), 4 (chú thích `e2e/trash.spec.ts`, gói F). Kiểm phần B: `notify` là nơi duy nhất gọi listener của ba store (`grep` ra đúng 3 chỗ dùng + định nghĩa); `listeners.test.ts` 2/2, `app-data.test.ts` 79/79, `persist-queue.test.ts` 13/13, `ai-jobs.test.ts` 14/14 xanh. Gỡ phần sửa: trả `AiJobs.changed` về vòng `for` trần → `ai-jobs.test.ts` 1 đỏ (`reports a listener that throws, still telling the others… (review of PR 911)`). Chữ trên màn không đổi (`customer.withCode` = `'{name} ({code})'`, hai chỗ dùng `trash-view.ts:227`, `team-view.ts:133`); `codemap:check` xanh trong `pnpm verify` ở `baseline.md` | Mục 1 / 3 / 4 / 5 thuộc gói E / D / F / A — chỉ đọc để đối chiếu, không chấm. `parseTime` nay hỏi "trống" bằng `normalizeText` (`appointment-form.ts:92`) như `readCaseSize`; `readsBackAsIs` dùng ở `backup.ts:197` và `isLabel` |

## 3. Phạm vi đã đọc

**Diff `2e51e25..37a80b6` của gói B** (`git diff --numstat`, file AI của gói C đếm riêng): 8 file của B, **+232 / −23** — SP `storage.rs` +85/−3, `listeners.ts` mới +15, `persist-queue.ts` +8/−10, `app-data.ts` +5/−2 (= +113/−15, 4 file); test `app-data.test.ts` +46, `listeners.test.ts` +28, `persist-queue.test.ts` +25, `tauri-contract.test.ts` +20/−8 (= +119/−8, 4 file). Trùng `baseline.md` / §L5.3. Đọc từng hunk. (`ai-analysis.test.ts` +50, `ai-analysis.ts` +15/−1, `ai-jobs.test.ts` +52/−3, `ai-jobs.ts` +34/−13 thuộc gói C, không chấm.)

**Đọc trọn ở `37a80b6`:**

- Rust: `src/storage.rs` 2 207 dòng (mã `:1-682`, test `:683-2207` — đọc mã trọn, đọc tên 77 test + các test mới của #915), `src/lib.rs` 205 (11 lệnh, `data_dir`, `blocking`, `header`), `src/ai.rs` 1–578 (mã; test chỉ đọc tên), `src/main.rs` 6, `build.rs` 3, `Cargo.toml` 37, `capabilities/default.json` 12, `tauri.conf.json` 31.
- `apps/desktop/src/data/` trừ file AI: `app-data.ts` 496 (trọn), `persist-queue.ts` 142 (trọn), `listeners.ts` 15 (trọn), `tauri-storage.ts` 91 (trọn), `tables.ts` 72, `today.ts` 58, `demo-snapshot.ts` 45, `AppDataContext.tsx` 64.
- Test: `persist-queue.test.ts` 362 (trọn), `listeners.test.ts` 28 (trọn), `tauri-contract.test.ts` 382 (trọn), `tauri-storage.test.ts` 96 (trọn), `app-data.test.ts` 1 563 (đọc các nhóm `openAppData`, `replacing the data (S-2)`, `purgeTrash`), `tables.test.ts`, `today.test.ts`, `demo-snapshot.test.ts`, `ai-jobs.test.ts` (phần listener).
- Chỗ nối gói khác: `shell/{close-guard.ts,CloseGuard.tsx,SaveWarning.tsx,block-reload.ts,startup-error.ts,StartupError.tsx}`, `main.tsx`, `i18n/vi.ts` (`storage.*`, `saveState.*`, `close.*`, `customer.withCode`), `packages/db/src/{common,backup,customers}.ts` (đọc phần `readsBackAsIs`, `valueOf`), `packages/domain/src/period.ts` (`localFileStamp`), `e2e/save-state.spec.ts` (trọn).
- Tài liệu: `CLAUDE.md` gốc + `apps/desktop/CLAUDE.md`, `common\{prompt-deepseek.md (đủ), plan.md (§3, §4, §L5.1–§L5.11), known.md (đủ), fixes.md (#897 / #915, #898 / #911, #933 / #946 + nhóm RESOLVED), baseline.md (đủ)}`, `docs/reviews/2026-10-31-…-luot-4-tong-hop.md` §6.2, §6.4, §7, §8.2, báo cáo gốc `docs/reviews/raw/2026-10-31/{deepseek,claude,codex}/B.md`, ADR-0016 (qua doc của `storage.rs`), spec Phase 6 §4.1 (S2-1…S2-6, qua `known.md` K13 / K35), `docs/design/phase-6-hoan-thien.md` §4.1.

**Không đọc:** mọi thư mục bị cấm (quy tắc riêng 2); `~/.workbuddy*`; log phiên.

## 4. Kịch bản mới đã thử

Probe ở `…-r5\deepseek\B\` (`probe-queue.mjs`, `probe-queue2.mjs`, `perf-queue.mjs`, `rustprobe/rename_probe.rs`, `mut/`). Không kịch bản nào trùng báo cáo lượt 1–4 (đã đọc §4 của ba báo cáo B lượt 4 và §4 của báo cáo gói A lượt 5 của chính tôi).

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | X → **Nạp lại xác nhận trước khi lần lưu đang chạy xong** → lần lưu đó **lỗi** `READ_ONLY` (chuỗi ba bước chồng nhau: đóng app, thay dữ liệu, lưu lỗi) | `flush()` từ chối `SAVE_FAILED`; `reloadDemoData` từ chối `RELOAD_UNSAVED_CHANGES`; `replacing()` = `false`; `saves.failed()` = `true`; file = `["Seed 27/09/2026","Sao Mai"]` (dữ liệu cũ đủ, thay đổi lỗi không lọt vào); `events` = `["save","save","save"]` (không có lần ghi thừa). Đúng S2-6 + K13: hộp hỏi hiện, không đóng giữa lúc thay | — |
| 2 | **Hai lần Nạp lại xếp hàng** cùng lúc, X trong lúc cả hai đang chờ backup; backup bị giữ | `flush()` chỉ xong sau **cả hai** (`closed` chỉ sau khi thả backup); `replacing()` = `false`; `backups-seen` = `["Seed 27/09/2026\|Sao Mai","Seed 02/10/2026"]` — backup của lần thứ hai đã thấy dữ liệu của lần thứ nhất, tức hai lần thay chạy đúng thứ tự gọi. Hai lần đều neo cùng ngày (`reloadDemoData` đọc `today()` **sau** backup, DR-30), nên file cuối không phân biệt được hai lần — chỉ số thứ tự trên nói lên điều đó | — |
| 3 | **Backup của lần thay lỗi `DISK_FULL`** → lần thay bị từ chối → ghi tiếp một lệnh khác | `reloadDemoData` từ chối `DISK_FULL`; `replacing()` = `false` (bộ đếm không kẹt); ghi sau đó vào được: file = `["Seed 27/09/2026","Sao Mai","Sau lỗi"]` | — |
| 4 | Lần lưu cuối **lỗi** rồi **X** → `flush()` ghi lại bản lỗi → **Nạp lại chen vào giữa** | `flush()` = `closed`; lần thay = `reloaded:27/09/2026`; file cuối = dữ liệu mới; **backup của lần thay giữ bản đã ghi lại** `["Seed 27/09/2026","Sao Mai","Hừng Đông"]` — tức bản lỗi được ghi lại **trước** khi backup, nên backup không thiếu thay đổi (S2-1) | — |
| 5 | Listener **gỡ chính mình** trong lúc được gọi; listener **gỡ một listener sau** nó; listener **thêm** một listener trong lúc được gọi (`AppData.subscribe`) | Tự gỡ: `["self"]` — gọi đúng một lần, `run()` vẫn trả kết quả, team đã ghi. Gỡ listener sau: `["first"]` — listener sau **không** được gọi (duyệt thẳng `Set`, đúng như `listeners.ts` ghi). Thêm trong lúc gọi: `["outer","added"]` — listener mới được gọi ngay trong cùng lượt (hành vi của `Set`, không phải lỗi: `useSyncExternalStore` đọc lại sau khi subscribe) | — |
| 6 | Listener của **hàng đợi lưu** gọi `persist()` trong lúc được báo (tái nhập) | `started` = `["first","from-listener"]`; đĩa = `from-listener`; `saving` = `false` — không có hai lần ghi song song, không kẹt | — |
| 7 | **Dọn sạch Thùng rác** xếp sau một lần lưu bị giữ, X trong lúc đó | `purgeTrash` xong; `flush()` = `closed`; `replacing()` = `false`; file = `["Seed 27/09/2026","Sao Mai","Hừng Đông"]` — lần dọn chờ lần lưu, đóng app chờ cả hai | — |
| 8 | **Đổi tên `Project2C-data\` khi app đang chạy** (khóa `project2c.lock` đang mở `share_mode(0)`), rồi thử mở khóa thứ hai trong thư mục vừa dựng lại | `RENAME=ERR kind=PermissionDenied raw=Some(5)`; thư mục cũ còn, thư mục mới không có; `SECOND-LOCK=ERR … being used by another process (os error 32)`. Không có cửa cho app thứ hai chạy trên một thư mục khác cùng lúc | — |
| 9 | Thư mục mang tên backup trong `backups\` (ba test của #915 chạy trên đĩa thật) | 77/77 test `storage::` xanh, gồm ba test thư mục; bỏ bộ lọc `is_file()` thì cả ba đỏ (kịch bản 8 của §2.1) | — |
| 10 | Bộ `save-state.spec.ts` (9 ca) trên bản build web sau khi trả mọi file về nguyên byte | **9 passed (28,9 s)**, không flaky | — |

## 5. Phát hiện mới

```
ID: DSR5-B1
Mức: Nit
Trục: B
Vị trí: apps/desktop/src/data/app-data.ts:282 (37a80b6)
Tình trạng: CONFIRMED
Liên quan: T-321 (#898 → #911) · có từ trước, lượt 1–4 bỏ sót
Kịch bản: —
Mô tả: Nhánh `if (!storage) return;` ở đầu hàm ghi của hàng đợi lưu không bao giờ chạy: `persist` chỉ được nối khi có `storage` (`app-data.ts:311-316` truyền `persist: storage ? … : undefined`, `:349` chặn bằng `storage && !migrated`), nên ở chế độ web hàng đợi không có snapshot nào để ghi.
Tái hiện / bằng chứng: `node node_modules/vitest/vitest.mjs run apps/desktop/src/data --coverage …` (lệnh đủ ở §9) → `app-data.ts` nhánh `:282` **0 / 262** lần; `coverage-final.json` ghi `branchMap` `if` tại dòng 282 với `counts=[0,262]`. Đọc lại ba chỗ gọi `saves.persist` ở `app-data.ts`: `:314` (trong `persist` của `openDatabase`, chỉ có khi `storage`), `:349` (`storage && !migrated`), và `createPersistQueue` chỉ gọi `persist` từ `drain` (do `persist()` khởi động).
Ảnh hưởng: không có hậu quả cho người dùng; là nhánh phòng thủ cho một bất biến kiểu mà TypeScript đã giữ. Đọc code phải suy thêm một bước để biết chế độ web không ghi gì.
Đề xuất: bỏ nhánh (một dòng), hoặc đổi thành comment nói rõ "chế độ web không nối `persist`". Cỡ ≤ 3 dòng SP.
```

Không có phát hiện Critical / High / Medium / Low mới trong gói này. Tỉ lệ PLAUSIBLE: **0/1**.

**Đã cố tìm mà không thấy** (ghi để phiên tổng hợp biết đã thử): `flush()` có thể treo nếu một việc `track` không bao giờ xong — không có đường nào trong app tạo ra việc đó (`backUp` → `saves.idle()` + `storage.backup()`, `openNew`, `openFrom` đều hữu hạn; Rust `db_backup` chỉ đọc/ghi file cục bộ); `flush()` chờ một lần thay bắt đầu **sau** khi nó xong — khe chỉ còn một microtask giữa `flush()` và `destroy()` (`close-guard.ts:27-35`), không có sự kiện người dùng nào chen vào được, và file vẫn là dữ liệu cũ đủ nếu có; `notify` gọi listener được thêm trong cùng lượt — hành vi của `Set`, vô hại với `useSyncExternalStore`.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Việc đã làm | Trên đâu | Số | ID |
|---|---|---|---|
| `node node_modules/typescript/bin/tsc -p apps/desktop/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` | toàn app, gồm 8 file `src/data` của gói | **0 lỗi**, exit 0 | — |
| `node node_modules/dependency-cruiser/bin/dependency-cruiser.mjs apps packages` | `apps`, `packages` | **0 vi phạm**, 354 module / 1 582 phụ thuộc (trùng `baseline.md`) | — |
| `node tools/size-report.mjs` | gói B | SP **2 457** (+31 so lượt 4), test **5 600** (+178), sinh 0, **21 file** (+2) — trùng `baseline.md` / §L5.3 | — |
| Đếm nhánh không chạy được bằng coverage (`--coverage.reporter=json` + `uncovered.mjs`) | `apps/desktop/src/data/**` | 6 nhánh chưa phủ: `app-data.ts:282` (**nhánh chết**, DSR5-B1), `:324`, `:487`; `ai-analysis.ts:323` (gói C); hai default-arg chỉ dùng ở production (`demo-snapshot.ts:20`, `tauri-storage.ts:63`) | DSR5-B1 |
| Nơi dùng `notify` (T-332 gỡ chép) | `src/data` | đúng 3 chỗ (`app-data.ts:379`, `persist-queue.ts:80`, `ai-jobs.ts:72`) + định nghĩa; không còn vòng `for` tự viết nào | — |
| Code lặp trong `storage.rs` sau #915 | `src-tauri` | một `entries`, một `remove_interrupted`, một `refuses`, một `write_atomic_with`; seam `backup_with` dùng lại `copy_to_backups` + `write_atomic_with`, không chép thân hàm | — |
| Export thừa của gói | 8 file `src/data` | `STALE_PAGE` cố ý không export sang TS (chỉ Rust dùng); `DISK_FULL` / `READ_ONLY` / `FOLDER_READ_ONLY` / `FILE_IN_USE` / `ACCESS_DENIED` / `ALREADY_OPEN` đều có chỗ dùng sản phẩm (`startup-error.ts`, `SaveWarning.tsx`) | — |

### 6.2 Hiệu năng

Số trên exe lấy từ `common\baseline.md` (probe `e2e/perf`, cùng máy, exe `37a80b6`); không đo lại trên exe vì gói này không đổi đường nóng nào và bên khác có thể đang đo. Số đo thêm của tôi đo trong Node `v24.20.0`, máy rảnh (không exe, không Playwright), trên hàng đợi lưu thật của repo.

| Đo | Dữ liệu | Số | Ngưỡng / mốc | Kết luận |
|---|---|---|---|---|
| `app.open-data` | dữ liệu tải, exe | 330 ms | ≤ 600 ms; mốc sau #656 387 ms | đạt (baseline) |
| `db.save` | dữ liệu tải, 15 lần | 150 ms | ≤ 400 ms; mốc 151 ms | đạt (baseline) |
| `backup.read` / `backup.import` / `backup.export` | dữ liệu tải | 983 / 50 / 438 ms | ≤ 2 000 / 500 / 1 000 ms | đạt (baseline) |
| Mở lại trên dữ liệu tải (LCP) | dữ liệu tải | 710 ms | G7 617 ms; luật nhiễu > 740 ms | không xấu hơn (baseline) |
| **`flush()` trên hàng đợi rảnh** (vòng lặp mới của T-321) | 200 lần | **0,000 ms** trung vị | luật nhiễu 10 ms | không thêm chi phí |
| **`flush()` + 1 việc `track` đã xong** (nhánh `Promise.allSettled`) | 200 lần | **0,001 ms** trung vị | — | không đáng kể |
| **`notify()` 10 / 1 000 listener** (hàm chung của T-332) | 200 lần | **0,3 µs / 5,6 µs** trung vị | — | tuyến tính, không đáng kể |
| `persist` 1 KB + `flush()` | 200 lần | 0,001 ms trung vị | — | — |

Không có phát hiện P. Ghi chú: `apps/desktop/dist` đã bị `webServer` của Playwright dựng lại (có `VITE_DEMO_ANCHOR`) trong lúc chạy e2e, nên `size-report` đọc ra JS/CSS 2 366 444 B / gzip 699 768 B thay vì số của `baseline.md`; cuối phiên tôi dựng lại `pnpm --filter @p2c/desktop build:web` không đặt biến riêng, số trở lại đúng mốc (`index.js` 892 184 / 264 291; tổng JS / CSS 2 366 456 / 699 761) — chênh lệch trước đó là của bản dựng, không phải của code.

## 7. Đếm mức × trục

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | **1** |

1 phát hiện, CONFIRMED (0 PLAUSIBLE). Bảng R: **4 dòng R1 + 1 dòng R2, tất cả ĐÃ SỬA**, 0 SỬA MỘT PHẦN / 0 CHƯA SỬA / 0 HỒI QUY. Không có Medium trở lên, khớp lượt 4 (gói B: 0 Medium).

## 8. Đã xét, không thấy

- **R** (ngoài 5 dòng R): **14 đột biến** (bảng §9), **cả 14 bị giết**, mỗi cái đỏ đúng ca của nó; không đột biến nào sống. Ba biến thể gần của `flush()` (bản cũ `await idle()`, `while (running)`, bản ghim) phân biệt được bằng test. `storage.rs` 77/77 test xanh trước và sau mỗi lần gỡ.
- **E**: (a) đổi tên `Project2C-data\` khi app chạy — Windows từ chối (kịch bản 8), nên không có cửa cho hai app trên hai thư mục; (b) `project2c.db` bị đổi tên giữa phiên — lần lưu sau tạo file mới, dữ liệu trong RAM vẫn được ghi, không mất; (c) `backups\` / `exports\` bị xóa giữa phiên — `write_atomic_with` dựng lại bằng `create_dir_all`; (d) đóng app khi một lần thay đang chờ **một lần thay khác** (kịch bản 2) — chờ đủ cả hai; (e) lần lưu lỗi rồi X rồi Nạp lại (kịch bản 1, 4) — không có nhánh nào để file thiếu thay đổi đã lưu. `next_seq` bão hòa ở `u64::MAX` vẫn cần file đặt tay — như báo cáo lượt 4 đã ghi, không đáng báo.
- **C**: CSP ở `tauri.conf.json:24` khớp nguyên văn 8 chỉ thị của ca `keeps the CSP closed`; `identifier` = `dev.alexh.project2c` (K39); `productName` / `title` / `description` / `<title>` cùng một tên; `capabilities/default.json` đúng 4 quyền (K37 `core:window:allow-set-title`, `destroy` cho `CloseGuard`); `crate-type = ["rlib"]` (DR6-13). `storage.rs`'s sáu mã lỗi khớp nguyên văn `tauri-storage.ts` (ca `matches the error messages Rust sends`).
- **D**: `save` ghi nguyên tử (`.tmp` + `flush` + `rename`), lỗi để lại file cũ nguyên byte (test `a_save_that_fails_leaves_no_tmp_behind`); `backup` dọn bản cũ **trước** khi ghi bản mới (DR-57, có chủ ý); `backups\` giữ 10 bản theo **thứ tự ghi**, không theo đồng hồ (test `a_clock_going_back_and_forth_…`); `open` không ghi gì, `openFrom` ghi một lần; `backup_names` chỉ lấy file nên thư mục không còn chen vào số bản giữ lại.
- **G**: `ai.rs` chỉ đọc phần mã (không đổi ở đợt này); `reveals` / `mask` / `readings` 4 cách đọc vẫn là chỗ chặn key lọt ra webview — không thấy đường mới. G5 / prompt thuộc gói C.
- **S**: đầu vào từ webview không thành đường dẫn: `export_write` chỉ nhận tên qua `is_export_name` (chỉ `[A-Za-z0-9._-]`, không bắt đầu bằng `.`, phải có đuôi `.p2cbackup` / `.xlsx`), `open_folder` chỉ nhận `exports` / `backups`, `db_save` chỉ ghi đúng `project2c.db`; `page` là chuỗi tuỳ ý nhưng chỉ để so, không thành đường dẫn. Không thấy đường mới.
- **P**: xem §6.2 — không dòng nào vượt ngưỡng; vòng lặp `flush()` và `notify` mới có chi phí dưới 1 µs.
- **B**: xem §6.1 — 0 unused, 0 vi phạm phụ thuộc, một nhánh chết (DSR5-B1).
- **T**: test của gói dày (Rust 77 của `storage::` trong 120 của lib; 112 test của 4 file test thuộc B, 220 của cả thư mục `src/data`; e2e `save-state` 9). Đã thử 14 đột biến, không cái nào sống; ba ca mới của #915 giữ đúng ba chỗ dùng `backup_names`; ca CSP so đủ chuỗi nên giữ được cả chỉ thị mới.
- **A**: gói này không có màn. Dải lưu `role="alert"`, hộp đóng app là `Dialog` có bẫy focus — thuộc gói D, chỉ đọc để đối chiếu `failed()`.

## 9. Phụ lục

**Nguồn probe / đột biến** (đều trong `C:\workspace\deep-review-1-6-r5\deepseek\B\`, repo không giữ file nào):

- `mut/apply.mjs` — thay một chuỗi (find / replace base64) trong một file của repo; sau mỗi lần chạy, chép bản gốc trở lại và so `sha256`.
- `mut/*.orig` — bản chép trước khi sửa của `tauri.conf.json`, `storage.rs`, `persist-queue.ts`, `listeners.ts`, `ai-jobs.ts`, `SaveWarning.tsx`, `close-guard.ts`.
- `probe-queue.mjs`, `probe-queue2.mjs` — `openAppData` + storage trong bộ nhớ (kịch bản 1–7), qua `tools/ts-hooks.mjs`.
- `perf-queue.mjs` — số của §6.2.
- `rustprobe/rename_probe.rs` — chương trình Rust rời (std only): mở `project2c.lock` bằng `share_mode(0)` rồi `fs::rename` thư mục, rồi thử mở khóa thứ hai (kịch bản 8). Dựng bằng `rustc -O`, không thêm crate.
- `cov/`, `uncovered.mjs` — coverage JSON của `apps/desktop/src/data` và danh sách nhánh chưa phủ.
- `pw/` — output của Playwright (`--output`), gồm ảnh và trace của hai ca đỏ khi gỡ phần sửa DR6-147.

**Đột biến** (mỗi cái: áp → chạy test → trả bản gốc → `sha256` trùng):

| Mã | Đột biến | Test đỏ |
|---|---|---|
| NC7 | `font-src 'self' data: https://fonts.gstatic.com` | 1 — `keeps the CSP closed…` |
| NC8 | `script-src … https://cdn.example.com` | 1 — như trên |
| NC9 | `script-src … 'unsafe-eval' 'unsafe-inline'` | 1 — như trên |
| NC10 | `img-src *` | 1 — như trên |
| NC11 | thêm `frame-src *` | 1 — như trên |
| NC13 | `identifier` → `dev.alexh.heritas` | 1 — `keeps the identifier of the build` |
| D4 | bỏ `.filter(… is_file())` của `backup_names` | 3 — ba test thư mục của #915 (74 passed / 3 failed) |
| DF2 | bỏ `.map_err(disk_full)` ở `backup_with` | 1 — `a_backup_that_finds_the_disk_full_is_reported_as_disk_full` (76 / 1) |
| M139a | `flush()` về bản cũ (`await idle()`) | 2 — ca DR6-139 của `persist-queue` và `app-data` (90 / 2) |
| M139b | `while (running) await running` | 2 — như trên |
| M140 | `notify()` không bọc `try` từng listener | 3 — `app-data` DR6-140, `listeners`, `persist-queue` NIT #87 (91 / 3) |
| T332 | `AiJobs.changed` gọi listener trực tiếp (bỏ `notify`) | 1 — `reports a listener that throws… (review of PR 911)` |
| 147a | listener của `SaveWarning` không đưa focus về tiêu đề | 1 — ca e2e DR6-147 (a) |
| 147b | `askWhileFailed` không tự trả lời "retry" khi `failed` về false | 1 — ca e2e DR6-147 (b) |

`sha256` trước = sau cho mọi file đã vá: `tauri.conf.json` `043ab45c…401d60`, `storage.rs` `b450da17…e052b`, `persist-queue.ts`, `listeners.ts`, `ai-jobs.ts`, `SaveWarning.tsx`, `close-guard.ts` (mỗi file so lại sau lần cuối).

**Lệnh chính** (đều đặt `PATH` trong cùng lệnh):

```text
"C:\Program Files\nodejs\node.exe" --version                      → v24.20.0
node node_modules/vitest/vitest.mjs run apps/desktop/src/data/{persist-queue,listeners,app-data,tauri-contract}.test.ts
                                                                  → 4 file, 112 test xanh
cargo test --manifest-path apps/desktop/src-tauri/Cargo.toml --lib --locked storage::
                                                                  → 77 passed; 0 failed
node node_modules/@playwright/test/cli.js test e2e/save-state.spec.ts --project=edge --no-deps --output …\B\pw
                                                                  → 9 passed (28,9 s)
node node_modules/typescript/bin/tsc -p apps/desktop/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters → exit 0
node node_modules/dependency-cruiser/bin/dependency-cruiser.mjs apps packages → no violations (354 / 1 582)
node node_modules/vitest/vitest.mjs run apps/desktop/src/data --coverage --coverage.reporter=json --coverage.reportsDirectory=…\B\cov …
```

**`git status --short` cuối phiên:** rỗng (sau khi dựng lại `dist`; `dist` bị ignore nên không hiện).

**Giờ xong:** 05/11/2026 10:29 +07:00.
