# HANDOFF

> Cập nhật mỗi cuối phiên bằng `/handoff`. Phiên mới đọc file này đầu tiên (`/session-start`).

- **Cập nhật:** 2026-09-29 · máy `DESKTOP-KDURKJP` · sau khi merge T-049 phần A1 (PR #155), A2 (PR #156), A3 (PR #158)
- **Nhánh:** `docs/handoff-2026-09-29-t049a3` (= `main` `74be6c9` + file này); không còn PR code nào mở. Nhánh `task/T-049a*` đã xóa cả local lẫn remote. Checkout chính `C:\workspace\Project-2C` sạch. Worktree review `C:\workspace\Project-2C-review` detached ở `74be6c9`
- **Máy kế tiếp:** Home PC hoặc Office Laptop — cả hai đã có môi trường + worktree review
- **Repo đã chuyển public** (27/09, Owner tự làm) vì Actions private chạm ~1.800/2.000 phút; Actions giờ miễn phí
- **Ruleset `protect-main`** (28/09, Owner duyệt): bắt buộc PR, cấm force-push và xóa `main`; không bắt buộc status check, không auto-merge. Hook `pre-push` giữ nguyên
- **Phase:** 3 — Nghiệp vụ & màn hình (milestone mở 26/09/2026; G2/G1/G4 đã duyệt) · Phase 2 đã đóng · **Phase 1 đã đóng** (G7, Owner duyệt 28/09/2026; 18/18 Issue)

## Trạng thái

| Việc | Trạng thái |
|---|---|
| #68 T-049 Lịch hẹn | **Đang làm**, Issue mở. Owner tách 3 phần ([quyết định](https://github.com/AlexH-AI/Project-2C/issues/68#issuecomment-5874946941)); phần A tách tiếp A1/A2/A3. ✅ **A1** PR #155 (merge `888566e`): màn `routes/appointments/AppointmentsScreen.tsx` đọc DB — kỳ, lọc góc nhìn / người phối hợp, bảng "Trong ngày" team → RE, danh sách, bảng chi tiết; `appointments-view.ts` (`appointmentRows`, `dayBoard`, `outcomeText`, `personLabel`); `formatDayMonth` trong `domain`; `coordinatorsByAppointment` (một câu SQL) trong `db/appointments.ts`. ✅ **A2** PR #156 (squash `9e6601e`): lịch tháng (`monthGrid`, `CALENDAR_GROUP`), ô ngoài tháng không bấm được (Owner chọn 29/09). ✅ **A3** PR #158 (squash `74be6c9`, xử lý ghi chú review #156): `pickDay` — kỳ Ngày/Tuần bấm ngày ngoài kỳ thì kỳ chuyển theo; kỳ Tùy chọn thì ô ngoài khoảng không bấm được (Owner chọn 29/09). ⏳ **B** hộp Tạo lịch 6a/6b + "Các lần hẹn trước" + "Tạo lịch hẹn tiếp theo" 6h. ⏳ **C** Dời lịch 6e (+ tham số `note` ở `rescheduleAppointment`, Owner duyệt mở rộng file) + bảng Lịch hẹn trong Hồ sơ KH + nút "Hẹn tiếp" ở hồ sơ / dòng thời gian. CI `main` của `9e6601e` success; CI của `74be6c9` đang chạy lúc handoff → khi xanh, artifact `Project-2C-74be6c9…` là exe mới nhất |
| #142 T-065 form KH theo sát mockup 5a–5c | Mở, `risk:med`; Owner quyết "có làm, không gấp". Gom 4 chỗ lệch mockup từ review #140 |

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

1. `/session-start` (pull `main`). Kiểm run CI của `74be6c9`: `gh run list --branch main --limit 1` → `success` thì exe mới nhất là artifact `Project-2C-74be6c9…` (gồm màn Lịch hẹn A1 + A2 + A3); nếu lỗi → xem log, báo Owner.
2. Phase 3 — spec: `docs/design/phase-3-du-lieu.md` (Accepted G2), ADR-0016. Mỗi issue một phiên mới. Issue còn mở của milestone (6): #68 (đang làm), #69, #70, #142, #71, #72.
   - **Việc kế tiếp: #68 phần B** — nhánh `task/T-049b-create-appointment` từ `main`, PR `Refs #68`, nhãn `risk:med`. Phạm vi: hộp **Tạo lịch hẹn** (mockup `docs/design/mockups/appointment-forms.html` 6a, 6b; 6h cho "Tạo lịch hẹn tiếp theo") mở từ màn `AppointmentsScreen.tsx`; nhập ngày `dd/mm` + giờ, hiện ngày đầy đủ đã diễn giải; trigger bắt buộc, mặc định "—"; ngày đã qua > 60 ngày → gợi ý năm sau (ca biên nhập ngày: `docs/metrics/phase-2.md`); "Các lần hẹn trước" (mới nhất trên, 5 lần + "Xem tất cả (n)", ngày kèm năm nếu khác năm nay); "Tạo lịch hẹn tiếp theo" từ bảng chi tiết lịch hẹn: điền sẵn KH/RE/người phối hợp/trigger, ngày phải từ hôm nay, **không** dùng `rescheduled_from_id`. Test chấp nhận: các ô tương ứng trong body #68. Trước khi code: đọc repository tạo lịch trong `packages/db/src/appointments.ts` và các hàm diễn giải ngày trong `packages/domain`. Quá ngưỡng (xem 4) thì tách B1/B2 như A.
   - Sau B: **#68 phần C** (dời lịch 6e + `note` ở `rescheduleAppointment` + bảng Lịch hẹn ở Hồ sơ KH + nút "Hẹn tiếp") → đóng #68 → **#69** T-050 Ghi kết quả cuộc gặp → **#70** T-051 Hợp đồng (G3 đã duyệt).
   - **#142** T-065 form KH theo mockup 5a–5c — không gấp; có thể gộp các NIT review #141 cùng file.
   - **#69 T-050**: migration mới thêm `outcome_reviewer_id` — CHECK cấp bảng trên SQLite có thể khiến drizzle-kit dựng lại bảng `appointments`; kiểm SQL sinh ra + test migrate DB có dữ liệu (review #80). Hồ sơ KH (#141) đã hiện "sau cuộc gặp" cho transition có `appointmentId` — T-050 chỉ cần ghi đúng.
   - **Thứ tự:** Owner chốt 28/09 "#91 → #65 → #89 → #90 → #66–#70", đã xong tới #67, #68 đang làm. Nếu Owner không nói gì thì làm tiếp: #68 B → #68 C → #69 → #70, #142 chen khi rảnh.
   - Task đều `risk:med` → Owner merge sau review PASS. PR nào đụng `apps/desktop/src-tauri/**` hoặc cấu hình build thì gắn nhãn `build-exe` ngay lúc tạo.
3. Sau đó theo blocking edges: #71 backup (`risk:high`); #72 đóng phase (G7).
4. Ngưỡng task mới (P1, ADR-0001 phụ lục): ≤ ~400 dòng code sản phẩm, ≤ ~800 dòng tổng diff kể cả test; PR liệt kê file sinh tự động không tính.
5. Golden fixtures là test bắt buộc: **không sửa để "cho xanh"**, muốn đổi phải qua Owner (G2). #61/#62 chạy golden G01–G22, K01–K15 qua DB.

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

- Xác nhận việc kế tiếp: mặc định #68 phần B → phần C → #69 → #70, #142 chen khi rảnh (xem "Bước kế tiếp" 2).
- Merge PR `risk:med`/`high`: Owner merge sau review PASS.

## Ghi chú môi trường

- pnpm shim ở `%APPDATA%\npm` khi không có admin; trong Git Bash shim này lỗi — chạy pnpm từ PowerShell.
- Terminal mở trước khi chạy bootstrap chưa có PATH mới → mở terminal mới.
- Bộ nhớ Claude (memory) nằm riêng từng máy và **không** đồng bộ: điều gì cần nhớ giữa 2 máy phải ghi vào `CLAUDE.md` hoặc file này.
- Lần đầu mở Claude Code ở máy mới, lịch sử hội thoại của Home PC không có sẵn — phiên mới đọc `CLAUDE.md` + file này là đủ để tiếp tục.
- Đổi base PR xếp chồng (`gh pr edit --base main`) **không** tự chạy lại CI (workflow nghe `opened/synchronize/reopened`): `gh pr close <n>` + `gh pr reopen <n>` để CI chạy trên base mới rồi mới merge.
