XONG — codex gói C, 2026-10-13 23:06:05 +07:00

# Deep review Phase 1–6, lượt 1 — Codex, Gói C

## 1. Thông tin phiên

- Bên: Codex. Gói C — AI. Phiên mới.
- SHA đầu phiên: 885534549808f42aec7f9af5743bbf86642ee4bd.
- Giờ bắt đầu: 13/10/2026 22:40:18 +07:00 (Asia/Bangkok).
- Git status đầu phiên: ?? .agents/ · ?? .codex/ · ?? AGENTS.md.
- A và B đã có báo cáo hoàn tất; chỉ kiểm tên đầy đủ và dòng đầu, không đọc nội dung.
- Chỉ đọc repo ở SHA ghim, common và thư mục báo cáo của chính Codex. Không đọc/liệt kê thư mục reviewer khác; không dùng subagent, không gọi AI thật, không đọc key.

## 2. Phạm vi đã đọc

Đã đọc 60/60 file theo classifyFile: 36 file sản phẩm (5.129 dòng), 24 file test/fixture (5.985 dòng, gồm test-support.ts). Vitest chạy 23 file *.test.*. Bảng dưới ghi toàn bộ khoảng dòng đã đọc; không chỉ đọc các file có diff.

| File | Đã đọc dòng | Loại |
|---|---:|---|
| apps/desktop/src/data/ai-analysis.test.ts | 1–967 | test |
| apps/desktop/src/data/ai-analysis.ts | 1–333 | product |
| apps/desktop/src/data/ai-jobs.test.ts | 1–113 | test |
| apps/desktop/src/data/ai-jobs.ts | 1–82 | product |
| apps/desktop/src/data/ai-tauri.test.ts | 1–108 | test |
| apps/desktop/src/data/ai-tauri.ts | 1–75 | product |
| apps/desktop/src/routes/SettingsAi.tsx | 1–387 | product |
| apps/desktop/src/routes/ai-error-view.test.ts | 1–73 | test |
| apps/desktop/src/routes/ai-error-view.ts | 1–66 | product |
| apps/desktop/src/routes/appointments/AppointmentAi.tsx | 1–86 | product |
| apps/desktop/src/routes/appointments/appointment-ai-view.test.ts | 1–183 | test |
| apps/desktop/src/routes/appointments/appointment-ai-view.ts | 1–49 | product |
| apps/desktop/src/routes/customers/KycExtraction.tsx | 1–180 | product |
| apps/desktop/src/routes/customers/KycHistory.tsx | 1–154 | product |
| apps/desktop/src/routes/customers/KycIntelligence.tsx | 1–572 | product |
| apps/desktop/src/routes/customers/KycWebSession.tsx | 1–191 | product |
| apps/desktop/src/routes/customers/ai-panel-view.test.ts | 1–1025 | test |
| apps/desktop/src/routes/customers/ai-panel-view.ts | 1–622 | product |
| apps/desktop/src/routes/customers/extraction-view.test.ts | 1–162 | test |
| apps/desktop/src/routes/customers/extraction-view.ts | 1–106 | product |
| apps/desktop/src/routes/customers/use-ai-job.ts | 1–53 | product |
| apps/desktop/src/routes/settings-ai-view.test.ts | 1–112 | test |
| apps/desktop/src/routes/settings-ai-view.ts | 1–87 | product |
| packages/ai/src/adapter.ts | 1–43 | product |
| packages/ai/src/blocklists.test.ts | 1–157 | test |
| packages/ai/src/blocklists.ts | 1–108 | product |
| packages/ai/src/code-points.test.ts | 1–51 | test |
| packages/ai/src/code-points.ts | 1–45 | product |
| packages/ai/src/errors.test.ts | 1–60 | test |
| packages/ai/src/errors.ts | 1–56 | product |
| packages/ai/src/extract-json.test.ts | 1–119 | test |
| packages/ai/src/extract-json.ts | 1–84 | product |
| packages/ai/src/index.ts | 1–11 | product |
| packages/ai/src/input.test.ts | 1–174 | test |
| packages/ai/src/input.ts | 1–29 | product |
| packages/ai/src/mock-adapter.test.ts | 1–232 | test |
| packages/ai/src/mock-adapter.ts | 1–112 | product |
| packages/ai/src/models.test.ts | 1–27 | test |
| packages/ai/src/models.ts | 1–35 | product |
| packages/ai/src/prompts/analysis.ts | 1–48 | product |
| packages/ai/src/prompts/connection.ts | 1–14 | product |
| packages/ai/src/prompts/discovery.ts | 1–43 | product |
| packages/ai/src/prompts/extraction.ts | 1–27 | product |
| packages/ai/src/prompts/prompts.test.ts | 1–55 | test |
| packages/ai/src/prompts/retry.ts | 1–63 | product |
| packages/ai/src/raw.d.ts | 1–5 | product |
| packages/ai/src/run.test.ts | 1–819 | test |
| packages/ai/src/run.ts | 1–428 | product |
| packages/ai/src/schema.test.ts | 1–344 | test |
| packages/ai/src/schema.ts | 1–356 | product |
| packages/ai/src/settings.test.ts | 1–94 | test |
| packages/ai/src/settings.ts | 1–86 | product |
| packages/ai/src/test-support.ts | 1–69 | test |
| packages/ai/src/text-match.ts | 1–74 | product |
| packages/ai/src/validator-blocklists.test.ts | 1–250 | test |
| packages/ai/src/validator-extraction.test.ts | 1–135 | test |
| packages/ai/src/validator.test.ts | 1–231 | test |
| packages/ai/src/validator.ts | 1–269 | product |
| packages/ai/src/web.test.ts | 1–425 | test |
| packages/ai/src/web.ts | 1–150 | product |

Ngoài bảng: package.json/tsconfig.json và CLAUDE.md của ai, CLAUDE.md của desktop; các chỗ nối AppData/AppDataContext, App/AppShell/Screen, CustomerProfile, kyc-view, SettingsBackup/Dialog, ai-analyses của db, Rust ai.rs (hợp đồng response/sanitization), i18n vi.ts, e2e/support.ts và các ca AI liên quan. Không làm lại review toàn bộ các gói này.

Tài liệu chuẩn: CLAUDE.md gốc, packages/ai/CLAUDE.md, apps/desktop/CLAUDE.md, CONTEXT.md, spec Phase 5 (§1–§14), prompt G5 (§1–§8, §10), golden ai-eval, ADR-0009 D-1/G5/W-1, spec Phase 6 §4.1/§5, metrics Phase 6, common plan (§1–§6 và quy tắc báo cáo)/KNOWN/baseline/perf-ref. Mockup ai.html §1–§4 và quyết định G3; phân biệt phần bổ sung W-1/G5 mới với ví dụ @1 cũ. Các lệch G3 đã nằm trong KNOWN không báo lại.

## 3. Phát hiện

### CX-C1 — Mock nhận “con số” thành số con

ID: CX-C1
Mức: Low
Trục: E (liên quan C/G)
Vị trí: packages/ai/src/mock-adapter.ts:78 (8855345)
Tình trạng: CONFIRMED
Mô tả: Regex trích xuất childrenCount nhận “9 con” bên trong “9 con số”, dù ghi chú nói về số liệu tài chính. V7 giữ đề xuất vì kiểu giá trị hợp lệ và đoạn quote đúng là chuỗi con của ghi chú.
Tái hiện / bằng chứng: node C:\workspace\deep-review-1-6\codex\C\ui-probe.mjs trên build web SHA ghim, Edge headless và lệnh Tauri/clipboard giả, toàn bộ HTTP ngoài bị chặn. Chọn Mock, thêm ghi chú “KH muốn kiểm tra 9 con số về thu nhập và tài sản trước buổi gặp.”, bấm AI trích xuất. ui-results.json ghi giao diện: AI đề xuất: Số con: 9 ("9 con"); dữ kiện hiện hành vẫn Số con: 2. Ảnh mock-con-so.png. Không pageerror.
Ảnh hưởng: RE thử trích xuất bằng Mock trên ghi chú có cụm “N con số” sẽ nhận đề xuất sai. Không tự ghi KYC; RE còn phải xác nhận/sửa nên mức Low, không có bằng chứng mất hay sai dữ liệu đã lưu.
Đề xuất: Loại mẫu “con số” khỏi regex của childrenCount; thêm ca âm trong mock-adapter.test.ts và ca giữ “có 2 con”. Khoảng 5–15 dòng SP + 15–30 dòng test, dưới 400 dòng SP; giữ schema/G5 và luồng xác nhận.

## 4. Bloat

| Đã chạy / đọc | Dữ liệu | Kết quả | ID |
|---|---|---|---|
| tsc --noUnusedLocals --noUnusedParameters, ai + desktop | SHA ghim | exit 0 cả hai; tsconfig đã bật cả hai cờ | — |
| pnpm codemap:check | Bản đồ export/route hiện có | đúng; không sinh/sửa CLAUDE.md | — |
| pnpm lint:deps | 309 module, 1.244 dependency | 0 vi phạm | — |
| pnpm build:web + node tools/size-report.mjs --json | Build SHA ghim | index 891.942/262.010 byte thô/gzip; tổng JS/CSS 2.364.283/697.071 byte, đúng baseline | — |
| rg từng tên export + kiểm import AST, export-probe.mjs | 210 khai báo export Gói C; quét repo cùng SHA | 43 không có named import sản phẩm bên ngoài; đều là type/API hoặc tên vẫn dùng nội bộ, không đồng nghĩa code chết | — |
| Code lặp/API nội bộ của run.ts, KycExtraction/KycIntelligence, schema ngày | Code Gói C | Các cụm đã có trong KNOWN; chưa có bằng chứng chi phí mới, không báo lại | — |

Chi tiết chunk (size.json):

| Chunk | Thô (byte) | Gzip (byte) | Δ baseline |
|---|---:|---:|---:|
| index.js | 891.942 | 262.010 | 0 |
| chart.js | 513.302 | 172.450 | 0 |
| exceljs.min.js | 929.569 | 255.572 | 0 |
| index.css | 28.364 | 6.412 | 0 |
| rolldown-runtime.js | 1.106 | 627 | 0 |

AI nằm chung index.js; không gán toàn bộ 891.942 byte cho riêng AI. Chỉ phụ thuộc domain + zod đúng danh sách hiện có. Không tìm được phần SP chết hay code lặp mới ≥ 3 nơi với chi phí đo được. Các type chỉ dùng nội bộ có thể thu hẹp export khi chạm file nhưng chưa phải lỗi/bloat có chi phí; không đưa thành phát hiện. Các API nội bộ của run.ts qua barrel, MAX_RAW_OUTPUT lặp và generator ID ngẫu nhiên đã có trong KNOWN. Không cài công cụ mới, không đề xuất refactor G5/spec để khớp code.

## 4b. Hiệu năng

Máy DESKTOP-KDURKJP. Các probe do phiên này chạy lần lượt; lúc đo core đã dừng probe UI và build/test. Không có thông tin chắc chắn về phiên khác hay tải hệ thống; số dưới là hàm thuần trong Node, không đồng nhất với độ trễ màn/exe. Dữ liệu đúng backup tải common, 1.496 KH tổng/1.481 sống, 103 phân tích tổng/102 của 95 KH sống; DB trong RAM. Không so với Office Laptop.

| Đã chạy / đo | Dữ liệu | Trung vị (min–max), 9 lần | ID |
|---|---|---|---|
| Đọc profile/AI, dựng panel + lịch sử + khối lịch hẹn toàn bộ 95 KH có AI | Backup tải chung | 28,9274 ms (26,7535–30,8408) | — |
| Dựng lịch sử/nội dung panel/khối lịch hẹn của KH nhiều lịch sử nhất | Backup tải chung | 0,0539 ms (0,0507–0,0858) | — |
| Dựng input/message web + validator output Mock trên tập KH trên | Backup tải chung | 28,1157 ms (27,3765–28,8618) | — |
| Tham chiếu đầu-cuối Home PC, common/perf/perf-ref.json | Exe SHA ghim, 5 lần đo nền của common | mở panel 19,6 ms (19,2–25,2); lịch sử 12,4 ms (2–16,5) | — |

Chưa phát hiện P. Số Node thấp hơn 200 ms; không dùng số Node để tuyên bố đã đo lại exe.

## 5. Đếm mức × trục

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tổng | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |

Đếm theo trục chính để không nhân một phát hiện thành nhiều. 1 CONFIRMED, 0 PLAUSIBLE, 0 KNOWN được báo như phát hiện; tỷ lệ PLAUSIBLE 0%. C/G liên quan của CX-C1 đã nêu ở khuôn. Không kết luận phát hành v1.0 ở Gói C (phần đó của F).

## 6. Đã xét, không thấy

| Trục | Đã đọc / chạy và kết quả ngoài CX-C1 |
|---|---|
| E | Đã xét rỗng/Unicode/giới hạn input-output, maxTokens cắt JSON, một lần thử lại, Hủy giữ khóa, request thứ hai, thay DB thành công/thất bại. run/extract-json/web/ai-analysis tests và 783 unit xanh; UI lỗi tức thời/trích xuất rỗng không mất trạng thái. Không thấy lỗi E mới ngoài CX-C1. |
| C | Đã xét spec §3–§9, G5 và mockup ai.html, input tuổi/F-code, badge/provider, CURRENT/STALE, chip KYC seq có khoảng trống, lịch sử mới nhất theo seq, báo cáo REJECTED. prompts.test và blocklists.test lấy chuẩn từ tài liệu; panel/appointment cùng analysisContent. Không thấy sai hợp đồng mới ngoài đề xuất Mock CX-C1; các lệch đã có KNOWN giữ nguyên. |
| D | Đã xét recordAiAnalysis/analysisContentFits, snapshot KYC trước await, generation và replacing, soft-delete/restore, đề xuất chỉ nằm trong component. ai-analysis.test bao gồm kết quả/lỗi/Hủy khi replace đang chạy, import cùng ID và replace thất bại; UI con số sai chưa thay dữ kiện đã lưu. Không thấy lỗi D mới. |
| G | Đã xét schema V1, evidence/missingCategory V2, mỗi mục G5 V3–V6 và V7; NFC/NFKC/Cf, ranh giới Unicode, nhãn chỉ trong personalityNotes, quote và normalizeKycValue; retry/raw_output/tổng 200.000 code point. 6 probe guardrail bổ sung đều chặn đúng; 3 đột biến bị test giết. Không thấy lỗ validator deterministic mới; CX-C1 thuộc độ chính xác Mock, V7 không kiểm ý nghĩa. Không đánh giá chất lượng model thật bằng Mock. |
| S | Đã xét ai-tauri ↔ reply Rust, mã lỗi/HTTP/cắt message, giới hạn key tại form và Rust, settings chỉ bốn field, URL ChatGPT hằng số, clipboard write-only, không HTML/Markdown output. tauri/settings tests xanh, rg không tìm fetch/localStorage/dangerouslySetInnerHTML trong đường AI; UI chỉ gọi stub. Không thấy lỗi S mới ở ranh giới Gói C. Không đọc key thật, không gọi server thật. |
| P | Đã đo đúng backup tải: 95 KH có AI/102 dòng sống, 9 mẫu mỗi phép đo; đối chiếu số tham chiếu cùng Home PC. Các mô hình panel/histories/input/validator dưới 200 ms; không có phát hiện P. Giới hạn: không đo lại UI/exe đầu-cuối, dùng baseline chung cho phần đó. |
| B | Đã xét 210 khai báo export bằng rg + import AST, noUnused ai/desktop, bản đồ codemap, lint:deps, dependencies và chunk build. 43 tên không có named import sản phẩm ngoài vẫn là type/API hoặc dùng nội bộ; không có chứng cứ code chết/chi phí mới. Không thấy B mới; các cụm lặp đã có KNOWN không đếm lại. |
| T | Đã đọc 24 file test/fixture, chạy 23 test file (783 ca). Bản chép control 137 ca xanh, đột biến bỏ V2/quote/ngoại lệ V5 lần lượt làm 4/1/9 test đỏ. Không thấy lỗ test mới cần ID riêng; thêm ca con số theo CX-C1. Các giả định/tên test và coverage được đọc cùng code, không lấy 100% coverage làm chứng minh đầy đủ. |
| A | Đã đọc JSX labels/t(), role status/alert/live region, TextField aria-describedby, heading/link F, Dialog và focus-return; đối chiếu i18n/mockup. UI probe: Bỏ đề xuất → nút AI trích xuất, F1 → fact-F1, dán message app → focus textarea + aria-invalid=true/description + không thêm lịch sử, Hủy web → nút Phân tích bằng ChatGPT web; 0 pageerror. Không thấy lỗi A mới. Chưa kiểm bằng screen reader thật hay đo tương phản toàn màn. |

KNOWN đã kiểm, không có bằng chứng mới để báo lại: lỗi kết thúc khi rời màn (#468), ghi đè cùng job key khi gọi ngoài UI, cảnh báo settings hỏng/chip kết nối cũ (#444), markup busy lặp, dấu “:” i18n ở trích xuất, dayAndTime, schema ngày, phrase detail/cụm trùng, helpers qua barrel và hằng max raw lặp. Không báo lại ca dán nguyên prompt/retry hay AI trả về sau import cùng ID đã sửa.

## 7. Phụ lục nguồn probe và trạng thái

- unit.log: 23 file / 783 test xanh (2,33 s).
- unused-ai.log, unused-app.log: exit 0; codemap.log, deps.log: đúng.
- build.log: build web thành công, dist bị ignore.
- register.mjs: loader của probe TS, dùng thư viện đã cài trong repo; xử lý extension/index/raw. Hai lỗi harness ban đầu (export CJS Playwright và resolve thư mục i18n) đã sửa trong thư mục probe, không phải lỗi sản phẩm.
- core-probe.mjs + core-results.json/core.log: số đo đúng dữ liệu tải; 6 chuỗi Unicode/danh sách chặn bị V3–V6 chặn; dán nguyên message app → OWN_MESSAGE. Probe về thông tin em gái phản ánh giới hạn heuristic Mock; mock-adapter.test.ts hiện cũng có mẫu em trai còn độc thân được trích. Không báo thêm mục này và không dùng để nâng mức CX-C1.
- ui-probe.mjs + ui-results.json/ui.log: lỗi tức thời AI_NO_KEY/UNAUTHORIZED/TIMEOUT vẫn hiện đúng alert + Thử lại, nút mở lại; đề xuất trích xuất và trường hợp rỗng hiện (2 node chữ rỗng = một live-region + một dòng nhìn thấy); dán JSON web hợp lệ → CURRENT; không HTTP ngoài, không pageerror.
- core probe gọi saveChatGptAnswer trực tiếp với WebSession cũ sau nhập cùng ID → saved/CURRENT. Không tính phát hiện: luồng UI thường rời profile để nhập, session đã unmount đúng §3.1 mục 4; probe vượt điều kiện sống của session và lặp mẫu DR5-36 đã sửa ở luồng async.
- mutation-probe.mjs + mutation-results.json: control 137/137; bỏ V2 làm 4 test đỏ; bỏ kiểm quote V7 làm 1 test đỏ; áp V5 lên personalityNotes làm 9 test đỏ. Cả 3 đột biến bị giết, không đột biến sống. Bản chép mutation-* ở codex/C, không patch repo.
- Chưa chạy e2e toàn bộ/cổng 4173; baseline chung ở SHA ghim đã có 210 test xanh. Chưa đo lại exe, không khởi chạy common/perf cổng 9222.
- export-probe.mjs + exports.json/exports.log: rg từng export và bản đồ import, scope.json/scope.md có 60 file và cỡ dòng khớp baseline. size.json: chunk byte/gzip khớp baseline. Các phép kiểm dùng công cụ có sẵn, không cài dependency.
- Probe UI cuối còn kiểm focus Bỏ/F1/lỗi dán/Hủy; ui-results.json ghi activeElement đúng, historyBefore=historyAfter=2 (header + một dòng dữ liệu), 0 pageerror.
- Lệnh unit đầy đủ: pnpm exec vitest run packages/ai apps/desktop/src/data/ai- apps/desktop/src/routes/ai-error-view.test.ts apps/desktop/src/routes/settings-ai-view.test.ts apps/desktop/src/routes/appointments/appointment-ai-view.test.ts apps/desktop/src/routes/customers/ai-panel-view.test.ts apps/desktop/src/routes/customers/extraction-view.test.ts.
- Lệnh khác: pnpm exec tsc -p packages/ai --noUnusedLocals --noUnusedParameters; tương tự -p apps/desktop; pnpm codemap:check; pnpm lint:deps; pnpm build:web; node tools/size-report.mjs --json --exe C:\workspace\deep-review-1-6\common\exe\project2c.exe; node codex/C/{core-probe,ui-probe,mutation-probe,export-probe}.mjs (đường đầy đủ của thư mục kết quả, không file trong repo).
- Git status cuối phiên, giờ xong: giống đầu phiên: ?? .agents/ · ?? .codex/ · ?? AGENTS.md. SHA cuối: 885534549808f42aec7f9af5743bbf86642ee4bd. Git diff --stat rỗng; không sửa file repo/commit. Giờ xong: 2026-10-13 23:06:05 +07:00 (Asia/Bangkok).
