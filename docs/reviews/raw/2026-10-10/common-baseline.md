# Baseline — deep review Phase 5

**SHA ghim: `0df3606`** (`main` sau #480, 10/10/2026). So với `2b4f43d` chỉ đổi 3 file docs (`docs/metrics/phase-5.md`, `docs/state/review-notes.md`, `docs/PROJECT-STATE.md`), code giống hệt, nên số đo của `docs/metrics/phase-5.md` (đo trên `2b4f43d`, Home PC `DESKTOP-KDURKJP`, 10/10) dùng nguyên.

Phạm vi Phase 5: diff `3e84ce8..0df3606` (`3e84ce8` = bản phát hành Phase 4). Ngoài `docs/` và lockfile: ≈ 13 000 dòng, trong đó `apps/desktop/src` ≈ 5 500, `packages/ai/src` ≈ 4 200, `packages/db/src` ≈ 1 800, `apps/desktop/src-tauri` ≈ 1 100, `tools/eval-ai*` ≈ 1 300, e2e AI ≈ 1 000; `packages/db/migrations` ≈ 5 100 (snapshot sinh tự động).

| Hạng mục | Kết quả |
|---|---|
| `pnpm verify` | xanh · 102 file test, **2 152 test** · `lint:deps` 0 vi phạm (297 module, 1 156 phụ thuộc) |
| Coverage tổng | Stmts 98,89 · Branch 97,43 · Funcs 98,86 · Lines 99,13 |
| Coverage theo vùng | `domain` 100 · `ai` 100 (ngưỡng 100) · db 99,45 / 98,64 / 100 / 99,76 · desktop/data 97,59 / 94,3 · customers 98,47 / 97 · shell 80 (`useRoute.ts` 0%) |
| `pnpm verify:rust` | xanh · **73 test Rust** |
| `pnpm e2e` (`CI=1`, Edge) | **182 passed**, 0 flaky, 1,6 phút |
| Exe release (`pnpm build:exe`) | `project2c.exe` 5 395 968 byte (Phase 4: 4 179 968); artifact CI `d9d9282` zip 3 106 113 byte |
| `pnpm build:web` (log `build-web.log`, đo trên worktree review) | xanh, 3,0 s · 1 087 module |

Bundle web (`dist/assets`, trước gzip / gzip):

| Chunk | Kích thước | Phase 4 (`f0c53eb`) |
|---|---|---|
| `index-*.js` | 857,21 KB / 254,47 KB | 743,75 / 220,28 |
| `exceljs.min-*.js` | 929,56 KB / 256,44 KB | như cũ |
| `chart-*.js` | 513,30 KB / 173,98 KB | 527,11 / 178,51 |
| `sql-wasm-*.wasm` | 658,41 KB / 326,00 KB | như cũ |
| `index-*.css` | 28,03 KB / 6,41 KB | 27,03 / 6,23 |

Eval AI thật (10/10, `docs/metrics/ai-eval-2026-10-10.md`): A1 19/20, R1 0 vi phạm, X 5/5.

Dữ liệu: seed demo (`seedDemoData`, ≈ 1 200 KH / 6 000 lịch hẹn / 36 nhân sự, có `ai_analyses` mẫu). **Không dựng sẵn dữ liệu tải cho đợt này**; bên nào cần đo hiệu năng (vd. lịch sử phân tích dài, nhiều phiên bản KYC) tự sinh trong thư mục của mình qua lệnh nghiệp vụ, ghi cách sinh vào phụ lục báo cáo.
