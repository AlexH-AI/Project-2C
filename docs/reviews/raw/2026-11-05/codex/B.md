XONG — codex gói B lượt 5, 2026-11-04 22:48:07 +07:00

# Gói B — File và Rust

## 1. Phiên review

- Bên và gói — Codex, B, lượt 5.
- SHA đầu phiên — `37a80b662861d308a110d1e2b0f65ad13b91fb51` (detached).
- `git status --short` đầu phiên — đầu ra rỗng.
- Giờ bắt đầu — 2026-11-04 22:30:54 +07:00 (Asia/Bangkok).
- Công cụ — Codex desktop; codex-cli 0.162.1. Model GPT-6.1 Sol theo thiết lập Owner ghi trong prompt. Mức suy luận không được phiên công cụ công bố.


## 2. Bảng R1 và R2

Đối chứng trên SHA ghim: Vitest 228/228 test, 12 file; Rust storage 77/77. Cổng đầy đủ của bước chuẩn bị xanh: 4 387 unit test, 120 test Rust, 324 e2e.


### R1

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-138 | #897 → #915 | **ĐÃ SỬA** | Đối chứng Rust 77/77, TS 228/228. Nới 6 cấu hình CSP gốc và đổi identifier: mỗi bản chép 1/18 đỏ đúng ca; bỏ lọc chỉ file: 3/77 đỏ; bỏ ánh xạ ổ đầy: 1/77 đỏ đúng ca. | Thêm worker-src *: 1/18 đỏ. Các ca thư mục phủ khởi động, chọn bản mới nhất và giữ đúng số backup. |
| DR6-139 | #898 → #911 | **SỬA MỘT PHẦN** | Bỏ vòng lặp cuối hoặc chỉ chờ ghi: mỗi lần 2/92 đỏ. Với lần ghi đang chạy, probe qua AppData chờ cả lượt nhập tới muộn và lượt ghi mới. | Probe gốc DSR4-B1 còn lộ khi ban đầu rảnh, gọi đóng rồi Nạp lại cùng lượt JavaScript, backup bị giữ. CXR5-B1, kịch bản 1. |
| DR6-140 | #898 → #911; #933 → #946 | **ĐÃ SỬA** | Gọi listener trần như cũ: 1/79 đỏ ở đúng ca DR6-140 (Error: listener bug). Đối chứng trả kết quả, ghi team, báo lỗi một lần và gọi listener sau. | Probe AppData: tự gỡ chỉ gọi một lần, hai lệnh trả kết quả và hai lượt ghi đều xong. |
| DR6-147 | #898 → #911 | **ĐÃ SỬA** | Playwright build web/Exe giả: dải gỡ, focus lên H1; OpenCode giả lưu được, hộp gỡ, hai sự kiện cuối là save → destroy, MutationObserver không thấy câu chương trình khác. Gỡ trả focus: ca gốc và ca đổi team đều đỏ ở H1. Gỡ tự trả lời: e2e đỏ ở save/destroy, unit 1/8 đỏ. | Biến thể lỗi lần thử lại đổi READ_ONLY → DISK_FULL; Escape giữ cửa sổ; bấm X lại khi file ghi được thì save → destroy. |

### R2

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-332 | #933 → #946 | **ĐÃ SỬA** (phần B) | Ba store dùng notify; dời catch ra ngoài vòng lặp: 4/108 đỏ, một ở helper và một ở mỗi store (AppData, PersistQueue, AiJobs). | Probe tự gỡ và ném qua AppData/hàng đợi lưu giữ thứ tự listener và kết quả lệnh. CXR5-B2 là lỗi hàng đợi có sẵn khi listener gọi lệnh lồng. |


## 3. Phạm vi đã đọc

| Phạm vi | Dòng / phần đã rà |
|---|---|
| `src-tauri/src/storage.rs` | 1–682 (lệnh và helper); 683–2207 (các nhóm test, đọc kỹ ca mới và ca gần: ổ đầy, prune/reuse, lock, ACL, export nguyên tử). |
| `src-tauri/src/lib.rs`, `main.rs`, `build.rs` | 1–205, 1–6, 1–3. Lệnh Tauri, cổng blocking, tên file, mã lỗi, khởi động, đăng ký command. |
| `src-tauri/src/ai.rs` | Phần lệnh/helper 1–579, xem nhóm test 580–2052 theo D-1: request, redaction, timeout, transport local, credential seam và URL cố định. Đối chứng Rust chạy riêng `storage.rs`; kết quả crate đủ 120 test lấy ở baseline. |
| `src-tauri` cấu hình và asset | `Cargo.toml` 1–34, `tauri.conf.json` 1–31, `capabilities/default.json` 1–12; kiểm khóa của crate và diff `Cargo.lock` (4 655 dòng sinh tự động); 5 icon theo byte và trạng thái Git. Đọc metadata exe ghim. |
| `src/data` | `app-data.ts` 1–496, `persist-queue.ts` 1–142, `listeners.ts` 1–15, `tauri-storage.ts` 1–91, `AppDataContext.tsx` 1–64, `tables.ts` 1–72, `today.ts` 1–58, `demo-snapshot.ts` 1–45. Đọc kỹ mọi ca đổi trong diff, nhóm khởi động/thay/lưu/backup trong `app-data.test.ts` (1 563 dòng) và các suite còn lại trong gói (dài 28–382 dòng); chạy toàn bộ `src/data`. |
| Chỗ nối | `AiJobs`, `ai-analysis.ts`, `close-guard.ts`, `CloseGuard.tsx`, `SaveWarning.tsx`, `startup-error.ts`, `SettingsBackup.tsx`, chuỗi i18n lưu, `e2e/save-state.spec.ts`, `e2e/support.ts`, mở/migrate qua `@p2c/db`. |
| Nguồn hợp đồng và lượt trước | `CLAUDE.md` gốc và desktop, `CONTEXT.md`, ADR-0016 và ADR-0009 D-1, spec Phase 6 §4.1/4.2/5, `phase-6.md`; các phần liên quan của bốn tổng hợp và raw B lượt 1–4, nhất là CLR4-B1…B3, DSR4-B1/B2 và CLR4-D3. Đối chiếu `known.md`, `fixes.md`, `baseline.md`, `plan.md` §L5.3–L5.8. |

Diff `2e51e25..37a80b6` phần B có 8 file, +232/−23. Đọc toàn bộ diff: `storage.rs` +85/−3, `app-data.ts` +5/−2, `persist-queue.ts` +8/−10, `listeners.ts` +15; bốn file test +119/−8. Thay đổi Rust duy nhất là `storage.rs`. Xem thêm diff #911 ở shell và #946 ở ba nơi gọi listener để kiểm các đường nối.

## 4. Kịch bản mới đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | Hàng đợi rảnh, gọi đóng rồi Nạp lại trong cùng lượt JS qua AppData, giữ backup. Tái hiện gốc DSR4-B1. | events = [destroy, backup], replacing=true, saving=true tại lúc đóng. | CXR5-B1 |
| 2 | Ghi đang giữ → đóng + Thử lại → Nạp lại lỗi ổ đầy → Nhập backup được xếp sau; xuất và thử ghi trong khi thay. | Xuất đọc đủ 2 team cũ; ghi bị DATA_REPLACING; save → backup lỗi → backup → save → destroy. Mở lại chỉ thấy Team từ bản nhập. | — |
| 3 | Listener tự gỡ, listener khác ném, gọi hai lệnh qua AppData và đọc tables. | Hai lần save; hai lần báo lỗi, các listener sau vẫn chạy và listener tự gỡ chỉ chạy một lần. | — |
| 4 | Listener báo lưu xong gọi lồng hai lệnh ghi rồi đóng app; giữ từng lần lưu. | Ba lượt ghi đã vào cổng, hai lượt cuối cùng chồng nhau; destroy khi file có Team B và còn thiếu Team C đang ở bộ nhớ. | CXR5-B2 |
| 5 | Mở file đã lưu, backup báo DISK_FULL, gỡ lỗi rồi mở lại. | STARTUP_BACKUP_FAILED có cause=DISK_FULL; không save trong cả hai lượt mở, tên team cũ còn. | — |
| 6 | Exe giả: lưu lỗi READ_ONLY → đóng → Thử lại lỗi DISK_FULL → Escape → mở lại lần đóng sau khi file ghi được. | Hộp đổi sang nguyên nhân đĩa đầy, Escape gỡ hộp và giữ app, lần đóng sau có save → destroy. | — |
| 7 | Exe giả: giữ phân tích OpenCode → lưu ghi chú KYC chỉ có chữ, save báo DISK_FULL → focus ở Thử lại → phân tích trả kết quả và ghi được. Tái hiện CLR4-D3 K1. | Dải gỡ, focus ở H1 Hồ sơ khách hàng. Bỏ nhánh đưa focus thì H1 inactive. | — |


## 5. Phát hiện mới

### CXR5-B1 — Đóng khi hàng đợi ban đầu rảnh có thể đi trước lần thay gọi cùng lượt

- **Mức** Low. **Trục** R. **Tình trạng** CONFIRMED.
- **Vị trí** `apps/desktop/src/data/persist-queue.ts:125`, `apps/desktop/src/shell/close-guard.ts:28`, `apps/desktop/src/data/app-data.ts:391` (`37a80b6`).
- **Liên quan** DR6-139, T-321 (#898 → #911). Nhánh có từ trước, đã có trong tái hiện gốc DSR4-B1 và còn lại sau #911.
- **Kịch bản** 1; đối chứng và biến thể 2.
- **Mô tả** Khi có lượt ghi, vòng mới của `flush()` chờ được lần thay đến muộn. Khi hàng đợi rảnh, cả hai vòng đều bị bỏ qua và promise đã resolve trước khi lần thay cùng lượt được track. `closeAfterSaving()` sau đó gọi `close()` trong lúc lần thay đang chạy, trái S2-6 trong tái hiện gốc.
- **Tái hiện / bằng chứng** Trong bản chép, `node node_modules/vitest/vitest.mjs run apps/desktop/src/data/b-review.test.ts --reporter verbose` (`B\app-cases.log`): `same turn, no running save: {"events":["destroy","backup"],"replacing":true,"saving":true}`. Qua `openAppData`, `closeAfterSaving` thật và cổng file/cửa sổ giả. Không chèn SQL, không gọi trực tiếp Rust. Test là tái hiện, nên xanh khi quan sát đúng lỗi.
- **Ảnh hưởng** Một lần thay vừa bắt đầu có thể chưa ghi kịp khi cửa sổ đóng. File cũ vẫn đầy đủ trong probe. Điều kiện đã xác nhận là lời gọi cùng lượt JS, chưa tái hiện bằng hai thao tác tay trên bản dựng.
- **Đề xuất** Kiểm lại việc đến cùng lượt trước khi quyết định đóng, và thêm ca S2-6 với hàng đợi rảnh. Khoảng 10–20 dòng SP, dưới 400.

### CXR5-B2 — Listener gọi hai lệnh ghi lồng có thể làm hai lượt lưu chồng nhau

- **Mức** Low. **Trục** E. **Tình trạng** CONFIRMED.
- **Vị trí** `apps/desktop/src/data/persist-queue.ts:84` và `:99` (`37a80b6`).
- **Liên quan** Hàng đợi lưu của T-294. Thứ tự `running = undefined` → gọi listener → lặp `waiting` đã có ở `2e51e25`; helper của T-332 giữ lại thứ tự đó. Chạy cùng probe với persist-queue.ts từ 2e51e25 cho cùng kết quả (app-cases-r4-queue.log).
- **Kịch bản** 4.
- **Mô tả** Lượt ghi vừa xong đặt `running` về rỗng trước khi gọi listener. Nếu listener đồng bộ ghi hai lần, lệnh thứ nhất mở một `drain` mới, còn `drain` cũ tiếp tục lấy snapshot thứ hai. Một lượt có thể bỏ cờ bận trong khi lượt kia vẫn giữ snapshot chưa lưu.
- **Tái hiện / bằng chứng** Cùng lệnh Vitest, ca `a save listener that queues two AppData commands...`: `listener reentrancy: {"started":3,"events":["save","save","destroy","backup"],"onDiskAtClose":["Team A","Team B","Team gốc"],"inMemory":["Team A","Team B","Team C","Team gốc"]}`. Giữ từng lần ghi bằng promise, gọi lệnh qua `AppData.run`, rồi đọc lại file giả qua `openAppData().tables()`. Mục `backup` cuối là do phép mở lại file của probe.
- **Ảnh hưởng** Nếu có listener ghi đồng bộ khi nhận thông báo lưu xong, đóng app có thể diễn ra khi snapshot mới nhất chưa xong. Đây là ca cổng dữ liệu với listener thử nghiệm; các listener sản phẩm đã đọc không gọi hai lệnh ghi theo chuỗi này.
- **Đề xuất** Giữ quyền lấy snapshot kế tiếp ở một `drain` duy nhất khi đang phát thông báo, hoặc kết thúc hẳn `drain` cũ nếu đã nhả quyền cho lần sau. Ghim số lượt ghi đồng thời và snapshot lúc đóng bằng test. Khoảng 15–30 dòng SP, dưới 400.

## 6. Bloat

| Kiểm tra | Dữ liệu / phạm vi | Kết quả | ID |
|---|---|---|---|
| `tsc -p apps/desktop/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` | Desktop và import từ packages | Exit 0, không có khai báo không dùng theo hai cờ. | — |
| `dependency-cruiser`, `node tools/codemap.mjs --check`, `cargo fmt --check` | Repo ghim | 354 module, 1 582 cạnh, không vi phạm. Codemap đúng. Rust format sạch. | — |
| Số dòng và diff, theo `common\baseline.md` | Gói B | 2 457 dòng SP, 5 600 dòng test, +31/+178 so lượt 4. Ba vòng lặp gọi listener chuyển sang một helper 15 dòng. Phần ghi file Rust vẫn dùng std; không đổi Cargo.lock hay quyền. | — |
| Cỡ bundle web và exe, số từ bước chuẩn bị | Toàn build, cả gói khác | JS/CSS 2 366 456 B thô / 699 761 B gzip, +8 029/+2 627 B so lượt 4. Không quy chênh lệch bundle toàn app cho B. Exe 5 649 408 B, bằng G7 và lượt 4. 5 icon không đổi, tổng 392 270 B trong Git. | — |

## 6b. Hiệu năng

Mốc trên exe chép từ `common\baseline.md` §Đo trên exe, đối chiếu `docs/metrics/phase-6.md` và `plan.md` §L5.6. Home PC DESKTOP-KDURKJP, Node v24.20.0; file tải 16 034 517 B, SHA256 `B3C9903321ABCCDF3301818D35DAD7D7C6EAC48D73814286694B554C94C77293`. Bản SQLite nhập qua AppData có 14 102 528 B và 1 481 KH / 10 255 lịch đang dùng. LCP lần đầu dùng seed demo theo mốc, tách khỏi dữ liệu tải.

| Phép đo (ms) | Lượt 5 | Sau #656 | G7 | Lượt 4 | Ngưỡng / ghi chú | ID |
|---|---:|---:|---:|---:|---|---|
| Mở lần đầu, LCP, trung vị 3 | 3 535 | 3 663 | 3 420 | 3 521 | Ngưỡng Phase 4 là 4 724 theo luật nhiễu; đạt. | — |
| Lưu file DB lần đầu, trung vị 3 | 150 | 119 | 123 | 119 | +31 ms/+26% so #656 và lượt 4, +27 ms/+22% so G7. Dòng phụ vượt luật nhiễu trên seed mới, ghi cho F xét theo baseline. | — |
| Mở lại, LCP, trung vị 3 | 710 | — | 617 | — | ≤ 1 000; +93 ms/+15% so G7. | — |
| `app.open-data`, 1 | 330 | 387 | 320 | 370 | ≤ 600. | — |
| `db.save`, trung vị 15 | 150 | 151 | 148 | 149 | ≤ 400; min–max 148–157. | — |
| `backup.read`, trung vị 5 | 983 | 835 | 975 | 977 | ≤ 2 000; +148 ms/+18% so #656. | — |
| `backup.import`, trung vị 5 | 50 | 43 | 44 | 47 | ≤ 500. | — |
| `backup.export`, trung vị 5 | 438 | 438 | 435 | 436 | ≤ 1 000. | — |
| Dọn sạch tới 11j, 1 lần | 128,0 | — | 130,5 | 123,3 | ≤ 500. Lần save đầu sau cú bấm 162,2 ms, lượt 4 146,0 ms. | — |

Sáu `reload.*` đều dưới 500 ms (285–407 ms). Tăng nhiều nhất so #656 là Tổng quan +9 ms; không dòng thao tác chính nào vượt đồng thời +20% và +10 ms so mốc đối chiếu. Dùng số đo exe của bước chuẩn bị. Probe bổ sung dưới đây chỉ chạy lệnh Rust.

| Probe Rust bổ sung, trung vị (min–max), ms | Dữ liệu / số lượt | Lượt 5 | Lượt 4 | ID |
|---|---|---:|---:|---|
| Tạo backup mới, gồm flush + rename | DB 14 102 528 B, 9 cặp xen kẽ thứ tự | 15,362 (14,543–15,791) | 15,592 (14,672–19,258) | — |
| Dùng lại bản giống byte | Cùng file và 9 cặp | 7,845 (7,325–8,664) | 8,047 (7,482–11,822) | — |

Probe gọi lệnh Rust thuần với đúng nguồn ở hai SHA, dùng `rustc 1.98.1 -O` trên Home PC. Chép file đầu vào ra ngoài phần bấm giờ. Khi bắt đầu có 15 tiến trình Chrome và 5 Node, không có tiến trình project2c trong mẫu tên tiến trình. Đây là số đo hẹp lệnh backup, không bao gồm IPC/JS và không có mốc cùng cách ở #656 hay G7.

## 7. Bảng đếm mức × trục

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

2 CONFIRMED, 0 PLAUSIBLE, 0 KNOWN có bằng chứng mới. R1 có 3 ĐÃ SỬA, 1 SỬA MỘT PHẦN. R2 có 1 ĐÃ SỬA trong phần gói B.

## 8. Đã xét, không thấy

| Trục | Đã xét và kết quả |
|---|---|
| R | Kịch bản 1 tái hiện phần còn lại của DR6-139. Ba dòng R1 khác và phần B của T-332 có test đỏ khi gỡ. |
| E | Đã giữ và thả từng cổng ghi/backup, thử xuất lúc thay, lỗi trước import, listener tự gỡ, listener gọi lệnh lồng. CXR5-B2 ở nhánh gọi lệnh lồng. Không thấy vấn đề khác trong các chuỗi đã thử. |
| C | Đối chiếu ADR-0016, S2-1…S2-6, TR-11, K35 và K39 với unit, probe AppData và e2e. Vi phạm S2-6 đã ghi ở R/E. Không thấy lệch khác trong các ca đã chạy. |
| D | Mở lại bytes đã lưu qua AppData, so team trước/sau Nhập, kiểm export đủ dữ liệu cũ và backup lỗi không kích hoạt save lúc mở. 77 test Rust phủ ghi nguyên tử, lock, tệp lỗi và giữ backup. Ngoài hai phát hiện hàng đợi, không thấy. |
| G | Đã đọc luồng Rust D-1 từ kiểm đối số → seam key → URL cố định → giải mã/che lỗi. E2E dùng OpenCode giả và cổng loopback. Kết quả crate đầy đủ về transport/che key lấy ở baseline. Không thấy bằng chứng mới trong phạm vi B. |
| S | Kiểm CSP đủ 8 chỉ thị, 8 đột biến cấu hình/identifier, quyền cửa sổ main và contract lệnh. Test Rust chặn tên export sai, ghi từ page cũ và đụng khóa file. Không thấy vấn đề mới. |
| P | Đối chiếu mốc exe và đo riêng backup trên tải. Không thấy thao tác chính nào vượt ngưỡng. Chênh lệch lần lưu đầu trên seed ở §6b. |
| B | Typecheck noUnused, bản đồ import/export, diff Cargo/asset và helper chung ở §6. Không thấy. |
| T | 15 biến thể JS/Rust trong script đều bị test bắt. Hai thay đổi gỡ sửa trên bản dựng bị e2e bắt. Nhánh rảnh/cùng lượt và listener gọi lệnh lồng được tái hiện bằng probe tạm. |
| A | Playwright kiểm focus Thử lại → H1 ở Team và hồ sơ KH, hộp đóng app, nguyên nhân mới sau lần Thử lại và Escape. Không thấy vấn đề mới trên các đường này. |

## 9. Phụ lục

Các đường dưới đây tính từ `C:\workspace\deep-review-1-6-r5\codex\B\`.

| Nguồn / log | Lệnh / nội dung |
|---|---|
| `mutations.mjs`, `mutations.log`, `control-js.log`, `control-storage.log`, `R138-*.log`, `R139-*.log`, `R140-old-app.log`, `R332-outer-catch.log`, `R147-no-auto-answer.log` | Tại `mirror`, `node ..\mutations.mjs`. Control 228 Vitest / 77 Rust. 15 biến thể: CSP/identifier 8, Rust 2, flush 2, AppData 1, notify 1, close 1. Từng biến thể có test đỏ, không có biến thể sống trong ma trận. |
| `app-cases.test.ts`, `app-cases.log`, `app-cases-r4-queue.log`, `persist-queue-r4.ts` | Chép test vào `mirror/apps/desktop/src/data/b-review.test.ts`, chạy `node node_modules/vitest/vitest.mjs run apps/desktop/src/data/b-review.test.ts --reporter verbose`. Đối chứng queue cũ lọc hai ca bằng `-t 'same turn\|a save listener that queues'`, cả hai tái hiện. |
| `mirror/b-serve.mjs`, `mirror/b-playwright.config.ts`, `mirror/e2e/b-save-state.spec.ts` | Tại `mirror`, `node node_modules/@playwright/test/cli.js test -c b-playwright.config.ts --grep 'DR6-147\|Gói B'`. Bản dựng đặt `VITE_DEMO_ANCHOR=15/09/2026` như fixture repo. Edge, một worker, port 4197, route chặn ngoài 127.0.0.1, thay `window.open` trước tải trang, service worker bị chặn. |
| `R147-browser-retry.log`, `R147-original-focus-fixed.log` | Đối chứng Playwright 3 ca (2 DR6-147 và biến thể Escape) + 1 ca focus gốc K1. |
| `R147-browser-mutation-focus.log`, `R147-original-focus-mutation.log`, `R147-browser-mutation-close.log` | Gỡ `heading.current?.focus()` trong listener của `SaveWarning.tsx`: ca Team và K1 đỏ ở H1. Gỡ lệnh gọi `answer('retry')` khi hết lỗi trong listener của `close-guard.ts`: ca hộp đóng đỏ ở save/destroy. Cả hai đã hoàn nguyên. |
| `mirror/b-load.mjs`, `perf-input.log`, `backup-perf.rs`, `storage-r4.rs`, `storage-r5.rs`, `backup-perf.csv`, `backup-perf-env.log` | Chuyển bộ tải bằng `openAppData().readBackup`, rồi chạy `rustc --edition=2021 -O -Awarnings backup-perf.rs -o backup-perf.exe`; gọi exe với đường dẫn SQLite và thư mục scratch mới. 9 cặp xen kẽ, 9 mẫu mỗi SHA cho mỗi thao tác. |

CLI `pnpm` qua Corepack không có cache phiên bản ghim và không tải được qua DNS của sandbox. Dùng trực tiếp CLI sẵn có qua junction `node_modules`; bốn `@p2c/*` trong bản chép phân giải về mã repo ghim. Sau ENOENT của Vitest lần đầu, chuyển TEMP/TMP sang đường dẫn ghi được. Hai lỗi chuẩn bị Playwright (dạng ngày neo và đối số helper ghi chú) đã sửa trong probe. Log ban đầu giữ riêng và không tính là đột biến bị bắt.

Giới hạn bằng chứng: kiểm màn qua bản dựng web với exe giả, kiểm lệnh Rust qua seam trên Windows. Kiểm CSP qua cấu hình và ca hợp đồng. Cổng build exe và bộ Rust đủ lấy từ `common\baseline.md`. Hai phát hiện đều ở cổng AppData, chưa xác nhận đường thao tác UI bình thường. Chỉ dùng AI giả và loopback. Không patch worktree. 32/32 file Git thuộc phần B và hai file shell trong bản chép có SHA256 khớp gốc sau hoàn nguyên.

- SHA cuối phiên — 37a80b662861d308a110d1e2b0f65ad13b91fb51.
- git status --short cuối phiên — đầu ra rỗng.
- Giờ xong — 2026-11-04 22:48:07 +07:00 (Asia/Bangkok).
