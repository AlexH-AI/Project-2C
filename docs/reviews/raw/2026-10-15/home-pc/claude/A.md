XONG — claude gói A, 13/10/2026 22:44

# Deep review Phase 1–6, lượt 1 — Claude — Gói A (Lõi dữ liệu)

## 1. Đầu phiên

| | |
|---|---|
| Bên | Claude (Claude Code, model Opus 5.5), phiên sạch, chỉ đọc |
| Gói | **A. Lõi dữ liệu** — `packages/domain/**`, `packages/db/**` |
| Worktree | `C:\workspace\Project-2C-review` |
| SHA đầu phiên | `885534549808f42aec7f9af5743bbf86642ee4bd` (`git rev-parse HEAD`) = SHA ghim |
| `git status --short` đầu phiên | rỗng |
| Giờ bắt đầu | 13/10/2026 21:47 (+07:00) |
| Bước 0 | `A` hợp lệ; `claude\A.md` chưa có (`Test-Path` → False); gói A không cần gói trước |
| Máy, việc chạy song song | Home PC `DESKTOP-KDURKJP` (i9-12900K, 24 luồng). Trong lúc đo: Codex chạy gói của nó ở `Project-2C-review-2` (3 tiến trình `codex`), có 1 tiến trình `project2c` đang mở (không phải của phiên này); tải CPU ≈ 8 % lúc bắt đầu đo (21:57). Mọi số đo của báo cáo này là **Node** (`node` 24, hàm thuần trên dữ liệu tải), không đo trên exe. |

**Phiên 3 — làm tiếp (13/10/2026 22:39, cùng máy, cùng worktree).** Phiên 2 dừng vì hết hạn mức, khi đột biến còn chạy nền và bốn probe chưa chạy. `A.md` không có dòng trạng thái `ĐANG LÀM` / `XONG` (phiên 2 không ghi dòng đó). Owner yêu cầu trong tin nhắn mở phiên 3: đọc báo cáo rồi làm tiếp phần dở của gói A. Vì vậy phiên 3 làm tiếp, không làm lại và không ghi đè phát hiện đã có. Đầu phiên 3: `git rev-parse HEAD` → `885534549808f42aec7f9af5743bbf86642ee4bd`, `git status --short` rỗng (đột biến đã trả file về). Việc phiên 3 làm: (a) kiểm kết quả đột biến 59/59 trong `s2-mutate-results.json`; (b) đọc hết rồi chạy bốn probe phiên 2 đã viết, log có tiền tố `s3-`: `s3-m10-probe.log` (bổ sung CL-A5), `s3-zw-gate.log` (phần còn PLAUSIBLE của CL-A3 → CONFIRMED), `s3-domain-edges.log` (§6 trục E), `s3-perf-import.log` (§4b); (c) sửa các chỗ còn ghi "chưa chạy" / "đang chạy" trong §3–§7. Không thêm phát hiện mới.

**Ghi chú về thư mục `claude\A\`.** Lúc mở phiên, thư mục này đã có sẵn file ghi 21:17–21:44 (trước phiên này): script `hooks.mjs`, `fuzz.mjs`, `mutate.mjs`, `perf*.mjs`, `*-probe.mjs`, `exports.mjs`, log và `orig\` (bản chép file trước khi đột biến) — dấu vết một phiên gói A của Claude bị ngắt trước khi ghi `A.md`. Đây là thư mục của chính bên Claude; tôi đọc lại các script đó và dùng lại một số (đã đọc toàn bộ trước khi chạy), nhưng **mọi kết quả trong báo cáo này chạy lại trong phiên này**; log của phiên này có tiền tố `s2-`. Log cũ không tiền tố để nguyên, không dùng làm bằng chứng. `git status --short` đầu phiên rỗng, nên phiên trước không để lại file bị đột biến.

## 2. Phạm vi đã đọc

**Code sản phẩm (đọc hết từng dòng, ở SHA ghim):**

- `packages/domain/src`: `money.ts` (165), `number.ts` (38), `period.ts` (385), `stats.ts` (251), `model.ts` (95), `customer-lifecycle.ts` (57), `stage-snapshot.ts` (160), `appointment-counts.ts` (107), `compare.ts` (74), `evidence-level.ts` (46), `kyc.ts` (149), `kyc-fact.ts` (63), `kyc-gate.ts` (78), `kyc-catalog.ts` (145), `name-order.ts` (9), `pipeline-stage.ts` (6), `index.ts` (116); golden `golden/metrics.fixture.ts` (226), `golden/appointments.fixture.ts` (123), `golden/stage-snapshot.fixture.ts` (207), `golden/kyc.fixture.ts` (262).
- `packages/db/src`: `schema.ts` (363), `database.ts` (214), `migrations.ts` (35), `errors.ts` (105), `ids.ts` (29), `common.ts` (147), `customers.ts` (338), `team.ts` (283), `appointments.ts` (503), `policies.ts` (137), `kyc.ts` (510), `ai-analyses.ts` (314), `counts.ts` (85), `trash.ts` (241), `backup.ts` (186), `backup-validation.ts` (409), `seed.ts` (634), `seed-data.ts` (80 đầu / 289), `settings.ts` (27), `index.ts` (96), `test-support.ts` (35); migration `0000`, `0001`, `0003`, `0004`, `0006`, `0008` (SQL).
- Code gói khác mà gói A nối vào (chỉ đọc chỗ nối): `apps/desktop/src/data/app-data.ts` (cổng `persist`), `apps/desktop/src/data/AppDataContext.tsx` (`useQuery` tính lại mỗi revision), `apps/desktop/src/routes/SettingsTrash.tsx:146` (`useQuery(listTrash)`), `routes/customers/CustomerDialogs.tsx:349`, `routes/customers/policy-form.ts`, `routes/appointments/outcome-form.ts`, `MetFields.tsx` (dòng đọc lại số tiền), `packages/ai/src/schema.ts` (danh sách provider / reasoning).

**Test (đọc có chọn lọc):** `trash.test.ts` (danh sách ca: E1–E16 + TR-3, TR-5 đủ), `compare.test.ts` (C01–C11 đủ), `period.test.ts` (bảng §3.1 trần 3 tháng), `money.test.ts:195-215` (test đo thời gian), `seed-invariants.test.ts:20-70`, `seed.test.ts:280-300`, `backup-invariants.test.ts:245-265`; `git grep` mọi `new Date()` / `Date.now()` / `Math.random()` trong test gói A.

**Tài liệu:** `CLAUDE.md` gốc + `packages/domain/CLAUDE.md`, `packages/db/CLAUDE.md`; `docs/design/phase-3-du-lieu.md` (hết), `phase-4-chi-so.md` (hết), `phase-6-hoan-thien.md` (hết); `docs/golden/chi-so.md`, `lich-hen.md`, `kh-theo-nhom.md`, `kyc.md` (§1–§4 đầu); ADR-0007 (hết), ADR-0008 (`git grep` mục 7 cờ material); `docs/metrics/phase-6.md` (bảng ngưỡng); `common\plan.md` §1–§12, `known.md`, `baseline.md`. Golden fixture so tay với tài liệu: G01–G22, A01–A13, S01–S13, M01–M04 khớp từng số.

## 3. Phát hiện

Không có Critical / High / Medium. Mọi phát hiện dưới đây đều CONFIRMED (có lệnh + kết quả chạy trong phiên); không có PLAUSIBLE.

### CL-A1 — `listTrash` tốn ≈ 2 ms cho mỗi KH đã xóa (quét toàn bảng lịch hẹn / HĐ), vượt 200 ms khi Thùng rác có ≈ 100 KH

```
ID: CL-A1
Mức: Low
Trục: P
Vị trí: packages/db/src/trash.ts:130, :252 (customerEffect → countCustomerRecords); packages/db/src/counts.ts:56-77; packages/db/src/schema.ts:113, :194 (appointments / policies không có chỉ mục customer_id) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** mỗi dòng KH trong Thùng rác gọi `countCustomerRecords`, gồm 3 subquery trên `appointments`, 2 trên `policies` và một join `stage_transitions × appointments`, theo `customer_id` — cột không có chỉ mục nên mỗi subquery là `SCAN appointments` (10 414 dòng). Chi phí `listTrash` vì vậy tăng tuyến tính theo số KH đã xóa, và TR-6 không bao giờ dọn Thùng rác. Màn Thùng rác tính lại `listTrash` ở mỗi revision khi đang mở (`SettingsTrash.tsx:146` `useQuery(listTrash)` → `AppDataContext.tsx:32`), tức cả sau mỗi lần khôi phục.
- **Tái hiện / số đo** (Node, dữ liệu tải nhập bằng `importBackup`, rồi xóa thêm KH bằng `softDeleteCustomer`; trung vị 5 lần; `s2-perf-trash.log`, `s2-perf-trash2.log`):

  | KH đã xóa | Lịch / HĐ đã xóa | Dòng Thùng rác | `listTrash` |
  |---:|---:|---:|---:|
  | 15 (dữ liệu tải) | 80 / 18 | 117 | 45,0 ms |
  | 50 | 80 / 18 | 152 | 114,9 ms |
  | 100 | 80 / 18 | 202 | **211,2 ms** |
  | 200 | 80 / 18 | 302 | 412,3 ms |
  | 400 | 80 / 18 | 502 | 814,8 ms |
  | 400, thêm chỉ mục tạm `appointments(customer_id)`, `policies(customer_id)`, `ai_analyses(customer_id)` (chỉ trong DB bộ nhớ của probe) | | 502 | **48,3 ms** |
  | 15 | 600 / 18 (thêm lịch Dự kiến đã xóa) | 637 | 70,6 ms |
  | 15 | 600 / 318 | 937 | 80,7 ms |

  `countCustomerRecords` một KH: 2,07 ms; `EXPLAIN QUERY PLAN SELECT COUNT(*) FROM appointments WHERE customer_id = 'x' AND deleted_at IS NULL` → `["SCAN appointments"]`. Lịch / HĐ đã xóa chỉ ≈ 0,05 ms mỗi dòng, nên KH đã xóa là phần chính (ngay ở dữ liệu tải, 15 KH ≈ 30 / 45 ms).
- **So ngưỡng:** "Thùng rác, mở" < 200 ms (`phase-6.md`, Owner chốt 13/10); `perf-ref.json` đo `trash.open` 80 ms trên exe với 15 KH đã xóa. Riêng hàm thuần trong Node đã qua 200 ms ở 100 KH đã xóa (chưa đo trên exe; trên exe còn thêm render). Trên dữ liệu tải (15 KH) vẫn đạt, nên chấm Low; khác ghi chú KNOWN #539 (`refs` đọc cả ba bảng mỗi lần) ở nguyên nhân — phần tốn là các phép đếm theo từng KH, không phải `refs`.
- **Ảnh hưởng:** người dùng lâu ngày, Thùng rác giữ nhiều KH (không có tự dọn); mở Thùng rác và mỗi lần khôi phục chậm dần, tuyến tính.
- **Đề xuất:** trong `listTrash` đếm một lượt cho mọi KH đã xóa (`GROUP BY customer_id` trên `appointments`, `policies`, `kyc_notes`, `ai_analyses`, join chuyển nhóm), rồi tra theo id — ≈ 30–40 dòng SP, không đổi schema; hoặc thêm chỉ mục `customer_id` (migration mới + test mở DB cũ có dữ liệu). Test giữ hành vi: `trash.test.ts` E1, `counts.test.ts`, `trash-view.test.ts`.

### CL-A2 — Sửa ngày (6f) một cuộc gặp Đã gặp "giữ nhóm" không kiểm lại nhóm: "nhóm sau cuộc gặp" có thể trái với dòng thời gian, kể cả khi ghi mới cùng nội dung bị D10 chặn

```
ID: CL-A2
Mức: Low
Trục: C, E
Vị trí: packages/db/src/appointments.ts:198-221 (editMeetingOutcome; :211 keepsStage, :212-215 withdrawn, :218 chỉ applyOutcome khi !keepsStage || withdrawn) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** cuộc gặp Đã gặp có "nhóm sau" bằng nhóm KH lúc ghi thì không sinh chuyển nhóm. Khi hộp 6f đổi **ngày** của nó mà giữ nguyên kết quả, `keepsStage` = true và không có gì để rút, nên lệnh không áp lại kết quả ở ngày mới và không kiểm D10. Cuộc gặp có thể được dời qua một chuyển nhóm khác: "nhóm sau" của nó trái với nhóm KH ở ngày mới, trong khi `recordMeetingOutcome` với đúng nội dung đó sẽ ghi chuyển nhóm (S1) hoặc bị từ chối `TRANSITION_BEFORE_LATEST` (S2). D7 không khóa ngày vì cuộc gặp không có chuyển nhóm riêng.
- **Tái hiện** (`node s2-scenarios.mjs`, log `s2-scenarios.log`):
  - S1: KH tạo N3 01/09; cuộc gặp 10/09 Đã gặp, nhóm sau N3 (không chuyển nhóm); chuyển tay N3 → N2 15/09. 6f dời cuộc gặp sang 20/09, giữ N3 → `OK`; sau đó `cuộc gặp 20/09/2026 nhóm sau N3; KH N2`, dòng thời gian vẫn `#1 ∅→N3 2026-09-01 | #2 N3→N2 2026-09-15`. So sánh: ghi mới cuộc gặp 20/09 nhóm sau N3 → thêm `#3 N2→N3 2026-09-20 (cuộc gặp)`.
  - S2: KH N3 01/09; chuyển tay N3 → N2 15/09; cuộc gặp 20/09 Đã gặp nhóm sau N2 (giữ nhóm). 6f dời về 12/09 → `OK`; kết quả `cuộc gặp 12/09 ghi nhóm sau N2, nhóm KH cuối 12/09 = N3; RF của KH = 0`. Ghi mới một cuộc gặp 12/09 đổi nhóm → `refused TRANSITION_BEFORE_LATEST {"date":"15/09/2026"}`.
  - Cả hai trạng thái sau sửa vẫn qua `validateBackupValues` + `validateBackupInvariants` (`nhập backup nhận`): luật 4 chỉ xét chuyển nhóm sinh từ cuộc gặp.
- **Ảnh hưởng:** RE sửa ngày một cuộc gặp cũ (gõ nhầm ngày) sau khi KH đã đổi nhóm: hồ sơ hiện cuộc gặp mới nhất "nhóm sau N3" trong khi KH ở N2 (S1), hoặc một cuộc gặp "N3 → N2" mà không tính RF và không có chuyển nhóm (S2, theo chữ ADR-0007 thì đó là RF). Không mất dữ liệu, chỉ số không đổi do chính lần sửa; cần đúng chuỗi thao tác nên chấm Low.
- **Đề xuất (cần Owner chọn hướng):** khi 6f đổi ngày của cuộc gặp Đã gặp, xử lý như lúc ghi: tính `outcomeStage` theo nhóm của KH tại ngày mới và chạy `checkTransition` (D10), hoặc khóa ngày cuộc gặp Đã gặp như D7 khi KH đã có chuyển nhóm sau ngày cũ. ≈ 10–20 dòng SP + test ở `appointments.test.ts`.

### CL-A3 — Tên / chữ KYC chỉ NFC + trim: khoảng trắng trong tên, NBSP, ký tự vô hình lọt qua → hai team trông trùng tên, tên / ghi chú / giá trị KYC "rỗng" vẫn nhận

```
ID: CL-A3
Mức: Low
Trục: E
Vị trí: packages/db/src/common.ts:22-31 (cleanText / requireName); packages/db/src/team.ts:223 (assertTeamNameFree so nguyên văn); packages/domain/src/kyc-fact.ts:46-56 (normalizeKycValue) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** `cleanText` chỉ NFC + `trim()`; không gộp khoảng trắng bên trong, không coi NBSP / U+200B / U+2060 là khoảng trắng. `TEAM_NAME_TAKEN` so nguyên văn nên "Bình  Minh" (2 dấu cách), "Bình\u00A0Minh", "Sao Mai\u200B" là team mới, hiển thị giống hệt team có sẵn (HTML gộp khoảng trắng); tên / ghi chú KYC / giá trị KYC chỉ gồm ký tự vô hình được nhận như không rỗng.
- **Tái hiện:** `node text-probe.mjs` (chạy lại trong phiên): `team "Sao Mai\u200B" OK`, `team "\u200B" only OK`, `team "\u2060" only OK`, `person "\u200B\u200B" OK`, `KYC note "\u200B" with residence "\u200B": "​" version recorded`, xuất → nhập backup nhận cả 4 team. `node s2-scenarios.mjs` S4: NFD "Sao Mai" → `TEAM_NAME_TAKEN` (đúng DR-49), nhưng `team "Bình\u00A0Minh" (NBSP giữa): OK`, `team "Bình  Minh" (2 dấu cách): OK` → `teams: ["Sao Mai","Bình Minh","Bình Minh","Bình  Minh"]`.
  - **Giá trị KYC vô hình làm hạng mục "đã có" và đổi trạng thái cổng** (phiên 3, `node s2-zw-gate.mjs`, log `s3-zw-gate.log`). KH N3 có 5 dữ kiện (Đã kết hôn, 2 con, Bác sĩ, Trên 100 tỷ, Hưu trí) → `trước: PROFILE_DISCOVERY · thiếu ["RISK_APPETITE","EXISTING_PROTECTION","CONCERNS"]`. Sau `recordKycNote` với ghi chú `"​"` và `riskProfile` = `"​"` → `OK, KYC v3; cổng PAIN_POINT_ANALYSIS · thiếu ["EXISTING_PROTECTION","CONCERNS"]`. Tiếp `mainConcern` = `"⁠"` → `OK, KYC v4; … thiếu ["EXISTING_PROTECTION"]`. `residence` = 3 × U+200B → `OK, KYC v5`. Như vậy chỉ một ký tự vô hình đã tính là câu trả lời: nó thành dữ kiện, sinh phiên bản KYC và đổi trạng thái cổng (`evaluateKycGate` chỉ xét trường có dữ kiện hay không, `packages/domain/src/kyc-gate.ts:52-71`, `isPresent` ở `:59`). Từ đó panel AI chạy ở chế độ phân tích nỗi đau, trên một khẩu vị rủi ro rỗng.
  - **UI không chặn.** Hộp ghi chú KYC chỉ kiểm `value.trim() === ''` (`apps/desktop/src/routes/customers/KycDialogs.tsx:198`) rồi gọi `normalizeKycValue` (`:206`). Hàm `trim()` của JS không bỏ U+200B / U+2060 (không thuộc White_Space): `node -e` → `'​'.trim()===''` cho `false`, `'⁠'` → `false`; NBSP / U+FEFF / U+3000 → `true`, nên NBSP ở hai đầu bị bỏ, chỉ NBSP ở giữa lọt (như trên).
- **Ảnh hưởng:** gõ nhầm hai dấu cách / dán tên từ nguồn khác tạo team trùng tên nhìn thấy (bộ chọn góc nhìn, bảng Theo team). Dán một giá trị KYC chỉ có ký tự vô hình (vd. chép từ web / chat) thì hạng mục thành "đã có", cổng lên PAIN_POINT_ANALYSIS dù RE không nhập gì đọc được. Cần dán đúng chuỗi như vậy nên hiếm; giữ Low.
- **Đề xuất:** `cleanText` gộp mọi khoảng trắng Unicode thành một dấu cách và bỏ ký tự định dạng vô hình (Cf) trước khi trim; áp cả lệnh và kiểm nhập backup (`storedAs`, K1: dữ liệu cũ nạp lại). ≈ 10 dòng SP + test.

### CL-A6 — Ký tự surrogate lẻ trong tên bị lưu thành ba U+FFFD, không báo

```
ID: CL-A6
Mức: Nit
Trục: E
Vị trí: packages/db/src/common.ts:22-24 (cleanText không kiểm chuỗi UTF-16 hợp lệ) (8855345)
Tình trạng: CONFIRMED
```

- **Tái hiện:** `node s2-scenarios.mjs` S3: `"A\uD800"` → đọc lại `41 fffd fffd fffd` (KHÁC); `"\uDC00B"` → `fffd fffd fffd 42`; nhập backup vẫn nhận. Chỉ xảy ra khi dán chuỗi hỏng (gõ không tạo được). Dữ kiện KYC không bị (lưu qua `JSON.stringify` có escape).
- **Đề xuất:** `cleanText` từ chối `INVALID_TEXT` khi `!text.isWellFormed()` (1 dòng).

### CL-A4 — Không test nào bắt bộ lọc `t.deleted_at IS NULL` khi đếm RF của hộp 5f / Thùng rác (đột biến M15 sống)

```
ID: CL-A4
Mức: Low
Trục: T
Vị trí: packages/db/src/counts.ts:75 (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** bỏ `t.deleted_at IS NULL` khỏi câu đếm RF của `countCustomerRecords` (dùng ở hộp Xóa KH 5f và hộp khôi phục KH 11b) mà toàn bộ test vẫn xanh. Đây **không** phải đột biến tương đương: sửa ngày một cuộc gặp Đã gặp có chuyển nhóm (6f) để lại một chuyển nhóm đã rút trỏ vào cuộc hẹn vẫn sống, nên câu đột biến đếm 2 RF thay vì 1.
- **Tái hiện:** `node s2-mutate.mjs` → `M15 counts: rf counts withdrawn transitions → SURVIVED (package A tests and the whole vitest suite: 2755 passed)`. `node m15-probe.mjs` (chạy trong phiên này): `transitions (seq, from, to, date, deleted): [[1,null,"N3","2026-09-01",0],[2,"N3","N2","2026-10-01",1],[3,"N3","N2","2026-10-02",0]]`, `countCustomerRecords.rf (code): 1`, `same query without t.deleted_at IS NULL (mutant M15): 2`, `isRfAppointment count (metrics): 1`.
- **Ảnh hưởng:** một sửa đổi sau này của câu SQL có thể làm hộp 5f / 11b báo "tính 2 lần RF" khác số Tổng quan mà không test nào đỏ.
- **Đề xuất:** thêm vào `counts.test.ts` ca "cuộc gặp Đã gặp dời ngày ở 6f vẫn tính 1 RF" (≈ 10 dòng test).

### CL-A5 — Không test nào cho số lẻ trong cột integer của file backup (đột biến M10 sống); với `prompt_tokens` chỉ `valueOf` chặn

```
ID: CL-A5
Mức: Low
Trục: T
Vị trí: packages/db/src/backup.ts:191 (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** đổi `Number.isSafeInteger(value)` thành `typeof value === 'number'` trong `valueOf` mà toàn bộ 2 755 test vẫn xanh. Với đa số cột integer còn lớp kiểm khác (`seq` ở `validValue`, tiền ở `isFee`, `material` / `attempts` ở CHECK), nhưng `ai_analyses.prompt_tokens` / `completion_tokens` chỉ có CHECK `>= 0` và không hàm kiểm nào xét chúng, nên `valueOf` là lớp duy nhất.
- **Tái hiện:** `node s2-mutate.mjs` → `M10 backup: a float in an integer column → SURVIVED (package A tests and the whole vitest suite: 2755 passed)`. Test hiện có cho số lẻ (`backup.test.ts:304` `seq: 1.5`, `:354` `expected_case_size: 1.5`) đều rơi vào cột có lớp kiểm thứ hai (`validValue` của `seq`, `isFee`), nên không phân biệt được. Phiên 3, `node s2-m10-probe.mjs` (log `s3-m10-probe.log`) trên code nguyên trạng, không đột biến. Một dòng `ai_analyses` OPENCODE_GO có `prompt_tokens: 1.5`: (a) đưa vào file backup → `importBackup … refused BACKUP_INVALID {}` (`valueOf` chặn); (b) cùng dòng chèn thẳng vào DB → `stored: [1.5,"real"]` (CHECK `>= 0` ở `schema.ts:376-377` nhận), sau đó `validateBackupValues + validateBackupInvariants: accepted`. Vậy với cột token, `valueOf` (`backup.ts:191`) là lớp duy nhất chặn số lẻ.
- **Ảnh hưởng:** chỉ file sửa tay; nếu `valueOf` bị nới sau này, số token lẻ vào DB mà không test nào đỏ.
- **Đề xuất:** thêm ca `prompt_tokens: 1.5` (và một số lẻ ở cột khác) vào `backup.test.ts` / `backup-invariants.test.ts` (≈ 10 dòng test).

### CL-A7 — Hộp khôi phục cuộc gặp (TR-8, 11c) có thể báo "tính RF" sai mà không test nào đỏ (đột biến N19 sống)

```
ID: CL-A7
Mức: Low
Trục: T
Vị trí: packages/db/src/trash.ts:159 (rf: isRfTransition(stage, to)) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** đổi `rf: isRfTransition(stage, to)` thành `rf: true` mà toàn bộ test vẫn xanh. Ca `listTrash` duy nhất có `stageChange` là E5 (`trash.test.ts:195`, N3 → N2, `rf: true`); các ca `rf: false` ở `apps/desktop/src/routes/trash-view.test.ts:91, :211, :439` là dòng `TrashRow` dựng tay, chỉ kiểm phần hiện chữ, không qua `listTrash`.
- **Tái hiện:** `node s2-mutate.mjs` → `N19 trash: every met stage change announced as an RF → SURVIVED (package A tests and the whole vitest suite: 2755 passed)`. Code hiện tại đúng: fuzz kiểm hệ quả hộp TR-8 so với kết quả khôi phục thật 119 lần trên cuộc gặp Đã gặp, 0 lệch (§6 trục D).
- **Ảnh hưởng:** một sửa đổi sau này có thể làm hộp 11c báo "tính 1 RF" cho một lần khôi phục hạ nhóm / N4 → N3 / mở lại, trong khi Tổng quan không đếm.
- **Đề xuất:** thêm vào `trash.test.ts` một ca khôi phục cuộc gặp Đã gặp sinh chuyển nhóm không phải RF (vd. N2 → N3 hoặc N4 → N3), kiểm `effect.rf === false` (≈ 15 dòng test).



### CL-A8 — Hàm / lệnh sản phẩm chỉ test dùng

```
ID: CL-A8
Mức: Nit
Trục: B
Vị trí: packages/domain/src/period.ts:289 (monthToDate); packages/db/src/kyc.ts:197 (markKycVersionMaterial); packages/db/src/appointments.ts:136 (getAppointment); packages/db/src/policies.ts:31 (getPolicy); packages/db/src/team.ts:40, :55 (getTeam, getPerson); packages/db/src/customers.ts:206 (export { liveCustomer } — bí danh của common.ts:160) (8855345)
Tình trạng: CONFIRMED
```

- **Mô tả:** sáu hàm được `export` nhưng không file sản phẩm nào ngoài file của nó gọi (không có trong `index.ts`, chỉ test dùng). `markKycVersionMaterial` là lệnh "bật material cho phiên bản đã có": mockup / UI chỉ có ô "thay đổi quan trọng" lúc lưu (`KycDialogs.tsx:84`), không có nút bật sau. `liveCustomer` được export từ hai module (`common.ts` và bí danh ở `customers.ts`), `policies.ts` / `appointments.ts` lấy từ `customers`, `kyc.ts` / `ai-analyses.ts` lấy từ `common`.
- **Bằng chứng:** `node exports.mjs` (log `s2-exports.log`) rồi `git grep -l -E "\b<tên>"` bỏ file test: `monthToDate → packages/domain/src/period.ts`, `markKycVersionMaterial → packages/db/src/kyc.ts`, `getAppointment → packages/db/src/appointments.ts`, `getPolicy → packages/db/src/policies.ts`, `getTeam → packages/db/src/team.ts`, `getPerson → packages/db/src/team.ts` (chỉ chính file khai báo).
- **Đề xuất:** bỏ (≈ 45 dòng SP + test của chúng), hoặc giữ có chủ ý và ghi lý do (vd. `getAppointment` cho test). Không có chi phí đo được.

### CL-A9 — Code lặp ≥ 3 nơi trong `packages/db`

```
ID: CL-A9
Mức: Nit
Trục: B
Vị trí: update<X>Row: team.ts:306, :314, customers.ts:339, policies.ts:136, appointments.ts:483; tra `seq` kế tiếp theo KH: customers.ts:224-229, kyc.ts:468, :476, ai-analyses.ts:332; find<X> / live<X>: team.ts:201-221, customers.ts:307, appointments.ts:462, :475, policies.ts:129, common.ts:160; năm trước cùng ngày: compare.ts:18, evidence-level.ts:50 (8855345)
Tình trạng: CONFIRMED (đọc code)
```

- **Mô tả:** năm hàm `update<X>Row` giống hệt nhau (đặt `updatedAt` + `changes`, `where id`); năm câu "seq lớn nhất của KH" viết riêng cho `stage_transitions`, `kyc_notes`, `kyc_facts`, `kyc_versions`, `ai_analyses`; `sameDayYearBefore` (qua `calendarDate`, ném lỗi năm 1899) và `yearBefore` (không kiểm) cùng tính "cùng ngày năm trước, 29/02 → 28/02".
- **Đề xuất:** một `updateRow(db, table, id, changes)` và một `nextSeqOf(db, table, customerId)` trong `common.ts` (≈ −40 dòng); `yearBefore` dùng chung ở `period.ts`. Giữ hành vi: toàn bộ test `packages/db` (1 229 test gói A xanh trước / sau), golden không đổi. Không có chi phí đo được.

### CL-A10 — Golden `lich-hen.md` L-09 dùng RE làm người phối hợp, trái DR-47; comment `domain` còn nói "hoặc RE khác"

```
ID: CL-A10
Mức: Nit
Trục: C
Vị trí: docs/golden/lich-hen.md:29, :50 (L-09, A09); packages/domain/src/golden/appointments.fixture.ts:68; packages/domain/src/model.ts:76; packages/domain/src/appointment-counts.ts:35 — so với docs/design/phase-3-du-lieu.md:115 (8855345)
Tình trạng: CONFIRMED (đọc tài liệu)
```

- **Mô tả:** golden A01–A13 (duyệt G2 03/10) có `L-09` "Chi (+ RE Dũng phối hợp)" và A09 kiểm "Phối hợp L-09 không tính"; spec Phase 3 §3.6 (Owner 06/10, DR-47) nay cấm mọi RE làm người phối hợp, lệnh từ chối `INVALID_COORDINATOR` và nhập backup từ chối (luật 5). Golden mô tả dữ liệu mà tầng `db` không còn tạo được; vẫn có nghĩa ở `domain` (hàm đếm bỏ qua người phối hợp). Comment `model.ts:76` "TL/IS/BD/BDM (or other RE)" và `appointment-counts.ts:35` "coordinators, even RE" theo luật cũ. Kèm Nit cùng loại: `seed.ts:575` một JSDoc "Most customers gave a full birth date…" đứng thừa trước JSDoc của `birthYears` (thuộc `profile` ở `:587`).
- **Đề xuất:** Owner ghi chú trên golden rằng L-09 là dữ liệu trước DR-47 (không sửa số, không sửa fixture để "cho xanh"); sửa hai comment và JSDoc thừa.

## 4. Bloat

| Đã chạy / đọc | Trên | Kết quả | ID |
|---|---|---|---|
| `npx tsc -p packages/domain/tsconfig.json --noEmit --noUnusedLocals --noUnusedParameters` (và `packages/db`) | code SHA ghim | exit 0, 0 lỗi (hai cờ vốn đã bật trong `tsconfig.base.json`) | — |
| `node exports.mjs`: mọi export trong bản đồ codemap của hai `CLAUDE.md`, tìm nơi dùng ngoài file (mọi `*.ts/*.tsx/*.mjs` của repo) | toàn repo | 6 hàm SP chỉ test dùng + 1 bí danh export; còn lại là kiểu (không tốn gì lúc chạy) hoặc hàm dùng trong chính file / qua `index.ts` | CL-A8 |
| `git grep` từng mã `DbError` có bị ném không | `errors.ts` ↔ `packages/db/src` | 0 mã thừa (`INVALID_AMOUNT` / `AMOUNT_TOO_LARGE` ném qua biểu thức ở `common.ts:97`; `DATA_REPLACING` do app ném) | — |
| `pnpm lint:deps` | `apps` + `packages` | `no dependency violations found (309 modules, 1244 dependencies cruised)`; `domain` không import gì | — |
| Đọc tìm code lặp ≥ 3 nơi | `packages/db/src`, `packages/domain/src` | `update<X>Row` ×5, tra `seq` kế tiếp ×5, `find/live<X>` ×6; `yearBefore` ×2; (try/catch quanh `calendarDate` ×4 thuộc ghi chú KNOWN #465, không nhắc lại) | CL-A9 |
| Dependency | `packages/db/package.json`, `packages/domain/package.json` | `domain`: 0 dependency. `db`: `drizzle-orm`, `sql.js`, `zod`, `@p2c/domain`, `@p2c/ai` — đều dùng (`zod` cho phong bì backup). `db` trộn drizzle và SQL thô (`selectRows`) có lý do đo được (T-151, doc comment `common.ts:118`) | — |
| Bundle | `common\baseline.md` (phiên 2 không build lại vì đột biến đang chạy trên cùng worktree; phiên 3 cũng không chạy lại: bundle ở đúng SHA ghim đã đo trong baseline, nên build lại không thêm số mới. Muốn tách phần của gói A thì cần visualizer, là G4) | gói A nằm trong `assets/index.js` (891 942 B); `seed.ts` + `seed-data.ts` đóng gói theo spec Phase 3 §7 (app sinh seed lần đầu) | — |
| Đề xuất refactor | — | CL-A8 (≈ −45 dòng), CL-A9 (≈ −40 dòng); test giữ hành vi: toàn bộ test `packages/db` + golden, không đổi golden. Không cần công cụ mới | CL-A8, CL-A9 |

## 4b. Hiệu năng

Máy: Home PC (i9-12900K), Node v24.20.0, hàm thuần của `@p2c/db` / `@p2c/domain` trên `common\load\load-2026-10-12-seed6.p2cbackup` nhập bằng `importBackup` (1 496 KH, 10 414 lịch hẹn, Thùng rác 15 KH / 80 lịch / 18 HĐ / 3 người / 1 team). Codex chạy song song (xem §1). Trung vị (min–max), số lần ghi ở cột. Không đo trên exe (exe tham chiếu ở `perf-ref.json`; phiên này không mở exe để khỏi va với bên khác).

| Thao tác (Node) | Lần | Trung vị | Min–max | So với | ID |
|---|---:|---:|---|---|---|
| `importBackup` dữ liệu tải | 3 | 686,6 ms | 677,7–802,6 | exe `backup.read` 794 ms (`perf-ref`), ngưỡng ≤ 2 000 ms | — |
| Phân rã `importBackup` (phiên 3, `s2-perf-import.mjs`, `s3-perf-import.log`, 22:41; file 16 034 641 B): `JSON.parse` / cả `importBackup` / `validateBackupValues` / `validateBackupInvariants` (riêng trên DB đã nhập) / `exportBackup` / `openDatabase(bytes)` (file DB 12,8 MB) | 5 | 23,6 / 689,2 / 173,8 / 131,8 / 169,3 / 2,4 ms | 22,9–30,0 / 680,9–795,5 / 168,8–206,9 / 131,0–137,8 / 168,0–179,3 / 2,2–9,3 | Hai lượt kiểm ≈ 306 ms (44 %). ≈ 360 ms còn lại chưa tách đo; theo `backup.ts:83-105` đó là `parse` (gồm `JSON.parse` 24 ms và phong bì zod), mở DB tạm, `load` (`valueOf` từng ô + chèn dòng), `migrate`, `staging.export()` và mở lại DB. Đạt ngưỡng ≤ 2 000 ms; khớp lượt đo phiên 2 (686,6 ms). Lúc đo: CPU 4 %, có tiến trình `codex` (3), `project2c` (1), `opencode` (1), `muse-bin` (1) đang mở | — |
| `exportBackup` | 3 | 169,3 ms | 168,7–171,1 | exe `backup.export` 424 ms, ngưỡng ≤ 1 000 ms | — |
| `db.export()` (bytes, cho lưu file) | 3 | 2,2 ms | 1,9–2,4 | exe `db.save` 140 ms (phần Rust ghi file, gói B) | — |
| `listCustomers` / `listStageTransitions` / `listAppointments` / `listPolicies` | 5 | 5,2 / 9,7 / 45,4 / 6,9 ms | | đọc một lần mỗi revision (`tables.ts`) | — |
| `countRecords` | 5 | 4,7 ms | 4,6–5,1 | | — |
| `listTrash` (dữ liệu tải) | 5 | 43,9 ms | 40,9–49,0 | exe `trash.open` 80 ms, ngưỡng < 200 ms | — |
| `listTrash` theo số KH đã xóa 50 / 100 / 200 / 400 | 5 | 114,9 / **211,2** / 412,3 / 814,8 ms | | ngưỡng < 200 ms | CL-A1 |
| `listTrash`, 400 KH đã xóa + chỉ mục tạm `customer_id` | 5 | 48,3 ms | | | CL-A1 |
| `listTrash`, thêm 520 lịch + 300 HĐ đã xóa | 5 | 80,7 ms | | ≈ 0,05 ms / dòng | — |
| `getKycProfile` / `listKycVersions` / `listAiAnalyses` / `listAppointments` / `countCustomerRecords` (1 KH nhiều AI nhất) | 20 | 0,1 / 0,1 / 0,1 / 1,4 / 2,0 ms | max 6,2 ms | exe `customer.open-ai` 20 ms | — |
| `periodMetrics` năm / `periodMetricsByScope` năm + mọi RE / `appointmentCountsByScope` năm | 5 | 1,3 / 1,4 / 1,3 ms | max 2,2 | | — |
| `stageSnapshotSeries` 12 mốc năm / `stageSnapshotByScope` | 5 | 2,6 / 0,8 ms | max 3,8 | | — |
| Một lệnh mỗi lần (20 lần mỗi lệnh, không kể lưu file): `createCustomer`, `scheduleAppointment`, `recordMeetingOutcome` (RF), `editMeetingOutcome` (dời ngày), `recordKycNote` (2 dữ kiện), `softDelete/restoreAppointment`, `softDelete/restoreCustomer`, `softDeletePerson` (bị từ chối), `countCustomerRecords` (hộp 5f) | 20 | 0,62 / 0,24 / 0,45 / 0,85 / 0,35 / 0,56–0,45 / 0,10–0,16 / 0,16 / 1,95 ms | max 5,56 ms | | — |

Không có phép tính bậc hai trên N trong `domain` (đã đọc: `markIndexer` một mảng theo ngày, `stageSnapshotSeries` tìm nhị phân, `*ByScope` gom theo RE một lượt). Truy vấn thiếu chỉ mục chỉ đáng kể ở CL-A1; các truy vấn theo `re_id` / `person_id` (`ownsLiveRecords`, `coordinatesLiveAppointment`) cũng quét bảng nhưng chỉ chạy khi xóa / đổi người (0,16 ms).

## 5. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical / High / Medium | | | | | | | | | | 0 |
| Low | CL-A2*, CL-A3 | CL-A2* | | | | CL-A1 | | CL-A4, CL-A5, CL-A7 | | 6 |
| Nit | CL-A6 | CL-A10 | | | | | CL-A8, CL-A9 | | | 4 |

\* CL-A2 gắn hai trục, đếm một lần. CONFIRMED 10/10, không có PLAUSIBLE. Phần "giá trị vô hình làm hạng mục KYC đã có" của CL-A3 phiên 2 để PLAUSIBLE; phiên 3 đã chạy `s2-zw-gate.mjs` và xác nhận.

## 6. Đã xét, không thấy

- **E — edge case.** Ngày: đã đọc code và đối chiếu bảng §3, §3.1, C01–C11 của spec Phase 4 với test có sẵn (`period.test.ts:259-261`, `compare.test.ts` C01–C11). Các đột biến cạnh ngày / kỳ N4, N5, N6, N35, N38, N46, N47 đều bị test giết. Phiên 3 chạy `node s2-domain-edges.mjs` (log `s3-domain-edges.log`), mọi dòng khớp spec / doc comment:
  - năm, miền ngày: `parseQuickDate "29/02"` hôm nay 15/05/2027 → `invalid-date` kèm gợi ý 29/02/2028; `"01/01"` hôm nay 31/12/2100 → 01/01/2100, không gợi ý năm 2101; `"07/09/26"` → `format`; `fromIsoDate "2101-01-01"` → `RangeError`;
  - tuần cuối miền: tuần 31/12/2100 bị cắt còn `27/12/2100–31/12/2100`, `canShift +1` → `false`;
  - trần kỳ Tùy chọn: `customRangeMaxEnd` 31/01/2027 → 30/04/2027, 30/11/2026 → 28/02/2027; dời ‹ kỳ 16/07–15/10/2027 → `RangeError … 15/04/2027 – 15/07/2027 is over 3 months`, tức nút ‹ tắt qua `canShift`, đúng dòng mẫu `phase-4-chi-so.md:105`;
  - so sánh kỳ: `comparisonWindows` tháng 03/2027 → kỳ trước `01/02–28/02/2027`; năm 2028 xem ngày 29/02 → kỳ trước `01/01–28/02/2027`; tháng 01/1900 → `null`;
  - mốc biểu đồ / báo cáo: `chartMarks` 31 ngày → 31 mốc, 32 ngày → 2 mốc tháng; `reportMarks` 02/2027 → 4 tuần T2–CN;
  - thứ trong tuần: `weekdayOf` 01/01/1900 = 1 (T2), 31/12/2100 = 5 (T6).

  Số: `formatVndCompact` 999 994 999 → `999,99 tr`, 999 995 000 → `1 tỷ`; `formatPercent` −0,04 → `0` (không có "−0"), −0,05 → `-0,1`; `formatFileSize` 1 048 575 → `1 MB`. Số âm của `formatVndCompact` (`-1,5 tr`, dấu `-` ASCII) không hiện ở UI: mọi nơi gọi đều đưa số không âm hoặc `Math.abs` (`policy-form.ts:115`), còn Δ dùng `formatVndDelta` với dấu `−`. Tiền: `money-probe.mjs` + `s2-domain-edges.mjs` — `1tr5` → 1 500 000, `1 tỷ 2` → 1 200 000 000, `0,5tr` → 500 000, `12,5` → `fraction`, `-0` → `negative`, `1e6` / chữ số toàn khổ → `format`, `9007199254740993` → `too-large`; `,`/`.` + 3 chữ số là nhóm nghìn (`1,500 tỷ` → 1 500 tỷ, `1,234 tr` → 1,234 tỷ) — đúng doc comment `money.ts:57-62`, ô nhập hiện lại số đã hiểu (`outcome.caseSizeRead`, `policyForm.fypRead`) và lệnh chặn > 100 tỷ, nên không báo. Hai thao tác chồng nhau / tắt giữa chừng: thuộc gói B (S-2); trong `db` mỗi lệnh là một transaction đồng bộ (fuzz: lệnh bị từ chối không đổi dữ liệu, 0 lần lệch). Chữ: CL-A3, CL-A6.
- **C — hợp đồng / spec.** Đối chiếu từng luật bảng §4 và §6 (luật 1–10) spec Phase 3, §4.2 TR-1…TR-10 / E1–E16 spec Phase 6, §1–§4 spec Phase 4 (4 nhóm lịch, ảnh chụp cuối kỳ, miền 1900–2100, trần 3 tháng, C01–C11, M01–M04) với code; golden G01–G22, A01–A13, S01–S13, M01–M04 so tay từng số với fixture: khớp. Lệch còn lại: CL-A2, CL-A10.
- **D — dữ liệu.** `node fuzz.mjs <seed> 1500` với 8 seed mới (21–28), tổng 12 000 lệnh công khai của `db` với tham số kiểu UI trên seed nhỏ có Thùng rác, đồng hồ đi tới (log `s2-fuzz-21..28.log`): sau mỗi lệnh nhận → `validateBackupValues` + `validateBackupInvariants` (luật nhập backup) nhận; lệnh bị từ chối không đổi dữ liệu; mỗi 100 bước mọi dòng `listTrash` có `blocked` trùng lỗi của lệnh `restore…` chạy trên bản chép (mã + params), hộp TR-8 nói đúng việc khôi phục làm (tổng 617 lần kiểm khôi phục KH / 119 lần kiểm khôi phục cuộc gặp Đã gặp); mỗi 250 bước xuất → nhập → xuất cho cùng `tables`. Kết quả: `findings: 0` cả 8 seed; không lệnh nào ném lỗi khác `DbError`. Đột biến luật nhập backup (M1–M4, N8–N12, N44, N45) và luật lệnh (M5–M7, M11–M13, M16, N14, N24, N25, N29, N41–N43) đều bị test giết. Transaction: `database.ts:83-103` rollback / savepoint, `commit` lỗi thì rollback; `persist` của app chỉ xếp hàng (`app-data.ts`), không ném sau COMMIT.
- **G — guardrail AI (phần ở `db`).** `recordAiAnalysis` và nhập backup cùng dùng `analysisLabelsFit` / `analysisContentFits` (luật 12–13), KYC version phải của chính KH (luật 11, đột biến M17 bị giết), AI không ghi vào bảng KYC (chỉ `ai_analyses`, append-only bằng trigger `0006` / `0008`); `storedRawOutput` cắt theo code point, thay NUL (N32 / N31: xem §7). Mức bằng chứng tính ở `domain/evidence-level.ts` từ dữ kiện, không do AI ghi (M14, N15 bị giết).
- **S — ranh giới.** Nhập backup: trần 100 MB trước `JSON.parse` (N45 bị giết), phong bì zod `strictObject`, tên bảng / cột lấy từ `sqlite_master` / `pragma_table_info` rồi `quote()` — khóa của file chỉ so tập, không vào SQL; `__proto__` trong file → không trùng tên bảng / cột → `BACKUP_INVALID`; NUL trong text bị chặn ở `valueOf`. Bảng `settings` đi vào backup, comment `settings.ts:3-5` nói không chứa key (key ở gói B / C). Không thấy gì thêm ngoài CL-A3 / CL-A6 (chữ dán vào).
- **P — hiệu năng.** Xem bảng §4b; ngoài CL-A1 mọi hàm gói A trên dữ liệu tải ≤ 50 ms (trừ nhập / xuất backup, có ngưỡng riêng và đạt).
- **B — bloat.** Xem bảng §4.
- **T — test.** Đột biến 59 mutant (§7): 4 sống, 3 thành phát hiện (CL-A4, CL-A5, CL-A7); E1–E16, C01–C11, golden G/A/S/M đều có test. Test phụ thuộc đồng hồ thật: `ids.test.ts` (chỉ kiểm dạng ULID), `money.test.ts:207` (đo thời gian, lấy min của 5 lần, ngưỡng 20 ms — hợp lý); các test mở DB không ghim đồng hồ dùng seed có ngày neo 15/09/2026 nên chỉ cần đồng hồ thật ≥ ngày neo. Ghi chú DR-15 / Auckland là KNOWN.
- **A — trợ năng / i18n.** Gói A không có UI. Chuỗi tiếng Việt trong `domain` / `db` là nội dung đã duyệt G2 (câu hỏi gợi ý, `KYC_INSUFFICIENT_MESSAGE`) hoặc dữ liệu (ghi chú `SYSTEM`, "Cập nhật KYC dd/mm/yyyy" — ACCEPTED trong `known.md`). Định dạng số / ngày (`groupThousands` dấu `.`, thập phân `,`, `dd/mm/yyyy`, `−` U+2212 cho Δ) đúng ADR-0013 / quy ước Phase 4.

## 7. Phụ lục

**Script (thư mục `claude\A\`, đọc repo bằng hook nạp TypeScript `hooks.mjs`):** `fuzz.mjs` (fuzz lệnh ↔ luật nhập ↔ Thùng rác ↔ xuất/nhập; log `s2-fuzz-21..28.log`), `s2-scenarios.mjs` (S1–S4, `s2-scenarios.log`), `m15-probe.mjs`, `text-probe.mjs`, `money-probe.mjs`, `perf.mjs` (`s2-perf.log`), `perf-trash.mjs` (`s2-perf-trash.log`), `s2-perf-trash2.mjs` (`s2-perf-trash2.log`), `perf-cmd.mjs` (`s2-perf-cmd.log`), `exports.mjs` (`s2-exports.log`), `s2-mutate.mjs` (`s2-mutate.log`, `s2-mutate-results.json`). Phiên 2 viết bốn probe rồi chưa kịp chạy. Phiên 3 đọc hết từng file: cả bốn chỉ import code repo qua `hooks.mjs`, không ghi file nào trong repo. Rồi chạy, exit 0 cả bốn, log tiền tố `s3-`: `s2-m10-probe.mjs` → `s3-m10-probe.log` (CL-A5), `s2-zw-gate.mjs` → `s3-zw-gate.log` (CL-A3), `s2-domain-edges.mjs` → `s3-domain-edges.log` (§6 E), `s2-perf-import.mjs` → `s3-perf-import.log` (§4b; nhãn "file 15,7 MB" trong probe là chữ viết sẵn, cỡ thật 16 034 641 B). `s2-draft.md` là khung báo cáo của phiên 2 (có chỗ trống `<<…>>`), không phải bằng chứng.

**Đột biến** (`s2-mutate.mjs`: patch một file trong worktree, chạy test gói A `--bail=1`, sống thì chạy cả bộ vitest; trả file về từng byte, so với `git show HEAD:` trước mỗi lần). Xong cả 59/59. Phiên 3 đếm lại trong `s2-mutate-results.json`: 59 dòng, 4 sống, 55 bị giết. Dòng cuối `s2-mutate.log` là `git status --short after: ""`:
- **Sống (cả 2 755 test xanh):** M10 (CL-A5), M15 (CL-A4), N19 (CL-A7), N1 (thứ tự khi hai bản ghi xóa cùng mili-giây — gần tương đương, mỗi lần xóa là một lệnh riêng; không thành phát hiện).
- **Bị giết (55):** M1–M9, M11–M14, M16–M18, N2–N6, N8–N18, N20, N22, N24, N25, N29–N33, N35, N36, N38, N40–N49, N52 (tên test giết từng mutant ở `s2-mutate.log`).
- Lúc phiên 2 dừng, N44–N49 và N52 còn đang chạy. Phiên 3 đọc `s2-mutate.log`: cả bảy đều bị giết (tên test đã ghi ở dòng trên).

**`git status --short` cuối phiên:** rỗng. Phiên 2: dòng cuối `s2-mutate.log` là `git status --short after: ""`. Phiên 3, lúc 22:43: `git rev-parse HEAD` → `885534549808f42aec7f9af5743bbf86642ee4bd`, `git status --short` → rỗng.

**Giờ xong:** phiên 2 dừng giữa chừng vì hết hạn mức sử dụng; phiên 3 (làm tiếp) xong lúc 13/10/2026 22:44 (+07:00).


