# HANDOFF

> Cập nhật mỗi cuối phiên bằng `/handoff`. Phiên mới đọc file này đầu tiên (`/session-start`).

- **Cập nhật:** 2026-09-27 · máy `DESKTOP-KDURKJP`
- **Nhánh:** `docs/handoff-2026-09-27-r1r3` (= `main` `ecee4a0` + file này); không còn PR code mở
- **Nghỉ ~5h** (chạm giới hạn dùng) — tiếp tục trên cùng máy
- **Phase:** 3 — Nghiệp vụ & màn hình (milestone mở 26/09/2026; G2/G1/G4 đã duyệt) · Phase 2 đã đóng · Phase 1 milestone **để mở** chờ test ở văn phòng

## Trạng thái

| Việc | Trạng thái |
|---|---|
| #17 favicon/app icon, #9 exe 2 máy + `docs/metrics/phase-1.md` | **hoãn** — làm khi Owner ở văn phòng |
| Review toàn bộ R1 `packages/db/**` (#99) | CHANGES → mục chặn (ngày transition) sửa xong ở #100/PR #102; **#99 còn mở**, đóng được (ghi chú không chặn 1–4 nằm trong body #99, cho T-046/T-050/T-052) |
| Review toàn bộ R2 `apps/desktop/src/data` + `src-tauri` (#101) | ✅ PASS kèm ghi chú, đã đóng |
| #100 T-058 ngày transition không lùi (D10, phương án A, `TRANSITION_BEFORE_LATEST`) | ✅ merge PR #102 (`--squash`, `ecee4a0`, 27/09); vòng sửa Standards: so ngày bằng `compareDates` thay cho so chuỗi ISO. Hết chặn #66, #69 |
| Review toàn bộ R3 `packages/domain/**` (#103) | **CHANGES, chưa xử lý** — 2 mục chặn (xem "Chờ Owner" + "Bước kế tiếp") |
| R4 (UI, `packages/ui`, script/CI/hook) | chưa làm — chạy song song với UI |

Kết quả review R1–R3 nằm đầy đủ trong body Issue #99, #101, #103 (GitHub là nguồn sự thật) — đọc lại trước khi làm T-046/T-047/T-050/T-052. Tóm tắt không chặn: R1 — D7 sửa từng phần (#69), `PERSON_IN_USE` đếm cả KH xóa mềm (câu báo ở T-046), DB mới hơn app mở im lặng (R2/T-052), năm > 9999; R3 — thiếu hàm MTD trong `domain` (trước Phase 4), `calendarDate` thiếu `MAX_YEAR`, `shift` vượt `MIN_YEAR`, API `nextKycVersion`, ngày nhanh đầu năm (gợi ý năm trước?), hiệu năng `rfCount` O(A×T).

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

1. `/session-start` (pull `main`).
   - Checkout chính `C:\workspace\Project-2C` đang đứng ở nhánh `task/T-058-transition-date-order` (`a7d9aa2`, đã merge qua #102): `git switch main; git pull`, rồi `git branch -D task/T-058-transition-date-order` (squash nên cần `-D`).
   - Worktree review `C:\workspace\Project-2C-review` đã có (việc một lần ở #98 đã xong).
2. Đóng #99 (R1): mục chặn đã sửa ở #102; ghi chú không chặn vẫn trong body.
3. **R3 (#103) — 2 mục chặn:**
   - `formatPeriodLabel` (`packages/domain/src/period.ts:206-221`) trả chuỗi UI cứng "Tháng 09/2026"/"Năm 2026", hiện thẳng ở `packages/ui/src/components/PeriodPicker.tsx:122` → tạo task `risk:low`: `domain` trả dữ liệu (kind + ngày đã định dạng), chữ "Tháng"/"Năm" chuyển sang i18n UI. Không cần Owner chốt, tạo Issue + làm được ngay.
   - `parseVnd('500,000')` → 500 đồng (`packages/domain/src/money.ts:55-61,71`) — **chờ Owner chọn A/B** (xem "Chờ Owner"), rồi mới tạo task.
4. **R4** (UI `apps/desktop/src` ngoài `data/`, `packages/ui`, script/CI/hook): một phiên sạch trong `C:\workspace\Project-2C-review`, `git checkout --detach origin/main`, cùng cách R1–R3 (Spec + Standards + `code-review high` inline, kết quả vào một Issue review). Chạy song song với UI.
5. Phase 3 — spec: `docs/design/phase-3-du-lieu.md` (Accepted G2), ADR-0016. Mỗi issue một phiên mới. Frontier (không bị chặn):
   - UI #65–#70 (G3, #63, #64 đã xong; R1, R2 xong → màn ghi DB làm được; #100 xong → hết chặn #66, #69). Bắt đầu #65 T-046 Team & nhân sự.
   - Nối tiếp T-044: #88 CI Rust, #89 chặn 2 exe, #90 dọn backup theo mtime, #91 đóng app khi lưu lỗi — Owner xếp thứ tự.
   - **#69 T-050**: migration mới thêm `outcome_reviewer_id` — CHECK cấp bảng trên SQLite có thể khiến drizzle-kit dựng lại bảng `appointments`; kiểm SQL sinh ra + test migrate DB có dữ liệu (review #80).
6. Sau đó theo blocking edges: #71 backup; #72 đóng phase (G7).
7. Ngưỡng task mới (P1, ADR-0001 phụ lục): ≤ ~400 dòng code sản phẩm, ≤ ~800 dòng tổng diff kể cả test; PR liệt kê file sinh tự động không tính.
8. Golden fixtures là test bắt buộc: **không sửa để "cho xanh"**, muốn đổi phải qua Owner (G2). #61/#62 chạy golden G01–G22, K01–K15 qua DB.

## Lệnh chạy tiếp

```powershell
cd C:\workspace\Project-2C
git switch main; git pull
git branch -D task/T-058-transition-date-order
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
- Exe: tải từ GitHub Actions (run mới nhất trên `main` → artifact `Project-2C-<sha>`). CI vẫn build exe cho mọi PR.

### Phương án C — không cài được gì

Dùng **Claude Code trên web** (claude.ai/code) gắn repo `AlexH-AI/Project-2C`: code, test, PR chạy trên cloud; CI build exe; laptop chỉ cần trình duyệt. Không chạy được `.ps1`/hook local — quy tắc "không push thẳng `main`" do Claude tuân thủ (CLAUDE.md).

## Chờ Owner

- **G8 — R3 #103 `parseVnd` với dấu `,`:** A (đề xuất) từ chối khi phần sau `,` dài hơn số mũ đơn vị (`500,000`, `1,2340k` bị từ chối; `1,5 tỷ`, `0,5tr` vẫn nhận; sửa test `1,2340k`) · B giữ parse, trả cờ `ambiguous` khi không đơn vị mà có `,`, UI bắt RE xác nhận.
- Thứ tự nối tiếp T-044: #88 CI Rust, #89 chặn 2 exe, #90 dọn backup theo mtime, #91 đóng app khi lưu lỗi.

- #9 và #17: hoãn tới khi Owner ở văn phòng (xem "Chờ test ở văn phòng"). Không nhắc lại trước khi Owner báo đã ở văn phòng.
- GitHub Free: không bật được auto-merge cho repo private — Owner báo CI xanh (hoặc phiên sau kiểm) rồi Claude merge.

## Ghi chú môi trường

- pnpm shim ở `%APPDATA%\npm` khi không có admin; trong Git Bash shim này lỗi — chạy pnpm từ PowerShell.
- Terminal mở trước khi chạy bootstrap chưa có PATH mới → mở terminal mới.
- Bộ nhớ Claude (memory) nằm riêng từng máy và **không** đồng bộ: điều gì cần nhớ giữa 2 máy phải ghi vào `CLAUDE.md` hoặc file này.
- Lần đầu mở Claude Code ở máy mới, lịch sử hội thoại của Home PC không có sẵn — phiên mới đọc `CLAUDE.md` + file này là đủ để tiếp tục.
- Đổi base PR xếp chồng (`gh pr edit --base main`) **không** tự chạy lại CI (workflow nghe `opened/synchronize/reopened`): `gh pr close <n>` + `gh pr reopen <n>` để CI chạy trên base mới rồi mới merge.
