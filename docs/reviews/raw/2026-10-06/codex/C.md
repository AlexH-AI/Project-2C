# Deep review Phase 1–4 — Gói C: Rust / lưu file

- Reviewer: Codex, phiên độc lập, ngày 05/10/2026.
- Worktree: C:\workspace\Project-2C-review-2.
- SHA đã kiểm trước khi đọc và kiểm lại cuối lượt: f0c53eb57eb7eac8665ad87287e794ae4c5bc43b, detached HEAD.
- Kết quả: **3 phát hiện CONFIRMED: 1 High, 1 Medium, 1 Low; 0 PLAUSIBLE.** Phát hiện High xác nhận ở seam Rust; chưa chạy thao tác reload qua một cửa sổ Tauri thật.
- Chỉ đọc repo và common; bằng chứng tự tạo ở codex\C\. Không đọc, tìm kiếm hoặc liệt kê thư mục/báo cáo review bị cấm; không dùng subagent, không tạo Issue, không tổng hợp hay đề xuất merge.
- Không sửa file trong repo. SHA256 storage.rs khớp bản sao nguyên trạng: 33d51f6c1ff87c4d66bea8f2a78a6e3f049040773eb94d72a18649c1eba1615d. Git diff trống; ba mục untracked .agents/, .codex/, AGENTS.md đã có ngay lần kiểm đầu và vẫn nguyên trạng.

## 1. Phạm vi đã đọc

### Mã Gói C

Đọc hết nguồn Rust và cấu hình sau; Cargo.lock kiểm mục tauri/tauri-build và danh sách dependency trực tiếp, không làm audit CVE ngoài phạm vi an toàn hẹp.

| File (trong repo ghim SHA) | Dòng đã đọc | Nội dung |
|---|---|---|
| apps/desktop/src-tauri/src/storage.rs | 1–1124 | Toàn bộ I/O, khóa, backup, tên xuất, ngày giờ và 37 test |
| apps/desktop/src-tauri/src/lib.rs | 1–110 | Toàn bộ command async, raw IPC, data_dir, Explorer |
| apps/desktop/src-tauri/src/main.rs | 1–6 | Entry point |
| apps/desktop/src-tauri/build.rs | 1–3 | Build entry |
| apps/desktop/src-tauri/Cargo.toml | 1–24 | Dependency/profile |
| apps/desktop/src-tauri/capabilities/default.json | 1–7 | Quyền main window |
| apps/desktop/src-tauri/tauri.conf.json | 1–31 | Window/build/CSP |
| rust-toolchain.toml | 1–5 | Toolchain ghim |

Cargo.lock: mục tauri 2.11.6 và tauri-build 2.6.3, khoảng dòng 3057–3140. Icon nhị phân được nhận diện qua cấu hình, không giải mã vì không thuộc logic lưu dữ liệu.

### Tài liệu và seam gọi

Đã đọc trước: docs/process/deep-review-phase-1-4.md (§1, §4 C, §5, §7), CLAUDE.md, CONTEXT.md, docs/design/phase-3-du-lieu.md, docs/design/phase-4-chi-so.md và đủ bốn docs/golden/{chi-so,kh-theo-nhom,kyc,lich-hen}.md. Không sửa golden hay fixture.

Đọc bổ sung: ADR-0016, apps/desktop/CLAUDE.md, packages/db/CLAUDE.md, .claude/rules/tests.md; toàn bộ apps/desktop/src/{main.tsx,data/tauri-storage.ts,data/tauri-storage.test.ts,data/persist-queue.ts,data/app-data.ts}, packages/db/src/database.ts, shell/{startup-error.ts,StartupError.tsx}, phần i18n/vi.ts liên quan lưu file. Mục đích là xác định đường gọi và cách hiện lỗi, không mở rộng review sang toàn bộ Gói B/D.

Nguồn chung: common/{README.md,known.md,baseline.md}; common/load/{load-summary.json,vitest.load.config.mts,generate.test.ts}. Dùng common/load/load-backup.json qua importBackup thật; không chạy lại generator và không sửa common. Số baseline xem file gốc, không chép lại ở báo cáo này.

## 2. Phát hiện

### CX-C1 — I/O DB trong cùng process không được tuần tự hóa, có thể ghi vào file đã báo lưu thành công

- **ID:** CX-C1
- **Mức:** High
- **Trục:** D (có kiểm E: thao tác chồng nhau; C: nguyên tử).
- **Vị trí:** apps/desktop/src-tauri/src/storage.rs:249–260, :79–86, :131–132; apps/desktop/src-tauri/src/lib.rs:36–62, SHA f0c53eb.
- **Tình trạng:** **CONFIRMED ở lớp Rust.** Liên quan vùng rủi ro KNOWN S-2 (#96/#192/#206), nhưng bằng chứng mới ở backend: hai command qua vòng đời webview và việc xóa .tmp đang hoạt động. Không báo lại hai replace đóng DB cũ hoặc ghi muộn trong lúc chờ backup.
- **Mô tả:** Mọi save dùng cùng project2c.db.tmp; DataLock chỉ giữ file khóa giữa các process, không khóa toàn bộ open/save/backup giữa các thread. Hai save chồng nhau có thể cùng mở một file tạm; một save đổi tên và trả Ok, save còn lại tiếp tục ghi qua handle cũ vào chính file đích đã được đổi tên. Ngoài ra open gọi lại trong cùng process luôn xóa project2c.db.tmp, kể cả khi save đang chạy.
- **Tái hiện / bằng chứng:**

  1. Probe dùng hai SQLite hợp lệ do loader của repo tạo: A = DB rỗng đã migrate, 135.168 byte; B = dữ liệu tải, 13.074.432 byte, 1.496 KH / 10.434 lịch hẹn / 51 nhân sự / 1.804 HĐ.
  2. Giữ DataLock; dừng thread A ngay sau File::create(.tmp). Cho B ghi đủ, sync và rename, trả Ok; xác nhận lúc đó file đích đúng B. Thả A để write_all qua handle đang giữ. A kết thúc bằng lỗi NotFound (code 2); file đích có chiều dài B nhưng prefix là toàn bộ A, phần đuôi vẫn là B, không bằng snapshot nào.
  3. Mở file kết quả bằng openDatabase của repo: **0 KH, 0 lịch hẹn; PRAGMA integrity_check = ok.** Đây là mất trạng thái vừa được báo ghi thành công, không chỉ là lỗi I/O hiện trên UI, cũng không thể phát hiện đơn giản bằng integrity_check.
  4. Stress save bằng bản sao **nguyên trạng**, không chèn điểm dừng: lượt 1 có 2/20 file không khớp cả A/B; lượt 2 có 1/20. Đây là kết quả trong probe, không phải ước lượng tần suất trong sản phẩm.
  5. Biến thể reload: dừng save sau sync/drop, trước rename; gọi open lần nữa với chính DataLock đang giữ. open xóa .tmp hoàn chỉnh của save, trả DB cũ; save sau đó lỗi code 2. File cũ được giữ nhưng thao tác đang lưu bị bỏ.
  Log: C/races-initial.log, C/races.log; kiểm SQL.js: C/mixed-db-check.json. Nguồn: probe.rs + storage-gated.rs (chỉ thêm cổng điều phối, không đổi lệnh I/O); stress dùng storage-original.rs.
- **Ảnh hưởng:** Queue ở app-data.ts/persist-queue.ts bảo đảm một save trong **một** ngữ cảnh JS. Nó không điều phối command Rust còn chạy khi webview reload tạo ngữ cảnh JS và queue mới. DataLock và test hiện có nói rõ hỗ trợ webview reload; command có async/threadpool. Không kết luận hai thao tác UI thông thường trong một queue gây lỗi, và chưa tự động tái hiện reload bằng exe/WebView2.
- **Đề xuất:** Ít nhất tuần tự hóa I/O DB dùng chung .tmp ở Rust, gồm open/save/backup; reload cần chờ hoặc vô hiệu hóa save của ngữ cảnh cũ. Chỉ đổi sang tên .tmp riêng không giải quyết ghi đè snapshot cũ sau reload. Dự kiến ≤ 400 dòng SP, dùng std; thêm test interleaving ở seam Rust và kiểm vòng đời reload.

### CX-C2 — Bộ test không bảo vệ hợp đồng giữ DB cũ khi rename lỗi

- **ID:** CX-C2
- **Mức:** Medium
- **Trục:** T
- **Vị trí:** apps/desktop/src-tauri/src/storage.rs:249–261 và module test :428 trở đi, đặc biệt :477, SHA f0c53eb.
- **Tình trạng:** **CONFIRMED** bằng mutation ngoài repo. Đây là thiếu sót test, không cáo buộc write_atomic hiện tại dùng xóa-đổi tên.
- **Mô tả:** Các test save hiện tại chỉ kiểm đường thành công và file tạm được dọn. Chúng vẫn xanh khi sửa đúng một biểu thức rename thành xóa DB đích trước rồi mới rename, dù thay đổi này làm mất DB khi rename lỗi.
- **Tái hiện / bằng chứng:**

  - Bản sao nguyên trạng: 37/37 test xanh. Patch một chỗ fs::rename(&tmp, dir.join(name)) thành khối remove_file(target) rồi rename: **37/37 vẫn xanh**, log C/mutant-delete.log.
  - Khóa .tmp bằng handle Windows cho đọc nhưng cấm delete/rename, ở khoảng sau sync/drop. Nguồn hiện tại trả lỗi **32** và DB cũ vẫn nguyên byte. Bản mutant cũng lỗi 32 nhưng **project2c.db đã biến mất**, log C/mutation-error.log.
  - Mutation riêng bỏ file.sync_all()? cũng qua **37/37**, C/mutant-nosync.log; chỉ khẳng định bộ test không bắt được mutation đó, không coi đây là thử nghiệm cắt điện.
- **Ảnh hưởng:** Một hồi quy làm mất file trong nhánh lỗi Windows có thể vượt toàn bộ test Rust hiện có. Test tauri-storage phía TS mock invoke nên không kiểm hợp đồng file này.
- **Đề xuất:** Thêm test Windows/fault seam cho create/write/sync/rename lỗi, kiểm DB đích trước đó nguyên byte và retry ghi được sau khi bỏ nguyên nhân lỗi. Có test negative cho xóa-trước-rename; không chỉ thêm assertion ở đường thành công. Không cần đổi golden; SP 0 hoặc seam rất nhỏ, ≤ 400 dòng SP.

### CX-C3 — Dọn backup không thử lại ở lần mở kế tiếp khi nội dung không đổi

- **ID:** CX-C3
- **Mức:** Low
- **Trục:** C
- **Vị trí:** apps/desktop/src-tauri/src/storage.rs:120–126, :397–410, SHA f0c53eb.
- **Tình trạng:** **CONFIRMED**; không trùng mục KNOWN về backups không đọc được hoặc .tmp sót.
- **Mô tả:** prune_backups hứa thử lại ở lần mở sau khi file bị chương trình khác giữ. Nhưng copy_to_backups trả về ngay khi find_copy tìm được nội dung giống nhau; do đó những backup chưa xóa được không được dọn lại ở các lần mở DB không đổi.
- **Tái hiện / bằng chứng:** Tạo 10 backup cùng cỡ từ dữ liệu tải, khác user_version trong header (không đổi bản ghi nghiệp vụ); giữ cả 10 bằng handle cho đọc, cấm xóa. Lưu trạng thái thứ 11 rồi mở: 11 backup vì mọi lần xóa bản cũ đều bị chặn. Đóng các handle, mở lại ba lần với nội dung DB không đổi: **vẫn 11**, C/edges.log ghi deferred prune: while_locked=11 after_unlock_and_3_restarts=11. Không cần patch production cho probe này.
- **Ảnh hưởng:** Chỉ xảy ra khi mọi ứng viên cần dọn đều xóa lỗi trong lượt prune. Sau đó thư mục có thể vượt giới hạn dù quyền/khóa đã được giải phóng, cho đến khi có snapshot khác được sao lưu; không thấy mất dữ liệu trong probe này.
- **Đề xuất:** Chạy prune cả trước khi trả về tên copy đã tái dùng, giữ copy đó; bổ sung test bỏ khóa rồi mở lại DB không đổi. Ước lượng < 20 dòng SP, ≤ 400 dòng SP.

## 3. KNOWN đã nhận diện

Các mục sau đã xét trên code và đối chiếu common/known.md; không tính vào ba phát hiện mới.

| Tình trạng | Mục | Đối chiếu ở Gói C |
|---|---|---|
| KNOWN S-2 (#96/#192/#206) | Ghi muộn / replace chồng nhau / cửa sổ opening | TS queue và replace chỉ dùng để xác định seam; CX-C1 nêu bằng chứng mới ở Rust/reload, không lặp kết luận về replace |
| KNOWN storage.rs (#196/#192) | explorer_arg ngoài Windows có dead_code; Some(32); map_err identity ngoài Windows | :55–71, :382; không đề xuất style/cross-platform mới, sản phẩm Windows |
| KNOWN #87 | Thư mục backups không đọc được bị coi như rỗng; file .tmp sót, thư mục tạm test | :342–353; dọn lỗi best effort; không báo lại |
| KNOWN / ACCEPTED #192 | Chương trình ngoài tạo file đích sau claim có thể bị rename ghi đè | :158–183, :257; không báo lại race chương trình ngoài |
| KNOWN / ACCEPTED #196 | Explorer quote cho đường dẫn kết thúc bằng backslash | :382–387; folder luôn kết thúc exports/backups, không phát sinh ở seam hiện tại |

## 4. Số đo Gói C

Nguồn SQLite là common/load/load-backup.json nhập bằng importBackup thật. Có 1.496 KH / 10.434 lịch hẹn / 51 nhân sự / 1.804 HĐ; SQLite **13.074.432 byte**, JSON UTF-8 **15.784.463 byte**. Số 15.452.357 trong summary chung là độ dài text theo JS, không phải số byte UTF-8. Không sửa dữ liệu chung.

Windows x86_64 MSVC, rustc 1.98.1, Node v24.20.0; Rust biên dịch -O. Các phép đo là **cache ấm**, đồng hồ chỉ bao quanh thao tác storage; chuẩn bị fixture, đổi user_version, lưu DB trước open/backup và assertion được đặt ngoài đồng hồ. P95 dùng nearest rank, median lấy trung bình hai phần tử giữa khi n chẵn. Đây là I/O Rust, không gồm IPC/webview/export sql.js hay render.

| Thao tác | n | Median ms | P95 ms | Max ms |
|---|---:|---:|---:|---:|
| save SQLite, gồm sync_all + rename | 20 | 10,006 | 12,659 | 14,464 |
| Xuất JSON backup vào exports, có claim/suffix | 10 | 13,036 | 17,267 | 17,267 |
| open, DB trùng backup duy nhất | 20 | 10,775 | 11,635 | 11,675 |
| open, DB trùng bản cuối trong 10 backup cùng cỡ | 20 | 55,175 | 57,163 | 57,470 |
| open DB khác, với 10 backup cùng cỡ, ghi thêm + prune | 20 | 67,784 | 76,294 | 79,319 |
| backup DB khác, với 10 backup cùng cỡ, ghi thêm + prune | 20 | 73,649 | 79,346 | 79,916 |

find_copy đọc lại từng file cùng kích thước; trường hợp cuối trong 10 bản có thể đọc khoảng 143.818.752 byte gồm DB chính. Đã đo được chi phí tăng, nhưng số backup bị chặn ở 10 khi prune thành công; chưa có bằng chứng điểm nghẽn gây hỏng luồng hay vượt tiêu chí hiệu năng đã chốt, nên **không mở phát hiện P** chỉ từ cấu trúc vòng lặp này. Chưa đo cold cache, ổ mạng/ổ chậm hay app đầu-cuối (Gói H).

Nguồn chính: C/io-bench.log (chuỗi thời gian thô) và C/io-bench.rs. C/perf.log là phép đo thăm dò trước đó; vài nhãn của log đó bao gồm cả bước chuẩn bị nên không dùng làm bảng chính. Các bản đo đều giữ ngoài repo.

## 5. Bảng đếm mức × trục

Mỗi ID tính một lần theo trục chính; KNOWN không tính lại. Trục phụ của CX-C1 được nêu trong bảng kiểm dưới.

| Mức | E | C | D | P | B | T | A | S | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| Medium | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| Low | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tổng | 0 | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 3 |

## 6. Đủ tám trục — cách đã xét / “đã xét, không thấy”

| Trục | Kết quả và cách đã xét |
|---|---|
| E | Đã xét rỗng/missing/header SQLite, Unicode/separator/ADS, đồng hồ lùi, backup cùng stamp/legacy, thao tác chồng nhau. Lỗi overlap nằm ở CX-C1; **đã xét, không thấy edge case khác** ngoài KNOWN. 2.016 stamp so với oracle Date UTC độc lập, gồm 1900–2100, năm nhuận/không nhuận, 23:59:59, epoch âm; 37 test gốc kiểm missing/empty/retention. Không đưa CalendarDate/tiền/ngày nghiệp vụ vào Rust. |
| C | Đã đối chiếu spec §5–6/ADR-0016 với tên, doc comment và hành vi file. CX-C3 là dọn không retry; CX-C1 vi phạm hợp đồng nguyên tử khi chồng nhau. **Đã xét, không thấy lỗi hợp đồng khác** trong Gói C. |
| D | CX-C1. Đã kiểm theo byte và bằng SQL.js thật; hai input là SQLite hợp lệ. Khi target read-only hoặc bị handle cấm rename, mã nguyên trạng báo lỗi và giữ DB cũ nguyên byte; lỗi rename nguồn code 32 cũng giữ DB cũ. **Đã xét, không thấy mất dữ liệu khác** trong các nhánh lỗi tuần tự đã probe. Không coi bản header-only trong test là kiểm toàn vẹn SQLite; layer JS chịu trách nhiệm mở/migrate. |
| P | **Đã xét, không thấy phát hiện hiệu năng đủ bằng chứng để mở riêng.** Có số đo trên dữ liệu tải ở §4, gồm worst-case 10 backup cùng kích thước. Code I/O chạy threadpool, không chạy đồng bộ trên main window. Không suy ra hiệu năng ổ chậm từ cache ấm. |
| B | **Đã xét, không thấy code chết/lặp mới gây lỗi hoặc dependency trực tiếp thừa.** Dò từng pub function/constant tới lib.rs và helper trong storage; tất cả đường xuất/đọc/sao lưu có caller. Không thấy khối logic sản phẩm lặp ≥ 3 nơi; duplication fixture test không coi là bloat sản phẩm. Clippy pedantic chạy một lần trên crate scratch std-only, log clippy-pedantic.log: cảnh báo docs/must_use/redundant closure và new_without_default do storage là lib root; không biến cảnh báo style/harness thành phát hiện. Dead_code ngoài Windows là KNOWN. Không thêm công cụ. |
| T | CX-C2. Chạy đủ 37 test gốc ngoài repo; hai mutation độc lập đều 37/37 xanh. Probe rename bị giữ bằng handle chứng minh mutation xóa trước làm mất DB. Dùng clock/stamp cố định, fixture tự tạo, không sửa golden. **Đã xét, không thấy assertion rỗng hoặc phụ thuộc thứ tự/ngày hệ thống khác** trong test Rust. |
| A | **Đã xét, không thấy lỗi trợ năng/i18n riêng ở Gói C.** Rust không render UI; ALREADY_OPEN được map sang i18n, lỗi khác đi vào phần “Chi tiết kỹ thuật” có nhãn dịch; chuỗi hướng dẫn startup/export thuộc i18n. Đường dẫn Explorer dùng OsString; test gốc kiểm spaces/comma/quote. Không coi thông báo OS trong chi tiết kỹ thuật là nhãn UI cứng. Không audit toàn bộ focus/dialog thuộc Gói D–F. |
| S | **Đã xét, không thấy lỗi mới trong an toàn hẹp của Gói C.** data_dir không nhận path từ webview; kind chỉ exports/backups; tên xuất allowlist ASCII và extension .xlsx/.p2cbackup, từ chối slash/backslash/drive/colon/NUL/Unicode/path traversal. Probe 16 export đồng thời tạo 16 file hoàn chỉnh riêng biệt, không ghi đè; Windows xử lý được các reserved-name input đã thử trong seam std hiện tại. raw_body từ chối Json; không có unsafe trong Rust repo. Import dữ liệu tải thật được chấp nhận; kiểm toàn bộ validation import là Gói B. Race chương trình ngoài sau claim là KNOWN; không mở rộng sang web security/API key. |

### Giới hạn kiểm chứng

Không khởi chạy exe/WebView2 hay Explorer thật; đường gọi lib.rs/config/capability được đọc, còn các probe filesystem là native Rust Windows. Không biên dịch lại Tauri để tránh sinh file trong repo; 37 test storage được compile trực tiếp từ bản sao khớp SHA256, rustfmt --check nguồn repo xanh. Clippy pedantic chạy trên storage như lib root scratch, không thay cho full-crate strict Clippy đã có trong baseline chung.

Đã probe lỗi permission bằng file read-only (code 5), rename source bị handle giữ (code 32), lỗi overlap NotFound (code 2). Chưa gây đầy ổ đĩa thật hoặc mất điện/crash ở tầng hệ điều hành; nhánh write/sync lỗi được đọc, không gắn CONFIRMED cho độ bền khi mất điện. Không đánh giá SẴN SÀNG/CHƯA SẴN SÀNG đóng Phase 4 từ một gói; kết luận đó dành Gói H theo yêu cầu.

## 7. Phụ lục bằng chứng và nguồn test tạm

Tất cả file dưới C:\workspace\deep-review-1-4\codex\C\. Không dùng output từ reviewer khác. storage-original.rs là bản sao byte-for-byte của repo; các bản gated/mutant/fixtures/build/cache cũng chỉ ở thư mục này.

### 7.1 Chạy lại

Từ PowerShell, với toolchain đã có; mỗi lệnh native cần kiểm LASTEXITCODE. TEMP/TMP được đặt vào C/temp để test gốc không tạo dữ liệu ở nơi khác. Không chạy generator của common.

```powershell
$taskRoot = 'C:\workspace\deep-review-1-4\codex\C'
Set-Location -LiteralPath $taskRoot
$env:TEMP = "$taskRoot\temp"
$env:TMP = "$taskRoot\temp"
node C:\workspace\Project-2C-review-2\node_modules\vitest\vitest.mjs run --config "$taskRoot\vitest.config.mts"
if ($LASTEXITCODE -ne 0) { throw 'fixture export failed' }
rustc --edition=2021 --test "$taskRoot\storage-original.rs" -o "$taskRoot\storage-tests.exe"
if ($LASTEXITCODE -ne 0) { throw 'compile failed' }
& "$taskRoot\storage-tests.exe" --test-threads=1
if ($LASTEXITCODE -ne 0) { throw 'tests failed' }
node "$taskRoot\prepare-probes.mjs"
if ($LASTEXITCODE -ne 0) { throw 'patch preparation failed' }
# storage-gated-delete.rs: copy storage-gated.rs and apply the same delete-before-rename patch.
rustc --edition=2021 -O "$taskRoot\probe.rs" -o "$taskRoot\probe.exe"
if ($LASTEXITCODE -ne 0) { throw 'compile failed' }
& "$taskRoot\probe.exe" races
if ($LASTEXITCODE -ne 0) { throw 'race probe failed' }
& "$taskRoot\probe.exe" edges
if ($LASTEXITCODE -ne 0) { throw 'edge probe failed' }
& "$taskRoot\probe.exe" mutation-error
if ($LASTEXITCODE -ne 0) { throw 'fault probe failed' }
node C:\workspace\Project-2C-review-2\node_modules\vitest\vitest.mjs run --config "$taskRoot\vitest.snapshots.config.mts"
if ($LASTEXITCODE -ne 0) { throw 'SQL.js check failed' }
rustc --edition=2021 -O "$taskRoot\io-bench.rs" -o "$taskRoot\io-bench.exe"
if ($LASTEXITCODE -ne 0) { throw 'benchmark compile failed' }
& "$taskRoot\io-bench.exe"
if ($LASTEXITCODE -ne 0) { throw 'benchmark failed' }
```

Mỗi probe tạo case mới theo PID, không xóa thư mục bằng chứng đã có. Nếu PID trùng tên cũ, đổi tên case trong probe hoặc giữ thư mục cũ trước khi chạy; không xóa rộng ngoài Codex C.

### 7.2 Inventory

| Nguồn / log | Công dụng |
|---|---|
| load-db.test.ts, vitest.config.mts, load-db.json, load-db.log | Import backup thật, kiểm counts, xuất load.db và empty.db |
| storage-original.rs | Source gốc nguyên byte; SHA256 khớp repo |
| prepare-probes.mjs, patches.json | Tạo hai mutant độc lập + scheduler gate; sinh 2.016 oracle stamp |
| storage-mutant-delete.rs / storage-mutant-nosync.rs | Patch một chỗ; log mutant-delete.log / mutant-nosync.log, mỗi mutant 37/37 |
| storage-gated.rs / storage-gated-delete.rs, probe.rs | Interleaving và fault branch Windows; không thay code repo |
| original-tests.log, races-initial.log, races.log, edges.log, mutation-error.log | Kết quả nguyên trạng / race / lỗi hệ thống |
| rust-snapshots.test.ts, vitest.snapshots.config.mts, mixed-db-check.json/.log | Mở file kết quả bằng loader thật, kiểm counts và integrity_check |
| io-bench.rs, io-bench.log | Phép đo chính, thời gian thô từng lượt |
| Cargo.toml, clippy-pedantic.log, fmt.log | Scratch std-only Clippy và rustfmt chỉ kiểm nguồn |
| cases/..., temp/..., target/..., vite-cache/... | SQLite/exports/backup và build/cache của riêng probe |

### 7.3 Source test/probe nguyên văn

Các file dưới đây là nguồn cuối cùng của chính phiên này. storage-original.rs đã có trong repo tại SHA ghim nên không nhân đôi hơn 1.100 dòng vào phụ lục. Gate chỉ thêm hai điểm dừng; bản destructive = storage-gated.rs với cùng patch delete-before-rename của prepare-probes.mjs. Không coi kết quả mutant là hành vi source production.

#### vitest.config.mts

```typescript
const repo = 'C:/workspace/Project-2C-review-2';
const here = 'C:/workspace/deep-review-1-4/codex/C';
export default {
  root: here,
  cacheDir: `${here}/vite-cache`,
  resolve: { alias: [
    { find: /^@p2c\/domain$/, replacement: `${repo}/packages/domain/src/index.ts` },
    { find: /^@p2c\/db$/, replacement: `${repo}/packages/db/src/index.ts` },
    { find: /^vitest$/, replacement: `${repo}/node_modules/vitest/dist/index.js` },
  ] },
  server: { fs: { allow: [repo, here, 'C:/workspace/deep-review-1-4/common/load'] } },
  test: { include: [`${here}/load-db.test.ts`], testTimeout: 120000 },
};
```

#### vitest.snapshots.config.mts

```typescript
const repo = 'C:/workspace/Project-2C-review-2';
const here = 'C:/workspace/deep-review-1-4/codex/C';
export default {
  root: here,
  cacheDir: `${here}/vite-cache`,
  resolve: { alias: [
    { find: /^@p2c\/domain$/, replacement: `${repo}/packages/domain/src/index.ts` },
    { find: /^@p2c\/db$/, replacement: `${repo}/packages/db/src/index.ts` },
    { find: /^vitest$/, replacement: `${repo}/node_modules/vitest/dist/index.js` },
  ] },
  server: { fs: { allow: [repo, here, 'C:/workspace/deep-review-1-4/common/load'] } },
  test: { include: [`${here}/rust-snapshots.test.ts`], testTimeout: 120000 },
};
```

#### load-db.test.ts

```typescript
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { it, expect } from 'vitest';
import { openDatabase, importBackup, listCustomers, listAppointments, listPeople, listPolicies } from '@p2c/db';
const out = 'C:/workspace/deep-review-1-4/codex/C';
it('imports the shared load fixture and exports SQLite bytes for Rust I/O probes', async () => {
  const text = readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json', 'utf8');
  const t0 = performance.now();
  const imported = await importBackup(text);
  try {
    const importMs = performance.now() - t0;
    const bytes = imported.db.export();
    const counts = {
      customers: listCustomers(imported.db).length,
      appointments: listAppointments(imported.db).length,
      people: listPeople(imported.db).length,
      policies: listPolicies(imported.db).length,
    };
    expect(counts).toEqual({ customers: 1496, appointments: 10434, people: 51, policies: 1804 });
    expect(new TextDecoder().decode(bytes.slice(0, 16))).toBe('SQLite format 3\0');
    writeFileSync(`${out}/load.db`, bytes);
    const meta = { counts, jsonBytes: Buffer.byteLength(text), sqliteBytes: bytes.byteLength, importMs,
      sha256: createHash('sha256').update(bytes).digest('hex') };
    writeFileSync(`${out}/load-db.json`, JSON.stringify(meta, null, 2));
    console.log(meta);
  } finally { imported.db.sqlite.close(); }
});

it('exports a valid empty SQLite snapshot for contrasting concurrent writes', async () => {
  const empty = await openDatabase();
  try { writeFileSync(`${out}/empty.db`, empty.export()); }
  finally { empty.sqlite.close(); }
});
```

#### prepare-probes.mjs

```javascript
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root = 'C:/workspace/deep-review-1-4/codex/C';
const src = readFileSync(`${root}/storage-original.rs`, 'utf8');
function patchOnce(needle, replacement) {
  if (src.split(needle).length !== 2) throw new Error('Patch must match exactly once');
  return src.replace(needle, replacement);
}
writeFileSync(`${root}/storage-mutant-delete.rs`, patchOnce(
  'fs::rename(&tmp, dir.join(name))',
  '{ let target = dir.join(name); if target.exists() { fs::remove_file(&target)?; } fs::rename(&tmp, target) }'
));
writeFileSync(`${root}/storage-mutant-nosync.rs`, patchOnce('file.sync_all()?;', '// MUTATION: skip durable flush'));
const gate = `
use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering as AuditOrdering};
pub static AUDIT_MODE: AtomicUsize = AtomicUsize::new(0);
pub static AUDIT_REACHED: AtomicBool = AtomicBool::new(false);
pub static AUDIT_RELEASE: AtomicBool = AtomicBool::new(false);
fn audit_gate(phase: usize, name: &str, bytes: &[u8]) {
    if name == DB_FILE && std::thread::current().name() == Some("audit-writer") && AUDIT_MODE.load(AuditOrdering::SeqCst) == phase {
        AUDIT_REACHED.store(true, AuditOrdering::SeqCst);
        while !AUDIT_RELEASE.load(AuditOrdering::SeqCst) { std::thread::yield_now(); }
    }
}
`;
let instrumented = src + gate;
instrumented = instrumented.replace('let mut file = fs::File::create(&tmp)?;',
  'let mut file = fs::File::create(&tmp)?; audit_gate(1, name, bytes);');
instrumented = instrumented.replace('fs::rename(&tmp, dir.join(name))',
  'audit_gate(2, name, bytes); fs::rename(&tmp, dir.join(name))');
writeFileSync(`${root}/storage-gated.rs`, instrumented);
const lines = [];
for (let y = 1900; y <= 2100; y++) {
  for (const [m,d] of [[0,1], [1,28], [1,29], [2,1], [11,31]]) {
    for (const [h,n,s] of [[0,0,0],[23,59,59]]) {
      const date = new Date(Date.UTC(y,m,d,h,n,s));
      const expected = date.toISOString().slice(0,19).replaceAll('-','').replace('T','-').replaceAll(':','');
      lines.push(`${Math.floor(date.getTime()/1000)}\t${expected}`);
    }
  }
}
for (const secs of [-1,0,1,-86401,-86400,86400]) {
  const expected = new Date(secs*1000).toISOString().slice(0,19).replaceAll('-','').replace('T','-').replaceAll(':','');
  lines.push(`${secs}\t${expected}`);
}
writeFileSync(`${root}/stamp-cases.tsv`, lines.join('\n'));
writeFileSync(`${root}/patches.json`, JSON.stringify({
  originalSha256: createHash('sha256').update(src).digest('hex'),
  patches: {
    delete: { needle: 'fs::rename(&tmp, dir.join(name))', replacement: 'delete destination then rename' },
    nosync: { needle: 'file.sync_all()?;', replacement: 'skip durable flush' },
    gate: ['after tmp create', 'after sync/drop before rename'],
  }
},null,2));
```

#### probe.rs

```rust
#![allow(dead_code)]
#[path = "storage-original.rs"] mod original;
#[path = "storage-gated.rs"] mod gated;
use std::fs;
#[path = "storage-gated-delete.rs"] mod destructive;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Barrier};
use std::sync::atomic::Ordering;
use std::time::{Duration, Instant};
use std::os::windows::fs::OpenOptionsExt;
const ROOT: &str = "C:/workspace/deep-review-1-4/codex/C";
const STAMP: &str = "20261005-140000";
fn fixture(name: &str) -> Vec<u8> { fs::read(Path::new(ROOT).join(name)).unwrap() }
fn case(name: &str) -> PathBuf {
    let dir = Path::new(ROOT).join("cases").join(format!("{name}-{}",std::process::id()));
    assert!(!dir.exists(), "Use a fresh process for each probe run");
    fs::create_dir_all(&dir).unwrap(); dir
}
fn db_file(dir: &Path) -> PathBuf { dir.join("project2c.db") }
fn count_backups(dir: &Path) -> usize {
    fs::read_dir(dir.join("backups")).unwrap().filter(|e|e.as_ref().unwrap().path().extension().is_some_and(|x|x=="db")).count()
}
fn gate(mode: usize) {
    gated::AUDIT_REACHED.store(false,Ordering::SeqCst);
    gated::AUDIT_RELEASE.store(false,Ordering::SeqCst);
    gated::AUDIT_MODE.store(mode,Ordering::SeqCst);
}
fn wait_gate() {
    let deadline = Instant::now()+Duration::from_secs(10);
    while !gated::AUDIT_REACHED.load(Ordering::SeqCst) {
        assert!(Instant::now()<deadline,"writer did not reach gate"); std::thread::yield_now();
    }
}
fn release() { gated::AUDIT_RELEASE.store(true,Ordering::SeqCst); }
fn races() { println!("process_id={}",std::process::id());
    let old = fixture("load.db"); let next = fixture("empty.db");
    let dir = case("reload-during-save");
    original::save(&dir,&old).unwrap();
    let lock = gated::DataLock::new();
    gated::open(&dir,STAMP,&lock).unwrap();
    gate(2);
    let d=dir.clone(); let a=next.clone();
    let writer=std::thread::Builder::new().name("audit-writer".into()).spawn(move||gated::save(&d,&a)).unwrap();
    wait_gate();
    assert_eq!(fs::read(dir.join("project2c.db.tmp")).unwrap(), next);
    let reopened = gated::open(&dir,STAMP,&lock).unwrap().unwrap();
    let removed = !dir.join("project2c.db.tmp").exists();
    release(); let result = writer.join().unwrap();
    println!("reload: removed_active_tmp={removed} reopened_old={} writer={result:?} disk_still_old={}",reopened==old,fs::read(db_file(&dir)).unwrap()==old);
    assert!(removed && result.is_err() && reopened==old);
    gated::AUDIT_MODE.store(0,Ordering::SeqCst);

    let dir=case("two-saves"); original::save(&dir,&old).unwrap(); let _lock=original::DataLock::new(); original::open(&dir,STAMP,&_lock).unwrap();
    gate(1);
    let d=dir.clone(); let a=next.clone();
    let writer=std::thread::Builder::new().name("audit-writer".into()).spawn(move||gated::save(&d,&a)).unwrap();
    wait_gate();
    let second=gated::save(&dir,&old);
    assert!(second.is_ok());
    let acknowledged=fs::read(db_file(&dir)).unwrap()==old;
    release(); let first=writer.join().unwrap();
    let after=fs::read(db_file(&dir)).unwrap();
    let mixed=after!=old && after!=next;
    println!("two saves: first={first:?} second={second:?} before_release_equals_successful_snapshot={acknowledged} final_bytes={} A_bytes={} B_bytes={} mixed={mixed}",after.len(),next.len(),old.len());
    assert!(mixed && acknowledged && first.is_err());
    assert_eq!(&after[..next.len()],next.as_slice());
    assert_eq!(&after[next.len()..],&old[next.len()..]);
    gated::AUDIT_MODE.store(0,Ordering::SeqCst);

    let mut corrupted=0; let mut failed=0;
    for round in 0..20 {
        let dir=case(&format!("unmodified-concurrent-{round}"));
        original::save(&dir,&old).unwrap();
        let barrier=Arc::new(Barrier::new(3));
        let mut handles=Vec::new();
        for payload in [old.clone(),next.clone()] {
            let d=dir.clone();let b=barrier.clone();
            handles.push(std::thread::spawn(move|| { b.wait(); original::save(&d,&payload) }));
        }
        barrier.wait();
        for h in handles { if h.join().unwrap().is_err() { failed+=1; } }
        let disk=fs::read(db_file(&dir)).unwrap();
        if disk!=old && disk!=next { corrupted+=1; }
    }
    println!("unmodified concurrent saves: rounds=20 mixed_snapshots={corrupted} failed_writes={failed}");
}
fn edges() {
    let bytes=fixture("load.db");
    let dir=case("sharing-violation"); original::save(&dir,&bytes).unwrap();
    let handle=fs::OpenOptions::new().read(true).share_mode(1).open(db_file(&dir)).unwrap();
    let result=original::save(&dir,&fixture("empty.db"));
    println!("locked destination: result={result:?} original_intact={} tmp_removed={}",fs::read(db_file(&dir)).unwrap()==bytes,!dir.join("project2c.db.tmp").exists());
    assert!(result.is_err()); assert_eq!(fs::read(db_file(&dir)).unwrap(),bytes); drop(handle);
    assert!(!dir.join("project2c.db.tmp").exists());

    let dir=case("read-only-destination"); original::save(&dir,&bytes).unwrap();
    let mut perms=fs::metadata(db_file(&dir)).unwrap().permissions();perms.set_readonly(true);
    fs::set_permissions(db_file(&dir),perms).unwrap();
    let result=original::save(&dir,&fixture("empty.db"));
    println!("read-only destination: result={result:?} original_intact={}",fs::read(db_file(&dir)).unwrap()==bytes);
    assert!(result.is_err());assert_eq!(fs::read(db_file(&dir)).unwrap(),bytes);

    let dir=case("deferred-prune");
    for i in 1u8..=10 {
        let mut b=bytes.clone(); b[63]=i;
        original::save(&dir,&b).unwrap();original::backup(&dir,STAMP).unwrap();
    }
    let handles: Vec<_>=fs::read_dir(dir.join("backups")).unwrap().map(|e|fs::OpenOptions::new().read(true).share_mode(1).open(e.unwrap().path()).unwrap()).collect();
    original::save(&dir,&bytes).unwrap();
    original::open(&dir,STAMP,&original::DataLock::new()).unwrap();
    let blocked=count_backups(&dir);drop(handles);
    for _ in 0..3 { original::open(&dir,STAMP,&original::DataLock::new()).unwrap(); }
    let retries=count_backups(&dir);
    println!("deferred prune: while_locked={blocked} after_unlock_and_3_restarts={retries}");
    assert_eq!(blocked,11);assert_eq!(retries,11);

    let dir=case("pathnames");
    for name in ["../x.xlsx","a\\x.xlsx","C:\\x.xlsx","a:x.xlsx","..xlsx","a\0.xlsx","a x.xlsx","đ.xlsx","a.XLSX","x.xlsx.exe"] {
        let err=original::write_export(&dir,name,b"data").unwrap_err();
        assert_eq!(err.kind(),std::io::ErrorKind::InvalidInput);
    }
    for name in ["NUL.xlsx","CON.p2cbackup","aux.xlsx","COM1.xlsx","LPT1.p2cbackup"] {
        let result=original::write_export(&dir,name,b"safe bytes");
        println!("reserved name {name}: {result:?}");
        if let Ok(path)=result { assert_eq!(fs::read(path).unwrap(),b"safe bytes"); }
    }
    let barrier=Arc::new(Barrier::new(17)); let mut handles=Vec::new();
    for i in 0u8..16 {
        let d=dir.clone();let b=barrier.clone();
        handles.push(std::thread::spawn(move||{ b.wait(); let p=original::write_export(&d,"same.xlsx",&[i;32]).unwrap(); assert_eq!(fs::read(&p).unwrap(),[i;32]);p }));
    }
    barrier.wait();let mut paths: Vec<_>=handles.into_iter().map(|h|h.join().unwrap()).collect();
    paths.sort();paths.dedup();assert_eq!(paths.len(),16);
    println!("concurrent exports: 16 unique complete files, no overwrite");
    let cases=fs::read_to_string(Path::new(ROOT).join("stamp-cases.tsv")).unwrap();
    let mut n=0;
    for line in cases.lines() {
        let (secs,expected)=line.split_once('\t').unwrap();
        assert_eq!(original::stamp(secs.parse().unwrap()),expected);n+=1;
    }
    println!("calendar stamps: {n} oracle cases passed (1900..2100, leap years, midnight, negative epochs)");
}
fn changed(bytes: &[u8], n:u32)->Vec<u8> {
    let mut v=bytes.to_vec();v[60..64].copy_from_slice(&n.to_be_bytes());v
}
fn sample(label:&str, n:usize, f: &mut dyn FnMut()) {
    let mut ms=Vec::new();for _ in 0..n { let start=Instant::now();f();ms.push(start.elapsed().as_secs_f64()*1000.0); }
    let raw=ms.iter().map(|x|format!("{x:.4}")).collect::<Vec<_>>().join(",");
    ms.sort_by(f64::total_cmp);
    println!("{label}\tn={n}\tmin={:.3}\tmedian={:.3}\tp95={:.3}\tmax={:.3}\traw={raw}",ms[0],ms[n/2],ms[(n*95).div_ceil(100)-1],ms[n-1]);
}
fn perf() {
    let bytes=fixture("load.db");let json=fixture("../../common/load/load-backup.json");
    println!("SQLite bytes={} JSON UTF8 bytes={}",bytes.len(),json.len());
    let dir=case("perf-save");original::save(&dir,&bytes).unwrap();
    sample("save_sqlite",20,&mut||original::save(&dir,&bytes).unwrap());
    sample("export_backup",10,&mut||{original::write_export(&dir,"load.p2cbackup",&json).unwrap();});
    let one=case("perf-open-one");original::save(&one,&bytes).unwrap();let lock=original::DataLock::new();original::open(&one,STAMP,&lock).unwrap();
    sample("open_identical_1_backup",20,&mut||{assert_eq!(original::open(&one,STAMP,&lock).unwrap().unwrap(),bytes);});
    let ten=case("perf-open-ten");
    for i in 1..=10 { original::save(&ten,&changed(&bytes,i)).unwrap();original::backup(&ten,STAMP).unwrap(); }
    let current=changed(&bytes,10);let lock=original::DataLock::new();original::open(&ten,STAMP,&lock).unwrap();
    sample("open_identical_last_of_10",20,&mut||{assert_eq!(original::open(&ten,STAMP,&lock).unwrap().unwrap(),current);});
    let mut version=11u32;
    sample("open_changed_10_backups",20,&mut||{ let data=changed(&bytes,version);original::save(&ten,&data).unwrap();let start=Instant::now();assert_eq!(original::open(&ten,STAMP,&lock).unwrap().unwrap(),data);println!("open_changed_only_ms={:.4}",start.elapsed().as_secs_f64()*1000.0);version+=1; });
    let copies=case("perf-backup-ten");for i in 1..=10 {original::save(&copies,&changed(&bytes,i)).unwrap();original::backup(&copies,STAMP).unwrap();}
    let mut version=11u32;
    sample("backup_changed_10_backups",20,&mut||{let data=changed(&bytes,version);original::save(&copies,&data).unwrap();let start=Instant::now();original::backup(&copies,STAMP).unwrap();println!("backup_changed_only_ms={:.4}",start.elapsed().as_secs_f64()*1000.0);version+=1;});
}
fn mutation_error() {
    let old=fixture("load.db");let next=fixture("empty.db");
    let dir=case("original-rename-failure");original::save(&dir,&old).unwrap();
    gate(2);let d=dir.clone();let b=next.clone();
    let writer=std::thread::Builder::new().name("audit-writer".into()).spawn(move||gated::save(&d,&b)).unwrap();
    wait_gate();
    let held=fs::OpenOptions::new().read(true).share_mode(1).open(dir.join("project2c.db.tmp")).unwrap();
    release();let result=writer.join().unwrap();
    println!("original forced rename failure: {result:?} old_db_intact={}",fs::read(db_file(&dir)).unwrap()==old);
    assert!(result.is_err());assert_eq!(fs::read(db_file(&dir)).unwrap(),old);drop(held);gated::AUDIT_MODE.store(0,Ordering::SeqCst);
    let dir=case("mutant-rename-failure");original::save(&dir,&old).unwrap();
    destructive::AUDIT_MODE.store(2,Ordering::SeqCst);
    let d=dir.clone();let b=next.clone();
    let writer=std::thread::Builder::new().name("audit-writer".into()).spawn(move||destructive::save(&d,&b)).unwrap();
    let deadline=Instant::now()+Duration::from_secs(10);
    while !destructive::AUDIT_REACHED.load(Ordering::SeqCst) { assert!(Instant::now()<deadline);std::thread::yield_now(); }
    let held=fs::OpenOptions::new().read(true).share_mode(1).open(dir.join("project2c.db.tmp")).unwrap();
    destructive::AUDIT_RELEASE.store(true,Ordering::SeqCst);let result=writer.join().unwrap();
    println!("surviving mutant forced rename failure: {result:?} old_db_missing={}",!db_file(&dir).exists());
    assert!(result.is_err());assert!(!db_file(&dir).exists());drop(held);
}
fn main() {
    match std::env::args().nth(1).as_deref() { Some("mutation-error")=>mutation_error(), Some("races")=>races(), Some("edges")=>edges(), Some("perf")=>perf(), _=>panic!("pass races|edges|perf") }
}
```

#### rust-snapshots.test.ts

```typescript
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { it, expect } from 'vitest';
import { openDatabase, listCustomers, listAppointments } from '@p2c/db';
const root = 'C:/workspace/deep-review-1-4/codex/C';
it('checks the mixed snapshots produced by the Rust probes using the real SQL.js loader', async () => {
  const loaded = readFileSync(`${root}/load.db`);
  const empty = readFileSync(`${root}/empty.db`);
  const results: object[] = [];
  for (const name of readdirSync(`${root}/cases`)) {
    if (!name.startsWith('two-saves-') && !name.startsWith('unmodified-concurrent-')) continue;
    const bytes = readFileSync(`${root}/cases/${name}/project2c.db`);
    if (bytes.equals(loaded) || bytes.equals(empty)) continue;
    let outcome: object;
    try {
      const db = await openDatabase({ bytes });
      try {
        outcome = { customers: listCustomers(db).length, appointments: listAppointments(db).length,
          integrity: db.sqlite.exec('PRAGMA integrity_check')[0]?.values };
      } finally { db.sqlite.close(); }
    } catch (error) { outcome = { error: String(error) }; }
    results.push({ name, bytes: bytes.length, prefixIsEmptySnapshot: bytes.subarray(0,empty.length).equals(empty),
      sha256: createHash('sha256').update(bytes).digest('hex'), outcome });
  }
  expect(results.length).toBeGreaterThan(0);
  writeFileSync(`${root}/mixed-db-check.json`, JSON.stringify(results,null,2));
});
```

#### io-bench.rs

```rust
#![allow(dead_code)]
#[path="storage-original.rs"] mod storage;
use std::fs;
use std::path::PathBuf;
use std::time::Instant;
const ROOT:&str="C:/workspace/deep-review-1-4/codex/C";
const STAMP:&str="20261005-140000";
fn directory(name:&str)->PathBuf {
    let d=PathBuf::from(ROOT).join("cases").join(format!("io-{name}-{}",std::process::id()));
    assert!(!d.exists());fs::create_dir_all(&d).unwrap();d
}
fn version(data:&[u8],n:u32)->Vec<u8> {let mut v=data.to_vec();v[60..64].copy_from_slice(&n.to_be_bytes());v}
fn output(label:&str,mut ms:Vec<f64>) {
    let raw=ms.iter().map(|x|format!("{x:.4}")).collect::<Vec<_>>().join(",");
    ms.sort_by(f64::total_cmp);let n=ms.len();
    let median=if n%2==0 {(ms[n/2-1]+ms[n/2])/2.0}else{ms[n/2]};
    println!("{label}\tn={n}\tmin={:.3}\tmedian={median:.3}\tp95={:.3}\tmax={:.3}\traw={raw}",ms[0],ms[(n*95).div_ceil(100)-1],ms[n-1]);
}
fn main() {
    let data=fs::read(PathBuf::from(ROOT).join("load.db")).unwrap();
    let json=fs::read("C:/workspace/deep-review-1-4/common/load/load-backup.json").unwrap();
    println!("SQLite bytes={} JSON UTF8 bytes={} warm-cache, optimized Rust, operation timed without fixture setup or assertions",data.len(),json.len());
    let dir=directory("save");storage::save(&dir,&data).unwrap();let mut samples=Vec::new();
    for _ in 0..20 {let t=Instant::now();let result=storage::save(&dir,&data);samples.push(t.elapsed().as_secs_f64()*1000.0);result.unwrap();}
    output("save_sqlite",samples);
    storage::write_export(&dir,"load.p2cbackup",&json).unwrap();let mut samples=Vec::new();
    for _ in 0..10 {let t=Instant::now();let result=storage::write_export(&dir,"load.p2cbackup",&json);samples.push(t.elapsed().as_secs_f64()*1000.0);let path=result.unwrap();assert_eq!(fs::metadata(path).unwrap().len(),json.len() as u64);}
    output("export_backup",samples);
    let dir=directory("open-one");storage::save(&dir,&data).unwrap();let lock=storage::DataLock::new();storage::open(&dir,STAMP,&lock).unwrap();let mut samples=Vec::new();
    for _ in 0..20 {let t=Instant::now();let result=storage::open(&dir,STAMP,&lock);samples.push(t.elapsed().as_secs_f64()*1000.0);assert_eq!(result.unwrap().unwrap(),data);}
    output("open_identical_1_backup",samples);
    let dir=directory("ten");for n in 1..=10 {storage::save(&dir,&version(&data,n)).unwrap();storage::backup(&dir,STAMP).unwrap();}
    let lock=storage::DataLock::new();let current=version(&data,10);storage::open(&dir,STAMP,&lock).unwrap();let mut samples=Vec::new();
    for _ in 0..20 {let t=Instant::now();let result=storage::open(&dir,STAMP,&lock);samples.push(t.elapsed().as_secs_f64()*1000.0);assert_eq!(result.unwrap().unwrap(),current);}
    output("open_identical_last_of_10",samples);
    let mut samples=Vec::new();
    for n in 11..31 {let next=version(&data,n);storage::save(&dir,&next).unwrap();let t=Instant::now();let result=storage::open(&dir,STAMP,&lock);samples.push(t.elapsed().as_secs_f64()*1000.0);assert_eq!(result.unwrap().unwrap(),next);}
    output("open_changed_10_backups",samples);
    let mut samples=Vec::new();
    for n in 31..51 {let next=version(&data,n);storage::save(&dir,&next).unwrap();let t=Instant::now();let result=storage::backup(&dir,STAMP);samples.push(t.elapsed().as_secs_f64()*1000.0);result.unwrap();}
    output("backup_changed_10_backups",samples);
}
```

### 7.4 Dấu vết nguồn

- storage-original.rs: SHA256 33d51f6c1ff87c4d66bea8f2a78a6e3f049040773eb94d72a18649c1eba1615d
- prepare-probes.mjs: SHA256 dfab5e872ed1d5d6c2abf65c0564c2023badcc6b263fb5811db9aa09e4b7a822
- probe.rs: SHA256 068ed14c21d421d0b4096014bbf2ea8bf833dcc3bd9504da6d8a8040310d58c7
- io-bench.rs: SHA256 ea2acead0540c8bd1f500f9727b11c4a591873f03e4c2e72d78fd9ace62fb44d
- load-db.test.ts: SHA256 3d15ca48b17c626fbe8b51658f7b10217acdee7948a9b8998df49a212784f0d9
- rust-snapshots.test.ts: SHA256 4e5a9d5fe69a84860d0628d53dd7a4e53988e5b7457a4a98dda04866d3ac13c3
