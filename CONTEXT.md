# CONTEXT — Thuật ngữ nghiệp vụ

Từ điển thuật ngữ dùng thống nhất trong issue, tài liệu và code. Định nghĩa gốc ở ADR (`docs/decisions/`); file này chỉ giải thích và trỏ tới nguồn. Tên trong code ghi trong ngoặc.

## Người và góc nhìn

- **RE** (`role: 'RE'`) — người tư vấn, phụ trách KH, cuộc hẹn và HĐ. Chỉ RE có chỉ số. "RM" trong văn bản cũ = RE (Q16).
- **TL / IS / BD / BDM** — người phối hợp trong cuộc hẹn (`coordinatorIds`); không có chỉ số riêng (ADR-0007, G2).
- **Team** (`Team`) — nhóm RE. RE thuộc team hiện tại; v1 không theo dõi lịch sử chuyển team.
- **Góc nhìn** (`Scope`) — Toàn bộ / Team / RE. Đây là cách xem dữ liệu, không phải tài khoản (ADR-0004).

## Khách hàng và vòng đời

- **KH** (`Customer`) — khách hàng, do một RE phụ trách.
- **Nhóm** (`CustomerStage`) — N4 → N3 → N2 → N1 (N1 gần chốt nhất), cộng hai trạng thái đóng **Tạm hoãn** (`ON_HOLD`) và **Mất cơ hội** (`LOST`). Được nâng, hạ, đóng; mở lại luôn về N3.
  - **N4** — KH mới, thiếu thông tin KYC; hoặc đã có KYC và mục tiêu là khơi gợi nhu cầu.
  - **N3** — KH quan tâm, lắng nghe; khơi gợi nhu cầu thành công.
  - **N2** — KH được IS trình bày giải pháp cụ thể, hoặc được gửi giải pháp cụ thể.
  - **N1** — KH chấp nhận giải pháp, chưa chốt HĐ chỉ vì một số yếu tố: cân nhắc tài chính, thời gian, lý do khác.
  - Sau khi HĐ đã nộp, KH vẫn giữ nhóm và có thêm nhãn **"Đã có HĐ"**.
- **Chuyển nhóm** (`StageTransition`) — mỗi lần đổi nhóm là một sự kiện, có ngày và (nếu có) cuộc hẹn gây ra.
- **Cuộc hẹn** (`Appointment`) — trạng thái: Đã lên lịch (`SCHEDULED`) / Đã gặp (`MET`) / Dời lịch (`RESCHEDULED`) / KH hủy (`CANCELLED`) / Không gặp được (`NO_SHOW`). Kết quả có trường **nhóm sau cuộc gặp** (`stageAfter`), chỉ cuộc hẹn Đã gặp mới được ghi.
- **Sửa tay** — đổi nhóm ngoài cuộc gặp (vd. KH được gửi giải pháp, chuyển hóa qua điện thoại); không bao giờ tính RF.
- **Chuyển RF** (Refer) — cuộc hẹn Đã gặp mà nhóm sau cuộc gặp đưa KH từ N4/N3 lên N2/N1. Tính vào ngày gặp, tối đa 1 lần mỗi cuộc gặp, cho RE ghi trên cuộc hẹn (ADR-0007). RF chỉ đo hiệu quả cuộc gặp.

## Hợp đồng và chỉ số

- **HĐ** (`Policy`) — hợp đồng bảo hiểm; một KH có nhiều HĐ. Hai trạng thái: **submitted / đã nộp** (KH đã đóng phí) → **issued / phát hành**.
- **FYP** — phí năm đầu. **FYP nộp** (`submittedFyp`) ghi khi nộp; **FYP phát hành** (`issuedFyp`) mặc định bằng FYP nộp, sửa tay được.
- **Case size** — Σ FYP nộp của HĐ nộp trong kỳ (tổng, không trung bình).
- **Doanh số** — Σ FYP phát hành của HĐ phát hành trong kỳ.
- **Tỉ lệ chốt** — HĐ phát hành trong kỳ ÷ chuyển RF trong kỳ; không lũy kế; 0 RF hiện "—".
- **Kỳ** (`Period`) — ngày / tuần (Thứ Hai → Chủ Nhật) / tháng / năm / tùy chọn. **MTD** = ngày 1 của tháng → ngày đang xem.
- **Golden examples** — ví dụ có kết quả viết tay, Owner duyệt, là test bắt buộc: `docs/golden/chi-so.md`.
