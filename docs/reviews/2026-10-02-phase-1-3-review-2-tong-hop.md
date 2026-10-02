# Tổng hợp review đóng Phase 3 lần 2 (Phase 1→3) — Claude và Codex Sol

> **Bản lưu trong repo** (#72, chép nguyên văn từ `C:\workspace\review-reports\2026-10-02\so-sanh-claude-sol.md` trên máy `DESKTOP-KDURKJP`). Hai báo cáo nguồn và các test tái hiện tạm không lưu vào repo; đường dẫn `review-reports/…`, `astra-reports/…` bên dưới là thư mục ngoài repo.
>
> **Sau review:** Owner chọn sửa R2-01 sau G7 (T-j, task dữ liệu đầu tiên của Phase 4, ngay sau T-d) và bỏ T-k (gộp vào T-j, xem §5). Các mục §5 "Trước G7" làm trong PR đóng Phase 3 của #72. Lần review trước: `docs/reviews/2026-09-30-phase-1-3-tong-hop.md` (F-01…F-19).

- **Ngày:** 2026-10-02 · **SHA:** `5eb7c03`
- **Hai báo cáo nguồn:**
  - Claude: `review-reports/2026-10-02/claude-phase-1-3-review-2.md` (CL-001…CL-006)
  - Codex Sol 6.1: `astra-reports/2026-10-02/codex-phase-1-3-review-2.md` (C-001…C-009)
- **Kiểm lại:** các ca chỉ Sol có đã được Claude tái hiện bằng test tạm `packages/db/src/sol-check.repro.test.ts`: 4/4 pass, đã xóa. Nội dung test ở §6.
- **Owner (chat 02/10):** đã kiểm tay exe bản cuối, không có vấn đề. Mục giới hạn "chưa chạy exe" của cả hai báo cáo nay đã được đáp ứng.

## 1. Kết luận chung

**Không có Critical / High.** Hai bên khác nhau ở kết luận:
- Claude: SẴN SÀNG.
- Sol: CHƯA SẴN SÀNG, vì C-001 và vì chưa kiểm exe.

Sau khi Owner đã kiểm exe và Claude đã tái hiện C-001, kết luận hợp nhất: **đóng G7 được, nếu Owner chấp nhận xếp C-001 vào Phase 4 Đợt 2 làm task dữ liệu đầu tiên**. Phương án khác là sửa trước G7 (một task `risk:high`, cỡ khoảng 120 dòng sản phẩm).

Lý do C-001 không chặn:
- mọi ca đều cần file `.p2cbackup` sửa tay, lệnh nghiệp vụ không tạo ra được;
- không mất dữ liệu;
- DB hiện tại không đổi khi nhập bị từ chối;
- ca xóa lịch được rollback.

Lý do không nên để lâu: Phase 6 dùng lại chính bộ kiểm này cho snapshot kéo về.

## 2. Giống nhau

| Chủ đề | Claude | Sol | Ghi chú |
|---|---|---|---|
| Đợt 1 (F-01…F-04) đã sửa đúng hướng; ErrorBoundary, `current`/`opening`, giới hạn 100 MB | §3 "đã kiểm" | §3.10 | |
| Gói A / B và B6 khớp spec, mockup, 16 ý Owner | ✅ | ✅ | |
| Đồng hồ DB (#243 / #245) đúng | ✅ | ✅ | |
| Golden G01–G22, K01–K15 không sửa, round-trip backup xanh | ✅ | ✅ | |
| Nhập backup nhận KH sống thuộc RE đã xóa | CL-001 (2) | C-001a | Sol thêm hậu quả: sửa tên KH ném `PERSON_NOT_FOUND` |
| Nhập backup nhận 2 TL / team, TL thứ hai bị ẩn | CL-001 (1) | C-002 | Sol thêm: sửa tên **cả hai** TL đều ném `TEAM_HAS_LEAD` |
| HANDOFF còn ghi B6 chưa xong | CL-006 | C-009 | Claude còn thấy PROJECT-STATE, `phase-3.md` và ghi chú #244/#247 thiếu trong sổ |
| Cảnh báo ESLint `AppointmentsScreen.tsx:189` | CL-004 (Nit) | ghi nhận, không lập phát hiện | Cùng nhận xét hành vi đúng |
| Số verify | 782 test, coverage 99,49 / 98,41 / 100 / 99,78, 0 vi phạm module, Rust 36/36 | giống hệt | |

## 3. Khác nhau

### 3.1 Chỉ Sol có — đã kiểm lại

| Mã Sol | Nội dung | Kiểm lại của Claude | Kết luận |
|---|---|---|---|
| C-001b | Transition tạo KH bị gắn `appointment_id` của một lịch MET giữ nguyên nhóm, cùng ngày → validator nhận (luật 1 không buộc `appointment_id` null, luật 4 thấy khớp) → `softDeleteAppointment` ném lỗi SQLite thô `NOT NULL constraint failed: customers.stage` (`customers.ts:257`, `fromStage!`) | **REPRODUCED**: lỗi thô, không phải `DbError`; nhóm KH giữ N3 nhờ rollback | Đúng. Hộp xóa lịch sẽ hiện "lỗi chung". **NEW** với Claude |
| C-001c | Fact `SYSTEM` năm sinh đang `conflict` mang giá trị sai → validator nhận (luật 8 chỉ xét `active`) → resolve chọn fact đó → KYC active 1983, hồ sơ 1984 (vi phạm D2) → backup xuất sau đó bị **chính app từ chối** (`BACKUP_INVALID` luật 8) | **REPRODUCED** | Đúng, và là ca nặng nhất của nhóm: một file nhập được, sau thao tác bình thường lại sinh ra backup không nhập lại được. `resolveKycConflict` (`kyc.ts:173`) chỉ kiểm nguồn `SYSTEM`, không so giá trị với hồ sơ. **NEW** với Claude |
| C-002 (phần IS/BD/BDM) | IS/BD/BDM có `team_id` (lệnh `createPerson` cho phép) không hiện ở Team / Người hỗ trợ | Đã có trong sổ OPEN (#231) | KNOWN, hai bên cùng biết |
| C-003…C-008 | F-06/F-07, F-14, F-08, F-11, F-12, F-13 | Claude không lập lại, vì đã ở sổ OPEN với task T-e / T-f / T-g / T-h | Cùng hiểu, khác cách đếm |
| Probe RF đổi thành transition tay | RF từ 1 về 0 | Sol đã loại khỏi danh sách lỗi (hợp đồng ACCEPTED `appointmentId`) | Đồng ý không tính |
| Probe hash KYC cũ | Nhập nhận `kyc_versions.hash` sai | Sol không tính lỗi | Đồng ý; ghi cho S-1 / D-1: tính lại hoặc kiểm hash khi nhập snapshot |

### 3.2 Chỉ Claude có

| Mã Claude | Nội dung | Sol |
|---|---|---|
| CL-001 (3) | Team đã xóa mà RE / TL còn sống → nhập được, những người này không hiện ở đâu | Không có (cùng lớp với C-001a / C-002) |
| CL-002 | Số đếm > 999 không qua `formatCount` ("4528 lịch" cạnh "1.234 lịch" ở kỳ Năm) | Không có |
| CL-003 | Thêm 5 chỗ `·` / `→` viết cứng sau F-15 | Ghi "nợ T-h, không đếm" |
| CL-005 | e2e 1/114 chập chờn dưới `CI=1` | Sol chạy 2 lượt, 0 chập chờn (nhưng teardown Vite treo, phải dừng tay) |

### 3.3 Khác cách xếp loại

- **2 TL / team:**
  - Claude ghi NEW, Sol ghi KNOWN (#231 "TL thứ hai trở đi không hiện / sửa được cho tới khi B1b xong").
  - **Nhận theo Sol: KNOWN.** Sổ đã ghi trường hợp này, nhưng B1b chỉ chặn tạo TL mới, chưa xử lý dữ liệu cũ, nên vẫn OPEN.
- **Mức độ:**
  - Claude xếp Low, Sol xếp Medium.
  - **Nâng lên Medium cho cả nhóm "nhập backup còn lọt",** vì có thêm ca lỗi SQLite thô và ca tự sinh backup không nhập lại được.
- **NEW / KNOWN của C-001:**
  - Sol coi đây là phần còn thiếu của F-01 (KNOWN). Claude coi ca luật 1, luật 8 là biến thể mới.
  - Cách gọi khác nhau nhưng việc phải làm như nhau.
  - Đề xuất ghi trong sổ: "F-01 phần 3", để không đổi trạng thái RESOLVED của #203 / #204.

## 4. Danh sách hợp nhất (sau kiểm lại)

| ID mới | Nội dung | Mức | Nguồn | Xếp |
|---|---|---|---|---|
| R2-01 | Nhập backup còn lọt: (a) `re_id` của bản ghi sống trỏ RE đã xóa; (b) transition đầu có `appointment_id`; (c) fact `SYSTEM` năm sinh / giới tính ở trạng thái `conflict` khác hồ sơ; (d) người sống thuộc team đã xóa | Medium | C-001, CL-001 (2, 3) | Task **T-j** — Phase 4, task dữ liệu đầu tiên (hoặc trước G7 nếu Owner chọn) |
| R2-02 | Nhân sự cũ ẩn: 2 TL / team (không sửa tên được), IS/BD/BDM có team | Medium | C-002, CL-001 (1), sổ #231 | Owner chốt 02/10: gộp vào **T-j** (luật 9), bỏ T-k |
| R2-03 | Số đếm không qua `formatCount` | Low | CL-002 | T-h |
| R2-04 | `·` / `→` viết cứng tăng thêm; thêm luật chặn | Low | CL-003 (F-15) | T-h |
| R2-05 | Cảnh báo ESLint + `--max-warnings 0` | Nit | CL-004 | T-h |
| R2-06 | e2e chập chờn khi tải nặng; teardown Vite treo (Sol) | Low | CL-005, Sol §2 | T-d |
| R2-07 | Tài liệu trạng thái lệch | Low | CL-006, C-009 | #72 trước G7 |
| — | C-003…C-008 | — | KNOWN | Giữ T-e / T-f / T-g / T-h |
| — | Hash KYC khi nhập | — | probe Sol | Ghi chú S-1 / D-1 |

## 5. Kế hoạch tiếp theo (Owner duyệt 02/10 — G1)

### Trước G7 — #72 (docs-only, `risk:low`, Claude tự merge)

1. **HANDOFF:**
   - B6 xong, T-093 / T-094 đã merge, `main` `5eb7c03`;
   - kiểm tay exe 02/10: OK;
   - sổ P-3 thêm R2-01…R2-06 và các ghi chú không chặn của #244 / #247;
   - bước kế tiếp là Phase 4.
2. **`PROJECT-STATE.md`:** mục 02/10.
3. **`docs/metrics/phase-3.md`:** số Issue thật (gồm #214–#228, #237, #243, #245), ngày G7, kết quả kiểm exe lần 2, kết quả 2 review.
4. **Lưu tổng hợp review lần 2** vào `docs/reviews/2026-10-02-phase-1-3-review-2-tong-hop.md` (từ file này).
5. **Dừng hỏi Owner G7.**

### Phase 4 — Đợt 2 (thứ tự)

| # | Task | Nội dung | risk | Ước lượng |
|---|---|---|---|---|
| 1 | T-d | e2e local ổn định (+ teardown Vite) | low | ~20 / ~60 |
| 2 | **T-j (mới)** | Validator nhập, lần 3: luật 1 buộc `appointment_id` null ở transition đầu; luật 5 thêm "người chưa xóa"; luật 8 xét cả `conflict` từ `SYSTEM`; luật 9 nhân sự (người sống → team sống; ≤ 1 TL nếu Owner chọn từ chối). Phòng thủ trong lệnh: `withdrawAppointmentTransition` ném `DbError` thay lỗi SQLite thô khi `fromStage` null; `resolveKycConflict` so giá trị `SYSTEM` với hồ sơ. Test mẫu "nhập → thao tác → xuất → nhập lại". Cập nhật spec §6 | high | ~120 / ~450 |
| 3 | G2 Phase 4 | Định nghĩa lịch dự kiến / đã gặp, miền năm, mockup Tổng quan (ý 9) | gate | — |
| 4 | T-e, T-f | Index chỉ số + MTD; miền năm | med | như báo cáo 30/09 |
| 5 | T-g | Coverage riêng từng gói + app; ghim SHA Actions | med | |
| 6 | T-h | Như kế hoạch 30/09 + R2-03, R2-04, R2-05 (tách 2 PR nếu vượt ngưỡng) | low → med | |
| 7 | ~~T-k~~ | **Bỏ** (Owner 02/10): R2-02 gộp vào T-j thành luật 9 "nhân sự" | — | — |
| 8 | T-i | Dashboard đầu tiên (checklist escape tooltip) | theo task | |

### Quyết định Owner (02/10/2026, AskUserQuestion)

- **R2-01:** sửa **sau G7**. T-j là task dữ liệu đầu tiên của Phase 4, ngay sau T-d.
- **R2-02:** dữ liệu hiện có đều là giả lập, nên **xóa dữ liệu sai lệch**, không làm migration hay giao diện cho dữ liệu cũ.
  - **Bỏ T-k.** Màn Team giữ nguyên.
  - Gộp vào T-j thành luật 9 "nhân sự", vừa ở validator lẫn ở lệnh:
    - mỗi team tối đa 1 TL chưa xóa;
    - IS/BD/BDM không có team: `createPerson` / `updatePerson` từ chối hoặc tự bỏ team như UI đang làm. Đây là đổi spec §3.3 "có thể trống" thành "luôn trống";
    - người chưa xóa thuộc team chưa xóa.
  - DB đang có dữ liệu sai: Owner dùng "Nạp lại dữ liệu giả lập".
  - Chú thích "first by name if old data has several" ở `team-view.ts` bỏ khi làm T-j.
  - Sổ #231 về IS/BD/BDM có team: chuyển sang T-j.

## 6. Test kiểm lại (đã xóa khỏi worktree)

`pnpm exec vitest run packages/db/src/sol-check.repro.test.ts`: 4/4 pass. Output:
- `C-001a DbError PERSON_NOT_FOUND`
- `C-001b raw Error: NOT NULL constraint failed: customers.stage`
- `C-001c re-import BACKUP_INVALID rule 8`
- `C-002 DbError TEAM_HAS_LEAD | DbError TEAM_HAS_LEAD | demote first to RE: ok`

Đổi một TL thành RE thì được, nên người dùng vẫn có đường thoát trên UI nếu biết.

```ts
// Temporary repro: re-checking the Sol review findings (C-001, C-002). Deleted before the session ends.
import { calendarDate } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { recordMeetingOutcome, scheduleAppointment, softDeleteAppointment } from './appointments';
import { exportBackup, importBackup } from './backup';
import { createCustomer, getCustomer, updateCustomerProfile } from './customers';
import { DbError } from './errors';
import { getKycProfile, markKycConflict, recordKycNote, resolveKycConflict } from './kyc';
import { updatePerson } from './team';
import { setup } from './test-support';

const day = calendarDate(2026, 9, 10);
type Row = Record<string, unknown>;
type File = { tables: Record<string, Row[]> };
const read = (db: Parameters<typeof exportBackup>[0]) => JSON.parse(exportBackup(db)) as File;

const outcome = (fn: () => unknown): string => {
  try {
    fn();
    return 'ok';
  } catch (error) {
    return error instanceof DbError ? `DbError ${error.code}` : `raw ${String(error)}`;
  }
};

describe('Sol C-001 / C-002 re-check', () => {
  it('C-001a: live customer of a deleted RE; editing only the name fails', async () => {
    const { db, re } = await setup();
    const c = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N4', date: day });
    const file = read(db);
    file.tables.people!.find((p) => p.id === re.id)!.deleted_at = '2026-09-26T08:00:00.000Z';
    const imported = await importBackup(JSON.stringify(file));
    const result = outcome(() => updateCustomerProfile(imported.db, c.id, { name: 'Lan sửa' }));
    expect(result).toBe('DbError PERSON_NOT_FOUND');
  });

  it('C-001b: first transition tied to a meeting; deleting the meeting throws a raw SQLite error', async () => {
    const { db, re } = await setup();
    const c = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N3', date: day });
    const a = scheduleAppointment(db, { customerId: c.id, reId: re.id, date: day, triggerType: 'OTHER' });
    recordMeetingOutcome(db, a.id, { status: 'MET', stageAfter: 'N3', nextStep: 'Hẹn tiếp' });
    const file = read(db);
    file.tables.stage_transitions!.find((t) => t.customer_id === c.id)!.appointment_id = a.id;
    const imported = await importBackup(JSON.stringify(file));
    const result = outcome(() => softDeleteAppointment(imported.db, a.id));
    expect(result).toMatch(/^raw .*NOT NULL constraint failed: customers.stage/);
    expect(getCustomer(imported.db, c.id)!.stage).toBe('N3');
  });

  it('C-001c: wrong SYSTEM birth year in conflict; resolving breaks D2 and the next export is refused', async () => {
    const { db, re } = await setup();
    const c = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N4', date: day, birthDate: { year: 1984 } });
    const { note } = recordKycNote(db, c.id, { text: 'Năm sinh khác', date: day, facts: [] });
    markKycConflict(db, c.id, { field: 'birthYear', value: 1985, noteId: note.id, date: day });
    const file = read(db);
    const system = file.tables.kyc_facts!.find((f) => f.field === 'birthYear' && f.value_json === '1984')!;
    system.value_json = '1983';
    const imported = await importBackup(JSON.stringify(file));
    resolveKycConflict(imported.db, c.id, { factId: system.id as string, date: day });
    expect(getCustomer(imported.db, c.id)!.birthDate!.year).toBe(1984);
    const active = getKycProfile(imported.db, c.id).facts.find((f) => f.field === 'birthYear' && f.status === 'active')!;
    expect(active.value).toBe(1983);
    let rule: unknown;
    try {
      await importBackup(exportBackup(imported.db));
    } catch (error) {
      rule = error instanceof DbError ? `${error.code} rule ${String(error.params?.rule)}` : error;
    }
    expect(rule).toBe('BACKUP_INVALID rule 8');
  });

  it('C-002: two live TLs; neither can be renamed', async () => {
    const { db, tl } = await setup();
    const file = read(db);
    const original = file.tables.people!.find((p) => p.id === tl.id)!;
    file.tables.people!.push({ ...original, id: 'second-tl', name: 'Z TL thứ hai' });
    const imported = await importBackup(JSON.stringify(file));
    expect(() => updatePerson(imported.db, tl.id, { name: 'Hà sửa' })).toThrow();
    expect(() => updatePerson(imported.db, 'second-tl', { name: 'TL sửa' })).toThrow();
  });
});
```
