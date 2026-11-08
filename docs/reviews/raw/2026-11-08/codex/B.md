XONG — codex gói B lượt 6, 2026-11-07 12:58:49 +07:00

# Gói B — File và Rust

## 1. Thông tin phiên

- Bên: Codex, gói B, lượt 6; phiên mới. Bước 0: `B.md` chưa có; `A.md` có dòng đầu `XONG` (chỉ đọc dòng đầu để kiểm thứ tự).
- SHA đầu phiên: `5b1328ae236aa62981dbf43066ff544a9e832c8c`, đúng SHA ghim, detached.
- `git status --short` đầu phiên: rỗng.
- Bắt đầu: **2026-11-07 12:41:09 +07:00**, Asia/Bangkok.
- Công cụ: Codex desktop; **codex-cli 0.162.1**, từ `codex --version`. CLI báo không dọn/tạo được thư mục arg0/PATH alias do Access denied, vẫn trả phiên bản và exit 0.
- Model: **GPT-6** theo system của phiên; không có công cụ trả model ID chi tiết hơn. Mức suy luận không được công cụ công bố. Không lấy tên GPT Sol 6.1 trong kế hoạch làm kết quả đo của công cụ.
- Máy `DESKTOP-KDURKJP` theo baseline; Node **v24.20.0**, cargo/rustc **1.98.1** từ lệnh phiên này. Mọi lệnh Node đặt `C:\Program Files\nodejs` đầu PATH; các tiến trình con dùng cùng executable/PATH.
- Chỉ review, không viết code sản phẩm, không commit/Issue/PR, không gọi gh/pnpm, dịch vụ AI hay đọc key. Codex **không lập bảng R1/R2**. Không đọc báo cáo lượt 6 bên khác; không mở/liệt kê/tìm trong các thư mục bị cấm. Các bản chép và probe chỉ nằm trong `codex/B/`.

## 3. Phạm vi đã đọc

**Đã đọc kỹ 21/21 file của `common/files-B.txt`, gồm toàn bộ phần test Rust. Không có file trong danh sách bị bỏ qua hay chỉ đọc lướt.** Số dòng dưới lấy lại trực tiếp từ file ở SHA ghim cuối phiên.

| File (tương đối với repo) | Dòng | Trọng tâm đã đọc |
|---|---:|---|
| `apps/desktop/src-tauri/build.rs` | 3 | Nguồn cấu hình build/capability |
| `apps/desktop/src-tauri/src/ai.rs` | 2.052 | Request, Busy, key store seam, reply/redaction, HTTP/HTTPS, timeout, giới hạn body, 43 test |
| `apps/desktop/src-tauri/src/lib.rs` | 205 | Đăng ký IPC, argument/header/body, blocking pool, đường dẫn, tách khóa AI/file |
| `apps/desktop/src-tauri/src/main.rs` | 6 | Entry point, subsystem Windows |
| `apps/desktop/src-tauri/src/storage.rs` | 2.207 | Ghi nguyên tử, page cũ, khóa, quyền file/folder, prune/reuse, claim export, dọn tệp gián đoạn, 77 test |
| `apps/desktop/src/data/AppDataContext.tsx` | 64 | Các hook/store snapshot, useToday, revision/tables/save state |
| `apps/desktop/src/data/app-data.test.ts` | 1.563 | Startup, migration, integrity, S-2, close, import/export, purge, lỗi từng bước |
| `apps/desktop/src/data/app-data.ts` | 496 | Mở/backup trước migrate-save, current/opening, generation, inTurn, backUp, ports |
| `apps/desktop/src/data/demo-snapshot.test.ts` | 46 | Tên ngày, snapshot, fallback fetch |
| `apps/desktop/src/data/demo-snapshot.ts` | 45 | Snapshot chỉ dùng web/dev/e2e, đóng DB tạm |
| `apps/desktop/src/data/listeners.test.ts` | 28 | Thứ tự gọi và lỗi listener |
| `apps/desktop/src/data/listeners.ts` | 15 | Catch riêng từng listener |
| `apps/desktop/src/data/persist-queue.test.ts` | 424 | Gộp snapshot, lost/retry, tracked, reentrancy, idle/flush, trạng thái |
| `apps/desktop/src/data/persist-queue.ts` | 150 | Một drain mỗi lượt, nhả quyền, listener mở lượt mới, vòng idle/flush |
| `apps/desktop/src/data/tables.test.ts` | 43 | Tên và thứ tự giữa picker/chart |
| `apps/desktop/src/data/tables.ts` | 72 | Lazy read và cache theo revision |
| `apps/desktop/src/data/tauri-contract.test.ts` | 482 | IPC TS/Rust; CSP, capability và config build/CLI/workflow/Cargo |
| `apps/desktop/src/data/tauri-storage.test.ts` | 96 | Raw IPC, header page/name, offset, mã lỗi |
| `apps/desktop/src/data/tauri-storage.ts` | 91 | Adapter storage, page token, lỗi lưu |
| `apps/desktop/src/data/today.test.ts` | 81 | Đồng hồ/nửa đêm, wake, cleanup timer và event |
| `apps/desktop/src/data/today.ts` | 58 | Snapshot ngày, timer đệ quy, subscribe/unsubscribe |

**Diff đọc trước:** `git diff 37a80b6 5b1328a -- apps/desktop/src-tauri apps/desktop/src/data` (bỏ file AI của app thuộc C). Đọc đủ bốn file thay đổi: `app-data.ts`, `persist-queue.ts`, `persist-queue.test.ts`, `tauri-contract.test.ts`, **+185/−15**; phần sản phẩm +13/−5, test +172/−10. Rust/config/capability không đổi trong diff này. Đọc kỹ các nhánh mới và phần còn lại, không dừng ở test chấp nhận của Issue sửa.

**Nguồn bổ sung:** `CLAUDE.md` gốc và desktop, `CONTEXT.md`; ADR-0016, ADR-0009 D-1; spec Phase 6 §4.1 (S2-1…6), §4.2 liên quan TR-11…13 và §5. `common/prompt-codex.md`, `known.md` (quyết định và các mục liên quan B), `fixes.md` (T-364, T-374, T-381, phần B của T-382, T-384), `baseline.md`; plan §4 và §L6.0–L6.8 liên quan phạm vi, thước mức, tiêu chí xong. Tổng hợp lượt 1–4 đọc phần File/Rust và vấn đề liên quan; tổng hợp lượt 5 §3/§5.1/§6.2/§7/§9/§10.1 và raw B lượt 1–5 trong repo để đối chiếu kịch bản đã thử. Raw lượt trước chỉ đọc phần liên quan, không tuyên bố đọc hết mọi báo cáo.

Đọc thêm `Cargo.toml`, `tauri.conf.json`, `capabilities/default.json`, điểm nối `App.tsx`, `main.tsx`, `close-guard.ts`, `CloseGuard.tsx`, `SaveWarning.tsx`, các caller `run`/`subscribe` và các chỗ dùng timer. Không review lại toàn bộ C/D/E/F. Không dựng kết luận màn UI bằng probe DB thô.

**KNOWN giữ nguyên:** DR6-161…163 và các Issue R2 là KNOWN, không đếm thành phát hiện. Giới hạn CLI `tauri.ps1`, `tauri.CMD`, tên chương trình có ngoặc kép và việc parse manifest hai lần đã được Owner chấp nhận (known.md, review #1115); không báo lại. CXR5-B1 đã bị tổng hợp lượt 5 bác (flush rảnh xong ngay, không có đường UI chen sự kiện); không mở lại. K23/K29/K35/K39 và các giới hạn đã chấp nhận không bị tính lại thành lỗi mới.

## 4. Kịch bản đã thử

| # | Kịch bản / lệnh | Kết quả | ID |
|---|---|---|---|
| 1 | CLI Vitest trực tiếp, 8 file test B và `shell/close-guard.test.ts` | **9 file, 143/143 test qua**, exit 0; `vitest.log`. | — |
| 2 | `cargo test --offline --manifest-path apps/desktop/src-tauri/Cargo.toml`, target riêng | **120/120 qua** (77 storage, 43 AI), exit 0. AI chỉ mock credential và HTTP/TLS loopback; không gọi endpoint sản phẩm. | — |
| 3 | Listener báo lưu xong gọi hai lệnh ghi, rồi xếp Nạp lại → Nhập → Dọn trong lúc đóng đang chờ | PASS; lúc đóng file `[Imported]`, generation=2, maxInFlight=1; ba backup đủ `[First,Nested B,Nested C,Seed]`, `[Seed]`, `[Imported]`. | — |
| 4 | Backup Nạp lại lỗi DISK_FULL; Nhập đang xếp sau; xuất giữa chừng và thử ghi | PASS; ghi bị DATA_REPLACING; xuất đủ 2 team cũ; Nhập tiếp được, file cuối `[Imported]`, generation=1. | — |
| 5 | Nhập xong trong bộ nhớ nhưng lưu dữ liệu mới lỗi READ_ONLY; yêu cầu đóng | PASS; trước retry file vẫn `[Seed]`, sau flush file `[Imported]`, failed=false, maxInFlight=1. | — |
| 6 | Listener lúc tracked replace xong mở một lượt Nhập nữa; close đang chờ | PASS; chỉ đóng khi generation=2, file `[Imported]`. | — |
| 7 | 12 lượt phối hợp lưu → Nạp lại (6 lượt seed lỗi) → Nhập → Dọn, xuất xen giữa, hai flush đồng thời | PASS 12/12; xuất đủ dữ liệu cũ, file cuối `[Imported]`, replacing/saving=false, maxInFlight=1. | — |
| 8 | File tải chuẩn qua AppData: Nhập → xuất → Dọn và đóng chờ → nhập lại file xuất → mở lại | PASS; live counts giữ **4 team/51 người/1.481 KH/10.255 lịch/1.674 HĐ**; rác **113→0→113**; file **14.102.528→13.438.976→14.102.528 B**; lúc đóng saving=false; maxInFlight=1. | — |
| 9 | Bản chép archive ở SHA ghim, đối chứng queue + IPC/config contract | **34/34 qua**, exit 0; `mirror-control.log`. | — |
| 10 | 10 đột biến trên bản chép, gồm drain/idle/flush và các nguồn capability/config | **10/10 bị test bắt**; không đột biến sống. Đối chứng cargo `-Dclippy::pedantic` vẫn xanh. Chi tiết phụ lục. | — |
| 11 | Fake clock: callback nửa đêm tự unsubscribe; tiến thêm một ngày | **1 fail/2 đối chứng qua**: vẫn có 1 timer, callback đã gọi 2 lần thay vì 1. Hai đối chứng unsubscribe bên ngoài và tự hủy từ focus đều dừng đúng. | CXR6-B1 |
| 12 | Một lượt `cargo clippy --offline … --all-targets -- -W clippy::pedantic` | Exit 0, 42,19 s. Có cảnh báo pedantic, đã xét vị trí; không dùng --fix, không báo phong cách thành phát hiện. | — |

Kịch bản 3–7 ở `app-probes.mjs`; kịch bản 8 ở `load-flow.mjs`. Tất cả dựng qua lớp AppData thật với storage/window port giả, không chèn SQL thô. Kịch bản 11 kết luận về API watcher, không kết luận UI. Không chạy trình duyệt/exe trong phiên này; không có kết luận hình ảnh/focus mới cần dựa vào môi trường DOM.

## 5. Phát hiện mới

**1 phát hiện CONFIRMED, Low/E; không chặn phát hành.** Không có phát hiện mới ở mức Critical/High/Medium hoặc Low thuộc D/S/G trong phạm vi đã kiểm.
### CXR6-B1 — Tự hủy đăng ký trong callback nửa đêm vẫn bị đặt lại timer

ID: CXR6-B1
Mức: Low
Trục: E
Vị trí: `apps/desktop/src/data/today.ts:40`–`:41`, phần hủy ở `:51`–`:54` (`5b1328a`).
Tình trạng: CONFIRMED
Liên quan: có từ trước, lượt 1–5 bỏ sót; file này không đổi trong diff lượt 6. `git log -1 -- …/today.ts`: `1625568`, T-126 / PR #334, 05/10/2026.
Mô tả: callback của timer gọi `listener()` rồi mới `wait()`. Nếu listener gọi unsubscribe của chính nó, `clearTimeout(timer)` chỉ hủy timer đã kích hoạt; khi listener trả về, `wait()` tạo timer mới dù đã hủy đăng ký.
Tái hiện / bằng chứng: `node node_modules/vitest/vitest.mjs run --root C:\workspace\deep-review-1-6-r6\codex\B\mirror apps/desktop/src/data/b-today-review.test.ts --reporter verbose` → exit 1, **1 fail / 2 pass**. Fake clock 07/11 23:59; listener tăng bộ đếm rồi tự unsubscribe; tiến qua nửa đêm, rồi thêm một ngày: `{"calls":2,"timersAfterUnsubscribe":1,"timersAfterNextDay":1}` (mong đợi 1/0/0). Hai đối chứng: unsubscribe từ ngoài callback và tự unsubscribe từ callback focus đều qua. Nguồn `B/mirror/apps/desktop/src/data/b-today-review.test.ts`, log `B/today-probe.log`.
Cùng mẫu: `rg -n -U 'listener\(\);\s*wait\(\);' . --glob '!*.md' --glob '!*.test.*'` chỉ trả `today.ts:40–41`. `rg -n 'setTimeout\(|setInterval\(' apps packages tools .claude .github --glob '!*.test.*' --glob '!*.md' --glob '!Cargo.lock'`: ngoài đây chỉ `app-data.ts:420` (yield một lần), `CustomerProfile.tsx:106` (xóa đánh dấu, một lần), `ReportExport.tsx:95` / `SettingsBackup.tsx:190` (revoke URL, một lần), `tools/auto-wait.mjs:127` (pause một lần; chỉ đọc, không chạy công cụ). `watchToday` chỉ được sản phẩm gọi ở `AppDataContext.tsx:62`; không thấy chỗ lặp cùng lỗi khác.
Ảnh hưởng: người gọi API hủy đồng bộ ngay trong callback nửa đêm vẫn bị gọi tiếp và còn giữ timer/listener. Các caller sản phẩm hiện dùng `useSyncExternalStore`; probe không chứng minh đường thao tác UI làm cleanup đồng bộ tại đúng thời điểm này. Không kết luận màn hiện tại lỗi hoặc dữ liệu bị sửa.
Chặn phát hành: không — Low trục E theo K48; điều kiện tự hủy trong callback ở seam, không phải đường UI đã tái hiện.
Đề xuất: bảo đảm unsubscribe ngăn mọi lần đặt timer sau đó (cờ hoạt động được kiểm trước khi đặt lại, hoặc đặt lần kế trước khi phát thông báo để unsubscribe hủy được nó); thêm ca tự hủy ở nửa đêm cùng hai đối chứng. Ước lượng 3–7 dòng sản phẩm, 15–25 dòng test. Không sửa code ở phiên này; K49 áp dụng.

## 7. Bảng đếm mức × trục

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

- **Chặn: 0; không chặn: 1**, theo đề xuất K48.
- CONFIRMED 1; PLAUSIBLE 0 (0%); không mở mục KNOWN có bằng chứng mới. Không đếm test đỏ có chủ ý của đột biến/probe là lỗi ở bộ kiểm nền.
- Gói B không lập hai bảng R, không có hai mục Bloat/Hiệu năng bắt buộc (§L6.4). Không đưa ra kết luận phát hành toàn app; việc đó thuộc gói F/tổng hợp.

## 8. Đã xét, không thấy

| Trục | Phạm vi/bằng chứng và giới hạn |
|---|---|
| E | Startup/file thiếu/hỏng, migration, quyền/lock, retry, reentrancy, thay dữ liệu lỗi/chồng, listener mở lượt thay, close, nửa đêm và unsubscribe. **Có CXR6-B1**; ngoài nó, không thấy vấn đề mới qua 143 test TS, 120 Rust và các chuỗi bổ sung. |
| C | ADR-0016, D-1, S2-1…6, TR-11 và hợp đồng port TS/Rust; ba backup của chuỗi listener chứa đúng mọi thay đổi, export không lẫn dữ liệu, close chờ cả lượt tracked tới muộn. Không thấy lệch hợp đồng mới ngoài lỗi unsubscribe xếp E. Không audit mockup/focus các màn khác bằng đọc code. |
| D | Kiểm transaction/save/backup qua unit và AppData; lỗi backup không thay dữ liệu, lỗi save giữ snapshot để retry. Chuỗi tải mở lại giữ live counts và toàn bộ 113 dòng Thùng rác sau nhập lại. Rust test phủ giữ file cũ khi flush/rename lỗi, page cũ, prune/reuse và file bị giữ. Không thấy mới. |
| G | Phần Rust D-1: check trước đọc key/gọi mạng; Busy; raw/error reply; chặn/che 16.099 tổ hợp escape và 6 đối chứng; không tự sang Mock. 43 test AI chạy local/mock. Không review lại guardrail ngôn ngữ của package AI trong B. Không thấy mới ở ranh giới Rust này. |
| S | Đọc cố định đường dẫn/URL, key chỉ store seam; cap/CSP/identifier; IPC header và body; quyền Windows, lock, export claim. 7 đột biến nguồn quyền/config bị ca contract bắt; source hiện tại chỉ có đúng quyền đã duyệt. Không mở key thật hay gọi AI thật. Không thấy mới. |
| P | Đọc đoạn gộp snapshot, đọc lazy tables, giữ tối đa 50 save measures, so baseline đã đo ở SHA ghim. Không có nghi vấn mới cần số đo và không lập phát hiện P. Số/thời gian chạy unit trong phiên này không dùng làm số đo hiệu năng phát hành. |
| B | Diff sản phẩm B chỉ +8 dòng ròng; đọc toàn bộ file/port/helper và callers, không dependency Rust mới trong diff. Không thấy code chết/lặp mới có chi phí được chứng minh; không đề nghị refactor trong đóng băng K49. |
| T | 143 test TS/120 Rust xanh; 34 test đối chứng bản chép xanh; 10 đột biến đều bị bắt, C01 không báo nhầm. Lỗ ca unsubscribe nửa đêm gắn CXR6-B1, không đếm thành phát hiện T thứ hai cùng nguyên nhân. Các dạng CLI đã ACCEPTED không báo lại. |
| A | Đọc các hook external store, trạng thái lưu và cầu nối close; kiểm close port bằng test và probe. Gói B không chạy UI mới, không suy ra focus/aria/hình từ DB thô. Không thấy lỗi mới thuộc A trong phạm vi này. |

## 9. Phụ lục và trạng thái cuối

Mọi nguồn/log dưới **`C:\workspace\deep-review-1-6-r6\codex\B\`**. Worktree gốc **`C:\workspace\Project-2C-review-2`**. Lệnh Node chạy sau `$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH`; không gọi pnpm. Lệnh mẫu Vitest dùng `node node_modules/vitest/vitest.mjs`; khi spawn từ script dùng `process.execPath` đã là Node 24.

| File | Nguồn/bằng chứng |
|---|---|
| `progress.md` | Bản lưu báo cáo ghi dần trước khi sắp xếp thành bản cuối; giữ các kết quả và phát hiện đã ghi. |
| `vitest.log` | `node node_modules/vitest/vitest.mjs run` với 8 test B và `apps/desktop/src/shell/close-guard.test.ts`: 9 file/143 test xanh. |
| `rust-test.log`, `rust-target/` | `$env:CARGO_TARGET_DIR = 'C:\workspace\deep-review-1-6-r6\codex\B\rust-target'`; `cargo test --offline --manifest-path apps/desktop/src-tauri/Cargo.toml`: 120 xanh. |
| `clippy-pedantic.log` | Cùng target riêng; `cargo clippy --offline --manifest-path apps/desktop/src-tauri/Cargo.toml --all-targets -- -W clippy::pedantic`: exit 0. Lib 20 cảnh báo; lib test 34 gồm 20 trùng; build/main có cảnh báo dấu chấm phẩy. Chưa có lỗi chạy mới từ chúng; không chạy --fix. |
| `app-probes.mjs`, `app-probes.log` | Năm nhóm AppData, trong đó nhóm cuối 12 lượt; 5/5 nhóm qua. `node C:\workspace\deep-review-1-6-r6\codex\B\app-probes.mjs`. |
| `load-flow.mjs`, `load-flow.log` | Chuỗi tải của kịch bản 8; chỉ RAM port. Đọc file tải đúng thư mục common lượt 6; không lấy dữ liệu/đo từ thư mục bên khác. |
| `source.zip`, `mirror/`, `mirror-control.log` | `git archive HEAD` → zip, bung vào mirror; root/app `node_modules` là junction tới dependency có sẵn của worktree. Đối chứng 34/34. Chỉ bản chép được đột biến. |
| `mutations.mjs`, `mutations.log`, `mutations.json`, `M01-*.log`…`M10-*.log`, `C01-*.log` | Ma trận dưới; `node C:\workspace\deep-review-1-6-r6\codex\B\mutations.mjs`, exit 0. Mỗi thay đổi trả nguyên trong finally. |
| `mirror/apps/desktop/src/data/b-today-review.test.ts`, `today-probe.log` | Nguồn mới cho CXR6-B1 và hai đối chứng; lệnh chính xác ở phát hiện. Probe đỏ có chủ ý, không sửa sản phẩm để làm xanh. |

### Đột biến trên bản chép

| Mã | Thay đổi | Kết quả |
|---|---|---|
| M01 | Bỏ `if (last) return`, drain cũ tiếp tục | KILLED, 1/16 đỏ: listener gọi hai save, DR6-162. |
| M02 | `idle` chỉ chờ một `running` thay vòng lặp | KILLED, 1/16 đỏ: idle chờ save do listener mở. |
| M03 | Vòng cuối flush chỉ chờ running, bỏ tracked tới muộn | KILLED, 1/16 đỏ: work tracked sau khi flush bắt đầu, DR6-139. |
| M04 | Capability `windows: ['*']` | KILLED, ca capability. |
| M05 | Capability inline trong config | KILLED, ca capability. |
| M06 | Script `npx @tauri-apps/cli build --config x.json` | KILLED, ca capability. |
| M07 | Script `.bin/tauri build -c x.json` | KILLED, ca capability. |
| M08 | Script `tauri.cmd build -bc x.json` | KILLED, ca capability. |
| M09 | Nối dòng PowerShell rồi `--config` | KILLED, ca capability. |
| M10 | Workflow mới `run: >`, gộp dòng CLI và `--config` | KILLED, ca capability. |
| C01 | Đổi cờ clippy ở script cargo thành `-Dclippy::pedantic` | CONTROL PASS, 18/18 contract; không bị nhận nhầm là CLI Tauri. |

**Không có đột biến sống trong ma trận này.** Đây là kiểm độ nhạy test, không phải bảng R. Sau hoàn nguyên, SHA256 của **21/21 file** trong manifest ở mirror khớp repo gốc (kể cả queue/config test). Test tạm `b-today-review.test.ts` chỉ có ở mirror.

### Kiểm cuối

- `git diff --stat`: rỗng.
- `git status --short`: rỗng, giống đầu phiên.
- `git rev-parse HEAD`: `5b1328ae236aa62981dbf43066ff544a9e832c8c`, không đổi.
- Mốc kiểm byte/mirror và Git: 2026-11-07 12:55:29 +07:00; sẽ kiểm lại ngay khi đánh dấu XONG.
- Kiểm cuối lặp lại: Git sạch, SHA không đổi, 21/21 file mirror khớp repo; `B/final-check.json`.
- Giờ xong: **2026-11-07 12:58:49 +07:00**.

