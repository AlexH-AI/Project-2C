XONG — codex gói B lượt 3, 2026-10-20 01:40:17 +07:00

# Deep review Phase 1–6, lượt 3 — Codex, gói B: File và Rust

## 1. Thông tin phiên

- Bên: Codex; gói B; phiên mới, không subagent.
- Worktree: C:\workspace\Project-2C-review-2; detached HEAD **119e2e45cbce54d8a3943757bd826a7f1e9b694f**, đúng SHA ghim.
- Git status đầu phiên: `?? .agents/`, `?? .codex/`, `?? AGENTS.md` (giữ nguyên như baseline).
- Bắt đầu theo đồng hồ host: **2026-10-20T01:19:13+07:00**. Máy **DESKTOP-KDURKJP**; Node v24.20.0; công cụ PowerShell, Node, Rust/cargo, Vitest 5.0.1, Playwright/CDP, sql.js và dependency có sẵn của repo.
- Model: GPT-6 (Codex). Runtime không cung cấp định danh biến thể, mức suy luận hoặc build app của phiên; không tự suy đoán hay đổi model/effort.
- Bước 0: B.md chưa tồn tại; A.md có dòng đầu XONG (chỉ đọc dòng đầu để kiểm cổng). Không đọc nội dung báo cáo A hoặc báo cáo lượt 3 của bên khác.
- Chỉ đọc repo, không gh, không nghi thức phiên/skill phát triển, không Issue/PR/merge/commit, không viết code sản phẩm. Probe/log/bản chép nằm trong thư mục B của chính Codex; cache Rust bị ignore có thêm artefact test. Không cài công cụ hoặc dependency.
- Kết quả: **6/6 dòng R ĐÃ SỬA trong phần B kiểm; 0 phát hiện mới được xác nhận hoặc để PLAUSIBLE.** Đây là kết quả phạm vi B, không thay kết luận xuyên gói/v1.0 của F.

## 2. Bảng R

ĐÃ SỬA áp đường lỗi và phần giao cho gói B. Những giới hạn đã có trong KNOWN vẫn giữ nguyên, không đưa thành phát hiện mới.

| DR6 | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| 73 | #656 → #674 (`c5a40e1`) | **ĐÃ SỬA** | Control TS 130/130. Đổi kiểm tại app về quick_check làm riêng test chỉ mục DR6-73 đỏ: 1 failed, 71 passed (R73-quick.log). Tái hiện trên file tải 14.069.760 B: quick_check = ok, integrity_check = row 2 missing from index teams_active_name (index-damage.json). Exe từ chối bằng màn File dữ liệu bị hỏng, không backup, hash file không đổi (E-index). | Dùng file lớn thật và chỉ lật một byte trong khóa chỉ mục. Kiểm sau migration là KNOWN (#620); migration 0011 chỉ đổi trigger, không dựng lại bảng/index nên không mở rộng rủi ro đã biết đó. |
| 74 | #656 → #674 | **ĐÃ SỬA** | Rust control 104/104. Bỏ readonly → test open_reports_a_read_only_database_file_as_access_denied đỏ (R74-readonly.log). Exe với attrib +R từ chối: App không có quyền ghi vào thư mục dữ liệu; không backup, hash nguyên (E-readonly). | Biến thể file bị giữ vẫn báo FILE_IN_USE trên exe (E-held), không bị gộp nhầm vào file hỏng. Test Rust còn kiểm gỡ chỉ đọc rồi mở lại được. |
| 75 | #656 → #674 | **ĐÃ SỬA** | Các câu startup đều qua startup-error.test.ts (17 ca trong control). Gỡ chữ đóng cửa sổ này ở openFailedHelp → 2 test đỏ (R75-help.log). Exe readonly/index/held đều hiện hướng dẫn đóng cửa sổ này trước khi mở lại (exe-results.json). | Đã đọc cả ALREADY_OPEN (đóng cả hai), DISK_FULL, backup lỗi, schema mới hơn; không thêm nút hay đổi G3. |
| 76 | #657 → #680 (`217cef6`) | **ĐÃ SỬA** | Control Rust chạy bộ chung 16.099 ca chặn/che + 6 ca hợp lệ, fingerprint 0x834ac61c. Bỏ lượt đọc 2 → test tổ hợp đỏ. Bỏ đọc nguyên văn hoặc 1 lượt → toàn bộ test Rust lần lượt 2/1 test đỏ (mutations-extra.json). Probe riêng thêm 4.020 lượt chia từng ký tự với 0–2 lớp, secret dài 1/2/3/23/512 ký tự, Unicode và lặp hai lần: chặn + che hết; biên cắt 200, mẩu key và ba lớp đúng hợp đồng (key-probe.log). | Hai đột biến nguyên văn/1 lượt sống khi chỉ chạy bộ tổ hợp thông thường; khi chạy toàn bộ Rust đều bị giết bởi ca ODD_KEY. Không ghi nhầm thành test hở. Secret tự chứa phần escape là KNOWN common/known.md:165, không phải finding của lượt này. Ba lớp ngoài mô hình đe dọa theo D-1. |
| 84 | #662 → #707/#709/#710 (`b4aebfa`, `29aca69`, `6526793`) | **ĐÃ SỬA — phần B** | Test AppData mới D2/D3/D7–D10 và S2-1/S2-2 xanh. Gỡ backup, khóa ghi, hoặc làm generation tăng khi dọn đều đỏ (R84-*.log). N1–N8 qua app/data xác nhận thứ tự, phục hồi hàng đợi sau lỗi, VACUUM lỗi và AI; N10–N12 kiểm crash/file/backup trên dữ liệu tải. Exe dọn thật: tên backup trong 11j trỏ đúng file nguyên bản; file lưu sau dọn 13.410.304 B, mở/xuất/nhập lại được. | Owner chọn đường dọn tay để xử lý tăng trưởng Thùng rác, không phải yêu cầu bỏ mọi chi phí tuyến tính của listTrash. Giữ nguyên live tables và generation; không kết luận thay phần lệnh A, màn E hoặc số đo F. |
| 88 | #656 → #674 | **ĐÃ SỬA** | G07d bỏ mapping tạo thư mục → test đỏ. Bỏ Drop → test mới đỏ. Cả 3 cấu hình về 0.1.0 → test version đỏ. Giảm MAX_MODEL_CHARS = 8 / bỏ dấu chấm trong Rust → test AI_MODELS contract đỏ (mutations.json). Control giữ version 1.0.0. | J5 được Owner chấp nhận K29: comment app-data.ts nay nói đúng subscriber biết DB mới trước close, không hứa test giữ nhịp setTimeout. Không mở lại mục đã ACCEPTED. |

## 3. Phạm vi đã đọc

Đọc sâu các file nguồn/test của B, gồm cả khối test Rust. Số dòng vật lý và sha256 ở scope.json; tổng **2.207 dòng SP / 4.810 dòng test, 19 file** khớp baseline.

| File (so với gốc repo) | Dòng |
|---|---:|
| apps/desktop/src-tauri/build.rs | 1–3 |
| apps/desktop/src-tauri/src/ai.rs | 1–2016 |
| apps/desktop/src-tauri/src/lib.rs | 1–205 |
| apps/desktop/src-tauri/src/main.rs | 1–6 |
| apps/desktop/src-tauri/src/storage.rs | 1–1722 |
| apps/desktop/src/data/AppDataContext.tsx | 1–52 |
| apps/desktop/src/data/app-data.test.ts | 1–1418 |
| apps/desktop/src/data/app-data.ts | 1–511 |
| apps/desktop/src/data/demo-snapshot.test.ts | 1–46 |
| apps/desktop/src/data/demo-snapshot.ts | 1–45 |
| apps/desktop/src/data/persist-queue.test.ts | 1–185 |
| apps/desktop/src/data/persist-queue.ts | 1–79 |
| apps/desktop/src/data/tables.test.ts | 1–43 |
| apps/desktop/src/data/tables.ts | 1–68 |
| apps/desktop/src/data/tauri-contract.test.ts | 1–333 |
| apps/desktop/src/data/tauri-storage.test.ts | 1–75 |
| apps/desktop/src/data/tauri-storage.ts | 1–71 |
| apps/desktop/src/data/today.test.ts | 1–81 |
| apps/desktop/src/data/today.ts | 1–58 |

Cấu hình đọc: Cargo.toml, tauri.conf.json, capabilities/default.json, package.json desktop; build.rs/main.rs ở bảng trên. Cargo.lock phân tích 445 package, 444 registry entry đều có checksum; cargo tree --locked --offline --edges normal thành công. Năm icon kiểm kích thước/hash/PNG dimensions (bloat-audit.json), không nhận là đã review mỹ thuật.

Diff đọc kỹ: **4217ed4..119e2e4**, toàn bộ 6 file đổi trong src-tauri/data (gồm ai-analysis.test.ts ở điểm nối C); riêng sản phẩm B là storage.rs, ai.rs, app-data.ts; test sửa app-data.test.ts và tauri-contract.test.ts. Đối chiếu commit #674/#680/#710, mô tả Issue/PR và phần lệch/chưa làm ở common/fixes.md.

Nguồn đúng: CLAUDE.md gốc và apps/desktop/CLAUDE.md; CONTEXT.md; ADR-0016; ADR-0009 D-1/W-1; Phase 6 §4.1 S2-1…S2-6, §4.2 TR-11…TR-13/D1…D13 và §5; docs/metrics/phase-6.md, e2e/perf/README.md. Common: prompt-codex.md, plan.md phần trục/mức và L3.1–L3.11 liên quan, known.md, fixes.md #656/#657/#662, baseline.md. Đọc tổng hợp 15/10 + 17/10 và phần mô tả/kịch bản/phát hiện của raw B lượt 1 (các bên, hai máy) / lượt 2 (Codex, Claude) trong repo để tránh lặp lỗi cũ. Không truy cập kết quả ngoài repo của bên khác.

Điểm nối đã đọc: database.ts (migrate/commit/export/cache/integrity), purge.ts, migration 0011 và luật TR; ai-analysis.ts/test phần generation/replacing/save/Mock; StartupError.tsx, startup-error.ts/test, i18n startup; SettingsTrash.tsx/Settings.tsx phần gọi dọn, route và thông báo; helpers size-report-core/ts-hooks. Không nhận là review trọn C/D/E/F.

## 4. Kịch bản mới đã thử

Các ca dọn là đường mới của lượt 3, không chỉ chạy lại kịch bản Nạp lại/Nhập backup cũ. Tái hiện cũ DR6-73…76/88 được giữ ở bảng R.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| N1 | Giữ một lần lưu; ghi thêm team → gọi 2 lần dọn nối nhau; thử ghi và xuất trong lúc chờ | Ghi bị DATA_REPLACING ngay; xuất có cả dữ liệu trước dọn; 2 lượt xóa KH = [1,0]; mỗi lượt backup đúng lúc, backup đầu có cả thay đổi đang chờ; live tables nguyên. node-results.json. | — |
| N2 | Lần lưu đang chạy chỉ thất bại sau khi đã gọi dọn → flush phục hồi → dọn lại | Lượt đầu RELOAD_UNSAVED_CHANGES, không backup/không xóa; lượt sau xóa 1 KH, backup có team vừa lưu lại. | — |
| N3 | Hai lượt dọn cùng hàng đợi, backup lượt đầu lỗi | rejected/fulfilled; lượt sau dọn xong; không kẹt khóa, chỉ có một backup thành công. | — |
| N4 | Sau transaction, giả lập riêng VACUUM ném lỗi → dọn lại lần nữa | Lượt đầu báo thành công theo TR-11, file đã lưu hết dòng cần dọn; live tables nguyên; lượt hai xóa 0, integrity sạch. Không diễn giải VACUUM lỗi thành rollback. | — |
| N5 | Mock analysis của KH sống đang chờ; câu trả lời hợp lệ tới trong khi backup của dọn bị giữ | discarded, 0 reportError; generation = 0. | — |
| N6 | Cũng analysis đó, câu trả lời tới sau khi dọn đã xong | saved/ACCEPTED; generation vẫn 0. | — |
| N7 | Analysis chờ → xóa mềm chính KH đó → dọn → trả lời | discarded; không ghi lại KH/dữ liệu đã dọn; 0 reportError. | — |
| N8 | Lỗi AI_TIMEOUT tới trong lúc backup của dọn bị giữ | discarded; 0 reportError; hàng đợi vẫn dọn xong. Chỉ dùng adapter giả. | — |
| N9 | Secret giả ngắn tới 1 ký tự và dài 512, từng ký tự chọn 8 cách 0–2 lớp theo seed cố định, tiền tố Đức🙂, lặp hai lần; thêm lớp thứ 3 / mẩu key / biên cắt | 4.020 lượt đều chặn/che; ba lớp được nhận theo threat model; mẩu key giữ nguyên; che cả key trước khi cắt thông điệp 200 ký tự. 2 test riêng xanh. | — |
| N10 | Kill tiến trình Node chạy AppData.purgeTrash ở backup, bắt đầu VACUUM thật, sau ghi tmp trước rename; 3 lần mỗi điểm | 9/9 mở lại qua openAppData; integrity sạch, đều file cũ đầy đủ 113 dòng rác; backup đã có thì đúng original. Tmp tồn tại chỉ ở 3 ca trước rename. crash-results.json. | — |
| N11 | Exe thật: bấm Backup rồi dọn sạch, kill ở 0/25/100/300/1.000 ms sau click đã trả về | 5/5 SQLite nguyên: 4 ca file cũ 14.069.760 B/113 dòng rác, ca 1.000 ms file mới 13.410.304 B/0 dòng; mỗi backup trùng byte original. Không suy thời điểm này thành câu SQL chính xác. | — |
| N12 | Dọn thật trên exe, mở lại file đã lưu và **đúng file backup được nêu trong 11j** qua openAppData; xuất → readBackup → importBackup → flush | File sau dọn 0 rác, backup 113 rác; cả hai integrity sạch, live counts giống nhau: 4 team/51 người/1.481 KH/10.255 lịch/1.674 HĐ; tables không đổi sau khứ hồi. | — |

## 5. Phát hiện mới

**Không có phát hiện mới CONFIRMED/PLAUSIBLE trong phạm vi B và các ca đã chạy.** Không tạo ID CX3-B chỉ để ghi lại các dòng R đã sửa hoặc KNOWN.

Giới hạn đã biết được giữ nguyên: kiểm integrity sau migration (#620); secret có escape của riêng nó (common/known.md:165); chi phí đọc lại lượt giải mã (166); PerformanceMeasure tích lũy; openFrom export thêm một lần; DR6-66/67 bloat đã hoãn; J5 ACCEPTED K29. Không có bằng chứng mới đủ đổi mức hoặc mở lại chúng. Cổng/spec mới của #710 đã nêu rõ VACUUM lỗi sau commit vẫn báo đã dọn; N4 khớp quyết định đó.

## 6. Bloat

| Đã chạy / đọc | Dữ liệu / phạm vi | Số / kết quả | ID |
|---|---|---|---|
| tsc -p apps/desktop --noUnusedLocals --noUnusedParameters --noEmit | Desktop + package import | exit 0, không sửa cấu hình | — |
| node tools/codemap.mjs --check | Bản đồ route/export | exit 0, Export maps are up to date | — |
| dependency-cruiser CLI đã ghim | apps/packages | exit 0, 320 modules / 1.312 dependencies, không vi phạm | — |
| classifyFile/lineReport và scope hash | Toàn bộ B | 19 file, 2.207 SP/4.810 test; mọi hash nguyên cuối phiên | — |
| Cargo tree --locked --offline --edges normal; Cargo.lock | Rust/config | exit 0; 445 entry, 444 registry entry có checksum; không thêm dependency trong diff lượt 2→3 của B | — |
| Đọc nhánh/hàm trừu tượng/callsite của phần sửa | inTurn/backUp/purge, readings/unescape, open_with | inTurn dùng chung Nạp lại/Nhập/Dọn; open_with là seam; lượt giải mã 0/1/2 đều bị test giết khi bỏ. Chưa có abstraction thừa mới đủ căn cứ báo | — |
| Baseline bundle (dùng lại kết quả chuẩn bị, không build lại) | Toàn bundle SHA ghim | 2.400.393 B thô / 706.754 B gzip; +18.357/+4.645 so lượt 2; phần lớn thay đổi xuyên gói, không quy toàn bộ cho B | — |
| Đọc exe chuẩn bị và hash, icon | common/exe/project2c.exe | 5.408.768 B; sha256 E93C8BAA2BACA8EEC30B230EE7375888E109CB28EF6A202BE42D662D4F720CE1; icon tổng 45.333 B | — |

Không đề xuất refactor bloat mới. Các khối lặp/một số export cũ đã có trong KNOWN, không có chi phí mới đủ để mở lại. Không coi thư viện đa nền tảng trong Cargo.lock là tất cả đều nằm trong exe.

## 6b. Hiệu năng

Máy DESKTOP-KDURKJP. File dữ liệu tải lượt 3 đúng `tables` sha256 **1c0a43fb9d5711df4700cb688a256ac50bb44eed1c0fd00218fa36f0746d003f**, mở bằng importBackup; SQLite 14.069.760 B. 5 lần mỗi cỡ; cỡ lớn xóa thêm 1.200 KH đang dùng qua lệnh trong app.run, thành 1.313 dòng Thùng rác. Node đo qua AppData + storage RAM (có export/persist, không I/O/IPC Rust). Không trộn số Node vào ngưỡng thao tác màn. Khi đo, chính phiên chỉ chạy node-probe, chưa chạy exe/cargo/bloat cùng lúc; hoạt động nền của phiên khác không có telemetry để khẳng định. Số exe chuẩn dùng lại baseline chuẩn bị trên cùng máy, lúc chuẩn bị máy rảnh.

| Đã đo / dữ liệu | 113 dòng: trung vị (min–max), ms | 1.313 dòng: trung vị (min–max), ms | Tham chiếu / đánh giá | ID |
|---|---:|---:|---|---|
| openAppData từ load file, storage RAM | 102.0 (100.3–104.8) | 107.2 (103.5–126.3) | Cột lớn mở trước khi thêm 1.200 KH xóa, cùng file. Không so trực tiếp với exe; tăng so Node lượt 2 ~71 ms phù hợp chi phí integrity đã chấp nhận K24 | — |
| listTrash trước | 28.8 (27.0–31.6) | 150.1 (145.0–157.5) | Baseline common Node 32,6 / 140,7 ms; cùng hướng tuyến tính đã biết | — |
| previewPurge | 6.0 (5.9–6.2) | 10.4 (10.3–12.7) | Baseline 5,6 / 9,9; chưa có ngưỡng riêng | — |
| AppData.purgeTrash, gồm VACUUM | 102.0 (100.5–105.4) | 110.8 (108.7–112.1) | Baseline pure db purge 93,8 / 109,8; cách đo khác phần persist/backup, chỉ tham khảo. Không có số vượt cả 20% và 10 ms | — |
| riêng VACUUM | 66.8 (66.5–69.8) | 3.8 (3.7–4.0) | Baseline 64,4 / 5,0. File lớn còn lại nhỏ nên VACUUM nhanh hơn | — |
| listTrash sau | 8.2 (8.1–8.5) | 1.4 (1.3–1.7) | Baseline 10,8 / 2,1; sau dọn đều 0 dòng | — |
| Cỡ DB trước → sau | 14.069.760 → 13.410.304 B | 14.118.912 → 1.486.848 B | Trùng baseline hai cỡ; live tables nguyên | — |

Số từ **common/baseline.md**, không nhận là số exe mới của phiên này:

| Thao tác trên exe | SHA ghim | Mốc sau #656 | Lượt 2 cùng máy | Ngưỡng / đánh giá | ID |
|---|---:|---:|---:|---|---|
| app.open-data | 373 ms | 387 ms | 301 ms | ≤600 ms; không xấu hơn mốc chính. +72 ms so lượt 2 có chi phí integrity đã chấp nhận, không tự gọi hồi quy | — |
| backup.read | 827 ms | 835 ms | Xem baseline | ≤2.000 ms, đạt | — |
| backup.import | 47 ms | 43 ms | Xem baseline | ≤500 ms, trong nhiễu | — |
| db.save | 146 ms | 151 ms | Xem baseline | ≤400 ms, đạt | — |
| trash.open trước/sau dọn | 38,9 / 9,6 ms | trash.open 34 ms | 73 ms khi còn gắn DevTools, không so trực tiếp | <200 ms | — |
| Bấm Backup rồi dọn → 11j | 151,8 ms | Chưa có | Chưa có | Dọn mới, spec chưa đặt ngưỡng; chỉ ghi số | — |

Không có phát hiện P mới; không đo lại toàn bộ probe exe hoặc build web. Các lần exe riêng của B phục vụ đúng/sai và crash, có CDP, không dùng làm số hiệu năng phát hành.

## 7. Đếm mức × trục

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tổng | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

CONFIRMED 0; PLAUSIBLE 0; không có tỉ lệ PLAUSIBLE cao (không tính 0/0 là một tỷ lệ). Sáu dòng R không đếm lại thành finding. Không khẳng định không còn lỗi ở phần chưa được các probe quan sát.

## 8. Đã xét, không thấy

| Trục | Bằng chứng đã đọc / chạy | Kết quả trong phạm vi |
|---|---|---|
| R | 6 dòng §2, control TS 130 / Rust 104, 14 đột biến logic trên bản chép | Đường sửa cũ hết; test cần thiết đỏ khi gỡ; KNOWN giữ nguyên |
| E | N1–N12; queue/mutex/claim/prune/offset/midnight tests toàn B; readonly/held/index trên exe | Không thấy lỗi mới ở chuỗi purge + lỗi + lệnh chồng, AI hoặc tắt ngang |
| C | ADR-0016, D-1, S2-1…S2-6, TR-11, D3/D7-D10; câu startup và 11i/11j thật | Thứ tự chờ lưu → backup → dọn, khóa ghi, thông báo và ngoại lệ VACUUM khớp |
| D | File/backup hash; 14 kill process; integrity; N12 xuất/read/import/flush; live tables trước/sau | File cũ/mới đầy đủ; không thấy mất dữ liệu đang dùng hoặc backup sai |
| G | Đọc complete/reply/busy/timeouts + cầu app AI; 4 ca Mock ở N5–N8 | Không có AI thật; result/error tới lúc dọn bị bỏ, live result sau dọn lưu đúng. V1–V7/prompt sâu thuộc C |
| S | Rust 104 test local/mock, key-probe, request constraints; CSP/capabilities contract; error bodies/finish_reason; export-name safety | Không thấy key giả lọt trong phạm vi 0–2 lớp của key thường; không đụng Credential Manager thật |
| P | Hai cỡ tải × 5 trong Node; mốc exe cùng máy sau #656 + lượt 2 ở §6b | Không phát hiện vượt ngưỡng mới; giới hạn cách đo ghi rõ |
| B | unused, codemap --check, deps, Cargo tree/lock, diff/callsite và kích thước | Không có bloat mới đủ bằng chứng; mục cũ KNOWN không báo lại |
| T | Control, gỡ từng sửa, bộ tổ hợp và hai kiểm toàn Rust bổ sung | 14/14 đột biến logic bị test giết khi chạy phạm vi thích hợp; không đánh đồng sống bộ con với sống cả bộ |
| A | StartupError.tsx role=alert/h1/help, i18n; contract câu startup; 11i/11j và thông báo thật | Không có phát hiện mới trong lớp file; đánh giá focus/keyboard toàn bộ hộp thuộc D/E |

## 9. Phụ lục: probe, log, đột biến và trạng thái cuối

Đường dẫn dưới đều tương đối với **C:\workspace\deep-review-1-6-r3\codex\B\**. Nguồn script thực thi được lưu đầy đủ, không chỉ ảnh/chữ kết quả.

| Tệp | Nội dung / lệnh chính |
|---|---|
| prepare.mjs; copy/; vitest.config.mts | Bản chép nguồn; alias dependency có sẵn từ worktree, không pnpm install. `node <repo>/node_modules/vitest/vitest.mjs run --config <B>/vitest.config.mts` → 8 files/130 passed |
| control-ts.log; control-rust.log | Control TS và `cargo test --manifest-path <B>/rust/Cargo.toml --offline --target-dir <repo>/apps/desktop/src-tauri/target --lib` → 104 passed. Rust key store là mock; HTTP server chỉ bind 127.0.0.1 |
| mutate.mjs; mutations.json; R*.log/.rs | 14 đột biến logic; tách source từng mutant Rust; khôi phục bản chép trong finally. R73, R74, R75, G07d, Drop, version, model max/dot, backup/lock/generation và lượt giải mã |
| mutate-extra.mjs; mutations-extra.json; R76-no-*-full.log | Bỏ đọc nguyên văn/1 lượt chỉ sống khi chạy bộ tổ hợp riêng, **bị toàn bộ 104 test Rust giết** (2/1 đỏ). Cùng với bỏ đọc 2 lượt, cả ba đường đều được test giữ |
| node-probe.mjs; node-results.json; node-perf.json; node-probe.log | N1–N8 và hai cỡ hiệu năng, mỗi dòng ghi ngay vào báo cáo dần; dữ liệu tải qua importBackup. Script assert live tables, counts, backup/queue/error/AI |
| key-probe.rs; key-probe.log | Hai test thêm trên bản chép ai.rs; 4.020 lượt, 2 passed; không dùng key thật. rust/ai.rs đã trả nguyên bản |
| prepare-exe.mjs; file-helper.rs/.exe; index-damaged.sqlite; index-damage.json | Hỏng một byte chỉ mục trên file tải, quick ok/integrity lỗi; helper giữ file share_mode(0), không đọc secrets |
| exe-probe.mjs; exe-results.json; exe-probe.log | Cổng **9447**, profile riêng trong exe/<ca>/. Readonly/held/index và purge thật; đúng backup nêu trong thông báo, hash trùng original |
| crash-worker.mjs; crash-probe.mjs; crash-results.json; crash/ | Node AppData process, kill backup/VACUUM/save-tmp × 3. Backup/save-tmp có seam giữ 5s để pin điểm kill; VACUUM là lệnh thật, parent kill 5ms sau marker trước khi gọi. Storage port file của harness dùng fs write/rename, không nhận đó là kiểm mất điện hay durability phần cứng |
| exe-crash-probe.mjs; exe-crash-results.json; exe-crash-probe.log | 5 kill trên exe release thật; độ trễ đo sau click trả về, không định vị câu SQL. Đối chiếu số dòng rác 113 hoặc 0, file đủ cũ hoặc mới |
| final-check.mjs; file-reopen-results.json; final-check.log | N12: cả file lưu và named backup mở lại qua openAppData, xuất/read/import/flush giữ tables |
| audit.mjs; bloat-audit.json; audit.log; unused.log; codemap.log; deps.log; cargo-tree.log | Các kiểm bloat, không sửa config/build web |
| scope.json; final-state.json; progress-history.md | Hash 19 file, SHA/status cuối; lưu nguyên báo cáo dần trước khi biên tập báo cáo cuối |

**An toàn probe trình duyệt:** ngay từ spawn exe có host-resolver-rules chặn mọi host mạng ngoài 127.0.0.1 và disable-background-networking; không gọi AI/product key hoặc open_chatgpt. Từ lần nối đầu addInitScript và gán window.open thành hàm giữ chỗ trước thao tác. Route từ chối host ngoài; ipc.localhost/tauri.localhost chỉ là transport/asset nội bộ của Tauri, được cho đi để không phá IPC. Không có request ngoài bị phát sinh trong các ca cuối (externalBlocked=[]). Không chạy pnpm e2e, không chiếm 4173 hoặc 9222.

**Lỗi harness đã loại khỏi bằng chứng:** bộ đếm lỗi giả ban đầu xuống âm (node-probe-initial.log); đọc hash khi helper còn giữ file (exe-probe-initial.log); route chặn nhầm IPC nên không lưu (exe-probe-ipc-blocked.log); monkeypatch invoke không nhận marker (exe-crash-marker-attempt.log); chờ exitCode thay vì signalCode sau kill (exe-crash-signal-attempt.log); gõ nhầm tên CLI dependency-cruiser (deps-cli-initial.log); marker backup từng bật cả lúc khởi động (crash-probe-startup-attempt.log), đã siết chỉ bật sau openAppData và chạy lại đủ 9 ca. Đã sửa bên ngoài repo và chạy ca cuối thành công; không đưa lỗi công cụ tạm thành finding app, không dùng thời gian của lượt lỗi.

**Không làm:** gọi dịch vụ AI thật, đọc/in key thật, mở chatgpt.com, giả lập mất điện/bit flip ổ đĩa vật lý. Chưa kiểm hệ điều hành bị tắt trong fsync; kill process chỉ kiểm tính nguyên tử và thứ tự snapshot, không chứng minh durability trước mất điện.

Git cuối phiên (final-state.json):

```text
119e2e45cbce54d8a3943757bd826a7f1e9b694f
?? .agents/
?? .codex/
?? AGENTS.md
```

19/19 hash file B không đổi; bản chép source và rust/ai.rs được trả về nguyên bản. Không file tracked trong repo thay đổi. Mọi tiến trình project2c của probe đã đóng; file chỉ đọc của probe đã gỡ thuộc tính. Giờ hoàn tất: **2026-10-20 01:40:17 +07:00**.
