XONG — claude gói F lượt 3, 2026-10-21 00:35

# Deep review Phase 1–6, lượt 3 — Claude, gói F (Xuyên gói, bloat / hiệu năng, công cụ)

## 1. Phiên

| Mục | Giá trị |
|---|---|
| Bên | claude (ID `CL3`) |
| Gói | F — Xuyên gói, bloat / hiệu năng, công cụ |
| Worktree | `C:\workspace\Project-2C-review` |
| SHA đầu phiên | `119e2e45cbce54d8a3943757bd826a7f1e9b694f` (khớp SHA ghim) |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 2026-10-20 23:44 (Home PC `DESKTOP-KDURKJP`) |
| Công cụ | Claude Code CLI (Windows, PowerShell + Git Bash) |
| Model | Claude Opus 5.5 (`claude-opus-5-5`) |
| Mức suy luận | max (Owner đặt `/effort max` cho phiên này) |
| Ultracode | **tắt** (không có thông báo bật; không dùng subagent / Workflow, mọi việc làm trong phiên chính) |
| Bước 0 | `F` đúng một chữ; `claude\F.md` chưa có → làm mới; `claude\A.md`…`E.md` có đủ, dòng đầu đều `XONG` (A 19:20, B 20:12, C 21:16, D 22:08, E 23:35) |
| Song song | app Codex của Owner (2 tiến trình `codex`; không thấy chạy exe / cổng 4173 / 9200–9400). Trước mỗi lần đo: CPU 0–1 %, không `project2c.exe` nào khác, không `pnpm e2e` |

> Tiến độ (ghi dần, giờ máy): 23:44 bước 0 xong; đọc `prompt-claude.md`, `plan.md` (§1–§12, §L2, §L3, Phụ lục I–K), `known.md`, `baseline.md`, `fixes.md` (các Issue / PR của gói F), báo cáo Claude lượt 3 A–E, tổng hợp lượt 2, báo cáo gốc Claude F lượt 2; diff gói F `4217ed4..119e2e4`: 44 file, +2 491 / −328. 23:49 tái hiện DR6-69, 76; 23:51–23:58 43 đột biến `tools/`; 23:55–00:02 bộ unit dưới 7 múi giờ; 00:02 tách bundle, dựng bản e2e; 00:03 K3; 00:03–00:06 K1 trên exe (lần đầu probe lỗi, chạy lại); 00:09–00:10 K2; 00:11–00:14 K4; 00:15 bảng hàm thuần Node; 00:17–00:20 K5–K7; 00:23–00:30 tái hiện CL3-F1 bằng `full-cycle.spec.ts`; 00:33 xong.

## 2. Bảng R (gói F) và bảng R gộp 39 DR6

### 2.1 Phần gói F

**Cách kiểm.** (1) Tái hiện lượt 2: probe lượt 2 của chính Claude gói F (`deep-review-1-6-r2\claude\F\`, chép sang `F\r2\`, mở theo tên đầy đủ) chạy trên bản ghim và trên bản chép `4217ed4` (`git archive 4217ed4 packages/{domain,db,ai} apps/desktop/src tools e2e/perf` → `F\old-4217ed4\`, chọn bằng `P2C_REPO`; loader `F\hooks.mjs` = loader lượt 2, đổi `LOAD` sang dữ liệu tải lượt 3). (2) Gỡ phần sửa: `F\mut.mjs` + `F\mutant-config.mjs` (chép từ gói A): bản đột biến của **một** file `tools/*.mjs` được phục vụ cho vitest qua `load` hook của Vite, repo không đổi byte nào; sống ở test nhắm thì chạy cả bộ. Đối chứng không đột biến: 6 file test `tools/` 189 / 189 xanh (2,5 s). (3) Biến thể: mục 4.

| DR6 | Issue → PR | Kết luận | Bằng chứng (tái hiện lượt 2 nay ra gì; test nào đỏ khi gỡ phần sửa) | Biến thể / ghi chú |
|---|---|---|---|---|
| 69 (phần F: E20 qua hai máy lệch giờ, CL2-F2) | #652 → #666 (`d6c2350`) | **ĐÃ SỬA** (phần F) | `node p09-e20-skew.mjs` (log `F\p09-e20-skew.log` / `.old.log`, mọi bước qua lớp dữ liệu của app: `openAppData` hai đồng hồ, `exportBackup` → `readBackup` / `importBackup`, `listTrash`, `restoreAppointment`). **Bản ghim:** B (máy xóa chậm 5 phút) → dòng Thùng rác `blocked null`, khôi phục `OK`, KH N2 (lượt 2: `TRANSITION_BEFORE_LATEST`, KH kẹt N4); D (máy xóa nhanh 5 phút, chuyển tay N4→N1 ghi sau lúc xóa) → `blocked TRANSITION_BEFORE_LATEST {12/10/2026}`, khôi phục bị từ chối, KH giữ N1 (lượt 2: không chặn, khôi phục ghi `#5 N1→N2` đè chuyển tay). Đối chứng C / E như E20. **Bản `4217ed4` cùng probe:** ra đúng lỗi lượt 2 ở cả hai chiều. Gỡ sửa: gói A (R69a, R69b — `checkTransition` so `created_at` như `4217ed4` — KILLED 4 ca E20 `trash.test.ts:380`, `:396`) | Phần còn lại của DR6-69 (mốc không phần nghìn giây) ở gói A: CL3-A28, CL3-A21 → kết luận gộp **SỬA MỘT PHẦN** (mục 2.2) |
| 76 (phần F: script eval, CL2-F1) | #657 → #680 (`217cef6`) | **ĐÃ SỬA** (phần F) | `node p01-eval-key.mjs` (`evalMain` + `fetch` giả, key giả, file trong bộ nhớ; log `F\p01-eval-key.log` / `.old.log`). **Bản ghim:** cả 8 dạng key trong `content` (nguyên văn, JSON, URL, JSON→URL, URL→JSON, **JSON+JSON** hai cách viết, **URL+URL**) và ca A lượt 1 → `LỖI AI_BAD_RESPONSE` (9 / 9), **0** lần key (mọi dạng) trong file kết quả + log; 8 dạng trong thông điệp 401 → `HTTP 401: bad ***!` (8 / 8). **Bản `4217ed4`:** `jsonJson`, `jsonJsonU005C`, `urlUrl` → `REJECTED`, 25 lần mỗi dạng trong file kết quả; 401 ba dạng hai lớp in nguyên văn. Gỡ sửa (`F\mut.mjs`, `tools/eval-ai-core.test.mjs` 55 test): R76s-a (bỏ lượt hai) KILLED 4; R76s-b (bỏ cách đọc một lượt) KILLED 1 (ca `ODD_KEY`); R76s-c (bỏ cách đọc nguyên văn) KILLED 2; R76s-d (bỏ `%XX`) KILLED 4; R76s-e (chỉ hex hoa) KILLED 4; R76s-f (`mask` chỉ 2 cách đọc đầu) KILLED 2; R76s-g (`reveals` chỉ 2 cách đọc đầu) KILLED 3; R76s-h (cuối escape sai chỗ) KILLED 2; R76s-i (cắt 200 trước khi che) KILLED 2 — 9 / 9 | Biến thể ba lớp / `\` trần ngay trước escape của key: ngoài mô hình (K23, ADR-0009 D-1), như gói B K15–K16. Rust ↔ script cùng bộ ca (vân tay `0x834ac61c`, test có sẵn) |
| 84 (phần F: đo) | #662 → #707, #709, #710 | **ĐÃ SỬA** (phần F: đường lỗi cũ "Thùng rác chỉ lớn lên, mở chậm tuyến tính" đã có lối ra; số đo dưới) | **Exe ghim, dữ liệu do exe lượt 2 ghi** (K1, `F\k1-upgrade-purge.mjs`, log `F\k1-upgrade-purge.log`, JSON `.json`; `Project2C-data\project2c.db` lấy từ `r2\claude\F\exe\trash-1200\` = dữ liệu tải lượt 2 + 1 200 KH xóa, schema 11, 1 313 dòng Thùng rác; cổng 9381, cửa sổ trên cùng, đo khi đã ngắt DevTools như probe T-218): `trash.open` trước khi dọn **151,9 ms** (155,2 / 151,9 / 146,8; lượt 2 trên exe lượt 2 cùng file: 138,3 ms, +10 %, trong luật nhiễu); bấm "Backup rồi dọn sạch" → khung hình có 11j **153,9 ms**, lần lưu đầu 155 ms; file 14 127 104 → **2 760 704 B**; `trash.open` sau khi dọn **3,7 ms** (3,4 / 3,9 / 3,7). Dữ liệu tải lượt 3 (113 / 1 313 dòng): `baseline.md` (Node, exe 113 dòng: 151,8 ms, 38,9 → 9,6 ms), gói B (exe 1 313 dòng: 148 / 150 ms), gói A (Node). Không có ngưỡng cho dọn (plan §L3.6); cùng máy, cùng đường hàng đợi: `backup.import` 47 ms, `backup.export` 425 ms (`baseline.md`). Gỡ sửa: gói A (151 / 192 đột biến lệnh, D1–D13), B (8 / 8 hàng đợi), E (màn) | Tổng quan / Cài đặt → Dữ liệu trùng từng chữ trước / sau khi dọn và sau khi lấy lại bản backup trước lúc dọn (K1). Câu nhắc TR-13 hiện ở 1 313 dòng. `p2c:data-open` lần mở có migration 0011 (profile WebView2 mới) 539 ms ≤ 600 ms |
| 85 | #660 → #689 (`bbb20b1`) | **ĐÃ SỬA** | `node p04c-merge-gate-r3.mjs` (log `F\p04c-merge-gate-r3.log` / `.old.log`): `tools/pr-status.mjs` và `tools/merge-pr.mjs --dry-run` **thật**, `gh` giả (`F\fake-gh.mjs` = bản lượt 2 + `compare` phân trang như tài liệu REST và như PR #689 đo trên GitHub: `per_page` + `--paginate` → mọi trang, mỗi trang cùng `total_commits`; không `per_page` → 250 commit mới nhất), git chỉ lệnh đọc. **S6a của CL2-F3** (251 commit, commit cũ nhất là code, 250 mới nhất docs-only): bản ghim đọc 3 trang, 251 commit → `blocked … main got code since feed000`, `merge-pr --dry-run` exit 1; bản `4217ed4` đọc 250 → `ready`, `merge-pr` exit 0 (lỗi lượt 2). S6h (1 000 commit, commit thứ 501 là code): ghim chặn, cũ `ready`. S6d (GitHub không trả `total_commits`): ghim chặn "Read 251 of the ? commits", cũ `ready`. Gỡ sửa (`tools/pr-core.test.mjs` + `pr-status.test.mjs`, 80 test): R85a (bỏ luật "đọc thiếu") KILLED 3; R85b (số đếm thiếu cho qua) KILLED 2; R85c (bỏ `per_page`) KILLED 2; R85d (đếm từ SHA đã đọc) KILLED 2; R85e (thiếu số đếm → 0) KILLED 1; R85f (chỉ trang đầu) KILLED 3; R85g (dòng `tested` không nói "only n read") KILLED 2; R85h (`loadedBlockers` truyền số SHA đã đọc) KILLED 2; R85i (`gh api` không `--paginate`) KILLED 3; R85j (ghi chú #642: PR đã đóng lại bị đòi tested base) KILLED 2 — 10 / 10 | S6e (main nhận thêm một commit docs giữa hai trang → "201 commit(s) … only 202 read", vẫn `ready`): đúng ghi chú KNOWN #689 (NIT `pr-status.mjs:134`), không bằng chứng mới. S6f (commit thêm là code) → chặn đúng. S6g (0 commit) → `ready`. Tên file đổi bị coi là docs: KNOWN #689 |
| 86 | #660 → #689 | **ĐÃ SỬA** | `p03-retro.mjs`, `p03b-retro-83.mjs`, `p03c-retro-multi.mjs` (probe lượt 2, `tools/retro.mjs` thật trên **home giả** qua `USERPROFILE`, transcript giả; log `F\p03-retro-all.log` / `.old.log`): ba thư mục `.claude` / `.claude-b` / `.claude-c` → bản ghim **3 of 3** phiên với mọi giá trị `CLAUDE_CONFIG_DIR` (cũ: 2 of 3, không đặt biến 1 of 3); `CLAUDE_CONFIG_DIR` = `~\.CLAUDE` (khác hoa thường) và dạng 8.3 `C:\WORKSP~1\DEEP-R~2\…\CLAUDE~1` → ghim 2 phiên, mỗi thư mục một lần (cũ: phiên `aaaa1111` đếm hai lần). Gỡ sửa: R86a (chỉ `.claude`) KILLED 2; R86b (bỏ `CLAUDE_CONFIG_DIR`) KILLED 1; R86c (không đường dẫn thật) KILLED 3; R86d (không khử trùng) KILLED 2; R86e (giữ mục `.claude*` không phải thư mục) KILLED 3 (`tools/retro-core.test.mjs`, 17 test). Phần I/O (`realpathSync.native`, không unit test theo `.claude/rules/tests.md`): bản chép `F\mut-tools\retro.mjs` đổi thành `realpathSync` thường → ca 8.3 đếm **3** phiên thay vì 2 (`p03e-retro-realpath-mutant.log`): lần chạy thật này là thứ giữ hành vi, như PR #689 ghi | `p03d-retro-junction.mjs`: thêm junction `.claude-j` → `.claude` và một **file** tên `.claude-notes` → ghim đọc `.claude`, `.claude-b`, `.claude-c` mỗi thư mục một lần, 3 of 3, bỏ qua file (cũ: 1 of 3). README `docs/metrics/README.md:24` nay nói "mọi `~/.claude*`" — khớp |
| 92 (phần F: cả bộ unit theo múi giờ) | #660 → #689 (`bbb20b1`) | **ĐÃ SỬA** | `node p11-tz-r3.mjs` (log `F\p11-tz-r3.log`; `vitest run` cả repo, không coverage): **Pago Pago (UTC−11) 3 159 / 3 159** (lượt 2 CL2-F5: 1 failed `OUTCOME_IN_FUTURE`), Honolulu (−10), Los Angeles (−7), Kathmandu (+5:45), **Etc/GMT-12 (+12) 3 159 / 3 159** — khoảng UTC−11…+12 mà comment DR-15 (`packages/db/src/test-support.ts:10-11`) hứa nay đúng cho **cả repo** (nhờ cả #702, T-263, ca hash seed ở UTC). Ngoài khoảng: Chatham (+13:45) 1 failed (ca TR-5 HĐ phát hành sau hôm nay — ACCEPTED, ghi chú #539), Kiritimati (+14) 23 failed (lượt 2: 24) — đúng lời hứa. Gỡ sửa: gói A (R92: đồng hồ về 10:00 UTC → KILLED dưới Pago Pago, `OUTCOME_IN_FUTURE`) | — |
| 98 | #665, #695 → #696 (docs), #660 → #689 (probe) | **ĐÃ SỬA** (sửa bằng tài liệu + probe) | Tài liệu: `docs/metrics/phase-6.md:164-205` mục "Mốc Home PC sau #656" (bảng 35 thao tác, giải thích hai dòng ⚠️, `trash.open` đo khi ngắt DevTools), JSON `docs/metrics/phase-6-baseline/perf-home-pc-sau-656.json` (bước chuẩn bị lượt 3 dùng làm `PERF_BASE` được, `baseline.md`); `e2e/perf/README.md` có câu "DevTools cũng làm chậm thao tác chạy nhiều câu SQL … ×2,4–3,3 … `trash.open` cũng đo khi đã ngắt". Probe: `e2e/perf/probe.perf.ts` `trashOpen()` → `detached('trash.open', …, SCREEN_LIMIT)` sau `memory.js-heap`. Khớp số đo: probe của bước chuẩn bị ra `trash.open` 38 ms (mốc sau #656: 34; exe lượt 2 khi gắn DevTools: 73), cùng cỡ số đo ngắt DevTools của K1 / gói B | Phần probe là mã đo (I/O exe), không có unit test, Issue #660 không đòi — lần chạy probe của bước chuẩn bị là thứ kiểm (38 ms, không lỗi "no frame painted") |

Kết luận phần F: **7 / 7 ĐÃ SỬA** ở phần của gói F (69 phần hai máy, 76 phần script, 84 phần đo, 85, 86, 92 phần cả repo, 98). Đột biến "gỡ phần sửa" của gói F: 24 (R76s ×9, R85 ×10, R86 ×5), **24 KILLED**, cộng một đột biến I/O chạy thật (`realpathSync`) làm sai kết quả như mong đợi.

### 2.2 Bảng R gộp đủ 39 DR6 (Claude, A–F lượt 3)

Gộp từ mục 2 của `claude\A.md` … `E.md` lượt 3 và mục 2.1 ở trên. Một DR6 nhiều gói: kết luận gộp là kết luận yếu nhất của các gói. "Gỡ sửa": đột biến gỡ phần sửa / áp lại đột biến sống lượt 2 của dòng đó, K = bị test giết, S = sống (lý do ở báo cáo gói). Mọi dòng có tái hiện lượt 2 (lượt 1 với DR6-17, 23, 24) chạy lại ở `119e2e4`; phần lớn cùng probe chạy trên bản chép `4217ed4` ra lỗi cũ.

| DR6 | Mức | Issue → PR | Gói | Kết luận gộp | Bằng chứng chính (lượt 3) | Gỡ sửa | Biến thể / phát hiện lượt 3 |
|---|---|---|---|---|---|---|---|
| 17 | L | #661 → #698 | C | **ĐÃ SỬA** | Ca L·CX-C1 (NFD, ZWSP trước mỗi dấu) → V3 / V4 / V5 / V6 / V6 (`4217ed4`: đạt cả 5); câu dán ChatGPT web NFD + ZWSP → thử lại | K 8 (R17a–h) | CL3-C3 |
| 23 | N | #661 → #698 | C | **ĐÃ SỬA** | 7 câu thường chặn nhầm lượt 1 nay đạt; chữ viết không dấu vẫn chặn; 10 637 đoạn chữ thật: 0 khớp trộn, 0 lần chỉ bản mới chặn | K 5 | CL3-C4 |
| 24 | N | #661 → #698 | C | **ĐÃ SỬA** | `detail` V1 nêu dạng đúng ("cần mã dữ kiện dạng F12", danh sách giá trị, "thiếu, cần array"); hiện đúng trên màn | K 6 · S 1 (R24d tương đương) | — |
| 68 | M | #652 → #666 | A, E | **ĐÃ SỬA** | Ghi Đã gặp 05/10 giữ N3 cho KH tạo 10/10: OK (lượt 2: `TRANSITION_BEFORE_LATEST`); luật nhập nhận; 6c khóa nhóm tạo KH; fuzz 10 000 lệnh 0 lỗi | K 6 (A 4, E 2) | CL3-A13 (test hở), CL3-A26 (luật ×3) |
| 69 | L | #652 → #666 | A, F | **SỬA MỘT PHẦN** | E20 theo `seq`: cùng mili giây / đồng hồ lùi (A `p21`), hai máy lệch giờ cả hai chiều (F `p09`) nay đúng | K 2 (A) | **CL3-A28** (mốc xóa viết khác dạng: phần Issue #652 hứa), CL3-A21 (thứ tự Thùng rác), CL3-A19 |
| 70 | L | #653 → #667 | E | **ĐÃ SỬA** | W8 lượt 2: 6f nay có khung "Khi lưu · … RF bớt 1"; Lưu ra đúng câu | K 4 | — |
| 71 | L | #652 → #666 | A | **ĐÃ SỬA** | File sửa tay của CL2-A4 → `BACKUP_INVALID {rule:4}` | K 4 | — |
| 72 | L | #659 → #686 | A, D | **ĐÃ SỬA** | 7 ký tự DR6-72 → ""; "Sao Mai" + U+3164 → `TEAM_NAME_TAKEN`; hộp 5a / 9c / 7a theo luật mới | K 13 (A) · S 1 (R72ui ở màn: luật giữ ở test `domain` / `db`) | CL3-A4, A6, A7, A8, A16 |
| 73 | L | #656 → #674 | B | **ĐÃ SỬA** | 257 / 257 ca `quick_check` "ok" mà `integrity_check` bắt: khởi động từ chối, 0 backup, 0 lưu; exe "File dữ liệu bị hỏng" | K 2 | — |
| 74 | L | #656 → #674 | B | **ĐÃ SỬA** | Thuộc tính chỉ đọc → `ACCESS_DENIED`, exe trang lỗi, file không đổi | K 2 | CL3-B1 (ACL / chỉ đọc giữa phiên) |
| 75 | L | #656 → #674 | B, D | **ĐÃ SỬA** | Câu mới "đóng cửa sổ này… đóng cả hai cửa sổ"; lần mở thứ ba vào được; 7 trang lỗi `role="alert"` + `h1` | K 3 | — |
| 76 | L | #657 → #680 | B, F | **ĐÃ SỬA** | Rust: JSON→JSON, URL→URL, trộn từng ký tự → `AI_BAD_RESPONSE`, 401 che; 30 000 ca ngẫu nhiên có dấu cách: 0 lọt. Script eval: 8 dạng → 0 lần key trong file kết quả | K 17 (B 8, F 9) | (ba lớp: ngoài mô hình, K23) |
| 77 | L | #661 → #698 | C | **ĐÃ SỬA** | 300 + 701 / 650 000 × U+200B → V1 trần, `recordAiAnalysis` và nhập backup từ chối | K 7 | CL3-C7 (KNOWN K1) |
| 78 | L | #658 → #682 | C | **ĐÃ SỬA** | 22 câu lượt 2 → 0 đề xuất (`4217ed4`: 9 / 7 / 3 / 5…); câu đúng về KH giữ đề xuất | K 8 | CL3-C2 |
| 79 | L | #658 → #682 | C | **ĐÃ SỬA** | 36 003 ký tự 1,81 ms (`4217ed4` 2 219 ms); Edge 37 ms; 0 / 3 551 ghi chú thật cho đề xuất khác | K 2 · S 2 (R79c ≤ 127 ms, R79d tương đương) | — |
| 80 | L | #654 → #669 | D | **ĐÃ SỬA** | 7 / 7 người hỗ trợ có câu làm được; 9b = lệnh trên 51 người | K 9 | CL3-D1 (câu Thùng rác cho người hỗ trợ) |
| 81 | L | #654 → #669 | D | **ĐÃ SỬA** | Hồ sơ mở ở `scrollY 0`; 6 lần đổi màn đều 0 | K 1 | — |
| 82 | L | #654 → #669 | D | **ĐÃ SỬA** | Link 108 ký tự không còn tràn cột KYC Intelligence | K 2 · S 4 (R82a, d, f gần tương đương; R82e → CL3-D4) | CL3-D3, CL3-D4, CL3-C1 |
| 83 | L | #655 → #693 | D, E | **ĐÃ SỬA** | 6 ca `BODY` lượt 2 → đích dự phòng (h2 chi tiết, khung trống, dòng 11e, tiêu đề Hợp đồng) | K 12 (D 6, E 6) | CL3-D2 (màn Team & nhân sự) |
| 84 | L | #662 → #707, #709, #710 | A, B, E, F | **ĐÃ SỬA** | Lệnh: D1–D13, `foreign_key_check` 0, phần đang dùng giống hệt (A); hàng đợi: chờ lưu, backup trước, `replacing` (B); màn 11h–11j, số mọi màn 0 khác (E); exe: 1 313 dòng `trash.open` 151,9 → 3,7 ms, dọn 153,9 ms, dữ liệu exe lượt 2 qua migration 0011 (F K1) | K ≈ 175 (A 151, B 8, E 12…) · S có giải thích | CL3-A10, A11, A12, A18, A29, CL3-E3 (test hở) |
| 85 | L | #660 → #689 | F | **ĐÃ SỬA** | S6a: 251 commit, commit cũ nhất là code → chặn (cũ: `ready`) | K 10 | — |
| 86 | L | #660 → #689 | F | **ĐÃ SỬA** | Ba thư mục cấu hình 3 of 3; 8.3 / khác hoa thường / junction một lần | K 5 (+ I/O chạy thật) | — |
| 87 | L | #652 → #666 | A | **ĐÃ SỬA** | R16 lượt 2 (sống) nay bị giết `customers.test.ts:217` | K 1 | — |
| 88 | L | #656 → #674 | B | **ĐÃ SỬA** | G07d, `Drop`, phiên bản, `AI_MODELS` nay bị giết; J5 = K29 | K 6 | — |
| 89 | L | #658 → #682 | C | **ĐÃ SỬA** | R15d (unit), R15b, R21c (e2e trên bản dựng ngoài repo) nay bị giết | K 3 | — |
| 90 | L | #654 → #669 | D | **ĐÃ SỬA** | R33c–e, R90f, BR3, BR3b nay bị giết | K 7 | — |
| 91 | L | #653 → #667 | E | **SỬA MỘT PHẦN** | N1, N2, R04g (ở `editedDay`), R38c–e, R43e nay bị giết; chỗ nối hộp 6f ↔ `editedDay` không test nào giữ | K 8 · S 1 (R04g-tsx) | **CL3-E4** |
| 92 | N | #660 → #689 | A, F | **ĐÃ SỬA** | `packages/db` (A) và cả repo (F) 3 159 / 3 159 ở UTC−11 và UTC+12 | K 1 (A) | — |
| 93 | N | #653 → #667 | E | **ĐÃ SỬA** | Dòng "15/09/2026 · Đã gặp · nhóm sau N3 · không đổi nhóm KH" | K 2 | — |
| 94 | N | #653 → #667 | E | **ĐÃ SỬA** | "… ghi sau lúc xóa cuộc hẹn này" khi cùng ngày | K 2 | — |
| 95 | N | #653 → #667 | E | **ĐÃ SỬA** (tài liệu) | Mockup 11c = spec E7 = NT-TR-09, khớp app (E K6) | — | — |
| 96 | N | #663 → #700 | D | **ĐÃ SỬA** (tài liệu) | NT-EX-05, NT-KH-16, NT-TM-11 / 15 / 16 khớp `vi.ts` từng câu | — | (NT-TM-16 ghi đúng cặp câu của CL3-D1) |
| 97 | N | #663 → #700 | C | **ĐÃ SỬA** (tài liệu) | `10-su-co.md:82` "200.000" = `vi.ts` | — | CL3-C6 |
| 98 | N | #665, #695 → #696, #660 → #689 | F | **ĐÃ SỬA** (tài liệu + probe) | Mốc sau #656 có trong `phase-6.md` + JSON; probe đo `trash.open` khi ngắt DevTools (38 ms) | — (probe không có unit test) | — |
| 99 | N | #653 → #667 | E | **ĐÃ SỬA** | "Khôi phục HĐ nộp 10/09/2026 · 24.000.000 ₫ …" / "· 30.000.000 ₫ …" | K 1 | CL3-E1, CL3-E2 |
| 100 | N | #655 → #693 | D | **ĐÃ SỬA** | `columnheader` "Thao tác" ở hai bảng | K 3 | — |
| 101 | N | #654 → #669 | D | **ĐÃ SỬA** | "6" + ZWSP + "tỷ" → "6.000.000.000 ₫"; 18 biến thể 0 lệch | K 1 | (CL3-A7: ô FYP / ngày) |
| 102 | N | #661 → #698 | C | **ĐÃ SỬA** | "kỉ luật Thép", "qui luật Thị trường" đạt; "Luật Kinh doanh bảo hiểm" vẫn V6 | K 3 | CL3-C5 |
| 103 | N | #653 → #667 | A, E | **ĐÃ SỬA** | Một hàm `meetingKeepingMove` cho lệnh / seed / màn; dữ liệu tải 3 254 lịch giống hệt `4217ed4`; 6f ↔ lệnh 0 lệch trên 7 503 cuộc gặp | K 6 · S 1 (R103-5 tương đương) | CL3-A20 |

**Đếm: 37 ĐÃ SỬA · 2 SỬA MỘT PHẦN (DR6-69 → CL3-A28; DR6-91 → CL3-E4) · 0 CHƯA SỬA · 0 HỒI QUY.** Mục sửa bằng tài liệu (95, 96, 97, 98): dòng ghi có, khớp app / số đo. DR6-79: nhanh hơn ×400–2 000 mà đề xuất không đổi (0 / 3 551). DR6-103: gộp luật mà hành vi không đổi (3 254 lịch, 7 503 cuộc gặp). DR6-73: chi phí lúc mở +33 ms (K24). Số đo không xấu hơn mốc sau #656 (`baseline.md`: không dòng nào ⚠️). Bảy DR6 lượt 1 kiểm qua mã lượt 2 (01, 04, 19, 30, 49, 60, 62): phần còn lại đúng ở các dòng 93, 68, 79, 82, 72, 88, 90.

## 3. Phạm vi đã đọc

**Diff sửa của gói F** (`git diff --stat 4217ed4 119e2e4` trên file gói F: 44 file, +2 491 / −328; plan §L3.3: SP +530 / −129 ở 15 file, test +1 933 / −185 ở 21 file). Đọc từng hunk: `tools/notes-core.mjs` (mới, 253, đọc hết), `tools/notes-for.mjs` (mới, 95, đọc hết), `tools/ts-hooks-core.mjs` (45) + `tools/ts-hooks.mjs` (9) (mới, đọc hết), `tools/pr-status.mjs` (+62 / −…; đọc 1–140), `tools/pr-core.mjs` (`mergeBlockers`, `CODE_DOCS`, `isDocsOnly`), `tools/merge-pr.mjs` (header, `loadedBlockers`), `tools/retro.mjs` (đọc hết), `tools/retro-core.mjs` (`projectRoots` 180–215), `tools/eval-ai-core.mjs` (84–200: `ESCAPE`, `decode`, `unescape`, `readings`, `reveals`, `mask`, `serverMessage`), `tools/eval-ai.mjs`, `tools/load-data.mjs`, `tools/load-data-core.mjs` (comment), `tools/session-io.mjs` (đọc hết); `e2e/perf/probe.perf.ts` (diff: `detached` + `limit`, `trashOpen`, `importBackup`, `PERF_RUNS`), `e2e/perf/README.md` (diff), `e2e/anchor.ts` (đọc hết), `e2e/support.ts` (diff: `lowestContrast`), `e2e/trash.spec.ts` (ca dọn sạch), `e2e/team.spec.ts:405-480`, `e2e/full-cycle.spec.ts:1-40`, `:95-110`; quét mẫu yếu trên toàn bộ diff `e2e/` (`waitForTimeout`, `.catch(`, `skip` / `only`, `expect.soft`, `toBeGreaterThan(0)`, `\d+`, `page.clock`); `.claude/settings.json` (đọc hết), `.gitignore`, `eslint.config.js` (diff), `.github/ISSUE_TEMPLATE/task.yml`, `.github/pull_request_template.md` (diff). Không đổi từ `4217ed4`: `.github/workflows/ci.yml`, `.githooks/pre-push`, `.claude/hooks/*`, `packages/ui/scripts/`, `apps/desktop/vite.config.ts` (`git diff --stat` rỗng).

**Đọc thêm ở `119e2e4` (luồng xuyên gói, chỗ nối):** `playwright.config.ts` (đủ), `vitest.config.ts` (1–60), `package.json` gốc, `.prettierignore`; `apps/desktop/src/main.tsx` (đủ), `data/today.ts` (đủ), `data/app-data.ts` (`StoragePort`, `openAppData` 252–270, `purgeTrash`, `replace`), `packages/db/src/database.ts:200-245` (`schemaVersion`, `migrate`), bản `3d6c7fc` của `app-data.ts` (`StoragePort`) và `policies.ts` (`NewPolicy`); `apps/desktop/dist/index.html` + `assets/` (bản dựng của bước chuẩn bị).

**Tài liệu:** `CLAUDE.md` gốc, `packages/db/CLAUDE.md`, `.claude/rules/tests.md`; `docs/metrics/phase-6.md:164-205`, `docs/metrics/README.md:24`, `docs/user-guide/09-cai-dat.md` (dòng backup / Nạp lại / Dọn sạch), `docs/testing/nghiem-thu-v1.md:334-340` (NT-EX-06…12); `common\{prompt-claude.md, plan.md (§1–§12, §L2.1–§L2.11, §L3.1–§L3.11, Phụ lục I–K), known.md (đủ), baseline.md (đủ), fixes.md (bảng đầu; #657 / #680, #660 / #689, #671 / #672, #676 / #678, #677, #683 / #684, #691 / #702, #692, #695 / #696, #665, #704 / #705; thân PR #680…#710 cho K5), gates\e2e.log:280-385, perf\purge-exe.mjs, perf\import-load.mjs}`; tổng hợp lượt 2 (§1–§7), báo cáo gốc Claude F lượt 2 (đủ); báo cáo Claude lượt 3 `A.md` (mục 1–2, danh sách phát hiện, 6–9), `B.md` (đủ), `C.md` (mục 1–4, 5 tiêu đề, CL3-C7, 6–9), `D.md` (mục 1–5 đầu, 6–9), `E.md` (mục 1–4, tiêu đề mục 5, 6–9).

## 4. Kịch bản mới đã thử

Chỉ chọn kịch bản không có trong báo cáo lượt 1, 2 (đọc báo cáo gốc gói F của mọi bên lượt 1–2, hai bản tổng hợp) và trong `claude\A.md`…`E.md` lượt 3 (mục 4 của từng gói). K1–K7 là chuỗi nhiều bước qua nhiều gói (exe / Rust ↔ `db` ↔ lớp dữ liệu app ↔ màn; công cụ ↔ sổ ghi chú ↔ quy trình; e2e ↔ app). Probe ở `C:\workspace\deep-review-1-6-r3\claude\F\`; mọi probe trình duyệt / exe chặn mạng ngoài 127.0.0.1 (DNS `--host-resolver-rules` + `route`) và thay `window.open` từ lần chạy đầu.

| # | Kịch bản (các bước, dữ liệu) | Kết quả | ID |
|---|---|---|---|
| K1 | **Nâng cấp exe lượt 2 → lượt 3 rồi dọn sạch, rồi lấy lại dữ liệu trước lúc dọn theo hướng dẫn** (exe ghim, `k1-upgrade-purge.mjs`): `Project2C-data\project2c.db` do exe lượt 2 ghi (schema 11, dữ liệu tải lượt 2 + 1 200 KH xóa, 1 313 dòng Thùng rác) → mở bằng exe lượt 3 (migration 0011 + `integrity_check`) → Cài đặt → Dữ liệu, Tổng quan → Thùng rác (câu nhắc TR-13) → 11i → gõ DỌN SẠCH → "Backup rồi dọn sạch" → 11j → đóng (X) → mở lại → đóng, chép `backups\<bản trước lúc dọn>` thành `project2c.db` (`09-cai-dat.md:187`) → mở lại | Mở 539 ms, không màn lỗi; schema 12; backup lúc mở = **đúng file schema 11 trước migration** (sha256 trùng); 11i "1.313 bản ghi … KH 1.215 — kèm 8.358 lịch hẹn · 1.326 HĐ · 4.584 ghi chú KYC · 81 phân tích AI · Lịch hẹn 76 · HĐ 18 · Nhân sự 3 · Team 1"; 11j đúng mẫu + tên backup; file 14 127 104 → 2 760 704 B; Thùng rác trống sau khi mở lại; sau khi chép bản backup: Thùng rác 1 313 dòng như trước, Cài đặt → Dữ liệu và chữ Tổng quan **trùng từng chữ** lần mở đầu; `backups\` 3 bản, không bản nào bị ghi đè; mở file bằng đúng bản backup đã có thì không tạo thêm backup | không thấy |
| K2 | **Nâng hai bậc: dữ liệu của code lượt 1 (schema 9) mở bằng exe lượt 3** (`k2-upgrade-r1.mjs`: `r2\claude\A\old-8855345-load.db`) → migration 0009 + 0010 + 0011 cùng lúc → Xuất backup → Nhập lại chính file đó → Dọn sạch (117 bản ghi) → Xuất / Nhập lại | Mở 588 ms, schema 12, backup lúc mở = file schema 9 (sha256 trùng); dọn đúng (11j "Xóa hẳn 15 KH … · 80 lịch hẹn · 18 HĐ · 3 nhân sự · 1 team"), file 13 410 304 B. **Nhập lại chính bản app vừa xuất bị từ chối** cả trước lẫn sau khi dọn: "File hỏng hoặc không phải backup Project-2C — Chỉ nhận file .p2cbackup do Project-2C xuất…"; nguyên nhân (`k2b-why-refused.mjs`): `BACKUP_INVALID {"rule":4}` — dữ liệu lượt 1 trái luật nhập 4 mới (K18 / K22, #616, #666) | KNOWN K1 (dữ liệu giả lập nạp lại; luật siết áp ở nhập backup) — không ghi phát hiện; xem K4 cho đường thật của NT-EX-08 / 09 |
| K3 | **e2e chạy qua nửa đêm thật** (`k3-e2e-midnight.mjs`, bản dựng e2e ngoài repo `F\dist-e2e`, neo 15/09/2026, cổng 4471): đồng hồ trang đặt 23:59 → mở Tổng quan → chạy đồng hồ 2 phút → Lọc; đối chứng 09:30. Đối chiếu cổng e2e của bước chuẩn bị (`common\gates\e2e.log:292-380`, chạy 23:58:05 → 00:00:40) | 23:59: "Đang xem: Tháng 09/2026MTD 01/09 – **15/09**/2026" → sau 00:00 "**16/09**/2026"; 09:30: không đổi. Rồi chính `e2e/full-cycle.spec.ts` (trình duyệt `timezoneId` `Asia/Yangon`): bắt đầu 23:53 giờ đó → xanh 14,1 s; bắt đầu 23:59:50 → **đỏ** ở `full-cycle.spec.ts:105`, nhận "… 16/09/2026 · Team (4 team)" — đúng lỗi của cổng; 22 / 27 file spec không đặt `page.clock` | **CL3-F1** |
| K4 | **Đường dữ liệu của NT-EX-08 / NT-EX-09** (`k4-phase5-backup.mjs`): code Phase 5 (`3d6c7fc`, `git archive`) mở như exe lần đầu (sinh demo) ở 6 ngày neo (15/09, 12/10, 21/10, 31/12/2026, 28/02, 30/06/2027), thêm KH "Nâng cấp NT" + cuộc gặp Đã gặp N3→N2 + HĐ + một lịch xóa → xuất backup + bytes DB; code ghim: Nhập backup; mở file DB cũ (migration); khôi phục lịch đã xóa; xuất → nhập. Biến thể: lịch xóa là chính cuộc gặp đã đổi nhóm; cuộc gặp giữ nhóm | 18 / 18 (6 ngày × 3 biến thể): nhập OK; mở file cũ OK (schema 12, Thùng rác 1); khôi phục OK — cuộc gặp đổi nhóm về lại N2, giữ nhóm vẫn N3; xuất → nhập OK. Khác K2: demo Phase 5 qua được luật nhập mới | không thấy |
| K5 | **T-261 áp thật trên đợt sửa** (`k5-notes-for-prs.mjs`): 13 PR code merge sau #678 (#680 … #710): `openNotes` + `relatedNotes` của `tools/notes-core.mjs` trên sổ ở commit cha của commit merge và file của PR (`git diff --no-renames`), so với các `L<n>` mà mục "Ghi chú OPEN liên quan" của thân PR (`common\fixes.md`) trả lời | 12 / 13 PR: tập "Trùng file" của công cụ = tập thân PR trả lời (PR #710: 25 / 25, #693: 18 / 18, #698: 17 / 17). #684: công cụ ra L161, thân PR trả lời L162 — cùng một ghi chú (vòng `page.clock.fastForward` của `customer-policies.spec.ts`), sổ dời một dòng giữa lúc viết PR và lúc merge | không thấy |
| K6 | **Hai máy khác phiên bản** (`k6-two-versions.mjs`, K12): máy lượt 2 (`4217ed4`) xóa một KH, xuất → máy lượt 3 nhập, dọn sạch, xuất → máy lượt 2 nhập file đó | Lượt 3 nhập file lượt 2 OK, dọn "1 KH (kèm 5 lịch hẹn · 3 ghi chú KYC)", số đếm không đổi; lượt 2 từ chối `SCHEMA_TOO_NEW {"version":12,"supported":11}` với câu `settings.backup.tooNew` "File tạo từ bản app mới hơn (schema v12, app này v11)" + "Cập nhật app rồi nhập lại. Dữ liệu hiện tại không bị đổi." | không thấy |
| K7 | **Mở nhầm thư mục đã nâng cấp bằng exe cũ** (`k7-downgrade.mjs`): thư mục `Project2C-data\` của K1 (schema 12) chép sang chỗ khác, mở bằng exe lượt 2 (NT-EX-07 + máy chưa nâng cấp) | Trang "File dữ liệu do bản app mới hơn tạo — File dùng schema v12, app này chỉ đọc tới v11. Hãy dùng bản app mới hơn. App không thay đổi gì trong file."; 0 nút; `project2c.db` sha256 và `backups\` không đổi | không thấy |
| K8 | Cổng "tested base" ngoài S6a của lượt 2 (`p04c-merge-gate-r3.mjs`): GitHub không trả `total_commits`; main nhận thêm commit **giữa hai trang** (docs / code); 0 commit; 1 000 commit (10 trang) | Mục 2.1 dòng DR6-85: không trả số đếm → chặn; commit thêm là code → chặn; docs → `ready` kèm "only 202 read" (KNOWN #689); 1 000 → đọc đủ, chặn | không thấy (KNOWN #689) |
| K9 | `retro.mjs` với junction `.claude-j` → `.claude` và một **file** tên `.claude-notes` trong home (`p03d-retro-junction.mjs`); đột biến I/O `realpathSync` thường trên bản chép (`p03e`) | Ghim: 3 thư mục, mỗi thư mục một lần, bỏ qua file; đột biến: ca 8.3 đếm 3 phiên thay vì 2 | không thấy |
| K10 | Bộ unit cả repo dưới 7 múi giờ (`p11-tz-r3.mjs`) | Mục 2.1 dòng DR6-92: UTC−11…+12 xanh hết; Chatham / Kiritimati đỏ đúng ca ngoài khoảng | không thấy |
| K11 | Đột biến hai công cụ mới của đợt sửa (`mut.mjs`): `notes-core.mjs` (T-261) 13 đột biến, `ts-hooks-core.mjs` (T-265) 6 đột biến | `ts-hooks-core` 6 / 6 KILLED; `notes-core` 11 / 13 KILLED, **2 sống cả bộ 3 159 test**: T61f (đường dẫn thư mục của ghi chú trùng thư mục của Issue vào "Trùng file"), T61k (hai nhóm ngoặc `{…}/{…}` chỉ mở nhóm đầu) | **CL3-F2** |
| K12 | `notes-for --files` trên sổ thật (`purge.ts` + `SettingsTrash.tsx`; `e2e/perf/`; `tools/{notes-core,notes-for}.mjs`) và cấu trúc phần OPEN của sổ (dòng không phải mục, thụt tab, U+2028 / U+2029) | Ra đúng 9 / 1 / 3 mục; phần OPEN không có dòng nối tiếp, tab hay U+2028 (giới hạn regex của KNOWN #686 chưa chạm). Ghi chú nêu một file chỉ làm ví dụ (L181 nhắc `tools/notes-for.mjs:55` "đã dùng …") vẫn vào "Trùng file" của task sửa file đó — đúng thiết kế (mọi đường dẫn trong code span) | không thấy |

## 5. Phát hiện mới

Phát hiện của gói A–E lượt 3 không ghi lại ở đây (chỉ dẫn ID ở mục 2.2, 6, 7). Gói F có 2 phát hiện mới.

### CL3-F1 — Bộ e2e không ghim đồng hồ: test chạy qua nửa đêm giờ máy đọc ngày neo +1 (16/09 thay 15/09) và đỏ; `e2e/anchor.ts` hứa ngược lại

```
ID: CL3-F1
Mức: Low
Trục: T
Vị trí: e2e/anchor.ts:3-4 ("so expectations never read the machine clock"); apps/desktop/src/data/app-data.ts:254-260 (ngày ghim = ngày mở + số ngày đồng hồ máy đã qua, T-126); playwright.config.ts:17 (retries: CI 1, cục bộ 0); e2e/full-cycle.spec.ts:105-107; e2e/team.spec.ts:425 (119e2e4)
Tình trạng: CONFIRMED
Liên quan: có từ trước (T-126 cho ngày ghim chạy theo đồng hồ), lượt 1–2 bỏ sót; lộ ở cổng e2e của bước chuẩn bị lượt 3 (`common\baseline.md`, "Hai test e2e flaky")
Kịch bản: K3
```

- **Mô tả:** Bản dựng e2e mở ở ngày neo 15/09/2026 (`VITE_DEMO_ANCHOR`), nhưng từ T-126 ngày ghim chạy theo đồng hồ máy: `today = ngày neo + daysBetween(lúc mở, bây giờ)` (`app-data.ts:256-260`, comment `:254-255` nói rõ "e2e: `page.clock`"). Chỉ 5 / 27 file spec đặt `page.clock`, và chỉ ở vài test; mọi test khác đọc ngày của máy một cách gián tiếp. Test nào chạy qua 00:00 giờ máy thấy 16/09 trong khi chờ chữ của 15/09 (kỳ "Tháng 09/2026 MTD 01/09 – 15/09", ngày lịch hẹn, "hôm nay", hộp kết quả cuộc gặp…). Comment `e2e/anchor.ts:3-4` ("so expectations never read the machine clock") sai từ T-126.
- **Tái hiện / bằng chứng:**
  - Cổng e2e của bước chuẩn bị (`CI=1`, 23:58:05 → 00:00:40, `common\gates\e2e.log:292-380`): `full-cycle.spec.ts:105` chờ `Tháng 09/2026MTD 01/09 – 15/09/2026 · Team`, nhận `Đang xem: Tháng 09/2026MTD 01/09 – 16/09/2026 · Team (4 team)`; `team.spec.ts:425` quá 30 s chờ radio `/giữ nguyên$/` của hộp "Kết quả cuộc gặp". Cả hai qua ở lần chạy lại (sau 00:00, trang mở lại nên ngày neo lại là 15/09).
  - `node k3-e2e-midnight.mjs 4471` (bản dựng e2e ngoài repo, neo 15/09/2026; log `F\k3-e2e-midnight.log`):
    ```
    == the clock installed 1 min before local midnight: clock 23:59:00 21/10/2026 → +2 min
       before: Đang xem: Tháng 09/2026MTD 01/09 – 15/09/2026 · Toàn bộ
       after:  Đang xem: Tháng 09/2026MTD 01/09 – 16/09/2026 · Toàn bộ
    == control: the clock installed at 09:30: … before / after: … 15/09/2026 · Toàn bộ
    ```
  - **Chính spec của repo, tái hiện theo giờ hẹn** (`F\pw-midnight.config.mjs`: `e2e/full-cycle.spec.ts` trên bản dựng e2e ngoài repo, cổng 4471, `retries: 0`, `use.timezoneId` của trình duyệt = `Asia/Yangon` (UTC+6:30) — không đổi đồng hồ máy, không sửa spec). Đối chứng bắt đầu 17:23:55 UTC (23:53 giờ Yangon): `ok 1 … (14.1s)` (`F\k3b-control.log`). Bắt đầu 17:29:50 UTC = 23:59:50 giờ Yangon: `x 1 … (27.9s)` — `full-cycle.spec.ts:105` "the data shows the same as before the export": `Expected substring: "Tháng 09/2026MTD 01/09 – 15/09/2026 · Team"` · `Received string: "Đang xem: Tháng 09/2026MTD 01/09 – 16/09/2026 · Team (4 team)"` (`F\k3b-midnight.log`) — **trùng từng chữ** lỗi của cổng e2e bước chuẩn bị.
  - Đếm `page.clock` theo file spec: 22 / 27 file không có lần gọi nào (`appointments`, `full-cycle`, `team`, `reports`, `overview`, `customer-*`…).
- **Ảnh hưởng:** chỉ test, không ảnh hưởng sản phẩm. `pnpm e2e` cục bộ (retries 0) vắt qua nửa đêm → đỏ thật, phải chạy lại cả bộ (≈ 2,6 phút; reviewer và Owner hay chạy cổng lúc khuya — lần chạy của bước chuẩn bị là ví dụ). CI (retries 1) → test được tính "flaky" trong tóm tắt job khi một lần chạy vắt qua nửa đêm giờ của runner.
- **Đề xuất:** cố định đồng hồ trang cho mọi test e2e (fixture chung ở `e2e/support.ts` hoặc `beforeEach` gọi `page.clock.setFixedTime` / `install({ time: ANCHOR_MORNING })`; test nào cần qua nửa đêm thì tự `fastForward` như `period-picker.spec.ts`), sửa comment `anchor.ts`. ≈ 10–30 dòng e2e, không đổi SP.

### CL3-F2 — Test hở công cụ mới `notes-core` (T-261): đường dẫn thư mục trùng thư mục của Issue và ngoặc nhiều nhóm — 2 đột biến sống cả bộ

```
ID: CL3-F2
Mức: Nit
Trục: T
Vị trí: tools/notes-core.mjs:201 (`same` bỏ đường dẫn thư mục khỏi "Trùng file"), :18-23 (`expandBraces` mở đệ quy từng nhóm ngoặc); tools/notes-core.test.mjs (119e2e4)
Tình trạng: CONFIRMED
Liên quan: mới do T-261 (PR #678)
Kịch bản: K11
```

- **Mô tả:** Test chấp nhận của #676 ghi "thư mục ghi chú nêu (`e2e/perf/`) → Trong vùng, không vào Trùng file", nhưng không ca nào cho đích là **đúng thư mục đó** (Issue liệt kê `e2e/perf/`): bỏ điều kiện `!isFolder(path)` thì ghi chú thư mục nhảy sang "Trùng file" mà cả bộ vẫn xanh. Mở ngoặc chỉ có ca một nhóm; mở mỗi nhóm đầu (không đệ quy) cũng xanh.
- **Tái hiện:** `node mut.mjs T61f T61k` (log `F\mut.log`): `T61f | … a folder path counts as exact | SURVIVED (whole suite) — Tests 3159 passed (3159)`; `T61k | … braces not expanded inside | SURVIVED (whole suite) — Tests 3159 passed (3159)`. 11 / 13 đột biến khác của `notes-core` và 6 / 6 của `ts-hooks-core` bị giết.
- **Ảnh hưởng:** code hiện đúng; sổ và Issue hiện không có hai dạng này (`git grep` / `fixes.md`: không span nào có hai nhóm ngoặc; ghi chú thư mục chỉ có `apps/desktop/src/routes/customers/`, `.claude/worktrees/`). Một lần sửa sau làm hỏng thì `notes-for` báo sai nhóm mà CI xanh; chỉ là công cụ phát triển.
- **Đề xuất:** hai ca test: `relatedNotes` với ghi chú `e2e/perf/` và đích `['e2e/perf/']` → `area`; `targetPatterns(['packages/{db,domain}/src/{a,b}.ts'], …)` → 4 đường dẫn (+ file test). ≈ 10 dòng test.

## 6. Bloat và Hiệu năng

### 6.1 Bloat (toàn codebase)

Số của gói A–E lấy từ mục 6.1 của `claude\A.md` … `E.md` lượt 3 (cùng SHA, cùng máy), không đo lại; gói F đo phần của mình và các phép toàn repo. Không cài công cụ mới.

| Đã chạy / đo | Trên | Kết quả (lượt 3 so lượt 2, Home PC) | ID |
|---|---|---|---|
| `tsc --noUnusedLocals --noUnusedParameters` | mọi package + app + `e2e` (hai cờ bật sẵn ở `tsconfig.base.json:12-13`; `pnpm typecheck` gồm `tsc -p e2e`, xanh ở `baseline.md`); gói A, C, D, E chạy tạm lệnh cho `domain`, `db`, `ai`, `ui`, app: exit 0 | 0 biến / tham số thừa (như lượt 1–2); `tools/*.mjs` qua ESLint `no-unused-vars` (`pnpm lint` trong `pnpm verify`) | — |
| Export không có nơi dùng ngoài file (`F\exports-f.mjs` = script lượt 1–2 → `exports-f.log`, 60 dòng; A–E: scanner từng gói) | `tools/`, `e2e/` helper, hook `.claude`, `ui/scripts` | 60 dòng (lượt 2: 59): thêm `toNewYearsEve` (helper e2e mới, test dùng). Export của công cụ mới (`notes-core`: `allowedPatterns`, `targetPatterns`, `openNotes`, `relatedNotes`, `formatRelated`; `ts-hooks-core`: `tsHooks`) đều có nơi dùng SP (`notes-for.mjs`, `ts-hooks.mjs`). Còn lại là seam test của `*-core.mjs` và hằng / kiểu dùng trong file như lượt 1–2. A–E: mọi export mới của đợt sửa có nơi dùng SP; `PURGE_REMINDER`, `PurgeView` chỉ dùng trong file (E, cùng loại DR6-66 KNOWN) | KNOWN (DR6-66) |
| Code lặp nguyên thân hàm ≥ 25 token (`F\dup-scan.mjs 25` → `dup-scan.log`) | 201 file SP, 1 039 thân hàm (lượt 2: 195 / 993) | **1 nhóm** (lượt 2: 2): `plain` `appointment-form.ts:128` ≡ `trash-view.ts:58` (KNOWN #543). Nhóm hook `resolve` của `eval-ai.mjs` ≡ `load-data.mjs` (KNOWN #566) **đã hết** nhờ T-265 (`tools/ts-hooks*.mjs`) | KNOWN |
| Code lặp theo cấu trúc ≥ 35 token (`dup-scan-struct.mjs 35` → `dup-scan-struct-35.log`) | như trên | **7 nhóm** (lượt 2: 9): `update<X>Row` ×4, `list<X>` ×3, `remove` ×3 + ×2, `restore<X>` ×3, `analysesOf / notesOf / factsOf` ×3, `toggle` ×2 — họ DR6-67 (KNOWN, hoãn); `resolve` ×2 và `isCustomerLive / reviewsLiveAppointment` ×2 đã hết. Mới của đợt sửa (đọc diff, A, E): luật DR-43 ×3 (CL3-A26), cột trỏ tới nhân sự ×4 (CL3-A27), đếm "kèm …" ×2 (CL3-A18), `PurgeDialog` ≈ `ReloadDialog` (KNOWN #710) | (CL3-A26, A27) |
| Cấu thành bundle theo package (`r2\bundle\split-build.mjs` của lượt 2 chạy lại → `F\split-build.log`; `vite build` của repo, một chunk mỗi package / dependency) | bản dựng web ở SHA ghim, không biến môi trường | Tổng JS + CSS **2 404 213 B** (lượt 2 2 385 800, **+18 413**; gzip 713 766, +4 565 — khớp `baseline.md` +18 357 / +4 645 của bản dựng thật). Phần tăng: `app-routes` +5 748 (202 172), `pkg-db` +5 403 (58 990: `purge.ts` ≈ +4 KB theo gói A), `app-i18n` +4 087 (74 091), `pkg-ai` +1 480, `pkg-db-migrations` +1 414 (0011), `pkg-ui` +174, `app-data-shell` +129, `index.css` +94, `pkg-domain` +80, `pkg-db-seed` −196. **Mọi dependency giống từng byte lượt 2** (`other-node_modules` / exceljs 931 625, ECharts 512 882, `react-dom` 207 089, `zod` 89 716, `drizzle-orm` 63 688, `sql.js` 39 781, `tanstack` 35 611, `tauri-api` 15 114, `react` 11 751) | — |
| Bundle thật (`baseline.md`, `apps/desktop/dist/index.html`) | `pnpm build:web` của bước chuẩn bị | `index.js` 927 932 B (+18 263 so lượt 2), `index.css` +94; `chart.js` (ECharts 513 KB) vẫn `modulepreload` lúc mở, `exceljs` nạp lười — như lượt 1–2 (K15, DR6-25 KNOWN) | — |
| Dependency khai báo | `git diff 4217ed4 119e2e4` trên mọi `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `Cargo.toml`, `Cargo.lock`, `tauri.conf.json`, capabilities, `vite.config.ts`, `rust-toolchain.toml` | rỗng: không thêm / bớt / đổi phiên bản | — |
| Exe | `baseline.md`, gói B | 5 408 768 B (lượt 2 5 404 672, +4 096); `cargo clippy -W pedantic` lib 20 cảnh báo (lượt 2: 19; mới: một `doc_markdown`), không cái nào là lỗi / code chết (B) | — |
| Cỡ dòng (`node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json`) | 6 gói | trùng plan §L3.3: F SP 4 340 (+401 so lượt 2: `notes-core` 253 + `notes-for` 95 + `ts-hooks*` 54, `load-data` / `eval-ai` −49…), test 14 165 (+1 748); toàn repo SP 35 178 (+1 390), test 45 635 (+4 002) | — |
| Mã lỗi ↔ câu i18n (`F\p9-error-keys.mjs` → `p9-error-keys.log`); khóa i18n (gói D, E) | `DB_ERROR_CODES` 59, `AI_ERROR_CODES` + local 11 ↔ `vi.ts`; 1 154 khóa | Thiếu đúng 5 mã như lượt 1–2, mỗi mã có đường hiện riêng; 0 khóa không dùng, 0 khóa chỉ test dùng (D, E) | — |
| `pnpm lint:deps`, `pnpm codemap:check` | `baseline.md` | 0 vi phạm (320 module, 1 312 phụ thuộc; lượt 2 315 / 1 277); codemap khớp | — |
| Code chết (A, C) | `purge.ts`, `team.ts`, `trash.ts`, `customers.ts`, `text.ts`, `packages/ai` | chỉ nhánh người đánh giá của `KEPT_PEOPLE` (`purge.ts:88`, ≈ 70 B) | (CL3-A25) |

Đề xuất refactor bloat: không có mục mới ở gói F. Của các gói: CL3-A26 (một hàm "nhóm của ngày"), CL3-A18, CL3-A27, CL3-A25 — gộp khi chạm file như DR6-67; DR6-25 / 66 / 67 vẫn hoãn (KNOWN). Công cụ nên có (G4, chỉ đề xuất): visualizer bundle, `cargo-bloat`.

### 6.2 Hiệu năng (toàn codebase)

**Máy, lúc đo:** Home PC `DESKTOP-KDURKJP` (i9-12900K), Node v24.20.0. Đo F (Node 21/10 00:15:28–00:15:45, exe 00:05:30–00:06:40 và 00:09:47–00:10:40) khi CPU 0–1 %: không `pnpm e2e`, không build, máy chủ web tạm 4471 đã tắt, không exe nào khác, không cổng 9200–9400 nào nghe; tiến trình nền có mặt: app Codex (2 tiến trình `codex`, không thấy chạy exe / cổng). Mốc: `common\baseline.md` (exe ghim so mốc sau #656 — không dòng nào ⚠️), probe lượt 2 cùng máy (`docs/reviews/raw/2026-10-17/claude/F.md` §6.2), số lượt 3 của A–E. Luật nhiễu: xấu hơn khi > 20 % **và** > 10 ms.

**A. Hàm thuần trong Node** (`node --expose-gc p08-node-perf.mjs` = probe lượt 2, dữ liệu tải lượt 3 qua `importBackup`, hôm nay 12/10/2026; log `F\p08-node-perf.log`; trung vị):

| Hàm (Node) | n | Lượt 3 | Lượt 2 (cùng máy) | Ngưỡng | So |
|---|---:|---|---|---|---|
| `importBackup` (15 676 559 ký tự) | 5 | 728,5 ms (711,8–829,5) | 731,1 | ≤ 1 100 ms ✅ | trong nhiễu |
| `listAppointments` (10 255 lịch) | 7 | 44,1 ms | 44,7 | ≤ 65 ms ✅ | — |
| `teamCompare` năm / tháng | 7 | 2,64 / 1,49 ms | 2,95 / 1,46 | ≤ 15 ms ✅ | — |
| `reportRows` năm / tháng · Toàn bộ | 7 | 7,94 / 5,52 ms | 7,51 / 5,93 | ≤ 15 ms ✅ | — |
| `monthGrid` tháng | 7 | 0,76 ms | 0,77 | ≤ 2 ms ✅ | — |
| `countRecords` | 7 | 4,69 ms | 5,02 | ≤ 15 ms ✅ | — |
| `listTrash` 113 dòng | 7 | 25,3 ms | 20,95 | màn < 200 ms ✅ | +4,4 ms (+21 %), dưới 10 ms → trong nhiễu; phần `keptRecords` mới (CL3-A29, KNOWN #709) |
| `listTrash` +75 / +100 / +150 / +300 / +400 / +600 / +1 200 KH xóa (188 … 1 313 dòng) | 7 | 30,3 / 31,5 / 35,1 / 47,6 / 55,1 / 71,6 / 116,7 ms | 26,7 / 26,7 / 31,5 / 43,4 / 52,1 / 68,2 / 115,9 | màn < 200 ms ✅ | +1…+5 ms mỗi cỡ (cùng phần cố định) |
| `readTables` 6 bảng / một lệnh ghi + đọc lại đủ bảng | 15 | 66,0 / 65,9 ms | 67,2 / 66,9 | màn < 200 ms ✅ | — |
| `db.export()` / `exportBackup` | 9 / 5 | 1,86 / 165,5 ms | 1,90 / 170,4 | exe ≤ 1 000 ms ✅ | — |
| Phần AI của hồ sơ KH (KH nhiều phân tích nhất / 95 KH) | 20 / 3 | 0,37 / 29,8 ms | 0,37 / 28,7 | < 200 ms ✅ | — |
| Bộ nhớ: 8 lần `readBackup` + `importBackup` (`rss` / heap MB) | 8 | 491–495 / 55,6–56,0, không tăng | 502–506 / 55,6–55,9 | — | không rò |

**B. Exe release (`common\exe\project2c.exe` bản chép, cổng 9381, cửa sổ trên cùng; đo như probe T-218, lệnh ghi và Thùng rác khi đã ngắt DevTools):**

| Đo | Trên | Lượt 3 | Mốc cùng máy / ngưỡng | ID |
|---|---|---|---|---|
| Probe `e2e/perf` của bước chuẩn bị (không đo lại) | dữ liệu tải lượt 3 | 35 thao tác trong ngưỡng; so mốc sau #656 **không dòng nào ⚠️**; so lượt 2 chỉ `app.open-data` ⚠️ (373 so 301 ms, 1 mẫu; K24 `integrity_check`) | `phase-6.md` ✅ | — (K24) |
| Mở lần đầu (LCP, cách T-227, không đo lại) | `baseline.md` | 3 614 ms (mốc sau #656: 3 663) | xấu hơn khi > 4 396 / 4 724 ms ✅ | — |
| `p2c:data-open` khi exe lượt 3 mở **file lượt 2** (migration 0011 + `integrity_check`, profile WebView2 mới) — K1 | `project2c.db` 14,1 MB, schema 11 | 539 ms; mở lại cùng profile (file sau dọn, 2,8 MB) 226 ms; mở bản backup 14,1 MB 406 ms | ≤ 600 ms ✅ (ngưỡng áp cho mở lại dữ liệu tải) | — |
| `p2c:data-open` khi mở **file lượt 1** (migration 0009 + 0010 + 0011) — K2 | 13,9 MB, schema 9 | 588 ms | ≤ 600 ms ✅ (lần nâng cấp một lần) | — |
| `trash.open` 1 313 dòng, đã ngắt DevTools — K1 | file lượt 2 qua 0011 | 151,9 ms (146,8–155,2) | exe lượt 2 cùng file 138,3 ms (+10 %, trong nhiễu); < 200 ms ✅ | — |
| Dọn sạch: bấm → khung hình có 11j — K1 | 1 313 dòng | 153,9 ms, lưu đầu 155 ms; file 14 127 104 → 2 760 704 B | không đặt ngưỡng; B: 148 / 150 ms; `baseline.md` 113 dòng 151,8 ms | — |
| `trash.open` sau khi dọn — K1 | Thùng rác trống | 3,7 ms (3,4–3,9) | `baseline.md` 9,6 ms (113 dòng → trống) | — |

**C. Tổng hợp số của cả lượt 3 (Claude, Home PC, cùng SHA):**

| Vùng | Số chính (lượt 3) | So mốc cùng máy / ngưỡng | ID |
|---|---|---|---|
| Exe, probe (`baseline.md`) | mọi thao tác màn ≤ 38 ms (lớn nhất `trash.open` 38, đã ngắt DevTools); `backup.read` 827, `backup.import` 47, `backup.export` 425, `db.save` 146, `reports.export-excel` 23, `appointments.next-month` / `-year` 103 / 106 ms; JS heap 16,6 MB | không dòng nào ⚠️ so mốc sau #656; trong mọi ngưỡng `phase-6.md` | — |
| Gói A (Node, lệnh) | mọi lệnh ≤ 0,72 ms; `integrityCheck` 101 ms (+34, K24); `listTrash` +5 ms (`keptRecords`); Dọn sạch 101 / 111 ms (113 / 1 313 dòng), khóa ngoại tắt đúng (bật thì ≈ 3 s) | không phát hiện P vượt ngưỡng; vòng vi mô `stageOnDay` ⚠️ không phải thao tác người dùng | CL3-A29 (Nit, KNOWN) |
| Gói B (Rust / exe) | `integrity_check` ≈ 7,5 ms / MB; exe 1× / 2× / 3× dữ liệu: `p2c:data-open` 366 / 453 / 546 ms; `reveals` / `mask` −35 % | ≤ 600 ms ✅ ở dữ liệu tải; chạm 600 ở ≈ 2× cỡ dữ liệu tải (ghi cho tổng hợp) | — |
| Gói C (AI) | Mock trích xuất 36 003 ký tự 1,8 ms (lượt 2: 2 042 ms); lần kiểm V3–V6 đầu 136 ms (−60); phần AI hồ sơ 0,40 ms | nhanh hơn / trong nhiễu | — |
| Gói D (màn nhập liệu, bản web) | mọi thao tác ≤ 33 ms trung vị; 9b `personUsage` SQL +2,5 ms | trong nhiễu | — |
| Gói E (bản web) | Thùng rác 113 / 1 313 dòng (gắn DevTools) 76,5 / 449,2 ms → sau dọn 9,5 / 2,9 ms; mở 11i 13–18 ms; dọn 119–124 ms (web) | 1 313 dòng > 200 ms khi gắn DevTools: triệu chứng DR6-84 mà Owner chọn chữa bằng dọn + câu nhắc từ 1 000 bản ghi | — |
| Gói F | bảng A, B trên | không hàm nào xấu hơn lượt 2 cùng máy theo luật nhiễu | — |

**Không có phát hiện P ở gói F**; phát hiện P của cả lượt (Claude): chỉ CL3-A29 (Nit, KNOWN #709 có bằng chứng mới: chi phí ≈ 4,5 ms của `keptRecords` nằm ở `KEPT_APPOINTMENTS`). Không thao tác chính nào vượt ngưỡng `phase-6.md` trên dữ liệu tải.

## 7. Bảng đếm mức × trục

### Gói F

| Mức \ Trục | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | | 0 |
| Low | | | | | | | | | CL3-F1 | | 1 |
| Nit | | | | | | | | | CL3-F2 | | 1 |
| **Tổng** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | **2** |

2 / 2 CONFIRMED (probe / spec của repo / đột biến chạy thật, lệnh và trích kết quả ở từng mục), 0 PLAUSIBLE, 0 KNOWN có bằng chứng mới. Trục R (mục 2.1): 7 / 7 ĐÃ SỬA ở phần của gói F. "Mới do đợt sửa lượt 2": CL3-F2 (#678); có từ trước, lượt 1–2 bỏ sót: CL3-F1 (T-126).

### Cả sáu báo cáo lượt 3 của Claude (A–F, để làm kết luận mục 10; không so với bên khác)

Đếm từ mục 7 của `claude\A.md` … `E.md` và bảng trên.

| Gói | Critical | High | Medium | Low | Nit | PLAUSIBLE | KNOWN có bằng chứng mới | Bảng R của gói |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| A | 0 | 0 | 0 | 19 | 10 | 0 | 1 (A29) | 7 ĐÃ SỬA · 1 SỬA MỘT PHẦN (69) |
| B | 0 | 0 | 0 | 1 | 1 | 0 | 1 (B2) | 6 / 6 ĐÃ SỬA |
| C | 0 | 0 | 0 | 4 | 3 | 0 | 1 (C7) | 9 / 9 ĐÃ SỬA |
| D | 0 | 0 | 0 | 4 | 0 | 0 | 0 | 10 / 10 ĐÃ SỬA |
| E | 0 | 0 | 0 | 2 | 2 | 0 | 0 | 9 ĐÃ SỬA · 1 SỬA MỘT PHẦN (91) |
| F | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 7 / 7 ĐÃ SỬA (phần F) |
| **Tổng** | **0** | **0** | **0** | **31** | **17** | **0** | **3** | **37 ĐÃ SỬA · 2 SỬA MỘT PHẦN** (mục 2.2; DR6 nhiều gói đếm một lần) |

48 phát hiện mới; trục T (test hở) là nhóm lớn nhất (A 10, D 1, E 2, F 2 = 15), tập trung ở code mới của Dọn sạch Thùng rác (CL3-A10, A11, A12, A18, CL3-E3) và chỗ nối TSX (CL3-D4, CL3-E4).

## 8. Đã xét, không thấy

- **R — đã sửa.** 7 DR6 phần F (mục 2.1): tái hiện lượt 2 chạy lại ở bản ghim (đúng) và bản chép `4217ed4` (ra lỗi cũ) cho 69, 76, 85, 86; 92 cả repo dưới 7 múi giờ; 98 đối chiếu tài liệu ↔ probe ↔ số đo; 84 đo trên exe với dữ liệu exe lượt 2. 24 đột biến gỡ phần sửa ở `tools/` đều bị giết, cộng đột biến I/O `realpathSync` chạy thật. Không HỒI QUY: `pnpm verify` 3 159 test, e2e 245 + 2 flaky (`baseline.md`; hai flaky = CL3-F1), cả bộ unit dưới UTC−11…+12 3 159 / 3 159. Bảng gộp 39 DR6: mục 2.2.
- **E — biên.** Cổng merge: 0 / 251 / 1 000 commit, thiếu `total_commits`, commit thêm giữa hai trang (K8); `retro.mjs`: 8.3, khác hoa thường, tương đối, junction, file tên `.claude-*` (K9); múi giờ ngoài khoảng (K10); nửa đêm (K3 → CL3-F1); dữ liệu của ba phiên bản trước (schema 9, 11, Phase 5 schema 9) mở / nhập bằng v1.0 (K1, K2, K4); dữ liệu v1.0 mở / nhập bằng bản cũ (K6, K7). Ngoài CL3-F1 không thấy.
- **C — hợp đồng.** `CODE_DOCS` ↔ mọi test đọc tài liệu (`git grep` trên `*.test.*`, `*.spec.ts`: chỉ `phase-5-prompts.md`, `ai-eval.md`, đều trong `CODE_DOCS`); `docs/metrics/README.md:24` ↔ `retro.mjs` (khớp, DR6-58 / CL2-F6 đã sửa); `e2e/perf/README.md` ↔ `probe.perf.ts` (`trash.open` khi ngắt); thân PR ↔ `notes-for` (K5: 13 / 13); NT-EX-08 / NT-EX-09 ↔ đường dữ liệu thật (K4: 18 / 18); hướng dẫn "chép bản backup thành `project2c.db`" (`09-cai-dat.md:72`, `:187`) ↔ exe (K1). Thấy: `e2e/anchor.ts:3-4` ↔ T-126 (CL3-F1).
- **D — dữ liệu.** Nâng cấp từ schema 9 / 11 trên exe: backup lúc mở luôn là file trước migration (sha256 trùng), Thùng rác / số đếm giữ nguyên, dọn đúng (K1, K2); lấy lại dữ liệu trước lúc dọn bằng bản backup: trùng từng chữ (K1); exe cũ không ghi vào file mới (K7); Phase 5 → v1.0 nhập / mở / khôi phục đúng (K4). Dữ liệu lượt 1 (load data) không qua luật nhập 4 mới khi xuất → nhập lại (K2): KNOWN K1.
- **G — guardrail AI.** Gói F chỉ có script eval: key ở 8 dạng (gồm hai lớp cùng loại) không vào file kết quả / log, 401 che (DR6-76 phần F); không gọi dịch vụ AI thật (`fetch` giả, key giả); không chạy `pnpm eval:ai` / `node tools/eval-ai.mjs`.
- **S — ranh giới (CI / script / hook).** `ci.yml`, `.githooks/pre-push`, `.claude/hooks/*`, capabilities, CSP không đổi từ `4217ed4`; `.claude/settings.json` chỉ bỏ `permissions.deny: ["Agent"]` (M8, K17), hook giữ nguyên. `merge-pr --dry-run` với `gh` giả: không lệnh ghi nào (fake chặn mọi `git` ghi, không bị gọi); `pr-status` / `merge-pr` đóng cổng khi GitHub không trả số đếm (S6d). `notes-for` chỉ đọc (`git`, `gh api` GET); `--base <ref>` đưa thẳng vào `git diff` (ref bắt đầu bằng `-` thành tùy chọn của git) — tham số do chính người chạy gõ, không phải ranh giới tin cậy, không ghi phát hiện. `ts-hooks` chỉ đọc file `?raw` mà code repo import.
- **P — hiệu năng.** Mục 6.2: bảng hàm thuần Node, exe (K1, K2), tổng hợp A–E; không dòng nào xấu hơn mốc cùng máy theo luật nhiễu.
- **B — bloat.** Mục 6.1: không có mục mới ở gói F; code lặp giảm (T-265 bỏ hook `resolve` chép đôi).
- **T — test.** 43 đột biến `tools/` (24 gỡ phần sửa của DR6-76 / 85 / 86 ở mục 2.1 + 13 `notes-core` + 6 `ts-hooks-core`): **41 KILLED, 2 sống** (T61f, T61k → CL3-F2). Quét mẫu yếu trên diff e2e: `\d+` ở số đếm 11i (`trash.spec.ts`, đã có CL3-A18 / CL3-E3), `toBeGreaterThan(0)` cho vị trí cuộn trước khi đổi màn (DR6-81, đúng ý); không `waitForTimeout`, `skip` / `only`, `expect.soft` mới. Thấy: CL3-F1 (đồng hồ), CL3-F2.
- **A — trợ năng / i18n.** Gói F không có màn; `lowestContrast` (chuyển sang `e2e/support.ts`) tính qua mọi lớp mờ, nền trang trắng chỉ dùng khi không tổ tiên nào tô (đúng cho các màn đang kiểm); mã lỗi ↔ câu i18n như lượt 2 (`p9-error-keys`). Trang lỗi khởi động của exe cũ với file mới (K7) có câu rõ, 0 nút.

## 9. Phụ lục

### 9.1 Probe, log (thư mục `C:\workspace\deep-review-1-6-r3\claude\F\`)

Probe Node nạp TypeScript của repo qua `hooks.mjs` (loader lượt 2 của Claude F, `LOAD` = dữ liệu tải lượt 3; `P2C_REPO` = bản chép cũ ngoài repo), chỉ đọc repo, chỉ ghi trong thư mục này. Bản chép cũ: `old-4217ed4\` (`git archive 4217ed4 packages/{domain,db,ai} apps/desktop/src tools e2e/perf`), `old-3d6c7fc\` (`git archive 3d6c7fc packages/{domain,db,ai} apps/desktop/src`, exe Phase 5). Probe lượt 2 của chính Claude chép nguyên sang `r2\` (mở theo tên đầy đủ sau `Test-Path`). Không gọi `gh` thật, không gọi dịch vụ AI, không đọc key, không mở chatgpt.com; exe chạy bản chép ở `exe\<ca>\`, cổng 9381, DNS chặn mọi host ngoài máy, `window.open` thay ngay; trình duyệt Edge (Playwright) chặn mạng ngoài 127.0.0.1 từ lần chạy đầu.

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `hooks.mjs`, `ui-stub.mjs` | loader TS (chép lượt 2, đổi `LOAD`) | — | mọi probe Node |
| `p09-e20-skew.mjs` | = probe lượt 2: E20 qua hai máy lệch giờ (ghim + `old-4217ed4`) | `p09-e20-skew.log`, `.old.log` | DR6-69 |
| `p01-eval-key.mjs` | = probe lượt 2: key 8 dạng trong trả lời / 401 của script eval (`fetch` giả) | `p01-eval-key.log`, `.old.log` | DR6-76 |
| `fake-gh.mjs` + `p04c-merge-gate-r3.mjs` | `pr-status.mjs` / `merge-pr.mjs --dry-run` thật với `gh` giả (phân trang `compare` như tài liệu REST), S6a–S6h; ghim + `old-4217ed4` | `p04c-merge-gate-r3.log`, `.old.log`, `merge-gate-r3\*.json`, `*.calls.log` | DR6-85, K8 |
| `p03-retro.mjs`, `p03b-retro-83.mjs`, `p03c-retro-multi.mjs` (lượt 2, thêm `OLD`), `p03d-retro-junction.mjs`, `p03e-retro-realpath-mutant.mjs` + `mut-tools\` | `retro.mjs` thật trên home giả (`retro\home*`); junction / file; đột biến I/O `realpathSync` trên bản chép | `p03-retro-all.log`, `.old.log`, `p03d-retro-junction.log`, `p03e-retro-realpath-mutant.log` | DR6-86, K9 |
| `p11-tz-r3.mjs` | cả bộ unit dưới 7 múi giờ | `p11-tz-r3.log` | DR6-92, K10 |
| `exe-lib.mjs`, `peek-db.mjs`, `k1-upgrade-purge.mjs` | exe ghim mở file lượt 2 → dọn → mở lại → chép bản backup → mở lại; đo `trash.open` / dọn khi ngắt DevTools | `k1-upgrade-purge.log`, `.json` (`k1-upgrade-purge.try1.log`: lần đầu, probe tự lỗi — đọc Cài đặt → Dữ liệu khi màn còn ở mục Thùng rác; đã sửa, chạy lại từ đầu trên bản chép mới) | DR6-84, K1 |
| `k2-upgrade-r1.mjs`, `k2b-why-refused.mjs` | exe ghim mở file lượt 1 (schema 9); xuất → nhập; dọn; lý do từ chối (`readBackup` → `BACKUP_INVALID {rule:4}`) | `k2-upgrade-r1.log` | K2 |
| `build-dist.mjs`, `serve-dist.mjs`, `browser.mjs` (chép `claude\E\`), `k3-e2e-midnight.mjs`, `pw-midnight.config.mjs` | bản dựng e2e ngoài repo (`dist-e2e`, neo 15/09/2026), cổng 4471; `page.clock` qua nửa đêm; `full-cycle.spec.ts` với `timezoneId` `Asia/Yangon` | `k3-e2e-midnight.log`, `k3b-control.log`, `k3b-midnight.log`, `pw-results\` | K3, CL3-F1 |
| `k4-phase5-backup.mjs` | demo + bản ghi NT-EX-08 của code Phase 5 → nhập / mở / khôi phục / xuất-nhập bằng code ghim; 6 ngày × 3 biến thể | `k4-phase5-backup.log`, `k4\*\` | K4 |
| `k5-notes-for-prs.mjs` | `notes-core` trên sổ ở cha của commit merge ↔ "Ghi chú OPEN liên quan" của 13 thân PR | `k5-notes-for-prs.log` | K5 |
| `k6-two-versions.mjs` | máy lượt 2 ↔ máy lượt 3 xuất / nhập (lớp dữ liệu app) | `k6-two-versions.log`, `k6\*.p2cbackup` | K6 |
| `k7-downgrade.mjs` | exe lượt 2 mở thư mục schema 12 | `k7-downgrade.log` | K7 |
| `mut.mjs` + `mutant-config.mjs` (chép `claude\A\`) | 43 đột biến `tools/` qua `load` hook của Vite (repo không bị ghi) | `mut.log`, `mut.run.out`, `mut\<id>.out` | mục 2.1, K11, CL3-F2 |
| `p08-node-perf.mjs` (= lượt 2) | bảng hàm thuần Node trên dữ liệu tải lượt 3 | `p08-node-perf.log` | mục 6.2 A |
| `exports-f.mjs`, `dup-scan.mjs`, `dup-scan-struct.mjs`, `p9-error-keys.mjs` (script lượt 1–2), `r2\bundle\split-build.mjs` | bloat: export, code lặp, mã lỗi ↔ i18n, bundle theo package | `exports-f.log`, `dup-scan.log`, `dup-scan-struct-35.log`, `p9-error-keys.log`, `split-build.log` | mục 6.1 |

### 9.2 Đột biến (43: 41 KILLED, 2 SỐNG)

`node mut.mjs` (20/10 23:51–23:58, `vitest` với `mutant-config.mjs`, mỗi đột biến một file, có dòng `[mutant] served`; sống ở test nhắm thì chạy cả bộ 3 159 test); dòng cuối `mut.log`: `repo git status --short after: ""`.

- **DR6-76, `tools/eval-ai-core.mjs` (9):** R76s-a…i — KILLED cả 9 (`refuses an answer that holds the key, as it is or escaped, as Rust (DR6-55)`, `masks the key and the session in URL and JSON escapes too…`, `refuses and masks the key in up to two layers of escapes part by part, as Rust (DR6-76)`, `cuts the server message to 200 characters after masking the key, as Rust`).
- **DR6-85, `tools/pr-core.mjs` / `pr-status.mjs` (10):** R85a…j — KILLED cả 10 (`stops with the count read when GitHub lists fewer commits than it counts`, `stops when GitHub gives no count of the commits`, `reads every page, so code in the oldest commit still stops the merge`, `reads no tested main for a PR that is no longer open…`).
- **DR6-86, `tools/retro-core.mjs` (5):** R86a…e — KILLED cả 5 (`reads every ~/.claude* config folder with a projects folder, whichever is in use`, `reads a folder once, whatever its spelling: other case, 8.3 name, trailing sep…`). Thêm phần I/O: `realpathSync` thường trên bản chép `mut-tools\retro.mjs` → ca 8.3 đếm 3 phiên (sai) — chạy thật, không có unit test theo quy ước.
- **T-261, `tools/notes-core.mjs` (13):** T61a–e, g–j, l, m KILLED (11); **T61f, T61k SỐNG** cả bộ → CL3-F2.
- **T-265, `tools/ts-hooks-core.mjs` (6):** T65a–f KILLED cả 6 (gồm T65d = luật cũ bỏ qua tên có dấu chấm, #474: `finds an extensionless name with a dot in it as a .ts file (#474)`).

### 9.3 Chạy ngoài repo, tác dụng phụ, ranh giới đọc

- Exe: bản chép `common\exe\project2c.exe` ở `exe\upgrade\`, `exe\upgrade-r1\`; bản chép exe lượt 2 (`r2\claude\F\exe\trash-0\project2c.exe`) ở `exe\downgrade\`; mỗi ca profile WebView2 riêng, cổng 9381; trước khi đo: không `project2c.exe` nào khác, không cổng 9200–9400 nào nghe, CPU 0 %. Mọi exe đóng bằng nút X (`CloseMainWindow`, exit 0), trừ hai lần probe tự lỗi (K1 lần đầu sau khi dọn đã lưu xong; K7 lần đầu chưa có trang) — tiến trình con kết thúc cùng Node; cả hai chạy lại từ đầu trên bản chép mới, không dùng số của lần lỗi.
- Máy chủ web tạm (`vite preview`) 127.0.0.1:4471 chỉ bật lúc chạy K3, tắt ngay sau (`Stop-Process` theo cổng). Không chạy `pnpm e2e` (cổng 4173), không `PW_REUSE`. `pw-midnight.config.mjs` chạy đúng một spec của repo (`full-cycle.spec.ts`) bằng `pnpm exec playwright test -c <file ngoài repo>`, kết quả ở `F\pw-results\`.
- Ngoài repo, đọc theo tên đầy đủ: `common\{prompt-claude.md, plan.md, known.md, fixes.md, baseline.md, gates\e2e.log, perf\purge-exe.mjs, perf\import-load.mjs, load\load-2026-10-12-seed6.p2cbackup, exe\project2c.exe}`; báo cáo Claude lượt 3 `claude\{A,B,C,D,E}.md`; công cụ lượt 3 của Claude `claude\A\mutant-config.mjs`, `claude\B\mutjs.mjs`, `claude\E\{build-dist,serve-dist,browser,pw.config}.mjs` (đọc / chép, như gói D, E đã chép công cụ của gói trước); probe lượt 2 của chính Claude `deep-review-1-6-r2\claude\F\` (42 tên đã biết từ báo cáo gốc lượt 2, `merge-gate\`, `exe\trash-0\project2c.exe`, `exe\trash-1200\Project2C-data\project2c.db`, `exe\trash-0\…`, `exe\reload\…` (chỉ `peek-db`), `bundle\split-build.log`) và `deep-review-1-6-r2\claude\A\old-8855345-load.db` — đều sau `Test-Path` từng tên. Không mở / liệt kê / tìm kiếm `codex\` hay `muse\` của lượt nào; không liệt kê / tìm kiếm trên `C:\workspace\`, `deep-review-1-6*\`; chỉ liệt kê thư mục của chính mình (`…-r3\claude\F\` và con của nó).
- Repo: không ghi file nào (đột biến qua `load` hook; bản dựng web và mọi đầu ra ở `F\`).

### 9.4 Cuối phiên

- `git rev-parse HEAD` cuối phiên: `119e2e45cbce54d8a3943757bd826a7f1e9b694f` (= SHA ghim). `git status --short` cuối phiên (`C:\workspace\Project-2C-review`, 21/10 00:33): **rỗng**, như đầu phiên.
- Không còn `project2c.exe` nào, không còn cổng 4471 / 9381 nào nghe.
- Giờ xong: 2026-10-21 00:33 (+07, giờ máy).

## 10. Kết luận cho v1.0 ở SHA `119e2e4` (Claude, tham khảo — kết luận thật ở phiên tổng hợp T-267)

**CHƯA SẴN SÀNG ở chính `119e2e4`** — không vì mức (0 Critical / High / Medium), mà vì quyết định Owner 19/10 "sau lượt 3 sửa hết" (plan §L3.11 câu 4) cùng 2 DR6 còn SỬA MỘT PHẦN: SHA phát hành phải là SHA sau đợt sửa lượt 3.

Lý do:

1. **Mức: 0 Critical / High / Medium** trong sáu báo cáo lượt 3 của Claude (A–F). Phát hiện mới: **31 Low + 17 Nit = 48**, 48 CONFIRMED / KNOWN có bằng chứng, 0 PLAUSIBLE (mục 7). Theo thước mức, tiêu chí 3 của spec Phase 6 §1 ("mọi phát hiện từ Medium trở lên đã sửa") đạt ở `119e2e4`; phần "còn lại Owner đã quyết" là "sửa hết" → chưa xong.
2. **Bảng R: 37 / 39 ĐÃ SỬA, 2 SỬA MỘT PHẦN, 0 CHƯA SỬA, 0 HỒI QUY** (mục 2.2).
   - DR6-69 → CL3-A28 (Low): file có mốc xóa viết khác dạng (`…01Z` / `…01.000Z`) làm khôi phục không tìm thấy chuyển nhóm đã rút — đúng phần Issue #652 mục 2 và thân PR #666 hứa.
   - DR6-91 → CL3-E4 (Low): chỗ nối hộp 6f ↔ `editedDay` không test nào giữ.
   - Khác lượt 2 (3 hồi quy, có Medium duy nhất), đợt sửa lượt 2 **không làm hỏng chỗ nào trước đó đúng**: mọi tái hiện lượt 2 nay ra đúng, cùng probe trên `4217ed4` ra lỗi cũ; mọi phần sửa có test đỏ khi gỡ (trừ các chỗ nối / nhánh đã thành phát hiện T).
3. **Dọn sạch Thùng rác** (`risk:high`, lần đầu được review) **không có lỗi dữ liệu** ở mọi đường đã thử: lệnh (A: fuzz 612 lần dọn, 11 vị trí lỗi giữa chừng không đổi gì, khóa ngoại / `foreign_key_check` đúng), hàng đợi thay dữ liệu và tắt / giết app giữa lúc dọn (B), màn 11h–11j và mọi số Tổng quan / Báo cáo / Excel không đổi (E), nâng cấp từ thư mục dữ liệu của exe lượt 1 / lượt 2 rồi lấy lại bằng bản backup theo hướng dẫn (F K1, K2). Điểm yếu là **test hở** (CL3-A10, A11, A12, A18, CL3-E3): code đúng nhưng nhiều luật của tập giữ lại / D3 / D11 / màn dọn không test nào giữ.
4. **Số đo:** probe exe không dòng nào xấu hơn mốc sau #656; mở lần đầu LCP 3 614 ms (xấu hơn khi > 4 396 / 4 724 ms); bảng hàm thuần Node không dòng nào xấu hơn lượt 2; Dọn sạch ≈ 150 ms trên exe ở cả 113 và 1 313 bản ghi, `trash.open` sau dọn 3,7–9,6 ms. Phát hiện P duy nhất: CL3-A29 (Nit, KNOWN).
5. **Đường nâng cấp** (điều kiện G7 NT-EX-08 / 09): dữ liệu Phase 5 (`3d6c7fc`) nhập / mở / khôi phục đúng bằng code ghim (K4, 18 / 18); thư mục exe lượt 2 và lượt 1 mở được, backup lúc mở là file trước migration (K1, K2); exe cũ từ chối file mới mà không ghi gì (K7). Dữ liệu tải của code lượt 1 không qua luật nhập 4 mới khi xuất → nhập lại (K2): KNOWN K1 (dữ liệu giả lập nạp lại).
6. **Gợi ý thứ tự cho đợt sửa** (gom theo việc; tổng hợp quyết):
   - Dữ liệu / hợp đồng có hậu quả thấy được: CL3-A1 (`parseVnd` "1,234 tr" trái mockup 6d + NT-LH-25), CL3-A2 (khôi phục đi đường E7 làm mất RF), CL3-A28 (DR6-69), CL3-A3 + CL3-D1 (câu 9b không làm được), CL3-A4, A5, A6, A7, A8, A9 (chữ / nhập backup / trigger), CL3-B1 (ACL / chỉ đọc giữa phiên), CL3-C1 + CL3-D3 (tràn khung), CL3-C2 (Mock), CL3-C3 (G5: dấu viết rời lọt V3–V6), CL3-D2 (focus màn Team).
   - Test hở: CL3-A10…A18, A20, CL3-D4, CL3-E3, CL3-E4, **CL3-F1** (e2e qua nửa đêm — nên sửa trước khi chạy cổng của SHA phát hành, hoặc tránh chạy cổng quanh 0 giờ), CL3-F2.
   - Chữ / tài liệu / bloat (Nit): CL3-A19, A21–A27, CL3-C4, C5, C6, CL3-E1, E2; KNOWN có bằng chứng mới: CL3-A29, CL3-B2, CL3-C7.
7. **Ngoài phạm vi review, vẫn là điều kiện G7** (HANDOFF bước 3, spec §1 mục 2 và 4): nghiệm thu của Owner trên exe phát hành (gồm NT-EX-08 / 09 trên exe Phase 5 thật), eval AI thật với `analysis@3`, chụp lại ảnh hướng dẫn (16 PR đổi UI từ 15/10), cổng trên SHA phát hành.

Nếu đợt sửa lượt 3 làm xong các mục trên (review phiên sạch như thường) mà không sinh hồi quy, phần Claude thấy không còn gì chặn v1.0.
