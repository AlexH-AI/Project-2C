# Spec Phase 6 — Phản hồi dùng thử exe `5215b2e` (G1)

- **Trạng thái:** kế hoạch, **chưa tạo Issue** (Owner 10/11/2026: "lên kế hoạch thôi nhé, chưa ra issue"). Owner duyệt cách chia A–F và thứ tự ngày 10/11/2026 (G1, trong chat ở Home PC). Đã chốt nội dung: **A** (§3; gồm G2 golden fixtures chỉ đổi tên, G3 mockup chỉ đổi nhãn; chữ prompt G5 duyệt trên PR của A6), **B** (§4; golden B và mô hình dữ liệu: Owner duyệt G2 ngày 13/11/2026, T-421; mockup G3 duyệt sau), **C** (§5; bố cục duyệt ở mockup), nguồn số tiền của **D** (§6.1). Còn mở: phần còn lại của D (§6.2), **E** và **F** (§7). Trước mockup và Issue là vòng ý tưởng UI/UX (§8). Hướng làm bản macOS (§9): ADR-0019, Accepted ngày 12/11/2026 (G1, G4, G6). Phần **G** (song ngữ, tiền tệ; §11) Owner thêm 11–12/11; ADR-0018 và golden Owner duyệt G1, G2 ngày 12/11 (T-418).
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
| Bảng ý tưởng, vòng 2 (§8) | "anh muốn em làm lại tất cả ý tưởng và mockup hoàn toàn mới vì em là Fable 5.2" |
| Concept của bảng vòng 2 làm nền cho mockup G3 (§8) | "Có nhưng có lẽ vẫn cần chỉn chu, mượt mà và cách trình bày đẳng cấp hơn nữa, anh vẫn chưa hoàn toàn hài lòng" |

## 2. Phạm vi, thứ tự, cổng

- Mọi ý ở §1 làm **trước v1.0**. Owner mở đóng băng code K49 cho đúng các việc này (`PROJECT-STATE.md`, mục 2026-11-10). Ghi chú OPEN của sổ ghi chú review cũng làm trước v1.0, mỗi mục ở việc mang nhãn đích của nó (Owner quyết 12/11/2026, §12).
- G7 chờ tới khi Owner dùng thử exe mới có đủ các phần dưới. Dòng nghiệm thu của màn / hành vi đổi được nghiệm thu lại (K46).
- Mỗi phần đi một vòng: thiết kế với Owner → mục spec trong file này → mockup / golden khi phần đó cần → Issue. Owner 10/11 dừng ở mức kế hoạch: Issue chỉ tạo khi Owner bảo, sau vòng ý tưởng UI/UX (§8). Thứ tự làm cả đợt: §10.

| Phần | Ý của Owner (§1) | Cổng | Thứ tự | Trạng thái 10/11 |
|---|---|---|---|---|
| **A.** Đổi RE → RM | 1 | G2, G3 (duyệt cùng phần A), G5 (PR của A6) | 1 | Đã duyệt (§3) |
| **B.** HĐ hủy, tỷ lệ hủy | 5, 6 | G2, G3 | 2 | Nội dung đã duyệt (§4); golden B và mô hình dữ liệu: G2 13/11/2026; chờ mockup |
| **C.** Tìm KH, tìm RM; danh sách KH của một RM | 2; tin thêm về "Team & nhân sự" | G3 | 3 | Nội dung đã chốt (§5); chờ mockup |
| **F.** Icon cho 3 mục của Cài đặt | tin thêm về "Cài đặt" | G3: mockup đợt a (vỏ app) | 3 | Owner duyệt G3 ở đợt a ngày 11/11 (§7.2) |
| **D.** Forecast | 4 | G2, G3 | 4 | Nguồn số tiền đã chốt (§6.1); còn 6 điểm mở (§6.2) |
| **E.** Làm lại Báo cáo trên app và file Excel | 3; tin thêm về "báo cáo" | G3: mockup cả màn Báo cáo lẫn file Excel | 5 | Chờ vòng ý tưởng UI/UX và mockup (§7.1) |
| **G.** Song ngữ Việt / Anh, tiền tệ chọn một lần, dấu kiểu Excel | ngoài §1: Owner 11–12/11 | G1, G2 (T-418), G3 (wizard, Cài đặt), G5 (cùng A6) | sau A; dịch làm cuối | ADR-0018 và golden: Owner duyệt G1, G2 ngày 12/11 (§11) |

E đi sau B vì bảng mới có cột HĐ hủy và tỷ lệ hủy, và dùng chung phong cách với màn Forecast của D.

Phần G không nằm trong sáu điểm của §1: Owner thêm ngày 11–12/11 và đưa vào v1.0 ("Đưa vào v1.0"). G chen giữa các phần: cơ chế và cách hiện số làm ngay sau A, các lượt dịch làm sau E (§11.4).

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
  - Bỏ hủy = xóa ngày hủy: HĐ trở lại Đã phát hành, app không giữ dấu vết lần hủy. Đây là đề xuất của Claude, Owner duyệt cùng G2 ngày 13/11/2026. Các luật khác của mô hình dữ liệu: golden `docs/golden/chi-so.md` mục 4.4.
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
| **Tỷ lệ hủy** (mới) | HĐ hủy ÷ HĐ phát hành; kỳ không có HĐ phát hành → "—"; có thể vượt 100%, như Tỷ lệ chốt (golden G11, 150%). Dòng Tổng = Σ hủy ÷ Σ phát hành, không lấy trung bình |
| Tỷ lệ chốt, HĐ nộp, Case size | Giữ nguyên. Tỷ lệ chốt vẫn = HĐ phát hành ÷ RF, chưa trừ hủy: nó đo hiệu quả chốt, Tỷ lệ hủy đo chất lượng |

Cách viết: **"Tỷ lệ hủy"** và **"Tỷ lệ chốt"**, một cách viết cho cả hai chỉ số. Owner chọn ngày 13/11/2026 (câu Q4 của PR #1236, T-421): "Tỷ". Việc đổi chữ "Tỉ lệ chốt" đang có trong app và tài liệu: §4.6.

### 4.4 Hiện ở đâu

- **Hồ sơ KH → Hợp đồng:** nút "Hủy HĐ" trên HĐ đã phát hành; hộp hủy hỏi ngày hủy và báo trước ảnh hưởng chỉ số (vd. "Doanh số tháng 11 của RM X giảm 200 tr"); HĐ hủy có nhãn "Đã hủy {ngày}".
- **Tổng quan:** ô KPI cho số hủy và Tỷ lệ hủy; ô Doanh số ghi FYP phát hành − FYP hủy; so với kỳ trước đảo màu cho chỉ số hủy (tăng là đỏ). Bộ ô cụ thể chốt ở mockup.
- **Báo cáo, Excel (bản hiện tại, trước E):** thêm cột HĐ hủy, Tổng số HĐ, FYP phát hành, FYP hủy, Tỷ lệ hủy; Doanh số thành số thuần. E trình bày lại toàn bộ.
- **Dữ liệu giả lập:** khoảng 5% HĐ phát hành bị hủy trong vòng 21 ngày.

### 4.5 Dữ liệu, golden, mockup

- Cột ngày hủy của `policies` + migration (sau hai migration của A); lệnh hủy / bỏ hủy; luật kiểm khi nhập backup (ngày hủy chỉ có khi đã phát hành, không trước ngày phát hành).
- Golden mới trong `docs/golden/chi-so.md`, Owner duyệt G2 trước khi code: tuần có 4 HĐ phát hành, 2 HĐ hủy → 50% (ví dụ của Owner); phát hành tuần 1, hủy tuần 2 (§4.1); tuần có 1 HĐ phát hành, 2 HĐ hủy → 200%; HĐ hủy rồi bỏ hủy; dòng Tổng của một team.
  - **Golden B** (T-421, #1234; Owner duyệt G2 ngày 13/11/2026, PR #1236: "Duyệt G2 cả ba"): `docs/golden/chi-so.md` mục 4, kịch bản riêng ở năm 2028, dòng G23–G41. Năm ca trên: G27 (4 / 2 → 50%); G23, G24, G25 (§4.1); G28 (1 / 2 → 200%); G36 → G37 (bỏ hủy); G30, G31 (dòng Tổng của team, kiểm cộng ở mục 4.3). Thêm: kỳ có hủy, 0 phát hành (G24, G35); FYP phát hành sửa tay (G28); hủy khác tháng phát hành (G34, G35); hủy rồi xóa mềm (G38); hủy đúng ngày phát hành (G39); Tỷ lệ chốt không trừ hủy (G29, G30, G33). G01–G22 giữ số; cột mới của chúng theo một luật (mục 4.2).
  - Mô hình dữ liệu HĐ hủy: golden mục 4.4 và phụ lục "HĐ hủy" của ADR-0007.
- Mockup G3: `policy-forms.html` (nút, hộp hủy, nhãn), `overview.html` (ô KPI).
- Cập nhật `docs/design/state-machines.md` (máy trạng thái HĐ).

### 4.6 Issue dự kiến (chưa tạo)

B1 dữ liệu và chỉ số (cột, migration, lệnh, luật backup, hàm chỉ số, golden, dữ liệu giả lập) · B2 hồ sơ KH (nút, hộp hủy, nhãn) · B3 Tổng quan, Báo cáo, Excel. Cả ba sau A4 (không đụng file đang đổi tên). Test bắt buộc của B1: G23–G41 và cột mới của G01–G22 (golden B, Owner duyệt G2 ngày 13/11/2026); fixture viết theo "Ghi chú cho B1" ở golden mục 4.4.

Đổi chữ "Tỉ lệ chốt" thành "Tỷ lệ chốt" (Owner chọn "Tỷ" ngày 13/11/2026, §4.3):

- **B3:** chuỗi `overview.kpi.closeRate` (`apps/desktop/src/i18n/vi.ts:987`; Tổng quan, Báo cáo, Excel lấy chữ từ đây), hai test đang so chữ (`e2e/overview.spec.ts:36`, `apps/desktop/src/routes/reports/report-workbook.test.ts:122`) và chú thích code.
- **A5**, cùng script đổi chữ của tài liệu: mockup, golden (cả chữ "Tỉ lệ > 100%" ở ô G11, G20 của `chi-so.md`), bảng thuật ngữ §11.6. `CONTEXT.md` và golden B đã viết "Tỷ" từ T-421. Tài liệu lịch sử (§3.4) và lời Owner nguyên văn giữ nguyên.

## 5. Phần C — Tìm KH, tìm RM, danh sách KH của RM (nội dung chốt 10/11/2026)

- **Ô tìm KH** (icon kính lúp) trên màn Khách hàng. Gõ không cần dấu, không phân biệt hoa thường ("nguyen van hu" ra "Nguyễn Văn Hùng"), tìm cả mã KH. Tên bắt đầu bằng chữ đã gõ xếp trước; tối đa khoảng 8 gợi ý, mỗi dòng "Nguyễn Văn Hùng – RM Hoàng Văn Tùng – Sao Mai". Chọn gợi ý → hồ sơ KH. Tìm trong mọi KH, không giới hạn theo góc nhìn. Dùng lại cách so chữ đã có (`searchText` của `domain`).
- **Ô tìm RM** ở Team & nhân sự: gõ tên ra "RM Nguyễn Văn Hùng – Sao Mai". Chọn một RM (từ ô tìm, hoặc bấm tên RM trong danh sách team) → hiện **danh sách KH của RM**; bấm một KH → hồ sơ KH.
- **Danh sách KH của một RM** = KH do RM đó **phụ trách** (RM ghi trên hồ sơ KH), như màn Khách hàng ở góc nhìn RM đó (Owner chọn "RM phụ trách"). Cột: KH, nhóm, lần gặp gần nhất, lịch hẹn sắp tới, số HĐ. Cách bị bỏ: KH có lịch hẹn với RM (khác ở KH chưa có lịch, KH đã chuyển RM, buổi RM khác đi gặp thay).
- Bố cục (chỗ đặt ô tìm, khung danh sách KH của RM) chốt ở mockup G3 đợt b. Mockup đợt b (`docs/design/mockups/search-rm-team.html`, T-417 #1217, Owner duyệt G3 12/11/2026) vẽ phần này: ô tìm KH ở màn Khách hàng và ô lệnh ⌘K / Ctrl K, ô tìm RM ở Team & nhân sự, trang RM có danh sách KH phụ trách (gạch "Mockup đợt b" ở §8).
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
| D-a | KH có nhiều lịch trong cùng khoảng | **Đã chốt 11/11/2026**, Owner: "Tính 1 lần, doanh số FC dựa trên số gần nhất nhập liệu vì có thể đó là điều chỉnh theo nhu cầu của KH". Mỗi KH tính một lần; số tiền là case size dự kiến **được nhập (hay sửa) gần nhất** trong các lịch Đã lên lịch của KH đó nằm trong khoảng, không phải số của lịch có ngày muộn nhất (đề xuất cũ của Claude). Cách hiểu của Claude, xác nhận ở mockup Forecast và golden G2: so theo thời điểm nhập / sửa ô case size của từng lịch (cần lưu thời điểm này: dữ liệu, G2); số tiền nằm ở ngày của lịch mang số đó, các lịch còn lại của KH vẫn hiện kèm ghi chú; hai số nhập cùng lúc thì lấy lịch có ngày muộn hơn; lịch thiếu case size không tham gia so. |
| D-b | Chỉ phần dự kiến, hay thêm "đã đạt + dự kiến" (doanh số đã có từ đầu tuần / tháng cộng phần dự kiến) | **Đã chốt 11/11/2026**, Owner: "FC hiện dự kiến, đã đạt so với dự kiến, thêm cả chỉ tiêu (KPI) của tổng các team và từng team cũng có KPI riêng (tự nhập liệu số KPI đầu tháng)". Forecast hiện ba số cạnh nhau để so: **dự kiến**, **đã đạt**, **KPI**; KPI có ở cấp tổng các team và ở từng team, do người dùng nhập đầu tháng (khớp các quyết định về mục tiêu doanh số ở §8: theo team, toàn bộ = tổng các team, chỉ theo tháng). Bản thử: số lớn là phần dự kiến; đường băng tháng = đã đạt + dự kiến, có vạch KPI, phần trăm về đích, số còn thiếu; bảng Team → RM thêm cột "Đã đạt" và cột "KPI · về đích" (dòng RM không có KPI). Cách hiểu của Claude, xác nhận ở mockup Forecast: "đã đạt so với dự kiến" là đặt đã đạt cạnh dự kiến (và cộng lại thành số về đích), không phải so đã đạt với một bản Forecast chụp từ đầu kỳ. Thuật ngữ: Owner gọi mục tiêu doanh số là "chỉ tiêu (KPI)"; bảng dùng nhãn "KPI tháng". Trong code, chữ KPI hiện chỉ các ô chỉ số của Tổng quan (chú thích, không phải nhãn UI): khi ra Issue ghi nghĩa mới vào `CONTEXT.md`. |
| D-c | Lịch hẹn Chủ Nhật; hôm nay là Chủ Nhật thì Forecast tuần là tuần nào | **Đã chốt 11/11/2026**, Owner: "CN là ngày nghỉ, có thể đưa vào lịch của tuần nhưng data giả lập sẽ không có lịch hẹn. Nếu có trường hợp ngoại lệ hẹn vào CN thì user/owner nhập bù vào thứ 7 tuần đó. Em có thể bỏ CN". Forecast không tính Chủ Nhật; dải tuần và lưới tháng chỉ có thứ Hai → thứ Bảy. Buổi hẹn ngoại lệ vào Chủ Nhật do người dùng nhập vào thứ Bảy của tuần đó; dữ liệu giả lập không có lịch Chủ Nhật. Hôm nay là Chủ Nhật thì Forecast tuần lấy tuần sau: đề xuất của Claude nằm trong câu hỏi, Owner không phản đối, xác nhận ở mockup Forecast. Chưa hỏi, không đổi ở đây: hộp đặt lịch có chặn hay nhắc khi chọn Chủ Nhật hay không (hiện không chặn). |
| D-d | Nhân trọng số theo nhóm (N1 dễ chốt hơn N3) | **Đã chốt 11/11/2026**, Owner: "Không nhân". Forecast cộng thẳng case size dự kiến của từng lịch, không nhân hệ số (tỷ lệ chốt ước tính của từng nhóm); màn hiện tách N3 / N2 / N1 để người xem tự cân. |
| D-e | Lịch thiếu case size | **Đã chốt 11/11/2026**, Owner: "case size FC là owner/user nhập, không dùng AI hay thuật toán tự tính tỉ lệ". Mọi số tiền trong Forecast là số người dùng nhập; app không dùng AI hay thuật toán để ước tính case size hay tỷ lệ. Lịch thiếu case size: đếm, liệt kê để người dùng điền (điền tại chỗ trong Forecast), không cộng vào tổng. Ô "Case size dự kiến" điền sẵn số gần nhất của KH trong hộp đặt / dời lịch (§6.1, Owner 10/11) giữ nguyên: đó là gợi ý người dùng thấy và sửa được trước khi lưu, không phải số app tự đưa vào Forecast. |
| D-f | Xuất Excel cho Forecast | **Đã chốt 11/11/2026**, Owner: "Có xuất Excel". Forecast có nút xuất Excel và một sheet "Forecast" trong file Excel mới của E, cùng phong cách và màu logo (§8, điểm 8); bố cục sheet duyệt ở mockup Báo cáo + Excel. |

## 7. Phần E, F (chờ vòng ý tưởng UI/UX)

### 7.1 E — Báo cáo trên app và file Excel

- Owner: trình bày lại "đẳng cấp, chuyên nghiệp"; duyệt mockup **cả** màn Báo cáo **lẫn** file Excel (G3) trước khi làm.
- Hiện trạng (rà trên bản web 10/11): hai bảng 17 cột, phải cuộn ngang; tiêu đề cột gãy 3–4 dòng; không biểu đồ, không ô số lớn.
- Bảng mới có các cột của B; dùng chung phong cách với màn Forecast của D.

### 7.2 F — Icon cho Cài đặt

- Icon cho ba mục Dữ liệu, AI, Thùng rác, kèm icon cho mục Forecast trên thanh bên và icon ô tìm. Vẽ ở mockup đợt a (vỏ app, `docs/design/mockups/app-shell.html`), Owner duyệt G3 ngày 11/11/2026, chọn ô màu cho ba icon Cài đặt ("Kiểu A ô màu", §8 gạch "G3 đợt a"); C vẽ ở đợt b.

## 8. Vòng ý tưởng UI/UX (đề xuất, trước mockup)

Owner 10/11: "anh sẽ cần sáng tạo, tìm thêm ý tưởng về UI/UX". Đề xuất cách làm:

1. **Bảng ý tưởng do Claude soạn:** mỗi ý một thẻ (chuyện hôm nay → ý tưởng → phác thảo nhỏ → công sức ước lượng), theo màn: Tổng quan, Forecast, Báo cáo (app và Excel), Khách hàng và tìm kiếm, hồ sơ KH, Lịch hẹn, Team & RM, Cài đặt; và chung cả app: ô tìm nhanh ở mọi màn (Ctrl / ⌘ + K), phím tắt, nhận diện Heritas, giao diện sáng / tối, cảm giác quen thuộc trên macOS. Tham khảo cách trình bày của các CRM và báo cáo ngân hàng / bảo hiểm (chỉ lấy ý, không chép).
   - Owner 10/11: "có soạn ý tưởng UI/UX". Bảng vòng 1 (39 ý, 5 demo, 16 ý ⭐; commit `fe4aef9` của PR #1211): Owner chưa chọn, cùng ngày yêu cầu làm lại từ đầu: "anh muốn em làm lại tất cả ý tưởng và mockup hoàn toàn mới vì em là Fable 5.2".
   - **Bảng vòng 2** thay bảng vòng 1, cùng đường dẫn: `docs/design/mockups/y-tuong-ui-ux.html` (kèm `.css`, `.js`). Không còn là các thẻ rời: một concept chung, xem bằng một cửa sổ app bấm được (9 màn; macOS và Windows 11; font hệ thống và Be Vietnam Pro; bản đầu có cả giao diện Sáng, nay chỉ Tối), rồi tới các ý đánh số (bản đầu 32 ý, 23 ý ⭐ là bộ Claude đề xuất cho v1.0; hai ý 33, 34 thêm theo ghi chú của Owner; sau các câu trả lời 11/11: 34 ý, 27 ý ⭐ (ý 08 "Bỏ nút Lọc" vào bộ ⭐ sau khi Owner chốt), ý 04, 30, 31 để sau v1.0), phiếu chọn, phòng thử chuyển động, mẫu file Excel 4 sheet. Concept: ba lớp Nền · Kính · Tiêu điểm; mỗi hệ điều hành một chất; bốn động tác chuyển động (Hiện, Mở, Trượt, Đếm). Các quyết định A–F (§3–§7) giữ nguyên; số trong bản thử theo đúng định nghĩa của B và D.
   - Mười điểm đổi hướng giao diện hoặc mở lại điều Owner đã duyệt nằm ở mục `#ask` của bảng (lấy concept làm nền cho G3; font hệ thống; giao diện Sáng; logo gọn trên thanh bên, mở lại G3 27/10; bỏ nút "Lọc", mở lại G3 03/10; token mới và phụ lục ADR-0013; luật "Điểm nhấn" (G2); màu file Excel; các màn đã duyệt G3 khác chỉ thay vỏ; 6 điểm mở của Forecast §6.2). Chưa phải G3. Owner đã chọn ý và trả lời từng điểm ngày 10 – 11/11/2026 (các mục dưới); mục `#ask` nay 14 điểm.
   - Owner 10/11, sau bản đầu của bảng vòng 2: nhận hướng concept ("Có") nhưng chưa hài lòng về độ hoàn thiện: "vẫn cần chỉn chu, mượt mà và cách trình bày đẳng cấp hơn nữa". Bảng được nâng chất ngay trong PR #1211: màn đầu là cửa sổ app trên nền desktop, không co giãn; thanh bên kính thấy nền; màn đổi tức thì (đo trong khung xem thử 60 Hz: không rớt khung khi đổi màn); chữ số lăn, nút và viên chọn trượt, thẻ nở thành trang rồi thu về; phần dưới trình bày kiểu bài giới thiệu. Mức này là mức tối thiểu cho mockup G3 và cho code sau này.
   - Owner 10/11, sau bản nâng chất: "Anh thấy là khá ổn rồi", kèm các ghi chú dưới đây (nguyên văn), đã đưa vào bảng (lúc đó 34 ý, 25 ý ⭐, mục `#ask` 13 điểm; số hiện nay ghi ở hai gạch phía trên):

     > * Trong mục "Team & nhân sự": tên team có thể customize khi tạo ví dụ chọn màu cho chữ, icon bên cạnh tên team. TL (team leader) cần được in đậm, ngang hàng, font chữ to tương tự với tên team (đây là team leader mà, phải có sự nổi bật cho người đứng đầu).
     > * Tương tự với các con số briefing ngay bên dưới như Doanh số - số HĐ - Forecast tuần cần được in đậm, có thể dùng màu champagne, nâng cỡ font size lên phù hợp
     > * Mục "Cài đặt" - AI: nhà cung cấp cần được mở rộng hơn với 1 số nền tảng ví dụ thêm Workbuddy. Model chọn, mức reasoning (cao).
     > * Mục "Báo cáo" cách trình bày đã ổn, tốt hơn nhưng cần chi tiết hơn và có thể lọc chọn báo cáo các kỳ: tuần/tháng hiện tại và các kỳ tuần/tháng/năm trước đây.
     > * Ở Mục "Forecast" khi click vào 1 ô ngày đang hiển thị doanh số FC và số lịch hiện tại chưa chuyển tới 1 trang cụ thể 2 lịch đó là gì, gặp KH nào của RM nào, và cũng có thể click vào KH đó để xem các thông tin.
     > * Còn lại các mục khác anh thấy ổn.
     > * Về spotlight background hình nền với các tông màu biến thể ví dụ ở 2 góc trái dưới và phải trên anh chưa thấy vừa ý lắm, cần đưa thêm ý tưởng để chọn cách trình bày.

     Hệ quả cho các phần, chốt ở mockup G3 và các cổng liên quan:
     - **Team (mở rộng phần C; ý 33):** team có màu và icon chọn khi tạo, sửa được; TL ngang hàng tên team, cùng cỡ chữ đậm; ba số tóm tắt (Doanh số, Số HĐ, Forecast tuần) đậm, màu champagne. Màu và icon là dữ liệu mới của team: **G2** (mô hình dữ liệu), thêm cột + migration khi ra Issue.
     - **Cài đặt → AI (ý 34):** nhiều nhà cung cấp (thêm WorkBuddy cạnh OpenCode), chọn model theo nhà cung cấp, mức suy luận Mặc định / Thấp / Vừa / Cao. Model và mức suy luận đã có ở mockup `ai.html` đã duyệt; nhà cung cấp mới là dịch vụ mới: **G4** (dịch vụ, chi phí), **G5** (chạy lại bộ đánh giá trên model đó), **G6** (nơi lưu key). Lúc ghi dòng này chưa kiểm WorkBuddy có API cho app ngoài gọi hay không; đã kiểm 11/11/2026 và Owner chốt WorkBuddy theo kiểu chép – dán, không qua G4 / G6 (xem điểm 13 bên dưới).
     - **Báo cáo (phần E; ý 21, 22):** Bản tin thành ba trang (tóm tắt; chi tiết từng RM và danh sách HĐ hủy; lịch hẹn, KH theo nhóm, định nghĩa); chọn kỳ tuần / tháng / năm, kỳ đang chạy và các kỳ trước, bằng bộ chọn kỳ dùng chung (ADR-0013 §4). Kỳ đang chạy so với cùng số ngày của kỳ trước; kỳ đã xong so với cả kỳ liền trước (cần xác nhận ở G2 của B).
     - **Forecast (phần D; ý 18, 19):** bấm một ngày (ô của lưới tháng, tên ngày của dải tuần) ra danh sách lịch của ngày đó: giờ, KH, nhóm, RM, team, case size; bấm một dòng mở hồ sơ KH, nút quay lại về Forecast.
     - **Nền của trang trình bày:** năm phương án ở thanh dưới cửa sổ (Hoàng hôn, Studio, Champagne, Lưới, Heritas); chỉ là nền của bảng và ảnh giới thiệu, không phải giao diện app. Lần đầu năm kiểu chỉ là năm chấm không nhãn trên thanh dưới nên Owner không tìm thấy; đã thêm mục "Nền" ngay dưới màn đầu, có tên và hình thử. **Owner chọn 11/11/2026:** "Anh chọn mẫu cuối: nền Heritas tree" (kiểu 5: cây của logo in chìm trên nền navy, ánh vàng nhẹ). Kiểu này là mặc định của bảng; bốn kiểu kia giữ lại để so.
     - Owner yêu cầu Claude tự rà "liệu có thể còn làm gì khác tốt hơn không" và nêu khuyến nghị: các khuyến nghị nêu trong chat cùng ngày; mục nào Owner nhận thì ghi vào đây.
   - **Các điểm `#ask` Owner đã chốt** (số theo mục `#ask` của bảng):
     - **1. Concept làm nền cho mockup G3:** nhận, 10/11/2026 ("Có …", rồi "Anh thấy là khá ổn rồi").
     - **2. Chữ giao diện:** 11/11/2026, "Font hệ thống". Chữ giao diện dùng font của từng nền tảng: SF Pro trên macOS, Segoe UI Variable trên Windows 11 (Segoe UI trên máy không có bản Variable); Playfair Display vẫn chỉ cho slogan. Đây là đổi ADR-0013 §2 (Be Vietnam Pro): phụ lục ADR-0013 soạn cùng mockup đợt đầu (vỏ app) để Owner duyệt. Khi ra Issue: bỏ file font Be Vietnam Pro nhúng trong app, kiểm dấu tiếng Việt và độ rộng cột số trên cả hai font.
     - **3. Giao diện Sáng:** 11/11/2026, "Giao diện sáng để sau v1.0, hiện tại chỉ cần Dark Mode." v1.0 chỉ có giao diện tối; công tắc Sáng đã bỏ khỏi bảng, ý 04 chuyển sang nhóm "Để sau v1.0". Bản in / PDF của Báo cáo dùng giấy sáng là đề xuất của Claude, Owner chưa nói riêng: chốt ở mockup Báo cáo. Owner chốt sau đó, 11/11/2026: "In giấy sáng" (gạch "Owner 11/11/2026, sau khi PR #1211 bỏ nháp" bên dưới).
     - **4. Logo trên thanh bên:** 11/11/2026, "Dùng logo gọn". Thanh bên dùng cụm logo ngang (cây + chữ Heritas), slogan chuyển xuống chân thanh bên; thay khối logo dọc đã duyệt G3 27/10/2026. Quyết định này chỉ nói về thanh bên; vẽ ở mockup vỏ app (đợt a) để Owner duyệt G3.
     - **5. Nút "Lọc":** 11/11/2026, "Bỏ nút Lọc". Đổi kỳ hay góc nhìn (Toàn bộ / team) là số cập nhật ngay, không còn nút "Lọc" để áp dụng; thay điều đã duyệt G3 03/10/2026. Vẽ ở các mockup có thanh chọn kỳ / góc nhìn (Tổng quan, Báo cáo, Forecast) để Owner duyệt G3.
     - **6. Token mới:** soạn ở mockup đợt a (T-416 #1212): khối B của `docs/design/mockups/ui2.css`, bảng ở `components.html#tokens`, phụ lục 11/11/2026 của ADR-0013 (font hệ thống, lớp chất liệu theo hệ điều hành, bo góc, bóng, token chuyển động, `--accent-fill`). Owner duyệt G3 ngày 11/11/2026 ("Duyệt", câu cuối của 16 điểm đợt a); chưa token nào vào app.
     - **7. "Điểm nhấn" và câu nhận xét của Bản tin:** 11/11/2026, "Làm, theo luật". App viết các câu từ số theo luật cố định, không gọi AI; mỗi câu bấm được để tới nơi liên quan. Bản thử có bốn luật (tỷ lệ hủy tăng / giảm so với kỳ trước; team dẫn đầu doanh số hoặc thứ hạng của team đang xem; buổi hẹn đã qua chưa ghi kết quả; Forecast tuần này). Claude đề xuất thêm hai (về đích so với mục tiêu tháng; lịch hẹn thiếu case size chưa tính vào Forecast). Bộ luật là nội dung mới (**G2**): từng luật, ngưỡng và câu mẫu viết ở mockup Tổng quan (đợt c) để Owner duyệt; Owner mới chốt việc làm và cách làm, chưa duyệt từng luật.
     - **8. Màu file Excel:** 11/11/2026, "Dùng màu logo". File Excel dùng xanh navy và vàng champagne của logo trên nền trắng (dòng tiêu đề, dòng Tổng, đường kẻ nhấn, thanh dữ liệu), như mẫu ở mục "File Excel" của bảng. Mã màu cụ thể và bố cục từng sheet duyệt ở mockup Báo cáo + Excel (đợt e).
     - **9. Các màn đã duyệt G3 khác** (Lịch hẹn, hồ sơ KH, KYC, các hộp thoại): 11/11/2026, "Giữ bố cục". Bố cục và nội dung các mockup đã duyệt G3 giữ nguyên; các màn này chỉ nhận vỏ mới (chất liệu, chữ hệ thống, bo góc, chuyển động) qua token và bộ khung chung, không vẽ mockup riêng. Mockup vỏ app (đợt a) kèm một hình Lịch hẹn và một hộp thoại trong vỏ mới để Owner xem trước; màn nào không ổn trong vỏ mới thì nêu riêng màn đó.
     - **10. Forecast, D-a:** 11/11/2026, mỗi KH tính một lần theo số case size nhập gần nhất (nguyên văn và cách hiểu ở §6.2). **D-b:** 11/11/2026, Forecast hiện dự kiến, đã đạt và KPI của tổng các team và của từng team (§6.2). **D-c:** 11/11/2026, bỏ Chủ Nhật; buổi hẹn ngoại lệ vào Chủ Nhật nhập vào thứ Bảy tuần đó (§6.2). **D-d:** 11/11/2026, không nhân hệ số theo nhóm (§6.2). **D-e:** 11/11/2026, case size của Forecast do người dùng nhập, không AI hay thuật toán; lịch thiếu số không cộng (§6.2). **D-f:** 11/11/2026, có xuất Excel (§6.2). Cả sáu điểm D-a … D-f đã chốt; phần nào ghi "cách hiểu của Claude" thì xác nhận ở mockup Forecast, rồi golden G2.
     - **11. Nền của trang trình bày:** 11/11/2026, kiểu 5 "Heritas" (ghi ở trên).
     - **12. Team có màu và icon:** Owner làm rõ 11/11/2026: "Màu chữ tên team và icon là tùy chọn khi tạo, không phải bắt buộc. Baseline là đã ổn rồi." Team không chọn thì dùng kiểu mặc định (tên màu chữ thường, icon team chung); hai trường dữ liệu để trống được.
     - **13. Nhiều nhà cung cấp AI:** 11/11/2026, "Kiểm API trước": chưa vẽ mockup Cài đặt → AI; kiểm WorkBuddy có API cho app ngoài gọi hay không rồi mới quyết. **Kết quả tra cứu 11/11/2026 (Claude, tra web, chưa thử trên máy):** tài liệu chính thức `workbuddy.ai/docs` (mục Model Configuration, Subscription, Credits, Platform Integration) không có trang nào về developer API, API key do WorkBuddy cấp hay SDK; credit được mô tả là đơn vị tiêu dùng cho thao tác AI trong WorkBuddy. WorkBuddy là app *dùng* model: mục cấu hình model của nó nhận endpoint tương thích OpenAI của nhà cung cấp khác (tài liệu tích hợp của DeepSeek và Tencent Cloud). Đường duy nhất tìm thấy để app ngoài gọi là một proxy không chính thức trên PyPI (`workbuddy2api`) dùng lại phiên đăng nhập của người dùng, tự ghi "chỉ để học tập, nghiên cứu": không dùng được (điều khoản dịch vụ, G6, và quy tắc không phiên Claude nào đọc hay lưu token của app này). Chưa xem phần tài liệu IDE / CLI / Enterprise của WorkBuddy. Kết luận tạm: WorkBuddy không làm nhà cung cấp AI của app được; muốn dùng model như trong WorkBuddy thì nối thẳng API của hãng làm model (ví dụ DeepSeek) bằng key riêng, mỗi nhà cung cấp qua G4 / G5 / G6. **Owner chốt cùng ngày:** "Nếu không thích hợp được thì xử lý giống với ChatGPT, xuất prompt để user copy rồi paste vào workbuddy, rồi copy lại câu trả lời về app". WorkBuddy thành nhà cung cấp kiểu chép – dán như ChatGPT web (spec Phase 5 §3.1): app chép prompt, người dùng dán vào app WorkBuddy, rồi dán câu trả lời về; không có key, app không gọi dịch vụ nào; model và mức suy luận chọn trong WorkBuddy. Đánh giá của Claude, chốt khi ra Issue: không qua G4 / G6 (không dịch vụ, không key), vẫn qua G5 (câu trả lời dán về đi qua cùng bộ kiểm của ChatGPT web; chạy bộ đánh giá với model dùng trong WorkBuddy; lời nhắn "app không gửi gì ra ngoài, bạn tự dán dữ kiện KYC" áp dụng như ChatGPT web). Chọn model và mức suy luận trong app chỉ còn áp dụng cho nhà cung cấp gọi qua API (OpenCode).
   - **Danh sách ý Owner chọn (11/11/2026, "Lấy bộ ⭐"):** 27 ý có ⭐ của bảng là danh sách vẽ mockup G3: 01, 02, 03, 05, 06, 07, 08, 09, 11, 12, 14, 15, 16, 17, 18, 19, 20, 32, 21, 22, 23, 25, 27, 28, 33, 29, 34 (tên và nội dung từng ý ở mục "34 ý" của bảng). Ngoài danh sách: 10 (ô lệnh trả lời bằng số), 13 (menu và phím tắt của hệ điều hành), 24 (trình chiếu), 26 (xem nhanh bằng phím cách): để sau, không vẽ mockup ở vòng này; 04, 30, 31: sau v1.0. Claude xếp các ý vào bảy đợt mockup (mỗi đợt một Issue docs + một PR docs-only): **a** vỏ app hai nền tảng (01, 02, 03, 05, 12, 29, token mới của điểm 6 + phụ lục ADR-0013, kèm một hình Lịch hẹn và một hộp thoại trong vỏ mới) · **b** ô lệnh, tìm KH, trang RM, Team & nhân sự (09, 11, 25, 27, 33) · **c** Tổng quan (08, 14, 15, 16) · **d** Forecast (17, 18, 19, 20, 32) · **e** Báo cáo trong app và file Excel (21, 22, 23) · **f** hộp hủy HĐ + nhãn "Đã hủy" (28) · **g** hệ chuyển động (06, 07). Ý 34 (Cài đặt → AI) không nằm trong bảy đợt: khung đã có trong bảng, vẽ mockup khi Owner yêu cầu. Chưa tạo Issue code (Owner 10/11: "chưa ra issue").
   - **Mục tiêu doanh số (ý 32, vào phạm vi):** Owner 11/11/2026: "Mục tiêu doanh số là trường nhập thêm để FC có cột mốc so sánh". Bản thử: mỗi team một ô mục tiêu tháng trong hộp tạo / sửa team; đường băng của Forecast có vạch mục tiêu, phần trăm về đích, số còn thiếu; thẻ team ghi đã đạt bao nhiêu phần trăm. Dữ liệu mới: **G2**. Owner chốt cấp đặt mục tiêu 11/11/2026: "Mục tiêu doanh số là chỉ tiêu từng team và toàn bộ": mục tiêu có ở cấp team và cấp toàn bộ, không đặt tới từng RM (trang RM không có mốc riêng). Mục tiêu toàn bộ, Owner cùng ngày: "Tổng các team": bằng tổng mục tiêu các team, không có ô nhập riêng. Bản thử chỉ hiện mục tiêu toàn bộ khi mọi team đã có mục tiêu (đề xuất của Claude, chốt ở mockup Forecast). Kỳ của mục tiêu, Owner cùng ngày: "Chỉ theo tháng": chỉ nhập mục tiêu tháng, không có ô mục tiêu tuần. Bản thử ghi thêm "nhịp cần mỗi tuần" trên đường băng = (mục tiêu tháng − đã đạt) ÷ số tuần còn lại của tháng (tính theo ngày thứ Hai → thứ Bảy còn lại ÷ 6), cạnh Forecast tuần này; là đề xuất của Claude nêu trong câu hỏi, Owner duyệt ở mockup Forecast. Còn mở: kỳ chưa có mục tiêu thì Forecast hiện gì (bản thử: "chưa đặt mục tiêu").
   - **Owner 11/11/2026, sau khi PR #1211 bỏ nháp** (trả lời trong chat, nguyên văn trong ngoặc kép; ghi vào repo ở PR của T-416 #1212):
     - Bảng thành phần dùng chung trong đợt a: "Có, kèm bảng". Đợt a vẽ thêm một bảng thành phần (nút, ô nhập, ô chọn, thẻ, bảng số, hộp thoại, nhãn trạng thái, thông báo nổi) trên cả hai hệ điều hành; các mockup đợt b–g ghép từ bảng này.
     - Thử trên Safari / máy Mac thật: "Anh chưa có Macbook ở đây nên cứ làm trước, để bước thử đó sau". Mỗi mockup ghi "chưa kiểm trên Safari"; kiểm khi có bản build Mac (T-413).
     - Tổng quan đổi kỳ: "Kỳ đã qua thì chỉ hiện các chỉ số thực tế đã đạt về doanh số, số HĐ, tỉ lệ hủy, tỉ lệ chốt... không tính forecast vì forecast là cho tương lai". Kỳ đã qua không có phần dự kiến; vẽ ở đợt c.
     - Trạng thái trống và lỗi trong mỗi mockup: "Có, vẽ kèm". Kiểu chung của hai trạng thái nằm ở bảng thành phần; mỗi mockup vẽ trạng thái trống và lỗi của màn đó. Không vẽ trạng thái "đang tải".
     - Trang "Xu hướng" 6 kỳ gần nhất trong Bản tin của Báo cáo (ý mới 35): "Thêm vào Báo cáo". Vẽ ở đợt e.
     - Nút che tên KH khi chiếu màn hình (ý mới 36): "Làm trong v1.0". Claude đề xuất để sau v1.0; Owner chọn làm. Vẽ ở đợt a.
     - Bản in / PDF của Báo cáo: "In giấy sáng". Vẽ ở đợt e; app vẫn chỉ có giao diện tối.
   - **Hai ý thêm vào danh sách (11/11/2026):** **35** trang "Xu hướng" 6 kỳ gần nhất trong Bản tin của Báo cáo (đợt e); **36** nút che tên KH khi chiếu màn hình (đợt a). Danh sách vẽ mockup G3 nay 29 ý: 27 ý ⭐ của bảng và hai ý này (hai ý chưa có thẻ trên bảng ý tưởng). Đợt **a** nay gồm: 01, 02, 03, 05, 12, 29, 36, bảng thành phần, token mới + phụ lục ADR-0013, hai hình xem trước; đợt **e** thêm 35.
   - **Mockup đợt a (T-416 #1212, Owner duyệt G3 ngày 11/11/2026, xem gạch "G3 đợt a" dưới đây):** `docs/design/mockups/app-shell.html` (vỏ app trên macOS và Windows 11: cửa sổ bấm được, thanh bên logo gọn và slogan ở chân, icon cho mọi mục kể cả Forecast và ba mục Cài đặt, cụm góc nhìn + kỳ không có nút "Lọc", nút che tên KH, màn Lịch hẹn và hộp "Lịch hẹn mới" đã duyệt trong vỏ mới) và `components.html` (mười thành phần trên hai hệ điều hành, token mới, bảng tương phản); stylesheet chung của cả bảy đợt là `ui2.css` (+ `ui2.js`). Nút che tên (Owner duyệt ở điểm 6–8 của gạch "G3 đợt a" dưới đây): nút nằm trên thanh công cụ; tên KH hiện thành chữ cái đầu ("Nguyễn Văn Hùng" → "N. V. H."), mã KH giữ nguyên; chữ người dùng tự gõ có thể chứa tên (ghi chú, mô tả trigger) ẩn thành "•••"; trạng thái được nhớ qua lần mở app sau; file Excel, bản in và backup luôn ghi tên đầy đủ. Quy ước cho mockup các đợt sau: chỗ hiện tên KH viết `<span class="kh" data-kh="N. V. H.">…</span>`, chữ tự gõ có thể chứa tên viết `.kh-text`. Các điểm Owner quyết ở G3 nằm ở mục `#ask` của hai mockup (10 điểm của vỏ app, 6 điểm của bảng thành phần), trong đó hai lựa chọn có hình: thanh tiêu đề Windows 11 tự vẽ (ô tìm ở giữa) hay thanh gốc của Windows; icon ba mục Cài đặt dạng ô màu hay nét một màu.
   - **Owner 11/11/2026, khi xem bảng thành phần của đợt a:** "Duyệt, nhưng bo góc cong ở MacOS phải đúng theo tỉ lệ cong, style của Apple chứ anh không duyệt như mockup của MacOS như đang xem". Bộ mười thành phần được duyệt làm bộ dựng cho đợt b–g; bo góc macOS của bản đầu (cung tròn, nút nào cũng là viên, thẻ 20 px) bị bỏ. Vẽ lại ngay trong PR của đợt a theo ba quy tắc của Apple: góc cong liên tục, bo đồng tâm (cửa sổ 24 → tấm thanh bên 16 → mục thanh bên 8), hình viên chỉ cho nút cỡ lớn và viên của thanh công cụ (quy tắc thứ ba đổi ngay sau đó, xem gạch dưới). Hình và số ở `components.html#corners`; token và cách làm ở phụ lục 11/11/2026 của ADR-0013, mục 3. Số đo so lại với máy Mac thật khi có bản build (T-413).
   - **Owner 11/11/2026, khi xem bản vẽ lại:** "duyệt nhưng nút cỡ lớn 2 bên cong quá và không có đường thẳng dọc 2 bên, xem lại góc của nút cỡ lớn." Góc cong liên tục và bo đồng tâm được duyệt; nút 34 px hình viên bị bỏ. Nút và nút của thanh công cụ trên macOS thành chữ nhật bo có cạnh thẳng hai bên; hình viên chỉ còn ở viên chọn, nhãn, ô tìm và thông báo nổi. Số bo của nút: Owner chọn "A · Bo 10 px" (phương án B là 8 px), hình ở `components.html#btn-corner`.
   - **G3 đợt a: Owner trả lời từng điểm `#ask` của hai mockup trong chat, 11/11/2026** (Claude hỏi từng câu, kèm đề xuất). Vỏ app (`app-shell.html#ask`):
     1. Vỏ app hai nền tảng như cửa sổ đầu trang và mục "Một bố cục, hai hệ điều hành": "Duyệt".
     2. Thanh tiêu đề Windows 11, kiểu A tự vẽ có ô tìm ở giữa hay kiểu B thanh gốc: "Kiểu A tự vẽ". Điều kiện đi kèm khi hỏi: kiểm Snap Layouts và kéo cửa sổ trên máy thật, không đạt thì lùi về kiểu B.
     3. Thanh bên: logo gọn xếp ngang, Forecast trên Báo cáo, trạng thái lưu rồi slogan ở chân: "Duyệt".
     4. Icon ba mục Cài đặt, kiểu A ô màu hay kiểu B nét một màu: "Kiểu A ô màu".
     5. Cụm góc nhìn + kỳ (một viên mở menu, một viên kỳ có ‹ ›, bảng "Màn nào có gì trên thanh công cụ"): "Duyệt". Duyệt hình thức; nội dung menu của từng màn chốt ở mockup màn đó.
     6. Nút che tên KH trên thanh công cụ, tên hiện thành chữ cái đầu "N. V. H.", mã KH giữ nguyên: "Duyệt".
     7. Khi che tên, chữ người dùng tự gõ (ghi chú, mô tả trigger): "Ẩn thành •••".
     8. Che tên có nhớ qua lần mở app sau không: "Có nhớ".
     9. Hai hình xem trước (Lịch hẹn, hộp "Lịch hẹn mới") trong vỏ mới: "Duyệt". Các màn đã duyệt G3 khác nhận vỏ mới theo cùng cách, không vẽ lại.
     10. Phụ lục ADR-0013 (hỏi gộp với điểm 6 của bảng thành phần): "Duyệt".

     Bảng thành phần (`components.html#ask`):
     1. Bộ mười thành phần là bộ dựng cho mockup đợt b–g: duyệt, kèm lời về bo góc macOS ghi ở gạch trên.
     2. Bo góc theo hệ điều hành: duyệt sau hai lần vẽ lại phần macOS (hai gạch trên): góc cong liên tục, bo đồng tâm, nút chữ nhật bo 10 px (nút gọn 8 px), hình viên chỉ cho viên chọn, nhãn, ô tìm và thông báo nổi; Windows 11 bo 8 px và 4 px.
     3. Thẻ không viền, dùng chất liệu thay nền `--bg-2` + viền `--border`: "Duyệt".
     4. Trạng thái trống và lỗi theo một khuôn, ba cỡ: "Duyệt".
     5. Thông báo nổi ở giữa mép dưới cửa sổ, tự rời sau khoảng 4 giây, lỗi thì ở lại: "Duyệt".
     6. Bộ token mới và phụ lục ADR-0013 ngày 11/11/2026: "Duyệt". Bốn động tác chuyển động duyệt riêng ở đợt g.

     Đợt a vậy là qua G3. Chưa kiểm trên Safari / máy Mac thật; vẫn chưa ra Issue code.
   - **Mockup đợt b (T-417 #1217, Owner duyệt G3 ngày 12/11/2026, xem gạch "G3 đợt b" dưới đây):** `docs/design/mockups/search-rm-team.html`, ghép từ bảng thành phần của đợt a; thành phần mới thêm ở `ui2.css` mục 14 và `ui2.js` mục 9–15, không đổi phần đã duyệt. Một cửa sổ bấm được trên macOS và Windows 11: ô lệnh ⌘K / Ctrl K ở mọi màn, trên Windows mở từ ô của thanh tiêu đề (ý 09); viên "Lưu ý" giữa tên màn và cụm nút, hình chữ nhật bo như nút theo luật bo góc của đợt a, kèm bảng hôm nay và tiến độ của việc chạy nền (ý 11); ô tìm KH ở màn Khách hàng, thẻ khớp sáng lên và lên đầu cột, thẻ khác mờ còn 70% (ý 25); trang RM: năm số theo kỳ (Forecast tuần luôn là tuần này), danh sách KH phụ trách đúng các cột §5 và dải 8 tuần (ý 27); Team & nhân sự giữ bố cục đã duyệt, đầu team theo ý 33 (màu, icon tùy chọn; TL cùng dòng, cùng cỡ chữ; ba số đậm màu champagne), ô tìm RM, hộp Tạo / Sửa team; trạng thái trống và lỗi; nút che tên KH ở mọi chỗ mới. Số viết theo luật của T-418 (#1221): "1.38 tỷ", "16.7%". Mười hai điểm Owner quyết ở `#ask`, trong đó: KH khớp ngoài góc nhìn (đề xuất: nhóm "Ngoài góc nhìn" trong danh sách dưới ô), định nghĩa dải 8 tuần, cách bày màn Team (A giữ bố cục đã duyệt, đề xuất; B lưới thẻ như bảng ý tưởng); màu và icon của team là dữ liệu mới: G2 khi ra Issue. Chưa kiểm trên Safari.
   - **G3 đợt b: Owner trả lời từng điểm `#ask` của `search-rm-team.html`, 12/11/2026** (chat ở Home PC; Claude hỏi từng điểm, mỗi điểm kèm phương án đề xuất và một phương án khác; trong ngoặc kép là nhãn Owner chọn hoặc lời Owner gõ):
     1. Ô lệnh: mở bằng ⌘K / Ctrl K ở mọi màn; bốn nhóm Khách hàng (tối đa 8), RM (4), Đi tới (4), Lệnh (4); thứ tự tên bắt đầu bằng chữ đã gõ → một tiếng trong tên → giữa tên → mã KH; tìm mọi KH, kể cả KH đã đóng: "Duyệt".
     2. Sáu lệnh trong v1.0 (Lịch hẹn mới, Khách hàng mới, Team mới, Xuất Excel Báo cáo tháng này, Sao lưu ngay, Che / hiện tên KH): "Duyệt sáu lệnh".
     3. Viên "Lúc này" (ý 11): "Đồng ý với nội dung của Recommended. Nhưng sửa lại "Lúc này" thành "Lưu ý" và "Spotlight" hoặc "Attention" với bản tiếng Anh, em recommend anh từ phù hợp". Claude đề xuất "Heads-up": "Spotlight" là tên ô tìm kiếm của chính macOS (⌘ Space), bản Mac sẽ lẫn với nó và với ô lệnh ⌘K; "Attention" đọc như cảnh báo lỗi. Owner chọn "Heads-up". Tên trên giao diện: **"Lưu ý"**, bản tiếng Anh **"Heads-up"**.
     4. Việc chạy nền hiện ở "Lưu ý" (tên việc, thanh tiến độ, phần trăm; xong ghi "Đã xuất …" khoảng 3 giây; lỗi ở lại tới khi bấm thử lại): "Duyệt. Nhưng từ sẽ thay đổi từ câu trả lời trước."
     5. Tìm là sáng ở màn Khách hàng (thẻ khớp lên đầu cột, thẻ khác còn 70% độ đậm, giữ chỗ, chữ vẫn đạt AA): "Duyệt".
     6. KH khớp nằm ngoài góc nhìn: nhóm "Ngoài góc nhìn" trong danh sách dưới ô, bấm vẫn mở hồ sơ, kanban giữ góc nhìn. Owner chọn phương án này; hai phương án bỏ: tự về góc nhìn Toàn bộ, chỉ tìm trong góc nhìn (đổi §5).
     7. Trang RM, sắp xếp mặc định của danh sách KH phụ trách: "Lâu chưa gặp lên đầu" (KH chưa gặp lần nào xếp cuối); phương án bỏ: theo nhóm N1 → N4.
     8. Dải nhịp gặp (tuần Thứ Hai → Chủ Nhật, năm hình, tuần nhiều lịch theo thứ tự đã gặp > chưa ghi kết quả > có lịch > không diễn ra): "Duyệt 8 tuần" (phương án bỏ: 12 tuần).
     9. Màn Team & nhân sự: "Cách A. Nhưng nếu có hơn 3 team thì trình bày ra sao?" Claude trả lời: danh sách bên trái là danh sách dọc xếp theo tên, mỗi team thêm một dòng; từ khoảng 8 team thì khung danh sách cuộn bên trong, dòng đang chọn luôn trong tầm nhìn; bên phải luôn một team; mockup thêm hình 7 team. Owner: "Duyệt". Cách B (lưới thẻ của bảng ý tưởng) bỏ.
     10. Màu và icon của team (sáu màu có sẵn, tám icon, đều tùy chọn; "Đổi tên team" thành "Sửa team"): "Duyệt" (phương án bỏ: bộ màu riêng cho team, thêm token). Màu và icon là dữ liệu mới của team: G2 khi ra Issue code.
     11. Đầu team (TL cùng dòng, cùng cỡ chữ đậm với tên team; ba số Doanh số, Số HĐ của tháng đang chạy và Forecast tuần, đậm, màu champagne; màn Team không có bộ chọn kỳ): "Duyệt".
     12. Trạng thái trống và lỗi của đợt: "Duyệt".

     Đợt b vậy là qua G3. Chưa kiểm trên Safari / máy Mac thật; vẫn chưa ra Issue code. Còn lại: c Tổng quan, d Forecast, e Báo cáo + Excel, f hộp hủy HĐ, g hệ chuyển động.
   - **Mockup đợt c (T-422 #1238, chờ Owner duyệt G3; bộ luật "Điểm nhấn" chờ G2):** `docs/design/mockups/tong-quan.html`, ghép từ bảng thành phần của đợt a và các thành phần của đợt b; thành phần mới thêm ở `ui2.css` mục 15 và `ui2.js` mục 16–18 (hai bảng của thanh công cụ, số chủ đạo kèm phép tính, đường lũy kế có phần dự kiến, ô chỉ số có phép tính, khối Điểm nhấn, động tác "Đếm"), không đổi phần đã duyệt. Khi qua G3, mockup này thay phần 1a–1e của `overview.html` (duyệt 03/10/2026); màn Lịch hẹn 4 nhóm ở phần 2 của file đó giữ nguyên. Một cửa sổ bấm được trên macOS và Windows 11:
     - **Ý 08:** không có nút "Lọc", không còn dòng "Đang xem". Viên góc nhìn mở menu Toàn bộ / một team / một RM; viên kỳ có ‹ › và bảng chọn năm loại kỳ (Ngày, Tuần, Tháng, Năm, Tùy chọn), có nút Hôm nay. Chọn là số chạy tới giá trị mới; động tác "Đếm" chỉ minh họa, duyệt ở đợt g.
     - **Ý 14:** Doanh số là số lớn nhất màn, kèm "FYP phát hành − FYP hủy" và chênh lệch so với kỳ trước (giữ luật C01–C11 của `phase-4-chi-so.md` §4.2). Đường lũy kế theo ngày có ba nét: kỳ đang xem (liền), phần dự kiến tới cuối kỳ (đứt), kỳ trước (mờ, vẽ cả kỳ). Phần dự kiến = doanh số đã đạt + case size dự kiến của lịch hẹn Đã lên lịch từ hôm nay, theo D-a … D-e (§6.2); **cách tính chốt ở golden D (đợt d)**. Theo loại kỳ: Tuần tới hết Thứ Bảy, Tháng tới cuối tháng, Năm chỉ tới hết tháng đang chạy (Forecast chỉ định nghĩa cho tuần và tháng); Ngày không vẽ đường; Tùy chọn không có nét mờ và phần dự kiến.
     - **Ý 15:** sáu ô, mỗi ô ghi phép tính: Tổng số HĐ ("33 phát hành − 1 hủy"), Tỷ lệ hủy ("1 hủy ÷ 33 phát hành", tăng là đỏ), Tỷ lệ chốt ("33 HĐ ÷ 78 RF"), Chuyển RF, HĐ nộp, Case size; bấm một ô mở Báo cáo ở cùng kỳ và góc nhìn. Số theo định nghĩa của golden B. Hai ví dụ lấy từ dữ liệu mẫu của mockup: Team Hừng Đông, tuần 26/10 – 01/11/2026 (1 phát hành, 2 hủy: Tổng số HĐ -1, Doanh số -40 tr, Tỷ lệ hủy 200%); RM Hoàng Văn Tùng, tuần 09/11 – 15/11/2026 (0 phát hành, 1 hủy: -1, -50 tr, Tỷ lệ hủy "—"). Số âm viết có dấu "-" và đổi màu đỏ.
     - **Kỳ đã qua** (Owner 11/11): không nét đứt, không câu Điểm nhấn về Forecast, mục tiêu hay case size; mọi ô so với cả kỳ liền trước. Kỳ chưa bắt đầu: chỉ số kết quả ghi "—", lịch hẹn đã đặt vẫn đếm.
     - **Khối đã duyệt 03/10/2026:** giữ ô Lịch hẹn bốn nhóm, KH theo nhóm kèm chart (bấm ô để ẩn / hiện nhóm), bảng So sánh team bấm team → RM (thêm cột HĐ hủy và Tỷ lệ hủy). Đổi: ô Doanh số cũ thành số chủ đạo, ô HĐ phát hành cũ thành vế đầu của ô Tổng số HĐ; góc nhìn "Team = mọi team, mỗi team một chart" thành chọn một team. Bảng khối ↔ chỉ số cập nhật ở mục `#blocks` của mockup.
     - Viên "Lưu ý", ô lệnh, nút che tên KH như đợt a, b. Trạng thái trống (kỳ chưa có số liệu, kỳ chưa bắt đầu, team chưa có RM) và lỗi (đọc dữ liệu cả màn, lỗi trong một thẻ). Số của tháng 11/2026 khớp màn Team & nhân sự của đợt b (Doanh số 1.38 tỷ: Sao Mai 620 tr, Bình Minh 450 tr, Hừng Đông 310 tr). Số viết theo ADR-0018. Chưa kiểm trên Safari.
     - Mười một điểm Owner quyết ở G3 nằm ở mục `#ask` của mockup; bốn điểm có hình hai phương án (nét mờ, sáu hay tám ô, số câu tối đa, chỗ đặt Điểm nhấn).
   - **Bộ luật "Điểm nhấn" (điểm 7 ở trên; Claude đề xuất ở T-422 #1238, chờ Owner duyệt G2).** App viết câu từ số của kỳ và góc nhìn đang xem, theo luật cố định, không gọi AI. Thứ tự trong bảng là thứ tự ưu tiên. Luật 3 và 4 là hai luật Claude đề xuất thêm; các luật còn lại là bốn luật của bản thử (luật 1 và 7 là hai chiều của cùng một luật). "Kỳ trước" là cửa sổ so sánh của `phase-4-chi-so.md` §4.2: kỳ đang chạy so với cùng số ngày của kỳ trước, kỳ đã qua so với cả kỳ liền trước. Câu mẫu lấy từ dữ liệu mẫu của mockup (hôm nay 10/11/2026).

     | # | Luật | Hiện khi | Ngưỡng | Câu mẫu: dòng chính · dòng phụ | Bấm tới | Kỳ đã qua |
     |---|---|---|---|---|---|---|
     | 1 | **Tỷ lệ hủy tăng** (đỏ) | Tỷ lệ hủy của kỳ cao hơn kỳ trước; cả hai kỳ có HĐ phát hành. Biến thể: kỳ có HĐ hủy mà không có HĐ phát hành (Tỷ lệ hủy "—"), không cần kỳ trước | tăng từ 1 điểm % | "Tỷ lệ hủy 3%, tăng 3 điểm %" · "1 hủy ÷ 33 phát hành · 01/10 – 10/10 là 0%". Biến thể: "1 HĐ hủy, kỳ này chưa có HĐ phát hành" · "Tỷ lệ hủy không tính được ("—") · Doanh số -50 tr" | Báo cáo, danh sách HĐ hủy, cùng kỳ và góc nhìn | có |
     | 2 | **Buổi hẹn đã qua chưa ghi kết quả** (cam) | Trong kỳ đang xem có lịch Đã lên lịch mà ngày đã qua; đúng con số "Chưa ghi kết quả" của ô Lịch hẹn | từ 1 buổi | "12 buổi hẹn đã qua chưa ghi kết quả" · "Sao Mai 5 · Hừng Đông 4 · Bình Minh 3". Dòng phụ ở góc nhìn team: ba RM có nhiều buổi nhất; ở góc nhìn RM: "Ghi kết quả để chỉ số của kỳ đủ" | Lịch hẹn, lọc "Chưa ghi kết quả", cùng kỳ và góc nhìn | có |
     | 3 | **Lịch hẹn thiếu case size** (cam; đề xuất thêm) | Kỳ đang chạy. Từ hôm nay tới hết Thứ Bảy tuần này có lịch Đã lên lịch của KH N3 / N2 / N1 chưa có case size dự kiến; đúng con số của "Lưu ý" | từ 1 lịch | "2 lịch hẹn tuần này thiếu case size" · "Chưa tính vào Forecast · điền case size dự kiến để tính" | Forecast, danh sách lịch thiếu case size | không |
     | 4 | **Về đích so với mục tiêu tháng** (champagne; đề xuất thêm) | Kỳ Tháng đang chạy. Góc nhìn Toàn bộ khi mọi team đã có mục tiêu (mục tiêu toàn bộ = tổng các team), hoặc góc nhìn một team đã có mục tiêu. Không có ở góc nhìn RM | không | "Đã đạt 46% mục tiêu tháng" · "1.38 tỷ / 3 tỷ · dự kiến về đích 2.7 tỷ, còn thiếu 300 tr". Khi dự kiến đạt mục tiêu: "Đã đạt 56.4% mục tiêu tháng" · "620 tr / 1.1 tỷ · dự kiến về đích 1.23 tỷ, vượt 130 tr". Khi đã đạt: "Đã vượt mục tiêu tháng: 1.15 tỷ / 1.1 tỷ" · "Dự kiến về đích 1.4 tỷ" | Forecast, đường băng tháng | không |
     | 5 | **Forecast tuần này** (xanh dương) | Kỳ đang chạy. Forecast tuần (hôm nay → Thứ Bảy, §6.1) lớn hơn 0 | lớn hơn 0 | "Tuần này dự kiến 555 tr" · "17 lịch có case size, từ hôm nay tới Thứ Bảy 14/11" | Forecast, Tuần này | không |
     | 6 | **Team dẫn đầu, hoặc thứ hạng của team** (champagne) | Toàn bộ: có từ 2 team và team đầu có doanh số lớn hơn 0; đồng hạng thì nêu cả hai. Một team: thứ hạng của team đó. Không có ở góc nhìn RM | không | "Sao Mai dẫn đầu doanh số: 620 tr" · "44.9% doanh số toàn bộ · Tỷ lệ chốt 51.7%". Một team: "Sao Mai đứng thứ 1 / 3 về doanh số" · "620 tr · 44.9% doanh số toàn bộ" | Báo cáo, bảng theo team, cùng kỳ | có |
     | 7 | **Tỷ lệ hủy giảm** (xanh lá) | Như luật 1, theo chiều giảm | giảm từ 1 điểm % | "Tỷ lệ hủy 5.4%, giảm 3.2 điểm %" · "4 hủy ÷ 74 phát hành · cả Tháng 09/2026 là 8.6%" | như luật 1 | có |

     Luật chung:
     - **Số câu tối đa: 4**, lấy theo thứ tự ưu tiên của bảng: việc cần xử lý trước (hủy tăng, chưa ghi kết quả, thiếu case size), rồi tiến độ (mục tiêu, Forecast tuần), cuối cùng là thứ hạng và tin tốt.
     - **Không luật nào khớp:** thẻ Điểm nhấn giữ chỗ, ghi một dòng "Kỳ này không có điểm nào cần lưu ý".
     - **Kỳ đã qua:** chỉ các luật về số thực tế (1, 2, 6, 7); luật 3, 4, 5 nói về tương lai nên không hiện (Owner 11/11). Mục tiêu của tháng đã qua có hiện hay không chốt cùng mô hình dữ liệu của mục tiêu, ở đợt d. **Kỳ chưa bắt đầu:** không có câu nào. **Kỳ Tùy chọn:** không so kỳ trước, nên luật 1 và 7 không chạy, trừ biến thể "có hủy, không có phát hành".
     - Số trong câu là số đang hiện trên màn (cùng kỳ, cùng góc nhìn), viết theo ADR-0018. Câu không chứa tên KH. Đổi kỳ hay góc nhìn thì câu đổi ngay.
     - Câu là chuỗi i18n có tham số; bản tiếng Anh viết ở lượt dịch của phần G (§11).
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
| M10 | Công cụ dev | `tools/bootstrap.ps1`, PowerShell | Không cần nếu vẫn code trên Windows và build bản Mac bằng CI. **Nay cần** (Owner 12/11: "Macbook sẽ là dev machine thứ 3"): bootstrap macOS, tài liệu dựng máy (Issue Mac-8, §9.3) |
| M11 | Khóa thư mục dữ liệu, kiểm quyền ghi | Windows: mở file khóa không chia sẻ (một exe cho thư mục dữ liệu); hỏi quyền ghi thư mục / thay file trước khi lưu (`ACCESS_DENIED`, `READ_ONLY`, `FOLDER_READ_ONLY`) | Khóa file khóa bằng `std` (`File::try_lock`, kiểu `flock`): `open -n` hay chạy thẳng file trong gói mở được hai tiến trình. Kiểm quyền ghi theo bit quyền của thư mục / file, cùng mã lỗi như Windows. Làm ở bước thử (T-413) |

### 9.2 Dữ liệu giữa các máy

Hôm nay mỗi máy giữ dữ liệu riêng; đồng bộ (`Project-2C-data`, gộp backup) để sau v1.0 (Owner 11/10/2026). Owner 10/11: Mac và PC **dùng chung một dữ liệu** ("chung vì các báo cáo nhập và xuất ra dạng excel, nên làm chung cho tiện"). Ba cách được nêu: backup / khôi phục tay giữa hai máy (đã có, cùng định dạng file), thư mục đồng bộ như OneDrive / iCloud, hay đồng bộ thật.

**Owner chốt 11/11/2026** (chat ở Home PC, khi duyệt danh sách việc sau PR #1215): "Dữ liệu chung là file backup có thể dùng được trên cả 2 nền tảng". Mac và PC dùng chung dữ liệu bằng **file backup**: cùng một định dạng, xuất trên máy này và nhập được trên máy kia, cả hai chiều. v1.0 không có thư mục đồng bộ hay đồng bộ thật; hai cách đó xét sau v1.0, cùng phương án backup cloud. ADR-0019 §3 ghi lại quyết định này; bước 5 của bước thử bản Mac (`nen-tang-mac-va-thuong-mai-hoa.md` §9) là nhập trên Mac một file `.p2cbackup` xuất từ bản Windows.

### 9.3 Cách làm đề xuất

1. **Thử trên Mac (spike):** build bản macOS chưa ký trên CI, Owner mở trên Mac, ghi các chỗ hỏng. Sửa tối thiểu để chạy được (M2, M3, M4, M11; T-413, PR #1219); bản Windows không đổi. Chi tiết: `nen-tang-mac-va-thuong-mai-hoa.md` §9. Owner 10/11 chọn chung mã Tauri: "A quyết định chung mã Tauri như e khuyến nghị, thử trên Mac local trước, nếu không ổn thì tính tiếp". **Xong 12/11/2026** (#1226): MacBook Pro M5 Pro, macOS 27.2.1, bản `f7b82ad`, C1–C8 đều OK, không có Issue `build-mac` nào. Đường tải bằng trình duyệt trên Mac chưa thử (ADR-0019 §6).
2. **ADR-0019 "Bản macOS và phân phối hai nền tảng"** (T-420, #1230): nơi để dữ liệu, kho key, ký, dạng phát hành và tự cập nhật cho cả hai nền tảng, CI, kiểm thử trên WebKit. Owner 12/11 gộp câu "portable hay bản cài" vào ADR này ("Gộp vào ADR"). **Owner duyệt G1, G4, G6 ngày 12/11/2026** (PR #1232): mọi đề xuất ("Take recommendations"), mã định danh `com.heritas.lcrm`, "Duyệt tất cả".
3. **Issue Mac** (bảng dưới), xen kẽ với các Issue A–G theo luật song song theo file (Owner hỏi 12/11/2026, Claude trả lời; `PROJECT-STATE.md` mục 2026-11-12):
   - hai Issue chạy song song chỉ khi không chung file;
   - Issue Mac chỉ sửa phần Rust phía Mac xen kẽ được;
   - M7, M8 (sửa `vi.ts`) xếp sau A1 / G-01;
   - phần Rust của ADR lưu trữ (đề xuất, chờ Owner) không chạy cùng Issue Mac sửa `storage.rs`;
   - mỗi lần merge một PR code, PR đang mở kia chạy `gh pr update-branch` → CI → review lại.
4. **Phát hành:** v1.0 cho cả hai cùng lúc (Owner 10/11: "bản Mac phát hành cùng lúc với bản windows"), từ cùng một SHA (ADR-0019 §8).

**Issue dự kiến (Mac), chưa tạo.** Theo ADR-0019. Nội dung theo đề xuất của Claude; Owner duyệt cùng ADR ngày 12/11/2026. Cột "Cổng" ghi các câu hỏi Q… của PR #1232 mà Issue dựa vào; G4, G6 và việc mở K49 của chúng đã duyệt cùng ADR. Nhãn sổ ghi chú vẫn là một tên `Mac` (§12.1); khi tạo Issue, PR sổ đổi nhãn từng mục thành `[T-… #…]` theo cột "Mục sổ [Mac]" (số dòng @`d3d738b`, khớp theo đường dẫn khi số dòng đổi). M2 (phía macOS), M3, M11 đã xong ở T-413; các mục sổ còn lại của chúng nằm ở Mac-1.

| Issue | Nội dung | M | File chính | Mục sổ [Mac] | Rủi ro | Cổng | Bị chặn bởi / chỗ trong thứ tự |
|---|---|---|---|---|---|---|---|
| Mac-1 | Module `platform::{windows, macos}` của vỏ Rust (ADR-0019 §1): thư mục dữ liệu, khóa, kiểm quyền ghi, mở thư mục / URL, kho key; thu hồi tiến trình `open`; tên biến `opener`; chú thích mã lỗi chung hai nền tảng; ngoài Windows, lưu báo `READ_ONLY` khi file DB chỉ đọc (hay ghi khác biệt ở M11). Hành vi Windows không đổi. Có thể phải tách đôi theo trần cỡ | — | `src-tauri/src/lib.rs`, `storage.rs`, `ai.rs`, module mới | L130, L132, L134, L135, L136 | med | — | ADR-0019. Chỉ Rust, xen kẽ được với A–G; không chạy cùng phần Rust của ADR lưu trữ (`storage.rs`). Trước Mac-2, Mac-4 |
| Mac-2 | Nơi để dữ liệu và bản cài Windows (ADR-0019 §2, §5): bản cài NSIS theo người dùng, dữ liệu `%LOCALAPPDATA%\<mã>\`, chế độ portable khi có `Project2C-data\` cạnh exe, bản debug dùng thư mục cạnh file chạy (cả macOS), mã định danh mới `com.heritas.lcrm`; CI build file cài; NT-EX viết lại và nghiệm thu lại (K46) | — (ADR-0019 §2, §5) | `tauri.conf.json`, `tauri.windows.conf.json` (mới), module `platform`, `.github/workflows/ci.yml`, `package.json`, `docs/testing/nghiem-thu-v1.md` | — | high | Q1, Q4, Q9 (G4 NSIS), Q11 (K49) | Mac-1. Nhãn `build-exe` + `build-mac` |
| Mac-3 | Đóng gói macOS: `.dmg` (Q2; dựng trên runner hỏng thì giữ zip), `minimumSystemVersion` (Q5), kiểm chỉ arm64, khai ngôn ngữ vi + en của gói (ADR-0018 §10), `macos.yml` đòi `Signature=adhoc` | M4 | `tauri.macos.conf.json`, `.github/workflows/macos.yml` | L133 | low | Q2, Q5 | ADR-0019. Khác file với Mac-1, Mac-2: chạy song song được. Trước Mac-7 |
| Mac-4 | Key AI qua Keychain: crate `apple-native-keyring-store` (ADR-0019 §4), test chấp nhận có bước macOS hỏi lại mật khẩu sau bản build mới | M1 | `src-tauri/Cargo.toml`, `Cargo.lock`, module `platform` / `ai.rs` | — | med | Q8 (G4 crate) | Mac-1, Mac-2 (cùng module `platform`). Nhãn `build-exe` + `build-mac` |
| Mac-5 | Chữ, phím và hướng dẫn theo nền tảng: ⌘A / ⌘C / ⌘V, ⌘R thay Ctrl ở chữ giao diện và chặn tải lại; chữ "exe", Explorer, `backups\` theo nền tảng; hướng dẫn sử dụng phần macOS ("Vẫn mở" với chữ hộp chặn của macOS 27, Keychain, nơi để dữ liệu) và phần cài đặt Windows | M6 (hướng dẫn), M7, M8 | `apps/desktop/src/i18n/vi.ts`, xử lý phím của vỏ app, `docs/user-guide/` | — | low | — | A1, G-01 (`vi.ts`); Mac-2, Mac-3 (hướng dẫn tả bản cài, `.dmg`). Có thể tách phần hướng dẫn |
| Mac-6 | Luật `build-mac` (Q6): `merge-pr` chặn PR đụng `EXE_PATHS` thiếu nhãn; `CLAUDE.md`, `.claude/rules/ci.md`; bước phát hành hai nền tảng từ một SHA | M5 | `tools/pr-core.mjs`, `tools/merge-pr.mjs` (+ test), `CLAUDE.md`, `.claude/rules/ci.md` | — | med | Q6, Q12 (K49 công cụ pipeline; chỉ làm khi `auto-issues` không chạy) | DS-1 (cùng `tools/`); không chạy cùng Mac-8 (`CLAUDE.md`) |
| Mac-7 | E2E trên WebKit (project Playwright, job trong `macos.yml`), sửa test phụ thuộc Edge; thêm các dòng nghiệm thu macOS vào `nghiem-thu-v1.md` (C1–C8 của #1226, Keychain, `.dmg`, "Vẫn mở") | M9 | `playwright.config.ts`, `.github/workflows/macos.yml`, `e2e/**`, `docs/testing/nghiem-thu-v1.md` | — | med | Q7, Q10 (G4 WebKit) | Mac-3 (`macos.yml`); Mac-2 (`nghiem-thu-v1.md`). Owner chạy nghiệm thu Mac ở §10 bước 4 |
| Mac-8 | Dựng MacBook làm máy dev thứ 3: tài liệu `docs/setup/`, bootstrap macOS, `tools/session-start` chạy được trên macOS, phụ lục ADR-0003 ba máy, `CLAUDE.md` mục "Môi trường Windows và 2 máy" | M10 | `docs/setup/`, `tools/` (bootstrap, session-start), ADR-0003, `CLAUDE.md` | — | med | G1 (phụ lục ADR-0003); G4 nếu thêm công cụ | ADR-0019 §1 (Owner chốt 12/11/2026: "Macbook sẽ là dev machine thứ 3"; ADR ghi dựng máy là task riêng sau ADR). Không chạy cùng DS-1 (`tools/`), Mac-6 (`CLAUDE.md`) |

Ngoài bảng: tự cập nhật, ký Developer ID, Store và mở `.p2cbackup` bằng nhấp đúp để sau v1.0, kèm điều kiện xét lại (ADR-0019 §5, §6). Cả bản Mac ước 8 Issue.

### 9.4 Câu hỏi chờ Owner

- Anh có máy Mac để thử chưa (chip Apple hay Intel, macOS bản nào)? **Đã trả lời 10/11:** MacBook Pro M5 Pro, macOS 27.2+.
- Bản Mac cho riêng anh hay cho cả team? **Một phần 10/11:** trước mắt là app Mac chạy local, song song bản Windows, trước khi nghĩ tới thương mại hóa.
- Phát hành cùng lúc với bản Windows hay sau? **Đã trả lời 10/11:** cùng lúc.
- Có đăng ký Apple Developer (99 USD / năm) để ký và notarize không? **Đã trả lời 10/11:** chưa, có thể làm sau.
- Mac và PC có cần dùng chung một dữ liệu không? **Đã trả lời 10/11:** chung. Cách dùng chung **chốt 11/11:** bằng file backup dùng được trên cả hai nền tảng (§9.2).
- Thêm 10/11: bản thương mại hóa đa ngôn ngữ, trước mắt tiếng Việt và English. Owner 11/11 đưa song ngữ và tiền tệ vào v1.0: §11, ADR-0018.

## 10. Thứ tự đề xuất của cả đợt

Thứ tự dưới (bước 2, 3) do Claude đề xuất ngày 12/11/2026 (T-419, #1227); Owner duyệt G1 cùng ngày, trong PR #1228: "Duyệt G1". Nó thay thứ tự trước đó (A → G-01 … G-05 → B → C / F → D → E → G-12 … G-16, G-06 … G-11 chạy song song, Issue macOS chạy song song) bằng một chuỗi có Issue dọn sổ (§12) và luật song song theo file (§9.3 bước 3).

1. Vòng ý tưởng UI/UX (§8). Thử bản macOS (§9.3 bước 1): xong 12/11/2026, C1–C8 OK (#1226).
2. Việc tài liệu, lần lượt: DS-0 (T-419, #1227: sổ ghi chú theo nhãn đích, §12) → golden B (T-421, #1234: §4.5; Owner duyệt G2 ngày 13/11/2026) → mockup đợt c (T-422, #1238: `docs/design/mockups/tong-quan.html`, kèm bảng luật "Điểm nhấn" ở §8; chờ Owner duyệt G3 và G2) → đợt d + golden D → đợt e → đợt f + mockup phần G (§11.5) → đợt g → viết các bảng "Issue dự kiến" còn thiếu (vỏ app, D, E, F). ADR macOS: ADR-0019 (T-420, #1230), viết sau bước thử; bảng Issue dự kiến Mac đã viết (§9.3). ADR-0018 và golden số / tiền (T-418) đã qua G1, G2 ngày 12/11/2026; golden D và mockup đợt c–e viết số theo luật mới.
3. Owner bảo "ra issue": DS-1 → A1–A7 → DS-2 → G-01 … G-05 → vỏ app → B1–B3 → DS-3 → C1 / C2, F → D → E → DS-4 → G-06 … G-11 → G-12 … G-16. Issue Mac xen kẽ theo luật song song theo file (§9.3 bước 3). Mỗi Issue gộp các mục sổ mang nhãn đích của nó (§12). Chi tiết phần G: §11.4; tên Issue dự kiến: §3.6, §4.6, §5, §11.7, §12.2.
4. Nghiệm thu bản mới trên Windows và Mac (phát hành cùng lúc) → đóng phase → G7 → phát hành v1.0 cho cả hai.

## 11. Phần G — Song ngữ Việt / Anh và tiền tệ (Owner duyệt G1, G2 ngày 12/11/2026)

### 11.1 Phạm vi

- Owner 11–12/11/2026 thêm, ngoài sáu điểm của §1 (chín lượt nguyên văn: `docs/PROJECT-STATE.md`, mục 2026-11-11 và 2026-11-12; Issue #1221):
  - giao diện song ngữ Tiếng Việt / English, đổi bất kỳ lúc nào trong Cài đặt;
  - tiền tệ chọn một lần khi thiết lập ban đầu;
  - dấu kiểu Excel cho mọi con số.
- Vào v1.0 (Owner 11/11: "Đưa vào v1.0"); bản Mac phát hành cùng lúc.
- Quyết định, lý do, phương án đã loại: **ADR-0018** (`docs/decisions/0018-ngon-ngu-va-tien-te.md`). Đầu vào → đầu ra của từng luật: golden **`docs/golden/so-va-tien-te.md`**. Phần này tóm tắt luật, ghi cổng, thứ tự, thuật ngữ và các Issue dự kiến.
- Không thuộc phần G:
  - quy đổi tỷ giá (Owner: "Không áp tỉ giá quy đổi");
  - hướng dẫn sử dụng tiếng Anh (sau v1.0);
  - video demo (làm khi UI/UX final);
  - JPY (Owner bỏ 12/11).

### 11.2 Luật

Đã chốt (Owner, 11–12/11/2026):

- **Ngôn ngữ:** Tiếng Việt / English, đổi bất kỳ lúc nào ở Cài đặt → "Ngôn ngữ / Language". Tiếng Việt chỉ chọn được khi tiền tệ là VND; tiền tệ khác thì Tiếng Việt bị làm mờ.
- **Tiền tệ:**
  - Bảy tiền tệ: VND (không số lẻ); USD, EUR, GBP, AUD, CAD, SGD (có cent).
  - Chọn một lần ở thiết lập ban đầu, sau đó không đổi được. Không quy đổi tỷ giá.
  - Muốn đổi thì "Thiết lập lại từ đầu": app tự backup dữ liệu cũ, tạo DB mới hoàn toàn, quay về thiết lập ban đầu.
- **Thiết lập ban đầu:** (video demo) → ngôn ngữ → tiền tệ → nguồn dữ liệu (trắng / dữ liệu mẫu / file backup cùng tiền tệ). Chọn Tiếng Việt thì chỉ có VND; chọn English thì có đủ bảy tiền tệ.
- **Dấu kiểu Excel** cho mọi ngôn ngữ và mọi con số: `,` ngăn hàng nghìn, `.` cho phần lẻ. Ví dụ "3,000,000 VNĐ", "1.9 tỷ", "1,204", "66.7%", "3.1 MB".
- **Ô nhập chặt** theo cùng luật: "1.500" là 1.5. Dữ liệu mẫu viết lại theo luật này, người dùng được hướng dẫn nhập đúng.
- **Ký hiệu tiền:** tiền khác VND đặt ký hiệu trước số ("$1,250.50"). VND ghi chữ "VNĐ" sau số ở cả hai ngôn ngữ, thay "₫" ở mọi chỗ hiện tiền; ô nhập vẫn nhận "VNĐ" / "VND" / "₫" / "đ".
- **Dạng gọn:** tiếng Việt tr / tỷ, thêm bậc khi cần; English K / Mil / Bil / T. VND sang tiếng Anh chỉ đổi chữ đơn vị: tỷ → Bil, triệu → Mil.
- **Trần phí:** 100 Billions đơn vị chính, cho mọi tiền tệ; VND giữ 100 tỷ đồng của DR-23.
- **Dữ liệu mẫu:**
  - VND: bộ tiếng Việt hiện có.
  - Tiền có cent: bộ tên tiếng Anh, con số theo độ lớn hợp với tiền có cent.
- **Ngày:** nhập dd/mm/yyyy ở cả hai ngôn ngữ, không dùng mm/dd. English hiện tên tháng ở chỗ rộng.

Claude đề xuất, Owner trả lời từng điểm ngày 12/11/2026 (§11.3; chi tiết ở ADR-0018):

- **Cách lưu tiền:** số nguyên theo đơn vị nhỏ nhất của tiền tệ (đồng / cent); dữ liệu VND giữ nguyên. Ba cột tiền dùng tiền tệ của DB. Trần với tiền có cent là 10,000,000,000,000 cent, nên tổng chỉ chính xác tới 900 phí ở mức trần (VND 90,071). ADR §3.
- **Tiền tệ là dữ liệu:** khóa `currency` của bảng `settings`, đi theo backup. Một migration ghi `"VND"` vào DB và backup cũ chưa có khóa. ADR §2, §7.
- **Ngôn ngữ lưu theo máy** (`localStorage` của WebView), không vào backup; chưa lưu gì thì theo tiền tệ. Đổi ngôn ngữ thì tải lại giao diện. ADR §1.
- **Định dạng bằng bảng cố định trong `domain`**, không dùng `Intl`. ADR §4.
  - Owner chọn 12/11: AUD, CAD, SGD viết "$1,250.50 AUD" (mã chỉ ở dạng đầy đủ; USD chỉ "$").
  - Tiền có cent luôn hai số lẻ ở dạng đầy đủ.
  - Dạng gọn tiếng Việt: K / tr / tỷ.
- **Ô nhập:** ADR §5.
  - Cách gõ sai luật bị từ chối, kèm gợi ý viết lại; người dùng bấm gợi ý thì mới điền.
  - Không đơn vị: VND không có chữ số nào sau `.` ("1.500" bị từ chối, gợi ý "1,500"); tiền có cent đọc `.` là phần lẻ, kết quả phải tròn cent ("1.500" là $1.50, Owner chốt 12/11 sau review PR #1222).
  - EUR theo cùng luật với USD, dù người dùng EUR kiểu châu Âu viết "1.500" cho 1500: "1.500" là €1.50, không có lỗi `ambiguous`. Ô nhập tiền EUR có câu hướng dẫn cách nhập (Owner chốt 12/11 sau review `831ec95`, dưới bảng §11.3).
  - Với VND, "1.500 tr" (một `.` + đúng 3 chữ số + đơn vị) bị từ chối kèm hai cách viết, vì hôm nay nó là 1,500 tr. Phần nguyên `0` không tính: "0.500 tr" là 0.5 tr (Owner chọn 12/11 sau review PR #1222).
  - Đơn vị theo ngôn ngữ giao diện (Owner chọn 12/11): tiếng Việt nghìn / k / tr / tỷ và "1tr5"; English K / Mil / Bil.
- **DB mới / cũ:** DB mới là lúc thư mục dữ liệu chưa có file (nhánh `stored` của `app-data.ts`). Wizard dựng DB riêng và lưu một lần. Bản web giữ dữ liệu mẫu VND, không qua wizard. ADR §7.
- **Nhập backup khác tiền tệ:** từ chối. `importBackup` nhận tiền tệ mong đợi từ app. ADR §7.
- **Thiết lập lại:**
  - Dữ liệu cũ giữ nguyên cho tới khi wizard xong.
  - DB mới không giữ cài đặt AI; key AI thuộc máy nên ở lại.
  - ADR §7.
- **Nạp lại dữ liệu mẫu:** giữ tiền tệ, nạp bộ mẫu của tiền tệ đó. ADR §7.
- **Bộ mẫu tiếng Anh:** một bộ số chung cho cả sáu tiền tệ có cent. ADR §8.
- **i18n:** `en.ts` cùng bộ khóa với `vi.ts`; số nhiều tiếng Anh; gom chuỗi tiếng Việt ngoài `vi.ts`. ADR §9.
- **Đi cùng việc khác:** ngôn ngữ trả lời của AI ở A6 (G5); Excel ở E; ngôn ngữ của gói macOS ở một Issue Mac. ADR §10.

### 11.3 Điểm Owner chọn (trả lời 12/11/2026)

Mỗi điểm là đề xuất của Claude, có dòng golden hay mục ADR đi kèm. Owner trả lời từng câu trong chat ở Home PC ngày 12/11/2026, bằng cách chọn trong hộp câu hỏi. Chữ trong ngoặc kép là nhãn Owner chọn, hay câu Owner tự gõ, giữ nguyên văn.

| # | Điểm | Đề xuất của Claude | Owner trả lời 12/11 | Golden / ADR |
|---|---|---|---|---|
| Q1 | Ký hiệu AUD, CAD, SGD | "A$", "C$", "S$" | **Khác đề xuất:** "Ví dụ $250 AUD, $250 CAD, $250 SGD. Đưa 3 chữ cái viết tắt của tiền tệ cùng dùng đồng Dollar sau con số. Dễ nhìn, dễ phân biệt hơn." Hỏi thêm, Owner chọn "USD chỉ "$"" và "Chỉ dạng đầy đủ kèm mã" (dạng gọn "$250K") | §1, F17–F21, C34–C36, I33–I36, X34 · ADR §4 |
| Q2 | Tiền có cent ở dạng đầy đủ | Luôn hai số lẻ: "$1,250.00" | Như đề xuất: "Luôn hai số lẻ" | F09, F12 |
| Q3 | Bậc của dạng gọn tiếng Việt | "nghìn" cho bậc K; không có bậc nghìn tỷ ("1,500 tỷ"); dưới 1,000 hiện dạng đầy đủ | **Bậc K khác đề xuất:** ""K" như tiếng Anh" ("750K"). Bậc nghìn tỷ như đề xuất: ""1,500 tỷ"" | C04–C06, C17, C18 |
| Q4 | Số âm | Dấu "-" đứng đầu: "-$1,250.50", "-1.2 tỷ"; chênh lệch dùng "−" / "+" | Như đề xuất: "Dấu "-" đứng đầu" | F08, F13, F20, C19, C31, D01–D07 |
| Q5 | Dấu cách trước đơn vị | K, T viết liền ("$250K", "1.5T"); Mil, Bil, tr, tỷ cách một dấu cách | Như đề xuất: "K, T liền; chữ dài cách" | §3 |
| Q6 | Đơn vị ở ô nhập | Một bảng cho cả hai ngôn ngữ; không nhận T, "m", "bn", "million" | **Khác đề xuất:** "Theo ngôn ngữ giao diện". Tiếng Việt nhận nghìn / k / tr / tỷ; English nhận K / Mil / Bil. Gõ đơn vị của ngôn ngữ kia là lỗi, kèm gợi ý đổi đơn vị | I06–I18, X13, X14, X30–X33 · ADR §5 |
| Q7 | Cách nói "1tr5", "1 tỷ 2" | Giữ, chỉ với đơn vị tiếng Việt | Như đề xuất: "Giữ" | I17, I18, X32 |
| Q8 | Nhóm bằng dấu cách "500 000 000" | Thành lỗi, kèm gợi ý "500,000,000" | Như đề xuất: "Từ chối, kèm gợi ý" | X07 |
| Q9 | Ngày tiếng Anh ở chỗ rộng | "Thu 12 Nov 2026", "12 Nov", "9 – 15 Nov 2026", "November 2026"; năm "2026" | Như đề xuất: "Tên tháng ngắn" | Y02–Y11 |
| Q10 | Nơi lưu ngôn ngữ | Theo máy (`localStorage`), không vào backup; chưa lưu thì theo tiền tệ | Như đề xuất: "Theo máy" | ADR §1 |
| Q11 | Gợi ý dưới ô nhập | Bấm gợi ý thì điền; app không tự áp | Như đề xuất: "Bấm gợi ý là điền" | §6.2 · ADR §5 |
| Q12 | DB cũ, backup cũ | Migration ghi VND khi chưa có khóa; backup khác tiền tệ bị từ chối | Như đề xuất: "Migration ghi VND" | ADR §7 |
| Q13 | Thiết lập lại từ đầu | Dữ liệu cũ giữ tới khi wizard xong; DB mới không giữ cài đặt AI; key AI ở lại | Như đề xuất | ADR §7 |
| Q14 | Nạp lại dữ liệu mẫu | Giữ tiền tệ, nạp bộ mẫu của tiền tệ đó | Như đề xuất: "Nạp bộ mẫu của tiền tệ đó" | ADR §7 |
| Q15 | Bộ mẫu tiếng Anh | Một bộ số chung cho sáu tiền tệ; một phần phí có số lẻ cent | Như đề xuất: "Một bộ số chung" | ADR §8 |
| Q16 | Bảng thuật ngữ tiếng Anh | Bảng ngắn ở §11.6 | "Anh cần list đầy đủ các thuật ngữ để kiểm tra lại". §11.6 viết lại đầy đủ, theo nhóm, lấy từ chữ đang có trong `vi.ts`. Owner sửa bốn từ rồi "Còn lại duyệt": Team & nhân sự → "Team management", Nhân sự → "staff", Mất cơ hội → "lost opportunity", "RF: referal" (giải thích ở §11.6) | §11.6 |
| Q17 | "1.500 tr", "1.500 tỷ" với VND | Từ chối (mã `ambiguous`), gợi ý cả "1.5 tr" lẫn "1,500 tr" | Như đề xuất: "Từ chối, đưa hai cách viết". Sau review: "0.500 tr" "Nhận là 0.5 tr" (dưới bảng) | X26–X29, I37, I39 · ADR §5 |

**Sau review phiên sạch của PR #1222** (head `33f631a`, PASS kèm sáu ghi chú không chặn, cộng ghi chú X19 của vòng `27ebbd1`), Owner trả lời cùng ngày 12/11/2026 trong chat ở Home PC, nguyên văn:

- Về các ghi chú review: "xử lý hết trong v1.0"; chọn "Sửa hết trên PR này". Các ghi chú được sửa trên PR này trước khi merge.
- X19, tiền có cent gõ "1.500" không đơn vị: "USD khác nhé, 1.500 là 1.5, còn 1,500 là 1500 USD". Tiền có cent đọc `.` là phần lẻ, kết quả phải tròn cent: "1.500" lưu `150` ($1.50, I38). VND giữ như cũ: "1.500" bị từ chối, gợi ý "1,500" (X05). X19 đổi thành ca "1.505" (lẻ dưới 1 cent). ADR §5.
- "0.500 tr" với VND: chọn "Nhận là 0.5 tr". Luật `ambiguous` chỉ áp khi phần nguyên khác `0` (I39). ADR §5.
- Tên Issue dự kiến của phần G: chọn "G-01 … G-16", để khỏi lẫn với tên cổng G1–G8 (§11.7).
- Hỏi duyệt lại G2 các dòng golden đổi (X19, I38, I39) và câu ADR §5: chọn "Duyệt".

**Sau review phiên sạch ở `831ec95`** (PASS kèm một ghi chú không chặn: luật "1.500" = 1.5 của tiền có cent, khi áp cho EUR), Claude hỏi cùng ngày 12/11/2026 trong chat ở Home PC: "ADR-0018 §5 / golden I38: với tiền có cent, gõ "1.500" không đơn vị được nhận là 1.5 (anh chốt cho USD). Người dùng EUR kiểu châu Âu (Đức, Ý, Tây Ban Nha…) viết "1.500" nghĩa là 1500, nên sẽ bị lưu €1.50 (nhỏ đi 1000 lần). Anh muốn áp luật thế nào cho EUR?" Hai lựa chọn: "EUR từ chối (Recommended)" và "Giữ cho mọi tiền có cent". Owner tự gõ câu trả lời, nguyên văn:

- "Đưa về 1 quy chuẩn như cách viết với USD. Khi người dùng sử dụng Euro thì khi nhập sẽ có báo cách nhập cho đúng."
  - EUR theo đúng luật của USD: "1.500" lưu `150` (€1.50, I40). Không có lỗi `ambiguous` cho EUR.
  - Ô nhập tiền EUR có câu hướng dẫn cách nhập; câu chữ, vị trí và lúc hiện chốt ở mockup G3 (§11.5) và i18n. ADR §5.
- Hỏi duyệt lại G2 dòng golden mới I40 và các câu ADR §5 vừa sửa: chọn "Duyệt".

### 11.4 Thứ tự, cổng

- **Cổng:**
  - **G1:** ADR-0018 và phần này. **G2:** golden `so-va-tien-te.md` và khóa `currency` của bảng `settings`. Owner duyệt cả hai ngày 12/11/2026 ("Duyệt G1 và G2"), trong PR của T-418 (#1222).
  - **G3:** mockup (§11.5). **G5:** ngôn ngữ trả lời và câu "tại Việt Nam" của prompt, gộp vào A6.
  - Không có G4: không thêm dependency nào, kể cả thư viện số hay `Intl` polyfill.
- **Thứ tự Issue code** (§11.7), tất cả sau A, vì A đổi khóa chuỗi và tên trong code:
  1. G-01 … G-05: cơ chế i18n, kiểu tiền và định dạng mới, khóa tiền tệ, dữ liệu mẫu VND. Làm trước B, để chuỗi và số tiền mới của B–E viết một lần bằng cách mới.
  2. B → C / F → D → E như §10 bước 3: giữa B và C có Issue dọn sổ DS-3; vỏ app và DS-2 đứng trước B, DS-4 sau E.
  3. G-06 … G-11 sau E và DS-4 (§10 bước 3; Owner duyệt G1 ngày 12/11/2026): bộ mẫu tiếng Anh, ngày tiếng Anh, wizard và thiết lập lại (sau mockup), gom chuỗi.
  4. G-12 … G-16 (các lượt dịch) làm cuối, sau E, vì B–E còn thêm chuỗi. Issue dịch cuối mới mở lựa chọn English trong Cài đặt.
- Golden D (Forecast) và mockup đợt c–e viết số theo luật mới. Đợt b (T-417, #1223) đã vẽ theo luật mới ("1.38 tỷ", "16.7%", "3,000,000 VNĐ" trong `search-rm-team.html`).

### 11.5 Mockup G3

Issue docs riêng, hoặc ghép với đợt f (hộp hủy HĐ):

- wizard (ngôn ngữ → tiền tệ → nguồn dữ liệu, kèm trạng thái lỗi khi file backup khác tiền tệ);
- Cài đặt: Ngôn ngữ, Tiền tệ chỉ xem, nút Thiết lập lại từ đầu; hộp xác nhận thiết lập lại;
- ô nhập tiền có chữ mẫu và gợi ý cách gõ đúng;
- câu hướng dẫn cách nhập của ô tiền EUR (Owner chốt 12/11, §11.3 dưới bảng; vd. `,` ngăn hàng nghìn, `.` cho phần lẻ, "1,500.00"): câu chữ, vị trí, lúc hiện; làm ở Issue G-08 (§11.7);
- một hai màn tiếng Anh với VND và với USD;
- đổi số của đợt a (`components.html`, `app-shell.html`) theo luật mới.

### 11.6 Bảng thuật ngữ tiếng Anh (Owner duyệt 12/11/2026)

Danh sách đầy đủ các thuật ngữ của giao diện, theo nhóm (Owner 12/11: "Anh cần list đầy đủ các thuật ngữ để kiểm tra lại"). Owner sửa bốn từ (ghi "Owner 12/11" ở cột Ghi chú), rồi: "Còn lại duyệt".

- Cột Tiếng Việt là chữ đang có trong app (`apps/desktop/src/i18n/vi.ts`), cộng chữ của các phần B–G chưa code. Chữ "RE" của app viết thành "RM" theo phần A.
- Câu chữ dài (câu hướng dẫn, câu lỗi) dịch ở các lượt dịch, theo đúng các từ dưới đây.
- Bảng vào `CONTEXT.md` cùng Issue G-01.

**Giữ nguyên ở cả hai ngôn ngữ:** Heritas L-CRM, FYP, KYC, KYC Intelligence, N1–N4, RM, TL, IS, BD, BDM, MTD, KPI, AUM, AI, Forecast, Case size, Team, Kanban, Trigger, Excel, ChatGPT, OpenCode, WorkBuddy.

**RF:** tiếng Việt vẫn viết "RF"; English viết "Referral" (Owner 12/11). Owner giải thích: "RF là chỉ đích danh chỉ số chuyển RF: nghĩa là IS got referred from RM. RM đã khơi gợi nhu cầu thành công, phối hợp với IS để trình bày giải pháp (tương ứng với chuyển lên N2)". Định nghĩa chỉ số không đổi (ADR-0007). Trigger "Giới thiệu từ KH" ("Customer referral") là nghĩa khác: KH giới thiệu một KH mới.

**Chữ "Hủy" có ba nghĩa, tiếng Anh tách ra:** nút đóng hộp thoại "Cancel"; lịch hẹn bị hủy "Cancelled"; hủy hợp đồng "Cancel policy", HĐ đã hủy "Cancelled".

**Chữ "Dự kiến" có hai nghĩa:** trạng thái lịch hẹn "Scheduled"; số tiền dự kiến của Forecast "Forecast" / "Expected".

Điều hướng và vỏ app:

| Tiếng Việt | English (đề xuất) | Ghi chú |
|---|---|---|
| Tổng quan | Overview | |
| Forecast | Forecast | phần D |
| Báo cáo | Reports | |
| Lịch hẹn | Appointments | tên màn |
| Khách hàng | Customers | tên màn |
| Hồ sơ khách hàng | Customer profile | |
| Team & nhân sự | Team management | Owner 12/11 |
| Cài đặt | Settings | |
| Quản lý | Manage | nhóm trên thanh bên |
| Ô lệnh (⌘K / Ctrl+K) | Command bar | đợt b |
| Lưu ý | Heads-up | đợt b, ý 11; Owner đổi tên từ "Lúc này" ở G3 đợt b (§8, điểm 3) |
| Che tên KH | Hide names | đợt a |
| Đã lưu / Đang lưu | Saved / Saving | trạng thái lưu ở chân thanh bên |

Góc nhìn và kỳ:

| Tiếng Việt | English (đề xuất) | Ghi chú |
|---|---|---|
| Góc nhìn | View | |
| Toàn bộ | All | |
| Cả team {team} | All of {team} | |
| Kỳ thống kê | Period | |
| Loại kỳ | Period type | |
| Ngày / Tuần / Tháng / Năm / Tùy chọn | Day / Week / Month / Year / Custom | |
| Kỳ trước / Kỳ sau | Previous period / Next period | |
| Hôm nay | Today | |
| Từ ngày / Đến ngày | From / To | |
| So với kỳ trước | vs. previous period | |
| T2 … CN | Mon … Sun | tên thứ ngắn |
| Thứ Hai … Chủ nhật | Monday … Sunday | tên thứ dài |
| Tháng 11/2026 | November 2026 | golden Y10 |

Người và team:

| Tiếng Việt | English (đề xuất) | Ghi chú |
|---|---|---|
| Nhân sự | Staff | Owner 12/11 |
| Vai trò | Role | |
| RM phụ trách | Assigned RM | |
| Người phối hợp | Coordinator | TL / IS / BD / BDM |
| Người đánh giá kết quả | Outcome reviewer | |
| + Team / + Thêm TL | + Team / + Add TL | |
| Màu, icon của team | Team colour, team icon | ý 33 |
| Thao tác | Actions | cột bảng |
| Tìm RM | Find RM | phần C |
| KH của RM | RM's customers | phần C |

Khách hàng:

| Tiếng Việt | English (đề xuất) | Ghi chú |
|---|---|---|
| Khách hàng (KH) | Customer | |
| Mã KH | Customer ID | |
| Họ tên | Full name | |
| Ngày sinh | Date of birth | |
| Giới tính: Nam / Nữ | Gender: Male / Female | |
| Nhóm | Stage | N4 → N1 |
| Tạm hoãn | On hold | |
| Mất cơ hội | Lost opportunity | Owner 12/11 |
| Mở lại | Reopen | |
| KH đang mở / đã đóng | Open / closed customers | |
| Đã có HĐ | Has policy | nhãn KH |
| Từ ngày | Since | cột bảng KH |
| Cách xem: Kanban / Bảng | View as: Kanban / Table | |
| Chuyển nhóm | Stage change | |
| Sửa tay | Manual change | đổi nhóm ngoài cuộc gặp |
| Lần gặp gần nhất | Last met | |
| Lịch hẹn sắp tới | Upcoming appointments | |
| Tìm KH | Find customer | phần C |

Lịch hẹn:

| Tiếng Việt | English (đề xuất) | Ghi chú |
|---|---|---|
| Lịch hẹn | Appointment | |
| Lịch hẹn mới / Tạo lịch hẹn | New appointment / Create appointment | |
| Dự kiến | Scheduled | trạng thái |
| Đã gặp | Met | trạng thái |
| Dời lịch | Rescheduled | trạng thái; nút "Reschedule" |
| Hủy | Cancelled | trạng thái |
| Không đến | No-show | trạng thái |
| Giới thiệu từ KH | Customer referral | loại trigger |
| Đáo hạn tài sản | Asset maturity | loại trigger |
| Hội thảo / sự kiện | Seminar / event | loại trigger |
| Sinh nhật, dịp đặc biệt | Birthday / special occasion | loại trigger |
| Khác | Other | loại trigger |
| Mô tả trigger | Trigger note | |
| Kết quả cuộc gặp | Meeting outcome | |
| Nhóm sau cuộc gặp | Stage after meeting | |
| Giữ nguyên | Keep | |
| Việc tiếp theo | Next step | |
| Ghi chú cuộc gặp | Meeting note | |
| Hẹn lần tiếp theo | Book next appointment | |
| Các lần hẹn trước | Past appointments | |
| Lần gặp thứ {n} | Meeting {n} | |
| Chưa ghi kết quả | Outcome not recorded | |
| Tính RF / Không tính RF | Counts as referral / Not a referral | Owner 12/11: "RF: referal" |

Hợp đồng và chỉ số:

| Tiếng Việt | English (đề xuất) | Ghi chú |
|---|---|---|
| Hợp đồng (HĐ) | Policy | |
| Đã nộp / Đã phát hành / Đã hủy | Submitted / Issued / Cancelled | trạng thái HĐ |
| Hủy HĐ / Bỏ hủy | Cancel policy / Undo cancellation | phần B |
| Ngày nộp / Ngày phát hành / Ngày hủy | Submission date / Issue date / Cancellation date | |
| FYP nộp / FYP phát hành / FYP hủy | Submitted FYP / Issued FYP / Cancelled FYP | |
| HĐ nộp / HĐ phát hành / HĐ hủy | Policies submitted / Policies issued / Policies cancelled | |
| Tổng số HĐ | Total policies | Owner 10/11 |
| Doanh số | Total FYP | Owner 10/11 |
| Case size | Case size | |
| Case size dự kiến | Expected case size | |
| Chuyển RF | Referrals | Owner 12/11; Tỉ lệ chốt = HĐ phát hành ÷ Referrals |
| Tỉ lệ chốt | Close rate | |
| Tỷ lệ hủy | Cancellation rate | phần B |
| Chỉ số của kỳ | Period metrics | |

Forecast và mục tiêu (phần D):

| Tiếng Việt | English (đề xuất) | Ghi chú |
|---|---|---|
| Forecast tuần / Forecast tháng | Weekly forecast / Monthly forecast | |
| Dự kiến | Forecast | số tiền |
| Đã đạt | Achieved | |
| KPI tháng (mục tiêu doanh số) | Monthly target (KPI) | |
| Về đích | Progress to target | |
| Còn thiếu | Remaining | |
| Nhịp cần mỗi tuần | Needed per week | |
| Thiếu case size | Missing case size | |

Báo cáo (phần E):

| Tiếng Việt | English (đề xuất) | Ghi chú |
|---|---|---|
| Bản tin | Briefing | |
| Điểm nhấn | Highlights | |
| Xu hướng | Trends | ý 35 |
| Bảng báo cáo | Report tables | |
| Theo team / Theo RM | By team / By RM | |
| Mốc | Interval | cột: ngày / tuần trong kỳ |
| Tổng | Total | |
| Xuất Excel | Export to Excel | |
| In | Print | |

KYC:

| Tiếng Việt | English (đề xuất) | Ghi chú |
|---|---|---|
| Dữ kiện KYC | KYC facts | |
| Ghi chú KYC | KYC note | |
| Hạng mục | Category | |
| Trường / Trường chính / Trường cốt lõi | Field / Key field / Core field | |
| Cổng KYC | KYC gate | |
| Phiên bản KYC | KYC version | |
| Thay đổi quan trọng | Material change | |
| Mâu thuẫn / Đánh dấu mâu thuẫn | Conflict / Mark as conflict | |
| Còn hiệu lực / Đã bị thay thế | Active / Superseded | trạng thái dữ kiện |
| Cần chăm sóc, KYC thêm thông tin khách hàng | Needs care: gather more KYC | thông điệp của cổng |
| Danh tính / tuổi | Identity / age | hạng mục |
| Gia đình | Family | hạng mục |
| Nghề nghiệp / nguồn thu | Occupation / income | hạng mục |
| Tài sản / AUM | Assets / AUM | hạng mục |
| Mục tiêu & mốc thời gian | Goals & timeline | hạng mục |
| Khẩu vị rủi ro | Risk appetite | hạng mục |
| Bảo vệ hiện có | Existing protection | hạng mục |
| Mối quan tâm | Concerns | hạng mục |
| Năm sinh | Birth year | trường |
| Giới tính | Gender | trường |
| Nơi sinh sống | Residence | trường |
| Tình trạng hôn nhân | Marital status | trường |
| Số con | Number of children | trường |
| Người phụ thuộc | Dependents | trường |
| Nghề nghiệp | Occupation | trường |
| Thu nhập năm | Annual income | trường |
| Nguồn thu | Income sources | trường |
| Tổng tài sản | Total assets | trường |
| Phân bổ tài sản | Asset allocation | trường |
| Nợ phải trả | Liabilities | trường |
| Mục tiêu chính | Primary goal | trường |
| Mốc thời gian mục tiêu | Goal horizon | trường |
| Mục tiêu khác | Other goals | trường |
| Khẩu vị rủi ro | Risk appetite | trường |
| Kinh nghiệm đầu tư | Investment experience | trường |
| Đã có bảo vệ | Has protection | trường |
| Chi tiết bảo vệ | Protection details | trường |
| Mối quan tâm chính | Main concern | trường |
| Mối quan tâm khác | Other concerns | trường |

AI:

| Tiếng Việt | English (đề xuất) | Ghi chú |
|---|---|---|
| Phân tích / Phân tích lại | Analyze / Re-analyze | |
| Lịch sử phân tích | Analysis history | |
| Lần phân tích bị loại | Rejected analysis | |
| AI trích xuất | AI extraction | |
| Nhà cung cấp | Provider | |
| Model | Model | |
| Mức suy luận: Mặc định / Thấp / Vừa / Cao | Reasoning: Default / Low / Medium / High | |
| Key AI | API key | |
| Chép prompt / Dán câu trả lời | Copy prompt / Paste answer | ChatGPT web, WorkBuddy |

Cài đặt, dữ liệu, Thùng rác:

| Tiếng Việt | English (đề xuất) | Ghi chú |
|---|---|---|
| Dữ liệu | Data | |
| Xuất backup / Nhập backup | Export backup / Import backup | |
| Nạp lại dữ liệu giả lập | Reload sample data | |
| Thư mục dữ liệu | Data folder | |
| Thùng rác | Trash | |
| Khôi phục | Restore | |
| Dọn sạch Thùng rác | Empty Trash | |
| Ngôn ngữ / Language | Language | phần G |
| Tiền tệ | Currency | phần G |
| Thiết lập ban đầu | Setup | phần G |
| Thiết lập lại từ đầu | Start over | phần G |
| Trắng / Dữ liệu mẫu / File backup | Start empty / Sample data / From a backup file | nguồn dữ liệu của wizard |

Nút và chữ chung:

| Tiếng Việt | English (đề xuất) | Ghi chú |
|---|---|---|
| Lưu / Sửa / Xóa / Đóng | Save / Edit / Delete / Close | |
| Hủy | Cancel | nút đóng hộp thoại |
| Thêm | Add | |
| Không bắt buộc | Optional | |
| Hiện thêm / Đã hiện hết | Show more / All shown | chân bảng dài |

### 11.7 Issue dự kiến (chưa tạo)

Tên Issue viết "G-" và hai chữ số (G-01 … G-16; Owner chọn 12/11/2026), để khỏi lẫn với tên cổng G1–G8: "Bị chặn bởi: G-04" là Issue, không phải cổng G4.

| Issue | Nội dung | Rủi ro | Bị chặn bởi |
|---|---|---|---|
| G-01 | Cơ chế i18n hai ngôn ngữ: `t()` theo ngôn ngữ, lưu theo máy, tải lại khi đổi, số nhiều tiếng Anh, `en.ts` dịch dần với test liệt kê khóa thiếu (chưa cho chọn English); sửa `.claude/rules/i18n-ui.md` và dòng i18n của `CLAUDE.md`; thuật ngữ vào `CONTEXT.md` | med | A4 |
| G-02 | `domain`: kiểu tiền chung, bảng tiền tệ, định dạng đầy đủ / gọn / chênh lệch, đọc ô nhập chặt kèm gợi ý, số đếm / phần trăm / cỡ file theo dấu mới; fixture của golden `so-va-tien-te.md` | med | A4 |
| G-03 | App dùng định dạng mới ở mọi chỗ hiện / nhập số (chữ mẫu, gợi ý dưới ô); mọi số viết kiểu Việt của golden `chi-so.md` (phần trăm "66,7%", tiền theo triệu nhóm bằng `.` như "1.500"; số lưu không đổi); e2e đổi chữ | med | G-02 |
| G-04 | Khóa `currency`: migration ghi VND (ngoại lệ có chủ ý của R2-02, ADR-0018 §7), luật nhập backup (khóa, trần theo tiền tệ, `BACKUP_CURRENCY_MISMATCH`), `isFee` / `requireAmount` theo tiền tệ, Nạp lại mang khóa, app truyền tiền tệ vào định dạng | med | G-03 |
| G-05 | Dữ liệu mẫu VND viết lại theo dấu mới (seed, AI giả lập) | low | G-03 |
| G-06 | Bộ dữ liệu mẫu tiếng Anh cho tiền có cent; Nạp lại theo tiền tệ; AI giả lập với bộ tiếng Anh | med | G-04 |
| G-07 | Ngày tiếng Anh: tên tháng, tên thứ, kỳ ở chỗ rộng | low | G-01 |
| G-08 | Thiết lập ban đầu (wizard), DB mới, tùy chọn wizard của bản web cho e2e; câu hướng dẫn cách nhập của ô tiền EUR, theo mockup §11.5 (wizard là chỗ đầu tiên chọn được EUR) | med | G-04, G-06, mockup §11.5 |
| G-09 | Cài đặt → Ngôn ngữ / Tiền tệ chỉ xem / Thiết lập lại từ đầu | med | G-08 |
| G-10, G-11 | Gom chuỗi tiếng Việt ngoài `vi.ts` về i18n (hai Issue theo vùng code) | low | G-01 |
| G-12 … G-16 | Các lượt dịch theo nhóm màn: vỏ, Tổng quan, Forecast · Lịch hẹn · Khách hàng, hồ sơ, KYC, AI · Báo cáo, Team · Cài đặt, lỗi, Thùng rác, wizard. Issue cuối mở lựa chọn English | low | G-10, G-11, E |

Ngoài bảng: `numFmt` theo tiền tệ của file Excel làm trong E; ngôn ngữ trả lời của AI làm trong A6; ngôn ngữ của gói macOS làm ở một Issue Mac. Mục sổ ghi chú nhãn `[G-03]` về các chuỗi i18n ghi cứng VND hay dạy luật nhập cũ (`apps/desktop/src/i18n/vi.ts`, review PR #1222): G-03 sửa các câu dạy cách gõ; câu lỗi trần theo tiền tệ (`error.AMOUNT_TOO_LARGE`, cần một chỗ điền trần) làm cùng G-04, nơi trần theo tiền tệ. Cả phần G ước 16 Issue.

## 12. Sổ ghi chú review: nhãn đích và Issue dọn sổ (Owner quyết 12/11/2026, duyệt G1 cùng ngày)

Owner 12/11/2026, chat ở Home PC: "Anh không muốn để lại sau 1.0 vì sổ open sẽ nhiều lên sau mỗi lần review, vì vậy cái nào gộp vào cùng loại thì em cho vào để làm." Mỗi mục OPEN của `docs/state/review-notes.md` mang đúng một **nhãn đích**, là việc cùng loại sẽ sửa nó, và mọi mục làm trước v1.0 (ADR-0001 phụ lục M14; luật ở đầu mục OPEN của sổ). Danh sách tên đích, bảng ghép 90 mục, DS-1…DS-4 và thứ tự §10 do Claude đề xuất (T-419, #1227); Owner duyệt G1 ngày 12/11/2026, trong PR #1228: "Duyệt G1".

### 12.1 Tên đích

Nhãn của một mục là `[T-… #…]` (Issue đang mở sẽ sửa mục) hay một tên dưới đây (việc chưa có Issue). Khi tạo Issue cho việc đó, PR sổ (không cần review) đổi nhãn các mục của nó thành `[T-… #…]`.

| Tên đích | Việc |
|---|---|
| A1–A7 | Issue dự kiến của phần A (§3.6) |
| B1–B3 | Issue dự kiến của phần B (§4.6) |
| C1, C2 | Issue dự kiến của phần C (§5) |
| G-01 … G-16 | Issue dự kiến của phần G (§11.7) |
| DS-1 … DS-4 | Issue dọn sổ (§12.2) |
| golden B | golden của phần B trong `docs/golden/chi-so.md` (§4.5), Owner duyệt G2 |
| đợt c … đợt g | mockup G3 các đợt c–g (§8); đợt f gồm cả mockup phần G (§11.5) |
| vỏ app | Issue code của mockup đợt a: vỏ app hai nền tảng, bảng thành phần, token mới (§8). Bảng Issue dự kiến viết sau (§10 bước 2) |
| D, E, F | Issue code của phần D, E, F; bảng Issue dự kiến viết sau (§10 bước 2) |
| Mac | Issue dự kiến Mac-1 … Mac-8 (§9.3, theo ADR-0019); bước thử #1226 đã xong |
| đóng phase | PR đóng Phase 6: số đo `docs/metrics/phase-6.md`, review đóng phase |
| G7 | nhãn chờ đã dùng từ 23/10/2026: mục chặn phát hành chờ bước G7 |

### 12.2 Issue dọn sổ dự kiến (chưa tạo)

Mục sổ không thuộc việc dự kiến nào ở §12.1 gom theo loại thành bốn Issue. Số mục tính @`2f972e4` theo bảng ghép của Issue #1227.

| Issue | Nội dung | Mục | Rủi ro | Bị chặn bởi | Chỗ trong thứ tự (§10 bước 3) |
|---|---|---|---|---|---|
| DS-1 | Công cụ, CI, test, tài liệu review: hook gợi ý review, `tools/`, cấu hình ESLint / Vitest, hàm e2e chung, ca hợp đồng capability, workflow, `docs/reviews/**`, khối script của kế hoạch deep review | 14 | med (công cụ pipeline, CI) | DS-0 (#1227) | đầu tiên, trước A1. Đụng công cụ pipeline: K49 mở cho DS-1 ngày 12/11/2026 (ADR-0001 M14); chỉ làm khi `auto-issues` không chạy |
| DS-2 | Dữ liệu, đồng hồ: `packages/db`, `packages/domain`, hôm nay của app (`apps/desktop/src/data/today.ts`); phần lớn là test và chú thích | 10 | low | A4 | sau A1–A7 (A4 đổi tên `re_id` trong cùng file) |
| DS-3 | Hộp thoại và màn Lịch hẹn: 6c / 6f, hộp đặt / dời lịch, người phối hợp, báo lỗi trong hộp, e2e kết quả cuộc gặp | 12 | low | G-03 | sau vỏ app và B1–B3, trước C1 / C2 (G-03 đổi cùng hộp thoại) |
| DS-4 | KH, KYC, Thùng rác: tên truy cập, dòng thời gian KYC, câu lỗi chuyển nhóm, khung AI | 4 | low | A4 | sau E, trước G-06 … G-16 (chuỗi đổi xong trước các lượt dịch) |

DS-1 (14 mục) và DS-3 (12 mục) có thể phải tách đôi theo trần cỡ khi viết Issue. Mỗi Issue dọn sổ là Issue sửa ghi chú của sổ: có mục "Ngân sách" và "Quét cùng mẫu" (skill `review-pr` §3.A).

### 12.3 Lưu ý khi viết Issue, theo bảng ghép

- `[DS-1]`: DR6-205 chỉ thêm test, kể cả cho nhánh regex G5; không đổi G5. DR6-208 chạm rào "không tự sửa" của `auto-issues` (K45): hỏi Owner trước. DR6-211, phần bộ quét: đổi job build exe của CI.
- `[A6]`: DR6-212 sửa golden / ADR đã duyệt: Owner chốt cách ghi. Hai mục của review PR #1149 (`packages/ai/src/blocklists.ts`, `docs/design/phase-5-prompts.md`) là G5. `[A7]`: mục R7 của eval 09/11 cân nhắc khi sửa prompt (G5).
- `[G-06]`: DR6-198 thêm luật cho Mock trích xuất, là hành vi mới.
- `[C2]`: DR6-185 (hai RM trùng họ tên trong một team) cần Owner chọn: nhãn phân biệt khi trùng, hay cấm tên trùng trong một team (luật mới, G2).
- `[B1]`: các mục của `docs/design/state-machines.md` làm khi B1 cập nhật máy trạng thái HĐ (§4.5).
- `[G-03]`: câu lỗi trần theo tiền tệ làm cùng G-04 (§11.7, đoạn dưới bảng).
- `[đợt f]`: chữ "Lúc này" còn sót ở `docs/design/mockups/app-shell.html` sửa khi vẽ đợt f (Owner đã đổi tên thành "Lưu ý" ở G3 đợt b).
