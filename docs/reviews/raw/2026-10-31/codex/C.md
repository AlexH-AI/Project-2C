XONG — codex gói C lượt 4, 2026-10-29 08:07:47 +07:00

# Review độc lập lượt 4 — Gói C: AI

## 1. Thông tin phiên

- Bên: Codex; gói **C — AI**; phiên mới. A.md và B.md đã có dòng đầu XONG; C.md chưa tồn tại khi kiểm Bước 0.
- SHA đầu phiên: `2e51e25eb0125f56d3d938b97ef18d6873dae076`, đúng SHA ghim. `git status --short` đầu phiên: **rỗng**.
- Bắt đầu: **2026-10-29 07:29:38 +07:00**, Asia/Bangkok.
- Công cụ: Codex desktop, PowerShell, Node **v24.20.0**, Vitest **5.0.1**, Playwright / Microsoft Edge sẵn có. `codex --version` trả **codex-cli 0.162.1**, exit 0; có cảnh báo không tạo được PATH alias trong sandbox.
- Model / mức suy luận: system mô tả phiên là **GPT-6**; không có công cụ nào của phiên trả model ID hoặc mức suy luận thực tế. Không nhận tên GPT Sol 6.1 dự kiến trong prompt là kết quả xác minh bằng công cụ.
- Máy: **DESKTOP-KDURKJP (Home PC)**. Không gọi dịch vụ AI, không đọc key, không mở chatgpt.com. Không chạy gh, không sửa / commit code trong repo.
- Kết quả gói: **R1 11/11 ĐÃ SỬA; R2 8/8 ĐÃ SỬA trong phần AI của gói; 1 phát hiện mới Low, CONFIRMED**. Không kết luận phát hành thay gói F.

## 2. Kiểm phần đã sửa

“ĐÃ SỬA” xét đường lỗi gốc và mục tiêu được giao cho C. Biến thể mới CXR4-C1 tách ở mục 5. Với Issue xuyên gói, dòng dưới nêu rõ phần C kiểm; không thay kiểm tra dữ liệu / Rust / màn của gói khác. Tên M… trỏ tới bảng đột biến ở mục 9; tất cả đột biến nằm trên bản chép riêng.

### 2.1 Bảng R1

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-108 | #721 → #738 | **ĐÃ SỬA** | Qua openAppData → analyseCustomer → recordAiAnalysis: raw nửa surrogate + NUL + đuôi + emoji đọc lại đúng `�đuôi�sau😀`, xuất / đọc backup lại được. M108 gỡ sửa surrogate → **1/23 test đỏ**. | Đuôi không mất; cặp emoji không bị cắt đôi. |
| DR6-111 | #721 → #738; #728 → #762/#766 | **ĐÃ SỬA** | R111 quét **58** C0/C1 không phải White_Space/NUL chen trong cụm: đều bị V3 chặn. M111domain bỏ luật Cc → **3/24 test đỏ**. | M111 chạy riêng validator-blocklists xanh; cùng đột biến bị bộ text dùng chung bắt. Không ghi thành lỗ test. |
| DR6-118 | #724 → #746 | **ĐÃ SỬA** | Đúng test của PR `e2e/customer-ai-web.spec.ts:408` xanh; gỡ `wrap-anywhere` ở Item (M118) → đỏ **“panel scrolls sideways”, Expected false / Received true**. | Probe tải: 1100×700, 1280×720, 1440×900 đều **0 px** tràn trang / panel với text liền 290 chữ; test gốc còn kiểm email, F1/…/F20 và chi tiết lịch hẹn. |
| DR6-121 | #727 → #753; #778 → #809; #777 → #812 | **ĐÃ SỬA** | **415 test Mock** nền xanh, gồm sáu dạng gốc và các ca T-289/T-288. Trả thuật toán về 119e2e4 (M121) → **142/415 đỏ**. | **5.672 ghi chú tải: 0 khác đề xuất** so thuật toán lượt 3. Phủ định bằng “là sai” ở vế sau là biến thể mới → CXR4-C1. |
| DR6-122 | #728 → #762/#766 | **ĐÃ SỬA** | R122 **15 biến thể** dấu lạc: V3/V6 chặn đúng; M122 giữ dấu lạc thay vì đọc thành cách → **16/227 đỏ**. | Dấu đứng trên nguyên âm không tự coi là dấu lạc; giới hạn đó theo G5 §12.8. |
| DR6-123 | #728 → #762/#766 | **ĐÃ SỬA** | R123 **16 ca** tin đầu / tin thử lại với tám dạng xuống dòng đều OWN_MESSAGE. Edge: VT/FF/NEL/LS/PS dán lại năm lần, **0 dòng phân tích**. M123 quay về CR/LF → **13/58 đỏ**. | Kiểm cả dấu `＞` toàn khổ trước dòng mốc; lần thử không bị tiêu hao. |
| DR6-124 | #728 → #762/#766 | **ĐÃ SỬA** | Sáu câu thường qua, sáu câu cần chặn bị chặn; bỏ danh sách đóng M124a → **8/227 đỏ**, gỡ miễn “giới” M124b → **2/227 đỏ**. | `quy/qui định Luật` vẫn V6; “định luật Pareto”, “giới luật Phật giáo” qua. |
| DR6-133 | #729 → #755; #728 → #766 | **ĐÃ SỬA** | `docs/user-guide/06-ai.md:49` lấy ví dụ **discovery@4**, khớp PROMPT_VERSIONS và chip mới của app. | Mục sửa tài liệu: kiểm chữ có và khớp app; không đột biến hành vi. |
| DR6-25 | #781 → #830; #831 → #837 | **ĐÃ SỬA** | **4.500 ca vi sai** mini ↔ schema ngay trước #830: cùng success, data, mã/path/detail V1. Gỡ import mini (M25) → ESLint đỏ. Bundle chuẩn giảm **43.234 B index.js** so lượt 3. | Số giảm riêng khi merge #830 là 62.735 B min theo fixes/baseline; không lấy bundle probe có instrumentation làm số chuẩn. |
| DR6-66 | #777 → #812; #790 → #845 | **ĐÃ SỬA** | Không còn export AI_LOCAL_ERROR_CODES; ConfirmProposal là type nội bộ. Trả export đầu về (M66), baseline codemap xanh → **codemap:check đỏ** ở packages/ai/CLAUDE.md. | API barrel không lộ attempts/analysis-steps; xét danh sách của DR6-66/Issue, không coi mọi helper có test là code chết. |
| DR6-67 | #777 → #812 | **ĐÃ SỬA** | AiErrorDetails/AiErrorResult/errorDetails dùng chung ở runner, cầu Tauri và màn lỗi. M288 làm helper mất serverMessage → **2/9 đỏ**; typecheck/deps xanh. | Luật thử lại / kiểm / dựng row dùng chung ở attempts và analysis-steps, không chép OpenCode ↔ web. |

### 2.2 Bảng R2

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-288 | #777 → #812 | **ĐÃ SỬA** | Một nguồn MAX_AI_RAW_OUTPUT/AI_ANALYSIS_NO_MODEL; retry chỉ giữ chữ G5, module nội bộ không qua barrel, AnalysisSubject/errorDetails dùng chung. M288 đỏ **2/9**, M66 đỏ codemap. | Prompt/version test xanh; corpus Mock tải không đổi. |
| T-289 | #778 → #809 | **ĐÃ SỬA** | Các ca PEOPLE, KH_SUBJECT, OWN_PARTNER, câu hỏi/phỏng đoán, AFTER_CHO/NOT_OF_ANYONE có trong 415 test xanh; M121 gỡ thuật toán về trước đợt sửa → **142 đỏ**. | Biến thể mới không thuộc tám nhóm ví dụ gốc: CXR4-C1. |
| T-290 | #779 → #820/#822 | **ĐÃ SỬA** | Sáu ca detail có İ/emoji/dash trích đúng chữ; M290merge bỏ gộp vị trí → **8/227 đỏ**. JSON đủ sau `{` lời văn lấy được; JSON cụt thật vẫn không lấy; M290cut → **5/35 đỏ**. | DR5-09 kiểm giới hạn đọc thay timing. Lần gọi assistant rỗng: chỉ đọc bằng chứng Owner trong fixes.md (Credit/deepseek nhận; hai model khác chưa kiểm); phiên này không gọi lại. |
| T-291 | #780 → #824/#828 | **ĐÃ SỬA** | Phần C: output lưu đúng dạng, REJECTED lớn, VT/FF, `{}` trong lời văn, test đếm matcher. Biên **19.999/20.000/20.001** code point đúng; UI báo output quá lớn, output null. M291 **1/56 đỏ**; canonical **5/182 đỏ**; bỏ sunlife **1/524 đỏ**. | Luật hash/ngày/tên và chữ tùy chọn ngoài AI thuộc gói tương ứng. ACCEPTED/REJECTED round trip và chuỗi K10 qua AppData đều đúng. |
| T-292 | #781 → #830 | **ĐÃ SỬA** | 4.500 ca mini/full không khác kết quả và detail V1; M25 đưa full zod lại → lint đỏ. Schema/validator/backup test cuối xanh. | Không đổi package dependency. Các mảng mặc định được kiểm thêm qua T-304. |
| T-295 | #784 → #825 | **ĐÃ SỬA** | Phần C: nhập lại cùng backup trong lúc copy / open chờ → **discarded**, opens **0/1** tương ứng. M295 gỡ kiểm sau copy → **1/60 đỏ**. | Copy đã bắt đầu thì không thu lại clipboard; không mở tiếp sau khi generation đổi ở copy. Kiểm file trước migrate/số liệu 10c ngoài C. |
| T-297 | #786 → #835 | **ĐÃ SỬA** | M297 bỏ giữ lỗi → **1/12 đỏ**. Edge: timeout khi ở màn khác, quay lại thấy lỗi + Thử lại một lần; rời/quay lại nữa không còn. E2e gốc giữ lỗi, trích xuất/3f, chọn lại cấu hình hỏng, đổi model đều xanh. | start trùng khóa/Hủy giữ khóa có test; các bộ lọc dòng thời gian thuộc phần D. |
| T-304 | #831 → #837 | **ĐÃ SỬA** | M304 đặt check ngoài _default → **2/93 đỏ**; parse độc lập không dùng chung mảng. M25 import full bị ESLint chặn. | Lỗ Zod/ZOD và import động thuộc ACCEPTED / phạm vi đã chốt; không báo lại. |

## 3. Phạm vi đã đọc

- Theo classifyFile ở SHA ghim: **63 file; 6.027 dòng SP, 7.539 dòng test/hỗ trợ**. Bảng đường dẫn + phạm vi dòng đầy đủ ở mục 9.4 và `C/scope.md`; code sản phẩm của gói được đọc, test đối chiếu theo hợp đồng, ca và diff sửa. Các suite tương ứng được chạy lại, không suy kết quả test từ coverage.
- Diff `119e2e4..2e51e25`: phần C theo baseline **28 file SP +1.290/−620**, **16 file test +1.232/−157**. Đọc kỹ đường mới text-match/blocklists, Mock, schema mini/default, attempts/analysis-steps, extract-json, ai-jobs/use-ai-job, generation, SettingsAi và layout panel/history/appointment.
- Nối gói: `packages/domain/src/text.ts`, KYC/gate/evidence; `packages/db/src/ai-analyses.ts`, schema, backup/backup-validation, database, KYC; app-data/AppDataContext/tables, CustomerKyc/KycDialogs/kyc-view, vi.ts, routes/classes; test e2e AI/web/Settings, support/fixtures, cấu hình build/test và công cụ codemap/size/deps.
- Quy tắc và hợp đồng: CLAUDE.md gốc, packages/ai/CLAUDE.md, apps/desktop/CLAUDE.md, CONTEXT.md; Phase 5 AI §3/3.1/4/5/6/7/8/9/12, G5 §1–8 và §11–13, golden ai-eval, ADR-0009/D-1/W-1, Phase 6 §4 S-2/TR-11 và ngưỡng; mockup AI/customer/appointments liên quan và hướng dẫn 06-ai.
- Thông tin lượt 4: common/prompt-codex.md, known.md, fixes.md (mục tiêu/acceptance và ghi chú các Issue ở bảng R; các phần nối #721/#724/#727/#728/#729/#790), baseline.md; plan §4, §L4.3–L4.8.
- Đối chiếu lịch sử: ba tổng hợp lượt 1–3 và báo cáo gốc C cùng các mục liên quan trong `docs/reviews/raw/2026-10-15/`, `2026-10-17/`, `2026-10-21/`; không mở báo cáo lượt 4 của bên khác. Probe so hiệu năng tái dùng đúng nguồn Codex lượt 3 trong thư mục được phép.

## 4. Kịch bản mới đã thử

R1/R2 cũng có các ca tái hiện riêng ở bảng trên. Bảng dưới ghi thêm tổ hợp/biên đã chạy, kể cả không thấy lỗi; K6 là phát hiện mới. Nguồn đầy đủ ở phụ lục.

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| K1 | Đặt İ, emoji, nhiều cách, `-`/`__` trước tên hãng/cụm pháp lý; một text có hai hãng rời nhau | Sáu ca detail đúng chữ/vị trí; PRUDENTIAL một issue, hai hãng rời hai issue. | — |
| K2 | JSON REJECTED chứa emoji; độ dài sau JSON.stringify đúng 19.999, 20.000, 20.001 code point | Hai biên đầu giữ output, biên cuối null; raw luôn ≤20.000, không cắt emoji. | — |
| K3 | Tám ghi chú ghép câu/vế: chủ thể khác rồi KH, phủ nhận trước `;`, xuống dòng mở “Hay”, “bảo hiểm: chưa”, chưa chắc, số con cũ, người khác sau KH | Các ca chủ thể/câu hỏi cho đề xuất phù hợp với luật. Ca “trước đây…hiện…” có hai giá trị rõ: G5 §4 quy tắc 5 cho phép, không coi là lỗi chỉ vì có hai đề xuất. | — |
| K4 | Copy hoặc mở trình duyệt giả đang chờ → nhập lại đúng backup có cùng ID → nhả promise | Cả hai discarded; đổi generation thắng ID trùng; sau copy không mở tiếp (0), open đã gọi trước thay thì 1. | — |
| K5 | Toàn bộ AI của file tải mới qua importBackup, schema và read model; KH đã xóa được phân biệt với KH đang dùng | 103 dòng nhập hợp lệ; 96 KH có AI, 95 KH sống/102 dòng đọc qua listAiAnalyses. Một KH đã xóa bị từ chối mở đúng luật. | — |
| K6 | “Thông tin KH độc thân là sai.” / “Khẳng định KH có 2 con là sai.” → Mock → V1/V7; ca thứ nhất chạy tiếp qua màn trích xuất | Vẫn đề xuất Độc thân / Số con 2. UI xác nhận ca đầu; không tự lưu dữ kiện, không ghi ai_analyses. Thuật toán 119e2e4 cho cùng kết quả. | **CXR4-C1** |
| K7 | Chạy lại 1.085 text eval đã lưu đúng block, 2.396 literal vi.ts trước/sau G5 @4; Mock trên 5.672 ghi chú tải | Eval: 0 V3–V6; vi.ts: 0 thay đổi mã chặn (4 nhãn/ký hiệu bị chặn như cũ, không phải output AI); Mock: 0 khác. | — |
| K8 | Web đầu/thử lại với tám dấu dòng, thêm tiền tố trích dẫn toàn khổ; qua UI dán VT/FF/NEL/LS/PS liên tiếp rồi trả lời đúng | 16/16 OWN_MESSAGE, UI năm lần không tiêu lần thử/không lưu row; sau đó lưu CURRENT bình thường. | — |
| K9 | Text liền 290 chữ trên dữ liệu tải ở 1100×700/1280×720/1440×900; email và dãy F dài ở panel và lịch hẹn qua test gốc | 0 px tràn trang/panel ở ba cỡ; test gốc xanh. M118 gỡ wrap bị đúng test gốc bắt. | — |
| K10 | Web ACCEPTED → AI REJECTED quá lớn → xác nhận lại cùng giá trị nghề → xuất/nhập cùng dữ liệu → khối AI lịch hẹn | Lịch sử REJECTED/CURRENT; **F4 ánh xạ F5**, vẫn 2 phiên bản, report quá lớn đúng; lịch hẹn dùng CURRENT, giữ discovery@4+web@1, 0 lỗi. | — |
| K11 | Lỗi AI khi đang ở Tổng quan → quay lại hồ sơ → rời/quay lại lần nữa; sau đó phản hồi quá lớn | Lỗi timeout hiện một lần; lần sau không còn. REJECTED mới có output null/raw 20.000 và hộp report đúng chữ. | — |

Mọi kết luận màn dùng AppData/app.run/tables hoặc Edge trên build web. Không chèn SQL thô để tạo kết luận về màn. Hai probe browser từ trước lần navigate đầu đã chặn mọi host ngoài 127.0.0.1 và thay window.open; kết quả **0 request ngoài, 0 pageerror**.

## 5. Phát hiện mới

### CXR4-C1 — Mock lấy dữ kiện từ một thông tin mà ghi chú nói rõ là sai

ID: **CXR4-C1**  
Mức: **Low**  
Trục: **C** (phụ E)  
Vị trí: **packages/ai/src/mock-adapter.ts:305**, **packages/ai/src/mock-adapter.ts:483** (2e51e25); mẫu hôn nhân ở :269  
Tình trạng: **CONFIRMED**  
Liên quan: biến thể gần **DR6-121 / T-289**; **có từ trước, lượt 1–3 bỏ sót**, không mới do đợt sửa sau lượt 3  
Kịch bản: **K6**

Mô tả: Mock vẫn đề xuất Độc thân từ “Thông tin KH độc thân là sai.” và Số con 2 từ “Khẳng định KH có 2 con là sai.”. `NEGATED` và phép so `inClause.negated <= at` chỉ xét phủ định đứng trước cụm; các luật hỏi/trả lời phía sau không nhận cách bác bỏ “là sai”, nên đoạn trích có thật vẫn bị hiểu thành dữ kiện được khẳng định. Trái quy tắc 1 của extraction@1: chỉ đề xuất điều ghi chú nói rõ về KH.

Tái hiện / bằng chứng:

1. `node C\differential.mjs` → exit **0**, `differential.json`: cả bản ghim lẫn file Mock ở 119e2e4 trả:
   - `Thông tin KH độc thân là sai.` → `maritalStatus: Độc thân`, quote `độc thân`.
   - `Khẳng định KH có 2 con là sai.` → `childrenCount: "2"`, quote `2 con`.
   - Đối chứng `KH không có con.` → 0; `KH đã kết hôn.` → Đã kết hôn.
2. `node C\browser-negated.mjs` → exit **0**. Mở dữ liệu tải bằng openAppData, tạo KH/ghi chú qua app.run, bấm **AI trích xuất**: màn hiện **“AI đề xuất: Tình trạng hôn nhân: Độc thân ("độc thân")”** ngay dưới ghi chú phủ định. 0 dòng ai_analyses, 0 pageerror, 0 request ngoài. Ảnh `C\K6-negated.png` đã xem lại.
3. Ca này chỉ có một giá trị bị bác bỏ; không phải trường hợp hai giá trị được nêu rõ mà G5 §4 quy tắc 5 cho phép. Nó cũng khác sáu ca gốc DR6-121 và các mẫu “thì chưa/không” được T-289 sửa.

Ảnh hưởng: RE dùng Mock (bản web hoặc cấu hình mặc định) phải Bỏ đề xuất sai; nếu xác nhận máy móc có thể tự ghi một giá trị trái ghi chú. Đề xuất không tự ghi vào DB và OpenCode không dùng thuật toán này, nên không nâng mức do giả định người dùng đã xác nhận.

Đề xuất: nhận cách bác bỏ rõ ràng gắn với cụm ở vế sau (“là sai”, “không chính xác”…), thiếu chắc chắn thì bỏ đề xuất; thêm đối chứng phủ định nói về chủ đề khác và câu khẳng định đúng. Ước lượng **≤60 dòng SP**, cộng test, dưới 400 dòng SP. Không đổi spec/golden để hợp thức hóa kết quả hiện tại.

## 6. Bloat

| Đã chạy / đọc | Dữ liệu / phạm vi | Số / kết quả | ID |
|---|---|---|---|
| classifyFile/countLines, diff sửa | Gói C tại SHA ghim | **63 file, 6.027 SP / 7.539 test**; so lượt 3 +670/+1.075. Diff SP +1.290/−620, test +1.232/−157. | — |
| tsc --noUnusedLocals --noUnusedParameters | packages/ai và apps/desktop của repo gốc | **exit 0**, không lỗi cả hai; không typecheck bản main instrumented để suy cho sản phẩm. | — |
| codemap --check; dependency-cruiser | Repo gốc | **Export maps are up to date**; **0 vi phạm**, 341 module/1.435 dependency. | — |
| API/export và khối dùng chung | ai/schema, errors, attempts, analysis-steps, barrel và app | Một nguồn cap/provider; không export hằng cũ; ConfirmProposal nội bộ; helper HTTP/subject/retry không lặp. M66 codemap/M288 test bắt gỡ sửa. | — |
| Schema mini/full | 4.500 input + test V1 | **0 khác** success/data/detail; 3 nhóm mặc định không dùng chung mảng (M304 đỏ). Không thêm dependency. | — |
| Bundle chuẩn bị, common/baseline.md | Build chuẩn 2e51e25, không env riêng | index.js **884.698 / 261.767 B** thô/gzip; lượt 3 **927.932 / 271.662 B** → **−43.234 / −9.895 B**. Tổng JS/CSS **2.358.427 / 697.134 B**, giảm **41.966 / 9.620 B**. | — |
| Phân tách tăng ngoài AI theo baseline | Font/logo/icon của T-308 | Font mới **21.884 B**, ba logo **149.070 B**, favicon tăng **1.971 B**; icon.ico tăng **71.343 B**. Exe **5.649.408 B**, +240.640 so lượt 3. Không gán phần tăng này cho AI. | — |

Không có phát hiện B mới có chi phí đo được. Số riêng #830 (940.771→878.036 B, −62.735 B min) là số PR ghi trong fixes/baseline, không phải phiên này đo lại. Build probe riêng có handle AppData/adapter giả; build e2e đặt ngày neo bằng define, vì vậy không dùng kích thước của chúng thay bundle chuẩn.

## 6b. Hiệu năng

Máy **DESKTOP-KDURKJP**, Node **v24.20.0**. Dữ liệu tải đúng file common/load/load-2026-10-12-seed6.p2cbackup, đi qua importBackup; SHA-256 của JSON.stringify(tables) **ad82051b19415726ff2be3d86357aeb463b9f13205a30d4531667aa5a9492e25**, đúng baseline. 1.496 KH tổng, 103 phân tích; vòng cùng lượt 3 dùng 95 KH sống/102 dòng.

Ba dòng đầu giữ nguyên vòng lặp Codex lượt 3, cùng clock 17/10/2026, warmup + 9 mẫu; chỉ đổi đường dẫn và import takeAnalysisInput sau refactor. Trong lúc đo không chạy test/build/browser khác của chính phiên; app Codex và các tiến trình nền vẫn hiện hữu, không có bằng chứng máy hoàn toàn nhàn. Số Node không gồm React/IPC/render; số exe bên dưới **tái dùng baseline chung**, không nhận là tự đo lại.

| Đã chạy / đo | Dữ liệu | Lượt 4 trung vị (min–max), ms | Lượt 3 cùng máy | Mốc sau #656 / ngưỡng / nhận xét | ID |
|---|---|---:|---:|---|---|
| Profile+versions+analyses+panel/history/content/appointment, cùng vòng | 95 KH sống có AI | **35,329 (34,146–36,930)** | 33,640 | +1,689 ms (+5,0%); không xấu hơn theo luật nhiễu | — |
| Content/history/appointment của KH nhiều phân tích nhất | Dữ liệu đọc sẵn | **0,135 (0,125–0,163)** | 0,109 | +0,026 ms; dưới 10 ms | — |
| Build input + web message + kiểm Mock, cùng vòng | 95 hồ sơ | **22,003 (19,364–22,622)** | 17,560 | +4,443 ms (+25,3%); dưới 10 ms nên không xấu hơn theo luật nhiễu | — |
| listAiAnalyses + parse output, vòng bổ sung | 102 dòng sống, 11 mẫu | **10,780 (9,682–17,970)** | Không có vòng giống hệt | Ghi số, không so với vòng render-model ở trên | — |
| importBackup để dựng cầu nối probe | Một lần mở file tải, chưa warmup | **1.137,259** | Không so một mẫu với mốc khác | Không dùng một lần này để kết luận hồi quy; phép cùng vòng và exe ở các dòng khác | — |
| customer.open-ai — exe, baseline chung | Tải, 5 mẫu | **20 (19–22)** | 19 | Mốc sau #656 **19**, +1 ms; <200 ms | — |
| customer.ai-history — exe, baseline chung | Tải, 5 mẫu | **2 (2–11)** | 2 | Mốc sau #656 **2**; <200 ms | — |

Không có phát hiện P mới. Không dòng cùng vòng nào tăng đồng thời **quá 20% và quá 10 ms**. Số Node, dữ liệu/loop và baseline exe được giữ tách biệt; không dùng thời gian chạy e2e làm thời gian thao tác app.

## 7. Đếm mức × trục

Mỗi phát hiện tính một lần ở trục chính. Bảng R và biến thể không lỗi không cộng thành phát hiện.

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | **1** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **1** |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tổng | 0 | 0 | **1** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **1** |

**1/1 CONFIRMED; 0 PLAUSIBLE (0%)**. Không có KNOWN nào cần nâng thành phát hiện mới. R1 11/11, R2 8/8 ĐÃ SỬA trong phạm vi C; không phát hiện hồi quy do các đợt sau lượt 3 ở các đường đã chạy.

## 8. Đã xét, không thấy

| Trục | Đã đọc / chạy và giới hạn kết luận |
|---|---|
| R | Hai bảng 11+8 dòng; test gốc, probe AppData/Edge, 20 phép đột biến/chọn suite ở mục 9. Không dùng kết quả các gói lượt 4 khác để điền dòng của C. |
| E | Tổ hợp İ/emoji/vị trí detail; cap code point; generation thay cùng ID ở hai await; mixed-note và chuỗi K10. Ngoài CXR4-C1, không thấy lỗi mới trong các ca này. |
| C | So spec Phase 5/G5 §11–13 với schema, prompt nguyên văn, chip/hướng dẫn và hành vi UI. Ghi chú có hai giá trị rõ không tự coi là lỗi (G5 §4 quy tắc 5). CXR4-C1 là thông tin bị bác bỏ, khác loại đó. |
| D | AI qua AppData.run chỉ ghi lịch sử; raw hỏng không mất đuôi, backup nhận output đúng dạng; rejected lớn không phình output; chuỗi xác nhận cùng giá trị/backup giữ CURRENT và ánh xạ F đúng. |
| G | C0/C1, dấu lạc, danh sách đóng, ngoại lệ luật, dòng tin app và toàn bộ text eval đã lưu. Các giới hạn tương hình/dấu sai/ngoại lệ đã chốt ở G5 không báo lại. Không gọi eval thật. |
| S | Cầu ai-tauri chỉ gửi tham số cố định, key chỉ ghi theo interface; lỗi HTTP dùng helper và trần 200 code point; browser chặn mạng từ đầu, output hiển thị dạng text React. Không kiểm lại Rust/credential thực của gói B. |
| P | Dữ liệu tải đúng hash, ba vòng cùng lượt 3 và hai số exe baseline cùng máy: trong luật nhiễu/ngưỡng; bảng riêng ở 6b. |
| B | tsc unused, codemap, dependency-cruiser, nguồn hằng/helper/export và số bundle chuẩn. Không thấy bloat mới đáng ghi; bảng riêng ở 6. |
| T | Nền 1.495, cuối **1.724/1.724** test; **5/5 e2e** chọn lọc; các sửa chính có test/check đỏ khi gỡ. Một lần chọn suite quá hẹp sống, suite domain bắt. Lỗ Mock cho dạng “là sai” nằm trong CXR4-C1, không đếm lại T. |
| A | Đọc role/status/aria-live/focus của panel, web, extraction, history/Settings; chạy UI từ chối dán, giữ lỗi, 3f và layout; test e2e gốc có chi tiết lịch hẹn. Không nhận là đã đo lại mọi tương phản hoặc chạy screen reader trên exe. |

## 9. Phụ lục bằng chứng

### 9.1 Nguồn và lệnh

Tất cả đường dẫn dưới tương đối với **C:\workspace\deep-review-1-6-r4\codex\C\**. `copy\` là git archive của HEAD; dependency dùng junction sẵn có tới worktree gốc, không chạy pnpm trong bản chép. Các import @p2c của probe/unit được trỏ về copy để đột biến có tác dụng.

| Nguồn / lệnh | Kết quả lưu | Dùng cho |
|---|---|---|
| `node core-probes.mjs` | core-probes.log, core-results.json, load.db | R108/111/122/123/124/290, K1–K5 và biên output |
| `node differential.mjs` | differential.log/json | 4.500 ca mini/full, Mock 5.672 ghi chú, 1.085 text eval, ca phủ định và đối chứng |
| `node corpus-and-scope.mjs` | corpus-and-scope.log, vi-corpus.json, scope.md/json | 2.396 literal i18n, 0 thay đổi; bảng 63 file |
| `node browser-probes.mjs`; `node browser-negated.mjs` | browser-probes.log, browser-negated.log, browser-results.json; R118-1440.png, K6-temporal.png, K6-negated.png | AppData/Edge thật, 0 ngoài/0 pageerror; bản negated là bằng chứng CXR4-C1 |
| `node chain-probe.mjs` | chain-probe.log, chain-results.json | K10, ánh xạ F4→F5 và CURRENT qua rejected/import |
| `node perf-comparable.mjs` | perf-comparable.log, perf-comparable-results.json | Giữ vòng Codex lượt 3; chỉ thay đường dẫn và import nội bộ |
| `node node_modules/vitest/vitest.mjs run --config ...\vitest-review.config.mjs` | unit-baseline.log; **unit-final.log: 27 file, 1.724 passed, 65,75 s, exit 0** | AI, app-AI, AI command, backup-invariants và domain text |
| `node node_modules/@playwright/test/cli.js test --config ...\pw-final.config.mjs --grep ...` | **e2e-final.log: 5 passed, 32,7 s, exit 0** | R118, giữ lỗi, extraction/3f, cấu hình hỏng, kết nối đổi model |
| `node mutate.mjs`; `node mutate-extra.mjs`; `node mutate-ui.mjs`; `node mutate-exports.mjs` | mutations*.json, mutation-ui.json, mutation-exports.json, mutations/*.log | Bảng 9.2 |
| `node tools/codemap.mjs --check`; tsc -p ai/app --noEmit --noUnusedLocals --noUnusedParameters; dependency-cruiser | codemap-copy-baseline.log, tsc-app.log, deps.log; stdout tsc ai/codemap gốc | Bloat, export, ranh giới; đều exit 0 ở nền |

Các lần sửa hạ tầng probe, không phải lỗi sản phẩm: config ngoài cây dependency cần junction riêng; alias @p2c/ui phải tách theme.css; đặt dấu sau nguyên âm không phải dấu lạc; close handle phải dùng sqlite.close; locator timeout dùng đúng câu “AI không trả lời trong 2 phút.”. Test R118 lần đầu chạy nhầm snapshot tải khiến helper không thấy KH ngoài trang đầu; chạy lại main gốc với seed demo/ngày neo đúng đã xanh trước đột biến. Log cuối và JSON là kết quả dùng trong bảng. `progress.md` giữ nhật ký thô đã ghi dần; bản báo cáo này thay các suy đoán/ca tạm trong nhật ký.

Hai build probe: build instrumented chỉ thay main của **copy** để lộ AppData và dùng adapter/clipboard/mở browser giả, mở snapshot tải qua openAppData. Build e2e dùng main gốc, define ngày neo **15/09/2026**, không đặt env VITE_DEMO_ANCHOR; fixture thêm chặn host ngoài 127.0.0.1 và window.open giả từ đầu. Test e2e gốc không sửa kỳ vọng. Cổng riêng **4279**, không dùng 4173/PW_REUSE. Build cuối đã khôi phục mọi đột biến.

### 9.2 Đột biến

| ID | Gỡ / đổi trên copy | Test/check | Kết quả |
|---|---|---|---|
| M108 | Bỏ thay nửa surrogate trong storedRawOutput | ai-analyses | KILLED, **1/23** đỏ |
| M111 | Bỏ luật Cc; chỉ chọn validator-blocklists | 227 ca chọn hẹp | SURVIVED; không có test domain trong lệnh này |
| M111domain | Cùng phép bỏ Cc, chọn đúng bộ text | domain text | KILLED, **3/24** đỏ; không có lỗ toàn bộ verify |
| M122 | Không đọc dấu lạc thành cách | validator-blocklists | KILLED, **16/227** |
| M123 | Web chỉ tách CR/LF | web | KILLED, **13/58** |
| M124a | Bỏ danh sách đóng ấm/lạnh/nội/ít | validator-blocklists | KILLED, **8/227** |
| M124b | Gỡ miễn giới trước luật | validator-blocklists | KILLED, **2/227** |
| M121 | Mock về thuật toán 119e2e4 | mock-adapter | KILLED, **142/415** |
| M290merge | Không gộp span chồng nhau | validator-blocklists | KILLED, **8/227** |
| M290cut | Mọi `{` mở đều là piece khi bị cắt | extract-json | KILLED, **5/35** |
| M291 | Không bỏ output REJECTED lớn | run | KILLED, **1/56** |
| M291canonical | Bỏ so output ACCEPTED với dạng schema đọc ra | backup-invariants | KILLED, **5/182** |
| M291sunlife | Xóa matcher sunlife dù sun life còn | blocklists + validator-blocklists | KILLED, **1/524** |
| M295 | Bỏ kiểm generation sau copy | app ai-analysis | KILLED, **1/60** |
| M297 | Không giữ kết quả lỗi của job | ai-jobs | KILLED, **1/12** |
| M304 | Check đặt ngoài _default | schema | KILLED, **2/93** |
| M288 | Helper không chép serverMessage | errors | KILLED, **2/9** |
| M118 | Bỏ wrap-anywhere ở Item, build lại | e2e DR6-118 gốc | KILLED, panel scrolls sideways |
| M25 | Import full zod lại | ESLint | KILLED, no-restricted-imports |
| M66 | Export AI_LOCAL_ERROR_CODES lại | codemap:check | KILLED, map ai lệch; nền copy xanh trước đó |

**20 cấu hình đột biến/bộ kiểm: 19 bị giết; 1 sống do chủ ý chọn suite hẹp và bị bộ domain bắt khi chạy đúng.** Những phép đổi hành vi đều khôi phục trước phép tiếp; script gốc ghi `restored: true`, các script bổ sung dùng finally. Kiểm cuối 27 file/1.724 test xanh. Không patch repo gốc.

### 9.3 Kiểm cuối

- SHA cuối phiên: `2e51e25eb0125f56d3d938b97ef18d6873dae076`. `git status --short` cuối phiên: **rỗng**, như đầu phiên. Audit `C/audit-final.json`: 11 dòng R1, 8 dòng R2, 14 file từng đột biến có SHA-256 bản chép trùng nguồn gốc; unit/e2e cuối xanh.
- Không cài công cụ mới; không chạy AI thật; không mở/đọc/tìm trong các thư mục bị cấm.
- Báo cáo gói C không tổng hợp kết quả các gói lượt 4 khác, không tạo Issue/PR và không đề xuất merge.

- Giờ xong: **2026-10-29 08:07:47 +07:00** (Asia/Bangkok).

### 9.4 Danh mục file gói C và phạm vi dòng

Danh mục ở SHA ghim; `product` là SP, `test` gồm test-support. Các file nối gói đã ghi ở mục 3 nằm ngoài tổng 63 này.

| File | Dòng | Loại |
|---|---:|---|
| `apps/desktop/src/data/ai-analysis.test.ts` | 1–1050 | test |
| `apps/desktop/src/data/ai-analysis.ts` | 1–356 | product |
| `apps/desktop/src/data/ai-jobs.test.ts` | 1–207 | test |
| `apps/desktop/src/data/ai-jobs.ts` | 1–111 | product |
| `apps/desktop/src/data/ai-tauri.test.ts` | 1–108 | test |
| `apps/desktop/src/data/ai-tauri.ts` | 1–73 | product |
| `apps/desktop/src/routes/SettingsAi.tsx` | 1–411 | product |
| `apps/desktop/src/routes/ai-error-view.test.ts` | 1–73 | test |
| `apps/desktop/src/routes/ai-error-view.ts` | 1–54 | product |
| `apps/desktop/src/routes/appointments/AppointmentAi.tsx` | 1–99 | product |
| `apps/desktop/src/routes/appointments/appointment-ai-view.test.ts` | 1–183 | test |
| `apps/desktop/src/routes/appointments/appointment-ai-view.ts` | 1–49 | product |
| `apps/desktop/src/routes/customers/KycExtraction.tsx` | 1–197 | product |
| `apps/desktop/src/routes/customers/KycHistory.tsx` | 1–159 | product |
| `apps/desktop/src/routes/customers/KycIntelligence.tsx` | 1–642 | product |
| `apps/desktop/src/routes/customers/KycWebSession.tsx` | 1–193 | product |
| `apps/desktop/src/routes/customers/ai-panel-view.test.ts` | 1–1090 | test |
| `apps/desktop/src/routes/customers/ai-panel-view.ts` | 1–643 | product |
| `apps/desktop/src/routes/customers/extraction-view.test.ts` | 1–162 | test |
| `apps/desktop/src/routes/customers/extraction-view.ts` | 1–104 | product |
| `apps/desktop/src/routes/customers/use-ai-job.ts` | 1–64 | product |
| `apps/desktop/src/routes/settings-ai-view.test.ts` | 1–134 | test |
| `apps/desktop/src/routes/settings-ai-view.ts` | 1–99 | product |
| `packages/ai/src/adapter.ts` | 1–43 | product |
| `packages/ai/src/analysis-steps.ts` | 1–126 | product |
| `packages/ai/src/attempts.ts` | 1–51 | product |
| `packages/ai/src/blocklists.test.ts` | 1–205 | test |
| `packages/ai/src/blocklists.ts` | 1–118 | product |
| `packages/ai/src/code-points.test.ts` | 1–51 | test |
| `packages/ai/src/code-points.ts` | 1–45 | product |
| `packages/ai/src/errors.test.ts` | 1–76 | test |
| `packages/ai/src/errors.ts` | 1–79 | product |
| `packages/ai/src/extract-json.test.ts` | 1–162 | test |
| `packages/ai/src/extract-json.ts` | 1–98 | product |
| `packages/ai/src/index.ts` | 1–11 | product |
| `packages/ai/src/input.test.ts` | 1–174 | test |
| `packages/ai/src/input.ts` | 1–29 | product |
| `packages/ai/src/mock-adapter.test.ts` | 1–863 | test |
| `packages/ai/src/mock-adapter.ts` | 1–515 | product |
| `packages/ai/src/models.test.ts` | 1–27 | test |
| `packages/ai/src/models.ts` | 1–35 | product |
| `packages/ai/src/prompts/analysis.ts` | 1–48 | product |
| `packages/ai/src/prompts/connection.ts` | 1–14 | product |
| `packages/ai/src/prompts/discovery.ts` | 1–43 | product |
| `packages/ai/src/prompts/extraction.ts` | 1–27 | product |
| `packages/ai/src/prompts/prompts.test.ts` | 1–55 | test |
| `packages/ai/src/prompts/retry.ts` | 1–16 | product |
| `packages/ai/src/raw.d.ts` | 1–5 | product |
| `packages/ai/src/run.test.ts` | 1–853 | test |
| `packages/ai/src/run.ts` | 1–337 | product |
| `packages/ai/src/schema.test.ts` | 1–420 | test |
| `packages/ai/src/schema.ts` | 1–418 | product |
| `packages/ai/src/settings.test.ts` | 1–94 | test |
| `packages/ai/src/settings.ts` | 1–86 | product |
| `packages/ai/src/test-support.ts` | 1–80 | test |
| `packages/ai/src/text-match.ts` | 1–154 | product |
| `packages/ai/src/validator-blocklists.test.ts` | 1–452 | test |
| `packages/ai/src/validator-extraction.test.ts` | 1–135 | test |
| `packages/ai/src/validator-union.test.ts` | 1–29 | test |
| `packages/ai/src/validator.test.ts` | 1–329 | test |
| `packages/ai/src/validator.ts` | 1–313 | product |
| `packages/ai/src/web.test.ts` | 1–527 | test |
| `packages/ai/src/web.ts` | 1–162 | product |

- Đột biến export M66 (baseline codemap xanh): {"id":"M66","exit":1,"output":"Export map out of date in:\n  packages\\ai\\CLAUDE.md\nRun pnpm codemap and commit the result.\n"}

