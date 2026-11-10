# Spec Phase 6 — Phản hồi dùng thử exe `5215b2e` (G1)

- **Trạng thái:** kế hoạch, **chưa tạo Issue** (Owner 10/11/2026: "lên kế hoạch thôi nhé, chưa ra issue"). Owner duyệt cách chia A–F và thứ tự ngày 10/11/2026 (G1, trong chat ở Home PC). Đã chốt nội dung: **A** (§3; gồm G2 golden fixtures chỉ đổi tên, G3 mockup chỉ đổi nhãn; chữ prompt G5 duyệt trên PR của A6), **B** (§4; golden G2 và mockup G3 duyệt sau), **C** (§5; bố cục duyệt ở mockup), nguồn số tiền của **D** (§6.1). Còn mở: phần còn lại của D (§6.2), **E** và **F** (§7). Trước mockup và Issue là vòng ý tưởng UI/UX (§8); hướng làm bản macOS (§9) là đề xuất, chờ Owner.
- **Soạn:** 10/11/2026, `main` `de9cde7` (code `5215b2e`). Nguồn: phản hồi dùng thử của Owner (§1), HANDOFF bước 0.

## 1. Phản hồi của Owner (nguyên văn)

Owner dùng thử exe `5215b2e` (`C:\heritas-dung-thu\`, Home PC) rồi gửi trong chat ngày 10/11/2026:

> feedback về việc chưa sẵn sàng cho v1.0:
>
> 1. Đổi tất cả RE (Relationship Expert) thành RM (Relationship Manager)
> 2. Không có tính năng, nút & icon tìm kiếm (search). Phải bổ sung tính năng cùng icon search 1 khách hàng bất kỳ trong mục “Khách hàng”. Khi gõ tên sẽ ra các kết quả gợi ý gần nhất. Ví dụ gõ: Nguyễn Văn Hu sẽ ra 1 hoặc nhiều hơn 1 khách hàng có tên như vậy, ví dụ: Nguyễn Văn Hùng – RM Hoàng Văn Tùng – Sao Mai (tên team). Tương tự như vậy, phải bổ sung tính năng search cùng icon khi muốn tìm kiếm 1 RM, gõ tên sẽ ra kết quả gợi ý gần nhất. Ví dụ: gõ Nguyễn Văn Hùng ra: RM Nguyễn Văn Hùng – Sao Mai (tên team).
> 3. Các bảng báo thuộc mục “Báo cáo” trình bày quá sơ sài, không chuyên nghiệp, đẳng cấp.
> 4. Cần thêm 1 mục mới ngay bên trên mục Báo cáo:
>
> a. Forecast FYP Tuần ( từ ngày thứ Hai tới hết thứ Bảy trong tuần). Tuần ở đây là tuần hiện tại so với ngày hiện tại.
>
> b. Forecast FYP Tháng. Tháng ở đây là tháng hiện tại.
>
> c. Mục Forecast lọc ra các lịch hẹn N3, N2, N1 của các team tính từ ngày hiện tại tới hết tuần, và từ thứ 2 tới thứ 7 các tuần kế tiếp trong tháng dựa trên lịch hẹn đã nhập liệu. Theo quy ước N3: khách hàng quan tâm => RM và IS nhập dựa trên các thông tin KYC của khách hàng đưa ra case size dự kiến (ví dụ 200 triệu đồng). N2 là đã gặp và trình bày giải pháp (ví dụ case size 200 triệu đồng) tới khách hàng. Forecast phải có doanh số dự kiến từ các cá nhân trong team (dựa trên lịch hẹn tương lai). Tổng doanh số Forecast của từng team trong tuần, tháng.
>
> 5. Thêm 1 mục/trường/cột: Hợp đồng hủy (cancelled policy): tổng số HĐ trong kỳ = số HĐ phát hành – số HĐ hủy. Tổng doanh số (FYP) trong 1 kỳ (tuần/tháng/năm) = tổng doanh số HĐ phát hành – doanh số HĐ hủy.
> 6. Thêm 1 mục/trường/cột: Tỷ lệ hủy. Tỷ lệ hủy = tổng số HĐ hủy / tổng số HĐ phát hành (trong kỳ). Ví dụ: trong 1 tuần tổng số HĐ phát hành là 4, có 2 HĐ hủy => tỷ lệ hủy = 2/4 = 50%.

Hai tin thêm cùng ngày, trong lúc chốt cách chia:

> Anh đồng ý, về phần báo cáo: cả báo cáo trên app và báo cáo trên excel phải được mockup trình bày lại cho anh duyệt, phong cách đẳng cấp, chuyên nghiệp.
> Trong mục "Team & nhân sự", tìm RM để có thể tìm nhanh 1 RM. Bên cạnh đó khi click vào 1 RM phải hiện ra danh sách KH mà RM đó đang quản lý (chính là danh sách KH mà RM đã đặt các lịch hẹn từ quá khứ tới hiện tại và các lịch tương lai). Danh sách KH đó cũng có thể click và tự nhảy sang trang thông tin chi tiết về KH đó.

> Ngoài ra trong Mục "Cài đặt" cần thêm icon cho 3 mục nhỏ: Dữ liệu, AI, Thùng rác.

Các câu trả lời khi chốt thiết kế, cùng ngày (câu hỏi ở mục tương ứng):

| Mục | Owner trả lời |
|---|---|
| Cách chia A–F, thứ tự (§2) | "Anh đồng ý" |
| A: đổi tên trong code (§3.1) | "Đổi cả tên trong code", rồi "Duyệt phần A" |
| B: HĐ hủy tính vào kỳ nào (§4.1) | "Ngày hủy" |
| B: tên chỉ số (§4.3) | "Đồng ý nhưng dùng từ Tổng số HĐ (total policies), tương tự Doanh số (Total FYP = Total issued FYP - total cancelled FYP)" |
| C: danh sách KH của một RM (§5) | "RM phụ trách" |
| D: case size của lịch hẹn tương lai (§6.1) | "Mục D anh đồng ý với 1 theo em đề xuất" |
| Kế hoạch, hướng phát triển (§8, §9) | "lên kế hoạch thôi nhé, chưa ra issue, anh sẽ cần sáng tạo, tìm thêm ý tưởng về UI/UX cũng như hướng phát triển app dự kiến sẽ đưa lên MacOS 1 bản song song với bản Windows 11" |
| Bản Mac: triết lý thiết kế, chọn nền tảng (§9) | "Ý tưởng của anh khi app đưa lên MacOS nó phải theo triết lý thiết kế của Mac và hệ sinh thái Apple: nhanh, mượt mà, animation mượt mà, UI/UX ấn tượng, đột phá"; rồi yêu cầu cân nhắc kỹ chung mã Tauri hay viết lại, desktop hay web (nguyên văn: `nen-tang-mac-va-thuong-mai-hoa.md` §0) |
| Phát hành, dữ liệu, bảng ý tưởng (§8, §9.2, §9.4) | "bản Mac phát hành cùng lúc với bản windows"; "chung vì các báo cáo nhập và xuất ra dạng excel, nên làm chung cho tiện"; "có soạn ý tưởng UI/UX" |

## 2. Phạm vi, thứ tự, cổng

- Mọi ý ở §1 làm **trước v1.0**. Owner mở đóng băng code K49 cho đúng các việc này (`PROJECT-STATE.md`, mục 2026-11-10). Mục [sau v1.0] của sổ ghi chú review vẫn để lại (K49), trừ mục Owner kéo vào.
- G7 chờ tới khi Owner dùng thử exe mới có đủ các phần dưới. Dòng nghiệm thu của màn / hành vi đổi được nghiệm thu lại (K46).
- Mỗi phần đi một vòng: thiết kế với Owner → mục spec trong file này → mockup / golden khi phần đó cần → Issue. Owner 10/11 dừng ở mức kế hoạch: Issue chỉ tạo khi Owner bảo, sau vòng ý tưởng UI/UX (§8). Thứ tự làm cả đợt: §10.

| Phần | Ý của Owner (§1) | Cổng | Thứ tự | Trạng thái 10/11 |
|---|---|---|---|---|
| **A.** Đổi RE → RM | 1 | G2, G3 (duyệt cùng phần A), G5 (PR của A6) | 1 | Đã duyệt (§3) |
| **B.** HĐ hủy, tỷ lệ hủy | 5, 6 | G2, G3 | 2 | Nội dung đã duyệt (§4); chờ golden và mockup |
| **C.** Tìm KH, tìm RM; danh sách KH của một RM | 2; tin thêm về "Team & nhân sự" | G3 | 3 | Nội dung đã chốt (§5); chờ mockup |
| **F.** Icon cho 3 mục của Cài đặt | tin thêm về "Cài đặt" | G3, cùng đợt mockup với C | 3 | Chờ mockup (§7.2) |
| **D.** Forecast | 4 | G2, G3 | 4 | Nguồn số tiền đã chốt (§6.1); còn 6 điểm mở (§6.2) |
| **E.** Làm lại Báo cáo trên app và file Excel | 3; tin thêm về "báo cáo" | G3: mockup cả màn Báo cáo lẫn file Excel | 5 | Chờ vòng ý tưởng UI/UX và mockup (§7.1) |

E đi sau B vì bảng mới có cột HĐ hủy và tỷ lệ hủy, và dùng chung phong cách với màn Forecast của D.

## 3. Phần A — Đổi RE → RM (Owner duyệt 10/11/2026)

### 3.1 Quyết định

- "RE" đổi thành **"RM" (Relationship Manager)** ở mọi nơi: giao diện, file Excel, prompt AI, hướng dẫn sử dụng, mockup, từ điển, và **cả code lẫn dữ liệu lưu**. Claude đề xuất giữ tên trong code; Owner chọn "Đổi cả tên trong code", rồi "Duyệt phần A".
- Nghĩa không đổi: RM là người tư vấn, phụ trách KH, cuộc hẹn và HĐ; chỉ RM có chỉ số (ADR-0007). TL / IS / BD / BDM giữ nguyên.

### 3.2 Đổi gì

| Lớp | Đổi | Issue |
|---|---|---|
| Chữ giao diện | Mọi chuỗi trong `vi.ts` có "RE" thành "RM" (≈ 50 chuỗi: góc nhìn, cột, "RM phụ trách", "Theo RM", "3 team × 10 RM", câu lỗi, câu Thùng rác…). File Excel lấy chữ từ `vi.ts` nên đổi theo. | A1 |
| Vai trò lưu | Giá trị vai trò `RE` → `RM` (bảng nhân sự); nguồn ghi chú KYC `RE` → `RM`. Màn Team & nhân sự, hộp nhân sự và danh sách người phối hợp in thẳng giá trị này, nên chữ "RM" ở các chỗ đó hiện từ A2. | A2 |
| Trường, cột | `reId` → `rmId` (KH, cuộc hẹn, HĐ, góc nhìn); cột `re_id` → `rm_id`. | A3 |
| Tên khác trong code | Loại góc nhìn `re` → `rm`; tên hàm, kiểu, component, file (vd. `RePicker` → `RmPicker`, `reOptions`, `teamRes`, `pickRe`); khóa chuỗi i18n; mã lỗi `RE_REQUIRED` → `RM_REQUIRED`; tên test; chú thích; phần chữ và khối codemap của `CLAUDE.md` các package. | A4 |
| Tài liệu | `CONTEXT.md`, `docs/agents/domain.md`, `.claude/rules/i18n-ui.md`, hướng dẫn sử dụng (chữ, chụp lại ảnh), mockup (chỉ nhãn), golden docs trừ `ai-eval.md` (chữ), danh sách nghiệm thu (chỉ thuật ngữ, giữ mã dòng), `e2e/perf/README.md`, phụ lục ADR-0004 / ADR-0007, `docs/README.md`. | A5 |
| AI (G5) | 3 prompt (phân tích, tìm hiểu, trích xuất) đổi "RE (chuyên viên quan hệ khách hàng)" và mọi chữ "RE" khác thành "RM", lên phiên bản mới; bộ lọc chặn V6 ("luật <Tên>") nhận "RM" thay "RE"; chú thích trong `packages/ai`; tài liệu G5 và `docs/golden/ai-eval.md`; chỗ ghi phiên bản prompt ở test của app và ở tài liệu. | A6 |
| Eval AI | Chạy lại eval AI thật (dòng nghiệm thu NT-EV-01) trên prompt mới; tốn credit, Owner bấm (G4). | A7 |

### 3.3 Nâng cấp dữ liệu

- Hai migration mới, do drizzle-kit sinh như các migration trước:
  - **A2:** dựng lại `people` (giá trị vai trò và ba ràng buộc `people_role`, `people_team_required`, `people_team_none`) và `kyc_notes` (giá trị nguồn và ràng buộc `kyc_notes_source`), như 0010. `kyc_notes` chỉ thêm, không sửa / xóa (ADR-0008): bản dựng lại giữ mọi trigger của bảng ở phiên bản trước, như 0008 đã làm cho `ai_analyses`.
  - **A3:** đổi tên cột `re_id` ở `customers`, `appointments`, `policies`.
- File dữ liệu cạnh exe tự nâng ở lần mở đầu tiên, như mọi migration. Backup cũ vẫn nhập được: lệnh nhập dựng DB ở phiên bản của file rồi chạy các migration còn thiếu (`packages/db/src/backup.ts`), nên không cần mã riêng cho định dạng cũ. Exe cũ không mở được file đã nâng (file của app mới hơn), như mọi lần nâng trước.
- Không sửa migration 0000–0012.

### 3.4 Không đổi

- Tài liệu lịch sử: thân ADR, spec các phase (`docs/design/phase-*.md`, trừ file này), báo cáo review, file metrics. "RE" trong các tài liệu đó nghĩa là RM; `CONTEXT.md` ghi rõ. ADR-0004 (Q16) và ADR-0007 thêm phụ lục ngày 10/11/2026.
- Số liệu: golden fixtures chỉ đổi tên trường và giá trị vai trò, **không đổi con số nào** (Owner duyệt G2 cùng phần A).
- Bố cục mockup: chỉ đổi nhãn (Owner duyệt G3 cùng phần A).
- JSON đầu vào / đầu ra đã lưu của các phân tích AI cũ: là lịch sử, không sửa.

### 3.5 Cỡ PR: ngoại lệ cho đổi tên bằng script

A2, A3, A4 là đổi tên hàng loạt theo cùng một mẫu; mỗi PR có thể vượt trần ≈ 800 dòng của một Issue (A3 ước ≈ 900–1 000 dòng). Owner duyệt ngoại lệ cùng phần A:

- Phần đổi tên chạy bằng script Node. Thân PR chép nguyên script và lệnh chạy.
- Phiên review chạy lại script trên base của PR để so với diff.
- Trần cỡ chỉ tính phần viết tay: migration, test của migration, những chỗ script không làm được.

### 3.6 Issue dự kiến (chưa tạo)

| Issue | Nội dung | Rủi ro | Bị chặn bởi |
|---|---|---|---|
| A1 | Chữ giao diện và Excel; test e2e đổi chữ theo | low | — |
| A2 | Vai trò `RM`, nguồn ghi chú KYC `RM`, migration | med | A1 |
| A3 | `rmId` / `rm_id`, migration | med | A2 |
| A4 | Các tên còn lại trong code, codemap | low | A3 |
| A5 | Tài liệu, ảnh hướng dẫn sử dụng | low | A4 (ảnh chụp app đã đổi hết) |
| A6 | Prompt, bộ lọc chặn, tài liệu G5 / eval | med | — (chạy song song A1–A5; chỉ đụng `packages/ai`, tài liệu G5 / eval, chỗ ghi phiên bản prompt) |
| A7 | Eval AI thật NT-EV-01 trên prompt mới | low | A6 |

Kiểm chung của phần A, ở A5 (sau A1–A4):

- Tìm cả từ "RE" (`rg -n -w RE`) và các tên `reId`, `re_id`, `RePicker`… trên `apps/`, `packages/`, `e2e/`, `tools/`: không còn, trừ migration 0000–0012 và chỗ có lý do ghi trong PR (vd. test migration nạp dữ liệu cũ có `RE`).
- File dữ liệu và một file backup tạo bằng exe `5215b2e`, mở / nhập bằng bản mới: đủ nhân sự, KH, lịch hẹn, HĐ, ghi chú KYC; vai trò hiện "RM"; chỉ số Tổng quan của một kỳ bất kỳ không đổi.

## 4. Phần B — HĐ hủy, tỷ lệ hủy (nội dung Owner duyệt 10/11/2026)

### 4.1 Kỳ của một HĐ hủy

HĐ hủy tính vào kỳ chứa **ngày hủy** (Owner chọn "Ngày hủy" giữa hai cách). Ví dụ HĐ phát hành 03/11 (tuần 1), hủy 12/11 (tuần 2), FYP 200 tr: tuần 1 phát hành 1, doanh số +200 tr; tuần 2 hủy 1, doanh số −200 tr; tháng 11 phát hành 1, hủy 1, doanh số 0, tỷ lệ hủy 100%.

- Số của kỳ đã qua không đổi khi có HĐ hủy về sau; mỗi việc tính vào ngày nó xảy ra, như mọi chỉ số khác (ADR-0007).
- Hệ quả đã biết: kỳ ngắn có thể ra tỷ lệ hủy trên 100% hoặc doanh số âm.
- Cách bị bỏ: trừ vào kỳ của ngày phát hành (tỷ lệ luôn ≤ 100%, nhưng số của kỳ đã qua tự đổi về sau).

### 4.2 Trạng thái HĐ

- Đã nộp → Đã phát hành → **Đã hủy**. Chỉ HĐ đã phát hành mới hủy được.
- Ngày hủy không trước ngày phát hành; luật ngày khác như ngày phát hành. FYP hủy bằng FYP phát hành của HĐ, không nhập riêng.
- Bỏ hủy, sửa ngày hủy: trong hộp Sửa của HĐ. Xóa HĐ (xóa mềm) giữ như cũ.
- Hủy không đổi nhóm KH. KH mà mọi HĐ đều đã hủy thì không còn nhãn "Đã có HĐ"; số HĐ trên thẻ KH không đếm HĐ hủy.

### 4.3 Chỉ số (G2)

Tên do Owner chốt: "Tổng số HĐ" (total policies), "Doanh số" (Total FYP).

| Chỉ số | Định nghĩa |
|---|---|
| HĐ phát hành | Giữ nguyên: HĐ có ngày phát hành trong kỳ, kể cả HĐ bị hủy sau đó |
| **HĐ hủy** (mới) | HĐ có ngày hủy trong kỳ |
| **Tổng số HĐ** (mới) | HĐ phát hành − HĐ hủy; có thể âm |
| **FYP phát hành** (mới, tách ra) | Σ FYP phát hành của HĐ phát hành trong kỳ (Total issued FYP; trước đây chính là Doanh số) |
| **FYP hủy** (mới) | Σ FYP phát hành của HĐ hủy trong kỳ (Total cancelled FYP) |
| **Doanh số** (đổi nghĩa) | FYP phát hành − FYP hủy (Total FYP); có thể âm |
| **Tỷ lệ hủy** (mới) | HĐ hủy ÷ HĐ phát hành; kỳ không có HĐ phát hành → "—"; có thể vượt 100%, như Tỉ lệ chốt (golden G11, 150%). Dòng Tổng = Σ hủy ÷ Σ phát hành, không lấy trung bình |
| Tỉ lệ chốt, HĐ nộp, Case size | Giữ nguyên. Tỉ lệ chốt vẫn = HĐ phát hành ÷ RF, chưa trừ hủy: nó đo hiệu quả chốt, Tỷ lệ hủy đo chất lượng |

### 4.4 Hiện ở đâu

- **Hồ sơ KH → Hợp đồng:** nút "Hủy HĐ" trên HĐ đã phát hành; hộp hủy hỏi ngày hủy và báo trước ảnh hưởng chỉ số (vd. "Doanh số tháng 11 của RM X giảm 200 tr"); HĐ hủy có nhãn "Đã hủy {ngày}".
- **Tổng quan:** ô KPI cho số hủy và Tỷ lệ hủy; ô Doanh số ghi FYP phát hành − FYP hủy; so với kỳ trước đảo màu cho chỉ số hủy (tăng là đỏ). Bộ ô cụ thể chốt ở mockup.
- **Báo cáo, Excel (bản hiện tại, trước E):** thêm cột HĐ hủy, Tổng số HĐ, FYP phát hành, FYP hủy, Tỷ lệ hủy; Doanh số thành số thuần. E trình bày lại toàn bộ.
- **Dữ liệu giả lập:** khoảng 5% HĐ phát hành bị hủy trong vòng 21 ngày.

### 4.5 Dữ liệu, golden, mockup

- Cột ngày hủy của `policies` + migration (sau hai migration của A); lệnh hủy / bỏ hủy; luật kiểm khi nhập backup (ngày hủy chỉ có khi đã phát hành, không trước ngày phát hành).
- Golden mới trong `docs/golden/chi-so.md`, Owner duyệt G2 trước khi code: tuần có 4 HĐ phát hành, 2 HĐ hủy → 50% (ví dụ của Owner); phát hành tuần 1, hủy tuần 2 (§4.1); tuần có 1 HĐ phát hành, 2 HĐ hủy → 200%; HĐ hủy rồi bỏ hủy; dòng Tổng của một team.
- Mockup G3: `policy-forms.html` (nút, hộp hủy, nhãn), `overview.html` (ô KPI).
- Cập nhật `docs/design/state-machines.md` (máy trạng thái HĐ).

### 4.6 Issue dự kiến (chưa tạo)

B1 dữ liệu và chỉ số (cột, migration, lệnh, luật backup, hàm chỉ số, golden, dữ liệu giả lập) · B2 hồ sơ KH (nút, hộp hủy, nhãn) · B3 Tổng quan, Báo cáo, Excel. Cả ba sau A4 (không đụng file đang đổi tên).

## 5. Phần C — Tìm KH, tìm RM, danh sách KH của RM (nội dung chốt 10/11/2026)

- **Ô tìm KH** (icon kính lúp) trên màn Khách hàng. Gõ không cần dấu, không phân biệt hoa thường ("nguyen van hu" ra "Nguyễn Văn Hùng"), tìm cả mã KH. Tên bắt đầu bằng chữ đã gõ xếp trước; tối đa khoảng 8 gợi ý, mỗi dòng "Nguyễn Văn Hùng – RM Hoàng Văn Tùng – Sao Mai". Chọn gợi ý → hồ sơ KH. Tìm trong mọi KH, không giới hạn theo góc nhìn. Dùng lại cách so chữ đã có (`searchText` của `domain`).
- **Ô tìm RM** ở Team & nhân sự: gõ tên ra "RM Nguyễn Văn Hùng – Sao Mai". Chọn một RM (từ ô tìm, hoặc bấm tên RM trong danh sách team) → hiện **danh sách KH của RM**; bấm một KH → hồ sơ KH.
- **Danh sách KH của một RM** = KH do RM đó **phụ trách** (RM ghi trên hồ sơ KH), như màn Khách hàng ở góc nhìn RM đó (Owner chọn "RM phụ trách"). Cột: KH, nhóm, lần gặp gần nhất, lịch hẹn sắp tới, số HĐ. Cách bị bỏ: KH có lịch hẹn với RM (khác ở KH chưa có lịch, KH đã chuyển RM, buổi RM khác đi gặp thay).
- Bố cục (chỗ đặt ô tìm, khung danh sách KH của RM) chốt ở mockup G3, cùng đợt với F.
- Issue dự kiến (chưa tạo): C1 tìm KH · C2 tìm RM và danh sách KH của RM.

## 6. Phần D — Forecast

### 6.1 Đã chốt 10/11/2026

- Mục **"Forecast"** mới trên thanh bên, ngay trên Báo cáo; theo góc nhìn (Toàn bộ / Team / RM).
- **Forecast tuần:** lịch hẹn từ hôm nay tới hết thứ Bảy của tuần này (vd. hôm nay 10/11 → 10/11–14/11). **Forecast tháng:** từ hôm nay tới hết tháng, chỉ thứ Hai → thứ Bảy (tháng 11/2026 bỏ Chủ Nhật 15, 22, 29).
- Chỉ lịch hẹn Đã lên lịch, ngày từ hôm nay trở đi, của KH hiện ở N3 / N2 / N1.
- Số tiền là **case size dự kiến của từng lịch hẹn** (Owner chọn cách 1): hộp đặt lịch và hộp dời lịch thêm ô "Case size dự kiến", điền sẵn số gần nhất của KH, sửa được. Lịch đã có trong dữ liệu mà chưa có số thì Forecast đếm và chỉ ra để bổ sung.
- Cộng theo RM, theo team; tổng tuần và tổng tháng của từng team và của góc nhìn.
- Cách bị bỏ: lấy số của lần gặp gần nhất (KH lên N3 bằng sửa tay hay lần gặp để trống thì không có số); một ô case size trên hồ sơ KH (trùng ô ở kết quả cuộc gặp, mất lịch sử ước lượng).

### 6.2 Còn mở (chốt trong vòng ý tưởng / mockup, rồi golden G2)

| # | Câu hỏi | Đề xuất của Claude |
|---|---|---|
| D-a | KH có nhiều lịch trong cùng khoảng | Đếm một lần, lấy số của lịch muộn nhất trong khoảng, để không cộng trùng |
| D-b | Chỉ phần dự kiến, hay thêm "đã đạt + dự kiến" (doanh số đã có từ đầu tuần / tháng cộng phần dự kiến) | Hiện cả hai, số chính là phần dự kiến |
| D-c | Lịch hẹn Chủ Nhật; hôm nay là Chủ Nhật thì Forecast tuần là tuần nào | Không tính Chủ Nhật (đúng chữ "thứ 2 tới thứ 7"); Chủ Nhật thì Forecast tuần là tuần sau |
| D-d | Nhân trọng số theo nhóm (N1 dễ chốt hơn N3) | Không nhân; hiện tách N3 / N2 / N1 để người xem tự cân |
| D-e | Lịch thiếu case size | Đếm, liệt kê để bổ sung; không tính vào tổng |
| D-f | Xuất Excel cho Forecast | Có, cùng phong cách file Excel mới của E |

## 7. Phần E, F (chờ vòng ý tưởng UI/UX)

### 7.1 E — Báo cáo trên app và file Excel

- Owner: trình bày lại "đẳng cấp, chuyên nghiệp"; duyệt mockup **cả** màn Báo cáo **lẫn** file Excel (G3) trước khi làm.
- Hiện trạng (rà trên bản web 10/11): hai bảng 17 cột, phải cuộn ngang; tiêu đề cột gãy 3–4 dòng; không biểu đồ, không ô số lớn.
- Bảng mới có các cột của B; dùng chung phong cách với màn Forecast của D.

### 7.2 F — Icon cho Cài đặt

- Icon cho ba mục Dữ liệu, AI, Thùng rác; cùng đợt mockup với C, kèm icon cho mục Forecast trên thanh bên và icon ô tìm.

## 8. Vòng ý tưởng UI/UX (đề xuất, trước mockup)

Owner 10/11: "anh sẽ cần sáng tạo, tìm thêm ý tưởng về UI/UX". Đề xuất cách làm:

1. **Bảng ý tưởng do Claude soạn:** mỗi ý một thẻ (chuyện hôm nay → ý tưởng → phác thảo nhỏ → công sức ước lượng), theo màn: Tổng quan, Forecast, Báo cáo (app và Excel), Khách hàng và tìm kiếm, hồ sơ KH, Lịch hẹn, Team & RM, Cài đặt; và chung cả app: ô tìm nhanh ở mọi màn (Ctrl / ⌘ + K), phím tắt, nhận diện Heritas, giao diện sáng / tối, cảm giác quen thuộc trên macOS. Tham khảo cách trình bày của các CRM và báo cáo ngân hàng / bảo hiểm (chỉ lấy ý, không chép).
   - Owner 10/11: "có soạn ý tưởng UI/UX". Bảng: `docs/design/mockups/y-tuong-ui-ux.html` (39 ý, 5 demo chạy được, phiếu chọn; 16 ý ⭐ là bộ Claude đề xuất cho v1.0). Chưa phải G3; chờ Owner chọn.
2. **Owner thêm và chọn ý.**
3. **Mockup G3** cho phần được chọn (gồm B, C, D, E, F); **golden G2** cho B và D.
4. **Ra Issue** khi Owner bảo, theo các mục "Issue dự kiến".

## 9. Hướng phát triển: bản macOS song song bản Windows 11 (Owner chọn chung mã Tauri 10/11/2026, thử local trước)

Owner 10/11: app "dự kiến sẽ đưa lên MacOS 1 bản song song với bản Windows 11". Tauri 2 build được cho macOS từ cùng mã nguồn: phần React, `domain`, `db`, `ai` dùng chung; phần khác nằm ở vỏ Rust, đóng gói, CI và vài chữ trên giao diện.

Owner 10/11 sau đó: bản Mac "phải theo triết lý thiết kế của Mac và hệ sinh thái Apple: nhanh, mượt mà, animation mượt mà, UI/UX ấn tượng, đột phá", và yêu cầu cân nhắc kỹ chung mã Tauri hay viết lại cho Mac, desktop hay web khi thương mại hóa. Phân tích đầy đủ, khuyến nghị và điểm xét lại: `docs/design/nen-tang-mac-va-thuong-mai-hoa.md`.

### 9.1 Chỗ đang gắn với Windows (rà 10/11, `main` `de9cde7`)

| # | Chỗ | Hôm nay | Trên macOS cần |
|---|---|---|---|
| M1 | Kho API key AI | Windows Credential Manager (`keyring-core` + `windows-native-keyring-store`, chỉ target Windows) | Keychain: crate kho Apple của cùng hệ `keyring-core` (dependency mới, G4) |
| M2 | Nơi để dữ liệu | `Project2C-data\` cạnh exe (portable, ADR-0006) | App macOS nằm trong gói `.app`, không ghi vào gói được → dữ liệu ở thư mục người dùng (vd. `~/Library/Application Support/…`) hay thư mục Owner chọn; sửa ADR-0006 / ADR-0016 |
| M3 | Mở thư mục, mở chatgpt.com | Gọi `explorer.exe` | Lệnh `open` (Finder, trình duyệt mặc định) |
| M4 | Đóng gói | Exe portable, `bundle.active = false`, icon `.ico` | Bật bundle `.app` / `.dmg`, icon `.icns` |
| M5 | CI | Chỉ `windows-latest` | Thêm job macOS (runner của GitHub, miễn phí cho repo public); chip Apple, có thể thêm Intel |
| M6 | Ký, notarize | Windows: SmartScreen đã nghiệm thu (NT-EX-01) | Không ký: macOS chặn lần mở đầu một bản tải về; từ macOS 15 phải vào Cài đặt hệ thống → Quyền riêng tư & Bảo mật → "Vẫn mở" (không còn mở bằng chuột phải → Open). Bản build ngay trên máy không bị chặn. Ký và notarize: Apple Developer Program, 99 USD / năm (G4) |
| M7 | Phím tắt | Chữ "Ctrl+A / Ctrl+C / Ctrl+V"; chặn tải lại bằng Ctrl+R | ⌘A / ⌘C / ⌘V, ⌘R; menu Edit của macOS để sao chép / dán chạy trong app |
| M8 | Chữ nói về Windows | "exe", Explorer, đường dẫn `backups\` trong giao diện và hướng dẫn | Chữ theo nền tảng; hướng dẫn có phần macOS |
| M9 | Kiểm thử | E2E chạy trên Edge (cùng nhân với WebView2 của Windows) | WebView của macOS là WebKit (như Safari): chạy thêm e2e trên WebKit; nghiệm thu trên Mac thật |
| M10 | Công cụ dev | `tools/bootstrap.ps1`, PowerShell | Không cần nếu vẫn code trên Windows và build bản Mac bằng CI |

### 9.2 Dữ liệu giữa các máy

Hôm nay mỗi máy giữ dữ liệu riêng; đồng bộ (`Project-2C-data`, gộp backup) để sau v1.0 (Owner 11/10/2026). Owner 10/11: Mac và PC **dùng chung một dữ liệu** ("chung vì các báo cáo nhập và xuất ra dạng excel, nên làm chung cho tiện"). Bằng cách nào chưa chốt: backup / khôi phục tay giữa hai máy (đã có, cùng định dạng file), thư mục đồng bộ như OneDrive / iCloud, hay đồng bộ thật; chốt ở ADR "Bản macOS".

### 9.3 Cách làm đề xuất

1. **Thử trên Mac (spike):** build bản macOS chưa ký trên CI, Owner mở trên Mac, ghi các chỗ hỏng. Sửa tối thiểu để chạy được (M2, M3, M4); bản Windows không đổi. Chi tiết: `nen-tang-mac-va-thuong-mai-hoa.md` §9. Owner 10/11 chọn chung mã Tauri: "A quyết định chung mã Tauri như e khuyến nghị, thử trên Mac local trước, nếu không ổn thì tính tiếp".
2. **ADR "Hỗ trợ macOS"** (G1): nơi để dữ liệu, kho key, ký hay không, cách phát hành; G4 cho crate Keychain và (nếu ký) Apple Developer.
3. **Issue chuyển nền tảng** (M1–M9), chạy song song A–F vì chủ yếu đụng vỏ Rust, CI và chữ theo nền tảng.
4. **Phát hành:** v1.0 cho cả hai cùng lúc (Owner 10/11: "bản Mac phát hành cùng lúc với bản windows").

### 9.4 Câu hỏi chờ Owner

- Anh có máy Mac để thử chưa (chip Apple hay Intel, macOS bản nào)? **Đã trả lời 10/11:** MacBook Pro M5 Pro, macOS 27.2+.
- Bản Mac cho riêng anh hay cho cả team? **Một phần 10/11:** trước mắt là app Mac chạy local, song song bản Windows, trước khi nghĩ tới thương mại hóa.
- Phát hành cùng lúc với bản Windows hay sau? **Đã trả lời 10/11:** cùng lúc.
- Có đăng ký Apple Developer (99 USD / năm) để ký và notarize không? **Đã trả lời 10/11:** chưa, có thể làm sau.
- Mac và PC có cần dùng chung một dữ liệu không? **Đã trả lời 10/11:** chung; cách dùng chung chưa chốt (§9.2).
- Thêm 10/11: bản thương mại hóa đa ngôn ngữ, trước mắt tiếng Việt và English.

## 10. Thứ tự đề xuất của cả đợt

1. Vòng ý tưởng UI/UX (§8); thử bản macOS (§9.3 bước 1) chạy song song, khi Owner bảo tạo Issue.
2. Chốt: các điểm mở của D (§6.2), mockup B–F, golden B và D, ADR macOS.
3. Owner bảo "ra issue": A → B → C / F → D → E; Issue macOS chạy song song.
4. Nghiệm thu bản mới trên Windows và Mac (phát hành cùng lúc) → G7 → phát hành v1.0 cho cả hai.
