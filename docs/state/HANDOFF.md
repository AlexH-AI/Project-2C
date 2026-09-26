# HANDOFF

> Cập nhật mỗi cuối phiên bằng `/handoff`. Phiên mới đọc file này đầu tiên (`/session-start`).

- **Cập nhật:** 2026-09-26 · máy `DESKTOP-KDURKJP`
- **Nhánh:** `main` @ `2cbd0c9` (#22 đã merge); PR mở: #23 (T-007.5 Chart, chờ review phiên mới)
- **Phase:** 1 — Nền móng (milestone #1, **để mở** chờ test ở văn phòng) · dev tiếp Phase 2 trên Home PC

## Trạng thái

| Việc | Trạng thái |
|---|---|
| #1–#6 quy tắc, skeleton, hook, skills, e2e, mockup (G3) | ✅ merge (#10–#13) |
| #8 thư viện chart → ADR-0014 (ECharts) | ✅ merge #15 |
| #7.1 tokens + font `packages/ui` | ✅ merge #16 |
| #7.2 app shell (sidebar icon, topbar, router hash, góc nhìn ở topbar) | ✅ merge #18 (`--merge`), review PASS |
| #7.3 `domain/period` + `PeriodPicker` (ô Tùy chọn dạng chữ `dd/mm/yyyy`, kỳ là state của Tổng quan) | ✅ merge #19 (`--merge`) + #20 (`--squash`), review PASS |
| #7.4 `DataTable` (TanStack, sort) | ✅ merge #22 (`--squash`), review PASS |
| #7.5 `Chart` (ECharts, ADR-0014) | PR #23 mở, CI + e2e local xanh (chunk chart 174 KB gzip) — **chờ review ở phiên mới** |
| #17 favicon/app icon màu ADR-0013 | **hoãn** — làm/kiểm khi Owner ở văn phòng (xem "Chờ test ở văn phòng") |
| #9 exe chạy trên cả 2 máy + `docs/metrics/phase-1.md` | **hoãn** — làm khi Owner ở văn phòng |

Merge xong #23 thì đóng #7. Ghi chú review không chặn: `period.ts` dùng `Date.UTC` nên năm 0–99 bị hiểu thành 19xx — chặn năm < 1900 khi làm nhập liệu thật; `DataTable` chưa có test cho `sortable: false` và bảng rỗng; cột Giờ chưa `tabular-nums`.

## Chờ test ở văn phòng (Owner quyết 26/09/2026)

Tiếp tục dev trên Home PC; **không chặn Phase 2**. Milestone Phase 1 để mở cho tới khi làm xong các mục dưới trên Office Laptop:

- [ ] #9: exe (artifact CI mới nhất của `main`) chạy trên Office Laptop; kiểm các màn đã merge ở PR #18, #20, #22, #23 (sidebar, PeriodPicker, DataTable sort, Chart hiện đúng màu); ghi `docs/metrics/phase-1.md`.
- [ ] #17: favicon/app icon màu ADR-0013 — có thể code trước trên Home PC, nhưng ảnh chụp icon trong exe/taskbar để kiểm ở văn phòng.
- [ ] Sau đó: đóng milestone Phase 1 (G7).

## Bước kế tiếp chính xác

1. `/session-start` (pull `main`).
2. Review PR #23 ở phiên mới theo `docs/process/REVIEW-CHECKLIST.md`; PASS + CI xanh → merge `--squash`, đóng #7.
3. Phase 2 — Lõi domain (`docs/PROJECT-PLAN.md` §5): tạo milestone "Phase 2 — Lõi domain" và cắt issue bằng `to-tickets` (state machine, stats engine + golden tests, parse ngày/tiền, mô hình KYC, cổng KYC). Golden examples cần Owner duyệt (**G2**).
4. Dọn worktree cũ đã merge (sạch, remote đã xoá): `git worktree remove .scratch/wt-t008` rồi `git branch -D task/T-008-chart-adr`.

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
- #23 (`risk:med`): #22 Owner cho Claude merge sau review PASS + CI xanh; với #23 hỏi lại nếu Owner chưa dặn.
- G2: golden examples cho stats engine Phase 2.

## Ghi chú môi trường

- pnpm shim ở `%APPDATA%\npm` khi không có admin; trong Git Bash shim này lỗi — chạy pnpm từ PowerShell.
- Terminal mở trước khi chạy bootstrap chưa có PATH mới → mở terminal mới.
- Bộ nhớ Claude (memory) nằm riêng từng máy và **không** đồng bộ: điều gì cần nhớ giữa 2 máy phải ghi vào `CLAUDE.md` hoặc file này.
- Lần đầu mở Claude Code ở máy mới, lịch sử hội thoại của Home PC không có sẵn — phiên mới đọc `CLAUDE.md` + file này là đủ để tiếp tục.
- Đổi base PR xếp chồng (`gh pr edit --base main`) **không** tự chạy lại CI (workflow nghe `opened/synchronize/reopened`): `gh pr close <n>` + `gh pr reopen <n>` để CI chạy trên base mới rồi mới merge.
