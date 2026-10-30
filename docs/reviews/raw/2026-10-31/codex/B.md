XONG — codex gói B lượt 4, 2026-10-29 02:38:05 +07:00

# Deep review Phase 1–6, lượt 4 — Codex, gói B: File và Rust

## 1. Thông tin phiên

- Bên: Codex; gói B; phiên mới, thực hiện trong phiên chính, không subagent.
- Worktree: `C:\workspace\Project-2C-review-2`; SHA đầu phiên: `2e51e25eb0125f56d3d938b97ef18d6873dae076`, đúng SHA ghim.
- `git status --short` đầu phiên: rỗng. B chưa tồn tại; A có dòng đầu `XONG` (chỉ đọc dòng đầu để kiểm điều kiện).
- Bắt đầu: **2026-10-29 02:10:42 +07:00**, Asia/Bangkok. Máy `DESKTOP-KDURKJP`, Node `v24.20.0`.
- Công cụ: Codex desktop; `codex --version` trả **codex-cli 0.162.1**, exit 0, kèm cảnh báo không dọn được arg0 / tạo PATH alias do quyền. PowerShell, Node, rustc/cargo, Vitest 5.0.1, Playwright/Edge và dependency có sẵn. Không cài công cụ mới.
- Model: **GPT-6 (Codex), theo thông tin hệ thống**. Prompt của Owner ghi model đã chọn là **GPT Sol 6.1**; công cụ phiên này không trả định danh biến thể hoặc mức suy luận để kiểm chứng thêm. Không suy phiên bản model từ phiên bản CLI.
- Repo chỉ đọc. Probe, log và bản chép trong `C:\workspace\deep-review-1-6-r4\codex\B\`. Không đọc báo cáo lượt 4 bên khác, không đọc nội dung gói A, không chạy gh / AI thật / nghi thức phát triển / commit.
- Kết quả phạm vi B: **R1 3/3 ĐÃ SỬA; R2 6/6 ĐÃ SỬA trong phần B kiểm; không có phát hiện mới CONFIRMED hoặc PLAUSIBLE.** Không kết luận thay gói F về v1.0.

## 2. Bảng R1 và R2

Kết luận áp cho phần giao B. Bằng chứng dùng code nguyên trạng ở SHA ghim, control, đột biến bản chép và biến thể gần. Kết quả các gói khác không được suy ra từ bảng này.

### R1

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-120 | #726 → #750; #752 → #764; #782 → #807; #783 → #817 | **ĐÃ SỬA** | Rust storage 73/73. `R120-readonly` bỏ mapping READ_ONLY: 2 test đỏ; `R120-folder` bỏ FOLDER_READ_ONLY: 1 đỏ. Tái hiện cũ ACL cho đọc nhưng cấm thay và readonly giữa phiên qua test filesystem Windows thật; file cũ nguyên, bỏ quyền cấm thì lưu được. `saveFailure` và các câu UI qua unit/browser. | Chương trình giữ file với share 0 / share đọc+ghi vẫn là lỗi Windows; chỉ cấm ghi nội dung nhưng vẫn cho rename thì không bị chặn nhầm. N1 đổi liên tiếp nguyên nhân lỗi, Thử lại cập nhật đúng câu; N7 đóng qua hai nguyên nhân rồi mở lại có dữ liệu mới nhất. |
| DR6-67 | #782 → #807, phần Rust; các PR gói khác không chấm ở đây | **ĐÃ SỬA — phần B** | `entries` thay các vòng read_dir; `remove_interrupted` dùng chung exports/backups; `refuses` dùng chung quyền file/thư mục. Control 73 xanh. `R67-cleanup` bỏ nhánh dọn backup: test `open_removes_the_tmp_of_a_backup_cut_short_and_keeps_everything_else` đỏ. `T293-backups` nuốt lỗi entries: ca backups không đọc được đỏ. | Đối chứng refactor: inline lại hai vòng dọn **tương đương** vẫn 73/73 (`R67-inline.log`), đúng dự kiến. Không gọi đây là test hở: runtime test không phát hiện code lặp khi hành vi y hệt. Đột biến mất tác dụng thật của helper bị giết. Predicate tên, file/thư mục, lần mở đầu và reload được giữ. |
| CL3-B2 | #783 → #817 | **ĐÃ SỬA** | Có nút Thử lại gọi `saves.flush()`. `CL3B2-retry` bỏ ghi lại lost: 3/12 test đỏ. Ca e2e PR sửa: Nạp lại bị từ chối → Thử lại khi còn lỗi → hết lỗi → Thử lại → Nạp lại thành công. | N2 bấm hai lần khi write bị giữ: chỉ một lần ghi thành công, dữ liệu không lùi; điều hướng trong khi thử lại giữ focus người dùng. N3/N4 kiểm tiếp Nhập/Dọn với close. Không báo lại hai giới hạn giao diện ACCEPTED của #819. |

### R2

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-293 (#782) | #807 `f36935e` | **ĐÃ SỬA — phần B** | Rust 116/116 (73 storage, 43 AI). `T293-backups`: 1 đỏ; `T293-json-only` đổi lượt JSON-only về All: 2/43 đỏ, đúng hai đường chặn 2xx/che thông điệp. Bỏ quyền set-title: contract 1/17 đỏ. | Lần mở đầu cấm WD, file hỏng/mất cùng WD và backups cấm RD được test Windows thật; không sinh seed đè. Cách đọc dùng Rc chia lượt 1, bộ 16.099 ca và fingerprint không đổi; key giả chứa backslash/% qua JSON.stringify bị giữ. Tiêu đề theo màn qua IPC giả trên build web ở N5; không chạy lại exe native trong phiên này. |
| T-294 (#783) | #817 `e7a11ba`, #819 | **ĐÃ SỬA — phần B** | Store `status()` chung. `T294-track` bỏ track(turn): 2/77 đỏ; `T294-listener` để listener ném ra ngoài: 1/12 đỏ; control unit 153/153. Browser 5 ca chấp nhận save-state xanh. | N1/N2/N6/N7: đổi nguyên nhân, retry đồng thời, work thêm khi flush đang chờ, listener/failed/newest snapshot. N3/N4: close chờ backup rồi save mới; purge chờ đủ hai save (transaction và VACUUM). N9: lượt giữa lỗi không làm kẹt hàng đợi hoặc close. Hai điểm #819 là KNOWN, không mở lại. |
| T-295 (#784) | #825 `10b5bd7` | **ĐÃ SỬA — phần B** | `T295-check` bỏ kiểm trước migrate: 3/77 đỏ, gồm file schema 10 có chỉ mục mà migration 11 dựng lại; không backup/lưu file hỏng. `T295-duplicate` luôn lưu openFrom: 1/77 đỏ; `T295-measures` bỏ clearMeasures: 1/77 đỏ. | N8: file schema 12 chứa dữ liệu tải mở lên 13, backup nguyên byte, đúng một save, tables/listTrash không đổi, integrity sạch. Timeline được test 120 lần lưu và luôn ≤50. Test contract nhận pre-release. Hộp 10c/notice và generation ChatGPT web thuộc E/C; không nhận đã review trọn các phần đó. |
| T-306 (#850) | #857 `fa4023e` | **ĐÃ SỬA — phần B tài liệu** | Spec S2-6 và dòng test chấp nhận ghi chờ lần thay/lưu; lần thay lỗi giữ dữ liệu cũ đủ. NT-DB-23…25 có WD lúc mở/giữa phiên, readonly giữa phiên, Thử lại và kết quả đúng mã/câu. Đối chiếu Rust test, close/SSR và browser. | Dòng lệch 10d/11j ghi đúng dải ngang, câu theo nguyên nhân, trạng thái Đã lưu chưa có giờ, vế Thử lại của D7. N3/N4/N7/N9 khớp câu đóng app. Chỉ tài liệu nên không đặt đột biến code cho dòng này. Những phần E/D của Issue để gói tương ứng kiểm. |
| T-308 (#852) | #861 `c4eec8b` | **ĐÃ SỬA — phần B** | productName/window title/Cargo description là Heritas L-CRM; `T308-name` đưa productName về Project-2C: 1/17 đỏ. Đã xem icon.png và đọc header/hash năm icon; 32/128/256/512 px, ICO 6 ảnh. N5 title/1100×700 xanh. | CSP không đổi so 119e2e4, identifier vẫn dev.alexh.project2c; cargo binary project2c, DATA_DIR, DB_FILE, KEY_SERVICE và BACKUP_FORMAT giữ tên mã, đúng K39. Icon là cây trên ô trắng bo góc. Mỹ thuật khối logo/font chi tiết thuộc D; dùng baseline chuẩn bị cho cỡ exe. |
| T-310 (#865) | #871 `a9fd5e6` | **ĐÃ SỬA — phần B** | Ca `names the app as the sidebar does...` đọc các file cấu hình, so với `t('app.title')`. `T310-title` chỉ đưa title cửa sổ về Project-2C: 1/17 đỏ; control 17/17. | Đường kết nối B là test tên app một nguồn, không phải đổi runtime Rust. Các phần HEADING/stageBadge/lang/PACKAGES được giao D/E/F, không chấm thay. |

**Lưới kiểm:** 14 đột biến không tương đương đều bị test giết; một đột biến inline tương đương sống đúng dự kiến. Không suy coverage cao thành bằng chứng đủ nếu chưa thử gỡ sửa. Bảng chi tiết ở §9.

## 3. Phạm vi đã đọc

Theo `classifyFile`/`lineReport` ở SHA ghim: **19 file đếm dòng, 2.426 SP / 5.422 test**, trùng baseline; thêm 9 file cấu hình/lock/icon không đếm dòng. `scope.json` giữ đường dẫn, số dòng và SHA256; các bản chép của cả 19 file đều khớp nguyên bản sau đột biến.

| File | Phạm vi dòng |
|---|---:|
| `apps/desktop/src-tauri/build.rs` | 1–3 |
| `apps/desktop/src-tauri/src/ai.rs` | 1–2052 |
| `apps/desktop/src-tauri/src/lib.rs` | 1–205 |
| `apps/desktop/src-tauri/src/main.rs` | 1–6 |
| `apps/desktop/src-tauri/src/storage.rs` | 1–2125 |
| `apps/desktop/src/data/AppDataContext.tsx` | 1–64 |
| `apps/desktop/src/data/app-data.test.ts` | 1–1517 |
| `apps/desktop/src/data/app-data.ts` | 1–493 |
| `apps/desktop/src/data/demo-snapshot.test.ts` | 1–46 |
| `apps/desktop/src/data/demo-snapshot.ts` | 1–45 |
| `apps/desktop/src/data/persist-queue.test.ts` | 1–337 |
| `apps/desktop/src/data/persist-queue.ts` | 1–144 |
| `apps/desktop/src/data/tables.test.ts` | 1–43 |
| `apps/desktop/src/data/tables.ts` | 1–72 |
| `apps/desktop/src/data/tauri-contract.test.ts` | 1–370 |
| `apps/desktop/src/data/tauri-storage.test.ts` | 1–96 |
| `apps/desktop/src/data/tauri-storage.ts` | 1–91 |
| `apps/desktop/src/data/today.test.ts` | 1–81 |
| `apps/desktop/src/data/today.ts` | 1–58 |

Cấu hình/tài sản: `Cargo.toml`, `Cargo.lock`, `tauri.conf.json`, `capabilities/default.json`, đủ năm `icons/*`. Cargo.lock: 445 package, 444 registry entry có 444 checksum; không thêm crate trong diff lượt 3 → 4. Icon xem trực tiếp bằng view_image; cấu trúc/kích thước ghi trong scope.json.

Đọc kỹ diff `119e2e4..2e51e25` của B: storage.rs (quyền/entries/cleanup/refuses + test), ai.rs (Rc, JSON-only, odd_keys + test), app-data/persist-queue/store hook/tauri-storage/tables, bốn file test đổi và cấu hình/ảnh. Theo baseline: sản phẩm +740/−218 ở 7 file; test +376/−67 ở 4 file; số này tách phần test Rust như công cụ của repo, không lấy cả file Rust làm SP.

Nguồn hợp đồng: CLAUDE.md gốc + apps/desktop/CLAUDE.md, CONTEXT.md; ADR-0016, ADR-0009 D-1; Phase 6 §4.1 S2-1…S2-6, §4.2 TR-11…13/D1…13, §5; docs/metrics/phase-6.md và e2e/perf/README.md. Common: prompt, known, baseline, fixes các Issue B và phần plan về trục/mức/L4.3–L4.8. Đối chiếu tổng hợp 15/10, 17/10, 21/10 (đặc biệt DR6-120/67 và CL3-B2), các mục phát hiện/kịch bản/bloat của báo cáo raw B các bên trong repo ở ba lượt; không dùng kết quả lượt 4 bên khác.

Điểm nối đã đọc/kiểm: database.ts (check trước migrate, persist, transaction), backup.ts/importBackup, migration 0012; App/main, AppShell/Sidebar/SaveWarning/CloseGuard/close-guard/startup-error; SettingsBackup và luồng import/purge trên build web; fixtures/support/save-state, phần title của navigation, công cụ ts-hooks/size-report. Không nhận là đã review toàn bộ C/D/E/F.

## 4. Kịch bản mới đã thử

Các ca mới ưu tiên phần vừa đổi sau lượt 3. Reproduction cũ và control của PR nằm ở bảng R. N4 là biến thể hai cổng chờ rõ ràng của ca purge-close cũ, được kiểm lại vì S2-6 đổi; không tính nó thành lỗi mới.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| N1 | Lưu lỗi thư mục → Thử lại với readonly → đầy đĩa → file bị giữ → X → Escape → Enter trên Thử lại khi hết lỗi | Câu dải đổi theo từng nguyên nhân; Escape giữ app; Enter lưu và focus về h1. Browser thật, IPC giả. | — |
| N2 | Hai cú Thử lại khi save bị giữ → đổi màn → người dùng focus link → thả save | Chỉ thêm 1 save thành công; dải mất; focus vẫn ở link, không bị retry kéo về h1. | — |
| N3 | Nhập dữ liệu tải; giữ backup và giữ save mới riêng; yêu cầu close trước khi thả backup | Chưa destroy ở cả hai cổng; cuối cùng events chính xác `backup, save, destroy`. | — |
| N4 | Nhập dữ liệu tải → dọn 113 dòng; giữ backup và save riêng → close | Thùng rác trống; chưa destroy khi save bị giữ; cuối `backup, save, save, destroy`, đúng transaction rồi VACUUM. | — |
| N5 | 15 lần đổi hash qua 5 màn; viewport 1100×700 | Title IPC và document cuối là `Cài đặt · Heritas L-CRM`; chỉ báo lưu ở viewport; 0 pageerror. | — |
| N6 | Snapshot 1 lỗi → track A → hai flush đang chờ → track B thêm sau đó → snapshot 2 lỗi → thả B khi hết lỗi | Hai flush cùng xong; writes `[1,2,2]`, file cuối `2`, failed=false; không ghi snapshot 1 đè bản mới. | — |
| N7 | Dữ liệu mới chưa lưu do đầy đĩa → close → retry vẫn lỗi thư mục → retry hết lỗi → mở lại file | Hỏi hai lần, chỉ close sau khi lưu; mở lại có cả team Latest và Seed. | — |
| N8 | Dựng file schema 12 bằng 12 migration, nạp bảng từ backup tải; mở bằng AppData hiện tại | 12→13; backup trùng nguyên byte; đúng 1 save; 113 dòng listTrash và toàn bộ tables giống trước, integrity sạch. File dựng qua API, không phải exe lượt 3 thật. | — |
| N9 | Xếp Nhập backup → Nạp lại → Dọn; giữ backup đầu, backup lượt giữa lỗi, đồng thời close | fulfilled/rejected/fulfilled; close chờ hết; mở lại có 0 rác, live counts 4 team/51 người/1.481 KH/10.255 lịch/1.674 HĐ. | — |
| N10 | 5 lần openAppData từ file tải + readBackup, storage RAM | Đúng dữ liệu mỗi lần; số đo và phạm vi so ở §6. Không dùng timing browser test làm số hiệu năng phát hành. | — |

Nguồn: `copy/e2e/b-round4.spec.ts`, `node-probes.mjs`; log `browser-new.log`, `browser-final.log`, `node-probes.log`, `node-results.json`. 5 ca save-state có sẵn cũng xanh. Tổng **10 ca browser khác nhau đã xanh** qua hai lượt: 4 ca mới ở browser-new; N4 và 5 ca chấp nhận ở browser-final (6 passed).

Mọi browser context ngay từ lần đầu đều có route chặn host ngoài `127.0.0.1` và init script thay `window.open`. Chỉ dùng server `127.0.0.1:4186`, không chiếm 4173. Bản build tạo bằng CLI Vite có sẵn, không đặt VITE_DEMO_ANCHOR hay biến build riêng; clock của ca mới đặt 29/10/2026 trước mở app.

## 5. Phát hiện mới

**Không có phát hiện mới đủ căn cứ trong phạm vi B: CONFIRMED 0, PLAUSIBLE 0.** Không tạo ID để đếm lại dòng R hoặc mục KNOWN.

Giữ các quyết định đã chấp nhận: hai điểm #819 (retry cùng lỗi không có trạng thái mới trên dải; HH:MM không ngày), K29/J5, K39 tên mã ở đường dẫn/lỗi/key service, giới hạn ba lớp escape ngoài D-1 và giả định key của K23. Không có bằng chứng mới để mở lại chúng. Không đề xuất sửa spec/golden/mockup cho khớp code.

## 6. Bloat

| Đã chạy / đọc | Phạm vi / dữ liệu | Số / kết quả | ID |
|---|---|---|---|
| `node node_modules/typescript/bin/tsc -p apps/desktop --noUnusedLocals --noUnusedParameters --noEmit` | App + import package | Không diagnostic | — |
| `node tools/codemap.mjs --check` | Bản đồ export/route | `Export maps are up to date.` | — |
| CLI dependency-cruiser đã ghim | apps/packages | Exit 0; 341 module, 1.435 dependency, không vi phạm (`dependencies-final.log`) | — |
| classifyFile/lineReport + hash | B | 19 file, 2.426 SP/5.422 test; +219 SP/+612 test so lượt 3 | — |
| Đọc export/callsite/helper | data và Rust | seedDemo, sortedByName, error predicates đều có nơi dùng sản phẩm; unsaved() cũ đã bỏ. entries/remove_interrupted/refuses có nhiều caller thật; không thấy abstraction mới thừa | — |
| Cargo.lock / Cargo.toml / diff | Rust | 445 package, 444 registry có checksum; không đổi crate; rlib duy nhất | — |
| Icon metadata và ảnh | Năm file icon | 392.270 B tổng file nguồn; ICO 87.968 B (lượt 3 16.625 B). Cây/ô trắng đúng K39, không gọi cả cỡ ảnh nguồn là cỡ nhúng exe | — |
| Bundle/exe baseline chuẩn bị ở SHA ghim | Toàn app; số dùng lại, không quy riêng B | JS/CSS 2.358.427 B, −41.966 B so lượt 3; exe 5.649.408 B, +240.640. Icon nhúng +71.343; font mới 21.884 B, ba logo149.070 B; phần còn lại không tách lại | — |

Không có phát hiện bloat mới hay đề xuất công cụ cần cài. `zod/mini` và asset thương hiệu là thay đổi xuyên gói có chủ ý; dùng số baseline chính thức để so bundle/exe. Build web riêng của B chỉ phục vụ probe UI.

## 6b. Hiệu năng

Máy Home PC `DESKTOP-KDURKJP`. Dữ liệu tải đúng `tables` SHA256 **ad82051b19415726ff2be3d86357aeb463b9f13205a30d4531667aa5a9492e25**, đã assert bằng script; file SQLite hiện tại 14.102.528 B. N10 chạy 5 lần, Node v24.20.0, storage RAM: có AppData/check/export, không I/O/IPC Rust. Khi N10 chạy không chạy cargo hay browser test song song trong phiên này; Vite preview chờ và Codex chạy nền. Không có telemetry hoạt động của các phiên khác, nên không dùng N10 để thay mốc exe.

| Đã đo / dữ liệu | Trung vị (min–max), ms | So mốc | ID |
|---|---:|---|---|
| openAppData từ file tải, Node/storage RAM | 106,5 (104,9–107,3) | Codex B lượt 3 cùng cách: 102,0 (100,3–104,8); +4,5 ms, trong nhiễu. Không so trực tiếp ngưỡng exe600 | — |
| readBackup qua AppData, Node | 834,3 (833,5–849,3) | Ghi số; không có mốc Node cùng cách để kết luận hồi quy. Không đánh đồng với backup.read trên màn | — |

Số **exe dùng lại từ common/baseline.md**, không nhận là phép đo mới của B. Lúc bước chuẩn bị đo máy rảnh; cách ngắt debugger và môi trường được ghi ở baseline/e2e perf README.

| Thao tác exe | SHA ghim, ms | Sau #656, ms | Lượt 3, ms | Ngưỡng / nhận định | ID |
|---|---:|---:|---:|---|---|
| app.open-data | 370 | 387 | 373 | ≤600; đạt, không xấu hơn | — |
| backup.read | 977 | 835 | 827 | ≤2.000; +17%/+18%, chưa vượt đồng thời >20% và >10ms | — |
| backup.import | 47 | 43 | 47 | ≤500; trong nhiễu | — |
| db.save | 149 | 151 | 146 | ≤400; trong nhiễu | — |
| trash.open | 32 | 34 | 38 | <200; đạt | — |
| Backup rồi dọn → 11j (113 dòng) | 123,3 | chưa có | 151,8 | ≤500; đạt. Lần lưu file sau cú bấm 146,0ms | — |

**Không có phát hiện P mới.** Không lấy lần có debugger, thời gian chạy unit/compile hoặc bộ nhớ Node để kết luận vượt ngưỡng thao tác exe. `listTrash` không đổi dòng sau chỉ mục 0012 được kiểm ở N8; phần đo chuyên sâu A/F không được suy thay ở B.

## 7. Bảng đếm mức × trục

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical |0|0|0|0|0|0|0|0|0|0|0|
| High |0|0|0|0|0|0|0|0|0|0|0|
| Medium |0|0|0|0|0|0|0|0|0|0|0|
| Low |0|0|0|0|0|0|0|0|0|0|0|
| Nit |0|0|0|0|0|0|0|0|0|0|0|
| Tổng |0|0|0|0|0|0|0|0|0|0|0|

CONFIRMED 0; PLAUSIBLE 0; không có tỷ lệ PLAUSIBLE cao (0/0 không được tính thành tỷ lệ). Các dòng R không đếm lại thành phát hiện.

## 8. Đã xét, không thấy

| Trục | Đã đọc / chạy | Kết quả trong phạm vi B |
|---|---|---|
| R | R1 3 dòng, R2 6 dòng; 14 đột biến bị giết, 1 inline tương đương | Không thấy phần sửa B còn thiếu hoặc hồi quy |
| E | N1–N9; Rust mutex/claim/clock/prune/permission tests, unit day watcher | Không kẹt retry/track/replace; close theo dữ liệu mới nhất |
| C | ADR-0016/D-1, S2/TR, T306/308/310, mã lỗi và title | Thứ tự lưu→backup→thay, hai save purge và nhãn/câu đúng; tên mã giữ theo K39 |
| D | File cũ schema12→13; backup hash, table equality, listTrash equality, reopen N7/N9, integrity | Không thấy mất hoặc lẫn dữ liệu giữa các lượt thay |
| G | Phần Rust của D-1: 43 test AI, odd_keys, 16.099 ca; JSON-only mutant | Chặn/che đúng phạm vi đã duyệt. Không review lại bộ guardrail tiếng Việt của C |
| S | CSP/capabilities, Rust raw/header contract, export name/folder/Explorer, stale page; mock/local HTTP | Quyền chỉ thêm set-title; không mở URL/path tùy ý; không thấy key giả lọt ở ca trong hợp đồng |
| P | N10 và baseline chuẩn bị cùng máy, các ngưỡng/luật nhiễu | Các thao tác file trong ngưỡng, không có P mới |
| B | tsc/codemap/dependency/export scan, helper refactor, Cargo/icon/bundle baseline | Không có bloat mới đủ căn cứ; không gọi chi phí thiết kế K39 là code thừa |
| T | 153 unit +116 Rust control; gỡ phần sửa và xem từng assertion đỏ | 0 đột biến không tương đương sống; không coi inline giống hệt là hở |
| A | N1 bàn phím/Escape/focus, N2 giữ focus người dùng, N5 viewport; CloseDialog SSR 5 ca | Không thấy lỗi mới ở điểm nối UI của B; không chấm thay audit giao diện D |

## 9. Phụ lục và trạng thái cuối

Tất cả đường dẫn dưới tương đối với `C:\workspace\deep-review-1-6-r4\codex\B\`.

| Nguồn / lệnh | Bằng chứng thật |
|---|---|
| `rustc --edition 2021 --test copy/apps/desktop/src-tauri/src/storage.rs -o storage-tests.exe`; `storage-tests.exe --test-threads=1` | storage-baseline.log: `73 passed; 0 failed` |
| `cargo test --offline --locked --lib --manifest-path copy/apps/desktop/src-tauri/Cargo.toml --target-dir rust-target` | rust-baseline.log: `116 passed; 0 failed`; key store mock, HTTP/TLS server 127.0.0.1, không gọi OpenCode thật |
| Vitest CLI trực tiếp trên bản chép, 7 file data +close-guard/CloseGuard/startup-error | unit-baseline.log: `10 passed (10)` / `153 passed (153)` |
| `node mutations.mjs`, `mutation-permission.mjs`, `mutation-ai.ps1` và `node mutation-inline.mjs` | Đột biến trong bảng dưới, file bản chép được phục hồi trong finally; scope.json kiểm hash |
| `node node-probes.mjs` | node-results.json +node-probes.log: N6…N10 PASS, đủ tham số/thời gian từng lần |
| `node node_modules/@playwright/test/cli.js test -c playwright.b.config.ts` và lượt lọc ca chạy lại | browser-new.log và browser-final.log; cấu hình/fixture có network guard trước page use |
| `audit-summary.mjs`, scope.json, dependencies-final.log | Inventory/hash và kiểm ranh giới module. Lần gọi dependency CLI đầu dùng sai tên file nên MODULE_NOT_FOUND; đã đọc package.bin, chạy đúng dependency-cruiser.mjs và xanh |
| `session-progress.md` | Bản lưu các ghi chép dần trước khi sắp lại báo cáo cuối |

| Đột biến | Thay đổi trên bản chép | Kết quả test |
|---|---|---|
| R120-readonly | Bỏ mapping READ_ONLY trong refused | 2 đỏ, 7 xanh (subset Rust a_save_) |
| R120-folder | Bỏ mapping FOLDER_READ_ONLY | 1 đỏ, 8 xanh (cùng subset) |
| R67-cleanup | Bỏ gọi dọn backup ở first open | 1 đỏ |
| T293-backups | entries nuốt lỗi read_dir thành danh sách rỗng | 1 đỏ (backups ACL thật) |
| T294-track | Bỏ saves.track(turn) | 2 đỏ, 75 xanh |
| CL3B2-retry | Bỏ persist(lost) của flush | 3 đỏ, 9 xanh |
| T294-listener | Ném lại lỗi listener thay vì báo console.error | 1 đỏ, 11 xanh |
| T295-check | Không truyền refuseDamaged khi mở stored | 3 đỏ, 74 xanh |
| T295-duplicate | openFrom luôn persist dù đã migrated | 1 đỏ, 76 xanh |
| T295-measures | Không clearMeasures khi đủ50 | 1 đỏ, 76 xanh |
| T308-name | productName về Project-2C | 1 đỏ, 16 xanh |
| T310-title | title cửa sổ về Project-2C | 1 đỏ, 16 xanh |
| T293-permission | Thay allow-set-title bằng allow-hide | 1 đỏ, 16 xanh |
| T293-json-only | Lượt cuối của readings dùng All thay Json | 2 đỏ, 41 xanh (Rust AI) |
| R67-inline | Inline lại hai vòng dọn giữ nguyên tác dụng | **Sống tương đương: 73 xanh**, hash khôi phục đúng. Không phải test hở |

Các log `R*.log`, `T*.log`, `CL3B2-retry.log` chứa assertion thật; `mutations-summary.json` giữ 14 đột biến không tương đương. Driver mutations lần đầu dừng ở phép thay quyền không khớp CRLF sau khi 12 ca đã chạy; đã sửa phép thay và chạy riêng permission. Không coi lỗi harness là lỗi sản phẩm.

Browser lượt đầu có lỗi harness: kỳ vọng câu thư mục tự viết khác vi.ts; focus link đặt trước effect điều hướng; dữ liệu tải neo12/10 bị clock15/09 từ chối đúng luật10. Đã sửa harness dùng câu gốc, chờ focus điều hướng, clock29/10. N4 ban đầu kỳ vọng một save, trong khi purge đúng có transaction+VACUUM; kỳ vọng cuối là hai save. Không sửa code sản phẩm, không đưa các lỗi này thành phát hiện.

Bản chép lấy từ 793 file git-tracked, dùng junction node_modules sẵn có (root và từng package); **không chạy pnpm trong bản chép**. Bốn junction @p2c của worktree gốc vẫn trỏ `C:\workspace\Project-2C-review-2\packages\...`. Các file nguồn B của bản chép khớp SHA256 gốc; repo không bị patch lần nào. Không đọc key thật, không mở chatgpt.com, không gọi dịch vụ AI.

Giới hạn kiểm: không chạy lại toàn bộ verify/e2e chuẩn hoặc exe native/perf trong phiên B; dùng cổng chuẩn bị đã xanh ở đúng SHA (3.975 unit,116 Rust,308 e2e) và số exe baseline. Browser của B là build web thật +IPC Tauri giả; Rust chạy riêng trên filesystem Windows thật. Các kết luận không vượt phạm vi những phép kiểm đó.

- SHA cuối phiên: `2e51e25eb0125f56d3d938b97ef18d6873dae076`.
- `git status --short` cuối phiên: rỗng, như đầu phiên.
- Server probe 4186: đã dừng; không còn listener 4186.
- Hoàn tất: 2026-10-29 02:38:05 +07:00 (Asia/Bangkok).

