XONG — claude gói B lượt 5, 2026-11-04 23:04 (+07:00)

# Deep review Phase 1–6, lượt 5 — Claude, gói B (File và Rust)

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên | claude (ID `CLR5`) |
| Gói | B. File và Rust — `apps/desktop/src-tauri/**` (gồm `capabilities/`, `tauri.conf.json`, `Cargo.toml`, `icons/`), `apps/desktop/src/data/**` trừ file AI |
| SHA đầu phiên | `37a80b662861d308a110d1e2b0f65ad13b91fb51` (`git rev-parse HEAD`, worktree `C:\workspace\Project-2C-review`, detached) |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 2026-11-04 22:34 (+07:00) |
| Công cụ | Claude Code, app desktop (tab Code), Windows 11 Pro, máy Home PC `DESKTOP-KDURKJP` |
| Model | Claude Opus 5.5 (`claude-opus-5-5`) |
| Mức suy luận | `xhigh` (cấu hình phiên, đọc bằng `get_session self`: `effort: "xhigh"`, `permissionMode: "auto"`, fast mode tắt) |
| Ultracode | tắt (Owner không bật) → không dùng subagent / Workflow; mọi việc ở phiên chính |
| Phiên làm tiếp? | không — phiên đầu của gói B |
| Node / Rust | Node v24.20.0 (`C:\Program Files\nodejs`, đặt đầu PATH ở mọi lệnh); cargo / rustc 1.98.1 |
| Bước 0 | gói B hợp lệ; `claude\B.md` chưa có → làm mới; `claude\A.md` có, dòng đầu `XONG — claude gói A lượt 5, 2026-11-04 22:33 (+07:00)` |

## 2. Bảng R

Cách làm chung (mọi probe, log, nguồn ở `C:\workspace\deep-review-1-6-r5\claude\B\`; chạy song song: Codex đợt 1 ở `Project-2C-review-2`, 2 tiến trình `codex`; `Get-Process project2c` = 0 trước mỗi lần chạy exe):

- **Rust:** bản chép crate `B\crate\apps\desktop\src-tauri` (+ `dist`, `index.html`, `package.json`, `rust-toolchain.toml`), target riêng `B\crate-target`; đối chứng `cargo test --lib --locked --offline` **120 / 120** xanh (`logs\crate-control.log`, 55 s). Đột biến: `B\mutrs.mjs` (sửa bản chép, chạy test, trả bản gốc `B\pristine\storage.rs`; sha256 = repo sau mỗi đợt). Probe hai bản `storage.rs`: `B\rs\new` (đọc thẳng `storage.rs` của repo ở `37a80b6` qua `#[path]`) ↔ `B\rs\old` (`B\old\storage-2e51e25.rs` = `git show 2e51e25:…`, blob `3da20b7c` = `git rev-parse 2e51e25:…`), cùng `B\rs\common.rs` (chép từ probe lượt 4 của Claude).
- **JS:** `B\mutjs.mjs` + `B\mutant-config.mjs` (hook `load` của Vite phục vụ bản đột biến của đúng một file; repo không đổi byte nào; chỉ tính khi có dòng `[mutant] served`); đối chứng 5 file test của `data` + `close-guard` **116 / 116** xanh. File build mà `tauri-contract.test.ts` đọc bằng `readFileSync`: `B\mutfile.mjs` phục vụ bản chép test có `desktop()` đọc bản chép đột biến; đối chứng 18 / 18 xanh. Probe Node qua lớp dữ liệu của app (`openAppData` với storage giả của exe): `B\p-flush.mjs`, `B\p-dr6-139.mjs`, `B\p-listeners.mjs` (`B\hooks.mjs` chép từ lượt 4, `LOAD` trỏ `r5\common`).
- **Exe:** bản chép trong `B\exe\<ca>\` (exe release `common\exe\project2c.exe`, sha256 `167D4B3B…5832A` = `baseline.md`; exe lượt 4 lấy bản chép trong probe lượt 4 của Claude `r4\claude\B\exe\held\project2c.exe`, sha256 `8E841182…`; exe debug dựng từ bản chép crate), hồ sơ WebView2 riêng, cổng debug **9473**, DNS mọi host không local bị chặn ở trình duyệt, `route` hủy mọi yêu cầu ngoài, `window.open` thay ngay (`B\exe-lib.mjs`, chép từ lượt 4); mọi log exe kết thúc bằng `requests blocked: []`. Không bấm nút AI / ChatGPT nào.
- `git status --short` của repo rỗng sau mỗi đợt đột biến (dòng cuối mỗi log).

### 2.1 Bảng R1 (4 dòng của gói B)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-138 | #897 → #915 | **ĐÃ SỬA** (cả ba phần (a) (b) (c); biến thể gần còn hở → **CLR5-B1**) | **Tái hiện lượt 4** (K14, K15, K22 của Claude B lượt 4) = đột biến lượt 4 chạy lại trên `37a80b6`: (a) `logs\mutfile.log`: NC7 `font-src` Google Fonts, NC8 `script-src` thêm host, NC9 `'unsafe-eval' 'unsafe-inline'`, NC10 `img-src *`, NC11 thêm `frame-src *` → đều **KILLED** ("keeps the CSP closed…", 1 / 18 đỏ); NC13 đổi `identifier` → **KILLED** ("keeps the identifier of the build"); NC6 `connect-src`, NC12 `default-src` vẫn KILLED. (b) `logs\mutrs.log`: **D4** (bỏ lọc `is_file` của `backup_names`) → **KILLED**, 3 / 120 đỏ đúng ba test mới (`a_folder_named_like_a_backup_costs_no_backup`, `a_missing_file_with_only_a_folder_named_like_a_backup_is_a_first_start`, `a_folder_named_like_a_later_backup_is_never_the_latest_backup`). (c) **DF2** (bỏ `.map_err(disk_full)` của `backup_with`) → **KILLED**, 1 đỏ (`a_backup_that_finds_the_disk_full_is_reported_as_disk_full`). Ở lượt 4 cả 8 đột biến này **sống**. Seam `backup_with` không đổi hành vi: ma trận 14 trạng thái thư mục (`open` → `backup` → `save` → `latest_backup`) chạy bằng `rs5new` ↔ `rs5old` **trùng từng dòng** (`logs\rs-matrix-{new,old}.log`, `diff` rỗng) | Biến thể CSP mới (`mutfile.log`): NV1 thêm một `script-src *` thứ hai, NV2 `object-src *`, NV3 dấu `;` cuối → KILLED (so đủ mảng). NV4 `devCsp` (chỉ bản dev), NV5 `withGlobalTauri` → sống: không nới exe (`devCsp` không vào exe; `__TAURI_INTERNALS__` vốn có ở mọi trang Tauri 2, CSP vẫn chặn script ngoài) — không ghi phát hiện. Biến thể Rust: DF3 (`copy_to_backups` bỏ qua `flush` được truyền), DF4 (bọc lỗi của bản mới thành `Other`), D6 (`next_seq` bỏ thư mục), D7 (`latest_backup` không qua `backup_names`) → KILLED; D5 (`!is_dir()` thay `is_file()`: một symlink tên như backup cũng tính) sống — gần tương đương (tạo symlink cần quyền; xóa symlink không đụng đích). **Hở còn lại cùng họ:** test hợp đồng chỉ đọc `capabilities/default.json#permissions`, trong khi Tauri nạp mọi file `capabilities/**/*` và mọi capability khai trong `tauri.conf.json` → **CLR5-B1** |
| DR6-139 | #898 → #911 | **ĐÃ SỬA** | **Tái hiện lượt 4** (tổng hợp lượt 4 §11: ghi 50 ms, `track` một việc sau khi `flush()` bắt đầu; `logs\p-dr6-139.log`): code ghim `flush resolved at 290 ms; replace persisted at 228 ms → after the replace`; code `2e51e25` (đột biến F1 = `await idle()` như cũ) `flush resolved at 61 ms … BEFORE the replace`. Kịch bản DSR4-B1 qua lớp dữ liệu (`p-flush.mjs` F1): lần lưu bị giữ, `flush()`, rồi Nạp lại → `flush` còn `pending`; thả lần lưu → `resolved`, file cuối là dữ liệu mới. **Gỡ sửa** (`logs\mutjs.log`): F1 → **KILLED** (2 đỏ: "flush() waits for work tracked once it began, while a write ran, and what it persists (DR6-139)" của `persist-queue.test.ts` và "closing the app waits for a replace called while the close waits for a save…" của `app-data.test.ts`); F2 `while (running) await running` → KILLED (2 đỏ); F5 vòng chạy một lần → KILLED (2 đỏ); F4 dừng vòng khi một lần ghi lỗi → KILLED (5 đỏ) | Chuỗi mới qua lớp dữ liệu (`p-flush.mjs`, mục 4 K2): X rồi Nhập backup và Nạp lại xếp hàng (F2: chờ cả hai, file cuối là dữ liệu của lần sau); lần lưu dữ liệu mới của lần thay lỗi (F3: `flush` reject `SAVE_FAILED`, `error` `DISK_FULL`; Thử lại ghi lại bản mới, hết lỗi); lần thay bị từ chối vì backup lỗi (F4: `flush` xong, file = dữ liệu cũ + thay đổi đang lưu, `saving` false); Dọn sạch (F5); hai `flush` cùng lúc chỉ ghi lại một lần (F6). **F3** (bỏ vòng đầu: bản lỗi được ghi lại trước khi việc theo dõi xong) **sống** cả 4 387 test — gần tương đương: trong lúc một lần thay chạy, `run` từ chối mọi lệnh ghi (S2-2), nên `lost` chỉ có thể là lần lưu của chính lần thay đó, ở cuối nó; ghi lại sớm hay muộn cùng ra một bản. Không ghi phát hiện |
| DR6-140 | #898 → #911 (+ #933 → #946) | **ĐÃ SỬA** | Mô tả: `changed()` của `AppData` gọi listener không bọc `try`, `run()` ném sau khi lệnh đã ghi. Code ghim: `app-data.ts:375-380` gọi `notify(listeners, console.error)`. **Gỡ sửa:** L0 (vòng trần của `2e51e25`) → **KILLED** ("run() of a command still returns when a subscriber throws: written, reported, the others told (DR6-140)"); L5 (AppData không báo lỗi) → KILLED. Qua lớp dữ liệu (`p-flush.mjs` F8): một listener ném, một listener tự gỡ mình, một listener sau đó; `reloadDemoData()` **resolve** (không reject sau khi đã thay dữ liệu), `run` trả team, `console.error` 2 lần (một mỗi lần đổi), listener tự gỡ được gọi đúng một lần, listener sau được gọi cả hai lần, file cuối có team mới | Biến thể: đường `replace` (Nạp lại) và `run` cùng một `changed()`, cả hai đúng (F8). Phần `AiJobs`: gói C |
| DR6-147 | #898 → #911 | **ĐÃ SỬA** (phần gói B: hàng đợi lưu; dải / focus / câu hộp trên màn: gói D) | Phần của B: hàng đợi báo listener **đồng bộ** lúc lần lưu xong (`persist-queue.ts:73-81`, `notify` trong `drain`), nên listener của `SaveWarning` và của `askWhileFailed` chạy trước khi React render. Qua lớp dữ liệu (`p-flush.mjs` F9, `closeAfterSaving` + `askWhileFailed` thật, `show` giả): lưu lỗi hai lần → X → hộp hiện **1** lần; một lần lưu khác thành công (như phân tích AI ghi xong) → hộp tự trả lời "retry", cửa sổ đóng **1** lần, listener đăng ký sau nghe `failed` = `true, false`, file cuối có cả hai thay đổi. Đột biến của chính PR cho `askWhileFailed` (không thôi nghe, luôn hiện hộp, mọi lần đổi đều trả lời) nằm ở `close-guard.test.ts` (gói D); đối chứng 116 / 116 xanh | Không chạy e2e (`pnpm e2e` cổng 4173 dùng chung với bên khác; baseline ở SHA ghim: 324 passed, gồm ba ca e2e của T-321). Kết luận về màn: gói D |

### 2.2 Bảng R2 (1 Issue của gói B)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-332 (phần B: `listeners.ts`, mục 6) | #933 → #946 | **ĐÃ SỬA** (phần gói B) | Mục tiêu: một hàm gọi listener cho ba store, mỗi listener một `try`, lỗi qua hàm báo lỗi truyền vào, ba store giữ cách báo cũ. Code: `listeners.ts:7-15`; `git grep notify`: `app-data.ts:379` và `persist-queue.ts:80` truyền `console.error`, `ai-jobs.ts:72` truyền `reportError` — đúng như Issue. Test chấp nhận: `listeners.test.ts` (2 ca) có; ca listener ném có sẵn của `AiJobs`, `AppData`, hàng đợi lưu xanh (đối chứng 116 / 116). **Gỡ sửa** (`logs\mutjs.log`): L1 (bỏ `try`) → **KILLED** (4 đỏ: ca của `listeners`, hàng đợi lưu, `AiJobs`, `AppData`); L2 (không báo) → KILLED (4 đỏ); L4 (dừng ở listener ném đầu tiên) → KILLED (4 đỏ); L5, L6 (một store không báo) → KILLED (1 đỏ mỗi cái); L7 (hàng đợi về vòng trần, trước NIT #87) → KILLED. **Không đổi hành vi** (`logs\p-listeners.log`, `notify` ↔ hai vòng của `2e51e25`): listener tự gỡ mình (`AB`), gỡ listener sau (`A`), thêm listener mới (`ABC`), tự đăng ký lại (`ABAAAA`, chặn ở 5) cho **cùng kết quả** ở cả ba; chỉ ca listener ném khác vòng trần của `AppData` (`A … THREW`) — đúng phần sửa DR6-140 | **L3** (`notify` duyệt bản chép `[...listeners]` thay vì `Set`) **sống** cả 4 387 test: chỉ khác khi một listener gỡ / thêm listener **khác** ngay trong lúc được gọi; trong app không listener nào làm vậy đồng bộ (React đăng ký / gỡ trong effect; `askWhileFailed` chỉ gỡ chính nó), nên gần tương đương; PR đã chọn giữ cách duyệt thẳng `Set` của ba vòng cũ. Không ghi phát hiện. Ghi chú sổ đã gom (RESOLVED #911): hỏng lại không — vòng gọi listener chỉ còn ở `listeners.ts` (`git grep "for (const listener of"` trong `apps/desktop/src` → chỉ `listeners.ts:8`) |

## 3. Phạm vi đã đọc

**Diff sửa của gói B** (`git diff --numstat -M 2e51e25 37a80b6 -- apps/desktop/src-tauri apps/desktop/src/data`, bỏ file AI `ai-analysis*`, `ai-jobs*`, `ai-tauri*` của gói C): `storage.rs` +85 / −3 (#915: seam `backup_with`, `copy_to_backups` nhận `flush`, 4 test), `app-data.ts` +5 / −2 (#911, #946: `notify`), `persist-queue.ts` +8 / −10 (#911 vòng của `flush()`, #946 `notify`), `listeners.ts` +15 (mới, #946); test `listeners.test.ts` +28, `persist-queue.test.ts` +25, `app-data.test.ts` +46, `tauri-contract.test.ts` +20 / −8. Commit: `59fdfca` (#911), `ea2aa34` (#915), `66019cc` (#946), `5d13f5a` (#917, chỉ file AI); đọc từng hunk. `lib.rs`, `ai.rs`, `main.rs`, `build.rs`, `Cargo.toml`, `Cargo.lock`, `tauri.conf.json`, `capabilities/`, `icons/`, `tauri-storage.ts`, `AppDataContext.tsx`, `tables.ts`, `today.ts`, `demo-snapshot.ts` không đổi.

**Đọc hết ở `37a80b6`:** `src-tauri/src/storage.rs` SP 1–682 + tên 120 test và các test mới; `lib.rs` (205); `tauri.conf.json`, `Cargo.toml`, `capabilities/default.json`, `build.rs`, `main.rs`; `src/data/app-data.ts` (496), `persist-queue.ts` (142), `listeners.ts` (15), `tauri-storage.ts` (91), `AppDataContext.tsx` (64); `tauri-contract.test.ts` (382, đủ); hunk test của `persist-queue.test.ts`, `app-data.test.ts`, `listeners.test.ts`.

**Chỗ nối gói khác:** `apps/desktop/src/shell/{close-guard.ts, CloseGuard.tsx, SaveWarning.tsx}` (đủ); `ai-jobs.ts` (chỉ chỗ gọi `notify`), `ai-analysis.ts:99-135` (`reportError`); mã nguồn Tauri trong registry của cargo: `tauri-build-2.6.3/src/acl.rs:420-440` (`parse_capabilities("./capabilities/**/*")`), `tauri-utils-2.9.3/src/acl/build.rs` (`parse_capabilities`), `tauri-utils-2.9.3/src/acl/mod.rs:353-395` (`get_capabilities`), `tauri-codegen-2.6.3/src/context.rs:400-417`.

**Tài liệu:** `CLAUDE.md` gốc, `apps/desktop/CLAUDE.md`, `.claude/rules/{i18n-ui,tests}.md`; `common\{prompt-claude.md (đủ), plan.md (§4, §L5.1–§L5.8), known.md (phần 1 ACCEPTED theo từ khóa gói B, phần 2 K1–K47, phần 4, 5), fixes.md (#897 / #915, #898 / #911, #933 / #946 và nhóm RESOLVED), baseline.md (đủ)}`; tổng hợp lượt 4 §6.2, §6.4, §11; báo cáo gốc Claude B lượt 4 (đủ); `claude\A.md` lượt 5 (§1–§2, ID phát hiện) để không báo trùng; tìm theo từ khóa (capability, `remote`, `withGlobalTauri`, `capabilities.json`) trong `docs/reviews/` lượt 1–4 để biết biến thể capability chưa ai thử.

## 4. Kịch bản mới đã thử

Chưa có trong báo cáo gói B lượt 1–4 (đã đọc mục kịch bản của Claude B lượt 4 K1–K22; tìm theo từ khóa trong báo cáo các lượt trước). Probe ở `C:\workspace\deep-review-1-6-r5\claude\B\`.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| K1 | Cấp thêm quyền cho webview mà không sửa dòng `permissions` của `default.json`: (CAP1) thêm file thứ hai `capabilities/extra.json` (`core:window:allow-maximize`, `allow-set-size`, `allow-close`); (CAP2) `tauri.conf.json` khai `app.security.capabilities: ["default", {capability inline}]`; (CAP3) `default.json` thêm `"remote": { "urls": ["https://*"] }`; (CAP4) `"windows": ["*"]` (`B\mutfile.mjs`) | Cả bốn **sống** qua `tauri-contract.test.ts` (18 / 18 xanh). Dựng exe debug từ bản chép crate có CAP1 (`--features tauri/custom-protocol`, 16 s; `gen\schemas\capabilities.json` của bản chép liệt kê `default` và `extra`), gọi từ trang (`logs\exe-cap.log`): exe release ghim `set_size` / `maximize` / `minimize` → "not allowed by ACL"; exe có `extra.json` → `set_size` **ok** (1440×900 → 1200×760), `maximize` **ok** (→ 2560×1009), `minimize` vẫn bị chặn | **CLR5-B1** |
| K2 | Chuỗi lưu / thay / đóng app chồng nhau qua lớp dữ liệu (`p-flush.mjs`, storage giả của exe, giữ / làm lỗi từng lần lưu): F1 X khi lần lưu bị giữ rồi Nạp lại; F2 X rồi Nhập backup và Nạp lại xếp hàng; F3 X rồi Nạp lại mà lần lưu dữ liệu mới lỗi, rồi Thử lại; F4 X rồi Nạp lại mà backup lỗi; F5 X rồi Dọn sạch; F6 hai `flush` cùng lúc (X và Thử lại) sau một lần lưu lỗi; F7 X trong lúc người dùng còn đổi dữ liệu (mỗi 10 ms trong 300 ms, mỗi lần lưu 15 ms) | Đúng S2-6 ở mọi ca: F1, F2, F5 chờ tới lần lưu cuối của lần thay (F2 chờ cả lần thứ hai); F3 reject `SAVE_FAILED` (`error` `DISK_FULL`), Thử lại ghi bản mới; F4 lần thay bị từ chối, `flush` xong, `saving` false, `replacing` false; F6 chỉ một lần ghi lại; F7 `flush` xong sau 308 ms, khi thay đổi cuối đã lưu (19 lần lưu) | — |
| K3 | Listener của ba store gỡ / thêm listener ngay trong lúc được gọi, ném lỗi (`p-listeners.mjs`: `notify` ↔ hai vòng của `2e51e25`) và trên `AppData` thật trong một lần Nạp lại (`p-flush.mjs` F8) | Cùng thứ tự gọi ở mọi ca, trừ ca ném (phần sửa DR6-140); `reloadDemoData` resolve, listener tự gỡ chỉ được gọi một lần, listener sau vẫn nghe cả hai lần đổi | — |
| K4 | Hộp đóng app đang hỏi (lưu lỗi hai lần), một lần lưu khác thành công; `closeAfterSaving` + `askWhileFailed` thật trên hàng đợi của `openAppData` (F9) | Hộp hiện 1 lần, tự trả lời "retry", cửa sổ đóng 1 lần, file có cả thay đổi lỗi trước lẫn thay đổi sau | — |
| K5 | Exe ghim mở `Project2C-data\project2c.db` do **exe lượt 4** (`2e51e25`) ghi: bản chép từ hai ca của probe lượt 4 (`held`: dữ liệu tải + team mới, 14 102 528 B; `oldschema`: file schema 12 mà exe lượt 4 đã migrate lên 13) (`exe-old.mjs`) | Cả hai: mở vào "Tổng quan · Heritas L-CRM", chỉ báo "Đã lưu", 0 mốc `p2c:db-save` (không lưu gì: không có migration sau `2e51e25`), Cài đặt → Dữ liệu "5 team · 51 nhân sự · 1.481 KH · 10.255 lịch hẹn · 1.674 HĐ" / "4 team · …"; đóng thoát 0; file không đổi (sha256 16 ký tự đầu `72f9311a688ffa27` / `801306dd88d9de15` trước = sau); đúng một backup `project2c-s00000001-…`, trùng byte file; không `.tmp` | — |
| K6 | Seam `backup_with` (T-320) có đổi hành vi không: ma trận 14 trạng thái `Project2C-data` của lượt 4 (rỗng; có file; 10 / 11 bản + file lạ; file sót của lần sập; thư mục chiếm tên kế tiếp; `backups` là file, có / không `project2c.db`; mất file mà còn bản sao; `backups\` cấm `(RD)`; thư mục cấm `(WD)` có / không file; file rỗng; file không phải SQLite), `storage.rs` ghim ↔ `2e51e25` | 14 / 14 dòng trùng từng chữ (`diff` rỗng) | — |
| K7 | Lần lưu DB đầu tiên của lần mở đầu (`p2c:db-save`, seed demo, 9 969 664 B): `baseline.md` ghi 150 ms so 119 / 119 / 123 ms (quá luật nhiễu, "để gói F xét"). Exe lượt 4 ↔ exe ghim, **xen kẽ**, 3 lần mỗi bản, thư mục mới mỗi lần, chờ 12 s rồi nối CDP như baseline (`exe-firstsave.mjs`) | Lượt 4 **188,5 ms** (188,6 / 188,5 / 186,9) ↔ ghim **185,1 ms** (188,3 / 185,1 / 183,0): hai bản bằng nhau trong cùng điều kiện, nên chênh của baseline là do máy / thư mục lúc đo, không do code (đường lưu không đổi từ G7: `git diff 233c77e 37a80b6 -- apps/desktop/src-tauri apps/desktop/src/data` rỗng; #911, #915, #946 đều là tổ tiên của `233c77e`) | — |
| K8 | Biến thể gần của CSP (NV1 hai `script-src`, NV2 `object-src *`, NV3 dấu `;` cuối, NV4 `devCsp`, NV5 `withGlobalTauri`) và của bộ lọc / ánh xạ trong `storage.rs` (D5–D7, DF3, DF4) | NV1–NV3, D6, D7, DF3, DF4 bị giết; NV4, NV5, D5 sống, đều không nới exe hay gần tương đương (dòng R1 DR6-138) | — |
| K9 | Exe ghim: Ctrl+click, Shift+click, click chuột giữa lên link "Khách hàng" của sidebar (một cửa sổ webview thứ hai của app sẽ gọi `db_open` với trang khác và làm mọi lần lưu của cửa sổ đầu thành `STALE_PAGE`) (`exe-newwin.mjs`) | Không cửa sổ nào mở thêm (CDP 1 trang, 1 cửa sổ "Heritas"), trang đứng yên ở `#/overview`; wry từ chối yêu cầu cửa sổ mới khi Tauri không đặt handler (`wry-0.55.1/src/webview2/mod.rs:781-783`); sau đó lưu bình thường, không dải lỗi | — |
| K10 | Màn dùng lần cuối nằm trong hồ sơ WebView2 (`localStorage`, `useRoute.ts`), tách khỏi `Project2C-data`: mở hồ sơ một KH, đóng; chép một file DB khác (dữ liệu tải) vào chỗ `project2c.db` lúc app đóng, như khi khôi phục backup bằng tay; mở lại (`exe-lastroute.mjs`) | Mở vào `#/customers/<mã cũ>`, tiêu đề "Hồ sơ khách hàng · Heritas L-CRM", màn ghi "← Khách hàng" + "Không tìm thấy KH này (có thể đã bị xóa)."; không dải lỗi; đúng một backup của file mới; thoát 0 | — |

## 5. Phát hiện mới

### CLR5-B1 — Test hợp đồng của bản build chỉ đọc dòng `permissions` của `capabilities/default.json`: một file capability thứ hai, một capability khai trong `tauri.conf.json`, hay `remote` / `windows` của `default.json` cấp thêm quyền cho webview mà CI vẫn xanh

```
ID: CLR5-B1
Mức: Low
Trục: T, S
Vị trí: apps/desktop/src/data/tauri-contract.test.ts:338-356 (ca "allows the webview only the Tauri commands it uses": chỉ đọc `desktop('src-tauri/capabilities/default.json')` rồi so `permissions`), :272-278 (`tauriConf()` không đọc `app.security.capabilities`); apps/desktop/src-tauri/capabilities/default.json:5-11; apps/desktop/src-tauri/tauri.conf.json:23-25 (37a80b6)
Tình trạng: CONFIRMED
Liên quan: K37 (G6: đúng một quyền `core:window:allow-set-title`), biến thể gần của DR6-138 (test hợp đồng của bản build) · có từ trước (ca test có từ #617, T-235), lượt 1–4 bỏ sót
Kịch bản: K1
```

- **Mô tả:** quyền của webview trong exe là hợp của **mọi** capability: khi `tauri.conf.json` không khai `app.security.capabilities`, `tauri-build` nạp mọi file `capabilities/**/*` (`.json` / `.json5` / `.toml`; `tauri-build-2.6.3/src/acl.rs:427-428`), còn khi có khai thì dùng danh sách đó, kể cả capability viết thẳng trong cấu hình (`tauri-utils-2.9.3/src/acl/mod.rs:358-376`). Ca test chỉ so mảng `permissions` của một file `default.json`, không đọc thư mục `capabilities/`, không đọc `app.security.capabilities`, và không đọc `windows` / `webviews` / `remote` của chính `default.json`. Bản web của e2e không có ACL, nên ca này là chốt chặn duy nhất của quyền webview trong exe (như CSP ở DR6-138).
- **Tái hiện / bằng chứng:**
  - `node B\mutfile.mjs` (`logs\mutfile.log`; bản chép test, repo không vá): CAP1 (thư mục `apps/desktop` chép có thêm `capabilities/extra.json`), CAP2 (capability inline trong `tauri.conf.json`), CAP3 (`remote.urls: ["https://*"]`), CAP4 (`"windows": ["*"]`) → `SURVIVED — Tests 18 passed (18)` cả bốn; đối chứng 18 / 18; NC5 của lượt 4 (thêm quyền vào `permissions` của `default.json`) thì bị giết.
  - Exe (`node B\exe-cap.mjs`, `logs\exe-cap.log`): exe release ghim, từ trang gọi `plugin:window|set_size` / `maximize` / `minimize` → cả ba "not allowed by ACL", cửa sổ giữ 1440×900. Exe debug dựng từ bản chép crate có `capabilities/extra.json` (không đổi `default.json`) → `set_size` "ok", cửa sổ 1200×760; `maximize` "ok", 2560×1009; `minimize` (không có trong `extra.json`) vẫn bị chặn. `gen\schemas\capabilities.json` của bản chép sau khi dựng: `default` 4 quyền, `extra` 3 quyền.
- **Ảnh hưởng:** quyền hiện tại ở `37a80b6` đúng (một file, 4 quyền, chỉ cửa sổ `main`), nên hiện không có lỗ. Một PR sau thêm quyền cho webview qua một file capability mới (như mẫu của plugin Tauri), qua `tauri.conf.json`, hay nới `windows` / `remote` thì CI vẫn xanh, trong khi mọi quyền mới là cổng G6 (K37) và tên ca nói "only the Tauri commands it uses". Cần PR làm vậy; review đọc diff vẫn thấy được.
- **Đề xuất:** ca test liệt kê `capabilities/` (đệ quy) và đòi đúng một file `default.json`; đòi `tauriConf().app.security.capabilities` không có (hoặc rỗng); so **cả object** của `default.json` (`identifier`, `windows: ['main']`, `permissions`, không `remote` / `webviews` / `platforms`). ≈ 15 dòng test, không đổi SP; PR chỉ sửa test nên không cần `build-exe`.

Ngoài CLR5-B1 không có phát hiện mới ở gói B.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc | Trên | Kết quả (số) | ID |
|---|---|---|---|
| `cargo clippy --lib --tests --locked --offline -- -W clippy::pedantic` (bản chép crate = repo; `logs\clippy-pedantic.log`) | Rust `37a80b6` | exit 0. **lib 20** cảnh báo (lượt 4: 20; 13 `doc_markdown`, 3 `needless_pass_by_value`, `struct_field_names`, `cast_possible_wrap`, `missing_panics_doc`, `redundant_closure_for_method_calls`); **lib test 34, 20 trùng → 14 chỉ ở test** (lượt 4: 14); build script 1, bin test 1. Seam `backup_with` (#915) không thêm cảnh báo; không cảnh báo nào là code chết | — |
| `tsc --noUnusedLocals --noUnusedParameters` | `tsconfig.base.json` bật sẵn hai cờ → `pnpm typecheck` trong `pnpm verify` (xanh ở SHA ghim, `baseline.md`) | 0 biến / tham số thừa (không chạy lại) | — |
| Nơi dùng export / hàm mới | `listeners.ts` (`notify`), `storage.rs` (`backup_with`, `backup_flushing`) | `notify`: 3 nơi dùng sản phẩm (`app-data.ts:28`, `persist-queue.ts:8`, `ai-jobs.ts:9`) + test; `backup_with`: `backup` + test (seam như `save_with`, cùng mẫu). `write_atomic` nay chỉ còn `write_export` gọi (`storage.rs:374`), là wrapper 2 dòng của `write_atomic_with`: không chi phí đo được | — |
| Code lặp | ba vòng gọi listener (`app-data.ts`, `persist-queue.ts`, `ai-jobs.ts`) | Giảm: `git grep "for (const listener of" -- apps/desktop/src` → 1 chỗ (`listeners.ts:8`), lượt 4: 2 chỗ trong gói B + 1 ở `ai-jobs.ts`. Không có lặp ≥ 3 nơi mới | — |
| Dependency | `git diff --stat 2e51e25 37a80b6 -- Cargo.lock Cargo.toml tauri.conf.json capabilities icons lib.rs ai.rs` | rỗng: không dependency, không quyền, không icon mới | — |
| Exe | `baseline.md` | 5 649 408 B = lượt 4 = G7 (0 B); `icons/icon.png` (209 112 B) vẫn không cấu hình nào trỏ tới (lượt 4 đã ghi; chỉ tốn chỗ repo) | — |

Đề xuất refactor bloat: không có mục mới.

### 6.2 Hiệu năng

Home PC `DESKTOP-KDURKJP`, 04/11 22:45–23:00; chạy song song: Codex đợt 1 (2 tiến trình `codex`), và ở phép đo Rust còn có lượt đột biến JS của chính phiên (vitest) — ghi rõ ở dòng đó; CPU 5–11 % ngay trước các phép đo Node / exe (`Win32_Processor.LoadPercentage`); không exe nào khác chạy khi đo exe (`Get-Process project2c` = 0). Dữ liệu: `B\data\load13.db` (dữ liệu tải ở SHA ghim qua `importBackup` → `export`, 14 102 528 B, schema 13, sha256 `f333adb3…`). Mốc: `common\baseline.md` (exe ghim: mốc sau #656, G7, lượt 4 cùng máy), báo cáo Claude B lượt 4 §6.2. Luật nhiễu: xấu hơn khi quá 20 % **và** quá 10 ms.

| Thao tác | Nơi / lần | Lượt 5 | Mốc cùng máy | Δ / ngưỡng | ID |
|---|---|---|---|---|---|
| Rust `save` 14,1 MB (ghi + `sync_all` + đổi tên) | `rs5new` ↔ `rs5old` (`storage.rs` của `2e51e25`), 15 lần × 2 vòng xen kẽ, **có vitest của phiên chạy song song** (`logs\rs-time.log`) | 10,49 / 10,32 ms | `rs5old` cùng lúc 11,93 / 10,59; lượt 4 9,86 / 9,63 | ≤ +0,9 ms so lượt 4; ngang bản cũ cùng lúc | — |
| Rust `open` (đọc + kiểm header + hỏi quyền) | như trên, 5 lần | 4,54 / 4,30 ms | `rs5old` 4,46 / 4,26; lượt 4 4,08 / 3,92 | ≤ +0,5 ms | — |
| Rust backup: thư mục rỗng · file không đổi · file đổi, 10 bản | như trên | 13,8 / 13,8 · 7,18 / 7,09 · 44,6 / 50,9 ms | `rs5old` 18,3 / 13,8 · 7,76 / 6,95 · 45,0 / 45,7; lượt 4 12,8–13,2 · 6,2–6,6 · 40,9–41,1 | ≤ +9,8 ms (< 10 ms, không quá luật nhiễu); bản cũ cùng lúc ra cùng mức → máy, không phải seam `backup_with` | — |
| `openAppData` + `flush` từ file (storage giả, `integrity_check`, backup) | Node, 5 lần sau 1 lần khởi động (`logs\p-open.log`) | **105,2 ms** (103,8–106,8); sự kiện `["backup"]`, không lưu | lượt 4: 105,7 ms | −0,5 ms | — |
| Lần lưu DB đầu của lần mở đầu (`p2c:db-save`, 9 969 664 B) | exe lượt 4 ↔ exe ghim, xen kẽ, 3 lần mỗi bản (`logs\exe-firstsave.log`, mục 4 K7) | ghim **185,1 ms** (188,3 / 185,1 / 183,0) | exe lượt 4 cùng lúc **188,5 ms** (188,6 / 188,5 / 186,9); `baseline.md`: ghim 150, mốc sau #656 119, lượt 4 119, G7 123 | ghim = lượt 4 trong cùng điều kiện: chênh +26 % của `baseline.md` là do máy / thư mục lúc đo, không do code (đường lưu không đổi từ G7). Không có ngưỡng riêng; probe `db.save` 150 ms ≤ 400 ms | — |
| `db.save`, `app.open-data`, `backup.export` trên exe (dữ liệu tải) | probe `e2e/perf`, `baseline.md` (không đo lại) | 150 / 330 / 438 ms | mốc sau #656 151 / 387 / 438; G7 148 / 320 / 435; lượt 4 149 / 370 / 436 | không dòng nào ⚠️; trong ngưỡng `phase-6.md` (≤ 400 / ≤ 600 / ≤ 1 000 ms). `backup.read` (983 ms) là phần kiểm của luật nhập: gói A | — |
| `flush()` lặp (T-321) và `notify` (T-332) | đọc code + `p-flush.mjs` | một vòng `while` trên `running` / `tracked` (thường 0–2 lượt), một vòng `for` như cũ; không thêm lần ghi (F6: hai `flush` cùng lúc ghi lại một lần) | — | không đo được chi phí | — |
| Dọn sạch trên exe (113 bản ghi) | `baseline.md` | 128,0 ms bấm → 11j | ngưỡng ≤ 500 ms; lượt 4 123,3; G7 130,5 | ✅ (không đo lại) | — |

Không thao tác nào của gói B vượt ngưỡng `phase-6.md` hay xấu hơn mốc cùng máy theo luật nhiễu; không có phát hiện P.

## 7. Bảng đếm mức × trục

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | | 0 |
| Low | | | | | | (CLR5-B1*) | | | CLR5-B1* | | 1 |
| Nit | | | | | | | | | | | 0 |

\* gắn hai trục (T, S), đếm một lần ở trục đầu. CONFIRMED 1 / 1, PLAUSIBLE 0, KNOWN 0. Có từ trước (lượt 1–4 bỏ sót), không do đợt sửa sau lượt 4. Bảng R: **R1 4 / 4 ĐÃ SỬA** (DR6-138, 139, 140, 147 — phần gói B), **R2 1 / 1 ĐÃ SỬA** (T-332 phần B); không SỬA MỘT PHẦN, CHƯA SỬA hay HỒI QUY. Đột biến: **37** (Rust 7, JS qua hook 13, file build 17), **28 bị giết**, 9 sống: D5, F3, L3 (gần tương đương), NV4, NV5 (không nới exe), CAP1–CAP4 (→ CLR5-B1).

## 8. Đã xét, không thấy (theo trục)

- **R:** 4 dòng R1, 1 dòng R2 ĐÃ SỬA (mục 2): tái hiện lượt 4 nay ra đúng (8 đột biến lượt 4 sống của DR6-138 nay bị giết; DR6-139: code cũ xong `flush` ở 61 ms trước lần thay, code ghim ở 290 ms sau lần thay và lần lưu của nó); test của PR sửa đỏ khi gỡ phần sửa (F1, F2, L0, D4, DF2, L1, L2, L4–L7); ghi chú sổ RESOLVED của #911 (vòng listener chép ba nơi) không hỏng lại. Refactor không đổi hành vi: seam `backup_with` (ma trận 14 ca trùng từng dòng), `listeners.ts` (5 ca gọi lại / gỡ / thêm trùng hai vòng cũ). Biến thể còn hở: CLR5-B1.
- **E:** chuỗi lưu / thay / đóng chồng nhau (K2 F1–F7), hộp đóng app và lần lưu khác (K4), listener gọi lại trong lúc được gọi (K3), file DB của exe lượt 4 (K5), click có phím bổ trợ lên link (K9), màn dùng lần cuối khi file DB đã đổi (K10). Không thấy lỗi.
- **C:** S2-6 (spec Phase 6 §4.1, K13 / K35) đúng ở mọi chuỗi K2; hợp đồng `flush()` ghi ở `persist-queue.ts:21-26` khớp hành vi đo được; ADR-0016 (ghi `.tmp` rồi đổi tên, 10 bản) không đổi; K39 (`identifier`, tên mã ở chỗ không nhìn thấy) giữ, nay có test.
- **D:** sau mọi chuỗi K2 file cuối là một trạng thái đủ (dữ liệu cũ đủ, hoặc dữ liệu mới đủ); lần thay bị từ chối không đổi dữ liệu (F4); file của exe lượt 4 mở không đổi byte, backup trùng byte (K5).
- **G:** `ai.rs` không đổi từ `2e51e25` (`git diff` rỗng); 120 test Rust xanh ở bản chép (gồm test che key, giới hạn thân trả lời sau gzip); không chạy `ai_key_*` / `open_chatgpt` / `ai_complete` trên exe (quy tắc 2). Phần TS của AI: gói C.
- **S:** quyền cửa sổ của exe ghim đúng 4 quyền (K1: `set_size` / `maximize` / `minimize` → "not allowed by ACL"); CSP và `identifier` không đổi, nay test giữ đủ; cửa sổ mới bị từ chối (K9); mọi lần chạy exe chặn DNS ngoài local, `requests blocked: []`. Chỗ hở duy nhất là test giữ capability (CLR5-B1).
- **P:** mục 6.2; không có phát hiện P.
- **B:** mục 6.1; không có mục mới.
- **T:** 37 đột biến (mục 7); ngoài CLR5-B1, các đột biến sống đều gần tương đương hay không nới exe (phụ lục 9.2).
- **A:** gói B không có màn; trang của exe ở K5, K10: tiêu đề cửa sổ theo màn, `role="alert"` không có khi không lỗi. Không thấy gì.

## 9. Phụ lục

### 9.1 Probe, log (mọi file ở `C:\workspace\deep-review-1-6-r5\claude\B\`)

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `hooks.mjs`, `mutant-config.mjs` | nạp TypeScript của repo cho probe Node; vitest với một file đột biến qua hook `load` (chép từ lượt 4, chỉ đổi chú thích / `LOAD`) | — | mọi probe JS, đột biến JS |
| `crate\`, `crate-target\`, `pristine\` | bản chép crate (+ `dist`, `index.html`, `package.json`, `rust-toolchain.toml`) và target riêng; `storage.rs`, `ai.rs`, `lib.rs` gốc ở `37a80b6` | `crate-control.log` (120 / 120), `build-cap1.log` | đột biến Rust, clippy, exe CAP1 |
| `mutrs.mjs` | 7 đột biến Rust (D4, DF2, DF3, DF4, D5, D6, D7) | `mutrs.log` | DR6-138 |
| `mutjs.mjs` | 13 đột biến JS (F1–F5, L0–L7) | `mutjs.log`, `mutjs.out` | DR6-139, DR6-140, T-332 |
| `mutfile.mjs`, `mutfiles\` | 17 đột biến file build qua bản chép test (NC6–NC13, NV1–NV5, CAP1–CAP4; `mutfiles\CAP1\extra.json` là file capability đã dùng, đã gỡ khỏi bản chép crate sau khi dựng exe) | `mutfile.log` | DR6-138, CLR5-B1 |
| `rs\common.rs`, `rs\new\`, `rs\old\`, `old\storage-2e51e25.rs` | probe Rust hai bản `storage.rs` (chép `common.rs` từ lượt 4): `matrix`, `time` | `rs-matrix-{new,old}.log`, `rs-time.log` | K6, 6.2 |
| `mkload.mjs`, `data\load13.db`, `data\load13-b.db` | dữ liệu tải thành file DB schema 13; bản thứ hai khác một byte gần cuối (cho `time`) | (in ra màn hình: 14 102 528 B, sha256 `f333adb3…`, 962 ms) | 6.2, K10 |
| `p-flush.mjs` | chuỗi lưu / thay / đóng (F1–F9) qua `openAppData` với storage giả của exe | `p-flush.log` | DR6-139, 140, 147, K2–K4 |
| `p-dr6-139.mjs` | tái hiện DR6-139 của lượt 4 trên code ghim và code cũ (`mut\F1__persist-queue.ts` + `mut\listeners.ts`) | `p-dr6-139.log` | DR6-139 |
| `p-listeners.mjs` | `notify` ↔ hai vòng cũ, 5 ca gọi lại | `p-listeners.log` | T-332 |
| `p-open.mjs` | `openAppData` + `flush` từ `load13.db` | `p-open.log` | 6.2 |
| `exe-lib.mjs` | chạy bản chép exe, cổng 9473, chặn mạng, thay `window.open` (chép từ lượt 4) | — | mọi probe exe |
| `exe-cap.mjs` | quyền cửa sổ: exe ghim ↔ exe có `extra.json` | `exe-cap.log` | CLR5-B1, K1 |
| `exe-old.mjs` | exe ghim mở file DB của exe lượt 4 | `exe-old.log` | K5 |
| `exe-firstsave.mjs` | lần lưu đầu, exe lượt 4 ↔ exe ghim xen kẽ | `exe-firstsave.log` | K7, 6.2 |
| `exe-newwin.mjs` | Ctrl / Shift / chuột giữa lên link | `exe-newwin.log` | K9 |
| `exe-lastroute.mjs` | màn dùng lần cuối khi file DB đã đổi | `exe-lastroute.log` | K10 |
| `logs\clippy-pedantic.log` | clippy pedantic trên bản chép crate | — | 6.1 |

Lỗi của chính probe (đã sửa; kết quả của lần hỏng không dùng):

- `p-flush.mjs` lần đầu: ca F3 đặt "lần lưu kế tiếp lỗi" sau khi thả lần lưu bị giữ, nên chính lần lưu bị giữ lỗi và Nạp lại bị từ chối (`RELOAD_UNSAVED_CHANGES`), script dừng. Sửa: chọn lần lưu lỗi theo số thứ tự (`failAt`, lần thứ 3 = lần lưu dữ liệu mới). F7 lần đầu dùng lần lưu tức thì nên không đo được gì (0 thay đổi); chạy lại với lần lưu 15 ms.
- `exe-newwin.mjs` lần đầu: lỗi cú pháp (`await` trong hàm không `async`), Node dừng trước khi gọi exe.
- `exe-lastroute.mjs` lần đầu: bộ chọn `a[href^="#/customer/"]` sai (route là `#/customers/<mã>`), hết giờ chờ; exe của lần đó đã thoát (`Get-Process project2c` rỗng sau đó), thư mục ca được dựng lại từ đầu ở lần chạy lại.
- Lệnh `sed` đầu tiên để thêm dòng nguồn vào `mutant-config.mjs` không khớp mẫu (không đổi gì); đã thêm bằng cách ghi dòng đầu rồi nối file.

### 9.2 Đột biến (37: 28 bị giết, 9 sống)

- **Rust** (`mutrs.log`, 7): bị giết 6 — D4, DF2 (đột biến lượt 4, nay đỏ đúng các test mới của #915), DF3, DF4, D6, D7. Sống 1: **D5** (`!is_dir()` thay `is_file()`: symlink tên như backup cũng tính; gần tương đương). Sau đợt: `storage.rs` của bản chép = repo (sha256); `git status --short` rỗng.
- **JS qua hook** (`mutjs.log`, 13): bị giết 11 — F1, F2, F4, F5, L0, L1, L2, L4, L5, L6, L7 (mỗi cái có `[mutant] served`). Sống 2: **F3** (bỏ vòng chờ việc theo dõi đầu `flush()`: trong lúc lần thay chạy không lệnh ghi nào được nhận, nên bản lỗi chỉ có thể là lần lưu của chính lần thay — gần tương đương), **L3** (`notify` duyệt bản chép của `Set`: chỉ khác khi listener gỡ / thêm listener khác ngay lúc được gọi, không có trong app — gần tương đương).
- **File build** (`mutfile.log`, 17): bị giết 11 — NC6–NC13, NV1–NV3. Sống 6: NV4 (`devCsp`, không vào exe), NV5 (`withGlobalTauri`, `__TAURI_INTERNALS__` vốn có, CSP chặn script ngoài) và **CAP1–CAP4 → CLR5-B1**. Đối chứng (bản chép test không đổi): 18 / 18 xanh.

### 9.3 Cuối phiên

- Repo: không ghi file nào của worktree (mọi đột biến qua bản chép / hook; mọi probe ghi dưới `claude\B\`). `git rev-parse HEAD` cuối phiên: `37a80b662861d308a110d1e2b0f65ad13b91fb51` (= SHA ghim). **`git status --short` cuối phiên: rỗng** (như đầu phiên).
- Bản chép crate: `storage.rs`, `ai.rs`, `lib.rs` = repo (sha256); `capabilities\` của bản chép chỉ còn `default.json` (file `extra.json` của CAP1 đã chuyển sang `mutfiles\CAP1\`).
- Probe không đặt ACL hay thuộc tính nào còn sót: `icacls claude\B\rs\run /T` không còn DENY; không file nào dưới `rs\run` mang `R` / `H` / `S`; dưới `claude\B\exe` không DENY nào ngoài hồ sơ WebView2.
- Không còn tiến trình `project2c.exe` nào (`Get-Process project2c` = 0).
- Giờ xong: 2026-11-04 23:04 (+07:00).

