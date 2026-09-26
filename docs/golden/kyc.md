# Golden examples — Cổng KYC (G2)

Bảng đối chiếu cho Owner duyệt. Khớp 1–1 với `packages/domain/src/kyc-catalog.ts` (danh mục, ngưỡng, câu hỏi) và `packages/domain/src/golden/kyc.fixture.ts` (hồ sơ mẫu, cùng mã `K…`). Sau khi Owner duyệt, bộ hồ sơ mẫu là test bắt buộc của cổng KYC (#33); **không sửa để "cho xanh"** — muốn đổi phải qua Owner. Đây cũng là nền cho bộ eval AI ~20 hồ sơ ở Phase 5.

Định nghĩa áp dụng: ADR-0008 (bản chốt G2, 26/09/2026).

## 1. Danh mục: hạng mục KYC, trường, trường chính

- **Hạng mục KYC** = 8 hạng mục lớn. **Trường** = mục nhỏ trong hạng mục. **Trường chính** = trường bắt buộc có để hạng mục được tính **"đã có"**.
- Hạng mục "đã có" khi trường chính có ≥ 1 dữ kiện **RE đã xác nhận, còn hiệu lực** (chưa bị thay thế). Câu trả lời "không / chưa có" vẫn tính; trường đang mâu thuẫn vẫn tính; chỉ dữ kiện mới nhất có hiệu lực, bản cũ là lịch sử.
- **Cốt lõi** = mâu thuẫn ở trường này → chặn AI (`CONFLICT_RESOLUTION`). Mâu thuẫn ở trường khác → AI vẫn chạy, kèm cảnh báo.

| # | Hạng mục KYC (mã) | Trường (mã) — **đậm** = trường chính, ★ = cốt lõi | "Đã có" khi |
|---|---|---|---|
| 1 | Danh tính / tuổi (`IDENTITY`) | **Năm sinh** ★ (`birthYear`) · Giới tính (`gender`) · Nơi sống (`residence`) | Có năm sinh |
| 2 | Gia đình (`FAMILY`) | **Tình trạng hôn nhân** ★ (`maritalStatus`) · **Số con** ★ (`childrenCount`) · Người phụ thuộc (`dependents`) | Có **cả** hôn nhân **và** số con |
| 3 | Nghề nghiệp / nguồn thu (`OCCUPATION_INCOME`) | **Nghề nghiệp** (`occupation`) · **Thu nhập năm** (`annualIncome`) · Nguồn thu (`incomeSources`) | Có nghề nghiệp **hoặc** thu nhập |
| 4 | Tài sản / AUM (`ASSETS`) | **Tổng tài sản / AUM** ★ (`totalAssets`) · Phân bổ tài sản (`assetAllocation`) · Khoản nợ (`liabilities`) | Có tổng tài sản |
| 5 | Mục tiêu & mốc thời gian (`GOALS`) | **Mục tiêu chính** ★ (`primaryGoal`) · Mốc thời gian (`goalHorizon`) · Mục tiêu khác (`otherGoals`) | Có mục tiêu chính |
| 6 | Khẩu vị rủi ro (`RISK_APPETITE`) | **Khẩu vị rủi ro** (`riskProfile`) · Kinh nghiệm đầu tư (`investmentExperience`) | Có khẩu vị rủi ro |
| 7 | Bảo vệ hiện có (`EXISTING_PROTECTION`) | **Đã có bảo vệ chưa** (`hasProtection`, có/không) · Chi tiết bảo vệ (`protectionDetails`) | Có câu trả lời có/không |
| 8 | Mối quan tâm (`CONCERNS`) | **Mối quan tâm chính** (`mainConcern`) · Mối quan tâm khác (`otherConcerns`) | Có mối quan tâm chính |

Trường cốt lõi (5): năm sinh; tình trạng hôn nhân; số con; tổng tài sản/AUM; mục tiêu chính.

## 2. Ngưỡng cổng

Xét theo thứ tự, gặp điều kiện đầu tiên thì dừng:

| # | Trạng thái | Điều kiện | Hành động |
|---|---|---|---|
| 1 | `CONFLICT_RESOLUTION` | Có trường **cốt lõi** đang mâu thuẫn (hai dữ kiện đã xác nhận cùng trường, khác giá trị, đều chưa bị thay thế) | Không gọi AI; liệt kê trường mâu thuẫn để RE xử lý |
| 2 | `KYC_INSUFFICIENT` | Thiếu một trong 3 hạng mục tối thiểu: Danh tính/tuổi, Gia đình, Nghề nghiệp/nguồn thu | Không gọi AI; hiện **"Cần chăm sóc, KYC thêm thông tin khách hàng"** + hạng mục thiếu + câu hỏi gợi ý |
| 3 | `PROFILE_DISCOVERY` | Đủ 3 hạng mục tối thiểu nhưng < 6/8 hạng mục, **hoặc** chưa có Mục tiêu, **hoặc** (đề xuất, xem dưới) chưa có cả Tài sản lẫn Bảo vệ hiện có | AI chế độ khai thác |
| 4 | `PAIN_POINT_ANALYSIS` | ≥ 6/8 hạng mục, có Mục tiêu, có Tài sản **hoặc** Bảo vệ hiện có | AI phân tích đầy đủ |

Mâu thuẫn ở trường không cốt lõi không đổi trạng thái; chỉ thêm cảnh báo.

> **Cần anh chốt — ca chưa có trong quyết định G2:** hồ sơ ≥ 6/8, có Mục tiêu, nhưng **không** có Tài sản **và không** có Bảo vệ hiện có (xem K09). Quyết định 4 không bắt ca này, quyết định 5 cũng không. Em đề xuất xếp vào **`PROFILE_DISCOVERY`** (AI khai thác tiếp tài sản/bảo vệ trước khi phân tích).

## 3. Câu hỏi gợi ý

Hiện cho mỗi hạng mục còn thiếu. Giọng văn tư vấn cho KH Ultra High Net Worth: tinh tế, tôn trọng, không dồn ép, không hỏi thẳng con số.

| Hạng mục | Câu hỏi gợi ý |
|---|---|
| Danh tính / tuổi | 1. Để các giải pháp đồng hành cùng anh/chị qua từng giai đoạn cuộc sống, anh/chị cho phép em được biết năm sinh của mình không ạ?<br>2. Hiện anh/chị và gia đình đang sinh sống và làm việc chủ yếu tại đâu ạ? |
| Gia đình | 1. Anh/chị có thể chia sẻ đôi nét về gia đình mình — hiện anh/chị đã lập gia đình chưa ạ?<br>2. Gia đình anh/chị đã có các cháu chưa ạ? Nếu có, các cháu đang ở độ tuổi nào?<br>3. Ngoài gia đình nhỏ, anh/chị có đang chăm lo cho ai khác, chẳng hạn bố mẹ hai bên, không ạ? |
| Nghề nghiệp / nguồn thu | 1. Công việc hay hoạt động kinh doanh chính của anh/chị hiện nay là gì ạ?<br>2. Nguồn thu của gia đình hiện đến chủ yếu từ doanh nghiệp, từ đầu tư hay từ công việc chuyên môn ạ? |
| Tài sản / AUM | 1. Tài sản của gia đình hiện được phân bổ chủ yếu vào những kênh nào — bất động sản, doanh nghiệp, chứng khoán hay tiền gửi ạ?<br>2. Để em đề xuất cấu trúc tương xứng, anh/chị có thể hình dung giúp em quy mô tài sản của gia đình đang ở khoảng nào không ạ?<br>3. Có tài sản nào anh/chị đặc biệt muốn gìn giữ hoặc chuyển giao cho thế hệ sau không ạ? |
| Mục tiêu & mốc thời gian | 1. Trong 5–10 năm tới, điều gì là ưu tiên lớn nhất của anh/chị cho bản thân và gia đình ạ?<br>2. Anh/chị có mốc thời gian nào đang hướng tới, như kế hoạch học tập của các cháu, nghỉ hưu hay chuyển giao doanh nghiệp không ạ? |
| Khẩu vị rủi ro | 1. Với các khoản đầu tư hiện tại, anh/chị thường ưu tiên sự ổn định hay sẵn sàng đón nhận biến động để hướng tới lợi nhuận cao hơn ạ?<br>2. Những lần thị trường điều chỉnh mạnh, anh/chị thường chọn cách ứng xử thế nào ạ? |
| Bảo vệ hiện có | 1. Hiện anh/chị và gia đình đã có những giải pháp bảo vệ nào, như bảo hiểm nhân thọ, sức khỏe hay quỹ dự phòng ạ?<br>2. Anh/chị thấy các giải pháp hiện có đã thật sự tương xứng với mong muốn của mình chưa, hay còn điểm nào anh/chị muốn xem lại ạ? |
| Mối quan tâm | 1. Khi nghĩ về tương lai tài chính của gia đình, điều gì khiến anh/chị trăn trở nhất ạ?<br>2. Nếu có một việc anh/chị mong được giải quyết trọn vẹn trong năm nay, đó sẽ là việc gì ạ? |

## 4. Hồ sơ mẫu

Mọi dữ kiện đều **đã được RE xác nhận**. "MT" = mâu thuẫn (hai dữ kiện cùng trường, khác giá trị, đều còn hiệu lực). "Cũ" = đã bị thay thế.

Bộ dữ kiện đầy đủ dùng lại ở nhiều hồ sơ ("đủ 8"): năm sinh 1972, nơi sống TP.HCM · đã kết hôn, 2 con · chủ doanh nghiệp, nguồn thu cổ tức + cho thuê BĐS · tổng tài sản trên 200 tỷ, phân bổ BĐS + cổ phần · mục tiêu chuyển giao tài sản cho thế hệ sau, mốc 10 năm · khẩu vị cân bằng · đã có bảo vệ (BH sức khỏe quốc tế) · mối quan tâm rủi ro sức khỏe khi tuổi cao.

| Mã | Dữ kiện | Đã có | Trạng thái mong đợi | Hạng mục thiếu | MT cốt lõi | Cảnh báo | Kiểm điều gì |
|---|---|---|---|---|---|---|---|
| K01 | (rỗng) | 0/8 | `KYC_INSUFFICIENT` | cả 8 | — | — | Hồ sơ rỗng |
| K02 | Danh tính; hôn nhân "đã kết hôn" + người phụ thuộc "bố mẹ hai bên" (**không** có số con); nghề nghiệp | 2/8 | `KYC_INSUFFICIENT` | Gia đình, Tài sản, Mục tiêu, Rủi ro, Bảo vệ, Quan tâm | — | — | Gia đình cần **cả** hôn nhân và số con |
| K03 | Giới tính + nơi sống (**không** có năm sinh); 7 hạng mục còn lại đủ | 7/8 | `KYC_INSUFFICIENT` | Danh tính | — | — | Thiếu hạng mục tối thiểu thắng độ phủ 7/8 |
| K04 | Năm sinh 1985; độc thân, **0 con**; thu nhập khoảng 12 tỷ (không ghi nghề) | 3/8 | `PROFILE_DISCOVERY` | Tài sản, Mục tiêu, Rủi ro, Bảo vệ, Quan tâm | — | — | Vừa chạm 3 hạng mục tối thiểu; "0 con" vẫn tính; thu nhập đủ thay nghề nghiệp |
| K05 | Danh tính, Gia đình, Nghề nghiệp, Tài sản, Mục tiêu | 5/8 | `PROFILE_DISCOVERY` | Rủi ro, Bảo vệ, Quan tâm | — | — | Có mục tiêu nhưng thiếu 1 hạng mục so với ngưỡng 6 |
| K06 | Đủ 8 trừ Mục tiêu: chỉ có mốc "5 năm", **không** có mục tiêu chính | 7/8 | `PROFILE_DISCOVERY` | Mục tiêu | — | — | Chưa có mục tiêu → khai thác dù 7/8 |
| K07 | Danh tính, Gia đình, Nghề nghiệp, Tài sản, Mục tiêu, Quan tâm | 6/8 | `PAIN_POINT_ANALYSIS` | Rủi ro, Bảo vệ | — | — | Vừa chạm ngưỡng 6/8, có tài sản |
| K08 | Danh tính, Gia đình, Nghề nghiệp, Mục tiêu, Rủi ro; bảo vệ = **"chưa có"** | 6/8 | `PAIN_POINT_ANALYSIS` | Tài sản, Quan tâm | — | — | "Chưa có bảo hiểm" vẫn tính là đã có hạng mục Bảo vệ |
| K09 | Danh tính, Gia đình, Nghề nghiệp, Mục tiêu, Rủi ro, Quan tâm | 6/8 | `PROFILE_DISCOVERY` *(đề xuất)* | Tài sản, Bảo vệ | — | — | **Ca cần anh chốt** (mục 2) |
| K10 | Đủ 8 | 8/8 | `PAIN_POINT_ANALYSIS` | — | — | — | Hồ sơ đầy đủ |
| K11 | Năm sinh **MT** 1972 / 1974; nghề nghiệp | 2/8 | `CONFLICT_RESOLUTION` | Gia đình, Tài sản, Mục tiêu, Rủi ro, Bảo vệ, Quan tâm | Năm sinh | — | Mâu thuẫn cốt lõi + thiếu dữ liệu → mâu thuẫn thắng |
| K12 | Đủ 8; khẩu vị rủi ro **MT** "thận trọng" / "cân bằng" | 8/8 | `PAIN_POINT_ANALYSIS` | — | — | Khẩu vị rủi ro | Mâu thuẫn phụ → vẫn phân tích, có cảnh báo |
| K13 | Đủ 8; thêm tổng tài sản **cũ** "khoảng 100 tỷ" và mục tiêu **cũ** "tích lũy hưu trí" | 8/8 | `PAIN_POINT_ANALYSIS` | — | — | — | Chỉ dữ kiện mới nhất có hiệu lực; bản cũ không tạo mâu thuẫn |
| K14 | Đủ 8; số con **MT** 2 / 3; khẩu vị rủi ro **MT** | 8/8 | `CONFLICT_RESOLUTION` | — | Số con | Khẩu vị rủi ro | Mâu thuẫn cốt lõi chặn AI kể cả hồ sơ đầy đủ; trường đang MT vẫn tính "đã có" |
| K15 | Danh tính; Gia đình; nghề nghiệp **MT** "bác sĩ" / "chủ chuỗi phòng khám" | 3/8 | `PROFILE_DISCOVERY` | Tài sản, Mục tiêu, Rủi ro, Bảo vệ, Quan tâm | — | Nghề nghiệp | Trường chính đang MT vẫn tính "đã có" → đủ 3 tối thiểu |

Đủ 4 trạng thái: `CONFLICT_RESOLUTION` (K11, K14) · `KYC_INSUFFICIENT` (K01–K03) · `PROFILE_DISCOVERY` (K04–K06, K09, K15) · `PAIN_POINT_ANALYSIS` (K07, K08, K10, K12, K13).

## 5. Owner duyệt

- [ ] Danh mục: hạng mục, trường, trường chính, trường cốt lõi (mục 1)
- [ ] Ngưỡng cổng (mục 2), gồm ca K09
- [ ] Câu hỏi gợi ý (mục 3)
- [ ] Hồ sơ mẫu K01–K15 và kết quả mong đợi (mục 4)
