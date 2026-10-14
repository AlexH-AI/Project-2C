# Codex — Gói A: Lõi dữ liệu — deep review Phase 1–6, lượt 1

## 1. Mốc phiên

- Bên: **Codex**, ID **CX**; gói **A — Lõi dữ liệu**.
- Repo: `C:\workspace\Project-2C-review-2`; detached HEAD.
- SHA đầu phiên: **885534549808f42aec7f9af5743bbf86642ee4bd** (`8855345`). SHA cuối phiên: cùng SHA.
- Bắt đầu: **2026-10-13 21:11:26 +07:00**. Kết thúc: **2026-10-13 21:35:56 +07:00** (Asia/Bangkok).
- Máy: **DESKTOP-KDURKJP**, Intel Core i9-12900K; Node **v24.20.0**.
- Trạng thái đầu phiên, nguyên văn:

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

Chỉ đọc repo; không sửa code, commit, tạo Issue hay PR. Không dùng subagent, không gọi AI thật, không đọc key. Các file kết quả và đột biến chỉ ở thư mục Codex của Gói A. Không mở, đọc, liệt kê hay tìm kiếm thư mục/báo cáo của bên khác trong đợt này.

## 2. Phạm vi đã đọc

Đã đọc từng file code/test/SQL trong hai package, đối chiếu spec, golden và các lối đọc/ghi nối vào app. Lệnh kích thước xác nhận **93 file code/SQL, 7.473 dòng sản phẩm, 11.847 dòng test/fixture, 289 dòng migration SQL**; JSON/Markdown/cấu hình phụ được ghi riêng dưới đây. Dòng là số dòng vật lý của file ở SHA ghim, bao gồm dòng trắng; không đồng nhất với cột kích thước của size-report.

| File | Dòng đã đọc |
|---|---|
| `packages/db/CLAUDE.md` | 1–53 |
| `packages/db/drizzle.config.ts` | 1–7 |
| `packages/db/migrations/0000_init.sql` | 1–33 |
| `packages/db/migrations/0001_customers_policies.sql` | 1–86 |
| `packages/db/migrations/0002_kyc.sql` | 1–44 |
| `packages/db/migrations/0003_kyc_append_only.sql` | 1–22 |
| `packages/db/migrations/0004_appointment_outcome_reviewer.sql` | 1–6 |
| `packages/db/migrations/0005_ai_analyses.sql` | 1–35 |
| `packages/db/migrations/0006_ai_analyses_append_only.sql` | 1–11 |
| `packages/db/migrations/0007_ai_analyses_chatgpt_web.sql` | 1–40 |
| `packages/db/migrations/0008_ai_analyses_append_only_rebuilt.sql` | 1–12 |
| `packages/db/package.json` | 1–24 |
| `packages/db/src/ai-analyses.test.ts` | 1–725 |
| `packages/db/src/ai-analyses.ts` | 1–337 |
| `packages/db/src/appointments.test.ts` | 1–1084 |
| `packages/db/src/appointments.ts` | 1–545 |
| `packages/db/src/backup-engine.test.ts` | 1–22 |
| `packages/db/src/backup-invariants.test.ts` | 1–1158 |
| `packages/db/src/backup-validation.ts` | 1–438 |
| `packages/db/src/backup.test.ts` | 1–498 |
| `packages/db/src/backup.ts` | 1–203 |
| `packages/db/src/common.test.ts` | 1–36 |
| `packages/db/src/common.ts` | 1–165 |
| `packages/db/src/counts.test.ts` | 1–104 |
| `packages/db/src/counts.ts` | 1–90 |
| `packages/db/src/customers.test.ts` | 1–360 |
| `packages/db/src/customers.ts` | 1–370 |
| `packages/db/src/database.test.ts` | 1–584 |
| `packages/db/src/database.ts` | 1–229 |
| `packages/db/src/errors.ts` | 1–108 |
| `packages/db/src/golden-kyc.test.ts` | 1–71 |
| `packages/db/src/golden-metrics.test.ts` | 1–188 |
| `packages/db/src/ids.test.ts` | 1–33 |
| `packages/db/src/ids.ts` | 1–34 |
| `packages/db/src/index.ts` | 1–96 |
| `packages/db/src/kyc.test.ts` | 1–672 |
| `packages/db/src/kyc.ts` | 1–551 |
| `packages/db/src/migrations.ts` | 1–39 |
| `packages/db/src/policies.test.ts` | 1–214 |
| `packages/db/src/policies.ts` | 1–154 |
| `packages/db/src/reads.test.ts` | 1–232 |
| `packages/db/src/schema.ts` | 1–384 |
| `packages/db/src/seed-data.ts` | 1–306 |
| `packages/db/src/seed-invariants.test.ts` | 1–209 |
| `packages/db/src/seed.test.ts` | 1–366 |
| `packages/db/src/seed.ts` | 1–673 |
| `packages/db/src/settings.test.ts` | 1–39 |
| `packages/db/src/settings.ts` | 1–29 |
| `packages/db/src/sql-raw.d.ts` | 1–5 |
| `packages/db/src/team.test.ts` | 1–331 |
| `packages/db/src/team.ts` | 1–320 |
| `packages/db/src/test-support.ts` | 1–39 |
| `packages/db/src/trash.test.ts` | 1–454 |
| `packages/db/src/trash.ts` | 1–254 |
| `packages/db/tsconfig.json` | 1–8 |
| `packages/domain/CLAUDE.md` | 1–52 |
| `packages/domain/package.json` | 1–12 |
| `packages/domain/src/appointment-counts.test.ts` | 1–155 |
| `packages/domain/src/appointment-counts.ts` | 1–116 |
| `packages/domain/src/compare.test.ts` | 1–224 |
| `packages/domain/src/compare.ts` | 1–80 |
| `packages/domain/src/customer-lifecycle.test.ts` | 1–131 |
| `packages/domain/src/customer-lifecycle.ts` | 1–63 |
| `packages/domain/src/evidence-level.test.ts` | 1–121 |
| `packages/domain/src/evidence-level.ts` | 1–52 |
| `packages/domain/src/golden/appointments.fixture.test.ts` | 1–50 |
| `packages/domain/src/golden/appointments.fixture.ts` | 1–133 |
| `packages/domain/src/golden/kyc.fixture.test.ts` | 1–68 |
| `packages/domain/src/golden/kyc.fixture.ts` | 1–271 |
| `packages/domain/src/golden/metrics.fixture.test.ts` | 1–112 |
| `packages/domain/src/golden/metrics.fixture.ts` | 1–245 |
| `packages/domain/src/golden/stage-snapshot.fixture.test.ts` | 1–74 |
| `packages/domain/src/golden/stage-snapshot.fixture.ts` | 1–222 |
| `packages/domain/src/index.ts` | 1–116 |
| `packages/domain/src/kyc-catalog.test.ts` | 1–81 |
| `packages/domain/src/kyc-catalog.ts` | 1–155 |
| `packages/domain/src/kyc-fact.test.ts` | 1–57 |
| `packages/domain/src/kyc-fact.ts` | 1–71 |
| `packages/domain/src/kyc-gate.test.ts` | 1–136 |
| `packages/domain/src/kyc-gate.ts` | 1–85 |
| `packages/domain/src/kyc.test.ts` | 1–387 |
| `packages/domain/src/kyc.ts` | 1–164 |
| `packages/domain/src/model.ts` | 1–110 |
| `packages/domain/src/money.test.ts` | 1–269 |
| `packages/domain/src/money.ts` | 1–188 |
| `packages/domain/src/name-order.test.ts` | 1–30 |
| `packages/domain/src/name-order.ts` | 1–10 |
| `packages/domain/src/number.test.ts` | 1–72 |
| `packages/domain/src/number.ts` | 1–43 |
| `packages/domain/src/period.test.ts` | 1–755 |
| `packages/domain/src/period.ts` | 1–434 |
| `packages/domain/src/pipeline-stage.test.ts` | 1–15 |
| `packages/domain/src/pipeline-stage.ts` | 1–8 |
| `packages/domain/src/stage-snapshot.test.ts` | 1–272 |
| `packages/domain/src/stage-snapshot.ts` | 1–169 |
| `packages/domain/src/stats-rf.test.ts` | 1–201 |
| `packages/domain/src/stats.test.ts` | 1–347 |
| `packages/domain/src/stats.ts` | 1–272 |
| `packages/domain/tsconfig.json` | 1–7 |

Các snapshot sinh tự động được parse đầy đủ rồi so cấu trúc với DB dựng từ đúng tập migration của từng mốc: chuỗi `prevId`, bảng, cột/thứ tự/kiểu/NOT NULL, khóa ngoại và hành động, unique index, tên CHECK. Không kiểm riêng tương đương toán học của mọi biểu thức CHECK bằng probe này; đã đọc các SQL và có test ràng buộc trong `database.test.ts`.

| File | Phạm vi |
|---|---|
| `packages/db/migrations/meta/0000_snapshot.json` | 1–203, đọc bằng JSON + kiểm cấu trúc qua snapshot-probe |
| `packages/db/migrations/meta/0001_snapshot.json` | 1–742, đọc bằng JSON + kiểm cấu trúc qua snapshot-probe |
| `packages/db/migrations/meta/0002_snapshot.json` | 1–1016, đọc bằng JSON + kiểm cấu trúc qua snapshot-probe |
| `packages/db/migrations/meta/0003_snapshot.json` | 1–1016, đọc bằng JSON + kiểm cấu trúc qua snapshot-probe |
| `packages/db/migrations/meta/0004_snapshot.json` | 1–1036, đọc bằng JSON + kiểm cấu trúc qua snapshot-probe |
| `packages/db/migrations/meta/0005_snapshot.json` | 1–1248, đọc bằng JSON + kiểm cấu trúc qua snapshot-probe |
| `packages/db/migrations/meta/0006_snapshot.json` | 1–1248, đọc bằng JSON + kiểm cấu trúc qua snapshot-probe |
| `packages/db/migrations/meta/0007_snapshot.json` | 1–1248, đọc bằng JSON + kiểm cấu trúc qua snapshot-probe |
| `packages/db/migrations/meta/0008_snapshot.json` | 1–1248, đọc bằng JSON + kiểm cấu trúc qua snapshot-probe |
| `packages/db/migrations/meta/_journal.json` | 1–69, đọc bằng JSON + kiểm cấu trúc qua snapshot-probe |

Tài liệu đối chiếu: `CLAUDE.md`, `CONTEXT.md`, hai `CLAUDE.md` package; `docs/design/phase-3-du-lieu.md`, `phase-4-chi-so.md`, `phase-6-hoan-thien.md` §4–5; `docs/golden/{chi-so,kh-theo-nhom,kyc,lich-hen}.md`; ADR-0007, ADR-0008; `docs/metrics/phase-6.md`; `common/{prompt-codex,plan,known,baseline}.md`, `common/perf/perf-ref.json`.

Chỗ nối ngoài gói đã đọc: `packages/ai/src/schema.ts` 1–356 (schema đầu vào/đầu ra, tạo input, Mock dùng trong seed); `apps/desktop/src/data/tables.ts` 1–68; `app-data.ts` 336–423 (run/replace/import/export); `tools/load-data.mjs` 1–61, `tools/size-report.mjs` 1–48, `tools/size-report-core.mjs` 1–95; `package.json`, `tsconfig.base.json`, `vitest.config.ts`. Các phần còn lại của B/C/D/E/F chờ gói tương ứng.

## 3. Phát hiện

### CX-A1 — Backup nhận một mâu thuẫn KYC có các giá trị trùng nhau

- **ID:** CX-A1
- **Mức:** Low
- **Trục:** D
- **Vị trí:** `packages/db/src/backup-validation.ts:290`, `:302`, `:320` (8855345); đối chiếu `packages/domain/src/kyc.ts:84`, `packages/domain/src/golden/kyc.fixture.test.ts:36`, ADR-0008 §6 (`docs/decisions/0008-kyc-du-kien-co-cau-truc-va-cong-deterministic.md:27`).
- **Tình trạng:** CONFIRMED
- **Mô tả:** `kycRule` chỉ đếm ≥ 2 fact conflict, không kiểm các giá trị khác nhau. File sửa tay chứa hai fact `childrenCount = 2`, đều conflict, nhập thành công và làm cổng báo mâu thuẫn cốt lõi dù hai giá trị bằng nhau. Lệnh `markConflict` và test tính nhất quán golden đều yêu cầu khác giá trị.
- **Tái hiện / bằng chứng:** chạy `node C:\workspace\deep-review-1-6\codex\A\chain-probe.mjs`. Probe tạo KH → xác nhận số con 2 → đánh dấu mâu thuẫn 3 → xuất backup → sửa cả hai `value_json` về `2` trong bộ nhớ → `importBackup` → đọc hồ sơ/cổng. Trích output thật:

```text
duplicate-conflict-imported [ { value: 2, status: 'conflict' }, { value: 2, status: 'conflict' } ] CONFLICT_RESOLUTION
```

- **Ảnh hưởng:** người nhập backup đã sửa tay/hỏng về ngữ nghĩa phải giải quyết một mâu thuẫn giả; AI bị chặn khi đây là trường cốt lõi. Có đường sửa bằng chọn một fact để giải quyết. Ca này cần file bất thường nên giữ Low; chưa thấy đường sinh qua thao tác xác nhận bình thường.
- **Đề xuất:** luật 7 theo từng KH/trường giữ tập giá trị đã parse/chuẩn hóa và từ chối conflict trùng giá trị, đồng bộ với luật của lệnh; thêm ca nhập 2/2, 2/3/3 và ca 2/3 hợp lệ. Ước lượng **≤ 40 dòng SP**, khoảng 40–70 dòng test. K12 tiếp tục áp cho hash phiên bản KYC; phát hiện này là kiểm tập giá trị conflict, không mở lại mục hash KNOWN.

### CX-A2 — Golden L-09 mâu thuẫn luật vai trò người phối hợp đã chốt

- **ID:** CX-A2
- **Mức:** Low
- **Trục:** C
- **Vị trí:** `packages/domain/src/golden/appointments.fixture.ts:67`–68, `packages/domain/src/model.ts:76`, `docs/golden/lich-hen.md:29` (8855345); đối chiếu `docs/design/phase-3-du-lieu.md:115`, `packages/db/src/appointments.ts:412`.
- **Tình trạng:** CONFIRMED
- **Mô tả:** golden đã duyệt còn ghi “RE Dũng phối hợp” và fixture dùng `coordinatorIds: ['re-dung']`; comment của model cũng còn cho phép “other RE”. Quyết định Owner 06/10 và spec hiện hành chỉ cho TL/IS/BD/BDM phối hợp. Vì vậy kịch bản L-09 không thể phát lại nguyên trạng qua lệnh DB hiện hành.
- **Tái hiện / bằng chứng:** cùng `chain-probe.mjs`, đọc chính fixture L-09 rồi đặt một RE khác làm người phối hợp trên KH/RE hợp lệ. Output thật:

```text
golden-L09-coordinators [ 're-dung' ] schedule-error INVALID_COORDINATOR
```

Bộ test gốc của Gói A vẫn xanh **1.229/1.229**. `appointments.fixture.test.ts:20`–23 chỉ kiểm người phối hợp có tồn tại, nên không phát hiện sự lệch vai trò này. Các ca A01–A13 của domain vẫn kiểm đúng phép đếm và không bị sai số do vấn đề tài liệu này.

- **Ảnh hưởng:** người phát lại golden hoặc bổ sung test A01–A13 qua DB gặp hai nguồn chuẩn mâu thuẫn; thiếu liên kết kiểm vai trò giữa golden và luật DB. Chưa thấy sai dữ liệu trong luồng UI vì DB đã giữ đúng quyết định K5.
- **Đề xuất:** Owner/phiên tổng hợp ghi nhận xung đột giữa golden cũ và quyết định mới, thống nhất lại kịch bản chuẩn qua G2; sau quyết định đó đồng bộ fixture và comment, thêm kiểm vai trò hoặc phát lại golden qua DB. **Không đổi code để cho RE phối hợp, không tự sửa golden cho khớp code.** Ước lượng **0–5 dòng SP**, khoảng 10–30 dòng test, cộng tài liệu/golden tùy quyết định.

Không có phát hiện Critical/High/Medium mới trong phạm vi A. Các mục KNOWN được dùng để loại báo trùng: hash KYC khi nhập (K12), nhập bù HĐ/cuộc gặp (K2), trần phí K3, dữ liệu giả lập K1, tập vai trò K5, listTrash đọc bảng tham chiếu, seed quy mô 0 và test TR-5 ở múi giờ Auckland. Không có bằng chứng mới làm tăng hậu quả của các mục đó trong phiên này.

## 4. Bloat

| Đã chạy / đọc | Dữ liệu/phạm vi | Kết quả / số | ID |
|---|---|---|---|
| `pnpm exec tsc -p packages/domain --noEmit --noUnusedLocals --noUnusedParameters` | domain | Exit 0; 0 chẩn đoán | — |
| Cùng lệnh cho `packages/db` | db | Exit 0; 0 chẩn đoán | — |
| `pnpm codemap:check` | Bản đồ export ghim | “Export maps are up to date.” | — |
| `pnpm lint:deps` | Toàn cây dependency để kiểm ranh giới A | 0 vi phạm, 309 module, 1.244 dependency | — |
| `bloat-probe.mjs`: AST lấy export, `rg -n -w` từng tên trong apps/packages/tools/e2e | 36 file SP khai báo export của A | 329 export; 44 không có tham chiếu SP ở **file khác** (27 type, 17 value) | — |
| Kiểm tay 44 ứng viên với nguồn, index và test | A | Nhiều mục dùng nội bộ cùng file; 5 helper getTeam/getPerson/getAppointment/getPolicy/markKycVersionMaterial chỉ dùng bởi test và không re-export qua API. Không suy “dead code” từ số tham chiếu này | — |
| Đọc các helper cập nhật hàng, KYC/profile, phân loại/matcher | A | Không xác nhận được khối logic độc lập lặp ≥ 3 nơi cần refactor; helper cập nhật của 5 bảng tương tự nhau nhưng giữ kiểu/lối cập nhật riêng | — |
| Dependency của db và biên schema AI | db: domain, ai/schema, drizzle, sql.js, zod | Có nơi dùng; không thêm dependency/công cụ | — |
| `pnpm build:web` | SHA 8855345 | Thành công, 1.093 module; Vite có cảnh báo chunk > 600 kB | — |
| `node tools/size-report.mjs --json --exe …common\exe\project2c.exe` | Bundle vừa build, exe tham chiếu | Số byte như bảng dưới, Δ 0 so baseline | — |

44 ứng viên là tìm kiếm theo tên, không phải phân tích dùng symbol chính xác; có thể trùng tên. Kết quả đã kiểm tay để không coi type, API test và hàm dùng nội bộ là lỗi. Chưa đo được chi phí riêng đủ để lập một phát hiện bloat mới. Không đề xuất refactor sản phẩm hay cài công cụ ở Gói A.

| Chunk/tệp | Byte thô | Byte gzip theo size-report | ID |
|---|---:|---:|---|
| `assets/chart.js` | 513,302 | 172,450 | — |
| `assets/exceljs.min.js` | 929,569 | 255,572 | — |
| `assets/index.css` | 28,364 | 6,412 | — |
| `assets/index.js` | 891,942 | 262,010 | — |
| `assets/rolldown-runtime.js` | 1,106 | 627 | — |
| Tổng JS/CSS | 2,364,283 | 697,071 | — |
| 15 tệp khác | 849,196 | — | — |
| Exe chung ở SHA ghim (không build lại Rust) | 5,414,400 | — | — |

Không quy kích thước toàn chunk index cho riêng A. Số gzip dùng đúng hàm đo của size-report để đồng nhất baseline, nên có thể khác dòng kB của Vite.

## 5. Hiệu năng

Lệnh: `node --expose-gc C:\workspace\deep-review-1-6\codex\A\perf-probe.mjs`. Đo từ **2026-10-13 21:20:35 +07:00**, một lượt khởi động làm nóng trước mỗi phép đo, **5 lần**, GC trước lần đo, thời gian quanh lời gọi hàm (GC nằm ngoài khoảng). Đồng hồ DB ghim 13/10/2026. Không có test/build của Codex chạy đồng thời. Theo kế hoạch có thể có reviewer khác đang làm; không kiểm tiến trình hay nội dung của bên đó. Đây là số trong **Node/sql.js**, không đo UI/exe và không so trực tiếp với số Office Laptop hoặc thời gian màn trong perf-ref.

Dữ liệu đúng file chung `common/load/load-2026-10-12-seed6.p2cbackup`: **16.034.641 byte**, tables SHA-256 **1e69a97f664708d91932a1158c3a9ddd4e4d4aebb689f9c912ac3c4d0962e3fd**. Tổng 1.496 KH, 10.414 lịch hẹn, 54 người, 1.697 HĐ, 103 phân tích AI. Sau bỏ xóa mềm: **4 team, 51 người, 1.481 KH, 10.252 lịch hẹn, 1.674 HĐ**; **117 dòng Thùng rác**. Các phép gom theo góc nhìn trả **49 góc nhìn** (all + 4 team + 44 RE). Hồ sơ nhiều fact nhất có **19 fact**.

| Hàm / công việc | Lần | Trung vị ms | Min–max ms | ID |
|---|---:|---:|---:|---|
| `importBackup` | 5 | 1588.177 | 1566.128–1741.805 | — |
| `listAppointments` | 5 | 118.423 | 103.827–120.698 | — |
| `listCustomers` | 5 | 17.835 | 14.404–19.520 | — |
| `listStageTransitions` | 5 | 29.827 | 27.888–30.798 | — |
| `listPolicies` | 5 | 23.020 | 16.135–28.709 | — |
| `countRecords` | 5 | 11.156 | 10.719–11.283 | — |
| `listTrash` | 5 | 128.136 | 126.683–150.151 | — |
| `periodMetrics` | 5 | 6.243 | 4.980–7.160 | — |
| `periodMetricsByScope-all-scopes` | 5 | 5.804 | 4.736–7.539 | — |
| `periodMetricsByMark` | 5 | 4.369 | 3.754–7.253 | — |
| `appointmentCountsByScope-all-scopes` | 5 | 5.018 | 4.728–7.030 | — |
| `stageSnapshotByScope-all-scopes` | 5 | 4.260 | 3.047–6.726 | — |
| `stageSnapshotSeries-year` | 5 | 6.304 | 4.594–7.862 | — |
| `exportBackup` | 5 | 424.334 | 394.620–426.646 | — |
| `getKycProfile-largest` | 5 | 1.123 | 0.798–1.444 | — |

Một lần `listTrash` ghi nhận **444 lời gọi SQL API** (`exec` + `prepare`, sau làm nóng). Đây là số lời gọi API, không phải 444 statement biên dịch mới; cache có thể dùng lại statement. Có quét bảng tham chiếu và kiểm/đếm mỗi bản ghi. Số này giúp gói F định vị chi phí; chưa đủ để báo vượt ngưỡng thao tác màn.

Trên chính bộ tải đã kiểm: periodMetrics theo từng scope = phiên bản gom; appointmentCounts theo từng scope = phiên bản gom; stageSnapshot theo từng scope = phiên bản gom; periodMetricsByMark = từng mốc; stageSnapshotSeries = từng ngày mốc. **Mọi phép đối chiếu đều qua assert.**

Ngưỡng đã duyệt ở `phase-6.md`: thao tác màn < 200 ms, nhập chọn-file→xác-nhận ≤ 2.000 ms, xác-nhận→nhập ≤ 500 ms, xuất backup ≤ 1.000 ms. Probe Node đo `importBackup` dựng/kiểm DB tạm rồi mở DB mới; nó không tương đương `backup.import` (app nhập bytes đã kiểm trước). Không lấy 1.588 ms ở đây để so với ngưỡng 500 ms của bước xác nhận. Tham chiếu cùng máy của app trong `common/perf/perf-ref.json`: backup.read 793,8 ms, backup.import 48,7 ms, trash.open 79,5 ms, backup.export 423,8 ms. Không chạy lại exe để tránh va phép đo của bên khác. **Chưa có phát hiện P có bằng chứng vượt ngưỡng đã chốt trong gói này.**

## 6. Bảng đếm mức × trục

Mỗi phát hiện được đếm một lần ở trục chính.

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tổng | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |

**2 CONFIRMED, 0 PLAUSIBLE, 0 KNOWN được lập thành phát hiện.** Tỉ lệ PLAUSIBLE **0%**. Kết luận này giới hạn ở phạm vi đã kiểm; gói F mới có kết luận v1.0.

## 7. Các trục đã xét

| Trục | Bằng chứng đã đọc/chạy và kết quả |
|---|---|
| E | Tiền 0/âm/lẻ/trần/an toàn số; ngày 1900–2100, 29/02, kỳ tuần cắt, 3 tháng tùy chọn, biên hôm nay; seq cuối an toàn, Unicode/NUL. Đọc test từng file, chạy 1.229 test, 1.200 lượt fuzz và chuỗi khôi phục. Đã xét, không thấy lỗi E mới ngoài ảnh hưởng của CX-A1. |
| C | Golden G01–G22, K01–K15, A01–A13, S01–S13/C/M; nghĩa RF/MTD/ảnh chụp/thứ tự seq/RE hiện tại; đối chiếu thuật toán nhanh với hàm đơn trên bộ tải. Có CX-A2; phần còn lại đã xét, không thấy lệch mới. |
| D | Transaction/savepoint/COMMIT lỗi, migration có dữ liệu/trigger sau rebuild, các luật nhập 1–14, xóa/khôi phục 5 loại, TR-1…TR-5, E1–E16. Có CX-A1; các probe chuỗi và fuzz giữ bất biến, roundtrip bảng bằng nhau. |
| G | evaluateKycGate, schema input/output lưu AI, evidence/phiên bản/nhắc STALE, seed gọi Mock schema; test gốc bắt đột biến bỏ chặn core conflict. Đã xét ở tầng A, không thấy lỗi G mới; validator V1–V7/prompt/runtime là gói C. |
| S | SQL dữ liệu tham số hóa, tên bảng/cột backup lấy từ schema và quote, envelope strict, loại NUL/enum/kiểu/ngày/seq/FK, giới hạn text trước parse, không có trường API key chuyên dụng trong schema phân tích. Đã xét, không thấy lỗi S mới; key/CSP/file thuộc B/C. CX-A1 cần backup sửa tay được đếm ở D. |
| P | Đã đo 15 công việc trên bộ tải có hash đúng, đối chiếu hàm nhanh/chậm và số đếm sống; ghi SQL API của listTrash. Chưa thấy phát hiện P đủ bằng chứng vượt ngưỡng; giới hạn Node/không đo exe như §5. |
| B | tsc, codemap, lint:deps, 329 export bằng rg, helper lặp/dependency, build và cỡ chunk. Đã xét, không có phát hiện B mới với chi phí xác nhận. |
| T | Đọc tất cả 40 file test A; chạy 1.229 test. Bản chép 140 test xanh trước đột biến; ba mutant đều chết với 14 assertion failures. Lỗ kiểm vai trò golden gộp trong CX-A2; không có phát hiện T riêng. |
| A | Định dạng ngày/giờ/tiền/số tiếng Việt và câu hỏi KYC theo golden được đọc/test; chuỗi SYSTEM là dữ liệu nghiệp vụ theo quyết định đã biết. Đã xét ở hàm thuần A, không thấy lỗi định dạng/i18n mới. DOM/focus/aria không có trong hai package, xét ở D/E. |

## 8. Phụ lục bằng chứng và giới hạn

### Các lệnh đã chạy

- `pnpm exec vitest run packages/domain packages/db`: **40 file passed, 1.229 test passed**, bắt đầu 21:14:02, thời gian **60,88 s**, exit 0.
- Hai lệnh tsc noUnused, `pnpm codemap:check`, `pnpm lint:deps`: exit 0, kết quả §4.
- `pnpm build:web`: thành công, build Vite **816 ms** (không phải số thời gian màn); số byte lấy bằng size-report.
- `node …/chain-probe.mjs`: kết quả counts 1 team/3 người/1 KH/1 lịch/1 HĐ; 1 RF, nộp 1.000.000, doanh số 2.000.000, tỉ lệ chốt 1/1; roundtrip-identical-tables true. KYC xung đột được giải quyết trước xóa/khôi phục. Hai tái hiện Low ở cùng log.
- `node …/fuzz-probe.mjs`: **1.200 lượt**, 10 nhóm thao tác đều được chọn (103–144 lượt/nhóm), **935 lượt không ném lỗi** (gồm no-op khi không có bản ghi để thao tác), **265 lượt từ chối** có mã nghiệp vụ; kiểm giá trị và bất biến **sau mọi lượt** đều qua. Roundtrip bảng và đối chiếu metricsByScope qua. Đã sửa PRNG của probe từ LCG dùng modulo sang xorshift khi thấy bản thử đầu không phủ đủ nhóm; báo cáo dùng bản cuối có bảng tần suất, không dùng bản thử đầu làm bằng chứng.
- `node …/snapshot-probe.mjs`: **9/9 snapshot** khớp cấu trúc; mốc cuối 13 bảng, 109 cột, 18 FK, 7 index khai báo, 27 CHECK có tên.
- Các phép đo và tham chiếu export: `perf-probe.log`, `perf.json`, `export-refs.json`, `bloat-probe.log`, `size.json`, `file-lines.json` cùng thư mục.

Không chạy lại toàn bộ verify/e2e/Rust; dùng cổng đã có ở common/baseline tại đúng SHA (2.755 unit, 210 e2e, 91 Rust đều xanh) làm nền. Không chạy cổng 4173 hay phép đo exe. Không kiểm riêng trường hợp ổ đầy/tắt app/Rust trong A; gói B làm phần đó.

### Đột biến chỉ trên bản chép

Chép `packages/domain/src` vào `codex/A/mutation-domain/src`. Trước sửa, ba file test gốc có **140 passed**, exit 0 (21:23:23). Sau ba thay đổi độc lập dưới đây, cùng ba file có **14 failed / 126 passed**, exit 1 như mong đợi (21:23:45); các lỗi là assertion, không phải lỗi import/build.

| Mutant | Thay đổi trên bản chép | Test bắt | Kết quả |
|---|---|---|---|
| M1 | stats.ts: bỏ `appointment.status === 'MET' &&` ở rfMatcher | stats-rf: “does not count an appointment that was not met, even with a stage change” | Chết, 1 test đỏ |
| M2 | appointment-counts.ts: đổi `compareDates(appointment.date, today) < 0` thành `<= 0` | Biên hôm nay, A02/A03/A05/A06/A08/A11/A13 và golden byScope | Chết, 9 test đỏ |
| M3 | kyc-gate.ts: bỏ return CONFLICT_RESOLUTION khi hasCoreConflict | K11/K14 và hai test aiAllowed | Chết, 4 test đỏ |

**0 mutant sống trong ba mutant đã thử.** Chúng không đại diện cho một chiến dịch mutation toàn bộ codebase. Log: `mutation-baseline.log`, `mutation-killed.log`; bản chép còn giữ mutant để tái hiện, repo không bị patch.

### Nguồn probe/test tạm

Các nguồn dưới đây được lưu nguyên ở `C:\workspace\deep-review-1-6\codex\A\`, và chép vào báo cáo để bản raw lưu repo sau này vẫn có nguồn tái hiện. Những import `@p2c/*` trong code sản phẩm được Node giải từ workspace; bộ nạp hỗ trợ TS extensionless và SQL ?raw, không tải/cài thêm công cụ.

### Nguồn runtime.mjs

```javascript
import {readFileSync} from 'node:fs';
import {registerHooks} from 'node:module';
import {pathToFileURL} from 'node:url';
export const root = 'C:/workspace/Project-2C-review-2/';
registerHooks({
 resolve(specifier,context,nextResolve){
  try{return nextResolve(specifier,context)}catch(error){
   if(!specifier.startsWith('.')) throw error;
   for(const suffix of ['.ts','/index.ts']){try{return nextResolve(specifier+suffix,context)}catch{}}
   throw error;
  }
 },
 load(url,context,nextLoad){
  if(!url.endsWith('?raw')) return nextLoad(url,context);
  return {format:'module',source:`export default ${JSON.stringify(readFileSync(new URL(url.slice(0,-4)),'utf8'))};`,shortCircuit:true};
 }
});
export const fromRepo = (path) => import(pathToFileURL(root+path).href);
export const dbapi = await fromRepo('packages/db/src/index.ts');
export const domain = await fromRepo('packages/domain/src/index.ts');
export const validation = await fromRepo('packages/db/src/backup-validation.ts');
export const d = (day,month=10,year=2026) => domain.calendarDate(year,month,day);
export async function fresh(){
 let tick=0;
 const now=()=>new Date(Date.UTC(2026,9,13,5)+tick++);
 const db=await dbapi.openDatabase({now});
 const team=dbapi.createTeam(db,{name:'Probe'});
 const re=dbapi.createPerson(db,{name:'RE One',role:'RE',teamId:team.id});
 const re2=dbapi.createPerson(db,{name:'RE Two',role:'RE',teamId:team.id});
 const tl=dbapi.createPerson(db,{name:'TL One',role:'TL',teamId:team.id});
 return {db,team,re,re2,tl,now};
}
export const errorCode = (fn) => {try {fn();return 'OK'}catch(e){return e.code??String(e)}};
export function invariants(db){validation.validateBackupValues(db);validation.validateBackupInvariants(db);}
```

### Nguồn chain-probe.mjs

```javascript
import assert from 'node:assert/strict';
import {dbapi as a,domain as m,validation,fresh,d,errorCode,invariants,fromRepo} from './runtime.mjs';
const s=await fresh(); const {db,re,re2,tl,now}=s;
const c=a.createCustomer(db,{name:'KH probe',reId:re.id,stage:'N3',date:d(1)});
const schedule=(day,owner=re.id)=>a.scheduleAppointment(db,{customerId:c.id,reId:owner,date:d(day),triggerType:'OTHER',coordinatorIds:[tl.id]});
const first=schedule(2);
a.recordMeetingOutcome(db,first.id,{status:'MET',stageAfter:'N2',nextStep:'Tiếp tục',outcomeReviewerId:tl.id});
const policy=a.submitPolicy(db,{customerId:c.id,reId:re2.id,submittedDate:d(2),submittedFyp:1000000});
a.issuePolicy(db,policy.id,{issuedDate:d(3),issuedFyp:2000000});
const n=a.recordKycNote(db,c.id,{text:'KYC',date:d(3),facts:[{field:'childrenCount',value:0},{field:'occupation',value:'Bác sĩ'}]});
a.markKycConflict(db,c.id,{field:'childrenCount',value:2,noteId:n.note.id,date:d(4)});
const kept=a.getKycProfile(db,c.id).facts.find(f=>f.value===0&&f.field==='childrenCount');
a.resolveKycConflict(db,c.id,{factId:kept.id,date:d(5)});
a.softDeleteAppointment(db,first.id); a.softDeletePolicy(db,policy.id); a.softDeleteCustomer(db,c.id);
assert.equal(errorCode(()=>a.updatePerson(db,tl.id,{role:'RE'})),'OK');
let rows=a.listTrash(db);
console.log('trash-before-customer-restore',rows.map(r=>({kind:r.kind,blocked:r.blocked?.code})));
a.restoreCustomer(db,c.id);
assert.equal(errorCode(()=>a.restoreAppointment(db,first.id)),'INVALID_COORDINATOR');
a.updatePerson(db,tl.id,{role:'TL'}); a.restoreAppointment(db,first.id); a.restorePolicy(db,policy.id);
invariants(db);
console.log('chain-counts',a.countRecords(db),a.countCustomerRecords(db,c.id));
console.log('chain-metrics',m.periodMetrics({people:a.listPeople(db),policies:a.listPolicies(db),appointments:a.listAppointments(db),transitions:a.listStageTransitions(db)},m.periodOf('month',d(13)),{kind:'all'}));
const backup=a.exportBackup(db);const copied=(await a.importBackup(backup,{now})).db;
assert.deepEqual(JSON.parse(a.exportBackup(copied)).tables,JSON.parse(backup).tables);
console.log('roundtrip-identical-tables',true);
copied.sqlite.close();db.sqlite.close();
const golden=await fromRepo('packages/domain/src/golden/appointments.fixture.ts');
const g=await fresh();const gc=a.createCustomer(g.db,{name:'Golden L-09',reId:g.re.id,stage:'N3',date:d(1)});
const l09=golden.APPOINTMENT_ROWS.find(r=>r.appointment.id==='L-09').appointment;
console.log('golden-L09-coordinators',l09.coordinatorIds,'schedule-error',errorCode(()=>a.scheduleAppointment(g.db,{customerId:gc.id,reId:g.re.id,date:d(4),triggerType:'OTHER',coordinatorIds:[g.re2.id]})));
g.db.sqlite.close();
// Imported files: duplicate conflict values and malformed validator metadata.
const k=await fresh();const kc=a.createCustomer(k.db,{name:'KYC imported',reId:k.re.id,stage:'N3',date:d(1)});
const kn=a.recordKycNote(k.db,kc.id,{text:'Thông tin gia đình',date:d(2),facts:[{field:'childrenCount',value:2}]});
a.markKycConflict(k.db,kc.id,{field:'childrenCount',value:3,noteId:kn.note.id,date:d(3)});
const file=JSON.parse(a.exportBackup(k.db));
for(const fact of file.tables.kyc_facts)fact.value_json='2';
const ki=(await a.importBackup(JSON.stringify(file),{now:k.now})).db;
console.log('duplicate-conflict-imported',a.getKycProfile(ki,kc.id).facts.map(f=>({value:f.value,status:f.status})),m.evaluateKycGate(a.getKycProfile(ki,kc.id).facts).state);
ki.sqlite.close();k.db.sqlite.close();
console.log('PROBE-DONE');
```

### Nguồn fuzz-probe.mjs

```javascript
import assert from 'node:assert/strict';
import {dbapi as a, domain as m, fresh, d, invariants} from './runtime.mjs';
const s=await fresh();const {db,re,re2,tl,now}=s;
let state=0xabc123;const rand=n=>{state^=state<<13;state^=state>>>17;state^=state<<5;return Math.floor((state>>>0)/4294967296*n)};
const cs=Array.from({length:12},(_,i)=>a.createCustomer(db,{name:'KH '+i,reId:i%2?re.id:re2.id,stage:'N3',date:d(1)}));
const ids=[];let successes=0,rejected=0;const errorCounts={};const operations={};
for(let step=0;step<1200;step++){
 const c=cs[rand(cs.length)];const live=a.getCustomer(db,c.id);const aps=a.listAppointments(db,c.id);const ap=aps.length?aps[rand(aps.length)]:undefined;
 try{
 const op=rand(10); operations[op]=(operations[op]??0)+1; switch(op){
 case 0:ids.push(a.scheduleAppointment(db,{customerId:c.id,reId:re.id,date:d(1+rand(18)),triggerType:'OTHER',coordinatorIds:[tl.id]}).id);break;
 case 1:if(ap)a.recordMeetingOutcome(db,ap.id,{status:['MET','CANCELLED','NO_SHOW'][rand(3)],stageAfter:rand(2)?'N2':undefined,nextStep:'Tiếp tục'});break;
 case 2:if(ap)a.editMeetingOutcome(db,ap.id,{status:'MET',stageAfter:['N4','N3','N2','N1','ON_HOLD','LOST'][rand(6)],nextStep:'Sau sửa'},{date:d(1+rand(18))});break;
 case 3:if(ap)a.softDeleteAppointment(db,ap.id);break;
 case 4:if(ids.length)a.restoreAppointment(db,ids[rand(ids.length)]);break;
 case 5:if(ap)a.rescheduleAppointment(db,ap.id,{date:d(1+rand(18))});break;
 case 6:a.changeStageManually(db,c.id,{to:['N4','N3','N2','N1','ON_HOLD','LOST'][rand(6)],date:d(1+rand(13))});break;
 case 7:if(live)a.softDeleteCustomer(db,c.id);else a.restoreCustomer(db,c.id);break;
 case 8:if(live)a.recordKycNote(db,c.id,{text:'KYC step '+step,date:d(1+rand(13)),facts:[{field:'childrenCount',value:rand(4)},{field:'occupation',value:'Bác sĩ'}]});break;
 case 9:if(live){const p=a.submitPolicy(db,{customerId:c.id,reId:re.id,submittedDate:d(1+rand(13)),submittedFyp:1+rand(100000000)});a.softDeletePolicy(db,p.id);a.restorePolicy(db,p.id)}break;
 }
 successes++;
 }catch(e){if(!e.code)throw e;rejected++;errorCounts[e.code]=(errorCounts[e.code]??0)+1;}
 invariants(db);
}
const backed=a.exportBackup(db);const back=(await a.importBackup(backed,{now})).db;
assert.deepEqual(JSON.parse(a.exportBackup(back)).tables,JSON.parse(backed).tables);
const t={people:a.listPeople(db),policies:a.listPolicies(db),appointments:a.listAppointments(db),transitions:a.listStageTransitions(db)};
const period=m.periodOf('month',d(13));const scopes=[{kind:'all'},{kind:'team',teamId:s.team.id},{kind:'re',reId:re.id},{kind:'re',reId:re2.id}];
for(const scope of scopes) assert.deepEqual(m.periodMetricsByScope(t,period)(scope),m.periodMetrics(t,period,scope));
console.log(JSON.stringify({seed:'0xabc123',steps:1200,successes,rejected,errorCounts,operations,counts:a.countRecords(db),roundtripTables:true,metricsByScope:true},null,2));
db.sqlite.close();back.sqlite.close();
```

### Nguồn perf-probe.mjs

```javascript
import {readFileSync} from 'node:fs';
import {hostname,cpus} from 'node:os';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {dbapi as a,domain as m} from './runtime.mjs';
const text=readFileSync('C:/workspace/deep-review-1-6/common/load/load-2026-10-12-seed6.p2cbackup','utf8');
const file=JSON.parse(text);
console.log(JSON.stringify({machine:hostname(),cpu:cpus()[0]?.model,node:process.version,date:new Date().toISOString(),bytes:Buffer.byteLength(text),tablesSha256:createHash('sha256').update(JSON.stringify(file.tables)).digest('hex'),rows:Object.fromEntries(Object.entries(file.tables).map(([k,v])=>[k,v.length])),concurrency:'No Codex test/build is running. Other reviewer may be active per plan; not measured on exe.'},null,2));
const now=()=>new Date('2026-10-13T05:00:00Z');
const {db}=await a.importBackup(text,{now});
const ops={};
function stats(xs){const ys=[...xs].sort((a,b)=>a-b);return {runs:ys.length,median:+ys[Math.floor(ys.length/2)].toFixed(3),min:+ys[0].toFixed(3),max:+ys.at(-1).toFixed(3)}}
async function bench(name,fn){await fn();const xs=[];for(let i=0;i<5;i++){globalThis.gc?.();const at=performance.now();await fn();xs.push(performance.now()-at)}ops[name]=stats(xs);}
await bench('importBackup',async()=>{const {db:c}=await a.importBackup(text,{now});c.sqlite.close()});
await bench('listAppointments',()=>a.listAppointments(db));
await bench('listCustomers',()=>a.listCustomers(db));
await bench('listStageTransitions',()=>a.listStageTransitions(db));
await bench('listPolicies',()=>a.listPolicies(db));
await bench('countRecords',()=>a.countRecords(db));
let sqlCount=0;const exec=db.sqlite.exec.bind(db.sqlite);const prepare=db.sqlite.prepare.bind(db.sqlite);
db.sqlite.exec=(...args)=>{sqlCount++;return exec(...args)};db.sqlite.prepare=(...args)=>{sqlCount++;return prepare(...args)};
a.listTrash(db);const trashSqlCount=sqlCount;
await bench('listTrash',()=>a.listTrash(db));
const data={people:a.listPeople(db),policies:a.listPolicies(db),appointments:a.listAppointments(db),transitions:a.listStageTransitions(db)};
const customers=a.listCustomers(db),today=m.calendarDate(2026,10,13),period=m.periodOf('year',today),all={kind:'all'};
const scopes=[all,...a.listTeams(db).map(t=>({kind:'team',teamId:t.id})),...data.people.filter(p=>p.role==='RE').map(p=>({kind:'re',reId:p.id}))];
const marks=m.reportMarks(period);
await bench('periodMetrics',()=>m.periodMetrics(data,period,all));
await bench('periodMetricsByScope-all-scopes',()=>{const fn=m.periodMetricsByScope(data,period);return scopes.map(fn)});
await bench('periodMetricsByMark',()=>m.periodMetricsByMark(data,marks,all));
await bench('appointmentCountsByScope-all-scopes',()=>{const fn=m.appointmentCountsByScope(data.appointments,period,data.people,today);return scopes.map(fn)});
await bench('stageSnapshotByScope-all-scopes',()=>{const fn=m.stageSnapshotByScope(customers,data.transitions,data.people,today);return scopes.map(fn)});
await bench('stageSnapshotSeries-year',()=>m.stageSnapshotSeries(customers,data.transitions,data.people)(marks.map(p=>p.end),all));
await bench('exportBackup',()=>a.exportBackup(db));
const profiles=a.listCustomers(db).map(c=>({id:c.id,n:db.sqlite.exec('SELECT COUNT(*) FROM kyc_facts WHERE customer_id=?',[c.id])[0].values[0][0]})).sort((a,b)=>b.n-a.n);
await bench('getKycProfile-largest',()=>a.getKycProfile(db,profiles[0].id));
for(const scope of scopes){assert.deepEqual(m.periodMetricsByScope(data,period)(scope),m.periodMetrics(data,period,scope));assert.deepEqual(m.appointmentCountsByScope(data.appointments,period,data.people,today)(scope),m.appointmentCounts(data.appointments,period,scope,data.people,today));assert.deepEqual(m.stageSnapshotByScope(customers,data.transitions,data.people,today)(scope),m.stageSnapshot(customers,data.transitions,today,scope,data.people));}
assert.deepEqual(m.periodMetricsByMark(data,marks,all),marks.map(mark=>m.periodMetrics(data,mark,all)));
assert.deepEqual(m.stageSnapshotSeries(customers,data.transitions,data.people)(marks.map(p=>p.end),all),marks.map(p=>m.stageSnapshot(customers,data.transitions,p.end,all,data.people)));
console.log(JSON.stringify({counts:a.countRecords(db),trashRows:a.listTrash(db).length,trashSqlCount,scopes:scopes.length,largestKycFacts:profiles[0].n,ops,equivalenceOnLoad:true},null,2));
db.sqlite.close();
```

### Nguồn bloat-probe.mjs

```javascript
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
const root='C:/workspace/Project-2C-review-2';const req=createRequire(root+'/package.json');const ts=req('typescript');
const files=execFileSync('git',['ls-files','packages/domain','packages/db'],{cwd:root,encoding:'utf8'}).trim().split('\n');
const sources=files.filter(p=>p.endsWith('.ts')&&!p.includes('.test.')&&!p.includes('/golden/')&&!p.endsWith('.d.ts')&&!p.endsWith('/test-support.ts')&&!p.endsWith('/index.ts'));
const rows=[];
for(const file of sources){const sf=ts.createSourceFile(file,readFileSync(root+'/'+file,'utf8'),ts.ScriptTarget.Latest,true);for(const st of sf.statements){if(!st.modifiers?.some(x=>x.kind===ts.SyntaxKind.ExportKeyword))continue;let names=[];if(ts.isVariableStatement(st))names=st.declarationList.declarations.map(d=>d.name.getText(sf));else if(st.name)names=[st.name.getText(sf)];for(const name of names){let matches='';try{matches=execFileSync('rg',['-n','-w',name,'apps','packages','tools','e2e','--glob','*.ts','--glob','*.tsx','--glob','*.mjs','--glob','!*.test.*','--glob','!*.spec.*','--glob','!*.guide.*','--glob','!*.perf.*','--glob','!**/golden/**','--glob','!test-support.ts','--glob','!CLAUDE.md','--glob','!AGENTS.md'],{cwd:root,encoding:'utf8'}).trim()}catch(e){if(e.status!==1)throw e;}const refs=matches.split('\n').filter(Boolean).filter(l=>{const p=l.split(':')[0].replaceAll('\\','/');return p!==file&&!p.endsWith('/index.ts')});rows.push({file,name,line:sf.getLineAndCharacterOfPosition(st.getStart(sf)).line+1,kind:ts.isInterfaceDeclaration(st)||ts.isTypeAliasDeclaration(st)?'type':'value',references:refs});}}}
writeFileSync('C:/workspace/deep-review-1-6/codex/A/export-refs.json',JSON.stringify(rows,null,2));
console.log(JSON.stringify({files:sources.length,exports:rows.length,noOtherProductReference:rows.filter(r=>r.references.length===0).map(({file,name,line,kind})=>({file,name,line,kind}))},null,2));
const manifest=files.filter(f=>/\.(ts|sql|json|md)$/.test(f)).map(f=>({file:f,lines:readFileSync(root+'/'+f,'utf8').trimEnd().split('\n').length}));
writeFileSync('C:/workspace/deep-review-1-6/codex/A/file-lines.json',JSON.stringify(manifest,null,2));
```

### Nguồn snapshot-probe.mjs

```javascript
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {fromRepo,dbapi} from './runtime.mjs';
const {MIGRATIONS}=await fromRepo('packages/db/src/migrations.ts');
const root='C:/workspace/Project-2C-review-2/packages/db/migrations/meta/';
let previous='00000000-0000-0000-0000-000000000000';const counts=[];
for(let i=0;i<MIGRATIONS.length;i++){
 const name=String(i).padStart(4,'0')+'_snapshot.json';const snap=JSON.parse(readFileSync(root+name,'utf8'));
 assert.equal(snap.prevId,previous);previous=snap.id;
 const db=await dbapi.openDatabase({migrations:MIGRATIONS.slice(0,i+1)});
 const names=db.sqlite.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")[0].values.flat();
 assert.deepEqual(Object.keys(snap.tables).sort(),names);
 let columns=0,indices=0,foreignKeys=0,checks=0;
 for(const [table,t]of Object.entries(snap.tables)){
  const actual=db.sqlite.exec('SELECT name,type,"notnull",pk FROM pragma_table_info(?) ORDER BY cid',[table])[0].values;
  assert.deepEqual(actual.map(r=>r[0]),Object.keys(t.columns));
  for(const row of actual){const col=t.columns[row[0]];assert.equal(row[1].toLowerCase(),col.type);assert.equal(Boolean(row[2]),col.notNull);columns++;}
  const fks=db.sqlite.exec('SELECT "from","table","to",on_update,on_delete FROM pragma_foreign_key_list(?)',[table])[0]?.values??[];
  const expected=Object.values(t.foreignKeys).flatMap(fk=>fk.columnsFrom.map((col,j)=>[col,fk.tableTo,fk.columnsTo[j],fk.onUpdate,fk.onDelete]));
  const sorted=rows=>rows.map(r=>JSON.stringify(r.map(x=>typeof x==='string'?x.toLowerCase():x))).sort();
  assert.deepEqual(sorted(fks),sorted(expected));foreignKeys+=fks.length;
  const index=db.sqlite.exec('SELECT name,"unique" FROM pragma_index_list(?)',[table])[0]?.values??[];
  for(const [name,ix]of Object.entries(t.indexes)){assert(index.some(([n,u])=>n===name&&Boolean(u)===ix.isUnique));indices++;}
  const ddl=db.sqlite.exec('SELECT sql FROM sqlite_master WHERE type="table" AND name=?',[table])[0].values[0][0];
  for(const key of Object.keys(t.checkConstraints)){assert(ddl.includes(key));checks++;}
 }
 counts.push({snapshot:name,tables:names.length,columns,foreignKeys,indices,checks,match:true});db.sqlite.close();
}
console.log(JSON.stringify(counts,null,2));
```

### Nguồn mutation.config.mjs

```javascript
export default {
 resolve: {alias: {vitest:'C:/workspace/Project-2C-review-2/node_modules/vitest/dist/index.js'}},
 test: {include:['C:/workspace/deep-review-1-6/codex/A/mutation-domain/src/{stats-rf,appointment-counts,kyc-gate}.test.ts'],pool:'forks',maxWorkers:1}
};
```

### Trạng thái cuối phiên

`git rev-parse HEAD`: `885534549808f42aec7f9af5743bbf86642ee4bd`.

`git status --short`, nguyên văn:

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

Bằng trạng thái đầu phiên. Giờ hoàn tất báo cáo: **2026-10-13 21:35:56 +07:00**. Dừng sau Gói A; gói kế tiếp **B**, mở phiên mới.
