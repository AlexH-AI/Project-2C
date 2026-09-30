# HANDOFF

> Cập nhật mỗi cuối phiên bằng `/handoff`. Phiên mới đọc file này đầu tiên (`/session-start`).

- **Cập nhật:** 2026-09-30 17:50 · máy `D13_THINKPAD` · sau khi merge #199 (T-075), #201 (T-076, `a36f94d`, docs-only) và **xong big review Phase 1→3** (Claude + Codex Astra) → 3 Issue Đợt 1 (#202–#204). Không có task code dở
- **Nhánh:** `wip/…` do `session-end.ps1` tạo từ `main` `a36f94d` (chỉ file này). Không có PR code nào đang mở. Checkout chính sạch; worktree review `Project-2C-review` và `Project-2C-review-2` đều ở `a36f94d`
- **Phiên song song:** trong phiên 30/09 có một phiên khác chạy dev server `web` (cổng 1420) trên cùng checkout — nếu vẫn còn: commit theo pathspec, không `git add -A`
- **Máy kế tiếp:** Home PC hoặc Office Laptop — cả hai đã có môi trường + worktree review
- **Repo đã chuyển public** (27/09, Owner tự làm) vì Actions private chạm ~1.800/2.000 phút; Actions giờ miễn phí
- **Ruleset `protect-main`** (28/09, Owner duyệt): bắt buộc PR, cấm force-push và xóa `main`; không bắt buộc status check, không auto-merge. Hook `pre-push` giữ nguyên
- **Model / effort** (ADR-0001 phụ lục M1, Owner quyết 29/09, PR #160): Owner tự chọn model và effort cho từng phiên trong app; repo không ghim nữa (trước đó: Opus 5.5, effort medium). Vẫn giữ: chỉ Claude Code viết code, không subagent, cổng G1–G8. **Codex chỉ review độc lập khi đóng phase** từ 30/09 (ADR-0001 phụ lục M2, #198); lần đầu áp dụng: big review Phase 1→3 ngày 30/09 (mục "Big review Phase 1→3" dưới)
- **Phase:** 3 — Nghiệp vụ & màn hình (milestone mở 26/09/2026; G2/G1/G4 đã duyệt) · Phase 2 đã đóng · **Phase 1 đã đóng** (G7, Owner duyệt 28/09/2026; 18/18 Issue)

## Trạng thái

| Việc | Trạng thái |
|---|---|
| #198 T-075 Codex chỉ review độc lập khi đóng phase (ADR-0001 phụ lục M2) | **Đã merge** 30/09 (PR #199, Owner duyệt G1 trong chat). Owner sửa bản nháp: bỏ "Codex được viết code" — Claude viết 100% code |
| #200 T-076 Bỏ ghi so sánh cho quy tắc Codex | **Đã merge** 30/09 (PR #201). `COMPARISON.md` trả về như trước #199; Owner quyết không cần ghi so sánh / đồng bộ Project-2 |
| Big review Phase 1→3 (Claude + Codex Astra) | **Xong** 30/09. Verdict: **chưa đóng G7** — làm Đợt 1 trước |
| #202 T-077 Thay DB không làm DB cũ ngừng lưu + ErrorBoundary (F-02, F-03) | Mở, `risk:high` — **việc kế tiếp** |
| #203 T-078 Nhập backup kiểm giá trị từng ô + giới hạn 100 MB (F-01 phần 1, F-04) | Mở, `risk:high` |
| #204 T-079 Nhập backup kiểm bất biến liên bảng (F-01 phần 2) | Mở, `risk:high`, bị chặn bởi #203 (nhánh xếp chồng trên #203) |
| #72 T-053 đóng Phase 3 | Mở, cổng G7 — sau #202–#204; thêm việc từ review (xem dưới) |

## Big review Phase 1→3 (30/09, xong)

Hai review độc lập ở SHA `0fa0eea` (code giống hệt `main` `a36f94d`): Claude (phiên sạch, được chạy test) và Codex Astra (Owner chạy, chỉ đọc). Đã hợp nhất thành 19 phát hiện F-01…F-19 + kế hoạch 3 đợt. Owner quyết: ngưỡng nhập backup **100 MB**.

- **Báo cáo chỉ nằm trên máy `D13_THINKPAD`** (ngoài repo) cho tới khi #72 lưu vào `docs/reviews/`:
  - Tổng hợp (nguồn chính): `C:\workspace\review-reports\2026-09-30-bao-cao-tong-hop-phase-1-3.md`
  - Claude: `C:\workspace\review-reports\2026-09-30-claude-phase-1-3-review.md` (+ `notes.md`, `tmp\*.repro.ts` tái hiện lỗi)
  - Astra: `C:\workspace\astra-reports\2026-09-30-project-2c-phase-1-3-review.md`; so sánh: `review-reports\2026-09-30-so-sanh-claude-astra.md`
  - Cấu hình Codex đã dùng: `astra-reports\codex-setup\`. Clone `Project-2C-astra` đã xóa nội dung (thư mục rỗng).
- Body của #202–#204 đã chép đủ bối cảnh + test chấp nhận → làm được trên máy khác mà không cần báo cáo.
- **Đợt 1 (trước G7):** #202 → #203 → #204 → #72.
- **#72 thêm từ review** (tổng hợp §4): F-10 tài liệu/mockup lệch thực tế (đối chiếu với `main` mới nhất); quy trình P-1 (skill `review-pr`: PASS ghi SHA head, head đổi → review lại, phiên review không commit), P-2 (ước lượng cỡ Issue gồm i18n + e2e, vượt ngưỡng thì tách từ đầu), P-3 (ghi chú review chia OPEN / RESOLVED / ACCEPTED); F-18 thêm checklist escape formatter ECharts; lưu báo cáo tổng hợp vào `docs/reviews/`; Owner kiểm tay exe build **sau** #202–#204, ghi SHA + kết quả vào #72.
- **Đợt 2 (đầu Phase 4, tạo Issue khi bắt đầu Phase 4):** T-d e2e local ổn định (F-05, làm đầu tiên) · G2 Phase 4 (đếm lịch dự kiến/đã gặp + chuỗi dời, miền năm, mockup Tổng quan theo ADR-0007) · T-e index chỉ số + MTD (F-06, F-07) · T-f miền năm (F-14) · T-g CI: coverage riêng domain/db + ghim SHA Actions (F-08, F-09) · T-h dọn UI/i18n/lệnh DB (F-11, F-12, F-13, F-15, F-19) · T-i task dashboard đầu tiên: escape formatter (F-18).
- **Đợt 3:** D-1 quyết định G4/G6 gọi mạng + lưu key trước `packages/ai` (Phase 5) · S-1 snapshot mỗi bảng một file dùng lại validator #203/#204 · S-2 tuần tự hóa replace/save/export/sync (#96/#192).

Ghi chú review #196 (T-074, không chặn, gộp vào lần chạm sau `storage.rs`):
- `explorer_arg` (`storage.rs:~377`) biên dịch mọi nền tảng nhưng chỉ `#[cfg(windows)]` gọi → build ngoài Windows báo `dead_code` (clippy `-D warnings` fail). CI chỉ build Windows. Gợi ý `#[cfg(any(windows, test))]`.
- Đường dẫn kết thúc bằng `\` sẽ thành `"…\"` (argv đọc `\"` là ngoặc kép escape). Hiện không xảy ra: `folder()` luôn trả `…\Project2C-data\exports|backups`.

Ghi chú review #183–#192 (T-069, T-052, T-071–T-073; không chặn, gộp vào lần chạm sau cùng file):
- `packages/db/src/database.test.ts:47,98,100,353` ghi cứng phiên bản schema `5` → suy từ `LATEST_SCHEMA_VERSION` trước migration kế tiếp.
- `backup.ts`: danh sách cột `columns.map(quote).join` lặp 2 chỗ; `valueOf` chỉ nhận cột `integer`/`text` (thêm cột `real` sẽ thành `BACKUP_INVALID`); `ORDER BY` dựa vào khóa chính → nên có test mọi bảng có PK. `database.ts`: hai khối `try/catch sqlite.close()` có thể gộp.
- `SettingsBackup.tsx`: nhánh `SCHEMA_TOO_NEW` của hộp 10b chưa có test; `": "` giữa nhãn và đường dẫn viết cứng trong JSX (~dòng 112, nên vào i18n); so chuỗi `'RELOAD_UNSAVED_CHANGES'` lặp với `Settings.tsx` → hằng / `isUnsavedChangesError`. `formatCount` nằm trong `money.ts` (nên tách module số).
- `app-data.ts`: hai `replace` chồng nhau (nạp lại + nhập) → DB cũ đóng hai lần, DB giữa không đóng (UI khóa nút nên gần như không xảy ra).
- `storage.rs`: trên Windows `rename` ghi đè đích — không ghi đè chỉ nhờ claim (chương trình ngoài tạo trùng tên trong vài ms thì bị ghi đè; chấp nhận). `open_lock_file` dùng `Some(32)` thay hằng `SHARING_VIOLATION`; ngoài Windows closure `map_err` thành identity (clippy `map_identity` nếu có lúc chạy clippy ngoài Windows).

Ghi chú review #179 (không chặn, NIT): `AppointmentsScreen.tsx:~271` truyền `caused={undefined}` cho `DeleteAppointmentDialog` → có thể cho `caused` là prop tùy chọn. Biến thể "không đổi nhóm KH" của hộp xóa giờ hiện bảng 3 dòng cả cho lịch Hủy / Không đến (đã ghi trong PR).

Ghi chú review #168–#171 (T-050, không chặn; #69 đã đóng):
- **Lệch mockup #171 — Owner đã quyết 30/09/2026:** (1) nút xóa lịch Dự kiến → làm ở #173 (PR #179); lịch Dời lịch vẫn không có nút xóa (chuỗi dời, cần quy tắc riêng G1/G2). (2) Ô **Giờ** ở hộp 6f **giữ**, coi mockup là thiếu. (3) Câu "Xóa mềm, khôi phục được" ở 6g **giữ**; UI khôi phục ("Thùng rác") ngoài Phase 3 (spec §10).
- **Link "+ Ghi chú KYC từ cuộc gặp này" (6c, #169):** Owner quyết 30/09 tách task riêng → **#180 T-069**.
- **#169 UX:** lịch chưa tới ngày có trạng thái mặc định `null`; bấm "Lưu kết quả" khi chưa chọn trạng thái thì không báo gì (`OutcomeDialog.tsx:~91`). Nên hiện lỗi "Chọn trạng thái".
- **#168:** `outcomeChoices` không chặn Đã gặp / Hủy / Không đến cho lịch `RESCHEDULED` (UI hiện không mở hộp kết quả cho lịch đã dời, db ném `INVALID_STATUS`).
- Mùi *Duplicated Code*: quy tắc "case size > 0" ở `OutcomeDialog.tsx` (khi gõ) và `outcome-form.ts` (khi lưu) → gợi ý `readCaseSize`; `setErrors(errors.filter(...))` lặp trong `OutcomeDialog.tsx` → helper `clear`; khối `<p role="alert" …>` lặp ở `EditOutcomeDialog.tsx` và các hộp khác → component `FailureAlert`.
- Còn từ #166: "hôm nay" tính bằng `fromLocalDate(db.now())` lặp 3 chỗ (`appointments.ts` ×2, `customers.ts`) → helper `today(db)`.

Ghi chú review #162–#165 (không chặn):
- **#165:** mockup tô "RF" bằng màu accent và đưa dòng năm khác xuống dòng giờ, còn `CustomerAppointments.tsx:84` viết thành chuỗi phẳng. Khi sắp tăng dần theo ngày, các lịch cùng ngày vẫn ra giờ muộn trước (`AppointmentsScreen.tsx:83`, `CustomerAppointments.tsx:67`). Sửa triệt để: cột ngày sắp theo cả ngày lẫn giờ.
- **#164:** `RescheduleDialog.tsx:12` và `AppointmentsScreen.tsx:426` cùng tự ghép `formatDate` với giờ; nên gộp thành một helper trong `appointments-view.ts`. Lối vào 6e đã được Owner chốt, xem quyết định #69.
- **#163:**
  - Nhóm trước → sau trong 6a đang hiện bằng chữ, mockup dùng badge.
  - Hộp 6h cũng hiện "Các lần hẹn trước" dù mockup không có.
  - e2e chưa kiểm link "Xem tất cả (n)" khi có trên 5 lịch.
- **#162:** mùi *Duplicated Code*: `weekdayOf` (`period.ts:87`) và `periodOf('week')` tính thứ trong tuần bằng hai cách khác nhau.

Ghi chú review #156/#158 (không chặn; mục kỳ Ngày/Tuần đã xử lý ở #158). NIT: ô không bấm được (ngoài tháng / ngoài khoảng tùy chọn) là `aria-hidden` nên trình đọc màn hình không đọc số lịch của ngày đó (danh sách vẫn đọc được); số ngày trong ô dùng `String(day).padStart(2, '0')` (`AppointmentsScreen.tsx:~270`) thay vì hàm `domain`. Chưa có cây Team → RE ở cột trái như mockup (góc nhìn dùng bộ chọn chung; "Trong ngày" đảm nhận team → RE); tóm tắt tháng / trigger / chuyển nhóm của mockup là chỉ số Phase 4.

Ghi chú review #155 (không chặn): hai file ngoài danh sách được phép của #68 đã được Owner ghi nhận (`domain/period.ts` `formatDayMonth`, `db/appointments.ts` `coordinatorsByAppointment`). NIT: `inScope` góc nhìn team vẫn quét `data.people` cho từng lịch (`appointments-view.ts:~104`). **Hiệu năng:** e2e `chart.spec.ts:35` (mở màn Lịch hẹn 10 lần) từng vượt 30 s trước khi bỏ N+1; sau sửa ~15 s trên CI — phần B/C thêm gì vào màn này thì kiểm lại thời gian test đó trong log CI.

Ghi chú review #146 (không chặn): `shift(value, -1)` với kỳ ngày/tuần/tùy chọn sát 01/01/1900 giờ ném `RangeError` trong `onClick` của `PeriodPicker.tsx` (kỳ giữ nguyên, không vỡ màn), còn kỳ tháng/năm vẫn lùi về 1899 → nếu muốn nhất quán: disable nút ‹ khi kỳ trước < `MIN_YEAR` (task riêng, không gấp; liên quan R3 "`shift` vượt `MIN_YEAR`"); `addDays` với `days` nguyên cực lớn (vd `1e12`) trả `{NaN…}` không bị chặn, chưa có đường gọi nào tới.

Ghi chú review #144 (không chặn): hộp "Nhân sự mới" (`PersonDialogs.tsx:82`) mặc định chọn team đang xem → chọn IS/BD/BDM mà không tự xóa team thì người đó vào team thay vì "Hỗ trợ dùng chung" (mockup 9a / `person.help` ghi "IS, BD, BDM để trống"); gợi ý xóa `teamId` khi đổi sang IS/BD/BDM ở hộp tạo mới. Mùi: `role === 'RE' || role === 'TL'` lặp ở `PersonDialogs.tsx:146/152`; lọc theo `reId` lặp ở `staffMetrics` và `personUsage`. NIT: "Xóa nhân sự" trong hộp Sửa bỏ thay đổi chưa lưu mà không báo. (Phép tính ngày tự viết đã sửa ở #146; tiêu đề năm cứng trong e2e đã sửa trước merge.)

Ghi chú review #141 (không chặn): dòng "Sau khi lưu: N2 → N3" thiếu "· hạ nhóm / lên nhóm" như mockup 5d (gợi ý `compareStages` khi cả hai là nhóm mở); khối cảnh báo "Chuyển tay không bao giờ tính RF" hiện cả khi KH đã đóng (mockup 5e không có); ký tự `→` viết thẳng trong JSX (`CustomerProfile.tsx`, `CustomerDialogs.tsx`); câu `error.INVALID_TRANSITION` chỉ nói "KH đã đóng" dù lỗi cũng bắn khi trùng nhóm hiện tại; `CustomerDialogs.tsx` lặp `CLOSED_STAGES.includes` (dùng `!isPipelineStage`), `CustomerProfile.tsx` dựng `StageBadge` tay thay vì helper `badge()`. Có thể gộp vào #142 vì cùng file.

Ghi chú review #140: 4 chỗ lệch mockup 5a–5c đã thành Issue #142.

Ghi chú review #128 (không chặn, NIT): `app-icon.svg` và `public/favicon.svg` thiếu dòng trống cuối file (trái `.editorconfig`); `favicon.svg` là bản sao y hệt `app-icon.svg` → đổi icon phải sửa cả hai file.

Ghi chú review #125 (không chặn, **cho #65 và các màn ghi DB**): cờ `closing` trong `CloseGuard.tsx` không reset nếu `destroy()` lỗi (gợi ý `try/finally`); bấm X lúc đang seed "Nạp lại" thì app đóng trước khi lưu bản mới (không mất dữ liệu, chỉ mất lần nạp lại); không có dấu hiệu "đang lưu" khi chờ `flush()`; phần nối React của `CloseGuard` chưa có test tự động; chuỗi class `BUTTON` chép từ `Settings.tsx` (gộp khi có nút trong `packages/ui`).

Review R1–R4 (#99, #101, #103, #108) đã đóng hết; kết quả đầy đủ trong body các Issue đó (GitHub là nguồn sự thật) — đọc lại trước khi làm T-046/T-047/T-050/T-052. Tóm tắt không chặn: R1 — D7 sửa từng phần (#69), `PERSON_IN_USE` đếm cả KH xóa mềm (câu báo ở T-046), DB mới hơn app mở im lặng (R2/T-052), năm > 9999; R3 — thiếu hàm MTD trong `domain` (trước Phase 4), `calendarDate` thiếu `MAX_YEAR`, `shift` vượt `MIN_YEAR`, API `nextKycVersion`, ngày nhanh đầu năm (gợi ý năm trước?), hiệu năng `rfCount` O(A×T); R4 — `session-end.ps1` `git add -A` gom file phiên khác, viền ô nhập / mũi tên sắp xếp dưới 3:1 (token G3, Owner cân nhắc khi dựng #65–#70), `Overview` lấy "hôm nay" từ đồng hồ máy thay vì `useAppData().today()`, ô ngày tùy chọn báo đỏ sớm khi Tab, "NẠP LẠI" so `===` không `normalize('NFC')` (sửa trước màn có ô gõ xác nhận/tìm tên), hook `review-pr-hint` nhận "issue #N" thành PR, e2e local dùng lại server cũ ở cổng 4173, `trackConsoleErrors` lặp ở 3 spec.

Ghi chú review #96 (không chặn, **cho T-046+**): khi "Nạp lại", DB cũ vẫn lưu được từ lúc chờ backup tới lúc thay DB → một lần ghi muộn không nằm trong backup lẫn DB mới; cần cho DB cũ ngừng lưu trước khi backup (khôi phục nếu backup/seed lỗi) khi đã có màn ghi DB. Khác: hộp thoại 10c thiếu số lượng dữ liệu sắp thay; sau một lần lưu lỗi, "Nạp lại" bị từ chối mà không có cách thử lưu lại; `useDatabase()` chưa có nơi gọi; i18n chèn tham số bằng `.replace` (gợi ý `t(key, params)`).

Ghi chú review #87 (không chặn): nếu `backups\` không đọc được thì app coi như lần đầu (không có backup); comment `tauri-storage.ts:21` còn nói "empty only when the file does not exist" (đúng hơn: không có file và không có backup); **cho T-052**: `export_write` giờ async, 2 lần xuất trùng tên cùng lúc ghi chung `name.tmp` (cộng NIT "export trùng phút"); NIT còn lại: `.tmp` trong `backups\`/`exports\`, listener ném lỗi, dọn thư mục tạm của test.

Ghi chú review #62 (#83–#85, không chặn): `markKycConflict` đổi mọi lỗi của `markConflict` thành `KYC_NO_CONFLICT`; chuỗi "Cập nhật KYC dd/mm/yyyy" có ở cả `db/kyc.ts` và `domain/kyc.ts`; ghi chú `SYSTEM` ("Hồ sơ KH: …", "Nam"/"Nữ") là dữ liệu DB, UI không dịch lại; đổi ngày sinh cùng năm vẫn tạo ghi chú + dữ kiện thay thế, không tạo phiên bản.

Ghi chú review #44 (không chặn): `isRfAppointment` dựa vào `StageTransition.appointmentId`, không dựa vào `appointment.stageAfter` → tầng db/UI phải luôn tạo transition gắn `appointmentId` khi ghi "nhóm sau cuộc gặp". (Đã đổi tên test `stats-rf.test.ts:106`.)

Ghi chú review #36 (còn lại, cho tầng nhập liệu): "mới nhất" theo thứ tự thao tác, không theo `confirmedDate`; lớp nhập liệu cần chuẩn hóa kiểu giá trị theo trường. (Test nhánh `false` của `markConflict` đã thêm ở #46.)

Ghi chú #33: `suggestedQuestions` trả cho mọi hạng mục thiếu ở cả 4 trạng thái (UI quyết định hiện); trường mâu thuẫn xếp theo thứ tự `KYC_FIELDS`.

Ghi chú khác (còn từ Phase 1): `DataTable` chưa test `sortable: false` và bảng rỗng; cột Giờ chưa `tabular-nums`.

## Bước kế tiếp chính xác

1. `/session-start` (pull `main`). Không có PR code mở. Nếu còn PR handoff `wip/…` chưa merge → merge (docs-only) trước.
2. **Việc kế tiếp: #202 T-077** (phiên mới, nhánh `task/T-077-…` từ `main`). Đọc body Issue (đủ bối cảnh F-02/F-03, file được phép, test chấp nhận). TDD: test đỏ trước — ca `openDatabase` reject trong `replace` (`apps/desktop/src/data/app-data.ts`, `generation` tăng trước `await`) rồi sửa đường mất lưu im lặng; thêm `ErrorBoundary` cho màn hình. `risk:high` → CI xanh + `review-pr` phiên sạch, **Owner merge**.
3. Rồi **#203 T-078** → **#204 T-079** (nhánh xếp chồng trên nhánh #203; merge #203 bằng `--merge` nếu #204 còn mở trên nó). Cả hai `risk:high`, Owner merge.
4. **Cuối cùng #72 T-053 đóng Phase 3** (cổng G7). Đọc body Issue + phần "#72 thêm từ review" ở trên. Ghi `docs/metrics/phase-3.md` theo `docs/COMPARISON.md` (mẫu `docs/metrics/phase-2.md`; số liệu từ GitHub milestone "Phase 3 — Nghiệp vụ & màn hình", test/coverage từ `pnpm verify`); ghi lần dùng Codex review. Lưu báo cáo tổng hợp vào `docs/reviews/` (chỉ làm được trên `D13_THINKPAD`, hoặc Owner chép file sang máy kia). **Dừng hỏi Owner** trước khi đóng milestone (G7).
   - Owner kiểm tay exe build **sau** #202–#204 (không dùng exe `724794a` nữa), ghi SHA + kết quả vào #72. Lỗi tìm được → Issue mới trước khi đóng Phase 3.
5. Phase 3 — spec: `docs/design/phase-3-du-lieu.md` (Accepted G2), ADR-0016. Ghi chú review không chặn ở trên: gom thành Issue dọn dẹp (nếu Owner muốn) hoặc chuyển sang Phase 4 khi đóng phase.
   - PR nào đụng `apps/desktop/src-tauri/**` hoặc cấu hình build thì gắn nhãn `build-exe` ngay lúc tạo.
6. Ngưỡng task mới (P1, ADR-0001 phụ lục): ≤ ~400 dòng code sản phẩm, ≤ ~800 dòng tổng diff kể cả test; PR liệt kê file sinh tự động không tính.
7. Golden fixtures là test bắt buộc: **không sửa để "cho xanh"**, muốn đổi phải qua Owner (G2). #61/#62 chạy golden G01–G22, K01–K15 qua DB.

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

- Merge PR handoff này (`wip/…`, docs-only, không chạy CI) để `main` có HANDOFF mới.
- Merge #202, #203, #204 (`risk:high`) sau CI xanh + review PASS.
- Kiểm tay trên exe build **sau** #202–#204 (theo tổng hợp §4, #72): mở lại giữ dữ liệu, mở exe thứ hai, lưu lỗi → thử lại / đóng, xuất trùng tên, nhập (kể cả file hỏng, file > 100 MB) / nạp lại, Cài đặt → Dữ liệu (#186) và Mở thư mục với đường dẫn có dấu phẩy / khoảng trắng (#195). Ghi SHA + kết quả vào #72.
- #72 T-053: cổng G7 đóng Phase 3.
- Merge PR `risk:med`/`high`: Owner merge sau review PASS.

## Ghi chú môi trường

- pnpm shim ở `%APPDATA%\npm` khi không có admin; trong Git Bash shim này lỗi — chạy pnpm từ PowerShell.
- Terminal mở trước khi chạy bootstrap chưa có PATH mới → mở terminal mới.
- Bộ nhớ Claude (memory) nằm riêng từng máy và **không** đồng bộ: điều gì cần nhớ giữa 2 máy phải ghi vào `CLAUDE.md` hoặc file này.
- Lần đầu mở Claude Code ở máy mới, lịch sử hội thoại của Home PC không có sẵn — phiên mới đọc `CLAUDE.md` + file này là đủ để tiếp tục.
- Đổi base PR xếp chồng (`gh pr edit --base main`) **không** tự chạy lại CI (workflow nghe `opened/synchronize/reopened`): `gh pr close <n>` + `gh pr reopen <n>` để CI chạy trên base mới rồi mới merge.
