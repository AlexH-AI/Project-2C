# Chỉ số cuối phase

Mỗi phase ghi `phase-<N>.md` theo bảng chỉ số của `docs/COMPARISON.md` (giống hệt ở hai repo, không sửa riêng ở 2C). Lấy mẫu từ file của phase trước (`phase-3.md`).

## Bổ sung riêng của 2C: điều hướng repo

Ngoài bảng của `COMPARISON.md`, từ **Phase 4** `phase-<N>.md` thêm một mục "Điều hướng" với các chỉ số dưới. Mục này chỉ có ở 2C (retro điều hướng #280, đợt 3 #289), không dùng để so với Project-2. Số liệu gốc của retro #280 (trước đợt 1–3): 6–19 lệnh dò trước lần sửa đầu, context ~62k token ở lượt đầu, 41/175 PR chỉ để sửa HANDOFF.

| Chỉ số | Mục tiêu | Đo bằng |
|---|---|---|
| Số lệnh dò trước lần sửa file đầu tiên (trung vị phiên task) | **≤ 5** | `node tools/retro.mjs`, cột `probes<edit` |
| Context ở lượt 3 (token input + cache của lần gọi API thứ 3) | Theo dõi, không có ngưỡng: so giữa các phase | `node tools/retro.mjs`, cột `ctx@3` |
| Số lần dò sai đường (đọc file / thư mục không tồn tại) | Theo dõi, càng gần 0 càng tốt | `node tools/retro.mjs`, cột `wrong` |
| Số lần nạp HANDOFF mỗi phiên | **1 lần** (hook `SessionStart`), không đọc lại | `node tools/retro.mjs`, cột `handoff` |
| Độ dài HANDOFF | **< 10.000 ký tự** (mục tiêu 8.000; `handoff.mjs write` chặn ở 9.000) | `gh issue list --label handoff --json body --jq '.[0].body \| length'` |
| PR chỉ để sửa HANDOFF | **0** (HANDOFF là Issue ghim từ #283) | `gh pr list --state merged --limit 300 --json number,files --jq '[.[] \| select(.files \| map(.path) == ["docs/state/HANDOFF.md"]) \| .number]'` |

### `tools/retro.mjs`

```
node tools/retro.mjs [--last N]
```

- Đọc transcript Claude Code **của máy đang chạy** (`~/.claude/projects/<thư mục repo>*/*.jsonl`: checkout chính, worktree review `Project-2C-review*`, worktree của Claude). Transcript không đồng bộ giữa hai máy → chạy ở cả Home PC và Office Laptop, ghi tên máy (dòng đầu output) cạnh số liệu.
- In tối đa 30 phiên gần nhất (`--last N` để ít hơn) + dòng trung vị theo loại phiên. Chỉ in số đếm, 8 ký tự đầu của id phiên và ngày, không in nội dung hội thoại.
- Phân loại: phiên **review** khi chạy trong `Project-2C-review*` hoặc mở bằng "review PR"; còn lại là **task**. Chỉ tiêu "dò ≤ 5" xét trung vị phiên task.
- Cách đếm (heuristic, logic ở `tools/retro-core.mjs`):
  - **dò** = `Read` / `Grep` / `Glob`, hoặc lệnh Bash / PowerShell mở đầu bằng lệnh đọc / tìm (`cat`, `grep`, `ls`, `Get-Content`, `git log` / `diff` / `show`…); `—` khi phiên không sửa file nào;
  - **dò sai đường** = lệnh dò có kết quả lỗi "does not exist" / "No such file" / "Cannot find path";
  - **HANDOFF** = output hook `SessionStart` có HANDOFF + lệnh `node tools/handoff.mjs read` / đọc `HANDOFF.md`;
  - dòng jsonl hỏng hoặc thiếu trường bị bỏ qua; phiên con (sidechain) không tính.
