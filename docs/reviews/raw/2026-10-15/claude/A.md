XONG — claude gói A, 2026-10-14 10:08

# Deep review Phase 1–6, lượt 1 — Claude, gói A (Lõi dữ liệu)

## 1. Thông tin phiên

- Bên: Claude (Opus 5.5), phiên sạch, chỉ đọc.
- Gói: A — Lõi dữ liệu (`packages/domain/**`, `packages/db/**`).
- Repo: `C:\workspace\Project-2C-review`, `git rev-parse HEAD` đầu phiên = `885534549808f42aec7f9af5743bbf86642ee4bd`.
- `git status --short` đầu phiên: (rỗng).
- Máy: `D13_ThinkPad` (Office Laptop). Song song: Codex chạy đợt 1 ở `C:\workspace\Project-2C-review-2` (theo kế hoạch).
- Giờ bắt đầu: 2026-10-14 09:43.
- Probe / log: `C:\workspace\deep-review-1-6\claude\A\` (loader `hooks.mjs` chép cách nạp TS của `tools/load-data.mjs`; probe import thẳng nguồn ở SHA ghim, không sửa repo).

## 2. Phạm vi đã đọc

Đọc hết (toàn file):

- `packages/domain/src`: `period.ts` (434), `money.ts` (188), `number.ts` (43), `name-order.ts`, `pipeline-stage.ts`, `model.ts` (110), `stats.ts` (272), `compare.ts` (80), `appointment-counts.ts` (116), `stage-snapshot.ts` (169), `customer-lifecycle.ts` (63), `kyc-catalog.ts` (155), `kyc-fact.ts` (71), `kyc.ts` (164), `kyc-gate.ts` (85), `evidence-level.ts` (52), `index.ts` (116).
- `packages/db/src`: `schema.ts` (384), `common.ts` (165), `errors.ts` (108), `ids.ts` (34), `settings.ts` (29), `migrations.ts` (39), `database.ts` (229), `index.ts` (96), `backup.ts` (203), `backup-validation.ts` (438), `customers.ts` (370), `appointments.ts` (545), `trash.ts` (254), `counts.ts` (90), `policies.ts` (154), `team.ts` (320), `kyc.ts` (551), `ai-analyses.ts` (337), `seed.ts` (673), `test-support.ts` (39).
- Golden (đối chiếu từng dòng với tài liệu): `packages/domain/src/golden/metrics.fixture.ts` (245, toàn file), `kyc.fixture.ts` (dòng 100–271: K01–K15), `appointments.fixture.ts` (dòng 60–133: L-01…L-14, A01–A13), `stage-snapshot.fixture.ts` (dòng 100–222: S01–S13, M01–M04).
- Một phần: `packages/db/src/seed-data.ts` (dòng 1–80: trọng số), migration `0003`, `0004`, `0006`, `0007`, `0008` (toàn file), test: `test-support.ts`, `backup-engine.test.ts` (toàn file), `golden-metrics.test.ts` (1–80), `trash.test.ts` (1–60), tên ca của `database.test.ts`; `grep` các khẳng định yếu (`toThrow()`, `toBeDefined()`…) trên mọi test của `domain` / `db`. Nơi gọi ở app (chỉ để biết đường vào): `SettingsTrash.tsx:146`, `CustomerProfile.tsx:42-54`, `CustomerDialogs.tsx:349`, `KycDialogs.tsx` (cờ material), `drizzle-orm/sql-js/session.js` (cách drizzle prepare / free câu lệnh, để xét bộ đệm câu lệnh của `database.ts`).
- Tài liệu: `CLAUDE.md` gốc + `packages/{domain,db}/CLAUDE.md`, `CONTEXT.md`, ADR-0007, ADR-0008, `docs/design/phase-3-du-lieu.md` (toàn file: D1–D10, §3 schema, §4 bảng lệnh, §6 luật nhập 1–10), `docs/design/phase-6-hoan-thien.md` §1–§5 (S-2, Thùng rác TR-1…TR-10, E1–E17), `docs/golden/{chi-so,kyc,lich-hen,kh-theo-nhom}.md` (toàn file), `docs/metrics/phase-6.md` (bảng ngưỡng), `common\plan.md` (§1–§11), `common\known.md`, `common\baseline.md`.
- `docs/design/phase-4-chi-so.md` (toàn file): tự kiểm bảng §3 (nút ‹ / › ở biên miền năm), §3.1 (trần Tùy chọn 7 dòng) và §4.2 C01–C11 với `customRangeMaxEnd` / `shift` / `comparisonWindows`: khớp.
- Chưa đọc kỹ: `seed-data.ts` phần danh sách tên / ghi chú, các file test còn lại (đánh giá qua đột biến §7 thay vì đọc từng ca).

## 3. Phát hiện

### CL-A1

```
ID: CL-A1
Mức: Low
Trục: C (và E)
Vị trí: packages/db/src/appointments.ts:263-271 (restoreAppointment → applyOutcome :358-361), packages/db/src/trash.ts:139-161 (effect) (8855345)
Tình trạng: CONFIRMED
Mô tả: Khôi phục lịch Đã gặp luôn ghi "nhóm sau" của cuộc gặp **sau** mọi chuyển nhóm cùng ngày cuộc hẹn đã có (D10 chỉ chặn ngày lùi; TR-3 chỉ từ chối khi nhóm KH đổi **vào ngày sau** ngày cuộc hẹn). Nên khi có một lần chuyển tay cùng ngày cuộc hẹn, xóa + khôi phục không còn là phép trả lại như cũ:
  (a) lịch Đã gặp **không đổi nhóm lúc ghi** (nhóm sau = nhóm lúc đó, không có chuyển nhóm) → khôi phục tạo chuyển nhóm mới gắn cuộc hẹn, có thể là một **RF chưa từng có**, và xóa hiệu lực của lần chuyển tay;
  (b) lịch Đã gặp có RF đã bị rút khi xóa, rồi chuyển tay cùng ngày lên nhóm cao hơn → khôi phục **hạ** KH về nhóm sau của cuộc gặp và cuộc gặp không còn tính RF (cùng tình huống nhưng chuyển tay ngày sau thì bị chặn như E6).
  Spec TR-3 / E5–E8 không nói ca cùng ngày; ca (a) cũng không được nói tới (E5–E8 đều là lịch đã có chuyển nhóm).
Tái hiện / bằng chứng: `node p1-restore.mjs`, `node p5-restore-sameday.mjs` (phụ lục; log `A\p1-restore.log`, `A\p5-restore-sameday.log`), đồng hồ 11/10/2026:
  P1b (a): KH tạo N2 01/10; lịch 10/10 Đã gặp, nhóm sau N2 (không đổi) → RF tháng 10 = 0; chuyển tay N2→N3 ngày 10/10; xóa lịch; Thùng rác: effect {"kind":"stageChange","from":"N3","to":"N2",...,"rf":true}; khôi phục →
  "sau khi khôi phục: stage=N2 transitions=[∅→N2@01/10/2026, N2→N3@10/10/2026, N3→N2@10/10/2026 (lịch)] RF(10/2026)=1"
  P1a (a): (N3, nhóm sau N3, chuyển tay N3→N2): khôi phục đưa KH về N3, hủy hiệu lực chuyển tay N3→N2.
  P5a (b): lịch 02/10 N3→N2 (RF=1); xóa (rút, RF=0); chuyển tay N3→N1 ngày 02/10; Thùng rác {"from":"N1","to":"N2","rf":false}, không chặn; khôi phục → "stage=N2 [∅→N3@01/10, N3→N1@02/10, N1→N2@02/10(lịch)] RF=0".
  P5b (đối chứng): như P5a nhưng chuyển tay ngày 05/10 → "khôi phục bị từ chối: TRANSITION_BEFORE_LATEST {"date":"05/10/2026"}" (đúng E6).
Ảnh hưởng: RE xóa nhầm rồi khôi phục một cuộc gặp sau khi đã chuyển tay KH **cùng ngày**: RF tháng có thể tăng 1 (a) hoặc mất 1 so với lúc ghi (b), nhóm KH bị đảo / hạ — lan sang Tổng quan / Báo cáo / Excel. Hộp xác nhận 11 (TR-8) có nêu "N1 → N2" / "tính 1 RF" nên không lặng lẽ; cần chuỗi thao tác hiếm → Low.
Đề xuất: Owner chốt ca cùng ngày (TR-3 chưa nói). Hướng gọn nhất: khi khôi phục, coi một chuyển nhóm **cùng ngày, ghi sau lúc xóa lịch** như chuyển nhóm ngày sau (từ chối, lý do nêu ngày, như E6); và lịch Đã gặp lúc xóa không rút chuyển nhóm nào thì khôi phục không thêm chuyển nhóm (như E7). Cỡ ≈ 20–30 dòng SP (`checkRestoreAppointment` cần biết lịch có chuyển nhóm bị rút hay không và mốc xóa: `stage_transitions` đã xóa có `appointment_id` = lịch này, `deleted_at` của lịch) + test ở `trash.test.ts` (màn và lệnh cùng lý do).
```

### CL-A2

```
ID: CL-A2
Mức: Low
Trục: P
Vị trí: packages/db/src/trash.ts:121-133, :252-254 (customerEffect → countCustomerRecords), packages/db/src/counts.ts:56-90; packages/db/src/schema.ts:113-155, :194-218 (không có chỉ mục appointments.customer_id / policies.customer_id) (8855345)
Tình trạng: CONFIRMED (liên quan KNOWN #539 "trash.ts:225 refs đọc cả bảng" — bằng chứng mới: chi phí chính không nằm ở `refs`)
Mô tả: `listTrash` gọi `countCustomerRecords` cho từng KH đã xóa; mỗi lần là 5 truy vấn con + 1 JOIN trên `appointments` / `policies` theo `customer_id`, mà hai bảng này không có chỉ mục `customer_id` → quét toàn bảng (EXPLAIN: "SCAN appointments"). Thời gian `listTrash` tăng tuyến tính ≈ 2,3 ms / KH đã xóa (Node), và Thùng rác không bao giờ tự dọn (TR-6), `SettingsTrash` gọi lại `listTrash` mỗi revision (`useQuery(listTrash)`, `SettingsTrash.tsx:146`).
Tái hiện / bằng chứng (Node 24, Office Laptop, Codex chạy song song ở worktree kia; dữ liệu tải `common\load\…seed6`):
  p3b-trash.mjs: "listTrash total ms: 47.94" — "refs: read customers (selectRows) ms: 1.36" — "countCustomerRecords × 15 ms: 33.01" — "checkRestoreAppointment × 80 ms: 7.53"; "plan count appointments by customer: [\"SCAN appointments\"]".
  p3c-scale.mjs (xóa thêm KH bằng `softDeleteCustomer`): 15 KH xóa → 60,8 ms; 75 → 197,1 ms; 150 → 367,7 ms; 300 → 702,8 ms.
  p3d-index.mjs (150 KH xóa): không chỉ mục 389,1 ms → có chỉ mục `appointments(customer_id)`, `policies(customer_id)` (tạo trên bản trong bộ nhớ của probe) 36,1 ms; `listAppointments(id)` của hồ sơ KH 1,8 → 0,3 ms; `countCustomerRecords(id)` (hộp 5f) 2,4 → 0,2 ms.
  Trên exe ở dữ liệu tải hiện tại `trash.open` = 91 ms (`common\perf\perf-ref.json`) — dưới ngưỡng 200 ms.
Ảnh hưởng: Ở dữ liệu tải đã chốt (15 KH trong Thùng rác) chưa vượt ngưỡng. Khi Thùng rác có ≈ 75 KH (5 % của 1 500, dồn dần vì không dọn) thì riêng `listTrash` trong Node đã ≈ 200 ms → màn Thùng rác / mỗi lần khôi phục vượt ngưỡng "thao tác màn < 200 ms". Low vì chưa vượt trên dữ liệu đã chốt.
Đề xuất: (a) migration thêm `index('appointments_customer').on(customerId)` và `policies_customer` (schema.ts, `pnpm db:generate`, không đổi dữ liệu) — cũng lợi cho hồ sơ KH và hộp 5f; hoặc (b) `listTrash` đếm mọi KH đã xóa bằng một truy vấn `GROUP BY customer_id`. Cỡ (a) ≈ 5 dòng SP + migration sinh tự động; test giữ hành vi: `trash.test.ts`, `counts.test.ts`, `database.test.ts` (migration trên DB có dữ liệu).
```

### CL-A3

```
ID: CL-A3
Mức: Nit
Trục: B
Vị trí: packages/db/src/appointments.ts:136-140 + :466-473 (getAppointment + isCustomerLive), packages/db/src/policies.ts:31-39 (getPolicy), packages/db/src/team.ts:40-43, :55-58 (getTeam, getPerson), packages/db/src/kyc.ts:197-205 (markKycVersionMaterial) (8855345)
Tình trạng: CONFIRMED
Mô tả: Năm hàm export của `db` không nằm trong `src/index.ts` (app không gọi được) và không file sản phẩm nào gọi; chỉ test dùng. `markKycVersionMaterial` là lối "RE bật material" thứ hai, trong khi app bật material qua cờ `material` của `recordKycNote` / `confirmKycFact` / `resolveKycConflict` (`KycDialogs.tsx:229`, `:367`, `:464`). ≈ 45 dòng SP sống chỉ cho test.
Tái hiện / bằng chứng: `node A\b1-exports.mjs` (quét mọi export trong bản đồ codemap, tìm nơi dùng ngoài file của nó, bỏ `index.ts`) → các dòng `getAppointment` (3 nơi dùng, đều test), `getPolicy` (1, test), `getTeam` / `getPerson` (1, test), `markKycVersionMaterial` (1, `kyc.test.ts`); `grep -rn` trên `packages apps tools` (bỏ `*.test.*`) chỉ thấy dòng khai báo.
Ảnh hưởng: không ai gặp; chi phí đọc / bảo trì (mỗi lần đổi luật "live" phải sửa cả bản không dùng), không đo được chi phí chạy.
Đề xuất: bỏ 5 hàm (+ `isCustomerLive`), test chuyển sang đọc qua `list…` / `getKycProfile`; ≈ −45 dòng SP; test giữ hành vi: `appointments.test.ts`, `policies.test.ts`, `team.test.ts`, `kyc.test.ts` (đổi chỗ đọc lại), `trash.test.ts`.
```

### CL-A4

```
ID: CL-A4
Mức: Nit
Trục: C
Vị trí: packages/domain/src/model.ts:76 ("TL/IS/BD/BDM (or other RE) joining the meeting"); docs/golden/lich-hen.md dòng `L-09` ("Chi (+ RE Dũng phối hợp)") + packages/domain/src/golden/appointments.fixture.ts (`coordinatorIds: ['re-dung']`) (8855345)
Tình trạng: CONFIRMED (đọc)
Mô tả: Spec Phase 3 §3.6 (Owner 06/10, DR-47) và K5: người phối hợp chỉ TL / IS / BD / BDM, **không RE nào, kể cả RE khác của lịch**; lệnh từ chối (`requirePeople` → `INVALID_COORDINATOR`, appointments.ts:408-414) và nhập backup từ chối (luật 5). Doc comment của `Appointment.coordinatorIds` vẫn nói "or other RE", và golden lịch hẹn (duyệt G2 03/10, trước DR-47) có kịch bản RE phối hợp — tình huống app không còn tạo được. Golden vẫn kiểm đúng điều nó muốn (người phối hợp không được tính), nên không sai số; chỉ là spec ↔ golden lệch nhau.
Tái hiện / bằng chứng: đọc ba chỗ trên; `grep -n "or other RE" packages/domain/src/model.ts` → dòng 76.
Ảnh hưởng: người đọc model / golden hiểu nhầm luật người phối hợp.
Đề xuất: sửa doc comment model.ts:76 (1 dòng). Golden: Owner quyết có ghi chú "L-09 là dữ liệu trước DR-47" trong `lich-hen.md` hay không (không sửa fixture để "cho xanh"; đổi golden là G2).
```

### CL-A5

```
ID: CL-A5
Mức: Nit
Trục: B (và C — quy ước `CLAUDE.md` "Tiền, ngày… chỉ dùng hàm chuẩn trong packages/domain")
Vị trí: packages/db/src/seed.ts:112 (DAY_MS), :606-624 (dayNumber, toDate, middayOf); packages/domain/src/evidence-level.ts:50-52 (yearBefore) ↔ packages/domain/src/compare.ts:18-21 (sameDayYearBefore) (8855345)
Tình trạng: CONFIRMED (đọc)
Mô tả: `seed.ts` tự làm số ngày kể từ 1970 (`Date.UTC/DAY_MS`, `new Date(day*DAY_MS)`) song song `toDayNumber` / `fromDayNumber` riêng tư của `period.ts`, thay vì `addDays` / `daysBetween` của domain. Hai hàm "cùng ngày năm trước, 29/02 → 28/02" viết hai lần (`yearBefore` không qua `calendarDate`, `sameDayYearBefore` có). Không sai ở dữ liệu hiện tại (test seed ghim đủ), chỉ là luật ngày nằm ở 2–3 chỗ.
Tái hiện / bằng chứng: `grep -n "DAY_MS\|MS_PER_DAY\|function yearBefore\|function sameDayYearBefore" packages/domain/src/*.ts packages/db/src/*.ts`.
Ảnh hưởng: đổi luật ngày (vd. miền năm) phải nhớ sửa nhiều chỗ.
Đề xuất: seed dùng `addDays` / `daysBetween` / `compareDates` (≈ 20 dòng đổi, test giữ hành vi: `seed.test.ts`, `seed-invariants.test.ts` — dữ liệu phải giống hệt từng byte: so hash `tables` in ra bởi `node tools/load-data.mjs` trước / sau, vì không test nào ghim hash này, xem CL-A6); gộp `yearBefore` vào một hàm của `period.ts` (≈ 8 dòng; `evidence-level.test.ts`, `compare.test.ts`).
```

### CL-A6

```
ID: CL-A6
Mức: Low
Trục: T
Vị trí: packages/domain/src/kyc.ts:109-136 (cyrb53, currentEntries, kycHash); test: packages/domain/src/kyc.test.ts:254-284, packages/db/src/seed-invariants.test.ts:205, tools/load-data-core.test.mjs:71-74 (8855345)
Tình trạng: CONFIRMED
Mô tả: `kyc_versions.hash` là giá trị **được lưu** trong DB và trong mọi `.p2cbackup`, rồi so lại ở mỗi lệnh KYC (`nextKycVersion`: `previous?.hash === hash(after)` → không ghi phiên bản). Nhưng không test nào ghim **giá trị** của `kycHash` (chỉ so hai lần tính trong cùng một lần chạy: bằng nhau / khác nhau), và hash `tables` của dữ liệu tải cũng chỉ so trong cùng lần chạy. Đổi cách băm (thứ tự khóa, bỏ / thêm `status`, đổi chuỗi JSON) thì mọi test vẫn xanh, còn DB / backup đã lưu sẽ lệch hash: lần xác nhận lại cùng giá trị đầu tiên sau khi cập nhật app sẽ ghi một phiên bản mới → phân tích AI đang CURRENT thành STALE (ngược K10 "xác nhận lại cùng giá trị giữ CURRENT").
Tái hiện / bằng chứng: đột biến M31 (bỏ `status` khỏi chuỗi băm, `JSON.stringify([fact.field, fact.value])`) → `pnpm exec vitest run packages/domain/src/kyc.test.ts packages/db/src/kyc.test.ts`: "SURVIVED — Tests 61 passed (61)" (`A\m-run.log`). Với dữ liệu mới, M31 là đột biến tương đương (trạng thái một trường suy ra được từ số giá trị: 1 → active, ≥ 2 → conflict), nên nó sống chỉ chứng minh không có giá trị nào bị ghim. `grep -rnE "'[0-9a-f]{14}'"` trong test của domain / db / app: không có kết quả.
Ảnh hưởng: chỉ khi ai đó đổi hàm băm sau v1.0 (dữ liệu thật). Hiện dữ liệu giả lập (K1: nạp lại) nên Low.
Đề xuất: một test ghim `kycHash` của 1–2 hồ sơ golden (vd. K10, K14) bằng chuỗi cố định, comment "giá trị lưu trong DB / backup — đổi là đổi định dạng file"; ≈ 10 dòng test.
```


## 4a. Bloat

| Đã chạy / đọc gì | Trên gì | Kết quả | Phát hiện |
|---|---|---|---|
| `tsc --noUnusedLocals --noUnusedParameters` | `packages/domain`, `packages/db` | Hai cờ **đã bật sẵn** trong `tsconfig.base.json` (`"noUnusedLocals": true`, `"noUnusedParameters": true`), nên `pnpm typecheck` trong `pnpm verify` (xanh ở SHA ghim, `common\baseline.md`) đã là phép kiểm này: 0 biến / tham số thừa. Không chạy lại. | — |
| Quét nơi dùng mọi export (`A\b1-exports.mjs`, log `b1-exports.log`) | 363 tên trong bản đồ codemap của `domain` + `db` (bỏ dòng `index.ts`) | 74 tên không có nơi dùng ở code sản phẩm ngoài file của nó. Phần lớn là **type** công khai và **golden** (đúng vai trò). Hàm chạy thật chỉ test dùng: 5 hàm `db` (CL-A3); ở `domain`: `policyMetrics`, `isMaterialChange` (dùng nội bộ, export cho test), `customRangeMaxEnd` (dùng nội bộ; vào `index.ts` nhưng app không gọi), `monthToDate` (không vào `index.ts`, chỉ test), `stageSnapshot` (định nghĩa một ngày cho golden — đúng chủ đích ghi trong doc comment), `AI_ANALYSIS_MODES` (chỉ `schema.ts` dùng). | CL-A3 |
| `pnpm lint:deps` | toàn repo | baseline ở SHA ghim: "no dependency violations (309 module, 1 244 dependency)"; `domain` không import gì, `db` chỉ `@p2c/domain` + `@p2c/ai/schema` | — |
| Dependency của gói | `package.json` của db / domain so với import thật (`grep from '…'`) | `drizzle-orm` (15 chỗ), `sql.js` (5), `zod` (2), `@p2c/ai/schema` (5), `@p2c/domain` (27): đều dùng; không có dependency thừa | — |
| Code lặp ≥ 3 nơi (đọc) | `packages/db/src`, `packages/domain/src` | `update…Row` (5 hàm cùng khuôn "set `updatedAt` + changes": customers, appointments, policies, team × 2); đọc KH theo id 3 kiểu (`liveCustomer`/`customerById`, `findCustomer`, `isCustomerLive`); "có phải ngày thật" 3 bản (`tryCalendarDate`, `isCalendarDate`, `validDate` — KNOWN #465 `isIsoDate`); số ngày 2 bản (CL-A5). Không đo được chi phí → không tách thành phát hiện riêng | CL-A5 |
| Bundle | `apps/desktop/dist` (baseline) | `domain` + `db` + drizzle nằm trong `assets/index.js` 891 942 B (gzip 262 010); không tách được phần của gói A nếu không có công cụ phân tích bundle (visualizer là G4 → chỉ đề xuất) | — |

## 4b. Hiệu năng

Máy: Office Laptop `D13_ThinkPad`, Node v24.20.0, 09:49–09:52 ngày 14/10; song song: phiên Codex đợt 1 ở `Project-2C-review-2` (không rõ đang chạy gì). Dữ liệu: `common\load\load-2026-10-12-seed6.p2cbackup` qua `importBackup` (đồng hồ ghim 12/10/2026 12:00 +07). Trung vị của 7 lần (3 lần cho import / export). Không đo trên exe (số exe lấy từ `common\perf\perf-ref.json`). Nguồn: `A\p3-perf.mjs`, `p3b-trash.mjs`, `p3c-scale.mjs`, `p3d-index.mjs` (+ `.log`).

| Đo gì | Dữ liệu | Kết quả (trung vị, min–max) | So ngưỡng / tham chiếu | Phát hiện |
|---|---|---|---|---|
| `importBackup` (parse + nạp + migrate + kiểm giá trị + bất biến) | tải, 15,3 MB | 784 ms (783–927) | exe `backup.read` 886 ms, ngưỡng ≤ 2 000 ms ✅ | — |
| `exportBackup` (JSON) | tải | 190 ms (190–193) | exe `backup.export` 484 ms, ≤ 1 000 ms ✅ | — |
| `db.export()` (bytes, mỗi lệnh ghi gọi một lần) | tải | 2,7 ms | exe `db.save` 160 ms (phần Rust / IPC) | — |
| `listAppointments` / `listCustomers` / `listStageTransitions` / `listPolicies` / `listPeople` | 10 252 / 1 481 / 4 883 / 1 674 / 51 dòng sống | 50,9 / 5,8 / 10,9 / 6,6 / 0,2 ms | đọc mỗi revision (`tables.ts`); `reload.*` exe 207–349 ms < 500 ✅ | — |
| `countRecords` | tải | 5,4 ms | — | — |
| `listTrash` | tải: 117 dòng (1 team, 3 người, 15 KH, 80 lịch, 18 HĐ) | 50,6 ms (47–60) | exe `trash.open` 91 ms < 200 ✅ | CL-A2 |
| ↳ trong đó `countCustomerRecords` × 15 KH xóa | | 33,0 ms (≈ 2,2 ms/KH, quét bảng) | `refs` chỉ 1,4 ms; `checkRestoreAppointment` × 80: 7,5 ms | CL-A2 |
| `listTrash` khi Thùng rác lớn dần (xóa thêm KH bằng lệnh) | 15 / 75 / 150 / 300 KH xóa | 60,8 / 197,1 / 367,7 / 702,8 ms | vượt 200 ms từ ≈ 75 KH xóa | CL-A2 |
| ↳ thêm chỉ mục `customer_id` (chỉ trên bản probe) | 150 KH xóa | 389 → 36 ms | — | CL-A2 (đề xuất) |
| Hồ sơ KH: `listAppointments(id)` / `listStageTransitions(id)` / `countCustomerRecords(id)` | KH nhiều lịch nhất | 2,3 / 0,1 / 2,7 ms (chỉ mục: 0,3 / — / 0,2) | `customer.open-ai` exe 23 ms ✅ | — |
| `getKycProfile` / `listKycVersions` / `listAiAnalyses` | KH nhiều dữ kiện (19) / nhiều phân tích nhất | 0,2 / 0,1 / 0,1 ms | ✅ | — |
| `periodMetrics` năm, Toàn bộ | tải | 1,6 ms | ✅ | — |
| `periodMetricsByScope` năm + mọi RE | tải | 1,6 ms | ✅ | — |
| `periodMetricsByMark` năm (12 mốc) | tải | 0,8 ms | ✅ | — |
| `appointmentCountsByMark` tháng (31 mốc) | tải | 1,1 ms | ✅ | — |
| `stageSnapshotSeries` năm (12 mốc) / `stageSnapshotByScope` hôm nay | tải | 2,8 / 0,9 ms | ✅ | — |

Bảng hàm thuần đầy đủ của Phase 4 (gồm `teamCompare` / `reportRows` / `monthGrid` của app) để gói F đo lại theo kế hoạch; ở đây chỉ đo hàm của `domain` / `db`. Không thấy thuật toán bậc hai nào trong `domain` (mọi hàm "ByScope / ByMark / Series" một lượt + chỉ mục ngày `markIndexer`, tìm nhị phân `firstOnOrAfter`).

## 5. Bảng đếm mức × trục

Trục chính của mỗi phát hiện (CL-A1 có thêm trục E, CL-A5 thêm C).

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 1 (CL-A1) | 0 | 0 | 0 | 1 (CL-A2) | 0 | 1 (CL-A6) | 0 | 3 |
| Nit | 0 | 1 (CL-A4) | 0 | 0 | 0 | 0 | 2 (CL-A3, CL-A5) | 0 | 0 | 3 |
| **Tổng** | 0 | 2 | 0 | 0 | 0 | 1 | 2 | 1 | 0 | **6** |

Tình trạng: 6 / 6 CONFIRMED, 0 PLAUSIBLE, 0 KNOWN (CL-A2 có liên quan mục KNOWN #539 nhưng nêu vì có bằng chứng mới). CL-A1, CL-A2, CL-A6 có probe / đột biến chạy thật; CL-A3, CL-A4, CL-A5 xác nhận bằng script quét export / `grep` (lệnh và kết quả ở từng mục).

## 6. Đã xét, không thấy (theo trục)

- **E — Edge case:** đọc từng hàm `period.ts` (biên 1900 / 2100, tuần đầu 01/01/1900 là Thứ Hai, tuần cuối cắt 31/12/2100, `shift` / `canShift` ở biên, 29/02 và `parseQuickDate` có / không năm, 31 → tháng 30 ngày ở `customRangeMaxEnd`, MTD, `chartMarks` 31 / 32 ngày), `money.ts` (`1tr5`, `1 tỷ 2`, `0,500`, nhóm nghìn bằng dấu cách, dấu âm đọc một lần, quá số nguyên an toàn → `too-large`, làm tròn `formatVndCompact` 999 995 000 → "1 tỷ"), `number.ts`, `evidence-level.ts` (29/02 → 28/02 năm trước), `stage-snapshot.ts` (nhiều chuyển nhóm cùng ngày: tìm nhị phân `firstOnOrAfter` + `from >= until` khớp `findLast`), `markIndexer` (mốc chồng / ngoài khoảng → −1). Đột biến M09, M11–M13, M18–M21, M30 trên các biên này đều bị test giết (§7). Không thấy lỗi ngoài CL-A1 (ca chuyển tay cùng ngày cuộc hẹn).
- **C — Đúng hợp đồng:** golden đối chiếu từng dòng tài liệu ↔ fixture: `chi-so.md` G01–G22 (tự tính lại G07, G08, G10, G11, G18 bằng tay: khớp), `kyc.md` K01–K15 + danh mục / ngưỡng / câu hỏi gợi ý (khớp `kyc-catalog.ts` từng chữ), `lich-hen.md` A01–A13, `kh-theo-nhom.md` S01–S13 (tự tính S01, S04: khớp). Spec Phase 3 §4 (bảng lệnh) và §6 luật 1–10 ↔ `backup-validation.ts`; spec Phase 6 TR-1…TR-5 ↔ `checkRestore*`; E5–E8 ↔ `checkTransition` (từ chối khi đổi nhóm **sau** ngày cuộc hẹn; cùng ngày được — đúng chữ TR-3, xem CL-A1 cho hệ quả). Chỉ thấy CL-A1, CL-A4.
- **D — Dữ liệu:** `database.ts` (BEGIN / SAVEPOINT lồng, ROLLBACK TO + RELEASE, COMMIT lỗi → ROLLBACK, `persist` chỉ ở tầng ngoài, xuất làm mới khóa ngoại), so **lệnh ↔ luật nhập** cho từng cột: ngày / giờ / mốc ISO / `seq` / phí / tên NFC / `next_step` / `value_json` KYC / NUL / luật 1–14 (đều cùng hàm: `cleanText`, `requireName`, `optionalText`, `isFee`, `normalizeKycValue`, `analysisLabelsFit`, `analysisContentFits`, `profileFactValue`). Chỗ nhập backup lỏng hơn lệnh chỉ là chữ không ảnh hưởng số liệu (`trigger_note` / `note` không bắt trim; lịch dời mang RE khác lịch gốc) — chỉ có ở file sửa tay, không nêu thành phát hiện. Khôi phục: `restore*` gọi đúng hàm `checkRestore*` mà `listTrash` dùng (TR-1). KNOWN S-1 (`kyc_versions.hash` không kiểm khi nhập) — không có bằng chứng mới.
- **G — Guardrail AI:** trong gói A chỉ có lưu trữ: `ai_analyses` chỉ thêm (trigger 0006 + dựng lại 0008 sau khi 0007 drop bảng), luật 11–14 khi nhập dùng chung `analysisLabelsFit` / `analysisContentFits` với lệnh, raw output thay NUL và cắt theo code point ≤ 20 000 (M17 bị giết). Kiểm nội dung G5 thuộc gói C. Không thấy lỗi.
- **S — Ranh giới (nhập backup):** độ dài text > `MAX_BACKUP_BYTES` từ chối trước `JSON.parse`; zod `strictObject` cho vỏ; tên bảng / cột lấy từ `sqlite_master` / `pragma_table_info` (không từ file), file chỉ được so khớp tập tên (`sameSet`), `quote()` cho tên; kiểu ô `integer` / `text` chặt, NUL bị chặn (M22 xem §7). Thử thêm: khóa `__proto__` ở cấp bảng / dòng bị zod bỏ qua im lặng (`node -e` với `zod` của repo: `keys(tables)= [ 'teams' ]`, `keys(row)= [ 'id' ]`) → file có khóa thừa `__proto__` vẫn nhập được thay vì `BACKUP_INVALID`, nhưng không có dữ liệu nào bị đổi → vô hại, không nêu. Không có SQL ghép từ dữ liệu file (luật 10 ghép `today` do app sinh `yyyy-mm-dd`).
- **P — Hiệu năng:** §4b; chỉ CL-A2.
- **B — Bloat:** §4a; CL-A3, CL-A5.
- **T — Chất lượng test:** 35 lần chạy đột biến (34 mutant + M26b, bảng §7): 33 bị test giết. Sống: M26 (bỏ `REVIEWER_IN_USE`) chỉ vì tôi chọn thiếu file test — ca của nó nằm ở `appointments.test.ts:411`, `:423`; chạy lại M26b có file đó → bị giết; M31 (bỏ `status` khỏi chuỗi băm KYC) là đột biến tương đương với dữ liệu mới, nhưng cho thấy không test nào ghim giá trị hash đã lưu → CL-A6. `grep` khẳng định yếu: các `resolves.toBeDefined()` / `not.toThrow()` đều là ca "nhận được" có ca "từ chối" đi kèm, không thấy test giả xanh. Ngày hệ thống: test lệnh dùng `setup()` (đồng hồ ghim); còn ≈ 20 chỗ `openDatabase()` không ghim đồng hồ (`database.test.ts`, `backup.test.ts`, `ai-analyses.test.ts:648`, `backup-invariants.test.ts:252`) — theo tên ca là kiểm schema / migration, tôi chưa đọc từng ca nên không kết luận thêm; ghi chú KNOWN về `test-support.ts:10` (Auckland), `backup-invariants.test.ts:824`, `seed-invariants.test.ts:36` — không có bằng chứng mới.
- **A — Trợ năng / i18n:** gói A không có UI. Chuỗi tiếng Việt nằm trong `domain` / `db` là dữ liệu đã duyệt (câu hỏi gợi ý G2, `KYC_INSUFFICIENT_MESSAGE`, ghi chú `SYSTEM` "Hồ sơ KH: …", "Cập nhật KYC dd/mm/yyyy" — ACCEPTED #33–#62); mã lỗi `DbError` dịch ở UI (`i18n/index.test.ts` kiểm đủ mã). Không thấy lỗi.

## 7. Phụ lục

### 7.1 Probe, log, đột biến

Mọi file ở `C:\workspace\deep-review-1-6\claude\A\`. Probe import thẳng nguồn TS của repo ở SHA ghim qua `hooks.mjs` (không sửa repo); dữ liệu tải đọc từ `common\load\`.

| File | Việc | Log | Dùng ở |
|---|---|---|---|
| `hooks.mjs` | nạp TS không đuôi + `?raw` như `tools/load-data.mjs` | — | mọi probe |
| `p1-restore.mjs` | khôi phục lịch Đã gặp không đổi nhóm, sau chuyển tay cùng ngày | `p1-restore.log` | CL-A1 |
| `p5-restore-sameday.mjs` | khôi phục lịch Đã gặp có RF đã rút, sau chuyển tay cùng ngày / ngày sau / đóng | `p5-restore-sameday.log` | CL-A1 |
| `p3-perf.mjs` | đo hàm đọc của `db` + chỉ số `domain` trên dữ liệu tải | `p3-perf.log` | §4b |
| `p3b-trash.mjs` | tách thời gian `listTrash`, EXPLAIN | `p3b-trash.log` | CL-A2 |
| `p3c-scale.mjs` | `listTrash` khi Thùng rác lớn dần | `p3c-scale.log` | CL-A2 |
| `p3d-index.mjs` | như trên, trước / sau chỉ mục `customer_id` (chỉ trên bản probe) | `p3d-index.log` | CL-A2 |
| `b1-exports.mjs` | nơi dùng của mọi export trong bản đồ codemap | `b1-exports.log` | §4a, CL-A3 |
| `m-run.mjs` + `m-list.mjs` | đột biến: vá một file, chạy test, trả lại nguyên byte (kiểm hash) trong `finally` | `m-run.log`, `m-run.out` | §6 T, CL-A6 |
| `m-table.mjs`, `appendix.mjs` | in bảng / phụ lục này | `m-table.md` | §7 |

Ghi chú về `p3-perf.log`: dòng "countCustomerRecords × mọi KH đã xóa 0,1 ms" là dòng hỏng của probe (hàm trong vòng lặp không gọi gì) — bỏ; số đúng ở `p3b-trash.log` (33,0 ms cho 15 KH).

### 7.2 Đột biến (35 lần chạy: 33 bị giết, 2 sống)

Chạy 09:57–10:06 bằng `node m-run.mjs` (và `node m-run.mjs M26b`); lệnh test: `pnpm exec vitest run <file test…>` ở gốc repo. Sống: **M26** — chọn thiếu file test (chạy lại M26b → bị giết); **M31** — tương đương với dữ liệu mới, dẫn tới CL-A6.

| # | File | Đột biến | Thay từ → thành | Test chạy | Kết quả |
|---|---|---|---|---|---|
| M01 | `db/src/backup-validation.ts` | rule 10 drops met / no-show appointments after today | `` `SELECT 1 FROM appointments WHERE deleted_at IS NULL AND status IN ('MET', 'NO_SHOW') AND date > ${after}`, `` → `` `SELECT 1 FROM appointments WHERE 0`, `` | db/backup-invariants.test.ts, db/backup.test.ts | KILLED — Tests  1 failed \| 199 passed (200) |
| M02 | `db/src/backup-validation.ts` | rule 3 drops "dates never go back" | `(next.date as string) < (previous.date as string)` → `false` | db/backup-invariants.test.ts | KILLED — Tests  1 failed \| 131 passed (132) |
| M03 | `db/src/backup-validation.ts` | rule 4 drops "transition day = meeting day" | `      a.stage_after === t.to_stage &&⏎      a.date === t.date` → `      a.stage_after === t.to_stage` | db/backup-invariants.test.ts | KILLED — Tests  1 failed \| 131 passed (132) |
| M04 | `db/src/backup-validation.ts` | rule 5 drops the reschedule-cycle check | `return reached === appointments.size;` → `return true;` | db/backup-invariants.test.ts | KILLED — Tests  2 failed \| 130 passed (132) |
| M05 | `db/src/backup-validation.ts` | rule 7 lets 1 active + 1 conflict pass | `(active === 1 && conflict === 0) \|\| (active === 0 && conflict >= 2)` → `(active === 1 && conflict <= 1) \|\| (active === 0 && conflict >= 2)` | db/backup-invariants.test.ts | KILLED — Tests  1 failed \| 131 passed (132) |
| M06 | `db/src/backup-validation.ts` | rule 5 drops "rescheduled from the same customer" | `return from.customer_id === a.customer_id && from.status === 'RESCHEDULED';` → `return from.status === 'RESCHEDULED';` | db/backup-invariants.test.ts | KILLED — Tests  1 failed \| 131 passed (132) |
| M07 | `db/src/customers.ts` | D10 lets a transition go one day back | `if (latest && compareDates(date, fromIsoDate(latest.date)) < 0) {` → `if (latest && compareDates(date, fromIsoDate(latest.date)) < -1) {` | db/customers.test.ts, db/appointments.test.ts, db/trash.test.ts | KILLED — Tests  1 failed \| 89 passed (90) |
| M08 | `domain/src/customer-lifecycle.ts` | RF also from N2 | `(from === 'N4' \|\| from === 'N3') && (to === 'N2' \|\| to === 'N1')` → `(from === 'N4' \|\| from === 'N3' \|\| from === 'N2') && (to === 'N2' \|\| to === 'N1')` | domain/ | KILLED — Tests  10 failed \| 732 passed (742) |
| M09 | `domain/src/evidence-level.ts` | recent boundary: exactly a year before no longer recent | `compareDates(latest, yearBefore(analysisDate)) >= 0` → `compareDates(latest, yearBefore(analysisDate)) > 0` | domain/evidence-level.test.ts | exactly a year before no longer recent: KILLED — Tests  1 failed \| 12 passed (13) |
| M10 | `db/src/appointments.ts` | a no-show may be dated after today | `const held = status === 'MET' \|\| status === 'NO_SHOW';` → `const held = status === 'MET';` | db/appointments.test.ts, db/trash.test.ts | KILLED — Tests  2 failed \| 74 passed (76) |
| M11 | `domain/src/appointment-counts.ts` | today's scheduled appointment counts as unrecorded | `return compareDates(appointment.date, today) < 0 ? 'unrecorded' : 'planned';` → `return compareDates(appointment.date, today) <= 0 ? 'unrecorded' : 'planned';` | domain/ | KILLED — Tests  9 failed \| 733 passed (742) |
| M12 | `domain/src/period.ts` | next-year suggestion from exactly 60 days | `toDayNumber(today) - toDayNumber(date) > NEXT_YEAR_SUGGESTION_DAYS;` → `toDayNumber(today) - toDayNumber(date) >= NEXT_YEAR_SUGGESTION_DAYS;` | domain/period.test.ts | KILLED — Tests  2 failed \| 139 passed (141) |
| M13 | `domain/src/period.ts` | custom range cap one day longer | `: toDayNumber({ year, month, day: start.day }) - 1;` → `: toDayNumber({ year, month, day: start.day });` | domain/period.test.ts | KILLED — Tests  9 failed \| 132 passed (141) |
| M14 | `db/src/customers.ts` | withdraw no longer requires the customer's latest (D7) | `if (latestTransition(db, caused.customerId)?.id !== caused.id) {` → `if (false) {` | db/appointments.test.ts, db/trash.test.ts, db/customers.test.ts | KILLED — Tests  2 failed \| 88 passed (90) |
| M15 | `db/src/counts.ts` | rf counts every move of a met appointment | `isRfTransition(from as CustomerStage \| null, to as CustomerStage),` → `true,` | db/counts.test.ts, db/trash.test.ts | KILLED — Tests  1 failed \| 21 passed (22) |
| M16 | `db/src/trash.ts` | oldest deletion first | `a.deletedAt < b.deletedAt ? 1 : -1,` → `a.deletedAt < b.deletedAt ? -1 : 1,` | db/trash.test.ts | KILLED — Tests  1 failed \| 19 passed (20) |
| M17 | `db/src/ai-analyses.ts` | raw output kept one character longer | `.slice(0, MAX_AI_RAW_OUTPUT)` → `.slice(0, MAX_AI_RAW_OUTPUT + 1)` | db/ai-analyses.test.ts | KILLED — Tests  1 failed \| 19 passed (20) |
| M18 | `domain/src/compare.ts` | year in progress compared up to the day after | `? sameDayYearBefore(today)` → `? addDays(sameDayYearBefore(today), 1)` | domain/compare.test.ts | KILLED — Tests  5 failed \| 22 passed (27) |
| M19 | `domain/src/stage-snapshot.ts` | series never takes a customer out of a stage | `if (after) after[transition.to] -= 1;` → (xóa) | domain/stage-snapshot.test.ts | KILLED — Tests  4 failed \| 69 passed (73) |
| M20 | `domain/src/money.ts` | "1tr5" read as 1 005 000 | `` return tail.length === 1 ? `${tail}00` : tail.padStart(3, '0'); `` → `return tail.padStart(3, '0');` | domain/money.test.ts | KILLED — Tests  7 failed \| 136 passed (143) |
| M21 | `domain/src/money.ts` | compact: 999,995 tr no longer shows 1 tỷ | `magnitude >= BILLION \|\| millionHundredths >= 1000 * 100` → `magnitude >= BILLION` | domain/money.test.ts | 999,995 tr no longer shows 1 tỷ: KILLED — Tests  1 failed \| 142 passed (143) |
| M22 | `db/src/backup.ts` | import takes a text with a NUL | `typeof value === 'string' && !value.includes('\0')` → `typeof value === 'string'` | db/backup.test.ts, db/backup-invariants.test.ts | KILLED — Tests  3 failed \| 197 passed (200) |
| M23 | `db/src/backup-validation.ts` | rule 10 drops KYC notes after today | `` `SELECT 1 FROM kyc_notes WHERE created_date > ${after}`, `` → `` `SELECT 1 FROM kyc_notes WHERE 0`, `` | db/backup-invariants.test.ts | KILLED — Tests  1 failed \| 131 passed (132) |
| M24 | `db/src/customers.ts` | restore customer without checking its RE | `export function checkRestoreCustomer(db: Database, row: CustomerRow): void {⏎  requireRe(db, row.reId);` → `export function checkRestoreCustomer(db: Database, row: CustomerRow): void {⏎  void [db, row];` | db/customers.test.ts, db/trash.test.ts | KILLED — Tests  3 failed \| 31 passed (34) |
| M25 | `db/src/policies.ts` | issued before submitted left to the CHECK | `if (issuedDate !== null && compareDates(issuedDate, policy.submittedDate) < 0) {` → `if (false) {` | db/policies.test.ts, db/trash.test.ts | KILLED — Tests  1 failed \| 27 passed (28) |
| M26 | `db/src/team.ts` | a live reviewer may become an RE | `if (reviewsLiveAppointment(db, id)) throw new DbError('REVIEWER_IN_USE');` → (xóa) | db/team.test.ts | SURVIVED — Tests  21 passed (21) |
| M26b | `db/src/team.ts` | a live reviewer may become an RE (with appointments.test.ts) | `if (reviewsLiveAppointment(db, id)) throw new DbError('REVIEWER_IN_USE');` → (xóa) | db/team.test.ts, db/appointments.test.ts | KILLED — Tests  2 failed \| 75 passed (77) |
| M27 | `db/src/kyc.ts` | resolving birth year / gender to any SYSTEM fact | `chosen.value !== profileFactValue(chosen.field as 'birthYear' \| 'gender', customer))` → `false)` | db/kyc.test.ts | KILLED — Tests  1 failed \| 29 passed (30) |
| M28 | `db/src/database.ts` | nested transaction keeps its writes on error | `sqlite.exec(nested ? 'ROLLBACK TO nested; RELEASE nested' : 'ROLLBACK');` → `sqlite.exec(nested ? 'RELEASE nested' : 'ROLLBACK');` | db/database.test.ts, db/kyc.test.ts, db/appointments.test.ts | KILLED — Tests  1 failed \| 111 passed (112) |
| M29 | `db/src/ai-analyses.ts` | reminder since: every later version, not only material ones | `.filter((v) => v.material === material)` → (xóa) | db/ai-analyses.test.ts | every later version, not only material ones: KILLED — Tests  2 failed \| 18 passed (20) |
| M30 | `domain/src/stats.ts` | marks may touch (same day end/start) | `daysBetween(previous.end, mark.start) <= 0)` → `daysBetween(previous.end, mark.start) < 0)` | domain/ | KILLED — Tests  1 failed \| 741 passed (742) |
| M31 | `domain/src/kyc.ts` | hash ignores status (conflict entering does not change it) | `JSON.stringify([fact.field, fact.value, fact.status])` → `JSON.stringify([fact.field, fact.value])` | domain/kyc.test.ts, db/kyc.test.ts | SURVIVED — Tests  61 passed (61) |
| M32 | `db/src/appointments.ts` | restore of a met appointment does not re-apply its stage | `    updateAppointmentRow(db, id, { deletedAt: null });⏎    applyOutcome(db, row);` → `    updateAppointmentRow(db, id, { deletedAt: null });` | db/appointments.test.ts, db/trash.test.ts | KILLED — Tests  2 failed \| 74 passed (76) |
| M33 | `db/src/backup-validation.ts` | rule 8 drops "profile birth year / gender has its fact" | `  if (missing) return 8;⏎` → (xóa) | db/backup-invariants.test.ts | KILLED — Tests  3 failed \| 129 passed (132) |
| M34 | `db/src/common.ts` | fee cap off by one đồng | `value > 0 && value <= MAX_FEE_VND` → `value > 0 && value <= MAX_FEE_VND + 1` | db/policies.test.ts, db/appointments.test.ts, db/backup-invariants.test.ts, db/common.test.ts | KILLED — Tests  2 failed \| 198 passed (200) |

### 7.3 Nguồn probe / đột biến

#### `A\hooks.mjs`

```js
// Loader for probes: same as tools/load-data.mjs (TS sources with extensionless imports, ?raw).
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { URL } from 'node:url';
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (!specifier.startsWith('.')) throw error;
      for (const suffix of ['.ts', '/index.ts']) {
        try { return nextResolve(specifier + suffix, context); } catch {}
      }
      throw error;
    }
  },
  load(url, context, nextLoad) {
    if (!url.endsWith('?raw')) return nextLoad(url, context);
    const text = readFileSync(new URL(url.slice(0, -'?raw'.length)), 'utf8');
    return { format: 'module', source: `export default ${JSON.stringify(text)};`, shortCircuit: true };
  },
});
```

#### `A\p1-restore.mjs`

```js
// Probe P1: restoring a met appointment that never moved its customer (stage after = stage then),
// after a same-day manual change. Does restore create a transition (and an RF) that never existed?
import './hooks.mjs';
const R = 'file:///C:/workspace/Project-2C-review/packages/';
const db_ = await import(R + 'db/src/index.ts');
const ap = await import(R + 'db/src/appointments.ts');
const tr = await import(R + 'db/src/trash.ts');
const dom = await import(R + 'domain/src/index.ts');
const d = (day, month) => dom.calendarDate(2026, month, day);

async function run(label, startStage, after, manualTo) {
  let clock = Date.UTC(2026, 9, 11, 4, 0, 0); // 11/10/2026 11:00 UTC+7
  const db = await db_.openDatabase({ now: () => new Date(clock++) });
  const team = db_.createTeam(db, { name: 'Sao Mai' });
  const re = db_.createPerson(db, { name: 'An', role: 'RE', teamId: team.id });
  const c = db_.createCustomer(db, { name: 'KH', reId: re.id, stage: startStage, date: d(1, 10) });
  const a = db_.scheduleAppointment(db, { customerId: c.id, reId: re.id, date: d(10, 10), triggerType: 'REFERRAL' });
  db_.recordMeetingOutcome(db, a.id, { status: 'MET', stageAfter: after, nextStep: 'Gửi đề xuất' });
  const show = (when) => {
    const ts = db_.listStageTransitions(db, c.id).map((t) => `${t.from ?? '∅'}→${t.to}@${dom.formatDate(t.date)}${t.appointmentId ? ' (lịch)' : ''}`);
    const apps = db_.listAppointments(db, c.id);
    const rf = dom.rfCount({ people: db_.listPeople(db), appointments: apps, transitions: db_.listStageTransitions(db) }, dom.periodOf('month', d(1, 10)), { kind: 'all' });
    console.log(`  ${when}: stage=${db_.getCustomer(db, c.id).stage} transitions=[${ts.join(', ')}] RF(10/2026)=${rf}`);
  };
  console.log(label);
  show('sau khi ghi kết quả');
  db_.changeStageManually(db, c.id, { to: manualTo, date: d(10, 10) });
  show('sau khi chuyển tay cùng ngày');
  db_.softDeleteAppointment(db, a.id);
  show('sau khi xóa lịch');
  const row = tr.listTrash(db).find((r) => r.id === a.id);
  console.log('  Thùng rác effect:', JSON.stringify(row.effect), 'blocked:', JSON.stringify(row.blocked ?? null));
  db_.restoreAppointment(db, a.id);
  show('sau khi khôi phục');
}
await run('P1a: KH N3, gặp 10/10 nhóm sau N3 (không đổi), chuyển tay N3→N2 cùng ngày', 'N3', 'N3', 'N2');
await run('P1b: KH N2, gặp 10/10 nhóm sau N2 (không đổi), chuyển tay N2→N3 cùng ngày', 'N2', 'N2', 'N3');
```

#### `A\p5-restore-sameday.mjs`

```js
// Probe P5: restoring a met appointment whose transition WAS withdrawn by the delete, after a
// manual change on the same day as the meeting (TR-3 only refuses a change on a LATER day).
import './hooks.mjs';
const R = 'file:///C:/workspace/Project-2C-review/packages/';
const db_ = await import(R + 'db/src/index.ts');
const tr = await import(R + 'db/src/trash.ts');
const dom = await import(R + 'domain/src/index.ts');
const d = (day, month) => dom.calendarDate(2026, month, day);

async function run(label, manualTo, manualDay) {
  let clock = Date.UTC(2026, 9, 11, 4, 0, 0);
  const db = await db_.openDatabase({ now: () => new Date(clock++) });
  const team = db_.createTeam(db, { name: 'Sao Mai' });
  const re = db_.createPerson(db, { name: 'An', role: 'RE', teamId: team.id });
  const c = db_.createCustomer(db, { name: 'KH', reId: re.id, stage: 'N3', date: d(1, 10) });
  const a = db_.scheduleAppointment(db, { customerId: c.id, reId: re.id, date: d(2, 10), triggerType: 'REFERRAL' });
  db_.recordMeetingOutcome(db, a.id, { status: 'MET', stageAfter: 'N2', nextStep: 'Gửi đề xuất' });
  const show = (when) => {
    const ts = db_.listStageTransitions(db, c.id).map((t) => `${t.from ?? '∅'}→${t.to}@${dom.formatDayMonth(t.date)}${t.appointmentId ? '(lịch)' : ''}`);
    const rf = dom.rfCount({ people: db_.listPeople(db), appointments: db_.listAppointments(db), transitions: db_.listStageTransitions(db) }, dom.periodOf('month', d(1, 10)), { kind: 'all' });
    console.log(`  ${when}: stage=${db_.getCustomer(db, c.id).stage} [${ts.join(', ')}] RF=${rf}`);
  };
  console.log(label);
  show('ghi kết quả 02/10 N3→N2');
  db_.softDeleteAppointment(db, a.id);
  show('xóa lịch (rút chuyển nhóm)');
  db_.changeStageManually(db, c.id, { to: manualTo, date: d(manualDay, 10) });
  show(`chuyển tay ${manualTo} ngày ${manualDay}/10`);
  const row = tr.listTrash(db).find((r) => r.id === a.id);
  console.log('  Thùng rác:', JSON.stringify(row.effect), 'blocked:', JSON.stringify(row.blocked ?? null));
  try { db_.restoreAppointment(db, a.id); show('khôi phục'); } catch (e) { console.log('  khôi phục bị từ chối:', e.code, JSON.stringify(e.params ?? {})); }
}
await run('P5a (E6 cùng ngày): chuyển tay N3→N1 cùng ngày 02/10', 'N1', 2);
await run('P5b (E6 khác ngày): chuyển tay N3→N1 ngày 05/10', 'N1', 5);
await run('P5c: chuyển tay N3→ON_HOLD cùng ngày 02/10', 'ON_HOLD', 2);
```

#### `A\p3-perf.mjs`

```js
// Probe P3: db reads / domain metrics on the load data (common\load), in Node.
import './hooks.mjs';
import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
const R = 'file:///C:/workspace/Project-2C-review/packages/';
const db_ = await import(R + 'db/src/index.ts');
const dom = await import(R + 'domain/src/index.ts');
const trash = await import(R + 'db/src/trash.ts');
const kyc = await import(R + 'db/src/kyc.ts');
const text = readFileSync('C:/workspace/deep-review-1-6/common/load/load-2026-10-12-seed6.p2cbackup', 'utf8');
const RUNS = Number(process.env.RUNS ?? 7);
const results = [];
function time(name, fn, runs = RUNS) {
  const ms = [];
  let out;
  for (let i = 0; i < runs; i++) { const t = performance.now(); out = fn(); ms.push(performance.now() - t); }
  ms.sort((a, b) => a - b);
  const med = ms[Math.floor(ms.length / 2)];
  results.push({ name, runs, median: +med.toFixed(1), min: +ms[0].toFixed(1), max: +ms.at(-1).toFixed(1) });
  return out;
}
async function timeAsync(name, fn, runs = 3) {
  const ms = []; let out;
  for (let i = 0; i < runs; i++) { const t = performance.now(); out = await fn(); ms.push(performance.now() - t); }
  ms.sort((a, b) => a - b);
  results.push({ name, runs, median: +ms[Math.floor(ms.length / 2)].toFixed(1), min: +ms[0].toFixed(1), max: +ms.at(-1).toFixed(1) });
  return out;
}
const now = () => new Date(Date.UTC(2026, 9, 12, 5, 0, 0));
const { db } = await timeAsync('importBackup (15,3 MB)', () => db_.importBackup(text, { now }));
const customers = time('listCustomers', () => db_.listCustomers(db));
const appointments = time('listAppointments', () => db_.listAppointments(db));
const transitions = time('listStageTransitions', () => db_.listStageTransitions(db));
const policies = time('listPolicies', () => db_.listPolicies(db));
const people = time('listPeople', () => db_.listPeople(db));
time('countRecords', () => db_.countRecords(db));
const rows = time('listTrash', () => trash.listTrash(db));
time('exportBackup', () => db_.exportBackup(db), 3);
time('db.export() (bytes)', () => db.export(), 3);
// heaviest customer profile / AI history
const withAi = db.sqlite.exec('SELECT customer_id, COUNT(*) n FROM ai_analyses GROUP BY customer_id ORDER BY n DESC LIMIT 1')[0].values[0][0];
const manyFacts = db.sqlite.exec('SELECT customer_id, COUNT(*) n FROM kyc_facts GROUP BY customer_id ORDER BY n DESC LIMIT 1')[0].values[0];
time('getKycProfile (KH nhiều dữ kiện nhất: ' + manyFacts[1] + ')', () => db_.getKycProfile(db, manyFacts[0]));
time('listKycVersions (cùng KH)', () => db_.listKycVersions(db, manyFacts[0]));
time('listAiAnalyses (KH nhiều phân tích nhất)', () => db_.listAiAnalyses(db, withAi));
time('countCustomerRecords × mọi KH đã xóa', () => {
  const ids = db.sqlite.exec('SELECT id FROM customers WHERE deleted_at IS NOT NULL')[0].values.map((r) => r[0]);
  for (const id of ids) db_.countRecords && trash; // keep
  return ids.length;
});
const data = { people, policies, appointments, transitions };
const today = dom.calendarDate(2026, 10, 12);
const year = dom.periodOf('year', today);
const month = dom.periodOf('month', today);
time('periodMetrics (năm, toàn bộ)', () => dom.periodMetrics(data, year, { kind: 'all' }));
time('periodMetricsByScope (năm) + 5 team + 44 RE', () => {
  const by = dom.periodMetricsByScope(data, year);
  for (const p of people) by(p.role === 'RE' ? { kind: 're', reId: p.id } : { kind: 'all' });
});
time('periodMetricsByMark (năm, 12 mốc)', () => dom.periodMetricsByMark(data, dom.chartMarks(year), { kind: 'all' }));
time('appointmentCountsByMark (tháng theo ngày)', () => dom.appointmentCountsByMark(appointments, dom.chartMarks(month), { kind: 'all' }, people, today));
time('stageSnapshotSeries (năm 12 mốc)', () => dom.stageSnapshotSeries(customers, transitions, people)(dom.chartMarks(year).map((m) => dom.snapshotDate(m, today) ?? m.end).filter(Boolean), { kind: 'all' }));
time('stageSnapshotByScope (hôm nay)', () => dom.stageSnapshotByScope(customers, transitions, people, today)({ kind: 'all' }));
console.log(`rows: customers ${customers.length}, appointments ${appointments.length}, transitions ${transitions.length}, policies ${policies.length}, people ${people.length}, trash ${rows.length}`);
console.table(results);
```

#### `A\p3b-trash.mjs`

```js
// Probe P3b: where listTrash spends its time on the load data.
import './hooks.mjs';
import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
const R = 'file:///C:/workspace/Project-2C-review/packages/';
const db_ = await import(R + 'db/src/index.ts');
const trash = await import(R + 'db/src/trash.ts');
const counts = await import(R + 'db/src/counts.ts');
const ap = await import(R + 'db/src/appointments.ts');
const common = await import(R + 'db/src/common.ts');
const schema = await import(R + 'db/src/schema.ts');
const { isNotNull } = await import('file:///C:/workspace/Project-2C-review/packages/db/node_modules/drizzle-orm/index.js');
const text = readFileSync('C:/workspace/deep-review-1-6/common/load/load-2026-10-12-seed6.p2cbackup', 'utf8');
const { db } = await db_.importBackup(text, { now: () => new Date(Date.UTC(2026, 9, 12, 5)) });
const med = (fn, runs = 9) => { const ms = []; for (let i = 0; i < runs; i++) { const t = performance.now(); fn(); ms.push(performance.now() - t); } ms.sort((a, b) => a - b); return +ms[runs >> 1].toFixed(2); };
const kinds = db.sqlite.exec(`SELECT 'team', COUNT(*) FROM teams WHERE deleted_at IS NOT NULL UNION ALL SELECT 'person', COUNT(*) FROM people WHERE deleted_at IS NOT NULL UNION ALL SELECT 'customer', COUNT(*) FROM customers WHERE deleted_at IS NOT NULL UNION ALL SELECT 'appointment', COUNT(*) FROM appointments WHERE deleted_at IS NOT NULL UNION ALL SELECT 'policy', COUNT(*) FROM policies WHERE deleted_at IS NOT NULL`)[0].values;
console.log('trash rows by kind:', JSON.stringify(kinds));
console.log('listTrash total ms:', med(() => trash.listTrash(db)));
console.log('refs: read teams+people (orm) ms:', med(() => { db.orm.select().from(schema.teams).all(); db.orm.select().from(schema.people).all(); }));
console.log('refs: read customers (selectRows) ms:', med(() => common.selectRows(db, 'SELECT id, name, stage, deleted_at FROM customers')));
const delCustomers = db.sqlite.exec('SELECT id FROM customers WHERE deleted_at IS NOT NULL')[0].values.map((r) => r[0]);
console.log('countCustomerRecords × ' + delCustomers.length + ' ms:', med(() => { for (const id of delCustomers) counts.countCustomerRecords(db, id); }));
const delApps = db.orm.select().from(schema.appointments).where(isNotNull(schema.appointments.deletedAt)).all();
console.log('select deleted appointments (orm, full rows) ms:', med(() => db.orm.select().from(schema.appointments).where(isNotNull(schema.appointments.deletedAt)).all()));
console.log('checkRestoreAppointment × ' + delApps.length + ' ms:', med(() => { for (const r of delApps) { try { ap.checkRestoreAppointment(db, r); } catch {} } }));
const plan = db.sqlite.exec("EXPLAIN QUERY PLAN SELECT * FROM appointments WHERE deleted_at IS NOT NULL")[0].values.map((r) => r.at(-1));
console.log('plan deleted appointments:', JSON.stringify(plan));
const plan2 = db.sqlite.exec("EXPLAIN QUERY PLAN SELECT * FROM stage_transitions WHERE customer_id = 'x' AND deleted_at IS NULL ORDER BY seq DESC LIMIT 1")[0].values.map((r) => r.at(-1));
console.log('plan latestTransition:', JSON.stringify(plan2));
const plan3 = db.sqlite.exec("EXPLAIN QUERY PLAN SELECT COUNT(*) FROM appointments WHERE customer_id = 'x' AND deleted_at IS NULL")[0].values.map((r) => r.at(-1));
console.log('plan count appointments by customer:', JSON.stringify(plan3));
const idx = db.sqlite.exec("SELECT name, tbl_name FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%'")[0].values;
console.log('indexes:', JSON.stringify(idx));
```

#### `A\p3c-scale.mjs`

```js
// Probe P3c: listTrash and the customer-profile reads as Thùng rác grows (TR-6: never emptied),
// and per-customer reads without an index on appointments/policies.customer_id.
import './hooks.mjs';
import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
const R = 'file:///C:/workspace/Project-2C-review/packages/';
const db_ = await import(R + 'db/src/index.ts');
const trash = await import(R + 'db/src/trash.ts');
const ap = await import(R + 'db/src/appointments.ts');
const text = readFileSync('C:/workspace/deep-review-1-6/common/load/load-2026-10-12-seed6.p2cbackup', 'utf8');
const { db } = await db_.importBackup(text, { now: () => new Date(Date.UTC(2026, 9, 12, 5)) });
const med = (fn, runs = 7) => { const ms = []; for (let i = 0; i < runs; i++) { const t = performance.now(); fn(); ms.push(performance.now() - t); } ms.sort((a, b) => a - b); return +ms[runs >> 1].toFixed(1); };
// Customer-profile reads of the busiest customer (CustomerProfile.tsx:42-54).
const busiest = db.sqlite.exec('SELECT customer_id FROM appointments WHERE deleted_at IS NULL GROUP BY customer_id ORDER BY COUNT(*) DESC LIMIT 1')[0].values[0][0];
console.log('profile reads (busiest customer):',
  'listAppointments(id)', med(() => ap.listAppointments(db, busiest)), 'ms;',
  'listStageTransitions(id)', med(() => db_.listStageTransitions(db, busiest)), 'ms;',
  'countCustomerRecords(id)', med(() => db_.countCustomerRecords(db, busiest)), 'ms');
const live = db_.listCustomers(db).map((c) => c.id);
let deleted = 15;
console.log(`deleted customers ${deleted}: listTrash ${med(() => trash.listTrash(db))} ms`);
db.persist = undefined;
for (const target of [75, 150, 300]) {
  // Delete more customers through the command (in one outer transaction: no persist port anyway).
  db.transaction(() => { while (deleted < target) db_.softDeleteCustomer(db, live[deleted++ * 3 % live.length]); });
  console.log(`deleted customers ${deleted}: listTrash ${med(() => trash.listTrash(db), 5)} ms (rows ${trash.listTrash(db).length})`);
}
```

#### `A\p3d-index.mjs`

```js
// Probe P3d: same as P3c with 150 deleted customers, before / after an index on customer_id
// (created only in this in-memory copy).
import './hooks.mjs';
import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
const R = 'file:///C:/workspace/Project-2C-review/packages/';
const db_ = await import(R + 'db/src/index.ts');
const trash = await import(R + 'db/src/trash.ts');
const ap = await import(R + 'db/src/appointments.ts');
const text = readFileSync('C:/workspace/deep-review-1-6/common/load/load-2026-10-12-seed6.p2cbackup', 'utf8');
const { db } = await db_.importBackup(text, { now: () => new Date(Date.UTC(2026, 9, 12, 5)) });
const med = (fn, runs = 7) => { const ms = []; for (let i = 0; i < runs; i++) { const t = performance.now(); fn(); ms.push(performance.now() - t); } ms.sort((a, b) => a - b); return +ms[runs >> 1].toFixed(1); };
const live = db_.listCustomers(db).map((c) => c.id);
db.transaction(() => { for (let i = 15; i < 150; i++) db_.softDeleteCustomer(db, live[i * 3 % live.length]); });
const busiest = db.sqlite.exec('SELECT customer_id FROM appointments WHERE deleted_at IS NULL GROUP BY customer_id ORDER BY COUNT(*) DESC LIMIT 1')[0].values[0][0];
const show = (label) => console.log(`${label}: listTrash ${med(() => trash.listTrash(db), 5)} ms; listAppointments(id) ${med(() => ap.listAppointments(db, busiest))} ms; countCustomerRecords(id) ${med(() => db_.countCustomerRecords(db, busiest))} ms`);
show('150 KH đã xóa, không chỉ mục');
db.sqlite.run('CREATE INDEX probe_a ON appointments(customer_id)');
db.sqlite.run('CREATE INDEX probe_p ON policies(customer_id)');
db.sqlite.run('CREATE INDEX probe_ac ON appointment_coordinators(appointment_id)');
show('150 KH đã xóa, có chỉ mục customer_id');
```

#### `A\b1-exports.mjs`

```js
// Bloat B1: for every export listed in the codemap of packages/domain and packages/db, where it is
// used outside its own file (product code vs tests only vs nowhere). Index files are skipped.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
const ROOT = 'C:/workspace/Project-2C-review';
const files = [];
const SKIP = ['node_modules', 'dist', '.git', 'target', '.local', 'test-results', 'playwright-report', 'coverage'];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    if (SKIP.includes(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (/\.(ts|tsx|mjs)$/.test(name)) files.push(p);
  }
};
for (const d of ['apps', 'packages', 'tools', 'e2e']) walk(join(ROOT, d));
const text = new Map(files.map((f) => [f, readFileSync(f, 'utf8')]));
const norm = (p) => p.split(sep).join('/').split('\\').join('/');
const isTest = (f) => /\.test\.|\.spec\.|\/e2e\/|test-support|\.fixture\.|\/golden\//.test(norm(f));
const isIndex = (f) => /\/index\.ts$/.test(norm(f));
const out = [];
for (const pkg of ['domain', 'db']) {
  const md = readFileSync(join(ROOT, 'packages', pkg, 'CLAUDE.md'), 'utf8');
  for (const line of md.split('\n')) {
    const m = /^- `(src\/[^`]+)` — (.*)$/.exec(line);
    if (!m || m[2].startsWith('re-exports')) continue;
    const own = norm(join(ROOT, 'packages', pkg, m[1]));
    for (let name of m[2].split(', ')) {
      name = name.replace(/^type /, '');
      const re = new RegExp(`\\b${name}\\b`);
      const users = files.filter((f) => norm(f) !== own && !isIndex(f) && re.test(text.get(f)));
      const prod = users.filter((f) => !isTest(f));
      if (prod.length === 0) {
        out.push({ pkg, file: m[1], name, users: users.length, sample: users.slice(0, 2).map((f) => norm(relative(ROOT, f))).join(' ; ') });
      }
    }
  }
}
console.table(out);
```

#### `A\m-run.mjs`

```js
// Mutation runner (T axis): patches one file of the repo at a time, runs the given test files,
// and restores the file byte for byte in `finally` (prompt rule 1: a patch is removed right after
// the run). Prints KILLED (tests red) or SURVIVED (tests green) per mutant.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { MUTANTS } from './m-list.mjs';

const ROOT = 'C:/workspace/Project-2C-review/';
const LOG = 'C:/workspace/deep-review-1-6/claude/A/m-run.log';
const only = process.argv[2];
const hash = (text) => createHash('sha256').update(text).digest('hex').slice(0, 12);

for (const m of MUTANTS) {
  if (only && m.id !== only) continue;
  const path = ROOT + m.file;
  const original = readFileSync(path, 'utf8');
  const count = original.split(m.from).length - 1;
  if (count !== 1) {
    appendFileSync(LOG, `${m.id} SKIP: search text found ${count} times in ${m.file}\n`);
    console.log(`${m.id} SKIP (${count})`);
    continue;
  }
  let result;
  try {
    writeFileSync(path, original.replace(m.from, m.to));
    const run = spawnSync('pnpm', ['exec', 'vitest', 'run', ...m.tests], {
      cwd: ROOT,
      shell: true,
      encoding: 'utf8',
      timeout: 600_000,
    });
    const out = `${run.stdout}\n${run.stderr}`;
    const summary = (out.match(/Tests\s+.*\n/) ?? ['?'])[0].trim();
    result = `${run.status === 0 ? 'SURVIVED' : 'KILLED'} — ${summary}`;
  } finally {
    writeFileSync(path, original);
    if (hash(readFileSync(path, 'utf8')) !== hash(original)) throw new Error(`restore failed: ${m.file}`);
  }
  const line = `${m.id} [${m.file}] ${m.what}: ${result}`;
  appendFileSync(LOG, `${line}\n`);
  console.log(line);
}
```

#### `A\m-list.mjs`

```js
// Mutants for m-run.mjs: one text replacement each, with the test files that should kill it.
const DB = 'packages/db/src/';
const DOM = 'packages/domain/src/';
const t = (...files) => files;

export const MUTANTS = [
  {
    id: 'M01', file: DB + 'backup-validation.ts', what: 'rule 10 drops met / no-show appointments after today',
    from: "`SELECT 1 FROM appointments WHERE deleted_at IS NULL AND status IN ('MET', 'NO_SHOW') AND date > ${after}`,",
    to: "`SELECT 1 FROM appointments WHERE 0`,",
    tests: t(DB + 'backup-invariants.test.ts', DB + 'backup.test.ts'),
  },
  {
    id: 'M02', file: DB + 'backup-validation.ts', what: 'rule 3 drops "dates never go back"',
    from: '(next.date as string) < (previous.date as string)', to: 'false',
    tests: t(DB + 'backup-invariants.test.ts'),
  },
  {
    id: 'M03', file: DB + 'backup-validation.ts', what: 'rule 4 drops "transition day = meeting day"',
    from: '      a.stage_after === t.to_stage &&\n      a.date === t.date', to: '      a.stage_after === t.to_stage',
    tests: t(DB + 'backup-invariants.test.ts'),
  },
  {
    id: 'M04', file: DB + 'backup-validation.ts', what: 'rule 5 drops the reschedule-cycle check',
    from: 'return reached === appointments.size;', to: 'return true;',
    tests: t(DB + 'backup-invariants.test.ts'),
  },
  {
    id: 'M05', file: DB + 'backup-validation.ts', what: 'rule 7 lets 1 active + 1 conflict pass',
    from: '(active === 1 && conflict === 0) || (active === 0 && conflict >= 2)',
    to: '(active === 1 && conflict <= 1) || (active === 0 && conflict >= 2)',
    tests: t(DB + 'backup-invariants.test.ts'),
  },
  {
    id: 'M06', file: DB + 'backup-validation.ts', what: 'rule 5 drops "rescheduled from the same customer"',
    from: "return from.customer_id === a.customer_id && from.status === 'RESCHEDULED';",
    to: "return from.status === 'RESCHEDULED';",
    tests: t(DB + 'backup-invariants.test.ts'),
  },
  {
    id: 'M07', file: DB + 'customers.ts', what: 'D10 lets a transition go one day back',
    from: 'if (latest && compareDates(date, fromIsoDate(latest.date)) < 0) {',
    to: 'if (latest && compareDates(date, fromIsoDate(latest.date)) < -1) {',
    tests: t(DB + 'customers.test.ts', DB + 'appointments.test.ts', DB + 'trash.test.ts'),
  },
  {
    id: 'M08', file: DOM + 'customer-lifecycle.ts', what: 'RF also from N2',
    from: "(from === 'N4' || from === 'N3') && (to === 'N2' || to === 'N1')",
    to: "(from === 'N4' || from === 'N3' || from === 'N2') && (to === 'N2' || to === 'N1')",
    tests: t(DOM),
  },
  {
    id: 'M09', file: DOM + 'evidence-level.ts', what: 'recent boundary: exactly a year before no longer recent',
    from: 'compareDates(latest, yearBefore(analysisDate)) >= 0', to: 'compareDates(latest, yearBefore(analysisDate)) > 0',
    tests: t(DOM + 'evidence-level.test.ts'),
  },
  {
    id: 'M10', file: DB + 'appointments.ts', what: 'a no-show may be dated after today',
    from: "const held = status === 'MET' || status === 'NO_SHOW';", to: "const held = status === 'MET';",
    tests: t(DB + 'appointments.test.ts', DB + 'trash.test.ts'),
  },
  {
    id: 'M11', file: DOM + 'appointment-counts.ts', what: "today's scheduled appointment counts as unrecorded",
    from: "return compareDates(appointment.date, today) < 0 ? 'unrecorded' : 'planned';",
    to: "return compareDates(appointment.date, today) <= 0 ? 'unrecorded' : 'planned';",
    tests: t(DOM),
  },
  {
    id: 'M12', file: DOM + 'period.ts', what: 'next-year suggestion from exactly 60 days',
    from: 'toDayNumber(today) - toDayNumber(date) > NEXT_YEAR_SUGGESTION_DAYS;',
    to: 'toDayNumber(today) - toDayNumber(date) >= NEXT_YEAR_SUGGESTION_DAYS;',
    tests: t(DOM + 'period.test.ts'),
  },
  {
    id: 'M13', file: DOM + 'period.ts', what: 'custom range cap one day longer',
    from: ': toDayNumber({ year, month, day: start.day }) - 1;', to: ': toDayNumber({ year, month, day: start.day });',
    tests: t(DOM + 'period.test.ts'),
  },
  {
    id: 'M14', file: DB + 'customers.ts', what: "withdraw no longer requires the customer's latest (D7)",
    from: 'if (latestTransition(db, caused.customerId)?.id !== caused.id) {', to: 'if (false) {',
    tests: t(DB + 'appointments.test.ts', DB + 'trash.test.ts', DB + 'customers.test.ts'),
  },
  {
    id: 'M15', file: DB + 'counts.ts', what: 'rf counts every move of a met appointment',
    from: 'isRfTransition(from as CustomerStage | null, to as CustomerStage),', to: 'true,',
    tests: t(DB + 'counts.test.ts', DB + 'trash.test.ts'),
  },
  {
    id: 'M16', file: DB + 'trash.ts', what: 'oldest deletion first',
    from: 'a.deletedAt < b.deletedAt ? 1 : -1,', to: 'a.deletedAt < b.deletedAt ? -1 : 1,',
    tests: t(DB + 'trash.test.ts'),
  },
  {
    id: 'M17', file: DB + 'ai-analyses.ts', what: 'raw output kept one character longer',
    from: '.slice(0, MAX_AI_RAW_OUTPUT)', to: '.slice(0, MAX_AI_RAW_OUTPUT + 1)',
    tests: t(DB + 'ai-analyses.test.ts'),
  },
  {
    id: 'M18', file: DOM + 'compare.ts', what: 'year in progress compared up to the day after',
    from: '? sameDayYearBefore(today)', to: '? addDays(sameDayYearBefore(today), 1)',
    tests: t(DOM + 'compare.test.ts'),
  },
  {
    id: 'M19', file: DOM + 'stage-snapshot.ts', what: 'series never takes a customer out of a stage',
    from: 'if (after) after[transition.to] -= 1;', to: '',
    tests: t(DOM + 'stage-snapshot.test.ts'),
  },
  {
    id: 'M20', file: DOM + 'money.ts', what: '"1tr5" read as 1 005 000',
    from: "return tail.length === 1 ? `${tail}00` : tail.padStart(3, '0');", to: "return tail.padStart(3, '0');",
    tests: t(DOM + 'money.test.ts'),
  },
  {
    id: 'M21', file: DOM + 'money.ts', what: 'compact: 999,995 tr no longer shows 1 tỷ',
    from: 'magnitude >= BILLION || millionHundredths >= 1000 * 100', to: 'magnitude >= BILLION',
    tests: t(DOM + 'money.test.ts'),
  },
  {
    id: 'M22', file: DB + 'backup.ts', what: 'import takes a text with a NUL',
    from: "typeof value === 'string' && !value.includes('\\0')", to: "typeof value === 'string'",
    tests: t(DB + 'backup.test.ts', DB + 'backup-invariants.test.ts'),
  },
  {
    id: 'M23', file: DB + 'backup-validation.ts', what: 'rule 10 drops KYC notes after today',
    from: '`SELECT 1 FROM kyc_notes WHERE created_date > ${after}`,', to: '`SELECT 1 FROM kyc_notes WHERE 0`,',
    tests: t(DB + 'backup-invariants.test.ts'),
  },
  {
    id: 'M24', file: DB + 'customers.ts', what: 'restore customer without checking its RE',
    from: 'export function checkRestoreCustomer(db: Database, row: CustomerRow): void {\n  requireRe(db, row.reId);',
    to: 'export function checkRestoreCustomer(db: Database, row: CustomerRow): void {\n  void [db, row];',
    tests: t(DB + 'customers.test.ts', DB + 'trash.test.ts'),
  },
  {
    id: 'M25', file: DB + 'policies.ts', what: 'issued before submitted left to the CHECK',
    from: 'if (issuedDate !== null && compareDates(issuedDate, policy.submittedDate) < 0) {', to: 'if (false) {',
    tests: t(DB + 'policies.test.ts', DB + 'trash.test.ts'),
  },
  {
    id: 'M26', file: DB + 'team.ts', what: 'a live reviewer may become an RE',
    from: "if (reviewsLiveAppointment(db, id)) throw new DbError('REVIEWER_IN_USE');", to: '',
    tests: t(DB + 'team.test.ts'),
  },
  {
    // M26 run again with the file that holds the REVIEWER_IN_USE tests (appointments.test.ts:411, :423).
    id: 'M26b', file: DB + 'team.ts', what: 'a live reviewer may become an RE (with appointments.test.ts)',
    from: "if (reviewsLiveAppointment(db, id)) throw new DbError('REVIEWER_IN_USE');", to: '',
    tests: t(DB + 'team.test.ts', DB + 'appointments.test.ts'),
  },
  {
    id: 'M27', file: DB + 'kyc.ts', what: 'resolving birth year / gender to any SYSTEM fact',
    from: "chosen.value !== profileFactValue(chosen.field as 'birthYear' | 'gender', customer))", to: 'false)',
    tests: t(DB + 'kyc.test.ts'),
  },
  {
    id: 'M28', file: DB + 'database.ts', what: 'nested transaction keeps its writes on error',
    from: "sqlite.exec(nested ? 'ROLLBACK TO nested; RELEASE nested' : 'ROLLBACK');",
    to: "sqlite.exec(nested ? 'RELEASE nested' : 'ROLLBACK');",
    tests: t(DB + 'database.test.ts', DB + 'kyc.test.ts', DB + 'appointments.test.ts'),
  },
  {
    id: 'M29', file: DB + 'ai-analyses.ts', what: 'reminder since: every later version, not only material ones',
    from: '.filter((v) => v.material === material)', to: '',
    tests: t(DB + 'ai-analyses.test.ts'),
  },
  {
    id: 'M30', file: DOM + 'stats.ts', what: 'marks may touch (same day end/start)',
    from: 'daysBetween(previous.end, mark.start) <= 0)', to: 'daysBetween(previous.end, mark.start) < 0)',
    tests: t(DOM),
  },
  {
    id: 'M31', file: DOM + 'kyc.ts', what: 'hash ignores status (conflict entering does not change it)',
    from: 'JSON.stringify([fact.field, fact.value, fact.status])', to: 'JSON.stringify([fact.field, fact.value])',
    tests: t(DOM + 'kyc.test.ts', DB + 'kyc.test.ts'),
  },
  {
    id: 'M32', file: DB + 'appointments.ts', what: 'restore of a met appointment does not re-apply its stage',
    from: '    updateAppointmentRow(db, id, { deletedAt: null });\n    applyOutcome(db, row);',
    to: '    updateAppointmentRow(db, id, { deletedAt: null });',
    tests: t(DB + 'appointments.test.ts', DB + 'trash.test.ts'),
  },
  {
    id: 'M33', file: DB + 'backup-validation.ts', what: 'rule 8 drops "profile birth year / gender has its fact"',
    from: '  if (missing) return 8;\n', to: '',
    tests: t(DB + 'backup-invariants.test.ts'),
  },
  {
    id: 'M34', file: DB + 'common.ts', what: 'fee cap off by one đồng',
    from: 'value > 0 && value <= MAX_FEE_VND', to: 'value > 0 && value <= MAX_FEE_VND + 1',
    tests: t(DB + 'policies.test.ts', DB + 'appointments.test.ts', DB + 'backup-invariants.test.ts', DB + 'common.test.ts'),
  },
];
```

#### `A\m-table.mjs`

```js
// Prints the mutation table of A.md from m-list.mjs and m-run.log.
import { readFileSync } from 'node:fs';
import { MUTANTS } from './m-list.mjs';
const log = readFileSync('C:/workspace/deep-review-1-6/claude/A/m-run.log', 'utf8').split('\n');
const TICK = String.fromCharCode(96);
const esc = (s) => s.replaceAll('|', '\\|').replaceAll('\n', '⏎');
const code = (s) => (s.includes(TICK) ? `${TICK}${TICK} ${s} ${TICK}${TICK}` : `${TICK}${s}${TICK}`);
console.log('| # | File | Đột biến | Thay từ → thành | Test chạy | Kết quả |');
console.log('|---|---|---|---|---|---|');
for (const m of MUTANTS) {
  const line = log.find((l) => l.startsWith(m.id + ' '));
  const result = esc(line ? line.slice(line.indexOf(': ', line.indexOf(']')) + 2) : 'chưa chạy');
  const tests = m.tests.map((t) => t.replace('packages/', '').replace('/src/', '/')).join(', ');
  const to = m.to ? code(esc(m.to)) : '(xóa)';
  console.log(`| ${m.id} | ${code(m.file.replace('packages/', ''))} | ${m.what} | ${code(esc(m.from))} → ${to} | ${tests} | ${result} |`);
}
```

### 7.4 Cuối phiên

- `git rev-parse HEAD` cuối phiên: `885534549808f42aec7f9af5743bbf86642ee4bd` (không đổi).
- `git status --short` cuối phiên (10:08): (rỗng) — như đầu phiên. Mọi bản vá đột biến đã trả lại nguyên byte (kiểm hash trong `m-run.mjs`).
- Không chạy `pnpm e2e`, không đo trên exe, không gọi dịch vụ AI, không đọc thư mục của bên khác.
- Giờ xong: 2026-10-14 10:08.
