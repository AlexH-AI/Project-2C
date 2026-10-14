XONG — claude gói B, 2026-10-14 10:47

# Deep review Phase 1–6, lượt 1 — Claude, gói B (File và Rust)

## 1. Đầu phiên

- Bên: Claude (Opus 5.5), phiên sạch, chỉ đọc.
- Gói: **B — File và Rust** (`apps/desktop/src-tauri/**`, `apps/desktop/src/data/**` trừ file AI).
- Worktree: `C:\workspace\Project-2C-review`.
- SHA đầu phiên: `885534549808f42aec7f9af5743bbf86642ee4bd` (khớp SHA ghim `8855345`).
- `git status --short` đầu phiên: rỗng.
- Giờ bắt đầu: 2026-10-14 10:10 (Office Laptop `D13_THINKPAD`).
- Bước 0: gói B hợp lệ; `claude\B.md` chưa có → làm mới; `claude\A.md` có, dòng đầu `XONG — claude gói A, 2026-10-14 10:08`.

## 2. Phạm vi đã đọc

Đọc hết (toàn file, ở SHA ghim):

- Rust: `apps/desktop/src-tauri/src/lib.rs` (205), `storage.rs` (1 401: SP 1–471, test 472–1 401), `ai.rs` (1 789: SP 1–517; test: tên mọi ca + đọc các ca masking / giới hạn / gzip / TLS), `main.rs`, `build.rs`, `Cargo.toml`, `capabilities/default.json`, `tauri.conf.json`.
- `apps/desktop/src/data/` (trừ file AI): `app-data.ts` (436), `persist-queue.ts` (79), `tauri-storage.ts` (61), `tables.ts` (68), `today.ts` (58), `demo-snapshot.ts` (45), `AppDataContext.tsx` (52); test: `app-data.test.ts` (1 120: đọc 1–112, 386–830 + tên mọi ca), `persist-queue.test.ts`, `tauri-contract.test.ts` (217), `tauri-storage.test.ts`, `tables.test.ts`, `today.test.ts`, `demo-snapshot.test.ts` (tên ca).
- Chỗ gói khác mà gói B nối vào (chỉ đọc để biết đường vào): `packages/db/src/database.ts` (229: persist / migrate / transaction), `apps/desktop/src/main.tsx`, `App.tsx`, `shell/{CloseGuard.tsx, close-guard.ts, block-reload.ts, startup-error.ts, StartupError.tsx}`, `routes/reports/report-workbook.ts:217-259` (tên file Excel ↔ `is_export_name` của Rust).
- Tài liệu: `CLAUDE.md` gốc + `apps/desktop/CLAUDE.md`, ADR-0016, ADR-0009 phụ lục D-1 / W-1, spec Phase 6 §4.1 (S2-1…S2-6) và §5, `docs/metrics/phase-6.md` (ngưỡng), `common\plan.md` §1–§11, `common\known.md`, `common\baseline.md`, `claude\A.md` (để không báo lại).

## 3. Phát hiện

### CL-B1

```
ID: CL-B1
Mức: Low
Trục: D (và C — spec Phase 6 §5 mục 4 "file DB hỏng — app báo lỗi rõ, không mất bản đã lưu")
Vị trí: apps/desktop/src/data/app-data.ts:239-241, :308-319 (mở → storage.backup(), không kiểm toàn vẹn); packages/db/src/database.ts:50-123 (openDatabase chỉ đọc schema_migrations + migrate); apps/desktop/src-tauri/src/storage.rs:149-163 (copy_to_backups: file đổi → tỉa bản cũ nhất, ghi bản mới) (8855345)
Tình trạng: CONFIRMED (bằng chứng mới cho DR-51 đã RESOLVED: cách sửa DR-51 chỉ chặn được hỏng làm `openDatabase` lỗi)
Mô tả: DR-51 chuyển sao lưu lúc khởi động ra sau khi JS mở được file, với lời bảo đảm "a file damaged inside never becomes the newest backup" (app-data.ts:239-240, storage.rs:93-94). Nhưng `openDatabase` không kiểm toàn vẹn: file có header SQLite đúng mà hỏng một trang b-tree ở giữa vẫn mở được, nên app khởi động bình thường, **chép file hỏng thành bản backup mới nhất**, rồi mọi lần lưu xuất lại nguyên trang hỏng. "Xuất backup" ném "database disk image is malformed", màn Cài đặt chỉ báo `settings.backup.exportFailed` ("Kiểm tra ổ đĩa và quyền ghi thư mục Project2C-data\exports\…", SettingsBackup.tsx:56-57) — sai hướng. Mỗi lần mở app sau một phiên có ghi, file đã đổi nên `copy_to_backups` tỉa bản cũ nhất và thêm một bản hỏng: sau 10 lần, không còn bản sao lưu tốt nào. Không có câu báo nào ở lúc khởi động (StartupError không hiện), màn đọc trúng trang hỏng chỉ hiện "Màn này gặp lỗi… Dữ liệu đã lưu không bị ảnh hưởng".
Tái hiện / bằng chứng: `node --import ./hooks.mjs p3-damaged.mjs` (log `B\p3-damaged.log`), file = dữ liệu tải xuất bằng sql.js (`B\data\v00.db`, 13 455 360 B, 3 285 trang 4 096 B), ghi đè một trang:
  trang 1642 (giữa file): {"open":"ok","failing":[]} — 6 bảng của màn chính đọc được; PRAGMA quick_check → "database disk image is malformed" (35 ms)
  trang 821: {"open":"ok","failing":["appointments: database disk image is malformed"]} (mọi màn dùng lịch hẹn lỗi)
  trang 2463: quick_check → "Tree 31 page 2463: btreeInitPage() returns error code 11", "wrong # of entries in index sqlite_autoindex_kyc_versions_1"
  khởi động exe (openAppData + storage giả) trên file hỏng trang 1642: "startup: app OPENED on the damaged file; storage calls: [ 'backup (copies the file on disk = the damaged one)' ]"; "a write after startup: saved 1 file(s); the saved file still damaged"; "exportBackup: THROWS database disk image is malformed".
  Đẩy hết bản tốt: đúng luật tỉa đã có test `backup_keeps_only_the_ten_newest_backups` (storage.rs:652) — mỗi lần file đổi là một bản mới, giữ 10 bản mới nhất.
Ảnh hưởng: Hiếm (file hỏng do ổ đĩa / phần mềm khác ghi vào / tắt máy lúc ổ ghi dở). Khi gặp: người dùng không được báo ở lúc mở, không xuất được backup, và sau ≈ 10 phiên có ghi thì `backups\` chỉ còn bản hỏng — đúng điều spec §5 mục 4 muốn tránh. Low theo thước (điều kiện hiếm), hậu quả nặng nếu gặp.
Đề xuất: trong `openAppData`, sau `open(stored)` và trước `storage.backup()`, chạy `PRAGMA quick_check` (đo trên dữ liệu tải: 79 ms trung vị trong Node; `integrity_check` 113 ms) và từ chối khởi động như file không mở được (câu `storage.openFailed` sẵn có, hướng dẫn chép bản liền trước) khi kết quả khác `ok`. `app.open-data` hiện 273 ms (`perf-ref.json`), ngưỡng 600 ms → còn chỗ. Cỡ ≈ 10 dòng SP + 1 test `app-data.test.ts` (file hỏng một trang: không backup, không save, lỗi khởi động).
```

### CL-B2

```
ID: CL-B2
Mức: Low
Trục: T (và D — lỗi tiềm ẩn ở thứ tự lưu)
Vị trí: apps/desktop/src/data/app-data.ts:300-304 (openFrom: persist(bytes) sau khi open đã lưu bản migrate); test apps/desktop/src/data/app-data.test.ts:761-777 ("saves the migration of the new data while it opens …") (8855345)
Tình trạng: CONFIRMED
Mô tả: `openFrom(bytes)` mở DB (migrate → `persist` bản đã migrate, vì `mine === opening`) rồi gọi thêm `saves.persist(bytes)` với **bytes đầu vào chưa migrate**; hàng đợi ghi bản sau cùng, nên file cuối trên đĩa là bản chưa migrate. Test "saves the migration of the new data while it opens" chỉ kiểm `after[0]` khác `older` và mọi bản lưu mở lại (qua `openDatabase`, vốn tự migrate) có 0 team — nên xanh dù bản cuối là file gốc. Trong test, `older` = `openDatabase({ migrations: [] }).export()` là **0 byte**, nên file cuối trên "đĩa" của test là file rỗng (exe sẽ từ chối mở ở lần sau: storage.rs:122 "not a SQLite database").
Tái hiện / bằng chứng: `node --import ./hooks.mjs p1-migrate-last-save.mjs` (log `B\p1-migrate-last-save.log`) chạy lại đúng kịch bản của test:
  "LATEST_SCHEMA_VERSION 9 | older file version 0"
  "save #1: schema version 9, 159744 B, same bytes as older: false"
  "save #2: schema version 0, 0 B, same bytes as older: true"
  "LAST file on disk is migrated: false"
Ảnh hưởng: Hiện không ai gặp: ở sản phẩm `openFrom` chỉ nhận bytes đã ở schema mới nhất (seed mới, `readBackup` → `importBackup` của `@p2c/db` đã migrate, snapshot e2e không có storage). Test hở: nếu sau này có đường mở một file cũ qua `openFrom` (vd. khôi phục từ `backups\`), file trên đĩa sẽ là bản chưa migrate tới lần ghi sau, và test hiện có không bắt được.
Đề xuất: `openFrom` lưu `db.export()` (hoặc chỉ `persist(bytes)` khi không có migration nào chạy); test kiểm **bản lưu cuối** có `schemaVersion() === LATEST_SCHEMA_VERSION` và dùng một file cũ thật (có schema_migrations ở bản thấp hơn) thay cho file 0 byte. Cỡ ≈ 2 dòng SP + 3 dòng test.
```

### CL-B3

```
ID: CL-B3
Mức: Nit
Trục: T
Vị trí: apps/desktop/src-tauri/src/storage.rs:464-470 (is_export_name: `!name.starts_with('.')`), :425-429 (has_same_bytes: so độ dài); apps/desktop/src/data/app-data.ts:406-419 (readBackup: `imported.db.sqlite.close()` trong finally) (8855345)
Tình trạng: CONFIRMED
Mô tả: Ba đột biến có hệ quả thật vẫn sống trước bộ test hiện có (§7.2, §7.3): RS4 bỏ luật "tên xuất không bắt đầu bằng dấu chấm" (danh sách tên xấu chỉ có ".p2cbackup", vốn bị luật độ dài chặn trước, nên "..p2cbackup" / ".a.xlsx" không ca nào thử); RS9 bỏ so độ dài trong has_same_bytes (một bản backup **dài hơn** file mà có cùng phần đầu sẽ bị coi là "bản trùng" và dùng lại — không ca nào dựng); MJ15 bỏ `close()` DB tạm của `readBackup` (mỗi lần chọn file nhập để lại ≈ 13 MB trong heap WASM của sql.js, heap không co lại; không test nào đếm lần đóng như ca "closes the database it seeds…" đã làm cho seed).
Tái hiện / bằng chứng: `node rmut.mjs` (bản chép crate ở `B\mut\`, log `B\rmut.log`): "RS4 … SURVIVED — test result: ok. 91 passed", "RS9 … SURVIVED — test result: ok. 91 passed"; `node jmut.mjs` (vá tạm repo, trả lại nguyên byte, log `B\jmut.log`): "MJ15 … SURVIVED — Tests 107 passed (107)".
Ảnh hưởng: không ai gặp hôm nay (code đúng); chỉ là lá chắn không được test giữ — người sửa sau bỏ đi thì CI vẫn xanh.
Đề xuất: thêm "..p2cbackup" và ".a.xlsx" vào danh sách tên xấu (storage.rs:1164-1172); một ca `find_copy` với backup dài hơn cùng phần đầu; một ca `readBackup` kiểm `close` (spy như app-data.test.ts:512-528). ≈ 25 dòng test, không đổi SP.
```

### CL-B4

```
ID: CL-B4
Mức: Nit
Trục: C
Vị trí: apps/desktop/src-tauri/tauri.conf.json:4 ("version": "0.1.0"), apps/desktop/src-tauri/Cargo.toml:3 (version = "0.1.0" → ai.rs:43 USER_AGENT = "Project-2C/" + CARGO_PKG_VERSION), apps/desktop/package.json:3 (8855345)
Tình trạng: CONFIRMED (đọc)
Mô tả: Mọi chỗ ghi phiên bản app vẫn là 0.1.0, trong khi bản sắp phát hành là v1.0 (spec Phase 6 §7: GitHub Release v1.0). Spec §7 / `nghiem-thu-v1.md` không có bước đặt phiên bản 1.0.0, nên exe phát hành sẽ mang phiên bản 0.1.0 (tauri-build ghi vào thuộc tính file Windows) và gửi `User-Agent: Project-2C/0.1.0` tới OpenCode (ADR-0009 W-1 mục 7: "Project-2C/<phiên bản>").
Tái hiện / bằng chứng: `grep -rn '"version"' apps/desktop/package.json apps/desktop/src-tauri/tauri.conf.json` → hai dòng 0.1.0; `grep -rn -i "version\|phiên bản" docs/design/phase-6-hoan-thien.md` → không có bước nào đổi phiên bản.
Ảnh hưởng: người dùng / Owner xem Properties của exe v1.0 thấy 0.1.0; khó phân biệt bản phát hành với các exe thử trước.
Đề xuất: thêm vào checklist G7 bước đặt 1.0.0 ở ba file (PR `build-exe`); ≈ 3 dòng.
```

### CL-B5

```
ID: CL-B5
Mức: Low
Trục: B
Vị trí: apps/desktop/src-tauri/Cargo.toml:9-11 ([lib] crate-type = ["staticlib", "cdylib", "rlib"]) (8855345)
Tình trạng: CONFIRMED
Mô tả: Kiểu crate của khuôn Tauri (cho mobile) giữ nguyên, trong khi app chỉ build exe Windows (ADR-0006): `project2c.exe` chỉ link `rlib`, nhưng mỗi lần build release cargo còn dựng thêm `project2c_lib.lib` (staticlib, 186 MB, LTO cả cây dependency) và `project2c_lib.dll` (cdylib) không ai dùng.
Tái hiện / bằng chứng: `bash p4-crate-type.sh` (bản chép crate ở `B\mut\`, target riêng `B\target-rel\`, `cargo build --release --features tauri/custom-protocol` như `tauri build`; chỉ đo bước crate app sau `touch src/lib.rs`, 3 lần mỗi cấu hình; log `B\p4-crate-type.log`):
  "three crate types, round 1/2/3: 83352 / 83347 / 82351 ms"
  "rlib only, round 1/2/3: 71819 / 72393 / 69482 ms"
  "186461222 …/deps/project2c_lib.lib", "444928 …/deps/project2c_lib.dll" (target của repo sau `pnpm build:exe` ở bước chuẩn bị: `project2c_lib.lib` 186 461 606 B, `.dll` 465 920 B)
Ảnh hưởng: mỗi `pnpm build:exe` (máy Owner, job CI build exe khi PR có nhãn `build-exe`) chậm thêm ≈ 11–12 s (≈ 14 % bước crate app) và tốn thêm ≈ 187 MB đĩa trong `target\release`; người dùng exe không bị ảnh hưởng.
Đề xuất: `crate-type = ["rlib"]` (hoặc bỏ hẳn mục `[lib]` crate-type); PR `build-exe`, giữ hành vi bằng `pnpm verify:rust` + `pnpm build:exe` (exe chạy, NT khởi động). Cỡ 1 dòng.
```

### CL-B6

```
ID: CL-B6
Mức: Low
Trục: C (spec Phase 6 §5 mục 4 "… hoặc không ghi được — app báo lỗi rõ") và D
Vị trí: apps/desktop/src-tauri/src/storage.rs:95-121 (open: lỗi đọc file / mở khóa ngoài ALREADY_OPEN trả nguyên câu lỗi OS), apps/desktop/src/shell/startup-error.ts:31-35 (mọi lỗi khác → storage.openFailed), apps/desktop/src/i18n/vi.ts:942-944 (câu hướng dẫn khôi phục); test ghim hành vi: apps/desktop/src/shell/startup-error.test.ts:42-47 (8855345)
Tình trạng: CONFIRMED
Mô tả: Khi file DB **còn nguyên** nhưng tạm thời không đọc được — chương trình khác mở nó không cho chia sẻ (os error 32) — hoặc thư mục dữ liệu không ghi được (`project2c.lock` chỉ đọc / thư mục bị khóa quyền: os error 5), màn khởi động hiện cùng câu với file hỏng: "Không mở được file dữ liệu. App chưa ghi gì vào file. … chép bản mới nhất thành Project2C-data\project2c.db để khôi phục. Bản mới nhất có thể chính là file đang lỗi: khi đó chép bản liền trước nó…". Làm theo hướng dẫn đó với một file còn nguyên là chép đè bản sao lưu lúc mở phiên trước lên file hiện tại → mất mọi thay đổi của phiên cuối. Câu không nói cách đúng (đóng chương trình đang giữ file / kiểm quyền thư mục rồi mở lại app).
Tái hiện / bằng chứng: `cargo test … open_probe -- --ignored --nocapture` (test tạm `B\open_probe.rs` chèn vào **bản chép** crate rồi gỡ, log `B\p5-open-errors.log`):
  "held db file → kind Uncategorized, raw Some(32), message to the webview: \"The process cannot access the file because it is being used by another process. (os error 32)\""; "after the program let go → opens: true"
  "read-only lock file → kind PermissionDenied, raw Some(5), message: \"Access is denied. (os error 5)\""
  Hai câu này rơi vào nhánh cuối của `startupMessage` (startup-error.ts:31-35); `startup-error.test.ts:42-47` ghim đúng "Access is denied. (os error 5)" → title "Không mở được file dữ liệu" + help có "Project2C-data\\backups".
Ảnh hưởng: hiếm (một chương trình giữ file không chia sẻ — công cụ sao lưu / đồng bộ, phần mềm diệt virus giữ lâu; thư mục chỉ đọc khi chép từ nơi khác / chạy từ ổ chỉ đọc). Người dùng làm đúng theo hướng dẫn thì mất dữ liệu phiên cuối; không làm thì chỉ cần mở lại app là chạy.
Đề xuất: Rust trả mã riêng cho "file đang bị giữ" (raw 32 / 33 khi đọc `project2c.db`) và "không ghi được thư mục" (PermissionDenied khi tạo thư mục / mở khóa), như `ALREADY_OPEN` / `DISK_FULL`; `startupMessage` có câu "File dữ liệu không hỏng, không cần khôi phục: đóng chương trình đang mở file / kiểm tra quyền ghi thư mục rồi mở lại app". Cỡ ≈ 15 dòng SP (Rust + `startup-error.ts` + `vi.ts`) + test Rust (giữ file `share_mode(0)` như `a_locked_old_backup_does_not_block_a_backup`) + `startup-error.test.ts`; PR `build-exe`.
```

## 4a. Bloat

| Đã chạy / đọc gì | Trên gì | Kết quả | Phát hiện |
|---|---|---|---|
| `cargo clippy --all-targets -- -W clippy::pedantic` (một lần, theo kế hoạch) | `src-tauri` ở SHA ghim | exit 0; lib 18 cảnh báo, test thêm 12: 11 thiếu backtick trong doc, 4 + 2 ép kiểu `u64 → usize/u8/u32` (đều trong test), 3 `needless_pass_by_value` (tham số lệnh Tauri phải sở hữu — dương tính giả), `lib.rs:66` ép `u64 → i64` (giây từ 1970, không tràn được), `storage.rs:63` closure thừa, `lib.rs:188` thiếu mục `# Panics`. Không cảnh báo nào chỉ code chết / lỗi | — |
| `tsc --noUnusedLocals --noUnusedParameters` | `apps/desktop` | hai cờ đã bật sẵn ở `tsconfig.base.json` (gói A đã xác nhận), `pnpm verify` xanh ở SHA ghim (`common\baseline.md`) → 0 biến / tham số thừa | — |
| Quét nơi dùng mọi export + thành viên interface (`B\b1-exports.mjs`, log `b1-exports.log`) | 7 file `src/data` của gói B | Export không có nơi dùng ở code sản phẩm ngoài file: chỉ **type** (`LastSave`, `OpenAppDataOptions`, `DayWatcher`, `WakeEvents`, `ExportedBackup`) và hai hàm của e2e (`demoSnapshotName`, `buildDemoSnapshot` ← `e2e/serve.mjs`, đúng vai trò). Thành viên: `PersistQueue.unsaved()` (persist-queue.ts:14, :66) chỉ test gọi (7 chỗ trong `persist-queue.test.ts`), không code sản phẩm nào — 1 dòng SP + doc | (Nit, không tách mục) |
| Code lặp | `src/data`, Rust | `newPage` (tauri-storage.ts:18) ≡ `newSessionId` (`packages/ai/src/run.ts:148`) — KNOWN #448. `explorer()` dùng chung cho `open_folder` / `open_chatgpt` (đã gộp). `SQLITE_HEADER` có ở `storage.rs:30` và `demo-snapshot.ts:13` (hai ngôn ngữ, hai vai trò). Không thấy khối lặp ≥ 3 nơi | — |
| Dependency Rust | `cargo tree -e normal --target x86_64-pc-windows-msvc` | 294 crate; gốc: `tauri`, `ureq` (rustls + webpki-roots + gzip mặc định), `keyring-core`, `windows-native-keyring-store`, `serde`, `serde_json` — đúng ADR-0009 D-1 / ADR-0005; đều dùng. Không đo được phần của từng crate trong exe 5 414 400 B khi không có `cargo-bloat` (G4 — chỉ đề xuất) | — |
| `crate-type = ["staticlib", "cdylib", "rlib"]` (Cargo.toml:11) | `target\release` của repo (build ở bước chuẩn bị) | Mỗi `pnpm build:exe` còn tạo `deps\project2c_lib.lib` **186 461 606 B** và `project2c_lib.dll` 465 920 B mà exe không dùng (exe chỉ link `rlib`); thời gian build thêm: xem dòng P4 dưới | CL-B5 |

## 4b. Hiệu năng

Máy: Office Laptop `D13_THINKPAD`, Node v24.20.0, Rust 1.98.1; 10:15–10:40 ngày 14/10; song song: phiên Codex đợt 1 ở `Project-2C-review-2` (không biết đang chạy gì). Không đo trên exe (số exe lấy từ `common\perf\perf-ref.json`); mọi probe trong Node / `cargo test` trên bản chép.

| Đo gì | Dữ liệu | Kết quả | So ngưỡng / tham chiếu | Phát hiện |
|---|---|---|---|---|
| `storage::save` (ghi `.tmp` + `sync_all` + rename), 7 lần | file DB của dữ liệu tải 13 455 360 B (`B\data\v10.db`), build debug | trung vị **9,9 ms** (9–10) | exe `db.save` 160 ms (≤ 400 ✅) → phần Rust ≈ 6 %, còn lại là IPC 13 MB + `db.export()` | — |
| `storage::open` (đọc file) | như trên | trung vị **4,2 ms** | exe `app.open-data` 273 ms (≤ 600 ✅) | — |
| `storage::backup` file không đổi (dùng lại bản mới nhất) / file đã đổi (so 10 bản rồi ghi bản mới) / file trùng bản **cũ nhất** | 10 bản backup cùng cỡ | **7,6 / 14,9 / 7,7 ms** | — | — |
| Byte đầu tiên khác nhau giữa hai lần lưu liên tiếp (`find_copy` dừng ở khối 64 KB đầu) | 12 lần `db.export()` sau mỗi lệnh `renameTeam` | luôn **byte 27** (bộ đếm thay đổi của header SQLite: `00000002`, `00000003`…) → DR-53 đúng: so mỗi bản chỉ đọc 64 KB | — | — |
| `db.export()` (Node) | dữ liệu tải | 2,3–5,2 ms | — | — |
| `PRAGMA quick_check` / `integrity_check` (chi phí của đề xuất CL-B1) | file DB dữ liệu tải | trung vị **79,1 ms** / **113,1 ms** (5 lần) | `app.open-data` 273 + ≈ 80 ms vẫn < 600 ms | CL-B1 |
| Build release, chỉ bước crate của app sau `touch src/lib.rs`: 3 kiểu crate so với chỉ `rlib` (10:31–10:44, có build song song với phiên Codex nếu bên đó đang đo) | bản chép crate, target riêng `B\target-rel\` | 3 kiểu: **83,4 / 83,3 / 82,4 s**; chỉ `rlib`: **71,8 / 72,4 / 69,5 s** → ≈ −11,5 s (−14 %) mỗi lần build | không phải thao tác người dùng; job CI build exe | CL-B5 |

Không có phát hiện P: mọi thao tác của gói B đo được đều dưới ngưỡng; chi phí lớn nhất của đường lưu là IPC (≈ 150 ms / 13 MB), tăng tuyến tính theo cỡ file — với dữ liệu gấp đôi dữ liệu tải vẫn ≈ 300 ms < 400 ms (ước lượng tuyến tính, chưa đo).

## 5. Bảng đếm mức × trục

Trục chính của mỗi phát hiện (CL-B1 có thêm C, CL-B2 thêm D, CL-B6 thêm D).

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 1 (CL-B6) | 1 (CL-B1) | 0 | 0 | 0 | 1 (CL-B5) | 1 (CL-B2) | 0 | 4 |
| Nit | 0 | 1 (CL-B4) | 0 | 0 | 0 | 0 | 0 | 1 (CL-B3) | 0 | 2 |
| **Tổng** | 0 | 2 | 1 | 0 | 0 | 0 | 1 | 2 | 0 | **6** |

Tình trạng: 6 / 6 CONFIRMED (CL-B1, CL-B2, CL-B3, CL-B5, CL-B6 có probe / đột biến / build chạy thật; CL-B4 xác nhận bằng `grep`), 0 PLAUSIBLE, 0 KNOWN. CL-B1 là bằng chứng mới cho DR-51 (RESOLVED ở deep review Phase 1–4): cách sửa cũ chỉ phủ hỏng làm `openDatabase` lỗi. Không mục nào trùng sổ OPEN / ACCEPTED (`known.md`): đã đối chiếu `storage.rs` (#196, #192 — `explorer_arg`, `Some(32)`, `rename` / claim), `tables.ts` (#386), `app-data.test.ts:723` (#537), `app-data.ts:249` (#572), `.tmp` sót trong `backups\` (#87), `newPage` (#448).

## 6. Đã xét, không thấy (theo trục)

- **E — Edge case:** đọc từng nhánh của `storage.rs` (file thiếu có / không có backup, file rỗng, không phải SQLite, `.tmp` sót, thư mục trùng tên `.tmp` / claim / bản sao, hai lần sao lưu cùng giây, đồng hồ lùi, bản backup bị chương trình khác giữ, tên xuất trùng tới 1 000 hậu tố) và `app-data.ts` (lần đầu / mở lại / snapshot e2e, sao lưu lúc khởi động lỗi, migrate lúc mở, `replace` lỗi ở từng bước, hai `replace` liền nhau, đóng app ở từng bước, nửa đêm khi đang sao lưu — DR-30). Chạy thật: năm probe (P1 file cũ qua `openFrom`, P2 lệnh file trên file cỡ dữ liệu tải, P3 file hỏng một trang, P4 kiểu crate, P5 file bị giữ / thư mục chỉ đọc) + 64 đột biến (§7). `stamp()` với độ lệch giờ cực lớn: `utc_offset_minutes * 60` tràn chỉ khi webview gửi số vô lý (`tauri-storage.ts:36` gửi `-getTimezoneOffset()`), bản release không bật kiểm tràn nên không panic (`panic = "abort"` không bị kích) — không nêu. Tên file Excel: `slug` (report-workbook.ts:224-233) chỉ ra ASCII khớp `is_export_name`, tên team toàn chữ không Latin cho phần scope rỗng (`bao-cao_2026-10__…xlsx`) vẫn hợp lệ. Ngoài CL-B1, CL-B2, CL-B6 không thấy lỗi.
- **C — Đúng hợp đồng:** S2-1…S2-6 (spec §4.1) ↔ `replace` / `swap` / `run` / `exportBackup` / CloseGuard: khớp, mỗi luật có test và đột biến tương ứng bị giết (MJ5–MJ11, MJ17). ADR-0016 (ghi `.tmp` → rename, giữ 10 bản, `exports\`, chỉ `std` cho lệnh file) và ADR-0009 D-1 / W-1 (URL cố định hai gói, key chỉ Rust, `x-opencode-session` 1–64 `[A-Za-z0-9-]`, `User-Agent`, timeout 120 s / 10 s, không redirect, chỉ HTTPS, trần 2 MB sau gzip): khớp từng mục (đọc + test RA1–RA18). Hợp đồng JS ↔ Rust (`tauri-contract.test.ts`): tên lệnh, tham số camelCase, header, mã lỗi, kiểu `Completion` — đọc và thấy đủ. Lệch: CL-B1, CL-B6 (spec §5 mục 4), CL-B4 (phiên bản).
- **D — Dữ liệu:** ghi nguyên tử (`write_atomic`: `File::create` → `write_all` → `sync_all` → `rename`, `.tmp` riêng mỗi tên, xóa `.tmp` khi lỗi); khóa một tiến trình (`share_mode(0)` trên `project2c.lock`) + một lệnh file một lúc (`DataLock`); lưu từ trang cũ bị từ chối (`STALE_PAGE`); hàng đợi lưu gộp bản chờ, giữ bản lỗi để `flush()` thử lại; sao lưu khởi động chờ trước mọi lần lưu (`backedUp`). Không thư mục nào ngoài `Project2C-data\` bị ghi. Không đồng bộ thư mục sau `rename` (NTFS ghi nhật ký siêu dữ liệu; mất điện ngay sau rename chỉ mất lần lưu cuối, file vẫn nguyên — đúng hệ quả ADR-0016) — không nêu. Ngoài CL-B1, CL-B2 không thấy lỗi.
- **G — Guardrail AI:** phần Rust của AI: key không bao giờ vào kết quả (`reveals` trên `content` cả dạng `\uXXXX` / `\/` / `%XX`, `finish_reason` chỉ là từ ≤ 32 chữ thường), câu lỗi server chỉ lấy `error.message` / `error` / `message`, che key + mã phiên trước khi cắt 200 ký tự; lỗi Credential Manager chỉ mang mã. Đột biến RA1, RA6, RA7, RA13, RA14 bị giết. `ureq` đọc biến môi trường proxy (`ALL_PROXY` / `HTTPS_PROXY` / `HTTP_PROXY`, `ureq-3.4.2/src/config.rs:948`): với URL `https://` chỉ là đường hầm CONNECT, TLS đầu-cuối với gốc webpki, nên proxy không đọc được header `Authorization` — không nêu. Kiểm nội dung G5 thuộc gói C.
- **S — Ranh giới:** webview không truyền đường dẫn nào (`folder` chỉ `exports` / `backups`; tên xuất lọc ASCII + đuôi `.p2cbackup` / `.xlsx`, test có `..\` và `/`); Explorer gọi bằng đường dẫn đầy đủ `%SystemRoot%\explorer.exe` (DR-54), đối số luôn bọc ngoặc kép; `open_chatgpt` chỉ mở URL hằng. CSP: `default-src 'self'`, `connect-src 'self' ipc: http://ipc.localhost` (webview không gọi mạng ngoài), `script-src 'self' 'wasm-unsafe-eval'`; thiếu `base-uri` / `form-action` (không thuộc `default-src`) nhưng app không có đường chèn HTML (React escape) → không nêu. `capabilities/default.json`: `core:default` cấp cả `core:menu:*`, `core:image:allow-from-path`, `core:tray:*`… (đọc `gen/schemas/acl-manifests.json`), nhiều hơn app cần (`core:event:allow-listen/unlisten`, `core:window:allow-destroy` cho `CloseGuard`); nhưng `tauri` build không bật `image-png` / `image-ico` / `tray-icon` (Cargo.toml:17 `features = []`), nên `from_path` trả lỗi (`tauri-2.11.6/src/image/plugin.rs:39-55`) và lệnh tray không được biên dịch → phần còn lại vô hại khi không có XSS — không nêu, chỉ ghi để phiên tổng hợp biết đã xét. Lệnh app từ origin ngoài bị Tauri chặn (không có capability `remote`). Key: không có lệnh đọc key ra webview (`ai_key_status` chỉ trả `bool`).
- **P — Hiệu năng:** §4b; không có phát hiện P.
- **B — Bloat:** §4a; CL-B5 (crate-type), `PersistQueue.unsaved()` chỉ test dùng (Nit, ghi ở bảng, không tách mục).
- **T — Chất lượng test:** 64 đột biến (Rust 34 trên bản chép, JS 30 vá tạm + trả lại nguyên byte): 58 bị giết, 6 sống. Sống có hệ quả: RS4, RS9, MJ15 → CL-B3. Sống nhưng test đơn vị không bắt được theo bản chất: RS7 (bỏ `sync_all` — độ bền khi mất điện), MJ9 (đóng DB cũ trước khi màn vẽ lại — cần React thật), MJ30 (`useQuery` không đọc lại — hook React; e2e có thể giết, không chạy e2e vì cổng 4173 dùng chung). Test giả xanh: CL-B2. Test Rust không đụng Credential Manager thật (`keyring_core::mock`, `the_key_is_stored_local_to_this_machine` chỉ `build` entry, không ghi) và không gọi mạng ngoài (server `127.0.0.1`). Không có test tự động nào chạy IPC thật exe ↔ webview (e2e chạy bản web); hợp đồng giữ bằng `tauri-contract.test.ts` đọc nguồn Rust bằng regex + NT thủ công — đúng ADR-0016 / DR-55, không nêu. Coverage riêng `src/data` (lệnh `vitest run apps/desktop/src/data --coverage`, báo cáo ra `Bcoverage`): dòng chưa chạy của gói B chỉ là giá trị mặc định (`app-data.ts:215` `seedDemo` — test truyền seed giả, `demo-snapshot.ts:20` `fetch`, `tauri-storage.ts:33` `getTimezoneOffset`).
- **A — Trợ năng / i18n:** gói B không có màn; câu lỗi Rust về webview là mã (`ALREADY_OPEN`, `DISK_FULL` dịch ở `startup-error.ts`; `AI_*` dịch ở `packages/ai`; `STALE_PAGE` chỉ là một lần lưu lỗi của trang cũ → câu chung `storage.saveFailed`); các lỗi I/O khác hiện nguyên văn tiếng Anh của Windows trong "Chi tiết kỹ thuật" (đã có câu tiếng Việt phía trên) — không nêu.

## 7. Phụ lục

### 7.1 Probe, log

Mọi file ở `C:\workspace\deep-review-1-6\claude\B\`. Probe JS import thẳng nguồn TS của repo ở SHA ghim qua `hooks.mjs` (chép của gói A, cách nạp như `tools/load-data.mjs`); probe Rust chạy trên **bản chép** crate `B\mut\` (chép `apps/desktop/src-tauri` trừ `target`, kèm `dist` và `rust-toolchain.toml`), target debug dùng chung thư mục `target` đã ignore của repo để khỏi build lại dependency; test tạm chèn vào bản chép rồi gỡ, `cmp` với file của repo sau mỗi lần.

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `hooks.mjs` | nạp TS không đuôi + `?raw` | — | mọi probe JS |
| `p1-migrate-last-save.mjs` | chạy lại kịch bản test "saves the migration of the new data while it opens", in schema của từng lần lưu | `p1-migrate-last-save.log` | CL-B2 |
| `p2-make-db.mjs` | file DB của dữ liệu tải + 11 bản cách nhau một lệnh ghi, vị trí byte khác đầu tiên | `p2-make-db.log`, `data\v00…v11.db` | §4b |
| `perf_probe.rs` | đo `save` / `open` / `backup` của `storage.rs` trên file 13 MB với 10 bản backup | `p2b-rust-perf.log` | §4b |
| `p3-damaged.mjs` | file hỏng một trang: mở, khởi động exe (storage giả), đọc bảng, ghi, xuất; giá `quick_check` / `integrity_check` | `p3-damaged.log` | CL-B1 |
| `p4-crate-type.sh` | build release bước crate app: 3 kiểu crate so với `rlib` (target riêng, đã xóa sau khi đo: 2,1 GB) | `p4-crate-type.log` | CL-B5 |
| `open_probe.rs` | `storage::open` khi file bị chương trình khác giữ / khóa chỉ đọc | `p5-open-errors.log` | CL-B6 |
| `rmut.mjs` | 34 đột biến Rust trên bản chép | `rmut.log`, `mut-baseline.log` (91 test xanh trước khi vá) | §6 T, CL-B3 |
| `jmut.mjs` | 30 đột biến JS: vá một file repo, chạy 9 file test (107 test), trả lại nguyên byte, kiểm sha256 trong `finally` | `jmut.log` | §6 T, CL-B3 |
| `b1-exports.mjs` | nơi dùng của export / thành viên interface | `b1-exports.log` | §4a |
| — | `cargo clippy --all-targets -- -W clippy::pedantic` | `clippy-pedantic.log` | §4a |
| — | `vitest run apps/desktop/src/data --coverage` (báo cáo ra `B\coverage\`, ngoài repo) | — | §6 T |

### 7.2 Đột biến (64 lần: 58 bị giết, 6 sống)

Rust: `node rmut.mjs` 10:19–10:21 (RS16 chạy lại 10:22 sau khi sửa cách vá; lần đầu lỗi biên dịch, không tính), lệnh `cargo test --lib --locked -q` trên bản chép. JS: `node jmut.mjs` 10:27–10:29, lệnh `pnpm exec vitest run` 9 file (`src/data` trừ 3 file AI, `shell/close-guard.test.ts`, `shell/startup-error.test.ts`). `git status --short` của repo ngay sau đợt JS: rỗng.

Sống: **RS4**, **RS9**, **MJ15** → CL-B3; **RS7** (bỏ `sync_all`: không test đơn vị nào thấy được độ bền khi mất điện), **MJ9** (đóng DB cũ trước khi màn vẽ lại: cần React thật), **MJ30** (`useQuery` không đọc lại: hook React, không có test đơn vị; e2e không chạy ở phiên này).

| # | Loại | File | Đột biến | Kết quả |
|---|---|---|---|---|
| RS1 | Rust (bản chép) | `storage.rs` | save no longer refuses a stale page | **KILLED** — test result: FAILED. 90 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s — storage::tests::a_save_from_the_page_before_a_reload_is_refused_once_the_new_page_opened |
| RS2 | Rust (bản chép) | `storage.rs` | prune keeps 10 before writing the 11th | **KILLED** — test result: FAILED. 83 passed; 8 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.53s — storage::tests::a_backup_made_with_the_clock_set_back_is_kept, storage::tests::a_clock_going_back_and_forth_keeps_the_ten_last_written_backups, storage::tests:: |
| RS3 | Rust (bản chép) | `storage.rs` | an identical copy is never reused | **KILLED** — test result: FAILED. 85 passed; 6 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.53s — storage::tests::a_prune_held_off_is_done_by_the_next_backup_of_the_unchanged_file, storage::tests::backup_of_an_already_copied_file_returns_the_existing_copy, s |
| RS4 | Rust (bản chép) | `storage.rs` | export names may start with a dot | **SURVIVED** — test result: ok. 91 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.52s |
| RS5 | Rust (bản chép) | `storage.rs` | open takes a file without the SQLite header | **KILLED** — test result: FAILED. 89 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.50s — storage::tests::open_refuses_a_file_that_is_not_sqlite_without_touching_the_backups, storage::tests::open_refuses_an_empty_database_file |
| RS6 | Rust (bản chép) | `storage.rs` | missing file with backups is a first start | **KILLED** — test result: FAILED. 90 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.53s — storage::tests::a_missing_file_with_backups_left_is_an_error_not_a_first_start |
| RS7 | Rust (bản chép) | `storage.rs` | write_atomic does not flush to disk | **SURVIVED** — test result: ok. 91 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.51s |
| RS8 | Rust (bản chép) | `storage.rs` | a claimed name that already has a file is used | **KILLED** — test result: FAILED. 87 passed; 4 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.51s — storage::tests::open_removes_what_an_interrupted_export_left_and_keeps_real_exports, storage::tests::write_export_never_overwrites_an_earlier_export, storage::t |
| RS9 | Rust (bản chép) | `storage.rs` | a backup is "the same" without comparing lengths | **SURVIVED** — test result: ok. 91 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.53s |
| RS10 | Rust (bản chép) | `storage.rs` | first open keeps an interrupted export .tmp | **KILLED** — test result: FAILED. 88 passed; 3 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.53s — storage::tests::open_again_in_the_same_process_keeps_a_running_export, storage::tests::open_removes_what_an_interrupted_export_left_and_keeps_real_exports, stor |
| RS11 | Rust (bản chép) | `storage.rs` | backup runs without the data lock | **KILLED** — test result: FAILED. 89 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.52s — storage::tests::each_file_command_waits_while_another_one_runs, storage::tests::two_backups_at_once_write_one_copy |
| RS12 | Rust (bản chép) | `storage.rs` | a later open does not take over the page | **KILLED** — test result: FAILED. 90 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.52s — storage::tests::a_save_from_the_page_before_a_reload_is_refused_once_the_new_page_opened |
| RS13 | Rust (bản chép) | `storage.rs` | disk full not told apart | **KILLED** — test result: FAILED. 90 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.55s — storage::tests::a_full_disk_is_reported_as_disk_full |
| RS14 | Rust (bản chép) | `storage.rs` | backup names ignore the stamp shape | **KILLED** — test result: FAILED. 89 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s — storage::tests::backup_prunes_only_backups_it_named, storage::tests::next_seq_is_one_past_the_highest_numbered_backup |
| RS15 | Rust (bản chép) | `storage.rs` | every open cleans exports (not only the first) | **KILLED** — test result: FAILED. 89 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s — storage::tests::open_again_in_the_same_process_keeps_a_running_export, storage::tests::the_first_open_cleans_exports_even_when_it_cannot_remove_the_db_tmp |
| RS16 | Rust (bản chép) | `storage.rs` | folder() takes any kind as a subfolder | **KILLED** — test result: FAILED. 90 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.51s — storage::tests::folder_takes_only_exports_or_backups_and_creates_it |
| RA1 | Rust (bản chép) | `ai.rs` | content holding the key is passed on | **KILLED** — test result: FAILED. 89 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s — ai::tests::a_reply_whose_content_holds_the_key_in_json_or_url_escapes_is_bad_response, ai::tests::a_reply_whose_content_holds_the_key_is_bad_response |
| RA2 | Rust (bản chép) | `ai.rs` | redirects are followed | **KILLED** — test result: FAILED. 89 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.52s — ai::tests::an_error_status_is_read_as_a_reply_and_a_redirect_is_not_followed, ai::tests::the_app_s_agent_speaks_only_https_follows_no_redirect_and_has_the_spec_ |
| RA3 | Rust (bản chép) | `ai.rs` | the app's agent speaks plain HTTP too | **KILLED** — test result: FAILED. 90 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s — ai::tests::the_app_s_agent_speaks_only_https_follows_no_redirect_and_has_the_spec_s_timeouts |
| RA4 | Rust (bản chép) | `ai.rs` | a 2xx over 2 MB is read | **KILLED** — test result: FAILED. 88 passed; 3 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.51s — ai::tests::a_body_is_read_to_2_mb_and_one_byte_more_shows_it_is_longer, ai::tests::a_gzip_reply_is_unpacked_and_read_to_2_mb_however_small_it_is_on_the_wire, ai |
| RA5 | Rust (bản chép) | `ai.rs` | the body is read whole (no cap) | **KILLED** — test result: FAILED. 89 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.51s — ai::tests::a_body_is_read_to_2_mb_and_one_byte_more_shows_it_is_longer, ai::tests::a_gzip_reply_is_unpacked_and_read_to_2_mb_however_small_it_is_on_the_wire |
| RA6 | Rust (bản chép) | `ai.rs` | the server message is not masked | **KILLED** — test result: FAILED. 89 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s — ai::tests::no_error_carries_the_key_or_the_session, ai::tests::the_key_and_the_session_are_masked_in_url_and_json_escapes_too |
| RA7 | Rust (bản chép) | `ai.rs` | URL escapes are not undone | **KILLED** — test result: FAILED. 89 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s — ai::tests::a_reply_whose_content_holds_the_key_in_json_or_url_escapes_is_bad_response, ai::tests::the_key_and_the_session_are_masked_in_url_and_json_escapes_too |
| RA8 | Rust (bản chép) | `ai.rs` | any reasoning effort is sent | **KILLED** — test result: FAILED. 90 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.55s — ai::tests::wrong_arguments_are_bad_request_and_reach_neither_the_key_nor_the_network |
| RA9 | Rust (bản chép) | `ai.rs` | no cap on message characters | **KILLED** — test result: FAILED. 90 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.56s — ai::tests::wrong_arguments_are_bad_request_and_reach_neither_the_key_nor_the_network |
| RA10 | Rust (bản chép) | `ai.rs` | max_tokens 0 allowed | **KILLED** — test result: FAILED. 90 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.53s — ai::tests::wrong_arguments_are_bad_request_and_reach_neither_the_key_nor_the_network |
| RA11 | Rust (bản chép) | `ai.rs` | no busy flag | **KILLED** — test result: FAILED. 89 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.52s — ai::tests::a_second_request_while_one_runs_is_busy_and_reaches_no_network, ai::tests::the_flag_is_held_during_the_call_and_cleared_after_a_reply_an_error_or_a_t |
| RA12 | Rust (bản chép) | `ai.rs` | a connect timeout is a timeout | **KILLED** — test result: FAILED. 89 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.52s — ai::tests::a_server_that_never_answers_the_tls_handshake_is_a_network_error, ai::tests::transport_errors_map_to_timeout_or_network |
| RA13 | Rust (bản chép) | `ai.rs` | a key with any character is stored | **KILLED** — test result: FAILED. 89 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.52s — ai::tests::a_key_that_is_empty_over_512_characters_or_not_printable_ascii_is_bad_request_and_not_stored, ai::tests::no_error_carries_the_key_or_the_session |
| RA14 | Rust (bản chép) | `ai.rs` | finish_reason of any characters | **KILLED** — test result: FAILED. 90 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s — ai::tests::a_finish_reason_reaches_the_webview_only_as_a_short_word |
| RA15 | Rust (bản chép) | `ai.rs` | keyring errors pass NoEntry on delete as an error | **KILLED** — test result: FAILED. 90 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s — ai::tests::a_key_is_stored_trimmed_and_reported_until_deleted |
| RA16 | Rust (bản chép) | `ai.rs` | session id may hold any ASCII | **KILLED** — test result: FAILED. 90 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.52s — ai::tests::wrong_arguments_are_bad_request_and_reach_neither_the_key_nor_the_network |
| RA17 | Rust (bản chép) | `ai.rs` | empty model allowed | **KILLED** — test result: FAILED. 90 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.53s — ai::tests::wrong_arguments_are_bad_request_and_reach_neither_the_key_nor_the_network |
| RA18 | Rust (bản chép) | `ai.rs` | a cut reply before content is bad | **KILLED** — test result: FAILED. 90 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s — ai::tests::a_reply_cut_before_any_content_is_an_empty_cut_answer |
| MJ1 | JS (vá tạm repo) | `persist-queue.ts` | a failed snapshot is not kept for flush() | **KILLED** — Tests  3 failed |
| MJ2 | JS (vá tạm repo) | `persist-queue.ts` | flush() rewrites the failed snapshot even while a newer one runs | **KILLED** — Tests  1 failed |
| MJ3 | JS (vá tạm repo) | `persist-queue.ts` | unsaved() ignores a failed snapshot | **KILLED** — Tests  2 failed |
| MJ4 | JS (vá tạm repo) | `persist-queue.ts` | a success does not clear failed() | **KILLED** — Tests  5 failed |
| MJ5 | JS (vá tạm repo) | `app-data.ts` | run() writes while the data is replaced | **KILLED** — Tests  1 failed |
| MJ6 | JS (vá tạm repo) | `app-data.ts` | replace goes on after a failed save | **KILLED** — Tests  5 failed |
| MJ7 | JS (vá tạm repo) | `app-data.ts` | every database ever opened saves | **KILLED** — Tests  1 failed |
| MJ8 | JS (vá tạm repo) | `app-data.ts` | the new database does not save while it opens | **KILLED** — Tests  2 failed |
| MJ9 | JS (vá tạm repo) | `app-data.ts` | the old database closes before the screens re-render | **SURVIVED** — Tests  107 passed (107) |
| MJ10 | JS (vá tạm repo) | `app-data.ts` | generation grows before the new data opened | **KILLED** — Tests  1 failed |
| MJ11 | JS (vá tạm repo) | `app-data.ts` | a failed replace leaves writes locked | **KILLED** — Tests  10 failed |
| MJ12 | JS (vá tạm repo) | `app-data.ts` | saves are let through before the startup backup | **KILLED** — Tests  1 failed |
| MJ13 | JS (vá tạm repo) | `app-data.ts` | a new database is not saved on first start | **KILLED** — Tests  8 failed |
| MJ14 | JS (vá tạm repo) | `app-data.ts` | Nạp lại drops Settings → AI | **KILLED** — Tests  1 failed |
| MJ15 | JS (vá tạm repo) | `app-data.ts` | the read backup database is never closed | **SURVIVED** — Tests  107 passed (107) |
| MJ16 | JS (vá tạm repo) | `app-data.ts` | the pinned day is not put on the database clock | **KILLED** — Tests 4 ⎯⎯⎯⎯⎯⎯⎯ — app-data.test.ts > openAppData > dates the database's writes and checks on the app's day, also after new data |
| MJ17 | JS (vá tạm repo) | `app-data.ts` | replaces run at once, not in turn | **KILLED** — Tests  1 failed |
| MJ18 | JS (vá tạm repo) | `app-data.ts` | the anchor day is read before the backup | **KILLED** — Tests  1 failed |
| MJ19 | JS (vá tạm repo) | `app-data.ts` | the startup backup failure is not wrapped | **KILLED** — Tests  1 failed |
| MJ20 | JS (vá tạm repo) | `app-data.ts` | the demo-data database is not closed | **KILLED** — Tests  1 failed |
| MJ21 | JS (vá tạm repo) | `tauri-storage.ts` | an empty db_open reply is a file | **KILLED** — Tests  1 failed |
| MJ22 | JS (vá tạm repo) | `tauri-storage.ts` | backup names in UTC | **KILLED** — Tests  1 failed |
| MJ23 | JS (vá tạm repo) | `tauri-storage.ts` | every load of the page has the same name | **KILLED** — Tests  1 failed |
| MJ24 | JS (vá tạm repo) | `today.ts` | a new day object on every read | **KILLED** — Tests  1 failed |
| MJ25 | JS (vá tạm repo) | `today.ts` | no re-read when the window gets focus | **KILLED** — Tests  1 failed |
| MJ26 | JS (vá tạm repo) | `today.ts` | the midnight timer fires only once | **KILLED** — Tests  1 failed |
| MJ27 | JS (vá tạm repo) | `tables.ts` | tables read again on every ask | **KILLED** — Tests  1 failed |
| MJ28 | JS (vá tạm repo) | `tables.ts` | customers not sorted by name | **KILLED** — Tests  1 failed |
| MJ29 | JS (vá tạm repo) | `demo-snapshot.ts` | any file is taken as a database | **KILLED** — Tests  1 failed |
| MJ30 | JS (vá tạm repo) | `AppDataContext.tsx` | useQuery does not re-read after a change | **SURVIVED** — Tests  107 passed (107) |

### 7.3 Nguồn probe / test tạm

Danh sách vá của đột biến nằm trong `rmut.mjs` / `jmut.mjs` (mảng `MUTANTS`, dạng [id, file, mô tả, từ, thành]); bảng §7.2 ghi mô tả. Nguồn các probe dùng làm bằng chứng:

#### `B\p1-migrate-last-save.mjs`

```js
// P1: after importing an older-schema file, which bytes end up as the LAST save on disk?
// Replays app-data.test.ts "saves the migration of the new data while it opens …" (review of PR 206)
// and checks the schema version of every save after the backup, not only that the first one differs.
// Run: node --import ./hooks.mjs p1-migrate-last-save.mjs
const R = 'file:///C:/workspace/Project-2C-review/';
const { openAppData } = await import(`${R}apps/desktop/src/data/app-data.ts`);
const db = await import(`${R}packages/db/src/index.ts`);
const { calendarDate } = await import(`${R}packages/domain/src/index.ts`);
const initSqlJs = (await import(`${R}packages/db/node_modules/sql.js/dist/sql-wasm.js`)).default;

const SQL = await initSqlJs();
const versionOf = (bytes) => {
  const raw = new SQL.Database(bytes);
  try {
    const has = raw.exec("SELECT 1 FROM sqlite_master WHERE name = 'schema_migrations'").length > 0;
    return has ? Number(raw.exec('SELECT coalesce(max(id),0) FROM schema_migrations')[0].values[0][0]) : 0;
  } finally {
    raw.close();
  }
};

const TODAY = calendarDate(2026, 9, 27);
const fakeSeed = (d, anchor) => db.createTeam(d, { name: `Seed ${anchor.day}/${anchor.month}` });
const saves = [];
let release;
const gate = new Promise((r) => (release = r));
let started;
const backupStarted = new Promise((r) => (started = r));
let holding = false;
const storage = {
  load: async () => undefined,
  save: async (bytes) => void saves.push(bytes),
  backup: async () => {
    if (holding) {
      started();
      await gate;
    }
    return 'b.db';
  },
  writeExport: async () => 'x',
  latestBackup: async () => undefined,
  openFolder: async () => {},
};
const app = await openAppData({ storage, today: () => TODAY, seed: fakeSeed });
app.run((d) => db.createTeam(d, { name: 'Sao Mai' }));
await app.saves.idle();

// The preview of the test: any backup, its bytes swapped for a file from before every migration.
const source = await openAppData({ seed: (d) => db.createTeam(d, { name: 'x' }) });
const preview = await app.readBackup((await source.exportBackup()).text);
const older = (await db.openDatabase({ migrations: [] })).export();
console.log('LATEST_SCHEMA_VERSION', db.LATEST_SCHEMA_VERSION, '| older file version', versionOf(older));

holding = true;
const importing = app.importBackup({ ...preview, bytes: older });
await backupStarted;
const backedUp = saves.length;
release();
await importing;
await app.saves.idle();

const after = saves.slice(backedUp);
console.log('saves after the backup:', after.length);
after.forEach((bytes, i) =>
  console.log(`  save #${i + 1}: schema version ${versionOf(bytes)}, ${bytes.byteLength} B, same bytes as older: ${Buffer.compare(Buffer.from(bytes), Buffer.from(older)) === 0}`),
);
console.log('in-memory db schemaVersion():', app.db().schemaVersion());
console.log('LAST file on disk is migrated:', versionOf(saves.at(-1)) === db.LATEST_SCHEMA_VERSION);
```

#### `B\p3-damaged.mjs`

```js
// P3: a database file damaged INSIDE (one b-tree page in the middle), as bit rot / a bad sector /
// a program writing into it would leave it. Does the exe's startup (openAppData with a storage
// port) open it, back it up as the newest backup (DR-51 says a damaged file never becomes one),
// and save over it? What do the screens' reads do? What would a check cost?
// Run: node --import ./hooks.mjs p3-damaged.mjs
import { readFileSync } from 'node:fs';
const R = 'file:///C:/workspace/Project-2C-review/';
const { openAppData } = await import(`${R}apps/desktop/src/data/app-data.ts`);
const db = await import(`${R}packages/db/src/index.ts`);
const { calendarDate } = await import(`${R}packages/domain/src/index.ts`);

const good = readFileSync('C:/workspace/deep-review-1-6/claude/B/data/v00.db');
const pageSize = good.readUInt16BE(16);
const pages = good.length / pageSize;
console.log(`file ${good.length} B, page size ${pageSize}, ${pages} pages`);

// Find which pages belong to which table with a check on the good file (sql.js has no dbstat):
// damage page n, then see which list* read fails.
const reads = {
  teams: db.listTeams, people: db.listPeople, customers: db.listCustomers,
  appointments: db.listAppointments, policies: db.listPolicies, transitions: db.listStageTransitions,
};
const now = () => new Date('2026-10-12T05:00:00Z');

async function tryPage(n, how) {
  const bytes = new Uint8Array(good);
  const at = (n - 1) * pageSize;
  if (how === 'header') bytes[at] = 0x00; // b-tree page type → invalid
  else bytes.fill(0x5a, at, at + pageSize); // whole page overwritten
  const result = { page: n, how, open: '?', failing: [] };
  let opened;
  try {
    opened = await db.openDatabase({ bytes, now });
    result.open = 'ok';
  } catch (e) {
    result.open = `FAILS: ${e.message}`;
    return result;
  }
  for (const [name, read] of Object.entries(reads)) {
    try { read(opened); } catch (e) { result.failing.push(`${name}: ${e.message}`); }
  }
  const t = performance.now();
  let quick; try { quick = opened.sqlite.exec('PRAGMA quick_check')[0].values.slice(0, 2).map((v) => v[0]); } catch (e) { quick = 'THROWS ' + e.message; }
  result.quickCheck = { ms: +(performance.now() - t).toFixed(1), says: quick };
  opened.sqlite.close();
  return result;
}

for (const n of [Math.floor(pages * 0.25), Math.floor(pages * 0.5), Math.floor(pages * 0.75)]) {
  for (const how of ['header', 'fill']) console.log(JSON.stringify(await tryPage(n, how)));
}

// The exe's startup on the damaged file (page at 50 %, whole page overwritten).
const damaged = new Uint8Array(good);
const mid = Math.floor(pages * 0.5);
damaged.fill(0x5a, (mid - 1) * pageSize, mid * pageSize);
const events = [];
const saves = [];
const storage = {
  load: async () => damaged,
  save: async (bytes) => { events.push('save'); saves.push(bytes); },
  backup: async () => { events.push('backup (copies the file on disk = the damaged one)'); return 'project2c-s00000011-….db'; },
  writeExport: async () => 'x', latestBackup: async () => undefined, openFolder: async () => {},
};
let app;
try {
  app = await openAppData({ storage, today: () => calendarDate(2026, 10, 12) });
  console.log('startup: app OPENED on the damaged file; storage calls:', events);
} catch (e) {
  console.log('startup: refused —', e.message, events);
}
if (app) {
  const t = app.tables();
  for (const name of Object.keys(reads)) {
    try { console.log(`  tables().${name}: ${t[name].length} rows`); } catch (e) { console.log(`  tables().${name}: THROWS ${e.message}`); }
  }
  try { console.log('  counts():', JSON.stringify(app.counts())); } catch (e) { console.log('  counts(): THROWS', e.message); }
  // A write on a page that is fine: saved, the damage goes with it.
  try {
    app.run((d) => db.createTeam(d, { name: 'Team sau khi hỏng' }));
    await app.saves.idle();
    console.log('  a write after startup: saved', saves.length, 'file(s); the saved file still damaged:', (await tryBytes(saves.at(-1))));
  } catch (e) { console.log('  write: THROWS', e.message); }
  try { const text = (await app.exportBackup()).text; console.log('  exportBackup: ok', text.length); } catch (e) { console.log('  exportBackup: THROWS', e.message); }
}
async function tryBytes(bytes) {
  const d = await db.openDatabase({ bytes, now });
  try { return d.sqlite.exec('PRAGMA quick_check')[0].values[0][0] !== 'ok'; } catch (e) { return 'quick_check THROWS ' + e.message; } finally { d.sqlite.close(); }
}

// What a check costs on the good file (13 MB, load data).
const ok = await db.openDatabase({ bytes: new Uint8Array(good), now });
for (const pragma of ['quick_check', 'integrity_check']) {
  const times = [];
  let says;
  for (let i = 0; i < 5; i++) { const t = performance.now(); says = ok.sqlite.exec(`PRAGMA ${pragma}`)[0].values[0][0]; times.push(performance.now() - t); }
  times.sort((a, b) => a - b);
  console.log(`PRAGMA ${pragma} on the good load file: median ${times[2].toFixed(1)} ms (min ${times[0].toFixed(1)}, max ${times[4].toFixed(1)}) → ${says}`);
}
```

#### `B\open_probe.rs`

```rust
//! P5 (copy only): what `storage::open` returns when the database file is fine but cannot be read
//! right now (another program holds it without sharing), and when the data folder cannot be
//! written (read-only `project2c.lock`). The app shows any such error as "storage.openFailed".
use crate::storage::{open, save, DataLock};
use std::os::windows::fs::OpenOptionsExt;
use std::path::PathBuf;

fn dir(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join(format!("p2c-open-probe-{name}-{}", std::process::id()));
    let _ = std::fs::remove_dir_all(&d);
    d
}

#[test]
#[ignore]
fn open_probe_a_file_held_by_another_program() {
    let d = dir("held");
    let db = [b"SQLite format 3\0".as_slice(), b"data"].concat();
    save(&d, &db, "p", &DataLock::new()).unwrap();
    // A program that opened the file without sharing (share_mode 0).
    let holder = std::fs::OpenOptions::new()
        .read(true)
        .share_mode(0)
        .open(d.join("project2c.db"))
        .unwrap();
    let error = open(&d, "p", &DataLock::new()).unwrap_err();
    println!("held db file → kind {:?}, raw {:?}, message to the webview: {:?}", error.kind(), error.raw_os_error(), error.to_string());
    drop(holder);
    let ok = open(&d, "p", &DataLock::new()).unwrap();
    println!("after the program let go → opens: {}", ok.is_some());
    let _ = std::fs::remove_dir_all(&d);
}

#[test]
#[ignore]
fn open_probe_a_read_only_lock_file() {
    let d = dir("ro");
    let db = [b"SQLite format 3\0".as_slice(), b"data"].concat();
    save(&d, &db, "p", &DataLock::new()).unwrap();
    let lock = d.join("project2c.lock");
    std::fs::write(&lock, b"").unwrap();
    let mut perms = std::fs::metadata(&lock).unwrap().permissions();
    perms.set_readonly(true);
    std::fs::set_permissions(&lock, perms.clone()).unwrap();
    let error = open(&d, "p", &DataLock::new()).unwrap_err();
    println!("read-only lock file → kind {:?}, raw {:?}, message: {:?}", error.kind(), error.raw_os_error(), error.to_string());
    perms.set_readonly(false);
    std::fs::set_permissions(&lock, perms).unwrap();
    let _ = std::fs::remove_dir_all(&d);
}
```

#### `B\perf_probe.rs`

```rust
//! P2b (copy only, never in the repo): times the file commands on a load-size database file.
//! Run: cargo test --lib perf_probe -- --ignored --nocapture --test-threads=1
use crate::storage::{backup, open, save, DataLock};
use std::path::PathBuf;
use std::time::Instant;

const DATA: &str = r"C:\workspace\deep-review-1-6\claude\B\data";

fn file(i: usize) -> Vec<u8> {
    std::fs::read(format!(r"{DATA}\v{i:02}.db")).unwrap()
}

fn ms(start: Instant) -> f64 {
    start.elapsed().as_secs_f64() * 1000.0
}

fn median(mut v: Vec<f64>) -> f64 {
    v.sort_by(|a, b| a.partial_cmp(b).unwrap());
    v[v.len() / 2]
}

#[test]
#[ignore]
fn perf_probe_file_commands_on_the_load_data() {
    let dir: PathBuf = PathBuf::from(DATA).join("run");
    let _ = std::fs::remove_dir_all(&dir);
    let lock = DataLock::new();
    let page = "p";
    // Ten starts on ten different files: ten backups, as after ten days of use.
    for i in 0..10 {
        save(&dir, &file(i), page, &lock).unwrap();
        backup(&dir, &format!("202610{:02}-080000", i + 1), &lock).unwrap();
    }
    let bytes = file(10);
    let (mut saves, mut opens, mut miss, mut hit) = (vec![], vec![], vec![], vec![]);
    for _ in 0..7 {
        let t = Instant::now();
        save(&dir, &bytes, page, &lock).unwrap();
        saves.push(ms(t));
        let t = Instant::now();
        let read = open(&dir, page, &lock).unwrap().unwrap();
        opens.push(ms(t));
        assert_eq!(read.len(), bytes.len());
        // An unchanged file: its copy is the newest backup.
        let t = Instant::now();
        backup(&dir, "20261020-080000", &lock).unwrap();
        hit.push(ms(t));
    }
    // A changed file (a start after a day of use): compared with all ten, then written.
    for i in 0..5 {
        let mut changed = bytes.clone();
        changed[27] = changed[27].wrapping_add(1 + i as u8);
        save(&dir, &changed, page, &lock).unwrap();
        let t = Instant::now();
        backup(&dir, &format!("2026102{i}-080000"), &lock).unwrap();
        miss.push(ms(t));
    }
    // Worst case of find_copy: the file equals the OLDEST backup (nine others read to byte 27,
    // then the oldest read whole).
    let names: Vec<_> = std::fs::read_dir(dir.join("backups"))
        .unwrap()
        .map(|e| e.unwrap().file_name().into_string().unwrap())
        .collect();
    let mut sorted = names.clone();
    sorted.sort();
    let oldest = std::fs::read(dir.join("backups").join(&sorted[0])).unwrap();
    save(&dir, &oldest, page, &lock).unwrap();
    let t = Instant::now();
    backup(&dir, "20261030-080000", &lock).unwrap();
    let worst = ms(t);
    println!(
        "bytes {} | save median {:.1} ms {:?} | open median {:.1} ms | backup unchanged (reuse newest) median {:.1} ms | backup changed (write copy) median {:.1} ms {:?} | backup reuse oldest {:.1} ms",
        bytes.len(),
        median(saves.clone()),
        saves.iter().map(|v| v.round()).collect::<Vec<_>>(),
        median(opens),
        median(hit),
        median(miss.clone()),
        miss.iter().map(|v| v.round()).collect::<Vec<_>>(),
        worst
    );
    let _ = std::fs::remove_dir_all(&dir);
}
```

#### `B\p2-make-db.mjs`

```js
// P2a: the database file of the load data (common\load\…seed6) as the exe would save it, plus
// variants one write apart (the backups of later starts), and where two successive files first
// differ (DR-53: find_copy leaves a same-size backup at its first difference).
// Run: node --import ./hooks.mjs p2-make-db.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const R = 'file:///C:/workspace/Project-2C-review/';
const db = await import(`${R}packages/db/src/index.ts`);

const out = 'C:/workspace/deep-review-1-6/claude/B/data';
mkdirSync(out, { recursive: true });
const text = readFileSync('C:/workspace/deep-review-1-6/common/load/load-2026-10-12-seed6.p2cbackup', 'utf8');
const now = () => new Date('2026-10-12T05:00:00Z');
let t = performance.now();
const imported = await db.importBackup(text, { now });
console.log('importBackup ms', (performance.now() - t).toFixed(1));
const files = [];
t = performance.now();
files.push(imported.db.export());
console.log('export ms', (performance.now() - t).toFixed(1), 'bytes', files[0].byteLength);
const team = db.listTeams(imported.db)[0];
for (let i = 1; i <= 11; i++) {
  db.renameTeam(imported.db, team.id, `Team đo ${i}`);
  files.push(imported.db.export());
}
const firstDiff = (a, b) => {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return i;
  return a.length === b.length ? -1 : n;
};
for (let i = 1; i < files.length; i++) {
  console.log(`file ${i}: ${files[i].byteLength} B, first byte differing from file ${i - 1}: ${firstDiff(files[i - 1], files[i])}, from file 0: ${firstDiff(files[0], files[i])}`);
}
files.forEach((bytes, i) => writeFileSync(`${out}/v${String(i).padStart(2, '0')}.db`, bytes));
console.log('header bytes 24..27 (change counter) of v00..v03:', files.slice(0, 4).map((f) => Buffer.from(f.subarray(24, 28)).toString('hex')).join(' '));
```

#### `B\p4-crate-type.sh`

```bash
#!/usr/bin/env bash
# P4: build cost of crate-type = ["staticlib", "cdylib", "rlib"] (Cargo.toml:11) for the exe, on the
# COPY of the crate (B/mut), own target dir (B/target-rel), release profile as `tauri build`
# (feature tauri/custom-protocol). Times only the last step (the project crate itself) after a
# touch, with the three crate types and with rlib only. The copy is restored at the end.
set -u
B=/c/workspace/deep-review-1-6/claude/B
C=$B/mut/apps/desktop/src-tauri
export CARGO_TARGET_DIR=$B/target-rel
cd $B/mut
build() { cargo build --release --locked --manifest-path $C/Cargo.toml --features tauri/custom-protocol 2>&1 | tail -1; }
cp $C/Cargo.toml $B/Cargo.toml.orig
echo "== warm (all deps) =="; s=$(date +%s); build; echo "warm: $(( $(date +%s) - s )) s"
for round in 1 2 3; do
  touch $C/src/lib.rs; s=$(date +%s%N); build; echo "three crate types, round $round: $(( ($(date +%s%N) - s) / 1000000 )) ms"
done
ls -la $CARGO_TARGET_DIR/release/deps/project2c_lib.* | awk '{print $5, $9}'
sed -i 's/crate-type = \["staticlib", "cdylib", "rlib"\]/crate-type = ["rlib"]/' $C/Cargo.toml
grep -n crate-type $C/Cargo.toml
build >/dev/null
for round in 1 2 3; do
  touch $C/src/lib.rs; s=$(date +%s%N); build; echo "rlib only, round $round: $(( ($(date +%s%N) - s) / 1000000 )) ms"
done
ls -la $CARGO_TARGET_DIR/release/project2c.exe | awk '{print "exe (rlib only)", $5}'
cp $B/Cargo.toml.orig $C/Cargo.toml && rm $B/Cargo.toml.orig
cmp $C/Cargo.toml /c/workspace/Project-2C-review/apps/desktop/src-tauri/Cargo.toml && echo "copy Cargo.toml restored"
```

#### `B\rmut.mjs`

```js
// Rust mutation runner for gói B: patches the COPY of src-tauri under ./mut (never the repo),
// runs `cargo test --lib`, restores the file byte for byte, records KILLED / SURVIVED.
// Usage: node rmut.mjs [ID…]   (CARGO_TARGET_DIR = the repo's ignored target dir, for cached deps)
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const here = import.meta.dirname;
const crate = join(here, 'mut', 'apps', 'desktop', 'src-tauri');
const src = (file) => join(crate, 'src', file);
const log = join(here, 'rmut.log');

/** [id, file, what, from, to] — `from` must occur exactly once. */
const MUTANTS = [
  ['RS1', 'storage.rs', 'save no longer refuses a stale page', 'if held.page.as_deref().is_some_and(|opened| opened != page) {', 'if false {'],
  ['RS2', 'storage.rs', 'prune keeps 10 before writing the 11th', 'prune_backups(backups, KEEP_BACKUPS - 1, None);', 'prune_backups(backups, KEEP_BACKUPS, None);'],
  ['RS3', 'storage.rs', 'an identical copy is never reused', 'if let Some(name) = find_copy(backups, bytes) {', 'if let Some(name) = None::<String> {'],
  ['RS4', 'storage.rs', 'export names may start with a dot', "        && !name.starts_with('.')\n", ''],
  ['RS5', 'storage.rs', 'open takes a file without the SQLite header', 'if !bytes.starts_with(SQLITE_HEADER) {', 'if false {'],
  ['RS6', 'storage.rs', 'missing file with backups is a first start', "Err(error) if error.kind() == ErrorKind::NotFound && !backup_names(&backups).is_empty() => {", 'Err(error) if false && error.kind() == ErrorKind::NotFound => {'],
  ['RS7', 'storage.rs', 'write_atomic does not flush to disk', '        file.sync_all()?;\n', ''],
  ['RS8', 'storage.rs', 'a claimed name that already has a file is used', 'Ok(_) if fs::symlink_metadata(exports.join(&candidate)).is_ok() => {', 'Ok(_) if false => {'],
  ['RS9', 'storage.rs', 'a backup is "the same" without comparing lengths', 'if file.metadata()?.len() != bytes.len() as u64 {', 'if false {'],
  ['RS10', 'storage.rs', 'first open keeps an interrupted export .tmp', '                || name.ends_with(&format!("{extension}.tmp"))\n', ''],
  ['RS11', 'storage.rs', 'backup runs without the data lock', '    let _held = lock.hold();\n    let bytes = fs::read(dir.join(DB_FILE))?;', '    let bytes = fs::read(dir.join(DB_FILE))?;'],
  ['RS12', 'storage.rs', 'a later open does not take over the page', '    held.page = Some(page.to_owned());', '    if held.page.is_none() { held.page = Some(page.to_owned()); }'],
  ['RS13', 'storage.rs', 'disk full not told apart', 'if error.kind() == ErrorKind::StorageFull {', 'if false {'],
  ['RS14', 'storage.rs', 'backup names ignore the stamp shape', 'if !all_digits(seq) || !is_stamp(stamp) {', 'if !all_digits(seq) {'],
  ['RS15', 'storage.rs', 'every open cleans exports (not only the first)', "    if held.file.is_none() {\n        held.file = Some(open_lock_file(&dir.join(LOCK_FILE))?);\n        // What a crash left", "    remove_interrupted_exports(&dir.join(EXPORT_DIR));\n    if held.file.is_none() {\n        held.file = Some(open_lock_file(&dir.join(LOCK_FILE))?);\n        // What a crash left"],
  ['RS16', 'storage.rs', 'folder() takes any kind as a subfolder', '        _ => {\n            return Err(io::Error::new(\n                ErrorKind::InvalidInput,\n                format!("unknown folder: {kind}"),\n            ))\n        }', '        other => other,'],
  ['RA1', 'ai.rs', 'content holding the key is passed on', '    if reveals(content, key) {', '    if false {'],
  ['RA2', 'ai.rs', 'redirects are followed', '        .max_redirects(0)', '        .max_redirects(5)'],
  ['RA3', 'ai.rs', "the app's agent speaks plain HTTP too", 'agent_with(TIMEOUT, CONNECT_TIMEOUT, true)', 'agent_with(TIMEOUT, CONNECT_TIMEOUT, false)'],
  ['RA4', 'ai.rs', 'a 2xx over 2 MB is read', '    if body.len() as u64 > MAX_BODY {', '    if false {'],
  ['RA5', 'ai.rs', 'the body is read whole (no cap)', '        .take(MAX_BODY + 1)', '        .take(u64::MAX)'],
  ['RA6', 'ai.rs', 'the server message is not masked', '.fold(message.to_owned(), |text, secret| mask(&text, secret));', '.fold(message.to_owned(), |text, _secret| text);'],
  ['RA7', 'ai.rs', 'URL escapes are not undone', "            ('%', _) => hex(at + 1, 2).map(|c| (c, 3)),", "            ('%', _) => None,"],
  ['RA8', 'ai.rs', 'any reasoning effort is sent', '.is_none_or(|effort| REASONING.contains(&effort))', '.is_none_or(|_| true)'],
  ['RA9', 'ai.rs', 'no cap on message characters', '        && chars <= MAX_MESSAGE_CHARS;', '        && chars <= usize::MAX;'],
  ['RA10', 'ai.rs', 'max_tokens 0 allowed', '(1..=MAX_TOKENS).contains(&request.max_tokens)', '(0..=MAX_TOKENS).contains(&request.max_tokens)'],
  ['RA11', 'ai.rs', 'no busy flag', '    let _running = busy.start()?;', '    let _running = ();'],
  ['RA12', 'ai.rs', 'a connect timeout is a timeout', '        ureq::Error::Timeout(ureq::Timeout::Resolve | ureq::Timeout::Connect) => AI_NETWORK,\n', ''],
  ['RA13', 'ai.rs', 'a key with any character is stored', 'key.bytes().all(|byte| byte.is_ascii_graphic())', 'true'],
  ['RA14', 'ai.rs', 'finish_reason of any characters', ".all(|byte| byte.is_ascii_lowercase() || byte == b'_')", '.all(|_| true)'],
  ['RA15', 'ai.rs', 'keyring errors pass NoEntry on delete as an error', '        Ok(()) | Err(KeyringError::NoEntry) => Ok(()),', '        Ok(()) => Ok(()),'],
  ['RA16', 'ai.rs', 'session id may hold any ASCII', ".all(|byte| byte.is_ascii_alphanumeric() || byte == b'-')", '.all(|byte| byte.is_ascii())'],
  ['RA17', 'ai.rs', 'empty model allowed', '        && !request.model.is_empty()\n', ''],
  ['RA18', 'ai.rs', 'a cut reply before content is bad', "choice[\"message\"][\"content\"].is_null() && choice[\"finish_reason\"] == \"length\";", 'false;'],
];

const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const only = process.argv.slice(2);
for (const [id, file, what, from, to] of MUTANTS) {
  if (only.length && !only.includes(id)) continue;
  const path = src(file);
  const original = readFileSync(path);
  const text = original.toString('utf8');
  const count = text.split(from).length - 1;
  if (count !== 1) {
    appendFileSync(log, `${id} | ${file} | ${what} | NOT APPLIED (found ${count}×)\n`);
    console.log(id, 'NOT APPLIED', count);
    continue;
  }
  writeFileSync(path, text.replace(from, to));
  let result;
  try {
    const out = execFileSync('cargo', ['test', '--manifest-path', join(crate, 'Cargo.toml'), '--lib', '--locked', '-q'], {
      cwd: join(here, 'mut'),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, CARGO_TARGET_DIR: 'C:\\workspace\\Project-2C-review\\apps\\desktop\\src-tauri\\target' },
      timeout: 600_000,
    });
    const summary = /test result: .*/.exec(out)?.[0] ?? out.slice(-200);
    result = `SURVIVED — ${summary}`;
  } catch (error) {
    const out = `${error.stdout ?? ''}${error.stderr ?? ''}`;
    const summary = /test result: .*/.exec(out)?.[0];
    const failed = [...out.matchAll(/^    (\S+)$/gm)].map((m) => m[1]).filter((n) => n.includes('::')).slice(0, 4);
    result = summary
      ? `KILLED — ${summary} — ${failed.join(', ')}`
      : `COMPILE ERROR — ${out.split('\n').find((l) => l.startsWith('error')) ?? out.slice(0, 200)}`;
  } finally {
    writeFileSync(path, original);
    if (sha(readFileSync(path)) !== sha(original)) throw new Error(`restore failed for ${path}`);
  }
  const line = `${id} | ${file} | ${what} | ${result}`;
  appendFileSync(log, `${line}\n`);
  console.log(line);
}
```

#### `B\jmut.mjs`

```js
// JS mutation runner for gói B (T axis), as gói A's: patches ONE repo file at a time, runs the
// data tests, restores the file byte for byte in `finally` and checks it (prompt rule 1).
import { createHash } from 'node:crypto';
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const ROOT = 'C:/workspace/Project-2C-review/';
const LOG = 'C:/workspace/deep-review-1-6/claude/B/jmut.log';
const D = 'apps/desktop/src/data/';
const TESTS = [`${D}app-data.test.ts`, `${D}persist-queue.test.ts`, `${D}tauri-storage.test.ts`, `${D}tauri-contract.test.ts`, `${D}tables.test.ts`, `${D}today.test.ts`, `${D}demo-snapshot.test.ts`, 'apps/desktop/src/shell/close-guard.test.ts', 'apps/desktop/src/shell/startup-error.test.ts'];

const MUTANTS = [
  ['MJ1', 'persist-queue.ts', 'a failed snapshot is not kept for flush()', '        lost = bytes;\n', ''],
  ['MJ2', 'persist-queue.ts', 'flush() rewrites the failed snapshot even while a newer one runs', 'if (!running && lost) persist(lost);', 'if (lost) persist(lost);'],
  ['MJ3', 'persist-queue.ts', 'unsaved() ignores a failed snapshot', 'unsaved: () => running !== undefined || lost !== undefined,', 'unsaved: () => running !== undefined,'],
  ['MJ4', 'persist-queue.ts', 'a success does not clear failed()', '        lost = undefined;\n        setFailed(false);', '        lost = undefined;'],
  ['MJ5', 'app-data.ts', 'run() writes while the data is replaced', "    if (replacing > 0) throw new DbError('DATA_REPLACING');\n", ''],
  ['MJ6', 'app-data.ts', 'replace goes on after a failed save', '    if (saves.failed()) throw new Error(UNSAVED_CHANGES);\n', ''],
  ['MJ7', 'app-data.ts', 'every database ever opened saves', 'if (mine === current || mine === opening) saves.persist(snapshot);', 'saves.persist(snapshot);'],
  ['MJ8', 'app-data.ts', 'the new database does not save while it opens', 'if (mine === current || mine === opening) saves.persist(snapshot);', 'if (mine === current) saves.persist(snapshot);'],
  ['MJ9', 'app-data.ts', 'the old database closes before the screens re-render', '    await new Promise((resolve) => setTimeout(resolve, 0));\n    previous.sqlite.close();', '    previous.sqlite.close();'],
  ['MJ10', 'app-data.ts', 'generation grows before the new data opened', '    const previous = db;\n    db = await next();\n    generation++;', '    const previous = db;\n    generation++;\n    db = await next();'],
  ['MJ11', 'app-data.ts', 'a failed replace leaves writes locked', '.finally(() => replacing--);', '.then(() => replacing--);'],
  ['MJ12', 'app-data.ts', 'saves are let through before the startup backup', '    db = await open(stored);\n    try {', '    db = await open(stored);\n    release();\n    try {'],
  ['MJ13', 'app-data.ts', 'a new database is not saved on first start', '    if (storage) saves.persist(bytes);\n', ''],
  ['MJ14', 'app-data.ts', 'Nạp lại drops Settings → AI', 'openNew((anchor = today()), getSetting(db, AI_SETTINGS))', 'openNew((anchor = today()), undefined)'],
  ['MJ15', 'app-data.ts', 'the read backup database is never closed', '        imported.db.sqlite.close();\n', ''],
  ['MJ16', 'app-data.ts', 'the pinned day is not put on the database clock', '        at.setFullYear(day.year, day.month - 1, day.day);\n', ''],
  ['MJ17', 'app-data.ts', 'replaces run at once, not in turn', 'const turn = replaces.then(() => swap(next)).finally(() => replacing--);', 'const turn = swap(next).finally(() => replacing--);'],
  ['MJ18', 'app-data.ts', 'the anchor day is read before the backup', '      let anchor!: CalendarDate;\n      const backup = await replace(() => openNew((anchor = today()), getSetting(db, AI_SETTINGS)));', '      const anchor = today();\n      const backup = await replace(() => openNew(anchor, getSetting(db, AI_SETTINGS)));'],
  ['MJ19', 'app-data.ts', 'the startup backup failure is not wrapped', '      throw new Error(STARTUP_BACKUP_FAILED, { cause });', '      throw cause;'],
  ['MJ20', 'app-data.ts', 'the demo-data database is not closed', '    } finally {\n      db.sqlite.close();\n    }\n  };\n\n  const openFrom', '    } finally {\n    }\n  };\n\n  const openFrom'],
  ['MJ21', 'tauri-storage.ts', 'an empty db_open reply is a file', 'return reply.byteLength === 0 ? undefined : new Uint8Array(reply);', 'return new Uint8Array(reply);'],
  ['MJ22', 'tauri-storage.ts', 'backup names in UTC', 'utcOffsetMinutes: -timezoneOffset()', 'utcOffsetMinutes: 0'],
  ['MJ23', 'tauri-storage.ts', 'every load of the page has the same name', '  page: string = newPage(),', "  page: string = 'page',"],
  ['MJ24', 'today.ts', 'a new day object on every read', '      if (compareDates(next, day) !== 0) day = next;', '      day = next;'],
  ['MJ25', 'today.ts', 'no re-read when the window gets focus', "      events.window.addEventListener('focus', onFocus);\n", ''],
  ['MJ26', 'today.ts', 'the midnight timer fires only once', '          listener();\n          wait();', '          listener();'],
  ['MJ27', 'tables.ts', 'tables read again on every ask', '    return () => (value ??= { rows: read(db) }).rows;', '    return () => read(db);'],
  ['MJ28', 'tables.ts', 'customers not sorted by name', 'const customers = once((db) => sortedByName(listCustomers(db)));', 'const customers = once((db) => listCustomers(db));'],
  ['MJ29', 'demo-snapshot.ts', 'any file is taken as a database', 'return isSqlite(bytes) ? bytes : undefined;', 'return bytes;'],
  ['MJ30', 'AppDataContext.tsx', 'useQuery does not re-read after a change', '  return useMemo(() => read(data.db()), [data, read, revision]);', '  return useMemo(() => read(data.db()), [data, read]);'],
];

const hash = (text) => createHash('sha256').update(text).digest('hex');
const only = process.argv.slice(2);
for (const [id, file, what, from, to] of MUTANTS) {
  if (only.length && !only.includes(id)) continue;
  const path = ROOT + D + file;
  const original = readFileSync(path, 'utf8');
  const count = original.split(from).length - 1;
  if (count !== 1) {
    appendFileSync(LOG, `${id} | ${file} | ${what} | NOT APPLIED (${count})\n`);
    console.log(id, 'NOT APPLIED', count);
    continue;
  }
  let result;
  try {
    writeFileSync(path, original.replace(from, to));
    const run = spawnSync('pnpm', ['exec', 'vitest', 'run', ...TESTS], { cwd: ROOT, shell: true, encoding: 'utf8', timeout: 600_000 });
    const out = `${run.stdout}\n${run.stderr}`;
    const summary = (out.match(/Tests\s+.*\n/) ?? ['?'])[0].trim();
    const failing = [...out.matchAll(/FAIL\s+(\S+) > (.*)/g)].map((m) => `${m[1].split('/').pop()} > ${m[2].slice(0, 90)}`).slice(0, 3);
    result = `${run.status === 0 ? 'SURVIVED' : 'KILLED'} — ${summary}${failing.length ? ' — ' + failing.join(' | ') : ''}`;
  } finally {
    writeFileSync(path, original);
    if (hash(readFileSync(path, 'utf8')) !== hash(original)) throw new Error(`restore failed: ${file}`);
  }
  const line = `${id} | ${file} | ${what} | ${result}`;
  appendFileSync(LOG, `${line}\n`);
  console.log(line);
}
```

### 7.4 Cuối phiên

- `git rev-parse HEAD`: `885534549808f42aec7f9af5743bbf86642ee4bd`.
- `git status --short` cuối phiên: rỗng.
- Thư mục build đã ignore của repo bị ghi thêm: `apps/desktop/src-tauri/target/debug` (build test của bản chép crate, `cargo clippy`). Không file nào khác của repo bị đổi.
- Giờ xong: 2026-10-14 10:47.
