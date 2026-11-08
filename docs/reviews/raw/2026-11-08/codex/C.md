XONG — codex gói C lượt 6, 2026-11-07 13:26:56 +07:00

# Deep review Phase 1–6, lượt 6 — Codex, gói C: AI

## 1. Thông tin phiên

- Bên: Codex; mã phát hiện CXR6; gói C — AI.
- Worktree: `C:\workspace\Project-2C-review-2`.
- SHA đầu và cuối phiên: `5b1328ae236aa62981dbf43066ff544a9e832c8c`.
- `git status --short` đầu phiên: rỗng (sạch).
- Bắt đầu: **07/11/2026 13:00:32 +07:00**, Asia/Bangkok.
- Phiên làm tiếp sau tin nhắn Owner “tiếp tục”: **13:12:53 +07:00**, từ phần kiểm UI, giữ mọi kết quả đã ghi. Cùng công cụ và ngữ cảnh model.
- Công cụ xác minh: **codex-cli 0.162.1**, Codex desktop, PowerShell, Node **v24.20.0**, Vitest, Vite và Playwright / Microsoft Edge có sẵn. `codex --version` có cảnh báo không ghi được thư mục tmp / PATH alias ngoài workspace; vẫn trả được phiên bản CLI.
- Model: ngữ cảnh hệ thống của phiên công bố **GPT-6 Codex**; không có công cụ trả ID biến thể hay mức suy luận. Prompt phân công GPT Sol 6.1; không ghi phân công đó thành thông số runtime đã xác minh.
- Điều kiện gói: C chưa tồn tại; A và B đều có dòng đầu XONG. Chỉ đọc dòng đầu A/B cho bước 0. Không làm bảng R1/R2; các dòng R là KNOWN theo prompt.
- Chỉ đọc repo, không sửa code / cấu hình / spec / golden, không commit / PR / Issue, không gọi `pnpm`, `gh`, eval AI thật, ChatGPT thật hay Credential Manager. Mọi nguồn probe và log nằm trong thư mục C của chính Codex.

## 3. Phạm vi đã đọc

**Đọc kỹ đủ 65/65 file của `common/files-C.txt`: 39 product, 26 test / hỗ trợ test; không có file bỏ đọc kỹ.** Theo baseline ở SHA ghim: 6.610 dòng sản phẩm và 8.262 dòng test.

Đọc trước diff `37a80b6..5b1328a` của danh sách gói: **7 file code/test** (5 product, 2 test), +46/−16 dòng sản phẩm, +65/−5 dòng test theo baseline. Gồm `KycHistory.tsx`, `KycIntelligence.tsx`, `KycWebSession.tsx`, `mock-extraction.ts`, `mock-extraction.test.ts`, `web.ts`, `web.test.ts`. Đọc thêm diff `packages/ai/CLAUDE.md` (tài liệu, ngoài manifest). Nhật ký nháp ban đầu ghi nhầm 9 file; danh sách và số kiểm cuối ở đây thay số nháp đó.

Tập trung phần đổi: phép thử `worded`, dấu đầu dòng U+2013, “bé” nghĩa nhỏ, “đứa / thằng … đã mất”, một luật câu dán trống và giới hạn MAX_READ; cách xuống dòng nhãn model. Phần còn lại đã đọc từ đầu tới cuối, gồm toàn bộ fixture, bảng ca và assertion của các file test.

Tài liệu / chỗ nối đã đọc và đối chiếu:

- `CLAUDE.md` gốc, `packages/ai/CLAUDE.md`, `apps/desktop/CLAUDE.md`, `CONTEXT.md`; không tìm thấy AGENTS.md tại gốc repo / hai package được kiểm bằng tên cụ thể.
- `common/prompt-codex.md`, `files-C.txt`, các phần áp dụng của `plan.md` (§4, L6), `known.md` (OPEN / ACCEPTED, quyết định K1–K50 và bảng KNOWN), `fixes.md` phần T-365 / T-375, `baseline.md`.
- `docs/design/phase-5-ai.md`, trọng tâm §3, §3.1, §4–§10; `phase-5-prompts.md` §1–§8, §11–§14 và các giới hạn đã duyệt; `docs/golden/ai-eval.md`; ADR-0009 D-1 / G5 / W-1; Phase 6 §4.1, TR-9 / TR-11 và §5.
- Phần AI, bảng sửa và quyết định liên quan trong các tổng hợp lượt 1–5; báo cáo gốc Codex gói C các lượt 1–5 trong repo; phần Mock của báo cáo Claude C lượt 4–5 để phân biệt các giới hạn K42 / K43 với lỗi mới. Không đọc báo cáo lượt 6 của bên khác.
- Ngoài gói: `app-data.ts`, `tables.ts`, `AppDataContext.tsx`, `Screen.tsx`, `CustomerProfile.tsx`, `kyc-view.ts:83` (`factInEffect`), Dialog / các class dùng chung, i18n AI, Vite / Vitest / Playwright config, e2e web AI, `.dependency-cruiser.cjs`, phần thông điệp lỗi Rust / CSP / capability phục vụ kiểm ranh giới.

| File trong manifest | Loại | Độ đọc |
|---|---|---|
| apps/desktop/src/data/ai-analysis.test.ts | test | Đọc kỹ toàn file |
| apps/desktop/src/data/ai-analysis.ts | product | Đọc kỹ toàn file |
| apps/desktop/src/data/ai-jobs.test.ts | test | Đọc kỹ toàn file |
| apps/desktop/src/data/ai-jobs.ts | product | Đọc kỹ toàn file |
| apps/desktop/src/data/ai-tauri.test.ts | test | Đọc kỹ toàn file |
| apps/desktop/src/data/ai-tauri.ts | product | Đọc kỹ toàn file |
| apps/desktop/src/routes/SettingsAi.tsx | product | Đọc kỹ toàn file |
| apps/desktop/src/routes/ai-error-view.test.ts | test | Đọc kỹ toàn file |
| apps/desktop/src/routes/ai-error-view.ts | product | Đọc kỹ toàn file |
| apps/desktop/src/routes/appointments/AppointmentAi.tsx | product | Đọc kỹ toàn file |
| apps/desktop/src/routes/appointments/appointment-ai-view.test.ts | test | Đọc kỹ toàn file |
| apps/desktop/src/routes/appointments/appointment-ai-view.ts | product | Đọc kỹ toàn file |
| apps/desktop/src/routes/customers/KycExtraction.tsx | product | Đọc kỹ toàn file |
| apps/desktop/src/routes/customers/KycHistory.tsx | product | Đọc kỹ toàn file |
| apps/desktop/src/routes/customers/KycIntelligence.tsx | product | Đọc kỹ toàn file |
| apps/desktop/src/routes/customers/KycWebSession.tsx | product | Đọc kỹ toàn file |
| apps/desktop/src/routes/customers/ai-panel-view.test.ts | test | Đọc kỹ toàn file |
| apps/desktop/src/routes/customers/ai-panel-view.ts | product | Đọc kỹ toàn file |
| apps/desktop/src/routes/customers/extraction-view.test.ts | test | Đọc kỹ toàn file |
| apps/desktop/src/routes/customers/extraction-view.ts | product | Đọc kỹ toàn file |
| apps/desktop/src/routes/customers/use-ai-job.ts | product | Đọc kỹ toàn file |
| apps/desktop/src/routes/settings-ai-view.test.ts | test | Đọc kỹ toàn file |
| apps/desktop/src/routes/settings-ai-view.ts | product | Đọc kỹ toàn file |
| packages/ai/src/adapter.ts | product | Đọc kỹ toàn file |
| packages/ai/src/analysis-steps.ts | product | Đọc kỹ toàn file |
| packages/ai/src/attempts.ts | product | Đọc kỹ toàn file |
| packages/ai/src/blocklists.test.ts | test | Đọc kỹ toàn file |
| packages/ai/src/blocklists.ts | product | Đọc kỹ toàn file |
| packages/ai/src/code-points.test.ts | test | Đọc kỹ toàn file |
| packages/ai/src/code-points.ts | product | Đọc kỹ toàn file |
| packages/ai/src/errors.test.ts | test | Đọc kỹ toàn file |
| packages/ai/src/errors.ts | product | Đọc kỹ toàn file |
| packages/ai/src/extract-json.test.ts | test | Đọc kỹ toàn file |
| packages/ai/src/extract-json.ts | product | Đọc kỹ toàn file |
| packages/ai/src/index.ts | product | Đọc kỹ toàn file |
| packages/ai/src/input.test.ts | test | Đọc kỹ toàn file |
| packages/ai/src/input.ts | product | Đọc kỹ toàn file |
| packages/ai/src/mock-adapter.test.ts | test | Đọc kỹ toàn file |
| packages/ai/src/mock-adapter.ts | product | Đọc kỹ toàn file |
| packages/ai/src/mock-extraction.test.ts | test | Đọc kỹ toàn file |
| packages/ai/src/mock-extraction.ts | product | Đọc kỹ toàn file |
| packages/ai/src/models.test.ts | test | Đọc kỹ toàn file |
| packages/ai/src/models.ts | product | Đọc kỹ toàn file |
| packages/ai/src/prompts/analysis.ts | product | Đọc kỹ toàn file |
| packages/ai/src/prompts/connection.ts | product | Đọc kỹ toàn file |
| packages/ai/src/prompts/discovery.ts | product | Đọc kỹ toàn file |
| packages/ai/src/prompts/extraction.ts | product | Đọc kỹ toàn file |
| packages/ai/src/prompts/prompts.test.ts | test | Đọc kỹ toàn file |
| packages/ai/src/prompts/retry.ts | product | Đọc kỹ toàn file |
| packages/ai/src/raw.d.ts | product | Đọc kỹ toàn file |
| packages/ai/src/run.test.ts | test | Đọc kỹ toàn file |
| packages/ai/src/run.ts | product | Đọc kỹ toàn file |
| packages/ai/src/schema.test.ts | test | Đọc kỹ toàn file |
| packages/ai/src/schema.ts | product | Đọc kỹ toàn file |
| packages/ai/src/settings.test.ts | test | Đọc kỹ toàn file |
| packages/ai/src/settings.ts | product | Đọc kỹ toàn file |
| packages/ai/src/test-support.ts | test | Đọc kỹ toàn file |
| packages/ai/src/text-match.ts | product | Đọc kỹ toàn file |
| packages/ai/src/validator-blocklists.test.ts | test | Đọc kỹ toàn file |
| packages/ai/src/validator-extraction.test.ts | test | Đọc kỹ toàn file |
| packages/ai/src/validator-union.test.ts | test | Đọc kỹ toàn file |
| packages/ai/src/validator.test.ts | test | Đọc kỹ toàn file |
| packages/ai/src/validator.ts | product | Đọc kỹ toàn file |
| packages/ai/src/web.test.ts | test | Đọc kỹ toàn file |
| packages/ai/src/web.ts | product | Đọc kỹ toàn file |

## 4. Kịch bản đã thử

Nguồn và lệnh đầy đủ ở §9. Các số ở bảng là kết quả thực chạy; corpus Mock ghi cả từng câu và giá trị để kiểm lại.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | SHA, trạng thái repo, điều kiện gói | Đúng SHA, sạch; A/B XONG; C mới | — |
| 2 | Toàn bộ suite gói C bằng CLI Vitest trực tiếp | **25 file / 1.849 test xanh**, duration 3,25 s. test-support.ts là module hỗ trợ, không phải suite | — |
| 3 | 45 câu Mock mới: đổi Hôn nhân nhiều lần, hai lượt con mất, câu về người khác / hỏi / dự định, dấu đầu dòng / xuống dòng, trạng thái mới sau vế con mất | Qua `runExtraction` / V1 / V7; đã xem từng kết quả trong node-results.json, không thấy sai khác mới ngoài luật / giới hạn đã duyệt | — |
| 4 | 7 cụm chặn × 6 dạng: thường, NFD, NFD+WJ, NUL trong chữ, dấu lạc sau khoảng trắng, toàn khổ | **42/42 bị chặn đúng trục**: V3 12, V4 6, V5 12, V6 12 | — |
| 5 | AI chờ → đổi nghề KYC → trả lời → xuất / đọc backup | ACCEPTED, **STALE**; backup hợp lệ | — |
| 6 | AI chờ → nhập lại backup cùng dữ liệu / cùng ID → trả lời | **discarded**, không ghi dòng AI | — |
| 7 | AI chờ → xóa KH → khôi phục trước khi trả lời | Lưu ACCEPTED vào cùng KH / phiên bản đã khôi phục; không coi đây là lỗi vì đối tượng và dữ kiện vẫn còn | — |
| 8 | AI chờ → xóa KH → dọn sạch → trả lời | **discarded** | — |
| 9 | AI chờ trên KH còn → dọn sạch → trả lời | Lưu ACCEPTED, generation giữ 0, đúng TR-11 | — |
| 10 | Phiên web → đổi KYC → dán sai → dán đúng | ACCEPTED, STALE, attempts=2 | — |
| 11 | Hàm web: chỉ ký tự vô hình, rồi 40.001 dấu cách | EMPTY / TOO_LONG; session vẫn 0 lần thử | — |
| 12 | Browser: ghi chú đã lưu có “Đứa lớn đã mất”, Hôn nhân đã xác nhận | Không đề xuất Số con cũ; Hôn nhân trùng được ẩn; hiện không tìm thấy dữ kiện mới | — |
| 13 | Browser: dán ký tự vô hình, rồi 40.001 khoảng trắng | Nút tắt / bật đúng; TOO_LONG không tính lần; focus về ô dán | — |
| 14 | Browser: phân tích chờ → rời hồ sơ → quay lại → Hủy → trả lời | Job vẫn hiện; Hủy giữ busy=true và đúng một pending; trả lời xong mở khóa, **0 dòng được lưu** | — |
| 15 | HTTP 502 có token 200 chữ liền tại Phân tích / Trích xuất / Kết nối; cảnh báo cấu hình model 100 chữ liền; đối chứng chữ ngắn / mặc định | Cả bốn nơi tràn; lỗi ngắn và mặc định không tràn. Cấu hình model lạ xuất / đọc backup được | CXR6-C1 |
| 16 | dependency-cruiser: repo thật và ba cạnh sản phẩm → test / test-support trên cây probe; một cạnh test đối chứng | Repo 0 vi phạm; ba cạnh sản phẩm bị rule chung bắt; cạnh test được nhận | — |

## 5. Phát hiện mới

### CXR6-C1 — Chữ liền dài trong lỗi / cảnh báo AI làm tràn trang

**ID:** CXR6-C1  
**Mức:** Low  
**Trục:** A  
**Vị trí:** `apps/desktop/src/routes/customers/KycIntelligence.tsx:314`; `apps/desktop/src/routes/customers/KycExtraction.tsx:144`; `apps/desktop/src/routes/SettingsAi.tsx:380` và `:80` (5b1328a).  
**Tình trạng:** CONFIRMED  
**Liên quan:** cùng họ chữ liền dài DR6-118 / DR6-148 / DR6-170, nhưng là các consumer lỗi / cảnh báo chưa được bao phủ; **có từ trước, lượt 1–5 bỏ sót**. Các đoạn lỗi / cảnh báo không đổi trong đợt sửa sau lượt 5.

**Mô tả:** RetryAlert đặt thông điệp trong `span.flex-1` không được co / ngắt từ; Cài đặt hiện lỗi kết nối và cảnh báo model lạ cũng không ngắt token. Một serverMessage 200 chữ W (đúng trần Rust và AiError), hoặc tên model lạ 100 chữ W trong cấu hình, làm trang cuộn ngang; nút Thử lại của Phân tích / Trích xuất đi ra ngoài cửa sổ.

**Tái hiện / bằng chứng:** `node C:\workspace\deep-review-1-6-r6\codex\C\browser.mjs`, exit 0, Microsoft Edge headless trên bản build web. Tạo KH / ghi chú qua `openAppData` → `app.run` / lệnh db như app, bấm UI thật; adapter giả trả `new AiError('AI_HTTP', {httpStatus: 502, serverMessage: 'W'.repeat(200)})`. Không SQL thô, không dịch vụ AI thật. Tại Cài đặt, thêm đối chứng model lạ bằng `putSetting` đúng API, rồi `app.exportBackup()` → `app.readBackup()` thành công. `browser-results.json`: 11 bản ghi, **0 request ngoài 127.0.0.1, 0 pageerror**.

| Nơi hiện | Cửa sổ | document.scrollWidth | main.scrollWidth | Ghi chú |
|---|---:|---:|---:|---|
| Lỗi Phân tích | 1.100 | **2.925** | 2.693 | Span chữ rộng 2.562,25 px; Thử lại ngoài khung |
| Lỗi Phân tích, bố cục 3 cột | 1.440 | **3.709** | 3.477 | Khung lỗi rộng 342 px nhưng scrollWidth 2.651 |
| Lỗi AI trích xuất | 1.100 | **3.343** | 3.111 | Cùng RetryAlert; lỗi panel vẫn còn trong ca đo này |
| Lỗi Kiểm tra kết nối | 1.100 | **2.995** | 2.763 | Span chữ rộng 2.562,25 px |
| Cảnh báo model lạ W×100 | 1.100 | **1.718** | 1.486 | Backup xuất / đọc được |
| Lỗi kết nối ngắn “Bad gateway” | 1.100 | **1.100** | 868 | Đối chứng không tràn |
| Cấu hình mặc định | 1.100 | **1.100** | 868 | Đối chứng không tràn |

Ảnh thật: `C/panel-error-1100.png`, `panel-error-1440.png`, `extraction-error-1100.png`, `settings-error-1100.png`, `settings-invalid-model-1100.png`. Đã mở xem ảnh Cài đặt để kiểm lại phép đo.

**Cùng mẫu:** đã chạy `rg -n 'serverMessage|errorText\(|failureText\(|<AiErrorText|RetryAlert' apps packages`, đọc mọi consumer, rồi thử các đường UI trên:

- `KycIntelligence.tsx:313`–`:314` là renderer RetryAlert dùng chung; Phân tích gọi ở `:580`, Trích xuất tại `KycExtraction.tsx:144`: cả hai sai.
- `SettingsAi.tsx:380`–`:381` (ConnectionCard): sai.
- `SettingsAi.tsx:80`–`:81` (`problemText` → cảnh báo model lạ): sai; phần dựng chữ ở `settings-ai-view.ts` và `readAiSettings` giữ nguyên tên để giải thích cấu hình cũ.
- `SettingsAi.tsx:287`–`:288` (KeyCard) cũng dùng `errorText`, nhưng lệnh key thật chỉ có lỗi keyring / bad request, không mang serverMessage HTTP: không tính thành đường lỗi thứ năm.
- `ai-error-view.ts:26` chỉ dựng chuỗi; `ai.rs:423`–`:433` che thông tin nhạy cảm và cắt ở 200 code point, không thêm dấu ngắt token. Không có consumer serverMessage sản phẩm nào khác qua phép quét.
- Đã đối chiếu KNOWN / sổ: không thấy ghi chú chấp nhận riêng cho bốn chỗ lỗi / cảnh báo này. Bảng R DR6-170 về nhãn model trong lịch sử đã sửa là KNOWN, không báo lại nó.

**Ảnh hưởng:** OpenCode trả HTTP lỗi kèm mã / URL / token dài không có khoảng trắng, hoặc backup mang cấu hình model lạ liền dài. Phải cuộn ngang để đọc lỗi / tới Thử lại. Điều kiện hiếm, chỉ sai hiển thị; không sai dữ liệu, không lộ key, không lọt guardrail.

**Chặn phát hành:** **không** — Low trục A theo K48; đề xuất đưa vào sổ sau v1.0, phiên tổng hợp chốt.

**Đề xuất:** cho phần chữ lỗi / cảnh báo co và ngắt token ở mọi consumer, giữ nút Thử lại trong khung; dùng chung cách render lỗi AI để phủ cả Phân tích / Trích xuất / Kết nối. Thêm e2e đối chứng lỗi ngắn và token 200 chữ, cảnh báo model 100 chữ, ở 1.100 / 1.440 px. Ước lượng **5–12 dòng sản phẩm, 35–60 dòng test**; không cần đổi Rust, schema hay G5.

## 7. Đếm mức × trục

| Mức | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **1** | **1** |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

- **1 CONFIRMED; 0 PLAUSIBLE** (0%). Một ID gộp bốn vị trí cùng nguyên nhân.
- Đề xuất **0 chặn / 1 không chặn** phát hành trong gói C theo K48. Không đưa kết luận sẵn sàng v1.0 của toàn repo ở gói này.
- Không đếm lại R1 / R2 hoặc các giới hạn KNOWN thành phát hiện mới.

## 8. Đã xét, không thấy thêm

| Trục | Bằng chứng đã đọc / chạy và giới hạn kết luận |
|---|---|
| E | Toàn bộ Mock reader / regex / bảng ca; 45 câu mới, hai cái chết liên tiếp, các chữ chỉ người và đầu dòng; Node / browser dán vô hình và MAX_READ+1; Hủy qua rời / quay lại màn. Không thấy edge case mới khác CXR6-C1. Những kết quả như câu sau chỉ hỏi / dự định giữ giá trị cũ, người thân đứng trước cụm trong cùng câu, “vợ KH đã mất” và RETRACTED toàn ghi chú thuộc K42, không báo lại. |
| C | Spec Phase 5 §3–§10, G5 và golden; prompt tests so nguyên văn, blocklist tests đọc từng hàng / cột Bỏ dấu từ tài liệu; UI nguồn / mode / hai lần thử; phần sửa T-365 / T-375 đối chiếu bằng biến thể. Không thấy mâu thuẫn hợp đồng mới. Không chấm chất lượng model thật bằng Mock. |
| D | AppData thật ở các chuỗi 5–10; kết quả cũ bị bỏ khi nhập cùng ID; STALE khi KYC đổi; dọn sạch không đổi generation của KH còn; backup đọc lại được. Unit giữ các ca thay lỗi / đang thay, token và output REJECTED. Không thấy mất / ghi sai dữ liệu mới. |
| G | Đọc schema V1, V2, V3–V6 và V7 toàn file; 42 biến thể thêm đều đúng mã; suite giữ cap 30 issue, 2 lần thử, output lớn / bị cắt, chuỗi 1.000 / phần thấy được 300, personalityNotes chỉ miễn V5, trích xuất chỉ là đề xuất chờ RE. Các giới hạn NUL cạnh cụm / chữ tương hình / danh sách đóng ở G5 §11.8, §12.8, §14.5 là KNOWN. Không thấy đường lọt mới trong các phép đã thử. |
| S | Đọc adapter IPC, errorDetails, AppAi.save chỉ bốn trường, đầu vào phân tích tối thiểu, Settings password, phần Rust lấy thông điệp JSON / che / cắt và CSP. Probe browser chặn mọi host ngoài 127.0.0.1, thay window.open trước goto, web tools giả. Không thấy HTML được thực thi hoặc key có đường vào settings / input / backup theo luồng chuẩn; không đọc key thật, không gọi AI thật, không chạy lại toàn Rust. |
| P | Đọc cursor readerOf / clausesOf, giới hạn lần quét extractJson, MAX_READ / code-point cap và các ca giữ tính tuyến tính trong suite đã xanh. Mốc Mock mới đã được Owner nhận theo K50; baseline có số exe chuẩn. Không có nghi vấn P mới cần số đo tải; không dùng thời gian build / unit / ảnh UI làm benchmark sản phẩm. Mục hiệu năng toàn repo dành gói F. |
| B | Đọc mọi file sản phẩm, các helper chung attempts / analysis-steps / error renderer / labels; kiểm import thực bằng dependency-cruiser. Không thấy bloat mới có chi phí chứng minh được. Không đề xuất gỡ luật Mock hay đổi kiến trúc chỉ vì độ dài; K49 giữ đóng băng. Mục Bloat toàn repo dành gói F. |
| T | Đọc 26 file test / hỗ trợ, chạy 25 suite / 1.849 test; ranh giới thật 0 vi phạm và ba cạnh probe bị bắt; đọc test giới hạn / retry / hủy / generation và các ca mới của diff. CXR6-C1 là khoảng hở UI của họ chữ liền dài, gộp cùng phát hiện, không thêm ID T. Không suy từ coverage hoặc suite xanh rằng hết lỗi. |
| A | Đọc mọi JSX trong manifest, live region, nhãn, focus, Dialog / i18n liên quan; browser xác nhận focus sau dán lỗi và trạng thái Hủy khi quay lại. Ngoài CXR6-C1, không thấy lỗi trợ năng / i18n mới qua phép đã thử. Không nhận là đã chạy screen reader hay đo lại mọi cặp tương phản trên exe. |

## 9. Phụ lục và kiểm cuối

Tất cả đường dẫn tương đối `C/...` trong báo cáo lấy gốc `C:\workspace\deep-review-1-6-r6\codex\`. Repo không bị patch; không có bản đột biến sản phẩm cần hoàn nguyên.

| Nguồn / lệnh | Bằng chứng |
|---|---|
| `common/files-C.txt` → danh sách test; `node node_modules/vitest/vitest.mjs run <25 đường dẫn .test.ts> --reporter=dot` | `C/unit-C.log`: 25 passed, 1.849 passed, duration 3,25 s |
| `node --import file:///C:/workspace/deep-review-1-6-r6/codex/C/hooks.mjs C:\workspace\deep-review-1-6-r6\codex\C\probe-node.mjs` | `C/probe-node.mjs`, `hooks.mjs`, `node.log`, `node-results.json`; exit 0; 94 bản ghi = 45 Mock + 7 chuỗi AppData + 42 guardrail; errors=[], bugs=[] |
| `node C:\workspace\deep-review-1-6-r6\codex\C\build-web.mjs` | `C/build-web.mjs`, `browser-main.tsx`, `build-web.log`, `webdist/`; exit 0. Plugin transform entry trong bộ nhớ, không sửa source repo. Pin `VITE_DEMO_ANCHOR=2026-11-07`; client OpenCode / clipboard / browser đều giả; adapter Mock có thể giữ chờ. Không dùng cỡ bundle có seam làm số sản phẩm |
| `node C:\workspace\deep-review-1-6-r6\codex\C\browser.mjs` | `C/browser.mjs`, `browser.log`, `browser-results.json`, 7 ảnh layout; exit 0; 11 bản ghi; local server 4387, browser và server đóng ở finally; 0 ngoài mạng, 0 pageerror |
| `node node_modules/dependency-cruiser/bin/dependency-cruiser.mjs apps packages --output-type err-long` | `C/deps-baseline.log`: exit 0, 354 module / 1.582 cạnh, 0 vi phạm |
| Cùng CLI, cwd `C/deps-probe`, cấu hình chép nguyên từ SHA ghim | `C/deps-probe/` và `deps-probe.log`: **exit 3 dự kiến**, đúng 3 lỗi test-files-only-in-tests; 6 module / 4 cạnh. Cạnh test → test không lỗi. Đây là cây kiểm ranh giới, không là đột biến sản phẩm |
| `git diff 37a80b6 5b1328a -- <mọi path manifest>` và `git diff --numstat ...` | Đọc đủ 7 file code / test đổi, thêm diff CLAUDE của package; phát hiện CXR6-C1 nằm ở đoạn không đổi |
| `C/journal.md` | Nhật ký ghi dần trước khi chuẩn hóa báo cáo này; giữ kết quả trung gian, cả chỉnh số / số dòng / probe được sửa lại trong bản cuối |

**Đột biến:** Codex không làm bảng R nên không thực hiện đột biến gỡ phần sửa R. Không có đột biến sản phẩm sống / bị giết để tuyên bố trong phiên. Cây dependency probe chỉ thêm cạnh giả ngoài repo, có ba cạnh bị rule chặn đúng.

**Lỗi dựng probe, không phải phát hiện sản phẩm:** Node --import lúc đầu dùng đường Windows thay file URL; transpileModule thiếu fileName khiến generic TS bị đọc như JSX; loader chưa xử lý SQL ?raw; một đối chứng dấu lạc đặt sau nguyên âm nên không thuộc dạng lạc; putSetting lúc đầu được truyền JSON đã stringify; đường import desktop của cây nhỏ lúc đầu thừa một ../. Đã sửa ngoài repo, chạy lại tới exit / kết quả nêu trên. Lần browser trước khi Owner nhắn tiếp tục chưa hề chạy: automatic approval review báo chạm usage limit, không kết luận lệnh không an toàn và không có tác dụng phụ từ lệnh bị từ chối.

**Giờ bị ngắt / tiếp tục:** lần build cuối trước chặn ghi log lúc **13:10:52 +07:00**; bước gọi browser ngay sau đó bị duyệt tự động chặn hạn mức. Tool không trả timestamp riêng của lần từ chối, nên chỉ xác định khoảng dừng sau 13:10:52 và trước **13:12:53 +07:00** (giờ làm tiếp đo bằng clock). Không bịa giờ chính xác. Khi bị chặn không ghi được báo cáo ngoài workspace vì chính lệnh đó cũng cần duyệt. Sau yêu cầu “tiếp tục”, đã ghi mốc làm tiếp và chạy được probe bình thường; không còn thao tác bị chặn.

**Kiểm cuối:** `git rev-parse HEAD` đúng SHA ghim; `git status --short` rỗng như đầu phiên. Không mở / đọc / liệt kê / tìm trong các thư mục bị cấm; không đọc báo cáo lượt 6 bên khác; không cài công cụ. Build / cache do CLI tạo bị ignore. Kết quả cổng toàn repo (4.493 unit, 120 Rust, 329 e2e) chỉ dẫn lại từ common/baseline.md, không nhận là phiên này chạy lại.

**Giờ xong: 2026-11-07 13:26:56 +07:00 (Asia/Bangkok).** Đã kiểm lại đủ 65 dòng phạm vi, các mục báo cáo và trạng thái repo trước khi đánh dấu XONG.