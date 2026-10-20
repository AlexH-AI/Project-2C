XONG — claude gói B lượt 3, 2026-10-20 20:12

# Deep review Phase 1–6, lượt 3 — Claude, gói B (File và Rust)

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên | claude (ID `CL3`) |
| Gói | B — File và Rust (`apps/desktop/src-tauri/**`, `apps/desktop/src/data/**` trừ file AI) |
| Worktree | `C:\workspace\Project-2C-review`, detached |
| SHA đầu phiên | `119e2e45cbce54d8a3943757bd826a7f1e9b694f` (`git rev-parse HEAD`, đúng SHA ghim) |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 2026-10-20 19:21 (`Get-Date` 19:21:14) |
| Máy | Home PC `DESKTOP-KDURKJP` (`$env:COMPUTERNAME`) |
| Công cụ | Claude Code CLI (Windows 11, PowerShell 7 + Git Bash), Node v24.20.0, rustc / cargo 1.98.1, Playwright của repo (nối CDP vào bản chép exe) |
| Model | Claude Opus 5.5 (`claude-opus-5-5`) |
| Mức suy luận | max |
| Ultracode | **tắt** — không subagent, không Workflow; mọi việc làm trong phiên chính |
| Bước 0 | gói B hợp lệ; `claude\B.md` chưa có → làm mới; `claude\A.md` có, dòng đầu `XONG — claude gói A lượt 3, 2026-10-20 19:20` |
| Song song | Codex chạy cùng lúc (2 tiến trình `codex`, worktree `Project-2C-review-2`). Trước mỗi lần chạy exe: không `project2c.exe` nào khác, không cổng 9200–9400 nào nghe; CPU 0–10 % lúc đo. Exe chạy bản chép ở `r3\claude\B\exe\<ca>\`, cổng debug 9371 / 9372, profile WebView2 riêng mỗi thư mục. Không chạy `pnpm e2e` (cổng 4173) |

## 2. Bảng R (6 DR6 của gói B)

Cách gỡ phần sửa, không sửa repo:

- **JS:** `B\mutjs.mjs` đưa bản đột biến của **một** file vào vitest qua `load` hook của Vite (`B\mutant-config.mjs`, chép từ `claude\A\`); repo không đổi byte nào. Đột biến sống ở test nhắm thì chạy cả bộ.
- **Rust:** `B\mutrs.mjs` đột biến bản chép crate `B\crate\apps\desktop\src-tauri` (sha256 trùng repo trước / sau mỗi đột biến), `cargo test --lib` với target riêng `B\crate-target`.
- **File mà test đọc bằng `readFileSync`** (`tauri-contract.test.ts`): `B\mutpatch.mjs` vá file repo, chạy đúng file test đó, trả nguyên byte trong `finally`, so sha256 với `HEAD:` từng file (quy tắc chung 1).
- Cuối mỗi đợt `git status --short` rỗng (`mutjs.log`, `mutrs.log`, `mutpatch.log`). Tái hiện lượt 2 chạy lại bằng probe lượt 2 của chính Claude (`r2\claude\B\`), chép / sửa sang `r3\claude\B\`.

| DR6 | Issue → PR | Kết luận | Bằng chứng (tái hiện lượt 2 nay ra gì; test nào đỏ khi gỡ phần sửa) | Biến thể / ghi chú |
|---|---|---|---|---|
| 73 | #656 → #674 | **ĐÃ SỬA** | Tái hiện CL2-B1 / K1 lượt 2 (`B\p01-integrity.mjs`, cùng hạt giống 20261017, dữ liệu tải lượt 3 → `data\load.db` 14 069 760 B): 600 lần lật một byte → `{openFails 1, quickFlags 72, quickOkIntegrityFlags 257, bothOk 270}`, như lượt 2; **cả 257 / 257 ca `quick_check` "ok" mà `integrity_check` bắt: khởi động từ chối `DATA_DAMAGED`, 0 backup, 0 lưu** (lượt 2: mở, chép bản hỏng thành backup mới nhất). Ca dựng sẵn (một ký tự mã KH trong chỉ mục `appointments_customer`): `integrity ["row 1373 missing from index appointments_customer", …]`, khởi động `started false, damaged true, events []`. Exe release (`exe-r3.mjs index`, `exe-r3-a.log`): trang "File dữ liệu bị hỏng", câu `openFailedHelp` có "đóng cửa sổ này"; `project2c.db` không đổi (sha256), không tạo `backups\` (lượt 2: mở 407 ms, backup = file hỏng, hồ sơ "1 lịch"). Gỡ sửa: M73a (`integrityCheck` chạy lại `PRAGMA quick_check`) → KILLED 2 (`database.test.ts > integrityCheck > finds an index whose key no longer matches its row`, `app-data.test.ts > openAppData > refuses a file whose index lost step with its table, with every page whole (DR6-73)`); M73b (khởi động không kiểm) → KILLED 2 (DR6-06, DR6-73) | Chi phí (K24): Node `quick_check` 70,1 ms → `integrity_check` 103,3 ms (+33 ms, trong ≈ +30–40 ms); `openAppData` từ file 115,4 ms. KNOWN #620 ("kiểm sau migrate; xem lại khi có migration mới"): xét lại với 0011 ở K1 — không có bằng chứng mới. Cỡ file: K2 |
| 74 | #656 → #674 | **ĐÃ SỬA** | Tái hiện K2 lượt 2 (`rsprobe readonly`, `storage.rs` ghim): `open` → `Err(kind PermissionDenied, message "ACCESS_DENIED")` (lượt 2: `Ok`, rồi mọi lần lưu `os error 5`). Exe (`exe-r3.mjs ro`): trang "App không có quyền ghi vào thư mục dữ liệu", câu "…thư mục Project2C-data cạnh file exe và các file trong đó không chỉ đọc… rồi đóng cửa sổ này và mở lại app", 0 nút; `project2c.db` không đổi, không tạo `backups\`. Gỡ sửa (bản chép crate): R74 (bỏ bước kiểm chỉ đọc) → KILLED `open_reports_a_read_only_database_file_as_access_denied`; R74b (lỗi thô thay `ACCESS_DENIED`) → KILLED cùng test | Biến thể còn hở: lưu lỗi `PermissionDenied` không do "chương trình khác" — ACL của `project2c.db` cấm ghi / xóa nhưng cho đọc, và thuộc tính chỉ đọc bật giữa phiên → **CL3-B1** |
| 75 | #656 → #674 | **ĐÃ SỬA** | Tái hiện K6 lượt 2 (`exe-e4` → `exe-r3.mjs held`): cửa sổ 1 "File dữ liệu đang bị chương trình khác giữ — … hãy đóng chương trình đó, rồi đóng cửa sổ này và mở lại app."; mở lại khi cửa sổ 1 còn → cửa sổ 2 "Project-2C đang mở ở một cửa sổ khác — Hãy dùng cửa sổ đó… Nếu cửa sổ đó đang báo lỗi mở dữ liệu, hãy đóng cả hai cửa sổ rồi mở lại app." (lượt 2: chỉ "Hãy dùng cửa sổ đó", trỏ về trang không nút); đóng cả hai → lần mở thứ ba vào được. Mọi câu `…Help` (`vi.ts:1020-1041`) có "đóng cửa sổ này". Gỡ sửa: M75a (`fileInUseHelp` về "rồi mở lại app") → KILLED 2 (`startup-error.test.ts`); M75b (bỏ câu "đóng cả hai cửa sổ") → KILLED 2; M75c (`openFailedHelp`, cũng của trang file hỏng, bỏ "đóng cửa sổ này") → KILLED 2 | Chuỗi với file chỉ đọc (K3): trang `ACCESS_DENIED` nay giữ khóa (bước kiểm sau file khóa); làm theo câu mới thì vào được. Không thêm nút (Issue #656: nút cần G3) — đúng phạm vi |
| 76 | #657 → #680 | **ĐÃ SỬA** (phần Rust; script eval: gói F) | Tái hiện CL2-B4 / CX2-B3 trên bản chép crate (`B\probe_r3_ai.rs` nối vào bản chép `ai.rs`, `probe-r3-ai.log`): JSON→JSON (mỗi `\` viết thành `\\` hoặc `\u005C`), URL→URL (`%25`), trộn thứ tự theo từng ký tự (JSON>URL / URL>JSON xen kẽ) → **2xx `AI_BAD_RESPONSE`, thông điệp 401 `bad ***!`** (lượt 2: `Ok`, thông điệp giữ nguyên). Ba lớp (JSON, JSON, URL; URL ×3) → `Ok`, không che: đúng giới hạn ADR-0009 D-1 (K23). Gỡ sửa (bản chép): R76a (bỏ lượt hai) KILLED 2; R76b (bỏ cách đọc một lượt) KILLED 1 (ca `ODD_KEY`); R76c (bỏ cách đọc nguyên văn) KILLED 2; R76d (một lượt không gỡ `%XX`) KILLED 3; R76e (chỉ nhận hex chữ hoa) KILLED 3; R76f (`mask` bỏ cách đọc thứ ba) KILLED 1; R76g (`reveals` bỏ cách đọc thứ ba) KILLED 2; R76h (cắt 200 ký tự trước khi che) KILLED 3 | Biến thể K15–K17: 30 000 ca sinh ngẫu nhiên (đoạn **1–8 ký tự**, 0–2 lớp × 7 kiểu, trộn kiểu theo từng ký tự trong một lớp, hex hoa / thường, hai key): **0 / 15 000** lọt khi có dấu cách giữa key và chữ quanh nó, thông điệp còn lộ **0**; 98 / 15 000 lọt khi một `\` / `%` trần của chữ đứng sát ngay trước một escape của key — ký tự đó thành lớp thứ ba cho ký tự đầu, ngoài mô hình (K23), không ghi phát hiện |
| 84 (phần B) | #662 → #709, #710 | **ĐÃ SỬA** | Phần B = `AppData.purgeTrash` qua hàng đợi thay dữ liệu. `app-data.test.ts` "purgeTrash (spec Phase 6 TR-11)" 8 ca (D2, D3, D7, D8, D9, D10, D13, S2-1) xanh. Gỡ sửa (8 đột biến, đều KILLED): M84a (dọn ngoài hàng đợi, backup sau khi dọn) KILLED 5; M84b (không `changed()`) 1; M84c (`backUp` không chờ lưu) 3; M84d (`backUp` bỏ kiểm lần lưu lỗi, D7) 6; M84e (dọn tăng `generation`) 1; M84f (dọn DB của lúc gọi, không của lúc tới lượt, S2-1) 1; M84j (mất tên backup) 1; M84l (lượt bị từ chối không hạ `replacing`) 9. Exe, 1 313 bản ghi (`exe-r3.mjs bigpurge`, ngắt DevTools như `baseline.md`): **bấm → 11j 148 / 150 ms**, lưu 146 ms (14,1 MB) + 21 ms (1,49 MB), file 14 118 912 → 1 486 848 B; Thùng rác trống. Đường lỗi cũ (Thùng rác chỉ lớn lên, mở chậm tuyến tính) đã hết | Tắt / giết giữa lúc dọn, file bị giữ, lần lưu lỗi, `VACUUM` lỗi: K4–K11, không thấy lỗi. Phần lệnh: gói A; màn: gói E; đo: gói F |
| 88 | #656 → #674 | **ĐÃ SỬA** | Áp lại đột biến sống lượt 2: G07d (`create_dir(dir)?` bỏ `out_of_reach`) → KILLED `open_reports_a_data_folder_it_may_not_create_as_access_denied` (lượt 2: SỐNG, CL2-B3); bỏ `impl Drop for TempDir` → KILLED `a_temp_dir_goes_with_all_it_holds_once_dropped` (lượt 2: 58 / 58, CX2-B2); ba file cùng về `0.1.0` (P88a) → KILLED "…one version, 1.0.0 or later" (lượt 2: 14 / 14, CX2-B1); id `kimi+k3` trong `AI_MODELS` (M88d), bỏ `.` khỏi tập ký tự Rust (P88b), `MAX_MODEL_CHARS = 8` (P88c) → KILLED "names every model of Settings → AI as Rust takes it" (lượt 2: không có test, CL2-B5). J5 (K29): comment `app-data.ts:419-424` nói đúng điều test giữ ("the order the tests hold"; nhịp `setTimeout` là "a margin no test holds") — chấp nhận, không thêm test | `tauri-contract.test.ts:294` từ chối semver có hậu tố (KNOWN #674), không đổi |

Bảy DR6 lượt 1 kiểm qua mã lượt 2 (plan §L3.4): phần thuộc gói B là DR6-60 (qua DR6-88, J5 = K29). Mọi DR6 lượt 1 của gói B đã ĐÃ SỬA ở lượt 2 (06–14) còn đúng: tái hiện DR6-06 (file hỏng → từ chối, K1), DR6-07 (`FILE_IN_USE`, `ACCESS_DENIED`, K3), DR6-09 (`.tmp` dọn ở lần mở, K6: 0 `.tmp` còn), DR6-10 (K15), DR6-12 (exe 1.0.0, `baseline.md`), DR6-13 / DR6-14 (không đổi `Cargo.toml`, capabilities, `tauri.conf.json` từ `4217ed4`).

## 3. Phạm vi đã đọc

**Diff sửa của gói B** (`git diff --numstat 4217ed4 119e2e4 -- apps/desktop/src-tauri apps/desktop/src/data`, bỏ `ai-analysis.test.ts` của gói C): `ai.rs` +155 / −54 (SP chỉ `readings` / `unescape`, bỏ enum `Escapes`; phần còn lại là test), `storage.rs` +64 / −2 (`open_with`, kiểm chỉ đọc, 3 test), `app-data.ts` +63 / −28 (`inTurn`, `backUp`, `purgeTrash`, `integrityCheck`), test `app-data.test.ts` +211 / −3, `tauri-contract.test.ts` +17 / −1. Commit: `c5a40e1` (#674), `217cef6` (#680), `6526793` (#710); đọc `git diff` từng hunk.

**Đọc hết ở `119e2e4`:** `src-tauri/src/storage.rs` SP 1–551 + test mới (`:1302-1345`), `TempDir` (`:557-585`); `ai.rs` SP 1–558 + test DR6-10 / DR6-76 (`:762-840`, `:1214-1452`); `lib.rs` (205); `src/data/app-data.ts` (511), `persist-queue.ts` (79), `tauri-storage.ts` (71), `tables.ts` (68), `today.ts` (58), `AppDataContext.tsx` (52); `src/main.tsx` (47).

**Chỗ nối gói khác:** `packages/db/src/purge.ts` (233, đủ), `database.ts` (247, đủ: `transaction`, `exportBytes`, `integrityCheck`, `migrate`), `index.ts`; `shell/startup-error.ts`, `SaveWarning.tsx`, `close-guard.ts`; `routes/SettingsTrash.tsx` (392, đủ), `trash-view.ts` (`purgedNotice`, `purgeFailure`); `i18n/vi.ts` (`storage.*` `:1020-1041`, `:1134-1140`, `trash.purge.*` `:343-366`, `settings.*.failedUnsaved`); `packages/ai/src/models.ts`; `tools/load-data-core.mjs` (`LOAD_SCALE`, để dựng dữ liệu 2× / 3×).

**Tài liệu:** `CLAUDE.md` gốc, `apps/desktop/CLAUDE.md`, `packages/db/CLAUDE.md`, `.claude/rules/i18n-ui.md`; spec Phase 6 §4.1 (S2-1…S2-6), §4.2 TR-11–TR-13 (`phase-6-hoan-thien.md:108-137`); ADR-0016; `docs/user-guide/09-cai-dat.md` (`:20`, `:44`, `:68-72`, `:115`, `:172-203`); `common\{prompt-claude.md, plan.md (§3, §4, §L2.3–§L2.8, §L3.1–§L3.11), known.md (đủ), fixes.md (#656 / PR #674, #657 / PR #680, #662 / PR #707, #709, #710), baseline.md (đủ)}`; tổng hợp lượt 2 §1–§11; báo cáo gốc lượt 2 gói B của Claude (đủ 1–9.2) và Codex (2–9), lượt 1 gói B của Claude (laptop, 1–6); `claude\A.md` lượt 3 (mục 1–2, mục 4 phần chuỗi qua lớp app `f-chain-K1…K14`, danh sách ID) để không báo lại.

## 4. Kịch bản mới đã thử

19 kịch bản mới (không có trong báo cáo lượt 1, 2 của gói B và trong `claude\A.md` lượt 3). Probe ở `C:\workspace\deep-review-1-6-r3\claude\B\`.

| # | Kịch bản (các bước, dữ liệu) | Kết quả | ID |
|---|---|---|---|
| K1 | File schema 11 do code `4217ed4` ghi (`r2\claude\B\data\{load,index-damaged,page-damaged}.db`) mở bằng khởi động `119e2e4`: migration 0011 chạy **trước** `integrity_check` (KNOWN #620 "xem lại khi có migration mới"); mỗi file cũng mở "như nó là" (không 0011) để thấy hỏng trước migrate (`p01c-migrate.mjs`) | Bản tốt → mở, `events [backup, save]`, schema 12. Lệch chỉ mục → trước migrate `integrity` 2 dòng; khởi động "File dữ liệu bị hỏng", `events []`. Hỏng trang → migration ném "database disk image is malformed" trước bước kiểm → trang "Không mở được file dữ liệu" (khác tiêu đề, cùng câu `openFailedHelp`), `events []`. 0011 chỉ `DROP` / `CREATE TRIGGER`, không dựng lại bảng / chỉ mục, nên không che được hỏng | không thấy (KNOWN, không bằng chứng mới) |
| K2 | `integrity_check` lúc mở theo cỡ file: dữ liệu tải (1×) và cùng dữ liệu giả lập ×2 / ×3 KH mỗi RE (`LOAD_SCALE`, `customersPerRe` 68 / 102) — Node (`p05-size.mjs`) và `p2c:data-open` trên exe, DevTools nối sau 8 s (`exe-open-size.mjs`) | 14,1 / 20,0 / 25,4 MB: `integrity_check` 104,5 / 148,5 / 191,8 ms (≈ 7,5 ms / MB); exe 366 / 453 / 546 ms (lần đầu của profile mới ở 3×: 620 ms). Ngưỡng ≤ 600 ms áp cho dữ liệu tải: đạt; chạm 600 ở ≈ 1,9–2× cỡ dữ liệu tải | không thấy (ghi số, mục 6.2) |
| K3 | Chuỗi DR6-74 + DR6-75 trên exe (`exe-r3.mjs ro`): `project2c.db` chỉ đọc → cửa sổ 1 trang `ACCESS_DENIED` (đã giữ khóa) → gỡ thuộc tính → mở lại khi cửa sổ 1 còn → đóng cả hai → mở lần ba | Cửa sổ 2: câu `alreadyOpenHelp` mới "…đóng cả hai cửa sổ rồi mở lại app"; lần ba vào được, có backup; file không đổi trước đó | không thấy |
| K4 | Dọn sạch trên exe (dữ liệu tải, 113 bản ghi) rồi đóng cửa sổ (WM_CLOSE) ngay sau cú bấm, 0 và 60 ms (`exe-r3.mjs purgeclose`) | Cả hai: exit 0 không hỏi, `project2c.db` = bản đã `VACUUM` (13 410 304 B, sha256 = `data\purge-C.db`), không `.tmp`, `backups\` 1 bản; mở lại: Thùng rác 0 bản ghi. `closeAfterSaving` chờ đủ hai lần lưu | không thấy |
| K5 | Dọn sạch trên exe rồi **giết tiến trình** (`taskkill /T /F`) 100 / 200 / 300 / 450 / 600 / 800 / 1 500 ms sau cú bấm; mốc canh bằng ca `timeline` (lưu 1 kết thúc ≈ 323–334 ms, lưu 2 ≈ 824–825 ms) (`ROUTE=0 KILL_DELAYS=… exe-r3.mjs purgekill`) | 100–200 ms: file trước khi dọn (14 069 760 B), mở lại Thùng rác 113. 300–600 ms: file đã dọn chưa `VACUUM` (14 069 760 B), Thùng rác 0. 800–1 500 ms: file đã `VACUUM` (13 410 304 B). Mọi lần mở lại: không trang lỗi (`integrity_check` qua), không `.tmp`, backup trước khi dọn còn | không thấy |
| K6 | Đường file của Dọn sạch ở tầng Rust (`rsprobe purgeloop`: lưu A (mỗi vòng đổi một byte) → backup → lưu B = đã dọn → lưu C = đã `VACUUM`), giết 40 lần ở thời điểm ngẫu nhiên, mỗi lần mở lại bằng `storage::open` (`rsprobe crashpurge`) | Mở lại: A 28, B 4, C 8, khác 0; backup không nguyên: 0; `.tmp` thấy 21 lần trước khi mở lại, cuối cùng 0 `.tmp` trong 10 backup | không thấy |
| K7 | Dọn sạch trên exe khi chương trình khác giữ `project2c.db` chỉ cho chia sẻ đọc (`rsprobe holdshare … 1`), rồi đóng app, chọn bỏ thay đổi, mở lại (`exe-r3.mjs purgeheld`) | Backup đọc được file → tạo; dọn trong bộ nhớ; 11j "Đã dọn sạch Thùng rác… Backup: …"; cả hai lần lưu lỗi → dải "Chưa lưu được dữ liệu vào file…"; màn Thùng rác 0; file trên đĩa vẫn bản cũ. Đóng → hộp "Chưa lưu được thay đổi" → bỏ → mở lại: Thùng rác 113 (dọn được hoàn lại, dữ liệu an toàn). Thả file trước khi đóng thì `flush` lưu được bản đã dọn (lần chạy đầu, holder hết 30 s) | không thấy (như mọi lệnh khi lưu lỗi) |
| K8 | Dọn sạch Thùng rác lớn trên exe: dữ liệu tải + 1 200 KH đầu theo id xóa mềm = 1 313 bản ghi (`mkbig.mjs`), đặt sẵn làm `project2c.db`; trang tự bấm sau 1 s khi DevTools đã ngắt (`exe-r3.mjs bigpurge`, 2 lần) | Hộp 11i "1.313 bản ghi… KH 1.215 — kèm 9.834 lịch hẹn · 1.648 HĐ · 5.006 ghi chú KYC · 99 phân tích AI · Lịch hẹn 76 · HĐ 18 · Nhân sự 3 · Team 1"; bấm → 11j 148 / 150 ms; lưu 146 + 21 ms; file 14 118 912 → 1 486 848 B | không thấy (mục 6.2) |
| K9 | Chương trình khác ghi đè `project2c.db` trong lúc app chạy (đồng bộ đám mây, người dùng chép backup khi chưa đóng app), rồi Dọn sạch — `AppData` với storage giả chép "file trên đĩa" khi backup như `storage.rs` (`p06-purge-app.mjs` a) | Backup "trước khi dọn" là file bị ghi đè (0 bản ghi Thùng rác), không phải 113 bản ghi trong app vừa bị dọn; lần lưu sau đè file đó như mọi lệnh. Đúng TR-11 ("chờ lưu, chép file"): chỉ lệch khi file bị ghi đè ngoài app lúc app chạy — hướng dẫn bảo đóng app trước khi chép file (`09-cai-dat.md:72`, `:187`); Nạp lại / Nhập dùng cùng `backUp` từ trước | không ghi phát hiện (ngoài cách dùng) |
| K10 | `VACUUM` ném trong `AppData.purgeTrash` (bọc `sqlite.run`, `p06-purge-app.mjs` b) | Lệnh vẫn trả số đã dọn, 1 lần lưu ở cỡ cũ (14 069 760 B), Thùng rác trên đĩa 0, `replacing` về false — đúng câu spec TR-11 (`:118`) | không thấy (KNOWN #709 `:167`: chưa có test) |
| K11 | Lần lưu đầu của Dọn sạch lỗi, lần sau được (`p06-purge-app.mjs` c) | Hàng đợi gộp bản mới nhất: file = bản đã `VACUUM`, `failed()` false, `saveError` undefined | không thấy |
| K12 | ACL của `project2c.db` cấm tài khoản đang dùng ghi / xóa nhưng cho đọc (`icacls /deny <user>:(WD,AD,WA,WEA,DE)`, và chỉ `(DE)`), thuộc tính không chỉ đọc — `rsprobe acldeny` và exe (`exe-r3.mjs acl`); ACL gỡ ngay sau mỗi ca | `open` nhận, backup lúc mở được, mọi lần lưu `PermissionDenied` (os error 5); exe mở bình thường, dải lưu và hộp đóng app bảo "chương trình khác", Thử lại không bao giờ được | **CL3-B1** |
| K13 | Thuộc tính chỉ đọc bật **giữa phiên** (`rsprobe romid`) | Lưu `PermissionDenied` (os error 5) → câu chung "chương trình khác"; lần `open` lại trong cùng tiến trình → `ACCESS_DENIED` | **CL3-B1** |
| K14 | Chương trình khác giữ `project2c.db` với chia sẻ đọc / đọc + ghi / đọc + ghi + xóa (`rsprobe heldshared 1 / 3 / 7`) | 1, 3: `open` và backup được, lưu `PermissionDenied` (os error 5, không phải 32) — câu "chương trình khác" đúng cho ca này; 7: lưu được | không thấy (đối chứng của CL3-B1) |
| K15 | Key qua ≤ 2 lớp escape sinh ngẫu nhiên: 30 000 ca, key giả của test và key kiểu OpenCode 51 ký tự; cắt đoạn 1 / 2 / 3 / 5 / 8 ký tự; mỗi đoạn 0–2 lớp trong 7 kiểu (JSON hex hoa, JSON hex thường, URL hoa, URL thường, `JSON.stringify`, `encodeURIComponent`, P = mỗi ký tự của lớp một kiểu, `\` và `%` luôn được escape); một nửa có dấu cách giữa key và chữ nhiễu, một nửa dính sát; kiểm `reply(200)`, thông điệp 401 sau khi che (`probe_r3_random_layers_part_by_part`) | Có dấu cách: 2xx lọt 0 / 15 000, thông điệp không còn `***` 0, thông điệp sau che còn lộ 0. Dính sát: 98 / 15 000 lọt, đều do `\` / `%` trần của chữ nhiễu ngay trước escape đầu của key thành lớp thứ ba. Lần chạy đầu của bộ sinh (kiểu P để `\` trần) cho 2 086 "lọt": lỗi của bộ sinh (không còn là hai lớp hợp lệ), đã sửa và chạy lại | không thấy |
| K16 | Key ba lớp (JSON, JSON, URL; URL ×3) | `reply(200)` → `Ok`, thông điệp không che — đúng giới hạn ADR-0009 D-1 / K23 | không thấy |
| K17 | Che key trong thông điệp lỗi: nguyên văn + hai lớp cùng câu; hai lớp URL ngay trước `%2541`; key hai lớp sau 180 ký tự (cắt 200); session + key cùng hai lớp; câu tiếng Việt có dấu quanh key; 20 ký tự đầu của key hai lớp (`probe_r3_mask_edges`) | `*** then ***`, `***%2541 end`, cắt 200 không còn mẩu key, `*** / ***`, "Khóa không hợp lệ cho phiên này: *** — kiểm tra lại"; mẩu 20 ký tự giữ nguyên (không phải key) — đúng | không thấy |
| K18 | Chi phí `reveals` / `mask` với 3 cách đọc trên 128 K và 2 M ký tự (bản debug, `probe_r3_reveals_and_mask_cost`) | 33 / 36 ms và 542 / 569 ms (lượt 2, 4 cách đọc: 53 / 55 và 841 / 862 ms): nhanh hơn ≈ 35 % | không thấy (mục 6.2) |
| K19 | Lệnh file Rust trên dữ liệu tải (`rsprobe time` ×2): lưu ×15, mở ×5, backup thư mục rỗng / file không đổi / file đổi với 10 bản | 9,5 / 3,8–4,1 / 12,5–12,8 / 6,1–7,0 / 40,9–41,8 ms — như lượt 2 (`storage.rs` không đổi ở các lệnh này) | không thấy |

## 5. Phát hiện mới

### CL3-B1 — Lưu lỗi `PermissionDenied` không do "chương trình khác" (ACL của `project2c.db` cấm ghi / xóa, hoặc thuộc tính chỉ đọc bật giữa phiên): app mở / chạy bình thường, mọi lần lưu lỗi, dải lưu và hộp đóng app bảo đóng "chương trình khác"

```
ID: CL3-B1
Mức: Low
Trục: C, D
Vị trí: apps/desktop/src-tauri/src/storage.rs:147-154 (open chỉ xét thuộc tính chỉ đọc), :213-230 (save: lỗi chỉ qua disk_full); apps/desktop/src/shell/SaveWarning.tsx:18; apps/desktop/src/i18n/vi.ts:1134-1135 (storage.saveFailed), :1139-1140 (close.unsavedBody) (119e2e4)
Tình trạng: CONFIRMED
Liên quan: DR6-74 (biến thể gần) · có từ trước; phần sửa #674 chỉ phủ thuộc tính chỉ đọc lúc mở
Kịch bản: K12, K13 (đối chứng K14)
```

- **Mô tả:** #674 từ chối lúc mở khi `project2c.db` mang **thuộc tính** chỉ đọc (`metadata().permissions().readonly()`). Hai đường khác cho đúng triệu chứng DR6-74 vẫn còn:
  - (a) ACL của file cấm tài khoản đang dùng ghi / xóa nhưng cho đọc: thuộc tính không bật nên `open` nhận, backup lúc mở chạy được;
  - (b) thuộc tính chỉ đọc bật **trong lúc** app chạy.

  Cả hai: mọi lần lưu (đổi tên `.tmp` đè lên file) lỗi `PermissionDenied` (os error 5), `save` chỉ tách `DISK_FULL`, nên dải lưu dùng câu chung "file có thể đang mở trong chương trình khác… sẽ được lưu lại ở lần thay đổi tiếp theo", hộp đóng app "Đóng chương trình đó rồi chọn Thử lại". Thử lại không bao giờ được.
- **Tái hiện / bằng chứng:**
  - `rsprobe acldeny <dir> load.db "WD,AD,WA,WEA,DE"` (`B\rsprobe.log`; ACL đặt bằng `icacls /deny <user>:(…)` trên bản chép trong `B\rs\`, gỡ ngay bằng `icacls /remove:d`): `read-only attribute: Ok(false)` · `open: Ok(Some(14069760))` · `startup backup: Ok(…)` · `save: Err(kind PermissionDenied, raw Some(5), "Access is denied. (os error 5)")` · gỡ ACL → `save: Ok(())`. Chỉ cấm `DE` (xóa) cũng vậy. (Cấm cả nhóm `(W)` thì cấm luôn `SYNCHRONIZE`, không đọc được → `open` đã ra `ACCESS_DENIED` đúng.)
  - Exe release (`exe-r3.mjs acl`, `B\exe-r3-b.log`): app mở, không trang lỗi, có backup lúc mở; tạo team → dải "Chưa lưu được dữ liệu vào file (file có thể đang mở trong chương trình khác). Dữ liệu vẫn còn trong app và sẽ được lưu lại ở lần thay đổi tiếp theo."; bấm X → hộp "…Đóng chương trình đó rồi chọn Thử lại…"; Thử lại → hộp hiện lại; chỉ thoát được bằng "Đóng và bỏ thay đổi chưa lưu"; `project2c.db` không đổi.
  - `rsprobe romid` (thuộc tính chỉ đọc bật sau lần mở): `open (writable): Ok` · `save once it is read-only: Err(PermissionDenied, raw Some(5))` → cùng câu chung (`SaveWarning.tsx:18` chỉ phân biệt `DISK_FULL`).
  - Đối chứng: chương trình khác giữ file không cho chia sẻ xóa (`rsprobe heldshared 1` / `3`) cũng ra đúng `os error 5`, và với ca đó câu "chương trình khác" đúng. Vì vậy phải phân biệt theo nguyên nhân, không đổi câu chung.
- **Ảnh hưởng:** hiếm (file chuyển từ thư mục / tài khoản khác mang ACL riêng, công cụ đặt thuộc tính chỉ đọc khi app đang chạy). Khi gặp: người dùng làm cả phiên, đi tìm chương trình không có, cuối cùng đóng app và mất mọi thay đổi chưa lưu — như DR6-74 trước #674.
- **Đề xuất:** lúc mở, thử mở `project2c.db` với quyền ghi + xóa (`OpenOptionsExt::access_mode`, không cắt file) thay cho chỉ xét thuộc tính → `ACCESS_DENIED` cho cả ACL lẫn thuộc tính. Lúc lưu, khi đổi tên lỗi `PermissionDenied` mà file mang thuộc tính chỉ đọc (hoặc không mở được với quyền xóa) thì trả mã riêng, kèm câu dải lưu riêng ("file dữ liệu đang chỉ đọc…"). ≈ 15–30 dòng Rust + 1 câu `vi.ts` + test Rust kiểu `open_reports_a_read_only_database_file_as_access_denied` (ACL đặt bằng `icacls` hoặc `SetFileSecurity`); PR `build-exe`.

### CL3-B2 — KNOWN, đường vào mới: Dọn sạch bị từ chối khi lần lưu trước lỗi (D7) mà không có cách thử lưu lại

```
ID: CL3-B2
Mức: Nit
Trục: C
Vị trí: apps/desktop/src/data/app-data.ts:407-411 (backUp: saves.failed() → RELOAD_UNSAVED_CHANGES); apps/desktop/src/i18n/vi.ts:360 (trash.purge.failedUnsaved) (119e2e4)
Tình trạng: KNOWN
Liên quan: mục OPEN Cài đặt (#96, #87) "sau một lần lưu lỗi, 'Nạp lại' bị từ chối mà không có cách thử lưu lại" · đường vào mới do PR #710 (Dọn sạch dùng chung `backUp`)
```

- **Mô tả:** D7 đúng spec (TR-11 "lần lưu trước lỗi → từ chối như Nạp lại"), câu 11j "Chưa dọn: lần lưu gần nhất bị lỗi, backup sẽ thiếu các thay đổi đó." chép đúng mẫu của Nạp lại / Nhập (`vi.ts:1099`, `:1132`). Như mục OPEN, màn không có cách thử lưu lại: người dùng phải tự làm một thay đổi khác (lần lưu sau ghi lại cả file) hoặc đóng app (hộp đóng app có Thử lại).
- **Bằng chứng:** đọc code; D7 của `app-data.test.ts` và đột biến M84d (KILLED 6) giữ hành vi này. Không có hậu quả nặng hơn mục OPEN (dữ liệu không đổi).
- **Đề xuất:** gộp vào lần sửa mục OPEN (#96): một nút "Thử lưu lại" (`saves.flush()`) cạnh câu từ chối của cả ba nơi — đổi hình thức, cần G3.

## 6. Bloat và Hiệu năng

### 6.1 Bloat

| Đã chạy / đọc | Trên | Kết quả | ID |
|---|---|---|---|
| `cargo clippy --lib --tests --locked --offline -- -W clippy::pedantic` (một lần, 31 s; bản chép crate = repo; `clippy-pedantic.log`, liệt kê bằng `clippy-list.mjs` → `clippy-list.log`) | Rust `119e2e4` | exit 0. **lib 20** cảnh báo (lượt 2: 19): 13 `doc_markdown` (ai.rs 10, lib.rs 3), `struct_field_names` `ai.rs:117`, 3 `needless_pass_by_value` (`lib.rs:105`, `:120`, `:163`), `cast_possible_wrap` `lib.rs:66`, `missing_panics_doc` `lib.rs:188`, `redundant_closure_for_method_calls` `storage.rs:69`. Mới duy nhất: `doc_markdown` `ai.rs:341` (doc mới của `readings`). Thêm 14 chỗ chỉ ở test (ép kiểu, `match_bool`, `needless_for_each`, `semicolon_if_nothing_returned`), build script 1, bin test 1. Không cảnh báo nào chỉ lỗi hay code chết | — |
| `tsc --noUnusedLocals --noUnusedParameters` | `tsconfig.base.json` bật sẵn hai cờ → `pnpm typecheck` trong `pnpm verify` (xanh ở SHA ghim, `baseline.md`) | 0 biến / tham số thừa (không chạy lại) | — |
| Nơi dùng export / hàm mới (`git grep`) | `PurgedTrash` (`trash-view.ts:25`, `:577`), `isDamagedDataError` (`startup-error.ts:2`, `:35`), `integrityCheck` (`app-data.ts:367`), `open_with` (`storage.rs:104`; seam test `:1310`, như `save_with`), `inTurn` / `backUp` | đều có nơi dùng sản phẩm | — |
| Code lặp | `app-data.ts`, `ai.rs`, `storage.rs` | `inTurn` + `backUp` gom phần chung của `replace` và `purgeTrash` (bớt lặp); `ai.rs` bỏ enum `Escapes`, 3 cách đọc thay 4; `read_dir(…).into_iter().flatten().flatten()` ×4 và `remove_interrupted_backups` ≈ `remove_interrupted_exports` = KNOWN (DR6-67, #620), không đổi | — |
| Dependency | `git diff --numstat 4217ed4 119e2e4` | `Cargo.toml`, `Cargo.lock`, `package.json`, `capabilities/default.json`, `tauri.conf.json` không đổi | — |
| Exe / bundle | `baseline.md` (không dựng lại) | exe 5 408 768 B (lượt 2 5 404 672, +4 096); `assets/index.js` +18 263 B cho cả app; gói B thêm ≈ 63 dòng TS SP, ≈ 10 dòng Rust SP | — |
| Hai lần lưu của Dọn sạch | exe, K5, K8 | Lần lưu sau transaction (14 MB, 146 ms) bị lần lưu sau `VACUUM` thay ngay. Có chủ ý (PR #709 "Lưu file hai lần", KNOWN #709 `:171`), và là mốc bền khi tắt giữa chừng (K5: file đã dọn) — không ghi phát hiện | — |

Đề xuất refactor bloat: không có mục mới.

### 6.2 Hiệu năng

Home PC `DESKTOP-KDURKJP`, 20/10 19:40–20:06; Codex chạy song song (không biết đang làm gì), CPU 0–10 % lúc đo exe. Dữ liệu: `common\load\load-2026-10-12-seed6.p2cbackup` qua `importBackup` → `B\data\load.db` (14 069 760 B, bằng file exe để lại sau Nhập backup); `B\data\big-trash.db` (+1 200 KH xóa, 14 118 912 B); `load2x.db` / `load3x.db` (K2). Mốc: `common\baseline.md` (exe ghim, cùng máy: mốc sau #656 và lượt 2), báo cáo Claude B lượt 2 §6.2. Luật nhiễu: xấu hơn khi quá 20 % **và** quá 10 ms.

| Thao tác | Nơi / lần | Lượt 3 | Mốc cùng máy | Δ / ngưỡng | ID |
|---|---|---|---|---|---|
| `PRAGMA quick_check` / `integrity_check` (dữ liệu tải) | Node, 7 | 70,1 / 103,3 ms | lượt 2 Node 68,2 / 98,9 ms | khởi động trả +33 ms (K24 ≈ +30–40) | — |
| `openAppData` từ file (storage trong bộ nhớ) | Node, 5 | 115,4 ms | lượt 2 (`quick_check`) 71,0 ms (Codex B) | ≈ +44 ms = phần `integrity_check` thêm | — |
| `p2c:data-open` exe, dữ liệu tải | exe, 3 (DevTools nối sau 8 s) | 366 ms (354–413) | `baseline.md` 373; mốc sau #656 387 | ≤ 600 ms ✅ | — |
| … ×2 KH (20,0 MB) | exe, 3 | 453 ms (447–499) | — | ≤ 600 ms ✅ | — |
| … ×3 KH (25,4 MB) | exe, 3 | 546 ms (546–620; 620 = lần đầu của profile mới) | — | trung vị ✅; ngoại suy ≈ 16 ms / MB → 600 ms ở ≈ 28–29 MB (≈ 2× cỡ dữ liệu tải) | — |
| `integrity_check` theo cỡ | Node, 5 | 104,5 / 148,5 / 191,8 ms (1× / 2× / 3×) | — | ≈ 7,5 ms / MB | — |
| Dọn sạch 1 313 bản ghi: bấm → 11j | exe, 2 (DevTools ngắt) | 148 / 150 ms; lưu 146 + 21 ms; file 14 118 912 → 1 486 848 B | `baseline.md` 113 bản ghi: 151,8 ms | không có ngưỡng | — |
| `AppData.purgeTrash` (backup giả + dọn + 2 lần lưu vào bộ nhớ) | Node, 5 | 95,7 ms (113 bản ghi) / 107,7 ms (1 313) | `baseline.md` `purgeTrash` cả `VACUUM` 93,8 / 109,8 ms | khớp: lớp app không thêm chi phí đáng kể | — |
| Mốc của Dọn sạch, DevTools gắn, không `route` (chỉ để canh K5) | exe, 2 | 11j 321 / 333 ms; lưu 1: 114–120 → 323–334 ms; lưu 2: → 824–825 ms | — | — | — |
| Cách đo: `page.context().route` của Playwright cho cả thân lệnh lưu 14 MB đi qua DevTools | exe, 1 | mỗi lần lưu 1 331–1 438 ms (so 146 ms) | — | probe đo lệnh lưu nên dùng `route: false` (luật DNS của trình duyệt vẫn chặn mọi host không local) | — |
| `reveals` / `mask` (3 cách đọc) | bản chép crate, debug, 3 | 33 / 36 ms (128 K ký tự); 542 / 569 ms (2 M) | lượt 2 debug, 4 cách đọc: 53 / 55; 841 / 862 ms | −35 %; chỉ chạy sau một lượt gọi mạng nhiều giây | — |
| Rust `save` / `open` / backup (rỗng · không đổi · đổi, 10 bản) | `rsprobe time` ×2 | 9,5 / 3,8–4,1 / 12,5–12,8 · 6,1–7,0 · 40,9–41,8 ms | lượt 2: 9,9–10,1 / 3,8–4,0 / 13,6–13,8 · 6,6–7,2 · 41,4–42,0 ms | trong nhiễu | — |

Không thao tác nào của gói B vượt ngưỡng `phase-6.md` hay xấu hơn mốc cùng máy theo luật nhiễu; không có phát hiện P. Ghi cho phiên tổng hợp: chi phí `integrity_check` có chủ ý (K24) tăng tuyến tính theo cỡ file; với file ≈ 2× dữ liệu tải, `app.open-data` chạm ngưỡng 600 ms (ngưỡng chỉ áp cho dữ liệu tải).

## 7. Bảng đếm mức × trục

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | | 0 |
| Low | | | CL3-B1* | (CL3-B1*) | | | | | | | 1 |
| Nit | | | CL3-B2 (KNOWN) | | | | | | | | 1 |

\* gắn hai trục, đếm một lần ở trục đầu. CONFIRMED 1 / 1 (CL3-B1); KNOWN 1 (CL3-B2, đường vào mới); PLAUSIBLE 0. Bảng R: **6 / 6 DR6 của gói B ĐÃ SỬA**. Đột biến: 29 (Rust 12, JS 13, file đọc bằng `readFileSync` 4), **29 KILLED, 0 sống**.

## 8. Đã xét, không thấy (theo trục)

- **R:** 6 DR6 (73, 74, 75, 76, 84 phần B, 88) ĐÃ SỬA (mục 2): tái hiện lượt 2 (CL2-B1 / K1, K2, K6, CL2-B4, CX2-B3) nay ra kết quả đúng ở Node, Rust và exe; mọi test chấp nhận của #656 / #657 / #662 (phần B) đỏ khi gỡ phần sửa (29 / 29). Biến thể còn hở: CL3-B1 (DR6-74).
- **E:** tắt / giết giữa lúc dọn (K4, K5, K6), file bị giữ khi dọn (K7), `VACUUM` lỗi (K10), lần lưu lỗi rồi được (K11), Thùng rác 1 313 bản ghi (K8), file lớn 2× / 3× (K2), file cũ schema 11 (K1), chuỗi lỗi khởi động (K3), key đoạn một ký tự / ba lớp / chữ nhiễu dính sát (K15, K16). Ngoài CL3-B1 không thấy lỗi.
- **C:** spec Phase 6 TR-11 đường chạy (chờ lưu → backup → khóa ghi → một transaction → `VACUUM` ngoài transaction → báo 11j; lỗi `VACUUM` vẫn báo đã dọn), S2-1…S2-6, D7–D10, D13 đối chiếu `app-data.ts` / `purge.ts`: khớp. Câu khởi động mới (DR6-75) khớp `vi.ts` từng chữ trên exe. ADR-0009 D-1 (tới hai lớp; ba lớp ngoài mô hình): khớp `readings`. Câu 11i / 11j trên exe khớp `vi.ts`. CL3-B1, CL3-B2 (KNOWN).
- **D:** sau mọi lần tắt / giết, file chỉ là một trong ba trạng thái nguyên (trước dọn · đã dọn · đã `VACUUM`), backup không bao giờ dở, `.tmp` được dọn ở lần mở (K5, K6); dọn khi lưu lỗi rồi bỏ thay đổi → dữ liệu như trước khi dọn (K7); backup trước khi dọn = file trên đĩa sau khi chờ lưu (K9: chỉ lệch khi file bị ghi đè ngoài app). Thứ tự "mở → kiểm → chép backup → mới lưu" (DR-51) đúng cả với file cần migration 0011 (K1).
- **G:** gói B chỉ có phần Rust của AI: nhận diện / che key (K15–K17), `finish_reason` chỉ là từ thường ≤ 32 ký tự; không thấy gì. Không chạy `ai_key_*` / `open_chatgpt` trên exe (quy tắc 2); key trong probe là key giả.
- **S:** capabilities, CSP, `tauri.conf.json` không đổi từ `4217ed4` (DR6-14 lượt 2 đã thử trên exe); mọi lần chạy exe: chặn DNS mọi host không local, `window.open` thay ngay, `requests blocked: []` ở mọi log (không yêu cầu nào ra ngoài). Không thấy gì ngoài phần key (đã sửa).
- **P:** mục 6.2; không có phát hiện P.
- **B:** mục 6.1; không có mục mới.
- **T:** 29 đột biến đều bị giết, kể cả ba mục sống của lượt 2 (G07d, `Drop`, phiên bản) và hợp đồng tên model mới; bộ `purgeTrash` của `app-data.test.ts` giết cả 8 đột biến hàng đợi. Không thấy test hở mới ở gói B. J5 (K29) chấp nhận, comment khớp.
- **A:** gói B không có màn; trang lỗi khởi động `role="alert"`, tiêu đề `h1`, 0 nút (không thêm nút theo Issue #656), câu tiếng Việt qua i18n; 11i / 11j trên exe có `role="status"` (đọc được qua `getByRole`). Không thấy gì.

## 9. Phụ lục

### 9.1 Probe, log

Mọi file ở `C:\workspace\deep-review-1-6-r3\claude\B\`. Probe JS nạp TypeScript của repo ở SHA ghim qua `hooks.mjs` (chép từ `claude\A\hooks.mjs` lượt 3), không ghi gì vào repo. Probe trình duyệt chỉ có ở exe (`exe-lib.mjs`: DNS chỉ host local, `route` hủy mọi yêu cầu không local trừ khi ca đo đặt `route: false`, `window.open` thay ngay từ lần chạy đầu).

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `hooks.mjs`, `mutant-config.mjs` | nạp TS của repo; vitest với một file đột biến qua `load` hook (chép từ `claude\A\`) | — | mọi probe JS, đột biến JS |
| `p01-integrity.mjs` | DR6-73: 600 lần lật một byte + khởi động; ca chỉ mục lệch; chi phí hai lệnh kiểm (phần C hỏng tên `MIGRATIONS`, thay bằng `p01c`) | `p01-integrity.log` | R 73 |
| `p01c-migrate.mjs` | file schema 11 lượt 2 mở bằng khởi động `119e2e4` | `p01c-migrate.log` | K1 |
| `p05-size.mjs` | `integrity_check` / `openAppData` theo cỡ file 1× / 2× / 3× | `p05-size.log` | K2, 6.2 |
| `mkpurged.mjs`, `mkbig.mjs` | `data\purge-B.db` (lần lưu sau transaction), `purge-C.db` (sau `VACUUM`); `data\big-trash.db` (1 313 bản ghi) | — | K5, K6, K8 |
| `p06-purge-app.mjs` | `AppData.purgeTrash`: file bị ghi đè ngoài app, `VACUUM` lỗi, lần lưu đầu lỗi, thời gian | `p06-purge-app.log` | K9–K11, 6.2 |
| `rsprobe\src\main.rs` | crate Rust tạm nạp `storage.rs` của repo bằng `#[path]` (chép từ lượt 2; thêm `romid`, `acldeny`, `heldshared`, `holdshare`, `purgeloop`, `crashpurge`); `cargo build --release` với target riêng | `rsprobe.log` | R 74, K6, K12–K14, K19 |
| `probe_r3_ai.rs` | module test nối vào **bản chép** `crate\…\src\ai.rs` (bản chép trùng sha256 với repo trước khi nối; trả lại bằng `pristine\ai.rs`) | `probe-r3-ai.log`, `probe-r3-ai-random.log` | R 76, K15–K18 |
| `crate\`, `pristine\` | bản chép `apps/desktop/src-tauri` + `dist` + `rust-toolchain.toml`; bản gốc `ai.rs` / `storage.rs` | `crate-build.log` | đột biến Rust, probe AI, clippy |
| `mutrs.mjs` | 12 đột biến Rust trên bản chép crate | `mutrs.log` | R 74, 76, 88 |
| `mutjs.mjs` | 13 đột biến JS qua `mutant-config.mjs` (`mut\*` là bản đột biến) | `mutjs.log` | R 73, 75, 84 |
| `mutpatch.mjs` | 3 đột biến vá-rồi-trả file repo mà test đọc bằng `readFileSync` + M88d qua hook | `mutpatch.log` | R 88 |
| `exe-lib.mjs`, `exe-r3.mjs` | chạy bản chép exe: `index`, `ro`, `held`, `acl`, `purgeheld`, `purgeclose`, `timeline`, `purgekill`, `bigpurge` | `exe-r3-a…h.log` | R 73–75, 84; K3–K5, K7, K8, K12 |
| `exe-open-size.mjs` | `p2c:data-open` trên exe theo cỡ file | `exe-open-size.log` | K2, 6.2 |
| `clippy-list.mjs` | liệt kê cảnh báo `clippy::pedantic` | `clippy-pedantic.log`, `clippy-list.log` | 6.1 |

### 9.2 Đột biến (29: 29 KILLED, 0 SỐNG)

Rust (`mutrs.log`, bản chép crate, `cargo test --lib`, 104 test gốc): R74, R74b, G07d, Drop, R76a, R76b, R76c, R76d, R76e, R76f, R76g, R76h — KILLED cả 12 (test đỏ ghi ở bảng R); sau đợt: `ai.rs`, `storage.rs` của bản chép = repo, `git status --short` repo rỗng.

JS (`mutjs.log`, vitest qua hook, repo không đổi byte nào): M73a, M73b, M84a, M84b, M84c, M84d, M84e, M84f, M84j, M84l, M75a, M75b, M75c — KILLED cả 13 ngay ở test nhắm, mỗi đột biến có dòng `[mutant] served`.

Vá-rồi-trả (`mutpatch.log`): P88a (ba file về 0.1.0), P88b (bỏ `.` khỏi tập ký tự tên model của Rust), P88c (`MAX_MODEL_CHARS = 8`) — KILLED, mỗi file trả về = `HEAD:` (sha256); M88d (`kimi+k3` trong `AI_MODELS`, qua hook) — KILLED.

### 9.3 Cuối phiên

- Repo: không file nào của worktree bị ghi ngoài 3 lần vá-rồi-trả có kiểm sha256 (P88a–c). Đã gỡ mọi ACL đặt trên bản chép (`icacls /remove:d`), mọi thuộc tính chỉ đọc (`attrib -R`), tắt mọi exe / `rsprobe holdshare` đã chạy.

- `git rev-parse HEAD` cuối phiên: `119e2e45cbce54d8a3943757bd826a7f1e9b694f` (= SHA ghim). `git status --short` cuối phiên: rỗng (như đầu phiên).
- Không còn tiến trình `project2c.exe` / `rsprobe` nào của phiên (`Get-Process`).
- Giờ xong: 2026-10-20 20:12.
