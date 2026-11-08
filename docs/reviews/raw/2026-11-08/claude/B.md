XONG — claude gói B lượt 6, 2026-11-07 13:33 (+07:00)

# Deep review Phase 1–6, lượt 6 — Claude, gói B (File và Rust)

## 1. Phiên

- Bên: **Claude** (reviewer Claude, phiên sạch, chỉ đọc). ID phát hiện: `CLR6-B<số>`.
- Gói: **B — File và Rust** (`apps/desktop/src-tauri/**`, `apps/desktop/src/data/**` trừ file AI).
- SHA đầu phiên: `5b1328ae236aa62981dbf43066ff544a9e832c8c` (worktree `C:\workspace\Project-2C-review`, detached HEAD).
- `git status --short` đầu phiên: rỗng.
- Giờ bắt đầu: 2026-11-07 13:00 (+07:00).
- Công cụ: Claude Code trong app Claude desktop (tab Code), Windows 11 Pro (Home PC), PowerShell 7 + Git Bash; phiên app `local_15113077-f0e0-44c2-b1de-0d3310ba2429`, chế độ quyền `auto`.
- Model: **Claude Opus 5.5** (`claude-opus-5-5`); mức suy luận: **max** (đọc từ thông tin phiên của app, `effort: "max"`).
- Không dùng Workflow / ultracode. Không dùng skill `review-pr` / `code-review`.
- Subagent: **không** (mọi việc ở phiên chính).
- Bước 0: `B` thuộc thứ tự gói của Claude; `claude\B.md` chưa có → làm mới; `claude\A.md` có, dòng đầu `XONG — claude gói A lượt 6, 2026-11-07 12:58 (+07:00)`.

## 2. Bảng R

Cách làm chung (mọi probe, log, nguồn ở `C:\workspace\deep-review-1-6-r6\claude\B\`; Node v24.20.0 đặt đầu PATH ở mọi lệnh; repo không ghi byte nào, `git status --short` rỗng ở dòng cuối mọi log):

- **Đột biến JS** (`mutjs.mjs` + `mutant-config.mjs`, chép cách làm lượt 5): hook `load` của Vite phục vụ bản đột biến của đúng một file; chạy 5 file test (`persist-queue`, `app-data`, `listeners`, `ai-jobs`, `close-guard`; đối chứng 119 / 119), đột biến sống thì chạy cả 4 493 test.
- **Ca hợp đồng capability** (`mutcontract.mjs`): test phục vụ qua cùng hook, dòng `import … from 'node:fs'` thay bằng một **lớp phủ file**: file dưới `overlay\<id>\<đường dẫn repo>` thay hay thêm file đó cho `readFileSync` / `existsSync` / `readdirSync` của test; mỗi lần đọc lớp phủ ghi vào `overlay\<id>.trace` (đột biến "sống" chỉ tính khi test đã đọc lớp phủ). Đối chứng 18 / 18. `--old`: cùng đột biến trên test của `37a80b6` (để thấy phần sửa, không phải file, giết đột biến). Đột biến chính test (`muttest.mjs`): bộ lọc lệnh `tauri`, regex cờ config.
- **Qua lớp dữ liệu của app** (`hooks.mjs` chép lượt 5, `LOAD` → `r6\common`): `p-flush.mjs` (F1–F9 của lượt 5, chép nguyên), `p-dr6-162.mjs` (probe CXR5-B2: `openAppData` + storage giả giữ từng lần lưu, `closeAfterSaving` thật; `OLD_QUEUE=1` thay `./persist-queue` của `app-data.ts` bằng file của `37a80b6`, blob `c2357c2`).
- **Exe** (`exe-lib.mjs` chép lượt 5: bản chép exe trong `B\exe\<ca>\`, hồ sơ WebView2 riêng, cổng debug **9476**, DNS mọi host không local bị chặn, `route` hủy yêu cầu ngoài, `window.open` thay ngay; log kết thúc `requests blocked: []`). Exe debug dựng từ bản chép crate `B\crate\` (file git theo dõi của `src-tauri`, `dist` của bước chuẩn bị, `rust-toolchain.toml`), target riêng `B\crate-target`, `cargo build --features tauri/custom-protocol --locked --offline` (58 s).

### 2.1 Bảng R1 (3 dòng của gói B)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-161 | #1046 → #1064 (+ #1079 → #1090, #1095 → #1099, #1101 → #1109, #1111 → #1115) | **ĐÃ SỬA** (biến thể gần còn hở → **CLR6-B1**) | **Tái hiện lượt 5** = CAP1–CAP4 của CLR5-B1, chạy lại qua lớp phủ (`logs\mutcontract.log`): CAP1 `capabilities/extra.json`, CAP1b `capabilities/sub/extra.json`, CAP2 capability inline trong `app.security.capabilities`, CAP3 `remote.urls`, CAP4 `windows ["*"]`, và CAP5 `tauri.windows.conf.json` của thân PR → **KILLED** cả 6 (1 / 18 đỏ, đúng ca "allows the webview only the Tauri commands it uses", đúng `expect` của từng nguồn, vd. `expected [ 'default.json', 'extra.json' ] to deeply equal [ 'default.json' ]`, `expected { …(2) } to not have property "capabilities"`). **Gỡ phần sửa** (test của `37a80b6`, `--old`): cả 6 **sống**, 18 / 18 xanh | Biến thể gần bị giết: CAP6 `Tauri.windows.toml`, CAP7 `capabilities/extra.toml`, CAP8 `webviews ["*"]`, CAP9 quyền dạng object có `allow`. **Còn hở:** capability chỉ nêu trong `tauri::generate_context!(capabilities = [...])` của lib.rs, và `generate_context!("<thư mục khác>/tauri.conf.json")` → ca vẫn 18 / 18 xanh; exe dựng từ bản chép có `generate_context!(capabilities = …)` cho trang gọi được `set_size` / `maximize` (exe ghim: "not allowed by ACL") → **CLR6-B1** |
| DR6-162 | #1046 → #1064 (+ #1079 → #1090, #1095 → #1099) | **ĐÃ SỬA** | **Tái hiện lượt 5** (probe CXR5-B2 qua lớp dữ liệu, `logs\p-dr6-162.log`): listener của hàng đợi nghe lần lưu Team A xong thì chạy `AppData.run` Team B rồi Team C; X ngay. Code ghim: `maxInFlight 1`, sự kiện `save, saved ×3, destroy`, file lúc đóng "Team A, Team B, Team C, Team gốc". Cùng probe với `persist-queue.ts` của `37a80b6`: `maxInFlight 2`, `destroy` khi còn 1 lần ghi, file lúc đóng thiếu Team C (đúng CXR5-B2). **Gỡ sửa** (`logs\mutjs.log`): Q1 bỏ `if (last) return;` → **KILLED** (1 đỏ: ca "runs one write at a time when a listener told of a save saves twice…", `persist-queue.test.ts:338`) | Biến thể: Q2 đọc `waiting` sau `changed()` (drain cũ đi tiếp khi listener đặt `waiting`) → KILLED; Q3 nhả `running` ở mọi lượt ghi → KILLED. Hồi quy DR6-139: F1, F5 của lượt 5 vẫn KILLED (2 đỏ). Chuỗi F1–F9 của lượt 5 (`logs\p-flush.log`) chạy lại trên `5b1328a`: trùng log lượt 5 từng dòng (F7: 322 ms so 308 ms, cùng 18 lần đổi / 19 lần lưu) |
| DR6-163 | #1046 → #1064 | **ĐÃ SỬA** | `app-data.ts:279-285`: nhánh `if (!storage) return;` không còn; `storage!.save(bytes)` kèm chú thích vì sao luôn có storage. `rg "saves\.persist"` trong `apps/desktop/src` (trừ test): chỉ `app-data.ts:314` (trong `persist` của `open`, chỉ nối khi có storage) và `:349` (`storage && !migrated`). Coverage V8 (95 test của `app-data` + `persist-queue`, `B\coverage\coverage-final.json`): `app-data.ts` 51 nhánh, 2 không chạy — `:324` (`if (opening === mine)`, nhánh sai) và `:487` (`??` của `openFolder`), đúng hai nhánh thân PR nêu, có từ trước; `persist-queue.ts` 21 / 21 | S1 (đưa lại nhánh cũ) và S2 (`storage?.save`) sống cả 4 493 test: tương đương theo cấu trúc (nhánh không bao giờ chạy), đúng điều phần sửa nói. Không có nhánh chết mới |

### 2.2 Bảng R2 (4 Issue của gói B)

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-374 | #1079 → #1090 | **ĐÃ SỬA** (biến thể còn hở của phần capability → **CLR6-B1**) | Mục 1: `persist-queue.ts:115-118` lặp `while (running) await running;`; ca "idle() waits for the writes a listener told of the last one starts too" (`persist-queue.test.ts:356`) và "idle() does not wait for work tracked…" (`:370`) có. Gỡ sửa: Q4 (`idle` về bản `37a80b6`) → **KILLED** (1 đỏ, ca `:356`); Q5 (`if` thay `while`) → KILLED; Q6 (chờ cả việc `track`) → KILLED (42 đỏ: `:370` và mọi ca thay dữ liệu của `app-data`, vì lần thay chờ chính nó). Mục 2: T374a (`build = "build2.rs"` trong `[package]`), T374b (`capabilities_path_pattern` trong build.rs), T374c (`add_capability` trong lib.rs), T374d (`add_capability` trong `src/acl/mod.rs`) → **KILLED**; trên test `37a80b6` cả bốn sống | Còn hở: khóa `build` thụt lề hay viết trong ngoặc kép (`  build = …`, `"build" = …`, TOML hợp lệ) → sống; nguồn quyền `generate_context!(capabilities = …)` / config riêng → sống → **CLR6-B1**. Trong sản phẩm `idle()` chỉ `backUp` gọi, trong lượt đã chặn ghi (S2-2), không listener nào ghi: hành vi không đổi (F1–F9 trùng lượt 5) |
| T-381 | #1095 → #1099 | **ĐÃ SỬA** (biến thể còn hở → **CLR6-B1**) | Mục 1: T381a (script `dev` gốc thêm `--config x.json`) → **KILLED** (`not to match` regex cờ config); T381b (`TAURI_CONFIG` trong `ci.yml`) → **KILLED**; cả hai sống trên test `37a80b6`. Mục 2: helper `saveTwiceAfterFirst` (`persist-queue.test.ts:56-65`, không export) dùng ở ca DR6-162 (`:341`) và ca `idle()` (`:359`); không còn khối dựng chép (đọc file) | Còn hở: `--config` / `-c` chuyển tiếp qua `pnpm build:exe` (script gốc `build:exe` = `pnpm --filter @p2c/desktop build:exe --config …`, hay script / bước `run:` mới `pnpm build:exe --config …`; pnpm 12.6.0 nối đối số vào lệnh lá, thử trên workspace giả: `["build","--no-bundle","--config","x.json"]`); tên biến `tauri_config` chữ thường ở `env:` của workflow hay `[env]` của config Cargo (Rust trên Windows đọc `TAURI_CONFIG` từ tên đó, probe `envcase.exe`) → **CLR6-B1**. Thay chính bước `pnpm build:exe` bằng `pnpm build:exe -- --config x.json` thì đỏ, nhưng chỉ nhờ `expect` "có `pnpm build:exe`" (câu báo không nói cờ config) |
| T-382 (phần B) | #1101 → #1109 | **ĐÃ SỬA** (phần gói B: ca capability; `trash-view.ts` ở gói E) | T382a (`-- -Dclippy::pedantic` trong `verify:rust`) → xanh, đúng P1 của thân PR; T382b (bước `run:` một dòng gọi `tauri … --config`), T382c (khối `run: |`), T382d (`src-tauri/.cargo/config.toml` `[env] TAURI_CONFIG`) → **KILLED**; cả ba sống trên test `37a80b6`. Gỡ bộ lọc về `/\btauri\b/` (TM2, `logs\muttest.log`) → **KILLED** (lệnh cargo của `verify:rust` lọt vào danh sách mẫu) | Còn hở: bước build trong composite action `.github/actions/**/action.yml` (ca chỉ đọc `.github/workflows/*.y*ml`, lớp phủ không được đọc) → **CLR6-B1** |
| T-384 | #1111 → #1115 | **ĐÃ SỬA** | T384a (`npx @tauri-apps/cli build --config`), T384b (`node_modules\.bin\tauri.cmd build -c`), T384c (`pnpm dlx @tauri-apps/cli@2 build -c`) → **KILLED**; cả ba sống trên test `37a80b6`. Gỡ bộ lọc về bản T-382 (TM1) → **KILLED** (`expected [ 'tauri build --no-bundle', …(2) ] to deeply equal [ …(7) ]`) | Ba dạng của mục ACCEPTED review #1115 (`tauri.ps1`, `tauri.CMD`, `"node_modules/.bin/tauri"`) vẫn sống: KNOWN, không có bằng chứng mới. Dạng khác còn sống: `node node_modules/@tauri-apps/cli/tauri.js build --config …`; regex cờ config không có ca mẫu nào giữ (TM3: bỏ `-c` khỏi regex → 18 / 18 xanh) → gộp vào **CLR6-B1** |

## 3. Phạm vi đã đọc

**Diff `37a80b6..5b1328a` của gói B** (`git diff --numstat -M 37a80b6 5b1328a -- apps/desktop/src-tauri apps/desktop/src/data`): `app-data.ts` +3 / −3 (T-364), `persist-queue.ts` +10 / −2 (T-364 `drain` dừng sau lượt ghi cuối, T-374 `idle()` lặp), `persist-queue.test.ts` +63 / −1 (ca DR6-162, hai ca `idle()`, helper `saveTwiceAfterFirst`), `tauri-contract.test.ts` +109 / −9 (T-364, T-374, T-381, T-382, T-384). Commit: `292a63e` (#1064), `bf8dee7` (#1090), `b2ef4c1` (#1099), `4d38a72` (#1109, phần gói B), `a53a1d8` (#1115). `src-tauri/**` không đổi (diff rỗng). Đọc từng hunk và cả file sau đổi.

**File của `common\files-B.txt` (21 file):**

| File | Đọc |
|---|---|
| `src-tauri/build.rs`, `src/main.rs`, `src/lib.rs` | đủ |
| `src-tauri/src/storage.rs` | phần sản phẩm 1–682 đủ; khối test 683–2207 (77 `#[test]`) **không đọc từng dòng**: file không đổi từ lượt 5 (`git diff --stat 37a80b6 5b1328a -- apps/desktop/src-tauri` rỗng), lượt 4 và lượt 5 đã chạy 24 + 7 đột biến Rust trên nó |
| `src-tauri/src/ai.rs` | phần sản phẩm 1–578 đủ; khối test 579–2052 (43 `#[test]`) **chỉ đọc tên hàm**: không đổi từ `2e51e25` (`git diff --stat 2e51e25 5b1328a` rỗng); AI là trọng tâm gói C; 120 test Rust xanh ở `baseline.md` |
| `src/data/app-data.ts`, `persist-queue.ts`, `listeners.ts`, `tauri-storage.ts`, `AppDataContext.tsx`, `tables.ts`, `today.ts`, `demo-snapshot.ts` | đủ |
| `src/data/persist-queue.test.ts`, `tauri-contract.test.ts`, `today.test.ts`, `tauri-storage.test.ts`, `tables.test.ts`, `demo-snapshot.test.ts`, `listeners.test.ts` | đủ |
| `src/data/app-data.test.ts` (1 563 dòng) | **chỉ đọc tên 68 ca (`it`) và các chỗ gọi `saves.idle()` / `flush()`**: không đổi từ `37a80b6`; dùng làm bộ giết đột biến (mục 9) |

Ngoài danh sách (cấu hình build mà ca hợp đồng đọc, không nằm trong `files-B.txt` vì `classifyFile` chỉ đếm file mã): `src-tauri/Cargo.toml`, `tauri.conf.json`, `capabilities/default.json`, `apps/desktop/package.json`, `package.json` gốc, `.github/workflows/ci.yml` (dòng `run:` / `env:`), `.gitattributes`.

**Chỗ nối gói khác:** `src/main.tsx`, `src/shell/{close-guard.ts, SaveWarning.tsx}` (đủ), `routes/reports/report-workbook.ts` (tên file xuất), `packages/db/src/database.ts` (`transaction` → `persist`, chỉ phần đó). Mã nguồn Tauri trong registry của cargo: `tauri-build-2.6.3/src/lib.rs:467-530` (`try_build`, `TAURI_CONFIG`), `src/acl.rs:400-440`; `tauri-codegen-2.6.3/src/context.rs:400-417`, `src/lib.rs:53-90`; `tauri-macros-2.6.3/src/context.rs` (đủ 1–170); `tauri-utils-2.9.3/src/acl/mod.rs:345-401`, `src/config/parse.rs:160-220`; `@tauri-apps/cli/package.json` (`bin`).

**Tài liệu:** `CLAUDE.md` gốc, `apps/desktop/CLAUDE.md`, `.claude/rules/{i18n-ui,tests}.md`; `common\prompt-claude.md` (đủ), `plan.md` (§4, §L6.0–§L6.9, `dot2.mjs` phần `treeTargets`), `known.md` (phần 1 OPEN và ACCEPTED đủ, trừ đoạn đầu OPEN 46 855 ký tự chỉ tìm theo từ khóa gói B; phần 2 K1–K50; phần 4, 5), `fixes.md` (#1046 / #1064, #1079 / #1090, #1095 / #1099, #1101 / #1109, #1111 / #1115 và nhóm RESOLVED), `baseline.md` (đủ); tổng hợp lượt 5 §6.2 và CXR5-B1 (§3.1, §5.1); báo cáo gốc lượt 5 `claude/B.md` (đủ), `codex/B.md` (đủ), `deepseek/B.md` (DSR5-B1); `claude\A.md` lượt 6 (dòng đầu, để không báo trùng). Probe lượt 5 của Claude mở theo đường dẫn báo cáo gốc ghi: `B\{hooks.mjs, mutant-config.mjs, mutjs.mjs, mutfile.mjs, p-flush.mjs, exe-lib.mjs, exe-cap.mjs, logs\p-flush.log}`.

## 4. Kịch bản đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| K1 | Ca hợp đồng capability qua lớp phủ file: 6 đột biến tái hiện DR6-161 (CAP1–CAP5), 4 biến thể (CAP6–CAP9), 4 đột biến T-374, 2 T-381, 4 T-382, 3 T-384 và 3 dạng ACCEPTED; cùng các đột biến trên test `37a80b6` (`--old`) | Mọi đột biến của phần sửa bị giết (1 / 18 đỏ, đúng `expect` của nguồn đó), trên test cũ cả 18 sống; T382a (`-Dclippy::pedantic`) xanh đúng; ba dạng ACCEPTED vẫn sống (KNOWN) | — (bảng R) |
| K2 | Nguồn quyền / config chưa ai thử: `generate_context!(capabilities = …)`, `generate_context!("release/tauri.conf.json")`, `--config` chuyển qua `pnpm build:exe` (sửa script gốc, script mới, bước CI thêm), `tauri_config` chữ thường (workflow, `[env]` Cargo), khóa `build` thụt lề / trong ngoặc kép, composite action, `node …/@tauri-apps/cli/tauri.js` | Cả 10 dạng: ca hợp đồng 18 / 18 xanh (đã đọc file phủ, trừ composite action mà ca không đọc); regex cờ config không có ca mẫu (TM3 sống) | CLR6-B1 |
| K3 | Exe debug dựng từ bản chép crate chỉ khác lib.rs ở `generate_context!(capabilities = [".../acl/window.json"])` ↔ exe release ghim; từ trang gọi `plugin:window|set_size`, `maximize`, `minimize` | Exe ghim: cả ba "not allowed by ACL"; exe bản chép: `set_size` ok (1440x900 → 1200x760), `maximize` ok (→ 2560x1009), `minimize` bị chặn; `gen\schemas\capabilities.json` của bản chép chỉ có `default`; `requests blocked: []`, thoát 0 cả hai | CLR6-B1 |
| K4 | pnpm 12.6.0 chuyển tiếp đối số (workspace giả trong `B\pnpm-args\ws\`): `pnpm build:exe --config y.json`, `pnpm release` (= `pnpm build:exe --config x.json`), `pnpm build:exe -- -c z.json`; Rust đọc `TAURI_CONFIG` khi tiến trình chỉ có `tauri_config` (`B\envcase\`) | Lệnh lá nhận `["build","--no-bundle","--config","y.json"]` (cả ba dạng); `std::env::var("TAURI_CONFIG")` = `Ok("{\"app\":{}}")` | CLR6-B1 |
| K5 | DR6-162 qua lớp dữ liệu (probe CXR5-B2): listener của hàng đợi chạy hai lệnh `AppData.run` khi lần lưu đầu xong, rồi X; hàng đợi ghim ↔ hàng đợi `37a80b6` | Ghim: 1 lần ghi tại một lúc, đóng khi file có cả A, B, C; `37a80b6`: 2 lần ghi chồng, đóng khi còn 1 lần ghi, file thiếu C | — (R1 DR6-162) |
| K6 | Chuỗi lưu / thay / đóng của lượt 5 (F1–F9: X khi lần lưu bị giữ rồi Nạp lại; X rồi Nhập backup + Nạp lại xếp hàng; lần thay mà lưu dữ liệu mới lỗi rồi Thử lại; backup lỗi; Dọn sạch; hai `flush`; X khi đang đổi dữ liệu; listener ném / tự gỡ; hộp đóng app và lần lưu khác) chạy lại trên `5b1328a`, sau `drain` dừng và `idle()` lặp | Trùng log lượt 5 từng dòng (F7 322 ms so 308 ms) | — |
| K7 | Đột biến hàng đợi / `app-data` (Q1–Q6, F1, F5, S1, S2) và coverage nhánh của `app-data.ts`, `persist-queue.ts` | 8 bị giết; S1, S2 (DR6-163) sống, tương đương; nhánh không chạy chỉ `:324`, `:487` có từ trước | — (bảng R) |

## 5. Phát hiện mới

### CLR6-B1 — Ca hợp đồng capability vẫn bỏ sót nguồn quyền và nguồn config của exe: `generate_context!(capabilities = …)` / config riêng trong lib.rs, `--config` chuyển qua `pnpm build:exe`, tên biến `tauri_config`, khóa `build` thụt lề, composite action

```
ID: CLR6-B1
Mức: Low
Trục: T (phụ: S)
Vị trí: apps/desktop/src/data/tauri-contract.test.ts:338-456 (ca "allows the webview only the Tauri commands it uses": nguồn quyền :345-364, config gộp lúc build :365-440), :461-475 (CSP), :479-481 (identifier); apps/desktop/src-tauri/src/lib.rs:203 (`.run(tauri::generate_context!())`) (5b1328a)
Tình trạng: CONFIRMED
Liên quan: DR6-161, T-374, T-381, T-382, T-384 (họ "ca capability kiểm đủ nguồn quyền"); mục ACCEPTED review #1115 (ba dạng gọi CLI: KNOWN, không tính ở đây) · có từ trước (ca từ #617; các nguồn dưới đây chưa ca nào giữ từ khi T-364 mở rộng ca), lượt 1–5 và review các PR T-374…T-384 bỏ sót
```

- **Mô tả:** ca tự nhận là "the one check of them all" của quyền webview trong exe (bản web của e2e không có ACL, K37 / G6), và từ T-381 khẳng định "No script of the app or the root nor `run:` of a workflow passes either [`-c` / `--config` / `TAURI_CONFIG`]". Ca liệt kê nguồn bằng mẫu chữ, và còn bỏ sót:
  1. **Hai nguồn quyền / config trong code Rust** (cùng loại với `add_capability` mà T-374 đã thêm): `tauri::generate_context!(capabilities = ["…json"])` nạp thêm file capability nằm ngoài `capabilities/` (`tauri-macros-2.6.3/src/context.rs:66-94`, `tauri-utils-2.9.3/src/acl/mod.rs:378-398` chèn vào tập capability của exe), và `tauri::generate_context!("<thư mục khác>/tauri.conf.json")` lấy config (capability inline, CSP, `identifier`) từ file khác (`context.rs:36-56`, `:151-163`). Ca chỉ tìm chuỗi `add_capability` trong `src/**/*.rs`, nên cả hai giữ 18 / 18 xanh. `gen/schemas/capabilities.json` (tauri-build `acl.rs:424-433`) cũng không ghi capability của `generate_context!`.
  2. **Cờ config chuyển tiếp qua `pnpm build:exe`:** `noConfig` chỉ chạy trên lệnh gọi CLI tauri; `pnpm build:exe --config x.json` (script gốc `build:exe` sửa thành `pnpm --filter @p2c/desktop build:exe --config …`, một script mới, hay một bước `run:` thêm) không chứa chữ `tauri`, nhưng pnpm nối đối số vào lệnh lá: `tauri build --no-bundle --config x.json`. Đây lại là cách build mà `CLAUDE.md` và CI dùng.
  3. **Tên biến chữ thường:** ca tìm đúng chữ `TAURI_CONFIG`; trên Windows tên biến môi trường không phân biệt hoa / thường, nên `tauri_config` ở `env:` của workflow hay `[env]` của config Cargo vẫn tới `env::var("TAURI_CONFIG")` của tauri-build (`lib.rs:487-490`) và tauri-codegen (`lib.rs:83`).
  4. **Khóa `build` của Cargo.toml:** `/^build\s*=/m` bỏ khóa thụt lề (`  build = "x.rs"`) hay viết trong ngoặc kép (`"build" = "x.rs"`), cả hai là TOML hợp lệ trong `[package]`.
  5. **Composite action:** ca chỉ đọc `.github/workflows/*.y*ml`; bước build trong `.github/actions/<tên>/action.yml` (dùng qua `uses: ./.github/actions/…`) không được đọc.
  6. **Dạng gọi CLI khác** ngoài ba dạng đã ACCEPTED: `node node_modules/@tauri-apps/cli/tauri.js build --config …` (`bin.tauri` của gói là `./tauri.js`).
  7. **Regex cờ config không có ca mẫu nào giữ:** T-384 thêm mẫu cho bộ lọc lệnh, nhưng regex `/(?:^|\s)(?:-[A-Za-z]*c|--config\b)/` chỉ được thử bằng probe tạm của các PR; bỏ `-c` khỏi regex (TM3) → 18 / 18 xanh.
- **Tái hiện / bằng chứng:**
  - Lớp phủ file (`node mutcontract.mjs …`, `logs\mutcontract.log`, đối chứng 18 / 18; dòng "SURVIVED" chỉ tính khi `overlay\<id>.trace` cho thấy test đã đọc file phủ): T374v3 (lib.rs `generate_context!(capabilities = ["./acl/window.json"])` + `acl/window.json`) → `SURVIVED — Tests 18 passed (18) — overlay: 3 (…\src\lib.rs; …)`; T374v4 (`generate_context!("release/tauri.conf.json")` + config có capability inline) → SURVIVED; T381v5 (script gốc `build:exe` = `pnpm --filter @p2c/desktop build:exe --config src-tauri/release.json`) → SURVIVED; T381v1 (script `release` = `pnpm build:exe --config …`), T381v2b (bước `- run: pnpm build:exe --config x.json` thêm vào `ci.yml`) → SURVIVED; T381v3 (`env: tauri_config` ở `ci.yml`), T381v4 (`apps/desktop/src-tauri/.cargo/config.toml` `[env] tauri_config = "{}"`) → SURVIVED; T374v1 (`  build = "build2.rs"`), T374v2 (`"build" = "build2.rs"`) → SURVIVED; T382v1 (`.github/actions/build/action.yml` chạy `tauri build --config`) → test không đọc file đó (trace rỗng), 18 / 18; T384v1 (`node node_modules/@tauri-apps/cli/tauri.js build --config x.json`) → SURVIVED. `node muttest.mjs` (`logs\muttest.log`): TM3 → `SURVIVED — Tests 18 passed (18)`.
  - Exe (`node exe-gc.mjs`, `logs\exe-gc.log`): exe release ghim, từ trang gọi `plugin:window|set_size` / `maximize` / `minimize` → `refused: Command plugin:window|set_size not allowed by ACL` (cả ba), cửa sổ giữ 1440x900. Exe debug dựng từ bản chép crate mà lib.rs chỉ khác `.run(tauri::generate_context!(capabilities = [".../acl/window.json"]))`, `capabilities\` chỉ có `default.json` → `setSize: "ok null"`, `afterSize: "1200x760"`, `maximize: "ok null"`, `afterMax: "2560x1009"`, `minimize` (không có trong `window.json`) vẫn bị chặn; `gen\schemas\capabilities.json` của bản chép chỉ có `default`; `requests blocked: []`.
  - pnpm chuyển tiếp đối số (`B\pnpm-args\ws\`, pnpm 12.6.0 của corepack, workspace giả: script gốc `build:exe` = `pnpm --filter app build:exe`, lệnh lá in `argv`): `pnpm build:exe --config y.json` → `$ pnpm --filter app build:exe "--config" "y.json"` → `tauri would get: ["build","--no-bundle","--config","y.json"]`; `pnpm release` (= `pnpm build:exe --config x.json`) và `pnpm build:exe -- -c z.json` cũng vậy.
  - Tên biến (`B\envcase\envcase.rs`, `rustc 1.98.1`): tiến trình chỉ có biến tên `tauri_config` = `{"app":{}}` → `std::env::var("TAURI_CONFIG")` = `Ok("{\"app\":{}}")`.
- **Cùng mẫu:** `rg -n "tauri\.conf\.json|capabilities/default\.json|TAURI_CONFIG|generate_context" -g "!docs/**" -g "!*.md"` → chỉ `tauri-contract.test.ts` kiểm các nguồn này (`:273`, `:339`, `:353`, `:366`, `:439`, `:444`) và `lib.rs:203` là lời gọi duy nhất của `generate_context!` (không đối số). Hai ca khác của cùng file dựa trên cùng giả định "chỉ `tauri.conf.json`, không gộp config": ca CSP (`:461`, DR6-138) và ca `identifier` (`:479`, K39) đọc `tauriConf()` = `src-tauri/tauri.conf.json`; mục 1–3 ở trên (config riêng, `--config` chuyển tiếp, `tauri_config`) đổi được CSP / `identifier` của exe mà hai ca này vẫn xanh. Không có test hợp đồng nào khác của bản build trong repo: `e2e` chạy bản web, `tools/pr-core.test.mjs:627` chỉ liệt kê đường dẫn cho luật nhãn `build-exe` (`needsExe`), các chỗ khớp còn lại là chú thích (`packages/ui/src/theme.css:63`, `e2e/navigation.spec.ts:23`, `:144`).
- **Ảnh hưởng:** quyền webview, CSP và `identifier` của exe ở `5b1328a` đúng (exe ghim từ chối `set_size` / `maximize` / `minimize`; `gen/schemas/capabilities.json` của worktree chỉ có `default`; lib.rs không có đối số; không script, workflow hay config Cargo nào của repo có dạng ở trên). Chỉ PR sau thêm một trong các dạng trên mới mở thêm quyền / nới CSP mà CI vẫn xanh, trong khi mọi quyền mới là cổng G6 (K37) và tên ca nói "only the Tauri commands it uses". Review đọc diff vẫn thấy. Đóng băng K49 làm khả năng có PR như vậy trước v1.0 rất thấp.
- **Chặn phát hành:** không — Low trục T (test hở của chốt chặn, không phải lỗ quyền: quyền hiện tại đúng, exe ghim đã thử), như DR6-161 được xếp ở lượt 5; không hậu quả lên dữ liệu đã lưu, backup, key hay output AI.
- **Đề xuất:** dừng vá từng mẫu chữ (mỗi lượt lại thêm một dạng: T-374 → T-381 → T-382 → T-384 → mục này); kiểm **kết quả** thay vì nguồn: một bước sau `pnpm build:exe` ở job build exe của CI chạy exe release với cổng debug (như `e2e/perf`), từ trang gọi vài lệnh cửa sổ không được cấp (`set_size`, `maximize`, `minimize`, `plugin:webview|create_webview_window`) và đòi "not allowed by ACL", gọi `set_title` thì được, và đọc CSP thật của trang (vd. `securitypolicyviolation` khi nạp `https://example.invalid` dạng `img`). Một máy kiểm trên exe phủ cả họ (mọi nguồn quyền / config, kể cả dạng chưa ai nghĩ ra), ≈ 40–70 dòng probe + 5–10 dòng CI, không thêm dependency (Playwright có sẵn). Trước v1.0 (K49): ghi sổ [sau v1.0], hoặc Owner chấp nhận như mục ACCEPTED #1115. Nếu chỉ vá trong ca hiện có: thêm `generate_context!(` có đối số vào danh sách cấm (≈ 3 dòng test) là mục đáng nhất.

Ngoài CLR6-B1 không có phát hiện mới ở gói B (A5 của `claude\A.md` chạm `app-data.ts:456-461` `exportBackup`, đã báo ở gói A, không ghi lại).

## 6. Bloat, hiệu năng

Không bắt buộc ở gói B (§L6.4; gói F và chủ đề G làm). Phần sản phẩm của gói đổi +13 / −5 dòng (`baseline.md`), không thêm export, hàm hay dependency; `idle()` thành `async` (thêm một microtask mỗi lần `backUp`), không đổi số lần ghi (K6: F1–F9 trùng lượt 5). Không phát hiện P / B.

## 7. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | 0 |
| Low | | | | | (CLR6-B1*) | | | CLR6-B1* | | 1 |
| Nit | | | | | | | | | | 0 |

\* gắn T (chính) và S (phụ), đếm một lần ở trục chính. CONFIRMED 1 / 1, PLAUSIBLE 0, KNOWN 0 (ba dạng gọi CLI của mục ACCEPTED review #1115 chạy lại, vẫn như ghi: không có bằng chứng mới, không ghi). **Đề xuất chặn phát hành: 0; không chặn: 1** (CLR6-B1: Low trục T). Có từ trước / do đợt sửa: CLR6-B1 là biến thể còn hở của họ T-364 → T-384 (một phần có từ ca #617). Bảng R: **R1 3 / 3 ĐÃ SỬA** (DR6-161, 162, 163), **R2 4 / 4 ĐÃ SỬA** (T-374, T-381, T-382 phần B, T-384); không SỬA MỘT PHẦN, CHƯA SỬA hay HỒI QUY. Đột biến: 10 JS (8 bị giết, 2 tương đương: S1, S2 của DR6-163), 3 trên chính test (2 bị giết, TM3 sống → CLR6-B1), ca hợp đồng 38 đột biến trên test ghim (23 bị giết: 22 của phần sửa và biến thể gần, cộng T381v2 nhờ `expect` khác; 1 xanh đúng: T382a; 11 biến thể sống → CLR6-B1, gồm T382v1 mà ca không đọc; 3 dạng ACCEPTED sống → KNOWN) và 18 đột biến của phần sửa trên test `37a80b6` (đều sống: phần sửa là thứ giết).

## 8. Đã xét, không thấy

- **R:** mục 2. Tái hiện lượt 5 nay ra đúng (CAP1–CAP4 bị giết; probe CXR5-B2 qua `AppData`: 1 lần ghi tại một lúc, file lúc đóng đủ; nhánh `:282` không còn, coverage không có nhánh chết mới). Test của mọi PR sửa đỏ khi gỡ phần sửa (Q1, Q4, Q5, Q6, T374a–d, T381a–b, T382b–d, T384a–c, TM1, TM2). Ghi chú sổ đã gom (RESOLVED của T-374, T-381, T-382, T-384): không hỏng lại (helper `saveTwiceAfterFirst` một chỗ; bộ lọc hai regex `cli`; `runs` đọc mọi workflow; `cargoConfigs` bốn thư mục). Biến thể còn hở: CLR6-B1.
- **E:** chuỗi lưu / thay / đóng chồng nhau F1–F9 (K6), listener của hàng đợi gọi lệnh lồng rồi X (K5), `idle()` khi có việc `track` (ca `:370`, Q6), lần ghi cuối lỗi rồi listener gọi `flush()` (đọc code: `flush` mở `drain` mới, `idle` chờ cả nó); `drain` không thể kết thúc mà không qua `return` (vòng chỉ vào khi `waiting` có, `persist` luôn đặt `waiting` khác rỗng). Không thấy lỗi khác.
- **C:** doc của `idle()` ("Resolves once no write is running or waiting"), `flush()`, `track()` khớp hành vi đo được (ca `:356`, `:370`, K5, K6); chú thích DR6-163 ở `app-data.ts:279-280` đúng (mọi `saves.persist` của sản phẩm chỉ khi có storage, `flush` chỉ ghi lại bản đã từng ghi); S2-1…S2-6 (spec Phase 6 §4.1, K13, K35) đúng ở mọi chuỗi K6. Ca hợp đồng nói "the one check of them all": không đúng hết (CLR6-B1).
- **D:** sau mọi chuỗi K5, K6 file cuối là một trạng thái đủ; lần thay bị từ chối không đổi dữ liệu (F4); với hàng đợi ghim, file lúc đóng có mọi thay đổi trong bộ nhớ (K5). `storage!` (DR6-163) không đổi gì của web (hàng đợi web không bao giờ ghi).
- **G:** `ai.rs` không đổi từ `2e51e25`; đọc lại phần sản phẩm: `check` trước khi đọc key, `reveals` / `mask` qua bốn cách đọc, `is_finish_word`, `server_message` chỉ lấy ba trường; không gọi `ai_complete` / `ai_key_*` / `open_chatgpt` nào (quy tắc 2), exe chỉ chạy trang Tổng quan.
- **S:** exe ghim từ chối `set_size`, `maximize`, `minimize` (K3; lượt 4 K2 đã thử thêm `set_resizable`, `set_always_on_top`, `close`, `create_webview_window`); `is_export_name`, `folder()`, `explorer()` / `explorer_arg`, `STALE_PAGE`, `DataLock` đọc lại, không đường mới nào từ webview tới đường dẫn hay chương trình; `blocking()` không có đường panic (đọc `storage.rs` 1–682: không `unwrap` / chỉ số ngoài cỡ trong đường lệnh). Danh sách import của ca hợp đồng (`tauriImports`, `tauri-contract.test.ts:281-299`, đọc regex) chỉ nhận `import { … } from '@tauri-apps/api/<mô-đun>'`, nên import `* as` / import động không hiện; nhưng shell chỉ nhận kiểu hẹp `AppWindow` (`CloseGuard.tsx:10-17`: `onCloseRequested`, `destroy`, `setTitle`), nên lời gọi mới vẫn hiện ở diff, và quyền vẫn do capability giữ: không ghi phát hiện. Chỗ hở là chốt chặn capability / config (CLR6-B1).
- **P:** đường lưu chỉ thêm một microtask ở `idle()`; F7 (`flush` khi đang đổi dữ liệu) 322 ms so 308 ms lượt 5, cùng số lần lưu (một lần chạy Node, không phải số đo hiệu năng chính thức); số đo exe ở `baseline.md` không dòng nào ⚠️. Không phát hiện P.
- **B:** mục 6; `icons/icon.png` là ảnh dự phòng của Tauri cho đích không phải Windows (`tauri-codegen-2.6.3/src/context.rs:211-244`), lượt 4–5 đã ghi; không mục mới.
- **T:** mục 7; ngoài CLR6-B1, đột biến sống chỉ có S1, S2 (DR6-163, tương đương theo cấu trúc).
- **A:** gói B không có màn; exe hiện "Tổng quan · Heritas L-CRM" ở cả hai bản (K3).

## 9. Phụ lục

### 9.1 Probe, log (mọi file ở `C:\workspace\deep-review-1-6-r6\claude\B\`)

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `mutant-config.mjs` | vitest trên worktree ghim với một file đột biến qua hook `load` (chép lượt 5) | — | mọi đột biến JS |
| `mutjs.mjs`, `mut\` | 10 đột biến `persist-queue.ts` / `app-data.ts` (Q1–Q6, F1, F5, S1, S2) | `logs\mutjs.log` | DR6-162, DR6-163, T-374 |
| `mutcontract.mjs`, `overlay\<id>\`, `overlay\<id>.trace`, `mutfiles\tauri-contract.overlay*.test.ts` | ca hợp đồng qua lớp phủ file; `--old` = test của `37a80b6` | `logs\mutcontract.log` | DR6-161, T-374, T-381, T-382, T-384, CLR6-B1 |
| `muttest.mjs` | 3 đột biến của chính test (TM1–TM3) | `logs\muttest.log` | T-382, T-384, CLR6-B1 |
| `hooks.mjs` | nạp TypeScript của repo cho probe Node (chép lượt 5, `LOAD` → `r6\common`) | — | `p-flush.mjs`, `p-dr6-162.mjs` |
| `p-flush.mjs` | F1–F9 của lượt 5, chép nguyên | `logs\p-flush.log` | DR6-162 (hồi quy), K6 |
| `p-dr6-162.mjs`, `old\persist-queue.ts`, `old\listeners.ts` | probe CXR5-B2 qua `openAppData` + `closeAfterSaving`; `OLD_QUEUE=1` dùng hàng đợi `37a80b6` (blob `c2357c2`) | `logs\p-dr6-162.log` | DR6-162, K5 |
| `coverage\coverage-final.json` | coverage V8 của `app-data.ts`, `persist-queue.ts` (95 test) | — | DR6-163 |
| `crate\`, `crate-target\` | bản chép crate (lib.rs khác ở `generate_context!(capabilities = …)`, thêm `acl\window.json`), exe debug | `logs\build-gc.log` | CLR6-B1, K3 |
| `exe-lib.mjs`, `exe-gc.mjs`, `exe\` | chạy bản chép exe ghim và exe debug, cổng 9476, chặn mạng, thay `window.open` | `logs\exe-gc.log` | CLR6-B1, K3 |
| `pnpm-args\`, `pnpm-args\ws\` | pnpm 12.6.0 chuyển tiếp đối số qua script lọc workspace | (in ra màn hình, chép ở mục 5) | CLR6-B1, K4 |
| `envcase\envcase.rs`, `envcase.exe` | Rust đọc `TAURI_CONFIG` từ tên `tauri_config` | (in ra màn hình) | CLR6-B1, K4 |

Lỗi của chính probe (đã sửa; kết quả của lần hỏng không dùng):

- `mutcontract.mjs` lần 1: vết đọc lớp phủ in ra `console.error` mà vitest giấu ở test xanh, nên mọi đột biến sống bị ghi "OVERLAY NOT READ"; thêm `--silent=false` không đủ; sửa: ghi vết vào file `overlay\<id>.trace` (chuỗi `\n` trong template phải viết `\\n`). Lần 1 cũng thay chính bước `run: pnpm build:exe` cho T381v2 nên ca đỏ vì `expect` "có `pnpm build:exe`"; thêm T381v2b (bước mới) và T381v5 (script gốc).
- `p-dr6-162.mjs` lần đầu đặt `ask` trả `'cancel'` (không phải `CloseChoice`); sửa thành `'stay'` trước khi chạy.
- `pnpm-args\package.json`: script `inner` dùng `node -e` nên `node` tự đọc `--config` là cờ của nó ("bad option"); dòng `$ node -e … "--config" "x.json"` của pnpm vẫn cho thấy đối số được nối; lần sau dùng file `print.cjs`.

### 9.2 Đột biến

- **JS** (`logs\mutjs.log`, 10): bị giết 8 — Q1, Q2, Q3 (DR6-162), Q4, Q5, Q6 (T-374), F1, F5 (DR6-139, hồi quy). Sống 2 — S1, S2 (DR6-163: tương đương, nhánh không bao giờ chạy). Đối chứng 119 / 119.
- **Ca hợp đồng** (`logs\mutcontract.log`): test ghim, đối chứng 18 / 18 — bị giết: CAP1, CAP1b, CAP2–CAP9, T374a–d, T381a, T381b, T382b–d, T384a–c, và T381v2 (thay chính bước build, đỏ nhờ `expect` khác); xanh đúng: T382a; sống: T374v1–v4, T381v1, T381v2b, T381v3, T381v4, T381v5, T382v1 (file không được đọc), T384v1 (→ CLR6-B1), T384k1–k3 (KNOWN). Test `37a80b6` (`--old`), đối chứng 18 / 18: 18 đột biến của phần sửa đều sống.
- **Chính test** (`logs\muttest.log`, 3): TM1, TM2 bị giết; TM3 sống (→ CLR6-B1).

### 9.3 Cuối phiên

- Repo: không ghi file nào của worktree (mọi đột biến qua hook `load` / lớp phủ, mọi probe và bản chép dưới `claude\B\`; coverage ghi vào `claude\B\coverage\`). `git rev-parse HEAD` cuối phiên: `5b1328ae236aa62981dbf43066ff544a9e832c8c` (= SHA ghim). **`git status --short` cuối phiên: rỗng** (như đầu phiên).
- Không còn tiến trình `project2c.exe` nào; cổng 9476 không còn ai nghe.
- Không gọi `gh`, không chạy công cụ repo gọi GitHub, không gọi dịch vụ AI; không mở thư mục của bên khác hay của lượt cũ ngoài các file probe của chính Claude lượt 5 theo đường dẫn đủ (mục 3).
- Giờ xong: 2026-11-07 13:33 (+07:00).
