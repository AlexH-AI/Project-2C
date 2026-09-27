# HANDOFF

> Cập nhật mỗi cuối phiên bằng `/handoff`. Phiên mới đọc file này đầu tiên (`/session-start`).

- **Cập nhật:** 2026-09-27 · máy `DESKTOP-KDURKJP`
- **Nhánh:** `docs/review-worktree` (= `main` `8a5962a` + worktree review, kế hoạch R1–R4); không còn PR code mở
- **Phase:** 3 — Nghiệp vụ & màn hình (milestone mở 26/09/2026; G2/G1/G4 đã duyệt) · Phase 2 đã đóng · Phase 1 milestone **để mở** chờ test ở văn phòng

## Trạng thái

| Việc | Trạng thái |
|---|---|
| Phase 1: #1–#8, #7.1–#7.5 | ✅ merge (#10–#23); #7 đã đóng |
| #17 favicon/app icon, #9 exe 2 máy + `docs/metrics/phase-1.md` | **hoãn** — làm khi Owner ở văn phòng |
| #28 G2 golden examples chỉ số + mô hình dữ liệu (`model.ts`, `docs/golden/chi-so.md`) | ✅ merge #34 (`--squash`), review PASS, Owner duyệt G2 |
| #30 G2 danh mục KYC, ngưỡng cổng, 15 hồ sơ mẫu (`kyc-catalog.ts`, `docs/golden/kyc.md`) | ✅ merge #35 (`--squash`), Owner duyệt G2 (K09 → `PROFILE_DISCOVERY`) |
| #29 mô hình KYC: notes, facts, versions (`packages/domain/src/kyc.ts`) | ✅ merge #36 (`--squash`), review PASS, Owner cho merge |
| Cờ `material` phiên bản KYC → ADR-0008 §7 (Owner chốt, hướng kết hợp) | ✅ docs merge #39; code #38 merge #46 (`kycHash` băm kèm trạng thái — Owner chốt) |
| #27 state machine nhóm KH (`customer-lifecycle.ts`: `isRfTransition`, `stageOn`) + ADR-0007 KH mới vào nhóm mở | ✅ merge #41, #42 |
| #31 chỉ số HĐ theo kỳ/scope (`stats.ts`: `policyMetrics`, `inScope`) | ✅ merge #43 (`--merge`, Owner duyệt; review phiên sạch PASS ghi trên PR) |
| #32 RF + tỉ lệ chốt (`stats.ts`: `isRfAppointment`, `rfCount`, `closeRate`, `periodMetrics`); đủ G01–G22 | ✅ merge #44 (`--squash`), review PASS, Owner duyệt |
| #33 cổng KYC (`kyc-gate.ts`: `evaluateKycGate` → `KycGateResult`) + `CONTEXT.md` + `docs/metrics/phase-2.md` | ✅ merge #47 (`--squash`), review PASS (phiên sạch), Owner cho merge; 199 test, coverage 100%, K01–K15 pass lần đầu |
| #25 nhập ngày dd/mm, #26 tiền VND (`risk:low`) | ✅ merge #51, #52 (`--squash`), review PASS |
| Review đóng Phase 2 (26/09/2026) | ✅ verify xanh (279 test, coverage 100%), không lỗi; ghi chú ca biên trong `docs/metrics/phase-2.md` |
| #56 CI build exe mọi PR (ADR-0015 phụ lục) | ✅ merge (`--squash`), review PASS |
| #57 G2 mô hình dữ liệu Phase 3 + ADR-0016 (sql.js ở mọi nơi) + P1 ngưỡng task | ✅ merge #58; Owner duyệt G2/G1/G4 + P1 |
| Issue Phase 3 #59–#72 (T-040…T-053) | ✅ tạo, có blocking edges |
| #60 T-041 nền `packages/db`; T-042a schema, T-042b KH + transition | ✅ merge #74, #76, #77 |
| T-042c lịch hẹn + kết quả, T-042d HĐ + golden G01–G22 qua DB | ✅ merge #78, #79; #61 đã đóng |
| #62 T-043 KYC qua DB (3 PR xếp chồng: T-043a bảng + ghi chú, T-043b lệnh dữ kiện + phiên bản, T-043c hồ sơ KH D2 + golden K01–K15) | ✅ merge #85, #84 (`--merge`), #83 (`--squash`); review phiên sạch PASS cả 3, Owner cho merge 27/09; #62 đã đóng |
| #63 T-044 lưu file DB cạnh exe (`Project2C-data\`) + backup khởi động (giữ 10), lệnh Tauri async, hàng đợi lưu tuần tự | ✅ merge #87 (`--squash`, 27/09); 3 vòng review (CHANGES → PASS kèm ghi chú → PASS), vòng sửa thêm N1/N3 + M1 Owner duyệt (G8); tách nối tiếp #88 CI Rust, #89 chặn 2 exe, #90 dọn backup theo mtime, #91 không mất dữ liệu khi đóng app lúc lưu lỗi |
| #59 T-040 mockup màn nhập liệu (G3, Owner duyệt 2 vòng) | ✅ merge #75; review sau merge phiên sạch: CHANGES → sửa ở #81 (Owner duyệt, merge `b04f520`) |
| D9 `appointments.outcome_reviewer_id` (G2 bổ sung) | ✅ merge #80; review sau merge: PASS kèm ghi chú; D7 "khóa 3 ô" ghi vào spec ở #81 |
| Body issue #68, #69 cập nhật theo mockup G3 + D9 (Owner đồng ý 27/09) | ✅ #69 thêm `packages/db/**`, test D9, migration có dữ liệu, "Hẹn lần tiếp theo" 1 transaction; #68 thêm trigger bắt buộc, gợi ý năm sau, "Tạo lịch hẹn tiếp theo" (từ hôm nay trở đi), "Các lần hẹn trước" |
| #64 T-045 seed (T-045a dữ liệu, T-045b KYC 4 trạng thái cổng, T-045c nạp lần đầu + "Nạp lại…" trong Cài đặt, lệnh Rust `db_backup`) | ✅ merge #94, #95, #96 (`--squash`, 27/09); #96 review mức high (nâng từ med vì `src-tauri`) PASS kèm ghi chú, kiểm tay exe đạt; #64 đã đóng |
| ADR-0017 review theo mức risk, skill `review-pr` | ✅ merge #97; phụ lục (27/09, G1): worktree review cố định + kế hoạch review toàn bộ R1–R4 |

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
2. **Review toàn bộ R1–R4** (Owner duyệt 27/09, ADR-0017 phụ lục §3): mỗi đợt một phiên sạch trong worktree `.claude\worktrees\review-main` (`git checkout --detach origin/main`), Spec + Standards + `code-review high` cho cả vùng, kết quả ghi vào một Issue review, bug tách task riêng. Bắt đầu **R1 `packages/db/**`**, rồi R2 (`apps/desktop/src/data/**` + `src-tauri/**`). R1, R2 xong trước T-046 (màn đầu tiên ghi DB); R3 (`packages/domain`), R4 (UI, `packages/ui`, script/CI/hook) chạy song song với UI.
3. Phase 3 — spec: `docs/design/phase-3-du-lieu.md` (Accepted G2), ADR-0016. Mỗi issue một phiên mới. Frontier (không bị chặn):
   - UI #65–#70 (G3, #63, #64 đã xong); màn ghi DB đầu tiên chờ R1, R2.
   - Nối tiếp T-044: #88 CI Rust, #89 chặn 2 exe, #90 dọn backup theo mtime, #91 đóng app khi lưu lỗi — Owner xếp thứ tự.
   - **#69 T-050**: migration mới thêm `outcome_reviewer_id` — CHECK cấp bảng trên SQLite có thể khiến drizzle-kit dựng lại bảng `appointments`; kiểm SQL sinh ra + test migrate DB có dữ liệu (review #80).
4. Sau đó theo blocking edges: #71 backup; #72 đóng phase (G7).
5. Ngưỡng task mới (P1, ADR-0001 phụ lục): ≤ ~400 dòng code sản phẩm, ≤ ~800 dòng tổng diff kể cả test; PR liệt kê file sinh tự động không tính.
6. Golden fixtures là test bắt buộc: **không sửa để "cho xanh"**, muốn đổi phải qua Owner (G2). #61/#62 chạy golden G01–G22, K01–K15 qua DB.

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
- Worktree review (ADR-0017 phụ lục), tạo một lần: `git worktree add --detach .claude/worktrees/review-main origin/main`, rồi `pnpm install --frozen-lockfile` trong thư mục đó. Phiên review mở tại `C:\workspace\Project-2C\.claude\worktrees\review-main`.

### Phương án B — máy công ty không có quyền admin / chặn winget

Chỉ cần **Git + Node 24 + pnpm** (không cần Rust/Build Tools):

- Node 24: bản cài không cần admin (zip từ nodejs.org, thêm vào PATH người dùng) hoặc `winget install OpenJS.NodeJS.LTS --scope user` nếu được phép.
- pnpm: `corepack enable pnpm --install-directory "$env:APPDATA\npm"`.
- `pnpm install` → làm được mọi việc của #7/#8: `pnpm verify`, `pnpm dev:web`, `pnpm e2e` (dùng Microsoft Edge có sẵn).
- Exe: tải từ GitHub Actions (run mới nhất trên `main` → artifact `Project-2C-<sha>`). CI vẫn build exe cho mọi PR.

### Phương án C — không cài được gì

Dùng **Claude Code trên web** (claude.ai/code) gắn repo `AlexH-AI/Project-2C`: code, test, PR chạy trên cloud; CI build exe; laptop chỉ cần trình duyệt. Không chạy được `.ps1`/hook local — quy tắc "không push thẳng `main`" do Claude tuân thủ (CLAUDE.md).

## Chờ Owner

- #9 và #17: hoãn tới khi Owner ở văn phòng (xem "Chờ test ở văn phòng"). Không nhắc lại trước khi Owner báo đã ở văn phòng.
- GitHub Free: không bật được auto-merge cho repo private — Owner báo CI xanh (hoặc phiên sau kiểm) rồi Claude merge.

## Ghi chú môi trường

- pnpm shim ở `%APPDATA%\npm` khi không có admin; trong Git Bash shim này lỗi — chạy pnpm từ PowerShell.
- Terminal mở trước khi chạy bootstrap chưa có PATH mới → mở terminal mới.
- Bộ nhớ Claude (memory) nằm riêng từng máy và **không** đồng bộ: điều gì cần nhớ giữa 2 máy phải ghi vào `CLAUDE.md` hoặc file này.
- Lần đầu mở Claude Code ở máy mới, lịch sử hội thoại của Home PC không có sẵn — phiên mới đọc `CLAUDE.md` + file này là đủ để tiếp tục.
- Đổi base PR xếp chồng (`gh pr edit --base main`) **không** tự chạy lại CI (workflow nghe `opened/synchronize/reopened`): `gh pr close <n>` + `gh pr reopen <n>` để CI chạy trên base mới rồi mới merge.
