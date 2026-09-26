# HANDOFF

> Cập nhật mỗi cuối phiên bằng `/handoff`. Phiên mới đọc file này đầu tiên (`/session-start`).

- **Cập nhật:** 2026-09-26 · máy `DESKTOP-KDURKJP`
- **Nhánh:** `main` @ `b9dd147` (#41–#44 đã merge); handoff này đi qua nhánh `wip/…` + PR docs
- **Phase:** 2 — Lõi domain (milestone "Phase 2 — Lõi domain") · Phase 1 milestone **để mở** chờ test ở văn phòng

## Trạng thái

| Việc | Trạng thái |
|---|---|
| Phase 1: #1–#8, #7.1–#7.5 | ✅ merge (#10–#23); #7 đã đóng |
| #17 favicon/app icon, #9 exe 2 máy + `docs/metrics/phase-1.md` | **hoãn** — làm khi Owner ở văn phòng |
| #28 G2 golden examples chỉ số + mô hình dữ liệu (`model.ts`, `docs/golden/chi-so.md`) | ✅ merge #34 (`--squash`), review PASS, Owner duyệt G2 |
| #30 G2 danh mục KYC, ngưỡng cổng, 15 hồ sơ mẫu (`kyc-catalog.ts`, `docs/golden/kyc.md`) | ✅ merge #35 (`--squash`), Owner duyệt G2 (K09 → `PROFILE_DISCOVERY`) |
| #29 mô hình KYC: notes, facts, versions (`packages/domain/src/kyc.ts`) | ✅ merge #36 (`--squash`), review PASS, Owner cho merge |
| Cờ `material` phiên bản KYC → ADR-0008 §7 (Owner chốt, hướng kết hợp) | ✅ docs merge #39; code ở #38 (`risk:med`, chưa làm) |
| #27 state machine nhóm KH (`customer-lifecycle.ts`: `isRfTransition`, `stageOn`) + ADR-0007 KH mới vào nhóm mở | ✅ merge #41, #42 |
| #31 chỉ số HĐ theo kỳ/scope (`stats.ts`: `policyMetrics`, `inScope`) | ✅ merge #43 (`--merge`, Owner duyệt; chưa có review phiên sạch) |
| #32 RF + tỉ lệ chốt (`stats.ts`: `isRfAppointment`, `rfCount`, `closeRate`, `periodMetrics`); đủ G01–G22 | ✅ merge #44 (`--squash`), review PASS, Owner duyệt |
| #25 nhập ngày dd/mm, #26 tiền VND (`risk:low`) · #33 cổng KYC · #38 cờ material (`risk:med`) | chưa làm |

Ghi chú review #44 (không chặn): `isRfAppointment` dựa vào `StageTransition.appointmentId`, không dựa vào `appointment.stageAfter` → tầng db/UI phải luôn tạo transition gắn `appointmentId` khi ghi "nhóm sau cuộc gặp". Tên test `stats-rf.test.ts:106` nên đổi thành "does not count an appointment that was not met".

Ghi chú review #36 (không chặn, xử lý khi làm #38): nhánh `false` của `current.includes` trong `markConflict` (`kyc.ts:91`) chưa có test; "mới nhất" theo thứ tự thao tác, không theo `confirmedDate`; lớp nhập liệu cần chuẩn hóa kiểu giá trị theo trường.

Ghi chú khác: `docs/PROJECT-PLAN.md` §2.3 còn định nghĩa RF / tỉ lệ chốt cũ (ADR-0007 là nguồn đúng) — sửa ở task sau. Còn từ Phase 1: `period.ts` năm 0–99 → 19xx (chặn năm < 1900 khi làm #25); `DataTable` chưa test `sortable: false` và bảng rỗng; cột Giờ chưa `tabular-nums`.

## Chờ test ở văn phòng (Owner quyết 26/09/2026)

Tiếp tục dev trên Home PC; **không chặn Phase 2**. Milestone Phase 1 để mở cho tới khi làm xong các mục dưới trên Office Laptop:

- [ ] #9: exe (artifact CI mới nhất của `main`) chạy trên Office Laptop; kiểm các màn đã merge ở PR #18, #20, #22, #23 (sidebar, PeriodPicker, DataTable sort, Chart hiện đúng màu); ghi `docs/metrics/phase-1.md`.
- [ ] #17: favicon/app icon màu ADR-0013 — có thể code trước trên Home PC, nhưng ảnh chụp icon trong exe/taskbar để kiểm ở văn phòng.
- [ ] Sau đó: đóng milestone Phase 1 (G7).

## Bước kế tiếp chính xác

1. `/session-start` (pull `main`).
2. Nếu PR handoff (`wip/…`, docs) còn mở và CI xanh → `gh pr merge <n> --squash --delete-branch`.
3. **#38 cờ material** (phiên mới): nhánh `task/T-038-kyc-material` từ `main`, đọc `gh issue view 38` + ADR-0008 §7, TDD trong `packages/domain/src/kyc.ts` (`isMaterialChange`, `nextKycVersion(..., manualMaterial)`); kèm test nhánh `false` của `markConflict` (ghi chú review #36). `pnpm verify`, PR `risk:med` → review phiên mới → chờ Owner merge.
4. Sau đó (mỗi task một phiên mới): #33 cổng KYC (test theo `KYC_GOLDEN_PROFILES` trong `golden/kyc.fixture.ts`). Có thể xen #25, #26 (`risk:low`, Claude tự merge khi CI xanh + review PASS).
5. Golden fixtures là test bắt buộc: **không sửa để "cho xanh"**, muốn đổi phải qua Owner (G2).

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
- `risk:med` (#33, #38): hỏi Owner trước khi merge, trừ khi Owner đã dặn trong phiên.
- GitHub Free: không bật được auto-merge cho repo private — Owner báo CI xanh (hoặc phiên sau kiểm) rồi Claude merge.

## Ghi chú môi trường

- pnpm shim ở `%APPDATA%\npm` khi không có admin; trong Git Bash shim này lỗi — chạy pnpm từ PowerShell.
- Terminal mở trước khi chạy bootstrap chưa có PATH mới → mở terminal mới.
- Bộ nhớ Claude (memory) nằm riêng từng máy và **không** đồng bộ: điều gì cần nhớ giữa 2 máy phải ghi vào `CLAUDE.md` hoặc file này.
- Lần đầu mở Claude Code ở máy mới, lịch sử hội thoại của Home PC không có sẵn — phiên mới đọc `CLAUDE.md` + file này là đủ để tiếp tục.
- Đổi base PR xếp chồng (`gh pr edit --base main`) **không** tự chạy lại CI (workflow nghe `opened/synchronize/reopened`): `gh pr close <n>` + `gh pr reopen <n>` để CI chạy trên base mới rồi mới merge.
