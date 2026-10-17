XONG — codex gói C lượt 2, 2026-10-17 07:48:52 +07:00

# Deep review Phase 1–6, lượt 2 — Codex, gói C: AI

## 1. Thông tin phiên

- Bên: Codex, reviewer độc lập; gói C — AI; phiên mới, không phải phiên làm tiếp.
- SHA đầu phiên: `4217ed4cd3300af1d63aa61db9eb13902fe75f16` (detached HEAD).
- `git status --short` đầu phiên:

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

- Bắt đầu: **17/10/2026 07:31:22 +07:00**, Asia/Bangkok. Máy: **DESKTOP-KDURKJP (Home PC)**.
- Công cụ: Codex desktop/API, PowerShell, Node **v24.20.0**, pnpm **12.6.0**, Vitest, TypeScript, rg, Vite và Playwright/Edge đã cài. Model phiên được hệ thống mô tả là **GPT-6**; biến thể model, mức suy luận và số phiên bản ứng dụng Codex không được cung cấp trong giao diện công cụ phiên này; không suy đoán.
- Bước 0: A.md và B.md có dòng đầu XONG; C.md chưa có. Chỉ kiểm đúng tên file và dòng đầu A/B, không đọc nội dung hai gói.
- Chỉ đọc repo; không patch repo, không commit/Issue/PR/merge/gh, không subagent, không gọi AI thật, không mở ChatGPT, không đọc key. Bản chép/probe/log ở `C/` cạnh báo cáo. Mọi trình duyệt chặn request ngoài hostname `127.0.0.1` và thay `window.open` trước navigation ngay từ lần đầu.
- Kết quả: **8/8 dòng R: ĐÃ SỬA theo đường lỗi gốc; 1 phát hiện mới Low, CONFIRMED**. Biến thể gần của Mock còn hở ghi riêng CX2-C1; không coi việc sửa năm ca gốc là bằng chứng Mock hiểu mọi câu.

## 2. Bảng R

| DR6 | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| 15 | #598 → #628 (`e6c9078`) | **ĐÃ SỬA** | `core-probe.mjs`: phiên trước nhập backup cùng ID, dán đúng hoặc sai đều `discarded`, 0 dòng mới; phiên mở sau nhập lưu CURRENT. `web-boundaries.mjs`: mở trong lúc thay / thay xong khi copy còn chờ đều mang generation 0, dữ liệu mới generation 1, dán bị loại. `webChip` vẫn trả v2 khi phiên bản cũ không còn. **M1** bỏ kiểm generation: 1/57 test đỏ, chính ca nhập cùng ID của PR. | Thay thất bại giữ generation và phiên lưu lại được, attempts=1. Đang thay trả `replacing` là ACCEPTED #628, theo S2-2/4; không báo lại. Copy/open sau await vẫn có thể xảy ra cho dữ liệu cũ: KNOWN #628, probe xác nhận không lưu nhầm. |
| 16 | #598 → #628 | **ĐÃ SỬA** | 295 chữ + 10 U+200B đạt; 301 chữ bị V1. `Kh`, `kH`, `Re`, `rE`, `Sư` ở ngoại lệ luật đạt; “Luật Khoa học và Công nghệ” vẫn V6. **M2** quay về đếm cả Cf: 2/80 test đỏ; **M3** quay KH/RE về chữ hoa: 2/109 test đỏ. | 300 ký tự NFC tạo từ `e + Cf + dấu sắc` đạt, biên 299 chữ + emoji đạt / 300 chữ + emoji bị V1. Các đường lọt V3–V6 thuộc DR6-17 đã hoãn, không tính mới. |
| 18 | #598 → #628 | **ĐÃ SỬA** | Seed hiện dùng `PROMPT_VERSIONS[mode]`, analysis/discovery @2. `seed-control`: ca “has a few Mock analyses…” xanh; **M12** đổi ngay chỗ ghi seed về `${mode}@1`: chính test seed đỏ. **M11** đổi hằng analysis về @1: test khớp version prompt đỏ. | Không dùng sự tồn tại của hằng làm bằng chứng duy nhất. `schema.test.ts` giữ hằng ↔ prompt, `seed.test.ts` giữ seed ↔ hằng. Các @1 của fixture lịch sử cũ là hợp lệ, không đổi toàn bộ @1. |
| 19 | #598 → #628 | **ĐÃ SỬA** | Năm ca gốc về em trai/con trai, phủ định, “9 con số” đều 0 đề xuất; “KH đã kết hôn, có 2 con” vẫn hai đề xuất. **M4** bỏ `aboutTheKh`: 6/38 test đỏ; **M15** bỏ riêng loại trừ “con số”: 1/38 test đỏ. | Biến thể ngoài năm ca gốc vẫn hở → **CX2-C1**. Hai âm tính giả với “KH có 2 con, đã kết hôn” / “bạn học cũ” đã có KNOWN, không tạo ID mới. |
| 20 | #603 → #638 (`e8d340a`) | **ĐÃ SỬA** | Edge: Enter trên Hủy và Thử lại giữ focus ở SPAN ghi chú khi request đang giữ và sau Hủy. **Nguyên test PR** `customer-ai.spec.ts:816` xanh ở control; bỏ hai `thenFocus` trên bản chép → đỏ tại `:837`, “Expected: focused / Received: inactive”. Probe riêng xác nhận cả hai về BODY khi bỏ sửa. | Không chỉ kiểm click chuột/trạng thái. Lệnh AI là stub, khóa runner vẫn giữ tới khi request trả. |
| 21 | #599 → #632 (`35ba0d3`) | **ĐÃ SỬA** | Control nguyên test PR `customer-ai.spec.ts:70` xanh. **Đột biến opacity-85 → opacity-50**: chính test đỏ, expected ≥4,5, received **2,493574**. Phép đo bổ sung chuẩn hóa màu qua canvas và trộn alpha/opacity: STALE discovery/cổng chặn 31 node, analysis gồm personalityNotes khi STALE/đang chạy/đang hủy 57 node, chi tiết lịch hẹn 19 node: thấp nhất đều **4,806871:1**. CURRENT analysis thấp nhất 5,614963. | Mockup `.faded` 0,85 + thẻ rỗng viền đứt khớp app. Đã kiểm cả khối AI ở lịch hẹn; không suy chỉ từ việc dùng chung Item. |
| 22 | #598 → #628; #599 → #632 | **ĐÃ SỬA** | `SettingsAi.tsx:309` và `ai.html:465` nay 1 024; `connection.ts:13` maxTokens 1_024; golden ai-eval dòng 13 nói reasoningEffort true; `vi.ts:250` là “200.000”. **M13** đổi chữ về “200 000”: test panel đỏ. | Phần comment/mockup/golden kiểm trực tiếp và diff; không gán test hành vi cho một dòng comment. |
| 61 | #598 → #628 | **ĐÃ SỬA** | **M5/M6/M14** bỏ ngoại lệ kỷ/quy/RE: mỗi cái 1 test đỏ. **M7/M8** cho V4/V6 bỏ qua personalityNotes: mỗi cái 1 test đỏ. **M9** trần TS ký tự +1 và **M10** maxTokens extraction 40.000: mỗi cái đỏ đúng test hợp đồng TS ↔ Rust. Control 817/817 xanh. | Ca dương Luật Khoa học/Kinh doanh vẫn bị chặn; V3 cũng còn áp cho personalityNotes. Đọc nguồn Rust để kiểm hợp đồng, không gọi Rust/network/key thật. |

Quy ước: R đánh giá đường lỗi lượt 1 và test giữ sửa; biến thể gần còn hở ghi riêng như prompt yêu cầu. Không có dòng SỬA MỘT PHẦN / CHƯA SỬA / HỒI QUY của tám DR6 trên.

## 3. Phạm vi đã đọc

Đọc từng file sản phẩm và test/hỗ trợ trong gói theo `classifyFile` của `tools/size-report-core.mjs`: **60 file, 5.250 dòng sản phẩm + 6.110 dòng test/hỗ trợ**. Đã đọc cả phần không có diff, gồm toàn bộ ba file test dài `ai-analysis.test.ts`, `ai-panel-view.test.ts`, `run.test.ts`; không dùng coverage để thay đọc code. Inventory và hash nguồn: `C/scope.json`, `C/final-check.json`.

| File | Đã đọc dòng | Loại |
|---|---:|---|
| apps/desktop/src/data/ai-analysis.test.ts | 1–1004 | test |
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
| packages/ai/src/blocklists.test.ts | 1–157 | test |
| packages/ai/src/blocklists.ts | 1–109 | product |
| packages/ai/src/code-points.test.ts | 1–51 | test |
| packages/ai/src/code-points.ts | 1–45 | product |
| packages/ai/src/errors.test.ts | 1–60 | test |
| packages/ai/src/errors.ts | 1–56 | product |
| packages/ai/src/extract-json.test.ts | 1–119 | test |
| packages/ai/src/extract-json.ts | 1–84 | product |
| packages/ai/src/index.ts | 1–11 | product |
| packages/ai/src/input.test.ts | 1–174 | test |
| packages/ai/src/input.ts | 1–29 | product |
| packages/ai/src/mock-adapter.test.ts | 1–262 | test |
| packages/ai/src/mock-adapter.ts | 1–139 | product |
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
| packages/ai/src/schema.test.ts | 1–367 | test |
| packages/ai/src/schema.ts | 1–370 | product |
| packages/ai/src/settings.test.ts | 1–94 | test |
| packages/ai/src/settings.ts | 1–86 | product |
| packages/ai/src/test-support.ts | 1–69 | test |
| packages/ai/src/text-match.ts | 1–74 | product |
| packages/ai/src/validator-blocklists.test.ts | 1–273 | test |
| packages/ai/src/validator-extraction.test.ts | 1–135 | test |
| packages/ai/src/validator.test.ts | 1–231 | test |
| packages/ai/src/validator.ts | 1–269 | product |
| packages/ai/src/web.test.ts | 1–425 | test |
| packages/ai/src/web.ts | 1–150 | product |

Phần sửa `8855345..4217ed4` đọc kỹ: PR #628 (generation, webChip, V1, LAW_NAME, Mock, version), #632 (FADED/Item/AppointmentAi), #638 (focus extraction), cùng test mới của chúng; chỗ nối seed và hợp đồng trần Rust. `C/reviewed-diff.patch` giữ nguyên diff các file thuộc C; `C/related-diff.patch` giữ seed, contract, e2e, i18n và tài liệu sửa liên quan.

Tài liệu dùng làm chuẩn: CLAUDE.md gốc / packages/ai / apps/desktop; CONTEXT; Phase 5 AI (luồng, settings, input/output, validator, lưu và CURRENT/STALE, trích xuất); G5 §1–8 và §10 (đặc biệt §7, §8.4, §10.4); golden ai-eval; ADR-0009 D-1/G5/W-1; Phase 6 §4.1 S-2 và §5; metrics Phase 6; mockup AI (trạng thái 1–4, quyết định G3, `.faded`), panel customer và khối appointments. Lệch seed @1 khác ví dụ lịch sử @1 trong mockup; không tự sửa spec/golden.

Lượt 1 đã đối chiếu bản tổng hợp §3–5, §7, §9 và phần phát hiện/ca đã xét/đột biến của sáu báo cáo C đã lưu trong repo `docs/reviews/raw/2026-10-15/{claude,codex,muse}/C.md` và `home-pc/{claude,codex,muse}/C.md`; probe cũ chỉ lấy loader, cách đo và quét export của chính Codex ở máy này. Không mở thư mục báo cáo lượt 2 bên khác hay các thư mục ngoài repo bị cấm.

Chỗ nối đọc thêm: `app-data.ts` (toàn bộ S-2/generation/openAppData), `tables.ts`, `AppDataContext.tsx`, `CustomerProfile.tsx` (panel key/lifecycle và dữ liệu), `kyc-view.ts`/`KycDialogs.tsx` ở liên kết bằng chứng/xác nhận, `ai-analyses.ts` (lệnh, schema, lưu JSON, trạng thái), `seed.ts:559`/test seed, `tauri-contract.test.ts`, hằng trần/kiểu Completion của `ai.rs`; tokens/theme, lịch hẹn Detail và Dialog. Kết luận UI từ thao tác UI/app thật, không từ chèn SQL thô.

## 4. Kịch bản mới đã thử

Bảng ghi cả biến thể không thấy lỗi; ca gốc chạy lại được nêu trong R, không coi là phát hiện mới.

| # | Kịch bản (dữ liệu/bước) | Kết quả | ID |
|---|---|---|---|
| N1 | Giữ phiên web → nhập backup cùng ID → dán lần lượt câu đúng và câu không JSON → mở phiên mới và dán đúng | Cả hai câu của phiên cũ discarded trước validator; không thêm dòng. Phiên mới CURRENT. `core-results.json`. | — |
| N2 | Giữ lời gọi clipboard → nhập backup xong → cho clipboard trả; thêm ca mở phiên ngay trong lúc thay dữ liệu | Cả hai giữ generation cũ, dán discarded, 0 dòng mới, 0 lỗi. Copy/open vẫn một lần: giới hạn đã KNOWN #628. `web-boundaries.json`. | KNOWN, không phát hiện mới |
| N3 | Phiên web chụp v2 → thêm annualIncome làm v3 → lưu câu đúng → xuất/nhập lại backup | Dòng STALE sau lưu và sau nhập; đầu vào vẫn v2, không đổi sang dữ kiện mới. `core-results.json`. | — |
| N4 | Giữ backup cho Nạp lại → Kiểm tra và lưu câu đúng → cho backup lỗi → lưu lại chính phiên | Lúc chờ trả replacing; sau lỗi generation 0, lưu ACCEPTED attempts 1. Câu sai đầu tiên trong lúc chờ chỉ cho retry vì chưa ghi gì, không coi là lỗi S2-2. `core-results.json`. | — |
| N5 | V1 ở biên 300: Cf chen giữa chữ và dấu tổ hợp, 300 chữ NFC; 299/300 chữ + emoji; LAW_NAME với Kh/kH/Re/rE/Sư và Luật Khoa học | V1 đếm đúng sau bỏ Cf rồi NFC; đúng 300 đạt, 301 trượt. Ngoại lệ đạt, tên luật thật V6. `core-results.json`. | — |
| N6 | Mock: anh rể / anh ruột / vợ cũ của KH nói về con của họ; thêm ghi chú vợ cũ có 3 con trên UI, KH đang có 2 con | Còn đề xuất sai chủ thể. UI hiện Số con 3; dữ kiện lưu vẫn 2. `core-results.json`, `ui-results.json`. | **CX2-C1** |
| N7 | Mock: “KH hỏi nếu đã kết hôn, có 2 con thì nên chuẩn bị gì.” | Còn trả cả Đã kết hôn và 2 con dù là giả định. `core-results.json`. | **CX2-C1** |
| N8 | Mock: số âm “-2 con theo biểu mẫu bị ghi sai”; câu đính chính “được cho là độc thân nhưng thực ra đã kết hôn” | Số âm mất dấu thành 2; câu đính chính trả cả hai trạng thái. Cùng giới hạn chưa kiểm ngữ cảnh, không tách thêm ID. `core-results.json`. | CX2-C1 (bằng chứng phụ) |
| N9 | Mock: dấu chấm / chấm phẩy tách câu, phủ định ở vế sau; số thập phân nằm trong “con số”; đổi thứ tự thông tin KH | Ca rõ ràng có dấu chấm giữ hai dữ kiện; “con số” vẫn bỏ. Hai âm tính giả đổi thứ tự/bạn học cũ đúng KNOWN, không đếm lại. `core-results.json`. | KNOWN cho âm tính giả |
| N10 | analysis đầy đủ có 10 phần tử kể cả personalityNotes → đổi KYC → STALE → giữ request phân tích lại → Hủy; tạo lịch hẹn qua UI → chọn KH trong Trong ngày | Các khối mờ đều ≥4,80687:1; lịch hẹn 4 thẻ rỗng và 19 node chữ cũng đạt, không pageerror. `contrast-matrix.json`. | — |
| N11 | Bàn phím Enter Hủy / Thử lại của trích xuất với request đang giữ, rồi gỡ thenFocus trên bản chép | Control focus SPAN; gỡ sửa cả hai về BODY; nguyên e2e PR cũng đỏ. `ui-results.json`, `pr-ui-results.json`. | — |
| N12 | personalityNotes lần lượt chứa Prudential / Điều 35 / xác suất cao | V4 / V6 / V3 vẫn chặn; V4 trùng matcher prudential/pru đã KNOWN, không tách lỗi. `core-results.json`. | — |

## 5. Phát hiện mới

### CX2-C1 — Mock còn đề xuất dữ kiện của người khác và câu giả định

- **ID:** CX2-C1
- **Mức:** Low
- **Trục:** E (liên quan C/T)
- **Vị trí:** `packages/ai/src/mock-adapter.ts:99`, `:117`, `:127` (`4217ed4`).
- **Tình trạng:** **CONFIRMED**
- **Liên quan:** DR6-19 — biến thể gần còn hở; đề xuất sai này có từ trước, lượt 1 bỏ sót. PR #628 thêm bộ lọc và đã sửa các ca gốc; không quy nhầm đây là hồi quy mới của PR.
- **Kịch bản:** N6–N8; bằng chứng chính N6–N7.
- **Mô tả:** `aboutTheKh` chỉ loại khi thấy một từ trong danh sách người thân trước cụm, hoặc một trong ba từ phủ định; không xác nhận cụm đang nói về KH và không nhận câu điều kiện. Người thân ngoài danh sách như “anh rể”, “vợ cũ” và cấu trúc “nếu …” vẫn được gán vào trường của KH.
- **Tái hiện / bằng chứng:**

```text
node C:\workspace\deep-review-1-6-r2\codex\C\core-probe.mjs
“Anh rể KH đã kết hôn, có 3 con.”
  → facts: maritalStatus=Đã kết hôn, childrenCount=3; dropped=[]
“Vợ cũ của KH có 2 con riêng với chồng mới.”
  → facts: childrenCount=2; dropped=[]
“KH hỏi nếu đã kết hôn, có 2 con thì nên chuẩn bị gì.”
  → facts: maritalStatus=Đã kết hôn, childrenCount=2; dropped=[]

node C:\workspace\deep-review-1-6-r2\codex\C\ui-probe.mjs
Ghi “Vợ cũ của KH có 3 con riêng với chồng mới.” bằng hộp Ghi chú KYC,
chọn Mock, bấm AI trích xuất:
  → “AI đề xuất: Số con: 3 ("3 con")” + Xác nhận / Bỏ.
  → thẻ Dữ kiện KYC vẫn “Số con: 2”; không tự ghi dữ kiện.
  → pageerrors=[], request ngoài=[]
```

Nguồn đầy đủ, không chỉ bản chép regex: `C/core-probe.mjs` gọi `runExtraction` thật qua Mock + V1/V7; `C/ui-probe.mjs` dựng dữ liệu và ghi chú bằng UI của app trên bản chép nguồn. JSON kết quả giữ nguyên quote/value; `C/control.png` ghi trạng thái phiên probe.

- **Ảnh hưởng:** RE dùng Mock để thử/demo có thể thấy một đề xuất sai về số con/tình trạng hôn nhân rồi xác nhận nhầm. Chưa có bằng chứng tự lưu/sai chỉ số, và RE còn phải xác nhận hoặc sửa; giữ **Low** như DR6-19, không nâng thành dữ liệu sai lặng lẽ.
- **Đề xuất:** thu hẹp mẫu Mock về mệnh đề khẳng định rõ về KH; câu nói về người khác, giả định hoặc số có dấu không chắc nghĩa thì bỏ đề xuất. Thêm ca âm N6/N7 và ca dương KH thật/câu tách bằng dấu chấm vào `mock-adapter.test.ts`, giữ luồng xác nhận. Ước lượng ≤80 dòng sản phẩm + ≤100 dòng test, dưới 400 dòng SP; không cần đổi prompt G5/golden để khớp code. Hai âm tính giả đã KNOWN không gộp thành phát hiện mới.

## 6. Bloat

| Đã chạy / đọc / đo | Phạm vi / dữ liệu | Số / kết quả | ID |
|---|---|---|---|
| `tsc --noEmit --noUnusedLocals --noUnusedParameters`, lần lượt `-p packages/ai`, `-p apps/desktop` | Nguồn SHA ghim, không sửa cấu hình | exit 0 cả hai, 0 diagnostic | — |
| `pnpm codemap:check` | Bản đồ export/route | “Export maps are up to date”, không chạy lệnh sinh sửa file | — |
| `pnpm lint:deps` | Toàn repo để xét ranh giới C | 315 module, 1.277 dependency; 0 vi phạm | — |
| `node C/exports.mjs`: AST export/import + `rg -l` từng tên trong repo | 36 file SP C (trừ d.ts/barrel không khai báo giá trị) | **213** khai báo export, **42** không có named import SP ngoài; đã phân biệt type, dùng nội bộ và API/test | — |
| Đọc các cụm lặp và dependency | C; ai chỉ domain + zod | 2 dependency đều dùng; không tìm được code SP chết mới có chi phí chứng minh được | — |
| Bundle tham chiếu `common/baseline.md`, không dựng lại | Build 4217ed4 chuẩn bị, không biến môi trường riêng | index.js **909.669 / 267.044 B** thô/gzip; tổng JS/CSS **2.382.036 / 702.109 B** | — |
| So bundle với lượt 1 | Cùng code nền b139d8a của lượt 1 | index +17.727 / +5.034 B; tổng +17.753 / +5.038 B; không gán toàn bộ tăng của các gói cho riêng AI | — |

Không có phát hiện B mới. Hằng/raw output lặp, helpers qua barrel, mã lỗi HTTP khai nhiều nơi, newSessionId, markup job và zod đầy đủ là KNOWN/DR6-25/66/67 đã hoãn; không đếm lại. 42 tên không có named import ngoài **không** có nghĩa 42 đoạn code chết (vd. kiểu công khai, hằng được dùng ngay trong file). So lượt 1 cùng phép quét của Codex: 210 → 213 khai báo; thêm AppWebSession và các thay đổi kiểu của phiên web là dùng thật. Không cài công cụ hay đề xuất refactor chỉ để giảm số dòng.

## 7. Hiệu năng

**Máy DESKTOP-KDURKJP**, Node v24.20.0. `core-probe.mjs` dùng **backup tải lượt 2** qua `importBackup`; `tables` SHA-256 kiểm lại là **1c306cfb8203409337a5fa33c48306694581cb70355eb5526e4cf4f543589591**, đúng kế hoạch. Tổng 1.496 KH, 10.414 lịch, 103 phân tích; phần AI sống: **95 KH / 102 phân tích**. Một warmup rồi 9 mẫu mỗi phép. Lúc đo phiên này không chạy build/test/browser; không có thông tin chắc chắn về tiến trình/phiên khác. Không so Office Laptop.

| Đã chạy / đo | Dữ liệu | Lượt 2 trung vị (min–max), ms | Lượt 1 Home PC, ms | So theo luật nhiễu / ngưỡng | ID |
|---|---|---:|---:|---|---|
| Đọc lại profile/versions/analyses + panel/history/content/appointment model cho mọi KH có AI | Backup tải, 95 KH / 102 dòng | **29,3839** (28,0207–30,8992) | 28,9274 | +0,4565 ms / +1,58%; không xấu hơn | — |
| History/content/appointment model của KH nhiều phân tích nhất (dữ liệu đã đọc) | Cùng backup; cùng vòng của probe lượt 1 | **0,0818** (0,0642–0,1839) | 0,0539 | +0,0279 ms; chưa quá 10 ms, không xấu hơn | — |
| Build input + tin nhắn web + validator Mock cho 95 hồ sơ | Cùng backup | **28,6515** (27,7043–29,4178) | 28,1157 | +0,5358 ms / +1,91%; không xấu hơn | — |
| **Tham chiếu exe**, mở hồ sơ có AI | `common/baseline.md` / perf-ref, 5 mẫu | **18** (18–21) | 20 | <200 ms, không xấu hơn | — |
| **Tham chiếu exe**, lịch sử AI | Cùng nguồn | **2** (2–18) | 12 | <200 ms, không xấu hơn | — |

Ba dòng Node dùng cùng vòng lặp của probe Codex Home PC lượt 1; mốc 28,9274 / 0,0539 / 28,1157 lấy từ báo cáo gốc Home PC đã lưu trong repo. Tổng hợp lượt 1 §7.1 còn có mốc phần AI một KH 0,42 ms của phép đo khác; không ép so hai phép khác nhau. Không có nền T-219 Home PC, nên không dùng số laptop làm nền.

Không có phát hiện P: các phép đã đo không xấu hơn theo luật **quá 20% và quá 10 ms**, phần UI tham chiếu vẫn dưới ngưỡng <200 ms. Node không bao gồm React/render/IPC; **phiên này không đo lại exe**, không lấy độ trễ Vite dev làm hiệu năng sản phẩm. Số exe ở bảng là tham chiếu chuẩn bị có ghi nguồn. DR6-13/44 thuộc gói khác; không nhận là đã đo hai mục đó ở C.

## 8. Đếm mức × trục và “đã xét, không thấy”

Mỗi phát hiện đếm một lần ở trục chính. Tám dòng R là kiểm lại sửa, không cộng như tám phát hiện mới.

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tổng | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **1** |

**1 CONFIRMED, 0 PLAUSIBLE**; tỷ lệ PLAUSIBLE 0%. KNOWN ở phần đối chiếu không đếm lại thành phát hiện mới.

| Trục | Đã xét / bằng chứng ngoài phát hiện ở §5 |
|---|---|
| R | 8/8 DR6 có tái hiện, biến thể và đột biến; comment/docs có đối chiếu trực tiếp. Bảng R nêu đúng giới hạn ACCEPTED của phiên web, không đổi quyết định Owner. |
| E | Đọc các bộ xử lý JSON, code point, schema, runner, lifecycle và Mock; chạy N1–N12, biên 300/301, emoji/Cf+NFD, thế hệ dữ liệu, retry/hủy. Ngoài CX2-C1 không thấy lỗi mới. |
| C | Spec Phase 5/G5 ↔ toàn code C; test đọc G5 nguyên văn, schema, blocklists, prompt version; mockup faded và các nhãn đối chiếu. Không thấy lệch mới ngoài biến thể Mock; các @1 lịch sử có chủ ý và lệch mockup KNOWN không báo lại. |
| D | AI chỉ thêm ai_analyses qua app.run; export/import giữ STALE; generation cũ không lưu vào dữ liệu mới; thay lỗi giữ phiên; trích xuất UI không đổi Số con 2 khi đề xuất sai 3. Test ai-analysis/seed xanh. Không thấy mất/sai dữ liệu tự lưu mới. |
| G | V1–V7, V2 evidence/missingCategory, V3–V6 trên mọi text và personalityNotes, quote/normalize của V7, giới hạn thử lại/raw output/chars/tokens; unit 803 ca C và contract 14 ca. M2/M3/M5–M10/M14 bị giết. DR6-17/23/24 đã hoãn, không đề xuất đổi G5 để chiều theo code. Không thấy lỗ mới ngoài phạm vi ngữ nghĩa Mock (V7 chỉ kiểm kiểu/quote, không chứng minh chủ thể). |
| S | Đọc ai-tauri/error/settings/form, interface IPC, input tối thiểu, URL hằng, clipboard chỉ ghi, output text React, key không vào ai.save. Test hợp đồng và settings xanh, mạng browser chặn từ đầu. Không đọc key/calling service; không thấy lỗi ranh giới mới trong C. Rust redaction sâu thuộc B. |
| P | Đo đúng backup tải và đối chiếu cùng Home PC; số/giới hạn §7. Không thấy P mới; không suy hiệu năng exe từ Vite/Node. |
| B | noUnused hai project, codemap, dependency-cruiser, 213 export + rg; số bundle tham chiếu và phân biệt type/nội bộ/KNOWN. Không thấy B mới có chi phí đo được. |
| T | Đọc 24 file test/hỗ trợ C, chạy 23 file C + contract thành 24 file/817 test xanh; seed riêng 1 ca xanh, 12 ca khác skip có chủ ý. **15 đột biến unit/seed + 2 UI đều bị giết**, không đột biến sống trong tập đã chạy. Nguyên hai e2e PR control xanh, mutants đỏ đúng assertion. Khoảng hở test cho chủ thể/giả định gắn cùng CX2-C1, không tách ID T. |
| A | Đọc JSX/t()/aria-live/status/alert/nhãn/bằng chứng và focus-return; bàn phím Enter trên extraction, trạng thái mờ đủ analysis/reference/appointment được đo. Không thấy A mới. Chưa kiểm bằng trình đọc màn hình thật hoặc trên exe; số tương phản là Edge cùng engine trên nguồn bản chép. |

KNOWN đã đối chiếu: hai âm tính giả của Mock sau #628; startChatGptWeb copy/open xong sau generation đổi; replacing giữ phiên; lỗi kết thúc ngoài màn; job cùng khóa; Settings cảnh báo hỏng khó xóa/kết quả kết nối cũ/dòng ChatGPT web thiếu in đậm; helper qua barrel/raw-output/ID/lỗi HTTP lặp; zod đầy đủ; ký tự vô hình DR6-17 và chặn nhầm bản bỏ dấu DR6-23; dấu `:` i18n. Không tạo Issue hay sửa bất kỳ mục nào.

## 9. Phụ lục bằng chứng, đột biến và trạng thái cuối

Mọi đường dưới nằm trong `C:\workspace\deep-review-1-6-r2\codex\C\`. Có thể chạy lại Node từ repo SHA ghim; script tự dùng đúng thư viện đã cài, không cài thêm.

| Nguồn / log | Nội dung / kết quả |
|---|---|
| `register.mjs` | Loader TS/alias/?raw chép từ probe lượt 1 của chính Codex rồi dùng trên SHA hiện tại. |
| `mutations.mjs`, `review.config.mjs`, `snapshot/`, `mutations.json`, `unit-control.log` | Bản chép source + alias về bản chép; control **24 file, 817/817 xanh**, 4,89 s. M1–M11 chỉ đổi bản chép và trả lại từng file trong finally. |
| `seed-mutation.mjs`, `seed-control.log`, `M12-seed-version.log`, `seed-results.json` | Nguyên test seed chọn bằng tên: control 1 xanh/12 skip, seed @1 làm chính ca đó đỏ. |
| `extra-mutations.mjs`, `extra-mutations.json`, `M13…M15.log` | Chữ 200.000 / ngoại lệ RE / con số; mỗi cái 1 test đỏ. |
| `core-probe.mjs`, `core-results.json`, `core.log` | Luồng qua openAppData, dữ liệu tải qua importBackup; Mock thật + V1/V7, guardrail/Unicode và 9 mẫu hiệu năng. Ghi từng ca ngay khi có kết quả. |
| `web-boundaries.mjs/json` | Hai mốc start web trong lúc thay / copy chờ; đều discard, 0 dòng mới; giới hạn copy/open đã KNOWN. |
| `ui-probe.mjs`, `ui-results.json`, `control.png`, `no-focus.png` | Thao tác UI app trên bản chép source, Edge 1440×1000; C1 hiện trên app, focus control/SPAN so mutant/BODY; 0 pageerror / 0 request ngoài. Không dùng đây làm số đo hiệu năng build. |
| `contrast-matrix.mjs/json`, `appointment-stale.png` | Tương phản canvas/compositing: CURRENT/STale/running/cancelling/appointment. Dựng dữ liệu, tạo/chọn lịch hẹn bằng UI, không SQL. |
| `pr-ui-mutations.mjs`, `pr-ui.spec.mjs`, `pr-ui.config.mjs`, `pr-ui-results.json`, `pr-ui-{control,no-focus,opacity-50}.log` | **Nguyên hai test PR #638/#632** chép từ e2e/customer-ai.spec.ts + support. Wrapper chỉ thêm beforeEach chặn mạng/window.open. Control **2 passed (11,2 s)**; no-focus **1 failed** tại :837; opacity-50 **1 failed**, 2,493574 < 4,5. Vite dev chốt fixture **VITE_DEMO_ANCHOR=15/09/2026** qua define; không build web, không thay bundle chuẩn. |
| `exports.mjs/json/log`, `scope.json/md`, `inventory.json` | 60 file, 5.250/6.110 dòng, 213 export và 42 tên không có named import SP ngoài; kết quả từng tên có tham chiếu. |
| `checks.log`, `final-check.mjs/json` | Ghi kết quả tsc/codemap/deps, SHA/status, hash tables tải và 60 hash nguồn. |
| `reviewed-diff.patch`, `related-diff.patch` | Diff sửa đã đọc của C và chỗ nối. |
| `session-journal.md` | Nguyên các cập nhật dần trước khi sắp lại thành báo cáo này; giữ bằng chứng ban đầu. |

### Đột biến đã chạy

| ID | Gỡ / làm sai trên bản chép | Kết quả test |
|---|---|---|
| M1 | Bỏ kiểm generation khi lưu web | 1 đỏ / 57, ca nhập cùng ID |
| M2 | V1 đếm Cf như chữ | 2 đỏ / 80 |
| M3 | Miễn KH/RE chỉ viết hoa | 2 đỏ / 109 |
| M4 | Bỏ bộ lọc aboutTheKh | 6 đỏ / 38 |
| M5 | Bỏ ngoại lệ kỷ | 1 đỏ / 109 |
| M6 | Bỏ ngoại lệ quy | 1 đỏ / 109 |
| M7 | Miễn cả V4 cho personalityNotes | 1 đỏ / 109 |
| M8 | Miễn cả V6 cho personalityNotes | 1 đỏ / 109 |
| M9 | Trần TS ký tự 200.001 | 1 đỏ / 14, contract |
| M10 | Tokens extraction 40.000 | 1 đỏ / 14, contract |
| M11 | Hằng PROMPT_VERSIONS analysis@1 | 1 đỏ / 80 |
| M12 | Chính seed ghi `${mode}@1` | 1 đỏ / 1 ca chọn |
| M13 | Chữ 200 000 thay 200.000 | 1 đỏ / 62 |
| M14 | Bỏ ngoại lệ RE | 1 đỏ / 109 |
| M15 | Bỏ loại trừ con số | 1 đỏ / 38 |
| UI-F | Bỏ thenFocus của Hủy/Thử lại | E2E gốc đỏ; probe riêng BODY cả hai |
| UI-AA | opacity 50% thay 85% | E2E gốc đỏ, 2,493574 <4,5 |

**17/17 bị giết; 0 sống** trong tập này. Mỗi biến thể dùng cùng test gốc, có control xanh; không coi lỗi cấu hình harness là bị giết. Source bản chép trả về sau từng đột biến. Repo không bị patch ở bất kỳ thời điểm nào.

Lỗi harness đã sửa, không phải lỗi sản phẩm: snapshot ban đầu thiếu bốn file release config làm 4 test contract đỏ (đã bổ sung, control sau xanh 817); M10 lần đầu nhầm 24.000 thay vì 12.000 nên chưa áp được (chạy lại đúng rồi đỏ); Vite cần alias riêng theme.css; selector độ mờ phải lấy div; nhãn Ngày không phải Ngày hẹn; lịch mới chưa nằm trong 100 dòng bảng nên chọn bằng nút KH trong Trong ngày; fixture web-boundaries ban đầu thiếu ngày tạo KH. Có các lệnh rg glob kiểu PowerShell không khớp tên file, đã dùng thư mục/tên đúng; không tìm kiếm ngoài vùng cho phép. Tất cả probe browser kể cả lần lỗi đều có chặn mạng và window.open từ đầu.

Không chạy toàn bộ pnpm verify/e2e/build: baseline chuẩn bị đã có 2.898 test và 227 e2e xanh. Phiên này chỉ chạy bộ liên quan và kiểm sâu bằng mutation. Không dùng PW_REUSE, không dùng cổng 4173/9222; server probe dùng cổng loopback ngẫu nhiên và đã đóng; không khởi chạy exe.

`git status --short` cuối phiên (giống đầu phiên):

```text
?? .agents/
?? .codex/
?? AGENTS.md
```

`git diff --stat`: rỗng. HEAD cuối: `4217ed4cd3300af1d63aa61db9eb13902fe75f16`. 60 hash nguồn khớp bản đã khóa trước khi chạy e2e đột biến. Không sửa file tracked, không động các file untracked có sẵn.

Giờ hoàn tất: **2026-10-17 07:48:52 +07:00**. Dừng sau gói C; gói kế tiếp D mở phiên mới.
