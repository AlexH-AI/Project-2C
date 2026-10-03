# Sổ ghi chú review

> Tách khỏi `HANDOFF.md` ngày 03/10/2026 (#280). Phiên review đóng phase và skill `review-pr` đối chiếu sổ này trước khi ghi một phát hiện là MỚI. Ghi chú review không chặn của PR task ghi vào đây (OPEN), không ghi vào HANDOFF.

Quy tắc (review đóng Phase 3, P-3): ghi chú review không chặn nằm ở đây, chia **OPEN** (còn phải làm), **RESOLVED** (đã sửa, ghi PR), **ACCEPTED** (Owner hoặc spec chấp nhận, không sửa). Khi đóng mỗi phase, kiểm lại từng dòng OPEN trên code và chuyển nhóm. Review sau đối chiếu sổ này trước khi ghi một phát hiện là MỚI. Đối chiếu lần này: `main` `5eb7c03`, 02/10 (review lần 2). Mã T-d…T-i, S-1, S-2 là task Đợt 2/3 trong báo cáo tổng hợp 30/09 §4; T-j và R2-xx ở báo cáo 02/10 §4–§5.

## OPEN

Theo task đã có chỗ trong kế hoạch:
- **T-f (F-14):** chưa có `MAX_YEAR` trong `period.ts`; `shift` kỳ ngày/tuần/tùy chọn sát 01/01/1900 ném `RangeError` trong `PeriodPicker`, kỳ tháng/năm lùi về 1899 (#146); `addDays` với `days` cực lớn trả `NaN` (chưa có đường gọi).
- **T-h (F-11, F-12, F-13, F-15, F-19):**
  - "hôm nay" = `fromLocalDate(db.now())` lặp 4 chỗ (`appointments.ts` ×2, `customers.ts` ×2) → helper `today(db)`; lệnh sửa nhóm tay / HĐ không chặn ngày tương lai.
  - Xóa ngày sinh / chọn "Chưa rõ" giới tính → lỗi chung.
  - `OutcomeDialog.tsx:~81`: "Lưu kết quả" khi chưa chọn trạng thái không báo gì (#169).
  - `·` / `→` viết cứng trong JSX (~15 chỗ, vd `CustomerDialogs.tsx:380`).
  - `getPolicy` quét mọi HĐ (`policies.ts:30`); `t()` dùng `name in params` (`i18n/index.ts:11`).
  - R2-03: số đếm truyền vào `t()` không qua `formatCount` ("4528 lịch" cạnh "1.234 lịch" ở kỳ Năm): `AppointmentsScreen.tsx:123-126, 369`, `CustomersScreen.tsx:114`, `RePicker.tsx:39` (`rePicker.title`) và số trong `Chip` (`:83`) → `formatCount` (cân nhắc helper `tCount` / test grep).
  - R2-04: `·` / `→` viết cứng tăng thêm sau F-15 (`AppointmentsScreen.tsx:242, 245, 494`, `CustomersScreen.tsx:141, 144`) → thêm luật chặn trong `lint:tokens` hoặc test grep.
  - R2-05: cảnh báo ESLint `react-hooks/exhaustive-deps` ở `AppointmentsScreen.tsx:188-189` (#240) → dựng `today` trong memo như `:116-121`; cân nhắc `eslint --max-warnings 0`.
- **T-i (F-18):** formatter ECharts escape chuỗi từ DB — đã thành mục checklist, áp dụng ở task dashboard đầu tiên.
- **S-1 / D-1 (probe Codex Sol 02/10):** nhập backup nhận `kyc_versions.hash` sai → tính lại hoặc kiểm hash khi nhập snapshot.
- **S-2 (Đợt 3):** ghi muộn trong khoảng chờ backup → thay DB (#96); hai `replace` chồng nhau đóng DB cũ hai lần (#192); chưa có test cho cửa sổ `opening` (#206).

Theo file, gộp vào lần chạm sau cùng file (hoặc T-h nếu còn chỗ):
- `app-data.ts:~179` (#206): `mine === current || mine === opening` tương đương `mine >= current` → bỏ được `opening` + `try/finally`.
- `shell/ErrorBoundary.tsx:~29` (#206): `resetKey={scope}` đổi mỗi khi `teams`/`people` tính lại → sửa câu doc comment cho đúng (hành vi vô hại).
- `storage.rs` (#196, #192): `explorer_arg` (`~377`) không có `#[cfg(any(windows, test))]` → build ngoài Windows báo `dead_code`; `open_lock_file` dùng `Some(32)` thay hằng `SHARING_VIOLATION`; ngoài Windows closure `map_err` thành identity.
- `packages/db/src/database.test.ts:47,98,100,353` ghi cứng phiên bản schema `5` → suy từ `LATEST_SCHEMA_VERSION` trước migration kế tiếp.
- `backup.ts` (#184): `valueOf` chỉ nhận cột `integer`/`text` (thêm cột `real` sẽ thành `BACKUP_INVALID`); `ORDER BY` dựa vào khóa chính → nên có test mọi bảng có PK. `database.ts`: hai khối `try/catch sqlite.close()` có thể gộp.
- `SettingsBackup.tsx` (#185): nhánh `SCHEMA_TOO_NEW` của hộp 10b chưa có test.
- `AppointmentsScreen.tsx:~271` (#179): truyền `caused={undefined}` → cho `caused` là prop tùy chọn. Ô ngoài tháng / ngoài khoảng là `aria-hidden` nên trình đọc màn hình không đọc số lịch ngày đó (#156).
- Lịch hẹn (#162–#168):
  - `outcomeChoices` (`outcome-form.ts:21`) không chặn Đã gặp / Hủy / Không đến cho lịch `RESCHEDULED` (UI không mở hộp, db ném `INVALID_STATUS`).
  - Mùi *Duplicated Code*:
    - quy tắc "case size > 0" ở `OutcomeDialog.tsx` và `outcome-form.ts` → `readCaseSize`;
    - `setErrors(errors.filter(...))` lặp → helper `clear`;
    - khối `<p role="alert" …>` lặp → `FailureAlert`;
    - `RescheduleDialog.tsx` và `AppointmentsScreen.tsx` cùng tự ghép `formatDate` với giờ → một helper trong `appointments-view.ts`;
    - `weekdayOf` (`period.ts:102`) và `periodOf('week')` tính thứ bằng hai cách.
  - #165: lịch cùng ngày khi sắp tăng dần vẫn ra giờ muộn trước (`AppointmentsScreen.tsx`, `CustomerAppointments.tsx`) → sắp theo cả ngày lẫn giờ; mockup tô "RF" màu accent và đưa năm khác xuống dòng giờ, code viết chuỗi phẳng.
  - #163: nhóm trước → sau trong 6a hiện bằng chữ (mockup: badge); hộp 6h hiện thêm "Các lần hẹn trước"; e2e chưa kiểm link "Xem tất cả (n)" khi > 5 lịch.
- Team & nhân sự (#144): `role === 'RE' || role === 'TL'` lặp ở `PersonDialogs.tsx`; lọc theo `reId` lặp ở `staffMetrics` và `personUsage`; "Xóa nhân sự" trong hộp Sửa bỏ thay đổi chưa lưu mà không báo.
- Khách hàng (#141): dòng "Sau khi lưu: N2 → N3" thiếu "· hạ nhóm / lên nhóm" như mockup 5d; khối cảnh báo "Chuyển tay không bao giờ tính RF" hiện cả khi KH đã đóng; `error.INVALID_TRANSITION` chỉ nói "KH đã đóng" dù cũng bắn khi trùng nhóm hiện tại; `CustomerDialogs.tsx:~300` lặp `CLOSED_STAGES.includes` (dùng `!isPipelineStage`); `CustomerProfile.tsx:110` dựng `StageBadge` tay; 3 helper `badge` riêng (`MetFields.tsx:16`, `CustomerDialogs.tsx:42`, `CustomerKyc.tsx:155`) → *Duplicated Code*, T-h.
- `CloseGuard.tsx` (#125): bấm X lúc đang seed "Nạp lại" thì app đóng trước khi lưu bản mới (không mất dữ liệu); không có dấu hiệu "đang lưu" khi chờ `flush()`; phần nối React chưa có test tự động; chuỗi class `BUTTON` chép từ `Settings.tsx`.
- Cài đặt (#96, #87): sau một lần lưu lỗi, "Nạp lại" bị từ chối mà không có cách thử lưu lại; hộp 10c thiếu số lượng dữ liệu sắp thay; `backups\` không đọc được thì app coi như lần đầu. NIT (#87): file `.tmp` sót trong `backups\`/`exports\`, listener ném lỗi, dọn thư mục tạm của test Rust.
- `Overview.tsx:9` (R4): lấy "hôm nay" từ đồng hồ máy thay vì `useAppData().today()`. Ô ngày tùy chọn báo đỏ sớm khi Tab.
- Tooling (R4): `session-end.ps1:39` `git add -A` gom file phiên khác; hook `review-pr-hint.mjs` nhận "issue #N" gần chữ "review" thành PR.
- `.claude/skills/README.md` bảng "Sửa cục bộ" (#297): dòng T-116 ("Thêm mục 'Tài liệu cần đọc' vào issue template") đã bị dòng T-122 thay thế (template giờ chỉ trỏ sang `task.yml`). Áp lại tuần tự vẫn ra đúng kết quả nhưng đọc dễ nhầm → ghi "(thay bởi dòng T-122)" ở dòng T-116 hoặc gộp hai dòng.
- `app-icon.svg`, `public/favicon.svg` (#128): thiếu dòng trống cuối file; `favicon.svg` là bản sao `app-icon.svg` → đổi icon phải sửa cả hai.
- `DataTable` (Phase 1): chưa có test `sortable: false` và bảng rỗng; kiểm lại cột Giờ có `tabular-nums` (cột không phải `text` đã có). `cellClass` (#240) chỉ có e2e phủ — repo chưa có công cụ test component (thêm là G4).
- Lưới năm (#247, không chặn):
  - `token-guard.ts:26` regex miễn trừ nhận mọi `style={{ flex: <định danh hoặc số> }}`, kể cả hằng `flex: 1`; doc comment `token-guard.ts:3` dài (NIT);
  - `AppointmentsScreen.tsx:53` `FOCUS` xen giữa các import `type` (NIT);
  - *Duplicated Code*: `CARD` lặp ở `YearGrid.tsx:5` và `AppointmentsScreen.tsx` → export từ `appointments-view.ts` như `FOCUS`.
- `e2e/appointments.spec.ts` (#236, NIT): `new RegExp(`^${name}`)` không escape tên RE; tên seed hiện không có ký tự regex.
- `AppointmentsScreen.tsx` (#239, không chặn): nhánh `!pickable` vẫn có thể gắn `bg-period-band` về lý thuyết; `inPeriod` ⇒ `pickable` nên không xảy ra.
- Domain (R3): API `nextKycVersion`; ngày nhanh đầu năm (gợi ý năm trước?).
- Token G3 (R4, Owner cân nhắc): viền ô nhập / mũi tên sắp xếp dưới 3:1.

## RESOLVED

- T-e (F-06, F-07): `stats.ts` dựng index một lần cho mỗi danh sách đầu vào (`Map` người → team, `Set` lịch chuyển RF, `WeakMap`), chữ ký công khai giữ nguyên; `rfCount` lọc phạm vi trước kỳ. Seed: một kỳ toàn bộ 21,6 → 1,3 ms; 12 tháng × 30 RE 374 → 82 ms. `monthToDate` trong `period.ts`, G18 kiểm bằng hàm này (#255, T-099).
- T-j (R2-01, R2-02): nhập backup kiểm thêm luật 1 (transition đầu `appointment_id` null), luật 5 (RE **chưa xóa**), luật 8 (fact `SYSTEM` năm sinh / giới tính `conflict` khớp hồ sơ), luật 9 nhân sự (≤ 1 TL chưa xóa / team; IS/BD/BDM không team; người chưa xóa → team chưa xóa). Lệnh: `TEAM_NOT_ALLOWED` cho IS/BD/BDM có team; `withdrawAppointmentTransition` → `INVALID_TRANSITION` thay lỗi SQLite thô; `resolveKycConflict` so giá trị `SYSTEM` với hồ sơ. Thay ghi chú #231 (IS/BD/BDM có team, TL thứ hai). DB dev có dữ liệu sai: nạp lại dữ liệu giả lập (#252, T-096).
- T-d (F-05, R2-06): e2e local giới hạn worker (≤ 4), không dùng lại server cũ ở cổng 4173 (chỉ khi `PW_REUSE=1`), server preview chạy một tiến trình (`e2e/serve.mjs`) nên dừng sạch, `trackConsoleErrors` một chỗ (`e2e/support.ts`), ngưỡng `SLOW` của `seed.test.ts` nâng 60 s → 180 s (#251, T-095).
- Ghi chú #244: `now` gọi `new Date()` hai lần (có thể lệch qua nửa đêm) và không đi qua `clock` → đọc một lần qua `clock` (#245, PR #246).
- `useScope()` chết sau B3 → bỏ (#237, PR #238). Số ngày ô lịch `padStart` → `formatDayOfMonth` / `formatDayMonth` của `domain` (#239).
- `formatCount` tách khỏi `money.ts` → `domain/number.ts`; `": "` cứng ở `SettingsBackup.tsx` → i18n (#185).
- So chuỗi `'RELOAD_UNSAVED_CHANGES'` lặp → `isUnsavedChangesError` (`app-data.ts`).
- Danh sách cột `columns.map(quote).join` lặp ở `backup.ts` → `columnList`.
- `CloseGuard.tsx` cờ `closing` không reset khi `destroy()` lỗi → có `finally` (#125).
- "NẠP LẠI" so `===` không `normalize('NFC')` → `Settings.tsx:81` chuẩn hóa (R4).
- `useDatabase()` chưa có nơi gọi → `CustomerDialogs.tsx` dùng (#96); i18n chèn tham số bằng `.replace` → `t(key, params)` (#96).
- Comment `tauri-storage.ts` "empty only when the file does not exist" → đã sửa đúng (#87). Hai lần xuất trùng tên ghi chung `name.tmp` → claim + hậu tố `-2` (#185, #187–#192).
- Hộp "Nhân sự mới" chọn IS/BD/BDM vẫn giữ team → tự bỏ team (`PersonDialogs.tsx:~95`, e2e `team.spec.ts:159`) (#144).
- R1/R2: sửa kết quả cuộc gặp từng phần (D7) → #166/#170; DB mới hơn app mở im lặng → `SCHEMA_TOO_NEW` (#184).
- Phép tính ngày tự viết ở màn Team → `addDays` (#146); tiêu đề năm cứng trong e2e (#144).
- F-01…F-04 (big review) → #202–#204, #210. Nhãn kỳ, `parseVnd`, bootstrap PS 5.1, CI main (R3/R4) → #105–#110.
- 4 chỗ lệch mockup 5a–5c (#140) → #142. Link "+ Ghi chú KYC từ cuộc gặp này" (6c) → #180. Nút xóa lịch Dự kiến → #173.

## ACCEPTED

- **Owner quyết 30/09 (#171):** lịch Dời lịch không có nút xóa (chuỗi dời, cần quy tắc riêng G1/G2); ô **Giờ** ở hộp 6f giữ; câu "Xóa mềm, khôi phục được" ở 6g giữ — màn "Thùng rác" xếp Phase 6 (xem comment Owner trên #72).
- Hộp lỗi màn hình chỉ hiện `String(error)`, không stack (#206 vòng 1; React 19 tự `console.error` kèm stack).
- `storage.rs`: đường dẫn kết thúc bằng `\` sẽ thành `"…\"` — không xảy ra vì `folder()` luôn trả `…\exports|backups` (#196); `rename` trên Windows ghi đè đích, chỉ tránh nhờ claim (chương trình ngoài tạo trùng tên trong vài ms thì bị ghi đè) (#192).
- Lịch hẹn: chưa có cây Team → RE ở cột trái (góc nhìn dùng bộ chọn chung; "Trong ngày" đảm nhận team → RE); tóm tắt tháng / trigger / chuyển nhóm của mockup là chỉ số Phase 4 (#156/#158). Biến thể "không đổi nhóm KH" của hộp xóa hiện bảng 3 dòng cả cho lịch Hủy / Không đến (#179).
- #227 (PR #240): test unit tùy chọn "`DataTable` gắn class của cột vào ô" thay bằng e2e (`appointments.spec.ts:189`) — mâu thuẫn spec với hạ tầng test, review chấp nhận.
- Hai file ngoài danh sách của #68 (`domain/period.ts` `formatDayMonth`, `db/appointments.ts` `coordinatorsByAppointment`) — Owner ghi nhận (#155).
- Hành vi theo spec, lớp gọi phải tuân (#33, #36, #44, #62):
  - `suggestedQuestions` trả cho mọi hạng mục thiếu ở cả 4 trạng thái (UI quyết định hiện); trường mâu thuẫn xếp theo `KYC_FIELDS`.
  - "Mới nhất" theo thứ tự thao tác, không theo `confirmedDate`; lớp nhập liệu chuẩn hóa kiểu giá trị theo trường.
  - `isRfAppointment` dựa vào `StageTransition.appointmentId` → db/UI luôn tạo transition gắn `appointmentId` khi ghi "nhóm sau cuộc gặp".
  - `markKycConflict` đổi mọi lỗi của `markConflict` thành `KYC_NO_CONFLICT`; chuỗi "Cập nhật KYC dd/mm/yyyy" có ở cả `db/kyc.ts` và `domain/kyc.ts`; ghi chú `SYSTEM` là dữ liệu DB, UI không dịch lại; đổi ngày sinh cùng năm vẫn tạo ghi chú + dữ kiện thay thế, không tạo phiên bản.
- R1: `PERSON_IN_USE` đếm cả KH xóa mềm (câu báo ở T-046); năm > 9999 (gộp vào miền năm T-f).
- ADR-0003 còn nói `/resume` và branch protection — Owner để nguyên (ADR đã Accepted); `CLAUDE.md` và PLAN là bản đúng.
