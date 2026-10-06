# Baseline — deep review Phase 1–4

Đo ngày 05/10/2026 trên Home PC (`DESKTOP-KDURKJP`), worktree `C:\workspace\Project-2C-review`, code ở `2db3e1a`. **SHA ghim của đợt review: `f0c53eb`** (#347), chỉ thêm 2 file docs so với `2db3e1a` (`git diff --stat 2db3e1a f0c53eb`), code giống hệt nên số đo dưới đây áp dụng nguyên. Log đầy đủ nằm cùng thư mục.

| Hạng mục | Kết quả | Log |
|---|---|---|
| `pnpm verify` (format, lint, deps, tokens, codemap, typecheck, unit + coverage) | xanh, 80 s · 66 file test, **1 260 test** | `verify.log` |
| Coverage tổng (vùng trong `coverage.include`) | Stmts 98,62 · Branch 96,34 · Funcs 98,54 · Lines 98,91 | `verify.log` |
| Coverage theo vùng (Stmts / Branch) | db 99,35 / 97,93 · desktop/data 97,17 / 92,45 · shell 75,94 / 86,66 · appointments 99,08 / 87,64 · customers 100 / 97,18 · overview 97,7 / 91,15 · reports 100 / 93,2 · domain 100 (ngưỡng 100) | `verify.log` |
| `pnpm verify:rust` (fmt, clippy `-D warnings`, cargo test) | xanh, 24 s · **37 test Rust** | `verify-rust.log` |
| `pnpm e2e` (Playwright, Edge) | **146 passed**, 3,8 phút, không flaky trong lượt này | `e2e.log` |
| `pnpm build:web` | xanh, 0,5 s · 1 043 module | `build-web.log` |

Bundle web (`dist/assets`, trước gzip / gzip):

| Chunk | Kích thước |
|---|---|
| `index-*.js` | 743,75 KB / 220,28 KB |
| `exceljs.min-*.js` | 929,56 KB / 256,44 KB |
| `chart-*.js` | 527,11 KB / 178,51 KB |
| `sql-wasm-*.wasm` | 658,41 KB / 326,00 KB |
| `index-*.css` | 27,03 KB / 6,23 KB |

Dữ liệu (Node, Vitest, không coverage):

| Bộ | KH | Lịch hẹn | Nhân sự | HĐ | Backup | Thời gian sinh | `importBackup` |
|---|---|---|---|---|---|---|---|
| Seed demo (`seedDemoData`, neo 05/10/2026) | ≈ 1 200 | ≈ 6 000 | 36 | ≈ 1 000 | 10,5 MB | 3,7 s (3 lượt: 3 799 / 3 713 / 3 699 ms) | — |
| Dữ liệu tải (`load\`) | 1 496 | 10 434 | 51 (4 team) | 1 804 | 15,5 MB | 5,7 s | 1,5 s |

Ghi chú: ở chế độ web (không có file DB), app chạy seed demo mỗi lần mở, nên thời gian mở app web ≈ thời gian seed ở trên cộng render. Thời gian mở / render trên trình duyệt đo trong gói D / F / H nếu cần.
