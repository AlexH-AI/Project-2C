XONG — Codex gói B, 2026-10-14 10:42:19 (Asia/Saigon)

## 1. Thông tin phiên

- Bên: Codex, reviewer độc lập.
- Gói B: File và Rust.
- SHA đầu phiên: 885534549808f42aec7f9af5743bbf86642ee4bd.
- git status --short đầu phiên: rỗng (worktree sạch).
- Bắt đầu: 2026-10-14 10:22:34 (Asia/Saigon).
- Bước 0: B.md chưa có; A.md tồn tại, dòng đầu XONG; không đọc nội dung A.
- Phạm vi: apps/desktop/src-tauri/** và apps/desktop/src/data/** trừ AI; đọc thêm điểm nối cần thiết.
- Máy: Office Laptop D13_THINKPAD, Node 24.20.0; giờ trong báo cáo theo Asia/Saigon.
- Phiên mới; không phải phiên làm tiếp. Không dùng subagent; không thực hiện nghi thức phát triển Claude.

## 2. Phạm vi đã đọc

Đọc sâu toàn bộ 19 file code/test thuộc luật xếp Gói B: 2.001 dòng sản phẩm + 3.968 dòng test. Các khoảng bên dưới là dòng vật lý ở SHA ghim.

| File | Dòng đã đọc | Nội dung đối chiếu |
|---|---:|---|
| apps/desktop/src-tauri/src/ai.rs | 1–1789 | Sản phẩm 1–517; test 518–1789; key, Busy, request, reply, escapes, timeout, HTTPS, giới hạn/gzip, server local |
| apps/desktop/src-tauri/src/storage.rs | 1–1401 | Sản phẩm 1–471; test 472–1401; lock, stale page, atomic write, backup dedup/prune, claim export, cleanup, đường dẫn |
| apps/desktop/src-tauri/src/lib.rs | 1–205 | Toàn bộ lệnh Tauri, header/raw body, blocking pool, data_dir, đăng ký handler |
| apps/desktop/src-tauri/src/main.rs; build.rs | 1–6; 1–3 | Entrypoint/build |
| apps/desktop/src/data/app-data.ts; app-data.test.ts | 1–436; 1–1120 | Startup, migration/backup gate, save queue, generation, S2-1…S2-6, export/import |
| apps/desktop/src/data/persist-queue.ts; persist-queue.test.ts | 1–79; 1–185 | Coalesce, đồng bộ/async failure, failed/lost, flush và unsubscribe |
| apps/desktop/src/data/tauri-storage.ts; tauri-storage.test.ts | 1–61; 1–75 | Invoke, raw bytes, page header, UTC offset, export/header và status |
| apps/desktop/src/data/tauri-contract.test.ts | 1–217 | JS↔Rust command/argument/header/error/result contracts, mock AI client |
| apps/desktop/src/data/AppDataContext.tsx | 1–52 | Hooks, revision/cache, useSyncExternalStore |
| apps/desktop/src/data/tables.ts; tables.test.ts | 1–68; 1–42 | Lazy cache, sort tên tiếng Việt, cache theo revision |
| apps/desktop/src/data/today.ts; today.test.ts | 1–58; 1–81 | Nửa đêm, DST, wake/focus, identity, unsubscribe |
| apps/desktop/src/data/demo-snapshot.ts; demo-snapshot.test.ts | 1–45; 1–46 | Fetch/header SQLite, thiếu file/fallback, build/close snapshot |

Cấu hình đọc toàn bộ: Cargo.toml (1–32), tauri.conf.json (1–31), capabilities/default.json (1–7). Cargo.lock (1–4655) được phân tích toàn bộ 445 entry, nguồn/checksum/dependency và kiểm cargo tree; không coi các crate đa nền tảng chưa được build là bloat của exe Windows. 5 icon được kiểm bytes, SHA-256 và kích thước PNG trong bloat-audit.json.

Nguồn đúng đã đối chiếu: CLAUDE.md gốc + apps/desktop/CLAUDE.md; CONTEXT.md; ADR-0016; ADR-0009 D-1; spec Phase 6 §4.1/4.2/5; docs/metrics/phase-6.md. common/prompt-codex.md, plan.md §1/3/4/5/6/10, known.md K1–K17/OPEN/ACCEPTED, baseline.md và perf/perf-ref.json.

Điểm nối đọc thêm (đoạn phục vụ hợp đồng, không nhận là đã review trọn gói khác): packages/db/src/database.ts toàn bộ; migrations.ts toàn bộ; ai-analyses.ts (rawOutput); packages/ai/src/run.ts (lưu rawOutput); src/data/ai-analysis.ts (generation/replacing); main.tsx toàn bộ; shell/close-guard.ts và CloseGuard.tsx toàn bộ; routes/SettingsBackup.tsx (readFile/ImportDialog); e2e/perf/README.md toàn bộ; tools/load-data.mjs và codemap.mjs (cách loader / chế độ --check).

## 3. Phát hiện

### CX-B1 — lọt tổ hợp JSON escape và URL-encode của key

ID: CX-B1
Mức: Low
Trục: S
Vị trí: apps/desktop/src-tauri/src/ai.rs:285 (8855345); dùng bởi reply:254 và mask:300.
Tình trạng: CONFIRMED
Mô tả: Bộ nhận diện key chỉ giải escape một lượt. Tổ hợp JSON escape của ký tự phần trăm trong một key URL-encode không bị chặn / che: nội dung AI được trả về webview; JSON.parse của nội dung lấy lại toàn bộ key ở dạng URL-encode.
Tái hiện / bằng chứng: cargo test --manifest-path C:\workspace\deep-review-1-6\codex\B\rust-probe\Cargo.toml --offline --target-dir apps/desktop/src-tauri/target -- --nocapture → 92 passed; dòng PROBE composed key encoding xác nhận URL-encode trực tiếp bị từ chối, còn dạng thay mỗi % bằng \u0025 được reply(200) chấp nhận. Probe cũng xác nhận reply(401).message giữ nguyên tổ hợp này. Toàn bộ dùng key giả sk-review-fake-key-9Az, không truy cập key thật / dịch vụ AI.
Ảnh hưởng: Cần server bất thường trả lại key với hai lớp biểu diễn; không phải lộ key trong thao tác bình thường. Vi phạm bảo vệ K8 / ADR-0009 D-1 ở tổ hợp escape, có thể đưa dạng key phục hồi được vào webview/raw output. Không nâng mức chỉ vì trục an toàn.
Đề xuất: So sánh trên các biến thể decode có giới hạn, gồm JSON→percent và percent→JSON, đồng thời giữ ánh xạ span khi che lỗi; thêm test không chặn nhầm backslash JSON hợp lệ. Ước ≤ 150 dòng SP, giữ bộ test key/JSON/URL hiện có và test tổ hợp mới.

Trích log thật:

```text
PROBE composed key encoding: direct percent encoding rejected; JSON-escaped percent encoding accepted; parsed note equals whole percent-encoded fake key; error message retains same encoding
test result: ok. 92 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

### CX-B2 — test opening tự migration che lần ghi bytes cũ cuối cùng

ID: CX-B2
Mức: Low
Trục: T
Vị trí: apps/desktop/src/data/app-data.test.ts:774 (8855345); app-data.ts:302.
Tình trạng: CONFIRMED
Mô tả: Test cửa sổ opening chỉ kiểm snapshot đầu khác bytes cũ rồi mở lại mọi snapshot bằng openDatabase (tự migration). Nó bỏ sót việc openFrom xếp bytes trước migration vào cuối hàng đợi, ghi đè snapshot đã migration.
Tái hiện / bằng chứng: node C:\workspace\deep-review-1-6\codex\B\node-probe.mjs → exit 0; preview thay bằng file schema 8 thật (159.744 byte), importBackup + flush: memorySchema=9 nhưng storedSchema=8 (đọc bằng sql.js trực tiếp, không tự migration). 96 unit test gói B vẫn pass, gồm test opening nói trên. Hai lần probe sửa lỗi harness được lưu riêng: đọc schema 8 qua openDatabase(migrations:[]) bị SCHEMA_TOO_NEW; đường sql.js đầu không đúng workspace pnpm; kết quả xác nhận chỉ lấy lần exit 0.
Ảnh hưởng: Hiện UI luôn đi qua readBackup (bytes đã ở schema 9), snapshot chỉ dùng web, nên chưa thấy đường thao tác bình thường lưu nhầm schema. Đây là test giả xanh / nhánh dự phòng nhận bytes cũ; không kết luận mất dữ liệu hoặc nâng mức. Với seam đó, đóng app không có save pending nhưng file vẫn trước migration; mở lại phải migration lần nữa.
Đề xuất: Test kiểm schema / trigger trực tiếp trên bytes cuối bằng sql.js và giữ ít nhất một fixture schema 8 có dữ liệu; openFrom lưu db.export() sau open hoặc tránh lưu bytes cũ nếu migration đã xếp snapshot. Ước ≤ 20 dòng SP + ≤ 60 dòng test; giữ các test startup, ordering save/backup và opening.

Trích kết quả thật:

```json
{"scenario":"openFrom receives pre-migration bytes","memorySchema":9,"storedSchema":8,"expectedSchema":9,"storedByteCount":159744}
```

Hai phát hiện đều mới so với common/known.md; không gắn KNOWN. Không có phát hiện Critical/High/Medium trong phạm vi đã thử.

## 4. Bloat

| Đã chạy / đọc | Dữ liệu/phạm vi | Số / kết quả | ID |
|---|---|---|---|
| pnpm exec tsc -p apps/desktop --noUnusedLocals --noUnusedParameters --noEmit | Desktop và import package | exit 0; không đổi cấu hình | — |
| pnpm codemap --check | Bản đồ export/route | exit 0, Export maps are up to date; dùng --check để không ghi CLAUDE.md | — |
| rg từng tên export + phân tích AST (bloat-audit.mjs) | 7 module TS/TSX gói B, tìm cả app/packages/e2e/tools | 33 export; 4 tên không xuất hiện ở file khác đều là type dùng nội bộ: LastSave/OpenAppDataOptions/DayWatcher/WakeEvents; không có chi phí runtime để báo lỗi bloat | — |
| pnpm lint:deps | 309 module / 1.244 dependency | exit 0, no dependency violations | — |
| Cargo.lock + cargo tree --locked --offline --edges normal | 445 package entry kể cả nền tảng khác; 7 dependency trực tiếp tính cả tauri-build | Mọi registry entry có checksum; chỉ nguồn crates.io; từng dependency trực tiếp có nơi dùng | — |
| Đọc code lặp ≥ 3 nơi trong B | adapter/queue/cache/file helpers | Chưa thấy khối lặp mới cần refactor; random ID giống ai đã có trong KNOWN, chưa có bằng chứng mới | — |
| pnpm build:web + gzipSync đo file thật | Bundle ở SHA ghim | exit 0; 2.364.283 byte thô / 697.071 byte gzip; Δ 0 số nền | — |
| Exe common/exe/project2c.exe | Exe release của baseline | 5.414.400 byte; chỉ đọc metadata, không build/đo lại exe | — |
| cargo clippy … -- -W clippy::pedantic, đúng một lần | lib/tests, --locked --offline | exit 0, 24,75 s; 18 cảnh báo lib, thêm 12 test, 1 build.rs và 1 main.rs; chủ yếu doc/kiểu truyền tham số/cast; không tự sửa, không coi phong cách là phát hiện | — |

Kích thước từng chunk (gzip bằng Node; khớp bảng baseline, khác cách hiển thị gzip của Vite):

| File thật | Thô (byte) | Gzip (byte) | Δ thô so baseline |
|---|---:|---:|---:|
| chart-Zomw1zIK.js | 513.302 | 172.450 | 0 |
| exceljs.min-DgbhWywh.js | 929.569 | 255.572 | 0 |
| index-C1k0Xtz0.css | 28.364 | 6.412 | 0 |
| index-DvfluxND.js | 891.942 | 262.010 | 0 |
| rolldown-runtime-Dd_uD5pT.js | 1.106 | 627 | 0 |
| **Tổng** | **2.364.283** | **697.071** | **0** |

Cảnh báo chunk > 600 kB là hiện trạng số nền (index/exceljs), chưa có bằng chứng bloat mới riêng của gói B. Không đề xuất refactor bloat mới; 4 export type có chi phí runtime 0, không tạo task dọn chỉ để giảm số dòng. Bloat JSON chứa danh sách file tham chiếu cho từng export, không chỉ đếm từ trong module.

## 4b. Hiệu năng

Dữ liệu chuẩn common/load/load-2026-10-12-seed6.p2cbackup được nạp qua importBackup của @p2c/db: 16.034.641 byte JSON; 13.455.360 byte SQLite. Tổng bản ghi có xóa mềm: 1.496 KH, 10.414 lịch hẹn, 54 nhân sự, 103 phân tích AI (baseline); số còn dùng sau import: 4 team, 51 người, 1.481 KH, 10.252 lịch hẹn, 1.674 HĐ. Không nhầm số sống với tổng có Thùng rác.

Máy D13_THINKPAD; Node measurements và Rust I/O chạy nối tiếp sau khi build/test của chính phiên này kết thúc. Không có job nặng riêng của phiên chạy song song lúc đo; hoạt động của reviewer khác/tiến trình nền không xác định. Hai lần Node có nhiễu: lần đầu read/export/all-tables ≈ 878,75/228,12/85,16 ms; lần sau ≈ 1179,79/346,13/138,15 ms. Bảng lấy lần cuối được lưu đầy đủ ở node-probe.json, không suy ra hồi quy từ chênh lệch đó.

| Đã chạy / đo | Dữ liệu | Lần | Trung vị (min–max) | So ngưỡng/tham chiếu | ID |
|---|---|---:|---|---|---|
| readBackup-load | Dữ liệu tải chuẩn; storage RAM | 5 | 1.179,79 (895,109–1.444,209) ms | Giai đoạn Node; không phải thời gian UI/IPC | — |
| importBackup-load-memory-storage | Dữ liệu tải chuẩn; storage RAM | 5 | 16,693 (15,949–22,971) ms | Giai đoạn Node; không phải thời gian UI/IPC | — |
| exportBackup-load-memory-storage | Dữ liệu tải chuẩn; storage RAM | 5 | 346,134 (292,905–370,179) ms | Giai đoạn Node; không phải thời gian UI/IPC | — |
| all tables cold | Dữ liệu tải chuẩn; storage RAM | 5 | 138,154 (113,64–147,638) ms | Giai đoạn Node; không phải thời gian UI/IPC | — |
| all tables cached | Dữ liệu tải chuẩn; storage RAM | 100 | 0,003 (0,003–0,097) ms | Giai đoạn Node; không phải thời gian UI/IPC | — |
| Rust save+sync+rename | load.sqlite chuẩn, 13.455.360 byte | 5 | 10,256 (8,770–13,039) ms | Component I/O; chưa gồm export SQLite/IPC/UI | — |
| Rust backup dedup | Cùng file; lần đầu copy, 4 lần tìm copy giống | 5 | 8,822 (8,010–13,943) ms | Chỉ phần Rust; không đồng nhất backup.export | — |
| db.save, exe tham chiếu common/perf/perf-ref.json | Cùng máy/exe/dữ liệu, lượt chuẩn bị | 15 | 160,4 (156,4–192,9) ms | ≤ 400 ms: đạt; đây là số tham chiếu, không phải đo mới | — |
| backup.read, exe tham chiếu | Cùng máy/exe/dữ liệu | 5 | 886,1 (841–897,8) ms | ≤ 2.000 ms: đạt; tham chiếu | — |
| backup.import, exe tham chiếu | Cùng máy/exe/dữ liệu | 5 | 51,1 (37,9–54,6) ms | ≤ 500 ms: đạt; tham chiếu | — |
| backup.export, exe tham chiếu | Cùng máy/exe/dữ liệu | 5 | 483,8 (465,7–486,7) ms | ≤ 1.000 ms: đạt; tham chiếu | — |

Không có phát hiện P mới. Không đối chiếu thời gian stage Node/storage RAM trực tiếp với ngưỡng màn < 200 ms. Không đo lại exe vì plan.md §6 cho phép dùng lượt chuẩn bị; không mở exe/debugger, không chiếm cổng 9222/4173 hay chạy probe song song bên khác. Chưa thử mất điện cấp hệ điều hành/ổ đĩa thật.

## 5. Đếm mức × trục

Mỗi phát hiện đếm vào trục chính duy nhất; CX-B2 có nhánh C/D nhưng tính vào T.

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Tổng** | **0** | **0** | **0** | **0** | **1** | **0** | **0** | **1** | **0** | **2** |

CONFIRMED 2/2; PLAUSIBLE 0/2 (0 %); KNOWN 0 phát hiện mới. Không có tỉ lệ PLAUSIBLE cao; các hạn chế phép thử được nói rõ, không biến phần chưa đo thành kết luận chắc chắn.

## 6. Đã xét, không thấy

| Trục | Đã xét bằng đọc/chạy gì; kết luận có giới hạn |
|---|---|
| E | Đã xét, không thấy lỗi mới ở queue/retry/coalesce, Unicode/tên export, ngày/DST, lock/reload/crash residue. 96 test JS + 91 test Rust; probe 3 replace với first backup failure trả rejected/fulfilled/fulfilled, generation=2, ghi tiếp rồi mở lại giữ cả Seed và After failure and queue. |
| C | Đã xét S2-1…S2-6/ADR-0016/ADR-0009 D-1, read/import UI, command/raw-header contract, closeAfterSaving; không thấy sai hợp đồng mới trên đường UI bình thường. Nhánh trước migration/test được ghi riêng CX-B2. |
| D | Đã xét, không thấy lỗi mất dữ liệu mới trong những đường đã chạy: failed write giữ snapshot để flush, migrate-before-startup-backup gate, rename lỗi giữ file cũ byte-for-byte, second process lock, startup file rỗng/hỏng/tương lai, backup dedup/prune. Trường hợp backup prune trước copy là có chủ ý và đã có test; đọc known, không nâng lại thành lỗi mới. |
| G | Đã xét phần B: một request Rust tại một thời điểm, missing key/network không fallback Mock, reply size/gzip/roles/token/timeouts; test dùng mock/local HTTP. Guardrail nội dung V1–V7 thuộc C, chưa tuyên bố audit toàn validator trong B. Không thấy lỗi G mới. |
| S | Có CX-B1. Ngoài nó, đã xét và chưa thấy lỗi mới ở CSP connect-src cố định, capability một cửa sổ, data_dir cạnh exe, filename/folder whitelist, explorer full path, TLS/no redirect, key Local/no-read-command/error sanitization; đã chạy các test Rust tương ứng. Không đọc key thật. |
| P | Đã xét, không thấy phát hiện P mới theo số đo và giới hạn tại §4b; reference exe đạt ngưỡng đã chốt. |
| B | Đã xét, không thấy bloat mới có chi phí/đường dùng đủ để đề xuất refactor; có tsc, rg, codemap, dependency/tree, bundle, icon metadata tại §4. |
| T | Có CX-B2. Test lỗi/timing/atomic/stale đã đọc hết; mutation STALE_PAGE bị giết. Mutation bỏ sync_all sống (50/50 storage test): test hiện kiểm bytes/file/concurrency, chưa chứng minh durability tới ổ đĩa. Đây là giới hạn test bổ sung; không nói code hiện tại bỏ sync hay phát hiện mất dữ liệu. |
| A | Đã xét, không thấy lỗi A mới riêng của lớp B: message DATA_REPLACING được unit test khớp i18n nguyên văn, tên/ngày qua helper domain, watchToday midnight/focus/identity/unsubscribe có test; đọc điểm nối Dialog/close guard. Không review toàn bộ focus/contrast/mockup của gói D/E. |

Đã đối chiếu KNOWN cho backup folder unreadable, listener ném lỗi, Tables giữ qua await/replace, close khi seed đang chạy, PerformanceMeasure tích lũy và random ID lặp. Chưa có bằng chứng mới nên không tạo lại các phát hiện này.

## 7. Phụ lục nguồn probe, kiểm tra và trạng thái cuối

Thư mục nguồn: C:\workspace\deep-review-1-6\codex\B\. Không file sản phẩm nào bị patch, không commit/Issue/PR/merge, không gọi AI của sản phẩm hay mở ChatGPT web.

| Nguồn/lệnh | Kết quả/bằng chứng |
|---|---|
| unit.log — pnpm exec vitest run (7 test file dữ liệu B nêu §2) | exit 0; 7 passed / 96 passed; 2,21 s |
| rust-test.log — cargo test --manifest-path apps/desktop/src-tauri/Cargo.toml --lib --locked --offline | exit 0; 91 passed / 0 failed; test body 1,52 s |
| clippy.log — cargo clippy --manifest-path apps/desktop/src-tauri/Cargo.toml --lib --tests --locked --offline -- -W clippy::pedantic | Một lần; exit 0; cảnh báo phân loại tại §4 |
| unused.log; deps.log; codemap.log; build.log; cargo-tree.log | tsc/deps/codemap/build/tree exit 0; không chạy codemap ở chế độ ghi |
| loader.mjs; node-probe.mjs; node-probe.json; node-probe.log | Import code gốc với loader raw migrations/TS; queue ba lần thay, schema 8, bộ tải, timings; exit 0 |
| node-probe-schema8-repair.log; node-probe-module-repair.log | Lỗi harness trước lần xác nhận: SCHEMA_TOO_NEW khi dùng openDatabase để kiểm không migration; module path pnpm. Đã sửa script ngoài repo, không tính là lỗi sản phẩm |
| load.sqlite | Bản SQLite xuất từ dữ liệu tải để Rust I/O đọc; 13.455.360 byte |
| rust-probe/Cargo.toml, lib.rs, ai.rs, storage.rs, storage-baseline.rs | Bản chép nguyên module gốc cộng probe key giả/I/O, dependency đúng phiên bản có sẵn; Cargo --offline, không cài crate mới |
| rust-probe.log | 92 passed: 91 test gốc + 1 probe key tổ hợp; nội dung PROBE ở §3 |
| rust-io.log; rust-io-* | 1 test I/O pass; thư mục dữ liệu riêng được giữ làm bằng chứng, số ở §4b |
| rust-probe/storage-no-sync-mutant.rs; mutation-no-sync.log | Bỏ sync_all trên bản chép: **SỐNG**, exit 0 / 50 passed |
| rust-probe/storage-no-stale-mutant.rs; mutation-no-stale.log | Bỏ chặn stale page trên bản chép: **BỊ GIẾT**, exit 101 / 49 pass + 1 fail: a_save_from_the_page_before_a_reload_is_refused_once_the_new_page_opened, unwrap_err nhận Ok(()) |
| bloat-audit.mjs/.json/.log; bloat-audit-url-repair.log | 33 export/consumer files, 445 lock entry, chunk gzip/icon hash/exe metadata; final exit 0. Lỗi URL Windows lúc đầu chỉ của harness |
| session-progress.md | Bản sao báo cáo đang làm trước khi sắp lại đúng thứ tự; giữ phát hiện và số đo đã ghi dần |

Bản chép storage.rs đã phục hồi từ storage-baseline.rs sau hai mutation. Test/compile chỉ tạo cache/build bị ignore trong repo; mọi probe/log/DB thử nằm trong B. Không chạy pnpm e2e vì cổng baseline đã có, không dùng PW_REUSE=1. Không chạy lại whole verify/coverage vì baseline common đã có và kiểm bổ sung thích hợp đã pass.

- git rev-parse HEAD cuối phiên: 885534549808f42aec7f9af5743bbf86642ee4bd.
- git status --short cuối phiên: rỗng; giống đầu phiên.
- git diff --stat cuối phiên: rỗng.
- Hoàn tất: 2026-10-14 10:42:19 (Asia/Saigon).
