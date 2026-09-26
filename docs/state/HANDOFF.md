# HANDOFF

> Cập nhật mỗi cuối phiên bằng `/handoff`. Phiên mới đọc file này đầu tiên (`/session-start`).

- **Cập nhật:** 2026-09-26 · máy `DESKTOP-KDURKJP`
- **Nhánh:** `task/T-029-kyc-model` (PR #36 mở); `main` @ `5e82d85` (#35 đã merge)
- **Phase:** 2 — Lõi domain (milestone "Phase 2 — Lõi domain") · Phase 1 milestone **để mở** chờ test ở văn phòng

## Trạng thái

| Việc | Trạng thái |
|---|---|
| Phase 1: #1–#8, #7.1–#7.5 | ✅ merge (#10–#23); #7 đã đóng |
| #17 favicon/app icon, #9 exe 2 máy + `docs/metrics/phase-1.md` | **hoãn** — làm khi Owner ở văn phòng |
| #28 G2 golden examples chỉ số + mô hình dữ liệu (`model.ts`, `docs/golden/chi-so.md`) | ✅ merge #34 (`--squash`), review PASS, Owner duyệt G2 |
| #30 G2 danh mục KYC, ngưỡng cổng, 15 hồ sơ mẫu (`kyc-catalog.ts`, `docs/golden/kyc.md`) | ✅ merge #35 (`--squash`), Owner duyệt G2 (K09 → `PROFILE_DISCOVERY`) |
| #29 mô hình KYC: notes, facts, versions (`packages/domain/src/kyc.ts`) | PR #36 mở, `pnpm verify` xanh, Auto-fix bật — **chờ review ở phiên mới** |
| #25 nhập ngày dd/mm, #26 tiền VND (`risk:low`) · #27 state machine nhóm KH · #31, #32 stats engine · #33 cổng KYC (`risk:med`) | chưa làm |

Ghi chú không chặn: `docs/PROJECT-PLAN.md` §2.3 còn định nghĩa RF / tỉ lệ chốt cũ (ADR-0007 là nguồn đúng) — sửa ở task sau. Còn từ Phase 1: `period.ts` năm 0–99 → 19xx (chặn năm < 1900 khi làm #25); `DataTable` chưa test `sortable: false` và bảng rỗng; cột Giờ chưa `tabular-nums`.

## Chờ test ở văn phòng (Owner quyết 26/09/2026)

Tiếp tục dev trên Home PC; **không chặn Phase 2**. Milestone Phase 1 để mở cho tới khi làm xong các mục dưới trên Office Laptop:

- [ ] #9: exe (artifact CI mới nhất của `main`) chạy trên Office Laptop; kiểm các màn đã merge ở PR #18, #20, #22, #23 (sidebar, PeriodPicker, DataTable sort, Chart hiện đúng màu); ghi `docs/metrics/phase-1.md`.
- [ ] #17: favicon/app icon màu ADR-0013 — có thể code trước trên Home PC, nhưng ảnh chụp icon trong exe/taskbar để kiểm ở văn phòng.
- [ ] Sau đó: đóng milestone Phase 1 (G7).

## Bước kế tiếp chính xác

1. `/session-start` (pull `main`).
2. **Review PR #36 (#29) ở phiên mới** theo `docs/process/REVIEW-CHECKLIST.md`: đầu vào chỉ issue #29 + diff. Soi kỹ chuyển trạng thái dữ kiện trong `confirmFact` / `markConflict` / `resolveConflict` (`packages/domain/src/kyc.ts`). Ghi `REVIEW: PASS` hoặc `REVIEW: CHANGES` thành comment trên PR. `risk:med` → **chờ Owner cho merge**; được phép thì `gh pr merge 36 --squash --delete-branch`.
3. Task tiếp theo (mỗi task một phiên mới): #27 state machine nhóm KH → #31, #32 stats engine (test theo `GOLDEN_CASES` trong `packages/domain/src/golden/metrics.fixture.ts`) → #33 cổng KYC (test theo `KYC_GOLDEN_PROFILES` trong `golden/kyc.fixture.ts`). Có thể xen #25, #26 (`risk:low`, Claude tự merge khi CI xanh + review PASS).
4. Golden fixtures là test bắt buộc: **không sửa để "cho xanh"**, muốn đổi phải qua Owner (G2).

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
- PR #36 (#29, `risk:med`): Owner review ở phiên mới, rồi quyết merge.
- Cờ `material` của phiên bản KYC: hiện RE tự đánh dấu (ADR-0008 chưa định nghĩa); Owner quyết có tự động hóa không (vd. đổi trường cốt lõi → material).
- `risk:med` khác (#27, #31–#33): hỏi Owner trước khi merge, trừ khi Owner đã dặn trong phiên.

## Ghi chú môi trường

- pnpm shim ở `%APPDATA%\npm` khi không có admin; trong Git Bash shim này lỗi — chạy pnpm từ PowerShell.
- Terminal mở trước khi chạy bootstrap chưa có PATH mới → mở terminal mới.
- Bộ nhớ Claude (memory) nằm riêng từng máy và **không** đồng bộ: điều gì cần nhớ giữa 2 máy phải ghi vào `CLAUDE.md` hoặc file này.
- Lần đầu mở Claude Code ở máy mới, lịch sử hội thoại của Home PC không có sẵn — phiên mới đọc `CLAUDE.md` + file này là đủ để tiếp tục.
- Đổi base PR xếp chồng (`gh pr edit --base main`) **không** tự chạy lại CI (workflow nghe `opened/synchronize/reopened`): `gh pr close <n>` + `gh pr reopen <n>` để CI chạy trên base mới rồi mới merge.
