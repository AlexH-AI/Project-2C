# ADR-0020: Lưu trữ khi dữ liệu lớn — giữ ADR-0016 cho v1.0, mốc đo và hướng chuyển

- **Trạng thái:** Proposed (G1): chờ Owner duyệt trên PR của T-501 (#1458).
- **Ngày:** 2026-11-26
- **Nguồn:**
  - Số đo T-485 (#1440, PR #1457): `docs/metrics/phase-6.md`, mục "Số đo dữ liệu 5× / 10×" (dưới đây gọi là **mục số đo**), file `docs/metrics/phase-6-scale/*.json`. Mọi số đo trong ADR này lấy từ mục đó, trừ khi ghi khác.
  - Owner 12/11/2026: `docs/PROJECT-STATE.md` mục 2026-11-12 (phân phối hai nền tảng), điểm 4–5.
  - Owner 21/11/2026, G1 của T-485: "ADR, không chặn" (https://github.com/AlexH-AI/Project-2C/pull/1457#issuecomment-7064483165).
- **Liên quan:** ADR-0016 (cách lưu hôm nay; ADR này giữ nó cho v1.0 và nêu khi nào, theo hướng nào thay §1, §2 của nó). ADR-0019 §2 (thư mục dữ liệu; ADR này là "ADR lưu trữ" mà ADR-0019 để lại). ADR-0004 (một người dùng, không server). ADR-0005 (dependency đã duyệt). ADR-0010, ADR-0019 §3 (dữ liệu giữa các máy qua file backup). Spec `docs/design/phase-3-du-lieu.md` (backup, trần 100 MB).

## Bối cảnh

### Cách lưu hôm nay (ADR-0016)

- **Engine:** cả DB nằm trong bộ nhớ WebAssembly của sql.js, trong webview. Lệnh của `packages/db` chạy đồng bộ trên DB đó (Drizzle, driver `sql-js`).
- **Mở:**
  - Rust đọc cả `project2c.db` và gửi qua IPC; sql.js nạp cả file.
  - App chạy `PRAGMA integrity_check` trên cả file trước migration (`refuseDamaged`, `apps/desktop/src/data/app-data.ts`).
  - Rust chép file vào `backups/` trước lần lưu đầu.
- **Lưu:**
  - Sau mỗi transaction, `packages/db/src/database.ts` xuất cả file (`persist?.(exportBytes())`), đồng bộ, ngay trong lệnh.
  - Hàng đợi lưu (`apps/desktop/src/data/persist-queue.ts`) gửi cả file qua IPC.
  - Rust ghi `project2c.db.tmp`, `sync_all`, rồi đổi tên đè lên file cũ (`apps/desktop/src-tauri/src/storage.rs`).
- **Đọc:** sau mỗi lần ghi, màn đọc lại cả bảng của revision mới vào JS (`readTables`, `apps/desktop/src/data/tables.ts`). Chỉ số tính trên mảng JS (`packages/domain`).
- **Backup:** một file JSON `.p2cbackup` chứa cả dữ liệu. Trần 104 857 600 byte (100 MB) cả khi nhập lẫn khi xuất (`MAX_BACKUP_BYTES` của `packages/db/src/backup.ts`; Owner 30/09/2026, 08/11/2026; spec Phase 3).

### Vấn đề: số đo T-485

Máy: Home PC (i9-12900K, 32 GB). Dữ liệu 1× ≈ 1 500 KH, 10 400 lịch hẹn, 1 700 HĐ, 44 RM, lịch sử 1 năm. Ngưỡng là của bảng "Thời gian thao tác" trong `docs/metrics/phase-6.md` (Owner chốt 13/10/2026).

| Việc | Tên probe | Ngưỡng | 1× | 5× | 10× |
|---|---|---|---:|---:|---:|
| Mở dữ liệu | `app.open-data` | ≤ 600 ms | 315 ms | **1 093 ms** | **2 137 ms** |
| Màn đầu sau tải lại (6 màn) | `reload.*` | < 500 ms | 294–388 ms | **1 117–1 667 ms** | **2 208–3 656 ms** |
| Lưu file DB | `db.save` | ≤ 400 ms | 151 ms | **807 ms** | **1 527 ms** |
| Tạo lịch hẹn tiếp theo | `appointments.next-*` | ≤ 300 ms | 109–113 ms | **547–605 ms** | **1 021–1 072 ms** |
| Nhập backup: chọn file → hộp xác nhận | `backup.read` | ≤ 2 000 ms | 973 ms | **5 385 ms** | từ chối (quá trần) |
| Xuất backup | `backup.export` | ≤ 1 000 ms | 427 ms | **2 420 ms** | từ chối sau 3 260 ms |
| Bộ nhớ renderer của webview | `memory.webview-renderer` | — | 239 MB | 353 MB | 443 MB |
| `project2c.db` | — | — | 14,1 MB | 70,0 MB | 144,7 MB |
| File backup | — | trần 104,9 MB | 16,0 MB | 80,2 MB | 160,7 MB |

- **Thao tác màn chịu được cỡ lớn:** đổi kỳ, sắp, lọc, mở hồ sơ, Thùng rác đều dưới 200 ms ở cả 10×. Màn Team & nhân sự là ngoại lệ, nhưng chỗ chậm nằm ở phần tính của màn, không do cách lưu, và T-502 đã sửa (10×: 292 → 17 ms).
- **Mọi việc đụng tới cả file thì vượt ngưỡng:** mở, màn đầu sau tải lại, lưu, tạo lịch hẹn, nhập / xuất backup. Các số tăng gần tuyến tính theo cỡ file. Nội suy giữa 1× và 5×, ngưỡng bắt đầu vượt ở:
  - màn đầu sau tải lại ≈ 1,4–2×;
  - nhập backup ≈ 1,9×; xuất backup ≈ 2,2×;
  - mở và lưu ≈ 2,5×; tạo lịch hẹn ≈ 2,5–2,7×.
- **Backup chạm trần từ ≈ 6,5×.** Ở 10× app không nhập, không xuất được backup.
  - Nhập: hộp 10b vẫn khuyên "kiểm tra lại file đã chọn", trong khi file là backup thật của dữ liệu lớn.
  - Xuất: mất 3,3 s rồi mới từ chối, và tiến trình WebView2 lên 1 451 MB.
  - Lối duy nhất hôm nay: chép file `.db` (câu `settings.backup.exportTooLarge`), kể cả khi chuyển dữ liệu giữa hai máy (ADR-0019 §3).
- **Mac (Owner bấm giờ, 10×):** mở ≈ 2–2,3 s, lưu một lịch hẹn ≈ 1 s. Việc lưu chậm ngang Windows.
- **Mục số đo không tách các việc trên thành từng phần:** gửi file qua IPC, nạp vào sql.js, `integrity_check`, chép backup lúc mở, xuất file, đọc lại bảng, vẽ màn. Vì vậy mọi tác dụng nêu cho từng phương án dưới đây là **ước tính**, kèm căn cứ, chưa đo. Việc đo phân rã là bước đầu của kế hoạch (P0, mục Quyết định đề xuất).

### Cỡ dữ liệu người dùng thật có thể đạt

Theo mục số đo, đoạn "Cỡ một người dùng thật có thể đạt":

- 1× ≈ một năm dùng của 44 RM. Một tổ chức 30 RE (`docs/PROJECT-PLAN.md`) ≈ 0,7× mỗi năm.
- Ngưỡng mở / lưu (≈ 2,5×) tới sau ≈ 2,5 năm với 44 RM, ≈ 3,5 năm với 30 RE. Ngưỡng màn đầu sau tải lại tới sớm hơn, sau ≈ 1,5–3 năm.
- Trần backup (≈ 6,5×) tới sau ≈ 6,5 năm với 44 RM, ≈ 9 năm với 30 RE.
- Có thể tới sớm hơn:
  - dữ liệu thật có ghi chú dài hơn và nhiều phân tích AI hơn dữ liệu giả lập;
  - mọi số đo chỉ trên i9-12900K; máy yếu hơn (Office Laptop) vượt ở cỡ nhỏ hơn;
  - `--scale` làm dữ liệu "rộng" ra (thêm team), còn người dùng thật làm dữ liệu "sâu" thêm (nhiều năm của cùng KH); dạng sâu chưa đo.
- v1.0 bắt đầu từ dữ liệu trống. Đó là lý do Owner chọn "không chặn" ngày 21/11.

### Điều ADR này không đổi

- Thư mục dữ liệu và bố cục bên trong (ADR-0019 §2). File mới, nếu có, nằm cùng thư mục đó.
- Phần tính của từng màn, như màn Team & nhân sự chậm trên Mac (≈ 2 s ở 10×, trong WKWebView): mục số đo ghi rõ là không do cách lưu.

## Phương án

- **(1) Giữ cách hiện nay (ADR-0016).**
- **(2) Vẫn sql.js, không xuất và ghi cả file sau mỗi transaction.** Biến thể được xét: transaction chỉ báo "có thay đổi"; hàng đợi lưu xuất file lúc bắt đầu một lần ghi (`persist` của `database.ts` nhận một hàm xuất thay cho bytes). Các transaction liền nhau gộp vào một lần xuất, và việc xuất rời khỏi đường của lệnh. Mỗi lần ghi vẫn là cả file. Các biến thể khác của (2) ở mục "Phương án đã loại".
- **(3) SQLite gốc trong Rust giữ file; sql.js vẫn là bản làm việc trong webview.**
  - Mở như hôm nay: nạp cả file vào sql.js.
  - Mỗi transaction, `database.ts` ghi lại các câu ghi đã chạy (SQL và tham số) và gửi cả gói cho Rust, thay cho cả file.
  - Rust chạy lại gói trong một transaction trên `project2c.db` bằng SQLite gốc, rồi ghi xuống đĩa bằng journal của SQLite.
  - Lệnh, schema, migration drizzle-kit và test Vitest của `packages/db` giữ nguyên.
- **(4) SQLite gốc trong Rust là nơi duy nhất giữ DB.** Webview gửi từng câu SQL qua IPC (vd. driver `sqlite-proxy` của Drizzle, kiểu async), Rust chạy trên file. Không còn bản DB trong webview.

### So sánh

| | (1) Giữ | (2) Xuất gộp | (3) Rust giữ file, gửi câu ghi | (4) Rust là nơi duy nhất |
|---|---|---|---|---|
| Mở, màn đầu sau tải lại | Như số đo: vượt từ ≈ 1,4–2,5× | Như (1) | Vẫn nạp cả file: phần chính còn tuyến tính. Có thể rút phần kiểm toàn vẹn và chép backup (dưới) | Không nạp cả file. Nhưng màn vẫn đọc cả bảng sau mỗi lần ghi, trừ khi đổi phía đọc (dưới) |
| Lưu (`db.save`) | Như số đo: vượt từ ≈ 2,5× | Mỗi lần ghi vẫn cả file; ít lần ghi hơn khi thao tác liền nhau | Theo cỡ thay đổi, không theo cỡ file (ước vài chục ms) | Như (3) |
| Tạo lịch hẹn | Như số đo: vượt từ ≈ 2,5–2,7× | Bớt phần xuất file; phần đọc lại bảng và vẽ màn còn | Như (2) | Phần đọc lại bảng qua IPC có thể chậm hơn hôm nay nếu không đổi phía đọc |
| Bộ nhớ webview | Như số đo (renderer 443 MB ở 10×) | Như (1) | Như (1); Rust thêm bộ đệm trang của SQLite | Bớt bản DB trong WebAssembly (≈ cỡ file); bảng JS còn |
| Code phải đổi | Không | `packages/db` (`database.ts`), app (`persist-queue.ts`, `app-data.ts`), probe | `packages/db` (`database.ts`), app (`persist-queue.ts`, `tauri-storage.ts`), Rust (module mới, `storage.rs`), probe | Cả lớp dữ liệu: lệnh thành async, mọi chỗ gọi ở app, Rust, test, e2e; muốn có lợi còn phải đổi phía đọc |
| Dependency mới (G4) | Không | Không | Crate SQLite cho Rust | Crate SQLite cho Rust |
| macOS | Như hôm nay | Như hôm nay | Việc ghi sang Rust, không qua WKWebView; crate build trong `macos.yml` | Như (3) |
| Thùng rác / Dọn sạch | Không đổi | Không đổi | Gói của Dọn sạch có cả `PRAGMA` và `VACUUM` (dưới) | Chạy trong Rust |
| Cỡ việc (Issue ước) | 0 | 1–2, `risk:med` | 4–6, `risk:high` | ≈ 15–25, ADR riêng |

### (1) Giữ cách hiện nay

- Không tốn gì. Đủ cho tới ≈ 1,4–2,5× trên Home PC, tức khoảng 1,5–2,5 năm dùng của 44 RM.
- Sau đó mọi việc đụng cả file vượt ngưỡng và tiếp tục chậm thêm tuyến tính. Backup hỏng hẳn từ ≈ 6,5×.

### (2) Xuất gộp

- **Căn cứ:** ngày nay, xuất cả file nằm trong lệnh (`database.ts`, hàm `transaction`): mỗi lệnh ghi chờ sql.js chép cả DB ra khỏi WebAssembly. Hàng đợi lưu đã gộp các bản chụp đang chờ thành bản mới nhất, nhưng mỗi bản chụp vẫn tốn một lần xuất.
- **Được:** tạo lịch hẹn và các lệnh ghi bớt phần xuất. Phần xuất chiếm bao nhiêu của 547–605 ms ở 5× thì chưa đo.
- **Không được:**
  - `db.save` của mỗi lần ghi vẫn tuyến tính theo cỡ file (807 ms ở 5×), nên ngưỡng 400 ms vẫn vượt từ ≈ 2,5×. Đóng app vẫn phải chờ lần ghi cuối.
  - Mở và bộ nhớ không đổi.
  - Lần xuất vẫn chạy trên luồng chính của webview: ở cỡ lớn, giao diện có thể đứng một lúc khi một lần ghi bắt đầu (ước, chưa đo).
- **Mất dữ liệu khi app tắt ngang:** như hôm nay. Bản chụp chưa ghi xong thì mất, cả hôm nay lẫn với (2).
- **Code:** `database.ts` (`persist` nhận hàm xuất), `persist-queue.ts` (xuất khi bắt đầu ghi), `app-data.ts`, test của chúng; probe thêm mốc đo cho phần xuất. Domain, Rust, e2e không đổi.

### (3) Rust giữ file, gửi câu ghi

- **Được:**
  - Lưu theo cỡ thay đổi. Một gói vài câu ghi qua IPC, cộng một transaction SQLite gốc có `fsync`, ước vài chục ms ở mọi cỡ (chưa đo; P0 đo bằng một bản thử).
  - Tạo lịch hẹn bớt phần xuất như (2).
  - Mở: Rust có SQLite gốc nên có thể chạy `integrity_check` ở Rust (SQLite gốc nhanh hơn bản WebAssembly; có thể chạy song song lúc gửi file). Phần nạp cả file vào sql.js vẫn tuyến tính. Rút được bao nhiêu thì P0 đo.
- **Không được:** bộ nhớ webview không đổi, vì DB vẫn ở trong webview. Phần đọc lại bảng và vẽ màn sau mỗi lần ghi cũng không đổi.
- **Chạy lại được vì câu ghi tất định:**
  - id, mốc giờ và mã KH sinh ở JS (`db.now`, `db.random`), rồi truyền vào câu ghi làm tham số.
  - Schema và migration không dùng `random()`, `datetime('now')`, `CURRENT_TIMESTAMP` (đã quét `packages/db/src`, `packages/db/migrations` ở `main` `3a95c48`).
  - Lớp ghi lại phải bắt cả câu chạy thẳng trên sql.js (`run`, `exec`), không chỉ câu qua `prepare` của Drizzle. Đó là migration (`exec` nhiều câu, tắt khóa ngoại), Dọn sạch (`purge.ts`: `PRAGMA foreign_keys = OFF` / `ON`, câu xóa, rồi `VACUUM` ngoài transaction) và `BEGIN` / `SAVEPOINT` / `COMMIT`. Rust chạy lại đúng thứ tự đó.
  - Thay cả DB (nhập backup, tải lại dữ liệu giả lập) đi đường cả file như hôm nay.
- **Lại hai engine.** ADR-0016 đã loại phương án `rusqlite` vì phải giữ hai engine giống nhau. Ở (3), Rust không có logic nghiệp vụ: nó chỉ chạy lại đúng các câu sql.js vừa chạy thành công. Những điểm còn lại phải giải quyết:
  - **Lệch phiên bản SQLite:** sql.js 1.14.2 gói một bản SQLite, crate gói một bản khác. Ghim cả hai; test Rust chạy mọi migration và các gói mẫu (sinh bằng sql.js trong Node) trên bản SQLite của crate.
  - **Phát hiện lệch:** Rust trả số hàng mỗi câu đã đổi; webview so với số sql.js báo (`getRowsModified`). Khác nhau thì webview thôi gửi gói và ghi cả file một lần (đường hôm nay), nên file khớp lại DB trong webview. Test hợp đồng: sau một chuỗi lệnh, file của Rust và DB của sql.js cho cùng hash bảng (như `tablesHash` của `tools/load-data-core.mjs`).
  - **Gói chạy lỗi** (đĩa đầy, file bị chương trình khác khóa): như hôm nay, dữ liệu còn trong bộ nhớ và trạng thái lưu báo lỗi; lần lưu sau ghi cả file. Đường cả file giữ làm đường dự phòng.
  - **Chế độ journal:** rollback journal (`DELETE`), không WAL. Lý do: `project2c.db` luôn là cả dữ liệu; backup lúc mở vẫn chỉ là chép một file (Rust giữ khóa ghi khi chép); công cụ ngoài mở được file như ADR-0016 hứa. File `project2c.db-journal` chỉ có trong lúc ghi, ở cùng thư mục (ADR-0019 §2).
  - **Phục hồi:** Rust mở file bằng SQLite gốc trước khi đọc bytes gửi cho webview, để SQLite tự phục hồi từ journal nếu lần ghi trước bị ngắt. Không đọc thẳng bytes của một file còn journal dở.
  - **Trang cũ:** gói từ một trang đã tải lại bị từ chối như lần lưu hôm nay (`STALE_PAGE`).
- **Mất dữ liệu khi app tắt ngang:** tối đa transaction đang gửi, như ADR-0016 (journal của SQLite thay cho cặp ghi `.tmp` rồi đổi tên).
- **Code:**
  - `packages/db`: `database.ts` ghi lại câu ghi theo transaction; cổng `persist` nhận gói hoặc cả file.
  - App: `persist-queue.ts` giữ gói theo thứ tự và chuyển sang cả file khi lỗi; `tauri-storage.ts` gọi lệnh mới.
  - Rust: một module dùng SQLite gốc (mở file, chạy gói, kiểm toàn vẹn, khóa). `storage.rs` giữ backup, xuất file và đường cả file.
  - Test Rust chạy lại gói mẫu; probe đổi nghĩa `db.save` (thời gian chạy một gói).
  - Domain không đổi. E2e chạy trên bản web, vốn không lưu, nên không thấy đường mới; vì vậy test của đường mới là test Rust cộng test hợp đồng nói trên.
- **Dependency (G4):** crate SQLite cho Rust, vd. `rusqlite` có feature `bundled` (biên dịch SQLite từ mã C bằng trình biên dịch máy build Tauri đã có: MSVC trên Windows, Xcode Command Line Tools trên macOS). Rust không còn "chỉ `std`" như ADR-0016 §2. G4 duyệt lúc mở Issue đầu tiên cần crate, không duyệt ở ADR này.

### (4) Rust là nơi duy nhất

- **Được:** không nạp cả file khi mở, webview bớt bản DB trong WebAssembly, lưu theo cỡ thay đổi.
- **Không được nếu chỉ đổi engine:** app đọc lại cả bảng sau mỗi lần ghi (`readTables`). Với (4), mỗi lần đọc lại đó là cả bảng đi qua IPC (≈ 104 000 lịch hẹn ở 10×), có thể chậm hơn hôm nay. Có lợi về mở và bộ nhớ chỉ khi đổi cả phía đọc: màn hỏi đúng thứ nó cần thay vì đọc cả bảng, và các chỉ số của `packages/domain` (golden tính trên mảng) đổi cách lấy dữ liệu.
- **Code:** mọi hàm đọc / ghi và `transaction` của `packages/db` thành async; mọi chỗ gọi `run`, `tables()` ở app; lớp DB và lệnh chạy SQL ở Rust. Test Vitest và bản web (e2e) cần một engine async khác Rust (sql.js sau một lớp async), tức lại hai engine, lần này cả logic nghiệp vụ chạy trên hai engine.
- Cỡ việc ≈ 15–25 Issue, một lần viết lại lớp dữ liệu. Cần ADR riêng.

## Backup cho dữ liệu trên 100 MB

- **(B1) Giữ JSON, nâng trần:** không chọn. Đọc file 80 MB đã mất 5,4 s ở 5× (ngưỡng 2 s); xuất ở 10× đã đẩy WebView2 lên 1,45 GB trước khi từ chối.
- **(B2) JSON nén:** không chọn. File nhỏ hơn, nhưng app vẫn dựng cả chuỗi JSON trong bộ nhớ, nên thời gian và bộ nhớ không bớt.
- **(B3) Backup là một file SQLite** (bản DB đã `VACUUM`): đề xuất.
  - **Xuất:** chép hoặc xuất file DB, không dựng JSON. Với (3), Rust tự làm.
  - **Nhập, giữ ranh giới tin cậy của hôm nay:** app không dùng thẳng file người dùng chọn làm DB của mình. App dựng DB từ migration của chính nó ở schema version của file, chép từng hàng từ file sang, kiểm giá trị như backup JSON (spec Phase 3, "Kiểm giá trị"), rồi chạy các migration còn thiếu. Đây là đường `importBackup` đang làm, chỉ đổi nguồn hàng từ JSON sang file SQLite.
  - File SQLite mở được trên cả Windows và macOS, nên dữ liệu lớn chuyển được giữa hai máy (ADR-0019 §3).
  - Backup JSON đã có vẫn nhập được (app đọc theo trường `format`).
  - Trần mới đặt lúc viết Issue, theo số đo nhập file 10× / 20× (thời gian, bộ nhớ đỉnh). ADR này chỉ chốt định dạng.
- **Câu báo hôm nay, dùng tới khi có B3:**
  - Hộp 10b khi nhập file quá trần: bỏ câu "Backup của Project-2C nhỏ hơn nhiều: kiểm tra lại file đã chọn". Thay bằng câu nói file có thể là backup của dữ liệu lớn mà app chưa đọc được, kèm cách chép file `.db` như câu `settings.backup.exportTooLarge`.
  - Xuất: từ chối trước khi dựng JSON khi ước cỡ file vượt trần, thay vì sau 3,3 s và 1,45 GB. Ở ba cỡ của mục số đo, file backup ≈ 1,1–1,15 lần `project2c.db`.
  - Đây là một Issue code nhỏ, chịu K49. Làm trước G7 hay sau v1.0 là câu hỏi cho Owner (thân PR của T-501).

## Mốc đo để chuyển

- **Thước chính: cỡ `project2c.db`.** Mọi việc vượt ngưỡng tăng gần tuyến tính theo cỡ file, và ai cũng xem được cỡ file trong thư mục dữ liệu (Cài đặt → Dữ liệu chỉ đường dẫn; app hôm nay không hiện cỡ file). 1× = 14,1 MB.
- **Mốc bắt đầu: ≈ 21 MB (≈ 1,5×)** trên máy bất kỳ đang dùng app. Tới mốc này thì làm P0 (đo phân rã), chọn phương án theo luật ở mục Quyết định đề xuất, rồi lên lịch các Issue. Chọn 1,5× mà không chờ 2,5× vì:
  - màn đầu sau tải lại vượt ngưỡng từ ≈ 1,4–2×;
  - mọi số đo chỉ trên i9-12900K;
  - việc chuyển ước 4–6 Issue, cần thời gian làm và nghiệm thu.
- **Mốc phải xong: trước ≈ 35 MB (≈ 2,5×).** Đó là chỗ mở và lưu vượt ngưỡng trên Home PC. P0 đo cả trên Office Laptop; máy chậm hơn thì dời hai mốc xuống theo số của nó.
- **Mốc backup:** B3 làm cùng việc chuyển cách lưu, và phải xong trước khi `project2c.db` tới ≈ 90 MB (≈ 6,5×, trần backup JSON).
- **Thước phụ khi đã có dữ liệu thật:** probe (`e2e/perf/README.md`) đọc `p2c:data-open` và `p2c:db-save` trên một bản chép của dữ liệu, so với ngưỡng Owner 13/10 (≤ 600 ms, ≤ 400 ms).
  - Không dùng LCP hay "mở lại ≤ 1 s" làm mốc. Ở 1× hôm nay, LCP đã ≈ 1,09 s mà chưa rõ nguyên nhân (mục số đo; ghi chú Medium của DS-12 ở sổ).
- **Lúc làm so với v1.0 / G7:** không đổi engine hay đường lưu trước G7.
  - v1.0 bắt đầu từ dữ liệu trống. Với 44 RM, mốc 1,5× tới sau ≈ 1,5 năm.
  - Đổi sau phát hành không phải chuyển dữ liệu: (2), (3) và (4) đều mở đúng file `project2c.db` hôm nay (cùng định dạng SQLite, schema, migration); backup JSON cũ vẫn nhập được. Chờ không làm việc sau đắt hơn. Thư mục dữ liệu của ADR-0019 thì khác: đổi nó sau phát hành là chuyển dữ liệu thật, nên ADR-0019 chốt trước G7.

## Quyết định đề xuất

1. **v1.0 giữ ADR-0016 (phương án 1).** Không thêm crate, không đổi đường lưu trước G7.
2. **Câu báo backup** (hộp 10b khi nhập, xuất từ chối sớm): một Issue nhỏ. Owner chọn làm trước G7 hay sau v1.0.
3. **Theo dõi cỡ `project2c.db`.** Tới ≈ 21 MB thì mở **P0**: đo phân rã mở, lưu, tạo lịch hẹn ở 1× / 5× / 10× trên Home PC và Office Laptop. Mở chia thành IPC, nạp sql.js, `integrity_check`, chép backup; ghi chia thành lệnh, xuất file, gửi và ghi file, đọc lại bảng, vẽ màn. P0 có cả một bản thử chạy lại gói câu ghi bằng SQLite gốc, để đo lần lưu của (3).
4. **Chọn theo kết quả P0:**
   - **Lưu:** (3) là hướng đích. Trong các phương án giữ lệnh đồng bộ, chỉ nó đưa `db.save` về theo cỡ thay đổi.
   - **Tạo lịch hẹn và lệnh ghi:** nếu phần xuất file chiếm phần lớn, (2) sửa được và rẻ (1–2 Issue). Khi đó (2) làm trước, (3) làm khi `db.save` thành vấn đề (vượt ngưỡng trên máy đang dùng, hay đóng app phải chờ lưu).
   - **Nếu phần đọc lại bảng và vẽ màn chiếm phần lớn:** không phương án lưu nào sửa được. Đó là việc riêng ở phía đọc, như T-502, ngoài ADR này.
   - **Mở:** nếu `integrity_check` và chép backup chiếm phần lớn, (3) rút được (kiểm bằng SQLite gốc trong Rust). Nếu phần nạp cả file chiếm phần lớn, chỉ (4) sửa được: cần ADR riêng.
5. **(4) không chọn bây giờ:** nó chỉ có lợi về mở và bộ nhớ khi đổi cả phía đọc của app. Xét bằng ADR riêng khi dữ liệu tới ≈ 5×, hay khi bộ nhớ thành vấn đề trên máy 8 GB (mục số đo: máy 8 GB sẽ chật ở 10×).
6. **Backup trên 100 MB: (B3)**, file SQLite, nhập bằng cách chép hàng vào DB app dựng rồi kiểm giá trị. Làm cùng việc chuyển cách lưu, xong trước ≈ 6,5×. Backup JSON vẫn nhập được.
7. **G1 của ADR này chỉ duyệt hướng và mốc.** Crate SQLite cho Rust qua G4 lúc mở Issue đầu tiên cần nó. Issue code chỉ tạo khi Owner bảo.

## Phương án đã loại

- **Nhật ký thay đổi tự viết, chụp cả file định kỳ** (một biến thể của 2): tự làm lại phần SQLite đã có (journal). `project2c.db` không còn là cả dữ liệu giữa hai lần chụp, và mở còn chậm hơn vì phải chạy lại nhật ký.
- **Chỉ ghi các trang đã đổi vào file cũ** (một biến thể của 2): ghi tại chỗ không nguyên tử, nên phải tự làm journal như trên.
- **SQLite WASM chính thức (`@sqlite.org/sqlite-wasm`) lưu trong OPFS** (một biến thể của 2):
  - dữ liệu nằm trong kho riêng của webview (thư mục WebView2 / WKWebView), không ở thư mục dữ liệu của ADR-0019 §2: mất chế độ portable, mất backup bằng chép file, công cụ ngoài không mở được;
  - OPFS cần Worker, nên lệnh cũng thành async như (4);
  - thêm package (G4).
- **Plugin SQL của Tauri (`tauri-plugin-sql`):** ADR-0016 đã loại vì connection pool làm transaction không tin cậy.
- **CSDL server (PostgreSQL…) hay PostgreSQL nhúng** (Owner 12/11: "cần SQLite hay nền tảng tương tự SQgre gì đó"): ngược ADR-0004 (một người dùng, không server). Chỗ chậm không phải SQLite mà cách dùng (đọc / ghi cả file). SQLite gốc thừa sức cho cỡ dữ liệu này, và đổi sang nó giữ được schema, migration, lệnh.
- **Backup JSON nâng trần (B1), JSON nén (B2):** lý do ở mục Backup.

## Hệ quả

- ADR-0016 giữ hiệu lực cho v1.0. Dòng trạng thái của nó trỏ sang ADR này. Khi làm (3): §1 ("một engine") và §2 ("chỉ `std`") của ADR-0016 đổi, ADR-0016 thành "thay một phần", ghi bằng phụ lục lúc đó.
- ADR-0019: các câu "ADR lưu trữ (chưa có)" nay là ADR này; dòng trạng thái của ADR-0019 trỏ sang.
- Không phải chuyển dữ liệu người dùng khi đổi cách lưu sau v1.0: cùng file `project2c.db`, cùng schema; backup JSON cũ vẫn nhập được.
- Issue dự kiến, chỉ tạo khi Owner bảo:
  - câu báo backup (thời điểm do Owner chọn);
  - P0 (khi `project2c.db` ≈ 21 MB);
  - theo P0: (2) 1–2 Issue và / hoặc (3) 4–6 Issue gồm cả B3.
- Bản web (`pnpm dev:web`, e2e) không đổi ở mọi phương án (1)–(3): nó không lưu.
