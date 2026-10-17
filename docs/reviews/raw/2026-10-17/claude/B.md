XONG — claude gói B lượt 2, 2026-10-17 08:17 (+07, giờ máy)

# Deep review Phase 1–6 lượt 2 — Claude — gói B (File và Rust)

## 1. Phiên

- Bên: Claude (reviewer, phiên sạch, chỉ đọc). Gói: **B — File và Rust** (`apps/desktop/src-tauri/**`, `apps/desktop/src/data/**` trừ file AI).
- Worktree: `C:\workspace\Project-2C-review`, detached.
- SHA đầu phiên: `4217ed4cd3300af1d63aa61db9eb13902fe75f16` (khớp SHA ghim).
- `git status --short` đầu phiên: rỗng.
- Giờ bắt đầu: 2026-10-17 07:32:18 +0700 (đồng hồ máy).
- Máy: Home PC (`DESKTOP-KDURKJP`, `hostname`), Node v24.20.0, cargo / rustc 1.98.1, WebView2 155 (`Edg/155.0.0.0` trong exe).
- Công cụ / model / mức: Claude Code (desktop app, tab Code), model Claude Opus 5.5 (`claude-opus-5-5`), mức suy luận do Owner chọn cho phiên (không ghim); không subagent.
- Bước 0: gói B; `claude\B.md` chưa có → làm mới; `claude\A.md` có, dòng đầu `XONG — claude gói A lượt 2, 2026-10-17 02:39`.
- Song song: đầu phiên có 2 tiến trình `codex` (phiên Codex ở `Project-2C-review-2`, theo §L2.9); trước mỗi lần chạy exe và trước đo đã kiểm: không `project2c.exe` nào khác, không cổng 4173 / 9222 / 9337–9340 nào nghe, CPU 2–5 %. Không chạy `pnpm e2e`. Exe chạy bản chép ở `r2\claude\B\exe\<ca>\`, cổng debug 9338 (một ca 9339), profile WebView2 riêng mỗi thư mục.

## 2. Bảng R

Đột biến "gỡ phần sửa" (`B\mut.mjs`, log `B\mut.log`): vá **một** file của worktree, chạy test (JS: vitest `apps/desktop/src` + `database.test.ts`, sống thì cả bộ; Rust: `cargo test --lib --locked --offline`), ghi lại nguyên byte, so sha256 với `git show HEAD:<file>` trước / sau mỗi lần; dòng cuối log `git status --short after`. Tái hiện lượt 1 chạy lại bằng probe lượt 1 của Claude (laptop: nguồn ở phụ lục báo cáo gốc; Home PC: `deep-review-1-6\claude\B\`) chép sang `r2\claude\B\`, đọc repo ở SHA ghim.

| DR6 | Issue → PR | Kết luận | Bằng chứng (tái hiện lượt 1 nay ra gì; test nào đỏ khi gỡ phần sửa) | Biến thể / ghi chú (ID phát hiện) |
|---|---|---|---|---|
| 06 | #595 → #620 | **ĐÃ SỬA** | Probe L·CL-B1 (`p3-damaged.mjs`) chạy lại trên dữ liệu tải lượt 2 (`p01-damage.mjs`, `data\load.db` 14 069 760 B, 3 435 trang): trang 858 / 1 717 / 2 576, byte đầu = 0 hoặc cả trang `0x5a` → 6 / 6 `quickCheck` báo hỏng, khởi động **từ chối `DATA_DAMAGED`, `events` rỗng** (không `backup`, không `save`) (lượt 1: mở, chép bản hỏng thành backup mới nhất). Mọi trang thứ 9 (382 trang) ghi đè cả trang: 381 `quickCheck` bắt, 1 mở lỗi, **0 lọt**. Trên exe release (K10): trang 1 717 ghi đè → "File dữ liệu bị hỏng" + câu chép bản liền trước, `project2c.db` không đổi (sha256), không tạo `backups\`. Gỡ sửa: G06a (bỏ chặn ở `openAppData`) → KILLED `app-data.test.ts > refuses a file damaged inside that still opens`; G06b / G06c (`quickCheck` luôn rỗng / nuốt lỗi) → KILLED `database.test.ts > quickCheck > finds any damaged page…`; G06d (màn khởi động nói "không mở được") → KILLED `startup-error.test.ts` | **CL2-B1** (hỏng cỡ một byte làm chỉ mục lệch bảng: `quick_check` "ok", `integrity_check` bắt; app mở, chép thành backup mới nhất, hộp 5f đếm sai). KNOWN #620 (kiểm sau migrate): K14, không có bằng chứng mới. Chi phí `quick_check` lúc mở: CL2-B7 |
| 07 | #595 → #620 | **ĐÃ SỬA** | `rsprobe lockedread` (H·CL-B1, chạy lại trên `storage.rs` ghim): `open` khi chương trình khác giữ `project2c.db` → `Err((ResourceBusy, None, "FILE_IN_USE"))` (lượt 1: `Uncategorized, os error 32`). `startup-msg` lượt 1 (`p03-startup-msg.mjs`): `FILE_IN_USE` → "File dữ liệu đang bị chương trình khác giữ" + "File dữ liệu không hỏng, không cần khôi phục…"; `ACCESS_DENIED` → "App không có quyền ghi vào thư mục dữ liệu"; lưu khi đĩa đầy → `storage.saveDiskFull`. Trên exe release (K10): file bị giữ lúc mở → "File dữ liệu đang bị chương trình khác giữ"; `project2c.lock` chỉ đọc → "App không có quyền ghi vào thư mục dữ liệu"; cả hai không đổi file, không tạo `backups\`. Gỡ sửa: G07a / b / c (bỏ `out_of_reach` ở đọc file / file khóa / `.tmp`) → KILLED (mỗi cái 1 test Rust); G07e (chỉ os error 32) → KILLED; G07f (`save` không `disk_full`) → KILLED; G07g / h (màn khởi động) → KILLED `startup-error.test.ts`; G07i (dải lưu một câu) → KILLED `SaveWarning.test.tsx`; G07j / k (`saveError`) → KILLED; **G07d (bỏ `out_of_reach` ở tạo thư mục dữ liệu) → SỐNG** | **CL2-B2** (`project2c.db` chỉ đọc: app mở bình thường, mọi lần lưu lỗi với câu "file có thể đang mở trong chương trình khác"); **CL2-B3** (G07d sống: ca "thư mục dữ liệu không tạo được" — exe ở Program Files — không test nào giữ). `backups` là file (K3): câu `storage.backupFailed` đúng hướng |
| 08 | #595 → #620 | **ĐÃ SỬA** | Probe L·CL-B2 (`p1-migrate-last-save.mjs`) chạy lại (`p02-openfrom.mjs`): file "trước mọi migration" (0 B) qua `importBackup` → 2 lần lưu sau backup, **cả hai schema 11**, `LAST file on disk is migrated: true` (lượt 1: lần lưu cuối schema 0, 0 B). Thêm file cũ thật (dữ liệu tải do code `8855345` ghi, schema 9, gói A `old-8855345-load.db`): 2 lần lưu schema 11, lần cuối có 1 496 KH / 10 414 lịch / 54 nhân sự, `quick_check ok`. Gỡ sửa: G08 (`openFrom` lưu `bytes`) → KILLED `app-data.test.ts > replacing the data (S-2) > saves the migration of the new data while it opens…` | Hai lần lưu giống hệt nhau khi bytes cần migrate = KNOWN #620 ("snapshot giống nhau có thể được ghi hai lần"), đường UI không gặp (preview của `readBackup` đã ở schema mới nhất) |
| 09 | #595 → #620 | **ĐÃ SỬA** | `rsprobe crash … backup` (H·CL-B5) chạy lại hai lần (log `B\rsprobe.log` là lần 2): 40 lần giết tiến trình đang backup → `.tmp` thấy 7 / 10 lần trước khi mở lại, **cuối cùng 0 `.tmp`** trong `backups\` cả hai lần, 0 backup hỏng, 40 / 40 lần mở đọc đúng file (lượt 1: 4 `.tmp` × 13,4 MB còn mãi). `cargo test --lib` một lần: `%TEMP%\p2c-storage-*` **2 942 trước / 2 942 sau** (lượt 1: +46 mỗi lần; 2 942 thư mục cũ của các lần chạy trước vẫn nằm đó — sửa chỉ chặn cái mới). Gỡ sửa: G09a (bỏ `remove_interrupted_backups`) / G09b (xóa mọi `.tmp` của `backups\`) → KILLED `open_removes_the_tmp_of_a_backup_cut_short_and_keeps_everything_else` | `rsprobe heldbackuptmp` (K4): `.tmp` bị giữ → `open` vẫn mở, lần sau xóa được |
| 10 | #596 → #617 | **ĐÃ SỬA** | Ca L·CX-B1 (key URL-encode, mỗi `%` viết thành escape JSON `\u0025` trong `content`) dựng lại trên bản chép crate (`crate-probe-ai.rs`, test nối vào **bản chép** `ai.rs`): `reply(200)` → `AI_BAD_RESPONSE`, thông điệp 401 → `bad ***!` (lượt 1: qua, webview lấy lại key dạng URL-encode); dạng `%5C` (URL rồi JSON) cũng chặn / che; URL-encode chữ hoa / thường lẫn → chặn. Gỡ sửa: G10a (bỏ cách đọc JSON→URL) / G10b (bỏ URL→JSON) → KILLED `the_key_in_two_layers_of_escapes_is_bad_response_and_masked`; G10c (`mask` không gộp đoạn trùng) → KILLED 3 test; G10d (một lượt không giải `%XX`) → KILLED 3 test | **CL2-B4** (hai lớp **cùng loại** — JSON rồi JSON, URL rồi URL — vẫn qua `reply` và `mask`; test của PR ghim JSON+JSON là "hợp lệ") |
| 11 | #596 → #617 | **ĐÃ SỬA** | Ca H·MU-B1 (tên model rất dài) → `check()` nay `AI_BAD_REQUEST` cho 129 ký tự, khoảng trắng, CRLF, `"`, chữ có dấu (test của PR); `crate-probe-ai.rs`: 3 id của `AI_MODELS` (`glm-5.3`, `kimi-k3`, `deepseek-v4.1-flash`) qua `check()`, `qwen3.5+` / `claude@opus` / `glm 5.3` → `AI_BAD_REQUEST`. Gỡ sửa: G11a (129) / G11b (cho khoảng trắng) → KILLED `wrong_arguments_are_bad_request_and_reach_neither_the_key_nor_the_network` | **CL2-B5** (Nit: không test hợp đồng nào giữ "id trong `AI_MODELS` qua luật tên model của Rust") |
| 12 | #596 → #617 | **ĐÃ SỬA** | `apps/desktop/package.json:3`, `tauri.conf.json:4`, `Cargo.toml:3` = `1.0.0`, `Cargo.lock` `project2c 1.0.0`; exe ở `common\exe\project2c.exe` (release `4217ed4`): `FileVersion 1.0.0`, `ProductVersion 1.0.0` (`(Get-Item).VersionInfo`); `USER_AGENT` = `Project-2C/` + `CARGO_PKG_VERSION` (`ai.rs:46`); `tools/eval-ai.mjs:49` đọc `package.json`. Gỡ sửa: G12 (`tauri.conf.json` về 0.1.0) → KILLED `tauri-contract.test.ts > the release configuration > gives package.json, tauri.conf.json and Cargo.toml one version` | Chuỗi `Project-2C/0.1.0` còn ở `tools/eval-ai-core.test.mjs:259, :276, :1094` — chỉ là dữ liệu đầu vào của test (gói F), không phải phiên bản app |
| 13 | #596 → #617 | **ĐÃ SỬA** (kiểm bằng `Cargo.toml` và `target`, máy Home PC — plan §L2.4) | `Cargo.toml:13` `crate-type = ["rlib"]`. `target\release\deps` của worktree: bản build 17/10 01:10 (`pnpm build:exe` ở SHA ghim, bước chuẩn bị) chỉ sinh `libproject2c_lib-<hash>.rlib` 65 750 514 B + `project2c.exe`; **không** sinh `project2c_lib.lib` / `.dll` (hai file 186 469 668 B / 465 920 B còn nằm đó có ngày 13/10 — của bản build lượt 1, cargo không tự xóa). Thời gian build release Home PC: `Finished release in 1m 37s` (`baseline.md`), không có số lượt 1 cùng máy để so. Gỡ sửa: G13 → KILLED `… > builds the Rust library only as the rlib the exe links` | Không đo lại thời gian build (cần ≈ 13 phút build nặng, có thể làm nhiễu phiên bên kia đang đo) |
| 14 | #596 → #617 | **ĐÃ SỬA** | Trên exe release bản chép (`exe-e1.mjs`, thư mục mới, cổng 9338, profile WebView2 riêng): `plugin:window|title`, `set_title`, `is_maximized`, `plugin:app|version`, `plugin:event|emit`, `plugin:webview|get_all_webviews`, `plugin:image|from_path`, `plugin:path|resolve_directory`, `plugin:menu|new` → **"not allowed by ACL"** (lượt 1: `core:default` cho phép); `plugin:event|listen` và lệnh app `db_latest_backup` được. CSP: chèn `<base href>` → `base-uri blocked`, `baseURI` không đổi; `form.submit()` → `form-action blocked`, trang không đi đâu; `fetch` 127.0.0.1 → `connect-src blocked`. Thử tay: Xuất backup → file trong `exports\`; "Mở thư mục" → Explorer mở `Project2C-data\backups` (đã đóng lại); file bị giữ → lưu lỗi → bấm X (WM_CLOSE) → hộp "Chưa lưu được thay đổi" → thả file, "Thử lại" → lưu rồi thoát (exit 0); mở lại: team vừa tạo còn; đóng khi không có gì chờ → thoát sau 360 ms. Gỡ sửa: G14a (thêm lại `core:default`) / G14b (bỏ `base-uri`) → KILLED `tauri-contract.test.ts` | Không thử "mở link ngoài": app không có link ngoài nào (`git grep` `href=http`, `target=`, `window.open` ngoài bản web), ChatGPT web đi qua lệnh Rust `open_chatgpt` — quy tắc 2 cấm mở chatgpt.com |
| 60 | #595 → #620, #596 → #617, #606 → #644 | **ĐÃ SỬA** | Áp lại đột biến sống của lượt 1: RS4 / R8 (tên xuất bắt đầu bằng ".") → KILLED 2 test (`..p2cbackup`, `.a.xlsx`); RS9 / R7 (`has_same_bytes` bỏ so độ dài) → KILLED `backup_of_a_file_a_longer_backup_starts_with_writes_a_copy`; RS7 / R4 (bỏ flush trước rename) → KILLED 2 test (seam `save_with`); A14 (cờ bận trước khi kiểm đối số) → KILLED `wrong_arguments_while_a_request_runs_are_bad_request_and_leave_its_flag_alone`; MJ15 (`readBackup` không đóng DB tạm) → KILLED `app-data.test.ts > backup files > closes the databases it reads the file in`. `TempDir` tự xóa: xem DR6-09 | Hai đột biến sống lượt 1 **không** thuộc Issue nào, nay vẫn sống: J5 / MJ9 (`setTimeout` trước `close()` DB cũ), MJ30 (`useQuery` bỏ `revision`) — cả bộ 2 898 test xanh; lượt 1 đã ghi lý do (cần React thật / gần tương đương), không ghi phát hiện mới |


## 3. Phạm vi đã đọc

**Diff sửa của gói B** (`git diff --numstat 8855345 4217ed4 -- apps/desktop/src-tauri apps/desktop/src/data`, bỏ 3 file AI của `src/data` thuộc gói C): `storage.rs` +273 / −14, `ai.rs` +189 / −63, `Cargo.toml` +4 / −2, `Cargo.lock` +1 / −1, `capabilities/default.json` +6 / −2, `tauri.conf.json` +2 / −2, `app-data.ts` +45 / −5, `tauri-storage.ts` +11 / −1; test `app-data.test.ts` +92 / −2, `tauri-contract.test.ts` +102 / −2, `tables.test.ts` +2 / −1 (Rust: test trong file tính chung).

**Đọc hết ở SHA ghim:** `src-tauri/src/storage.rs` (1 660 dòng: SP 1–531, test 533–1 660), `lib.rs` (205), `ai.rs` SP 1–566 (+ test của DR6-10 / 11 / A14, xem mục 2), `main.rs`, `build.rs`, `Cargo.toml`, `tauri.conf.json`, `capabilities/default.json`; `src/data/app-data.ts` (476), `persist-queue.ts` (79), `tauri-storage.ts` (71), `tables.ts` (68), `today.ts` (58), `demo-snapshot.ts` (45), `AppDataContext.tsx` (52); diff test của `app-data.test.ts`, `tauri-contract.test.ts`, `tables.test.ts`.

**Chỗ nối gói khác:** `packages/db/src/database.ts` (`quickCheck`, `openDatabase`), `apps/desktop/src/main.tsx`, `shell/{startup-error.ts, StartupError.tsx, SaveWarning.tsx, CloseGuard.tsx, close-guard.ts}`, `i18n/vi.ts:973-995, 1087-1095` (câu khởi động / lưu / đóng app), `data/ai-analysis.ts:70-90` (mở ChatGPT web: exe đi qua Rust), `routes/SettingsBackup.tsx:215-225`, `e2e/perf/probe.perf.ts` (định nghĩa `reload.*`, `app.open-data`), `tools/eval-ai.mjs:49` (User-Agent theo `package.json`).

**Tài liệu (thêm):** ADR-0016, spec Phase 6 §4.1 (S2-1…S2-6), §5, §5.1–§5.2, `docs/metrics/phase-6.md` (ngưỡng, "không xấu đi").

**Tài liệu:** `CLAUDE.md` gốc + `apps/desktop/CLAUDE.md`, `.claude/rules/{i18n-ui,tests}.md`; `common\{plan.md (§1–§12, §L2.1–§L2.11, Phụ lục D, E, H), known.md, fixes.md (#595/#620/#621, #596/#617, #606/#644), baseline.md}`; tổng hợp lượt 1 §1–§5.2, §5.8, §6, §7; báo cáo gốc lượt 1 gói B của Claude, Codex, Muse cả hai máy (`docs/reviews/raw/2026-10-15/{,home-pc/}{claude,codex,muse}/B.md`); `claude\A.md` lượt 2 (để không báo lại).

## 4. Kịch bản mới đã thử

| # | Kịch bản (các bước, dữ liệu) | Kết quả | ID |
|---|---|---|---|
| K1 | Hỏng nhỏ thay vì hỏng cả trang (lượt 1 chỉ thử cả trang / byte đầu trang): file DB dữ liệu tải lượt 2 (`data\load.db`, 3 435 trang); (a) **600 lần lật một byte ngẫu nhiên** (XOR 1–255, ngoài trang 1); (b) 300 lần **một sector 512 B** về `0x00`, 300 lần về `0xFF`; phân loại: mở lỗi / `quick_check` bắt / `quick_check` "ok" nhưng `integrity_check` bắt / cả hai "ok"; (c) đổi một ký tự mã KH trong chỉ mục `appointments_customer` (bảng không đổi), chạy khởi động exe (`openAppData` + storage giả) và đọc lại như màn (`p01-damage.mjs`, `p01b-sectors.mjs`) | (a) 1 mở lỗi · 72 `quick_check` bắt · **257 `quick_check` "ok" mà `integrity_check` bắt** (`row … missing from index kyc_versions_customer_seq`, `…_appointment`, `sqlite_autoindex_policies_1`…) · 270 không gì bắt được (hỏng trong giá trị). (b) sector: 286 + 288 `quick_check` bắt, **0** lọt mà `integrity_check` bắt, 13 + 12 cả hai "ok", 1 mở lỗi. (c) `quick_check` `[]`, `integrity_check` 2 dòng; khởi động **chạy, gọi `backup`** (file hỏng thành backup mới nhất); `SELECT … WHERE customer_id = ?` 1 / 5 lịch, `countCustomerRecords` (hộp 5f) `appointments: 1` trong khi `listAppointments` 5; xuất → nhập backup dựng lại chỉ mục (5) | CL2-B1 |
| K2 | `project2c.db` có thuộc tính **chỉ đọc** (chép từ nơi chỉ đọc, `attrib +R`), chưa có `project2c.lock` (`rsprobe readonly`, `storage.rs` ghim) | `open` OK, backup khởi động OK, **`save` → `PermissionDenied`, os error 5 "Access is denied."**, file vẫn chỉ đọc, không sót `.tmp`; câu dải lưu (`p03-startup-msg.mjs`): "Chưa lưu được dữ liệu vào file (file có thể đang mở trong chương trình khác)… sẽ được lưu lại ở lần thay đổi tiếp theo"; hộp đóng app: "Đóng chương trình đó rồi chọn Thử lại" | CL2-B2 |
| K3 | `backups` là một **file** (không phải thư mục) lúc khởi động (`rsprobe backupsfile`) | `open` OK; backup → `AlreadyExists`, os error 183; màn khởi động `storage.backupFailed` "File dữ liệu không bị đổi, không cần khôi phục… kiểm tra… thư mục đó không chỉ đọc hay bị chương trình khác giữ" — đúng hướng | không thấy |
| K4 | `.tmp` của backup bị ngắt mà **chương trình khác đang giữ** lúc mở app (`rsprobe heldbackuptmp`); 40 lần giết tiến trình đang backup liên tục (`rsprobe crash … backup`, H·CL-B5 lượt 1) | Đang giữ: `open` vẫn mở được, `.tmp` còn, backup vẫn ghi được; thả ra → lần mở sau xóa `.tmp`. 40 lần giết (hai lần chạy): lần mở sau luôn đọc đúng file (40 / 40), 0 backup hỏng, `.tmp` thấy 7 / 10 lần trước khi mở lại, **cuối cùng 0 `.tmp`** trong `backups\` (lượt 1: 4 × 13,4 MB còn mãi) | không thấy |
| K5 | Mở **thư mục dữ liệu của exe lượt 1** bằng exe lượt 2: `project2c.db` = dữ liệu tải do code `8855345` ghi (schema 9, gói A `old-8855345-load.db`), exe release ghim ở thư mục mới (`exe-e2.mjs r1`); cùng ca trong Node qua `openAppData` (`p02-openfrom.mjs`) | Exe mở được, **512 ms** (migration 0009 + 0010 + `quick_check` + backup), không màn lỗi; `backups\` có 1 bản = **đúng file schema 9 trước migration** (sha256 trùng), lần lưu sau backup là schema 11 (Node: 1 496 KH, 10 414 lịch, `quick_check ok`). Thứ tự "kiểm → chép backup → lưu migration" đúng; `quick_check` chạy trên DB **đã** migrate (KNOWN #620, xem mục 8 trục D) | không thấy |
| K6 | **Làm đúng câu của màn lỗi khởi động** trên exe (`exe-e4.mjs`): `project2c.db` bị chương trình khác giữ → cửa sổ 1 hiện `FILE_IN_USE` ("…hãy đóng chương trình đó rồi mở lại app"); chương trình kia thả file; người dùng mở app lần nữa khi cửa sổ 1 còn đó | Cửa sổ 2: **"Project-2C đang mở ở một cửa sổ khác — Hãy dùng cửa sổ đó. App không đọc hay ghi gì ở cửa sổ này; đóng cửa sổ này đi."**; cửa sổ 1 vẫn là trang lỗi, **0 nút**, tiến trình còn sống (giữ `project2c.lock`); chỉ khi đóng **cả hai** rồi mở lần ba mới vào được (385 ms) | CL2-B6 |
| K7 | Key qua hai lớp escape **cùng loại** và ba lớp (`crate-probe-ai.rs` trên bản chép crate, key giả): JSON rồi JSON (key viết bằng escape JSON `\u0073\u006b…`, rồi chính dấu `\` đó lại escape thành `\\` hoặc `\u005C`), URL rồi URL (`%2573%256B…`), JSON→URL→JSON; thông điệp lỗi 401 cùng các dạng đó; đo `reveals` / `mask` | JSON→URL, URL→JSON, URL chữ hoa / thường lẫn: chặn + che (DR6-10 đã sửa). **JSON+JSON, URL+URL: `reply(200)` → `Ok`; chữ webview nhận (sau `JSON.parse`) là `\u0073\u006b\u002d…` (giải JSON thêm một lần = key) / `%2573%256B…` (giải URL hai lần = key); thông điệp 401 không che**. Ba lớp: qua (ngoài phạm vi hợp lý). Chi phí bản debug: `reveals` 53 ms / `mask` 55 ms trên 128 K ký tự, 841 / 862 ms trên 2 M (PR: release 16 ms / 0,26 s) | CL2-B4 |
| K8 | Tên model: 3 id của `AI_MODELS` (`packages/ai/src/models.ts:25-30`) qua `check()` của Rust? id giả định có ký tự ngoài `-._:/` (`qwen3.5+`, `claude@opus`) | 3 id thật: `Ok`; `qwen3.5+`, `claude@opus`, `glm 5.3` → `AI_BAD_REQUEST`. Không test TS nào đối chiếu `AI_MODELS` với luật của Rust (khác trần `maxTokens` / ký tự đã có test hợp đồng ở DR6-61) | CL2-B5 |
| K9 | Vì sao `app.open-data` và cả sáu `reload.*` của `baseline.md` chậm hơn lượt 1 cùng máy (+62…+67 ms)? Exe bản chép có dữ liệu tải (`exe-perf.mjs`): `app.open-data` 3 lần, `reload.settings` / `reload.overview` 5 lần; trong **chính WebView2 của exe**, sql.js nạp từ wasm của app, `PRAGMA quick_check` / `integrity_check` trên cùng bytes | `reload.settings` 248 ms, `reload.overview` 360 ms (trùng `baseline.md` 247 / 355); `quick_check` trong WebView2: **63,5 ms lần đầu của instance mới, 60,5–62,4 ms các lần sau**; `integrity_check` 91,7–94,2 ms; `new SQL.Database` 2–3 ms. File dữ liệu tải lượt 2 lớn hơn 4,6 % (14 069 760 so 13 455 360 B của lượt 1, cùng cách dựng: 3 chỉ mục 0009). → phần chậm đi ≈ `quick_check` (DR6-06) + file lớn hơn; mục 6.2 | CL2-B7 |
| K10 | Màn khởi động trên exe với từng lỗi file (`exe-e2.mjs held / lockro / page`): `project2c.db` bị giữ lúc mở; `project2c.lock` chỉ đọc; một trang ghi đè | `held` → "File dữ liệu đang bị chương trình khác giữ"; `lockro` → "App không có quyền ghi vào thư mục dữ liệu"; `page` → "File dữ liệu bị hỏng" + câu chép bản liền trước; cả ba: `project2c.db` không đổi (sha256), không tạo `backups\` | không thấy |
| K11 | K1 và K2 **trên exe** (`exe-e2.mjs index / ro`): file lệch chỉ mục ở K1(c); `project2c.db` chỉ đọc | Lệch chỉ mục: exe mở bình thường (407 ms), `backups\` có 1 bản **= file hỏng** (sha256 trùng); hồ sơ KH "Lê Đức Dũng" thẻ Lịch hẹn **"1 lịch · 1 đã gặp"**, hộp 5f "Lịch hẹn **1** (1 đã gặp · 0 lần tính RF)" — KH có 5 lịch (`listAppointments` không lọc). Chỉ đọc: exe mở (418 ms) + backup; tạo team → dải "Chưa lưu được dữ liệu vào file (file có thể đang mở trong chương trình khác)…"; bấm X → hộp "…Đóng chương trình đó rồi chọn Thử lại…"; "Thử lại" → hộp hiện lại; chỉ còn "Đóng và bỏ thay đổi chưa lưu" | CL2-B1, CL2-B2 |
| K12 | **Nhập backup** ngay sau khi mở app trên `project2c.db` chỉ đọc (exe, `exe-e5.mjs`; file nhập = backup vừa xuất ở `exe-e1.mjs`, 10,4 MB) | Cài đặt báo **"Đã nhập backup xuất lúc 17/10/2026 07:57. Backup: …\project2c-s00000001-….db"**; dải lỗi lưu như K2; bấm X → hộp đóng app → "Đóng và bỏ…" → `project2c.db` **không đổi** (sha256): bản nhập không có trong file | CL2-B2 |
| K13 | Fuzz S-2 của lượt 1 (`r1-s2-fuzz.mjs`, H·CL lượt 1) chạy lại trên code ghim (có `openFrom` mới, `saveError`): 900 vòng × 40 thao tác, hạt giống 17; ghi / Nạp lại / Nhập (15 % file hỏng) / Xuất / `flush` chồng nhau, lỗi lưu và lỗi backup giả 8 % mỗi lần gọi | 16 242 lệnh ghi (8 987 bị khóa S2-2), 3 585 Nạp lại, 3 581 Nhập, 5 392 Xuất, 7 200 `flush`, 1 035 lỗi lưu, 481 lỗi backup → **0 vi phạm** 8 bất biến I1–I8, 0 lỗi lạ (3 phút 19 giây) | không thấy |
| K14 | KNOWN #620 ("`quickCheck` chạy trên DB đã migrate… xem lại khi có migration mới"): v1.0 có 0009 (dựng 3 chỉ mục) và 0010 (dựng lại `people`). File schema 9 (gói A) hỏng đúng trang 0010 bỏ đi — trang bảng `people` (trang 2) và `sqlite_autoindex_people_1` (trang 3), ghi đè cả trang hoặc lật 1 byte — rồi khởi động (`p04-migrate-covers.mjs`) | Ghi đè cả trang (bảng / chỉ mục) → migration ném "database disk image is malformed" → **không mở, không backup, không lưu**. Lật 1 byte trong chỉ mục → `quick_check` trước migrate "ok", nhưng kiểm khóa ngoại của bộ chạy migration bắt ("Migration 10 (0009_lookup_indexes) leaves references pointing nowhere…") → không mở. Lật 1 byte trong bảng → không gì bắt được, trước hay sau migrate (hỏng trong giá trị) → mở, backup. Không có ca nào migration "che" hỏng mà kiểm trước migrate bắt được | không thấy (KNOWN, không có bằng chứng mới) |

## 5. Phát hiện mới

### CL2-B1 — `quick_check` không thấy hỏng làm chỉ mục lệch bảng: file hỏng một byte vẫn mở, thành backup mới nhất, hồ sơ KH và hộp 5f đếm sai

```
ID: CL2-B1
Mức: Low
Trục: E, D
Vị trí: apps/desktop/src/data/app-data.ts:345-348 (khởi động chỉ chạy quickCheck); packages/db/src/database.ts:48-52 (doc "a page, an index out of step"), :119-129 (PRAGMA quick_check) (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-06 (biến thể gần) · mới do đợt sửa (PR #620 dùng quick_check theo Issue #595)
Kịch bản: K1, K11
```

- **Mô tả:** `PRAGMA quick_check` kiểm cấu trúc trang nhưng không so nội dung chỉ mục với bảng (`integrity_check` có). Hỏng cỡ một byte trong khóa của chỉ mục (hoặc trong cột có chỉ mục của một dòng bảng) giữ nguyên cấu trúc trang: `quick_check` trả `ok`, app mở, `storage.backup()` chép file hỏng thành backup mới nhất — đúng điều DR6-06 / DR-51 muốn chặn — và các truy vấn đi qua chỉ mục trả sai mà không báo. Doc comment `database.ts:49` hứa bắt "an index out of step", thật ra chỉ bắt khi **số** mục lệch.
- **Tái hiện:** `node --import ./hooks.mjs p01-damage.mjs` (log `B\p01-damage.log`) trên `data\load.db` (dữ liệu tải lượt 2): 600 lần lật một byte ngẫu nhiên → `{"openFails":1,"quickFlags":72,"quickOkIntegrityFlags":257,"bothOk":270}`, tức trong 329 lần hỏng mà SQLite thấy được, `quick_check` bắt 72; ví dụ `integrity_check`: `row 987 missing from index kyc_versions_customer_seq`, `row 1537 missing from index sqlite_autoindex_policies_1`, `non-unique entry in index kyc_facts_customer_seq`. Ca dựng sẵn (đổi ký tự cuối mã KH `01K7C4NQACX14WV0691A24X2VK` trong chỉ mục `appointments_customer`): `classify: {"open":"ok","quick":[],"integrity":["row 1373 missing from index appointments_customer","row 6248 missing from index appointments_customer"]}`, `startup: {"started":true,"events":["backup"]}`, `listAppointments 5 · SELECT … WHERE customer_id = ? 1 · countCustomerRecords {"appointments":1,"met":1,…}`. Trên exe release (`exe-e2.mjs index`, log `exe-e2b.log`): mở 407 ms, không màn lỗi, `backups\` có 1 bản và `newest backup = the damaged file: true`; hồ sơ "Lê Đức Dũng" thẻ Lịch hẹn "1 lịch · 1 đã gặp", hộp 5f "Lịch hẹn 1 (1 đã gặp · 0 lần tính RF)". Hỏng theo sector 512 B (`p01b-sectors.mjs`) thì `quick_check` bắt hết như `integrity_check` (286 / 288 bắt, 0 lọt).
- **Ảnh hưởng:** cần hỏng lặng lẽ cỡ vài bit (RAM không ECC lúc ghi, lỗi firmware) — hiếm, nên Low. Khi gặp: hồ sơ KH, hộp 5f, Thùng rác (đếm theo `customer_id`), KYC theo KH… thiếu bản ghi mà không ai biết; sau ≈ 10 lần mở có ghi, `backups\` chỉ còn bản lệch chỉ mục (như hệ quả DR6-06 lượt 1). Đường vòng chỉ có khi biết: xuất rồi nhập backup (dựng lại chỉ mục).
- **Đề xuất:** Owner chọn: `PRAGMA integrity_check` thay `quick_check` (bắt thêm 257 / 600 ca trên; WebView2 của exe đo 91,7–94,2 ms so 60,5–63,5 ms trên dữ liệu tải, tức `app.open-data` thêm ≈ 30 ms, vẫn dưới 600 ms), hoặc giữ `quick_check` và sửa doc comment / ghi chú giới hạn ở spec §5 mục 4. ≈ 1–3 dòng SP + một ca `database.test.ts` (đổi một khóa chỉ mục giữ cấu trúc trang → báo hỏng) + ca `app-data.test.ts` tương tự.

### CL2-B2 — `project2c.db` chỉ đọc: app mở bình thường rồi mọi lần lưu lỗi, câu báo bảo "file có thể đang mở trong chương trình khác"; Nhập backup vẫn báo xong

```
ID: CL2-B2
Mức: Low
Trục: C, D
Vị trí: apps/desktop/src-tauri/src/storage.rs:102-137 (open: kiểm thư mục, file khóa, .tmp — không kiểm project2c.db ghi được), :194-211 (save: lỗi chỉ qua disk_full); apps/desktop/src/shell/SaveWarning.tsx:18; apps/desktop/src/i18n/vi.ts:1087-1088, :1092-1093 (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-07 (biến thể gần: "không ghi được" lúc lưu) · có từ trước, phần sửa #620 chỉ phủ lúc mở
Kịch bản: K2, K11, K12
```

- **Mô tả:** DR6-07 đã tách "thư mục / file khóa không ghi được" thành `ACCESS_DENIED` lúc mở (câu hướng dẫn còn ghi "các file trong đó không chỉ đọc"). Nhưng `open` không kiểm chính `project2c.db`: file có thuộc tính chỉ đọc được đọc, kiểm, chép backup bình thường; đến lần lưu đầu, đổi tên `.tmp` đè lên file chỉ đọc bị Windows từ chối (`PermissionDenied`, os error 5), và vì lỗi lưu chỉ được tách `DISK_FULL`, dải cảnh báo dùng câu chung "file có thể đang mở trong chương trình khác… sẽ được lưu lại ở lần thay đổi tiếp theo" — cả hai vế đều sai với file chỉ đọc. Hộp đóng app bảo "Đóng chương trình đó rồi chọn Thử lại"; Thử lại không bao giờ được.
- **Tái hiện:** `rsprobe readonly` (log `B\rsprobe.log`): `open (first start of the process): Ok(Some(14069760))`, `startup backup: Ok("project2c-s00000001-20261017-080000.db")`, `save over the read-only file: Err(kind PermissionDenied, raw Some(5), message "Access is denied. (os error 5)")`. Trên exe release (`exe-e2.mjs ro`): mở 418 ms, tạo team → dải "Chưa lưu được dữ liệu vào file (file có thể đang mở trong chương trình khác)…", bấm X → "…Đóng chương trình đó rồi chọn Thử lại…", Thử lại → hộp hiện lại, chỉ thoát được bằng "Đóng và bỏ thay đổi chưa lưu". `exe-e5.mjs`: Nhập backup ngay sau khi mở → "Đã nhập backup xuất lúc 17/10/2026 07:57…", dải lỗi, đóng → `project2c.db unchanged = true`.
- **Ảnh hưởng:** người khôi phục / chép `project2c.db` từ nơi chỉ đọc (đĩa CD, bản sao có thuộc tính R, `attrib +R`) mà không chép cả `project2c.lock` chỉ đọc theo — điều kiện hiếm → Low. Khi gặp: làm việc cả phiên, đi tìm "chương trình khác" không có, cuối cùng đóng app và mất mọi thay đổi (cả bản vừa nhập).
- **Đề xuất:** trong `open` (lần đầu của tiến trình), `project2c.db` có thuộc tính chỉ đọc → `ACCESS_DENIED` (câu `storage.accessDeniedHelp` sẵn có đã đúng); hoặc `save` gặp `PermissionDenied` trên file chỉ đọc → mã riêng + câu dải lưu riêng. ≈ 5–10 dòng Rust + test Rust kiểu `open_reports_a_data_folder_it_may_not_write_as_access_denied` (đặt `set_readonly` lên `project2c.db`); PR `build-exe`.

### CL2-B3 — Đột biến bỏ `out_of_reach` khi tạo thư mục dữ liệu sống: ca "exe ở Program Files / ổ chỉ đọc" không test nào giữ

```
ID: CL2-B3
Mức: Low
Trục: T
Vị trí: apps/desktop/src-tauri/src/storage.rs:104 (fs::create_dir_all(dir).map_err(out_of_reach)?); test :858-880, :1265-1284 (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-07 · mới do đợt sửa (PR #620)
```

- **Mô tả:** `ACCESS_DENIED` được giữ bằng ba chỗ gọi `out_of_reach` trong `open`; test chỉ dựng file khóa chỉ đọc (`open_reports_a_data_folder_it_may_not_write_as_access_denied`) và gọi thẳng `out_of_reach`. Chỗ tạo thư mục `Project2C-data` — đúng ca câu `storage.accessDeniedHelp` nêu đầu tiên ("app chạy từ ổ chỉ đọc hay thư mục cần quyền quản trị như Program Files") — không có test.
- **Tái hiện:** `node mut.mjs G07d` (thay `fs::create_dir_all(dir).map_err(out_of_reach)?;` bằng `fs::create_dir_all(dir)?;`) → `G07d | DR6-07 | a data folder that cannot be created keeps its raw OS error | SURVIVED — test result: ok. 101 passed` (`B\mut.log`).
- **Ảnh hưởng:** một lần sửa sau bỏ dòng này thì exe chạy từ Program Files lại hiện "Không mở được file dữ liệu… chép bản mới nhất… để khôi phục" (đúng lỗi DR6-07 cũ) mà CI vẫn xanh.
- **Đề xuất:** seam như `save_with`: `open_with(dir, …, create_dir)` cho test truyền hàm trả `PermissionDenied`, hoặc test Windows dựng thư mục cha từ chối quyền ghi. ≈ 10–20 dòng test.

### CL2-B4 — Key qua hai lớp escape cùng loại (JSON rồi JSON, URL rồi URL) vẫn qua `reply` và `mask`

```
ID: CL2-B4
Mức: Low
Trục: S
Vị trí: apps/desktop/src-tauri/src/ai.rs:335-349 (readings: "Never two passes of JSON"), :286-293 (reveals), :297-330 (mask); test ghim là hợp lệ: ai.rs:1342-1350 (4217ed4)
Tình trạng: CONFIRMED (key giả, server giả trong test)
Liên quan: DR6-10 (biến thể còn hở) · có từ trước; PR #617 chọn không đọc hai lượt JSON
Kịch bản: K7
```

- **Mô tả:** DR6-10 coi key URL-encode nằm trong chữ webview nhận (sau `JSON.parse`) là lộ ("still the key in a backup", comment `ai.rs:813`), nên đọc thêm JSON→URL và URL→JSON. Cùng lý đó, key mà sau `JSON.parse` còn là chuỗi escape JSON (`\uXXXX` của từng ký tự — content viết `\\uXXXX`) cũng chỉ cách key một lần giải, nhưng `readings` cố ý bỏ hai lượt JSON và test `ai.rs:1342-1350` ghim ca này là "hợp lệ"; hai lượt URL (`%2573…`) cũng không đọc. Hai dạng đó qua `reply(200)` vào webview (chữ trả lời có thể được lưu ở `ai_analyses` rồi vào backup) và không bị che trong thông điệp lỗi 401 / 429.
- **Tái hiện:** `cargo test --lib probe_r2 -- --nocapture` trên **bản chép** crate (`B\crate`, module `crate-probe-ai.rs` nối vào bản chép `ai.rs`; log `B\crate-probe-ai.log`): `two JSON layers: each \ escaped as \\ (test pins it as fine) | reply: Ok (passed to the webview) | … | +1 JSON decode is the key: true`; `two URL layers: each % as %25 | reply: Ok (passed to the webview) | … | +2 URL decodes: true`; 401 của hai dạng: thông điệp giữ nguyên chuỗi. Đối chứng: ca DR6-10 → `AI_BAD_RESPONSE`, `bad ***!`.
- **Ảnh hưởng:** như DR6-10: cần server bất thường dội key ở đúng dạng đó → Low; khi gặp, key (dạng giải một / hai lần là ra) nằm trong DB và file backup.
- **Đề xuất:** thêm hai cách đọc JSON→JSON và URL→URL vào `readings` (6 thay 4; nguy cơ chặn nhầm ≈ 0 vì phải giải ra đúng key; chi phí tăng ≈ 50 % so số PR đo, chỉ chạy sau một lượt gọi mạng nhiều giây), đổi ca `ai.rs:1342-1350` thành ca bị chặn; hoặc ghi rõ ngoại lệ này trong ADR-0009 D-1 nếu Owner chấp nhận. ≈ 4 dòng SP + test.

### CL2-B5 — Không test hợp đồng nào giữ "id trong `AI_MODELS` qua luật tên model của Rust"

```
ID: CL2-B5
Mức: Nit
Trục: T
Vị trí: packages/ai/src/models.ts:25-30; apps/desktop/src-tauri/src/ai.rs:42-43, :168-172; apps/desktop/src/data/tauri-contract.test.ts:198-221 (hợp đồng trần của DR6-61, không có tên model) (4217ed4)
Tình trạng: CONFIRMED (3 id hiện tại qua; id giả định bị từ chối)
Liên quan: DR6-11 · mới do đợt sửa (PR #617 thêm luật ở Rust)
Kịch bản: K8
```

- **Mô tả:** #617 cho Rust từ chối tên model ngoài 1–128 ký tự ASCII chữ / số / `-._:/`. Ba id hiện tại qua (`crate-probe-ai.log`: `glm-5.3`, `kimi-k3`, `deepseek-v4.1-flash` → `Ok`), nhưng thêm một model có ký tự khác (`qwen3.5+`, `claude@opus` → `AI_BAD_REQUEST`) thì mọi lần gọi OpenCode của model đó hỏng trên exe mà không test TS nào đỏ (`models.test.ts` chỉ ghim danh sách; e2e chạy Mock).
- **Đề xuất:** thêm vào `tauri-contract.test.ts` một ca đọc `MAX_MODEL_CHARS` và tập ký tự từ `ai.rs` như ca trần của DR6-61, kiểm mọi `AI_MODELS[].id`. ≈ 10 dòng test.

### CL2-B6 — Làm đúng câu "rồi mở lại app" của màn lỗi khởi động khi cửa sổ lỗi còn mở → cửa sổ mới bảo "Hãy dùng cửa sổ đó", mà cửa sổ đó không làm gì được

```
ID: CL2-B6
Mức: Low
Trục: C, A
Vị trí: apps/desktop/src-tauri/src/storage.rs:103-116 (file khóa giữ từ trước khi đọc project2c.db, không nhả khi lỗi); apps/desktop/src/main.tsx:40-47 + shell/StartupError.tsx:5-18 (trang lỗi không có nút thử lại); apps/desktop/src/i18n/vi.ts:984-985, :977-981 ("…rồi mở lại app"), :974-975 ("chép bản mới nhất…"), :991-992 ("Hãy dùng cửa sổ đó") (4217ed4)
Tình trạng: CONFIRMED
Liên quan: DR6-07 · mới do đợt sửa (PR #620: câu `storage.fileInUseHelp` bảo "rồi mở lại app"); cơ chế giữ khóa và các câu `backupFailed` / `diskFull` / `openFailed` / `tooNew` có từ trước
Kịch bản: K6
```

- **Mô tả:** `storage::open` lấy `project2c.lock` (`storage.rs:105-106`) trước khi đọc `project2c.db`, và giữ tới khi tiến trình thoát. Mọi lỗi sau bước đó — `FILE_IN_USE`, file không phải SQLite / mất file còn backup (`openFailed`), `DATA_DAMAGED`, `SCHEMA_TOO_NEW`, backup lúc mở lỗi / đĩa đầy — đều để lại một cửa sổ trang lỗi **đang giữ khóa** (riêng `ACCESS_DENIED` do file khóa chỉ đọc / không tạo được thư mục thì chưa giữ). Câu của các trang đó bảo "…rồi mở lại app" (`fileInUseHelp`, `backupFailedHelp`, `diskFullHelp`), "dùng bản app mới hơn" (`tooNewHelp`) hoặc chép backup đè (`openFailedHelp`, cả trang `damaged`) — việc tự nhiên tiếp theo là mở app lần nữa — mà không nói đóng cửa sổ này. Mở lại khi cửa sổ lỗi còn đó → cửa sổ mới hiện `ALREADY_OPEN` "Hãy dùng cửa sổ đó… đóng cửa sổ này đi" — trỏ về trang lỗi không có nút nào.
- **Tái hiện:** `node exe-e4.mjs` (log `B\exe-e4.log`): `window 1: {"title":"File dữ liệu đang bị chương trình khác giữ","buttons":0}` → chương trình kia thả file → `window 2 (app started again, window 1 still open): {"title":"Project-2C đang mở ở một cửa sổ khác","buttons":0} · Hãy dùng cửa sổ đó. App không đọc hay ghi gì ở cửa sổ này; đóng cửa sổ này đi.`; `window 1 now:` vẫn trang lỗi; chỉ khi đóng cả hai, lần mở thứ ba mới vào (`third start: data open 385 ms`).
- **Ảnh hưởng:** chỉ sai hướng dẫn (không mất dữ liệu), nhưng đúng ở lúc người dùng đang có sự cố và làm theo câu của app → Low.
- **Đề xuất:** nút "Thử lại" trên trang lỗi chạy lại `openAppData` (cùng tiến trình, cùng khóa: `db_open` mở lại được, như reload) — hoặc tối thiểu sửa các câu thành "…rồi **đóng cửa sổ này** và mở lại app" (5 khóa `vi.ts`: `fileInUseHelp`, `backupFailedHelp`, `diskFullHelp`, `openFailedHelp`, `tooNewHelp`), và câu `alreadyOpenHelp` nói thêm "nếu cửa sổ kia đang báo lỗi, đóng nó rồi mở lại". ≈ 3–20 dòng + test `startup-error.test.ts`.

### CL2-B7 — Mọi `reload.*` và `app.open-data` chậm hơn lượt 1 cùng máy là chi phí `quick_check` của DR6-06; `phase-6.md` chưa ghi mốc mới

```
ID: CL2-B7
Mức: Nit
Trục: P
Vị trí: apps/desktop/src/data/app-data.ts:345-348; docs/metrics/phase-6.md:37-43 (mốc app.open-data / reload.*) (4217ed4)
Tình trạng: CONFIRMED (đo trên exe release cùng máy)
Liên quan: DR6-06 · mới do đợt sửa (PR #620 đã ghi chi phí cho app.open-data)
Kịch bản: K9
```

- **Mô tả:** `common\baseline.md` có 7 dòng ⚠️ so lượt 1 cùng máy (sáu `reload.*` +62…+67 ms, `app.open-data` 301 so 189 ms). Mỗi lần trang mở dữ liệu có file — khởi động và mọi lần tải lại webview — nay chạy `quick_check` đồng bộ trên luồng chính: trong WebView2 của exe đo **60,5–63,5 ms** trên dữ liệu tải (14,07 MB); file lượt 2 lớn hơn 4,6 % (14 069 760 so 13 455 360 B) vì 3 chỉ mục 0009 (`db.save` +7 ms ở `baseline.md`). Hai phần cộng lại khớp độ chậm của `reload.*`. `app.open-data` chỉ có 1 mẫu mỗi lần chạy và dao động mạnh trên cùng exe (lượt 1: 189 ms ở bước chuẩn bị, 230–283 ms ở Codex F), nên +113 ms là chi phí trên cộng nhiễu. Mọi số vẫn trong ngưỡng (`app.open-data` ≤ 600 ms, `reload.*` < 500 ms); trong exe người dùng không tải lại được webview (`block-reload.ts`), chỉ gặp ở lần mở app.
- **Tái hiện:** `node exe-perf.mjs` (log `B\exe-perf.log`): `reload.settings: 250 / 247 / 259 / 247 / 248 ms`, `reload.overview: 359 / 360 / 361 / 358 / 363 ms` (trùng `baseline.md`); `in this WebView2: … "quick":[63.5,61.7,62.4,61.8] … [61,61,61.5,61.1] … [61.5,61.4,60.7,60.5], "integrity":94.2 / 93.1 / 91.7`.
- **Ảnh hưởng:** không ai chậm quá ngưỡng; chỉ là mốc "không xấu đi" của spec §5.1 sẽ còn báo ⚠️ ở G7 / sau v1.0 nếu không ghi. Chi phí tăng tuyến tính theo cỡ file (≈ 4,4 ms / MB): file 38 MB (chỗ `db.save` chạm 400 ms theo ngoại suy lượt 1) → `quick_check` ≈ 170 ms.
- **Đề xuất:** không cần sửa code (người dùng chỉ trả ở lần mở app, trong ngưỡng); ghi vào `docs/metrics/phase-6.md` số đo lượt 2 làm mốc mới kèm lý do (PR docs), để G7 / lượt đo sau không coi là chậm đi. Nếu Owner chọn `integrity_check` ở CL2-B1 thì mốc tăng thêm ≈ 30 ms.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc | Trên | Kết quả | ID |
|---|---|---|---|
| `cargo clippy --manifest-path apps/desktop/src-tauri/Cargo.toml --lib --tests --locked --offline -- -W clippy::pedantic` (một lần, 2,9 s; log `B\clippy-pedantic.log`, danh sách `clippy-list.mjs`) | Rust ở SHA ghim | exit 0. **lib 19** cảnh báo (lượt 1 Home PC: 18): 12 `doc_markdown`, 3 `needless_pass_by_value` (`lib.rs:105, :120, :163`, tham số lệnh Tauri), `cast_possible_wrap` `lib.rs:66`, `missing_panics_doc` `lib.rs:188`, `struct_field_names` `ai.rs:117`, `redundant_closure` `storage.rs:69`. Cái mới duy nhất: `doc_markdown` ở `ai.rs:42` (doc của `MAX_MODEL_CHARS`, DR6-11). lib test 31 (19 trùng): 12 chỉ ở test (ép kiểu, `match` trên bool, `for_each`). Không cảnh báo nào chỉ lỗi / code thừa | — |
| `tsc --noUnusedLocals --noUnusedParameters` | `tsconfig.base.json:12-13` bật sẵn hai cờ → `pnpm typecheck` trong `pnpm verify` (xanh ở SHA ghim, `common\baseline.md`) | 0 biến / tham số thừa (không chạy lại) | — |
| Nơi dùng export / thành viên mới của đợt sửa (`git grep`) | `isDamagedDataError`, `FILE_IN_USE`, `ACCESS_DENIED` (`startup-error.ts`), `saveError` / `subscribeSaveError` (`SaveWarning.tsx`), `Database.quickCheck` (`app-data.ts`), `out_of_reach`, `remove_interrupted_backups`, `save_with` / `write_atomic_with` (seam test) | Mỗi cái có nơi dùng sản phẩm, trừ `save_with` / `write_atomic_with` là seam cho test (như `post_with` của `ai.rs`). `PersistQueue.unsaved()` vẫn chỉ test dùng = DR6-66 (KNOWN, hoãn) | — |
| Code lặp | `storage.rs` | `fs::read_dir(…).into_iter().flatten().flatten()` nay ×4 (`:280`, `:298` mới, `:398-401`, `:414-417`); `remove_interrupted_backups` lặp vòng của `remove_interrupted_exports` = KNOWN (#620, cùng mục DR6-67), không có bằng chứng mới | — |
| Dependency | `git diff 8855345 4217ed4 -- apps/desktop/package.json apps/desktop/src-tauri/Cargo.lock` | chỉ dòng phiên bản (`1.0.0`): không thêm / bớt crate hay package | — |
| `crate-type` (DR6-13) | `target\release\deps` sau `pnpm build:exe` ở SHA ghim | chỉ `libproject2c_lib-<hash>.rlib` 65,8 MB; không còn `project2c_lib.lib` 186,5 MB / `.dll` (hai file cũ ngày 13/10 vẫn nằm trong `target` của worktree, cargo không tự xóa) | — |
| Cỡ dòng | `node tools/size-report.mjs` (baseline) | B: SP 2 162 (+161), test 4 433 (+465), 19 file (0) | — |
| Exe / bundle | `common\baseline.md` (không dựng lại) | `project2c.exe` 5 404 672 B (Δ −9 728 so `b139d8a`); `assets/index.js` +17 727 B cho cả app (gói B chỉ thêm ≈ 45 dòng TS); tách theo module cần visualizer (G4, chỉ đề xuất) | — |

Đề xuất refactor bloat: không có mục mới (chỉ KNOWN DR6-66, DR6-67).

### 6.2 Hiệu năng

Máy Home PC `DESKTOP-KDURKJP`, 17/10 07:40–08:16 (giờ máy). Lúc đo exe: không `project2c.exe` nào khác, không cổng debug nào khác nghe, CPU 2–5 %; phiên Codex mở ở `Project-2C-review-2` (không biết đang chạy gì). Dữ liệu: `common\load\load-2026-10-12-seed6.p2cbackup` qua `importBackup` → `data\load.db` (14 069 760 B, = file exe để lại sau Nhập backup). Mốc so: `common\baseline.md` (exe ở SHA ghim, cùng máy), `perf-ref` lượt 1 Home PC qua `baseline.md`, báo cáo Claude B Home PC lượt 1 §4b. Luật nhiễu: xấu hơn khi quá 20 % **và** quá 10 ms.

| Thao tác | Nơi / lần | Lượt 2 | Mốc cùng máy | Δ / ngưỡng | ID |
|---|---|---|---|---|---|
| `reload.settings` | exe bản chép, 5 | 248 ms (247–259) | `baseline.md` 247 · lượt 1 180 | +68 ms so lượt 1 ⚠️ (đã có ở `baseline.md`) · < 500 ms ✅ | CL2-B7 |
| `reload.overview` | exe, 5 | 360 ms (358–363) | `baseline.md` 355 · lượt 1 293 | +67 ms ⚠️ · < 500 ms ✅ | CL2-B7 |
| `app.open-data` | exe, 3 lần mở (CDP gắn từ đầu, nên không cùng cách `baseline.md`) | 417 / 372 / 361 ms | `baseline.md` 301 (1 mẫu) · lượt 1 189 (1 mẫu), 230–283 (Codex F lượt 1) | ≤ 600 ms ✅ | CL2-B7 |
| `PRAGMA quick_check` trong WebView2 của exe (sql.js từ wasm của app, cùng bytes) | 3 instance × 4 | lần đầu 63,5 / 61 / 61,5 ms; sau 60,5–62,4 ms | — | ≈ toàn bộ phần chậm đi của `reload.*` | CL2-B7 |
| `PRAGMA integrity_check` trong WebView2 | 3 | 94,2 / 93,1 / 91,7 ms | — | +≈ 30 ms nếu chọn ở CL2-B1 | CL2-B1 |
| `quick_check` / `integrity_check` trong Node (`p01`) | 7 | 68,2 / 98,9 ms trung vị | lượt 1 Claude B laptop 79,1 / 113,1 (khác máy) | — | — |
| `app.open-data` khi mở thư mục của exe lượt 1 (schema 9, migration 0009 + 0010) | exe, 1 | 512 ms | — | ≤ 600 ms ✅ | — |
| Mở lần đầu (sinh seed demo), `p2c:data-open` | exe, 1 (thư mục mới) | 3 150 ms | `baseline.md` 3 113 (3 lần, cách T-227) | trong nhiễu; K15 | — |
| Rust `storage::save` (ghi `.tmp` + `sync_all` + rename) | `rsprobe time`, 15, hai lần chạy | 10,1 / 9,9 ms trung vị (9,5–11,5), file 14,07 MB | lượt 1 Home PC 9,5 ms (13,46 MB) | trong nhiễu | — |
| Rust `storage::open` / backup thư mục rỗng / file không đổi / file đổi, 10 bản cùng cỡ | `rsprobe time`, hai lần chạy | 3,8–4,0 / 13,6–13,8 / 6,6–7,2 / 41,4–42,0 ms | lượt 1 Home PC 4,0 / 13,6 / 6,7 / 42,6 ms | trong nhiễu | — |
| `reveals` + `mask` (4 cách đọc, DR6-10) | bản chép crate, **debug** | 53 + 55 ms / 128 K ký tự; 841 + 862 ms / 2 M | PR #617 (release): 16 ms / 128 KB, 0,26 s / 2 MB | chỉ chạy sau một lượt gọi mạng nhiều giây; không có ngưỡng | — |
| `importBackup` với bytes schema 9 + 2 lần lưu (`p02`, storage trong bộ nhớ) | Node, 1 | 49 ms | — | — | — |

Phần chậm đi so lượt 1 cùng máy (7 dòng ⚠️ của `baseline.md`) đã quy được nguyên nhân: `quick_check` của DR6-06 (đo 60,5–63,5 ms ngay trong WebView2) + file lớn hơn 4,6 % (chỉ mục 0009). Không thao tác nào vượt ngưỡng `phase-6.md`; không có phát hiện P mức Low trở lên (CL2-B7 là Nit: ghi mốc mới).

## 7. Bảng đếm mức × trục

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | | 0 |
| Low | | CL2-B1* | CL2-B2*, CL2-B6* | (CL2-B1*, CL2-B2*) | | CL2-B4 | | | CL2-B3 | (CL2-B6*) | 5 |
| Nit | | | | | | | CL2-B7 | | CL2-B5 | | 2 |

\* gắn hai trục, đếm một lần ở trục đầu. 7 / 7 CONFIRMED, 0 PLAUSIBLE, 0 KNOWN mới. Mọi phát hiện có "Liên quan: DR6-xx": CL2-B1, B7 (DR6-06); CL2-B2, B3, B6 (DR6-07); CL2-B4 (DR6-10); CL2-B5 (DR6-11). Bảng R: **10 / 10 DR6 của gói B ĐÃ SỬA**; 35 đột biến "gỡ phần sửa" / lượt 1: 32 KILLED, 3 sống (G07d → CL2-B3; J5, MJ30 của lượt 1, ngoài Issue).

## 8. Đã xét, không thấy

- **R:** 10 DR6 (06–14, 60) ĐÃ SỬA (mục 2): tái hiện lượt 1 chạy lại (L·CL-B1, L·CL-B2, H·CL-B1, H·CL-B5, L·CX-B1, H·MU-B1, L·CL-B4/B5, H·CL-B3) nay ra kết quả đúng; mọi test chấp nhận của #595 / #596 / #606 (phần B) đỏ khi gỡ phần sửa, trừ G07d (CL2-B3). Biến thể còn hở: CL2-B1 (DR6-06), CL2-B2 / CL2-B6 (DR6-07), CL2-B4 (DR6-10), CL2-B5 (DR6-11). DR6-13 "nhanh hơn như PR nói": trên Home PC chỉ kiểm được bằng `Cargo.toml` + `target` (không còn `.lib` 186 MB), không đo thời gian build (plan §L2.4).
- **E:** hỏng file: cả trang (382 trang, 0 lọt), sector 512 B (600 lần, 0 lọt so `integrity_check`), một byte (600 lần → CL2-B1); `.tmp` của backup bị giữ (K4); `backups` là file (K3, câu đúng hướng); giết tiến trình giữa backup 40 lần (K4); fuzz S-2 900 vòng (K13); mở thư mục của exe lượt 1 (K5); đĩa đầy chỉ thử qua seam `save_with` của test Rust (không dựng được đĩa đầy thật không dùng quyền admin); `ERROR_DISK_QUOTA_EXCEEDED` (os 1295) Rust đọc là `QuotaExceeded`, không thành `DISK_FULL` → dải lưu câu chung (`B\oskind.rs`: `os error 39: StorageFull`, `112: StorageFull`, `1295: QuotaExceeded`; quota hiếm trên máy cá nhân, không ghi phát hiện). Luật tên xuất / thư mục mở không đổi trong đợt sửa (`git diff` không có dòng nào của `is_export_name`, `folder`, `claim_export_name`, `write_export`).
- **C:** spec Phase 6 §4.1 S2-1…S2-6 + §5 mục 4, ADR-0016, ADR-0009 D-1 / W-1 đối chiếu với code mới: khớp, trừ CL2-B1 (doc `quickCheck` hứa "an index out of step"), CL2-B2, CL2-B6. Câu khởi động / lưu / đóng app trên exe (K10, K11) khớp `vi.ts` từng chữ. Phiên bản 1.0.0 ở mọi chỗ app dùng (DR6-12).
- **D:** thứ tự "mở → kiểm → chép backup → mới lưu" (DR-51) đúng ở mọi lỗi (K10: không tạo `backups\`, file không đổi); file schema 9 → backup là bản trước migration (K5); `openFrom` lưu bản đã migrate (DR6-08); KNOWN #620 (kiểm sau migrate): K14 không thấy ca migration che được hỏng mà kiểm trước bắt — không có bằng chứng mới; hai lần lưu giống nhau khi bytes cần migrate (KNOWN #620) đường UI không gặp.
- **G:** gói B chỉ có phần Rust của AI: `finish_reason` chỉ qua khi là từ thường ≤ 32 ký tự **và** không chứa key ở mọi cách đọc (`ai.rs:269-272`); key không ở `prompt_tokens` / `completion_tokens`; ngoài CL2-B4 không thấy gì. Không chạy `ai_key_*` / `open_chatgpt` trên exe (quy tắc 2).
- **S:** ACL mới chặn 9 lệnh `core:default` cũ (DR6-14); CSP chặn `base-uri`, `form-action`, `connect-src` trên exe; `plugin:event|listen` còn mở cho mọi sự kiện (cần cho CloseGuard, chỉ nghe được). Không có link ngoài nào trong app; ChatGPT web đi qua Rust. Tên xuất / thư mục mở: không đổi từ lượt 1 (round 1 đã thử `..\`, ADS, tên thiết bị). Ngoài CL2-B4 không thấy gì.
- **P:** mục 6.2; chỉ CL2-B7 (Nit).
- **B:** mục 6.1; không có mục mới.
- **T:** 35 đột biến (mục 2, phụ lục 9.2): 32 KILLED; G07d sống (CL2-B3). J5 / MJ9 và MJ30 của lượt 1 vẫn sống, không thuộc Issue sửa nào, lượt 1 đã ghi lý do. Test mới của #620 / #617 / #644 không phụ thuộc đồng hồ / thứ tự (đọc); `cargo test` không còn để thư mục `%TEMP%` (DR6-09). Hợp đồng TS ↔ Rust: thiếu tên model (CL2-B5).
- **A:** gói B không có màn; câu mới (`storage.fileInUse*`, `accessDenied*`, `damaged`, `saveDiskFull`) qua i18n, tiếng Việt; trang lỗi khởi động `role="alert"`, tiêu đề `h1`; điều hướng sau lỗi → CL2-B6.

## 9. Phụ lục

### 9.1 Probe, log

Mọi file ở `C:\workspace\deep-review-1-6-r2\claude\B\`. Probe JS nạp TypeScript của repo ở SHA ghim qua `hooks.mjs` (chép từ `r2\claude\A\hooks.mjs` của chính Claude gói A lượt 2), không ghi gì vào repo; probe trình duyệt chỉ có ở exe (`exe-lib.mjs`: chặn mọi host không local và thay `window.open` ngay từ lần chạy đầu). Dữ liệu: `data\load.db` (= `importBackup` của file tải lượt 2 rồi `export()`), `data\page-damaged.db`, `data\index-damaged.db`; file schema 9 lấy của gói A (`r2\claude\A\old-8855345-load.db`). Probe lượt 1 chép sang và chạy lại: `r1-s2-fuzz.mjs` (log `s2-fuzz.log`, K13), `r1-startup-msg.mjs` (thay bằng `p03`), `rsprobe` (lệnh lượt 1 `lockedread`, `crash`, `lockcheck`, `time` giữ nguyên).

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `p01-damage.mjs` | DR6-06 lượt 1 (L·CL-B1) chạy lại; hỏng cả trang mọi trang thứ 9; 600 lần lật một byte; chỉ mục lệch bảng; giá `quick_check` / `integrity_check` | `p01-damage.log` | DR6-06, K1, CL2-B1 |
| `p01b-sectors.mjs` | một sector 512 B về 0x00 / 0xFF, 300 lần mỗi loại | `p01b-sectors.log` | K1 |
| `p02-openfrom.mjs` | DR6-08 lượt 1 (L·CL-B2) chạy lại + file schema 9 thật | `p02-openfrom.log` | DR6-08, K5 |
| `p03-startup-msg.mjs` | câu màn khởi động / dải lưu / hộp đóng app cho lỗi Rust thật (H·CL-B1 `startup-msg.mjs`) | `p03-startup-msg.log` | DR6-07, K2, K3 |
| `p04-migrate-covers.mjs` | KNOWN #620: hỏng trang `people` của file schema 9 rồi migrate | `p04-migrate-covers.log` | K14 |
| `mkfiles.mjs` | file cho exe: `page-damaged.db`, `index-damaged.db` | — | K10, K11 |
| `rsprobe/src/main.rs` | crate Rust tạm nạp `storage.rs` của repo bằng `#[path]` (chép từ lượt 1 Home PC, thêm `readonly`, `backupsfile`, `heldbackuptmp`, `holdfile`); build `cargo build --release` với target riêng `rsprobe\target` | `rsprobe.log` | DR6-07, DR6-09, K2–K4, 6.2 |
| `crate-probe-ai.rs` | module test nối vào **bản chép** `crate\apps\desktop\src-tauri\src\ai.rs` (bản chép trùng sha256 với repo trước khi nối); `cargo test --lib probe_r2 -- --nocapture` | `crate-probe-ai.log` | DR6-10, DR6-11, K7, K8, CL2-B4, CL2-B5 |
| `oskind.rs` | cách std đọc mã lỗi Windows (39, 112, 1295, 5, 32, 33, 183) | kết quả ở mục 8 trục E | 8 |
| `mut.mjs` | 35 đột biến: vá một file worktree, chạy test, trả nguyên byte, so sha256 với `git show HEAD:` | `mut.log`, `mut.out` | mục 2, CL2-B3 |
| `exe-lib.mjs` | chạy bản chép exe (thư mục riêng, profile WebView2 riêng, cổng 9338, DNS chỉ host local, `window.open` bị thay) | — | mọi ca exe |
| `exe-e1.mjs` | DR6-14 trên exe: lệnh bị ACL chặn, CSP, Xuất backup, Mở thư mục, CloseGuard | `exe-e1.log` | DR6-14 |
| `exe-e2.mjs` | lỗi file trên exe: chỉ đọc, file bị giữ, khóa chỉ đọc, trang hỏng, chỉ mục lệch, thư mục exe lượt 1 | `exe-e2.log`, `exe-e2b.log` | DR6-06, DR6-07, K2, K5, K10, K11 |
| `exe-e4.mjs` | làm theo câu "rồi mở lại app" khi cửa sổ lỗi còn mở | `exe-e4.log` | K6, CL2-B6 |
| `exe-e5.mjs` | Nhập backup trên `project2c.db` chỉ đọc | `exe-e5.log` | K12, CL2-B2 |
| `exe-perf.mjs` | `app.open-data`, `reload.*`, `quick_check` trong WebView2 của exe | `exe-perf.log` | K9, 6.2, CL2-B7 |
| `clippy-list.mjs` | liệt kê cảnh báo `clippy::pedantic` | `clippy-pedantic.log` | 6.1 |
| `r1-s2-fuzz.mjs` | fuzz S-2 lượt 1 (H·CL), nguyên văn, chạy `900 40 17` | `s2-fuzz.log` | K13 |
| `append-appendix.mjs`, `fix-report.mjs`, `fix-report2.mjs` | ghép phụ lục / sửa vài dòng báo cáo có dấu `\` (không phải bằng chứng) | — | — |

### 9.2 Đột biến (35: 32 KILLED, 3 SỐNG)

Lệnh JS: `node node_modules/vitest/vitest.mjs run --bail=1 apps/desktop/src packages/db/src/database.test.ts` ở gốc repo (sống thì cả bộ); Rust: `cargo test --manifest-path apps/desktop/src-tauri/Cargo.toml --lib --locked --offline`. Mỗi đột biến vá một file, trả nguyên byte trong `finally`, so sha256 với `git show HEAD:<file>` trước và sau; chạy 07:50–07:56 (giờ máy) khi không probe nào khác của phiên đọc repo. Sau đợt: `git hash-object` của cả 10 file đã vá = `HEAD:` (kiểm riêng), `git status --short` rỗng. Log nguyên văn:

```text
--- run 2026-10-17T00:50:47.329Z (all)
G06a | DR6-06 | openAppData no longer runs quickCheck | KILLED — Tests  1 failed | 507 passed | 50 skipped (724) — apps/desktop/src/data/app-data.test.ts > openAppData > refuses a file damaged inside that still opens: no backup, nothing saved (DR6-06) (8 s)
G06b | DR6-06 | quickCheck reports nothing ever | KILLED — Tests  1 failed | 328 passed | 19 skipped (691) — packages/db/src/database.test.ts > quickCheck > finds any damaged page of a file that still opens, also one that stops the check (DR6-06) (7 s)
G06c | DR6-06 | a check that throws reads as no damage | KILLED — Tests  1 failed | 433 passed | 21 skipped (699) — packages/db/src/database.test.ts > quickCheck > finds any damaged page of a file that still opens, also one that stops the check (DR6-06) (7 s)
G06d | DR6-06 | the startup page says "cannot open" for a damaged file | KILLED — Tests  1 failed | 611 passed | 87 skipped (724) — apps/desktop/src/shell/startup-error.test.ts > startupMessage > says the file is damaged when its check fails, and how to go back to a backup (DR6-06) (8 s)
G07a | DR6-07 | a held project2c.db keeps its raw OS error | KILLED — test result: FAILED. 100 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.55s — storage::tests::open_reports_a_database_file_another_program_holds_as_in_use (4 s)
G07b | DR6-07 | a read-only lock file keeps its raw OS error | KILLED — test result: FAILED. 100 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s — storage::tests::open_reports_a_data_folder_it_may_not_write_as_access_denied (4 s)
G07c | DR6-07 | a held project2c.db.tmp keeps its raw OS error | KILLED — test result: FAILED. 100 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.55s — storage::tests::open_reports_a_db_tmp_another_program_holds_as_in_use (4 s)
G07d | DR6-07 | a data folder that cannot be created keeps its raw OS error | SURVIVED — test result: ok. 101 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s (4 s)
G07e | DR6-07 | only os error 32 is "in use", not 33 | KILLED — test result: FAILED. 100 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s — storage::tests::a_whole_file_out_of_reach_is_reported_by_its_cause (4 s)
G07f | DR6-07 | a save on a full disk keeps its raw error | KILLED — test result: FAILED. 100 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.56s — storage::tests::a_save_that_finds_the_disk_full_is_reported_as_disk_full (4 s)
G07g | DR6-07 | the startup page says "cannot open" for FILE_IN_USE | KILLED — Tests  1 failed | 495 passed | 134 skipped (722) — apps/desktop/src/shell/startup-error.test.ts > startupMessage > says the file is whole when it is out of reach (FILE_IN_USE, DR6-07) (9 s)
G07h | DR6-07 | the startup page says "cannot open" for ACCESS_DENIED | KILLED — Tests  1 failed | 442 passed | 130 skipped (661) — apps/desktop/src/shell/startup-error.test.ts > startupMessage > says the file is whole when it is out of reach (ACCESS_DENIED, DR6-07) (7 s)
G07i | DR6-07 | the save warning has one sentence for every cause | KILLED — Tests  1 failed | 557 passed | 54 skipped (724) — apps/desktop/src/shell/SaveWarning.test.tsx > SaveFailed > tells to free some room when the disk is full, not to look for a program (DR6-07) (8 s)
G07j | DR6-07 | saveError never cleared after a save that worked | KILLED — Tests  1 failed | 658 passed | 29 skipped (724) — apps/desktop/src/data/app-data.test.ts > the data file card > keeps why the last save failed until a save succeeds, and tells subscribers (DR6-07) (8 s)
G07k | DR6-07 | saveError never set | KILLED — Tests  1 failed | 661 passed | 26 skipped (724) — apps/desktop/src/data/app-data.test.ts > the data file card > keeps why the last save failed until a save succeeds, and tells subscribers (DR6-07) (8 s)
G08 | DR6-08 | openFrom saves the bytes it opened | KILLED — Tests  1 failed | 655 passed | 28 skipped (724) — apps/desktop/src/data/app-data.test.ts > replacing the data (S-2) > saves the migration of the new data while it opens, and nothing of the data it replaces (review of PR 206) (8 s)
G09a | DR6-09 | the first open leaves the .tmp of a backup cut short | KILLED — test result: FAILED. 100 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.55s — storage::tests::open_removes_the_tmp_of_a_backup_cut_short_and_keeps_everything_else (4 s)
G09b | DR6-09 | the first open removes every .tmp of backups\ | KILLED — test result: FAILED. 100 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s — storage::tests::open_removes_the_tmp_of_a_backup_cut_short_and_keeps_everything_else (4 s)
G10a | DR6-10 | no JSON-then-URL reading | KILLED — test result: FAILED. 100 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.55s — ai::tests::the_key_in_two_layers_of_escapes_is_bad_response_and_masked (4 s)
G10b | DR6-10 | no URL-then-JSON reading | KILLED — test result: FAILED. 100 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.55s — ai::tests::the_key_in_two_layers_of_escapes_is_bad_response_and_masked (4 s)
G10c | DR6-10 | mask does not merge the readings of one secret | KILLED — test result: FAILED. 98 passed; 3 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s — ai::tests::no_error_carries_the_key_or_the_session | ai::tests::the_key_and_the_session_are_masked_in_url_and_json_escapes_too | ai::tests::the_key_in_two_layers_of_escapes_is_bad_response_and_masked (4 s)
G10d | DR6-10 | one pass undoes JSON escapes only (round 1 RA7-like) | KILLED — test result: FAILED. 98 passed; 3 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s — ai::tests::a_reply_whose_content_holds_the_key_in_json_or_url_escapes_is_bad_response | ai::tests::the_key_and_the_session_are_masked_in_url_and_json_escapes_too | ai::tests::the_key_in_two_layers_of_escapes_is_bad_response_and_masked (4 s)
G11a | DR6-11 | a model name of 129 characters | KILLED — test result: FAILED. 100 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.55s — ai::tests::wrong_arguments_are_bad_request_and_reach_neither_the_key_nor_the_network (4 s)
G11b | DR6-11 | a model name may hold a space | KILLED — test result: FAILED. 100 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s — ai::tests::wrong_arguments_are_bad_request_and_reach_neither_the_key_nor_the_network (4 s)
G12 | DR6-12 | tauri.conf.json back to 0.1.0 | KILLED — Tests  1 failed | 73 passed (611) — apps/desktop/src/data/tauri-contract.test.ts > the release configuration (DR6-12…14) > gives package.json, tauri.conf.json and Cargo.toml one version (3 s)
G13 | DR6-13 | crate-type back to the three of the template | KILLED — Tests  1 failed | 106 passed | 5 skipped (532) — apps/desktop/src/data/tauri-contract.test.ts > the release configuration (DR6-12…14) > builds the Rust library only as the rlib the exe links (3 s)
G14a | DR6-14 | core:default back in the capability | KILLED — Tests  1 failed | 116 passed | 5 skipped (507) — apps/desktop/src/data/tauri-contract.test.ts > the release configuration (DR6-12…14) > allows the webview only the Tauri commands it uses (3 s)
G14b | DR6-14 | CSP without base-uri 'none' | KILLED — Tests  1 failed | 126 passed | 5 skipped (507) — apps/desktop/src/data/tauri-contract.test.ts > the release configuration (DR6-12…14) > keeps the CSP closed: no other host, no base URL, no form posted anywhere (3 s)
G60a | DR6-60 | RS4 / R8: export names may start with a dot | KILLED — test result: FAILED. 99 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s — storage::tests::write_export_takes_a_report_and_suffixes_it_before_xlsx | storage::tests::write_export_writes_into_exports_and_rejects_unsafe_names (4 s)
G60b | DR6-60 | RS9 / R7: a longer backup with the same start counts as a copy | KILLED — test result: FAILED. 100 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.55s — storage::tests::backup_of_a_file_a_longer_backup_starts_with_writes_a_copy (4 s)
G60c | DR6-60 | RS7 / R4: no flush before the rename | KILLED — test result: FAILED. 99 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.56s — storage::tests::a_save_flushes_the_written_file_to_the_disk_before_it_replaces_the_old_one | storage::tests::a_save_that_finds_the_disk_full_is_reported_as_disk_full (4 s)
G60d | DR6-60 | A14: busy taken before the arguments are checked | KILLED — test result: FAILED. 100 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.54s — ai::tests::wrong_arguments_while_a_request_runs_are_bad_request_and_leave_its_flag_alone (4 s)
G60e | DR6-60 | MJ15: the read backup database is never closed | KILLED — Tests  1 failed | 670 passed | 32 skipped (724) — apps/desktop/src/data/app-data.test.ts > backup files > closes the databases it reads the file in (9 s)
R1-J5 | DR6-— | J5 / MJ9: replaced database closed before the screens re-render | SURVIVED — apps/desktop/src + database.test.ts and the whole vitest suite: Tests  2898 passed (2898) (67 s)
R1-MJ30 | DR6-— | MJ30: useQuery does not re-read after a change | SURVIVED — apps/desktop/src + database.test.ts and the whole vitest suite: Tests  2898 passed (2898) (67 s)
git status --short after: ""
```

- **SỐNG (3):** G07d → CL2-B3; R1-J5 (J5 / MJ9 lượt 1) và R1-MJ30 (MJ30 lượt 1): không thuộc Issue sửa nào, lượt 1 đã ghi lý do (cần React thật / gần tương đương ở React 19), không ghi phát hiện mới.

### 9.3 Nguồn probe

#### `B\p01-damage.mjs`

```js
// P01 (gói B lượt 2, Claude): DR6-06 again, on the round 2 load data.
//  A. Round 1's L·CL-B1 probe (p3-damaged.mjs, laptop): one page of the load file damaged at 25 / 50 / 75 %
//     (first byte zeroed, or the whole page overwritten) — does the file open, what does quick_check say,
//     and what does the exe's startup (openAppData with a storage port) do now.
//  B. Coverage: every 9th page overwritten in turn — open fails / quick_check flags / quick_check misses.
//  C. New (K1): one random byte flipped (not page 1), 600 times — which damage quick_check misses that
//     integrity_check finds, and whether the startup then backs the damaged file up.
//  D. New (K1): one character of a customer id changed inside the index appointments_customer only (the
//     table untouched): quick_check, integrity_check, the startup, and what the app then reads.
// Run: node --import ./hooks.mjs p01-damage.mjs   (writes data\load.db once; reads the repo, writes only here)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { repo, LOAD } from './hooks.mjs';

const HERE = 'C:/workspace/deep-review-1-6-r2/claude/B';
const db = await import(repo('packages/db/src/index.ts'));
const { openAppData, isDamagedDataError } = await import(repo('apps/desktop/src/data/app-data.ts'));
const { calendarDate } = await import(repo('packages/domain/src/index.ts'));
const now = () => new Date('2026-10-12T05:00:00Z');
const TODAY = calendarDate(2026, 10, 12);

mkdirSync(`${HERE}/data`, { recursive: true });
const LOAD_DB = `${HERE}/data/load.db`;
if (!existsSync(LOAD_DB)) {
  const t = performance.now();
  const imported = await db.importBackup(readFileSync(LOAD, 'utf8'), { now });
  writeFileSync(LOAD_DB, imported.db.export());
  imported.db.sqlite.close();
  console.log(`wrote data/load.db from the round 2 load file in ${(performance.now() - t).toFixed(0)} ms`);
}
const good = new Uint8Array(readFileSync(LOAD_DB));
const pageSize = (good[16] << 8) | good[17];
const pages = good.length / pageSize;
console.log(`load.db ${good.length} B, page size ${pageSize}, ${pages} pages`);

const reads = {
  teams: db.listTeams, people: db.listPeople, customers: db.listCustomers,
  appointments: db.listAppointments, policies: db.listPolicies, transitions: db.listStageTransitions,
};
const pragma = (d, name) => {
  try {
    const rows = d.sqlite.exec(`PRAGMA ${name}`)[0]?.values ?? [];
    const found = rows.map(([v]) => String(v));
    return found.length === 1 && found[0] === 'ok' ? [] : found;
  } catch (e) {
    return [`THROWS ${e.message}`];
  }
};
async function classify(bytes) {
  let d;
  try {
    d = await db.openDatabase({ bytes, now });
  } catch (e) {
    return { open: `FAILS ${e.message}` };
  }
  try {
    const quick = d.quickCheck();
    const r = { open: 'ok', quick: quick.slice(0, 2) };
    if (quick.length === 0) r.integrity = pragma(d, 'integrity_check').slice(0, 3);
    return r;
  } finally {
    d.sqlite.close();
  }
}
/** The exe's startup on `bytes` with a storage port that records its calls. */
async function startup(bytes) {
  const events = [];
  const storage = {
    load: async () => bytes,
    save: async () => void events.push('save'),
    backup: async () => (events.push('backup'), 'project2c-s00000002-20261012-080000.db'),
    writeExport: async () => 'x', latestBackup: async () => undefined, openFolder: async () => {},
  };
  try {
    const app = await openAppData({ storage, today: () => TODAY });
    await app.saves.idle();
    return { started: true, events, app };
  } catch (e) {
    await new Promise((r) => setTimeout(r, 0));
    return { started: false, damaged: isDamagedDataError(e), error: String(e.cause ?? e.message).slice(0, 120), events };
  }
}

// ---- A. round 1's probe ----
console.log('\n== A. round 1 L·CL-B1 cases (p3-damaged.mjs) ==');
for (const n of [Math.floor(pages * 0.25), Math.floor(pages * 0.5), Math.floor(pages * 0.75)]) {
  for (const how of ['header', 'fill']) {
    const bytes = new Uint8Array(good);
    const at = (n - 1) * pageSize;
    if (how === 'header') bytes[at] = 0x00;
    else bytes.fill(0x5a, at, at + pageSize);
    const failing = [];
    try {
      const d = await db.openDatabase({ bytes, now });
      for (const [name, read] of Object.entries(reads)) {
        try { read(d); } catch (e) { failing.push(`${name}: ${e.message}`); }
      }
      d.sqlite.close();
    } catch { /* classify says so */ }
    const s = await startup(bytes);
    console.log(JSON.stringify({ page: n, how, ...(await classify(bytes)), screenReadsFailing: failing, startup: { started: s.started, damaged: s.damaged, events: s.events, error: s.error } }));
  }
}

// ---- B. every 9th page overwritten ----
console.log('\n== B. every 9th page (2..) overwritten with 0x5a ==');
const tally = { openFails: 0, quickFlags: 0, quickMisses: 0, integrityFlagsAfterMiss: 0 };
const missedPages = [];
for (let n = 2; n <= pages; n += 9) {
  const bytes = new Uint8Array(good);
  bytes.fill(0x5a, (n - 1) * pageSize, n * pageSize);
  const r = await classify(bytes);
  if (r.open !== 'ok') tally.openFails++;
  else if (r.quick.length) tally.quickFlags++;
  else {
    tally.quickMisses++;
    if (r.integrity.length) tally.integrityFlagsAfterMiss++;
    missedPages.push({ page: n, integrity: r.integrity });
  }
}
console.log(JSON.stringify(tally), 'missed:', JSON.stringify(missedPages.slice(0, 10)));

// ---- C. one random byte flipped ----
console.log('\n== C. one random byte flipped (XOR with 1..255), outside page 1, 600 times ==');
let seed = 20261017;
const rand = () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 2 ** 32);
const flips = { openFails: 0, quickFlags: 0, quickOkIntegrityFlags: 0, bothOk: 0 };
const examples = [];
for (let i = 0; i < 600; i++) {
  const bytes = new Uint8Array(good);
  const at = pageSize + Math.floor(rand() * (good.length - pageSize));
  bytes[at] ^= 1 + Math.floor(rand() * 255);
  const r = await classify(bytes);
  if (r.open !== 'ok') flips.openFails++;
  else if (r.quick.length) flips.quickFlags++;
  else if (r.integrity.length) {
    flips.quickOkIntegrityFlags++;
    if (examples.length < 6) examples.push({ offset: at, page: Math.floor(at / pageSize) + 1, integrity: r.integrity });
  } else flips.bothOk++;
}
console.log(JSON.stringify(flips));
console.log('quick_check "ok", integrity_check finds:', JSON.stringify(examples, null, 1));

// ---- D. a customer id changed inside the index only ----
console.log('\n== D. one character of a customer id changed in index appointments_customer only ==');
{
  const d = await db.openDatabase({ bytes: new Uint8Array(good), now });
  const [[customer, count]] = d.sqlite.exec(
    "SELECT customer_id, count(*) n FROM appointments WHERE deleted_at IS NULL GROUP BY customer_id HAVING n >= 3 ORDER BY customer_id LIMIT 1 OFFSET 200",
  )[0].values;
  const [[root]] = d.sqlite.exec("SELECT rootpage FROM sqlite_master WHERE name = 'appointments_customer'")[0].values;
  d.sqlite.close();
  // Find the id's bytes inside the index's pages only: walk the index b-tree from its root page.
  const text = new TextEncoder().encode(customer);
  const indexPages = new Set();
  const walk = (n) => {
    indexPages.add(n);
    const base = (n - 1) * pageSize + (n === 1 ? 100 : 0);
    const type = good[base];
    if (type !== 0x02) return; // 0x02 interior index page, 0x0a leaf index page
    const cells = (good[base + 3] << 8) | good[base + 4];
    for (let c = 0; c < cells; c++) {
      const ptr = (good[base + 12 + 2 * c] << 8) | good[base + 13 + 2 * c];
      const at = (n - 1) * pageSize + ptr;
      walk(((good[at] << 24) | (good[at + 1] << 16) | (good[at + 2] << 8) | good[at + 3]) >>> 0);
    }
    const right = base + 8;
    walk(((good[right] << 24) | (good[right + 1] << 16) | (good[right + 2] << 8) | good[right + 3]) >>> 0);
  };
  walk(root);
  let hit = -1;
  for (const n of indexPages) {
    const start = (n - 1) * pageSize;
    const page = good.subarray(start, start + pageSize);
    for (let i = 0; i + text.length <= page.length && hit < 0; i++) {
      if (text.every((b, k) => page[i + k] === b)) hit = start + i;
    }
    if (hit >= 0) break;
  }
  const bytes = new Uint8Array(good);
  // The last character of a ULID, one step up (still a valid Crockford character), as a bit flip would.
  const last = hit + text.length - 1;
  bytes[last] = bytes[last] === 0x5a ? 0x59 : bytes[last] + 1;
  console.log(`customer ${customer} (${count} live appointments), index root page ${root}, ${indexPages.size} index pages, id found at byte ${hit} (page ${Math.floor(hit / pageSize) + 1}); last character ${String.fromCharCode(good[last])} → ${String.fromCharCode(bytes[last])}`);
  console.log('classify:', JSON.stringify(await classify(bytes)));
  const s = await startup(bytes);
  console.log('startup:', JSON.stringify({ started: s.started, damaged: s.damaged, events: s.events, error: s.error }));
  if (s.started) {
    const live = s.app.db();
    const viaTable = db.listAppointments(live).filter((a) => a.customerId === customer).length;
    const viaIndex = live.sqlite.exec('SELECT count(*) FROM appointments WHERE customer_id = ? AND deleted_at IS NULL', [customer])[0].values[0][0];
    const counts = db.countCustomerRecords(live, customer);
    console.log(`what the app reads for that customer: listAppointments ${viaTable} · SELECT … WHERE customer_id = ? ${viaIndex} · countCustomerRecords (hộp 5f) ${JSON.stringify(counts)}`);
    const exported = db.exportBackup(live);
    const back = await db.importBackup(exported, { now });
    console.log(`export → import rebuilds the index: count via index ${back.db.sqlite.exec('SELECT count(*) FROM appointments WHERE customer_id = ? AND deleted_at IS NULL', [customer])[0].values[0][0]}`);
    back.db.sqlite.close();
  }
}

// ---- cost of the two checks on the good file ----
console.log('\n== cost on the good load file (this process; first call = cold) ==');
const ok = await db.openDatabase({ bytes: new Uint8Array(good), now });
for (const name of ['quick_check', 'integrity_check']) {
  const times = [];
  for (let i = 0; i < 7; i++) {
    const t = performance.now();
    ok.sqlite.exec(`PRAGMA ${name}`);
    times.push(performance.now() - t);
  }
  const sorted = [...times].sort((a, b) => a - b);
  console.log(`PRAGMA ${name}: runs ${times.map((x) => x.toFixed(1)).join(' / ')} ms · median ${sorted[3].toFixed(1)} ms`);
}
ok.sqlite.close();
```

#### `B\p01b-sectors.mjs`

```js
// P01b (gói B lượt 2, Claude): K1 with a damage model closer to a failing disk than p01 C: one
// 512-byte sector (aligned) zeroed, or filled with 0xFF, inside a page (not page 1), 300 times each.
// Same classes as p01: open fails / quick_check flags / quick_check "ok" but integrity_check flags /
// both "ok". For quick_check misses: does the startup back the file up, and which tables' indexes.
// Run: node --import ./hooks.mjs p01b-sectors.mjs
import { readFileSync } from 'node:fs';
import { repo } from './hooks.mjs';

const db = await import(repo('packages/db/src/index.ts'));
const now = () => new Date('2026-10-12T05:00:00Z');
const good = new Uint8Array(readFileSync('C:/workspace/deep-review-1-6-r2/claude/B/data/load.db'));
const pageSize = (good[16] << 8) | good[17];
const sectors = good.length / 512;
let seed = 1017;
const rand = () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 2 ** 32);

async function classify(bytes) {
  let d;
  try {
    d = await db.openDatabase({ bytes, now });
  } catch (e) {
    return { open: `FAILS ${e.message}` };
  }
  try {
    const quick = d.quickCheck();
    if (quick.length) return { open: 'ok', quick };
    let integrity;
    try {
      integrity = (d.sqlite.exec('PRAGMA integrity_check')[0]?.values ?? []).map(([v]) => String(v));
    } catch (e) {
      integrity = [`THROWS ${e.message}`];
    }
    return { open: 'ok', quick: [], integrity: integrity.length === 1 && integrity[0] === 'ok' ? [] : integrity };
  } finally {
    d.sqlite.close();
  }
}

for (const fill of [0x00, 0xff]) {
  const tally = { openFails: 0, quickFlags: 0, quickOkIntegrityFlags: 0, bothOk: 0 };
  const indexes = {};
  for (let i = 0; i < 300; i++) {
    const bytes = new Uint8Array(good);
    const sector = pageSize / 512 + Math.floor(rand() * (sectors - pageSize / 512));
    bytes.fill(fill, sector * 512, sector * 512 + 512);
    const r = await classify(bytes);
    if (r.open !== 'ok') tally.openFails++;
    else if (r.quick.length) tally.quickFlags++;
    else if (r.integrity.length) {
      tally.quickOkIntegrityFlags++;
      for (const line of r.integrity) {
        const m = / index (\S+)/.exec(line);
        if (m) indexes[m[1]] = (indexes[m[1]] ?? 0) + 1;
      }
    } else tally.bothOk++;
  }
  console.log(`sector filled with 0x${fill.toString(16).padStart(2, '0')}: ${JSON.stringify(tally)}`);
  console.log(`  indexes named by integrity_check where quick_check said ok: ${JSON.stringify(indexes)}`);
}
```

#### `B\p02-openfrom.mjs`

```js
// P02 (gói B lượt 2, Claude): DR6-08 again. Round 1's L·CL-B2 probe (p1-migrate-last-save.mjs, laptop)
// replayed on the pinned code, then the same with a real old file: the round 2 load data written by the
// round 1 code (schema 9, from gói A lượt 2 p04a-make-db.mjs, file A\old-8855345-load.db).
// For every save after the backup: its schema version read WITHOUT migrating (sql.js directly).
// Run: node --import ./hooks.mjs p02-openfrom.mjs
import { readFileSync } from 'node:fs';
import { repo } from './hooks.mjs';

const { openAppData } = await import(repo('apps/desktop/src/data/app-data.ts'));
const db = await import(repo('packages/db/src/index.ts'));
const { calendarDate } = await import(repo('packages/domain/src/index.ts'));
const initSqlJs = (await import(repo('packages/db/node_modules/sql.js/dist/sql-wasm.js'))).default;
const SQL = await initSqlJs();
const versionOf = (bytes) => {
  if (bytes.byteLength === 0) return 'empty file';
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

async function run(label, older) {
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
  const source = await openAppData({ seed: (d) => db.createTeam(d, { name: 'x' }) });
  const preview = await app.readBackup((await source.exportBackup()).text);
  console.log(`\n--- ${label}: older file ${older.byteLength} B, schema version ${versionOf(older)}; LATEST_SCHEMA_VERSION ${db.LATEST_SCHEMA_VERSION}`);
  holding = true;
  const t = performance.now();
  const importing = app.importBackup({ ...preview, bytes: older });
  await backupStarted;
  const backedUp = saves.length;
  release();
  await importing;
  await app.saves.idle();
  const ms = performance.now() - t;
  const after = saves.slice(backedUp);
  console.log(`saves after the backup: ${after.length} (import + saves ${ms.toFixed(0)} ms)`);
  after.forEach((bytes, i) =>
    console.log(`  save #${i + 1}: schema version ${versionOf(bytes)}, ${bytes.byteLength} B, same bytes as older: ${Buffer.compare(Buffer.from(bytes), Buffer.from(older)) === 0}`),
  );
  console.log('in-memory db schemaVersion():', app.db().schemaVersion());
  console.log('LAST file on disk is migrated:', versionOf(saves.at(-1)) === db.LATEST_SCHEMA_VERSION);
  if (older.byteLength > 0) {
    const last = new SQL.Database(saves.at(-1));
    const count = (t) => last.exec(`SELECT count(*) FROM ${t}`)[0].values[0][0];
    console.log(`last save holds: ${count('customers')} customers, ${count('appointments')} appointments, ${count('people')} people; quick_check ${last.exec('PRAGMA quick_check')[0].values[0][0]}`);
    last.close();
  }
}

// Round 1's case exactly: a database from before every migration (sql.js exports it as 0 bytes).
await run('round 1 case (p1-migrate-last-save.mjs)', (await db.openDatabase({ migrations: [] })).export());
// A real file of an older schema with data: the round 2 load data written by the code of 8855345.
await run('the load data as the round 1 exe saved it (schema 9)', new Uint8Array(readFileSync('C:/workspace/deep-review-1-6-r2/claude/A/old-8855345-load.db')));
```

#### `B\p03-startup-msg.mjs`

```js
// P03 (gói B lượt 2, Claude): DR6-07 again. What the startup page and the save warning say for the
// errors Rust really sends at the pinned SHA (from rsprobe.log of this folder), through the app's own
// startupMessage / the save warning's choice. Round 1 Home PC startup-msg.mjs was the same with the
// old raw errors (H·CL-B1).
// Run: node --import ./hooks.mjs p03-startup-msg.mjs
import { repo } from './hooks.mjs';

const { startupMessage } = await import(repo('apps/desktop/src/shell/startup-error.ts'));
const { DISK_FULL } = await import(repo('apps/desktop/src/data/tauri-storage.ts'));
const { t } = await import(repo('apps/desktop/src/i18n/index.ts'));
const errors = {
  'project2c.db held without sharing (rsprobe lockedread: open)': 'FILE_IN_USE',
  'read-only project2c.lock (Rust test open_reports_a_data_folder_it_may_not_write_as_access_denied)': 'ACCESS_DENIED',
  'round 1 raw error of a held file (no longer sent)': 'The process cannot access the file because it is being used by another process. (os error 32)',
  'another exe': 'ALREADY_OPEN',
  'startup backup, `backups` is a file (rsprobe backupsfile)': Object.assign(new Error('STARTUP_BACKUP_FAILED'), {
    cause: 'Cannot create a file when that file already exists. (os error 183)',
  }),
  'startup backup, disk full': Object.assign(new Error('STARTUP_BACKUP_FAILED'), { cause: 'DISK_FULL' }),
  'damaged inside (p01 A)': Object.assign(new Error('DATA_DAMAGED'), { cause: 'database disk image is malformed' }),
};
for (const [label, error] of Object.entries(errors)) {
  console.log(`--- ${label}\n${JSON.stringify(startupMessage(error), null, 1)}`);
}
// SaveFailed picks its sentence by the error alone (SaveWarning.tsx:18).
const saveSentence = (error) => t(error === DISK_FULL ? 'storage.saveDiskFull' : 'storage.saveFailed');
for (const [label, error] of Object.entries({
  'save while another program holds project2c.db (rsprobe lockedread: save)': 'Access is denied. (os error 5)',
  'save over a read-only project2c.db (rsprobe readonly)': 'Access is denied. (os error 5)',
  'save on a full disk': 'DISK_FULL',
})) {
  console.log(`--- save warning, ${label}\n${saveSentence(error)}`);
}
console.log(`--- close dialog body (any failed save)\n${t('close.unsavedBody')}`);
```

#### `B\p04-migrate-covers.mjs`

```js
// P04 (gói B lượt 2, Claude): KNOWN #620 note 1 ("quickCheck runs on the MIGRATED database … look again
// when there is a new migration"). v1.0 brings two: 0009 builds three indexes, 0010 rebuilds `people`.
// The schema 9 file (round 2 load data saved by the round 1 code, gói A old-8855345-load.db) damaged in the
// pages 0010 drops (people's table / its autoindex), whole page or one byte: what quick_check says BEFORE
// the migration, whether the app's startup then refuses, or migrates the damage away and backs the
// damaged file (the bytes on disk) up as the newest copy.
// Run: node --import ./hooks.mjs p04-migrate-covers.mjs
import { readFileSync } from 'node:fs';
import { repo } from './hooks.mjs';

const db = await import(repo('packages/db/src/index.ts'));
const { openAppData, isDamagedDataError } = await import(repo('apps/desktop/src/data/app-data.ts'));
const { calendarDate } = await import(repo('packages/domain/src/index.ts'));
const now = () => new Date('2026-10-12T05:00:00Z');
const old = new Uint8Array(readFileSync('C:/workspace/deep-review-1-6-r2/claude/A/old-8855345-load.db'));
const pageSize = (old[16] << 8) | old[17];
const raw = await db.openDatabase({ bytes: new Uint8Array(old), now, migrations: [] }).catch(() => undefined);
// migrations: [] refuses a file of a newer schema: read sqlite_master with sql.js directly instead.
const initSqlJs = (await import(repo('packages/db/node_modules/sql.js/dist/sql-wasm.js'))).default;
const SQL = await initSqlJs();
const s = new SQL.Database(old);
const roots = Object.fromEntries(s.exec("SELECT name, rootpage FROM sqlite_master WHERE tbl_name = 'people'")[0].values);
const version = s.exec('SELECT max(id) FROM schema_migrations')[0].values[0][0];
s.close();
raw?.sqlite.close();
console.log(`old file ${old.length} B, schema ${version}, people pages: ${JSON.stringify(roots)}`);

const quickBefore = (bytes) => {
  const d = new SQL.Database(bytes);
  try {
    const rows = d.exec('PRAGMA quick_check')[0].values.map(([v]) => String(v));
    return rows.length === 1 && rows[0] === 'ok' ? 'ok' : rows.slice(0, 2).join(' | ');
  } catch (e) {
    return `THROWS ${e.message}`;
  } finally {
    d.close();
  }
};
async function startup(bytes) {
  const events = [];
  const storage = {
    load: async () => bytes,
    save: async () => void events.push('save'),
    backup: async () => (events.push('backup'), 'b.db'),
    writeExport: async () => 'x', latestBackup: async () => undefined, openFolder: async () => {},
  };
  try {
    const app = await openAppData({ storage, today: () => calendarDate(2026, 10, 12) });
    await app.saves.idle();
    return { started: true, events, quickAfter: app.db().quickCheck().slice(0, 1) };
  } catch (e) {
    await new Promise((r) => setTimeout(r, 0));
    return { started: false, damaged: isDamagedDataError(e), error: String(e.cause ?? e.message).slice(0, 100), events };
  }
}
for (const [name, root] of Object.entries(roots)) {
  for (const how of ['fill', 'byte']) {
    const bytes = new Uint8Array(old);
    const at = (root - 1) * pageSize;
    if (how === 'fill') bytes.fill(0x5a, at, at + pageSize);
    else bytes[at + pageSize - 40] ^= 0x01; // a byte near the end of the page: cell content
    console.log(JSON.stringify({ page: `${name} (page ${root})`, how, quickCheckBeforeMigration: quickBefore(bytes), startup: await startup(bytes) }));
  }
}
```

#### `B\mkfiles.mjs`

```js
// Files for the exe runs (gói B lượt 2, Claude), all from data\load.db (round 2 load data, schema 11):
//  data\page-damaged.db  — page 1 717 overwritten with 0x5a (p01 A: quick_check flags it)
//  data\index-damaged.db — one character of a customer id changed in index appointments_customer (p01 D)
// and prints the customer whose index entry changed.
import { readFileSync, writeFileSync } from 'node:fs';

const DATA = 'C:/workspace/deep-review-1-6-r2/claude/B/data';
const good = new Uint8Array(readFileSync(`${DATA}/load.db`));
const pageSize = (good[16] << 8) | good[17];

const page = new Uint8Array(good);
page.fill(0x5a, (1717 - 1) * pageSize, 1717 * pageSize);
writeFileSync(`${DATA}/page-damaged.db`, page);

// p01 D found customer 01K7C4NQACX14WV0691A24X2VK at byte 1 375 364 (page 336) of the index pages.
const customer = '01K7C4NQACX14WV0691A24X2VK';
const at = 1375364;
const text = new TextEncoder().encode(customer);
if (!text.every((b, k) => good[at + k] === b)) throw new Error('the id is not at that byte any more');
const index = new Uint8Array(good);
index[at + text.length - 1] += 1; // K → L
writeFileSync(`${DATA}/index-damaged.db`, index);
console.log(`page-damaged.db, index-damaged.db written; customer ${customer}`);
```

#### `B\rsprobe\src\main.rs`

```rust
// Gói B probe (deep review 6D, Claude): runs the exe's own `storage.rs` (read from the repo at the
// pinned SHA, not copied) outside Tauri, to time the file commands on the load data and to kill a
// process in the middle of a save / backup. Writes only under the folder it is given.
// Round 2 (r2\claude\B\rsprobe, copied from round 1 Home PC): adds `readonly`, `backupsfile`,
// `heldbackuptmp`, `holdfile` below; the round 1 commands are unchanged.
#![allow(dead_code)]
#[path = "C:/workspace/Project-2C-review/apps/desktop/src-tauri/src/storage.rs"]
mod storage;

use std::fs;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};

fn median(mut v: Vec<f64>) -> (f64, f64, f64) {
    v.sort_by(|a, b| a.partial_cmp(b).unwrap());
    (v[v.len() / 2], v[0], v[v.len() - 1])
}

struct Rng(u64);
impl Rng {
    fn next(&mut self) -> u64 {
        self.0 ^= self.0 << 13;
        self.0 ^= self.0 >> 7;
        self.0 ^= self.0 << 17;
        self.0
    }
}

fn fresh(dir: &Path) {
    let _ = fs::remove_dir_all(dir);
    fs::create_dir_all(dir).unwrap();
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let cmd = args[1].as_str();
    let dir = PathBuf::from(&args[2]);
    match cmd {
        "time" => time(&dir, &args[3], &args[4]),
        "saveloop" => save_loop(&dir, &args[3], &args[4]),
        "backuploop" => backup_loop(&dir, &args[3], &args[4]),
        "crash" => crash(&dir, &args[3], &args[4], args[5].parse().unwrap(), &args[6]),
        "holdlock" => {
            let lock = storage::DataLock::new();
            storage::open(&dir, "holder", &lock).unwrap();
            println!("holding");
            std::thread::sleep(Duration::from_secs(30));
        }
        "lockcheck" => lock_check(&dir),
        "denyread" => {
            // Another program holding project2c.db open without read sharing.
            use std::os::windows::fs::OpenOptionsExt;
            let _f = fs::OpenOptions::new()
                .read(true)
                .share_mode(0)
                .open(dir.join("project2c.db"))
                .unwrap();
            println!("holding");
            std::thread::sleep(Duration::from_secs(30));
        }
        "lockedread" => locked_read(&dir, &args[3]),
        "names" => names(&dir),
        "readonly" => read_only(&dir, &args[3]),
        "backupsfile" => backups_file(&dir, &args[3]),
        "heldbackuptmp" => held_backup_tmp(&dir, &args[3]),
        "holdfile" => {
            // Another program holding a file open without sharing, for 30 s.
            use std::os::windows::fs::OpenOptionsExt;
            let _f = fs::OpenOptions::new()
                .read(true)
                .share_mode(0)
                .open(&dir)
                .unwrap();
            println!("holding");
            std::thread::sleep(Duration::from_secs(30));
        }
        _ => panic!("unknown command"),
    }
}

fn shown<T: std::fmt::Debug>(r: &std::io::Result<T>) -> String {
    match r {
        Ok(v) => format!("Ok({v:?})"),
        Err(e) => format!(
            "Err(kind {:?}, raw {:?}, message {:?})",
            e.kind(),
            e.raw_os_error(),
            e.to_string()
        ),
    }
}

fn set_read_only(path: &Path, on: bool) -> std::io::Result<()> {
    let mut perms = fs::metadata(path)?.permissions();
    perms.set_readonly(on);
    fs::set_permissions(path, perms)
}

/// K2: `project2c.db` with the read-only attribute (copied from a read-only place, or `attrib +R`),
/// no lock file yet: what open, the startup backup and a save do.
fn read_only(dir: &Path, a: &str) {
    fresh(dir);
    fs::copy(a, dir.join("project2c.db")).unwrap();
    set_read_only(&dir.join("project2c.db"), true).unwrap();
    let lock = storage::DataLock::new();
    let opened = storage::open(dir, "p", &lock).map(|o| o.map(|v| v.len()));
    println!("open (first start of the process): {}", shown(&opened));
    let backup = storage::backup(dir, "20261017-080000", &lock);
    println!("startup backup: {}", shown(&backup));
    let bytes = fs::read(a).unwrap();
    let saved = storage::save(dir, &bytes, "p", &lock);
    println!("save over the read-only file: {}", shown(&saved));
    println!(
        "after the save: project2c.db read-only {:?}, project2c.db.tmp left {}",
        fs::metadata(dir.join("project2c.db")).map(|m| m.permissions().readonly()),
        dir.join("project2c.db.tmp").exists()
    );
    let _ = set_read_only(&dir.join("project2c.db"), false);
}

/// K3: `backups` is a file, not a folder: the startup backup.
fn backups_file(dir: &Path, a: &str) {
    fresh(dir);
    fs::copy(a, dir.join("project2c.db")).unwrap();
    fs::write(dir.join("backups"), b"not a folder").unwrap();
    let lock = storage::DataLock::new();
    let opened = storage::open(dir, "p", &lock).map(|o| o.map(|v| v.len()));
    println!("open with `backups` a file: {}", shown(&opened));
    println!(
        "startup backup: {}",
        shown(&storage::backup(dir, "20261017-080000", &lock))
    );
    println!("latest_backup: {:?}", storage::latest_backup(dir));
}

/// DR6-09 variant: the `.tmp` of a backup cut short, held by another program at the next start.
fn held_backup_tmp(dir: &Path, a: &str) {
    fresh(dir);
    fs::copy(a, dir.join("project2c.db")).unwrap();
    fs::create_dir_all(dir.join("backups")).unwrap();
    let tmp = dir
        .join("backups")
        .join("project2c-s00000003-20261017-080000.db.tmp");
    fs::write(&tmp, b"half a copy").unwrap();
    let mut child = Command::new(exe())
        .args(["holdfile", tmp.to_str().unwrap()])
        .stdout(Stdio::piped())
        .spawn()
        .unwrap();
    std::thread::sleep(Duration::from_millis(800));
    let lock = storage::DataLock::new();
    let opened = storage::open(dir, "p", &lock).map(|o| o.map(|v| v.len()));
    println!(
        "open while another program holds a backup .tmp: {} | .tmp still there {}",
        shown(&opened),
        tmp.exists()
    );
    println!(
        "backup meanwhile: {}",
        shown(&storage::backup(dir, "20261017-080001", &lock))
    );
    child.kill().unwrap();
    child.wait().unwrap();
    drop(lock);
    let lock2 = storage::DataLock::new();
    let again = storage::open(dir, "p2", &lock2).map(|o| o.map(|v| v.len()));
    println!(
        "next start once released: {} | .tmp still there {}",
        shown(&again),
        tmp.exists()
    );
}

fn exe() -> PathBuf {
    std::env::current_exe().unwrap()
}

fn time(dir: &Path, a: &str, b: &str) {
    let a = fs::read(a).unwrap();
    let b = fs::read(b).unwrap();
    fresh(dir);
    let lock = storage::DataLock::new();
    storage::open(dir, "p", &lock).unwrap();
    let mut saves = Vec::new();
    for i in 0..15 {
        let bytes = if i % 2 == 0 { &a } else { &b };
        let t = Instant::now();
        storage::save(dir, bytes, "p", &lock).unwrap();
        saves.push(t.elapsed().as_secs_f64() * 1000.0);
    }
    println!(
        "save {} B x15 (write + sync_all + rename): median/min/max ms {:?}",
        a.len(),
        median(saves)
    );
    let mut opens = Vec::new();
    for _ in 0..5 {
        let t = Instant::now();
        storage::open(dir, "p", &lock).unwrap();
        opens.push(t.elapsed().as_secs_f64() * 1000.0);
    }
    println!("open (read) x5: {:?}", median(opens));
    // Backups: first copy, an unchanged file (reuses the newest), then a changed file with 10
    // backups of the same size in the folder (the startup backup after a session of saves).
    let t = Instant::now();
    storage::backup(dir, "20261013-000000", &lock).unwrap();
    println!("backup, empty folder: {:.1} ms", t.elapsed().as_secs_f64() * 1000.0);
    let mut same = Vec::new();
    for _ in 0..5 {
        let t = Instant::now();
        storage::backup(dir, "20261013-000001", &lock).unwrap();
        same.push(t.elapsed().as_secs_f64() * 1000.0);
    }
    println!("backup, file unchanged (reuse): {:?}", median(same));
    // Fill to ten backups of the same size, each differing from `a` only near its end.
    for i in 0..10 {
        let mut c = a.clone();
        let n = c.len();
        c[n - 100 - i] ^= 0xff;
        storage::save(dir, &c, "p", &lock).unwrap();
        storage::backup(dir, &format!("20261013-0001{i:02}"), &lock).unwrap();
    }
    println!(
        "backups before the timed ones: {}",
        fs::read_dir(dir.join("backups")).unwrap().count()
    );
    let mut changed = Vec::new();
    for i in 0..5 {
        // A file that differs from every backup only near the end: worst case for find_copy.
        let mut c = a.clone();
        let n = c.len();
        c[n - 1 - i] ^= 0xff;
        storage::save(dir, &c, "p", &lock).unwrap();
        let t = Instant::now();
        storage::backup(dir, &format!("20261013-0002{i:02}"), &lock).unwrap();
        changed.push(t.elapsed().as_secs_f64() * 1000.0);
    }
    println!(
        "backup, file differing only at the end, 10 backups in folder: {:?}",
        median(changed)
    );
    let n = fs::read_dir(dir.join("backups")).unwrap().count();
    println!("files in backups after: {n}");
}

fn save_loop(dir: &Path, a: &str, b: &str) {
    let a = fs::read(a).unwrap();
    let b = fs::read(b).unwrap();
    let lock = storage::DataLock::new();
    storage::open(dir, "p", &lock).unwrap();
    let mut i = 0u64;
    loop {
        let bytes = if i % 2 == 0 { &a } else { &b };
        storage::save(dir, bytes, "p", &lock).unwrap();
        i += 1;
    }
}

fn backup_loop(dir: &Path, a: &str, b: &str) {
    let a = fs::read(a).unwrap();
    let b = fs::read(b).unwrap();
    let _ = b;
    let lock = storage::DataLock::new();
    storage::open(dir, "p", &lock).unwrap();
    // Each backup a new file (one byte near the end flipped at a fresh place), so every backup
    // writes: an unchanged file would only reuse its copy.
    let mut i = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos() as u64;
    loop {
        let mut c = a.clone();
        let n = c.len();
        c[n - 1 - (i % 4096) as usize] ^= 0xff;
        storage::save(dir, &c, "p", &lock).unwrap();
        storage::backup(dir, &storage::stamp(1_760_000_000 + (i % 100_000) as i64), &lock).unwrap();
        i += 1;
    }
}

/// A file `backup_loop` wrote: `a` with at most one byte changed near its end.
fn is_variant(bytes: &[u8], a: &[u8]) -> bool {
    bytes.len() == a.len() && bytes.iter().zip(a).filter(|(x, y)| x != y).count() <= 1
}

fn crash(dir: &Path, a: &str, b: &str, n: u32, mode: &str) {
    let ab = fs::read(a).unwrap();
    let bb = fs::read(b).unwrap();
    let seed = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos() as u64 | 1;
    let mut rng = Rng(seed);
    fresh(dir);
    let (mut ok_a, mut ok_b, mut bad, mut tmp_left, mut bad_backup, mut backup_tmp) =
        (0, 0, 0, 0, 0, 0);
    let mut first_start = 0;
    for round in 0..n {
        let child_cmd = if mode == "backup" { "backuploop" } else { "saveloop" };
        let mut child = Command::new(exe())
            .args([child_cmd, dir.to_str().unwrap(), a, b])
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .spawn()
            .unwrap();
        let wait = 80 + rng.next() % 900;
        std::thread::sleep(Duration::from_millis(wait));
        child.kill().unwrap();
        child.wait().unwrap();
        if dir.join("project2c.db.tmp").exists() {
            tmp_left += 1;
        }
        if let Ok(entries) = fs::read_dir(dir.join("backups")) {
            for e in entries.flatten() {
                let name = e.file_name().to_string_lossy().into_owned();
                if name.ends_with(".tmp") {
                    backup_tmp += 1;
                    continue;
                }
                let bytes = fs::read(e.path()).unwrap();
                let whole = if mode == "backup" {
                    is_variant(&bytes, &ab)
                } else {
                    bytes == ab || bytes == bb
                };
                if !whole {
                    bad_backup += 1;
                    println!("round {round}: backup {name} is neither file ({} B)", bytes.len());
                }
            }
        }
        // Next start: the app's own open (fresh lock: a new process).
        let lock = storage::DataLock::new();
        match storage::open(dir, "next", &lock) {
            Ok(Some(bytes)) if bytes == ab => ok_a += 1,
            Ok(Some(bytes)) if bytes == bb => ok_b += 1,
            Ok(Some(bytes)) if mode == "backup" && is_variant(&bytes, &ab) => ok_a += 1,
            Ok(None) => first_start += 1,
            other => {
                bad += 1;
                println!(
                    "round {round} after {wait} ms: open gave {:?}",
                    other.map(|o| o.map(|v| v.len()))
                );
            }
        }
        drop(lock);
    }
    let backups: Vec<String> = fs::read_dir(dir.join("backups"))
        .map(|r| {
            r.flatten()
                .map(|e| e.file_name().to_string_lossy().into_owned())
                .collect()
        })
        .unwrap_or_default();
    let tmps: Vec<&String> = backups.iter().filter(|n| n.ends_with(".tmp")).collect();
    println!(
        "mode {mode}: {n} kills; next open gave file A {ok_a}, file B {ok_b}, no file yet {first_start}, other {bad}; \
project2c.db.tmp seen before reopen {tmp_left} times; backups not equal to A or B: {bad_backup}; \
.tmp seen in backups (summed over rounds): {backup_tmp}; backups folder at the end: {} entries, .tmp among them {:?}",
        backups.len(),
        tmps
    );
}

fn lock_check(dir: &Path) {
    fresh(dir);
    let mut child = Command::new(exe())
        .args(["holdlock", dir.to_str().unwrap()])
        .stdout(Stdio::piped())
        .spawn()
        .unwrap();
    std::thread::sleep(Duration::from_millis(800));
    let lock = storage::DataLock::new();
    let r = storage::open(dir, "second", &lock);
    println!(
        "second process open while the first holds the lock: {:?}",
        r.as_ref()
            .map(|o| o.as_ref().map(Vec::len))
            .map_err(|e| (e.kind(), e.to_string()))
    );
    child.kill().unwrap();
    child.wait().unwrap();
    let lock2 = storage::DataLock::new();
    let r2 = storage::open(dir, "third", &lock2);
    println!(
        "open after the first process was killed: {:?}",
        r2.as_ref()
            .map(|o| o.as_ref().map(Vec::len))
            .map_err(|e| (e.kind(), e.to_string()))
    );
}

fn locked_read(dir: &Path, a: &str) {
    fresh(dir);
    fs::copy(a, dir.join("project2c.db")).unwrap();
    let lock0 = storage::DataLock::new();
    storage::open(dir, "p", &lock0).unwrap();
    storage::backup(dir, "20261013-000000", &lock0).unwrap();
    drop(lock0);
    let mut child = Command::new(exe())
        .args(["denyread", dir.to_str().unwrap()])
        .stdout(Stdio::piped())
        .spawn()
        .unwrap();
    std::thread::sleep(Duration::from_millis(800));
    let lock = storage::DataLock::new();
    let r = storage::open(dir, "p2", &lock);
    println!(
        "open while another program holds project2c.db without read sharing: {:?}",
        r.as_ref()
            .map(|o| o.as_ref().map(Vec::len))
            .map_err(|e| (e.kind(), e.raw_os_error(), e.to_string()))
    );
    let s = storage::save(dir, &[1, 2, 3], "p2", &lock);
    println!(
        "save meanwhile: {:?}",
        s.map_err(|e| (e.kind(), e.raw_os_error(), e.to_string()))
    );
    child.kill().unwrap();
    child.wait().unwrap();
}

fn names(dir: &Path) {
    fresh(dir);
    for name in [
        "CON.xlsx",
        "nul.p2cbackup",
        "AUX.xlsx",
        "COM1.p2cbackup",
        "LPT1.xlsx",
        "a.xlsx",
        "x..xlsx",
    ] {
        let r = storage::write_export(dir, name, b"data");
        let listed: Vec<String> = fs::read_dir(dir.join("exports"))
            .unwrap()
            .flatten()
            .map(|e| e.file_name().to_string_lossy().into_owned())
            .collect();
        println!(
            "{name:>16}: {:?} | exports now {:?}",
            r.map_err(|e| e.to_string()),
            listed
        );
    }
}
```

#### `B\crate-probe-ai.rs`

```rust

// ---- Round 2 probe (gói B, Claude), appended to the COPY of ai.rs in r2\claude\B\crate only ----
#[cfg(test)]
mod probe_r2 {
    use super::*;

    const KEY: &str = "sk-test-SECRET-0123456789";
    const SESSION: &str = "0f3a9c1d-77be-4e21-a0c4-5d2e8b6f9a10";

    fn escaped(text: &str) -> String {
        text.chars().map(|c| format!("\\u{:04x}", u32::from(c))).collect()
    }
    fn percent(text: &str) -> String {
        text.bytes().map(|b| format!("%{b:02X}")).collect()
    }
    /// A 2xx whose `content` is the JSON text `{"note":"<note>"}`, `note` written as it is.
    fn answer(note: &str) -> Vec<u8> {
        let content = format!(r#"{{"note":"{note}"}}"#);
        serde_json::json!({ "choices": [{ "message": { "content": content } }] })
            .to_string()
            .into_bytes()
    }
    /// What `JSON.parse(content).note` gives the webview, as `serde_json` reads it.
    fn webview_note(body: &[u8]) -> String {
        let reply: Value = serde_json::from_slice(body).unwrap();
        let content = reply["choices"][0]["message"]["content"].as_str().unwrap();
        let parsed: Value = serde_json::from_str(content).unwrap();
        parsed["note"].as_str().unwrap().to_owned()
    }
    /// Undoes one more layer of JSON (`\uXXXX`) or of a URL (`%XX`) on the webview's text, as anyone
    /// holding the backup could.
    fn json_once(text: &str) -> String {
        serde_json::from_str::<String>(&format!("\"{text}\"")).unwrap_or_default()
    }
    fn url_once(text: &str) -> String {
        let bytes = text.as_bytes();
        let mut out = Vec::new();
        let mut i = 0;
        while i < bytes.len() {
            if bytes[i] == b'%' && i + 2 < bytes.len() {
                if let Ok(b) = u8::from_str_radix(&text[i + 1..i + 3], 16) {
                    out.push(b);
                    i += 3;
                    continue;
                }
            }
            out.push(bytes[i]);
            i += 1;
        }
        String::from_utf8_lossy(&out).into_owned()
    }

    #[test]
    fn probe_r2_key_variants() {
        let cases: Vec<(&str, String)> = vec![
            ("DR6-10 case: URL-encoded, each % as \\u0025 (JSON then URL)", percent(KEY).replace('%', "\\u0025")),
            ("DR6-10 case: JSON escapes, each \\ as %5C (URL then JSON)", escaped(KEY).replace('\\', "%5C")),
            ("two JSON layers: each \\ escaped as \\\\ (test pins it as fine)", escaped(KEY).replace('\\', "\\\\")),
            ("two JSON layers: each \\ as \\u005C (test pins it as fine)", escaped(KEY).replace('\\', "\\u005C")),
            ("two URL layers: each % as %25", percent(KEY).replace('%', "%25")),
            ("one URL layer, lower and upper hex mixed", percent(KEY).to_lowercase()),
            ("JSON then URL then JSON (three layers)", percent(KEY).replace('%', "\\u0025").replace('\\', "%5C")),
        ];
        for (label, note) in cases {
            let body = answer(&note);
            let result = reply(200, &body, KEY, SESSION);
            let seen = webview_note(&body);
            let one_more_json = json_once(&seen);
            let one_more_url = url_once(&seen);
            println!(
                "PROBE 2xx | {label} | reply: {} | webview text: {} | +1 JSON decode is the key: {} | +1 URL decode is the key: {} | +2 URL decodes: {}",
                match &result { Ok(_) => "Ok (passed to the webview)".to_owned(), Err(e) => e.code.to_owned() },
                &seen.chars().take(40).collect::<String>(),
                one_more_json.contains(KEY),
                one_more_url.contains(KEY),
                url_once(&one_more_url).contains(KEY),
            );
            let error = serde_json::json!({ "error": { "message": format!("bad {note}!") } });
            let masked = reply(401, error.to_string().as_bytes(), KEY, SESSION).unwrap_err().message.unwrap_or_default();
            println!("PROBE 401 | {label} | message to the webview: {}", masked.chars().take(60).collect::<String>());
        }
    }

    #[test]
    fn probe_r2_models_of_the_app_pass_check() {
        // `AI_MODELS` of packages/ai/src/models.ts at the pinned SHA.
        let request = |model: &str| Request {
            session_id: SESSION.into(),
            plan: "GO".into(),
            model: model.into(),
            reasoning: None,
            messages: vec![Message { role: "user".into(), content: "x".into() }],
            max_tokens: 1,
        };
        for model in ["glm-5.3", "kimi-k3", "deepseek-v4.1-flash", "qwen3.5+", "claude@opus", "glm 5.3"] {
            println!("PROBE model {model:?}: {:?}", check(&request(model)).map(|_| "ok").map_err(|e| e.code));
        }
    }

    #[test]
    fn probe_r2_reveals_and_mask_cost() {
        // Debug build: an upper bound of what the release exe spends (PR #617: 16 ms / 128 KB, 0.26 s / 2 MB).
        for size in [128 * 1024, 2 * 1024 * 1024] {
            let text: String = "Khách hàng cân nhắc \\u0041 50% {\"x\":1} ".chars().cycle().take(size).collect();
            let t = std::time::Instant::now();
            let found = reveals(&text, KEY);
            let reveal_ms = t.elapsed().as_secs_f64() * 1000.0;
            let t = std::time::Instant::now();
            let masked = mask(&text, KEY);
            let mask_ms = t.elapsed().as_secs_f64() * 1000.0;
            println!("PROBE cost {size} chars: reveals {reveal_ms:.0} ms ({found}), mask {mask_ms:.0} ms ({} chars)", masked.len());
        }
    }
}
```

#### `B\oskind.rs`

```rust
fn main() { for code in [39, 112, 1295, 5, 32, 33, 183] { println!("os error {code}: {:?}", std::io::Error::from_raw_os_error(code).kind()); } }
```

#### `B\mut.mjs`

```js
// Mutation runner (gói B lượt 2, Claude), from round 1 Home PC mutate.mjs. Each mutant patches ONE file
// of the review worktree, runs the tests that cover it, then writes the file back byte for byte and
// checks its sha256 against `git show HEAD:<file>` before and after (prompt rule 1). Refuses to start
// unless `git status --short` is empty. No probe of this folder runs while it does.
// - JS / config mutants: vitest on the listed files with --bail=1; a survivor runs again against the whole
//   vitest suite, so SURVIVED means no unit test of the repo kills it.
// - Rust mutants: `cargo test --lib --locked --offline` of src-tauri (every Rust test).
//   node mut.mjs [--check] [ID…]
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';

const REPO = 'C:/workspace/Project-2C-review';
const HERE = 'C:/workspace/deep-review-1-6-r2/claude/B';
const LOG = `${HERE}/mut.log`;
const D = 'apps/desktop/src/data/';
const S = 'apps/desktop/src/shell/';
const RS = 'apps/desktop/src-tauri/src/';
const T = 'apps/desktop/src-tauri/';
const JS_TESTS = ['apps/desktop/src', 'packages/db/src/database.test.ts'];

/** [id, DR6, what, file, from, to] — `from` must occur exactly once. */
const M = [
  // ---- DR6-06: refuse a damaged file ----
  ['G06a', '06', 'openAppData no longer runs quickCheck', D + 'app-data.ts',
    '    const [damage] = db.quickCheck();\n    if (damage !== undefined) throw new Error(DATA_DAMAGED, { cause: damage });\n', ''],
  ['G06b', '06', 'quickCheck reports nothing ever', 'packages/db/src/database.ts',
    "return found.length === 1 && found[0] === 'ok' ? [] : found;", 'return [];'],
  ['G06c', '06', 'a check that throws reads as no damage', 'packages/db/src/database.ts',
    'return [error instanceof Error ? error.message : String(error)];', 'return [];'],
  ['G06d', '06', 'the startup page says "cannot open" for a damaged file', S + 'startup-error.ts',
    'if (isDamagedDataError(error)) {', 'if (false) {'],
  // ---- DR6-07: whole file out of reach, disk full on save ----
  ['G07a', '07', 'a held project2c.db keeps its raw OS error', RS + 'storage.rs',
    'Err(error) => return Err(out_of_reach(error)),', 'Err(error) => return Err(error),'],
  ['G07b', '07', 'a read-only lock file keeps its raw OS error', RS + 'storage.rs',
    'held.file = Some(open_lock_file(&dir.join(LOCK_FILE)).map_err(out_of_reach)?);', 'held.file = Some(open_lock_file(&dir.join(LOCK_FILE))?);'],
  ['G07c', '07', 'a held project2c.db.tmp keeps its raw OS error', RS + 'storage.rs',
    'remove_if_exists(&dir.join(tmp_name(DB_FILE))).map_err(out_of_reach)?;', 'remove_if_exists(&dir.join(tmp_name(DB_FILE)))?;'],
  ['G07d', '07', 'a data folder that cannot be created keeps its raw OS error', RS + 'storage.rs',
    'fs::create_dir_all(dir).map_err(out_of_reach)?;', 'fs::create_dir_all(dir)?;'],
  ['G07e', '07', 'only os error 32 is "in use", not 33', RS + 'storage.rs',
    'if matches!(error.raw_os_error(), Some(32 | 33)) {', 'if matches!(error.raw_os_error(), Some(32)) {'],
  ['G07f', '07', 'a save on a full disk keeps its raw error', RS + 'storage.rs',
    'write_atomic_with(dir, DB_FILE, bytes, flush).map_err(disk_full)', 'write_atomic_with(dir, DB_FILE, bytes, flush)'],
  ['G07g', '07', 'the startup page says "cannot open" for FILE_IN_USE', S + 'startup-error.ts',
    'if (error === FILE_IN_USE) {', 'if (false) {'],
  ['G07h', '07', 'the startup page says "cannot open" for ACCESS_DENIED', S + 'startup-error.ts',
    'if (error === ACCESS_DENIED) {', 'if (false) {'],
  ['G07i', '07', 'the save warning has one sentence for every cause', S + 'SaveWarning.tsx',
    "t(error === DISK_FULL ? 'storage.saveDiskFull' : 'storage.saveFailed')", "t('storage.saveFailed')"],
  ['G07j', '07', 'saveError never cleared after a save that worked', D + 'app-data.ts',
    '    setSaveError(undefined);\n', ''],
  ['G07k', '07', 'saveError never set', D + 'app-data.ts',
    '      setSaveError(error);\n', ''],
  // ---- DR6-08 ----
  ['G08', '08', 'openFrom saves the bytes it opened', D + 'app-data.ts',
    'if (storage) saves.persist(db.export());', 'if (storage) saves.persist(bytes);'],
  // ---- DR6-09 ----
  ['G09a', '09', 'the first open leaves the .tmp of a backup cut short', RS + 'storage.rs',
    '        remove_interrupted_backups(&dir.join(BACKUP_DIR));\n', ''],
  ['G09b', '09', 'the first open removes every .tmp of backups\\', RS + 'storage.rs',
    'let left = name.strip_suffix(".tmp").and_then(backup_seq).is_some();', 'let left = name.ends_with(".tmp");'],
  // ---- DR6-10 ----
  ['G10a', '10', 'no JSON-then-URL reading', RS + 'ai.rs',
    'Box::new(unescape(unescape(chars(), Escapes::Json), Escapes::Url)),', 'Box::new(chars()),'],
  ['G10b', '10', 'no URL-then-JSON reading', RS + 'ai.rs',
    'Box::new(unescape(unescape(chars(), Escapes::Url), Escapes::Json)),', 'Box::new(chars()),'],
  ['G10c', '10', 'mask does not merge the readings of one secret', RS + 'ai.rs',
    '        if span.start >= copied {', '        if true {'],
  ['G10d', '10', 'one pass undoes JSON escapes only (round 1 RA7-like)', RS + 'ai.rs',
    "('%', _) if url => hex(1, 2).map(|c| (c, 3)),", "('%', _) if false => hex(1, 2).map(|c| (c, 3)),"],
  // ---- DR6-11 ----
  ['G11a', '11', 'a model name of 129 characters', RS + 'ai.rs',
    'const MAX_MODEL_CHARS: usize = 128;', 'const MAX_MODEL_CHARS: usize = 129;'],
  ['G11b', '11', 'a model name may hold a space', RS + 'ai.rs',
    'b"-._:/".contains(&byte)', 'b"-._:/ ".contains(&byte)'],
  // ---- DR6-12…14 (contract test) ----
  ['G12', '12', 'tauri.conf.json back to 0.1.0', T + 'tauri.conf.json',
    '"version": "1.0.0",', '"version": "0.1.0",'],
  ['G13', '13', 'crate-type back to the three of the template', T + 'Cargo.toml',
    'crate-type = ["rlib"]', 'crate-type = ["staticlib", "cdylib", "rlib"]'],
  ['G14a', '14', 'core:default back in the capability', T + 'capabilities/default.json',
    '"core:event:allow-listen",', '"core:default",\n    "core:event:allow-listen",'],
  ['G14b', '14', "CSP without base-uri 'none'", T + 'tauri.conf.json',
    "; base-uri 'none'", ''],
  // ---- DR6-60 (round 1 survivors in the Issues) ----
  ['G60a', '60', 'RS4 / R8: export names may start with a dot', RS + 'storage.rs',
    "        && !name.starts_with('.')\n", ''],
  ['G60b', '60', 'RS9 / R7: a longer backup with the same start counts as a copy', RS + 'storage.rs',
    '    if file.metadata()?.len() != bytes.len() as u64 {\n        return Ok(false);\n    }\n', ''],
  ['G60c', '60', 'RS7 / R4: no flush before the rename', RS + 'storage.rs',
    '        flush(&file)?;\n', ''],
  ['G60d', '60', 'A14: busy taken before the arguments are checked', RS + 'ai.rs',
    '    let url = check(request)?;\n    let _running = busy.start()?;', '    let _running = busy.start()?;\n    let url = check(request)?;'],
  ['G60e', '60', 'MJ15: the read backup database is never closed', D + 'app-data.ts',
    '        imported.db.sqlite.close();\n', ''],
  // ---- round 1 survivors outside the Issues (re-checked) ----
  ['R1-J5', '—', 'J5 / MJ9: replaced database closed before the screens re-render', D + 'app-data.ts',
    '    await new Promise((resolve) => setTimeout(resolve, 0));\n    previous.sqlite.close();', '    previous.sqlite.close();'],
  ['R1-MJ30', '—', 'MJ30: useQuery does not re-read after a change', D + 'AppDataContext.tsx',
    '  return useMemo(() => read(data.db()), [data, read, revision]);', '  return useMemo(() => read(data.db()), [data, read]);'],
];

const git = (...args) => execFileSync('git', ['-C', REPO, ...args], { encoding: 'utf8' });
const sha = (text) => createHash('sha256').update(text).digest('hex');
const log = (line) => {
  appendFileSync(LOG, `${line}\n`);
  console.log(line);
};
if (process.argv[2] === '--check') {
  for (const [id, , , file, from] of M) {
    const count = git('show', `HEAD:${file}`).split(from).length - 1;
    if (count !== 1) console.log(`${id}: pattern found ${count}×`);
  }
  console.log(`${M.length} mutants checked`);
  process.exit(0);
}
if (git('status', '--short') !== '') throw new Error('worktree not clean, not starting');
const env = { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' };
const vitest = (paths, bail) =>
  spawnSync(process.execPath, ['node_modules/vitest/vitest.mjs', 'run', ...(bail ? ['--bail=1'] : []), ...paths], {
    cwd: REPO, encoding: 'utf8', timeout: 900_000, env,
  });
const cargoTest = () =>
  spawnSync('cargo', ['test', '--manifest-path', 'apps/desktop/src-tauri/Cargo.toml', '--lib', '--locked', '--offline'], {
    cwd: REPO, encoding: 'utf8', timeout: 900_000, env,
  });
const jsKillers = (out) =>
  [...new Set([...out.matchAll(/FAIL\s+(\S+\.test\.tsx?) > ([^\n]+)/g)].map((m) => `${m[1]} > ${m[2].trim()}`))]
    .slice(0, 2)
    .join(' | ');
const rsKillers = (out) => {
  if (/error(\[E\d+\])?:/.test(out) && !/test result/.test(out)) return `does not compile: ${/error[^\n]*/.exec(out)?.[0]}`;
  return [...out.matchAll(/^---- (\S+) stdout ----/gm)].map((m) => m[1]).slice(0, 3).join(' | ');
};

const only = process.argv.slice(2);
log(`--- run ${new Date().toISOString()} (${only.length ? only.join(' ') : 'all'})`);
for (const [id, dr6, what, file, from, to] of M) {
  if (only.length && !only.includes(id)) continue;
  const path = `${REPO}/${file}`;
  const original = readFileSync(path, 'utf8');
  const head = git('show', `HEAD:${file}`);
  if (sha(original) !== sha(head)) throw new Error(`${file} differs from HEAD before ${id}`);
  const count = original.split(from).length - 1;
  if (count !== 1) {
    log(`${id} | DR6-${dr6} | ${what} | NOT APPLIED (pattern found ${count}×)`);
    continue;
  }
  const t0 = Date.now();
  let verdict;
  try {
    writeFileSync(path, original.replace(from, to));
    if (file.endsWith('.rs')) {
      const run = cargoTest();
      const out = `${run.stdout}\n${run.stderr}`;
      const summary = /test result: [^\n]*/.exec(out)?.[0] ?? '';
      verdict = run.status === 0 ? `SURVIVED — ${summary}` : `KILLED — ${summary} — ${rsKillers(out)}`;
    } else {
      let run = vitest(JS_TESTS, true);
      let out = `${run.stdout}\n${run.stderr}`;
      if (run.status !== 0) {
        verdict = `KILLED — ${/Tests\s+[^\n]*/.exec(out)?.[0]?.trim() ?? ''} — ${jsKillers(out)}`;
      } else {
        run = vitest([], false);
        out = `${run.stdout}\n${run.stderr}`;
        verdict = run.status === 0
          ? `SURVIVED — apps/desktop/src + database.test.ts and the whole vitest suite: ${/Tests\s+[^\n]*/.exec(out)?.[0]?.trim() ?? '?'}`
          : `KILLED only outside apps/desktop/src — ${jsKillers(out)}`;
      }
    }
  } finally {
    writeFileSync(path, original);
  }
  if (sha(readFileSync(path, 'utf8')) !== sha(head)) throw new Error(`could not restore ${file}`);
  log(`${id} | DR6-${dr6} | ${what} | ${verdict} (${Math.round((Date.now() - t0) / 1000)} s)`);
}
log(`git status --short after: ${JSON.stringify(git('status', '--short'))}`);
```

#### `B\exe-lib.mjs`

```js
// Exe probe helpers (gói B lượt 2, Claude). Starts a COPY of common\exe\project2c.exe in a folder of its
// own under r2\claude\B\exe\, with its own WebView2 profile and debug port 9338 (not 9222), DNS for any
// host but local ones refused at the browser (--host-resolver-rules), `window.open` replaced at once.
// Never clicks a ChatGPT / AI key button. Only writes under r2\claude\B\exe\.
import { spawn, execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { chromium } from 'file:///C:/workspace/Project-2C-review/node_modules/@playwright/test/index.mjs';

export const EXE_SRC = 'C:/workspace/deep-review-1-6-r2/common/exe/project2c.exe';
export const ROOT = 'C:/workspace/deep-review-1-6-r2/claude/B/exe';
export const PORT = 9338;
const LOCAL = /^(https?:\/\/(127\.0\.0\.1|localhost|tauri\.localhost|ipc\.localhost)(:\d+)?\/|ipc:|data:|blob:|about:)/;

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** A fresh folder `name` with the exe; `setup(dataDir)` prepares Project2C-data before the start. */
export function prepare(name, setup) {
  const dir = `${ROOT}/${name}`;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(`${dir}/Project2C-data`, { recursive: true });
  copyFileSync(EXE_SRC, `${dir}/project2c.exe`);
  setup?.(`${dir}/Project2C-data`);
  return dir;
}

/** Starts the exe of `dir`; resolves once its window answers on the debug port, with the page. */
export async function start(dir, { waitMs = 0, route = true, port = PORT, profile = 'wv2' } = {}) {
  const env = {
    ...process.env,
    WEBVIEW2_USER_DATA_FOLDER: `${dir}/${profile}`.replaceAll('/', '\\'),
    WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${port} --host-resolver-rules="MAP * ~NOTFOUND, EXCLUDE 127.0.0.1, EXCLUDE localhost, EXCLUDE tauri.localhost, EXCLUDE ipc.localhost"`,
  };
  const startedAt = Date.now();
  const child = spawn(`${dir}/project2c.exe`.replaceAll('/', '\\'), [], { env, detached: false, stdio: 'ignore' });
  if (waitMs) await sleep(waitMs);
  let browser;
  for (let i = 0; i < 100 && !browser; i++) {
    try {
      browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`, { timeout: 2_000 });
    } catch {
      await sleep(200);
    }
  }
  if (!browser) throw new Error('no debug port');
  let page;
  for (let i = 0; i < 100 && !page; i++) {
    page = browser.contexts().flatMap((c) => c.pages()).find((p) => p.url().startsWith('http://tauri.localhost/'));
    if (!page) await sleep(100);
  }
  if (!page) throw new Error('no exe page');
  await guard(page, route);
  return { child, browser, page, startedAt };
}

/**
 * No network but local hosts (the browser's DNS rules, and a route that aborts the rest unless a
 * timing run asks for none); `window.open` does nothing (rule 2 of the prompt).
 */
export async function guard(page, route = true) {
  if (route) await page.context().route((url) => !LOCAL.test(url.href), (r) => r.abort());
  await page.addInitScript(() => {
    window.open = () => null;
  });
  await page.evaluate(() => {
    window.open = () => null;
  });
}

/** Asks the exe window to close as its X button does (WM_CLOSE). */
export function closeWindow(pid) {
  execFileSync('powershell', ['-NoProfile', '-Command', `(Get-Process -Id ${pid}).CloseMainWindow() | Out-Null`]);
}

export async function waitExit(child, ms = 15_000) {
  const t = Date.now();
  while (child.exitCode === null && Date.now() - t < ms) await sleep(100);
  return child.exitCode;
}

export function kill(child) {
  try {
    execFileSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
  } catch {
    // gone already
  }
}

export const exists = existsSync;
```

#### `B\exe-e1.mjs`

```js
// E1 (gói B lượt 2, Claude): DR6-14 on the exe release (copy of common\exe\project2c.exe, first start in a
// fresh folder): commands the old `core:default` gave and the app does not use; the CSP's base-uri /
// form-action / connect-src; Xuất backup; Mở thư mục; closing the window with a save that failed
// (CloseGuard: listen + destroy) and with nothing pending. Run: node e1… (writes under r2\claude\B\exe\).
import { execFileSync, spawn } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { prepare, start, closeWindow, waitExit, kill, sleep } from './exe-lib.mjs';

const RSPROBE = 'C:/workspace/deep-review-1-6-r2/claude/B/rsprobe/target/release/rsprobe.exe';
const dir = prepare('e1-fresh');
const data = `${dir}/Project2C-data`;
let run = await start(dir);
const { page } = run;
await page.waitForFunction(() => performance.getEntriesByName('p2c:data-open', 'mark').length > 0, null, { timeout: 60_000 });
console.log('first start: data open at', await page.evaluate(() => Math.round(performance.getEntriesByName('p2c:data-open', 'mark')[0].startTime)), 'ms');

// 1. Commands: what the capability still lets through.
const commands = await page.evaluate(async () => {
  const invoke = window.__TAURI_INTERNALS__.invoke;
  const tries = [
    ['plugin:window|title', { label: 'main' }],
    ['plugin:window|set_title', { label: 'main', value: 'X' }],
    ['plugin:window|is_maximized', { label: 'main' }],
    ['plugin:app|version', {}],
    ['plugin:event|emit', { event: 'p2c-probe', payload: null }],
    ['plugin:webview|get_all_webviews', {}],
    ['plugin:image|from_path', { path: 'C:\\Windows\\win.ini' }],
    ['plugin:path|resolve_directory', { directory: 1 }],
    ['plugin:menu|new', { kind: 'Menu', options: {} }],
    ['plugin:event|listen', { event: 'p2c-probe', target: { kind: 'Any' }, handler: 0 }],
    ['db_latest_backup', {}],
  ];
  const out = {};
  for (const [cmd, args] of tries) {
    try {
      out[cmd] = `ALLOWED → ${JSON.stringify(await invoke(cmd, args)).slice(0, 60)}`;
    } catch (e) {
      out[cmd] = `refused → ${String(e).slice(0, 110)}`;
    }
  }
  return out;
});
for (const [cmd, r] of Object.entries(commands)) console.log(`command ${cmd}: ${r}`);

// 2. The CSP the page runs under.
const csp = await page.evaluate(async () => {
  const violations = [];
  document.addEventListener('securitypolicyviolation', (e) =>
    violations.push(`${e.violatedDirective} blocked ${e.blockedURI || '(inline)'}`),
  );
  const before = document.baseURI;
  const base = document.createElement('base');
  base.href = 'http://127.0.0.1:9/';
  document.head.appendChild(base);
  const after = document.baseURI;
  base.remove();
  const form = document.createElement('form');
  form.action = 'http://127.0.0.1:9/x';
  form.method = 'post';
  document.body.appendChild(form);
  form.submit();
  form.remove();
  let fetched;
  try {
    await fetch('http://127.0.0.1:9/');
    fetched = 'fetch went out';
  } catch (e) {
    fetched = `fetch refused (${e.name})`;
  }
  await new Promise((r) => setTimeout(r, 800));
  return { baseBefore: before, baseAfter: after, fetched, stillOnApp: location.href, violations };
});
console.log('CSP:', JSON.stringify(csp, null, 1));

// 3. Xuất backup, then Mở thư mục of exports\.
await page.evaluate(() => (location.hash = '#/settings'));
await page.getByRole('button', { name: 'Xuất backup' }).click();
await page.getByRole('status').filter({ hasText: 'Đã xuất backup' }).waitFor({ timeout: 30_000 });
console.log('export:', (await page.getByRole('status').filter({ hasText: 'Đã xuất backup' }).textContent()).trim());
console.log('exports\\ now:', readdirSync(`${data}/exports`));
const explorerWindows = () =>
  Number(execFileSync('powershell', ['-NoProfile', '-Command', '(New-Object -ComObject Shell.Application).Windows().Count'], { encoding: 'utf8' }).trim());
const windowsBefore = explorerWindows();
const open = page.getByRole('button', { name: 'Mở thư mục' });
console.log('"Mở thư mục" buttons:', await open.count());
await open.first().click();
await sleep(2_500);
const windowsAfter = explorerWindows();
console.log(`Explorer windows before ${windowsBefore}, after ${windowsAfter}; folder error shown: ${await page.getByText('Không mở được thư mục.').count()}`);
// Close the Explorer window the click opened (the one showing this probe's folder).
execFileSync('powershell', ['-NoProfile', '-Command', `$w = (New-Object -ComObject Shell.Application).Windows() | Where-Object { $_.LocationURL -like '*e1-fresh*' }; foreach ($x in $w) { $x.LocationURL; $x.Quit() }`], { stdio: 'inherit' });

// 4. A save that fails, then closing the window: CloseGuard asks; released, Thử lại saves and closes.
const holder = spawn(RSPROBE, ['denyread', data.replaceAll('/', '\\')], { stdio: 'ignore' });
await sleep(1_000);
await page.evaluate(() => (location.hash = '#/team'));
await page.getByRole('button', { name: '+ Team' }).click();
await page.getByRole('dialog').getByLabel('Tên team').fill('Team E1 thử đóng');
await page.getByRole('dialog').getByRole('button', { name: 'Tạo team' }).click();
const alert = page.getByRole('alert');
await alert.waitFor({ timeout: 15_000 });
console.log('save warning while held:', (await alert.textContent()).trim());
closeWindow(run.child.pid);
const dialog = page.getByRole('dialog');
await dialog.waitFor({ timeout: 10_000 });
console.log('close dialog:', (await dialog.textContent()).trim().slice(0, 200));
kill(holder);
await sleep(500);
await dialog.getByRole('button', { name: 'Thử lại' }).click();
console.log('exit code after Thử lại:', await waitExit(run.child));
await run.browser.close().catch(() => {});

// 5. Start again: the team is there; close with nothing pending closes at once.
run = await start(dir);
await run.page.waitForFunction(() => performance.getEntriesByName('p2c:data-open', 'mark').length > 0, null, { timeout: 60_000 });
await run.page.evaluate(() => (location.hash = '#/team'));
await sleep(800);
console.log('after restart, team kept:', await run.page.getByText('Team E1 thử đóng').count() > 0);
console.log('backups\\:', readdirSync(`${data}/backups`));
const t = Date.now();
closeWindow(run.child.pid);
console.log('close with nothing pending: exit code', await waitExit(run.child), 'after', Date.now() - t, 'ms');
await run.browser.close().catch(() => {});
```

#### `B\exe-e2.mjs`

```js
// E2 (gói B lượt 2, Claude): the file-layer errors on the exe release, each in a folder of its own.
//  ro      K2: project2c.db read-only → app opens, a write, the save warning, the close dialog.
//  held    DR6-07: project2c.db held by another program at start → startup page.
//  lockro  DR6-07: project2c.lock read-only → startup page.
//  page    DR6-06: one page overwritten → startup page, backups\ and the file untouched.
//  index   K1: one index entry changed → the app opens, backs the file up, what profile and 5f say.
//  r1      K5: the round 2 load data as the round 1 code saved it (schema 9) → opens, migrates, backup.
// Run: node exe-e2.mjs [name…]   (writes under r2\claude\B\exe\ only)
import { spawn, execFileSync } from 'node:child_process';
import { copyFileSync, createReadStream, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { prepare, start, closeWindow, waitExit, kill, sleep } from './exe-lib.mjs';

const B = 'C:/workspace/deep-review-1-6-r2/claude/B';
const RSPROBE = `${B}/rsprobe/target/release/rsprobe.exe`;
const only = process.argv.slice(2);
const want = (name) => only.length === 0 || only.includes(name);
const sha = (path) =>
  new Promise((resolve) => {
    const h = createHash('sha256');
    createReadStream(path).on('data', (d) => h.update(d)).on('end', () => resolve(h.digest('hex').slice(0, 16)));
  });
const attrib = (flag, path) => execFileSync('attrib', [flag, path.replaceAll('/', '\\')]);
const opened = (page) =>
  page.waitForFunction(() => performance.getEntriesByName('p2c:data-open', 'mark').length > 0 || document.querySelector('main[role="alert"]'), null, { timeout: 60_000 });
const startupPage = async (page) => ({
  title: (await page.locator('h1').first().textContent())?.trim(),
  text: (await page.locator('main[role="alert"]').textContent().catch(() => ''))?.trim().slice(0, 260),
});
const dataOpenMs = (page) => page.evaluate(() => Math.round(performance.getEntriesByName('p2c:data-open', 'mark')[0]?.startTime ?? -1));

async function writeTeam(page, name) {
  await page.evaluate(() => (location.hash = '#/team'));
  await page.getByRole('button', { name: '+ Team' }).click();
  await page.getByRole('dialog').getByLabel('Tên team').fill(name);
  await page.getByRole('dialog').getByRole('button', { name: 'Tạo team' }).click();
}

if (want('ro')) {
  console.log('\n== ro: project2c.db read-only (K2) ==');
  const dir = prepare('e2-ro', (data) => copyFileSync(`${B}/data/load.db`, `${data}/project2c.db`));
  attrib('+R', `${dir}/Project2C-data/project2c.db`);
  const run = await start(dir);
  await opened(run.page);
  console.log('opened:', await dataOpenMs(run.page), 'ms; backups\\:', readdirSync(`${dir}/Project2C-data/backups`));
  await writeTeam(run.page, 'Team E2 chỉ đọc');
  const alert = run.page.getByRole('alert');
  await alert.waitFor({ timeout: 15_000 });
  console.log('save warning:', (await alert.textContent()).trim());
  closeWindow(run.child.pid);
  const dialog = run.page.getByRole('dialog');
  await dialog.waitFor({ timeout: 10_000 });
  console.log('close dialog:', (await dialog.textContent()).trim().slice(0, 190));
  await dialog.getByRole('button', { name: 'Thử lại' }).click();
  await sleep(1_500);
  console.log('after Thử lại the dialog is back:', await run.page.getByRole('dialog').count() > 0);
  await run.page.getByRole('dialog').getByRole('button', { name: 'Đóng và bỏ thay đổi chưa lưu' }).click();
  console.log('exit code after discard:', await waitExit(run.child));
  await run.browser.close().catch(() => {});
  attrib('-R', `${dir}/Project2C-data/project2c.db`);
}

for (const [name, label, setup, hold] of [
  ['held', 'project2c.db held by another program at start (DR6-07)', (data) => copyFileSync(`${B}/data/load.db`, `${data}/project2c.db`), true],
  ['lockro', 'project2c.lock read-only (DR6-07)', (data) => {
    copyFileSync(`${B}/data/load.db`, `${data}/project2c.db`);
    writeFileSync(`${data}/project2c.lock`, '');
  }, false],
  ['page', 'page 1 717 overwritten (DR6-06)', (data) => copyFileSync(`${B}/data/page-damaged.db`, `${data}/project2c.db`), false],
]) {
  if (!want(name)) continue;
  console.log(`\n== ${name}: ${label} ==`);
  const dir = prepare(`e2-${name}`, setup);
  const data = `${dir}/Project2C-data`;
  if (name === 'lockro') attrib('+R', `${data}/project2c.lock`);
  const before = await sha(`${data}/project2c.db`);
  const holder = hold ? spawn(RSPROBE, ['denyread', data.replaceAll('/', '\\')], { stdio: 'ignore' }) : undefined;
  if (holder) await sleep(1_000);
  const run = await start(dir);
  await opened(run.page);
  console.log('startup page:', JSON.stringify(await startupPage(run.page)));
  closeWindow(run.child.pid);
  console.log('closed, exit code', await waitExit(run.child));
  await run.browser.close().catch(() => {});
  if (holder) kill(holder);
  if (name === 'lockro') attrib('-R', `${data}/project2c.lock`);
  let backups = [];
  try { backups = readdirSync(`${data}/backups`); } catch { backups = '(no folder)'; }
  console.log(`project2c.db unchanged: ${before === (await sha(`${data}/project2c.db`))}; backups\\: ${JSON.stringify(backups)}`);
}

if (want('index')) {
  console.log('\n== index: one index entry changed (K1) ==');
  const customer = '01K7C4NQACX14WV0691A24X2VK';
  const dir = prepare('e2-index', (data) => copyFileSync(`${B}/data/index-damaged.db`, `${data}/project2c.db`));
  const data = `${dir}/Project2C-data`;
  const run = await start(dir);
  await opened(run.page);
  const { page } = run;
  console.log('opened:', await dataOpenMs(page), 'ms; startup error page:', await page.locator('main[role="alert"]').count() > 0);
  const backups = readdirSync(`${data}/backups`);
  console.log(`backups\\: ${JSON.stringify(backups)}; newest backup = the damaged file: ${(await sha(`${data}/backups/${backups.at(-1)}`)) === (await sha(`${B}/data/index-damaged.db`))}`);
  await page.evaluate((id) => (location.hash = `#/customers/${encodeURIComponent(id)}`), customer);
  await page.getByRole('button', { name: 'Sửa hồ sơ' }).waitFor({ timeout: 15_000 });
  const name = (await page.locator('#customer-name').first().textContent())?.trim();
  const appointmentsCard = (await page.locator('[aria-labelledby="customer-appointments"]').first().textContent({ timeout: 5_000 }).catch(() => '')) ?? '';
  console.log(`profile ${name}: Lịch hẹn card says: ${appointmentsCard.replace(/\s+/g, ' ').slice(0, 220)}`);
  await page.getByRole('button', { name: 'Sửa hồ sơ' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Xóa KH…' }).click();
  const fifth = page.getByRole('dialog').filter({ hasText: 'mọi bản ghi của KH' });
  await fifth.waitFor({ timeout: 10_000 });
  console.log('hộp 5f:', (await fifth.textContent()).replace(/\s+/g, ' ').trim().slice(0, 300));
  await page.keyboard.press('Escape');
  await sleep(300);
  await page.keyboard.press('Escape');
  await sleep(300);
  closeWindow(run.child.pid);
  console.log('closed, exit code', await waitExit(run.child));
  await run.browser.close().catch(() => {});
}

if (want('r1')) {
  console.log('\n== r1: the load data as the round 1 code saved it (schema 9) (K5) ==');
  const old = `${B}/../A/old-8855345-load.db`;
  const dir = prepare('e2-r1', (data) => copyFileSync(old, `${data}/project2c.db`));
  const data = `${dir}/Project2C-data`;
  const run = await start(dir, { route: false });
  await opened(run.page);
  console.log('opened:', await dataOpenMs(run.page), 'ms (migration 0009 + 0010 + quick_check + backup); startup error page:', await run.page.locator('main[role="alert"]').count() > 0);
  const backups = readdirSync(`${data}/backups`);
  console.log(`backups\\: ${JSON.stringify(backups)}; the backup = the schema 9 file: ${(await sha(`${data}/backups/${backups[0]}`)) === (await sha(old))}`);
  await sleep(1_500);
  closeWindow(run.child.pid);
  console.log('closed, exit code', await waitExit(run.child));
  await run.browser.close().catch(() => {});
}
```

#### `B\exe-e4.mjs`

```js
// E4 (gói B lượt 2, Claude), K6: the startup page's own advice, followed step by step on the exe.
// project2c.db held by another program → window 1 shows FILE_IN_USE ("…hãy đóng chương trình đó rồi mở
// lại app"); the program lets go; the user starts the app again while window 1 is still open → what
// window 2 says, what window 1 can do; then both closed and a third start.
import { spawn, execFileSync } from 'node:child_process';
import { copyFileSync } from 'node:fs';
import { prepare, start, closeWindow, waitExit, kill, sleep } from './exe-lib.mjs';

const B = 'C:/workspace/deep-review-1-6-r2/claude/B';
const RSPROBE = `${B}/rsprobe/target/release/rsprobe.exe`;
const dir = prepare('e4-retry', (data) => copyFileSync(`${B}/data/load.db`, `${data}/project2c.db`));
const data = `${dir}/Project2C-data`;
const page1 = async (page) => ({
  title: (await page.locator('h1').first().textContent())?.trim(),
  buttons: await page.getByRole('button').count(),
});
const ready = (page) =>
  page.waitForFunction(() => performance.getEntriesByName('p2c:data-open', 'mark').length > 0 || document.querySelector('main[role="alert"]'), null, { timeout: 60_000 });

const holder = spawn(RSPROBE, ['denyread', data.replaceAll('/', '\\')], { stdio: 'ignore' });
await sleep(1_000);
const w1 = await start(dir);
await ready(w1.page);
console.log('window 1:', JSON.stringify(await page1(w1.page)));
kill(holder);
await sleep(500);
console.log('the other program let go of project2c.db');
const w2 = await start(dir, { port: 9339, profile: 'wv2b' });
await ready(w2.page);
console.log('window 2 (app started again, window 1 still open):', JSON.stringify(await page1(w2.page)), '·', (await w2.page.locator('main p').first().textContent())?.trim());
console.log('window 1 now:', JSON.stringify(await page1(w1.page)));
const held = execFileSync('powershell', ['-NoProfile', '-Command', `$h = (Get-Process -Id ${w1.child.pid}).Handles; "window 1 process alive, $h handles"`], { encoding: 'utf8' }).trim();
console.log(held);
closeWindow(w2.child.pid);
console.log('window 2 closed, exit', await waitExit(w2.child));
await w2.browser.close().catch(() => {});
closeWindow(w1.child.pid);
console.log('window 1 closed, exit', await waitExit(w1.child));
await w1.browser.close().catch(() => {});
const w3 = await start(dir);
await ready(w3.page);
console.log('third start: data open', await w3.page.evaluate(() => Math.round(performance.getEntriesByName('p2c:data-open', 'mark')[0]?.startTime ?? -1)), 'ms; error page', await w3.page.locator('main[role="alert"]').count() > 0);
closeWindow(w3.child.pid);
console.log('closed, exit', await waitExit(w3.child));
await w3.browser.close().catch(() => {});
```

#### `B\exe-e5.mjs`

```js
// E5 (gói B lượt 2, Claude), K12: Nhập backup as the first thing after starting on a read-only
// project2c.db (K2): what the Settings screen says, what the warning says, what is on disk after closing.
import { copyFileSync, createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { prepare, start, closeWindow, waitExit, sleep } from './exe-lib.mjs';

const B = 'C:/workspace/deep-review-1-6-r2/claude/B';
const BACKUP = `${B}/exe/e1-fresh/Project2C-data/exports/project2c-20261017-0757.p2cbackup`;
const sha = (path) =>
  new Promise((resolve) => {
    const h = createHash('sha256');
    createReadStream(path).on('data', (d) => h.update(d)).on('end', () => resolve(h.digest('hex').slice(0, 16)));
  });
const dir = prepare('e5-ro-import', (data) => copyFileSync(`${B}/data/load.db`, `${data}/project2c.db`));
const db = `${dir}/Project2C-data/project2c.db`;
execFileSync('attrib', ['+R', db.replaceAll('/', '\\')]);
const before = await sha(db);
const run = await start(dir);
const { page } = run;
await page.waitForFunction(() => performance.getEntriesByName('p2c:data-open', 'mark').length > 0, null, { timeout: 60_000 });
await page.evaluate(() => (location.hash = '#/settings'));
await page.locator('input[type="file"]').setInputFiles(BACKUP);
const dialog = page.getByRole('dialog');
await dialog.waitFor({ timeout: 60_000 });
await dialog.getByRole('button', { name: 'Backup rồi thay dữ liệu' }).click();
const done = page.getByRole('status').filter({ hasText: 'Đã nhập backup' });
await done.waitFor({ timeout: 60_000 });
console.log('Settings says:', (await done.textContent()).trim());
await sleep(1_500);
console.log('warning strip:', (await page.getByRole('alert').first().textContent().catch(() => '(none)'))?.trim());
closeWindow(run.child.pid);
const close = page.getByRole('dialog');
await close.waitFor({ timeout: 10_000 });
console.log('close dialog:', (await close.textContent()).trim().slice(0, 120));
await close.getByRole('button', { name: 'Đóng và bỏ thay đổi chưa lưu' }).click();
console.log('exit', await waitExit(run.child));
await run.browser.close().catch(() => {});
console.log(`project2c.db after closing: unchanged = ${before === (await sha(db))} (the import is not in it)`);
execFileSync('attrib', ['-R', db.replaceAll('/', '\\')]);
```

#### `B\exe-perf.mjs`

```js
// Perf on the exe release (gói B lượt 2, Claude): why app.open-data and every reload.* of common\baseline.md
// are slower than round 1 on this machine. Copy of the exe in exe\e3-perf\ holding the round 2 load data
// (data\load.db, the file a Nhập backup of the load file leaves), debug port 9338, no network route
// (timing run; the browser's DNS rules still refuse every other host), window kept in front.
//  1. app.open-data of 3 starts (page start → data open, as e2e/perf/probe.perf.ts reads it);
//  2. reload.settings and reload.overview, 5 each (probe's timeInPage, action 'load');
//  3. in the same WebView2, sql.js loaded from the app's own wasm: `PRAGMA quick_check` / `integrity_check`
//     on the same bytes, the first run of a fresh instance and the runs after it.
import { readFileSync, copyFileSync } from 'node:fs';
import { prepare, start, closeWindow, waitExit, sleep } from './exe-lib.mjs';

const B = 'C:/workspace/deep-review-1-6-r2/claude/B';
const dir = prepare('e3-perf', (data) => copyFileSync(`${B}/data/load.db`, `${data}/project2c.db`));
const opens = [];
let run;
for (let i = 0; i < 3; i++) {
  run = await start(dir, { route: false });
  await run.page.waitForFunction(() => performance.getEntriesByName('p2c:data-open', 'mark').length > 0, null, { timeout: 60_000 });
  opens.push(await run.page.evaluate(() => Math.round(performance.getEntriesByName('p2c:data-open', 'mark')[0].startTime)));
  if (i < 2) {
    closeWindow(run.child.pid);
    await waitExit(run.child);
    await run.browser.close().catch(() => {});
    await sleep(1_000);
  }
}
console.log('app.open-data, 3 starts:', opens.join(' / '), 'ms');
const { page } = run;

const timeLoad = (selector) =>
  page.evaluate(async (sel) => {
    const frame = () => new Promise((r) => requestAnimationFrame(() => r()));
    do await frame();
    while (!document.querySelector(sel));
    await new Promise((r) => setTimeout(r));
    return performance.now();
  }, selector);
for (const [screen, selector] of [['settings', 'main h2'], ['overview', 'main svg']]) {
  await page.evaluate((s) => (location.hash = `#/${s}`), screen);
  await sleep(800);
  const times = [];
  for (let i = 0; i < 5; i++) {
    await page.reload({ waitUntil: 'commit' });
    times.push(Math.round(await timeLoad(selector)));
  }
  const dataOpen = await page.evaluate(() => Math.round(performance.getEntriesByName('p2c:data-open', 'mark')[0]?.startTime ?? -1));
  console.log(`reload.${screen}: ${times.join(' / ')} ms (median ${[...times].sort((a, b) => a - b)[2]}); data open of the last reload at ${dataOpen} ms`);
}

// 3. quick_check in this WebView2.
const glue = readFileSync('C:/workspace/Project-2C-review/packages/db/node_modules/sql.js/dist/sql-wasm.js', 'utf8');
const cdp = await page.context().newCDPSession(page);
await cdp.send('Runtime.evaluate', { expression: `${glue}\n;window.__p2cInit = initSqlJs;` });
const wasm = await page.evaluate(() => performance.getEntriesByType('resource').map((e) => e.name).find((n) => n.endsWith('.wasm')));
const b64 = readFileSync(`${B}/data/load.db`).toString('base64');
const checks = await page.evaluate(async ({ b64, wasm }) => {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const out = [];
  for (let round = 0; round < 3; round++) {
    const SQL = await window.__p2cInit({ locateFile: () => wasm });
    let t = performance.now();
    const db = new SQL.Database(bytes);
    const openMs = performance.now() - t;
    const quick = [];
    for (let i = 0; i < 4; i++) {
      t = performance.now();
      db.exec('PRAGMA quick_check');
      quick.push(Math.round((performance.now() - t) * 10) / 10);
    }
    t = performance.now();
    db.exec('PRAGMA integrity_check');
    const integrity = Math.round((performance.now() - t) * 10) / 10;
    db.close();
    out.push({ round, openMs: Math.round(openMs * 10) / 10, quick, integrity });
  }
  return { wasm, bytes: bytes.length, out };
}, { b64, wasm });
console.log('in this WebView2:', JSON.stringify(checks));
console.log('WebView2:', await page.evaluate(() => navigator.userAgent));
closeWindow(run.child.pid);
console.log('closed, exit', await waitExit(run.child));
await run.browser.close().catch(() => {});
```

#### `B\clippy-list.mjs`

```js
// Lists the clippy warnings of clippy-pedantic.log as `file:line | lint message`, unique, sorted.
import { readFileSync } from 'node:fs';

const lines = readFileSync('C:/workspace/deep-review-1-6-r2/claude/B/clippy-pedantic.log', 'utf8').split(/\r?\n/);
const found = new Set();
for (let i = 0; i < lines.length; i++) {
  if (!lines[i].startsWith('warning: ') || lines[i].includes('generated')) continue;
  let loc = '';
  for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
    const m = /-->\s+(\S+)/.exec(lines[j]);
    if (m) {
      loc = m[1];
      break;
    }
  }
  found.add(`${loc} | ${lines[i].slice(9)}`);
}
console.log([...found].sort().join('\n'));
console.log(`${found.size} distinct`);
```

### 9.4 Cuối phiên

`git status --short` cuối phiên (2026-10-17 08:17:16 +07:00): rỗng; `git rev-parse HEAD` → `4217ed4cd3300af1d63aa61db9eb13902fe75f16`. Thư mục build bị ignore của repo bị ghi thêm: `apps/desktop/src-tauri/target/debug` (test của 35 đột biến Rust, `cargo clippy`, `cargo test` của bản chép crate dùng chung target). Không file nào khác của repo bị đổi. Tác dụng phụ ngoài repo: chỉ trong `r2\claude\B\` (bản chép exe + `Project2C-data\` + profile WebView2 ở `exe\<ca>\`, `run\`, `data\`, `crate\`); một cửa sổ Explorer mở `exe\e1-fresh\Project2C-data\backups` (DR6-14, đã đóng bằng script). Giờ xong: 2026-10-17 08:17:16 +07:00.
