XONG — codex gói B lượt 2, 2026-10-17 02:42:20 +07:00

# Deep review Phase 1–6, lượt 2 — Codex, gói B: File và Rust

## 1. Thông tin phiên

- Bên: Codex; gói B; phiên mới, làm toàn bộ trong phiên chính, không subagent.
- SHA đầu phiên: 4217ed4cd3300af1d63aa61db9eb13902fe75f16, đúng SHA ghim; detached HEAD.
- Worktree: C:\workspace\Project-2C-review-2.
- git status --short đầu phiên: ba mục có sẵn như baseline: ?? .agents/; ?? .codex/; ?? AGENTS.md.
- Bắt đầu: 2026-10-17 02:20:43 +07:00. Máy xác nhận bằng hostname: DESKTOP-KDURKJP (Home PC).
- Công cụ: Codex desktop; codex-cli 0.162.1 có trên máy; Node v24.20.0; rustc 1.98.1 (48a229cea 2026-09-01), PowerShell, Vitest 5.0.1, Playwright và dependency đã có. Runtime không cung cấp tên model / mức suy luận của phiên hay số build desktop; không tự suy đoán.
- Bước 0: A.md có dòng đầu XONG; B.md chưa tồn tại. Chỉ kiểm A bằng tên đầy đủ và dòng đầu, không đọc nội dung báo cáo lượt 2 của gói khác.
- Không chạy gh, skill phát triển, nghi thức phiên, commit, PR, Issue hoặc merge. Không đọc thư mục bị cấm hay báo cáo lượt 2 của bên khác.
- Mọi source sản phẩm giữ nguyên. Bản chép / probe / log ở C:\workspace\deep-review-1-6-r2\codex\B\; build cache Rust trong target bị ignore.
- Kết quả phạm vi B: 9 mục R ĐÃ SỬA; DR6-60 SỬA MỘT PHẦN (J5). Bốn phát hiện Low, đều CONFIRMED: một biến thể key phục hồi được và ba khoảng hở test. Chưa xác nhận lỗi mất dữ liệu trên các đường bình thường đã chạy; không đưa kết luận phát hành thay gói F.

## 2. Bảng R

Bằng chứng dưới đây là lệnh / log thực của phiên này; danh sách đầy đủ ở §9. ĐÃ SỬA chỉ áp đường lỗi đã mô tả ở lượt 1; biến thể mới ghi riêng. Các giới hạn đã được sổ KNOWN chấp nhận không bị báo lại.

| DR6 | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| 06 | #595 → #620 | ĐÃ SỬA | Control 104 JS xanh; bỏ chặn damage làm ca “refuses a file damaged inside…” đỏ (R06-quick-check.log). Trên bộ tải lượt 2, phá trang 858, 1717, 2576 → DATA_DAMAGED, không backup/save ở cả ba. | KNOWN: quickCheck chạy sau migrate, có giới hạn schema ≤6 (known.md:121). Không ghi lại thành phát hiện. |
| 07 | #595 → #620 | ĐÃ SỬA | 101 Rust xanh gồm file DB bị giữ, tmp bị giữ, lock chỉ đọc, StorageFull. Bỏ mapping held-db / DISK_FULL đều làm ca tương ứng đỏ (R07-held-db.log, R07-full.log). 16 test startup/SaveWarning/close xanh. | Lỗi lưu khi import rồi flush phục hồi ở N1; lỗi lưu và CloseGuard thực trên exe ở N12. Đĩa đầy dùng seam, không làm đầy ổ thật. |
| 08 | #595 → #620 | ĐÃ SỬA | Trả openFrom về persist(bytes) làm test snapshot cuối đỏ (R08-migrate.log). File v0 có notes ở đường nhập test và ở startup N4 → schema 11, notes còn. | Raw schema được đọc không tự migrate; không lặp sai phép kiểm lượt 1. |
| 09 | #595 → #620 | ĐÃ SỬA | Bỏ dọn backup tmp → 1 storage test đỏ (R09-cleanup.log); ca folder/foreign-name giữ nguyên. Đếm test control trong thư mục riêng: 0 thư mục sót. N8 kiểm tmp bị giữ qua reload / process mới. | Bỏ Drop còn sống 58/58, để lại 53 thư mục trong phép đo riêng → CX2-B2, khoảng hở test mới. |
| 10 | #596 → #617 | ĐÃ SỬA | Hai hướng của tái hiện cũ nay BAD_RESPONSE / che ***. Bỏ riêng Json→URL hoặc URL→Json đều làm “the_key_in_two_layers…” đỏ (R10-json-url.log, R10-url-json.log). Backslash JSON hợp lệ vẫn được nhận. | Trộn hai thứ tự trong cùng key: CX2-B3. Đây là biến thể có từ trước, không gọi là hồi quy do #617. |
| 11 | #596 → #617 | ĐÃ SỬA | Nới 128→129 làm test wrong_arguments đỏ (R11-model.log). N7: ASCII 128 nhận; 129 / emoji / tab / U+200B từ chối; tên Org_1/a.4:free nhận. | Không thấy đường model sai đi tới key hoặc mạng trong ca đã chạy. |
| 12 | #596 → #617 | ĐÃ SỬA | Ba cấu hình app đều 1.0.0; Cargo.lock entry project2c cùng version. PE FileVersion và ProductVersion của exe common đều 1.0.0. Trả một file về 0.1.0 làm test đỏ. | Trả đồng loạt cả ba vẫn 14/14 xanh → CX2-B1. Không nói exe hiện tại sai version. |
| 13 | #596 → #617 | ĐÃ SỬA | Cargo.toml chỉ rlib; trả staticlib/cdylib làm test contract đỏ (R13-crates.log). Test cũ Rust xanh; exe release baseline đã build và probe chạy được, 5.404.672 byte. | Home PC không có số build lượt 1 cùng cache để so 11,5 s. Dùng mốc chuẩn bị 104 s / cargo 97 s và kiểm cấu hình; target/release tại worktree này chưa tồn tại, không suy thành số tiết kiệm target đã đo. |
| 14 | #596 → #617 | ĐÃ SỬA | Trả quyền/CSP cũ làm test contract đỏ (R14-capability.log, R14-csp.log). Exe: 4 lệnh thừa bị ACL từ chối; nhập/xuất/mở folder được; base-uri/form-action bị CSP chặn; đóng sạch và CloseGuard khi chưa lưu đều qua. | Không gọi open_chatgpt thật vì prompt cấm mở chatgpt.com. Test Rust dựng command với Explorer full path + URL hằng, không spawn browser. Mock/S2-3 qua 15 test seam, không gọi dịch vụ thật. |
| 60 | #595/#596/#606 → #620/#617/#644 | SỬA MỘT PHẦN | RS4/R8 tên dấu chấm, RS9 độ dài, sync_all, A14, MJ15 đều bị test giết. J5 thật bỏ setTimeout trước previous.sqlite.close vẫn 104/104 test B xanh (R60-J5-close.log). | CX2-B4. J5 có trong tổng hợp §5.8 / known.md, nhưng fixes.md chỉ giao MJ15 cho phần TS; không thấy quyết định hoãn J5. Không gộp ca phụ byte-size của probe với J5. |

## 3. Phạm vi đã đọc

Đọc sâu toàn bộ 19 file nguồn/test thuộc luật gói B, kể cả phần test Rust, và toàn bộ diff sản phẩm/test liên quan của #617, #620, #644 (đối chiếu git diff 8855345..4217ed4 và nội dung commit). Số dòng vật lý ở SHA ghim, hash từng file ở B/scope.json:

| File | Dòng đã đọc |
|---|---:|
| apps/desktop/src-tauri/build.rs | 1–3 |
| apps/desktop/src-tauri/src/ai.rs | 1–1915 |
| apps/desktop/src-tauri/src/storage.rs | 1–1660 |
| apps/desktop/src-tauri/src/lib.rs | 1–205 |
| apps/desktop/src-tauri/src/main.rs | 1–6 |
| apps/desktop/src/data/AppDataContext.tsx | 1–52 |
| apps/desktop/src/data/app-data.ts | 1–476 |
| apps/desktop/src/data/app-data.test.ts | 1–1210 |
| apps/desktop/src/data/persist-queue.ts | 1–79 |
| apps/desktop/src/data/persist-queue.test.ts | 1–185 |
| apps/desktop/src/data/tauri-storage.ts | 1–71 |
| apps/desktop/src/data/tauri-storage.test.ts | 1–75 |
| apps/desktop/src/data/tauri-contract.test.ts | 1–317 |
| apps/desktop/src/data/tables.ts | 1–68 |
| apps/desktop/src/data/tables.test.ts | 1–43 |
| apps/desktop/src/data/today.ts | 1–58 |
| apps/desktop/src/data/today.test.ts | 1–81 |
| apps/desktop/src/data/demo-snapshot.ts | 1–45 |
| apps/desktop/src/data/demo-snapshot.test.ts | 1–46 |

Cấu hình đọc hết: Cargo.toml, tauri.conf.json, capabilities/default.json, apps/desktop/package.json; Cargo.lock phân tích 445 package entry, nguồn/checksum và cargo tree --locked --offline. Năm icon kiểm bytes/hash/kích thước PNG bằng bloat-audit.json, không nhận là đã đánh giá mỹ thuật icon.

Nguồn đúng: CLAUDE.md gốc và apps/desktop/CLAUDE.md; CONTEXT.md; ADR-0016; ADR-0009 D-1/W-1; spec Phase 6 §4.1 S2-1…S2-6 và §5; docs/metrics/phase-6.md; common/prompt-codex.md, plan.md §4 và L2.1–L2.8, known.md, fixes.md phần #595/#596/#606 và PR tương ứng, baseline.md. Tổng hợp lượt 1 §3–§5/§7/§9 và sáu raw B.md của cả hai máy trong docs/reviews/raw/2026-10-15/ được dùng để đối chiếu tái hiện/kịch bản cũ; không truy cập thư mục kết quả ngoài repo của bên khác.

Điểm nối đã đọc theo nhu cầu: packages/db/src/database.ts toàn bộ, migration/persist/quickCheck; main.tsx; ai-analysis.ts (AppAi, analyseCustomer, generation/replacing); tauri AI adapter/contract; shell/startup-error.ts, SaveWarning.tsx, close-guard.ts, CloseGuard.tsx và test; routes/Settings.tsx, SettingsBackup.tsx (read/import/export), SettingsDataFile; TeamDialogs/TeamScreen đoạn tạo team để probe UI; routes.ts; i18n thông báo file/đóng app; e2e/perf/README.md. Không nhận là review trọn các vùng thuộc C/D/E.

## 4. Kịch bản mới đã thử

Mỗi dòng nêu đầu vào / bước cụ thể. Một số biến thể mở rộng seam đã có test; các ca mới nhắm vào phần sửa và tổ hợp chưa có trong raw lượt 1, không chỉ chạy lại fuzz cũ.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| N1 | Import file hợp lệ → lưu file mới lỗi DISK_FULL → yêu cầu reload bị từ chối → thả lỗi → hai flush cùng lúc → mở lại file | generation=1; reload đúng RELOAD_UNSAVED_CHANGES; sau retry unsaved=false, file giữ team imported, không lùi về DB cũ. node-results.json. | — |
| N2 | Xếp ba import: bytes hỏng, file hợp lệ “one”, file hợp lệ “two”; sau hàng đợi ghi thêm team | rejected/fulfilled/fulfilled; generation=2; file cuối two + after queue; không khóa ghi sót. node-results.json. | — |
| N3 | Bộ tải schema hiện tại, phá riêng trang 1/4, 1/2, 3/4 file (858/1717/2576) → mở qua openAppData/storage port | Cả ba DATA_DAMAGED; storageCalls=[]; biến thể nhiều vùng của R06. | — |
| N4 | Mở startup file SQLite v0 thật có bảng notes/retained, thay vì chỉ inject bytes vào import preview | events backup → save, raw schema 11, notes retained. Không dùng helper tự migrate để kiểm bytes cuối. | — |
| N5 | Trong cùng key giả, ký tự chẵn lồng JSON→URL, lẻ URL→JSON; thử content JSON và error.message | reply 200 nhận, lỗi 401 giữ nguyên chuỗi mã hóa. Hai dạng đồng nhất vẫn bị chặn. mixed-layer-final.log. | CX2-B3 |
| N6 | Key hai lớp nằm sau tiền tố tiếng Việt/emoji; session là chuỗi con chồng key, key xuất hiện hai lần | Message “Đức 🙂 *** *** done”, span UTF-8 không cắt sai hay panic. rust-extra-final.log. | — |
| N7 | Model đúng 128 ASCII, 129 ASCII, emoji 32 ký tự, tab/U+200B; ID có slash/colon/underscore | Chỉ 128 và ID ASCII đúng tập được nhận; các dạng sai BAD_REQUEST. | — |
| N8 | backup tmp bị giữ share_mode(0) khi mở lần đầu → thả file → reload cùng DataLock → process mới | Best effort giữ khi bị giữ; reload không xóa đồ đang chạy; lần mở với lock mới xóa tmp. | — |
| N9 | 999 tên xuất full.xlsx/full-2…full-999 đã có → xuất hai lần; thử CON.xlsx | Lần 1000 ghi file đủ, lần 1001 AlreadyExists, không đè file. CON.xlsx là file thường ghi đủ trên Windows này, không báo lỗi sản phẩm. | — |
| N10 | Trên exe quyền mới: gọi bốn core command thừa; xuất backup → nhập dữ liệu tải → mở exports; chèn base trỏ host ngoài | Bốn ACL denials; xuất có đủ 1.496 KH, nhập thành công, folder mở; baseURI vẫn tauri.localhost. exe-results.json. | — |
| N11 | Exe: form POST tới example.invalid với CSP mới và mạng ngoài bị chặn từ đầu | securitypolicyviolation form-action; 0 request tới mạng. Không mở host thật. exe-unsaved-results.json. | — |
| N12 | Exe: giữ DB không share delete → tạo team bằng UI → WM_CLOSE → Thử lại sau khi thả giữ | Alert lưu lỗi; hộp “Chưa lưu được thay đổi”, process còn; retry lưu rồi exit=0; đọc file thấy team Review B persisted after retry. | — |
| N13 | Gỡ đồng loạt version trong ba cấu hình trên bản chép; đối chứng chỉ gỡ một file | Cả ba về 0.1.0 vẫn 14/14; lệch một file đỏ. | CX2-B1 |
| N14 | Gỡ TempDir::drop; control/mutant chạy storage test trong hai thư mục output riêng | Cả hai 58/58 xanh; control 0 thư mục còn, mutant 53. | CX2-B2 |
| N15 | Áp J5 gốc: bỏ nhịp setTimeout trước close DB cũ rồi chạy bảy file dữ liệu B | 104/104 xanh. Không giả lập đây là lỗi UI: chỉ xác nhận test chưa giữ lời hứa timing. | CX2-B4 |

## 5. Phát hiện mới / phần sửa còn thiếu

### CX2-B1 — Test version chỉ giữ sự đồng nhất, không giữ quyết định 1.0.0

- ID: CX2-B1
- Mức: Low
- Trục: T
- Vị trí: apps/desktop/src/data/tauri-contract.test.ts:275, :278 (4217ed4).
- Tình trạng: CONFIRMED
- Liên quan: DR6-12 · mới ở test của đợt sửa PR #617.
- Kịch bản: N13.
- Mô tả: Test chỉ so ba giá trị với nhau; gỡ toàn bộ phần sửa version về 0.1.0 vẫn xanh. Code và exe hiện tại đã đúng 1.0.0, nhưng test mới chưa giữ chính lựa chọn Q12.
- Tái hiện / bằng chứng: node B/mutate.mjs chạy node <repo>/node_modules/vitest/vitest.mjs run --config B/vitest.config.mts tauri-contract.test.ts trên bản chép. R12-version-all.log: “Test Files 1 passed (1); Tests 14 passed (14)”. Đối chứng R12-version-one.log: test “gives package.json, tauri.conf.json and Cargo.toml one version” đỏ.
- Ảnh hưởng: Hồi quy đồng loạt version có thể qua test cấu hình, để bản phát hành lại mang version cũ. Đây là khoảng hở test, không phải lỗi version đang xảy ra.
- Đề xuất: Giữ phép so đồng nhất và kiểm thêm giá trị 1.0.0 đã được Owner chốt; 1–3 dòng test, 0 dòng SP.

### CX2-B2 — Việc tự dọn thư mục tạm chưa có test bắt khi bỏ Drop

- ID: CX2-B2
- Mức: Low
- Trục: T
- Vị trí: apps/desktop/src-tauri/src/storage.rs:556, :558 (4217ed4).
- Tình trạng: CONFIRMED
- Liên quan: DR6-09 · mới ở phần test guard của đợt sửa PR #620.
- Kịch bản: N14.
- Mô tả: TempDir hiện có Drop đúng, nhưng bỏ remove_dir_all trong Drop vẫn qua toàn bộ storage test. Phần sửa để cargo test không để lại rác chỉ được kiểm ngoài bộ test, chưa được chính bộ đó bảo vệ.
- Tái hiện / bằng chứng: R09-drop.rs là bản chép chỉ bỏ thao tác dọn. rustc --edition=2021 --test --cap-lints allow B/R09-drop.rs -o B/R09-drop.exe; chạy exe → “58 passed; 0 failed”. audit.mjs lặp control/mutant với đường temp chuyển vào B/temp-control và B/temp-mutant: cả hai exit 0; cleanup-control.json left=[]; cleanup-mutant.json left.length=53.
- Ảnh hưởng: Một refactor bỏ Drop sẽ lại tích lũy thư mục/file tạm trên máy dev/CI trong khi test xanh. Không ảnh hưởng dữ liệu người dùng; code hiện tại dọn được.
- Đề xuất: Ca tạo TempDir có file trong scope rồi kiểm thư mục đã mất sau khi scope kết thúc; khoảng 10–20 dòng test, 0 dòng SP.

### CX2-B3 — Key trộn thứ tự escape theo từng ký tự vẫn lọt nhận diện và che lỗi

- ID: CX2-B3
- Mức: Low
- Trục: S
- Vị trí: apps/desktop/src-tauri/src/ai.rs:338, :346 (4217ed4); callers reply:261, mask:297.
- Tình trạng: CONFIRMED
- Liên quan: DR6-10 · có từ trước, lượt 1 bỏ sót biến thể này; thuật toán sửa ở PR #617 vẫn còn hở, không phải hồi quy.
- Kịch bản: N5.
- Mô tả: Bốn readings chỉ gồm một lượt Both và hai thứ tự đồng nhất cho cả chuỗi. Một key có các span cần JSON→URL xen với span cần URL→JSON không hiện nguyên key ở bất kỳ reading nào; reply nhận nó và mask giữ lại chuỗi có thể phục hồi.
- Tái hiện / bằng chứng: Test mixed_layer_order_probe trong B/rust/ai.rs. Với key giả sk-review-MIXED-827, byte ở vị trí chẵn thành \u0025XX; byte lẻ thành %5Cu00XX. Content được dựng bằng format JSON trực tiếp như helper answer gốc, không thêm một lớp JSON escape vào note. Lệnh cargo test --manifest-path B/rust/Cargo.toml --offline --target-dir <repo>/apps/desktop/src-tauri/target --lib mixed_layer_order_probe -- --nocapture → “NEW mixed-layer: accepted=true, error_retains_encoded=true”; 1 passed (mixed-layer-final.log). Test đồng thời xác nhận từng dạng đồng nhất bị BAD_RESPONSE.
- Bằng chứng nguồn gốc: mixed-layer-old.log trên ai.rs lấy bằng git show 8855345 cũng in cùng dòng accepted=true/error_retains_encoded=true. Lần control cũ đỏ ở assertion đòi dạng hai lớp đồng nhất đã được sửa ở lượt 2; không dùng lỗi control đó làm phát hiện khác.
- Ảnh hưởng: Cần server bất thường chủ động dội key theo biểu diễn trộn. Chuỗi khôi phục được có thể tới webview/raw output hoặc thông điệp lỗi, cùng loại rủi ro hiếm như DR6-10; không chứng minh key thật bị lộ trong thao tác bình thường. Mỗi span chỉ có một lớp JSON và một lớp URL, khác việc giải JSON hai lượt mà #617 chủ ý tránh.
- Đề xuất: Nhận diện có giới hạn theo span/trạng thái giải mã để bao phủ thứ tự trộn, giữ bản đồ span khi mask, và giữ test backslash hợp lệ không bị chặn nhầm. Khoảng 80–180 dòng SP + test, dưới 400 SP; không gọi dịch vụ thật hay đổi nơi lưu key.

### CX2-B4 — J5 của DR6-60 chưa được giữ bằng test hoặc ghi quyết định hoãn

- ID: CX2-B4
- Mức: Low
- Trục: T
- Vị trí: apps/desktop/src/data/app-data.ts:397; apps/desktop/src/data/app-data.test.ts:481 (4217ed4).
- Tình trạng: CONFIRMED
- Liên quan: DR6-60 · có từ trước, lượt 2 còn thiếu phần J5 đã nêu; PR #644 chỉ thêm MJ15 cho B.
- Kịch bản: N15.
- Mô tả: Test “closes the replaced database once the screens moved to the new one” quan sát subscriber đồng bộ. Nó không giữ yêu cầu chờ màn chuyển DB trước khi đóng handle cũ: bỏ setTimeout vẫn 104/104 xanh. known.md và tổng hợp lượt 1 §5.8 vẫn liệt kê J5 trong DR6-60; fixes.md không ghi xử lý/hoãn phần này.
- Tái hiện / bằng chứng: audit-fix.mjs thay đúng “await new Promise((resolve) => setTimeout(resolve, 0));” trên bản chép app-data.ts, chạy toàn bộ bảy file B. R60-J5-close.log: “Test Files 7 passed (7); Tests 104 passed (104)”. Trả bản chép về nguyên văn ngay sau đó.
- Ảnh hưởng: Lời hứa timing trong comment chưa có test giữ. Báo cáo gốc đã nói đột biến gần tương đương ở React hiện tại; phiên này không biến nó thành kết luận màn bị lỗi hoặc dữ liệu mất.
- Đề xuất: Thêm một ca subscriber xếp microtask đọc DB cũ trước lúc close, hoặc ghi quyết định rõ rằng không giữ seam timing này và sửa comment tương ứng. Khoảng 15–30 dòng test; chỉ sửa SP nếu chọn làm rõ hợp đồng. Không cần thêm thư viện DOM.

## 6. Bloat

| Kiểm tra | Dữ liệu / phạm vi | Số đo / kết quả | ID |
|---|---|---|---|
| tsc --noUnusedLocals --noUnusedParameters --noEmit -p apps/desktop | Desktop và import package | Exit 0, 0 lỗi unused; không sửa cấu hình. unused.log. | — |
| Audit AST export + nơi dùng trong file tracked apps/packages/e2e/tools | 7 module TS/TSX B | 34 declaration export; 4 tên không có tham chiếu ngoài file đều là type: LastSave, OpenAppDataOptions, DayWatcher, WakeEvents. Không mang chi phí runtime. bloat-audit.json. | — |
| codemap:check; lint:deps | Repo ở SHA ghim | Up to date; 0 vi phạm, 315 module / 1.277 dependency. Dùng chế độ check, không sinh lại docs. | — |
| Cargo.lock + cargo tree --depth 1 --locked --offline | Rust | 445 entry; 0 registry entry thiếu checksum. 6 crate trực tiếp + tauri-build, đều có chỗ dùng. Không coi crate chỉ phục vụ nền tảng khác là bloat exe Windows. | — |
| cargo clippy --lib --tests --locked --offline -- -W clippy::pedantic, đúng một lần | Rust nguyên bản | Exit 0; 12,68 s. Build script 1, lib 19, bin test 1, lib test 31 (19 trùng) → 33 vị trí phân biệt. Lượt 1 Home PC: 32. Phần tăng/chuyển vị trí là lint doc/style; không thấy lỗi logic mới từ warning. clippy.log. | — |
| crate-type / target | Rust | Chỉ rlib; đột biến cũ bị test giết. target/release tại worktree này chưa có: không có số target để so tiết kiệm MB, không biến “không có build” thành phép đo giảm bloat. Home PC chưa có số release lượt 1 cùng cache (baseline.md). | R13 |
| Bundle web, dùng mốc chuẩn bị không dựng lại | Toàn bundle, không gán toàn Δ cho B | 2.382.036 B thô / 702.109 B gzip; lượt 1 2.364.283 / 697.071 → +17.753 / +5.038. Chart/excel/wasm không đổi. index +17.727 B, CSS +26 B. Đây là số chung của mọi gói sửa. | — |
| Exe baseline + metadata của bản chép chạy thực | common/exe/project2c.exe | 5.404.672 B, giảm 9.728 B so lượt 1; PE 1.0.0/1.0.0. Năm icon hash/kích thước ở audit, không phát hiện asset thừa mới. | — |
| Đọc đoạn lặp / thành viên chỉ test dùng | data, storage, AI boundary | PersistQueue.unsaved, newPage/newSessionId và read_dir/cleanup lặp đều KNOWN DR6-66/67 hoặc ghi chú #620; không có bằng chứng mới để báo lại. | KNOWN |

Không đề xuất refactor bloat mới. Giới hạn: chưa tách byte exe theo từng crate vì không cài cargo-bloat hoặc công cụ mới; không đo build release đối chứng trên Home PC.

## 6b. Hiệu năng

Máy DESKTOP-KDURKJP. Bộ tải lượt 2 được nhập qua app.readBackup/importBackup; hash JSON.stringify(tables) đúng 1c306cfb8203409337a5fa33c48306694581cb70355eb5526e4cf4f543589591. JSON UTF-8 16.034.517 B; SQLite 14.069.760 B, lớn hơn file schema cũ lượt 1 (13.455.360 B) do các migration mới. Tổng dòng vẫn 1.496 KH / 10.414 lịch hẹn / 54 nhân sự; không nhầm với số sống của UI.

Node chạy xong sau test/clippy của phiên; Rust -O chạy sau đó, không chạy test/build của chính phiên cùng lúc đo I/O. Probe exe dùng để kiểm chức năng, không dùng làm phép đo đầu-cuối chuẩn vì debugger nối và điều kiện cửa sổ khác chuẩn perf. Không thể xác nhận toàn bộ tải nền hoặc reviewer khác trên máy; dùng baseline chung cho so exe. Không đo song song với phiên khác theo cách chủ động, không dùng cổng 4173/9222.

| Đo | Dữ liệu / lần | Trung vị (min–max), ms | Lượt 1 cùng Home PC / ngưỡng | Nhận định / ID |
|---|---|---|---|---|
| app.readBackup | Bộ tải, Node, 5 | 802,60 (799,68–838,45) | Codex B Home PC 807,97 | Không xấu hơn theo luật nhiễu. |
| app.importBackup, không file port | Như trên, 5 | 4,21 (3,37–16,26) | 4,18 | Trong nhiễu; không đồng nhất với UI/IPC. |
| app.exportBackup, không file port | Như trên, 5 | 232,57 (191,57–243,71) | 232,73 | Trong nhiễu. |
| Sáu bảng cold | Như trên, 5 | 80,45 (79,64–81,18) | 80,12 | Trong nhiễu. |
| 600 getter bảng đã cache | Như trên, 5 | 0,065 (0,040–0,123) | 0,05 | 0 query đọc lại, chi phí rất nhỏ. |
| quickCheck | DB tải, Node, 5 | 68,20 (67,63–69,50) | Lượt 1 đề xuất thêm ≈79 ms; không có quickCheck startup cũ | Chi phí an toàn có chủ ý của #620. |
| openAppData từ file, storage RAM | DB tải, 5 | 71,03 (70,30–72,51) | Raw B Home PC ≈3,5 ms trước quickCheck | Tăng ≈67,5 ms; gần khớp riêng quickCheck, không gán là thao tác UI. |
| Rust save+sync+rename, rustc -O | DB tải, 15 | 10,609 (9,311–14,895) | Codex B Home PC 10,36 | +0,25 ms, trong nhiễu. |
| Rust open | Như trên, 15 | 4,722 (4,242–5,802) | 4,21 | +0,51 ms, trong nhiễu. |
| Rust backup, lần đầu copy rồi dedup | Như trên, 15 | 7,198 (6,793–13,674) | 6,61 | +0,59 ms, trong nhiễu; file mới lớn hơn. |
| Rust write_export | Như trên, 15 | 9,669 (9,312–10,128) | 9,33 | +0,34 ms, trong nhiễu. |
| app.open-data — baseline exe | Bộ tải, chuẩn bị lượt 2 | 301 | Lượt 1 189; ngưỡng ≤600 | +113 ms/+60%, có cờ theo luật nhiễu, vẫn đạt ngưỡng. |
| reload.* — baseline exe | 6 màn, chuẩn bị lượt 2 | 247–355 | Lượt 1 180–293; <500 | +62–67 ms/+21–37%, có cờ; vẫn đạt. |
| db.save / backup.read / backup.import / backup.export — baseline exe | Chuẩn bị lượt 2, 15/5/5/5 | 147 / 814 / 43 / 422 | Lượt 1 140 / 794 / 49 / 424; ngưỡng 400/2000/500/1000 | Đều đạt; không xấu hơn vượt cả >20% và >10 ms. |
| Mở lần đầu LCP — baseline T-227 | 3 bản exe thư mục mới | 3.526 | Phase 4 cùng máy max 3.937; biên nhiễu 4.724 | Đạt. Không so nền T-219 của laptop. |
| Build release — baseline | Home PC, cache không chuẩn hóa | build:exe 104 s; cargo 97 s | Home PC không có số lượt 1 để so trực tiếp | Ghi lại, không khẳng định giảm 11,5 s trên máy này. |

Các cờ open/reload của baseline được giữ nguyên, không tuyên bố mọi số “không đổi”. Tăng của reload gần bằng 68 ms quickCheck đo riêng; từ code, mỗi lần khởi động lại có file đều chạy check. Đây là suy luận nguyên nhân có bằng chứng đo thành phần, không phải trace phân rã toàn thời gian exe. #620 đã chủ ý đổi an toàn lấy chi phí này; các thao tác còn trong ngưỡng duyệt. Không tạo phát hiện P mới từ chi phí đã được chốt đó. Số 393,4 ms của exe-probe đang nối debugger chỉ phục vụ chẩn đoán, không trộn vào phép so chuẩn 301 ms.

## 7. Đếm mức × trục

Đếm mỗi phát hiện theo một trục chính; bảng R không đếm lại như phát hiện mới.

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 3 | 0 | 4 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tổng | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 3 | 0 | 4 |

CONFIRMED 4/4; PLAUSIBLE 0/4 (0%). Không có tỉ lệ PLAUSIBLE cao. Một mục R sửa một phần là test J5; không có mục R HỒI QUY được xác nhận.

## 8. Đã xét, không thấy / phần có phát hiện

| Trục | Đã đọc/chạy và giới hạn kết luận |
|---|---|
| R | Kiểm đủ 06–14 và 60 bằng control, đột biến, biến thể và exe; xem §2. DR6-60 còn J5. |
| E | N1–N4, N6–N12; 104 test B và 101 Rust gồm race/lock/retry/coalesce/midnight/DST/UTF-8; chưa thấy lỗi mới ở các tổ hợp đã thử. Không thử mất điện vật lý hoặc ổ thật đầy. |
| C | Đối chiếu ADR-0016, D-1/W-1, S2-1…S2-6, hợp đồng raw/header/camelCase/error/version. 14 contract test và exe cho quyền mới; không thấy sai hợp đồng sản phẩm mới ngoài biến thể S. Tên và schema được kiểm đúng nguồn, không sửa spec cho khớp code. |
| D | N1/N2/N3/N4/N12 xác nhận lỗi không đè DB cũ, flush giữ file mới đủ, backup trước migrate-save, dữ liệu team còn sau retry. Bộ Rust giữ atomic/rename/stale-page/dedup/prune. Giới hạn quickCheck sau migration là KNOWN; không báo lại. |
| G | Phần B: roles/token/timeout/body cap/gzip/Busy, mock keyring + HTTP local của 101 Rust; 15 test Mock/S2-3 xanh. Không có phát hiện G mới; validator nội dung V1–V7 chi tiết thuộc C, không nhận đã audit toàn bộ ở B. |
| S | CX2-B3. Ngoài nó: fixed URLs, HTTPS/no redirect, body ≤2MiB, Local Credential Manager, no read-key command, mask trước cắt, page token, filename/folder whitelist, Explorer full path. Exe ACL/base-uri/form-action/close thử thực. Không dùng key thật, không gọi ChatGPT/OpenCode. |
| P | Số đo ở §6b. Có tăng được dự kiến ở check startup/reload nhưng chưa có phát hiện P mới vượt quyết định/ngưỡng. Không dùng số laptop để tính Δ Home PC. |
| B | tsc/codemap/deps/AST export/lock/tree/icon/bundle/exe ở §6; không thấy bloat mới có chi phí đủ để tách phát hiện. KNOWN unsaved/random/cleanup lặp giữ nguyên. |
| T | CX2-B1, B2, B4; các luật RS4/RS9/MJ15/A14/sync hiện đã được test giết khi gỡ. 104 B + 16 shell + 15 seam Mock/S2-3 + 101 Rust gốc xanh. Mutation sống không được kể như lỗi sản phẩm hiện tại. |
| A | Test thông báo tiếng Việt, role=alert và câu lỗi theo nguyên nhân; exe hiển thị hộp CloseGuard bằng tiếng Việt và nút Thử lại dùng được. today watcher kiểm nửa đêm/wake/unsubscribe. Không audit toàn visual/focus/contrast của D/E trong gói B. |

## 9. Phụ lục nguồn, lệnh, đột biến và kiểm trạng thái cuối

Mọi đường B/... dưới đây tương đối với C:\workspace\deep-review-1-6-r2\codex\. Bản chép là bằng chứng review, không code đưa vào repo.

### 9.1 Nguồn / log

| Nguồn | Lệnh / công dụng | Kết quả thực |
|---|---|---|
| B/prepare.mjs; B/copy; B/vitest.config.mts | Chép source, alias package về repo, test ngoài repo | js-base.log: 7 file / 104 passed. Không nạp các test AI ngoài lựa chọn B qua include. |
| B/rust/Cargo.toml, lib.rs, ai.rs, storage.rs | Crate probe dùng dependency ghim có sẵn, không Tauri shell | rust-base.log: 101 passed. Module sản phẩm và test gốc chép nguyên; probe mới nằm cfg(test) review2. |
| B/mutate.mjs; B/mutations.json; B/R*.log | rustc storage / cargo AI / Vitest trên bản chép, trả từng source bản chép về sau lượt | 20 đột biến đầu: 18 bị giết, 2 sống; thêm J5 thật sống → 21 đột biến, 18 bị giết / 3 sống. Ca byte-size là đột biến phụ, không giả tên J5 của lượt 1. |
| B/audit-fix.mjs; B/R60-J5-close.log | Áp đúng J5 gốc | 7 file / 104 passed; còn hở. |
| B/audit.mjs; cleanup-control/mutant.rs/.exe/.log/.json | Test Drop với temp path chuyển vào output riêng | Control 0 thư mục sót; mutant 53, cả hai 58 passed. Thư mục mutant giữ để kiểm bằng chứng. |
| B/node-probe.mjs; node-probe.log; node-results.json; load.sqlite | registerHooks nạp TS/?raw như tools/load-data; openAppData, app.readBackup, app.importBackup | N1–N4 + perf, exit 0; hash tables đúng; không chèn SQL để kết luận màn. SQL trực tiếp chỉ dùng fixture v0 và kiểm raw bytes/schema. |
| B/extra-setup.mjs, extra-correct*.mjs; B/rust/* mod review2 | Key giả, model, span, cleanup held tmp, suffix boundary | rust-extra-final.log 7 passed; mixed-layer-final.log 1 passed sau khi kiểm lại cách dựng JSON. |
| B/mixed-layer-old.log | Cùng biến thể trên source ai.rs ở 8855345 qua git show | Trace xác nhận có từ trước; test control đỏ vì assertions cho nhánh hai lớp đồng nhất mới được sửa, không phải regression mới. |
| B/storage-perf.rs/.exe/.log/.json | rustc --edition=2021 -O --cap-lints allow ...; 15 vòng I/O bộ tải | Số ở §6b, chạy riêng; debug perf trong rust-extra-final.log chỉ chẩn đoán, không dùng làm mốc so. |
| B/exe-probe.mjs; exe-results.json; exe-probe-final.log | Exe bản chép, CDP 9337; ACL, export/import/folder/CSP/WM_CLOSE | Exit 0; đóng sạch qua CloseGuard. |
| B/exe-unsaved.mjs; exe-unsaved-results.json; exe-unsaved-final.log | Exe riêng 9338; CSP form + giữ file + UI tạo team + WM_CLOSE/retry | Exit 0; team có trong file sau đóng. Helper chỉ giữ file DB của probe; release và các process do probe tạo đã kết thúc. |
| B/unused.log, codemap.log, deps.log, cargo-tree.log, bloat-audit.json, scope.json | Các kiểm Bloat §6; hash/path/line của source | Exit 0; không có dependency mới. |
| B/clippy.log | cargo clippy --manifest-path apps/desktop/src-tauri/Cargo.toml --lib --tests --locked --offline -- -W clippy::pedantic | Đúng một lần, exit 0; 12,68 s. |
| B/shell-tests.log | pnpm exec vitest run startup-error.test.ts SaveWarning.test.tsx close-guard.test.ts (đường đầy đủ trong script phiên) | 3 file / 16 passed. |
| B/ai-seam.log | pnpm exec vitest run apps/desktop/src/data/ai-analysis.test.ts -t 'Mock\|S2-3\|replac' | 15 passed / 42 skipped; chỉ Mock/adapter giả. |
| B/exe-version.txt | Đọc PE version common/exe/project2c.exe | FileVersion=1.0.0; ProductVersion=1.0.0. |
| common/baseline.md; common/perf/perf-ref*.json | Các số chuẩn bị exe/bundle/build cùng máy | Dùng theo prompt; không chạy lại e2e hoặc chiếm cổng 4173/9222. |

### 9.2 Ma trận đột biến

| ID/log | Phần gỡ / đổi trên bản chép | Kết quả |
|---|---|---|
| R06-quick-check | Bỏ chặn damage trước backup | Bị giết, 1 test. |
| R07-held-db | Bỏ out_of_reach ở lỗi đọc DB | Bị giết, 1 test. |
| R07-full | Bỏ map DISK_FULL ở save | Bị giết, 1 test. |
| R09-cleanup | Bỏ cleanup backup tmp | Bị giết, 1 test. |
| R09-drop | Bỏ TempDir Drop cleanup | Sống, 58/58; CX2-B2. |
| R10-json-url | Bỏ reading JSON→URL | Bị giết. |
| R10-url-json | Bỏ reading URL→JSON | Bị giết. |
| R11-model | 128 →129 | Bị giết. |
| R60-dot | Bỏ luật tên bắt đầu dấu chấm | Bị giết, 2 test. |
| R60-length | Bỏ so độ dài has_same_bytes | Bị giết, 1 test. |
| R60-sync | Bỏ flush trước rename | Bị giết, 2 test. |
| R60-A14 | Busy trước check | Bị giết. |
| R08-migrate | openFrom lưu bytes đầu vào | Bị giết, 1 test. |
| R60-MJ15 | Bỏ close DB preview | Bị giết, 1 test. |
| R60-J5.log (nhãn cũ của harness, thực là extra-byte-size) | byteLength → text.length | Bị giết; ca phụ, không tính là J5 gốc. |
| R60-J5-close | Bỏ setTimeout trước close DB cũ | Sống 104/104; CX2-B4. |
| R12-version-one | Một cấu hình 0.1.0 | Bị giết. |
| R12-version-all | Cả ba 0.1.0 | Sống 14/14; CX2-B1. |
| R13-crates | Trả staticlib/cdylib/rlib | Bị giết. |
| R14-capability | Trả core:default | Bị giết. |
| R14-csp | Bỏ base-uri/form-action | Bị giết. |

### 9.3 Hiệu chỉnh harness và giới hạn

- Hai lần soạn prepare đầu lỗi cú pháp JS/PowerShell trước khi chạy test sản phẩm; tiếp đó thiếu alias @p2c/ai/schema và file shell/scope của bản chép. Đã bổ sung; chỉ dùng js-base.log cuối 104 passed làm control.
- Probe tên Windows ban đầu kỳ vọng CON.xlsx bị từ chối; thực tế Rust ghi file thường đầy đủ (cũng đã được raw lượt 1 ghi nhận). Đã sửa expectation, không tạo finding từ ca này.
- Probe key được kiểm lại cách dựng content để không vô ý thêm lớp JSON escape; chỉ mixed-layer-final.log với format JSON trực tiếp là bằng chứng 2xx cuối.
- Probe exe lần đầu va navigation khi evaluate; đã giữ network route và initScript từ bản đầu, chờ DOM trước evaluate, rồi chạy lại. Helper giữ file lần đầu không chạy theo execution policy mặc định; lần cuối dùng Bypass chỉ cho process helper, không đổi policy máy, exit 0.
- Không gọi API AI, eval-ai, Kiểm tra kết nối, không đọc/in Credential Manager, không mở ChatGPT. Mạng trình duyệt bị chặn ngoài 127.0.0.1, window.open bị thay ngay trong bản probe đầu; DNS ngoài bị chặn ở tham số WebView2 từ lúc launch. Cả CSP form thử nghiệm không phát request thật.
- Chỉ kiểm chức năng trên exe, không nhận đó là bấm tay của Owner hay bộ perf chuẩn. Không mô phỏng mất điện/đĩa đầy vật lý. Chưa có số target release tại worktree này, không bịa số tiết kiệm MB.
- progress-history.md giữ nhật ký ghi dần trước khi sắp lại báo cáo, gồm các nhãn tạm đã được hiệu chỉnh ở đây.

### 9.4 Trạng thái cuối

- git rev-parse HEAD: 4217ed4cd3300af1d63aa61db9eb13902fe75f16.
- git status --short: ?? .agents/; ?? .codex/; ?? AGENTS.md — trùng đầu phiên.
- 19 hash source/test B trùng scope.json; không patch file repo, không commit. Chỉ cache build bị ignore được dùng.
- Probe exe 9337/9338 và helper giữ file đều kết thúc; không dùng cổng 4173/9222.

Giờ xong: 2026-10-17 02:42:20 +07:00 (Asia/Bangkok, UTC+07:00).
