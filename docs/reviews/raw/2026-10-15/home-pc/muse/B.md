XONG — muse gói B, 23:20 14/10/2026

# Báo cáo rà soát sâu lượt 1 — gói B: File và Rust

## 1. Thông tin phiên

- Bên rà soát: muse (người rà soát độc lập, mẫu hình Muse Spark 1.3)
- Gói: B — File và Rust (`apps/desktop/src-tauri/**`, `apps/desktop/src/data/**` trừ file trí tuệ nhân tạo)
- SHA đầu phiên: `885534549808f42aec7f9af5743bbf86642ee4bd` (đã kiểm bằng `git rev-parse HEAD`, khớp SHA ghim `8855345`)
- Trạng thái đầu phiên (`git status --short` lúc 23:05 14/10/2026):
  - `?? .agents/`
  - `?? .codex/`
  - `?? AGENTS.md`
  - Ba mục trên là file do Codex tự sinh, có sẵn trước phiên, không đọc theo chỉ dẫn phiên.
- Giờ bắt đầu: 23:05 14/10/2026
- Gói A đã xong (`muse\A.md` dòng đầu `XONG`), đủ điều kiện làm gói B. Đây là phiên làm mới, không phải làm tiếp.
- Máy: Home PC `DESKTOP-KDURKJP` (máy chạy lượt này). Trong lúc rà soát không chạy đo exe, không chạy `pnpm e2e`.

## 2. Phạm vi đã đọc

Luật xếp gói (`tools/size-report-core.mjs`): `isAppAiFile` chỉ khớp `apps/desktop/src/`, nên `src-tauri/src/ai.rs` thuộc gói B. Gói B xét `ai.rs` ở góc ranh giới Rust (giữ key, gọi mạng, địa chỉ cố định, hết giờ, khóa một yêu cầu, mở trình duyệt, che key trong lỗi); guardrail và validator thuộc gói C, không xét ở đây.

File trong phạm vi, đã đọc hết từng dòng ở SHA ghim (số dòng đếm bằng `Get-Content | Measure-Object -Line`, có thể lệch vài dòng so với `wc -l`):

- `apps/desktop/src-tauri/build.rs` (3 dòng), `Cargo.toml` (32 dòng), `tauri.conf.json` (31 dòng), `capabilities/default.json` (7 dòng), `gen/schemas/capabilities.json` (1 dòng, file sinh ra, chỉ đối chiếu quyền)
- `apps/desktop/src-tauri/src/lib.rs` (205 dòng), `main.rs` (6 dòng)
- `apps/desktop/src-tauri/src/storage.rs` (1 401 dòng, gồm test), `ai.rs` (1 789 dòng, gồm test)
- `apps/desktop/src/data/app-data.ts` (436 dòng), `app-data.test.ts` (1 120 dòng)
- `apps/desktop/src/data/persist-queue.ts` (79 dòng), `persist-queue.test.ts` (185 dòng)
- `apps/desktop/src/data/tauri-storage.ts` (61 dòng), `tauri-storage.test.ts` (75 dòng), `tauri-contract.test.ts` (217 dòng)
- `apps/desktop/src/data/tables.ts` (68 dòng), `tables.test.ts` (42 dòng)
- `apps/desktop/src/data/today.ts` (58 dòng), `today.test.ts` (81 dòng)
- `apps/desktop/src/data/demo-snapshot.ts` (45 dòng), `demo-snapshot.test.ts` (46 dòng)
- `apps/desktop/src/data/AppDataContext.tsx` (52 dòng)
- Không đọc: `ai-analysis.ts`, `ai-jobs.ts`, `ai-tauri.ts` và test của chúng (thuộc gói C), trừ phần hợp đồng S2-3 nối vào (xem dưới). Không đọc `gen/schemas/acl-manifests.json`, `desktop-schema.json`, `windows-schema.json` (file sinh ra của Tauri), `Cargo.lock` (ổ khóa bản ghi), ảnh `icons/`.

Chỗ code gói khác mà gói nối vào, đã đọc ở mức hợp đồng:

- `packages/domain/src/period.ts` `localFileStamp`, `formatIsoDate` (tên file xuất), `report-workbook.ts` `slug`/`periodStamp`/`reportFileName` (tên file Excel)
- `ai-analysis.ts` `replaced()` (S2-3: kết quả trí tuệ nhân tạo về trong lúc thay thì bỏ), `ai-analysis.test.ts` ca S2
- `shell/close-guard.ts`, `CloseGuard.tsx` (lưu khi đóng, S2-6), `SaveWarning.tsx` (dải lỗi lưu), `startup-error.ts`, `StartupError.tsx`, `main.tsx` (luồng khởi động và lỗi mở), `block-reload.ts` (chặn tải lại trong exe), `index.html`, `App.tsx`
- `i18n/vi.ts` các chuỗi `storage.*`, `settings.backup.*`, `settings.demo.*`, `close.*`, `reports.excel.file*`
- Mọi `import ... from '@tauri-apps/api...'` trong `src/` (chỉ `invoke`, `isTauri`, `getCurrentWindow`)
- Mọi chỗ dùng `app.db()` / `data.db()` / `useDatabase()` ở `routes/`, `shell/` (chỉ đọc, không có lệnh ghi lách `run()`)

Tài liệu đã đọc: `plan.md` (§1, §3–§6, §10), `known.md`, `baseline.md`, `CLAUDE.md` (gốc, `apps/desktop`), `CONTEXT.md`, spec Phase 6 §1–§9 (kỹ §4.1 S-2), ADR-0016, ADR-0009 (D-1, G5, W-1), `docs/metrics/phase-6.md` (ngưỡng).

## 3. Phát hiện

```
ID: MU-B1
Mức: Low
Trục: S
Vị trí: apps/desktop/src-tauri/src/ai.rs:165 (8855345)
Tình trạng: CONFIRMED
Mô tả: kiểm tham số lệnh gọi trí tuệ nhân tạo giới hạn mọi trường nhưng không giới hạn độ dài hay ký tự của tên mẫu hình: tên dài tùy ý vẫn qua.
Tái hiện / bằng chứng: test tạm trên bản chép crate (`muse\B\mut\src-tauri`, chép nguyên từ SHA ghim, chỉ thêm một test ở cuối `ai.rs`): tên mẫu hình dài 5 MB vẫn qua `check()`, thân gửi đi dài hơn 5 MB. Lệnh `cargo test --offline probe_model_has_no_length_limit` trong bản chép cho `test ai::tests::probe_model_has_no_length_limit ... ok` (1 qua, 91 lọc ra). Đối chiếu mã: phiên 1–64 ký tự chữ/số/gạch ngang (dòng 161–164), lý luận trong tập (166–169), tin nhắn không rỗng và vai trò trong tập (170–174), `max_tokens` 1–32 000 (175), tổng chữ tin nhắn không quá 200 000 (176); riêng tên mẫu hình chỉ cần không rỗng (dòng 165).
Ảnh hưởng: đường vào cần khung xem gửi sai (lỗi lập trình ở khung xem) hoặc khung xem bị chiếm; thao tác bình thường không gặp vì khung xem chỉ gửi tên trong danh sách cố định. Khi đó app gửi thân yêu cầu lớn tới OpenCode bằng khóa của người dùng (tốn tiền gói Credit, có thể bị máy chủ từ chối).
Đề xuất: giới hạn tên mẫu hình (ví dụ không quá 128 ký tự, chỉ ký tự có trong tên mẫu hình thật). Cỡ vài dòng `check()` và một test biên.
```

```
ID: MU-B2
Mức: Low
Trục: C
Vị trí: apps/desktop/src-tauri/src/storage.rs:168 (8855345)
Tình trạng: CONFIRMED
Mô tả: khi lưu lỗi, Rust trả nguyên lỗi hệ thống, không nhận diện riêng đĩa đầy như khi sao lưu; dải báo trong app vì vậy gợi ý "file có thể đang mở trong chương trình khác" dù nguyên nhân có thể là đĩa đầy.
Tái hiện / bằng chứng: probe trên bản chép `storage.rs` (`muse\B\bench\probe-save-error.rs`, biên dịch bằng `rustc --edition 2021`, chỉ dùng thư viện chuẩn): `save()` lỗi trả nguyên văn `Access is denied. (os error 5)` (trường hợp thư mục chiếm tên file) và `Cannot create a file when that file already exists. (os error 183)` (trường hợp đường dẫn dữ liệu là file thường), không qua ánh xạ nào. Đối chiếu mã: `backup()` gọi `disk_full()` (dòng 137) để đổi lỗi đĩa đầy thành `DISK_FULL`, còn `save()` (dòng 168–174) gọi thẳng `write_atomic` rồi trả nguyên lỗi ở mọi nhánh. Khung xem chỉ so khớp `DISK_FULL` cho lỗi sao lưu khởi động (`startup-error.ts:19`), còn lỗi lưu chỉ hiện dải chung (`SaveWarning.tsx`, câu `storage.saveFailed` ở `vi.ts:1049`). Chưa làm đĩa đầy thật (không giả lập được ổ đầy nếu không đổi quyền thư mục, mà phiên cấm), nhưng đường mã gây lỗi chỉ có một và probe đã chạy qua nó.
Ảnh hưởng: người dùng khi đĩa đầy nhận gợi ý sai hướng (đi tìm chương trình giữ file thay vì dọn chỗ). Dữ liệu không mất: còn trong app và được lưu lại sau.
Đề xuất: ánh xạ lỗi đĩa đầy trong `save()` thành `DISK_FULL` như `backup()`; khung xem hiện câu riêng khi lưu báo `DISK_FULL` (có sẵn mẫu câu đĩa đầy ở khởi động). Cỡ dưới vài chục dòng sản phẩm và một test mỗi bên.
```

```
ID: MU-B3
Mức: Nit
Trục: B
Vị trí: apps/desktop/src-tauri/src/storage.rs:337 (8855345)
Tình trạng: PLAUSIBLE
Mô tả: mẫu đọc thư mục bỏ qua lỗi (`read_dir(...).into_iter().flatten().flatten()`) lặp ở ba hàm.
Tái hiện / bằng chứng: đã đọc mã (chưa chạy vì chỉ là dọn dẹp, hành vi không đổi): `next_seq` (dòng 337–340), `backup_names` (dòng 353–356), `remove_interrupted_exports` (dòng 243).
Ảnh hưởng: không ảnh hưởng hành vi; chỉ khó đọc khi sửa một nơi mà quên nơi khác.
Đề xuất: một hàm nhỏ trả danh sách mục trong thư mục (rỗng khi lỗi) cho ba nơi dùng; các test `storage` hiện có giữ hành vi. Cỡ dưới 20 dòng.
```

## 4. Bloat

| Đã chạy / đo | Trên dữ liệu nào | Kết quả (số) | Phát hiện |
|---|---|---|---|
| `tsc --noEmit --noUnusedLocals --noUnusedParameters -p apps/desktop` | Toàn app desktop ở SHA ghim | Sạch, mã thoát 0, không lỗi | — |
| Tìm nơi import của từng export trong `src/data` (trừ file trí tuệ nhân tạo) | Toàn repo (`apps`, `packages`, `tools`, `e2e`) | Mọi export đều có người dùng: `countRecords` ở `SettingsDataFile`, `sortedByName` ở `CustomerProfile`, `buildDemoSnapshot`/`demoSnapshotName` ở `e2e/serve.mjs`, `fetchDemoSnapshot` ở `main.tsx`, còn lại ở màn/test trong gói | — |
| `cargo clippy --all-targets -- -W clippy::pedantic` (một lần, theo trọng tâm gói) | Crate `src-tauri` ở SHA ghim | Mã thoát 0; 30 cảnh báo, toàn phong cách/chú thích/test/chữ ký lệnh Tauri bắt buộc: thiếu backtick trong chú thích 11, ép kiểu chỉ cắt trên nền 32-bit hoặc trong test 7, tham số lệnh Tauri truyền trị 3, tên trường 2, thiếu `;` 2, `match` trên đúng/sai trong test 2, còn lại mỗi loại 1 (xem log `muse\B\clippy-pedantic.log`, chú ý file này không phải UTF-8). Không cảnh báo nào chỉ lỗi thật | — |
| Tìm lặp ≥ 3 nơi trong phạm vi | `storage.rs`, `ai.rs`, `src/data` | Một mẫu lặp 3 nơi: đọc thư mục bỏ qua lỗi ở `next_seq`, `backup_names`, `remove_interrupted_exports` | MU-B3 |
| Phạm vi hiển thị của hàm Rust | `ai.rs`, `storage.rs` | `check`, `body`, `headers`, `reply`, `transport_error` công khai nhưng chỉ dùng trong `ai.rs` và test cùng file; hằng `ALREADY_OPEN`/`STALE_PAGE`/`DISK_FULL` công khai làm hợp đồng chuỗi với khung xem. Không đo được chi phí, không gắn mã | — |
| `pnpm lint:deps` | Toàn repo ở SHA ghim | Xanh: không vi phạm (309 mô-đun, 1 244 quan hệ), khớp số nền | — |
| Dependency Rust | `Cargo.toml` | Gọn: `tauri`, `keyring-core`, `serde`, `serde_json`, `ureq`, `windows-native-keyring-store` đều dùng đúng chỗ đã duyệt (D-1); bản ghi ghim đúng; lệnh file chỉ dùng thư viện chuẩn | — |
| Chunk bundle | Không dựng lại (số nền đã có, gói này không đổi mã) | Dẫn `baseline.md`: tổng JS/CSS thô 2 364 283 byte | — |

Không nêu lại `newPage`/`newSessionId` (mục OPEN #448 trong `known.md`).

## 5. Hiệu năng

Máy đo: Home PC `DESKTOP-KDURKJP`. Lúc đo không chạy đo exe, không chạy e2e, không dùng máy việc khác.

| Đã chạy / đo | Trên dữ liệu nào | Kết quả (số) | Phát hiện |
|---|---|---|---|
| Probe `backup()` trên bản chép `storage.rs` (`muse\B\bench\bench-backup.rs`, `rustc --edition 2021 -O`) | File 10 MB, 10 bản sao lưu 10 MB khác nhau ở byte cuối (trường hợp xấu nhất của tìm bản trùng: phải đọc hết) | Sao lưu khi không trùng bản nào: 29,6 ms (đọc ~100 MB rồi ghi bản mới); trùng bản mới nhất: 5,5 ms | — |
| Probe `save()` cùng bản chép | File 10 MB | 15,5 ms | — |
| Đối chiếu ngưỡng đã chốt | `docs/metrics/phase-6.md` | Mở lại ≤ 1 s, trang bắt đầu tới mở xong dữ liệu ≤ 600 ms, `db.save` ≤ 400 ms: số đo trên đều dưới xa | — |
| Đối chiếu số tham chiếu cùng máy | `common\perf\perf-ref.json` (qua `baseline.md`) | `db.save` trung vị 140 ms, `app.open-data` 189 ms, `backup.export` 424 ms: đều đạt; phần Rust thuần đo ở trên phù hợp với các số này | — |

Không đo trên exe: phần Rust đã đo trực tiếp trên bản chép; đo toàn cục trên exe là việc gói F. Mọi phát hiện hiệu năng đều cần số đo — gói này không có phát hiện P nào.

## 6. Bảng đếm mức × trục

| Mức | E | C | D | G | S | P | B | T | A | Cộng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 1 (MU-B2) | 0 | 0 | 1 (MU-B1) | 0 | 0 | 0 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 1 (MU-B3) | 0 | 0 | 1 |

Tỉ lệ PLAUSIBLE: 1/3 (MU-B3, dọn dẹp đọc từ mã). Hai phát hiện Low đều CONFIRMED bằng probe chạy thật trên bản chép.

## 7. Đã xét, không thấy (theo từng trục)

- E (trường hợp biên): đã xét, không thấy thêm. Đã đọc toàn bộ `storage.rs` (khóa hai tiến trình, trang cũ sau tải lại, file thiếu/hỏng/rỗng, đồng hồ lùi, tên xuất lạ, hậu tố `-n`, giới hạn 1 000 tên, số thứ tự bão hòa) và `app-data.ts`/`persist-queue.ts` (S2-1 tới S2-6, nửa đêm khi nạp lại, tắt app từng bước). Đã chạy probe đường dẫn dài 286 ký tự trên bản chép (`probe-longpath.rs`): lưu, xuất (đường dẫn ra 328 ký tự) và mở đều ổn. Không nêu lại các mục OPEN trong `known.md` (tệp tạm sót ở `backups\`, dải lỗi lưu không có nút thử lại, `Tables` giữ qua thay dữ liệu, `untilMidnight` là ACCEPTED).
- C (đúng hợp đồng): đã xét, không thấy thêm ngoài MU-B2. Đã đối chiếu S2-1 tới S2-6 với spec §4.1 (đủ cả 7 test chấp nhận trong `app-data.test.ts`), ADR-0016 (lệnh file chỉ dùng thư viện chuẩn, ghi tạm rồi đổi tên, giữ 10 bản, thư mục cạnh exe, bản web không lưu, cổng `persist`), ADR-0009 D-1 và W-1 mục 7 (địa chỉ cố định, phiên 1–64 ký tự chữ/số/gạch ngang, `User-Agent` mang bản app, hết giờ 120 s / 10 s, khóa một yêu cầu). Tên file xuất (`localFileStamp`, `slug`, `periodStamp`) đều qua được luật tên của Rust. Không thấy chỗ spec mâu thuẫn nhau.
- D (dữ liệu): đã xét, không thấy. Khóa không vào cơ sở dữ liệu, bảng `settings` hay bản sao lưu (chỉ ở kho khóa của máy); lỗi Rust che khóa và mã phiên (có test và đột biến chứng minh); ghi nguyên tử nên tắt app giữa chừng chỉ còn bản cũ đủ hoặc bản mới đủ; thay lỗi giữ dữ liệu cũ và số thế hệ (S2-4 có test). Lệnh và luật nhập sao lưu cùng luật là việc gói A.
- G (giữ ranh giới trí tuệ nhân tạo): đã xét, không thấy (ngoài phạm vi gói; validator và prompt thuộc gói C). Phía gói B chỉ giữ ranh giới gọi mạng và khóa, đã xét ở trục S. Hợp đồng S2-3 nối đúng: `replaced()` bỏ kết quả khi số thế hệ đổi hoặc đang thay (`ai-analysis.ts:208`).
- S (an toàn ở ranh giới): đã xét, không thấy thêm ngoài MU-B1. Đã đọc: luật tên xuất (chặn phân tách thư mục, chỉ đuôi `.p2cbackup`/`.xlsx`), thư mục mở chỉ `exports`/`backups`, Explorer gọi bằng đường dẫn đầy đủ, CSP chặn mạng ngoài (`connect-src` không có địa chỉ ngoài), quyền chỉ `core:default` và đóng cửa sổ, khung xem chỉ dùng `invoke`/`isTauri`/`getCurrentWindow`, không theo chuyển hướng, chỉ HTTPS, thân trả lời không quá 2 MB kể cả sau giải nén, hết giờ các chặng, khóa cắt khoảng trắng và chỉ cho ký tự in được, xóa khóa vắng mặt vẫn ổn, `ureq` dùng `http::HeaderValue` nên khóa sửa tay chứa ký tự xuống dòng chỉ gây lỗi gọi chứ không chèn được đầu mục. Không có lệnh ghi nào lách `run()` (mọi chỗ dùng `db()` ở màn chỉ đọc).
- P (hiệu năng): đã xét, không thấy. Số đo ở mục Hiệu năng: sao lưu và lưu trên dữ liệu 10 MB đều dưới 30 ms. Sao lưu khởi động nằm trong đường mở app nhưng không đáng kể so với ngưỡng.
- B (bloat): đã xét, xem mục Bloat (một Nit MU-B3).
- T (chất lượng test): đã xét, không thấy. Test Rust 91/91 xanh trên SHA ghim; test TS trong gói 96/96 xanh; hợp đồng khung xem ↔ Rust có test đọc mã nguồn hai bên; ba đột biến trên bản chép (bỏ chặn trang cũ, bỏ che mã phiên, bỏ kiểm tên xuất trùng) đều bị test giết. Không nêu lại mục OPEN #537 (hai ca S2-4 thiếu kiểm mã lỗi).
- A (trợ năng, đa ngữ): đã xét, không thấy. Dải lỗi lưu và trang lỗi khởi động có `role="alert"`; hộp hỏi khi đóng có nút thử lại được chọn sẵn; câu khóa ghi S2-2 khớp nguyên văn spec (có test); phạm vi gói không có chuỗi giao diện cứng (lỗi dùng mã, màn dịch mã).

## 8. Phụ lục

Probe và test tạm (mã nguồn trong `muse\B\`, không ghi gì vào repo):

- `bench/bench-backup.rs` (+ bản chép `bench/storage.rs`): đo `backup()`/`save()` với file 10 MB. Dựng: `rustc --edition 2021 -O bench-backup.rs -o bench-backup.exe` (bản chép cần edition 2021 như crate; edition mặc định của `rustc` báo lỗi kiểu ở `export_extension`). Kết quả: `backup-miss: 29.6 ms`, `backup-hit: 5.5 ms`, `save-10mb: 15.5 ms`. Dữ liệu đo (~110 MB) và file chạy đã xóa sau khi ghi số, giữ mã nguồn.
- `bench/probe-longpath.rs`: lưu/xuất/mở dưới đường dẫn dữ liệu dài 286 ký tự. Kết quả: cả ba đều ổn (đường dẫn file xuất dài 328 ký tự).
- `bench/probe-save-error.rs`: lỗi `save()` trả nguyên văn lỗi hệ thống, không ánh xạ (bằng chứng MU-B2). Kết quả: `Access is denied. (os error 5)`, `Cannot create a file when that file already exists. (os error 183)`.
- `mut/src-tauri/`: chép nguyên crate `src-tauri` (trừ `target`), chạy `cargo test --offline` nền xanh 91/91. Test tạm `probe_model_has_no_length_limit` ở cuối `ai.rs` (giữ lại, có chú thích TEMP): tên mẫu hình 5 MB qua `check()`, thân gửi đi hơn 5 MB (bằng chứng MU-B1).
- Đột biến trên bản chép (đều bị test giết, đã hoàn lại): (a) tắt kiểm trang cũ trong `save()` thì test `a_save_from_the_page_before_a_reload_is_refused_once_the_new_page_opened` đỏ; (b) chỉ che khóa mà không che mã phiên trong `server_message()` thì test `no_error_carries_the_key_or_the_session` đỏ; (c) bỏ kiểm tên xuất đã có trong `claim_export_name()` thì 3 test xuất đỏ (`never_overwrites`, `suffixes_it_before_xlsx`, `taken_by_a_folder`). Log: `mut/baseline.log`, `mut/probe-model.log`, `mut/mut-a.log`, `mut/mut-b.log`, `mut/mut-c.log` (không phải UTF-8, đọc bằng `Get-Content -Encoding Default`).
- `clippy-pedantic.log`, `tsc-unused.log` (rỗng, sạch): log các lệnh kiểm.

Trạng thái repo cuối phiên (`git -C C:\workspace\Project-2C-review-2 status --short` lúc 23:20 14/10/2026): `?? .agents/`, `?? .codex/`, `?? AGENTS.md` — giống đầu phiên (file Codex tự sinh có sẵn, không đọc). SHA cuối phiên vẫn `885534549808f42aec7f9af5743bbf86642ee4bd`. Mọi probe, bản chép và log đều nằm trong `muse\B\`, không ghi gì vào repo.

Giờ xong: 23:20 14/10/2026.
