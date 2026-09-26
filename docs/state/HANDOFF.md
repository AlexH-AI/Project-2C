# HANDOFF

> Cập nhật mỗi cuối phiên bằng `/handoff`. Phiên mới đọc file này đầu tiên (`/session-start`).

- **Cập nhật:** 2026-09-26 · máy `DESKTOP-KDURKJP`
- **Nhánh:** `main` @ `9f39f04` (#18, #19, #20 đã merge); không còn PR mở
- **Phase:** 1 — Nền móng (milestone #1)

## Trạng thái

| Việc | Trạng thái |
|---|---|
| #1–#6 quy tắc, skeleton, hook, skills, e2e, mockup (G3) | ✅ merge (#10–#13) |
| #8 thư viện chart → ADR-0014 (ECharts) | ✅ merge #15 |
| #7.1 tokens + font `packages/ui` | ✅ merge #16 |
| #7.2 app shell (sidebar icon, topbar, router hash, góc nhìn ở topbar) | ✅ merge #18 (`--merge`), review PASS |
| #7.3 `domain/period` + `PeriodPicker` (ô Tùy chọn dạng chữ `dd/mm/yyyy`, kỳ là state của Tổng quan) | ✅ merge #19 (`--merge`) + #20 (`--squash`), review PASS |
| #7.4 `DataTable` (TanStack, sort) | **chưa bắt đầu** |
| #7.5 `Chart` (ECharts, ADR-0014) | **chưa bắt đầu** (không còn bị chặn) |
| #17 favicon/app icon màu ADR-0013 | chưa bắt đầu, `risk:low` |
| #9 exe chạy trên cả 2 máy + `docs/metrics/phase-1.md` | **tạm hoãn** — Owner không tới văn phòng đến hết 28/09/2026; không chặn #7.4/#7.5 |

Issue #7 vẫn mở (còn 7.4, 7.5). Ghi chú review không chặn: `period.ts` dùng `Date.UTC` nên năm 0–99 bị hiểu thành 19xx — chặn năm < 1900 khi làm nhập liệu thật.

## Bước kế tiếp chính xác

1. `/session-start` (pull `main`).
2. #7.4: nhánh `task/T-007.4-datatable` từ `main`. `packages/ui/src/components/DataTable.tsx` dùng `@tanstack/react-table` (đã duyệt); bấm tiêu đề cột: không sort → ↑ → ↓, chỉ một cột sort; cột ngày `dd/mm/yyyy` sort theo thời gian (dùng `parseDate` của `@p2c/domain`, không so chuỗi); tiêu đề có `aria-sort`; mặc định ngày ↓. Test chấp nhận ở #7 mục 7.4 → e2e `e2e/data-table.spec.ts` với bảng mẫu gắn vào một màn rỗng.
3. #7.5: nhánh `task/T-007.5-chart` từ `main`: `echarts@6.1.0` qua `echarts/core`, chỉ đăng ký module dùng; theme lấy từ tokens; dispose khi rời màn (e2e chuyển màn 10 lần không lỗi console); bundle chart ≤ 250 KB gzip.
4. Mỗi phần 1 PR ≤ ~400 dòng; review ở phiên mới theo `docs/process/REVIEW-CHECKLIST.md`.
5. Dọn worktree cũ đã merge (sạch, remote đã xoá): `git worktree remove .scratch/wt-t008` rồi `git branch -D task/T-008-chart-adr`.

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

- #9 (chạy exe trên cả 2 máy) tạm hoãn: Owner không tới văn phòng 2 ngày (27–28/09/2026). Không nhắc lại trước khi Owner báo đã ở văn phòng.
- Quyết người merge #7.4 / #7.5 nếu `risk:med` (lần trước Owner cho Claude merge sau review PASS + CI xanh).

## Ghi chú môi trường

- pnpm shim ở `%APPDATA%\npm` khi không có admin; trong Git Bash shim này lỗi — chạy pnpm từ PowerShell.
- Terminal mở trước khi chạy bootstrap chưa có PATH mới → mở terminal mới.
- Bộ nhớ Claude (memory) nằm riêng từng máy và **không** đồng bộ: điều gì cần nhớ giữa 2 máy phải ghi vào `CLAUDE.md` hoặc file này.
- Lần đầu mở Claude Code ở máy mới, lịch sử hội thoại của Home PC không có sẵn — phiên mới đọc `CLAUDE.md` + file này là đủ để tiếp tục.
- Đổi base PR xếp chồng (`gh pr edit --base main`) **không** tự chạy lại CI (workflow nghe `opened/synchronize/reopened`): `gh pr close <n>` + `gh pr reopen <n>` để CI chạy trên base mới rồi mới merge.
