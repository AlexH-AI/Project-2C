XONG — deepseek gói B lượt 4, 2026-10-30 19:38 (+07:00)

# Deep review Phase 1–6, lượt 4 — gói B (File và Rust) — deepseek

## 1. Phiên

- Bên: **deepseek** · Gói: **B — File và Rust** (`apps/desktop/src-tauri/**`, `apps/desktop/src/data/**` trừ file AI).
- SHA đầu phiên: `2e51e25eb0125f56d3d938b97ef18d6873dae076` (`git rev-parse HEAD`, khớp `common\baseline.md`).
- `git status --short` đầu phiên: **rỗng**.
- Giờ bắt đầu: 2026-10-30 19:25 (+07:00). Máy: `DESKTOP-KDURKJP` (Home PC).
- Công cụ / model: app WorkBuddy **v5.9.3**, model **DeepSeek-V4.1-Flash**, context window 1M, Thinking effort **Max** (`common\baseline.md`, bước 4); Expert đang chọn: Code review expert (`ex_uZzSAScSy7FZ`), cùng model. Phiên chạy qua Expert; Owner cho phép dùng agent phụ (quy tắc riêng 4) nhưng phiên này **không giao việc cho agent nào** — mọi lệnh và mọi phép đọc đều do agent chính chạy.
- Gói này kiểm R1: DR6-120, DR6-67, CL3-B2; R2: T-293, T-294, T-295, T-306, T-308, T-310 (`known.md` phần 5 thêm T-310 cho B, theo `baseline.md`).

## 2. Bảng R

### 2.1 Bảng R1 — theo mã

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-120 (L) | #726 → #750, #752 → #764 (+ #782 → #807, #783 → #817) | **ĐÃ SỬA** | `storage.rs`: `refused()` (:288–298) đổi `PermissionDenied` của lần lưu thành `FOLDER_READ_ONLY` (hỏi `add_refused`) hay `READ_ONLY` (hỏi `replace_refused`); `open()` hỏi `add_refused(dir) \|\| replace_refused(db)` sau bước kiểm header (:170). Test: `a_save_the_access_list_refuses_is_reported_as_read_only`, `a_save_after_the_file_turned_read_only_is_reported_as_read_only`, `a_save_the_data_folder_refuses_is_reported_as_folder_read_only`, `open_reports_a_data_folder_that_lets_no_new_file_in_as_access_denied`. **M1** (`refused()` trả nguyên lỗi) → 3 test đỏ; **M2** (bỏ `add_refused` khỏi `open`) → 1 test đỏ. | File do chương trình khác giữ vẫn giữ lỗi của Windows (`a_save_a_program_holding_the_file_refuses_keeps_the_error_of_windows`, share 0 và 1\|2); ACL chỉ cấm ghi vào file không chặn app (`an_access_list_that_only_refuses_writing_into_the_file_does_not_stop_the_app`). Đo: hai lần hỏi quyền thêm **586,7 µs** mỗi lần mở (mục 6). |
| DR6-67 (N) | #774 → #799, #775 → #801, #777 → #812, #782 → #807, #790 → #845 | **ĐÃ SỬA** | `storage.rs`: `entries()` (:537) thay cả bốn chỗ `read_dir(...).into_iter().flatten().flatten()`; `rg "flatten\(\)" apps/desktop/src-tauri/src/storage.rs` → **0 dòng**; `remove_interrupted(folder, left)` (:410) một vòng cho exports và backups; `refuses()` (:229) một helper cho `add_refused` / `delete_refused`; `SHARING_VIOLATION` / `LOCK_VIOLATION` thay số 32 / 33 (:48–52). `entries()` có 3 chỗ gọi (:411, :524, :547) + hai hàm `is_interrupted_*`. | Refactor thuần: không test nào đỏ được khi "gỡ phần sửa", nên bước 2 của bảng R là phép đếm + 116 test Rust xanh. Phần còn lặp là cố ý (một helper, nhiều chỗ gọi). |
| CL3-B2 (N) | #783 → #817 | **ĐÃ SỬA** | `persist-queue.ts`: `flush()` ghi lại bản đã lỗi (`if (!running && lost) persist(lost)`, :134) và ném `SAVE_FAILED` khi vẫn lỗi; ba câu từ chối D7 / Nạp lại / Nhập backup chỉ tới nút (D). **M6** (bỏ nhánh ghi lại) → **5 test đỏ**, gồm `flush() writes the latest snapshot again after a failed write, and only once` và `flush() leaves a newer running write last on disk…`. e2e `e2e/save-state.spec.ts` ở `2e51e25`: **5 passed (34,8 s)** — có ca "Thử lại on the save warning saves at once; Nạp lại, refused before, then runs". | Sau một lần Thử lại vẫn lỗi, `status().error` theo nguyên nhân của lần mới (`keeps what a failed write threw…`). Nửa giao diện (nút, focus) thuộc D. |

### 2.2 Bảng R2 — theo Issue

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-293 | #782 → #807 | **ĐÃ SỬA** | `backups\` không liệt kê được: `backup_names` / `next_seq` trả `io::Result` (:523, :546), `entries()` (:537) chỉ coi `NotFound` là rỗng; `without_file` (:179) báo `… is missing and backups cannot be read: …` thay vì lần mở đầu. Test `a_backups_folder_the_app_cannot_list_is_an_error_never_an_empty_one`, `a_missing_file_with_a_backups_folder_it_cannot_list_is_an_error_not_a_first_start`. **M3** (`entries()` nuốt mọi lỗi như code cũ) → 2 test đỏ; **M4** (`unwrap_or_default`) → 2 test đỏ. Tiêu đề cửa sổ: `capabilities/default.json` thêm đúng một quyền `core:window:allow-set-title`; `useScreenFocus` gọi `appWindow.setTitle` (D). | `find_copy` / `prune_backups` / `latest_backup` giữ cách "cố gắng" (đọc không được thì không có bản để dùng lại / dọn / hiện) — đúng như thân PR ghi. Ca thư mục cấm `(WD)` lúc mở đầu và giữa phiên có test riêng; file hỏng / file mất trong thư mục đó giữ lỗi của chính chúng. |
| T-294 | #783 → #817, #819 | **ĐÃ SỬA** | `persist-queue.ts`: một store `status()` `{saving, failed, error, lastSave}` (:34–43, :71–85), `track(work)` (:118) tính lần thay là đang lưu, `flush()` chờ nó (:129–137); listener lỗi được bọc `try` và báo qua `console.error` (:78–84). `app-data.ts`: `inTurn` gọi `saves.track(turn)` (:395). **M5** (bỏ `track`) → 2 test đỏ: `closing the app at any step of a replace waits for it… (S2-6)` và `counts a replace as saving until the new data is saved`. e2e 5/5 (hai ca đóng app lúc đang lưu / đang Nạp lại). | Lần thay bị từ chối thôi tính là đang lưu (`stops counting a refused replace as saving`); `flush()` khi lần thay đã lỗi vẫn ghi lại bản đã lỗi trước đó (`stops counting tracked work that fails; flush() then writes a snapshot that failed again`). Hai điểm mockup không vẽ: ACCEPTED (review #817), không báo lại. |
| T-295 | #784 → #825 | **ĐÃ SỬA** | `openDatabase({check})` chạy `check` **sau** `assertSupported` và **trước** `migrate` (`packages/db/src/database.ts:69–72`); `openAppData` truyền `refuseDamaged` (:358). `openFrom` chỉ lưu khi `!migrated` (:345–349); mốc `p2c:db-save` giữ tối đa 50 (:287–290). **M7** (`openFrom` lưu lại sau migration) → 1 test đỏ (`saves data that migrates as it opens once`); **M8** (bỏ `refuseDamaged`) → 3 test đỏ (DR-51, DR6-06, DR6-73). | File của bản mới hơn bị từ chối **trước** bước kiểm (`refuses a file made by a newer app: no seeding, no migrating, nothing saved`). Hộp 10c / một state thông báo thuộc E; ChatGPT web thuộc C. |
| T-306 | #850 → #857 | **ĐÃ SỬA** (tài liệu) | `phase-6-hoan-thien.md:67` (S2-6) có vế "File sau đó là dữ liệu mới đủ (lần thay bị từ chối hay lỗi: dữ liệu cũ đủ)" — khớp `app-data.test.ts` (ca S2-6 kiểm file ở mọi bước là dữ liệu mới); `nghiem-thu-v1.md:375–377` có NT-DB-23…25, câu dải / hộp đóng app đúng khoá `storage.saveFolderReadOnly`, `storage.saveReadOnly`, `close.unsavedBodyFolderReadOnly`, `close.unsavedBodyReadOnly`, lệnh `icacls` để trong dấu nháy. | Chỉ tài liệu; phía app do T-293 / T-294 làm. Ba dòng NT mới mô tả đúng chuỗi Thử lại mà e2e `save-state.spec.ts` chạy. |
| T-308 | #852 → #861 | **ĐÃ SỬA** | `tauri.conf.json`: `productName` = `title` = "Heritas L-CRM"; `Cargo.toml` `description` = "Heritas L-CRM desktop app"; `identifier` giữ `dev.alexh.project2c` (K39); CSP **không đổi** (diff `119e2e4..2e51e25` không có dòng CSP; `connect-src 'self' ipc: http://ipc.localhost`); `bundle.icon` vẫn 4 file đã khai; bốn câu báo lỗi còn "Project-2C" đúng K39 (`vi.ts:1077, 1146, 1147, 1149`). **M9** (`productName` → "Heritas X-CRM") và **M10** (`title` → "Project-2C") → ca `names the app as the sidebar does…` đỏ. | `icon.png` trong `icons/` không khai trong `bundle.icon` — như trước PR, không phải hồi quy. Font / logo / mockup thuộc D. |
| T-310 | #865 → #871 | **ĐÃ SỬA** (phần B) | `tauri-contract.test.ts:324–331` "names the app as the sidebar does: the exe, its window, the page and the crate" đọc `t('app.title')` rồi so `productName`, `title` cửa sổ, `<title>`, `description`; M9 / M10 làm ca này đỏ (17 test của file, 1 đỏ). | Phần còn của T-310 (HEADING, stageBadge, `lang`, bảng token, PACKAGES) thuộc D / E / F. |

## 3. Phạm vi đã đọc

Rust (`apps/desktop/src-tauri/`, 2 426 dòng SP theo `baseline.md`):

- `src/storage.rs` **đọc trọn 2 125 dòng** (mã :1–667, test :668–2125).
- `src/lib.rs` 205 dòng (11 lệnh, `data_dir`, `blocking`, header), `src/main.rs` 6, `build.rs` 3.
- `src/ai.rs`: đọc `reveals` (:289), `mask` (:298), `readings` (:345), `Escapes` / `unescape` (:365–400), `clean_key` (:450) và test `odd_keys` (:1385) — phần T-293 sửa; không đọc lại toàn bộ 2 052 dòng (thuộc C).
- `capabilities/default.json` (12), `tauri.conf.json` (31), `Cargo.toml` (34), `icons/` (5 file, chỉ so cỡ / danh sách khai).

`apps/desktop/src/data/` trừ file AI:

- `app-data.ts` 493 (đọc trọn), `persist-queue.ts` 144 (trọn), `tauri-storage.ts` 91 (trọn), `tables.ts` 72, `today.ts` 58, `demo-snapshot.ts` 45, `AppDataContext.tsx` 64.
- Test: `persist-queue.test.ts` 337 (trọn), `tauri-contract.test.ts` 370 (trọn), `tauri-storage.test.ts` 96 (trọn), `app-data.test.ts` 1 517 (đọc các nhóm `openAppData`, `replacing the data (S-2)`, `purgeTrash`, `the data file card`, `backup files`), `tables.test.ts` 43, `today.test.ts` 81, `demo-snapshot.test.ts` 46.
- Đọc thêm chỗ nối của gói khác: `packages/db/src/database.ts` (`openDatabase` / `migrate`), `apps/desktop/src/shell/{close-guard.ts,CloseGuard.tsx,SaveWarning.tsx,Sidebar.tsx,AppShell.tsx}` (phần `useScreenFocus`), `startup-error.ts`, `main.tsx`, `i18n/vi.ts` (khoá `storage.*`, `saveState.*`, `close.*`).

Diff `119e2e4..2e51e25` của gói: **19 file, +1 122 / −290** (5 icon nhị phân). Theo `baseline.md`: SP +740/−218 · 7 file, test +376/−67 · 4 file. Đọc kỹ nhất `storage.rs` (+501/−98) và `persist-queue.ts` (+85/−20), `app-data.ts` (+49/−67).

## 4. Kịch bản mới đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | `flush()` (nút X) chạy xong **trước** một lần thay bắt đầu ngay sau đó: `openAppData` + storage giả, `flush()` rồi `reloadDemoData()` cùng lượt, backup bị giữ | `flush()` **resolve** trong khi lần thay còn chờ backup (`[S3] … true`) → cửa sổ đóng, lần Nạp lại mất (file vẫn là dữ liệu cũ đủ) | **DSR4-B1** |
| 2 | Lưu lỗi `FOLDER_READ_ONLY` → bấm X → hộp hỏi → **Thử lại** (vẫn lỗi) → **Bỏ thay đổi** (`closeAfterSaving` thật) | Hỏi 2 lần (`["retry","discard"]`), đóng; đĩa giữ nguyên bản ghi cuối cùng thành công (2 → 2 lần ghi), `failed` vẫn true | — |
| 3 | Nhập backup khi lần lưu cuối lỗi → **Thử lại** → nhập lại | Lần đầu `RELOAD_UNSAVED_CHANGES`; sau Thử lại nhập được (`backup=project2c-20260927-101500.db`, 3 lần ghi) | — |
| 4 | Một listener của `AppData.subscribe` ném lỗi trong `run()` | `run()` **ném** (`Error: listener bug`) nhưng lệnh đã ghi (`teams` có "Sao Mai") — khác `persist-queue` (NIT #87 đã bọc `try`) | **DSR4-B2** |
| 5 | Xóa `Project2C-data\` trong lúc app chạy (định mở app lần hai trên thư mục vừa dựng lại) | Windows **từ chối**: `remove_dir_all` → `Os { code: 32, … being used by another process }` (khóa giữ `share_mode(0)`), nên không có cửa cho app thứ hai | — (không thấy) |
| 6 | Xóa riêng `project2c.lock` trong lúc app chạy | Cũng `code: 32`; khóa không xóa được, `ALREADY_OPEN` vẫn là lớp chặn | — (không thấy) |
| 7 | `backups\` bị cấm `(RD)`, file DB còn: mở → sao lưu → gỡ quyền → sao lưu lại → mở lại, cùng tiến trình (đường "sửa quyền rồi mở lại" của trang lỗi khởi động) | `[R3] open …: Ok(true)` (mở được, chỉ cần `backups\` khi file mất); `backup …: PermissionDenied "Access is denied. (os error 5)"` → trang "Không sao lưu được file dữ liệu"; gỡ quyền: `backup … Ok("project2c-s00000001-20261030-190000.db")` (dùng lại bản trùng), `open … Ok(Some(19))` | — (không thấy) |
| 8 | Chi phí hai lần hỏi quyền mới của `open` trên file 14,1 MB, 200 lần | **586,7 µs** mỗi lần mở; `open` cả đọc file 14,1 MB: **6,3 ms**; backup file không đổi (đọc lại bản 14,1 MB): **10,4 ms**; backup đầu: **19,0 ms** | — (mục 6) |
| 9 | e2e thật trên bản build web: chỉ báo lưu, Thử lại, đóng app lúc đang lưu / đang Nạp lại | `e2e/save-state.spec.ts` **5 passed (34,8 s)**, không flaky | — |
| 10 | Một chỗ trong năm chỗ của tên app lệch: đổi `productName` rồi đổi `title` của `tauri.conf.json` | Cả hai làm ca unit `names the app as the sidebar does…` đỏ ngay (17 test của file: 1 đỏ). Ba chỗ còn lại (`<title>`, `description`, `app.title`) cùng một ca — bảng đột biến của thân PR #871 đã đo đủ năm | — |

## 5. Phát hiện mới

```
ID: DSR4-B1
Mức: Low
Trục: E
Vị trí: apps/desktop/src/data/persist-queue.ts:129-137 (2e51e25)
Tình trạng: CONFIRMED
Liên quan: T-294 (#783 → #817) · mới do đợt sửa sau lượt 3 (PR #817)
Kịch bản: 1
Mô tả: `flush()` chỉ hỏi `tracked` **một lần**, trước `await idle()`. Một lần thay bắt đầu trong lúc `flush()` đang chờ lần ghi hiện tại không được chờ, nên `closeAfterSaving` đóng cửa sổ giữa lúc Nạp lại / Nhập backup / Dọn sạch đang chạy — đúng việc S2-6 (bản sửa 25/10) cấm.
Tái hiện / bằng chứng: test tạm `dsr4b-probe.test.ts` (đã xóa), `openAppData` + storage trong bộ nhớ, `storage.backup` bị giữ: gọi `flush()` rồi `reloadDemoData()` ngay sau, in `[S3] flush resolved while the replace still waits for its backup: true`. Đối chứng: khi lần thay được gọi **trước** `flush()`, `track` đã có mặt và `flush()` chờ đúng (ca S2-6 của `app-data.test.ts` xanh).
Ảnh hưởng: người dùng bấm X rồi bấm một lệnh dữ liệu trong lúc dải "Đang lưu…" còn hiện (cửa sổ còn mở tới khi lưu xong, ~150 ms trên dữ liệu tải, lâu hơn trên đĩa chậm): lệnh đó mất, không có thông báo; file vẫn là dữ liệu cũ đủ nên không mất dữ liệu đã lưu.
Đề xuất: `flush()` lặp tới khi `tracked.size === 0` **và** `running === undefined` (vd. `for (;;) { while (tracked.size) await Promise.allSettled(tracked); if (running) { await running; continue; } … break; }`), hoặc `closeAfterSaving` gọi `flush()` hai lần. Cỡ ≤ 20 dòng.
```

```
ID: DSR4-B2
Mức: Nit
Trục: T
Vị trí: apps/desktop/src/data/app-data.ts:373-377 (2e51e25)
Tình trạng: CONFIRMED
Liên quan: T-294 (#783 → #817, NIT #87) · có từ trước, lượt 1–3 bỏ sót
Kịch bản: 4
Mô tả: `changed()` của `AppData` gọi từng listener không bọc `try`, trong khi `persist-queue.changed()` đã bọc và báo qua `console.error` (NIT #87). Một listener ném lỗi làm `run()` ném **sau** khi lệnh đã ghi, trái hợp đồng "lệnh bị từ chối thì không đổi gì" mà chính `run` ghi ở `:113-117`.
Tái hiện / bằng chứng: test tạm `dsr4b-probe2.test.ts` (đã xóa): `app.subscribe(() => { throw new Error('listener bug') })` rồi `app.run(db => createTeam(db, {name: 'Sao Mai'}))` → `[S6] run threw: Error: listener bug · teams now: ["Seed 27/09/2026","Sao Mai"]`.
Ảnh hưởng: chỉ khi có listener ném lỗi — hiện chỉ có listener của React (`useSyncExternalStore`), `getSnapshot` của chúng không ném. Nếu sau này thêm listener khác (đo, log), màn sẽ hiện lỗi "Màn này gặp lỗi" dù lệnh đã ghi, và lần bấm lại sẽ ghi hai lần.
Đề xuất: cùng khuôn `persist-queue.changed()` (mỗi listener một `try`, `console.error`). Cỡ ≤ 8 dòng.
```

Không có phát hiện Medium / High / Critical mới trong gói này. Tỉ lệ PLAUSIBLE: **0/2**.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Việc đã làm | Trên đâu | Số | ID |
|---|---|---|---|
| `tsc -p apps/desktop/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` | toàn app (gồm 7 file `src/data` của gói) | **0 lỗi** (không biến / tham số thừa) | — |
| `pnpm lint:deps` (dependency-cruiser) | `apps`, `packages` | **0 vi phạm**, 341 module / 1 435 phụ thuộc | — |
| `rg "flatten\(\)"` trong `storage.rs` | `src-tauri` | **0** (DR6-67: bốn chỗ lặp đã gom vào `entries`) | — |
| Đếm dòng theo gói (`baseline.md`, `size-report`) | gói B | SP **2 426** (+219 so lượt 3), test **5 422** (+612), 19 file (+0) | — |
| Cỡ file lớn nhất của gói | `storage.rs` 2 125 dòng, trong đó test :668–2125 (1 458 dòng) | 69 % là test; mã 667 dòng cho 11 lệnh file | — |
| `app-data.ts` sau khi bỏ `saveError` / `lastSave` / `subscribe*` | `src/data` | −67 / +49: một nguồn trạng thái thay hai cặp API, không còn `LastSave` trùng | — |

Không có phát hiện bloat: phần lặp của lượt 1–3 trong `storage.rs` đã hết, `persist-queue` thêm `SaveStatus` nhưng bỏ `unsaved()` và hai store của `AppData`.

### 6.2 Hiệu năng

Số trên exe lấy từ `common\baseline.md` (probe `e2e/perf`, cùng máy, exe `2e51e25`); số đo thêm của tôi đo trong tiến trình Rust trên file 14,1 MB (= cỡ dữ liệu tải), máy rảnh, không chạy gì song song.

| Đo | Dữ liệu | Số | Ngưỡng / mốc | Kết luận |
|---|---|---|---|---|
| `app.open-data` (mở dữ liệu) | dữ liệu tải | 370 ms (1 lần) | ≤ 600 ms; mốc sau #656 387 ms | đạt |
| `db.save` (ghi cả file) | dữ liệu tải, 15 lần | 149 ms (146–158) | ≤ 400 ms; mốc 151 ms | đạt |
| `backup.read` (chọn file → hộp xác nhận) | dữ liệu tải, 5 lần | 977 ms (958–1011) | ≤ 2 000 ms | đạt (+17 % so mốc, dưới luật nhiễu) |
| Mở app lần đầu (LCP) | seed demo | 3 521 ms | 3 663 ms; xấu khi > 4 396 ms | không xấu hơn |
| **Hai lần hỏi quyền mới của `open`** (`add_refused` + `replace_refused`) | thư mục + file 14,1 MB, 200 lần | **586,7 µs / lần mở** | luật nhiễu 10 ms | không đáng kể (+0,16 % của `app.open-data`) |
| `storage::open` (đọc 14,1 MB + hai lần hỏi quyền) | file 14,1 MB | 6,3 ms | — | — |
| `storage::backup` file **không đổi** (`find_copy` đọc lại bản 14,1 MB) | 1 bản 14,1 MB | 10,4 ms | — | đường mở app lần hai |
| `storage::backup` lần đầu (ghi bản 14,1 MB) | — | 19,0 ms | — | — |
| e2e `save-state.spec.ts` (5 ca) | bản build web | 34,8 s, 5/5 | — | không flaky |

Không có phát hiện P: không thao tác nào vượt ngưỡng `docs/metrics/phase-6.md`, và phần mới thêm vào `open` (0,59 ms) nằm dưới luật nhiễu.

## 7. Đếm mức × trục

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| Low | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **1** |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | **1** |

2 phát hiện, cả hai CONFIRMED (0 PLAUSIBLE). Bảng R: 3 dòng R1 + 6 dòng R2, tất cả **ĐÃ SỬA**, 0 SỬA MỘT PHẦN / 0 CHƯA SỬA / 0 HỒI QUY.

## 8. Đã xét, không thấy

- **R** (ngoài ba dòng R1): 10 đột biến ở mục 9, mỗi cái có test đỏ đúng chỗ; không đột biến nào sống. Refactor `entries` / `remove_interrupted` / `refuses` không đổi hành vi (116 test Rust xanh trước và sau).
- **E**: thư mục dữ liệu bị xóa / khóa bị xóa giữa phiên (kịch bản 5, 6) — Windows chặn ở `share_mode(0)`, không có cửa cho app thứ hai. `save` khi thư mục bị xóa thì `create_dir_all` dựng lại (hành vi cũ, chỉ chạm được nếu chương trình ngoài xóa thư mục — như K9 lượt 3 đã ghi). `open` trên tên `project2c.db` là thư mục → `ACCESS_DENIED` (KNOWN #620, đã chấp nhận). `write_export` với tên 1 000 lần trùng → `AlreadyExists` (có test). `next_seq` bão hòa ở `u64::MAX` — cần file đặt tay, không đáng báo.
- **C**: đối chiếu K39 (bốn câu báo lỗi còn "Project-2C", `identifier`, `project2c.exe`, `Project2C-data\`, `project2c.db`, `KEY_SERVICE`, `BACKUP_FORMAT`) — đúng; CSP khớp nguyên văn giữa `tauri.conf.json` và ca `keeps the CSP closed`; `bundle.icon` 4 file như trước.
- **D**: `open` không ghi gì; `openFrom` ghi một lần (M7); `save` ghi nguyên tử (`write_atomic_with` + `.tmp`), lỗi để lại file cũ nguyên byte (test `a_save_whose_rename_fails_keeps_the_old_file_byte_for_byte`); `backups\` giữ 10 bản theo thứ tự ghi, không theo đồng hồ (test `a_clock_going_back_and_forth_…`).
- **G**: `ai.rs` chỉ đọc phần `readings` / `reveals` / `mask` của T-293 — cách đọc thứ tư (`Escapes::Json`) và `odd_keys` có test; phần G5 / prompt thuộc C.
- **S**: đầu vào từ webview không thành đường dẫn: `export_write` chỉ nhận tên đã qua `is_export_name` (chỉ chữ, số, `-_.`, không bắt đầu bằng `.`, phải có đuôi), `open_folder` chỉ nhận `exports` / `backups`; `db_save` ghi đúng file DB. Không thấy đường mới.
- **P**: xem 6.2 — không dòng nào vượt ngưỡng; hai lần hỏi quyền thêm 0,59 ms.
- **B**: xem 6.1 — 0 unused, 0 vi phạm phụ thuộc, không còn `flatten()`.
- **T**: test của gói dày (Rust 116, `src/data` 49 + 77 + e2e 5). Hai lỗ hổng đã thành DSR4-B1 / B2. Đã thử: bỏ `track` (M5), bỏ nhánh ghi lại của `flush` (M6), `openFrom` ghi hai lần (M7), bỏ `check` (M8), bỏ `refused` (M1), bỏ `add_refused` lúc mở (M2), `entries` nuốt lỗi (M3), `backups` coi như rỗng (M4), đổi `productName` (M9), đổi `title` (M10).
- **A**: chỉ báo lưu là chữ + chấm `aria-hidden`, dải lỗi `role="alert"` (không phải live region — có lý do ở PR #817); tên cửa sổ theo màn qua `setTitle` có ca e2e giả lập; `lang="en"` của slogan thuộc D. Không thấy gì mới.

## 9. Phụ lục

**Nguồn probe / đột biến** (đều trong `C:\workspace\deep-review-1-6-r4\deepseek\B\`, trừ khi ghi khác):

- `patch.mjs` — thay một chuỗi trong file rồi để `git checkout --` trả lại; mỗi lần đều kiểm `sha256sum` + `git status --short`.
- `share_probe.rs` — Rust rời: mở một file đang bị giữ `share_mode(0)` bằng `access_mode(DELETE)` → `kind=Uncategorized, raw=32`, tức `refuses()` không đọc "chương trình khác giữ file" thành "bị từ chối" (giả định của `storage.rs:225-236` đúng).
- Đột biến (mỗi cái: patch → chạy test → `git checkout --` → hash lại):

| Mã | Đột biến | Test đỏ |
|---|---|---|
| M1 | `refused()` trả nguyên lỗi (`if true`) | 3 (DR6-120) |
| M2 | `open` bỏ `add_refused(dir)` | 1 |
| M3 | `entries()` nuốt mọi lỗi như code cũ | 2 (T-293) |
| M4 | `without_file` coi `backups\` không đọc được là rỗng | 2 (T-293) |
| M5 | `inTurn` bỏ `saves.track(turn)` | 2 (S2-6, "counts a replace as saving") |
| M6 | `flush()` bỏ nhánh ghi lại `lost` | 5 (CL3-B2, DR6-07) |
| M7 | `openFrom` lưu cả khi đã migration | 1 (T-295) |
| M8 | `open(stored)` không `refuseDamaged` | 3 (T-295, DR-51) |
| M9 | `productName` → "Heritas X-CRM" | 1 (T-308 / T-310) |
| M10 | `title` cửa sổ → "Project-2C" | 1 (T-308 / T-310) |

  Sau mỗi lần: `git checkout --` và `sha256sum` trùng hash đầu phiên (`storage.rs` `679d3df6…a64d9e`, `persist-queue.ts` `d83a1d4a…ca3b2a`, `app-data.ts` `0653b0f3…ba39dc`, `tauri.conf.json` `043ab45c…401d60`).

- Probe Rust tạm (thêm `#[cfg(test)] mod` vào `storage.rs`, chạy `cargo test --lib`, rồi `git checkout --`): kịch bản 5, 6 (xóa thư mục / khóa), kịch bản 7 (`[R3]`, `icacls /deny` rồi `/remove:d`), kịch bản 8 (`[T1]`: đo `add_refused` + `replace_refused`, `open`, `backup`). Không giữ lại file nào.
- Probe TS tạm: `apps/desktop/src/data/dsr4b-probe.test.ts` (kịch bản 1–3) và `dsr4b-probe2.test.ts` (kịch bản 4) — chạy xong **đã xóa**, `git status --short` rỗng.
- e2e: `node node_modules/@playwright/test/cli.js test e2e/save-state.spec.ts --project=edge --no-deps --reporter=line` → 5 passed (34,8 s), cổng 4173 không đụng bên khác.
- Cổng đã chạy lại: `cargo test --lib` **116 passed** (3,14 s sau khi dựng); `vitest` cho 6 file `src/data` **49 passed**; `tsc --noUnusedLocals` 0 lỗi; `pnpm lint:deps` 0 vi phạm.

**`git status --short` cuối phiên:** rỗng (chỉ `apps/desktop/src-tauri/target/` do `cargo test` sinh, bị ignore).

**Giờ xong:** 2026-10-30 19:38 (+07:00).
