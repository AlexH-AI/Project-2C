XONG — muse gói B, 23:02 14/10/2026
# Báo cáo soát sâu lượt 1 — gói B: File và Rust

## 1. Thông tin phiên

- Bên soát: `muse`
- Gói: B — File và Rust
- Mã chốt đầu phiên: `885534549808f42aec7f9af5743bbf86642ee4bd`
- Lệnh kiểm chốt:
  `git -c safe.directory=C:/workspace/Project-2C-review-2 -C C:\workspace\Project-2C-review-2 rev-parse HEAD`
  cho `885534549808f42aec7f9af5743bbf86642ee4bd`, khớp mã chốt đã giao.
- Tình trạng cây đầu phiên (`status --short`): trống, không có tập tin đổi.
- Giờ bắt đầu: 22:48 14/10/2026
- Thư mục làm việc: `C:\workspace\deep-review-1-6\muse\`
- Kho nguồn chỉ đọc: `C:\workspace\Project-2C-review-2`

## 2. Phạm vi đã đọc

Phạm vi gói theo bảng: `apps/desktop/src-tauri/**`, `apps/desktop/src/data/**` trừ tập tin trí tuệ nhân tạo. Đã đọc toàn bộ tập tin sau ở mã chốt đã giao, kèm chỗ nối ở gói khác:

- `apps/desktop/src-tauri/src/storage.rs` (1 401 dòng, cả kiểm thử): khóa tập tin, mở, lưu nguyên tử, sao lưu, xuất, dọn dẹp.
- `apps/desktop/src-tauri/src/lib.rs` (205 dòng): các lệnh gọi từ màn hình, mào đầu, khóa dùng chung.
- `apps/desktop/src-tauri/src/ai.rs` (đọc 1 100 dòng đầu, trọng tâm giữ khóa, gọi mạng, che khóa): chỉ xét ranh giới giữ khóa và gọi mạng, phần còn lại thuộc gói trí tuệ nhân tạo.
- `apps/desktop/src-tauri/src/main.rs`, `build.rs`, `Cargo.toml`, `tauri.conf.json`, `capabilities/default.json`.
- `apps/desktop/src/data/app-data.ts` (436 dòng), `app-data.test.ts` (1 120 dòng): mở dữ liệu, hàng đợi thay dữ liệu, xuất nhập.
- `apps/desktop/src/data/persist-queue.ts` (79 dòng), `persist-queue.test.ts` (185 dòng): hàng đợi ghi.
- `apps/desktop/src/data/tauri-storage.ts` (61 dòng), `tauri-storage.test.ts` (75 dòng), `tauri-contract.test.ts` (217 dòng): cổng gọi lệnh Rust và hợp đồng.
- `apps/desktop/src/data/tables.ts` (68 dòng), `tables.test.ts` (42 dòng): bảng đọc lười.
- `apps/desktop/src/data/demo-snapshot.ts` (45 dòng), `demo-snapshot.test.ts` (46 dòng): ảnh dữ liệu mẫu.
- `apps/desktop/src/data/today.ts` (58 dòng), `today.test.ts` (81 dòng): ngày của app.
- `apps/desktop/src/data/AppDataContext.tsx` (52 dòng): cầu nối màn hình.
- Chỗ nối đã đọc: `apps/desktop/src/data/ai-analysis.ts` (hàm bỏ kết quả khi thay dữ liệu), `apps/desktop/src/data/ai-tauri.ts`, `apps/desktop/src/main.tsx`, `apps/desktop/src/App.tsx`, `apps/desktop/src/shell/close-guard.ts`, `apps/desktop/src/shell/CloseGuard.tsx`, `apps/desktop/src/shell/block-reload.ts`, `apps/desktop/src/shell/startup-error.ts`, `apps/desktop/src/shell/SaveWarning.tsx`, `apps/desktop/src/routes/SettingsBackup.tsx`, `apps/desktop/src/routes/SettingsDataFile.tsx`, `apps/desktop/src/routes/reports/ReportExport.tsx` và hàm đặt tên tập tin xuất, `apps/desktop/src/i18n/vi.ts` (các câu lưu trữ), `packages/db/src/backup.ts` (giới hạn 100 MB), `packages/domain/src/period.ts` (dấu tên tập tin).

Tài liệu đã đọc: `CLAUDE.md` gốc và của `apps/desktop`, `CONTEXT.md`, `docs/design/phase-6-hoan-thien.md` §4.1, quyết định lưu trữ và quyết định trí tuệ nhân tạo phụ lục giữ khóa, `docs/metrics/phase-6.md` ngưỡng, `e2e/perf/README.md`, `common/plan.md`, `common/known.md`, `common/baseline.md`.

## 3. Phát hiện

```
ID: MU-B1
Mức: Nit
Trục: B
Vị trí: apps/desktop/src/data/persist-queue.ts:14 (8855345)
Tình trạng: CONFIRMED
Mô tả: Hàm `unsaved()` của hàng đợi ghi chỉ được kiểm thử gọi, màn hình không nơi nào gọi.
Tái hiện / bằng chứng: lệnh tìm `\.unsaved\b` trong `apps`, `packages` chỉ thấy sáu lần gọi ở `persist-queue.test.ts` và một trường tên trùng ở `Settings.tsx` (không phải hàm này); tìm trong `e2e`, `tools` không thấy. Đã chạy kiểm thử lớp dữ liệu: 170 kiểm thử qua.
Ảnh hưởng: người đọc tưởng còn chỗ dùng; giữ thêm chữ mà không giữ hành vi nào.
Đề xuất: bỏ hàm khỏi mặt ngoài và khỏi bản cài (`:14`, `:66`), sửa kiểm thử sang dùng `failed()` và `idle()`; cỡ vài dòng sản phẩm. Kiểm thử giữ hành vi: `persist-queue.test.ts` sau khi sửa, `app-data.test.ts` không đổi.
```

## 4. Mục bloat

| Đã chạy / đọc | Trên dữ liệu nào | Kết quả | Phát hiện |
|---|---|---|---|
| `tsc --noUnusedLocals --noUnusedParameters --noEmit` trong `apps/desktop` | mã nguồn | 0 dòng báo, không có biến hay tham số thừa | không |
| Tìm nơi gọi từng xuất của `src/data` (không kể kiểm thử) | mã nguồn | mọi xuất đều có nơi gọi, trừ `PersistQueue.unsaved()` | MU-B1 |
| `pnpm lint:deps` | mã nguồn | không vi phạm (309 khối, 1 244 phụ thuộc) | không |
| `cargo clippy --lib --tests -- -W clippy::pedantic` một lần | mã Rust | 37 báo, toàn văn tài liệu và phong cách, không có lỗi làm việc (chi tiết ở phụ lục) | không |
| Đọc `Cargo.toml`, đối chiếu dùng crate | mã Rust | `tauri`, `keyring-core`, `serde`, `serde_json`, `ureq`, kho khóa Windows, `tauri-build` đều có chỗ dùng | không |
| Tìm mã lặp từ ba nơi trong phạm vi gói | mã nguồn | không thấy; cặp `newPage` và `newSessionId` chỉ hai nơi, đã ghi ở sổ | không |
| Cỡ gói theo bản đồ (`build:web` ở số nền) | bản dựng | `index.js` 891 942 byte thô, không đổi so nền; tập tin gói B nằm trong đó, không tách chunk | không |
| Tập tin `.tmp` sót ở `backups` khi tắt ngang lúc sao lưu | đọc `storage.rs` | còn sót như sổ đã ghi, không có bằng chứng mới nên không nêu | không |

## 5. Mục hiệu năng

Máy đo: Office Laptop `D13_THINKPAD`, cắm sạc, chế độ Balanced, không chạy việc nặng song song. Số tham chiếu cùng máy ở `common/baseline.md` (probe trên exe, dữ liệu tải 1 496 khách hàng, 10 414 lịch hẹn). Đo thêm trong Node bằng `B/perf-probe.mjs` trên cùng tập tin tải.

| Đã chạy / đo | Trên dữ liệu nào | Kết quả | Phát hiện |
|---|---|---|---|
| Probe tham chiếu `db.save` (15 lần) | dữ liệu tải trong exe | trung vị 160 ms, ngưỡng ≤ 400 ms, đạt | không |
| Probe tham chiếu `backup.read` | dữ liệu tải trong exe | trung vị 886 ms, ngưỡng ≤ 2 000 ms, đạt | không |
| Probe tham chiếu `backup.import` | dữ liệu tải trong exe | trung vị 51 ms, ngưỡng ≤ 500 ms, đạt | không |
| Probe tham chiếu `backup.export` | dữ liệu tải trong exe | trung vị 484 ms, ngưỡng ≤ 1 000 ms, đạt | không |
| Probe tham chiếu `reports.export-excel` | dữ liệu tải trong exe | trung vị 36 ms, ngưỡng ≤ 500 ms, đạt | không |
| Probe tham chiếu `app.open-data` | dữ liệu tải trong exe | 273 ms, ngưỡng ≤ 600 ms, đạt | không |
| `B/perf-probe.mjs`: `importBackup` 3 lần | tập tin tải 15 676 683 ký tự | 1 053, 926, 919 ms | không |
| `B/perf-probe.mjs`: `exportBackup` 3 lần | dữ liệu tải trong Node | 192, 185, 214 ms | không |
| `B/perf-probe.mjs`: `db.export()` 3 lần | dữ liệu tải trong Node | 2, 2, 3 ms; cỡ 13 455 360 byte | không |
| `B/perf-probe.mjs`: `countRecords` 3 lần | dữ liệu tải trong Node | 7, 6, 6 ms | không |

Không có phát hiện hiệu năng: mọi số đều dưới ngưỡng đã chốt.

## 6. Bảng đếm mức × trục

| Mức | E | C | D | G | S | P | B | T | A | Cộng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| Cộng | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 |

Tình trạng: 1 CONFIRMED, 0 PLAUSIBLE, 0 KNOWN. Tỉ lệ PLAUSIBLE bằng 0 vì chỉ nêu điều đã chạy lệnh tìm và kiểm thử để chứng minh.

## 7. Đã xét, không thấy

- E (việc biên): đã đọc `storage.rs` (khóa, mở, lưu, sao lưu, xuất, dọn), `app-data.ts` (hàng đợi thay), `persist-queue.ts`, `tauri-storage.ts`, `today.ts`; đã chạy kiểm thử lớp dữ liệu (170 qua) và kiểm thử Rust (91 qua). Các đường tắt app, lỗi đĩa, trùng tên xuất, lùi đồng hồ, trùng trang sau tải lại đều có kiểm thử giữ. Không thấy việc biên chưa giữ.
- C (đúng hợp đồng): đã đối chiếu S2-1 tới S2-6 với mã và kiểm thử, đối chiếu quyết định lưu trữ và phụ lục giữ khóa với `storage.rs`, `lib.rs`, `ai.rs`; đã chạy `tauri-contract.test.ts` (9 qua). Mọi luật đều khớp. Không thấy lệch hợp đồng.
- D (dữ liệu): đã đọc đường ghi nguyên tử, khóa tiến trình, hàng đợi lưu, hàng đợi thay; đã đo nhập xuất trên dữ liệu tải. Không thấy đường mất hay lẫn dữ liệu.
- G (giữ trí tuệ nhân tạo): phạm vi gói chỉ có `ai.rs` ở tầng gửi nhận (không có bộ kiểm hay danh sách chặn, thuộc gói trí tuệ nhân tạo); đã đọc phần che khóa và gửi nhận, không thấy việc giữ nào thuộc gói này. Không thấy.
- S (an toàn ở ranh giới): đã đọc kiểm tên xuất, kiểm thư mục, trích đường Explorer, chính sách nội dung, quyền cửa sổ, giữ khóa ở kho Windows, địa chỉ gọi cố định, hết giờ, chặn khóa lọt ra ngoài. Không thấy lỗ ranh giới.
- P (hiệu năng): đã nêu ở mục 5, mọi số dưới ngưỡng. Không thấy vượt ngưỡng.
- B (mã thừa): đã nêu ở mục 4, ngoài MU-B1 không thấy thừa đáng kể. Các mục sổ đã ghi (tập tin `.tmp` ở `backups`, cặp mã lặp hai nơi) còn nguyên, không có bằng chứng mới nên không nêu.
- T (chất lượng kiểm thử): đã chạy kiểm thử lớp dữ liệu và Rust, đều xanh; đã đọc các ca S2, khóa, xuất, sao lưu. Hai ca S2-4 kiểm lỏng còn như sổ đã ghi, không có bằng chứng mới nên không nêu. Không thấy hở mới.
- A (trợ năng, chữ đa ngữ): gói không có màn hình; đã kiểm các mã lỗi do gói ném (`DATA_REPLACING`) đều có câu chữ, các câu lưu trữ đều có mặt. Không thấy thiếu.

## 8. Phụ lục

### Nguồn đo

`B/perf-probe.mjs` (trong thư mục gói): đăng ký đọc `.ts` như `tools/load-data.mjs`, nhập `importBackup`, `exportBackup`, `countRecords` từ kho nguồn, đọc tập tin tải ở `common/load`, đo ba vòng, in số mili giây. Kết quả đã dán ở mục 5.

### Kết quả `clippy` pedantic

Lệnh (trong `apps/desktop/src-tauri`):

`cargo clippy --lib --tests --message-format=short -- -W clippy::pedantic`

Ghi ra `B/clippy-pedantic.log` (427 dòng, 37 báo). Vị trí báo: `ai.rs` 20 chỗ (văn tài liệu thiếu dấu, tên trường theo giao diện OpenCode, ép kiểu trong kiểm thử), `lib.rs` 9 chỗ (ép `u64` sang `i64` ở dấu giờ sao lưu, tham số lệnh theo khuôn Tauri, văn tài liệu), `storage.rs` 2 chỗ (rút gọn hàm khóa, ép kiểu trong kiểm thử), `main.rs` và `build.rs` 2 chỗ (dấu chấm phẩy). Toàn báo phong cách, không có lỗi làm việc; cổng `verify:rust` (`clippy -D warnings`, không pedantic) vẫn xanh ở số nền.

### Kết quả quét chữ không dùng

Lệnh (trong `apps/desktop`):

`pnpm exec tsc --noUnusedLocals --noUnusedParameters --noEmit`

Ghi ra `B/tsc-unused-desktop.log` (0 dòng): không có biến hay tham số thừa trong app.

### Kết quả kiểm thử đã chạy

- `pnpm vitest run apps/desktop/src/data`: 10 tập tin, 170 kiểm thử, đều qua.
- `cargo test --lib` trong `src-tauri`: 91 kiểm thử, đều qua.
- `pnpm lint:deps`: không vi phạm (309 khối, 1 244 phụ thuộc).

### Tình trạng cây cuối phiên

- `git status --short`: trống, giống đầu phiên (chỉ thư mục dựng bị bỏ qua có đổi).
- `git rev-parse HEAD`: `885534549808f42aec7f9af5743bbf86642ee4bd`, khớp mã chốt.
- Giờ xong: 23:02 14/10/2026.
