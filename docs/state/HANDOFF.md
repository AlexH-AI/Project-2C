# HANDOFF

> Cập nhật mỗi cuối phiên bằng `/handoff`. Phiên mới đọc file này đầu tiên (`/session-start`).

- **Cập nhật:** 2026-09-27 · máy `DESKTOP-KDURKJP`
- **Nhánh:** `docs/handoff-2026-09-27-r4` (= `main` `3e508d2` + file này); không còn PR mở
- **Repo đã chuyển public** (27/09, Owner tự làm) vì Actions private chạm ~1.800/2.000 phút; Actions giờ miễn phí
- **Phase:** 3 — Nghiệp vụ & màn hình (milestone mở 26/09/2026; G2/G1/G4 đã duyệt) · Phase 2 đã đóng · Phase 1 milestone **để mở** chờ test ở văn phòng

## Trạng thái

| Việc | Trạng thái |
|---|---|
| #17 favicon/app icon, #9 exe 2 máy + `docs/metrics/phase-1.md` | **hoãn** — làm khi Owner ở văn phòng |
| Review toàn bộ R1 `packages/db/**` (#99) | ✅ đã đóng; mục chặn (ngày transition) sửa ở #100/PR #102; ghi chú không chặn 1–4 trong body #99 (cho T-046/T-050/T-052) |
| Review toàn bộ R2 `apps/desktop/src/data` + `src-tauri` (#101) | ✅ PASS kèm ghi chú, đã đóng |
| #100 T-058 ngày transition không lùi (D10, phương án A, `TRANSITION_BEFORE_LATEST`) | ✅ merge PR #102 (`--squash`, `ecee4a0`, 27/09); vòng sửa Standards: so ngày bằng `compareDates` thay cho so chuỗi ISO. Hết chặn #66, #69 |
| Review toàn bộ R3 `packages/domain/**` (#103) | ✅ đã đóng; 2 mục chặn sửa ở #105/PR #107 và #106/PR #112 |
| #105 T-059 nhãn kỳ PeriodPicker qua i18n (R3) | ✅ merge PR #107 (`--squash`, `facbcd7`): `formatPeriodLabel` → `formatPeriodValue` (chỉ ngày: `09/2026`, `2026`); chữ "Tháng {value}"/"Năm {value}" ở `vi.ts` (`period.monthLabel`/`yearLabel`), ghép bằng `periodLabel` (`PeriodPicker.label.ts`) |
| #106 T-060 `parseVnd`: `.` và `,` cùng luật (R3) | ✅ merge PR #112 (`--squash`, `0b0f12e`): dấu + đúng 3 chữ số = ngăn nghìn (`500,000` = 500.000 đồng), 1–2 hoặc ≥ 4 chữ số = thập phân; không test cũ nào phải sửa; domain coverage 100% |
| CI tiết kiệm phút Actions (ADR-0015 phụ lục, G1 Owner duyệt) | ✅ merge PR #111 (`--squash`, `3aff2c8`): push docs-only lên `main` không chạy CI; push lên `main` bỏ Verify, chỉ build exe; PR chỉ build exe khi có nhãn `build-exe`. CLAUDE.md đồng bộ ở PR #113 |
| Review toàn bộ R4 UI, `packages/ui`, script/CI/hook (#108) | **CHANGES, còn mở** — 3 mục chặn tách thành #109, #110 (xem "Bước kế tiếp"); ghi chú không chặn trong body #108 |

Kết quả review R1–R4 nằm đầy đủ trong body Issue #99, #101, #103, #108 (GitHub là nguồn sự thật) — đọc lại trước khi làm T-046/T-047/T-050/T-052. Tóm tắt không chặn: R1 — D7 sửa từng phần (#69), `PERSON_IN_USE` đếm cả KH xóa mềm (câu báo ở T-046), DB mới hơn app mở im lặng (R2/T-052), năm > 9999; R3 — thiếu hàm MTD trong `domain` (trước Phase 4), `calendarDate` thiếu `MAX_YEAR`, `shift` vượt `MIN_YEAR`, API `nextKycVersion`, ngày nhanh đầu năm (gợi ý năm trước?), hiệu năng `rfCount` O(A×T); R4 — `session-end.ps1` `git add -A` gom file phiên khác, viền ô nhập / mũi tên sắp xếp dưới 3:1 (token G3, Owner cân nhắc khi dựng #65–#70), `Overview` lấy "hôm nay" từ đồng hồ máy thay vì `useAppData().today()`, ô ngày tùy chọn báo đỏ sớm khi Tab, "NẠP LẠI" so `===` không `normalize('NFC')` (sửa trước màn có ô gõ xác nhận/tìm tên), hook `review-pr-hint` nhận "issue #N" thành PR, e2e local dùng lại server cũ ở cổng 4173, `trackConsoleErrors` lặp ở 3 spec.

Ghi chú review #96 (không chặn, **cho T-046+**): khi "Nạp lại", DB cũ vẫn lưu được từ lúc chờ backup tới lúc thay DB → một lần ghi muộn không nằm trong backup lẫn DB mới; cần cho DB cũ ngừng lưu trước khi backup (khôi phục nếu backup/seed lỗi) khi đã có màn ghi DB. Khác: hộp thoại 10c thiếu số lượng dữ liệu sắp thay; sau một lần lưu lỗi, "Nạp lại" bị từ chối mà không có cách thử lưu lại; `useDatabase()` chưa có nơi gọi; i18n chèn tham số bằng `.replace` (gợi ý `t(key, params)`).

Ghi chú review #87 (không chặn): nếu `backups\` không đọc được thì app coi như lần đầu (không có backup); comment `tauri-storage.ts:21` còn nói "empty only when the file does not exist" (đúng hơn: không có file và không có backup); **cho T-052**: `export_write` giờ async, 2 lần xuất trùng tên cùng lúc ghi chung `name.tmp` (cộng NIT "export trùng phút"); NIT còn lại: `.tmp` trong `backups\`/`exports\`, listener ném lỗi, dọn thư mục tạm của test.

Ghi chú review #62 (#83–#85, không chặn): `markKycConflict` đổi mọi lỗi của `markConflict` thành `KYC_NO_CONFLICT`; chuỗi "Cập nhật KYC dd/mm/yyyy" có ở cả `db/kyc.ts` và `domain/kyc.ts`; ghi chú `SYSTEM` ("Hồ sơ KH: …", "Nam"/"Nữ") là dữ liệu DB, UI không dịch lại; đổi ngày sinh cùng năm vẫn tạo ghi chú + dữ kiện thay thế, không tạo phiên bản.

Ghi chú review #44 (không chặn): `isRfAppointment` dựa vào `StageTransition.appointmentId`, không dựa vào `appointment.stageAfter` → tầng db/UI phải luôn tạo transition gắn `appointmentId` khi ghi "nhóm sau cuộc gặp". (Đã đổi tên test `stats-rf.test.ts:106`.)

Ghi chú review #36 (còn lại, cho tầng nhập liệu): "mới nhất" theo thứ tự thao tác, không theo `confirmedDate`; lớp nhập liệu cần chuẩn hóa kiểu giá trị theo trường. (Test nhánh `false` của `markConflict` đã thêm ở #46.)

Ghi chú #33: `suggestedQuestions` trả cho mọi hạng mục thiếu ở cả 4 trạng thái (UI quyết định hiện); trường mâu thuẫn xếp theo thứ tự `KYC_FIELDS`.

Ghi chú khác (còn từ Phase 1): `DataTable` chưa test `sortable: false` và bảng rỗng; cột Giờ chưa `tabular-nums`.

## Chờ test ở văn phòng (Owner quyết 26/09/2026)

Tiếp tục dev trên Home PC; **không chặn Phase 2**. Milestone Phase 1 để mở cho tới khi làm xong các mục dưới trên Office Laptop:

- [ ] #9: exe (artifact CI mới nhất của `main`) chạy trên Office Laptop; kiểm các màn đã merge ở PR #18, #20, #22, #23 (sidebar, PeriodPicker, DataTable sort, Chart hiện đúng màu); ghi `docs/metrics/phase-1.md`.
- [ ] #17: favicon/app icon màu ADR-0013 — có thể code trước trên Home PC, nhưng ảnh chụp icon trong exe/taskbar để kiểm ở văn phòng.
- [ ] Sau đó: đóng milestone Phase 1 (G7).

## Bước kế tiếp chính xác

1. `/session-start` (pull `main`). Checkout chính đang ở `main`; worktree review `C:\workspace\Project-2C-review` đã có.
2. **R4 (#108) — 3 mục chặn, 2 task `risk:med`** (mỗi task một phiên mới; xong cả hai thì comment trỏ PR trên #108 rồi đóng #108):
   - **#109 T-061:** `tools/bootstrap.ps1` chết trên Windows PowerShell 5.1 (`gh auth status *> $null` khi chưa đăng nhập, `corepack enable 2>$null` lỗi EPERM → nhánh dự phòng không chạy), ghim Node 24 thay cho `OpenJS.NodeJS.LTS`; `tools/session-start.ps1` kiểm exit code `git fetch`/`git pull` và báo rõ (detached HEAD: bỏ `pull`, in SHA đang đứng + `origin/main`). **Chặn việc dựng Office Laptop (#9)** → làm trước.
   - **#110 T-062:** `concurrency` `cancel-in-progress: true` hủy run build exe của `main` khi merge liền nhau → `main` mất artifact. PR #111 đã bỏ phần "push docs hủy run của merge trước" (push docs-only lên `main` không chạy CI), còn lại: `cancel-in-progress: ${{ github.event_name == 'pull_request' }}`.
3. Phase 3 — spec: `docs/design/phase-3-du-lieu.md` (Accepted G2), ADR-0016. Mỗi issue một phiên mới. Frontier (không bị chặn):
   - UI #65–#70 (G3, #63, #64 đã xong; R1, R2 xong → màn ghi DB làm được; #100 xong → hết chặn #66, #69). Bắt đầu #65 T-046 Team & nhân sự.
   - Nối tiếp T-044: #88 CI Rust, #89 chặn 2 exe, #90 dọn backup theo mtime, #91 đóng app khi lưu lỗi — Owner xếp thứ tự.
   - **#69 T-050**: migration mới thêm `outcome_reviewer_id` — CHECK cấp bảng trên SQLite có thể khiến drizzle-kit dựng lại bảng `appointments`; kiểm SQL sinh ra + test migrate DB có dữ liệu (review #80).
4. Sau đó theo blocking edges: #71 backup; #72 đóng phase (G7).
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

- Node 24: bản cài không cần admin (zip từ nodejs.org, thêm vào PATH người dùng) hoặc `winget install OpenJS.NodeJS.LTS --scope user` nếu được phép.
- pnpm: `corepack enable pnpm --install-directory "$env:APPDATA\npm"`.
- `pnpm install` → làm được mọi việc của #7/#8: `pnpm verify`, `pnpm dev:web`, `pnpm e2e` (dùng Microsoft Edge có sẵn).
- Exe: tải từ GitHub Actions (run mới nhất trên `main` → artifact `Project-2C-<sha>`). Mỗi push code lên `main` build exe (PR chỉ build khi có nhãn `build-exe`, ADR-0015 phụ lục).

### Phương án C — không cài được gì

Dùng **Claude Code trên web** (claude.ai/code) gắn repo `AlexH-AI/Project-2C`: code, test, PR chạy trên cloud; CI build exe; laptop chỉ cần trình duyệt. Không chạy được `.ps1`/hook local — quy tắc "không push thẳng `main`" do Claude tuân thủ (CLAUDE.md).

## Chờ Owner

- Thứ tự nối tiếp T-044: #88 CI Rust, #89 chặn 2 exe, #90 dọn backup theo mtime, #91 đóng app khi lưu lỗi.

- #9 và #17: hoãn tới khi Owner ở văn phòng (xem "Chờ test ở văn phòng"). Không nhắc lại trước khi Owner báo đã ở văn phòng.
- Repo đã public (27/09): GitHub Free giờ cho bật branch protection / auto-merge (lý do của #3 không còn). Chưa đổi gì — hook `pre-push` + Claude merge khi CI xanh vẫn là quy trình; Owner quyết có bật hay không.

## Ghi chú môi trường

- pnpm shim ở `%APPDATA%\npm` khi không có admin; trong Git Bash shim này lỗi — chạy pnpm từ PowerShell.
- Terminal mở trước khi chạy bootstrap chưa có PATH mới → mở terminal mới.
- Bộ nhớ Claude (memory) nằm riêng từng máy và **không** đồng bộ: điều gì cần nhớ giữa 2 máy phải ghi vào `CLAUDE.md` hoặc file này.
- Lần đầu mở Claude Code ở máy mới, lịch sử hội thoại của Home PC không có sẵn — phiên mới đọc `CLAUDE.md` + file này là đủ để tiếp tục.
- Đổi base PR xếp chồng (`gh pr edit --base main`) **không** tự chạy lại CI (workflow nghe `opened/synchronize/reopened`): `gh pr close <n>` + `gh pr reopen <n>` để CI chạy trên base mới rồi mới merge.
