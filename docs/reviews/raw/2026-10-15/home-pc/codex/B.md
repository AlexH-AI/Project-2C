# Deep review Phase 1–6, lượt 1 — Codex, Gói B

## 1. Phiên và mốc kiểm

- Bên: **Codex**, gói **B — File và Rust**. ID: CX-B1, CX-B2.
- SHA đầu và cuối: **885534549808f42aec7f9af5743bbf86642ee4bd** (8855345), detached HEAD.
- Worktree: `C:\workspace\Project-2C-review-2`.
- Bắt đầu: **2026-10-13 21:46:12 UTC+07:00** (14:46:12 UTC).
- Máy: **DESKTOP-KDURKJP**, Home PC; Node 24.20.0, Rust 1.98, công cụ/dependency đã có trong repo.
- Không sửa nguồn/config trong repo, không commit/PR/Issue/merge; không chạy nghi thức phiên hoặc skill. Không đọc báo cáo gói trước (chỉ Test-Path A.md), không đọc/liệt kê thư mục kết quả của bên khác. Không gọi AI sản phẩm hoặc đọc key thật.

`git status --short` đầu phiên:

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

**Kết quả trong phạm vi B:** 2 phát hiện **Low / T / CONFIRMED**, đều là khoảng hở test. Không xác nhận lỗi sản phẩm Critical, High hay Medium trong các ca đã chạy. Không đưa ra kết luận phát hành; việc đó thuộc gói F.

## 2. Phạm vi đã đọc

Đọc toàn bộ **19 file nguồn/test**, 5.969 dòng = **2.001 SP + 3.968 test**, theo cách chia của kế hoạch. Rust: 1.202 SP + 2.202 test; data TS/TSX: 799 SP + 1.766 test.

| File ở 8855345 | Dòng đã đọc |
|---|---|
| `apps/desktop/src-tauri/build.rs` | 1–3 |
| `apps/desktop/src-tauri/src/ai.rs` | 1–1789 |
| `apps/desktop/src-tauri/src/lib.rs` | 1–205 |
| `apps/desktop/src-tauri/src/main.rs` | 1–6 |
| `apps/desktop/src-tauri/src/storage.rs` | 1–1401 |
| `apps/desktop/src/data/AppDataContext.tsx` | 1–52 |
| `apps/desktop/src/data/app-data.test.ts` | 1–1120 |
| `apps/desktop/src/data/app-data.ts` | 1–436 |
| `apps/desktop/src/data/demo-snapshot.test.ts` | 1–46 |
| `apps/desktop/src/data/demo-snapshot.ts` | 1–45 |
| `apps/desktop/src/data/persist-queue.test.ts` | 1–185 |
| `apps/desktop/src/data/persist-queue.ts` | 1–79 |
| `apps/desktop/src/data/tables.test.ts` | 1–42 |
| `apps/desktop/src/data/tables.ts` | 1–68 |
| `apps/desktop/src/data/tauri-contract.test.ts` | 1–217 |
| `apps/desktop/src/data/tauri-storage.test.ts` | 1–75 |
| `apps/desktop/src/data/tauri-storage.ts` | 1–61 |
| `apps/desktop/src/data/today.test.ts` | 1–81 |
| `apps/desktop/src/data/today.ts` | 1–58 |

Đã đọc thêm cấu hình: `Cargo.toml`, `tauri.conf.json`, `capabilities/default.json`; kiểm dependency khóa bằng `cargo tree --locked --offline --depth 1` (tauri 2.11.6, tauri-build 2.6.3, keyring-core 1.0.0, windows-native-keyring-store 1.1.0, serde 1.0.229, serde_json 1.0.151, ureq 3.4.2). Cargo.lock là file sinh, kiểm phần header và dependency đã khóa; icon nhị phân không phải logic chương trình.

Đối chiếu: CLAUDE.md gốc và apps/desktop/CLAUDE.md, CONTEXT.md; ADR-0016; ADR-0009 D-1/W-1; Phase 6 §4.1 S2-1…S2-6 và §5; Phase 3 §5–§6; docs/metrics/phase-6.md; common/prompt-codex.md, plan.md (§1/3/4/5/6/10), known.md, baseline.md, perf/perf-ref.json; e2e/perf/README.md.

Chỗ nối gói khác đã đọc:

- `packages/db/src/database.ts:1–229` (mở, migration, persist, transaction, export), `backup.ts:1–110` (preview đã migration/validate).
- `apps/desktop/src/data/ai-analysis.ts:1–333`: đường nối AI với generation/replacing; `ai-analysis.test.ts:291–420` và các ca S2-2/S2-3/R2-07 được tìm bằng rg, chạy cả file bằng Mock.
- `src/main.tsx`, `App.tsx`, `shell/CloseGuard.tsx`, `close-guard.ts`, `close-guard.test.ts`, `block-reload.ts`, `SaveWarning.tsx`, `StartupError.tsx`, `startup-error.ts`: khởi động, cảnh báo, đóng app.
- `routes/SettingsBackup.tsx` (luồng đọc/xuất và hộp nhập), `i18n/vi.ts:980–1012` (nhãn nhập/xuất); e2e/team.spec.ts:1–130 để kiểm đường ghi UI.
- `e2e/perf/probe.perf.ts:1–270`: dùng nguyên logic timeInPage của probe cho thao tác UI; tools/load-data.mjs:1–61 để nạp TS/?raw; tools/codemap.mjs và bản đồ export.

## 3. Phát hiện

### CX-B1 — Test migration tự sửa bytes trước khi kiểm nên che việc ghi lại bản cũ

- **ID:** CX-B1
- **Mức:** Low
- **Trục:** T
- **Vị trí:** `apps/desktop/src/data/app-data.test.ts:775–776`; helper `:623`; hành vi liên quan `app-data.ts:300–303` (8855345).
- **Tình trạng:** CONFIRMED.
- **Mô tả:** Ca “saves the migration … while it opens” chỉ kiểm snapshot đầu khác file cũ rồi đưa mọi snapshot qua openDatabase. Hàm kiểm đó tự migration, nên snapshot cuối bị ghi trở lại schema 0 vẫn xanh; thực tế openFrom lưu lại bytes đầu vào sau lần lưu migration.
- **Tái hiện / bằng chứng:** `node C:\workspace\deep-review-1-6\codex\B\node-probe.mjs`, ca `migration-last-bytes`. SQL.Database được mở trực tiếp để đọc phiên bản, không gọi migration:

```json
{"versions":[9,0],"liveVersion":9,"diskRawVersion":0,"testHelperVersion":9,"originalTestAssertionsWouldPass":true}
```

  Bộ test gốc vẫn **7 file / 96 test passed**. Probe dùng đúng seam của app-data.test.ts:767: thay preview.bytes bằng DB cũ. **Đường UI thường không đưa bytes cũ vào seam này**: readBackup đã dựng, migration, kiểm và export DB hiện tại. Do đó đây là lỗi test và lá chắn cho đường mở DB cũ, không chứng minh người dùng nhập backup bình thường mất dữ liệu.
- **Ảnh hưởng:** Một hồi quy làm snapshot cuối cũ hơn snapshot migration có thể lọt test “cửa sổ opening”. Test đọc lại dữ liệu sau khi tự nâng schema che chính điều nó cần kiểm.
- **Đề xuất:** Kiểm raw schema của **snapshot cuối** bằng SQL.Database không migration và kiểm dữ liệu trên snapshot đó. Nếu tiếp tục hỗ trợ seam bytes cũ, openFrom lưu bytes đã export từ DB vừa mở thay vì bytes đầu vào. Ước lượng ≤ 5 dòng SP và ~20–40 dòng test, giữ các test S2-1…S2-6 và bộ data hiện tại.

### CX-B2 — Bỏ flush đĩa vẫn qua toàn bộ test lưu trữ

- **ID:** CX-B2
- **Mức:** Low
- **Trục:** T
- **Vị trí:** `apps/desktop/src-tauri/src/storage.rs:294`; module test bắt đầu `:472` (8855345).
- **Tình trạng:** CONFIRMED.
- **Mô tả:** Bước sync_all là phần của hợp đồng “ghi đủ → flush đĩa → rename”, nhưng bộ test chỉ quan sát bytes/khóa/rename trong cùng hệ thống đang chạy. Bỏ bước flush trên bản chép vẫn qua 50/50 test storage.
- **Tái hiện / bằng chứng:** Bản chép nguyên văn storage.rs có SHA256 `939A1C076B412A3FB104D4AA9AFE128E8C4F09EEABC0E0C86B34FA44E96C2A6E`, trùng file repo. Chỉ thay `file.sync_all()?;` bằng comment, rồi chạy:

```powershell
rustc --edition=2021 --test --cap-lints allow C:\workspace\deep-review-1-6\codex\B\storage-sync-mutant.rs -o C:\workspace\deep-review-1-6\codex\B\storage-sync-mutant.exe
& C:\workspace\deep-review-1-6\codex\B\storage-sync-mutant.exe
```

```text
test result: ok. 50 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

  Control mutation bỏ chặn STALE_PAGE bị test bắt: **0 passed / 1 failed**, lỗi unwrap_err nhận Ok. Log: mutation-sync.log, mutation-stale.log.
- **Ảnh hưởng:** Nếu một lần refactor bỏ flush hoặc bỏ qua lỗi flush, test hiện không bắt; tính bền khi máy mất điện không được bộ test bảo vệ. **Code hiện có sync_all và không ghi nhận mất dữ liệu thực tế**; probe kill tiến trình chỉ kiểm crash của process, không giả lập mất điện/mất cache ổ đĩa.
- **Đề xuất:** Một seam I/O nhỏ cho write/sync/rename, ca sync lỗi bắt buộc báo lỗi, giữ file cũ và không rename; ca thành công bắt buộc sync trước rename. Chạy lại đột biến để test phải đỏ khi bỏ sync. Ước lượng ~50–100 SP / ~60–100 test, ≤ 400 SP, không dependency mới.

Không đưa mục KNOWN vào danh sách phát hiện vì không có bằng chứng mới vượt ghi chú. Các mục được đối chiếu gồm listener ném lỗi, getter Tables giữ qua replace, PerformanceMeasure tăng theo phiên, backup folder không đọc được, retry sau lỗi lưu, newPage/newSessionId, giới hạn một AI request, Local Credential Manager, S-1 ngoài v1.0.

## 4. Bloat

| Đã chạy/đọc | Dữ liệu/phạm vi | Kết quả số | ID |
|---|---|---|---|
| tsc -p apps/desktop --noEmit --noUnusedLocals --noUnusedParameters | TS app và cây import | Exit 0; 0 lỗi unused | — |
| rg từng export + AST declaration | 7 file SP data | 31 declaration export; 5 chỉ có tên trong file SP đó đều là interface của chữ ký API; không xác nhận hàm runtime chết. Hai re-export countRecords/RecordCounts có caller SettingsDataFile/SettingsBackup | — |
| pnpm codemap:check | Bản đồ export hiện có | Up to date; không chạy lệnh codemap có ghi file | — |
| pnpm lint:deps | apps + packages | 309 module / 1.244 dependency, 0 violation | — |
| Đọc sâu nhánh và đoạn lặp | 2.001 SP của B | Không thấy abstraction/đoạn lặp ≥ 3 nơi có chi phí mới cần refactor; các đoạn newPage và listener thuộc KNOWN | — |
| cargo tree --locked --offline --depth 1 | Rust manifest/lock | 6 dependency trực tiếp + tauri-build; đều có usage trong B | — |
| cargo clippy --lib --tests --locked --offline -- -W clippy::pedantic (1 lần) | Rust B | Exit 0; build script 1 warning, lib 18, bin test 1, lib test 30 (18 trùng): 32 vị trí distinct. Chủ yếu doc/format, pass-by-value của command, cast bounded test; không có phát hiện lỗi mới từ warning | — |
| pnpm build:web; tính gzip bằng node:zlib như baseline | Toàn bundle liên quan app | 1.093 module; tổng JS/CSS 2.364.283 byte; 697.071 gzip; **Δ 0** ở mọi chunk so common/baseline | — |
| Exe được chép, không build lại | common/exe/project2c.exe | 5.414.400 byte; SHA256 DFA985F13AE2A4A8E1A8EC1B61696663A1A8873B318DE60B5A9A1BC2BC481201 | — |

| Chunk | Byte | Gzip byte |
|---|---:|---:|
| chart-Zomw1zIK.js | 513302 | 172450 |
| exceljs.min-DgbhWywh.js | 929569 | 255572 |
| index-C1k0Xtz0.css | 28364 | 6412 |
| index-DvfluxND.js | 891942 | 262010 |
| rolldown-runtime-Dd_uD5pT.js | 1106 | 627 |

Không đề xuất refactor bloat mới. Năm interface chỉ được gọi qua chữ ký của API không mang bytes runtime; tìm tên bằng rg không đủ để kết luận chúng là code chết. Các warning phong cách không được nâng thành finding.

## 5. Hiệu năng

Dataset đúng common/load/load-2026-10-12-seed6.p2cbackup, **16.034.641 byte**, hash tables **1e69a97f664708d91932a1158c3a9ddd4e4d4aebb689f9c912ac3c4d0962e3fd**: 1.496 KH, 10.414 lịch hẹn, 54 người, 1.697 HĐ, 103 phân tích AI, có Thùng rác. DB SQLite dựng qua importBackup là **13.455.360 byte**.

Máy DESKTOP-KDURKJP. Các probe của phiên chạy tuần tự; không có test/build/clippy của phiên cùng lúc đo. Có phiên review khác theo kế hoạch; không biết toàn bộ tải nền Windows. Trước probe exe đã kiểm các cổng 9222–9232, 9330–9340 và 4173: không thấy listener. Không đọc thư mục/log bên khác. Mốc chạy từng probe lưu ở bảng dưới (giờ địa phương UTC+07):

| File kết quả | Ghi xong |
|---|---|
| node-probe.json | 2026-10-13 21:53:13 |
| storage-perf.json | 2026-10-13 21:55:36 |
| exe-detached-perf.json | 2026-10-13 22:04:36 |
| exe-ui-perf-first.json | 2026-10-13 22:09:25 |
| exe-ui-repeat.json | 2026-10-13 22:19:08 |

Exe chép vào thư mục riêng dưới codex/B; cổng 9337 (đo chẩn đoán với debugger), 9338 (IPC ngắt debugger), 9339 (UI). Thư mục WebView riêng để tránh dùng cùng profile với cửa sổ app khác. **Luồng UI chọn file tải qua Cài đặt → Dữ liệu → Nhập backup**, xác nhận rồi xuất lại. Dùng hàm timeInPage gốc của e2e/perf; ngắt debugger khi ghi, chờ/nối lại đọc kết quả. Backup.read lấy tới locator hộp thoại nhìn thấy nên có thêm vòng CDP, không khẳng định tương đương tuyệt đối với cách poll trong probe gốc.

| Thao tác | Nơi/dữ liệu | Lần | Trung vị (min–max), ms | Ngưỡng/tham chiếu cùng máy | ID |
|---|---|---:|---:|---|---|
| readBackup: dựng/kiểm/migration | Node, JSON tải 16.034.641 byte | 5 | 807.97 (736.84–848.31) | Đo lớp dữ liệu; không so trực tiếp thời gian khung hình | — |
| importBackup: thay DB | Node, không file port | 5 | 4.18 (4.16–4.61) | Không gồm IPC/ghi đĩa | — |
| exportBackup: JSON UTF-8 | Node, không file port | 5 | 232.73 (231.68–238.48) | Không gồm IPC/ghi đĩa | — |
| Đọc lần đầu 6 bảng | Node, toàn dữ liệu tải | 5 | 80.12 (72.54–85.77) | 8 prepare mỗi revision | — |
| 600 lượt hỏi bảng đã cache | Node, cùng revision | 5 | 0.05 (0.02–0.10) | 0 prepare thêm | — |
| storage::save + sync_all + rename | Rust -O, DB 13.455.360 byte | 15 | 10.36 (9.93–10.70) | Đo riêng I/O, không so trực tiếp db.save của exe | — |
| storage::open | Rust -O, DB tải | 15 | 4.21 (3.98–5.17) | Không gồm IPC/SQL/React | — |
| storage::backup | Rust -O, DB tải | 15 | 6.61 (6.39–22.08) | Lần đầu tạo bản sao; 14 lần sau dedup | — |
| storage::write_export | Rust -O, bytes DB tải | 15 | 9.33 (8.94–13.03) | Tên mới mỗi lần | — |
| db_save IPC, debugger đã ngắt | Exe release, DB tải | 15 | 166.50 (148.10–184.80) | ≤ 400 ms; tham chiếu 140.1 ms; Δ 18.84% | — |
| UI chọn file → hộp nhập (lượt 1) | Exe, 5 lần, dataset tải | 5 | 902.50 (869.90–1351.20) | ≤ 2000 ms; ref 793.8 ms; Δ 13.69% | — |
| UI chọn file → hộp nhập (lặp lại) | Exe, cùng kịch bản/dataset | 5 | 929.00 (874.00–1123.10) | ≤ 2000 ms; ref 793.8 ms; Δ 17.03% | — |
| UI xác nhận → báo đã nhập (lượt 1) | Exe, 5 lần, dataset tải | 5 | 55.00 (44.50–92.40) | ≤ 500 ms; ref 48.7 ms; Δ 12.94% | — |
| UI xác nhận → báo đã nhập (lặp lại) | Exe, cùng kịch bản/dataset | 5 | 41.40 (37.60–44.10) | ≤ 500 ms; ref 48.7 ms; Δ -14.99% | — |
| p2c:db-save sau nhập UI (lượt 1) | Exe, 5 lần, dataset tải | 5 | 180.40 (156.10–531.20) | ≤ 400 ms; ref 140.1 ms; Δ 28.77% | — |
| p2c:db-save sau nhập UI (lặp lại) | Exe, cùng kịch bản/dataset | 5 | 158.40 (149.70–161.20) | ≤ 400 ms; ref 140.1 ms; Δ 13.06% | — |
| UI xuất backup → khung hình (lượt 1) | Exe, 5 lần, dataset tải | 5 | 462.00 (455.30–504.70) | ≤ 1000 ms; ref 423.8 ms; Δ 9.01% | — |
| UI xuất backup → khung hình (lặp lại) | Exe, cùng kịch bản/dataset | 5 | 443.20 (439.50–511.30) | ≤ 1000 ms; ref 423.8 ms; Δ 4.58% | — |

**Đánh giá:** trung vị các thao tác UI đều nằm dưới ngưỡng đã chốt. Lượt đầu có một mẫu db.save **531,2 ms**, cao hơn 400 ms; đã chạy lại cùng kịch bản trong thư mục exe riêng khác, giữ nguyên mọi mẫu ở phụ lục. So tham chiếu phải đọc kèm phân bố: ref db.save là 15 lần (nhập + tạo lịch), probe UI này chỉ lấy save sau nhập; IPC ngắt debugger riêng có 15 lần, trung vị 166.50 ms, Δ 18.84%, chưa vượt cả hai điều kiện nhiễu (>20% và >10 ms). Lượt đầu UI save có trung vị 180,4 ms (+28,8% so tham chiếu), nhưng lượt lặp giảm còn 158,4 ms (149,7–161,2; +13,1%); không tái hiện mẫu >400 ms hoặc chậm hơn biên nhiễu. Chưa có bằng chứng điểm nghẽn code mới ở B. Không dùng số đo Office Laptop để tính Δ, không dùng mẫu debugger còn nối (~373,7 ms) làm finding. Không có finding P được xác nhận trong gói này.

Node/Rust I/O riêng phục vụ tách chi phí; không thay cho thời gian đầu-cuối. Không đo lại cold start sinh seed, bộ nhớ toàn app hoặc toàn bộ màn; các phần đó có baseline/thuộc F. Không giả lập ổ vật lý hết dung lượng hay mất điện; lỗi đĩa dùng I/O bị giữ và promise từ chối, có ghi rõ phạm vi.

## 6. Đếm mức × trục

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

CONFIRMED: 2/2; PLAUSIBLE: 0; KNOWN mới: 0. Không có tỉ lệ PLAUSIBLE cao. Count theo trục chính của mỗi finding.

## 7. Đã xét, không thấy / phần có phát hiện

| Trục | Đã đọc/chạy và kết luận giới hạn |
|---|---|
| E | Đã xét, không thấy lỗi mới: 96 test B; probe replace hỏng rồi replace hợp lệ liền nhau, khóa ghi ngay lúc gọi/còn chờ; hai flush cùng lúc sau lỗi và snapshot mới; xuất đồng thời 6 luồng; ngày qua nửa đêm/DST/focus trong today.test.ts; startup/backup/rename lỗi trong Rust. Các ca S-2 đã sửa dùng kiểm hồi quy, không báo lại. |
| C | Đã xét, không thấy lệch mới trên đường bình thường: S2-1…S2-6, ADR-0016/D-1; contract JS↔Rust (tên command, header, argument, error, Completion null); export filename cố định/chống ghi đè. CX-B1 là test seam nhập raw bytes cũ; preview thật đã migrated. |
| D | Đã xét, không thấy mất/hỏng dữ liệu được xác nhận: file cũ byte-for-byte khi target không cho rename; restart sau kill lúc .tmp xuất hiện giữ DB tải đủ; backup dedup/prune/clock-back; DB cũ không được lưu muộn sau swap; generation chỉ tăng lượt hợp lệ. DB tải round-trip export có đủ counts, hash fixture đúng. |
| G | Đã xét ranh giới Rust và S2-3, không thấy lỗi mới: 41 test AI Rust với key giả/HTTP local; 60 test xuyên gói bằng Mock, gồm bỏ answer/error/Hủy trong replace. Validator G5 V1–V7/prompt chi tiết thuộc C, không tuyên bố đã audit chúng tại B. |
| S | Đã xét, không thấy đường mới: CSP/capabilities; fixed HTTPS URLs, 0 redirect, 120 s global/10 s connect-resolve, body tối đa 2 MiB sau giải nén; key/session masking trước cắt; response key/escape blocked; Credential Local; lock thật Windows, STALE_PAGE; 6 tên path/ADS sai bị từ chối. Không key thật/dịch vụ thật. |
| P | Đã xét, không xác nhận điểm nghẽn mới: đo Node, Rust và exe/UI trên bộ tải, bảng §5 giữ cả nhiễu/outlier. Mọi kết luận chỉ tới thời gian đã đo; không suy ra toàn app nhanh từ I/O riêng. |
| B | Đã xét, không thấy bloat mới có chi phí cần sửa: tsc-unused, audit từng export, codemap check, deps, Cargo tree, chunk byte/gzip Δ0; KNOWN không báo lại. |
| T | Có CX-B1/CX-B2. Control STALE_PAGE bị test giết; bỏ sync_all sống. Bộ gốc 96 B + 60 xuyên gói + 91 Rust đều xanh. Chưa mutation toàn bộ command/AI parser; 2 mutation Rust nêu rõ phạm vi. |
| A | Đã xét, không thấy lỗi mới ở giao diện port: mã kỹ thuật qua i18n, SaveWarning role=alert, thông báo nhập/xuất role=status, DATA_REPLACING câu chuẩn được test exact; watcher unsubscribe dọn timer/event. Hook/context không có màn nhập để audit focus/Tab; visual/mockup đầy đủ thuộc D/E. |

## 8. Phụ lục: lệnh, nguồn và kết quả

### 8.1 Lệnh kiểm đã chạy

```powershell
pnpm exec vitest run apps/desktop/src/data/app-data.test.ts apps/desktop/src/data/persist-queue.test.ts apps/desktop/src/data/tauri-storage.test.ts apps/desktop/src/data/tauri-contract.test.ts apps/desktop/src/data/tables.test.ts apps/desktop/src/data/today.test.ts apps/desktop/src/data/demo-snapshot.test.ts
# 7 file, 96 passed; vitest.log
pnpm exec vitest run apps/desktop/src/data/ai-analysis.test.ts apps/desktop/src/shell/close-guard.test.ts
# 2 file, 60 passed; cross-boundary-tests.log
cargo test --manifest-path apps/desktop/src-tauri/Cargo.toml --lib --locked --offline
# 91 passed; rust-tests.log
cargo clippy --manifest-path apps/desktop/src-tauri/Cargo.toml --lib --tests --locked --offline -- -W clippy::pedantic
# 1 lần; exit 0, warning đã phân loại tại §4; clippy-pedantic.log
pnpm exec tsc -p apps/desktop --noEmit --noUnusedLocals --noUnusedParameters
pnpm codemap:check
pnpm lint:deps
pnpm build:web
cargo tree --manifest-path apps/desktop/src-tauri/Cargo.toml --locked --offline --depth 1
# Các lệnh trên exit 0; log riêng trong B/
```

pnpm verify/e2e/build:exe đầy đủ sử dụng baseline đã có ở SHA ghim, không chạy lại. Không cài công cụ; không gọi eval:ai/eval-ai.mjs hoặc dịch vụ AI của sản phẩm.

### 8.2 Kết quả probe nguyên số

```json
{
  "node": [
    {
      "case": "migration-last-bytes",
      "versions": [
        9,
        0
      ],
      "liveVersion": 9,
      "diskRawVersion": 0,
      "testHelperVersion": 9,
      "originalTestAssertionsWouldPass": true
    },
    {
      "case": "failed-then-success",
      "immediate": "DATA_REPLACING",
      "waiting": "DATA_REPLACING",
      "failure": "file is not a database",
      "teams": [
        "Imported"
      ],
      "generation": 1,
      "replacing": false,
      "backups": 2
    },
    {
      "case": "two-flushes",
      "started": [
        "v1",
        "v2"
      ],
      "failed": false,
      "unsaved": false
    },
    {
      "case": "node-load-perf",
      "machine": "DESKTOP-KDURKJP",
      "backupBytes": 16034641,
      "sqliteBytes": 13455360,
      "rows": {
        "ai_analyses": 103,
        "appointment_coordinators": 1510,
        "appointments": 10414,
        "customers": 1496,
        "kyc_facts": 13833,
        "kyc_notes": 5672,
        "kyc_versions": 13114,
        "people": 54,
        "policies": 1697,
        "settings": 0,
        "stage_transitions": 4941,
        "teams": 5
      },
      "readMs": [
        827.5666,
        736.8434,
        737.3545999999997,
        848.3143999999998,
        807.9737999999998
      ],
      "replaceMs": [
        4.1590000000001055,
        4.175099999999929,
        4.157100000000355,
        4.463999999999942,
        4.614500000000589
      ],
      "exportMs": [
        232.65190000000007,
        232.73169999999982,
        231.68240000000014,
        237.4989999999998,
        238.47639999999956
      ],
      "coldTablesMs": [
        85.77460000000019,
        72.54489999999987,
        75.04210000000012,
        80.11709999999948,
        84.32980000000043
      ],
      "warmTables600ReadsMs": [
        0.10310000000004038,
        0.041899999999714055,
        0.04999999999972715,
        0.023799999999937427,
        0.10130000000026484
      ],
      "queries": [
        8,
        8,
        8,
        8,
        8
      ]
    }
  ],
  "native": {
    "bytes": 13455360,
    "saveMs": [
      10.6981,
      10.39,
      10.3625,
      10.4637,
      10.077,
      10.498099999999999,
      10.4473,
      10.2926,
      10.4757,
      10.1828,
      9.9338,
      10.5518,
      10.3076,
      10.3631,
      10.2158
    ],
    "openMs": [
      5.1673,
      4.0968,
      4.9286,
      4.5437,
      3.9785000000000004,
      4.228199999999999,
      3.9867000000000004,
      4.1769,
      4.0775999999999994,
      4.207800000000001,
      4.3636,
      5.039,
      5.0401,
      4.068,
      4.122800000000001
    ],
    "backupMs": [
      22.083499999999997,
      6.5504,
      7.1967,
      6.711,
      6.6785000000000005,
      6.662999999999999,
      6.9291,
      6.4887,
      6.606800000000001,
      6.4994,
      6.4704999999999995,
      6.5636,
      6.6671,
      6.388,
      6.423500000000001
    ],
    "exportMs": [
      9.4473,
      9.0899,
      9.5259,
      9.457699999999999,
      8.9386,
      13.0283,
      8.9677,
      9.026,
      9.2422,
      9.0488,
      9.0273,
      9.3279,
      9.5761,
      9.3644,
      9.4118
    ],
    "crashObservedTmp": true
  },
  "ipc": {
    "openMs": [
      106.69999999925494,
      109.5,
      102.5,
      110.69999999925494,
      96.19999999925494
    ],
    "saveMs": [
      182.09999999962747,
      183.90000000037253,
      184.80000000074506,
      168.59999999962747,
      157.09999999962747,
      169.30000000074506,
      166.5,
      168.59999999962747,
      172.30000000074506,
      161.19999999925494,
      158.09999999962747,
      163.2000000011176,
      159.80000000074506,
      148.09999999962747,
      164.90000000037253
    ],
    "backupMs": [
      12.299999998882413,
      12.599999999627471,
      11.400000000372529,
      14.099999999627471,
      10.799999998882413
    ],
    "exportMs": [
      188.30000000074506,
      165.5,
      177.59999999962747,
      160.5,
      148.90000000037253
    ],
    "bytes": 13455360,
    "startupOpenMs": 339.80000000074506,
    "machine": "DESKTOP-KDURKJP",
    "debugPort": 9338,
    "kind": "exe IPC port timing, debugger detached during samples, no frame wait"
  },
  "uiFirst": {
    "machine": "DESKTOP-KDURKJP",
    "debugPort": 9339,
    "kind": "UI file import and export; original timeInPage copied; debugger detached during writes",
    "samples": [
      {
        "readMs": 1351.199999999255,
        "importMs": 44.5,
        "saveMs": 180.39999999850988,
        "exportMs": 491.8999999985099
      },
      {
        "readMs": 869.9000000003725,
        "importMs": 57.600000001490116,
        "saveMs": 162.90000000037253,
        "exportMs": 459.2999999988824
      },
      {
        "readMs": 902.5,
        "importMs": 55,
        "saveMs": 156.10000000149012,
        "exportMs": 462
      },
      {
        "readMs": 875.0999999996275,
        "importMs": 92.40000000037253,
        "saveMs": 531.1999999992549,
        "exportMs": 504.69999999925494
      },
      {
        "readMs": 905.3999999985099,
        "importMs": 49.19999999925494,
        "saveMs": 180.40000000037253,
        "exportMs": 455.2999999988824
      }
    ]
  },
  "uiRepeat": {
    "machine": "DESKTOP-KDURKJP",
    "debugPort": 9339,
    "kind": "UI file import and export; original timeInPage copied; debugger detached during writes",
    "samples": [
      {
        "readMs": 939.0999999996275,
        "importMs": 37.59999999962747,
        "saveMs": 154.09999999962747,
        "exportMs": 439.5
      },
      {
        "readMs": 1123.1000000014901,
        "importMs": 44.09999999962747,
        "saveMs": 161.19999999925494,
        "exportMs": 511.30000000074506
      },
      {
        "readMs": 901,
        "importMs": 43.09999999962747,
        "saveMs": 158.40000000037253,
        "exportMs": 441.2000000011176
      },
      {
        "readMs": 874,
        "importMs": 39.29999999888241,
        "saveMs": 149.7000000011176,
        "exportMs": 443.2000000011176
      },
      {
        "readMs": 929,
        "importMs": 41.40000000037253,
        "saveMs": 160.5,
        "exportMs": 460.30000000074506
      }
    ]
  }
}
```

Probe storage cho kết quả:

```text
LOCK other=ALREADY_OPEN stale=STALE_PAGE
SAVE target-held=Access is denied. (os error 5) old-bytes-preserved=true retry=true
EXPORT concurrent=6 unique=6 bytes-preserved=true unsafe-names-refused=6
PERF bytes=13455360 save-ms=[10.6981, 10.39, 10.3625, 10.4637, 10.077, 10.498099999999999, 10.4473, 10.2926, 10.4757, 10.1828, 9.9338, 10.5518, 10.3076, 10.3631, 10.2158] open-ms=[5.1673, 4.0968, 4.9286, 4.5437, 3.9785000000000004, 4.228199999999999, 3.9867000000000004, 4.1769, 4.0775999999999994, 4.207800000000001, 4.3636, 5.039, 5.0401, 4.068, 4.122800000000001] backup-ms=[22.083499999999997, 6.5504, 7.1967, 6.711, 6.6785000000000005, 6.662999999999999, 6.9291, 6.4887, 6.606800000000001, 6.4994, 6.4704999999999995, 6.5636, 6.6671, 6.388, 6.423500000000001] export-ms=[9.4473, 9.0899, 9.5259, 9.457699999999999, 8.9386, 13.0283, 8.9677, 9.026, 9.2422, 9.0488, 9.0273, 9.3279, 9.5761, 9.3644, 9.4118]
CRASH observed-tmp=true whole-load-file=true restart-cleaned-tmp=true
```

### 8.3 Đột biến trên bản chép, không patch repo

```powershell
# Copy-Item src-tauri/src/storage.rs → codex/B/storage.rs (hash trùng ở §3).
$src = Get-Content -LiteralPath 'C:\workspace\deep-review-1-6\codex\B\storage.rs' -Raw
# Mutant S: thay duy nhất điều kiện STALE_PAGE bằng false && điều kiện đó.
$stale = $src.Replace('if held.page.as_deref().is_some_and(|opened| opened != page) {', 'if false && held.page.as_deref().is_some_and(|opened| opened != page) {')
# Mutant D: bỏ flush đĩa.
$sync = $src.Replace('file.sync_all()?;', '// mutation: skipped sync_all')
# Set-Content hai bản chép; TEMP/TMP trỏ codex/B/mutation-tmp chỉ trong tiến trình test.
rustc --edition=2021 --test --cap-lints allow C:\workspace\deep-review-1-6\codex\B\storage-stale-mutant.rs -o C:\workspace\deep-review-1-6\codex\B\storage-stale-mutant.exe
& C:\workspace\deep-review-1-6\codex\B\storage-stale-mutant.exe a_save_from_the_page_before_a_reload
# KILLED: 0 passed, 1 failed, 49 filtered; process exit 101.
rustc --edition=2021 --test --cap-lints allow C:\workspace\deep-review-1-6\codex\B\storage-sync-mutant.rs -o C:\workspace\deep-review-1-6\codex\B\storage-sync-mutant.exe
& C:\workspace\deep-review-1-6\codex\B\storage-sync-mutant.exe
# SURVIVED: 50 passed, 0 failed; process exit 0.
```

### 8.4 Nguồn probe tự chứa

Các file TS/Rust được chép nguyên văn từ SHA 8855345; nguồn gốc lấy lại được bằng git show tại SHA. Probe nằm hoàn toàn trong codex/B. Lần chạy node-probe đầu bị thiếu resolve sql.js từ package gốc, đã sửa createRequire sang packages/db/package.json; lần chạy cuối thành công và là kết quả ở §8.2. Lần exe đầu chưa lên cổng CDP, thử lại với WebView profile riêng thành công; không dùng lần thất bại làm số đo. Lượt lặp UI đầu chờ table trên route khởi động quá 30 s, nên không có số đo; probe lặp đổi sang chờ mốc p2c:data-open và dùng thư mục exe/profile riêng khác. Source/script dưới đây là phiên bản cuối đã chạy.

#### node-probe.mjs

```javascript
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { registerHooks, createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';
import os from 'node:os';
const root = 'C:/workspace/Project-2C-review-2';
const out = 'C:/workspace/deep-review-1-6/codex/B';
const copies = join(out, 'data');
mkdirSync(copies, {recursive:true});
for (const file of ['app-data.ts','persist-queue.ts','tables.ts']) writeFileSync(join(copies,file),readFileSync(join(root,'apps/desktop/src/data',file)));
registerHooks({
 resolve(specifier, context, next) {
  if (/^@p2c\/(db|domain|ai)$/.test(specifier)) return next(pathToFileURL(join(root,'packages',specifier.slice(5),'src/index.ts')).href,context);
  try { return next(specifier, context); } catch(error) {
   if (!specifier.startsWith('.')) throw error;
   for (const suffix of ['.ts','/index.ts']) { try { return next(specifier+suffix,context); } catch {} }
   if (context.parentURL?.startsWith(pathToFileURL(copies).href)) return next(pathToFileURL(join(root,'apps/desktop/src/data',specifier+'.ts')).href,context);
   throw error;
  }
 },
 load(url,context,next) {
  if (!url.endsWith('?raw')) return next(url,context);
  return {format:'module',source:`export default ${JSON.stringify(readFileSync(new URL(url.slice(0,-4)),'utf8'))};`,shortCircuit:true};
 }
});
const {openAppData} = await import(pathToFileURL(join(copies,'app-data.ts')));
const {createPersistQueue} = await import(pathToFileURL(join(copies,'persist-queue.ts')));
const dbApi = await import(pathToFileURL(join(root,'packages/db/src/index.ts')));
const domain = await import(pathToFileURL(join(root,'packages/domain/src/index.ts')));
const initSql = createRequire(join(root,'packages/db/package.json'))('sql.js');
const SQL = await initSql();
const day = domain.calendarDate(2026,10,13);
const now = () => new Date(2026,9,13,12);
const names = db => dbApi.listTeams(db).map(t=>t.name).sort();
const rawVersion = bytes => {const db = new SQL.Database(bytes); try {return db.exec('SELECT max(id) FROM schema_migrations')[0]?.values[0][0] ?? 0;} catch{return 0;} finally{db.close();}};
const deferred = () => {let resolve,reject;const promise=new Promise((r,j)=>{resolve=r;reject=j;});return {promise,resolve,reject};};
function disk(initial) {
 let latest=initial;const saves=[];let backups=0;
 const storage={load:async()=>latest,save:async b=>{latest=b.slice();saves.push(latest);},backup:async()=>`copy-${++backups}`,writeExport:async name=>name,latestBackup:async()=>undefined,openFolder:async()=>{}};
 return {storage,saves,get latest(){return latest;},get backups(){return backups;}};
}
const records=[];
// Reproduce the exact older-bytes seam used in app-data.test.ts:761, without migrating the final file while examining it.
{
 const d=disk();const app=await openAppData({storage:d.storage,today:()=>day,clock:now,seed:db=>dbApi.createTeam(db,{name:'Old'})});await app.saves.flush();
 const old=await dbApi.openDatabase({migrations:[]});const bytes=old.export();old.sqlite.close();
 const template=await app.readBackup((await app.exportBackup()).text);const start=d.saves.length;
 await app.importBackup({...template,bytes});await app.saves.flush();
 const versions=d.saves.slice(start).map(rawVersion);
 const reread=await dbApi.openDatabase({bytes:d.latest});
 records.push({case:'migration-last-bytes',versions,liveVersion:app.db().schemaVersion(),diskRawVersion:rawVersion(d.latest),testHelperVersion:reread.schemaVersion(),originalTestAssertionsWouldPass:names(reread).length===0&&d.saves[start].toString()!==bytes.toString()});
 assert.equal(rawVersion(d.latest),0);assert.equal(app.db().schemaVersion(),dbApi.LATEST_SCHEMA_VERSION);
 reread.sqlite.close();app.db().sqlite.close();
}
// One failing replacement followed by a valid one, with writes attempted before and between the turns.
{
 const d=disk();const app=await openAppData({storage:d.storage,today:()=>day,clock:now,seed:db=>dbApi.createTeam(db,{name:'Original'})});await app.saves.flush();
 const other=await openAppData({today:()=>day,clock:now,seed:db=>dbApi.createTeam(db,{name:'Imported'})});
 const preview=await app.readBackup((await other.exportBackup()).text);other.db().sqlite.close();
 const gate=deferred(),started=deferred();let calls=0;const backup=d.storage.backup;
 d.storage.backup=async()=>{if(++calls===1){started.resolve();await gate.promise;}return backup();};
 const first=app.importBackup({...preview,bytes:new TextEncoder().encode('invalid')}).catch(e=>e.message);
 const second=app.importBackup(preview);
 const refusal=()=>{try{app.run(db=>dbApi.createTeam(db,{name:'Forbidden'}));return 'WRITE RAN';}catch(e){return e.code;}};
 const immediate=refusal();await started.promise;const waiting=refusal();
 gate.resolve();const failure=await first;await second;await app.saves.flush();
 records.push({case:'failed-then-success',immediate,waiting,failure,teams:names(app.db()),generation:app.generation(),replacing:app.replacing(),backups:d.backups});
 assert.deepEqual(names(app.db()),['Imported']);assert.equal(app.generation(),1);assert.equal(immediate,'DATA_REPLACING');assert.equal(waiting,'DATA_REPLACING');app.db().sqlite.close();
}
// Failed write, newer write, two concurrent flushes: neither flush may retry the obsolete snapshot.
{
 const started=[];let failures=1;const q=createPersistQueue(async b=>{const text=new TextDecoder().decode(b);started.push(text);if(failures-->0)throw Error('disk full');});
 q.persist(new TextEncoder().encode('v1'));await q.idle();q.persist(new TextEncoder().encode('v2'));await Promise.all([q.flush(),q.flush()]);
 records.push({case:'two-flushes',started,failed:q.failed(),unsaved:q.unsaved()});assert.deepEqual(started,['v1','v2']);
}
// Measure the real load fixture at the data port; this is a Node measurement, not UI frame timing.
{
 const file=join('C:/workspace/deep-review-1-6/common/load','load-2026-10-12-seed6.p2cbackup');const text=readFileSync(file,'utf8');const data=JSON.parse(text);
 const app=await openAppData({today:()=>day,clock:now,seed:()=>{}});const read=[],replace=[],exports=[],cold=[],warm=[],queries=[];
 for(let i=0;i<5;i++){
  let t=performance.now();const preview=await app.readBackup(text);read.push(performance.now()-t);
  t=performance.now();await app.importBackup(preview);replace.push(performance.now()-t);
  t=performance.now();const exp=await app.exportBackup();exports.push(performance.now()-t);assert.equal(JSON.parse(exp.text).tables.customers.length,data.tables.customers.length);
  let n=0;const db=app.db();const prepare=db.sqlite.prepare.bind(db.sqlite);db.sqlite.prepare=(...a)=>{n++;return prepare(...a);};
  t=performance.now();const tables=app.tables();for(const key of ['teams','people','customers','appointments','policies','transitions']) void tables[key];cold.push(performance.now()-t);queries.push(n);
  t=performance.now();for(let k=0;k<100;k++)for(const key of ['teams','people','customers','appointments','policies','transitions']) void app.tables()[key];warm.push(performance.now()-t);assert.equal(n,queries.at(-1));
  db.sqlite.prepare=prepare;
  writeFileSync(join(out,'load.sqlite'),db.export());
 }
 records.push({case:'node-load-perf',machine:os.hostname(),backupBytes:Buffer.byteLength(text),sqliteBytes:readFileSync(join(out,'load.sqlite')).length,rows:Object.fromEntries(Object.entries(data.tables).map(([k,v])=>[k,v.length])),readMs:read,replaceMs:replace,exportMs:exports,coldTablesMs:cold,warmTables600ReadsMs:warm,queries});app.db().sqlite.close();
}
writeFileSync(join(out,'node-probe.json'),JSON.stringify(records,null,2)+'\n');
console.log(JSON.stringify(records,null,2));
```

#### storage-probe.rs

```rust
#[path = "storage.rs"] mod storage;
use std::{fs,path::PathBuf,time::Instant,process::{Command,Stdio}};
use std::os::windows::{fs::OpenOptionsExt,process::CommandExt};
fn main() {
 let out=PathBuf::from("C:/workspace/deep-review-1-6/codex/B");
 let bytes=fs::read(out.join("load.sqlite")).unwrap();
 let args:Vec<String>=std::env::args().collect();
 if args.get(1).is_some_and(|s|s=="child") {
  let dir=PathBuf::from(&args[2]);let lock=storage::DataLock::new();
  for _ in 0..200 {storage::save(&dir,&bytes,"child",&lock).unwrap();} return;
 }
 let dir=out.join(format!("storage-run-{}",std::process::id()));
 let lock=storage::DataLock::new();storage::open(&dir,"one",&lock).unwrap();
 storage::save(&dir,&bytes,"one",&lock).unwrap();
 let other=storage::open(&dir,"two",&storage::DataLock::new()).unwrap_err();assert_eq!(other.to_string(),storage::ALREADY_OPEN);
 storage::open(&dir,"two",&lock).unwrap();let stale=storage::save(&dir,&bytes,"one",&lock).unwrap_err();assert_eq!(stale.to_string(),storage::STALE_PAGE);
 println!("LOCK other={} stale={}",other,stale);
 let held=fs::OpenOptions::new().read(true).share_mode(1).open(dir.join("project2c.db")).unwrap();
 let err=storage::save(&dir,b"replacement","two",&lock).unwrap_err();assert_eq!(fs::read(dir.join("project2c.db")).unwrap(),bytes);drop(held);
 storage::save(&dir,&bytes,"two",&lock).unwrap();println!("SAVE target-held={} old-bytes-preserved=true retry=true",err);
 for name in ["a/b.xlsx","..\\out.xlsx","a.xlsx:stream","C:\\a.xlsx",".xlsx","a.xlsx.exe"] {assert!(storage::write_export(&dir,name,b"x").is_err());}
 let barrier=std::sync::Barrier::new(6);
 let paths=std::thread::scope(|scope| {
  let handles:Vec<_>=(0..6).map(|n|{let dir=&dir;let barrier=&barrier;scope.spawn(move||{barrier.wait();let path=storage::write_export(dir,"same.xlsx",&[n]).unwrap();assert_eq!(fs::read(&path).unwrap(),[n]);path})}).collect();
  handles.into_iter().map(|h|h.join().unwrap()).collect::<Vec<_>>()
 });
 let unique=paths.iter().collect::<std::collections::HashSet<_>>();assert_eq!(unique.len(),6);println!("EXPORT concurrent=6 unique=6 bytes-preserved=true unsafe-names-refused=6");
 let perf=dir.join("perf");let plock=storage::DataLock::new();storage::open(&perf,"perf",&plock).unwrap();
 let mut saves=Vec::new();let mut opens=Vec::new();let mut backs=Vec::new();let mut exps=Vec::new();
 for i in 0..15 {
  let t=Instant::now();storage::save(&perf,&bytes,"perf",&plock).unwrap();saves.push(t.elapsed().as_secs_f64()*1000.);
  let t=Instant::now();storage::open(&perf,"perf",&plock).unwrap();opens.push(t.elapsed().as_secs_f64()*1000.);
  let t=Instant::now();storage::backup(&perf,"20261013-220000",&plock).unwrap();backs.push(t.elapsed().as_secs_f64()*1000.);
  let t=Instant::now();storage::write_export(&perf,&format!("report-{i}.xlsx"),&bytes).unwrap();exps.push(t.elapsed().as_secs_f64()*1000.);
 }
 println!("PERF bytes={} save-ms={:?} open-ms={:?} backup-ms={:?} export-ms={:?}",bytes.len(),saves,opens,backs,exps);
 // Kill only our child process after seeing its temporary DB; no repo or user DB is touched.
 let crash=dir.join("crash");let initial=storage::DataLock::new();storage::save(&crash,&bytes,"initial",&initial).unwrap();drop(initial);
 let mut child=Command::new(std::env::current_exe().unwrap()).arg("child").arg(&crash).creation_flags(0x08000000).stdout(Stdio::null()).stderr(Stdio::null()).spawn().unwrap();
 let start=Instant::now();let mut observed=false;
 while start.elapsed().as_secs()<5 {if crash.join("project2c.db.tmp").exists(){observed=true;break;}if child.try_wait().unwrap().is_some(){break;}}
 let _=child.kill();child.wait().unwrap();
 assert_eq!(fs::read(crash.join("project2c.db")).unwrap(),bytes);
 let new_lock=storage::DataLock::new();assert_eq!(storage::open(&crash,"new",&new_lock).unwrap(),Some(bytes.clone()));
 assert!(!crash.join("project2c.db.tmp").exists());
 println!("CRASH observed-tmp={} whole-load-file=true restart-cleaned-tmp=true",observed);
 fs::write(out.join("storage-perf.json"),format!("{{\"bytes\":{},\"saveMs\":{:?},\"openMs\":{:?},\"backupMs\":{:?},\"exportMs\":{:?},\"crashObservedTmp\":{}}}",bytes.len(),saves,opens,backs,exps,observed)).unwrap();
}
```

#### exports-audit.mjs

```javascript
import {readFileSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {gzipSync} from 'node:zlib';
const root='C:/workspace/Project-2C-review-2',out='C:/workspace/deep-review-1-6/codex/B';
const ts=createRequire(root+'/package.json')('typescript');
const git=spawnSync('git',['ls-files','apps/desktop/src/data'],{cwd:root,encoding:'utf8'});
const files=git.stdout.trim().split(/\r?\n/).filter(f=>!f.includes('/ai-')&&!f.includes('.test.')&&/\.tsx?$/.test(f));
const rows=[];
for(const file of files){
 const src=ts.createSourceFile(file,readFileSync(root+'/'+file,'utf8'),ts.ScriptTarget.Latest,true,file.endsWith('x')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 for(const node of src.statements){
  if(!node.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword))continue;
  const names=ts.isVariableStatement(node)?node.declarationList.declarations.map(d=>d.name.getText(src)):[node.name?.getText(src)].filter(Boolean);
  for(const name of names){
   const rg=spawnSync('rg',['-l','-w',name,'apps/desktop/src','packages','tools','e2e','-g','*.ts','-g','*.tsx','-g','*.mjs','-g','!*.test.ts'],{cwd:root,encoding:'utf8'});
   const refs=rg.stdout.trim().split(/\r?\n/).filter(Boolean).map(p=>p.replaceAll('\\','/')).filter(p=>p!==file);
   rows.push({file,name,kind:ts.SyntaxKind[node.kind],outsideFiles:refs});
  }
 }
}
const assets=spawnSync('git',['ls-files','apps/desktop/src-tauri/Cargo.lock','apps/desktop/src-tauri/Cargo.toml'],{cwd:root,encoding:'utf8'}).stdout.trim().split(/\r?\n/);
const {readdirSync,statSync}=await import('node:fs');
const bundle=readdirSync(root+'/apps/desktop/dist/assets').filter(f=>/\.(js|css)$/.test(f)).map(f=>({file:f,bytes:statSync(root+'/apps/desktop/dist/assets/'+f).size,gzipBytes:gzipSync(readFileSync(root+'/apps/desktop/dist/assets/'+f)).length}));
writeFileSync(out+'/exports-audit.json',JSON.stringify({rows,bundle,assets},null,2)+'\n');
console.log(JSON.stringify({exportedDeclarations:rows.length,onlyInOwnFile:rows.filter(r=>r.outsideFiles.length===0),bundle},null,2));
```

#### exe-ipc-perf.mjs

```javascript
import {readFileSync,writeFileSync,copyFileSync,mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import os from 'node:os';
const root='C:/workspace/Project-2C-review-2',out='C:/workspace/deep-review-1-6/codex/B';
const run=out+'/exe-run',data=run+'/Project2C-data';mkdirSync(data,{recursive:true});
copyFileSync('C:/workspace/deep-review-1-6/common/exe/project2c.exe',run+'/project2c.exe');
copyFileSync(out+'/load.sqlite',data+'/project2c.db');
const port=9337;
const proc=spawn(run+'/project2c.exe',[],{cwd:run,windowsHide:true,env:{...process.env,WEBVIEW2_USER_DATA_FOLDER:run+'/webview',WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS:`--remote-debugging-port=${port}`},stdio:'ignore'});
proc.on('exit',(code,signal)=>console.log('child-exit',code,signal));proc.on('error',e=>console.log('child-error',e.message));
const {chromium}=createRequire(root+'/package.json')('@playwright/test');
let browser;
try {
 for(let i=0;i<60;i++){try{const r=await fetch(`http://127.0.0.1:${port}/json/list`);if(r.ok)break;}catch{}await delay(250);}
 browser=await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
 const page=browser.contexts()[0].pages()[0];
 await page.waitForFunction(()=>document.body.textContent.includes('Tổng quan')&&document.querySelectorAll('table').length>0,{timeout:20000});
 const results=await page.evaluate(async()=>{
  const invoke=window.__TAURI_INTERNALS__.invoke;
  const results={openMs:[],saveMs:[],backupMs:[],exportMs:[],bytes:0};
  const bytes=new Uint8Array(await invoke('db_open',{page:'codex-b-perf'}));results.bytes=bytes.length;
  for(let i=0;i<5;i++){
   let t=performance.now();await invoke('db_open',{page:'codex-b-perf'});results.openMs.push(performance.now()-t);
   for(let j=0;j<3;j++){t=performance.now();await invoke('db_save',bytes,{headers:{'x-p2c-page':'codex-b-perf'}});results.saveMs.push(performance.now()-t);}
   t=performance.now();await invoke('db_backup',{utcOffsetMinutes:420});results.backupMs.push(performance.now()-t);
   t=performance.now();await invoke('export_write',bytes,{headers:{'x-p2c-file-name':'probe.xlsx'}});results.exportMs.push(performance.now()-t);
  }
  results.startupOpenMs=performance.getEntriesByName('p2c:data-open')[0]?.startTime;
  return results;
 });
 results.machine=os.hostname();results.debugPort=port;results.kind='exe IPC port timing, no frame wait';
 writeFileSync(out+'/exe-ipc-perf.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2));
}finally{if(browser)await browser.close();proc.kill();await delay(500);}
```

#### prepare-detached.mjs

```javascript
import {readFileSync,writeFileSync} from 'node:fs';
const out='C:/workspace/deep-review-1-6/codex/B';
let source=readFileSync(out+'/exe-ipc-perf.mjs','utf8');
source=source.replace("const run=out+'/exe-run'", "const run=out+'/exe-detached-run'");
source=source.replace('const port=9337;', 'const port=9338;');
source=source.replace('const results=await page.evaluate(async()=>{', 'await page.evaluate(()=>{ setTimeout(async()=>{');
source=source.replace('return results;\n });', `window.bPerfResult=results;\n },1000);\n });
 await browser.close();browser=undefined;await delay(6500);
 browser=await chromium.connectOverCDP('http://127.0.0.1:'+port);
 const nextPage=browser.contexts()[0].pages()[0];
 await nextPage.waitForFunction(()=>window.bPerfResult,null,{timeout:10000});
 const results=await nextPage.evaluate(()=>window.bPerfResult);`);
source=source.replace("kind='exe IPC port timing, no frame wait'", "kind='exe IPC port timing, debugger detached during samples, no frame wait'");
source=source.replace("out+'/exe-ipc-perf.json'", "out+'/exe-detached-perf.json'");
writeFileSync(out+'/exe-detached-perf.mjs',source);
```

#### exe-detached-perf.mjs

```javascript
import {readFileSync,writeFileSync,copyFileSync,mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import os from 'node:os';
const root='C:/workspace/Project-2C-review-2',out='C:/workspace/deep-review-1-6/codex/B';
const run=out+'/exe-detached-run',data=run+'/Project2C-data';mkdirSync(data,{recursive:true});
copyFileSync('C:/workspace/deep-review-1-6/common/exe/project2c.exe',run+'/project2c.exe');
copyFileSync(out+'/load.sqlite',data+'/project2c.db');
const port=9338;
const proc=spawn(run+'/project2c.exe',[],{cwd:run,windowsHide:true,env:{...process.env,WEBVIEW2_USER_DATA_FOLDER:run+'/webview',WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS:`--remote-debugging-port=${port}`},stdio:'ignore'});
proc.on('exit',(code,signal)=>console.log('child-exit',code,signal));proc.on('error',e=>console.log('child-error',e.message));
const {chromium}=createRequire(root+'/package.json')('@playwright/test');
let browser;
try {
 for(let i=0;i<60;i++){try{const r=await fetch(`http://127.0.0.1:${port}/json/list`);if(r.ok)break;}catch{}await delay(250);}
 browser=await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
 const page=browser.contexts()[0].pages()[0];
 await page.waitForFunction(()=>document.body.textContent.includes('Tổng quan')&&document.querySelectorAll('table').length>0,{timeout:20000});
 await page.evaluate(()=>{ setTimeout(async()=>{
  const invoke=window.__TAURI_INTERNALS__.invoke;
  const results={openMs:[],saveMs:[],backupMs:[],exportMs:[],bytes:0};
  const bytes=new Uint8Array(await invoke('db_open',{page:'codex-b-perf'}));results.bytes=bytes.length;
  for(let i=0;i<5;i++){
   let t=performance.now();await invoke('db_open',{page:'codex-b-perf'});results.openMs.push(performance.now()-t);
   for(let j=0;j<3;j++){t=performance.now();await invoke('db_save',bytes,{headers:{'x-p2c-page':'codex-b-perf'}});results.saveMs.push(performance.now()-t);}
   t=performance.now();await invoke('db_backup',{utcOffsetMinutes:420});results.backupMs.push(performance.now()-t);
   t=performance.now();await invoke('export_write',bytes,{headers:{'x-p2c-file-name':'probe.xlsx'}});results.exportMs.push(performance.now()-t);
  }
  results.startupOpenMs=performance.getEntriesByName('p2c:data-open')[0]?.startTime;
  window.bPerfResult=results;
 },1000);
 });
 await browser.close();browser=undefined;await delay(6500);
 browser=await chromium.connectOverCDP('http://127.0.0.1:'+port);
 const nextPage=browser.contexts()[0].pages()[0];
 await nextPage.waitForFunction(()=>window.bPerfResult,null,{timeout:10000});
 const results=await nextPage.evaluate(()=>window.bPerfResult);
 results.machine=os.hostname();results.debugPort=port;results.kind='exe IPC port timing, debugger detached during samples, no frame wait';
 writeFileSync(out+'/exe-detached-perf.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2));
}finally{if(browser)await browser.close();proc.kill();await delay(500);}
```

#### prepare-ui.mjs

```javascript
import {readFileSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const root='C:/workspace/Project-2C-review-2',out='C:/workspace/deep-review-1-6/codex/B';
const ts=createRequire(root+'/package.json')('typescript');
const probe=readFileSync(root+'/e2e/perf/probe.perf.ts','utf8');
const time=probe.slice(probe.indexOf('async function timeInPage('),probe.indexOf('const measures ='));
const javascript=ts.transpileModule(time,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
let prefix=readFileSync(out+'/exe-ipc-perf.mjs','utf8');prefix=prefix.slice(0,prefix.indexOf(' const results=await page.evaluate'));
prefix=prefix.replace("const run=out+'/exe-run'", "const run=out+'/exe-ui-run'").replace('const port=9337;', 'const port=9339;');
const body=`
 const samples=[];
 const connectAgain=async()=>{browser=await chromium.connectOverCDP('http://127.0.0.1:'+port);return browser.contexts()[0].pages()[0];};
 const measure=async(p,target,ready,saves=false)=>{
  await target.evaluate(el=>el.setAttribute('data-p2c-perf',''));
  await p.evaluate(timeInPage,{action:'click',ready,saves,delay:1000});
  await browser.close();browser=undefined;await delay(4100);
  const next=await connectAgain();await next.waitForFunction(()=>window.p2cPerf,null,{timeout:60000});
  const result=await next.evaluate(()=>window.p2cPerf);if(result.error)throw Error(result.error);return [next,result];
 };
 let current=page;
 for(let i=0;i<5;i++){
  await current.evaluate(()=>location.hash='#/settings');
  const input=current.locator('input[type=file]');await input.waitFor({state:'attached'});
  await input.evaluate(el=>el.addEventListener('change',()=>el.dataset.picked=String(performance.now()),{capture:true,once:true}));
  await input.setInputFiles('C:/workspace/deep-review-1-6/common/load/load-2026-10-12-seed6.p2cbackup');
  await current.getByRole('dialog').waitFor({state:'visible'});
  const read=await input.evaluate(el=>performance.now()-Number(el.dataset.picked));
  let pair=await measure(current,current.getByRole('dialog').getByRole('button',{name:'Backup rồi thay dữ liệu'}),{selector:'[role="status"]',text:'Đã nhập backup'},true);
  current=pair[0];const imported=pair[1];
  pair=await measure(current,current.getByRole('button',{name:'Xuất backup',exact:true}),{selector:'[role="status"]',text:'Đã xuất'});
  current=pair[0];samples.push({readMs:read,importMs:imported.ms,saveMs:imported.save,exportMs:pair[1].ms});
 }
 const result={machine:os.hostname(),debugPort:port,kind:'UI file import and export; original timeInPage copied; debugger detached during writes',samples};
 writeFileSync(out+'/exe-ui-perf.json',JSON.stringify(result,null,2)+'\\n');console.log(JSON.stringify(result,null,2));
}finally{if(browser)await browser.close();proc.kill();await delay(500);}
`;
writeFileSync(out+'/exe-ui-perf.mjs',javascript+'\n'+prefix+body);
```

#### exe-ui-perf.mjs

```javascript
"use strict";
async function timeInPage({ action, hash, ready, saves, delay }) {
    const met = () => {
        if (!ready)
            return true;
        const hit = [...document.querySelectorAll(ready.selector)].some((element) => ready.text === undefined || (element.textContent ?? '').includes(ready.text));
        return ready.absent ? !hit : hit;
    };
    const saved = () => performance.getEntriesByName('p2c:db-save', 'measure');
    // A hidden or covered window paints no frames: say so rather than wait for ever.
    const frame = () => new Promise((resolve) => {
        requestAnimationFrame(() => resolve(true));
        setTimeout(() => resolve(false), 2_000);
    });
    const run = async () => {
        const target = document.querySelector('[data-p2c-perf]');
        target?.removeAttribute('data-p2c-perf');
        if (action === 'click' && !target)
            return { error: 'no element to click' };
        const saves0 = saved().length;
        const start = action === 'load' ? 0 : performance.now();
        if (action === 'click')
            target?.click();
        if (action === 'hash')
            location.hash = hash ?? '';
        // Checked before each paint; the time is taken once that frame is painted.
        do {
            if (!(await frame()))
                return { error: 'no frame painted: keep the exe window in front' };
            if (performance.now() - start > 60_000)
                return { error: 'not done after 60 s' };
        } while (!met());
        await new Promise((resolve) => setTimeout(resolve));
        const ms = performance.now() - start;
        if (!saves)
            return { ms };
        while (saved().length === saves0) {
            if (performance.now() - start > 60_000)
                return { ms, error: 'no file save after 60 s' };
            await new Promise((resolve) => setTimeout(resolve, 20));
        }
        return { ms, save: saved().at(-1)?.duration };
    };
    if (delay === undefined)
        return run();
    window.p2cPerf = undefined;
    setTimeout(() => void run().then((result) => (window.p2cPerf = result)), delay);
    return null;
}

import {readFileSync,writeFileSync,copyFileSync,mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import os from 'node:os';
const root='C:/workspace/Project-2C-review-2',out='C:/workspace/deep-review-1-6/codex/B';
const run=out+'/exe-ui-run',data=run+'/Project2C-data';mkdirSync(data,{recursive:true});
copyFileSync('C:/workspace/deep-review-1-6/common/exe/project2c.exe',run+'/project2c.exe');
copyFileSync(out+'/load.sqlite',data+'/project2c.db');
const port=9339;
const proc=spawn(run+'/project2c.exe',[],{cwd:run,windowsHide:true,env:{...process.env,WEBVIEW2_USER_DATA_FOLDER:run+'/webview',WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS:`--remote-debugging-port=${port}`},stdio:'ignore'});
proc.on('exit',(code,signal)=>console.log('child-exit',code,signal));proc.on('error',e=>console.log('child-error',e.message));
const {chromium}=createRequire(root+'/package.json')('@playwright/test');
let browser;
try {
 for(let i=0;i<60;i++){try{const r=await fetch(`http://127.0.0.1:${port}/json/list`);if(r.ok)break;}catch{}await delay(250);}
 browser=await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
 const page=browser.contexts()[0].pages()[0];
 await page.waitForFunction(()=>document.body.textContent.includes('Tổng quan')&&document.querySelectorAll('table').length>0,{timeout:20000});

 const samples=[];
 const connectAgain=async()=>{browser=await chromium.connectOverCDP('http://127.0.0.1:'+port);return browser.contexts()[0].pages()[0];};
 const measure=async(p,target,ready,saves=false)=>{
  await target.evaluate(el=>el.setAttribute('data-p2c-perf',''));
  await p.evaluate(timeInPage,{action:'click',ready,saves,delay:1000});
  await browser.close();browser=undefined;await delay(4100);
  const next=await connectAgain();await next.waitForFunction(()=>window.p2cPerf,null,{timeout:60000});
  const result=await next.evaluate(()=>window.p2cPerf);if(result.error)throw Error(result.error);return [next,result];
 };
 let current=page;
 for(let i=0;i<5;i++){
  await current.evaluate(()=>location.hash='#/settings');
  const input=current.locator('input[type=file]');await input.waitFor({state:'attached'});
  await input.evaluate(el=>el.addEventListener('change',()=>el.dataset.picked=String(performance.now()),{capture:true,once:true}));
  await input.setInputFiles('C:/workspace/deep-review-1-6/common/load/load-2026-10-12-seed6.p2cbackup');
  await current.getByRole('dialog').waitFor({state:'visible'});
  const read=await input.evaluate(el=>performance.now()-Number(el.dataset.picked));
  let pair=await measure(current,current.getByRole('dialog').getByRole('button',{name:'Backup rồi thay dữ liệu'}),{selector:'[role="status"]',text:'Đã nhập backup'},true);
  current=pair[0];const imported=pair[1];
  pair=await measure(current,current.getByRole('button',{name:'Xuất backup',exact:true}),{selector:'[role="status"]',text:'Đã xuất'});
  current=pair[0];samples.push({readMs:read,importMs:imported.ms,saveMs:imported.save,exportMs:pair[1].ms});
 }
 const result={machine:os.hostname(),debugPort:port,kind:'UI file import and export; original timeInPage copied; debugger detached during writes',samples};
 writeFileSync(out+'/exe-ui-perf.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
}finally{if(browser)await browser.close();proc.kill();await delay(500);}
```

#### exe-ui-repeat.mjs

```javascript
"use strict";
async function timeInPage({ action, hash, ready, saves, delay }) {
    const met = () => {
        if (!ready)
            return true;
        const hit = [...document.querySelectorAll(ready.selector)].some((element) => ready.text === undefined || (element.textContent ?? '').includes(ready.text));
        return ready.absent ? !hit : hit;
    };
    const saved = () => performance.getEntriesByName('p2c:db-save', 'measure');
    // A hidden or covered window paints no frames: say so rather than wait for ever.
    const frame = () => new Promise((resolve) => {
        requestAnimationFrame(() => resolve(true));
        setTimeout(() => resolve(false), 2_000);
    });
    const run = async () => {
        const target = document.querySelector('[data-p2c-perf]');
        target?.removeAttribute('data-p2c-perf');
        if (action === 'click' && !target)
            return { error: 'no element to click' };
        const saves0 = saved().length;
        const start = action === 'load' ? 0 : performance.now();
        if (action === 'click')
            target?.click();
        if (action === 'hash')
            location.hash = hash ?? '';
        // Checked before each paint; the time is taken once that frame is painted.
        do {
            if (!(await frame()))
                return { error: 'no frame painted: keep the exe window in front' };
            if (performance.now() - start > 60_000)
                return { error: 'not done after 60 s' };
        } while (!met());
        await new Promise((resolve) => setTimeout(resolve));
        const ms = performance.now() - start;
        if (!saves)
            return { ms };
        while (saved().length === saves0) {
            if (performance.now() - start > 60_000)
                return { ms, error: 'no file save after 60 s' };
            await new Promise((resolve) => setTimeout(resolve, 20));
        }
        return { ms, save: saved().at(-1)?.duration };
    };
    if (delay === undefined)
        return run();
    window.p2cPerf = undefined;
    setTimeout(() => void run().then((result) => (window.p2cPerf = result)), delay);
    return null;
}

import {readFileSync,writeFileSync,copyFileSync,mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import os from 'node:os';
const root='C:/workspace/Project-2C-review-2',out='C:/workspace/deep-review-1-6/codex/B';
const run=out+'/exe-ui-repeat-run',data=run+'/Project2C-data';mkdirSync(data,{recursive:true});
copyFileSync('C:/workspace/deep-review-1-6/common/exe/project2c.exe',run+'/project2c.exe');
copyFileSync(out+'/load.sqlite',data+'/project2c.db');
const port=9339;
const proc=spawn(run+'/project2c.exe',[],{cwd:run,windowsHide:true,env:{...process.env,WEBVIEW2_USER_DATA_FOLDER:run+'/webview',WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS:`--remote-debugging-port=${port}`},stdio:'ignore'});
proc.on('exit',(code,signal)=>console.log('child-exit',code,signal));proc.on('error',e=>console.log('child-error',e.message));
const {chromium}=createRequire(root+'/package.json')('@playwright/test');
let browser;
try {
 for(let i=0;i<60;i++){try{const r=await fetch(`http://127.0.0.1:${port}/json/list`);if(r.ok)break;}catch{}await delay(250);}
 browser=await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
 const page=browser.contexts()[0].pages()[0];
 await page.waitForFunction(()=>performance.getEntriesByName('p2c:data-open').length>0,{timeout:20000});

 const samples=[];
 const connectAgain=async()=>{browser=await chromium.connectOverCDP('http://127.0.0.1:'+port);return browser.contexts()[0].pages()[0];};
 const measure=async(p,target,ready,saves=false)=>{
  await target.evaluate(el=>el.setAttribute('data-p2c-perf',''));
  await p.evaluate(timeInPage,{action:'click',ready,saves,delay:1000});
  await browser.close();browser=undefined;await delay(4100);
  const next=await connectAgain();await next.waitForFunction(()=>window.p2cPerf,null,{timeout:60000});
  const result=await next.evaluate(()=>window.p2cPerf);if(result.error)throw Error(result.error);return [next,result];
 };
 let current=page;
 for(let i=0;i<5;i++){
  await current.evaluate(()=>location.hash='#/settings');
  const input=current.locator('input[type=file]');await input.waitFor({state:'attached'});
  await input.evaluate(el=>el.addEventListener('change',()=>el.dataset.picked=String(performance.now()),{capture:true,once:true}));
  await input.setInputFiles('C:/workspace/deep-review-1-6/common/load/load-2026-10-12-seed6.p2cbackup');
  await current.getByRole('dialog').waitFor({state:'visible'});
  const read=await input.evaluate(el=>performance.now()-Number(el.dataset.picked));
  let pair=await measure(current,current.getByRole('dialog').getByRole('button',{name:'Backup rồi thay dữ liệu'}),{selector:'[role="status"]',text:'Đã nhập backup'},true);
  current=pair[0];const imported=pair[1];
  pair=await measure(current,current.getByRole('button',{name:'Xuất backup',exact:true}),{selector:'[role="status"]',text:'Đã xuất'});
  current=pair[0];samples.push({readMs:read,importMs:imported.ms,saveMs:imported.save,exportMs:pair[1].ms});
 }
 const result={machine:os.hostname(),debugPort:port,kind:'UI file import and export; original timeInPage copied; debugger detached during writes',samples};
 writeFileSync(out+'/exe-ui-repeat.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
}finally{if(browser)await browser.close();proc.kill();await delay(500);}
```

### 8.5 Trạng thái cuối và giờ xong

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

SHA cuối: **885534549808f42aec7f9af5743bbf86642ee4bd**. Status cuối trùng đầu, không có file tracked thay đổi.

Giờ xong: **2026-10-13 22:20:12 GMT+7** (Asia/Bangkok, UTC+07:00).
