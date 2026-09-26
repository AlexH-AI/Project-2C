# HANDOFF

> Cập nhật mỗi cuối phiên bằng `/handoff`. Phiên mới đọc file này đầu tiên (`/session-start`).

- **Cập nhật:** 2026-09-26 · máy `DESKTOP-KDURKJP`
- **Nhánh:** `main` (sau khi merge #56, #58); không có PR mở
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
2. Phase 3 — spec: `docs/design/phase-3-du-lieu.md` (Accepted G2), ADR-0016. Mỗi issue một phiên mới. Frontier (không bị chặn):
   - **#60 T-041** nền `packages/db` (sql.js + Drizzle + migration + Team/nhân sự) — G4 dependency đã duyệt; làm TDD.
   - **#59 T-040** mockup màn nhập liệu → **dừng ở G3** chờ Owner.
3. Sau đó theo blocking edges: #61 → #62 → #64 (seed); #63 lưu file exe (sau #60); UI #65–#70 cần #59 (G3) + #63 + #64; #71 backup; #72 đóng phase (G7).
4. Ngưỡng task mới (P1, ADR-0001 phụ lục): ≤ ~400 dòng code sản phẩm, ≤ ~800 dòng tổng diff kể cả test; PR liệt kê file sinh tự động không tính.
5. Golden fixtures là test bắt buộc: **không sửa để "cho xanh"**, muốn đổi phải qua Owner (G2). #61/#62 chạy golden G01–G22, K01–K15 qua DB.
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
- GitHub Free: không bật được auto-merge cho repo private — Owner báo CI xanh (hoặc phiên sau kiểm) rồi Claude merge.

## Ghi chú môi trường

- pnpm shim ở `%APPDATA%\npm` khi không có admin; trong Git Bash shim này lỗi — chạy pnpm từ PowerShell.
- Terminal mở trước khi chạy bootstrap chưa có PATH mới → mở terminal mới.
- Bộ nhớ Claude (memory) nằm riêng từng máy và **không** đồng bộ: điều gì cần nhớ giữa 2 máy phải ghi vào `CLAUDE.md` hoặc file này.
- Lần đầu mở Claude Code ở máy mới, lịch sử hội thoại của Home PC không có sẵn — phiên mới đọc `CLAUDE.md` + file này là đủ để tiếp tục.
- Đổi base PR xếp chồng (`gh pr edit --base main`) **không** tự chạy lại CI (workflow nghe `opened/synchronize/reopened`): `gh pr close <n>` + `gh pr reopen <n>` để CI chạy trên base mới rồi mới merge.
