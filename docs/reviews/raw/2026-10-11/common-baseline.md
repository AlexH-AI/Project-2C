# Baseline — review lại Phase 5 (vòng 2)

**SHA ghim: `705ea7c`** (`main` sau #505, 11/10/2026). Đo trên worktree `C:\workspace\Project-2C-review`, Home PC `DESKTOP-KDURKJP`, 11/10. Log cùng thư mục: `verify.log`, `verify-rust.log`, `e2e.log`, `build-web.log`.

Diff sửa `0df3606..705ea7c` ngoài `docs/` và lockfile: 61 file, +2 557 / −399. Trong đó `apps/desktop/src` 34 file +1 165 / −211 · `apps/desktop/src-tauri` (`ai.rs`) +611 / −98 · `packages` 16 file +400 / −71 · `e2e` 3 file +318 / −4 · còn lại CI / tools / `CLAUDE.md`. PR: #496–#499, #501–#505 (Issue #482–#487, #489, #490, #500).

| Hạng mục | `705ea7c` | Vòng 1 (`0df3606`) |
|---|---|---|
| `pnpm verify` | xanh · 103 file test, **2 215 test** · `lint:deps` 0 vi phạm (299 module, 1 168 phụ thuộc) | 102 file, 2 152 test · 297 module, 1 156 |
| Coverage tổng | Stmts 98,9 · Branch 97,43 · Funcs 98,87 · Lines 99,14 | 98,89 · 97,43 · 98,86 · 99,13 |
| `pnpm verify:rust` | xanh · **85 test Rust** | 73 |
| `pnpm e2e` (`CI=1`, Edge) | **188 passed**, 1,9 phút | 182, 1,6 phút |
| `pnpm build:web` | xanh · 1 088 module | 1 087 |

Bundle web (trước gzip / gzip):

| Chunk | `705ea7c` | `0df3606` |
|---|---|---|
| `index-*.js` | 862,23 KB / 256,00 KB | 857,21 / 254,47 |
| `exceljs.min-*.js` | 929,56 KB / 256,44 KB | như cũ |
| `chart-*.js` | 513,30 KB / 173,98 KB | như cũ |
| `sql-wasm-*.wasm` | 658,41 KB / 326,00 KB | như cũ |
| `index-*.css` | 28,03 KB / 6,41 KB | như cũ |

Exe chưa build lại ở `705ea7c` (CI của PR #503 có nhãn `build-exe`). Dữ liệu: seed demo (`seedDemoData`); không dựng sẵn dữ liệu tải — bên nào cần tự sinh trong thư mục của mình và ghi cách sinh vào phụ lục.
