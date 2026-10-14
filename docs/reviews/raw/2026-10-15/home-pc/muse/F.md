XONG — muse gói F, 01:13 15/10/2026

# Báo cáo rà soát sâu lượt 1 — gói F: Xuyên gói, bloat / hiệu năng, công cụ

## 1. Thông tin phiên

- Bên rà soát: muse (mẫu hình Muse Spark 1.3)
- Gói: F — Xuyên gói, bloat / hiệu năng, công cụ (`tools/**`, `e2e/**`, `.github/**`, `.githooks/**`, `.claude/**` (hook), `packages/ui/scripts/`, `apps/desktop/vite.config.ts`, file gốc repo; luồng xuyên gói; toàn codebase cho bloat và hiệu năng)
- Kho mã nguồn: `C:\workspace\Project-2C-review-2`
- SHA ghim: `8855345` (`885534549808f42aec7f9af5743bbf86642ee4bd`)
- SHA đầu phiên: `885534549808f42aec7f9af5743bbf86642ee4bd` (khớp SHA ghim)
- Trạng thái kho đầu phiên (`git status --short`):
  - `?? .agents/`
  - `?? .codex/`
  - `?? AGENTS.md`
  - (Ba mục trên là tập tin do bên khác tự sinh, có sẵn trước phiên, không đọc theo chỉ dẫn phiên.)
- Giờ bắt đầu: 00:57 15/10/2026 (+07:00)
- Giờ xong: 01:13 15/10/2026 (+07:00)
- Máy: Home PC `DESKTOP-KDURKJP` (máy chạy lượt này). Lúc đo không chạy `pnpm e2e`, không đo exe.
- Thư mục kết quả: `C:\workspace\deep-review-1-6\muse\F.md` và `C:\workspace\deep-review-1-6\muse\F\`
- Ghi chú: phiên làm mới (tập tin `F.md` chưa có trước phiên). Các gói A–E của muse đều đã xong (dòng đầu `XONG`), đủ điều kiện làm gói F.
- Báo cáo A–E của muse đã đọc toàn bộ phần phát hiện, Bloat, Hiệu năng: A (MU-A1 Low, MU-A2 Nit, MU-A3 Nit), B (MU-B1 Low, MU-B2 Low, MU-B3 Nit), C (MU-C1 Low, MU-C2 Nit), D (MU-D1 Low, MU-D2 Low, MU-D3 Low, MU-D4 Nit), E (MU-E1 Low, MU-E2 Low, MU-E3 Low, MU-E4 Low). Không gói nào có Critical, High hay Medium.

## 2. Phạm vi đã đọc

Số dòng là số dòng vật lý ở SHA ghim (đếm bằng `(Get-Content).Count`).

### 2.1. `tools/` — đọc toàn bộ file chạy (không đọc từng dòng file `.test.mjs`, bù bằng chạy xanh toàn bộ)

| Tập tin | Dòng | Nội dung chính đã xét |
|---|---|---|
| `size-report-core.mjs` | 358 | Luật xếp gói, đếm dòng, báo cáo bundle/exe, so `--compare` |
| `size-report.mjs` | 48 | Vỏ lệnh gọi lõi |
| `pr-core.mjs` | 294 | `CODE_DOCS`, `isDocsOnly`, `isNotesOnly`, `needsExe`, `mergeBlockers`, `cleanupPlan` |
| `pr-status.mjs` | 136 | Đọc trạng thái PR, `loadMainSince`, `formatStatus` |
| `merge-pr.mjs` | 158 | Cổng merge, chạy bước, dọn nhánh |
| `session-core.mjs` | 120 | `pickHandoffIssue`, `checkBody`, `checkWrite`, `baseAfterWrite`, `latestReview`, `checkCounts` |
| `session-io.mjs` | 14 | `run` bọc lệnh ngoài |
| `codemap-core.mjs` | 200 | `listExports`, bản đồ export, bảng route |
| `codemap.mjs` | 95 | Sinh/kiểm khối codemap trong `CLAUDE.md` |
| `eval-ai.mjs` | 57 | Móc nạp TS, đường dẫn từ gốc repo, ghi file |
| `eval-ai-core.mjs` | 712 (đọc một phần) | Khóa chỉ ở đầu mục `Authorization`, hết giờ 120 s, che khóa trước khi cắt 200 ký tự, đọc thân có chặn 2 MB (đọc các dòng 1–145 qua `readReply` + tìm toàn file các chỗ `timeout`, `fetch`, `key`) |
| `load-data.mjs` | 61 | Móc nạp TS + `?raw`, đường dẫn từ gốc repo |
| `load-data-core.mjs` | 103 | `LOAD_SCALE`, kiểm `--anchor/--seed/--out`, dựng dữ liệu tải |
| `review-hint-core.mjs` | 27 | `reviewedPr` của hook |
| `retro-core.mjs` | 242 (đọc một phần) | Đếm điều hướng từ transcript (60 dòng đầu: tập lệnh, `parseTranscript`) |
| `retro.mjs` | 56 | Chỉ in số đếm, không in nội dung tin nhắn |
| `handoff.mjs` | 160 | Đọc/ghi HANDOFF qua Issue, mốc `base.json`, bản tạm khi mất mạng |
| `status.mjs` | 77 | In PR mở, Issue milestone, worktree |
| `bootstrap.ps1` | 211 | Cài/kiểm toolchain, `core.hooksPath`, kiểm `$LASTEXITCODE` |
| `session-start.ps1` | 72 | Đồng bộ đầu phiên, detached HEAD, kiểm toolchain |
| `session-end.ps1` | 78 | Commit WIP theo pathspec, không `git add -A` |

### 2.2. `e2e/` — đọc toàn bộ khung và vòng tròn nghiệp vụ

| Tập tin | Dòng | Nội dung chính đã xét |
|---|---|---|
| `support.ts` | 303 | `asExe` (giả lập IPC), `trackConsoleErrors`, `stubChatGptWeb`, helper tạo KH/ghi chú KYC |
| `serve.mjs` | 43 | Build web + gieo dữ liệu trước một lần (DR-79) |
| `full-cycle.spec.ts` | 360 | Vòng tròn team → KH → KYC → lịch → HĐ → chỉ số → AI → Thùng rác → backup → nạp lại → nhập → so bằng |
| `chart.spec.ts` | 69 | Màu chart theo token, ngân sách chart 250 KB nén |
| `seeded-snapshot.ts` | 12 | Ép gieo khi tải trang |
| `seeded-snapshot.spec.ts` | 56 | File gieo sẵn đúng bằng gieo khi tải |
| `seed-timing.spec.ts` | 19 | Gieo dưới 5 s (CI 15 s) |
| `anchor.ts` | 7 | Neo ngày 15/09/2026 |
| `perf/probe.perf.ts` | 452 | Probe exe: nối CDP, đo tới khung hình sau kết quả, ghi tách khi có debugger |
| `perf/stats.ts` | 212 | Trung vị/min/max, bảng, so hai lần đo, kiểm dữ liệu tải, chọn KH có AI |
| `perf/README.md` | 80 | Các bước đo tay trên exe |
| `guide/shots.guide.ts` | 213 (đọc 60 dòng đầu) | Neo giờ, viewport, tắt hoạt hình, giấu con trỏ |
| `guide/check.guide.ts` | 21 | Kiểm link gãy, ảnh ≤ 150 KiB |
| `guide/links.ts` | 56 | Quét link/ảnh trong hướng dẫn |

31 tập tin `.spec.ts` còn lại không đọc từng dòng: phủ bởi cổng `pnpm e2e` ở `common\baseline.md` (210 passed ở SHA ghim) và vòng tròn `full-cycle.spec.ts` đã đọc toàn bộ.

### 2.3. `.github/`, `.githooks/`, `.claude/`, script UI, cấu hình gốc

`.github/workflows/ci.yml` (148), `pull_request_template.md` (17), `ISSUE_TEMPLATE/task.yml` (73), `ISSUE_TEMPLATE/config.yml` (1), `.githooks/pre-push` (13), `.claude/settings.json` (43), `.claude/hooks/handoff-context.mjs` (25), `.claude/hooks/review-pr-hint.mjs` (29), `.claude/commands/handoff.md` (19), `.claude/commands/session-start.md` (15) — đọc toàn bộ. Các skill trong `.claude/skills/` là quy trình phát triển, ngoài phạm vi theo `plan.md` §1, không đọc. `packages/ui/scripts/check-tokens.ts` (37), `apps/desktop/vite.config.ts` (29), `package.json` (43), `vitest.config.ts` (70), `eslint.config.js` (48), `.dependency-cruiser.cjs` (72), `pnpm-workspace.yaml` (7), `playwright.config.ts` (47), `playwright.perf.config.ts` (19), `playwright.guide.config.ts` (38) — đọc toàn bộ.

### 2.4. Chỗ code gói khác mà gói nối vào (mức hợp đồng, phục vụ luồng xuyên gói và probe)

- `apps/desktop/src-tauri/src/lib.rs` (205): toàn bộ 11 lệnh và `invoke_handler` — đối chiếu với mọi `invoke`/`call` phía khung xem.
- `apps/desktop/src/data/tauri-storage.ts` (61), `ai-tauri.ts` (75), `demo-snapshot.ts` (45): đọc toàn bộ.
- Chữ ký hàm phục vụ probe đo: `packages/db` (`backup.ts` 43–107, `counts.ts`, `trash.ts`, `ai-analyses.ts`, `appointments.ts`) và `apps/desktop/src/routes` (`reports-view.ts:220`, `team-compare-view.ts:99`, `appointments-view.ts:204/377/418`).
- Tài liệu đọc trước: `common\plan.md`, `common\known.md`, `common\baseline.md`, `prompt-muse.md` (toàn bộ); `CLAUDE.md` gốc (121); `CONTEXT.md` (các mục Người, KH, HĐ, KYC); `docs/metrics/phase-6.md` (toàn bộ, gồm bảng ngưỡng và bảng hàm thuần Phase 4); `docs/design/phase-6-hoan-thien.md` §4–§5 qua các gói trước và đối chiếu khi cần.

## 3. Phát hiện

```
ID: MU-F1
Mức: Low
Trục: T
Vị trí: e2e/perf/stats.ts:153 (8855345)
Tình trạng: KNOWN (mục #572 trong common\known.md, có bằng chứng chạy mới dưới đây)
Mô tả: Bảng so sánh của probe in `+Infinity%` khi trung vị nền bằng 0, thay vì `—` như ghi chú đã hẹn.
Tái hiện / bằng chứng: probe F\probe-markdown-zero.mjs dựng một lần đo có nền 0 và chạy `markdownTable` thật:
  `| appointments.period-day | 5 | 8 ms | 7 ms | 10 ms | < 200 ms ✅ | 0 ms | +8 ms (+Infinity%) |`
  Nguyên nhân: dòng 153 tính `Math.round((delta / base) * 100)` mà không chặn `base === 0` (ghi chú KNOWN đã nêu đúng chỗ này).
Ảnh hưởng: Người đọc bảng so sánh hai lần đo của probe chạy tay thấy `+Infinity%` khó hiểu; không sai số đo, không chặn việc gì. Nền 0 hiếm (thao tác ngắn nhất hiện ≈ 2 ms).
Đề xuất: In `—` cho cột phần trăm khi nền bằng 0 như ghi chú đã hẹn. Cỡ vài dòng và một ca trong `stats.spec.ts`.
```

```
ID: MU-F2
Mức: Low
Trục: T
Vị trí: e2e/customer-ai.spec.ts (dòng kiểm `expect(sent).not.toContain('1984')`) (8855345)
Tình trạng: KNOWN (mục #524 trong common\known.md, có bằng chứng định lượng mới dưới đây)
Mô tả: Kiểm tra không để lọt năm sinh quét cả `JSON.stringify(calls)` gồm `sessionId` hex ngẫu nhiên, nên test đỏ oan khi id chứa `1984`.
Tái hiện / bằng chứng: probe F\probe-1984.mjs mô phỏng 200 000 `sessionId` (16 byte ngẫu nhiên dạng hex như `run.ts:143`): trúng 98 lần = 0,049%, khớp ước tính "khoảng 0,04%" trong sổ. Mã kiểm vẫn quét cả id ở SHA ghim (đã đọc đoạn mã quanh kiểm tra).
Ảnh hưởng: Người chạy e2e hiếm khi thấy một test đỏ oan rồi chạy lại xanh; không sai hành vi app.
Đề xuất: Chỉ quét `messages[*].content` như sổ đã hẹn (cả phép kiểm tên và mã KH). Cỡ vài dòng.
```

Không có phát hiện mới ngoài hai mục KNOWN bổ sung bằng chứng trên. Mọi mục KNOWN khác đã đối chiếu vẫn đúng như mô tả, không có bằng chứng mới nên không nêu lại: móc `resolve` bỏ specifier có dấu chấm (`eval-ai.mjs:22`, `load-data.mjs:24`), `--out` tính từ gốc repo (`load-data.mjs:56`), `PERF_RUNS` không kiểm (`probe.perf.ts:22`), `dataset.picked` NaN (`probe.perf.ts:227–236`), `p2c:db-save` tích lũy (`app-data.ts:249`), các trùng lặp đã ghi (`plain`/`slug`, `newSessionId`/`newPage`, `MAX_RAW_OUTPUT`, `comparable`/`collapseSpaces`), ngưỡng ảnh KiB, code span hai backtick, `pr-status.mjs:94`.

## 4. Bloat

| Lần | Đã chạy / đọc gì | Dữ liệu | Số | Mã phát hiện |
|---|---|---|---|---|
| 1 | `tsc --noUnusedLocals --noUnusedParameters` cho `apps/desktop`, `packages/domain`, `packages/db`, `packages/ai`, `packages/ui` | Mã ở SHA ghim | Cả 5 đều sạch, mã thoát 0 | — |
| 2 | `pnpm lint:deps` (ranh giới module ADR-0006) | Toàn repo | Sạch: 309 module, 1 244 quan hệ (trùng số nền) | — |
| 3 | `node tools/codemap.mjs --check` | Toàn repo | Bản đồ export đúng hạn | — |
| 4 | `pnpm lint:tokens` | `apps/desktop/src`, `packages/ui/src/components` | Sạch | — |
| 5 | `node tools/size-report.mjs --compare docs/metrics/phase-6-baseline/size.json` | SHA ghim | Δ 0 mọi dòng sản phẩm; test gói F +365 (đã biết từ T-220: `full-cycle.spec.ts`, `support.ts`); tổng 32 216 SP / 38 356 test | — |
| 6 | Quét khối dòng lặp ≥ 5 dòng ở ≥ 3 file toàn repo (probe `F\probe-dup.mjs`, 204 file, bỏ test/fixture/guide) | Toàn repo | Hai cụm: khối cột drizzle trong `schema.ts` (5 bảng, cùng file — khuôn khai bảng đúng lệ) và chân hộp xóa ở 3 file (mẫu `Dialog` + nút Hủy/Xóa chung đã có `Dialog` làm trừu tượng) — không đáng tách | — |
| 7 | Tìm `console.log/debug/info/warn` trong mã sản phẩm | `apps/desktop/src`, `packages` | 0 trong app; 1 dòng in kết quả đạt trong `check-tokens.ts` (lệnh kiểm, đúng chỗ) | — |
| 8 | Đối chiếu phụ thuộc với nơi dùng | `package.json` các gói | App: `@p2c/*`, `@tauri-apps/api`, `exceljs` (nhập lười), `react`, `sql.js` đều có nơi dùng; gốc: playwright/vitest/depcruise/eslint/prettier/typescript đều có lệnh dùng | — |
| 9 | Cấu thành bundle (`baseline.md`, không build lại) | SHA ghim | `index.js` 891 942 thô / 262 010 nén; `exceljs` 929 569 (nhập lười, chunk riêng); `chart` 513 302 (chunk riêng); css 28 364; exe 5 414 400 byte (Δ 0) | — |
| 10 | Export chết gói D đã ghi ở gói D | — | MU-D4 (3 kiểu) giữ nguyên, không mở rộng | MU-D4 |

Kết luận bloat: không có phát hiện mới. Bundle tách đúng (biểu đồ và Excel nhập lười thành chunk riêng; kiểm tra ngân sách chart bằng `chart.spec.ts`). Ba kiểu thừa MU-D4 là phát hiện duy nhất còn mở trong toàn repo.

## 5. Hiệu năng

Máy đo: Home PC `DESKTOP-KDURKJP` (cùng máy với `common\perf\perf-ref.json`). Lúc đo không chạy `pnpm e2e`, không đo exe. Dữ liệu tải `common\load\load-2026-10-12-seed6.p2cbackup` (15 676 683 ký tự; 1 481 KH sống, 10 252 lịch sống sau khi trừ Thùng rác).

| Lần | Đã chạy / đo gì | Dữ liệu | Số (trung vị 5 lần) | Mã phát hiện |
|---|---|---|---|---|
| 1 | `importBackup` (probe `F\perf-pure.mjs`) | Dữ liệu tải | 824 ms (lần đầu 886 ms); tham chiếu Phase 4 ≤ 1 100 ms | — |
| 2 | `countRecords` | Dữ liệu tải | 5,0 ms; tham chiếu Phase 4 ≤ 15 ms | — |
| 3 | `listTrash` (117 dòng Thùng rác) | Dữ liệu tải | 43–44 ms (41–52); dưới xa ngưỡng 200 ms | — (mục KNOWN đọc cả ba bảng; số này là bằng chứng không cần sửa) |
| 4 | `listAppointments` (toàn bộ) | Dữ liệu tải | 45,4 ms; tham chiếu Phase 4 ≤ 65 ms | — |
| 5 | `exportBackup` (15,7 triệu ký tự) | Dữ liệu tải | 168,6 ms (khớp gói A 169 ms) | — |
| 6 | `listAiAnalyses` (phần AI của hồ sơ KH) | Dữ liệu tải | 0,1 ms | — |
| 7 | `countCustomerRecords` (KH nhiều lịch nhất, 38 lịch) | Dữ liệu tải | 2,0 ms | — |
| 8 | Chạy lại probe gói E (`E\probe-cross.mjs`) trong phiên F | Dữ liệu tải | `reportRows` Toàn bộ/Team/RE × tháng/năm/tùy chọn: 2,9–7,9 ms; mọi kiểm khớp màn–báo cáo PASS | — |
| 9 | Đối chiếu số tham chiếu cùng máy (`perf-ref.json` qua `baseline.md`) | Exe | Mọi thao tác màn 6–80 ms, đều < 200 ms; `db.save` 140 ms (≤ 400 ms); `backup.export` 424 ms (≤ 1 000 ms) | — |

Đối chiếu ngưỡng đã chốt (`docs/metrics/phase-6.md`): mọi thao tác màn đo được đều dưới ngưỡng với biên rộng (chậm nhất là `listTrash` 44 ms và `listAppointments` 45 ms trong Node; trên exe `trash.open` 80 ms). Nhập/xuất backup là việc có hộp tiến trình, không thuộc ngưỡng thao tác màn. Không đo lại trên exe (số tham chiếu cùng máy đã có, phần hàm thuần đã đủ sâu; không đo khi bên khác đang đo — không có bên nào khác).

Kết luận hiệu năng: không có phát hiện P. Bảng hàm thuần Phase 4 (`importBackup`, `listAppointments`, `teamCompare`/`reportRows`, `monthGrid`, `countRecords` — `phase-6.md:91`) nay đã đo lại đủ trên dữ liệu tải cùng `listTrash` và phần AI của hồ sơ, theo yêu cầu `plan.md` §6.

## 6. Bảng đếm mức × trục

Gói F:

| Mức | E | C | D | G | S | P | B | T | A | Cộng |
|---|---|---|---|---|---|---|---|---|---|---|
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 (KNOWN) | 0 | 2 |
| Cộng | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 2 |

Cộng dồn cả 6 gói phía muse (A 3 + B 3 + C 2 + D 4 + E 4 + F 2 = 18): Low 13, Nit 5; theo trục E 1, C 8, D 2, S 1, B 2, T 2, A 2; G và P bằng 0. Tỉ lệ PLAUSIBLE 4/18 (≈ 22%, gồm MU-B3, MU-D2, MU-D3, MU-E4 — đều là chỗ không chạy được DOM/giao diện vì repo chưa có công cụ test component, đã nói rõ trong từng báo cáo). Hai mục KNOWN của gói F đều có bằng chứng chạy thật (không phải PLAUSIBLE).

## 7. Đã xét, không thấy

- E (ca biên): đã xét, không thấy mới. Đã đọc kiểm tham số lệnh (`parseLoadArgs`: neo không sau hôm nay, seed số nguyên), `parseSizeArgs`, giới hạn `MAX_IMAGE`/`MAX_TOTAL` của guide, `LOAD_MIN` của probe, `HOOK_LIMIT`/`BODY_MAX` của HANDOFF. Probe hình khối lặp và chuỗi biên không phát hiện khối lặp mới đáng gộp.
- C (đúng hợp đồng): đã xét, xem bảng dưới — mọi hợp đồng khớp.
  | Hợp đồng | Hai đầu | Kết quả kiểm |
  |---|---|---|
  | Lệnh Tauri ↔ khung xem | 11 lệnh trong `lib.rs:190–201` ↔ mọi `invoke`/`call` trong `tauri-storage.ts`, `ai-tauri.ts` | Khớp đủ 11 (đọc mã hai bên; kiểm `check-invoke` liệt kê 7 tên gọi trực tiếp, 4 tên qua `call()` đã đọc tay) |
  | `domain` ↔ `db` | `db` chỉ nhập `@p2c/ai/schema` (K1) | Đúng: 9 nơi nhập đều là `/schema`, không có nhập `@p2c/ai` trần; `ai` không nhập `db` |
  | Ranh giới module | `.dependency-cruiser.cjs` 8 luật | `lint:deps` xanh (309 module) |
  | Bản đồ export | `CLAUDE.md` các gói ↔ mã | `codemap --check` xanh |
  | CI ↔ `CODE_DOCS` | `ci.yml` ↔ `pr-core.mjs` | Danh sách khớp (có test kiểm) |
  | Số ô Lịch hẹn = Tổng hợp Báo cáo | ba góc nhìn × ba kỳ | Chạy lại `probe-cross.mjs`: khớp (PASS) |
  | Backup xuất → nhập | `full-cycle.spec.ts` | Đọc toàn bộ: xuất rồi nhập lại cho đúng bằng (`toEqual(before)`) |
  | AI về trong lúc thay dữ liệu (S2-3) | `ai-analysis.ts:208` `replaced()` | 55 test `ai-analysis.test.ts` xanh trong phiên này |
  | Tên file dữ liệu demo gieo sẵn | `buildDemoSnapshot` ↔ `fetchDemoSnapshot` | Cùng hàm đặt tên; `seeded-snapshot.spec.ts` kiểm bằng nhau |
- D (dữ liệu): đã xét, không thấy mới. `eval-ai.mjs` ghi file bằng cờ `wx` (không đè), `load-data.mjs` ghi có tạo thư mục; khóa chỉ đi ở đầu mục `Authorization`, che trước khi cắt; `handoff.mjs` từ chối ghi khi Issue đã đổi (mốc `base.json`).
- G (guardrail AI): đã xét, không thấy mới (gói C đã đối chiếu G5 từng mục; phía F chỉ giữ ranh giới gọi mạng của script eval: hết giờ 120 s, thân quá 2 MB bị từ chối).
- S (an toàn ranh giới): đã xét, không thấy mới. Script chỉ chạy tay, không chạy trong CI (`eval-ai`, probe perf, guide); `merge-pr.mjs` ghim head (`--match-head-commit`), mọi lệnh kiểm mã thoát, dọn nhánh báo thay vì làm khi bẩn/xếp chồng/sai SHA; `pre-push` chặn push thẳng `main`; `bootstrap.ps1` đặt `core.hooksPath` đúng repo (không `--global`).
- P (hiệu năng): đã xét, xem mục 5 — không hàm nào vượt ngưỡng.
- B (bloat): đã xét, xem mục 4 — không có mã chết, export thừa hay phụ thuộc thừa mới.
- T (chất lượng test): đã xét. Chạy trong phiên này: `ai-analysis.test.ts` 55/55 xanh; 4 file test tools (`pr-core`, `codemap-core`, `load-data-core`, `eval-ai-core`) 141/141 xanh; `pnpm verify`/`verify:rust`/`e2e`/`build:exe` phủ bởi cổng baseline ở SHA ghim (không bắt buộc chạy lại). Hai mục KNOWN MU-F1/MU-F2 là test/tool hở đã biết. Không chạy đột biến riêng trong gói F (không sửa mã nào để đột biến; các gói A–E đã giết đột biến trong phạm vi mình).
- A (trợ năng, đa ngữ): phạm vi F không giữ chuỗi màn hình (công cụ/e2e dùng tên vai trò có sẵn); probe perf và guide dùng đúng tên tiếng Việt của màn. Không có gì để xét thêm.

## 8. Phụ lục

### 8.1. Nguồn probe (trong `C:\workspace\deep-review-1-6\muse\F\`)

| Probe | Việc | Kết quả |
|---|---|---|
| `perf-pure.mjs` | Nhập dữ liệu tải rồi đo `countRecords`, `listTrash`, `listAppointments`, `exportBackup`, `listAiAnalyses`, `countCustomerRecords` | Số ở mục 5 (lần 1–7) |
| `probe-markdown-zero.mjs` | Dựng lần đo có nền 0, chạy `markdownTable` thật | `+8 ms (+Infinity%)` (MU-F1) |
| `probe-1984.mjs` | Mô phỏng 200 000 `sessionId` hex | Trúng 98 (0,049%) (MU-F2) |
| `probe-dup.mjs` | Khối ≥ 5 dòng lặp ở ≥ 3 file, 204 file (bỏ test/fixture/guide) | Hai cụm đã xét ở mục 4, không đáng tách |
| Chạy lại `muse\E\probe-cross.mjs` | `reportRows` 9 tổ hợp kỳ/góc nhìn + kiểm khớp màn–báo cáo | 2,9–7,9 ms, mọi kiểm PASS |

### 8.2. Test đã chạy trong phiên F

- `pnpm.cmd vitest run apps/desktop/src/data/ai-analysis.test.ts` → 1 file, 55 test, xanh (1,63 s).
- `pnpm.cmd vitest run tools/pr-core.test.mjs tools/codemap-core.test.mjs tools/load-data-core.test.mjs tools/eval-ai-core.test.mjs` → 4 file, 141 test, xanh (11,73 s).
- `pnpm.cmd lint:deps` → sạch (309 module, 1 244 quan hệ). `node tools/codemap.mjs --check` → đúng hạn. `tsc --noUnusedLocals --noUnusedParameters` cho 5 dự án → mã thoát 0. `pnpm.cmd lint:tokens` → sạch. `node tools/size-report.mjs --compare …` → Δ 0.

### 8.3. Trạng thái kho cuối phiên

`git -C C:\workspace\Project-2C-review-2 status --short` cuối phiên (01:12 15/10/2026) cho đúng ba dòng như đầu phiên (`?? .agents/`, `?? .codex/`, `?? AGENTS.md`); SHA cuối phiên vẫn `885534549808f42aec7f9af5743bbf86642ee4bd`. Mọi probe và log đều nằm trong `muse\F\`, không ghi gì vào repo. Các lệnh test/build trong repo chỉ ghi vào thư mục build/cache đã bỏ qua.

### 8.4. Kết luận phát hành (riêng gói F)

**SẴN SÀNG cho v1.0 ở SHA `8855345` (phía muse; kết luận thật ở phiên tổng hợp).** Lý do: cả 6 gói phía muse chỉ còn Low/Nit (18 phát hiện, không có Critical/High/Medium), hai mục gói F chỉ là công cụ đo/kiểm đã biết có bằng chứng mới; mọi cổng ở SHA ghim đều xanh (`verify` 2 755 test, `verify:rust` 91 test, e2e 210 passed, coverage 99%, exe Δ 0); mọi thao tác màn đo trên dữ liệu tải đều dưới ngưỡng đã chốt với biên rộng; luồng xuyên gói đầu–cuối (nhập liệu → chỉ số → AI → Thùng rác → backup → nạp lại/nhập, gồm AI về trong lúc thay dữ liệu) đã kiểm bằng test và chạy lại; hợp đồng `domain` ↔ `db` ↔ `ai` ↔ UI ↔ Rust khớp cả hai chiều.
