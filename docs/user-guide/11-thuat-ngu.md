# 11. Thuật ngữ

[← Mục lục](README.md)

Thuật ngữ ngành giữ tiếng Anh như trên màn. Bảng dưới giải thích theo cách app dùng.

## Người và góc nhìn

| Thuật ngữ | Nghĩa |
|---|---|
| **RE** | Người tư vấn: phụ trách KH, ghi lịch hẹn, kết quả cuộc gặp và HĐ. Chỉ RE có chỉ số |
| **TL** | Trưởng team. Mỗi team một TL. Là người phối hợp trong lịch hẹn, không có chỉ số riêng |
| **IS**, **BD**, **BDM** | Người hỗ trợ dùng chung cho mọi team, không thuộc team nào. Là người phối hợp trong lịch hẹn, không có chỉ số |
| **Người phối hợp** | TL, IS, BD hoặc BDM đi cùng RE trong một lịch hẹn. Không tính chỉ số |
| **Người đánh giá kết quả** | Người quyết định nhóm sau cuộc gặp (TL, IS, BD hoặc BDM), ghi khi có kết quả Đã gặp; không bắt buộc |
| **Team** | Nhóm RE, có một TL. RE thuộc team hiện tại; app không lưu lịch sử chuyển team |
| **Góc nhìn** | **Toàn bộ** / **Team** / **RE**: cách xem dữ liệu, không phải tài khoản. Ai dùng app cũng xem và sửa được mọi dữ liệu |

## Khách hàng và nhóm

| Thuật ngữ | Nghĩa |
|---|---|
| **KH** | Khách hàng, do một RE phụ trách. Mỗi KH có **mã KH** (ví dụ K-9A1C) |
| **N4** | KH mới, thiếu thông tin KYC; hoặc đã có KYC và đang khơi gợi nhu cầu |
| **N3** | KH quan tâm, lắng nghe; khơi gợi nhu cầu thành công |
| **N2** | KH được IS trình bày giải pháp cụ thể, hoặc được gửi giải pháp cụ thể |
| **N1** | KH chấp nhận giải pháp, chưa chốt HĐ chỉ vì một số yếu tố (cân nhắc tài chính, thời gian, lý do khác). Gần chốt nhất |
| **Tạm hoãn**, **Mất cơ hội** | Hai nhóm đóng. KH mới không tạo thẳng vào nhóm đóng. KH đã đóng mở lại luôn về N3 |
| **Nhóm mở** | N4, N3, N2, N1 |
| **Đã có HĐ** | Nhãn của KH đã có HĐ nộp. KH vẫn giữ nhóm của mình |
| **Chuyển nhóm** | Mỗi lần KH đổi nhóm, có ngày; ghi "tạo KH", "sau cuộc gặp" hoặc "chuyển tay · không tính RF" |
| **Chuyển tay** | Đổi nhóm ngoài cuộc gặp, bằng nút **Chuyển nhóm** ở hồ sơ KH (ví dụ KH được gửi giải pháp qua điện thoại). Không bao giờ tính RF |

## Lịch hẹn

| Thuật ngữ | Nghĩa |
|---|---|
| **Dự kiến** | Lịch chưa có kết quả |
| **Đã gặp** | Cuộc gặp đã diễn ra. Chỉ Đã gặp mới có nhóm sau cuộc gặp, việc tiếp theo, case size dự kiến |
| **Dời lịch** | Lịch được dời sang ngày khác: lịch cũ giữ trạng thái Dời lịch, app tạo lịch mới ở ngày mới |
| **Hủy** | KH hủy cuộc hẹn |
| **Không đến** | KH không đến, không gặp được |
| **Chưa ghi kết quả** | Lịch Dự kiến mà ngày hẹn đã qua: cần ghi kết quả |
| **Nhóm sau cuộc gặp** | Nhóm của KH sau một cuộc gặp Đã gặp; khác nhóm hiện tại thì app ghi chuyển nhóm vào ngày gặp |
| **Trigger** | Lý do có cuộc hẹn: Giới thiệu từ KH, Đáo hạn tài sản, Hội thảo / sự kiện, Sinh nhật, dịp đặc biệt, Khác |
| **Hẹn tiếp** | Tạo lịch hẹn tiếp theo, điền sẵn KH, RE, người phối hợp, trigger từ lịch trước |
| **Nhập bù** | Ghi một lịch hẹn đã diễn ra trong quá khứ |

## Hợp đồng và chỉ số

| Thuật ngữ | Nghĩa |
|---|---|
| **HĐ** | Hợp đồng bảo hiểm. Một KH có nhiều HĐ. Hai bước: **Đã nộp** (KH đã đóng phí) → **Đã phát hành** |
| **FYP** | Phí năm đầu. **FYP nộp** ghi khi nộp; **FYP phát hành** mặc định bằng FYP nộp, sửa tay được. Mỗi phí tối đa 100 tỷ đồng |
| **Chuyển RF** (Refer) | Cuộc gặp Đã gặp đưa KH từ N4 / N3 lên N2 / N1. Tính vào ngày gặp, tối đa 1 lần mỗi cuộc gặp, cho RE ghi trên lịch hẹn. RF chỉ đo hiệu quả cuộc gặp |
| **HĐ nộp** | Số HĐ có ngày nộp trong kỳ |
| **Case size** | Tổng FYP nộp của các HĐ nộp trong kỳ (tổng, không trung bình) |
| **Case size dự kiến** | Số RE ước lượng khi ghi kết quả Đã gặp; chỉ để tham khảo, không tính vào chỉ số |
| **HĐ phát hành** | Số HĐ có ngày phát hành trong kỳ |
| **Doanh số** | Tổng FYP phát hành của các HĐ phát hành trong kỳ |
| **Tỉ lệ chốt** | HĐ phát hành trong kỳ ÷ Chuyển RF trong kỳ, không lũy kế. Kỳ có 0 RF hiện "—" |
| **Kỳ** | Ngày, Tuần (Thứ Hai → Chủ nhật), Tháng, Năm hoặc Tùy chọn (tối đa 3 tháng) |
| **MTD** | Month to date: từ ngày 1 của tháng tới hôm nay |
| **KPI** | 6 chỉ số của kỳ: Chuyển RF, HĐ nộp, Case size, HĐ phát hành, Doanh số, Tỉ lệ chốt |

## KYC

| Thuật ngữ | Nghĩa |
|---|---|
| **KYC** | Know your customer: thông tin RE biết về KH |
| **Ghi chú KYC** | Văn bản RE ghi về KH. Chỉ thêm, không sửa, không xóa |
| **Ghi chú hệ thống** | Ghi chú app tự ghi khi tạo / sửa hồ sơ KH (ngày sinh, giới tính) |
| **Dữ kiện KYC** | Một giá trị có cấu trúc RE đã xác nhận (ví dụ Số con: 2), trỏ về ghi chú nguồn. Còn hiệu lực, đã thay thế (cũ) hoặc mâu thuẫn |
| **Mã F** | Tên ngắn của một dữ kiện (F1, F2…). Phân tích AI dùng mã F làm bằng chứng |
| **Hạng mục KYC** | 8 hạng mục lớn: Danh tính / tuổi, Gia đình, Nghề nghiệp / nguồn thu, Tài sản / AUM, Mục tiêu & mốc thời gian, Khẩu vị rủi ro, Bảo vệ hiện có, Mối quan tâm. Hạng mục "đã có" khi có đủ các trường chính |
| **Trường** | Mục nhỏ trong hạng mục (ví dụ Năm sinh, Số con) |
| **Trường cốt lõi** | Năm sinh, Tình trạng hôn nhân, Số con, Tổng tài sản, Mục tiêu chính |
| **AUM** | Assets under management: tổng tài sản KH đang có |
| **Mâu thuẫn** | Hai dữ kiện đã xác nhận cùng trường, khác giá trị, đều còn hiệu lực. **Mâu thuẫn cốt lõi** (ở trường cốt lõi) chặn phân tích AI; **mâu thuẫn phụ** chỉ cảnh báo |
| **Cổng KYC** | Trạng thái cho biết KH đủ thông tin để phân tích AI chưa, theo thứ tự ưu tiên: `CONFLICT_RESOLUTION` (có mâu thuẫn cốt lõi) > `KYC_INSUFFICIENT` (thiếu thông tin) > `PROFILE_DISCOVERY` (đủ tối thiểu, nên khám phá thêm) > `PAIN_POINT_ANALYSIS` (đủ để phân tích nhu cầu). Chỉ hai trạng thái cuối gọi AI được |
| **Phiên bản KYC** (`kyc v…`) | Tạo mới mỗi khi tập dữ kiện còn hiệu lực đổi |
| **Thay đổi quan trọng** | Phiên bản KYC có đổi ở trường cốt lõi (app tự đánh dấu) hoặc được RE đánh dấu. Nhắc nên phân tích AI lại |

## AI

| Thuật ngữ | Nghĩa |
|---|---|
| **KYC Intelligence** | Phần AI của app, ở cuối hồ sơ KH |
| **Mock** | Câu mẫu cố định, không gọi AI, để thử app |
| **OpenCode** | Dịch vụ app gọi để chạy model AI thật (bản exe). **Gói Go**: trả theo tháng; **Credit**: trừ số dư |
| **ChatGPT web** | Phân tích làm tay qua tài khoản ChatGPT của bạn |
| `analysis`, `discovery` | Hai chế độ phân tích, theo cổng KYC: `PAIN_POINT_ANALYSIS` → analysis, `PROFILE_DISCOVERY` → discovery |
| **Prompt** | Câu lệnh app gửi AI, có phiên bản (ví dụ `analysis@1`, `discovery@2`) |
| `CURRENT` | Phân tích mới nhất, làm trên phiên bản KYC hiện tại |
| `STALE` | Phân tích cũ: KYC đã đổi sau đó, hoặc đã có lần phân tích mới hơn |
| `REJECTED` | Lần phân tích bị loại vì câu trả lời của AI không đạt kiểm tra; không dùng làm kết quả |
| **Behavioral Hypotheses** | Giả thuyết về KH, cần kiểm chứng |
| **Needs**, **Pain points**, **Opportunity Themes** | Nhu cầu, điều KH đang lo, chủ đề có thể tư vấn |
| **Discovery Strategy** | Nên hỏi / tìm hiểu gì tiếp |
| **Next Best Actions** | Việc nên làm tiếp với KH |
| **Mức bằng chứng** | Thấp / trung bình / cao, app đếm theo số dữ kiện một ý dựa vào và độ mới của dữ kiện |
| **AI trích xuất** | AI đọc một ghi chú KYC và đề xuất dữ kiện; RE xác nhận thì mới ghi |
| **Token** | Đơn vị đo lượng chữ gửi / nhận của AI |

## Dữ liệu

| Thuật ngữ | Nghĩa |
|---|---|
| **Bản exe** | App chạy trên Windows, dữ liệu lưu trong file `Project2C-data\project2c.db` |
| **Bản web** | App chạy trong trình duyệt để thử; dữ liệu mất khi tải lại trang |
| **Dữ liệu giả lập** | Dữ liệu mẫu app tạo (3 team × 10 RE, ~12 tháng), tên và số liệu đều giả |
| **Xóa mềm** | Bản ghi ẩn khỏi danh sách và chỉ số nhưng vẫn còn, khôi phục được ở Thùng rác |
| **Thùng rác** | Nơi liệt kê bản ghi đã xóa mềm để khôi phục (Cài đặt → Thùng rác) |
| **Backup tự động** | Bản sao file dữ liệu app tạo mỗi lần mở (bản exe), giữ 10 bản mới nhất trong `backups\` |
| **Backup** (`.p2cbackup`) | File chứa toàn bộ dữ liệu, xuất / nhập ở Cài đặt → Dữ liệu; dùng để chuyển dữ liệu giữa hai máy |
| **Schema** | Phiên bản cấu trúc file dữ liệu. App đọc được file schema cũ hơn, không đọc file của bản app mới hơn |

[← 10. Khi có lỗi](10-su-co.md) · [Mục lục](README.md)
