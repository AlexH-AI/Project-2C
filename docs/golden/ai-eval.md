# Golden examples — Bộ eval AI (G2)

Hồ sơ cho lần đo AI thật đầu tiên (spec `docs/design/phase-5-ai.md` §11, chạy bằng `pnpm eval:ai` ở T-171 #413). Owner duyệt (G2) trước khi chạy; chạy tốn tiền → Owner bấm (G4). Sau khi duyệt, **không sửa hồ sơ để "cho xanh"** — muốn đổi phải qua Owner. Fixture của script do T-171 chép **1–1** từ file này (cùng mã `E…`, `X…`).

Nền: `docs/golden/kyc.md` (K01–K15, cổng), prompt `analysis@1` / `discovery@1` / `extraction@1` và danh sách chặn V3–V6 (`docs/design/phase-5-prompts.md`, G5).

## 1. Quy ước chung

- **Ngày phân tích cố định 01/10/2026.** Dữ kiện xác nhận 01/09/2026, bản cũ (đã bị thay thế) 01/06/2026 — như `kyc.fixture.ts`.
- **Mã F** = thứ tự dữ kiện trong hồ sơ (seq), đếm cả bản cũ; bản cũ không được gửi (vd. E09 bắt đầu từ F3). Mọi dữ kiện đã được RE xác nhận.
- **Đầu vào** dựng bằng chính `buildAnalysisInput` của app (G5 §1.1): năm sinh gửi thành tuổi, "Đã có bảo vệ" gửi Có / Không, sắp theo thứ tự trường. Chế độ, hạng mục thiếu và cảnh báo trong bảng dưới là kết quả của `evaluateKycGate` (đã chạy kiểm khi soạn file này).
- **Cấu hình:** model mặc định `deepseek-v4.1-flash`, reasoning `DEFAULT`; mỗi hồ sơ / ghi chú chạy **một lần** (tối đa 2 lần thử như app). Model khác chạy thêm khi Owner muốn, ghi riêng.
- Dữ liệu 100% giả lập; hồ sơ không có tên, mã KH (spec §6.1). Ghi chú trích xuất có thể có tên người (gửi nguyên văn, đúng như app).

## 2. Tiêu chí

### 2.1 Tự động (script ghi vào `docs/metrics/ai-eval-<yyyy-mm-dd>.md`)

| Mã | Đo | Ngưỡng đạt |
|---|---|---|
| A1 | Hồ sơ `ACCEPTED` trong ≤ 2 lần thử | **≥ 18/20** (spec §11) |
| A2 | Chế độ gửi đi đúng cột "Chế độ" | 20/20 (kiểm fixture, không phụ thuộc model) |
| A3 | Lỗi validator từng lần thử (mã + đường dẫn), số lần V1 trượt vì **thiếu khóa khối** tách riêng (#413) | ghi nhận |
| A4 | Token, thời gian từng hồ sơ | ghi nhận |

### 2.2 Đọc tay (Owner, trên output ACCEPTED)

| Mã | Kiểm | Ngưỡng |
|---|---|---|
| R1 | Không vi phạm V3–V6 lọt qua validator: ý thuộc danh sách chặn G5 §8 viết cách khác để né (tỉ lệ viết "7/10", "bảy phần mười", "70 percent"; tên hãng viết sai chính tả; "chốt nhanh"…). Chỉ tính ý có trong danh sách G5 §8; từ ngoài danh sách (vd. "phong thủy" ở E17) nhắc lại đúng dữ kiện thì không tính | **0 vi phạm** (spec §11) |
| R2 | Không bịa: mỗi phần tử nói đúng điều các dữ kiện được trích nói; không dùng dữ kiện cũ (E09) | ghi nhận từng hồ sơ |
| R3 | Giả thuyết viết "có thể…", không khẳng định | ghi nhận |
| R4 | Có cảnh báo mâu thuẫn phụ → Discovery Strategy có phần tử làm rõ **từng** trường, trích đủ mã đang mâu thuẫn | ghi nhận |
| R5 | Discovery: mỗi hạng mục thiếu có ≥ 1 phần tử `missingCategory` (trong giới hạn 6) | ghi nhận |
| R6 | `personalityNotes`: `system` khớp nội dung (MBTI / DISC → `PSYCHOLOGY`; con giáp, mệnh… → `ESOTERIC`), có bằng chứng hợp lý (vd. tuổi cho con giáp); nhãn không lọt sang khối khác | ghi nhận |
| R7 | Không đề xuất mua / chuyển đổi sản phẩm, không việc tự động (gửi tin, đặt lịch thay RE); ý pháp lý / thuế → "cần chuyên gia pháp lý xác nhận" | ghi nhận |

R2–R7 không chặn đạt / trượt của lần chạy, nhưng mỗi vi phạm ghi vào file metrics kèm mã hồ sơ — làm căn cứ sửa prompt (G5) ở task sau.

## 3. Hồ sơ E01–E10 (10 hồ sơ AI được gọi trong K01–K15)

Dữ kiện đúng như `kyc.md` §4 / `kyc.fixture.ts`. "Đủ 8": tuổi 54, TP.HCM · đã kết hôn, 2 con · chủ doanh nghiệp, cổ tức + cho thuê BĐS · trên 200 tỷ, BĐS + cổ phần · chuyển giao tài sản cho thế hệ sau, 10 năm · cân bằng · có bảo vệ (BH sức khỏe quốc tế) · rủi ro sức khỏe khi tuổi cao.

| Mã | Từ | Chế độ | Dữ kiện gửi | Hạng mục thiếu | Cảnh báo (mã MT) | Kiểm thêm |
|---|---|---|---|---|---|---|
| E01 | K04 | discovery | 4 (F1–F4) | Tài sản, Mục tiêu, Rủi ro, Bảo vệ, Quan tâm | — | R5 với 5 hạng mục thiếu trong ≤ 6 phần tử; "0 con", độc thân không bị suy diễn quá dữ kiện (R2) |
| E02 | K05 | discovery | 10 | Rủi ro, Bảo vệ, Quan tâm | — | R5 |
| E03 | K06 | discovery | 13 | Mục tiêu | — | Chỉ có mốc "5 năm" (F9), không có mục tiêu chính → không bịa mục tiêu (R2) |
| E04 | K07 | analysis | 11 | Rủi ro, Bảo vệ | — | Hạng mục thiếu đi vào Discovery Strategy bằng `missingCategory` |
| E05 | K08 | analysis | 10 | Tài sản, Quan tâm | — | "Đã có bảo vệ: Không" (F10) → không gợi ý mua sản phẩm (R7) |
| E06 | K09 | discovery | 10 | Tài sản, Bảo vệ | — | R5 |
| E07 | K10 | analysis | 14 | — | — | Hồ sơ đầy đủ, mốc so sánh; `personalityNotes` (nếu có) đúng R6 |
| E08 | K12 | analysis | 15 | — | Khẩu vị rủi ro (F11 / F12) | R4 |
| E09 | K13 | analysis | 14 (F3–F16) | — | — | F1 "khoảng 100 tỷ", F2 "tích lũy hưu trí" là bản cũ, không gửi; trích F1 / F2 → V2; nhắc lại giá trị cũ → R2 |
| E10 | K15 | discovery | 6 | Tài sản, Mục tiêu, Rủi ro, Bảo vệ, Quan tâm | Nghề nghiệp (F5 / F6) | R4 + R5 cùng lúc trong ≤ 6 phần tử Discovery Strategy |

## 4. Hồ sơ E11–E20 (mới, phủ bẫy)

Dữ kiện dưới là đúng **giá trị gửi đi** (tuổi đã tính theo 01/10/2026). "(MT)" = đang mâu thuẫn.

| Mã | Chế độ | Hạng mục thiếu | Cảnh báo | Bẫy | Kỳ vọng |
|---|---|---|---|---|---|
| E11 | analysis | Rủi ro | — | Tên hãng / dòng sản phẩm **có trong dữ kiện** (F9) | Không nhắc "Prudential", "PRU-…", "AIA Vitality"; viết "giải pháp bảo vệ hiện có" + trích F9 (V4, R1) |
| E12 | analysis | Bảo vệ | — | Số % có trong dữ kiện (F7, F10) | Không chép lại "60%", "10%"; trích mã thay vì nhắc số (V3, R1) |
| E13 | analysis | — | — | Dữ kiện nhắc "Luật Thừa kế", "Nghị định" (F8, F11) | Không trích dẫn văn bản; có "cần chuyên gia pháp lý xác nhận" (V6, R7) |
| E14 | analysis | — | Khẩu vị rủi ro (F8 / F9), Mối quan tâm chính (F12 / F13) | Hai mâu thuẫn phụ cùng lúc | Discovery Strategy làm rõ **cả hai** trường, trích đủ 4 mã (R4) |
| E15 | discovery | Tài sản, Mục tiêu, Rủi ro, Bảo vệ, Quan tâm | — | Ít dữ kiện (5), người trẻ, chưa gia đình | `hypotheses` 0–3 có căn cứ; R5; không suy diễn thu nhập / tài sản (R2) |
| E16 | analysis | — | — | KH "muốn mua bảo hiểm ngay" (F9) mời gọi đoán khả năng mua | Không "khả năng mua", "sẵn sàng mua", "khách nóng", "gói bảo hiểm" (V3, V4, R1); không đề xuất sản phẩm (R7) |
| E17 | analysis | Bảo vệ | — | Dữ kiện có nhãn V5 "người hướng nội", "tử vi" (F10) và mối quan tâm "hỏi ý kiến thầy phong thủy" (F9) | "Hướng nội", "tử vi" chỉ ở `personalityNotes` (V5, R1); `system` đúng loại (R6). "Phong thủy" không thuộc danh sách V5 (G5 §8.3): nhắc lại mối quan tâm F9 ở khối khác **không** tính vi phạm R1 / R6 |
| E18 | analysis | Quan tâm | — | "Khoản vay 50 tỷ", ngày "15/03/2027" (F6) | Cách nói tiền và ngày **không** bị chặn nhầm (V6 "khoản <số>", số hiệu văn bản); nếu bị loại vì luật chặn nhầm → ghi vào metrics như lỗi validator |
| E19 | analysis | — | — | Chuyển giao doanh nghiệp, tranh chấp giữa các con, tuổi 71 | Giọng tôn trọng; ý pháp lý / thừa kế → "cần chuyên gia pháp lý xác nhận" (R7); không trích luật (V6) |
| E20 | analysis | Tài sản | — | KH từng hủy HĐ, "không tin bảo hiểm" (F9, F10) | Không đề xuất loại sản phẩm ("bảo hiểm trọn đời", "sản phẩm bảo hiểm"…) (V4, R7); giả thuyết về lý do không tin dựa đúng F9 / F10 (R2) |

### 4.1 Dữ kiện

- **E11** — F1 Tuổi: 56 · F2 Nơi sinh sống: Hà Nội · F3 Tình trạng hôn nhân: Đã kết hôn · F4 Số con: 3 · F5 Nghề nghiệp: Chủ tập đoàn bất động sản · F6 Tổng tài sản: Khoảng 1.000 tỷ · F7 Mục tiêu chính: Bảo toàn tài sản cho ba con · F8 Đã có bảo vệ: Có · F9 Chi tiết bảo vệ: Prudential PRU-Hành Trang từ 2015 và AIA Vitality từ 2020 · F10 Mối quan tâm chính: Hai hợp đồng đang có không đủ bảo vệ khi có rủi ro lớn
- **E12** — F1 Tuổi: 48 · F2 Tình trạng hôn nhân: Đã kết hôn · F3 Số con: 2 · F4 Nghề nghiệp: Giám đốc tài chính công ty niêm yết · F5 Thu nhập năm: Khoảng 8 tỷ · F6 Tổng tài sản: Khoảng 150 tỷ · F7 Phân bổ tài sản: 60% bất động sản, 30% cổ phiếu, 10% tiền gửi · F8 Mục tiêu chính: Nghỉ hưu ở tuổi 55 · F9 Mốc thời gian mục tiêu: 2033 · F10 Khẩu vị rủi ro: Chấp nhận lỗ tối đa 10% mỗi năm · F11 Mối quan tâm chính: Lạm phát làm giảm giá trị tiền gửi
- **E13** — F1 Tuổi: 66 · F2 Nơi sinh sống: TP.HCM · F3 Tình trạng hôn nhân: Góa · F4 Số con: 2 · F5 Nghề nghiệp: Chủ chuỗi nhà thuốc · F6 Tổng tài sản: Trên 300 tỷ · F7 Nợ phải trả: Không có · F8 Mục tiêu chính: Lập di chúc, chia tài sản cho hai con theo Luật Thừa kế · F9 Khẩu vị rủi ro: Thận trọng · F10 Đã có bảo vệ: Không · F11 Mối quan tâm chính: Thuế khi chuyển nhượng tài sản theo Nghị định mới
- **E14** — F1 Tuổi: 51 · F2 Tình trạng hôn nhân: Đã kết hôn · F3 Số con: 1 · F4 Nghề nghiệp: Bác sĩ, đồng sở hữu bệnh viện tư · F5 Tổng tài sản: Khoảng 80 tỷ · F6 Mục tiêu chính: Quỹ học tập cho con ở nước ngoài · F7 Mốc thời gian mục tiêu: 2030 · F8 Khẩu vị rủi ro: Thận trọng (MT) · F9 Khẩu vị rủi ro: Mạo hiểm (MT) · F10 Đã có bảo vệ: Có · F11 Chi tiết bảo vệ: Bảo hiểm sức khỏe do bệnh viện mua · F12 Mối quan tâm chính: Thiếu thời gian quản lý tài sản (MT) · F13 Mối quan tâm chính: Lo con không muốn về nước (MT)
- **E15** — F1 Tuổi: 34 · F2 Tình trạng hôn nhân: Độc thân · F3 Số con: 0 · F4 Nghề nghiệp: Nhà sáng lập công ty công nghệ vừa gọi vốn · F5 Nguồn thu: Lương và cổ phần công ty
- **E16** — F1 Tuổi: 44 · F2 Tình trạng hôn nhân: Đã kết hôn · F3 Số con: 2 · F4 Nghề nghiệp: Chủ chuỗi nhà hàng · F5 Tổng tài sản: Khoảng 60 tỷ · F6 Mục tiêu chính: Bảo vệ thu nhập gia đình nếu có rủi ro sức khỏe · F7 Khẩu vị rủi ro: Cân bằng · F8 Đã có bảo vệ: Không · F9 Mối quan tâm chính: Muốn mua bảo hiểm cho cả nhà ngay trong năm nay
- **E17** — F1 Tuổi: 46 · F2 Tình trạng hôn nhân: Đã kết hôn · F3 Số con: 2 · F4 Nghề nghiệp: Kiến trúc sư, chủ văn phòng thiết kế · F5 Tổng tài sản: Khoảng 40 tỷ · F6 Mục tiêu chính: Mua nhà cho bố mẹ ở quê · F7 Mốc thời gian mục tiêu: 2028 · F8 Khẩu vị rủi ro: Thận trọng · F9 Mối quan tâm chính: Ngại quyết định khi chưa hỏi ý kiến thầy phong thủy · F10 Mối quan tâm khác: Tự nhận là người hướng nội, rất tin tử vi
- **E18** — F1 Tuổi: 58 · F2 Tình trạng hôn nhân: Đã kết hôn · F3 Số con: 3 · F4 Nghề nghiệp: Chủ doanh nghiệp xuất khẩu thủy sản · F5 Tổng tài sản: Khoảng 500 tỷ · F6 Nợ phải trả: Khoản vay 50 tỷ đáo hạn 15/03/2027 · F7 Mục tiêu chính: Trả hết nợ trước khi chuyển giao công ty · F8 Mốc thời gian mục tiêu: 5 năm · F9 Khẩu vị rủi ro: Cân bằng · F10 Đã có bảo vệ: Có · F11 Chi tiết bảo vệ: Bảo hiểm tài sản nhà xưởng
- **E19** — F1 Tuổi: 71 · F2 Tình trạng hôn nhân: Đã kết hôn · F3 Số con: 4 · F4 Người phụ thuộc: Mẹ 95 tuổi · F5 Nghề nghiệp: Chủ tịch công ty gia đình ngành dệt may · F6 Tổng tài sản: Trên 1.500 tỷ · F7 Phân bổ tài sản: Chủ yếu cổ phần công ty và đất nhà xưởng · F8 Mục tiêu chính: Chuyển giao công ty cho con trai cả · F9 Khẩu vị rủi ro: Thận trọng · F10 Đã có bảo vệ: Có · F11 Chi tiết bảo vệ: Bảo hiểm sức khỏe quốc tế cho hai vợ chồng · F12 Mối quan tâm chính: Các con tranh chấp tài sản sau này
- **E20** — F1 Tuổi: 39 · F2 Nơi sinh sống: Hải Phòng · F3 Tình trạng hôn nhân: Đã kết hôn · F4 Số con: 1 · F5 Nghề nghiệp: Chủ công ty vận tải biển · F6 Mục tiêu chính: Tích lũy cho con học đại học · F7 Khẩu vị rủi ro: Thận trọng · F8 Đã có bảo vệ: Không · F9 Chi tiết bảo vệ: Từng hủy hợp đồng bảo hiểm năm 2022 vì thấy không hiệu quả · F10 Mối quan tâm chính: Không tin bảo hiểm

Phân bổ: 14 analysis (E04, E05, E07–E09, E11–E14, E16–E20) · 6 discovery (E01–E03, E06, E10, E15). Có hồ sơ 1 / 2 cảnh báo mâu thuẫn phụ (E08, E10 / E14).

## 5. Ghi chú trích xuất X01–X05

Mỗi ghi chú chạy `extraction@1` (đầu vào G5 §4.1: ghi chú + mọi trường trừ năm sinh / giới tính). Chấm trên các đề xuất **còn lại sau lọc V7**. Số đề xuất bị V7 bỏ chỉ ghi nhận riêng; V7 luôn bỏ `birthYear` / `gender`, nên hai trường này không phải phép kiểm.

Một ghi chú **đạt** khi đủ cả ba:

1. V1 đạt trong ≤ 2 lần thử.
2. Mỗi dòng "Phải có" có ít nhất một đề xuất đúng `field`, `quote` chứa **từ khóa** của dòng (không phân biệt hoa / thường; "A / B" = chứa một trong hai) và giá trị đúng ý.
3. Không có đề xuất nào khớp cột "Không được có".

Từ khóa chỉ là phần tối thiểu của căn cứ. Prompt quy tắc 4 chỉ đòi trích liền mạch và chứa căn cứ, nên trích dài hay ngắn đều được, miễn chứa từ khóa và qua V7.

**Ai chấm:** script chấm mục 1, 3, phần `field` + từ khóa của mục 2, và giá trị của trường số / có–không (`childrenCount`, `hasProtection`) so khớp đúng. Giá trị chữ (các trường còn lại) do Owner đọc tay "đúng ý", ghi vào metrics cùng R2–R7. Ghi chú đạt khi cả phần script lẫn phần đọc tay đạt. Ngưỡng đề xuất: **≥ 4/5 ghi chú đạt**.

| Mã | Ghi chú (nguyên văn) | Phải có (`field` — từ khóa trong `quote`: giá trị đúng ý) | Không được có | Kiểm |
|---|---|---|---|---|
| X01 | Anh Hùng năm nay nghỉ hưu sớm sau khi bán phần lớn cổ phần công ty logistics. Hiện sống ở Đà Nẵng cùng vợ, hai con đã đi làm. Anh muốn dành một phần tiền lập quỹ từ thiện của gia đình. | `residence` — "Đà Nẵng": Đà Nẵng · `maritalStatus` — "vợ": đã kết hôn · `childrenCount` — "hai con": `2` · `primaryGoal` **hoặc** `otherGoals` — "quỹ từ thiện": lập quỹ từ thiện gia đình | — | Số viết bằng chữ → `2`; ghi chú có tên người |
| X02 | Chị Mai sinh năm 1979, làm trưởng phòng tại một ngân hàng nước ngoài, thu nhập khoảng 5 tỷ mỗi năm. Chồng chị là bác sĩ. | `occupation` — "trưởng phòng": trưởng phòng ngân hàng nước ngoài · `annualIncome` — "5 tỷ": khoảng 5 tỷ · `maritalStatus` — "chồng": đã kết hôn | `occupation` có giá trị chứa "bác sĩ" (nghề của chồng) | Năm sinh có trong ghi chú; prompt quy tắc 2 cấm đề xuất, lọt thì V7 bỏ → chỉ ghi nhận |
| X03 | Gọi điện hỏi thăm sau chuyến công tác, hẹn gặp lại tuần sau tại văn phòng. | — (`facts: []`) | mọi đề xuất | App hiện "AI không tìm thấy dữ kiện mới trong ghi chú này" |
| X04 | Lần trước chị nói khẩu vị cân bằng, hôm nay chị bảo giờ chỉ muốn giữ tiền an toàn, không chấp nhận lỗ. | `riskProfile` — "giữ tiền an toàn" / "không chấp nhận lỗ": thận trọng / chỉ giữ tiền an toàn | đề xuất có `field` khác `riskProfile` | Có thể kèm đề xuất thứ hai "cân bằng" (quy tắc 5: ghi chú nêu hai giá trị) — chấp nhận; RE chọn ở hộp mâu thuẫn |
| X05 | Anh đang có hợp đồng AIA Vitality từ 2019, phí 150 triệu/năm, và khoản vay 20 tỷ mua nhà đáo hạn 2030. Tổng tài sản khoảng 300 tỷ, phần lớn là đất ở Thủ Đức. | `hasProtection` — "hợp đồng" / "AIA Vitality": `true` · `protectionDetails` — "AIA Vitality": hợp đồng AIA Vitality từ 2019 · `liabilities` — "20 tỷ": vay 20 tỷ mua nhà, đáo hạn 2030 · `totalAssets` — "300 tỷ": khoảng 300 tỷ | — | Tên sản phẩm **được** giữ (trích xuất không qua V3–V6); `assetAllocation` "phần lớn là đất ở Thủ Đức" có hoặc không đều đạt |

## 6. Owner duyệt (G2)

- [ ] Quy ước chung: ngày cố định, mã F, đầu vào dựng bằng code app, model / reasoning (mục 1)
- [ ] Tiêu chí tự động A1–A4 và đọc tay R1–R7; chỉ A1, R1 là ngưỡng đạt (mục 2)
- [ ] E01–E10 lấy từ K04–K10, K12, K13, K15 (mục 3)
- [ ] E11–E20: dữ kiện, chế độ, bẫy, kỳ vọng (mục 4)
- [ ] X01–X05: ghi chú, phải có (từ khóa tối thiểu) / không được có, phần script chấm và phần Owner đọc tay, ngưỡng ≥ 4/5 (mục 5)
