XONG — Codex gói C, 2026-10-14 11:22:35 (Asia/Saigon)

# Deep review Phase 1–6 — Gói C: AI

## 1. Thông tin phiên

- Bên: Codex, reviewer độc lập; Gói C (AI), lượt 1, phiên mới.
- SHA đầu và cuối: 885534549808f42aec7f9af5743bbf86642ee4bd (8855345), detached HEAD.
- git status --short đầu phiên: rỗng. Cuối phiên: rỗng; nguyên trạng.
- Bắt đầu: 2026-10-14 10:51:02 (Asia/Saigon). Hoàn tất nội dung: 2026-10-14 11:20:56 (Asia/Saigon).
- Bước 0: A.md/B.md đã XONG (chỉ kiểm tên đầy đủ và dòng đầu); C.md chưa có.
- Kết quả: 4 phát hiện mới, đều Low và CONFIRMED. Không có Critical/High/Medium. Không đưa kết luận v1.0 (để Gói F).
- Không sửa code/config/spec/golden trong repo, không commit/PR/Issue. Build chỉ tạo dist bị ignore. Không gọi AI thật, mở ChatGPT, hoặc đọc key thật; dùng Mock/adapter giả.

## 2. Phạm vi đã đọc

Đọc từng file theo classifyFile của tools/size-report-core.mjs: **60 file = 5 129 dòng SP + 5 985 dòng test**, gồm 36 file SP và 24 file test/hỗ trợ (test-support.ts là hỗ trợ; Vitest chạy 23 file test). Bảng dưới ghi phần đã đọc; toàn bộ nội dung từng file, gồm các test dài run.test.ts, ai-analysis.test.ts, ai-panel-view.test.ts. Inventory gốc: C/inventory.json.

| File | Dòng đã đọc (8855345) | Loại |
|---|---|---|
| apps/desktop/src/data/ai-analysis.test.ts | 1–967 | test / hỗ trợ test |
| apps/desktop/src/data/ai-analysis.ts | 1–333 | SP |
| apps/desktop/src/data/ai-jobs.test.ts | 1–113 | test / hỗ trợ test |
| apps/desktop/src/data/ai-jobs.ts | 1–82 | SP |
| apps/desktop/src/data/ai-tauri.test.ts | 1–108 | test / hỗ trợ test |
| apps/desktop/src/data/ai-tauri.ts | 1–75 | SP |
| apps/desktop/src/routes/SettingsAi.tsx | 1–387 | SP |
| apps/desktop/src/routes/ai-error-view.test.ts | 1–73 | test / hỗ trợ test |
| apps/desktop/src/routes/ai-error-view.ts | 1–66 | SP |
| apps/desktop/src/routes/appointments/AppointmentAi.tsx | 1–86 | SP |
| apps/desktop/src/routes/appointments/appointment-ai-view.test.ts | 1–183 | test / hỗ trợ test |
| apps/desktop/src/routes/appointments/appointment-ai-view.ts | 1–49 | SP |
| apps/desktop/src/routes/customers/KycExtraction.tsx | 1–180 | SP |
| apps/desktop/src/routes/customers/KycHistory.tsx | 1–154 | SP |
| apps/desktop/src/routes/customers/KycIntelligence.tsx | 1–572 | SP |
| apps/desktop/src/routes/customers/KycWebSession.tsx | 1–191 | SP |
| apps/desktop/src/routes/customers/ai-panel-view.test.ts | 1–1025 | test / hỗ trợ test |
| apps/desktop/src/routes/customers/ai-panel-view.ts | 1–622 | SP |
| apps/desktop/src/routes/customers/extraction-view.test.ts | 1–162 | test / hỗ trợ test |
| apps/desktop/src/routes/customers/extraction-view.ts | 1–106 | SP |
| apps/desktop/src/routes/customers/use-ai-job.ts | 1–53 | SP |
| apps/desktop/src/routes/settings-ai-view.test.ts | 1–112 | test / hỗ trợ test |
| apps/desktop/src/routes/settings-ai-view.ts | 1–87 | SP |
| packages/ai/src/adapter.ts | 1–43 | SP |
| packages/ai/src/blocklists.test.ts | 1–157 | test / hỗ trợ test |
| packages/ai/src/blocklists.ts | 1–108 | SP |
| packages/ai/src/code-points.test.ts | 1–51 | test / hỗ trợ test |
| packages/ai/src/code-points.ts | 1–45 | SP |
| packages/ai/src/errors.test.ts | 1–60 | test / hỗ trợ test |
| packages/ai/src/errors.ts | 1–56 | SP |
| packages/ai/src/extract-json.test.ts | 1–119 | test / hỗ trợ test |
| packages/ai/src/extract-json.ts | 1–84 | SP |
| packages/ai/src/index.ts | 1–11 | SP |
| packages/ai/src/input.test.ts | 1–174 | test / hỗ trợ test |
| packages/ai/src/input.ts | 1–29 | SP |
| packages/ai/src/mock-adapter.test.ts | 1–232 | test / hỗ trợ test |
| packages/ai/src/mock-adapter.ts | 1–112 | SP |
| packages/ai/src/models.test.ts | 1–27 | test / hỗ trợ test |
| packages/ai/src/models.ts | 1–35 | SP |
| packages/ai/src/prompts/analysis.ts | 1–48 | SP |
| packages/ai/src/prompts/connection.ts | 1–14 | SP |
| packages/ai/src/prompts/discovery.ts | 1–43 | SP |
| packages/ai/src/prompts/extraction.ts | 1–27 | SP |
| packages/ai/src/prompts/prompts.test.ts | 1–55 | test / hỗ trợ test |
| packages/ai/src/prompts/retry.ts | 1–63 | SP |
| packages/ai/src/raw.d.ts | 1–5 | SP |
| packages/ai/src/run.test.ts | 1–819 | test / hỗ trợ test |
| packages/ai/src/run.ts | 1–428 | SP |
| packages/ai/src/schema.test.ts | 1–344 | test / hỗ trợ test |
| packages/ai/src/schema.ts | 1–356 | SP |
| packages/ai/src/settings.test.ts | 1–94 | test / hỗ trợ test |
| packages/ai/src/settings.ts | 1–86 | SP |
| packages/ai/src/test-support.ts | 1–69 | test / hỗ trợ test |
| packages/ai/src/text-match.ts | 1–74 | SP |
| packages/ai/src/validator-blocklists.test.ts | 1–250 | test / hỗ trợ test |
| packages/ai/src/validator-extraction.test.ts | 1–135 | test / hỗ trợ test |
| packages/ai/src/validator.test.ts | 1–231 | test / hỗ trợ test |
| packages/ai/src/validator.ts | 1–269 | SP |
| packages/ai/src/web.test.ts | 1–425 | test / hỗ trợ test |
| packages/ai/src/web.ts | 1–150 | SP |

Ngoài các file code đếm dòng, đã đọc packages/ai/CLAUDE.md, package.json, tsconfig.json; CLAUDE.md gốc và apps/desktop/CLAUDE.md, CONTEXT.md; common/prompt-codex.md, plan.md (§1–6, §10 và phần chung), known.md (OPEN/ACCEPTED, K1–K17), baseline.md; docs/design/phase-5-ai.md, phase-5-prompts.md, docs/golden/ai-eval.md, ADR-0009 (D-1/G5/W-1), Phase 6 §4.1 và §5, docs/metrics/phase-6.md (nền/ngưỡng), e2e/perf/README.md. Mockup đối chiếu: ai.html §1–4 + ask/ask-w1, customer.html:383–472 (panel AI), appointments.html:431–457 (khối AI), README mockup. Không dùng bản ghi chú lịch sử để sửa nguồn đúng.

Chỗ nối gói đã đọc:

| File | Phần đọc / mục đích |
|---|---|
| apps/desktop/src/data/app-data.ts | 1–hết: settings, generation, S-2, run, export/import |
| apps/desktop/src/data/AppDataContext.tsx; App.tsx; shell/AppShell.tsx | 1–hết: lifecycle, đọc lại DB, route/remount |
| apps/desktop/src/routes/Screen.tsx | rg dòng 15/19: key route/settings/customer |
| apps/desktop/src/routes/customers/CustomerProfile.tsx | 1–185: tải dữ kiện/versions/analyses và state UI |
| apps/desktop/src/routes/customers/kyc-view.ts | 66–167 và tìm factInEffect/factCodeTarget: liên kết mã F, timeline |
| apps/desktop/src/routes/customers/CustomerKyc.tsx | timeline 220–228 và rg aria-label: điểm focus/region |
| apps/desktop/src/routes/customers/KycDialogs.tsx | 86–185: giá trị và mở ghi chú; UI probe dùng dialog thật |
| apps/desktop/src/routes/Settings.tsx | 1–hết: modal thay DB, không cho điều khiển màn bên dưới |
| apps/desktop/src/routes/SettingsBackup.tsx | 176–hết: giữ modal trong lúc thay DB |
| packages/ui/src/components/Dialog.tsx | 1–95: modal, focus và Escape |
| packages/db/src/ai-analyses.ts | 1–hết: lưu/đọc, CURRENT/STALE/REJECTED, bất biến |
| packages/db/src/backup.ts; database.ts | backup 1–165, database 1–45: import staging, option now, engine |
| apps/desktop/src-tauri/src/ai.rs | 1–517: request, Busy/Drop, key, sanitize, response, HTTP, URL cố định; không chạy key_entry/read_key |
| apps/desktop/src-tauri/src/lib.rs | lệnh AI 136–185 và spawn_blocking: hợp đồng IPC |
| apps/desktop/src-tauri/tauri.conf.json; capabilities/default.json | CSP connect-src, quyền cửa sổ |
| apps/desktop/src/i18n/vi.ts | AI/panel/error 123–264; Settings AI 373–438; extraction 493–506 |
| e2e/support.ts | helpers asExe, customer/KYC, provider; UI probe tái dùng |
| e2e/customer-ai.spec.ts; settings-ai.spec.ts | các khối liên quan đời job, bàn phím, trích xuất, S-2 và cài đặt; không tuyên bố đọc hết hai file gói F |
| tools/size-report-core.mjs; tools/load-data.mjs; package.json; vitest.config.ts | phạm vi, hook nạp TS, lệnh và coverage; chỉ đọc |

## 3. Phát hiện

### CX-C1
ID: CX-C1

Mức: Low

Trục: G

Vị trí: packages/ai/src/text-match.ts:23; packages/ai/src/text-match.ts:32; packages/ai/src/web.ts:86 (8855345)

Tình trạng: CONFIRMED

Mô tả: NFKC chạy trước khi bỏ ký tự Cf, nên khi Cf nằm giữa chữ gốc và dấu tổ hợp, bản sau lọc vẫn là NFD. Những mục không so bản bỏ dấu của V3–V6 có thể lọt dù chuỗi sau khi bỏ ký tự vô hình và NFC hoàn toàn giống cụm bị chặn.

Tái hiện / bằng chứng: node C:\workspace\deep-review-1-6\codex\C\probe-guardrails.mjs (exit 0; C/probe-guardrails.log và .json). Bốn ca “KH dễ chốt”, “Đề xuất Bảo Việt”, “KH có thể tuổi Tý”, “Theo Điều 35”: bản thường lần lượt V3/V4/V5/V6; NFD rồi thêm U+200B trước mỗi dấu tổ hợp → issues=[]; checkWebAnswer → record, ACCEPTED, attempts=1 cho cả bốn. visuallyEquivalent=true sau bỏ Cf + NFC. Không gọi AI thật.

Ảnh hưởng: câu trả lời có tổ hợp Unicode hiếm / cố ý qua cổng web hoặc model có thể đưa xác suất, hãng bảo hiểm, nhãn tính cách ngoài personalityNotes hoặc trích luật vào phân tích. Mức Low vì cần output suy biến, không bằng chứng xảy ra với model thật. Đây là tổ hợp mới của các biên Unicode đã sửa trong DR5-01; không báo lại riêng NFD hoặc ZWSP giữa các chữ (những ca đó đã bị chặn).

Đề xuất: chuẩn hóa NFC/NFKC lần nữa sau khi bỏ Cf (giữ nguyên danh sách và cờ bỏ dấu); thêm 4 test tổ hợp vào validator-blocklists.test.ts; đồng bộ thứ tự chuẩn hóa ở G5 §7 theo quy trình Owner. Ước lượng < 40 dòng SP/test; code sửa ≤ 400 dòng SP. Spec G5 hiện cũng mô tả thứ tự này, nên ghi rõ cần điều chỉnh hợp đồng chuẩn hóa, không sửa spec để hợp thức hóa việc lọt.

Bằng chứng xuyên gói bổ sung: `node C/probe-flows.mjs` → saveChatGptAnswer lưu ACCEPTED; exportBackup → importBackup → CURRENT, output sau bỏ Cf + NFC là “Đề xuất Bảo Việt”. `node C/probe-own-message.mjs`: message thử lại nguyên văn → unusable/OWN_MESSAGE; NFD + U+200B trước các dấu tổ hợp → record/REJECTED, attempts=2, sameAfterCfAndNfc=true. Cùng nguyên nhân chuẩn hóa; không đếm thành phát hiện khác. Code khớp đúng thứ tự NFKC → bỏ Cf của G5, nhưng thứ tự này chưa bảo đảm mục tiêu chặn cùng cụm và nhận diện message; cần Owner xét cả hợp đồng chuẩn hóa.

### CX-C2
ID: CX-C2

Mức: Low

Trục: C

Vị trí: packages/ai/src/blocklists.ts:93 (8855345)

Tình trạng: CONFIRMED

Mô tả: LAW_NAME chỉ miễn trừ KH/RE viết hoa toàn bộ; G5 §8.4 và §10.3 yêu cầu miễn trừ KH/RE ở mọi kiểu chữ.

Tái hiện / bằng chứng: cùng probe-guardrails.mjs: “Làm rõ luật KH tự đặt” và “Làm rõ luật RE tự đặt” → []; “Làm rõ luật Kh tự đặt” / “Làm rõ luật Re tự đặt” → V6 (detail có “luật K” / “luật R”). Probe-guardrails.json ghi nguyên chuỗi và kết quả.

Ảnh hưởng: model dùng Kh/Re theo kiểu title case làm câu bình thường bị loại, tốn một lần thử; hiếm, đúng thước Low. Không phải tên luật bị chặn.

Đề xuất: dùng ci('kh') / ci('re') trong nhánh loại trừ như ci('sư'), thêm ca mixed case vào validator-blocklists.test.ts; < 10 dòng SP, giữ toàn bộ ca C11/C44 chặn tên luật thật.

### CX-C3
ID: CX-C3

Mức: Low

Trục: C

Vị trí: packages/ai/src/mock-adapter.ts:78; packages/ai/src/mock-adapter.ts:87; packages/ai/src/mock-adapter.test.ts:160 (8855345)

Tình trạng: CONFIRMED

Mô tả: Mock trích xuất lấy mẫu “độc thân” và số con ở bất kỳ ngữ cảnh nào, nên gán tình trạng hôn nhân của người thân và cả số con bị phủ định cho KH. Một test hiện còn ghim hành vi sai với câu về em trai.

Tái hiện / bằng chứng: node C/probe-flows.mjs (exit 0): “KH có một con trai đang sống độc thân tại Hà Nội.” → maritalStatus=Độc thân; “KH không có 2 con như người quen tưởng.” → childrenCount=2; “KH đã kết hôn, có 2 con. Em trai KH còn độc thân.” → cả Đã kết hôn và Độc thân cho KH. Qua runExtraction, V1/V7, extractFromNote; revision không đổi ở cả ba ca (không tự lưu). C/probe-flows.json/log. Test “extracts simple patterns…” đang yêu cầu Độc thân từ “Em trai chị còn độc thân.” (§4.2 prompt: chỉ KH/gia đình theo đúng trường; maritalStatus là trường của KH).

Ảnh hưởng: demo hoặc dùng Mock trên ghi chú bình thường hiện đề xuất sai. RE vẫn phải xác nhận, nên không coi là dữ liệu sai lặng lẽ / không tự nâng Medium. Hai ca chủ thể người thân/phủ định bổ sung sau các biên “cháu nội/ngoại”, “chưa kết hôn” đã sửa; không báo lại chính ca đã sửa.

Đề xuất: Mock chỉ nhận các câu có chủ thể KH và không phủ định; không đủ căn cứ thì trả 0 đề xuất. Đổi test mẫu em trai để loại đề xuất sai, giữ ca đúng “KH đã kết hôn, có 2 con”. Ước lượng ≤ 60 dòng SP, ≤ 100 dòng test. Không đổi G5/golden để hợp thức hóa regex.

### CX-C4
ID: CX-C4

Mức: Low

Trục: A

Vị trí: apps/desktop/src/routes/customers/KycExtraction.tsx:108; apps/desktop/src/routes/customers/KycExtraction.tsx:170 (8855345)

Tình trạng: CONFIRMED

Mô tả: Hủy và Thử lại của AI trích xuất gỡ chính nút đang giữ focus mà không đặt focus vào một điểm ổn định gần ghi chú; focus rơi về BODY. Panel phân tích có thenFocus xử lý cùng tình huống, NoteEvent chưa có.

Tái hiện / bằng chứng: node C/probe-ui.mjs (exit 0), bản build SHA ghim, Edge headless 1440×900, port loopback ngẫu nhiên, asExe giả; mọi HTTP ngoài loopback bị chặn. Tạo KH đủ discovery → phân tích Mock CURRENT → ghi chú dài → OpenCode giả giữ request → focus Hủy + Enter: activeElement=BODY trong lúc “Đang hủy…” và sau khi request xong. Tab tiếp tới “Phân tích bằng ChatGPT web” của panel khác. Trả hai lần OK để tạo lỗi V1 → focus Thử lại + Enter: activeElement=BODY. C/probe-ui.json/log và ui-cancel.png. 5 ai_complete đều stub, 0 mạng AI thật, pageerrors=[].

Ảnh hưởng: người dùng bàn phím / trình đọc màn hình mất vị trí ở ghi chú khi hủy hoặc thử lại; chức năng vẫn chạy, không mất dữ liệu, đúng mức Low. Test e2e có focus cho Hủy/Thử lại của panel và Xác nhận/Bỏ/Đóng của extraction, nhưng extraction Hủy/Thử lại chỉ kiểm trạng thái.

Đề xuất: một điểm focus ổn định có tabIndex=-1 ở ghi chú / tiêu đề trạng thái; Hủy/Thử lại chuyển tới đó khi nút biến mất, rồi quay nút AI trích xuất khi mở khóa nếu phù hợp. Thêm e2e bàn phím tương tự test panel; ≤ 50 dòng SP, ≤ 50 dòng test. Không sửa mockup để bỏ yêu cầu bàn phím.

## 4. Bloat

| Đã chạy / đọc / đo | Dữ liệu / phạm vi | Số / kết quả | ID |
|---|---|---|---|
| pnpm exec tsc -p packages/ai --noEmit --noUnusedLocals --noUnusedParameters | packages/ai, cấu hình không đổi | exit 0, 0 diagnostic | — |
| pnpm exec tsc -p apps/desktop --noEmit --noUnusedLocals --noUnusedParameters | app desktop, cấu hình không đổi | exit 0, 0 diagnostic | — |
| pnpm codemap:check + đọc bản đồ package/app | SHA ghim | exit 0, Export maps are up to date | — |
| pnpm lint:deps | repo ở SHA ghim | exit 0; 309 module, 1 244 dependency, 0 violation | — |
| node C/exports.mjs: AST export rồi rg -w từng tên trên packages/apps/tools/e2e | 36 file SP của C (trừ d.ts), tham chiếu chia SP/test | 210 khai báo export; 42 không có tham chiếu SP **ngoài file khai báo**; đã phân biệt type, tự dùng nội bộ, test và hợp đồng Rust; đây không phải 42 đoạn code chết | — |
| Dependency package AI | package.json, cây import + lint:deps | 2 dependency: domain + zod, đều dùng; không thêm công cụ | — |
| Đọc các khối lặp/UI/hàm chuẩn hóa | toàn C | Không tìm cụm lặp mới ≥3 nơi có chi phí chứng minh được; các mục đã ghi ở known.md không có bằng chứng chi phí mới | — |
| pnpm build:web; node C/exports.mjs đo raw/gzip bằng bundleReport | build của 8855345, 9.00 s | index.js 891 942 / 262 010 B; chart.js 513 302 / 172 450 B; exceljs.min.js 929 569 / 255 572 B; CSS 28 364 / 6 412 B; runtime 1 106 / 627 B | — |
| Tổng JS/CSS và so common/baseline.md | cùng SHA | 2 364 283 / 697 071 B; mọi chunk Δ=0; không có chunk AI riêng | — |

Không có phát hiện B mới. Các API nội bộ lộ qua export *, newSessionId/newPage, giới hạn raw output hai nơi, normalization/comparable và markup trạng thái đã thuộc KNOWN; không đếm lại khi chưa có bằng chứng mới. Việc type chỉ dùng trong file không tạo chi phí runtime. Các đề xuất sửa ở §3 ghi cỡ và test giữ hành vi; không đề xuất refactor/bớt guardrail chỉ để giảm dòng. Log: unused-ai.log, unused-desktop.log, codemap.log, deps.log, exports.json/export-rg.jsonl, build.log, bundle.json.

## 5. Hiệu năng

Máy **D13_ThinkPad (Office Laptop)**, Node **v24.20.0**; đo 2026-10-14 11:00:35 (Asia/Saigon). node C/perf-node.mjs đọc **common/load/load-2026-10-12-seed6.p2cbackup bằng importBackup**: 1 496 KH, 10 414 lịch hẹn, 54 nhân sự, 103 phân tích AI, 13 833 dữ kiện, 13 114 phiên bản KYC, có Thùng rác. 95 KH đang sống có AI, 102 dòng ACCEPTED. Có lượt warmup; mỗi dòng 5 lần, trừ khi ghi khác.

| Đã chạy / đo | Dữ liệu | Trung vị ms | Min–max ms | ID |
|---|---|---:|---:|---|
| getKycProfile + listKycVersions + listAiAnalyses | cả 95 KH có AI | 24.378 | 23.430–24.871 | — |
| analysisContent | cả 102 dòng ACCEPTED | 3.003 | 2.667–3.729 | — |
| historyRows | cả 95 KH | 0.074 | 0.067–0.134 | — |
| appointmentAiView | cả 95 KH | 2.766 | 2.289–2.863 | — |
| buildAnalysisInput + JSON.stringify + validateOutput | cả 102 dòng | 33.121 | 32.257–34.268 | — |
| Đọc profile/versions/analyses + content của bản mới nhất + history, một KH (9 lần) | KH có trung vị cao nhất; 12 fact, 12 version, 1 analysis | 0.383 | 0.252–0.501 | — |
| importBackup mở dataset (1 lần) | backup tải; đo trong Node | 937.738 | — | — |
| customer.open-ai, số **tham chiếu**, không phải đo lại phiên này | common/perf/perf-ref.json, cùng máy/exe/backup | 23 | 22–25 | — |
| customer.ai-history, số **tham chiếu** | cùng nguồn, 5 lần | 7 | 2–16 | — |

Không có phát hiện P: phần hàm AI trên bộ tải nhỏ hơn ngưỡng 200 ms nhiều; số màn tham chiếu cũng <200 ms. **Node không đo React render/IPC và không được dùng thay số màn.** Theo plan §6 reviewer không bắt buộc đo lại exe; phiên này không chạy exe/CDP hoặc toàn pnpm e2e. Đã kết thúc build/test của phiên trước khi đo; không chạy lệnh nặng khác của phiên song song. Hoạt động nền của reviewer khác không xác định, nên không khẳng định máy hoàn toàn rảnh và không dùng sai lệch nhỏ để kết luận hồi quy. Nguồn số thật: perf-node.json/log (gồm từng KH).

## 6. Đếm mức × trục

Đếm theo trục chính; một lỗi có bằng chứng test bổ sung không đếm lần hai.

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 2 | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 4 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tổng | 0 | 2 | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 4 |

CONFIRMED 4/4; PLAUSIBLE 0/4 (0%); KNOWN không có bằng chứng mới để tách ID. Không nâng mức vì cổng AI/Mock có đề xuất chờ RE xác nhận hoặc điều kiện Unicode hiếm. Trong C1, G5 mô tả cùng thứ tự chuẩn hóa như code; đã nêu rõ khoảng hở nằm cả ở hợp đồng và cách thực hiện, không yêu cầu sửa spec để chiều theo code.

## 7. Đã xét, không thấy (ngoài các ID ở §3)

| Trục | Đã đọc / chạy | Kết quả / giới hạn |
|---|---|---|
| E | extract-json/code-points/web/run và toàn test; S-2 trong ai-analysis.test.ts; probe chuỗi retry → xác nhận lại → xóa/khôi phục → đổi KYC → câu trả lời lần 2 → backup/import | Đã xét, không thấy lỗi mới: attempts=2, ACCEPTED nhưng STALE, giữ input “Bác sĩ”, KYC hiện hành “Giám đốc”, nhập lại vẫn STALE, reportError=[]; giới hạn paste/raw/Unicode/cắt token và khóa sau Hủy được test. Biên Unicode mới ở C1 |
| C | spec Phase 5, G5, mockup, schemas/views/settings, test so nguyên văn prompt | Ngoài C2/C3, đã xét không thấy sai hợp đồng mới ở gate/mode, source chip, lịch sử theo seq, schema/trial/maxTokens, cài đặt Go/Credit/reasoning. C1 là khoảng hở chung của hợp đồng chuẩn hóa |
| D | ai-analysis/app-data/db ai-analyses/backup; 783 test; probe-flows | Đã xét, không thấy lưu thẳng KYC hoặc trích xuất đổi revision; snapshot KYC, CURRENT/STALE và round-trip đúng ở chuỗi probe. C1 output vi phạm guardrail được DB/backup giữ nguyên là hậu quả cùng ID, không đếm lỗi D thứ hai |
| G | V1–V7, blocklists từng hàng G5, prompt literal tests, V7 mutant | Ngoài C1, đã xét không thấy lỗi mới: evidence/missingCategory, personalityNotes tách riêng, nhánh extraction không V3–V6 theo spec, cap issue/retry và câu bị cắt. Không đánh giá chất lượng model thật / R2–R7 bằng lời khẳng định vì không gọi model |
| S | ai-tauri, AppAi.save 4 field, input tối thiểu, Settings password; Rust request/URL/timeout/redaction/Credential Manager; CSP; adapter giả/HTTP loopback bị khóa ngoại mạng | Đã xét, không thấy key đi vào settings/input/DB/backup theo luồng chuẩn hoặc thực thi HTML/output; key status bool, command mở URL không tham số. Không đọc key thật, không thử dịch vụ AI thật; không chạy lại Rust (baseline verify:rust 91 test đã xanh) |
| P | perf-node trên backup tải; đối chiếu số màn cùng máy common/perf/perf-ref.json | Đã xét, không thấy điểm nghẽn mới trong phạm vi C; số và giới hạn đo ở §5 |
| B | noUnused hai project, bản đồ export + rg từng tên, dependency, build chunk | Đã xét, không thấy bloat mới có chi phí đo được; §4 phân biệt tham chiếu nội bộ/type/test với code chết, không đếm lại KNOWN |
| T | Đọc 24 file test/hỗ trợ, chạy 23 file/783 test, hai mutant; rà các e2e focus/extraction | Đã xét: 783 pass; V7 quote và fold bị test giết. Các khoảng hở test được gắn cùng C1/C2/C3/C4: thiếu tổ hợp NFD+Cf/mixed case; Mock test ghim đề xuất em trai; thiếu focus Hủy/Thử lại extraction. Không tách ID T để tăng số; không suy từ coverage 100% rằng hết lỗi |
| A | JSX mọi file C, AI i18n, Dialog/anchor/region; Edge headless keyboard probe | Ngoài C4, đã xét không thấy lỗi i18n/nhãn mới; trạng thái sống/các nút có nhãn, lịch sử có nút bàn phím, report có Dialog. Không đo tương phản ảnh exe; các lệch/ghi chú token đã KNOWN không đếm lại |

Các mục KNOWN liên quan đã đối chiếu: lỗi kết thúc ngoài màn, job cùng key, warning config khó xóa, kết quả kết nối cũ, thiếu in đậm ChatGPT web, dayAndTime, newSessionId, export * helper nội bộ, raw-output 20 000 hai nơi, phrase.detail, issue trùng, F ở timeline, extract-json cut, assistant rỗng retry và mô hình cũ trong mockup. Không phát hiện bằng chứng mới để nâng hoặc báo lại.

## 8. Phụ lục nguồn, kiểm tra cuối

Mọi nguồn/log dưới đây nằm trong **C:/workspace/deep-review-1-6/codex/C/**; chỉ là probe/bản chép, không phải code sản phẩm.

| Nguồn / lệnh | Kết quả thật |
|---|---|
| loader.mjs; inventory.mjs/json | Hook TS/alias/?raw, phân loại đúng 60 file và 5 129/5 985 dòng |
| pnpm exec vitest run packages/ai/src apps/desktop/src/data/ai- apps/desktop/src/routes/ai-error-view.test.ts apps/desktop/src/routes/settings-ai-view.test.ts apps/desktop/src/routes/customers/ai-panel-view.test.ts apps/desktop/src/routes/customers/extraction-view.test.ts apps/desktop/src/routes/appointments/appointment-ai-view.test.ts | tests.log: exit 0; 23 file, 783 test, 2.57 s |
| probe-guardrails.mjs/json/log | exit 0; 4 Unicode bypass + 2 mixed-case false positive, không dịch vụ ngoài |
| probe-flows.mjs/json/log | exit 0; Unicode guardrail đi tới DB/backup; 3 đề xuất Mock sai không tự lưu; chuỗi nhiều bước giữ STALE |
| probe-own-message.mjs/json/log | exit 0; tổ hợp NFD+Cf làm message app consume lần 2 → REJECTED; nguyên văn OWN_MESSAGE |
| perf-node.mjs/json/log | exit 0; số đo tải ở §5, machine/time/runtime và từng KH |
| exports.mjs/json/log; export-rg.jsonl; bundle.json | exit 0; 210 export được tìm nơi tham chiếu, số raw/gzip khớp baseline |
| unused-ai.log; unused-desktop.log; codemap.log; deps.log; build.log | exit 0 từng lệnh; 0 noUnused/dependency diagnostic; build 9.00 s |
| prepare-mutations.mjs; mutant-quote/; mutant-quote.config.mjs; mutant-quote.log | Chép package ai/src ngoài repo, bỏ kiểm quote có trong note: exit 1, **1/9 test đỏ**, 8 xanh; test “drops a quote that is not in the note…” giết mutant |
| mutant-fold/; mutant-fold.config.mjs; mutant-fold.log | Thay folded:fold(accented) bằng accented: exit 1, **1/102 test đỏ**, 101 xanh; C7 “Gói bảo hiem tron doi phù hợp” giết mutant. Không có mutant sống trong 2 phép này |
| probe-ui.mjs/json/log; ui-cancel.png | exit 0; Edge headless 1440×900, local port ngẫu nhiên, asExe; CURRENT, focus Hủy/Thử lại=BODY; 5 stub ai_complete, 0 dịch vụ AI thật, pageerror=[] |
| session-draft.md | Bản lưu nguyên trạng các cập nhật dần trước khi sắp báo cáo này; giữ mọi phát hiện |
| git-final.log | git status --short rỗng; HEAD đúng SHA ghim |

Lần đầu probe UI dùng nhầm selector list có tên “Dòng thời gian” nên timeout; đã sửa **probe ngoài repo** thành region như e2e, chạy lại exit 0. Đó là lỗi probe, không tính phát hiện sản phẩm. Không patch repo khi đột biến; bản chép giữ trong C/ để kiểm lại.

**Ghi nhận ranh giới đầu phiên:** trước khi nhận hết nội dung prompt, một lệnh khám phá đã gọi rg --files với -g AGENTS.md trên C:/workspace (ngoài vùng được chỉ định). Lệnh exit 1, không trả về đường dẫn/nội dung nào. Đây là sai lệch thao tác so với quy tắc không tìm ngoài vùng; đã dừng cách khám phá đó, các lần sau chỉ repo/common/kết quả C, và đã nói rõ với Owner. Không thấy/đọc báo cáo của bên khác, không mở/liệt kê các thư mục review claude/muse. A/B chỉ kiểm dòng đầu cho bước 0, không đọc nội dung. Không dùng báo cáo A/B để suy kết quả C.

Git cuối phiên: git status --short = rỗng, khớp đầu phiên; git rev-parse HEAD = 885534549808f42aec7f9af5743bbf86642ee4bd. Hoàn tất nội dung 2026-10-14 11:20:56 (Asia/Saigon); kiểm cấu trúc cuối đã đạt; XONG lúc 2026-10-14 11:22:35 (Asia/Saigon).
