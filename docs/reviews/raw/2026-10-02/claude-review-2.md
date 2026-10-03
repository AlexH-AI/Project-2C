# Deep review đóng Phase 3 lần 2 (Phase 1→3) — Claude

- **Issue:** #72 T-053 (trước cổng G7) · **Ngày:** 2026-10-02 · **Reviewer:** Claude Code (Opus 5.5, phiên sạch, không subagent, không dùng `review-pr` / `code-review`)
- **SHA snapshot:** `5eb7c035e35c8e40539b1221a6f7d35f7606ebb0` (`main` 02/10/2026, sau PR #247)
- **Worktree:** `C:\workspace\Project-2C-review-2`, detached HEAD đúng SHA trên. Yêu cầu ghi `Project-2C-review`, nhưng phiên này được mở ở `-review-2` (theo CLAUDE.md, worktree thứ hai cho review song song); cả hai worktree đều đứng ở `5eb7c03`, không checkout SHA khác.
- **So với lần trước:** `git diff 0fa0eea..5eb7c03`: 30 commit, 78 file, +4393 / −380 (code không tính `docs/`: 63 file, +2627 / −256). Không đổi `apps/desktop/src-tauri/**`, `packages/db/migrations/**`, `packages/domain/src/golden/**`.
- **Nguồn đối chiếu trước khi ghi NEW:** `docs/reviews/2026-09-30-phase-1-3-tong-hop.md` (F-01…F-19), `review-reports/2026-09-30-claude-phase-1-3-review.md` (A-001…, B-001…), sổ OPEN / RESOLVED / ACCEPTED trong `docs/state/HANDOFF.md`. Không mở `astra-reports\` hay `Project-2C-astra`.

## 1. Kết luận

**SẴN SÀNG cho G7 về mặt code**: không có phát hiện Critical / High / Medium; không có gì chặn G7.

Trước khi Owner bấm G7 vẫn còn các việc thủ tục mà #72 đã ghi sẵn:
- cập nhật tài liệu trạng thái (CL-006, chỉ là docs);
- Owner kiểm tay exe bản sau gói B (B6 merge 02/10, T-093/T-094 merge sau đó);
- gộp với báo cáo Codex.

Phần đã kiểm:
- **Đợt 1** (#202–#204, #210): F-01…F-04 đã sửa đúng hướng báo cáo tổng hợp.
  - Validator đọc thuần trên DB staging, sau `load` + `migrate`.
  - Cap 100 MB cả ở UI lẫn API.
  - `current` / `opening` thay `generation`: mở DB lỗi không làm DB cũ ngừng lưu.
  - ErrorBoundary theo màn; `CloseGuard` nằm ngoài boundary.
- **Gói A + B** (#214–#228): khớp spec Issue, mockup G3 và quyết định Owner. Đã đối chiếu từng ý trong bảng 16 ý của HANDOFF.
- **T-093 / T-094** (đồng hồ DB): đúng.
  - Exe dùng `now = clock`, đọc đồng hồ một lần.
  - e2e ghim ngày bằng `setFullYear` trên bản sao.

Phát hiện mới đều ở mức Low / Nit:
- nhập backup chưa kiểm các quy tắc nhân sự (≤ 1 TL / team, bản ghi sống trỏ người / team đã xóa) — CL-001, đã tái hiện;
- số đếm > 999 không qua `formatCount` — CL-002;
- cảnh báo ESLint — CL-004;
- tài liệu trạng thái lệch — CL-006.

| Severity | NEW | KNOWN | Tổng |
|---|---|---|---|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 |
| Low | 2 (CL-001, CL-002) | 3 (CL-003 ← F-15, CL-005 ← F-05/T-d, CL-006 ← F-10 một phần) | 5 |
| Nit | 1 (CL-004) | 0 | 1 |

CL-006 có cả phần NEW (HANDOFF / STATE lệch sau 01/10) lẫn KNOWN (`phase-3.md` đã có trong bước 3 HANDOFF). Bảng đếm xếp nó vào KNOWN vì nhóm việc này #72 đã dự kiến.

## 2. Bằng chứng đã chạy

Máy: Home PC (`DESKTOP-KDURKJP`), 02/10/2026 ~20:45–21:00. Phiên Codex có thể chạy song song trên cùng máy, nên số đo thời gian chịu tải.

| Lệnh | Kết quả | Thời gian | Ghi chú |
|---|---|---|---|
| `git rev-parse HEAD` / `git status --short` | `5eb7c035…` / sạch | — | |
| `pnpm verify` | ✅ exit 0 | 74 s | - Prettier sạch. - ESLint 0 lỗi, **1 cảnh báo** (CL-004). - `depcruise` 0 vi phạm (179 module, 680 phụ thuộc). - `lint:tokens` sạch. - typecheck sạch. - Vitest **47 file / 782 test** xanh (49,6 s). - Coverage domain + db: **99,49 / 98,41 / 100 / 99,78**; `db/src` 99,33 / 97,82 / 100 / 99,71; `backup-validation.ts` 100 / 99,02 / 100 / 100; domain 100% (ẩn vì phủ đủ) |
| `pnpm verify:rust` | ✅ exit 0 | 57 s | `cargo fmt --check`, `clippy -D warnings`, **36/36** test. Rust không đổi từ lần review trước |
| `$env:CI='1'; pnpm e2e` (PowerShell) | ✅ exit 0 | 195 s (3,2 phút chạy test) | - **113 passed + 1 flaky / 114**; `seed-timing` 5,2 s pass. - Test flaky: `customer-forms.spec.ts:136` — `beforeEach` (`:30`) chờ "KH đang mở" quá 15 s; ảnh lỗi cho thấy trang đã nạp xong ngay sau đó, retry #1 pass trong 14,9 s → chập chờn do tải (CL-005, KNOWN T-d). - Cổng 4173 trống lúc chạy, không phải chờ |
| Test tái hiện tạm `packages/db/src/review2.repro.test.ts` | ✅ 4/4 | 2,1 s (+17,9 s ca seed) | Nội dung ở §5; **đã xóa** trước khi kết thúc |
| CI `main` | ✅ | — | Run `37010438107` (push `5eb7c03`, build exe) success; 3 run trước (`3242c82`, `ea7425d`, `0eaf0c4`) success |
| Quy trình P-1 (mẫu 7 PR: #234, #236, #239, #240, #244, #246, #247) | ✅ 7/7 | — | SHA trong `REVIEW: PASS` cuối = `headRefOid` lúc merge |

Fixture golden: `git log -- packages/domain/src/golden/` chỉ có `06661fc` (#34) và `5e82d85` (#35), Phase 2, **không sửa**. `golden-metrics.test.ts` / `golden-kyc.test.ts` chỉ thêm test round-trip backup (G01–G22, K01–K15 nhập lại qua validator, giữ nguyên bảng).

## 3. Phát hiện

### CL-001 — Nhập backup chưa kiểm quy tắc nhân sự: 2 TL / team, bản ghi sống trỏ RE hoặc team đã xóa — Low · NEW · REPRODUCED

- **Vị trí (SHA `5eb7c03`):**
  - `packages/db/src/backup-validation.ts:102-113`: bộ luật 1–8, không có luật về team / nhân sự.
  - `:175-193` (`ownerRule`): chỉ kiểm `p.role <> 'RE'`, không kiểm `p.deleted_at`.
  - `docs/design/phase-3-du-lieu.md:219-226`: §6 chỉ có 8 bất biến. Quy tắc "mỗi team tối đa 1 TL chưa xóa" do #223 thêm ở §4 (`:175`), chưa vào §6.
  - Hậu quả ở UI / lệnh:
    - `apps/desktop/src/routes/team/team-view.ts:37-39`: `lead: leads[0]`, TL thứ hai không hiện ở đâu;
    - `packages/db/src/team.ts:250-251, 257-271`: `assertNoOtherLead` chặn mọi lần sửa TL đang hiện;
    - `team-view.ts` `shared` chỉ lấy `teamId === null`, nên người của team đã xóa cũng không hiện.
- **Tái hiện (đều nhập thành công, không `BACKUP_INVALID`):**
  1. Thêm một dòng `people` vai trò TL cùng team với TL sẵn có → nhập được, `listPeople` có 2 TL. Sau đó `updatePerson(tl, { name })` ném **`TEAM_HAS_LEAD`**. Trên UI: đổi tên TL đang hiện báo "Team này đã có TL: <tên TL bị ẩn>", mà TL đó không có trên màn Team.
  2. Đặt `deleted_at` cho RE có KH sống → nhập được. KH vẫn trong `listCustomers`, còn RE không có trong `listPeople`: thẻ KH mất tên RE, KH rơi khỏi mọi góc nhìn Team, ô "RE phụ trách" trong hộp sửa không có giá trị hợp lệ.
  3. Đặt `deleted_at` cho team còn RE / TL sống → nhập được. 3 người của team không hiện trên màn Team (không thuộc team nào đang có, cũng không thuộc "Người hỗ trợ"), không có góc nhìn Team nào chứa họ.
- **Lệnh nghiệp vụ không tạo được các trạng thái này:**
  - `PERSON_IN_USE` chặn xóa RE còn bản ghi sống;
  - `TEAM_HAS_MEMBERS` chặn xóa team còn người;
  - `TEAM_HAS_LEAD` chặn TL thứ hai.

  Vì vậy chỉ file sửa tay / file từ app khác mới đưa vào được, cộng thêm DB thật tạo **trước #223** (01/10) có thể đã có 2 TL — `team-view.ts` cũng ghi "first by name if old data has several".
- **Liên quan KNOWN:** sổ OPEN "Team & nhân sự (#231)": IS/BD/BDM có `team_id` ≠ null không hiện ở đâu. Cùng lớp "người tồn tại nhưng không màn nào thấy"; CL-001 mở rộng lớp đó sang đường nhập.
- **Mức:** Low. Không ném lỗi render, không mất dữ liệu, DB hiện tại không bị đụng khi từ chối, người dùng tự chọn file. Nhưng Phase 6 dùng lại validator này cho snapshot kéo về (spec §6), nên nên đóng trước S-1.
- **Hướng sửa:**
  - Thêm luật 9 "nhân sự" vào `validateBackupInvariants` và spec §6:
    - (a) mỗi team chưa xóa có ≤ 1 TL chưa xóa;
    - (b) người chưa xóa có `team_id` → team chưa xóa;
    - (c) `re_id` của KH / lịch / HĐ chưa xóa → người **chưa xóa** vai trò RE (gộp vào luật 5);
    - (d) cân nhắc: người phối hợp / người đánh giá của lịch chưa xóa → người tồn tại (cho phép đã xóa nếu lệnh cho phép).
  - **Owner chốt** cách xử lý DB cũ có 2 TL: từ chối khi nhập, hay nhận rồi để màn Team hiện đủ TL để người dùng sửa. Nếu chọn cách sau thì (a) không vào validator, mà `groupByTeam` phải hiện mọi TL.
- **Đề xuất xếp:** Phase 4 Đợt 2 (cùng T-h hoặc task riêng `risk:med` đụng `packages/db`), trước S-1. Không chặn G7.

### CL-002 — Số đếm lớn hơn 999 hiện không qua `formatCount`: cùng màn kỳ Năm có "4528 lịch" cạnh "1.234 lịch" — Low · NEW · CONFIRMED

- **Vị trí:**
  - `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:123-126` (`appointments.summary` với `total: inPeriod.length`), `:369` (tóm tắt lịch tháng);
  - `apps/desktop/src/routes/customers/CustomersScreen.tsx:114` (`customers.summary`);
  - `apps/desktop/src/shell/RePicker.tsx:139, 183` (số cạnh "Cả team" / RE).

  Trong khi đó `YearGrid.tsx:58, 99, 109, 131, 141` và `SettingsDataFile.tsx:12-16` dùng `formatCount`.
- **Quy tắc:** CLAUDE.md "Tiền, ngày, chỉ số: chỉ dùng hàm chuẩn trong `packages/domain`"; `formatCount` (`domain/number.ts:7`) nhóm hàng nghìn kiểu vi-VN.
- **Bằng chứng:** seed e2e (ngày neo 15/09/2026, seed 1) có **4 528** lịch trong năm 2026 (đo bằng test tạm). Ở kỳ Năm, dòng "đang xem" hiện `4528 lịch · … đã gặp` (chuỗi thô qua `t()`, `i18n/index.ts:11` chỉ `String(value)`), còn tổng quý của `YearGrid` hiện dạng `1.xxx lịch`. Ở góc nhìn Toàn bộ, kỳ Năm luôn > 999. KH đang mở hiện là 884 (ảnh e2e), nên `customers.summary` chưa lộ ra nhưng sẽ lộ khi dữ liệu thật vượt 1 000.
- **Ghi chú:** chuỗi tóm tắt có từ #155 (Phase 3), nhưng kỳ Năm của B6 (#247) làm lệch thành thấy được trên cùng một màn. Không có trong sổ.
- **Hướng sửa:** mọi `{count}` / `{total}` / `{open}` / `{closed}` / `{met}` truyền vào `t()` qua `formatCount`. Có thể thêm test grep, hoặc helper `tCount`, để không quay lại.
- **Đề xuất xếp:** T-h (Phase 4 Đợt 2), hoặc sổ OPEN. Không chặn G7.

### CL-003 — Ký tự phân cách `·` / `→` viết cứng tiếp tục tăng sau F-15 — Low · KNOWN (F-15, T-h) · CONFIRMED

- **Chỗ mới từ sau báo cáo 30/09:**
  - `AppointmentsScreen.tsx:242` (`</b> · {summary}`), `:245` (template `` `${…} · ${summary}` ``), `:494` (`→` của ngày tháng khác, #239);
  - `CustomersScreen.tsx:141, 144` (#234).
- Các chỗ cũ vẫn còn, ví dụ `AppointmentDialog.tsx:428`, `MetFields.tsx:157`, `AppointmentsScreen.tsx:615`.
- **Hướng sửa:** như F-15 (`joinParts()` + `t('sep.*')`). Thêm luật chặn trong `lint:tokens` hoặc một test grep, để task mới không thêm nữa.
- **Đề xuất xếp:** T-h (đã có).

### CL-004 — `pnpm verify` xanh với 1 cảnh báo ESLint `react-hooks/exhaustive-deps` — Nit · NEW · CONFIRMED

- **Vị trí:** `apps/desktop/src/routes/appointments/AppointmentsScreen.tsx:188-189` (#240, `0eaf0c4`): `useMemo` của cột dùng `today` nhưng deps là `[today.year, today.month, today.day]`.
- **Hành vi:** đúng (closure giữ `today` của lần render có cùng ngày), và comment đã giải thích. Nhưng ESLint không cấu hình `--max-warnings 0`, nên cảnh báo tích lại mà CI không báo. #247 làm cùng việc ở `:116-121` bằng cách tách `thisYear` / `thisMonth` và không bị cảnh báo.
- **Hướng sửa:** dựng `today` trong memo từ ba trường (như `:116-121`), hoặc `eslint-disable-next-line` kèm lý do. Cân nhắc `eslint --max-warnings 0` trong `pnpm lint`.
- **Đề xuất xếp:** sổ OPEN (gộp lần chạm sau `AppointmentsScreen.tsx`).

### CL-005 — e2e local dưới `CI=1` vẫn chập chờn khi máy tải nặng — Low · KNOWN (F-05 / T-d) · REPRODUCED

- **Vị trí:** `e2e/customer-forms.spec.ts:28-31` (`beforeEach` chờ seed với `expect.timeout` 15 s), `playwright.config.ts` (`fullyParallel`, worker mặc định).
- **Lần này:** 1/114 flaky (`customer-forms.spec.ts:136`), pass ở retry. Lần đo trước trong HANDOFF: 95/95 xanh (`abdff20`). Có thể có phiên Codex chạy song song.
- **Đề xuất xếp:** T-d (việc đầu tiên của Phase 4, đã có).

### CL-006 — Tài liệu trạng thái lệch `main` sau 01/10 — Low · KNOWN một phần (F-10, bước 3 HANDOFF) + NEW · CONFIRMED

| Chỗ | Lệch | Thực tế ở `5eb7c03` |
|---|---|---|
| `docs/state/HANDOFF.md:5-6, 10, 20, 142` | "`main` `0eaf0c4`", "làm tiếp #228 B6", B6 còn mở | B6 đã merge (PR #247, `5eb7c03`); T-093 #243 (PR #244) và T-094 #245 (PR #246) không có trong HANDOFF |
| Sổ P-3 (HANDOFF) | Không có ghi chú không chặn của #244 / #246 / #247 | #247 có 3 ghi chú + 1 mùi code: - regex miễn trừ `style={{ flex: … }}` ở `token-guard.ts:26` nhận cả hằng số; - doc comment dài ở `token-guard.ts:3`; - thứ tự import `FOCUS`; - `CARD` lặp ở `YearGrid.tsx:5` / `AppointmentsScreen.tsx` |
| `docs/PROJECT-STATE.md:5, 64` | "43 issues from #57 to #210"; mục cuối 01/10 "Next: #223 T-086…" | Milestone đã có #214–#228, #237, #243, #245; gói B xong |
| `docs/metrics/phase-3.md:5-6` | "43 Issue (#57 → #210)… **Đóng milestone:** 2026-09-30 (G7)" | KNOWN: HANDOFF bước 3 đã ghi phải sửa ngày G7 và số Issue |
| `docs/design/phase-3-du-lieu.md:218-226` | §6 không nhắc quy tắc 1 TL / team | Xem CL-001 |

- **Đề xuất xếp:** #72 (docs-only, trước khi Owner bấm G7).

### Đã kiểm, không thành phát hiện

- **`current` / `opening`** (`app-data.ts:174-201`):
  - mở lỗi → `current` giữ DB cũ, DB cũ vẫn lưu;
  - trong lúc mở, cả hai DB cùng lưu, và bản cuối luôn là bytes mới (`openFrom` persist sau khi mở, hàng đợi gộp);
  - sau khi thay xong, DB cũ không lưu nữa.

  Ghi chú "`mine >= current`" đã có trong sổ OPEN.
- **Validator §6:**
  - luật 1–8 khớp spec từng dòng;
  - `valueOf` ép kiểu integer / text khi nạp (chuỗi trong cột FYP không lọt qua CHECK `> 0`);
  - cột `time` / ngày / timestamp / `seq` / `value_json` đều kiểm;
  - lịch MET không có transition là hợp lệ, vì `applyOutcome` chỉ tạo transition khi nhóm đổi (`appointments.ts:329-334`), nên không cần luật ngược của luật 4;
  - KYC luật 7 khớp mọi đường lệnh (`confirm` / `markConflict` / `resolve`).
- **Đồng hồ DB:** exe `now = clock` (một lần đọc). Bản ghim ngày dùng `setFullYear(y, m, d)` một lần trên bản sao, nên không tràn ngày 31. `Overview.tsx:9` vẫn đọc đồng hồ máy (KNOWN R4).
- **B2 / B3:**
  - đổi kiểu góc nhìn hoặc đổi team → bỏ RE (`chooseKind`, `ScopePicker.tsx:43`);
  - RE bị xóa / đổi team → coi như chưa chọn (`narrowScope`);
  - Lịch hẹn lọc theo `re_id`, không tính người phối hợp;
  - số cạnh RE theo kỳ + bộ lọc người phối hợp;
  - "lịch vừa tạo ngoài góc nhìn" dùng góc nhìn đã thu hẹp.
- **B4:** ngày trong kỳ nhưng thuộc tháng khác vẫn bấm được, kỳ giữ nguyên, lịch theo `day`; ô hôm nay có `aria-current="date"`; số ngày qua `formatDayOfMonth` / `formatDayMonth`.
- **B6:** khớp hợp đồng #228 — 12 ô, 4 quý + tổng quý, ẩn "Trong ngày", bấm ô → kỳ Tháng (ngày = hôm nay hoặc ngày 1), năm đã qua không có tháng hiện tại. Số trong lưới qua `formatCount`.
- **i18n:** chuỗi mới đều qua `vi.ts`; `TEAM_HAS_LEAD` truyền `params` (`PersonDialogs.tsx:50-52`).
- **Ranh giới module:** 0 vi phạm.
- **Lớp Rust:** không đổi; 36 test xanh.

## 4. Giới hạn / việc không làm được

- **Không chạy exe thật:** Tauri, Explorer, hai process, khóa file, đóng app lúc đang lưu. Lớp Rust chỉ có `cargo test` + đọc lại (không đổi từ `0fa0eea`).
- **Không mở preview trình duyệt** (không tạo `.claude/launch.json` trong worktree chỉ đọc). Hậu quả UI ở CL-001 (TL ẩn, KH mất tên RE) và CL-002 (chuỗi "4528 lịch") suy ra từ code + số đo DB, chưa nhìn trên màn. Ảnh e2e flaky xác nhận màn Khách hàng hiển thị bình thường.
- **Chưa so mockup G3 ở mức pixel / tương phản** cho B1–B6 (chỉ so cấu trúc, token và text với Issue + mockup mô tả). Tương phản viền ô nhập < 3:1 là ghi chú R4 Owner đang cân nhắc, không đo lại.
- **Mẫu quy trình:** chỉ 7 PR gần nhất. Không kiểm cỡ PR (P-2) cho toàn bộ gói A / B.
- **Số đo thời gian chịu tải** của phiên Codex chạy song song (nếu có); không chạy lại `pnpm e2e` lần hai.
- **Code Phase 1→3 không đổi từ lần review trước** chỉ được kiểm lại theo rủi ro: lưu / backup / nhập / thay DB / đồng hồ / validator. Không đọc lại toàn bộ.

## 5. Phụ lục — test tái hiện (đã xóa khỏi worktree)

File `packages/db/src/review2.repro.test.ts`, chạy bằng `pnpm exec vitest run packages/db/src/review2.repro.test.ts` → 4/4 pass (ca 2026: in `appointments in 2026: 4528`).

```ts
// Temporary repro for the phase-close review 2 (CL-0xx). Deleted before the session ends.
import { calendarDate } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { exportBackup, importBackup } from './backup';
import { createCustomer, listCustomers } from './customers';
import { DbError } from './errors';
import { listPeople, listTeams, updatePerson } from './team';
import { setup } from './test-support';

type Row = Record<string, unknown>;
const tablesOf = (text: string) => (JSON.parse(text) as { tables: Record<string, Row[]> }).tables;
const withTables = (text: string, tables: Record<string, Row[]>) =>
  JSON.stringify({ ...(JSON.parse(text) as object), tables });

describe('review 2 repro', () => {
  it('imports a team with two live TLs; renaming the shown TL then fails TEAM_HAS_LEAD', async () => {
    const { db, tl } = await setup();
    const text = exportBackup(db);
    const tables = tablesOf(text);
    const original = tables.people!.find((p) => p.id === tl.id)!;
    tables.people!.push({ ...original, id: `${tl.id}X`, name: 'Ánh' });
    const imported = await importBackup(withTables(text, tables));
    const tls = listPeople(imported.db).filter((p) => p.role === 'TL');
    expect(tls).toHaveLength(2);
    let code: string | undefined;
    try {
      updatePerson(imported.db, tls[0]!.id, { name: 'Ánh Mới' });
    } catch (error) {
      code = error instanceof DbError ? error.code : String(error);
    }
    expect(code).toBe('TEAM_HAS_LEAD');
  });

  it('imports a live customer whose RE is soft-deleted', async () => {
    const { db, re } = await setup();
    createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N4', date: calendarDate(2026, 9, 1) });
    const text = exportBackup(db);
    const tables = tablesOf(text);
    tables.people!.find((p) => p.id === re.id)!.deleted_at = '2026-09-26T09:00:00.000Z';
    const imported = await importBackup(withTables(text, tables));
    expect(listCustomers(imported.db)).toHaveLength(1);
    expect(listPeople(imported.db).some((p) => p.id === re.id)).toBe(false);
  });

  it('imports live RE and TL of a soft-deleted team', async () => {
    const { db, team } = await setup();
    const text = exportBackup(db);
    const tables = tablesOf(text);
    tables.teams!.find((t) => t.id === team.id)!.deleted_at = '2026-09-26T09:00:00.000Z';
    const imported = await importBackup(withTables(text, tables));
    expect(listTeams(imported.db)).toHaveLength(0);
    expect(listPeople(imported.db).filter((p) => p.teamId === team.id)).toHaveLength(3);
  });
});

import { listAppointments } from './appointments';
import { openDatabase } from './database';
import { seedDemoData } from './seed';

describe('review 2 repro: counts over 999 on the year period', () => {
  it('counts the 2026 appointments of the e2e seed', async () => {
    const db = await openDatabase({ now: () => new Date(Date.UTC(2026, 8, 15, 3)) });
    seedDemoData(db, { anchorDate: calendarDate(2026, 9, 15), seed: 1 });
    const year = listAppointments(db).filter((a) => a.date.year === 2026).length;
    console.log('appointments in 2026:', year);
    expect(year).toBeGreaterThan(999);
  }, 120_000);
});
```

## 6. Cuối phiên

`git status --short` ở `C:\workspace\Project-2C-review-2` sau khi xóa file tái hiện: **sạch** (xem lệnh cuối phiên). `test-results/`, `playwright-report/` do e2e sinh ra nằm trong `.gitignore`.
