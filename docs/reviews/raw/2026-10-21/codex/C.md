XONG — codex gói C lượt 3, 2026-10-20 07:32:50 +07:00

# Deep review Phase 1–6, lượt 3 — Codex, gói C: AI

## 1. Thông tin phiên

- Bên: Codex, reviewer độc lập; gói C — AI. Phiên mới; tiếp tục công việc theo tin nhắn “tiếp tục” của anh trong cùng chat.
- SHA đầu và cuối: 119e2e45cbce54d8a3943757bd826a7f1e9b694f, detached HEAD, đúng SHA ghim.
- git status --short đầu phiên và cuối phiên giống nhau:

    ?? .agents/
    ?? .codex/
    ?? AGENTS.md

- Bắt đầu: 20/10/2026 01:41:24 +07:00. Máy DESKTOP-KDURKJP (Home PC). Giờ chốt ghi ở mục 9.
- Công cụ: Codex desktop/API, PowerShell, Node v24.20.0, Vitest 5.0.1, TypeScript và Playwright/Edge hiện có. Model được hệ thống mô tả là GPT-6 (Codex); ID biến thể và mức suy luận không được công cụ phiên cung cấp, không suy đoán.
- Bước 0: A.md/B.md đều có dòng đầu XONG; chỉ đọc dòng đầu. C.md chưa có, tạo báo cáo tiến độ ngay sau kiểm gói.
- Không subagent, không gh, Issue, PR, commit, merge, HANDOFF hay nghi thức phát triển. Không AI thật, không mở ChatGPT thật, không đọc key. Mọi browser context chặn request ngoài hostname 127.0.0.1 và thay window.open trước navigation; các fixture mô phỏng clipboard/Tauri cũng không gọi dịch vụ thật.
- Kết quả: **9/9 DR6 ĐÃ SỬA theo đường lỗi gốc; 1 phát hiện mới Low, CONFIRMED; 11/11 đột biến bị test giết.** Phát hiện CX3-C1 là biến thể mới, không đổi kết luận phần sửa đúng của DR6-17. Không kết luận phát hành thay gói F.
- Mã nguồn repo không bị patch. Có một sự cố liên kết dependency do pnpm exec tự kiểm cài đặt; đã khôi phục toàn bộ tám junction về checkout gốc và kiểm lại, chi tiết mục 9. Không để thay đổi đó tồn tại khi kết thúc.

## 2. Bảng R

| DR6 | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| 17 | #661 → #698 (8f7355b) | **ĐÃ SỬA** | core-results.json R17: NFD + U+200B trước dấu ở V3/V4/V5/V6 đều bị chặn; Điều/Luật/điểm với ký tự vô hình ở khoảng giữa cũng chặn. Gỡ cleanText mới (R17a): 12/211 test đỏ; đổi các mẫu V6 về khoảng trắng bắt buộc (R17b): 8/171 đỏ. Test web của PR bắt tin nhắn khung/thử lại NFD + ZWSP. | K1: 140 tổ hợp từng chữ đúng dấu/không dấu, khoảng trắng và tập vô hình mở rộng: 0 lọt. Dấu tách dòng Unicode của tin nhắn dán là biến thể khác → CX3-C1. |
| 23 | #661 → #698 | **ĐÃ SỬA** | core R23: “Định hướng nơi ở”, “KH nghĩ định cư”, “khách nông thôn”, “sẵn sàng kỹ lưỡng”, “cùng mệnh giá”, “bỏ luật sư” đều đạt. R23 thay text-match.ts bằng bản trước sửa: 27/171 đỏ, gồm các câu thường C62–C66. | Chữ không dấu và trộn từng âm tiết vẫn chặn ở ma trận K1. Corpus hai eval: 1.085 text, 0 thay đổi chặn; catalogue vi.ts: 2.318 literal, 0 thay đổi bộ mã chặn. |
| 24 | #661 → #698 | **ĐÃ SỬA** | core R24: thiếu themes → “thiếu, cần array”; mã f12 → dạng F12; MBTI → PSYCHOLOGY, ESOTERIC. R24 dùng validator.ts trước sửa: 12/93 đỏ. Test run.ts của PR kiểm cả detail vào message thử lại. | Đọc thêm test thiếu khóa enum/value, value trích xuất rỗng/quá trần, union sai kiểu; không chỉ kiểm schema trực tiếp. |
| 77 | #661 → #698 | **ĐÃ SỬA** | 300 chữ + 700 U+200B đạt; thêm một U+200B hoặc 650.000 U+200B → V1. R77 bỏ hiệu lực trần 1.000: 6/262 test đỏ. Hai file test DB ai-analyses và backup-invariants: 170/170 xanh, có ca từ chối 650.000 ký tự vô hình ở ghi dòng ACCEPTED và nhập backup. | 300 chữ NFD + 100 ký tự vô hình, U+3164 chỉ có khoảng trống, chữ xen U+0085 đều có test. Không báo lại REJECTED/khóa lạ/khoảng trắng đầu-cuối của backup sửa tay: KNOWN G5 §11.8. |
| 78 | #658 → #682 (1502c5e) | **ĐÃ SỬA** | core R78: ông nội, anh rể, vợ cũ, “2 con chó”, “nếu đã kết hôn…” → 0 đề xuất; bác sĩ có hai đề xuất đúng. R78 dùng Mock trước sửa: 25/74 đỏ. | K2: bảy ghi chú mới qua dấu câu, tên nghề, phủ định và giả định ở câu trước: đúng. Giới hạn “ba ruột/ba nuôi”, thú cưng ngoài danh sách, “sắp/sẽ”, “giả thử”, U+2026… đã là KNOWN, không báo lại. |
| 79 | #658 → #682 | **ĐÃ SỬA** | 36.003 ký tự: trung vị 1,83 ms (“độc thân”) / 0,46 ms (“có 2 con và”), dưới 50 ms. R79 đưa wordBefore về quét ngược mỗi vị trí: đúng hai test thời gian đỏ, tốt nhất 4.092 / 459 ms. | corpus-probe: 5.672 ghi chú tải, thuật toán mới và bản quét ngược với **cùng luật ngữ nghĩa mới** cho đề xuất giống hệt, 0 khác biệt. Tách kiểm thuật toán khỏi việc mở rộng luật ở DR6-78. |
| 89 | #658 → #682 | **ĐÃ SỬA** | Control Edge: 2/2 xanh, sau khôi phục lại 2/2 xanh. R89d dời đọc generation xuống sau hai await: 1/58 unit đỏ, chính test PR. R89b bỏ lọc generation của panel: e2e toBeHidden đỏ, Received visible. R89c bỏ faded của Item chi tiết lịch hẹn: test tương phản đỏ, 4,4411186 < 4,5. | Đủ ba đột biến R15b/R15d/R21c mà lượt 2 bỏ sót. Không suy từ việc dùng chung Item hoặc coverage. |
| 97 | #663 → #700 | **ĐÃ SỬA** | core R97 đối chiếu chuỗi nguyên văn: docs/user-guide/10-su-co.md và aiError.AI_TOO_LARGE đều “Dữ liệu gửi AI quá lớn (quá 200.000 ký tự) — rút gọn ghi chú hoặc dữ kiện rồi thử lại.” | Đây là sửa tài liệu; kiểm chữ trực tiếp, không gán test hành vi hay mutation không cần thiết. |
| 102 | #661 → #698 | **ĐÃ SỬA** | “Giữ kỉ luật Thép”, “qui luật Thị trường”, KỈ/QUI chữ hoa đều đạt; “Theo Luật Kinh doanh bảo hiểm” vẫn V6. R102 gỡ hai ngoại lệ i: 6/171 đỏ. | Cả cách viết i/y, hoa/thường và tên luật thật đều có đối chứng. |

Quy ước: các đột biến ở C/copy, dùng test gốc của PR tại SHA ghim, không sửa expectation để làm đỏ. R23/R24/R78 trả lại cả file trước sửa; R17a/b, R77, R79, R89b/c/d, R102 gỡ riêng nhánh cần kiểm. Không có dòng SỬA MỘT PHẦN, CHƯA SỬA hay HỒI QUY.

## 3. Phạm vi đã đọc

Phân loại theo classifyFile của tools/size-report-core.mjs: **60 file, 36 file sản phẩm; 5.357 dòng SP + 6.464 dòng test/hỗ trợ**, trùng baseline. Đọc logic sản phẩm, các test/hỗ trợ tương ứng và phần diff sửa 4217ed4..119e2e4; các file dài đã đọc theo nhiều đoạn. Scope/hash đầu và cuối: scope.json, export-scope.md, final-check.json.

| File | Dòng đã xét | Loại |
|---|---:|---|
| apps/desktop/src/data/ai-analysis.test.ts | 1–1025 | test |
| apps/desktop/src/data/ai-analysis.ts | 1–355 | product |
| apps/desktop/src/data/ai-jobs.test.ts | 1–113 | test |
| apps/desktop/src/data/ai-jobs.ts | 1–82 | product |
| apps/desktop/src/data/ai-tauri.test.ts | 1–108 | test |
| apps/desktop/src/data/ai-tauri.ts | 1–75 | product |
| apps/desktop/src/routes/SettingsAi.tsx | 1–388 | product |
| apps/desktop/src/routes/ai-error-view.test.ts | 1–73 | test |
| apps/desktop/src/routes/ai-error-view.ts | 1–66 | product |
| apps/desktop/src/routes/appointments/AppointmentAi.tsx | 1–103 | product |
| apps/desktop/src/routes/appointments/appointment-ai-view.test.ts | 1–183 | test |
| apps/desktop/src/routes/appointments/appointment-ai-view.ts | 1–49 | product |
| apps/desktop/src/routes/customers/KycExtraction.tsx | 1–190 | product |
| apps/desktop/src/routes/customers/KycHistory.tsx | 1–154 | product |
| apps/desktop/src/routes/customers/KycIntelligence.tsx | 1–595 | product |
| apps/desktop/src/routes/customers/KycWebSession.tsx | 1–188 | product |
| apps/desktop/src/routes/customers/ai-panel-view.test.ts | 1–1037 | test |
| apps/desktop/src/routes/customers/ai-panel-view.ts | 1–631 | product |
| apps/desktop/src/routes/customers/extraction-view.test.ts | 1–162 | test |
| apps/desktop/src/routes/customers/extraction-view.ts | 1–106 | product |
| apps/desktop/src/routes/customers/use-ai-job.ts | 1–53 | product |
| apps/desktop/src/routes/settings-ai-view.test.ts | 1–112 | test |
| apps/desktop/src/routes/settings-ai-view.ts | 1–87 | product |
| packages/ai/src/adapter.ts | 1–43 | product |
| packages/ai/src/blocklists.test.ts | 1–170 | test |
| packages/ai/src/blocklists.ts | 1–113 | product |
| packages/ai/src/code-points.test.ts | 1–51 | test |
| packages/ai/src/code-points.ts | 1–45 | product |
| packages/ai/src/errors.test.ts | 1–60 | test |
| packages/ai/src/errors.ts | 1–56 | product |
| packages/ai/src/extract-json.test.ts | 1–119 | test |
| packages/ai/src/extract-json.ts | 1–84 | product |
| packages/ai/src/index.ts | 1–11 | product |
| packages/ai/src/input.test.ts | 1–174 | test |
| packages/ai/src/input.ts | 1–29 | product |
| packages/ai/src/mock-adapter.test.ts | 1–344 | test |
| packages/ai/src/mock-adapter.ts | 1–185 | product |
| packages/ai/src/models.test.ts | 1–27 | test |
| packages/ai/src/models.ts | 1–35 | product |
| packages/ai/src/prompts/analysis.ts | 1–48 | product |
| packages/ai/src/prompts/connection.ts | 1–14 | product |
| packages/ai/src/prompts/discovery.ts | 1–43 | product |
| packages/ai/src/prompts/extraction.ts | 1–27 | product |
| packages/ai/src/prompts/prompts.test.ts | 1–55 | test |
| packages/ai/src/prompts/retry.ts | 1–63 | product |
| packages/ai/src/raw.d.ts | 1–5 | product |
| packages/ai/src/run.test.ts | 1–837 | test |
| packages/ai/src/run.ts | 1–428 | product |
| packages/ai/src/schema.test.ts | 1–403 | test |
| packages/ai/src/schema.ts | 1–385 | product |
| packages/ai/src/settings.test.ts | 1–94 | test |
| packages/ai/src/settings.ts | 1–86 | product |
| packages/ai/src/test-support.ts | 1–69 | test |
| packages/ai/src/text-match.ts | 1–90 | product |
| packages/ai/src/validator-blocklists.test.ts | 1–374 | test |
| packages/ai/src/validator-extraction.test.ts | 1–135 | test |
| packages/ai/src/validator.test.ts | 1–305 | test |
| packages/ai/src/validator.ts | 1–295 | product |
| packages/ai/src/web.test.ts | 1–434 | test |
| packages/ai/src/web.ts | 1–150 | product |

Phần sửa đọc kỹ: text-match.ts (chuẩn hóa, bareToo/TOKEN), blocklists.ts (bốn mẫu V6, kỉ/qui), schema.ts (visible, trần chuỗi, version), validator.ts (schemaDetail/isAt), mock-adapter.ts (wordBefore, SOMEONE_ELSE, SUPPOSED, NOT_SO, NOT_CHILDREN); các test C55–C72, run/web/schema, ai-analysis.test.ts và hai e2e của #682. Hai PR trọng tâm #682/1502c5e và #698/8f7355b; tài liệu #700.

Tài liệu và seam nối đã đối chiếu:

- common/prompt-codex.md; known.md (OPEN/ACCEPTED, K1–K29, bảng R); fixes.md các mục #658/#682, #661/#698, #663/#700 và hợp đồng dọn #662; plan.md §4, L3.1–L3.8; baseline.md và mốc hiệu năng cùng máy.
- CLAUDE.md gốc, packages/ai/CLAUDE.md, apps/desktop/CLAUDE.md; CONTEXT.md. Dùng làm thông tin kiến trúc, không chạy quy trình phát triển.
- Spec Phase 5 §3/3.1, §4–§10/§12; phase-5-prompts.md §6a–§8, §10/§11 cùng chữ prompt/retry được test so với tài liệu; golden ai-eval (quy ước, hồ sơ, bẫy và trích xuất); ADR-0009 D-1/G5/W-1.
- Spec Phase 6 S-2/TR-11–TR-13/D10, ngưỡng §5.2; metrics và mốc sau #656. app-data.ts, tables.ts, ai-analyses.ts và schema dùng chung ở db để dựng chuỗi qua AppData và kiểm luật lưu.
- Báo cáo gốc C lượt 1/2 trong repo của Codex/Claude/Muse, cả bản Home PC khi cần; hai tổng hợp lượt 1/2, nhất là DR6-17/23/24/77–79/89/97/102 và các kịch bản đã thử. Chỉ dùng báo cáo trong docs/reviews/raw được cho phép, không đọc thư mục review ngoài repo của bên khác.
- Probe Codex lượt 2: core-probe.mjs và exports.mjs; lấy **vòng lặp/thuật toán** làm phép đo so sánh, đổi nguồn backup sang common/load lượt 3. Không chạy lại đường dẫn backup common lượt 2.
- UI đối chiếu contract qua component hiện tại, i18n và test giao diện gốc của PR; không thực hiện một đợt visual audit toàn bộ mockup. Không mở exe hay đo lại exe; dùng số chuẩn bị ở baseline có ghi rõ nguồn.

## 4. Kịch bản mới đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| K1 | Sinh mọi tổ hợp từng âm tiết đúng dấu/không dấu của “xác suất”, “bảo hiểm trọn đời”, “hướng nội”, “nghị định”, xen SPACE/NEL/U+3164/U+034F/U+2800 | 140 biến thể; 0 lọt luật tương ứng. Câu thường R23 không bị chặn. | — |
| K2 | Chủ thể khác/giả định/phủ định ở câu trước rồi chuyển về KH; dấu ! ? ; ., nghề bác sĩ/cô giáo, “chú ý”, “10 con dao” | Bảy ghi chú mới cho đúng các đề xuất về KH; không kế thừa chủ thể/giả định ở câu trước. core-results.json lưu từng output. | — |
| K3 | Phiên web KH đang dùng → dán sai → dọn Thùng rác → dán đúng | Generation 0 → 0; lưu CURRENT, discovery@3+web@1, attempts=2. | — |
| K4 | Lịch sử @2 và @3 → xuất/nhập backup → xóa KH → dọn hẳn → nhập lại backup | Dọn bỏ KH, nhập phục hồi cả hai dòng; prompt_version @2+web@1 và @3+web@1 giữ nguyên. | — |
| K5 | Khởi chạy AI trước dọn, giữ backup; kết quả về khi dọn đang chờ và kết quả về sau dọn xong | Khi đang dọn: discarded, 0 dòng; sau dọn KH còn sống: saved/ACCEPTED, 1 dòng, generation vẫn 0. | — |
| K6 | Luật @3 trên output eval thật đã lưu 10/10 + 11/10; catalogue vi.ts; thay thuật toán Mock với cùng luật trên ghi chú tải | 547 + 538 = 1.085 text eval ở đúng block: 0 chặn mới; 2.318 literal i18n: 0 thay đổi mã chặn; 5.672 ghi chú: 0 khác đề xuất. Chỉ đọc output có sẵn, không gọi AI. | — |
| K7 | Dán lại tin nhắn app với LF/CRLF và NEL/LINE SEPARATOR/PARAGRAPH SEPARATOR; dán hai lần qua AppData rồi qua giao diện | LF/CRLF: OWN_MESSAGE. U+0085/U+2028/U+2029: retry → REJECTED. Edge qua màn tạo KH/KYC xác nhận U+2028 tiêu cả hai lần thử và thêm REJECTED. | CX3-C1 |
| K8 | Version seed tải mới và version kết quả web ở đầu/sau nhập | 103 phân tích seed: 58 discovery@3, 45 analysis@3. Web mới @3+web@1; lịch sử @2 nhập lại được, không tự đổi nhãn. | — |

K3–K5/K7 dùng openAppData, app.run, app.exportBackup/readBackup/importBackup/purgeTrash hoặc thao tác giao diện. Không dùng SQL thô để kết luận về màn. K1/K2/K6 là probe hàm AI thuần, phạm vi kết luận tương ứng.

## 5. Phát hiện mới

### CX3-C1 — Dấu tách dòng Unicode làm tin nhắn app bị tính là câu trả lời

ID: CX3-C1  
Mức: Low  
Trục: E (C, G)  
Vị trí: **packages/ai/src/web.ts:103** (119e2e4); hợp đồng **docs/design/phase-5-prompts.md:214**  
Tình trạng: CONFIRMED  
Liên quan: biến thể gần DR6-17; **có từ trước, lượt 1–2 bỏ sót**, không phải hồi quy do #698  
Kịch bản: K7

Mô tả: isOwnMessage chỉ tách CR/LF. Khi tin nhắn app được dán lại sau khi một ứng dụng trung gian đổi dấu xuống dòng sang NEL (U+0085), LINE SEPARATOR (U+2028) hoặc PARAGRAPH SEPARATOR (U+2029), các dòng mốc không được nhận ra. Lần dán bị tính vào hai lần thử thay vì OWN_MESSAGE theo quy tắc “mỗi dòng” ở G5 §6a.

Tái hiện / bằng chứng:

1. node C/own-lines-probe.mjs → own-lines-probe.log, own-lines-results.json. Tin nhắn 6.302 ký tự cùng chữ: LF/CRLF → unusable/OWN_MESSAGE; U+0085/U+2028/U+2029 → retry, rồi record/REJECTED attempts=2.
2. Qua openAppData → startChatGptWeb → saveChatGptAnswer hai lần với U+2028: lần 2 trả saved/REJECTED; listAiAnalyses có một dòng discovery@3+web@1, attempts=2.
3. Edge, copy/e2e/c-review-edge.spec.ts, lệnh node node_modules/@playwright/test/cli.js test -c pw.review.config.ts c-review-edge.spec.ts → **1 passed**, log “CONFIRMED: same app message with U+2028 → retry → REJECTED in history”. Tạo KH và KYC bằng giao diện, lấy tin nhắn từ clipboard giả của app, đổi LF sang U+2028 rồi dán hai lần. Ảnh C/CX3-C1.png. Không gọi AI, không mở trang thật, không chèn DB thô.

Ảnh hưởng: hiếm, cần clipboard mang các dấu tách dòng Unicode; tiêu hao lần thử, thêm dòng REJECTED và cần mở phiên mới. Không làm sai dữ kiện KYC hay tạo kết quả ACCEPTED sai. Vì đường vào hiếm nên mức Low.

Đề xuất: tách CR/LF cùng U+0085/U+2028/U+2029 trước chuẩn hóa từng dòng; thêm ca lần 1/lần 2 và giữ đối chứng câu trả lời chỉ nhắc dòng mốc bên trong text JSON. Ước lượng <10 dòng SP + <40 dòng test, dưới 400 SP; không đổi chữ prompt hay danh sách chặn.

## 6. Bloat

| Đã chạy / đọc | Trên | Số / kết quả | ID |
|---|---|---|---|
| TypeScript --noEmit --noUnusedLocals --noUnusedParameters, ai + desktop | Repo SHA ghim, sau khôi phục junction | Cả hai exit 0, log trống; tsc-ai.log/tsc-app.log | — |
| node tools/codemap.mjs --check | Repo SHA ghim | Export maps are up to date; không sinh/sửa file | — |
| dependency-cruiser trực tiếp | Toàn repo | 0 vi phạm; 320 module / 1.312 dependency | — |
| AST export/named import + rg từng tên, cùng phép quét Codex lượt 2 | 36 file SP C, các import code/test trong repo | 213 khai báo export, 42 không có named import SP; **bằng lượt 2**. Đã phân biệt type/API, dùng trong file và test; không đồng nghĩa 42 đoạn code chết. | — |
| Cỡ dòng theo classifyFile | 60 file C | 5.357 SP / 6.464 test/hỗ trợ; so lượt 2 5.250 / 6.110: +107 / +354. Không thêm file trong gói. | — |
| Dependency/khối lặp | package ai, diff và nguồn app | Hai dependency domain + zod đều dùng; không thêm dependency. wordBefore/bareToo là phần sửa có test giữ. Các mùi đã ghi KNOWN không báo lại. | — |
| Bundle chuẩn bị, common/baseline.md | Build chuẩn SHA 119e2e4, không biến môi trường riêng | index.js 927.932 / 271.662 B thô/gzip; tổng JS/CSS 2.400.393 / 706.754 B. So lượt 2: tổng +18.357 / +4.645 B. Không gán toàn bộ tăng của app cho AI. | — |

Không có phát hiện B mới. DR6-25 (zod đầy đủ), DR6-66/67 và các ghi chú OPEN về export qua barrel, ID ngẫu nhiên, raw-output cap, schemaDetail, helper visible, normalization/markup lặp đã đối chiếu KNOWN. Không cài công cụ mới.

Bản web probe có VITE_DEMO_ANCHOR=15/09/2026 và cấu hình alias sang bản chép, nên **không** dùng số bundle probe thay baseline chuẩn.

## 6b. Hiệu năng

Máy DESKTOP-KDURKJP; Node v24.20.0. Backup mới common/load/load-2026-10-12-seed6.p2cbackup đi qua importBackup; hash JSON.stringify(tables) **1c0a43fb9d5711df4700cb688a256ac50bb44eed1c0fd00218fa36f0746d003f**, đúng plan. 1.496 KH tổng, 1.481 KH sống, 103 phân tích; cùng nhóm 95 KH/102 dòng phân tích sống như phép đo lượt 2.

Ba phép “cùng vòng” dưới dùng nguyên vòng lặp Codex lượt 2, warmup + 9 mẫu, ngày đồng hồ 17/10/2026 như phép cũ. Lúc đo không chạy test/build khác của chính phiên; server Vite chỉ chờ request. Không có bằng chứng để khẳng định các phiên/app nền khác hoàn toàn rảnh. Node không bao gồm React/IPC/render. Số exe lấy từ bước chuẩn bị cùng máy, không nhận là phiên này đo lại.

| Đã chạy / đo | Dữ liệu | Lượt 3 trung vị (min–max), ms | Lượt 2 cùng máy, ms | So mốc / ngưỡng | ID |
|---|---|---:|---:|---|---|
| Profile + versions + analyses + panel/history/content/appointment model, cùng vòng | Toàn 95 KH có AI | 33,640 (32,296–38,092) | 29,384 | +4,256 ms, +14,5%; không xấu hơn theo luật >20% **và** >10 ms | — |
| Content/history/appointment model của KH nhiều phân tích nhất, cùng vòng | Dữ liệu đã đọc | 0,109 (0,108–0,156) | 0,082 | Tăng <0,03 ms; không xấu hơn theo luật nhiễu | — |
| Build input + web message + validator Mock, cùng vòng | 95 hồ sơ | 17,560 (16,427–18,156) | 28,652 | Giảm ≈38,7%; không đổi kỳ vọng/assertion | — |
| Mock một dòng “độc thân” ×4.000 | 36.003 ký tự, warmup + 9 mẫu | 1,833 (1,779–2,488) | PR #682 ghi trước sửa ≈2.296; R79 hiện tại tốt nhất 4.092 | <50 ms test chấp nhận; số synthetic chỉ cho R79, không thay số dữ liệu tải | — |
| Mock một dòng “có 2 con và” ×3.000 | 36.003 ký tự, 9 mẫu | 0,463 (0,397–0,506) | PR #682 ghi trước sửa ≈945; R79 hiện tại tốt nhất 459 | <50 ms; cùng giới hạn synthetic | — |
| Mock một dòng “độc thân” ×8.000 | 72.003 ký tự, 9 mẫu | 3,767 (3,708–6,048) | Lượt 2 cùng loại 8.758,98 | Nhanh hơn rõ; đề xuất vẫn cắt 20 | — |
| 100 profile tải: takeAnalysisInput + Mock + validate | 100 KH đầu theo bảng app, 7 mẫu | 15,061 (14,924–16,867) | Không có vòng nền y hệt | Chỉ ghi số, không ép so vòng khác | — |
| V1 từ chối chuỗi 650.000 ký tự vô hình | 300 chữ kẹp vô hình, 9 mẫu | 0,272 (0,261–0,363) | Không có mốc y hệt | Giới hạn gốc kiểm trước phần visible | — |
| Mở hồ sơ có AI, exe **tham chiếu** | Dữ liệu tải, common/baseline.md | 19 (18–21) | 18 (18–21) | Mốc sau #656: 19; <200 ms; +1 ms so lượt 2 trong nhiễu | — |
| Lịch sử AI, exe **tham chiếu** | Như trên | 2 (2–3) | 2 (2–18) | Mốc sau #656: 2; <200 ms, trong nhiễu | — |

Không có phát hiện P mới trên bộ tải. Nguồn số: perf-comparable-results.json/log (cùng vòng); core-results.json (synthetic và vòng 100 KH); corpus-results.json (5.672 ghi chú, đầu ra tương đương); common/baseline.md (exe sau #656/lượt 2). Không so số Home PC với Office Laptop, không coi độ trễ test e2e là hiệu năng sản phẩm.

## 7. Bảng đếm mức × trục

Mỗi phát hiện chỉ đếm ở trục chính; các dòng R và KNOWN không cộng thành phát hiện mới.

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tổng | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **1** |

**1/1 CONFIRMED; 0 PLAUSIBLE, tỷ lệ 0%.** CX3-C1 có liên hệ phụ C/G nhưng không đếm thêm. 9/9 R ĐÃ SỬA; 11/11 đột biến KILLED, 0 SURVIVED.

## 8. Đã xét, không thấy

| Trục | Đã đọc / chạy và giới hạn kết luận |
|---|---|
| R | Tái hiện đường lỗi, biến thể và test giết sửa ở chín DR6; docs-only R97 so chữ. Không có phần sửa thiếu/hồi quy đã xác nhận. |
| E | K1/K2/K3–K5/K8, trần 700/701/650.000, NFD, ngoại lệ luật, ranh giới chủ thể/câu. Ngoài K7/CX3-C1 không thấy mới. Giới hạn Mock đã KNOWN giữ nguyên. |
| C | G5 §6a/§7/§8/§11 ↔ cleanText/bareToo/V1/detail/LAW_NAME/version; hướng dẫn R97 ↔ vi.ts. Ngoài CX3-C1 không thấy hợp đồng mới lệch. Chữ spec §3.1 cũ/README @1 và ví dụ mockup cũ thuộc KNOWN, không báo lại. |
| D | AppData qua dọn/backup/@2/@3; kết quả AI đến trong/sau dọn; lịch sử sau nhập. Không thấy ghi nhầm DB/phiên hay đổi version cũ. Không dùng probe này để khẳng định độ bền file/exe của gói B. |
| G | 140 biến thể; 1.085 text eval đúng block; 2.318 literal vi.ts so trước/sau; test V3/V4/V6 vẫn áp cho personalityNotes, V5 được miễn đúng block. Không gọi eval thật. Ngoài CX3-C1 không thấy mới. Các trường hợp từ §11.8 đã chấp nhận không đếm lại. |
| S | Adapter Tauri chỉ gửi model/plan/messages/maxTokens/session ID; save settings chỉ bốn trường, key qua command riêng; web URL hằng và output hiện text node. Test hiện có về trường key/HTTP/XSS đã đọc, unit chạy lại. Browser probe chặn mạng ngoài localhost dạng 127.0.0.1, không đọc key/kho key. Không thay kiểm Rust gói B. |
| P | Bảng 6b: phép tải cùng vòng và số exe chuẩn bị trong ngưỡng/nhiễu; DR6-79 hết bậc hai và đề xuất tương đương. Không có phát hiện P mới. |
| B | Bảng 6: typecheck, codemap, deps, AST/rg export, diff, dependency và baseline bundle. Không có bloat mới có chi phí chứng minh được; không đếm lại KNOWN. |
| T | 929 unit C trên bản chép và trên repo gốc sau khôi phục; 170 DB; hai e2e PR đối chứng trước/sau; 11 mutation đều đỏ đúng seam. Test chưa có ca separator Unicode → bằng chứng của CX3-C1, không tách thêm ID test hở. |
| A | Đọc focus/live-region/nhãn i18n ở KycExtraction/KycIntelligence/KycHistory/KycWebSession/SettingsAi/AppointmentAi. E2E giữ tương phản STALE bị mutation bắt ở 4,4411 <4,5; control xanh. Không visual audit mọi viewport và không báo như đã làm. Không có phát hiện A mới. |

## 9. Phụ lục

### 9.1 Nguồn probe và lệnh

Mọi đường dẫn tương đối ở đây nằm dưới C:\workspace\deep-review-1-6-r3\codex\C\.

| Nguồn | Lệnh / việc | Bằng chứng |
|---|---|---|
| setup.mjs, hooks.mjs, source.zip, copy/ | git archive HEAD; alias @p2c sang bản chép, junction dependency hiện có; không pnpm install | scope.json lưu hash/line count |
| core-probe.mjs | node core-probe.mjs: R17/23/24/77/78/97/102, K1–K5, tải mới/synthetic | core-probe.log, core-results.json |
| corpus-probe.mjs | Đọc JSON output trong hai metrics eval, so matcher trước/sau đúng block; Mock nhanh vs quét ngược cùng luật mới trên ghi chú tải | corpus-probe.log, corpus-results.json |
| vi-corpus.mjs | TypeScript AST lấy 2.318 literal, so mã chặn cũ/mới | vi-corpus.log/json |
| own-lines-probe.mjs | LF/CRLF/NEL/LS/PS; luồng lưu AppData | own-lines-probe.log, own-lines-results.json |
| copy/e2e/c-review-edge.spec.ts | Node Playwright CLI với pw.review.config.ts; tạo KH/KYC qua UI, hai lần dán U+2028 | own-lines-browser.log, CX3-C1.png |
| mutate.mjs | Node Vitest CLI với vitest.review.config.ts, vá từng bản chép và finally trả nguồn | mutations/summary.json, R*.log, R*.patch-source.txt |
| ui-mutate.mjs | Dựng web từng mutant, giữ snapshot; chạy test PR tương ứng; trả nguồn và dựng lại | mutations/ui-summary.json, R89b/c*.log |
| copy/e2e/safe-test.ts, server.mjs | Auto fixture route mọi URL, chỉ cho hostname 127.0.0.1; window.open thay trước navigation; Edge không resolve host khác; Vite 127.0.0.1:4397 | e2e-control.log, e2e-final-restored.log; server đã tắt |
| perf-comparable.mjs | Ba vòng lặp từ probe Codex lượt 2, đổi sang tải lượt 3; không đọc backup lượt 2 | perf-comparable.log, perf-comparable-results.json |
| exports.mjs | AST + rg, cùng scanner Codex lượt 2 | exports.log/json, export-scope.json/md |
| final-check.mjs | Hash 60 file repo/bản chép so đầu, git HEAD/status | final-check.json; 0 sourceChanged, 0 copiedChanged |

Control unit: node node_modules/vitest/vitest.mjs run [các file C] → 929/929, cả copy và repo; unit-control.log, unit-final-source.log. Hai file db → 170/170 (db-r77-control.log). Hai test e2e PR → 2/2 trước và sau mutation. Probe browser mới → 1/1 tái hiện lỗi hiện có, **không** phải test khẳng định yêu cầu đúng.

### 9.2 Đột biến

| ID | Phần gỡ trên bản chép | Test PR / kết quả |
|---|---|---|
| R17a | cleanText về NFKC rồi bỏ Cf | KILLED, 12 failed / 211 |
| R17b | V6 khoảng trắng tùy chọn về bắt buộc | KILLED, 8 failed / 171 |
| R23 | text-match.ts trước sửa | KILLED, 27 failed / 171 |
| R24 | validator.ts trước sửa | KILLED, 12 failed / 93 |
| R77 | Vô hiệu trần chuỗi gốc 1.000 | KILLED, 6 failed / 262 |
| R78 | mock-adapter.ts trước sửa | KILLED, 25 failed / 74 |
| R79 | Quét ngược mỗi vị trí thay wordBefore một lượt | KILLED, 2 failed / 74; các test <50 ms nhận 4.092/459 ms tốt nhất |
| R89d | Đọc generation sau copy/open await | KILLED, 1 failed / 58 |
| R102 | Gỡ kỉ/qui | KILLED, 6 failed / 171 |
| R89b | Panel giữ opened dù generation đổi | KILLED, e2e khung vẫn visible |
| R89c | Item chi tiết lịch hẹn không nhận faded | KILLED, e2e tương phản 4,4411186 <4,5 |

### 9.3 Sai lệch thao tác / lỗi probe, đã xử lý

- Lệnh ghi báo cáo đầu tiên lỗi overload Replace(char, char) của PowerShell; chưa tạo nội dung báo cáo, đã sửa sang ghi UTF-8 rồi kiểm dòng đầu trước khi đọc code.
- Một lần pnpm exec ở **bản chép** tự đi vào kiểm cài đặt (không gọi pnpm install), rồi báo “workspace hoist directory is not a real directory” vì node_modules là junction. Trước khi dừng nó đã đổi tám junction @p2c trong node_modules của các package nguồn sang copy. Phát hiện khi dependency-cruiser báo tám đường sang thư mục probe. Đã kiểm từng link, chỉ xóa **junction** bằng Directory.Delete không recursive, dựng lại về C:\workspace\Project-2C-review-2\packages\ tương ứng; log restored-links.json. .pnpm/node_modules/@p2c vẫn trỏ checkout gốc, không phải các link bị đổi. Sau đó deps xanh 320/1.312, typecheck và 929 unit **trên nguồn gốc** xanh. Từ sau lỗi đầu chỉ gọi CLI bằng node, không pnpm exec/install.
- Các lỗi dựng probe đã sửa trong thư mục riêng: alias CSS @p2c/ui/theme.css; URL file trên Windows ở seed snapshot; fixture promptVersion của CHATGPT_WEB thiếu +web@1; tên nhãn “còn” chữ thường ở browser probe. Không tính lỗi script đó thành lỗi sản phẩm; chỉ dùng log chạy cuối thành công.
- Các tool-call thử tạo script bị parser từ chối trước thực thi không ghi hay đọc file. Không truy cập vùng cấm hay báo cáo lượt 3 bên khác.
- Cấu hình build probe đặt VITE_DEMO_ANCHOR=15/09/2026, alias package nội bộ tới copy; các bản dựng chỉ phục vụ kiểm UI, số bundle lấy baseline chuẩn. Không dùng PW_REUSE=1 hoặc cổng 4173.
- Node/TS tạm nằm trong copy, không vào repo. Bản chép còn giữ làm bằng chứng; mọi file C tracked trong copy đã trả nguyên hash. Không xóa thư mục/junction dependency dùng chung.

### 9.4 Cuối phiên

- HEAD và git status giữ nguyên đầu phiên như mục 1; final-check.json xác nhận đủ **60/60** file C của repo và bản chép không đổi byte.
- Node server của riêng phiên trên 4397 đã tắt sau khi xác minh command line trỏ đúng C/server.mjs.
- Không sửa lỗi sản phẩm, không tạo Issue/PR, không commit/merge; không tổng hợp với bên khác.
- Giờ hoàn tất: 2026-10-20 07:32:50 +07:00 (Asia/Bangkok).
