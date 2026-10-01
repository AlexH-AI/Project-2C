# HANDOFF

> Cập nhật mỗi cuối phiên bằng `/handoff`. Phiên mới đọc file này đầu tiên (`/session-start`).

- **Cập nhật:** 2026-10-01 (cuối ngày) · máy `DESKTOP-KDURKJP` (Home PC) · phản hồi Owner sau kiểm exe (16 ý) + kế hoạch sửa đã duyệt đã vào `main` (PR #218, `main` `d6a45d0`); Issue #214–#217 đã tạo, **chưa bắt đầu task nào**
- **Nhánh:** `main` (sạch). Không có PR nào đang mở. Worktree review `Project-2C-review`, `Project-2C-review-2` trên Home PC: đưa về `origin/main` khi review
- **Phiên song song:** có thể có phiên khác trên cùng checkout — commit theo pathspec, không `git add -A`
- **Repo public** (27/09) · **ruleset `protect-main`** (28/09): bắt buộc PR, cấm force-push và xóa `main`; không bắt buộc status check, không auto-merge. Hook `pre-push` giữ nguyên
- **Model / effort:** Owner chọn từng phiên (ADR-0001 M1). Chỉ Claude Code viết code, không subagent, cổng G1–G8. **Codex chỉ review độc lập khi đóng phase** (ADR-0001 M2)
- **Phase:** 3 — Nghiệp vụ & màn hình: còn #72 (G7) và gói sửa theo phản hồi Owner 01/10 (#214–#217, rồi B1–B6) · Phase 1, 2 đã đóng

## Trạng thái

| Việc | Trạng thái |
|---|---|
| Big review Phase 1→3 (Claude + Codex Astra) | Xong 30/09. Báo cáo tổng hợp lưu ở `docs/reviews/2026-09-30-phase-1-3-tong-hop.md` (F-01…F-19, kế hoạch 3 đợt) |
| Đợt 1: #202 T-077, #203 T-078, #204 T-079, #210 T-080 | **Đã merge** 30/09 (PR #206, #208, #209, #211) |
| #72 T-053 đóng Phase 3 | PR #212, #213 đã merge (metrics, báo cáo, kiểm tay exe 30/09: 0 lỗi). **Hoãn G7** tới khi xong gói A + B phản hồi Owner 01/10, kiểm tay exe lại, 2 review độc lập |
| Phản hồi Owner 01/10 — gói A | #214 T-081, #215 T-082, #216 T-083 (`risk:low`, `ready-for-agent`) |
| Phản hồi Owner 01/10 — gói B | #217 T-084: mockup `phase-3-feedback.html` **G3 đã duyệt 01/10** (PR #220, chờ Owner merge). Issue: #222 T-085 B1, #223 T-086 B1b (1 TL / team), #224 T-087 B2 (`risk:med`, chờ #216), #225 T-088 B3 (chờ #224), #226 T-089 B4, #227 T-090 B5 (chờ #226), #228 T-091 B6 (`risk:med`, chờ #227) |
| Đợt 2 (đầu Phase 4) | Chưa tạo Issue — tạo khi mở Phase 4 (báo cáo §4) |

## Phản hồi Owner sau kiểm exe (01/10/2026)

Owner kiểm exe và gửi 16 ý (ảnh chụp trong hội thoại). Owner duyệt kế hoạch 01/10: **gói A + B làm trong Phase 3, trước G7**; có thể còn ý bổ sung; đóng Phase 3 sau khi kiểm tay exe lại + 2 review độc lập. Ý 9 sang Phase 4.

| Ý | Nội dung | Gói / Issue |
|---|---|---|
| 1 | Bộ chọn góc nhìn chữ to hơn: 12,5px → 14px, chỉ bộ chọn trên thanh đầu trang | A3 #216 |
| 2 | Khách hàng, góc nhìn Team: hàng chọn RE của team (mỗi hàng 5 RE, chỉ RE); bấm lọc theo RE, bấm lại → cả team; trình bày lại bố cục | B2 |
| 3 | Như ý 2 cho Lịch hẹn (lọc theo RE phụ trách, không tính phối hợp) | B3 |
| 4 | Danh sách chọn RE sắp theo team rồi tên (cả 4 chỗ dùng `reOptions`) | A2 #215 |
| 5, 10 | Bỏ bộ chọn góc nhìn ở màn không lọc theo nó: Team & nhân sự, Hồ sơ KH (và Cài đặt, Báo cáo, Tổng quan) | A3 #216 |
| 6 | Team: "Team Bình Minh · TL Lý Gia Trang · Sửa" (không số lịch hẹn); TL bỏ khỏi bảng; "Hỗ trợ dùng chung" → "Người hỗ trợ" | B1 |
| 7 | Bỏ chữ viết tắt 2 ký tự trước tên người | A1 #214 |
| 8 | "Tổng quan hôm nay" → "Tổng quan" | A1 #214 |
| 9 | Tổng quan chạy bằng dữ liệu thật: nút Lọc cạnh kỳ; 4 ô N4–N1 bốn màu; Toàn bộ / RE = 1 chart, Team = 3 chart (một team một chart), 4 nhóm cơ hội | **Phase 4** (G2 + G3) |
| 11 | Bỏ nhãn "material" trên dòng thời gian KYC (dữ liệu + hộp Ghi chú KYC giữ nguyên) | A1 #214 |
| 12 | Lịch tháng: số ngày ô đang chọn màu vàng gold | B4 |
| 13 | Danh sách lịch hẹn: cột Ngày tô theo hôm nay — đã qua vàng nhạt, hôm nay xanh lá nhạt, sắp tới xanh dương nhạt | B5 |
| 14 | Kỳ Tuần tô nổi dải 7 ngày trên lịch tháng | B4 |
| 15 | Kỳ Tháng giữ nguyên | — |
| 16 | Kỳ Năm: lưới 12 tháng, 4 cột = 4 quý; tương lai mờ, tháng hiện tại nổi; ô = số tháng + tổng lịch + thanh ngang 3 màu (đã gặp / dời-hủy-không đến / dự kiến) có số ở giữa | B6 |

Quyết định Owner (AskUserQuestion 01/10):
- Ý 9: đếm KH theo nhóm = **ảnh chụp cuối kỳ** (nhóm của KH tính tới ngày cuối kỳ; kỳ chưa hết → tới hôm nay). Góc nhìn Team trên Tổng quan: **ẩn ô chọn team**, luôn 3 chart. Mặc định Claude đề xuất (chốt ở mockup Phase 4): đổi kỳ / góc nhìn chỉ áp dụng khi bấm Lọc; 4 ô N4–N1 dùng màu `StageBadge` và là chú giải chart; bỏ chart mẫu "Lịch hẹn theo team".
- Ý 2–3: RE đang chọn **dùng chung** Khách hàng và Lịch hẹn; đổi team hoặc góc nhìn → tự bỏ chọn RE.
- Ý 16: bấm ô tháng → **mở kỳ Tháng đó**; khối "Trong ngày" **ẩn** ở kỳ Năm.
- G3 gói B (01/10, PR #220): B5 = **phương án A** (tô nền ô Ngày); ô hôm nay viền **xanh lá nhạt**; nút "Cả team" + số cạnh tên RE; **mỗi team tối đa 1 TL** (→ #223); giữ tổng lịch quý ở lưới năm.
- Kỳ Tùy chọn: **tô dải ngày như Tuần**. Kèm sửa lỗi Claude tìm thấy: tuần / khoảng vắt 2 tháng không xem được phần tháng sau (ngày tháng khác bị mờ, không bấm được) → ngày trong kỳ vẫn tô và bấm được, lịch chuyển sang tháng đó (B4).

Kế hoạch (thứ tự để ít rủi ro): A1 → A2 → A3 (không cần mockup) · song song mockup #217 → G3 → B1 → B2 (`risk:med`, bộ lọc team + RE dùng chung; sau A3 vì cùng thanh đầu trang) → B3 → B4 → B5 → B6 (`risk:med`; B4–B6 cùng `AppointmentsScreen.tsx` nên làm lần lượt, lưới năm tách file mới) → Owner kiểm tay exe → 2 review độc lập → G7.

`main` `abdff20` (30/09, Home PC): `pnpm verify` xanh — 757 test, coverage 99,49 / 98,4 / 100 / 99,78 (domain 100%, `db/src` 99,33 / 97,8), 0 vi phạm ranh giới; `pnpm e2e` 95/95 xanh (lần này không có test vượt 30 s); build exe trên `main` xanh (run `36732226056`, artifact `Project-2C-abdff201d0c347d0175436b6668d26e3ec667ccb`).

## Sổ ghi chú review (P-3)

Quy tắc (review đóng Phase 3, P-3): ghi chú review không chặn nằm ở đây, chia **OPEN** (còn phải làm), **RESOLVED** (đã sửa, ghi PR), **ACCEPTED** (Owner hoặc spec chấp nhận, không sửa). Khi đóng mỗi phase, kiểm lại từng dòng OPEN trên code và chuyển nhóm. Review sau đối chiếu sổ này trước khi ghi một phát hiện là MỚI. Đối chiếu lần này: `main` `abdff20`, 30/09. Mã T-d…T-i, S-1, S-2 là task Đợt 2/3 trong báo cáo tổng hợp §4.

### OPEN

Theo task đã có chỗ trong kế hoạch:
- **T-d (F-05):** e2e local chập chờn khi nhiều worker cùng seed (`chart.spec.ts:35` từng vượt 30 s); e2e local dùng lại server cũ ở cổng 4173 (`reuseExistingServer`); `trackConsoleErrors` còn lặp ở `chart.spec.ts` và `navigation.spec.ts`.
- **T-e (F-06, F-07):** `rfCount` / `inScope` O(A×T), `inScope` góc nhìn team quét `data.people` cho từng lịch (#155); chưa có hàm MTD trong `domain`.
- **T-f (F-14):** chưa có `MAX_YEAR` trong `period.ts`; `shift` kỳ ngày/tuần/tùy chọn sát 01/01/1900 ném `RangeError` trong `PeriodPicker`, kỳ tháng/năm lùi về 1899 (#146); `addDays` với `days` cực lớn trả `NaN` (chưa có đường gọi).
- **T-h (F-11, F-12, F-13, F-15, F-19):**
  - "hôm nay" = `fromLocalDate(db.now())` lặp 4 chỗ (`appointments.ts` ×2, `customers.ts` ×2) → helper `today(db)`; lệnh sửa nhóm tay / HĐ không chặn ngày tương lai.
  - Xóa ngày sinh / chọn "Chưa rõ" giới tính → lỗi chung.
  - `OutcomeDialog.tsx:~81`: "Lưu kết quả" khi chưa chọn trạng thái không báo gì (#169).
  - `·` / `→` viết cứng trong JSX (~15 chỗ, vd `CustomerDialogs.tsx:380`).
  - `getPolicy` quét mọi HĐ (`policies.ts:30`); `t()` dùng `name in params` (`i18n/index.ts:11`).
- **T-i (F-18):** formatter ECharts escape chuỗi từ DB — đã thành mục checklist, áp dụng ở task dashboard đầu tiên.
- **S-2 (Đợt 3):** ghi muộn trong khoảng chờ backup → thay DB (#96); hai `replace` chồng nhau đóng DB cũ hai lần (#192); chưa có test cho cửa sổ `opening` (#206).

Theo file, gộp vào lần chạm sau cùng file (hoặc T-h nếu còn chỗ):
- `app-data.ts:~179` (#206): `mine === current || mine === opening` tương đương `mine >= current` → bỏ được `opening` + `try/finally`.
- `shell/ErrorBoundary.tsx:~29` (#206): `resetKey={scope}` đổi mỗi khi `teams`/`people` tính lại → sửa câu doc comment cho đúng (hành vi vô hại).
- `storage.rs` (#196, #192): `explorer_arg` (`~377`) không có `#[cfg(any(windows, test))]` → build ngoài Windows báo `dead_code`; `open_lock_file` dùng `Some(32)` thay hằng `SHARING_VIOLATION`; ngoài Windows closure `map_err` thành identity.
- `packages/db/src/database.test.ts:47,98,100,353` ghi cứng phiên bản schema `5` → suy từ `LATEST_SCHEMA_VERSION` trước migration kế tiếp.
- `backup.ts` (#184): `valueOf` chỉ nhận cột `integer`/`text` (thêm cột `real` sẽ thành `BACKUP_INVALID`); `ORDER BY` dựa vào khóa chính → nên có test mọi bảng có PK. `database.ts`: hai khối `try/catch sqlite.close()` có thể gộp.
- `SettingsBackup.tsx` (#185): nhánh `SCHEMA_TOO_NEW` của hộp 10b chưa có test.
- `AppointmentsScreen.tsx:~271` (#179): truyền `caused={undefined}` → cho `caused` là prop tùy chọn. `:~371`: số ngày trong ô lịch dùng `String(day).padStart(2, '0')` thay hàm `domain` (#156). Ô ngoài tháng / ngoài khoảng là `aria-hidden` nên trình đọc màn hình không đọc số lịch ngày đó (#156).
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
- `app-icon.svg`, `public/favicon.svg` (#128): thiếu dòng trống cuối file; `favicon.svg` là bản sao `app-icon.svg` → đổi icon phải sửa cả hai.
- `DataTable` (Phase 1): chưa có test `sortable: false` và bảng rỗng; kiểm lại cột Giờ có `tabular-nums` (cột không phải `text` đã có).
- Domain (R3): API `nextKycVersion`; ngày nhanh đầu năm (gợi ý năm trước?).
- Token G3 (R4, Owner cân nhắc): viền ô nhập / mũi tên sắp xếp dưới 3:1.

### RESOLVED

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

### ACCEPTED

- **Owner quyết 30/09 (#171):** lịch Dời lịch không có nút xóa (chuỗi dời, cần quy tắc riêng G1/G2); ô **Giờ** ở hộp 6f giữ; câu "Xóa mềm, khôi phục được" ở 6g giữ — màn "Thùng rác" xếp Phase 6 (xem comment Owner trên #72).
- Hộp lỗi màn hình chỉ hiện `String(error)`, không stack (#206 vòng 1; React 19 tự `console.error` kèm stack).
- `storage.rs`: đường dẫn kết thúc bằng `\` sẽ thành `"…\"` — không xảy ra vì `folder()` luôn trả `…\exports|backups` (#196); `rename` trên Windows ghi đè đích, chỉ tránh nhờ claim (chương trình ngoài tạo trùng tên trong vài ms thì bị ghi đè) (#192).
- Lịch hẹn: chưa có cây Team → RE ở cột trái (góc nhìn dùng bộ chọn chung; "Trong ngày" đảm nhận team → RE); tóm tắt tháng / trigger / chuyển nhóm của mockup là chỉ số Phase 4 (#156/#158). Biến thể "không đổi nhóm KH" của hộp xóa hiện bảng 3 dòng cả cho lịch Hủy / Không đến (#179).
- Hai file ngoài danh sách của #68 (`domain/period.ts` `formatDayMonth`, `db/appointments.ts` `coordinatorsByAppointment`) — Owner ghi nhận (#155).
- Hành vi theo spec, lớp gọi phải tuân (#33, #36, #44, #62):
  - `suggestedQuestions` trả cho mọi hạng mục thiếu ở cả 4 trạng thái (UI quyết định hiện); trường mâu thuẫn xếp theo `KYC_FIELDS`.
  - "Mới nhất" theo thứ tự thao tác, không theo `confirmedDate`; lớp nhập liệu chuẩn hóa kiểu giá trị theo trường.
  - `isRfAppointment` dựa vào `StageTransition.appointmentId` → db/UI luôn tạo transition gắn `appointmentId` khi ghi "nhóm sau cuộc gặp".
  - `markKycConflict` đổi mọi lỗi của `markConflict` thành `KYC_NO_CONFLICT`; chuỗi "Cập nhật KYC dd/mm/yyyy" có ở cả `db/kyc.ts` và `domain/kyc.ts`; ghi chú `SYSTEM` là dữ liệu DB, UI không dịch lại; đổi ngày sinh cùng năm vẫn tạo ghi chú + dữ kiện thay thế, không tạo phiên bản.
- R1: `PERSON_IN_USE` đếm cả KH xóa mềm (câu báo ở T-046); năm > 9999 (gộp vào miền năm T-f).
- ADR-0003 còn nói `/resume` và branch protection — Owner để nguyên (ADR đã Accepted); `CLAUDE.md` và PLAN là bản đúng.

## Bước kế tiếp chính xác

1. `/session-start` (pull `main`).
2. **Phản hồi Owner 01/10** (mục trên): làm #214 T-081 → #215 T-082 → #216 T-083 (mỗi Issue một phiên, `risk:low`); gói B: G3 đã duyệt (PR #220) → làm #222, #223, #224 (sau #216), #225, #226, #227, #228 (mỗi Issue một phiên). Ý bổ sung mới của Owner: xếp vào gói A (đổi nhỏ) hoặc B (cần mockup).
3. **#72 T-053** (sau gói A + B) — #72 vẫn mở. Còn:
   - Owner kiểm tay exe bản sau gói A + B; cập nhật `phase-3.md` (số Issue, lỗi Owner phát hiện, kiểm tay).
   - **2 review độc lập** trên `main` (gồm deep review Phase 1→3 lần 2 ở phiên sạch). Phát hiện mới → đối chiếu sổ P-3 bên dưới trước khi ghi là MỚI; lỗi chặn → Issue trước khi đóng Phase 3.
   - Rồi **dừng hỏi Owner G7** (đóng milestone Phase 3). G7 sang ngày khác 30/09 → sửa ngày đóng milestone trong `phase-3.md` (dòng đầu và dòng "Ngày bắt đầu / kết thúc").
4. Sau G7: mở Phase 4 — tạo milestone + Issue Đợt 2 theo báo cáo §4 (T-d e2e local làm đầu tiên; G2 Phase 4 trước T-e/T-f và màn dashboard). Màn Tổng quan theo ý 9 phản hồi Owner 01/10 (mục trên).
5. Ngưỡng task (P1, P-2): ước lượng cỡ khi viết Issue gồm cả i18n + e2e; vượt ngưỡng thì tách từ đầu; PR liệt kê mọi file ngoài danh sách được phép.
6. Golden fixtures là test bắt buộc: **không sửa để "cho xanh"**, muốn đổi phải qua Owner (G2).
7. Merge (P-1): SHA head lúc merge phải trùng SHA trong `REVIEW: PASS`; head đổi → review lại.

## Lệnh chạy tiếp

```powershell
cd C:\workspace\Project-2C
git switch main; git pull
pnpm install --frozen-lockfile
pnpm verify
```

Rồi trong Claude Code: `/session-start`.

## Dựng môi trường trên Office Laptop

### Phương án A — đầy đủ (build được exe ở local)

```powershell
git --version        # nếu thiếu: winget install --id Git.Git -e
git clone https://github.com/AlexH-AI/Project-2C.git C:\workspace\Project-2C
cd C:\workspace\Project-2C
powershell -ExecutionPolicy Bypass -File tools\bootstrap.ps1
```

- Cài Node 24, pnpm, Rust 1.98.1, MSVC Build Tools (≈ 10–20 phút, có hộp UAC), gh, rồi `pnpm install`.
- Mở **terminal mới**, chạy `gh auth login`, rồi `powershell -File tools\bootstrap.ps1 -CheckOnly` → phải ra `Toolchain ready.`
- Mở Claude Code tại `C:\workspace\Project-2C`: đồng ý tin cậy thư mục và cài plugin `superpowers@superpowers-marketplace` khi được hỏi.
- Worktree review (ADR-0017 phụ lục), tạo một lần từ checkout chính: `git worktree add --detach ../Project-2C-review origin/main`, rồi `pnpm install --frozen-lockfile` **bên trong** `C:\workspace\Project-2C-review`. Phiên review mở tại `C:\workspace\Project-2C-review`.

### Phương án B — máy công ty không có quyền admin / chặn winget

Chỉ cần **Git + Node 24 + pnpm** (không cần Rust/Build Tools):

- Node 24 (đúng major trong `.nvmrc`, không lấy LTS mới nhất): bản cài không cần admin (zip từ nodejs.org, thêm vào PATH người dùng) hoặc, nếu được phép, `winget install --id OpenJS.NodeJS.LTS --exact --version 24.19.0 --scope user` (bản 24.x mới nhất: `winget show --id OpenJS.NodeJS.LTS --versions`). `tools/bootstrap.ps1` tự chọn bản này và chạy được bằng cả `powershell` 5.1 lẫn `pwsh` (T-061).
- pnpm: `corepack enable pnpm --install-directory "$env:APPDATA\npm"`.
- `pnpm install` → làm được mọi việc của #7/#8: `pnpm verify`, `pnpm dev:web`, `pnpm e2e` (dùng Microsoft Edge có sẵn).
- Exe: tải từ GitHub Actions (run mới nhất trên `main` → artifact `Project-2C-<sha>`). Mỗi push code lên `main` build exe (PR chỉ build khi có nhãn `build-exe`, ADR-0015 phụ lục).

### Phương án C — không cài được gì

Dùng **Claude Code trên web** (claude.ai/code) gắn repo `AlexH-AI/Project-2C`: code, test, PR chạy trên cloud; CI build exe; laptop chỉ cần trình duyệt. Không chạy được `.ps1`/hook local — việc chặn push thẳng lên `main` do ruleset `protect-main` trên GitHub đảm nhận.

## Chờ Owner

- PR #220 (#217 T-084): G3 đã duyệt 01/10 — Owner merge PR mockup (docs-only, không CI).
- #72 T-053: cổng **G7** đóng milestone Phase 3 — sau gói A + B, kiểm tay exe lại và 2 review độc lập.
- Merge PR `risk:med`/`high`: Owner merge sau review PASS.

## Ghi chú môi trường

- pnpm shim ở `%APPDATA%\npm` khi không có admin; trong Git Bash shim này lỗi — chạy pnpm từ PowerShell.
- Terminal mở trước khi chạy bootstrap chưa có PATH mới → mở terminal mới.
- Bộ nhớ Claude (memory) nằm riêng từng máy và **không** đồng bộ: điều gì cần nhớ giữa 2 máy phải ghi vào `CLAUDE.md` hoặc file này.
- Lần đầu mở Claude Code ở máy mới, lịch sử hội thoại của Home PC không có sẵn — phiên mới đọc `CLAUDE.md` + file này là đủ để tiếp tục.
- Đổi base PR xếp chồng (`gh pr edit --base main`) **không** tự chạy lại CI (workflow nghe `opened/synchronize/reopened`): `gh pr close <n>` + `gh pr reopen <n>` để CI chạy trên base mới rồi mới merge.
