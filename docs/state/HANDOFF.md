# HANDOFF

> Cập nhật mỗi cuối phiên bằng `/handoff`. Phiên mới đọc file này đầu tiên (`/session-start`).

- **Cập nhật:** 2026-09-28 · máy `DESKTOP-KDURKJP`
- **Nhánh:** `docs/handoff-2026-09-28-t057` (= `main` `86b4e2c` + file này); không còn PR code mở. #91 T-057 đã merge (PR #125). Checkout chính `C:\workspace\Project-2C` sạch; nhánh `task/T-057-close-flush` và nhánh cũ `task/T-042-db-customers-policies` (bản gộp đã thay bằng T-042a–d) đã xóa cả local lẫn remote
- **Máy kế tiếp:** Office Laptop (29/09) — xem "Dựng môi trường trên Office Laptop" và "Chờ test ở văn phòng"
- **Repo đã chuyển public** (27/09, Owner tự làm) vì Actions private chạm ~1.800/2.000 phút; Actions giờ miễn phí
- **Ruleset `protect-main`** (28/09, Owner duyệt): bắt buộc PR, cấm force-push và xóa `main`; không bắt buộc status check, không auto-merge. Hook `pre-push` giữ nguyên
- **Phase:** 3 — Nghiệp vụ & màn hình (milestone mở 26/09/2026; G2/G1/G4 đã duyệt) · Phase 2 đã đóng · Phase 1 milestone **để mở** chờ test ở văn phòng

## Trạng thái

| Việc | Trạng thái |
|---|---|
| #17 favicon/app icon, #9 exe 2 máy + `docs/metrics/phase-1.md` | **hoãn** — làm khi Owner ở văn phòng |
| #91 T-057 lưu hết trước khi đóng exe | ✅ merge PR #125 (`--squash`, `86b4e2c`, 28/09); review mức high (nâng từ med vì `src-tauri/capabilities`) PASS kèm ghi chú; Owner kiểm tay exe đạt; CI `main` build exe xanh (run `36343058615`). `PersistQueue` giờ có `unsaved()` + `flush()`; `CloseGuard` (`apps/desktop/src/shell/`) chỉ gắn khi `isTauri()` |
| #110 T-062 run CI của `main` không hủy nhau | ✅ merge PR #116; **test chấp nhận 3 chưa kiểm** (xem "Bước kế tiếp" 2) |

Ghi chú review #125 (không chặn, **cho #65 và các màn ghi DB**): cờ `closing` trong `CloseGuard.tsx` không reset nếu `destroy()` lỗi (gợi ý `try/finally`); bấm X lúc đang seed "Nạp lại" thì app đóng trước khi lưu bản mới (không mất dữ liệu, chỉ mất lần nạp lại); không có dấu hiệu "đang lưu" khi chờ `flush()`; phần nối React của `CloseGuard` chưa có test tự động; chuỗi class `BUTTON` chép từ `Settings.tsx` (gộp khi có nút trong `packages/ui`).

Review R1–R4 (#99, #101, #103, #108) đã đóng hết; kết quả đầy đủ trong body các Issue đó (GitHub là nguồn sự thật) — đọc lại trước khi làm T-046/T-047/T-050/T-052. Tóm tắt không chặn: R1 — D7 sửa từng phần (#69), `PERSON_IN_USE` đếm cả KH xóa mềm (câu báo ở T-046), DB mới hơn app mở im lặng (R2/T-052), năm > 9999; R3 — thiếu hàm MTD trong `domain` (trước Phase 4), `calendarDate` thiếu `MAX_YEAR`, `shift` vượt `MIN_YEAR`, API `nextKycVersion`, ngày nhanh đầu năm (gợi ý năm trước?), hiệu năng `rfCount` O(A×T); R4 — `session-end.ps1` `git add -A` gom file phiên khác, viền ô nhập / mũi tên sắp xếp dưới 3:1 (token G3, Owner cân nhắc khi dựng #65–#70), `Overview` lấy "hôm nay" từ đồng hồ máy thay vì `useAppData().today()`, ô ngày tùy chọn báo đỏ sớm khi Tab, "NẠP LẠI" so `===` không `normalize('NFC')` (sửa trước màn có ô gõ xác nhận/tìm tên), hook `review-pr-hint` nhận "issue #N" thành PR, e2e local dùng lại server cũ ở cổng 4173, `trackConsoleErrors` lặp ở 3 spec.

Ghi chú review #96 (không chặn, **cho T-046+**): khi "Nạp lại", DB cũ vẫn lưu được từ lúc chờ backup tới lúc thay DB → một lần ghi muộn không nằm trong backup lẫn DB mới; cần cho DB cũ ngừng lưu trước khi backup (khôi phục nếu backup/seed lỗi) khi đã có màn ghi DB. Khác: hộp thoại 10c thiếu số lượng dữ liệu sắp thay; sau một lần lưu lỗi, "Nạp lại" bị từ chối mà không có cách thử lưu lại; `useDatabase()` chưa có nơi gọi; i18n chèn tham số bằng `.replace` (gợi ý `t(key, params)`).

Ghi chú review #87 (không chặn): nếu `backups\` không đọc được thì app coi như lần đầu (không có backup); comment `tauri-storage.ts:21` còn nói "empty only when the file does not exist" (đúng hơn: không có file và không có backup); **cho T-052**: `export_write` giờ async, 2 lần xuất trùng tên cùng lúc ghi chung `name.tmp` (cộng NIT "export trùng phút"); NIT còn lại: `.tmp` trong `backups\`/`exports\`, listener ném lỗi, dọn thư mục tạm của test.

Ghi chú review #62 (#83–#85, không chặn): `markKycConflict` đổi mọi lỗi của `markConflict` thành `KYC_NO_CONFLICT`; chuỗi "Cập nhật KYC dd/mm/yyyy" có ở cả `db/kyc.ts` và `domain/kyc.ts`; ghi chú `SYSTEM` ("Hồ sơ KH: …", "Nam"/"Nữ") là dữ liệu DB, UI không dịch lại; đổi ngày sinh cùng năm vẫn tạo ghi chú + dữ kiện thay thế, không tạo phiên bản.

Ghi chú review #44 (không chặn): `isRfAppointment` dựa vào `StageTransition.appointmentId`, không dựa vào `appointment.stageAfter` → tầng db/UI phải luôn tạo transition gắn `appointmentId` khi ghi "nhóm sau cuộc gặp". (Đã đổi tên test `stats-rf.test.ts:106`.)

Ghi chú review #36 (còn lại, cho tầng nhập liệu): "mới nhất" theo thứ tự thao tác, không theo `confirmedDate`; lớp nhập liệu cần chuẩn hóa kiểu giá trị theo trường. (Test nhánh `false` của `markConflict` đã thêm ở #46.)

Ghi chú #33: `suggestedQuestions` trả cho mọi hạng mục thiếu ở cả 4 trạng thái (UI quyết định hiện); trường mâu thuẫn xếp theo thứ tự `KYC_FIELDS`.

Ghi chú khác (còn từ Phase 1): `DataTable` chưa test `sortable: false` và bảng rỗng; cột Giờ chưa `tabular-nums`.

## Chờ test ở văn phòng (Owner quyết 26/09/2026)

Tiếp tục dev trên Home PC; **không chặn Phase 2**. Milestone Phase 1 để mở cho tới khi làm xong các mục dưới trên Office Laptop:

- [x] #9: exe `Project-2C-86b4e2c…` chạy trên Office Laptop (`D13_ThinkPad`) 28/09, Owner kiểm không lỗi, khởi động 1–2 giây; `docs/metrics/phase-1.md` đã ghi.
- [ ] #17: favicon/app icon màu ADR-0013 — có thể code trước trên Home PC, nhưng ảnh chụp icon trong exe/taskbar để kiểm ở văn phòng.
- [ ] Sau đó: đóng milestone Phase 1 (G7).

## Bước kế tiếp chính xác

1. `/session-start` (pull `main`). Trên Office Laptop: nếu chưa có repo/worktree review thì dựng theo "Dựng môi trường trên Office Laptop" (worktree review tạo bằng `git worktree add --detach ../Project-2C-review origin/main`). Nếu Owner muốn làm #9/#17 trước thì theo "Chờ test ở văn phòng" (exe mới nhất: artifact `Project-2C-86b4e2c952c5274497a2c30dbcb5fde9b4a7a556`, đã có T-057).
2. **Còn nợ test chấp nhận 3 của #110 (T-062):** ở lần kế tiếp có 2 push code lên `main` sát nhau (vd. merge PR xếp chồng bằng `--merge`), chạy `gh run list --branch main --limit 5` → cả hai run `completed`/`success`, không `cancelled`, và mỗi SHA có artifact `Project-2C-<sha>`. Ghi kết quả thành comment trên PR #116. Nếu có run bị hủy → mở lại #110.
3. Phase 3 — spec: `docs/design/phase-3-du-lieu.md` (Accepted G2), ADR-0016. Mỗi issue một phiên mới. Frontier (không bị chặn):
   - **Thứ tự Owner chốt 28/09: #91 (✅ xong) → #65 → #89 → #90**, rồi tới #66–#70.
     - **Việc kế tiếp: #65** T-046 Team & nhân sự — phiên mới, nhánh `task/T-046-…` từ `main`. Các Issue chặn (#59, #63, #64, #91) đã đóng; dựng trên `PersistQueue` đã có `flush()`. Nếu vượt ngưỡng ~400 dòng code sản phẩm thì đề xuất tách Team / Nhân sự trước khi code. Mang theo các ghi chú review cho T-046 (R1 `PERSON_IN_USE`, R4 viền 3:1 / ô ngày / NFC, #96, #125).
     - **#89** T-055 chặn 2 exe → **#90** T-056 dọn backup theo mtime: chỉ sửa `src-tauri`, không đụng #65, và chỉ gây hại khi đã dùng dữ liệu thật.
     - Cả 3 task còn lại đều `risk:med`. PR nào đụng `apps/desktop/src-tauri/**` thì phải gắn nhãn `build-exe` ngay lúc tạo.
   - UI #66–#70 (G3 đã duyệt; #100 xong nên hết chặn #66, #69).
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

- Node 24 (đúng major trong `.nvmrc`, không lấy LTS mới nhất): bản cài không cần admin (zip từ nodejs.org, thêm vào PATH người dùng) hoặc, nếu được phép, `winget install --id OpenJS.NodeJS.LTS --exact --version 24.19.0 --scope user` (bản 24.x mới nhất: `winget show --id OpenJS.NodeJS.LTS --versions`). `tools/bootstrap.ps1` tự chọn bản này và chạy được bằng cả `powershell` 5.1 lẫn `pwsh` (T-061).
- pnpm: `corepack enable pnpm --install-directory "$env:APPDATA\npm"`.
- `pnpm install` → làm được mọi việc của #7/#8: `pnpm verify`, `pnpm dev:web`, `pnpm e2e` (dùng Microsoft Edge có sẵn).
- Exe: tải từ GitHub Actions (run mới nhất trên `main` → artifact `Project-2C-<sha>`). Mỗi push code lên `main` build exe (PR chỉ build khi có nhãn `build-exe`, ADR-0015 phụ lục).

### Phương án C — không cài được gì

Dùng **Claude Code trên web** (claude.ai/code) gắn repo `AlexH-AI/Project-2C`: code, test, PR chạy trên cloud; CI build exe; laptop chỉ cần trình duyệt. Không chạy được `.ps1`/hook local — việc chặn push thẳng lên `main` do ruleset `protect-main` trên GitHub đảm nhận.

## Chờ Owner

- #9 và #17: hoãn tới khi Owner ở văn phòng (xem "Chờ test ở văn phòng"). 29/09 Owner làm trên Office Laptop: đầu phiên hỏi một lần có làm #9/#17 hôm đó không, hay tiếp tục #65.
- Merge PR `risk:med`/`high` (#65, #89, #90): Owner merge sau review PASS.

## Ghi chú môi trường

- pnpm shim ở `%APPDATA%\npm` khi không có admin; trong Git Bash shim này lỗi — chạy pnpm từ PowerShell.
- Terminal mở trước khi chạy bootstrap chưa có PATH mới → mở terminal mới.
- Bộ nhớ Claude (memory) nằm riêng từng máy và **không** đồng bộ: điều gì cần nhớ giữa 2 máy phải ghi vào `CLAUDE.md` hoặc file này.
- Lần đầu mở Claude Code ở máy mới, lịch sử hội thoại của Home PC không có sẵn — phiên mới đọc `CLAUDE.md` + file này là đủ để tiếp tục.
- Đổi base PR xếp chồng (`gh pr edit --base main`) **không** tự chạy lại CI (workflow nghe `opened/synchronize/reopened`): `gh pr close <n>` + `gh pr reopen <n>` để CI chạy trên base mới rồi mới merge.
