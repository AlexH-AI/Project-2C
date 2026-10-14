XONG — Codex gói F, 2026-10-14 21:47:11 (Asia/Saigon)

# Deep review Phase 1–6 — Codex Gói F

## 1. Thông tin phiên

- Bên: Codex, reviewer độc lập; gói F — Xuyên gói, bloat / hiệu năng, công cụ.
- SHA đầu phiên: `885534549808f42aec7f9af5743bbf86642ee4bd` (đúng SHA ghim `8855345`).
- `git status --short` đầu phiên: rỗng.
- Giờ bắt đầu: **2026-10-14 19:16:44 (Asia/Saigon)**. Lúc bắt đầu là phiên mới; F chưa có; A–E đều có và dòng đầu XONG.
- Phiên làm tiếp: **2026-10-14 21:44 (Asia/Saigon)**, từ bước kiểm cuối báo cáo sau khi kiểm duyệt tự động không thực thi lệnh vì workspace hết credit. Giữ nguyên hai phát hiện, probe, số đo và kết luận đã ghi; chỉ kiểm lại SHA/trạng thái Git, cấu trúc, chứng cứ và hoàn tất trạng thái báo cáo.
- Chỉ đọc repo/common và kết quả của chính Codex. Báo cáo/probe/log ở `C:/workspace/deep-review-1-6/codex/F.md` và `codex/F/`. Không sửa sản phẩm, không commit, Issue, PR hay merge, không gọi AI thật, không đọc key, không mở ChatGPT, không cài công cụ. Không đọc/list/tìm trong thư mục kết quả bên khác.
- Máy: **D13_ThinkPad (Office Laptop), Node v24.20.0**, Windows. Các phép đo chạy nối tiếp, sau khi build/test của phiên đã kết thúc; không có job nặng của chính phiên chạy song song. Không xác định được hoạt động của reviewer khác/tiến trình nền; giữ cả lượt có nhiễu.

## 2. Phạm vi đã đọc

Đọc trọn nguồn của **83 file code/cấu hình được bộ phân loại xếp F**; file sinh tự động `pnpm-lock.yaml` (4.628 dòng) được phân tích cấu trúc/integrity/nguồn và đối chiếu manifest, không nhận là review thủ công từng dòng lock. Toàn bộ F: **84 file, 3.761 dòng SP / 11.263 dòng test / 4.628 dòng sinh**. Số và range là dòng vật lý ở SHA ghim; nguồn inventory là `git ls-files` + `classifyFile/countLines`, lưu trong `F/exports-audit.json`.

| File | Loại | Dòng/phạm vi đọc |
|---|---|---|
| `.claude/hooks/handoff-context.mjs` | SP | 1–25 |
| `.claude/hooks/review-pr-hint.mjs` | SP | 1–29 |
| `.dependency-cruiser.cjs` | SP | 1–72 |
| `.githooks/pre-push` | SP | 1–13 |
| `.github/ISSUE_TEMPLATE/config.yml` | SP | 1–1 |
| `.github/ISSUE_TEMPLATE/task.yml` | SP | 1–73 |
| `.github/workflows/ci.yml` | SP | 1–148 |
| `apps/desktop/vite.config.ts` | SP | 1–29 |
| `e2e/anchor.ts` | test | 1–7 |
| `e2e/appointment-outcome.spec.ts` | test | 1–386 |
| `e2e/appointments.spec.ts` | test | 1–890 |
| `e2e/backup.spec.ts` | test | 1–194 |
| `e2e/chart.spec.ts` | test | 1–69 |
| `e2e/customer-ai-web.spec.ts` | test | 1–341 |
| `e2e/customer-ai.spec.ts` | test | 1–790 |
| `e2e/customer-appointments.spec.ts` | test | 1–143 |
| `e2e/customer-forms.spec.ts` | test | 1–268 |
| `e2e/customer-kyc.spec.ts` | test | 1–160 |
| `e2e/customer-policies.spec.ts` | test | 1–166 |
| `e2e/customers.spec.ts` | test | 1–156 |
| `e2e/data-table.spec.ts` | test | 1–182 |
| `e2e/demo-data.spec.ts` | test | 1–71 |
| `e2e/dialog-keyboard.spec.ts` | test | 1–188 |
| `e2e/full-cycle.spec.ts` | test | 1–360 |
| `e2e/guide/check.guide.ts` | test | 1–21 |
| `e2e/guide/links.ts` | test | 1–56 |
| `e2e/guide/shots.guide.ts` | test | 1–213 |
| `e2e/navigation.spec.ts` | test | 1–177 |
| `e2e/overview.spec.ts` | test | 1–234 |
| `e2e/perf/probe.perf.ts` | test | 1–452 |
| `e2e/perf/stats.spec.ts` | test | 1–146 |
| `e2e/perf/stats.ts` | test | 1–212 |
| `e2e/period-picker.spec.ts` | test | 1–301 |
| `e2e/reports.spec.ts` | test | 1–238 |
| `e2e/screen-error.spec.ts` | test | 1–73 |
| `e2e/seed-timing.spec.ts` | test | 1–19 |
| `e2e/seeded-snapshot.spec.ts` | test | 1–56 |
| `e2e/seeded-snapshot.ts` | test | 1–12 |
| `e2e/serve.mjs` | test | 1–43 |
| `e2e/settings-ai.spec.ts` | test | 1–337 |
| `e2e/smoke.spec.ts` | test | 1–36 |
| `e2e/support.ts` | test | 1–303 |
| `e2e/team.spec.ts` | test | 1–380 |
| `e2e/theme.spec.ts` | test | 1–74 |
| `e2e/trash.spec.ts` | test | 1–200 |
| `eslint.config.js` | SP | 1–48 |
| `packages/ui/scripts/check-tokens.ts` | SP | 1–37 |
| `playwright.config.ts` | test | 1–47 |
| `playwright.guide.config.ts` | test | 1–38 |
| `playwright.perf.config.ts` | test | 1–19 |
| `pnpm-lock.yaml` | sinh | 1–4.628 (phân tích cấu trúc) |
| `pnpm-workspace.yaml` | SP | 1–7 |
| `tools/bootstrap.ps1` | SP | 1–211 |
| `tools/codemap-core.mjs` | SP | 1–200 |
| `tools/codemap-core.test.mjs` | test | 1–197 |
| `tools/codemap.mjs` | SP | 1–95 |
| `tools/eval-ai-core.mjs` | SP | 1–712 |
| `tools/eval-ai-core.test.mjs` | test | 1–1.023 |
| `tools/eval-ai.mjs` | SP | 1–57 |
| `tools/fixtures/ai-eval.mjs` | test | 1–314 |
| `tools/handoff.mjs` | SP | 1–160 |
| `tools/load-data-core.mjs` | SP | 1–103 |
| `tools/load-data-core.test.mjs` | test | 1–162 |
| `tools/load-data.mjs` | SP | 1–61 |
| `tools/merge-pr.mjs` | SP | 1–158 |
| `tools/pr-core.mjs` | SP | 1–294 |
| `tools/pr-core.test.mjs` | test | 1–661 |
| `tools/pr-status.mjs` | SP | 1–136 |
| `tools/retro-core.mjs` | SP | 1–242 |
| `tools/retro-core.test.mjs` | test | 1–169 |
| `tools/retro.mjs` | SP | 1–56 |
| `tools/review-hint-core.mjs` | SP | 1–27 |
| `tools/review-hint-core.test.mjs` | test | 1–42 |
| `tools/session-core.mjs` | SP | 1–120 |
| `tools/session-core.test.mjs` | test | 1–199 |
| `tools/session-end.ps1` | SP | 1–78 |
| `tools/session-end.test.mjs` | test | 1–69 |
| `tools/session-io.mjs` | SP | 1–14 |
| `tools/session-start.ps1` | SP | 1–72 |
| `tools/size-report-core.mjs` | SP | 1–358 |
| `tools/size-report-core.test.mjs` | test | 1–299 |
| `tools/size-report.mjs` | SP | 1–48 |
| `tools/status.mjs` | SP | 1–77 |
| `vitest.config.ts` | test | 1–70 |

Đọc thêm các file không tính vào số dòng F: `package.json`, `.nvmrc`, `.editorconfig`, `.gitattributes`, `.gitignore`, `.prettierrc.json`, `.prettierignore`, `tsconfig.base.json`, 5 manifest package, `e2e/tsconfig.json`; `.claude/{settings.json,launch.json}`, 4 rules, 2 commands; `.github/pull_request_template.md`; ba fixture giả `tools/fixtures/retro/*.jsonl`. Các skill vendored/quy trình phát triển trong `.claude/skills` không được áp dụng làm nghi thức của phiên (phần quy trình nằm ngoài mục tiêu plan §1); phần thực thi hook đã đọc ở bảng trên.

Nguồn đúng và nền: `common/prompt-codex.md`; `plan.md` §1/3/4/5/6/10; `known.md` OPEN/ACCEPTED/K1–K17; `baseline.md`; `perf/perf-ref.json`; CLAUDE gốc và toàn bộ 5 CLAUDE package; CONTEXT; Phase 6 §4.1/4.2/5/6.3; `docs/metrics/phase-6.md`; `e2e/perf/README.md`; bảng Node ở `docs/metrics/phase-4.md` chỉ để biết phép đo, không dùng làm ngưỡng cùng máy. Gói F được phép đọc báo cáo Codex A–E: đã đọc phần phát hiện và dùng kết quả trong phạm vi kết luận, không sao chép thành phát hiện mới. Không đọc báo cáo bên khác.

Điểm nối đọc thêm: db `index.ts`, `database.ts` phần mở/cache/persist, `backup.ts` import/export, `team.ts` lệnh tạo/kiểm vai trò, `customers.ts` tạo/cập nhật/xóa/khôi phục, `appointments.ts` danh sách/lệnh/kiểu outcome, `policies.ts` toàn luồng tiền/xóa/khôi phục, `kyc.ts` chữ ký note/fact, `ai-analyses.ts` đọc/trạng thái; domain `kyc-gate.ts`, chỉ số/kỳ qua public API. App `tables.ts`, `app-data.ts` mở/S-2/save/export, `ai-analysis.ts` toàn bộ, `KycIntelligence.tsx` startWeb và state, `KycWebSession.tsx` check/copy, `reports-view.ts`, `team-compare-view.ts`, `report-workbook.ts`, `appointments-view.ts` các hàm được đo. Rust `ai.rs:225–276` (hợp đồng reply), `adapter.ts`/`run.ts`/`mock-adapter.ts` của ai. Không nhận là đã đọc lại trọn mọi file A–E trong F.

## 3. Phát hiện

### CX-F1 — Adapter eval có thể ghi key được server trả vào báo cáo

ID: CX-F1  
Mức: **Low**  
Trục: **S**  
Vị trí: `tools/eval-ai-core.mjs:148`, `:155`, `:99`, `:703` (8855345)  
Tình trạng: **CONFIRMED**

Mô tả: Adapter eval không kiểm key trong `content` của HTTP thành công; `serverMessage` chỉ che nguyên chuỗi secret. Khác lớp reply/mask của Rust, output hoặc error của server có thể đưa key vào báo cáo eval/partial, dù đầu file khẳng định key không bao giờ được ghi ra kết quả.

Tái hiện / bằng chứng: `node C:/workspace/deep-review-1-6/codex/F/probe-eval.mjs` → exit 0. Key hoàn toàn giả `sk-F-review-fake-key-9Az`; `fetch` là hàm trả `Response` giả, không mở socket. HTTP 200 trả content bằng key: `evalMain` exit 0, file báo cáo **22.845 byte chứa nguyên key**, còn log thành công không chứa key. HTTP 401 có percent-encode key: `decodeURIComponent(serverMessage) === fakeKey` vẫn true. Nguồn/kết quả: `F/probe-eval.mjs`, `F/eval-results.json`, `F/eval-probe.log`, `F/fake-key-report.md` (chỉ key giả).

```text
secret.exit = 0
secret.resultContainsWholeFakeKey = true
secret.outputBytes = 22845
escaped.code = AI_UNAUTHORIZED
escaped.encodedWholeKeyRemains = true
```

Ảnh hưởng: Cần server bất thường trả lại secret; Owner có thể mang secret theo báo cáo eval vào repo public. Không có bằng chứng key thật đã lộ hoặc xảy ra qua thao tác bình thường, nên Low theo thước, không nâng Critical.

Đề xuất: Đồng bộ bảo vệ content/error với hợp đồng Rust: chặn key trong phản hồi 2xx và che các biểu diễn JSON/percent trước khi dựng kết quả, partial, final hay log fallback. Thêm fixture phản hồi dùng chung để tránh adapter JS và Rust lệch tiếp. Ước **≤150 dòng SP** ở `eval-ai-core.mjs`, khoảng 60–100 dòng test; giữ `eval-ai-core.test.mjs`, đối chiếu bộ test secret Rust. Không thêm dependency/dịch vụ.

### CX-F2 — Eval bỏ đường thử lại của phản hồi null + length

ID: CX-F2  
Mức: **Low**  
Trục: **C**  
Vị trí: `tools/eval-ai-core.mjs:143`, `:148`; hợp đồng đối chiếu `apps/desktop/src-tauri/src/ai.rs:246` (8855345)  
Tình trạng: **CONFIRMED**

Mô tả: Rust chuyển `message.content = null` cùng `finish_reason = length` thành content rỗng + `finishReason: length` để runner xử lý câu trả lời bị cắt và thử lại. Adapter eval từ chối null bằng AI_BAD_RESPONSE và không truyền finishReason, nên phép eval không đi đúng luồng sản phẩm trong trường hợp reasoning model dùng hết token trước khi sinh content.

Tái hiện / bằng chứng: `node C:/workspace/deep-review-1-6/codex/F/probe-null-length.mjs` → exit 0. HTTP giả lần đầu null/length, lần hai JSON Mock hợp lệ. Eval: ERROR/AI_BAD_RESPONSE, **1 call**. Adapter đối chứng trả đúng cấu trúc Rust (content rỗng + length) qua cùng `runEval`/runner thật: **ACCEPTED, 2 call**, lần đầu V1. Đã đọc nhánh Rust ở 246–265, không tuyên bố đã gọi dịch vụ/model thật. `F/null-length-results.json`, `F/null-length.log`.

```json
{"evalStatus":"ERROR","evalError":"AI_BAD_RESPONSE","evalCalls":1,
 "appStatus":"ACCEPTED","appCalls":2,"appFirstIssues":["V1"]}
```

Ảnh hưởng: Phản hồi suy biến nhưng được app hỗ trợ có thể làm eval ghi sai số ACCEPTED, số lần thử, thời gian/token. Đây là sai hợp đồng công cụ, không phải app bị hỏng đường thử lại; Low theo thước.

Đề xuất: Đọc `choice`, xử lý null/length và finishReason ngắn theo hợp đồng Rust; thêm ca adapter → runner → báo cáo với null/length rồi trả lời đúng. Ước **≤40 dòng SP / ≤60 dòng test**; giữ test HTTP/status/size/retry hiện có, không đổi G5/golden.

Hai mục mới, không có mục tương ứng trong `common/known.md`. Không có Critical/High/Medium mới trong F. Probe JSON **đầy đủ** kèm length vẫn ACCEPTED ở cả hai adapter — không phải lỗi; giữ kết quả `cut` trong eval-results.json để tránh báo nhầm. Các lỗi chữ ký trong harness được ghi ở phụ lục, không tính thành lỗi sản phẩm.

## 4. Bloat

| Đã chạy / đọc | Phạm vi/dữ liệu | Kết quả | ID |
|---|---|---|---|
| `tsc -p apps/desktop --noEmit --noUnusedLocals --noUnusedParameters` | App và các package được import | exit0; cấu hình không đổi | — |
| Cùng flags với `-p e2e` và `-p packages/ui/tsconfig.scripts.json` | Mọi e2e/perf/guide/helper và script UI | exit0 cả hai | — |
| AST `listExports` + `rg -l -w --fixed-strings` **từng tên** | 201 file source, cả app/packages/tools; consumer search thêm e2e và hook `.claude` | **1.019 export (718 runtime), 1.007 tên**; 12 runtime candidate chỉ có hit trong file khai báo; 78 type candidate như vậy | — |
| Kiểm từng candidate theo barrel/entrypoint | 12 runtime candidate | `readHandoff` có hook gọi, đã loại; `writeHandoff` vừa API vừa CLI nội bộ; `markName` đã báo CX-E5; APPOINTMENT_TODAY là fixture; 3 enum/list schema và 6 constant tools chỉ dùng nội bộ. Không đo được chi phí riêng, không tự biến thành task bloat mới | CX-E5 tham khảo, không đếm lại |
| `pnpm codemap --check` | 5 bản đồ export/route | exit0, up to date; dùng --check nên không ghi CLAUDE | — |
| `pnpm lint:deps` | Toàn app/packages | **309 module / 1.244 dependency, 0 violation**, exit0 | — |
| Manifest + lock và nơi dùng trực tiếp | 6 manifest; lock 4.628 dòng | **492 integrity SHA-512**, 0 nguồn git, 0 custom tarball; dependency trực tiếp có chỗ dùng/build/type. Không cài gì | — |
| Đọc/tìm code lặp ≥3 chỗ | `plain`/slug, normalize, badge, loader resolve, status AI | plain/badge/2 loader/random ID đã KNOWN; normalize có khác biệt có chủ ý. Chưa có chi phí/hậu quả mới để báo lại | KNOWN, không ID mới |
| `pnpm build:web` | SHA 8855345; chỉ output ignore | exit0; Vite 1,22 s; tổng **2.364.283 byte thô / 697.071 gzip**, Δ0 baseline | — |
| `node tools/size-report.mjs --json` | Toàn git-tracked source + build | 32.216 SP / 38.356 test / 4.917 generated / 380 file; không có file chưa xếp gói; F đúng bảng §2 | — |
| Lazy chunk / exe | Build mới; exe common chỉ đọc metadata | ExcelJS và chart nạp động; chart gzip 172.450 <250 KiB; exe **5.414.400 byte**, Δ0 common/baseline | — |

| Chunk | Thô byte | Gzip byte | Δ với baseline |
|---|---:|---:|---:|
| assets/chart.js | 513.302 | 172.450 | 0 |
| assets/exceljs.min.js | 929.569 | 255.572 | 0 |
| assets/index.css | 28.364 | 6.412 | 0 |
| assets/index.js | 891.942 | 262.010 | 0 |
| assets/rolldown-runtime.js | 1.106 | 627 | 0 |
| **Tổng** | **2.364.283** | **697.071** | **0** |

Vite vẫn cảnh báo chunk >600kB ở index/ExcelJS, đúng hiện trạng baseline. Không có phát hiện bloat mới có chi phí đo được, không thêm đề xuất refactor chỉ để đạt số lượng. Nếu lần chạm sau thu hẹp 6 constant tools (`LOAD_SCALE`, `REVIEW_NOTES`, `BODY_TARGET`, `BODY_MAX`, `DEFAULT_DIST`, `DEFAULT_EXE`), chỉ cần bỏ 6 từ khóa export trong 4 file (~6 dòng SP); giữ các test load-data/pr/session/size, hành vi không đổi. Đây là lựa chọn dọn API, không chứng minh giảm bundle/exe. Type bị xóa lúc build; không gọi nó là bloat runtime. `exports-audit.json` là bảng hit từ vựng, không phải bộ phân tích reachability hoàn chỉnh; đã nói rõ các trường hợp dynamic/barrel.

## 5. Hiệu năng

Dữ liệu chuẩn `common/load/load-2026-10-12-seed6.p2cbackup`, **16.034.641 byte**, tables SHA-256 **1e69a97f664708d91932a1158c3a9ddd4e4d4aebb689f9c912ac3c4d0962e3fd** (assert trong probe); nhập bằng `importBackup` thật. Tổng có xóa mềm: **1.496 KH / 10.414 lịch / 54 nhân sự / 103 phân tích AI**; SQLite 13.455.360 byte. Sống: 4 team / 51 người / 1.481 KH / 10.252 lịch / 1.674 HĐ. Không nhầm tổng với số sống.

Theo `common/plan.md` §6: F phải đo lại bảng Node và phần AI; **không so Node với số Phase 4 khác máy/probe cũ**. Vì vậy trường `limit` lấy từ bảng cũ trong raw JSON chỉ là mốc tiện ghi ban đầu, không dùng để chấm P hay tuyên bố ngưỡng v1.0. Node component time cũng không đồng nhất thời gian thao tác → frame trên exe. Chấm thao tác màn theo bảng exe tham chiếu, không cộng thời gian từ các lần chạy khác nhau.

Mỗi hàm 1 lần warmup rồi 15 lần (import 5); getter Tables warm trước hàm thuần. Bổ sung kỳ Tháng/phần AI/listAppointments lượt 3:25 lần mỗi hàm. Dữ liệu bất biến giữa các lần. Tất cả số thô/min/max/samples lưu sau từng hàm vào JSON; mỗi probe nối tiếp, không có build/unit của phiên chạy cùng lúc.

| Đã đo trên dữ liệu tải | Lần | Trung vị ms | Min–max ms | ID P |
|---|---:|---:|---:|---|
| importBackup | 5 | 783,854 | 766,747–1.075,727 | — |
| listAppointments | 15 | 73,825 | 60,166–90,864 | — |
| teamCompare-year | 15 | 4,466 | 3,163–7,344 | — |
| reportRows-year | 15 | 11,912 | 9,365–21,119 | — |
| monthGrid | 15 | 0,792 | 0,7–1,949 | — |
| countRecords | 15 | 6,287 | 5,69–9,775 | — |
| listTrash | 15 | 59,332 | 54,612–103,072 | — |
| teamCompare-month | 25 | 1,918 | 1,617–3,788 | — |
| reportRows-month | 25 | 7,08 | 6,35–8,595 | — |
| profile-AI-db-reads | 25 | 0,383 | 0,337–0,657 | — |
| profile-AI-view-history-content | 25 | 0,062 | 0,054–0,161 | — |
| listAppointments-run3 | 25 | 54,357 | 51,277–96,212 | — |

Lượt1 bị nhiễu (giữ `perf-node-run1.json/log`): import 1.543,577ms; listAppointments 94,733ms; reportRows 17,023ms; listTrash 84,101ms. Lượt2 và lượt 3 giảm rõ; không suy ra hồi quy từ lượt 1. `listTrash`: **117 dòng**, **444 lần gọi prepare/exec** trong một lượt đọc (wrapper đếm API SQLite, không nói đây là 444 truy vấn mạng). Việc refs đọc toàn bảng/N+1 đã nằm trong KNOWN #539; lần đo mới chưa vượt ngưỡng hoặc cho hậu quả nặng hơn để tạo phát hiện P.

AI chọn KH sống nhiều phân tích nhất trong bộ tải, **2 phân tích**, đo cả đọc profile/versions/analyses và dựng panel/history/content của các output ACCEPTED. Không gọi adapter mạng.

**Exe tham chiếu cùng máy, không phải đo mới trong F.** Dùng nguyên `common/perf/perf-ref.json` ở 8855345/Office Laptop, 09:28–09:30 ngày 14/10, data/hash trên; plan§6 cho phép không chạy lại probe. F không mở exe/debugger, không chiếm 9222/4173, không đo song song bên khác. Các ngưỡng ngoài Nhóm C lấy `docs/metrics/phase-6.md` (Owner 13/10). Bảng dưới giữ mọi thao tác, không chỉ chọn các dòng nhanh.

| Thao tác (tham chiếu) | Lần | Trung vị | Min–max | Ngưỡng v1.0 | ID P |
|---|---:|---:|---|---|---|
| app.open-data | 1 | 272,5 ms | 272,5–272,5 ms | < 600 ms đạt | — |
| backup.read | 5 | 886,1 ms | 841–897,8 ms | < 2.000 ms đạt | — |
| backup.import | 5 | 51,1 ms | 37,9–54,6 ms | < 500 ms đạt | — |
| db.save | 15 | 160,4 ms | 156,4–192,9 ms | < 400 ms đạt | — |
| reload.overview | 5 | 348,8 ms | 332,5–398,6 ms | < 500 ms đạt | — |
| reload.appointments | 5 | 335,8 ms | 327,5–345,8 ms | < 500 ms đạt | — |
| reload.customers | 5 | 240,5 ms | 231,7–255,2 ms | < 500 ms đạt | — |
| reload.reports | 5 | 307 ms | 304,7–318,3 ms | < 500 ms đạt | — |
| reload.team | 5 | 289,3 ms | 283,3–304,3 ms | < 500 ms đạt | — |
| reload.settings | 5 | 206,9 ms | 201,9–231,1 ms | < 500 ms đạt | — |
| appointments.period-day | 5 | 10,2 ms | 9,2–11,6 ms | < 200 ms đạt | — |
| appointments.period-week | 5 | 14,4 ms | 13,7–15,4 ms | < 200 ms đạt | — |
| appointments.period-month | 5 | 14,8 ms | 14,1–16,4 ms | < 200 ms đạt | — |
| appointments.period-year | 5 | 18,2 ms | 18–26,5 ms | < 200 ms đạt | — |
| appointments.sort-date-asc | 5 | 20,5 ms | 17,1–24,1 ms | < 200 ms đạt | — |
| appointments.sort-date-desc | 5 | 13,1 ms | 11,9–15,5 ms | < 200 ms đạt | — |
| appointments.select-row-year | 5 | 7,5 ms | 6,1–9,8 ms | < 200 ms đạt | — |
| appointments.select-day-month | 5 | 7,4 ms | 7,1–9,1 ms | < 200 ms đạt | — |
| appointments.select-row-month | 5 | 6,1 ms | 5,5–6,3 ms | < 200 ms đạt | — |
| customers.view-table | 5 | 20,2 ms | 19,3–21 ms | < 200 ms đạt | — |
| customers.sort-name | 5 | 21,7 ms | 19,3–22,9 ms | < 200 ms đạt | — |
| customer.open-ai | 5 | 23,1 ms | 21,9–25,3 ms | < 200 ms đạt | — |
| customer.ai-history | 5 | 6,5 ms | 2,3–15,8 ms | < 200 ms đạt | — |
| overview.filter-year | 5 | 16,8 ms | 15,8–22,4 ms | < 200 ms đạt | — |
| overview.filter-month | 5 | 16 ms | 14,4–17,9 ms | < 200 ms đạt | — |
| reports.filter-year | 5 | 9,5 ms | 9,3–10,1 ms | < 200 ms đạt | — |
| reports.filter-month | 5 | 8,2 ms | 7,6–9,7 ms | < 200 ms đạt | — |
| reports.table-re | 5 | 16,4 ms | 15,5–17,8 ms | < 200 ms đạt | — |
| trash.open | 5 | 91,2 ms | 90,5–100,3 ms | < 200 ms đạt | — |
| trash.kind-appointments | 5 | 8,2 ms | 6,9–16,2 ms | < 200 ms đạt | — |
| memory.js-heap | 1 | 16,4 MB | 16,4–16,4 MB | ≤ 21 MB đạt | — |
| reports.export-excel | 5 | 36,4 ms | 34,5–93,8 ms | < 500 ms đạt | — |
| backup.export | 5 | 483,8 ms | 465,7–486,7 ms | < 1.000 ms đạt | — |
| appointments.next-month | 5 | 116,8 ms | 114,2–128,6 ms | < 300 ms đạt | — |
| appointments.next-year | 5 | 120,1 ms | 118,7–136,2 ms | < 300 ms đạt | — |

Kỳ Năm tạo hẹn tiếp theo so Tháng ở reference: chênh3,3ms (<50ms). 35 operation reference đạt ngưỡng tương ứng; kích thước/bộ nhớ không tăng so nền theo common/baseline. Mở lần đầu không đo mới, giữ K15; số Home PC không so trực tiếp với lượt này. Không có phát hiện P mới đủ điều kiện; không kết luận Node là số đo UI, hay lượt có nhiễu là hồi quy.

## 6. Bảng đếm mức × trục (chỉ phát hiện F mới)

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical |0|0|0|0|0|0|0|0|0|0|
| High |0|0|0|0|0|0|0|0|0|0|
| Medium |0|0|0|0|0|0|0|0|0|0|
| Low |0|1|0|0|1|0|0|0|0|2|
| Nit |0|0|0|0|0|0|0|0|0|0|
| Tổng |0|1|0|0|1|0|0|0|0|2|

**CONFIRMED 2/2; PLAUSIBLE 0/2 (0%); KNOWN 0 phát hiện mới.** CX-F2 có hệ quả chất lượng test/eval nhưng chỉ đếm trục chính C. Không nhân bản các phát hiện A–E hay KNOWN.

## 7. Đã xét, không thấy

| Trục | Đã đọc/chạy gì và kết luận |
|---|---|
| E | Đã xét, không thấy lỗi E mới trong F: CLI args, ngày neo/seed/size, concurrent claim eval, lỗi ghi partial/final, callback/signal, export đang chờ ghi khi DB thay. 258 test tools và probe crossflow. Các biên PERF_RUNS/start NaN/zero base đã KNOWN, không báo lại. |
| C | Có CX-F2. Ngoài nó, đã xét không thấy lỗi mới ở phân loại 6 gói, route/export map, CI paths ↔ CODE_DOCS, needsExe/risk/review-head, load fixtures ↔ golden. Luồng đổi RE và xóa/khôi phục/backup qua domain/db/reports/Excel khớp. Mâu thuẫn golden vai trò của CX-A2 giữ nguyên để Owner phân xử, không tự sửa nguồn đúng. |
| D | Đã xét, không thấy lỗi D mới: tạo → KYC → RF → HĐ → đổi RE → xóa HĐ → xóa KH → backup/import → restore KH → restore HĐ → backup/import; tiền, chủ sở hữu và nhóm bằng kỳ vọng viết tay. S2-5: xuất chờ ghi rồi thay DB giữ snapshot cũ đủ, file DB mới mở lại có 0 KH. Không tuyên bố đã thử mất điện/ổ đầy hệ điều hành trong F. |
| G | Đã xét, không thấy lỗi G mới: eval dùng runner/validator thật, golden fixtures và tiêu chí tự động/đọc tay, không fallback Mock khi HTTP lỗi. AI Mock sau restore vẫn CURRENT, không tự lưu đề xuất. CX-C1/C2/C3 đã ở gói C; không báo lại. |
| S | Có CX-F1. Ngoài nó, đã xét không thấy lỗi mới ở bounded body/no redirect, process argv helpers/exit codes, action CI ghim SHA, lệnh Tauri giả không key thật, HTML/fence/table escaping của eval. Không chạy bootstrap cài đặt, không chạy gh/merge/handoff hay gọi mạng AI. |
| P | Đã xét, không thấy phát hiện P mới theo bảng §5: đo lại các hàm Node của Phase 4 và listTrash/AI, giữ nhiều lượt để xét nhiễu; mọi thao tác màn exe reference dưới ngưỡng. Không suy đoán bậc hai khi chưa có số. |
| B | Đã xét, không thấy bloat mới có chi phí đo được: AST và rg từng export, codemap/noUnused/deps/manifest/lock/chunk/exe; code lặp đối chiếu KNOWN. Candidate export và refactor tùy chọn ở §4 không được coi là đã giảm runtime. |
| T | Đã xét, không thấy lỗ test mới để đếm riêng ngoài hệ quả CX-F1/F2: đọc hết test tools/e2e/perf/guide, 9 file/258 test công cụ xanh. Mutation phân loại AI bị 7 ca giết; control 68/68. E2E full-cycle có kỳ vọng số viết tay và kiểm roundtrip toàn snapshot; stand-in asExe không kiểm độ bền file Rust, phần này tham khảo test Rust/baseline B. Biên sessionId chứa 1984 đã KNOWN, không báo lại. |
| A | Đã xét, không thấy lỗi A mới riêng F: e2e role/label/focus/keyboard, locale/font/offline/chart, nhãn tiếng Việt và i18n tại điểm nối. Các thiếu focus/sai hiển thị đã ở C/D/E, không nhân bản. Không tuyên bố đã kiểm pixel/contrast hay trình đọc màn hình thật toàn app lần nữa trong F. |

## 8. Phụ lục nguồn probe/test/đột biến và trạng thái cuối

Mọi nguồn dưới ở `C:/workspace/deep-review-1-6/codex/F/`; không patch repo. Trạng thái giữa phiên được ghi dần trong F.md; bản trước sắp lại báo cáo giữ ở `session-progress.md`.

| Nguồn/lệnh | Kết quả/giới hạn |
|---|---|
| `loader.mjs` | Node registerHooks cho TS extensionless và raw migration; chỉ import nguồn repo, không cài loader/dependency. |
| `probe-eval.mjs`, `eval-results.json`, `eval-probe.log`, `fake-key-report.md` | exit 0; hai đường secret ở CX-F1; đối chứng full JSON + length đúng ở cả hai. Key/HTTP đều giả; API file của evalMain là Map RAM, chỉ bản chép báo cáo giả được ghi vào F. |
| `probe-null-length.mjs`, `null-length-results.json`, `null-length.log` | exit 0; 1 call/ERROR so với 2 call/ACCEPTED ở CX-F2. |
| `probe-crossflow.mjs`, `crossflow.json`, `crossflow.log`, `crossflow.xlsx` | exit 0; Tổng quan/Báo cáo/Excel cùng doanh số 485.500.000; RA giữ tiền, RB có N2=1; roundtrip toàn ReportRows bằng nhau; Mock CURRENT sau restore. Xuất S2-5: file cũ 1 KH, app mới 0 KH, bytes mở lại 0 KH. Storage RAM, không phải test crash Rust. |
| `crossflow-harness-error.log` | Lần đầu sai chữ ký recordKycNote(db,customerId,command); sửa probe ngoài repo rồi exit 0. Không là phát hiện sản phẩm. |
| `probe-perf.mjs`, `perf-node.json`, `perf-node.log`, `perf-node-run1.json`, `perf-node-run1.log` | Bảng Node và listTrash trên load chuẩn; assert hash; mỗi hàm 5/15 lần; giữ 2 lượt để biết nhiễu; kết quả §5. |
| `probe-ai-month.mjs`, `perf-ai-month.json`, `perf-ai-month.log` | 25 lần phần AI/kỳ Tháng/listAppointments lượt 3 trên cùng load. |
| `perf-ai-harness-error.log` | Lần đầu truyền profile thay facts vào evaluateKycGate; sửa harness rồi exit 0, không tính là lỗi sản phẩm. |
| `audit-exports.mjs`, `exports-audit.json`, `exports.log` | AST/rg 1.007 tên; có `.claude` để không bỏ sót hook consumer; 201 file/1.019 export; inventory F trong cùng JSON. |
| `unused-desktop.log`, `unused-e2e.log`, `unused-ui-scripts.log` | tsc noUnused/noEmit exit 0 cả 3; desktop nhập các package, UI scripts kiểm riêng. |
| `codemap.log`, `deps.log`, `build.log`, `size.json`, `lock-audit.json` | codemap --check/deps/build/size exit 0; bundle và dependency ở §4; lock có 492 integrity SHA-512, không nguồn git/custom tarball. |
| `reference-threshold-check.json` | 35 dòng exe tham chiếu được kiểm lại với ngưỡng v1.0, đều đạt; không phải phép đo exe mới. |
| `tools-tests.log` | `pnpm exec vitest run tools`: **9 file/258 test passed**, 13,80 s. Test session-end chỉ dùng clone và bare remote tạm riêng trong tmp, không ghi Git của repo đang review hay push server. |
| `mutations/control/{size-report-core.mjs,size-report-core.test.mjs}` | Bản chép đối chứng: **68/68 PASS**. |
| `mutations/no-ai-classification/{size-report-core.mjs,size-report-core.test.mjs}` | Chỉ đổi isAppAiFile thành false: **BỊ GIẾT**, 7 FAIL/61 PASS; lỗi phân loại C → B/D/E/unassigned đúng counterexample. Không có mutant sống trong lần thử F. |
| `mutations/vitest.config.mjs`, `mutations/results.log` | Chạy bản chép ngoài repo với Vitest có sẵn; combined exit 1 **như mong đợi** (1 file pass/1 file fail, 129 pass/7 fail). Không phải test sản phẩm hiện đang đỏ. |
| `final-qa.log` | Kiểm cuối phiên làm tiếp: SHA ghim/trạng thái Git, 9 mục/2 phát hiện, đủ 44 file chứng cứ, JSON CX-F1/F2 khớp; kiểm lại dòng nguồn 99/143/148/155/703 của eval và Rust 246–265. Không chạy lại dịch vụ hay sửa repo. |
| `report-template.md`, `compose-report.mjs`, `session-progress.md` | Nguồn sắp bảng báo cáo và bản tiến độ; không phải code sản phẩm. |
| `common/baseline.md`, `common/perf/perf-ref.json` | Cổng ở SHA ghim: verify 110 file/2.755 test, Rust 91 test, E2E 210 pass, exe 5.414.400 byte. **Tham chiếu**, không nhận là chạy mới trong F. Plan §6 không bắt buộc chạy lại whole verify/e2e/exe probe. |

Không chạy `pnpm eval:ai`/`tools/eval-ai.mjs`; chỉ gọi hàm core với fetch giả. Không gọi Check connection bằng key thật. Không dùng PW_REUSE hay server của checkout khác. Không chép/xem report bên khác, không sửa spec/golden/mockup. Chỉ build/cache bị ignore trong repo; toàn bộ chứng cứ riêng ở F.

- SHA cuối phiên: `885534549808f42aec7f9af5743bbf86642ee4bd`.
- `git status --short` cuối phiên: **rỗng**, như đầu phiên.
- `git diff --stat` cuối phiên: **rỗng**.
- Giờ xong: 2026-10-14 21:47:11 (Asia/Saigon), sau kiểm cấu trúc báo cáo và trạng thái Git lần cuối.

## 9. Kết luận v1.0

**SẴN SÀNG cho v1.0 ở SHA `8855345` theo phạm vi lỗi chặn được Codex kiểm trong lượt 1.** F không xác nhận Critical/High/Medium; A–E của chính Codex cũng không có mức đó. Hai lỗi mới F là Low ở công cụ eval/biên server, không phải mất/sai dữ liệu qua thao tác bình thường của app. Các cổng nền xanh, luồng xuyên gói mới đã chạy khớp số/backup/AI, kích thước không đổi, thao tác màn trong số tham chiếu cùng máy đạt ngưỡng.

Kết luận này không có nghĩa mọi lệch hợp đồng đã hết: các Low/Nit A–E và CX-F1/F2 còn ở SHA ghim; nguồn golden mâu thuẫn của CX-A2 cần Owner phân xử; chất lượng test/guardrail tại các biên đã ghi giữ nguyên. Ưu tiên đồng bộ và thêm test hợp đồng eval với Rust trước lần eval tiếp theo hoặc trước công khai báo cáo eval. Không tự nâng các Low thành mức chặn hoặc đổi nguồn đã duyệt.

Đây là đánh giá reviewer độc lập ở SHA ghim, **không phải quyết định phát hành/G7**. Theo spec §6.1, kết luận phát hành cuối thuộc phiên tổng hợp sau khi kiểm lại bằng chứng, lượt 2 và các cổng Owner. F không tạo Issue, không đề xuất merge và dừng sau báo cáo.
