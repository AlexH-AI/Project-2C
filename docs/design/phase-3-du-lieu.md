# Phase 3 — Mô hình dữ liệu và lưu trữ (spec G2)

- **Trạng thái:** Accepted — Owner duyệt 26/09/2026 (**G2** mô hình dữ liệu; **G1** ADR-0016 + phụ lục ADR-0006 + P1; **G4** dependency) · PR #58 · bổ sung D9 `outcome_reviewer_id` (Owner, G3 vòng 1 của #59, 27/09/2026) · bổ sung D10 ngày transition không lùi (Owner, G8, #99/#100, 27/09/2026)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §4.4, §5 (Phase 3), §7.1; ADR-0004…0008, ADR-0010, ADR-0016; mockup G3 `docs/design/mockups/`
- **Cách soạn:** brainstorming với Owner trong phiên 26/09/2026 (quyết định ở §1); Claude soạn, Owner duyệt trên PR.

## 0. Mục tiêu

Phase 3 cho phép **nhập liệu hoàn chỉnh** trong app: Team/nhân sự, KH, KYC, lịch hẹn, kết quả cuộc gặp, HĐ — lưu vào SQLite, có dữ liệu giả lập 3 team × 10 RE × ~12 tháng, xuất/nhập file backup. Spec này chốt **mô hình dữ liệu** và **cách lưu** để các issue Phase 3 code được mà không phải quay lại sửa schema.

## 1. Quyết định của Owner (26/09/2026)

| # | Câu hỏi | Quyết định |
|---|---|---|
| D1 | Kiến trúc lưu trữ | **sql.js ở mọi nơi**, exe ghi file qua lệnh Rust mỏng — ADR-0016 |
| D2 | Ngày sinh / giới tính | **Hồ sơ KH là gốc.** Chỉ sửa ở form KH; mỗi lần lưu app tự ghi một ghi chú KYC nguồn `SYSTEM` kèm dữ kiện `birthYear` / `gender` để cổng KYC đọc được. Form dữ kiện KYC khóa hai trường này → không lệch, không mâu thuẫn |
| D3 | Dời lịch | **Tạo cuộc hẹn mới** ở ngày mới, trỏ `rescheduled_from_id` về cuộc hẹn cũ; cuộc hẹn cũ giữ trạng thái Dời lịch |
| D4 | Xóa dữ liệu nhập nhầm | **Xóa mềm** (`deleted_at`), khôi phục được. Ghi chú KYC không bao giờ xóa (ADR-0008) |
| D5 | Nhập file backup | **Thay toàn bộ** dữ liệu (hỏi xác nhận, tự backup trước). Gộp thông minh để Phase 6 |
| D6 | Kết quả cuộc gặp Đã gặp | Bắt buộc `stage_after` + `next_step`; `expected_case_size` **được để trống** (= chưa ước lượng) |
| D7 | Sửa/xóa cuộc hẹn đã sinh transition | Chỉ khi transition đó còn là **transition mới nhất** của KH; nếu không → chặn, hướng dẫn sửa nhóm tay. Khi bị chặn chỉ **khóa 3 ô**: trạng thái, ngày cuộc hẹn, `stage_after`; các ô khác (việc tiếp theo, case size, ghi chú, trigger, người phối hợp, người đánh giá kết quả) vẫn sửa được; xóa vẫn bị chặn (Owner, G3 vòng 1, 27/09/2026 — mockup 6f) |
| D8 | Nhân sự seed | Mỗi team 1 TL + 10 RE; **1 IS, 1 BD, 1 BDM** dùng chung cho cả 3 team |
| D9 | Lý do hạ nhóm / đóng (Owner, G3 vòng 1, 27/09/2026) | **Không hỏi lý do.** Hạ nhóm / đóng là quyết định khi review kết quả cuộc gặp gần nhất → ghi **người đánh giá kết quả** (`appointments.outcome_reviewer_id`, không bắt buộc, vd. TL / IS) |
| D10 | Ngày của transition (Owner, G8, 27/09/2026 — review R1 #99) | **Không lùi ngày.** Transition có ngày sớm hơn transition mới nhất còn hiệu lực của KH bị từ chối (`TRANSITION_BEFORE_LATEST`); transition đầu mang ngày tạo KH nên cũng chặn ngày trước ngày tạo. Cùng ngày thì được, thứ tự trong ngày theo `seq`. Nhờ vậy ngày luôn cùng chiều `seq`, `customers.stage` = `stageOn()` và `from` của transition gắn cuộc hẹn là nhóm vào ngày gặp (RF đúng) |

**Đề xuất ngoài mô hình dữ liệu (Owner duyệt G1, 26/09/2026):**

| # | Đề xuất | Cổng |
|---|---|---|
| P1 | Ngưỡng cỡ task (ADR-0001): **≤ ~400 dòng code sản phẩm** (không tính test) và **≤ ~800 dòng tổng diff** kể cả test; không tính file sinh tự động (lockfile, migration SQL, snapshot drizzle-kit, bảng dữ liệu tĩnh của seed) — PR phải liệt kê các file không tính. Lý do: phần cần review kỹ giữ nguyên mức cũ; chỉ nới cho test. Sửa trong PR này: ADR-0001 (phụ lục), `CLAUDE.md`, `REVIEW-CHECKLIST.md`, `docs/agents/issue-tracker.md` | G1 |

## 2. Quy ước chung

- **ID**: ULID dạng text (26 ký tự) cho mọi bảng, sinh trong app (không thêm dependency). KH có thêm `code` ngẫu nhiên, duy nhất, dạng `K-` + 4 ký tự Crockford base32 (vd. `K-9A1C`) — "ID ẩn" hiện trên UI (mockup G3).
- **Ngày**: text `YYYY-MM-DD` (↔ `CalendarDate` của `domain`). **Giờ**: text `HH:MM`, không bắt buộc. **Mốc thời gian** (`created_at`, `updated_at`, `deleted_at`): text ISO-8601 UTC.
- **Tiền**: số nguyên VND (↔ `Vnd`). Chuyển đổi qua hàm của `domain`, không tự parse.
- **Enum**: text có `CHECK`, giá trị = hằng số trong `domain` (`PERSON_ROLES`, `APPOINTMENT_STATUSES`, `CustomerStage`, `KYC_FACT_STATUSES`, `KYC_FIELDS`).
- **Thứ tự thao tác**: cột `seq` (số nguyên tăng dần theo từng KH) ở `stage_transitions`, `kyc_notes`, `kyc_facts`, `kyc_versions`. "Mới nhất" = `seq` lớn nhất, **không** theo ngày (ghi chú review #36).
- **Xóa mềm**: bảng sửa được có `created_at`, `updated_at`, `deleted_at`. Mọi truy vấn đọc và mọi chỉ số bỏ qua bản ghi có `deleted_at`. Bản ghi con của KH đã xóa bị ẩn theo KH.
- Khóa ngoại bật (`PRAGMA foreign_keys = ON`); không xóa cứng nên không dùng `ON DELETE CASCADE`.

## 3. Schema

### 3.1 `teams`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| `id` | text | PK |
| `name` | text | not null, duy nhất trong các team chưa xóa |
| `created_at` / `updated_at` / `deleted_at` | text | |

### 3.2 `people`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| `id` | text | PK |
| `name` | text | not null |
| `role` | text | `RE` / `TL` / `IS` / `BD` / `BDM` |
| `team_id` | text | FK `teams`; **bắt buộc** với RE và TL, **luôn trống** với IS/BD/BDM (#252) |
| `created_at` / `updated_at` / `deleted_at` | text | |

Team hiện tại của RE = `team_id` (v1 không lưu lịch sử chuyển team — ADR-0007 G2 E).

### 3.3 `customers`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| `id` | text | PK |
| `code` | text | not null, duy nhất |
| `name` | text | not null |
| `re_id` | text | FK `people` (role RE) |
| `birth_date` | text | `YYYY` hoặc `YYYY-MM-DD`; **không bắt buộc** (KH N4 có thể chưa rõ danh tính — cổng KYC phải gặp được ca thiếu danh tính) |
| `gender` | text | `MALE` / `FEMALE`, không bắt buộc |
| `stage` | text | `CustomerStage`; luôn bằng `to_stage` của transition mới nhất chưa xóa — cập nhật trong cùng transaction |
| `created_at` / `updated_at` / `deleted_at` | text | |

Không lưu: ngày tạo KH (= ngày của transition đầu tiên), nhãn "Đã có HĐ" (đếm HĐ chưa xóa), "Lần gặp thứ n" (đếm cuộc hẹn Đã gặp).

### 3.4 `stage_transitions`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| `id` | text | PK |
| `customer_id` | text | FK `customers` |
| `seq` | integer | duy nhất theo `customer_id` |
| `from_stage` | text | null chỉ ở transition đầu tiên (tạo KH) |
| `to_stage` | text | not null |
| `date` | text | ngày chuyển |
| `appointment_id` | text | FK `appointments`; **luôn có** khi transition sinh từ kết quả cuộc gặp (#44); null khi sửa tay |
| `created_at` / `deleted_at` | text | chỉ "hủy" qua D7, không sửa |

### 3.5 `appointments`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| `id` | text | PK |
| `customer_id` | text | FK `customers` |
| `re_id` | text | FK `people` (role RE) — RF tính cho RE này |
| `date` | text | ngày gặp; RF tính vào ngày này |
| `time` | text | `HH:MM`, không bắt buộc |
| `status` | text | `SCHEDULED` / `MET` / `RESCHEDULED` / `CANCELLED` / `NO_SHOW` |
| `trigger_type` | text | `REFERRAL` (Giới thiệu từ KH) / `ASSET_MATURITY` (Đáo hạn tài sản) / `EVENT` (Hội thảo / sự kiện) / `OCCASION` (Sinh nhật, dịp đặc biệt) / `OTHER` (Khác) — theo mockup G3 |
| `trigger_note` | text | mô tả tự do, không bắt buộc |
| `stage_after` | text | `CHECK (status = 'MET' OR stage_after IS NULL)`; bắt buộc khi `MET` (D6) |
| `next_step` | text | bắt buộc khi `MET` (D6) |
| `expected_case_size` | integer | VND, không bắt buộc (D6) |
| `note` | text | kết quả cuộc gặp dạng văn bản |
| `outcome_reviewer_id` | text | FK `people`, không bắt buộc; `CHECK (status = 'MET' OR outcome_reviewer_id IS NULL)`. Người quyết định nhóm sau cuộc gặp (D9), vai trò bất kỳ. Không có chỉ số; không thuộc 3 ô bị khóa theo D7 |
| `rescheduled_from_id` | text | FK `appointments`, cuộc hẹn bị dời (D3) |
| `created_at` / `updated_at` / `deleted_at` | text | |

### 3.6 `appointment_coordinators`

`appointment_id` (FK), `person_id` (FK `people`, khác `re_id` của cuộc hẹn); PK (`appointment_id`, `person_id`). Người phối hợp không có chỉ số (ADR-0007 G2 G).

### 3.7 `policies`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| `id` | text | PK |
| `customer_id` | text | FK `customers` |
| `re_id` | text | FK `people` (role RE) — HĐ tính cho RE này |
| `submitted_date` | text | not null |
| `submitted_fyp` | integer | > 0 |
| `issued_date` | text | ≥ `submitted_date`; cùng có hoặc cùng trống với `issued_fyp` |
| `issued_fyp` | integer | > 0; mặc định = `submitted_fyp` khi phát hành, sửa tay được (G2 D) |
| `created_at` / `updated_at` / `deleted_at` | text | |

### 3.8 `kyc_notes`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| `id` | text | PK |
| `customer_id` | text | FK `customers` |
| `seq` | integer | duy nhất theo KH |
| `text` | text | not null |
| `created_date` | text | |
| `source` | text | `RE` / `SYSTEM` (D2) |
| `created_at` | text | **không có** `updated_at` / `deleted_at`: không sửa, không xóa |

### 3.9 `kyc_facts`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| `id` | text | PK |
| `customer_id` | text | FK `customers` |
| `seq` | integer | duy nhất theo KH |
| `field` | text | khóa của `KYC_FIELDS`; hạng mục suy từ catalog, không lưu |
| `value_json` | text | JSON của `KycValue` (string / number / boolean) |
| `note_id` | text | FK `kyc_notes`, cùng KH |
| `confirmed_date` | text | |
| `status` | text | `active` / `superseded` / `conflict` — cột duy nhất được đổi |
| `created_at` / `updated_at` | text | không xóa |

### 3.10 `kyc_versions`

`id`, `customer_id`, `seq`, `hash`, `date`, `material` (0/1), `created_at`. Tóm tắt "Cập nhật KYC dd/mm/yyyy" sinh từ `date` bằng `formatDate` của `domain`, không lưu. Phase 5 (`ai_analyses`) tham chiếu `kyc_versions.id`.

### 3.11 `settings`, `schema_migrations`

- `settings`: `key` (PK), `value_json`, `updated_at`.
- `schema_migrations`: `id` (số hiệu migration), `applied_at`. `schemaVersion` của DB = số hiệu lớn nhất.

### 3.12 Chưa làm ở Phase 3

`ai_analyses` (Phase 5, thêm bằng migration mới); `legal_sources` (v2).

## 4. Ghi dữ liệu — lệnh nghiệp vụ

UI **không ghi thẳng vào bảng**; mọi thay đổi đi qua lệnh nghiệp vụ trong `packages/db`. Mỗi lệnh chạy trong **một transaction**, kiểm quy tắc bằng hàm của `domain`, lỗi → rollback toàn bộ và trả lỗi có mã (UI hiện qua i18n). Transaction thành công → báo cổng lưu file (§5).

| Lệnh | Quy tắc chính |
|---|---|
| `createTeam`, `renameTeam`, `createPerson`, `updatePerson`, `restorePerson` | RE/TL phải có team; IS/BD/BDM kèm team → `TEAM_NOT_ALLOWED` (#252; đổi RE/TL sang IS/BD/BDM phải truyền `teamId: null`, UI tự bỏ team); mỗi team tối đa 1 TL chưa xóa (Owner, G3 01/10/2026): tạo / đổi / khôi phục nhân sự thành TL thứ hai → `TEAM_HAS_LEAD` (B1b) |
| `createCustomer` | Chỉ ở nhóm mở N4–N1 (`assertValidTransition`, ADR-0007); ghi transition đầu (`from` null); nếu có ngày sinh/giới tính → ghi chú `SYSTEM` + dữ kiện (D2) |
| `updateCustomerProfile` | Đổi tên / RE / ngày sinh / giới tính; đổi ngày sinh hoặc giới tính → ghi chú `SYSTEM` + `confirmFact` |
| `changeStageManually` | `assertValidTransition`; transition `appointment_id` null — không bao giờ tính RF; ngày không được trước transition mới nhất (D10), không được sau hôm nay → `DATE_IN_FUTURE` (F-11, #258) |
| `scheduleAppointment` | Trạng thái `SCHEDULED`, không có `stage_after` |
| `recordMeetingOutcome` | Đặt trạng thái + kết quả. `MET`: bắt buộc `stage_after`, `next_step` (D6); `stage_after` ≠ nhóm hiện tại → transition gắn `appointment_id` (#44); `outcome_reviewer_id` tùy chọn, phải là nhân sự chưa xóa (D9). Sửa lại kết quả → theo D7. Transition mang ngày cuộc hẹn → ghi kết quả muộn bị từ chối (D10) nếu KH đã có transition ngày muộn hơn; `MET` với `stage_after` = nhóm hiện tại, `CANCELLED`, `NO_SHOW` không sinh transition nên vẫn ghi được |
| `rescheduleAppointment` | Cuộc hẹn cũ → `RESCHEDULED`; tạo cuộc hẹn mới `SCHEDULED` trỏ `rescheduled_from_id` (D3) |
| `addKycNote` | Chỉ thêm |
| `confirmKycFact`, `markKycConflict`, `resolveKycConflict` | Dùng `confirmFact` / `markConflict` / `resolveConflict` của `domain`; từ chối `birthYear` / `gender` từ nguồn RE (D2); `confirmKycFact` / `markKycConflict` trên ghi chú `SYSTEM` → `KYC_NOTE_FROM_PROFILE` (ghi chú `SYSTEM` chỉ do hồ sơ KH ghi, #263); sau đó `nextKycVersion` → ghi `kyc_versions` nếu hash đổi; cờ material tay theo ADR-0008 §7 |
| `submitPolicy`, `issuePolicy`, `updatePolicy` | Ràng buộc §3.7; FYP qua `Vnd`; ngày nộp / ngày phát hành sau hôm nay → `DATE_IN_FUTURE` (F-11, #258) |
| `softDelete…`, `restore…` | D4; không xóa được team / nhân sự còn được tham chiếu bởi bản ghi chưa xóa; xóa cuộc hẹn có transition theo D7 (transition bị hủy, `customers.stage` về `from_stage`); khôi phục cuộc hẹn `MET` mà transition của nó giờ lùi ngày → từ chối (D10), cuộc hẹn vẫn bị xóa |

**Đọc dữ liệu** qua repository trả về đúng kiểu của `domain` (`Team`, `Person`, `Customer`, `StageTransition`, `Appointment`, `Policy`, `KycProfile`, `KycVersion`). Chỉ số (Phase 4) tính bằng `stats.ts` trên dữ liệu đã nạp — quy mô demo đủ nhỏ để tính trong bộ nhớ.

## 5. Lưu file và khởi động (ADR-0016)

- **Exe**: `Project2C-data\project2c.db` cạnh exe.
  1. Khởi động: lệnh Rust đọc file → sql.js mở. Có file → sao một bản vào `Project2C-data\backups\project2c-s<seq8>-YYYYMMDD-HHMMSS.db` (`seq` = thứ tự ghi, không lấy từ đồng hồ — T-056 #90), giữ 10 bản mới nhất theo `seq`, bỏ bản trùng nội dung → chạy migration còn thiếu.
  2. Chưa có file (lần đầu) → tạo DB, chạy migration, **nạp dữ liệu giả lập** (§7).
  3. Sau mỗi transaction thành công: `export()` → lệnh Rust ghi `.tmp` rồi đổi tên. Các lần ghi xếp hàng tuần tự; ghi lỗi → cảnh báo trên UI, dữ liệu vẫn trong bộ nhớ, thử lại ở lần ghi sau.
- **Web** (`dev:web`, Playwright): DB trong bộ nhớ, migration + seed mỗi lần mở trang, không lưu.
- **Cài đặt → Dữ liệu**: "Nạp lại dữ liệu giả lập" (tự backup trước), xuất/nhập backup (§6).

## 6. Xuất / nhập backup (ADR-0010 B)

- Định dạng `.p2cbackup` (khác `.p2backup` của Project-2): JSON UTF-8, thứ tự khóa cố định, mỗi bảng một mảng sắp theo `id` (bảng nối theo khóa ghép), gồm cả bản ghi xóa mềm:

  ```json
  { "format": "project2c-backup", "schemaVersion": 1, "exportedAt": "2026-09-26T14:00:00Z",
    "tables": { "teams": [], "people": [], "customers": [], "...": [] } }
  ```

  Đây cũng là khuôn snapshot cho đồng bộ `Project-2C-data` ở Phase 6 (ADR-0010 D).
- **Xuất**: lệnh Rust ghi vào `Project2C-data\exports\project2c-YYYYMMDD-HHMM.p2cbackup`, app hiện đường dẫn. **Không bao giờ ghi đè file xuất đã có** (Owner quyết 30/09/2026, #185): tên đã có thì thêm hậu tố `-2`, `-3`… trước `.p2cbackup` (vd hai lần xuất trong cùng một phút → `…-0745.p2cbackup` và `…-0745-2.p2cbackup`), app hiện đường dẫn thật. Tên cuối chỉ xuất hiện khi file đã ghi đủ (giữ tên bằng file `.claim` riêng, ghi `.tmp` rồi đổi tên); xuất bị ngắt giữa chừng chỉ để lại `.claim`/`.tmp`, app dọn khi mở lần sau cùng file `.p2cbackup` rỗng của bản cũ (#187). Web: tải file về (trình duyệt tự đặt tên khi trùng).
- **Nhập** — thay toàn bộ (D5): chọn file bằng `<input type=file>` → kiểm dung lượng → kiểm bằng zod → `schemaVersion` mới hơn app → từ chối, yêu cầu cập nhật app; cũ hơn → dựng DB ở đúng phiên bản đó, nạp, chạy nốt migration → kiểm giá trị từng ô → kiểm bất biến liên bảng → hỏi xác nhận → backup DB hiện tại → thay.
  - **Giới hạn 100 MB** (Owner quyết 30/09/2026, #203): file lớn hơn `MAX_BACKUP_BYTES` bị từ chối ngay, app không đọc file (hộp 10b, câu riêng, mã `BACKUP_TOO_LARGE`). `importBackup` cũng từ chối text dài hơn ngưỡng trước khi parse JSON.
  - **Kiểm giá trị** (#203): SQLite chỉ kiểm kiểu integer/text, CHECK và FK, nên sau khi nạp + migrate app đọc lại mọi hàng (kể cả bản ghi xóa mềm) bằng hàm đọc thuần, không phát lại lệnh nghiệp vụ (sẽ đổi id / `seq` / hash). Sai một ô → `BACKUP_INVALID` (hộp 10b), DB hiện tại không đổi:
    - cột ngày (`date`, `*_date`): `YYYY-MM-DD`, là ngày có thật theo `calendarDate` (từ năm 1900); `birth_date` thêm dạng `YYYY`;
    - `time`: `HH:MM` (00:00–23:59) hoặc null;
    - `created_at` / `updated_at` / `deleted_at`: ISO-8601 UTC như app ghi (`…Z`);
    - `seq` ≥ 1;
    - `kyc_facts.value_json`: JSON parse được, là chuỗi / số / true-false và đã chuẩn hóa theo kiểu của trường (`normalizeKycValue` không đổi giá trị: `"2"` cho `childrenCount` bị từ chối);
    - tiền là số nguyên dương: CHECK của schema.
  - **Kiểm bất biến liên bảng** (#204, `validateBackupInvariants`, chạy sau kiểm giá trị; Phase 6 kéo snapshot dùng lại): các giá trị đều hợp lệ nhưng bảng mâu thuẫn nhau → `BACKUP_INVALID` với params `rule` = số của bất biến đầu tiên bị vi phạm (để chẩn đoán; hộp 10b không đổi), DB hiện tại không đổi. Cũng là hàm đọc thuần trên DB tạm. Quy tắc nói về dữ liệu sống chỉ đọc bản ghi chưa xóa, nên bản ghi xóa mềm / khôi phục theo lệnh nghiệp vụ (D7) vẫn nhận:
    1. Mỗi KH (kể cả đã xóa) có transition đầu là `seq` nhỏ nhất, chưa xóa, `from_stage` null, `appointment_id` null (tạo KH không do cuộc hẹn; `withdrawAppointmentTransition` gặp transition gắn cuộc hẹn mà `from_stage` null → `INVALID_TRANSITION`), `to_stage` là nhóm mở N4–N1; không transition nào khác có `from_stage` null. `seq` duy nhất theo KH: UNIQUE của schema.
    2. `customers.stage` = `to_stage` của transition chưa xóa có `seq` lớn nhất.
    3. Theo `seq`, transition chưa xóa: ngày không giảm (D10), `from_stage` = `to_stage` của transition chưa xóa trước nó, mỗi bước qua `assertValidTransition`.
    4. Transition chưa xóa có `appointment_id` → cuộc hẹn chưa xóa (xóa cuộc hẹn luôn rút transition, D7), cùng KH, `MET`, `stage_after` = `to_stage`, cùng ngày; mỗi cuộc hẹn tối đa một transition chưa xóa.
    5. `re_id` của KH / cuộc hẹn / HĐ **chưa xóa** là người **chưa xóa** vai trò RE (RE đổi vai trò hay bị xóa được khi bản ghi của họ đã xóa, §3.3); RE/TL có team: CHECK của schema; người phối hợp ≠ `re_id` của cuộc hẹn; `rescheduled_from_id` trỏ cuộc hẹn cùng KH, status `RESCHEDULED`.
    6. `kyc_facts.note_id` là ghi chú cùng KH. `seq` ghi chú / dữ kiện / phiên bản duy nhất theo KH: UNIQUE của schema.
    7. Mỗi trường KYC có dữ kiện của một KH: đúng một fact `active` và không `conflict`, hoặc ≥ 2 fact `conflict` và không `active`.
    8. Fact `birthYear` / `gender` đang `active` đến từ ghi chú nguồn `SYSTEM` và khớp `customers.birth_date` (năm) / `gender` (D2). Fact `birthYear` / `gender` đang `conflict` từ ghi chú `SYSTEM` cũng khớp hồ sơ (fact `conflict` từ ghi chú khác giữ quy tắc 7); `resolveKycConflict` chọn fact `SYSTEM` lệch hồ sơ → `KYC_FIELD_FROM_PROFILE`. Mọi fact (mọi trạng thái, kể cả `superseded`) từ ghi chú `SYSTEM` là `birthYear` / `gender` (#263).
    9. Nhân sự (#252, Owner 02/10/2026): (i) mỗi team chưa xóa có tối đa 1 TL chưa xóa (#223); (ii) IS / BD / BDM có `team_id` null, kể cả người đã xóa; (iii) người chưa xóa có `team_id` → team chưa xóa. Dữ liệu cũ sai bị từ chối, không migration (dữ liệu hiện có là giả lập: nạp lại seed).

## 7. Dữ liệu giả lập (seed)

- **Nhân sự**: 3 team theo mockup (Sao Mai, Bình Minh, Hừng Đông), mỗi team 1 TL + 10 RE; 1 IS, 1 BD, 1 BDM dùng chung (D8). Tên tiếng Việt từ danh sách tĩnh.
- **KH**: ~40 KH mỗi RE (~1.200), phân bố đủ N4–N1, có hạ nhóm, Tạm hoãn / Mất cơ hội rồi mở lại về N3.
- **Lịch hẹn**: 12 tháng lùi từ **ngày neo** + 2–4 tuần sắp tới; 3–6 cuộc/RE/tuần (~6.000), đủ 5 trạng thái, có dời lịch, có người phối hợp, đủ 5 loại trigger.
- **HĐ**: ~1.000, có HĐ nộp tháng này phát hành tháng sau, có FYP phát hành sửa tay.
- **KYC**: 1–5 ghi chú/KH, dữ kiện đủ 4 trạng thái cổng (có mâu thuẫn cốt lõi và phụ).
- **Deterministic**: PRNG có seed cố định; cùng ngày neo → dữ liệu giống hệt trên 2 máy. e2e dùng ngày neo cố định; app dùng ngày hôm nay.
- Seed ghi **qua chính các lệnh nghiệp vụ** ở §4 → seed cũng là một bài kiểm tra lớn cho quy tắc. Mã seed nằm trong `packages/db` (app cần gọi được ở lần chạy đầu); `tools/` chỉ có lệnh bọc `pnpm seed` nếu cần.

## 8. Kiểm thử

- **Seam chính**: lệnh nghiệp vụ + repository của `packages/db`, chạy Vitest trên sql.js trong bộ nhớ: mở DB → migration → gọi lệnh → đọc lại → so với kết quả mong đợi. Không test chi tiết SQL. Coverage `packages/db` ≥ 90%.
- **Golden qua DB**: nạp nguyên fixture golden G01–G22 (`metrics.fixture.ts`) và K01–K15 (`kyc.fixture.ts`) vào DB bằng lệnh nghiệp vụ, đọc lại, chạy `stats.ts` / `evaluateKycGate` → phải khớp golden. Fixture **không sửa**.
- **Migration**: DB rỗng → phiên bản mới nhất; schema khớp Drizzle.
- **Backup**: seed → xuất → nhập → xuất lại giống hệt từng byte; file phiên bản mới hơn / hỏng / cũ hơn cần migrate.
- **Bất biến**: `customers.stage` = transition mới nhất chưa xóa; ngày transition không giảm theo `seq` (D10), nên `stageOn(ngày neo)` = `customers.stage`; transition từ cuộc gặp luôn có `appointment_id`; bản ghi xóa mềm không vào chỉ số.
- **e2e** (Playwright, web): luồng nhập chính trên seed với ngày neo cố định.
- **Lớp Rust**: `cargo fmt --check`, `clippy -D warnings`, `cargo test` chạy trong job `build-exe` (T-054), job này chạy khi PR có nhãn `build-exe` — bắt buộc với PR đụng `src-tauri`/Cargo (ADR-0015 phụ lục "Tiết kiệm phút Actions"); local: `pnpm verify:rust`. Hành vi chỉ có trên exe (Explorer, hai process, file khóa) Owner kiểm tay khi đóng phase.

## 9. Lộ trình Phase 3 (dự kiến — tách issue sau khi duyệt spec)

| # | Việc | Cổng | Bị chặn bởi |
|---|---|---|---|
| 1 | Spec này + ADR-0016 + phụ lục ADR-0006 (+ P1) | G1/G2/G4 | — |
| 2 | Mockup màn nhập liệu: form KH, lịch hẹn, ghi kết quả, ghi chú + xác nhận KYC, HĐ, Team & nhân sự, Cài đặt → Dữ liệu | G3 | 1 |
| 3a | Nền `packages/db`: sql.js + Drizzle + bộ chạy migration + teams/people | — | 1 |
| 3b | KH + transition + lịch hẹn + HĐ: schema, lệnh, golden G01–G22 qua DB | — | 3a |
| 3c | KYC: notes, facts, versions, lệnh, golden K01–K15 qua DB | — | 3b |
| 4 | Lưu file trong exe + backup khi khởi động; app mở DB lúc khởi động (web: bộ nhớ) | — | 3a |
| 5 | Seed 3 × 10, nạp khi chạy lần đầu | — | 3c |
| 6 | Màn Team & nhân sự | — | 2, 4, 5 |
| 7 | Khách hàng: danh sách / kanban từ DB, tạo / sửa, sửa nhóm tay | — | 2, 4, 5 |
| 8 | Hồ sơ KH — KYC: ghi chú, xác nhận / mâu thuẫn / giải quyết, phiên bản, dòng thời gian | — | 7 |
| 9 | Lịch hẹn: tạo, dời lịch, bảng trong ngày từ DB | — | 7 |
| 10 | Ghi kết quả cuộc gặp → transition gắn `appointmentId`; **migration mới** thêm `outcome_reviewer_id` (D9 — bảng `appointments` đã có từ migration 0001, không sửa migration cũ) | — | 9 |
| 11 | Hợp đồng: nộp, phát hành, sửa FYP phát hành | — | 7 |
| 12 | Xuất / nhập backup `.p2cbackup` | — | 4 |
| 13 | Đóng phase: `docs/metrics/phase-3.md`, review đóng | G7 | tất cả |

## 10. Ngoài phạm vi Phase 3

- Màn "Thùng rác" khôi phục bản ghi xóa mềm (dữ liệu đã hỗ trợ; UI để sau).
- Gộp backup / phát hiện xung đột, đồng bộ repo `Project-2C-data` (Phase 6).
- Nhập dữ liệu cũ (KH đã mất từ trước) — ADR-0007 để quyết riêng.
- Lịch sử chuyển team của RE (ADR-0007 G2 E).
- `ai_analyses`, AI trích xuất dữ kiện (Phase 5).
- Chỉ số "số lịch dự kiến / đã gặp" và cách đếm cuộc hẹn dời lịch — định nghĩa ở Phase 4 (golden mới, G2).
