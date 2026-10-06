# Deep review Phase 1–4 — gói B (`packages/db`) — Claude

- **SHA:** `f0c53eb57eb7eac8665ad87287e794ae4c5bc43b` (`git rev-parse HEAD` kiểm đầu phiên, worktree `C:\workspace\Project-2C-review`, detached). Cuối phiên `git status` sạch: không sửa file, không commit.
- **Ngày:** 05/10/2026, Home PC. Một phiên, không subagent.
- **Prompt:** Owner dán prompt gói B nhưng còn sót "gói A" ở hai chỗ ("§4 dòng gói A", "phạm vi gói A"). Mọi chỗ khác ghi B (ID `CL-B`, thư mục `claude\B\`, file `B.md`) và `A.md` đã nộp, nên phiên này làm **gói B = `packages/db`** theo §4.
- **Nguồn đã đọc ngoài repo:** `common\README.md`, `common\baseline.md`, `common\known.md`, `common\prompt-claude.md`, `common\load\` (dùng `load-backup.json`, `load-summary.json`), `claude\A.md` (để khỏi lặp). Không mở / liệt kê / tìm trong `codex\`.
- **Probe, test tạm:** `C:\workspace\deep-review-1-4\claude\B\` (nguồn ở phụ lục C, kết quả `*.result.json` cùng thư mục). Chạy bằng alias tới `packages/*/src` của worktree, không ghi vào repo. `node_modules` của thư mục probe là junction tới `node_modules` của worktree; bản sao mutation nằm ở `B\mut\` (xóa sau mỗi lượt) với cache Vite riêng `B\.vite-mut`.

## 1. Phạm vi đã đọc

| File | Dòng | Cách đọc |
|---|---|---|
| `packages/db/src/schema.ts` | 1–284 (toàn bộ) | đọc từng dòng, đối chiếu spec §2–3 |
| `packages/db/migrations/0000…0004*.sql`, `meta/_journal.json` | toàn bộ | đọc từng dòng |
| `src/migrations.ts`, `src/database.ts` | 1–31, 1–188 | đọc từng dòng + probe migration |
| `src/common.ts`, `src/errors.ts`, `src/ids.ts`, `src/index.ts`, `src/metrics.ts`, `src/test-support.ts`, `src/sql-raw.d.ts` | 1–119, 1–78, 1–34, 1–90, 1–16, 1–32, 1–5 | đọc từng dòng |
| `src/team.ts`, `src/customers.ts`, `src/appointments.ts`, `src/policies.ts`, `src/kyc.ts` | 1–301, 1–339, 1–510, 1–148, 1–534 | đọc từng dòng + probe + mutation |
| `src/backup.ts`, `src/backup-validation.ts` | 1–201, 1–302 | đọc từng dòng + probe nhập / xuất |
| `src/seed.ts`, `src/seed-data.ts` | 1–475, 1–80 + danh sách export | đọc `seed.ts` từng dòng, `seed-data.ts` lướt (dữ liệu tĩnh) |
| `src/backup-invariants.test.ts` | 1–606 | đọc từng dòng |
| `src/golden-metrics.test.ts`, `src/seed.test.ts`, `src/seed-invariants.test.ts` | 1–60 + 140–175, 20–42 + 86–95, 25–46 + 175–193 | đọc đoạn |
| Các test còn lại của db (`appointments`, `customers`, `team`, `policies`, `kyc`, `database`, `backup`, `ids`, `common`, `golden-kyc`, `backup-engine`) | cấu trúc `describe/it` + grep | đánh giá bằng 114 mutation (phụ lục A) và quét assertion |
| `packages/db/CLAUDE.md`, `package.json` | toàn bộ | |
| `drizzle-orm/sql-js/session.js` (0.45.3) | 1–143 | xem drizzle gọi `prepare` / `free` ra sao (cho bộ đệm statement của `database.ts`) |
| Tài liệu | `docs/process/deep-review-phase-1-4.md`; `docs/design/phase-3-du-lieu.md` 1–247 (§1–§8); ADR-0007 (grep "phối hợp") | |
| Nơi gọi db (chỉ để kiểm hợp đồng / dùng export / tần suất đọc) | `apps/desktop/src/data/app-data.ts` 180–260, 300–330; `persist-queue.ts` 1–80; `AppDataContext.tsx` 17–41; `Overview.tsx` 18–30; `ReportsScreen.tsx` 22–36; `TeamScreen.tsx` 30–44; `AppointmentsScreen.tsx` 64–76; `CustomerAppointments.tsx` 66–80; `KycDialogs.tsx` 60–137; `customers-view.ts` 97–112; `AppointmentDialog.tsx` 215–240; `appointments-view.ts` 120–131; `team-view.ts` 25–75; `i18n/index.ts` 95–115 | grep + đọc đoạn |

Lệnh đã chạy: `pnpm vitest run packages/db` (316 test xanh, 41 s); cùng lệnh dưới `TZ` = Pacific/Honolulu và Pacific/Kiritimati (CL-B12); `tsc --noEmit --noUnusedLocals --noUnusedParameters` trong `packages/db` (exit 0); `--sequence.shuffle` seed 7 và 99; 114 mutation (phụ lục A); 12 probe (phụ lục C).

## 2. Phát hiện

### CL-B1

```
ID: CL-B1
Mức: Low
Trục: D
Vị trí: packages/db/src/backup-validation.ts:44-53 (validValue), 184-206 (ownerRule), 99-105 (doc của validateBackupInvariants) (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: Đường nhập backup nhận một số trạng thái mà không lệnh nào tạo ra được, dù doc comment của validateBackupInvariants nói nó từ chối "the tables disagree in a way no command could leave them":
  (a) lịch hẹn chưa xóa có người phối hợp hoặc người đánh giá kết quả đã xóa (lệnh xóa người đó báo PERSON_IN_USE);
  (b) tên team / nhân sự / KH rỗng hoặc thừa khoảng trắng, `next_step` rỗng của lịch MET, ghi chú KYC rỗng, `customers.code` tùy ý, id rỗng (lệnh: NAME_REQUIRED, OUTCOME_REQUIRED, KYC_NOTE_EMPTY, mã `K-` + 4 ký tự, ULID);
  (c) hai lịch hẹn chưa xóa cùng dời từ một lịch, một lịch dời từ chính nó (lệnh: đúng một lịch thay thế).
Tái hiện / bằng chứng: probe-gaps.test.ts (case 1–3) và probe-values.test.ts → cả ba nhóm "accepted". Sau khi nhập (a): `editMeetingOutcome` giữ nguyên kết quả + người phối hợp → PERSON_NOT_FOUND; `updateAppointmentDetails` chỉ gửi lại người phối hợp → PERSON_NOT_FOUND. Đối chứng: trên dữ liệu tải (sinh qua lệnh) mọi trạng thái trên đếm bằng SQL đều = 0 (probe-seedinv.result.json).
Ảnh hưởng: chỉ gặp với file backup sửa tay / hỏng, hoặc snapshot Phase 6 (spec §6 nói validateBackupInvariants sẽ được dùng lại). Với (a): lưu hộp 6f của lịch đó báo lỗi khi người đánh giá đã xóa (UI tự bỏ người phối hợp đã xóa nhờ `liveIds`; người đánh giá thì giữ nguyên id cũ theo đọc code MetFields.tsx:34, 101-108, chưa chạy UI). Với (b): dòng tên trống trên bảng, bộ chọn RE có mục trống.
Đề xuất: kiểm giá trị thêm tên / `next_step` MET / `kyc_notes.text` = trim và không rỗng; luật 5 thêm "người phối hợp và người đánh giá của lịch chưa xóa là người chưa xóa", "mỗi lịch RESCHEDULED tối đa một lịch thay thế, không trỏ chính nó". Cập nhật spec §6 cùng lúc. ≈ 40 dòng SP + 10 dòng test.
```

### CL-B2

```
ID: CL-B2
Mức: Low
Trục: D
Vị trí: packages/db/src/backup-validation.ts:214-243 (kycRule, luật 8) (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: Luật 8 chỉ kiểm một chiều: fact birthYear / gender đang hiệu lực phải đến từ ghi chú SYSTEM và khớp hồ sơ. Chiều ngược lại không kiểm: hồ sơ có ngày sinh / giới tính mà KYC không có fact nào của trường đó vẫn được nhập. Lệnh luôn ghi fact khi hồ sơ có giá trị (D2), và "lưu lại hồ sơ y như cũ" không ghi gì (profileChange thấy không đổi), nên trạng thái này không tự sửa được.
Tái hiện / bằng chứng: probe-gaps.test.ts case 4: xóa các fact + version của KH "Lan" (hồ sơ 1984, Nữ) trong file → nhập "accepted"; sau nhập `evaluateKycGate` = KYC_INSUFFICIENT, fact hiệu lực = [], gọi lại `updateCustomerProfile` cùng giá trị → vẫn [] (probe-gaps.result.json "profileWithoutFacts"). Trên dữ liệu tải: 0 KH như vậy.
Ảnh hưởng: hồ sơ KH hiện "Nữ · 1984" nhưng cổng KYC báo thiếu năm sinh / giới tính; RE chỉ sửa được bằng cách đổi ngày sinh sang giá trị khác rồi đổi lại (sinh 2 ghi chú SYSTEM thừa). Chỉ với file sửa tay / snapshot Phase 6.
Đề xuất: luật 8 thêm: hồ sơ có giá trị ⇒ trường đó có fact SYSTEM khớp hồ sơ đang active hoặc đang conflict; hồ sơ trống ⇒ không có fact active. ≈ 15 dòng SP + 2 ca test.
```

### CL-B3

```
ID: CL-B3
Mức: Low
Trục: C
Vị trí: packages/db/src/kyc.ts:94-105 (addKycNote), 118-141 (recordKycNote), 162-186 (resolveKycConflict); customers.ts:290-294 (birthDateText); backup-validation.ts:266-276 (futureRule) (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: Luật "việc đã xảy ra không sau hôm nay" (F-11, #258) nằm trong lệnh cho tạo KH, chuyển nhóm, HĐ, cuộc gặp, nhưng ngày của ghi chú / dữ kiện / phiên bản KYC và ngày sinh chỉ được chặn ở UI (`parseRecordDate`, `parseBirthDate` trả 'future'). Lệnh db và đường nhập backup nhận ngày tương lai. Spec Phase 3 §4: "UI không ghi thẳng vào bảng … Mỗi lệnh chạy trong một transaction, kiểm quy tắc bằng hàm của domain".
Tái hiện / bằng chứng: probe-future.test.ts (đồng hồ 26/09/2026): recordKycNote ngày 01/01/2027 → accepted; ghi mâu thuẫn ngày 01/01/2030 → accepted; resolveKycConflict ngày 31/12/2099 → accepted; danh sách phiên bản "Cập nhật KYC 01/01/2027 / 01/01/2030 / 31/12/2099"; updateCustomerProfile ngày sinh 27/09/2026 (ngày mai) → accepted; createCustomer ngày sinh 2090 → accepted (probe-gaps "beforeCreation"); xuất rồi nhập lại → accepted.
Ảnh hưởng: hôm nay UI chặn nên người dùng không gặp. Phase 5 (AI ghi KYC qua lệnh) hay Phase 6 (nhập snapshot) sẽ không có lớp chặn này; phiên bản KYC "tương lai" được Phase 5 tham chiếu (`kyc_versions.id`).
Đề xuất: dùng `toPastIsoDate` cho ngày KYC và ngày sinh trong lệnh; thêm `kyc_notes.created_date`, `kyc_facts.confirmed_date`, `kyc_versions.date`, `customers.birth_date` vào luật 10 (spec §6 cập nhật theo). ≈ 15 dòng SP + test.
```

### CL-B4

```
ID: CL-B4
Mức: Low
Trục: E
Vị trí: packages/db/src/policies.ts:43-58, 108-121 (submitPolicy / validate); appointments.ts:124-142, 418-424 (recordMeetingOutcome / requireOutcomeDay) (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: Không có luật nào so ngày của HĐ / cuộc hẹn với ngày tạo KH (= ngày transition đầu, spec §3.3). HĐ nộp trước ngày tạo KH được nhận; cuộc gặp MET giữ nguyên nhóm (hay NO_SHOW / CANCELLED) trước ngày tạo cũng được nhận; còn cuộc gặp MET đổi nhóm cùng ngày đó bị từ chối với TRANSITION_BEFORE_LATEST (D10). Cùng một ngày, kết quả phụ thuộc nhóm sau cuộc gặp, và mã lỗi nói về "transition mới nhất" chứ không về ngày tạo KH.
Tái hiện / bằng chứng: probe-gaps.test.ts case 5: KH tạo 20/09, submitPolicy ngày 05/09 → accepted; lịch 03/09 ghi MET nhóm sau = nhóm hiện tại → accepted; cùng lịch ghi MET đổi nhóm → TRANSITION_BEFORE_LATEST; file xuất ra nhập lại được. UI (PolicyDialogs) không chặn ngày trước ngày tạo. Dữ liệu tải: 0 bản ghi như vậy (seed luôn đúng thứ tự).
Ảnh hưởng: RE nhập bù HĐ cũ cho KH mới tạo → báo cáo đếm PH vào tháng KH "chưa tồn tại" theo biểu đồ KH theo nhóm; dòng thời gian hồ sơ KH có HĐ trước dòng "Tạo KH". Không sai số liệu PH / DS của RE.
Đề xuất: cần Owner chốt một luật (vd. ngày HĐ / cuộc hẹn có kết quả ≥ ngày tạo KH, mã lỗi riêng) hoặc ghi ACCEPTED là nhập bù hợp lệ. Nếu chặn: ≈ 20 dòng SP + i18n + luật nhập.
```

### CL-B5

```
ID: CL-B5
Mức: Low
Trục: D
Vị trí: packages/db/src/database.ts:175-188 (migrate), 83-99 (transaction, COMMIT ở dòng 96); packages/db/CLAUDE.md "Không sửa tay migration đã sinh" (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: migrate() chạy mọi migration chờ trong một transaction với khóa ngoại bật; PRAGMA foreign_keys=OFF trong transaction không có tác dụng (migration 0004 đã ghi điều này). Migration "dựng lại bảng" mà drizzle-kit sinh ra (để thêm CHECK, đổi cột của bảng đang được tham chiếu) vì vậy chạy được trên DB rỗng nhưng hỏng trên DB có dữ liệu. Thêm PRAGMA defer_foreign_keys cũng không cứu, và khi đó COMMIT lỗi mà transaction() không rollback, để lại transaction đang mở.
Tái hiện / bằng chứng: probe-migration.test.ts với migration giả 0005 dựng lại `people` theo khuôn drizzle-kit: DB chỉ có nhân sự → ok, version 6; DB có 1 KH → "FOREIGN KEY constraint failed", version giữ 5 (rollback đúng); thêm defer_foreign_keys → "FOREIGN KEY constraint failed" ở COMMIT, schemaVersion đọc ra 6, transaction kế tiếp → "cannot start a transaction within a transaction".
Ảnh hưởng: người sửa schema lần sau (Phase 5–6) làm theo CLAUDE.md ("không sửa tay migration đã sinh") sẽ có migration xanh trên test DB rỗng nhưng exe không mở được file có dữ liệu của người dùng (openDatabase báo lỗi migration). Test "migrating a saved database" với dữ liệu sẽ bắt được nếu có viết. Phase 5 thêm bảng `ai_analyses` (CREATE TABLE) không bị.
Đề xuất: migrate() làm như load() của backup: PRAGMA foreign_keys=OFF trước BEGIN, PRAGMA foreign_key_check trước COMMIT, bật lại sau; transaction() rollback khi COMMIT ném lỗi. Ghi một dòng vào packages/db/CLAUDE.md. ≈ 20 dòng SP + 1 test migration giả có dữ liệu.
```

### CL-B6

```
ID: CL-B6
Mức: Low
Trục: T
Vị trí: packages/db/src/appointments.ts:106 · policies.ts:101 · team.ts:233, 238-244 · kyc.ts:193 · backup-validation.ts:45 (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: 6 mutation đổi hành vi thật mà toàn bộ 316 test db vẫn xanh (phụ lục A):
  - AP12 bỏ sắp theo giờ trong listAppointments: thứ tự "by date and time" không có test, trong khi CustomerAppointments.tsx:74-77 dựa vào nó để hai lịch cùng ngày đứng "mới nhất trước". T-136 chỉ thêm e2e cho DataTable của màn Lịch hẹn.
  - PO3 restorePolicy bỏ requireRe: khôi phục HĐ của RE đã xóa / đã đổi vai trò → HĐ chưa xóa của người không phải RE; file xuất ra sau đó bị luật 5 từ chối khi nhập lại.
  - TE3 ownsLiveRecords bỏ policies: RE chỉ còn HĐ chưa xóa (KH đã chuyển sang RE khác) đổi được vai trò → cùng hậu quả luật 5.
  - TE4 isPersonInUse bỏ vế "đang phối hợp": xóa được người phối hợp của lịch chưa xóa → đúng trạng thái CL-B1 (a), mà đường nhập cũng không chặn, nên không lớp nào bắt.
  - KY8 markKycVersionMaterial bỏ kiểm KH còn sống.
  - BV27 kiểm giá trị `birth_date` nhận mọi chuỗi: file có ngày sinh "1984-02-30" sẽ vào được, rồi mọi lần đọc KH ném lỗi (probe-birthread: fromIsoDate('1984-02-30') → RangeError "Not a calendar date").
  Ba con sống còn lại không cần test: SE1 (giờ ghi của seed sau ngày neo, chỉ đổi created_at / id), SE3 (seed phát hành HĐ đúng ngày neo, vẫn hợp lệ), ID2 (tương đương: `<<` của JS đã cắt về 32 bit, các bit được dùng không đổi).
Tái hiện / bằng chứng: node mutate.mjs <tên> → "SURVIVED (full suite)" (chạy cả 316 test sau khi các file đích xanh).
Ảnh hưởng: chưa có lỗi người dùng. Sửa / gộp code về sau (vd. CL-B7, CL-B8) có thể làm mất một trong các luật trên mà CI vẫn xanh; ba luật PO3 / TE3 / TE4 giữ cho file backup luôn nhập lại được.
Đề xuất: thêm 6 ca test (thứ tự giờ cùng ngày; restorePolicy với RE đã xóa → PERSON_NOT_FOUND và đã đổi vai trò → RE_REQUIRED; RE chỉ còn HĐ đổi vai trò → PERSON_IN_USE; xóa người phối hợp → PERSON_IN_USE; markKycVersionMaterial trên KH đã xóa; ngày sinh "1984-02-30" trong file → BACKUP_INVALID). ≈ 60 dòng test, không đổi SP.
```

### CL-B7

```
ID: CL-B7
Mức: Low
Trục: B
Vị trí: packages/db/src/index.ts:5,12-13,38,46,57,67-68,71-72,87,90 · metrics.ts:9 · schema.ts:62,68,75 · ids.ts:3 (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: Nhiều export công khai của @p2c/db không có nơi gọi nào trong code sản phẩm (apps, e2e, tools, package khác), chỉ test dùng:
  - `loadMetricsData` (metrics.ts): chỉ golden-metrics.test.ts. Bốn màn tự dựng lại cùng bộ list (`readOverview` ở Overview.tsx:23-30 và `readReports` ở ReportsScreen.tsx:27-34 giống hệt nhau; TeamScreen, AppointmentsScreen gần giống).
  - `updateAppointmentDetails`: UI hộp 6f dùng `editMeetingOutcome`; lệnh này chỉ còn test, nhưng giữ một bản logic rút / gắn lại transition thứ ba (cùng recordMeetingOutcome, editMeetingOutcome).
  - `getAppointment`, `getPerson`, `getPolicy`, `getTeam`, `markKycVersionMaterial` (không UI nào bật cờ material của phiên bản cũ), `addKycNote` / `confirmKycFact` / `markKycConflict` (chỉ seed và test; UI dùng recordKycNote), `GENDERS`, `KYC_NOTE_SOURCES`, `BACKUP_FORMAT`.
  - Export nội bộ chỉ chính file dùng: `CROCKFORD_BASE32` (ids.ts), `CUSTOMER_STAGES` (schema.ts); bảng `settings` và `schemaMigrations` chỉ test dùng (bảng settings chưa có đường đọc / ghi).
  Không tính: restore* và softDeleteCustomer (màn Thùng rác xếp Phase 6, Owner 30/09 #171, ACCEPTED).
Tái hiện / bằng chứng: grep mọi tên export của index.ts (lệnh ở phụ lục B): prod=0 cho các tên trên. `tsc --noUnusedLocals --noUnusedParameters` sạch (exit 0).
Ảnh hưởng: không gây lỗi. API rộng hơn nhu cầu; `updateAppointmentDetails` là chỗ thứ ba phải sửa khi đổi luật D7 / D10 mà không có người dùng thật.
Đề xuất: bỏ `updateAppointmentDetails` (hoặc để `editMeetingOutcome` gọi nó), bỏ các get* / hằng không dùng khỏi index; màn dùng `loadMetricsData` (hay một `loadScreenData`) thay vì 4 hàm đọc tự viết. ≤ 80 dòng, chủ yếu xóa.
```

### CL-B8

```
ID: CL-B8
Mức: Low
Trục: P
Vị trí: packages/db/src/appointments.ts:94-110 (listAppointments); nơi gọi apps/desktop/src/data/AppDataContext.tsx:28-31 (đọc lại mỗi revision) (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: Mỗi màn đọc lại toàn bộ bảng sau mọi lệnh ghi (useMemo theo revision). Trên dữ liệu tải, `listAppointments(db)` mất 97 ms: SQL thuần cùng câu truy vấn 61 ms (sql.js trả 10 434 dòng × 17 cột), drizzle thêm ≈ 35 ms (select lồng `{ a: appointments }` qua join), ORDER BY ≈ 9 ms, người phối hợp 2 ms. Bộ đọc của Tổng quan / Báo cáo (appointments + transitions + policies + customers + people + teams) ≈ 140 ms mỗi lần.
Tái hiện / bằng chứng: probe-perf.test.ts và probe-listappts.test.ts (median 7–9 lượt, Node, chạy lúc máy rảnh): listAppointments 92–97 ms; listStageTransitions 23–24 ms; listPolicies 10 ms; listCustomers 7,5 ms; listPeople 0,2 ms; loadMetricsData 132 ms; raw `sqlite.exec` cùng SQL 61 ms, bỏ ORDER BY 52 ms; drizzle select phẳng không join 77 ms.
Ảnh hưởng: mỗi lần RE lưu một lịch hẹn / KH ở màn Lịch hẹn, Tổng quan, Báo cáo, Team, main thread khựng ≈ 115–140 ms chỉ để đọc lại (chưa tính tính chỉ số và render), trên dữ liệu tải. Seed demo nhỏ hơn (≈ 6 000 lịch hẹn) nên ít hơn; chưa đo trên trình duyệt, để gói D / F / H đo đầu-cuối.
Đề xuất: (db) đọc hai bảng lớn bằng `sqlite.exec` + map tay (−35 % cho listAppointments); (app, gói D) đọc một lần mỗi revision và chia cho các màn, hoặc chỉ đọc lại bảng mà lệnh đã đổi. Phần db ≤ 60 dòng; tiêu chí: listAppointments trên dữ liệu tải ≤ 65 ms.
```

### CL-B9

```
ID: CL-B9
Mức: Nit
Trục: C
Vị trí: packages/db/src/appointments.ts:380-397 (requirePeople / requirePerson "A live person of any role, as a coordinator"); team.ts:132-161 (updatePerson); backup-validation.ts:194-199 (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: ADR-0007 viết "TL/IS/BD/BDM là người phối hợp trong cuộc hẹn", UI chỉ cho chọn người không phải RE (AppointmentDialog.tsx:224-228, comment dẫn ADR-0007). Lệnh db và đường nhập nhận một RE khác làm người phối hợp (chỉ cấm chính RE của lịch, theo spec §3.6), và updatePerson đổi được một TL đang phối hợp lịch chưa xóa sang RE.
Tái hiện / bằng chứng: đọc code (requirePerson chỉ kiểm còn sống); grep ADR-0007:43; trên dữ liệu tải 0 người phối hợp là RE (probe-seedinv "reCoordinators": 0).
Ảnh hưởng: hôm nay không gặp qua UI. Phase 5–6 (AI / đồng bộ) gọi lệnh trực tiếp sẽ ghi được người phối hợp là RE.
Đề xuất: Owner chốt spec §3.6 theo ADR-0007 hay ngược lại; nếu theo ADR: requirePerson cấm RE (mã INVALID_COORDINATOR), updatePerson chặn như REVIEWER_IN_USE, thêm vào luật 5. ≈ 15 dòng SP.
```

### CL-B10

```
ID: CL-B10
Mức: Nit
Trục: C
Vị trí: packages/db/src/team.ts:32, 47; customers.ts:69 (orderBy name) (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: listTeams / listPeople / listCustomers sắp theo tên bằng collation BINARY của SQLite: "Đ…", chữ thường và chữ có dấu ở đầu đứng sau "Z". Năm nơi ở UI sắp lại bằng Intl.Collator('vi') (appointments-view, customers-view, team-compare-view, reports-view, shell/scope), còn vài nơi dùng thẳng thứ tự của db: reviewerChoices (appointments-view.ts:130), danh sách "thêm người phối hợp" (AppointmentDialog.tsx:226), groupByTeam (team-view.ts:33-42).
Tái hiện / bằng chứng: probe-gaps.test.ts "listOrder": listPeople → [An, Bình, Bình, Dương Thị B, Hà, Vũ Minh C, an, Ánh, Đỗ Văn A]; Intl.Collator('vi') → [an, An, Ánh, Bình, Bình, Dương Thị B, Đỗ Văn A, Hà, Vũ Minh C].
Ảnh hưởng: trong bộ chọn người đánh giá / người phối hợp, "TL Đặng …" đứng sau "TL Vũ …". Gói E / F kiểm hiển thị cụ thể.
Đề xuất: db không sắp theo tên (để nơi hiển thị sắp bằng collator chung), hoặc sắp bằng một hàm `byName` chung ở domain / ui. ≤ 20 dòng.
```

### CL-B11

```
ID: CL-B11
Mức: Nit
Trục: E
Vị trí: packages/db/src/common.ts:15-19 (requireName); team.ts:210-223 (assertTeamNameFree) (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: requireName chỉ trim, không chuẩn hóa Unicode; tên team "duy nhất" so từng byte. UI chuẩn hóa NFC ở 4 hộp thoại (CustomerDialogs.tsx:172, PersonDialogs.tsx:44, TeamDialogs.tsx:24, KycDialogs.tsx:98/123), lệnh thì không. Ký tự NUL trong tên làm sql.js cắt tên ở đó mà không báo.
Tái hiện / bằng chứng: probe-gaps.test.ts "names": sau "Hừng Đông" (NFC, 9 ký tự), createTeam nhận "Hừng Đông" NFD (12 ký tự, nhìn giống hệt), "hừng đông", "Hừng  Đông" (hai dấu cách); createCustomer "A\u0000B" lưu thành "A". Tên 200 000 ký tự, tên có `\` và `"` lưu / xuất / nhập đúng.
Ảnh hưởng: qua UI hôm nay chỉ còn biến thể hoa-thường / dấu cách đôi (hai team "Sao Mai" và "sao mai" cùng tồn tại). Phase 5–6 gọi lệnh trực tiếp hoặc nhập file thì cả NFD lọt.
Đề xuất: requireName chuẩn hóa NFC (bỏ 4 chỗ ở UI); Owner chốt có so tên team không phân biệt hoa thường / dấu cách không. ≤ 15 dòng.
```

### CL-B12

```
ID: CL-B12
Mức: Nit
Trục: T
Vị trí: packages/db/src/test-support.ts:9 (đồng hồ 26/09/2026 08:00Z); seed.ts:113-117 (now = trưa UTC) (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: Bộ test db phụ thuộc múi giờ máy: đồng hồ của setup() là 08:00 UTC, nên ở UTC−9 … −12 "hôm nay" của DB là 25/09 và mọi test "takes today itself" đỏ. Seed dùng trưa UTC ("UTC±11" theo comment): ở UTC+12 … +14 ghi chú SYSTEM khi đổi hồ sơ mang ngày hôm sau, nên ngày phiên bản KYC đi lùi theo seq và seed khác nhau theo múi giờ.
Tái hiện / bằng chứng: TZ=Pacific/Honolulu (getTimezoneOffset 600): 6 test đỏ (policies, customers, 3 × appointments, backup-invariants "dated today"). TZ=Pacific/Kiritimati (−840): 1 test đỏ (seed-invariants "records a version … the last current", so sánh ngày phiên bản). UTC, +7: 316/316 xanh.
Ảnh hưởng: không ảnh hưởng hai máy của Owner (+7) và CI (UTC). Chỉ là test / seed không chạy đúng ở mọi múi giờ như kế hoạch §5 E yêu cầu xét.
Đề xuất: setup() dùng 12:00 UTC; seed ghi ngày đổi hồ sơ bằng ngày mô phỏng (truyền ngày vào lệnh, hoặc ghi rõ giới hạn ±11 trong spec §7). ≤ 10 dòng.
```

### CL-B13

```
ID: CL-B13
Mức: Nit
Trục: P
Vị trí: packages/db/src/backup.ts:138-163 (load, db.sqlite.run(insert, …) cho từng dòng) (f0c53eb)
Tình trạng: CONFIRMED
Mô tả: Bản sql.js đã minify gọi prepare nội bộ trong `run(sql, params)`, không qua `prepare` của instance mà database.ts bọc bộ đệm statement, nên load() prepare và free một statement cho mỗi dòng của file. Một statement cho mỗi bảng làm bước nạp dòng nhanh gấp đôi.
Tái hiện / bằng chứng: probe-runcache.test.ts: `run('SELECT ?', [1])` gọi wrapper 0 lần, `prepare()` 1 lần. probe-load.test.ts trên 53 142 dòng của dữ liệu tải, 3 lượt xen kẽ: run từng dòng 888 / 790 / 810 ms, một statement mỗi bảng 376 / 364 / 371 ms (chạy song song với lượt mutation nên số tuyệt đối cao hơn máy rảnh; tỉ lệ ≈ 2,2 lần).
Ảnh hưởng: nhập backup trên dữ liệu tải mất 1,46 s, trong đó ≈ 0,4 s là prepare thừa. Chỉ khi nhập (hiếm, có hộp xác nhận).
Đề xuất: trong load(), `const stmt = db.sqlite.prepare(insert)` một lần mỗi bảng, `stmt.run(values)` từng dòng, `stmt.free()` cuối bảng. ≤ 10 dòng; tiêu chí: importBackup dữ liệu tải ≤ 1,1 s trên máy baseline.
```

## 3. Bảng đếm mức × trục

| Mức \ Trục | E | C | D | P | B | T | A | S | Tổng |
|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 1 (B4) | 1 (B3) | 3 (B1, B2, B5) | 1 (B8) | 1 (B7) | 1 (B6) | 0 | 0 | 8 |
| Nit | 1 (B11) | 2 (B9, B10) | 0 | 1 (B13) | 0 | 1 (B12) | 0 | 0 | 5 |
| **Tổng** | 2 | 3 | 3 | 2 | 1 | 2 | 0 | 0 | **13** |

Cả 13 phát hiện đều CONFIRMED (probe, mutation, số đo hoặc chạy test dưới múi giờ khác), không có PLAUSIBLE. Phần hậu quả ở UI của CL-B1 (a) (hộp 6f giữ id người đánh giá cũ) là đọc code, ghi rõ trong khối. Không mục nào trùng `known.md`; gần nhất là KNOWN S-1 (hash KYC khi nhập), CL-B2 là luật 8 khác, không phải hash.

**Nhận định chung gói B:** đường ghi của db đúng spec Phase 3 và D1–D10 trên mọi phép thử đã chạy; dữ liệu tải (sinh qua lệnh) qua đủ 10 luật nhập và xuất / nhập giống hệt từng ký tự. Không có lỗi mất hay sai dữ liệu với dữ liệu do app ghi. Các phát hiện tập trung ở ba chỗ: (1) đường nhập backup lỏng hơn lệnh ở vài luật không có trong spec §6 (CL-B1, B2, B3); (2) một bẫy bảo trì cho migration sau này (CL-B5); (3) chỗ trống của test và chi phí đọc toàn bảng (CL-B6, B8).

## 4. Đã xét, không thấy

- **E — Edge case:**
  - Chuỗi: tên có `\`, `"`, Unicode tiếng Việt, 200 000 ký tự: lưu, xuất, nhập đúng (probe-gaps "names"). NFC/NFD, hoa-thường, NUL → CL-B11.
  - Số: tiền 0, âm, lẻ, `MAX_SAFE_INTEGER + 1` bị chặn ở `requireAmount` và ở `valueOf` khi nhập (`Number.isSafeInteger`); `expected_case_size` 0 → BACKUP_INVALID (mutation BV18 bị bắt).
  - Ngày: ngày không tồn tại (30/02, 31/04, 29/02 năm thường) bị chặn ở lệnh (`toIsoDate`) và ở kiểm giá trị khi nhập, kể cả mốc thời gian ISO (`z.iso.datetime()` từ chối 30/02, thiếu `Z`, `+07:00`) (probe-values). Năm < 1900 / > 2100 bị chặn. Cùng ngày, nhiều chuyển nhóm: thứ tự theo `seq` (D10) đúng.
  - Hai thao tác chồng nhau: db đồng bộ, một luồng; không có await giữa đọc và ghi trong lệnh. `importBackup` dựng DB riêng (staging) nên không đụng DB đang mở. Chồng nhau ở mức app (`replace`) là KNOWN S-2.
  - Múi giờ: CL-B12. Luật 10 so với ngày theo đồng hồ máy nhập (spec §6); file xuất ở máy múi giờ đi trước có thể bị từ chối trong vài giờ, theo thiết kế.
- **C — Đúng hợp đồng:**
  - Đối chiếu từng lệnh với bảng §4 spec Phase 3 và D1–D10: tạo / đổi nhóm (D10, DATE_IN_FUTURE), kết quả cuộc gặp (D6, D7 khóa 3 ô, D9 người đánh giá, xóa / khôi phục rút / gắn lại transition), dời lịch (D3), HĐ (§3.7), KYC (D2, #263) đều đúng; mọi chỗ lệch là CL-B3, B4, B9.
  - `customers.stage` = to_stage của transition chưa xóa mới nhất: đúng qua mọi đường ghi (mutation CU2, CU3, CU4, AP13, AP21 đều bị bắt).
  - Mã lỗi: mọi `DB_ERROR_CODES` có câu i18n (test `apps/desktop/src/i18n/index.test.ts:87` kiểm).
  - Bộ đệm statement (`database.ts:132-155`): drizzle 0.45.3 gọi `client.prepare` rồi `free` cho mỗi truy vấn, không giữ statement, nên đè `free` = `reset` an toàn; `exportBytes` giải phóng thật trước `sqlite.export()`; không có chỗ dùng lại một statement khi nó đang chạy (đọc session.js, mutation DB6 / DB8 bị bắt).
- **D — Dữ liệu:**
  - Mọi INSERT / UPDATE đều trong `db.transaction` (lệnh, seed, migrate, load khi nhập); hàm ghi "in the caller's transaction" (`appendTransition`, `withdrawAppointmentTransition`, `recordProfileFacts`) không được export qua index. `issuePolicy` đọc ngoài transaction rồi ghi qua `updatePolicy` (trong transaction); một luồng nên không có khe.
  - Lỗi giữa chừng: rollback toàn bộ, `persist` chỉ gọi sau COMMIT (test + mutation DB1, DB2 bị bắt). Ngoại lệ COMMIT lỗi: CL-B5.
  - Xuất → nhập → xuất trên dữ liệu tải giống hệt từng ký tự (trừ `exportedAt`), lượt hai cũng vậy (probe-roundtrip). Dữ liệu tải qua đủ 10 luật khi nhập.
  - Lệnh → nhập: đối chiếu từng luật 1–10 với mọi đường ghi bằng đọc code, không thấy chuỗi lệnh nào tạo dữ liệu mà nhập từ chối; test có sẵn "imports again after each main command" (backup-invariants.test.ts:470-533) chạy các luồng xóa / khôi phục / đổi vai trò / đổi team / mâu thuẫn KYC rồi nhập lại. Ba kiểm giữ chiều này chưa có test: CL-B6 (PO3, TE3, TE4). Chiều nhập lỏng hơn lệnh: CL-B1, B2, B3.
  - KYC hash khi nhập: KNOWN S-1, không báo lại.
- **P — Hiệu năng** (Node, dữ liệu tải, median, máy rảnh; probe-perf.result.json):
  - `importBackup` 1 458 ms (JSON.parse 36 ms, kiểm giá trị 274 ms, kiểm bất biến 227 ms, nạp dòng ≈ 0,8 s → CL-B13); `exportBackup` 286 ms. Một lần mỗi lần nhập / xuất, có hộp xác nhận.
  - `db.export()` (cổng persist sau mỗi transaction, file 13,07 MB) 2,3 ms; `openDatabase` từ bytes 3 ms; một lệnh nhỏ (`addKycNote`) 0,12 ms không persist / 3,5 ms có persist.
  - Thiếu chỉ mục ở cột khóa ngoại (`appointments.customer_id`, `stage_transitions.appointment_id`, `appointments.outcome_reviewer_id`, `appointment_coordinators.person_id`, `re_id`): EXPLAIN là SCAN, nhưng `softDeleteAppointment` 0,45 ms không chỉ mục / 0,39 ms có chỉ mục; `updatePerson` 0,18 ms; `listAppointments(db, customerId)` 1,9 ms; `getKycProfile` / `listKycVersions` 0,1 ms. Không đáng thêm chỉ mục ở quy mô này.
  - Seed demo 3,7 s là số baseline (web mở là seed); exe chỉ seed lần đầu / "Nạp lại".
  - Đọc toàn bảng mỗi revision: CL-B8.
- **B — Bloat:** `tsc --noUnusedLocals --noUnusedParameters` sạch. Export không dùng: CL-B7. Không thấy code lặp ≥ 3 nơi trong db ngoài logic rút / gắn transition (CL-B7). Dependency `drizzle-orm`, `sql.js`, `zod` đều dùng; `drizzle-kit` chỉ cho `db:generate`.
- **T — Test:** 114 mutation (phụ lục A), con sống → CL-B6. Không có test thiếu `expect` (scan-expect.mjs; một ca báo là `near()` có expect bên trong). Test dùng đồng hồ thật (`openDatabase()` không `now`) chỉ ở chỗ không phụ thuộc ngày, trừ backup-invariants:144-153 dựa vào "hôm nay thật ≥ 15/09/2026" (luôn đúng từ nay). Thứ tự: `--sequence.shuffle` seed 7 và 99 đều 316/316. Múi giờ → CL-B12.
- **A — Trợ năng / i18n:** db không có giao diện. Chuỗi tiếng Việt do db sinh: ghi chú SYSTEM "Hồ sơ KH: năm sinh …; giới tính Nam/Nữ" và "Cập nhật KYC dd/mm/yyyy" là dữ liệu (ACCEPTED, không báo lại). Mã lỗi đều có câu i18n (test). Định dạng ngày lưu `YYYY-MM-DD`, hiển thị qua `formatDate` của domain.
- **S — An toàn (hẹp):**
  - Nhập backup: tên bảng / cột lấy từ `sqlite_master` / `pragma_table_info`, không từ file; giá trị bind bằng tham số; `quote()` cho tên. Không có SQL ghép từ dữ liệu file (luật 10 ghép ngày hôm nay của máy).
  - Giới hạn 100 MB kiểm trước `JSON.parse`; JSON lồng 200 000 tầng → BACKUP_INVALID; khóa `__proto__` trong `tables` / trong dòng bị bỏ qua, không làm bẩn `Object.prototype`; `__proto__` ở vỏ ngoài → BACKUP_INVALID (probe-proto).
  - Ghi chú cho Phase 5 (D-1 / G6): bảng `settings` được xuất nguyên vào file backup; nếu sau này lưu API key ở đó thì key nằm trong mọi file `.p2cbackup`.
- **Ghi chú cho gói sau (không phải phát hiện gói B):**
  - Gói D: `countRecords` (`app-data.ts:321-329`) gọi `list*().length` ≈ 110 ms trên dữ liệu tải (tổng các số đo ở CL-B8) cho mỗi lần xem trước nhập; `COUNT(*)` là đủ. Mỗi lệnh persist cả file 13 MB qua IPC → gói C / D đo.
  - Gói E: `CustomerAppointments.tsx:74-77` dựa vào thứ tự giờ của `listAppointments` (xem CL-B6); `appointments-view.ts:266-267` tìm lịch dời trước / sau bằng `find` trên toàn danh sách cho mỗi lịch.
  - Gói F: hai hàm đọc `readOverview` / `readReports` giống hệt (CL-B7).

## Phụ lục A — Kết quả mutation (`mutate-results.json`)

Mỗi dòng: chép `packages/db` sang `B\mut\packages\db`, sửa đúng một chỗ, chạy các file test đích của nhóm (C: common/customers/policies/appointments · CU: customers/appointments/kyc · AP: appointments · PO: policies · TE: team · KY: kyc/customers · BV, BK: backup/backup-invariants(/backup-engine) · DB: database · SE: seed/seed-invariants · ID: ids); nếu cả nhóm xanh thì chạy **toàn bộ** 316 test. "targeted" = bị bắt ngay ở file đích, "full suite" = chỉ bị bắt khi chạy toàn bộ. Bản sao chưa sửa (BASELINE) xanh 316/316.

Tổng: 114 mutation · 105 bị bắt · 9 sống.

| Mutation | Kết quả |
|---|---|
| C1 toPastIsoDate: future allowed | killed (2 failed, targeted) |
| C2 requireAmount: 0 allowed | killed (1 failed, targeted) |
| C3 requireRe: any role | killed (5 failed, targeted) |
| CU1 appendTransition: D10 check dropped | killed (4 failed, targeted) |
| CU2 withdraw: latest check dropped | killed (2 failed, targeted) |
| CU3 withdraw: stage not reverted | killed (7 failed, targeted) |
| CU4 lastSeq ignores withdrawn transitions | killed (7 failed, targeted) |
| CU5 restoreCustomer: RE not checked | killed (1 failed, targeted) |
| CU6 createCustomer: future day allowed | killed (1 failed, targeted) |
| CU7 listStageTransitions: deleted customers kept | killed (1 failed, targeted) |
| CU8 updateCustomerProfile: no KYC facts | killed (5 failed, targeted) |
| CU9 changeStageManually: future day allowed | killed (1 failed, targeted) |
| AP1 requireOutcomeDay dropped | killed (2 failed, targeted) |
| AP2 NO_SHOW may be in the future | killed (2 failed, targeted) |
| AP3 keepsTransition ignores stage after | killed (3 failed, targeted) |
| AP4 updateAppointmentDetails: day not checked | killed (1 failed, targeted) |
| AP5 editMeetingOutcome: kept stage not moved with the day | killed (1 failed, targeted) |
| AP6 restoreAppointment: people not checked | killed (1 failed, targeted) |
| AP7 restoreAppointment: reviewer not checked | killed (2 failed, targeted) |
| AP8 RE may coordinate own appointment | killed (2 failed, targeted) |
| AP9 next appointment may be past | killed (1 failed, targeted) |
| AP10 reschedule any status | killed (1 failed, targeted) |
| AP11 listAppointments: deleted customers kept | killed (1 failed, targeted) |
| AP12 listAppointments: time not ordered | **SURVIVED (full suite)** |
| AP13 softDelete: transition kept | killed (2 failed, targeted) |
| AP14 time 24:xx allowed | killed (1 failed, targeted) |
| AP15 stage after on non-met allowed | killed (1 failed, targeted) |
| AP16 reviewer on non-met allowed | killed (1 failed, targeted) |
| AP17 replaceCoordinators: no dedupe | killed (1 failed, targeted) |
| AP18 insertScheduled: coordinators unsorted | killed (1 failed, targeted) |
| AP19 outcome on rescheduled allowed | killed (1 failed, targeted) |
| AP20 restore of a live appointment re-applies | killed (1 failed, targeted) |
| AP21 updateDetails: moved transition not re-applied | killed (1 failed, targeted) |
| AP22 recordMeetingOutcome: day not checked | killed (1 failed, targeted) |
| PO1 issued before submitted allowed | killed (1 failed, targeted) |
| PO2 re-issue takes submitted FYP | killed (1 failed, targeted) |
| PO3 restorePolicy: RE not checked | **SURVIVED (full suite)** |
| PO4 listPolicies: deleted customers kept | killed (1 failed, targeted) |
| PO5 issue day may be future | killed (1 failed, targeted) |
| PO6 ISSUE_INCOMPLETE dropped | killed (1 failed, targeted) |
| TE1 second TL allowed | killed (4 failed, targeted) |
| TE2 team with members deletable | killed (1 failed, targeted) |
| TE3 ownsLiveRecords ignores policies | **SURVIVED (full suite)** |
| TE4 coordinator deletable | **SURVIVED (full suite)** |
| TE5 REVIEWER_IN_USE dropped | killed (2 failed, full suite) |
| TE6 restoreTeam: name clash allowed | killed (1 failed, targeted) |
| TE7 TEAM_NOT_ALLOWED dropped | killed (1 failed, targeted) |
| TE8 RE with records may change role | killed (1 failed, full suite) |
| TE9 restorePerson: not validated | killed (3 failed, targeted) |
| TE10 softDeletePerson: in-use not checked | killed (2 failed, full suite) |
| TE11 ownsLiveRecords counts deleted records | killed (3 failed, full suite) |
| KY1 fact from SYSTEM note allowed | killed (1 failed, targeted) |
| KY2 RE may confirm birth year | killed (2 failed, targeted) |
| KY3 resolve: SYSTEM fact off profile allowed | killed (1 failed, targeted) |
| KY4 normalize: no trim | killed (4 failed, targeted) |
| KY5 manual material ignored | killed (2 failed, targeted) |
| KY6 birth date may be cleared | killed (1 failed, targeted) |
| KY7 note without facts may record a version | killed (1 failed, targeted) |
| KY8 material on deleted customer | **SURVIVED (full suite)** |
| KY9 status changes not saved | killed (16 failed, targeted) |
| KY10 gender label raw | killed (4 failed, targeted) |
| BV1 rule 1: creation tied to a meeting | killed (1 failed, targeted) |
| BV2 rule 1: later from null | killed (1 failed, targeted) |
| BV3 rule 3: date order | killed (1 failed, targeted) |
| BV4 rule 3: allowed move | killed (1 failed, targeted) |
| BV5 rule 2: stage | killed (1 failed, targeted) |
| BV6 rule 4: once | killed (1 failed, targeted) |
| BV7 rule 4: same day | killed (1 failed, targeted) |
| BV8 rule 5: policies RE | killed (1 failed, targeted) |
| BV9 rule 5: RE coordinates | killed (1 failed, targeted) |
| BV10 rule 5: rescheduled status | killed (1 failed, targeted) |
| BV11 rule 6 | killed (1 failed, targeted) |
| BV12 rule 7: active + conflict | killed (1 failed, targeted) |
| BV13 rule 8: SYSTEM other fields | killed (3 failed, targeted) |
| BV14 rule 9: two TLs | killed (1 failed, targeted) |
| BV15 rule 10: NO_SHOW | killed (1 failed, targeted) |
| BV16 values: time | killed (1 failed, targeted) |
| BV17 values: seq 0 | killed (1 failed, targeted) |
| BV18 values: case size 0 | killed (1 failed, targeted) |
| BV19 values: KYC not normalised | killed (1 failed, targeted) |
| BV20 rule 1: first deleted | killed (1 failed, targeted) |
| BV21 rule 1: closed creation | killed (1 failed, targeted) |
| BV22 rule 9: IS in team | killed (2 failed, targeted) |
| BV23 rule 9: deleted team | killed (1 failed, targeted) |
| BV24 rule 5: reviewer role | killed (1 failed, targeted) |
| BV25 rule 8: value | killed (3 failed, targeted) |
| BV26 rule 8: SYSTEM conflict | killed (1 failed, targeted) |
| BV27 values: birth date | **SURVIVED (full suite)** |
| BV28 values: timestamps | killed (2 failed, targeted) |
| BV29 rule 10: transitions | killed (2 failed, targeted) |
| BV30 rule 10: issued | killed (1 failed, targeted) |
| BK1 foreign_key_check dropped | killed (1 failed, targeted) |
| BK2 integer: unsafe accepted | killed (2 failed, targeted) |
| BK3 row keys not checked | killed (1 failed, targeted) |
| BK4 size limit +1 | killed (1 failed, targeted) |
| BK5 export order by rowid desc | killed (3 failed, targeted) |
| BK6 assertSupported dropped | killed (1 failed, targeted) |
| BK7 table set not checked | killed (1 failed, targeted) |
| BK8 exportedAt from system clock | killed (2 failed, targeted) |
| BK9 invariants not checked | killed (43 failed, targeted) |
| DB1 persist on nested too | killed (1 failed, targeted) |
| DB2 nested failure not rolled back | killed (1 failed, targeted) |
| DB3 FK not re-enabled after export | killed (1 failed, targeted) |
| DB4 migrations re-run | killed (6 failed, targeted) |
| DB5 same version refused | killed (3 failed, targeted) |
| DB6 statements not freed before export | killed (1 failed, targeted) |
| DB7 FK never enabled | killed (2 failed, targeted) |
| DB8 cached statements really freed | killed (1 failed, targeted) |
| DB9 withSources does not restore | killed (1 failed, full suite) |
| SE1 timestamps after the anchor | **SURVIVED (full suite)** |
| SE2 meetings resolved on the anchor day | killed (1 failed, targeted) |
| SE3 policies issued on the anchor day | **SURVIVED (full suite)** |
| ID1 ulid time reversed | killed (2 failed, targeted) |
| ID2 base32 buffer not masked | **SURVIVED (full suite)** |

## Phụ lục B — Lệnh grep export (CL-B7)

```bash
cd /c/workspace/Project-2C-review
# every name exported by packages/db/src/index.ts
for s in <tên>; do
  prod=$(grep -rlw --include='*.ts' --include='*.tsx' --include='*.mjs' "$s" apps e2e tools packages \
    | grep -v node_modules | grep -v '^packages/db/' | grep -v '\.test\.' | grep -v '/dist/' | wc -l)
  echo "$s prod=$prod"; done
# internal exports: grep -lw <tên> packages/db/src/*.ts (bỏ *.test.ts)
```

## Phụ lục C — Nguồn test tạm / probe

Mọi file ở `C:\workspace\deep-review-1-4\claude\B\`. Chạy probe (PowerShell, trong thư mục đó): `node node_modules/vitest/vitest.mjs run --config vitest.probe.config.mts <tên>`; kết quả ghi ra `<tên>.result.json` (Vitest 5 không in console.log của test xanh). Chạy mutation: `node mutate.mjs [tiền tố | BASELINE]`. Múi giờ: `$env:TZ='Pacific/Honolulu'; pnpm vitest run packages/db` trong worktree.

### `vitest.probe.config.mts`

```ts
// Runs the gói B probes (probe-*.test.ts) against the review worktree's packages, read-only.
// Usage (PowerShell, from this folder): node node_modules/vitest/vitest.mjs run --config vitest.probe.config.mts [file filter]
const repo = 'C:/workspace/Project-2C-review';
const here = 'C:/workspace/deep-review-1-4/claude/B';

export default {
  root: here,
  resolve: {
    alias: [
      { find: /^@p2c\/domain$/, replacement: `${repo}/packages/domain/src/index.ts` },
      { find: /^@p2c\/db$/, replacement: `${repo}/packages/db/src/index.ts` },
      // Internal modules not exported by @p2c/db (backup-validation, common…), read-only.
      { find: /^#db\/(.*)$/, replacement: `${repo}/packages/db/src/$1` },
      // drizzle-orm is linked only under packages/db; same real file, so the same module instance.
      { find: /^drizzle-orm$/, replacement: `${repo}/packages/db/node_modules/drizzle-orm/index.js` },
    ],
  },
  server: { fs: { allow: [repo, here, 'C:/workspace/deep-review-1-4/common'] } },
  test: {
    include: ['probe-*.test.ts'],
    globals: true,
    testTimeout: 900_000,
    fileParallelism: false,
  },
};
```

### `probe-db.ts`

```ts
// Shared imports of the gói B probes: the public API of @p2c/db plus a few domain helpers, and
// `save`, which writes a probe's result next to it (Vitest 5 keeps console.log of passing tests).
import { writeFileSync } from 'node:fs';

export * from '@p2c/db';
export { calendarDate as calendarDateOf } from '@p2c/domain';

export function save(name: string, result: unknown): void {
  writeFileSync(
    `C:/workspace/deep-review-1-4/claude/B/${name}.result.json`,
    JSON.stringify(result, null, 1),
  );
}
```

### `probe-perf.test.ts`

```ts
// Probe gói B, trục P: cost of the db package on the load data (common/load/load-backup.json:
// 1 496 KH, 10 434 lịch hẹn, 51 nhân sự, 1 804 HĐ), in Node. Each figure is the median of RUNS runs
// after one warm-up unless said otherwise. Read-only: everything runs on in-memory sql.js copies.
import { readFileSync, writeFileSync } from 'node:fs';
import {
  addKycNote,
  calendarDateOf,
  exportBackup,
  getKycProfile,
  importBackup,
  listAppointments,
  listCustomers,
  listKycVersions,
  listPeople,
  listPolicies,
  listStageTransitions,
  loadMetricsData,
  openDatabase,
  softDeleteAppointment,
  updatePerson,
} from './probe-db';
import { validateBackupInvariants, validateBackupValues } from '#db/backup-validation';

const RUNS = 7;
const LOAD = 'C:/workspace/deep-review-1-4/common/load/load-backup.json';
const NOW = () => new Date(Date.UTC(2026, 9, 5, 9, 0, 0));

function median(fn: () => unknown, runs = RUNS): number {
  fn();
  const times: number[] = [];
  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  return Math.round(times[Math.floor(runs / 2)]! * 100) / 100;
}

async function medianAsync(fn: () => Promise<unknown>, runs = 3): Promise<number> {
  const times: number[] = [];
  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    await fn();
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  return Math.round(times[Math.floor(runs / 2)]!);
}

const plan = (db: { sqlite: { exec(sql: string): { values: unknown[][] }[] } }, sql: string) =>
  db.sqlite
    .exec(`EXPLAIN QUERY PLAN ${sql}`)[0]!
    .values.map((v) => String(v[3]))
    .join(' | ');

it('measures the db package on the load data', async () => {
  const text = readFileSync(LOAD, 'utf8');
  const out: Record<string, unknown> = { textChars: text.length };

  out.importBackupMs = await medianAsync(async () => {
    const { db } = await importBackup(text, { now: NOW });
    db.sqlite.close();
  });
  const { db } = await importBackup(text, { now: NOW });
  out.validateValuesMs = median(() => validateBackupValues(db), 3);
  out.validateInvariantsMs = median(() => validateBackupInvariants(db), 3);
  out.jsonParseMs = median(() => JSON.parse(text), 3);
  out.exportBackupMs = median(() => exportBackup(db), 3);
  out.exportBackupChars = exportBackup(db).length;

  // The persist port receives db.export() after every top-level transaction (exe mode).
  const bytes = db.export();
  out.dbFileBytes = bytes.byteLength;
  out.dbExportMs = median(() => db.export());
  out.openDatabaseFromBytesMs = await medianAsync(async () => {
    const reopened = await openDatabase({ bytes, now: NOW });
    reopened.sqlite.close();
  });

  // Reads behind the screens.
  const customers = listCustomers(db);
  out.listCustomersMs = median(() => listCustomers(db));
  out.listAppointmentsAllMs = median(() => listAppointments(db));
  out.listPoliciesMs = median(() => listPolicies(db));
  out.listStageTransitionsMs = median(() => listStageTransitions(db));
  out.listPeopleMs = median(() => listPeople(db));
  out.loadMetricsDataMs = median(() => loadMetricsData(db));
  const sample = customers.filter((_, i) => i % 30 === 0); // 50 customers
  out.listAppointmentsOneCustomerMsEach =
    Math.round((median(() => sample.forEach((c) => listAppointments(db, c.id))) / sample.length) * 1000) / 1000;
  out.listStageTransitionsOneCustomerMsEach =
    Math.round((median(() => sample.forEach((c) => listStageTransitions(db, c.id))) / sample.length) * 1000) / 1000;
  out.getKycProfileMsEach =
    Math.round((median(() => sample.forEach((c) => getKycProfile(db, c.id))) / sample.length) * 1000) / 1000;
  out.listKycVersionsMsEach =
    Math.round((median(() => sample.forEach((c) => listKycVersions(db, c.id))) / sample.length) * 1000) / 1000;

  // Query plans of the lookups by a column that has no index.
  out.plans = {
    appointmentsByCustomer: plan(db, "SELECT * FROM appointments WHERE customer_id = 'x'"),
    transitionByAppointment: plan(db, "SELECT * FROM stage_transitions WHERE appointment_id = 'x' AND deleted_at IS NULL"),
    appointmentsByReviewer: plan(db, "SELECT id FROM appointments WHERE outcome_reviewer_id = 'x' AND deleted_at IS NULL"),
    coordinatorsByPerson: plan(db, "SELECT * FROM appointment_coordinators WHERE person_id = 'x'"),
    recordsByRe: plan(db, "SELECT id FROM appointments WHERE re_id = 'x' AND deleted_at IS NULL"),
    transitionsLatest: plan(db, "SELECT * FROM stage_transitions WHERE customer_id = 'x' AND deleted_at IS NULL ORDER BY seq DESC LIMIT 1"),
  };

  // A command with and without the persist port, on copies of the same file.
  const plain = await openDatabase({ bytes, now: NOW });
  let saved = 0;
  const persisting = await openDatabase({ bytes, now: NOW, persist: (b) => (saved += b.byteLength) });
  const ids = listCustomers(plain).map((c) => c.id);
  let i = 0;
  const note = (target: typeof plain) => () =>
    addKycNote(target, ids[i++ % ids.length]!, { text: 'probe', date: calendarDateOf(2026, 10, 5) });
  out.addKycNoteNoPersistMs = median(note(plain), 21);
  out.addKycNoteWithPersistMs = median(note(persisting), 21);
  out.persistedBytesTotal = saved;

  // softDeleteAppointment looks the transition up by appointment_id (no index): time it per
  // command on live appointments, without persist, then with an index added on a copy.
  const live = listAppointments(plain).filter((a) => a.status !== 'MET').slice(0, 200);
  let k = 0;
  out.softDeleteAppointmentNoIndexMs = median(() => softDeleteAppointment(plain, live[k++]!.id), 41);
  const indexed = await openDatabase({ bytes, now: NOW });
  indexed.sqlite.run('CREATE INDEX probe_t_appt ON stage_transitions (appointment_id)');
  let m = 0;
  out.softDeleteAppointmentWithIndexMs = median(() => softDeleteAppointment(indexed, live[m++]!.id), 41);
  // updatePerson on an RE scans customers, appointments and policies by re_id.
  const re = listPeople(plain).find((p) => p.role === 'RE')!;
  out.updatePersonNameMs = median(() => updatePerson(plain, re.id, { name: `RE ${Math.random()}` }), 21);

  console.log(JSON.stringify(out, null, 1));
  writeFileSync('C:/workspace/deep-review-1-4/claude/B/probe-perf.result.json', JSON.stringify(out, null, 1));
  for (const d of [db, plain, persisting, indexed]) d.sqlite.close();
});
```

### `probe-listappts.test.ts`

```ts
// Probe gói B, trục P: where the 92 ms of listAppointments(db) go on the load data (10 434 lịch
// hẹn). Each step of appointments.ts:94-110 is timed on its own, median of RUNS runs.
import { readFileSync } from 'node:fs';
import { and, asc, eq, isNull } from 'drizzle-orm';
import {
  importBackup,
  listAppointments,
  listStageTransitions,
  listPolicies,
  listCustomers,
  save,
} from './probe-db';
import { appointmentCoordinators, appointments, customers } from '#db/schema';
import { fromIsoDate } from '#db/common';

const RUNS = 9;
const median = (fn: () => unknown) => {
  fn();
  const t: number[] = [];
  for (let i = 0; i < RUNS; i++) {
    const s = performance.now();
    fn();
    t.push(performance.now() - s);
  }
  return Math.round(t.sort((a, b) => a - b)[Math.floor(RUNS / 2)]! * 100) / 100;
};

it('breaks listAppointments down', async () => {
  const text = readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json', 'utf8');
  const { db } = await importBackup(text, { now: () => new Date(Date.UTC(2026, 9, 5, 9)) });
  const sql = `SELECT a.* FROM appointments a JOIN customers c ON c.id = a.customer_id
    WHERE a.deleted_at IS NULL AND c.deleted_at IS NULL ORDER BY a.date, a.time, a.id`;
  const drizzleRows = () =>
    db.orm
      .select({ a: appointments })
      .from(appointments)
      .innerJoin(customers, eq(customers.id, appointments.customerId))
      .where(and(isNull(appointments.deletedAt), isNull(customers.deletedAt)))
      .orderBy(asc(appointments.date), asc(appointments.time), asc(appointments.id))
      .all();
  const coordinators = () =>
    db.orm
      .select({
        appointmentId: appointmentCoordinators.appointmentId,
        personId: appointmentCoordinators.personId,
      })
      .from(appointmentCoordinators)
      .innerJoin(appointments, eq(appointments.id, appointmentCoordinators.appointmentId))
      .orderBy(asc(appointmentCoordinators.personId))
      .all();
  const rows = drizzleRows();
  const out = {
    rows: rows.length,
    coordinatorRows: coordinators().length,
    rawExecSameSqlMs: median(() => db.sqlite.exec(sql)),
    rawExecNoOrderMs: median(() =>
      db.sqlite.exec(sql.replace(' ORDER BY a.date, a.time, a.id', '')),
    ),
    rawStepGetMs: median(() => {
      const s = db.sqlite.prepare(sql);
      const out: unknown[] = [];
      while (s.step()) out.push(s.get());
      s.free();
      return out;
    }),
    drizzleSelectJoinMs: median(drizzleRows),
    drizzleSelectFlatMs: median(() =>
      db.orm.select().from(appointments).where(isNull(appointments.deletedAt)).all(),
    ),
    coordinatorsQueryMs: median(coordinators),
    fromIsoDateMapMs: median(() => rows.map(({ a }) => fromIsoDate(a.date))),
    listAppointmentsMs: median(() => listAppointments(db)),
    listStageTransitionsMs: median(() => listStageTransitions(db)),
    listPoliciesMs: median(() => listPolicies(db)),
    listCustomersMs: median(() => listCustomers(db)),
  };
  save('probe-listappts', out);
  db.sqlite.close();
});
```

### `probe-gaps.test.ts`

```ts
// Probe gói B, trục D / E: states a backup import accepts that no command can leave, and edge
// inputs the commands accept. Each case prints what happened; nothing is written to the repo.
import { codeOf, d, setup } from '#db/test-support';
import {
  createCustomer,
  createPerson,
  createTeam,
  editMeetingOutcome,
  exportBackup,
  getCustomer,
  getKycProfile,
  importBackup,
  listAppointments,
  listCustomers,
  listPeople,
  listTeams,
  recordMeetingOutcome,
  rescheduleAppointment,
  save,
  scheduleAppointment,
  softDeletePerson,
  submitPolicy,
  updateAppointmentDetails,
  updateCustomerProfile,
} from './probe-db';
import { evaluateKycGate } from '@p2c/domain';

type Row = Record<string, unknown>;
type Backup = { tables: Record<string, Row[]> };
const results: Record<string, unknown> = {};

async function base() {
  const ctx = await setup();
  const { db, re, tl } = ctx;
  const helper = createPerson(db, { name: 'Hỗ Trợ', role: 'IS', teamId: null });
  const lan = createCustomer(db, {
    name: 'Lan',
    reId: re.id,
    stage: 'N4',
    date: d(1, 9),
    birthDate: { year: 1984 },
    gender: 'FEMALE',
  });
  const met = scheduleAppointment(db, {
    customerId: lan.id,
    reId: re.id,
    date: d(10, 9),
    triggerType: 'REFERRAL',
    coordinatorIds: [tl.id],
  });
  recordMeetingOutcome(db, met.id, {
    status: 'MET',
    stageAfter: 'N3',
    nextStep: 'Gửi bảng minh họa',
    outcomeReviewerId: helper.id,
  });
  const booked = scheduleAppointment(db, {
    customerId: lan.id,
    reId: re.id,
    date: d(30, 9),
    triggerType: 'EVENT',
  });
  return { ...ctx, helper, lan, met, booked };
}

async function tryImport(backup: Backup, now: () => Date) {
  try {
    const { db } = await importBackup(JSON.stringify(backup), { now });
    return { accepted: true, db };
  } catch (error) {
    return { accepted: false, error: String((error as { code?: string }).code ?? error), db: undefined };
  }
}

it('import accepts a live appointment whose coordinator / reviewer is deleted (commands refuse)', async () => {
  const { db, tl, helper, met } = await base();
  const viaCommand = {
    deleteCoordinator: codeOf(() => softDeletePerson(db, tl.id)),
    deleteReviewer: codeOf(() => softDeletePerson(db, helper.id)),
  };
  const backup = JSON.parse(exportBackup(db)) as Backup;
  // The TL only coordinates; the IS only reviews. Mark both deleted in the file.
  for (const p of backup.tables.people!) {
    if (p.id === helper.id) p.deleted_at = '2026-09-26T09:00:00.000Z';
  }
  const otherTl = backup.tables.people!.find((p) => p.id === tl.id)!;
  otherTl.deleted_at = '2026-09-26T09:00:00.000Z';
  const imported = await tryImport(backup, db.now);
  let afterImport: Record<string, unknown> = {};
  if (imported.db) {
    const a = listAppointments(imported.db).find((x) => x.id === met.id)!;
    afterImport = {
      coordinatorIds: a.coordinatorIds,
      reviewer: a.outcomeReviewerId,
      livePeople: listPeople(imported.db).map((p) => p.name),
      // Saving the edit dialog unchanged (6f): same outcome, same coordinators.
      saveUnchanged: codeOf(() =>
        editMeetingOutcome(
          imported.db!,
          met.id,
          { status: 'MET', stageAfter: 'N3', nextStep: 'x', outcomeReviewerId: a.outcomeReviewerId },
          { coordinatorIds: a.coordinatorIds },
        ),
      ),
      saveDetailsOnly: codeOf(() =>
        updateAppointmentDetails(imported.db!, met.id, { coordinatorIds: a.coordinatorIds }),
      ),
    };
  }
  results.deletedCoordinatorReviewer = { viaCommand, accepted: imported.accepted, afterImport };
});

it('import accepts empty / padded names, an empty next step and an empty KYC note (commands refuse)', async () => {
  const { db, lan, met, re } = await base();
  const backup = JSON.parse(exportBackup(db)) as Backup;
  backup.tables.teams![0]!.name = '   ';
  backup.tables.people!.find((p) => p.id === re.id)!.name = '';
  backup.tables.customers!.find((c) => c.id === lan.id)!.name = '  Lan  ';
  backup.tables.customers!.find((c) => c.id === lan.id)!.code = 'not-a-code';
  backup.tables.appointments!.find((a) => a.id === met.id)!.next_step = '';
  backup.tables.kyc_notes!.find((n) => n.source === 'SYSTEM')!.text = '';
  const imported = await tryImport(backup, db.now);
  results.emptyTexts = {
    accepted: imported.accepted,
    error: imported.error,
    teams: imported.db && listTeams(imported.db).map((t) => JSON.stringify(t.name)),
    customer: imported.db && JSON.stringify(getCustomer(imported.db, lan.id)),
  };
});

it('import accepts two live appointments rescheduled from one, and one rescheduled from itself', async () => {
  const { db, booked } = await base();
  rescheduleAppointment(db, booked.id, { date: d(2, 10) }, 'Khách bận');
  const backup = JSON.parse(exportBackup(db)) as Backup;
  const successor = backup.tables.appointments!.find((a) => a.rescheduled_from_id === booked.id)!;
  backup.tables.appointments!.push({ ...successor, id: 'ZZZZSECONDSUCCESSOR0000000', date: '2026-10-03' });
  const self = { ...backup.tables.appointments!.find((a) => a.id === booked.id)!, id: 'ZZZZSELF000000000000000000' };
  self.rescheduled_from_id = self.id;
  backup.tables.appointments!.push(self);
  const imported = await tryImport(backup, db.now);
  results.rescheduleChain = { accepted: imported.accepted, error: imported.error };
});

it('import accepts a profile birth year / gender with no KYC fact at all (rule 8 checks one way)', async () => {
  const { db, lan } = await base();
  const backup = JSON.parse(exportBackup(db)) as Backup;
  backup.tables.kyc_facts = backup.tables.kyc_facts!.filter((f) => f.customer_id !== lan.id);
  backup.tables.kyc_versions = backup.tables.kyc_versions!.filter((v) => v.customer_id !== lan.id);
  const imported = await tryImport(backup, db.now);
  let after: Record<string, unknown> = {};
  if (imported.db) {
    const customer = getCustomer(imported.db, lan.id)!;
    const profile = getKycProfile(imported.db, lan.id);
    after = {
      profileBirthDate: customer.birthDate,
      profileGender: customer.gender,
      factsInEffect: profile.facts.filter((f) => f.status !== 'superseded').map((f) => f.field),
      gate: evaluateKycGate(profile.facts).state,
      // Saving the same profile again records nothing, so the gap stays.
      resave: (() => {
        updateCustomerProfile(imported.db!, lan.id, { birthDate: { year: 1984 }, gender: 'FEMALE' });
        return getKycProfile(imported.db!, lan.id).facts.map((f) => f.field);
      })(),
    };
  }
  results.profileWithoutFacts = { accepted: imported.accepted, error: imported.error, after };
});

it('commands accept a policy and a meeting dated before the customer was created', async () => {
  const { db, re } = await base();
  const late = createCustomer(db, { name: 'Muộn', reId: re.id, stage: 'N2', date: d(20, 9) });
  const policy = codeOf(() =>
    submitPolicy(db, { customerId: late.id, reId: re.id, submittedDate: d(5, 9), submittedFyp: 10_000_000 }),
  );
  const early = scheduleAppointment(db, {
    customerId: late.id,
    reId: re.id,
    date: d(3, 9),
    triggerType: 'OTHER',
  });
  const metKeptStage = codeOf(() =>
    recordMeetingOutcome(db, early.id, { status: 'MET', stageAfter: 'N2', nextStep: 'Gặp lại' }),
  );
  const metMoved = codeOf(() =>
    recordMeetingOutcome(db, early.id, { status: 'MET', stageAfter: 'N1', nextStep: 'Gặp lại' }),
  );
  const birthInFuture = codeOf(() =>
    createCustomer(db, { name: 'Tương Lai', reId: re.id, stage: 'N4', date: d(1, 9), birthDate: d(1, 1, 2090) }),
  );
  const birthAfterCreation = codeOf(() =>
    createCustomer(db, { name: 'Sinh Sau', reId: re.id, stage: 'N4', date: d(1, 9), birthDate: d(20, 9) }),
  );
  const imported = await tryImport(JSON.parse(exportBackup(db)) as Backup, db.now);
  results.beforeCreation = {
    submitPolicyBeforeCreation: policy ?? 'accepted',
    metKeptStageBeforeCreation: metKeptStage ?? 'accepted',
    metMovedBeforeCreation: metMoved ?? 'accepted',
    birthDate2090: birthInFuture ?? 'accepted',
    birthDateAfterCreation: birthAfterCreation ?? 'accepted',
    importOfThat: imported.accepted,
  };
});

it('names: NFC / NFD, case and inner spaces count as different team names', async () => {
  const { db } = await setup();
  const nfc = 'Hừng Đông';
  const out: Record<string, unknown> = {};
  out.first = createTeam(db, { name: nfc }).name.length;
  out.nfd = codeOf(() => createTeam(db, { name: nfc.normalize('NFD') })) ?? 'accepted';
  out.lower = codeOf(() => createTeam(db, { name: nfc.toLowerCase() })) ?? 'accepted';
  out.doubleSpace = codeOf(() => createTeam(db, { name: 'Hừng  Đông' })) ?? 'accepted';
  out.teams = listTeams(db).map((t) => `${t.name} (${t.name.length})`);
  // A NUL inside a name, and a very long one, through a backup round trip.
  const { db: db2, re } = await setup();
  createCustomer(db2, { name: 'A\u0000B', reId: re.id, stage: 'N4', date: d(1, 9) });
  createCustomer(db2, { name: 'x'.repeat(200_000), reId: re.id, stage: 'N4', date: d(1, 9) });
  createCustomer(db2, { name: 'C:\\Users\\"x"', reId: re.id, stage: 'N4', date: d(1, 9) });
  out.storedNames = listCustomers(db2).map((c) => (c.name.length > 50 ? `len ${c.name.length}` : JSON.stringify(c.name)));
  const imported = await importBackup(exportBackup(db2), { now: db2.now });
  out.importedNames = listCustomers(imported.db).map((c) =>
    c.name.length > 50 ? `len ${c.name.length}` : JSON.stringify(c.name),
  );
  results.names = out;
});

it('list order: SQLite compares names byte by byte, not in Vietnamese order', async () => {
  const { db } = await setup();
  for (const name of ['Đỗ Văn A', 'Dương Thị B', 'Vũ Minh C', 'Ánh', 'Bình', 'an']) {
    createPerson(db, { name, role: 'IS', teamId: null });
  }
  const db1 = listPeople(db).map((p) => p.name);
  results.listOrder = {
    listPeople: db1,
    vietnamese: [...db1].sort(new Intl.Collator('vi').compare),
  };
});

afterAll(() => save('probe-gaps', results));
```

### `probe-future.test.ts`

```ts
// Probe gói B, trục C / E: dates the UI refuses as "future" (customers-view.ts parseRecordDate /
// parseBirthDate) but the commands and the import take: a KYC note, fact and version dated after
// today, a birth date after today. Clock of setup(): 26/09/2026.
import { codeOf, d, setup } from '#db/test-support';
import {
  createCustomer,
  exportBackup,
  getKycProfile,
  importBackup,
  listKycVersions,
  recordKycNote,
  resolveKycConflict,
  save,
  updateCustomerProfile,
} from './probe-db';

it('future KYC dates and birth dates', async () => {
  const { db, re } = await setup();
  const lan = createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N4', date: d(1, 9) });
  const out: Record<string, unknown> = {};
  out.recordKycNoteDated2027 =
    codeOf(() =>
      recordKycNote(db, lan.id, {
        text: 'Hai con',
        date: d(1, 1, 2027),
        facts: [{ field: 'childrenCount', value: 2 }],
      }),
    ) ?? 'accepted';
  out.recordConflictDated2030 =
    codeOf(() =>
      recordKycNote(db, lan.id, {
        text: 'Ba con',
        date: d(1, 1, 2030),
        facts: [{ field: 'childrenCount', value: 3, conflict: true }],
      }),
    ) ?? 'accepted';
  const conflict = getKycProfile(db, lan.id).facts.find((f) => f.status === 'conflict')!;
  out.resolveDated2099 =
    codeOf(() => resolveKycConflict(db, lan.id, { factId: conflict.id, date: d(31, 12, 2099) })) ??
    'accepted';
  out.versionDates = listKycVersions(db, lan.id).map((v) => v.summary);
  out.birthDateTomorrow =
    codeOf(() => updateCustomerProfile(db, lan.id, { birthDate: d(27, 9) })) ?? 'accepted';
  try {
    await importBackup(exportBackup(db), { now: db.now });
    out.importOfThat = 'accepted';
  } catch (error) {
    out.importOfThat = `refused: ${String((error as { code?: string }).code ?? error)}`;
  }
  save('probe-future', out);
});
```

### `probe-values.test.ts`

```ts
// Probe gói B, trục E / D: which timestamps and ids the value check of an import accepts
// (backup-validation.ts:44-53), against what the commands write (`Date#toISOString`, ULID).
import { setup, d } from '#db/test-support';
import { createCustomer, exportBackup, importBackup, save } from './probe-db';

type Backup = { tables: Record<string, Record<string, unknown>[]> };

it('timestamps and ids an import accepts', async () => {
  const { db, re } = await setup();
  createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N4', date: d(1, 9) });
  const text = exportBackup(db);
  const out: Record<string, string> = {};
  const cases: [string, (b: Backup) => void][] = [
    ['created_at 30/02', (b) => (b.tables.customers![0]!.created_at = '2026-02-30T10:00:00Z')],
    ['created_at 31/04', (b) => (b.tables.customers![0]!.created_at = '2026-04-31T10:00:00.000Z')],
    ['created_at 29/02 non-leap', (b) => (b.tables.customers![0]!.created_at = '2027-02-29T10:00:00Z')],
    ['created_at no Z', (b) => (b.tables.customers![0]!.created_at = '2026-09-26T10:00:00')],
    ['created_at +07:00', (b) => (b.tables.customers![0]!.created_at = '2026-09-26T10:00:00+07:00')],
    ['created_at year 0001', (b) => (b.tables.customers![0]!.created_at = '0001-01-01T00:00:00Z')],
    ['deleted_at before created_at', (b) => (b.tables.customers![0]!.deleted_at = '2000-01-01T00:00:00Z')],
    ['updated_at before created_at', (b) => (b.tables.customers![0]!.updated_at = '2000-01-01T00:00:00Z')],
    ['customer id empty string (and its rows)', (b) => {
      const old = b.tables.customers![0]!.id;
      for (const rows of Object.values(b.tables)) for (const r of rows) for (const k of Object.keys(r)) if (r[k] === old) r[k] = '';
    }],
  ];
  for (const [label, edit] of cases) {
    const backup = JSON.parse(text) as Backup;
    edit(backup);
    try {
      const { db: imported } = await importBackup(JSON.stringify(backup), { now: db.now });
      const back = imported.sqlite.exec('SELECT created_at, deleted_at FROM customers')[0]!.values[0]!;
      const parsed = new Date(String(back[0]));
      const js = Number.isNaN(parsed.getTime()) ? 'Invalid Date' : parsed.toISOString();
      out[label] = `accepted (stored ${JSON.stringify(back)}; new Date(created_at) = ${js})`;
    } catch (error) {
      out[label] = `refused: ${String((error as { code?: string }).code ?? error)}`;
    }
  }
  save('probe-values', out);
});
```

### `probe-migration.test.ts`

```ts
// Probe gói B, trục D: migrate() runs every pending migration inside one transaction with foreign
// keys on (database.ts:175-188). drizzle-kit writes a table rebuild (to add a CHECK, change a
// column…) as PRAGMA foreign_keys=OFF; CREATE __new_x; INSERT…SELECT; DROP x; RENAME; PRAGMA ON.
// Inside a transaction the PRAGMA is a no-op (the 0004 migration says so), so DROP TABLE runs its
// implicit DELETE with foreign keys on. Does such a migration pass on an empty DB and on one with
// data? And with PRAGMA defer_foreign_keys = ON as a possible fix?
import { codeOf, d, setup } from '#db/test-support';
import { MIGRATIONS, type Migration } from '#db/migrations';
import { migrate } from '#db/database';
import { createCustomer, listCustomers, listPeople, openDatabase, save } from './probe-db';

const rebuildPeople = (prefix = ''): Migration => ({
  id: 6,
  tag: '0005_probe_people_rebuild',
  sql: `${prefix}PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE \`__new_people\` (
\t\`id\` text PRIMARY KEY NOT NULL,
\t\`name\` text NOT NULL,
\t\`role\` text NOT NULL,
\t\`team_id\` text,
\t\`created_at\` text NOT NULL,
\t\`updated_at\` text NOT NULL,
\t\`deleted_at\` text,
\tFOREIGN KEY (\`team_id\`) REFERENCES \`teams\`(\`id\`) ON UPDATE no action ON DELETE no action,
\tCONSTRAINT "people_role" CHECK("__new_people"."role" IN ('RE', 'TL', 'IS', 'BD', 'BDM')),
\tCONSTRAINT "people_team_required" CHECK("__new_people"."role" NOT IN ('RE', 'TL') OR "__new_people"."team_id" IS NOT NULL),
\tCONSTRAINT "people_name" CHECK(trim("__new_people"."name") <> '')
);
--> statement-breakpoint
INSERT INTO \`__new_people\`("id", "name", "role", "team_id", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "role", "team_id", "created_at", "updated_at", "deleted_at" FROM \`people\`;--> statement-breakpoint
DROP TABLE \`people\`;--> statement-breakpoint
ALTER TABLE \`__new_people\` RENAME TO \`people\`;--> statement-breakpoint
PRAGMA foreign_keys=ON;`,
});

async function attempt(withData: boolean, prefix = '') {
  const { db, re } = await setup();
  if (withData) createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N4', date: d(1, 9) });
  try {
    migrate(db, [...MIGRATIONS, rebuildPeople(prefix)]);
    const fk = db.sqlite.exec('PRAGMA foreign_key_check');
    const reopened = await openDatabase({ bytes: db.export(), migrations: [...MIGRATIONS, rebuildPeople(prefix)] });
    return {
      ok: true,
      version: db.schemaVersion(),
      fkViolations: fk.length,
      people: listPeople(reopened).length,
      customers: listCustomers(reopened).length,
      fkRefsPeople: String(db.sqlite.exec("SELECT sql FROM sqlite_master WHERE name = 'customers'")[0]!.values[0]![0]).includes('REFERENCES `people`'),
    };
  } catch (error) {
    // Is a transaction still open after the failure (COMMIT failing is not rolled back)?
    let next: string;
    try {
      db.transaction(() => 1);
      next = 'next transaction ok';
    } catch (e) {
      next = `next transaction: ${String(e)}`;
    }
    return { ok: false, error: String(error), versionAfter: db.schemaVersion(), next };
  }
}

it('runs a drizzle-kit style table rebuild through migrate()', async () => {
  save('probe-migration', {
    emptyDb: await attempt(false),
    dbWithACustomer: await attempt(true),
    withDeferForeignKeys: await attempt(true, 'PRAGMA defer_foreign_keys = ON;--> statement-breakpoint\n'),
    codeOfUnused: codeOf(() => undefined),
  });
});
```

### `probe-seedinv.test.ts`

```ts
// Probe gói B, "bất biến seed": on the load data (generated through the commands like the demo
// seed), rules the import does not check but that hold by construction — appointments, policies
// and KYC notes not before the customer's creation, one live successor per rescheduled
// appointment, coordinators and reviewers live — counted with plain SQL.
import { readFileSync } from 'node:fs';
import { importBackup, save } from './probe-db';

it('counts rows that break the unchecked rules on the load data', async () => {
  const text = readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json', 'utf8');
  const { db } = await importBackup(text, { now: () => new Date(Date.UTC(2026, 9, 5, 9)) });
  const count = (sql: string) => Number(db.sqlite.exec(sql)[0]?.values[0]?.[0] ?? 0);
  const created = `(SELECT date FROM stage_transitions t WHERE t.customer_id = x.customer_id AND t.seq = 1)`;
  const out = {
    appointmentsBeforeCreation: count(`SELECT COUNT(*) FROM appointments x WHERE x.date < ${created}`),
    policiesBeforeCreation: count(`SELECT COUNT(*) FROM policies x WHERE x.submitted_date < ${created}`),
    kycNotesBeforeCreation: count(`SELECT COUNT(*) FROM kyc_notes x WHERE x.created_date < ${created}`),
    rescheduledWithoutOneSuccessor: count(`SELECT COUNT(*) FROM appointments r WHERE r.status = 'RESCHEDULED'
      AND (SELECT COUNT(*) FROM appointments s WHERE s.rescheduled_from_id = r.id) <> 1`),
    liveAppointmentsWithDeletedCoordinator: count(`SELECT COUNT(*) FROM appointment_coordinators c
      JOIN appointments a ON a.id = c.appointment_id JOIN people p ON p.id = c.person_id
      WHERE a.deleted_at IS NULL AND p.deleted_at IS NOT NULL`),
    reCoordinators: count(`SELECT COUNT(*) FROM appointment_coordinators c JOIN people p ON p.id = c.person_id WHERE p.role = 'RE'`),
    profileBirthWithoutFact: count(`SELECT COUNT(*) FROM customers c WHERE c.birth_date IS NOT NULL AND NOT EXISTS
      (SELECT 1 FROM kyc_facts f WHERE f.customer_id = c.id AND f.field = 'birthYear' AND f.status <> 'superseded')`),
    profileGenderWithoutFact: count(`SELECT COUNT(*) FROM customers c WHERE c.gender IS NOT NULL AND NOT EXISTS
      (SELECT 1 FROM kyc_facts f WHERE f.customer_id = c.id AND f.field = 'gender' AND f.status <> 'superseded')`),
    emptyNames: count(`SELECT (SELECT COUNT(*) FROM customers WHERE trim(name) = '' OR name <> trim(name))
      + (SELECT COUNT(*) FROM people WHERE trim(name) = '' OR name <> trim(name))`),
    appointmentReNotCustomerRe: count(`SELECT COUNT(*) FROM appointments a JOIN customers c ON c.id = a.customer_id WHERE a.re_id <> c.re_id`),
    policyReNotCustomerRe: count(`SELECT COUNT(*) FROM policies p JOIN customers c ON c.id = p.customer_id WHERE p.re_id <> c.re_id`),
    kycVersionDatesGoingBack: count(`SELECT COUNT(*) FROM kyc_versions v JOIN kyc_versions w
      ON w.customer_id = v.customer_id AND w.seq = v.seq + 1 WHERE w.date < v.date`),
    totals: {
      appointments: count('SELECT COUNT(*) FROM appointments'),
      rescheduled: count("SELECT COUNT(*) FROM appointments WHERE status = 'RESCHEDULED'"),
      kycVersions: count('SELECT COUNT(*) FROM kyc_versions'),
    },
  };
  save('probe-seedinv', out);
  db.sqlite.close();
});
```

### `probe-roundtrip.test.ts`

```ts
// Probe gói B, trục D: the load backup imported and exported again is the same text apart from
// `exportedAt` (spec §8 "xuất lại giống hệt từng byte"), and so is a second round.
import { readFileSync } from 'node:fs';
import { exportBackup, importBackup, save } from './probe-db';

it('round-trips the load backup', async () => {
  const text = readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json', 'utf8');
  const now = () => new Date(Date.UTC(2026, 9, 5, 9));
  const strip = (t: string) => t.replace(/"exportedAt":"[^"]*"/, '"exportedAt":""');
  const { db } = await importBackup(text, { now });
  const once = exportBackup(db);
  const { db: db2 } = await importBackup(once, { now });
  const twice = exportBackup(db2);
  save('probe-roundtrip', {
    inputChars: text.length,
    sameAsInput: strip(once) === strip(text),
    secondRoundSame: once === twice,
    firstDiffAt: (() => {
      const a = strip(once);
      const b = strip(text);
      for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return i;
      return a.length === b.length ? -1 : Math.min(a.length, b.length);
    })(),
  });
  db.sqlite.close();
  db2.sqlite.close();
});
```

### `probe-proto.test.ts`

```ts
// Probe gói B, trục S: a backup whose JSON carries "__proto__" keys (in tables and in a row), and
// a deeply nested value: refused or accepted, and does anything leak onto Object.prototype?
import { setup, d } from '#db/test-support';
import { createCustomer, exportBackup, importBackup, save } from './probe-db';

it('__proto__ keys and deep nesting in a backup', async () => {
  const { db, re } = await setup();
  createCustomer(db, { name: 'Lan', reId: re.id, stage: 'N4', date: d(1, 9) });
  const text = exportBackup(db);
  const tryImport = async (t: string) => {
    try {
      await importBackup(t, { now: db.now });
      return 'accepted';
    } catch (error) {
      return `refused: ${String((error as { code?: string }).code ?? error)}`;
    }
  };
  const out: Record<string, unknown> = {};
  out.tablesProto = await tryImport(text.replace('"tables":{', '"tables":{"__proto__":{"polluted":true},'));
  out.rowProto = await tryImport(text.replace('"customers":[{', '"customers":[{"__proto__":{"deleted_at":"2026-09-26T08:00:00Z"},'));
  out.envelopeProto = await tryImport(text.replace('{"format"', '{"__proto__":{"x":1},"format"'));
  out.deepNesting = await tryImport(`${'['.repeat(200_000)}${']'.repeat(200_000)}`);
  out.objectPrototypePolluted = ({} as Record<string, unknown>).polluted ?? null;
  save('probe-proto', out);
});
```

### `probe-load.test.ts`

```ts
// Probe gói B, trục P: the row-loading step of importBackup (backup.ts:138-163) on the load data.
// sql.js's minified `run(sql, params)` calls its internal prepare, not the instance `prepare` that
// database.ts caches, so every row prepares and frees a statement. Times (a) the same per-row
// `sqlite.run` as the code, (b) one prepared statement per table, each on a fresh staging DB.
import { readFileSync } from 'node:fs';
import { MIGRATIONS } from '#db/migrations';
import { openDatabase, save } from './probe-db';

it('times the row load of an import', async () => {
  const file = JSON.parse(
    readFileSync('C:/workspace/deep-review-1-4/common/load/load-backup.json', 'utf8'),
  ) as { tables: Record<string, Record<string, unknown>[]> };
  const out: Record<string, unknown> = { rows: Object.values(file.tables).reduce((n, t) => n + t.length, 0) };
  const quote = (name: string) => `"${name.replaceAll('"', '""')}"`;
  const loadWith = async (perTable: boolean) => {
    const db = await openDatabase({ migrations: MIGRATIONS });
    // Count real prepares: the instance prepare (cached) and sql.js internals both end in a new
    // Statement; patch the prototype's free to count frees of statements.
    const start = performance.now();
    db.sqlite.run('PRAGMA foreign_keys = OFF');
    db.transaction(() => {
      for (const [table, rows] of Object.entries(file.tables)) {
        const columns = db.sqlite
          .exec('SELECT name FROM pragma_table_info(?) ORDER BY cid', [table])[0]!
          .values.map(([n]) => String(n));
        const sql = `INSERT INTO ${quote(table)} (${columns.map(quote).join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;
        if (perTable) {
          const stmt = db.sqlite.prepare(sql);
          for (const row of rows) stmt.run(columns.map((c) => row[c] as never));
        } else {
          for (const row of rows) db.sqlite.run(sql, columns.map((c) => row[c] as never));
        }
      }
    });
    const ms = Math.round(performance.now() - start);
    db.sqlite.close();
    return ms;
  };
  const a: number[] = [];
  const b: number[] = [];
  for (let i = 0; i < 3; i++) {
    a.push(await loadWith(false));
    b.push(await loadWith(true));
  }
  out.perRowRunMs = a;
  out.preparedPerTableMs = b;
  save('probe-load', out);
});
```

### `probe-runcache.test.ts`

```ts
// Probe gói B: does sqlite.run(sql, params) go through the instance `prepare` that database.ts
// wraps with its statement cache (database.ts:132-155)? Counts calls of the wrapper.
import { openDatabase, save } from './probe-db';

it('counts instance prepare calls of run / exec / prepare', async () => {
  const db = await openDatabase();
  const wrapped = db.sqlite.prepare.bind(db.sqlite);
  let calls = 0;
  db.sqlite.prepare = ((sql: string, params?: never) => {
    calls++;
    return wrapped(sql, params);
  }) as typeof db.sqlite.prepare;
  const count = (fn: () => void) => {
    calls = 0;
    fn();
    return calls;
  };
  save('probe-runcache', {
    runWithParams: count(() => db.sqlite.run('SELECT ?', [1])),
    execWithParams: count(() => db.sqlite.exec('SELECT ?', [1])),
    preparePublic: count(() => db.sqlite.prepare('SELECT 1').free()),
  });
  db.sqlite.close();
});
```

### `probe-birthread.test.ts`

```ts
// Probe gói B (for mutation BV27): what reading a stored birth date that is not a real day does,
// had the import let it in (toCustomer → fromIsoDate → calendarDate).
import { fromIsoDate } from '#db/common';
import { save } from './probe-db';

it('reads an impossible stored date', () => {
  let result: string;
  try {
    result = JSON.stringify(fromIsoDate('1984-02-30'));
  } catch (error) {
    result = `throws ${String(error)}`;
  }
  save('probe-birthread', { fromIsoDate_1984_02_30: result });
});
```

### `scan-expect.mjs`

```js
// Gói B, trục T: lists `it(…)` blocks of packages/db tests whose body has no `expect` (rough: the
// body is the text up to the next `it(` / `describe(` at the same or a lower indent).
import { readdirSync, readFileSync } from 'node:fs';

const dir = 'C:/workspace/Project-2C-review/packages/db/src';
for (const file of readdirSync(dir).filter((f) => f.endsWith('.test.ts'))) {
  const lines = readFileSync(`${dir}/${file}`, 'utf8').split('\n');
  const starts = lines
    .map((line, i) => ({ i, m: /^(\s*)(it|test)(\.each\([^)]*\))?\(/.exec(line) }))
    .filter((x) => x.m);
  starts.forEach(({ i, m }, k) => {
    const end = k + 1 < starts.length ? starts[k + 1].i : lines.length;
    const body = lines.slice(i, end).join('\n');
    if (!/expect|codeOf|toThrow|rejects/.test(body)) console.log(`${file}:${i + 1} ${lines[i].trim().slice(0, 100)}`);
  });
}
```

### `vitest.mut.config.mts`

```ts
// Runs the db tests of the mutated copy of packages/db (see mutate.mjs) without touching the repo.
const here = 'C:/workspace/deep-review-1-4/claude/B';
const repo = 'C:/workspace/Project-2C-review';

export default {
  root: `${here}/mut/packages/db`,
  // Keep Vite / Vitest caches out of the repo's node_modules.
  cacheDir: `${here}/.vite-mut`,
  resolve: {
    alias: [{ find: /^@p2c\/domain$/, replacement: `${repo}/packages/domain/src/index.ts` }],
  },
  server: { fs: { allow: [repo, here] } },
  test: { include: ['src/**/*.test.ts'], testTimeout: 120_000 },
};
```

### `mutate.mjs`

```js
// Deep review Phase 1–4, gói B: "phá code" probe for packages/db. Copies packages/db of the review
// worktree into ./mut/db, applies ONE textual mutation, runs the test files that should catch it
// and, when they all pass, the whole db suite. Records killed / survived. The repo is never written.
// Usage: node mutate.mjs [name-prefix]   (node mutate.mjs BASELINE runs the copy unmutated)
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync, appendFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const REPO_DB = 'C:/workspace/Project-2C-review/packages/db';
const HERE = 'C:/workspace/deep-review-1-4/claude/B';
// Under mut/packages so the golden tests' relative ../../domain/src/golden imports resolve.
const MUT = `${HERE}/mut/packages/db`;
const VITEST = `${HERE}/node_modules/vitest/vitest.mjs`;

/** Test files (substrings of their paths) that a mutation of each prefix should fail. */
const TARGETS = {
  C: ['common.test', 'customers.test', 'policies.test', 'appointments.test'],
  CU: ['customers.test', 'appointments.test', 'kyc.test'],
  AP: ['appointments.test'],
  PO: ['policies.test'],
  TE: ['team.test'],
  KY: ['kyc.test', 'customers.test'],
  BV: ['backup.test', 'backup-invariants.test'],
  BK: ['backup.test', 'backup-invariants.test', 'backup-engine.test'],
  DB: ['database.test'],
  SE: ['seed.test', 'seed-invariants.test'],
  ID: ['ids.test'],
};

/** [name, file, from, to] — `from` must occur exactly once in the file. */
const MUTATIONS = [
  // common.ts
  ['C1 toPastIsoDate: future allowed', 'common.ts', "> 0) throw new DbError('DATE_IN_FUTURE')", "> 0 && false) throw new DbError('DATE_IN_FUTURE')"],
  ['C2 requireAmount: 0 allowed', 'common.ts', 'amount <= 0', 'amount < 0'],
  ['C3 requireRe: any role', 'common.ts', "if (row.role !== 'RE') throw new DbError('RE_REQUIRED');", ''],
  // customers.ts
  ['CU1 appendTransition: D10 check dropped', 'customers.ts', 'if (latest && compareDates(date, fromIsoDate(latest.date)) < 0) {', 'if (false) {'],
  ['CU2 withdraw: latest check dropped', 'customers.ts', 'if (latestTransition(db, caused.customerId)?.id !== caused.id) {', 'if (false) {'],
  ['CU3 withdraw: stage not reverted', 'customers.ts', 'updateCustomerRow(db, caused.customerId, { stage: caused.fromStage });', ''],
  ['CU4 lastSeq ignores withdrawn transitions', 'customers.ts', '.where(eq(stageTransitions.customerId, customerId))', '.where(and(eq(stageTransitions.customerId, customerId), isNull(stageTransitions.deletedAt)))'],
  ['CU5 restoreCustomer: RE not checked', 'customers.ts', 'requireRe(db, row.reId);\n    updateCustomerRow(db, id, { deletedAt: null });', 'updateCustomerRow(db, id, { deletedAt: null });'],
  ['CU6 createCustomer: future day allowed', 'customers.ts', 'toPastIsoDate(db, input.date);', 'toIsoDate(input.date);'],
  ['CU7 listStageTransitions: deleted customers kept', 'customers.ts', 'isNull(customers.deletedAt),\n', '\n'],
  ['CU8 updateCustomerProfile: no KYC facts', 'customers.ts', 'recordProfileFacts(db, id, row, profile, today(db));', ''],
  ['CU9 changeStageManually: future day allowed', 'customers.ts', 'toPastIsoDate(db, change.date);', 'toIsoDate(change.date);'],
  // appointments.ts
  ['AP1 requireOutcomeDay dropped', 'appointments.ts', 'if (held && compareDates(fromIsoDate(isoDate), today(db)) > 0) {', 'if (false) {'],
  ['AP2 NO_SHOW may be in the future', 'appointments.ts', "const held = status === 'MET' || status === 'NO_SHOW';", "const held = status === 'MET';"],
  ['AP3 keepsTransition ignores stage after', 'appointments.ts', "return row.status === 'MET' && outcome.status === 'MET' && row.stageAfter === outcome.stageAfter;", "return row.status === 'MET' && outcome.status === 'MET';"],
  ['AP4 updateAppointmentDetails: day not checked', 'appointments.ts', 'if (changes.date !== undefined) requireOutcomeDay(db, row.status, fields.date);', ''],
  ['AP5 editMeetingOutcome: kept stage not moved with the day', 'appointments.ts', '(!keepsStage || fields.date !== row.date) &&', '!keepsStage &&'],
  ['AP6 restoreAppointment: people not checked', 'appointments.ts', 'requirePeople(db, row.reId, toAppointment(db, row).coordinatorIds);', ''],
  ['AP7 restoreAppointment: reviewer not checked', 'appointments.ts', 'if (row.outcomeReviewerId !== null) requireReviewer(db, row.outcomeReviewerId);', ''],
  ['AP8 RE may coordinate own appointment', 'appointments.ts', "if (personId === reId) throw new DbError('INVALID_COORDINATOR');", ''],
  ['AP9 next appointment may be past', 'appointments.ts', 'if (compareDates(next.date, today(db)) < 0) {', 'if (false) {'],
  ['AP10 reschedule any status', 'appointments.ts', "if (old.status !== 'SCHEDULED') throw new DbError('APPOINTMENT_NOT_SCHEDULED');", ''],
  ['AP11 listAppointments: deleted customers kept', 'appointments.ts', 'isNull(customers.deletedAt),\n', '\n'],
  ['AP12 listAppointments: time not ordered', 'appointments.ts', '.orderBy(asc(appointments.date), asc(appointments.time), asc(appointments.id))', '.orderBy(asc(appointments.date), asc(appointments.id))'],
  ['AP13 softDelete: transition kept', 'appointments.ts', 'withdrawAppointmentTransition(db, id);\n    updateAppointmentRow(db, id, stampDeleted(db));', 'updateAppointmentRow(db, id, stampDeleted(db));'],
  ['AP14 time 24:xx allowed', 'appointments.ts', '2[0-3]', '2[0-4]'],
  ['AP15 stage after on non-met allowed', 'appointments.ts', "if (outcome.status !== 'MET' && stageAfter !== null) {", 'if (false) {'],
  ['AP16 reviewer on non-met allowed', 'appointments.ts', "if (outcome.status !== 'MET') throw new DbError('REVIEWER_NOT_ALLOWED');", ''],
  ['AP17 replaceCoordinators: no dedupe', 'appointments.ts', 'const coordinatorIds = [...new Set(ids)];', 'const coordinatorIds = [...ids];'],
  ['AP18 insertScheduled: coordinators unsorted', 'appointments.ts', 'return toAppointment(db, row, coordinatorIds.sort());', 'return toAppointment(db, row, coordinatorIds);'],
  ['AP19 outcome on rescheduled allowed', 'appointments.ts', "if (row.status === 'RESCHEDULED') throw new DbError('INVALID_STATUS');", ''],
  ['AP20 restore of a live appointment re-applies', 'appointments.ts', 'if (!row.deletedAt) return;', ''],
  ['AP21 updateDetails: moved transition not re-applied', 'appointments.ts', 'if (moved) applyOutcome(db, updated);', ''],
  ['AP22 recordMeetingOutcome: day not checked', 'appointments.ts', 'requireOutcomeDay(db, fields.status, row.date);', ''],
  // policies.ts
  ['PO1 issued before submitted allowed', 'policies.ts', 'if (issuedDate !== null && compareDates(issuedDate, policy.submittedDate) < 0) {', 'if (false) {'],
  ['PO2 re-issue takes submitted FYP', 'policies.ts', 'issuedFyp: issue.issuedFyp ?? current.issuedFyp ?? current.submittedFyp,', 'issuedFyp: issue.issuedFyp ?? current.submittedFyp,'],
  ['PO3 restorePolicy: RE not checked', 'policies.ts', 'liveCustomer(db, row.customerId);\n    requireRe(db, row.reId);', 'liveCustomer(db, row.customerId);'],
  ['PO4 listPolicies: deleted customers kept', 'policies.ts', '.where(and(isNull(policies.deletedAt), isNull(customers.deletedAt)))', '.where(isNull(policies.deletedAt))'],
  ['PO5 issue day may be future', 'policies.ts', 'issuedDate: issuedDate === null ? null : toPastIsoDate(db, issuedDate),', "issuedDate: issuedDate === null ? null : `${issuedDate.year}-${String(issuedDate.month).padStart(2, '0')}-${String(issuedDate.day).padStart(2, '0')}`,"],
  ['PO6 ISSUE_INCOMPLETE dropped', 'policies.ts', "if ((issuedDate === null) !== (issuedFyp === null)) throw new DbError('ISSUE_INCOMPLETE');", ''],
  // team.ts
  ['TE1 second TL allowed', 'team.ts', "if (input.role === 'TL') assertNoOtherLead(db, input.teamId, selfId);", ''],
  ['TE2 team with members deletable', 'team.ts', "if (member) throw new DbError('TEAM_HAS_MEMBERS');", ''],
  ['TE3 ownsLiveRecords ignores policies', 'team.ts', 'return [live(customers), live(appointments), live(policies)].some(Boolean);', 'return [live(customers), live(appointments)].some(Boolean);'],
  ['TE4 coordinator deletable', 'team.ts', 'return ownsLiveRecords(db, id) || coordinating !== undefined || reviewsLiveAppointment(db, id);', 'return ownsLiveRecords(db, id) || reviewsLiveAppointment(db, id);'],
  ['TE5 REVIEWER_IN_USE dropped', 'team.ts', "throw new DbError('REVIEWER_IN_USE');", ''],
  ['TE6 restoreTeam: name clash allowed', 'team.ts', 'assertTeamNameFree(db, row.name, id);\n    updateTeamRow(db, id, { deletedAt: null });', 'updateTeamRow(db, id, { deletedAt: null });'],
  ['TE7 TEAM_NOT_ALLOWED dropped', 'team.ts', "throw new DbError('TEAM_NOT_ALLOWED');", ''],
  ['TE8 RE with records may change role', 'team.ts', "if (current.role === 'RE' && role !== 'RE' && ownsLiveRecords(db, id)) {", 'if (false) {'],
  ['TE9 restorePerson: not validated', 'team.ts', 'validatePerson(db, toPerson(row), id);', ''],
  ['TE10 softDeletePerson: in-use not checked', 'team.ts', "if (isPersonInUse(db, id)) throw new DbError('PERSON_IN_USE');", ''],
  ['TE11 ownsLiveRecords counts deleted records', 'team.ts', '.where(and(eq(table.reId, id), isNull(table.deletedAt)))', '.where(eq(table.reId, id))'],
  // kyc.ts
  ['KY1 fact from SYSTEM note allowed', 'kyc.ts', "if (note.source === 'SYSTEM') throw new DbError('KYC_NOTE_FROM_PROFILE');", ''],
  ['KY2 RE may confirm birth year', 'kyc.ts', "if (PROFILE_FIELDS.has(input.field)) throw new DbError('KYC_FIELD_FROM_PROFILE');", ''],
  ['KY3 resolve: SYSTEM fact off profile allowed', 'kyc.ts', "(source !== 'SYSTEM' ||\n        chosen.value !== profileFactValue(chosen.field as 'birthYear' | 'gender', customer))", "source !== 'SYSTEM'"],
  ['KY4 normalize: no trim', 'kyc.ts', "const text = typeof value === 'string' ? value.trim() : null;", "const text = typeof value === 'string' ? value : null;"],
  ['KY5 manual material ignored', 'kyc.ts', 'date, manualMaterial);', 'date, false);'],
  ['KY6 birth date may be cleared', 'kyc.ts', "if (next.birthDate === null) throw new DbError('KYC_PROFILE_FIELD_REQUIRED');", ''],
  ['KY7 note without facts may record a version', 'kyc.ts', 'if (command.facts.length === 0) return { note, version: null };', ''],
  ['KY8 material on deleted customer', 'kyc.ts', 'liveCustomer(db, row.customerId);\n    db.orm.update(kycVersions)', 'db.orm.update(kycVersions)'],
  ['KY9 status changes not saved', 'kyc.ts', '} else if (status !== fact.status) {', '} else if (false) {'],
  ['KY10 gender label raw', 'kyc.ts', 'GENDER_LABELS[profile.gender]', 'profile.gender'],
  // backup-validation.ts
  ['BV1 rule 1: creation tied to a meeting', 'backup-validation.ts', 'first.appointment_id !== null ||', ''],
  ['BV2 rule 1: later from null', 'backup-validation.ts', 'later.some((t) => t.from_stage === null)', 'false'],
  ['BV3 rule 3: date order', 'backup-validation.ts', ' || (next.date as string) < (previous.date as string)', ''],
  ['BV4 rule 3: allowed move', 'backup-validation.ts', 'assertValidTransition(next.from_stage as CustomerStage, next.to_stage as CustomerStage);', ''],
  ['BV5 rule 2: stage', 'backup-validation.ts', 'if (live.at(-1)!.to_stage !== customer.stage) return 2;', ''],
  ['BV6 rule 4: once', 'backup-validation.ts', 'return once && matching ? null : 4;', 'return matching ? null : 4;'],
  ['BV7 rule 4: same day', 'backup-validation.ts', 'a.stage_after === t.to_stage &&\n      a.date === t.date', 'a.stage_after === t.to_stage'],
  ['BV8 rule 5: policies RE', 'backup-validation.ts', "['customers', 'appointments', 'policies']", "['customers', 'appointments']"],
  ['BV9 rule 5: RE coordinates', 'backup-validation.ts', "'SELECT 1 FROM appointment_coordinators c JOIN appointments a ON a.id = c.appointment_id WHERE c.person_id = a.re_id',", "'SELECT 1 WHERE 0',"],
  ['BV10 rule 5: rescheduled status', 'backup-validation.ts', "return from.customer_id === a.customer_id && from.status === 'RESCHEDULED';", 'return from.customer_id === a.customer_id;'],
  ['BV11 rule 6', 'backup-validation.ts', 'if (fact.note_customer_id !== fact.customer_id) return 6;', ''],
  ['BV12 rule 7: active + conflict', 'backup-validation.ts', '(active === 1 && conflict === 0) || (active === 0 && conflict >= 2)', '(active === 1) || (active === 0 && conflict >= 2)'],
  ['BV13 rule 8: SYSTEM other fields', 'backup-validation.ts', 'if (fromProfile && !profileField) return 8;', ''],
  ['BV14 rule 9: two TLs', 'backup-validation.ts', `"SELECT 1 FROM people WHERE role = 'TL' AND deleted_at IS NULL GROUP BY team_id HAVING COUNT(*) > 1",`, '"SELECT 1 WHERE 0",'],
  ['BV15 rule 10: NO_SHOW', 'backup-validation.ts', "status IN ('MET', 'NO_SHOW') AND date >", "status IN ('MET') AND date >"],
  ['BV16 values: time', 'backup-validation.ts', "if (column === 'time') return typeof value === 'string' && TIME.test(value);", ''],
  ['BV17 values: seq 0', 'backup-validation.ts', "return typeof value === 'number' && value >= 1;", "return typeof value === 'number' && value >= 0;"],
  ['BV18 values: case size 0', 'backup-validation.ts', "if (column === 'expected_case_size') return typeof value === 'number' && value > 0;", "if (column === 'expected_case_size') return typeof value === 'number' && value >= 0;"],
  ['BV19 values: KYC not normalised', 'backup-validation.ts', 'return normalizeKycValue(field as KycField, value as KycValue) === value;', 'normalizeKycValue(field as KycField, value as KycValue);\n    return true;'],
  ['BV20 rule 1: first deleted', 'backup-validation.ts', 'first.deleted_at !== null ||', ''],
  ['BV21 rule 1: closed creation', 'backup-validation.ts', '!OPEN_STAGES.includes(first.to_stage) ||', ''],
  ['BV22 rule 9: IS in team', 'backup-validation.ts', `"SELECT 1 FROM people WHERE role NOT IN ('RE', 'TL') AND team_id IS NOT NULL",`, '"SELECT 1 WHERE 0",'],
  ['BV23 rule 9: deleted team', 'backup-validation.ts', "'SELECT 1 FROM people p JOIN teams t ON t.id = p.team_id WHERE p.deleted_at IS NULL AND t.deleted_at IS NOT NULL',", "'SELECT 1 WHERE 0',"],
  ['BV24 rule 5: reviewer role', 'backup-validation.ts', 'AND p.role NOT IN (', 'AND 0 AND p.role NOT IN ('],
  ['BV25 rule 8: value', 'backup-validation.ts', 'if (!fromProfile || fact.value_json !== expected) return 8;', 'if (!fromProfile) return 8;'],
  ['BV26 rule 8: SYSTEM conflict', 'backup-validation.ts', "if (profileField && (fact.status === 'active' || fromProfile)) {", "if (profileField && fact.status === 'active') {"],
  ['BV27 values: birth date', 'backup-validation.ts', "if (column === 'birth_date') return validYear(value) || validDate(value);", "if (column === 'birth_date') return true;"],
  ['BV28 values: timestamps', 'backup-validation.ts', 'if (TIMESTAMPS.has(column)) return timestamp.safeParse(value).success;', ''],
  ['BV29 rule 10: transitions', 'backup-validation.ts', '`SELECT 1 FROM stage_transitions WHERE deleted_at IS NULL AND date > ${after}`,', '`SELECT 1 WHERE 0`,'],
  ['BV30 rule 10: issued', 'backup-validation.ts', '(submitted_date > ${after} OR issued_date > ${after})', '(submitted_date > ${after})'],
  // backup.ts
  ['BK1 foreign_key_check dropped', 'backup.ts', "if (db.sqlite.exec('PRAGMA foreign_key_check').length > 0) throw invalid();", ''],
  ['BK2 integer: unsafe accepted', 'backup.ts', "if (column.type === 'integer' && Number.isSafeInteger(value)) return value as number;", "if (column.type === 'integer' && typeof value === 'number') return value as number;"],
  ['BK3 row keys not checked', 'backup.ts', '          throw invalid();\n        db.sqlite.run(', '          void 0;\n        db.sqlite.run('],
  ['BK4 size limit +1', 'backup.ts', 'if (text.length > MAX_BACKUP_BYTES) {', 'if (text.length > MAX_BACKUP_BYTES + 1) {'],
  ['BK5 export order by rowid desc', 'backup.ts', 'ORDER BY ${key}`', 'ORDER BY rowid DESC`'],
  ['BK6 assertSupported dropped', 'backup.ts', 'assertSupported(file.schemaVersion, migrations);', ''],
  ['BK7 table set not checked', 'backup.ts', 'if (!sameSet(Object.keys(tables), names)) throw invalid();', ''],
  ['BK8 exportedAt from system clock', 'backup.ts', 'exportedAt: db.now().toISOString(),', 'exportedAt: new Date().toISOString(),'],
  ['BK9 invariants not checked', 'backup.ts', 'validateBackupInvariants(staging);', ''],
  // database.ts
  ['DB1 persist on nested too', 'database.ts', 'if (!nested) persist?.(exportBytes());', 'persist?.(exportBytes());'],
  ['DB2 nested failure not rolled back', 'database.ts', "sqlite.exec(nested ? 'ROLLBACK TO nested; RELEASE nested' : 'ROLLBACK');", "sqlite.exec(nested ? 'RELEASE nested' : 'ROLLBACK');"],
  ['DB3 FK not re-enabled after export', 'database.ts', '    // sql.js reopens the database on export, which resets connection pragmas.\n    enableForeignKeys(sqlite);', ''],
  ['DB4 migrations re-run', 'database.ts', 'const pending = migrations.filter((m) => m.id > current);', 'const pending = migrations.filter((m) => m.id >= current);'],
  ['DB5 same version refused', 'database.ts', "if (version > supported) throw new DbError('SCHEMA_TOO_NEW', { version, supported });", "if (version >= supported) throw new DbError('SCHEMA_TOO_NEW', { version, supported });"],
  ['DB6 statements not freed before export', 'database.ts', 'statements.clear();\n    const bytes = sqlite.export();', 'const bytes = sqlite.export();'],
  ['DB7 FK never enabled', 'database.ts', 'enableForeignKeys(sqlite);\n  const statements = cacheStatements(sqlite);', 'const statements = cacheStatements(sqlite);'],
  ['DB8 cached statements really freed', 'database.ts', '      statement.free = () => {\n        statement.reset();\n        return true;\n      };\n', ''],
  ['DB9 withSources does not restore', 'database.ts', '        sources = previous;\n', '\n'],
  // seed.ts
  ['SE1 timestamps after the anchor', 'seed.ts', 'now: () => new Date((Math.min(today, anchor) + 0.5) * DAY_MS + tick++),', 'now: () => new Date((today + 0.5) * DAY_MS + tick++),'],
  ['SE2 meetings resolved on the anchor day', 'seed.ts', 'if (booked && day < anchor) resolve(slot.re, booked, day);', 'if (booked && day <= anchor) resolve(slot.re, booked, day);'],
  ['SE3 policies issued on the anchor day', 'seed.ts', 'if (issueDay < anchor) add(issues, issueDay, { id: policy.id, fyp });', 'if (issueDay <= anchor) add(issues, issueDay, { id: policy.id, fyp });'],
  // ids.ts
  ['ID1 ulid time reversed', 'ids.ts', 'timePart = CROCKFORD_BASE32.charAt(time % 32) + timePart;', 'timePart = timePart + CROCKFORD_BASE32.charAt(time % 32);'],
  ['ID2 base32 buffer not masked', 'ids.ts', '    buffer &= (1 << bits) - 1;\n', '\n'],
];

function prepareCopy() {
  rmSync(`${HERE}/mut`, { recursive: true, force: true });
  mkdirSync(MUT, { recursive: true });
  for (const part of ['src', 'migrations', 'package.json']) {
    cpSync(`${REPO_DB}/${part}`, `${MUT}/${part}`, { recursive: true });
  }
  symlinkSync(`${REPO_DB}/node_modules`, `${MUT}/node_modules`, 'junction');
  // Read-only link; rmSync unlinks junctions without following them (checked before use).
  symlinkSync('C:/workspace/Project-2C-review/packages/domain', `${HERE}/mut/packages/domain`, 'junction');
}

function run(filters) {
  const r = spawnSync(process.execPath, [VITEST, 'run', '--config', `${HERE}/vitest.mut.config.mts`, ...filters], {
    cwd: HERE,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  const out = `${r.stdout}${r.stderr}`;
  return { ok: r.status === 0, failed: /Tests\s+(\d+) failed/.exec(out)?.[1], out };
}

const filter = process.argv[2];
const results = [];
const list = filter === 'BASELINE' ? [['BASELINE', null, null, null]] : MUTATIONS;
for (const [name, file, from, to] of list) {
  if (filter && filter !== 'BASELINE' && !name.startsWith(filter)) continue;
  prepareCopy();
  if (file) {
    const path = `${MUT}/src/${file}`;
    const text = readFileSync(path, 'utf8');
    const count = text.split(from).length - 1;
    if (count !== 1) {
      results.push({ name, outcome: `NOT APPLIED (found ${count}×)` });
      console.log(`NOT APPLIED (${count}×)     ${name}`);
      continue;
    }
    writeFileSync(path, text.replace(from, to));
  }
  const prefix = name.match(/^[A-Z]+/)[0];
  const targeted = file ? run(TARGETS[prefix] ?? []) : run([]);
  let outcome;
  if (!targeted.ok) {
    outcome = `killed (${targeted.failed ?? '?'} failed, targeted)`;
    if (!targeted.failed) appendFileSync(`${HERE}/mutate-errors.log`, `== ${name}\n${targeted.out.slice(-3000)}\n`);
  } else if (!file) {
    outcome = 'BASELINE passes';
  } else {
    const full = run([]);
    outcome = full.ok ? 'SURVIVED (full suite)' : `killed (${full.failed ?? '?'} failed, full suite)`;
  }
  results.push({ name, outcome });
  console.log(`${outcome.padEnd(36)} ${name}`);
  writeFileSync(`${HERE}/mutate-results${filter ? `-${filter}` : ''}.json`, JSON.stringify(results, null, 2));
}
rmSync(`${HERE}/mut`, { recursive: true, force: true });
```

