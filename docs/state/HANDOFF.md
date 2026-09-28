# HANDOFF

> Cập nhật mỗi cuối phiên bằng `/handoff`. Phiên mới đọc file này đầu tiên (`/session-start`).

- **Cập nhật:** 2026-09-28 · máy `D13_THINKPAD` (Office Laptop) · sau khi merge T-047 (#66, PR #138–#141)
- **Nhánh:** `docs/handoff-2026-09-28-t047` (= `main` `c87f045` + file này); không còn PR nào mở. Checkout chính `C:\workspace\Project-2C` sạch. Worktree review `C:\workspace\Project-2C-review` detached ở `c87f045`
- **Máy kế tiếp:** Home PC hoặc Office Laptop — cả hai đã có môi trường + worktree review
- **Repo đã chuyển public** (27/09, Owner tự làm) vì Actions private chạm ~1.800/2.000 phút; Actions giờ miễn phí
- **Ruleset `protect-main`** (28/09, Owner duyệt): bắt buộc PR, cấm force-push và xóa `main`; không bắt buộc status check, không auto-merge. Hook `pre-push` giữ nguyên
- **Phase:** 3 — Nghiệp vụ & màn hình (milestone mở 26/09/2026; G2/G1/G4 đã duyệt) · Phase 2 đã đóng · **Phase 1 đã đóng** (G7, Owner duyệt 28/09/2026; 18/18 Issue)

## Trạng thái

| Việc | Trạng thái |
|---|---|
| #66 T-047 Khách hàng: kanban/bảng, tạo/sửa, chuyển nhóm tay | ✅ đóng 28/09 qua 4 PR xếp chồng: #138 (A1 scope picker), #139 (A2 kanban/bảng + hồ sơ), #140 (B1 tạo/sửa KH), #141 (B2 chuyển nhóm tay + lịch sử nhóm; review `risk:med` PASS kèm ghi chú, merge `--squash` `c87f045`). CI `main` run `36419788076` trên `c87f045` đang chạy lúc handoff → artifact `Project-2C-c87f045…` |
| #142 T-065 form KH theo sát mockup 5a–5c | Mở, `risk:med`; Owner quyết "có làm, không gấp", làm sau #140/#141 (đã merge → hết chặn). Gom 4 chỗ lệch mockup từ review #140 |
| #131 T-064 Team & nhân sự — phần Nhân sự | Mở, `risk:med` (tách từ #65; phần Team #65 đã đóng) |
| #110 T-062 run CI của `main` không hủy nhau | Issue đã đóng (PR #116); **test chấp nhận 3 chưa kiểm** (xem "Bước kế tiếp" 2). Lần 28/09 chưa tính: run `115c2cb` xong 12:03, trước khi run `c87f045` bắt đầu 12:07 — không chồng nhau |

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

1. `/session-start` (pull `main`). Kiểm run `main` trên `c87f045` (`gh run list --branch main --limit 3`) đã `success` và có artifact `Project-2C-c87f045…` (exe mới nhất: T-046/T-055/T-056/T-047).
2. **Còn nợ test chấp nhận 3 của #110 (T-062):** ở lần kế tiếp có 2 push code lên `main` mà run thứ nhất **chưa xong** khi push thứ hai tới (build exe ~4–5 phút, nên phải merge cách nhau dưới ~4 phút), chạy `gh run list --branch main --limit 5` → cả hai run `completed`/`success`, không `cancelled`, và mỗi SHA có artifact `Project-2C-<sha>`. Ghi kết quả thành comment trên PR #116. Nếu có run bị hủy → mở lại #110.
3. Phase 3 — spec: `docs/design/phase-3-du-lieu.md` (Accepted G2), ADR-0016. Mỗi issue một phiên mới. Đã đóng hôm nay: #65 (Team), #89, #90, #66. Issue còn mở của milestone:
   - **#131** T-064 Nhân sự (tách từ #65) — mang theo ghi chú review cho T-046 (R1 `PERSON_IN_USE`, R4 viền 3:1 / ô ngày / NFC, #96, #125).
   - **#67** T-048 Hồ sơ KH — KYC · **#68** T-049 Lịch hẹn · **#69** T-050 Ghi kết quả cuộc gặp · **#70** T-051 Hợp đồng (G3 đã duyệt).
   - **#142** T-065 form KH theo mockup 5a–5c — không gấp; có thể gộp các NIT review #141 cùng file.
   - **#69 T-050**: migration mới thêm `outcome_reviewer_id` — CHECK cấp bảng trên SQLite có thể khiến drizzle-kit dựng lại bảng `appointments`; kiểm SQL sinh ra + test migrate DB có dữ liệu (review #80). Hồ sơ KH (#141) đã hiện "sau cuộc gặp" cho transition có `appointmentId` — T-050 chỉ cần ghi đúng.
   - **Thứ tự chưa chốt** (thứ tự Owner chốt 28/09 "#91 → #65 → #89 → #90 → #66–#70" đã xong tới #66): hỏi Owner việc kế tiếp trước khi mở nhánh. Nếu Owner không nói gì thì theo số Issue: #131 → #67 → #68 → #69 → #70, #142 chen khi rảnh.
   - Task đều `risk:med` → Owner merge sau review PASS. PR nào đụng `apps/desktop/src-tauri/**` hoặc cấu hình build thì gắn nhãn `build-exe` ngay lúc tạo.
4. Sau đó theo blocking edges: #71 backup (`risk:high`); #72 đóng phase (G7).
5. Ngưỡng task mới (P1, ADR-0001 phụ lục): ≤ ~400 dòng code sản phẩm, ≤ ~800 dòng tổng diff kể cả test; PR liệt kê file sinh tự động không tính.
6. Golden fixtures là test bắt buộc: **không sửa để "cho xanh"**, muốn đổi phải qua Owner (G2). #61/#62 chạy golden G01–G22, K01–K15 qua DB.

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

- Chốt thứ tự Phase 3 còn lại: #131, #67–#70, #142 (xem "Bước kế tiếp" 3).
- Merge PR `risk:med`/`high`: Owner merge sau review PASS.

## Ghi chú môi trường

- pnpm shim ở `%APPDATA%\npm` khi không có admin; trong Git Bash shim này lỗi — chạy pnpm từ PowerShell.
- Terminal mở trước khi chạy bootstrap chưa có PATH mới → mở terminal mới.
- Bộ nhớ Claude (memory) nằm riêng từng máy và **không** đồng bộ: điều gì cần nhớ giữa 2 máy phải ghi vào `CLAUDE.md` hoặc file này.
- Lần đầu mở Claude Code ở máy mới, lịch sử hội thoại của Home PC không có sẵn — phiên mới đọc `CLAUDE.md` + file này là đủ để tiếp tục.
- Đổi base PR xếp chồng (`gh pr edit --base main`) **không** tự chạy lại CI (workflow nghe `opened/synchronize/reopened`): `gh pr close <n>` + `gh pr reopen <n>` để CI chạy trên base mới rồi mới merge.
