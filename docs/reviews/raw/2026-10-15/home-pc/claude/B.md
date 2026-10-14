XONG — claude gói B, 13/10/2026 23:16

# Deep review Phase 1–6, lượt 1 — Claude, gói B (File và Rust)

## 1. Đầu phiên

| | |
|---|---|
| Bên | Claude (Claude Code, model Opus 5.5), phiên sạch, chỉ đọc |
| Gói | **B. File và Rust** — `apps/desktop/src-tauri/**`, `apps/desktop/src/data/**` trừ file AI |
| Worktree | `C:\workspace\Project-2C-review` |
| SHA đầu phiên | `885534549808f42aec7f9af5743bbf86642ee4bd` (`git rev-parse HEAD`) = SHA ghim |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 13/10/2026 22:44 (+07:00) |
| Bước 0 | chữ gói `B` hợp lệ; `claude\B.md` chưa có (kiểm bằng `test -e`) → làm mới; gói trước `claude\A.md` có, dòng đầu `XONG — claude gói A, 13/10/2026 22:44` |
| Máy, việc chạy song song | Home PC `DESKTOP-KDURKJP`, Node v24.20.0, cargo / rustc 1.98.1. Lúc đo có tiến trình `codex` (3) + dịch vụ đi kèm, `muse-bin` (1), `opencode` (1), `project2c` (1, không phải của phiên này), 13 `node`; tải CPU 5–8 % (22:53, 23:10). Mọi số đo là probe Node / Rust ngoài exe; phiên này **không** mở exe (không va probe của bên khác). |

Ghi chú quy tắc: lúc đầu phiên tôi chạy một lệnh `ls -la` liệt kê `common\` và `claude\` (thư mục được phép đọc) thay cho kiểm từng file bằng tên; không liệt kê `deep-review-1-6\` hay `C:\workspace\`, không mở / liệt kê `codex\`, `muse\`.

## 2. Phạm vi đã đọc

**Code sản phẩm gói B (đọc hết từng dòng, ở SHA ghim):**

- Rust `apps/desktop/src-tauri`: `src/lib.rs` (205), `src/storage.rs` phần SP 1–471, `src/ai.rs` phần SP 1–517, `src/main.rs` (6), `build.rs` (3), `Cargo.toml` (32), `tauri.conf.json` (31, CSP), `capabilities/default.json` (7) và danh sách quyền mà `core:default` kéo theo trong `gen/schemas/acl-manifests.json` (file sinh, bị ignore).
- `apps/desktop/src/data` (trừ file AI): `app-data.ts` (436), `persist-queue.ts` (79), `tauri-storage.ts` (61), `tables.ts` (68), `AppDataContext.tsx` (52), `demo-snapshot.ts` (45), `today.ts` (58).

**Test gói B:** `tauri-contract.test.ts` (hết), `app-data.test.ts` (helper 1–111, 436–470, khối S-2 619–820, danh sách mọi ca), danh sách ca của `persist-queue.test.ts`, `tauri-storage.test.ts`, `tables.test.ts`, `today.test.ts`, `demo-snapshot.test.ts`; Rust: helper + ca đồng thời `storage.rs:472-600`, `:1155-1180`, `:1316-1336`, tên mọi ca `#[test]` của `storage.rs` / `ai.rs`, helper `ai.rs:518-600`, `:675-720`, ca key `ai.rs:1260-1345` (dùng `keyring_core::mock`, không chạm Credential Manager thật).

**Code gói khác mà gói B nối vào (chỉ chỗ nối):** `apps/desktop/src/main.tsx` (nối storage / AI / chặn tải lại), `shell/close-guard.ts`, `shell/CloseGuard.tsx`, `shell/block-reload.ts`, `shell/startup-error.ts`, `shell/StartupError.tsx`, `i18n/vi.ts:940-960, 1045-1056` (câu của storage / đóng app), `data/ai-tauri.ts` (gói C — hợp đồng lệnh AI), `data/ai-analysis.ts:60-110, 200-333` (gói C — chỗ đọc `app.db()` ngoài `run`), `routes/customers/CustomerDialogs.tsx:110-175` (`useDatabase` cho preview, chỉ đọc), `routes/reports/report-workbook.ts:220-262` (tên file Excel ↔ `is_export_name`), `routes/SettingsAi.tsx:225-275` (ô key), `packages/ai/src/schema.ts:42-45`, `run.ts:161` (mức suy luận → `reasoning_effort`), `packages/db/src/database.ts` (229, cổng `persist`, migration), `customers.ts:154-167`, `kyc.ts:246-262` (preview không ghi); `git grep` mọi `href=` / `window.open` / `location.*` / `localStorage` / `dangerouslySetInnerHTML` của app (đường tải lại webview, chỗ chèn HTML).

**Tài liệu:** `CLAUDE.md` gốc + `apps/desktop/CLAUDE.md`, ADR-0016 (hết), ADR-0009 phụ lục D-1, W-1, spec Phase 5 §5.1–§5.3 (giới hạn, timeout, mã lỗi), spec Phase 6 §4.1 (S2-1…S2-6), §5, `docs/metrics/phase-6.md` (bảng ngưỡng), `common\plan.md`, `known.md`, `baseline.md`, báo cáo `claude\A.md` (để không báo lại).

## 3. Phát hiện

Không có Critical / High / Medium. Hai Low, ba Nit (một là KNOWN có bằng chứng mới). Lõi của gói (ghi nguyên tử, khóa, S-2, ranh giới key / mạng) đứng vững trước mọi kịch bản tôi dựng được — xem §6.

### CL-B1 — `project2c.db` chỉ đang bị chương trình khác giữ mà màn lỗi khởi động bảo chép backup đè lên: làm theo thì mất các thay đổi từ backup cuối

```
ID: CL-B1
Mức: Low
Trục: S, E
Vị trí: apps/desktop/src-tauri/src/storage.rs:110-121 (fs::read lỗi khác NotFound → trả nguyên io::Error), :106 (project2c.db.tmp không xóa được → open lỗi); apps/desktop/src/shell/startup-error.ts:31-35 (mọi lỗi còn lại → storage.openFailed); apps/desktop/src/i18n/vi.ts:943-944 (8855345)
Tình trạng: CONFIRMED (phần thư mục cấm ghi: PLAUSIBLE)
```

- **Mô tả:** `storage::open` chỉ tách riêng `ALREADY_OPEN`, "thiếu file mà còn backup" và "không phải SQLite"; lỗi đọc `project2c.db` vì một chương trình khác đang giữ file (Windows `ERROR_SHARING_VIOLATION`, os error 32) trả nguyên chuỗi lỗi hệ điều hành. Ở webview, `startupMessage` xếp mọi lỗi không nhận ra vào `storage.openFailed`, có câu hướng dẫn "chép bản mới nhất thành Project2C-data\project2c.db để khôi phục". File thật ra không hỏng: đóng chương trình kia rồi mở lại app là đủ. Bản backup mới nhất là bản chép lúc **mở** app lần trước (`app-data.ts:313-319`) hoặc trước lần Nạp lại / Nhập gần nhất (`app-data.ts:354`), nên ai làm theo câu hướng dẫn sẽ chép đè mất mọi thay đổi từ lúc đó tới lần lưu cuối.
- **Tái hiện:** `rsprobe lockedread` (log `claude\B\rs-lockedread.log`): một tiến trình con mở `project2c.db` với `share_mode(0)`, rồi gọi `storage::open` của repo → `Err((Uncategorized, Some(32), "The process cannot access the file because it is being used by another process. (os error 32)"))`; `storage::save` lúc đó → `Err((PermissionDenied, Some(5), "Access is denied. (os error 5)"))` (dải `storage.saveFailed` nói đúng "file có thể đang mở trong chương trình khác"). `node startup-msg.mjs` (log `startup-msg.log`) đưa đúng chuỗi lỗi đó qua `startupMessage` của app → `title: "Không mở được file dữ liệu"`, `help: "App chưa ghi gì vào file. … chép bản mới nhất thành Project2C-data\\project2c.db để khôi phục. …"`, `detail: "The process cannot access the file … (os error 32)"`.
- **Cùng câu cho hai ca nữa:** (a) `project2c.db.tmp` sót lại mà không xóa được (chương trình diệt virus đang giữ) → `remove_if_exists(…)?` (`storage.rs:106`) làm `open` lỗi (test sẵn có `the_first_open_cleans_exports_even_when_it_cannot_remove_the_db_tmp`, `storage.rs:1316`, khẳng định `open` lỗi), màn khởi động cũng hiện câu khôi phục dù `project2c.db` nguyên vẹn. (b) Đọc code: `fs::create_dir_all(dir)?` (`storage.rs:97`) lỗi quyền (exe để trong thư mục không ghi được, vd. `Program Files` không có quyền admin) rơi vào cùng câu — PLAUSIBLE, chưa dựng thư mục cấm ghi (không dùng `icacls`).
- **Ảnh hưởng:** người dùng mở app khi một chương trình đồng bộ / sao lưu / công cụ xem DB đang giữ `project2c.db` không chia sẻ đọc. Cần điều kiện hiếm (đa số chương trình mở file vẫn chia sẻ đọc) và người dùng phải tự chép file theo câu hướng dẫn → Low.
- **Đề xuất:** ở `storage::open`, đổi lỗi đọc có `raw_os_error() == Some(32 | 33)` (sharing / lock violation) thành một mã riêng (vd. `DB_BUSY`, như `ALREADY_OPEN`); `startupMessage` thêm câu "File dữ liệu đang bị chương trình khác mở — đóng chương trình đó rồi mở lại app, không cần khôi phục". Có thể tách thêm lỗi quyền (os error 5) với câu "thư mục của app không ghi được". ≈ 20 dòng SP (Rust + `startup-error.ts` + `vi.ts`) + test Rust kiểu `open_while_another_process_holds_the_lock_touches_nothing` và test `startup-error.test.ts`.

### CL-B2 — Ba luật nhỏ của lớp file / AI không test nào giữ (đột biến R8, A14, J5 sống)

```
ID: CL-B2
Mức: Low
Trục: T
Vị trí: apps/desktop/src-tauri/src/storage.rs:466 (is_export_name: !name.starts_with('.')); apps/desktop/src-tauri/src/ai.rs:216-217 (complete: check trước busy.start); apps/desktop/src/data/app-data.ts:362-363 (setTimeout 0 trước previous.sqlite.close) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** ba đột biến không bị test nào giết, mỗi cái bỏ một luật mà comment / doc comment hứa:
  - **R8** bỏ `!name.starts_with('.')` khỏi `is_export_name` → `cargo test --lib` 91 passed. Test `write_export_writes_into_exports_and_rejects_unsafe_names` (`storage.rs:1156`) chỉ có `.p2cbackup` (bị luật độ dài chặn trước), không có tên như `.x.p2cbackup` / `..p2cbackup`.
  - **A14** đổi thứ tự thành `busy.start()` rồi mới `check(request)` → 91 passed. Doc comment `ai.rs:147` ("Checks the arguments before anything else happens") và `:207-209` ("neither runs for wrong arguments or while another request runs") không được ghim: một yêu cầu sai đối số lúc có yêu cầu khác đang chạy sẽ nhận `AI_BUSY` thay `AI_BAD_REQUEST`, và chính nó giữ cờ một lúc. Test `wrong_arguments_are_bad_request…` (`ai.rs:918`) luôn dùng `Busy::new()` rảnh.
  - **J5** bỏ `await new Promise((resolve) => setTimeout(resolve, 0))` trước `previous.sqlite.close()` → cả 2 755 test vitest xanh. Test `closes the replaced database once the screens moved to the new one` (`app-data.test.ts:449`) coi "màn re-render" là listener đồng bộ của `subscribe`, nên close ngay sau `changed()` vẫn qua. Với React 19 re-render của `useSyncExternalStore` chạy ở microtask sau `changed()` và đọc `db()` mới, nên đột biến này gần tương đương ở app hiện tại; chỉ ghi để biết lời hứa trong comment `app-data.ts:359-361` chưa có test.
- **Tái hiện:** `node mutate.mjs` (log `claude\B\mutate.log`, kết quả `mutate-results.json`): `R8 export name may start with a dot → SURVIVED (cargo test --lib: 91 passed)`, `A14 busy taken before the arguments are checked → SURVIVED (cargo test --lib: 91 passed)`, `J5 replaced database closed before the screens re-render → SURVIVED (apps/desktop/src tests and the whole vitest suite: 2755 passed)`. Hai đột biến sống khác không thành phát hiện: R4 (bỏ `sync_all`, không test được nếu không mất điện) và R7 (bỏ so độ dài trong `has_same_bytes` — tương đương với file của app vì header SQLite ghi số trang ở byte 28–31, hai file khác cỡ luôn khác ở khối 64 KB đầu).
- **Ảnh hưởng:** chỉ người sửa code sau này: nới các luật trên không làm test đỏ. Hành vi hiện tại đúng.
- **Đề xuất:** thêm `".x.p2cbackup"`, `"..xlsx"` vào danh sách tên bị từ chối (1 dòng test); một ca `complete` với `Busy` đang giữ và đối số sai → `AI_BAD_REQUEST`, cờ vẫn của yêu cầu đang chạy (≈ 10 dòng test). J5: không cần sửa, hoặc đổi comment cho khớp điều test kiểm.

### CL-B3 — Quyền `core:default` của Tauri cấp cho webview nhiều lệnh app không dùng (đọc ảnh theo đường dẫn tùy ý, menu, tray)

```
ID: CL-B3
Mức: Nit
Trục: S
Vị trí: apps/desktop/src-tauri/capabilities/default.json:6; apps/desktop/src-tauri/tauri.conf.json:24 (8855345)
Tình trạng: CONFIRMED (đọc manifest quyền); khai thác: PLAUSIBLE, cần chạy được script trong webview
```

- **Mô tả:** capability `default` cấp `core:default` + `core:window:allow-destroy`. Theo `apps/desktop/src-tauri/gen/schemas/acl-manifests.json` (sinh từ Tauri 2.11.6 đang khóa ở `Cargo.lock`), `core:default` kéo theo `core:image:allow-from-path` + `allow-rgba` (đọc điểm ảnh của mọi file ảnh theo đường dẫn), mọi lệnh `core:menu` (tạo / gắn menu), `core:tray` (tạo icon khay, `allow-set-temp-dir-path`), `core:webview:allow-internal-toggle-devtools`, `core:window:allow-internal-toggle-maximize`, các lệnh mặc định của `core:path`, `core:event`, `core:app`. Webview của app chỉ dùng `invoke` lệnh riêng, `isTauri`, `getCurrentWindow().onCloseRequested` và `destroy` (`git grep "@tauri-apps/api"` → `main.tsx:1-2`, hai import kiểu ở `src/data`). Cùng loại: CSP (`tauri.conf.json:24`) không đặt `base-uri` / `form-action`, hai chỉ thị không rơi về `default-src`.
- **Ảnh hưởng:** không có đường khai thác hiện tại: CSP `script-src 'self' 'wasm-unsafe-eval'` chặn script chèn và handler inline, React escape chuỗi, chart có hàm escape (`packages/ui/src/components/Chart.tsx:24`), app không dùng `dangerouslySetInnerHTML`. Chỉ là lớp phòng thủ thứ hai rộng hơn cần (ranh giới D-1: webview chỉ đi qua các lệnh đã định).
- **Đề xuất:** thay `core:default` bằng đúng quyền dùng (`core:event:allow-listen`, `core:event:allow-unlisten`, `core:window:allow-destroy`), thêm `base-uri 'none'; form-action 'none'` vào CSP; kiểm tay đóng cửa sổ trên exe (CloseGuard) vì e2e không chạy exe. ≈ 3 dòng cấu hình, PR `build-exe`.

### CL-B4 — `PersistQueue.unsaved()` chỉ test dùng

```
ID: CL-B4
Mức: Nit
Trục: B
Vị trí: apps/desktop/src/data/persist-queue.ts:13-14, :66 (8855345)
Tình trạng: CONFIRMED
```

- **Bằng chứng:** `git grep -n "unsaved()" -- apps packages e2e` ngoài file test chỉ ra khai báo ở `persist-queue.ts`; `persist-queue.test.ts` gọi 6 lần (`:111, :121, :143, :152, :162, :170`). Đóng app dùng `flush()`, dải cảnh báo dùng `failed()` / `subscribe`.
- **Đề xuất:** bỏ (3 dòng SP; các phép kiểm trong test thay bằng `failed()` / số lần `write`), hoặc giữ nếu sẽ dùng cho dấu hiệu "đang lưu" khi đóng app (ghi chú KNOWN #125). Không có chi phí đo được.

### CL-B5 (KNOWN) — `.tmp` của backup bị ngắt nằm lại trong `backups\` mãi, mỗi file cỡ cả DB; test Rust để lại thư mục tạm

```
ID: CL-B5
Mức: Nit
Trục: D
Vị trí: apps/desktop/src-tauri/src/storage.rs:95-107 (open chỉ dọn exports\ và project2c.db.tmp), :288-302 (write_atomic); storage.rs:477-483 (temp_dir của test) (8855345)
Tình trạng: KNOWN (sổ ghi chú, NIT #87 "file .tmp sót trong backups\/exports\ … dọn thư mục tạm của test Rust" — phần exports\ đã sửa, hai phần này còn), bằng chứng mới: cỡ và số lượng
```

- **Bằng chứng mới:** `rsprobe crash … backup` (log `claude\B\rs-crash-backup.log`): 40 lần giết tiến trình đang lưu + backup liên tục trên file 13 455 360 B → mọi file `project2c-s….db` còn lại đều nguyên vẹn (0 file hỏng), lần mở sau luôn đọc được DB nguyên (40 / 40), nhưng còn **4 file `.db.tmp` × 13,4 MB** trong `backups\` không bao giờ bị dọn (không khớp `backup_seq` nên cũng không bị tỉa). Ngoài đời chỉ xảy ra khi app bị tắt ngang đúng lúc backup (lúc mở app hoặc trước Nạp lại / Nhập), nên hiếm.
- **Test Rust:** mỗi lần `cargo test --lib` của `src-tauri` để lại **46 thư mục** `%TEMP%\p2c-storage-<pid>-<n>` (đếm trước / sau một lần chạy ≈ 23:12: 2 743 → 2 789); trên Home PC hiện có 2 789 thư mục, ≈ 101 MB (`du -shc`), trong đó ≈ 1 610 do 35 lần chạy của chính phiên này (đột biến + lần đếm). Chỉ ảnh hưởng máy dev / CI.
- **Đề xuất:** như ghi chú cũ: `open` lần đầu của tiến trình xóa `backups\project2c-s*.db.tmp` (cùng chỗ dọn `exports\`), ≈ 5 dòng + 1 test; `temp_dir()` của test trả một guard xóa thư mục khi `Drop` (≈ 10 dòng test).

## 4. Bloat

| Đã chạy / đọc | Trên | Kết quả | ID |
|---|---|---|---|
| `cargo clippy --manifest-path apps/desktop/src-tauri/Cargo.toml --lib --tests --locked -- -W clippy::pedantic` (log `clippy-pedantic.log`, 2,8 s, exit 0) | Rust SHA ghim | 18 cảnh báo ở lib, 30 ở lib test (18 trùng). SP: 11 `doc_markdown`, `redundant_closure` `storage.rs:63` (`PoisonError::into_inner`), `cast_possible_wrap` `lib.rs:66` (giây từ 1970 `u64 → i64`), `needless_pass_by_value` `lib.rs:105, :120, :163` (tham số lệnh Tauri cần kiểu sở hữu), `missing_panics_doc` `lib.rs:188`, `struct_field_names` `ai.rs:114`. Không cái nào là lỗi hay code thừa | — |
| `npx tsc -p apps/desktop/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` (log `tsc-unused.log`) | app | exit 0, 0 dòng (hai cờ vốn bật ở `tsconfig.base.json:12-13`) | — |
| `git grep` nơi dùng từng thành viên của `AppData`, `StoragePort`, `PersistQueue`, export của `src/data` | toàn repo | còn dùng hết, trừ `PersistQueue.unsaved()` (chỉ test). `buildDemoSnapshot` / `demoSnapshotName` dùng ở `e2e/serve.mjs`; `sortedByName` ở `CustomerProfile.tsx` | CL-B4 |
| Code lặp ≥ 3 nơi | `src-tauri/src`, `src/data` | không có. `explorer()` dùng chung cho `open_folder` và `open_chatgpt` (tốt). `SQLITE_HEADER` có ở `storage.rs:30` và `demo-snapshot.ts:13` (2 nơi, hai ngôn ngữ). `newPage` (`tauri-storage.ts:18`) = `newSessionId` của `packages/ai` là ghi chú KNOWN #448, không nhắc lại | — |
| Dependency Rust: `cargo tree -e normal --target x86_64-pc-windows-msvc` (`--locked --offline`) | `Cargo.lock` | 6 crate trực tiếp (`tauri` 2.11.6, `ureq` 3.4.2, `serde`, `serde_json`, `keyring-core`, `windows-native-keyring-store`), 294 crate khác nhau. Trùng phiên bản (`-d`): `base64` 0.22/0.23, `getrandom` 0.2/0.3/0.4, `syn` 2/3, `thiserror` 1/2, `hashbrown`, `indexmap`, `miniz_oxide`, `windows-sys` 0.59/0.61, `windows-link`… đều qua `tauri` / `ureq`, không bỏ được nếu không đổi crate. Exe 5 414 400 B (`baseline.md`). Tách cỡ theo crate cần `cargo-bloat` (G4) → chỉ đề xuất | — |
| Dependency JS của gói B | `src/data` | chỉ `@tauri-apps/api` (`core` kiểu + `invoke`, `window`); `@p2c/*` | — |
| Bundle | `common\baseline.md` | code gói B nằm trong `assets/index.js` (891 942 B); wasm của sql.js nằm trong "Tệp khác". Không build lại (bundle ở SHA ghim đã đo; tách theo module cần visualizer, G4) | — |
| `pnpm lint:deps` | `baseline.md` | không vi phạm (309 module) | — |
| Đề xuất refactor | — | chỉ CL-B4 (−3 dòng); test giữ hành vi: `persist-queue.test.ts`, `app-data.test.ts` | CL-B4 |

## 4b. Hiệu năng

Máy: Home PC, Node v24.20.0, Rust release (`opt-level = "s"` như exe, nhưng không LTO). Dữ liệu: `common\load\load-2026-10-12-seed6.p2cbackup`, đổi thành file DB bằng `importBackup` + `export()` (`mkdb.mjs` → `load-a.db` 13 455 360 B; `load-b.db` thêm một bảng, 13 459 456 B). Trung vị (min–max). Song song: xem §1.

| Thao tác | Lần | Trung vị | Min–max | So với | ID |
|---|---:|---:|---|---|---|
| Rust `storage::save` (ghi `.tmp` + `sync_all` + `rename`), file 13,4 MB (`rs-time.log`) | 15 | 9,5 ms | 9,2–10,2 | exe `db.save` 140 ms (`perf-ref.json`; ngưỡng ≤ 400 ms) → phần Rust ≈ 7 %; JS `db.export()` 1,8 ms; còn ≈ 128 ms là chuyển 13 MB qua IPC WebView2 (suy ra, không đo riêng) | — |
| Rust `storage::open` (đọc 13,4 MB) | 5 | 4,0 ms | 3,7–4,5 | exe `app.open-data` 189 ms | — |
| Rust `storage::backup`: thư mục rỗng / file không đổi (dùng lại bản chép) / file đổi khi đã có 10 backup cùng cỡ chỉ khác ở cuối (`find_copy` đọc hết cả 10) | 1 / 5 / 5 | 13,6 / 6,7 / 42,6 ms | — / 6,1–7,0 / 39,9–49,0 | mở app (có backup) ≤ 600 ms | — |
| `openAppData` từ file tải (storage giả trong bộ nhớ, `perf-app.log`) | 3 | 3,5 ms | 3,4–27,4 | | — |
| `run(renameTeam)` gồm transaction + xuất cả file vào hàng đợi lưu | 20 | 2,5 ms | 2,1–8,4 | 20 lần ghi liền → 2 lần tới cổng `save` (hàng đợi gộp) | — |
| `tables()` của revision mới, đọc cả 6 bảng / chỉ `customers` (đã sắp tên) | 10 | 80,6 / 7,1 ms | 75,8–99,2 / 6,4–10,2 | mỗi lệnh ghi bỏ cả 6 bảng; màn chỉ đọc bảng nó dùng. Exe `appointments.next-month` 102 ms (ngưỡng ≤ 300 ms) | — |
| `AppData.exportBackup` (15 676 686 ký tự) | 3 | 243,6 ms | 235,0–251,3 | exe `backup.export` 424 ms, ngưỡng ≤ 1 000 ms | — |
| `AppData.readBackup` file tải | 3 | 815,0 ms | 795,4–830,5 | exe `backup.read` 794 ms, ngưỡng ≤ 2 000 ms | — |
| `AppData.importBackup` (chờ lưu + backup + mở file đã đọc + đổi) | 3 | 6,2 ms | 5,8–20,3 | exe `backup.import` 49 ms, ngưỡng ≤ 500 ms | — |

Không có phát hiện P: mọi thao tác của gói B dưới ngưỡng, phần Rust nhỏ so với IPC. Ghi lại để lượt sau biết: thời gian lưu tăng tuyến tính theo cỡ file (cả file qua IPC mỗi lần lưu, ADR-0016); ở mức `db.save` 140 ms / 13,4 MB thì ngưỡng 400 ms ứng với file ≈ 38 MB (ngoại suy tuyến tính, chưa đo).

## 5. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | 0 |
| Low | CL-B1* | | | | CL-B1* | | | CL-B2 | | 2 |
| Nit | | | CL-B5 (KNOWN) | | CL-B3 | | CL-B4 | | | 3 |

\* CL-B1 gắn hai trục, đếm một lần. CONFIRMED 5 / 5; chỉ một phần nhỏ là PLAUSIBLE (CL-B1 ca thư mục cấm ghi; CL-B3 đường khai thác).

## 6. Đã xét, không thấy

- **E — edge case.** Tắt ngang: `rsprobe crash` giết tiến trình đang lưu liên tục 40 lần (`rs-crash-save.log`) → lần mở sau 40 / 40 đọc được đúng file A hoặc B nguyên vẹn (21 / 19), `.tmp` sót 36 lần và được `open` dọn; giết lúc backup 40 lần → 0 backup hỏng (CL-B5 chỉ về `.tmp`). Hai tiến trình: `rsprobe lockcheck` (`rs-lock.log`) → tiến trình thứ hai `Err((ResourceBusy, "ALREADY_OPEN"))`; sau khi giết tiến trình giữ khóa, mở lại được `Ok(None)`. Tên thiết bị Windows trong tên xuất (`rs-names.log`): `CON.xlsx`, `nul.p2cbackup`, `AUX.xlsx`, `COM1.p2cbackup`, `LPT1.xlsx` ghi thành file thường trên Windows 11 (vả lại app chỉ sinh tên `project2c-…` / `bao-cao_…` ASCII, `report-workbook.ts:224-258`). Hai thao tác thay chồng nhau, tắt app ở từng bước thay, xuất trong lúc thay, lưu lỗi rồi thay: fuzz S-2 (`s2-fuzz.mjs`, 900 vòng, ≈ 16 400 lệnh ghi, 3 500 Nạp lại, 3 550 Nhập — ≈ 15 % file hỏng —, 5 280 Xuất, 7 240 lần `flush`, lỗi lưu / backup giả ≈ 8 %; log `s2-fuzz.log`) → 0 vi phạm 8 bất biến (backup giữ đủ thay đổi, file trên đĩa không lùi về bộ dữ liệu cũ, mọi file lưu / xuất / để lại sau `flush` là một trạng thái app thật có, đĩa = app khi xong, mỗi DB bị thay đóng đúng 1 lần), 0 lỗi lạ. Độ nhạy của fuzz (`s2-fuzz-sensitivity.log`, bản chép `app-data.ts` cài lỗi ở `claude\B\mut\`, ngoài repo): bắt được J2 (bỏ khóa ghi, 16 vi phạm I1), J4 (không chờ lưu, 26), J6 (không xếp hàng thay, 17 gồm I6 đóng 2 lần); J1 cần một màn giữ DB cũ rồi ghi, fuzz không dựng — test `never saves the replaced database again` giết J1. Đường tải lại webview (mất thay đổi chưa lưu): F5 / Ctrl+R / BrowserRefresh / menu chuột phải bị chặn (`block-reload.ts`), mọi `href` là hash, không có `location.*`, `window.open` chỉ ở bản web → không thấy đường tải lại nào khác. Nửa đêm: `today.ts` + test `today.test.ts`; đột biến D1 bị giết.
- **C — hợp đồng / spec.** ADR-0016 (ghi `.tmp` rồi đổi tên, backup lúc mở giữ 10 bản, `exports\`), spec Phase 6 §4.1 S2-1…S2-6 (test chấp nhận có đủ trong `app-data.test.ts:619-818`, thêm fuzz trên), ADR-0009 D-1 mục 1–4 và W-1 mục 5, 7, spec Phase 5 §5.1–§5.3 (vai trò, `reasoning` low / medium / high, `maxTokens` 1…32 000, 200 000 ký tự, timeout 120 s / 10 s, 2 MB + 1, không redirect, bảng mã lỗi) khớp hằng số và nhánh trong `ai.rs`. Hợp đồng lệnh Tauri ↔ JS: `tauri-contract.test.ts` kiểm tên lệnh, tên tham số camelCase, header, chuỗi lỗi, kiểu `Completion`; `DEFAULT` → `null` trước Rust (`run.ts:161`); tên file Excel chỉ ASCII khớp `is_export_name`. Không thấy lệch ngoài CL-B1 (câu hướng dẫn) và CL-B2 (doc comment chưa có test).
- **D — dữ liệu.** Ghi nguyên tử và giữ file cũ khi đổi tên lỗi (test `a_save_whose_rename_fails_keeps_the_old_file_byte_for_byte`, đột biến R1–R18 trừ R4 / R7 / R8 bị giết); backup tỉa trước khi chép chỉ mất tối đa 1 bản khi ổ đầy (DR-57, đọc `copy_to_backups` + test `backup_makes_room_before_it_writes_the_copy`); lưu của trang cũ bị từ chối `STALE_PAGE`; lưu sau migration chờ backup lúc mở (DR-51, đột biến J8 bị giết). Lớp `db`: `persist` chỉ gọi sau `COMMIT` của transaction ngoài cùng (`database.ts:96-101`), migration một transaction. Backup không chứa key: `settings.ai` chỉ có `{ provider, opencodePlan, model, reasoning }` (`ai-analysis.ts:125`).
- **G — guardrail AI (phần Rust).** Trả lời có key (thẳng, escape JSON, `%XX`) → `AI_BAD_RESPONSE`; `finish_reason` chỉ là từ thường ≤ 32 ký tự; thông điệp lỗi server che key + mã phiên trước khi cắt 200 ký tự; Rust không lưu gì. Đột biến A1–A13, A15 bị giết. Phần V1–V7 / thử lại / STALE thuộc gói C.
- **S — ranh giới.** Webview không gửi đường dẫn: `open_folder` chỉ nhận `exports` / `backups`, tên xuất chỉ `[A-Za-z0-9._-]` + đuôi `.p2cbackup` / `.xlsx` (đột biến R9 bị giết), Explorer gọi theo đường dẫn đầy đủ trong `%SystemRoot%` (DR-54), đối số Explorer luôn có ngoặc kép. Key: chỉ `ai_key_set` / `delete` / `status` (bool), không lệnh đọc key; key cắt khoảng trắng, chỉ ASCII in được ≤ 512; lỗi keyring chỉ còn mã. Mạng: 2 URL cố định trong Rust, chỉ HTTPS, không redirect, timeout, giới hạn thân. Ô nhập key là `type="password"` trong `<form>` có `preventDefault` (`SettingsAi.tsx:239-256`); không kiểm được tự lưu mật khẩu của WebView2 trên exe vì muốn kiểm phải gõ key vào exe, sẽ ghi đè key thật trong Credential Manager. CSP: `connect-src 'self' ipc: http://ipc.localhost` đúng D-1 mục 2. Ngoài CL-B1, CL-B3 không thấy gì.
- **P — hiệu năng.** Bảng §4b; không phép tính bậc hai, không quét lặp trong code gói B; hàng đợi lưu gộp ảnh chụp.
- **B — bloat.** Bảng §4.
- **T — test.** Đột biến 57 cái (§7): 52 bị giết, 5 sống → CL-B2 (R8, A14, J5), R4 / R7 không thành phát hiện. Test Rust dùng `keyring_core::mock`, server HTTP local, không gọi mạng / Credential Manager thật (ca `the_key_is_stored_local_to_this_machine` chỉ dựng entry, không đọc). Test đồng thời của `storage.rs` dựa vào `HELD_OFF` 200 ms (chỉ kiểm "chưa xong", không làm test đỏ giả khi máy chậm).
- **A — trợ năng / i18n.** Gói B không có màn. Câu của storage / đóng app ở `vi.ts:942-958, 1049-1055` đủ, tiếng Việt; chuỗi lỗi Rust tiếng Anh chỉ hiện ở dòng "Chi tiết kỹ thuật" (có chủ ý). Mã lỗi AI dịch ở `packages/ai` (gói C).

## 7. Phụ lục

**Probe / script (thư mục `claude\B\`, đều đọc repo ở SHA ghim, chỉ ghi trong `claude\B\`):**

- `hooks.mjs` — chép từ `claude\A\hooks.mjs` (nạp TypeScript của repo trong Node).
- `mkdb.mjs` (`mkdb.log`) — dữ liệu tải → `load-a.db`, `load-b.db`.
- `rsprobe\` — crate Rust tạm, `src/main.rs` nạp `apps/desktop/src-tauri/src/storage.rs` của repo bằng `#[path]` (không chép), không dependency; lệnh `time` (`rs-time.log`), `crash … save|backup` (`rs-crash-save.log`, `rs-crash-backup.log`), `lockcheck` (`rs-lock.log`), `lockedread` (`rs-lockedread.log`), `names` (`rs-names.log`); thư mục làm việc `run\`.
- `startup-msg.mjs` (`startup-msg.log`) — chuỗi lỗi Rust thật qua `startupMessage` của app.
- `s2-fuzz.mjs` (`s2-fuzz.log`), `mkmut.mjs` + `mut\app-data-{same,J1,J2,J4,J6}.ts` (`s2-fuzz-sensitivity.log`).
- `perf-app.mjs` (`perf-app.log`).
- `mutate.mjs` (`mutate.log`, `mutate-results.json`, bản gốc trước đột biến ở `orig\`).
- `clippy-pedantic.log`, `tsc-unused.log`.

**Đột biến** (`mutate.mjs`: patch một file trong worktree; JS chạy `vitest run apps/desktop/src --bail=1`, sống thì chạy cả bộ vitest; Rust chạy `cargo test --lib --locked`; trả file về từng byte, so `git show HEAD:` trước / sau; 23:00–23:05). 57 đột biến:

- **Sống (5):** J5 (CL-B2), R4 (bỏ `sync_all` — không test được), R7 (tương đương, xem CL-B2), R8 (CL-B2), A14 (CL-B2).
- **Bị giết (52):** J1–J4, J6–J14 (`app-data.ts`), Q1–Q5 (`persist-queue.ts`), T1–T3 (`tauri-storage.ts`), D1 (`today.ts`), D2 (`tables.ts`), R1–R3, R5, R6, R9–R18 (`storage.rs`), A1–A13, A15 (`ai.rs`). Tên test giết từng đột biến ở `mutate.log`.
- Dòng cuối `mutate.log`: `git status --short after: ""`.

**Tác dụng phụ ngoài repo:** 35 lần `cargo test --lib` (34 đột biến Rust + 1 lần đếm) để lại ≈ 1 610 thư mục `%TEMP%\p2c-storage-*` (CL-B5); `apps/desktop/src-tauri/target/` (bị ignore) được build lại. Không xóa gì.

**`git status --short` cuối phiên** (23:16): rỗng; `git rev-parse HEAD` → `885534549808f42aec7f9af5743bbf86642ee4bd`.

**Giờ xong:** 13/10/2026 23:16 (+07:00).
