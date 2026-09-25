# HANDOFF

> Cập nhật mỗi cuối phiên bằng `/handoff`. Phiên mới đọc file này đầu tiên (`/session-start`).

- **Cập nhật:** 2026-09-26 (tối) · Home PC → Office Laptop
- **Nhánh:** `main` @ PR #10 đã merge (`c3b7cda`); 3 PR mở: #11, #12, #13
- **Phase:** 1 — Nền móng (milestone #1)

## Trạng thái

| Việc | Trạng thái |
|---|---|
| #1 quy tắc repo, giao thức phiên, bootstrap | ✅ merge trong #10 |
| #2 skeleton monorepo, web mode, CI build exe | ✅ merge trong #10 (exe 2,9 MB, CI xanh) |
| #3 chặn push `main` bằng hook local | ✅ merge trong #10 |
| #4 cấu hình mattpocock skills | PR #11 — CI xanh, **chưa review** |
| #5 Playwright e2e smoke + CI | PR #12 — CI xanh, **chưa review** |
| #6 mockup UI (G3) | PR #13 — **G3 đã duyệt** (26/09, 8/10), ADR-0013; `risk:med`, **chưa review** |
| #7 `packages/ui` + app shell | chưa bắt đầu — làm sau khi #13 merge |
| #8 chọn thư viện chart → ADR-0014 | chưa bắt đầu |
| #9 exe chạy trên Office Laptop + `docs/metrics/phase-1.md` | chờ Owner ở Office Laptop |

Không còn thay đổi nào chỉ nằm trên Home PC: mọi nhánh đã push, không có worktree/stash.

## Bước kế tiếp chính xác (phiên đầu tiên trên Office Laptop)

1. Dựng môi trường theo **Phương án A/B/C** bên dưới.
2. `/session-start`.
3. Review từng PR trong **phiên mới, context sạch** theo `docs/process/REVIEW-CHECKLIST.md`, merge theo thứ tự **#11 → #12 → #13** bằng `gh pr merge <n> --squash`.
   - #11 và #12 đều sửa `CLAUDE.md` (mục Agent skills / bảng Lệnh) → sau khi merge #11, #12 có thể cần `git merge main` và giải xung đột nhỏ.
   - #13 là `risk:med`: Owner merge, hoặc Owner cho phép Claude merge sau review PASS.
4. Bắt đầu #7 trên nhánh `task/T-007-ui-shell` từ `main`: chuyển tokens ADR-0013 từ `docs/design/mockups/mockups.css` sang `packages/ui`; icon sidebar, bộ chọn kỳ Ngày/Tuần/Tháng/Năm/Tùy chọn, bảng sắp xếp được là component dùng chung.

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

- Chọn phương án A/B/C khi tới văn phòng; chạy thử exe (#9).
- Quyết người merge #13 (`risk:med`).

## Ghi chú môi trường

- pnpm shim ở `%APPDATA%\npm` khi không có admin; trong Git Bash shim này lỗi — chạy pnpm từ PowerShell.
- Terminal mở trước khi chạy bootstrap chưa có PATH mới → mở terminal mới.
- Bộ nhớ Claude (memory) nằm riêng từng máy và **không** đồng bộ: điều gì cần nhớ giữa 2 máy phải ghi vào `CLAUDE.md` hoặc file này.
- Lần đầu mở Claude Code ở máy mới, lịch sử hội thoại của Home PC không có sẵn — phiên mới đọc `CLAUDE.md` + file này là đủ để tiếp tục.
