# CONTEXT — Thuật ngữ nghiệp vụ

Từ điển thuật ngữ dùng thống nhất trong issue, tài liệu và code. Định nghĩa gốc ở ADR (`docs/decisions/`); file này chỉ giải thích và trỏ tới nguồn. Tên trong code ghi trong ngoặc.

## Người và góc nhìn

- **RE** (`role: 'RE'`) — người tư vấn, phụ trách KH, cuộc hẹn và HĐ. Chỉ RE có chỉ số. "RM" trong văn bản cũ = RE (Q16).
- **TL / IS / BD / BDM** — người phối hợp trong cuộc hẹn (`coordinatorIds`); không có chỉ số riêng (ADR-0007, G2).
- **Team** (`Team`) — nhóm RE. RE thuộc team hiện tại; v1 không theo dõi lịch sử chuyển team.
- **Góc nhìn** (`Scope`) — Toàn bộ / Team / RE. Đây là cách xem dữ liệu, không phải tài khoản (ADR-0004).

## Khách hàng và vòng đời

- **KH** (`Customer`) — khách hàng, do một RE phụ trách.
- **Nhóm** (`CustomerStage`) — N4 → N3 → N2 → N1 (N1 gần chốt nhất), cộng hai trạng thái đóng **Tạm hoãn** (`ON_HOLD`) và **Mất cơ hội** (`LOST`). Được nâng, hạ, đóng; mở lại luôn về N3. KH mới chỉ được tạo ở nhóm mở, không tạo thẳng ở trạng thái đóng (ADR-0007).
  - **N4** — KH mới, thiếu thông tin KYC; hoặc đã có KYC và mục tiêu là khơi gợi nhu cầu.
  - **N3** — KH quan tâm, lắng nghe; khơi gợi nhu cầu thành công.
  - **N2** — KH được IS trình bày giải pháp cụ thể, hoặc được gửi giải pháp cụ thể.
  - **N1** — KH chấp nhận giải pháp, chưa chốt HĐ chỉ vì một số yếu tố: cân nhắc tài chính, thời gian, lý do khác.
  - Sau khi HĐ đã nộp, KH vẫn giữ nhóm và có thêm nhãn **"Đã có HĐ"** (số HĐ). Nhãn và số chỉ đếm HĐ chưa hủy: KH mà mọi HĐ đều đã hủy thì không còn nhãn. Hủy HĐ không đổi nhóm KH (ADR-0007, phụ lục HĐ hủy).
- **Chuyển nhóm** (`StageTransition`) — mỗi lần đổi nhóm là một sự kiện, có ngày và (nếu có) cuộc hẹn gây ra.
- **Cuộc hẹn** (`Appointment`) — trạng thái: Đã lên lịch (`SCHEDULED`) / Đã gặp (`MET`) / Dời lịch (`RESCHEDULED`) / KH hủy (`CANCELLED`) / Không gặp được (`NO_SHOW`). Kết quả có trường **nhóm sau cuộc gặp** (`stageAfter`), chỉ cuộc hẹn Đã gặp mới được ghi.
- **Sửa tay** — đổi nhóm ngoài cuộc gặp (vd. KH được gửi giải pháp, chuyển hóa qua điện thoại); không bao giờ tính RF.
- **Chuyển RF** (Refer) — cuộc hẹn Đã gặp mà nhóm sau cuộc gặp đưa KH từ N4/N3 lên N2/N1. Tính vào ngày gặp, tối đa 1 lần mỗi cuộc gặp, cho RE ghi trên cuộc hẹn (ADR-0007). RF chỉ đo hiệu quả cuộc gặp.

## Hợp đồng và chỉ số

- **HĐ** (`Policy`) — hợp đồng bảo hiểm; một KH có nhiều HĐ. Ba trạng thái: **submitted / đã nộp** (KH đã đóng phí) → **issued / phát hành** → **cancelled / đã hủy** (ngày hủy `cancelledDate`). Chỉ HĐ đã phát hành mới hủy được; ngày hủy không trước ngày phát hành. **Bỏ hủy** = xóa ngày hủy: HĐ trở lại phát hành, không giữ dấu vết lần hủy. Trạng thái suy từ ngày, không có cột riêng (ADR-0007, phụ lục HĐ hủy).
- **FYP** — phí năm đầu. **FYP nộp** (`submittedFyp`) ghi khi nộp; **FYP phát hành** (`issuedFyp`) mặc định bằng FYP nộp, sửa tay được. HĐ hủy không có FYP riêng: FYP hủy là FYP phát hành của HĐ. Mỗi phí (FYP, case size dự kiến) tối đa 100 tỷ đồng; số tiền bảo hiểm không phải phí, không có trần này.
- **Case size** — Σ FYP nộp của HĐ nộp trong kỳ (tổng, không trung bình).
- **HĐ phát hành** — HĐ có ngày phát hành trong kỳ, kể cả HĐ bị hủy sau đó. **FYP phát hành** (total issued FYP) của kỳ là Σ FYP phát hành của các HĐ này.
- **HĐ hủy** — HĐ có ngày hủy trong kỳ: tính vào kỳ của ngày hủy, không phải kỳ phát hành. **FYP hủy** (total cancelled FYP) của kỳ là Σ FYP phát hành của các HĐ này.
- **Tổng số HĐ** (total policies) — HĐ phát hành − HĐ hủy trong kỳ; có thể âm.
- **Doanh số** (total FYP) — FYP phát hành − FYP hủy trong kỳ; có thể âm. Trước Phase 6 phần B, Doanh số chỉ là FYP phát hành.
- **Tỷ lệ chốt** — HĐ phát hành trong kỳ ÷ chuyển RF trong kỳ; không lũy kế, không trừ HĐ hủy; 0 RF hiện "—".
- **Tỷ lệ hủy** — HĐ hủy trong kỳ ÷ HĐ phát hành trong kỳ; không lũy kế; 0 HĐ phát hành hiện "—"; có thể vượt 100%. Dòng Tổng = Σ HĐ hủy ÷ Σ HĐ phát hành.
- **Kỳ** (`Period`) — ngày / tuần (Thứ Hai → Chủ Nhật) / tháng / năm / tùy chọn. **MTD** = ngày 1 của tháng → ngày đang xem.
- **Golden examples** — ví dụ có kết quả viết tay, Owner duyệt, là test bắt buộc: `docs/golden/chi-so.md` (chỉ số, gồm golden B của HĐ hủy), `docs/golden/kyc.md` (cổng KYC), `docs/golden/forecast.md` (Forecast, golden D).

## Forecast (Phase 6 phần D; Owner duyệt G2 13/11/2026, T-423)

- **Forecast** — doanh số dự kiến từ lịch hẹn tương lai: tổng **case size dự kiến** của các cuộc hẹn Đã lên lịch, ngày từ hôm nay, không phải Chủ Nhật, của KH đang ở N3 / N2 / N1. Cộng thẳng, không nhân hệ số; mỗi KH tính một lần. **Forecast tuần**: hôm nay → Thứ Bảy (hôm nay là Chủ Nhật thì lấy tuần sau); **Forecast tháng**: hôm nay → cuối tháng. Khác với **Kỳ** của chỉ số (tuần Thứ Hai → Chủ Nhật): Forecast không có Chủ Nhật và luôn là kỳ hiện tại. Định nghĩa và ví dụ: `docs/golden/forecast.md`, ADR-0007 phụ lục Forecast.
- **Case size dự kiến** (`expectedCaseSize`) — số tiền người dùng ước lượng cho một cuộc hẹn (phí, lớn hơn 0, tối đa 100 tỷ, hoặc để trống); nhập khi đặt lịch, dời lịch, điền tại chỗ trong Forecast, hay khi ghi kết quả cuộc gặp. App không tự ước tính. Khác **Case size** của chỉ số (Σ FYP nộp của HĐ nộp trong kỳ).
- **Lịch mang số** — trong các lịch thuộc Forecast của một KH, lịch có case size dự kiến được nhập (hay sửa) gần nhất; số của KH nằm ở ngày của lịch này và tính cho RE ghi trên lịch. **Lịch thiếu case size** — lịch thuộc Forecast chưa có số: đếm và liệt kê, không cộng.
- **Đã đạt** — Doanh số (FYP phát hành − FYP hủy) từ ngày 1 của tháng tới hôm nay. **Về đích** — đã đạt + Forecast tháng.
- **KPI tháng** (Owner gọi "chỉ tiêu (KPI)", "mục tiêu doanh số"; câu của Điểm nhấn viết "mục tiêu tháng") — mục tiêu Doanh số của một team cho một tháng, người dùng nhập. KPI của góc nhìn Toàn bộ = tổng KPI các team, chỉ khi mọi team chưa xóa có KPI của tháng đó (thiếu một team thì không có KPI toàn bộ); RE không có KPI; không có KPI tuần. **Nhịp cần mỗi tuần** — (KPI − đã đạt) ÷ số tuần còn lại của tháng, app tự tính. Chữ "KPI" trong chú thích code cũ chỉ các ô chỉ số của Tổng quan, không phải nghĩa này.

## Báo cáo (Phase 6 phần E; Owner duyệt G3 13/11/2026, T-424)

- **Bản tin** — mặt để đọc và gửi của màn Báo cáo: các trang có đầu thư cho một kỳ và một góc nhìn (tóm tắt, chi tiết từng RE và HĐ hủy, hoạt động, Xu hướng và định nghĩa); câu chữ viết từ số theo khuôn và theo bảng luật Điểm nhấn, không gọi AI. **Bản in** là chính các trang đó trên giấy sáng (A4 dọc); app không sinh file PDF.
- **Sổ số** — mặt để tra của màn Báo cáo: bốn số của góc nhìn, rồi năm bảng **Kết quả**, **Chuyển đổi**, **Lịch hẹn**, **Khách hàng**, **HĐ hủy**; dòng xếp theo team (team mở ra RE) hoặc **theo mốc** (7 ngày của tuần, các tuần của tháng, 12 tháng của năm).
- **Xu hướng** — 6 kỳ gần nhất cùng loại, kỳ đang xem đứng cuối; có ở kỳ Tuần / Tháng / Năm.

## KYC

- **Ghi chú KYC** (`KycNote`) — văn bản RE ghi, chỉ thêm, không sửa/xóa (ADR-0008), trừ khi dọn sạch Thùng rác xóa hẳn KH đã xóa (spec Phase 6 TR-11, phụ lục ADR-0008).
- **Dữ kiện KYC** (`KycFact`) — một giá trị có cấu trúc, **RE đã xác nhận**, trỏ về ghi chú nguồn. Trạng thái: còn hiệu lực (`active`) / đã bị thay thế (`superseded`) / mâu thuẫn (`conflict`).
- **Hạng mục KYC** (`KycCategory`) — 8 hạng mục lớn: Danh tính/tuổi, Gia đình, Nghề nghiệp/nguồn thu, Tài sản/AUM, Mục tiêu & mốc thời gian, Khẩu vị rủi ro, Bảo vệ hiện có, Mối quan tâm. (Trước gọi là "chiều" — không dùng nữa.)
- **Trường** (`KycField`) — mục nhỏ trong hạng mục (vd. năm sinh, số con).
- **Trường chính** (`keyFields`) — trường bắt buộc có để hạng mục được tính **"đã có"**. Câu trả lời "không / chưa có" vẫn tính; trường đang mâu thuẫn vẫn tính.
- **Trường cốt lõi** (`core`) — năm sinh, tình trạng hôn nhân, số con, tổng tài sản/AUM, mục tiêu chính. Mâu thuẫn ở trường cốt lõi chặn AI; ở trường khác chỉ cảnh báo.
- **Mâu thuẫn** — hai dữ kiện đã xác nhận cùng trường, khác giá trị, đều chưa bị thay thế.
- **Cổng KYC** (`evaluateKycGate` → `KycGateResult`) — hàm thuần, chỉ đọc dữ kiện còn hiệu lực (`active` / `conflict`), không gọi AI. Trạng thái (`KycGateState`) theo ưu tiên `CONFLICT_RESOLUTION` > `KYC_INSUFFICIENT` > `PROFILE_DISCOVERY` > `PAIN_POINT_ANALYSIS`; ngưỡng ở ADR-0008 và `docs/golden/kyc.md`. Kết quả kèm hạng mục đã có / còn thiếu, trường mâu thuẫn cốt lõi / cảnh báo, câu hỏi gợi ý cho hạng mục thiếu, cờ **được gọi AI** (`aiAllowed`, chỉ ở hai trạng thái cuối) và thông điệp **"Cần chăm sóc, KYC thêm thông tin khách hàng"** khi `KYC_INSUFFICIENT`.
- **Phiên bản KYC** (`KycVersion`) — tạo khi tập dữ kiện còn hiệu lực đổi (so bằng hash). Cờ **material**: phiên bản đầu luôn bật; sau đó bật khi trường cốt lõi đổi, hoặc RE bật tay (không tắt được khi luật đã bật) (ADR-0008 §7).

## Dữ liệu

- **Xóa mềm** (`deleted_at`) — KH, cuộc hẹn, HĐ, nhân sự, team khi xóa chỉ bị ẩn khỏi danh sách và chỉ số, khôi phục được ở Thùng rác (spec Phase 3 D4).
- **Thùng rác** — Cài đặt → Thùng rác: liệt kê mọi bản ghi xóa mềm để khôi phục; không theo góc nhìn, không tự dọn (spec Phase 6 §4.2).
- **Dọn sạch Thùng rác** — nút xóa hẳn mọi bản ghi trong Thùng rác (trừ bản ghi còn được dữ liệu khác dùng tới, TR-12); hỏi trước, backup trước (bản exe), một transaction. Là cách duy nhất xóa hẳn bản ghi nghiệp vụ, kể cả ghi chú KYC, dữ kiện và phân tích AI của KH đã xóa (spec Phase 6 TR-11, phụ lục ADR-0008).