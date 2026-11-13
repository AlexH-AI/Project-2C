# ADR-0007: Định nghĩa chỉ số và vòng đời khách hàng / hợp đồng

- **Trạng thái:** Accepted (G1) cho định nghĩa; golden examples + mô hình dữ liệu: Accepted (G2, 26/09/2026) — định nghĩa RF và tỉ lệ chốt đổi ở G2; phụ lục HĐ hủy (Phase 6 phần B): Accepted (G2, 13/11/2026); phụ lục Forecast (Phase 6 phần D): Accepted (G2, 13/11/2026)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §2.2 (W3, W4, W5, W8), §2.3, §4.4, §7 (Q3–Q7)
- **Commit / PR:** `20e9c5e` · G2: #28

## Bối cảnh

Chỉ số mơ hồ → hai người đọc ra hai con số khác nhau. Pipeline N4→N1 thiếu trạng thái cuối; kết quả cuộc gặp dạng văn bản tự do không thống kê được.

## Quyết định

**Vòng đời (Q7):**

- HĐ là thực thể riêng, chỉ `submitted → issued`. `submitted` = RE chốt thành công, KH **đã đóng phí**. Một KH có nhiều HĐ.
- Nhóm KH N4 → N3 → N2 → N1: được nâng, được **hạ**; thêm trạng thái đóng `ON_HOLD` (Tạm hoãn) / `LOST` (Mất cơ hội), mở lại được — mở lại luôn về **N3** (G2).
- Định nghĩa nhóm (G2):
  - **N4** — KH mới, thiếu thông tin KYC; hoặc đã có KYC và mục tiêu là khơi gợi nhu cầu.
  - **N3** — KH quan tâm, lắng nghe; khơi gợi nhu cầu thành công.
  - **N2** — KH được IS trình bày giải pháp cụ thể, hoặc được gửi giải pháp cụ thể.
  - **N1** — KH chấp nhận giải pháp, chưa chốt HĐ chỉ vì một số yếu tố: cân nhắc tài chính, thời gian, lý do khác.
- **Tạo KH mới chỉ ở nhóm mở** N4/N3/N2/N1, không tạo thẳng ở `ON_HOLD`/`LOST` (Owner chốt 26/09/2026). Hai trạng thái đóng nghĩa là đã từng theo đuổi rồi dừng; KH "sinh ra đã đóng" làm lệch chỉ số mất cơ hội và tỉ lệ chốt. Nhập dữ liệu cũ (KH đã mất từ trước) chưa xử lý — quyết riêng khi làm tính năng nhập dữ liệu (vd. đánh dấu là dữ liệu nhập, không tính vào chỉ số kỳ). Code: `assertValidTransition` (#27).
- Sau khi có HĐ: KH giữ nhóm + nhãn "Đã có HĐ" (số HĐ).
- Mọi lần chuyển nhóm lưu thành sự kiện `stage_transitions`.

**Chỉ số:**

| Chỉ số | Định nghĩa | Trạng thái |
|---|---|---|
| HĐ đã nộp | Số HĐ có `submitted_date` trong kỳ | Chốt (G2) |
| HĐ phát hành | Số HĐ có `issued_date` trong kỳ | Chốt (G2) |
| Case size | **Σ FYP** HĐ đã nộp trong kỳ (tổng, không trung bình) — Q6 | Chốt |
| Doanh số | **Σ issued FYP** theo `issued_date` — Q5. FYP phát hành mặc định = FYP nộp, Owner sửa tay được theo thực tế (G2 D) | Chốt |
| Tỉ lệ chốt | **Số HĐ có `issued_date` trong kỳ ÷ số cuộc gặp chuyển RF trong kỳ** — tỉ lệ chuyển hóa RF → HĐ phát hành. Kỳ = ngày/tuần/tháng/năm/tùy chọn, **không lũy kế**; như nhau cho RE và team; có thể > 100%; 0 RF → hiện "—" (G2 F, H — thay Q3/Q3c) | Chốt (G2) |
| Cuộc gặp chuyển RF (Refer) | Cuộc hẹn **Đã gặp** mà "nhóm sau cuộc gặp" của chính cuộc hẹn đó đưa KH từ **N4/N3** lên **N2/N1** (kể cả N4→N2, N4→N1). N4→N3 và N2→N1 không tính; hạ nhóm không tính; nâng lại sau khi hạ có tính; mở lại từ Tạm hoãn/Mất cơ hội về N3 không tính. Mỗi cuộc gặp tối đa 1 RF, tính vào ngày gặp; nâng nhóm sửa tay ngoài cuộc hẹn không tính (G2 B, C — thay Q4) | Chốt (G2) |
| Tuần | Thứ Hai → Chủ Nhật | Chốt (G2) |
| MTD | Ngày 1 của tháng → ngày đang xem | Chốt (G2) |

**Góc nhìn và vai trò (G2 E, G):**

- HĐ và KH tính cho **RE phụ trách ghi trên HĐ/KH**; chuyển RF tính cho **RE ghi trên cuộc hẹn** (`appointment.reId`); team = team **hiện tại** của RE (v1 không theo dõi lịch sử chuyển team).
- Chỉ **RE** có chỉ số. TL/IS/BD/BDM là người phối hợp trong cuộc hẹn; team đã có chỉ số tổng nên không tính riêng cho TL.

**Trạng thái cuộc hẹn (G2 B):** Đã lên lịch / Đã gặp / Dời lịch / KH hủy / Không gặp được. Chỉ **Đã gặp** được xét chuyển RF.

- **Chỉ cuộc hẹn Đã gặp mới được ghi "nhóm sau cuộc gặp"**; các trạng thái khác để trống (G2). Cuộc hẹn chưa diễn ra thì chưa trình bày giải pháp (điều kiện lên N2), KH vẫn ở nhóm cũ.
- KH đổi nhóm ngoài cuộc gặp — được **gửi** giải pháp, chuyển hóa qua điện thoại… — thì sửa nhóm bằng tay; sửa tay **không** tính RF. RF chỉ đo hiệu quả cuộc gặp.

**Nhập liệu:**

- Kết quả cuộc gặp = văn bản + **trường có cấu trúc bắt buộc** (trạng thái, nhóm sau cuộc gặp, case size dự kiến, việc tiếp theo) (W3).
- Ngày `dd/mm` mặc định năm hiện tại; luôn hiện ngày đầy đủ đã diễn giải; nếu đã qua > 60 ngày → gợi ý năm sau (W8). Đầu năm, ngày chưa tới mà cùng ngày năm trước mới qua ≤ 60 ngày → gợi ý năm trước (phụ lục 23/10/2026).

## Phương án đã cân nhắc

- Case size = trung bình — loại (Q6). Doanh số theo ngày nộp — loại (Q5).
- Tỉ lệ chốt = HĐ nộp lũy kế ÷ KH từng ở N2/N1 lũy kế (Q3, Q3c) — **thay ở G2** bằng HĐ phát hành ÷ RF trong cùng kỳ: đo trực tiếp hiệu quả chuyển RF thành HĐ, đọc được theo từng tuần/tháng.
- RF tính cả N4→N3 (Q4 cũ) — **thay ở G2**: chỉ lên N2/N1 mới là cơ hội thật.
- Theo dõi từ chối/hủy/pending HĐ — hoãn, ngoài v1.

## Lý do

Định nghĩa bằng **golden examples** biến thành unit test → con số không thể hiểu sai.

## Hệ quả

- Golden examples: `packages/domain/src/golden/metrics.fixture.ts`, bảng đối chiếu `docs/golden/chi-so.md` (Owner duyệt G2). Là test bắt buộc của stats engine; không sửa để "cho xanh".
- Mô hình dữ liệu cho chỉ số: `packages/domain/src/model.ts` (`Team`, `Person`, `Customer`, `StageTransition`, `Appointment`, `Policy`, `Scope`).
- Thực thể cốt lõi: `teams`, `people`, `customers`, `kyc_notes`, `kyc_facts`, `kyc_versions`, `stage_transitions`, `appointments`, `policies`, `ai_analyses`, `settings` — các thực thể dùng cho chỉ số chốt ở G2 (xem trên); KYC chốt ở ADR-0008 / #30.

## Phụ lục — G2 Phase 4 (Owner duyệt 03/10/2026, #253, PR #265)

Chi tiết + golden: `docs/design/phase-4-chi-so.md`, `docs/golden/lich-hen.md` (A01–A13), `docs/golden/kh-theo-nhom.md` (S01–S13). Định nghĩa trong bảng chỉ số ở trên không đổi; G01–G22 giữ nguyên.

- **Đếm lịch hẹn:** 4 nhóm — Đã gặp / Dời – hủy – không đến / **Chưa ghi kết quả** (Đã lên lịch, ngày trước hôm nay) / Dự kiến (Đã lên lịch, từ hôm nay). Mỗi mắt xích của chuỗi dời tính một lần ở kỳ của ngày mình; xóa lịch con → lịch gốc vẫn là Dời lịch. Góc nhìn theo RE trên cuộc hẹn.
- **KH theo nhóm:** ảnh chụp ở mốc (cuối kỳ; kỳ chưa hết → hôm nay), theo RE hiện tại của KH; KH đã xóa không tính. Tổng quan 4 ô N4–N1 + chart diễn biến; báo cáo thêm Tạm hoãn, Mất cơ hội.
- **Miền năm:** 1900–2100 (`MAX_YEAR = 2100`); kỳ luôn nằm trong miền, `PeriodPicker` tắt nút ở biên.
- **Tổng quan / Báo cáo:** kỳ chưa hết tính tới hôm nay (tháng = MTD); 6 ô KPI so với kỳ trước cùng số ngày; bảng So sánh team bấm xổ RE; báo cáo có bảng Theo mốc; dòng Tổng tính tỉ lệ chốt từ tổng (Σ PH ÷ Σ RF).

## Phụ lục — Ngày nhanh đầu năm (Owner duyệt 23/10/2026, T-291 #780)

Luật đã duyệt: "Gõ ngày nhanh đầu năm: nếu ngày đó năm nay chưa tới, mà năm trước mới qua không quá 60 ngày, thì gợi ý năm trước." Đối xứng với gợi ý năm sau của W8 (mục Nhập liệu ở trên) và của DR-39 (29/02 năm không nhuận).

- Chỉ khi gõ `dd/mm` không năm. "Chưa tới": sau hôm nay. "Không quá 60 ngày": từ cùng ngày năm trước tới hôm nay. Như gợi ý năm sau, app không tự đổi năm: hiện ngày đã hiểu kèm gợi ý, RE chọn.
- Câu gợi ý, đối xứng câu năm sau của mockup 6b ("<ngày> đã qua <n> ngày. Ý anh là <ngày năm sau>?"): "<dd/mm/yyyy> còn <n> ngày nữa. Ý anh là <dd/mm/yyyy năm trước>?", nút "Dùng <dd/mm/yyyy năm trước>". Ô nào có dòng hướng dẫn dưới gợi ý thì dòng đó là "App không tự đổi năm. Giữ nguyên là lịch hẹn năm nay."
- Ô có gợi ý: ô ngày đang có gợi ý năm sau mà có đường ghi một ngày đã qua: lịch hẹn mới (6b), và Dời lịch (6e) cả khi chưa tick "Nhập bù" lẫn khi đã tick. Ở 6e chưa tick "Nhập bù", bấm gợi ý thì ngày thành ngày đã qua: ô báo lỗi "đã qua" (`reschedule.past`: "… ngày đã qua chỉ dùng để nhập bù") và hiện ô "Nhập bù"; RE tự tick, app không tự tick, không tự đổi năm (Owner 25/10/2026, review #824 lần 3). Ô chỉ nhận ngày từ hôm nay (hẹn tiếp 6h) không gợi ý ngày năm trước, vì ngày đó đã qua và ô không có đường nhập bù. Ô chỉ nhận ngày đã qua (ngày tạo KH, chuyển nhóm tay, ngày nộp / phát hành HĐ, ngày ghi chú KYC) giữ như nay: ngày sau hôm nay báo lỗi và nhắc gõ đủ năm, nên không lưu nhầm năm. Ô ngày của hộp Sửa kết quả (6f, điền sẵn ngày cũ) giữ như nay, không gợi ý năm nào: ô này không có gợi ý năm sau, kể cả khi trạng thái KH hủy cho nhận ngày tương lai.
- Vd. hôm nay 02/01/2027: "28/12" → 28/12/2027, gợi ý 28/12/2026; "15/03" → 15/03/2027, không gợi ý; "28/12/2026" (có năm) → không gợi ý. Hai gợi ý không bao giờ cùng lúc: gợi ý năm sau cần ngày đã qua, gợi ý năm trước cần ngày chưa tới. "29/02" không có gợi ý năm trước: ngày đó cách đầu năm sau hơn 300 ngày.
- Luật chỉ thêm gợi ý: ngày đã hiểu, lỗi và gợi ý năm sau giữ như nay (các ca DR-39 giữ nguyên). Đã thử mọi chuỗi `d/m` (d 0–32, m 0–13) với mọi hôm nay từ 01/01/2026 tới 31/12/2029 (674 982 lần đọc): 7 320 lần có gợi ý năm trước, không lần nào cùng gợi ý năm sau, muộn nhất hôm nay 01/03 năm không nhuận (gõ "31/12").

## Phụ lục — HĐ hủy (Phase 6 phần B; Owner duyệt G2 13/11/2026, PR #1236)

Nguồn: phản hồi dùng thử của Owner ngày 10/11/2026 (ý 5, 6) và các câu trả lời cùng ngày, spec `docs/design/phase-6-phan-hoi-dung-thu.md` §1, §4; golden B: `docs/golden/chi-so.md` mục 4 (G23–G41, T-421 #1234).

Phụ lục này thêm trạng thái Đã hủy vào vòng đời HĐ (thân ghi "chỉ `submitted → issued`") và đổi nghĩa Doanh số (Q5 ở bảng chỉ số). Dòng "Theo dõi từ chối/hủy/pending HĐ — hoãn, ngoài v1" ở "Phương án đã cân nhắc" không còn đúng cho hủy; từ chối và pending vẫn ngoài v1. Các định nghĩa khác giữ nguyên; G01–G22 giữ nguyên số.

- **Vòng đời HĐ:** `submitted → issued → cancelled` (Đã nộp → Đã phát hành → Đã hủy). Chỉ HĐ đã phát hành mới hủy được; ngày hủy không trước ngày phát hành; FYP hủy bằng FYP phát hành, không nhập riêng. Hủy không đổi nhóm KH; nhãn "Đã có HĐ" và số HĐ trên thẻ KH không đếm HĐ hủy.
- **Kỳ:** HĐ hủy tính vào kỳ chứa **ngày hủy** (Owner: "Ngày hủy"). Số của kỳ đã qua không đổi khi có HĐ hủy về sau. Hệ quả đã biết: kỳ ngắn có thể ra tỷ lệ hủy trên 100% hay doanh số âm. Cách bị bỏ: trừ vào kỳ của ngày phát hành (tỷ lệ luôn ≤ 100%, nhưng số của kỳ đã qua tự đổi về sau).
- **Chỉ số.** Tên do Owner chốt: "Đồng ý nhưng dùng từ Tổng số HĐ (total policies), tương tự Doanh số (Total FYP = Total issued FYP - total cancelled FYP)".

| Chỉ số | Định nghĩa |
|---|---|
| HĐ phát hành | Giữ nguyên: số HĐ có `issued_date` trong kỳ, kể cả HĐ bị hủy sau đó |
| FYP phát hành | Σ issued FYP theo `issued_date` (Doanh số trước phụ lục này) |
| HĐ hủy | Số HĐ có `cancelled_date` trong kỳ |
| FYP hủy | Σ issued FYP của các HĐ có `cancelled_date` trong kỳ |
| Tổng số HĐ | HĐ phát hành − HĐ hủy; có thể âm |
| Doanh số | **FYP phát hành − FYP hủy**; có thể âm (thay Q5) |
| Tỷ lệ hủy | HĐ hủy ÷ HĐ phát hành, cùng kỳ, không lũy kế; 0 HĐ phát hành → "—"; có thể > 100%; dòng Tổng = Σ HĐ hủy ÷ Σ HĐ phát hành, không lấy trung bình |
| Tỷ lệ chốt | Giữ nguyên: HĐ phát hành ÷ chuyển RF, **không trừ HĐ hủy**. Tỷ lệ chốt đo hiệu quả chốt, Tỷ lệ hủy đo chất lượng |

- **Cách viết:** "Tỷ lệ hủy" và "Tỷ lệ chốt". Owner chọn ngày 13/11/2026 (PR #1236): "Tỷ". Thân ADR này giữ chữ "Tỉ lệ chốt" như đã viết.

- **Góc nhìn:** HĐ hủy tính cho RE ghi trên HĐ và team hiện tại của RE, như HĐ phát hành (G2 E).
- **Mô hình dữ liệu** (Claude đề xuất, Owner duyệt G2 13/11/2026; chi tiết và ví dụ ở golden mục 4.4):
  - cột `policies.cancelled_date` (trống = chưa hủy; trường `Policy.cancelledDate`); không có cột FYP hủy hay cột trạng thái, trạng thái suy từ ngày;
  - ràng buộc của bảng: ngày hủy chỉ có khi đã có ngày phát hành, không trước ngày phát hành; luật ngày khác như ngày phát hành (không sau hôm nay, miền năm 1900–2100);
  - bỏ hủy = xóa ngày hủy, HĐ trở lại Đã phát hành, không giữ dấu vết; hộp Sửa của HĐ đã hủy từ chối xóa ngày phát hành và đổi ngày phát hành sang sau ngày hủy; FYP hủy đổi theo FYP phát hành;
  - HĐ đã xóa (xóa mềm), hủy hay không, và HĐ của KH đã xóa không tính ở mọi chỉ số; khôi phục giữ ngày hủy;
  - nhập backup: ràng buộc trên áp cho mọi HĐ, luật 10 (không sau hôm nay) thêm ngày hủy của HĐ chưa xóa.
- **Duyệt G2:** Owner ngày 13/11/2026, PR #1236 (chat với phiên T-421 ở Home PC): "Duyệt G2 cả ba". Câu này duyệt dữ liệu kịch bản B, kết quả G23–G41 (cùng luật cột mới của G01–G22) và mô hình dữ liệu HĐ hủy.
- **Giao diện (G3 đợt f, T-425 #1250; Owner duyệt ngày 13/11/2026, PR #1251):** mockup `docs/design/mockups/huy-hd.html` vẽ nút "Hủy HĐ", hộp hủy, nhãn "Đã hủy {ngày}", hộp Sửa của HĐ đã hủy và số HĐ trên thẻ KH, theo đúng các luật trên. Owner chọn phương án đề xuất ở cả 9 điểm của mục `#ask` (nhãn nguyên văn ở spec `phase-6-phan-hoi-dung-thu.md` §8, gạch "G3 đợt f"): hộp hủy chỉ hỏi ngày hủy, mở sẵn hôm nay; báo trước bằng hai câu theo khuôn "Ảnh hưởng chỉ số" của hộp Sửa; hai nút "Đóng" và "Hủy HĐ"; dòng của HĐ đã hủy mang nhãn đỏ, chữ lùi lại; nút "Bỏ hủy" cạnh ô Ngày hủy của hộp Sửa, có hiệu lực khi Lưu. Không đổi định nghĩa hay mô hình dữ liệu nào.

## Phụ lục — Forecast (Phase 6 phần D; Owner duyệt G2 13/11/2026, PR #1243)

Nguồn: phản hồi dùng thử của Owner ngày 10/11/2026 (ý 4) và các câu trả lời 10 – 11/11/2026, spec `docs/design/phase-6-phan-hoi-dung-thu.md` §1, §6, §8 (gạch "Mục tiêu doanh số"); golden D: `docs/golden/forecast.md` (F01–F41); mockup `docs/design/mockups/forecast.html`.

Phụ lục này thêm một nhóm số mới, không đổi định nghĩa nào của thân ADR hay của phụ lục HĐ hủy. G01–G41 giữ nguyên số. Phần "Owner đã chốt" là quyết định của 10 – 11/11/2026; phần "đề xuất" Owner duyệt G2 ngày 13/11/2026 (T-423 #1242; câu duyệt ở cuối phụ lục).

- **Owner đã chốt:**
  - Forecast tuần: lịch hẹn từ hôm nay tới hết Thứ Bảy của tuần này. Forecast tháng: từ hôm nay tới hết tháng, chỉ Thứ Hai → Thứ Bảy (10/11, §6.1; D-c 11/11: "Em có thể bỏ CN").
  - Chỉ lịch Đã lên lịch, ngày từ hôm nay, của KH hiện ở N3 / N2 / N1. Số tiền là case size dự kiến của từng lịch, người dùng nhập; app không dùng AI hay thuật toán để ước tính (D-e).
  - Mỗi KH tính một lần, theo số nhập gần nhất: "Tính 1 lần, doanh số FC dựa trên số gần nhất nhập liệu vì có thể đó là điều chỉnh theo nhu cầu của KH" (D-a). Không nhân hệ số theo nhóm: "Không nhân" (D-d).
  - Forecast hiện dự kiến, đã đạt và KPI (D-b). KPI theo team, do người dùng nhập đầu tháng; KPI toàn bộ là "Tổng các team"; "Chỉ theo tháng"; RE không có KPI.

- **Claude đề xuất, Owner duyệt G2 13/11/2026** (định nghĩa đầy đủ và ví dụ ở golden D):

| Điều | Định nghĩa |
|---|---|
| Lịch trong Forecast | Cuộc hẹn chưa xóa, của KH chưa xóa, `SCHEDULED`, ngày ≥ hôm nay, không phải Chủ Nhật, KH hiện ở N3 / N2 / N1. Lịch của hôm nay vẫn tính tới khi ghi kết quả |
| Số của một KH | Case size của lịch có thời điểm nhập / sửa số gần nhất, chọn trên mọi lịch trong Forecast của KH; cùng thời điểm → ngày muộn hơn. Nằm ở ngày của lịch đó, tính cho RE ghi trên lịch đó, team hiện tại của RE |
| Forecast của một khoảng | Σ số của các KH có lịch mang số trong khoảng; team = Σ RE, toàn bộ = Σ team |
| Lịch thiếu case size | Lịch trong Forecast chưa có số: đếm, liệt kê, không cộng |
| Đã đạt · Về đích | Doanh số từ ngày 1 của tháng tới hôm nay · đã đạt + Forecast tháng |
| KPI toàn bộ | Σ KPI các team chưa xóa, chỉ khi mọi team đều có KPI của tháng đó |
| Nhịp cần mỗi tuần | (KPI − đã đạt) ÷ (số ngày Thứ Hai → Thứ Bảy từ hôm nay tới cuối tháng ÷ 6); không hiện khi đã đạt ≥ KPI hoặc còn dưới 6 ngày |

- **Mô hình dữ liệu** (Claude đề xuất, Owner duyệt G2 13/11/2026; chi tiết ở golden D mục 4):
  - case size dự kiến dùng lại cột `appointments.expected_case_size` (`Appointment.expectedCaseSize`), nay nhập được từ lúc đặt lịch; luật phí giữ nguyên (lớn hơn 0, tối đa 100 tỷ, hoặc để trống);
  - cột mới `appointments.expected_case_size_at` (`expectedCaseSizeAt`): thời điểm nhập / sửa số, có khi và chỉ khi có số, chỉ đổi khi số đổi; lịch có sẵn lấy `updated_at`;
  - dời lịch giữ nguyên số thì lịch mới mang cả số lẫn thời điểm; sửa số khi dời thì thời điểm là lúc dời;
  - bảng mới `team_targets` (`team_id`, `month` dạng `yyyy-mm`, `amount`): mỗi team mỗi tháng nhiều nhất một dòng, `amount` lớn hơn 0 và tối đa 1,000 tỷ; không có dòng = chưa đặt KPI; không lưu KPI tuần, KPI của RE, KPI toàn bộ;
  - KPI lưu theo từng tháng: tháng đã qua vẫn có KPI của nó, nên so được đã đạt với KPI ở kỳ Tháng đã qua (luật 4 của "Điểm nhấn", spec §8);
  - nhập backup: thời điểm nhập số đi cùng số; `team_targets` trỏ tới team có trong file, tháng đúng dạng, không trùng (team, tháng).

- **Duyệt G2:** Owner ngày 13/11/2026, PR #1243 (chat với phiên T-423 ở Home PC), trả lời chín điểm, điểm nào cũng chọn phương án đề xuất: "A · Một KH một số"; "Duyệt cả bảy" (bảy cách hiểu của D-a, D-b, D-c); "A · Có, theo công thức" (nhịp cần mỗi tuần); "A · Không nhận 0"; "A · Chỉ khi đủ mọi team" (KPI toàn bộ); "A · Mỗi tháng một KPI"; "Duyệt" (đã đạt vượt KPI, ba điều kiện biên của "Điểm nhấn"); "A · Mang cả thời điểm" (dời lịch); "Duyệt G2 cả ba". Câu cuối duyệt dữ liệu kịch bản D, kết quả F01–F41 và mô hình dữ liệu.
