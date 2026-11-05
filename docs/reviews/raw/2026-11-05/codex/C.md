XONG — codex gói C lượt 5, 2026-11-04 23:28:49 +07:00

## 1. Phiên review

- Bên: Codex (Codex desktop, PowerShell qua công cụ exec). Gói C: AI.
- SHA đầu phiên: 37a80b662861d308a110d1e2b0f65ad13b91fb51.
- git status --short đầu phiên: không có dòng nào.
- Bắt đầu: 2026-11-04 23:12:34 +07:00 (Asia/Bangkok).
- Model Owner chỉ định: GPT Sol 6.1. Runtime không hiển thị mã bản dựng Codex, tên model thực thi hoặc mức suy luận cho phiên này.
- Công cụ: codex-cli 0.162.1 (codex --version), Node v24.20.0, Vitest 5.0.1 và Edge headless qua Playwright.
- Ghi báo cáo và probe ngoài worktree theo đường dẫn Owner chỉ định, qua quyền ghi riêng cho thư mục kết quả.

## 2. Kiểm phần đã sửa

### R1

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| DR6-137 | #896 → #907, #933 → #946 | **ĐÃ SỬA** | Chạy lại probe CXR4-A1 qua recordAiAnalysis. Cả hai nửa surrogate ở đơn vị thứ 100 và U+FEFF ở đầu đều trả AI_ANALYSIS_INVALID. Bỏ kiểm đọc lại nguyên văn ở isLabel làm 2 test đỏ, gồm ca lệnh và ca luật 12. | U+FEFF giữa và cuối, cùng nhãn 98 chữ + emoji (100 đơn vị UTF-16), được giữ nguyên khi đọc và xuất → nhập → xuất. Ca backup có BOM đầu bị chặn ở bước nạp VALUE. CXR5-C4 là vấn đề hiển thị với một nhãn hợp lệ. |
| DR6-141 | #899 → #917, #937, #939, #956, #963 | **ĐÃ SỬA** | Cả 18 câu CLR4-C1 và 2 câu CXR4-C1 tái hiện đề xuất cũ ở 2e51e25, còn 37a80b6 trả 0/20 qua runExtraction. Câu “Thông tin KH độc thân là sai.” trên Edge hiện trạng thái không tìm thấy. Bỏ RETRACTED làm 6 test đỏ. | Ghi chú tải và seed chỉ đổi ở nhãn Hôn nhân: Ly hôn (§4). Các ca mới về dấu đầu dòng và chữ “bé” ở R2. |
| DR6-142 | #900 → #909, #913, #937 | **ĐÃ SỬA** | “phần\u0000trăm”, “xác\u0000suất” trước lọt, nay V3. Bỏ loại NUL làm 18 test đỏ ở validator và web. Edge từ chối tin nhắn gốc và tin sửa có chèn NUL ở cả hai lượt, còn phiên, 0 dòng. | BEL vẫn V3. NUL giữa chữ ở V5 và V6 bị chặn. Ca mất ranh giới trước cụm, cùng thay đổi “Atomic”, đúng §14.5/K43. So 1.199 chuỗi vi.ts, 0 thay đổi mã chặn. Chấp nhận kết quả 1.085 chuỗi eval thật từ số đo PR #913 trong fixes.md vì bộ output thô ấy không có trong nguồn phiên được phép đọc. |
| DR6-143 | #900 → #909, #913, #937 | **ĐÃ SỬA** | Các câu cũ “môi giới / ranh giới Luật …” từ lọt sang V6. Miễn “giới” không điều kiện như cũ làm 8 test đỏ. | “biên giới”, “THẾ-GIỚI_LUẬT”, NUL trong “môi” hoặc “luật” cũng V6. “giới luật Phật giáo” ở hai cách viết hoa, “định luật Pareto” và ví dụ khoản vay/ngày E18 đều qua. “quy định Luật Đất đai” vẫn V6. |
| DR6-144 | #899 → #917, #946 | **ĐÃ SỬA** | Edge: cho adapter giả timeout sau khi rời hồ sơ. Quay lại dữ liệu cũ hiện đúng một lần. Lặp rồi nhập backup có cùng ID, generation 0→1 và 0 cảnh báo cũ. Bỏ so generation làm 3 test đỏ, có cả Nạp lại và Nhập backup. | Lỗi AI trích xuất được giữ khi còn cùng dữ liệu, mất sau Nhập backup rồi vẫn mất sau Nạp lại (generation 2). |

### R2

| Mã | Issue → PR | Kết luận | Bằng chứng | Biến thể / ghi chú |
|---|---|---|---|---|
| T-329 | #930 → #937 | **ĐÃ SỬA** | Đối chiếu 97876b4→b6d4388: LAW_NAME, THE_KH, KH_NAMED giống từng ký tự. 0 khác biệt trước/sau khi tách qua runExtraction ở 5.672 ghi chú tải, 4.195 ghi chú seed và X01–X05. Bỏ truyền danh sách fields từ adapter làm 202 test đỏ. | Trường được phép có tác dụng và “Độc thân: KH đã kết hôn.” không đề xuất. NUL dùng chung, chú thích ownLine và codemap khớp. Git diff -M mặc định hiện tách thành file mới vì adapter vẫn tồn tại. git diff -C nhận bản sao 89% cho nguồn, 85% cho test, git log --follow vẫn đến #917/#822, khớp cách #937 ghi. |
| T-330 | #931 → #939 | **SỬA MỘT PHẦN** | Qua runExtraction: lấy giá trị cuối, thêm Ly hôn, Góa, Ly thân, một con mất, cả hai mất và “bé” chỉ trẻ em đều có đối chứng đạt. Giữ giá trị đầu thay cuối làm 62 test đỏ. Trên Edge, “1) KH có 3 bé. / 2) Một bé qua đời.” cho Số con 2. | CXR5-C1, nhánh nhận cái chết dùng “bé” mang nghĩa kích thước trái luật 4. Ghi chú tải/seed đổi đúng nhóm nhãn Ly hôn. Giữ các giới hạn K42 đã chốt. |
| T-332 | #933 → #946 | **ĐÃ SỬA** | Phần gói C: AiJobs dùng notify, vẫn báo lỗi listener và cho listener sau chạy. Thay bằng vòng gọi trần làm 1 test đỏ. 6 suite tích hợp DB/dữ liệu/listener qua 209 test. | Listener tự gỡ rồi ném, log theo thứ tự self → sentinel → other → other. Công việc trả done và được gỡ. Hai nhánh isLabel và backup dùng readsBackAsIs, đối chứng ở DR6-137. Focus và ô nhập thuộc gói tương ứng. |
| T-336 | #950 → #956 | **SỬA MỘT PHẦN** | Ca dấu kết câu, dòng trống, emoji/số thứ tự, danh sách “-” hoặc “•” có đúng giá trị cuối. Vế có chữ ngắt mang KH. Ca cả hai con mất và một con mất đạt. Bỏ bỏ qua dấu đầu dòng khi mang KH làm 2 test đỏ. | CXR5-C2, dấu gạch ngang U+2013 đầu dòng giữ nguyên khi lưu nhưng không được xét như dấu đầu dòng. Kiểm phần test-support với T-339. CLAUDE.md, sổ quyết định và §10 ghi luật; giới hạn chữ được công nhận nằm ở regex. |
| T-339 | #960 → #963 | **SỬA MỘT PHẦN** | Bỏ kiểm vế có chữ trước vế không chủ ngữ làm 2 test đỏ, có ca đúng như Issue. Thêm quét ngược bậc hai làm 12 ca thời gian đỏ, ví dụ 1.067 ms so trần 60 ms. depcruise chặn latest-support.ts, web-test-support.ts và code sản phẩm trong ai import test-support. Bỏ miễn thì cạnh test-support → vitest đỏ. | CXR5-C3, luật ghi chỉ test của ai được import, nhưng mã sản phẩm desktop import trực tiếp vẫn xanh. Không thấy cạnh thật trong baseline. |

## 3. Phạm vi đã đọc

- Danh mục 68 file và khoảng dòng ở C/scope.md, gồm 65 file nguồn/test và ba file hướng dẫn/cấu hình package. Diff gói 2e51e25..37a80b6 có 22 file, +2.452/−1.235 dòng. Lưu C/diff-ai.patch và C/diff-stat.txt. Đọc kỹ thay đổi parser Mock, adapter, matcher G5, schema, prompt, phiên web, runner, AiJobs và useAiJob. So đường gọi tại SettingsAi, KycIntelligence, KycExtraction, KycWebSession, KycHistory và AppointmentAi. Test đọc theo nhánh/hợp đồng và chạy theo file; không có thống kê bao phủ việc đọc từng dòng test.
- Chỗ nối ngoài gói gồm apps/desktop/src/data/{app-data,listeners,tables,persist-queue}.ts, AppDataContext.tsx, i18n/vi.ts, CustomerKyc.tsx, package DB common/backup/ai-analyses, cấu hình dependency-cruiser và e2e customer-ai. Đối chiếu hợp đồng G5, nhãn, đầu vào/đầu ra, mốc xử lý thay dữ liệu và điều kiện nhập backup.
- Nguồn đối chiếu gồm CLAUDE.md gốc/AI/desktop, CONTEXT.md, Phase 6 §4–§5, Phase 5 §3–§10, prompt G5 §6a–§8 và §11–§14, golden AI E/X, ADR-0009, common/{known,fixes,baseline,plan}.md, bốn bản tổng hợp và các báo cáo gốc liên quan đến C và DR6-137 từ lượt 1–4.
- Baseline bản chép chạy 25 suite AI, **1.819 test qua**. Sáu suite nối DB/dữ liệu qua **209 test**. Probe bổ sung gồm Vitest và Edge headless trên bản dựng có seam adapter giả, clipboard giả. Cả hai lần dán tin nhắn ở probe cuối bị chặn ở app. Edge không có request bị chặn và không có pageerror. Mọi thao tác màn với dữ liệu dựng qua openAppData, app.run và tables. Probe đầu tiên trong sandbox gặp ENOENT ở cache SSR, chuyển cache sang thư mục C/tmp và chạy bằng bản chép.

## 4. Kịch bản mới đã thử

| # | Kịch bản | Kết quả | ID |
|---|---|---|---|
| 1 | Lưu ghi chú 2 dòng theo dấu “-”, “•” hoặc “–”, câu sau không chủ ngữ, chạy Mock | “-” và “•” → Ly hôn. “–” được giữ nguyên ở DB nhưng ra rỗng. | CXR5-C2 |
| 2 | Đang có 3 con, vế sau “Vụ mất điện ở căn nhà nhỏ bé” hoặc “mất mát nhỏ bé”. So với “mất mát nhỏ” | Hai ca “nhỏ bé” mất đề xuất. Đối chứng → Số con 3. | CXR5-C1 |
| 3 | Từ 3 bé qua danh sách “1)” và “2)”, một bé qua đời, trích xuất trên màn | Số con 2, quote “Một bé qua đời”, 0 dòng AI. | — |
| 4 | Emoji và mục số không chữ xen giữa kết hôn và ly hôn. So với vế xen có chữ rồi “Có 2 con” | Khúc không chữ cho Ly hôn. Khúc có chữ ngắt mang KH, chỉ còn Đã kết hôn. | — |
| 5 | Đối chiếu bản trước/sau #937 và 2e51e25→37a80b6 trên ghi chú seed, tải và X01–X05 | 0 thay đổi do riêng #937. Lượt 5 thêm Ly hôn ở 512/5.672 ghi chú tải và 401/4.195 ghi chú seed. 1.619 và 1.265 ghi chú có đề xuất ở bản ghim. X01–X05 cho 0 ở cả hai bản Mock, phù hợp phạm vi hẹp của Mock §10. | — |
| 6 | G5 “THẾ-GIỚI_LUẬT”, NUL trong “môi”/“luật” và chữ vô hình trước “giới”. Đối chứng tên luật và cụm thông thường | V6 với các cụm mới. “giới luật Phật giáo”, “pháp luật Việt Nam”, khoản vay/ngày E18 vẫn qua. | — |
| 7 | Lỗi trích xuất ngoài màn → nhập backup cùng ID → Nạp lại. Listener tự gỡ rồi ném khi báo job | Lỗi cũ mất sau khi thay, generation 2. Listener kia nhận cả lúc bắt đầu lẫn kết thúc, job trả done. | — |
| 8 | Thêm cạnh import test-support từ file sản phẩm desktop, đối chứng cùng cạnh từ file sản phẩm ai | Desktop exit 0, ai exit 1. | CXR5-C3 |
| 9 | Mở hồ sơ rộng 1.100 px với nhãn model trong danh sách, rồi thêm phân tích có model 100 chữ W | Cột trạng thái của hàng lịch sử vượt mép phải cửa sổ. | CXR5-C4 |
| 10 | Tiền tố là “Em gái chuyển nhà” hoặc “Lan chuyển nhà”, vế sau mở rõ “KH đã ly hôn năm 2020” | Với “Em gái” ra rỗng, “Lan” cho Ly hôn. Đã đối chiếu với luật người khác trong cùng câu và danh sách nhận diện đóng ở §10; giữ như kết quả biên. | — |
| 11 | Một nhãn model có BOM giữa/cuối, một nhãn 100 đơn vị UTF-16 có emoji, qua lệnh ghi và backup | Cả ba giữ nguyên ở vòng xuất → nhập → xuất. | — |

## 5. Phát hiện mới

### CXR5-C1 — “Nhỏ bé” trong câu nói về mất điện làm Mock bỏ Số con

- ID: CXR5-C1
- Mức: Low
- Trục: C
- Vị trí: packages/ai/src/mock-extraction.ts:342, :352, :361, :931 (37a80b6)
- Tình trạng: CONFIRMED
- Liên quan: T-330, mới do #939
- Kịch bản: 2
- Mô tả: Nhánh otherDeaths dùng CHILD trực tiếp. Nó đọc “bé” là trẻ em kể cả trong “nhỏ bé” mà §10 loại khỏi nghĩa đó. Giá trị rỗng của vế sau thay Số con đã tìm được ở câu trước.
- Tái hiện / bằng chứng: node C/browser.mjs, các dòng small-death, small-loss và small-control trong C/browser.log. “KH có 3 con. Vụ mất điện ở căn nhà nhỏ bé.” và “KH có 3 con. Đây là một mất mát nhỏ bé.” hiện 0 đề xuất, còn “KH có 3 con. Đây là một mất mát nhỏ.” hiện Số con 3. Cả ba ghi chú lưu qua app.run, 0 dòng ai_analyses.
- Ảnh hưởng: RE dùng Mock bỏ lỡ một đề xuất xác nhận dù số con đã nêu rõ và vế sau nói việc khác.
- Đề xuất: Dùng chung ngữ cảnh nhận diện “bé” nghĩa trẻ em ở nhánh đọc cụm con mất. Ghim hai ca “nhỏ bé” và một ca “Con út đã mất”. Ước lượng 15–30 dòng SP.

### CXR5-C2 — Dấu gạch ngang U+2013 làm mất đề xuất sau đầu dòng

- ID: CXR5-C2
- Mức: Low
- Trục: C
- Vị trí: packages/ai/src/mock-extraction.ts:244, :257, :771 (37a80b6)
- Tình trạng: CONFIRMED
- Liên quan: T-336, biến thể còn hở trong #956
- Kịch bản: 1
- Mô tả: Cùng bộ BULLET được dùng khi nhận chủ ngữ và khi mang KH sang vế sau. Nó nhận “-”, “*”, “•”, “+” và một dạng số, bỏ U+2013. §10 yêu cầu bỏ dấu đầu dòng trước khi xét vế.
- Tái hiện / bằng chứng: C/browser.log, bullet-control và bullet-en-dash. Lưu “– KH đã kết hôn” xuống dòng “– Đã ly hôn năm 2020.”, bấm AI trích xuất, thấy 0 đề xuất. Cùng chữ với “-” → “Tình trạng hôn nhân: Ly hôn”. Ghi chú đọc lại vẫn chứa U+2013.
- Ảnh hưởng: RE dán danh sách dùng gạch ngang Unicode từ tài liệu hoặc trình soạn thảo phải nhập dữ kiện bằng tay.
- Đề xuất: Nhận gạch ngang đầu dòng theo cùng điều kiện khoảng trắng của dấu “-”, có đối chứng ở đầu ghi chú và vế mang KH. Ước lượng dưới 10 dòng SP.

### CXR5-C3 — Luật test-support không chặn import từ desktop

- ID: CXR5-C3
- Mức: Low
- Trục: T
- Vị trí: .dependency-cruiser.cjs:25, :31–35 (37a80b6)
- Tình trạng: CONFIRMED
- Liên quan: T-339, có từ khi #956 thêm rule, #963 giữ phạm vi bên nhập
- Kịch bản: 8
- Mô tả: Rule ai-test-support-only-in-tests giới hạn from.path trong packages/ai. App desktop vẫn có thể import file phụ thuộc vitest bằng đường tương đối. Điều này lệch hợp đồng của #960 rằng chỉ test của package AI import file hỗ trợ test.
- Tái hiện / bằng chứng: Trong bản chép, đặt import '../../../packages/ai/src/test-support' trong apps/desktop/src/probe-prod.ts. Chạy node node_modules/dependency-cruiser/bin/dependency-cruiser.mjs apps/desktop/src/probe-prod.ts → exit 0, 30 module, 88 cạnh. Cùng phép thử từ packages/ai/src/probe-prod.ts → exit 1, ai-test-support-only-in-tests. Log C/T339-{app-import,ai-import}.log. Baseline 354 module/1.582 cạnh xanh.
- Ảnh hưởng: Cổng ranh giới bỏ lọt phụ thuộc test nếu mã sản phẩm desktop thêm đường import này. Đây là cạnh đột biến; không thấy cạnh thật trong cây đã ghim.
- Đề xuất: Giới hạn đích ở test-support của AI, cho phép bên nhập đúng là test của AI. Thêm đối chứng import từ desktop. Ước lượng dưới 15 dòng cấu hình.

### CXR5-C4 — Nhãn model hợp lệ dài đẩy cột trạng thái ra khỏi cửa sổ

- ID: CXR5-C4
- Mức: Low
- Trục: A
- Vị trí: apps/desktop/src/routes/customers/KycHistory.tsx:76–84, apps/desktop/src/routes/customers/ai-panel-view.ts:554–564 (37a80b6)
- Tình trạng: CONFIRMED
- Liên quan: Biến thể nhãn hợp lệ của DR6-137. Ô hiển thị đã có trước lượt 5.
- Kịch bản: 9
- Mô tả: Lịch sử hiển thị nguyên nhãn model ngoài danh sách. Ô prompt có wrap-anywhere, còn ô model giữ chuỗi liền dài, khiến bảng tràn khung ở chiều rộng tối thiểu 1.100 px.
- Tái hiện / bằng chứng: node C/browser.mjs, long-label ở C/browser.log. Tạo dòng ACCEPTED qua app.run/recordAiAnalysis, dùng input và output Mock hợp lệ với metadata OpenCode, nhãn W×100. Tại 1.100 px, panel clientWidth 818 px, scrollWidth 1.529 px, bảng 1.513 px, mép phải ô trạng thái ở x=1.786. Đối chứng glm-5.3 cho bảng 786 px và mép ô ở x=1.059. 0 pageerror.
- Ảnh hưởng: Dữ liệu lịch sử có nhãn dài hợp lệ có thể che trạng thái và làm rộng vùng cuộn. Danh sách model hiện hành không tạo ra nhãn probe.
- Đề xuất: Cho ô model xuống dòng ở chỗ có thể và ghim ca nhãn liền dài tại 1.100 px. Ước lượng dưới 15 dòng SP.

## 6. Bloat và hiệu năng

### Bloat

| Đã chạy / đọc | Dữ liệu | Số và nhận xét | ID |
|---|---|---|---|
| tsc --noEmit --noUnusedLocals --noUnusedParameters | packages/ai và apps/desktop | Cả hai exit 0. | — |
| node tools/codemap.mjs --check | Worktree ghim | Export maps are up to date. | — |
| dependency-cruiser | Worktree ghim và cạnh tạm trong bản chép | 354 module, 1.582 cạnh, 0 vi phạm thật. Một lỗ trong phép kiểm cạnh tạm, ghi ở trục T. | CXR5-C3 |
| git diff theo gói, so baseline | 2e51e25→37a80b6 | 6.580 dòng SP (+553), 8.202 dòng test (+663). File mock-extraction.ts 950 dòng gồm phần chuyển chỗ và phần thay luật. So từng ký tự/đầu ra trước và sau #937 không thấy phần sản phẩm trùng chạy hai lần. | — |
| Bundle và exe của bước chuẩn bị, common/baseline.md | Bản sản phẩm chuẩn ở 37a80b6 | JS/CSS 2.366.456 B thô, +8.029 B so lượt 4, +2.173 B so b139d8a. index.js 892.184 B, +7.486 B so lượt 4. Exe 5.649.408 B, bằng lượt 4 và G7. Số mốc G7 cho web bundle không có trong plan. Không quy phần tăng của cả app cho riêng AI. | — |

### Hiệu năng

Home PC DESKTOP-KDURKJP, Node v24.20.0. Dữ liệu tải nhập qua importBackup, hash file B3C9903321ABCCDF3301818D35DAD7D7C6EAC48D73814286694B554C94C77293. Vòng Node dùng cùng cách Codex lượt 4, clock 17/10/2026, một lần làm ấm + 9 mẫu. Phép Mock dài dùng 12 lần làm ấm + 41 mẫu mỗi bản. Đo vòng Node sau khi đóng Edge của probe. App Codex và tiến trình nền vẫn hiện hữu, không xác nhận toàn máy rảnh. Mốc exe tái dùng từ common/baseline.md. Đơn vị ms.

| Đã chạy / đo | Dữ liệu | Lượt 5 | Lượt 4 / G7 / mốc sau #656 | ID |
|---|---|---:|---|---|
| Hồ sơ + lịch sử + view panel và lịch hẹn, Node | 95 KH sống có AI, 102 dòng sống | 35,599 (34,010–38,983) | Lượt 4 35,329. +0,270 ms. | — |
| View panel/lịch sử/lịch hẹn của KH có nhiều bản nhất, Node | Dữ liệu đọc sẵn | 0,128 (0,123–0,164) | Lượt 4 0,135. | — |
| Dựng input + tin nhắn web + kiểm Mock, Node | 95 hồ sơ | 22,406 (19,819–22,741) | Lượt 4 22,003. +0,403 ms. | — |
| runExtraction, ghi chú dài nhất và ghép 36.000 ký tự | Tải, 173 ký tự / 36.000 ký tự | 0,029 / 1,695 | Lượt 4 0,024 / 1,207. | — |
| runExtraction, ghi chú 36.000 ký tự lặp con mất hoặc kết hôn | Ca tổng hợp cạnh dữ liệu tải | 5,690 / 7,354 | Lượt 4 0,608 / 4,105. Chênh cao nhất 5,082 ms, dưới 10 ms. | — |
| runExtraction, hai mẫu nhiều khoảng trắng | Ca tổng hợp 35.994 và 36.023 ký tự | 2,644 / 1,194 | Lượt 4 0,282 / 1,024. | — |
| customer.open-ai, exe | Tải, 5 mẫu | 20 (19–21) | Lượt 4 20, G7 20, sau #656 19. Ngưỡng <200. | — |
| customer.ai-history, exe | Tải, 5 mẫu | 2 (2–10) | Lượt 4, G7 và sau #656 đều xấp xỉ 2. Ngưỡng <200. | — |

Không phép đo tương đương nào tăng đồng thời quá 20% và quá 10 ms. Số Node không gồm render hay IPC. Dòng bậc hai ở R2 là đột biến cố ý trên bản chép.

## 7. Đếm mức × trục

| Mức | R | E | C | D | G | S | P | B | T | A | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Critical | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Low | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 4 |
| Nit | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

4 CONFIRMED, 0 PLAUSIBLE. R1 có 5 ĐÃ SỬA. R2 có 2 ĐÃ SỬA và 3 SỬA MỘT PHẦN. Phát hiện liên quan được đếm theo trục ở khuôn, một lần mỗi ID.

## 8. Đã xét, không thấy thêm

- R — Chạy lại ca cũ, có test đỏ cho cả năm dòng R1. Ba phần R2 còn hở dẫn tới CXR5-C1…C3.
- E — So qua câu có chủ ngữ, câu không chủ ngữ, dấu câu, emoji, số thứ tự, hai giá trị cùng trường, dữ liệu tải và ghi chú X01–X05. Ca có chữ xen ngắt mang KH theo §10.
- C — So §10 và quyết định K42, ca Ly hôn/Góa/Ly thân, quy tắc số con và lời báo khi 0 đề xuất. Hai điểm lệch ở §5.
- D — 209 test đường DB/dữ liệu, nhãn model U+FEFF/surrogate và roundtrip; 103 dòng AI trong file tải, 102 dòng của KH sống. Đề xuất trích xuất trong probe không tự ghi.
- G — Ca cũ và các biến thể NUL, BEL, ký tự vô hình, “giới” sau bốn từ, bằng chứng F1, khoản vay/ngày. So vi.ts. Dán nhầm cả thông điệp gốc lẫn thông điệp sửa qua Edge.
- S — Đã xét trường cho phép/V7, payload phân tích tối thiểu, kết quả bị cắt, ranh giới IPC và key qua test hiện có. Các ca timeout dùng adapter giả. Web probe chỉ loopback, chặn mạng ngoài và thay window.open trước khi mở trang.
- P — Các vòng Node trên dữ liệu tải và số exe §6, thêm bốn mẫu dài tổng hợp. Không phát hiện P.
- B — No-unused, codemap, kích thước web/exe và tách file Mock ở §6. Không thấy mã chết có chi phí đã đo.
- T — Đột biến hành vi và cấu hình ở phụ lục. CXR5-C3 là cạnh bị bỏ lọt. Các ca thời gian có đối chứng đỏ bằng công việc bậc hai.
- A — Dán tin nhắn bị từ chối ở trường, phiên còn mở, quay lại hồ sơ hiện cảnh báo đúng một lần. Bảng lịch sử có một ca nhãn dài ở CXR5-C4.

## 9. Phụ lục

- Bản chép tại C/copy, giải nén từ git archive HEAD. Node CLI qua junction dependency đã có. probe-r5.test.ts và các file probe-r4-/probe-pre329-/probe-post329- trong C/copy/packages/ai/src là nguồn đối chiếu. Log C/probe-values.log, C/probe-r5.log, C/probe-g5-final.log và ba file corpus-*.json. Bản gốc vite web không sửa. Bản dựng probe chỉ thay chỗ ghép adapter và công bố app/test seam ở entry point của bản chép. Lưu entry dựng tại C/browser-main.tsx, runner C/browser.mjs và C/browser.log, browser-results.json. Không dùng kết quả bundle đã cài seam để so kích thước.
- node C/mutations.mjs gỡ từng phần rồi khôi phục file trong finally. R137 2 đỏ, R141 6, R142 18, R143 8, R144 3. T329 202, T330 62, T332 1, T336 2, T339-carry 2, T339-time 12. Đột biến cạnh T339-latest, T339-web-support, T339-ai-import, T339-no-exemption bị chặn. T339-app-import sống. Các log riêng có tên tương ứng. Phép tương đương trước/sau #937 dự kiến xanh, kiểm độc lập bằng corpus và so regex.
- Phép đo vòng AI Node có nguồn C/perf-comparable.mjs và C/hooks.mjs, kế thừa vòng Codex lượt 4, kết quả C/perf-comparable-results.json. Probe nhãn model kế thừa CXR4-A1 ở C/label-probe.mjs, thêm ba đối chứng hợp lệ. Probe listener và generation ở C/app-variants.mjs. Mỗi probe dùng Node v24.20.0.
- Giới hạn bằng chứng độc lập: corpus 1.085 đoạn trả lời eval thật chỉ đối chiếu qua bảng số của #913 trong common/fixes.md. Các phép đo exe dùng baseline chung. Tự chạy Vitest chọn phạm vi, probe Node và Edge nêu trên.

- git status --short cuối phiên: không có dòng nào. HEAD 37a80b662861d308a110d1e2b0f65ad13b91fb51.
- Xong: 2026-11-04 23:28:49 +07:00 (Asia/Bangkok).
