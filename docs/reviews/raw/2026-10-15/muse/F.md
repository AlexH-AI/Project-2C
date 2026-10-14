XONG — muse gói F, 01:03 15/10/2026
# Báo cáo soát sâu lượt 1 — gói F: Xuyên gói, bloat / hiệu năng, công cụ

## 1. Thông tin phiên

- Bên soát: muse (mẫu hình Muse Spark 1.3)
- Gói: F (Xuyên gói, bloat / hiệu năng, công cụ)
- Đường dẫn gói: `tools/**`, `e2e/**`, `.github/**`, `.githooks/**`, `.claude/**`, `packages/ui/scripts/`, `apps/desktop/vite.config.ts`, tệp gốc kho; luồng xuyên gói; toàn kho cho bloat và hiệu năng
- Mã nguồn: `C:\workspace\Project-2C-review-2`, ở trạng thái tách rời
- SHA đầu phiên: `885534549808f42aec7f9af5743bbf86642ee4bd` (viết gọn `8855345`)
- Lệnh kiểm đầu phiên: `git -C C:\workspace\Project-2C-review-2 rev-parse HEAD` cho đúng SHA trên; `status --short` trống (cây làm việc sạch)
- Giờ bắt đầu: 00:26 15/10/2026 (giờ địa phương +07:00)
- Tệp báo cáo: `C:\workspace\deep-review-1-6\muse\F.md`
- Thư mục nháp: `C:\workspace\deep-review-1-6\muse\F\`
- Cách làm: chỉ đọc kho nguồn, không ghi vào kho; mọi thử nghiệm đặt trong thư mục nháp của gói
- Phiên làm tiếp: có. Phiên trước mới dựng khung rồi bị cắt (00:26). Phiên này (từ 00:51 15/10/2026) giữ nguyên khung, đọc sâu từng tệp và ghi dần. Báo cáo A–E của cùng bên đã đọc xong (A XONG 22:45 14/10, B XONG 23:02 14/10, C XONG 23:23 14/10, D XONG 23:54 14/10, E XONG 00:19 15/10), không gói nào còn dở.
- Máy đo: Office Laptop `D13_THINKPAD` (máy chạy lượt này, trùng máy đo nền). Lúc đo không có việc nặng chạy cùng; bên khác không đo cùng lúc.

## 2. Phạm vi đã đọc

Đọc sâu từng tệp trong phạm vi gói ở SHA chốt (số dòng đếm bằng đọc tệp):

| Tệp (tính từ gốc kho) | Số dòng | Trạng thái |
|---|---|---|
| tools/size-report-core.mjs | 359 | Đã đọc hết |
| tools/pr-core.mjs | 295 | Đã đọc hết |
| tools/codemap-core.mjs | 201 | Đã đọc hết |
| tools/load-data-core.mjs | 104 | Đã đọc hết |
| tools/eval-ai-core.mjs | 713 | Đã đọc hết |
| tools/session-core.mjs | 121 | Đã đọc hết |
| tools/session-io.mjs | 15 | Đã đọc hết |
| tools/retro-core.mjs | 243 | Đã đọc hết |
| tools/review-hint-core.mjs | 28 | Đã đọc hết |
| tools/merge-pr.mjs | 159 | Đã đọc hết |
| tools/pr-status.mjs | 137 | Đã đọc hết |
| tools/load-data.mjs | 62 | Đã đọc hết |
| tools/eval-ai.mjs | 58 | Đã đọc hết |
| tools/codemap.mjs | 96 | Đã đọc hết |
| tools/handoff.mjs | 161 | Đã đọc hết |
| tools/status.mjs | 78 | Đã đọc hết |
| tools/size-report.mjs | 49 | Đã đọc hết |
| tools/retro.mjs | 57 | Đã đọc hết (phần đầu) |
| tools/bootstrap.ps1 | 212 | Đã đọc hết |
| tools/session-start.ps1 | 73 | Đã đọc hết |
| tools/session-end.ps1 | 79 | Đã đọc hết |
| e2e/serve.mjs | 44 | Đã đọc hết |
| e2e/support.ts | 304 | Đã đọc hết |
| e2e/full-cycle.spec.ts | 361 | Đã đọc hết |
| e2e/anchor.ts | 8 | Đã đọc hết |
| e2e/seeded-snapshot.ts | 13 | Đã đọc hết |
| e2e/seeded-snapshot.spec.ts | 57 | Đã đọc hết |
| e2e/seed-timing.spec.ts | 20 | Đã đọc hết |
| e2e/chart.spec.ts | 70 | Đã đọc hết |
| e2e/backup.spec.ts | 195 | Đã đọc phần đầu (50 dòng đầu) |
| e2e/customer-ai.spec.ts | 791 | Đã đọc vùng kiểm 1984 (dòng 690–719) và rà toàn tệp bằng tìm kiếm |
| e2e/demo-data.spec.ts | 71 | Đã đọc hết (kiểm `waitForTimeout` duy nhất) |
| e2e/perf/probe.perf.ts | 453 | Đã đọc hết |
| e2e/perf/stats.ts | 213 | Đã đọc hết |
| e2e/perf/README.md | 81 | Đã đọc hết |
| e2e/guide/links.ts | 57 | Đã đọc hết |
| e2e/guide/check.guide.ts | 22 | Đã đọc hết |
| apps/desktop/vite.config.ts | 30 | Đã đọc hết |
| apps/desktop/package.json | 36 | Đã đọc hết |
| packages/ui/scripts/check-tokens.ts | 38 | Đã đọc hết |
| packages/ui/package.json | 26 | Đã đọc hết |
| packages/ai/package.json | 18 | Đã đọc hết |
| package.json (gốc) | 44 | Đã đọc hết |
| .github/workflows/ci.yml | 149 | Đã đọc hết |
| .githooks/pre-push | 14 | Đã đọc hết |
| .claude/settings.json | 44 | Đã đọc hết |
| .claude/hooks/handoff-context.mjs | 26 | Đã đọc hết |
| .claude/hooks/review-pr-hint.mjs | 30 | Đã đọc hết |
| .claude/rules/ci.md | 18 | Đã đọc hết |
| apps/desktop/src/routes/Screen.tsx | 21 | Đã đọc hết (đối chiếu `codemap-core`) |

Tệp đọc thêm ngoài gói để hiểu chỗ nối: `packages/db/src/index.ts`, `backup.ts` (đọc hết 203 dòng), `database.ts` (60 dòng đầu), `appointments.ts` (80 dòng đầu), `packages/domain/src/stats.ts` (vùng `MetricsData`), `period.ts` (qua thăm dò), `kyc-gate.ts` (chữ ký `evaluateKycGate`), `packages/ai/src/schema.ts` (vùng `buildAnalysisInput`), `apps/desktop/src/routes/appointments/appointments-view.ts` (vùng `AppointmentData`, `appointmentRows`, `monthGrid`), `overview/team-compare-view.ts` (vùng `teamCompare`), `reports/reports-view.ts` (vùng `reportRows`), `SettingsBackup.tsx` + `reports/ReportExport.tsx` (vùng `download`), `CLAUDE.md` gốc, `CONTEXT.md`, `docs/metrics/phase-6.md` (toàn bộ), `common/plan.md`, `common/known.md`, `common/baseline.md`, `common/prompt-muse.md`, báo cáo `muse/A.md` … `muse/E.md` (đọc hết cả 5).

Các tệp kiểm thử đầu-cuối còn lại (28 tệp `.spec.ts`) rà bằng lệnh đếm `test` / `expect` / `wait` (phụ lục) thay vì đọc từng dòng một, vì hành vi màn của chúng đã do các gói D / E xét; gói F chỉ xét chất lượng kiểm thử.

## 3. Phát hiện

```
ID: MU-F1
Mức: Nit
Trục: B
Vị trí: apps/desktop/src/routes/appointments/appointments-view.ts:63, apps/desktop/src/routes/customers/CustomerKyc.tsx:26, apps/desktop/src/routes/team/TeamScreen.tsx:31, apps/desktop/src/routes/customers/KycIntelligence.tsx:47 (8855345)
Tình trạng: CONFIRMED
Mô tả: Chuỗi lớp thẻ `rounded-lg border border-border bg-surface-1 p-4` lặp nguyên văn ở 4 tệp (1 xuất, 3 nội bộ), vượt ngưỡng lặp 3 nơi của kế hoạch.
Tái hiện / bằng chứng: lệnh tìm `const CARD = 'rounded-lg border` trong `apps/desktop/src` cho 5 trúng, trong đó 4 trúng giống hệt nhau từng ký tự (`appointments-view.ts:63`, `CustomerKyc.tsx:26`, `TeamScreen.tsx:31`, `KycIntelligence.tsx:47`); bản thứ năm (`CustomersScreen.tsx:31`) là `p-3`, bản ở `ReportsScreen.tsx:20` là chuỗi `flex` khác hẳn. Gói D mới thấy 2 bản trong phạm vi D, gói E ghi nhận mà chưa đủ ngưỡng; quét toàn kho mới đủ 4.
Ảnh hưởng: ai đổi kiểu thẻ phải sửa 4 chỗ; không tốn lúc chạy (chuỗi hằng).
Đề xuất: một hằng dùng chung trong `@p2c/ui` (vd. cạnh `CARD` đã xuất của `appointments-view.ts`) cho cả 4 chỗ; cỡ dưới 20 dòng sản phẩm. Kiểm thử giữ hành vi: `pnpm e2e` (màn nào cũng vẽ thẻ này) và `pnpm lint:tokens`.
```

Ghi nhận mà không lập mã mới (đã có mã ở gói trước, quét toàn kho xác nhận vẫn đúng và không còn chỗ chết nào khác): `PersistQueue.unsaved()` chỉ bài kiểm gọi (MU-B1); giá trị `AI_LOCAL_ERROR_CODES` chỉ bài kiểm nhập còn kiểu `AiErrorCode` thì dùng tới, kiểu `ConfirmProposal` chỉ dùng trong chính tệp (MU-C4). Quét toàn kho bằng tìm kiếm không thấy xuất chết nào khác ở mã sản phẩm (chi tiết ở mục Bloat).

## 4. Bloat (mã thừa / lặp / xuất thừa)

| Việc đã chạy / đọc | Dữ liệu dùng | Số đo | Mã phát hiện |
|---|---|---|---|
| `tsc --noEmit --noUnusedLocals --noUnusedParameters` ở `packages/domain`, `packages/ai`, `packages/db`, `packages/ui` | mã nguồn | thoát 0 cả 4 gói, 0 biến / tham số thừa | không |
| `tsc --noEmit --noUnusedLocals --noUnusedParameters` ở `apps/desktop` | toàn bộ ứng dụng | thoát 0 | không |
| `tsc -p e2e --noEmit` | toàn bộ kiểm thử đầu-cuối | thoát 0 | không |
| `pnpm lint:deps` | toàn kho (309 khối, 1 244 phụ thuộc) | `no dependency violations found` | không |
| `node tools/codemap.mjs --check` | bản đồ xuất 5 gói | `Export maps are up to date.` | không |
| `node tools/size-report.mjs` ở SHA chốt | tệp git theo dõi | A 7 473 / B 2 001 / C 5 129 / D 6 820 / E 7 032 / F 3 761 dòng sản phẩm; tổng 32 216 / 38 356 / 4 917 / 380 tệp; `Chưa xếp gói` 0 tệp — khớp số kế hoạch | không |
| Tìm nơi dùng từng xuất ngờ thừa (`unsaved`, `AI_LOCAL_ERROR_CODES`, `ConfirmProposal`) | toàn kho | chỉ bài kiểm hoặc chính tệp dùng (xem MU-B1, MU-C4) | MU-B1, MU-C4 (đã báo) |
| Tìm chuỗi `CARD` trong `apps/desktop/src` | toàn kho | 4 bản giống hệt + 1 bản `p-3` + 1 chuỗi `flex` khác | MU-F1 |
| So `download` ở `SettingsBackup.tsx:169` và `ReportExport.tsx:88` | 2 tệp | khung giống nhau nhưng tải khác nhau (chữ / byte Excel), mới 2 nơi — dưới ngưỡng 3 | không (ghi nhận) |
| Rà phụ thuộc: `apps/desktop`, `packages/ai`, `packages/ui` | khai báo gói | `exceljs` dùng ở xuất Excel, `echarts` dùng ở `Chart.tsx`, `sql.js` dùng ở `db`, `zod` dùng ở `ai`; không thấy gói thừa | không |
| Cấu thành gói web (`size-report`, thư mục `dist` sẵn có) | `apps/desktop/dist` | `index.js` 891 952 byte thô (nền 891 942, +10 byte); `chart.js` 513 302; `exceljs.min.js` 929 569; tổng JS/CSS 2 364 293 thô / 697 084 gzip; tệp khác 16 tệp 10 429 740 byte (gồm ảnh chụp dữ liệu mẫu do lần chạy đầu-cuối của gói D ghi vào `dist`, thư mục này git bỏ qua) | không (ghi nhận trôi `dist`, không phải mã sản phẩm) |
| Đọc `vite.config.ts` + `e2e/chart.spec.ts:62` | cấu hình, kiểm ngân sách | chunk `chart` tách riêng, kiểm giữ dưới 250 KB gzip (nền 172 450) | không |

## 5. Hiệu năng

Máy đo: Office Laptop `D13_THINKPAD`, cắm sạc, lúc đo chỉ chạy phiên này. Dữ liệu tải `load-2026-10-12-seed6.p2cbackup` (15 676 683 ký tự; 1 481 KH sống, 10 252 lịch hẹn, 1 674 HĐ, 51 nhân sự, 4 đội, 4 883 chuyển nhóm, 117 dòng rác, 19 dữ kiện ở hồ sơ nặng nhất).

| Việc đã chạy / đo | Dữ liệu dùng | Số đo | Ngưỡng / mốc so | Mã phát hiện |
|---|---|---|---|---|
| `importBackup` 3 lần (`F/probe-perf-node.mjs`) | tệp tải | 926, 788, 768 ms | ngưỡng nhập ≤ 2 000 ms (đạt); mốc nền `backup.read` 1 035 ms: cùng bậc | không |
| `listAppointments` trung vị 7 lần | tải đã nhập | 64,4 ms (52,9–79,3) | mốc Phase 4 ≤ 65 ms: đạt sát; ngưỡng màn 200 ms: đạt | không |
| `listTrash` trung vị 7 lần | tải đã nhập (117 dòng) | 71,8 ms (60,0–83,7) | ngưỡng màn 200 ms: đạt; mốc `trash.open` trên exe 89–91 ms: cùng bậc | không |
| `countRecords` trung vị 7 lần | tải đã nhập | 6,0 ms (5,8–8,0) | mốc Phase 4 ≤ 15 ms: đạt | không |
| `listCustomers` trung vị 7 lần | tải đã nhập (1 481 KH) | 6,0 ms (5,2–6,4) | ngưỡng màn 200 ms: đạt | không |
| `exportBackup` trung vị 7 lần | tải đã nhập | 271,1 ms (256,5–287,4) | ngưỡng xuất ≤ 1 000 ms: đạt; mốc nền 481–484 ms trên exe (đo cả ghi tệp, ở đây chỉ dựng chuỗi 15,7 triệu ký tự) | không |
| `appointmentRows` toàn bộ trung vị 7 lần | tải đã nhập | 5,2 ms (4,7–6,7) | ngưỡng màn 200 ms: đạt | không |
| `monthGrid` tháng 10/2026 trung vị 7 lần | 10 252 lịch | 1,50 ms (1,31–3,28) | mốc Phase 4 ≤ 2 ms: đạt | không |
| `teamCompare` tháng 10/2026 trung vị 7 lần (`F/probe-perf-node2.mjs`) | tải đã nhập | 2,2 ms (1,8–5,3) | mốc Phase 4 ≤ 15 ms: đạt | không |
| `reportRows` tháng 10/2026 trung vị 7 lần | tải đã nhập | 7,0 ms (6,6–11,1) | mốc Phase 4 ≤ 15 ms: đạt | không |
| `getKycProfile` hồ sơ 19 dữ kiện trung vị 20 lần (`F/probe-perf-ai.mjs`) | KH `01K7C4NEJZJP1QVTSYKF75CVED` | 0,10 ms (0,10–0,59) | ngưỡng màn 200 ms: đạt | không |
| `evaluateKycGate` 19 dữ kiện trung vị 50 lần | hồ sơ trên (`PAIN_POINT_ANALYSIS`) | 0,003 ms | ngưỡng màn 200 ms: đạt xa | không |
| `buildAnalysisInput` 19 dữ kiện trung vị 50 lần | hồ sơ trên | 0,013 ms (0,008–0,095) | ngưỡng màn 200 ms: đạt xa | không |
| `extractJson` câu dán ~17 nghìn ký tự trung vị 20 lần | chuỗi tự dựng | 0,00 ms (0,00–0,17) | ngưỡng màn 200 ms: đạt xa | không |
| Vòng xuất → nhập lại (`F/probe-cross.mjs`) | tải | bảng `tables` giống hệt nhau, Thùng rác 117 = 117 dòng giống hệt, phân tích AI của KH giữ nguyên 1 = 1 | — (đúng hợp đồng xuyên gói) | không |

Không có phát hiện hiệu năng: mọi số đều dưới ngưỡng đã chốt với khoảng cách lớn; số trong Node chỉ để so bậc với số trên exe ở `common/baseline.md` (cùng máy), không so trực tiếp vì khác đường đo.

## 6. Bảng đếm mức × trục

| Mức / Trục | E | C | D | G | S | P | B | T | A | Tổng |
|---|---|---|---|---|---|---|---|---|---|---|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| Tổng | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 |

Tình trạng: CONFIRMED 1/1 (100%), PLAUSIBLE 0. Toàn lượt 1 của bên muse (A–F) không có Critical / High / Medium nào; các Low đã báo ở A–E giữ nguyên, gói F không nêu lại.

## 7. Đã xét, không thấy

- E (trường hợp biên): đã xét, không thấy. Đã đọc `parseLoadArgs` (neo sau hôm nay thì từ chối, hạt giống ngoài `0–4294967295` thì từ chối), `size-report` (tệp đã xóa ở cây làm việc thì không đếm), `retro-core` (dòng hỏng thì bỏ), `review-hint-core` (số `#N` trần không tính là PR); đã chạy vòng xuất → nhập lại (bảng giống hệt). Hai thao tác thay dữ liệu chồng nhau, tắt app giữa chừng do gói B giữ; nhập tệp sửa tay do gói A giữ.
- C (đúng hợp đồng): đã xét, không thấy thêm ngoài MU-F1. Đã đối chiếu `PACKAGES` với số kế hoạch (khớp từng dòng, `Chưa xếp gói` 0 tệp); `CODE_DOCS` khớp bộ lọc `paths` của `ci.yml` (có kiểm thử giữ); `CODEMAP_PACKAGES` khớp `CODEMAP_DOCS` (có kiểm thử giữ); `Screen.tsx` khớp mẫu `if (route.screen === …) return <…>` mà `screenComponents` nhận; ngân sách `chart` 250 KB khớp chú thích `vite.config.ts`. Hợp đồng `domain` ↔ `db` ↔ `ai` ↔ UI ↔ Rust: `db` chỉ nhập `ai` qua `@p2c/ai/schema` (`ai-analyses.ts:7`, `schema.ts:19`, `seed.ts:9`); `ai` chỉ nhập `domain`; vòng xuất → nhập lại giữ nguyên bảng, rác và phân tích AI (thăm dò `probe-cross.mjs`). Lệch chữ `CARD p-5` mà gói E nêu không thấy ở mã (chỉ có `p-4` / `p-3` / chuỗi `flex`), nên không có gì để báo.
- D (dữ liệu): đã xét, không thấy. Vòng xuất → nhập lại trên dữ liệu tải: `tables` giống hệt, `listTrash` 117 dòng giống hệt, phân tích AI giữ nguyên; `exportBackup` sắp theo khóa chính nên thứ tự ổn định (khác nhau giữa hai lần xuất chỉ ở `exportedAt`). `seeded-snapshot.spec.ts` ghim dữ liệu gieo sẵn bằng dữ liệu gieo tại chỗ bằng băm từng bảng.
- G (giữ AI): đã xét, không thấy. `eval-ai` chỉ Owner chạy tay (không chạy ở CI), khóa chỉ đi trong đầu `Authorization`, che khỏi tin nhắn máy chủ (`serverMessage`) và không ghi ra tệp; ghi nhận kết quả bằng cờ `wx` nên không đè lượt cũ; lỗi khóa / giới hạn dừng cả lượt còn lại thành `SKIPPED`. Không gọi dịch vụ AI thật trong phiên này.
- S (an toàn ở ranh giới): đã xét, không thấy. `session-io.run` dùng `spawnSync` theo mảng tham số, không qua vỏ lệnh; `merge-pr` ghim đầu (`--match-head-commit`), dọn nhánh theo kế hoạch có kiểm bẩn; `handoff` không đè bản của máy kia (kiểm `base.json`); `pre-push` chặn đẩy thẳng lên `main`; CI đọc nhãn hiện tại qua API và kiểm `$LASTEXITCODE`; `serve.mjs` dựng web rồi phục vụ ở cổng cố định với `strictPort`, không tái dùng máy chủ cũ trừ khi Owner yêu cầu; `probe.perf.ts` kiểm dữ liệu tải trước khi đo. Mục `PERF_RUNS` không kiểm, bảng chia cho nền 0, hộp xác nhận treo khi `start` không phải số đã ở sổ (#572) — đọc lại, không có bằng chứng mới nên không nêu.
- P (hiệu năng): đã xét, không thấy. Số đo ở mục 5, mọi hàm thuần dưới 100 ms so với ngưỡng 200 ms; `importBackup` dưới 1 000 ms so với ngưỡng 2 000 ms. Không đo lại trên exe (số tham chiếu cùng máy ở `common/baseline.md` đã đủ; đo lúc này dễ đụng cổng và làm nhiễu máy của lượt chạy).
- B (mã thừa): đã xét, thấy MU-F1. Ngoài ra: `tsc` sạch cả 6 vùng kiểm, `lint:deps` xanh, `codemap:check` khớp, `size-report` không còn tệp chưa xếp; phụ thuộc khai báo đều có chỗ dùng; `download` mới lặp 2 nơi; các lặp `plain`, `newSessionId` / `newPage`, móc `resolve` của `load-data` / `eval-ai`, `MAX_RAW_OUTPUT` đã ở sổ — đọc lại, không có bằng chứng mới nên không nêu.
- T (chất lượng kiểm thử): đã xét, không thấy thêm. Đã chạy `vitest run tools`: 9 tệp, 258 kiểm thử, đều qua. Đột biến trên bản chép: MUT-F1 (bỏ luật `tools` khỏi gói F) đổi `classifyFile('tools/codemap-core.mjs')` từ `F` thành chưa xếp gói — bị giết bởi `size-report-core.test.mjs:53`; MUT-F2 (bỏ kiểm thứ tự mốc ở `replaceBlock`) nuốt lỗi mốc đảo — bị giết bởi `codemap-core.test.mjs:135`. Rà 28 tệp kiểm thử đầu-cuối: tệp nào cũng có `expect` (ít nhất 5), không có `waitForTimeout` trừ `demo-data.spec.ts:47` (chờ 6 000 ms có giải thích để bắt lỗi nạp lại lén sau Hủy — chấp nhận được). Các chỗ yếu đã biết (`customer-ai.spec.ts:717` quét cả `sessionId` ngẫu nhiên ≈ 0,04% đỏ oan; hộp 5f chỉ kiểm số lần tính; thứ tự Thùng rác) đọc lại vẫn đúng như sổ, không có bằng chứng mới nên không nêu.
- A (trợ năng / đa ngữ): đã xét, không thấy. Phạm vi gói không có mặt hiển thị; `seed-timing.spec.ts` nới ngưỡng ở CI có quyết định Owner kèm theo; chữ trong công cụ và thăm dò probe giữ tiếng Việt ở câu báo cho Owner.

## 8. Kết luận sẵn sàng cho v1.0 ở SHA 8855345

**SẴN SÀNG.**

Lý do: toàn lượt 1 của bên muse (A–F) không tìm thấy lỗi Critical / High / Medium nào; mọi phát hiện đều đã xác nhận bằng lệnh chạy thật. Các cổng ở SHA chốt đều xanh (`pnpm verify` 2 755 kiểm thử, `verify:rust` 91 kiểm thử, `pnpm e2e` 210 kiểm thử qua). Mọi số hiệu năng gói F đo trên dữ liệu tải đều dưới ngưỡng đã chốt với khoảng cách lớn, khớp bậc với số tham chiếu cùng máy. Vòng xuất → nhập lại giữ nguyên bảng, Thùng rác và phân tích AI. Các Low / Nit còn lại (lỗi hiển thị, cảnh báo thiếu, mã lặp 4 chỗ, xuất thừa không tốn lúc chạy) không mất dữ liệu, không sai lặng lẽ, không chặn việc chính — nên sửa sau v1.0 mà không cần giữ bản.

## 9. Phụ lục nguồn thăm dò / thử tạm / đột biến

- `muse/F/probe-perf-node.mjs`: nhập tệp tải rồi đo `importBackup` (3 lần), `listAppointments`, `listTrash`, `countRecords`, `listCustomers`, `exportBackup`, `appointmentRows`, `monthGrid`. Kết quả: `importBackup` 926 / 788 / 768 ms; `listAppointments` trung vị 64,4 ms; `listTrash` 71,8 ms; `countRecords` 6,0 ms; `listCustomers` 6,0 ms; `exportBackup` 271,1 ms; `appointmentRows` 5,2 ms; `monthGrid` 1,50 ms. Dùng cho mục 5.
- `muse/F/probe-perf-node2.mjs`: đo `teamCompare` (trung vị 2,2 ms) và `reportRows` (trung vị 7,0 ms) kỳ tháng 10/2026 trên dữ liệu tải. Dùng cho mục 5.
- `muse/F/probe-perf-ai.mjs`: hồ sơ nặng nhất 19 dữ kiện (`01K7C4NEJZJP1QVTSYKF75CVED`): `getKycProfile` 0,10 ms; `evaluateKycGate` 0,003 ms (`PAIN_POINT_ANALYSIS`); `buildAnalysisInput` 0,013 ms; `extractJson` ~17 nghìn ký tự 0,00 ms. Dùng cho mục 5.
- `muse/F/probe-cross.mjs`: vòng xuất → nhập lại: `tables` giống hệt, `trash` 117 = 117 giống hệt, AI giữ 1 = 1. Dùng cho mục C / D và 5.
- `muse/F/mut-size-report-core.mjs` + `mut-check.mjs` (MUT-F1: bỏ luật `tools` khỏi gói F): phân loại `tools/codemap-core.mjs` đổi từ `F` thành chưa xếp gói — bị giết bởi `tools/size-report-core.test.mjs:53`.
- `muse/F/mut-check2.mjs` (MUT-F2: bỏ kiểm thứ tự mốc ở `replaceBlock`): mốc đảo không ném lỗi (kết quả dài 107) trong khi hàm gốc ném `must come before` — bị giết bởi `tools/codemap-core.test.mjs:135`.
- Lệnh đã chạy trong kho (chỉ đọc hoặc ghi vào thư mục git bỏ qua, không sửa mã): `git rev-parse HEAD`, `git status --short` (đầu và cuối), `pnpm lint:deps` (xanh), `node tools/size-report.mjs` (khớp kế hoạch), `node tools/codemap.mjs --check` (khớp), `tsc --noUnusedLocals --noUnusedParameters --noEmit` ở 4 gói + `apps/desktop` + `tsc -p e2e --noEmit` (đều sạch), `vitest run tools` (258 qua).
- `git status --short` cuối phiên: (trống, cây làm việc sạch, giống đầu phiên)
- SHA cuối phiên: `885534549808f42aec7f9af5743bbf86642ee4bd` (không đổi)
- Giờ xong: 01:03 15/10/2026 (giờ địa phương +07:00)
