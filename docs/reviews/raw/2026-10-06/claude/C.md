# Deep review Phase 1–4 — gói C (`apps/desktop/src-tauri`, Rust) — Claude

- **SHA:** `f0c53eb57eb7eac8665ad87287e794ae4c5bc43b` (`git rev-parse HEAD` kiểm đầu phiên, worktree `C:\workspace\Project-2C-review`, detached). Cuối phiên `git status` sạch: không sửa file, không commit.
- **Ngày / máy:** 05/10/2026, `hostname` = `D13_ThinkPad` (thư mục `C:\workspace\deep-review-1-4\` có trên máy này). Một phiên, không subagent.
- **Prompt:** prompt dán còn sót "§4 dòng gói A"; mọi chỗ khác ghi gói C (ID `CL-C`, thư mục `claude\C\`, file `C.md`), nên phiên này làm **gói C = `apps/desktop/src-tauri`** theo §4.
- **Nguồn đã đọc ngoài repo:** `common\README.md`, `baseline.md`, `known.md`, `verify-rust.log`, `common\load\` (dùng `load-backup.json`), `claude\A.md`, `claude\B.md` (để khỏi lặp; B ghi chú "mỗi lệnh persist cả file 13 MB qua IPC → gói C / D đo"). Không mở / liệt kê / tìm trong `codex\`.
- **Probe, test tạm:** `C:\workspace\deep-review-1-4\claude\C\` (nguồn ở phụ lục C, log `probe-results.log`, `mutate-run.log`, `clippy-pedantic.log`, `probe-s18-s23.log`). Crate probe `C\probe` nạp `storage.rs` của worktree **chỉ đọc** qua `#[path]` và gọi đúng API công khai mà `lib.rs` gọi; crate mutation `C\mut` chứa bản sao `storage.rs` (khôi phục sau mỗi lượt). Clippy pedantic dùng `--target-dir` riêng `C\target-clippy`, không đụng `target\` của repo. `load.db` (13 074 432 byte) và `seed.db` (9 306 112 byte) là file DB thật app sẽ lưu cho dữ liệu tải và seed demo (`probe-export-db.test.ts`).

## 1. Phạm vi đã đọc

| File | Dòng | Cách đọc |
|---|---|---|
| `apps/desktop/src-tauri/src/storage.rs` | 1–1124 (toàn bộ: 427 dòng SP + 37 test) | đọc từng dòng; 46 mutation; 11 probe |
| `apps/desktop/src-tauri/src/lib.rs`, `main.rs`, `build.rs` | 1–110, 1–6, 1–3 | đọc từng dòng |
| `Cargo.toml`, `tauri.conf.json`, `capabilities/default.json`, `rust-toolchain.toml` | toàn bộ | đọc từng dòng |
| `Cargo.lock` | dòng `tauri` 2.11.6, `tauri-runtime-wry` 2.11.4, `wry` 0.55.1 | grep |
| `wry-0.55.1/src/lib.rs` 1665–1790, `src/webview2/mod.rs` 575–590; `tauri-runtime-wry-2.11.4/src` | | grep `browser_accelerator_keys` (F5 trong exe, CL-C1) |
| Nơi gọi phía JS (chỉ để kiểm hợp đồng) | `apps/desktop/src/data/tauri-storage.ts` 1–44, `persist-queue.ts` 1–79, `app-data.ts` 20–60 + 150–329, `shell/startup-error.ts` 1–27, `shell/StartupError.tsx` 1–18, `routes/SettingsBackup.tsx` 40–80 + 180–200, `routes/Settings.tsx` 75–100, `routes/reports/ReportExport.tsx` 25–60, `routes/reports/report-workbook.ts` 220–258, `i18n/vi.ts` 568–580 + 668–676 | đọc đoạn |
| Tài liệu | `docs/process/deep-review-phase-1-4.md`; ADR-0016 (toàn bộ); `apps/desktop/CLAUDE.md` | |
| Lịch sử | `git log` của `storage.rs` (12 commit, #87 → #316), `git log -S "Stamped("` | CL-C9 |

Lệnh đã chạy: `cargo test` trên bản sao (37/37 xanh, khớp `verify-rust.log`); `cargo clippy --lib --tests -- -W clippy::pedantic -W clippy::nursery` (exit 0, 10 cảnh báo, `clippy-pedantic.log`); 46 mutation (phụ lục A); probe Rust `perf-save`, `perf-open`, `held`, `race-reload`, `race-open`, `race-backup` (hai biến thể), `race-save-backup`, `paths`, `devices`, `damaged`, `which` (phụ lục B); probe JS `probe-export-db`, `probe-size`, `probe-damaged`.

## 2. Phát hiện

### CL-C1

```
ID: CL-C1
Mức: Low
Trục: D
Vị trí: apps/desktop/src-tauri/src/storage.rs:81-86 (open: dọn export chỉ khi lấy khóa lần đầu, nhưng xóa project2c.db.tmp mọi lần), 249-263 (write_atomic); lib.rs:36-63 (db_open / db_backup / db_save là lệnh async, không có gì tuần tự hóa) (f0c53eb)
Tình trạng: CONFIRMED ở lớp Rust (race tái hiện bằng probe); khả năng hai lệnh chồng nhau trong exe phụ thuộc tốc độ đĩa (xem Ảnh hưởng)
Mô tả: Các lệnh file chạy song song trên threadpool của Tauri và không có khóa chung. Khi webview tải lại (F5 / Ctrl+R — WebView2 bật phím trình duyệt mặc định; wry 0.55.1 để `browser_accelerator_keys: true` và tauri-runtime-wry không tắt; app không chặn phím), `db_open` của trang mới chạy dưới khóa tiến trình đã giữ. `open` cố ý bỏ qua dọn `exports\` ở lần mở lại để không giết một export đang chạy (dòng 81-84, test `open_again_in_the_same_process_keeps_a_running_export`), nhưng vẫn xóa `project2c.db.tmp` vô điều kiện (dòng 86), tức giết luôn lần lưu đang chạy của trang cũ, rồi đọc file chưa có thay đổi đó.
Tái hiện / bằng chứng: probe `race-reload` (phụ lục B): file 13 MB của dữ liệu tải, luồng A `save(v2)`, luồng B `open` dưới cùng DataLock sau 0…20 ms, 200 lượt (probe-results.log):
    88 × lưu lỗi NotFound (open đã xóa .tmp) | trang mới đọc v1 | đĩa v1
     3 × lưu lỗi PermissionDenied              | trang mới đọc v1 | đĩa v1
     1 × lưu ok | trang mới đọc v1 | đĩa v2   ← trang hiện bản cũ, lần lưu sau ghi đè bản mới
   108 × lưu ok | trang mới đọc v2 | đĩa v2   (open đến sau khi lưu xong)
  Cùng gốc, F5 lúc đang mở app (`race-open`, hai `open` cùng tiến trình trên file đã đổi, 300 lượt): cùng giây → 268/300 một bên lỗi NotFound (145 lần là trang vừa tải lại → màn "Không mở được file dữ liệu" trên một file tốt), vì hai `copy_to_backups` cùng `next_seq` ghi chung một `.tmp` (CL-C2); khác giây → cả 300 lượt ghi hai bản sao giống hệt nhau (đẩy một bản backup tốt cũ ra ngoài).
Ảnh hưởng: Người dùng exe bấm F5 khi lần lưu cuối còn đang chạy mất thay đổi vừa làm (thấy nó trên màn trước khi F5, sau F5 không còn), hoặc ở ca thứ ba mất nó lặng lẽ ở lần lưu kế tiếp. Lần lưu phía Rust trên máy này chỉ 9,2 ms (NVMe, CL-C6 / "đã xét" P) trong khi trang mới cần tải bundle 744 KB trước khi gọi db_open, nên trên SSD gần như không chồng nhau; trên ổ chậm (exe portable chạy từ USB, ổ mạng, HDD) `sync_all` 13 MB kéo dài và cửa sổ mở rộng. Phần ảnh chụp còn chờ trong hàng đợi JS khi F5 là việc của gói D (persist-queue), không thuộc phát hiện này.
Đề xuất: Một `static FILES: Mutex<()>` trong lib.rs (hoặc trong DataLock) giữ suốt db_open / db_save / db_backup: open của trang mới chờ lần lưu đang chạy xong rồi đọc bản mới, và hai lần sao lưu không còn chung tên .tmp (sửa luôn CL-C2 ở lớp Rust). Tối thiểu: chỉ xóa .tmp của DB khi `acquire` trả true, như phần dọn exports. Test: hai luồng như probe. Cỡ ≈ 15 dòng SP + 40 dòng test.
```

### CL-C2

```
ID: CL-C2
Mức: Low
Trục: E
Vị trí: apps/desktop/src-tauri/src/storage.rs:120-128 (copy_to_backups: find_copy → next_seq → write_atomic không nguyên tử với nhau), 251 (tên .tmp cố định theo tên đích) (f0c53eb)
Tình trạng: KNOWN (S-2, #192 "hai replace chồng nhau") — bằng chứng mới ở lớp Rust
Mô tả: Khi hai lần sao lưu chạy cùng lúc (hai `replace` chồng nhau của S-2, hoặc `replace` đang chờ `db_backup` + F5 → `db_open`), cả hai thấy cùng `next_seq`. Cùng giây (cùng stamp) → cùng tên đích, cùng `.tmp`: một bên đổi tên trước, bên kia nhận NotFound và lệnh `db_backup` báo lỗi dù bản sao đã có. Khác giây → hai bản sao giống hệt nhau cùng `seq`, phá bất biến "an identical copy is never written twice" (doc của copy_to_backups) và đẩy thêm một bản backup cũ ra.
Tái hiện / bằng chứng: probe `race-backup` 300 lượt (probe-results.log): cùng giây → 273/300 một lệnh lỗi "NotFound … (os error 2)", 27 lượt cả hai trả cùng tên; khác giây → 300/300 hai file trong backups\, cùng nội dung. Không lượt nào có bản sao sai nội dung. `race-save-backup` (300 lần lưu trong khi sao lưu liên tục đọc file): 0 lỗi, 0 bản sao rách — đổi tên đè file đang được đọc chạy được trên Windows.
Ảnh hưởng: Như S-2: lần thay thế thứ hai báo "Chưa nạp lại…" / "settings.backup.failed" dù không có gì hỏng. UI hiện chặn bấm chồng (nút disabled khi đang chạy), nên chủ yếu gặp qua F5 (CL-C1).
Đề xuất: Gộp vào CL-C1 (khóa chung) hoặc vào việc S-2 đã có chỗ trong kế hoạch.
```

### CL-C3

```
ID: CL-C3
Mức: Low
Trục: C
Vị trí: apps/desktop/src-tauri/src/storage.rs:100-107 (open sao lưu mọi file có header SQLite trước khi app thử mở); apps/desktop/src/i18n/vi.ts:571-572 (storage.openFailedHelp); apps/desktop/src/shell/startup-error.ts:22-26 (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: Khi file có header SQLite nhưng hỏng bên trong (hoặc migration lỗi), `open` đã chép chính file đó vào backups\ thành bản mới nhất rồi mới trả cho JS; `openDatabase` từ chối và màn khởi động hướng dẫn "chép bản mới nhất thành Project2C-data\project2c.db để khôi phục; nếu vẫn lỗi, thử bản cũ hơn". Bước đầu tiên của hướng dẫn luôn là chép lại đúng file vừa lỗi.
Tái hiện / bằng chứng: probe `damaged`: 3 lần mở tốt, rồi lưu seed.db bị xóa nửa sau (giữ header) → `open` trả bytes, `latest_backup` = project2c-s00000004-…, nội dung = file hỏng (true / true). probe-damaged.test.ts: `openDatabase` trên đúng bytes đó → "Error: database disk image is malformed" → `startupMessage` rơi vào nhánh openFailed (startup-error.ts:22-26).
Ảnh hưởng: Người dùng gặp file hỏng (tắt máy đột ngột ngoài lúc ghi, ổ lỗi, công cụ ngoài ghi vào file) làm theo hướng dẫn thì thất bại lần đầu; phải đoán "bản cũ hơn" là bản nào trong 10 file. Đúng lúc cần hướng dẫn rõ nhất.
Đề xuất: Sửa câu: "bản mới nhất có thể chính là file vừa lỗi; chép bản liền trước nó…", hoặc màn lỗi nêu tên bản backup cuối được ghi trước lần mở này (Rust trả thêm tên). Cỡ ≤ 20 dòng.
```

### CL-C4

```
ID: CL-C4
Mức: Low
Trục: T
Vị trí: storage.rs:249-263 (write_atomic), 420-426 (is_export_name), 179-182 (claim_export_name, nhánh thư mục trùng tên claim), 400-411 (prune_backups, `keep`); test 902-921 (write_export_writes_into_exports_and_rejects_unsafe_names) (f0c53eb)
Tình trạng: CONFIRMED (mutation, phụ lục A)
Mô tả: 46 mutation, 34 bị bắt. Trong 12 con sống, các con dưới đây đổi hành vi thật mà cả 37 test vẫn xanh:
  - S14: write_atomic ghi thẳng vào tên đích (bỏ .tmp + rename) — chính lời hứa của ADR-0016 "không bao giờ để file ghi dở" không có test nào giữ.
  - S15: write_atomic để lại .tmp khi ghi lỗi (không có test đường lỗi của write_atomic).
  - S23: is_export_name cho phép `\`. Ca "..\\evil.p2cbackup" trong test bị chặn bởi luật "không bắt đầu bằng dấu chấm", không phải luật ký tự; với S23, `write_export(dir, r"x\..\..\evil.p2cbackup")` ghi file ra ngoài exports\ (probe-s18-s23.log: "file outside exports\: true"). Code hiện tại đúng (probe bản gốc: InvalidInput), chỉ là lá chắn đường dẫn không có test riêng.
  - S18: bỏ nhánh "Windows báo thư mục trùng tên claim là access denied" → write_export lỗi `PermissionDenied (os error 5)` thay vì nhảy sang `-2` (probe-s18-s23.log xác nhận Windows trả mã 5).
  - S39: prune_backups được phép xóa bản vừa ghi (khi mọi bản cũ hơn bị khóa).
  Các con sống còn lại là tương đương / không test được: S4 (mutex bị poison), S13 (bỏ sync_all — độ bền khi mất điện), S22 (trùng với luật dấu chấm đầu), S29 (remove_file trên thư mục vốn lỗi), S33 / S35 (năm 5 chữ số, seq = u64::MAX).
Tái hiện / bằng chứng: `node mutate.mjs` → mutate-results.json (phụ lục A); `node probe-s18-s23.mjs` → probe-s18-s23.log.
Ảnh hưởng: Một lần sửa sau làm hỏng ghi nguyên tử, lá chắn `\` hay nhánh thư mục trùng claim sẽ qua CI xanh.
Đề xuất: Thêm 4 test: (1) ghi đè khi một handle khác giữ file đích không cho xóa (share read|write) → lỗi và file cũ nguyên vẹn, không còn .tmp; (2) tên có `\` nhưng không bắt đầu bằng dấu chấm (`x\..\..\a.p2cbackup`) → InvalidInput; (3) thư mục tên `a.p2cbackup.claim` → `a-2.p2cbackup` (cfg windows); (4) mọi bản cũ bị khóa → bản vừa ghi còn. Cỡ ≈ 60 dòng test, 0 dòng SP.
```

### CL-C5

```
ID: CL-C5
Mức: Nit
Trục: E
Vị trí: storage.rs:249-263 (write_atomic: rename một lần, không thử lại); apps/desktop/src/i18n/vi.ts:671-672 (storage.saveFailed); ADR-0016 "Hệ quả" ("File project2c.db … mở được bằng công cụ ngoài để kiểm tra") (f0c53eb)
Tình trạng: CONFIRMED (mô phỏng share mode; share mode của SQLite là theo mã nguồn os_win.c, không chạy SQLite ngoài)
Mô tả: Chương trình nào mở project2c.db mà không có FILE_SHARE_DELETE — SQLite (sqlite3, DB Browser for SQLite) mở với FILE_SHARE_READ | FILE_SHARE_WRITE — làm mọi lần lưu của app lỗi "Access is denied (os error 5)" cho tới khi chương trình đó đóng file. Cảnh báo lưu lỗi thường trực (storage.saveFailed) không nói nguyên nhân hay gặp này; chỉ hộp đóng app (close.unsavedBody) nói "file có thể đang bị chương trình khác mở".
Tái hiện / bằng chứng: probe `held` (probe-results.log): giữ project2c.db với share read → lưu lỗi PermissionDenied/5; read|write → lỗi 5; read|write|delete → lưu ok; không share → lưu lỗi 5, và `open` lỗi 32 (sharing violation, hiện ở màn lỗi khởi động như chi tiết kỹ thuật). Mọi ca lỗi không để lại .tmp; dữ liệu cũ trên đĩa nguyên vẹn; hàng đợi JS thử lại ở lần thay đổi sau.
Ảnh hưởng: Người làm theo ADR mở file bằng công cụ SQLite khi app đang chạy thấy cảnh báo "Chưa lưu được dữ liệu" không rõ vì sao; dữ liệu không mất (giữ trong app, CloseGuard chặn đóng).
Đề xuất: Thêm nửa câu "có thể do file đang mở trong chương trình khác" vào storage.saveFailed, và ghi ở ADR-0016 / tài liệu: chỉ mở project2c.db bằng công cụ ngoài khi app đã đóng (hoặc mở một bản trong backups\). Không cần sửa Rust.
```

### CL-C6

```
ID: CL-C6
Mức: Nit
Trục: P
Vị trí: storage.rs:389-395 (find_copy), 120-123 (copy_to_backups gọi ở mỗi lần mở) (f0c53eb)
Tình trạng: CONFIRMED (số đo)
Mô tả: Mỗi lần mở, find_copy duyệt các bản backup từ cũ nhất và đọc trọn mọi bản cùng cỡ với file để so nội dung. File sql.js là bội số trang 4 KB và không bao giờ co lại, nên các bản backup của những phiên ít thao tác thường cùng cỡ: probe-size trên dữ liệu tải, 200 lần thêm ghi chú KYC chỉ cho 12 cỡ khác nhau (≈ 17 thao tác thêm mới tăng 1 trang).
Tái hiện / bằng chứng: probe `perf-open` (cache nóng, 10 lượt, median):
  load.db 13 MB: 10 backup khác cỡ 14,1 ms · 10 backup cùng cỡ 70,6 ms (file đã đổi) / 64,1 ms (file không đổi, bản trùng là bản mới nhất nhưng duyệt sau cùng) · chưa có backup 13,4 ms.
  seed.db 9,3 MB: 10,8 ms · 49,7 / 43,0 ms · 10,0 ms.
  Tức đọc thêm 10 × 13 MB = 130 MB mỗi lần mở; cache lạnh (lần mở đầu sau khởi động máy) chưa đo được trên máy này.
Ảnh hưởng: Mở exe chậm thêm ≈ 55 ms (cache nóng) trên dữ liệu tải; nhiều hơn trên ổ chậm / cache lạnh. Một lần mỗi lần mở app.
Đề xuất: Duyệt từ bản mới nhất và so theo khối (dừng ở khối khác đầu tiên), hoặc chỉ so với bản mới nhất (đủ cho ca "mở lại trên file không đổi" mà test restarts_on_an_unchanged_file_keep_the_older_backups giữ). Cỡ ≈ 10 dòng.
```

### CL-C7

```
ID: CL-C7
Mức: Nit
Trục: S
Vị trí: apps/desktop/src-tauri/src/lib.rs:89 (`std::process::Command::new("explorer.exe")`) (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: Trên Windows, `Command::new` với tên trần tìm chương trình trong thư mục của exe trước System32 / Windows (thứ tự tìm của Rust std). Exe portable nằm trong thư mục người dùng ghi được (ADR-0006), nên một `explorer.exe` đặt cạnh Project-2C.exe sẽ chạy khi bấm "Mở thư mục" ở Cài đặt → Dữ liệu.
Tái hiện / bằng chứng: `which.exe` (phụ lục C) gọi `Command::new("whoami.exe")` theo cùng cách; chép `hostname.exe` cạnh nó dưới tên whoami.exe rồi chạy từ `C:\` → stdout "D13_ThinkPad" (chương trình cạnh exe chạy), không có file đó → "d13_thinkpad\<user>" (bản System32).
Ảnh hưởng: Thấp: ai ghi được vào thư mục exe cũng thay được chính exe hay đặt DLL. Chỉ là lớp phòng thủ rẻ còn thiếu.
Đề xuất: Dùng đường dẫn đầy đủ (`%SystemRoot%\explorer.exe` qua `std::env::var_os("SystemRoot")`). Cỡ ≈ 5 dòng.
```

### CL-C8

```
ID: CL-C8
Mức: Nit
Trục: T
Vị trí: lib.rs:13 (EXPORT_NAME_HEADER), 36-96 (tên lệnh, tham số `utc_offset_minutes`, `kind`); storage.rs:13 (ALREADY_OPEN); apps/desktop/src/data/tauri-storage.ts:8, 19-41; apps/desktop/src/shell/startup-error.ts:5 (f0c53eb)
Tình trạng: CONFIRMED (grep: không test nào đọc hằng của phía bên kia)
Mô tả: Hợp đồng JS ↔ Rust (6 tên lệnh, tên tham số camelCase ↔ snake_case, header `x-p2c-file-name`, chuỗi lỗi `ALREADY_OPEN`, body rỗng = lần đầu) được chép hai nơi và mỗi bên chỉ test với bản của mình: tauri-storage.test.ts dùng invoke giả, lib.rs không có test nào, e2e chạy bản web không có Tauri. Đổi tên ở một bên vẫn qua toàn bộ unit, Rust và e2e; chỉ lộ khi Owner thử exe.
Tái hiện / bằng chứng: `grep -rn "x-p2c-file-name\|ALREADY_OPEN\|db_open\|utcOffsetMinutes" apps/desktop/src e2e` chỉ ra test JS dùng chuỗi literal của chính nó (tauri-storage.test.ts:11,33,44; startup-error.test.ts:7); `cargo test` có 0 test trong lib.rs.
Ảnh hưởng: Lỗi lệch tên chỉ phát hiện ở bước kiểm exe thủ công (G7).
Đề xuất: Một test Vitest đọc `src-tauri/src/lib.rs` + `storage.rs` dạng text và kiểm các chuỗi của tauri-storage.ts / startup-error.ts có mặt (tên lệnh trong generate_handler!, header, ALREADY_OPEN, snake_case của tham số). Cỡ ≈ 30 dòng test.
```

### CL-C9

```
ID: CL-C9
Mức: Nit
Trục: B
Vị trí: storage.rs:278-310 (BackupKey::Stamped, phân tích tên "project2c-<stamp>[-<n>].db"), 196-198 + 209 (xóa file rỗng mà "the first version of write_export" để lại); test 712-743, 798-812 và một phần 566-601 (f0c53eb)
Tình trạng: CONFIRMED (git log)
Mô tả: Khoảng 20 dòng SP và 2,5 test chỉ để đọc tên backup của các bản build trước #136 (28/09) và dọn file rỗng của bản write_export đầu tiên (#185, 30/09, đã thay ở #188 cùng ngày). Dữ liệu hiện là giả lập (R2-02, 02/10: không giữ tương thích dữ liệu cũ); thư mục dữ liệu của các bản build đó chỉ có trên máy Owner.
Tái hiện / bằng chứng: `git log -S "Stamped(" -- storage.rs` → a745a73 (#136, 28/09); `git log` của storage.rs: 3462849 (#188) thay bản export đầu.
Ảnh hưởng: Không lỗi; thêm nhánh phải đọc và giữ test khi sửa logic backup (CL-C1, CL-C6).
Đề xuất: Owner quyết: bỏ cùng lần chạm storage.rs kế tiếp (Owner xóa tay backups\ cũ nếu còn), hoặc giữ tới Phase 6. Cỡ −20 dòng SP, −40 dòng test.
```

### CL-C10

```
ID: CL-C10
Mức: Nit
Trục: E
Vị trí: storage.rs:106 (open trả lỗi nếu copy_to_backups lỗi), 124-126 (ghi bản sao trước, tỉa sau) (f0c53eb)
Tình trạng: PLAUSIBLE (đọc code; không tạo được ổ gần đầy trên máy này khi không có quyền admin để dựng VHD)
Mô tả: Lần mở ghi bản backup thứ 11 rồi mới xóa bản cũ nhất, nên cần trống thêm đúng một file (13 MB với dữ liệu tải). Ghi lỗi (ổ đầy, backups\ chỉ đọc) làm `open` lỗi và app không khởi động, dù project2c.db đọc được.
Tái hiện / bằng chứng: đường `?` ở dòng 106 và 125; test hiện có chỉ phủ "bản cũ bị khóa không chặn khởi động" (a_locked_old_backup_does_not_block_startup), không phủ "không ghi được bản mới".
Ảnh hưởng: Ổ gần đầy: màn "Không mở được file dữ liệu" với chi tiết "There is not enough space on the disk" (tiếng Anh); hướng dẫn trên màn (chép backup) không giúp. Khi ổ đầy app cũng không lưu được, nên lợi ích của việc vẫn mở chỉ là xem / xuất. Có thể là chủ ý ("không mở khi chưa có bản sao") — cần Owner xác nhận.
Đề xuất: Tỉa trước (giữ 9 + bản mới), hoặc ghi rõ chủ ý trong doc comment của open. Cỡ ≤ 10 dòng.
```

## 3. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | P | B | T | A | S | Tổng |
|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 1 (C2, KNOWN) | 1 (C3) | 1 (C1) | 0 | 0 | 1 (C4) | 0 | 0 | 4 |
| Nit | 2 (C5, C10) | 0 | 0 | 1 (C6) | 1 (C9) | 1 (C8) | 0 | 1 (C7) | 6 |
| **Tổng** | 3 | 1 | 1 | 1 | 1 | 2 | 0 | 1 | **10** |

8 CONFIRMED, 1 KNOWN có bằng chứng mới (C2), 1 PLAUSIBLE (C10, không dựng được ổ đầy). CL-C1 CONFIRMED ở lớp Rust; xác suất chồng nhau trong exe thật phụ thuộc tốc độ đĩa (ghi rõ trong khối).

**Nhận định chung gói C:** lớp Rust mỏng, đúng ADR-0016 và đúng doc comment của từng hàm; không `unsafe`, không đường panic thực tế (release `panic = "abort"`), webview không đặt được đường dẫn nào (`folder` chỉ nhận 2 tên, tên xuất bị lọc ký tự). Ghi nguyên tử đúng: lỗi giữa chừng không để lại file rách hay `.tmp`, đổi tên đè file đang được đọc chạy được. Điểm yếu duy nhất về dữ liệu là các lệnh file không được tuần tự hóa, chỉ lộ khi tải lại webview giữa lúc lưu / mở (CL-C1) hoặc khi hai lần thay thế chồng nhau (S-2, CL-C2). Test Rust tốt cho logic tên / tỉa backup (mọi mutation ở đó bị bắt) nhưng không giữ được chính tính nguyên tử và lá chắn `\` (CL-C4).

## 4. Đã xét, không thấy

- **E — Edge case:**
  - Đường dẫn: thư mục dữ liệu tên Unicode có dấu phẩy và dấu cách (`Ứng dụng, bản 2 ✓`) và đường dẫn 312 ký tự (> MAX_PATH): open / save / backup / write_export / folder / explorer_arg đều đúng (probe `paths`; Rust std tự thêm tiền tố `\\?\`). Tên chứa dấu phẩy: test explorer_arg sẵn có.
  - Tên thiết bị Windows trong tên xuất (`NUL.p2cbackup`, `CON.xlsx`, `COM1.xlsx`, `aux`, `nul`): trên Windows 11 thành file thường, ghi đúng (probe `devices`). Tên do app sinh luôn có tiền tố `bao-cao_` / `project2c-` nên cũng không chạm trên Windows 10.
  - Đồng hồ: lùi / tiến / năm 2000 / cùng giây đều có test và mutation bị bắt (S30–S34, S37, S41); `stamp` ngày nhuận có test. Năm 5 chữ số và `seq` = u64::MAX chỉ xảy ra khi cố tình (S33, S35).
  - File DB rỗng, không phải SQLite, mất khi còn backup, `.tmp` sót, thư mục chiếm tên backup / tên xuất, backup cũ bị khóa, tiến trình thứ hai giữ khóa: đều có test và mutation bị bắt (S5–S12, S17, S19, S26–S28, S36, S42).
  - Lưu trong khi sao lưu đọc file: 300 lần lưu, 0 lỗi, 0 bản sao rách (probe `race-save-backup`). Chồng nhau khác: CL-C1, CL-C2.
  - Lỗi Windows: sharing violation khi giữ khóa → ALREADY_OPEN (test); file DB bị giữ → CL-C5; ổ đầy → CL-C10 (PLAUSIBLE); thư mục chỉ đọc → `create_dir_all` / `write_atomic` trả lỗi, không panic (đọc code).
- **C — Đúng hợp đồng:** từng hàm `pub` đối chiếu doc comment: `open` (khóa trước, dọn exports chỉ ở lần lấy khóa đầu, sao lưu trừ khi đã có bản giống hệt, từ chối file rỗng / không phải SQLite, không bao giờ coi "mất file khi còn backup" là lần đầu), `backup` (trả tên bản giống hệt nếu có), `save`, `write_export` (không bao giờ ghi đè, hậu tố trước phần mở rộng), `latest_backup` (theo thứ tự ghi), `folder`, `explorer_arg`. `lib.rs`: body rỗng chỉ khi lần đầu, khớp `tauri-storage.ts:22-24`; dấu của độ lệch múi giờ (`-getTimezoneOffset()` + cộng ở Rust) đúng. ADR-0016: chỉ `std`, `.tmp` + rename, giữ 10 bản, file xuất vào `exports\` — đúng. Ngoại lệ: CL-C3.
- **D — Dữ liệu:** `write_atomic` = create → write_all → sync_all → đóng → rename; lỗi ở bất kỳ bước nào giữ file cũ và xóa `.tmp` (probe `held`: ".tmp left=false" ở mọi ca lỗi). App không bao giờ xóa `project2c.db`; tỉa chỉ đụng tên do app đặt (test `open_prunes_only_backups_it_named`). Bản sao luôn đúng nội dung trong mọi probe race (0 bản sai). Không có ghi nào ngoài `write_atomic` trừ claim rỗng.
- **P — Hiệu năng** (Windows 11, NVMe, cache nóng, median 30 lượt, probe-results.log):
  - `save` (db_save phía Rust) file 13,07 MB của dữ liệu tải: **9,2 ms** (create + write_all 3,1 · sync_all 4,8 · rename 1,3); seed demo 9,3 MB: 6,9 ms. Giả định "vài MB, vài ms" của ADR-0016 còn đúng ở phía Rust với dữ liệu tải.
  - `open` lần đầu có backup: 13,4 ms (load) / 10,0 ms (seed); với 10 backup khác cỡ 14,1 ms; cùng cỡ → CL-C6.
  - Chưa đo: chi phí IPC 13 MB từ webview sang Rust mỗi lần lưu và chi phí `db.export()` + sao chép phía JS (cần exe có đo đạc; B đo `db.export()` 2,3 ms) → để gói D / H.
- **B — Bloat:** `cargo clippy -W clippy::pedantic -W clippy::nursery`: exit 0, 10 cảnh báo đều là phong cách — `;` cuối (build.rs:2, main.rs:5), giữ guard mutex hơi lâu (storage.rs:41, vô hại: chỉ bao `open_lock_file`), closure thừa (storage.rs:44), ép `u64 → i64` (lib.rs:52, giây từ 1970 không tràn), 3 tham số truyền theo giá trị (chữ ký lệnh Tauri bắt buộc), thiếu mục `# Panics` (lib.rs:98, `.expect` lúc khởi động). Không hàm / hằng không dùng trên Windows; `dead_code` ngoài Windows là KNOWN (#196). Dependency: chỉ `tauri` + `tauri-build`. Code tương thích bản cũ → CL-C9.
- **T — Test:** 46 mutation, 34 bị bắt (phụ lục A); con sống có nghĩa → CL-C4. Test Rust không dùng đồng hồ hệ thống (stamp cố định), thư mục tạm theo pid + bộ đếm nên chạy song song an toàn; 3 test `#[cfg(windows)]` chạy trong job build-exe của CI (Windows). Thư mục tạm không dọn: KNOWN (#87 NIT). Hợp đồng JS ↔ Rust → CL-C8.
- **A — Trợ năng / i18n:** Rust không có UI. Lỗi từ lệnh Rust không hiện nguyên văn ở Cài đặt / Báo cáo (`SettingsBackup.tsx:56,75,192`, `Settings.tsx:88`, `ReportExport.tsx`, `SettingsDataFile.tsx:118` đều dùng câu i18n); chỉ màn lỗi khởi động hiện chuỗi Rust / OS tiếng Anh dưới nhãn "Chi tiết kỹ thuật:" sau tiêu đề và hướng dẫn tiếng Việt (giống mục ACCEPTED "hộp lỗi màn hình chỉ hiện String(error)").
- **S — An toàn (hẹp):** `capabilities/default.json` chỉ `core:default` + `core:window:allow-destroy` (dùng ở `CloseGuard.tsx:36`), không plugin fs / shell / dialog; CSP chặn script ngoài. Không lệnh nào nhận đường dẫn từ webview: `folder` chỉ nhận `exports` / `backups` (test với `..`, `C:\Windows`, `exports\..\..`), `write_export` lọc tên (ASCII chữ số, `-_.`, không bắt đầu bằng dấu chấm, phần mở rộng `.p2cbackup` / `.xlsx`) → không đi ra ngoài `exports\` (bản gốc từ chối `x\..\..\evil.p2cbackup`; lá chắn này cần test riêng, CL-C4). `explorer_arg` luôn bọc ngoặc kép, đường dẫn Windows không chứa `"`. Nhập backup là việc của JS (gói B). Tìm `explorer.exe` → CL-C7.
- **KNOWN không có bằng chứng mới:** `explorer_arg` thiếu `#[cfg(any(windows, test))]`, `Some(32)` thay hằng, closure `map_err` identity ngoài Windows (#196, #192) — không build thử target ngoài Windows (máy không cài target đó, không cài thêm). ACCEPTED "rename ghi đè đích, chỉ tránh nhờ claim" — probe không thấy gì mới.

## Ghi chú cho gói sau (không phải phát hiện gói C)

- Gói D: F5 trong exe vứt ảnh chụp đang chờ trong `persist-queue` (JS) — CL-C1 chỉ nói phần Rust; app không chặn F5 / Ctrl+R và không có `beforeunload`. Đo chi phí IPC + `db.export()` mỗi lần lưu với dữ liệu tải (13 MB) nếu có cách đo trong exe.
- Gói G: test Rust chỉ chạy ở job build-exe (`ci.yml:72-107`: push lên `main`, chạy tay, hoặc PR có nhãn `build-exe`); PR sửa `storage.rs` thiếu nhãn sẽ không chạy 37 test này trước merge, chỉ chạy sau khi đã vào `main`.

## Phụ lục A — Kết quả mutation (`mutate-results.json`)

Bản sao `storage.rs` ở `C\mut\src\lib.rs`, mỗi lượt một thay đổi, `cargo test --quiet` (37 test). Tổng: {"KILLED":34,"SURVIVED":12}.

| ID | Thay đổi | Kết quả | Test bắt được |
|---|---|---|---|
| S1 | acquire: a re-open counts as the first (cleans exports again) | KILLED | open_again_in_the_same_process_keeps_a_running_export, the_first_open_cleans_exports_even_when_it_cannot_remove_the_db_tmp |
| S2 | lock file shared | KILLED | open_keeps_the_lock_and_does_not_lock_itself_out |
| S3 | sharing violation not mapped to ALREADY_OPEN | KILLED | open_keeps_the_lock_and_does_not_lock_itself_out, open_while_another_process_holds_the_lock_touches_nothing |
| S4 | poisoned lock panics instead of recovering | SURVIVED |  |
| S5 | open: never cleans interrupted exports | KILLED | open_again_in_the_same_process_keeps_a_running_export, open_removes_what_an_interrupted_export_left_and_keeps_real_exports, the_first_open_cleans_exports_even_when_it_cannot_remove_the_db_tmp |
| S6 | open: cleans exports on every open | KILLED | open_again_in_the_same_process_keeps_a_running_export, the_first_open_cleans_exports_even_when_it_cannot_remove_the_db_tmp |
| S7 | open: keeps the crash .tmp | KILLED | open_removes_a_tmp_file_left_by_a_crash, open_while_another_process_holds_the_lock_touches_nothing, the_first_open_cleans_exports_even_when_it_cannot_remove_the_db_tmp |
| S8 | open: .tmp removal error ignored | KILLED | the_first_open_cleans_exports_even_when_it_cannot_remove_the_db_tmp |
| S9 | open: missing file with backups is a first start | KILLED | a_missing_file_with_backups_left_is_an_error_not_a_first_start |
| S10 | open: no SQLite header check | KILLED | open_refuses_a_file_that_is_not_sqlite_without_touching_the_backups, open_refuses_an_empty_database_file |
| S11 | copy_to_backups: never reuses an identical copy | KILLED | backup_of_an_already_copied_file_returns_the_existing_copy, restarts_on_an_unchanged_file_keep_the_older_backups |
| S12 | copy_to_backups: never prunes | KILLED | a_backup_made_with_the_clock_set_back_is_kept, a_clock_going_back_and_forth_keeps_the_ten_last_written_backups, a_locked_old_backup_does_not_block_startup, backup_keeps_only_the_ten_newest_backups, open_keeps_only_the_ten_newest_backups, open_prunes_only_backups_it_named, open_twice_in_the_same_second_keeps_both_backups, restarts_on_an_unchanged_file_keep_the_older_backups, starts_with_the_clock_in_2000_keep_the_latest_sessions_over_old_named_backups |
| S13 | write_atomic: no sync_all | SURVIVED |  |
| S14 | write_atomic: writes the final name directly (no tmp) | SURVIVED |  |
| S15 | write_atomic: leaves the .tmp after a failure | SURVIVED |  |
| S16 | write_export: leaves the claim | KILLED | write_export_leaves_no_claim_behind, write_export_never_overwrites_an_earlier_export |
| S17 | claim: takes a name with a file under it | KILLED | open_removes_what_an_interrupted_export_left_and_keeps_real_exports, write_export_never_overwrites_an_earlier_export, write_export_skips_a_name_taken_by_a_folder, write_export_takes_a_report_and_suffixes_it_before_xlsx |
| S18 | claim: access denied on a folder-named claim is an error | SURVIVED |  |
| S19 | claim: a single try | KILLED | open_removes_what_an_interrupted_export_left_and_keeps_real_exports, write_export_never_overwrites_an_earlier_export, write_export_skips_a_name_taken_by_a_folder, write_export_skips_a_name_whose_claim_is_left, write_export_takes_a_report_and_suffixes_it_before_xlsx |
| S20 | claim: suffix without dash | KILLED | open_removes_what_an_interrupted_export_left_and_keeps_real_exports, write_export_never_overwrites_an_earlier_export, write_export_skips_a_name_taken_by_a_folder, write_export_skips_a_name_whose_claim_is_left, write_export_takes_a_report_and_suffixes_it_before_xlsx |
| S21 | is_export_name: dot-first names allowed | SURVIVED |  |
| S22 | is_export_name: bare extension allowed by length | SURVIVED |  |
| S23 | is_export_name: backslash allowed | SURVIVED |  |
| S24 | is_export_name: space allowed | KILLED | write_export_takes_a_report_and_suffixes_it_before_xlsx |
| S25 | write_export: no name check | KILLED | write_export_takes_a_report_and_suffixes_it_before_xlsx, write_export_writes_into_exports_and_rejects_unsafe_names |
| S26 | interrupted exports: removes every export file | KILLED | open_removes_what_an_interrupted_export_left_and_keeps_real_exports |
| S27 | interrupted exports: keeps claims | KILLED | open_again_in_the_same_process_keeps_a_running_export, open_removes_what_an_interrupted_export_left_and_keeps_real_exports, the_first_open_cleans_exports_even_when_it_cannot_remove_the_db_tmp |
| S28 | interrupted exports: keeps .tmp | KILLED | open_again_in_the_same_process_keeps_a_running_export, open_removes_what_an_interrupted_export_left_and_keeps_real_exports, the_first_open_cleans_exports_even_when_it_cannot_remove_the_db_tmp |
| S29 | interrupted exports: also folders | SURVIVED |  |
| S30 | stamp: seconds wrong | KILLED | stamp_formats_calendar_date_and_time |
| S31 | civil_from_days: leap month | KILLED | stamp_formats_calendar_date_and_time |
| S32 | backup_key: legacy "-0" suffix counts | KILLED | open_prunes_only_backups_it_named |
| S33 | is_stamp: longer date accepted | SURVIVED |  |
| S34 | next_seq: starts at 0 | KILLED | a_backup_made_with_the_clock_set_back_is_kept, a_clock_going_back_and_forth_keeps_the_ten_last_written_backups, a_locked_old_backup_does_not_block_startup, backup_copies_the_saved_file_and_returns_its_name, backup_keeps_only_the_ten_newest_backups, backup_of_an_already_copied_file_returns_the_existing_copy, latest_backup_is_the_last_written_and_none_without_backups, next_seq_is_one_past_the_highest_numbered_backup, open_backs_up_the_existing_file, open_keeps_only_the_ten_newest_backups, open_prunes_only_backups_it_named, open_twice_in_the_same_second_keeps_both_backups, starts_with_the_clock_in_2000_keep_the_latest_sessions_over_old_named_backups |
| S35 | next_seq: wraps at u64::MAX | SURVIVED |  |
| S36 | backup_names: counts folders | KILLED | open_prunes_only_backups_it_named |
| S37 | backup_names: unsorted (folder order) | KILLED | starts_with_the_clock_in_2000_keep_the_latest_sessions_over_old_named_backups |
| S38 | find_copy: size only | KILLED | a_backup_made_with_the_clock_set_back_is_kept, a_clock_going_back_and_forth_keeps_the_ten_last_written_backups, a_locked_old_backup_does_not_block_startup, backup_keeps_only_the_ten_newest_backups, latest_backup_is_the_last_written_and_none_without_backups, open_keeps_only_the_ten_newest_backups, open_prunes_only_backups_it_named, open_twice_in_the_same_second_keeps_both_backups, restarts_on_an_unchanged_file_keep_the_older_backups, starts_with_the_clock_in_2000_keep_the_latest_sessions_over_old_named_backups |
| S39 | prune: may delete the copy just written | SURVIVED |  |
| S40 | prune: keeps eleven | KILLED | a_backup_made_with_the_clock_set_back_is_kept, a_locked_old_backup_does_not_block_startup, backup_keeps_only_the_ten_newest_backups, open_keeps_only_the_ten_newest_backups, open_prunes_only_backups_it_named, open_twice_in_the_same_second_keeps_both_backups, restarts_on_an_unchanged_file_keep_the_older_backups, starts_with_the_clock_in_2000_keep_the_latest_sessions_over_old_named_backups |
| S41 | prune: newest first | KILLED | a_clock_going_back_and_forth_keeps_the_ten_last_written_backups, a_locked_old_backup_does_not_block_startup, open_keeps_only_the_ten_newest_backups, open_prunes_only_backups_it_named, open_twice_in_the_same_second_keeps_both_backups, starts_with_the_clock_in_2000_keep_the_latest_sessions_over_old_named_backups |
| S42 | prune: a failed removal still counts | KILLED | a_locked_old_backup_does_not_block_startup |
| S43 | folder: accepts any kind as exports | KILLED | folder_takes_only_exports_or_backups_and_creates_it |
| S44 | explorer_arg: unquoted | KILLED | explorer_arg_quotes_the_path_and_keeps_it_verbatim |
| S45 | latest_backup: oldest instead of newest | KILLED | latest_backup_is_the_last_written_and_none_without_backups |
| S46 | backup(): no reuse check either (writes a second identical copy) | KILLED | backup_of_an_already_copied_file_returns_the_existing_copy |

## Phụ lục B — Log probe

### `probe-results.log` (lượt chạy cuối, mọi probe Rust)

```text
## perf-save load.db
file load.db: 13074432 bytes, dir C:\Users\<user>\AppData\Local\Temp\p2c-probe-save-39120
save (write_atomic): n=30 min=8.4 median=9.2 p90=10.4 max=14.3 ms
  create+write_all: n=30 min=2.8 median=3.1 p90=3.6 max=3.8 ms
  sync_all: n=30 min=3.8 median=4.8 p90=9.9 max=11.0 ms
  rename: n=30 min=0.2 median=1.3 p90=1.4 max=2.0 ms
## perf-save seed.db
file seed.db: 9306112 bytes, dir C:\Users\<user>\AppData\Local\Temp\p2c-probe-save-28744
save (write_atomic): n=30 min=5.9 median=6.9 p90=7.9 max=11.7 ms
  create+write_all: n=30 min=2.1 median=2.2 p90=3.0 max=3.3 ms
  sync_all: n=30 min=2.8 median=3.5 p90=4.4 max=8.7 ms
  rename: n=30 min=0.3 median=1.0 p90=1.2 max=1.3 ms
## perf-open load.db
open, 10 backups, other sizes (changed file): n=10 min=13.0 median=14.1 p90=15.6 max=15.6 ms
open, 10 backups, other sizes (unchanged file): n=10 min=9.7 median=10.7 p90=11.3 max=11.3 ms
open, 10 backups, same size (changed file): n=10 min=68.8 median=70.6 p90=73.1 max=73.1 ms
open, 10 backups, same size (unchanged file): n=10 min=55.7 median=64.1 p90=66.2 max=66.2 ms
open, first backup (no backups yet): n=10 min=12.8 median=13.4 p90=17.4 max=17.4 ms
## perf-open seed.db
open, 10 backups, other sizes (changed file): n=10 min=9.4 median=10.8 p90=19.3 max=19.3 ms
open, 10 backups, other sizes (unchanged file): n=10 min=6.8 median=7.4 p90=8.0 max=8.0 ms
open, 10 backups, same size (changed file): n=10 min=47.5 median=49.7 p90=53.7 max=53.7 ms
open, 10 backups, same size (unchanged file): n=10 min=40.9 median=43.0 p90=44.6 max=44.6 ms
open, first backup (no backups yet): n=10 min=8.6 median=10.0 p90=11.1 max=11.1 ms
## held
held (share read): save -> Err("PermissionDenied / raw Some(5) / Access is denied. (os error 5)"); .tmp left=false; open -> Ok(Some(9306112))
held (share read|write): save -> Err("PermissionDenied / raw Some(5) / Access is denied. (os error 5)"); .tmp left=false; open -> Ok(Some(9306112))
held (share read|write|delete): save -> Ok(()); .tmp left=false; open -> Ok(Some(9306112))
held (share none): save -> Err("PermissionDenied / raw Some(5) / Access is denied. (os error 5)"); .tmp left=false; open -> Err("Uncategorized / raw Some(32) / The process cannot access the file because it is being used by another process. (os error 32)")
## race-reload load.db
race_reload load.db rounds=200 delay 0..20000 us:
    88 × save=ERR NotFound | new page reads v1(old) | disk v1(old)
     3 × save=ERR PermissionDenied | new page reads v1(old) | disk v1(old)
     1 × save=ok | new page reads v1(old) | disk v2(new)
   108 × save=ok | new page reads v2(new) | disk v2(new)
## race-open
race_open same_second=true rounds=300:
   123 × first page Err("NotFound"), reloaded page Ok(()), backups 2
   145 × first page Ok(()), reloaded page Err("NotFound"), backups 2
    32 × first page Ok(()), reloaded page Ok(()), backups 2
race_open same_second=false rounds=300:
   300 × first page Ok(()), reloaded page Ok(()), backups 3
## race-backup (different seconds)
race_backup rounds=300: both ok same name=0, both ok different names=300, one failed=0, copies not equal to the file=0
  errors: {}
  files in backups\ after the round (count -> rounds): {2: 300}
## race-backup (same second)
race_backup rounds=300: both ok same name=27, both ok different names=0, one failed=273, copies not equal to the file=0
  errors: {"NotFound: The system cannot find the file specified. (os error 2)": 273}
  files in backups\ after the round (count -> rounds): {1: 300}
## race-save-backup
race_save_backup: saves=300 save errors=0 | backups ok=45 errors=0 | backup files not equal to any saved version=0
## paths
path len 96: first start Ok(true); save Ok(()); backup Ok("project2c-s00000001-20261005-080001.db"); export Ok(138); explorer arg Ok("\"C:\\Users\\<user>\\AppData\\Local\\Temp\\p2c-probe-paths-14456\\Ứng dụng, bản 2 ✓\\Project2C-data\\exports\"")
path len 312: first start Ok(true); save Ok(()); backup Ok("project2c-s00000001-20261005-080001.db"); export Ok(354); explorer arg Ok("\"C:\\Users\\<user>\\AppData\\Local\\Temp\\p2c-probe-paths-14456\\aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\\Project2C-data\\exports\"")
## devices
NUL.p2cbackup: Ok("C:\\Users\\<user>\\AppData\\Local\\Temp\\p2c-probe-dev-28532\\exports\\NUL.p2cbackup"); exports now ["NUL.p2cbackup"]
CON.xlsx: Ok("C:\\Users\\<user>\\AppData\\Local\\Temp\\p2c-probe-dev-28532\\exports\\CON.xlsx"); exports now ["CON.xlsx", "NUL.p2cbackup"]
COM1.xlsx: Ok("C:\\Users\\<user>\\AppData\\Local\\Temp\\p2c-probe-dev-28532\\exports\\COM1.xlsx"); exports now ["COM1.xlsx", "CON.xlsx", "NUL.p2cbackup"]
aux.p2cbackup: Ok("C:\\Users\\<user>\\AppData\\Local\\Temp\\p2c-probe-dev-28532\\exports\\aux.p2cbackup"); exports now ["aux.p2cbackup", "COM1.xlsx", "CON.xlsx", "NUL.p2cbackup"]
nul.xlsx: Ok("C:\\Users\\<user>\\AppData\\Local\\Temp\\p2c-probe-dev-28532\\exports\\nul.xlsx"); exports now ["aux.p2cbackup", "COM1.xlsx", "CON.xlsx", "NUL.p2cbackup", "nul.xlsx"]
## damaged
damaged: open returned the damaged bytes = true; newest backup project2c-s00000004-20261005-080000.db is the damaged file = true
```

### `probe-s18-s23.log`

```text
--- unchanged
S18 create_new over a folder: PermissionDenied raw Some(5)
S18 write_export: Ok("C:\\Users\\<user>\\AppData\\Local\\Temp\\p2c-storage-33784-0\\exports\\a-2.p2cbackup")
.S23 write_export -> Err(Custom { kind: InvalidInput, error: "invalid export name: x\\..\\..\\evil.p2cbackup" }); file outside exports\: false
--- S23
S18 create_new over a folder: PermissionDenied raw Some(5)
S18 write_export: Ok("C:\\Users\\<user>\\AppData\\Local\\Temp\\p2c-storage-5144-0\\exports\\a-2.p2cbackup")
.S23 write_export -> Ok("C:\\Users\\<user>\\AppData\\Local\\Temp\\p2c-storage-5144-1\\exports\\x\\..\\..\\evil.p2cbackup"); file outside exports\: true
--- S18
S18 create_new over a folder: PermissionDenied raw Some(5)
S18 write_export: Err(Os { code: 5, kind: PermissionDenied, message: "Access is denied." })
.S23 write_export -> Err(Custom { kind: InvalidInput, error: "invalid export name: x\\..\\..\\evil.p2cbackup" }); file outside exports\: false
```

### `which.exe` (CL-C7, lệnh PowerShell đã chạy và kết quả)

```text
$d = Join-Path $env:TEMP "p2c-which-probe"; copy which.exe vào $d
& "$d\which.exe"                      -> ran, stdout = d13_thinkpad\<user>   (whoami.exe của System32)
Copy-Item C:\Windows\System32\hostname.exe "$d\whoami.exe"; Set-Location C:\
& "$d\which.exe"                      -> ran, stdout = D13_ThinkPad         (chương trình cạnh exe chạy)
```

### Kết quả probe JS

```json
// probe-export-db.result.json
{
 "loadBytes": 13074432,
 "seedBytes": 9306112
}
// probe-size.result.json
{
 "startBytes": 13074432,
 "commands": 200,
 "distinctSizes": 12,
 "firstSizes": [
  13078528,
  13082624,
  13086720,
  13090816,
  13094912
 ],
 "sameAsStart": 0
}
// probe-damaged.result.json
{
 "outcome": "refused: Error: database disk image is malformed"
}
```

### `clippy-pedantic.log` (chỉ cảnh báo + vị trí)

```text
warning: consider adding a `;` to the last statement for consistent formatting
 --> build.rs:2:5
warning: temporary with significant `Drop` can be early dropped
  --> src\storage.rs:41:17
warning: redundant closure
  --> src\storage.rs:44:29
warning: casting `u64` to `i64` may wrap around the value
  --> src\lib.rs:52:16
warning: this argument is passed by value, but not consumed in the function body
  --> src\lib.rs:61:21
warning: this argument is passed by value, but not consumed in the function body
  --> src\lib.rs:68:26
warning: this argument is passed by value, but not consumed in the function body
  --> src\lib.rs:87:22
warning: docs for function which may panic missing `# Panics` section
   --> src\lib.rs:98:1
   --> src\lib.rs:99:5
warning: consider adding a `;` to the last statement for consistent formatting
 --> src\main.rs:5:5
```

## Phụ lục C — Nguồn test tạm / probe

### `probe/Cargo.toml`

```toml
[package]
name = "p2c_storage_probe"
version = "0.0.0"
edition = "2021"
publish = false

[[bin]]
name = "probe"
path = "src/main.rs"

[[bin]]
name = "which"
path = "src/bin/which.rs"

[profile.release]
debug = false
```

### `probe/src/main.rs`

```rust
//! Gói C probes: times and races the review worktree's `storage.rs` (included read-only by path)
//! through its public API, the same calls `lib.rs` makes. Usage: `probe <name> [args]`.
#![allow(dead_code)]

#[path = "C:/workspace/Project-2C-review/apps/desktop/src-tauri/src/storage.rs"]
mod storage;

use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Barrier};
use std::thread;
use std::time::{Duration, Instant};

const C: &str = "C:/workspace/deep-review-1-4/claude/C";

fn fresh(name: &str) -> PathBuf {
    let dir = std::env::temp_dir().join(format!("p2c-probe-{name}-{}", std::process::id()));
    let _ = fs::remove_dir_all(&dir);
    fs::create_dir_all(&dir).unwrap();
    dir
}

fn variant(bytes: &[u8], n: u32) -> Vec<u8> {
    let mut v = bytes.to_vec();
    let at = v.len() - 1 - (n as usize % 1000);
    v[at] = v[at].wrapping_add(1 + (n % 250) as u8);
    v
}

fn stats(label: &str, mut ms: Vec<f64>) -> String {
    ms.sort_by(|a, b| a.partial_cmp(b).unwrap());
    let med = ms[ms.len() / 2];
    let p90 = ms[(ms.len() * 9 / 10).min(ms.len() - 1)];
    let line = format!(
        "{label}: n={} min={:.1} median={:.1} p90={:.1} max={:.1} ms",
        ms.len(),
        ms[0],
        med,
        p90,
        ms[ms.len() - 1]
    );
    println!("{line}");
    line
}

fn ms(start: Instant) -> f64 {
    start.elapsed().as_secs_f64() * 1000.0
}

/// `storage::save` of a real database file, and the same three steps timed apart.
fn perf_save(file: &str, n: u32) {
    let bytes = fs::read(format!("{C}/{file}")).unwrap();
    let dir = fresh("save");
    storage::save(&dir, &bytes).unwrap();
    let mut total = Vec::new();
    let (mut write, mut sync, mut rename) = (Vec::new(), Vec::new(), Vec::new());
    for i in 0..n {
        let v = variant(&bytes, i);
        let t = Instant::now();
        storage::save(&dir, &v).unwrap();
        total.push(ms(t));
        // Same steps as write_atomic, timed apart.
        let tmp = dir.join("split.tmp");
        let t = Instant::now();
        let mut f = fs::File::create(&tmp).unwrap();
        f.write_all(&v).unwrap();
        write.push(ms(t));
        let t = Instant::now();
        f.sync_all().unwrap();
        sync.push(ms(t));
        drop(f);
        let t = Instant::now();
        fs::rename(&tmp, dir.join("split.db")).unwrap();
        rename.push(ms(t));
    }
    println!("file {file}: {} bytes, dir {}", bytes.len(), dir.display());
    stats("save (write_atomic)", total);
    stats("  create+write_all", write);
    stats("  sync_all", sync);
    stats("  rename", rename);
    let _ = fs::remove_dir_all(&dir);
}

/// `storage::open` at startup: no backups, ten backups of another size, ten of the same size.
fn perf_open(file: &str, n: u32) {
    let bytes = fs::read(format!("{C}/{file}")).unwrap();
    for (label, same_size) in [("10 backups, other sizes", false), ("10 backups, same size", true)] {
        let dir = fresh("open");
        let mut times = Vec::new();
        for i in 0..(10 + n) {
            let mut v = variant(&bytes, i);
            if !same_size {
                v.extend(std::iter::repeat(0u8).take(4096 * (i as usize + 1)));
            }
            storage::save(&dir, &v).unwrap();
            let lock = storage::DataLock::new();
            let t = Instant::now();
            storage::open(&dir, &format!("20261005-08{:02}{:02}", i / 60, i % 60), &lock).unwrap();
            if i >= 10 {
                times.push(ms(t));
            }
        }
        stats(&format!("open, {label} (changed file)"), times);
        // Restart on an unchanged file: an identical copy is the newest backup.
        let mut times = Vec::new();
        for i in 0..n {
            let lock = storage::DataLock::new();
            let t = Instant::now();
            storage::open(&dir, &format!("20261005-09{:02}00", i), &lock).unwrap();
            times.push(ms(t));
        }
        stats(&format!("open, {label} (unchanged file)"), times);
        let _ = fs::remove_dir_all(&dir);
    }
    let mut times = Vec::new();
    for i in 0..n {
        let dir = fresh("open0");
        storage::save(&dir, &variant(&bytes, i)).unwrap();
        let lock = storage::DataLock::new();
        let t = Instant::now();
        storage::open(&dir, "20261005-080000", &lock).unwrap();
        times.push(ms(t));
        let _ = fs::remove_dir_all(&dir);
    }
    stats("open, first backup (no backups yet)", times);
}

/// Two `storage::backup` calls at once (two `replace` overlapping, S-2) on the same file.
fn race_backup(rounds: u32) {
    let bytes = fs::read(format!("{C}/seed.db")).unwrap();
    let (mut both_ok_same, mut both_ok_diff, mut one_err) = (0, 0, 0);
    let mut errors = std::collections::BTreeMap::<String, u32>::new();
    let mut files_after = std::collections::BTreeMap::<usize, u32>::new();
    let mut bad_copy = 0;
    for round in 0..rounds {
        let dir = fresh("rb");
        storage::save(&dir, &variant(&bytes, round)).unwrap();
        let barrier = Arc::new(Barrier::new(2));
        let handles: Vec<_> = (0..2)
            .map(|k| {
                let dir = dir.clone();
                let barrier = barrier.clone();
                thread::spawn(move || {
                    barrier.wait();
                    let k = if std::env::var("SAME_STAMP").is_ok() { 0 } else { k };
                    storage::backup(&dir, &format!("20261005-10000{k}"))
                })
            })
            .collect();
        let results: Vec<_> = handles.into_iter().map(|h| h.join().unwrap()).collect();
        match (&results[0], &results[1]) {
            (Ok(a), Ok(b)) if a == b => both_ok_same += 1,
            (Ok(_), Ok(_)) => both_ok_diff += 1,
            _ => one_err += 1,
        }
        for r in &results {
            if let Err(e) = r {
                *errors.entry(format!("{:?}: {e}", e.kind())).or_default() += 1;
            }
        }
        let backups = dir.join("backups");
        let names: Vec<_> = fs::read_dir(&backups).unwrap().flatten().collect();
        *files_after.entry(names.len()).or_default() += 1;
        for entry in names {
            if fs::read(entry.path()).unwrap() != variant(&bytes, round) {
                bad_copy += 1;
            }
        }
        let _ = fs::remove_dir_all(&dir);
    }
    println!(
        "race_backup rounds={rounds}: both ok same name={both_ok_same}, both ok different names={both_ok_diff}, one failed={one_err}, copies not equal to the file={bad_copy}"
    );
    println!("  errors: {errors:?}");
    println!("  files in backups\\ after the round (count -> rounds): {files_after:?}");
}

/// A webview reload while a save of the old page is still running: the new page's `db_open`
/// (same process, lock held) races the old page's `db_save`.
fn race_reload(file: &str, rounds: u32, max_delay_us: u64) {
    let bytes = fs::read(format!("{C}/{file}")).unwrap();
    let v1 = variant(&bytes, 1);
    let v2 = variant(&bytes, 2);
    let mut outcome = std::collections::BTreeMap::<String, u32>::new();
    for round in 0..rounds {
        let dir = fresh("rr");
        let lock = Arc::new(storage::DataLock::new());
        storage::save(&dir, &v1).unwrap();
        storage::open(&dir, "20261005-080000", &lock).unwrap();
        let delay = Duration::from_micros(max_delay_us * u64::from(round) / u64::from(rounds));
        let barrier = Arc::new(Barrier::new(2));
        let saver = {
            let (dir, v2, barrier) = (dir.clone(), v2.clone(), barrier.clone());
            thread::spawn(move || {
                barrier.wait();
                storage::save(&dir, &v2).map_err(|e| format!("{:?}", e.kind()))
            })
        };
        let opener = {
            let (dir, lock, barrier) = (dir.clone(), lock.clone(), barrier.clone());
            thread::spawn(move || {
                barrier.wait();
                thread::sleep(delay);
                storage::open(&dir, "20261005-080001", &lock)
            })
        };
        let saved = saver.join().unwrap();
        let opened = opener.join().unwrap();
        let disk = fs::read(dir.join("project2c.db")).unwrap();
        let which = |b: &[u8]| {
            if b == v1.as_slice() {
                "v1(old)"
            } else if b == v2.as_slice() {
                "v2(new)"
            } else {
                "OTHER"
            }
        };
        let page = match &opened {
            Ok(Some(b)) => which(b).to_string(),
            Ok(None) => "none".into(),
            Err(e) => format!("err {:?}", e.kind()),
        };
        let key = format!(
            "save={} | new page reads {} | disk {}",
            match &saved {
                Ok(()) => "ok".to_string(),
                Err(k) => format!("ERR {k}"),
            },
            page,
            which(&disk)
        );
        *outcome.entry(key).or_default() += 1;
        drop(lock);
        let _ = fs::remove_dir_all(&dir);
    }
    println!("race_reload {file} rounds={rounds} delay 0..{max_delay_us} us:");
    for (k, v) in outcome {
        println!("  {v:>4} × {k}");
    }
}

/// `db_save` while `db_backup` reads the same file (late write during the backup wait, S-2).
fn race_save_backup(rounds: u32) {
    let bytes = fs::read(format!("{C}/seed.db")).unwrap();
    let dir = fresh("rsb");
    let v: Vec<Vec<u8>> = (0..rounds).map(|i| variant(&bytes, i)).collect();
    storage::save(&dir, &v[0]).unwrap();
    let done = Arc::new(std::sync::atomic::AtomicBool::new(false));
    let backups = {
        let (dir, done) = (dir.clone(), done.clone());
        thread::spawn(move || {
            let (mut ok, mut err) = (0, Vec::new());
            let mut i = 0;
            while !done.load(std::sync::atomic::Ordering::Relaxed) {
                match storage::backup(&dir, &format!("20261005-1{:05}", i % 100_000)) {
                    Ok(_) => ok += 1,
                    Err(e) => err.push(format!("{:?}: {e}", e.kind())),
                }
                i += 1;
            }
            (ok, err)
        })
    };
    let mut save_err = Vec::new();
    for b in &v {
        if let Err(e) = storage::save(&dir, b) {
            save_err.push(format!("{:?}: {e}", e.kind()));
        }
    }
    done.store(true, std::sync::atomic::Ordering::Relaxed);
    let (ok, err) = backups.join().unwrap();
    let mut torn = 0;
    for entry in fs::read_dir(dir.join("backups")).unwrap().flatten() {
        let b = fs::read(entry.path()).unwrap();
        if !v.iter().any(|x| *x == b) {
            torn += 1;
        }
    }
    println!(
        "race_save_backup: saves={rounds} save errors={} | backups ok={ok} errors={} | backup files not equal to any saved version={torn}",
        save_err.len(),
        err.len()
    );
    for e in save_err.iter().take(3) {
        println!("  save error: {e}");
    }
    for e in err.iter().take(3) {
        println!("  backup error: {e}");
    }
    let _ = fs::remove_dir_all(&dir);
}

/// Another program holds the database file (a SQLite browser, an antivirus, a sync client).
#[cfg(windows)]
fn held() {
    use std::os::windows::fs::OpenOptionsExt;
    let bytes = fs::read(format!("{C}/seed.db")).unwrap();
    for (label, share) in [
        ("share read", 1u32),
        ("share read|write", 3),
        ("share read|write|delete", 7),
        ("share none", 0),
    ] {
        let dir = fresh("held");
        storage::save(&dir, &bytes).unwrap();
        let handle = fs::OpenOptions::new()
            .read(true)
            .share_mode(share)
            .open(dir.join("project2c.db"))
            .unwrap();
        let save = storage::save(&dir, &variant(&bytes, 9));
        let tmp_left = dir.join("project2c.db.tmp").exists();
        let lock = storage::DataLock::new();
        let open = storage::open(&dir, "20261005-080000", &lock).map(|b| b.map(|b| b.len()));
        drop(handle);
        println!(
            "held ({label}): save -> {:?}; .tmp left={tmp_left}; open -> {:?}",
            save.map_err(|e| format!("{:?} / raw {:?} / {e}", e.kind(), e.raw_os_error())),
            open.map_err(|e| format!("{:?} / raw {:?} / {e}", e.kind(), e.raw_os_error()))
        );
        let _ = fs::remove_dir_all(&dir);
    }
}

/// Data folder under a Unicode name with a comma and a space, and under a path past MAX_PATH.
fn paths() {
    let bytes = fs::read(format!("{C}/seed.db")).unwrap();
    let base = fresh("paths");
    let unicode = base.join("Ứng dụng, bản 2 ✓").join(storage::DATA_DIR);
    let long = base.join("a".repeat(120)).join("b".repeat(120)).join(storage::DATA_DIR);
    for dir in [unicode, long] {
        let len = dir.as_os_str().len();
        let lock = storage::DataLock::new();
        let first = storage::open(&dir, "20261005-080000", &lock).map(|b| b.is_none());
        let save = storage::save(&dir, &bytes);
        let backup = storage::backup(&dir, "20261005-080001");
        let export = storage::write_export(&dir, "project2c-20261005-0800.p2cbackup", b"x");
        let folder = storage::folder(&dir, "exports").map(|p| storage::explorer_arg(&p));
        println!("path len {len}: first start {first:?}; save {save:?}; backup {backup:?}; export {:?}; explorer arg {folder:?}", export.map(|p| p.as_os_str().len()));
    }
    let _ = fs::remove_dir_all(&base);
}

/// Export names the validator takes that are Windows device names.
fn device_names() {
    let dir = fresh("dev");
    for name in ["NUL.p2cbackup", "CON.xlsx", "COM1.xlsx", "aux.p2cbackup", "nul.xlsx"] {
        let r = storage::write_export(&dir, name, b"data");
        let listed: Vec<String> = fs::read_dir(dir.join("exports")).map(|d| d.flatten().map(|e| e.file_name().to_string_lossy().into_owned()).collect()).unwrap_or_default();
        println!("{name}: {:?}; exports now {listed:?}", r.map(|p| p.display().to_string()).map_err(|e| e.to_string()));
    }
    let _ = fs::remove_dir_all(&dir);
}

/// A database file that has the SQLite header but that the app then refuses (corrupt inside):
/// which backup is the newest after the failed start?
fn damaged() {
    let good = fs::read(format!("{C}/seed.db")).unwrap();
    let dir = fresh("damaged");
    for i in 0..3 {
        storage::save(&dir, &variant(&good, i)).unwrap();
        storage::open(&dir, &format!("2026100{}-080000", i + 1), &storage::DataLock::new()).unwrap();
    }
    let mut bad = good[..good.len() / 2].to_vec();
    bad.extend(std::iter::repeat(0u8).take(good.len() / 2));
    storage::save(&dir, &bad).unwrap();
    let returned = storage::open(&dir, "20261005-080000", &storage::DataLock::new()).unwrap();
    let latest = storage::latest_backup(&dir).unwrap();
    let latest_bytes = fs::read(dir.join("backups").join(&latest)).unwrap();
    println!("damaged: open returned the damaged bytes = {}; newest backup {latest} is the damaged file = {}", returned.as_deref() == Some(bad.as_slice()), latest_bytes == bad);
    let _ = fs::remove_dir_all(&dir);
}

/// A webview reload during startup: two db_open of the same process (lock held) at once on a
/// file that changed since the last backup, both same second (same stamp) or not.
fn race_open(rounds: u32) {
    let bytes = fs::read(format!("{C}/seed.db")).unwrap();
    for same in [true, false] {
        let mut outcome = std::collections::BTreeMap::<String, u32>::new();
        for round in 0..rounds {
            let dir = fresh("ro");
            let lock = Arc::new(storage::DataLock::new());
            storage::save(&dir, &variant(&bytes, 0)).unwrap();
            storage::open(&dir, "20261005-070000", &lock).unwrap();
            storage::save(&dir, &variant(&bytes, round + 1)).unwrap();
            let barrier = Arc::new(Barrier::new(2));
            let hs: Vec<_> = (0..2).map(|k| {
                let (dir, lock, barrier) = (dir.clone(), lock.clone(), barrier.clone());
                thread::spawn(move || {
                    barrier.wait();
                    let stamp = if same { "20261005-080000".to_string() } else { format!("20261005-08000{k}") };
                    storage::open(&dir, &stamp, &lock).map(|_| ()).map_err(|e| format!("{:?}", e.kind()))
                })
            }).collect();
            let r: Vec<_> = hs.into_iter().map(|h| h.join().unwrap()).collect();
            let n = fs::read_dir(dir.join("backups")).unwrap().count();
            *outcome.entry(format!("first page {:?}, reloaded page {:?}, backups {n}", r[0], r[1])).or_default() += 1;
            let _ = fs::remove_dir_all(&dir);
        }
        println!("race_open same_second={same} rounds={rounds}:");
        for (k, v) in outcome { println!("  {v:>4} × {k}"); }
    }
}

fn path_arg(path: &Path) -> String {
    path.display().to_string()
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let n = |i: usize, d: u32| args.get(i).and_then(|s| s.parse().ok()).unwrap_or(d);
    match args.get(1).map(String::as_str) {
        Some("perf-save") => perf_save(&args[2], n(3, 30)),
        Some("perf-open") => perf_open(&args[2], n(3, 10)),
        Some("paths") => paths(),
        Some("race-open") => race_open(n(2, 200)),
        Some("devices") => device_names(),
        Some("damaged") => damaged(),
        Some("race-backup") => race_backup(n(2, 200)),
        Some("race-reload") => race_reload(&args[2], n(3, 200), u64::from(n(4, 40_000))),
        Some("race-save-backup") => race_save_backup(n(2, 200)),
        #[cfg(windows)]
        Some("held") => held(),
        _ => eprintln!("unknown probe; see main.rs"),
    }
}
```

### `probe/src/bin/which.rs`

```rust
//! Which `whoami.exe` does `Command::new` run? Same lookup as `Command::new("explorer.exe")` in
//! `lib.rs::open_folder`. Put a different program named `whoami.exe` next to this exe to see
//! whether the exe's own folder is searched before System32.
fn main() {
    let out = std::process::Command::new("whoami.exe").output();
    match out {
        Ok(o) => println!("ran, stdout = {}", String::from_utf8_lossy(&o.stdout).trim()),
        Err(e) => println!("error: {e}"),
    }
}
```

### `mut/Cargo.toml`

```toml
[package]
name = "p2c_storage_mut"
version = "0.0.0"
edition = "2021"
publish = false

[lib]
path = "src/lib.rs"
```

### `mutate.mjs`

```js
// Mutation run for gói C: applies one change at a time to a copy of storage.rs (mut/src/lib.rs,
// copied from the review worktree at f0c53eb) and runs its 37 tests. A mutation is killed when
// `cargo test` fails. Usage: node mutate.mjs   (from this folder; writes mutate-results.json)
import { execSync } from 'node:child_process';
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';

const here = 'C:/workspace/deep-review-1-4/claude/C';
const source = 'C:/workspace/Project-2C-review/apps/desktop/src-tauri/src/storage.rs';
const target = `${here}/mut/src/lib.rs`;
const original = readFileSync(source, 'utf8');

/** [id, what it breaks, exact text, replacement] — the text must occur exactly once. */
const mutations = [
  ['S1', 'acquire: a re-open counts as the first (cleans exports again)', 'return Ok(false);', 'return Ok(true);'],
  ['S2', 'lock file shared', 'options.share_mode(0);', 'options.share_mode(7);'],
  ['S3', 'sharing violation not mapped to ALREADY_OPEN', 'Some(32)', 'Some(33)'],
  ['S4', 'poisoned lock panics instead of recovering', '.unwrap_or_else(|poisoned| poisoned.into_inner());', '.unwrap();'],
  ['S5', 'open: never cleans interrupted exports', 'remove_interrupted_exports(&dir.join(EXPORT_DIR));\n    }', '}'],
  ['S6', 'open: cleans exports on every open', 'if lock.acquire(dir)? {', 'if lock.acquire(dir).map(|_| true)? {'],
  ['S7', 'open: keeps the crash .tmp', 'remove_if_exists(&dir.join(tmp_name(DB_FILE)))?;', ''],
  ['S8', 'open: .tmp removal error ignored', 'remove_if_exists(&dir.join(tmp_name(DB_FILE)))?;', 'let _ = remove_if_exists(&dir.join(tmp_name(DB_FILE)));'],
  ['S9', 'open: missing file with backups is a first start', 'ErrorKind::NotFound && !backup_names(&backups).is_empty()', 'ErrorKind::NotFound && false'],
  ['S10', 'open: no SQLite header check', 'if !bytes.starts_with(SQLITE_HEADER) {', 'if false {'],
  ['S11', 'copy_to_backups: never reuses an identical copy', 'if let Some(name) = find_copy(backups, bytes) {', 'if let Some(name) = None::<String> {'],
  ['S12', 'copy_to_backups: never prunes', 'prune_backups(backups, &name);', ''],
  ['S13', 'write_atomic: no sync_all', 'file.sync_all()?;', ''],
  ['S14', 'write_atomic: writes the final name directly (no tmp)', 'let tmp = dir.join(tmp_name(name));', 'let tmp = dir.join(name);'],
  ['S15', 'write_atomic: leaves the .tmp after a failure', 'let _ = fs::remove_file(&tmp);', ''],
  ['S16', 'write_export: leaves the claim', 'let _ = fs::remove_file(claim);', 'let _ = claim;'],
  ['S17', 'claim: takes a name with a file under it', 'Ok(_) if fs::symlink_metadata(exports.join(&candidate)).is_ok() => {', 'Ok(_) if false => {'],
  ['S18', 'claim: access denied on a folder-named claim is an error', '|| fs::symlink_metadata(&claim).is_ok() => {}', '=> {}'],
  ['S19', 'claim: a single try', 'for n in 1..=MAX_EXPORT_SUFFIX {', 'for n in 1..=1 {'],
  ['S20', 'claim: suffix without dash', 'format!("{stem}-{n}{extension}")', 'format!("{stem}{n}{extension}")'],
  ['S21', 'is_export_name: dot-first names allowed', "&& !name.starts_with('.')", ''],
  ['S22', 'is_export_name: bare extension allowed by length', 'name.len() > extension.len()', 'name.len() >= extension.len()'],
  ['S23', 'is_export_name: backslash allowed', "matches!(c, '-' | '_' | '.')", "matches!(c, '-' | '_' | '.' | '\\\\')"],
  ['S24', 'is_export_name: space allowed', "matches!(c, '-' | '_' | '.')", "matches!(c, '-' | '_' | '.' | ' ')"],
  ['S25', 'write_export: no name check', 'if !is_export_name(name) {', 'if false {'],
  ['S26', 'interrupted exports: removes every export file', '|| (name.ends_with(extension) && meta.len() == 0)', '|| name.ends_with(extension)'],
  ['S27', 'interrupted exports: keeps claims', 'name.ends_with(&format!("{extension}.claim"))\n                ||', ''],
  ['S28', 'interrupted exports: keeps .tmp', '|| name.ends_with(&format!("{extension}.tmp"))', ''],
  ['S29', 'interrupted exports: also folders', 'if left && meta.is_file() {', 'if left {'],
  ['S30', 'stamp: seconds wrong', 'secs % 60\n', 'secs % 61\n'],
  ['S31', 'civil_from_days: leap month', 'i64::from(month <= 2)', 'i64::from(month < 2)'],
  ['S32', 'backup_key: legacy "-0" suffix counts', ".filter(|d| all_digits(d) && !d.starts_with('0'))?;", '.filter(|d| all_digits(d))?;'],
  ['S33', 'is_stamp: longer date accepted', 'date.len() == 8 && time.len() == 6', 'date.len() >= 8 && time.len() == 6'],
  ['S34', 'next_seq: starts at 0', '.map_or(1, |seq| seq.saturating_add(1))', '.map_or(0, |seq| seq.saturating_add(1))'],
  ['S35', 'next_seq: wraps at u64::MAX', 'seq.saturating_add(1)', 'seq.wrapping_add(1)'],
  ['S36', 'backup_names: counts folders', '.filter(|entry| entry.file_type().is_ok_and(|kind| kind.is_file()))', ''],
  ['S37', 'backup_names: unsorted (folder order)', 'names.sort_by(|a, b| backup_key(a).cmp(&backup_key(b)));', ''],
  ['S38', 'find_copy: size only', '&& fs::read(&path).is_ok_and(|copy| copy == bytes)', ''],
  ['S39', 'prune: may delete the copy just written', 'for name in names.iter().filter(|name| *name != keep) {', 'for name in names.iter() {'],
  ['S40', 'prune: keeps eleven', 'const KEEP_BACKUPS: usize = 10;', 'const KEEP_BACKUPS: usize = 11;'],
  ['S41', 'prune: newest first', 'let names = backup_names(backups);\n    let mut excess', 'let mut names = backup_names(backups);\n    names.reverse();\n    let mut excess'],
  ['S42', 'prune: a failed removal still counts', 'if fs::remove_file(backups.join(name)).is_ok() {\n            excess -= 1;\n        }', 'let _ = fs::remove_file(backups.join(name));\n        excess -= 1;'],
  ['S43', 'folder: accepts any kind as exports', '_ => {\n            return Err(io::Error::new(\n                ErrorKind::InvalidInput,\n                format!("unknown folder: {kind}"),', '_ if false => {\n            return Err(io::Error::new(\n                ErrorKind::InvalidInput,\n                format!("unknown folder: {kind}"),'],
  ['S44', 'explorer_arg: unquoted', 'let mut arg = OsString::from("\\"");\n    arg.push(path);\n    arg.push("\\"");', 'let mut arg = OsString::new();\n    arg.push(path);'],
  ['S45', 'latest_backup: oldest instead of newest', 'backup_names(&dir.join(BACKUP_DIR)).pop()', 'backup_names(&dir.join(BACKUP_DIR)).into_iter().next()'],
  ['S46', 'backup(): no reuse check either (writes a second identical copy)', 'let bytes = fs::read(dir.join(DB_FILE))?;\n    copy_to_backups(&dir.join(BACKUP_DIR), &bytes, stamp)', 'let bytes = fs::read(dir.join(DB_FILE))?;\n    let b = dir.join(BACKUP_DIR);\n    let name = backup_name(next_seq(&b), stamp);\n    write_atomic(&b, &name, &bytes)?;\n    prune_backups(&b, &name);\n    Ok(name)'],
];

// S43 needs a fallback arm once the error arm is disabled.
const fixups = {
  S43: (text) => text.replace('"backups" => BACKUP_DIR,', '"backups" => BACKUP_DIR,\n        _ => EXPORT_DIR,'),
};

const results = [];
for (const [id, what, find, replace] of mutations) {
  const count = original.split(find).length - 1;
  if (count !== 1) {
    results.push({ id, what, status: `SKIPPED (text found ${count}×)` });
    console.log(id, 'SKIPPED', count);
    continue;
  }
  let text = original.replace(find, replace);
  if (fixups[id]) text = fixups[id](text);
  writeFileSync(target, text);
  let status;
  let failing = [];
  try {
    execSync('cargo test --quiet', { cwd: `${here}/mut`, stdio: 'pipe', timeout: 300_000 });
    status = 'SURVIVED';
  } catch (error) {
    const out = `${error.stdout ?? ''}${error.stderr ?? ''}`;
    if (/error(\[E\d+\])?:/.test(out) && !/test result: FAILED/.test(out)) {
      status = 'COMPILE_ERROR';
      failing = out.split('\n').filter((l) => /^error/.test(l)).slice(0, 3);
    } else {
      status = 'KILLED';
      failing = [...out.matchAll(/^test (\S+) \.\.\. FAILED/gm)].map((m) => m[1]);
      if (failing.length === 0) failing = [...out.matchAll(/^    (tests::\S+)$/gm)].map((m) => m[1]);
    }
  }
  results.push({ id, what, status, failing });
  console.log(id, status, failing.join(' '));
}
copyFileSync(source, target);
writeFileSync(`${here}/mutate-results.json`, JSON.stringify(results, null, 1));
const tally = results.reduce((t, r) => ({ ...t, [r.status.split(' ')[0]]: (t[r.status.split(' ')[0]] ?? 0) + 1 }), {});
console.log(tally);
```

### `probe-s18-s23.rs`

```rust
// Appended inside `mod tests` of a copy of storage.rs by probe-s18-s23.mjs (with mutation S23
// applied for the first test): what the surviving mutations S18 and S23 would let through.

    #[test]
    fn probe_s23_backslash_escapes_exports() {
        let dir = temp_dir();
        let result = write_export(&dir, r"x\..\..\evil.p2cbackup", b"x");
        println!(
            "S23 write_export -> {:?}; file outside exports\\: {}",
            result.map(|p| p.display().to_string()),
            dir.join("evil.p2cbackup").exists()
        );
    }

    #[test]
    fn probe_s18_folder_under_claim_name() {
        let dir = temp_dir();
        let exports = dir.join(EXPORT_DIR);
        fs::create_dir_all(exports.join("a.p2cbackup.claim")).unwrap();
        let err = fs::OpenOptions::new()
            .write(true)
            .create_new(true)
            .open(exports.join("a.p2cbackup.claim"))
            .unwrap_err();
        println!(
            "S18 create_new over a folder: {:?} raw {:?}",
            err.kind(),
            err.raw_os_error()
        );
        println!(
            "S18 write_export: {:?}",
            write_export(&dir, "a.p2cbackup", b"x").map(|p| p.display().to_string())
        );
    }
```

### `probe-s18-s23.mjs`

```js
// Runs probe-s18-s23.rs inside a copy of storage.rs: once unchanged, once with S23 (backslash
// allowed in export names) and once with S18 (no access-denied branch in the claim loop).
// Usage: node probe-s18-s23.mjs   (from this folder)
import { execSync } from 'node:child_process';
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';

const here = 'C:/workspace/deep-review-1-4/claude/C';
const source = 'C:/workspace/Project-2C-review/apps/desktop/src-tauri/src/storage.rs';
const target = `${here}/mut/src/lib.rs`;
const original = readFileSync(source, 'utf8');
const probe = readFileSync(`${here}/probe-s18-s23.rs`, 'utf8');
const anchor = '    #[test]\n    fn stamp_formats_calendar_date_and_time';

const variants = {
  unchanged: (t) => t,
  S23: (t) => t.replace("matches!(c, '-' | '_' | '.')", "matches!(c, '-' | '_' | '.' | '\\\\')"),
  S18: (t) => t.replace('|| fs::symlink_metadata(&claim).is_ok() => {}', '=> {}'),
};
for (const [name, change] of Object.entries(variants)) {
  writeFileSync(target, change(original).replace(anchor, `${probe}\n${anchor}`));
  const out = execSync('cargo test --quiet probe_ -- --nocapture --test-threads 1 2>&1', {
    cwd: `${here}/mut`,
    encoding: 'utf8',
  });
  console.log(`--- ${name}`);
  console.log(out.split('\n').filter((l) => /S(18|23) /.test(l)).join('\n'));
}
copyFileSync(source, target);
```

### `vitest.probe.config.mts`

```ts
// Runs the gói C JS probes (probe-*.test.ts) against the review worktree's packages, read-only.
// Usage (PowerShell, from this folder): node node_modules/vitest/vitest.mjs run --config vitest.probe.config.mts
const repo = 'C:/workspace/Project-2C-review';
const here = 'C:/workspace/deep-review-1-4/claude/C';

export default {
  root: here,
  resolve: {
    alias: [
      { find: /^@p2c\/domain$/, replacement: `${repo}/packages/domain/src/index.ts` },
      { find: /^@p2c\/db$/, replacement: `${repo}/packages/db/src/index.ts` },
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

### `probe-export-db.test.ts`

```ts
// Builds the database file the exe would save for the load data set (`load.db`) and the seed demo
// (`seed.db`), so the Rust probes time `storage::save` / `open` on real sizes.
import { readFileSync, writeFileSync } from 'node:fs';
import { importBackup, openDatabase, seedDemoData } from '@p2c/db';
import { calendarDate } from '@p2c/domain';

const here = 'C:/workspace/deep-review-1-4/claude/C';

test('writes load.db and seed.db', async () => {
  const text = readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json', 'utf8');
  const imported = await importBackup(text);
  const load = imported.db.export();
  writeFileSync(`${here}/load.db`, load);

  const db = await openDatabase({ now: () => new Date('2026-10-05T05:00:00Z') });
  seedDemoData(db, { anchorDate: calendarDate(2026, 10, 5), seed: 1 });
  const seed = db.export();
  writeFileSync(`${here}/seed.db`, seed);

  // Page counts: sql.js files are whole pages, so two versions of similar data often have the
  // same size (find_copy compares sizes first).
  writeFileSync(
    `${here}/probe-export-db.result.json`,
    JSON.stringify({ loadBytes: load.byteLength, seedBytes: seed.byteLength }, null, 1),
  );
});
```

### `probe-size.test.ts`

```ts
// How often does the saved file keep its size across a session? `find_copy` (storage.rs) reads
// every backup of the same size in full at startup. Counts the distinct file sizes after each of
// 200 small commands (one KYC note each) on the load data set, as the persist port sees them.
import { readFileSync, writeFileSync } from 'node:fs';
import { addKycNote, importBackup, listCustomers, openDatabase } from '@p2c/db';
import { calendarDate } from '@p2c/domain';

test('file sizes across small commands', async () => {
  const text = readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json', 'utf8');
  const imported = await importBackup(text);
  const start = imported.db.export();
  const sizes: number[] = [];
  const db = await openDatabase({
    bytes: start,
    now: () => new Date('2026-10-05T05:00:00Z'),
    persist: (snapshot) => sizes.push(snapshot.byteLength),
  });
  const customers = listCustomers(db).slice(0, 200);
  for (const [i, c] of customers.entries()) {
    addKycNote(db, c.id, { text: `probe note ${i} `.repeat(4), date: calendarDate(2026, 10, 5) });
  }
  const distinct = [...new Set(sizes)];
  const result = {
    startBytes: start.byteLength,
    commands: sizes.length,
    distinctSizes: distinct.length,
    firstSizes: distinct.slice(0, 5),
    sameAsStart: sizes.filter((s) => s === start.byteLength).length,
  };
  writeFileSync('C:/workspace/deep-review-1-4/claude/C/probe-size.result.json', JSON.stringify(result, null, 1));
});
```

### `probe-damaged.test.ts`

```ts
// The damaged file of `probe damaged` (seed.db, second half zeroed, header kept): does the app's
// openDatabase refuse it, so StartupError shows `storage.openFailedHelp`?
import { readFileSync, writeFileSync } from 'node:fs';
import { openDatabase } from '@p2c/db';

test('openDatabase on a half-zeroed file', async () => {
  const good = readFileSync('C:/workspace/deep-review-1-4/claude/C/seed.db');
  const bad = new Uint8Array(good.length);
  bad.set(good.subarray(0, Math.floor(good.length / 2)));
  let outcome: string;
  try {
    const db = await openDatabase({ bytes: bad });
    outcome = `opened (${db.sqlite.exec('select count(*) from customers')[0]?.values[0]?.[0]} customers)`;
  } catch (error) {
    outcome = `refused: ${String(error)}`;
  }
  writeFileSync('C:/workspace/deep-review-1-4/claude/C/probe-damaged.result.json', JSON.stringify({ outcome }, null, 1));
});
```
