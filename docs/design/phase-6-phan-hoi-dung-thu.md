# Spec Phase 6 — Phản hồi dùng thử exe `5215b2e` (G1)

- **Trạng thái:** Owner duyệt cách chia A–F và thứ tự ngày 10/11/2026 (G1, trong chat ở Home PC). **Phần A** (§3) duyệt 10/11/2026, gồm G2 (golden fixtures chỉ đổi tên) và G3 (mockup chỉ đổi nhãn); chữ prompt của A (G5) Owner duyệt trên PR của A6. Phần B–F thêm vào file này khi Owner duyệt từng phần.
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

## 2. Phạm vi, thứ tự, cổng

- Mọi ý ở §1 làm **trước v1.0**. Owner mở đóng băng code K49 cho đúng các việc này (`PROJECT-STATE.md`, mục 2026-11-10). Mục [sau v1.0] của sổ ghi chú review vẫn để lại (K49), trừ mục Owner kéo vào.
- G7 chờ tới khi Owner dùng thử exe mới có đủ các phần dưới. Dòng nghiệm thu của màn / hành vi đổi được nghiệm thu lại (K46).
- Mỗi phần đi một vòng: thiết kế với Owner → mục spec trong file này → Issue. Phần nào duyệt xong thì làm code ngay, không chờ phần sau.

| Phần | Ý của Owner (§1) | Cổng | Thứ tự |
|---|---|---|---|
| **A.** Đổi RE → RM | 1 | G2, G3 (duyệt cùng phần A), G5 (PR của A6) | 1 |
| **B.** HĐ hủy, tỷ lệ hủy | 5, 6 | G2 | 2 |
| **C.** Tìm KH, tìm RM; danh sách KH của một RM | 2; tin thêm về "Team & nhân sự" | G3 | 3 |
| **F.** Icon cho 3 mục của Cài đặt | tin thêm về "Cài đặt" | G3, cùng đợt mockup với C | 3 |
| **D.** Forecast | 4 | G2, G3 | 4 |
| **E.** Làm lại Báo cáo trên app và file Excel | 3; tin thêm về "báo cáo" | G3: mockup cả màn Báo cáo lẫn file Excel | 5 |

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

### 3.6 Issue

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
