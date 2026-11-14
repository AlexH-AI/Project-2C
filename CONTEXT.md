# CONTEXT — Thuật ngữ nghiệp vụ

Từ điển thuật ngữ dùng thống nhất trong issue, tài liệu và code. Định nghĩa gốc ở ADR (`docs/decisions/`); file này chỉ giải thích và trỏ tới nguồn. Tên trong code ghi trong ngoặc.

## Người và góc nhìn

- **RM** (`role: 'RM'`, Relationship Manager) — người tư vấn, phụ trách KH, cuộc hẹn và HĐ. Chỉ RM có chỉ số. Trước ngày 10/11/2026 vai trò này tên **RE** (Relationship Expert): "RE" trong tài liệu lịch sử (thân ADR, spec các phase, báo cáo review, file metrics) và trong file dữ liệu / backup cũ nghĩa là RM (spec `docs/design/phase-6-phan-hoi-dung-thu.md` §3; phụ lục 10/11/2026 của ADR-0004, ADR-0007).
- **TL / IS / BD / BDM** — người phối hợp trong cuộc hẹn (`coordinatorIds`); không có chỉ số riêng (ADR-0007, G2).
- **Team** (`Team`) — nhóm RM. RM thuộc team hiện tại; v1 không theo dõi lịch sử chuyển team.
- **Góc nhìn** (`Scope`) — Toàn bộ / Team / RM. Đây là cách xem dữ liệu, không phải tài khoản (ADR-0004).

## Khách hàng và vòng đời

- **KH** (`Customer`) — khách hàng, do một RM phụ trách.
- **Nhóm** (`CustomerStage`) — N4 → N3 → N2 → N1 (N1 gần chốt nhất), cộng hai trạng thái đóng **Tạm hoãn** (`ON_HOLD`) và **Mất cơ hội** (`LOST`). Được nâng, hạ, đóng; mở lại luôn về N3. KH mới chỉ được tạo ở nhóm mở, không tạo thẳng ở trạng thái đóng (ADR-0007).
  - **N4** — KH mới, thiếu thông tin KYC; hoặc đã có KYC và mục tiêu là khơi gợi nhu cầu.
  - **N3** — KH quan tâm, lắng nghe; khơi gợi nhu cầu thành công.
  - **N2** — KH được IS trình bày giải pháp cụ thể, hoặc được gửi giải pháp cụ thể.
  - **N1** — KH chấp nhận giải pháp, chưa chốt HĐ chỉ vì một số yếu tố: cân nhắc tài chính, thời gian, lý do khác.
  - Sau khi HĐ đã nộp, KH vẫn giữ nhóm và có thêm nhãn **"Đã có HĐ"** (số HĐ). Nhãn và số chỉ đếm HĐ chưa hủy: KH mà mọi HĐ đều đã hủy thì không còn nhãn. Hủy HĐ không đổi nhóm KH (ADR-0007, phụ lục HĐ hủy).
- **Chuyển nhóm** (`StageTransition`) — mỗi lần đổi nhóm là một sự kiện, có ngày và (nếu có) cuộc hẹn gây ra.
- **Cuộc hẹn** (`Appointment`) — trạng thái: Đã lên lịch (`SCHEDULED`) / Đã gặp (`MET`) / Dời lịch (`RESCHEDULED`) / KH hủy (`CANCELLED`) / Không gặp được (`NO_SHOW`). Kết quả có trường **nhóm sau cuộc gặp** (`stageAfter`), chỉ cuộc hẹn Đã gặp mới được ghi.
- **Sửa tay** — đổi nhóm ngoài cuộc gặp (vd. KH được gửi giải pháp, chuyển hóa qua điện thoại); không bao giờ tính RF.
- **Chuyển RF** (Refer) — cuộc hẹn Đã gặp mà nhóm sau cuộc gặp đưa KH từ N4/N3 lên N2/N1. Tính vào ngày gặp, tối đa 1 lần mỗi cuộc gặp, cho RM ghi trên cuộc hẹn (ADR-0007). RF chỉ đo hiệu quả cuộc gặp.

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
- **Lịch mang số** — trong các lịch thuộc Forecast của một KH, lịch có case size dự kiến được nhập (hay sửa) gần nhất; số của KH nằm ở ngày của lịch này và tính cho RM ghi trên lịch. **Lịch thiếu case size** — lịch thuộc Forecast chưa có số: đếm và liệt kê, không cộng.
- **Đã đạt** — Doanh số (FYP phát hành − FYP hủy) từ ngày 1 của tháng tới hôm nay. **Về đích** — đã đạt + Forecast tháng.
- **KPI tháng** (Owner gọi "chỉ tiêu (KPI)", "mục tiêu doanh số"; câu của Điểm nhấn viết "mục tiêu tháng") — mục tiêu Doanh số của một team cho một tháng, người dùng nhập. KPI của góc nhìn Toàn bộ = tổng KPI các team, chỉ khi mọi team chưa xóa có KPI của tháng đó (thiếu một team thì không có KPI toàn bộ); RM không có KPI; không có KPI tuần. **Nhịp cần mỗi tuần** — (KPI − đã đạt) ÷ số tuần còn lại của tháng, app tự tính. Chữ "KPI" trong chú thích code cũ chỉ các ô chỉ số của Tổng quan, không phải nghĩa này.

## Báo cáo (Phase 6 phần E; Owner duyệt G3 13/11/2026, T-424)

- **Bản tin** — mặt để đọc và gửi của màn Báo cáo: các trang có đầu thư cho một kỳ và một góc nhìn (tóm tắt, chi tiết từng RM và HĐ hủy, hoạt động, Xu hướng và định nghĩa); câu chữ viết từ số theo khuôn và theo bảng luật Điểm nhấn, không gọi AI. **Bản in** là chính các trang đó trên giấy sáng (A4 dọc); app không sinh file PDF.
- **Sổ số** — mặt để tra của màn Báo cáo: bốn số của góc nhìn, rồi năm bảng **Kết quả**, **Chuyển đổi**, **Lịch hẹn**, **Khách hàng**, **HĐ hủy**; dòng xếp theo team (team mở ra RM) hoặc **theo mốc** (7 ngày của tuần, các tuần của tháng, 12 tháng của năm).
- **Xu hướng** — 6 kỳ gần nhất cùng loại, kỳ đang xem đứng cuối; có ở kỳ Tuần / Tháng / Năm.

## KYC

- **Ghi chú KYC** (`KycNote`) — văn bản RM ghi, chỉ thêm, không sửa/xóa (ADR-0008), trừ khi dọn sạch Thùng rác xóa hẳn KH đã xóa (spec Phase 6 TR-11, phụ lục ADR-0008).
- **Dữ kiện KYC** (`KycFact`) — một giá trị có cấu trúc, **RM đã xác nhận**, trỏ về ghi chú nguồn. Trạng thái: còn hiệu lực (`active`) / đã bị thay thế (`superseded`) / mâu thuẫn (`conflict`).
- **Hạng mục KYC** (`KycCategory`) — 8 hạng mục lớn: Danh tính/tuổi, Gia đình, Nghề nghiệp/nguồn thu, Tài sản/AUM, Mục tiêu & mốc thời gian, Khẩu vị rủi ro, Bảo vệ hiện có, Mối quan tâm. (Trước gọi là "chiều" — không dùng nữa.)
- **Trường** (`KycField`) — mục nhỏ trong hạng mục (vd. năm sinh, số con).
- **Trường chính** (`keyFields`) — trường bắt buộc có để hạng mục được tính **"đã có"**. Câu trả lời "không / chưa có" vẫn tính; trường đang mâu thuẫn vẫn tính.
- **Trường cốt lõi** (`core`) — năm sinh, tình trạng hôn nhân, số con, tổng tài sản/AUM, mục tiêu chính. Mâu thuẫn ở trường cốt lõi chặn AI; ở trường khác chỉ cảnh báo.
- **Mâu thuẫn** — hai dữ kiện đã xác nhận cùng trường, khác giá trị, đều chưa bị thay thế.
- **Cổng KYC** (`evaluateKycGate` → `KycGateResult`) — hàm thuần, chỉ đọc dữ kiện còn hiệu lực (`active` / `conflict`), không gọi AI. Trạng thái (`KycGateState`) theo ưu tiên `CONFLICT_RESOLUTION` > `KYC_INSUFFICIENT` > `PROFILE_DISCOVERY` > `PAIN_POINT_ANALYSIS`; ngưỡng ở ADR-0008 và `docs/golden/kyc.md`. Kết quả kèm hạng mục đã có / còn thiếu, trường mâu thuẫn cốt lõi / cảnh báo, câu hỏi gợi ý cho hạng mục thiếu, cờ **được gọi AI** (`aiAllowed`, chỉ ở hai trạng thái cuối) và thông điệp **"Cần chăm sóc, KYC thêm thông tin khách hàng"** khi `KYC_INSUFFICIENT`.
- **Phiên bản KYC** (`KycVersion`) — tạo khi tập dữ kiện còn hiệu lực đổi (so bằng hash). Cờ **material**: phiên bản đầu luôn bật; sau đó bật khi trường cốt lõi đổi, hoặc RM bật tay (không tắt được khi luật đã bật) (ADR-0008 §7).

## Dữ liệu

- **Xóa mềm** (`deleted_at`) — KH, cuộc hẹn, HĐ, nhân sự, team khi xóa chỉ bị ẩn khỏi danh sách và chỉ số, khôi phục được ở Thùng rác (spec Phase 3 D4).
- **Thùng rác** — Cài đặt → Thùng rác: liệt kê mọi bản ghi xóa mềm để khôi phục; không theo góc nhìn, không tự dọn (spec Phase 6 §4.2).
- **Dọn sạch Thùng rác** — nút xóa hẳn mọi bản ghi trong Thùng rác (trừ bản ghi còn được dữ liệu khác dùng tới, TR-12); hỏi trước, backup trước (bản exe), một transaction. Là cách duy nhất xóa hẳn bản ghi nghiệp vụ, kể cả ghi chú KYC, dữ kiện và phân tích AI của KH đã xóa (spec Phase 6 TR-11, phụ lục ADR-0008).

## Ngôn ngữ và thuật ngữ tiếng Anh (Phase 6 phần G; Owner duyệt G1 / G2 12/11/2026)

- **Ngôn ngữ** (`Language`: `vi` / `en`) — Tiếng Việt / English của giao diện. Lưu theo máy (bộ nhớ WebView, khóa `p2c.language`), không vào DB và backup; chưa lưu gì thì theo tiền tệ của dữ liệu: VND → Tiếng Việt, tiền tệ khác → English. Tiếng Việt chỉ dùng được với dữ liệu VND. Đổi ngôn ngữ = app lưu nốt rồi tải lại giao diện (ADR-0018 §1).
- **Bảng thuật ngữ tiếng Anh** — chữ English của giao diện, Owner duyệt 12/11/2026 (spec `docs/design/phase-6-phan-hoi-dung-thu.md` §11.6, chép vào đây ở G-01). Cột Tiếng Việt là chữ của app (`apps/desktop/src/i18n/vi.ts`), cộng chữ của các phần B–G chưa code. Câu chữ dài (câu hướng dẫn, câu lỗi) dịch ở các lượt dịch (G-12 … G-16), theo đúng các từ dưới đây, vào `apps/desktop/src/i18n/en.ts`. Khác bảng spec ở một dòng: "Ngôn ngữ / Language" giữ cả hai ngôn ngữ ở cả hai giao diện (G3 đợt f).

**Giữ nguyên ở cả hai ngôn ngữ:** Heritas L-CRM, FYP, KYC, KYC Intelligence, N1–N4, RM, TL, IS, BD, BDM, MTD, KPI, AUM, AI, Forecast, Case size, Team, Kanban, Trigger, Excel, ChatGPT, OpenCode, WorkBuddy.

**RF:** tiếng Việt vẫn viết "RF"; English viết "Referral" (Owner 12/11). Owner giải thích: "RF là chỉ đích danh chỉ số chuyển RF: nghĩa là IS got referred from RM. RM đã khơi gợi nhu cầu thành công, phối hợp với IS để trình bày giải pháp (tương ứng với chuyển lên N2)". Định nghĩa chỉ số không đổi (ADR-0007). Trigger "Giới thiệu từ KH" ("Customer referral") là nghĩa khác: KH giới thiệu một KH mới.

**Chữ "Hủy" có ba nghĩa, tiếng Anh tách ra:** nút đóng hộp thoại "Cancel"; lịch hẹn bị hủy "Cancelled"; hủy hợp đồng "Cancel policy", HĐ đã hủy "Cancelled".

**Chữ "Dự kiến" có hai nghĩa:** trạng thái lịch hẹn "Scheduled"; số tiền dự kiến của Forecast "Forecast" / "Expected".

Điều hướng và vỏ app:

| Tiếng Việt | English | Ghi chú |
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

| Tiếng Việt | English | Ghi chú |
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

| Tiếng Việt | English | Ghi chú |
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

| Tiếng Việt | English | Ghi chú |
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

| Tiếng Việt | English | Ghi chú |
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

| Tiếng Việt | English | Ghi chú |
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
| Chuyển RF | Referrals | Owner 12/11; Tỷ lệ chốt = HĐ phát hành ÷ Referrals |
| Tỷ lệ chốt | Close rate | |
| Tỷ lệ hủy | Cancellation rate | phần B |
| Chỉ số của kỳ | Period metrics | |

Forecast và mục tiêu (phần D):

| Tiếng Việt | English | Ghi chú |
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

| Tiếng Việt | English | Ghi chú |
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

| Tiếng Việt | English | Ghi chú |
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

| Tiếng Việt | English | Ghi chú |
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

| Tiếng Việt | English | Ghi chú |
|---|---|---|
| Dữ liệu | Data | |
| Xuất backup / Nhập backup | Export backup / Import backup | |
| Nạp lại dữ liệu giả lập | Reload sample data | |
| Thư mục dữ liệu | Data folder | |
| Thùng rác | Trash | |
| Khôi phục | Restore | |
| Dọn sạch Thùng rác | Empty Trash | |
| Ngôn ngữ / Language | Ngôn ngữ / Language | phần G; tên mục viết bằng cả hai ngôn ngữ ở cả hai giao diện, để người chọn nhầm ngôn ngữ vẫn tìm thấy (G3 đợt f 13/11/2026, phụ lục ADR-0018; bảng spec §11.6 ghi "Language") |
| Tiền tệ | Currency | phần G |
| Thiết lập ban đầu | Setup | phần G |
| Thiết lập lại từ đầu | Start over | phần G |
| Trắng / Dữ liệu mẫu / File backup | Start empty / Sample data / From a backup file | nguồn dữ liệu của wizard |

Nút và chữ chung:

| Tiếng Việt | English | Ghi chú |
|---|---|---|
| Lưu / Sửa / Xóa / Đóng | Save / Edit / Delete / Close | |
| Hủy | Cancel | nút đóng hộp thoại |
| Thêm | Add | |
| Không bắt buộc | Optional | |
| Hiện thêm / Đã hiện hết | Show more / All shown | chân bảng dài |
